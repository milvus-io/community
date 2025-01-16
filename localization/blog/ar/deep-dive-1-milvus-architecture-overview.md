---
id: deep-dive-1-milvus-architecture-overview.md
title: بناء قاعدة بيانات المتجهات للبحث عن التشابه القابل للتطوير
author: Xiaofan Luan
date: 2022-03-14T00:00:00.000Z
desc: >-
  الأولى في سلسلة مدونة لإلقاء نظرة فاحصة على عملية التفكير ومبادئ التصميم
  الكامنة وراء بناء قاعدة بيانات المتجهات مفتوحة المصدر الأكثر شيوعًا.
cover: assets.zilliz.com/20220705_102717_dd4124dee3.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220705_102717_dd4124dee3.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>صورة الغلاف</span> </span></p>
<blockquote>
<p>هذا المقال بقلم شياوفان لوان وأعدته أنجيلا ني وكلير يو.</p>
</blockquote>
<p>وفقًا <a href="https://mitsloan.mit.edu/ideas-made-to-matter/tapping-power-unstructured-data">للإحصاءات،</a> فإن حوالي 80%-90% من بيانات العالم غير منظمة. وبفضل النمو السريع للإنترنت، من المتوقع حدوث انفجار في البيانات غير المهيكلة في السنوات القادمة. وبالتالي، فإن الشركات في حاجة ماسة إلى قاعدة بيانات قوية يمكنها مساعدتها على التعامل مع هذا النوع من البيانات وفهمها بشكل أفضل. ومع ذلك، فإن تطوير قاعدة بيانات دائمًا ما يكون القول أسهل من الفعل. تهدف هذه المقالة إلى مشاركة عملية التفكير ومبادئ التصميم لبناء Milvus، وهي قاعدة بيانات متجهة مفتوحة المصدر وسحابية أصلية للبحث عن التشابه القابل للتطوير. تشرح هذه المقالة أيضًا بنية Milvus بالتفصيل.</p>
<p>الانتقال إلى:</p>
<ul>
<li><a href="#Unstructured-data-requires-a-complete-basic-software-stack">تتطلب البيانات غير المهيكلة حزمة برمجيات أساسية كاملة</a><ul>
<li><a href="#Vectors-and-scalars">المتجهات والمقاييس</a></li>
<li><a href="#From-vector-search-engine-to-vector-database">من محرك بحث المتجهات إلى قاعدة بيانات المتجهات</a></li>
<li><a href="#A-cloud-native-first-approach">النهج الأول السحابي الأصلي</a></li>
</ul></li>
<li><a href="#The-design-principles-of-Milvus-20">مبادئ التصميم الخاصة بميلفوس 2.0</a><ul>
<li><a href="#Log-as-data">السجل كبيانات</a></li>
<li><a href="#Duality-of-table-and-log">ازدواجية الجدول والسجل</a></li>
<li><a href="#Log-persistency">ثبات السجل</a></li>
</ul></li>
<li><a href="#Building-a-vector-database-for-scalable-similarity-search">بناء قاعدة بيانات متجهة للبحث عن التشابه القابل للتطوير</a><ul>
<li><a href="#Standalone-and-cluster">مستقل وتجميعي</a></li>
<li><a href="#A-bare-bones-skeleton-of-the-Milvus-architecture">الهيكل العظمي المجرد لبنية ميلفوس</a></li>
<li><a href="#Data-Model">نموذج البيانات</a></li>
</ul></li>
</ul>
<h2 id="Unstructured-data-requires-a-complete-basic-software-stack" class="common-anchor-header">تتطلب البيانات غير المهيكلة حزمة برمجيات أساسية كاملة<button data-href="#Unstructured-data-requires-a-complete-basic-software-stack" class="anchor-icon" translate="no">
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
    </button></h2><p>مع نمو الإنترنت وتطورها، أصبحت البيانات غير المنظمة أكثر شيوعًا، بما في ذلك رسائل البريد الإلكتروني والأوراق وبيانات مستشعرات إنترنت الأشياء وصور فيسبوك وبنى البروتين وغيرها الكثير. ولكي تتمكن أجهزة الكمبيوتر من فهم البيانات غير المنظمة ومعالجتها، يتم تحويلها إلى متجهات باستخدام <a href="https://zilliz.com/learn/embedding-generation">تقنيات التضمين</a>.</p>
<p>يقوم برنامج Milvus بتخزين هذه المتجهات وفهرستها، ويحلل الارتباط بين متجهين من خلال حساب مسافة التشابه بينهما. إذا كان متجها التضمين متشابهين جدًا، فهذا يعني أن مصادر البيانات الأصلية متشابهة أيضًا.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_6_5e0ab80f2c.png" alt="The workflow of processing unstructured data." class="doc-image" id="the-workflow-of-processing-unstructured-data." />
   </span> <span class="img-wrapper"> <span>سير عمل معالجة البيانات غير المنظمة</span>. </span></p>
<h3 id="Vectors-and-scalars" class="common-anchor-header">المتجهات والكميات القياسية</h3><p>الكمية القياسية هي الكمية التي توصف بقياس واحد فقط - المقدار. يمكن تمثيل الكمية القياسية كعدد. على سبيل المثال، تسير سيارة بسرعة 80 كم/ساعة. هنا، السرعة (80 كم/ساعة) هي كمية قياسية. في حين أن المتجه هو كمية توصف بمقياسين على الأقل، وهما المقدار والاتجاه. إذا كانت سيارة تتحرَّك باتجاه الغرب بسرعة 80 كم/ساعة، فإن السرعة (80 كم/ساعة غربًا) هنا كمية متجهة. الصورة أدناه مثال على الكميات القياسية والمتجهات الشائعة.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_7_90a142ab5b.png" alt="Scalars vs. Vectors" class="doc-image" id="scalars-vs.-vectors" />
   </span> <span class="img-wrapper"> <span>الكميات القياسية مقابل المتجهات</span> </span></p>
<p>نظرًا لأن معظم البيانات المهمة تحتوي على أكثر من سمة واحدة، يمكننا فهم هذه البيانات بشكل أفضل إذا قمنا بتحويلها إلى متجهات. تتمثل إحدى الطرق الشائعة للتعامل مع بيانات المتجهات في حساب المسافة بين المتجهات باستخدام <a href="https://milvus.io/docs/v2.0.x/metric.md">مقاييس</a> مثل المسافة الإقليدية والضرب الداخلي ومسافة تانيموتو ومسافة هامينج وما إلى ذلك. كلما كانت المسافة أقرب، كلما كانت المتجهات أكثر تشابهًا. للاستعلام عن مجموعة بيانات المتجهات الضخمة بكفاءة، يمكننا تنظيم بيانات المتجهات من خلال إنشاء فهارس عليها. بعد فهرسة مجموعة البيانات، يمكن توجيه الاستعلامات إلى مجموعات أو مجموعات فرعية من البيانات التي من المرجح أن تحتوي على متجهات مشابهة لاستعلام الإدخال.</p>
<p>لمعرفة المزيد حول الفهارس، راجع <a href="https://milvus.io/docs/v2.0.x/index.md">فهرس المت</a>جهات.</p>
<h3 id="From-vector-search-engine-to-vector-database" class="common-anchor-header">من محرك بحث المتجهات إلى قاعدة بيانات المتجهات</h3><p>منذ البداية، تم تصميم ميلفوس 2.0 ليس فقط ليكون محرك بحث، ولكن الأهم من ذلك أنه قاعدة بيانات متجهات قوية.</p>
<p>تتمثل إحدى الطرق لمساعدتك على فهم الفرق هنا في رسم تشابه بين <a href="https://dev.mysql.com/doc/refman/5.7/en/innodb-introduction.html">InnoDB</a> <a href="https://www.mysql.com/">وMySQL،</a> أو <a href="https://lucene.apache.org/">Lucene</a> <a href="https://www.elastic.co/">وElasticsearch</a>.</p>
<p>تمامًا مثل MySQL وElasticsearch، تم بناء Milvus أيضًا على رأس مكتبات مفتوحة المصدر مثل <a href="https://github.com/facebookresearch/faiss">Faiss</a> <a href="https://github.com/nmslib/hnswlib">وHNSW</a> <a href="https://github.com/spotify/annoy">وAnnoy،</a> والتي تركز على توفير وظائف البحث وضمان أداء البحث. ومع ذلك، سيكون من الإجحاف الحط من شأن Milvus إلى مجرد طبقة فوق Faiss حيث أنه يخزن ويسترجع ويحلل المتجهات، وكما هو الحال مع أي قاعدة بيانات أخرى، يوفر أيضًا واجهة قياسية لعمليات CRUD. بالإضافة إلى ذلك، يتميز ميلفوس أيضًا بميزات تشمل:</p>
<ul>
<li>التجزئة والتقسيم</li>
<li>النسخ المتماثل</li>
<li>التعافي من الكوارث</li>
<li>موازنة التحميل</li>
<li>محلل الاستعلام أو المُحسِّن</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/database_d912320ea7.png" alt="Vector database" class="doc-image" id="vector-database" />
   </span> <span class="img-wrapper"> <span>قاعدة البيانات المتجهة</span> </span></p>
<p>للحصول على فهم أشمل لماهية قاعدة البيانات المتجهة، اقرأ المدونة <a href="https://zilliz.com/learn/what-is-vector-database">هنا</a>.</p>
<h3 id="A-cloud-native-first-approach" class="common-anchor-header">النهج الأول السحابي الأصلي</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_2_be82d762db.png" alt="Could-native approach" class="doc-image" id="could-native-approach" />
   </span> <span class="img-wrapper"> <span>نهج يمكن أن يكون أصلياً</span> </span></p>
<h4 id="From-shared-nothing-to-shared-storage-then-to-shared-something" class="common-anchor-header">من اللاشيء المشترك، إلى التخزين المشترك، ثم إلى شيء مشترك</h4><p>اعتادت قواعد البيانات التقليدية على اعتماد بنية "اللاشيء المشترك" حيث تكون العقد في الأنظمة الموزعة مستقلة ولكنها متصلة بشبكة. لا تتم مشاركة أي ذاكرة أو تخزين بين العقد. ومع ذلك، أحدثت <a href="https://docs.snowflake.com/en/user-guide/intro-key-concepts.html">Snowflake</a> ثورة في هذه الصناعة من خلال تقديم بنية "التخزين المشترك" التي يتم فيها فصل الحوسبة (معالجة الاستعلام) عن التخزين (تخزين قاعدة البيانات). من خلال بنية التخزين المشترك، يمكن لقواعد البيانات تحقيق قدر أكبر من التوافر وقابلية التوسع وتقليل ازدواجية البيانات. استلهامًا من Snowflake، بدأت العديد من الشركات في الاستفادة من البنية التحتية المستندة إلى السحابة لاستمرار البيانات مع استخدام التخزين المحلي للتخزين المؤقت. يُطلق على هذا النوع من بنية قواعد البيانات اسم "شيء مشترك" وقد أصبح البنية السائدة في معظم التطبيقات اليوم.</p>
<p>بصرف النظر عن بنية "الشيء المشترك"، تدعم Milvus التوسع المرن لكل مكون باستخدام Kubernetes لإدارة محرك التنفيذ وفصل خدمات القراءة والكتابة والخدمات الأخرى مع الخدمات المصغرة.</p>
<h4 id="Database-as-a-service-DBaaS" class="common-anchor-header">قاعدة البيانات كخدمة (DBaaS)</h4><p>تُعد قاعدة البيانات كخدمة اتجاهاً رائجاً حيث لا يهتم العديد من المستخدمين بوظائف قواعد البيانات العادية فحسب، بل يتوقون أيضاً إلى خدمات أكثر تنوعاً. هذا يعني أنه بصرف النظر عن عمليات CRUD التقليدية، يجب أن تثري قاعدة البيانات لدينا نوع الخدمات التي يمكن أن تقدمها، مثل إدارة قواعد البيانات ونقل البيانات والشحن والتصور وما إلى ذلك.</p>
<h4 id="Synergy-with-the-broader-open-source-ecosystem" class="common-anchor-header">التآزر مع النظام البيئي الأوسع مفتوح المصدر</h4><p>هناك اتجاه آخر في تطوير قواعد البيانات وهو الاستفادة من التآزر بين قاعدة البيانات والبنية التحتية السحابية الأصلية الأخرى. في حالة ميلفوس، فإنه يعتمد على بعض الأنظمة مفتوحة المصدر. على سبيل المثال، يستخدم ميلفوس نظام <a href="https://etcd.io/">"إلخd</a> " لتخزين البيانات الوصفية. كما أنه يعتمد أيضًا على قائمة انتظار الرسائل، وهو نوع من الاتصالات غير المتزامنة من خدمة إلى خدمة المستخدمة في بنية الخدمات المصغرة، والتي يمكن أن تساعد في تصدير البيانات الإضافية.</p>
<p>في المستقبل، نأمل أن نبني Milvus على رأس البنى التحتية للذكاء الاصطناعي مثل <a href="https://spark.apache.org/">Spark</a> أو <a href="https://www.tensorflow.org/">Tensorflow،</a> ودمج Milvus مع محركات البث حتى نتمكن من دعم البث الموحد والمعالجة المجمعة بشكل أفضل لتلبية الاحتياجات المختلفة لمستخدمي Milvus.</p>
<h2 id="The-design-principles-of-Milvus-20" class="common-anchor-header">مبادئ التصميم الخاصة ب Milvus 2.0<button data-href="#The-design-principles-of-Milvus-20" class="anchor-icon" translate="no">
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
    </button></h2><p>بصفتها الجيل التالي من قاعدة بياناتنا السحابية المتجهة الأصلية، تم تصميم Milvus 2.0 حول المبادئ الثلاثة التالية.</p>
<h3 id="Log-as-data" class="common-anchor-header">السجل كبيانات</h3><p>يسجل السجل في قاعدة البيانات بشكل تسلسلي جميع التغييرات التي تم إجراؤها على البيانات. كما هو موضح في الشكل أدناه، من اليسار إلى اليمين &quot;البيانات القديمة&quot; و&quot;البيانات الجديدة&quot;. والسجلات بالترتيب الزمني. لدى ميلفوس آلية توقيت عالمية تعين طابعاً زمنياً فريداً عالمياً وتلقائياً متزايداً.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_8_6e40211f44.png" alt="Logs" class="doc-image" id="logs" />
   </span> <span class="img-wrapper"> <span>السجلات</span> </span></p>
<p>في Milvus 2.0، يعمل وسيط السجلات كعمود فقري للنظام: يجب أن تمر جميع عمليات إدراج البيانات وتحديثها عبر وسيط السجلات، وتنفذ العقد العاملة عمليات CRUD من خلال الاشتراك في السجلات واستهلاكها.</p>
<h3 id="Duality-of-table-and-log" class="common-anchor-header">ازدواجية الجدول والسجل</h3><p>كل من الجدول والسجل عبارة عن بيانات، وهما مجرد شكلين مختلفين. الجداول هي بيانات محدودة بينما السجلات غير محدودة. يمكن تحويل السجلات إلى جداول. في حالة Milvus، يقوم بتجميع السجلات باستخدام نافذة معالجة من TimeTick. بناءً على تسلسل السجل، يتم تجميع سجلات متعددة في ملف صغير واحد يسمى لقطة السجل. ثم يتم دمج لقطات السجل هذه لتشكيل مقطع، والذي يمكن استخدامه بشكل فردي لموازنة التحميل.</p>
<h3 id="Log-persistency" class="common-anchor-header">ثبات السجل</h3><p>يعد ثبات السجل إحدى المشكلات الصعبة التي تواجهها العديد من قواعد البيانات. عادةً ما يعتمد تخزين السجلات في نظام موزع على خوارزميات النسخ المتماثل.</p>
<p>وعلى عكس قواعد البيانات مثل <a href="https://aws.amazon.com/rds/aurora/">Aurora</a> و <a href="https://hbase.apache.org/">HBase</a> و <a href="https://www.cockroachlabs.com/">Cockroach DB</a> و <a href="https://en.pingcap.com/">TiDB،</a> فإن Milvus يتخذ نهجًا رائدًا ويقدم نظام نشر/فرعي (pub/sub) لتخزين السجلات واستمرارها. نظام pub/sub مشابه لقائمة انتظار الرسائل في <a href="https://kafka.apache.org/">كافكا</a> أو <a href="https://pulsar.apache.org/">بولسار</a>. يمكن لجميع العقد داخل النظام استهلاك السجلات. في ميلفوس، يُطلق على هذا النوع من النظام اسم وسيط السجل. وبفضل وسيط السجلات، تنفصل السجلات عن الخادم، مما يضمن أن ميلفوس نفسه عديم الحالة وفي وضع أفضل للتعافي بسرعة من فشل النظام.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/log_broker_cafe889835.png" alt="Log broker" class="doc-image" id="log-broker" />
   </span> <span class="img-wrapper"> <span>وسيط السجل</span> </span></p>
<h2 id="Building-a-vector-database-for-scalable-similarity-search" class="common-anchor-header">بناء قاعدة بيانات متجهية للبحث عن التشابه القابل للتطوير<button data-href="#Building-a-vector-database-for-scalable-similarity-search" class="anchor-icon" translate="no">
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
    </button></h2><p>تم تصميم Milvus على رأس مكتبات البحث عن المتجهات الشائعة بما في ذلك Faiss وANNOY وHNSW وغيرها، وقد صُمم Milvus للبحث عن التشابه في مجموعات بيانات المتجهات الكثيفة التي تحتوي على ملايين أو مليارات أو حتى تريليونات المتجهات.</p>
<h3 id="Standalone-and-cluster" class="common-anchor-header">مستقل وعنقودي</h3><p>يقدم ميلفوس طريقتين للنشر - مستقل أو عنقودي. في ميلفوس المستقلة، حيث يتم نشر جميع العقد معًا، يمكننا أن نرى ميلفوس كعملية واحدة. حاليًا، يعتمد ميلفوس المستقل حاليًا على MinIO و etcd لاستمرار البيانات وتخزين البيانات الوصفية. في الإصدارات المستقبلية، نأمل أن نتخلص في الإصدارات المستقبلية من هاتين التبعيتين الخارجيتين لضمان بساطة نظام Milvus. تشتمل مجموعة Milvus على ثمانية مكونات للخدمات المصغرة وثلاث تبعيات لجهات خارجية: MinIO و etcd وPulsar. يعمل Pulsar كوسيط للسجل ويوفر خدمات السجل pub / sub.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/standalone_and_cluster_7558f56e8c.png" alt="Standalone and cluster" class="doc-image" id="standalone-and-cluster" />
   </span> <span class="img-wrapper"> <span>مستقل وتجميعي</span> </span></p>
<h3 id="A-bare-bones-skeleton-of-the-Milvus-architecture" class="common-anchor-header">هيكل عظمي مكشوف لبنية ميلفوس</h3><p>تفصل Milvus تدفق البيانات عن تدفق التحكم، وهي مقسمة إلى أربع طبقات مستقلة من حيث قابلية التوسع والتعافي من الكوارث.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_architecture_b7743a4a7f.png" alt="Milvus architecture" class="doc-image" id="milvus-architecture" />
   </span> <span class="img-wrapper"> <span>بنية ميلفوس</span> </span></p>
<h4 id="Access-layer" class="common-anchor-header">طبقة الوصول</h4><p>تعمل طبقة الوصول كواجهة للنظام، حيث تعرض نقطة نهاية اتصال العميل إلى العالم الخارجي. وهي مسؤولة عن معالجة اتصالات العميل، وإجراء التحقق الثابت، والفحوصات الديناميكية الأساسية لطلبات المستخدم، وإعادة توجيه الطلبات، وجمع النتائج وإعادتها إلى العميل. الوكيل نفسه عديم الحالة ويوفر عناوين وخدمات وصول موحدة إلى العالم الخارجي من خلال مكونات موازنة التحميل (Nginx، و Kubernetess Ingress، و NodePort، و LVS). يستخدم ميلفوس بنية معالجة متوازية على نطاق واسع (MPP)، حيث يقوم البروكسي بإرجاع النتائج المجمعة من العقد العاملة بعد التجميع العالمي والمعالجة اللاحقة.</p>
<h4 id="Coordinator-service" class="common-anchor-header">خدمة المنسق</h4><p>خدمة المنسق هي العقل المدبر للنظام، وهي مسؤولة عن إدارة عقدة طوبولوجيا العنقود، وموازنة التحميل، وتوليد الطابع الزمني، وإعلان البيانات، وإدارة البيانات. للحصول على شرح مفصّل لوظيفة كل خدمة منسّق، اقرأ <a href="https://milvus.io/docs/v2.0.x/four_layers.md#Coordinator-service">وثائق ميلفوس التقنية</a>.</p>
<h4 id="Worker-nodes" class="common-anchor-header">العقد العاملة</h4><p>تعمل العقدة العاملة، أو عقدة التنفيذ، كأطراف للنظام، حيث تقوم بتنفيذ التعليمات الصادرة عن خدمة المنسق وأوامر لغة معالجة البيانات (DML) التي يبدأها الوكيل. العقدة العاملة في ميلفوس تشبه عقدة البيانات في <a href="https://hadoop.apache.org/">Hadoop،</a> أو خادم المنطقة في HBase. يتوافق كل نوع من العقدة العاملة مع خدمة منسق. للحصول على شرح مفصل لوظيفة كل عقدة عاملة، اقرأ <a href="https://milvus.io/docs/v2.0.x/four_layers.md#Worker-nodes">وثائق ميلفوس التقنية</a>.</p>
<h4 id="Storage" class="common-anchor-header">التخزين</h4><p>التخزين هو حجر الزاوية في ميلفوس، وهو المسؤول عن ثبات البيانات. تنقسم طبقة التخزين إلى ثلاثة أجزاء:</p>
<ul>
<li><strong>مخزن التعريف:</strong> مسؤول عن تخزين لقطات من البيانات الوصفية مثل مخطط المجموعة، وحالة العقدة، ونقاط التحقق من استهلاك الرسائل، وما إلى ذلك. يعتمد ميلفوس على إلخd لهذه الوظائف، ويتولى Etcd أيضًا مسؤولية تسجيل الخدمة والتحقق من صحتها.</li>
<li><strong>وسيط السجل:</strong> نظام pub/فرعي يدعم التشغيل وهو مسؤول عن استمرار البيانات المتدفقة، وتنفيذ الاستعلام غير المتزامن الموثوق به، وإشعارات الأحداث، وإرجاع نتائج الاستعلام. عندما تقوم العقد باسترداد وقت التعطل، يضمن وسيط السجل سلامة البيانات الإضافية من خلال تشغيل وسيط السجل. تستخدم مجموعة ميلفوس العنقودية Pulsar كوسيط سجل، بينما يستخدم الوضع المستقل RocksDB. يمكن أيضًا استخدام خدمات التخزين المتدفقة مثل Kafka و Pravega كوسيط سجلات.</li>
<li><strong>تخزين الكائنات:</strong> يخزن ملفات لقطات من السجلات، وملفات الفهرس القياسي/المتجه ونتائج معالجة الاستعلام الوسيطة. يدعم Milvus خدمة <a href="https://aws.amazon.com/s3/">AWS S3</a> <a href="https://azure.microsoft.com/en-us/services/storage/blobs/">وAzure Blob،</a> بالإضافة إلى <a href="https://min.io/">MinIO،</a> وهي خدمة تخزين كائنات خفيفة الوزن ومفتوحة المصدر. نظرًا لارتفاع زمن الوصول والفواتير لكل استعلام لخدمات تخزين الكائنات، ستدعم Milvus قريبًا مجمعات التخزين المؤقت القائمة على الذاكرة/الأقراص المدمجة وفصل البيانات الساخنة/الباردة لتحسين الأداء وتقليل التكاليف.</li>
</ul>
<h3 id="Data-Model" class="common-anchor-header">نموذج البيانات</h3><p>ينظم نموذج البيانات البيانات البيانات في قاعدة البيانات. في Milvus، يتم تنظيم جميع البيانات في Milvus حسب المجموعة والجزء والجزء والقسم والجزء والكيان.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_model_1_5d6bb43673.png" alt="Data model 1" class="doc-image" id="data-model-1" />
   </span> <span class="img-wrapper"> <span>نموذج البيانات 1</span> </span></p>
<h4 id="Collection" class="common-anchor-header">التجميع</h4><p>يمكن تشبيه المجموعة في ملفوس بجدول في نظام تخزين علائقي. المجموعة هي أكبر وحدة بيانات في ميلفوس.</p>
<h4 id="Shard" class="common-anchor-header">شارد</h4><p>للاستفادة الكاملة من قوة الحوسبة المتوازية للمجموعات عند كتابة البيانات، يجب أن توزع المجموعات في ميلفوس عمليات كتابة البيانات على عقد مختلفة. بشكل افتراضي، تحتوي المجموعة الواحدة على جزأين. اعتمادًا على حجم مجموعة البيانات الخاصة بك، يمكن أن يكون لديك المزيد من الأجزاء في المجموعة. يستخدم ميلفوس طريقة تجزئة المفتاح الرئيسي للتجزئة.</p>
<h4 id="Partition" class="common-anchor-header">التقسيم</h4><p>هناك أيضًا أقسام متعددة في الجزء. يشير التقسيم في Milvus إلى مجموعة من البيانات المميزة بنفس التسمية في المجموعة. طرق التقسيم الشائعة بما في ذلك التقسيم حسب التاريخ والجنس وعمر المستخدم وغير ذلك. يمكن أن يفيد إنشاء الأقسام عملية الاستعلام حيث يمكن تصفية البيانات الهائلة حسب علامة التقسيم.</p>
<p>بالمقارنة، فإن التجزئة هي أكثر من قدرات التوسع عند كتابة البيانات، في حين أن التقسيم هو أكثر من تعزيز أداء النظام عند قراءة البيانات.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_model_2_044a443751.png" alt="Data model 2" class="doc-image" id="data-model-2" />
   </span> <span class="img-wrapper"> <span>نموذج البيانات 2</span> </span></p>
<h4 id="Segments" class="common-anchor-header">التقسيمات</h4><p>داخل كل قسم، هناك عدة شرائح صغيرة. المقطع هو أصغر وحدة لجدولة النظام في ميلفوس. هناك نوعان من المقاطع، المقاطع المتنامية والمختومة. يتم الاشتراك في المقاطع المتنامية بواسطة عقد الاستعلام. يستمر مستخدم Milvus في كتابة البيانات في قطاعات متنامية. عندما يصل حجم المقطع المتزايد إلى الحد الأعلى (512 ميغابايت افتراضيًا)، لن يسمح النظام بكتابة بيانات إضافية في هذا المقطع المتزايد، وبالتالي يتم إغلاق هذا المقطع. يتم بناء الفهارس على المقاطع المغلقة.</p>
<p>للوصول إلى البيانات في الوقت الفعلي، يقرأ النظام البيانات في كل من المقاطع المتنامية والمقاطع المغلقة.</p>
<h4 id="Entity" class="common-anchor-header">الكيان</h4><p>يحتوي كل مقطع على كمية هائلة من الكيانات. الكيان في ميلفوس يعادل صفًا في قاعدة البيانات التقليدية. يحتوي كل كيان على حقل مفتاح أساسي فريد، والذي يمكن أيضًا إنشاؤه تلقائيًا. يجب أن تحتوي الكيانات أيضًا على طابع زمني (ts)، وحقل متجه - وهو جوهر Milvus.</p>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">حول سلسلة الغوص العميق<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>مع <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">الإعلان الرسمي عن التوفر العام</a> لـ Milvus 2.0، قمنا بتنظيم سلسلة مدونة Milvus Deep Dive هذه لتقديم تفسير متعمق لبنية Milvus ورمز المصدر. تشمل الموضوعات التي تتناولها سلسلة المدونات هذه ما يلي:</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">نظرة عامة على بنية ميلفوس</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">واجهات برمجة التطبيقات وحزم تطوير البرمجيات بايثون</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">معالجة البيانات</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">إدارة البيانات</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">الاستعلام في الوقت الحقيقي</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">محرك التنفيذ القياسي</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">نظام ضمان الجودة</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">محرك التنفيذ المتجه</a></li>
</ul>
