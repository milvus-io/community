import "dotenv/config";
import fs from "fs";
import matter from "gray-matter";

import {
  mkdir,
  translate,
  traverseDirectory,
  getTitleFromMarkdown,
  remarkableToHtml,
  extractText,
} from "./utils.js";

const BLOG_DIR = "blog/en";
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

const bootstrap = async () => {
  const cache = fs.existsSync(CACHE_FILE)
    ? JSON.parse(fs.readFileSync(CACHE_FILE, "utf8") || "{}")
    : {};

  const cacheBlogs = Object.keys(cache);
  const sourceDirectory = BLOG_DIR;
  const mdFiles = traverseDirectory(sourceDirectory);

  let newFoundBlogs = [];

  for (let index = 0; index < mdFiles.length; index++) {
    if (cacheBlogs.includes(mdFiles[index])) {
      console.log(`-> ${mdFiles[index]} already translated!`);
      continue;
    }
    newFoundBlogs.push(mdFiles[index]); 
  }

  console.log("detect new published blogs--", newFoundBlogs);

  for (let path of newFoundBlogs) {
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
    console.info(`【Progress: ${newFoundBlogs.length}/${updatedFiles.length}】`);
    cache[path] = new Date().toISOString();
  }

  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), "utf8");
  console.log("--> Cache updated successfully");
  console.log("--> Total files:", newFoundBlogs.length);
};

bootstrap();
