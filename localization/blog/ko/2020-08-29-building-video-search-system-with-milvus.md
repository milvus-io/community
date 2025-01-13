---
id: building-video-search-system-with-milvus.md
title: 시스템 개요
author: milvus
date: 2020-08-29T00:18:19.703Z
desc: Milvus로 이미지로 동영상 검색하기
cover: assets.zilliz.com/header_3a822736b3.gif
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/building-video-search-system-with-milvus'
---
<custom-h1>동영상 검색 시스템을 구축하는 4단계</custom-h1><p>이름에서 알 수 있듯이 이미지로 동영상을 검색하는 것은 리포지토리에서 입력 이미지와 유사한 프레임을 포함하는 동영상을 검색하는 프로세스입니다. 핵심 단계 중 하나는 동영상을 임베딩, 즉 주요 프레임을 추출하고 그 특징을 벡터로 변환하는 것입니다. 이제 궁금한 독자 중 일부는 이미지로 동영상을 검색하는 것과 이미지로 이미지를 검색하는 것의 차이점이 무엇인지 궁금해할 수 있습니다. 사실, 동영상에서 키 프레임을 검색하는 것은 이미지별로 이미지를 검색하는 것과 동일합니다.</p>
<p>관심이 있으시다면 이전 문서 <a href="https://medium.com/unstructured-data-service/milvus-application-1-building-a-reverse-image-search-system-based-on-milvus-and-vgg-aed4788dd1ea">Milvus x VGG: 콘텐츠 기반 이미지 검색 시스템 구축을</a> 참조하시기 바랍니다.</p>
<h2 id="System-overview" class="common-anchor-header">시스템 개요<button data-href="#System-overview" class="anchor-icon" translate="no">
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
    </button></h2><p>다음 다이어그램은 이러한 동영상 검색 시스템의 일반적인 워크플로우를 보여줍니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_video_search_system_workflow_c68d658b93.png" alt="1-video-search-system-workflow.png" class="doc-image" id="1-video-search-system-workflow.png" />
   </span> <span class="img-wrapper"> <span>1-비디오-검색-시스템-워크플로우.png</span> </span></p>
<p>동영상을 가져올 때는 OpenCV 라이브러리를 사용하여 각 동영상을 프레임으로 잘라내고, 이미지 특징 추출 모델 VGG를 사용하여 주요 프레임의 벡터를 추출한 다음, 추출된 벡터(임베딩)를 Milvus에 삽입합니다. 원본 동영상 저장에는 Minio를, 동영상과 벡터 간의 상관관계 저장에는 Redis를 사용합니다.</p>
<p>동영상을 검색할 때는 동일한 VGG 모델을 사용하여 입력 이미지를 특징 벡터로 변환하고 이를 Milvus에 삽입하여 가장 유사도가 높은 벡터를 찾습니다. 그런 다음, 시스템은 Redis의 상관관계에 따라 인터페이스의 Minio에서 해당 동영상을 검색합니다.</p>
<h2 id="Data-preparation" class="common-anchor-header">데이터 준비<button data-href="#Data-preparation" class="anchor-icon" translate="no">
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
    </button></h2><p>이 글에서는 동영상 검색을 위한 엔드투엔드 솔루션을 구축하기 위한 샘플 데이터셋으로 Tumblr의 약 100,000개의 GIF 파일을 사용합니다. 자체 동영상 리포지토리를 사용할 수 있습니다.</p>
<h2 id="Deployment" class="common-anchor-header">배포<button data-href="#Deployment" class="anchor-icon" translate="no">
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
    </button></h2><p>이 문서에서 동영상 검색 시스템을 구축하기 위한 코드는 GitHub에 있습니다.</p>
<h3 id="Step-1-Build-Docker-images" class="common-anchor-header">1단계: Docker 이미지 빌드하기.</h3><p>동영상 검색 시스템에는 Milvus v0.7.1 도커, Redis 도커, Minio 도커, 프런트엔드 인터페이스 도커, 백엔드 API 도커가 필요합니다. 프론트엔드 인터페이스 도커와 백엔드 API 도커는 직접 빌드해야 하며, 나머지 세 개의 도커는 Docker Hub에서 직접 가져올 수 있습니다.</p>
<pre><code translate="no"># Get the video search code
$ git clone -b 0.10.0 https://github.com/JackLCL/search-video-demo.git

# Build front-end interface docker and api docker images
$ cd search-video-demo &amp; make all
</code></pre>
<h2 id="Step-2-Configure-the-environment" class="common-anchor-header">2단계: 환경 구성하기.<button data-href="#Step-2-Configure-the-environment" class="anchor-icon" translate="no">
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
    </button></h2><p>여기서는 위에서 언급한 5개의 컨테이너를 관리하기 위해 docker-compose.yml을 사용합니다. docker-compose.yml의 구성은 다음 표를 참조하세요:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_configure_docker_compose_yml_a33329e5e9.png" alt="2-configure-docker-compose-yml.png" class="doc-image" id="2-configure-docker-compose-yml.png" />
   </span> <span class="img-wrapper"> <span>2-configure-docker-compose-yml.png</span> </span></p>
<p>위 표의 IP 주소 192.168.1.38은 이 글에서 동영상 검색 시스템을 구축하기 위한 서버 주소입니다. 서버 주소로 업데이트해야 합니다.</p>
<p>Milvus, Redis, Minio에 대한 스토리지 디렉토리를 수동으로 생성한 다음 docker-compose.yml에 해당 경로를 추가해야 합니다. 이 예제에서는 다음 디렉터리를 생성했습니다:</p>
<pre><code translate="no">/mnt/redis/data /mnt/minio/data /mnt/milvus/db
</code></pre>
<p>다음과 같이 docker-compose.yml에서 Milvus, Redis 및 Minio를 구성할 수 있습니다:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_configure_milvus_redis_minio_docker_compose_yml_4a8104d53e.png" alt="3-configure-milvus-redis-minio-docker-compose-yml.png" class="doc-image" id="3-configure-milvus-redis-minio-docker-compose-yml.png" />
   </span> <span class="img-wrapper"> <span>3-configure-milvus-redis-minio-docker-compose-yml.png</span> </span></p>
<h2 id="Step-3-Start-the-system" class="common-anchor-header">3단계: 시스템 시작하기.<button data-href="#Step-3-Start-the-system" class="anchor-icon" translate="no">
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
    </button></h2><p>수정한 docker-compose.yml을 사용하여 동영상 검색 시스템에서 사용할 5개의 도커 컨테이너를 시작합니다:</p>
<pre><code translate="no">$ docker-compose up -d
</code></pre>
<p>그런 다음 docker-compose ps를 실행하여 5개의 도커 컨테이너가 제대로 시작되었는지 확인할 수 있습니다. 다음 스크린샷은 시작에 성공한 후의 일반적인 인터페이스를 보여줍니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_sucessful_setup_f2b3006487.png" alt="4-sucessful-setup.png" class="doc-image" id="4-sucessful-setup.png" />
   </span> <span class="img-wrapper"> <span>4-successful-setup.png</span> </span></p>
<p>이제 데이터베이스에 동영상이 없지만 동영상 검색 시스템을 성공적으로 구축했습니다.</p>
<h2 id="Step-4-Import-videos" class="common-anchor-header">4단계: 동영상 가져오기.<button data-href="#Step-4-Import-videos" class="anchor-icon" translate="no">
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
    </button></h2><p>시스템 저장소의 배포 디렉토리에 동영상 가져오기 스크립트인 import_data.py가 있습니다. 스크립트를 실행하려면 동영상 파일의 경로와 가져오기 간격을 업데이트하기만 하면 됩니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_update_path_video_5065928961.png" alt="5-update-path-video.png" class="doc-image" id="5-update-path-video.png" />
   </span> <span class="img-wrapper"> <span>5-update-path-video.png</span> </span></p>
<p>data_path: 가져올 동영상의 경로입니다.</p>
<p>time.sleep(0.5): 시스템에서 동영상을 가져오는 간격입니다. 동영상 검색 시스템을 구축하는 데 사용하는 서버에는 96개의 CPU 코어가 있습니다. 따라서 간격을 0.5초로 설정하는 것이 좋습니다. 서버의 CPU 코어 수가 더 적은 경우 간격을 더 큰 값으로 설정하세요. 그렇지 않으면 가져오기 프로세스가 CPU에 부담을 주고 좀비 프로세스를 생성할 수 있습니다.</p>
<p>import_data.py를 실행하여 동영상을 가져옵니다.</p>
<pre><code translate="no">$ cd deploy
$ python3 import_data.py
</code></pre>
<p>동영상을 가져오면 나만의 동영상 검색 시스템이 모두 준비된 것입니다!</p>
<h2 id="Interface-display" class="common-anchor-header">인터페이스 표시<button data-href="#Interface-display" class="anchor-icon" translate="no">
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
    </button></h2><p>브라우저를 열고 192.168.1.38:8001을 입력하면 아래와 같이 동영상 검색 시스템의 인터페이스가 표시됩니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_video_search_interface_4c26d93e02.png" alt="6-video-search-interface.png" class="doc-image" id="6-video-search-interface.png" />
   </span> <span class="img-wrapper"> <span>6-비디오-검색-인터페이스.png</span> </span></p>
<p>오른쪽 상단의 기어 스위치를 토글하여 리포지토리에 있는 모든 동영상을 볼 수 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_view_all_videos_repository_26ff37cad5.png" alt="7-view-all-videos-repository.png" class="doc-image" id="7-view-all-videos-repository.png" />
   </span> <span class="img-wrapper"> <span>7-모든-동영상-저장소-보기.png</span> </span></p>
<p>왼쪽 상단의 업로드 상자를 클릭하여 대상 이미지를 입력합니다. 아래 그림과 같이 가장 유사한 프레임이 포함된 동영상을 반환합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_enjoy_recommender_system_cats_bda1bf9db3.png" alt="8-enjoy-recommender-system-cats.png" class="doc-image" id="8-enjoy-recommender-system-cats.png" />
   </span> <span class="img-wrapper"> <span>8-enjoy-recommender-system-cats.png</span> </span></p>
<p>이제 동영상 검색 시스템을 즐겨보세요!</p>
<h2 id="Build-your-own" class="common-anchor-header">나만의 시스템 구축하기<button data-href="#Build-your-own" class="anchor-icon" translate="no">
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
    </button></h2><p>이 문서에서는 Milvus를 사용하여 이미지로 동영상을 검색하는 시스템을 구축했습니다. 이는 비정형 데이터 처리에서 Milvus의 적용을 보여주는 예시입니다.</p>
<p>Milvus는 여러 딥 러닝 프레임워크와 호환되며, 수십억 개 규모의 벡터를 밀리초 단위로 검색할 수 있습니다. 더 많은 AI 시나리오에 Milvus를 사용해 보세요(https://github.com/milvus-io/milvus).</p>
<p><a href="https://twitter.com/milvusio/">트위터에서</a> 팔로우하거나 <a href="https://milvusio.slack.com/join/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ#/">Slack에</a> 가입하세요(👇🏻).</p>
