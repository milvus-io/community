---
id: >-
  milvus-ngram-index-faster-keyword-matching-and-like-queries-for-agent-workloads.md
title: '밀버스 엔그램 인덱스를 소개합니다: 에이전트 워크로드를 위한 더 빠른 키워드 매칭 및 ''좋아요'' 쿼리'
author: Chenjie Tang
date: 2025-12-16T00:00:00.000Z
cover: assets.zilliz.com/Ngram_Index_cover_9e6063c638.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, Ngram Index, n-gram search, LIKE queries, full-text search'
meta_title: >
  Milvus Ngram Index: Faster Keyword Matching and LIKE Queries for Agent
  Workloads
desc: >-
  Milvus의 N그램 인덱스가 하위 문자열 매칭을 효율적인 n그램 조회로 전환하여 100배 빠른 성능을 제공함으로써 LIKE 쿼리를
  가속화하는 방법을 알아보세요.
origin: >-
  https://milvus.io/blog/milvus-ngram-index-faster-keyword-matching-and-like-queries-for-agent-workloads.md
---
<p>상담원 시스템에서 <strong>컨텍스트 검색은</strong> 전체 파이프라인의 기본 구성 요소로, 다운스트림 추론, 계획 및 조치를 위한 기반을 제공합니다. 벡터 검색은 상담원이 대규모의 비정형 데이터 세트에서 의도와 의미를 파악하는 의미론적으로 관련성 있는 컨텍스트를 검색하는 데 도움이 됩니다. 하지만 의미론적 연관성만으로는 충분하지 않은 경우가 많습니다. 상담원 파이프라인은 또한 제품 이름, 함수 호출, 오류 코드 또는 법적으로 중요한 용어와 같은 정확한 키워드 제약 조건을 적용하기 위해 전체 텍스트 검색에 의존합니다. 이 지원 계층은 검색된 컨텍스트가 관련성이 있을 뿐만 아니라 하드 텍스트 요구 사항을 명시적으로 충족하도록 보장합니다.</p>
<p>실제 워크로드는 이러한 요구 사항을 일관되게 반영합니다:</p>
<ul>
<li><p>고객 지원 도우미는 특정 제품이나 성분이 언급된 대화를 찾아야 합니다.</p></li>
<li><p>코딩 코파일럿은 정확한 함수 이름, API 호출 또는 오류 문자열이 포함된 스니펫을 찾습니다.</p></li>
<li><p>법률, 의료 및 학술 상담원은 문서에서 반드시 그대로 표시되어야 하는 조항이나 인용문을 필터링합니다.</p></li>
</ul>
<p>기존에는 시스템에서 SQL <code translate="no">LIKE</code> 연산자를 사용하여 이 작업을 처리했습니다. <code translate="no">name LIKE '%rod%'</code> 같은 쿼리는 간단하고 광범위하게 지원되지만, 동시성이 높고 데이터 양이 많은 경우 이러한 단순성은 상당한 성능 비용을 수반합니다.</p>
<ul>
<li><p><strong>인덱스가 없는</strong> <code translate="no">LIKE</code> 쿼리는 전체 컨텍스트 저장소를 스캔하여 행별로 패턴 매칭을 적용합니다. 수백만 개의 레코드가 있는 경우 단일 쿼리에도 몇 초가 걸릴 수 있으며, 이는 실시간 상담원 상호 작용에 비해 너무 느립니다.</p></li>
<li><p><strong>기존의 역 인덱스를 사용하더라도</strong> <code translate="no">%rod%</code> 와 같은 와일드카드 패턴은 엔진이 여전히 전체 사전을 탐색하고 각 항목에서 패턴 일치를 실행해야 하기 때문에 최적화하기 어렵습니다. 이 작업은 행 스캔을 피할 수 있지만 근본적으로 선형적이기 때문에 개선 효과가 미미합니다.</p></li>
</ul>
<p>이는 하이브리드 검색 시스템에서 분명한 차이를 만들어냅니다. 벡터 검색은 의미론적 연관성을 효율적으로 처리하지만, 정확한 키워드 필터링은 종종 파이프라인에서 가장 느린 단계가 됩니다.</p>
<p>Milvus는 기본적으로 메타데이터 필터링을 통해 하이브리드 벡터 및 전체 텍스트 검색을 지원합니다. 키워드 매칭의 한계를 해결하기 위해 Milvus는 텍스트를 작은 하위 문자열로 분할하고 효율적인 조회를 위해 색인화하여 <code translate="no">LIKE</code> 성능을 개선하는 <a href="https://milvus.io/docs/ngram.md"><strong>Ngram Index를</strong></a> 도입했습니다. 이를 통해 쿼리 실행 중에 검사하는 데이터의 양을 획기적으로 줄여 실제 에이전트 워크로드에서 <strong>수십에서 수백 배 빠른</strong> <code translate="no">LIKE</code> 쿼리를 제공할 수 있습니다.</p>
<p>이 글의 나머지 부분에서는 Milvus에서 Ngram Index가 어떻게 작동하는지 살펴보고 실제 시나리오에서 그 성능을 평가합니다.</p>
<h2 id="What-Is-the-Ngram-Index" class="common-anchor-header">Ngram 인덱스란 무엇인가요?<button data-href="#What-Is-the-Ngram-Index" class="anchor-icon" translate="no">
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
    </button></h2><p>데이터베이스에서 텍스트 필터링은 일반적으로 데이터를 검색하고 관리하는 데 사용되는 표준 쿼리 언어인 <strong>SQL을</strong> 사용하여 표현됩니다. 가장 널리 사용되는 텍스트 연산자 중 하나는 패턴 기반 문자열 일치를 지원하는 <code translate="no">LIKE</code> 입니다.</p>
<p>LIKE 표현식은 와일드카드 사용 방식에 따라 크게 네 가지 일반적인 패턴 유형으로 분류할 수 있습니다:</p>
<ul>
<li><p><strong>접두사 일치</strong> (<code translate="no">name LIKE '%rod%'</code>): 하위 문자열 막대가 텍스트의 아무 곳에나 나타나는 레코드와 일치시킵니다.</p></li>
<li><p><strong>접두사 일치</strong> (<code translate="no">name LIKE 'rod%'</code>): 텍스트가 rod로 시작하는 레코드를 일치시킵니다.</p></li>
<li><p><strong>접미사 일치</strong> (<code translate="no">name LIKE '%rod'</code>): 텍스트가 rod로 끝나는 레코드를 일치시킵니다.</p></li>
<li><p><strong>와일드카드 일치</strong> (<code translate="no">name LIKE '%rod%aab%bc_de'</code>): 여러 하위 문자열 조건(<code translate="no">%</code>)과 단일 문자 와일드카드(<code translate="no">_</code>)를 단일 패턴으로 결합합니다.</p></li>
</ul>
<p>이러한 패턴은 모양과 표현 방식이 다르지만 Milvus의 <strong>Ngram 인덱스는</strong> 동일한 기본 접근 방식을 사용하여 모든 패턴을 가속화합니다.</p>
<p>인덱스를 구축하기 전에 Milvus는 각 텍스트 값을 <em>n-그램이라고</em> 하는 고정된 길이의 짧고 겹치는 하위 문자열로 분할합니다. 예를 들어, n = 3인 경우, <strong>"Milvus</strong> "라는 단어는 다음과 같은 3그램으로 분해됩니다: <strong>"Mil",</strong> <strong>"ilv",</strong> <strong>"lvu</strong>", <strong>"vus"</strong>. 그런 다음 각 n-그램은 하위 문자열을 해당 문자열이 나타나는 문서 ID 집합에 매핑하는 역 인덱스에 저장됩니다. 쿼리 시, <code translate="no">LIKE</code> 조건은 n-그램 조회의 조합으로 변환되어 Milvus가 대부분의 일치하지 않는 레코드를 빠르게 필터링하고 훨씬 더 작은 후보 세트에 대해 패턴을 평가할 수 있게 해줍니다. 이것이 바로 값비싼 문자열 스캔을 효율적인 인덱스 기반 쿼리로 바꾸는 것입니다.</p>
<p><code translate="no">min_gram</code> 와 <code translate="no">max_gram</code> 라는 두 개의 매개변수가 Ngram 인덱스의 구성 방식을 제어합니다. 이 두 매개변수는 Milvus가 생성하고 색인하는 하위 문자열 길이의 범위를 정의합니다.</p>
<ul>
<li><p><strong><code translate="no">min_gram</code></strong>: 인덱싱할 최단 부분 문자열 길이. 실제로, 이것은 또한 Ngram 인덱스의 혜택을 받을 수 있는 최소 쿼리 부분 문자열 길이를 설정합니다.</p></li>
<li><p><strong><code translate="no">max_gram</code></strong>: 인덱싱할 가장 긴 부분 문자열 길이. 쿼리 시에는 더 긴 쿼리 문자열을 N그램으로 분할할 때 사용되는 최대 창 크기를 추가로 결정합니다.</p></li>
</ul>
<p>밀버스는 길이가 <code translate="no">min_gram</code> 와 <code translate="no">max_gram</code> 사이에 속하는 모든 인접한 하위 문자열을 색인함으로써 지원되는 모든 <code translate="no">LIKE</code> 패턴 유형을 가속화하기 위한 일관되고 효율적인 기반을 구축합니다.</p>
<h2 id="How-Does-the-Ngram-Index-Work" class="common-anchor-header">Ngram 인덱스는 어떻게 작동하나요?<button data-href="#How-Does-the-Ngram-Index-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus는 2단계 프로세스로 Ngram 인덱스를 구현합니다:</p>
<ul>
<li><p><strong>인덱스를 구축합니다:</strong> 데이터 수집 중에 각 문서에 대해 n-그램을 생성하고 역 인덱스를 구축합니다.</p></li>
<li><p><strong>쿼리 가속화:</strong> 인덱스를 사용하여 검색 범위를 작은 후보 집합으로 좁힌 다음, 그 후보 집합에서 정확히 일치하는 <code translate="no">LIKE</code> 을 확인합니다.</p></li>
</ul>
<p>구체적인 예시를 통해 이 프로세스를 더 쉽게 이해할 수 있습니다.</p>
<h3 id="Phase-1-Build-the-index" class="common-anchor-header">1단계: 색인 구축</h3><p><strong>텍스트를 n-그램으로 분해합니다:</strong></p>
<p>다음 설정으로 <strong>"Apple"이라는</strong> 텍스트를 색인한다고 가정해 보겠습니다:</p>
<ul>
<li><p><code translate="no">min_gram = 2</code></p></li>
<li><p><code translate="no">max_gram = 3</code></p></li>
</ul>
<p>이 설정에서 Milvus는 길이 2와 3의 연속된 모든 하위 문자열을 생성합니다:</p>
<ul>
<li><p>2그램 <code translate="no">Ap</code>, <code translate="no">pp</code>, <code translate="no">pl</code>, <code translate="no">le</code></p></li>
<li><p>3-grams: <code translate="no">App</code>, <code translate="no">ppl</code>, <code translate="no">ple</code></p></li>
</ul>
<p><strong>역 인덱스를 구축합니다:</strong></p>
<p>이제 5개의 레코드로 구성된 작은 데이터 세트를 생각해 봅시다:</p>
<ul>
<li><p><strong>문서 0</strong>: <code translate="no">Apple</code></p></li>
<li><p><strong>문서 1</strong>: <code translate="no">Pineapple</code></p></li>
<li><p><strong>문서 2</strong>: <code translate="no">Maple</code></p></li>
<li><p><strong>문서 3</strong>: <code translate="no">Apply</code></p></li>
<li><p><strong>문서 4</strong>: <code translate="no">Snapple</code></p></li>
</ul>
<p>수집하는 동안 Milvus는 각 레코드에 대해 n-그램을 생성하고 이를 반전된 인덱스에 삽입합니다. 이 인덱스에서</p>
<ul>
<li><p><strong>키는</strong> n-그램(하위 문자열)입니다.</p></li>
<li><p><strong>값은</strong> n-그램이 나타나는 문서 ID의 목록입니다.</p></li>
</ul>
<pre><code translate="no"><span class="hljs-string">&quot;Ap&quot;</span>  -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">3</span>]
<span class="hljs-string">&quot;App&quot;</span> -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">3</span>]
<span class="hljs-string">&quot;Ma&quot;</span>  -&gt; [<span class="hljs-number">2</span>]
<span class="hljs-string">&quot;Map&quot;</span> -&gt; [<span class="hljs-number">2</span>]
<span class="hljs-string">&quot;Pi&quot;</span>  -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;Pin&quot;</span> -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;Sn&quot;</span>  -&gt; [<span class="hljs-number">4</span>]
<span class="hljs-string">&quot;Sna&quot;</span> -&gt; [<span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ap&quot;</span>  -&gt; [<span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;apl&quot;</span> -&gt; [<span class="hljs-number">2</span>]
<span class="hljs-string">&quot;app&quot;</span> -&gt; [<span class="hljs-number">1</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ea&quot;</span>  -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;eap&quot;</span> -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;in&quot;</span>  -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;ine&quot;</span> -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;le&quot;</span>  -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ly&quot;</span>  -&gt; [<span class="hljs-number">3</span>]
<span class="hljs-string">&quot;na&quot;</span>  -&gt; [<span class="hljs-number">4</span>]
<span class="hljs-string">&quot;nap&quot;</span> -&gt; [<span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ne&quot;</span>  -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;nea&quot;</span> -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;pl&quot;</span>  -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">3</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ple&quot;</span> -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ply&quot;</span> -&gt; [<span class="hljs-number">3</span>]
<span class="hljs-string">&quot;pp&quot;</span>  -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">3</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ppl&quot;</span> -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">3</span>, <span class="hljs-number">4</span>]
<button class="copy-code-btn"></button></code></pre>
<p>이제 인덱스가 완전히 구축되었습니다.</p>
<h3 id="Phase-2-Accelerate-queries" class="common-anchor-header">2단계: 쿼리 가속화</h3><p><code translate="no">LIKE</code> 필터가 실행되면 Milvus는 다음 단계를 통해 N그램 인덱스를 사용하여 쿼리 평가 속도를 높입니다:</p>
<p><strong>1. 쿼리 용어를 추출합니다:</strong> <code translate="no">LIKE</code> 표현식에서 와일드카드가 없는 연속된 하위 문자열을 추출합니다(예: <code translate="no">'%apple%'</code> 은 <code translate="no">apple</code> 이 됩니다).</p>
<p><strong>2. 쿼리 용어 분해하기:</strong> 쿼리 용어는 길이(<code translate="no">L</code>)와 설정된 <code translate="no">min_gram</code> 및 <code translate="no">max_gram</code> 을 기준으로 n-그램으로 분해됩니다.</p>
<p><strong>3. 각 그램 찾기 및 교차:</strong> Milvus는 역 인덱스에서 쿼리 n-그램을 찾아 문서 ID 목록을 교차하여 작은 후보 집합을 생성합니다.</p>
<p><strong>4. 결과를 확인하고 반환합니다:</strong> 원래 <code translate="no">LIKE</code> 조건은 이 후보 집합에만 적용되어 최종 결과를 결정합니다.</p>
<p>실제로 쿼리가 n-그램으로 분할되는 방식은 패턴 자체의 형태에 따라 달라집니다. 이것이 어떻게 작동하는지 알아보기 위해 접두사 일치와 와일드카드 일치라는 두 가지 일반적인 경우에 초점을 맞춰 보겠습니다. 접두사 및 접미사 일치는 접두사 일치와 동일하게 작동하므로 별도로 다루지 않겠습니다.</p>
<p><strong>접두사 일치</strong></p>
<p>접미사 일치의 경우 실행은 <code translate="no">min_gram</code> 및 <code translate="no">max_gram</code> 에 대한 리터럴 하위 문자열(<code translate="no">L</code>)의 길이에 따라 달라집니다.</p>
<p><strong> <code translate="no">min_gram ≤ L ≤ max_gram</code></strong> (예: <code translate="no">strField LIKE '%ppl%'</code>)</p>
<p>리터럴 부분 문자열 <code translate="no">ppl</code> 은 전적으로 구성된 n-그램 범위 내에 있습니다. Milvus는 반전된 인덱스에서 n-그램 <code translate="no">&quot;ppl&quot;</code> 을 직접 조회하여 후보 문서 ID <code translate="no">[0, 1, 3, 4]</code> 를 생성합니다.</p>
<p>리터럴 자체가 인덱싱된 n-그램이기 때문에 모든 후보가 이미 접미사 조건을 만족합니다. 최종 검증 단계에서는 어떤 레코드도 제거되지 않으며 결과는 <code translate="no">[0, 1, 3, 4]</code> 로 유지됩니다.</p>
<p><strong> <code translate="no">L &gt; max_gram</code></strong> (예: <code translate="no">strField LIKE '%pple%'</code>)</p>
<p>리터럴 하위 문자열 <code translate="no">pple</code> 은 <code translate="no">max_gram</code> 보다 길기 때문에 창 크기 <code translate="no">max_gram</code> 를 사용하여 겹치는 n-그램으로 분해됩니다. <code translate="no">max_gram = 3</code> 을 사용하면 n-그램 <code translate="no">&quot;ppl&quot;</code> 과 <code translate="no">&quot;ple&quot;</code> 이 생성됩니다.</p>
<p>Milvus는 반전된 인덱스에서 각 n-그램을 조회합니다:</p>
<ul>
<li><p><code translate="no">&quot;ppl&quot;</code> → <code translate="no">[0, 1, 3, 4]</code></p></li>
<li><p><code translate="no">&quot;ple&quot;</code> → <code translate="no">[0, 1, 2, 4]</code></p></li>
</ul>
<p>이 목록을 교차하면 후보 집합 <code translate="no">[0, 1, 4]</code> 이 생성됩니다. 그런 다음 원래의 <code translate="no">LIKE '%pple%'</code> 필터가 이 후보에 적용됩니다. 세 가지 모두 조건을 만족하므로 최종 결과는 <code translate="no">[0, 1, 4]</code> 로 유지됩니다.</p>
<p><strong> <code translate="no">L &lt; min_gram</code></strong> (예: <code translate="no">strField LIKE '%pp%'</code>)</p>
<p>리터럴 하위 문자열은 <code translate="no">min_gram</code> 보다 짧기 때문에 인덱싱된 N그램으로 분해할 수 없습니다. 이 경우 N그램 인덱스를 사용할 수 없으며 Milvus는 기본 실행 경로로 돌아가서 패턴 일치를 통해 전체 스캔을 통해 <code translate="no">LIKE</code> 조건을 평가합니다.</p>
<p><strong>와일드카드 일치</strong> (예: <code translate="no">strField LIKE '%Ap%pple%'</code>)</p>
<p>이 패턴에는 여러 와일드카드가 포함되어 있으므로 Milvus는 먼저 이 패턴을 연속된 리터럴인 <code translate="no">&quot;Ap&quot;</code> 과 <code translate="no">&quot;pple&quot;</code> 으로 분할합니다.</p>
<p>그런 다음 Milvus는 각 리터럴을 독립적으로 처리합니다:</p>
<ul>
<li><p><code translate="no">&quot;Ap&quot;</code> 는 길이가 2이고 n-그램 범위에 속합니다.</p></li>
<li><p><code translate="no">&quot;pple&quot;</code> 는 <code translate="no">max_gram</code> 보다 길고 <code translate="no">&quot;ppl&quot;</code> 과 <code translate="no">&quot;ple&quot;</code> 로 분해됩니다.</p></li>
</ul>
<p>이렇게 하면 쿼리가 다음과 같은 n-그램으로 줄어듭니다:</p>
<ul>
<li><p><code translate="no">&quot;Ap&quot;</code> → <code translate="no">[0, 3]</code></p></li>
<li><p><code translate="no">&quot;ppl&quot;</code> → <code translate="no">[0, 1, 3, 4]</code></p></li>
<li><p><code translate="no">&quot;ple&quot;</code> → <code translate="no">[0, 1, 2, 4]</code></p></li>
</ul>
<p>이 목록들을 교차하면 단일 후보인 <code translate="no">[0]</code> 가 생성됩니다.</p>
<p>마지막으로 원본 <code translate="no">LIKE '%Ap%pple%'</code> 필터가 문서 0(<code translate="no">&quot;Apple&quot;</code>)에 적용됩니다. 전체 패턴을 만족시키지 못하므로 최종 결과 세트는 비어 있습니다.</p>
<h2 id="Limitations-and-Trade-offs-of-the-Ngram-Index" class="common-anchor-header">Ngram 인덱스의 한계와 장단점<button data-href="#Limitations-and-Trade-offs-of-the-Ngram-Index" class="anchor-icon" translate="no">
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
    </button></h2><p>Ngram 인덱스는 <code translate="no">LIKE</code> 쿼리 성능을 크게 향상시킬 수 있지만, 실제 배포 시 고려해야 할 장단점이 있습니다.</p>
<ul>
<li><strong>인덱스 크기 증가</strong></li>
</ul>
<p>Ngram 인덱스의 주요 비용은 스토리지 오버헤드 증가입니다. 인덱스는 길이가 <code translate="no">min_gram</code> 과 <code translate="no">max_gram</code> 사이에 있는 모든 인접한 하위 문자열을 저장하기 때문에 이 범위가 확장됨에 따라 생성되는 n-그램의 수가 빠르게 증가합니다. n그램 길이가 추가될 때마다 모든 텍스트 값에 대해 겹치는 하위 문자열의 전체 집합이 하나 더 추가되므로 인덱스 키와 해당 게시 목록의 수가 모두 증가합니다. 실제로 범위를 한 글자만 확장하면 표준 반전 인덱스에 비해 인덱스 크기가 대략 두 배가 될 수 있습니다.</p>
<ul>
<li><strong>모든 워크로드에 효과적이지 않음</strong></li>
</ul>
<p>Ngram 인덱스가 모든 워크로드를 가속화하지는 않습니다. 쿼리 패턴이 매우 불규칙하거나, 매우 짧은 리터럴을 포함하거나, 필터링 단계에서 데이터 세트를 작은 후보 집합으로 줄이는 데 실패하면 성능 이점이 제한될 수 있습니다. 이러한 경우, 인덱스가 존재하더라도 쿼리 실행 비용이 전체 스캔 비용에 근접할 수 있습니다.</p>
<h2 id="Evaluating-Ngram-Index-Performance-on-LIKE-Queries" class="common-anchor-header">'좋아요' 쿼리에서 Ngram 인덱스 성능 평가하기<button data-href="#Evaluating-Ngram-Index-Performance-on-LIKE-Queries" class="anchor-icon" translate="no">
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
    </button></h2><p>이 벤치마크의 목표는 Ngram 인덱스가 실제로 <code translate="no">LIKE</code> 쿼리를 얼마나 효과적으로 가속하는지 평가하는 것입니다.</p>
<h3 id="Test-Methodology" class="common-anchor-header">테스트 방법론</h3><p>성능을 맥락에 맞게 설명하기 위해 두 가지 기준 실행 모드와 비교합니다:</p>
<ul>
<li><p><strong>마스터</strong>: 인덱스 없이 무차별 실행.</p></li>
<li><p><strong>마스터 반전</strong>: 기존의 반전된 인덱스를 사용한 실행.</p></li>
</ul>
<p>서로 다른 데이터 특성을 다루기 위해 두 가지 테스트 시나리오를 설계했습니다:</p>
<ul>
<li><p><strong>위키 텍스트 데이터 세트</strong>: 100,000개의 행, 각 텍스트 필드가 1KB로 잘린 경우.</p></li>
<li><p><strong>단일 단어 데이터 세트</strong>: 1,000,000개의 행, 각 행에 단일 단어가 포함됨.</p></li>
</ul>
<p>두 시나리오 모두에 걸쳐 다음 설정이 일관되게 적용됩니다:</p>
<ul>
<li><p>쿼리는 접미사 <strong>일치 패턴을</strong> 사용합니다(<code translate="no">%xxx%</code>).</p></li>
<li><p>Ngram 인덱스는 <code translate="no">min_gram = 2</code> 및 <code translate="no">max_gram = 4</code></p></li>
<li><p>쿼리 실행 비용을 분리하고 결과 구체화 오버헤드를 피하기 위해 모든 쿼리는 전체 결과 집합 대신 <code translate="no">count(*)</code> 을 반환합니다.</p></li>
</ul>
<h3 id="Results" class="common-anchor-header">결과</h3><p><strong>위키에 대한 테스트, 각 줄은 콘텐츠 길이가 1000으로 잘린 100K 행의 위키 텍스트입니다.</strong></p>
<table>
<thead>
<tr><th></th><th>리터럴</th><th>시간(ms)</th><th>속도 향상</th><th>Count</th></tr>
</thead>
<tbody>
<tr><td>마스터</td><td>경기장</td><td>207.8</td><td></td><td>335</td></tr>
<tr><td>마스터 반전</td><td></td><td>2095</td><td></td><td>335</td></tr>
<tr><td>Ngram</td><td></td><td>1.09</td><td>190 / 1922</td><td>335</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>마스터</td><td>중등 학교</td><td>204.8</td><td></td><td>340</td></tr>
<tr><td>마스터-반전</td><td></td><td>2000</td><td></td><td>340</td></tr>
<tr><td>N그램</td><td></td><td>1.26</td><td>162.5 / 1587</td><td>340</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Master</td><td>남녀 공학, 중등 학교 스폰서입니다.</td><td>223.9</td><td></td><td>1</td></tr>
<tr><td>마스터 반전</td><td></td><td>2100</td><td></td><td>1</td></tr>
<tr><td>N그램</td><td></td><td>1.69</td><td>132.5 / 1242.6</td><td>1</td></tr>
</tbody>
</table>
<p><strong>단일 단어, 1M 행에 대한 테스트</strong></p>
<table>
<thead>
<tr><th></th><th>리터럴</th><th>시간(ms)</th><th>속도 향상</th><th>Count</th></tr>
</thead>
<tbody>
<tr><td>마스터</td><td>na</td><td>128.6</td><td></td><td>40430</td></tr>
<tr><td>마스터 반전</td><td></td><td>66.5</td><td></td><td>40430</td></tr>
<tr><td>Ngram</td><td></td><td>1.38</td><td>93.2 / 48.2</td><td>40430</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Master</td><td>nat</td><td>122</td><td></td><td>5200</td></tr>
<tr><td>마스터 인버트</td><td></td><td>65.1</td><td></td><td>5200</td></tr>
<tr><td>Ngram</td><td></td><td>1.27</td><td>96 / 51.3</td><td>5200</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Master</td><td>nati</td><td>118.8</td><td></td><td>1630</td></tr>
<tr><td>마스터 반전</td><td></td><td>66.9</td><td></td><td>1630</td></tr>
<tr><td>Ngram</td><td></td><td>1.21</td><td>98.2 / 55.3</td><td>1630</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Master</td><td>natio</td><td>118.4</td><td></td><td>1100</td></tr>
<tr><td>마스터 인버티드</td><td></td><td>65.1</td><td></td><td>1100</td></tr>
<tr><td>N그램</td><td></td><td>1.33</td><td>89 / 48.9</td><td>1100</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>마스터</td><td>국가</td><td>118</td><td></td><td>1100</td></tr>
<tr><td>마스터 반전</td><td></td><td>63.3</td><td></td><td>1100</td></tr>
<tr><td>Ngram</td><td></td><td>1.4</td><td>84.3 / 45.2</td><td>1100</td></tr>
</tbody>
</table>
<p><strong>참고:</strong> 이 결과는 5월에 실시한 벤치마크를 기반으로 합니다. 그 이후로 마스터 브랜치는 추가적인 성능 최적화를 거쳤으므로 현재 버전에서는 여기서 관찰된 성능 격차가 더 줄어들 것으로 예상됩니다.</p>
<p>벤치마크 결과에서 분명한 패턴을 확인할 수 있습니다. Ngram 인덱스는 모든 경우에서 좋아요 쿼리를 크게 가속화하며, 쿼리 실행 속도는 기본 텍스트 데이터의 구조와 길이에 따라 크게 달라집니다.</p>
<ul>
<li><p>1,000바이트로 잘린 위키 스타일 문서와 같이 <strong>긴 텍스트 필드의</strong> 경우 특히 성능 향상이 두드러집니다. 인덱스가 없는 무차별 대입 실행과 비교했을 때, Ngram 인덱스는 약 <strong>100~200배의</strong> 속도 향상을 달성합니다. 기존의 역 인덱스와 비교하면 <strong>1,200-1,900배에</strong> 이르는 훨씬 더 극적인 개선이 이루어집니다. 이는 긴 텍스트에 대한 '좋아요' 쿼리가 기존 인덱싱 접근 방식에서 특히 비용이 많이 드는 반면, n-그램 조회는 검색 공간을 매우 작은 후보 집합으로 빠르게 좁힐 수 있기 때문입니다.</p></li>
<li><p><strong>단일 단어 항목으로</strong> 구성된 데이터 세트에서는 이득이 더 작지만 여전히 상당합니다. 이 시나리오에서 Ngram 인덱스는 무차별 대입 실행보다 약 <strong>80-100배</strong>, 기존 역 인덱스보다 <strong>45-55배</strong> 더 빠르게 실행됩니다. 짧은 텍스트는 본질적으로 스캔 비용이 더 저렴하지만, N그램 기반 접근 방식은 여전히 불필요한 비교를 피하고 쿼리 비용을 지속적으로 줄여줍니다.</p></li>
</ul>
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
    </button></h2><p>N그램 인덱스는 텍스트를 고정 길이의 n그램으로 나누고 반전된 구조를 사용하여 색인을 생성함으로써 <code translate="no">LIKE</code> 쿼리를 가속화합니다. 이 설계는 비용이 많이 드는 하위 문자열 매칭을 최소한의 검증을 거친 효율적인 n-그램 조회로 전환합니다. 그 결과, <code translate="no">LIKE</code> 의 정확한 의미는 유지하면서 전체 텍스트 스캔은 피할 수 있습니다.</p>
<p>실제로 이 접근 방식은 광범위한 워크로드에 걸쳐 효과적이며, 특히 긴 텍스트 필드에서 퍼지 매칭에 대해 강력한 결과를 제공합니다. 따라서 Ngram 인덱스는 코드 검색, 고객 지원 상담원, 법률 및 의료 문서 검색, 기업 지식 기반, 학술 검색과 같이 정확한 키워드 매칭이 필수적인 실시간 시나리오에 적합합니다.</p>
<p>동시에, Ngram 인덱스는 신중한 구성을 통해 이점을 얻을 수 있습니다. 적절한 <code translate="no">min_gram</code> 및 <code translate="no">max_gram</code> 값을 선택하는 것은 인덱스 크기와 쿼리 성능의 균형을 맞추는 데 매우 중요합니다. 실제 쿼리 패턴을 반영하도록 조정할 경우, Ngram Index는 운영 시스템에서 고성능 <code translate="no">LIKE</code> 쿼리를 위한 실용적이고 확장 가능한 솔루션을 제공합니다.</p>
<p>Ngram 인덱스에 대한 자세한 내용은 아래 문서를 참조하세요:</p>
<ul>
<li><a href="https://milvus.io/docs/ngram.md">Ngram 인덱스 | Milvus 문서</a></li>
</ul>
<p>최신 Milvus의 기능에 대해 궁금한 점이 있거나 자세히 알아보고 싶으신가요?<a href="https://discord.com/invite/8uyFbECzPX"> Discord 채널에</a> 참여하거나<a href="https://github.com/milvus-io/milvus"> GitHub에</a> 이슈를 제출하세요. 또한<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus 오피스 아워를</a> 통해 20분간의 일대일 세션을 예약하여 인사이트, 안내 및 질문에 대한 답변을 얻을 수 있습니다.</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">Milvus 2.6 기능에 대해 자세히 알아보기<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6 소개: 10억 개 규모의 경제적인 벡터 검색</a></p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">임베딩 기능을 소개합니다: Milvus 2.6이 벡터화 및 시맨틱 검색을 간소화하는 방법</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">Milvus의 JSON 파쇄: 유연성을 갖춘 88.9배 더 빠른 JSON 필터링</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">진정한 엔티티 수준 검색을 실현합니다: Milvus의 새로운 구조 배열 및 MAX_SIM 기능</a></p></li>
<li><p><a href="https://milvus.io/blog/unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md">Milvus 2.6에서 지오메트리 필드 및 RTREE와 함께 지리공간 필터링 및 벡터 검색 제공</a></p></li>
<li><p><a href="https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md">Milvus에 AISAQ 도입: 메모리 사용량이 3,200배 더 저렴해진 10억 개 규모의 벡터 검색</a></p></li>
<li><p><a href="https://milvus.io/blog/faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md">Milvus에서 NVIDIA CAGRA 최적화: 더 빠른 인덱싱과 더 저렴한 쿼리를 위한 하이브리드 GPU-CPU 접근 방식</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">Milvus의 MinHash LSH: LLM 훈련 데이터의 중복을 방지하는 비밀 무기 </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">벡터 압축을 극한으로 끌어올리기: Milvus가 RaBitQ로 3배 더 많은 쿼리를 처리하는 방법</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">벤치마크는 거짓말 - 벡터 DB는 실제 테스트가 필요합니다. </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Milvus를 위해 카프카/펄서를 딱따구리로 대체했습니다. </a></p></li>
</ul>
