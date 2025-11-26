---
id: multimodal-rag-made-simple-rag-anything-milvus-instead-of-20-separate-tools.md
title: 'أصبح RAG متعدد الوسائط بسيطًا: RAG-Anything + Milvus بدلاً من 20 أداة منفصلة'
author: Min Yin
date: 2025-11-25T00:00:00.000Z
cover: assets.zilliz.com/rag_anything_cover_6b4e9bc6c0.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, RAG-Anything, Multimodal RAG, Vector Database'
meta_title: RAG-Anything and Milvus for Multimodal RAG Systems
desc: >-
  تعرّف على كيفية تمكين RAG-Anything وMilvus من الاسترجاع متعدد الوسائط عبر
  النصوص والصور والبيانات المهيكلة - وما هو التالي بالنسبة للذكاء الاصطناعي
  المعزز للاسترجاع.
origin: >-
  https://milvus.io/blog/multimodal-rag-made-simple-rag-anything-milvus-instead-of-20-separate-tools.md
---
<p>كان بناء نظام RAG متعدد الوسائط يعني تجميع عشرات الأدوات المتخصصة معًا - واحدة للتعرف الضوئي على الحروف وواحدة للجداول وواحدة للصيغ الرياضية وواحدة للتضمينات وواحدة للبحث وما إلى ذلك. صُممت خطوط أنابيب RAG التقليدية للنصوص، وبمجرد أن بدأت المستندات في تضمين الصور والجداول والمعادلات والمخططات والمحتويات المنظمة الأخرى، سرعان ما أصبحت سلسلة الأدوات فوضوية وغير قابلة للإدارة.</p>
<p>أما<a href="https://github.com/HKUDS/RAG-Anything"><strong>RAG-Anything،</strong></a> الذي طورته جامعة هونغ كونغ HKU، فقد غيّر ذلك. وهي مبنية على LightRAG، وتوفر منصة الكل في واحد التي يمكنها تحليل أنواع المحتوى المتنوعة بالتوازي وتعيينها في رسم بياني معرفي موحد. لكن توحيد خط الأنابيب هو نصف القصة فقط. لاسترداد الأدلة عبر هذه الطرائق المتنوعة، لا تزال بحاجة إلى بحث متجه سريع وقابل للتطوير يمكنه التعامل مع العديد من أنواع التضمين في وقت واحد. وهنا يأتي دور <a href="https://milvus.io/"><strong>ميلفوس</strong></a>. كقاعدة بيانات متجهات مفتوحة المصدر وعالية الأداء، يلغي Milvus الحاجة إلى حلول تخزين وبحث متعددة. فهو يدعم البحث على نطاق واسع في الشبكة النانوية الوطنية واسترجاع الكلمات المتجهة الهجينة والكلمات المتجهة الهجينة وتصفية البيانات الوصفية وإدارة التضمين المرنة - كل ذلك في مكان واحد.</p>
<p>في هذا المنشور، سنقوم بتفصيل كيفية عمل RAG-Anything وMilvus معًا لاستبدال سلسلة أدوات متعددة الوسائط مجزأة بمجموعة أدوات نظيفة وموحدة - وسنوضح كيف يمكنك بناء نظام RAG Q&amp;A عملي متعدد الوسائط بخطوات قليلة.</p>
<h2 id="What-Is-RAG-Anything-and-How-It-Works" class="common-anchor-header">ما هو RAG-Anything وكيف يعمل؟<button data-href="#What-Is-RAG-Anything-and-How-It-Works" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/HKUDS/RAG-Anything">RAG-Anything</a> هو إطار عمل RAG مصمم لكسر حاجز النص فقط للأنظمة التقليدية. فبدلاً من الاعتماد على أدوات متخصصة متعددة، يوفر بيئة واحدة وموحدة يمكنها تحليل المعلومات ومعالجتها واسترجاعها عبر أنواع المحتوى المختلطة.</p>
<p>يدعم إطار العمل المستندات التي تحتوي على نصوص ومخططات وجداول وتعبيرات رياضية، مما يتيح للمستخدمين الاستعلام عبر جميع الطرائق من خلال واجهة واحدة متماسكة. وهذا يجعلها مفيدة بشكل خاص في مجالات مثل البحث الأكاديمي وإعداد التقارير المالية وإدارة المعرفة المؤسسية، حيث تكون المواد متعددة الوسائط شائعة.</p>
<p>يعتمد RAG-Anything في جوهره على خط أنابيب متعدد الوسائط متعدد المراحل: تحليل المستند ← تحليل المحتوى ← الرسم البياني المعرفي ← الاسترجاع الذكي. تتيح هذه البنية التنسيق الذكي والفهم متعدد الوسائط، مما يسمح للنظام بالتعامل بسلاسة مع طرائق المحتوى المتنوعة ضمن سير عمل واحد متكامل.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/rag_anything_framework_d3513593a3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="The-1-+-3-+-N-Architecture" class="common-anchor-header">بنية "1 + 3 + N"</h3><p>على المستوى الهندسي، تتحقق إمكانيات RAG-Anything من خلال بنية "1 + 3 + N":</p>
<p><strong>المحرك الأساسي</strong></p>
<p>يوجد في مركز RAG-Anything محرك رسم بياني معرفي مستوحى من <a href="https://github.com/HKUDS/LightRAG">LightRAG</a>. هذه الوحدة الأساسية هي المسؤولة عن استخراج الكيانات متعددة الوسائط، وتخطيط العلاقات عبر الوسائط، والتخزين الدلالي المتجه. وعلى عكس أنظمة RAG التقليدية التي تعتمد على النصوص فقط، يفهم المحرك الكيانات من النصوص، والكائنات المرئية داخل الصور، والهياكل العلائقية المضمنة في الجداول.</p>
<p><strong>3 معالجات مشروطية</strong></p>
<p>يدمج نظام RAG-Anything ثلاثة معالجات طرائق متخصصة مصممة لفهم عميق خاص بالطرائق. وهي تشكل معًا طبقة التحليل متعدد الوسائط في النظام.</p>
<ul>
<li><p>يفسر<strong>ImageModalProcessor</strong> المحتوى المرئي ومعناه السياقي.</p></li>
<li><p>يقوم<strong>TableModalProcessor</strong> بتحليل هياكل الجداول وفك تشفير العلاقات المنطقية والعددية داخل البيانات.</p></li>
<li><p>يقوم<strong>EquationModalProcessor</strong> بفهم الدلالات الكامنة وراء الرموز والصيغ الرياضية.</p></li>
</ul>
<p><strong>المحللون</strong></p>
<p>لدعم البنية المتنوعة للمستندات في العالم الحقيقي، يوفر RAG-Anything طبقة تحليل قابلة للتوسيع مبنية على محركات استخراج متعددة. وهي تدمج حاليًا كلاً من MinerU وDocling، وتختار تلقائيًا المُحلل التحليلي الأمثل بناءً على نوع المستند وتعقيده الهيكلي.</p>
<p>استنادًا إلى بنية "1 + 3 + N"، تعمل RAG-Anything على تحسين خط أنابيب RAG التقليدي من خلال تغيير كيفية التعامل مع أنواع المحتوى المختلفة. فبدلًا من معالجة النصوص والصور والجداول واحدًا تلو الآخر، يقوم النظام بمعالجتها جميعًا مرة واحدة.</p>
<pre><code translate="no"><span class="hljs-comment"># The core configuration demonstrates the parallel processing design</span>
config = RAGAnythingConfig(
    working_dir=<span class="hljs-string">&quot;./rag_storage&quot;</span>,
    parser=<span class="hljs-string">&quot;mineru&quot;</span>,
    parse_method=<span class="hljs-string">&quot;auto&quot;</span>,  <span class="hljs-comment"># Automatically selects the optimal parsing strategy</span>
    enable_image_processing=<span class="hljs-literal">True</span>,
    enable_table_processing=<span class="hljs-literal">True</span>, 
    enable_equation_processing=<span class="hljs-literal">True</span>,
    max_workers=<span class="hljs-number">8</span>  <span class="hljs-comment"># Supports multi-threaded parallel processing</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>يعمل هذا التصميم على تسريع معالجة المستندات التقنية الكبيرة بشكل كبير. تُظهر الاختبارات المعيارية أنه عندما يستخدم النظام المزيد من أنوية وحدة المعالجة المركزية، يصبح أسرع بشكل ملحوظ، مما يقلل بشكل كبير من الوقت اللازم لمعالجة كل مستند.</p>
<h3 id="Layered-Storage-and-Retrieval-Optimization" class="common-anchor-header">تحسين التخزين والاسترجاع متعدد الطبقات</h3><p>علاوةً على تصميمه متعدد الوسائط، يستخدم RAG-Anything أيضًا نهج التخزين والاسترجاع متعدد الطبقات لجعل النتائج أكثر دقة وكفاءة.</p>
<ul>
<li><p>يتم تخزين<strong>النص</strong> في قاعدة بيانات متجهة تقليدية.</p></li>
<li><p>تتم إدارة<strong>الصور</strong> في مخزن ميزات مرئية منفصل.</p></li>
<li><p>يتم الاحتفاظ<strong>بالجداول</strong> في مخزن بيانات منظم.</p></li>
<li><p>يتم تحويل<strong>الصيغ الرياضية</strong> إلى متجهات دلالية.</p></li>
</ul>
<p>من خلال تخزين كل نوع من أنواع المحتوى في تنسيق مناسب خاص به، يمكن للنظام اختيار أفضل طريقة استرجاع لكل طريقة بدلاً من الاعتماد على بحث تشابه عام واحد. وهذا يؤدي إلى نتائج أسرع وأكثر موثوقية عبر أنواع مختلفة من المحتوى.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/layered_storage_c9441feff1.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="How-Milvus-Fits-into-RAG-Anything" class="common-anchor-header">كيف يتناسب ميلفوس مع RAG-Anything<button data-href="#How-Milvus-Fits-into-RAG-Anything" class="anchor-icon" translate="no">
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
    </button></h2><p>يوفر RAG-Anything استرجاعًا قويًا متعدد الوسائط، ولكن القيام بذلك بشكل جيد يتطلب بحثًا متجهًا سريعًا وقابلًا للتطوير عبر جميع أنواع التضمينات. يملأ <a href="https://milvus.io/">Milvus</a> هذا الدور بشكل مثالي.</p>
<p>بفضل بنيته السحابية الأصلية والفصل بين الحوسبة والتخزين، يوفر Milvus قابلية عالية للتوسع وكفاءة من حيث التكلفة. وهو يدعم الفصل بين القراءة والكتابة وتوحيد الدُفعات المتدفقة، مما يسمح للنظام بالتعامل مع أعباء العمل عالية التضمين مع الحفاظ على أداء الاستعلام في الوقت الفعلي - تصبح البيانات الجديدة قابلة للبحث فور إدراجها.</p>
<p>كما يضمن Milvus أيضًا موثوقية على مستوى المؤسسات من خلال تصميمه الموزع والمتحمل للأخطاء، والذي يحافظ على استقرار النظام حتى في حالة فشل العقد الفردية. وهذا يجعله مناسبًا بقوة لعمليات نشر RAG متعددة الوسائط على مستوى الإنتاج.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_ab54d5e798.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="How-to-Build-a-Multimodal-QA-System-with-RAG-Anything-and-Milvus" class="common-anchor-header">كيفية بناء نظام أسئلة وأجوبة متعدد الوسائط باستخدام RAG-Anything و Milvus<button data-href="#How-to-Build-a-Multimodal-QA-System-with-RAG-Anything-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>يوضح هذا العرض التوضيحي كيفية بناء نظام متعدد الوسائط للأسئلة والأجوبة باستخدام إطار عمل RAG-Anything، وقاعدة بيانات Milvus المتجهة، ونموذج تضمين TongYi. (يركز هذا المثال على كود التنفيذ الأساسي وليس إعداد إنتاج كامل).</p>
<h3 id="Hands-on-Demo" class="common-anchor-header">عرض توضيحي عملي</h3><p><strong>المتطلبات الأساسية ：</strong></p>
<ul>
<li><p><strong>بايثون:</strong> 3.10 أو أعلى</p></li>
<li><p><strong>قاعدة بيانات المتجهات:</strong> خدمة ميلفوس (ميلفوس لايت)</p></li>
<li><p><strong>الخدمة السحابية:</strong> مفتاح Alibaba Cloud API (لخدمة LLM وخدمات التضمين)</p></li>
<li><p><strong>نموذج LLM:</strong> <code translate="no">qwen-vl-max</code> (نموذج ممكّن للرؤية)</p></li>
</ul>
<p><strong>نموذج التضمين</strong>: <code translate="no">tongyi-embedding-vision-plus</code></p>
<pre><code translate="no">- python -m venv .venv &amp;&amp; <span class="hljs-built_in">source</span> .venv/bin/activate  <span class="hljs-comment"># For Windows users:  .venvScriptsactivate</span>
- pip install -r requirements-min.txt
- <span class="hljs-built_in">cp</span> .env.example .<span class="hljs-built_in">env</span> <span class="hljs-comment">#add DASHSCOPE_API_KEY</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>تنفيذ الحد الأدنى من مثال العمل:</strong></p>
<pre><code translate="no">python minimal_[main.py](&lt;http:<span class="hljs-comment">//main.py&gt;)</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>المخرجات المتوقعة:</strong></p>
<p>بمجرد تشغيل البرنامج النصي بنجاح، يجب أن تعرض المحطة الطرفية:</p>
<ul>
<li><p>نتيجة الأسئلة والأجوبة النصية التي تم إنشاؤها بواسطة LLM.</p></li>
<li><p>وصف الصورة المسترجعة المطابقة للاستعلام.</p></li>
</ul>
<h3 id="Project-Structure" class="common-anchor-header">هيكل المشروع</h3><pre><code translate="no">.
├─ requirements-min.txt
├─ .env.example
├─ [config.py](&lt;http:<span class="hljs-comment">//config.py&gt;)</span>
├─ milvus_[store.py](&lt;http:<span class="hljs-comment">//store.py&gt;)</span>
├─ [adapters.py](&lt;http:<span class="hljs-comment">//adapters.py&gt;)</span>
├─ minimal_[main.py](&lt;http:<span class="hljs-comment">//main.py&gt;)</span>
└─ sample
   ├─ docs
   │  └─ faq_milvus.txt
   └─ images
      └─ milvus_arch.png
<button class="copy-code-btn"></button></code></pre>
<p><strong>تبعيات المشروع</strong></p>
<pre><code translate="no">raganything
lightrag
pymilvus[lite]&gt;=2.3.0
aiohttp&gt;=3.8.0
orjson&gt;=3.8.0
python-dotenv&gt;=1.0.0
Pillow&gt;=9.0.0
numpy&gt;=1.21.0,&lt;2.0.0
rich&gt;=12.0.0
<button class="copy-code-btn"></button></code></pre>
<p><strong>متغيرات البيئة</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Alibaba Cloud DashScope</span>
DASHSCOPE_API_KEY=your_api_key_here
<span class="hljs-comment"># If the endpoint changes in future releases, please update it accordingly.</span>
ALIYUN_LLM_URL=https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions
ALIYUN_VLM_URL=https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions
ALIYUN_EMBED_URL=https://dashscope.aliyuncs.com/api/v1/services/embeddings/text-embedding
<span class="hljs-comment"># Model names (configure all models here for consistency)</span>
LLM_TEXT_MODEL=qwen-max
LLM_VLM_MODEL=qwen-vl-max
EMBED_MODEL=tongyi-embedding-vision-plus
<span class="hljs-comment"># Milvus Lite</span>
MILVUS_URI=milvus_lite.db
MILVUS_COLLECTION=rag_multimodal_collection
EMBED_DIM=1152
<button class="copy-code-btn"></button></code></pre>
<p><strong>التكوين</strong></p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">from</span> dotenv <span class="hljs-keyword">import</span> load_dotenv
load_dotenv()
DASHSCOPE_API_KEY = os.getenv(<span class="hljs-string">&quot;DASHSCOPE_API_KEY&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
LLM_TEXT_MODEL = os.getenv(<span class="hljs-string">&quot;LLM_TEXT_MODEL&quot;</span>, <span class="hljs-string">&quot;qwen-max&quot;</span>)
LLM_VLM_MODEL = os.getenv(<span class="hljs-string">&quot;LLM_VLM_MODEL&quot;</span>, <span class="hljs-string">&quot;qwen-vl-max&quot;</span>)
EMBED_MODEL = os.getenv(<span class="hljs-string">&quot;EMBED_MODEL&quot;</span>, <span class="hljs-string">&quot;tongyi-embedding-vision-plus&quot;</span>)
ALIYUN_LLM_URL = os.getenv(<span class="hljs-string">&quot;ALIYUN_LLM_URL&quot;</span>)
ALIYUN_VLM_URL = os.getenv(<span class="hljs-string">&quot;ALIYUN_VLM_URL&quot;</span>)
ALIYUN_EMBED_URL = os.getenv(<span class="hljs-string">&quot;ALIYUN_EMBED_URL&quot;</span>)
MILVUS_URI = os.getenv(<span class="hljs-string">&quot;MILVUS_URI&quot;</span>, <span class="hljs-string">&quot;milvus_lite.db&quot;</span>)
MILVUS_COLLECTION = os.getenv(<span class="hljs-string">&quot;MILVUS_COLLECTION&quot;</span>, <span class="hljs-string">&quot;rag_multimodal_collection&quot;</span>)
EMBED_DIM = <span class="hljs-built_in">int</span>(os.getenv(<span class="hljs-string">&quot;EMBED_DIM&quot;</span>, <span class="hljs-string">&quot;1152&quot;</span>))
<span class="hljs-comment"># Basic runtime parameters</span>
TIMEOUT = <span class="hljs-number">60</span>
MAX_RETRIES = <span class="hljs-number">2</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>استدعاء النموذج</strong></p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> base64
<span class="hljs-keyword">import</span> aiohttp
<span class="hljs-keyword">import</span> asyncio
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">List</span>, <span class="hljs-type">Dict</span>, <span class="hljs-type">Any</span>, <span class="hljs-type">Optional</span>
<span class="hljs-keyword">from</span> config <span class="hljs-keyword">import</span> (
    DASHSCOPE_API_KEY, LLM_TEXT_MODEL, LLM_VLM_MODEL, EMBED_MODEL,
    ALIYUN_LLM_URL, ALIYUN_VLM_URL, ALIYUN_EMBED_URL, EMBED_DIM, TIMEOUT
)
HEADERS = {
    <span class="hljs-string">&quot;Authorization&quot;</span>: <span class="hljs-string">f&quot;Bearer <span class="hljs-subst">{DASHSCOPE_API_KEY}</span>&quot;</span>,
    <span class="hljs-string">&quot;Content-Type&quot;</span>: <span class="hljs-string">&quot;application/json&quot;</span>,
}
<span class="hljs-keyword">class</span> <span class="hljs-title class_">AliyunLLMAdapter</span>:
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self</span>):
        <span class="hljs-variable language_">self</span>.text_url = ALIYUN_LLM_URL
        <span class="hljs-variable language_">self</span>.vlm_url = ALIYUN_VLM_URL
        <span class="hljs-variable language_">self</span>.text_model = LLM_TEXT_MODEL
        <span class="hljs-variable language_">self</span>.vlm_model = LLM_VLM_MODEL
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">chat</span>(<span class="hljs-params">self, prompt: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        payload = {
            <span class="hljs-string">&quot;model&quot;</span>: <span class="hljs-variable language_">self</span>.text_model,
            <span class="hljs-string">&quot;input&quot;</span>: {<span class="hljs-string">&quot;messages&quot;</span>: [{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: prompt}]},
            <span class="hljs-string">&quot;parameters&quot;</span>: {<span class="hljs-string">&quot;max_tokens&quot;</span>: <span class="hljs-number">1024</span>, <span class="hljs-string">&quot;temperature&quot;</span>: <span class="hljs-number">0.5</span>},
        }
        <span class="hljs-keyword">async</span> <span class="hljs-keyword">with</span> aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=TIMEOUT)) <span class="hljs-keyword">as</span> s:
            <span class="hljs-keyword">async</span> <span class="hljs-keyword">with</span> [s.post](&lt;http://s.post&gt;)(<span class="hljs-variable language_">self</span>.text_url, json=payload, headers=HEADERS) <span class="hljs-keyword">as</span> r:
                r.raise_for_status()
                data = <span class="hljs-keyword">await</span> r.json()
                <span class="hljs-keyword">return</span> data[<span class="hljs-string">&quot;output&quot;</span>][<span class="hljs-string">&quot;choices&quot;</span>][<span class="hljs-number">0</span>][<span class="hljs-string">&quot;message&quot;</span>][<span class="hljs-string">&quot;content&quot;</span>]
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">chat_vlm_with_image</span>(<span class="hljs-params">self, prompt: <span class="hljs-built_in">str</span>, image_path: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(image_path, <span class="hljs-string">&quot;rb&quot;</span>) <span class="hljs-keyword">as</span> f:
            image_b64 = base64.b64encode([f.read](&lt;http://f.read&gt;)()).decode(<span class="hljs-string">&quot;utf-8&quot;</span>)
        payload = {
            <span class="hljs-string">&quot;model&quot;</span>: <span class="hljs-variable language_">self</span>.vlm_model,
            <span class="hljs-string">&quot;input&quot;</span>: {<span class="hljs-string">&quot;messages&quot;</span>: [{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: [
                {<span class="hljs-string">&quot;text&quot;</span>: prompt},
                {<span class="hljs-string">&quot;image&quot;</span>: <span class="hljs-string">f&quot;data:image/png;base64,<span class="hljs-subst">{image_b64}</span>&quot;</span>}
            ]}]},
            <span class="hljs-string">&quot;parameters&quot;</span>: {<span class="hljs-string">&quot;max_tokens&quot;</span>: <span class="hljs-number">1024</span>, <span class="hljs-string">&quot;temperature&quot;</span>: <span class="hljs-number">0.2</span>},
        }
        <span class="hljs-keyword">async</span> <span class="hljs-keyword">with</span> aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=TIMEOUT)) <span class="hljs-keyword">as</span> s:
            <span class="hljs-keyword">async</span> <span class="hljs-keyword">with</span> [s.post](&lt;http://s.post&gt;)(<span class="hljs-variable language_">self</span>.vlm_url, json=payload, headers=HEADERS) <span class="hljs-keyword">as</span> r:
                r.raise_for_status()
                data = <span class="hljs-keyword">await</span> r.json()
                <span class="hljs-keyword">return</span> data[<span class="hljs-string">&quot;output&quot;</span>][<span class="hljs-string">&quot;choices&quot;</span>][<span class="hljs-number">0</span>][<span class="hljs-string">&quot;message&quot;</span>][<span class="hljs-string">&quot;content&quot;</span>]
<span class="hljs-keyword">class</span> <span class="hljs-title class_">AliyunEmbeddingAdapter</span>:
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self</span>):
        <span class="hljs-variable language_">self</span>.url = ALIYUN_EMBED_URL
        <span class="hljs-variable language_">self</span>.model = EMBED_MODEL
        <span class="hljs-variable language_">self</span>.dim = EMBED_DIM
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">embed_text</span>(<span class="hljs-params">self, text: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-type">List</span>[<span class="hljs-built_in">float</span>]:
        payload = {
            <span class="hljs-string">&quot;model&quot;</span>: <span class="hljs-variable language_">self</span>.model,
            <span class="hljs-string">&quot;input&quot;</span>: {<span class="hljs-string">&quot;texts&quot;</span>: [text]},
            <span class="hljs-string">&quot;parameters&quot;</span>: {<span class="hljs-string">&quot;text_type&quot;</span>: <span class="hljs-string">&quot;query&quot;</span>, <span class="hljs-string">&quot;dimensions&quot;</span>: <span class="hljs-variable language_">self</span>.dim},
        }
        <span class="hljs-keyword">async</span> <span class="hljs-keyword">with</span> aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=TIMEOUT)) <span class="hljs-keyword">as</span> s:
            <span class="hljs-keyword">async</span> <span class="hljs-keyword">with</span> [s.post](&lt;http://s.post&gt;)(<span class="hljs-variable language_">self</span>.url, json=payload, headers=HEADERS) <span class="hljs-keyword">as</span> r:
                r.raise_for_status()
                data = <span class="hljs-keyword">await</span> r.json()
                <span class="hljs-keyword">return</span> data[<span class="hljs-string">&quot;output&quot;</span>][<span class="hljs-string">&quot;embeddings&quot;</span>][<span class="hljs-number">0</span>][<span class="hljs-string">&quot;embedding&quot;</span>]
<button class="copy-code-btn"></button></code></pre>
<p><strong>تكامل ميلفوس لايت</strong></p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json
<span class="hljs-keyword">import</span> time
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">List</span>, <span class="hljs-type">Dict</span>, <span class="hljs-type">Any</span>, <span class="hljs-type">Optional</span>
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, Collection, CollectionSchema, FieldSchema, DataType, utility
<span class="hljs-keyword">from</span> config <span class="hljs-keyword">import</span> MILVUS_URI, MILVUS_COLLECTION, EMBED_DIM
<span class="hljs-keyword">class</span> <span class="hljs-title class_">MilvusVectorStore</span>:
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self, uri: <span class="hljs-built_in">str</span> = MILVUS_URI, collection_name: <span class="hljs-built_in">str</span> = MILVUS_COLLECTION, dim: <span class="hljs-built_in">int</span> = EMBED_DIM</span>):
        <span class="hljs-variable language_">self</span>.uri = uri
        <span class="hljs-variable language_">self</span>.collection_name = collection_name
        <span class="hljs-variable language_">self</span>.dim = dim
        <span class="hljs-variable language_">self</span>.collection: <span class="hljs-type">Optional</span>[Collection] = <span class="hljs-literal">None</span>
        <span class="hljs-variable language_">self</span>._connect_and_prepare()
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_connect_and_prepare</span>(<span class="hljs-params">self</span>):
        connections.connect(<span class="hljs-string">&quot;default&quot;</span>, uri=<span class="hljs-variable language_">self</span>.uri)
        <span class="hljs-keyword">if</span> utility.has_collection(<span class="hljs-variable language_">self</span>.collection_name):
            <span class="hljs-variable language_">self</span>.collection = Collection(<span class="hljs-variable language_">self</span>.collection_name)
        <span class="hljs-keyword">else</span>:
            fields = [
                FieldSchema(name=<span class="hljs-string">&quot;id&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">512</span>, is_primary=<span class="hljs-literal">True</span>),
                FieldSchema(name=<span class="hljs-string">&quot;vector&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=<span class="hljs-variable language_">self</span>.dim),
                FieldSchema(name=<span class="hljs-string">&quot;content&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">65535</span>),
                FieldSchema(name=<span class="hljs-string">&quot;content_type&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">32</span>),
                FieldSchema(name=<span class="hljs-string">&quot;source&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">1024</span>),
                FieldSchema(name=<span class="hljs-string">&quot;ts&quot;</span>, dtype=[DataType.INT](&lt;http://DataType.INT&gt;)<span class="hljs-number">64</span>),
            ]
            schema = CollectionSchema(fields, <span class="hljs-string">&quot;Minimal multimodal collection&quot;</span>)
            <span class="hljs-variable language_">self</span>.collection = Collection(<span class="hljs-variable language_">self</span>.collection_name, schema)
            <span class="hljs-variable language_">self</span>.collection.create_index(<span class="hljs-string">&quot;vector&quot;</span>, {
                <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>,
                <span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;IVF_FLAT&quot;</span>,
                <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">1024</span>}
            })
        <span class="hljs-variable language_">self</span>.collection.load()
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">upsert</span>(<span class="hljs-params">self, ids: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>], vectors: <span class="hljs-type">List</span>[<span class="hljs-type">List</span>[<span class="hljs-built_in">float</span>]], contents: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
               content_types: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>], sources: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>]</span>) -&gt; <span class="hljs-literal">None</span>:
        data = [
            ids,
            vectors,
            contents,
            content_types,
            sources,
            [<span class="hljs-built_in">int</span>(time.time() * <span class="hljs-number">1000</span>)] * <span class="hljs-built_in">len</span>(ids)
        ]
        <span class="hljs-variable language_">self</span>.collection.upsert(data)
        <span class="hljs-variable language_">self</span>.collection.flush()
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">search</span>(<span class="hljs-params">self, query_vectors: <span class="hljs-type">List</span>[<span class="hljs-type">List</span>[<span class="hljs-built_in">float</span>]], top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span>, content_type: <span class="hljs-type">Optional</span>[<span class="hljs-built_in">str</span>] = <span class="hljs-literal">None</span></span>):
        expr = <span class="hljs-string">f&#x27;content_type == &quot;<span class="hljs-subst">{content_type}</span>&quot;&#x27;</span> <span class="hljs-keyword">if</span> content_type <span class="hljs-keyword">else</span> <span class="hljs-literal">None</span>
        params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">16</span>}}
        results = [<span class="hljs-variable language_">self</span>.collection.search](&lt;http://<span class="hljs-variable language_">self</span>.collection.search&gt;)(
            data=query_vectors,
            anns_field=<span class="hljs-string">&quot;vector&quot;</span>,
            param=params,
            limit=top_k,
            expr=expr,
            output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;content_type&quot;</span>, <span class="hljs-string">&quot;source&quot;</span>, <span class="hljs-string">&quot;ts&quot;</span>]
        )
        out = []
        <span class="hljs-keyword">for</span> hits <span class="hljs-keyword">in</span> results:
            out.append([{
                <span class="hljs-string">&quot;id&quot;</span>: h.entity.get(<span class="hljs-string">&quot;id&quot;</span>),
                <span class="hljs-string">&quot;content&quot;</span>: h.entity.get(<span class="hljs-string">&quot;content&quot;</span>),
                <span class="hljs-string">&quot;content_type&quot;</span>: h.entity.get(<span class="hljs-string">&quot;content_type&quot;</span>),
                <span class="hljs-string">&quot;source&quot;</span>: h.entity.get(<span class="hljs-string">&quot;source&quot;</span>),
                <span class="hljs-string">&quot;score&quot;</span>: h.score
            } <span class="hljs-keyword">for</span> h <span class="hljs-keyword">in</span> hits])
        <span class="hljs-keyword">return</span> out
<button class="copy-code-btn"></button></code></pre>
<p><strong>نقطة الدخول الرئيسية</strong></p>
<pre><code translate="no"><span class="hljs-string">&quot;&quot;&quot;
Minimal Working Example:
- Insert a short text FAQ into LightRAG (text retrieval context)
- Insert an image description vector into Milvus (image retrieval context)
- Execute two example queries: one text QA and one image-based QA
&quot;&quot;&quot;</span>
<span class="hljs-keyword">import</span> asyncio
<span class="hljs-keyword">import</span> uuid
<span class="hljs-keyword">from</span> pathlib <span class="hljs-keyword">import</span> Path
<span class="hljs-keyword">from</span> rich <span class="hljs-keyword">import</span> <span class="hljs-built_in">print</span>
<span class="hljs-keyword">from</span> lightrag <span class="hljs-keyword">import</span> LightRAG, QueryParam
<span class="hljs-keyword">from</span> lightrag.utils <span class="hljs-keyword">import</span> EmbeddingFunc
<span class="hljs-keyword">from</span> adapters <span class="hljs-keyword">import</span> AliyunLLMAdapter, AliyunEmbeddingAdapter
<span class="hljs-keyword">from</span> milvus_store <span class="hljs-keyword">import</span> MilvusVectorStore
<span class="hljs-keyword">from</span> config <span class="hljs-keyword">import</span> EMBED_DIM
SAMPLE_DOC = Path(<span class="hljs-string">&quot;sample/docs/faq_milvus.txt&quot;</span>)
SAMPLE_IMG = Path(<span class="hljs-string">&quot;sample/images/milvus_arch.png&quot;</span>)
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">main</span>():
    <span class="hljs-comment"># 1) Initialize core components</span>
    llm = AliyunLLMAdapter()
    emb = AliyunEmbeddingAdapter()
    store = MilvusVectorStore()
    <span class="hljs-comment"># 2) Initialize LightRAG (for text-only retrieval)</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">llm_complete</span>(<span class="hljs-params">prompt: <span class="hljs-built_in">str</span>, max_tokens: <span class="hljs-built_in">int</span> = <span class="hljs-number">1024</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-keyword">await</span> [llm.chat](&lt;http://llm.chat&gt;)(prompt)
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">embed_func</span>(<span class="hljs-params">text: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-keyword">await</span> emb.embed_text(text)
    rag = LightRAG(
        working_dir=<span class="hljs-string">&quot;rag_workdir_min&quot;</span>,
        llm_model_func=llm_complete,
        embedding_func=EmbeddingFunc(
            embedding_dim=EMBED_DIM,
            max_token_size=<span class="hljs-number">8192</span>,
            func=embed_func
        ),
    )
    <span class="hljs-comment"># 3) Insert text data</span>
    <span class="hljs-keyword">if</span> SAMPLE_DOC.exists():
        text = SAMPLE_[DOC.read](&lt;http://DOC.read&gt;)_text(encoding=<span class="hljs-string">&quot;utf-8&quot;</span>)
        <span class="hljs-keyword">await</span> rag.ainsert(text)
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;[green]Inserted FAQ text into LightRAG[/green]&quot;</span>)
    <span class="hljs-keyword">else</span>:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;[yellow] sample/docs/faq_milvus.txt not found[/yellow]&quot;</span>)
    <span class="hljs-comment"># 4) Insert image data (store description in Milvus)</span>
    <span class="hljs-keyword">if</span> SAMPLE_IMG.exists():
        <span class="hljs-comment"># Use the VLM to generate a description as its semantic content</span>
        desc = <span class="hljs-keyword">await</span> [llm.chat](&lt;http://llm.chat&gt;)_vlm_with_image(<span class="hljs-string">&quot;Please briefly describe the key components of the Milvus architecture shown in the image.&quot;</span>, <span class="hljs-built_in">str</span>(SAMPLE_IMG))
        vec = <span class="hljs-keyword">await</span> emb.embed_text(desc)  <span class="hljs-comment"># Use text embeddings to maintain a consistent vector dimension, simplifying reuse</span>
        store.upsert(
            ids=[<span class="hljs-built_in">str</span>(uuid.uuid4())],
            vectors=[vec],
            contents=[desc],
            content_types=[<span class="hljs-string">&quot;image&quot;</span>],
            sources=[<span class="hljs-built_in">str</span>(SAMPLE_IMG)]
        )
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;[green]Inserted image description into Milvus（content_type=image）[/green]&quot;</span>)
    <span class="hljs-keyword">else</span>:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;[yellow] sample/images/milvus_arch.png not found[/yellow]&quot;</span>)
    <span class="hljs-comment"># 5) Query: Text-based QA (from LightRAG)</span>
    q1 = <span class="hljs-string">&quot;Does Milvus support simultaneous insertion and search? Give a short answer.&quot;</span>
    ans1 = <span class="hljs-keyword">await</span> rag.aquery(q1, param=QueryParam(mode=<span class="hljs-string">&quot;hybrid&quot;</span>))
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\\n[bold]Text QA[/bold]&quot;</span>)
    <span class="hljs-built_in">print</span>(ans1)
    <span class="hljs-comment"># 6) Query: Image-related QA (from Milvus)</span>
    q2 = <span class="hljs-string">&quot;What are the key components of the Milvus architecture?&quot;</span>
    q2_vec = <span class="hljs-keyword">await</span> emb.embed_text(q2)
    img_hits = [store.search](&lt;http://store.search&gt;)([q2_vec], top_k=<span class="hljs-number">3</span>, content_type=<span class="hljs-string">&quot;image&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\\n[bold]Image Retrieval (returns semantic image descriptions)[/bold]&quot;</span>)
    <span class="hljs-built_in">print</span>(img_hits[<span class="hljs-number">0</span>] <span class="hljs-keyword">if</span> img_hits <span class="hljs-keyword">else</span> [])
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    [asyncio.run](&lt;http://asyncio.run&gt;)(main())
<button class="copy-code-btn"></button></code></pre>
<p>يمكنك الآن اختبار نظام RAG متعدد الوسائط باستخدام مجموعة البيانات الخاصة بك.</p>
<h2 id="The-Future-for-Multimodal-RAG" class="common-anchor-header">مستقبل نظام RAG متعدد الوسائط<button data-href="#The-Future-for-Multimodal-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>مع انتقال المزيد من بيانات العالم الواقعي إلى ما هو أبعد من النص العادي، بدأت أنظمة الاسترجاع المعزز (RAG) في التطور نحو تعدد الوسائط الحقيقية. وتوضح حلول مثل <strong>RAG-Anything</strong> بالفعل كيف يمكن معالجة النصوص والصور والجداول والصيغ والمحتويات المنظمة الأخرى بطريقة موحدة. وبالنظر إلى المستقبل، أعتقد أن هناك ثلاثة اتجاهات رئيسية ستشكل المرحلة التالية من RAG متعدد الوسائط:</p>
<h3 id="Expanding-to-More-Modalities" class="common-anchor-header">التوسع إلى المزيد من الطرائق</h3><p>الأطر الحالية - مثل RAG-Anything - يمكنها بالفعل التعامل مع النصوص والصور والجداول والتعبيرات الرياضية. تتمثل الحدود التالية في دعم أنواع محتوى أكثر ثراءً، بما في ذلك <strong>الفيديو والصوت وبيانات الاستشعار والنماذج ثلاثية الأبعاد،</strong> مما يمكّن أنظمة RAG من فهم واسترجاع المعلومات من مجموعة كاملة من البيانات الحديثة.</p>
<h3 id="Real-Time-Data-Updates" class="common-anchor-header">تحديثات البيانات في الوقت الحقيقي</h3><p>تعتمد معظم خطوط أنابيب RAG اليوم على مصادر بيانات ثابتة نسبيًا. وبما أن المعلومات تتغير بسرعة أكبر، ستتطلب الأنظمة المستقبلية <strong>تحديثات المستندات في الوقت الحقيقي، واستيعاب التدفق، والفهرسة التدريجية</strong>. هذا التحول سيجعل RAG أكثر استجابة وفي الوقت المناسب وأكثر موثوقية في البيئات الديناميكية.</p>
<h3 id="Moving-RAG-to-Edge-Devices" class="common-anchor-header">نقل RAG إلى أجهزة الحافة</h3><p>مع أدوات المتجهات خفيفة الوزن مثل <a href="https://github.com/milvus-io/milvus-lite">Milvus Lite،</a> لم يعد RAG متعدد الوسائط محصورًا في السحابة. يتيح نشر RAG على <strong>الأجهزة الطرفية وأنظمة إنترنت الأشياء</strong> إمكانية الاسترجاع الذكي بالقرب من مكان توليد البيانات - مما يحسن من زمن الاستجابة والخصوصية والكفاءة الإجمالية.</p>
<p>👉 هل أنت مستعد لاستكشاف RAG متعدد الوسائط؟</p>
<p>جرّب إقران خط أنابيب متعدد الوسائط مع <a href="https://milvus.io">Milvus</a> وجرّب الاسترجاع السريع والقابل للتطوير عبر النصوص والصور وغيرها.</p>
<p>هل لديك أسئلة أو تريد التعمق في أي ميزة؟ انضم إلى<a href="https://discord.com/invite/8uyFbECzPX"> قناة Discord</a> الخاصة بنا أو قم بتسجيل المشكلات على<a href="https://github.com/milvus-io/milvus"> GitHub</a>. يمكنك أيضًا حجز جلسة فردية مدتها 20 دقيقة للحصول على رؤى وإرشادات وإجابات لأسئلتك من خلال<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> ساعات عمل Milvus المكتبية</a>.</p>
