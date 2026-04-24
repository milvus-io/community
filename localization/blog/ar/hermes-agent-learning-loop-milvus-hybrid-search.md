---
id: hermes-agent-learning-loop-milvus-hybrid-search.md
title: كيفية إصلاح حلقة التعلم لدى وكيل هيرميس مع البحث الهجين Milvus 2.6
author: Min Yin
date: 2026-4-24
cover: >-
  assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_2_e0b44ee562.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Hermes Agent, Milvus 2.6, hybrid search, agent memory, skill learning loop'
meta_title: |
  How to Fix Hermes Agent's Learning Loop with Milvus 2.6 Hybrid Search
desc: >-
  تكتب حلقة التعلم الخاصة بعامل هيرميس "حلقة التعلم" مهارات من الاستخدام، لكن
  مسترجع FTS5 الخاص به يفتقد الاستعلامات المعاد صياغتها. يعمل بحث Milvus 2.6
  الهجين على إصلاح الاسترجاع عبر الجلسات.
origin: 'https://milvus.io/blog/hermes-agent-learning-loop-milvus-hybrid-search.md'
---
<p><strong>انتشر</strong><a href="https://github.com/NousResearch/hermes-agent"><strong>وكيل Hermes</strong></a> <strong>في كل مكان مؤخراً.</strong> تم تصميم Hermes من قبل Nous Research، وهو وكيل ذكاء اصطناعي شخصي ذاتي الاستضافة يعمل على أجهزتك الخاصة (يعمل VPS بقيمة 5 دولارات) ويتحدث إليك من خلال قنوات الدردشة الحالية مثل Telegram.</p>
<p><strong>أهم ما يميزه هو حلقة التعلم المدمجة:</strong> تقوم الحلقة بإنشاء المهارات من التجربة، وتحسينها أثناء الاستخدام، والبحث في المحادثات السابقة للعثور على أنماط قابلة لإعادة الاستخدام. تقوم أطر عمل الوكلاء الأخرى بترميز المهارات يدويًا قبل النشر. بينما تنمو مهارات Hermes من الاستخدام، وتصبح عمليات سير العمل المتكررة قابلة لإعادة الاستخدام دون أي تغيير في التعليمات البرمجية.</p>
<p><strong>تكمن المشكلة في أن استرجاع هيرميس هو استرجاع الكلمات الرئيسية فقط.</strong> فهو يطابق الكلمات الدقيقة، ولكن ليس المعنى الذي يبحث عنه المستخدمون. عندما يستخدم المستخدمون صياغات مختلفة عبر جلسات مختلفة، لا يمكن للحلقة الربط بينها، ولا تتم كتابة أي مهارة جديدة. عندما لا يكون هناك سوى بضع مئات من المستندات، تكون الفجوة مقبولة. <strong>بعد ذلك، تتوقف الحلقة عن التعلم لأنها لا تستطيع العثور على تاريخها الخاص.</strong></p>
<p><strong>الإصلاح هو Milvus 2.6.</strong> يغطي <a href="https://milvus.io/docs/multi-vector-search.md">البحث الهجين</a> الخاص به كلاً من المعنى والكلمات المفتاحية الدقيقة في استعلام واحد، لذلك يمكن للحلقة في النهاية ربط المعلومات المعاد صياغتها عبر الجلسات. إنه خفيف بما فيه الكفاية ليتناسب مع خادم سحابي صغير (خادم خاص افتراضي خاص VPS بقيمة 5 دولارات شهريًا يشغلها). لا يتطلب تبديله تغيير هيرميس - ففتحات ميلفوس خلف طبقة الاسترجاع، لذا تبقى حلقة التعلم سليمة. لا يزال هيرميس يختار المهارة التي سيتم تشغيلها، ويتولى ميلفوس ما يجب استرجاعه.</p>
<p>لكن المردود الأعمق يتجاوز الاسترجاع الأفضل: بمجرد أن تعمل عملية الاسترجاع، يمكن لحلقة التعلم تخزين استراتيجية الاسترجاع نفسها كمهارة - وليس فقط المحتوى الذي تسترجعه. هكذا يتراكم عمل الوكيل المعرفي عبر الجلسات.</p>
<h2 id="Hermes-Agent-Architecture-How-Four-Layer-Memory-Powers-the-Skill-Learning-Loop" class="common-anchor-header">بنية وكيل هيرميس العميل: كيف تعمل الذاكرة المكونة من أربع طبقات على تشغيل حلقة تعلم المهارات<button data-href="#Hermes-Agent-Architecture-How-Four-Layer-Memory-Powers-the-Skill-Learning-Loop" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>يحتوي</strong><a href="https://github.com/NousResearch/hermes-agent"><strong>Hermes</strong></a> <strong>على أربع طبقات ذاكرة، و L4 المهارات هي التي تميزه.</strong></p>
<ul>
<li><strong>L1</strong> - سياق الجلسة، يتم مسحها عند إغلاق الجلسة</li>
<li><strong>L2</strong> - الحقائق الثابتة: كومة المشاريع، واتفاقيات الفريق، والقرارات التي تم حلها</li>
<li><strong>L3</strong> - البحث في الكلمات الرئيسية SQLite FTS5 على الملفات المحلية</li>
<li><strong>L4</strong> - تخزين سير العمل كملفات Markdown. على عكس أدوات LangChain أو إضافات AutoGPT، التي يؤلفها المطورون في التعليمات البرمجية قبل النشر، فإن مهارات L4 مكتوبة ذاتيًا: فهي تنمو مما يقوم الوكيل بتشغيله بالفعل، دون الحاجة إلى تأليف المطور.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_3_3653368e99.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Why-Hermess-FTS5-Keyword-Retrieval-Breaks-the-Learning-Loop" class="common-anchor-header">لماذا يكسر استرجاع الكلمات الرئيسية لـ FTS5 من Hermes حلقة التعلم<button data-href="#Why-Hermess-FTS5-Keyword-Retrieval-Breaks-the-Learning-Loop" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>يحتاج Hermes إلى الاسترجاع لتشغيل تدفقات العمل عبر الجلسات في المقام الأول.</strong> لكن طبقة L3 المدمجة تستخدم SQLite FTS5، والتي تطابق الرموز الحرفية فقط، وليس المعنى.</p>
<p><strong>عندما يقوم المستخدمون بصياغة نفس القصد بشكل مختلف عبر الجلسات، فإن FTS5 يفوت التطابق.</strong> لا تنطلق حلقة التعلم. لا تتم كتابة أي مهارة جديدة، وفي المرة التالية التي يأتي فيها القصد، يعود المستخدم إلى التوجيه يدويًا.</p>
<p>مثال: تخزّن القاعدة المعرفية "حلقة حدث asyncio، جدولة المهام غير المتزامنة، الإدخال/الإخراج غير المتوقف". يبحث المستخدم عن "التزامن في بايثون". لا يُرجع FTS5 أي تطابق - لا يوجد تداخل حرفي للكلمات، ولا يملك FTS5 أي طريقة لمعرفة أنهما نفس السؤال.</p>
<p>تحت بضع مئات من الوثائق، الفجوة مقبولة. بعد ذلك، تستخدم الوثائق مفردات واحدة، والمستخدمون يسألون بمفردات أخرى، وليس لدى FTS5 أي جسر بينهما. <strong>المحتوى الذي لا يمكن استرجاعه قد لا يكون موجودًا في قاعدة المعرفة، وحلقة التعلم ليس لديها ما تتعلم منه.</strong></p>
<h2 id="How-Milvus-26-Fixes-the-Retrieval-Gap-with-Hybrid-Search-and-Tiered-Storage" class="common-anchor-header">كيف يعمل ميلفوس 2.6 على إصلاح فجوة الاسترجاع مع البحث الهجين والتخزين المتدرج<button data-href="#How-Milvus-26-Fixes-the-Retrieval-Gap-with-Hybrid-Search-and-Tiered-Storage" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>يجلب الإصدار 2.6 من ميلفوس 2.6 ترقيتين تناسبان نقاط فشل هيرميس.</strong> يعمل <strong>البحث الهجين</strong> على إلغاء حظر حلقة التعلم من خلال تغطية كل من الاسترجاع الدلالي واسترجاع الكلمات الرئيسية في مكالمة واحدة. يحافظ <strong>التخزين المتدرج</strong> على الواجهة الخلفية للاسترجاع بأكملها صغيرة بما يكفي لتشغيلها على نفس الخادم الافتراضي الخاص الذي تم تصميم Hermes من أجله بقيمة 5 دولارات شهريًا.</p>
<h3 id="What-Hybrid-Search-Solves-Finding-Relevant-Information" class="common-anchor-header">ما الذي يحله البحث الهجين: العثور على المعلومات ذات الصلة</h3><p>يدعم Milvus 2.6 تشغيل كلٍ من الاسترجاع المتجه (الدلالي) <a href="https://milvus.io/docs/full-text-search.md">والبحث بالنص الكامل BM25</a> (الكلمات المفتاحية) في استعلام واحد، ثم دمج القائمتين المصنفتين باستخدام <a href="https://milvus.io/docs/multi-vector-search.md">دمج الرتب المتبادل (RRF)</a>.</p>
<p>على سبيل المثال: اسأل &quot;ما هو مبدأ أسينسيو&quot;، ويؤدي استرجاع المتجهات إلى الوصول إلى المحتوى ذي الصلة الدلالية. اسأل &quot;أين يتم تعريف الدالة <code translate="no">find_similar_task</code> &quot;، ويطابق BM25 اسم الدالة في الكود بدقة. بالنسبة للأسئلة التي تتضمن دالة داخل نوع معين من المهام، يقوم البحث الهجين بإرجاع النتيجة الصحيحة في مكالمة واحدة، دون منطق توجيه مكتوب يدويًا.</p>
<p>بالنسبة لـ Hermes، هذا هو ما يفتح حلقة التعلم. عندما تعيد الجلسة الثانية صياغة القصد، يلتقط استرجاع المتجهات التطابق الدلالي الذي فات FTS5. تنطلق الحلقة، وتُكتب مهارة جديدة.</p>
<h3 id="What-Tiered-Storage-Solves-Cost" class="common-anchor-header">ما يحل التخزين المتدرج: التكلفة</h3><p>ستحتاج قاعدة البيانات المتجهة الساذجة إلى فهرس التضمين الكامل في ذاكرة الوصول العشوائي، مما يدفع عمليات النشر الشخصية نحو بنية تحتية أكبر وأكثر تكلفة. يتجنب Milvus 2.6 ذلك من خلال التخزين ثلاثي المستويات، حيث ينقل الإدخالات بين المستويات بناءً على تردد الوصول:</p>
<ul>
<li><strong>ساخن</strong> - في الذاكرة</li>
<li><strong>دافئ</strong> - على SSD</li>
<li><strong>بارد</strong> - على تخزين الكائنات</li>
</ul>
<p>البيانات الساخنة فقط تبقى مقيمة. قاعدة معرفية مكونة من 500 مستند تتسع لـ 2 جيجابايت من ذاكرة الوصول العشوائي. يتم تشغيل مكدس الاسترجاع بالكامل على نفس أهداف Hermes VPS التي تبلغ 5 دولارات شهريًا، دون الحاجة إلى ترقية البنية التحتية.</p>
<h2 id="Hermes-+-Milvus-System-Architecture" class="common-anchor-header">هيرميس + ميلفوس: بنية النظام<button data-href="#Hermes-+-Milvus-System-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>يختار Hermes المهارة التي سيتم تشغيلها. ويتعامل ميلفوس مع ما يجب استرجاعه.</strong> يبقى النظامان منفصلين، ولا تتغير واجهة Hermes.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_4_1794304940.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>التدفق</strong></p>
<ol>
<li>يحدد Hermes نية المستخدم ويوجهه إلى المهارة.</li>
<li>تستدعي المهارة برنامج نصي للاسترجاع من خلال الأداة الطرفية.</li>
<li>يقوم النص البرمجي بالوصول إلى Milvus، ويقوم بتشغيل بحث مختلط، ويعيد الأجزاء المصنفة مع البيانات الوصفية للمصدر.</li>
<li>يؤلف هيرميس الإجابة. تسجل الذاكرة سير العمل.</li>
<li>عندما يتكرر نفس النمط عبر الجلسات، تكتب حلقة التعلم مهارة جديدة.</li>
</ol>
<h2 id="How-to-Install-Hermes-and-Milvus-26" class="common-anchor-header">كيفية تثبيت Hermes وميلفوس 2.6<button data-href="#How-to-Install-Hermes-and-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>قم بتثبيت Hermes وMilvus</strong> <a href="https://milvus.io/docs/install_standalone-docker.md"><strong>2.6</strong></a><strong> Standalone، ثم قم بإنشاء مجموعة مع حقول كثيفة و BM25.</strong> هذا هو الإعداد الكامل قبل أن تنطلق حلقة التعلم.</p>
<h3 id="Install-Hermes" class="common-anchor-header">تثبيت Hermes</h3><pre><code translate="no" class="language-bash">curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
<button class="copy-code-btn"></button></code></pre>
<p>قم بتشغيل <code translate="no">hermes</code> للدخول إلى معالج البدء التفاعلي:</p>
<ul>
<li><strong>مزود LLM</strong> - OpenAI، أنثروبيك، OpenRouter (يحتوي OpenRouter على نماذج مجانية)</li>
<li><strong>القناة</strong> - تستخدم هذه الإرشادات التفصيلية روبوت FLark</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_5_dceeae1519.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Run-Milvus-26-Standalone" class="common-anchor-header">تشغيل ميلفوس 2.6 مستقل</h3><p>عقدة واحدة مستقلة كافية لوكيل شخصي:</p>
<pre><code translate="no" class="language-bash">curl -sfL https://raw.githubusercontent.com/milvus-io/milvus/master/scripts/standalone_embed.sh \
-o standalone_embed.sh
bash standalone_embed.sh start
<span class="hljs-comment"># Verify service status</span>
docker ps | grep milvus
<button class="copy-code-btn"></button></code></pre>
<h3 id="Create-the-Collection" class="common-anchor-header">إنشاء المجموعة</h3><p>يحدد تصميم المخطط ما يمكن أن يفعله الاسترجاع. يقوم هذا المخطط بتشغيل المتجهات الكثيفة ومتجهات BM25 المتناثرة جنبًا إلى جنب:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType, Function, FunctionType
client = MilvusClient(
    uri=<span class="hljs-string">&quot;http://192.168.x.x:19530&quot;</span>,
)
schema = client.create_schema(auto_id=<span class="hljs-literal">True</span>, enable_dynamic_field=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
<span class="hljs-comment"># Raw text (for BM25 full-text search)</span>
schema.add_field(
    <span class="hljs-string">&quot;text&quot;</span>,
    DataType.VARCHAR,
    max_length=<span class="hljs-number">8192</span>,
    enable_analyzer=<span class="hljs-literal">True</span>,
    enable_match=<span class="hljs-literal">True</span>
)
<span class="hljs-comment"># Dense vector (semantic search)</span>
schema.add_field(<span class="hljs-string">&quot;dense_vector&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">1536</span>)
<span class="hljs-comment"># Sparse vector (BM25 auto-generated, Milvus 2.6 feature)</span>
schema.add_field(<span class="hljs-string">&quot;sparse_vector&quot;</span>, DataType.SPARSE_FLOAT_VECTOR)
schema.add_field(<span class="hljs-string">&quot;source&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">512</span>)
schema.add_field(<span class="hljs-string">&quot;chunk_index&quot;</span>, DataType.INT32)
<span class="hljs-comment"># Tell Milvus to auto-convert text to sparse_vector via BM25</span>
bm25_function = Function(
    name=<span class="hljs-string">&quot;text_bm25&quot;</span>,
    function_type=FunctionType.BM25,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;sparse_vector&quot;</span>],
)
schema.add_function(bm25_function)
index_params = client.prepare_index_params()
<span class="hljs-comment"># HNSW graph index (dense vector)</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;dense_vector&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    params={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">256</span>}
)
<span class="hljs-comment"># BM25 inverted index (sparse vector)</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;sparse_vector&quot;</span>,
    index_type=<span class="hljs-string">&quot;SPARSE_INVERTED_INDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span>
)
client.create_collection(
    collection_name=<span class="hljs-string">&quot;hermes_milvus&quot;</span>,
    schema=schema,
    index_params=index_params
)
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_6_0646f46d36.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Hybrid-Search-Script" class="common-anchor-header">مخطط البحث الهجين</h3><pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> sys, json
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, AnnSearchRequest, RRFRanker

client = MilvusClient(<span class="hljs-string">&quot;http://192.168.x.x:19530&quot;</span>)
oai    = OpenAI()
COLLECTION = <span class="hljs-string">&quot;hermes_milvus&quot;</span>

<span class="hljs-keyword">def</span> <span class="hljs-title function_">hybrid_search</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">dict</span>]:
    <span class="hljs-comment"># 1. Vectorize query</span>
    dense_vec = oai.embeddings.create(
        model=<span class="hljs-string">&quot;text-embedding-3-small&quot;</span>,
        <span class="hljs-built_in">input</span>=query
    ).data[<span class="hljs-number">0</span>].embedding

    <span class="hljs-comment"># 2. Dense vector retrieval (semantic relevance)</span>
    dense_req = AnnSearchRequest(
        data=[dense_vec],
        anns_field=<span class="hljs-string">&quot;dense_vector&quot;</span>,
        param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;ef&quot;</span>: <span class="hljs-number">128</span>}},
        limit=top_k * <span class="hljs-number">2</span>       <span class="hljs-comment"># Widen candidate set, let RRF do final ranking</span>
    )

    <span class="hljs-comment"># 3. BM25 sparse vector retrieval (exact term matching)</span>
    bm25_req = AnnSearchRequest(
        data=[query],
        anns_field=<span class="hljs-string">&quot;sparse_vector&quot;</span>,
        param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>},
        limit=top_k * <span class="hljs-number">2</span>
    )

    <span class="hljs-comment"># 4. RRF fusion ranking</span>
    results = client.hybrid_search(
        collection_name=COLLECTION,
        reqs=[dense_req, bm25_req],
        ranker=RRFRanker(k=<span class="hljs-number">60</span>),
        limit=top_k,
        output_fields=[<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;source&quot;</span>, <span class="hljs-string">&quot;doc_type&quot;</span>]
    )

    <span class="hljs-keyword">return</span> [
        {
            <span class="hljs-string">&quot;text&quot;</span>:     r.entity.get(<span class="hljs-string">&quot;text&quot;</span>),
            <span class="hljs-string">&quot;source&quot;</span>:   r.entity.get(<span class="hljs-string">&quot;source&quot;</span>),
            <span class="hljs-string">&quot;doc_type&quot;</span>: r.entity.get(<span class="hljs-string">&quot;doc_type&quot;</span>),
            <span class="hljs-string">&quot;score&quot;</span>:    <span class="hljs-built_in">round</span>(r.distance, <span class="hljs-number">4</span>)
        }
        <span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]
    ]

<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    query= sys.argv[<span class="hljs-number">1</span>] <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(sys.argv) &gt; <span class="hljs-number">1</span> <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;&quot;</span>
    top_k  = <span class="hljs-built_in">int</span>(sys.argv[<span class="hljs-number">2</span>]) <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(sys.argv) &gt; <span class="hljs-number">2</span> <span class="hljs-keyword">else</span> <span class="hljs-number">5</span>
    output = hybrid_search(query, top_k)
    <span class="hljs-built_in">print</span>(json.dumps(output, ensure_ascii=<span class="hljs-literal">False</span>, indent=<span class="hljs-number">2</span>))
<button class="copy-code-btn"></button></code></pre>
<p><strong>يعمل الطلب الكثيف على توسيع مجموعة المرشحين بمقدار 2× بحيث يكون لدى RRF ما يكفي للترتيب منها.</strong> <code translate="no">text-embedding-3-small</code> هو أرخص تضمين OpenAI الذي لا يزال يحتفظ بجودة الاسترجاع؛ قم بالتبديل في <code translate="no">text-embedding-3-large</code> إذا سمحت الميزانية.</p>
<p>مع تجهيز البيئة والقاعدة المعرفية، يضع القسم التالي حلقة التعلم على المحك.</p>
<h2 id="Hermes-Skill-Auto-Generation-in-Practice" class="common-anchor-header">التوليد التلقائي لمهارات هيرميس في الممارسة العملية<button data-href="#Hermes-Skill-Auto-Generation-in-Practice" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>تُظهر جلستان حلقة التعلم أثناء العمل.</strong> في الأولى، يقوم المستخدم بتسمية البرنامج النصي يدويًا. في الثانية، تطرح جلسة جديدة نفس السؤال دون تسمية البرنامج النصي. يلتقط هيرميس النمط ويكتب ثلاث مهارات.</p>
<h3 id="Session-1-Call-the-Script-by-Hand" class="common-anchor-header">الجلسة 1: استدعاء البرنامج النصي يدويًا</h3><p>افتح Hermes في Lark. أعطه مسار البرنامج النصي وهدف الاسترجاع. يستدعي هيرمز الأداة الطرفية ويقوم بتشغيل النص البرمجي ويعيد الإجابة مع إسناد المصدر. <strong>لا توجد مهارة بعد. هذا استدعاء عادي للأداة.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_7_1c2d9261f4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Session-2-Ask-Without-Naming-the-Script" class="common-anchor-header">الجلسة 2: اسأل دون تسمية البرنامج النصي</h3><p>امسح المحادثة. ابدأ من جديد. اسأل نفس فئة السؤال دون ذكر النص البرمجي أو المسار.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_8_27253eda82.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Memory-Writes-First-Skill-Follows" class="common-anchor-header">تكتب الذاكرة أولاً، تتبعها المهارة</h3><p><strong>تسجل حلقة التعلم سير العمل (البرنامج النصي والوسائط وشكل الإرجاع) وتعيد الإجابة.</strong> تحتفظ الذاكرة بالتتبع؛ لا توجد مهارة بعد.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_9_a0768f84bd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>تخبر مطابقة الجلسة الثانية الحلقة أن النمط يستحق الاحتفاظ بالنمط.</strong> عندما تنطلق، تتم كتابة ثلاث مهارات:</p>
<table>
<thead>
<tr><th>المهارة</th><th>الدور</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">hybrid-search-doc-qa</code></td><td>تشغيل بحث دلالي هجين + بحث بالكلمات المفتاحية على الذاكرة وتكوين الإجابة</td></tr>
<tr><td><code translate="no">milvus-docs-ingest-verification</code></td><td>التحقق من إدخال المستندات في القاعدة المعرفية</td></tr>
<tr><td><code translate="no">terminal</code></td><td>تشغيل أوامر الصدفة: البرامج النصية وإعداد البيئة والفحص</td></tr>
</tbody>
</table>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_10_b68e35bc46.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>من هذه النقطة، <strong>يتوقف المستخدمون عن تسمية المهارات.</strong> يستنتج Hermes القصد، ويوجه إلى المهارة، ويسحب الأجزاء ذات الصلة من الذاكرة، ويكتب الإجابة. لا يوجد محدد مهارة في المطالبة.</p>
<p>تحل معظم أنظمة RAG (التوليد المعزز للاسترجاع) مشكلة التخزين والجلب، ولكن منطق الجلب نفسه مشفر بشكل ثابت في كود التطبيق. اطلب بطريقة مختلفة أو بسيناريو جديد، وستتعطل عملية الاسترجاع. يقوم Hermes بتخزين استراتيجية الجلب كمهارة ، مما يعني <strong>أن مسار الجلب يصبح مستندًا يمكنك قراءته وتحريره وإصداره.</strong> السطر <code translate="no">💾 Memory updated · Skill 'hybrid-search-doc-qa' created</code> ليس علامة اكتمال الإعداد. إنه <strong>الوكيل يقوم بتخزين نمط سلوك في الذاكرة طويلة المدى.</strong></p>
<h2 id="Hermes-vs-OpenClaw-Accumulation-vs-Orchestration" class="common-anchor-header">هيرميس مقابل أوبن كلو التراكم مقابل التنسيق<button data-href="#Hermes-vs-OpenClaw-Accumulation-vs-Orchestration" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>يجيب Hermes و OpenClaw على مشاكل مختلفة.</strong> تم تصميم Hermes لعامل واحد يراكم الذاكرة والمهارات عبر الجلسات. تم تصميم OpenClaw لتقسيم مهمة معقدة إلى أجزاء وتسليم كل جزء إلى وكيل متخصص.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_11_afcb575d50.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>تكمن قوة OpenClaw في التنسيق. فهو يعمل على تحسين مقدار المهمة التي يتم إنجازها تلقائيًا. قوة Hermes هي التراكم: وكيل واحد يتذكر عبر الجلسات، مع مهارات تنمو من الاستخدام. تعمل Hermes على تحسين السياق طويل الأجل وخبرة المجال.</p>
<p><strong>يتراكم الإطاران.</strong> يشحن Hermes مسار ترحيل من خطوة واحدة يسحب الذاكرة والمهارات <code translate="no">~/.openclaw</code> إلى طبقات ذاكرة Hermes. يمكن أن توضع كومة تزامن في الأعلى، مع وجود عامل تجميع تحتها.</p>
<p>للاطلاع على جانب OpenClaw من الانقسام، راجع <a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">ما هو OpenClaw؟</a> <a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">الدليل الكامل لعامل الذكاء الاصطناعي مفتوح المصدر</a> على مدونة ميلفوس.</p>
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
    </button></h2><p>تحوّل حلقة التعلّم في Hermes حلقة التعلّم من هيرميس سير العمل المتكرر إلى مهارات قابلة لإعادة الاستخدام، ولكن فقط إذا كان الاسترجاع يمكن أن يربطها عبر الجلسات. لا يمكن البحث بالكلمات الرئيسية في FTS5. يمكن <a href="https://milvus.io/docs/multi-vector-search.md"><strong>لميلفوس 2.6 البحث الهجين</strong></a> أن يفعل ذلك: المتجهات الكثيفة تتعامل مع المعنى، و BM25 تتعامل مع الكلمات المفتاحية الدقيقة، و RRF تدمج الاثنين، <a href="https://milvus.io/docs/tiered-storage-overview.md">والتخزين المتدرج</a> يحافظ على المكدس بأكمله على VPS 5 دولارات شهريًا.</p>
<p>النقطة الأهم: بمجرد أن يعمل الاسترجاع، لا يخزن الوكيل إجابات أفضل فحسب: بل يخزن استراتيجيات استرجاع أفضل كمهارات. يصبح مسار الاسترجاع وثيقة قابلة للإصدار تتحسن مع الاستخدام. هذا ما يفصل الوكيل الذي يراكم خبرة المجال عن الوكيل الذي يبدأ من جديد في كل جلسة. للحصول على مقارنة لكيفية تعامل الوكلاء الآخرين مع هذه المشكلة (أو فشلهم في التعامل معها)، راجع <a href="https://milvus.io/blog/claude-code-memory-memsearch.md">شرح نظام ذاكرة كلود كود.</a></p>
<h2 id="Get-Started" class="common-anchor-header">البدء<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>جرّب الأدوات الموجودة في هذه المقالة:</strong></p>
<ul>
<li><a href="https://github.com/NousResearch/hermes-agent">وكيل Hermes Agent على GitHub</a> - تثبيت البرنامج النصي وإعداد الموفر وتهيئة القناة المستخدمة أعلاه.</li>
<li><a href="https://milvus.io/docs/install_standalone-docker.md">ميلفوس 2.6 ميلفوس 2.6 كويكستارت المستقلة</a> - نشر Docker أحادي العقدة للواجهة الخلفية لقاعدة المعرفة.</li>
<li><a href="https://milvus.io/docs/multi-vector-search.md">برنامج تعليمي للبحث الهجين Milvus Hybrid Search</a> - مثال كثيف كامل + BM25 + RRF مطابق للبرنامج النصي في هذا المنشور.</li>
</ul>
<p><strong>هل لديك أسئلة حول البحث الهجين Hermes + Milvus الهجين؟</strong></p>
<ul>
<li>انضم إلى Milvus <a href="https://discord.gg/milvus">Discord</a> للاستفسار عن البحث الهجين أو التخزين المتدرج أو أنماط توجيه المهارات - المطورون الآخرون يبنون حزمًا مماثلة.</li>
<li><a href="https://milvus.io/community#office-hours">احجز جلسة ساعات العمل في Milvus Office Hours</a> للتعرف على إعداد الوكيل الخاص بك + إعداد قاعدة المعرفة مع فريق Milvus.</li>
</ul>
<p><strong>هل تريد تخطي الاستضافة الذاتية؟</strong></p>
<ul>
<li>قم<a href="https://cloud.zilliz.com/signup">بالتسجيل</a> أو <a href="https://cloud.zilliz.com/login">تسجيل الدخول</a> إلى Zilliz Cloud - Milvus المُدار مع البحث الهجين والتخزين المتدرج خارج الصندوق. تحصل حسابات العمل-البريد الإلكتروني الجديدة على <strong> رصيد مجاني بقيمة 100 دولار</strong>.</li>
</ul>
<h2 id="Further-Reading" class="common-anchor-header">مزيد من القراءة<button data-href="#Further-Reading" class="anchor-icon" translate="no">
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
<li><a href="https://milvus.io/docs/release_notes.md">ملاحظات الإصدار Milvus 2.6 ملاحظات الإصدار</a> - التخزين المتدرج، البحث المختلط، تغييرات المخطط</li>
<li><a href="https://zilliz.com/blog">زيليز كلاود وميلفوس CLI + المهارات الرسمية</a> - أدوات تشغيلية لوكلاء ميلفوس الأصليين</li>
<li><a href="https://zilliz.com/blog">لماذا تتعطل إدارة المعرفة بأسلوب RAG للوكلاء</a> - حالة تصميم الذاكرة الخاصة بالوكلاء</li>
<li><a href="https://zilliz.com/blog">نظام الذاكرة الخاص بكلود كود أكثر بدائية مما تتوقع</a> - قطعة مقارنة على مكدس ذاكرة وكيل آخر</li>
</ul>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">الأسئلة المتداولة<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="How-does-Hermes-Agents-Skill-Learning-Loop-actually-work" class="common-anchor-header">كيف تعمل حلقة تعلم المهارات الخاصة بوكيل Hermes في الواقع؟</h3><p>يسجل Hermes كل سير عمل يقوم بتشغيله - النص البرمجي الذي تم استدعاؤه والوسائط التي تم تمريرها وشكل الإرجاع - كتتبع للذاكرة. عندما يظهر نفس النمط عبر جلستين أو أكثر، تقوم حلقة التعلم بإطلاق حلقة التعلم وكتابة مهارة قابلة لإعادة الاستخدام: ملف Markdown الذي يلتقط سير العمل كإجراء قابل للتكرار. من تلك النقطة فصاعدًا، يقوم Hermes بالتوجيه إلى المهارة حسب القصد فقط، دون أن يقوم المستخدم بتسميتها. التبعية الحرجة هي الاسترجاع - لا تنطلق الحلقة إلا إذا تمكنت من العثور على تتبع الجلسة السابقة، وهذا هو السبب في أن البحث بالكلمات المفتاحية فقط يصبح عنق الزجاجة على نطاق واسع.</p>
<h3 id="Whats-the-difference-between-hybrid-search-and-vector-only-search-for-agent-memory" class="common-anchor-header">ما الفرق بين البحث الهجين والبحث المتجه فقط لذاكرة الوكيل؟</h3><p>يعالج البحث المتجه فقط المعنى بشكل جيد ولكنه يفتقد التطابق التام. إذا قام أحد المطورين بلصق سلسلة خطأ مثل ConnectionResetError أو اسم دالة مثل find_similar_task، فقد يؤدي البحث المتجه البحت إلى إرجاع نتائج ذات صلة دلالية ولكن خاطئة. يجمع البحث الهجين بين المتجهات الكثيفة (الدلالية) مع BM25 (الكلمات المفتاحية) ويدمج مجموعتي النتائج مع دمج الرتب المتبادلة. بالنسبة لذاكرة الوكيل - حيث تتراوح الاستعلامات من القصد المبهم ("تزامن بايثون") إلى الرموز الدقيقة - يغطي البحث الهجين كلا الطرفين في مكالمة واحدة دون منطق التوجيه في طبقة التطبيق الخاص بك.</p>
<h3 id="Can-I-use-Milvus-hybrid-search-with-AI-agents-other-than-Hermes" class="common-anchor-header">هل يمكنني استخدام بحث Milvus الهجين مع وكلاء ذكاء اصطناعي غير Hermes؟</h3><p>نعم، فنمط التكامل عام: يستدعي الوكيل برنامج نصي للاسترجاع، ويستفسر البرنامج النصي عن Milvus، وتعود النتائج كقطع مرتبة مع بيانات تعريف المصدر. يمكن لأي إطار عمل وكيل يدعم استدعاءات الأدوات أو تنفيذ الصدفة استخدام نفس النهج. يصادف أن يكون Hermes ملائمًا بقوة لأن حلقة التعلم الخاصة به تعتمد تحديدًا على الاسترجاع عبر الجلسات لتفعيلها، لكن جانب Milvus لا يعتمد على الوكيل - فهو لا يعرف أو يهتم بالوكيل الذي يستدعيه.</p>
<h3 id="How-much-does-a-self-hosted-Milvus-+-Hermes-setup-cost-per-month" class="common-anchor-header">كم يكلف إعداد Milvus + Hermes المستضاف ذاتيًا شهريًا؟</h3><p>تعمل عقدة Milvus 2.6 المستقلة ذات العقدة الواحدة على خادم خاص افتراضي مستقل ثنائي النواة / 4 غيغابايت مع تخزين متدرج بحوالي <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>5</mi><mi mathvariant="normal"></mi><mi>/</mi><mi mathvariant="normal"> شهر</mi></mrow><annotation encoding="application/x-tex">.</annotation><annotation encoding="application/x-tex"></annotation></semantics></math></span></span><span class="strut" style="height:1em;vertical-align:-0.25em;"></span> يكلف <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex"></annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord mathnormal">OpenAItext</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">-</span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span><span class="mord mathnormal">التضمين</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">-</span></span><span class="base"><span class="mord mathnormal" style="margin-right:0.03588em;">التضمين</span><span class="mbin">-</span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span><span class="mord"> </span></span></span></span>3 <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">-</span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord mathnormal"> </span><span class="strut" style="height:0.6944em;"></span> <span class="mord mathnormal">صغير</span><span class="mord mathnormal" style="margin-right:0.01968em;">التكلفة 0</span></span></span></span>.02 لكل مليون رمز - بضعة سنتات شهريًا لقاعدة المعرفة الشخصية <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">.</span></span></span></span>يهيمن استدلال LLM على التكلفة الإجمالية ويتدرج مع الاستخدام، وليس مع كومة الاسترجاع.</p>
