---
id: >-
  milvus-26-preview-72-memory-reduction-without-compromising-recall-and-4x-faster-than-elasticsearch.md
title: >-
  معاينة Milvus 2.6: تقليل الذاكرة بنسبة 72% دون المساس بالاسترجاع وأسرع 4 مرات
  من Elasticsearch
author: Ken Zhang
date: 2025-05-17T00:00:00.000Z
cover: >-
  assets.zilliz.com/Milvus_2_6_Preview_72_Memory_Reduction_Without_Compromising_Recall_and_4x_Faster_Than_Elasticsearch_c607b644f1.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus 2.6, vector database, vector search, full text search, AI search'
meta_title: >
  Milvus 2.6 Preview: 72% Memory Reduction Without Compromising Recall and 4x
  Faster Than Elasticsearch
desc: >-
  احصل على نظرة أولى حصرية على الابتكارات في الإصدار Milvus 2.6 القادم الذي
  سيعيد تعريف أداء قاعدة بيانات المتجهات وكفاءتها.
origin: >-
  https://milvus.io/blog/milvus-26-preview-72-memory-reduction-without-compromising-recall-and-4x-faster-than-elasticsearch.md
---
<p>على مدار هذا الأسبوع، شاركنا مجموعة من الابتكارات المثيرة في Milvus التي تدفع حدود تكنولوجيا قواعد البيانات المتجهة:</p>
<ul>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">البحث في المتجهات في العالم الحقيقي: كيفية التصفية بكفاءة دون قتل التذكر </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">الارتقاء بضغط المتجهات إلى أقصى الحدود: كيف يخدم ميلفوس 3 أضعاف الاستعلامات باستخدام RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">تكذب المعايير - قواعد بيانات المتجهات تستحق اختبارًا حقيقيًا </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">استبدلنا كافكا/بولسار بنقار الخشب في ميلفوس </a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH في ميلفوس: السلاح السري لمكافحة التكرارات في بيانات تدريب LLM </a></p></li>
</ul>
<p>والآن، بينما نختتم سلسلة أسبوع Milvus، أنا متحمس لإعطائكم لمحة سريعة عما سيأتي في الإصدار Milvus 2.6 - وهو حدث هام في خارطة طريق منتجاتنا لعام 2025 التي هي قيد التطوير حاليًا، وكيف ستغير هذه التحسينات من البحث المدعوم بالذكاء الاصطناعي. يجمع هذا الإصدار القادم كل هذه الابتكارات وأكثر من ذلك عبر ثلاث جبهات مهمة: <strong>تحسين كفاءة التكلفة،</strong> <strong>وإمكانات البحث المتقدمة،</strong> <strong>والبنية الجديدة</strong> التي تدفع البحث المتجه إلى ما بعد 10 مليارات متجه.</p>
<p>دعونا نتعمق في بعض التحسينات الرئيسية التي يمكنك توقعها عند وصول الإصدار Milvus 2.6 في شهر يونيو القادم، بدءاً بما قد يكون الأكثر تأثيراً على الفور: تخفيضات كبيرة في استخدام الذاكرة والتكلفة، والأداء فائق السرعة.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_2_6_Preview_72_Memory_Reduction_Without_Compromising_Recall_and_4x_Faster_Than_Elasticsearch_c607b644f1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Cost-Reduction-Slash-Memory-Usage-While-Boosting-Performance" class="common-anchor-header">تخفيض التكلفة: خفض استخدام الذاكرة مع تعزيز الأداء في الوقت نفسه<button data-href="#Cost-Reduction-Slash-Memory-Usage-While-Boosting-Performance" class="anchor-icon" translate="no">
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
    </button></h2><p>يمثل الاعتماد على الذاكرة المكلفة إحدى أكبر العقبات أمام توسيع نطاق البحث المتجه إلى مليارات السجلات. سيقدم Milvus 2.6 العديد من التحسينات الرئيسية التي تخفض تكاليف البنية التحتية بشكل كبير مع تحسين الأداء.</p>
<h3 id="RaBitQ-1-bit-Quantization-72-Memory-Reduction-with-4×-QPS-and-No-Recall-Loss" class="common-anchor-header">رابت كيو 1 بت التكميم الكمي: تقليل الذاكرة بنسبة 72% مع 4 أضعاف QPS وعدم فقدان الاستدعاء</h3><p>لطالما كان استهلاك الذاكرة هو نقطة ضعف قواعد البيانات المتجهة واسعة النطاق. في حين أن تكميم المتجهات ليس بالأمر الجديد، إلا أن معظم الأساليب الحالية تضحي بالكثير من جودة البحث من أجل توفير الذاكرة. سيعالج Milvus 2.6 هذا التحدي وجهاً لوجه من خلال تقديم<a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md"> تكميم RaBitQ 1 بت</a> في بيئات الإنتاج.</p>
<p>ما يجعل تطبيقنا مميزًا هو قدرة التحسين القابلة للتعديل التي نقوم ببنائها. من خلال تنفيذ فهرس أساسي مع تكميم RaBitQ بالإضافة إلى خيارات التنقيح SQ4/SQ6/SQ8، حققنا التوازن الأمثل بين استخدام الذاكرة وجودة البحث (حوالي 95% من الاسترجاع).</p>
<p>تكشف معاييرنا الأولية عن نتائج واعدة:</p>
<table>
<thead>
<tr><th><strong>مقياس</strong><strong>الأداء</strong> </th><th><strong>IVF_FLAT التقليدي</strong></th><th><strong>RaBitQ (1 بت) فقط</strong></th><th><strong>RaBitQ (1 بت) + SQ8 Refine</strong></th></tr>
</thead>
<tbody>
<tr><td>بصمة الذاكرة</td><td>100% (خط الأساس)</td><td>3% (تخفيض بنسبة 97%)</td><td>28% (تخفيض بنسبة 72%)</td></tr>
<tr><td>جودة الاسترجاع</td><td>95.2%</td><td>76.3%</td><td>94.9%</td></tr>
<tr><td>إنتاجية الاستعلام (QPS)</td><td>236</td><td>648 (2.7 × أسرع)</td><td>946 (4× أسرع)</td></tr>
</tbody>
</table>
<p><em>الجدول: تقييم VectorDBBench مع 1 مليون متجه بأبعاد 768، تم اختباره على AWS m6id.2xlarge</em></p>
<p>الإنجاز الحقيقي هنا ليس فقط تقليل الذاكرة، ولكن تحقيق ذلك مع تحقيق تحسن في الإنتاجية بمعدل 4 أضعاف دون المساس بالدقة. هذا يعني أنك ستتمكن من خدمة عبء العمل نفسه باستخدام خوادم أقل بنسبة 75% أو التعامل مع حركة مرور أكثر 4 أضعاف على بنيتك التحتية الحالية.</p>
<p>بالنسبة للمستخدمين من المؤسسات الذين يستخدمون Milvus المُدار بالكامل على<a href="https://zilliz.com/cloud"> Zilliz Cloud،</a> فإننا نعمل على تطوير ملفات تعريف تهيئة آلية من شأنها ضبط معلمات RaBitQ ديناميكيًا بناءً على خصائص عبء العمل ومتطلبات الدقة الخاصة بك.</p>
<h3 id="400-Faster-Full-text-Search-Than-Elasticsearch" class="common-anchor-header">بحث في النص الكامل أسرع بنسبة 400% من البحث في Elasticsearch</h3><p>أصبحت إمكانات<a href="https://milvus.io/blog/full-text-search-in-milvus-what-is-under-the-hood.md">البحث</a> في<a href="https://milvus.io/blog/full-text-search-in-milvus-what-is-under-the-hood.md">النص الكامل</a> في قواعد البيانات المتجهة ضرورية لبناء أنظمة استرجاع مختلطة. منذ تقديم BM25 في الإصدار <a href="https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md">2.5 من Milvus 2.5،</a> تلقينا ردود فعل متحمسة - إلى جانب طلبات للحصول على أداء أفضل على نطاق واسع.</p>
<p>سيقدم الإصدار Milvus 2.6 مكاسب كبيرة في الأداء على BM25. يُظهر اختبارنا على مجموعة بيانات BEIR إنتاجية أعلى بمقدار 3-4 أضعاف من Elasticsearch بمعدلات استرجاع مكافئة. بالنسبة لبعض أعباء العمل، يصل التحسن إلى 7 أضعاف معدل الأداء في الثانية.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Milvus_vs_Elasticsearch_on_throughput_140b7c1b06.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>الشكل: Milvus مقابل Elasticsearch على الإنتاجية</p>
<h3 id="JSON-Path-Index-99-Lower-Latency-for-Complex-Filtering" class="common-anchor-header">فهرس مسار JSON: زمن انتقال أقل بنسبة 99% للتصفية المعقدة</h3><p>نادرًا ما تعتمد تطبيقات الذكاء الاصطناعي الحديثة على التشابه المتجه وحده - فهي دائمًا ما تجمع بين البحث المتجه وتصفية البيانات الوصفية. عندما تصبح شروط التصفية هذه أكثر تعقيدًا (خاصةً مع كائنات JSON المتداخلة)، يمكن أن يتدهور أداء الاستعلام بسرعة.</p>
<p>سيقدم Milvus 2.6 آلية فهرسة مستهدفة لمسارات JSON المتداخلة التي تسمح لك بإنشاء فهارس على مسارات محددة (على سبيل المثال، <code translate="no">$meta user_info.location</code>) داخل حقول JSON. بدلاً من مسح كائنات كاملة، سيبحث Milvus مباشرةً عن القيم من الفهارس المبنية مسبقًا.</p>
<p>في تقييمنا الذي أجريناه باستخدام أكثر من 100 مليون سجل، قلل فهرس مسار JSON من زمن انتقال المرشح من <strong>140 مللي ثانية</strong> (P99: 480 مللي ثانية) إلى <strong>1.5 مللي ثانية</strong> فقط (P99: 10 مللي ثانية) - وهو ما يمثل انخفاضًا بنسبة 99% سيحول الاستعلامات غير العملية سابقًا إلى استجابات فورية.</p>
<p>ستكون هذه الميزة ذات قيمة خاصة لـ</p>
<ul>
<li><p>أنظمة التوصيات ذات تصفية سمات المستخدم المعقدة</p></li>
<li><p>تطبيقات RAG التي ترشح المستندات حسب تسميات مختلفة</p></li>
</ul>
<h2 id="Next-Generation-Search-From-Basic-Vector-Similarity-to-Production-Grade-Retrieval" class="common-anchor-header">بحث الجيل التالي: من التشابه المتجه الأساسي إلى الاسترجاع على مستوى الإنتاج<button data-href="#Next-Generation-Search-From-Basic-Vector-Similarity-to-Production-Grade-Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><p>البحث المتجه وحده لا يكفي لتطبيقات الذكاء الاصطناعي الحديثة. يطلب المستخدمون دقة استرجاع المعلومات التقليدية جنبًا إلى جنب مع الفهم الدلالي لتضمين المتجهات. سيقدم Milvus 2.6 العديد من ميزات البحث المتقدمة التي تسد هذه الفجوة.</p>
<h3 id="Better-Full-text-Search-with-Multi-language-Analyzer" class="common-anchor-header">بحث أفضل في النص الكامل مع محلل متعدد اللغات</h3><p>البحث في النص الكامل يعتمد بشكل كبير على اللغة... سيقدم Milvus 2.6 خط أنابيب تحليل نصي مُجدَّد بالكامل مع دعم متعدد اللغات:</p>
<ul>
<li><p><code translate="no">RUN_ANALYZER</code> دعم بناء الجملة لملاحظة تكوين المحلّل/الترميز</p></li>
<li><p>أداة ترميز لينديرا للغات الآسيوية مثل اليابانية والكورية</p></li>
<li><p>أداة ترميز ICU لدعم شامل متعدد اللغات</p></li>
<li><p>تكوين اللغة الحبيبي لتحديد قواعد الترميز الخاصة بكل لغة</p></li>
<li><p>جيبا محسّن مع دعم تكامل القاموس المخصص</p></li>
<li><p>خيارات تصفية موسعة لمعالجة أكثر دقة للنصوص</p></li>
</ul>
<p>بالنسبة للتطبيقات العالمية، هذا يعني بحثًا أفضل متعدد اللغات بدون فهرسة متخصصة لكل لغة أو حلول معقدة.</p>
<h3 id="Phrase-Match-Capturing-Semantic-Nuance-in-Word-Order" class="common-anchor-header">مطابقة العبارات: التقاط الفروق الدلالية في ترتيب الكلمات</h3><p>ينقل ترتيب الكلمات فروقاً دلالية حاسمة في المعنى غالباً ما يفوتها البحث بالكلمات الرئيسية. جرّب مقارنة &quot;تقنيات التعلم الآلي&quot; بـ &quot;تقنيات آلة التعلم&quot; - نفس الكلمات، ومعنى مختلف تمامًا.</p>
<p>سيضيف الإصدار Milvus 2.6 <strong>مطابقة العبارات،</strong> مما يمنح المستخدمين مزيدًا من التحكم في ترتيب الكلمات وقربها أكثر من البحث في النص الكامل أو المطابقة التامة للسلسلة:</p>
<pre><code translate="no">PHRASE_MATCH(field_name, phrase, slop)
<button class="copy-code-btn"></button></code></pre>
<p>ستوفر المعلمة <code translate="no">slop</code> تحكمًا مرنًا في تقارب الكلمات - 0 يتطلب مطابقة تامة متتالية، بينما تسمح القيم الأعلى باختلافات طفيفة في الصياغة.</p>
<p>ستكون هذه الميزة ذات قيمة خاصة لـ</p>
<ul>
<li><p>البحث في المستندات القانونية حيث تحمل الصياغة الدقيقة أهمية قانونية</p></li>
<li><p>استرجاع المحتوى التقني حيث يميز ترتيب المصطلحات بين المفاهيم المختلفة</p></li>
<li><p>قواعد بيانات براءات الاختراع حيث يجب مطابقة عبارات تقنية محددة بدقة</p></li>
</ul>
<h3 id="Time-Aware-Decay-Functions-Automatically-Prioritize-Fresh-Content" class="common-anchor-header">وظائف الاضمحلال الواعي بالوقت: إعطاء الأولوية للمحتوى الجديد تلقائيًا</h3><p>غالباً ما تتضاءل قيمة المعلومات مع مرور الوقت. فالمقالات الإخبارية وإصدارات المنتجات والمنشورات الاجتماعية تصبح جميعها أقل أهمية مع تقادمها، ومع ذلك فإن خوارزميات البحث التقليدية تتعامل مع كل المحتوى على قدم المساواة، بغض النظر عن الطابع الزمني.</p>
<p>سيقدم الإصدار Milvus 2.6 <strong>وظائف الاضمحلال</strong> للترتيب المدرك للوقت والتي تقوم تلقائيًا بضبط درجات الملاءمة بناءً على عمر المستند.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/decay_function_210e65f9a0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>ستتمكن من التهيئة:</p>
<ul>
<li><p><strong>نوع الدالة</strong>: أسي (اضمحلال سريع) أو غاوسي (اضمحلال تدريجي) أو خطي (اضمحلال ثابت)</p></li>
<li><p><strong>معدل التضاؤل</strong>: مدى سرعة تضاؤل الأهمية بمرور الوقت</p></li>
<li><p><strong>نقطة الأصل</strong>: الطابع الزمني المرجعي لقياس الفروق الزمنية</p></li>
</ul>
<p>ستضمن عملية إعادة الترتيب الحساسة للوقت هذه ظهور أحدث النتائج ذات الصلة بالسياق أولاً، وهو أمر بالغ الأهمية لأنظمة التوصيات الإخبارية ومنصات التجارة الإلكترونية وموجزات وسائل التواصل الاجتماعي.</p>
<h3 id="Data-in-Data-Out-From-Raw-Text-to-Vector-Search-in-One-Step" class="common-anchor-header">إدخال البيانات، وإخراج البيانات: من النص الخام إلى البحث المتجه في خطوة واحدة</h3><p>كانت إحدى أكبر مشاكل المطورين مع قواعد البيانات المتجهة هي الانفصال بين البيانات الأولية والتضمينات المتجهة. سيعمل الإصدار Milvus 2.6 على تبسيط سير العمل هذا بشكل كبير من خلال واجهة <strong>وظيفية</strong> جديدة تدمج نماذج التضمين من طرف ثالث مباشرةً في خط أنابيب البيانات الخاص بك. يعمل هذا على تبسيط خط أنابيب البحث عن المتجهات بمكالمة واحدة.</p>
<p>بدلاً من حساب التضمينات مسبقًا، ستتمكن من:</p>
<ol>
<li><p><strong>إدراج البيانات الخام مباشرةً</strong>: إرسال نص أو صور أو أي محتوى آخر إلى Milvus</p></li>
<li><p><strong>تكوين موفري التضمين للتضمين المتجه</strong>: يمكن لـ Milvus الاتصال بخدمات نماذج التضمين مثل OpenAI و AWS Bedrock و Google Vertex AI و Hugging Face.</p></li>
<li><p><strong>الاستعلام باستخدام اللغة الطبيعية</strong>: البحث باستخدام الاستعلامات النصية، وليس التضمينات المتجهة</p></li>
</ol>
<p>سيؤدي ذلك إلى إنشاء تجربة "إدخال البيانات وإخراج البيانات" بشكل مبسط، حيث يتعامل Milvus مع توليد المتجهات داخليًا، مما يجعل كود التطبيق الخاص بك أكثر وضوحًا.</p>
<h2 id="Architectural-Evolution-Scaling-to-Hundreds-of-Billions-of-Vectors" class="common-anchor-header">التطور المعماري: التوسع إلى مئات المليارات من المتجهات<button data-href="#Architectural-Evolution-Scaling-to-Hundreds-of-Billions-of-Vectors" class="anchor-icon" translate="no">
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
    </button></h2><p>لا تحتوي قاعدة البيانات الجيدة على ميزات رائعة فحسب، بل يجب أن تقدم هذه الميزات على نطاق واسع، وتم اختبارها في الإنتاج.</p>
<p>سيقدم الإصدار Milvus 2.6 تغييرًا معماريًا أساسيًا يتيح التوسع الفعال من حيث التكلفة لمئات المليارات من المتجهات. أبرز ما في الأمر هو بنية تخزين متدرجة جديدة باردة وساخنة تدير بذكاء وضع البيانات بناءً على أنماط الوصول، وتنقل البيانات الساخنة تلقائيًا إلى ذاكرة/ذاكرة SSD عالية الأداء مع وضع البيانات الباردة في مخزن كائنات أكثر اقتصادًا. يمكن لهذا النهج أن يقلل التكاليف بشكل كبير مع الحفاظ على أداء الاستعلام حيثما كان ذلك أكثر أهمية.</p>
<p>بالإضافة إلى ذلك، ستتيح <a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md#StreamingService-Built-for-Real-Time-Data-Flow">عقدة التدفق</a> الجديدة معالجة المتجهات في الوقت الحقيقي مع التكامل المباشر مع منصات التدفق مثل Kafka وPulsar <a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">وWoodpecker</a> التي تم إنشاؤها حديثًا، مما يجعل البيانات الجديدة قابلة للبحث على الفور دون تأخير في الدُفعات.</p>
<h2 id="Stay-tuned-for-Milvus-26" class="common-anchor-header">ترقبوا ميلفوس 2.6<button data-href="#Stay-tuned-for-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 قيد التطوير النشط حاليًا وسيكون متاحًا في شهر يونيو القادم. نحن متحمسون لنقدم لك هذه التحسينات المتطورة في الأداء، وقدرات البحث المتقدمة، وبنية جديدة لمساعدتك في بناء تطبيقات ذكاء اصطناعي قابلة للتطوير بتكلفة أقل.</p>
<p>في غضون ذلك، نرحب بتعليقاتكم على هذه الميزات القادمة. ما أكثر ما يثير اهتمامك؟ ما هي القدرات الأكثر تأثيراً على تطبيقاتك؟ انضم إلى المحادثة في<a href="https://discord.com/invite/8uyFbECzPX"> قناة Discord</a> الخاصة بنا أو تابع تقدمنا على<a href="https://github.com/milvus-io/milvus"> GitHub</a>.</p>
<p>هل تريد أن تكون أول من يعلم عندما يتم إصدار الإصدار 2.6 من ميلفوس؟ تابعنا على<a href="https://www.linkedin.com/company/zilliz/"> LinkedIn</a> أو<a href="https://twitter.com/milvusio"> X</a> للحصول على آخر التحديثات.</p>
