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
  studentStore: {
    ko: "학급 상점",
    en: "Class Store",
    ja: "クラス店",
    zh: "班级商店",
    vi: "Cửa hàng lớp học",
    th: "ร้านค้าห้องเรียน",
    mn: "Ангийн дэлгүүр",
    ru: "Магазин класса"
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
  teacherStore: {
    ko: "상점 관리",
    en: "Store Admin",
    ja: "店管理",
    zh: "商店管理",
    vi: "Quản lý cửa hàng",
    th: "จัดการร้านค้า",
    mn: "Дэлгүүр удирдах",
    ru: "Управление магазином"
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
const bankRewardRules = [
  {
    type: "checkin",
    title: { ko: "오늘 체크인", en: "Daily Check-in", ja: "今日のチェックイン", zh: "今日签到", vi: "Điểm danh hôm nay", th: "เช็กอินวันนี้", mn: "Өнөөдрийн тэмдэглэл", ru: "Сегодняшняя отметка" },
    amount: 30,
    description: { ko: "하루 마음 기록을 남기면 적립", en: "Earn this by writing today's feelings.", ja: "今日の気持ちを書くと貯まります。", zh: "记录今天的心情即可获得。", vi: "Nhận điểm khi viết cảm xúc hôm nay.", th: "ได้รับเมื่อเขียนความรู้สึกวันนี้", mn: "Өнөөдрийн сэтгэлээ бичвэл авна.", ru: "Начисляется за запись настроения дня." }
  },
  {
    type: "helpCheckin",
    title: { ko: "도움 요청", en: "Help Request", ja: "助けの依頼", zh: "请求帮助", vi: "Yêu cầu giúp đỡ", th: "ขอความช่วยเหลือ", mn: "Тусламж хүсэх", ru: "Просьба о помощи" },
    amount: 50,
    description: { ko: "도움이 필요하다고 표현하면 추가 격려", en: "Extra support when you say you need help.", ja: "助けが必要だと伝えると追加で貯まります。", zh: "表达需要帮助时可获得额外鼓励。", vi: "Được cộng thêm khi em nói cần giúp đỡ.", th: "ได้เพิ่มเมื่อบอกว่าต้องการความช่วยเหลือ", mn: "Тусламж хэрэгтэйгээ хэлбэл нэмэлт урамшуулал.", ru: "Дополнительно за просьбу о помощи." }
  },
  {
    type: "loungeMessage",
    title: { ko: "라운지 소통", en: "Lounge Talk", ja: "ラウンジ交流", zh: "交流区沟通", vi: "Giao tiếp ở phòng chung", th: "สื่อสารในห้องรวม", mn: "Булан дахь харилцаа", ru: "Общение в зоне" },
    amount: 15,
    description: { ko: "친구들과 다국어로 소통하면 적립", en: "Earn this by communicating with friends.", ja: "友だちと多言語で交流すると貯まります。", zh: "和朋友多语言交流即可获得。", vi: "Nhận điểm khi giao tiếp với bạn bè.", th: "ได้รับเมื่อสื่อสารกับเพื่อน", mn: "Найзуудтайгаа харилцвал авна.", ru: "Начисляется за общение с друзьями." }
  },
  {
    type: "teacherReply",
    title: { ko: "선생님 답장 확인", en: "Teacher Reply", ja: "先生の返信", zh: "老师回复", vi: "Trả lời của thầy cô", th: "คำตอบจากครู", mn: "Багшийн хариу", ru: "Ответ учителя" },
    amount: 10,
    description: { ko: "교사 피드백이 연결되면 적립", en: "Earn this when teacher feedback is connected.", ja: "先生のフィードバックがつながると貯まります。", zh: "收到老师反馈时可获得。", vi: "Nhận điểm khi có phản hồi từ thầy cô.", th: "ได้รับเมื่อมีข้อเสนอแนะจากครู", mn: "Багшийн санал холбогдвол авна.", ru: "Начисляется при ответе учителя." }
  }
];
const studentUiTranslations = {
  heroTitle: {
    ko: "오늘의 마음과 궁금한 점을 편안하게 나눠요.",
    en: "Share today's feelings and questions comfortably.",
    ja: "今日の気持ちや質問を安心して話しましょう。",
    zh: "安心分享今天的心情和疑问。",
    vi: "Hãy thoải mái chia sẻ cảm xúc và điều em thắc mắc hôm nay.",
    th: "แบ่งปันความรู้สึกและคำถามของวันนี้ได้อย่างสบายใจ",
    mn: "Өнөөдрийн сэтгэл, асуултаа тайван хуваалцаарай.",
    ru: "Спокойно делитесь чувствами и вопросами дня."
  },
  heroText: {
    ko: "모국어로 체크인하고 친구들과 대화하며 학교생활에 필요한 도움을 받을 수 있습니다.",
    en: "Check in, talk with friends, and get school support in your home language.",
    ja: "母語でチェックインし、友だちと話し、学校生活に必要な助けを受けられます。",
    zh: "可以用母语签到、和朋友交流，并获得学校生活所需的帮助。",
    vi: "Em có thể điểm danh cảm xúc, trò chuyện với bạn bè và nhận hỗ trợ đời sống trường học bằng tiếng mẹ đẻ.",
    th: "เช็กอิน พูดคุยกับเพื่อน และรับความช่วยเหลือเรื่องชีวิตในโรงเรียนด้วยภาษาแม่",
    mn: "Эх хэлээрээ тэмдэглэл хийж, найзуудтайгаа ярилцаж, сургуулийн амьдралд хэрэгтэй тусламж авна.",
    ru: "Делайте отметки, общайтесь с друзьями и получайте школьную поддержку на родном языке."
  },
  quickTitle: { ko: "학생용 빠른 작업", en: "Student Quick Actions", ja: "学生用クイック操作", zh: "学生快捷操作", vi: "Thao tác nhanh cho học sinh", th: "งานด่วนสำหรับนักเรียน", mn: "Сурагчийн хурдан үйлдэл", ru: "Быстрые действия ученика" },
  quickItemMood: { ko: "기분 체크하고 도움 요청하기", en: "Check feelings and ask for help", ja: "気持ちを確認して助けを求める", zh: "查看心情并请求帮助", vi: "Kiểm tra cảm xúc và nhờ giúp đỡ", th: "เช็กความรู้สึกและขอความช่วยเหลือ", mn: "Сэтгэлээ шалгаж тусламж хүсэх", ru: "Отметить настроение и попросить помощи" },
  quickItemGreeting: { ko: "친구에게 내 언어로 인사하기", en: "Greet friends in my language", ja: "自分の言語で友だちにあいさつする", zh: "用我的语言向朋友问好", vi: "Chào bạn bằng ngôn ngữ của em", th: "ทักทายเพื่อนด้วยภาษาของฉัน", mn: "Өөрийн хэлээр найзуудтайгаа мэндлэх", ru: "Поздороваться с друзьями на своем языке" },
  quickItemCulture: { ko: "문화 질문 카드로 이야기하기", en: "Talk with a culture question card", ja: "文化質問カードで話す", zh: "用文化问题卡交流", vi: "Trò chuyện bằng thẻ câu hỏi văn hóa", th: "คุยด้วยการ์ดคำถามวัฒนธรรม", mn: "Соёлын асуултын картаар ярилцах", ru: "Обсудить карточку культурного вопроса" },
  heroPrimaryAction: { ko: "체크인 하기", en: "Check In", ja: "チェックインする", zh: "签到", vi: "Điểm danh", th: "เช็กอิน", mn: "Тэмдэглэх", ru: "Отметиться" },
  heroSecondaryAction: { ko: "라운지 가기", en: "Go to Lounge", ja: "ラウンジへ", zh: "前往交流区", vi: "Vào phòng chung", th: "ไปห้องรวม", mn: "Булан руу очих", ru: "В зону общения" },
  studentSupportTitle: {
    ko: "학생 도움 공간",
    en: "Student Support Space",
    ja: "学生サポートスペース",
    zh: "学生帮助空间",
    vi: "Không gian hỗ trợ học sinh",
    th: "พื้นที่ช่วยเหลือนักเรียน",
    mn: "Сурагчийн дэмжлэгийн орон зай",
    ru: "Пространство поддержки ученика"
  },
  studentSupportDescription: {
    ko: "모국어 선택, 하루 체크인, 비공개 상담 요청, 학교생활 안내를 한곳에서 제공합니다.",
    en: "Choose your home language, check in, ask privately for help, and find school-life guidance in one place.",
    ja: "母語の選択、毎日のチェックイン、非公開相談、学校生活の案内を一か所で確認できます。",
    zh: "可以在这里选择母语、每日签到、私下请求帮助并查看学校生活指南。",
    vi: "Em có thể chọn tiếng mẹ đẻ, điểm danh cảm xúc, nhờ hỗ trợ riêng và xem hướng dẫn đời sống trường học tại một nơi.",
    th: "เลือกภาษาแม่ เช็กอินประจำวัน ขอคำปรึกษาส่วนตัว และดูคำแนะนำชีวิตในโรงเรียนได้ในที่เดียว",
    mn: "Эх хэлээ сонгож, өдөр тутмын тэмдэглэл хийж, нууцаар тусламж хүсэж, сургуулийн амьдралын зааврыг нэг дор харна.",
    ru: "Здесь можно выбрать родной язык, сделать ежедневную отметку, попросить помощи лично и посмотреть школьные подсказки."
  },
  featureLangTitle: { ko: "모국어 안내", en: "Home-language Guide", ja: "母語案内", zh: "母语指南", vi: "Hướng dẫn bằng tiếng mẹ đẻ", th: "คำแนะนำภาษาแม่", mn: "Эх хэлний заавар", ru: "Подсказки на родном языке" },
  featureLangText: {
    ko: "한국어, 베트남어, 중국어, 영어, 몽골어 등 여러 언어로 안내를 확인합니다.",
    en: "Check guidance in Korean, Vietnamese, Chinese, English, Mongolian, and more.",
    ja: "韓国語、ベトナム語、中国語、英語、モンゴル語などで案内を確認できます。",
    zh: "可以用韩语、越南语、中文、英语、蒙古语等查看说明。",
    vi: "Xem hướng dẫn bằng tiếng Hàn, tiếng Việt, tiếng Trung, tiếng Anh, tiếng Mông Cổ và nhiều ngôn ngữ khác.",
    th: "ดูคำแนะนำเป็นภาษาเกาหลี เวียดนาม จีน อังกฤษ มองโกเลีย และภาษาอื่น ๆ",
    mn: "Солонгос, вьетнам, хятад, англи, монгол зэрэг хэлээр заавар харна.",
    ru: "Смотрите подсказки на корейском, вьетнамском, китайском, английском, монгольском и других языках."
  },
  featureLangIcon: { ko: "말", en: "Hi", ja: "話", zh: "语", vi: "Nói", th: "พูด", mn: "Үг", ru: "Речь" },
  featureMoodTitle: { ko: "정서 체크인", en: "Feeling Check-in", ja: "気持ちチェックイン", zh: "情绪签到", vi: "Điểm danh cảm xúc", th: "เช็กอินความรู้สึก", mn: "Сэтгэлийн тэмдэглэл", ru: "Отметка настроения" },
  featureMoodText: {
    ko: "오늘의 기분과 어려움을 기록하고 필요하면 선생님에게 도움을 요청합니다.",
    en: "Record today's feelings and difficulties, and ask your teacher for help when needed.",
    ja: "今日の気持ちや困ったことを記録し、必要なら先生に助けを求めます。",
    zh: "记录今天的心情和困难，需要时向老师求助。",
    vi: "Ghi lại cảm xúc và điều khó khăn hôm nay, khi cần có thể nhờ thầy cô giúp.",
    th: "บันทึกความรู้สึกและเรื่องยากวันนี้ และขอความช่วยเหลือจากครูเมื่อจำเป็น",
    mn: "Өнөөдрийн сэтгэл, хэцүү зүйлээ бичиж, хэрэгтэй бол багшаас тусламж хүснэ.",
    ru: "Записывайте настроение и трудности дня, а при необходимости просите учителя о помощи."
  },
  featureMoodIcon: { ko: "맘", en: "Feel", ja: "心", zh: "心", vi: "Tâm", th: "ใจ", mn: "Сэт", ru: "Душа" },
  featureGuideTitle: { ko: "학교생활 가이드", en: "School-life Guide", ja: "学校生活ガイド", zh: "学校生活指南", vi: "Hướng dẫn đời sống trường học", th: "คู่มือชีวิตในโรงเรียน", mn: "Сургуулийн амьдралын заавар", ru: "Гид по школьной жизни" },
  featureGuideText: {
    ko: "급식, 준비물, 출결, 상담, 방과후 안내를 쉬운 말로 정리합니다.",
    en: "Lunch, supplies, attendance, counseling, and after-school notices are explained simply.",
    ja: "給食、持ち物、出欠、相談、放課後案内をやさしい言葉で整理します。",
    zh: "用简单的话整理午餐、准备物、出勤、咨询和课后通知。",
    vi: "Giải thích đơn giản về bữa ăn, đồ cần chuẩn bị, điểm danh, tư vấn và hoạt động sau giờ học.",
    th: "สรุปเรื่องอาหารกลางวัน ของที่ต้องเตรียม การมาเรียน การปรึกษา และกิจกรรมหลังเลิกเรียนด้วยภาษาง่าย ๆ",
    mn: "Үдийн хоол, бэлтгэх зүйл, ирц, зөвлөгөө, хичээлийн дараах мэдээллийг энгийнээр тайлбарлана.",
    ru: "Простыми словами объясняет обед, принадлежности, посещаемость, консультации и занятия после уроков."
  },
  featureGuideIcon: { ko: "길", en: "Map", ja: "道", zh: "路", vi: "Đường", th: "ทาง", mn: "Зам", ru: "Путь" },
  featurePrivateTitle: { ko: "비공개 상담", en: "Private Help", ja: "非公開相談", zh: "私下咨询", vi: "Tư vấn riêng", th: "ปรึกษาส่วนตัว", mn: "Нууц зөвлөгөө", ru: "Личная помощь" },
  featurePrivateText: {
    ko: "학생이 원할 때 교사에게만 보이는 상담 요청을 남길 수 있습니다.",
    en: "Leave a help request that only your teacher can see.",
    ja: "必要なとき、先生だけに見える相談リクエストを残せます。",
    zh: "需要时可以留下只有老师能看到的求助请求。",
    vi: "Khi cần, em có thể để lại yêu cầu tư vấn chỉ thầy cô nhìn thấy.",
    th: "เมื่อจำเป็น สามารถฝากคำขอปรึกษาที่มีแต่ครูเท่านั้นที่เห็น",
    mn: "Хэрэгтэй үед зөвхөн багш харах тусламжийн хүсэлт үлдээж болно.",
    ru: "Можно оставить просьбу о помощи, которую увидит только учитель."
  },
  featurePrivateIcon: { ko: "쉼", en: "Care", ja: "休", zh: "安", vi: "Yên", th: "พัก", mn: "Амр", ru: "Тихо" },
  bankTitle: { ko: "울림 성장 통장", en: "ULIM Growth Bank", ja: "ウリム成長通帳", zh: "ULIM 成长存折", vi: "Sổ tiết kiệm trưởng thành ULIM", th: "บัญชีการเติบโต ULIM", mn: "ULIM өсөлтийн данс", ru: "Копилка роста ULIM" },
  bankDescription: {
    ko: "체크인과 소통 활동을 쌓아 나의 성장 기록을 확인합니다.",
    en: "Build a record of growth through check-ins and communication.",
    ja: "チェックインとコミュニケーション活動を積み重ね、成長記録を確認します。",
    zh: "通过签到和沟通活动积累自己的成长记录。",
    vi: "Tích lũy hoạt động điểm danh và giao tiếp để xem quá trình trưởng thành của em.",
    th: "สะสมการเช็กอินและการสื่อสารเพื่อดูบันทึกการเติบโตของตนเอง",
    mn: "Тэмдэглэл, харилцааны үйлдлээр өсөлтийн бүртгэлээ харна.",
    ru: "Накопите записи роста через отметки и общение."
  },
  bankBalanceLabel: { ko: "현재 잔액", en: "Current Balance", ja: "現在の残高", zh: "当前余额", vi: "Số dư hiện tại", th: "ยอดคงเหลือปัจจุบัน", mn: "Одоогийн үлдэгдэл", ru: "Текущий баланс" },
  teacherMessagesTitle: { ko: "선생님 메시지", en: "Teacher Messages", ja: "先生からのメッセージ", zh: "老师消息", vi: "Tin nhắn từ thầy cô", th: "ข้อความจากครู", mn: "Багшийн зурвас", ru: "Сообщения учителя" },
  teacherMessagesDescription: {
    ko: "선생님이 나에게 보낸 메시지를 내 모국어로 확인할 수 있습니다.",
    en: "Read messages from your teacher in your selected home language.",
    ja: "先生からのメッセージを選んだ母語で確認できます。",
    zh: "可以用选择的母语查看老师发来的消息。",
    vi: "Xem tin nhắn thầy cô gửi bằng tiếng mẹ đẻ em đã chọn.",
    th: "อ่านข้อความจากครูเป็นภาษาแม่ที่เลือกไว้",
    mn: "Багшаас ирсэн зурвасыг сонгосон эх хэлээрээ уншина.",
    ru: "Читайте сообщения учителя на выбранном родном языке."
  },
  historyTitle: { ko: "내 체크인 기록과 선생님 답장", en: "My Check-ins and Teacher Replies", ja: "自分のチェックインと先生の返信", zh: "我的签到和老师回复", vi: "Điểm danh của em và trả lời của thầy cô", th: "เช็กอินของฉันและคำตอบจากครู", mn: "Миний тэмдэглэл ба багшийн хариу", ru: "Мои отметки и ответы учителя" },
  historyDescription: {
    ko: "내가 남긴 체크인과 선생님이 보낸 답장을 함께 확인할 수 있습니다.",
    en: "Review your check-ins together with your teacher's replies.",
    ja: "自分のチェックインと先生からの返信を一緒に確認できます。",
    zh: "可以一起查看自己的签到和老师的回复。",
    vi: "Xem lại điểm danh của em cùng với trả lời của thầy cô.",
    th: "ดูเช็กอินของตนเองพร้อมคำตอบจากครู",
    mn: "Өөрийн тэмдэглэл болон багшийн хариуг хамт харна.",
    ru: "Просматривайте свои отметки вместе с ответами учителя."
  },
  loungeTitle: { ko: "다국어 학생 소통 라운지", en: "Multilingual Student Lounge", ja: "多言語学生ラウンジ", zh: "多语言学生交流区", vi: "Phòng giao tiếp đa ngôn ngữ", th: "ห้องสื่อสารหลายภาษา", mn: "Олон хэлний сурагчдын булан", ru: "Многоязычная зона общения" },
  loungeDescription: {
    ko: "학생들이 각자의 언어로 말하고, 번역 보조 문구와 문화 질문을 통해 서로를 이해하도록 설계했습니다.",
    en: "Students can speak in their own languages and understand each other through translations and culture questions.",
    ja: "学生が自分の言語で話し、翻訳補助文や文化質問で互いを理解できるようにしました。",
    zh: "学生可以用自己的语言交流，并通过翻译和文化问题互相理解。",
    vi: "Học sinh có thể nói bằng ngôn ngữ của mình và hiểu nhau qua bản dịch và câu hỏi văn hóa.",
    th: "นักเรียนพูดด้วยภาษาของตนเอง และเข้าใจกันผ่านคำแปลและคำถามวัฒนธรรม",
    mn: "Сурагчид өөрийн хэлээр ярьж, орчуулга болон соёлын асуултаар бие биенээ ойлгоно.",
    ru: "Ученики говорят на своих языках и понимают друг друга через переводы и вопросы о культуре."
  },
  cultureTitle: { ko: "문화 질문 카드", en: "Culture Question Card", ja: "文化質問カード", zh: "文化问题卡", vi: "Thẻ câu hỏi văn hóa", th: "การ์ดคำถามวัฒนธรรม", mn: "Соёлын асуултын карт", ru: "Карточка культурного вопроса" },
  nextQuestion: { ko: "다른 질문 보기", en: "Show Another Question", ja: "別の質問を見る", zh: "查看其他问题", vi: "Xem câu hỏi khác", th: "ดูคำถามอื่น", mn: "Өөр асуулт харах", ru: "Другой вопрос" },
  messagePlaceholder: {
    ko: "친구들에게 인사하거나 궁금한 점을 적어 보세요",
    en: "Say hello to friends or write a question.",
    ja: "友だちにあいさつしたり、気になることを書いてください。",
    zh: "向朋友打招呼，或写下想问的问题。",
    vi: "Chào bạn bè hoặc viết điều em thắc mắc.",
    th: "ทักทายเพื่อนหรือเขียนสิ่งที่สงสัย",
    mn: "Найзуудтайгаа мэндэлж эсвэл асуух зүйлээ бичээрэй.",
    ru: "Поздоровайтесь с друзьями или напишите вопрос."
  },
  send: { ko: "보내기", en: "Send", ja: "送信", zh: "发送", vi: "Gửi", th: "ส่ง", mn: "Илгээх", ru: "Отправить" },
  sameLanguageNotice: { ko: "내 모국어로 작성된 글입니다.", en: "This was written in my home language.", ja: "自分の母語で書かれた文です。", zh: "这是用我的母语写的内容。", vi: "Bài viết này được viết bằng tiếng mẹ đẻ của em.", th: "ข้อความนี้เขียนด้วยภาษาแม่ของฉัน", mn: "Энэ миний эх хэлээр бичигдсэн.", ru: "Это написано на моем родном языке." },
  translationLabel: { ko: "번역", en: "translation", ja: "翻訳", zh: "翻译", vi: "bản dịch", th: "คำแปล", mn: "орчуулга", ru: "перевод" },
  teacherMessageDefaultTitle: { ko: "선생님 메시지", en: "Teacher Message", ja: "先生からのメッセージ", zh: "老师消息", vi: "Tin nhắn từ thầy cô", th: "ข้อความจากครู", mn: "Багшийн зурвас", ru: "Сообщение учителя" },
  teacherDefaultName: { ko: "선생님", en: "Teacher", ja: "先生", zh: "老师", vi: "Thầy cô", th: "ครู", mn: "Багш", ru: "Учитель" },
  senderLabel: { ko: "보낸 사람", en: "From", ja: "送信者", zh: "发送人", vi: "Người gửi", th: "ผู้ส่ง", mn: "Илгээсэн хүн", ru: "Отправитель" },
  teacherMessageEmpty: { ko: "아직 선생님에게 받은 메시지가 없습니다.", en: "No teacher messages yet.", ja: "先生からのメッセージはまだありません。", zh: "还没有收到老师的消息。", vi: "Chưa có tin nhắn từ thầy cô.", th: "ยังไม่มีข้อความจากครู", mn: "Багшаас зурвас хараахан алга.", ru: "Пока нет сообщений от учителя." },
  studentStoreTitle: { ko: "학급 상점", en: "Class Store", ja: "クラス店", zh: "班级商店", vi: "Cửa hàng lớp học", th: "ร้านค้าห้องเรียน", mn: "Ангийн дэлгүүр", ru: "Магазин класса" },
  studentStoreDescription: {
    ko: "활동으로 모은 울림 포인트로 선생님이 올린 물건과 특권을 구매할 수 있습니다.",
    en: "Use ULIM points earned from activities to buy items and privileges from your teacher.",
    ja: "活動で集めたウリムポイントで、先生が登録した品物や特典を購入できます。",
    zh: "可以用活动获得的 ULIM 点数购买老师上架的物品和特权。",
    vi: "Dùng điểm ULIM từ hoạt động để mua đồ vật và đặc quyền thầy cô đăng.",
    th: "ใช้คะแนน ULIM จากกิจกรรมซื้อของหรือสิทธิพิเศษที่ครูลงไว้",
    mn: "Үйл ажиллагаагаар цуглуулсан ULIM оноогоор багшийн тавьсан зүйл, эрхийг авна.",
    ru: "Используйте баллы ULIM за активности, чтобы покупать предметы и привилегии учителя."
  },
  storeBalanceLabel: { ko: "사용 가능 포인트", en: "Available Points", ja: "使えるポイント", zh: "可用点数", vi: "Điểm có thể dùng", th: "คะแนนที่ใช้ได้", mn: "Ашиглах оноо", ru: "Доступные баллы" },
  storeGuide: {
    ko: "구매하면 울림 통장에서 포인트가 차감되고 구매 내역이 선생님에게 전달됩니다.",
    en: "Purchases subtract points from your ULIM bank and send the record to your teacher.",
    ja: "購入するとウリム通帳からポイントが引かれ、購入記録が先生に届きます。",
    zh: "购买后会从 ULIM 存折扣除点数，并把记录发送给老师。",
    vi: "Khi mua, điểm sẽ trừ trong sổ ULIM và lịch sử mua sẽ gửi cho thầy cô.",
    th: "เมื่อซื้อ คะแนนจะถูกหักจากบัญชี ULIM และส่งประวัติให้ครู",
    mn: "Авахад ULIM данснаас оноо хасагдаж, худалдан авалт багшид очно.",
    ru: "При покупке баллы списываются из копилки ULIM, а запись отправляется учителю."
  },
  storeItemsTitle: { ko: "판매 중인 물건", en: "Items for Sale", ja: "販売中の品物", zh: "正在出售", vi: "Đồ đang bán", th: "ของที่ขายอยู่", mn: "Зарагдаж буй зүйл", ru: "Товары в продаже" },
  purchaseHistoryTitle: { ko: "내 구매 내역", en: "My Purchases", ja: "自分の購入記録", zh: "我的购买记录", vi: "Lịch sử mua của em", th: "ประวัติการซื้อของฉัน", mn: "Миний худалдан авалт", ru: "Мои покупки" },
  purchaseButton: { ko: "구매", en: "Buy", ja: "購入", zh: "购买", vi: "Mua", th: "ซื้อ", mn: "Авах", ru: "Купить" },
  purchasedButton: { ko: "구매 완료", en: "Purchased", ja: "購入済み", zh: "已购买", vi: "Đã mua", th: "ซื้อแล้ว", mn: "Авсан", ru: "Куплено" },
  storeEmpty: { ko: "아직 판매 중인 물건이 없습니다.", en: "No items are for sale yet.", ja: "販売中の品物はまだありません。", zh: "还没有正在出售的物品。", vi: "Chưa có đồ nào đang bán.", th: "ยังไม่มีของขาย", mn: "Одоогоор зарах зүйл алга.", ru: "Пока нет товаров." },
  purchaseEmpty: { ko: "아직 구매 내역이 없습니다.", en: "No purchases yet.", ja: "購入記録はまだありません。", zh: "还没有购买记录。", vi: "Chưa có lịch sử mua.", th: "ยังไม่มีประวัติการซื้อ", mn: "Худалдан авалт алга.", ru: "Покупок пока нет." },
  insufficientPoints: { ko: "포인트 부족", en: "Not Enough Points", ja: "ポイント不足", zh: "点数不足", vi: "Thiếu điểm", th: "คะแนนไม่พอ", mn: "Оноо хүрэхгүй", ru: "Недостаточно баллов" },
  soldOut: { ko: "재고 없음", en: "Sold Out", ja: "在庫なし", zh: "无库存", vi: "Hết hàng", th: "หมด", mn: "Дууссан", ru: "Нет в наличии" },
  stockLabel: { ko: "재고", en: "Stock", ja: "在庫", zh: "库存", vi: "Tồn kho", th: "คงเหลือ", mn: "Нөөц", ru: "Остаток" },
  unlimitedStock: { ko: "무제한", en: "Unlimited", ja: "無制限", zh: "无限", vi: "Không giới hạn", th: "ไม่จำกัด", mn: "Хязгааргүй", ru: "Без лимита" },
  deliveredWaiting: { ko: "지급 대기", en: "Waiting", ja: "受け取り待ち", zh: "等待发放", vi: "Đang chờ nhận", th: "รอรับ", mn: "Хүлээгдэж байна", ru: "Ожидает выдачи" },
  bankEmpty: { ko: "아직 통장 기록이 없습니다. 체크인부터 시작해 보세요.", en: "No bank records yet. Start with a check-in.", ja: "通帳記録はまだありません。チェックインから始めましょう。", zh: "还没有存折记录。先从签到开始吧。", vi: "Chưa có ghi chép trong sổ. Hãy bắt đầu bằng điểm danh cảm xúc.", th: "ยังไม่มีประวัติบัญชี เริ่มจากการเช็กอินได้เลย", mn: "Дансны бүртгэл хараахан алга. Тэмдэглэлээс эхлээрэй.", ru: "Пока нет записей. Начните с отметки." },
  noCheckins: { ko: "아직 남긴 체크인 기록이 없습니다.", en: "You do not have any check-ins yet.", ja: "まだチェックイン記録がありません。", zh: "还没有签到记录。", vi: "Em chưa có ghi chép điểm danh.", th: "ยังไม่มีบันทึกเช็กอิน", mn: "Тэмдэглэл хараахан алга.", ru: "Пока нет отметок." },
  teacherReplyLabel: { ko: "선생님 답장", en: "Teacher Reply", ja: "先生の返信", zh: "老师回复", vi: "Trả lời của thầy cô", th: "คำตอบจากครู", mn: "Багшийн хариу", ru: "Ответ учителя" },
  replyWaiting: { ko: "아직 답장이 없습니다.", en: "No reply yet.", ja: "まだ返信はありません。", zh: "还没有回复。", vi: "Chưa có trả lời.", th: "ยังไม่มีคำตอบ", mn: "Хариу хараахан алга.", ru: "Ответа пока нет." },
  originalLabel: { ko: "원문", en: "Original", ja: "原文", zh: "原文", vi: "Bản gốc", th: "ต้นฉบับ", mn: "Эх бичвэр", ru: "Оригинал" },
  helpRequestedLabel: { ko: "도움 요청함", en: "Asked for help", ja: "助けを依頼", zh: "已请求帮助", vi: "Đã nhờ giúp đỡ", th: "ขอความช่วยเหลือแล้ว", mn: "Тусламж хүссэн", ru: "Попросил(а) помощи" },
  regularRecordLabel: { ko: "일반 기록", en: "Regular record", ja: "通常記録", zh: "普通记录", vi: "Ghi chép thường", th: "บันทึกทั่วไป", mn: "Энгийн тэмдэглэл", ru: "Обычная запись" }
};
const defaultMessages = [
  { name: "린", lang: "베트남어", sourceLangCode: "vi", text: "Bạn có thể cho mình biết thực đơn hôm nay không?" },
  { name: "민수", lang: "한국어", sourceLangCode: "ko", text: "방과후 교실은 2층 도서실 옆에서 시작해요." },
  { name: "Sara", lang: "영어", sourceLangCode: "en", text: "What should I bring for tomorrow's club activity?" }
];
const defaultShopItems = [
  {
    id: "shop-seat-choice",
    type: "shopItem",
    name: "자리 선택권",
    price: 80,
    stock: -1,
    category: "활동 특권",
    description: "하루 동안 원하는 자리를 먼저 고를 수 있어요.",
    nameTranslations: {
      ko: "자리 선택권",
      en: "Seat Choice Pass",
      ja: "席を選べる券",
      zh: "座位选择券",
      vi: "Phiếu chọn chỗ ngồi",
      th: "บัตรเลือกที่นั่ง",
      mn: "Суудал сонгох эрх",
      ru: "Право выбрать место"
    },
    descriptionTranslations: {
      ko: "하루 동안 원하는 자리를 먼저 고를 수 있어요.",
      en: "Choose your preferred seat first for one day.",
      ja: "一日、好きな席を先に選べます。",
      zh: "一天内可以优先选择想坐的位置。",
      vi: "Em có thể chọn chỗ ngồi mình muốn trước trong một ngày.",
      th: "เลือกที่นั่งที่ต้องการก่อนได้หนึ่งวัน",
      mn: "Нэг өдөр хүссэн суудлаа түрүүлж сонгоно.",
      ru: "Можно первым выбрать место на один день."
    },
    active: true,
    createdAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "shop-pencil",
    type: "shopItem",
    name: "연필 세트",
    price: 60,
    stock: 8,
    category: "학용품",
    description: "수업 준비를 돕는 기본 연필 세트입니다.",
    nameTranslations: {
      ko: "연필 세트",
      en: "Pencil Set",
      ja: "鉛筆セット",
      zh: "铅笔套装",
      vi: "Bộ bút chì",
      th: "ชุดดินสอ",
      mn: "Харандааны багц",
      ru: "Набор карандашей"
    },
    descriptionTranslations: {
      ko: "수업 준비를 돕는 기본 연필 세트입니다.",
      en: "A basic pencil set to help you get ready for class.",
      ja: "授業の準備に役立つ基本の鉛筆セットです。",
      zh: "帮助准备上课的基础铅笔套装。",
      vi: "Bộ bút chì cơ bản giúp em chuẩn bị cho tiết học.",
      th: "ชุดดินสอพื้นฐานสำหรับเตรียมตัวเรียน",
      mn: "Хичээлдээ бэлтгэхэд туслах үндсэн харандааны багц.",
      ru: "Базовый набор карандашей для подготовки к уроку."
    },
    active: true,
    createdAt: "2026-01-02T00:00:00.000Z"
  },
  {
    id: "shop-helper",
    type: "shopItem",
    name: "학급 도우미 선택권",
    price: 120,
    stock: 3,
    category: "학급 경험",
    description: "원하는 학급 도우미 역할을 하루 동안 신청할 수 있어요.",
    nameTranslations: {
      ko: "학급 도우미 선택권",
      en: "Class Helper Choice Pass",
      ja: "学級係を選べる券",
      zh: "班级小助手选择券",
      vi: "Phiếu chọn vai trò hỗ trợ lớp",
      th: "บัตรเลือกหน้าที่ผู้ช่วยห้องเรียน",
      mn: "Ангийн туслах үүрэг сонгох эрх",
      ru: "Право выбрать роль помощника класса"
    },
    descriptionTranslations: {
      ko: "원하는 학급 도우미 역할을 하루 동안 신청할 수 있어요.",
      en: "Apply for the class helper role you want for one day.",
      ja: "一日、希望する学級係の役割を申し込めます。",
      zh: "可以申请一天自己想做的班级小助手角色。",
      vi: "Em có thể đăng ký vai trò hỗ trợ lớp mình muốn trong một ngày.",
      th: "ขอทำหน้าที่ผู้ช่วยห้องเรียนที่ต้องการได้หนึ่งวัน",
      mn: "Нэг өдөр хүссэн ангийн туслах үүргээ сонгож болно.",
      ru: "Можно выбрать желаемую роль помощника класса на один день."
    },
    active: true,
    createdAt: "2026-01-03T00:00:00.000Z"
  }
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
  },
  "지우개": {
    ko: "지우개",
    en: "Eraser",
    ja: "消しゴム",
    zh: "橡皮",
    vi: "Cục tẩy",
    th: "ยางลบ",
    mn: "Баллуур",
    ru: "Ластик"
  }
};
const defaultStudents = [
  { id: "student01", loginId: "student01", name: "학생 체험", grade: "체험 계정", classroom: "데모", lang: "한국어", languageCode: "ko", status: "안정", note: "체험 로그인 계정과 연결된 학생입니다." },
  { id: "student-linh", loginId: "student-linh", name: "린", grade: "3학년", classroom: "2반", lang: "베트남어", languageCode: "vi", status: "도움 요청", note: "급식 적응 상담 필요" },
  { id: "student-xiao", loginId: "student-xiao", name: "샤오", grade: "4학년", classroom: "1반", lang: "중국어", languageCode: "zh", status: "관찰 필요", note: "또래 관계 확인" },
  { id: "student-sara", loginId: "student-sara", name: "Sara", grade: "5학년", classroom: "3반", lang: "영어", languageCode: "en", status: "안정", note: "체크인 꾸준함" },
  { id: "student-bat", loginId: "student-bat", name: "바트", grade: "2학년", classroom: "4반", lang: "몽골어", languageCode: "mn", status: "상담 예정", note: "학부모 통역 필요" },
  { id: "student-maria", loginId: "student-maria", name: "마리아", grade: "6학년", classroom: "1반", lang: "영어", languageCode: "en", status: "안정", note: "방과후 참여" }
];
const cultureQuestions = [
  "우리 학교 급식 시간에는 어떻게 줄을 서면 좋을까요?",
  "친구에게 내 이름을 모국어로 소개한다면 어떻게 말하고 싶나요?",
  "수업 중 이해가 안 될 때 어떤 말로 도움을 요청하면 좋을까요?",
  "한국 학교에서 처음 어려웠던 점을 친구와 어떻게 나누면 좋을까요?",
  "우리 반에서 새 친구가 편안해지도록 할 수 있는 작은 행동은 무엇일까요?"
];
const documentTypeGuides = {
  "가정통신문": {
    purpose: "가정에 안내할 핵심 사항을 쉬운 문장으로 전달",
    sections: ["제목", "인사말", "목적", "일시/장소", "대상", "세부 안내", "준비물", "문의처", "번역 안내"],
    checks: ["학부모가 바로 이해할 쉬운 한국어", "날짜와 제출 기한", "가정 협조 사항", "다국어 번역 필요 여부"]
  },
  "업무추진 계획": {
    purpose: "학교 업무의 목적, 추진 절차, 역할, 일정을 체계적으로 정리",
    sections: ["추진 배경", "목적", "방침", "세부 추진 내용", "역할 분담", "예산/물품", "기대 효과"],
    checks: ["담당자와 협조 부서", "추진 일정", "예산 또는 필요 물품", "성과 확인 방법"]
  },
  "교육주간 운영계획": {
    purpose: "교육주간의 전체 운영 흐름과 프로그램을 한눈에 정리",
    sections: ["운영 개요", "목표", "기간", "대상", "세부 프로그램", "홍보/가정 연계", "안전 유의사항", "평가"],
    checks: ["일자별 프로그램", "장소와 담당자", "학생 참여 방식", "안전 및 출결 관리"]
  },
  "학생 학습자료 제작": {
    purpose: "학생 수준과 언어 배경을 고려한 학습자료 구성",
    sections: ["학습 목표", "핵심 개념", "쉬운 설명", "활동 과제", "예시", "확인 문제", "모국어 도움말"],
    checks: ["학년 수준", "핵심 어휘", "그림/예시 필요 여부", "모국어 병기 또는 쉬운 한국어"]
  },
  "상담 계획서": {
    purpose: "학생 상황을 살피고 후속 지원을 연결",
    sections: ["상담 목적", "학생 현황", "상담 일정", "주요 질문", "지원 계획", "가정 연계", "후속 확인"],
    checks: ["개인정보 최소화", "통역 필요 여부", "상담 후 조치", "보호자 안내 방식"]
  },
  "다문화 학생 지원 계획": {
    purpose: "이주 배경학생의 학교 적응과 언어 지원을 체계화",
    sections: ["학생 현황", "지원 목표", "언어 지원", "또래 관계", "가정 연계", "교과 지원", "점검 일정"],
    checks: ["학생 모국어", "한국어 수준", "담임/전담 역할", "학부모 소통 방법"]
  }
};

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
const pendingShopTranslationIds = new Set();
let editingShopItemId = null;

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

function formatDateTime(value, fallback = "저장됨") {
  if (!value) return fallback;
  const date = typeof value.toDate === "function" ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : date.toLocaleString("ko-KR");
}

function toMillis(value) {
  if (!value) return 0;
  const date = typeof value.toDate === "function" ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
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
  applyStudentLanguage(normalized);
  applyCheckinLanguage(normalized);
  if (currentUser?.role) renderHero(currentUser.role);
  renderMessages();
  renderStudentDashboard();
  renderTeacherStore();
}

function applyStudentLanguage(languageCode = "ko") {
  const normalized = normalizeLanguage(languageCode);
  Object.entries(studentUiTranslations).forEach(([id, translations]) => {
    const targetId = id === "messagePlaceholder" ? "messageInput" : id === "send" ? "sendMessage" : id;
    const element = $(`#${targetId}`);
    if (!element) return;
    const text = translations[normalized] || translations.ko;
    if (id === "messagePlaceholder") element.placeholder = text;
    else element.textContent = text;
  });
}

function getStudentUiText(key, languageCode = getViewerLanguageCode()) {
  const translations = studentUiTranslations[key];
  if (!translations) return "";
  const normalized = normalizeLanguage(languageCode);
  return translations[normalized] || translations.ko;
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
  const appLanguage = $("#appLanguage")?.value;
  if (document.body.classList.contains("logged-in") && appLanguage) return normalizeLanguage(appLanguage);
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

function getReplyTranslation(reply, targetCode) {
  const normalizedTarget = normalizeLanguage(targetCode);
  const sourceText = reply?.text || "";
  if (!sourceText) return "";
  if (reply?.translations?.[normalizedTarget]) return reply.translations[normalizedTarget];
  if (translationMemory[sourceText]?.[normalizedTarget]) return translationMemory[sourceText][normalizedTarget];
  if (normalizeLanguage(reply?.sourceLangCode || "ko") === normalizedTarget) return sourceText;
  return `[${languageNames[normalizedTarget]} 자동 번역 준비 중] ${sourceText}`;
}

function isCheckinReplyMessage(message) {
  return message?.type === "checkinReply";
}

function isBankTransactionMessage(message) {
  return message?.type === "bankTransaction";
}

function isShopItemMessage(message) {
  return message?.type === "shopItem";
}

function isShopPurchaseMessage(message) {
  return message?.type === "shopPurchase";
}

function isHiddenSystemMessage(message) {
  return isCheckinReplyMessage(message) || isBankTransactionMessage(message) || isShopItemMessage(message) || isShopPurchaseMessage(message);
}

function applyReplyMessagesToCheckins(checkins) {
  const replyMessages = getMessages().filter(isCheckinReplyMessage);
  replyMessages.forEach((message) => {
    const checkin = checkins.find((item) => (
      (message.checkinId && item.id === message.checkinId) ||
      (message.studentId && item.studentId === message.studentId && item.text === message.checkinText)
    ));
    if (!checkin) return;
    checkin.reply = {
      text: message.text,
      translations: message.translations,
      sourceLangCode: message.sourceLangCode,
      teacherId: message.senderId,
      teacherName: message.name || "교사",
      createdAt: message.createdAt
    };
  });
  return checkins;
}

function getBankTransactions() {
  return getMessages().filter(isBankTransactionMessage);
}

function getStudentBankTransactions(studentId = currentUser?.loginId) {
  return getBankTransactions()
    .filter((item) => item.studentId === studentId)
    .sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));
}

function getStudentBankBalance(studentId = currentUser?.loginId) {
  return getStudentBankTransactions(studentId).reduce((sum, item) => sum + Number(item.amount || 0), 0);
}

function getShopItems() {
  const itemMap = new Map(defaultShopItems.map((item) => [item.id, { ...item }]));
  getMessages().filter(isShopItemMessage).forEach((item) => {
    const itemId = item.itemId || item.id;
    if (!itemId) return;
    itemMap.set(itemId, {
      ...itemMap.get(itemId),
      ...item,
      id: itemId,
      itemId,
      active: item.active !== false
    });
  });
  return [...itemMap.values()]
    .filter((item) => item.active !== false)
    .sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));
}

function getShopPurchases() {
  return getMessages()
    .filter(isShopPurchaseMessage)
    .sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));
}

function getItemPurchaseCount(itemId) {
  return getShopPurchases().filter((purchase) => purchase.itemId === itemId).length;
}

function getItemRemainingStock(item) {
  const stock = Number(item.stock ?? -1);
  if (stock === -1) return -1;
  return Math.max(0, stock - getItemPurchaseCount(item.id));
}

function getUlimUnit(languageCode = getViewerLanguageCode()) {
  return normalizeLanguage(languageCode) === "ko" ? "울림" : "ULIM";
}

function formatUlim(amount, languageCode = getViewerLanguageCode()) {
  return `${Number(amount || 0).toLocaleString("ko-KR")} ${getUlimUnit(languageCode)}`;
}

function getShopCategoryLabel(category, languageCode = getViewerLanguageCode()) {
  const viewerLanguageCode = normalizeLanguage(languageCode);
  const labels = {
    privilege: { ko: "활동 특권", en: "Privilege", ja: "特典", zh: "活动特权", vi: "Đặc quyền", th: "สิทธิพิเศษ", mn: "Эрх", ru: "Привилегия" },
    supply: { ko: "학용품", en: "School Supply", ja: "学用品", zh: "学习用品", vi: "Đồ dùng học tập", th: "อุปกรณ์การเรียน", mn: "Хичээлийн хэрэгсэл", ru: "Школьные принадлежности" },
    experience: { ko: "학급 경험", en: "Class Experience", ja: "学級体験", zh: "班级体验", vi: "Trải nghiệm lớp học", th: "ประสบการณ์ในห้องเรียน", mn: "Ангийн туршлага", ru: "Классный опыт" },
    coupon: { ko: "쿠폰", en: "Coupon", ja: "クーポン", zh: "优惠券", vi: "Phiếu", th: "คูปอง", mn: "Купон", ru: "Купон" },
    "활동 특권": { ko: "활동 특권", en: "Privilege", ja: "特典", zh: "活动特权", vi: "Đặc quyền", th: "สิทธิพิเศษ", mn: "Эрх", ru: "Привилегия" },
    "학용품": { ko: "학용품", en: "School Supply", ja: "学用品", zh: "学习用品", vi: "Đồ dùng học tập", th: "อุปกรณ์การเรียน", mn: "Хичээлийн хэрэгсэл", ru: "Школьные принадлежности" },
    "학급 경험": { ko: "학급 경험", en: "Class Experience", ja: "学級体験", zh: "班级体验", vi: "Trải nghiệm lớp học", th: "ประสบการณ์ในห้องเรียน", mn: "Ангийн туршлага", ru: "Классный опыт" },
    "쿠폰": { ko: "쿠폰", en: "Coupon", ja: "クーポン", zh: "优惠券", vi: "Phiếu", th: "คูปอง", mn: "Купон", ru: "Купон" }
  };
  const entry = labels[category];
  if (entry) return entry[viewerLanguageCode] || entry.ko;
  return category || "상점 물건";
}

function normalizeShopCategory(category) {
  const map = {
    "활동 특권": "privilege",
    "학용품": "supply",
    "학급 경험": "experience",
    "쿠폰": "coupon"
  };
  return map[category] || category || "privilege";
}

function getShopItemName(item, languageCode = getViewerLanguageCode()) {
  const normalized = normalizeLanguage(languageCode);
  return item.nameTranslations?.[normalized] || item.itemNameTranslations?.[normalized] || item.translations?.[normalized] || item.nameTranslations?.ko || item.itemNameTranslations?.ko || item.name || item.itemName || "상점 물건";
}

function getShopItemDescription(item, languageCode = getViewerLanguageCode()) {
  const normalized = normalizeLanguage(languageCode);
  return item.descriptionTranslations?.[normalized] || item.descriptionTranslations?.ko || item.description || "";
}

function getShopItemRawName(item) {
  return item.name || item.nameTranslations?.ko || item.itemName || "상점 물건";
}

function getShopItemRawDescription(item) {
  return item.description || item.descriptionTranslations?.ko || "";
}

function shopItemNeedsTranslation(item, languageCode) {
  const normalized = normalizeLanguage(languageCode);
  if (normalized === "ko") return false;
  const hasName = Boolean(item.nameTranslations?.[normalized] || item.itemNameTranslations?.[normalized] || item.translations?.[normalized]);
  const hasDescription = !item.description || Boolean(item.descriptionTranslations?.[normalized]);
  return !hasName || !hasDescription;
}

async function ensureShopItemTranslations(item, languageCode = getViewerLanguageCode()) {
  const normalized = normalizeLanguage(languageCode);
  const itemId = item.itemId || item.id || item.name;
  if (!itemId || pendingShopTranslationIds.has(`${itemId}:${normalized}`) || !shopItemNeedsTranslation(item, normalized)) return;
  pendingShopTranslationIds.add(`${itemId}:${normalized}`);
  try {
    const nameTranslations = item.nameTranslations || item.itemNameTranslations || await translateMessageText(item.name || item.itemName || "상점 물건", "ko");
    const descriptionTranslations = item.descriptionTranslations || (item.description ? await translateMessageText(item.description, "ko") : buildTranslationBundle("", "ko"));
    const translatedItem = {
      ...item,
      id: itemId,
      itemId,
      type: "shopItem",
      nameTranslations,
      descriptionTranslations,
      text: `${item.name || item.itemName || "상점 물건"} · ${item.price || 0} 울림`,
      translatedAt: new Date().toISOString()
    };
    const messages = getMessages();
    messages.push(translatedItem);
    saveJson(STORAGE_KEYS.messages, messages);
    if (firebaseAvailable) {
      try {
        await addDoc(collection(db, "messages"), { ...translatedItem, createdAt: serverTimestamp() });
      } catch (error) {
        console.warn("Failed to persist translated shop item.", error);
      }
    }
    renderStudentStore();
    renderTeacherStore();
  } finally {
    pendingShopTranslationIds.delete(`${itemId}:${normalized}`);
  }
}

async function saveBankTransaction({ studentId, studentName, activityType, amount, reason }) {
  if (!studentId || !amount) return;
  const transaction = {
    type: "bankTransaction",
    title: "울림 성장 통장",
    name: "울림 통장",
    senderRole: "system",
    recipients: [studentId],
    recipientNames: [studentName || "학생"],
    studentId,
    studentName: studentName || "학생",
    activityType,
    amount,
    reason,
    text: `${reason} ${amount > 0 ? "+" : ""}${amount} 울림`,
    createdAt: new Date().toISOString()
  };
  const messages = getMessages();
  messages.push(transaction);
  saveJson(STORAGE_KEYS.messages, messages);
  if (firebaseAvailable) {
    try {
      await addDoc(collection(db, "messages"), { ...transaction, createdAt: serverTimestamp() });
    } catch (error) {
      console.warn("Failed to persist bank transaction.", error);
    }
  }
}

function mergeStudents(remoteStudents = []) {
  const byName = new Map(defaultStudents.map((student) => [student.name, { ...student }]));
  remoteStudents.forEach((student) => {
    const fallback = byName.get(student.name) || {};
    byName.set(student.name, { ...fallback, ...student });
  });
  return [...byName.values()];
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
  renderRecipientControls();
  renderTeacherCheckins();
  renderStudentDashboard();
  renderTeacherStore();
  renderDocumentWorkflow();
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
  const viewerLanguageCode = getViewerLanguageCode();
  $("#heroTitle").textContent = teacher ? "교사 업무와 학생 지원을 한 화면에서 관리합니다." : getStudentUiText("heroTitle", viewerLanguageCode);
  $("#heroText").textContent = teacher
    ? "도움 요청 학생을 먼저 확인하고, 선택한 학생에게 번역 메시지와 행정 문서 초안을 빠르게 준비할 수 있습니다."
    : getStudentUiText("heroText", viewerLanguageCode);
  $("#quickTitle").textContent = teacher ? "교사용 빠른 작업" : getStudentUiText("quickTitle", viewerLanguageCode);
  const items = teacher
    ? ["도움 요청 학생 확인", "선택 학생에게 메시지 보내기", "AI 행정 문서 초안 생성"]
    : [
      getStudentUiText("quickItemMood", viewerLanguageCode),
      getStudentUiText("quickItemGreeting", viewerLanguageCode),
      getStudentUiText("quickItemCulture", viewerLanguageCode)
    ];
  $("#todayList").innerHTML = items.map((item, index) => `<li><span>${index + 1}</span>${item}</li>`).join("");
  $("#heroActions").innerHTML = teacher
    ? `<a class="primary" href="#teacher">학생 관리 보기</a><a class="secondary" href="#ai-docs">AI 행정 문서</a>`
    : `<a class="primary" href="#student">${escapeHtml(getStudentUiText("heroPrimaryAction", viewerLanguageCode))}</a><a class="secondary" href="#lounge">${escapeHtml(getStudentUiText("heroSecondaryAction", viewerLanguageCode))}</a>`;
}

async function refreshFirebaseData() {
  if (!firebaseAvailable || !currentUser) return;
  if (currentUser.role === "teacher") {
    const studentSnap = await getDocs(collection(db, "students"));
    if (!studentSnap.empty) {
      const remoteStudents = studentSnap.docs.map((item) => ({ id: item.id, ...item.data() }));
      students = mergeStudents(remoteStudents);
    } else {
      students = mergeStudents([]);
    }
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
  const messageSnap = await getDocs(query(collection(db, "messages"), orderBy("createdAt", "desc"), limit(100)));
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
    .filter((message) => !isHiddenSystemMessage(message))
    .filter((message) => activeFilter === "all" || message.lang === activeFilter);
  box.innerHTML = "";
  messages.forEach((message) => {
    const sourceCode = getMessageSourceCode(message);
    const translatedText = getMessageTranslation(message, viewerLanguageCode);
    const sourceLabel = languageNames[sourceCode] || message.lang || "원문";
    const viewerLabel = languageNames[viewerLanguageCode] || "한국어";
    const sameLanguage = sourceCode === viewerLanguageCode;
    const metaText = sameLanguage
      ? getStudentUiText("sameLanguageNotice", viewerLanguageCode)
      : `${viewerLabel} ${getStudentUiText("translationLabel", viewerLanguageCode)} / ${getStudentUiText("originalLabel", viewerLanguageCode)}(${sourceLabel}): ${message.text}`;
    const item = document.createElement("article");
    item.className = "msg";
    item.innerHTML = `
      <strong>${escapeHtml(message.title || message.name)}<small>${escapeHtml(sourceLabel)}</small></strong>
      <p>${escapeHtml(translatedText)}</p>
      <small>${escapeHtml(metaText)}</small>
    `;
    box.appendChild(item);
  });
  box.scrollTop = box.scrollHeight;
}

function getStudentCheckins() {
  const studentId = currentUser?.loginId;
  const studentName = currentUser?.name;
  return getCheckins()
    .filter((checkin) => !studentId || checkin.studentId === studentId || checkin.studentName === studentName)
    .slice(0, 20);
}

function renderStudentTeacherMessages() {
  const list = $("#studentTeacherMessages");
  if (!list) return;
  const viewerLanguageCode = getViewerLanguageCode();
  const teacherMessages = getMessages()
    .filter((message) => message.senderRole === "teacher" || message.type === "teacher")
    .filter((message) => !isHiddenSystemMessage(message))
    .filter(canViewMessage)
    .slice(-10)
    .reverse();
  if (!teacherMessages.length) {
    list.innerHTML = `<p class="muted">${escapeHtml(getStudentUiText("teacherMessageEmpty", viewerLanguageCode))}</p>`;
    return;
  }
  list.innerHTML = teacherMessages.map((message) => {
    const sentAt = formatDateTime(message.createdAt, "방금 전");
    const translatedText = getMessageTranslation(message, viewerLanguageCode);
    return `
      <article class="reply-card teacher-message-card">
        <strong>${escapeHtml(message.title || getStudentUiText("teacherMessageDefaultTitle", viewerLanguageCode))} <small>${escapeHtml(sentAt)}</small></strong>
        <p>${escapeHtml(translatedText)}</p>
        <small>${escapeHtml(getStudentUiText("senderLabel", viewerLanguageCode))}: ${escapeHtml(message.name || getStudentUiText("teacherDefaultName", viewerLanguageCode))}</small>
      </article>
    `;
  }).join("");
}

function renderStudentBank() {
  const balance = $("#bankBalance");
  const rules = $("#bankRules");
  const history = $("#bankHistory");
  if (!balance || !rules || !history) return;
  const studentId = currentUser?.loginId || "demo";
  const viewerLanguageCode = getViewerLanguageCode();
  const transactions = getStudentBankTransactions(studentId);
  balance.textContent = formatUlim(getStudentBankBalance(studentId), viewerLanguageCode);
  rules.innerHTML = bankRewardRules.map((rule) => `
    <article class="bank-rule">
      <strong>+${rule.amount}</strong>
      <span>${escapeHtml(rule.title[viewerLanguageCode] || rule.title.ko)}</span>
      <small>${escapeHtml(rule.description[viewerLanguageCode] || rule.description.ko)}</small>
    </article>
  `).join("");
  if (!transactions.length) {
    history.innerHTML = `<p class="muted">${escapeHtml(getStudentUiText("bankEmpty", viewerLanguageCode))}</p>`;
    return;
  }
  history.innerHTML = transactions.slice(0, 8).map((item) => {
    const amount = Number(item.amount || 0);
    const sign = amount > 0 ? "+" : "";
    return `
      <article class="bank-entry">
        <span class="${amount < 0 ? "negative" : ""}">${sign}${Number(Math.abs(amount)).toLocaleString("ko-KR")} ${getUlimUnit(viewerLanguageCode)}</span>
        <strong>${escapeHtml(bankRewardRules.find((rule) => rule.type === item.activityType)?.title[viewerLanguageCode] || item.reason || "활동 적립")}</strong>
        <small>${escapeHtml(formatDateTime(item.createdAt, "방금 전"))}</small>
      </article>
    `;
  }).join("");
}

function renderStudentStore() {
  const list = $("#studentStoreItems");
  const balance = $("#storeBalance");
  const count = $("#storeCount");
  const history = $("#studentPurchaseHistory");
  if (!list || !balance || !count || !history) return;
  const viewerLanguageCode = getViewerLanguageCode();
  const studentId = currentUser?.loginId || "demo";
  const points = getStudentBankBalance(studentId);
  const items = getShopItems();
  const purchases = getShopPurchases().filter((purchase) => purchase.studentId === studentId || purchase.studentName === currentUser?.name);
  balance.textContent = formatUlim(points, viewerLanguageCode);
  count.textContent = `${items.length}개`;
  if (!items.length) {
    list.innerHTML = `<p class="muted">${escapeHtml(getStudentUiText("storeEmpty", viewerLanguageCode))}</p>`;
  } else {
    list.innerHTML = items.map((item) => {
      if (shopItemNeedsTranslation(item, viewerLanguageCode)) ensureShopItemTranslations(item, viewerLanguageCode);
      const price = Number(item.price || 0);
      const remaining = getItemRemainingStock(item);
      const hasStock = remaining === -1 || remaining > 0;
      const canBuy = points >= price && hasStock;
      const buttonText = hasStock ? (points >= price ? getStudentUiText("purchaseButton", viewerLanguageCode) : getStudentUiText("insufficientPoints", viewerLanguageCode)) : getStudentUiText("soldOut", viewerLanguageCode);
      const stockText = remaining === -1 ? getStudentUiText("unlimitedStock", viewerLanguageCode) : `${remaining}`;
      const itemName = getShopItemName(item, viewerLanguageCode);
      const itemDescription = getShopItemDescription(item, viewerLanguageCode);
      return `
        <article class="store-item-card">
          <div class="store-item-top">
            <span class="store-item-icon">${escapeHtml(item.emoji || "상")}</span>
            <span class="tag">${escapeHtml(getShopCategoryLabel(item.category, viewerLanguageCode))}</span>
          </div>
          <strong>${escapeHtml(itemName)}</strong>
          <p>${escapeHtml(itemDescription)}</p>
          <div class="store-item-meta">
            <span>${escapeHtml(getStudentUiText("stockLabel", viewerLanguageCode))}: ${escapeHtml(stockText)}</span>
            <strong>${escapeHtml(formatUlim(price, viewerLanguageCode))}</strong>
          </div>
          <button class="primary full buy-shop-item" type="button" data-item-id="${escapeHtml(item.id)}" ${canBuy ? "" : "disabled"}>${escapeHtml(buttonText)}</button>
        </article>
      `;
    }).join("");
  }
  if (!purchases.length) {
    history.innerHTML = `<p class="muted">${escapeHtml(getStudentUiText("purchaseEmpty", viewerLanguageCode))}</p>`;
  } else {
    history.innerHTML = purchases.slice(0, 6).map((purchase) => `
      <article class="purchase-entry">
        <strong>${escapeHtml(getShopItemName(getShopItems().find((item) => item.id === purchase.itemId) || purchase, viewerLanguageCode))}</strong>
        <span>${escapeHtml(formatUlim(purchase.totalPrice || purchase.price, viewerLanguageCode))}</span>
        <small>${escapeHtml(formatDateTime(purchase.createdAt, "방금 전"))} · ${escapeHtml(getStudentUiText("deliveredWaiting", viewerLanguageCode))}</small>
      </article>
    `).join("");
  }
  $$(".buy-shop-item").forEach((button) => {
    button.addEventListener("click", () => buyShopItem(button.dataset.itemId));
  });
}

function renderTeacherStore() {
  const itemList = $("#teacherShopItems");
  const purchaseList = $("#teacherPurchaseList");
  if (!itemList || !purchaseList) return;
  const items = getShopItems();
  if (!items.length) {
    itemList.innerHTML = `<p class="muted">등록된 판매 물건이 없습니다. 왼쪽에서 물건을 올려 보세요.</p>`;
  } else {
    itemList.innerHTML = items.map((item) => {
      const remaining = getItemRemainingStock(item);
      const stockText = remaining === -1 ? "무제한" : `${remaining}개 남음`;
      return `
        <article class="store-item-card teacher-store-card">
          <div class="store-item-top">
            <span class="store-item-icon">${escapeHtml(item.emoji || "상")}</span>
            <span class="tag">${escapeHtml(getShopCategoryLabel(item.category))}</span>
          </div>
          <strong>${escapeHtml(item.name || "상점 물건")}</strong>
          <p>${escapeHtml(item.description || "")}</p>
          <div class="store-item-meta">
            <span>재고: ${escapeHtml(stockText)}</span>
            <strong>${escapeHtml(formatUlim(item.price))}</strong>
          </div>
          <small>구매 ${getItemPurchaseCount(item.id)}건</small>
          <div class="store-actions">
            <button class="secondary edit-shop-item" type="button" data-item-id="${escapeHtml(item.id)}">수정</button>
            <button class="secondary danger delete-shop-item" type="button" data-item-id="${escapeHtml(item.id)}">삭제</button>
          </div>
        </article>
      `;
    }).join("");
  }
  $$(".edit-shop-item").forEach((button) => {
    button.addEventListener("click", () => startEditShopItem(button.dataset.itemId));
  });
  $$(".delete-shop-item").forEach((button) => {
    button.addEventListener("click", () => deleteShopItem(button.dataset.itemId));
  });
  const purchases = getShopPurchases();
  if (!purchases.length) {
    purchaseList.innerHTML = `<p class="muted">아직 학생 구매 내역이 없습니다.</p>`;
    return;
  }
  purchaseList.innerHTML = purchases.slice(0, 20).map((purchase) => `
    <article class="purchase-entry">
      <strong>${escapeHtml(purchase.studentName || purchase.studentId || "학생")} · ${escapeHtml(purchase.itemName || "상점 물건")}</strong>
      <span>${escapeHtml(formatUlim(purchase.totalPrice || purchase.price))}</span>
      <small>${escapeHtml(formatDateTime(purchase.createdAt, "방금 전"))} · 지급 대기</small>
    </article>
  `).join("");
}

function renderStudents() {
  const list = $("#studentList");
  if (!list) return;
  list.innerHTML = "";
  const filteredStudents = students.filter((student) => {
    const language = student.lang || student.language || "-";
    const status = student.status || "확인";
    const languageMatches = studentLanguageFilter === "all" || language === studentLanguageFilter;
    const statusMatches = studentStatusFilter === "all" || status.includes(studentStatusFilter);
    return languageMatches && statusMatches;
  });
  if (!filteredStudents.length) {
    list.innerHTML = `<p class="empty-state">조건에 맞는 학생이 없습니다.</p>`;
    renderRecipientControls();
    return;
  }
  filteredStudents.forEach((student) => {
    const studentId = getStudentId(student);
    const latestCheckin = getLatestCheckinForStudent(student);
    const latestMood = latestCheckin ? getMoodByKey(latestCheckin.moodKey || latestCheckin.mood).ko : "기록 없음";
    const latestText = latestCheckin ? getCheckinTranslation(latestCheckin, getViewerLanguageCode()) : "최근 체크인 없음";
    const helpRequested = latestCheckin?.help || student.status?.includes("도움");
    const card = document.createElement("article");
    const isDanger = student.status?.includes("도움") || student.status?.includes("관찰");
    card.className = `student-card${selectedStudentIds.has(studentId) ? " selected" : ""}`;
    card.innerHTML = `
      <label class="student-check">
        <input class="student-select" type="checkbox" data-student-id="${escapeHtml(studentId)}" ${selectedStudentIds.has(studentId) ? "checked" : ""} />
        <span>메시지 대상</span>
      </label>
      <div class="student-main">
        <strong>${escapeHtml(student.name)}</strong>
        <small>${escapeHtml(student.grade || "-")} · ${escapeHtml(student.classroom || "-")}</small>
        <small>통장 ${formatUlim(getStudentBankBalance(studentId), getViewerLanguageCode())}</small>
      </div>
      <div class="student-meta">
        <span>${escapeHtml(student.lang || student.language || "-")}</span>
        <span class="tag ${isDanger ? "danger" : ""}">${escapeHtml(student.status || "확인")}</span>
        <span class="tag ${helpRequested ? "danger" : ""}">${helpRequested ? "도움 필요" : "도움 없음"}</span>
      </div>
      <div class="student-latest">
        <span class="student-mood">${escapeHtml(latestMood)}</span>
        <small>${escapeHtml(latestText)}</small>
      </div>
      <button class="secondary" type="button" data-student="${escapeHtml(student.name)}">상담 메모</button>
    `;
    list.appendChild(card);
  });
  $$(".student-select").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) selectedStudentIds.add(checkbox.dataset.studentId);
      else selectedStudentIds.delete(checkbox.dataset.studentId);
      renderStudents();
      renderRecipientSummary();
    });
  });
  $$('[data-student]').forEach((button) => {
    button.addEventListener("click", () => {
      const student = students.find((item) => item.name === button.dataset.student);
      showToast(`${student.name} 학생 메모: ${student.note || "메모 없음"}`);
    });
  });
  renderRecipientControls();
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

function getStudentForCheckin(checkin) {
  return students.find((student) => (
    getStudentId(student) === checkin.studentId ||
    student.loginId === checkin.studentId ||
    student.name === checkin.studentName
  ));
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

function renderRecipientControls() {
  renderRecipientSummary();
  const picker = $("#recipientPicker");
  if (!picker) return;
  picker.innerHTML = `<option value="">학생 선택</option>${students.map((student) => {
    const studentId = getStudentId(student);
    const selectedText = selectedStudentIds.has(studentId) ? "선택됨" : "미선택";
    return `<option value="${escapeHtml(studentId)}">${escapeHtml(student.name)} · ${escapeHtml(student.lang || student.language || "-")} · ${selectedText}</option>`;
  }).join("")}`;
}

function getCheckins() {
  const checkins = recentCheckins.length ? recentCheckins : loadJson(STORAGE_KEYS.checkins, []);
  return applyReplyMessagesToCheckins(checkins);
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
    const replyStatus = checkin.reply?.text ? "저장된 답장" : "새 답장";
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
          <p><strong>${replyStatus}</strong>${reply ? `<br>${escapeHtml(reply)}` : "<br>아직 답장이 없습니다."}</p>
          <textarea class="reply-input" data-checkin-index="${index}" placeholder="학생에게 보낼 답장을 입력하세요."></textarea>
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

function renderStudentCheckinHistory() {
  const list = $("#studentCheckinHistory");
  if (!list) return;
  const viewerLanguageCode = getViewerLanguageCode();
  const checkins = getStudentCheckins();
  if (!checkins.length) {
    list.innerHTML = `<p class="muted">${escapeHtml(getStudentUiText("noCheckins", viewerLanguageCode))}</p>`;
    return;
  }
  list.innerHTML = checkins.map((checkin) => {
    const mood = getMoodByKey(checkin.moodKey || checkin.mood);
    const createdAt = formatDateTime(checkin.createdAt, "저장됨");
    const replyDate = formatDateTime(checkin.reply?.createdAt, "");
    const viewerText = getCheckinTranslation(checkin, viewerLanguageCode);
    const replyText = getReplyTranslation(checkin.reply, viewerLanguageCode);
    const replyHtml = checkin.reply?.text
      ? `<div class="teacher-reply"><strong>${escapeHtml(getStudentUiText("teacherReplyLabel", viewerLanguageCode))} <small>${escapeHtml(replyDate)}</small></strong><p>${escapeHtml(replyText)}</p></div>`
      : `<div class="teacher-reply waiting"><strong>${escapeHtml(getStudentUiText("teacherReplyLabel", viewerLanguageCode))}</strong><p>${escapeHtml(getStudentUiText("replyWaiting", viewerLanguageCode))}</p></div>`;
    return `
      <article class="reply-card checkin-history-card">
        <strong>${escapeHtml(mood.ko)} <small>${escapeHtml(createdAt)}</small></strong>
        <p>${escapeHtml(viewerText)}</p>
        <small>${escapeHtml(getStudentUiText("originalLabel", viewerLanguageCode))}: ${escapeHtml(checkin.text || "내용 없음")} · ${escapeHtml(checkin.help ? getStudentUiText("helpRequestedLabel", viewerLanguageCode) : getStudentUiText("regularRecordLabel", viewerLanguageCode))}</small>
        ${replyHtml}
      </article>
    `;
  }).join("");
}

function renderStudentDashboard() {
  renderStudentBank();
  renderStudentTeacherMessages();
  renderStudentCheckinHistory();
  renderStudentStore();
}

async function saveCheckinReply(index) {
  const checkins = getCheckins();
  const checkin = checkins[index];
  const input = $(`.reply-input[data-checkin-index="${index}"]`);
  const button = $(`.reply-save[data-checkin-index="${index}"]`);
  const text = input?.value.trim();
  if (!checkin || !text) return showToast("답장 내용을 입력해 주세요.");
  const sourceLangCode = getViewerLanguageCode();
  if (button) {
    button.disabled = true;
    button.textContent = "저장 중";
  }
  try {
    const translations = await translateMessageText(text, sourceLangCode);
    const reply = {
      text,
      translations,
      sourceLangCode,
      teacherId: currentUser?.loginId || "teacher",
      teacherName: currentUser?.name || "교사",
      createdAt: new Date().toISOString()
    };
    checkin.reply = reply;
    recentCheckins = checkins;
    saveJson(STORAGE_KEYS.checkins, checkins);
    const replyMessage = {
      type: "checkinReply",
      title: "체크인 답장",
      name: reply.teacherName,
      senderId: reply.teacherId,
      senderRole: "teacher",
      recipients: [checkin.studentId || "demo"],
      recipientNames: [checkin.studentName || "학생"],
      checkinId: checkin.id || null,
      checkinText: checkin.text || "",
      studentId: checkin.studentId || "demo",
      studentName: checkin.studentName || "학생",
      lang: languageKoreanNames[sourceLangCode],
      sourceLangCode,
      text,
      translations,
      createdAt: reply.createdAt
    };
    const messages = getMessages();
    messages.push(replyMessage);
    saveJson(STORAGE_KEYS.messages, messages);
    await saveBankTransaction({
      studentId: checkin.studentId || "demo",
      studentName: checkin.studentName || "학생",
      activityType: "teacherReply",
      amount: 10,
      reason: "선생님 답장 연결"
    });
    let persistedToCloud = false;
    if (firebaseAvailable) {
      try {
        await addDoc(collection(db, "messages"), { ...replyMessage, createdAt: serverTimestamp() });
        persistedToCloud = true;
      } catch (error) {
        console.warn("Failed to persist check-in reply message to Firestore.", error);
      }
    }
    if (input) input.value = "";
    renderTeacherCheckins();
    renderStudentDashboard();
    const student = getStudentForCheckin(checkin);
    const studentLang = student ? getStudentLanguageCode(student) : normalizeLanguage(checkin.sourceLangCode || "ko");
    const storageText = firebaseAvailable && !persistedToCloud ? "브라우저에 임시 저장했습니다." : "저장했습니다.";
    showToast(`${checkin.studentName || "학생"}에게 답장을 보냈고 ${storageText} 학생 화면에는 ${languageNames[studentLang]}로 표시됩니다.`);
  } catch (error) {
    console.error(error);
    showToast("답장 저장 중 오류가 발생했습니다. Firebase 연결을 확인해 주세요.");
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = "답장 저장";
    }
  }
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
    await saveBankTransaction({
      studentId: checkin.studentId,
      studentName: checkin.studentName,
      activityType: checkin.help ? "helpCheckin" : "checkin",
      amount: checkin.help ? 50 : 30,
      reason: checkin.help ? "도움 요청 체크인" : "오늘 체크인"
    });
    renderTeacherCheckins();
    renderStudentDashboard();
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
    if (currentUser?.role === "student") {
      await saveBankTransaction({
        studentId: currentUser.loginId,
        studentName: currentUser.name,
        activityType: "loungeMessage",
        amount: 15,
        reason: "다국어 라운지 소통"
      });
    }
    input.value = "";
    renderMessages();
    renderStudentDashboard();
    showToast("라운지에 메시지를 보냈습니다.");
  } finally {
    sendButton.disabled = false;
    sendButton.textContent = getStudentUiText("send");
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

async function addShopItem() {
  const button = $("#addShopItem");
  const name = $("#shopItemName").value.trim();
  const price = Number($("#shopItemPrice").value);
  const stockValue = $("#shopItemStock").value.trim();
  const stock = stockValue === "" ? -1 : Number(stockValue);
  const category = $("#shopItemCategory").value;
  const description = $("#shopItemDescription").value.trim();
  if (!name) return showToast("판매 물건 이름을 입력해 주세요.");
  if (!Number.isFinite(price) || price <= 0) return showToast("가격은 1 울림 이상으로 입력해 주세요.");
  if (!Number.isFinite(stock)) return showToast("재고는 숫자로 입력해 주세요. 무제한은 -1입니다.");
  if (button) {
    button.disabled = true;
    button.textContent = "번역 중";
  }
  const wasEditing = Boolean(editingShopItemId);
  const itemId = editingShopItemId || `shop-${Date.now()}`;
  try {
    const nameTranslations = await translateMessageText(name, "ko");
    const descriptionTranslations = description ? await translateMessageText(description, "ko") : buildTranslationBundle("", "ko");
    const item = {
      id: itemId,
      itemId,
      type: "shopItem",
      title: "학급 상점 물건",
      name,
      price,
      stock,
      category,
      description,
      nameTranslations,
      descriptionTranslations,
      active: true,
      senderId: currentUser?.loginId || "teacher",
      senderRole: "teacher",
      sourceLangCode: "ko",
      text: `${name} · ${price} 울림`,
      updatedAt: editingShopItemId ? new Date().toISOString() : null,
      createdAt: new Date().toISOString()
    };
    const messages = getMessages();
    messages.push(item);
    saveJson(STORAGE_KEYS.messages, messages);
    if (firebaseAvailable) {
      try {
        await addDoc(collection(db, "messages"), { ...item, createdAt: serverTimestamp() });
      } catch (error) {
        console.warn("Failed to persist shop item.", error);
        showToast("상점 물건을 브라우저에 임시 저장했습니다. Firebase 권한을 확인해 주세요.");
      }
    }
    $("#shopItemName").value = "";
    $("#shopItemPrice").value = "";
    $("#shopItemStock").value = "-1";
    $("#shopItemDescription").value = "";
    resetShopForm();
    renderTeacherStore();
    renderStudentStore();
    showToast(wasEditing ? "판매 물건을 수정했습니다." : "학급 상점에 판매 물건을 올렸습니다.");
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = editingShopItemId ? "수정 저장" : "상점에 올리기";
    }
  }
}

function startEditShopItem(itemId) {
  const item = getShopItems().find((candidate) => candidate.id === itemId);
  if (!item) return showToast("수정할 물건을 찾을 수 없습니다.");
  editingShopItemId = itemId;
  $("#shopFormTitle").textContent = "판매 물건 수정";
  $("#shopItemName").value = getShopItemRawName(item);
  $("#shopItemPrice").value = Number(item.price || 0);
  $("#shopItemStock").value = Number(item.stock ?? -1);
  $("#shopItemCategory").value = normalizeShopCategory(item.category);
  $("#shopItemDescription").value = getShopItemRawDescription(item);
  $("#addShopItem").textContent = "수정 저장";
  $("#cancelShopEdit").hidden = false;
  location.hash = "#teacher-store";
  showToast(`${getShopItemRawName(item)} 물건을 수정합니다.`);
}

function resetShopForm() {
  editingShopItemId = null;
  $("#shopFormTitle").textContent = "판매 물건 올리기";
  $("#addShopItem").textContent = "상점에 올리기";
  $("#cancelShopEdit").hidden = true;
}

async function deleteShopItem(itemId) {
  const item = getShopItems().find((candidate) => candidate.id === itemId);
  if (!item) return showToast("삭제할 물건을 찾을 수 없습니다.");
  if (!confirm(`${getShopItemRawName(item)} 물건을 삭제할까요?`)) return;
  const deletedItem = {
    ...item,
    id: itemId,
    itemId,
    type: "shopItem",
    active: false,
    deletedAt: new Date().toISOString(),
    deletedBy: currentUser?.loginId || "teacher",
    createdAt: new Date().toISOString()
  };
  const messages = getMessages();
  messages.push(deletedItem);
  saveJson(STORAGE_KEYS.messages, messages);
  if (firebaseAvailable) {
    try {
      await addDoc(collection(db, "messages"), { ...deletedItem, createdAt: serverTimestamp() });
    } catch (error) {
      console.warn("Failed to persist deleted shop item.", error);
      showToast("삭제 기록을 브라우저에 임시 저장했습니다. Firebase 권한을 확인해 주세요.");
    }
  }
  if (editingShopItemId === itemId) {
    $("#shopItemName").value = "";
    $("#shopItemPrice").value = "";
    $("#shopItemStock").value = "-1";
    $("#shopItemDescription").value = "";
    resetShopForm();
  }
  renderTeacherStore();
  renderStudentStore();
  showToast(`${getShopItemRawName(item)} 물건을 삭제했습니다.`);
}

async function buyShopItem(itemId) {
  const item = getShopItems().find((candidate) => candidate.id === itemId);
  if (!item) return showToast("판매 물건을 찾을 수 없습니다.");
  const studentId = currentUser?.loginId || "demo";
  const studentName = currentUser?.name || "학생";
  const price = Number(item.price || 0);
  const balance = getStudentBankBalance(studentId);
  const remaining = getItemRemainingStock(item);
  if (remaining !== -1 && remaining <= 0) return showToast("재고가 없습니다.");
  if (balance < price) return showToast(`포인트가 부족합니다. 현재 ${formatUlim(balance, getViewerLanguageCode())}입니다.`);
  const purchase = {
    id: `purchase-${Date.now()}`,
    type: "shopPurchase",
    title: "학급 상점 구매",
    name: studentName,
    senderId: studentId,
    senderRole: "student",
    recipients: [studentId],
    recipientNames: [studentName],
    studentId,
    studentName,
    itemId: item.id,
    itemName: item.name,
    itemNameTranslations: item.nameTranslations || buildTranslationBundle(item.name || "상점 물건", "ko"),
    itemCategory: item.category,
    quantity: 1,
    price,
    totalPrice: price,
    delivered: false,
    sourceLangCode: "ko",
    text: `${studentName} ${item.name} 구매`,
    createdAt: new Date().toISOString()
  };
  const messages = getMessages();
  messages.push(purchase);
  saveJson(STORAGE_KEYS.messages, messages);
  await saveBankTransaction({
    studentId,
    studentName,
    activityType: "shopPurchase",
    amount: -price,
    reason: `${item.name} 구매`
  });
  if (firebaseAvailable) {
    try {
      await addDoc(collection(db, "messages"), { ...purchase, createdAt: serverTimestamp() });
    } catch (error) {
      console.warn("Failed to persist shop purchase.", error);
      showToast("구매 내역을 브라우저에 임시 저장했습니다. Firebase 권한을 확인해 주세요.");
    }
  }
  renderStudentDashboard();
  renderTeacherStore();
  updateStats();
  showToast(`${item.name} 구매가 완료되었습니다. 선생님 구매 내역에 표시됩니다.`);
}

async function generateDoc() {
  const file = $("#hwpFile").files[0];
  const type = $("#docType").value;
  const date = $("#docDate").value || "추후 안내";
  const target = $("#docTarget").value.trim() || "이주 배경학생 및 학부모";
  const prompt = $("#docPrompt").value.trim() || "학생의 언어 배경을 고려하여 쉬운 한국어 안내와 번역 지원을 함께 제공합니다.";
  const guide = getDocumentTypeGuide(type);
  const fileAnalysis = analyzeUploadedDocument(file);
  const result = `${type} HWPX 문서 생성 조건 정리

1. 업로드 양식 분석
- 파일명: ${fileAnalysis.name}
- 파일 형식: ${fileAnalysis.extension}
- 분석 상태: ${fileAnalysis.status}
- 양식 확인 항목: ${fileAnalysis.checks.join(", ")}

2. 작업 목적
- ${guide.purpose}

3. 생성 문서 기본 조건
- 일정: ${date}
- 대상: ${target}
- 핵심 내용: ${prompt}

4. 문서 구성 권장 목차
${guide.sections.map((section, index) => `${index + 1}. ${section}`).join("\n")}

5. HWPX 생성 전 확인할 조건
${guide.checks.map((check) => `- ${check}`).join("\n")}
- 기존 양식의 제목/본문/표/서명란 위치 유지
- 학교명, 학년, 담당자, 문의처 등 고정 문구 확인
- 개인정보는 필요한 범위만 사용

6. 이주 배경학생 지원 반영
- 쉬운 한국어 문장 사용
- 필요 시 학생/학부모 모국어 번역본 병행
- 핵심 어휘와 일정은 표 또는 짧은 문장으로 정리
- 안내 대상이 학생인지 학부모인지 구분

7. 다음 단계
- 업로드한 HWPX 양식의 구조를 서버에서 파싱
- 위 조건을 바탕으로 본문 텍스트 생성
- 원본 양식의 서식은 유지하고 텍스트 영역만 치환
- 완성본을 새 HWPX 파일로 다운로드하도록 연결`;
  $("#docResult").textContent = result;
  const documentRecord = { teacherId: currentUser?.loginId || "demo", type, date, target, prompt, result, fileName: file?.name || null, fileAnalysis, createdAt: new Date().toISOString() };
  const documents = loadJson(STORAGE_KEYS.documents, []);
  documents.push(documentRecord);
  saveJson(STORAGE_KEYS.documents, documents);
  if (firebaseAvailable) await addDoc(collection(db, "documents"), { ...documentRecord, createdAt: serverTimestamp() });
  showToast("문서 생성 조건을 정리했습니다.");
}

function getDocumentTypeGuide(type) {
  return documentTypeGuides[type] || documentTypeGuides["가정통신문"];
}

function analyzeUploadedDocument(file) {
  if (!file) {
    return {
      name: "업로드 문서 없음",
      extension: "미확인",
      status: "기존 양식 없이 새 문서 조건만 정리합니다.",
      checks: ["제목 위치", "본문 영역", "결재/서명란", "표 삽입 여부"]
    };
  }
  const extension = file.name.split(".").pop()?.toLowerCase() || "미확인";
  const isHwpx = extension === "hwpx";
  return {
    name: file.name,
    extension: extension.toUpperCase(),
    status: isHwpx ? "HWPX 양식으로 인식했습니다. 구조 분석과 텍스트 치환 대상으로 사용할 수 있습니다." : "참고 문서로 인식했습니다. 최종 HWPX 생성을 위해서는 HWPX 양식 업로드가 권장됩니다.",
    checks: isHwpx
      ? ["문서 XML 구조", "본문 문단", "표/셀", "머리말/꼬리말", "이미지와 서명란"]
      : ["본문 텍스트", "제목", "표 형식", "서식 참고 요소"]
  };
}

function renderDocumentWorkflow() {
  const type = $("#docType")?.value || "가정통신문";
  const file = $("#hwpFile")?.files?.[0];
  const guide = getDocumentTypeGuide(type);
  const analysis = analyzeUploadedDocument(file);
  const analysisBox = $("#docAnalysis");
  const checklist = $("#docChecklist");
  if (analysisBox) {
    analysisBox.innerHTML = `
      <strong>${escapeHtml(analysis.name)}</strong>
      <span>${escapeHtml(analysis.extension)} · ${escapeHtml(analysis.status)}</span>
    `;
  }
  if (checklist) {
    checklist.innerHTML = `
      <strong>${escapeHtml(type)} 생성 조건</strong>
      <ul>
        ${guide.checks.map((check) => `<li>${escapeHtml(check)}</li>`).join("")}
      </ul>
    `;
  }
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
    if (currentUser) {
      currentUser.languageCode = languageCode;
      currentUser.language = languageNames[languageCode];
      saveJson(STORAGE_KEYS.session, currentUser);
    }
    applyMenuLanguage(languageCode);
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
  $("#addRecipient").addEventListener("click", () => {
    const picker = $("#recipientPicker");
    const studentId = picker.value;
    if (!studentId) return showToast("추가할 학생을 선택해 주세요.");
    selectedStudentIds.add(studentId);
    picker.value = "";
    renderStudents();
    showToast("메시지 대상에 학생을 추가했습니다.");
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
  $("#addShopItem").addEventListener("click", addShopItem);
  $("#cancelShopEdit").addEventListener("click", () => {
    $("#shopItemName").value = "";
    $("#shopItemPrice").value = "";
    $("#shopItemStock").value = "-1";
    $("#shopItemDescription").value = "";
    resetShopForm();
    showToast("상점 물건 수정을 취소했습니다.");
  });
  $("#hwpFile").addEventListener("change", renderDocumentWorkflow);
  $("#docType").addEventListener("change", renderDocumentWorkflow);
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
  renderStudentDashboard();
  renderTeacherStore();
  updateStats();
  setupFilters();
  setupEvents();
  restoreSession();
}

boot();
