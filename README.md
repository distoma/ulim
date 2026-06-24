# 울림(ULIM): 이주 배경학생 통합 지원 홈페이지

이 프로젝트는 기존 하루 체크인 아이디어를 확장해 이주 배경학생, 교사, 학부모 지원 흐름을 한곳에 모은 정적 홈페이지 프로토타입입니다.

## 현재 배포 정보

- GitHub 저장소: https://github.com/distoma/ulim
- 홈페이지: https://distoma.github.io/ulim/
- Firebase project ID: `ulim-3f09e`
- Firebase Functions region: `asia-northeast3`
- Functions runtime: `nodejs22`
- 번역 함수: `translateMessage`
- HWPX 문서 생성 함수: `generateHwpxDocument`

## 실행 방법

1. `index.html` 파일을 브라우저에서 엽니다.
2. 처음에는 로그인 화면이 보입니다.
3. Firebase 설정 전에는 아래 체험 계정으로 로그인할 수 있습니다.
   - 학생: `student01 / 1234`
   - 교사: `teacher01 / 1234`
4. Firebase 설정값을 `app.js`의 `firebaseConfig`에 넣으면 Firestore 기반 로그인과 자료 저장을 사용합니다.

## 주요 기능

- 초기 로그인 화면에서 학생/교사 역할 선택
- 로그인 화면과 메인 화면에서 모국어 선택
- 모국어 선택 시 홈페이지 메뉴를 선택 언어 / 한국어 형식으로 표시
- 다국어 라운지 글을 접속 학생의 모국어 기준 번역문으로 우선 표시
- 학생 체크인 메뉴와 기분 선택지를 모국어 / 한국어 형식으로 표시
- 체크인 기록을 Firestore `checkins`에 원문, 원문 언어, 한국어 번역 필드와 함께 저장
- 교사 화면에서 학생 체크인 기록을 교사 모국어 번역과 원문으로 함께 확인
- 교사 화면에서 학생 정보를 언어/상태별로 정리하고 최근 체크인과 도움 요청 여부를 한눈에 확인
- 교사가 학생 체크인 기록에 답장을 남기고, 학생 화면에서 선생님 답장 확인
- 교사가 학생 관리 목록에서 학생을 선택해 번역 메시지를 발송
- 체크인, 도움 요청, 라운지 소통, 교사 답장 연결을 `울림 성장 통장`에 적립하여 학생 활동 독려
- 교사가 학급상점 물품을 등록/수정/삭제하고, 학생은 울림 포인트로 구매
- 학급상점 물품명과 설명을 학생 모국어에 맞춰 자동 번역 표시
- 학생 로그인 시 학생 도움 공간, 체크인, 다국어 대화 라운지만 표시
- 학생 화면에서 선생님에게 받은 메시지, 본인 체크인 기록, 선생님 답장 확인
- 교사 로그인 시 학생 관리창, 학생 메시지 발송, AI 행정 문서 생성, DB 설계 안내 표시
- 교사 화면에서 HWPX 양식 업로드, 업무 종류 선택, 문서 조건 정리, 초안 생성, HWPX 다운로드
- 체크인, 메시지, 행정 문서 초안을 Firebase Firestore 또는 `localStorage`에 저장
- Firebase 설정 전에도 발표와 시연이 가능한 체험 계정 제공

## 최근 작업 기록

### 2026-06-16 디자인 개선

- 제공 색상 팔레트를 기반으로 홈페이지 전체 색상 시스템을 정리했습니다.
  - 베이지: `#F7C7AE`
  - 연노랑: `#F5F8BE`
  - 연블루그레이: `#C4D9D6`
  - 옐로우: `#F9F973`
  - 민트그린: `#BEE3C5`
- 교사용 메인 제목과 주요 버튼을 어두운 녹색에서 밝은 주황/베이지 계열로 변경했습니다.
- PC 화면에서 교사용 드롭다운 메뉴가 작게 보이지 않도록 반응형 높이를 적용했습니다.
  - 상단 언어 선택 드롭다운: `54px` 이상
  - 교사용 내부 드롭다운: `58px` 이상
  - 드롭다운 글자: `15px`, `font-weight: 800`
- GitHub Pages에서 이전 CSS가 캐시되는 문제를 줄이기 위해 `index.html`의 `styles.css` 링크에 버전 쿼리를 붙였습니다.

### Firebase Functions 연동

- `translateMessage` callable function으로 체크인, 교사 답장, 메시지, 학급상점 물품 설명을 다국어 번역합니다.
- `generateHwpxDocument` callable function으로 업로드한 HWPX 양식을 분석하고 새 HWPX 문서를 생성합니다.
- Functions는 `asia-northeast3` 리전과 `nodejs22` 런타임을 기준으로 배포합니다.

### 학생/교사 기능 확장

- 교사 화면의 학생 관리 창을 카드형/필터형 구조로 정리했습니다.
- 학생 정보, 최근 체크인, 도움 요청 상태, 언어, 상담 메모를 한눈에 볼 수 있도록 구성했습니다.
- 교사가 체크인 기록에 답장을 저장하면 학생 화면에서 학생 모국어로 확인할 수 있도록 번역 흐름을 연결했습니다.
- 학생 도움 공간에 선생님 메시지, 오늘의 체크인, 나의 체크인 기록, 선생님 답장을 표시했습니다.
- 학생 활동 기반 `울림 성장 통장`과 포인트 기반 `학급상점` 탭을 추가했습니다.

### AI 행정 문서 생성

- 교사가 기존 HWPX 양식을 업로드하면 Firebase Functions에서 내부 XML 텍스트를 분석합니다.
- 업무 종류는 가정통신문, 업무추진 계획, 교육주간 운영계획, 학생 학습자료 제작, 상담 계획서, 다문화 학생 지원 계획을 기준으로 구성했습니다.
- 업무별 참고 자료는 `functions-deploy/training-docs/{type}/` 폴더에 저장할 수 있습니다.
- 생성 문서 초안은 오른쪽 영역에 표시하고, 결과 HWPX 파일은 다운로드할 수 있도록 구성했습니다.

## 디자인 시스템 메모

- 핵심 표면 색은 따뜻한 베이지/연노랑과 안정적인 민트/블루그레이를 함께 사용합니다.
- 주요 행동 버튼은 밝은 주황 계열을 사용하고, 보조 버튼은 밝은 종이색 배경과 얇은 테두리를 사용합니다.
- 카드 모서리는 `8px` 기준으로 유지합니다.
- 교사용 선택 메뉴는 PC 화면에서 충분한 클릭 높이를 확보하도록 `clamp()`와 고정 최소 높이를 함께 사용합니다.

## 자동 번역을 위해 준비할 부분

사용자가 준비해야 하는 부분:

- Google Cloud Console에서 Cloud Translation API를 사용 설정합니다.
- Firebase Blaze 요금제를 사용 설정합니다. Cloud Functions와 Translation API는 결제 계정 연결이 필요할 수 있습니다.
- Firebase Functions를 `asia-northeast3` 리전에 배포합니다.
- 함수 이름은 홈페이지 코드와 맞게 `translateMessage`로 만듭니다.
- 번역 API 키나 서비스 계정 키는 절대로 `app.js`에 넣지 말고 Cloud Functions 서버 안에서만 사용합니다.

홈페이지에 반영된 부분:

- `app.js`가 Firebase Functions SDK를 불러오도록 수정되었습니다.
- 메시지를 보낼 때 `translateMessage` callable function을 호출합니다.
- 함수가 `translations` 객체를 반환하면 Firestore `messages` 문서에 함께 저장합니다.
- 접속 학생의 모국어 코드에 맞춰 `translations[languageCode]`를 먼저 보여줍니다.
- 아직 Cloud Function이 배포되지 않았거나 실패하면 기존처럼 임시 안내 문구와 원문을 보여줍니다.

`translateMessage` 함수는 아래 형태로 응답해야 합니다.

```json
{
  "translations": {
    "ko": "한국어 번역",
    "en": "English translation",
    "ja": "日本語翻訳",
    "zh": "中文翻译",
    "vi": "Bản dịch tiếng Việt",
    "th": "คำแปลภาษาไทย",
    "mn": "Монгол орчуулга",
    "ru": "Русский перевод"
  }
}
```

## Firebase 설정 방법

### 1. Firebase 프로젝트 만들기

1. [Firebase Console](https://console.firebase.google.com/)에 접속합니다.
2. 새 프로젝트를 만듭니다.
3. 프로젝트 안에서 웹 앱을 추가합니다.
4. 웹 앱 설정 화면에서 `firebaseConfig` 값을 복사합니다.
5. `app.js`의 아래 부분에 붙여 넣습니다.

```js
const firebaseConfig = {
  apiKey: "복사한 값",
  authDomain: "복사한 값",
  projectId: "복사한 값",
  storageBucket: "복사한 값",
  messagingSenderId: "복사한 값",
  appId: "복사한 값"
};
```

### 2. Firestore Database 만들기

1. Firebase Console에서 `Firestore Database`를 엽니다.
2. 데이터베이스 만들기를 누릅니다.
3. 위치를 선택합니다.
4. 처음 테스트는 테스트 모드로 시작할 수 있지만, 실제 운영 전에는 반드시 보안 규칙을 수정해야 합니다.

### 3. 계정 컬렉션 만들기

컬렉션 이름은 `accounts`입니다. 문서 ID는 로그인 아이디와 같게 만듭니다.

예시 문서: `accounts/student01`

```json
{
  "loginId": "student01",
  "passwordHash": "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4",
  "role": "student",
  "name": "김하루",
  "language": "한국어",
  "active": true
}
```

예시 문서: `accounts/teacher01`

```json
{
  "loginId": "teacher01",
  "passwordHash": "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4",
  "role": "teacher",
  "name": "담임교사",
  "language": "한국어",
  "active": true
}
```

위 `passwordHash` 값은 비밀번호 `1234`의 SHA-256 해시입니다. 다른 비밀번호를 쓰려면 브라우저 개발자 도구 콘솔에서 아래 코드를 실행해 해시를 만들 수 있습니다.

```js
const text = "원하는비밀번호";
const bytes = new TextEncoder().encode(text);
const hash = await crypto.subtle.digest("SHA-256", bytes);
[...new Uint8Array(hash)].map(v => v.toString(16).padStart(2, "0")).join("");
```

### 4. 자료 컬렉션 구조

앱에서 사용하는 기본 컬렉션은 다음과 같습니다.

```text
accounts/{loginId}
students/{studentId}
checkins/{checkinId}
messages/{messageId}
documents/{documentId}
storeItems/{itemId}
purchases/{purchaseId}
pointLedger/{ledgerId}
```

`students` 예시 문서:

```json
{
  "name": "린",
  "lang": "베트남어",
  "status": "도움 요청",
  "note": "급식 적응 상담 필요"
}
```

`checkins`, `messages`, `documents`, `storeItems`, `purchases`, `pointLedger`는 홈페이지에서 저장/구매/생성 버튼을 누르면 자동으로 생성됩니다.

### 5. HWPX/PDF 학습 자료 폴더

업무 종류별 참고 자료는 아래 폴더에 저장합니다. 각 폴더 안에는 `.hwpx`와 `.pdf` 파일을 함께 넣을 수 있습니다. Firebase Functions는 문서 생성 시 하위 폴더를 재귀적으로 읽고, 참고자료 텍스트를 추출해 새 HWPX 문서 생성에 활용합니다.

```text
functions-deploy/training-docs/
  001.다문화교육(온학교지원)/
    다문화교육 운영계획/
    한국어학급 운영 품의서/
    다문화관련 체험 가정통신문/
    다문화교육주간 운영계획/
    한국어교육 지도계획/
    강사채용/
  002.학생맞춤통합지원(온학교지원)/
    상담 계획/
    학생 지원 계획/
    학부모 안내/
  003.업무지원 학습용 공문자료/
    다문화교육 운영계획/
    한국어학급 운영 품의서/
    다문화관련 체험 가정통신문/
    다문화교육주간 운영계획/
    한국어교육 지도계획/
    강사채용/
```

예를 들어 업무지원 공문 참고자료는 아래처럼 넣습니다.

```text
functions-deploy/training-docs/003.업무지원 학습용 공문자료/다문화교육 운영계획/운영계획_예시.hwpx
functions-deploy/training-docs/003.업무지원 학습용 공문자료/다문화교육 운영계획/운영계획_참고.pdf
```

기존 호환 폴더인 `family_notice/`, `work_plan/`, `education_week/`, `learning_material/`, `counseling_plan/`, `multicultural_support/`도 계속 읽습니다.

참고 파일을 추가한 뒤에는 `generateHwpxDocument` 함수를 다시 배포해야 서버에 반영됩니다.

### 6. Firestore 보안 규칙 예시

아래 규칙은 이 정적 홈페이지 프로토타입을 위한 최소 예시입니다. 로그인 검사를 클라이언트에서 직접 하기 때문에 `accounts/{loginId}` 문서의 단건 읽기가 열려 있습니다. 실제 운영 서비스에서는 Firebase Authentication 또는 Cloud Functions 로그인 API로 바꾸는 것이 안전합니다.

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /accounts/{loginId} {
      allow get: if true;
      allow list: if false;
      allow write: if false;
    }

    match /students/{studentId} {
      allow read: if true;
      allow write: if false;
    }

    match /checkins/{checkinId} {
      allow create: if true;
      allow read: if true;
      allow update, delete: if false;
    }

    match /messages/{messageId} {
      allow read, create: if true;
      allow update, delete: if false;
    }

    match /documents/{documentId} {
      allow create, read: if true;
      allow update, delete: if false;
    }

    match /storeItems/{itemId} {
      allow read, create, update, delete: if true;
    }

    match /purchases/{purchaseId} {
      allow read, create: if true;
      allow update, delete: if false;
    }

    match /pointLedger/{ledgerId} {
      allow read, create: if true;
      allow update, delete: if false;
    }
  }
}
```

## 배포 명령 메모

홈페이지 수정 후 GitHub Pages에 반영:

```bash
cd ~/Projects/ulim
git status
git add .
git commit -m "수정 내용 설명"
git push
```

Firebase Functions 배포:

```bash
cd ~/Projects/ulim
firebase deploy --only functions:translateMessage
firebase deploy --only functions:generateHwpxDocument
firebase functions:list
```

## 운영 서비스로 확장할 때 꼭 바꿀 점

- 학생 개인정보와 비밀번호를 보호하려면 Firebase Authentication을 우선 사용하세요.
- Firestore에 비밀번호 원문을 저장하지 마세요. 이 프로젝트도 `passwordHash` 비교 방식으로 작성했습니다.
- 교사와 학생 권한을 엄격하게 나누려면 Firebase Auth의 UID 또는 Custom Claims와 Firestore Security Rules를 함께 사용하세요.
- HWP/HWPX 분석은 브라우저가 아니라 서버 또는 Cloud Functions에서 처리하고, 개인정보 비식별화 후 AI API로 전달하세요.
- 학교 현장 사용 전 개인정보 처리 동의, 접근 기록, 보관 기간, 관리자 권한 정책을 마련해야 합니다.
