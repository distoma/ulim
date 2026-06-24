# HWPX/PDF training documents

업무별 참고 문서는 이 폴더 아래에 저장합니다. Firebase Functions는
`generateHwpxDocument` 실행 시 하위 폴더를 재귀적으로 읽고, `.hwpx`와
`.pdf` 파일의 텍스트를 참고자료로 사용합니다. 최종 생성 파일은 업로드한
HWPX 양식을 기반으로 항상 `.hwpx`로 생성됩니다.

## 권장 폴더 구조

사진 자료처럼 대분류 업무 폴더를 먼저 만들고, 그 아래에 세부 업무 폴더를
두는 방식을 권장합니다.

```text
training-docs/
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

각 세부 폴더 안에는 예시 문서와 참고자료를 함께 넣을 수 있습니다.

```text
003.업무지원 학습용 공문자료/
  다문화교육 운영계획/
    운영계획_예시.hwpx
    운영계획_참고.pdf
```

## 기존 호환 폴더

기존 코드에서 사용하던 아래 폴더도 계속 읽습니다.

- `family_notice/`: 가정통신문
- `work_plan/`: 업무추진 계획
- `education_week/`: 교육주간 운영계획
- `learning_material/`: 학생 학습자료 제작
- `counseling_plan/`: 상담 계획서
- `multicultural_support/`: 다문화 학생 지원 계획

## 반영 방법

새 참고 파일을 추가한 뒤에는 Functions를 다시 배포해야 서버에 반영됩니다.

```bash
cd ~/Projects/ulim
firebase deploy --only functions:generateHwpxDocument
```
