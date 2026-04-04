---
id: turboquant-rabitq-vector-database-cost.md
title: >-
  ما وراء جدل TurboQuant-RaBitQ: لماذا يعتبر التحويل الكمي مهمًا لتكاليف البنية
  التحتية للذكاء الاصطناعي
author: Li Liu
date: 2026-4-2
cover: assets.zilliz.com/vectorquantization_0bea9e6bec.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  TurboQuant, RaBitQ, vector quantization, TurboQuant vs RaBitQ, vector database
  memory optimization
meta_title: |
  Vector Quantization: Beyond the TurboQuant-RaBitQ Debate
desc: >-
  جعلت المناظرة بين TurboQuant-RaBitQ من المناظرة بين TurboQuant-RaBitQ تكميم
  المتجهات أخبارًا رئيسية. كيف يعمل ضغط RaBitQ 1 بت وكيف تقوم شركة Milvus بشحن
  IVF_RABITQ لتوفير 97% من الذاكرة.
origin: 'https://milvus.io/blog/turboquant-rabitq-vector-database-cost.md'
---
<p>أبلغت ورقة TurboQuant من Google (ICLR 2026) عن ضغط ذاكرة التخزين المؤقت 6 أضعاف KV مع فقدان الدقة شبه الصفر - نتائج مذهلة بما يكفي لمسح <a href="https://www.cnbc.com/2026/03/26/google-ai-turboquant-memory-chip-stocks-samsung-micron.html"> 90 مليار دولار من أسهم رقائق الذاكرة</a> في يوم واحد. انخفضت SK Hynix بنسبة 12%. وانخفضت سامسونج بنسبة 7%.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Beyond_the_Turbo_Quant_Ra_Bit_Q_Debate_How_Vector_Quantization_Is_Reshaping_AI_Infrastructure_from_Paper_to_Production_1_825845eccb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>وسرعان ما لفتت الورقة البحثية الأنظار. <a href="https://medium.com/@gaojianyang0017/turboquant-and-rabitq-what-the-public-story-gets-wrong-23df83209c22">أثار</a> <a href="https://gaoj0017.github.io/">جيانيانج جاو،</a> المؤلف الأول لـ <a href="https://dl.acm.org/doi/10.1145/3654970">RaBitQ</a> (SIGMOD 2024)، <a href="https://medium.com/@gaojianyang0017/turboquant-and-rabitq-what-the-public-story-gets-wrong-23df83209c22">تساؤلات</a> حول العلاقة بين منهجية TurboQuant وعمله السابق على تكميم المتجهات. (سننشر محادثة مع الدكتور غاو قريبًا - تابعنا إذا كنت مهتمًا).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Beyond_the_Turbo_Quant_Ra_Bit_Q_Debate_How_Vector_Quantization_Is_Reshaping_AI_Infrastructure_from_Paper_to_Production_2_0860406cae.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>لا يتعلق هذا المقال بالانحياز إلى أحد الجانبين في تلك المناقشة. ما أدهشنا هو شيء أكبر: حقيقة أن ورقة بحثية واحدة عن تكميم <a href="https://milvus.io/docs/index-explained.md">المتجهات</a> يمكن أن تحرك 90 مليار دولار من القيمة السوقية تخبرك بمدى أهمية هذه التقنية للبنية التحتية للذكاء الاصطناعي. وسواء كان الأمر يتعلق بضغط ذاكرة التخزين المؤقت KV في محركات الاستدلال أو ضغط الفهارس في <a href="https://zilliz.com/learn/what-is-vector-database">قواعد البيانات</a> المتجهة، فإن القدرة على تقليص البيانات عالية الأبعاد مع الحفاظ على الجودة لها آثار هائلة من حيث التكلفة - وهي مشكلة نعمل على حلها، حيث قمنا بدمج RaBitQ في قاعدة بيانات <a href="https://milvus.io/">Milvus</a> المتجهة وتحويلها إلى بنية تحتية للإنتاج.</p>
<p>فيما يلي ما سنقوم بتغطيته: لماذا يعد التكميم الكمي المتجه مهمًا جدًا في الوقت الحالي، وكيف يمكن المقارنة بين TurboQuant و RaBitQ، وما هو RaBitQ وكيف يعمل، والعمل الهندسي وراء شحنه داخل Milvus، وكيف يبدو مشهد تحسين الذاكرة الأوسع نطاقًا للبنية التحتية للذكاء الاصطناعي.</p>
<h2 id="Why-Does-Vector-Quantization-Matter-for-Infrastructure-Costs" class="common-anchor-header">ما أهمية التكميم الكمي للناقلات بالنسبة لتكاليف البنية التحتية؟<button data-href="#Why-Does-Vector-Quantization-Matter-for-Infrastructure-Costs" class="anchor-icon" translate="no">
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
    </button></h2><p>تكميم المتجهات ليس بالأمر الجديد. الجديد هو مدى حاجة الصناعة إليه بشكل عاجل. على مدار العامين الماضيين، تضخمت معلمات LLM، وتوسعت نوافذ السياق من 4K إلى أكثر من 128K إلى أكثر من 128K إلى الرموز، وأصبحت البيانات غير المهيكلة - النصوص والصور والصوت والفيديو - مدخلات من الدرجة الأولى لأنظمة الذكاء الاصطناعي. كل واحد من هذه الاتجاهات يخلق المزيد من المتجهات عالية الأبعاد التي تحتاج إلى التخزين والفهرسة والبحث. المزيد من المتجهات، المزيد من الذاكرة، المزيد من التكلفة.</p>
<p>إذا كنت تقوم بتشغيل البحث المتجه على نطاق واسع - <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">خطوط أنابيب RAG،</a> ومحركات التوصيات، والاسترجاع متعدد الوسائط - فمن المحتمل أن تكون تكلفة الذاكرة أحد أكبر مشاكل البنية التحتية لديك.</p>
<p>أثناء نشر النموذج، يعتمد كل مكدس استدلالي رئيسي في LLM على <a href="https://zilliz.com/glossary/kv-cache">ذاكرة التخزين المؤقت KV</a> - تخزين أزواج المفاتيح-القيم المحسوبة مسبقًا حتى لا تقوم آلية الانتباه بإعادة حسابها لكل رمز جديد. هذا ما يجعل استدلال O(n) ممكنًا بدلاً من O(n²). يعتمد عليه كل إطار عمل من <a href="https://github.com/vllm-project/vllm">vLLM</a> إلى <a href="https://github.com/NVIDIA/TensorRT-LLM">TensorRT-LLM</a>. لكن ذاكرة التخزين المؤقت KV يمكن أن تستهلك ذاكرة وحدة معالجة الرسومات أكثر من أوزان النموذج نفسها. سياقات أطول، وعدد أكبر من المستخدمين المتزامنين، ويتصاعد الأمر بسرعة.</p>
<p>يؤثر الضغط نفسه على قواعد البيانات المتجهة - مليارات من المتجهات عالية الأبعاد الموجودة في الذاكرة، كل منها عبارة عن 32 بت عائم لكل بُعد. يعمل تكميم المتجهات على ضغط هذه المتجهات من 32 بت عائمًا إلى 4 بت أو 2 بت أو حتى 1 بت - مما يقلص الذاكرة بنسبة 90% أو أكثر. سواءً كانت ذاكرة التخزين المؤقت KV في محرك الاستدلال أو الفهارس في قاعدة بيانات المتجهات، فإن العمليات الحسابية الأساسية هي نفسها، والتوفير في التكاليف حقيقي. وهذا هو السبب في أن ورقة بحثية واحدة تبلغ عن اختراق في هذا المجال حرّكت 90 مليار دولار من القيمة السوقية للأسهم.</p>
<h2 id="TurboQuant-vs-RaBitQ-Whats-the-Difference" class="common-anchor-header">TurboQuant مقابل RaBitQ: ما الفرق بينهما؟<button data-href="#TurboQuant-vs-RaBitQ-Whats-the-Difference" class="anchor-icon" translate="no">
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
    </button></h2><p>يعتمد كل من TurboQuant و RaBitQ على نفس التقنية الأساسية: تطبيق دوران عشوائي<a href="https://arxiv.org/abs/2406.03482">(تحويل جونسون-ليندنستراوس</a>) على متجهات الإدخال قبل التكميم. يعمل هذا التدوير على تحويل البيانات الموزعة بشكل غير منتظم إلى توزيع موحد يمكن التنبؤ به، مما يسهل عملية التكميم مع انخفاض نسبة الخطأ.</p>
<p>وبعيدًا عن هذا الأساس المشترك، يستهدف البرنامجان مشاكل مختلفة ويتبعان نهجًا مختلفًا:</p>
<table>
<thead>
<tr><th></th><th>TurboQuant</th><th>RaBitQ</th></tr>
</thead>
<tbody>
<tr><td><strong>الهدف</strong></td><td>ذاكرة التخزين المؤقت KV في استدلال LLM (بيانات سريعة الزوال، لكل طلب)</td><td>فهارس المتجهات الدائمة في قواعد البيانات (البيانات المخزنة)</td></tr>
<tr><td><strong>النهج</strong></td><td>على مرحلتين PolarQuant (مقياس لويد-ماكس القطبي (مقياس لويد-ماكس الكمي القياسي لكل إحداثي) + <a href="https://arxiv.org/abs/2406.03482">QJL</a> (تصحيح متبقي 1 بت)</td><td>مرحلة واحدة: الإسقاط المفرط المكعب + مقدر مسافة غير متحيز</td></tr>
<tr><td><strong>عرض البت</strong></td><td>مفاتيح 3 بت، قيم 2 بت (دقة مختلطة)</td><td>1 بت لكل بُعد (مع توفر متغيرات متعددة البتات)</td></tr>
<tr><td><strong>الادعاء النظري</strong></td><td>معدل تشويه MSE شبه الأمثل</td><td>خطأ تقدير المنتج الداخلي الأمثل تقريبيًا (مطابقة الحدود الدنيا لألون-كلارتاغ)</td></tr>
<tr><td><strong>حالة الإنتاج</strong></td><td>تطبيقات المجتمع؛ لا يوجد إصدار رسمي من Google</td><td>تم شحنها في الإصدار <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6،</a> وتم اعتمادها من قبل Faiss، VSAG، Elasticsearch</td></tr>
</tbody>
</table>
<p>الفرق الرئيسي للممارسين: يعمل TurboQuant على تحسين ذاكرة التخزين المؤقت العابرة لـ KV داخل محرك الاستدلال، بينما يستهدف RaBitQ الفهارس الدائمة التي تنشئها قاعدة بيانات المتجهات وتجزئتها والاستعلام عنها عبر مليارات المتجهات. بالنسبة لبقية هذه المقالة، سنركز على RaBitQ - الخوارزمية التي قمنا بدمجها وشحنها في الإنتاج داخل Milvus.</p>
<h2 id="What-Is-RaBitQ-and-What-Does-It-Deliver" class="common-anchor-header">ما هي RaBitQ وماذا تقدم؟<button data-href="#What-Is-RaBitQ-and-What-Does-It-Deliver" class="anchor-icon" translate="no">
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
    </button></h2><p>إليكم الخلاصة أولاً: في مجموعة بيانات 10 ملايين متجه بأبعاد 768، يقوم RaBitQ بضغط كل متجه إلى 1/32 من حجمه الأصلي مع الحفاظ على نسبة استرجاع أعلى من 94%. في Milvus، يُترجم ذلك إلى معدل إنتاجية استعلام أعلى بمقدار 3.6 مرة من فهرس كامل الدقة. هذا ليس إسقاطًا نظريًا - إنها نتيجة قياسية من Milvus 2.6.</p>
<p>والآن، كيف تصل إلى ذلك.</p>
<p>يضغط التكميم الثنائي التقليدي متجهات FP32 إلى 1 بت لكل بُعد - ضغط 32 ضعفًا. المفاضلة: ينهار الاستدعاء لأنك تخلصت من الكثير من المعلومات. يحافظ <a href="https://arxiv.org/abs/2405.12497">RaBitQ</a> (Gao &amp; Long، SIGMOD 2024) على نفس الضغط 32 ضعفًا ولكنه يحافظ على المعلومات المهمة بالفعل للبحث. تثبت <a href="https://arxiv.org/abs/2409.09913">نسخة موسعة</a> (Gao &amp; Long، SIGMOD 2025) أن هذا هو الأمثل تقريبيًا، وهو ما يطابق الحدود الدنيا النظرية التي وضعها ألون وكلارتاغ (FOCS 2017).</p>
<h3 id="Why-Do-Angles-Matter-More-Than-Coordinates-in-High-Dimensions" class="common-anchor-header">لماذا تعتبر الزوايا أكثر أهمية من الإحداثيات في الأبعاد العالية؟</h3><p>الفكرة الرئيسية: <strong>في الأبعاد العالية، تكون الزوايا بين المتجهات أكثر استقرارًا وإفادة من قيم الإحداثيات الفردية.</strong> هذه نتيجة لتركيز القياس - وهي نفس الظاهرة التي تجعل إسقاطات جونسون-ليندنستراوس العشوائية تعمل.</p>
<p>ما يعنيه هذا عمليًا: يمكنك تجاهل القيم الإحداثية الدقيقة لمتجه عالي الأبعاد والاحتفاظ فقط باتجاهه بالنسبة إلى مجموعة البيانات. تنجو العلاقات الزاوية - وهو ما يعتمد عليه <a href="https://zilliz.com/glossary/anns">البحث عن أقرب جار</a> في الواقع - من الضغط.</p>
<h3 id="How-Does-RaBitQ-Work" class="common-anchor-header">كيف يعمل RaBitQ؟</h3><p>يحوّل RaBitQ هذه الرؤية الهندسية إلى ثلاث خطوات:</p>
<p><strong>الخطوة 1: التطبيع.</strong> توسيط كل متجه بالنسبة إلى مركز مجموعة البيانات وقياسه إلى وحدة الطول. وهذا يحول المشكلة إلى تقدير حاصل الضرب الداخلي بين متجهات الوحدة - مما يسهل تحليلها وتقييدها.</p>
<p><strong>الخطوة 2: تدوير عشوائي + إسقاط المكعب الزائد.</strong> قم بتطبيق مصفوفة متعامدة عشوائية (تدوير عشوائي (تدوير من نوع جونسون-ليندنستراوس) لإزالة التحيز نحو أي محور. أسقط كل متجه تم تدويره على أقرب رأس من {±1/√D}^D hypercube. ينهار كل بُعد إلى بت واحد. النتيجة: رمز ثنائي D بت لكل متجه.</p>
<p><strong>الخطوة 3: تقدير المسافة غير المتحيزة.</strong> أنشئ مُقدِّرًا لحاصل الضرب الداخلي بين الاستعلام والمتجه الأصلي (غير المتكافئ). يمكن إثبات أن المقدر غير متحيز مع خطأ محدود ب O(1/√D). بالنسبة إلى المتجهات ذات 768 بُعدًا، يحافظ هذا على نسبة استرجاع أعلى من 94%.</p>
<p>يقلل حساب المسافة بين المتجهات الثنائية إلى عمليات "بت وايز + بوب كاونت" - وهي عمليات تنفذها وحدات المعالجة المركزية الحديثة في دورة واحدة. هذا ما يجعل RaBitQ سريعًا، وليس فقط صغيرًا.</p>
<h3 id="Why-Is-RaBitQ-Practical-Not-Just-Theoretical" class="common-anchor-header">لماذا يعتبر RaBitQ عملياً وليس نظرياً فقط؟</h3><ul>
<li><strong>لا يحتاج إلى تدريب.</strong> تطبيق التدوير، والتحقق من العلامات. لا يوجد تحسين تكراري، ولا تعلم دفتر الرموز. وقت الفهرسة قابل للمقارنة مع <a href="https://milvus.io/docs/ivf-pq.md">تكميم المنتج</a>.</li>
<li><strong>صديقة للأجهزة.</strong> حساب المسافة عبارة عن حساب المسافة بحساب البتات و + عدد البوب. تحتوي وحدات المعالجة المركزية الحديثة (Intel IceLake+ وAMD Zen 4+) على تعليمات AVX512VPOPCNTDQ مخصصة. يعمل التقدير أحادي المتجه أسرع 3 مرات من جداول البحث PQ.</li>
<li><strong>مرونة متعددة البتات.</strong> تدعم <a href="https://vectordb-ntu.github.io/RaBitQ-Library/">مكتبة RaBitQ مكتبة RaBitQ</a> متغيرات تتجاوز 1 بت: تحقق 4 بت استرجاعًا بنسبة 90٪ تقريبًا، و5 بت بنسبة 95٪ تقريبًا، و7 بت بنسبة 99٪ تقريبًا - كل ذلك دون إعادة ترتيب.</li>
<li><strong>قابلة للتركيب.</strong> يتم توصيلها بهياكل الفهرس الحالية مثل <a href="https://milvus.io/docs/ivf-flat.md">فهارس IVF</a> <a href="https://milvus.io/docs/hnsw.md">والرسوم البيانية HNSW،</a> وتعمل مع FastScan لحساب المسافة على دفعات.</li>
</ul>
<h2 id="From-Paper-to-Production-What-We-Built-to-Ship-RaBitQ-in-Milvus" class="common-anchor-header">من الورق إلى الإنتاج: ما بنيناه لشحن RaBitQ في Milvus<button data-href="#From-Paper-to-Production-What-We-Built-to-Ship-RaBitQ-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>إن كود RaBitQ الأصلي هو نموذج أولي بحثي لجهاز واحد. يتطلب جعله يعمل عبر <a href="https://milvus.io/docs/architecture_overview.md">مجموعة موزعة</a> مع التجزئة وتجاوز الفشل والاستيعاب في الوقت الحقيقي حل أربع مشاكل هندسية. في <a href="https://zilliz.com/">Zilliz،</a> ذهبنا إلى ما هو أبعد من مجرد تنفيذ الخوارزمية - فقد امتد العمل إلى تكامل المحرك، وتسريع الأجهزة، وتحسين الفهرس، وضبط وقت التشغيل لتحويل RaBitQ إلى قدرة على المستوى الصناعي داخل Milvus. يمكنك العثور على مزيد من التفاصيل في هذه المدونة أيضًا: <a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">نقل ضغط المتجهات إلى أقصى الحدود: كيف تخدم Milvus 3 أضعاف الاستعلامات باستخدام RaBitQ</a></p>
<h3 id="Making-RaBitQ-Distributed-Ready" class="common-anchor-header">جعل RaBitQ جاهزاً للتوزيع</h3><p>لقد قمنا بدمج RaBitQ مباشرةً في <a href="https://github.com/milvus-io/knowhere">Knowhere،</a> محرك البحث الأساسي في Milvus - ليس كمكوِّن إضافي، ولكن كنوع فهرس أصلي مع واجهات موحدة. وهو يعمل مع بنية ميلفوس الموزعة الكاملة: التجزئة، والتقسيم، والتوسع الديناميكي، <a href="https://milvus.io/docs/manage-collections.md">وإدارة التجميع</a>.</p>
<p>التحدي الرئيسي: جعل دفتر الترميز الكمي (مصفوفة التدوير، ومتجهات المركز، ومعلمات القياس) مدركًا للتجزئة، بحيث يقوم كل جزء ببناء وتخزين حالة التجزئة الخاصة به. إن عمليات إنشاء الفهرس وعمليات الدمج وموازنة التحميل كلها تفهم نوع الفهرس الجديد أصلاً.</p>
<h3 id="Squeezing-Every-Cycle-Out-of-Popcount" class="common-anchor-header">الضغط على كل دورة من Popcount</h3><p>تأتي سرعة RaBitQ من Popcount - عدّ مجموعة البتات في المتجهات الثنائية. الخوارزمية سريعة بطبيعتها، ولكن مقدار الإنتاجية التي تحصل عليها يعتمد على مدى جودة استخدامك للأجهزة. لقد أنشأنا مسارات كود SIMD مخصصة لكل من بنيات الخوادم السائدة:</p>
<ul>
<li><strong>x86 (Intel IceLake+ Intel IceLake +/ AMD Zen 4+):</strong> تقوم تعليمات VPOPCNTDQ الخاصة بـ AVX-512 بحساب عدد المنبثقة عبر عدة سجلات 512 بت بالتوازي. تتم إعادة هيكلة الحلقات الداخلية لـ Knowhere لتجميع حسابات المسافة الثنائية في أجزاء بعرض SIMD، مما يزيد من الإنتاجية.</li>
<li><strong>ARM (جرافيتون، أمبير):</strong> تعليمات SVE (ملحق المتجهات القابلة للتطوير) لنفس نمط عدد المنبثقة المتوازي - وهو أمر بالغ الأهمية لأن مثيلات ARM شائعة بشكل متزايد في عمليات النشر السحابية المحسّنة من حيث التكلفة.</li>
</ul>
<h3 id="Eliminating-Runtime-Overhead" class="common-anchor-header">التخلص من نفقات وقت التشغيل الزائدة</h3><p>يحتاج RaBitQ إلى معلمات الفاصلة العائمة الإضافية في وقت الاستعلام: النواة المركزية لمجموعة البيانات، ومعايير كل متجه، والحاصل الداخلي بين كل متجه كمي ومتجهه الأصلي (يستخدمه مقدر المسافة). يضيف حساب هذه المعلمات لكل استعلام وقت استجابة. تخزين المتجهات الأصلية كاملةً يتعارض مع الغرض من الضغط.</p>
<p>الحل الذي نقدمه: حساب هذه المعلمات مسبقًا واستمرارها أثناء إنشاء الفهرس، وتخزينها مؤقتًا إلى جانب الرموز الثنائية. إن النفقات الزائدة للذاكرة صغيرة (عدد قليل من العوامات لكل متجه)، لكنها تلغي الحساب لكل طلب وتحافظ على استقرار زمن الاستجابة في ظل التزامن العالي.</p>
<h3 id="IVFRABITQ-The-Index-You-Actually-Deploy" class="common-anchor-header">IVF_RABITQ: الفهرس الذي تنشره بالفعل</h3><p>بدءًا من الإصدار <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6،</a> نقوم بشحن <a href="https://milvus.io/docs/ivf-rabitq.md">IVF_RABITQ</a> - <a href="https://milvus.io/docs/ivf-flat.md">فهرس الملف المقلوب</a> + تكميم RaBitQ. يعمل البحث على مرحلتين:</p>
<ol>
<li><strong>البحث الخشن (IVF).</strong> يقسم K-means مساحة المتجه إلى مجموعات. في وقت الاستعلام، يتم مسح المجموعات الأقرب إلى nprobe الأقرب فقط.</li>
<li><strong>التسجيل الدقيق (RaBitQ).</strong> داخل كل مجموعة، يتم تقدير المسافات باستخدام رموز 1 بت ومُقدِّر غير متحيز. يقوم Popcount بالرفع الثقيل.</li>
</ol>
<p>النتائج على مجموعة بيانات ذات 768 بُعدًا مكونة من 10 ملايين متجه:</p>
<table>
<thead>
<tr><th>المتري</th><th>IVF_FLAT (خط الأساس)</th><th>IVF_RABITQ</th><th>IVF_RABITQ + تنقيح SQ8</th></tr>
</thead>
<tbody>
<tr><td>الاسترجاع</td><td>95.2%</td><td>94.7%</td><td>~95%</td></tr>
<tr><td>QPS</td><td>236</td><td>864</td><td>-</td></tr>
<tr><td>بصمة الذاكرة</td><td>32 بت/محددة</td><td>1 بت/محددة (حوالي 3% من الأصل)</td><td>~25% من الأصل</td></tr>
</tbody>
</table>
<p>بالنسبة لأحمال العمل التي لا يمكنها تحمل حتى فجوة استدعاء بنسبة 0.5%، تضيف معلمة Refine_type مسارًا ثانيًا لتسجيل النقاط: SQ6 أو SQ8 أو SQ8 أو FP16 أو BF16 أو FP32. SQ8 هو الخيار الشائع - فهو يستعيد الاستدعاء إلى مستويات IVF_FLAT بربع الذاكرة الأصلية تقريبًا. يمكنك أيضًا تطبيق <a href="https://milvus.io/docs/ivf-sq8.md">التكميم القياسي</a> على جانب الاستعلام (SQ1-SQ8) بشكل مستقل، مما يمنحك مفتاحين لضبط مفاضلة زمن الاستجابة - التكلفة - زمن الاستجابة لكل عبء عمل.</p>
<h2 id="How-Milvus-Optimizes-Memory-Beyond-Quantization" class="common-anchor-header">كيف يحسّن Milvus الذاكرة إلى ما بعد التكميم الكمي<button data-href="#How-Milvus-Optimizes-Memory-Beyond-Quantization" class="anchor-icon" translate="no">
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
    </button></h2><p>RaBitQ هي أكثر أدوات الضغط دراماتيكية، ولكنها طبقة واحدة في مكدس <a href="https://milvus.io/blog/milvus-26-preview-72-memory-reduction-without-compromising-recall-and-4x-faster-than-elasticsearch.md">تحسين الذاكرة</a> الأوسع نطاقًا:</p>
<table>
<thead>
<tr><th>الاستراتيجية</th><th>ماذا يفعل</th><th>التأثير</th></tr>
</thead>
<tbody>
<tr><td><strong>تكميم كامل المكدس</strong></td><td>SQ8، PQ، RaBitQ بمقايضات مختلفة بين الدقة والتكلفة</td><td>تقليل الذاكرة من 4 أضعاف إلى 32 ضعفًا</td></tr>
<tr><td><strong>تحسين بنية الفهرس</strong></td><td>ضغط الرسم البياني HNSW، وإلغاء تحميل أقراص DiskANN SSD، وإنشاء فهرس آمن لعمليات التشغيل خارج نطاق الخدمة</td><td>ذاكرة DRAM أقل لكل فهرس، مجموعات بيانات أكبر لكل عقدة</td></tr>
<tr><td><strong>الإدخال/الإخراج المعين بالذاكرة (mmap)</strong></td><td>تعيين الملفات المتجهة إلى القرص، وتحميل الصفحات عند الطلب عبر ذاكرة التخزين المؤقت لصفحات نظام التشغيل</td><td>مجموعات بيانات بمقياس تيرابايت دون تحميل كل شيء في ذاكرة الوصول العشوائي</td></tr>
<tr><td><strong>تخزين متدرج</strong></td><td>فصل البيانات الساخنة/الدافئة/الباردة مع جدولة تلقائية</td><td>دفع أسعار الذاكرة فقط للبيانات التي يتم الوصول إليها بشكل متكرر</td></tr>
<tr><td><strong>التحجيم السحابي الأصلي</strong><a href="https://zilliz.com/cloud">(زيليز كلاود،</a> ميلفوس المُدار)</td><td>التخصيص المرن للذاكرة، والإفراج التلقائي عن الموارد الخاملة</td><td>ادفع فقط مقابل ما تستخدمه</td></tr>
</tbody>
</table>
<h3 id="Full-Stack-Quantization" class="common-anchor-header">التكميم الكمي الكامل</h3><p>ضغط RaBitQ البالغ 1 بت ليس مناسبًا لكل أعباء العمل. يقدم ميلفوس مصفوفة تكميم كاملة: <a href="https://milvus.io/docs/ivf-sq8.md">SQ8</a> <a href="https://milvus.io/docs/ivf-pq.md">وتكميم المنتج (PQ)</a> لأحمال العمل التي تحتاج إلى مفاضلة متوازنة بين الدقة والتكلفة، و RaBitQ لأقصى ضغط على مجموعات البيانات الكبيرة جدًا، والتكوينات الهجينة التي تجمع بين طرق متعددة للتحكم الدقيق.</p>
<h3 id="Index-Structure-Optimization" class="common-anchor-header">تحسين بنية الفهرس</h3><p>بالإضافة إلى التكميم الكمي، تعمل Milvus باستمرار على تحسين الذاكرة الزائدة في هياكل الفهرس الأساسية. بالنسبة إلى <a href="https://milvus.io/docs/hnsw.md">HNSW،</a> قمنا بتقليل التكرار في قائمة التجاور لتقليل استخدام الذاكرة لكل رسم بياني. يدفع <a href="https://milvus.io/docs/diskann.md">DiskANN</a> كلاً من البيانات المتجهة وهياكل الفهرس إلى SSD، مما يقلل بشكل كبير من الاعتماد على DRAM لمجموعات البيانات الكبيرة. كما قمنا أيضًا بتحسين تخصيص الذاكرة الوسيطة أثناء إنشاء الفهرس لمنع حدوث أعطال في الفهرس عند إنشاء فهارس على مجموعات البيانات التي تقترب من حدود ذاكرة العقدة.</p>
<h3 id="Smart-Memory-Loading" class="common-anchor-header">التحميل الذكي للذاكرة</h3><p>يقوم دعم Milvus's <a href="https://milvus.io/docs/mmap.md">mmap</a> (الإدخال/الإخراج المعين بالذاكرة) بتعيين البيانات المتجهة إلى ملفات القرص، مع الاعتماد على ذاكرة التخزين المؤقت لصفحات نظام التشغيل للتحميل عند الطلب - لا حاجة لتحميل جميع البيانات في الذاكرة عند بدء التشغيل. وبالاقتران مع استراتيجيات التحميل البطيء والتحميل المجزأ التي تمنع حدوث طفرات مفاجئة في الذاكرة، يتيح ذلك التشغيل السلس مع مجموعات البيانات المتجهة على نطاق التيرابايت بتكلفة بسيطة من الذاكرة.</p>
<h3 id="Tiered-Storage" class="common-anchor-header">التخزين المتدرج</h3><p>تمتد <a href="https://milvus.io/docs/tiered-storage-overview.md">بنية التخزين ثلاثية المستويات</a> في Milvus على الذاكرة ومحرك أقراص الحالة الصلبة وتخزين الكائنات: تبقى البيانات الساخنة في الذاكرة لتقليل زمن الوصول، ويتم تخزين البيانات الدافئة مؤقتًا على محرك أقراص الحالة الصلبة لتحقيق التوازن بين الأداء والتكلفة، وتنتقل البيانات الباردة إلى تخزين الكائنات لتقليل النفقات العامة. يتعامل النظام مع جدولة البيانات تلقائيًا - لا يلزم إجراء تغييرات في طبقة التطبيق.</p>
<h3 id="Cloud-Native-Scaling" class="common-anchor-header">التحجيم السحابي الأصلي</h3><p>في ظل <a href="https://milvus.io/docs/architecture_overview.md">بنية</a> Milvus <a href="https://milvus.io/docs/architecture_overview.md">الموزعة،</a> يمنع تجزئة البيانات وموازنة التحميل التحميل التحميل الزائد على الذاكرة أحادية العقدة. يقلل تجميع الذاكرة من التجزئة ويحسن الاستخدام. تأخذ <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (المدارة بالكامل من Milvus) هذا الأمر إلى أبعد من ذلك من خلال الجدولة المرنة لتوسيع نطاق الذاكرة عند الطلب - في وضع عدم وجود خادم، يتم تحرير الموارد الخاملة تلقائيًا، مما يقلل من التكلفة الإجمالية للملكية.</p>
<h3 id="How-These-Layers-Compound" class="common-anchor-header">كيف تتراكم هذه الطبقات</h3><p>هذه التحسينات ليست بدائل - بل تتراكم. يقوم RaBitQ بتقليص المتجهات. يحتفظ DiskANN بالفهرس على SSD. يتجنب Mmap تحميل البيانات الباردة في الذاكرة. يدفع <a href="https://milvus.io/blog/milvus-tiered-storage-80-less-vector-search-cost-with-on-demand-hot–cold-data-loading.md">التخزين المتدرج</a> البيانات الأرشيفية إلى تخزين الكائنات. والنتيجة: لا يحتاج النشر الذي يخدم مليارات النواقل إلى ذاكرة وصول عشوائي بمليارات النواقل.</p>
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
    </button></h2><p>مع استمرار نمو أحجام بيانات الذكاء الاصطناعي، ستحدد كفاءة قاعدة بيانات المتجهات وتكلفتها بشكل مباشر مدى قدرة تطبيقات الذكاء الاصطناعي على التوسع. سنواصل الاستثمار في البنية التحتية للناقلات عالية الأداء ومنخفضة التكلفة - بحيث يمكن للمزيد من تطبيقات الذكاء الاصطناعي الانتقال من النموذج الأولي إلى الإنتاج.</p>
<p><a href="https://github.com/milvus-io/milvus">ميلفوس</a> مفتوح المصدر. لتجربة IVF_RABITQ:</p>
<ul>
<li>راجع <a href="https://milvus.io/docs/ivf-rabitq.md">وثائق IVF_RABITQ</a> للحصول على إرشادات التكوين والضبط.</li>
<li>اقرأ <a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3×-more-queries-with-rabitq.md">منشور مدونة تكامل RaBitQ</a> الكامل للحصول على معايير أعمق وتفاصيل التنفيذ.</li>
<li>انضم إلى <a href="https://slack.milvus.io/">مجتمع Milvus Slack</a> لطرح الأسئلة والتعلم من المطورين الآخرين.</li>
<li><a href="https://milvus.io/office-hours">احجز جلسة مجانية في ساعات عمل Milvus المكتبية</a> للتعرف على حالة الاستخدام الخاصة بك.</li>
</ul>
<p>إذا كنت تفضل تخطي إعداد البنية التحتية، فإن <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (Milvus المدارة بالكامل من Milvus) تقدم مستوى مجاني مع دعم IVF_RABITQ.</p>
<p>نحن بصدد إجراء مقابلة قادمة مع البروفيسور <a href="https://personal.ntu.edu.sg/c.long/">تشينج لونج</a> (NTU، VectorDB@NTU) <a href="https://gaoj0017.github.io/">والدكتور جيان يانج جاو</a> (ETH زيورخ)، المؤلف الأول لـ RaBitQ، حيث سنتعمق في نظرية التكميم المتجهي وما هو التالي. اطرحوا أسئلتكم في التعليقات.</p>
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
    </button></h2><h3 id="What-are-TurboQuant-and-RaBitQ" class="common-anchor-header">ما هما TurboQuant و RaBitQ؟</h3><p>TurboQuant (Google، ICLR 2026) و RaBitQ (Gao &amp; Long، SIGMOD 2024) كلاهما طريقتان لتكميم المتجهات التي تستخدم التدوير العشوائي لضغط المتجهات عالية الأبعاد. يستهدف TurboQuant ضغط ذاكرة التخزين المؤقت KV في الاستدلال LLM، بينما يستهدف RaBitQ الفهارس المتجهة الثابتة في قواعد البيانات. وقد ساهم كلاهما في الموجة الحالية من الاهتمام في تكميم المتجهات، على الرغم من أنهما يحلان مشاكل مختلفة لأنظمة مختلفة.</p>
<h3 id="How-does-RaBitQ-achieve-1-bit-quantization-without-destroying-recall" class="common-anchor-header">كيف يحقق RaBitQ تكميم 1 بت دون تدمير الاستدعاء؟</h3><p>يستغل RaBitQ تركيز القياس في المساحات عالية الأبعاد: الزوايا بين المتجهات أكثر استقرارًا من قيم الإحداثيات الفردية مع زيادة الأبعاد. فهو يقوم بتطبيع المتجهات بالنسبة إلى مركز مجموعة البيانات، ثم يقوم بإسقاط كل متجه على أقرب رأس مكعب هايبر المكعب (اختزال كل بُعد إلى بت واحد). يحافظ مقدر المسافة غير المتحيز مع حد خطأ يمكن إثباته على دقة البحث على الرغم من الضغط.</p>
<h3 id="What-is-IVFRABITQ-and-when-should-I-use-it" class="common-anchor-header">ما هو IVF_RABITQ ومتى يجب استخدامه؟</h3><p>IVF_RABITQ هو نوع فهرس متجه في Milvus (متوفر منذ الإصدار 2.6) يجمع بين تجميع الملفات المقلوب مع تكميم RaBitQ 1 بت. يحقق 94.7% من الاسترجاع بنسبة 3.6 أضعاف إنتاجية IVF_FLAT، مع استخدام ذاكرة بنسبة 1/32 تقريبًا من المتجهات الأصلية. استخدمه عندما تحتاج إلى خدمة بحث متجهي واسع النطاق (ملايين إلى مليارات المتجهات) وتكون تكلفة الذاكرة مصدر قلق أساسي - وهو أمر شائع في أعباء عمل البحث متعدد الوسائط والتوصيات والبحث متعدد الوسائط.</p>
<h3 id="How-does-vector-quantization-relate-to-KV-cache-compression-in-LLMs" class="common-anchor-header">كيف يرتبط تكميم المتجهات بضغط ذاكرة التخزين المؤقت KV في أجهزة LLM؟</h3><p>تتضمن كلتا المشكلتين ضغط متجهات الفاصلة العائمة عالية الأبعاد. تقوم ذاكرة التخزين المؤقت KV بتخزين أزواج المفاتيح-القيم من آلية انتباه المحول؛ عند أطوال السياق الطويلة، يمكن أن يتجاوز أوزان النموذج في استخدام الذاكرة. تعمل تقنيات تكميم المتجهات مثل RaBitQ على تقليل هذه المتجهات إلى تمثيلات منخفضة البت. تنطبق نفس المبادئ الرياضية - تركيز القياس، والتناوب العشوائي، وتقدير المسافة غير المتحيزة - سواء كنت تضغط المتجهات في فهرس قاعدة البيانات أو في ذاكرة التخزين المؤقت KV لمحرك الاستدلال.</p>
