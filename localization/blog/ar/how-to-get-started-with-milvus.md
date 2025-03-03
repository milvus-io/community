---
id: how-to-get-started-with-milvus.md
title: كيف تبدأ مع ميلفوس
author: Ruben Winastwan
date: 2025-01-17T00:00:00.000Z
cover: >-
  assets.zilliz.com/How_To_Get_Started_With_Milvus_20230517_084248_28560b1efc.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: false
canonicalUrl: 'https://milvus.io/blog/how-to-get-started-with-milvus.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/How_To_Get_Started_With_Milvus_20230517_084248_28560b1efc.png" alt="How to get started with Milvus" class="doc-image" id="how-to-get-started-with-milvus" />
   </span> <span class="img-wrapper"> <span>كيف تبدأ مع ميلفوس</span> </span></p>
<p><strong><em>آخر تحديث يناير 2025</em></strong></p>
<p>تستلزم التطورات في نماذج اللغات الكبيرة<a href="https://zilliz.com/glossary/large-language-models-(llms)">(LLMs)</a> وتزايد حجم البيانات وجود بنية تحتية مرنة وقابلة للتطوير لتخزين كميات هائلة من المعلومات، مثل قاعدة البيانات. ومع ذلك، فإن <a href="https://zilliz.com/blog/relational-databases-vs-vector-databases">قواعد البيانات التقليدية</a> مصممة لتخزين البيانات المجدولة والمنظمة، في حين أن المعلومات المفيدة عادةً للاستفادة من قوة نماذج اللغات الكبيرة وخوارزميات استرجاع المعلومات المتطورة هي معلومات <a href="https://zilliz.com/learn/introduction-to-unstructured-data">غير منظمة،</a> مثل النصوص أو الصور أو مقاطع الفيديو أو الصوت.</p>
<p><a href="https://zilliz.com/learn/what-is-vector-database">قواعد البيانات المتجهة</a> هي أنظمة قواعد بيانات مصممة خصيصًا للبيانات غير المنظمة. لا يمكننا فقط تخزين كميات هائلة من البيانات غير المهيكلة باستخدام قواعد البيانات المتجهة فحسب، بل يمكننا أيضًا إجراء <a href="https://zilliz.com/learn/vector-similarity-search">عمليات بحث متجهة</a> باستخدامها. تحتوي قواعد البيانات المتجهة على طرق فهرسة متقدمة مثل فهرس الملفات المقلوب (IVFFlat) أو العالم الصغير المتجهي الهرمي القابل للتنقل<a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">(HNSW</a>) لإجراء عمليات بحث واسترجاع معلومات سريعة وفعالة عن المتجهات.</p>
<p><strong>Milvus</strong> هي قاعدة بيانات متجهات مفتوحة المصدر يمكننا استخدامها للاستفادة من جميع الميزات المفيدة التي يمكن أن تقدمها قاعدة بيانات المتجهات. فيما يلي ما سنتناوله في هذا المنشور:</p>
<ul>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#What-is-Milvus">نظرة عامة على ملفوس</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#Milvus-Deployment-Options">خيارات نشر ميلفوس</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#Getting-Started-with-Milvus-Lite">البدء باستخدام ميلفوس لايت</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#Getting-Started-with-Milvus-Standalone">البدء باستخدام ميلفوس مستقل</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#Fully-Managed-Milvus">ميلفوس المُدار بالكامل </a></p></li>
</ul>
<h2 id="What-is-Milvus" class="common-anchor-header">ما هو ميلفوس؟<button data-href="#What-is-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/overview.md"><strong>Milvus</strong> عبارة </a>عن قاعدة بيانات متجهة مفتوحة المصدر تمكننا من تخزين كميات هائلة من البيانات غير المنظمة وإجراء عمليات بحث متجهة سريعة وفعالة عليها. تُعد Milvus مفيدة للغاية للعديد من تطبيقات GenAI الشائعة، مثل أنظمة التوصيات، وروبوتات الدردشة المخصصة، واكتشاف الشذوذ، والبحث عن الصور، ومعالجة اللغة الطبيعية، والجيل المعزز للاسترجاع<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">(RAG)</a>.</p>
<p>هناك العديد من المزايا التي يمكنك الحصول عليها باستخدام Milvus كقاعدة بيانات متجهة:</p>
<ul>
<li><p>يوفر Milvus خيارات نشر متعددة يمكنك الاختيار من بينها اعتمادًا على حالة استخدامك وحجم التطبيقات التي تريد إنشاءها.</p></li>
<li><p>يدعم Milvus مجموعة متنوعة من طرق الفهرسة لتلبية مختلف احتياجات البيانات والأداء، بما في ذلك الخيارات داخل الذاكرة مثل FLAT وIVFFlat وHNSW <a href="https://zilliz.com/learn/what-is-scann-scalable-nearest-neighbors-google">وSCANN،</a> والمتغيرات الكمية لكفاءة الذاكرة، <a href="https://zilliz.com/learn/DiskANN-and-the-Vamana-Algorithm">وDANN</a> على القرص لمجموعات البيانات الكبيرة، والفهارس المحسّنة لوحدة معالجة الرسومات مثل GPU_CAGRA وGPU_IVF_FLAT وGPU_IVF_PQ لعمليات البحث المتسارعة والفعالة من حيث الذاكرة.</p></li>
<li><p>كما يوفر Milvus أيضًا بحثًا هجينًا، حيث يمكننا استخدام مزيج من التضمينات الكثيفة والتضمينات المتفرقة وتصفية البيانات الوصفية أثناء عمليات البحث المتجه، مما يؤدي إلى نتائج استرجاع أكثر دقة. بالإضافة إلى ذلك، يدعم <a href="https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md">Milvus 2.5</a> الآن <a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">بحثًا</a> هجينًا <a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">عن النص الكامل</a> والبحث المتجه، مما يجعل عملية الاسترجاع أكثر دقة.</p></li>
<li><p>يمكن استخدام Milvus بشكل كامل على السحابة عبر <a href="https://zilliz.com/cloud">Zilliz Cloud،</a> حيث يمكنك تحسين تكاليفه التشغيلية وسرعة البحث المتجه بفضل أربع ميزات متقدمة: المجموعات المنطقية، وتصنيف البيانات المتدفقة والتاريخية، والتخزين المتدرج، والتوسيع التلقائي، والفصل بين الإيجارات المتعددة.</p></li>
</ul>
<p>عند استخدام Milvus كقاعدة بيانات متجهة، يمكنك اختيار ثلاثة خيارات نشر مختلفة، لكل منها نقاط قوته وفوائده. سنتحدث عن كل منها في القسم التالي.</p>
<h2 id="Milvus-Deployment-Options" class="common-anchor-header">خيارات نشر ميلفوس<button data-href="#Milvus-Deployment-Options" class="anchor-icon" translate="no">
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
    </button></h2><p>يمكننا الاختيار من بين أربعة خيارات للنشر لبدء استخدام ميلفوس: ميلفوس <strong>لايت، ميلفوس مستقل، ميلفوس الموزع، وزيليز كلاود (ميلفوس المدارة).</strong> تم تصميم كل خيار نشر ليناسب سيناريوهات مختلفة في حالة استخدامنا، مثل حجم بياناتنا، والغرض من تطبيقنا، وحجم تطبيقنا.</p>
<h3 id="Milvus-Lite" class="common-anchor-header">ميلفوس لايت</h3><p>Milvus<a href="https://milvus.io/docs/quickstart.md"><strong>Lite</strong></a> هو إصدار خفيف الوزن من Milvus وأسهل طريقة بالنسبة لنا للبدء. في القسم التالي، سنرى في القسم التالي كيف يمكننا تشغيل ميلفوس لايت، وكل ما علينا فعله للبدء هو تثبيت مكتبة Pymilvus باستخدام pip. بعد ذلك، يمكننا تنفيذ معظم الوظائف الأساسية لـ Milvus كقاعدة بيانات متجهة.</p>
<p>يعد Milvus Lite مثاليًا لأغراض النماذج الأولية السريعة أو لأغراض التعلم ويمكن تشغيله في دفتر ملاحظات Jupyter دون أي إعداد معقد. فيما يتعلق بتخزين المتجهات، فإن Milvus Lite مناسب لتخزين ما يصل إلى مليون متجه تقريبًا. نظرًا لخفة وزنه وسعته التخزينية، يعد Milvus Lite خيارًا مثاليًا للنشر للعمل مع الأجهزة المتطورة، مثل محرك البحث عن المستندات الخاصة، واكتشاف الكائنات على الجهاز، وما إلى ذلك.</p>
<h3 id="Milvus-Standalone" class="common-anchor-header">ميلفوس مستقل</h3><p>Milvus Standalone هو عبارة عن نشر خادم أحادي الجهاز معبأ في صورة Docker. لذلك، كل ما علينا فعله للبدء هو تثبيت Milvus في Docker، ثم بدء تشغيل حاوية Docker. سنرى أيضًا التنفيذ التفصيلي لـ Milvus Standalone في القسم التالي.</p>
<p>يعتبر Milvus Standalone مثاليًا لبناء وإنتاج تطبيقات صغيرة إلى متوسطة الحجم، حيث أنه قادر على تخزين ما يصل إلى 10 ملايين من التضمينات المتجهة. بالإضافة إلى ذلك، يوفر Milvus Standalone توافرًا عاليًا من خلال وضع النسخ الاحتياطي الأساسي، مما يجعله موثوقًا للغاية للاستخدام في التطبيقات الجاهزة للإنتاج.</p>
<p>يمكننا أيضًا استخدام Milvus Standalone، على سبيل المثال، بعد إجراء نماذج أولية سريعة وتعلم وظائف Milvus مع Milvus Lite، حيث يشترك كل من Milvus Standalone و Milvus Lite في نفس واجهة برمجة التطبيقات من جانب العميل.</p>
<h3 id="Milvus-Distributed" class="common-anchor-header">ميلفوس الموزع</h3><p>Milvus Distributed هو خيار نشر يستفيد من بنية قائمة على السحابة، حيث يتم التعامل مع استيعاب البيانات واسترجاعها بشكل منفصل، مما يسمح بتطبيق عالي الكفاءة وقابل للتطوير.</p>
<p>لتشغيل Milvus Distributed، نحتاج عادةً إلى استخدام مجموعة Kubernetes للسماح بتشغيل الحاوية على أجهزة وبيئات متعددة. يضمن تطبيق مجموعة Kubernetes العنقودية قابلية التوسع والمرونة في تطبيق Milvus Distributed في تخصيص الموارد المخصصة حسب الطلب وعبء العمل. وهذا يعني أيضًا أنه في حالة فشل أحد الأجزاء، يمكن أن يحل محله أجزاء أخرى، مما يضمن بقاء النظام بأكمله دون انقطاع.</p>
<p>يستطيع نظام Milvus Distributed التعامل مع ما يصل إلى عشرات المليارات من التضمينات المتجهة وهو مصمم خصيصًا لحالات الاستخدام التي تكون فيها البيانات كبيرة جدًا بحيث لا يمكن تخزينها في جهاز خادم واحد. لذلك، فإن خيار النشر هذا مثالي لعملاء المؤسسات التي تخدم قاعدة مستخدمين كبيرة.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Vector_embedding_storage_capability_of_different_Milvus_deployment_options_e3959ccfcd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>الشكل: إمكانية تخزين متجه التضمين المتجه لخيارات النشر المختلفة لـ Milvus.</em></p>
<p>في هذه المقالة، سنوضح لك كيفية البدء باستخدام كل من Milvus Lite و Milvus Standalone، حيث يمكنك البدء بسرعة باستخدام كلا الطريقتين دون الحاجة إلى إعداد معقد. ومع ذلك، فإن إعداد Milvus Distributed أكثر تعقيدًا. بمجرد إعداد Milvus Distributed، تتشابه التعليمات البرمجية والعملية المنطقية لإنشاء المجموعات واستيعاب البيانات وإجراء البحث المتجه وما إلى ذلك مع Milvus Lite و Milvus Standalone، حيث يتشاركان نفس واجهة برمجة التطبيقات من جانب العميل.</p>
<p>بالإضافة إلى خيارات النشر الثلاثة المذكورة أعلاه، يمكنك أيضًا تجربة Milvus المُدارة على <a href="https://zilliz.com/cloud">Zilliz Cloud</a> لتجربة خالية من المتاعب. سنتحدث أيضًا عن Zilliz Cloud لاحقًا في هذه المقالة.</p>
<h2 id="Getting-Started-with-Milvus-Lite" class="common-anchor-header">البدء باستخدام ميلفوس لايت<button data-href="#Getting-Started-with-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>يمكن تنفيذ Milvus Lite على الفور باستخدام Python عن طريق استيراد مكتبة تسمى Pymilvus باستخدام pip. قبل تثبيت Pymilvus، تأكد من أن بيئتك تفي بالمتطلبات التالية:</p>
<ul>
<li><p>أوبونتو &gt;= 20.04 (x86_64 و arm64)</p></li>
<li><p>MacOS &gt;= 11.0 (Apple Silicon M1/M2 و x86_64)</p></li>
<li><p>بايثون 3.7 أو أحدث</p></li>
</ul>
<p>بمجرد استيفاء هذه المتطلبات، يمكنك تثبيت Milvus Lite والتبعيات اللازمة للعرض التوضيحي باستخدام الأمر التالي:</p>
<pre><code translate="no">!pip install -U pymilvus
!pip install <span class="hljs-string">&quot;pymilvus[model]&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><p><code translate="no">!pip install -U pymilvus</code>: يقوم هذا الأمر بتثبيت أو ترقية مكتبة <code translate="no">pymilvus</code> ، وهي مجموعة أدوات تطوير البرمجيات الخاصة بـ Python SDK الخاصة بـ Milvus. يتم تجميع Milvus Lite مع PyMilvus، لذا فإن هذا السطر الوحيد من التعليمات البرمجية هو كل ما تحتاجه لتثبيت Milvus Lite.</p></li>
<li><p><code translate="no">!pip install &quot;pymilvus[model]&quot;</code>: يضيف هذا الأمر ميزات متقدمة وأدوات إضافية مدمجة مسبقًا مع Milvus، بما في ذلك نماذج التعلم الآلي مثل محولات تعانق الوجوه، ونماذج تضمين الذكاء الاصطناعي جينا، ونماذج إعادة ترتيب النماذج.</p></li>
</ul>
<p>فيما يلي الخطوات التي سنتبعها مع Milvus Lite:</p>
<ol>
<li><p>تحويل البيانات النصية إلى تمثيل التضمين الخاص بها باستخدام نموذج تضمين.</p></li>
<li><p>إنشاء مخطط في قاعدة بيانات Milvus لتخزين بياناتنا النصية وتمثيلات التضمين الخاصة بها.</p></li>
<li><p>تخزين بياناتنا وفهرستها في مخططنا.</p></li>
<li><p>إجراء بحث متجه بسيط على البيانات المخزنة.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Workflow_of_vector_search_operation_3e38ccc1f4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>الشكل: سير عمل عملية البحث المتجه.</em></p>
<p>لتحويل البيانات النصية إلى تضمينات متجهة، سنستخدم <a href="https://zilliz.com/ai-models">نموذج تضمين</a> من SentenceTransformers يسمى "all-MiniLM-L6-v2". يقوم نموذج التضمين هذا بتحويل نصنا إلى تضمين متجه ذي 384 بُعدًا. لنقم بتحميل النموذج وتحويل بياناتنا النصية وتجميع كل شيء معًا.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model

docs = [
    <span class="hljs-string">&quot;Artificial intelligence was founded as an academic discipline in 1956.&quot;</span>,
    <span class="hljs-string">&quot;Alan Turing was the first person to conduct substantial research in AI.&quot;</span>,
    <span class="hljs-string">&quot;Born in Maida Vale, London, Turing was raised in southern England.&quot;</span>,
]

sentence_transformer_ef = model.dense.SentenceTransformerEmbeddingFunction(
    model_name=<span class="hljs-string">&#x27;all-MiniLM-L6-v2&#x27;</span>, 
    device=<span class="hljs-string">&#x27;cpu&#x27;</span> 
)

vectors  = sentence_transformer_ef.encode_documents(docs)
data = [ {<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: vectors[i], <span class="hljs-string">&quot;text&quot;</span>: docs[i]} <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(vectors)) ]
<button class="copy-code-btn"></button></code></pre>
<p>بعد ذلك، دعنا ننشئ مخططًا لتخزين جميع البيانات أعلاه في ميلفوس. كما ترى أعلاه، تتكون بياناتنا من ثلاثة حقول: المعرف والمتجه والنص. لذلك، سنقوم بإنشاء مخطط بهذه الحقول الثلاثة.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

schema = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">False</span>,
    enable_dynamic_field=<span class="hljs-literal">True</span>,
)

<span class="hljs-comment"># Add fields to schema</span>
schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;vector&quot;</span>, datatype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">384</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">512</span>)
<button class="copy-code-btn"></button></code></pre>
<p>باستخدام Milvus Lite، يمكننا بسهولة إنشاء مجموعة على قاعدة بيانات معينة استنادًا إلى المخطط المحدد أعلاه، بالإضافة إلى إدراج البيانات وفهرستها في المجموعة في بضعة أسطر من التعليمات البرمجية.</p>
<pre><code translate="no" class="language-python">client = MilvusClient(<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)

index_params = client.prepare_index_params()

<span class="hljs-comment">#  Add indexes</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;vector&quot;</span>, 
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>
)

<span class="hljs-comment"># Create collection</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    schema=schema,
    index_params=index_params
)

<span class="hljs-comment"># Insert data into collection</span>
res = client.insert(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    data=data
)
<button class="copy-code-btn"></button></code></pre>
<p>في الكود أعلاه، ننشئ مجموعة تسمى &quot;demo_collection&quot; داخل قاعدة بيانات Milvus باسم &quot;milvus_demo&quot;. بعد ذلك، نقوم بفهرسة جميع بياناتنا في "demo_collection" التي أنشأناها للتو.</p>
<p>الآن بعد أن أصبح لدينا بياناتنا داخل قاعدة البيانات، يمكننا إجراء بحث متجه عليها لأي استعلام معين. لنفترض أن لدينا استعلام: &quot;<em>من هو آلان تورينج؟</em> يمكننا الحصول على الإجابة الأنسب للاستعلام من خلال تنفيذ الخطوات التالية:</p>
<ol>
<li><p>تحويل استعلامنا إلى تضمين متجه باستخدام نفس نموذج التضمين الذي استخدمناه لتحويل بياناتنا في قاعدة البيانات إلى تضمينات.</p></li>
<li><p>احسب التشابه بين تضمين الاستعلام لدينا وتضمين كل إدخال في قاعدة البيانات باستخدام مقاييس مثل تشابه جيب التمام أو المسافة الإقليدية.</p></li>
<li><p>جلب الإدخال الأكثر تشابهًا باعتباره الإجابة المناسبة لاستعلامنا.</p></li>
</ol>
<p>فيما يلي تنفيذ الخطوات المذكورة أعلاه باستخدام Milvus:</p>
<pre><code translate="no" class="language-python">query = [<span class="hljs-string">&quot;Who is Alan Turing&quot;</span>]
query_embedding = sentence_transformer_ef.encode_queries(query)

<span class="hljs-comment"># Load collection</span>
client.load_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>
)

<span class="hljs-comment"># Vector search</span>
res = client.search(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    data=query_embedding,
    limit=<span class="hljs-number">1</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
)
<span class="hljs-built_in">print</span>(res)
<span class="hljs-string">&quot;&quot;&quot;
Output:
data: [&quot;[{&#x27;id&#x27;: 1, &#x27;distance&#x27;: 0.7199002504348755, &#x27;entity&#x27;: {&#x27;text&#x27;: &#x27;Alan Turing was the first person to conduct substantial research in AI.&#x27;}}]&quot;] 
&quot;&quot;&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>وهذا كل شيء! يمكنك أيضًا معرفة المزيد حول الوظائف الأخرى التي يقدمها ملفوس، مثل إدارة قواعد البيانات، وإدراج المجموعات وحذفها، واختيار طريقة الفهرسة المناسبة، وإجراء عمليات بحث متجهية أكثر تقدمًا باستخدام تصفية البيانات الوصفية والبحث المختلط في <a href="https://milvus.io/docs/">وثائق ملفوس</a>.</p>
<h2 id="Getting-Started-with-Milvus-Standalone" class="common-anchor-header">الشروع في العمل مع ميلفوس Standalone<button data-href="#Getting-Started-with-Milvus-Standalone" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Standalone هو خيار نشر يتم فيه تعبئة كل شيء في حاوية Docker. لذلك، نحتاج إلى تثبيت Milvus في Docker ثم بدء تشغيل حاوية Docker لبدء استخدام Milvus Standalone.</p>
<p>قبل تثبيت Milvus Standalone، تأكد من استيفاء كل من أجهزتك وبرامجك للمتطلبات الموضحة في <a href="https://milvus.io/docs/prerequisite-docker.md">هذه الصفحة</a>. تأكد أيضًا من تثبيت Docker. لتثبيت Docker، راجع <a href="https://docs.docker.com/get-started/get-docker/">هذه الصفحة</a>.</p>
<p>بمجرد أن يستوفي نظامنا المتطلبات وقمنا بتثبيت Docker، يمكننا متابعة تثبيت Milvus في Docker باستخدام الأمر التالي:</p>
<pre><code translate="no" class="language-shell"><span class="hljs-comment"># Download the installation script</span>
$ curl -sfL &lt;https://raw.githubusercontent.com/milvus-io/milvus/master/scripts/standalone_embed.sh&gt; -o standalone_embed.sh

<span class="hljs-comment"># Start the Docker container</span>
$ bash standalone_embed.sh start
<button class="copy-code-btn"></button></code></pre>
<p>في الشيفرة أعلاه، نبدأ أيضًا ببدء تشغيل حاوية Docker وبمجرد بدء تشغيلها، ستحصل على مخرجات مشابهة كما هو موضح أدناه:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Message_after_successful_starting_of_the_Docker_container_5c60fa15dd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>الشكل: رسالة بعد بدء تشغيل حاوية Docker بنجاح.</em></p>
<p>بعد تشغيل البرنامج النصي للتثبيت "standalone_embed.sh" أعلاه، يتم بدء تشغيل حاوية Docker المسماة "milvus" على المنفذ 19530. لذلك، يمكننا إنشاء قاعدة بيانات جديدة وكذلك الوصول إلى جميع الأشياء المتعلقة بقاعدة بيانات Milvus من خلال الإشارة إلى هذا المنفذ عند بدء تشغيل العميل.</p>
<p>لنفترض أننا نريد إنشاء قاعدة بيانات تدعى "milvus_demo"، على غرار ما فعلناه في Milvus Lite أعلاه. يمكننا القيام بذلك على النحو التالي:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>

client = <span class="hljs-title class_">MilvusClient</span>(
    uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>,
    token=<span class="hljs-string">&quot;root:Milvus&quot;</span>,
)
client.<span class="hljs-title function_">create_database</span>(<span class="hljs-string">&quot;milvus_demo&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>بعد ذلك، يمكنك التحقق مما إذا كانت قاعدة البيانات التي تم إنشاؤها حديثًا باسم "milvus_demo" موجودة بالفعل في مثيل Milvus الخاص بك عن طريق الوصول إلى <a href="https://milvus.io/docs/milvus-webui.md">واجهة مستخدم Milvus Web UI</a>. كما يوحي الاسم، فإن واجهة مستخدم الويب Milvus Web UI هي واجهة مستخدم رسومية توفرها Milvus لمراقبة الإحصائيات والمقاييس الخاصة بالمكونات، والتحقق من قائمة وتفاصيل قواعد البيانات والمجموعات والتكوينات. يمكنك الوصول إلى واجهة مستخدم Milvus Web UI بمجرد بدء تشغيل حاوية Docker أعلاه على http://127.0.0.1:9091/webui/.</p>
<p>إذا قمت بالوصول إلى الرابط أعلاه، سترى صفحة هبوط مثل هذه:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Landing_page_UI_187a40e935.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>تحت علامة التبويب "المجموعات"، سترى أنه تم إنشاء قاعدة بيانات "milvus_demo" بنجاح. كما ترى، يمكنك أيضًا التحقق من أشياء أخرى مثل قائمة المجموعات والتكوينات والاستعلامات التي أجريتها وما إلى ذلك، باستخدام واجهة مستخدم الويب هذه.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Web_Ui_2_666eae57b1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>الآن يمكننا تنفيذ كل شيء تمامًا كما رأينا في قسم ميلفوس لايت أعلاه. لنقم بإنشاء مجموعة تسمى "demo_collection_collection" داخل قاعدة بيانات "milvus_demo" التي تتكون من ثلاثة حقول، وهي نفس ما كان لدينا في قسم Milvus Lite من قبل. بعد ذلك، سنقوم بإدخال بياناتنا في المجموعة.</p>
<pre><code translate="no" class="language-python">index_params = client.prepare_index_params()

<span class="hljs-comment">#  Add indexes</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;vector&quot;</span>, 
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>
)

<span class="hljs-comment"># Create collection</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    schema=schema,
    index_params=index_params
)

<span class="hljs-comment"># Insert data into collection</span>
res = client.insert(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    data=data
)
<button class="copy-code-btn"></button></code></pre>
<p>الكود الخاص بإجراء عملية البحث المتجه هو نفسه الموجود في Milvus Lite، كما ترى في الكود أدناه:</p>
<pre><code translate="no" class="language-python">query = [<span class="hljs-string">&quot;Who is Alan Turing&quot;</span>]
query_embedding = sentence_transformer_ef.encode_queries(query)

<span class="hljs-comment"># Load collection</span>
client.load_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>
)

<span class="hljs-comment"># Vector search</span>
res = client.search(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    data=query_embedding,
    limit=<span class="hljs-number">1</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
)
<span class="hljs-built_in">print</span>(res)
<span class="hljs-string">&quot;&quot;&quot;
Output:
data: [&quot;[{&#x27;id&#x27;: 1, &#x27;distance&#x27;: 0.7199004292488098, &#x27;entity&#x27;: {&#x27;text&#x27;: &#x27;Alan Turing was the first person to conduct substantial research in AI.&#x27;}}]&quot;] 
&quot;&quot;&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>بصرف النظر عن استخدام Docker، يمكنك أيضًا استخدام Milvus Standalone مع <a href="https://milvus.io/docs/install_standalone-docker-compose.md">Docker Compose</a> (لنظام لينكس) و <a href="https://milvus.io/docs/install_standalone-windows.md">Docker Desktop</a> (لنظام ويندوز).</p>
<p>عندما لا نستخدم مثيل Milvus بعد الآن، يمكننا إيقاف Milvus Standalone باستخدام الأمر التالي:</p>
<pre><code translate="no" class="language-shell">$ bash standalone_embed.sh stop
<button class="copy-code-btn"></button></code></pre>
<h2 id="Fully-Managed-Milvus" class="common-anchor-header">ميلفوس المدارة بالكامل<button data-href="#Fully-Managed-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>طريقة بديلة لبدء استخدام ميلفوس هي من خلال بنية تحتية أصلية قائمة على السحابة في <a href="https://zilliz.com/cloud">Zilliz Cloud</a>، حيث يمكنك الحصول على تجربة خالية من المتاعب وأسرع 10 مرات.</p>
<p>تقدم Zilliz Cloud مجموعات مخصصة مع بيئات وموارد مخصصة لدعم تطبيق الذكاء الاصطناعي الخاص بك. ونظراً لأنها قاعدة بيانات قائمة على السحابة مبنية على Milvus، فإننا لا نحتاج إلى إعداد وإدارة البنية التحتية المحلية. توفر Zilliz Cloud أيضًا ميزات أكثر تقدمًا، مثل الفصل بين التخزين المتجه والحساب، والنسخ الاحتياطي للبيانات إلى أنظمة تخزين الكائنات الشائعة مثل S3، والتخزين المؤقت للبيانات لتسريع عمليات البحث عن المتجهات واسترجاعها.</p>
<p>ومع ذلك، هناك شيء واحد يجب مراعاته عند التفكير في الخدمات المستندة إلى السحابة هو التكلفة التشغيلية. في معظم الحالات، ما زلنا بحاجة إلى الدفع حتى عندما تكون المجموعة خاملة بدون استيعاب بيانات أو نشاط بحث متجه. إذا كنت ترغب في تحسين التكلفة التشغيلية والأداء التشغيلي لتطبيقك بشكل أكبر، فإن Zilliz Cloud Serverless سيكون خيارًا ممتازًا.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Key_benefits_of_using_Zilliz_Cloud_Serverless_20f68e0fff.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>الشكل: المزايا الرئيسية لاستخدام Zilliz Cloud Serverless.</em></p>
<p>يتوفر Zilliz Cloud Serverless على مزودي الخدمات السحابية الرئيسيين مثل AWS و Azure و GCP. يوفر ميزات مثل تسعير الدفع حسب الاستخدام، مما يعني أنك تدفع فقط عند استخدامك للمجموعة.</p>
<p>تطبق Zilliz Cloud Serverless أيضًا تقنيات متقدمة مثل التكتلات المنطقية، والتوسع التلقائي، والتخزين المتدرج، وفصل البيانات المتدفقة والتاريخية، وفصل البيانات الباردة والساخنة. تُمكِّن هذه الميزات Zilliz Cloud Serverless من تحقيق وفورات في التكاليف تصل إلى 50 ضعفًا وعمليات بحث متجه أسرع 10 مرات تقريبًا مقارنةً بـ Milvus داخل الذاكرة.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Illustration_of_tiered_storage_and_hot_cold_data_separation_c634dfd211.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>الشكل: رسم توضيحي للتخزين المتدرج وفصل البيانات الباردة والساخنة.</em></p>
<p>إذا كنت ترغب في البدء في استخدام Zilliz Cloud Serverless، راجع <a href="https://zilliz.com/serverless">هذه الصفحة</a> لمزيد من المعلومات.</p>
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
    </button></h2><p>تبرز Milvus كقاعدة بيانات متجهة متعددة الاستخدامات وقوية مصممة لمواجهة تحديات إدارة البيانات غير المهيكلة وإجراء عمليات بحث متجهة سريعة وفعالة في تطبيقات الذكاء الاصطناعي الحديثة. وبفضل خيارات النشر مثل Milvus Lite للنماذج الأولية السريعة، و Milvus Standalone للتطبيقات الصغيرة والمتوسطة الحجم، و Milvus Distributed لقابلية التوسع على مستوى المؤسسات، فإنه يوفر مرونة تتناسب مع حجم أي مشروع وتعقيده.</p>
<p>بالإضافة إلى ذلك، يعمل Zilliz Cloud Serverless على توسيع قدرات Milvus إلى السحابة ويوفر نموذجًا فعالاً من حيث التكلفة والدفع حسب الاستخدام يلغي الحاجة إلى البنية التحتية المحلية. وبفضل الميزات المتقدمة مثل التخزين المتدرج والتوسع التلقائي، يضمن Zilliz Cloud Serverless عمليات بحث أسرع في البحث المتجه مع تحسين التكاليف.</p>
