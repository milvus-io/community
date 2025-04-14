---
id: >-
  introducing-the-milvus-sizing-tool-calculating-and-optimizing-your-milvus-deployment-resources.md
title: 'تقديم أداة تحجيم Milvus: حساب موارد نشر Milvus الخاصة بك وتحسينها'
author: 'Ken Zhang, Fendy Feng'
date: 2025-04-11T00:00:00.000Z
desc: >-
  قم بتعظيم أداء Milvus الخاص بك من خلال أداة التحجيم سهلة الاستخدام! تعرّف على
  كيفية تهيئة عملية النشر للاستخدام الأمثل للموارد وتوفير التكاليف.
cover: assets.zilliz.com/Introducing_Milvus_Sizing_Tool_c0c98343a2.png
tag: Tutorials
recommend: false
canonicalUrl: 'https://zilliz.com/blog/demystify-milvus-sizing-tool'
---
<h2 id="Introduction" class="common-anchor-header">مقدمة<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>يعد اختيار التكوين الأمثل لنشر Milvus الخاص بك أمرًا بالغ الأهمية لتحسين الأداء والاستخدام الفعال للموارد وإدارة التكاليف. سواء كنت تقوم ببناء نموذج أولي أو تخطط لنشر الإنتاج، فإن تحديد الحجم المناسب لمثيل Milvus الخاص بك يمكن أن يعني الفرق بين قاعدة بيانات متجهة تعمل بسلاسة وقاعدة بيانات متجهة تعاني من الأداء أو تتكبد تكاليف غير ضرورية.</p>
<p>لتبسيط هذه العملية، قمنا بتجديد <a href="https://milvus.io/tools/sizing">أداة تحجيم Milvus،</a> وهي آلة حاسبة سهلة الاستخدام تولد تقديرات الموارد الموصى بها بناءً على متطلباتك الخاصة. في هذا الدليل، سنرشدك في هذا الدليل إلى كيفية استخدام الأداة ونقدم لك رؤى أعمق حول العوامل التي تؤثر على أداء Milvus.</p>
<h2 id="How-to-Use-the-Milvus-Sizing-Tool" class="common-anchor-header">كيفية استخدام أداة تحجيم Milvus<button data-href="#How-to-Use-the-Milvus-Sizing-Tool" class="anchor-icon" translate="no">
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
    </button></h2><p>من السهل جداً استخدام أداة التحجيم هذه. ما عليك سوى اتباع الخطوات التالية.</p>
<ol>
<li><p>قم بزيارة صفحة<a href="https://milvus.io/tools/sizing/"> أداة تحجيم ميلفوس</a>.</p></li>
<li><p>أدخل معلماتك الرئيسية:</p>
<ul>
<li><p>عدد المتجهات والأبعاد لكل متجه</p></li>
<li><p>نوع الفهرس</p></li>
<li><p>حجم بيانات الحقل القياسي</p></li>
<li><p>حجم المقطع</p></li>
<li><p>وضع النشر المفضل لديك</p></li>
</ul></li>
<li><p>مراجعة توصيات الموارد التي تم إنشاؤها</p></li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_sizing_tool_3ca881b3d5.jpeg" alt="milvus sizing tool" class="doc-image" id="milvus-sizing-tool" />
   </span> <span class="img-wrapper"> <span>أداة تحجيم ميلفوس</span> </span></p>
<p>دعنا نستكشف كيف تؤثر كل من هذه المعلمات على نشر Milvus الخاص بك.</p>
<h2 id="Index-Selection-Balancing-Storage-Cost-Accuracy-and-Speed" class="common-anchor-header">اختيار الفهرس: الموازنة بين التخزين، والتكلفة، والدقة، والسرعة<button data-href="#Index-Selection-Balancing-Storage-Cost-Accuracy-and-Speed" class="anchor-icon" translate="no">
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
    </button></h2><p>تقدم Milvus العديد من خوارزميات الفهرسات، بما في ذلك <a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">HNSW</a> و FLAT و IVF_FLAT و IVF_SQ8 وSQ8 <a href="https://zilliz.com/learn/what-is-scann-scalable-nearest-neighbors-google">وSkaNN</a> <a href="https://zilliz.com/learn/DiskANN-and-the-Vamana-Algorithm">وDiskANN</a> وغيرها، ولكل منها مقايضات متميزة في استخدام الذاكرة ومتطلبات مساحة القرص وسرعة الاستعلام ودقة البحث.</p>
<p>إليك ما تحتاج إلى معرفته حول الخيارات الأكثر شيوعًا:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/index_dde661d579.jpeg" alt="index" class="doc-image" id="index" />
   </span> <span class="img-wrapper"> <span>الفهرس</span> </span></p>
<p>HNSW (عالم صغير قابل للتنقل الهرمي)</p>
<ul>
<li><p><strong>البنية</strong>: يجمع بين قوائم التخطي مع الرسوم البيانية للعوالم الصغيرة القابلة للتنقل (NSWs) في بنية هرمية</p></li>
<li><p><strong>الأداء</strong>: استعلام سريع للغاية مع معدلات استرجاع ممتازة</p></li>
<li><p><strong>استخدام الموارد</strong>: يتطلب أكبر قدر من الذاكرة لكل متجه (أعلى تكلفة)</p></li>
<li><p><strong>الأفضل ل</strong>: التطبيقات التي تكون فيها السرعة والدقة أمرًا بالغ الأهمية وقيود الذاكرة أقل أهمية</p></li>
<li><p><strong>ملاحظة فنية</strong>: يبدأ البحث من أعلى طبقة ذات أقل عدد من العقد ويمر إلى الأسفل عبر طبقات متزايدة الكثافة</p></li>
</ul>
<p>مسطحة</p>
<ul>
<li><p><strong>البنية</strong>: بحث شامل بسيط بدون تقريب</p></li>
<li><p><strong>الأداء</strong>: استرجاع 100% ولكن أوقات استعلام بطيئة للغاية (<code translate="no">O(n)</code> لحجم البيانات <code translate="no">n</code>)</p></li>
<li><p><strong>استخدام الموارد</strong>: حجم الفهرس يساوي حجم بيانات المتجه الخام</p></li>
<li><p><strong>الأفضل ل</strong>: مجموعات البيانات الصغيرة أو التطبيقات التي تتطلب استرجاعًا مثاليًا</p></li>
<li><p><strong>ملاحظة فنية</strong>: يقوم بإجراء حسابات المسافة الكاملة بين متجه الاستعلام وكل متجه في قاعدة البيانات</p></li>
</ul>
<p>IVF_FLAT</p>
<ul>
<li><p><strong>البنية</strong>: يقسم مساحة المتجه إلى مجموعات للبحث الأكثر كفاءة.</p></li>
<li><p><strong>الأداء</strong>: استرجاع متوسط مرتفع مع سرعة استعلام معتدلة (أبطأ من HNSW ولكن أسرع من FLAT)</p></li>
<li><p><strong>استخدام الموارد</strong>: يتطلب ذاكرة أقل من ذاكرة FLAT ولكن أكثر من HNSW</p></li>
<li><p><strong>الأفضل ل</strong>: التطبيقات المتوازنة حيث يمكن مقايضة بعض الاسترجاع بأداء أفضل</p></li>
<li><p><strong>ملحوظة فنية</strong>: أثناء البحث، يتم فحص <code translate="no">nlist</code> مجموعة فقط أثناء البحث، مما يقلل من الحساب بشكل كبير</p></li>
</ul>
<p>IVF_SQ8</p>
<ul>
<li><p><strong>البنية</strong>: تطبق التكميم الكمي القياسي على IVF_SQ8، وتضغط البيانات المتجهة</p></li>
<li><p><strong>الأداء</strong>: استرجاع متوسط مع سرعة استعلام متوسطة عالية</p></li>
<li><p><strong>استخدام الموارد</strong>: يقلل من استهلاك الأقراص والحساب والذاكرة بنسبة 70-75% مقارنةً ب IVF_FLAT</p></li>
<li><p><strong>الأفضل ل</strong>: البيئات المحدودة الموارد حيث يمكن أن تتأثر الدقة قليلاً</p></li>
<li><p><strong>ملاحظة فنية</strong>: يضغط قيم الفاصلة العائمة 32 بت إلى قيم صحيحة 8 بت</p></li>
</ul>
<h3 id="Advanced-Index-Options-ScaNN-DiskANN-CAGRA-and-more" class="common-anchor-header">خيارات الفهرس المتقدمة: ScaNN و DiskANN و CAGRA والمزيد</h3><p>للمطورين ذوي المتطلبات المتخصصة، تقدم Milvus أيضًا:</p>
<ul>
<li><p><a href="https://zilliz.com/learn/what-is-scann-scalable-nearest-neighbors-google"><strong>ScaNN</strong></a>: أسرع بنسبة 20٪ على وحدة المعالجة المركزية من HNSW بمعدلات استدعاء مماثلة</p></li>
<li><p><a href="https://milvus.io/docs/disk_index.md"><strong>DiskANN</strong></a>: فهرس قرص/ذاكرة هجين مثالي عندما تحتاج إلى دعم عدد كبير من المتجهات مع استدعاء عالٍ ويمكنه قبول زمن انتقال أطول قليلاً (حوالي 100 مللي ثانية). وهو يوازن بين استخدام الذاكرة والأداء من خلال الاحتفاظ بجزء فقط من الفهرس في الذاكرة بينما يبقى الباقي على القرص.</p></li>
<li><p><strong>الفهارس القائمة على وحدة معالجة الرسومات</strong>:</p>
<ul>
<li><p><a href="https://zilliz.com/blog/Milvus-introduces-GPU-index-CAGRA">GPU_CAGRA</a>: هذا هو أسرع فهارس وحدة معالجة الرسومات، لكنه يتطلب بطاقة استدلالية بذاكرة GDDR بدلاً من بطاقة بذاكرة HBM</p></li>
<li><p>gpu_brute_force: البحث الشامل المنفذ على وحدة معالجة الرسومات</p></li>
<li><p>GPU_IVF_FLAT: نسخة معجّلة بوحدة معالجة الرسومات من IVF_FLAT</p></li>
<li><p>GPU_IVF_PQ: نسخة مسرعة بوحدة معالجة الرسومات من IVF مع <a href="https://zilliz.com/learn/harnessing-product-quantization-for-memory-efficiency-in-vector-databases">تحديد كمية المنتج</a></p></li>
</ul></li>
<li><p><strong>HNSW_PQ_SQ/PSQ</strong>:</p>
<ul>
<li><p><strong>HNSW_SQ</strong>: استعلام عالي السرعة جدًا، موارد ذاكرة محدودة؛ يقبل تنازلاً بسيطًا في معدل الاسترجاع.</p></li>
<li><p><strong>HNSW_PQ</strong>: استعلام متوسط السرعة؛ موارد ذاكرة محدودة للغاية؛ يقبل حل وسط طفيف في معدل الاسترجاع</p></li>
<li><p><strong>HNSW_PRQ</strong>: استعلام متوسط السرعة؛ موارد ذاكرة محدودة جداً؛ يقبل تنازلاً طفيفاً في معدل الاستدعاء</p></li>
<li><p><strong>AUTOINDEX</strong>: افتراضيًا إلى HNSW في ميلفوس مفتوح المصدر (أو يستخدم فهارس خاصة ذات أداء أعلى في <a href="https://zilliz.com/cloud">Zilliz Cloud،</a> ميلفوس المُدار).</p></li>
</ul></li>
<li><p><strong>الفهارس الثنائية والمتناثرة وغيرها من الفهارس المتخصصة</strong>: لأنواع بيانات وحالات استخدام محددة. راجع <a href="https://milvus.io/docs/index.md">صفحة مستند الفهرس هذه</a> لمزيد من التفاصيل.</p></li>
</ul>
<h2 id="Segment-Size-and-Deployment-Configuration" class="common-anchor-header">حجم الشريحة وتهيئة النشر<button data-href="#Segment-Size-and-Deployment-Configuration" class="anchor-icon" translate="no">
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
    </button></h2><p>الشرائح هي اللبنات الأساسية لتنظيم البيانات الداخلية في ميلفوس. وهي تعمل كقطع بيانات تمكّن البحث الموزع وموازنة التحميل عبر النشر الخاص بك. تقدم أداة تحجيم Milvus ثلاثة خيارات لحجم المقطع (512 ميجابايت، 1024 ميجابايت، 2048 ميجابايت)، مع 1024 ميجابايت كخيار افتراضي.</p>
<p>فهم الشرائح أمر بالغ الأهمية لتحسين الأداء. كمبدأ توجيهي عام:</p>
<ul>
<li><p>شرائح بحجم 512 ميغابايت: الأفضل لعقد الاستعلام ذات ذاكرة 4-8 جيجابايت</p></li>
<li><p>شرائح 1 جيجابايت: الأمثل لعُقد الاستعلام ذات الذاكرة 8-16 جيجابايت: الأفضل لعُقد الاستعلام ذات الذاكرة 8-16 جيجابايت</p></li>
<li><p>2 غيغابايت من المقاطع: موصى به لعقد الاستعلام بذاكرة أكبر من 16 جيجابايت</p></li>
</ul>
<p>نظرة ثاقبة للمطورين: عادةً ما توفر المقاطع الأقل حجماً والأكبر حجماً أداء بحث أسرع. بالنسبة لعمليات النشر واسعة النطاق، غالبًا ما توفر المقاطع بسعة 2 جيجابايت أفضل توازن بين كفاءة الذاكرة وسرعة الاستعلام.</p>
<h2 id="Message-Queue-System-Selection" class="common-anchor-header">اختيار نظام قائمة انتظار الرسائل<button data-href="#Message-Queue-System-Selection" class="anchor-icon" translate="no">
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
    </button></h2><p>عند الاختيار بين نظامي Pulsar وKafka كنظام مراسلة:</p>
<ul>
<li><p><strong>بولسار</strong>: يوصى به للمشاريع الجديدة بسبب انخفاض النفقات العامة لكل موضوع وقابلية التوسع الأفضل</p></li>
<li><p><strong>كافكا</strong>: قد يكون مفضلاً إذا كان لديك بالفعل خبرة في كافكا أو بنية تحتية في مؤسستك</p></li>
</ul>
<h2 id="Enterprise-Optimizations-in-Zilliz-Cloud" class="common-anchor-header">تحسينات المؤسسة في زيليز كلاود<button data-href="#Enterprise-Optimizations-in-Zilliz-Cloud" class="anchor-icon" translate="no">
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
    </button></h2><p>لعمليات نشر الإنتاج ذات المتطلبات الصارمة للأداء، يوفر Zilliz Cloud (الإصدار المُدار بالكامل للمؤسسات من Milvus على السحابة) تحسينات إضافية في الفهرسة والتكميم:</p>
<ul>
<li><p><strong>منع نفاد الذاكرة (OOM):</strong> إدارة متطورة للذاكرة لمنع حدوث أعطال خارج الذاكرة</p></li>
<li><p><strong>تحسين الضغط</strong>: تحسين أداء البحث واستخدام الموارد</p></li>
<li><p><strong>التخزين المتدرج</strong>: إدارة البيانات الساخنة والباردة بكفاءة مع وحدات الحوسبة المناسبة</p>
<ul>
<li><p>وحدات الحوسبة القياسية (CUs) للبيانات التي يتم الوصول إليها بشكل متكرر</p></li>
<li><p>وحدات تخزين متدرجة (CUs) للتخزين الفعال من حيث التكلفة للبيانات التي يندر الوصول إليها</p></li>
</ul></li>
</ul>
<p>للاطلاع على خيارات التحجيم التفصيلية للمؤسسات، تفضل بزيارة<a href="https://docs.zilliz.com/docs/select-zilliz-cloud-service-plans"> وثائق خطط خدمة Zilliz Cloud</a>.</p>
<h2 id="Advanced-Configuration-Tips-for-Developers" class="common-anchor-header">نصائح التكوين المتقدمة للمطورين<button data-href="#Advanced-Configuration-Tips-for-Developers" class="anchor-icon" translate="no">
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
<li><p><strong>أنواع الفهارس المتعددة</strong>: تركز أداة التحجيم على فهرس واحد. بالنسبة للتطبيقات المعقدة التي تتطلب خوارزميات فهرس مختلفة لمجموعات مختلفة، قم بإنشاء مجموعات منفصلة بتكوينات مخصصة.</p></li>
<li><p><strong>تخصيص الذاكرة</strong>: عند التخطيط للنشر الخاص بك، ضع في الحسبان كلاً من البيانات المتجهة ومتطلبات ذاكرة الفهرس. يتطلب HNSW عادةً 2-3 أضعاف ذاكرة بيانات المتجه الخام.</p></li>
<li><p><strong>اختبار الأداء</strong>: قبل وضع اللمسات الأخيرة على التهيئة الخاصة بك، قم بقياس أنماط الاستعلام الخاصة بك على مجموعة بيانات تمثيلية.</p></li>
<li><p><strong>اعتبارات النطاق</strong>: ضع في اعتبارك النمو المستقبلي. من الأسهل البدء بموارد أكثر بقليل من إعادة التكوين لاحقًا.</p></li>
</ol>
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
    </button></h2><p>توفر<a href="https://milvus.io/tools/sizing/"> أداة Milvus Sizing Tool</a> نقطة بداية ممتازة لتخطيط الموارد، ولكن تذكر أن كل تطبيق له متطلبات فريدة من نوعها. للحصول على الأداء الأمثل، ستحتاج إلى ضبط التكوين الخاص بك بناءً على خصائص عبء العمل وأنماط الاستعلام واحتياجات التوسع.</p>
<p>نحن نعمل باستمرار على تحسين أدواتنا ووثائقنا بناءً على ملاحظات المستخدمين. إذا كانت لديك أسئلة أو كنت بحاجة إلى مزيد من المساعدة في تحديد حجم نشر Milvus الخاص بك، تواصل مع مجتمعنا على<a href="https://github.com/milvus-io/milvus/discussions"> GitHub</a> أو<a href="https://discord.com/invite/8uyFbECzPX"> Discord</a>.</p>
<h2 id="References" class="common-anchor-header">المراجع<button data-href="#References" class="anchor-icon" translate="no">
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
<li><p><a href="https://thesequence.substack.com/p/guest-post-choosing-the-right-vector">اختيار الفهرس المتجه المناسب لمشروعك</a></p></li>
<li><p><a href="https://milvus.io/docs/index.md?tab=floating">الفهرس داخل الذاكرة | وثائق ملفوس</a></p></li>
<li><p><a href="https://zilliz.com/blog/Milvus-introduces-GPU-index-CAGRA">كشف النقاب عن Milvus CAGRA: رفع مستوى البحث في المتجهات باستخدام فهرسة وحدة معالجة الرسومات</a></p></li>
<li><p><a href="https://zilliz.com/pricing#estimate_your_cost">حاسبة تسعير Zilliz السحابية</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md">كيف تبدأ مع ميلفوس </a></p></li>
<li><p><a href="https://docs.zilliz.com/docs/resource-planning">تخطيط الموارد السحابية |سحابة |مركز مطوري سحابة زيليز</a></p></li>
</ul>
