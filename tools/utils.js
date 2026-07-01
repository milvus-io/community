import fs from "fs";
import path from "path";
import axios from "axios";
import { Milvus } from "@zilliz/toolkit";
import { JSDOM } from "jsdom";

const PATH = "/blog/";

// ChatGPT-compatible translation API config. Endpoint, key and model are all
// injected via environment variables (see .github/workflows/translate.yml).
// CHATGPT_API_URL is a base URL (e.g. https://token.zasdas.com/v1); the
// /chat/completions path is appended automatically when it's not already there.
const CHATGPT_BASE_URL = (
  process.env.CHATGPT_API_URL || "https://api.openai.com/v1"
).replace(/\/+$/, "");
const CHATGPT_API_URL = CHATGPT_BASE_URL.endsWith("/chat/completions")
  ? CHATGPT_BASE_URL
  : `${CHATGPT_BASE_URL}/chat/completions`;
const CHATGPT_API_KEY = process.env.CHATGPT_API_KEY;
const CHATGPT_MODEL = process.env.CHATGPT_MODEL || "gpt-4o-mini";

const CHATGPT_HEADERS = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${CHATGPT_API_KEY}`,
};

const GLOSSARY_DIR = "./tools/glossary";

// Map the DeepL-style language codes used across the pipeline to full language
// names, so the prompt is unambiguous for the model.
const LANG_NAMES = {
  EN: "English",
  ZH: "Simplified Chinese",
  "ZH-HANT": "Traditional Chinese",
  JA: "Japanese",
  KO: "Korean",
  FR: "French",
  DE: "German",
  IT: "Italian",
  PT: "Portuguese",
  ES: "Spanish",
  RU: "Russian",
  ID: "Indonesian",
  AR: "Arabic",
};

// Load a `${source}-${target}.json` glossary (if present) and render it as
// prompt guidance, keeping Milvus terminology consistent the way the DeepL
// glossary used to. Cached per language pair.
const glossaryPromptCache = {};
function getGlossaryPrompt(sourceLang, targetLang) {
  const key = `${sourceLang.toLowerCase()}-${targetLang.toLowerCase()}`;
  if (key in glossaryPromptCache) return glossaryPromptCache[key];

  const file = `${GLOSSARY_DIR}/${key}.json`;
  let prompt = "";
  if (fs.existsSync(file)) {
    try {
      const entries = JSON.parse(fs.readFileSync(file, "utf8"));
      if (Array.isArray(entries) && entries.length > 0) {
        const lines = entries
          .map((e) => `- "${e.source}" => "${e.target}"`)
          .join("\n");
        prompt = `Always translate the following terms exactly as specified (source => target):\n${lines}`;
      }
    } catch (error) {
      console.error(`Failed to read glossary ${file}:`, error);
    }
  }
  glossaryPromptCache[key] = prompt;
  return prompt;
}

// The model is instructed not to wrap output in code fences, but strip them
// defensively in case it does.
function stripCodeFence(text = "") {
  const match = text
    .trim()
    .match(/^```(?:html|markdown|md|json)?\s*\n([\s\S]*?)\n```$/);
  return match ? match[1] : text;
}

const dirCache = {};
export function mkdir(filePath) {
  const pathArr = filePath.split("/");
  let dir = pathArr[0];
  for (let i = 1; i < pathArr.length; i++) {
    if (!dirCache[dir] && !fs.existsSync(dir)) {
      dirCache[dir] = true;
      fs.mkdirSync(dir);
    }
    dir = path.join(dir, pathArr[i]);
  }
}

// Translate a single string via the ChatGPT API. The content is HTML (produced
// by md2html), so the model is told to preserve tags and only translate text.
async function translateText(text, sourceLang, targetLang) {
  // Nothing to translate for empty / whitespace-only strings.
  if (!text || !text.trim()) return text;

  const sourceName = LANG_NAMES[sourceLang.toUpperCase()] || sourceLang;
  const targetName = LANG_NAMES[targetLang.toUpperCase()] || targetLang;
  const glossaryPrompt = getGlossaryPrompt(sourceLang, targetLang);

  const systemPrompt = [
    `You are a professional translator for technical blog articles about the Milvus vector database.`,
    `Translate the content the user provides from ${sourceName} into ${targetName}.`,
    `Rules:`,
    `- The content is HTML. Preserve every HTML tag, attribute and the overall structure exactly; only translate the human-readable text.`,
    `- Do NOT translate or alter code, URLs, HTML entities, or the contents of <code> and <pre> blocks.`,
    `- Keep all placeholders and surrounding whitespace intact.`,
    `- Return ONLY the translated content, with no explanation and without wrapping it in Markdown code fences.`,
    glossaryPrompt,
  ]
    .filter(Boolean)
    .join("\n");

  const res = await axios.post(
    CHATGPT_API_URL,
    {
      model: CHATGPT_MODEL,
      temperature: 0,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: text },
      ],
    },
    { headers: CHATGPT_HEADERS }
  );

  const content = res.data?.choices?.[0]?.message?.content ?? "";
  return stripCodeFence(content);
}

export async function translate(params) {
  try {
    const { text, sourceLang = "EN", targetLang } = params;
    const isArray = Array.isArray(text);
    const texts = isArray ? text : [text];

    if (targetLang === "EN") {
      return text;
    }

    // Translate each item independently so array order and length are preserved
    // (used for the [title, desc] pair as well as the single HTML body).
    const translations = [];
    for (const item of texts) {
      translations.push(await translateText(item, sourceLang, targetLang));
    }

    return isArray ? translations : translations.join("\n");
  } catch (error) {
    console.error(error);
    return params.text;
  }
}

export function traverseDirectory(dirPath, fileList = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      traverseDirectory(filePath, fileList);
    } else if (stats.isFile() && path.extname(file) === ".md") {
      fileList.push(filePath);
    }
  });

  return fileList;
}

export const getFileUpdatedTime = async (path) => {
  try {
    const apiUrl = `https://api.github.com/repos/milvus-io/community/commits?path=${path}`;
    const headers = {
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
    };
    const { data } = await axios.get(apiUrl, { headers });
    return data.length > 0
      ? data[0].commit.author.date
      : new Date().toISOString();
  } catch (error) {
    console.error(error);
    return new Date().toISOString();
  }
};

export const getTitleFromMarkdown = (markdown) => {
  const headingRegex = /^#\s+(.*)$/m;
  const match = headingRegex.exec(markdown);
  return match ? match[1] : null;
};

/**
 * Renders the documentation HTML.
 *
 * @param {Object} options - The options for rendering the documentation.
 * @param {string} [options.lang="en"] - The language of the documentation.
 * @param {string} [options.content=""] - The content to be converted to HTML.
 * @returns {Object} The HTML tree generated from the markdown content.
 */
export const remarkableToHtml = async (
  options = { lang: "en", content: "" }
) => {
  const { lang, content } = options;
  const path = lang === "en" ? PATH : PATH + lang + "/";
  const { tree, codeList, headingContent, anchorList } = Milvus.md2html(
    content,
    {
      showAnchor: true,
      useLatex: true,
      path,
      version: "blog",
    }
  );

  return {
    html: tree,
    codeList,
    headingContent,
    anchorList,
  };
};

export const extractText = (id = "", htmlString = "") => {
  const dom = new JSDOM(htmlString);
  const document = dom.window.document;

  const targetElement = document.getElementById(id);

  if (!targetElement) {
    console.log(`No element found with id "${id}"`);
    return;
  }

  return targetElement.textContent.trim();
};
