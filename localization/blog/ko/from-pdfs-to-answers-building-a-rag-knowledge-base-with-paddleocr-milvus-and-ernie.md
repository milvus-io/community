---
id: >-
  from-pdfs-to-answers-building-a-rag-knowledge-base-with-paddleocr-milvus-and-ernie.md
title: 'PDF에서 답변으로: PaddleOCR, Milvus 및 ERNIE로 RAG 지식 기반 구축하기'
author: LiaoYF and Jing Zhang
date: 2026-3-17
cover: assets.zilliz.com/cover_747a1385ed.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'RAG, Milvus, vector database, hybrid search, knowledge base Q&A'
meta_title: |
  Build a RAG Knowledge Base with PaddleOCR, Milvus, and ERNIE
desc: >-
  문서 인텔리전스를 위한 Milvus, 하이브리드 검색, 재랭크, 멀티모달 Q&amp;A를 사용하여 정확도가 높은 RAG 지식창고를 구축하는
  방법을 알아보세요.
origin: >-
  https://milvus.io/blog/from-pdfs-to-answers-building-a-rag-knowledge-base-with-paddleocr-milvus-and-ernie.md
---
<p>대규모 언어 모델은 2023년보다 훨씬 성능이 향상되었지만, 여전히 자신감이 부족하고 오래된 정보에 의존하는 경우가 많습니다. RAG(검색 증강 생성)는 모델이 응답을 생성하기 전에 <a href="https://milvus.io/">Milvus와</a> 같은 벡터 데이터베이스에서 관련 컨텍스트를 검색하여 두 가지 문제를 모두 해결합니다. 이러한 추가 컨텍스트는 실제 출처에 근거하여 답변을 보다 최신의 것으로 만듭니다.</p>
<p>가장 일반적인 RAG 사용 사례 중 하나는 회사 지식 기반입니다. 사용자가 PDF, Word 파일 또는 기타 내부 문서를 업로드하고 자연어 질문을 하면 모델의 사전 학습이 아닌 해당 자료에 기반한 답변을 받을 수 있습니다.</p>
<p>하지만 동일한 LLM과 동일한 벡터 데이터베이스를 사용한다고 해서 동일한 결과가 보장되는 것은 아닙니다. 두 팀이 동일한 기반 위에 구축해도 시스템 품질은 매우 다를 수 있습니다. 이러한 차이는 보통 <strong>문서를 파싱, 청크 및 임베드하는 방법, 데이터를 색인하는 방법, 검색 결과의 순위를 매기는 방법, 최종 답변을 조합하는 방법</strong> 등 모든 업스트림에서 비롯됩니다 <strong>.</strong></p>
<p>이 문서에서는 <a href="https://github.com/LiaoYFBH/Paddle-ERNIE-RAG/blob/main/README_EN.md">Paddle-ERNIE-RAG를</a> 예로 들어 <a href="https://github.com/PADDLEPADDLE/PADDLEOCR">PaddleOCR</a>, <a href="https://milvus.io/">Milvus</a> 및 ERNIE-4.5-Turbo를 사용하여 RAG 기반 지식창고를 구축하는 방법을 설명합니다.</p>
<h2 id="Paddle-ERNIE-RAG-System-Architecture" class="common-anchor-header">Paddle-ERNIE-RAG 시스템 아키텍처<button data-href="#Paddle-ERNIE-RAG-System-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>Paddle-ERNIE-RAG 아키텍처는 네 가지 핵심 레이어로 구성되어 있습니다:</p>
<ul>
<li><strong>데이터 추출 레이어.</strong> PaddleOCR의 문서 구문 분석 파이프라인인 <a href="https://github.com/PaddlePaddle/PaddleOCR">PP-StructureV3는</a> 레이아웃 인식 OCR로 PDF와 이미지를 판독합니다. 제목, 표, 읽기 순서 등 문서 구조를 보존하고 겹치는 청크로 분할된 깨끗한 마크다운을 출력합니다.</li>
<li><strong>벡터 저장 레이어.</strong> 각 청크는 384차원 벡터에 내장되어 메타데이터(파일 이름, 페이지 번호, 청크 ID)와 함께 <a href="https://milvus.io"></a><a href="https://milvus.io">Milvus에</a> 저장됩니다. 병렬 반전 인덱스는 키워드 검색을 지원합니다.</li>
<li><strong>검색 및 답변 레이어.</strong> 각 쿼리는 벡터 인덱스와 키워드 인덱스 모두에 대해 실행됩니다. 결과는 RRF(상호 순위 융합)를 통해 병합되고 순위가 재조정된 후 답변 생성을 위해 <a href="https://github.com/LiaoYFBH/Paddle-ERNIE-RAG">ERNIE</a> 모델로 전달됩니다.</li>
<li><strong>애플리케이션 계층.</strong> <a href="https://www.gradio.app/"></a><a href="https://www.gradio.app/"> Gradio</a> 인터페이스를 통해 문서를 업로드하고, 질문하고, 출처 인용 및 신뢰도 점수와 함께 답변을 볼 수 있습니다.  <span class="img-wrapper">
    <img translate="no" src="blob:https://septemberfd.github.io/9043a059-de46-49b1-9399-f915aed555dc" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ul>
<p>아래 섹션에서는 원시 문서가 검색 가능한 텍스트가 되는 방법부터 시작하여 각 단계를 순서대로 안내합니다.</p>
<h2 id="How-to-Build-RAG-Pipeline-Step-by-Step" class="common-anchor-header">RAG 파이프라인을 단계별로 구축하는 방법<button data-href="#How-to-Build-RAG-Pipeline-Step-by-Step" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Step-1-Parse-Documents-with-PP-StructureV3" class="common-anchor-header">1단계: PP-StructureV3로 문서 구문 분석하기</h3><p>원시 문서는 대부분의 정확도 문제가 시작되는 곳입니다. 연구 논문과 기술 보고서는 2열 레이아웃, 수식, 표, 이미지가 혼합되어 있습니다. PyPDF2와 같은 기본 라이브러리로 텍스트를 추출하면 단락이 순서대로 나타나지 않고, 표가 축소되고, 수식이 사라지는 등 일반적으로 출력이 엉망이 됩니다.</p>
<p>이러한 문제를 방지하기 위해 프로젝트는 backend.py에 OnlinePDFParser 클래스를 생성합니다. 이 클래스는 PP-StructureV3 온라인 API를 호출하여 레이아웃 구문 분석을 수행합니다. 원시 텍스트를 추출하는 대신 문서의 구조를 식별한 다음 이를 마크다운 형식으로 변환합니다.</p>
<p>이 방법에는 세 가지 분명한 이점이 있습니다:</p>
<ul>
<li><strong>깔끔한 마크다운 출력</strong></li>
</ul>
<p>출력은 적절한 제목과 단락이 포함된 마크다운 형식으로 형식이 지정됩니다. 따라서 모델이 콘텐츠를 더 쉽게 이해할 수 있습니다.</p>
<ul>
<li><strong>별도의 이미지 추출</strong></li>
</ul>
<p>시스템은 구문 분석 중에 이미지를 추출하여 저장합니다. 이렇게 하면 중요한 시각적 정보가 손실되는 것을 방지할 수 있습니다.</p>
<ul>
<li><strong>더 나은 컨텍스트 처리</strong></li>
</ul>
<p>텍스트는 겹치는 슬라이딩 창을 사용하여 분할됩니다. 이렇게 하면 중간에 문장이나 수식이 잘리는 것을 방지하여 의미를 명확하게 유지하고 검색 정확도를 향상시킬 수 있습니다.</p>
<p><strong>기본 구문 분석 흐름</strong></p>
<p>backend.py에서 구문 분석은 간단한 세 단계를 따릅니다:</p>
<ol>
<li>PDF 파일을 PP-StructureV3 API로 전송합니다.</li>
<li>반환된 layoutParsingResults를 읽습니다.</li>
<li>정리된 마크다운 텍스트와 이미지를 추출합니다.</li>
</ol>
<pre><code translate="no"><span class="hljs-comment"># backend.py (Core logic summary of the OnlinePDFParser class)</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">predict</span>(<span class="hljs-params">self, file_path</span>):
    <span class="hljs-comment"># 1. Convert file to Base64</span>
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;rb&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_data = base64.b64encode(file.read()).decode(<span class="hljs-string">&quot;ascii&quot;</span>)
    <span class="hljs-comment"># 2. Build request payload</span>
    payload = {
        <span class="hljs-string">&quot;file&quot;</span>: file_data,
        <span class="hljs-string">&quot;fileType&quot;</span>: <span class="hljs-number">1</span>, <span class="hljs-comment"># PDF type</span>
        <span class="hljs-string">&quot;useChartRecognition&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-comment"># Configure based on requirements</span>
        <span class="hljs-string">&quot;useDocOrientationClassify&quot;</span>: <span class="hljs-literal">False</span>
    }
    <span class="hljs-comment"># 3. Send request to get Layout Parsing results</span>
    response = requests.post(<span class="hljs-variable language_">self</span>.api_url, json=payload, headers=headers)
    res_json = response.json()
    <span class="hljs-comment"># 4. Extract Markdown text and images</span>
    parsing_results = res_json.get(<span class="hljs-string">&quot;result&quot;</span>, {}).get(<span class="hljs-string">&quot;layoutParsingResults&quot;</span>, [])
    mock_outputs = []
    <span class="hljs-keyword">for</span> item <span class="hljs-keyword">in</span> parsing_results:
        md_text = item.get(<span class="hljs-string">&quot;markdown&quot;</span>, {}).get(<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
        images = item.get(<span class="hljs-string">&quot;markdown&quot;</span>, {}).get(<span class="hljs-string">&quot;images&quot;</span>, {})
        <span class="hljs-comment"># ... (subsequent image downloading and text cleaning logic)</span>
        mock_outputs.append(MockResult(md_text, images))
    <span class="hljs-keyword">return</span> mock_outputs, <span class="hljs-string">&quot;Success&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Chunk-Text-with-Sliding-Window-Overlap" class="common-anchor-header">2단계: 슬라이딩 창이 겹치는 청크 텍스트 처리</h3><p>구문 분석 후에는 검색을 위해 마크다운 텍스트를 작은 조각(청크)으로 나눠야 합니다. 텍스트를 고정된 길이로 자르면 문장이나 수식이 반으로 나뉠 수 있습니다.</p>
<p>이를 방지하기 위해 시스템에서는 겹치는 슬라이딩 창 청크를 사용합니다. 각 청크는 다음 청크와 꼬리 부분을 공유하므로 경계 콘텐츠가 두 창에 모두 표시됩니다. 이렇게 하면 청크 가장자리에서 의미가 그대로 유지되고 검색 리콜이 향상됩니다.</p>
<pre><code translate="no"><span class="hljs-comment"># backend.py</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">split_text_into_chunks</span>(<span class="hljs-params">text: <span class="hljs-built_in">str</span>, chunk_size: <span class="hljs-built_in">int</span> = <span class="hljs-number">300</span>, overlap: <span class="hljs-built_in">int</span> = <span class="hljs-number">120</span></span>) -&gt; <span class="hljs-built_in">list</span>:
    <span class="hljs-string">&quot;&quot;&quot;Sliding window-based text chunking that preserves overlap-length contextual overlap&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> text: <span class="hljs-keyword">return</span> []
    lines = [line.strip() <span class="hljs-keyword">for</span> line <span class="hljs-keyword">in</span> text.split(<span class="hljs-string">&quot;\n&quot;</span>) <span class="hljs-keyword">if</span> line.strip()]
    chunks = []
    current_chunk = []
    current_length = <span class="hljs-number">0</span>
    <span class="hljs-keyword">for</span> line <span class="hljs-keyword">in</span> lines:
        <span class="hljs-keyword">while</span> <span class="hljs-built_in">len</span>(line) &gt; chunk_size:
            <span class="hljs-comment"># Handle overly long single line</span>
            part = line[:chunk_size]
            line = line[chunk_size:]
            current_chunk.append(part)
            <span class="hljs-comment"># ... (chunking logic) ...</span>
        current_chunk.append(line)
        current_length += <span class="hljs-built_in">len</span>(line)
        <span class="hljs-comment"># When accumulated length exceeds the threshold, generate a chunk</span>
        <span class="hljs-keyword">if</span> current_length &gt; chunk_size:
            chunks.append(<span class="hljs-string">&quot;\n&quot;</span>.join(current_chunk))
            <span class="hljs-comment"># Roll back: keep the last overlap-length text as the start of the next chunk</span>
            overlap_text = current_chunk[-<span class="hljs-number">1</span>][-overlap:] <span class="hljs-keyword">if</span> current_chunk <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;&quot;</span>
            current_chunk = [overlap_text] <span class="hljs-keyword">if</span> overlap_text <span class="hljs-keyword">else</span> []
            current_length = <span class="hljs-built_in">len</span>(overlap_text)
    <span class="hljs-keyword">if</span> current_chunk:
        chunks.append(<span class="hljs-string">&quot;\n&quot;</span>.join(current_chunk).strip())
    <span class="hljs-keyword">return</span> chunks
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Store-Vectors-and-Metadata-in-Milvus" class="common-anchor-header">3단계: Milvus에 벡터 및 메타데이터 저장하기</h3><p>깔끔한 청크가 준비되었으면 다음 단계는 빠르고 정확한 검색을 지원하는 방식으로 저장하는 것입니다.</p>
<p><strong>벡터 저장 및 메타데이터</strong></p>
<p>Milvus는 컬렉션 이름에 대해 ASCII 문자, 숫자 및 밑줄만 사용하도록 엄격한 규칙을 적용합니다. 지식창고 이름에 ASCII가 아닌 문자가 포함된 경우 백엔드에서는 컬렉션을 만들기 전에 이를 kb_ 접두사로 헥스 인코딩하여 표시할 수 있도록 디코딩합니다. 사소한 세부 사항이지만 암호화 오류를 방지하는 방법입니다.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> binascii
<span class="hljs-keyword">import</span> re

<span class="hljs-keyword">def</span> <span class="hljs-title function_">encode_name</span>(<span class="hljs-params">ui_name</span>):
    <span class="hljs-string">&quot;&quot;&quot;Convert a foreign name into a Milvus-valid hexadecimal string&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> ui_name: <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;&quot;</span>
    <span class="hljs-comment"># If it only contains English letters, numbers, or underscores, return it directly</span>
    <span class="hljs-keyword">if</span> re.<span class="hljs-keyword">match</span>(<span class="hljs-string">r&#x27;^[a-zA-Z_][a-zA-Z0-9_]*$&#x27;</span>, ui_name):
        <span class="hljs-keyword">return</span> ui_name
    <span class="hljs-comment"># Encode to Hex and add the kb_ prefix</span>
    hex_str = binascii.hexlify(ui_name.encode(<span class="hljs-string">&#x27;utf-8&#x27;</span>)).decode(<span class="hljs-string">&#x27;utf-8&#x27;</span>)
    <span class="hljs-keyword">return</span> <span class="hljs-string">f&quot;kb_<span class="hljs-subst">{hex_str}</span>&quot;</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">decode_name</span>(<span class="hljs-params">real_name</span>):
    <span class="hljs-string">&quot;&quot;&quot;Convert a hexadecimal string back to original language&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> real_name.startswith(<span class="hljs-string">&quot;kb_&quot;</span>):
        <span class="hljs-keyword">try</span>:
            hex_str = real_name[<span class="hljs-number">3</span>:]
            <span class="hljs-keyword">return</span> binascii.unhexlify(hex_str).decode(<span class="hljs-string">&#x27;utf-8&#x27;</span>)
        <span class="hljs-keyword">except</span>:
            <span class="hljs-keyword">return</span> real_name
    <span class="hljs-keyword">return</span> real_name
<button class="copy-code-btn"></button></code></pre>
<p>이름 지정 외에도 각 청크는 삽입 전에 임베딩 생성 및 메타데이터 첨부라는 두 단계를 거칩니다.</p>
<ul>
<li><strong>저장되는 내용:</strong></li>
</ul>
<p>각 청크는 384차원의 고밀도 벡터로 변환됩니다. 동시에 Milvus 스키마는 파일 이름, 페이지 번호, 청크 ID와 같은 추가 필드를 저장합니다.</p>
<ul>
<li><strong>이것이 중요한 이유:</strong></li>
</ul>
<p>이렇게 하면 답변의 정확한 페이지로 답변을 추적할 수 있습니다. 또한 향후 멀티모달 Q&amp;A 사용 사례에 대비하여 시스템을 준비할 수 있습니다.</p>
<ul>
<li><strong>성능 최적화:</strong></li>
</ul>
<p>vector_store.py에서 insert_documents 메서드는 일괄 임베딩을 사용합니다. 이렇게 하면 네트워크 요청 횟수가 줄어들고 프로세스가 더 효율적입니다.</p>
<pre><code translate="no"><span class="hljs-comment"># vector_store.py</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">insert_documents</span>(<span class="hljs-params">self, documents</span>):
    <span class="hljs-string">&quot;&quot;&quot;Batch vectorization and insertion into Milvus&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> documents: <span class="hljs-keyword">return</span>
    <span class="hljs-comment"># 1. Extract plain text list and request the embedding model in batch</span>
    texts = [doc[<span class="hljs-string">&#x27;content&#x27;</span>] <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> documents]
    embeddings = <span class="hljs-variable language_">self</span>.get_embeddings(texts)
    <span class="hljs-comment"># 2. Data cleaning: filter out invalid data where embedding failed</span>
    valid_docs, valid_vectors = [], []
    <span class="hljs-keyword">for</span> i, emb <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(embeddings):
        <span class="hljs-keyword">if</span> emb <span class="hljs-keyword">and</span> <span class="hljs-built_in">len</span>(emb) == <span class="hljs-number">384</span>: <span class="hljs-comment"># Ensure the vector dimension is correct</span>
            valid_docs.append(documents[i])
            valid_vectors.append(emb)
    <span class="hljs-comment"># 3. Assemble columnar data (Columnar Format)</span>
    <span class="hljs-comment"># Milvus insert API requires each field to be passed in list format</span>
    data = [
        [doc[<span class="hljs-string">&#x27;filename&#x27;</span>] <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> valid_docs],  <span class="hljs-comment"># Scalar: file name</span>
        [doc[<span class="hljs-string">&#x27;page&#x27;</span>] <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> valid_docs],      <span class="hljs-comment"># Scalar: page number (for traceability)</span>
        [doc[<span class="hljs-string">&#x27;chunk_id&#x27;</span>] <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> valid_docs],  <span class="hljs-comment"># Scalar: chunk ID</span>
        [doc[<span class="hljs-string">&#x27;content&#x27;</span>] <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> valid_docs],   <span class="hljs-comment"># Scalar: original content (for keyword search)</span>
        valid_vectors                             <span class="hljs-comment"># Vector: semantic vector</span>
    ]
    <span class="hljs-comment"># 4. Execute insertion and persistence</span>
    <span class="hljs-variable language_">self</span>.collection.insert(data)
    <span class="hljs-variable language_">self</span>.collection.flush()
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Retrieve-with-Hybrid-Search-and-RRF-Fusion" class="common-anchor-header">4단계: 하이브리드 검색과 RRF 퓨전을 사용한 검색</h3><p>단일 검색 방법만으로는 충분하지 않은 경우가 많습니다. 벡터 검색은 의미론적으로 유사한 콘텐츠를 찾지만 정확한 용어를 놓칠 수 있고, 키워드 검색은 특정 용어를 찾아내지만 의역어를 놓칠 수 있습니다. 두 가지를 병렬로 실행하고 결과를 병합하면 단독으로 실행하는 것보다 더 나은 결과를 얻을 수 있습니다.</p>
<p>쿼리 언어가 문서 언어와 다른 경우, 시스템은 먼저 LLM을 사용해 쿼리를 번역하여 두 검색 경로가 모두 문서 언어로 작동할 수 있도록 합니다. 그런 다음 두 검색이 병렬로 실행됩니다:</p>
<ul>
<li><strong>벡터 검색(밀도):</strong> 언어에 관계없이 비슷한 의미를 가진 콘텐츠를 찾지만 질문에 직접적으로 답하지 않는 관련 구절을 표시할 수 있습니다.</li>
<li><strong>키워드 검색(스파스):</strong> 기술 용어, 숫자 또는 수식 변수와 정확히 일치하는 것을 찾습니다(벡터 임베딩이 종종 부드럽게 처리하는 토큰의 종류).</li>
</ul>
<p>시스템은 RRF(상호 순위 융합)를 사용하여 두 결과 목록을 병합합니다. 각 후보는 각 목록에서 순위에 따라 점수를 받으므로, <em>두</em> 목록의 맨 위에 나타나는 청크가 가장 높은 점수를 받습니다. 벡터 검색은 시맨틱 커버리지에 기여하고 키워드 검색은 용어 정확도에 기여합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_From_PD_Fsto_Answers_Buildinga_RAG_Knowledge_Bas_1_d241e95fc2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<pre><code translate="no"><span class="hljs-comment"># Summary of retrieval logic in vector_store.py</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">search</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">10</span>, **kwargs</span>):
    <span class="hljs-string">&#x27;&#x27;&#x27;Vector search (Dense + Keyword) + RRF fusion&#x27;&#x27;&#x27;</span>
    <span class="hljs-comment"># 1. Vector search (Dense)</span>
    dense_results = []
    query_vector = <span class="hljs-variable language_">self</span>.embedding_client.get_embedding(query)  <span class="hljs-comment"># ... (Milvus search code) ...</span>
    <span class="hljs-comment"># 2. Keyword search</span>
    <span class="hljs-comment"># Perform jieba tokenization and build like &quot;%keyword%&quot; queries</span>
    keyword_results = <span class="hljs-variable language_">self</span>._keyword_search(query, top_k=top_k * <span class="hljs-number">5</span>, expr=expr)
    <span class="hljs-comment"># 3. RRF fusion</span>
    rank_dict = {}
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">apply_rrf</span>(<span class="hljs-params">results_list, k=<span class="hljs-number">60</span>, weight=<span class="hljs-number">1.0</span></span>):
        <span class="hljs-keyword">for</span> rank, item <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results_list):
            doc_id = item.get(<span class="hljs-string">&#x27;id&#x27;</span>) <span class="hljs-keyword">or</span> item.get(<span class="hljs-string">&#x27;chunk_id&#x27;</span>)
            <span class="hljs-keyword">if</span> doc_id <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> rank_dict:
                rank_dict[doc_id] = {<span class="hljs-string">&quot;data&quot;</span>: item, <span class="hljs-string">&quot;score&quot;</span>: <span class="hljs-number">0.0</span>}
            <span class="hljs-comment"># Core RRF formula</span>
            rank_dict[doc_id][<span class="hljs-string">&quot;score&quot;</span>] += weight * (<span class="hljs-number">1.0</span> / (k + rank))
    apply_rrf(dense_results, weight=<span class="hljs-number">4.0</span>)
    apply_rrf(keyword_results, weight=<span class="hljs-number">1.0</span>)
    <span class="hljs-comment"># 4. Sort and return results</span>
    sorted_docs = <span class="hljs-built_in">sorted</span>(rank_dict.values(), key=<span class="hljs-keyword">lambda</span> x: x[<span class="hljs-string">&#x27;score&#x27;</span>], reverse=<span class="hljs-literal">True</span>)
    <span class="hljs-keyword">return</span> [item[<span class="hljs-string">&#x27;data&#x27;</span>] <span class="hljs-keyword">for</span> item <span class="hljs-keyword">in</span> sorted_docs[:top_k * <span class="hljs-number">2</span>]]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-5-Rerank-Results-Before-Answer-Generation" class="common-anchor-header">5단계: 답변 생성 전에 결과 순위 재조정하기</h3><p>검색 단계에서 반환된 청크는 연관성이 동일하지 않습니다. 따라서 최종 답변을 생성하기 전에 재랭크 단계를 통해 점수를 재조정합니다.</p>
<p>reranker_v2.py에서는 5가지 측면에서 점수를 매기는 결합 채점 방법으로 각 청크를 평가합니다:</p>
<ul>
<li><strong>퍼지 매칭</strong></li>
</ul>
<p>퍼지 매칭을 사용하여 청크의 문구가 쿼리와 얼마나 유사한지 확인합니다. 이는 직접적인 텍스트 중복을 측정합니다.</p>
<ul>
<li><strong>키워드 범위</strong></li>
</ul>
<p>쿼리에서 중요한 단어가 청크에 얼마나 많이 나타나는지 확인합니다. 키워드가 많이 일치할수록 점수가 높아집니다.</p>
<ul>
<li><strong>의미적 유사성</strong></li>
</ul>
<p>Milvus가 반환한 벡터 유사도 점수를 재사용합니다. 이는 의미가 얼마나 가까운지를 반영합니다.</p>
<ul>
<li><strong>길이 및 원래 순위</strong></li>
</ul>
<p>매우 짧은 청크는 종종 문맥이 부족하기 때문에 감점을 받습니다. 원래 Milvus 결과에서 더 높은 순위를 차지한 청크는 약간의 보너스를 받습니다.</p>
<ul>
<li><strong>명명된 엔티티 감지</strong></li>
</ul>
<p>시스템은 "Milvus" 또는 "RAG"와 같이 대문자로 표기된 용어를 고유 명사 가능성이 있는 것으로 감지하고, 여러 단어로 구성된 기술 용어를 가능한 핵심 문구로 식별합니다.</p>
<p>각 요소에는 최종 점수에 가중치가 있습니다(아래 그림 참조).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_From_PD_Fsto_Answers_Buildinga_RAG_Knowledge_Bas_2_2bce5d382a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>학습 데이터가 필요하지 않으며 각 요소의 기여도를 확인할 수 있습니다. 청크의 순위가 예기치 않게 높거나 낮은 경우 점수에 그 이유가 설명되어 있습니다. 완전한 블랙박스 리랭커는 이러한 기능을 제공하지 않습니다.</p>
<pre><code translate="no"><span class="hljs-comment"># reranker_v2.py</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">_calculate_composite_score</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, chunk: <span class="hljs-type">Dict</span>[<span class="hljs-built_in">str</span>, <span class="hljs-type">Any</span>]</span>) -&gt; <span class="hljs-built_in">float</span>:
    content = chunk.get(<span class="hljs-string">&#x27;content&#x27;</span>, <span class="hljs-string">&#x27;&#x27;</span>)
    <span class="hljs-comment"># 1. Surface text similarity (FuzzyWuzzy)</span>
    fuzzy_score = fuzz.partial_ratio(query, content)
    <span class="hljs-comment"># 2. Keyword coverage</span>
    query_keywords = <span class="hljs-variable language_">self</span>._extract_keywords(query)
    content_keywords = <span class="hljs-variable language_">self</span>._extract_keywords(content)
    keyword_coverage = (<span class="hljs-built_in">len</span>(query_keywords &amp; content_keywords) / <span class="hljs-built_in">len</span>(query_keywords)) * <span class="hljs-number">100</span> <span class="hljs-keyword">if</span> query_keywords <span class="hljs-keyword">else</span> <span class="hljs-number">0</span>
    <span class="hljs-comment"># 3. Vector semantic score (normalized)</span>
    milvus_distance = chunk.get(<span class="hljs-string">&#x27;semantic_score&#x27;</span>, <span class="hljs-number">0</span>)
    milvus_similarity = <span class="hljs-number">100</span> / (<span class="hljs-number">1</span> + milvus_distance * <span class="hljs-number">0.1</span>)
    <span class="hljs-comment"># 4. Length penalty (prefer paragraphs between 200–600 characters)</span>
    content_len = <span class="hljs-built_in">len</span>(content)
    <span class="hljs-keyword">if</span> <span class="hljs-number">200</span> &lt;= content_len &lt;= <span class="hljs-number">600</span>:
        length_score = <span class="hljs-number">100</span>
    <span class="hljs-keyword">else</span>:
        <span class="hljs-comment"># ... (penalty logic)</span>
        length_score = <span class="hljs-number">100</span> - <span class="hljs-built_in">min</span>(<span class="hljs-number">50</span>, <span class="hljs-built_in">abs</span>(content_len - <span class="hljs-number">400</span>) / <span class="hljs-number">20</span>)
    <span class="hljs-comment"># Weighted sum</span>
    base_score = (
        fuzzy_score * <span class="hljs-number">0.25</span> +
        keyword_coverage * <span class="hljs-number">0.25</span> +
        milvus_similarity * <span class="hljs-number">0.35</span> +
        length_score * <span class="hljs-number">0.15</span>
    )
    <span class="hljs-comment"># Position weight</span>
    position_bonus = <span class="hljs-number">0</span>
    <span class="hljs-keyword">if</span> <span class="hljs-string">&#x27;milvus_rank&#x27;</span> <span class="hljs-keyword">in</span> chunk:
        rank = chunk[<span class="hljs-string">&#x27;milvus_rank&#x27;</span>]
        position_bonus = <span class="hljs-built_in">max</span>(<span class="hljs-number">0</span>, <span class="hljs-number">20</span> - rank)
    <span class="hljs-comment"># Extra bonus for proper noun detection</span>
    proper_noun_bonus = <span class="hljs-number">30</span> <span class="hljs-keyword">if</span> <span class="hljs-variable language_">self</span>._check_proper_nouns(query, content) <span class="hljs-keyword">else</span> <span class="hljs-number">0</span>
    <span class="hljs-keyword">return</span> base_score + proper_noun_bonus
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-6-Add-Multimodal-QA-for-Charts-and-Diagrams" class="common-anchor-header">6단계: 차트 및 다이어그램에 대한 멀티모달 Q&amp;A 추가하기</h3><p>연구 논문에는 텍스트에 없는 정보를 담고 있는 중요한 차트와 도표가 포함되어 있는 경우가 많습니다. 텍스트 전용 RAG 파이프라인은 이러한 신호를 완전히 놓칠 수 있습니다.  이를 처리하기 위해 세 부분으로 구성된 간단한 이미지 기반 Q&amp;A 기능을 추가했습니다:</p>
<p><strong>1. 프롬프트에 더 많은 컨텍스트 추가</strong></p>
<p>모델에 이미지를 전송할 때 시스템은 동일한 페이지에서 OCR 텍스트도 가져옵니다.<br>
프롬프트에는 이미지, 페이지 텍스트, 사용자의 질문이 포함됩니다.<br>
이렇게 하면 모델이 전체 맥락을 이해하는 데 도움이 되고 이미지를 읽을 때 실수를 줄일 수 있습니다.</p>
<pre><code translate="no"><span class="hljs-comment"># backend.py - Core logic for multimodal Q&amp;A</span>
<span class="hljs-comment"># 1. Retrieve OCR text from the current page as background context</span>
<span class="hljs-comment"># The system pulls the full page text where the image appears from Milvus,</span>
<span class="hljs-comment"># based on the document name and page number.</span>
<span class="hljs-comment"># page_num is parsed from the image file name sent by the frontend (e.g., &quot;p3_figure.jpg&quot; -&gt; Page 3)</span>
page_text_context = milvus_store.get_page_content(doc_name, page_num)[:<span class="hljs-number">800</span>]
<span class="hljs-comment"># 2. Dynamically build a context-enhanced prompt</span>
<span class="hljs-comment"># Key idea: explicitly align visual information with textual background</span>
<span class="hljs-comment"># to prevent hallucinations caused by answering from the image alone</span>
final_prompt = <span class="hljs-string">f&quot;&quot;&quot;
[Task] Answer the question using both the image and the background information.
[Image Metadata] Source: <span class="hljs-subst">{doc_name}</span> (P<span class="hljs-subst">{page_num}</span>)
[Background Text] <span class="hljs-subst">{page_text_context}</span> ... (long text omitted here)
[User Question] <span class="hljs-subst">{user_question}</span>
&quot;&quot;&quot;</span>
<span class="hljs-comment"># 3. Send multimodal request (Vision API)</span>
<span class="hljs-comment"># The underlying layer converts the image to Base64 and sends it</span>
<span class="hljs-comment"># together with final_prompt to the ERNIE-VL model</span>
answer = ernie_client.chat_with_image(query=final_prompt, image_path=img_path)
<button class="copy-code-btn"></button></code></pre>
<p><strong>2. 비전 API 지원</strong></p>
<p>클라이언트(ernie_client.py)는 OpenAI 비전 형식을 지원합니다. 이미지가 Base64로 변환되어 이미지와 텍스트를 함께 처리할 수 있는 image_url 형식으로 전송됩니다.</p>
<pre><code translate="no"><span class="hljs-comment"># ernie_client.py</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">chat_with_image</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, image_path: <span class="hljs-built_in">str</span></span>):
   base64_image = <span class="hljs-variable language_">self</span>._encode_image(image_path)
   <span class="hljs-comment"># Build Vision message format</span>
   messages = [
      {
            <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>,
            <span class="hljs-string">&quot;content&quot;</span>: [
               {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: query},
               {
                  <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>,
                  <span class="hljs-string">&quot;image_url&quot;</span>: {
                        <span class="hljs-string">&quot;url&quot;</span>: <span class="hljs-string">f&quot;data:image/jpeg;base64,<span class="hljs-subst">{base64_image}</span>&quot;</span>
                  }
               }
            ]
      }
   ]
   <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.chat(messages)
<button class="copy-code-btn"></button></code></pre>
<p><strong>3. 폴백 계획</strong></p>
<p>네트워크 문제나 모델 제한 등으로 인해 이미지 API가 실패하면 시스템은 일반 텍스트 기반 RAG로 다시 전환합니다.<br>
OCR 텍스트를 사용하여 질문에 답변하므로 시스템은 중단 없이 계속 작동합니다.</p>
<pre><code translate="no"><span class="hljs-comment"># Fallback logic in backend.py</span>
<span class="hljs-keyword">try</span>:
   answer = ernie.chat_with_image(final_prompt, img_path)
   <span class="hljs-comment"># ...</span>
<span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
   <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;⚠️ Model does not support images. Switching to text mode.&quot;</span>)
   <span class="hljs-comment"># Fallback: use the extracted text as context to continue answering</span>
   answer, metric = ask_question_logic(final_prompt, collection_name)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Key-UI-Features-and-Implementation-for-Pipeline" class="common-anchor-header">파이프라인의 주요 UI 기능 및 구현<button data-href="#Key-UI-Features-and-Implementation-for-Pipeline" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="How-to-Handle-API-Rate-Limiting-and-Protection" class="common-anchor-header">API 속도 제한 및 보호 처리 방법</h3><p>LLM을 호출하거나 API를 임베드할 때 시스템에서 <strong>429 요청</strong> 수 초과 오류가 발생할 수 있습니다. 이는 일반적으로 짧은 시간에 너무 많은 요청이 전송될 때 발생합니다.</p>
<p>이를 처리하기 위해 프로젝트는 ernie_client.py에 적응형 속도 저하 메커니즘을 추가합니다. 속도 제한 오류가 발생하면 시스템이 멈추는 대신 자동으로 요청 속도를 낮추고 재시도합니다.</p>
<pre><code translate="no"><span class="hljs-comment"># Logic for handling rate limiting</span>
<span class="hljs-keyword">if</span> is_rate_limit:
    <span class="hljs-variable language_">self</span>._adaptive_slow_down()  <span class="hljs-comment"># Permanently increase the request interval</span>
    wait_time = (<span class="hljs-number">2</span> ** attempt) + random.uniform(<span class="hljs-number">1.0</span>, <span class="hljs-number">3.0</span>)  <span class="hljs-comment"># Exponential backoff</span>
    time.sleep(wait_time)
<span class="hljs-keyword">def</span> <span class="hljs-title function_">_adaptive_slow_down</span>(<span class="hljs-params">self</span>):
    <span class="hljs-string">&quot;&quot;&quot;Trigger adaptive downgrade: when rate limiting occurs, permanently increase the global request interval&quot;&quot;&quot;</span>
    <span class="hljs-variable language_">self</span>.current_delay = <span class="hljs-built_in">min</span>(<span class="hljs-variable language_">self</span>.current_delay * <span class="hljs-number">2.0</span>, <span class="hljs-number">15.0</span>)
    logger.warning(<span class="hljs-string">f&quot;📉 Rate limit triggered (429), system automatically slowing down: new interval <span class="hljs-subst">{self.current_delay:<span class="hljs-number">.2</span>f}</span>s&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>이는 특히 많은 양의 문서를 처리하고 임베드할 때 시스템을 안정적으로 유지하는 데 도움이 됩니다.</p>
<h3 id="Custom-Styling" class="common-anchor-header">사용자 지정 스타일링</h3><p>프런트엔드는 Gradio(main.py)를 사용합니다. 인터페이스를 더 깔끔하고 사용하기 쉽게 만들기 위해 사용자 정의 CSS(modern_css)를 추가했습니다.</p>
<ul>
<li><strong>입력 상자</strong></li>
</ul>
<p>기본 회색 스타일에서 흰색의 둥근 디자인으로 변경되었습니다. 더 심플하고 모던해 보입니다.</p>
<ul>
<li><strong>보내기 버튼</strong></li>
</ul>
<p>그라데이션 색상과 호버 효과를 추가하여 더욱 눈에 띄도록 했습니다.</p>
<pre><code translate="no"><span class="hljs-comment">/* main.py - modern_css snippet */</span>
<span class="hljs-comment">/* Force the input box to use a white background with rounded corners, simulating a modern chat app */</span>
.custom-textbox textarea {
    background-color: 
<span class="hljs-meta">#ffffff</span>
 !important;
    border: <span class="hljs-number">1</span>px solid 
<span class="hljs-meta">#e5e7eb</span>
 !important;
    border-radius: <span class="hljs-number">12</span>px !important;
    box-shadow: <span class="hljs-number">0</span> <span class="hljs-number">4</span>px <span class="hljs-number">12</span><span class="hljs-function">px <span class="hljs-title">rgba</span>(<span class="hljs-params"><span class="hljs-number">0</span>,<span class="hljs-number">0</span>,<span class="hljs-number">0</span>,<span class="hljs-number">0.05</span></span>) !important</span>;
    padding: <span class="hljs-number">14</span>px !important;
}
<span class="hljs-comment">/* Gradient send button */</span>
.send-btn {
    background: linear-gradient(<span class="hljs-number">135</span>deg, 
<span class="hljs-meta">#6366f1</span>
 <span class="hljs-number">0</span>%, 
<span class="hljs-meta">#4f46e5</span>
 <span class="hljs-number">100</span>%) !important;
    color: white !important;
    box-shadow: <span class="hljs-number">0</span> <span class="hljs-number">4</span>px <span class="hljs-number">10</span><span class="hljs-function">px <span class="hljs-title">rgba</span>(<span class="hljs-params"><span class="hljs-number">99</span>, <span class="hljs-number">102</span>, <span class="hljs-number">241</span>, <span class="hljs-number">0.3</span></span>) !important</span>;
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="LaTeX-Formula-Rendering" class="common-anchor-header">라텍스 공식 렌더링</h3><p>많은 연구 문서에는 수학 공식이 포함되어 있으므로 정확한 렌더링이 중요합니다. 인라인 및 블록 수식 모두에 대한 완전한 LaTeX 지원을 추가했습니다.</p>
<ul>
<li><strong>적용 위치</strong>이 구성은 채팅 창(챗봇)과 요약 영역(마크다운) 모두에서 작동합니다.</li>
<li><strong>실제 결과</strong>수식이 모델의 답변에 표시되든 문서 요약에 표시되든 페이지에서 올바르게 렌더링됩니다.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Configure LaTeX rules in main.py</span>
latex_config = [
    {<span class="hljs-string">&quot;left&quot;</span>: <span class="hljs-string">&quot;$$&quot;</span>, <span class="hljs-string">&quot;right&quot;</span>: <span class="hljs-string">&quot;$$&quot;</span>, <span class="hljs-string">&quot;display&quot;</span>: <span class="hljs-literal">True</span>},    <span class="hljs-comment"># Recognize block equations</span>
    {<span class="hljs-string">&quot;left&quot;</span>: <span class="hljs-string">&quot;$&quot;</span>, <span class="hljs-string">&quot;right&quot;</span>: <span class="hljs-string">&quot;$&quot;</span>, <span class="hljs-string">&quot;display&quot;</span>: <span class="hljs-literal">False</span>},     <span class="hljs-comment"># Recognize inline equations</span>
    {<span class="hljs-string">&quot;left&quot;</span>: <span class="hljs-string">&quot;\(&quot;</span>, <span class="hljs-string">&quot;right&quot;</span>: <span class="hljs-string">&quot;\)&quot;</span>, <span class="hljs-string">&quot;display&quot;</span>: <span class="hljs-literal">False</span>}, <span class="hljs-comment"># Standard LaTeX inline</span>
    {<span class="hljs-string">&quot;left&quot;</span>: <span class="hljs-string">&quot;\[&quot;</span>, <span class="hljs-string">&quot;right&quot;</span>: <span class="hljs-string">&quot;\]&quot;</span>, <span class="hljs-string">&quot;display&quot;</span>: <span class="hljs-literal">True</span>}   <span class="hljs-comment"># Standard LaTeX block</span>
]
<span class="hljs-comment"># Then inject this configuration when initializing components:</span>
<span class="hljs-comment"># Enable LaTeX in Chatbot</span>
chatbot = gr.Chatbot(
    label=<span class="hljs-string">&quot;Conversation&quot;</span>,
    <span class="hljs-comment"># ... other parameters ...</span>
    latex_delimiters=latex_config  <span class="hljs-comment"># Key configuration: enable formula rendering</span>
)
<span class="hljs-comment"># Enable LaTeX in the document summary area</span>
doc_summary = gr.Markdown(
    value=<span class="hljs-string">&quot;*No summary available*&quot;</span>,
    latex_delimiters=latex_config
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Explainability-Relevance-Scores-and-Confidence" class="common-anchor-header">설명 가능성: 관련성 점수 및 신뢰도</h3><p>'블랙박스' 환경을 피하기 위해 시스템에서는 두 가지 간단한 지표를 표시합니다:</p>
<ul>
<li><p><strong>관련성</strong></p></li>
<li><p>'참조' 섹션의 각 답안 아래에 표시됩니다.</p></li>
<li><p>인용된 각 청크에 대한 재순위 점수를 표시합니다.</p></li>
<li><p>사용자가 특정 페이지 또는 구절이 사용된 이유를 확인할 수 있도록 도와줍니다.</p></li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># backend.py - Build reference source list</span>
sources = <span class="hljs-string">&quot;\n\n📚 **References:**\n&quot;</span>
<span class="hljs-keyword">for</span> c <span class="hljs-keyword">in</span> final:
    <span class="hljs-comment"># ... (deduplication logic) ...</span>
    <span class="hljs-comment"># Directly pass through the per-chunk score calculated by the Reranker</span>
    sources += <span class="hljs-string">f&quot;- <span class="hljs-subst">{key}</span> [Relevance:<span class="hljs-subst">{c.get(<span class="hljs-string">&#x27;composite_score&#x27;</span>,<span class="hljs-number">0</span>):<span class="hljs-number">.0</span>f}</span>%]\n&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><p><strong>신뢰도</strong></p></li>
<li><p>"분석 세부 사항" 패널에 표시됩니다.</p></li>
<li><p>상위 청크의 점수를 기준으로 합니다(100%로 조정됨).</p></li>
<li><p>시스템이 정답에 대해 얼마나 확신하는지를 보여줍니다.</p></li>
<li><p>60% 미만이면 답변의 신뢰도가 낮을 수 있습니다.</p></li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># backend.py - Calculate overall confidence</span>
<span class="hljs-comment"># 1. Get the top-ranked chunk after reranking</span>
final = processed[:<span class="hljs-number">22</span>]
top_score = final[<span class="hljs-number">0</span>].get(<span class="hljs-string">&#x27;composite_score&#x27;</span>, <span class="hljs-number">0</span>) <span class="hljs-keyword">if</span> final <span class="hljs-keyword">else</span> <span class="hljs-number">0</span>
<span class="hljs-comment"># 2. Normalize the score (capped at 100%) as the overall &quot;confidence&quot; for this Q&amp;A</span>
metric = <span class="hljs-string">f&quot;<span class="hljs-subst">{<span class="hljs-built_in">min</span>(<span class="hljs-number">100</span>, top_score):<span class="hljs-number">.1</span>f}</span>%&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>UI는 아래와 같습니다. 인터페이스에서 각 답변에는 소스의 페이지 번호와 관련성 점수가 표시됩니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_ec01986414.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_98d526ce64.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_99e9d19162.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_a82aaa6ddd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>RAG 정확도는 LLM과 벡터 데이터베이스 사이의 엔지니어링에 따라 달라집니다. 이 문서에서는 해당 엔지니어링의 각 단계를 다루는 <a href="https://milvus.io"></a><a href="https://milvus.io">Milvus를</a> 사용한 <a href="https://github.com/LiaoYFBH/Paddle-ERNIE-RAG/blob/main/README_EN.md">Paddle-ERNIE-RAG</a> 빌드를 살펴봤습니다:</p>
<ul>
<li><strong>문서 구문 분석.</strong> PP-StructureV3( <a href="https://github.com/PaddlePaddle/PaddleOCR"></a><a href="https://github.com/PaddlePaddle/PaddleOCR"></a> PaddleOCR을 통해)는 기본 추출기가 손실하는 제목, 표, 이미지를 보존하면서 레이아웃 인식 OCR을 통해 PDF를 깔끔한 마크다운으로 변환합니다.</li>
<li><strong>청킹.</strong> 겹치는 슬라이딩 창 분할은 청크 경계에서 컨텍스트를 그대로 유지하여 검색 불러오기를 방해하는 깨진 조각을 방지합니다.</li>
<li><strong>밀버스에 벡터 저장.</strong> 빠르고 정확한 검색을 지원하는 방식으로 벡터를 저장하세요.</li>
<li><strong>하이브리드 검색.</strong> 벡터 검색과 키워드 검색을 병렬로 실행한 다음 결과를 RRF(상호 순위 융합)로 병합하면 두 방법만으로는 놓칠 수 있는 의미적 일치와 정확한 용어 히트를 모두 잡아낼 수 있습니다.</li>
<li><strong>순위 재조정.</strong> 투명한 규칙 기반 재랭커는 퍼지 일치, 키워드 범위, 의미적 유사성, 길이, 고유 명사 탐지에 따라 각 청크에 점수를 매기며, 학습 데이터가 필요하지 않고 모든 점수를 디버깅할 수 있습니다.</li>
<li><strong>멀티모달 Q&amp;A.</strong> 프롬프트에서 이미지를 OCR 페이지 텍스트와 페어링하면 비전 모델이 차트와 다이어그램에 대한 질문에 답하기에 충분한 컨텍스트를 제공하며, 이미지 API가 실패할 경우 텍스트 전용 폴백이 제공됩니다.</li>
</ul>
<p>문서 Q&amp;A를 위한 RAG 시스템을 구축 중이고 더 나은 정확도를 원하신다면 어떻게 접근하고 계신지 알려주시기 바랍니다.</p>
<p><a href="https://milvus.io/">Milvus</a>, 하이브리드 검색 또는 지식창고 디자인에 대해 질문이 있으신가요? <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack 채널에</a> 참여하거나 20분 동안 진행되는 <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus 오피스 아워</a> 세션을 예약하여 사용 사례에 대해 논의하세요.</p>
