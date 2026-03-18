---
id: hybrid-spatial-and-vector-search-with-milvus-264.md
title: كيفية استخدام البحث الهجين المكاني والمتجه مع ميلفوس
author: Alden
date: 2026-3-18
cover: assets.zilliz.com/cover_8b550decfe.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus 2.6.4, hybrid spatial vector search, Milvus Geometry, R-Tree index,
  vector database geospatial search
meta_title: |
  Hybrid Spatial and Vector Search with Milvus 2.6.4 (Geometry & R-Tree)
desc: >-
  تعرّف على كيفية تمكين الإصدار Milvus 2.6.4 من Milvus 2.6.4 من البحث المكاني
  والمتجه الهجين باستخدام الهندسة والشجرة R-Tree، مع رؤى الأداء والأمثلة
  العملية.
origin: 'https://milvus.io/blog/hybrid-spatial-and-vector-search-with-milvus-264.md'
---
<p>يبدو استعلام مثل "العثور على مطاعم رومانسية في نطاق 3 كم" بسيطاً. فهو ليس كذلك، لأنه يجمع بين تصفية الموقع والبحث الدلالي. تحتاج معظم الأنظمة إلى تقسيم هذا الاستعلام عبر قاعدتي بيانات، مما يعني مزامنة البيانات، ودمج النتائج في التعليمات البرمجية، وزمن انتقال إضافي.</p>
<p>يزيل<a href="https://milvus.io">Milvus</a> 2.6.4 هذا التقسيم. باستخدام نوع بيانات <strong>GEOMETRY</strong> الأصلي وفهرس <strong>R-Tree،</strong> يمكن ل Milvus تطبيق قيود الموقع والقيود الدلالية معًا في استعلام واحد. وهذا يجعل البحث المكاني والدلالي الهجين أسهل بكثير وأكثر كفاءة.</p>
<p>تشرح هذه المقالة سبب الحاجة إلى هذا التغيير، وكيفية عمل GEOMETRY و R-Tree داخل Milvus، ومكاسب الأداء المتوقعة، وكيفية إعداده باستخدام Python SDK.</p>
<h2 id="The-Limitations-of-Traditional-Geo-and-Semantic-Search" class="common-anchor-header">حدود البحث الجغرافي التقليدي والبحث الدلالي<button data-href="#The-Limitations-of-Traditional-Geo-and-Semantic-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>يصعب التعامل مع استعلامات مثل "مطاعم رومانسية في نطاق 3 كم" لسببين:</p>
<ul>
<li><strong>"رومانسي" يحتاج إلى بحث دلالي.</strong> يجب أن يقوم النظام بتحويل مراجعات وعلامات المطاعم إلى متجهات، ثم العثور على التطابقات عن طريق التشابه في مساحة التضمين. وهذا يعمل فقط في قاعدة بيانات متجهة.</li>
<li><strong>"ضمن 3 كم" يحتاج إلى تصفية مكانية.</strong> يجب أن تقتصر النتائج على "في حدود 3 كم من المستخدم"، أو في بعض الأحيان "داخل مضلع توصيل معين أو حدود إدارية محددة".</li>
</ul>
<p>في البنية التقليدية، كانت تلبية كلا الحاجتين تعني عادةً تشغيل نظامين جنبًا إلى جنب:</p>
<ul>
<li><strong>نظام PostGIS/ Elasticsearch</strong> لتحديد المواقع الجغرافية وحسابات المسافة والتصفية المكانية.</li>
<li><strong>قاعدة بيانات متجهة</strong> للبحث عن أقرب جار تقريبي (ANN) على التضمينات.</li>
</ul>
<p>يخلق تصميم "قاعدتي البيانات" هذا ثلاث مشاكل عملية:</p>
<ul>
<li><strong>مزامنة البيانات المؤلمة.</strong> إذا قام مطعم بتغيير عنوانه، يجب تحديث كل من النظام الجغرافي وقاعدة بيانات المتجهات. يؤدي فقدان تحديث واحد إلى نتائج غير متسقة.</li>
<li><strong>وقت استجابة أعلى.</strong> يجب على التطبيق أن يتصل بنظامين ودمج مخرجاتهما، مما يضيف رحلات ذهاب وإياب على الشبكة ووقت معالجة.</li>
<li><strong>تصفية غير فعالة.</strong> إذا أجرى النظام بحثًا عن المتجهات أولاً، فغالبًا ما يُرجع العديد من النتائج البعيدة عن المستخدم ويتعين تجاهلها لاحقًا. إذا طبّق تصفية الموقع أولاً، فإن المجموعة المتبقية كانت لا تزال كبيرة، لذلك كانت خطوة البحث عن المتجهات لا تزال مكلفة.</li>
</ul>
<p>يحل Milvus 2.6.4 هذه المشكلة عن طريق إضافة دعم الهندسة المكانية مباشرةً إلى قاعدة بيانات المتجهات. يتم الآن تشغيل البحث الدلالي وتصفية الموقع في نفس الاستعلام. مع وجود كل شيء في نظام واحد، أصبح البحث الهجين أسرع وأسهل في الإدارة.</p>
<h2 id="What-GEOMETRY-Adds-to-Milvus" class="common-anchor-header">ما يضيفه GEOMETRY إلى Milvus<button data-href="#What-GEOMETRY-Adds-to-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>يقدم ميلفوس 2.6 نوع حقل قياسي يسمى DataType.GEOMETRY. بدلًا من تخزين المواقع كأرقام خطوط طول ودوائر عرض منفصلة، يخزن ميلفوس الآن كائنات هندسية: نقاط وخطوط ومضلعات. تصبح الاستفسارات مثل "هل هذه النقطة داخل منطقة؟" أو "هل هي ضمن نطاق X متر؟ ليست هناك حاجة لبناء حلول بديلة على الإحداثيات الخام.</p>
<p>يتبع التطبيق<strong>معيار الوصول إلى الميزات البسيطة</strong> <a href="https://www.ogc.org/standard/sfa/"></a><strong>OpenGIS،</strong> لذا فهو يعمل مع معظم الأدوات الجغرافية المكانية الحالية. يتم تخزين البيانات الهندسية والاستعلام عنها باستخدام <strong>WKT (نص معروف)</strong>، وهو تنسيق نصي قياسي يمكن للبشر قراءته وتحليله بواسطة البرامج.</p>
<p>أنواع الهندسة المدعومة:</p>
<ul>
<li><strong>POINT</strong>: موقع واحد، مثل عنوان متجر أو موقع مركبة في الوقت الفعلي</li>
<li><strong>خط</strong>: خط، مثل خط وسط الطريق أو مسار الحركة</li>
<li><strong>POLYGON</strong>: مساحة، مثل الحدود الإدارية أو السياج الجغرافي</li>
<li><strong>أنواع التجميع</strong>: MULTIPOINT، و MULTILINESTRING، و MULTIPOLYGON، و GEOMETRYCOLLECTION</li>
</ul>
<p>كما يدعم أيضًا المشغلات المكانية القياسية، بما في ذلك:</p>
<ul>
<li><strong>العلاقات المكانية</strong>: الاحتواء (ST_CONTAINS، ST_WITHIN)، والتقاطع (ST_INTERSECTS، ST_CROSSES)، والتلامس (ST_TOUCHES)</li>
<li><strong>عمليات المسافة</strong>: حساب المسافات بين الأشكال الهندسية (ST_DISTANCE) وتصفية الكائنات ضمن مسافة معينة (ST_DWITHIN)</li>
</ul>
<h2 id="How-R-Tree-Indexing-Works-Inside-Milvus" class="common-anchor-header">كيف تعمل فهرسة شجرة R-Tree داخل Milvus<button data-href="#How-R-Tree-Indexing-Works-Inside-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>إن دعم GEOMETRY مدمج في محرك استعلام Milvus، وليس فقط مكشوفًا كميزة واجهة برمجة التطبيقات. تتم فهرسة بيانات IS-المكانية ومعالجتها مباشرةً داخل المحرك باستخدام فهرس R-Tree (الشجرة المستطيلة).</p>
<p>تقوم <strong>شجرة R-Tree</strong> بتجميع الكائنات القريبة باستخدام <strong>الحد الأدنى من المستطيلات المحدودة (MBRs)</strong>. أثناء الاستعلام، يقوم المحرك بتخطي المناطق الكبيرة التي لا تتداخل مع هندسة الاستعلام ويقوم فقط بإجراء فحوصات مفصلة على مجموعة صغيرة من العناصر المرشحة. وهذا أسرع بكثير من مسح كل كائن.</p>
<h3 id="How-Milvus-Builds-the-R-Tree" class="common-anchor-header">كيف يقوم ميلفوس ببناء شجرة R-Tree</h3><p>يحدث بناء شجرة R-Tree في طبقات:</p>
<table>
<thead>
<tr><th><strong>المستوى</strong></th><th><strong>ما يفعله ميلفوس</strong></th><th><strong>تشبيه بديهي</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>مستوى الورقة</strong></td><td>لكل كائن هندسي (نقطة، أو خط، أو مضلع)، يحسب ميلفوس الحد الأدنى للمستطيل المحدود (MBR) الخاص به ويخزنه كعقدة ورقة.</td><td>تغليف كل عنصر في مربع شفاف يناسبه تمامًا.</td></tr>
<tr><td><strong>المستويات الوسيطة</strong></td><td>يتم تجميع العقد الورقية القريبة معًا (عادةً 50-100 في المرة الواحدة)، ويتم إنشاء MBR أصل أكبر لتغطية جميع هذه العقد.</td><td>وضع الحزم من نفس الحي في صندوق تسليم واحد.</td></tr>
<tr><td><strong>مستوى الجذر</strong></td><td>يستمر هذا التجميع إلى أعلى حتى يتم تغطية جميع البيانات في MBR جذر واحد MBR.</td><td>تحميل جميع الصناديق في شاحنة توصيل واحدة طويلة المدى.</td></tr>
</tbody>
</table>
<p>مع وجود هذه البنية، ينخفض تعقيد الاستعلام المكاني من مسح كامل <strong>O(n)</strong> إلى <strong>O(log n)</strong>. من الناحية العملية، يمكن أن تنخفض الاستعلامات على ملايين السجلات من مئات المللي ثانية إلى بضعة مللي ثانية فقط، دون فقدان الدقة.</p>
<h3 id="How-Queries-are-Executed-Two-Phase-Filtering" class="common-anchor-header">كيف يتم تنفيذ الاستعلامات: التصفية على مرحلتين</h3><p>لتحقيق التوازن بين السرعة والدقة، يستخدم ميلفوس استراتيجية <strong>تصفية</strong> على <strong>مرحلتين</strong>:</p>
<ul>
<li>التصفية<strong>الخام:</strong> يتحقق فهرس R-Tree أولاً مما إذا كان المستطيل المحدود للاستعلام يتداخل مع المستطيلات المحدودة الأخرى في الفهرس. هذا يزيل بسرعة معظم البيانات غير ذات الصلة ويحتفظ فقط بمجموعة صغيرة من المستطيلات المرشحة. نظرًا لأن هذه المستطيلات عبارة عن أشكال بسيطة، فإن عملية الفحص سريعة جدًا، ولكنها قد تتضمن بعض النتائج التي لا تتطابق بالفعل.</li>
<li><strong>التصفية الدقيقة</strong>: يتم بعد ذلك التحقق من النتائج المرشحة المتبقية باستخدام <strong>GEOS،</strong> وهي نفس مكتبة الهندسة التي تستخدمها أنظمة مثل PostGIS. تقوم GEOS بإجراء حسابات هندسية دقيقة، مثل ما إذا كانت الأشكال تتقاطع أو يحتوي أحدها على الآخر، للحصول على نتائج نهائية صحيحة.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Hybrid_Spatialand_Vector_Searchwith_Milvus2_6_1_978d62cb30.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>يقبل ميلفوس البيانات الهندسية بصيغة <strong>WKT (نص معروف)</strong> ولكنه يخزنها داخليًا بصيغة <strong>WKB (ثنائي معروف).</strong> تُعد WKB أكثر إحكامًا، مما يقلل من التخزين ويحسن الإدخال/الإخراج. كما تدعم حقول GEOMETRY أيضًا التخزين على شكل ذاكرة (mmap)، لذا لا تحتاج مجموعات البيانات المكانية الكبيرة إلى أن تتسع بالكامل في ذاكرة الوصول العشوائي.</p>
<h2 id="Performance-Improvements-with-R-Tree" class="common-anchor-header">تحسينات الأداء مع R-Tree<button data-href="#Performance-Improvements-with-R-Tree" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Query-Latency-Stays-Flat-as-Data-Grows" class="common-anchor-header">يبقى زمن الاستعلام ثابتًا مع نمو البيانات.</h3><p>من دون فهرس R-Tree، يتدرج وقت الاستعلام خطيًا مع حجم البيانات - 10 أضعاف البيانات تعني 10 أضعاف الاستعلامات تقريبًا.</p>
<p>مع R-Tree، ينمو وقت الاستعلام بشكل لوغاريتمي. في مجموعات البيانات التي تحتوي على ملايين السجلات، يمكن أن تكون التصفية المكانية أسرع بعشرات إلى مئات المرات من المسح الكامل.</p>
<h3 id="Accuracy-is-Not-Sacrificed-For-Speed" class="common-anchor-header">لا يتم التضحية بالدقة مقابل السرعة</h3><p>تقوم شجرة R-Tree بتضييق المرشحين حسب المربع المحدود، ثم يتحقق GEOS من كل واحد منهم باستخدام رياضيات هندسية دقيقة. تتم إزالة أي شيء يبدو مطابقًا ولكنه يقع بالفعل خارج منطقة الاستعلام في المسار الثاني.</p>
<h3 id="Hybrid-Search-Throughput-Improves" class="common-anchor-header">تحسين إنتاجية البحث الهجين</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Hybrid_Spatialand_Vector_Searchwith_Milvus2_6_2_b458b24bf6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>يزيل R-Tree السجلات خارج المنطقة المستهدفة أولاً. ثم يقوم Milvus بعد ذلك بتشغيل تشابه المتجهات (L2 أو IP أو جيب التمام) على السجلات المرشحة المتبقية فقط. عدد أقل من المرشحين يعني تكلفة بحث أقل واستعلامات أعلى في الثانية (QPS).</p>
<h2 id="Getting-Started-GEOMETRY-with-the-Python-SDK" class="common-anchor-header">الشروع في العمل: GEOMETRY باستخدام مجموعة أدوات تطوير البرمجيات Python SDK<button data-href="#Getting-Started-GEOMETRY-with-the-Python-SDK" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Define-the-Collection-and-Create-Indexes" class="common-anchor-header">تعريف المجموعة وإنشاء الفهارس</h3><p>أولاً، قم بتعريف حقل DataType.GEOMETRY في مخطط المجموعة. يسمح هذا لميلفوس بتخزين البيانات الهندسية والاستعلام عنها.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType  
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np  
<span class="hljs-comment"># Connect to Milvus  </span>
milvus_client = MilvusClient(<span class="hljs-string">&quot;[http://localhost:19530](http://localhost:19530)&quot;</span>)  
collection_name = <span class="hljs-string">&quot;lb_service_demo&quot;</span>  
dim = <span class="hljs-number">128</span>  
<span class="hljs-comment"># 1. Define schema  </span>
schema = milvus_client.create_schema(enable_dynamic_field=<span class="hljs-literal">True</span>)  
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)  
schema.add_field(<span class="hljs-string">&quot;vector&quot;</span>, DataType.FLOAT_VECTOR, dim=dim)  
schema.add_field(<span class="hljs-string">&quot;location&quot;</span>, DataType.GEOMETRY)  <span class="hljs-comment"># Define geometry field  </span>
schema.add_field(<span class="hljs-string">&quot;poi_name&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">128</span>)  
<span class="hljs-comment"># 2. Create index parameters  </span>
index_params = milvus_client.prepare_index_params()  
<span class="hljs-comment"># Create an index for the vector field (e.g., IVF_FLAT)  </span>
index_params.add_index(  
   field_name=<span class="hljs-string">&quot;vector&quot;</span>,  
   index_type=<span class="hljs-string">&quot;IVF_FLAT&quot;</span>,  
   metric_type=<span class="hljs-string">&quot;L2&quot;</span>,  
   params={<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">128</span>}  
)  
<span class="hljs-comment"># Create an R-Tree index for the geometry field (key step)  </span>
index_params.add_index(  
   field_name=<span class="hljs-string">&quot;location&quot;</span>,  
   index_type=<span class="hljs-string">&quot;RTREE&quot;</span>  <span class="hljs-comment"># Specify the index type as RTREE  </span>
)  
<span class="hljs-comment"># 3. Create collection  </span>
<span class="hljs-keyword">if</span> milvus_client.has_collection(collection_name):  
   milvus_client.drop_collection(collection_name)  
milvus_client.create_collection(  
   collection_name=collection_name,  
   schema=schema,  
   index_params=index_params,  <span class="hljs-comment"># Create the collection with indexes attached  </span>
   consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>  
)  
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection <span class="hljs-subst">{collection_name}</span> created with R-Tree index.&quot;</span>)  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Insert-Data" class="common-anchor-header">إدراج البيانات</h3><p>عند إدراج البيانات، يجب أن تكون القيم الهندسية بتنسيق WKT (نص معروف). يتضمن كل سجل الهندسة والمتجه والحقول الأخرى.</p>
<pre><code translate="no"><span class="hljs-comment"># Mock data: random POIs in a region of Beijing  </span>
data = []  
<span class="hljs-comment"># Example WKT: POINT(longitude latitude)  </span>
geo_points = [  
   <span class="hljs-string">&quot;POINT(116.4074 39.9042)&quot;</span>,  <span class="hljs-comment"># Near the Forbidden City  </span>
   <span class="hljs-string">&quot;POINT(116.4600 39.9140)&quot;</span>,  <span class="hljs-comment"># Near Guomao  </span>
   <span class="hljs-string">&quot;POINT(116.3200 39.9900)&quot;</span>,  <span class="hljs-comment"># Near Tsinghua University  </span>
]  
<span class="hljs-keyword">for</span> i, wkt <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(geo_points):  
   vec = np.random.random(dim).tolist()  
   data.append({  
       <span class="hljs-string">&quot;id&quot;</span>: i,  
       <span class="hljs-string">&quot;vector&quot;</span>: vec,  
       <span class="hljs-string">&quot;location&quot;</span>: wkt,  
       <span class="hljs-string">&quot;poi_name&quot;</span>: <span class="hljs-string">f&quot;POI_<span class="hljs-subst">{i}</span>&quot;</span>  
   })  
res = milvus_client.insert(collection_name=collection_name, data=data)  
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted <span class="hljs-subst">{res[<span class="hljs-string">&#x27;insert_count&#x27;</span>]}</span> entities.&quot;</span>)  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Run-a-Hybrid-Spatial-Vector-Query-Example" class="common-anchor-header">تشغيل استعلام مكاني-متجه هجين (مثال)</h3><p><strong>السيناريو:</strong> ابحث عن أفضل 3 نقاط مهمة الأكثر تشابهًا في الفضاء المتجه وتقع على بعد 2 كيلومتر من نقطة معينة، مثل موقع المستخدم.</p>
<p>استخدم المشغل ST_DWITHIN لتطبيق عامل تصفية المسافة. يتم تحديد قيمة المسافة <strong>بالأمتار.</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Load the collection into memory  </span>
milvus_client.load_collection(collection_name)  
<span class="hljs-comment"># User location (WKT)  </span>
user_loc_wkt = <span class="hljs-string">&quot;POINT(116.4070 39.9040)&quot;</span>  
search_vec = np.random.random(dim).tolist()  
<span class="hljs-comment"># Build the filter expression: use ST_DWITHIN for a 2000-meter radius filter  </span>
filter_expr = <span class="hljs-string">f&quot;ST_DWITHIN(location, &#x27;<span class="hljs-subst">{user_loc_wkt}</span>&#x27;, 2000)&quot;</span>  
<span class="hljs-comment"># Execute the search  </span>
search_res = milvus_client.search(  
   collection_name=collection_name,  
   data=[search_vec],  
   <span class="hljs-built_in">filter</span>=filter_expr,  <span class="hljs-comment"># Inject geometry filter  </span>
   limit=<span class="hljs-number">3</span>,  
   output_fields=[<span class="hljs-string">&quot;poi_name&quot;</span>, <span class="hljs-string">&quot;location&quot;</span>]  
)  
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Search Results:&quot;</span>)  
<span class="hljs-keyword">for</span> hits <span class="hljs-keyword">in</span> search_res:  
   <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> hits:  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;ID: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;id&#x27;</span>]}</span>, Score: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>, Name: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;poi_name&#x27;</span>]}</span>&quot;</span>)  
<button class="copy-code-btn"></button></code></pre>
<h2 id="Tips-for-Production-Use" class="common-anchor-header">نصائح للاستخدام في الإنتاج<button data-href="#Tips-for-Production-Use" class="anchor-icon" translate="no">
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
<li><strong>قم دائمًا بإنشاء فهرس R-Tree على حقول GEOMETRY.</strong> بالنسبة لمجموعات البيانات التي تزيد عن 10,000 كيان، تعود عوامل التصفية المكانية التي لا تحتوي على فهرس R-TREE إلى المسح الكامل، وينخفض الأداء بشكل حاد.</li>
<li><strong>استخدم نظام إحداثيات متناسق.</strong> يجب أن تستخدم جميع بيانات الموقع نفس النظام (على سبيل المثال، <a href="https://en.wikipedia.org/wiki/World_Geodetic_System"></a> WGS<a href="https://en.wikipedia.org/wiki/World_Geodetic_System">84</a>). يؤدي خلط أنظمة الإحداثيات إلى تعطيل حسابات المسافة والاحتواء.</li>
<li><strong>اختر المشغل المكاني المناسب للاستعلام.</strong> ST_DWITHIN لعمليات البحث "ضمن X متر". ST_CONTAINS أو ST_WITHIN للتحقق من السياج الجغرافي والاحتواء.</li>
<li><strong>يتم التعامل مع القيم الهندسية الفارغة تلقائيًا.</strong> إذا كان الحقل GEOMETRY قابلاً للإلغاء (قابل للإلغاء=صحيح)، يتخطى ميلفوس القيم الفارغة أثناء الاستعلامات المكانية. لا حاجة إلى منطق تصفية إضافي.</li>
</ul>
<h2 id="Deployment-Requirements" class="common-anchor-header">متطلبات النشر<button data-href="#Deployment-Requirements" class="anchor-icon" translate="no">
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
    </button></h2><p>لاستخدام هذه الميزات في الإنتاج، تأكد من استيفاء بيئتك للمتطلبات التالية.</p>
<p><strong>1. إصدار ميلفوس</strong></p>
<p>يجب تشغيل <strong>Milvus 2.6.4 أو أحدث</strong>. لا تدعم الإصدارات السابقة DataType.GEOMETRY أو نوع فهرس <strong>RTREE</strong>.</p>
<p><strong>2. إصدارات SDK</strong></p>
<ul>
<li><strong>PyMilvus</strong>: قم بالترقية إلى أحدث إصدار (يوصى بسلسلة <strong>2.6.x</strong> ). هذا مطلوب من أجل تسلسل WKT الصحيح وتمرير معلمات فهرس RTREE.</li>
<li>إصدارات<strong>Java / Go / Node SDKs</strong>: تحقق من ملاحظات الإصدار لكل مجموعة تطوير البرمجيات وتأكد من أنها تتماشى مع تعريفات الإصدار <strong>2.6.4</strong>.</li>
</ul>
<p><strong>3. مكتبات الهندسة المدمجة</strong></p>
<p>يشتمل خادم Milvus بالفعل على Boost.Geometry و GEOS، لذلك لا تحتاج إلى تثبيت هذه المكتبات بنفسك.</p>
<p><strong>4. استخدام الذاكرة وتخطيط السعة</strong></p>
<p>تستخدم فهارس R-Tree ذاكرة إضافية. عند تخطيط السعة، تذكر أن تضع ميزانية للفهارس الهندسية وكذلك الفهارس المتجهة مثل HNSW أو IVF. يدعم حقل GEOMETRY التخزين المعين بالذاكرة (mmap)، والذي يمكن أن يقلل من استخدام الذاكرة عن طريق الاحتفاظ بجزء من البيانات على القرص.</p>
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
    </button></h2><p>يحتاج البحث الدلالي القائم على الموقع إلى أكثر من مجرد تثبيت مرشح جغرافي على استعلام متجه. فهو يتطلب أنواع بيانات مكانية مدمجة وفهارس مناسبة ومحرك استعلام يمكنه التعامل مع الموقع والمتجهات معًا.</p>
<p>يحل<strong>Milvus 2.6.4</strong> هذا الأمر باستخدام حقول <strong>GEOMETRY</strong> الأصلية وفهارس <strong>R-Tree</strong>. يتم تشغيل التصفية المكانية والبحث عن المتجهات في استعلام واحد، مقابل مخزن بيانات واحد. يعالج R-Tree التقليم المكاني السريع بينما يضمن GEOS نتائج دقيقة.</p>
<p>بالنسبة للتطبيقات التي تحتاج إلى استرجاع مدرك للموقع، فإن هذا يزيل تعقيد تشغيل ومزامنة نظامين منفصلين.</p>
<p>إذا كنت تعمل على البحث المدرك للموقع أو البحث الهجين المكاني والمتجه، نود أن نسمع تجربتك.</p>
<p><strong>هل لديك أسئلة حول ميلفوس؟</strong> انضم إلى <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">قناة Slack</a> الخاصة بنا أو احجز جلسة <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">ساعات عمل Milvus</a> لمدة 20 دقيقة.</p>
