import axios from "axios";
import fs from "fs";
import fm from "front-matter";

const args = process.argv.slice(2);

const BASE_MEDIUM_POST_API = `https://api.medium.com/v1/`;
// const MEDIUM_POST_API = `http://localhost:3001/v1/users/${process.env.MEDIUM_ID}/posts`;
const MEDIUM_POST_TOKEN = process.env.MEDIUM_TOKEN || '';
const REPOST_SUCCESS_FEISHU_ALERT_URL_TOKEN = process.env.REPOST_SUCCESS_FEISHU_ALERT_URL_TOKEN || '';
const REPOST_FAILURE_FEISHU_ALERT_URL_TOKEN = process.env.REPOST_FAILURE_FEISHU_ALERT_URL_TOKEN || '';

const post = async (url, data, opts = {}) => {
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    ...opts,
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.message);
  }
  return res.json();
};

const post2Medium = async (userId, body) => {
  try {
    const res = await post(`${BASE_MEDIUM_POST_API}users/${userId}/posts`, body, {
      headers: {
        Authorization: `Bearer ${MEDIUM_POST_TOKEN}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        AcceptCharset: "utf-8"
      },
    });
    console.log("---- post medium ----", res);
    return res;
  } catch (error) {
    console.log("---- error ----", error);
    throw new Error(`Failed to post to medium: ${error}`);
  }
};

const sendMsgToFeishu = async (token, content) => {
  try {
    console.log('---- request send msg to feishu ----', content);
    const feishuRes = await axios.post(
      token,
      content
    );
    console.log('---- feishu response ----', feishuRes);
  } catch (error) {
    throw new Error(`Failed to send msg to feishu: ${error?.message}`);
  }
};

const readMdFiles = async (pathList = []) => {
  let successList = [];
  let failureList = [];
  let skipList = [];
  let userId = '';

  const res = await fetch(`${BASE_MEDIUM_POST_API}me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${MEDIUM_POST_TOKEN}`,
      ContentType: "application/json",
      Accept: "application/json",
      AcceptCharset: "utf-8",
    }
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.message);
  }
  const me = await res.json();
  userId = me.data.id;
  console.log('userId----',userId);

  for await (const filePath of pathList) {
    if (filePath.startsWith("blog/") && filePath.endsWith(".md")) {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const fileData = fm(fileContent);
      const {
        attributes: {
          id,
          title,
          tags = '',
          origin,
          publishStatus = 'public',
          cover,
          publishToMedium=''
        } = {},
        body: fileContentBody,
      } = fileData;

      console.log('title ----', title);

      try {
        // console.log("fileData", fileData);
        if (!title) {
          throw Error("title should not be empty.");
        }

        const shouldPublishToMedium = String(publishToMedium) === 'true';

        const canonicalUrl = origin || `https://milvus.io/${id}`;
        const contentBodyWidthCover = `# ${title}\n\n![](https://${cover})\n\n${fileContentBody}`;
        const license = 'all-rights-reserved';
        const mediumTags = tags.split(',').map(i => i.trim());

        const requestBody = { title, tags: mediumTags, publishStatus, contentFormat: 'markdown', canonicalUrl, license, content: contentBodyWidthCover };

        if (shouldPublishToMedium) {
          const res = await post2Medium(userId, requestBody);
          console.log('---- response ----', res);
          successList.push({ title, mediumId: res.data.id, mediumUrl: res.data.url });
        } else {
          console.log('---- the value of publishToMedium ----', publishToMedium);
          skipList.push({ title, publishToMedium });
        }

      } catch (error) {
        console.error(`---- error [${filePath}] ----`, error);
        failureList.push({ title, error: JSON.stringify(error) });
      }
    }
  }

  const successFeishuMsg = {
    msg_type: 'post',
    content: {
      post: {
        en_us: {
          title: `The following articles has successfully reposted to Medium:`,
          content: [
            ...successList.map(v => [
              {
                tag: 'a',
                text: `${v.title} \n\n`,
                href: v.mediumUrl,
              },

            ]),
          ],
        },
      },
    },
  };

  const failedFeishuMsg = {
    msg_type: 'post',
    content: {
      post: {
        en_us: {
          title: `The following articles failed to be reposted to Medium:`,
          content: [
            ...failureList.map(v => [
              {
                tag: 'text',
                text: `Blog title: ${v.title} \n`,
              },
              {
                tag: 'text',
                text: `Failed reason: ${v.error}\n\n`,
              },

            ]),
          ],
        },
      },
    },

  };

  console.log(`==== Results Details ====`);
  console.log(`Success: `, JSON.stringify(successList));
  console.log(`Failed: `, JSON.stringify(failureList));
  console.log(`Skipped: `, JSON.stringify(skipList));
  console.log(`==== Results Summary ====`);
  console.log(
    `Total: ${pathList.length} ***, success: ${successList.length} ***, failed: ${failureList.length} ***, skipped: ${skipList.length} ***`
  );

  if (successList.length > 0) {
    await sendMsgToFeishu(REPOST_SUCCESS_FEISHU_ALERT_URL_TOKEN, successFeishuMsg);
  }
  if (failureList.length > 0) {
    await sendMsgToFeishu(REPOST_FAILURE_FEISHU_ALERT_URL_TOKEN, failedFeishuMsg);
  }
};

readMdFiles(args);
