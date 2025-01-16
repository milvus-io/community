---
id: dynamically-change-log-levels-in-the-milvus-vector-database.md
title: Milvus 벡터 데이터베이스에서 동적으로 로그 수준 변경하기
author: Enwei Jiao
date: 2022-09-21T00:00:00.000Z
desc: 서비스를 다시 시작하지 않고 Milvus에서 로그 수준을 조정하는 방법을 알아보세요.
cover: >-
  assets.zilliz.com/Dynamically_Change_Log_Levels_in_the_Milvus_Vector_Database_58e31c66cc.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: >-
  https://milvus.io/blog/dynamically-change-log-levels-in-the-milvus-vector-database.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Dynamically_Change_Log_Levels_in_the_Milvus_Vector_Database_58e31c66cc.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>표지 이미지</span> </span></p>
<blockquote>
<p>이 글은 <a href="https://github.com/jiaoew1991">엔웨이 지아오가</a> 작성하고 <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">안젤라 니가</a> 번역했습니다.</p>
</blockquote>
<p>로그가 과도하게 출력되어 디스크 및 시스템 성능에 영향을 미치는 것을 방지하기 위해 Milvus는 기본적으로 실행 중 <code translate="no">info</code> 수준의 로그를 출력합니다. 그러나 <code translate="no">info</code> 수준의 로그만으로는 버그와 문제를 효율적으로 식별하기에 충분하지 않을 때가 있습니다. 게다가 로그 수준을 변경하고 서비스를 다시 시작하면 문제를 재현하는 데 실패하여 문제 해결이 더욱 어려워지는 경우도 있습니다. 따라서 Milvus 벡터 데이터베이스에서 로그 수준을 동적으로 변경할 수 있는 지원이 시급히 필요합니다.</p>
<p>이 문서에서는 로그 수준을 동적으로 변경할 수 있는 메커니즘을 소개하고 Milvus 벡터 데이터베이스에서 이를 수행하는 방법에 대한 지침을 제공하는 것을 목표로 합니다.</p>
<p><strong>이동하기:</strong></p>
<ul>
<li><a href="#Mechanism">메커니즘</a></li>
<li><a href="#How-to-dynamically-change-log-levels">로그 수준을 동적으로 변경하는 방법</a></li>
</ul>
<h2 id="Mechanism" class="common-anchor-header">메커니즘<button data-href="#Mechanism" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 벡터 데이터베이스는 Uber에서 오픈 소스로 제공하는 <a href="https://github.com/uber-go/zap">zap</a> 로거를 채택하고 있습니다. Go 언어 생태계에서 가장 강력한 로그 구성 요소 중 하나인 zap은 <a href="https://github.com/uber-go/zap/blob/master/http_handler.go">http_handler.go</a> 모듈을 통합하여 현재 로그 수준을 확인하고 HTTP 인터페이스를 통해 로그 수준을 동적으로 변경할 수 있도록 합니다.</p>
<p>Milvus는 <code translate="no">9091</code> 포트에서 제공하는 HTTP 서비스를 수신합니다. 따라서 <code translate="no">9091</code> 포트에 액세스하여 성능 디버깅, 메트릭, 상태 확인과 같은 기능을 활용할 수 있습니다. 마찬가지로 <code translate="no">9091</code> 포트는 동적 로그 수준 수정을 활성화하기 위해 재사용되며 <code translate="no">/log/level</code> 경로도 포트에 추가됩니다. 자세한 내용은<a href="https://github.com/milvus-io/milvus/pull/18430"> 로그 인터페이스 PR을</a> 참조하세요.</p>
<h2 id="How-to-dynamically-change-log-levels" class="common-anchor-header">로그 수준을 동적으로 변경하는 방법<button data-href="#How-to-dynamically-change-log-levels" class="anchor-icon" translate="no">
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
    </button></h2><p>이 섹션에서는 실행 중인 Milvus 서비스를 다시 시작하지 않고도 로그 수준을 동적으로 변경하는 방법에 대한 지침을 제공합니다.</p>
<h3 id="Prerequisite" class="common-anchor-header">전제 조건</h3><p>Milvus 구성 요소의 <code translate="no">9091</code> 포트에 액세스할 수 있는지 확인합니다.</p>
<h3 id="Change-the-log-level" class="common-anchor-header">로그 수준 변경하기</h3><p>Milvus 프록시의 IP 주소가 <code translate="no">192.168.48.12</code> 이라고 가정합니다.</p>
<p>먼저 <code translate="no">$ curl -X GET 192.168.48.12:9091/log/level</code> 을 실행하여 프록시의 현재 로그 수준을 확인할 수 있습니다.</p>
<p>그런 다음 로그 수준을 지정하여 조정할 수 있습니다. 로그 수준 옵션은 다음과 같습니다:</p>
<ul>
<li><p><code translate="no">debug</code></p></li>
<li><p><code translate="no">info</code></p></li>
<li><p><code translate="no">warn</code></p></li>
<li><p><code translate="no">error</code></p></li>
<li><p><code translate="no">dpanic</code></p></li>
<li><p><code translate="no">panic</code></p></li>
<li><p><code translate="no">fatal</code></p></li>
</ul>
<p>다음 예제 코드는 로그 수준을 기본 로그 수준인 <code translate="no">info</code> 에서 <code translate="no">error</code> 로 변경합니다.</p>
<pre><code translate="no" class="language-Python">$ curl -X PUT 192.168.48.12:9091/log/level -d level=error
<button class="copy-code-btn"></button></code></pre>
