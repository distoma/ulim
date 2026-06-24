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

const DOCUMENT_GUIDES = {
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

async function loadTrainingTexts(type) {
  const guide = DOCUMENT_GUIDES[type] || DOCUMENT_GUIDES["가정통신문"];
  const files = getTrainingRoots(guide)
    .flatMap((rootDir) => collectTrainingFiles(rootDir))
    .sort((a, b) => a.filePath.localeCompare(b.filePath, "ko"));
  const samples = [];
  const seen = new Set();
  for (const file of files) {
    if (seen.has(file.filePath)) continue;
    seen.add(file.filePath);
    if (samples.length >= 12) break;
    try {
      const buffer = fs.readFileSync(file.filePath);
      const texts = file.ext === ".pdf"
        ? await extractPdfTexts(buffer)
        : (await extractHwpxTexts(buffer)).texts;
      samples.push({
        fileName: path.relative(TRAINING_DOCS_DIR, file.filePath),
        fileType: file.ext.slice(1),
        texts: texts.slice(0, 30),
      });
    } catch (error) {
      console.warn("Training document parse failed", {
        fileName: path.relative(TRAINING_DOCS_DIR, file.filePath),
        fileType: file.ext.slice(1),
        message: error.message,
      });
    }
  }
  return samples;
}

function buildGeneratedContent({ type, date, target, prompt, trainingSamples }) {
  const guide = DOCUMENT_GUIDES[type] || DOCUMENT_GUIDES["가정통신문"];
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
    const cleanFileName = safeString(fileName, "template.hwpx");
    const cleanTarget = safeString(target, "이주 배경학생 및 학부모");
    const cleanPrompt = safeString(prompt, "학생의 언어 배경을 고려하여 쉬운 한국어 안내와 번역 지원을 함께 제공합니다.");

    if (!fileBase64 || typeof fileBase64 !== "string") {
      throw new HttpsError("invalid-argument", "HWPX 파일 데이터가 필요합니다.");
    }
    if (!cleanFileName.toLowerCase().endsWith(".hwpx")) {
      throw new HttpsError("invalid-argument", "현재는 .hwpx 양식 파일만 생성 대상으로 지원합니다.");
    }

    try {
      const inputBuffer = Buffer.from(fileBase64, "base64");
      if (inputBuffer.length > 8 * 1024 * 1024) {
        throw new HttpsError("invalid-argument", "HWPX 파일은 8MB 이하로 업로드해 주세요.");
      }
      const parsed = await extractHwpxTexts(inputBuffer);
      const trainingSamples = await loadTrainingTexts(docType);
      const content = buildGeneratedContent({
        type: docType,
        date: safeString(date, ""),
        target: cleanTarget,
        prompt: cleanPrompt,
        trainingSamples,
      });
      const modifiedXml = fillTextNodes(parsed.xml, content);
      parsed.zip.file(parsed.sectionName, modifiedXml);
      const outputBuffer = await parsed.zip.generateAsync({
        type: "nodebuffer",
        compression: "DEFLATE",
      });
      const preview = `${content.title}\n\n${content.paragraphs.join("\n")}`;
      return {
        fileName: makeOutputFileName(cleanFileName, docType),
        fileBase64: outputBuffer.toString("base64"),
        preview,
        analysis: {
          sectionName: parsed.sectionName,
          extractedTextCount: parsed.texts.length,
          trainingSampleCount: trainingSamples.length,
          trainingFileTypes: [...new Set(trainingSamples.map((sample) => sample.fileType))],
          trainingFolder: (DOCUMENT_GUIDES[docType] || DOCUMENT_GUIDES["가정통신문"]).slug,
        },
      };
    } catch (error) {
      if (error instanceof HttpsError) throw error;
      console.error("HWPX generation error", { message: error.message, stack: error.stack });
      throw new HttpsError("internal", `HWPX 문서 생성 중 오류가 발생했습니다: ${error.message}`);
    }
  }
);
