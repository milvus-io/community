---
id: 2021-10-22-apply-configuration-changes-on-milvus-2.md
title: >-
  Technical Sharing:Apply Configuration Changes on Milvus 2.0 using Docker
  Compose
author: Jingjing
date: 2021-10-22T00:00:00.000Z
desc: Learn how apply configuration changes on Milvus 2.0
cover: assets.zilliz.com/Modify_configurations_f9162c5670.png
tag: Engineering
---
<custom-h1>Technical Sharing: Apply Configuration Changes on Milvus 2.0 using Docker Compose</custom-h1><p><em>Jingjing Jia, Zilliz Data Engineer, graduated from Xi’an Jiaotong University with a degree in Computer Science. After joining Zilliz, she mainly works on data pre-processing, AI model deployment, Milvus related technology research, and helping community users to implement application scenarios. SHe is very patient, likes to communicate with community partners, and enjoys listening to music and watching anime.</em></p>
<p>As a frequent user of Milvus, I was very excited about the newly released Milvus 2.0 RC. According to the introduction on the official website, Milvus 2.0 seems to outmatch its predecessors by a large margin. I was so eager to try it out myself.</p>
<p>And I did.  However, when I truly got my hands on Milvus 2.0, I realized that I wasn’t able to modify the configuration file in Milvus 2.0 as easily as I did with Milvus 1.1.1. I couldn’t change the configuration file inside the docker container of Milvus 2.0 started with Docker Compose, and even force change wouldn’t take effect. Later, I learned that Milvus 2.0 RC was unable to detect changes to the configuration file after installation. And future stable release will fix this issue.</p>
<p>Having tried different approaches, I’ve found a reliable way to apply changes to configuration files for Milvus 2.0 standalone &amp; cluster, and here is how.</p>
<p>Note that all changes to configuration must be made before restarting Milvus using Docker Compose.</p>
<h2 id="Modify-configuration-file-in-Milvus-standalone" class="common-anchor-header">Modify configuration file in Milvus standalone<button data-href="#Modify-configuration-file-in-Milvus-standalone" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>First, you will need to <a href="https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml">download</a> a copy of <strong>milvus.yaml</strong> file to your local device.</p>
<p>Then you can change the configurations in the file. For instance, you can change the log format as <code translate="no">.json</code>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_1_ee4a16a3ee.png" alt="1.1.png" class="doc-image" id="1.1.png" />
    <span>1.1.png</span>
  </span>
</p>
<p>Once <strong>milvus.yaml</strong> file is modified, you will also need to <a href="https://github.com/milvus-io/milvus/blob/master/deployments/docker/standalone/docker-compose.yml">download</a> and modify in <strong>docker-compose.yaml</strong> file for standalone by mapping the local path to milvus.yaml onto the corresponding docker container path to configuration file <code translate="no">/milvus/configs/milvus.yaml</code> under the <code translate="no">volumes</code> section.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_2_5e7c73708c.png" alt="1.2.png" class="doc-image" id="1.2.png" />
    <span>1.2.png</span>
  </span>
</p>
<p>Lastly, start Milvus standalone using <code translate="no">docker-compose up -d</code> and check if the modifications are successful. For instance, run <code translate="no">docker logs</code> to check the log format.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_3_a0406df3ab.png" alt="1.3.png" class="doc-image" id="1.3.png" />
    <span>1.3.png</span>
  </span>
</p>
<h2 id="Modify-configuration-file-in-Milvus-cluster" class="common-anchor-header">Modify configuration file in Milvus cluster<button data-href="#Modify-configuration-file-in-Milvus-cluster" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>First, <a href="https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml">download</a> and modify the <strong>milvus.yaml</strong> file to suit your needs.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_4_758b182846.png" alt="1.4.png" class="doc-image" id="1.4.png" />
    <span>1.4.png</span>
  </span>
</p>
<p>Then you will need to <a href="https://github.com/milvus-io/milvus/blob/master/deployments/docker/cluster/docker-compose.yml">download</a> and modify the cluster <strong>docker-compose.yml</strong> file by mapping the local path to <strong>milvus.yaml</strong> onto the corresponding path to configuration files in all components, i.e. root coord, data coord, data node, query coord, query node, index coord, index node, and proxy.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_5_80e15811b8.png" alt="1.5.png" class="doc-image" id="1.5.png" />
    <span>1.5.png</span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_6_b2f3e4e47f.png" alt="1.6.png" class="doc-image" id="1.6.png" />
    <span>1.6.png</span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_7_4d1eb5e1e5.png" alt="1.7.png" class="doc-image" id="1.7.png" />
    <span>1.7.png</span>
  </span>
</p>
<p>Finally, you can start Milvus cluster using <code translate="no">docker-compose up -d</code> and check if the modifications are successful.</p>
<h2 id="Change-log-file-path-in-configuration-file" class="common-anchor-header">Change log file path in configuration file<button data-href="#Change-log-file-path-in-configuration-file" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>First, <a href="https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml">download</a> the <strong>milvus.yaml</strong> file, and change the <code translate="no">rootPath</code> section as the directory where you expect to store the log files in Docker container.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_8_e3bdc4843f.png" alt="1.8.png" class="doc-image" id="1.8.png" />
    <span>1.8.png</span>
  </span>
</p>
<p>After that, download the corresponding <strong>docker-compose.yml</strong> file for Milvus <a href="https://github.com/milvus-io/milvus/blob/master/deployments/docker/standalone/docker-compose.yml">standalone</a> or <a href="https://github.com/milvus-io/milvus/blob/master/deployments/docker/cluster/docker-compose.yml">cluster</a>.</p>
<p>For standalone, you need to map the local path to <strong>milvus.yaml</strong> onto the corresponding docker container path to configuration file <code translate="no">/milvus/configs/milvus.yaml</code>, and map the local log file directory onto the Docker container directory you created previously.</p>
<p>For cluster, you will need to map both paths in every component.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_9_22d8929d92.png" alt="1.9.png" class="doc-image" id="1.9.png" />
    <span>1.9.png</span>
  </span>
</p>
<p>Lastly, start Milvus standalone or cluster using <code translate="no">docker-compose up -d</code> and check the log files to see if the modification is successful.</p>
