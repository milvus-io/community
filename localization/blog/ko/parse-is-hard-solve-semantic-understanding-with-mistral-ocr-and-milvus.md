---
id: parse-is-hard-solve-semantic-understanding-with-mistral-ocr-and-milvus.md
title: '구문 분석은 어렵다: 미스트랄 OCR과 밀버스로 의미 이해 문제 해결하기'
author: Stephen Batifol
date: 2025-04-03T00:00:00.000Z
desc: >-
  미스트랄 OCR과 밀버스 벡터 DB의 강력한 조합을 사용하여 문제를 정면으로 해결하고, 검색 가능하고 의미론적으로 의미 있는 벡터 임베딩을
  통해 문서 파싱의 악몽을 평온한 꿈으로 바꿔보세요.
cover: >-
  assets.zilliz.com/Parsing_is_Hard_Solving_Semantic_Understanding_with_Mistral_OCR_and_Milvus_316ac013b6.png
tag: Engineering
canonicalUrl: >-
  https://milvus.io/blog/parse-is-hard-solve-semantic-understanding-with-mistral-ocr-and-milvus.md
---
<p>현실을 직시하세요: 문서 구문 분석은 정말 어렵습니다. PDF, 이미지, 보고서, 표, 지저분한 손글씨 등에는 사용자가 검색하고자 하는 귀중한 정보가 가득하지만, 그 정보를 추출하여 검색 색인에 정확하게 표현하는 것은 마치 퍼즐을 푸는 것과 같습니다. 코드 한 줄로 문제를 해결했다고 생각했는데 내일 새로운 문서가 들어와서 또 다른 구석에 처리해야 하는 경우가 생길 수 있습니다.</p>
<p>이 글에서는 Mistral OCR과 Milvus Vector DB의 강력한 조합을 사용하여 이 문제를 정면으로 해결하고, 검색 가능하고 의미론적으로 의미 있는 벡터 임베딩을 통해 문서 구문 분석의 악몽을 평온한 꿈으로 바꾸어 보겠습니다.</p>
<h2 id="Why-Rule-based-Parsing-Just-Wont-Cut-It" class="common-anchor-header">규칙 기반 구문 분석으로 해결되지 않는 이유<button data-href="#Why-Rule-based-Parsing-Just-Wont-Cut-It" class="anchor-icon" translate="no">
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
    </button></h2><p>표준 OCR 도구로 어려움을 겪어본 적이 있다면 여러 가지 문제가 있다는 것을 알고 있을 것입니다:</p>
<ul>
<li><strong>복잡한 레이아웃</strong>: 표, 목록, 다중 열 형식은 대부분의 구문 분석기에 문제를 일으킬 수 있습니다.</li>
<li><strong>의미적 모호성</strong>: 키워드만으로는 '사과'가 과일을 의미하는 것인지 회사를 의미하는 것인지 알 수 없습니다.</li>
<li>규모와 비용의 문제: 수천 개의 문서를 처리하는 것은 고통스러울 정도로 느려집니다.</li>
</ul>
<p>단순히 텍스트를 추출하는 것이 아니라 콘텐츠를 <em>이해하는</em> 더 스마트하고 체계적인 접근 방식이 필요합니다. 이것이 바로 Mistral OCR과 Milvus가 필요한 이유입니다.</p>
<h2 id="Meet-Your-Dream-Team" class="common-anchor-header">드림팀 만나보기<button data-href="#Meet-Your-Dream-Team" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Mistral-OCR-More-than-just-text-extraction" class="common-anchor-header">Mistral OCR: 단순한 텍스트 추출 그 이상</h3><p>Mistral OCR은 일반적인 OCR 툴이 아닙니다. 다양한 문서를 처리할 수 있도록 설계되었습니다.</p>
<ul>
<li><strong>복잡한 문서에 대한 깊은 이해</strong>: 포함된 이미지, 수학 방정식, 표 등 모든 것을 매우 높은 정확도로 이해할 수 있습니다.</li>
<li><strong>원본 레이아웃 유지:</strong> 문서의 다양한 레이아웃을 이해할 뿐만 아니라 원본 레이아웃과 구조를 그대로 유지합니다. 또한 여러 페이지로 구성된 문서도 구문 분석할 수 있습니다.</li>
<li><strong>다국어 및 멀티모달 숙달</strong>: 영어부터 힌디어, 아랍어에 이르기까지 수천 개의 언어와 스크립트로 작성된 문서를 이해할 수 있어 전 세계 사용자층을 대상으로 하는 애플리케이션에 매우 유용합니다.</li>
</ul>
<h3 id="Milvus-Your-Vector-Database-Built-for-Scale" class="common-anchor-header">Milvus: 규모에 맞게 구축된 벡터 데이터베이스</h3><ul>
<li><strong>수십억 개 이상의 규모</strong>: <a href="https://milvus.io/">Milvus는</a> 수십억 개의 벡터로 확장할 수 있어 대규모 문서 저장에 적합합니다.</li>
<li><strong>전체 텍스트 검색: 밀도 높은 벡터 임베딩을 지원할 뿐 아니라</strong>, Milvus는 전체 텍스트 검색도 지원합니다. 텍스트를 사용해 쿼리를 쉽게 실행하고 RAG 시스템에서 더 나은 결과를 얻을 수 있습니다.</li>
</ul>
<h2 id="Examples" class="common-anchor-header">예시:<button data-href="#Examples" class="anchor-icon" translate="no">
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
    </button></h2><p>예를 들어 영어로 된 이 손글씨 메모를 살펴봅시다. 일반 OCR 도구를 사용해 이 텍스트를 추출하려면 매우 어려운 작업이 될 것입니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/A_handwritten_note_in_English_3bbc40dee7.png" alt="A handwritten note in English " class="doc-image" id="a-handwritten-note-in-english-" />
   </span> <span class="img-wrapper"> <span>영어로 된 손글씨 메모 </span> </span></p>
<p>Mistral OCR로 처리합니다.</p>
<pre><code translate="no" class="language-python">api_key = os.getenv(<span class="hljs-string">&quot;MISTRAL_API_KEY&quot;</span>)
client = Mistral(api_key=api_key)

url = <span class="hljs-string">&quot;https://preview.redd.it/ocr-for-handwritten-documents-v0-os036yiv9xod1.png?width=640&amp;format=png&amp;auto=webp&amp;s=29461b68383534a3c1bf76cc9e36a2ba4de13c86&quot;</span>
result = client.ocr.process(
                model=ocr_model, document={<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: url}
            )
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Result: <span class="hljs-subst">{result.pages[<span class="hljs-number">0</span>].markdown}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>다음과 같은 결과물을 얻을 수 있습니다. 손글씨 텍스트를 잘 인식할 수 있습니다. &quot;강제적이고 자연스럽지 않은&quot;이라는 단어의 대문자 형식도 유지되는 것을 볼 수 있습니다!</p>
<pre><code translate="no" class="language-Markdown">Today is Thursday, October 20th - But it definitely feels like a Friday. I<span class="hljs-string">&#x27;m already considering making a second cup of coffee - and I haven&#x27;</span>t even finished my first. Do I have a problem?
Sometimes I<span class="hljs-string">&#x27;ll fly through older notes I&#x27;</span>ve taken, and my handwriting is unrecamptable. Perhaps it depends on the <span class="hljs-built_in">type</span> of pen I use. I<span class="hljs-string">&#x27;ve tried writing in all cups but it looks so FORCED AND UNNATURAL.
Often times, I&#x27;</span>ll just take notes on my lapten, but I still seem to ermittelt forward pen and paper. Any advice on what to
improve? I already feel stressed at looking back at what I<span class="hljs-string">&#x27;ve just written - it looks like I different people wrote this!
</span><button class="copy-code-btn"></button></code></pre>
<p>이제 이 텍스트를 Milvus에 삽입하여 시맨틱 검색을 할 수 있습니다.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient 

COLLECTION_NAME = <span class="hljs-string">&quot;document_ocr&quot;</span>

milvus_client = MilvusClient(uri=<span class="hljs-string">&#x27;http://localhost:19530&#x27;</span>)
<span class="hljs-string">&quot;&quot;&quot;
This is where you would define the index, create a collection etc. For the sake of this example. I am skipping it. 

schema = CollectionSchema(...)

milvus_client.create_collection(
    collection_name=COLLECTION_NAME,
    schema=schema,
    )

&quot;&quot;&quot;</span>

milvus_client.insert(collection_name=COLLECTION_NAME, data=[result.pages[<span class="hljs-number">0</span>].markdown])
<button class="copy-code-btn"></button></code></pre>
<p>예를 들어 일부 항목 이름이 영어로 결합된 이 독일어 송장을 살펴보겠습니다. 미스트랄은 다른 언어 또는 더 복잡한 형식의 문서도 이해할 수 있습니다.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/An_Invoice_in_German_994e204d49.png" alt="An Invoice in German" class="doc-image" id="an-invoice-in-german" />
   </span> <span class="img-wrapper"> <span>독일어로 된 송장</span> </span></p>
<p>Mistral OCR은 모든 정보를 추출할 수 있으며 스캔한 이미지에서 표를 나타내는 마크다운 표 구조까지 생성합니다.</p>
<pre><code translate="no"><span class="hljs-title class_">Rechnungsadresse</span>:

Jähn <span class="hljs-title class_">Jessel</span> <span class="hljs-title class_">GmbH</span> a. <span class="hljs-title class_">Co</span>. <span class="hljs-variable constant_">KG</span> <span class="hljs-title class_">Marianne</span> <span class="hljs-title class_">Scheibe</span> <span class="hljs-title class_">Karla</span>-Löffler-<span class="hljs-title class_">Weg</span> <span class="hljs-number">2</span> <span class="hljs-number">66522</span> <span class="hljs-title class_">Wismar</span>

<span class="hljs-title class_">Lieferadresse</span>:

Jähn <span class="hljs-title class_">Jessel</span> <span class="hljs-title class_">GmbH</span> a. <span class="hljs-title class_">Co</span>. <span class="hljs-variable constant_">KG</span> <span class="hljs-title class_">Marianne</span> <span class="hljs-title class_">Scheibe</span> <span class="hljs-title class_">Karla</span>-Löffler-<span class="hljs-title class_">Weg</span> <span class="hljs-number">2</span> <span class="hljs-number">66522</span> <span class="hljs-title class_">Wismar</span>

<span class="hljs-title class_">Rechnungsinformationen</span>:

<span class="hljs-title class_">Bestelldatum</span>: <span class="hljs-number">2004</span>-<span class="hljs-number">10</span>-<span class="hljs-number">20</span>
<span class="hljs-title class_">Bezahit</span>: <span class="hljs-title class_">Ja</span>
<span class="hljs-title class_">Expressversand</span>: <span class="hljs-title class_">Nein</span>
<span class="hljs-title class_">Rechnungsnummer</span>: <span class="hljs-number">4652</span>

<span class="hljs-title class_">Rechnungs</span>übersicht

| <span class="hljs-title class_">Pos</span>. | <span class="hljs-title class_">Produkt</span> | <span class="hljs-title class_">Preis</span> &lt;br&gt; (<span class="hljs-title class_">Netto</span>) | <span class="hljs-title class_">Menge</span> | <span class="hljs-title class_">Steuersatz</span> | <span class="hljs-title class_">Summe</span> &lt;br&gt; <span class="hljs-title class_">Brutto</span> |
| :--: | :--: | :--: | :--: | :--: | :--: |
| <span class="hljs-number">1</span> | <span class="hljs-title class_">Grundig</span> <span class="hljs-variable constant_">CH</span> 7280w <span class="hljs-title class_">Multi</span>-<span class="hljs-title class_">Zerkleinerer</span> (<span class="hljs-title class_">Gourmet</span>, <span class="hljs-number">400</span> <span class="hljs-title class_">Watt</span>, <span class="hljs-number">11</span> <span class="hljs-title class_">Glasbeh</span>älter), weiß | <span class="hljs-number">183.49</span> C | <span class="hljs-number">2</span> | $0 \%$ | <span class="hljs-number">366.98</span> C |
| <span class="hljs-number">2</span> | <span class="hljs-title class_">Planet</span> K | <span class="hljs-number">349.9</span> C | <span class="hljs-number">2</span> | $19<span class="hljs-number">.0</span> \%$ | <span class="hljs-number">832.76</span> C |
| <span class="hljs-number">3</span> | <span class="hljs-title class_">The</span> <span class="hljs-title class_">Cabin</span> <span class="hljs-keyword">in</span> the <span class="hljs-title class_">Woods</span> (<span class="hljs-title class_">Blu</span>-ray) | <span class="hljs-number">159.1</span> C | <span class="hljs-number">2</span> | $7<span class="hljs-number">.0</span> \%$ | <span class="hljs-number">340.47</span> C |
| <span class="hljs-number">4</span> | <span class="hljs-title class_">Schenkung</span> auf <span class="hljs-title class_">Italienisch</span> <span class="hljs-title class_">Taschenbuch</span> - <span class="hljs-number">30.</span> | <span class="hljs-number">274.33</span> C | <span class="hljs-number">4</span> | $19<span class="hljs-number">.0</span> \%$ | <span class="hljs-number">1305.81</span> C |
| <span class="hljs-number">5</span> | <span class="hljs-title class_">Xbox</span> <span class="hljs-number">360</span> - <span class="hljs-title class_">Razer</span> 0N2A <span class="hljs-title class_">Controller</span> <span class="hljs-title class_">Tournament</span> <span class="hljs-title class_">Edition</span> | <span class="hljs-number">227.6</span> C | <span class="hljs-number">2</span> | $7<span class="hljs-number">.0</span> \%$ | <span class="hljs-number">487.06</span> C |
| <span class="hljs-number">6</span> | <span class="hljs-title class_">Philips</span> <span class="hljs-variable constant_">LED</span>-<span class="hljs-title class_">Lampe</span> ersetzt 25Watt <span class="hljs-variable constant_">E27</span> <span class="hljs-number">2700</span> <span class="hljs-title class_">Kelvin</span> - warm-weiß, <span class="hljs-number">2.7</span> <span class="hljs-title class_">Watt</span>, <span class="hljs-number">250</span> <span class="hljs-title class_">Lumen</span> <span class="hljs-title class_">IEnergieklasse</span> A++I | <span class="hljs-number">347.57</span> C | <span class="hljs-number">3</span> | $7<span class="hljs-number">.0</span> \%$ | <span class="hljs-number">1115.7</span> C |
| <span class="hljs-number">7</span> | <span class="hljs-title class_">Spannende</span> <span class="hljs-title class_">Abenteuer</span> <span class="hljs-title class_">Die</span> verschollene <span class="hljs-title class_">Grabkammer</span> | <span class="hljs-number">242.8</span> C | <span class="hljs-number">6</span> | $0 \%$ | <span class="hljs-number">1456.8</span> C |
| <span class="hljs-title class_">Zw</span>. summe |  | <span class="hljs-number">1784.79</span> C |  |  |  |
| <span class="hljs-title class_">Zzgl</span>. <span class="hljs-title class_">Mwst</span>. <span class="hljs-number">7</span>\% |  | <span class="hljs-number">51.4</span> C |  |  |  |
| <span class="hljs-title class_">Zzgl</span>. <span class="hljs-title class_">Mwst</span>. <span class="hljs-number">19</span>\% |  | <span class="hljs-number">118.6</span> C |  |  |  |
| <span class="hljs-title class_">Gesamtbetrag</span> C inkl. <span class="hljs-title class_">MwSt</span>. |  | <span class="hljs-number">1954.79</span> C |  |  |  |
<button class="copy-code-btn"></button></code></pre>
<h2 id="Real-World-Usage-A-Case-Study" class="common-anchor-header">실제 사용 사례: 사례 연구<button data-href="#Real-World-Usage-A-Case-Study" class="anchor-icon" translate="no">
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
    </button></h2><p>이제 Mistral OCR이 다양한 문서에서 작동할 수 있다는 것을 확인했으니, 소송 파일과 계약서가 넘쳐나는 법률 회사가 이 도구를 어떻게 활용하는지 상상해 볼 수 있습니다. 과거에는 법률 보조원이 특정 조항을 수동으로 스캔하거나 과거 사례를 비교하는 등 수없이 많은 시간이 걸렸던 작업을 이제 Mistral OCR과 Milvus로 RAG 시스템을 구현함으로써 단 몇 분 만에 AI가 처리할 수 있게 되었습니다.</p>
<h3 id="Next-Steps" class="common-anchor-header">다음 단계</h3><p>모든 콘텐츠를 추출할 준비가 되셨나요? <a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/integration/mistral_ocr_with_milvus.ipynb">GitHub의 노트북에서</a> 전체 예제를 살펴보고, <a href="http://zilliz.com/discord">Discord에</a> 참여하여 커뮤니티와 채팅하고, 지금 바로 빌드를 시작하세요! <a href="https://docs.mistral.ai/capabilities/document/">미스트랄의</a> OCR 모델에 대한 <a href="https://docs.mistral.ai/capabilities/document/">문서도</a> 확인하실 수 있습니다. </p>
<p>혼란스러운 구문 분석과 작별하고 지능적이고 확장 가능한 문서 이해와 인사하세요.</p>
