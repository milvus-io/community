---
id: smarter-retrieval-for-rag-late-chunking-with-jina-embeddings-v2-and-milvus.md
title: 'RAG를 위한 더 스마트한 검색: Jina Embedding v2 및 Milvus를 사용한 후기 청킹'
author: Wei Zang
date: 2025-10-11T00:00:00.000Z
desc: 문맥을 인식하는 효율적인 문서 임베딩과 더 빠르고 스마트한 벡터 검색을 위해 후기 청킹 및 밀버스를 사용하여 RAG 정확도를 높입니다.
cover: >-
  assets.zilliz.com/Milvus_Meets_Late_Chunking_Smarter_Retrieval_for_RAG_4f9640fffd.png
tag: Tutorials
tags: 'Milvus, Vector Database, Open Source, Vector Embeddings'
recommend: true
meta_keywords: 'Late Chunking, RAG accuracy, vector database, Milvus, document embeddings'
canonicalUrl: >-
  https://milvus.io/blog/smarter-retrieval-for-rag-late-chunking-with-jina-embeddings-v2-and-milvus.md
---
<p>강력한 RAG 시스템 구축은 일반적으로 <strong>문서</strong> <a href="https://zilliz.com/learn/guide-to-chunking-strategies-for-rag#Chunking"><strong>청크(</strong></a>큰 텍스트를 관리하기 쉬운 조각으로 <a href="https://zilliz.com/learn/guide-to-chunking-strategies-for-rag#Chunking"><strong>분할하여</strong></a>임베딩 및 검색할 수 있도록 하는 작업)에서 시작됩니다. 일반적인 전략은 다음과 같습니다:</p>
<ul>
<li><p><strong>고정 크기 청크</strong> (예: 512토큰마다)</p></li>
<li><p><strong>가변 크기 청크</strong> (예: 단락 또는 문장 경계)</p></li>
<li><p><strong>슬라이딩 창</strong> (겹치는 스팬)</p></li>
<li><p>재귀적<strong>청킹</strong> (계층적 분할)</p></li>
<li><p><strong>의미적 청크</strong> (주제별 그룹화)</p></li>
</ul>
<p>이러한 방법에는 장점이 있지만, 종종 긴 범위의 문맥이 단절되는 경우가 있습니다. 이 문제를 해결하기 위해 Jina AI는 전체 문서를 먼저 임베드한 다음 청크를 분할하는 후기 청킹 접근 방식을 사용합니다.</p>
<p>이 글에서는 후기 청킹이 어떻게 작동하는지 살펴보고, 유사성 검색을 위해 구축된 고성능 오픈 소스 벡터 <a href="https://milvus.io/">데이터베이스인 Milvus와</a>결합하여 RAG 파이프라인을 획기적으로 개선할 수 있는 방법을 보여드립니다. 엔터프라이즈 지식 베이스, AI 기반 고객 지원, 고급 검색 애플리케이션을 구축하는 경우, 이 워크스루를 통해 대규모로 임베딩을 보다 효과적으로 관리하는 방법을 알아보세요.</p>
<h2 id="What-Is-Late-Chunking" class="common-anchor-header">후기 청킹이란 무엇인가요?<button data-href="#What-Is-Late-Chunking" class="anchor-icon" translate="no">
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
    </button></h2><p>기존의 청킹 방식은 주요 정보가 여러 청크에 걸쳐 있을 때 중요한 연결이 끊어져 검색 성능이 저하될 수 있습니다.</p>
<p>아래와 같이 두 개의 청크로 나뉘어져 있는 Milvus 2.4.13의 릴리스 노트를 살펴보세요:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure1_Chunking_Milvus2_4_13_Release_Note_fe7fbdb833.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>그림 1. Milvus 2.4.13 청크 분할 릴리즈 노트</em></p>
<p>"Milvus 2.4.13의 새로운 기능은 무엇인가요?"라고 쿼리하면 표준 임베딩 모델에서 "Milvus 2.4.13"(청크 1)과 해당 기능(청크 2)을 연결하지 못할 수 있습니다. 결과는? 벡터가 약해지고 검색 정확도가 낮아집니다.</p>
<p>슬라이딩 창, 겹치는 컨텍스트, 반복 스캔과 같은 휴리스틱 수정은 부분적인 해결책을 제공하지만 보장은 없습니다.</p>
<p><strong>기존의 청킹은</strong> 이 파이프라인을 따릅니다:</p>
<ol>
<li><p>텍스트<strong>사전 청크</strong> (문장, 단락 또는 최대 토큰 길이 기준).</p></li>
<li><p>각 청크를 개별적으로<strong>임베드합니다</strong>.</p></li>
<li><p>평균 풀링 등을 통해 토큰 임베딩을 하나의 청크 벡터로<strong>집계합니다</strong>.</p></li>
</ol>
<p><strong>후기 청킹은</strong> 파이프라인을 뒤집습니다:</p>
<ol>
<li><p><strong>먼저 임베드합니다</strong>: 전체 문서에 대해 긴 컨텍스트 트랜스포머를 실행하여 글로벌 컨텍스트를 캡처하는 풍부한 토큰 임베딩을 생성합니다.</p></li>
<li><p><strong>나중에 청크</strong>: 이러한 토큰 임베딩의 인접한 스팬을 평균 풀링하여 최종 청크 벡터를 형성합니다.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure2_Naive_Chunkingvs_Late_Chunking_a94d30b6ea.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>그림 2. 초기 청킹과 후기 청킹 비교(</em><a href="https://jina.ai/news/late-chunking-in-long-context-embedding-models/"><em>출처</em></a><em>)</em></p>
<p>모든 청크에 전체 문서 컨텍스트를 보존함으로써 후기 청킹은 다음과 같은 결과를 가져옵니다:</p>
<ul>
<li><p><strong>검색 정확도 향상 - 각</strong>청크가 문맥을 인식합니다.</p></li>
<li><p><strong>청크 수 감소 -</strong>더 집중된 텍스트를 LLM에 전송하여 비용과 지연 시간을 줄일 수 있습니다.</p></li>
</ul>
<p>jina-embeddings-v2-base-en과 같은 많은 긴 문맥 모델은 최대 8,192개의 토큰(약 20분 분량(약 5,000단어)에 해당)을 처리할 수 있으므로 대부분의 실제 문서에 후기 청킹이 실용적입니다.</p>
<p>이제 후기 청킹의 '무엇'과 '왜'를 이해했으니 이제 '어떻게'에 대해 알아보겠습니다. 다음 섹션에서는 후기 청킹 파이프라인의 실제 구현 과정을 안내하고, 기존 청킹과 성능을 벤치마킹하고, Milvus를 사용하여 실제 영향력을 검증해 보겠습니다. 이 실용적인 워크스루는 이론과 실무를 연결하여 후기 청킹을 RAG 워크플로에 통합하는 방법을 정확하게 보여줍니다.</p>
<h2 id="Testing-Late-Chunking" class="common-anchor-header">후기 청킹 테스트하기<button data-href="#Testing-Late-Chunking" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Basic-Implementation" class="common-anchor-header">기본 구현</h3><p>다음은 후기 청킹의 핵심 기능입니다. 각 단계를 안내하기 위해 명확한 문서 설명을 추가했습니다. <code translate="no">sentence_chunker</code> 함수는 원본 문서를 단락 기반 청크로 분할하여 청크 콘텐츠와 청크 주석 정보 <code translate="no">span_annotations</code> (즉, 각 청크의 시작 및 끝 인덱스)를 모두 반환합니다.</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">sentence_chunker</span>(<span class="hljs-params">document, batch_size=<span class="hljs-number">10000</span></span>):
    nlp = spacy.blank(<span class="hljs-string">&quot;en&quot;</span>)
    nlp.add_pipe(<span class="hljs-string">&quot;sentencizer&quot;</span>, config={<span class="hljs-string">&quot;punct_chars&quot;</span>: <span class="hljs-literal">None</span>})
    doc = nlp(document)

    docs = []
    <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">0</span>, <span class="hljs-built_in">len</span>(document), batch_size):
        batch = document[i : i + batch_size]
        docs.append(nlp(batch))

    doc = Doc.from_docs(docs)

    span_annotations = []
    chunks = []
    <span class="hljs-keyword">for</span> i, sent <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(doc.sents):
        span_annotations.append((sent.start, sent.end))
        chunks.append(sent.text)

    <span class="hljs-keyword">return</span> chunks, span_annotations
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">document_to_token_embeddings</code> 함수는 전체 문서에 대한 임베딩을 생성하기 위해 jinaai/jina-embeddings-v2-base-en 모델과 해당 토큰화 도구를 사용합니다.</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">document_to_token_embeddings</span>(<span class="hljs-params">model, tokenizer, document, batch_size=<span class="hljs-number">4096</span></span>):
    tokenized_document = tokenizer(document, return_tensors=<span class="hljs-string">&quot;pt&quot;</span>)
    tokens = tokenized_document.tokens()

    outputs = []
    <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">0</span>, <span class="hljs-built_in">len</span>(tokens), batch_size):
        
        start = i
        end   = <span class="hljs-built_in">min</span>(i + batch_size, <span class="hljs-built_in">len</span>(tokens))

        batch_inputs = {k: v[:, start:end] <span class="hljs-keyword">for</span> k, v <span class="hljs-keyword">in</span> tokenized_document.items()}

        <span class="hljs-keyword">with</span> torch.no_grad():
            model_output = model(**batch_inputs)

        outputs.append(model_output.last_hidden_state)

    model_output = torch.cat(outputs, dim=<span class="hljs-number">1</span>)
    <span class="hljs-keyword">return</span> model_output
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">late_chunking</code> 함수는 문서의 토큰 임베딩과 원본 청크 어노테이션 정보 <code translate="no">span_annotations</code> 를 가져와서 최종 청크 임베딩을 생성합니다.</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">late_chunking</span>(<span class="hljs-params">token_embeddings, span_annotation, max_length=<span class="hljs-literal">None</span></span>):
    outputs = []
    <span class="hljs-keyword">for</span> embeddings, annotations <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(token_embeddings, span_annotation):
        <span class="hljs-keyword">if</span> (
            max_length <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> <span class="hljs-literal">None</span>
        ):
            annotations = [
                (start, <span class="hljs-built_in">min</span>(end, max_length - <span class="hljs-number">1</span>))
                <span class="hljs-keyword">for</span> (start, end) <span class="hljs-keyword">in</span> annotations
                <span class="hljs-keyword">if</span> start &lt; (max_length - <span class="hljs-number">1</span>)
            ]
        pooled_embeddings = []
        <span class="hljs-keyword">for</span> start, end <span class="hljs-keyword">in</span> annotations:
            <span class="hljs-keyword">if</span> (end - start) &gt;= <span class="hljs-number">1</span>:
                pooled_embeddings.append(
                    embeddings[start:end].<span class="hljs-built_in">sum</span>(dim=<span class="hljs-number">0</span>) / (end - start)
                )
                    
        pooled_embeddings = [
            embedding.detach().cpu().numpy() <span class="hljs-keyword">for</span> embedding <span class="hljs-keyword">in</span> pooled_embeddings
        ]
        outputs.append(pooled_embeddings)

    <span class="hljs-keyword">return</span> outputs
<button class="copy-code-btn"></button></code></pre>
<p>예를 들어, jinaai/jina-embeddings-v2-base-en으로 청크를 생성합니다:</p>
<pre><code translate="no">tokenizer = AutoTokenizer.from_pretrained(<span class="hljs-string">&#x27;jinaai/jina-embeddings-v2-base-en&#x27;</span>, trust_remote_code=<span class="hljs-literal">True</span>)
model     = AutoModel.from_pretrained(<span class="hljs-string">&#x27;jinaai/jina-embeddings-v2-base-en&#x27;</span>, trust_remote_code=<span class="hljs-literal">True</span>)

<span class="hljs-comment"># First chunk the text as normal, to obtain the beginning and end points of the chunks.</span>
chunks, span_annotations = sentence_chunker(document)
<span class="hljs-comment"># Then embed the full document.</span>
token_embeddings = document_to_token_embeddings(model, tokenizer, document)
<span class="hljs-comment"># Then perform the late chunking</span>
chunk_embeddings = late_chunking(token_embeddings, [span_annotations])[<span class="hljs-number">0</span>]
<button class="copy-code-btn"></button></code></pre>
<p><em>팁:</em> 파이프라인을 함수로 래핑하면 다른 긴 컨텍스트 모델이나 청킹 전략으로 쉽게 교체할 수 있습니다.</p>
<h3 id="Comparison-with-Traditional-Embedding-Methods" class="common-anchor-header">기존 임베딩 방법과의 비교</h3><p>후기 청킹의 장점을 더 자세히 설명하기 위해 샘플 문서와 쿼리 세트를 사용하여 기존 임베딩 방식과도 비교했습니다.</p>
<p>그리고 Milvus 2.4.13 릴리즈 노트 예시를 다시 살펴봅시다:</p>
<pre><code translate="no"><span class="hljs-title class_">Milvus</span> <span class="hljs-number">2.4</span><span class="hljs-number">.13</span> introduces dynamic replica load, allowing users to adjust the number <span class="hljs-keyword">of</span> collection replicas without needing to release and reload the collection. <span class="hljs-title class_">This</span> version also addresses several critical bugs related to bulk importing, expression parsing, load balancing, and failure recovery. <span class="hljs-title class_">Additionally</span>, significant improvements have been made to <span class="hljs-variable constant_">MMAP</span> resource usage and <span class="hljs-keyword">import</span> performance, enhancing overall system efficiency. <span class="hljs-title class_">We</span> highly recommend upgrading to <span class="hljs-variable language_">this</span> release <span class="hljs-keyword">for</span> better performance and stability.
<button class="copy-code-btn"></button></code></pre>
<p>쿼리 임베딩("milvus 2.4.13")과 각 청크 간의 <a href="https://zilliz.com/blog/similarity-metrics-for-vector-search#Cosine-Similarity">코사인 유사성을</a> 측정합니다:</p>
<pre><code translate="no">cos_sim = <span class="hljs-keyword">lambda</span> x, y: np.dot(x, y) / (np.linalg.norm(x) * np.linalg.norm(y))

milvus_embedding = model.encode(<span class="hljs-string">&#x27;milvus 2.4.13&#x27;</span>)

<span class="hljs-keyword">for</span> chunk, late_chunking_embedding, traditional_embedding <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(chunks, chunk_embeddings, embeddings_traditional_chunking):
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&#x27;similarity_late_chunking(&quot;milvus 2.4.13&quot;, &quot;<span class="hljs-subst">{chunk}</span>&quot;)&#x27;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&#x27;late_chunking: &#x27;</span>, cos_sim(milvus_embedding, late_chunking_embedding))
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&#x27;similarity_traditional(&quot;milvus 2.4.13&quot;, &quot;<span class="hljs-subst">{chunk}</span>&quot;)&#x27;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&#x27;traditional_chunking: &#x27;</span>, cos_sim(milvus_embedding, traditional_embeddings))
<button class="copy-code-btn"></button></code></pre>
<p>후기 청킹은 모든 청크에서 더 높은 코사인 유사도를 산출하여 기존 청킹보다 일관되게 더 나은 성능을 보였습니다. 이는 전체 문서를 먼저 임베드하는 것이 글로벌 컨텍스트를 더 효과적으로 보존한다는 것을 확인시켜 줍니다.</p>
<pre><code translate="no"><span class="hljs-title function_">similarity_late_chunking</span>(<span class="hljs-string">&quot;milvus 2.4.13&quot;</span>, <span class="hljs-string">&quot;Milvus 2.4.13 introduces dynamic replica load, allowing users to adjust the number of collection replicas without needing to release and reload the collection.&quot;</span>)
<span class="hljs-attr">late_chunking</span>: <span class="hljs-number">0.8785206</span>
<span class="hljs-title function_">similarity_traditional</span>(<span class="hljs-string">&quot;milvus 2.4.13&quot;</span>, <span class="hljs-string">&quot;Milvus 2.4.13 introduces dynamic replica load, allowing users to adjust the number of collection replicas without needing to release and reload the collection.&quot;</span>)
<span class="hljs-attr">traditional_chunking</span>: <span class="hljs-number">0.8354263</span>

<span class="hljs-title function_">similarity_late_chunking</span>(<span class="hljs-string">&quot;milvus 2.4.13&quot;</span>, <span class="hljs-string">&quot;This version also addresses several critical bugs related to bulk importing, expression parsing, load balancing, and failure recovery.&quot;</span>)
<span class="hljs-attr">late_chunking</span>: <span class="hljs-number">0.84828955</span>
<span class="hljs-title function_">similarity_traditional</span>(<span class="hljs-string">&quot;milvus 2.4.13&quot;</span>, <span class="hljs-string">&quot;This version also addresses several critical bugs related to bulk importing, expression parsing, load balancing, and failure recovery.&quot;</span>)
<span class="hljs-attr">traditional_chunking</span>: <span class="hljs-number">0.7222632</span>

<span class="hljs-title function_">similarity_late_chunking</span>(<span class="hljs-string">&quot;milvus 2.4.13&quot;</span>, <span class="hljs-string">&quot;Additionally, significant improvements have been made to MMAP resource usage and import performance, enhancing overall system efficiency.&quot;</span>)
<span class="hljs-attr">late_chunking</span>: <span class="hljs-number">0.84942204</span>
<span class="hljs-title function_">similarity_traditional</span>(<span class="hljs-string">&quot;milvus 2.4.13&quot;</span>, <span class="hljs-string">&quot;Additionally, significant improvements have been made to MMAP resource usage and import performance, enhancing overall system efficiency.&quot;</span>)
<span class="hljs-attr">traditional_chunking</span>: <span class="hljs-number">0.6907381</span>

<span class="hljs-title function_">similarity_late_chunking</span>(<span class="hljs-string">&quot;milvus 2.4.13&quot;</span>, <span class="hljs-string">&quot;We highly recommend upgrading to this release for better performance and stability.&quot;</span>)
<span class="hljs-attr">late_chunking</span>: <span class="hljs-number">0.85431844</span>
<span class="hljs-title function_">similarity_traditional</span>(<span class="hljs-string">&quot;milvus 2.4.13&quot;</span>, <span class="hljs-string">&quot;We highly recommend upgrading to this release for better performance and stability.&quot;</span>)
<span class="hljs-attr">traditional_chunking</span>: <span class="hljs-number">0.71859795</span>
<button class="copy-code-btn"></button></code></pre>
<p>전체 단락을 먼저 임베드하면 각 청크에 "<code translate="no">Milvus 2.4.13</code>" 컨텍스트에 따른 유사성 점수와 검색 품질이 향상된다는 것을 알 수 있습니다.</p>
<h3 id="Testing-Late-Chunking-in-Milvus" class="common-anchor-header"><strong>Milvus에서 후기 청크 임베딩 테스트하기</strong></h3><p>청크 임베딩이 생성되면 Milvus에 저장하고 쿼리를 수행할 수 있습니다. 다음 코드는 청크 벡터를 컬렉션에 삽입합니다.</p>
<h4 id="Importing-Embeddings-into-Milvus" class="common-anchor-header"><strong>Milvus로 임베딩 가져오기</strong></h4><pre><code translate="no">batch_data=[]
<span class="hljs-keyword">for</span> i in <span class="hljs-keyword">range</span>(<span class="hljs-built_in">len</span>(chunks)):
    data = {
            <span class="hljs-string">&quot;content&quot;</span>: chunks[i],
            <span class="hljs-string">&quot;embedding&quot;</span>: chunk_embeddings[i].tolist(),
        }

    batch_data.<span class="hljs-built_in">append</span>(data)

res = client.insert(
    collection_name=collection,
    data=batch_data,
)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Querying-and-Validation" class="common-anchor-header">쿼리 및 유효성 검사</h4><p>Milvus 쿼리의 정확성을 검증하기 위해 검색 결과를 수동으로 계산한 무차별 코사인 유사성 점수와 비교합니다. 두 방법 모두 일관된 상위 k 결과를 반환하면 Milvus의 검색 정확도가 신뢰할 수 있다고 확신할 수 있습니다.</p>
<p>Milvus의 기본 검색을 무차별 코사인 유사도 스캔과 비교합니다:</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">late_chunking_query_by_milvus</span>(<span class="hljs-params">query, top_k = <span class="hljs-number">3</span></span>):
    query_vector = model(**tokenizer(query, return_tensors=<span class="hljs-string">&quot;pt&quot;</span>)).last_hidden_state.mean(<span class="hljs-number">1</span>).detach().cpu().numpy().flatten()

    res = client.search(
                collection_name=collection,
                data=[query_vector.tolist()],
                limit=top_k,
                output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>],
            )

    <span class="hljs-keyword">return</span> [item.get(<span class="hljs-string">&quot;entity&quot;</span>).get(<span class="hljs-string">&quot;content&quot;</span>) <span class="hljs-keyword">for</span> items <span class="hljs-keyword">in</span> res <span class="hljs-keyword">for</span> item <span class="hljs-keyword">in</span> items]

<span class="hljs-keyword">def</span> <span class="hljs-title function_">late_chunking_query_by_cosine_sim</span>(<span class="hljs-params">query, k = <span class="hljs-number">3</span></span>):
    cos_sim = <span class="hljs-keyword">lambda</span> x, y: np.dot(x, y) / (np.linalg.norm(x) * np.linalg.norm(y))
    query_vector = model(**tokenizer(query, return_tensors=<span class="hljs-string">&quot;pt&quot;</span>)).last_hidden_state.mean(<span class="hljs-number">1</span>).detach().cpu().numpy().flatten()

    results = np.empty(<span class="hljs-built_in">len</span>(chunk_embeddings))
    <span class="hljs-keyword">for</span> i, (chunk, embedding) <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(<span class="hljs-built_in">zip</span>(chunks, chunk_embeddings)):
        results[i] = cos_sim(query_vector, embedding)

    results_order = results.argsort()[::-<span class="hljs-number">1</span>]
    <span class="hljs-keyword">return</span> np.array(chunks)[results_order].tolist()[:k]
<button class="copy-code-btn"></button></code></pre>
<p>이를 통해 Milvus가 수동 코사인 유사도 스캔과 동일한 상위 k 청크를 반환한다는 것을 확인했습니다.</p>
<pre><code translate="no">&gt; late_chunking_query_by_milvus(<span class="hljs-string">&quot;What are new features in milvus 2.4.13&quot;</span>, 3)

[<span class="hljs-string">&#x27;\n\n### Features\n\n- Dynamic replica adjustment for loaded collections ([#36417](https://github.com/milvus-io/milvus/pull/36417))\n- Sparse vector MMAP in growing segment types ([#36565](https://github.com/milvus-io/milvus/pull/36565))...
</span><button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">&gt; late_chunking_query_by_cosine_sim(<span class="hljs-string">&quot;What are new features in milvus 2.4.13&quot;</span>, 3)

[<span class="hljs-string">&#x27;\n\n### Features\n\n- Dynamic replica adjustment for loaded collections ([#36417](https://github.com/milvus-io/milvus/pull/36417))\n- Sparse vector MMAP in growing segment types (#36565)...
</span><button class="copy-code-btn"></button></code></pre>
<p>따라서 두 방법 모두 동일한 상위 3개 청크를 산출하여 Milvus의 정확성을 확인합니다.</p>
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
    </button></h2><p>이 글에서는 후기 청킹의 메커니즘과 이점에 대해 자세히 살펴봤습니다. 특히 컨텍스트 보존이 중요한 긴 문서를 처리할 때 기존 청킹 접근 방식의 단점을 파악하는 것부터 시작했습니다. 의미 있는 덩어리로 자르기 전에 전체 문서를 임베딩하는 후기 청킹의 개념을 소개하고, 이를 통해 어떻게 전체 문맥이 보존되어 의미적 유사성과 검색 정확도가 향상되는지 보여드렸습니다.</p>
<p>그런 다음 Jina AI의 jina-embeddings-v2-base-en 모델을 사용한 실습 구현을 살펴보고 기존 방식과 비교하여 성능을 평가했습니다. 마지막으로 확장 가능하고 정확한 벡터 검색을 위해 청크 임베딩을 Milvus에 통합하는 방법을 시연했습니다.</p>
<p>후기 청킹은 문맥이 가장 중요한 길고 복잡한 문서에 적합한 문맥 <strong>우선</strong> 임베딩 접근 방식을 제공합니다. 전체 텍스트를 미리 임베딩하고 나중에 슬라이싱하면 다음과 같은 이점을 얻을 수 있습니다:</p>
<ul>
<li><p><strong>ԍ 검색 정확도 향상</strong></p></li>
<li><p>⚡ <strong>간결하고 집중적인 LLM 프롬프트</strong></p></li>
<li><p>🛠️ 모든 긴 컨텍스트 모델과의 <strong>간단한 통합</strong> </p></li>
</ul>
