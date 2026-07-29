---
id: >-
  announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md
title: 'الإعلان عن Milvus 3.0: بحث متجهي أصيل لبحيرات البيانات ومحرك استرجاع أكثر قوة'
author: Fendy Feng and Li Liu
date: 2026-7-27
cover: assets.zilliz.com/cover_of_milvus_3_0_6fab4ba929.jpg
tag: Announcements
recommend: true
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus 3.0, lake-native vector search, vector database, External Collections,
  AI retrieval engine
meta_title: |
  Milvus 3.0: Lake-Native Vector Search & Retrieval Engine
desc: >-
  اكتشف البحث المتجهي الأصلي للبحيرات في Milvus 3.0، والمجموعات الخارجية بدون
  نسخ، والاسترجاع المتناثر الأسرع، واللقطات، وتكامل Spark، وقدرات الترتيب
  المتقدمة.
origin: >-
  https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md
---
<p>اليوم، نُصدر Milvus 3.0، وهي محطة معمارية رئيسية للمشروع. يغيّر هذا الإصدار كلاً من الأماكن التي يمكن لـ Milvus فيها بناء الفهارس وخدمتها، ومقدار عمل الاسترجاع الذي يمكن تنفيذه مباشرةً داخل المحرك.</p>
<ul>
<li>يقدّم Milvus 3.0 <strong>مسارًا أصيلاً لبحيرات البيانات</strong> لفهرسة بيانات المتجهات الموجودة في تخزين الكائنات وتنسيقات الجداول المفتوحة، بما في ذلك Parquet وLance وIceberg وVortex. يمكن للفرق جعل البيانات المقيمة في البحيرة قابلة للبحث دون الحفاظ على نسخة أخرى في قاعدة بيانات متجهية.</li>
<li><strong>يوسّع هذا الإصدار أيضًا Milvus إلى ما بعد استرجاع المرشحين الأولي.</strong> يتيح الفرز من جهة الخادم، والتجميع، والبحث متعدد الأوجه، وStructArray لبنية المستند/المقطع المتداخلة ومتجهات ColBERT، وفهرس sparse مُعاد تصميمه نقل مزيد من التصنيف والتجميع ومعالجة النتائج من كود التطبيق إلى محرك الاسترجاع.</li>
</ul>
<p>مجتمعةً، تجعل هذه التحسينات Milvus الأساس مفتوح المصدر لاسترجاع الذكاء الاصطناعي في الإنتاج، ولمعماريات <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">Vector Lakebase</a> التي تجمع بين التخزين الأصيل لبحيرات البيانات والاسترجاع المتجهي عالي الأداء.</p>
<iframe width="560" height="315" src="https://www.youtube.com/embed/SAm4YfrO1ok?si=xzgw5RjRTwaHWYxO" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<h2 id="A-quick-glance-at-the-Milvus-30-feature-set" class="common-anchor-header">نظرة سريعة على مجموعة ميزات Milvus 3.0<button data-href="#A-quick-glance-at-the-Milvus-30-feature-set" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th><strong>المجال</strong></th><th><strong>الميزات</strong></th><th><strong>سبب الأهمية</strong></th></tr>
</thead>
<tbody>
<tr><td>الاسترجاع الأصيل لبحيرات البيانات</td><td>مجموعات خارجية فوق Parquet وLance وIceberg وVortex</td><td>البحث في البيانات المقيمة في البحيرة دون الحفاظ على نسخة خدمة ثانية</td></tr>
<tr><td>تخزين قائم على S3</td><td>Loon (Storage v3)</td><td>تقليل تضخيم القراءة النقطية للوصول بنمط الخدمة ودعم تطور المخطط</td></tr>
<tr><td>سير عمل دون اتصال/دُفعي والاسترداد</td><td>اللقطات، وSpark DataSource V2، وتطور المخطط عبر الإنترنت</td><td>إدخال عروض مستقرة للمجموعات إلى خطوط التقييم، وإزالة التكرار، والعنقدة، والميزات</td></tr>
<tr><td>محرك الاسترجاع</td><td>ORDER BY، والتجميع، والأوجه، وStructArray، وتحسين الاسترجاع sparse</td><td>نقل مزيد من معالجة النتائج والتسجيل متعدد المتجهات إلى Milvus</td></tr>
<tr><td>نموذج البيانات والعمليات</td><td>المتجهات القابلة لأن تكون فارغة، وTEXT LOB، وTTL، وMinHash، وWoodpecker، وForceMerge</td><td>دعم نماذج بيانات أغنى وأنماط تشغيل إنتاجية</td></tr>
</tbody>
</table>
<h2 id="The-lake-native-infrastructure-index-and-serve-data-where-it-already-lives" class="common-anchor-header">البنية التحتية الأصيلة لبحيرات البيانات: فهرسة البيانات وخدمتها حيث توجد بالفعل<button data-href="#The-lake-native-infrastructure-index-and-serve-data-where-it-already-lives" class="anchor-icon" translate="no">
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
    </button></h2><p>أكبر تغيير معماري في Milvus 3.0 هو المكان الذي يمكن للنظام أن يبني فيه الفهارس ويخدمها. يمكن أن تبقى بيانات المتجهات في تنسيقات مفتوحة على تخزين الكائنات بينما يوفر Milvus فهرسة واسترجاعًا وواجهات API بمستوى إنتاجي.</p>
<h3 id="1-External-Collections-indexing-directly-on-lake-resident-data" class="common-anchor-header">1. المجموعات الخارجية: الفهرسة مباشرةً على البيانات المقيمة في البحيرة</h3><p>تخزّن العديد من الفرق بالفعل التضمينات في بحيرة بيانات — جداول Lance، أو جداول Iceberg، أو ملفات Parquet، أو مجموعات بيانات أخرى بتنسيقات مفتوحة على S3 أو GCS أو Azure Blob Storage. قبل Milvus 3.0، كان هناك عادةً خياران للبحث في تلك البيانات.</p>
<ul>
<li>نسخ التضمينات إلى قاعدة بيانات متجهية. يوفر هذا بحثًا منخفض الكمون، لكنه ينشئ نسخة ثانية وخط ETL يجب أن يبقى متزامنًا.</li>
<li>الاستعلام من البحيرة مباشرةً. يتجنب هذا التكرار، لكن من دون فهارس ANN يصبح البحث المتجهي مسحًا بالقوة الغاشمة لا يمكنه تلبية كمون الإنتاج.</li>
</ul>
<p><strong>تقدم المجموعات الخارجية مسارًا ثالثًا.</strong> يمكنك تعريف مجموعة Milvus فوق بيانات تبقى في تخزين الكائنات، وربط الحقول الخارجية بمخطط Milvus، واستخدام واجهات API نفسها للبحث والاستعلام كما في المجموعة الأصلية. لا تتحرك الملفات المصدرية؛ يبني Milvus ويخدم فهارس المتجهات، وBM25 المعكوسة، وJSON، والفهارس العددية فوق البيانات الخارجية.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_1_c1fb7ab16e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>المجموعات الخارجية للقراءة فقط وبلا نسخ</strong>، ما يجعلها مفيدة عندما تتطلب الحوكمة أو حدود الملكية أو تكلفة التشغيل بقاء مجموعة البيانات المصدرية في البحيرة.</p>
<p>عندما تتغير مجموعة البيانات الخارجية، يقرأ Milvus بيان التخزين الخاص بها ويفهرس الأجزاء المضافة حديثًا بدلاً من إعادة بناء المجموعة بأكملها. كما يتيح وضع تحميل على مستوى المجموعة للفرق اختيار مقدار البيانات المطلوب إبقاؤها محليًا:</p>
<table>
<thead>
<tr><th><strong>وضع التحميل</strong></th><th><strong>السلوك</strong></th><th><strong>الأفضل لـ</strong></th></tr>
</thead>
<tbody>
<tr><td>Take</td><td>القراءة من تخزين الكائنات عند كل استعلام</td><td>أقل تكلفة تخزين؛ أعباء عمل أقل حساسية للكمون</td></tr>
<tr><td>LazyLoad</td><td>تخزين البيانات مؤقتًا عند أول وصول</td><td>أعباء عمل مختلطة تظهر فيها البيانات الساخنة بمرور الوقت</td></tr>
<tr><td>Load</td><td>إبقاء البيانات مقيمة</td><td>أقل كمون للخدمة</td></tr>
</tbody>
</table>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># register a lake table as a zero-copy Collection</span>
client.create_collection(
  name=<span class="hljs-string">&quot;docs&quot;</span>,
  external_source={<span class="hljs-string">&quot;format&quot;</span>: <span class="hljs-string">&quot;iceberg&quot;</span>,  <span class="hljs-comment"># iceberg|lance|parquet|vortex</span>
                   <span class="hljs-string">&quot;uri&quot;</span>: <span class="hljs-string">&quot;s3://lake/docs&quot;</span>},
  schema=[
    Field(<span class="hljs-string">&quot;id&quot;</span>,  INT64, primary=<span class="hljs-literal">True</span>, external_field=<span class="hljs-string">&quot;doc_id&quot;</span>),
    Field(<span class="hljs-string">&quot;emb&quot;</span>, FLOAT_VECTOR, dim=<span class="hljs-number">1024</span>, external_field=<span class="hljs-string">&quot;embedding&quot;</span>),
    Field(<span class="hljs-string">&quot;title&quot;</span>, VARCHAR, external_field=<span class="hljs-string">&quot;title&quot;</span>)])

client.create_index(<span class="hljs-string">&quot;docs&quot;</span>, <span class="hljs-string">&quot;emb&quot;</span>, {<span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;HNSW&quot;</span>})  <span class="hljs-comment"># in place</span>
client.load(<span class="hljs-string">&quot;docs&quot;</span>, mode=<span class="hljs-string">&quot;lazy&quot;</span>)  <span class="hljs-comment"># Take | LazyLoad | Load</span>
<button class="copy-code-btn"></button></code></pre>
<p>في البيئات المحكومة، يمكن أن يعمل الاسترجاع حيث يُسمح للبيانات بالوجود. وبالنسبة للأنظمة الكبيرة للذكاء الاصطناعي، يمكن لمجموعة بيانات مقيمة في البحيرة دعم عدة عمليات نشر للاسترجاع دون مهمة ترحيل بينها.</p>
<p>المجموعات الخارجية قدرة إضافية. تظل مجموعات Milvus الأصلية هي المسار الأساسي للخدمة كثيفة الكتابة ومنخفضة الكمون، بينما صُممت المجموعات الخارجية لمجموعات البيانات التي يبقى نظام سجلها خارج Milvus.</p>
<p>لمزيد من التفاصيل، راجع <a href="https://milvus.io/docs/create-an-external-collection.md">إنشاء مجموعة خارجية</a>.</p>
<h3 id="2-Loon-Storage-v3-Efficient-Point-Reads-for-Lake-Native-Retrieval" class="common-anchor-header">2. Loon (Storage v3): قراءات نقطية فعّالة للاسترجاع الأصيل لبحيرات البيانات</h3><p>تطرح المجموعات الخارجية سؤالًا بديهيًا: صُمم تخزين الكائنات للتوسع والمتانة، لكن هل يمكنه دعم القراءات النقطية الضيقة التي تتبع بحث ANN؟</p>
<p><strong>التحدي هو تضخيم القراءة.</strong> يعمل البحث المتجهي عادةً على مرحلتين: يعيد فهرس ANN معرفات المرشحين، ثم يجلب النظام الحقول المحددة لهؤلاء المرشحين. يمكن للتنسيقات المحسّنة للمسوح التحليلية أن تحوّل بحثًا منطقيًا ضيقًا إلى قراءة مادية أكبر بكثير.</p>
<p><strong>يعالج Milvus 3.0 هذه المشكلة عبر Loon، المعروف أيضًا باسم Storage v3، وهو محرك تخزين عمودي قائم على البيانات الوصفية لتخزين الكائنات المتوافق مع S3.</strong> ينظم Loon الحقول في <code translate="no">ColumnGroups</code> بمعرفات صفوف متراصة، مما يسمح للحقول العددية بتفضيل التصفية والمسوح بينما تستخدم المتجهات والحقول كثيفة القراءات النقطية تخطيطات مصممة لعمليات بحث أضيق.</p>
<p>يبقي Loon فهارس المتجهات والفهارس المعكوسة منفصلة عن تنسيق الملفات بدلاً من تضمينها داخله. يوصف كل إصدار من مجموعة البيانات ببيان غير قابل للتغيير يسجل <code translate="no">ColumnGroups</code> الخاصة به، مما يسمح لمحرك الفهرسة نفسه بالعمل عبر Lance وParquet وIceberg وVortex.</p>
<p>يجعل تصميم البيان تطور المخطط أقل إرباكًا أيضًا. يمكن أن يحدّث إضافة حقل أو إسقاطه البيانات الوصفية دون إعادة كتابة الأعمدة الحالية. وملء حقل جديد يكتب <code translate="no">ColumnGroup</code> جديدًا مع ترك <code translate="no">ColumnGroups</code> الحالية من دون تغيير.</p>
<p><a href="https://github.com/vortex-data/vortex"><strong>Vortex</strong></a> هو التنسيق الافتراضي لهذا المسار. إنه تنسيق عمودي مفتوح ومتوافق مع Arrow، مع تخطيطات مرنة وترميزات متداخلة تطابق على نحو أفضل بيانات الذكاء الاصطناعي كثيفة الاستعلامات النقطية. في معيار داخلي واحد باستخدام 3 ملايين صف، ومتجهات ذات 128 بُعدًا، وS3، و256 قارئًا متزامنًا، انخفضت كمية الإدخال/الإخراج المقاسة لكل قراءة نقطية من نحو 9.4 ميغابايت لخط الأساس Parquet إلى 0.07 ميغابايت لـ Vortex مع Loon، أي أقل بنحو 135 مرة.</p>
<p>لا يجعل Milvus 3.0 تخزين الكائنات يتصرف مثل الذاكرة المحلية. بل يقلل تضخيم القراءة الذي يجعل تخزين الكائنات غير عملي لعمليات البحث النقطية بنمط الخدمة. دفع المسندات إلى داخل التنسيق ومتغير Vortex محلي هما التاليان على خارطة الطريق.</p>
<p><em>لمزيد من التفاصيل، راجع مدونتنا:</em> <a href="https://milvus.io/blog/why-we-built-loon-a-storage-engine-for-ai-data-that-never-stops-changing.md"><em>لماذا بنينا Loon</em></a> <em>ومشروع</em> <a href="https://github.com/vortex-data/vortex"><em>Vortex</em></a><em>.</em></p>
<h3 id="3-Snapshots-point-in-time-view-without-data-copy" class="common-anchor-header">3. اللقطات: عرض عند نقطة زمنية دون نسخ البيانات</h3><p>تحتاج المهام غير المتصلة إلى عرض متسق للبيانات حتى بينما تستمر مجموعات الإنتاج في تلقي الكتابات. لقطة Milvus هي عرض للقراءة فقط عند نقطة زمنية يسجل مراجع إلى ملفات البيانات والفهارس والبيانات الوصفية الحالية بدلاً من نسخ مجموعة البيانات كاملةً.</p>
<p>يجعل ذلك اللقطات منخفضة التكلفة بما يكفي لإنشائها قبل العمليات الخطرة مثل تبديل نموذج، أو مهمة إعادة تضمين، أو ترحيل مخطط. يمكن لاستعادة لقطة أن تعيد استخدام ملفات البيانات والفهارس الحالية من خلال نسخ من جهة الخادم في تخزين الكائنات بدلاً من إعادة استيراد كل صف وإعادة بناء كل فهرس. هذه الميزة مفيدة خصوصًا لأعباء العمل سريعة الحركة مثل وكلاء الذكاء الاصطناعي، حيث تتغير البيانات باستمرار، وتريد نقاط استرداد متكررة ورخيصة بدلاً من نسخ احتياطية ثقيلة من حين لآخر.</p>
<p>يمكن للعرض المجمد نفسه دعم التقييم، وإزالة التكرار، والتحقق من الملء اللاحق، والاختبار المعزول بينما تستمر المجموعة الحية في قبول الكتابات. تثبّت اللقطة الإدخال المنطقي، رغم أن أعباء العمل قد تظل تتشارك البنية التحتية مثل تخزين الكائنات وعرض النطاق الترددي للشبكة.</p>
<p>لا تستبدل اللقطات النسخ الاحتياطية. تشير اللقطة إلى ملفات تملكها المجموعة الحية، وهي الأنسب للاسترداد المنطقي، والاستنساخ، والعروض المستقرة قصيرة العمر. ينشئ النسخ الاحتياطي نسخة مستقلة للاحتفاظ طويل الأمد والتعافي من الكوارث.</p>
<p>لمزيد من المعلومات، راجع <a href="https://milvus.io/docs/snapshots.md">اللقطات</a>، و<a href="https://milvus.io/docs/manage-snapshots.md">إدارة اللقطات</a>، و<a href="https://milvus.io/docs/snapshot-use-cases.md">حالات استخدام اللقطات</a>.</p>
<h3 id="4-Spark-connector-connect-Milvus-to-batch-workflows" class="common-anchor-header">4. موصل Spark: ربط Milvus بسير العمل الدُفعي</h3><p>لا يكون العرض المستقر مفيدًا إلا إذا تمكنت محركات الدُفعات من قراءته. يعرّض Milvus 3.0 Milvus كـ Spark DataSource V2، مما يسمح لمهام Spark وDatabricks وEMR بالقراءة من Milvus والكتابة إليه كجزء من خطوط دُفعية قياسية.</p>
<p>هذه الميزة مهمة لأن سير عمل بيانات الذكاء الاصطناعي تكراري: إزالة التكرار تغذي إعادة التضمين، والعنقدة تغذي التقييم، والتقييم ينتج مجموعات تدريب أو خدمة منقحة. توفر اللقطة المستقرة لتلك المهام إدخالًا متسقًا، بينما تواصل المجموعة الحية الخدمة. ومع موصل Spark، يصبح مصبّ مهمة ما مصدر المهمة التالية، دون تصدير مجموعة كاملة خارج Milvus في كل مرة.</p>
<p>يقدم Milvus 3.0 أيضًا عوامل دُفعية أصلية للمتجهات لمهام مثل إزالة التكرار، واكتشاف الشذوذ، والعنقدة، ما يبقي العمل كثيف الحوسبة خارج مسار الاستعلام عبر الإنترنت بينما يعمل مباشرةً على البيانات المتجهية.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_3_cd37cad0c3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="5-Online-schema-changes-and-backfill" class="common-anchor-header">5. تغييرات المخطط عبر الإنترنت والملء اللاحق</h3><p>نادرًا ما يبقى المخطط ثابتًا في الإنتاج — تضيف الفرق بمرور الوقت نماذج تضمين جديدة، ومتجهات sparse، وتسميات، وحقول بيانات وصفية، وسياسات احتفاظ. يتيح Milvus 3.0 لها إضافة الأعمدة وملأها وإسقاطها بينما تستمر الخدمة، بدلاً من عمليات إعادة البناء المعطِّلة التي كان ذلك يتطلبها سابقًا.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_4_51c9b4e2c1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>لا تتطلب إضافة عمود أو إسقاطه إعادة كتابة البيانات الحالية. ينشئ <code translate="no">client.add_collection_field(...)</code> عمودًا جديدًا قابلاً لأن يكون فارغًا دون إخراج المجموعة من الخدمة، ويزيل <code translate="no">client.drop_collection_field(...)</code> حقلًا متقادمًا أو تجريبيًا أثناء التشغيل. لا يعيد أي منهما كتابة البيانات الحالية — فكل منهما تغيير في بيان المجموعة لا في ملفات البيانات، ولهذا لا توجد إعادة بناء.</p>
<p>يدعم Milvus 3.0 مسارين للملء اللاحق:</p>
<ul>
<li><strong>الملء اللاحق الداخلي</strong> (في 3.0) مخصص للقيم المشتقة من الحقول الحالية. يمكن لـ Milvus توليد متجه BM25 sparse من عمود نصي داخل النواة، مما يلغي الحاجة إلى مُرمِّز من جهة العميل عند بناء استرجاع هجين كثيف-زائد-sparse.</li>
<li><strong>الملء اللاحق الخارجي</strong>(على خارطة الطريق) سيكون مخصصًا للقيم المحسوبة خارج Milvus: خذ لقطة، شغّل Spark على العرض المتسق، احسب عمودًا جديدًا، اكتب القيم مرة أخرى، ودع Milvus يحدّث الفهرس تدريجيًا. هذا هو المسار المقصود لمهام إعادة التضمين الكبيرة — على سبيل المثال، إضافة عمود تضمين جديد عبر مئات الملايين من الصفوف بينما تستمر الكتابات.</li>
</ul>
<p>مجتمعةً، تجعل تغييرات المخطط عبر الإنترنت والملء اللاحق تطوير خطوط الاسترجاع أسهل دون إعادة بناء مجموعة كاملة في كل مرة يتغير فيها نموذج البيانات.</p>
<h2 id="A-More-Powerful-Engine-for-End-to-End-Retrieval" class="common-anchor-header">محرك أقوى للاسترجاع من البداية إلى النهاية<button data-href="#A-More-Powerful-Engine-for-End-to-End-Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><p>لطالما دعم Milvus أكثر من بحث ANN الكثيف، بما في ذلك الاسترجاع sparse القائم على BM25 والبحث الهجين. يوسّع Milvus 3.0 المحرك على محور مختلف: فهو يجلب مزيدًا من خط الاسترجاع متعدد المراحل إلى Milvus نفسه، مما يقلل الإفراط في الجلب، ومنطق التطبيق المكرر، والاعتماد على خدمات معالجة لاحقة منفصلة.</p>
<h3 id="1-Server-side-ORDER-BY-sort-inside-the-engine-per-segment" class="common-anchor-header">1. ORDER BY من جهة الخادم: الفرز داخل المحرك، لكل مقطع</h3><p>كان الفرز سابقًا يتطلب من التطبيقات الإفراط في جلب المرشحين، ونقلهم إلى العميل، وفرزهم هناك. كان ذلك يستهلك عرض النطاق الترددي ويجعل النتيجة النهائية تعتمد على مكان حدوث الاقتطاع من جهة العميل.</p>
<p><strong>يضيف Milvus 3.0 ميزة ORDER BY من جهة الخادم</strong>، التي تتيح لأعباء عمل الاستعلام فرز الصفوف المصفّاة حسب حقول عددية مثل التقييم، والسعر، والحداثة، والمخزون، أو الطابع الزمني.</p>
<ul>
<li>على مسار الاستعلام، يفرز كل مقطع مجموعة نتائجه المصفّاة، وتدمج عقد الاستعلام تلك التدفقات، ويعيد الوكيل الشريحة المطلوبة.</li>
<li>على مسار البحث، تفرز ORDER BY مجموعة مرشحي ANN داخل Milvus، مما يقلل الإفراط في الجلب والمعالجة اللاحقة المكررة من جهة العميل. وهي لا تغيّر حد الاستدعاء الذي يحدده مرشحو ANN.</li>
</ul>
<pre><code translate="no" class="language-sql">client.query(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&quot;category == &#x27;shoes&#x27;&quot;</span>,
    output_fields=[<span class="hljs-string">&quot;price&quot;</span>, <span class="hljs-string">&quot;rating&quot;</span>],
    limit=<span class="hljs-number">10</span>,
    order_by=[<span class="hljs-string">&quot;rating:desc&quot;</span>, <span class="hljs-string">&quot;price:asc&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>هذا مفيد خصوصًا لعمليات البحث التي تجمع بين الصلة والقيود التجارية أو الموجهة للمستخدم مثل التقييم، والسعر، والحداثة، والمخزون، أو الطابع الزمني.</p>
<p>لمزيد من المعلومات، راجع <a href="https://milvus.io/docs/single-vector-search.md#Sort-Search-Results-by-Scalar-Fields--Milvus-30x">فرز نتائج البحث حسب الحقول العددية</a> و<a href="https://milvus.io/docs/get-and-scalar-query.md#Sort-Query-Results--Milvus-30x">فرز نتائج الاستعلام</a>.</p>
<h3 id="2-Aggregation-and-faceted-search" class="common-anchor-header">2. التجميع والبحث متعدد الأوجه</h3><p>يضيف Milvus 3.0 تجميعًا من جهة الاستعلام بعمليات مثل العد، والمجموع، والمتوسط، والحد الأدنى، والحد الأقصى، مجمعة حسب حقل عددي واحد أو أكثر. يزيل هذا نمطًا شائعًا حيث تسحب الفرق الصفوف المصفّاة إلى كود العميل لمجرد العد أو التجميع أو حساب إحصاءات بسيطة.</p>
<pre><code translate="no" class="language-sql">client.query(
    collection_name=<span class="hljs-string">&quot;orders&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&quot;in_stock == true&quot;</span>,
    group_by_fields=[<span class="hljs-string">&quot;category&quot;</span>],
    output_fields=[<span class="hljs-string">&quot;category&quot;</span>, <span class="hljs-string">&quot;count(*)&quot;</span>, <span class="hljs-string">&quot;avg(price)&quot;</span>, <span class="hljs-string">&quot;max(rating)&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>يضيف Milvus 3.0 أيضًا <strong>تجميع البحث</strong> للبحث متعدد الأوجه. بعد بحث ANN، يجمع Milvus النتائج المسترجعة حسب حقل ويعيد أعداد السلال، والإحصاءات التجميعية، وأفضل N من النتائج النموذجية لكل سلة — وهو النمط الكامن وراء التجميع حسب العلامة التجارية، أو نطاق السعر، أو اللون، أو المستأجر، أو نوع المستند. تنبيه واحد: يعمل تجميع البحث على مجموعة النتائج المسترجعة بواسطة ANN، وليس على المجموعة بأكملها، لذلك تكون أعداد الأوجه تقريبية. عندما تحتاج إلى أعداد دقيقة، استخدم التجميع من جهة الاستعلام.</p>
<p>لمزيد من المعلومات، راجع <a href="https://milvus.io/docs/get-and-scalar-query.md#Aggregate-Query-Results--Milvus-30x">تجميع نتائج الاستعلام</a>.</p>
<h3 id="3-StructArray-for-Nested-Vectors-and-Late-Interaction-Model" class="common-anchor-header">3. StructArray للمتجهات المتداخلة ونموذج التفاعل المتأخر</h3><p>تمثل العديد من الكيانات طبيعيًا بواسطة متجهات متعددة. المستند الطويل هو سلسلة من المقاطع؛ والفيديو تسلسل من الإطارات تفضّل إبقاءه معًا في صف واحد بدلًا من نشره عبر العديد؛ والمنتج له عدة صور أو زوايا. تدفع نماذج التفاعل المتأخر هذا إلى أبعد من ذلك — يصدر ColBERT متجهًا واحدًا لكل رمز، وColPali متجهًا واحدًا لكل رقعة بصرية. في كل حالة، الوحدة التي تريد تخزينها والبحث عنها فعليًا هي الكيان بأكمله، لا كل جزء بمفرده.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_5_e15816e38b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>تسمح <strong>StructArray</strong> لصف Milvus بأن يحتوي على مصفوفة متغيرة الطول من عناصر منظمة، بما في ذلك متجهات متعددة، مع الحفاظ على معرف كيان واحد ومجموعة بيانات وصفية واحدة. يتجنب ذلك تقسيم مستند إلى صفوف متعددة وتكرار التسميات أو الأذونات أو الحقول الأخرى عبر الأجزاء.</p>
<p>يدعم Milvus دقتين للبحث.</p>
<ul>
<li><strong>البحث على مستوى العنصر</strong> يطابق متجه استعلام واحدًا مع كل عنصر في القائمة ويعيد العنصر المطابق المحدد مع إزاحته. هذا مفيد عندما تريد معرفة أي مقطع أو رمز أو رقعة أو صورة تطابق. يمكن أن يظهر الصف أكثر من مرة إذا طابقت عدة عناصر.</li>
<li><strong>البحث على مستوى الكيان</strong> يقارن قائمة المتجهات الكاملة للاستعلام مع قائمة متجهات الصف باستخدام <code translate="no">MAX_SIM</code>، مع مقياس <code translate="no">MAX_SIM_COSINE</code>. يأخذ كل رمز استعلام أفضل تطابق له في المستند، وتُجمع تلك أفضل الدرجات. يمنح هذا Milvus دعمًا أصليًا لأنماط الاسترجاع ذات التفاعل المتأخر مثل ColBERT وColPali مع الحفاظ على صف واحد لكل مستند.</li>
</ul>
<p>قد تكون فهرسة كل متجه رمز مكلفة؛ لذلك يضيف Milvus 3.0 عدة مسارات تسريع، بما في ذلك TokenANN وMuvera وLemur، التي توازن بين حجم الفهرس، وتكلفة التدريب، والاستدعاء.</p>
<table>
<thead>
<tr><th>الاستراتيجية</th><th>تمثيل المرحلة الأولى</th><th>ملف التكلفة</th><th>الأفضل لـ</th></tr>
</thead>
<tbody>
<tr><td>TokenANN</td><td>تتم فهرسة كل متجه رمز.</td><td>الأعلى، دقيق</td><td>النماذج عالية التمييز والمستندات القصيرة</td></tr>
<tr><td>Muvera</td><td>متجه واحد لكل مستند باستخدام FDE بالإسقاط العشوائي.</td><td>متوسط، بلا تدريب</td><td>المستندات الطويلة</td></tr>
<tr><td>Lemur</td><td>متجه واحد لكل مستند باستخدام ضغط MLP المتعلم</td><td>الأدنى، يتطلب تدريبًا</td><td>النماذج منخفضة التمييز ومتجهات الصور أو الرقع</td></tr>
</tbody>
</table>
<p>في معاييرنا، يطابق Lemur استدعاء TokenANN أو يتفوق عليه في معظم مجموعات البيانات بينما يختزل كل مستند إلى متجه واحد؛ والاستثناء هو المجموعات ذات تباين كبير في الأطوال، حيث يكون TokenANN أو استراتيجية أخرى أكثر أمانًا.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_7_8ff1ab957e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>بالنسبة للمجموعات الأكبر من الذاكرة، يدعم Milvus أيضًا فهرس <code translate="no">DISKANN</code> الذي يبقي قوائم التضمين على القرص لتقليل ضغط RAM.</p>
<p>وصل البحث على مستوى العنصر بالفعل في Milvus 2.6. أما التصفية لـ Muvera وLemur وStructList فهي جديدة في 3.0.</p>
<h3 id="4-BM25-Index-Compression-and-SINDI" class="common-anchor-header">4. ضغط فهرس BM25 وSINDI</h3><p>دعم Milvus البحث المتجهي sparse في إصدارات سابقة. يقلل Milvus 3.0 بصمة الفهرس sparse من خلال قوائم نشر مضغوطة بالكتل (خوارزميات مرتبطة بـ VByte إضافة إلى فك ترميز SIMD) والتكميم (fp16 للجداءات الداخلية، وu16 لـ BM25).</p>
<p>عبر مجموعة واحدة من معايير BM25 الداخلية، كان التنفيذ الجديد أصغر بنحو 3 مرات من فهرس Milvus 2.6 sparse عند استدعاء مماثل. يقلل الفهرس الأصغر ضغط الذاكرة وعرض النطاق الترددي ويمكن أن يحسّن السرعة في أعباء العمل المحدودة بحركة البيانات.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_8_2e62fc9573.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>يقدم Milvus 3.0 أيضًا <a href="https://arxiv.org/abs/2509.08395">SINDI</a>، وهي خوارزمية استرجاع sparse جديدة محسّنة للتضمينات sparse المتعلمة مثل SPLADE. ولأن هذه التضمينات تنتج قوائم نشر أكثف من BM25، فقد تقضي خوارزميات البحث كثيفة التقليم وقتًا كبيرًا من CPU في تحديد ما يجب تخطيه. بدلًا من ذلك، تنظم SINDI قوائم النشر في نوافذ مدمجة وتستخدم تجميع درجات ملائمًا لـ SIMD لمعالجتها بكفاءة، مع الحفاظ على دقة الاسترجاع عبر تقليم بلا فقد.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_9_c7de29a223.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>وسّعنا أيضًا SINDI إلى ما بعد تصميمه الأصلي ليشمل دعم BM25 الأصلي، مما يمكّن Milvus من استخدام مسار الاسترجاع sparse المحسّن نفسه لكل من التضمينات sparse المتعلمة والبحث النصي الكامل التقليدي.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_10_e94a903bcd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>في معاييرنا عبر 4 مجموعات بيانات متجهية sparse من SPLADE، تصل SINDI إلى ما يصل إلى نحو 10 أضعاف QPS لـ MaxScore على المتجهات المتعلمة-sparse، مع أسوأ حالة تقارب 5 أضعاف.</p>
<p>SINDI هو الخيار الافتراضي لبحث الجداء الداخلي sparse في Milvus 3.0.</p>
<h2 id="Other-Enhancements" class="common-anchor-header">تحسينات أخرى<button data-href="#Other-Enhancements" class="anchor-icon" translate="no">
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
<li><strong>TEXT LOB:</strong> يخزن النص المصدري الطويل بجانب المتجهات. يبقى النص الذي يقل عن 64 كيلوبايت مضمّنًا؛ وتستخدم القيم الأكبر مرجع Vortex LOB.</li>
<li><strong>دعم موسّع للفهرس الكثيف:</strong> يضيف مزيدًا من خيارات الفهارس ضمن عائلة Faiss، بما في ذلك SVS وPanorama وPQ وIVFPQ وScaNN، لمتطلبات مختلفة من حيث النطاق والذاكرة والاستدعاء.</li>
<li><strong>MinHash والبحث عن شبه التكرارات:</strong> يولد تواقيع MinHash من جهة الخادم ويسترجع مرشحي شبه التكرارات باستخدام MINHASH_LSH.</li>
<li><strong>المتجهات القابلة لأن تكون فارغة وأنواع جديدة:</strong> يسمح لحقول المتجهات بأن تكون NULL ويضيف TIMESTAMPTZ للتصفية الواعية بالوقت وسياسات الاحتفاظ.</li>
<li><strong>قواميس نص كامل مخصصة:</strong> يسجل القواميس والمرادفات وموارد كلمات التوقف على العنقود للتجزئة متعددة اللغات والخاصة بالمجال.</li>
<li><strong>Woodpecker مستقل:</strong> يشغّل سجل الكتابة المسبقة لـ Milvus كخدمة قابلة للتوسع والمراقبة بشكل مستقل.</li>
<li><strong>TTL للكيان</strong> <strong>****:</strong> تنتهي صلاحية السجلات الفردية من خلال حقل TIMESTAMPTZ، مع تصفية MVCC تتبعها عملية جمع القمامة أثناء الضغط.</li>
<li><strong>ForceMerge:</strong> يضغط المقاطع الصغيرة إلى حجم مستهدف ويعيد بناء الفهارس لتقليل تضخيم القراءة قبل خدمة مستدامة كثيفة القراءة.</li>
<li>والمزيد</li>
</ul>
<h2 id="Get-started-with-Milvus-30" class="common-anchor-header">ابدأ استخدام Milvus 3.0<button data-href="#Get-started-with-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>يتوفر Milvus 3.0 اليوم بموجب ترخيص Apache 2.0 ولا يزال مشروعًا ضمن LF AI &amp; Data. للبدء:</p>
<ul>
<li>اقرأ <a href="https://milvus.io/docs/release_notes.md">ملاحظات الإصدار</a> و<a href="https://milvus.io/docs/quickstart.md">دليل البدء السريع</a>، واحصل على المصدر من <a href="https://github.com/milvus-io/milvus">github.com/milvus-io/milvus</a>.</li>
<li>انضم إلى <a href="https://discord.com/invite/8uyFbECzPX">مجتمع Milvus على Discord</a> أو احجز جلسة <a href="https://milvus.io/office-hours">ساعات مكتبية لـ Milvus</a> لمناقشة حالة استخدامك مع المشرفين.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_11_78476298b9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Milvus-30-and-Zilliz-Vector-Lakebase" class="common-anchor-header">Milvus 3.0 وZilliz Vector Lakebase<button data-href="#Milvus-30-and-Zilliz-Vector-Lakebase" class="anchor-icon" translate="no">
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
    </button></h2><p>يرسي Milvus 3.0 الأساس مفتوح المصدر لاسترجاع الذكاء الاصطناعي في الإنتاج ومعمارية <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">Vector Lakebase</a> الناشئة، التي تجمع بين التخزين الأصيل لبحيرات البيانات والاسترجاع المتجهي عالي الأداء على مصدر حقيقة واحد، كلٌ بالتكلفة المناسبة.</p>
<p><a href="https://zilliz.com/">Zilliz Cloud</a> هو Vector Lakebase مُدار بالكامل بناه الفريق الواقف وراء Milvus. يشترك في المعمارية الموزعة والأصيلة لبحيرات البيانات نفسها مثل Milvus، وهو متوافق بالكامل مع واجهة Milvus API. مدعومًا بمحرك الفهرسة المملوك Cardinal، يوفر Zilliz Cloud أداءً سعريًا أفضل بما يصل إلى 10× من أساليب الفهرسة مفتوحة المصدر القياسية، مع إزالة التعقيد التشغيلي لإدارة البنية التحتية. تشمل قدرات المؤسسات الحوسبة القابلة للتوسع إلى الصفر، والتعافي من الكوارث عبر المناطق، ونشر BYOC، وأمانًا وامتثالًا بمستوى مؤسسي (SOC 2 وHIPAA وISO 27001 وGDPR)، واتفاقية مستوى خدمة تصل إلى 99.99%.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_12_08d1c21d25.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>يمكن للمطورين نشر Milvus كقاعدة بيانات متجهية مفتوحة المصدر أو استخدام <a href="https://zilliz.com/">Zilliz Cloud</a> كمنصة مُدارة عبر أعباء عمل متعددة طوال دورة حياة بيانات الذكاء الاصطناعي.</p>
<h2 id="What-comes-next" class="common-anchor-header">ما التالي<button data-href="#What-comes-next" class="anchor-icon" translate="no">
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
    </button></h2><p>تبني خارطة طريق Milvus على معمارية 3.0 من خلال دفع المسندات للمجموعات الخارجية، والملء اللاحق الخارجي، وعوامل Spark إضافية، ودعم المزيد من تنسيقات الجداول، بما في ذلك Delta Lake وApache Paimon.</p>
<p>الاتجاه الأكبر واضح: تحتاج أنظمة بيانات الذكاء الاصطناعي إلى حلقة أكثر إحكامًا بين الاسترجاع عبر الإنترنت وتحسين البيانات دون اتصال. يجب ألا تُنسخ البيانات المتجهية إلى أنظمة منفصلة في كل مرة تريد فيها الفرق البحث عنها أو تحليلها أو تحسينها أو خدمتها.</p>
