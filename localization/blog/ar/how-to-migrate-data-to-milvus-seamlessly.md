---
id: how-to-migrate-data-to-milvus-seamlessly.md
title: 'كيفية ترحيل بياناتك إلى ميلفوس بسلاسة: دليل شامل'
author: Wenhui Zhang
date: 2023-12-01T00:00:00.000Z
desc: >-
  دليل شامل حول ترحيل بياناتك من إصدارات Elasticsearch و FAISS و Milvus 1.x
  الأقدم إلى Milvus 2.x.
cover: assets.zilliz.com/How_to_Migrate_Your_Data_to_Milvus_with_Ease_485dcb8b22.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Data Migration, Milvus Migration
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/how-to-migrate-data-to-milvus-seamlessly-comprehensive-guide
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/How_to_Migrate_Your_Data_to_Milvus_with_Ease_485dcb8b22.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://milvus.io/">Milvus</a> هي قاعدة بيانات متجهية قوية مفتوحة المصدر <a href="https://zilliz.com/learn/vector-similarity-search">للبحث عن التشابه</a> يمكنها تخزين ومعالجة واسترجاع مليارات بل وتريليونات من البيانات المتجهة بأقل زمن انتقال. كما أنها قابلة للتطوير بشكل كبير وموثوق بها وموثوقة وسحابة أصلية وغنية بالميزات. يقدم <a href="https://milvus.io/blog/unveiling-milvus-2-3-milestone-release-offering-support-for-gpu-arm64-cdc-and-other-features.md">الإصدار الأحدث من Milvus</a> المزيد من الميزات والتحسينات المثيرة، بما في ذلك <a href="https://zilliz.com/blog/getting-started-with-gpu-powered-milvus-unlocking-10x-higher-performance">دعم وحدة معالجة الرسومات (GPU)</a> لأداء أسرع 10 مرات، وخريطة MMap لسعة تخزين أكبر على جهاز واحد.</p>
<p>اعتبارًا من سبتمبر 2023، حازت Milvus على ما يقرب من 23,000 نجمة على GitHub ولديها عشرات الآلاف من المستخدمين من مختلف الصناعات ذات الاحتياجات المتنوعة. وقد أصبحت أكثر شعبية مع انتشار تكنولوجيا الذكاء الاصطناعي التوليدي مثل <a href="https://zilliz.com/learn/ChatGPT-Vector-Database-Prompt-as-code">ChatGPT</a>. وهي مكون أساسي لمختلف حزم الذكاء الاصطناعي، خاصةً إطار <a href="https://zilliz.com/use-cases/llm-retrieval-augmented-generation">الجيل المعزز الاسترجاعي،</a> الذي يعالج مشكلة الهلوسة في النماذج اللغوية الكبيرة.</p>
<p>لتلبية الطلب المتزايد من المستخدمين الجدد الذين يرغبون في الترحيل إلى Milvus والمستخدمين الحاليين الذين يرغبون في الترقية إلى أحدث إصدارات Milvus، قمنا بتطوير <a href="https://github.com/zilliztech/milvus-migration">Milvus Migration</a>. في هذه المدونة، سنستكشف في هذه المدونة ميزات Milvus Migration ونرشدك خلال نقل بياناتك بسرعة إلى Milvus من Milvus 1.x <a href="https://zilliz.com/blog/set-up-with-facebook-ai-similarity-search-faiss">وFaISS</a> <a href="https://zilliz.com/comparison/elastic-vs-milvus">وElasticsearch 7.0</a> وما بعده.</p>
<h2 id="Milvus-Migration-a-powerful-data-migration-tool" class="common-anchor-header">Milvus Migration، أداة قوية لترحيل البيانات<button data-href="#Milvus-Migration-a-powerful-data-migration-tool" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/milvus-migration">Milvus Migration</a> هي أداة ترحيل بيانات مكتوبة بلغة Go. وهي تُمكّن المستخدمين من نقل بياناتهم بسلاسة من الإصدارات القديمة من Milvus (1.x) و FAISS و Elasticsearch 7.0 وما بعده إلى إصدارات Milvus 2.x.</p>
<p>يوضح الرسم البياني أدناه كيف قمنا ببناء Milvus Migration وكيف يعمل.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_migration_architecture_144e22f499.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="How-Milvus-Migration-migrates-data" class="common-anchor-header">كيف يقوم برنامج Milvus Migration بترحيل البيانات</h3><h4 id="From-Milvus-1x-and-FAISS-to-Milvus-2x" class="common-anchor-header">من Milvus 1.x و FAISS إلى Milvus 2.x</h4><p>تتضمن عملية ترحيل البيانات من Milvus 1.x و FAISS تحليل محتوى ملفات البيانات الأصلية، وتحويلها إلى تنسيق تخزين البيانات في Milvus 2.x، وكتابة البيانات باستخدام Milvus SDK الخاص بـ Milvus <code translate="no">bulkInsert</code>. تعتمد هذه العملية بأكملها على الدفق، وهي محدودة نظريًا بمساحة القرص فقط، وتخزن ملفات البيانات على القرص المحلي أو S3 أو OSS أو GCP أو Minio.</p>
<h4 id="From-Elasticsearch-to-Milvus-2x" class="common-anchor-header">من Elasticsearch إلى ميلفوس 2.x</h4><p>في ترحيل بيانات Elasticsearch، يكون استرجاع البيانات مختلفًا. لا يتم الحصول على البيانات من الملفات ولكن يتم جلبها بالتتابع باستخدام واجهة برمجة تطبيقات التمرير الخاصة بـ Elasticsearch. يتم بعد ذلك تحليل البيانات وتحويلها إلى تنسيق تخزين Milvus 2.x، ثم كتابتها باستخدام <code translate="no">bulkInsert</code>. إلى جانب ترحيل متجهات من نوع <code translate="no">dense_vector</code> المخزنة في Elasticsearch، يدعم Milvus Migration أيضًا ترحيل أنواع الحقول الأخرى، بما في ذلك الطويل والصحيح والقصير والمنطقي والمنطقي والكلمة المفتاحية والنص والمزدوج.</p>
<h3 id="Milvus-Migration-feature-set" class="common-anchor-header">مجموعة ميزات Milvus Migration</h3><p>يبسط Milvus Migration عملية الترحيل من خلال مجموعة ميزاته القوية:</p>
<ul>
<li><p><strong>مصادر البيانات المدعومة:</strong></p>
<ul>
<li><p>من Milvus 1.x إلى Milvus 2.x</p></li>
<li><p>من Elasticsearch 7.0 وما بعده إلى Milvus 2.x</p></li>
<li><p>من FAISS إلى Milvus 2.x</p></li>
</ul></li>
</ul>
<ul>
<li><p><strong>أوضاع تفاعل متعددة:</strong></p>
<ul>
<li><p>واجهة سطر الأوامر (CLI) باستخدام إطار عمل كوبرا</p></li>
<li><p>واجهة برمجة التطبيقات المريحة مع واجهة مستخدم Swagger المدمجة</p></li>
<li><p>التكامل كوحدة نمطية Go في أدوات أخرى</p></li>
</ul></li>
</ul>
<ul>
<li><p><strong>دعم تنسيق ملف متعدد الاستخدامات:</strong></p>
<ul>
<li><p>الملفات المحلية</p></li>
<li><p>أمازون S3</p></li>
<li><p>خدمة تخزين الكائنات (OSS)</p></li>
<li><p>منصة جوجل السحابية (GCP)</p></li>
</ul></li>
</ul>
<ul>
<li><p><strong>تكامل مرن مع Elasticsearch:</strong></p>
<ul>
<li><p>ترحيل متجهات <code translate="no">dense_vector</code> من نوع من Elasticsearch</p></li>
<li><p>دعم لترحيل أنواع الحقول الأخرى مثل الطويل والصحيح والقصير والمنطقي والمنطقي والكلمة المفتاحية والنص والمزدوج</p></li>
</ul></li>
</ul>
<h3 id="Interface-definitions" class="common-anchor-header">تعريفات الواجهة</h3><p>يوفر Milvus Migration الواجهات الرئيسية التالية:</p>
<ul>
<li><p><code translate="no">/start</code>: بدء مهمة الترحيل (ما يعادل مزيجًا من التفريغ والتحميل، ويدعم حاليًا ترحيل ES فقط).</p></li>
<li><p><code translate="no">/dump</code>: بدء مهمة تفريغ (كتابة بيانات المصدر في وسيط التخزين الهدف).</p></li>
<li><p><code translate="no">/load</code>: : بدء مهمة تحميل (كتابة البيانات من وسيط التخزين الهدف إلى Milvus 2.x).</p></li>
<li><p><code translate="no">/get_job</code>: يسمح للمستخدمين بعرض نتائج تنفيذ المهمة. (لمزيد من التفاصيل، راجع <a href="https://github.com/zilliztech/milvus-migration/blob/main/server/server.go">الخادم الخاص بالمشروع</a>)</p></li>
</ul>
<p>بعد ذلك، دعنا نستخدم بعض الأمثلة على البيانات لاستكشاف كيفية استخدام Milvus Migration في هذا القسم. يمكنك العثور على هذه الأمثلة <a href="https://github.com/zilliztech/milvus-migration#migration-examples-migrationyaml-details">هنا</a> على GitHub.</p>
<h2 id="Migration-from-Elasticsearch-to-Milvus-2x" class="common-anchor-header">الترحيل من Elasticsearch إلى ميلفوس 2.x<button data-href="#Migration-from-Elasticsearch-to-Milvus-2x" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li>إعداد بيانات Elasticsearch</li>
</ol>
<p><a href="https://zilliz.com/blog/elasticsearch-cloud-vs-zilliz">لترحيل</a> بيانات Elasticsearch، يجب عليك بالفعل إعداد خادم Elasticsearch الخاص بك. يجب عليك تخزين البيانات المتجهة في الحقل <code translate="no">dense_vector</code> وفهرستها مع الحقول الأخرى. تعيينات الفهرس كما هو موضح أدناه.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/migrate_elasticsearch_data_milvus_index_mappings_59370f9596.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol start="2">
<li>التجميع والبناء</li>
</ol>
<p>أولاً، قم بتنزيل <a href="https://github.com/zilliztech/milvus-migration">الكود المصدري</a> لـ Milvus Migration <a href="https://github.com/zilliztech/milvus-migration">من GitHub</a>. ثم، قم بتشغيل الأوامر التالية لتجميعها.</p>
<pre><code translate="no"><span class="hljs-keyword">go</span> get
<span class="hljs-keyword">go</span> build
<button class="copy-code-btn"></button></code></pre>
<p>ستؤدي هذه الخطوة إلى إنشاء ملف قابل للتنفيذ باسم <code translate="no">milvus-migration</code>.</p>
<ol start="3">
<li>التهيئة <code translate="no">migration.yaml</code></li>
</ol>
<p>قبل بدء الترحيل، يجب إعداد ملف تهيئة باسم <code translate="no">migration.yaml</code> يتضمن معلومات حول مصدر البيانات والهدف والإعدادات الأخرى ذات الصلة. إليك مثال على التكوين:</p>
<pre><code translate="no"><span class="hljs-comment"># Configuration for Elasticsearch to Milvus 2.x migration</span>


dumper:
  worker:
    workMode: Elasticsearch
    reader:
      bufferSize: 2500
meta:
  mode: config
  index: test_index
  fields:
    - name: <span class="hljs-built_in">id</span>
      pk: <span class="hljs-literal">true</span>
      <span class="hljs-built_in">type</span>: long
    - name: other_field
      maxLen: 60
      <span class="hljs-built_in">type</span>: keyword
    - name: data
      <span class="hljs-built_in">type</span>: dense_vector
      dims: 512
  milvus:
      collection: <span class="hljs-string">&quot;rename_index_test&quot;</span>
      closeDynamicField: <span class="hljs-literal">false</span>
      consistencyLevel: Eventually
      shardNum: 1


<span class="hljs-built_in">source</span>:
  es:
    urls:
      - http://localhost:9200
    username: xxx
    password: xxx


target:
  mode: remote
  remote:
    outputDir: outputPath/migration/test1
    cloud: aws
    region: us-west-2
    bucket: xxx
    useIAM: <span class="hljs-literal">true</span>
    checkBucket: <span class="hljs-literal">false</span>
  milvus2x:
    endpoint: {yourMilvusAddress}:{port}
    username: ******
    password: ******
<button class="copy-code-btn"></button></code></pre>
<p>للحصول على شرح أكثر تفصيلاً لملف التكوين، راجع <a href="https://github.com/zilliztech/milvus-migration/blob/main/README_ES.md#elasticsearch-to-milvus-2x-migrationyaml-example">هذه الصفحة</a> على GitHub.</p>
<ol start="4">
<li>تنفيذ مهمة الترحيل</li>
</ol>
<p>الآن بعد أن قمت بتكوين ملف <code translate="no">migration.yaml</code> ، يمكنك بدء مهمة الترحيل عن طريق تشغيل الأمر التالي:</p>
<pre><code translate="no">./milvus-migration start --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p>راقب مخرجات السجل. عندما ترى سجلات مشابهة لما يلي، فهذا يعني أن الترحيل كان ناجحًا.</p>
<pre><code translate="no">[task/load_base_task.go:94] [<span class="hljs-string">&quot;[LoadTasker] Dec Task Processing--------------&gt;&quot;</span>] [Count=0] [fileName=testfiles/output/zwh/migration/test_mul_field4/data_1_1.json] [taskId=442665677354739304][task/load_base_task.go:76] [<span class="hljs-string">&quot;[LoadTasker] Progress Task ---------------&gt;&quot;</span>] [fileName=testfiles/output/zwh/migration/test_mul_field4/data_1_1.json] [taskId=442665677354739304][dbclient/cus_field_milvus2x.go:86] [<span class="hljs-string">&quot;[Milvus2x] begin to ShowCollectionRows&quot;</span>][loader/cus_milvus2x_loader.go:66] [<span class="hljs-string">&quot;[Loader] Static: &quot;</span>] [collection=test_mul_field4_rename1] [beforeCount=50000] [afterCount=100000] [increase=50000][loader/cus_milvus2x_loader.go:66] [<span class="hljs-string">&quot;[Loader] Static Total&quot;</span>] [<span class="hljs-string">&quot;Total Collections&quot;</span>=1] [beforeTotalCount=50000] [afterTotalCount=100000] [totalIncrease=50000][migration/es_starter.go:25] [<span class="hljs-string">&quot;[Starter] migration ES to Milvus finish!!!&quot;</span>] [Cost=80.009174459][starter/starter.go:106] [<span class="hljs-string">&quot;[Starter] Migration Success!&quot;</span>] [Cost=80.00928425][cleaner/remote_cleaner.go:27] [<span class="hljs-string">&quot;[Remote Cleaner] Begin to clean files&quot;</span>] [bucket=a-bucket] [rootPath=testfiles/output/zwh/migration][cmd/start.go:32] [<span class="hljs-string">&quot;[Cleaner] clean file success!&quot;</span>]
<button class="copy-code-btn"></button></code></pre>
<p>بالإضافة إلى نهج سطر الأوامر، تدعم Milvus Migration أيضًا الترحيل باستخدام واجهة برمجة التطبيقات المريحة.</p>
<p>لاستخدام واجهة برمجة التطبيقات المريحة، ابدأ تشغيل خادم واجهة برمجة التطبيقات باستخدام الأمر التالي:</p>
<pre><code translate="no">./milvus-migration server run -p 8080
<button class="copy-code-btn"></button></code></pre>
<p>بمجرد تشغيل الخدمة، يمكنك بدء الترحيل عن طريق استدعاء واجهة برمجة التطبيقات.</p>
<pre><code translate="no">curl -XPOST http://localhost:8080/api/v1/start
<button class="copy-code-btn"></button></code></pre>
<p>عند اكتمال عملية الترحيل، يمكنك استخدام <a href="https://zilliz.com/attu">Attu،</a> وهي أداة إدارة قاعدة البيانات المتجهة الشاملة، لعرض العدد الإجمالي للصفوف الناجحة التي تم ترحيلها بنجاح وتنفيذ عمليات أخرى متعلقة بالتجميع.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/attu_interface_vector_database_admin_4893a31f6d.png" alt="The Attu interface" class="doc-image" id="the-attu-interface" />
   </span> <span class="img-wrapper"> <span>واجهة Attu</span> </span></p>
<h2 id="Migration-from-Milvus-1x-to-Milvus-2x" class="common-anchor-header">الترحيل من Milvus 1.x إلى Milvus 2.x<button data-href="#Migration-from-Milvus-1x-to-Milvus-2x" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li>إعداد بيانات Milvus 1.x</li>
</ol>
<p>لمساعدتك على تجربة عملية الترحيل بسرعة، قمنا بوضع 10,000 سجل <a href="https://github.com/zilliztech/milvus-migration/blob/main/README_1X.md">بيانات اختبار</a> Milvus 1.x في الكود المصدري لـ Milvus Migration. ومع ذلك، في الحالات الحقيقية، يجب عليك تصدير ملف <code translate="no">meta.json</code> الخاص بك من مثيل Milvus 1.x الخاص بك قبل بدء عملية الترحيل.</p>
<ul>
<li>يمكنك تصدير البيانات باستخدام الأمر التالي.</li>
</ul>
<pre><code translate="no">./milvus-migration <span class="hljs-built_in">export</span> -m <span class="hljs-string">&quot;user:password@tcp(adderss)/milvus?charset=utf8mb4&amp;parseTime=True&amp;loc=Local&quot;</span> -o outputDir
<button class="copy-code-btn"></button></code></pre>
<p>تأكد من:</p>
<ul>
<li><p>استبدال العناصر النائبة ببيانات اعتماد MySQL الفعلية الخاصة بك.</p></li>
<li><p>أوقف خادم Milvus 1.x أو أوقف كتابة البيانات قبل تنفيذ عملية التصدير هذه.</p></li>
<li><p>انسخ مجلد Milvus <code translate="no">tables</code> والملف <code translate="no">meta.json</code> إلى نفس الدليل.</p></li>
</ul>
<p><strong>ملاحظة:</strong> إذا كنت تستخدم Milvus 2.x على <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (الخدمة المدارة بالكامل من Milvus)، يمكنك بدء الترحيل باستخدام وحدة التحكم السحابية.</p>
<ol start="2">
<li>التجميع والبناء</li>
</ol>
<p>أولاً، قم بتنزيل <a href="https://github.com/zilliztech/milvus-migration">الكود المصدري</a> لـ Milvus Migration <a href="https://github.com/zilliztech/milvus-migration">من GitHub</a>. ثم قم بتشغيل الأوامر التالية لتجميعها.</p>
<pre><code translate="no"><span class="hljs-keyword">go</span> get
<span class="hljs-keyword">go</span> build
<button class="copy-code-btn"></button></code></pre>
<p>ستؤدي هذه الخطوة إلى إنشاء ملف قابل للتنفيذ باسم <code translate="no">milvus-migration</code>.</p>
<ol start="3">
<li>التهيئة <code translate="no">migration.yaml</code></li>
</ol>
<p>قم بإعداد ملف تكوين <code translate="no">migration.yaml</code> ، مع تحديد تفاصيل حول المصدر والهدف والإعدادات الأخرى ذات الصلة. فيما يلي مثال على التكوين:</p>
<pre><code translate="no"><span class="hljs-comment"># Configuration for Milvus 1.x to Milvus 2.x migration</span>


dumper:
  worker:
    <span class="hljs-built_in">limit</span>: 2
    workMode: milvus1x
    reader:
      bufferSize: 1024
    writer:
      bufferSize: 1024
loader:
  worker:
    <span class="hljs-built_in">limit</span>: 16
meta:
  mode: <span class="hljs-built_in">local</span>
  localFile: /outputDir/test/meta.json


<span class="hljs-built_in">source</span>:
  mode: <span class="hljs-built_in">local</span>
  <span class="hljs-built_in">local</span>:
    tablesDir: /db/tables/


target:
  mode: remote
  remote:
    outputDir: <span class="hljs-string">&quot;migration/test/xx&quot;</span>
    ak: xxxx
    sk: xxxx
    cloud: aws
    endpoint: 0.0.0.0:9000
    region: ap-southeast-1
    bucket: a-bucket
    useIAM: <span class="hljs-literal">false</span>
    useSSL: <span class="hljs-literal">false</span>
    checkBucket: <span class="hljs-literal">true</span>
  milvus2x:
    endpoint: localhost:19530
    username: xxxxx
    password: xxxxx
<button class="copy-code-btn"></button></code></pre>
<p>للحصول على شرح أكثر تفصيلاً لملف التكوين، راجع <a href="https://github.com/zilliztech/milvus-migration/blob/main/README_1X.md">هذه الصفحة</a> على GitHub.</p>
<ol start="4">
<li>تنفيذ مهمة الترحيل</li>
</ol>
<p>يجب عليك تنفيذ الأمرين <code translate="no">dump</code> و <code translate="no">load</code> بشكل منفصل لإنهاء الترحيل. تقوم هذه الأوامر بتحويل البيانات واستيرادها إلى Milvus 2.x.</p>
<p><strong>ملحوظة:</strong> سنقوم بتبسيط هذه الخطوة وتمكين المستخدمين من إنهاء الترحيل باستخدام أمر واحد فقط قريبًا. ترقبوا ذلك.</p>
<p><strong>أمر التفريغ:</strong></p>
<pre><code translate="no">./milvus-migration dump --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p><strong>أمر التحميل:</strong></p>
<pre><code translate="no">./milvus-migration load --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p>بعد الترحيل، ستحتوي المجموعة التي تم إنشاؤها في Milvus 2.x على حقلين: <code translate="no">id</code> و <code translate="no">data</code>. يمكنك عرض المزيد من التفاصيل باستخدام <a href="https://zilliz.com/attu">Attu،</a> وهي أداة إدارة قاعدة بيانات المتجهات الشاملة.</p>
<h2 id="Migration-from-FAISS-to-Milvus-2x" class="common-anchor-header">الترحيل من FAISS إلى ملفوس 2.x<button data-href="#Migration-from-FAISS-to-Milvus-2x" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li>إعداد بيانات FAISS</li>
</ol>
<p>لترحيل بيانات Elasticsearch، يجب أن تكون بيانات FAISS الخاصة بك جاهزة. لمساعدتك على تجربة عملية الترحيل بسرعة، قمنا بوضع بعض <a href="https://github.com/zilliztech/milvus-migration/blob/main/README_FAISS.md">بيانات FAISS الاختبارية</a> في الكود المصدري لـ Milvus Migration.</p>
<ol start="2">
<li>التجميع والبناء</li>
</ol>
<p>أولاً، قم بتنزيل الكود المصدري لـ Milvus Migration <a href="https://github.com/zilliztech/milvus-migration">من GitHub</a>. ثم قم بتشغيل الأوامر التالية لتجميعها.</p>
<pre><code translate="no"><span class="hljs-keyword">go</span> get
<span class="hljs-keyword">go</span> build
<button class="copy-code-btn"></button></code></pre>
<p>ستؤدي هذه الخطوة إلى إنشاء ملف قابل للتنفيذ باسم <code translate="no">milvus-migration</code>.</p>
<ol start="3">
<li>التهيئة <code translate="no">migration.yaml</code></li>
</ol>
<p>قم بإعداد ملف تكوين <code translate="no">migration.yaml</code> لترحيل FAISS، مع تحديد تفاصيل حول المصدر والهدف والإعدادات الأخرى ذات الصلة. فيما يلي مثال على التكوين:</p>
<pre><code translate="no"><span class="hljs-comment"># Configuration for FAISS to Milvus 2.x migration</span>


dumper:
  worker:
    <span class="hljs-built_in">limit</span>: 2
    workMode: FAISS
    reader:
      bufferSize: 1024
    writer:
      bufferSize: 1024
loader:
  worker:
    <span class="hljs-built_in">limit</span>: 2
<span class="hljs-built_in">source</span>:
  mode: <span class="hljs-built_in">local</span>
  <span class="hljs-built_in">local</span>:
    FAISSFile: ./testfiles/FAISS/FAISS_ivf_flat.index


target:
  create:
    collection:
      name: test1w
      shardsNums: 2
      dim: 256
      metricType: L2
  mode: remote
  remote:
    outputDir: testfiles/output/
    cloud: aws
    endpoint: 0.0.0.0:9000
    region: ap-southeast-1
    bucket: a-bucket
    ak: minioadmin
    sk: minioadmin
    useIAM: <span class="hljs-literal">false</span>
    useSSL: <span class="hljs-literal">false</span>
    checkBucket: <span class="hljs-literal">true</span>
  milvus2x:
    endpoint: localhost:19530
    username: xxxxx
    password: xxxxx
<button class="copy-code-btn"></button></code></pre>
<p>للحصول على شرح أكثر تفصيلاً لملف التكوين، راجع <a href="https://github.com/zilliztech/milvus-migration/blob/main/README_FAISS.md">هذه الصفحة</a> على GitHub.</p>
<ol start="4">
<li>تنفيذ مهمة الترحيل</li>
</ol>
<p>على غرار ترحيل Milvus 1.x إلى Milvus 2.x، يتطلب ترحيل FAISS تنفيذ الأمرين <code translate="no">dump</code> و <code translate="no">load</code>. تقوم هذه الأوامر بتحويل البيانات واستيرادها إلى Milvus 2.x.</p>
<p><strong>ملحوظة:</strong> سنقوم بتبسيط هذه الخطوة وتمكين المستخدمين من إنهاء الترحيل باستخدام أمر واحد فقط قريبًا. ترقبوا ذلك.</p>
<p><strong>أمر التفريغ:</strong></p>
<pre><code translate="no">./milvus-migration dump --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p><strong>أمر التحميل:</strong></p>
<pre><code translate="no">./milvus-migration load --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p>يمكنك عرض المزيد من التفاصيل باستخدام <a href="https://zilliz.com/attu">Attu،</a> أداة إدارة قاعدة البيانات المتجهة الشاملة.</p>
<h2 id="Stay-tuned-for-future-migration-plans" class="common-anchor-header">ترقبوا خطط الترحيل المستقبلية<button data-href="#Stay-tuned-for-future-migration-plans" class="anchor-icon" translate="no">
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
    </button></h2><p>سنقوم في المستقبل بدعم الترحيل من المزيد من مصادر البيانات وإضافة المزيد من ميزات الترحيل، بما في ذلك:</p>
<ul>
<li><p>دعم الترحيل من Redis إلى Milvus.</p></li>
<li><p>دعم الترحيل من MongoDB إلى Milvus.</p></li>
<li><p>دعم الترحيل القابل للاستئناف.</p></li>
<li><p>تبسيط أوامر الترحيل من خلال دمج عمليتي التفريغ والتحميل في عملية واحدة.</p></li>
<li><p>دعم الترحيل من مصادر البيانات الرئيسية الأخرى إلى ميلفوس.</p></li>
</ul>
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
    </button></h2><p>يجلب الإصدار الأخير من Milvus 2.3، وهو أحدث إصدار من Milvus، ميزات جديدة مثيرة وتحسينات في الأداء تلبي الاحتياجات المتزايدة لإدارة البيانات. يمكن أن يؤدي ترحيل بياناتك إلى الإصدار 2.x من Milvus 2.x إلى إطلاق هذه الفوائد، ويجعل مشروع Milvus Migration عملية الترحيل مبسطة وسهلة. جربه، ولن يخيب أملك.</p>
<p><em><strong>ملاحظة:</strong> تستند المعلومات الواردة في هذه المدونة إلى حالة مشروعي Milvus وMilvus <a href="https://github.com/zilliztech/milvus-migration">Migration</a> اعتبارًا من سبتمبر 2023. راجع <a href="https://milvus.io/docs">وثائق Milvus</a> الرسمية للحصول على أحدث المعلومات والتعليمات.</em></p>
