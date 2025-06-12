---
id: introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md
title: 'نقدم لكم Milvus 2.6: بحث متجه ميسور التكلفة على نطاق المليار'
author: Fendy Feng
date: 2025-06-12T00:00:00.000Z
desc: >-
  نحن متحمسون للإعلان عن توفر الإصدار Milvus 2.6 الآن. يقدم هذا الإصدار العشرات
  من الميزات التي تعالج بشكل مباشر أكثر التحديات إلحاحًا في البحث المتجه اليوم -
  التوسع بكفاءة مع الحفاظ على التكاليف تحت السيطرة.
cover: assets.zilliz.com/Introducing_Milvus_2_6_2593452384.png
tag: Announcements
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus, vector database, vector search, AI search, Milvus 2.6'
meta_title: |
  Introducing Milvus 2.6: Affordable Vector Search at Billion Scale
origin: >-
  https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md
---
<p>مع تطور البحث المدعوم بالذكاء الاصطناعي من مشاريع تجريبية إلى بنية تحتية للمهام الحرجة، ازدادت الطلبات على <a href="https://milvus.io/blog/what-is-a-vector-database.md">قواعد بيانات المتجهات</a>. تحتاج المؤسسات إلى التعامل مع المليارات من المتجهات مع إدارة تكاليف البنية التحتية، ودعم استيعاب البيانات في الوقت الفعلي، وتوفير استرجاع متطور يتجاوز <a href="https://zilliz.com/learn/vector-similarity-search">البحث</a> الأساسي <a href="https://zilliz.com/learn/vector-similarity-search">عن التشابه</a>. ولمواجهة هذه التحديات المتطورة، عملنا جاهدين على تطوير وتحسين نظام Milvus. كانت استجابة المجتمع مشجعة بشكل لا يصدق، حيث ساعدت التعليقات القيمة في تشكيل اتجاهنا.</p>
<p>بعد أشهر من التطوير المكثف، نحن متحمسون للإعلان عن <strong>توفر الإصدار Milvus 2.6 الآن</strong>. يعالج هذا الإصدار بشكل مباشر التحديات الأكثر إلحاحًا في البحث المتجه اليوم: <strong><em>التوسع بكفاءة مع الحفاظ على التكاليف تحت السيطرة.</em></strong></p>
<p>يقدم الإصدار Milvus 2.6 ابتكارات متطورة في ثلاثة مجالات مهمة: <strong>خفض التكلفة، وقدرات البحث المتقدمة، والتحسينات المعمارية للتوسع الهائل</strong>. النتائج تتحدث عن نفسها:</p>
<ul>
<li><p><strong>تقليل الذاكرة بنسبة 72%</strong> مع تكميم RaBitQ 1 بت مع تقديم استعلامات أسرع 4 مرات</p></li>
<li><p><strong>توفير 50% من التكلفة</strong> من خلال التخزين المتدرج الذكي</p></li>
<li><p><strong>بحث في النص الكامل أسرع 4 مرات</strong> من Elasticsearch من خلال تطبيق BM25 المحسّن</p></li>
<li><p>تصفية JSON<strong>أسرع 100 مرة</strong> مع فهرس المسار الذي تم تقديمه حديثًا</p></li>
<li><p><strong>يتم تحقيق حداثة البحث بشكل اقتصادي</strong> مع بنية القرص الصفري الجديدة</p></li>
<li><p><strong>تبسيط سير عمل التضمين</strong> مع تجربة "إدخال البيانات وإخراج البيانات" الجديدة</p></li>
<li><p><strong>ما يصل إلى 100 ألف مجموعة في مجموعة واحدة لم</strong> جموعات متعددة الإيجار في المستقبل</p></li>
</ul>
<h2 id="Innovations-for-Cost-Reduction-Making-Vector-Search-Affordable" class="common-anchor-header">ابتكارات لخفض التكلفة: جعل البحث المتجه ميسور التكلفة<button data-href="#Innovations-for-Cost-Reduction-Making-Vector-Search-Affordable" class="anchor-icon" translate="no">
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
    </button></h2><p>يمثل استهلاك الذاكرة أحد أكبر التحديات عند توسيع نطاق البحث المتجه إلى مليارات السجلات. يقدم الإصدار Milvus 2.6 العديد من التحسينات الرئيسية التي تقلل بشكل كبير من تكاليف البنية التحتية مع تحسين الأداء أيضًا.</p>
<h3 id="RaBitQ-1-bit-Quantization-72-Memory-Reduction-with-4×-Performance" class="common-anchor-header">RaBitQ 1 بت التكميم الكمي: تقليل الذاكرة بنسبة 72% مع أداء 4 أضعاف</h3><p>تجبرك طرق التكميم التقليدية على مقايضة جودة البحث مقابل توفير الذاكرة. يغيّر Milvus 2.6 هذا الأمر مع <a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">تكميم RaBitQ 1 بت</a> مع آلية تنقية ذكية.</p>
<p>يقوم فهرس IVF_RABITQ الجديد بضغط الفهرس الرئيسي إلى 1/32 من حجمه الأصلي من خلال التكميم الكمي 1 بت. عند استخدامه مع تنقيح SQ8 الاختياري، يحافظ هذا النهج على جودة بحث عالية (95% استرجاع) باستخدام ربع مساحة الذاكرة الأصلية فقط.</p>
<p>تكشف معاييرنا الأولية عن نتائج واعدة:</p>
<table>
<thead>
<tr><th><strong>مقياس الأداء</strong></th><th><strong>IVF_FLAT التقليدي</strong></th><th><strong>RaBitQ (1 بت) فقط</strong></th><th><strong>RaBitQ (1 بت) + تنقيح SQ8</strong></th></tr>
</thead>
<tbody>
<tr><td>بصمة الذاكرة</td><td>100% (خط الأساس)</td><td>3% (تخفيض بنسبة 97%)</td><td>28% (تخفيض بنسبة 72%)</td></tr>
<tr><td>الاستدعاء</td><td>95.2%</td><td>76.3%</td><td>94.9%</td></tr>
<tr><td>إنتاجية البحث (QPS)</td><td>236</td><td>648 (2.7 × أسرع)</td><td>946 (4× أسرع)</td></tr>
</tbody>
</table>
<p><em>الجدول: تقييم VectorDBBench مع 1 مليون متجه بأبعاد 768، تم اختباره على AWS m6id.2xlarge</em></p>
<p>لا يكمن الإنجاز الحقيقي هنا في تقليل الذاكرة بنسبة 72% فقط، ولكن تحقيق ذلك مع تحقيق تحسن في الإنتاجية بمعدل 4 أضعاف في نفس الوقت. هذا يعني أنه يمكنك خدمة عبء العمل نفسه باستخدام خوادم أقل بنسبة 75% أو التعامل مع حركة مرور أكثر 4 أضعاف على بنيتك التحتية الحالية، كل ذلك دون التضحية بالاستدعاء.</p>
<p>بالنسبة لمستخدمي المؤسسات الذين يستخدمون Milvus المُدارة بالكامل على<a href="https://zilliz.com/cloud"> Zilliz Cloud،</a> فإننا نعمل على تطوير استراتيجية آلية تقوم بضبط معلمات RaBitQ ديناميكيًا بناءً على خصائص عبء العمل ومتطلبات الدقة الخاصة بك. ستستمتع ببساطة بفعالية أكبر من حيث التكلفة عبر جميع أنواع وحدات التخزين السحابية على Zilliz Cloud.</p>
<h3 id="Hot-Cold-Tiered-Storage-50-Cost-Reduction-Through-Intelligent-Data-Placement" class="common-anchor-header">التخزين المتدرج الساخن البارد: تخفيض التكلفة بنسبة 50% من خلال التنسيب الذكي للبيانات</h3><p>تحتوي أعباء عمل البحث المتجه في العالم الحقيقي على بيانات ذات أنماط وصول مختلفة إلى حد كبير. تحتاج البيانات التي يتم الوصول إليها بشكل متكرر إلى توافر فوري، في حين أن البيانات الأرشيفية يمكن أن تتحمل زمن وصول أعلى قليلاً مقابل تكاليف تخزين أقل بشكل كبير.</p>
<p>يقدم الإصدار Milvus 2.6 بنية تخزين متدرجة تصنف البيانات تلقائيًا بناءً على أنماط الوصول وتضعها في مستويات تخزين مناسبة:</p>
<ul>
<li><p><strong>التصنيف الذكي للبيانات</strong>: يحدد Milvus تلقائيًا مقاطع البيانات الساخنة (التي يتم الوصول إليها بشكل متكرر) والباردة (التي نادرًا ما يتم الوصول إليها) بناءً على أنماط الوصول</p></li>
<li><p><strong>وضع التخزين الأمثل</strong>: تظل البيانات الساخنة في الذاكرة/الأقراص الصلبة عالية الأداء، بينما تنتقل البيانات الباردة إلى تخزين كائنات أكثر اقتصاداً</p></li>
<li><p><strong>حركة البيانات الديناميكية</strong>: مع تغير أنماط الاستخدام، تنتقل البيانات تلقائياً بين المستويات</p></li>
<li><p><strong>استرجاع شفاف</strong>: عندما تلمس الاستعلامات البيانات الباردة، يتم تحميلها تلقائيًا عند الطلب</p></li>
</ul>
<p>والنتيجة هي تخفيض يصل إلى 50% في تكاليف التخزين مع الحفاظ على أداء الاستعلام للبيانات النشطة.</p>
<h3 id="Additional-Cost-Optimizations" class="common-anchor-header">تحسينات إضافية في التكلفة</h3><p>يقدم Milvus 2.6 أيضًا دعم متجه Int8 لفهارس HNSW، وتنسيق التخزين v2 للهيكل المحسّن الذي يقلل من IOPS ومتطلبات الذاكرة، وتثبيت أسهل مباشرةً من خلال مديري حزم APT/YUM.</p>
<h2 id="Advanced-Search-Capabilities-Beyond-Basic-Vector-Similarity" class="common-anchor-header">قدرات بحث متقدمة: ما وراء تشابه المتجهات الأساسية<button data-href="#Advanced-Search-Capabilities-Beyond-Basic-Vector-Similarity" class="anchor-icon" translate="no">
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
    </button></h2><p>البحث المتجه وحده لا يكفي لتطبيقات الذكاء الاصطناعي الحديثة. يطلب المستخدمون دقة استرجاع المعلومات التقليدية مقترنةً بالفهم الدلالي لتضمين المتجهات. يقدم Milvus 2.6 مجموعة من ميزات البحث المتقدمة التي تسد هذه الفجوة.</p>
<h3 id="Turbocharged-BM25-400-Faster-Full-Text-Search-Than-Elasticsearch" class="common-anchor-header">BM25 المعزز بشاحن توربيني: بحث عن النص الكامل أسرع بنسبة 400% من Elasticsearch</h3><p>أصبح<a href="https://milvus.io/blog/full-text-search-in-milvus-what-is-under-the-hood.md">البحث</a> في<a href="https://milvus.io/blog/full-text-search-in-milvus-what-is-under-the-hood.md">النص الكامل</a> ضروريًا لبناء أنظمة استرجاع هجينة في قواعد البيانات المتجهة. في الإصدار 2.6 من ميلفوس 2.6، تم إجراء تحسينات كبيرة في الأداء على البحث في النص الكامل، بناءً على تطبيق BM25 الذي تم تقديمه منذ الإصدار 2.5. على سبيل المثال، يقدم هذا الإصدار معلمات جديدة مثل <code translate="no">drop_ratio_search</code> و <code translate="no">dim_max_score_ratio</code> ، مما يعزز الدقة وضبط السرعة ويوفر المزيد من عناصر التحكم في البحث الدقيق.</p>
<p>تُظهِر معاييرنا مقارنةً بمجموعة بيانات BEIR القياسية في المجال أن Milvus 2.6 يحقق إنتاجية أعلى بمقدار 3-4 أضعاف من Elasticsearch بمعدلات استرجاع مكافئة. بالنسبة لأحمال عمل محددة، يصل التحسن إلى 7 أضعاف معدل QPS أعلى من Elasticsearch.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_vs_ES_when_QPS_with_top_K1000_cadd1ac921.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="JSON-Path-Index-100x-Faster-Filtering" class="common-anchor-header">فهرس مسار JSON: تصفية أسرع 100 مرة</h3><p>لقد دعم Milvus نوع بيانات JSON لفترة طويلة، لكن التصفية على حقول JSON كانت بطيئة بسبب عدم وجود دعم للفهرس. يضيف Milvus 2.6 دعمًا لفهرس مسار JSON لتعزيز الأداء بشكل كبير.</p>
<p>فكر في قاعدة بيانات ملف تعريف مستخدم حيث يحتوي كل سجل على بيانات وصفية متداخلة مثل:</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;user&quot;</span>: {
    <span class="hljs-string">&quot;location&quot;</span>: {
      <span class="hljs-string">&quot;city&quot;</span>: <span class="hljs-string">&quot;San Francisco&quot;</span>,
      <span class="hljs-string">&quot;country&quot;</span>: <span class="hljs-string">&quot;USA&quot;</span>
    },
    <span class="hljs-string">&quot;interests&quot;</span>: [<span class="hljs-string">&quot;AI&quot;</span>, <span class="hljs-string">&quot;Databases&quot;</span>, <span class="hljs-string">&quot;Cloud Computing&quot;</span>]
  },
  <span class="hljs-string">&quot;subscription&quot;</span>: {
    <span class="hljs-string">&quot;plan&quot;</span>: <span class="hljs-string">&quot;enterprise&quot;</span>,
    <span class="hljs-string">&quot;status&quot;</span>: <span class="hljs-string">&quot;active&quot;</span>
  }
}
<button class="copy-code-btn"></button></code></pre>
<p>بالنسبة للبحث الدلالي "مستخدمون مهتمون بالذكاء الاصطناعي" الذي يقتصر نطاقه على سان فرانسيسكو فقط، اعتاد Milvus تحليل وتقييم كائن JSON بالكامل لكل سجل، مما يجعل الاستعلام مكلفًا وبطيئًا للغاية.</p>
<p>والآن، يتيح لك Milvus إنشاء فهارس على مسارات محددة داخل حقول JSON لتسريع عملية البحث:</p>
<pre><code translate="no">index_params.add_index(
    field_name=<span class="hljs-string">&quot;metadata&quot;</span>,
    index_type=<span class="hljs-string">&quot;INVERTED&quot;</span>,
    index_name=<span class="hljs-string">&quot;json_index&quot;</span>,
    <span class="hljs-keyword">params</span>={
        <span class="hljs-string">&quot;json_path&quot;</span>: <span class="hljs-string">&quot;metadata[\&quot;user\&quot;][\&quot;location\&quot;][\&quot;city\&quot;]&quot;</span>,  
        <span class="hljs-string">&quot;json_cast_type&quot;</span>: <span class="hljs-string">&quot;varchar&quot;</span>
    }
<button class="copy-code-btn"></button></code></pre>
<p>في اختبار الأداء الذي أجريناه باستخدام أكثر من 100 مليون سجل، قلل فهرس مسار JSON زمن انتقال المرشح من <strong>140 مللي ثانية</strong> (P99: 480 مللي ثانية) إلى <strong>1.5 مللي ثانية</strong> فقط (P99: 10 مللي ثانية) - وهو ما يمثل انخفاضًا في زمن الانتقال بنسبة 99% مما يجعل عمليات البحث هذه عملية في الإنتاج.</p>
<p>هذه الميزة ذات قيمة خاصة لـ</p>
<ul>
<li><p>أنظمة التوصيات ذات تصفية سمات المستخدم المعقدة</p></li>
<li><p>تطبيقات RAG التي تقوم بتصفية المستندات حسب البيانات الوصفية</p></li>
<li><p>الأنظمة متعددة المستأجرين حيث يكون تجزئة البيانات أمرًا بالغ الأهمية</p></li>
</ul>
<h3 id="Enhanced-Text-Processing-and-Time-Aware-Search" class="common-anchor-header">معالجة النصوص المحسنة والبحث المدرك للوقت</h3><p>يقدم الإصدار Milvus 2.6 خط أنابيب لتحليل النصوص تم تجديده بالكامل مع معالجة لغوية متطورة، بما في ذلك أداة لينديرا للرموز الرمزية للغة اليابانية والكورية، وأداة الرمز الرمزي لوحدة المعالجة المركزية لدعم شامل متعدد اللغات، وأداة جايبا المحسّنة مع تكامل القاموس المخصص.</p>
<p>يلتقط<strong>ذكاء مطابقة العبارات</strong> الفوارق الدلالية الدقيقة في ترتيب الكلمات، ويميز بين &quot;تقنيات التعلم الآلي&quot; و&quot;تقنيات آلة التعلم&quot;:</p>
<pre><code translate="no"><span class="hljs-title function_">PHRASE_MATCH</span>(document_text, <span class="hljs-string">&quot;artificial intelligence research&quot;</span>, slop=<span class="hljs-number">1</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>دوال الاضمحلال المدرك للوقت</strong> تعطي الأولوية للمحتوى الجديد تلقائيًا عن طريق تعديل درجات الملاءمة بناءً على عمر المستند، مع معدلات اضمحلال قابلة للتكوين وأنواع الدوال (أسي أو غاوسي أو خطي).</p>
<h3 id="Streamlined-Search-Data-in-Data-Out-Experience" class="common-anchor-header">بحث مبسط: تجربة إدخال البيانات وإخراج البيانات</h3><p>يعد الانفصال بين البيانات الأولية والتضمينات المتجهة نقطة ألم أخرى للمطورين الذين يستخدمون قواعد البيانات المتجهة. قبل أن تصل البيانات إلى Milvus للفهرسة والبحث المتجه، غالبًا ما تخضع البيانات إلى معالجة مسبقة باستخدام نماذج خارجية تقوم بتحويل النص الخام أو الصور أو الصوت إلى تمثيلات متجهة. بعد الاسترجاع، يلزم أيضًا إجراء معالجة نهائية إضافية، مثل إعادة تعيين معرّفات النتائج إلى المحتوى الأصلي.</p>
<p>يعمل الإصدار Milvus 2.6 على تبسيط عمليات سير عمل التضمين هذه من خلال واجهة <strong>الوظيفة</strong> الجديدة التي تدمج نماذج التضمين الخارجية مباشرةً في خط أنابيب البحث. بدلاً من حساب التضمينات مسبقًا، يمكنك الآن:</p>
<ol>
<li><p><strong>إدراج البيانات الأولية مباشرةً</strong>: إرسال نص أو صور أو محتوى آخر إلى ميلفوس</p></li>
<li><p><strong>تكوين موفري التضمين</strong>: الاتصال بخدمات واجهة برمجة تطبيقات التضمين من OpenAI و AWS Bedrock و Google Vertex AI و Hugging Face والمزيد.</p></li>
<li><p><strong>الاستعلام باستخدام اللغة الطبيعية</strong>: البحث باستخدام الاستعلامات النصية الأولية مباشرةً</p></li>
</ol>
<p>يؤدي هذا إلى إنشاء تجربة "إدخال البيانات وإخراج البيانات" حيث يقوم Milvus بتبسيط جميع التحويلات المتجهة من وراء الكواليس من أجلك.</p>
<h2 id="Architectural-Evolution-Scaling-to-Tens-of-Billions-of-Vectors" class="common-anchor-header">التطور المعماري: التوسع إلى عشرات المليارات من المتجهات<button data-href="#Architectural-Evolution-Scaling-to-Tens-of-Billions-of-Vectors" class="anchor-icon" translate="no">
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
    </button></h2><p>يقدّم الإصدار Milvus 2.6 ابتكارات معمارية أساسية تمكّن من التوسع الفعال من حيث التكلفة لعشرات المليارات من المتجهات.</p>
<h3 id="Replacing-Kafka-and-Pulsar-with-a-New-Woodpecker-WAL" class="common-anchor-header">استبدال Kafka وPulsar بـ WAL جديد من نقار الخشب</h3><p>اعتمدت عمليات النشر السابقة ل Milvus على قوائم انتظار الرسائل الخارجية، مثل Kafka أو Pulsar، كنظام سجل الكتابة الأمامي (WAL). وعلى الرغم من أن هذه الأنظمة كانت تعمل بشكل جيد في البداية، إلا أنها أدخلت تعقيدات تشغيلية كبيرة ونفقات زائدة على الموارد.</p>
<p>يقدم Milvus 2.6 نظام <a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md"><strong>Woodpecker،</strong></a> وهو نظام WAL مصمم خصيصًا للسحابة الأصلية والذي يلغي هذه التبعيات الخارجية من خلال تصميم ثوري خالٍ من الأقراص:</p>
<ul>
<li><p><strong>كل شيء على تخزين الكائنات</strong>: يتم تخزين جميع بيانات السجل في وحدة تخزين الكائنات مثل S3 أو Google Cloud Storage أو MinIO</p></li>
<li><p><strong>البيانات الوصفية الموزعة</strong>: لا تزال البيانات الوصفية تدار من قبل مخزن القيمة الرئيسية إلخd</p></li>
<li><p><strong>لا توجد تبعيات أقراص محلية</strong>: خيار للتخلص من البنية المعقدة والنفقات التشغيلية الزائدة المتضمنة في الحالة الدائمة المحلية الموزعة.</p></li>
</ul>
<p>أجرينا معايير شاملة لمقارنة أداء Woodpecker:</p>
<table>
<thead>
<tr><th><strong>النظام</strong></th><th><strong>كافكا</strong></th><th><strong>بولسار</strong></th><th><strong>WP MinIO</strong></th><th><strong>WP Local</strong></th><th><strong>WP S3</strong></th></tr>
</thead>
<tbody>
<tr><td>الإنتاجية</td><td>129.96 ميجابايت/ثانية</td><td>107 ميجابايت/ثانية</td><td>71 ميجابايت/ثانية</td><td>450 ميجابايت/ثانية</td><td>750 ميجابايت/ثانية</td></tr>
<tr><td>الكمون</td><td>58 مللي ثانية</td><td>35 مللي ثانية</td><td>184 مللي ثانية</td><td>1.8 مللي ثانية</td><td>166 مللي ثانية</td></tr>
</tbody>
</table>
<p>يصل Woodpecker باستمرار إلى 60-80% من الحد الأقصى النظري للإنتاجية القصوى لكل واجهة تخزين خلفية مع تحقيق وضع نظام الملفات المحلي 450 ميجابايت/ثانية - أسرع من Kafka بمعدل 3.5 ضعفًا - ووضع S3 بمعدل 750 ميجابايت/ثانية، أي أعلى من Kafka بمعدل 5.8 ضعفًا.</p>
<p>لمزيد من التفاصيل حول Woodpecker، راجع هذه المدونة: <a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">لقد استبدلنا كافكا/بولسار بنقار الخشب لـ Milvus</a>.</p>
<h3 id="Search-Freshness-Achieved-Economically" class="common-anchor-header">تحقيق حداثة البحث بشكل اقتصادي</h3><p>يتطلب البحث في المهام الحرجة عادةً أن تكون البيانات التي تم استيعابها حديثًا قابلة للبحث على الفور. يستبدل الإصدار Milvus 2.6 من ميلفوس 2.6 تبعية طابور الرسائل لتحسين التعامل مع التحديثات الجديدة بشكل أساسي وتوفير نضارة البحث بنفقات أقل للموارد. تضيف البنية الجديدة <strong>عقدة البث</strong> الجديدة، وهي مكون مخصص يعمل بتنسيق وثيق مع مكونات Milvus الأخرى مثل عقدة الاستعلام وعقدة البيانات. بُنيت عقدة التدفق على رأس Woodpecker، وهو نظام سجل الكتابة الأمامي السحابي خفيف الوزن وخاص بنا.</p>
<p>يتيح هذا المكون الجديد:</p>
<ul>
<li><p><strong>توافقاً كبيراً</strong>: يعمل مع كلٍ من Woodpecker WAL الجديد ومتوافق مع الإصدارات السابقة مع Kafka وPulsar ومنصات البث الأخرى</p></li>
<li><p><strong>الفهرسة التزايدية</strong>: تصبح البيانات الجديدة قابلة للبحث على الفور، دون تأخير في الدفعات</p></li>
<li><p><strong>عرض الاستعلام المستمر</strong>: الاستيعاب المتزامن عالي الإنتاجية والاستعلام بزمن تأخير منخفض</p></li>
</ul>
<p>من خلال عزل التدفق عن معالجة الدُفعات، تساعد عقدة التدفق Milvus في الحفاظ على أداء مستقر وتحديث البحث حتى أثناء استيعاب البيانات بكميات كبيرة. تم تصميمها مع وضع قابلية التوسع الأفقي في الاعتبار، حيث تعمل على زيادة سعة العقدة ديناميكيًا بناءً على إنتاجية البيانات.</p>
<h3 id="Enhanced-Multi-tenancy-Capability-Scaling-to-100k-Collections-Per-Cluster" class="common-anchor-header">إمكانية الاستئجار المتعدد المحسّنة: التوسع إلى 100 ألف مجموعة لكل مجموعة</h3><p>غالبًا ما تتطلب عمليات النشر المؤسسية عزلًا على مستوى المستأجرين. يزيد الإصدار Milvus 2.6 من دعم الإيجارات المتعددة بشكل كبير من خلال السماح بما يصل إلى <strong>100,000 مجموعة</strong> لكل مجموعة. يعد هذا تحسينًا مهمًا للمؤسسات التي تدير مجموعة كبيرة متجانسة تخدم العديد من المستأجرين.</p>
<p>وقد أصبح هذا التحسين ممكناً بفضل العديد من التحسينات الهندسية على إدارة البيانات الوصفية وتخصيص الموارد وتخطيط الاستعلام. يمكن لمستخدمي Milvus الآن الاستمتاع بأداء مستقر حتى مع وجود عشرات الآلاف من المجموعات.</p>
<h3 id="Other-Improvements" class="common-anchor-header">تحسينات أخرى</h3><p>يقدم الإصدار Milvus 2.6 المزيد من التحسينات الهندسية، مثل CDC + BulkInsert لتبسيط نسخ البيانات عبر المناطق الجغرافية ودمج التنسيق لتحسين تنسيق المجموعات في عمليات النشر واسعة النطاق.</p>
<h2 id="Getting-Started-with-Milvus-26" class="common-anchor-header">البدء باستخدام Milvus 2.6<button data-href="#Getting-Started-with-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>يمثل الإصدار Milvus 2.6 جهدًا هندسيًا ضخمًا مع عشرات الميزات الجديدة وتحسينات الأداء، تم تطويرها بالتعاون بين مهندسي Zilliz ومساهمي مجتمعنا الرائعين. بينما قمنا بتغطية الميزات الرئيسية هنا، هناك المزيد لاكتشافه. نوصي بشدة بالاطلاع على <a href="https://milvus.io/docs/release_notes.md">ملاحظات الإصدار</a> الشاملة لاستكشاف كل ما يقدمه هذا الإصدار!</p>
<p>تتوفر الوثائق الكاملة وأدلة الترحيل والبرامج التعليمية على<a href="https://milvus.io/"> موقع ميلفوس الإلكتروني</a>. للاستفسارات والدعم المجتمعي، انضم إلى<a href="https://discord.com/invite/8uyFbECzPX"> قناة Discord</a> الخاصة بنا أو قم بتقديم المشكلات على<a href="https://github.com/milvus-io/milvus"> GitHub</a>.</p>
