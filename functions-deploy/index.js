const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { TranslationServiceClient } = require("@google-cloud/translate").v3;
const JSZip = require("jszip");
const { PDFParse } = require("pdf-parse");
const fs = require("node:fs");
const path = require("node:path");

const PROJECT_ID = process.env.GCLOUD_PROJECT || "ulim-3f09e";
const LOCATION = "global";
const SUPPORTED_LANGS = new Set(["ko", "en", "ja", "zh", "vi", "th", "mn", "ru"]);

const translationClient = new TranslationServiceClient();
const TRAINING_DOCS_DIR = path.join(__dirname, "training-docs");
const TRAINING_MANIFEST_URL = process.env.TRAINING_MANIFEST_URL || "https://distoma.github.io/ulim/functions-deploy/training-docs/manifest.json";
const TRAINING_SITE_BASE_URL = process.env.TRAINING_SITE_BASE_URL || "https://distoma.github.io/ulim/";

function normalizeLang(lang) {
  return typeof lang === "string" && SUPPORTED_LANGS.has(lang) ? lang : null;
}

exports.translateMessage = onCall(
  {
    region: "asia-northeast3",
    timeoutSeconds: 60,
    memory: "256MiB",
  },
  async (request) => {
    const { text, sourceLang, targetLangs } = request.data || {};
    const trimmedText = typeof text === "string" ? text.trim() : "";
    const normalizedSource = normalizeLang(sourceLang);

    if (!trimmedText) {
      throw new HttpsError("invalid-argument", "text 필드가 필요합니다.");
    }
    if (trimmedText.length > 2000) {
      throw new HttpsError("invalid-argument", "번역할 글은 2,000자 이하로 입력해 주세요.");
    }
    if (!normalizedSource) {
      throw new HttpsError("invalid-argument", "지원하는 sourceLang 코드가 필요합니다.");
    }
    if (!Array.isArray(targetLangs) || targetLangs.length === 0) {
      throw new HttpsError("invalid-argument", "targetLangs 배열이 필요합니다.");
    }

    const targets = [...new Set(targetLangs)]
      .map(normalizeLang)
      .filter((lang) => lang && lang !== normalizedSource);

    const translations = {
      [normalizedSource]: trimmedText,
    };

    if (!targets.length) {
      return { translations };
    }

    const parent = `projects/${PROJECT_ID}/locations/${LOCATION}`;

    try {
      await Promise.all(
        targets.map(async (targetLang) => {
          const [response] = await translationClient.translateText({
            parent,
            contents: [trimmedText],
            mimeType: "text/plain",
            sourceLanguageCode: normalizedSource,
            targetLanguageCode: targetLang,
          });
          translations[targetLang] = response.translations?.[0]?.translatedText || trimmedText;
        })
      );

      return { translations };
    } catch (error) {
      console.error("Translation error", {
        message: error.message,
        code: error.code,
        details: error.details,
      });
      throw new HttpsError("internal", "번역 중 오류가 발생했습니다.");
    }
  }
);

const BASE_DOCUMENT_GUIDES = {
  "가정통신문": {
    slug: "family_notice",
    trainingRoots: [
      "family_notice",
      "001.다문화교육(온학교지원)/다문화관련 체험 가정통신문",
      "003.업무지원 학습용 공문자료/다문화관련 체험 가정통신문",
    ],
    titleSuffix: "안내",
    sections: ["안내 목적", "일시 및 대상", "주요 내용", "가정 협조 사항", "문의"],
  },
  "업무추진 계획": {
    slug: "work_plan",
    trainingRoots: [
      "work_plan",
      "003.업무지원 학습용 공문자료",
    ],
    titleSuffix: "업무추진 계획",
    sections: ["추진 배경", "목적", "방침", "세부 추진 내용", "역할 분담", "기대 효과"],
  },
  "교육주간 운영계획": {
    slug: "education_week",
    trainingRoots: [
      "education_week",
      "001.다문화교육(온학교지원)/다문화교육주간 운영계획",
      "003.업무지원 학습용 공문자료/다문화교육주간 운영계획",
    ],
    titleSuffix: "교육주간 운영계획",
    sections: ["운영 개요", "운영 목표", "기간 및 대상", "세부 프로그램", "안전 관리", "평가 및 환류"],
  },
  "학생 학습자료 제작": {
    slug: "learning_material",
    trainingRoots: [
      "learning_material",
      "001.다문화교육(온학교지원)/한국어교육 지도계획",
      "003.업무지원 학습용 공문자료/한국어교육 지도계획",
      "002.학생맞춤통합지원(온학교지원)",
    ],
    titleSuffix: "학습자료",
    sections: ["학습 목표", "핵심 개념", "쉬운 설명", "활동 과제", "확인 문제", "모국어 도움말"],
  },
  "상담 계획서": {
    slug: "counseling_plan",
    trainingRoots: [
      "counseling_plan",
      "002.학생맞춤통합지원(온학교지원)",
    ],
    titleSuffix: "상담 계획서",
    sections: ["상담 목적", "학생 현황", "상담 일정", "주요 질문", "지원 계획", "후속 확인"],
  },
  "다문화 학생 지원 계획": {
    slug: "multicultural_support",
    trainingRoots: [
      "multicultural_support",
      "001.다문화교육(온학교지원)",
      "003.업무지원 학습용 공문자료/다문화교육 운영계획",
      "003.업무지원 학습용 공문자료/한국어학급 운영 품의서",
    ],
    titleSuffix: "다문화 학생 지원 계획",
    sections: ["학생 현황", "지원 목표", "언어 지원", "교과 지원", "가정 연계", "점검 일정"],
  },
};

let trainingManifestCache = null;

function normalizeManifestGuide(type) {
  if (!type || !type.label) return null;
  return {
    slug: type.id || safeString(type.label).replace(/\s+/g, "_"),
    titleSuffix: type.titleSuffix || type.label,
    sections: Array.isArray(type.sections) && type.sections.length ? type.sections : BASE_DOCUMENT_GUIDES["업무추진 계획"].sections,
    purpose: type.purpose || "업로드된 학습자료의 문체와 구조를 참고해 행정 문서를 생성합니다.",
    checks: Array.isArray(type.checks) && type.checks.length ? type.checks : ["일정", "대상", "담당자", "예산", "붙임 자료"],
    trainingRoots: Array.isArray(type.trainingRoots) ? type.trainingRoots : [type.folder].filter(Boolean),
    trainingFiles: Array.isArray(type.files) ? type.files : [],
  };
}

async function loadTrainingManifest() {
  if (trainingManifestCache) return trainingManifestCache;
  try {
    const response = await fetch(TRAINING_MANIFEST_URL);
    if (!response.ok) throw new Error(`manifest ${response.status}`);
    trainingManifestCache = await response.json();
    return trainingManifestCache;
  } catch (error) {
    console.warn("Training manifest fetch failed. Falling back to local folders.", {
      url: TRAINING_MANIFEST_URL,
      message: error.message,
    });
    trainingManifestCache = { documentTypes: [] };
    return trainingManifestCache;
  }
}

async function getDocumentGuide(type) {
  if (BASE_DOCUMENT_GUIDES[type]) return BASE_DOCUMENT_GUIDES[type];
  const manifest = await loadTrainingManifest();
  const matched = (manifest.documentTypes || []).find((item) => item.label === type || item.id === type);
  return normalizeManifestGuide(matched) || BASE_DOCUMENT_GUIDES["가정통신문"];
}

function safeString(value, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function escapeXml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function decodeXmlText(value) {
  return String(value ?? "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

function extractTextsFromXml(xml) {
  const texts = [];
  const regex = /<hp:t\b[^>]*>([\s\S]*?)<\/hp:t>/g;
  let match;
  while ((match = regex.exec(xml))) {
    const text = decodeXmlText(match[1]).replace(/\s+/g, " ").trim();
    if (text) texts.push(text);
  }
  return texts;
}

async function extractHwpxTexts(buffer) {
  const zip = await JSZip.loadAsync(buffer);
  const sectionNames = Object.keys(zip.files)
    .filter((name) => /^Contents\/section\d+\.xml$/i.test(name))
    .sort();
  const sectionName = sectionNames[0];
  if (!sectionName) throw new Error("HWPX 본문 section XML을 찾을 수 없습니다.");
  const xml = await zip.file(sectionName).async("string");
  return { zip, sectionName, xml, texts: extractTextsFromXml(xml) };
}

function splitReferenceText(text) {
  return String(text || "")
    .replace(/\r/g, "\n")
    .split(/\n|(?<=다\.)\s+|(?<=요\.)\s+|(?<=니다\.)\s+/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter((line) => line.length >= 4)
    .slice(0, 40);
}

async function extractPdfTexts(buffer) {
  const parser = new PDFParse({ data: buffer });
  try {
    const result = await parser.getText();
    return splitReferenceText(result.text);
  } finally {
    if (typeof parser.destroy === "function") {
      await parser.destroy();
    }
  }
}

function collectTrainingFiles(rootDir, collected = []) {
  if (!fs.existsSync(rootDir)) return collected;
  const entries = fs.readdirSync(rootDir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      collectTrainingFiles(fullPath, collected);
      continue;
    }
    const ext = path.extname(entry.name).toLowerCase();
    if (ext === ".hwpx" || ext === ".pdf") {
      collected.push({ filePath: fullPath, fileName: entry.name, ext });
    }
  }
  return collected;
}

function getTrainingRoots(guide) {
  const roots = guide.trainingRoots || [guide.slug];
  return [...new Set(roots)].map((folder) => path.join(TRAINING_DOCS_DIR, folder));
}

function getLocalTrainingFiles(guide) {
  return getTrainingRoots(guide)
    .flatMap((rootDir) => collectTrainingFiles(rootDir))
    .sort((a, b) => a.filePath.localeCompare(b.filePath, "ko"))
    .map((file) => ({
      key: file.filePath,
      fileName: path.relative(TRAINING_DOCS_DIR, file.filePath),
      fileType: file.ext.slice(1),
      size: fs.statSync(file.filePath).size,
      loadBuffer: () => fs.readFileSync(file.filePath),
    }));
}

function getRemoteTrainingFiles(guide) {
  return (guide.trainingFiles || [])
    .filter((file) => file && (file.url || file.path) && ["hwpx", "pdf"].includes(file.type))
    .map((file) => ({
      key: file.url || file.path,
      fileName: file.path || file.name,
      fileType: file.type,
      size: Number(file.size) || 0,
      loadBuffer: () => fetchTrainingFileBuffer(file),
    }));
}

function buildTrainingFileUrls(file) {
  const urls = [];
  if (file.url) urls.push(file.url);
  if (file.path) {
    const normalizedUrl = new URL(
      String(file.path).normalize("NFC").split("/").map(encodeURIComponent).join("/"),
      TRAINING_SITE_BASE_URL
    ).href;
    urls.push(normalizedUrl);
  }
  return [...new Set(urls)];
}

async function fetchTrainingFileBuffer(file) {
  const urls = buildTrainingFileUrls(file);
  let lastError = null;
  for (const fileUrl of urls) {
    try {
      const response = await fetch(fileUrl);
      if (response.ok) return Buffer.from(await response.arrayBuffer());
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error("학습자료 URL을 만들 수 없습니다.");
}

async function loadTrainingTexts(type, guide) {
  const files = [
    ...getRemoteTrainingFiles(guide),
    ...getLocalTrainingFiles(guide),
  ];
  const samples = [];
  const seen = new Set();
  for (const file of files) {
    if (seen.has(file.key)) continue;
    seen.add(file.key);
    if (samples.length >= 12) break;
    try {
      const buffer = await file.loadBuffer();
      const texts = file.fileType === "pdf"
        ? await extractPdfTexts(buffer)
        : (await extractHwpxTexts(buffer)).texts;
      samples.push({
        fileName: file.fileName,
        fileType: file.fileType,
        texts: texts.slice(0, 30),
      });
    } catch (error) {
      console.warn("Training document parse failed", {
        fileName: file.fileName,
        fileType: file.fileType,
        message: error.message,
      });
    }
  }
  return samples;
}

async function getFallbackHwpxTemplates(guide) {
  const directTemplates = [
    ...getRemoteTrainingFiles(guide),
    ...getLocalTrainingFiles(guide),
  ].filter((file) => file.fileType === "hwpx");
  if (directTemplates.length) return directTemplates;

  const manifest = await loadTrainingManifest();
  const manifestTemplates = (manifest.documentTypes || [])
    .flatMap((type) => normalizeManifestGuide(type)?.trainingFiles || [])
    .filter((file) => file && file.type === "hwpx")
    .map((file) => ({
      key: file.url || file.path,
      fileName: file.path || file.name,
      fileType: "hwpx",
      size: Number(file.size) || 0,
      loadBuffer: () => fetchTrainingFileBuffer(file),
    }));
  if (manifestTemplates.length) return manifestTemplates;

  return collectTrainingFiles(TRAINING_DOCS_DIR)
    .filter((file) => file.ext === ".hwpx")
    .map((file) => ({
      key: file.filePath,
      fileName: path.relative(TRAINING_DOCS_DIR, file.filePath),
      fileType: "hwpx",
      size: fs.statSync(file.filePath).size,
      loadBuffer: () => fs.readFileSync(file.filePath),
    }));
}

async function loadTemplateBuffer({ fileBase64, fileName, guide }) {
  if (fileBase64 && typeof fileBase64 === "string") {
    const cleanFileName = safeString(fileName, "uploaded-template.hwpx");
    if (!cleanFileName.toLowerCase().endsWith(".hwpx")) {
      throw new HttpsError("invalid-argument", "현재는 .hwpx 양식 파일만 생성 대상으로 지원합니다.");
    }
    const inputBuffer = Buffer.from(fileBase64, "base64");
    if (inputBuffer.length > 8 * 1024 * 1024) {
      throw new HttpsError("invalid-argument", "HWPX 파일은 8MB 이하로 업로드해 주세요.");
    }
    return {
      buffer: inputBuffer,
      fileName: cleanFileName,
      source: "uploaded",
    };
  }

  const templates = (await getFallbackHwpxTemplates(guide))
    .sort((a, b) => (a.size || Number.MAX_SAFE_INTEGER) - (b.size || Number.MAX_SAFE_INTEGER));
  const template = templates[0];
  if (!template) {
    throw new HttpsError("failed-precondition", "기본 양식으로 사용할 HWPX 학습자료를 찾을 수 없습니다.");
  }
  return {
    buffer: await template.loadBuffer(),
    fileName: path.basename(template.fileName || "ulim-template.hwpx"),
    source: "training",
    sourceName: template.fileName,
  };
}

function buildGeneratedContent({ type, date, target, prompt, trainingSamples, guide }) {
  const today = new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", timeZone: "Asia/Seoul" });
  const title = `${target} ${guide.titleSuffix}`;
  const issuedDate = date || today;
  const sampleHints = trainingSamples
    .flatMap((sample) => sample.texts)
    .filter((text) => text.length >= 4)
    .slice(0, 6);
  const paragraphs = [
    `${target}의 교육 활동과 학교생활 지원을 위해 다음과 같이 ${type}을(를) 안내드립니다.`,
    `▣ 일  시 : ${issuedDate}`,
    `▣ 대  상 : ${target}`,
    `▣ 주요 내용 : ${prompt}`,
    ...guide.sections.map((section) => `▣ ${section} : ${section}에 필요한 세부 내용을 학교 상황에 맞게 확인하여 반영합니다.`),
    "▣ 다국어 지원 : 이주 배경학생과 학부모가 이해하기 쉽도록 쉬운 한국어와 필요한 모국어 번역을 함께 제공합니다.",
    "▣ 유의 사항 : 개인정보는 최소한으로 사용하고, 일정·장소·문의처를 배부 전 다시 확인합니다.",
    sampleHints.length ? `▣ 참고 양식 반영 : ${sampleHints.join(" / ")}` : "▣ 참고 양식 반영 : 저장소의 업무별 학습자료 폴더에 HWPX 예시를 추가하면 문체와 항목을 더 가깝게 반영합니다.",
    `${issuedDate}`,
    "학교장",
  ];
  return { title, issuedDate, paragraphs, guide };
}

function replaceKnownPlaceholders(xml, content) {
  let output = xml;
  const replacements = [
    [/제목/g, content.title],
    [/2026년 0월 0일/g, content.issuedDate],
    [/2025년 0월 0일/g, content.issuedDate],
    [/20\d{2}년\s*\d{1,2}월\s*\d{1,2}일/g, content.issuedDate],
  ];
  replacements.forEach(([pattern, replacement]) => {
    output = output.replace(pattern, escapeXml(replacement));
  });
  return output;
}

function fillTextNodes(xml, content) {
  const paragraphs = [content.title, content.issuedDate, ...content.paragraphs].map(escapeXml);
  let index = 0;
  let replacedUsefulText = 0;
  const replaced = replaceKnownPlaceholders(xml, content).replace(/<hp:t\b([^>]*)>([\s\S]*?)<\/hp:t>/g, (full, attrs, inner) => {
    const plain = decodeXmlText(inner).trim();
    if (!plain || ["제목", "내용", "본문", "작성"].some((token) => plain.includes(token))) {
      const next = paragraphs[index++];
      if (next) return `<hp:t${attrs}>${next}</hp:t>`;
    }
    if (replacedUsefulText < paragraphs.length && plain.length > 8 && !plain.includes("학교장")) {
      replacedUsefulText += 1;
      const next = paragraphs[index++];
      if (next) return `<hp:t${attrs}>${next}</hp:t>`;
    }
    return full;
  });
  return replaced;
}

function makeOutputFileName(originalName, type) {
  const base = safeString(originalName, "ulim-template.hwpx").replace(/\.(hwpx|hwp|docx|txt)$/i, "");
  const stamp = new Date().toISOString().slice(0, 10);
  return `${base}_${type}_${stamp}.hwpx`.replace(/[\\/:*?"<>|]/g, "_");
}

exports.generateHwpxDocument = onCall(
  {
    region: "asia-northeast3",
    timeoutSeconds: 120,
    memory: "512MiB",
  },
  async (request) => {
    const { fileBase64, fileName, type, date, target, prompt } = request.data || {};
    const docType = safeString(type, "가정통신문");
    const cleanTarget = safeString(target, "이주 배경학생 및 학부모");
    const cleanPrompt = safeString(prompt, "학생의 언어 배경을 고려하여 쉬운 한국어 안내와 번역 지원을 함께 제공합니다.");

    try {
      const guide = await getDocumentGuide(docType);
      const template = await loadTemplateBuffer({ fileBase64, fileName, guide });
      const parsed = await extractHwpxTexts(template.buffer);
      const trainingSamples = await loadTrainingTexts(docType, guide);
      const content = buildGeneratedContent({
        type: docType,
        date: safeString(date, ""),
        target: cleanTarget,
        prompt: cleanPrompt,
        trainingSamples,
        guide,
      });
      const modifiedXml = fillTextNodes(parsed.xml, content);
      parsed.zip.file(parsed.sectionName, modifiedXml);
      const outputBuffer = await parsed.zip.generateAsync({
        type: "nodebuffer",
        compression: "STORE",
      });
      const preview = `${content.title}\n\n${content.paragraphs.join("\n")}`;
      return {
        fileName: makeOutputFileName(template.fileName, docType),
        fileBase64: outputBuffer.toString("base64"),
        preview,
        analysis: {
          sectionName: parsed.sectionName,
          extractedTextCount: parsed.texts.length,
          trainingSampleCount: trainingSamples.length,
          trainingFileTypes: [...new Set(trainingSamples.map((sample) => sample.fileType))],
          trainingFolder: guide.slug,
          templateSource: template.source,
          templateName: template.sourceName || template.fileName,
        },
      };
    } catch (error) {
      if (error instanceof HttpsError) throw error;
      console.error("HWPX generation error", { message: error.message, stack: error.stack });
      throw new HttpsError("internal", `HWPX 문서 생성 중 오류가 발생했습니다: ${error.message}`);
    }
  }
);
