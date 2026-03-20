---
id: >-
  how-to-cut-vector-database-costs-by-up-to-80-a-practical-milvus-optimization-guide.md
title: >-
  كيفية خفض تكاليف قاعدة بيانات المتجهات بنسبة تصل إلى 80%: دليل التحسين العملي
  لميلفوس الأمثل
author: Jack Li
date: 2026-3-20
cover: assets.zilliz.com/cover_reduce_vdb_cost_by_80_56ed2fe3ae.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus cost optimization, vector database cost reduction, RAG cost
  optimization, HNSW vs IVF_SQ8, vector search cost
meta_title: |
  Milvus Cost Optimization Guide: Cut Vector Database Costs by Up to 80%
desc: >-
  ميلفوس مجاني، ولكن البنية التحتية ليست كذلك. تعرّف على كيفية تقليل تكاليف
  ذاكرة قاعدة البيانات المتجهة بنسبة 60-80% باستخدام فهارس أفضل، وخريطة MMap،
  والتخزين المتدرج.
origin: >-
  https://milvus.io/blog/how-to-cut-vector-database-costs-by-up-to-80-a-practical-milvus-optimization-guide.md
---
<p>عمل نموذج RAG الخاص بك بشكل رائع. ثم انتقل إلى الإنتاج، وازدادت حركة المرور، والآن ارتفعت فاتورة قاعدة بياناتك المتجهة من 500 دولار إلى 5000 دولار شهريًا. يبدو مألوفاً؟</p>
<p>هذه واحدة من أكثر مشاكل التوسع شيوعًا في تطبيقات الذكاء الاصطناعي في الوقت الحالي. لقد قمت ببناء شيء يخلق قيمة حقيقية، ولكن تكاليف البنية التحتية تنمو بشكل أسرع من نمو قاعدة المستخدمين لديك. وعندما تنظر إلى الفاتورة، غالبًا ما تكون قاعدة البيانات المتجهة هي المفاجأة الأكبر - في عمليات النشر التي رأيناها، يمكن أن تمثل ما يقرب من 40-50% من إجمالي تكلفة التطبيق، وتأتي في المرتبة الثانية بعد مكالمات واجهة برمجة التطبيقات LLM.</p>
<p>في هذا الدليل، سأتناول في هذا الدليل أين تذهب الأموال فعلياً والأشياء المحددة التي يمكنك القيام بها لتخفيضها - في كثير من الحالات بنسبة 60-80%. سأستخدم <a href="https://milvus.io/">Milvus،</a> قاعدة بيانات المتجهات الأكثر شيوعًا مفتوحة المصدر، كمثالٍ أساسي لأن هذا هو أفضل ما أعرفه، لكن المبادئ تنطبق على معظم قواعد بيانات المتجهات.</p>
<p><em>لنكون واضحين:</em> <em><a href="https://milvus.io/">ميلفوس</a></em> <em>نفسه مجاني ومفتوح المصدر - أنت لا تدفع أبداً مقابل البرنامج. تأتي التكلفة بالكامل من البنية التحتية التي تقوم بتشغيله عليها: مثيلات السحابة والذاكرة والتخزين والشبكة. والخبر السار هو أن معظم تكلفة البنية التحتية يمكن تخفيضها.</em></p>
<h2 id="Where-Does-the-Money-Actually-Go-When-Using-a-VectorDB" class="common-anchor-header">أين تذهب الأموال بالفعل عند استخدام VectorDB؟<button data-href="#Where-Does-the-Money-Actually-Go-When-Using-a-VectorDB" class="anchor-icon" translate="no">
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
    </button></h2><p>لنبدأ بمثال ملموس. لنفترض أن لديك 100 مليون متجه، 768 بُعدًا، مخزنة على هيئة float32 - إعداد RAG نموذجي جدًا. إليك تقريبًا تكلفة ذلك على AWS شهريًا:</p>
<table>
<thead>
<tr><th><strong>مكون التكلفة</strong></th><th><strong>الحصة</strong></th><th><strong>~التكلفة الشهرية</strong></th><th><strong>ملاحظات</strong></th></tr>
</thead>
<tbody>
<tr><td>الحوسبة (وحدة المعالجة المركزية + الذاكرة)</td><td>85-90%</td><td>$2,800</td><td>الكبيرة - تعتمد في الغالب على الذاكرة</td></tr>
<tr><td>الشبكة</td><td>5-10%</td><td>$250</td><td>حركة المرور عبر المنطقة العربية، حمولات النتائج الكبيرة</td></tr>
<tr><td>التخزين</td><td>2-5%</td><td>$100</td><td>رخيصة - تخزين الكائنات (S3/MinIO) حوالي 0.03 دولار/جيجابايت</td></tr>
</tbody>
</table>
<p>الخلاصة بسيطة: الذاكرة هي المكان الذي تذهب فيه 85-90% من أموالك. الشبكة والتخزين مهمان على الهامش، ولكن إذا كنت ترغب في خفض التكاليف بشكل هادف، فإن الذاكرة هي الرافعة. كل شيء في هذا الدليل يركز على ذلك.</p>
<p><strong>ملاحظة سريعة على الشبكة والتخزين:</strong> يمكنك تقليل تكاليف الشبكة عن طريق إرجاع الحقول التي تحتاجها فقط (المعرف، والنتيجة، والبيانات الوصفية الرئيسية) وتجنب الاستعلامات عبر المناطق. بالنسبة للتخزين، يفصل Milvus بالفعل التخزين عن الحوسبة - حيث توضع ناقلاتك في تخزين كائنات رخيصة مثل S3، لذلك حتى عند 100 مليون ناقلة، عادةً ما يكون التخزين أقل من 50 دولارًا في الشهر. لن يحرك أي منهما الإبرة مثل تحسين الذاكرة.</p>
<h2 id="Why-Memory-Is-So-Expensive-for-Vector-Search" class="common-anchor-header">لماذا تعتبر الذاكرة مكلفة للغاية بالنسبة للبحث عن المتجهات<button data-href="#Why-Memory-Is-So-Expensive-for-Vector-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>إذا كنت قادمًا من قواعد البيانات التقليدية، فإن متطلبات الذاكرة للبحث المتجه قد تكون مفاجئة. يمكن لقاعدة البيانات العلائقية أن تستفيد من فهارس الشجرة ب المستندة إلى القرص وذاكرة التخزين المؤقت لصفحات نظام التشغيل. البحث المتجه مختلف - فهو ينطوي على عمليات حسابية ضخمة ذات فاصلة عائمة وفهارس مثل HNSW أو IVF تحتاج إلى البقاء محملة في الذاكرة لتوفير زمن انتقال بمستوى جزء من الثانية.</p>
<p>إليك معادلة سريعة لتقدير احتياجاتك من الذاكرة:</p>
<p><strong>الذاكرة المطلوبة = (المتجهات × الأبعاد × 4 بايت) × مضاعف الفهرس</strong></p>
<p>بالنسبة لمثالنا 100M × 768 × 768 × تعويم 32 مع HNSW (المضاعف ~ 1.8x):</p>
<ul>
<li>البيانات الأولية 100 م × 768 × 768 × 4 بايت ≈ 307 جيجابايت</li>
<li>مع مؤشر HNSW 307 جيجابايت × 1.8 ≈ 553 جيجابايت</li>
<li>مع نفقات نظام التشغيل، وذاكرة التخزين المؤقت، ومساحة الرأس: ~إجمالي 768 جيجابايت تقريبًا</li>
<li>على AWS 3 × r6i.8xlarge (256 جيجابايت لكل منهما) ≈ 2,800 دولار شهريًا</li>
</ul>
<p><strong>هذا هو خط الأساس. الآن دعونا ننظر في كيفية خفضه.</strong></p>
<h2 id="1-Pick-the-Right-Index-to-Get-4x-Less-Memory-Usage" class="common-anchor-header">1. اختر الفهرس الصحيح للحصول على استخدام أقل للذاكرة بمقدار 4 أضعاف<button data-href="#1-Pick-the-Right-Index-to-Get-4x-Less-Memory-Usage" class="anchor-icon" translate="no">
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
    </button></h2><p>هذا هو التغيير الوحيد الأكثر تأثيراً الذي يمكنك إجراؤه. بالنسبة لنفس مجموعة البيانات ذات الـ 100 مليون متجه، يمكن أن يختلف استخدام الذاكرة بمقدار 4-6 أضعاف اعتمادًا على اختيارك للفهرس.</p>
<ul>
<li><strong>FLAT / IVF_FLAT</strong>: لا يوجد ضغط تقريبًا، لذا يظل استخدام الذاكرة قريبًا من حجم البيانات الخام، حوالي <strong>300 جيجابايت</strong></li>
<li><strong>HNSW</strong>: يخزن هيكل رسم بياني إضافي، لذا فإن استخدام الذاكرة عادةً ما يكون <strong>1.5 ضعف إلى 2.5 ضعف</strong> حجم البيانات الخام، أو حوالي <strong>450 إلى 600 جيجابايت</strong></li>
<li><strong>IVF_SQ8</strong>: يضغط قيم float32 إلى uint8، مما يعطي <strong>ضغطًا بمعدل 4 أضعاف،</strong> لذا يمكن أن ينخفض استخدام الذاكرة إلى حوالي <strong>75 إلى 100 جيجابايت</strong></li>
<li><strong>IVF_PQ_PQ / DiskANN</strong>: استخدام ضغط أقوى أو فهرس قائم على القرص، لذلك يمكن أن تنخفض الذاكرة أكثر إلى حوالي <strong>30 إلى 60 جيجابايت</strong></li>
</ul>
<p>تبدأ العديد من الفرق باستخدام HNSW لأنه يتمتع بأفضل سرعة استعلام، ولكن ينتهي بهم الأمر بدفع 3-5 أضعاف أكثر مما يحتاجون إليه.</p>
<p>إليك كيفية المقارنة بين أنواع الفهارس الرئيسية:</p>
<table>
<thead>
<tr><th><strong>الفهرس</strong></th><th><strong>مضاعف الذاكرة</strong></th><th><strong>سرعة الاستعلام</strong></th><th><strong>الاسترجاع</strong></th><th><strong>الأفضل ل</strong></th></tr>
</thead>
<tbody>
<tr><td>مسطح</td><td>~1.0x</td><td>بطيء</td><td>100%</td><td>مجموعات البيانات الصغيرة (&lt;1 مليون)، الاختبار</td></tr>
<tr><td>IVF_FLAT</td><td>~1.05x</td><td>متوسط</td><td>95-99%</td><td>الاستخدام العام</td></tr>
<tr><td>IVF_SQ8</td><td>~0.30x</td><td>متوسط</td><td>93-97%</td><td>إنتاج حساس للتكلفة (موصى به)</td></tr>
<tr><td>IVF_PQ</td><td>~0.12x</td><td>سريع</td><td>70-80%</td><td>مجموعات بيانات كبيرة جدًا، استرجاع خشن</td></tr>
<tr><td>HNSW</td><td>~1.8x</td><td>سريع جداً</td><td>98-99%</td><td>فقط عندما يكون وقت الاستجابة أكثر أهمية من التكلفة</td></tr>
<tr><td>DiskANN</td><td>~0.08x</td><td>متوسط</td><td>95-98%</td><td>نطاق كبير جدًا مع محركات أقراص NVMe SSD</td></tr>
</tbody>
</table>
<p><strong>الخلاصة</strong> عادةً ما يؤدي التحويل من HNSW أو IVF_FLAT إلى IVF_SQ8 إلى IVF_SQ8 إلى انخفاض الاستدعاء بنسبة 2-3% فقط (على سبيل المثال، من 97% إلى 94-95%) مع خفض تكلفة الذاكرة بحوالي 70%. بالنسبة لمعظم أعباء عمل RAG، فإن هذه المقايضة تستحق العناء تمامًا. إذا كنت تقوم باسترجاع خشن أو إذا كان شريط الدقة لديك أقل، يمكن لـ IVF_PQ أو IVF_RABITQ زيادة التوفير.</p>
<p><strong>توصيتي:</strong> إذا كنت تقوم بتشغيل HNSW في الإنتاج وكانت التكلفة مصدر قلق، جرّب IVF_SQ_SQ8 على مجموعة اختبارية أولاً. قم بقياس الاستدعاء على استفساراتك الفعلية. تفاجأ معظم الفرق بمدى ضآلة انخفاض الدقة.</p>
<h2 id="2-Stop-Loading-Everything-into-Memory-for-60-80-Cost-Reduction" class="common-anchor-header">2. توقف عن تحميل كل شيء في الذاكرة لتخفيض التكلفة بنسبة 60%-80%<button data-href="#2-Stop-Loading-Everything-into-Memory-for-60-80-Cost-Reduction" class="anchor-icon" translate="no">
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
    </button></h2><p>حتى بعد اختيار فهرس أكثر كفاءة، قد لا يزال لديك بيانات في الذاكرة أكثر من اللازم. يقدم ميلفوس طريقتين لإصلاح ذلك: <strong>MMap (متوفر منذ 2.3) والتخزين المتدرج (متوفر منذ 2.6). يمكن لكليهما تقليل استخدام الذاكرة بنسبة 60-80%.</strong></p>
<p>الفكرة الأساسية وراء كلاهما هي نفسها: لا تحتاج جميع بياناتك إلى العيش في الذاكرة في جميع الأوقات. الفرق هو كيفية التعامل مع البيانات غير الموجودة في الذاكرة.</p>
<h3 id="MMap-Memory-Mapped-Files" class="common-anchor-header">MMap (الملفات المعينة في الذاكرة)</h3><p>تقوم MMap بتعيين ملفات البيانات الخاصة بك من القرص المحلي إلى مساحة عنوان العملية. تبقى مجموعة البيانات الكاملة على القرص المحلي للعقدة، ويقوم نظام التشغيل بتحميل الصفحات في الذاكرة عند الطلب فقط عند الوصول إليها. قبل استخدام MMap، يتم تنزيل جميع البيانات من تخزين الكائنات (S3/MinIO) إلى القرص المحلي للعقدة المحلية.</p>
<ul>
<li>ينخفض استخدام الذاكرة إلى حوالي 10-30% من وضع التحميل الكامل</li>
<li>يبقى الكمون مستقرًا ويمكن التنبؤ به (البيانات على القرص المحلي، لا يوجد جلب من الشبكة)</li>
<li>المفاضلة: يجب أن يكون القرص المحلي كبيرًا بما يكفي لاستيعاب مجموعة البيانات الكاملة</li>
</ul>
<h3 id="Tiered-Storage" class="common-anchor-header">التخزين المتدرج</h3><p>يأخذ التخزين المتدرج خطوة إلى الأمام. فبدلاً من تنزيل كل شيء على القرص المحلي، فإنه يستخدم القرص المحلي كذاكرة تخزين مؤقت للبيانات الساخنة ويحتفظ بتخزين الكائنات كطبقة أساسية. يتم جلب البيانات من تخزين الكائنات فقط عند الحاجة إليها.</p>
<ul>
<li>ينخفض استخدام الذاكرة إلى &lt;10% من وضع التحميل الكامل</li>
<li>ينخفض استخدام القرص المحلي أيضًا - يتم تخزين البيانات الساخنة فقط مؤقتًا (عادةً 10-30% من الإجمالي)</li>
<li>المقايضة: تضيف فوات ذاكرة التخزين المؤقت 50-200 مللي ثانية زمن انتقال (جلب البيانات من تخزين الكائنات)</li>
</ul>
<h3 id="Data-flow-and-resource-usage" class="common-anchor-header">تدفق البيانات واستخدام الموارد</h3><table>
<thead>
<tr><th><strong>الوضع</strong></th><th><strong>تدفق البيانات</strong></th><th><strong>استخدام الذاكرة</strong></th><th><strong>استخدام القرص المحلي</strong></th><th><strong>الكمون</strong></th></tr>
</thead>
<tbody>
<tr><td>التحميل الكامل التقليدي</td><td>تخزين الكائنات → الذاكرة (100%)</td><td>مرتفع جدًا (100%)</td><td>منخفض (مؤقت فقط)</td><td>منخفضة جدًا ومستقرة</td></tr>
<tr><td>خريطة مم</td><td>تخزين الكائنات → القرص المحلي (100٪) → الذاكرة (عند الطلب)</td><td>منخفضة (10-30%)</td><td>عالية (100%)</td><td>منخفضة ومستقرة</td></tr>
<tr><td>تخزين متدرج</td><td>تخزين الكائنات ↔ ذاكرة تخزين مؤقت محلية (بيانات ساخنة) → ذاكرة (حسب الطلب)</td><td>منخفضة جدًا (&lt;10%)</td><td>منخفض (بيانات ساخنة فقط)</td><td>منخفضة عند الوصول إلى ذاكرة التخزين المؤقت، وأعلى عند فقدان ذاكرة التخزين المؤقت</td></tr>
</tbody>
</table>
<p><strong>التوصية بالأجهزة:</strong> تعتمد كلتا الطريقتين بشكل كبير على الإدخال/الإخراج على القرص المحلي، لذا يوصى بشدة باستخدام <strong>أقراص NVMe SSD،</strong> مع <strong>معدل IOPS أعلى من 10000</strong>.</p>
<h3 id="MMap-vs-Tiered-Storage-Which-One-Should-You-Use" class="common-anchor-header">خرائط MMap مقابل التخزين المتدرج: أيهما يجب أن تستخدم؟</h3><table>
<thead>
<tr><th><strong>وضعك</strong></th><th><strong>استخدم هذا</strong></th><th><strong>لماذا</strong></th></tr>
</thead>
<tbody>
<tr><td>حساس للكمون (P99 &lt; 20 مللي ثانية)</td><td>MMAP</td><td>البيانات موجودة بالفعل على القرص المحلي - لا يوجد جلب من الشبكة، زمن انتقال ثابت</td></tr>
<tr><td>وصول موحد (لا يوجد انقسام واضح بين ساخن/بارد)</td><td>خريطة MMap</td><td>يحتاج التخزين المتدرج إلى انقسام ساخن/بارد ليكون فعالاً؛ وبدون ذلك، يكون معدل الوصول إلى ذاكرة التخزين المؤقت منخفضاً</td></tr>
<tr><td>التكلفة هي الأولوية (لا بأس بارتفاع زمن الاستجابة العرضي)</td><td>التخزين المتدرج</td><td>يحفظ على كل من الذاكرة والقرص المحلي (70-90% أقل من القرص)</td></tr>
<tr><td>مسح النمط الساخن/البارد (قاعدة 80/20)</td><td>تخزين متدرج</td><td>تظل البيانات الساخنة مخزنة مؤقتًا، وتظل البيانات الباردة رخيصة في تخزين الكائنات</td></tr>
<tr><td>نطاق كبير جدًا (&gt; 500 مليون ناقل)</td><td>تخزين متدرج</td><td>غالباً لا يمكن للقرص المحلي للعقدة الواحدة استيعاب مجموعة البيانات الكاملة على هذا النطاق</td></tr>
</tbody>
</table>
<p><strong>ملاحظة:</strong> تتطلب خريطة MMap Milvus 2.3+. يتطلب التخزين المتدرج Milvus 2.6+. يعمل كلاهما بشكل أفضل مع محركات أقراص NVMe SSD (يوصى باستخدام أكثر من 10000 IOPS).</p>
<h3 id="How-to-Configure-MMap" class="common-anchor-header">كيفية تكوين MMap</h3><p><strong>الخيار 1: تكوين YAML (موصى به لعمليات النشر الجديدة)</strong></p>
<p>قم بتحرير ملف تهيئة Milvus milvus.yaml وأضف الإعدادات التالية ضمن قسم queryNode:</p>
<pre><code translate="no">queryNode:
  mmap:
    vectorField: <span class="hljs-literal">true</span>      <span class="hljs-comment"># vector data</span>
    vectorIndex: <span class="hljs-literal">true</span>      <span class="hljs-comment"># vector index (largest source of savings!)</span>
    scalarField: <span class="hljs-literal">true</span>      <span class="hljs-comment"># scalar data (recommended for RAG workloads)</span>
    scalarIndex: <span class="hljs-literal">true</span>      <span class="hljs-comment"># scalar index</span>
    growingMmapEnabled: <span class="hljs-literal">false</span>  <span class="hljs-comment"># incremental data stays in memory</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>الخيار 2: تكوين Python SDK (للمجموعات الحالية)</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

<span class="hljs-comment"># You must release the collection before changing the mmap setting</span>
client.release_collection(<span class="hljs-string">&quot;my_collection&quot;</span>)

<span class="hljs-comment"># Enable MMap</span>
client.alter_collection_properties(
    collection_name=<span class="hljs-string">&quot;my_collection&quot;</span>,
    properties={<span class="hljs-string">&quot;mmap.enabled&quot;</span>: <span class="hljs-literal">True</span>}
)

<span class="hljs-comment"># Load the collection again to apply the MMap setting</span>
client.load_collection(<span class="hljs-string">&quot;my_collection&quot;</span>)

<span class="hljs-comment"># Verify that the setting has taken effect</span>
<span class="hljs-built_in">print</span>(client.describe_collection(<span class="hljs-string">&quot;my_collection&quot;</span>)[<span class="hljs-string">&quot;properties&quot;</span>])
<span class="hljs-comment"># Output: {&#x27;mmap.enabled&#x27;: &#x27;True&#x27;}</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-to-Configure-Tiered-Storage-Milvus-26+" class="common-anchor-header">كيفية تكوين التخزين المتدرج (Milvus 2.6+)</h3><p>قم بتحرير ملف تهيئة Milvus milvus.yaml وأضف الإعدادات التالية ضمن قسم queryNode:</p>
<pre><code translate="no">queryNode:
  segcore:
    tieredStorage:
      warmup:                                                                                                                                                      
          <span class="hljs-comment"># Options: sync, async, disable                      </span>
          <span class="hljs-comment"># Specifies when tiered storage cache warm-up happens.                                                                                                                             </span>
          <span class="hljs-comment"># - &quot;sync&quot;: data is loaded into the cache before the segment is considered fully loaded.                                                                                    </span>
          <span class="hljs-comment"># - &quot;disable&quot;: data is not proactively loaded into the cache, and is loaded only when needed by Search/Query tasks.                                                                            </span>
          <span class="hljs-comment"># The default is &quot;sync&quot;, but vector fields default to &quot;disable&quot;.                                                                                                            </span>
          scalarField: sync                                                                                                                                          
          scalarIndex: sync                                                                                                                                          
          vectorField: disable <span class="hljs-comment"># Cache warm-up for raw vector field data is disabled by default.</span>
          vectorIndex: sync
      memoryHighWatermarkRatio: <span class="hljs-number">0.85</span>   <span class="hljs-comment"># Start eviction when memory usage exceeds 85%</span>
      memoryLowWatermarkRatio: <span class="hljs-number">0.70</span>    <span class="hljs-comment"># Stop eviction when memory usage drops to 70%</span>
      diskHighWatermarkRatio: <span class="hljs-number">0.80</span>     <span class="hljs-comment"># High watermark for disk eviction</span>
      diskLowWatermarkRatio: <span class="hljs-number">0.75</span>      <span class="hljs-comment"># Low watermark for disk eviction</span>
      evictionEnabled: true            <span class="hljs-comment"># Must be enabled!</span>
      backgroundEvictionEnabled: true  <span class="hljs-comment"># Background eviction thread</span>
      cacheTtl: <span class="hljs-number">3600</span>                   <span class="hljs-comment"># Automatically evict if not accessed for 1 hour</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Use-Lower-Dimensional-Embeddings" class="common-anchor-header">استخدام تضمينات منخفضة الأبعاد<button data-href="#Use-Lower-Dimensional-Embeddings" class="anchor-icon" translate="no">
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
    </button></h2><p>من السهل التغاضي عن هذا الإعداد، لكن البُعد يغيّر التكلفة مباشرةً. الذاكرة والتخزين والحساب كلها تنمو خطيًا مع عدد الأبعاد. يكلف النموذج ذو الـ 1536 بُعْدًا حوالي 4 أضعاف تكلفة البنية التحتية لنموذج 384 بُعْدًا لنفس البيانات.</p>
<p>تتدرج تكلفة الاستعلام بالطريقة نفسها - تشابه جيب التمام هو O(D)، لذا فإن المتجهات ذات الـ 768 بُعْدًا تستغرق حوالي ضعف حساب المتجهات ذات الـ 384 بُعْدًا لكل استعلام. في أحمال العمل عالية الجودة في الثانية، يُترجم هذا الفرق مباشرةً إلى عدد أقل من العقد المطلوبة.</p>
<p>فيما يلي كيفية المقارنة بين نماذج التضمين الشائعة (باستخدام 384-مليم كخط أساس 1.0x):</p>
<table>
<thead>
<tr><th><strong>النموذج</strong></th><th><strong>الأبعاد</strong></th><th><strong>التكلفة النسبية</strong></th><th><strong>الاسترجاع</strong></th><th><strong>الأفضل ل</strong></th></tr>
</thead>
<tbody>
<tr><td>نص-تضمين النص-3-كبير</td><td>3072</td><td>8.0x</td><td>98%+</td><td>عندما تكون الدقة غير قابلة للتفاوض (الأبحاث، الرعاية الصحية)</td></tr>
<tr><td>تضمين النص-تضمين النص-3-صغير</td><td>1536</td><td>4.0x</td><td>95-97%</td><td>أعباء عمل RAG العامة</td></tr>
<tr><td>ديستيلبرت</td><td>768</td><td>2.0x</td><td>92-95%</td><td>توازن جيد بين التكلفة والأداء</td></tr>
<tr><td>الكل-MiniLM-L6-v2</td><td>384</td><td>1.0x</td><td>88-92%</td><td>أعباء العمل الحساسة من حيث التكلفة</td></tr>
</tbody>
</table>
<p><strong>نصيحة عملية:</strong> لا تفترض أنك بحاجة إلى أكبر نموذج. اختبر على عينة تمثيلية من استفساراتك الفعلية (عادةً ما يكون 1 مليون متجه كافٍ) وابحث عن النموذج الأقل بُعدًا الذي يلبي معيار الدقة لديك. تكتشف العديد من الفرق أن 768 بُعدًا يعمل تمامًا مثل 1536 بُعدًا لحالة الاستخدام الخاصة بهم.</p>
<p><strong>هل أنت ملتزم بالفعل بنموذج عالي الأبعاد؟</strong> يمكنك تقليل الأبعاد بعد ذلك. يمكن ل PCA (تحليل المكونات الرئيسية) تجريد الميزات الزائدة عن الحاجة، وتتيح لك <a href="https://milvus.io/blog/matryoshka-embeddings-detail-at-multiple-scales.md">تضمينات ماتريوشكا</a> اقتطاع الأبعاد N الأولى مع الاحتفاظ بمعظم الجودة. كلاهما يستحق التجربة قبل إعادة تضمين مجموعة بياناتك بالكامل.</p>
<h2 id="Manage-Data-Lifecycle-with-Compaction-and-TTL" class="common-anchor-header">إدارة دورة حياة البيانات مع الضغط و TTL<button data-href="#Manage-Data-Lifecycle-with-Compaction-and-TTL" class="anchor-icon" translate="no">
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
    </button></h2><p>هذا أقل بريقًا ولكنه لا يزال مهمًا، خاصةً لأنظمة الإنتاج طويلة الأمد. يستخدم ميلفوس نموذج التخزين الإلحاقي فقط: عندما تحذف البيانات، يتم وضع علامة على أنها محذوفة ولكن لا تتم إزالتها على الفور. بمرور الوقت، تتراكم هذه البيانات الميتة، وتهدر مساحة التخزين، وتتسبب في قيام الاستعلامات بمسح صفوف أكثر مما تحتاج إليه.</p>
<h3 id="Compaction-Reclaim-Storage-from-Deleted-Data" class="common-anchor-header">الضغط: استعادة التخزين من البيانات المحذوفة</h3><p>الضغط هو عملية الخلفية في ميلفوس للتنظيف. فهو يدمج المقاطع الصغيرة، ويزيل البيانات المحذوفة فعلياً، ويعيد كتابة الملفات المضغوطة. ستحتاج إلى هذا إذا</p>
<ul>
<li>لديك عمليات كتابة وحذف متكررة (كتالوجات المنتجات، تحديثات المحتوى، سجلات الوقت الحقيقي)</li>
<li>يستمر عدد مقاطعك في النمو (وهذا يزيد من النفقات العامة لكل استعلام)</li>
<li>ينمو استخدام التخزين بشكل أسرع بكثير من بياناتك الفعلية الصالحة</li>
</ul>
<p><strong>انتبه:</strong> الضغط كثيف الإدخال/الإخراج. قم بجدولته خلال الفترات ذات حركة المرور المنخفضة (على سبيل المثال، ليلاً) أو قم بضبط المشغلات بعناية حتى لا تتنافس مع استعلامات الإنتاج.</p>
<h3 id="TTLTime-to-Live-Automatically-Expire-Old-Vector-Data" class="common-anchor-header">TTL (وقت البث المباشر): انتهاء صلاحية بيانات المتجهات القديمة تلقائيًا</h3><p>بالنسبة للبيانات التي تنتهي صلاحيتها بشكل طبيعي، يعتبر TTL أنظف من الحذف اليدوي. قم بتعيين عمر افتراضي لبياناتك، وسيقوم ميلفوس تلقائيًا بوضع علامة عليها للحذف عند انتهاء صلاحيتها. يتعامل الضغط مع التنظيف الفعلي.</p>
<p>هذا مفيد لـ</p>
<ul>
<li>السجلات وبيانات الجلسة - احتفظ بآخر 7 أو 30 يومًا فقط</li>
<li>RAG الحساسة للوقت - تفضل المعرفة الحديثة، دع المستندات القديمة تنتهي صلاحيتها</li>
<li>التوصيات في الوقت الحقيقي - استرداد فقط من سلوك المستخدم الأخير</li>
</ul>
<p>يحمي الضغط و TTL معًا نظامك من تراكم النفايات بصمت. إنها ليست أكبر رافعة للتكلفة، ولكنها تمنع هذا النوع من زحف التخزين البطيء الذي يفاجئ الفرق.</p>
<h2 id="One-More-Option-Zilliz-Cloud-Fully-Managed-Milvus" class="common-anchor-header">خيار آخر زيليز كلاود (ميلفوس المدارة بالكامل)<button data-href="#One-More-Option-Zilliz-Cloud-Fully-Managed-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>الإفصاح الكامل: تم بناء <a href="https://zilliz.com/">Zilliz Cloud</a> من قبل نفس الفريق الذي يقف وراء Milvus، لذا خذ هذا مع حبة الملح المناسبة.</p>
<p>ومع ذلك، إليكم الجزء غير البديهي: على الرغم من أن Milvus مجاني ومفتوح المصدر، إلا أن الخدمة المدارة يمكن أن تكلف أقل من الاستضافة الذاتية. والسبب بسيط، فالبرنامج مجاني، لكن البنية التحتية السحابية لتشغيله ليست مجانية، وتحتاج إلى مهندسين لتشغيله وصيانته. إذا كان بإمكان الخدمة المُدارة القيام بنفس العمل باستخدام عدد أقل من الأجهزة وساعات عمل أقل للمهندسين، فإن فاتورتك الإجمالية تنخفض حتى بعد دفع ثمن الخدمة نفسها.</p>
<p>إن<a href="https://zilliz.com/">Zilliz Cloud</a> هي خدمة مُدارة بالكامل مبنية على Milvus ومتوافقة مع واجهة برمجة التطبيقات. أمران مرتبطان بالتكلفة</p>
<ul>
<li><strong>أداء أفضل لكل عقدة.</strong> تعمل Zilliz Cloud على Cardinal، محرك البحث المحسّن الخاص بنا. استنادًا إلى <a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch">نتائج VectorDBBench،</a> فإنه يوفر إنتاجية أعلى بمقدار 3-5 أضعاف من Milvus مفتوح المصدر وأسرع 10 أضعاف. من الناحية العملية، يعني ذلك أنك تحتاج إلى ما يقرب من ثلث إلى خُمس عدد عُقد الحوسبة لنفس عبء العمل.</li>
<li><strong>تحسينات مدمجة.</strong> الميزات التي يغطيها هذا الدليل، مثل MMap، والتخزين المتدرج، وتكميم الفهرس، مدمجة ومضبوطة تلقائيًا. يعمل التحجيم التلقائي على ضبط السعة تلقائيًا بناءً على الحمل الفعلي، لذلك أنت لا تدفع مقابل مساحة رأس لا تحتاج إليها.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Howto_Cut_Vector_Database_Costsby_Upto80_A_Pract_1_5230ab94bf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://zilliz.com/zilliz-migration-service">الترحيل</a> سهل ومباشر لأن واجهات برمجة التطبيقات وتنسيقات البيانات متوافقة. يوفر Zilliz أيضًا أدوات الترحيل للمساعدة. للاطلاع على مقارنة مفصّلة، انظر: <a href="https://zilliz.com/zilliz-vs-milvus">زيليز كلاود مقابل ميلفوس</a></p>
<h2 id="Summary-A-Step-by-Step-Plan-to-Cut-Vector-Database-Costs" class="common-anchor-header">ملخص: خطة خطوة بخطوة لخفض تكاليف قواعد البيانات المتجهة<button data-href="#Summary-A-Step-by-Step-Plan-to-Cut-Vector-Database-Costs" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>إذا كنت تفعل شيئًا واحدًا فقط، فافعل هذا: تحقق من نوع الفهرس الخاص بك.</strong></p>
<p>إذا كنت تقوم بتشغيل HNSW على عبء عمل حساس من حيث التكلفة، قم بالتبديل إلى IVF_SQ8. هذا وحده يمكن أن يقلل من تكلفة الذاكرة بنسبة 70٪ تقريبًا مع الحد الأدنى من فقدان الاستدعاء.</p>
<p>إذا كنت تريد المضي قدمًا، فإليك ترتيب الأولويات:</p>
<ul>
<li>بدّل<strong>فهرسك</strong> - HNSW ← IVF_SQ8 لمعظم أعباء العمل. أكبر ضجة لعدم وجود تغيير معماري.</li>
<li><strong>تمكين MMap أو التخزين المتدرج</strong> - توقف عن الاحتفاظ بكل شيء في الذاكرة. هذا تغيير في التهيئة وليس إعادة تصميم.</li>
<li><strong>قم بتقييم أبعاد التضمين</strong> - اختبر ما إذا كان النموذج الأصغر يلبي احتياجاتك من الدقة. يتطلب ذلك إعادة التضمين ولكن التوفير مركب.</li>
<li><strong>قم بإعداد الضغط و TTL</strong> - منع تضخم البيانات الصامت، خاصةً إذا كان لديك عمليات كتابة/حذف متكررة.</li>
</ul>
<p>يمكن لهذه الاستراتيجيات مجتمعةً أن تقلل من فاتورة قاعدة البيانات المتجهة بنسبة 60-80%. لا يحتاج كل فريق إلى كل هذه الاستراتيجيات الأربعة - ابدأ بتغيير الفهرس، وقم بقياس التأثير، ثم انتقل إلى أسفل القائمة.</p>
<p>بالنسبة للفرق التي تتطلع إلى تقليل العمل التشغيلي وتحسين كفاءة التكلفة، فإن <a href="https://zilliz.com/">Zilliz Cloud</a> (المدارة Milvus) هي خيار آخر.</p>
<p>إذا كنت تعمل من خلال أي من هذه التحسينات وتريد مقارنة الملاحظات، فإن <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">مجتمع Milvus Slack</a> هو مكان جيد لطرح الأسئلة. يمكنك أيضًا الانضمام إلى <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">ساعات عمل Milvus المكتبية</a> لإجراء محادثة سريعة مع الفريق الهندسي حول إعداداتك الخاصة.</p>
