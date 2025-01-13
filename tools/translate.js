import "dotenv/config";
import fs from "fs";
import matter from "gray-matter";

import {
  mkdir,
  translate,
  traverseDirectory,
  getTitleFromMarkdown,
  remarkableToHtml,
  getFileUpdatedTime,
  extractText,
} from "./utils.js";

const BLOG_DIR = "blog/en";
const HOMEPAGE_FILE_PATH = "homepage/index.json";
const CACHE_FILE = "./tools/cache.json";

const sourceLang = "en";
const targetLangs = [
  "zh",
  "zh-hant",
  "ja",
  "ko",
  "fr",
  "de",
  "it",
  "pt",
  "es",
  "ru",
  "id",
  "ar",
];
let total = 0;

const translateHomepage = async () => {
  const dataString = fs.readFileSync(HOMEPAGE_FILE_PATH, "utf-8");
  const data = JSON.parse(dataString);
  const cache = fs.existsSync(CACHE_FILE)
    ? JSON.parse(fs.readFileSync(CACHE_FILE, "utf8") || "{}")
    : {};
  const modifiedTime = await getFileUpdatedTime(HOMEPAGE_FILE_PATH);
  const cacheOutdated =
    !cache ||
    !cache[HOMEPAGE_FILE_PATH] ||
    new Date(cache[HOMEPAGE_FILE_PATH]) < new Date(modifiedTime);

  if (!cacheOutdated) {
    console.log("-> Homepage cache is up-to-date!");
    return;
  }

  for (let lang of targetLangs) {
    const label = data.label;
    const targetPath = `localization/homepage/${lang}/index.json`;

    const newLabel = await translate({
      text: label,
      sourceLang,
      targetLang: lang.toUpperCase(),
    });
    const newData = { ...data, label: newLabel };
    mkdir(targetPath);
    fs.writeFileSync(targetPath, JSON.stringify(newData, null, 2), "utf-8");

    console.info(`-> Translate homepage: ${lang}`);
    cache[HOMEPAGE_FILE_PATH] = new Date().toISOString();
  }

  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), "utf8");
  console.log("--> Cache updated successfully");
};

const translateBlogs = async () => {
  const cache = fs.existsSync(CACHE_FILE)
    ? JSON.parse(fs.readFileSync(CACHE_FILE, "utf8") || "{}")
    : {};
  const sourceDirectory = BLOG_DIR;
  const mdFiles = traverseDirectory(sourceDirectory);
  console.log(`--> Found ${mdFiles.length} files...`);

  let updatedFiles = [];
  for (let index = 0; index < mdFiles.length; index++) {
    const path = mdFiles[index];
    const modifiedTime = await getFileUpdatedTime(path);

    console.info(`--> cache check: ${index + 1}/${mdFiles.length}`);

    const markdown = fs.readFileSync(path, "utf8");
    const { data = {} } = matter(markdown);
    const deprecated = data.deprecate;
    const cacheOutdated =
      !cache || !cache[path] || new Date(cache[path]) < new Date(modifiedTime);
    if (!deprecated && cacheOutdated) {
      updatedFiles.push(path);
    }
  }
  console.log(`--> ${updatedFiles.length} updated files`);

  for (let path of updatedFiles) {
    const markdown = fs.readFileSync(path, "utf8");
    const { data = {}, content } = matter(markdown);
    // const isMdx = path.endsWith(".mdx");
    const h1Title = getTitleFromMarkdown(content);
    const isSameTitle = h1Title === data.title;

    for (let targetLang of targetLangs) {
      const params = { content, lang: targetLang };
      const {
        html: htmlContent,
        codeList,
        headingContent,
        anchorList,
      } = await remarkableToHtml(params);

      const translateRes = await translate({
        text: htmlContent,
        targetLang: targetLang.toUpperCase(),
      });

      let translateContent =
        typeof translateRes === "string"
          ? translateRes
          : translateRes.reduce((acc, cur, index) => {
              const match = matches[index - 1];
              if (match) {
                return acc + match + cur;
              }
              return acc + cur;
            }, "");

      if (anchorList.length > 0) {
        const anchorIds = anchorList.map((anchor) => anchor.href);
        anchorIds.forEach((id, index) => {
          const text = extractText(id, translateContent);
          anchorList[index].label = text;
        });
      }

      const cloneData = { ...data };
      if (data.title || data.desc) {
        const [title, desc] = await translate({
          text: [data.title || "", data.desc || ""],
          targetLang: targetLang.toUpperCase(),
        });
        if (title) {
          const translatedMdTitle = anchorList?.[0]?.label || title;
          cloneData.title = !isSameTitle ? title : translatedMdTitle;
        }
        if (desc) {
          cloneData.desc = desc;
        }
      }

      const cleanedHtmlContent = translateContent.replace(/{" "}/g, ""); // Remove {" "}
      const wholeContent = matter.stringify(cleanedHtmlContent, cloneData);

      const targetFilePath =
        "localization/" + path.replace(sourceLang, `${targetLang}`);
      mkdir(targetFilePath);
      fs.writeFileSync(targetFilePath, wholeContent, "utf8");
      fs.writeFileSync(
        targetFilePath.replace(".md", ".json"),
        JSON.stringify(
          { codeList, headingContent, anchorList },
          cache,
          null,
          2
        ),
        "utf8"
      );
      console.info(
        `-> ${targetLang.toUpperCase()}: file translated successfully:`,
        targetFilePath
      );
    }
    total++;
    console.info(`【Progress: ${total}/${updatedFiles.length}】`);
    cache[path] = new Date().toISOString();
  }

  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), "utf8");
  console.log("--> Cache updated successfully");
  console.log("--> Total files:", total);
};

const bootstrap = async () => {
  await translateHomepage();
  await translateBlogs();
};
bootstrap();
