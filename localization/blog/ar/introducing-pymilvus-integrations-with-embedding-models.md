---
id: introducing-pymilvus-integrations-with-embedding-models.md
title: تقديم تكامل PyMilvus مع نماذج التضمين
author: Stephen Batifol
date: 2024-06-05T00:00:00.000Z
cover: assets.zilliz.com/Getting_started_with_Milvus_cluster_and_K8s_1_34b2c81802.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  GenAI developers, Retrieval Augmented Generation, RAG
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/introducing-pymilvus-integrations-with-embedding-models.md
---
<p><a href="https://milvus.io/intro">Milvus</a> هي قاعدة بيانات متجهة مفتوحة المصدر مصممة خصيصًا لتطبيقات الذكاء الاصطناعي. سواء كنت تعمل على التعلم الآلي، أو التعلم العميق، أو أي مشروع آخر متعلق بالذكاء الاصطناعي، فإن Milvus يوفر طريقة قوية وفعالة للتعامل مع البيانات المتجهة واسعة النطاق.</p>
<p>والآن، مع <a href="https://milvus.io/docs/embeddings.md">تكامل وحدة النموذج</a> في PyMilvus، وهي مجموعة أدوات تطوير البرمجيات Python SDK لـ Milvus، أصبح من الأسهل إضافة نماذج التضمين وإعادة التصنيف. يعمل هذا التكامل على تبسيط تحويل بياناتك إلى متجهات قابلة للبحث أو إعادة ترتيب النتائج للحصول على نتائج أكثر دقة، كما هو الحال في <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">التوليد المعزز للاسترجاع (RAG)</a>.</p>
<p>في هذه المدونة، سنستعرض نماذج التضمين الكثيف ونماذج التضمين المتناثرة، ونماذج إعادة التصنيف، وسنوضح كيفية استخدامها عمليًا باستخدام <a href="https://milvus.io/blog/introducing-milvus-lite.md">Milvus Lite،</a> وهو إصدار خفيف الوزن من Milvus يمكن تشغيله محليًا في تطبيقات Python الخاصة بك.</p>
<h2 id="Dense-vs-Sparse-Embeddings" class="common-anchor-header">التضمينات الكثيفة مقابل التضمينات المتفرقة<button data-href="#Dense-vs-Sparse-Embeddings" class="anchor-icon" translate="no">
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
    </button></h2><p>قبل أن نطلعك على كيفية استخدام عمليات التكامل الخاصة بنا، دعنا نلقي نظرة على فئتين رئيسيتين من التضمينات المتجهة.</p>
<p>تنقسم<a href="https://zilliz.com/glossary/vector-embeddings">تضمينات المتجهات</a> عمومًا إلى فئتين رئيسيتين: <a href="https://zilliz.com/learn/sparse-and-dense-embeddings"><strong>التضمينات الكثيفة</strong> والتضمينات <strong>المتفرقة</strong></a>.</p>
<ul>
<li><p>التضمينات الكثيفة هي متجهات عالية الأبعاد تكون فيها معظم العناصر أو كلها غير صفرية، مما يجعلها مثالية لترميز دلالات النص أو المعنى الضبابي.</p></li>
<li><p>أما التضمينات المتفرقة فهي متجهات عالية الأبعاد تحتوي على العديد من العناصر الصفرية، وهي مناسبة بشكل أفضل لترميز المفاهيم الدقيقة أو المتجاورة.</p></li>
</ul>
<p>يدعم Milvus كلا النوعين من التضمينات ويوفر بحثًا هجينًا. يتيح لك <a href="https://zilliz.com/blog/hybrid-search-with-milvus">البحث الهجين</a> إجراء عمليات بحث عبر حقول متجهات مختلفة ضمن نفس المجموعة. يمكن أن تمثل هذه المتجهات أوجهًا مختلفة من البيانات، أو استخدام نماذج تضمين متنوعة، أو استخدام طرق معالجة بيانات مختلفة، ودمج النتائج باستخدام أدوات إعادة الترتيب.</p>
<h2 id="How-to-Use-Our-Embedding-and-Reranking-Integrations" class="common-anchor-header">كيفية استخدام تكاملات التضمين وإعادة التصنيف الخاصة بنا<button data-href="#How-to-Use-Our-Embedding-and-Reranking-Integrations" class="anchor-icon" translate="no">
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
    </button></h2><p>في الأقسام التالية، سنشرح ثلاثة أمثلة عملية لاستخدام عمليات التكامل الخاصة بنا لتوليد التضمينات وإجراء عمليات البحث عن المتجهات.</p>
<h3 id="Example-1-Use-the-Default-Embedding-Function-to-Generate-Dense-Vectors" class="common-anchor-header">مثال 1: استخدام وظيفة التضمين الافتراضية لتوليد متجهات كثيفة</h3><p>يجب عليك تثبيت العميل <code translate="no">pymilvus</code> مع الحزمة <code translate="no">model</code> لاستخدام وظائف التضمين وإعادة الترتيب مع ميلفوس.</p>
<pre><code translate="no">pip install <span class="hljs-string">&quot;pymilvus[model]&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>ستعمل هذه الخطوة على تثبيت Milvus <a href="https://milvus.io/docs/quickstart.md">Lite،</a> مما يسمح لك بتشغيل Milvus محليًا داخل تطبيق Python الخاص بك. تتضمن أيضًا الحزمة الفرعية للنموذج، والتي تتضمن جميع الأدوات المساعدة للتضمين وإعادة الترتيب.</p>
<p>تدعم الحزمة الفرعية للنموذج نماذج التضمين المختلفة، بما في ذلك نماذج OpenAI، و <a href="https://zilliz.com/learn/Sentence-Transformers-for-Long-Form-Text">Sentence Transformers،</a> و <a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings">BGE-M3،</a> و BM25، و <a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings">SPLADE،</a> ونماذج Jina AI المدربة مسبقًا.</p>
<p>يستخدم هذا المثال <code translate="no">DefaultEmbeddingFunction</code> ، استنادًا إلى نموذج <code translate="no">all-MiniLM-L6-v2</code> Sentence Transformer Sentence Transformer للتبسيط. يبلغ حجم النموذج حوالي 70 ميغابايت وسيتم تنزيله أثناء الاستخدام الأول:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model

<span class="hljs-comment"># This will download &quot;all-MiniLM-L6-v2&quot;, a lightweight model.</span>
ef = model.DefaultEmbeddingFunction()

<span class="hljs-comment"># Data from which embeddings are to be generated</span>
docs = [
   <span class="hljs-string">&quot;Artificial intelligence was founded as an academic discipline in 1956.&quot;</span>,
   <span class="hljs-string">&quot;Alan Turing was the first person to conduct substantial research in AI.&quot;</span>,
   <span class="hljs-string">&quot;Born in Maida Vale, London, Turing was raised in southern England.&quot;</span>,
]

embeddings = ef.encode_documents(docs)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Embeddings:&quot;</span>, embeddings)
<span class="hljs-comment"># Print dimension and shape of embeddings</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Dim:&quot;</span>, ef.dim, embeddings[<span class="hljs-number">0</span>].shape)
<button class="copy-code-btn"></button></code></pre>
<p>يجب أن تكون المخرجات المتوقعة مثل ما يلي:</p>
<pre><code translate="no">Embeddings: [array([<span class="hljs-number">-3.09392996e-02</span>, <span class="hljs-number">-1.80662833e-02</span>,  <span class="hljs-number">1.34775648e-02</span>,  <span class="hljs-number">2.77156215e-02</span>,
      <span class="hljs-number">-4.86349640e-03</span>, <span class="hljs-number">-3.12581174e-02</span>, <span class="hljs-number">-3.55921760e-02</span>,  <span class="hljs-number">5.76934684e-03</span>,
       <span class="hljs-number">2.80773244e-03</span>,  <span class="hljs-number">1.35783911e-01</span>,  <span class="hljs-number">3.59678417e-02</span>,  <span class="hljs-number">6.17732145e-02</span>,
...
      <span class="hljs-number">-4.61330153e-02</span>, <span class="hljs-number">-4.85207550e-02</span>,  <span class="hljs-number">3.13997865e-02</span>,  <span class="hljs-number">7.82178566e-02</span>,
      <span class="hljs-number">-4.75336798e-02</span>,  <span class="hljs-number">5.21207601e-02</span>,  <span class="hljs-number">9.04406682e-02</span>, <span class="hljs-number">-5.36676683e-02</span>],
     dtype=<span class="hljs-type">float32</span>)]
Dim: <span class="hljs-number">384</span> (<span class="hljs-number">384</span>,)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Example-2-Generate-Sparse-Vectors-Using-The-BM25-Model" class="common-anchor-header">مثال 2: توليد متجهات متفرقة باستخدام نموذج BM25</h3><p>BM25 هي طريقة معروفة تستخدم ترددات تكرار الكلمات لتحديد العلاقة بين الاستعلامات والمستندات. في هذا المثال، سنوضح في هذا المثال كيفية استخدام <code translate="no">BM25EmbeddingFunction</code> لتوليد تضمينات متفرقة للاستعلامات والمستندات.</p>
<p>في BM25، من المهم حساب الإحصائيات في مستنداتك للحصول على IDF (التردد العكسي للمستند)، والذي يمكن أن يمثل الأنماط في مستنداتك. يقيس IDF مقدار المعلومات التي توفرها الكلمة، سواء كانت شائعة أو نادرة في جميع المستندات.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus.model.sparse <span class="hljs-keyword">import</span> BM25EmbeddingFunction

<span class="hljs-comment"># 1. Prepare a small corpus to search</span>
docs = [
   <span class="hljs-string">&quot;Artificial intelligence was founded as an academic discipline in 1956.&quot;</span>,
   <span class="hljs-string">&quot;Alan Turing was the first person to conduct substantial research in AI.&quot;</span>,
   <span class="hljs-string">&quot;Born in Maida Vale, London, Turing was raised in southern England.&quot;</span>,
]
query = <span class="hljs-string">&quot;Where was Turing born?&quot;</span>
bm25_ef = BM25EmbeddingFunction()

<span class="hljs-comment"># 2. Fit the corpus to get BM25 model parameters on your documents.</span>
bm25_ef.fit(docs)

<span class="hljs-comment"># 3. Store the fitted parameters to expedite future processing.</span>
bm25_ef.save(<span class="hljs-string">&quot;bm25_params.json&quot;</span>)

<span class="hljs-comment"># 4. Load the saved params</span>
new_bm25_ef = BM25EmbeddingFunction()
new_bm25_ef.load(<span class="hljs-string">&quot;bm25_params.json&quot;</span>)

docs_embeddings = new_bm25_ef.encode_documents(docs)
query_embeddings = new_bm25_ef.encode_queries([query])
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Dim:&quot;</span>, new_bm25_ef.dim, <span class="hljs-built_in">list</span>(docs_embeddings)[<span class="hljs-number">0</span>].shape)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Example-3-Using-a-ReRanker" class="common-anchor-header">مثال 3: استخدام أداة إعادة التصنيف</h3><p>يهدف نظام البحث إلى العثور على النتائج الأكثر صلة بسرعة وكفاءة. تقليديًا، تم استخدام طرق مثل BM25 أو TF-IDF لترتيب نتائج البحث بناءً على مطابقة الكلمات الرئيسية. تعتبر الأساليب الحديثة، مثل تشابه جيب التمام القائم على التضمين، مباشرة ولكنها قد تغفل في بعض الأحيان عن التفاصيل الدقيقة للغة، والأهم من ذلك، التفاعل بين المستندات ومقصد الاستعلام.</p>
<p>هذا هو المكان الذي يساعد فيه استخدام أداة <a href="https://zilliz.com/learn/optimize-rag-with-rerankers-the-role-and-tradeoffs">إعادة التصنيف</a>. أداة إعادة التصنيف هي نموذج متقدم للذكاء الاصطناعي يأخذ مجموعة النتائج الأولية من البحث - غالبًا ما يتم توفيرها من خلال بحث قائم على التضمينات/الرموز - ويعيد تقييمها للتأكد من أنها تتوافق بشكل أوثق مع قصد المستخدم. فهو ينظر إلى ما هو أبعد من المطابقة السطحية للمصطلحات للنظر في التفاعل الأعمق بين استعلام البحث ومحتوى المستندات.</p>
<p>في هذا المثال، سوف نستخدم <a href="https://milvus.io/docs/integrate_with_jina.md">أداة إعادة التصنيف بالذكاء الاصطناعي "جينا"</a>.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus.model.reranker <span class="hljs-keyword">import</span> JinaRerankFunction

jina_api_key = <span class="hljs-string">&quot;&lt;YOUR_JINA_API_KEY&gt;&quot;</span>

rf = JinaRerankFunction(<span class="hljs-string">&quot;jina-reranker-v1-base-en&quot;</span>, jina_api_key)

query = <span class="hljs-string">&quot;What event in 1956 marked the official birth of artificial intelligence as a discipline?&quot;</span>

documents = [
   <span class="hljs-string">&quot;In 1950, Alan Turing published his seminal paper, &#x27;Computing Machinery and Intelligence,&#x27; proposing the Turing Test as a criterion of intelligence, a foundational concept in the philosophy and development of artificial intelligence.&quot;</span>,
   <span class="hljs-string">&quot;The Dartmouth Conference in 1956 is considered the birthplace of artificial intelligence as a field; here, John McCarthy and others coined the term &#x27;artificial intelligence&#x27; and laid out its basic goals.&quot;</span>,
   <span class="hljs-string">&quot;In 1951, British mathematician and computer scientist Alan Turing also developed the first program designed to play chess, demonstrating an early example of AI in game strategy.&quot;</span>,
   <span class="hljs-string">&quot;The invention of the Logic Theorist by Allen Newell, Herbert A. Simon, and Cliff Shaw in 1955 marked the creation of the first true AI program, which was capable of solving logic problems, akin to proving mathematical theorems.&quot;</span>
]

results = rf(query, documents)

<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results:
   <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Index: <span class="hljs-subst">{result.index}</span>&quot;</span>)
   <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Score: <span class="hljs-subst">{result.score:<span class="hljs-number">.6</span>f}</span>&quot;</span>)
   <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Text: <span class="hljs-subst">{result.text}</span>\n&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>الناتج المتوقع مشابه لما يلي:</p>
<pre><code translate="no">Index: <span class="hljs-number">1</span>
Score: <span class="hljs-number">0.937096</span>
Text: The Dartmouth Conference <span class="hljs-keyword">in</span> <span class="hljs-number">1956</span> <span class="hljs-keyword">is</span> considered the birthplace of artificial intelligence <span class="hljs-keyword">as</span> a field; here, John McCarthy <span class="hljs-keyword">and</span> others coined the term <span class="hljs-string">&#x27;artificial intelligence&#x27;</span> <span class="hljs-keyword">and</span> laid <span class="hljs-keyword">out</span> its basic goals.

Index: <span class="hljs-number">3</span>
Score: <span class="hljs-number">0.354210</span>
Text: The invention of the Logic Theorist <span class="hljs-keyword">by</span> Allen Newell, Herbert A. Simon, <span class="hljs-keyword">and</span> Cliff Shaw <span class="hljs-keyword">in</span> <span class="hljs-number">1955</span> marked the creation of the first <span class="hljs-literal">true</span> AI program, which was capable of solving logic problems, akin to proving mathematical theorems.

Index: <span class="hljs-number">0</span>
Score: <span class="hljs-number">0.349866</span>
Text: In <span class="hljs-number">1950</span>, Alan Turing published his seminal paper, <span class="hljs-string">&#x27;Computing Machinery and Intelligence,&#x27;</span> proposing the Turing Test <span class="hljs-keyword">as</span> a criterion of intelligence, a foundational concept <span class="hljs-keyword">in</span> the philosophy <span class="hljs-keyword">and</span> development of artificial intelligence.

Index: <span class="hljs-number">2</span>
Score: <span class="hljs-number">0.272896</span>
Text: In <span class="hljs-number">1951</span>, British mathematician <span class="hljs-keyword">and</span> computer scientist Alan Turing also developed the first program designed to play chess, demonstrating an early example of AI <span class="hljs-keyword">in</span> game strategy.
<button class="copy-code-btn"></button></code></pre>
<h2 id="Star-Us-On-GitHub-and-Join-Our-Discord" class="common-anchor-header">ضع نجمة لنا على GitHub وانضم إلى خلافنا!<button data-href="#Star-Us-On-GitHub-and-Join-Our-Discord" class="anchor-icon" translate="no">
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
    </button></h2><p>إذا أعجبك هذا المنشور في المدونة، ففكر في وضع نجمة ميلفوس على <a href="https://github.com/milvus-io/milvus">GitHub،</a> ولا تتردد في الانضمام إلى <a href="https://discord.gg/FG6hMJStWu">خلافنا</a>! 💙</p>
