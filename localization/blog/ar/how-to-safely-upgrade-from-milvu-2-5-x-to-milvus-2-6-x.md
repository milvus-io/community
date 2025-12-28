---
id: how-to-safely-upgrade-from-milvu-2-5-x-to-milvus-2-6-x.md
title: كيفية الترقية بأمان من Milvus 2.5.x إلى Milvus 2.6.x
author: Yiqing Lu
date: 2025-12-25T00:00:00.000Z
cover: assets.zilliz.com/Milvus_2_5_x_to_Milvus_2_6_x_cd2a5397fc.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, vector databases, Milvus 2.6 features, Nvidia Cagra, full text search'
meta_title: |
  How to Safely Upgrade from Milvus 2.5.x to Milvus 2.6.x
desc: >-
  استكشف الجديد في Milvus 2.6، بما في ذلك التغييرات في البنية والميزات الرئيسية،
  وتعرف على كيفية إجراء ترقية متجددة من Milvus 2.5.
origin: >-
  https://milvus.io/blog/how-to-safely-upgrade-from-milvu-2-5-x-to-milvus-2-6-x.md
---
<p>لقد تم إطلاق الإصدار<a href="https://milvus.io/docs/release_notes.md"><strong>Milvus 2.6</strong></a> منذ فترة، وقد أثبت أنه خطوة قوية للأمام بالنسبة للمشروع. يجلب الإصدار بنية محسّنة، وأداءً أقوى في الوقت الحقيقي، واستهلاكًا أقل للموارد، وسلوكًا أكثر ذكاءً في بيئات الإنتاج. تم تشكيل العديد من هذه التحسينات بشكل مباشر من خلال ملاحظات المستخدمين، وقد أبلغ المستخدمون الأوائل للإصدار 2.6.x عن بحث أسرع بشكل ملحوظ وأداء نظام أكثر قابلية للتنبؤ في ظل أعباء العمل الثقيلة أو الديناميكية.</p>
<p>بالنسبة للفرق التي تقوم بتشغيل الإصدار 2.5.x من ميلفوس وتقييم الانتقال إلى الإصدار 2.6.x، هذا الدليل هو نقطة البداية. فهو يفصل الاختلافات المعمارية، ويسلط الضوء على القدرات الرئيسية المقدمة في الإصدار 2.6 من ميلفوس 2.6، ويوفر مسارًا عمليًا للترقية خطوة بخطوة مصممًا لتقليل التعطيل التشغيلي إلى أدنى حد ممكن.</p>
<p>إذا كانت أعباء العمل الخاصة بك تتضمن خطوط أنابيب في الوقت الحقيقي، أو بحثًا متعدد الوسائط أو بحثًا مختلطًا، أو عمليات متجهة واسعة النطاق، فستساعدك هذه المدونة على تقييم ما إذا كان الإصدار 2.6 يتوافق مع احتياجاتك أم لا، وإذا قررت المتابعة، قم بالترقية بثقة مع الحفاظ على تكامل البيانات وتوافر الخدمة.</p>
<h2 id="Architecture-Changes-from-Milvus-25-to-Milvus-26" class="common-anchor-header">تغييرات البنية من ميلفوس 2.5 إلى ميلفوس 2.6<button data-href="#Architecture-Changes-from-Milvus-25-to-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>قبل الغوص في سير عمل الترقية نفسها، دعنا أولاً نفهم كيف تتغير بنية Milvus في Milvus 2.6.</p>
<h3 id="Milvus-25-Architecture" class="common-anchor-header">بنية ميلفوس 2.5</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_Architecture_2_5_4e228af3c4.PNG" alt="Milvus 2.5 Architecture" class="doc-image" id="milvus-2.5-architecture" />
   </span> <span class="img-wrapper"> <span>بنية ميلفوس 2.5</span> </span></p>
<p>في ميلفوس 2.5، كان سير العمل المتدفق والدفعي متشابكًا عبر عقد عاملة متعددة:</p>
<ul>
<li><p>عالجت<strong>QueryNode</strong> كلاً من الاستعلامات التاريخية <em>والاستعلامات</em> الإضافية (المتدفقة).</p></li>
<li><p>عالجت<strong>DataNode</strong> كلاً من تدفق البيانات في وقت الاستيعاب <em>وضغط</em> البيانات التاريخية في الخلفية.</p></li>
</ul>
<p>هذا الخلط بين منطق الدُفعات والوقت الحقيقي جعل من الصعب توسيع نطاق أعباء عمل الدُفعات بشكل مستقل. كما أنه يعني أيضًا أن حالة التدفق كانت مبعثرة عبر عدة مكونات، مما أدى إلى حدوث تأخيرات في المزامنة، وتعقيد عملية استرداد الأعطال، وزيادة التعقيد التشغيلي.</p>
<h3 id="Milvus-26-Architecture" class="common-anchor-header">بنية ميلفوس 2.6</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_Architecture_2_6_ee6f1f0635.PNG" alt="Milvus 2.6 Architecture" class="doc-image" id="milvus-2.6-architecture" />
   </span> <span class="img-wrapper"> <span>بنية ميلفوس 2.6</span> </span></p>
<p>يقدم Milvus 2.6 Milvus 2.6 <strong>عقدة دفق</strong> مخصصة تتولى جميع مسؤوليات البيانات في الوقت الحقيقي: استهلاك قائمة انتظار الرسائل، وكتابة المقاطع التزايدية، وخدمة الاستعلامات التزايدية، وإدارة الاسترداد المستند إلى WAL. مع عزل التدفق، تأخذ المكونات المتبقية أدوارًا أنظف وأكثر تركيزًا:</p>
<ul>
<li><p>تتعامل<strong>QueryNode</strong> الآن مع الاستعلامات الدفعية <em>فقط</em> على المقاطع التاريخية.</p></li>
<li><p>تتعامل<strong>DataNode</strong> الآن مع مهام البيانات التاريخية <em>فقط</em> مثل الضغط وبناء الفهرس.</p></li>
</ul>
<p>تستوعب StreamingNode جميع المهام المتعلقة بالبث التي كانت مقسمة بين DataNode وQueryNode وحتى الوكيل في Milvus 2.5، مما يضفي وضوحًا ويقلل من مشاركة الحالة بين الأدوار.</p>
<h3 id="Milvus-25x-vs-Milvus-26x-Component-by-Component-Comparison" class="common-anchor-header">Milvus 2.5.x مقابل Milvus 2.6.x: مقارنة بين كل مكون على حدة</h3><table>
<thead>
<tr><th></th><th style="text-align:center"><strong>Milvus 2.5.x</strong></th><th style="text-align:center"><strong>ميلفوس 2.6.x</strong></th><th style="text-align:center"><strong>ما الذي تغير</strong></th></tr>
</thead>
<tbody>
<tr><td>خدمات المنسق</td><td style="text-align:center">RootCoord / QueryCoord / DataCoord (أو MixCoord)</td><td style="text-align:center">MixCoord</td><td style="text-align:center">يتم دمج إدارة البيانات الوصفية وجدولة المهام في MixCoord واحد، مما يبسط منطق التنسيق ويقلل من التعقيد الموزع.</td></tr>
<tr><td>طبقة الوصول</td><td style="text-align:center">الوكيل</td><td style="text-align:center">الوكيل</td><td style="text-align:center">يتم توجيه طلبات الكتابة فقط من خلال عقدة البث لاستيعاب البيانات.</td></tr>
<tr><td>العقد العاملة</td><td style="text-align:center">-</td><td style="text-align:center">عقدة التدفق</td><td style="text-align:center">عقدة معالجة دفق مخصصة مسؤولة عن جميع منطق المعالجة التزايدية (المقاطع المتزايدة)، بما في ذلك: - استيعاب البيانات التزايدية- الاستعلام عن البيانات التزايدية- نقل البيانات التزايدية إلى مخزن الكائنات- الكتابة القائمة على الدفق- استرداد الفشل استنادًا إلى WAL</td></tr>
<tr><td></td><td style="text-align:center">عقدة الاستعلام</td><td style="text-align:center">عقدة الاستعلام</td><td style="text-align:center">عقدة معالجة الدفعات التي تعالج الاستعلامات على البيانات التاريخية فقط.</td></tr>
<tr><td></td><td style="text-align:center">عقدة البيانات</td><td style="text-align:center">عقدة البيانات</td><td style="text-align:center">عقدة معالجة الدفعات المسؤولة عن البيانات التاريخية فقط، بما في ذلك الضغط وبناء الفهرس.</td></tr>
<tr><td></td><td style="text-align:center">عقدة الفهرس</td><td style="text-align:center">-</td><td style="text-align:center">تم دمج عقدة الفهرس في عقدة البيانات، مما يبسط تعريفات الأدوار وطوبولوجيا النشر.</td></tr>
</tbody>
</table>
<p>باختصار، يرسم الإصدار Milvus 2.6 خطًا واضحًا بين أعباء العمل المتدفقة والدُفعات؛ مما يزيل التشابك بين المكونات التي شوهدت في الإصدار 2.5 ويخلق بنية أكثر قابلية للتطوير والصيانة.</p>
<h2 id="Milvus-26-Feature-Highlights" class="common-anchor-header">أبرز ميزات الإصدار 2.6 من ميلفوس<button data-href="#Milvus-26-Feature-Highlights" class="anchor-icon" translate="no">
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
    </button></h2><p>قبل الدخول في سير عمل الترقية، إليك نظرة سريعة على ما يجلبه الإصدار Milvus 2.6 إلى الطاولة. <strong>يركّز هذا الإصدار على خفض تكلفة البنية التحتية، وتحسين أداء البحث، وتسهيل توسيع نطاق أعباء عمل الذكاء الاصطناعي الديناميكي الكبير.</strong></p>
<h3 id="Cost--Efficiency-Improvements" class="common-anchor-header">تحسينات التكلفة والكفاءة</h3><ul>
<li><p><strong>تكميم</strong><a href="https://milvus.io/docs/ivf-rabitq.md#RaBitQ"><strong>RaBitQ</strong></a> <strong>للفهارس الأساسية</strong> - طريقة تكميم جديدة بحجم 1 بت تضغط فهارس المتجهات إلى <strong>1/32</strong> من حجمها الأصلي. وبالاقتران مع إعادة ترتيب SQ8، فإنها تقلل من استخدام الذاكرة إلى 28% تقريبًا، وتعزز QPS بنسبة 4 أضعاف، وتحافظ على نسبة استرجاع تصل إلى 95% تقريبًا، مما يقلل من تكاليف الأجهزة بشكل كبير.</p></li>
<li><p><strong>البحث عن النص الكامل</strong><a href="https://milvus.io/docs/full-text-search.md#BM25-implementation"><strong>المحسّن BM25</strong></a> - تسجيل نقاط BM25 الأصلي المدعوم بمتجهات متناثرة ذات وزن مصطلح متناثر. يعمل البحث عن الكلمات الرئيسية <strong>بسرعة 3-4 أضعاف</strong> (حتى <strong>7 أضعاف</strong> في بعض مجموعات البيانات) مقارنةً ب Elasticsearch، مع الحفاظ على حجم الفهرس في حدود ثلث البيانات النصية الأصلية.</p></li>
<li><p><strong>فهرسة مسار JSON مع فهرسة JSON Shredding</strong> - أصبحت التصفية المهيكلة على JSON المتداخلة أسرع بشكل كبير وأكثر قابلية للتنبؤ. تقلل مسارات JSON المفهرسة مسبقًا من زمن انتقال التصفية من <strong>140 مللي ثانية إلى 1.5 مللي ثانية</strong> (P99: <strong>480 مللي ثانية إلى 10 مللي ثانية</strong>)، مما يجعل البحث المتجه الهجين + تصفية البيانات الوصفية أكثر استجابة بشكل كبير.</p></li>
<li><p><strong>دعم نوع البيانات الموسع</strong> - يضيف أنواع متجهات Int8، وحقول <a href="https://milvus.io/docs/geometry-field.md#Geometry-Field">هندسية</a> (POINT / LINESTRING / POLYGON)، وصفيف الهياكل. تدعم هذه الإضافات أعباء العمل الجغرافية المكانية ونمذجة البيانات الوصفية الأكثر ثراءً ومخططات أنظف.</p></li>
<li><p><strong>Upsert للتحديثات الجزئية</strong> - يمكنك الآن إدراج الكيانات أو تحديثها باستخدام استدعاء مفتاح أساسي واحد. تقوم التحديثات الجزئية بتعديل الحقول المتوفرة فقط، مما يقلل من تضخيم الكتابة ويبسط خطوط الأنابيب التي تقوم بتحديث البيانات الوصفية أو التضمينات بشكل متكرر.</p></li>
</ul>
<h3 id="Search-and-Retrieval-Enhancements" class="common-anchor-header">تحسينات البحث والاسترجاع</h3><ul>
<li><p><strong>تحسين معالجة النصوص ودعم متعدد اللغات:</strong> تعمل معالجات لينديرا و ICU الرمزية الجديدة على تحسين معالجة النصوص اليابانية والكورية ومتعددة <a href="https://milvus.io/docs/multi-language-analyzers.md#Multi-language-Analyzers">اللغات</a>. يدعم Jieba الآن القواميس المخصصة. <code translate="no">run_analyzer</code> يساعد في تصحيح سلوك الترميز، وتضمن المحللات متعددة اللغات إجراء بحث متسق عبر اللغات.</p></li>
<li><p><strong>مطابقة نصية عالية الدقة:</strong> تفرض <a href="https://milvus.io/docs/phrase-match.md#Phrase-Match">مطابقة العبارات</a> استعلامات العبارات المرتبة مع انحدار قابل للتكوين. يعمل فهرس <a href="https://milvus.io/docs/ngram.md#NGRAM">NGRAM</a> الجديد على تسريع الاستعلامات الفرعية و <code translate="no">LIKE</code> على كل من حقول VARCHAR ومسارات JSON، مما يتيح مطابقة سريعة للنص الجزئي والمطابقة الضبابية.</p></li>
<li><p><strong>إعادة الترتيب الواعية بالوقت والبيانات الوصفية الواعية:</strong> يقوم <a href="https://milvus.io/docs/decay-ranker-overview.md">مصنفو التضاؤل</a> (الأسي، الخطي، الغوسي) بتعديل الدرجات باستخدام الطوابع الزمنية؛ بينما يطبق <a href="https://milvus.io/docs/boost-ranker.md#Boost-Ranker">مصنفو التعزيز</a> قواعد تعتمد على البيانات الوصفية لترقية النتائج أو تخفيضها. يساعد كلاهما في ضبط سلوك الاسترجاع دون تغيير البيانات الأساسية.</p></li>
<li><p><strong>تكامل مبسط للنموذج والتوجيه التلقائي:</strong> تسمح عمليات التكامل المدمجة مع OpenAI وHugging Face وموفري التضمين الآخرين لـ Milvus بتحويل النص تلقائيًا إلى ناقلات أثناء عمليات الإدراج والاستعلام. لا مزيد من خطوط أنابيب التضمين اليدوية لحالات الاستخدام الشائعة.</p></li>
<li><p><strong>تحديثات المخطط عبر الإنترنت للحقول العددية:</strong> إضافة حقول قياسية جديدة إلى المجموعات الحالية دون توقف أو إعادة تحميلها، مما يبسّط تطور المخطط مع نمو متطلبات البيانات الوصفية.</p></li>
<li><p><strong>اكتشاف التكرار القريب من التكرار مع MinHash:</strong> يتيح <a href="https://milvus.io/docs/minhash-lsh.md#MINHASHLSH">MinHash</a> + LSH إمكانية الكشف الفعال عن التكرارات شبه المكررة عبر مجموعات البيانات الكبيرة دون إجراء مقارنات دقيقة مكلفة.</p></li>
</ul>
<h3 id="Architecture-and-Scalability-Upgrades" class="common-anchor-header">ترقيات البنية وقابلية التوسع</h3><ul>
<li><p><a href="https://milvus.io/docs/tiered-storage-overview.md#Tiered-Storage-Overview"><strong>تخزين متدرج</strong></a> <strong>لإدارة البيانات الباردة والساخنة:</strong> يفصل بين البيانات الساخنة والباردة عبر SSD وتخزين الكائنات؛ ويدعم التحميل البطيء والجزئي؛ ويزيل الحاجة إلى تحميل المجموعات بالكامل محلياً؛ ويقلل من استخدام الموارد بنسبة تصل إلى 50% ويسرّع أوقات التحميل لمجموعات البيانات الكبيرة.</p></li>
<li><p><strong>خدمة البث في الوقت الحقيقي:</strong> تضيف عُقد تدفق مخصصة مدمجة مع Kafka/Pulsar للاستيعاب المستمر؛ وتتيح الفهرسة الفورية وتوافر الاستعلام؛ وتحسّن إنتاجية الكتابة وتسرّع من استرداد الأعطال لأحمال العمل سريعة التغير في الوقت الفعلي.</p></li>
<li><p><strong>تعزيز قابلية التوسع والاستقرار:</strong> يدعم Milvus الآن أكثر من 100,000 مجموعة للبيئات الكبيرة متعددة المستأجرين. تعمل ترقيات البنية التحتية - <a href="https://milvus.io/docs/woodpecker_architecture.md#Woodpecker">Woodpecker</a> (WAL بدون قرص)، <a href="https://milvus.io/docs/roadmap.md#%F0%9F%94%B9-HotCold-Tiering--Storage-Architecture-StorageV2">والتخزين v2</a> (انخفاض IOPS/الذاكرة)، <a href="https://milvus.io/docs/release_notes.md#Coordinator-Merge-into-MixCoord">ودمج المنسق</a> - على تحسين استقرار المجموعة وتمكين التوسع المتوقع في ظل أعباء العمل الثقيلة.</p></li>
</ul>
<p>للاطلاع على قائمة كاملة بميزات الإصدار Milvus 2.6، راجع <a href="https://milvus.io/docs/release_notes.md">ملاحظات إصدار Milvus</a>.</p>
<h2 id="How-to-Upgrade-from-Milvus-25x-to-Milvus-26x" class="common-anchor-header">كيفية الترقية من Milvus 2.5.x إلى Milvus 2.6.x<button data-href="#How-to-Upgrade-from-Milvus-25x-to-Milvus-26x" class="anchor-icon" translate="no">
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
    </button></h2><p>للحفاظ على النظام متاحًا قدر الإمكان أثناء الترقية، يجب ترقية مجموعات Milvus 2.5 إلى Milvus 2.6 بالترتيب التالي.</p>
<p><strong>1. بدء تشغيل عقدة البث أولاً</strong></p>
<p>ابدأ تشغيل عقدة البث أولاً. يجب نقل <strong>المفوض</strong> الجديد (المكون الموجود في عقدة الاستعلام المسؤول عن معالجة بيانات التدفق) إلى عقدة تدفق ميلفوس 2.6.</p>
<p><strong>2. ترقية MixCoord</strong></p>
<p>قم بترقية مكونات المنسق إلى <strong>MixCoord</strong>. خلال هذه الخطوة، يحتاج MixCoord إلى اكتشاف إصدارات عقدة العامل من أجل التعامل مع التوافق بين الإصدارات داخل النظام الموزع.</p>
<p><strong>3. ترقية عقدة الاستعلام</strong></p>
<p>عادةً ما تستغرق ترقيات عقدة الاستعلام وقتاً أطول. خلال هذه المرحلة، يمكن لعُقد البيانات وعُقد الفهرس Milvus 2.5 الاستمرار في التعامل مع عمليات مثل التدفق وبناء الفهرس، مما يساعد على تقليل الضغط من جانب الاستعلام أثناء ترقية عُقد الاستعلام.</p>
<p><strong>4. ترقية عقدة البيانات</strong></p>
<p>بمجرد إيقاف عقد البيانات Milvus 2.5 DataNodes، تصبح عمليات التدفق غير متوفرة، وقد تستمر البيانات في القطاعات المتزايدة في التراكم حتى تتم ترقية جميع العقد بالكامل إلى Milvus 2.6.</p>
<p><strong>5. ترقية الوكيل</strong></p>
<p>بعد ترقية وكيل إلى Milvus 2.6، ستظل عمليات الكتابة على هذا الوكيل غير متاحة حتى تتم ترقية جميع مكونات المجموعة إلى 2.6.</p>
<p><strong>6. إزالة عقدة الفهرس</strong></p>
<p>بمجرد ترقية جميع المكونات الأخرى، يمكن إزالة عقدة الفهرس المستقلة بأمان.</p>
<p><strong>ملاحظات:</strong></p>
<ul>
<li><p>من اكتمال ترقية عقدة البيانات حتى اكتمال ترقية الوكيل، تكون عمليات التدفق غير متاحة.</p></li>
<li><p>من وقت ترقية الوكيل الأول حتى تتم ترقية جميع عقد الوكيل، تكون بعض عمليات الكتابة غير متاحة.</p></li>
<li><p><strong>عند الترقية مباشرةً من Milvus 2.5.x إلى 2.6.6.6، تكون عمليات DDL (لغة تعريف البيانات) غير متوفرة أثناء عملية الترقية بسبب التغييرات في إطار عمل DDL.</strong></p></li>
</ul>
<h2 id="How-to-Upgrade-to-Milvus-26-with-Milvus-Operator" class="common-anchor-header">كيفية الترقية إلى ميلفوس 2.6 باستخدام مشغل ميلفوس<button data-href="#How-to-Upgrade-to-Milvus-26-with-Milvus-Operator" class="anchor-icon" translate="no">
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
    </button></h2><p>مشغل Milvus<a href="https://github.com/zilliztech/milvus-operator">Operator</a> هو مشغل Kubernetes مفتوح المصدر يوفر طريقة قابلة للتطوير ومتاحة بشكل كبير لنشر وإدارة وترقية مجموعة خدمات Milvus بأكملها على مجموعة Kubernetes المستهدفة. تتضمن مجموعة خدمات Milvus التي يديرها المشغل ما يلي:</p>
<ul>
<li><p>مكونات ميلفوس الأساسية</p></li>
<li><p>التبعيات المطلوبة مثل etcd، وPulsar، وMinIO</p></li>
</ul>
<p>يتبع مشغل Milvus نمط مشغل Kubernetes القياسي. يقدم مورد Milvus المخصص (CR) الذي يصف الحالة المرغوبة لمجموعة Milvus، مثل الإصدار والطوبولوجيا والتكوين.</p>
<p>تقوم وحدة التحكم بمراقبة الكتلة باستمرار ومطابقة الحالة الفعلية مع الحالة المطلوبة المحددة في CR. عندما يتم إجراء التغييرات - مثل ترقية إصدار Milvus - يقوم المشغل بتطبيقها تلقائيًا بطريقة محكومة وقابلة للتكرار، مما يتيح إجراء ترقيات تلقائية وإدارة دورة الحياة المستمرة.</p>
<h3 id="Milvus-Custom-Resource-CR-Example" class="common-anchor-header">مثال على مورد Milvus المخصص (CR)</h3><pre><code translate="no">apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: my-milvus-mansion    
  namespace: dev       
spec:
  mode: cluster                  <span class="hljs-comment"># cluster or standalone</span>
  <span class="hljs-comment"># Milvus Components</span>
  components:
    image: milvusdb/milvus:v2.6.5
    imageUpdateMode: rollingUpgrade 
    proxy:                   
      replicas: 1          
    mixCoord:              
      replicas: 1           
    dataNode:               
      replicas: 1          
    queryNode:              
      replicas: 2           
      resources:
        requests:
          cpu: <span class="hljs-string">&quot;2&quot;</span>
          memory: <span class="hljs-string">&quot;8Gi&quot;</span>  
  <span class="hljs-comment"># Dependencies, including etcd, storage and message stream</span>
  dependencies:
    etcd:                   
      inCluster:
        values:
          replicaCount: 3    
    storage:                 
      <span class="hljs-built_in">type</span>: MinIO
      inCluster:
        values:
          mode: distributed     
    msgStreamType: pulsar    
    pulsar:
      inCluster:
        values:
          bookkeeper:
            replicas: 3   
  <span class="hljs-comment"># Milvus configs</span>
  config:
    dataCoord:
      enableActiveStandby: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Rolling-Upgrades-from-Milvus-25-to-26-with-Milvus-Operator" class="common-anchor-header">ترقيات متجددة من Milvus 2.5 إلى 2.6 باستخدام مشغل Milvus</h3><p>يوفر مشغل Milvus دعمًا مدمجًا للترقيات <strong>المتجددة من Milvus 2.5 إلى 2.6</strong> في وضع التجميع، مع تكييف سلوكه لمراعاة التغييرات المعمارية المقدمة في 2.6.</p>
<p><strong>1. اكتشاف سيناريو الترقية</strong></p>
<p>أثناء الترقية، يقوم مشغل Milvus بتحديد إصدار Milvus المستهدف من مواصفات المجموعة. يتم ذلك إما عن طريق:</p>
<ul>
<li><p>فحص علامة الصورة المحددة في <code translate="no">spec.components.image</code> ، أو</p></li>
<li><p>قراءة الإصدار الصريح المحدد في <code translate="no">spec.components.version</code></p></li>
</ul>
<p>ثم يقوم المشغل بمقارنة هذا الإصدار المطلوب مع الإصدار قيد التشغيل حاليًا، والذي يتم تسجيله في <code translate="no">status.currentImage</code> أو <code translate="no">status.currentVersion</code>. إذا كان الإصدار الحالي هو 2.5 والإصدار المطلوب هو 2.6، يقوم المشغل بتحديد الترقية كسيناريو ترقية 2.5 → 2.6.</p>
<p><strong>2. ترتيب تنفيذ الترقية المتداول</strong></p>
<p>عندما يتم الكشف عن ترقية 2.5 → 2.6 ويتم تعيين وضع الترقية إلى ترقية متجددة (<code translate="no">spec.components.imageUpdateMode: rollingUpgrade</code> ، وهو الوضع الافتراضي)، يقوم مشغل Milvus تلقائيًا بتنفيذ الترقية بترتيب محدد مسبقًا يتماشى مع بنية Milvus 2.6:</p>
<p>بدء تشغيل عقدة البث ← ترقية MixCoord ← ترقية عقدة الاستعلام ← ترقية عقدة البيانات ← ترقية الوكيل ← إزالة عقدة الفهرس</p>
<p><strong>3. دمج المنسق التلقائي</strong></p>
<p>يستبدل برنامج Milvus 2.6 مكونات المنسق المتعددة بمنسق واحد MixCoord. يعالج مشغل ميلفوس هذا الانتقال المعماري تلقائيًا.</p>
<p>عندما يتم تكوين <code translate="no">spec.components.mixCoord</code> ، يقوم المشغل بإحضار MixCoord وينتظر حتى يصبح جاهزًا. بمجرد تشغيل MixCoord بشكل كامل، يقوم المشغل بإيقاف تشغيل مكونات المنسق القديم بأمان - الجذر، والاستعلام، والبيانات - لإكمال عملية الترحيل دون الحاجة إلى أي تدخل يدوي.</p>
<h3 id="Upgrade-Steps-from-Milvus-25-to-26" class="common-anchor-header">خطوات الترقية من ميلفوس 2.5 إلى 2.6</h3><p>1- قم بترقية مشغل Milvus إلى أحدث إصدار (في هذا الدليل، نستخدم <strong>الإصدار 1.3.3،</strong> وهو أحدث إصدار وقت كتابة هذا الدليل).</p>
<pre><code translate="no"><span class="hljs-comment"># Option 1: Using Helm</span>
helm upgrade --install milvus-operator \
  -n milvus-operator --create-namespace \
  https://github.com/zilliztech/milvus-operator/releases/download/v1.3.3/milvus-operator-1.3.3.tgz
 <span class="hljs-comment"># Option 2: Using kubectl &amp; raw manifests</span>
 kubectl apply -f https://raw.githubusercontent.com/zilliztech/milvus-operator/v1.3.3/deploy/manifests/deployment.yaml
<button class="copy-code-btn"></button></code></pre>
<p>2- دمج مكونات المنسق</p>
<pre><code translate="no">kubectl patch milvus my-release -n demo-operator --<span class="hljs-built_in">type</span>=merge -p <span class="hljs-string">&#x27;
{
  &quot;spec&quot;: {
    &quot;components&quot;: {
      &quot;mixCoord&quot;: {
        &quot;replicas&quot;: 1
      }
    }
  }
}&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>3- تأكد من أن المجموعة تعمل بنظام Milvus 2.5.16 أو أحدث</p>
<pre><code translate="no">kubectl patch milvus my-release -n demo-operator --<span class="hljs-built_in">type</span>=merge -p <span class="hljs-string">&#x27;
{
  &quot;spec&quot;: {
    &quot;components&quot;: {
      &quot;image&quot;: &quot;milvusdb/milvus:v2.5.22&quot;
    }
  }
}&#x27;</span>
<span class="hljs-comment"># wait till updated</span>
kubectl <span class="hljs-built_in">wait</span> milvus my-release -n demo-operator --<span class="hljs-keyword">for</span>=condition=milvusupdated --<span class="hljs-built_in">timeout</span>=1h
<button class="copy-code-btn"></button></code></pre>
<p>4- ترقية ميلفوس إلى الإصدار 2.6</p>
<pre><code translate="no">kubectl patch milvus my-release -n demo-operator --<span class="hljs-built_in">type</span>=merge -p <span class="hljs-string">&#x27;
{
  &quot;spec&quot;: {
    &quot;components&quot;: {
      &quot;image&quot;: &quot;milvusdb/milvus:v2.6.5&quot;
    }
  }
}&#x27;</span>
<span class="hljs-comment"># wait till updated</span>
kubectl <span class="hljs-built_in">wait</span> milvus my-release -n demo-operator --<span class="hljs-keyword">for</span>=condition=milvusupdated --<span class="hljs-built_in">timeout</span>=1h
<button class="copy-code-btn"></button></code></pre>
<h2 id="How-to-Upgrade-to-Milvus-26-with-Helm" class="common-anchor-header">كيفية الترقية إلى Milvus 2.6 باستخدام Helm<button data-href="#How-to-Upgrade-to-Milvus-26-with-Helm" class="anchor-icon" translate="no">
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
    </button></h2><p>عند نشر Milvus باستخدام Helm، يتم تحديث جميع موارد Kubernetes <code translate="no">Deployment</code> بالتوازي، دون ترتيب تنفيذ مضمون. نتيجة لذلك، لا يوفر Helm تحكمًا صارمًا في تسلسلات الترقية المتجددة عبر المكونات. لذلك يوصى بشدة باستخدام مشغل Milvus لبيئات الإنتاج.</p>
<p>لا يزال من الممكن ترقية Milvus من 2.5 إلى 2.6 باستخدام Helm باتباع الخطوات التالية.</p>
<p>متطلبات النظام</p>
<ul>
<li><p><strong>إصدار Helm:</strong> ≥ 3.14.0</p></li>
<li><p><strong>إصدار Kubernetes:</strong> ≥ 1.20.0</p></li>
</ul>
<p>1- قم بترقية مخطط Milvus Helm إلى أحدث إصدار. في هذا الدليل، نستخدم <strong>الإصدار 5.0.7 من المخطط</strong>، والذي كان الأحدث في وقت كتابة هذا الدليل.</p>
<pre><code translate="no">helm repo <span class="hljs-keyword">add</span> zilliztech https:<span class="hljs-comment">//zilliztech.github.io/milvus-helm</span>
helm repo update
<button class="copy-code-btn"></button></code></pre>
<p>2- إذا تم نشر المجموعة بمكونات منسقين متعددين، قم أولاً بترقية Milvus إلى الإصدار 2.5.16 أو أحدث وتمكين MixCoord.</p>
<pre><code translate="no">mixCoordinator
。
helm upgrade -i my-release zilliztech/milvus \
  --namespace=helm-demo \
  --<span class="hljs-built_in">set</span> image.all.tag=<span class="hljs-string">&quot;v2.5.22&quot;</span> \
  --<span class="hljs-built_in">set</span> mixCoordinator.enabled=<span class="hljs-literal">true</span> \
  --<span class="hljs-built_in">set</span> rootCoordinator.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> indexCoordinator.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> queryCoordinator.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> dataCoordinator.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> streaming.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> indexNode.enabled=<span class="hljs-literal">true</span> \
  --reset-then-reuse-values \
  --version=5.0.7 \
  --<span class="hljs-built_in">wait</span> --<span class="hljs-built_in">timeout</span> 1h
<button class="copy-code-btn"></button></code></pre>
<p>3- ترقية ميلفوس إلى الإصدار 2.6</p>
<pre><code translate="no">helm upgrade my-release zilliztech/milvus \
  --namespace=helm-demo \
  --<span class="hljs-built_in">set</span> image.all.tag=<span class="hljs-string">&quot;v2.6.5&quot;</span> \
  --<span class="hljs-built_in">set</span> streaming.enabled=<span class="hljs-literal">true</span> \
  --<span class="hljs-built_in">set</span> indexNode.enabled=<span class="hljs-literal">false</span> \
  --reset-then-reuse-values \
  --version=5.0.7 \
  --<span class="hljs-built_in">wait</span> --<span class="hljs-built_in">timeout</span> 1h
<button class="copy-code-btn"></button></code></pre>
<h2 id="FAQ-on-Milvus-26-Upgrade-and-Operations" class="common-anchor-header">الأسئلة الشائعة حول ترقية الإصدار 2.6 من ميلفوس وعملياته<button data-href="#FAQ-on-Milvus-26-Upgrade-and-Operations" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Q1-Milvus-Helm-vs-Milvus-Operator--which-one-should-I-use" class="common-anchor-header">س1: برنامج Milvus Helm مقابل برنامج Milvus Operator - أيهما يجب أن أستخدم؟</h3><p>بالنسبة لبيئات الإنتاج، يوصى بشدة باستخدام مشغل Milvus Helm.</p>
<p>راجع الدليل الرسمي للحصول على التفاصيل: <a href="https://github.com/zilliztech/milvus-operator?tab=readme-ov-file#milvus-operator-vs-helm">https://github.com/zilliztech/milvus-operator?tab=readme-ov-file#milvus-operator-vs-helm</a></p>
<h3 id="Q2-How-should-I-choose-a-Message-Queue-MQ" class="common-anchor-header">س2: كيف يمكنني اختيار قائمة انتظار الرسائل (MQ)؟</h3><p>يعتمد MQ الموصى به على وضع النشر والمتطلبات التشغيلية:</p>
<p><strong>1. الوضع المستقل:</strong> بالنسبة لعمليات النشر الحساسة من حيث التكلفة، يوصى باستخدام RocksMQ.</p>
<p><strong>2. الوضع العنقودي</strong></p>
<ul>
<li><p>يدعم<strong>Pulsar</strong> الإيجار المتعدد، ويسمح للمجموعات الكبيرة بمشاركة البنية التحتية، ويوفر قابلية توسع أفقي قوية.</p></li>
<li><p>تمتلك<strong>كافكا</strong> نظامًا بيئيًا أكثر نضجًا، مع توفر عروض SaaS المدارة على معظم المنصات السحابية الرئيسية.</p></li>
</ul>
<p><strong>3. نقار الخشب (تم تقديمه في ميلفوس 2.6):</strong> يزيل Woodpecker الحاجة إلى قائمة انتظار رسائل خارجية، مما يقلل من التكلفة والتعقيد التشغيلي.</p>
<ul>
<li><p>حاليًا، يتم دعم وضع Woodpecker المدمج فقط، وهو خفيف الوزن وسهل التشغيل.</p></li>
<li><p>بالنسبة لعمليات النشر المستقلة ل Milvus 2.6، يوصى باستخدام Woodpecker.</p></li>
<li><p>بالنسبة لعمليات نشر مجموعة الإنتاج، يوصى باستخدام وضع مجموعة Woodpecker القادم بمجرد أن يصبح متاحًا.</p></li>
</ul>
<h3 id="Q3-Can-the-Message-Queue-be-switched-during-an-upgrade" class="common-anchor-header">س3: هل يمكن تبديل قائمة انتظار الرسائل أثناء الترقية؟</h3><p>لا، تبديل قائمة انتظار الرسائل أثناء الترقية غير مدعوم حاليًا. ستقدم الإصدارات المستقبلية واجهات برمجة تطبيقات الإدارة لدعم التبديل بين Pulsar وKafka وWoodpecker وRocksMQ.</p>
<h3 id="Q4-Do-rate-limiting-configurations-need-to-be-updated-for-Milvus-26" class="common-anchor-header">س4: هل تحتاج تكوينات تحديد المعدل إلى تحديثها من أجل Milvus 2.6؟</h3><p>لا، تظل تكوينات تحديد المعدل الحالية فعالة وتنطبق أيضًا على عقدة البث الجديدة. لا توجد تغييرات مطلوبة.</p>
<h3 id="Q5-After-the-coordinator-merge-do-monitoring-roles-or-configurations-change" class="common-anchor-header">س5: بعد دمج المنسق، هل تتغير أدوار المراقبة أو التكوينات؟</h3><ul>
<li><p>تظل أدوار المراقبة دون تغيير (<code translate="no">RootCoord</code> ، <code translate="no">QueryCoord</code> ، <code translate="no">DataCoord</code>).</p></li>
<li><p>تستمر خيارات التكوين الحالية في العمل كما كانت من قبل.</p></li>
<li><p>يتم تقديم خيار تكوين جديد، <code translate="no">mixCoord.enableActiveStandby</code> ، وسيعود إلى <code translate="no">rootcoord.enableActiveStandby</code> إذا لم يتم تعيينه بشكل صريح.</p></li>
</ul>
<h3 id="Q6-What-are-the-recommended-resource-settings-for-StreamingNode" class="common-anchor-header">س 6: ما هي إعدادات الموارد الموصى بها لعقدة البث؟</h3><ul>
<li><p>بالنسبة للاستيعاب الخفيف في الوقت الحقيقي أو أعباء عمل الكتابة والاستعلام العرضية، يكفي تكوين أصغر، مثل 2 نواة وحدة معالجة مركزية و8 جيجابايت من الذاكرة.</p></li>
<li><p>أما بالنسبة للإدخال في الوقت الحقيقي الثقيل أو أعباء عمل الكتابة والاستعلام المستمرة، يوصى بتخصيص موارد مماثلة لتلك الموجودة في عقدة الاستعلام.</p></li>
</ul>
<h3 id="Q7-How-do-I-upgrade-a-standalone-deployment-using-Docker-Compose" class="common-anchor-header">س7: كيف يمكنني ترقية عملية نشر مستقلة باستخدام Docker Compose؟</h3><p>بالنسبة لعمليات النشر المستقلة المستندة إلى Docker Compose، ما عليك سوى تحديث علامة صورة Milvus في <code translate="no">docker-compose.yaml</code>.</p>
<p>راجع الدليل الرسمي للحصول على التفاصيل: <a href="https://milvus.io/docs/upgrade_milvus_standalone-docker.md">https://milvus.io/docs/upgrade_milvus_standalone-docker.md</a>.</p>
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
    </button></h2><p>يمثل Milvus 2.6 تحسنًا كبيرًا في كل من البنية والعمليات. من خلال الفصل بين معالجة التدفق والمعالجة المجمعة مع تقديم StreamingNode، ودمج المنسقين في MixCoord، وتبسيط أدوار العاملين، يوفر Milvus 2.6 أساسًا أكثر استقرارًا وقابلية للتطوير وأسهل في التشغيل لأعباء عمل المتجهات واسعة النطاق.</p>
<p>هذه التغييرات المعمارية تجعل الترقيات - خاصةً من Milvus 2.5 - أكثر حساسية للطلب. تعتمد الترقية الناجحة على احترام تبعيات المكونات وقيود التوافر المؤقت. بالنسبة لبيئات الإنتاج، يعتبر Milvus Operator هو النهج الموصى به، حيث إنه يعمل على أتمتة تسلسل الترقية ويقلل من المخاطر التشغيلية، في حين أن الترقيات المستندة إلى Helm مناسبة بشكل أفضل لحالات الاستخدام غير الإنتاجية.</p>
<p>بفضل إمكانات البحث المحسّنة، وأنواع البيانات الأكثر ثراءً، والتخزين المتدرج، وخيارات قائمة انتظار الرسائل المحسّنة، فإن Milvus 2.6 في وضع جيد لدعم تطبيقات الذكاء الاصطناعي الحديثة التي تتطلب استيعابًا في الوقت الحقيقي، وأداءً عاليًا للاستعلام، وعمليات فعالة على نطاق واسع.</p>
<p>هل لديك أسئلة أو تريد التعمق في أي ميزة من أحدث إصدار من Milvus؟ انضم إلى<a href="https://discord.com/invite/8uyFbECzPX"> قناة Discord</a> الخاصة بنا أو سجل المشكلات على<a href="https://github.com/milvus-io/milvus"> GitHub</a>. يمكنك أيضًا حجز جلسة فردية مدتها 20 دقيقة للحصول على رؤى وإرشادات وإجابات عن أسئلتك من خلال<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> ساعات عمل Milvus المكتبية</a>.</p>
<h2 id="More-Resources-about-Milvus-26" class="common-anchor-header">المزيد من المصادر حول ملفوس 2.6<button data-href="#More-Resources-about-Milvus-26" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/docs/release_notes.md">ملاحظات إصدار ميلفوس 2.6</a></p></li>
<li><p><a href="https://www.youtube.com/watch?v=Guct-UMK8lw&amp;t=157s">تسجيل ندوة عبر الويب لـ Milvus 2.6: بحث أسرع وتكلفة أقل وتوسيع نطاق أكثر ذكاءً</a></p></li>
<li><p>مدونات ميزات الإصدار ميلفوس 2.6</p>
<ul>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">تقديم وظيفة التضمين: كيف يعمل ملفوس 2.6 على تبسيط عملية التضمين والبحث الدلالي</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">تمزيق JSON في ميلفوس: تصفية JSON أسرع ب 88.9 مرة مع المرونة</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">فتح الاسترجاع الحقيقي على مستوى الكيان: مجموعة جديدة من الهياكل وإمكانيات MAX_SIM في Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/milvus-tiered-storage-80-less-vector-search-cost-with-on-demand-hot%E2%80%93cold-data-loading.md">التوقف عن الدفع مقابل البيانات الباردة: تخفيض التكلفة بنسبة 80٪ مع تحميل البيانات الباردة والساخنة عند الطلب في التخزين المتدرج في ميلفوس</a></p></li>
<li><p><a href="https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md">تقديم AISAQ في Milvus: بحث متجه بمليارات النطاقات أصبح أرخص ب 3,200 مرة على الذاكرة</a></p></li>
<li><p><a href="https://milvus.io/blog/faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md">تحسين NVIDIA CAGRA في ميلفوس: نهج هجين بين وحدة معالجة الرسومات ووحدة المعالجة المركزية للفهرسة الأسرع والاستعلامات الأرخص</a></p></li>
<li><p><a href="https://milvus.io/blog/milvus-ngram-index-faster-keyword-matching-and-like-queries-for-agent-workloads.md">تقديم فهرس ميلفوس نغرام: مطابقة أسرع للكلمات الرئيسية واستعلامات مشابهة لأحمال عمل الوكيل</a></p></li>
<li><p><a href="https://milvus.io/blog/unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md">الجمع بين التصفية الجغرافية المكانية والبحث المتجهي مع الحقول الهندسية وRTREE في Milvus 2.6</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">البحث عن المتجهات في العالم الحقيقي: كيفية التصفية بكفاءة دون قتل التذكر</a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">الارتقاء بضغط المتجهات إلى أقصى الحدود: كيف يخدم ميلفوس 3 أضعاف الاستعلامات باستخدام RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">تكذب المعايير - تستحق قواعد بيانات المتجهات اختبارًا حقيقيًا</a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">لقد استبدلنا كافكا/بولسار بنقار الخشب في ميلفوس - إليكم ما حدث</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH في ميلفوس: السلاح السري لمحاربة التكرارات في بيانات تدريب LLM</a></p></li>
</ul></li>
</ul>
