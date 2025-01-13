---
id: audio-retrieval-based-on-milvus.md
title: 처리 기술
author: Shiyu Chen
date: 2021-07-27T03:05:57.524Z
desc: Milvus를 사용한 오디오 검색을 통해 실시간으로 사운드 데이터를 분류하고 분석할 수 있습니다.
cover: assets.zilliz.com/blog_audio_search_56b990cee5.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/audio-retrieval-based-on-milvus'
---
<custom-h1>밀버스 기반 오디오 검색</custom-h1><p>소리는 정보 밀도가 높은 데이터 유형입니다. 비디오 콘텐츠 시대에 구식으로 느껴질 수도 있지만, 오디오는 여전히 많은 사람들에게 주요 정보 소스입니다. 청취자의 장기적인 감소에도 불구하고, 12세 이상 미국인의 83%가 2020년 한 주 동안 지상파(AM/FM) 라디오를 청취했습니다(2019년의 89%에서 감소). 반면, 온라인 오디오는 지난 20년 동안 청취자가 꾸준히 증가하여 동일한 <a href="https://www.journalism.org/fact-sheet/audio-and-podcasting/">퓨 리서치 센터의</a> 조사에 따르면 미국인의 62%가 매주 어떤 형태로든 오디오를 듣는 것으로 나타났습니다.</p>
<p>파동으로서 소리는 주파수, 진폭, 파형, 지속 시간이라는 네 가지 속성을 포함합니다. 음악 용어로는 이를 피치, 다이나믹, 톤, 지속 시간이라고 합니다. 또한 소리는 인간과 다른 동물이 주변 환경을 인식하고 이해하는 데 도움을 주며, 주변 사물의 위치와 움직임에 대한 맥락적 단서를 제공합니다.</p>
<p>정보 전달자로서 오디오는 세 가지 범주로 분류할 수 있습니다:</p>
<ol>
<li><strong>음성:</strong> 단어와 문법으로 구성된 커뮤니케이션 매체. 음성 인식 알고리즘을 사용하면 음성을 텍스트로 변환할 수 있습니다.</li>
<li><strong>음악:</strong> 음악: 멜로디, 화음, 리듬, 음색으로 구성된 구성을 만들기 위해 보컬 및/또는 악기 소리를 결합한 것입니다. 음악은 악보로 표현할 수 있습니다.</li>
<li><strong>파형:</strong> 아날로그 사운드를 디지털화하여 얻은 디지털 오디오 신호입니다. 파형은 음성, 음악, 자연음 또는 합성음을 나타낼 수 있습니다.</li>
</ol>
<p>오디오 검색은 온라인 미디어를 실시간으로 검색하고 모니터링하여 지적 재산권 침해를 단속하는 데 사용할 수 있습니다. 또한 오디오 데이터의 분류 및 통계 분석에서도 중요한 역할을 담당합니다.</p>
<h2 id="Processing-Technologies" class="common-anchor-header">처리 기술<button data-href="#Processing-Technologies" class="anchor-icon" translate="no">
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
    </button></h2><p>음성, 음악 및 기타 일반적인 소리는 각각 고유한 특성을 가지고 있으며 다양한 처리 방법이 필요합니다. 일반적으로 오디오는 음성이 포함된 그룹과 그렇지 않은 그룹으로 구분됩니다:</p>
<ul>
<li>음성 오디오는 자동 음성 인식을 통해 처리됩니다.</li>
<li>음악 오디오, 음향 효과 및 디지털화된 음성 신호를 포함한 비음성 오디오는 오디오 검색 시스템을 사용하여 처리됩니다.</li>
</ul>
<p>이 문서에서는 오디오 검색 시스템을 사용하여 비음성 오디오 데이터를 처리하는 방법에 대해 중점적으로 설명합니다. 음성 인식은 이 문서에서 다루지 않습니다.</p>
<h3 id="Audio-feature-extraction" class="common-anchor-header">오디오 특징 추출</h3><p>특징 추출은 오디오 유사성 검색을 가능하게 하는 오디오 검색 시스템에서 가장 중요한 기술입니다. 오디오 특징을 추출하는 방법은 크게 두 가지로 나뉩니다:</p>
<ul>
<li>가우스 혼합 모델(GMM)과 숨겨진 마르코프 모델(HMM)과 같은 전통적인 오디오 특징 추출 모델;</li>
<li>순환 신경망(RNN), 장단기 기억(LSTM) 네트워크, 인코딩-디코딩 프레임워크, 주의 메커니즘 등과 같은 딥러닝 기반 오디오 특징 추출 모델.</li>
</ul>
<p>딥러닝 기반 모델은 기존 모델보다 오류율이 훨씬 낮기 때문에 오디오 신호 처리 분야의 핵심 기술로 각광받고 있습니다.</p>
<p>오디오 데이터는 일반적으로 추출된 오디오 피처로 표현됩니다. 검색 프로세스는 오디오 데이터 자체보다는 이러한 특징과 속성을 검색하고 비교합니다. 따라서 오디오 유사도 검색의 효율성은 특징 추출 품질에 따라 크게 좌우됩니다.</p>
<p>이 기사에서는 <a href="https://github.com/qiuqiangkong/audioset_tagging_cnn">오디오 패턴 인식을 위해 사전 훈련된 대규모 오디오 신경망(PANN)</a> 을 사용하여 평균 평균 정확도(mAP)가 0.439인 특징 벡터를 추출합니다(Hershey et al., 2017).</p>
<p>오디오 데이터의 특징 벡터를 추출한 후 Milvus를 사용하여 고성능 특징 벡터 분석을 구현할 수 있습니다.</p>
<h3 id="Vector-similarity-search" class="common-anchor-header">벡터 유사도 검색</h3><p><a href="https://milvus.io/">Milvus는</a> 머신러닝 모델과 신경망에서 생성된 임베딩 벡터를 관리하기 위해 구축된 클라우드 네이티브 오픈 소스 벡터 데이터베이스입니다. 컴퓨터 비전, 자연어 처리, 계산 화학, 개인화된 추천 시스템 등과 같은 시나리오에서 널리 사용됩니다.</p>
<p>다음 다이어그램은 Milvus를 사용한 일반적인 유사도 검색 프로세스를 보여줍니다: <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_does_milvus_work_6926180543.png" alt="how-does-milvus-work.png" class="doc-image" id="how-does-milvus-work.png" /><span>how-does-milvus-work.png</span> </span></p>
<ol>
<li>비정형 데이터는 딥러닝 모델에 의해 특징 벡터로 변환되어 Milvus에 삽입됩니다.</li>
<li>Milvus는 이러한 특징 벡터를 저장하고 인덱싱합니다.</li>
<li>요청이 들어오면 Milvus는 쿼리 벡터와 가장 유사한 벡터를 검색하여 반환합니다.</li>
</ol>
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
    </button></h2><p>오디오 검색 시스템은 크게 삽입(검은색 선)과 검색(빨간색 선)의 두 부분으로 구성됩니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/audio_retrieval_system_663a911c95.png" alt="audio-retrieval-system.png" class="doc-image" id="audio-retrieval-system.png" />
   </span> <span class="img-wrapper"> <span>오디오 검색 시스템.png</span> </span></p>
<p>이 프로젝트에 사용된 샘플 데이터 세트에는 오픈 소스 게임 사운드가 포함되어 있으며, 코드는 <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/audio_similarity_search">Milvus 부트캠프에</a> 자세히 설명되어 있습니다.</p>
<h3 id="Step-1-Insert-data" class="common-anchor-header">1단계: 데이터 삽입</h3><p>아래는 사전 학습된 PANN 추론 모델로 오디오 임베딩을 생성하고 이를 Milvus에 삽입하여 각 벡터 임베딩에 고유 ID를 할당하는 예제 코드입니다.</p>
<pre><code translate="no"><span class="hljs-number">1</span> wav_name, vectors_audio = get_audio_embedding(audio_path)  
<span class="hljs-number">2</span> <span class="hljs-keyword">if</span> vectors_audio:    
<span class="hljs-number">3</span>     embeddings.<span class="hljs-built_in">append</span>(vectors_audio)  
<span class="hljs-number">4</span>     wav_names.<span class="hljs-built_in">append</span>(wav_name)  
<span class="hljs-number">5</span> ids_milvus = insert_vectors(milvus_client, table_name, embeddings)  
<span class="hljs-number">6</span> 
<button class="copy-code-btn"></button></code></pre>
<p>그런 다음 반환된 <strong>ids_milvus는</strong> 후속 처리를 위해 MySQL 데이터베이스에 보관된 오디오 데이터에 대한 다른 관련 정보(예: <strong>wav_name</strong>)와 함께 저장됩니다.</p>
<pre><code translate="no">1 get_ids_correlation(ids_milvus, wav_name)  
2 load_data_to_mysql(conn, cursor, table_name)    
3  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Audio-search" class="common-anchor-header">2단계: 오디오 검색</h3><p>Milvus는 미리 저장된 특징 벡터와 쿼리 오디오 데이터에서 추출한 입력 특징 벡터 사이의 내적 곱 거리를 계산하고, PANNs 추론 모델을 사용하여 검색된 오디오 데이터에 해당하는 유사한 특징 벡터의 <strong>ids_milvus를</strong> 반환합니다.</p>
<pre><code translate="no"><span class="hljs-number">1</span> _, vectors_audio = get_audio_embedding(audio_filename)    
<span class="hljs-number">2</span> results = search_vectors(milvus_client, table_name, [vectors_audio], METRIC_TYPE, TOP_K)  
<span class="hljs-number">3</span> ids_milvus = [x.<span class="hljs-built_in">id</span> <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]]  
<span class="hljs-number">4</span> audio_name = search_by_milvus_ids(conn, cursor, ids_milvus, table_name)    
<span class="hljs-number">5</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="API-reference-and-demo" class="common-anchor-header">API 참조 및 데모<button data-href="#API-reference-and-demo" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="API" class="common-anchor-header">API</h3><p>이 오디오 검색 시스템은 오픈 소스 코드로 구축되었습니다. 주요 기능은 오디오 데이터 삽입과 삭제입니다. 브라우저에서 <strong>127.0.0.1:<port></strong> /docs를 입력하면 모든 API를 볼 수 있습니다.</p>
<h3 id="Demo" class="common-anchor-header">데모</h3><p>자신의 오디오 데이터로 사용해 볼 수 있는 Milvus 기반 오디오 검색 시스템의 <a href="https://zilliz.com/solutions">라이브 데모를</a> 온라인에서 호스팅합니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/audio_search_demo_cae60625db.png" alt="audio-search-demo.png" class="doc-image" id="audio-search-demo.png" />
   </span> <span class="img-wrapper"> <span>오디오 검색 데모.png</span> </span></p>
<h2 id="Conclusion" class="common-anchor-header">결론<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>빅 데이터 시대에 살고 있는 사람들은 온갖 종류의 정보로 가득한 삶을 살고 있습니다. 이를 더 잘 이해하기 위해서는 기존의 텍스트 검색으로는 더 이상 충분하지 않습니다. 오늘날의 정보 검색 기술은 동영상, 이미지, 오디오 등 다양한 비정형 데이터 유형의 검색이 절실히 요구되고 있습니다.</p>
<p>컴퓨터가 처리하기 어려운 비정형 데이터는 딥러닝 모델을 사용하여 특징 벡터로 변환할 수 있습니다. 이렇게 변환된 데이터는 기계가 쉽게 처리할 수 있어 이전에는 불가능했던 방식으로 비정형 데이터를 분석할 수 있습니다. 오픈소스 벡터 데이터베이스인 Milvus는 AI 모델이 추출한 특징 벡터를 효율적으로 처리할 수 있으며, 다양한 공통 벡터 유사도 계산을 제공합니다.</p>
<h2 id="References" class="common-anchor-header">참고 자료<button data-href="#References" class="anchor-icon" translate="no">
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
    </button></h2><p>Hershey, S., Chaudhuri, S., Ellis, D.P., Gemmeke, J.F., Jansen, A., Moore, R.C., Plakal, M., Platt, D., Saurous, R.A., Seybold, B. and Slaney, M., 2017, March. 대규모 오디오 분류를 위한 CNN 아키텍처. 2017 IEEE 국제 음향, 음성 및 신호 처리 컨퍼런스(ICASSP), 131-135쪽, 2017.</p>
<h2 id="Dont-be-a-stranger" class="common-anchor-header">낯선 사람이 되지 마세요<button data-href="#Dont-be-a-stranger" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><p><a href="https://github.com/milvus-io/milvus/">GitHub에서</a> Milvus를 찾거나 기여하세요.</p></li>
<li><p><a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack을</a> 통해 커뮤니티와 소통하세요.</p></li>
<li><p><a href="https://twitter.com/milvusio">트위터에서</a> 소통하세요.</p></li>
</ul>
