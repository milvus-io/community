import fs from "fs";
import path from "path";
import axios from "axios";
import { Milvus } from "@zilliz/toolkit";
import { JSDOM } from "jsdom";

const PATH = "/blog/";
const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const DEEPL_ENDPOINT = "https://api.deepl.com";
const TRANSLATE_PATH = "/v2/translate";
const GLOSSARY_PATH = "/v2/glossaries";

const DEEPL_HEADERS = {
  "Content-Type": "application/json",
  Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}`,
};
const GLOSSARY_ID_MAP = JSON.parse(
  fs.readFileSync("./tools/glossary/glossary-id.json", "utf8")
);

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

export async function translate(params) {
  try {
    const { text, sourceLang = "EN", targetLang } = params;
    const isArray = Array.isArray(text);
    const texts = isArray ? text : [text];

    if (targetLang === "EN") {
      return text;
    }

    const glossaryKey = `${sourceLang.toLowerCase()}-${targetLang.toLowerCase()}`;
    const GLOSSARY_ID = GLOSSARY_ID_MAP[glossaryKey]?.id;
    const glossaryParams = GLOSSARY_ID ? { glossary_id: GLOSSARY_ID } : {};

    // Translation logic
    const res = await axios.post(
      DEEPL_ENDPOINT + TRANSLATE_PATH,
      {
        text: texts,
        source_lang: sourceLang,
        target_lang: targetLang,
        tag_handling: "html",
        ...glossaryParams,
      },
      {
        headers: DEEPL_HEADERS,
      }
    );
    const { translations } = res.data || {};
    return isArray
      ? translations.map((item) => item.text)
      : translations.map((item) => item.text).join("\n");
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

/**
 * Create a glossary for DeepL.
 * get glossary_id for translate function
 *
 * entries example:
 * Source1\tTarget1\nSource2\tTarget2\n...
 */
export const createDeepLGlossary = async (entries, targetLang) => {
  const body = {
    name: `milvus-blog-en-to-${targetLang}-glossary-${new Date().toISOString()}`,
    source_lang: "en",
    target_lang: targetLang,
    entries,
    entries_format: "tsv",
  };
  const res = await axios.post(DEEPL_ENDPOINT + GLOSSARY_PATH, body, {
    headers: DEEPL_HEADERS,
  });
  console.log(res.data);
  return res.data;
};


