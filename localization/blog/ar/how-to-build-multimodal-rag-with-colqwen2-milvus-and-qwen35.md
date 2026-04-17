---
id: how-to-build-multimodal-rag-with-colqwen2-milvus-and-qwen35.md
title: كيفية بناء RAG متعدد الوسائط باستخدام ColQwen2 وMilvus وQwen3.5
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
  أنشئ خط أنابيب RAG متعدد الوسائط يسترجع صور صفحات PDF بدلاً من النص المستخرج،
  باستخدام ColQwen2 و Milvus و Qwen3.5. البرنامج التعليمي خطوة بخطوة.
origin: >-
  https://milvus.io/blog/how-to-build-multimodal-rag-with-colqwen2-milvus-and-qwen35.md
---
<p>في الوقت الحاضر، يمكنك تحميل ملف PDF إلى أي برنامج حديث من برامج LLM وطرح أسئلة حوله. بالنسبة لحفنة من المستندات، يعمل ذلك بشكل جيد. لكن معظم برامج LLMs تصل إلى بضع مئات من الصفحات، لذا فإن مجموعة كبيرة من المستندات لن تتسع ببساطة. وحتى عندما تكون مناسبة، فأنت تدفع مقابل معالجة كل صفحة في كل استعلام. اطرح مائة سؤال حول نفس مجموعة المستندات المكونة من 500 صفحة، وستدفع مقابل 500 صفحة مائة مرة. يصبح ذلك مكلفًا بسرعة.</p>
<p>يحل التوليد المعزز للاسترجاع (RAG) هذه المشكلة عن طريق فصل الفهرسة عن الإجابة. تقوم بتشفير مستنداتك مرة واحدة، وتخزين التمثيلات في قاعدة بيانات متجهة، وفي وقت الاستعلام تسترجع فقط الصفحات الأكثر صلة لإرسالها إلى نموذج التوليد المعزز للاسترجاع. يقوم النموذج بقراءة ثلاث صفحات لكل استعلام، وليس مجموعة مستنداتك بأكملها. وهذا يجعل من العملي بناء أسئلة وأجوبة المستندات على المجموعات التي تستمر في النمو.</p>
<p>يرشدك هذا البرنامج التعليمي خلال بناء خط أنابيب RAG متعدد الوسائط مع ثلاثة مكونات مرخصة بشكل مفتوح:</p>
<ul>
<li><strong><a href="https://huggingface.co/vidore/colqwen2-v1.0-merged">ColQwen2</a></strong> <a href="https://huggingface.co/vidore/colqwen2-v1.0-merged"></a>يقوم بترميز كل صفحة PDF كصورة إلى تضمينات متعددة المتجهات، مستبدلاً بذلك خطوة التعرف الضوئي على الحروف التقليدية وخطوة تقطيع النص.</li>
<li>يخزن<strong><a href="http://milvus.io">Milvus</a></strong> هذه المتجهات ويتعامل مع البحث عن التشابه في وقت الاستعلام، ويسترجع فقط الصفحات الأكثر صلة.</li>
<li>يقوم<strong><a href="https://qwen.ai/blog?id=qwen3.5">Qwen3.5-397B-A17B</a></strong> بقراءة صور الصفحات المسترجعة ويُنشئ إجابة بناءً على ما يراه.</li>
</ul>
<p>في النهاية، سيكون لديك نظام يعمل يأخذ ملف PDF وسؤالًا، ويجد الصفحات الأكثر صلة بالموضوع، ويعيد إجابة تستند إلى ما يراه النموذج.</p>
<h2 id="What-is-Multimodal-RAG" class="common-anchor-header">ما هو RAG متعدد الوسائط؟<button data-href="#What-is-Multimodal-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>غطت المقدمة سبب أهمية RAG على نطاق واسع. والسؤال التالي هو ما هو نوع RAG الذي تحتاجه، لأن النهج التقليدي لديه نقطة عمياء.</p>
<p>يستخرج RAG التقليدي النص من المستندات، ويضمنه في شكل متجهات، ويسترجع أقرب التطابقات في وقت الاستعلام، ويمرر تلك الأجزاء النصية إلى LLM. يعمل ذلك بشكل جيد مع المحتوى النصي الثقيل ذي التنسيق النظيف. ينقطع عندما تحتوي مستنداتك على</p>
<ul>
<li>جداول، حيث يعتمد المعنى على العلاقة بين الصفوف والأعمدة والعناوين.</li>
<li>المخططات والرسوم البيانية، حيث تكون المعلومات مرئية بالكامل وليس لها مكافئ نصي.</li>
<li>المستندات الممسوحة ضوئيًا أو الملاحظات المكتوبة بخط اليد، حيث يكون إخراج التعرف الضوئي على الحروف غير موثوق به أو غير مكتمل.</li>
</ul>
<p>يستبدل RAG متعدد الوسائط استخراج النصوص بترميز الصور. يمكنك عرض كل صفحة كصورة، وترميزها بنموذج لغة الرؤية، واسترجاع صور الصفحات في وقت الاستعلام. يرى LLM الصفحة الأصلية - الجداول والأشكال والتنسيق وكل شيء - ويجيب بناءً على ما يراه.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Col_Qwen2_Milvus_Qwen3_5397_BA_17_B_5_2f55d33896.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Structure-of-Multimodal-RAG-Pipeline-ColQwen2-for-Encoding-Milvus-for-Search-Qwen35-for-Generation" class="common-anchor-header">هيكل خط أنابيب RAG متعدد الوسائط: ColQwen2 للترميز، وMilvus للبحث، وQwen3.5 للتوليد<button data-href="#Structure-of-Multimodal-RAG-Pipeline-ColQwen2-for-Encoding-Milvus-for-Search-Qwen35-for-Generation" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="How-the-Pipeline-Works-httpsassetszillizcomblogColQwen2MilvusQwen35397BA17B284c822b9efpng" class="common-anchor-header">كيف يعمل خط الأنابيب  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Col_Qwen2_Milvus_Qwen3_5397_BA_17_B_2_84c822b9ef.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</h3><h3 id="Tech-Stack" class="common-anchor-header">المكدس التقني</h3><table>
<thead>
<tr><th><strong>المكوّنات</strong></th><th><strong>الاختيار</strong></th><th><strong>الدور</strong></th></tr>
</thead>
<tbody>
<tr><td>معالجة ملفات PDF</td><td>pdf2image + بوبلر</td><td>تنسخ صفحات PDF كصور عالية الدقة</td></tr>
<tr><td>نموذج التضمين</td><td><a href="https://huggingface.co/vidore/colqwen2-v1.0-merged">colqwen2-v1.0</a></td><td>نموذج لغة الرؤية؛ يرمز كل صفحة إلى حوالي 755 متجه رقعة 128 مليمترًا</td></tr>
<tr><td>قاعدة بيانات المتجهات</td><td><a href="https://milvus.io/">ميلفوس لايت</a></td><td>يخزن متجهات التصحيح ويتعامل مع البحث عن التشابه؛ يعمل محلياً بدون إعداد خادم</td></tr>
<tr><td>نموذج التوليد</td><td><a href="https://qwen.ai/blog?id=qwen3.5">Qwen3.5-397B-397B-A17B</a></td><td>نموذج LLM متعدد الوسائط يتم استدعاؤه عبر واجهة برمجة تطبيقات OpenRouter؛ يقرأ صور الصفحات المسترجعة لتوليد الإجابات</td></tr>
</tbody>
</table>
<h2 id="Step-by-Step-Implementation-for-Multi-Modal-RAG-with-ColQwen2+-Milvus+-Qwen35-397B-A17B" class="common-anchor-header">التنفيذ خطوة بخطوة لنموذج RAG متعدد الوسائط باستخدام ColQwen2+ Milvus+ Qwen3.5-397B-A17B<button data-href="#Step-by-Step-Implementation-for-Multi-Modal-RAG-with-ColQwen2+-Milvus+-Qwen35-397B-A17B" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Environment-Setup" class="common-anchor-header">إعداد البيئة</h3><ol>
<li>تثبيت تبعيات بايثون</li>
</ol>
<pre><code translate="no">pip install colpali-engine pymilvus openai pdf2image torch pillow tqdm
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>تثبيت Poppler، محرك عرض ملفات PDF</li>
</ol>
<pre><code translate="no"><span class="hljs-comment"># macOS</span>
brew install poppler

<span class="hljs-comment"># Ubuntu/Debian</span>
sudo apt-get install poppler-utils

<span class="hljs-comment"># Windows: download from https://github.com/oschwartz10612/poppler-windows</span>

<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li>تنزيل نموذج التضمين، ColQwen2</li>
</ol>
<p>قم بتحميل vidore/colqwen2-v1.0-merged من HuggingFace (حوالي 4.4 جيجابايت) واحفظه محليًا:</p>
<pre><code translate="no"><span class="hljs-built_in">mkdir</span> -p ~/models/colqwen2-v1.0-merged
<span class="hljs-comment"># Download all model files to this directory</span>
<button class="copy-code-btn"></button></code></pre>
<ol start="4">
<li>احصل على مفتاح OpenRouter API</li>
</ol>
<p>قم بالتسجيل وإنشاء مفتاح على <a href="https://openrouter.ai/settings/keys"></a><a href="https://openrouter.ai/settings/keys">https://openrouter.ai/settings/keys.</a></p>
<h3 id="Step-1-Import-Dependencies-and-Configure" class="common-anchor-header">الخطوة 1: استيراد التبعيات والتهيئة</h3><pre><code translate="no"><span class="hljs-keyword">import</span> os, io, base64
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
<p>الإخراج: الجهاز: وحدة المعالجة المركزية</p>
<h3 id="Step-2-Load-the-Embedding-Model" class="common-anchor-header">الخطوة 2: تحميل نموذج التضمين</h3><p><strong>ColQwen2</strong> هو نموذج لغة الرؤية الذي يرمز صور المستندات إلى تمثيلات متعددة النواقل على غرار ColBERT. تنتج كل صفحة عدة مئات من متجهات التصحيح ذات 128 بُعدًا.</p>
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
<p>الإخراج:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Col_Qwen2_Milvus_Qwen3_5397_BA_17_B_1_1fbbeba04e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-Initialize-Milvus" class="common-anchor-header">الخطوة 3: تهيئة ميلفوس</h3><p>يستخدم هذا البرنامج التعليمي برنامج Milvus Lite، والذي يعمل كملف محلي بدون تكوين - لا حاجة إلى عملية خادم منفصلة.</p>
<p><strong>مخطط قاعدة البيانات:</strong></p>
<p><strong>المعرف</strong>: INT64، مفتاح أساسي يتضاعف تلقائيًا</p>
<p><strong>doc_id</strong>: INT64، رقم الصفحة (أي صفحة من ملف PDF)</p>
<p><strong>patch_idx</strong>: INT64، فهرس التصحيح داخل تلك الصفحة</p>
<p><strong>المتجه</strong>: متجه FLOAT_VECTOR(128)، تضمين التصحيح ذي ال 128 بُعدًا</p>
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
<p>الناتج: مجموعة ميلفوس التي تم إنشاؤها.</p>
<h3 id="Step-4-Convert-PDF-Pages-to-Images" class="common-anchor-header">الخطوة 4: تحويل صفحات PDF إلى صور</h3><p>تقوم بتحويل كل صفحة بدقة 150 نقطة في البوصة. لا يحدث أي استخراج للنصوص هنا - يعامل خط الأنابيب كل صفحة كصورة بحتة.</p>
<pre><code translate="no">PDF_PATH = <span class="hljs-string">&quot;Milvus vs Zilliz.pdf&quot;</span>  <span class="hljs-comment"># Replace with your own PDF</span>
images = [p.convert(<span class="hljs-string">&quot;RGB&quot;</span>) <span class="hljs-keyword">for</span> p <span class="hljs-keyword">in</span> convert_from_path(PDF_PATH, dpi=<span class="hljs-number">150</span>)]
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{<span class="hljs-built_in">len</span>(images)}</span> pages loaded.&quot;</span>)

<span class="hljs-comment"># Preview the first page</span>
images[<span class="hljs-number">0</span>].resize((<span class="hljs-number">400</span>, <span class="hljs-built_in">int</span>(<span class="hljs-number">400</span> * images[<span class="hljs-number">0</span>].height / images[<span class="hljs-number">0</span>].width)))
<button class="copy-code-btn"></button></code></pre>
<p>الإخراج:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Col_Qwen2_Milvus_Qwen3_5397_BA_17_B_4_8720da8494.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-5-Encode-Images-and-Insert-into-Milvus" class="common-anchor-header">الخطوة 5: ترميز الصور وإدراجها في ميلفوس</h3><p>يقوم ColQwen2 بتشفير كل صفحة إلى تضمينات رقعة متعددة المتجهات. ثم تقوم بإدراج كل رقعة كصف منفصل في ملفوس.</p>
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
<p>الإخراج: 17 صفحة مشفرة، حوالي 755 رقعة لكل صفحة، خافتة=128</p>
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
<p>الإخراج: فهرسة 17 صفحة، إجمالي 12835 رقعة.</p>
<p>ينتج عن ملف PDF المكون من 17 صفحة 12,835 سجلات متجه التصحيح - حوالي 755 رقعة في كل صفحة.</p>
<h3 id="Step-6-Retrieve--Query-Encoding-+-MaxSim-Reranking" class="common-anchor-header">الخطوة 6: الاسترجاع - ترميز الاستعلام + إعادة ترتيب MaxSim</h3><p>هذا هو منطق الاسترجاع الأساسي. يعمل على ثلاث مراحل:</p>
<p><strong>ترميز الاستعلام</strong> إلى ناقلات رمزية متعددة.</p>
<p><strong>ابحث في ميلفوس</strong> عن أقرب البقع لكل متجه رمزي.</p>
<p><strong>التجميع حسب الصفحة</strong> باستخدام MaxSim: لكل رمز رمزي للاستعلام، خذ أعلى الدرجات في كل صفحة، ثم اجمع هذه الدرجات عبر جميع الرموز. الصفحة ذات أعلى مجموع نقاط هي أفضل تطابق.</p>
<p><strong>كيف يعمل MaxSim:</strong> بالنسبة لكل متجه رمز رمزي للاستعلام، تجد رقعة المستند ذات أعلى حاصل ضرب داخلي ("الحد الأقصى" في MaxSim). ثم تقوم بعد ذلك بجمع هذه الدرجات القصوى عبر جميع رموز الاستعلام للحصول على إجمالي درجة الملاءمة لكل صفحة. درجة أعلى = تطابق دلالي أقوى بين الاستعلام والمحتوى المرئي للصفحة.</p>
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
<p>الناتج:</p>
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
<h3 id="Step-7-Generate-an-Answer-with-the-Multimodal-LLM" class="common-anchor-header">الخطوة 7: توليد إجابة باستخدام LLM متعدد الوسائط</h3><p>ترسل صور الصفحة المسترجعة - وليس النص المستخرج - مع سؤال المستخدم إلى Qwen3.5. يقرأ LLM الصور مباشرةً لإنتاج إجابة.</p>
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
<p>النتائج:<br>

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Col_Qwen2_Milvus_Qwen3_5397_BA_17_B_3_33fa5d551d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Conclusion" class="common-anchor-header">الخاتمة<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>في هذا البرنامج التعليمي، قمنا في هذا البرنامج التعليمي ببناء خط أنابيب RAG متعدد الوسائط يأخذ ملف PDF، ويحول كل صفحة إلى صورة، ويشفّر تلك الصور إلى تضمينات تصحيح متعددة المتجهات باستخدام ColQwen2، ويخزنها في Milvus، ويسترجع الصفحات الأكثر صلة في وقت الاستعلام باستخدام تسجيل MaxSim. بدلًا من استخراج النص والأمل في أن يحافظ نظام التعرف الضوئي على الحروف على التخطيط، يرسل خط الأنابيب صور الصفحات الأصلية إلى Qwen3.5، الذي يقرأها بصريًا ويُنشئ إجابة.</p>
<p>هذا البرنامج التعليمي هو نقطة انطلاق، وليس نشرًا للإنتاج. هناك بعض الأشياء التي يجب وضعها في الاعتبار عند المضي قدمًا.</p>
<p>على المقايضات:</p>
<ul>
<li><strong>يتناسب التخزين مع عدد الصفحات.</strong> تنتج كل صفحة حوالي 755 ناقلًا، لذا فإن مجموعة من 1000 صفحة تعني حوالي 755000 صف في ملفوس. يعمل الفهرس المسطح المستخدم هنا للعروض التوضيحية ولكنك ستحتاج إلى IVF أو HNSW للمجموعات الأكبر.</li>
<li><strong>الترميز أبطأ من تضمين النص.</strong> ColQwen2 هو نموذج رؤية 4.4 جيجابايت. يستغرق ترميز الصور وقتًا أطول لكل صفحة من تضمين أجزاء النص. بالنسبة لمهمة الفهرسة الدفعية التي يتم تشغيلها مرة واحدة، عادةً ما يكون هذا جيدًا. أما بالنسبة للإدخال في الوقت الحقيقي، فالأمر يستحق القياس.</li>
<li><strong>يعمل هذا النهج بشكل أفضل مع المستندات الغنية بصريًا.</strong> إذا كانت ملفات PDF الخاصة بك في الغالب عبارة عن نص نظيف مكون من عمود واحد بدون جداول أو أشكال، فقد يسترجع RAG التقليدي المستند إلى النص بدقة أكبر وتكلفة أقل للتشغيل.</li>
</ul>
<p>حول ما يجب تجربته بعد ذلك:</p>
<ul>
<li><strong>قم بالتبديل في برنامج LLM مختلف متعدد الوسائط.</strong> يستخدم هذا البرنامج التعليمي Qwen3.5 عبر OpenRouter، لكن خط أنابيب الاسترجاع لا يعتمد على النموذج. يمكنك توجيه خطوة التوليد إلى GPT-4o أو Gemini أو أي نموذج متعدد الوسائط يقبل مدخلات الصور.</li>
<li><strong>توسيع نطاق <a href="http://milvus.io">ميلفوس</a>.</strong> يعمل Milvus Lite كملف محلي، وهو أمر رائع للنماذج الأولية. أما بالنسبة لأعباء عمل الإنتاج، فإن Milvus على Docker/Kubernetes أو Zilliz Cloud (Milvus المدارة بالكامل) يتعامل مع مجموعات أكبر دون الحاجة إلى إدارة البنية التحتية.</li>
<li><strong>جرّب أنواعًا مختلفة من المستندات.</strong> يستخدم خط التجهيز هنا ملف PDF للمقارنة، ولكنه يعمل بنفس الطريقة على العقود الممسوحة ضوئيًا أو الرسومات الهندسية أو البيانات المالية أو الأوراق البحثية ذات الأرقام الكثيفة.</li>
</ul>
<p>للبدء، قم بتثبيت <a href="https://github.com/milvus-io/milvus-lite">Milvus Lite</a> باستخدام pip install pymilvus واحصل على أوزان ColQwen2 من HuggingFace.</p>
<p>هل لديك أسئلة، أو تريد التباهي بما قمت ببنائه؟ <a href="https://milvus.io/slack">ميلفوس سلاك</a> هو أسرع طريقة للحصول على المساعدة من المجتمع والفريق. إذا كنت تفضل محادثة فردية، يمكنك حجز وقت في <a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour?uuid=4cb203e5-482a-47e0-90a6-7acc511d61f4">ساعات العمل</a> لدينا.</p>
<h2 id="Keep-Reading" class="common-anchor-header">تابع القراءة<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/debugging-rag-in-3d-with-projectgolem-and-milvus.md">ماذا لو كان بإمكانك معرفة سبب فشل RAG؟ تصحيح أخطاء RAG ثلاثي الأبعاد باستخدام Project_Golem وMilvus</a></p></li>
<li><p><a href="https://milvus.io/blog/is-rag-become-outdated-now-long-running-agents-like-claude-cowork-are-emerging.md">هل أصبح RAG قديمًا الآن بعد ظهور وكلاء طويل الأمد مثل Claude Cowork؟</a></p></li>
<li><p><a href="https://milvus.io/blog/semantic-highlighting-model-for-rag-context-pruning-and-token-saving.md">كيف قمنا ببناء نموذج تسليط الضوء الدلالي لتشذيب سياق RAG وحفظ الرمز المميز</a></p></li>
<li><p><a href="https://milvus.io/blog/ai-code-review-gets-better-when-models-debate-claude-vs-gemini-vs-codex-vs-qwen-vs-minimax.md">تتحسّن مراجعة كود الذكاء الاصطناعي عندما تتناقش النماذج: كلود ضد الجوزاء ضد كودكس ضد كوين ضد ميني ماكس</a></p></li>
</ul>
