---
id: how-to-build-multimodal-rag-with-colqwen2-milvus-and-qwen35.md
title: '콜큐웬2, 밀버스, 큐웬3.5로 멀티모달 RAG를 구축하는 방법'
author: Lumina Wang
date: 2026-3-6
cover: assets.zilliz.com/download_11zon_1862455eb4.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'multimodal RAG, RAG, Milvus, Qwen3.5, vector database'
meta_keywords: 'multimodal RAG, RAG, Milvus, Qwen3.5, vector database'
meta_title: |
  How to Build Multimodal RAG with ColQwen2, Milvus, Qwen3.5
desc: >-
  ColQwen2, Milvus 및 Qwen3.5를 사용하여 추출된 텍스트 대신 PDF 페이지 이미지를 검색하는 멀티모달 RAG 파이프라인을
  구축하세요. 단계별 튜토리얼.
origin: >-
  https://milvus.io/blog/how-to-build-multimodal-rag-with-colqwen2-milvus-and-qwen35.md
---
<p>요즘에는 최신 LLM에 PDF를 업로드하고 이에 대해 질문할 수 있습니다. 소수의 문서라면 괜찮습니다. 하지만 대부분의 LLM은 수백 페이지의 컨텍스트에서 한도가 정해져 있기 때문에 대규모 코퍼스는 적합하지 않습니다. 설령 적합하더라도 모든 쿼리의 모든 페이지를 처리하기 위해 비용을 지불해야 합니다. 동일한 500페이지 문서 세트에 대해 100개의 질문을 하면 500페이지에 대해 100번의 비용을 지불하게 됩니다. 이는 금방 비용이 많이 듭니다.</p>
<p>검색 증강 생성(RAG)은 색인 작업과 답변 작업을 분리하여 이 문제를 해결합니다. 문서를 한 번 인코딩하고 벡터 데이터베이스에 표현을 저장한 다음 쿼리 시 가장 관련성이 높은 페이지만 검색하여 LLM으로 전송합니다. 모델은 전체 말뭉치가 아니라 쿼리당 3페이지를 읽습니다. 따라서 계속 늘어나는 컬렉션에 대해 문서 Q&amp;A를 구축하는 것이 실용적입니다.</p>
<p>이 튜토리얼에서는 공개적으로 라이선스가 부여된 세 가지 구성 요소로 멀티모달 RAG 파이프라인을 구축하는 방법을 안내합니다:</p>
<ul>
<li><strong><a href="https://huggingface.co/vidore/colqwen2-v1.0-merged">ColQwen2</a></strong> <a href="https://huggingface.co/vidore/colqwen2-v1.0-merged"></a>는 각 PDF 페이지를 이미지로 인코딩하여 다중 벡터 임베딩으로 인코딩함으로써 기존의 OCR 및 텍스트 청킹 단계를 대체합니다.</li>
<li><strong><a href="http://milvus.io">Milvus는</a></strong> 이러한 벡터를 저장하고 쿼리 시 유사성 검색을 처리하여 가장 관련성이 높은 페이지만 검색합니다.</li>
<li>검색된 페이지 이미지를 읽고 이를 기반으로 답변을 생성합니다.</li>
</ul>
<p>결국 PDF와 질문을 받아 가장 관련성이 높은 페이지를 찾고 모델이 본 내용에 근거한 답변을 반환하는 작업 시스템을 갖추게 됩니다.</p>
<h2 id="What-is-Multimodal-RAG" class="common-anchor-header">멀티모달 RAG란 무엇인가요?<button data-href="#What-is-Multimodal-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>인트로에서는 RAG가 대규모로 중요한 이유를 다루었습니다. 다음 질문은 기존 접근 방식에는 사각지대가 있기 때문에 어떤 종류의 RAG가 필요한지입니다.</p>
<p>기존의 RAG는 문서에서 텍스트를 추출하여 벡터로 임베드하고 쿼리 시점에 가장 가까운 일치 항목을 검색한 후 해당 텍스트 청크를 LLM으로 전달합니다. 이는 깔끔한 서식이 있는 텍스트가 많은 콘텐츠에 적합합니다. 문서에 다음이 포함되면 성능이 저하됩니다:</p>
<ul>
<li>행, 열, 머리글 간의 관계에 따라 의미가 달라지는 표.</li>
<li>차트 및 도표: 정보가 전적으로 시각적이며 텍스트에 해당하는 내용이 없는 경우.</li>
<li>스캔 문서나 손글씨 노트: OCR 출력이 신뢰할 수 없거나 불완전한 경우.</li>
</ul>
<p>멀티모달 RAG는 텍스트 추출을 이미지 인코딩으로 대체합니다. 각 페이지를 이미지로 렌더링하고 비전 언어 모델로 인코딩한 다음 쿼리 시점에 페이지 이미지를 검색합니다. LLM은 표, 그림, 서식 등 원본 페이지를 보고 그 내용을 바탕으로 답변을 제공합니다.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Col_Qwen2_Milvus_Qwen3_5397_BA_17_B_5_2f55d33896.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Structure-of-Multimodal-RAG-Pipeline-ColQwen2-for-Encoding-Milvus-for-Search-Qwen35-for-Generation" class="common-anchor-header">멀티모달 RAG 파이프라인의 구조: 인코딩을 위한 ColQwen2, 검색을 위한 Milvus, 생성을 위한 Qwen3.5<button data-href="#Structure-of-Multimodal-RAG-Pipeline-ColQwen2-for-Encoding-Milvus-for-Search-Qwen35-for-Generation" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="How-the-Pipeline-Works-httpsassetszillizcomblogColQwen2MilvusQwen35397BA17B284c822b9efpng" class="common-anchor-header">파이프라인의 작동 방식  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Col_Qwen2_Milvus_Qwen3_5397_BA_17_B_2_84c822b9ef.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</h3><h3 id="Tech-Stack" class="common-anchor-header">기술 스택</h3><table>
<thead>
<tr><th><strong>구성 요소</strong></th><th><strong>선택</strong></th><th><strong>역할</strong></th></tr>
</thead>
<tbody>
<tr><td>PDF 처리</td><td>PDF2IMAGE + 팝플러</td><td>PDF 페이지를 고해상도 이미지로 렌더링</td></tr>
<tr><td>임베딩 모델</td><td><a href="https://huggingface.co/vidore/colqwen2-v1.0-merged">COLQWEN2-V1.0</a></td><td>비전 언어 모델; 각 페이지를 최대 755개의 128딤 패치 벡터로 인코딩합니다.</td></tr>
<tr><td>벡터 데이터베이스</td><td><a href="https://milvus.io/">Milvus Lite</a></td><td>패치 벡터 저장 및 유사도 검색 처리, 서버 설정 없이 로컬에서 실행됩니다.</td></tr>
<tr><td>세대 모델</td><td><a href="https://qwen.ai/blog?id=qwen3.5">Qwen3.5-397B-A17B</a></td><td>OpenRouter API를 통해 호출되는 멀티모달 LLM, 검색된 페이지 이미지를 읽어 답변 생성</td></tr>
</tbody>
</table>
<h2 id="Step-by-Step-Implementation-for-Multi-Modal-RAG-with-ColQwen2+-Milvus+-Qwen35-397B-A17B" class="common-anchor-header">콜큐웬2+ 밀버스+ Qwen3.5-397B-A17B를 사용한 멀티모달 RAG의 단계별 구현 방법<button data-href="#Step-by-Step-Implementation-for-Multi-Modal-RAG-with-ColQwen2+-Milvus+-Qwen35-397B-A17B" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Environment-Setup" class="common-anchor-header">환경 설정</h3><ol>
<li>Python 종속성 설치</li>
</ol>
<pre><code translate="no">pip install colpali-engine pymilvus openai pdf2image torch pillow tqdm
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>PDF 렌더링 엔진인 Poppler 설치</li>
</ol>
<pre><code translate="no"><span class="hljs-comment"># macOS</span>
brew install poppler

<span class="hljs-comment"># Ubuntu/Debian</span>
sudo apt-get install poppler-utils

<span class="hljs-comment"># Windows: download from https://github.com/oschwartz10612/poppler-windows</span>

<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li>임베딩 모델, ColQwen2 다운로드</li>
</ol>
<p>허깅페이스에서 vidore/colqwen2-v1.0-merged를 다운로드(~4.4GB)하고 로컬에 저장합니다:</p>
<pre><code translate="no"><span class="hljs-built_in">mkdir</span> -p ~/models/colqwen2-v1.0-merged
<span class="hljs-comment"># Download all model files to this directory</span>
<button class="copy-code-btn"></button></code></pre>
<ol start="4">
<li>OpenRouter API 키 받기</li>
</ol>
<p><a href="https://openrouter.ai/settings/keys"></a><a href="https://openrouter.ai/settings/keys">https://openrouter.ai/settings/keys</a> 에서 가입하고 키를 생성합니다<a href="https://openrouter.ai/settings/keys">.</a></p>
<h3 id="Step-1-Import-Dependencies-and-Configure" class="common-anchor-header">1단계: 종속성 가져오기 및 구성하기</h3><pre><code translate="no"><span class="hljs-keyword">import</span> os, io, base64
<span class="hljs-keyword">import</span> torch
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">from</span> PIL <span class="hljs-keyword">import</span> Image
<span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm
<span class="hljs-keyword">from</span> pdf2image <span class="hljs-keyword">import</span> convert_from_path

<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType
<span class="hljs-keyword">from</span> colpali_engine.models <span class="hljs-keyword">import</span> ColQwen2, ColQwen2Processor

<span class="hljs-comment"># --- Configuration ---</span>
EMBED_MODEL = os.path.expanduser(<span class="hljs-string">&quot;~/models/colqwen2-v1.0-merged&quot;</span>)
EMBED_DIM = <span class="hljs-number">128</span>              <span class="hljs-comment"># ColQwen2 output vector dimension</span>
MILVUS_URI = <span class="hljs-string">&quot;./milvus_demo.db&quot;</span>  <span class="hljs-comment"># Milvus Lite local file</span>
COLLECTION = <span class="hljs-string">&quot;doc_patches&quot;</span>
TOP_K = <span class="hljs-number">3</span>                    <span class="hljs-comment"># Number of pages to retrieve</span>
CANDIDATE_PATCHES = <span class="hljs-number">300</span>      <span class="hljs-comment"># Candidate patches per query token</span>

<span class="hljs-comment"># OpenRouter LLM config</span>
OPENROUTER_API_KEY = os.environ.get(
    <span class="hljs-string">&quot;OPENROUTER_API_KEY&quot;</span>,
    <span class="hljs-string">&quot;&lt;your-api-key-here&gt;&quot;</span>,
)
GENERATION_MODEL = <span class="hljs-string">&quot;qwen/qwen3.5-397b-a17b&quot;</span>

<span class="hljs-comment"># Device selection</span>
DEVICE = <span class="hljs-string">&quot;cuda&quot;</span> <span class="hljs-keyword">if</span> torch.cuda.is_available() <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;cpu&quot;</span>
DTYPE = torch.bfloat16 <span class="hljs-keyword">if</span> DEVICE == <span class="hljs-string">&quot;cuda&quot;</span> <span class="hljs-keyword">else</span> torch.float32
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Device: <span class="hljs-subst">{DEVICE}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>출력: 장치: CPU</p>
<h3 id="Step-2-Load-the-Embedding-Model" class="common-anchor-header">2단계: 임베딩 모델 로드</h3><p><strong>ColQwen2는</strong> 문서 이미지를 ColBERT 스타일의 다중 벡터 표현으로 인코딩하는 비전 언어 모델입니다. 각 페이지는 수백 개의 128차원 패치 벡터를 생성합니다.</p>
<pre><code translate="no"><span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Loading embedding model: <span class="hljs-subst">{EMBED_MODEL}</span>&quot;</span>)
emb_model = ColQwen2.from_pretrained(
    EMBED_MODEL,
    torch_dtype=DTYPE,
    attn_implementation=<span class="hljs-string">&quot;flash_attention_2&quot;</span> <span class="hljs-keyword">if</span> DEVICE == <span class="hljs-string">&quot;cuda&quot;</span> <span class="hljs-keyword">else</span> <span class="hljs-literal">None</span>,
    device_map=DEVICE,
).<span class="hljs-built_in">eval</span>()
emb_processor = ColQwen2Processor.from_pretrained(EMBED_MODEL)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Embedding model ready on <span class="hljs-subst">{DEVICE}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>출력:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Col_Qwen2_Milvus_Qwen3_5397_BA_17_B_1_1fbbeba04e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-Initialize-Milvus" class="common-anchor-header">3단계: Milvus 초기화</h3><p>이 튜토리얼에서는 별도의 서버 프로세스가 필요 없이 별도의 구성 없이 로컬 파일로 실행되는 Milvus Lite를 사용합니다.</p>
<p><strong>데이터베이스 스키마:</strong></p>
<p><strong>id</strong>: INT64, 자동 증가 기본 키</p>
<p><strong>doc_id</strong>: INT64, 페이지 번호(PDF의 어느 페이지)</p>
<p><strong>patch_idx</strong>: INT64, 해당 페이지 내 패치 인덱스</p>
<p><strong>벡터</strong> FLOAT_VECTOR(128), 패치의 128차원 임베딩값</p>
<pre><code translate="no">milvus_client = MilvusClient(uri=MILVUS_URI)

<span class="hljs-keyword">if</span> milvus_client.has_collection(COLLECTION):
    milvus_client.drop_collection(COLLECTION)

schema = milvus_client.create_schema(auto_id=<span class="hljs-literal">True</span>, enable_dynamic_field=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;doc_id&quot;</span>, DataType.INT64)
schema.add_field(<span class="hljs-string">&quot;patch_idx&quot;</span>, DataType.INT64)
schema.add_field(<span class="hljs-string">&quot;vector&quot;</span>, DataType.FLOAT_VECTOR, dim=EMBED_DIM)

index = milvus_client.prepare_index_params()
index.add_index(field_name=<span class="hljs-string">&quot;vector&quot;</span>, index_type=<span class="hljs-string">&quot;FLAT&quot;</span>, metric_type=<span class="hljs-string">&quot;IP&quot;</span>)
milvus_client.create_collection(COLLECTION, schema=schema, index_params=index)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Milvus collection created.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>출력: 밀버스 컬렉션이 생성되었습니다.</p>
<h3 id="Step-4-Convert-PDF-Pages-to-Images" class="common-anchor-header">4단계: PDF 페이지를 이미지로 변환</h3><p>각 페이지를 150 DPI로 렌더링합니다. 여기서는 텍스트 추출이 수행되지 않고 파이프라인이 모든 페이지를 이미지로만 처리합니다.</p>
<pre><code translate="no">PDF_PATH = <span class="hljs-string">&quot;Milvus vs Zilliz.pdf&quot;</span>  <span class="hljs-comment"># Replace with your own PDF</span>
images = [p.convert(<span class="hljs-string">&quot;RGB&quot;</span>) <span class="hljs-keyword">for</span> p <span class="hljs-keyword">in</span> convert_from_path(PDF_PATH, dpi=<span class="hljs-number">150</span>)]
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{<span class="hljs-built_in">len</span>(images)}</span> pages loaded.&quot;</span>)

<span class="hljs-comment"># Preview the first page</span>
images[<span class="hljs-number">0</span>].resize((<span class="hljs-number">400</span>, <span class="hljs-built_in">int</span>(<span class="hljs-number">400</span> * images[<span class="hljs-number">0</span>].height / images[<span class="hljs-number">0</span>].width)))
<button class="copy-code-btn"></button></code></pre>
<p>출력:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Col_Qwen2_Milvus_Qwen3_5397_BA_17_B_4_8720da8494.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-5-Encode-Images-and-Insert-into-Milvus" class="common-anchor-header">5단계: 이미지 인코딩 및 Milvus에 삽입</h3><p>ColQwen2는 각 페이지를 다중 벡터 패치 임베딩으로 인코딩합니다. 그런 다음 모든 패치를 Milvus에 별도의 행으로 삽입합니다.</p>
<pre><code translate="no"><span class="hljs-comment"># Encode all pages</span>
all_page_embs = []
<span class="hljs-keyword">with</span> torch.no_grad():
    <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> tqdm(<span class="hljs-built_in">range</span>(<span class="hljs-number">0</span>, <span class="hljs-built_in">len</span>(images), <span class="hljs-number">2</span>), desc=<span class="hljs-string">&quot;Encoding pages&quot;</span>):
        batch = images[i : i + <span class="hljs-number">2</span>]
        inputs = emb_processor.process_images(batch).to(emb_model.device)
        embs = emb_model(**inputs)
        <span class="hljs-keyword">for</span> e <span class="hljs-keyword">in</span> embs:
            all_page_embs.append(e.cpu().<span class="hljs-built_in">float</span>().numpy())

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Encoded <span class="hljs-subst">{<span class="hljs-built_in">len</span>(all_page_embs)}</span> pages, ~<span class="hljs-subst">{all_page_embs[<span class="hljs-number">0</span>].shape[<span class="hljs-number">0</span>]}</span> patches per page, dim=<span class="hljs-subst">{all_page_embs[<span class="hljs-number">0</span>].shape[<span class="hljs-number">1</span>]}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>출력: 인코딩된 17페이지, 페이지당 약 755개의 패치, 어둡기=128</p>
<pre><code translate="no"><span class="hljs-comment"># Insert into Milvus</span>
<span class="hljs-keyword">for</span> doc_id, patch_vecs <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(all_page_embs):
    rows = [
        {<span class="hljs-string">&quot;doc_id&quot;</span>: doc_id, <span class="hljs-string">&quot;patch_idx&quot;</span>: j, <span class="hljs-string">&quot;vector&quot;</span>: v.tolist()}
        <span class="hljs-keyword">for</span> j, v <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(patch_vecs)
    ]
    milvus_client.insert(COLLECTION, rows)

total = milvus_client.get_collection_stats(COLLECTION)[<span class="hljs-string">&quot;row_count&quot;</span>]
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Indexed <span class="hljs-subst">{<span class="hljs-built_in">len</span>(all_page_embs)}</span> pages, <span class="hljs-subst">{total}</span> patches total.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>출력: 17페이지 인덱싱, 총 12835개의 패치.</p>
<p>17페이지 PDF는 12,835개의 패치 벡터 레코드를 생성하며, 이는 페이지당 약 755개의 패치입니다.</p>
<h3 id="Step-6-Retrieve--Query-Encoding-+-MaxSim-Reranking" class="common-anchor-header">6단계: 검색 - 쿼리 인코딩 + MaxSim 재순위 지정</h3><p>이것이 핵심 검색 로직입니다. 이 로직은 세 단계로 작동합니다:</p>
<p><strong>쿼리를</strong> 여러 토큰 벡터로 인코딩합니다.</p>
<p>각 토큰 벡터의 가장 가까운 패치를 위해<strong>Milvus를 검색합니다</strong>.</p>
<p>MaxSim을 사용하여<strong>페이지별로 집계</strong>: 각 쿼리 토큰에 대해 각 페이지에서 가장 높은 점수를 받은 패치를 가져온 다음 모든 토큰에 대해 해당 점수를 합산합니다. 총 점수가 가장 높은 페이지가 가장 잘 일치하는 페이지입니다.</p>
<p><strong>MaxSim의 작동 방식:</strong> 각 쿼리 토큰 벡터에 대해 내부 곱이 가장 높은 문서 패치(MaxSim의 "최대")를 찾습니다. 그런 다음 모든 쿼리 토큰에서 이러한 최대 점수를 합산하여 페이지당 총 관련성 점수를 얻습니다. 점수가 높을수록 쿼리와 페이지의 시각적 콘텐츠 간의 의미론적 일치가 더 강합니다.</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;What is the difference between Milvus and Zilliz Cloud?&quot;</span>

<span class="hljs-comment"># 1. Encode the query</span>
<span class="hljs-keyword">with</span> torch.no_grad():
    query_inputs = emb_processor.process_queries([question]).to(emb_model.device)
    query_vecs = emb_model(**query_inputs)[<span class="hljs-number">0</span>].cpu().<span class="hljs-built_in">float</span>().numpy()
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Query encoded: <span class="hljs-subst">{query_vecs.shape[<span class="hljs-number">0</span>]}</span> token vectors&quot;</span>)

<span class="hljs-comment"># 2. Search Milvus for each query token vector</span>
doc_patch_scores = {}
<span class="hljs-keyword">for</span> qv <span class="hljs-keyword">in</span> query_vecs:
    hits = milvus_client.search(
        COLLECTION, data=[qv.tolist()], limit=CANDIDATE_PATCHES,
        output_fields=[<span class="hljs-string">&quot;doc_id&quot;</span>, <span class="hljs-string">&quot;patch_idx&quot;</span>],
        search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>},
    )[<span class="hljs-number">0</span>]
    <span class="hljs-keyword">for</span> h <span class="hljs-keyword">in</span> hits:
        did = h[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;doc_id&quot;</span>]
        pid = h[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;patch_idx&quot;</span>]
        score = h[<span class="hljs-string">&quot;distance&quot;</span>]
        doc_patch_scores.setdefault(did, {})[pid] = <span class="hljs-built_in">max</span>(
            doc_patch_scores.get(did, {}).get(pid, <span class="hljs-number">0</span>), score
        )

<span class="hljs-comment"># 3. MaxSim aggregation: total score per page = sum of all matched patch scores</span>
doc_scores = {d: <span class="hljs-built_in">sum</span>(ps.values()) <span class="hljs-keyword">for</span> d, ps <span class="hljs-keyword">in</span> doc_patch_scores.items()}
ranked = <span class="hljs-built_in">sorted</span>(doc_scores.items(), key=<span class="hljs-keyword">lambda</span> x: x[<span class="hljs-number">1</span>], reverse=<span class="hljs-literal">True</span>)[:TOP_K]
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Top-<span class="hljs-subst">{TOP_K}</span> retrieved pages: <span class="hljs-subst">{[(d, <span class="hljs-built_in">round</span>(s, <span class="hljs-number">2</span>)) <span class="hljs-keyword">for</span> d, s <span class="hljs-keyword">in</span> ranked]}</span>&quot;</span>)

<button class="copy-code-btn"></button></code></pre>
<p>출력:</p>
<pre><code translate="no">Query encoded: 24 token vectors
Top-3 retrieved pages: [(16, 161.16), (12, 135.73), (7, 122.58)]
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-comment"># Display the retrieved pages</span>
context_images = [images[d] <span class="hljs-keyword">for</span> d, _ <span class="hljs-keyword">in</span> ranked <span class="hljs-keyword">if</span> d &lt; <span class="hljs-built_in">len</span>(images)]
<span class="hljs-keyword">for</span> i, img <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(context_images):
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;--- Retrieved page <span class="hljs-subst">{ranked[i][<span class="hljs-number">0</span>]}</span> (score: <span class="hljs-subst">{ranked[i][<span class="hljs-number">1</span>]:<span class="hljs-number">.2</span>f}</span>) ---&quot;</span>)
    display(img.resize((<span class="hljs-number">500</span>, <span class="hljs-built_in">int</span>(<span class="hljs-number">500</span> * img.height / img.width))))
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Col_Qwen2_Milvus_Qwen3_5397_BA_17_B_6_2842a54af8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-7-Generate-an-Answer-with-the-Multimodal-LLM" class="common-anchor-header">7단계: 멀티모달 LLM으로 답변 생성하기</h3><p>추출된 텍스트가 아닌 검색된 페이지 이미지를 사용자의 질문과 함께 Qwen3.5로 보냅니다. LLM이 이미지를 직접 읽어서 답변을 생성합니다.</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">image_to_uri</span>(<span class="hljs-params">img</span>):
    <span class="hljs-string">&quot;&quot;&quot;Convert an image to a base64 data URI for sending to the LLM.&quot;&quot;&quot;</span>
    img = img.copy()
    w, h = img.size
    <span class="hljs-keyword">if</span> <span class="hljs-built_in">max</span>(w, h) &gt; <span class="hljs-number">1600</span>:
        r = <span class="hljs-number">1600</span> / <span class="hljs-built_in">max</span>(w, h)
        img = img.resize((<span class="hljs-built_in">int</span>(w * r), <span class="hljs-built_in">int</span>(h * r)), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, <span class="hljs-built_in">format</span>=<span class="hljs-string">&quot;PNG&quot;</span>)
    <span class="hljs-keyword">return</span> <span class="hljs-string">f&quot;data:image/png;base64,<span class="hljs-subst">{base64.b64encode(buf.getvalue()).decode()}</span>&quot;</span>

<span class="hljs-comment"># Build the multimodal prompt</span>
context_images = [images[d] <span class="hljs-keyword">for</span> d, _ <span class="hljs-keyword">in</span> ranked <span class="hljs-keyword">if</span> d &lt; <span class="hljs-built_in">len</span>(images)]
content = [
    {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: {<span class="hljs-string">&quot;url&quot;</span>: image_to_uri(img)}}
    <span class="hljs-keyword">for</span> img <span class="hljs-keyword">in</span> context_images
]
content.append({
    <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>,
    <span class="hljs-string">&quot;text&quot;</span>: (
        <span class="hljs-string">f&quot;Above are <span class="hljs-subst">{<span class="hljs-built_in">len</span>(context_images)}</span> retrieved document pages.\n&quot;</span>
        <span class="hljs-string">f&quot;Read them carefully and answer the following question:\n\n&quot;</span>
        <span class="hljs-string">f&quot;Question: <span class="hljs-subst">{question}</span>\n\n&quot;</span>
        <span class="hljs-string">f&quot;Be concise and accurate. If the documents don&#x27;t contain &quot;</span>
        <span class="hljs-string">f&quot;relevant information, say so.&quot;</span>
    ),
})

<span class="hljs-comment"># Call the LLM</span>
llm = OpenAI(api_key=OPENROUTER_API_KEY, base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>)
response = llm.chat.completions.create(
    model=GENERATION_MODEL,
    messages=[{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: content}],
    max_tokens=<span class="hljs-number">1024</span>,
    temperature=<span class="hljs-number">0.7</span>,
)
answer = response.choices[<span class="hljs-number">0</span>].message.content.strip()
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Question: <span class="hljs-subst">{question}</span>\n&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Answer: <span class="hljs-subst">{answer}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>결과:<br>

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Col_Qwen2_Milvus_Qwen3_5397_BA_17_B_3_33fa5d551d.png" alt="" class="doc-image" id="" />
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
    </button></h2><p>이 튜토리얼에서는 PDF를 가져와서 각 페이지를 이미지로 변환하고, 해당 이미지를 ColQwen2로 멀티 벡터 패치 임베딩으로 인코딩하고, Milvus에 저장하고, MaxSim 점수를 사용하여 쿼리 시점에 가장 관련성이 높은 페이지를 검색하는 멀티모달 RAG 파이프라인을 구축했습니다. 텍스트를 추출하고 OCR이 레이아웃을 보존하기를 바라는 대신 파이프라인은 원본 페이지 이미지를 Qwen3.5로 전송하고, 이 파이프라인은 이를 시각적으로 읽고 답을 생성합니다.</p>
<p>이 튜토리얼은 프로덕션 배포가 아닌 시작 단계입니다. 더 진행하면서 염두에 두어야 할 몇 가지 사항이 있습니다.</p>
<p>장단점:</p>
<ul>
<li><strong>페이지 수에 따라 스토리지가 확장됩니다.</strong> 각 페이지는 약 755개의 벡터를 생성하므로, 1,000페이지의 말뭉치는 Milvus에서 약 755,000개의 행을 의미합니다. 여기서는 데모용으로 FLAT 인덱스가 사용되었지만, 대규모 컬렉션에는 IVF 또는 HNSW를 사용하는 것이 좋습니다.</li>
<li><strong>인코딩은 텍스트 임베딩보다 느립니다.</strong> ColQwen2는 4.4GB 비전 모델입니다. 이미지 인코딩은 텍스트 청크를 임베드하는 것보다 페이지당 더 오래 걸립니다. 한 번 실행되는 일괄 색인 작업의 경우 일반적으로 이 정도는 괜찮습니다. 실시간 수집의 경우 벤치마킹할 가치가 있습니다.</li>
<li><strong>이 접근 방식은 시각적으로 풍부한 문서에 가장 효과적입니다.</strong> PDF가 대부분 표나 그림이 없는 깔끔한 단일 열 텍스트인 경우, 기존의 텍스트 기반 RAG가 더 정확하게 검색하고 실행 비용도 적게 들 수 있습니다.</li>
</ul>
<p>다음에 시도할 작업</p>
<ul>
<li><strong>다른 멀티모달 LLM으로 교체하기.</strong> 이 튜토리얼에서는 OpenRouter를 통해 Qwen3.5를 사용하지만 검색 파이프라인은 모델에 구애받지 않습니다. 생성 단계를 GPT-4o, Gemini 또는 이미지 입력을 허용하는 모든 멀티모달 모델을 가리킬 수 있습니다.</li>
<li><strong> <a href="http://milvus.io">Milvus</a> 확장.</strong> Milvus Lite는 로컬 파일로 실행되므로 프로토타이핑에 적합합니다. 프로덕션 워크로드의 경우, 도커/쿠버네티스 또는 질리즈 클라우드(완전 관리형 Milvus)의 Milvus는 인프라 관리 없이 대규모 코퍼스를 처리할 수 있습니다.</li>
<li><strong>다양한 문서 유형으로 실험해 보세요.</strong> 여기서는 비교 PDF를 사용하지만, 스캔한 계약서, 엔지니어링 도면, 재무제표 또는 수치가 밀집된 연구 논문에서도 동일한 방식으로 작동합니다.</li>
</ul>
<p>시작하려면 pip install pymilvus로 <a href="https://github.com/milvus-io/milvus-lite">Milvus Lite를</a> 설치하고 HuggingFace에서 ColQwen2 가중치를 받으면 됩니다.</p>
<p>질문이 있거나 자신이 만든 것을 자랑하고 싶으신가요? <a href="https://milvus.io/slack">밀버스 슬랙은</a> 커뮤니티와 팀으로부터 도움을 받을 수 있는 가장 빠른 방법입니다. 일대일 대화를 원하신다면 <a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour?uuid=4cb203e5-482a-47e0-90a6-7acc511d61f4">근무 시간에</a> 시간을 예약하실 수 있습니다.</p>
<h2 id="Keep-Reading" class="common-anchor-header">계속 읽기<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/debugging-rag-in-3d-with-projectgolem-and-milvus.md">RAG가 실패하는 이유를 알 수 있다면 어떨까요? Project_Golem과 Milvus로 3D에서 RAG 디버깅하기</a></p></li>
<li><p><a href="https://milvus.io/blog/is-rag-become-outdated-now-long-running-agents-like-claude-cowork-are-emerging.md">클로드 코워크와 같은 장기 실행 에이전트가 등장하면서 RAG는 구식이 되어가고 있을까요?</a></p></li>
<li><p><a href="https://milvus.io/blog/semantic-highlighting-model-for-rag-context-pruning-and-token-saving.md">RAG 컨텍스트 프루닝 및 토큰 저장을 위한 시맨틱 강조 표시 모델을 구축한 방법</a></p></li>
<li><p><a href="https://milvus.io/blog/ai-code-review-gets-better-when-models-debate-claude-vs-gemini-vs-codex-vs-qwen-vs-minimax.md">모델이 토론할 때 AI 코드 리뷰가 더 좋아집니다: 클로드와 제미니, 코덱스와 큐웬, 미니맥스 비교하기</a></p></li>
</ul>
