# 울림(ULIM): 이주 배경학생 통합 지원 홈페이지

이 프로젝트는 기존 하루 체크인 아이디어를 확장해 이주 배경학생, 교사, 학부모 지원 흐름을 한곳에 모은 정적 홈페이지 프로토타입입니다.

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
- 학생 로그인 시 학생 도움 공간, 체크인, 다국어 대화 라운지만 표시
- 교사 로그인 시 학생 관리창, 다국어 공지, AI 행정 문서 생성, DB 설계 안내 표시
- 체크인, 메시지, 행정 문서 초안을 Firebase Firestore 또는 `localStorage`에 저장
- Firebase 설정 전에도 발표와 시연이 가능한 체험 계정 제공

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

`checkins`, `messages`, `documents`는 홈페이지에서 저장 버튼을 누르면 자동으로 생성됩니다.

### 5. Firestore 보안 규칙 예시

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
  }
}
```

## 운영 서비스로 확장할 때 꼭 바꿀 점

- 학생 개인정보와 비밀번호를 보호하려면 Firebase Authentication을 우선 사용하세요.
- Firestore에 비밀번호 원문을 저장하지 마세요. 이 프로젝트도 `passwordHash` 비교 방식으로 작성했습니다.
- 교사와 학생 권한을 엄격하게 나누려면 Firebase Auth의 UID 또는 Custom Claims와 Firestore Security Rules를 함께 사용하세요.
- HWP/HWPX 분석은 브라우저가 아니라 서버 또는 Cloud Functions에서 처리하고, 개인정보 비식별화 후 AI API로 전달하세요.
- 학교 현장 사용 전 개인정보 처리 동의, 접근 기록, 보관 기간, 관리자 권한 정책을 마련해야 합니다.

