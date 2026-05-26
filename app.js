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
let updateDoc;
let getFunctions;
let httpsCallable;
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

const translationFunctionRegion = "asia-northeast3";
const translationFunctionName = "translateMessage";

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

const moods = [
  {
    key: "great",
    ko: "매우 좋아요",
    en: "Very good",
    ja: "とても良い",
    zh: "非常好",
    vi: "Rất tốt",
    th: "ดีมาก",
    mn: "Маш сайн",
    ru: "Очень хорошо"
  },
  {
    key: "good",
    ko: "좋아요",
    en: "Good",
    ja: "良い",
    zh: "好",
    vi: "Tốt",
    th: "ดี",
    mn: "Сайн",
    ru: "Хорошо"
  },
  {
    key: "okay",
    ko: "보통이에요",
    en: "Okay",
    ja: "普通です",
    zh: "一般",
    vi: "Bình thường",
    th: "ปกติ",
    mn: "Дунд зэрэг",
    ru: "Нормально"
  },
  {
    key: "worried",
    ko: "걱정돼요",
    en: "Worried",
    ja: "心配です",
    zh: "担心",
    vi: "Lo lắng",
    th: "กังวล",
    mn: "Санаа зовж байна",
    ru: "Тревожно"
  },
  {
    key: "hard",
    ko: "힘들어요",
    en: "Having a hard time",
    ja: "つらいです",
    zh: "很辛苦",
    vi: "Khó khăn",
    th: "ลำบาก",
    mn: "Хэцүү байна",
    ru: "Тяжело"
  },
  {
    key: "needHelp",
    ko: "도움 필요",
    en: "Need help",
    ja: "助けが必要",
    zh: "需要帮助",
    vi: "Cần giúp đỡ",
    th: "ต้องการความช่วยเหลือ",
    mn: "Тусламж хэрэгтэй",
    ru: "Нужна помощь"
  }
];

const checkinTextTranslations = {
  title: {
    ko: "오늘 체크인",
    en: "Today's Check-in",
    ja: "今日のチェックイン",
    zh: "今日签到",
    vi: "Điểm danh cảm xúc hôm nay",
    th: "เช็กอินวันนี้",
    mn: "Өнөөдрийн тэмдэглэл",
    ru: "Сегодняшняя отметка"
  },
  guide: {
    ko: "오늘의 마음과 필요한 도움을 모국어로 남길 수 있습니다.",
    en: "You can write today's feelings and help requests in your home language.",
    ja: "今日の気持ちや必要な助けを母語で書けます。",
    zh: "可以用母语写下今天的心情和需要的帮助。",
    vi: "Em có thể viết cảm xúc và điều cần giúp bằng tiếng mẹ đẻ.",
    th: "เขียนความรู้สึกและสิ่งที่ต้องการความช่วยเหลือเป็นภาษาแม่ได้",
    mn: "Өнөөдрийн сэтгэл болон хэрэгтэй тусламжаа эх хэлээрээ бичиж болно.",
    ru: "Можно написать о чувствах и нужной помощи на родном языке."
  },
  placeholder: {
    ko: "오늘 좋았던 일, 어려웠던 일, 궁금한 점을 적어 보세요. 모국어로 써도 괜찮아요.",
    en: "Write what was good, hard, or confusing today. You may write in your home language.",
    ja: "今日よかったこと、難しかったこと、知りたいことを書いてください。母語で書いても大丈夫です。",
    zh: "写下今天开心、困难或想知道的事。可以用母语写。",
    vi: "Hãy viết điều vui, điều khó hoặc điều em thắc mắc hôm nay. Em có thể viết bằng tiếng mẹ đẻ.",
    th: "เขียนสิ่งที่ดี สิ่งที่ยาก หรือสิ่งที่สงสัยวันนี้ จะเขียนเป็นภาษาแม่ก็ได้",
    mn: "Өнөөдөр сайн байсан, хэцүү байсан, эсвэл асуух зүйлээ бичээрэй. Эх хэлээрээ бичиж болно.",
    ru: "Напиши, что сегодня было хорошим, трудным или непонятным. Можно писать на родном языке."
  },
  help: {
    ko: "선생님 도움이 필요해요",
    en: "I need help from my teacher",
    ja: "先生の助けが必要です",
    zh: "我需要老师帮助",
    vi: "Em cần thầy cô giúp đỡ",
    th: "ฉันต้องการความช่วยเหลือจากครู",
    mn: "Багшаас тусламж хэрэгтэй",
    ru: "Мне нужна помощь учителя"
  },
  save: {
    ko: "기록 저장",
    en: "Save record",
    ja: "記録を保存",
    zh: "保存记录",
    vi: "Lưu ghi chép",
    th: "บันทึก",
    mn: "Тэмдэглэл хадгалах",
    ru: "Сохранить запись"
  }
};
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
let selectedMood = moods[2].key;
let activeFilter = "all";
let students = [...defaultStudents];
let recentCheckins = [];
let firebaseAvailable = false;
let functionsClient = null;
let translateMessageCallable = null;
let studentLanguageFilter = "all";
let studentStatusFilter = "all";
let selectedStudentIds = new Set();

const firebaseReady = Object.values(firebaseConfig).every(Boolean);
async function setupFirebase() {
  if (!firebaseReady) return;
  ({ initializeApp } = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js"));
  ({ getFirestore, doc, getDoc, collection, addDoc, getDocs, serverTimestamp, query, orderBy, limit, updateDoc } = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js"));
  ({ getFunctions, httpsCallable } = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-functions.js"));
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  functionsClient = getFunctions(app, translationFunctionRegion);
  translateMessageCallable = httpsCallable(functionsClient, translationFunctionName);
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

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeLanguage(value) {
  return languageNames[value] ? value : languageAliases[value] || "ko";
}

function formatBilingual(menuKey, languageCode) {
  const korean = menuTranslations[menuKey].ko;
  const translated = menuTranslations[menuKey][languageCode] || korean;
  return languageCode === "ko" ? korean : `${translated} / ${korean}`;
}

function formatBilingualValue(translations, languageCode) {
  const normalized = normalizeLanguage(languageCode);
  const korean = translations.ko;
  const translated = translations[normalized] || korean;
  return normalized === "ko" ? korean : `${translated} / ${korean}`;
}

function getMoodByKey(key) {
  return moods.find((mood) => mood.key === key || mood.ko === key) || moods[2];
}

function applyMenuLanguage(languageCode = "ko") {
  const normalized = normalizeLanguage(languageCode);
  $$("[data-menu-key]").forEach((item) => {
    item.textContent = formatBilingual(item.dataset.menuKey, normalized);
  });
  const appLanguage = $("#appLanguage");
  if (appLanguage) appLanguage.value = normalized;
  applyCheckinLanguage(normalized);
  renderMessages();
}

function applyCheckinLanguage(languageCode = "ko") {
  const normalized = normalizeLanguage(languageCode);
  $("#checkinTitle").textContent = formatBilingualValue(checkinTextTranslations.title, normalized);
  $("#checkinGuide").textContent = formatBilingualValue(checkinTextTranslations.guide, normalized);
  $("#checkinText").placeholder = formatBilingualValue(checkinTextTranslations.placeholder, normalized);
  $("#helpCheckLabel").textContent = formatBilingualValue(checkinTextTranslations.help, normalized);
  $("#saveCheckin").textContent = formatBilingualValue(checkinTextTranslations.save, normalized);
  renderMoods();
}

function getViewerLanguageCode() {
  return normalizeLanguage(currentUser?.languageCode || $("#loginLanguage")?.value || "ko");
}

function getStudentId(student) {
  return String(student.loginId || student.id || student.studentId || student.name);
}

function getStudentLanguageCode(student) {
  return normalizeLanguage(student.languageCode || student.sourceLangCode || student.lang || student.language || "ko");
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

function canViewMessage(message) {
  if (currentUser?.role !== "student") return true;
  if (!message.recipients?.length) return true;
  return message.recipients.includes(currentUser.loginId) || message.recipientNames?.includes(currentUser.name);
}

function getCheckinTranslation(checkin, targetCode) {
  const normalizedTarget = normalizeLanguage(targetCode);
  return checkin.translations?.[normalizedTarget] || checkin.translations?.ko || checkin.koreanText || checkin.text || "내용 없음";
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

async function translateMessageText(text, sourceCode) {
  const fallback = buildTranslationBundle(text, sourceCode);
  if (!translateMessageCallable) return fallback;

  try {
    const result = await translateMessageCallable({
      text,
      sourceLang: normalizeLanguage(sourceCode),
      targetLangs: Object.keys(languageNames)
    });
    const translations = result.data?.translations;
    if (!translations || typeof translations !== "object") return fallback;
    return { ...fallback, ...translations, [normalizeLanguage(sourceCode)]: text };
  } catch (error) {
    console.warn("Translation function failed. Falling back to local placeholder.", error);
    showToast("번역 서버 연결 전이라 임시 번역 안내로 표시합니다.");
    return fallback;
  }
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
  renderStudentFilters();
  renderRecipientSummary();
  renderTeacherCheckins();
  renderStudentReplies();
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
    ? "도움 요청 학생을 먼저 확인하고, 선택한 학생에게 번역 메시지와 행정 문서 초안을 빠르게 준비할 수 있습니다."
    : "모국어로 체크인하고 친구들과 대화하며 학교생활에 필요한 도움을 받을 수 있습니다.";
  $("#quickTitle").textContent = teacher ? "교사용 빠른 작업" : "학생용 빠른 작업";
  const items = teacher
    ? ["도움 요청 학생 확인", "선택 학생에게 메시지 보내기", "AI 행정 문서 초안 생성"]
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
    if (!studentSnap.empty) students = studentSnap.docs.map((item) => ({ id: item.id, ...item.data() }));
    const checkinSnap = await getDocs(query(collection(db, "checkins"), orderBy("createdAt", "desc"), limit(30)));
    if (!checkinSnap.empty) {
      recentCheckins = checkinSnap.docs.map((item) => ({ id: item.id, ...item.data() }));
      saveJson(STORAGE_KEYS.checkins, recentCheckins);
    }
  } else {
    const checkinSnap = await getDocs(query(collection(db, "checkins"), orderBy("createdAt", "desc"), limit(30)));
    if (!checkinSnap.empty) {
      recentCheckins = checkinSnap.docs.map((item) => ({ id: item.id, ...item.data() }));
      saveJson(STORAGE_KEYS.checkins, recentCheckins);
    }
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
  const languageCode = getViewerLanguageCode();
  moods.forEach((mood) => {
    const button = document.createElement("button");
    button.className = `mood${mood.key === selectedMood ? " selected" : ""}`;
    button.type = "button";
    button.textContent = formatBilingualValue(mood, languageCode);
    button.addEventListener("click", () => { selectedMood = mood.key; renderMoods(); });
    row.appendChild(button);
  });
}

function getMessages() { return loadJson(STORAGE_KEYS.messages, defaultMessages); }
function renderMessages() {
  const box = $("#messages");
  if (!box) return;
  const viewerLanguageCode = getViewerLanguageCode();
  const messages = getMessages()
    .filter(canViewMessage)
    .filter((message) => activeFilter === "all" || message.lang === activeFilter);
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
      <strong>${escapeHtml(message.title || message.name)}<small>${escapeHtml(sourceLabel)}</small></strong>
      <p>${escapeHtml(translatedText)}</p>
      <small>${escapeHtml(sameLanguage ? "내 모국어로 작성된 글입니다." : `${viewerLabel} 번역 / 원문(${sourceLabel}): ${message.text}`)}</small>
    `;
    box.appendChild(item);
  });
  box.scrollTop = box.scrollHeight;
}

function renderStudents() {
  const tbody = $("#studentTable");
  tbody.innerHTML = "";
  const filteredStudents = students.filter((student) => {
    const language = student.lang || student.language || "-";
    const status = student.status || "확인";
    const languageMatches = studentLanguageFilter === "all" || language === studentLanguageFilter;
    const statusMatches = studentStatusFilter === "all" || status.includes(studentStatusFilter);
    return languageMatches && statusMatches;
  });
  if (!filteredStudents.length) {
    tbody.innerHTML = `<tr><td colspan="7">조건에 맞는 학생이 없습니다.</td></tr>`;
    return;
  }
  filteredStudents.forEach((student) => {
    const studentId = getStudentId(student);
    const latestCheckin = getLatestCheckinForStudent(student);
    const latestMood = latestCheckin ? getMoodByKey(latestCheckin.moodKey || latestCheckin.mood).ko : "기록 없음";
    const latestText = latestCheckin ? getCheckinTranslation(latestCheckin, getViewerLanguageCode()) : "최근 체크인 없음";
    const helpRequested = latestCheckin?.help || student.status?.includes("도움");
    const row = document.createElement("tr");
    const isDanger = student.status?.includes("도움") || student.status?.includes("관찰");
    row.innerHTML = `
      <td><input class="student-select" type="checkbox" data-student-id="${escapeHtml(studentId)}" ${selectedStudentIds.has(studentId) ? "checked" : ""} aria-label="${escapeHtml(student.name)} 선택" /></td>
      <td><strong>${escapeHtml(student.name)}</strong></td>
      <td>${escapeHtml(student.lang || student.language || "-")}</td>
      <td><span class="tag ${isDanger ? "danger" : ""}">${escapeHtml(student.status || "확인")}</span></td>
      <td><span class="student-mood">${escapeHtml(latestMood)}</span><small>${escapeHtml(latestText)}</small></td>
      <td><span class="tag ${helpRequested ? "danger" : ""}">${helpRequested ? "필요" : "없음"}</span></td>
      <td><button class="secondary" type="button" data-student="${escapeHtml(student.name)}">상담 메모</button></td>
    `;
    tbody.appendChild(row);
  });
  $$(".student-select").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) selectedStudentIds.add(checkbox.dataset.studentId);
      else selectedStudentIds.delete(checkbox.dataset.studentId);
      renderRecipientSummary();
    });
  });
  $$('[data-student]').forEach((button) => {
    button.addEventListener("click", () => {
      const student = students.find((item) => item.name === button.dataset.student);
      showToast(`${student.name} 학생 메모: ${student.note || "메모 없음"}`);
    });
  });
  renderRecipientSummary();
}

function renderStudentFilters() {
  const languageSelect = $("#studentLanguageFilter");
  const statusSelect = $("#studentStatusFilter");
  if (!languageSelect || !statusSelect) return;
  const languages = [...new Set(students.map((student) => student.lang || student.language).filter(Boolean))].sort();
  languageSelect.innerHTML = `<option value="all">전체</option>${languages.map((language) => `<option value="${escapeHtml(language)}">${escapeHtml(language)}</option>`).join("")}`;
  languageSelect.value = languages.includes(studentLanguageFilter) ? studentLanguageFilter : "all";
  statusSelect.value = studentStatusFilter;
}

function getLatestCheckinForStudent(student) {
  const name = student.name;
  return getCheckins().find((checkin) => checkin.studentName === name || checkin.studentId === student.loginId || checkin.studentId === student.id);
}

function getSelectedStudents() {
  return students.filter((student) => selectedStudentIds.has(getStudentId(student)));
}

function renderRecipientSummary() {
  const summary = $("#recipientSummary");
  if (!summary) return;
  const selected = getSelectedStudents();
  if (!selected.length) {
    summary.textContent = "학생 관리 목록에서 받을 학생을 선택하세요.";
    return;
  }
  summary.textContent = `${selected.length}명 선택: ${selected.map((student) => student.name).join(", ")}`;
}

function getCheckins() {
  return recentCheckins.length ? recentCheckins : loadJson(STORAGE_KEYS.checkins, []);
}

function renderTeacherCheckins() {
  const tbody = $("#teacherCheckinTable");
  if (!tbody) return;
  const checkins = getCheckins().slice(0, 20);
  tbody.innerHTML = "";
  if (!checkins.length) {
    tbody.innerHTML = `<tr><td colspan="6">아직 저장된 체크인 기록이 없습니다.</td></tr>`;
    return;
  }
  checkins.forEach((checkin, index) => {
    const teacherLanguageCode = getViewerLanguageCode();
    const mood = getMoodByKey(checkin.moodKey || checkin.mood);
    const translatedText = getCheckinTranslation(checkin, teacherLanguageCode);
    const sourceLabel = languageNames[normalizeLanguage(checkin.sourceLangCode || checkin.sourceLang || "ko")] || "원문";
    const helpText = checkin.help ? "도움 요청" : "일반 기록";
    const reply = checkin.reply?.text || "";
    const row = document.createElement("tr");
    row.className = "checkin-row";
    row.innerHTML = `
      <td>${escapeHtml(checkin.studentName || checkin.studentId || "학생")}</td>
      <td>${escapeHtml(mood.ko)}</td>
      <td><span class="student-mood">${escapeHtml(languageNames[teacherLanguageCode])}</span><small>${escapeHtml(translatedText)}</small></td>
      <td><span class="student-mood">${escapeHtml(sourceLabel)}</span><small>${escapeHtml(checkin.text || "내용 없음")}</small></td>
      <td><span class="tag ${checkin.help ? "danger" : ""}">${helpText}</span></td>
      <td>
        <div class="reply-cell">
          <p>${reply ? escapeHtml(reply) : "아직 답장이 없습니다."}</p>
          <textarea class="reply-input" data-checkin-index="${index}" placeholder="학생에게 보낼 답장을 입력하세요.">${escapeHtml(reply)}</textarea>
          <button class="secondary reply-save" type="button" data-checkin-index="${index}">답장 저장</button>
        </div>
      </td>
    `;
    tbody.appendChild(row);
  });
  $$(".reply-save").forEach((button) => {
    button.addEventListener("click", () => saveCheckinReply(Number(button.dataset.checkinIndex)));
  });
}

function renderStudentReplies() {
  const list = $("#studentReplyList");
  if (!list) return;
  const studentId = currentUser?.loginId;
  const checkins = getCheckins()
    .filter((checkin) => !studentId || checkin.studentId === studentId)
    .filter((checkin) => checkin.reply?.text)
    .slice(0, 10);
  if (!checkins.length) {
    list.innerHTML = `<p class="muted">아직 도착한 답장이 없습니다.</p>`;
    return;
  }
  list.innerHTML = checkins.map((checkin) => {
    const mood = getMoodByKey(checkin.moodKey || checkin.mood);
    const replyDate = checkin.reply.createdAt ? new Date(checkin.reply.createdAt).toLocaleString("ko-KR") : "방금 전";
    return `
      <article class="reply-card">
        <strong>${escapeHtml(checkin.reply.teacherName || "선생님")} <small>${escapeHtml(replyDate)}</small></strong>
        <p>${escapeHtml(checkin.reply.text)}</p>
        <small>내 체크인: ${escapeHtml(mood.ko)} · ${escapeHtml(checkin.translations?.ko || checkin.koreanText || checkin.text || "내용 없음")}</small>
      </article>
    `;
  }).join("");
}

async function saveCheckinReply(index) {
  const checkins = getCheckins();
  const checkin = checkins[index];
  const input = $(`.reply-input[data-checkin-index="${index}"]`);
  const text = input?.value.trim();
  if (!checkin || !text) return showToast("답장 내용을 입력해 주세요.");
  const reply = {
    text,
    teacherId: currentUser?.loginId || "teacher",
    teacherName: currentUser?.name || "교사",
    createdAt: new Date().toISOString()
  };
  checkin.reply = reply;
  recentCheckins = checkins;
  saveJson(STORAGE_KEYS.checkins, checkins);
  if (firebaseAvailable && checkin.id) {
    await updateDoc(doc(db, "checkins", checkin.id), {
      reply,
      updatedAt: serverTimestamp()
    });
  }
  renderTeacherCheckins();
  renderStudentReplies();
  showToast("학생 체크인에 답장을 저장했습니다.");
}

function updateStats() {
  const checkins = getCheckins();
  const helpCount = students.filter((student) => student.status?.includes("도움")).length + checkins.filter((item) => item.help).length;
  $("#statStudents").textContent = students.length;
  $("#statHelp").textContent = helpCount;
  $("#statCheckin").textContent = checkins.length ? `${Math.min(100, 70 + checkins.length * 5)}%` : "82%";
}

async function saveCheckin() {
  const sourceLangCode = getViewerLanguageCode();
  const text = $("#checkinText").value.trim() || "내용 없음";
  const saveButton = $("#saveCheckin");
  saveButton.disabled = true;
  saveButton.textContent = "저장 중";
  const translations = await translateMessageText(text, sourceLangCode);
  const selectedMoodData = getMoodByKey(selectedMood);
  const checkin = {
    studentId: currentUser?.loginId || "demo",
    studentName: currentUser?.name || "체험 학생",
    sourceLangCode,
    sourceLang: languageKoreanNames[sourceLangCode],
    moodKey: selectedMood,
    mood: selectedMoodData.ko,
    moodOriginal: selectedMoodData[sourceLangCode] || selectedMoodData.ko,
    text,
    translations,
    koreanText: translations.ko || text,
    help: $("#helpCheck").checked,
    createdAt: new Date().toISOString()
  };
  try {
    const checkins = loadJson(STORAGE_KEYS.checkins, []);
    checkins.unshift(checkin);
    recentCheckins = checkins;
    saveJson(STORAGE_KEYS.checkins, checkins);
    if (firebaseAvailable) {
      const checkinRef = await addDoc(collection(db, "checkins"), { ...checkin, createdAt: serverTimestamp() });
      checkin.id = checkinRef.id;
      saveJson(STORAGE_KEYS.checkins, checkins);
    }
    $("#checkinText").value = "";
    $("#helpCheck").checked = false;
    renderTeacherCheckins();
    renderStudentReplies();
    updateStats();
    showToast(checkin.help ? "도움 요청과 체크인이 저장되었습니다." : "오늘 체크인이 저장되었습니다.");
  } finally {
    saveButton.disabled = false;
    applyCheckinLanguage(sourceLangCode);
  }
}

async function sendMessage() {
  const input = $("#messageInput");
  const text = input.value.trim();
  if (!text) return showToast("메시지를 먼저 입력해 주세요.");
  const sourceLangCode = normalizeLanguage($("#messageLang").value);
  const sendButton = $("#sendMessage");
  sendButton.disabled = true;
  sendButton.textContent = "번역 중";
  try {
    const translations = await translateMessageText(text, sourceLangCode);
    const message = {
      name: currentUser?.name || "나",
      lang: languageKoreanNames[sourceLangCode],
      sourceLangCode,
      text,
      translations,
      createdAt: new Date().toISOString()
    };
    const messages = getMessages();
    messages.push(message);
    saveJson(STORAGE_KEYS.messages, messages);
    if (firebaseAvailable) await addDoc(collection(db, "messages"), { ...message, createdAt: serverTimestamp() });
    input.value = "";
    renderMessages();
    showToast("라운지에 메시지를 보냈습니다.");
  } finally {
    sendButton.disabled = false;
    sendButton.textContent = "보내기";
  }
}

async function sendTeacherMessage() {
  const selected = getSelectedStudents();
  const title = $("#teacherMessageTitle").value.trim() || "선생님 메시지";
  const body = $("#teacherMessageBody").value.trim();
  if (!selected.length) return showToast("메시지를 받을 학생을 먼저 선택해 주세요.");
  if (!body) return showToast("보낼 메시지 내용을 입력해 주세요.");

  const sourceLangCode = getViewerLanguageCode();
  const sendButton = $("#sendTeacherMessage");
  sendButton.disabled = true;
  sendButton.textContent = "번역 중";
  try {
    const translations = await translateMessageText(body, sourceLangCode);
    const recipients = selected.map((student) => getStudentId(student));
    const message = {
      type: "teacher",
      title,
      name: currentUser?.name || "선생님",
      senderId: currentUser?.loginId || "teacher",
      senderRole: "teacher",
      recipients,
      recipientNames: selected.map((student) => student.name),
      recipientLanguages: selected.map((student) => ({
        studentId: getStudentId(student),
        languageCode: getStudentLanguageCode(student),
        languageName: languageNames[getStudentLanguageCode(student)]
      })),
      lang: languageKoreanNames[sourceLangCode],
      sourceLangCode,
      text: body,
      translations,
      createdAt: new Date().toISOString()
    };
    const messages = getMessages();
    messages.push(message);
    saveJson(STORAGE_KEYS.messages, messages);
    if (firebaseAvailable) await addDoc(collection(db, "messages"), { ...message, createdAt: serverTimestamp() });
    $("#teacherMessageTitle").value = "";
    $("#teacherMessageBody").value = "";
    $("#teacherMessagePreview").textContent = selected.map((student) => {
      const languageCode = getStudentLanguageCode(student);
      return `[${student.name} · ${languageNames[languageCode]}]\n${translations[languageCode] || body}`;
    }).join("\n\n");
    renderMessages();
    showToast(`${selected.length}명에게 메시지를 보냈습니다.`);
  } finally {
    sendButton.disabled = false;
    sendButton.textContent = "선택 학생에게 보내기";
  }
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
  $("#studentLanguageFilter").addEventListener("change", (event) => {
    studentLanguageFilter = event.target.value;
    renderStudents();
  });
  $("#studentStatusFilter").addEventListener("change", (event) => {
    studentStatusFilter = event.target.value;
    renderStudents();
  });
  $("#selectAllStudents").addEventListener("click", () => {
    students.forEach((student) => selectedStudentIds.add(getStudentId(student)));
    renderStudents();
    showToast("모든 학생을 메시지 대상으로 선택했습니다.");
  });
  $("#clearSelectedStudents").addEventListener("click", () => {
    selectedStudentIds.clear();
    renderStudents();
    showToast("메시지 대상 선택을 해제했습니다.");
  });
  $("#saveCheckin").addEventListener("click", saveCheckin);
  $("#sendMessage").addEventListener("click", sendMessage);
  $("#messageInput").addEventListener("keydown", (event) => { if (event.key === "Enter") sendMessage(); });
  $("#nextQuestion").addEventListener("click", () => {
    $("#cultureQuestion").textContent = cultureQuestions[Math.floor(Math.random() * cultureQuestions.length)];
  });
  $("#sendTeacherMessage").addEventListener("click", sendTeacherMessage);
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
  renderTeacherCheckins();
  renderStudentReplies();
  updateStats();
  setupFilters();
  setupEvents();
  restoreSession();
}

boot();
