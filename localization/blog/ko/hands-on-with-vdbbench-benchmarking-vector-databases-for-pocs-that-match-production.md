---
id: >-
  hands-on-with-vdbbench-benchmarking-vector-databases-for-pocs-that-match-production.md
title: 'VDBBench 실습: 프로덕션과 일치하는 POC를 위한 벡터 데이터베이스 벤치마킹하기'
author: Yifan Cai
date: 2025-08-15T00:00:00.000Z
desc: >-
  VDBBench를 사용하여 실제 프로덕션 데이터로 벡터 데이터베이스를 테스트하는 방법을 알아보세요. 실제 성능을 예측하는 사용자 지정 데이터
  세트 POC에 대한 단계별 가이드입니다.
cover: assets.zilliz.com/vdbbench_cover_min_2f86466839.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: >-
  VectorDBBench, POC, vector database, VDBBench, benchmarking vector database,
  how to choose a vector database
meta_title: |
  Tutorial | How to Evaluate VectorDBs that Match Production via VDBBench
origin: >-
  https://milvus.io/blog/hands-on-with-vdbbench-benchmarking-vector-databases-for-pocs-that-match-production.md
---
<p>벡터 데이터베이스는 이제 고객 서비스, 콘텐츠 생성, 검색, 추천 등을 위한 다양한 LLM 기반 애플리케이션을 구동하는 AI 인프라의 핵심 부분입니다.</p>
<p>Milvus 및 Zilliz Cloud와 같은 특수 목적의 벡터 데이터베이스부터 벡터 검색 기능이 추가된 기존 데이터베이스에 이르기까지 다양한 옵션이 시중에 나와 있기 때문에 <strong>적합한 데이터베이스를 선택하는 것은 벤치마크 차트를 읽는 것만큼 간단하지 않습니다.</strong></p>
<p>대부분의 팀은 커밋하기 전에 개념 증명(POC)을 실행하는데, 이는 이론적으로는 현명한 방법이지만 실제로는 서류상으로는 인상적으로 보이는 많은 벤더 벤치마크가 실제 조건에서는 무너집니다.</p>
<p>주된 이유 중 하나는 대부분의 성능 주장이 최신 임베딩과 매우 다르게 작동하는 2006~2012년의 오래된 데이터 세트(SIFT, GloVe, LAION)를 기반으로 하고 있기 때문입니다. 예를 들어, SIFT는 128차원 벡터를 사용하는 반면, 오늘날의 AI 모델은 훨씬 더 높은 차원(최신 OpenAI의 경우 3,072, Cohere의 경우 1,024)을 생성하므로 성능, 비용 및 확장성에 영향을 미치는 큰 변화가 있습니다.</p>
<h2 id="The-Fix-Test-with-Your-Data-Not-Canned-Benchmarks" class="common-anchor-header">해결 방법: 정형화된 벤치마크가 아닌 실제 데이터로 테스트하기<button data-href="#The-Fix-Test-with-Your-Data-Not-Canned-Benchmarks" class="anchor-icon" translate="no">
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
    </button></h2><p>가장 간단하고 효과적인 해결책은 애플리케이션이 실제로 생성하는 벡터로 POC 평가를 실행하는 것입니다. 즉, 임베딩 모델, 실제 쿼리 및 실제 데이터 배포를 사용해야 합니다.</p>
<p>오픈 소스 벡터 데이터베이스 벤치마킹 도구인 <a href="https://milvus.io/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md"><strong>VDBBench는</strong></a> 바로 이러한 용도로 만들어졌습니다. Milvus, Elasticsearch, pgvector 등을 포함한 모든 벡터 데이터베이스의 평가와 비교를 지원하며 실제 프로덕션 워크로드를 시뮬레이션합니다.</p>
<p><a href="https://github.com/zilliztech/VectorDBBench">VDBBench 1.0 다운로드 →</a> |<a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch&amp;__hstc=175614333.dc4bcf53f6c7d650ea8978dcdb9e7009.1727350436713.1755165753372.1755169827021.775&amp;__hssc=175614333.3.1755169827021&amp;__hsfp=1940526538"> 리더보드 보기 →</a> | <a href="https://milvus.io/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md">VDBBench란?</a></p>
<p>VDB벤치를 사용하면</p>
<ul>
<li><p>임베딩 모델의<strong>자체 데이터로 테스트하기</strong> </p></li>
<li><p><strong>동시 삽입, 쿼리 및 스트리밍 수집</strong> 시뮬레이션</p></li>
<li><p><strong>P95/P99 지연 시간, 지속 처리량 및 리콜 정확도</strong> 측정</p></li>
<li><p>동일한 조건에서 여러 데이터베이스에 걸쳐 벤치마크 수행</p></li>
<li><p><strong>사용자 정의 데이터 세트 테스트가</strong> 가능하므로 결과가 실제로 프로덕션과 일치합니다.</p></li>
</ul>
<p>다음에서는 VDBBench와 실제 데이터로 프로덕션 등급 POC를 실행하는 방법을 안내하여 자신감 있고 미래 지향적인 선택을 할 수 있도록 도와드리겠습니다.</p>
<h2 id="How-to-Evaluate-VectorDBs-with-Your-Custom-Datasets-with-VDBBench" class="common-anchor-header">VDBBench로 사용자 정의 데이터 세트로 벡터DB를 평가하는 방법<button data-href="#How-to-Evaluate-VectorDBs-with-Your-Custom-Datasets-with-VDBBench" class="anchor-icon" translate="no">
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
    </button></h2><p>시작하기 전에 Python 3.11 이상이 설치되어 있는지 확인하세요. 완전한 설정과 테스트에는 약 2~3시간이 소요되며, 필요한 경우 문제 해결을 위한 중급 수준의 Python 지식이 필요합니다.</p>
<h3 id="Installation-and-Configuration" class="common-anchor-header">설치 및 구성</h3><p>하나의 데이터베이스를 평가하는 경우 이 명령을 실행하세요:</p>
<pre><code translate="no">pip install vectordb-bench
<button class="copy-code-btn"></button></code></pre>
<p>지원되는 모든 데이터베이스를 비교하려면 다음 명령을 실행하세요:</p>
<pre><code translate="no">pip install vectordb-bench[<span class="hljs-built_in">all</span>]
<button class="copy-code-btn"></button></code></pre>
<p>특정 데이터베이스 클라이언트의 경우(예: Elasticsearch):</p>
<pre><code translate="no">pip install vectordb-bench[elastic]
<button class="copy-code-btn"></button></code></pre>
<p>지원되는 모든 데이터베이스와 해당 설치 명령어는 이 <a href="https://github.com/zilliztech/VectorDBBench">GitHub 페이지에서</a> 확인하세요.</p>
<h3 id="Launching-VDBBench" class="common-anchor-header">VDBBench 시작하기</h3><p>다음을 사용하여 <strong>VDBBench를</strong> 시작합니다:</p>
<pre><code translate="no">init_bench
<button class="copy-code-btn"></button></code></pre>
<p>예상 콘솔 출력: 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_expected_console_output_66e1a218b7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>웹 인터페이스는 로컬에서 사용할 수 있습니다:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_2e4dd7ea69.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Data-Preparation-and-Format-Conversion" class="common-anchor-header">데이터 준비 및 형식 변환</h3><p>VDBBench는 다양한 데이터베이스 및 데이터 세트에서 일관된 테스트를 보장하기 위해 특정 스키마가 포함된 구조화된 Parquet 파일이 필요합니다.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>파일 이름</strong></th><th style="text-align:center"><strong>목적</strong></th><th style="text-align:center"><strong>필수</strong></th><th style="text-align:center"><strong>콘텐츠 예제</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">train.parquet</td><td style="text-align:center">데이터베이스 삽입을 위한 벡터 컬렉션</td><td style="text-align:center">✅</td><td style="text-align:center">벡터 ID + 벡터 데이터 (list[float])</td></tr>
<tr><td style="text-align:center">test.parquet</td><td style="text-align:center">쿼리를 위한 벡터 컬렉션</td><td style="text-align:center">✅</td><td style="text-align:center">벡터 ID + 벡터 데이터 (list[float])</td></tr>
<tr><td style="text-align:center">neighbors.parquet</td><td style="text-align:center">쿼리 벡터에 대한 실측 자료(실제 가장 가까운 이웃 ID 목록)</td><td style="text-align:center">✅</td><td style="text-align:center">query_id -&gt; [top_k 유사 ID 목록]</td></tr>
<tr><td style="text-align:center">scalar_labels.parquet</td><td style="text-align:center">레이블(벡터 이외의 엔티티를 설명하는 메타데이터)</td><td style="text-align:center">❌</td><td style="text-align:center">ID -&gt; 레이블</td></tr>
</tbody>
</table>
<p>필수 파일 사양:</p>
<ul>
<li><p><strong>훈련 벡터 파일(train.parquet</strong> )에는 증분 정수가 포함된 ID 열과 float32 배열이 포함된 벡터 열이 포함되어야 합니다. 열 이름은 구성할 수 있지만, 적절한 인덱싱을 위해 ID 열은 정수 유형을 사용해야 합니다.</p></li>
<li><p><strong>테스트 벡터 파일(test.parquet)은</strong> 학습 데이터와 동일한 구조를 따릅니다. ID 열 이름은 "id"여야 하며, 벡터 열 이름은 데이터 스키마와 일치하도록 사용자 지정할 수 있습니다.</p></li>
<li><p><strong>기준 실측 데이터 파일(neighbors.parquet</strong> )에는 각 테스트 쿼리에 대한 가장 가까운 이웃 참조가 포함되어 있습니다. 여기에는 테스트 벡터 ID에 해당하는 ID 열과 훈련 세트의 올바른 가장 가까운 이웃 ID가 포함된 이웃 배열 열이 필요합니다.</p></li>
<li><p><strong>스칼라 레이블 파일(scalar_labels.parquet</strong> )은 선택 사항이며 훈련 벡터와 관련된 메타데이터 레이블을 포함하며, 필터링된 검색 테스트에 유용합니다.</p></li>
</ul>
<h3 id="Data-Format-Challenges" class="common-anchor-header">데이터 형식 문제</h3><p>대부분의 프로덕션 벡터 데이터는 VDBBench 요구 사항과 직접적으로 일치하지 않는 형식으로 존재합니다. CSV 파일은 일반적으로 임베딩을 배열의 문자열 표현으로 저장하고, NPY 파일은 메타데이터가 없는 원시 숫자 행렬을 포함하며, 데이터베이스 내보내기는 JSON 또는 기타 구조화된 형식을 사용하는 경우가 많습니다.</p>
<p>이러한 형식을 수동으로 변환하려면 문자열 표현을 숫자 배열로 구문 분석하고, FAISS와 같은 라이브러리를 사용하여 정확한 최접근 이웃을 계산하고, ID 일관성을 유지하면서 데이터 세트를 적절히 분할하고, 모든 데이터 유형이 Parquet 사양과 일치하는지 확인하는 등 여러 복잡한 단계를 거쳐야 합니다.</p>
<h3 id="Automated-Format-Conversion" class="common-anchor-header">자동화된 형식 변환</h3><p>변환 프로세스를 간소화하기 위해 형식 변환, 기준 데이터 계산, 적절한 데이터 구조화를 자동으로 처리하는 Python 스크립트를 개발했습니다.</p>
<p><strong>CSV 입력 형식:</strong></p>
<pre><code translate="no"><span class="hljs-built_in">id</span>,emb,label
<span class="hljs-number">1</span>,<span class="hljs-string">&quot;[0.12,0.56,0.89,...]&quot;</span>,A
<span class="hljs-number">2</span>,<span class="hljs-string">&quot;[0.33,0.48,0.90,...]&quot;</span>,B
<button class="copy-code-btn"></button></code></pre>
<p><strong>NPY 입력 형식:</strong></p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
vectors = np.<span class="hljs-property">random</span>.<span class="hljs-title function_">rand</span>(<span class="hljs-number">10000</span>, <span class="hljs-number">768</span>).<span class="hljs-title function_">astype</span>(<span class="hljs-string">&#x27;float32&#x27;</span>)
np.<span class="hljs-title function_">save</span>(<span class="hljs-string">&quot;vectors.npy&quot;</span>, vectors)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Conversion-Script-Implementation" class="common-anchor-header">변환 스크립트 구현</h3><p><strong>필요한 종속성을 설치합니다:</strong></p>
<pre><code translate="no">pip install numpy pandas faiss-cpu
<button class="copy-code-btn"></button></code></pre>
<p><strong>변환을 실행합니다:</strong></p>
<pre><code translate="no">python convert_to_vdb_format.py \
  --train data/train.csv \
  --<span class="hljs-built_in">test</span> data/test.csv \
  --out datasets/custom \
  --topk 10
<button class="copy-code-btn"></button></code></pre>
<p><strong>매개변수 참조:</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>매개변수 이름</strong></th><th style="text-align:center"><strong>필수</strong></th><th style="text-align:center"><strong>유형</strong></th><th style="text-align:center"><strong>설명</strong></th><th style="text-align:center"><strong>기본값</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><code translate="no">--train</code></td><td style="text-align:center">예</td><td style="text-align:center">문자열</td><td style="text-align:center">학습 데이터 경로로, CSV 또는 NPY 형식을 지원합니다. ID 열이 자동 생성되지 않는 경우 CSV에는 반드시 emb 열이 포함되어야 합니다.</td><td style="text-align:center">None</td></tr>
<tr><td style="text-align:center"><code translate="no">--test</code></td><td style="text-align:center">예</td><td style="text-align:center">문자열</td><td style="text-align:center">쿼리 데이터 경로, CSV 또는 NPY 형식을 지원합니다. 학습 데이터와 동일한 형식</td><td style="text-align:center">없음</td></tr>
<tr><td style="text-align:center"><code translate="no">--out</code></td><td style="text-align:center">예</td><td style="text-align:center">문자열</td><td style="text-align:center">출력 디렉토리 경로, 변환된 쪽모이 세공 파일 및 이웃 인덱스 파일 저장</td><td style="text-align:center">없음</td></tr>
<tr><td style="text-align:center"><code translate="no">--labels</code></td><td style="text-align:center">아니요</td><td style="text-align:center">문자열</td><td style="text-align:center">레이블 CSV 경로, 레이블 저장에 사용되는 레이블 열(문자열 배열 형식)을 포함해야 합니다.</td><td style="text-align:center">없음</td></tr>
<tr><td style="text-align:center"><code translate="no">--topk</code></td><td style="text-align:center">아니요</td><td style="text-align:center">Integer</td><td style="text-align:center">계산할 때 반환할 가장 가까운 이웃의 개수</td><td style="text-align:center">10</td></tr>
</tbody>
</table>
<p><strong>출력 디렉터리 구조:</strong></p>
<pre><code translate="no">datasets/custom/
├── train.parquet        <span class="hljs-comment"># Training vectors</span>
├── test.parquet         <span class="hljs-comment"># Query vectors  </span>
├── neighbors.parquet    <span class="hljs-comment"># Ground Truth</span>
└── scalar_labels.parquet <span class="hljs-comment"># Optional scalar labels</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Complete-Conversion-Script" class="common-anchor-header">전체 변환 스크립트</h3><pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> argparse
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">import</span> pandas <span class="hljs-keyword">as</span> pd
<span class="hljs-keyword">import</span> faiss
<span class="hljs-keyword">from</span> ast <span class="hljs-keyword">import</span> literal_eval
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">Optional</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">load_csv</span>(<span class="hljs-params">path: <span class="hljs-built_in">str</span></span>):
    df = pd.read_csv(path)
    <span class="hljs-keyword">if</span> <span class="hljs-string">&#x27;emb&#x27;</span> <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> df.columns:
        <span class="hljs-keyword">raise</span> ValueError(<span class="hljs-string">f&quot;CSV file missing &#x27;emb&#x27; column: <span class="hljs-subst">{path}</span>&quot;</span>)
   df[<span class="hljs-string">&#x27;emb&#x27;</span>] = df[<span class="hljs-string">&#x27;emb&#x27;</span>].apply(literal_eval)
    <span class="hljs-keyword">if</span> <span class="hljs-string">&#x27;id&#x27;</span> <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> df.columns:
        df.insert(<span class="hljs-number">0</span>, <span class="hljs-string">&#x27;id&#x27;</span>, <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(df)))
    <span class="hljs-keyword">return</span> df
<span class="hljs-keyword">def</span> <span class="hljs-title function_">load_npy</span>(<span class="hljs-params">path: <span class="hljs-built_in">str</span></span>):
    arr = np.load(path)
    df = pd.DataFrame({
        <span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-built_in">range</span>(arr.shape[<span class="hljs-number">0</span>]),
        <span class="hljs-string">&#x27;emb&#x27;</span>: arr.tolist()
    })
    <span class="hljs-keyword">return</span> df
<span class="hljs-keyword">def</span> <span class="hljs-title function_">load_vectors</span>(<span class="hljs-params">path: <span class="hljs-built_in">str</span></span>) -&gt; pd.DataFrame:
    <span class="hljs-keyword">if</span> path.endswith(<span class="hljs-string">&#x27;.csv&#x27;</span>):
        <span class="hljs-keyword">return</span> load_csv(path)
    <span class="hljs-keyword">elif</span> path.endswith(<span class="hljs-string">&#x27;.npy&#x27;</span>):
        <span class="hljs-keyword">return</span> load_npy(path)
    <span class="hljs-keyword">else</span>:
        <span class="hljs-keyword">raise</span> ValueError(<span class="hljs-string">f&quot;Unsupported file format: <span class="hljs-subst">{path}</span>&quot;</span>)
<span class="hljs-keyword">def</span> <span class="hljs-title function_">compute_ground_truth</span>(<span class="hljs-params">train_vectors: np.ndarray, test_vectors: np.ndarray, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">10</span></span>):
    dim = train_vectors.shape[<span class="hljs-number">1</span>]
    index = faiss.IndexFlatL2(dim)
    index.add(train_vectors)
    _, indices = index.search(test_vectors, top_k)
    <span class="hljs-keyword">return</span> indices
<span class="hljs-keyword">def</span> <span class="hljs-title function_">save_ground_truth</span>(<span class="hljs-params">df_path: <span class="hljs-built_in">str</span>, indices: np.ndarray</span>):
    df = pd.DataFrame({
        <span class="hljs-string">&quot;id&quot;</span>: np.arange(indices.shape[<span class="hljs-number">0</span>]),
        <span class="hljs-string">&quot;neighbors_id&quot;</span>: indices.tolist()
    })
    df.to_parquet(df_path, index=<span class="hljs-literal">False</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;✅ Ground truth saved successfully: <span class="hljs-subst">{df_path}</span>&quot;</span>)
<span class="hljs-keyword">def</span> <span class="hljs-title function_">main</span>(<span class="hljs-params">train_path: <span class="hljs-built_in">str</span>, test_path: <span class="hljs-built_in">str</span>, output_dir: <span class="hljs-built_in">str</span>,
         label_path: <span class="hljs-type">Optional</span>[<span class="hljs-built_in">str</span>] = <span class="hljs-literal">None</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">10</span></span>):
    os.makedirs(output_dir, exist_ok=<span class="hljs-literal">True</span>)
    <span class="hljs-comment"># Load training and query data</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;📥 Loading training data...&quot;</span>)
    train_df = load_vectors(train_path)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;📥 Loading query data...&quot;</span>)
    test_df = load_vectors(test_path)
    <span class="hljs-comment"># Extract vectors and convert to numpy</span>
    train_vectors = np.array(train_df[<span class="hljs-string">&#x27;emb&#x27;</span>].to_list(), dtype=<span class="hljs-string">&#x27;float32&#x27;</span>)
    test_vectors = np.array(test_df[<span class="hljs-string">&#x27;emb&#x27;</span>].to_list(), dtype=<span class="hljs-string">&#x27;float32&#x27;</span>)
    <span class="hljs-comment"># Save parquet files retaining all fields</span>
    train_df.to_parquet(os.path.join(output_dir, <span class="hljs-string">&#x27;train.parquet&#x27;</span>), index=<span class="hljs-literal">False</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;✅ train.parquet saved successfully, <span class="hljs-subst">{<span class="hljs-built_in">len</span>(train_df)}</span> records total&quot;</span>)
    test_df.to_parquet(os.path.join(output_dir, <span class="hljs-string">&#x27;test.parquet&#x27;</span>), index=<span class="hljs-literal">False</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;✅ test.parquet saved successfully, <span class="hljs-subst">{<span class="hljs-built_in">len</span>(test_df)}</span> records total&quot;</span>)
    <span class="hljs-comment"># Compute ground truth</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;🔍 Computing Ground Truth (nearest neighbors)...&quot;</span>)
    gt_indices = compute_ground_truth(train_vectors, test_vectors, top_k=top_k)
    save_ground_truth(os.path.join(output_dir, <span class="hljs-string">&#x27;neighbors.parquet&#x27;</span>), gt_indices)
    <span class="hljs-comment"># Load and save label file (if provided)</span>
    <span class="hljs-keyword">if</span> label_path:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;📥 Loading label file...&quot;</span>)
        label_df = pd.read_csv(label_path)
        <span class="hljs-keyword">if</span> <span class="hljs-string">&#x27;labels&#x27;</span> <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> label_df.columns:
            <span class="hljs-keyword">raise</span> ValueError(<span class="hljs-string">&quot;Label file must contain &#x27;labels&#x27; column&quot;</span>)
        label_df[<span class="hljs-string">&#x27;labels&#x27;</span>] = label_df[<span class="hljs-string">&#x27;labels&#x27;</span>].apply(literal_eval)
        label_df.to_parquet(os.path.join(output_dir, <span class="hljs-string">&#x27;scalar_labels.parquet&#x27;</span>), index=<span class="hljs-literal">False</span>)
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;✅ Label file saved as scalar_labels.parquet&quot;</span>)

<span class="hljs-keyword">if</span> 
name
 == <span class="hljs-string">&quot;__main__&quot;</span>:
    parser = argparse.ArgumentParser(description=<span class="hljs-string">&quot;Convert CSV/NPY vectors to VectorDBBench data format (retaining all columns)&quot;</span>)
    parser.add_argument(<span class="hljs-string">&quot;--train&quot;</span>, required=<span class="hljs-literal">True</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Training data path (CSV or NPY)&quot;</span>)
    parser.add_argument(<span class="hljs-string">&quot;--test&quot;</span>, required=<span class="hljs-literal">True</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Query data path (CSV or NPY)&quot;</span>)
    parser.add_argument(<span class="hljs-string">&quot;--out&quot;</span>, required=<span class="hljs-literal">True</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Output directory&quot;</span>)
    parser.add_argument(<span class="hljs-string">&quot;--labels&quot;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Label CSV path (optional)&quot;</span>)
    parser.add_argument(<span class="hljs-string">&quot;--topk&quot;</span>, <span class="hljs-built_in">type</span>=<span class="hljs-built_in">int</span>, default=<span class="hljs-number">10</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Ground truth&quot;</span>)
    args = parser.parse_args()
    main(args.train, args.test, args.out, args.labels, args.topk)
<button class="copy-code-btn"></button></code></pre>
<p><strong>변환 프로세스 출력입니다:</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_conversion_process_output_0827ba75c9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>생성된 파일 확인:</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_f02cd2964e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Custom-Dataset-Configuration" class="common-anchor-header">사용자 지정 데이터 세트 구성</h3><p>웹 인터페이스에서 사용자 정의 데이터 세트 구성 섹션으로 이동합니다:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/5_aa14b75b5d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>구성 인터페이스는 데이터 세트 메타데이터 및 파일 경로 사양을 위한 필드를 제공합니다:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/6_1b64832990.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>구성 매개변수:</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>매개변수 이름</strong></th><th style="text-align:center"><strong>의미</strong></th><th style="text-align:center"><strong>구성 제안</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">이름</td><td style="text-align:center">데이터 세트 이름(고유 식별자)</td><td style="text-align:center">임의의 이름(예:, <code translate="no">my_custom_dataset</code></td></tr>
<tr><td style="text-align:center">폴더 경로</td><td style="text-align:center">데이터 세트 파일 디렉터리 경로</td><td style="text-align:center">예, <code translate="no">/data/datasets/custom</code></td></tr>
<tr><td style="text-align:center">dim</td><td style="text-align:center">벡터 차원</td><td style="text-align:center">데이터 파일과 일치해야 합니다(예: 768).</td></tr>
<tr><td style="text-align:center">크기</td><td style="text-align:center">벡터 개수(선택 사항)</td><td style="text-align:center">비워둘 수 있으며, 시스템이 자동 감지합니다.</td></tr>
<tr><td style="text-align:center">메트릭 유형</td><td style="text-align:center">유사도 측정 방법</td><td style="text-align:center">일반적으로 L2(유클리드 거리) 또는 IP(내적 곱)를 사용합니다.</td></tr>
<tr><td style="text-align:center">훈련 파일 이름</td><td style="text-align:center">훈련 세트 파일 이름(.parquet 확장자 제외)</td><td style="text-align:center"><code translate="no">train.parquet</code> 인 경우 <code translate="no">train</code> 을 입력합니다. 여러 파일은 쉼표로 구분합니다, <code translate="no">train1,train2</code></td></tr>
<tr><td style="text-align:center">테스트 파일 이름</td><td style="text-align:center">쿼리 세트 파일 이름(.parquet 확장자 제외)</td><td style="text-align:center"><code translate="no">test.parquet</code> 인 경우 <code translate="no">test</code></td></tr>
<tr><td style="text-align:center">기준 정보 파일 이름</td><td style="text-align:center">기준값 파일 이름(.parquet 확장자 제외)</td><td style="text-align:center"><code translate="no">neighbors.parquet</code> 인 경우 <code translate="no">neighbors</code></td></tr>
<tr><td style="text-align:center">훈련 ID 이름</td><td style="text-align:center">학습 데이터 ID 열 이름</td><td style="text-align:center">보통 <code translate="no">id</code></td></tr>
<tr><td style="text-align:center">훈련 엠브이엠 이름</td><td style="text-align:center">학습 데이터 벡터 열 이름</td><td style="text-align:center">스크립트 생성 열 이름이 <code translate="no">emb</code> 인 경우, 채우기 <code translate="no">emb</code></td></tr>
<tr><td style="text-align:center">테스트 엠브 이름</td><td style="text-align:center">테스트 데이터 벡터 열 이름</td><td style="text-align:center">일반적으로 훈련 엠브 이름과 동일합니다, <code translate="no">emb</code></td></tr>
<tr><td style="text-align:center">기준 실측 엠비 이름</td><td style="text-align:center">실측 기준의 가장 가까운 이웃 열 이름</td><td style="text-align:center">열 이름이 <code translate="no">neighbors_id</code> 인 경우 채우기 <code translate="no">neighbors_id</code></td></tr>
<tr><td style="text-align:center">스칼라 레이블 파일 이름</td><td style="text-align:center">(선택 사항) 레이블 파일 이름(.parquet 확장자 제외)</td><td style="text-align:center"><code translate="no">scalar_labels.parquet</code> 이 생성된 경우 <code translate="no">scalar_labels</code> 을 채우고, 그렇지 않으면 비워둡니다.</td></tr>
<tr><td style="text-align:center">레이블 백분율</td><td style="text-align:center">(선택 사항) 레이블 필터 비율</td><td style="text-align:center">예: <code translate="no">0.001</code>,<code translate="no">0.02</code>,<code translate="no">0.5</code>, 라벨 필터링이 필요하지 않은 경우 비워둡니다.</td></tr>
<tr><td style="text-align:center">설명</td><td style="text-align:center">데이터 세트 설명</td><td style="text-align:center">비즈니스 컨텍스트 또는 생성 방법을 기록할 수 없습니다.</td></tr>
</tbody>
</table>
<p>구성을 저장하여 테스트 설정을 진행합니다.</p>
<h3 id="Test-Execution-and-Database-Configuration" class="common-anchor-header">테스트 실행 및 데이터베이스 구성</h3><p>테스트 구성 인터페이스에 액세스합니다:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/7_3ecdcb1034.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>데이터베이스 선택 및 구성(Milvus를 예로 들어):</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/8_356a2d8c39.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>데이터 세트 할당:</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/9_dataset_assignment_85ba7b24ca.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>테스트 메타데이터 및 라벨링:</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/10_test_metadata_and_labeling_293f6f2b99.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>테스트 실행:</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/11_test_execution_76acb42c98.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Results-Analysis-and-Performance-Evaluation" class="common-anchor-header">결과 분석 및 성능 평가<button data-href="#Results-Analysis-and-Performance-Evaluation" class="anchor-icon" translate="no">
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
    </button></h2><p>결과 인터페이스는 포괄적인 성능 분석을 제공합니다:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/12_993c536c20.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Test-Configuration-Summary" class="common-anchor-header">테스트 구성 요약</h3><p>이 평가에서는 1, 5, 10개의 동시 작업 수준(사용 가능한 하드웨어 리소스에 의해 제한됨), 벡터 차원 768개, 데이터 세트 크기 3,000개의 학습 벡터 및 3,000개의 테스트 쿼리를 테스트했으며 이 테스트 실행에서는 스칼라 레이블 필터링을 비활성화했습니다.</p>
<h3 id="Critical-Implementation-Considerations" class="common-anchor-header">중요한 구현 고려 사항</h3><ul>
<li><p><strong>차원 일관성:</strong> 학습 데이터 세트와 테스트 데이터 세트 간에 벡터 차원이 일치하지 않으면 즉각적인 테스트 실패가 발생합니다. 런타임 오류를 방지하기 위해 데이터 준비 중에 차원 정렬을 확인합니다.</p></li>
<li><p><strong>기준 진실 정확도:</strong> 잘못된 기준 진실 계산은 리콜률 측정을 무효화합니다. 제공된 변환 스크립트는 정확한 최인접 이웃 계산을 위해 L2 거리와 함께 FAISS를 사용하여 정확한 기준 결과를 보장합니다.</p></li>
<li><p><strong>데이터 세트 규모 요구 사항:</strong> 작은 데이터 세트(10,000개 미만의 벡터)는 불충분한 부하 생성으로 인해 일관되지 않은 QPS 측정값을 생성할 수 있습니다. 보다 안정적인 처리량 테스트를 위해 데이터 세트 크기를 확장하는 것을 고려하세요.</p></li>
<li><p><strong>리소스 할당:</strong> Docker 컨테이너 메모리 및 CPU 제약으로 인해 테스트 중에 데이터베이스 성능이 인위적으로 제한될 수 있습니다. 정확한 성능 측정을 위해 리소스 사용률을 모니터링하고 필요에 따라 컨테이너 제한을 조정하세요.</p></li>
<li><p><strong>오류 모니터링:</strong> <strong>VDBBench는</strong> 웹 인터페이스에 나타나지 않는 오류를 콘솔 출력에 기록할 수 있습니다. 테스트 실행 중 터미널 로그를 모니터링하여 완전한 진단 정보를 확인하세요.</p></li>
</ul>
<h2 id="Supplemental-Tools-Test-Data-Generation" class="common-anchor-header">보조 도구: 테스트 데이터 생성<button data-href="#Supplemental-Tools-Test-Data-Generation" class="anchor-icon" translate="no">
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
    </button></h2><p>개발 및 표준화된 테스트 시나리오의 경우 제어된 특성을 가진 합성 데이터 세트를 생성할 수 있습니다:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> pandas <span class="hljs-keyword">as</span> pd
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">def</span> <span class="hljs-title function_">generate_csv</span>(<span class="hljs-params">num_records: <span class="hljs-built_in">int</span>, dim: <span class="hljs-built_in">int</span>, filename: <span class="hljs-built_in">str</span></span>):
    ids = <span class="hljs-built_in">range</span>(num_records)
    vectors = np.random.rand(num_records, dim).<span class="hljs-built_in">round</span>(<span class="hljs-number">6</span>) 
    emb_str = [<span class="hljs-built_in">str</span>(<span class="hljs-built_in">list</span>(vec)) <span class="hljs-keyword">for</span> vec <span class="hljs-keyword">in</span> vectors]
    df = pd.DataFrame({
        <span class="hljs-string">&#x27;id&#x27;</span>: ids,
        <span class="hljs-string">&#x27;emb&#x27;</span>: emb_str
    })
    df.to_csv(filename, index=<span class="hljs-literal">False</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Generated file <span class="hljs-subst">{filename}</span>, <span class="hljs-subst">{num_records}</span> records total, vector dimension <span class="hljs-subst">{dim}</span>&quot;</span>)
<span class="hljs-keyword">if</span>
name
 == <span class="hljs-string">&quot;__main__&quot;</span>:
    num_records = <span class="hljs-number">3000</span>  <span class="hljs-comment"># Number of records to generate</span>
    dim = <span class="hljs-number">768</span>  <span class="hljs-comment"># Vector dimension</span>

    generate_csv(num_records, dim, <span class="hljs-string">&quot;train.csv&quot;</span>)
    generate_csv(num_records, dim, <span class="hljs-string">&quot;test.csv&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>이 유틸리티는 프로토타이핑 및 기준 테스트 시나리오를 위해 지정된 크기와 레코드 수를 가진 데이터 세트를 생성합니다.</p>
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
    </button></h2><p>지금까지 수많은 벡터 데이터베이스 결정을 잘못 이끌어온 '벤치마크 극장'에서 벗어나는 방법을 배웠습니다. VDBBench와 자체 데이터 세트를 사용하면 수십 년 된 학술 데이터에서 더 이상 추측할 필요 없이 프로덕션 수준의 QPS, 지연 시간 및 리콜 메트릭을 생성할 수 있습니다.</p>
<p>실제 워크로드와 무관한 정형화된 벤치마크에 더 이상 의존하지 마세요. 몇 주가 아니라 단 몇 시간 만에 벡터, 쿼리, 제약 조건에 따라 데이터베이스의 성능을 정확하게 <em>파악할</em> 수 있습니다. 따라서 자신 있게 결정을 내리고, 나중에 다시 작성하는 번거로움을 피하고, 실제 프로덕션 환경에서 작동하는 시스템을 출시할 수 있습니다.</p>
<ul>
<li><p>워크로드에 VDBBench를 사용해 <a href="https://github.com/zilliztech/VectorDBBench">보세요: https://github.com/zilliztech/VectorDBBench</a></p></li>
<li><p>주요 벡터 데이터베이스의 테스트 결과를 확인하세요: <a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch&amp;__hstc=175614333.dc4bcf53f6c7d650ea8978dcdb9e7009.1727350436713.1755165753372.1755169827021.775&amp;__hssc=175614333.3.1755169827021&amp;__hsfp=1940526538">VDBBench 리더보드</a></p></li>
</ul>
<p>질문이 있거나 결과를 공유하고 싶으신가요?<a href="https://github.com/zilliztech/VectorDBBench"> GitHub에서</a> 대화에 참여하거나 <a href="https://discord.com/invite/FG6hMJStWu">Discord에서</a> 커뮤니티와 소통하세요.</p>
<hr>
<p><em>이 포스팅은 실제 환경에서 성능을 발휘하는 AI 인프라를 구축하기 위해 개발자가 직접 테스트한 방법을 소개하는 VectorDB POC 가이드 시리즈의 첫 번째 포스팅입니다. 앞으로도 계속 기대해 주세요!</em></p>
