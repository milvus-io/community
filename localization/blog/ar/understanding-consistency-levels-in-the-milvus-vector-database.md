---
id: understanding-consistency-levels-in-the-milvus-vector-database.md
title: فهم مستوى الاتساق في قاعدة بيانات ناقلات ميلفوس
author: Chenglong Li
date: 2022-08-29T00:00:00.000Z
desc: >-
  تعرّف على مستويات الاتساق الأربعة - الاتساق القوي، والثبات المحدود، والجلسة،
  والنهائي المدعوم في قاعدة بيانات Milvus vector.
cover: assets.zilliz.com/1280_X1280_0e0d4bc107.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: >-
  https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1280_X1280_0e0d4bc107.png" alt="Cover_image" class="doc-image" id="cover_image" />
   </span> <span class="img-wrapper"> <span>صورة_الغلاف</span> </span></p>
<blockquote>
<p>هذا المقال بقلم <a href="https://github.com/JackLCL">تشنغلونغ لي</a> ونسخته <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">أنجيلا ني</a>.</p>
</blockquote>
<p>هل تساءلت يومًا عن سبب استمرار ظهور البيانات التي قمت بحذفها أحيانًا من قاعدة بيانات Mlivus vector في نتائج البحث؟</p>
<p>السبب المحتمل جدًا هو أنك لم تقم بتعيين مستوى الاتساق المناسب لتطبيقك. يعد مستوى الاتساق في قاعدة بيانات المتجهات الموزعة أمرًا بالغ الأهمية لأنه يحدد النقطة التي يمكن للنظام قراءة بيانات معينة مكتوبة فيها.</p>
<p>ولذلك، تهدف هذه المقالة إلى إزالة الغموض عن مفهوم الاتساق والتعمق في مستويات الاتساق التي تدعمها قاعدة بيانات Milvus vector.</p>
<p><strong>انتقل إلى:</strong></p>
<ul>
<li><a href="#What-is-consistency">ما هو الاتساق</a></li>
<li><a href="#Four-levels-of-consistency-in-the-Milvus-vector-database">أربعة مستويات من الاتساق في قاعدة بيانات ميلفوس المتجهة</a><ul>
<li><a href="#Strong">قوي</a></li>
<li><a href="#Bounded-staleness">الاتساق المحدود</a></li>
<li><a href="#Session">جلسة</a></li>
<li><a href="#Eventual">الاتساق النهائي</a></li>
</ul></li>
</ul>
<h2 id="What-is-consistency" class="common-anchor-header">ما هو الاتساق<button data-href="#What-is-consistency" class="anchor-icon" translate="no">
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
    </button></h2><p>قبل البدء، نحتاج أولاً إلى توضيح دلالة الاتساق في هذه المقالة حيث أن كلمة "الاتساق" مصطلح مثقل في صناعة الحوسبة. يشير الاتساق في قاعدة البيانات الموزعة على وجه التحديد إلى الخاصية التي تضمن أن كل عقدة أو نسخة متماثلة لديها نفس طريقة عرض البيانات عند كتابة أو قراءة البيانات في وقت معين. لذلك، نحن نتحدث هنا عن الاتساق كما في <a href="https://en.wikipedia.org/wiki/CAP_theorem">نظرية CAP</a>.</p>
<p>لخدمة الأعمال التجارية الضخمة عبر الإنترنت في العالم الحديث، يتم اعتماد النسخ المتماثلة المتعددة بشكل شائع. على سبيل المثال، تقوم شركة أمازون العملاقة للتجارة الإلكترونية عبر الإنترنت بتكرار طلباتها أو بيانات وحدات التخزين المخزنية عبر مراكز بيانات أو مناطق أو حتى بلدان متعددة لضمان توافر النظام بشكل كبير في حالة تعطل النظام أو تعطله. وهذا يشكل تحديًا للنظام، ألا وهو اتساق البيانات عبر نسخ متماثلة متعددة. فبدون الاتساق، من المحتمل جدًا أن يظهر العنصر المحذوف في عربة التسوق في أمازون مرة أخرى، مما يتسبب في تجربة مستخدم سيئة للغاية.</p>
<p>وبالتالي، نحتاج إلى مستويات اتساق بيانات مختلفة لتطبيقات مختلفة. ولحسن الحظ، توفر Milvus، وهي قاعدة بيانات للذكاء الاصطناعي، مرونة في مستوى الاتساق ويمكنك تعيين مستوى الاتساق الذي يناسب تطبيقك.</p>
<h3 id="Consistency-in-the-Milvus-vector-database" class="common-anchor-header">الاتساق في قاعدة بيانات ميلفوس المتجهة</h3><p>تم تقديم مفهوم مستوى الاتساق لأول مرة مع إصدار Milvus 2.0. لم يكن الإصدار 1.0 من Milvus 1.0 قاعدة بيانات متجهة موزعة لذلك لم نقم بتضمين مستويات الاتساق القابلة للضبط في ذلك الوقت. يقوم ميلفوس 1.0 بمسح البيانات كل ثانية، مما يعني أن البيانات الجديدة تكون مرئية على الفور تقريبًا عند إدراجها ويقرأ ميلفوس عرض البيانات الأكثر تحديثًا في النقطة الزمنية المحددة عندما يأتي طلب بحث أو استعلام عن تشابه المتجهات.</p>
<p>ومع ذلك، تمت إعادة هيكلة ميلفوس في إصداره 2.0، وميلفوس <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">2.0 هو قاعدة بيانات متجهات موزعة</a> تعتمد على آلية pub-sub. تشير نظرية <a href="https://en.wikipedia.org/wiki/PACELC_theorem">PACELC</a> إلى أن النظام الموزع يجب أن يفاضل بين الاتساق والتوافر والكمون. علاوة على ذلك، تخدم مستويات مختلفة من الاتساق سيناريوهات مختلفة. لذلك، تم تقديم مفهوم الاتساق في <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">Milvus 2.0</a> وهو يدعم ضبط مستويات الاتساق.</p>
<h2 id="Four-levels-of-consistency-in-the-Milvus-vector-database" class="common-anchor-header">أربعة مستويات من الاتساق في قاعدة بيانات ميلفوس المتجهة<button data-href="#Four-levels-of-consistency-in-the-Milvus-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>يدعم ميلفوس أربعة مستويات من الاتساق: الاتساق القوي، والثبات المحدود، والجلسة، والنهائي. ويمكن لمستخدم Milvus تحديد مستوى الاتساق عند <a href="https://milvus.io/docs/v2.1.x/create_collection.md">إنشاء مجموعة</a> أو إجراء <a href="https://milvus.io/docs/v2.1.x/search.md">بحث</a> أو <a href="https://milvus.io/docs/v2.1.x/query.md">استعلام</a> <a href="https://milvus.io/docs/v2.1.x/search.md">عن تشابه المتجهات</a>. سيواصل هذا القسم شرح كيفية اختلاف مستويات الاتساق الأربعة هذه والسيناريو الأنسب لها.</p>
<h3 id="Strong" class="common-anchor-header">قوي</h3><p>قوي هو أعلى مستويات الاتساق وأكثرها صرامة. يضمن أن يتمكن المستخدمون من قراءة أحدث إصدار من البيانات.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_Strong_5d791eb8b2.png" alt="Strong" class="doc-image" id="strong" />
   </span> <span class="img-wrapper"> <span>قوي</span> </span></p>
<p>وفقًا لنظرية PACELC، إذا تم ضبط مستوى الاتساق على قوي، سيزداد زمن الاستجابة. لذلك، نوصي باختيار الاتساق القوي أثناء الاختبارات الوظيفية لضمان دقة نتائج الاختبار. كما أن الاتساق القوي هو الأنسب للتطبيقات التي لديها طلب صارم على اتساق البيانات على حساب سرعة البحث. ومن الأمثلة على ذلك نظام مالي عبر الإنترنت يتعامل مع مدفوعات الطلبات والفواتير.</p>
<h3 id="Bounded-staleness" class="common-anchor-header">التقادم المحدود</h3><p>يسمح التقادم المحدود، كما يوحي اسمه، بعدم اتساق البيانات خلال فترة زمنية معينة. ومع ذلك، بشكل عام، تكون البيانات متسقة دائمًا بشكل عام خارج تلك الفترة الزمنية.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_Bounded_c034bc6e51.png" alt="Bounded_staleness" class="doc-image" id="bounded_staleness" />
   </span> <span class="img-wrapper"> <span>التقادم_المحدود</span> </span></p>
<p>يعد التقادم المحدود مناسبًا للسيناريوهات التي تحتاج إلى التحكم في زمن انتقال البحث ويمكن أن تقبل عدم اتساق البيانات المتفرقة. على سبيل المثال، في أنظمة التوصية مثل محركات توصيات الفيديو، يكون لإخفاء البيانات من حين لآخر تأثير ضئيل حقًا على معدل الاستدعاء الإجمالي، ولكن يمكن أن يعزز أداء نظام التوصية بشكل كبير. ومن الأمثلة على ذلك تطبيق لتتبع حالة طلباتك عبر الإنترنت.</p>
<h3 id="Session" class="common-anchor-header">الجلسة</h3><p>تضمن جلسة العمل أن جميع عمليات كتابة البيانات يمكن إدراكها على الفور في القراءة خلال نفس الجلسة. بعبارة أخرى، عند كتابة البيانات عبر عميل واحد، تصبح البيانات المدرجة حديثًا قابلة للبحث على الفور.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_Session_6dc4782212.png" alt="Session" class="doc-image" id="session" />
   </span> <span class="img-wrapper"> <span>جلسة العمل</span> </span></p>
<p>نوصي باختيار جلسة العمل كمستوى اتساق لتلك السيناريوهات التي يكون فيها الطلب على اتساق البيانات في نفس الجلسة مرتفعًا. يمكن أن يكون أحد الأمثلة على ذلك حذف بيانات إدخال كتاب من نظام المكتبة، وبعد تأكيد الحذف وتحديث الصفحة (جلسة مختلفة)، يجب ألا يكون الكتاب مرئيًا في نتائج البحث.</p>
<h3 id="Eventual" class="common-anchor-header">في نهاية المطاف</h3><p>لا يوجد ترتيب مضمون لعمليات القراءة والكتابة، وتتقارب النسخ المتماثلة في النهاية إلى نفس الحالة بالنظر إلى عدم إجراء عمليات كتابة أخرى. في ظل الاتساق النهائي، تبدأ النسخ المتماثلة في العمل على طلبات القراءة بأحدث القيم المحدثة. الاتساق النهائي هو المستوى الأضعف بين المستويات الأربعة.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_Eventual_7c66dd5b6f.png" alt="Eventual" class="doc-image" id="eventual" />
   </span> <span class="img-wrapper"> <span>الاتساق النهائي</span> </span></p>
<p>ومع ذلك، وفقًا لنظرية PACELC، يمكن تقصير زمن انتقال البحث بشكل كبير عند التضحية بالاتساق. ولذلك، فإن الاتساق النهائي هو الأنسب للسيناريوهات التي لا تتطلب طلبًا كبيرًا على اتساق البيانات ولكنها تتطلب أداء بحث فائق السرعة. من الأمثلة على ذلك استرجاع المراجعات والتقييمات لمنتجات أمازون مع الاتساق النهائي.</p>
<h2 id="Endnote" class="common-anchor-header">حاشية ختامية<button data-href="#Endnote" class="anchor-icon" translate="no">
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
    </button></h2><p>بالعودة إلى السؤال المطروح في بداية هذه المقالة، لا تزال البيانات المحذوفة تُعاد كنتائج بحث لأن المستخدم لم يختر مستوى الاتساق المناسب. القيمة الافتراضية لمستوى الاتساق هي الثبات المحدود (<code translate="no">Bounded</code>) في قاعدة بيانات Milvus vector. ولذلك، قد تتأخر قراءة البيانات وقد يحدث أن يتأخر ميلفوس في قراءة عرض البيانات قبل إجراء عمليات الحذف أثناء البحث أو الاستعلام عن التشابه. ومع ذلك، فإن هذه المشكلة سهلة الحل. كل ما عليك فعله هو <a href="https://milvus.io/docs/v2.1.x/tune_consistency.md">ضبط مستوى الاتساق</a> عند إنشاء مجموعة أو إجراء بحث أو استعلام عن تشابه المتجهات. الأمر بسيط!</p>
<p>في المنشور التالي، سنكشف النقاب عن الآلية الكامنة وراء وشرح كيفية تحقيق قاعدة بيانات المتجهات في ميلفوس لمستويات مختلفة من الاتساق. ترقبوا ذلك!</p>
<h2 id="Whats-next" class="common-anchor-header">ما التالي<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>مع الإصدار الرسمي لـ Milvus 2.1، قمنا بإعداد سلسلة من المدونات التي تقدم الميزات الجديدة. اقرأ المزيد في سلسلة المدونات هذه:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">كيفية استخدام بيانات السلسلة لتمكين تطبيقات البحث عن التشابه لديك</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">استخدام ميلفوس المدمج لتثبيت وتشغيل ميلفوس مع بايثون على الفور</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">زيادة إنتاجية قراءة قاعدة بيانات المتجهات باستخدام النسخ المتماثلة في الذاكرة</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">فهم مستوى الاتساق في قاعدة بيانات Milvus Vector في قاعدة بيانات Milvus</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">فهم مستوى الاتساق في قاعدة بيانات Milvus Vector (الجزء الثاني)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">كيف تضمن قاعدة بيانات Milvus Vector أمان البيانات؟</a></li>
</ul>
