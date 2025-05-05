---
id: >-
  hands-on-with-qwen-3-and-milvus-building-rag-with-the-latest-hybrid-inference-models.md
title: >-
  التدريب العملي على استخدام Qwen 3 و Milvus: بناء RAG مع أحدث نماذج الاستدلال
  الهجين
author: Lumina Wang
date: 2025-04-30T00:00:00.000Z
desc: >-
  شارك الإمكانيات الرئيسية لنماذج Qwen 3 وأرشدك خلال عملية إقران Qwen 3 مع
  Milvus لبناء نظام توليد معزز للاسترجاع محليًا ومدركًا للتكلفة (RAG).
cover: assets.zilliz.com/build_RAG_with_qwen_3_and_milvus_64b9f2ad4d.jpeg
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus, Qwen 3, MOE, dense models'
meta_title: >
  Hands-on with Qwen 3 and Milvus: Building RAG with the Latest Hybrid Inference
  Models
origin: >-
  https://milvus.io/blog/hands-on-with-qwen-3-and-milvus-building-rag-with-the-latest-hybrid-inference-models.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/build_RAG_with_qwen_3_and_milvus_64b9f2ad4d.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>بصفتي مطورًا يبحث باستمرار عن أدوات الذكاء الاصطناعي العملية، لم أستطع تجاهل الضجة التي أحاطت بأحدث إصدارات علي بابا كلاود: عائلة نماذج<a href="https://qwenlm.github.io/blog/qwen3/"> Qwen 3،</a> وهي مجموعة قوية من ثمانية نماذج استدلالية هجينة مصممة لإعادة تعريف التوازن بين الذكاء والكفاءة. في غضون 12 ساعة فقط، حصل المشروع على <strong>أكثر من 17,000 نجمة على موقع GitHub</strong> ووصل إلى ذروة <strong>23,000 تنزيل</strong> في الساعة على موقع Hugging Face.</p>
<p>فما الذي اختلف هذه المرة؟ باختصار، تجمع نماذج Qwen 3 بين كلٍ من النماذج المنطقية (استجابات بطيئة ومدروسة) وغير المنطقية (إجابات سريعة وفعالة) في بنية واحدة، وتتضمن خيارات نماذج متنوعة، وتدريباً وأداءً محسّناً، وتقدم المزيد من الميزات الجاهزة للمؤسسات.</p>
<p>في هذا المنشور، سألخص في هذا المنشور الإمكانيات الرئيسية لنماذج Qwen 3 التي يجب أن تنتبه إليها وأرشدك خلال عملية إقران Qwen 3 مع Milvus لبناء نظام توليد استرجاع معزز محلي مدرك للتكلفة (RAG) - مع كود عملي ونصائح لتحسين الأداء مقابل زمن الاستجابة.</p>
<p>دعونا نتعمق في الأمر.</p>
<h2 id="Whats-Exciting-About-Qwen-3" class="common-anchor-header">ما المثير في Qwen 3؟<button data-href="#Whats-Exciting-About-Qwen-3" class="anchor-icon" translate="no">
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
    </button></h2><p>بعد الاختبار والتعمق في Qwen 3، من الواضح أن الأمر لا يتعلق فقط بأرقام أكبر على ورقة المواصفات. بل يتعلق الأمر بكيفية مساعدة خيارات تصميم النموذج في الواقع للمطورين على إنشاء تطبيقات GenAI أفضل - أسرع وأكثر ذكاءً وتحكمًا. إليك ما يبرز هنا.</p>
<h3 id="1-Hybrid-Thinking-Modes-Smart-When-You-Need-Them-Speed-When-You-Don’t" class="common-anchor-header">1. أوضاع التفكير الهجين: ذكية عندما تحتاج إليها، وسريعة عندما لا تحتاج إليها</h3><p>إحدى أكثر الميزات ابتكارًا في Qwen 3 هي <strong>بنية الاستدلال الهجينة</strong>. فهي تمنحك تحكمًا دقيقًا في مقدار "التفكير" الذي يقوم به النموذج على أساس كل مهمة على حدة. لا تحتاج جميع المهام إلى تفكير معقد، في النهاية.</p>
<ul>
<li><p>بالنسبة للمشكلات المعقدة التي تتطلب تحليلاً عميقاً، يمكنك الاستفادة من قوة الاستدلال الكاملة - حتى لو كانت أبطأ.</p></li>
<li><p>بالنسبة للاستفسارات اليومية البسيطة، يمكنك التبديل إلى وضع أسرع وأخف.</p></li>
<li><p>يمكنك حتى تعيين <strong>"ميزانية تفكير</strong> " - تحديد الحد الأقصى لمقدار الحوسبة أو الرموز التي تستهلكها الجلسة.</p></li>
</ul>
<p>هذه ليست مجرد ميزة مختبرية أيضًا. إنها تعالج مباشرةً المفاضلة اليومية التي يتلاعب بها المطورون: تقديم استجابات عالية الجودة دون إهدار تكاليف البنية التحتية أو زمن استجابة المستخدم.</p>
<h3 id="2-A-Versatile-Lineup-MoE-and-Dense-Models-for-Different-Needs" class="common-anchor-header">2. تشكيلة متعددة الاستخدامات: نماذج MoE ونماذج كثيفة للاحتياجات المختلفة</h3><p>يوفر Qwen 3 مجموعة واسعة من النماذج المصممة لتتناسب مع الاحتياجات التشغيلية المختلفة:</p>
<ul>
<li><p><strong>نموذجان MoE (خليط من الخبراء)</strong>:</p>
<ul>
<li><p><strong>Qwen3-235B-235B-A22B</strong>: 235 مليار معلمة إجمالية، 22 مليار معلمة نشطة لكل استعلام</p></li>
<li><p><strong>Qwen3-30B-A3B</strong>: إجمالي 30 مليار معلمة و3 مليارات معلمة نشطة</p></li>
</ul></li>
<li><p><strong>ستة نماذج كثيفة</strong>: تتراوح من 0.6 مليار إلى 32 مليار معلمة ضخمة</p></li>
</ul>
<p><em>خلفية تقنية سريعة تعمل النماذج الكثيفة (مثل GPT-3 أو BERT) دائمًا على تنشيط جميع المعلمات، مما يجعلها أثقل ولكن يمكن التنبؤ بها في بعض الأحيان.</em> <em>تقوم</em> <a href="https://zilliz.com/learn/what-is-mixture-of-experts"><em>نماذج MoE</em></a> <em>بتفعيل جزء بسيط فقط من الشبكة في كل مرة، مما يجعلها أكثر كفاءة على نطاق واسع.</em></p>
<p>عملياً، هذه التشكيلة المتنوعة من النماذج تعني أنه يمكنك</p>
<ul>
<li><p>استخدام نماذج كثيفة لأعباء العمل الضيقة التي يمكن التنبؤ بها (مثل الأجهزة المدمجة)</p></li>
<li><p>استخدام نماذج MoE عندما تحتاج إلى إمكانات ثقيلة الوزن دون إذابة فاتورة السحابة</p></li>
</ul>
<p>باستخدام هذا النطاق، يمكنك تخصيص عملية النشر الخاصة بك - بدءًا من الإعدادات خفيفة الوزن والجاهزة للحافة إلى عمليات النشر القوية على نطاق السحابة - دون أن تكون مقيدًا بنوع نموذج واحد.</p>
<h3 id="3-Focused-on-Efficiency-and-Real-World-Deployment" class="common-anchor-header">3. التركيز على الكفاءة والنشر في العالم الحقيقي</h3><p>بدلاً من التركيز فقط على توسيع نطاق حجم النموذج، يركز Qwen 3 على كفاءة التدريب والتطبيق العملي للنشر:</p>
<ul>
<li><p>تم<strong>التدريب على 36 تريليون توكن</strong> - ضعف ما استخدمه Qwen 2.5</p></li>
<li><p><strong>توسعت إلى 235 مليار معلمة</strong> - ولكن تمت إدارتها بذكاء من خلال تقنيات MoE، مما يوازن بين القدرة ومتطلبات الموارد</p></li>
<li><p><strong>مُحسّنة للنشر</strong> - يتيح لك التكميم الديناميكي (من FP4 إلى INT8) تشغيل حتى أكبر نموذج Qwen 3 على بنية تحتية متواضعة - على سبيل المثال، النشر على أربع وحدات معالجة رسومات H20.</p></li>
</ul>
<p>الهدف هنا واضح: تقديم أداء أقوى دون الحاجة إلى استثمار غير متناسب في البنية التحتية.</p>
<h3 id="4-Built-for-Real-Integration-MCP-Support-and-Multilingual-Capabilities" class="common-anchor-header">4. مصممة للتكامل الحقيقي: دعم MCP والقدرات متعددة اللغات</h3><p>تم تصميم Qwen 3 مع وضع التكامل في الاعتبار، وليس فقط أداء النموذج المعزول:</p>
<ul>
<li><p>يتيح<strong>التوافق مع MCP (بروتوكول سياق النموذج)</strong> التكامل السلس مع قواعد البيانات الخارجية وواجهات برمجة التطبيقات والأدوات الخارجية، مما يقلل من النفقات الهندسية للتطبيقات المعقدة.</p></li>
<li><p>يعمل<strong>Qwen-Agent</strong> على تحسين استدعاء الأدوات وتنسيق سير العمل، مما يدعم بناء أنظمة ذكاء اصطناعي أكثر ديناميكية وقابلة للتنفيذ.</p></li>
<li><p><strong>الدعم متعدد اللغات عبر 119 لغة ولهجة</strong> يجعل Qwen 3 خيارًا قويًا للتطبيقات التي تستهدف الأسواق العالمية ومتعددة اللغات.</p></li>
</ul>
<p>تسهّل هذه الميزات مجتمعةً على المطورين بناء أنظمة على مستوى الإنتاج دون الحاجة إلى هندسة مخصصة واسعة النطاق حول النموذج.</p>
<h2 id="Qwen-3-Now-Supported-in-DeepSearcher" class="common-anchor-header">Qwen 3 مدعوم الآن في DeepSearcher<button data-href="#Qwen-3-Now-Supported-in-DeepSearcher" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a> هو مشروع مفتوح المصدر للاسترجاع العميق وتوليد التقارير، تم تصميمه كبديل محلي أولًا لـ OpenAI's Deep Research. وهو يساعد المطورين على بناء أنظمة تبرز معلومات عالية الجودة مدركة للسياق من مصادر بيانات خاصة أو خاصة بالمجال.</p>
<p>يدعم DeepSearcher الآن بنية الاستدلال الهجين في Qwen 3، مما يسمح للمطورين بتبديل الاستدلال ديناميكيًا - تطبيق الاستدلال الأعمق فقط عندما يضيف قيمة وتخطيه عندما تكون السرعة أكثر أهمية.</p>
<p>تحت الغطاء، يتكامل DeepSearcher مع<a href="https://milvus.io"> Milvus،</a> وهي قاعدة بيانات متجهة عالية الأداء طورها مهندسو Zilliz، لتوفير بحث دلالي سريع ودقيق على البيانات المحلية. وبالاقتران مع مرونة النموذج، فإنه يمنح المطورين تحكمًا أكبر في سلوك النظام والتكلفة وتجربة المستخدم.</p>
<h2 id="Hands-on-Tutorial-Building-a-RAG-System-with-Qwen-3-and-Milvus" class="common-anchor-header">برنامج تعليمي عملي: بناء نظام RAG باستخدام Qwen 3 و Milvus<button data-href="#Hands-on-Tutorial-Building-a-RAG-System-with-Qwen-3-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>دعونا نضع نماذج Qwen 3 هذه في العمل من خلال بناء نظام RAG باستخدام قاعدة بيانات Milvus المتجهة.</p>
<h3 id="Set-up-the-environment" class="common-anchor-header">قم بإعداد البيئة.</h3><pre><code translate="no"><span class="hljs-comment"># Install required packages</span>
pip install --upgrade pymilvus openai requests tqdm
<span class="hljs-comment"># Set up API key</span>
<span class="hljs-keyword">import</span> os
os.environ[<span class="hljs-string">&quot;DASHSCOPE_API_KEY&quot;</span>] = <span class="hljs-string">&quot;YOUR_DASHSCOPE_API_KEY&quot;</span> <span class="hljs-comment"># Get this from Alibaba Cloud DashScope</span>
<button class="copy-code-btn"></button></code></pre>
<p>ملاحظة: ستحتاج إلى الحصول على مفتاح API من Alibaba Cloud.</p>
<h3 id="Data-Preparation" class="common-anchor-header">إعداد البيانات</h3><p>سنستخدم صفحات وثائق Milvus كقاعدة معرفتنا الأساسية.</p>
<pre><code translate="no"><span class="hljs-comment"># Download and extract Milvus documentation</span>
!wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
!unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs

<span class="hljs-comment"># Load and parse the markdown files</span>
<span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob

text_lines = []
<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()
        text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Setting-Up-Models" class="common-anchor-header">إعداد النماذج</h3><p>سنستخدم واجهة برمجة التطبيقات المتوافقة مع OpenAI من DashScope للوصول إلى Qwen 3:</p>
<pre><code translate="no"><span class="hljs-comment"># Set up OpenAI client to access Qwen 3</span>
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI

openai_client = OpenAI(
    base_url=<span class="hljs-string">&quot;https://dashscope.aliyuncs.com/compatible-mode/v1&quot;</span>,
    api_key=os.getenv(<span class="hljs-string">&quot;DASHSCOPE_API_KEY&quot;</span>)
)

<span class="hljs-comment"># Set up embedding model</span>
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model <span class="hljs-keyword">as</span> milvus_model
embedding_model = milvus_model.DefaultEmbeddingFunction()
<button class="copy-code-btn"></button></code></pre>
<p>لنقم بإنشاء تضمين اختباري وطباعة أبعاده وعناصره القليلة الأولى:</p>
<pre><code translate="no">test_embedding = embedding_model.encode_queries([<span class="hljs-string">&quot;This is a test&quot;</span>])[<span class="hljs-number">0</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embedding)
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embedding[:<span class="hljs-number">10</span>])
<button class="copy-code-btn"></button></code></pre>
<p>الإخراج:</p>
<pre><code translate="no">768
[-0.04836066 0.07163023 -0.01130064 -0.03789345 -0.03320649 -0.01318448
 -0.03041712 -0.02269499 -0.02317863 -0.00426028]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Creating-a-Milvus-Collection" class="common-anchor-header">إنشاء مجموعة ميلفوس</h3><p>لنقم بإعداد قاعدة بيانات Milvus vector الخاصة بنا:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

<span class="hljs-comment"># Initialize Milvus client (using local storage for simplicity)</span>
milvus_client = MilvusClient(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)
collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>

<span class="hljs-comment"># Create a fresh collection</span>
<span class="hljs-keyword">if</span> milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)

<span class="hljs-comment"># Create a new collection</span>
test_embedding = embedding_model.encode_queries([<span class="hljs-string">&quot;This is a test&quot;</span>])[<span class="hljs-number">0</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embedding)
milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-comment"># Inner product distance</span>
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>, <span class="hljs-comment"># Strong consistency level</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>حول إعدادات معلمات MilvusClient:</p>
<ul>
<li><p>يعد تعيين URI لملف محلي (على سبيل المثال، <code translate="no">./milvus.db</code>) الطريقة الأكثر ملاءمة لأنه يستخدم تلقائيًا Milvus Lite لتخزين جميع البيانات في هذا الملف.</p></li>
<li><p>بالنسبة للبيانات واسعة النطاق، يمكنك إعداد خادم Milvus أكثر قوة على Docker أو Kubernetes. في هذه الحالة، استخدم عنوان URI الخاص بالخادم (على سبيل المثال، <code translate="no">http://localhost:19530</code>) كـ URI الخاص بك.</p></li>
<li><p>إذا كنت ترغب في استخدام <a href="https://zilliz.com/cloud">Zilliz Cloud </a>(الخدمة المُدارة لـ Milvus)، قم بتعديل URI والرمز المميز، اللذين يتوافقان مع نقطة النهاية العامة ومفتاح API في Zilliz Cloud.</p></li>
</ul>
<h3 id="Adding-Documents-to-the-Collection" class="common-anchor-header">إضافة مستندات إلى المجموعة</h3><p>سنقوم الآن بإنشاء تضمينات لقطعنا النصية وإضافتها إلى ميلفوس:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm

data = []
doc_embeddings = embedding_model.encode_documents(text_lines)

<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})

milvus_client.insert(collection_name=collection_name, data=data)
<button class="copy-code-btn"></button></code></pre>
<p>المخرجات:</p>
<pre><code translate="no">Creating embeddings: 100%|██████████████████████████████████████████████████| 72/72 [00:00&lt;00:00, 381300.36it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Building-the-RAG-Query-System" class="common-anchor-header">بناء نظام استعلام RAG</h3><p>والآن إلى الجزء المثير - دعونا نُنشئ نظام RAG الخاص بنا للإجابة عن الأسئلة.</p>
<p>دعونا نحدد سؤالاً شائعاً عن ميلفوس:</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>ابحث عن هذا السؤال في المجموعة واسترجع أفضل 3 نتائج مطابقة دلاليًا:</p>
<pre><code translate="no">search_res = milvus_client.search(
    collection_name=collection_name,
    data=embedding_model.encode_queries([question]), <span class="hljs-comment"># Convert the question to an embedding vector</span>
    limit=<span class="hljs-number">3</span>, <span class="hljs-comment"># Return top 3 results</span>
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}}, <span class="hljs-comment"># Inner product distance</span>
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>], <span class="hljs-comment"># Return the text field</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>لنلقِ نظرة على نتائج البحث لهذا الاستعلام:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json
retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))
<button class="copy-code-btn"></button></code></pre>
<p>الإخراج:</p>
<pre><code translate="no">[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including [MinIO](https://min.io/), [AWS S3](https://aws.amazon.com/s3/?nc1=h_ls), [Google Cloud Storage](https://cloud.google.com/storage?hl=en#object-storage-for-companies-of-all-sizes) (GCS), [Azure Blob Storage](https://azure.microsoft.com/en-us/products/storage/blobs), [Alibaba Cloud OSS](https://www.alibabacloud.com/product/object-storage-service), and [Tencent Cloud Object Storage](https://www.tencentcloud.com/products/cos) (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        <span class="hljs-number">0.6572665572166443</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus flush data?\n\nMilvus returns success when inserted data are loaded to the message queue. However, the data are not yet flushed to the disk. Then Milvus&#x27; data node writes the data in the message queue to persistent storage as incremental logs. If `flush()` is called, the data node is forced to write all data in the message queue to persistent storage immediately.\n\n###&quot;</span>,
        <span class="hljs-number">0.6312146186828613</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus handle vector data types and precision?\n\nMilvus supports Binary, Float32, Float16, and BFloat16 vector types.\n\n- Binary vectors: Store binary data as sequences of 0s and 1s, used in image processing and information retrieval.\n- Float32 vectors: Default storage with a precision of about 7 decimal digits. Even Float64 values are stored with Float32 precision, leading to potential precision loss upon retrieval.\n- Float16 and BFloat16 vectors: Offer reduced precision and memory usage. Float16 is suitable for applications with limited bandwidth and storage, while BFloat16 balances range and efficiency, commonly used in deep learning to reduce computational requirements without significantly impacting accuracy.\n\n###&quot;</span>,
        <span class="hljs-number">0.6115777492523193</span>
    ]
]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Using-the-LLM-to-Build-a-RAG-Response" class="common-anchor-header">استخدام LLM لبناء استجابة RAG</h3><p>تحويل المستندات المسترجعة إلى تنسيق سلسلة:</p>
<pre><code translate="no">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>توفير موجه النظام وموجه المستخدم لنموذج اللغة الكبيرة:</p>
<pre><code translate="no">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
You are an AI assistant. You are able to find answers to the questions from the contextual passage snippets provided.
&quot;&quot;&quot;</span>

USER_PROMPT = <span class="hljs-string">f&quot;&quot;&quot;
Use the following pieces of information enclosed in &lt;context&gt; tags to provide an answer to the question enclosed in &lt;question&gt; tags.

&lt;context&gt;
<span class="hljs-subst">{context}</span>
&lt;/context&gt;

&lt;question&gt;
<span class="hljs-subst">{question}</span>
&lt;/question&gt;
&quot;&quot;&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>استخدم أحدث نموذج Qwen لإنشاء استجابة بناءً على المطالبة:</p>
<pre><code translate="no">completion = openai_client.chat.completions.create(
    <span class="hljs-comment"># Model list: https://help.aliyun.com/zh/model-studio/getting-started/models</span>
    model=<span class="hljs-string">&quot;qwen-plus-2025-04-28&quot;</span>,
    messages=[
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT},
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT},
    ],
    <span class="hljs-comment"># Control thinking process with enable_thinking parameter (default True for open-source, False for commercial)</span>
    extra_body={<span class="hljs-string">&quot;enable_thinking&quot;</span>: <span class="hljs-literal">False</span>},
)

<span class="hljs-built_in">print</span>(completion.choices[<span class="hljs-number">0</span>].message.content)

<button class="copy-code-btn"></button></code></pre>
<p>الإخراج:</p>
<pre><code translate="no">In Milvus, data <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> two main categories: **inserted data** <span class="hljs-keyword">and</span> **metadata**.

- **Inserted Data**: <span class="hljs-function">This includes vector <span class="hljs-title">data</span> (<span class="hljs-params">like Binary, Float32, Float16, <span class="hljs-keyword">and</span> BFloat16 types</span>), scalar data, <span class="hljs-keyword">and</span> collection-specific schema. These are stored <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> **incremental logs**. Milvus supports various <span class="hljs-built_in">object</span> storage backends <span class="hljs-keyword">for</span> <span class="hljs-keyword">this</span> purpose, including:

  - [MinIO](<span class="hljs-params">https://min.io/</span>)
  - [AWS S3](<span class="hljs-params">https://aws.amazon.com/s3/?nc1=h_ls</span>)
  - [Google Cloud <span class="hljs-title">Storage</span> (<span class="hljs-params">GCS</span>)](<span class="hljs-params">https://cloud.google.com/storage?hl=en#<span class="hljs-built_in">object</span>-storage-<span class="hljs-keyword">for</span>-companies-of-all-sizes</span>)
  - [Azure Blob Storage](<span class="hljs-params">https://azure.microsoft.com/en-us/products/storage/blobs</span>)
  - [Alibaba Cloud OSS](<span class="hljs-params">https://www.alibabacloud.com/product/<span class="hljs-built_in">object</span>-storage-service</span>)
  - [Tencent Cloud Object <span class="hljs-title">Storage</span> (<span class="hljs-params">COS</span>)](<span class="hljs-params">https://www.tencentcloud.com/products/cos</span>)

- **Metadata**: Metadata generated within Milvus <span class="hljs-keyword">is</span> stored separately. Each Milvus module maintains its own metadata, which <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> [etcd](<span class="hljs-params">https://etcd.io/</span>), a distributed key-<span class="hljs-keyword">value</span> store.
When data <span class="hljs-keyword">is</span> inserted <span class="hljs-keyword">into</span> Milvus, it <span class="hljs-keyword">is</span> first loaded <span class="hljs-keyword">into</span> a message queue. It <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> immediately written to disk. A `<span class="hljs-title">flush</span>()` operation ensures that all data <span class="hljs-keyword">in</span> the queue <span class="hljs-keyword">is</span> written to persistent storage immediately.
</span><button class="copy-code-btn"></button></code></pre>
<h2 id="Comparing-Reasoning-vs-Non-Reasoning-Modes-A-Practical-Test" class="common-anchor-header">مقارنة أنماط الاستدلال مقابل الأنماط غير الاستدلالية: اختبار عملي<button data-href="#Comparing-Reasoning-vs-Non-Reasoning-Modes-A-Practical-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>لقد أجريت اختبارًا يقارن بين وضعي الاستدلال على مسألة رياضية:</p>
<p><strong>المشكلة</strong>: يبدأ الشخص (أ) والشخص (ب) بالركض من نفس الموقع. يغادر (أ) أولاً ويركض لمدة ساعتين بسرعة 5 كم/ساعة. يتبعه ب بسرعة 15 كم/ساعة. كم من الوقت سيستغرق الشخص (ب) للحاق به؟</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/math_problem_0123815455.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> time
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI

os.environ[<span class="hljs-string">&quot;DASHSCOPE_API_KEY&quot;</span>] = <span class="hljs-string">&quot;sk-****************&quot;</span>
client = OpenAI(
   api_key=os.getenv(<span class="hljs-string">&quot;DASHSCOPE_API_KEY&quot;</span>),
   base_url=<span class="hljs-string">&quot;https://dashscope.aliyuncs.com/compatible-mode/v1&quot;</span>,
)
<span class="hljs-comment">############################################</span>
<span class="hljs-comment"># Think</span>
<span class="hljs-comment"># Record the start time</span>
start_time = time.time()
stream = client.chat.completions.create(
   <span class="hljs-comment"># model lists：https://help.aliyun.com/zh/model-studio/getting-started/models</span>
   model=<span class="hljs-string">&quot;qwen3-235b-a22b&quot;</span>,
   <span class="hljs-comment"># model=&quot;qwen-plus-2025-04-28&quot;,</span>
   messages=[
       {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;You are a helpful assistant.&quot;</span>},
       {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;A and B depart from the same location. A leaves 2 hours earlier at 5 km/h. B follows at 15 km/h. When will B catch up?&quot;</span>},
   ],
   <span class="hljs-comment"># You can control the thinking mode through the enable_thinking parameter</span>
   extra_body={<span class="hljs-string">&quot;enable_thinking&quot;</span>: <span class="hljs-literal">True</span>},
   stream=<span class="hljs-literal">True</span>,
)
answer_content = <span class="hljs-string">&quot;&quot;</span>
<span class="hljs-keyword">for</span> chunk <span class="hljs-keyword">in</span> stream:
   delta = chunk.choices[<span class="hljs-number">0</span>].delta
   <span class="hljs-keyword">if</span> delta.content <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> <span class="hljs-literal">None</span>:
       answer_content += delta.content
      
<span class="hljs-built_in">print</span>(answer_content)

<span class="hljs-comment"># Record the end time and calculate the total runtime</span>
end_time = time.time()
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n\nTotal runtime：<span class="hljs-subst">{end_time - start_time:<span class="hljs-number">.2</span>f}</span>seconds&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>مع تفعيل وضع الاستدلال</strong></p>
<ul>
<li><p>زمن المعالجة: 74.83 ثانية تقريبًا</p></li>
<li><p>تحليل عميق، تحليل المشكلة، مسارات حل متعددة</p></li>
<li><p>مخرجات ترميز عالية الجودة مع الصيغ</p></li>
</ul>
<p>(الصورة أدناه عبارة عن لقطة شاشة لتصور استجابة النموذج في وضع التخفيض، لراحة القارئ)</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/screenshot_with_reasoning_1_d231b6ad54.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/screenshot_with_reasoning_2_394d3bff9f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>وضع عدم التعليل:</strong></p>
<p>في الشيفرة، ما عليك سوى تعيين <code translate="no">&quot;enable_thinking&quot;: False</code></p>
<p>نتائج الوضع غير الاستدلالي على هذه المشكلة:</p>
<ul>
<li>وقت المعالجة: 74.83 ثانية تقريبًا</li>
<li>تحليل عميق، تحليل المشكلة، مسارات حل متعددة</li>
<li>مخرجات ترميز عالية الجودة مع الصيغ</li>
</ul>
<p>(الصورة أدناه عبارة عن لقطة شاشة لتصور استجابة نموذج تخفيض السعر للنموذج، لراحة القارئ)</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/screenshot_without_reasoning_e1f6b82e56.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Conclusion" class="common-anchor-header">الخلاصة<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>يقدم Qwen 3 بنية نموذجية مرنة تتماشى بشكل جيد مع احتياجات العالم الحقيقي لتطوير GenAI. وبفضل مجموعة من أحجام النماذج (بما في ذلك المتغيرات الكثيفة والمتغيرات متعددة اللغات)، وأنماط الاستدلال الهجينة، وتكامل MCP، ودعم متعدد اللغات، فإنه يمنح المطورين المزيد من الخيارات لضبط الأداء والكمون والتكلفة، اعتمادًا على حالة الاستخدام.</p>
<p>وبدلاً من التركيز على الحجم وحده، يركز Qwen 3 على القدرة على التكيف. وهذا يجعلها خياراً عملياً لبناء خطوط أنابيب RAG، <a href="https://zilliz.com/blog/what-exactly-are-ai-agents-why-openai-and-langchain-are-fighting-over-their-definition">ووكلاء الذكاء الاصطناعي،</a> وتطبيقات الإنتاج التي تتطلب كلاً من قدرات التفكير المنطقي والتشغيل الفعال من حيث التكلفة.</p>
<p>عند إقرانها مع بنية تحتية مثل<a href="https://milvus.io"> Milvus</a> - قاعدة بيانات متجهة مفتوحة المصدر عالية الأداء - تصبح قدرات Qwen 3 أكثر فائدة، مما يتيح البحث السريع والدلالي والتكامل السلس مع أنظمة البيانات المحلية. ويوفران معًا أساسًا قويًا لتطبيقات الذكاء الاصطناعي الجيني الذكي سريع الاستجابة على نطاق واسع.</p>
