---
id: building-video-search-system-with-milvus.md
title: System overview
author: milvus
date: 2020-08-29T00:18:19.703Z
desc: Searching for videos by image with Milvus
cover: assets.zilliz.com/header_3a822736b3.gif
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/building-video-search-system-with-milvus'
---
<custom-h1>4 Steps to Building a Video Search System</custom-h1><p>As its name suggests, searching for videos by image is the process of retrieving from the repository videos containing similar frames to the input image. One of the key steps is to turn videos into embeddings, which is to say, extract the key frames and convert their features to vectors. Now, some curious readers might wonder what the difference is between searching for video by image and searching for an image by image? In fact, searching for the key frames in videos is equivalent to searching for an image by image.</p>
<p>You can refer to our previous article <a href="https://medium.com/unstructured-data-service/milvus-application-1-building-a-reverse-image-search-system-based-on-milvus-and-vgg-aed4788dd1ea">Milvus x VGG: Building a Content-based Image Retrieval System</a> if interested.</p>
<h2 id="System-overview" class="common-anchor-header">System overview<button data-href="#System-overview" class="anchor-icon" translate="no">
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
    </button></h2><p>The following diagram illustrates the typical workflow of such a video search system.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_video_search_system_workflow_c68d658b93.png" alt="1-video-search-system-workflow.png" class="doc-image" id="1-video-search-system-workflow.png" />
    <span>1-video-search-system-workflow.png</span>
  </span>
</p>
<p>When importing videos, we use the OpenCV library to cut each video into frames, extract vectors of the key frames using image feature extraction model VGG, and then insert the extracted vectors (embeddings) into Milvus. We use Minio for storing the original videos and Redis for storing correlations between videos and vectors.</p>
<p>When searching for videos, we use the same VGG model to convert the input image into a feature vector and insert it into Milvus to find vectors with the most similarity. Then, the system retrieves the corresponding videos from Minio on its interface according to the correlations in Redis.</p>
<h2 id="Data-preparation" class="common-anchor-header">Data preparation<button data-href="#Data-preparation" class="anchor-icon" translate="no">
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
    </button></h2><p>In this article, we use about 100,000 GIF files from Tumblr as a sample dataset in building an end-to-end solution for searching for video. You can use your own video repositories.</p>
<h2 id="Deployment" class="common-anchor-header">Deployment<button data-href="#Deployment" class="anchor-icon" translate="no">
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
    </button></h2><p>The code for building the video retrieval system in this article is on GitHub.</p>
<h3 id="Step-1-Build-Docker-images" class="common-anchor-header">Step 1: Build Docker images.</h3><p>The video retrieval system requires Milvus v0.7.1 docker, Redis docker, Minio docker, the front-end interface docker, and the back-end API docker. You need to build the front-end interface docker and the back-end API docker by yourself, while you can pull the other three dockers directly from Docker Hub.</p>
<pre><code translate="no"># Get the video search code
$ git clone -b 0.10.0 https://github.com/JackLCL/search-video-demo.git

# Build front-end interface docker and api docker images
$ cd search-video-demo &amp; make all
</code></pre>
<h2 id="Step-2-Configure-the-environment" class="common-anchor-header">Step 2: Configure the environment.<button data-href="#Step-2-Configure-the-environment" class="anchor-icon" translate="no">
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
    </button></h2><p>Here we use docker-compose.yml to manage the above-mentioned five containers. See the following table for the configuration of docker-compose.yml:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_configure_docker_compose_yml_a33329e5e9.png" alt="2-configure-docker-compose-yml.png" class="doc-image" id="2-configure-docker-compose-yml.png" />
    <span>2-configure-docker-compose-yml.png</span>
  </span>
</p>
<p>The IP address 192.168.1.38 in the table above is the server address especially for building the video retrieval system in this article. You need to update it to your server address.</p>
<p>You need to manually create storage directories for Milvus, Redis, and Minio, and then add the corresponding paths in docker-compose.yml. In this example, we created the following directories:</p>
<pre><code translate="no">/mnt/redis/data /mnt/minio/data /mnt/milvus/db
</code></pre>
<p>You can configure Milvus, Redis, and Minio in docker-compose.yml as follows:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_configure_milvus_redis_minio_docker_compose_yml_4a8104d53e.png" alt="3-configure-milvus-redis-minio-docker-compose-yml.png" class="doc-image" id="3-configure-milvus-redis-minio-docker-compose-yml.png" />
    <span>3-configure-milvus-redis-minio-docker-compose-yml.png</span>
  </span>
</p>
<h2 id="Step-3-Start-the-system" class="common-anchor-header">Step 3: Start the system.<button data-href="#Step-3-Start-the-system" class="anchor-icon" translate="no">
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
    </button></h2><p>Use the modified docker-compose.yml to start up the five docker containers to be used in the video retrieval system:</p>
<pre><code translate="no">$ docker-compose up -d
</code></pre>
<p>Then, you can run docker-compose ps to check whether the five docker containers have started up properly. The following screenshot shows a typical interface after a successful startup.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_sucessful_setup_f2b3006487.png" alt="4-sucessful-setup.png" class="doc-image" id="4-sucessful-setup.png" />
    <span>4-sucessful-setup.png</span>
  </span>
</p>
<p>Now, you have successfully built a video search system, though the database has no videos.</p>
<h2 id="Step-4-Import-videos" class="common-anchor-header">Step 4: Import videos.<button data-href="#Step-4-Import-videos" class="anchor-icon" translate="no">
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
    </button></h2><p>In the deploy directory of the system repository, lies import_data.py, script for importing videos. You only need to update the path to the video files and the importing interval to run the script.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/5_update_path_video_5065928961.png" alt="5-update-path-video.png" class="doc-image" id="5-update-path-video.png" />
    <span>5-update-path-video.png</span>
  </span>
</p>
<p>data_path: The path to the videos to import.</p>
<p>time.sleep(0.5): The interval at which the system imports videos. The server that we use to build the video search system has 96 CPU cores. Therefore, it is recommended to set the interval to 0.5 second. Set the interval to a greater value if your server has fewer CPU cores. Otherwise, the importing process will put a burden on the CPU, and create zombie processes.</p>
<p>Run import_data.py to import videos.</p>
<pre><code translate="no">$ cd deploy
$ python3 import_data.py
</code></pre>
<p>Once the videos are imported, you are all set with your own video search system!</p>
<h2 id="Interface-display" class="common-anchor-header">Interface display<button data-href="#Interface-display" class="anchor-icon" translate="no">
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
    </button></h2><p>Open your browser and enter 192.168.1.38:8001 to see the interface of the video search system as shown below.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/6_video_search_interface_4c26d93e02.png" alt="6-video-search-interface.png" class="doc-image" id="6-video-search-interface.png" />
    <span>6-video-search-interface.png</span>
  </span>
</p>
<p>Toggle the gear switch in the top right to view all videos in the repository.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/7_view_all_videos_repository_26ff37cad5.png" alt="7-view-all-videos-repository.png" class="doc-image" id="7-view-all-videos-repository.png" />
    <span>7-view-all-videos-repository.png</span>
  </span>
</p>
<p>Click on the upload box on the top left to input a target image. As shown below, the system returns videos containing the most similar frames.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/8_enjoy_recommender_system_cats_bda1bf9db3.png" alt="8-enjoy-recommender-system-cats.png" class="doc-image" id="8-enjoy-recommender-system-cats.png" />
    <span>8-enjoy-recommender-system-cats.png</span>
  </span>
</p>
<p>Next, have fun with our video search system!</p>
<h2 id="Build-your-own" class="common-anchor-header">Build your own<button data-href="#Build-your-own" class="anchor-icon" translate="no">
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
    </button></h2><p>In this article, we used Milvus to build a system for searching for videos by images. This exemplifies the application of Milvus in unstructured data processing.</p>
<p>Milvus is compatible with multiple deep learning frameworks, and it makes possible searches in milliseconds for vectors at the scale of billions. Feel free to take Milvus with you to more AI scenarios: https://github.com/milvus-io/milvus.</p>
<p>Don’t be a stranger, follow us on <a href="https://twitter.com/milvusio/">Twitter</a> or join us on <a href="https://milvusio.slack.com/join/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ#/">Slack</a>!👇🏻</p>
