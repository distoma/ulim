const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const trainingRoot = path.join(repoRoot, "functions-deploy", "training-docs");
const siteBaseUrl = "https://distoma.github.io/ulim/";

const sectionHints = {
  "가정통신문": {
    purpose: "학부모에게 체험, 신청, 준비물, 일정 등 안내 사항을 명확하게 전달",
    sections: ["제목", "안내 목적", "일시/장소", "대상", "세부 내용", "신청 방법", "가정 협조 사항", "문의"],
    checks: ["제출 기한", "준비물", "신청 방법", "학부모가 이해할 쉬운 문장"],
  },
  "계획": {
    purpose: "학교 업무의 목적, 방침, 세부 운영 절차를 체계적으로 정리",
    sections: ["추진 근거", "목적", "방침", "운영 개요", "세부 추진 계획", "예산", "기대 효과"],
    checks: ["운영 기간", "담당자", "대상 학생", "예산 또는 물품", "평가 및 환류"],
  },
  "품의서": {
    purpose: "예산 집행과 물품/강사비 지급 근거를 행정 문서 형식으로 정리",
    sections: ["건명", "집행 목적", "집행 근거", "세부 산출 내역", "지급 대상", "붙임"],
    checks: ["예산 과목", "금액", "지급 대상", "증빙 자료", "결재선"],
  },
  "강사채용": {
    purpose: "강사 채용 절차와 공고 내용을 학교 행정 문서 형식으로 정리",
    sections: ["채용 분야", "인원", "지원 자격", "접수 기간", "심사 일정", "제출 서류", "유의 사항"],
    checks: ["채용 기간", "자격 요건", "제출 서류", "심사 기준", "개인정보 수집 안내"],
  },
  "학생맞춤통합지원": {
    purpose: "학생별 필요를 파악하고 학교 안팎의 지원 자원을 연결하는 계획 수립",
    sections: ["지원 배경", "학생 현황", "지원 목표", "지원 내용", "협력 체계", "점검 일정", "기대 효과"],
    checks: ["개인정보 최소화", "지원 대상", "협력 기관", "후속 점검", "보호자 안내"],
  },
  "다문화교육": {
    purpose: "이주 배경학생의 학교 적응과 문화 다양성 교육 운영 계획 수립",
    sections: ["추진 배경", "목적", "운영 방침", "세부 프로그램", "언어 지원", "가정 연계", "평가"],
    checks: ["학생 언어 배경", "한국어 지원", "문화 다양성 요소", "학부모 소통", "안전 관리"],
  },
};

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(fullPath, files);
    else if ([".hwpx", ".pdf"].includes(path.extname(entry.name).toLowerCase())) files.push(fullPath);
  }
  return files;
}

function safeId(value) {
  return value
    .normalize("NFC")
    .replace(/\([^)]*\)/g, "")
    .replace(/^[0-9]+[._\s-]*/, "")
    .replace(/[^0-9A-Za-z가-힣]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();
}

function displayName(value) {
  return value.normalize("NFC").replace(/^[0-9]{3}\./, "").trim();
}

function inferGuide(label, categoryLabel) {
  const text = `${label} ${categoryLabel}`;
  const matched = Object.entries(sectionHints).find(([key]) => text.includes(key))?.[1] || sectionHints["계획"];
  return {
    purpose: matched.purpose,
    sections: matched.sections,
    checks: matched.checks,
  };
}

function fileInfo(filePath) {
  const relativePath = path.relative(repoRoot, filePath).split(path.sep).join("/");
  const ext = path.extname(filePath).toLowerCase().slice(1);
  const stat = fs.statSync(filePath);
  return {
    name: path.basename(filePath).normalize("NFC"),
    path: relativePath.normalize("NFC"),
    url: new URL(relativePath.split("/").map(encodeURIComponent).join("/"), siteBaseUrl).href,
    type: ext,
    size: stat.size,
  };
}

function buildManifest() {
  const categories = [];
  const documentTypes = [];
  const topFolders = fs.readdirSync(trainingRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^[0-9]{3}\./.test(entry.name))
    .sort((a, b) => a.name.localeCompare(b.name, "ko"));

  for (const top of topFolders) {
    const topPath = path.join(trainingRoot, top.name);
    const topLabel = top.name.normalize("NFC");
    const topDisplayLabel = displayName(topLabel);
    const category = {
      id: safeId(topLabel),
      label: topLabel,
      folder: path.relative(path.join(repoRoot, "functions-deploy", "training-docs"), topPath).split(path.sep).join("/").normalize("NFC"),
      documentTypes: [],
      fileCount: 0,
      hwpxCount: 0,
      pdfCount: 0,
    };

    const directFiles = fs.readdirSync(topPath, { withFileTypes: true })
      .filter((entry) => entry.isFile() && [".hwpx", ".pdf"].includes(path.extname(entry.name).toLowerCase()))
      .map((entry) => path.join(topPath, entry.name));
    if (directFiles.length) {
      const guide = inferGuide(topDisplayLabel, topLabel);
      const type = {
        id: safeId(topLabel),
        label: topDisplayLabel,
        category: topLabel,
        folder: category.folder,
        trainingRoots: [category.folder],
        titleSuffix: topDisplayLabel,
        ...guide,
        files: directFiles.map(fileInfo),
      };
      documentTypes.push(type);
      category.documentTypes.push({ id: type.id, label: type.label, folder: type.folder });
    }

    const childFolders = fs.readdirSync(topPath, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .sort((a, b) => a.name.localeCompare(b.name, "ko"));
    for (const child of childFolders) {
      const childPath = path.join(topPath, child.name);
      const files = walk(childPath);
      if (!files.length) continue;
      const folder = path.relative(path.join(repoRoot, "functions-deploy", "training-docs"), childPath).split(path.sep).join("/").normalize("NFC");
      const label = child.name.normalize("NFC");
      const guide = inferGuide(label, topLabel);
      const type = {
        id: safeId(`${topLabel}_${label}`),
        label,
        category: topLabel,
        folder,
        trainingRoots: [folder],
        titleSuffix: label,
        ...guide,
        files: files.map(fileInfo),
      };
      documentTypes.push(type);
      category.documentTypes.push({ id: type.id, label: type.label, folder: type.folder });
    }

    const allFiles = category.documentTypes.flatMap((typeRef) => {
      const fullType = documentTypes.find((type) => type.id === typeRef.id);
      return fullType ? fullType.files : [];
    });
    category.fileCount = allFiles.length;
    category.hwpxCount = allFiles.filter((file) => file.type === "hwpx").length;
    category.pdfCount = allFiles.filter((file) => file.type === "pdf").length;
    categories.push(category);
  }

  return {
    generatedAt: new Date().toISOString(),
    source: "functions-deploy/training-docs",
    siteBaseUrl,
    categories,
    documentTypes,
    totals: {
      categories: categories.length,
      documentTypes: documentTypes.length,
      files: documentTypes.reduce((sum, type) => sum + type.files.length, 0),
      hwpx: documentTypes.reduce((sum, type) => sum + type.files.filter((file) => file.type === "hwpx").length, 0),
      pdf: documentTypes.reduce((sum, type) => sum + type.files.filter((file) => file.type === "pdf").length, 0),
    },
  };
}

const manifest = buildManifest();
const outputPath = path.join(trainingRoot, "manifest.json");
fs.writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Wrote ${path.relative(repoRoot, outputPath)} with ${manifest.totals.documentTypes} document types and ${manifest.totals.files} files.`);
