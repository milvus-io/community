import fs from "fs";
import fm from "front-matter";

const args = process.argv.slice(2);
const MEDIUM_POST_API = `https://api.medium.com/v1/publications/${process.env
  .MEDIUM_PUBLICATION_ID}/posts`;
// const MEDIUM_POST_API = `http://localhost:3001/v1/users/${process.env.MEDIUM_ID}/posts`;
const MEDIUM_POST_TOKEN = process.env.MEDIUM_TOKEN;
const REPOST_SUCCESS_FEISHU_ALERT_URL_TOKEN =
  process.env.REPOST_SUCCESS_FEISHU_ALERT_URL_TOKEN;
const REPOST_FAILURE_FEISHU_ALERT_URL_TOKEN =
  process.env.REPOST_FAILURE_FEISHU_ALERT_URL_TOKEN;
const FEISHU_BASE_URL = "https://open.feishu.cn/open-apis/bot/v2/hook/";

console.log("---- args ----", args);

const post = async (url, data, opts = {}) => {
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    { ...opts },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }
  return res.json();
};

const post2Medium = async body => {
  // https://github.com/Medium/medium-api-docs#creating-a-post-under-a-publication
  const res = await post(MEDIUM_POST_API, body, {
    headers: {
      Authorization: `Bearer ${MEDIUM_POST_TOKEN}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      AcceptCharset: "utf-8"
    },
  });
  console.log("---- post medium ----", res);
  return res;
};

const sendMsgToFeishu = async (id, content) => {
  try {
    console.log("---- request send msg to feishu ----", content);
    const feishuRes = await post(
      `https://open.feishu.cn/open-apis/bot/v2/hook/${id}`,
      content
    );
    console.log("---- feishu response ----", feishuRes);
  } catch (error) {
    throw error;
  }
};

const readMdFiles = async (pathList = []) => {
  const result = [];
  const failure = [];
  for (const filePath of pathList) {
    if (filePath.startsWith("blog/") && filePath.endsWith(".md")) {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const fileData = fm(fileContent);
      const {
        attributes: {
          title,
          contentFormat = "markdown",
          tags,
          canonicalUrl,
          publishStatus,
          license,
          notifyFollowers
        } = {},
        body: fileContentBody
      } = fileData;
      try {
        // console.log("fileData", fileData);
        if (!title) {
          throw Error("title should not be empty.");
        }
        const requestBody = { title, contentFormat, content: fileContentBody };
        tags &&
          (requestBody.tags = JSON.parse(
            `[${tags.split(",").map(i => `"${i.trim()}"`)}]`
          ));
        canonicalUrl && (requestBody.canonicalUrl = canonicalUrl);
        publishStatus && (requestBody.publishStatus = publishStatus);
        license && (requestBody.license = license);
        notifyFollowers &&
          (requestBody.notifyFollowers = JSON.parse(notifyFollowers));

        const res = await post2Medium(requestBody);
        const feishuContent = [
          {
            tag: "text",
            text: `The blog post '${title}' has been reposted to Zilliz Medium.`
          },
          {
            tag: "a",
            text: `Medium ID: ${res.data.data.id}`,
            href: res.data.data.url
          }
        ];
        const feishuMsg = {
          msg_type: "post",
          content: {
            post: {
              en_us: {
                content: feishuContent
              }
            }
          }
        };
        await sendMsgToFeishu(
          feishuContent,
          REPOST_SUCCESS_FEISHU_ALERT_URL_ID
        );
        result.push({ ...res, filePath });
      } catch (error) {
        console.error(`---- error [${filePath}] ----`, error);
        failure.push({
          title,
          canonicalUrl,
          error: JSON.stringify(error.message)
        });
      }
    }
  }

  if (failure.length > 0) {
    const feishuMsg = {
      msg_type: "post",
      content: {
        post: {
          en_us: {
            content: [
              [
                {
                  tag: "text",
                  text: `The following articles failed to be reposted to Medium:`
                }
              ],
              ...failure.map(v => [
                {
                  tag: "text",
                  text: `Title: ${v.title} \n`
                },
                {
                  tag: "text",
                  text: `Canonical URL: ${v.canonicalUrl} \n`
                },
                {
                  tag: "text",
                  text: `Error: ${v.error}`
                }
              ])
            ]
          }
        }
      }
    };
  }

  console.log(`==== Results Details ====`);
  console.log(`Success: `, result);
  console.log(`Failed: `, failure);

  console.log(`==== Results Summary ====`);
  console.log(
    `Total: ${pathList.length} success: ${result.length} failed: ${failure.length} `
  );

  await sendMsgToFeishu(feishuMsg, REPOST_FAILURE_FEISHU_ALERT_URL_ID);
};

readMdFiles(args);
