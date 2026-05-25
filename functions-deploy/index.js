const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { TranslationServiceClient } = require("@google-cloud/translate").v3;

const PROJECT_ID = process.env.GCLOUD_PROJECT || "ulim-3f09e";
const LOCATION = "global";
const SUPPORTED_LANGS = new Set(["ko", "en", "ja", "zh", "vi", "th", "mn", "ru"]);

const translationClient = new TranslationServiceClient();

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
