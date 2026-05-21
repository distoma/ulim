let initializeApp;
let getFirestore;
let doc;
let getDoc;
let collection;
let addDoc;
let getDocs;
let serverTimestamp;
let query;
let orderBy;
let limit;
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

// Firebase 콘솔에서 복사한 웹 앱 설정을 여기에 넣으세요.
// 값이 비어 있으면 체험 계정과 localStorage로 동작합니다.
const firebaseConfig = {
  apiKey: "AIzaSyAn4ckyRiHxQvXSF-o5PKZunDBTvFVRw84",
  authDomain: "ulim-3f09e.firebaseapp.com",
  projectId: "ulim-3f09e",
  storageBucket: "ulim-3f09e.firebasestorage.app",
  messagingSenderId: "514608952885",
  appId: "1:514608952885:web:5129ce38df7ec5d20f637c"
};

const STORAGE_KEYS = {
  session: "ulim.session",
  checkins: "ulim.checkins",
  messages: "ulim.messages",
  documents: "ulim.documents"
};

const languageNames = {
  ko: "한국어",
  en: "English",
  ja: "日本語",
  zh: "中文",
  vi: "Tiếng Việt",
  th: "ไทย",
  mn: "Монгол",
  ru: "Русский"
};

const languageKoreanNames = {
  ko: "한국어",
  en: "영어",
  ja: "일본어",
  zh: "중국어",
  vi: "베트남어",
  th: "태국어",
  mn: "몽골어",
  ru: "러시아어"
};

const languageAliases = {
  한국어: "ko",
  영어: "en",
  English: "en",
  일본어: "ja",
  "日本語": "ja",
  중국어: "zh",
  "中文": "zh",
  베트남어: "vi",
  "Tiếng Việt": "vi",
  태국어: "th",
  "ไทย": "th",
  몽골어: "mn",
  "Монгол": "mn",
  러시아어: "ru",
  "Русский": "ru"
};

const menuTranslations = {
  student: {
    ko: "학생 도움",
    en: "Student Help",
    ja: "学生サポート",
    zh: "学生帮助",
    vi: "Hỗ trợ học sinh",
    th: "ความช่วยเหลือนักเรียน",
    mn: "Сурагчийн тусламж",
    ru: "Помощь ученику"
  },
  lounge: {
    ko: "다국어 대화",
    en: "Multilingual Chat",
    ja: "多言語会話",
    zh: "多语言交流",
    vi: "Trò chuyện đa ngôn ngữ",
    th: "สนทนาหลายภาษา",
    mn: "Олон хэлний яриа",
    ru: "Многоязычное общение"
  },
  teacher: {
    ko: "교사 관리",
    en: "Teacher Dashboard",
    ja: "教師管理",
    zh: "教师管理",
    vi: "Quản lý giáo viên",
    th: "จัดการครู",
    mn: "Багшийн удирдлага",
    ru: "Панель учителя"
  },
  aiDocs: {
    ko: "AI 행정",
    en: "AI Admin",
    ja: "AI事務",
    zh: "AI行政",
    vi: "Hành chính AI",
    th: "งานเอกสาร AI",
    mn: "AI захиргаа",
    ru: "AI-документы"
  }
};

const demoAccounts = {
  student01: { loginId: "student01", password: "1234", role: "student", name: "학생 체험", language: "한국어" },
  teacher01: { loginId: "teacher01", password: "1234", role: "teacher", name: "교사 체험", language: "한국어" }
};

const moods = ["매우 좋아요", "좋아요", "보통이에요", "걱정돼요", "힘들어요", "도움 필요"];
const defaultMessages = [
  { name: "린", lang: "베트남어", sourceLangCode: "vi", text: "Bạn có thể cho mình biết thực đơn hôm nay không?" },
  { name: "민수", lang: "한국어", sourceLangCode: "ko", text: "방과후 교실은 2층 도서실 옆에서 시작해요." },
  { name: "Sara", lang: "영어", sourceLangCode: "en", text: "What should I bring for tomorrow's club activity?" }
];

const translationMemory = {
  "Bạn có thể cho mình biết thực đơn hôm nay không?": {
    ko: "오늘 급식 메뉴를 알려 줄 수 있나요?",
    en: "Can you tell me today's lunch menu?",
    ja: "今日の給食メニューを教えてくれますか。",
    zh: "可以告诉我今天的午餐菜单吗？",
    vi: "Bạn có thể cho mình biết thực đơn hôm nay không?",
    th: "ช่วยบอกเมนูอาหารกลางวันวันนี้ให้ฉันได้ไหม",
    mn: "Өнөөдрийн өдрийн хоолны цэсийг хэлж өгч болох уу?",
    ru: "Можешь сказать, что сегодня на обед?"
  },
  "방과후 교실은 2층 도서실 옆에서 시작해요.": {
    ko: "방과후 교실은 2층 도서실 옆에서 시작해요.",
    en: "The after-school class starts next to the library on the second floor.",
    ja: "放課後教室は2階の図書室の隣で始まります。",
    zh: "课后教室在二楼图书室旁边开始。",
    vi: "Lớp sau giờ học bắt đầu cạnh thư viện ở tầng 2.",
    th: "ห้องเรียนหลังเลิกเรียนเริ่มที่ข้างห้องสมุดชั้น 2",
    mn: "Хичээлийн дараах анги 2 давхрын номын сангийн хажууд эхэлнэ.",
    ru: "Занятие после уроков начинается рядом с библиотекой на втором этаже."
  },
  "What should I bring for tomorrow's club activity?": {
    ko: "내일 동아리 활동 준비물이 궁금해요.",
    en: "What should I bring for tomorrow's club activity?",
    ja: "明日のクラブ活動には何を持って行けばいいですか。",
    zh: "明天社团活动需要带什么？",
    vi: "Ngày mai sinh hoạt câu lạc bộ cần mang gì?",
    th: "กิจกรรมชมรมพรุ่งนี้ต้องเตรียมอะไรไปบ้าง",
    mn: "Маргаашийн дугуйлангийн үйл ажиллагаанд юу авчрах вэ?",
    ru: "Что нужно принести на завтрашнее занятие кружка?"
  }
};
const defaultStudents = [
  { name: "린", lang: "베트남어", status: "도움 요청", note: "급식 적응 상담 필요" },
  { name: "샤오", lang: "중국어", status: "관찰 필요", note: "또래 관계 확인" },
  { name: "Sara", lang: "영어", status: "안정", note: "체크인 꾸준함" },
  { name: "바트", lang: "몽골어", status: "상담 예정", note: "학부모 통역 필요" },
  { name: "마리아", lang: "필리핀어", status: "안정", note: "방과후 참여" }
];
const cultureQuestions = [
  "우리 학교 급식 시간에는 어떻게 줄을 서면 좋을까요?",
  "친구에게 내 이름을 모국어로 소개한다면 어떻게 말하고 싶나요?",
  "수업 중 이해가 안 될 때 어떤 말로 도움을 요청하면 좋을까요?",
  "한국 학교에서 처음 어려웠던 점을 친구와 어떻게 나누면 좋을까요?",
  "우리 반에서 새 친구가 편안해지도록 할 수 있는 작은 행동은 무엇일까요?"
];

let db = null;
let currentUser = null;
let selectedMood = moods[2];
let activeFilter = "all";
let students = [...defaultStudents];
let firebaseAvailable = false;

const firebaseReady = Object.values(firebaseConfig).every(Boolean);
async function setupFirebase() {
  if (!firebaseReady) return;
  ({ initializeApp } = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js"));
  ({ getFirestore, doc, getDoc, collection, addDoc, getDocs, serverTimestamp, query, orderBy, limit } = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js"));
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  firebaseAvailable = true;
  $("#firebaseStatus").textContent = "Firebase Firestore 로그인으로 연결되어 있습니다.";
}

function loadJson(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; }
  catch { return fallback; }
}
function saveJson(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function showToast(text) {
  const toast = $("#toast");
  toast.textContent = text;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2600);
}

function normalizeLanguage(value) {
  return languageNames[value] ? value : languageAliases[value] || "ko";
}

function formatBilingual(menuKey, languageCode) {
  const korean = menuTranslations[menuKey].ko;
  const translated = menuTranslations[menuKey][languageCode] || korean;
  return languageCode === "ko" ? korean : `${translated} / ${korean}`;
}

function applyMenuLanguage(languageCode = "ko") {
  const normalized = normalizeLanguage(languageCode);
  $$("[data-menu-key]").forEach((item) => {
    item.textContent = formatBilingual(item.dataset.menuKey, normalized);
  });
  const appLanguage = $("#appLanguage");
  if (appLanguage) appLanguage.value = normalized;
  renderMessages();
}

function getViewerLanguageCode() {
  return normalizeLanguage(currentUser?.languageCode || $("#loginLanguage")?.value || "ko");
}

function getMessageSourceCode(message) {
  return normalizeLanguage(message.sourceLangCode || message.lang || "ko");
}

function getMessageTranslation(message, targetCode) {
  const normalizedTarget = normalizeLanguage(targetCode);
  const sourceText = message.text || "";
  if (message.translations?.[normalizedTarget]) return message.translations[normalizedTarget];
  if (translationMemory[sourceText]?.[normalizedTarget]) return translationMemory[sourceText][normalizedTarget];
  if (getMessageSourceCode(message) === normalizedTarget) return sourceText;
  return `[${languageNames[normalizedTarget]} 자동 번역 준비 중] ${sourceText}`;
}

function buildTranslationBundle(text, sourceCode) {
  const normalizedSource = normalizeLanguage(sourceCode);
  const known = translationMemory[text];
  if (known) return known;
  return Object.fromEntries(Object.keys(languageNames).map((code) => [
    code,
    code === normalizedSource ? text : `[${languageNames[code]} 자동 번역 준비 중] ${text}`
  ]));
}
async function sha256(text) {
  const bytes = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(hash)].map((value) => value.toString(16).padStart(2, "0")).join("");
}

async function loginWithFirebase(loginId, password, role) {
  const accountRef = doc(db, "accounts", loginId);
  const snap = await getDoc(accountRef);
  if (!snap.exists()) return null;
  const account = snap.data();
  const passwordHash = await sha256(password);
  if (account.passwordHash !== passwordHash || account.role !== role || account.active === false) return null;
  return {
    loginId,
    role: account.role,
    name: account.name || loginId,
    language: account.language || "한국어",
    languageCode: normalizeLanguage(account.language || "ko")
  };
}

async function loginWithDemo(loginId, password, role) {
  const account = demoAccounts[loginId];
  if (!account || account.password !== password || account.role !== role) return null;
  return {
    loginId: account.loginId,
    role: account.role,
    name: account.name,
    language: account.language,
    languageCode: normalizeLanguage(account.language)
  };
}

async function handleLogin(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const role = new FormData(form).get("role");
  const loginId = $("#loginId").value.trim();
  const password = $("#loginPassword").value;
  const languageCode = $("#loginLanguage").value;

  try {
    let user = null;
    if (firebaseAvailable) {
      user = await loginWithFirebase(loginId, password, role);
      if (!user) user = await loginWithDemo(loginId, password, role);
    } else {
      user = await loginWithDemo(loginId, password, role);
    }
    if (!user) {
      showToast("아이디, 비밀번호, 역할이 일치하지 않습니다.");
      return;
    }
    user.languageCode = normalizeLanguage(languageCode || user.languageCode || user.language);
    user.language = languageNames[user.languageCode];
    currentUser = user;
    saveJson(STORAGE_KEYS.session, user);
    await enterApp(user);
  } catch (error) {
    console.error(error);
    showToast("로그인 중 오류가 발생했습니다. Firebase 설정을 확인해 주세요.");
  }
}

async function enterApp(user) {
  user.languageCode = normalizeLanguage(user.languageCode || user.language);
  user.language = languageNames[user.languageCode];
  document.body.classList.remove("logged-out");
  document.body.classList.add("logged-in");
  $("#currentUserLabel").textContent = `${user.name} (${user.role === "teacher" ? "교사" : "학생"})`;
  $("#roleSubtitle").textContent = user.role === "teacher" ? "교사용 관리 화면" : "학생용 도움 화면";
  applyRoleView(user.role);
  applyMenuLanguage(user.languageCode);
  await refreshFirebaseData();
  renderHero(user.role);
  renderMoods();
  renderMessages();
  renderStudents();
  updateStats();
  location.hash = user.role === "teacher" ? "#teacher" : "#student";
}

function logout() {
  currentUser = null;
  localStorage.removeItem(STORAGE_KEYS.session);
  document.body.classList.remove("logged-in");
  document.body.classList.add("logged-out");
  $("#loginPassword").value = "";
  showToast("로그아웃되었습니다.");
}

function applyRoleView(role) {
  $$('[data-section-role], [data-nav-role]').forEach((element) => {
    const allowedRole = element.dataset.sectionRole || element.dataset.navRole;
    element.classList.toggle("role-hidden", allowedRole !== role);
  });
}

function renderHero(role) {
  const teacher = role === "teacher";
  $("#heroTitle").textContent = teacher ? "교사 업무와 학생 지원을 한 화면에서 관리합니다." : "오늘의 마음과 궁금한 점을 편안하게 나눠요.";
  $("#heroText").textContent = teacher
    ? "도움 요청 학생을 먼저 확인하고, 다국어 공지와 행정 문서 초안을 빠르게 준비할 수 있습니다."
    : "모국어로 체크인하고 친구들과 대화하며 학교생활에 필요한 도움을 받을 수 있습니다.";
  $("#quickTitle").textContent = teacher ? "교사용 빠른 작업" : "학생용 빠른 작업";
  const items = teacher
    ? ["도움 요청 학생 확인", "다국어 공지 작성", "AI 행정 문서 초안 생성"]
    : ["기분 체크하고 도움 요청하기", "친구에게 내 언어로 인사하기", "문화 질문 카드로 이야기하기"];
  $("#todayList").innerHTML = items.map((item, index) => `<li><span>${index + 1}</span>${item}</li>`).join("");
  $("#heroActions").innerHTML = teacher
    ? `<a class="primary" href="#teacher">학생 관리 보기</a><a class="secondary" href="#ai-docs">AI 행정 문서</a>`
    : `<a class="primary" href="#student">체크인 하기</a><a class="secondary" href="#lounge">라운지 가기</a>`;
}

async function refreshFirebaseData() {
  if (!firebaseAvailable || !currentUser) return;
  if (currentUser.role === "teacher") {
    const studentSnap = await getDocs(collection(db, "students"));
    if (!studentSnap.empty) students = studentSnap.docs.map((item) => item.data());
  }
  const messageSnap = await getDocs(query(collection(db, "messages"), orderBy("createdAt", "desc"), limit(30)));
  if (!messageSnap.empty) {
    const messages = messageSnap.docs.map((item) => item.data()).reverse();
    saveJson(STORAGE_KEYS.messages, messages);
  }
}

function renderMoods() {
  const row = $("#moodRow");
  row.innerHTML = "";
  moods.forEach((mood) => {
    const button = document.createElement("button");
    button.className = `mood${mood === selectedMood ? " selected" : ""}`;
    button.type = "button";
    button.textContent = mood;
    button.addEventListener("click", () => { selectedMood = mood; renderMoods(); });
    row.appendChild(button);
  });
}

function getMessages() { return loadJson(STORAGE_KEYS.messages, defaultMessages); }
function renderMessages() {
  const box = $("#messages");
  if (!box) return;
  const viewerLanguageCode = getViewerLanguageCode();
  const messages = getMessages().filter((message) => activeFilter === "all" || message.lang === activeFilter);
  box.innerHTML = "";
  messages.forEach((message) => {
    const sourceCode = getMessageSourceCode(message);
    const translatedText = getMessageTranslation(message, viewerLanguageCode);
    const sourceLabel = languageNames[sourceCode] || message.lang || "원문";
    const viewerLabel = languageNames[viewerLanguageCode] || "한국어";
    const sameLanguage = sourceCode === viewerLanguageCode;
    const item = document.createElement("article");
    item.className = "msg";
    item.innerHTML = `
      <strong>${message.name}<small>${sourceLabel}</small></strong>
      <p>${translatedText}</p>
      <small>${sameLanguage ? "내 모국어로 작성된 글입니다." : `${viewerLabel} 번역 / 원문(${sourceLabel}): ${message.text}`}</small>
    `;
    box.appendChild(item);
  });
  box.scrollTop = box.scrollHeight;
}

function renderStudents() {
  const tbody = $("#studentTable");
  tbody.innerHTML = "";
  students.forEach((student) => {
    const row = document.createElement("tr");
    const isDanger = student.status?.includes("도움") || student.status?.includes("관찰");
    row.innerHTML = `<td>${student.name}</td><td>${student.lang || student.language || "-"}</td><td><span class="tag ${isDanger ? "danger" : ""}">${student.status || "확인"}</span></td><td><button class="secondary" type="button" data-student="${student.name}">상담 메모</button></td>`;
    tbody.appendChild(row);
  });
  $$('[data-student]').forEach((button) => {
    button.addEventListener("click", () => {
      const student = students.find((item) => item.name === button.dataset.student);
      showToast(`${student.name} 학생 메모: ${student.note || "메모 없음"}`);
    });
  });
}

function updateStats() {
  const checkins = loadJson(STORAGE_KEYS.checkins, []);
  const helpCount = students.filter((student) => student.status?.includes("도움")).length + checkins.filter((item) => item.help).length;
  $("#statStudents").textContent = students.length;
  $("#statHelp").textContent = helpCount;
  $("#statCheckin").textContent = checkins.length ? `${Math.min(100, 70 + checkins.length * 5)}%` : "82%";
}

async function saveCheckin() {
  const checkin = {
    studentId: currentUser?.loginId || "demo",
    studentName: currentUser?.name || "체험 학생",
    mood: selectedMood,
    text: $("#checkinText").value.trim() || "내용 없음",
    help: $("#helpCheck").checked,
    createdAt: new Date().toISOString()
  };
  const checkins = loadJson(STORAGE_KEYS.checkins, []);
  checkins.push(checkin);
  saveJson(STORAGE_KEYS.checkins, checkins);
  if (firebaseAvailable) await addDoc(collection(db, "checkins"), { ...checkin, createdAt: serverTimestamp() });
  $("#checkinText").value = "";
  $("#helpCheck").checked = false;
  updateStats();
  showToast(checkin.help ? "도움 요청과 체크인이 저장되었습니다." : "오늘 체크인이 저장되었습니다.");
}

async function sendMessage() {
  const input = $("#messageInput");
  const text = input.value.trim();
  if (!text) return showToast("메시지를 먼저 입력해 주세요.");
  const sourceLangCode = normalizeLanguage($("#messageLang").value);
  const message = {
    name: currentUser?.name || "나",
    lang: languageKoreanNames[sourceLangCode],
    sourceLangCode,
    text,
    translations: buildTranslationBundle(text, sourceLangCode),
    createdAt: new Date().toISOString()
  };
  const messages = getMessages();
  messages.push(message);
  saveJson(STORAGE_KEYS.messages, messages);
  if (firebaseAvailable) await addDoc(collection(db, "messages"), { ...message, createdAt: serverTimestamp() });
  input.value = "";
  renderMessages();
  showToast("라운지에 메시지를 보냈습니다.");
}

function makeNotice() {
  const title = $("#noticeTitle").value.trim() || "학교생활 안내";
  const body = $("#noticeBody").value.trim() || "내일 준비물과 일정을 확인해 주세요.";
  $("#noticePreview").textContent = `[쉬운 한국어]\n${title}\n${body}\n\n[English sample]\nNotice: ${title}\nPlease check this information: ${body}\n\n[Vietnamese sample]\nThông báo: ${title}\nVui lòng kiểm tra nội dung sau: ${body}\n\n[교사용 확인]\n- 발송 전 개인정보 포함 여부 확인\n- 필요 시 통역 지원 또는 학부모 연락 기록 저장`;
  showToast("다국어 공지 미리보기를 만들었습니다.");
}

async function generateDoc() {
  const file = $("#hwpFile").files[0];
  const type = $("#docType").value;
  const date = $("#docDate").value || "추후 안내";
  const target = $("#docTarget").value.trim() || "이주 배경학생 및 학부모";
  const prompt = $("#docPrompt").value.trim() || "학생의 언어 배경을 고려하여 쉬운 한국어 안내와 번역 지원을 함께 제공합니다.";
  const result = `${type}\n\n1. 목적\n${target}의 학교생활 적응과 가정-학교 소통을 지원하기 위함.\n\n2. 일정\n${date}\n\n3. 대상\n${target}\n\n4. 주요 내용\n${prompt}\n\n5. 다국어 지원 계획\n- 쉬운 한국어 안내문 제공\n- 필요 시 베트남어, 중국어, 영어, 몽골어, 필리핀어 번역본 제공\n- 학생이 이해하기 어려운 표현은 그림, 예시, 짧은 문장으로 보완\n\n6. 교사 확인 사항\n- 도움 요청 학생 우선 확인\n- 학부모 연락 필요 여부 점검\n- 상담 기록 및 후속 지원 일정 등록\n\n7. AI/HWP 연동 메모\n분석 대상 파일: ${file ? file.name : "업로드 문서 없음"}\n실제 배포 시에는 서버에서 HWP/HWPX를 텍스트로 변환하고, 개인정보 비식별화 후 AI API로 초안을 생성하도록 연결합니다.`;
  $("#docResult").textContent = result;
  const documentRecord = { teacherId: currentUser?.loginId || "demo", type, date, target, prompt, result, fileName: file?.name || null, createdAt: new Date().toISOString() };
  const documents = loadJson(STORAGE_KEYS.documents, []);
  documents.push(documentRecord);
  saveJson(STORAGE_KEYS.documents, documents);
  if (firebaseAvailable) await addDoc(collection(db, "documents"), { ...documentRecord, createdAt: serverTimestamp() });
  showToast("AI 행정 문서 초안이 생성되었습니다.");
}

async function copyDoc() {
  try {
    await navigator.clipboard.writeText($("#docResult").textContent);
    showToast("문서 초안을 복사했습니다.");
  } catch {
    showToast("브라우저 보안 설정 때문에 자동 복사가 막혔습니다.");
  }
}

function setupFilters() {
  $$(".chat-tabs button").forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      $$(".chat-tabs button").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      renderMessages();
    });
  });
}

function setupEvents() {
  $("#loginForm").addEventListener("submit", handleLogin);
  $("#logoutBtn").addEventListener("click", logout);
  $("#appLanguage").addEventListener("change", (event) => {
    const languageCode = normalizeLanguage(event.target.value);
    applyMenuLanguage(languageCode);
    if (currentUser) {
      currentUser.languageCode = languageCode;
      currentUser.language = languageNames[languageCode];
      saveJson(STORAGE_KEYS.session, currentUser);
    }
    showToast(`${languageNames[languageCode]} 메뉴로 바뀌었습니다.`);
  });
  $("#saveCheckin").addEventListener("click", saveCheckin);
  $("#sendMessage").addEventListener("click", sendMessage);
  $("#messageInput").addEventListener("keydown", (event) => { if (event.key === "Enter") sendMessage(); });
  $("#nextQuestion").addEventListener("click", () => {
    $("#cultureQuestion").textContent = cultureQuestions[Math.floor(Math.random() * cultureQuestions.length)];
  });
  $("#makeNotice").addEventListener("click", makeNotice);
  $("#generateDoc").addEventListener("click", generateDoc);
  $("#copyDoc").addEventListener("click", copyDoc);
}

function restoreSession() {
  const session = loadJson(STORAGE_KEYS.session, null);
  if (session) {
    currentUser = session;
    enterApp(session);
  }
}

async function boot() {
  try {
    await setupFirebase();
  } catch (error) {
    console.error(error);
    $("#firebaseStatus").textContent = "Firebase 연결에 실패해 체험 모드로 실행됩니다.";
  }
  renderMoods();
  renderMessages();
  renderStudents();
  updateStats();
  setupFilters();
  setupEvents();
  restoreSession();
}

boot();


