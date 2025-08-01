---
id: vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md
title: >-
  الإعلان عن VDBBench 1.0: المقارنة المعيارية لقاعدة بيانات المتجهات مفتوحة
  المصدر مع أعباء عمل الإنتاج في العالم الحقيقي
author: Tian Min
date: 2025-07-04T00:00:00.000Z
desc: >-
  اكتشف VDBBench 1.0، وهي أداة مفتوحة المصدر لقياس قواعد البيانات المتجهة
  باستخدام بيانات العالم الحقيقي، واستيعاب التدفق، وأعباء العمل المتزامنة.
cover: assets.zilliz.com/milvus_vdb_e0e8146c90.jpeg
tag: Announcements
recommend: false
publishToMedium: true
tags: 'vector database, Milvus, vectordb benchmarking, vector search'
meta_keywords: 'VDBBench, vector database, Milvus, Zilliz Cloud, benchmarking'
meta_title: |
  VDBBench 1.0: Real-World Benchmarking for Vector Databases
origin: >-
  https://zilliz.com/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads
---
<p>تختبر معظم معايير قواعد البيانات المتجهة باستخدام بيانات ثابتة وفهارس مبنية مسبقًا. ولكن أنظمة الإنتاج لا تعمل بهذه الطريقة - فالبيانات تتدفق باستمرار أثناء قيام المستخدمين بتشغيل الاستعلامات، وفهارس الفلاتر المجزأة، وخصائص الأداء تتغير بشكل كبير في ظل أحمال القراءة/الكتابة المتزامنة.</p>
<p>اليوم نطلق اليوم <a href="https://github.com/zilliztech/VectorDBBench/releases/tag/v1.0.0"><strong>VDBBench 1.0</strong></a>، وهو معيار مفتوح المصدر مصمم من الألف إلى الياء لاختبار قواعد البيانات المتجهة في ظل ظروف إنتاج واقعية: تدفق البيانات المتدفقة، وتصفية البيانات الوصفية مع انتقائية متفاوتة، وأعباء العمل المتزامنة التي تكشف عن اختناقات النظام الفعلية.</p>
<p><a href="https://github.com/zilliztech/VectorDBBench/releases/tag/v1.0.0"><strong>تنزيل VDBBench 1.0 → →</strong></a><a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch"> <strong>عرض لوحة المتصدرين →</strong></a></p>
<h2 id="Why-Current-Benchmarks-Are-Misleading" class="common-anchor-header">لماذا تعتبر المقاييس المعيارية الحالية مضللة<button data-href="#Why-Current-Benchmarks-Are-Misleading" class="anchor-icon" translate="no">
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
    </button></h2><p>لنكن صادقين - هناك ظاهرة غريبة في صناعتنا. يتحدث الجميع عن "عدم استخدام المعايير القياسية للألعاب"، ومع ذلك يشارك الكثيرون في هذا السلوك بالضبط. فمنذ انفجار سوق قواعد البيانات المتجهة في عام 2023، رأينا العديد من الأمثلة على الأنظمة التي "تُقيّم بشكل جميل" ولكنها "تفشل فشلاً ذريعاً" في الإنتاج، مما يؤدي إلى إضاعة الوقت الهندسي والإضرار بمصداقية المشروع.</p>
<p>لقد شهدنا هذا الانفصال بشكل مباشر. على سبيل المثال، يتباهى Elasticsearch بسرعات استعلام على مستوى أجزاء من الثانية، ولكن خلف الكواليس، قد يستغرق الأمر أكثر من 20 ساعة فقط لتحسين فهرسه. ما هو نظام الإنتاج الذي يمكن أن يتحمل مثل هذا الوقت الضائع؟</p>
<p>تنبع المشكلة من ثلاثة عيوب أساسية:</p>
<ul>
<li><p><strong>مجموعات البيانات القديمة:</strong> لا تزال العديد من المعايير القياسية تعتمد على مجموعات بيانات قديمة مثل SIFT (128 بُعدًا) بينما تتراوح أبعاد التضمينات الحديثة بين 768 و3,072 بُعدًا. تختلف خصائص الأداء للأنظمة التي تعمل على متجهات 128D مقابل 1024D+ اختلافًا جوهريًا - تتغير أنماط الوصول إلى الذاكرة وكفاءة الفهرس والتعقيد الحسابي بشكل كبير.</p></li>
<li><p><strong>مقاييس الغرور:</strong> تركز المقاييس المرجعية على متوسط زمن الاستجابة أو ذروة سرعة الاستجابة في الثانية، مما يخلق صورة مشوهة. فالنظام الذي يبلغ متوسط زمن انتقاله 10 مللي ثانية ولكن زمن انتقال P99 لمدة ثانيتين يخلق تجربة مستخدم سيئة. لا تخبرك ذروة الإنتاجية التي يتم قياسها على مدار 30 ثانية بأي شيء عن الأداء المستدام.</p></li>
<li><p><strong>سيناريوهات مفرطة في التبسيط:</strong> تختبر معظم المعايير سير العمل الأساسي "كتابة البيانات وإنشاء الفهرس والاستعلام"، أي اختبار مستوى "مرحبًا بالعالم". يتضمن الإنتاج الحقيقي استيعابًا مستمرًا للبيانات أثناء تقديم الاستعلامات، وتصفية البيانات الوصفية المعقدة التي تجزئ الفهارس، وعمليات القراءة/الكتابة المتزامنة التي تتنافس على الموارد.</p></li>
</ul>
<h2 id="What’s-New-in-VDBBench-10" class="common-anchor-header">ما الجديد في VDBBench 1.0؟<button data-href="#What’s-New-in-VDBBench-10" class="anchor-icon" translate="no">
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
    </button></h2><p>لا يقوم VDBBBBench بتكرار فلسفات القياس المعيارية القديمة فحسب - بل يعيد بناء المفهوم من المبادئ الأولى مع اعتقاد إرشادي واحد: المعيار لا يكون ذا قيمة إلا إذا كان يتنبأ بسلوك الإنتاج الفعلي.</p>
<p>لقد صممنا VDBBench لمحاكاة ظروف العالم الحقيقي بأمانة عبر ثلاثة أبعاد مهمة: <strong>مصداقية البيانات، وأنماط عبء العمل، ومنهجيات قياس الأداء.</strong></p>
<p>دعونا نلقي نظرة فاحصة على الميزات الجديدة التي تم جلبها إلى الطاولة.</p>
<h3 id="🚀-Redesigned-Dashboard-with-Production-Relevant-Visualizations" class="common-anchor-header"><strong>🚀 لوحة تحكم معاد تصميمها مع تصورات ذات صلة بالإنتاج</strong></h3><p>تركز معظم المعايير على مخرجات البيانات الأولية فقط، ولكن ما يهم هو كيفية تفسير المهندسين لتلك النتائج والتصرف بناءً عليها. لقد أعدنا تصميم واجهة المستخدم لإعطاء الأولوية للوضوح والتفاعلية - مما يتيح لك اكتشاف فجوات الأداء بين الأنظمة واتخاذ قرارات سريعة بشأن البنية التحتية.</p>
<p>لا تصور لوحة المعلومات الجديدة ليس فقط أرقام الأداء، ولكن العلاقات بينها: كيف تتدهور QPS في ظل مستويات انتقائية مختلفة للمرشح، وكيف يتقلب الاستدعاء أثناء استيعاب البث، وكيف تكشف توزيعات زمن الاستجابة عن خصائص استقرار النظام.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb_1_df593dea0b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>لقد أعدنا اختبار منصات قواعد البيانات المتجهة الرئيسية بما في ذلك <strong>Milvus وZilliz Cloud وElastic Cloud وQdrant Cloud وPinecone وOpenSearch</strong> بأحدث تكويناتها والإعدادات الموصى بها، مما يضمن أن جميع بيانات القياس تعكس القدرات الحالية. جميع نتائج الاختبارات متاحة على<a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch"> لوحة المتصدرين VDBBench</a>.</p>
<h3 id="🏷️-Tag-Filtering-The-Hidden-Performance-Killer" class="common-anchor-header">🏷️ تصفية العلامات: قاتل الأداء الخفي</h3><p>نادراً ما تحدث الاستعلامات في العالم الحقيقي بمعزل عن بعضها البعض. حيث تجمع التطبيقات بين تشابه المتجهات وتصفية البيانات الوصفية ("ابحث عن الأحذية التي تشبه هذه الصورة ولكن تكلفتها أقل من 100 دولار"). يخلق هذا البحث المتجه المصفى تحديات فريدة من نوعها تتجاهلها معظم المعايير القياسية تمامًا.</p>
<p>تُدخل عمليات البحث المصفاة تعقيدات في مجالين مهمين:</p>
<ul>
<li><p><strong>تعقيد الت</strong>صفية: المزيد من الحقول القياسية والشروط المنطقية المعقدة تزيد من المتطلبات الحسابية ويمكن أن تتسبب في عدم كفاية الاستدعاء وتجزئة فهرس الرسم البياني.</p></li>
<li><p><strong>انتقائية التصفية</strong>: هذا هو "قاتل الأداء الخفي" الذي تحققنا منه مرارًا وتكرارًا في الإنتاج. عندما تصبح شروط التصفية انتقائية للغاية (تصفية أكثر من 99% من البيانات)، يمكن أن تتذبذب سرعات الاستعلام بأوامر من حيث الحجم، ويمكن أن يصبح الاستدعاء غير مستقر حيث تكافح هياكل الفهرس مع مجموعات النتائج المتفرقة.</p></li>
</ul>
<p>يختبر VDBBench بشكل منهجي مستويات انتقائية مختلفة للتصفية (من 50% إلى 99.9%)، مما يوفر ملفًا شاملاً للأداء في ظل هذا النمط الإنتاجي الحرج. وغالبًا ما تكشف النتائج عن منحدرات أداء دراماتيكية لن تظهر أبدًا في المعايير التقليدية.</p>
<p><strong>مثال</strong>: في اختبارات Cohere 1M، حافظت Milvus على استدعاء عالٍ باستمرار عبر جميع مستويات انتقائية التصفية، بينما أظهر OpenSearch أداءً غير مستقر مع تذبذب الاستدعاء بشكل كبير في ظل ظروف التصفية المختلفة - حيث انخفض إلى أقل من 0.8 استدعاء في العديد من الحالات، وهو أمر غير مقبول لمعظم بيئات الإنتاج.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb_2_0ef89463e5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>الشكل: QPS والاستدعاء من Milvus وOpenSearch عبر مستويات انتقائية مختلفة للمرشح (اختبار Cohere 1M).</em></p>
<h3 id="🌊-Streaming-ReadWrite-Beyond-Static-Index-Testing" class="common-anchor-header">🌊 تدفق القراءة/الكتابة: ما وراء اختبار الفهرس الثابت</h3><p>نادرًا ما تتمتع أنظمة الإنتاج برفاهية البيانات الثابتة. تتدفق المعلومات الجديدة بشكل مستمر أثناء تنفيذ عمليات البحث - وهو سيناريو تنهار فيه العديد من قواعد البيانات المثيرة للإعجاب تحت الضغط المزدوج للحفاظ على أداء البحث أثناء التعامل مع عمليات الكتابة المستمرة.</p>
<p>تحاكي سيناريوهات التدفق في VDBBench عمليات متوازية حقيقية، مما يساعد المطورين على فهم استقرار النظام في البيئات عالية التكرار، خاصةً كيف تؤثر كتابة البيانات على أداء الاستعلام وكيف يتطور الأداء مع زيادة حجم البيانات.</p>
<p>لضمان المقارنات العادلة عبر الأنظمة المختلفة، يستخدم VDBBench نهجًا منظمًا:</p>
<ul>
<li><p>تكوين معدلات كتابة محكومة تعكس أعباء عمل الإنتاج المستهدفة (على سبيل المثال، 500 صف/ثانية موزعة على 5 عمليات متوازية)</p></li>
<li><p>قم بتشغيل عمليات البحث بعد كل 10٪ من استيعاب البيانات، بالتناوب بين الوضعين المتسلسل والمتزامن</p></li>
<li><p>تسجيل مقاييس شاملة: توزيعات الكمون (بما في ذلك P99)، والكمية الثابتة في الثانية ودقة الاستدعاء</p></li>
<li><p>تتبع تطور الأداء بمرور الوقت مع زيادة حجم البيانات وضغط النظام</p></li>
</ul>
<p>يكشف اختبار التحميل التدريجي المتحكم به هذا عن مدى حفاظ الأنظمة على الاستقرار والدقة في ظل الاستيعاب المستمر - وهو أمر نادرًا ما تلتقطه المعايير التقليدية.</p>
<p><strong>مثال على</strong> ذلك: في اختبارات البث المباشر Cohere 10M، حافظ Pinecone على معدل أعلى في الثانية واسترجاع أعلى في الثانية طوال دورة الكتابة مقارنةً ب Elasticsearch. والجدير بالملاحظة أن أداء Pinecone تحسن بشكل ملحوظ بعد اكتمال الاستيعاب، مما يدل على استقرار قوي في ظل الحمل المستمر، بينما أظهر Elasticsearch سلوكًا أكثر انتظامًا أثناء مراحل الاستيعاب النشط.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb3_9d2a5298b0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>الشكل: QPS والاسترجاع لـ Pinecone مقابل Elasticsearch في اختبار تدفق Cohere 10M (معدل استيعاب 500 صف/ثانية).</p>
<p>يذهب VDBBench إلى أبعد من ذلك من خلال دعم خطوة تحسين اختيارية، مما يسمح للمستخدمين بمقارنة أداء البحث المتدفق قبل تحسين الفهرس وبعده. كما أنه يتتبع ويبلغ عن الوقت الفعلي المستغرق في كل مرحلة، مما يوفر رؤى أعمق حول كفاءة النظام وسلوكه في ظل ظروف شبيهة بالإنتاج.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb4_0caee3b201.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>الشكل: QPS واستدعاء Pinecone مقابل Elasticsearch في اختبار تدفق Cohere 10M بعد التحسين (معدل استيعاب 500 صف/ثانية)</em></p>
<p>كما هو موضح في اختباراتنا، تفوق Elasticsearch على Pinecone في QPS بعد تحسين الفهرس. ولكن عندما يعكس المحور س الوقت المنقضي الفعلي، يتضح أن Elasticsearch استغرق وقتًا أطول بكثير للوصول إلى هذا الأداء. في الإنتاج، هذا التأخير مهم. تكشف هذه المقارنة عن مفاضلة رئيسية: ذروة الإنتاجية مقابل وقت الخدمة.</p>
<h3 id="🔬-Modern-Datasets-That-Reflect-Current-AI-Workloads" class="common-anchor-header">🔬 مجموعات بيانات حديثة تعكس أعباء عمل الذكاء الاصطناعي الحالية</h3><p>لقد قمنا بإصلاح شامل لمجموعات البيانات المستخدمة لقياس قاعدة بيانات المتجهات. فبدلاً من مجموعات الاختبار القديمة مثل SIFT و GloVe، يستخدم VDBBench متجهات تم إنشاؤها من أحدث نماذج التضمين مثل OpenAI و Cohere التي تشغل تطبيقات الذكاء الاصطناعي الحالية.</p>
<p>ولضمان الملاءمة، خاصةً بالنسبة لحالات الاستخدام مثل التوليد المعزز للاسترجاع (RAG)، اخترنا مجموعات تعكس سيناريوهات المؤسسات في العالم الحقيقي والسيناريوهات الخاصة بالمجال:</p>
<table>
<thead>
<tr><th></th><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>المجموعة</strong></td><td><strong>نموذج التضمين</strong></td><td><strong>الأبعاد</strong></td><td><strong>الحجم</strong></td><td><strong>حالة الاستخدام</strong></td></tr>
<tr><td>ويكيبيديا</td><td>كوهير V2</td><td>768</td><td>1M / 10M</td><td>قاعدة المعرفة العامة</td></tr>
<tr><td>بيواسكو</td><td>كوهير V3</td><td>1024</td><td>1M / 10M</td><td>خاص بالمجال (الطب الحيوي)</td></tr>
<tr><td>C4</td><td>OpenAI</td><td>1536</td><td>500 ألف / 5 مليون</td><td>معالجة النصوص على نطاق الويب</td></tr>
<tr><td>MSMarco V2</td><td>udever-bloom-1b1</td><td>1536</td><td>1 م / 10 م / 138 م</td><td>بحث واسع النطاق</td></tr>
</tbody>
</table>
<p>تحاكي مجموعات البيانات هذه البيانات بشكل أفضل البيانات المتجهة كبيرة الحجم وعالية الأبعاد في الوقت الحالي، مما يتيح اختبارًا واقعيًا لكفاءة التخزين وأداء الاستعلام ودقة الاسترجاع في ظل ظروف تتوافق مع أعباء عمل الذكاء الاصطناعي الحديثة.</p>
<h3 id="⚙️-Custom-Dataset-Support-for-Industry-Specific-Testing" class="common-anchor-header">⚙️ دعم مجموعة بيانات مخصصة للاختبارات الخاصة بالصناعة</h3><p>كل عمل فريد من نوعه. قد تحتاج الصناعة المالية إلى اختبار يركز على تضمين المعاملات، بينما تهتم المنصات الاجتماعية أكثر بمتجهات سلوك المستخدم. يتيح لك VDBBench قياس الأداء ببياناتك الخاصة التي تم إنشاؤها من نماذج التضمين الخاصة بك لأعباء العمل الخاصة بك.</p>
<p>يمكنك تخصيص:</p>
<ul>
<li><p>أبعاد المتجهات وأنواع البيانات</p></li>
<li><p>مخطط البيانات الوصفية وأنماط التصفية</p></li>
<li><p>حجم البيانات وأنماط الاستيعاب</p></li>
<li><p>توزيعات الاستعلام التي تتطابق مع حركة الإنتاج لديك</p></li>
</ul>
<p>في النهاية، لا توجد مجموعة بيانات تروي قصة أفضل من بيانات الإنتاج الخاصة بك.</p>
<h2 id="How-VDBBench-Measures-What-Actually-Matters-in-Production" class="common-anchor-header">كيف يقيس VDBBench ما يهم بالفعل في الإنتاج<button data-href="#How-VDBBench-Measures-What-Actually-Matters-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Production-Focused-Metric-Design" class="common-anchor-header">تصميم المقاييس التي تركز على الإنتاج</h3><p>يعطي VDBBench الأولوية للمقاييس التي تعكس الأداء في العالم الحقيقي، وليس فقط النتائج المعملية. لقد أعدنا تصميم القياس حول ما يهم بالفعل في بيئات الإنتاج: <strong>الموثوقية تحت الحمل، وخصائص زمن الوصول، والإنتاجية المستدامة، والحفاظ على الدقة</strong>.</p>
<ul>
<li><p><strong>الكمون P95/P99 الكمون لتجربة المستخدم الحقيقية</strong>: يخفي متوسط/متوسط زمن الكمون القيم المتطرفة التي تحبط المستخدمين الحقيقيين ويمكن أن تشير إلى عدم استقرار النظام الأساسي. يركّز VDBBench على زمن انتقال الذيل مثل P95/P99، كاشفًا عن الأداء الذي سيحققه 95% أو 99% من استفساراتك بالفعل. هذا أمر بالغ الأهمية لتخطيط اتفاقية مستوى الخدمة وفهم تجربة المستخدم في أسوأ الحالات.</p></li>
<li><p><strong>الإنتاجية المستدامة تحت الحمل</strong>: النظام الذي يؤدي أداءً جيدًا لمدة 5 ثوانٍ لا يفي بالغرض في الإنتاج. يعمل VDBBench على زيادة التزامن تدريجيًا للعثور على الحد الأقصى المستدام لقاعدة البيانات الخاصة بك من الاستعلامات في الثانية (<code translate="no">max_qps</code>) - وليس رقم الذروة في ظل ظروف قصيرة ومثالية. تكشف هذه المنهجية مدى قدرة نظامك على الصمود مع مرور الوقت وتساعد في التخطيط الواقعي للسعة.</p></li>
<li><p><strong>التذكر المتوازن مع الأداء</strong>: السرعة بدون دقة لا معنى لها. يتم إقران كل رقم أداء في VDBBench بقياسات الاستدعاء، بحيث تعرف بالضبط مدى الملاءمة التي تستبدلها بالإنتاجية. يتيح ذلك إمكانية إجراء مقارنات عادلة ومتكافئة بين الأنظمة ذات المفاضلات الداخلية المختلفة إلى حد كبير.</p></li>
</ul>
<h3 id="Test-Methodology-That-Reflects-Reality" class="common-anchor-header">منهجية اختبار تعكس الواقع</h3><p>يتمثل أحد الابتكارات الرئيسية في تصميم VDBBench في الفصل بين الاختبار التسلسلي والمتزامن، مما يساعد على التقاط كيفية تصرف الأنظمة في ظل أنواع مختلفة من الأحمال ويكشف عن خصائص الأداء المهمة لحالات الاستخدام المختلفة.</p>
<p><strong>فصل قياس الكمون:</strong></p>
<ul>
<li><p><code translate="no">serial_latency_p99</code> يقيس أداء النظام في ظل الحد الأدنى من التحميل، حيث تتم معالجة طلب واحد فقط في كل مرة. يمثل هذا أفضل سيناريو لوقت الاستجابة ويساعد في تحديد قدرات النظام الأساسية.</p></li>
<li><p><code translate="no">conc_latency_p99</code> يلتقط سلوك النظام في ظل ظروف واقعية عالية التواتر، حيث تصل طلبات متعددة في وقت واحد وتتنافس على موارد النظام.</p></li>
</ul>
<p><strong>هيكل معياري من مرحلتين</strong>:</p>
<ol>
<li><p><strong>اختبار تسلسلي</strong>: تشغيل عملية واحدة من 1,000 استفسار يحدد الأداء والدقة الأساسيين، مع الإبلاغ عن كل من <code translate="no">serial_latency_p99</code> والاستدعاء. تساعد هذه المرحلة في تحديد سقف الأداء النظري.</p></li>
<li><p><strong>اختبار التزامن</strong>: يحاكي بيئة الإنتاج في ظل الحمل المستمر مع العديد من الابتكارات الرئيسية:</p>
<ul>
<li><p><strong>محاكاة واقعية للعميل</strong>: تعمل كل عملية اختبار بشكل مستقل مع اتصالها الخاص ومجموعة الاستعلامات الخاصة بها، مع تجنب تداخل الحالة المشتركة التي يمكن أن تشوه النتائج</p></li>
<li><p><strong>بدء متزامن</strong>: تبدأ جميع العمليات في وقت واحد، مما يضمن أن تعكس QPS المقاسة بدقة مستويات التزامن المزعومة</p></li>
<li><p><strong>مجموعات استعلام مستقلة</strong>: يمنع معدلات الوصول إلى ذاكرة التخزين المؤقت غير الواقعية التي لا تعكس تنوع استعلامات الإنتاج</p></li>
</ul></li>
</ol>
<p>تضمن هذه الأساليب المنظمة بعناية أن تكون قيم <code translate="no">max_qps</code> و <code translate="no">conc_latency_p99</code> التي أبلغ عنها VDBBench دقيقة وذات صلة بالإنتاج، مما يوفر رؤى مفيدة لتخطيط سعة الإنتاج وتصميم النظام.</p>
<h2 id="Getting-Started-with-VDBBench-10" class="common-anchor-header">الشروع في استخدام VDBBench 1.0<button data-href="#Getting-Started-with-VDBBench-10" class="anchor-icon" translate="no">
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
    </button></h2><p>يمثل<strong>VDBBench 1.0</strong> تحولًا جوهريًا نحو قياس الأداء المرتبط بالإنتاج. من خلال تغطية الكتابة المستمرة للبيانات، وتصفية البيانات الوصفية مع انتقائية متفاوتة، وأحمال التدفق في ظل أنماط الوصول المتزامن، فإنه يوفر أقرب تقريب لبيئات الإنتاج الفعلية المتاحة اليوم.</p>
<p>لا ينبغي أن تكون الفجوة بين النتائج المعيارية والأداء الواقعي لعبة تخمين. إذا كنت تخطط لنشر قاعدة بيانات متجهية في الإنتاج، فإن الأمر يستحق فهم كيفية أدائها بما يتجاوز الاختبارات المعملية المثالية. إن VDBBench مفتوح المصدر وشفاف ومصمم لدعم المقارنات المفيدة والمقارنة بين أداء قاعدة البيانات المتجهة.</p>
<p>لا تتأثر بالأرقام المبهرة التي لا تترجم إلى قيمة إنتاجية. <strong>استخدم VDBBench 1.0 لاختبار السيناريوهات التي تهم عملك، باستخدام بياناتك، في ظل ظروف تعكس عبء العمل الفعلي.</strong> لقد انتهى عصر المعايير المضللة في تقييم قاعدة البيانات المتجهة - لقد حان الوقت لاتخاذ قرارات تستند إلى بيانات ذات صلة بالإنتاج.</p>
<p><strong>جرب VDBBench مع أعباء العمل الخاصة بك:</strong><a href="https://github.com/zilliztech/VectorDBBench"> https://github.com/zilliztech/VectorDBBench</a></p>
<p><strong>عرض نتائج اختبار قواعد البيانات المتجهة الرئيسية:</strong><a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch"> لوحة المتصدرين VDBBench</a></p>
<p>هل لديك أسئلة أو تريد مشاركة نتائجك؟ انضم إلى المحادثة على<a href="https://github.com/zilliztech/VectorDBBench"> GitHub</a> أو تواصل مع مجتمعنا على<a href="https://discord.com/invite/FG6hMJStWu"> Discord</a>.</p>
