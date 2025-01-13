---
id: deep-dive-8-knowhere.md
title: ما هي قوى البحث عن التشابه في قاعدة بيانات متجهات ميلفوس؟
author: Yudong Cai
date: 2022-05-10T00:00:00.000Z
desc: ولا، إنه ليس فايس.
cover: assets.zilliz.com/Deep_Dive_8_6919720d59.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-8-knowhere.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deep_Dive_8_6919720d59.png" alt="cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>صورة الغلاف</span> </span></p>
<blockquote>
<p>هذا المقال بقلم <a href="https://github.com/cydrain">يودونغ كاي</a> وترجمة <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">أنجيلا ني</a>.</p>
</blockquote>
<p>بصفته محرك التنفيذ المتجه الأساسي، فإن نوير بالنسبة لميلفوس هو ما يمثله المحرك بالنسبة للسيارة الرياضية. يقدم هذا المنشور ماهية نوير، وكيف يختلف عن فايس، وكيف يتم تنظيم كود نوير.</p>
<p><strong>انتقل إلى:</strong></p>
<ul>
<li><a href="#The-concept-of-Knowhere">مفهوم نوير في نوير</a></li>
<li><a href="#Knowhere-in-the-Milvus-architecture">نوير في بنية ميلفوس</a></li>
<li><a href="#Knowhere-Vs-Faiss">نوير مقابل فايس</a></li>
<li><a href="#Understanding-the-Knowhere-code">فهم كود نوير</a></li>
<li><a href="#Adding-indexes-to-Knowhere">إضافة فهارس إلى "نوير</a></li>
</ul>
<h2 id="The-concept-of-Knowhere" class="common-anchor-header">مفهوم نوير في أي مكان<button data-href="#The-concept-of-Knowhere" class="anchor-icon" translate="no">
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
    </button></h2><p>بشكل ضيق، نوير هو واجهة تشغيل للوصول إلى الخدمات في الطبقات العليا من النظام ومكتبات البحث عن التشابه المتجه مثل <a href="https://github.com/facebookresearch/faiss">Faiss</a> و <a href="https://github.com/nmslib/hnswlib">Hnswlib</a> و <a href="https://github.com/spotify/annoy">Annoy</a> في الطبقات السفلى من النظام. بالإضافة إلى ذلك، فإن Knowhere مسؤول أيضًا عن الحوسبة غير المتجانسة. وبشكل أكثر تحديدًا، يتحكم نوهير في الأجهزة (مثل وحدة المعالجة المركزية أو وحدة معالجة الرسومات) لتنفيذ طلبات بناء الفهرس والبحث. هذه هي الطريقة التي حصلت بها نوير على اسمها - معرفة مكان تنفيذ العمليات. سيتم دعم المزيد من أنواع الأجهزة بما في ذلك DPU و TPU في الإصدارات المستقبلية.</p>
<p>وبمعنى أوسع، يشتمل نوير أيضًا على مكتبات فهرسة أخرى تابعة لجهات خارجية مثل Faiss. لذلك، ككل، يتم التعرف على Knowhere كمحرك أساسي لحساب المتجهات في قاعدة بيانات Milvus المتجهة.</p>
<p>من مفهوم Knowhere، يمكننا أن نرى أنه يعالج فقط مهام حوسبة البيانات، في حين أن تلك المهام مثل التجزئة وتوازن التحميل واستعادة البيانات بعد الكوارث تقع خارج نطاق عمل Knowhere.</p>
<p>بدءاً من الإصدار 2.0.1 من ميلفوس 2.0.1، يصبح <a href="https://github.com/milvus-io/knowhere">نوير</a> (بالمعنى الأوسع) مستقلاً عن مشروع ميلفوس.</p>
<h2 id="Knowhere-in-the-Milvus-architecture" class="common-anchor-header">نوير في بنية ميلفوس<button data-href="#Knowhere-in-the-Milvus-architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/ec63d1e9_86e1_48e3_9d75_8fed305bbcb5_26b842e9f6.png" alt="knowhere architecture" class="doc-image" id="knowhere-architecture" />
   </span> <span class="img-wrapper"> <span>بنية نولفير</span> </span></p>
<p>تتضمن العمليات الحسابية في ميلفوس بشكل أساسي العمليات المتجهة والقياسية. يتعامل نوير فقط مع العمليات على المتجهات في ملفوس. يوضح الشكل أعلاه بنية نوير في ميلفوس.</p>
<p>الطبقة السفلية هي أجهزة النظام. توجد مكتبات الفهرس التابعة لجهة خارجية فوق الأجهزة. ثم يتفاعل Knowhere مع عقدة الفهرس وعقدة الاستعلام في الأعلى عبر CGO.</p>
<p>تتحدث هذه المقالة عن نوير بمعناه الأوسع، كما هو محدد داخل الإطار الأزرق في الرسم التوضيحي للبنية.</p>
<h2 id="Knowhere-Vs-Faiss" class="common-anchor-header">نوير مقابل فايس<button data-href="#Knowhere-Vs-Faiss" class="anchor-icon" translate="no">
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
    </button></h2><p>لا يقتصر دور Knowhere على توسيع وظائف Faiss فحسب، بل يعمل أيضًا على تحسين الأداء. وبشكل أكثر تحديدًا، يتمتع نوير بالمزايا التالية.</p>
<h3 id="1-Support-for-BitsetView" class="common-anchor-header">1. دعم BitsetView</h3><p>في البداية، تم تقديم مجموعة البتات في Milvus لغرض &quot;الحذف الناعم&quot;. لا يزال المتجه المحذوف حذفًا ناعمًا موجودًا في قاعدة البيانات ولكن لن يتم حسابه أثناء البحث أو الاستعلام عن تشابه المتجهات. يتوافق كل بت في مجموعة البتات مع متجه مفهرس. إذا تم وضع علامة "1" على أحد المتجهات في مجموعة البتات، فهذا يعني أن هذا المتجه محذوف بشكل ناعم ولن يتم تضمينه أثناء البحث عن المتجهات.</p>
<p>تتم إضافة معلمات مجموعة البتات إلى جميع واجهات برمجة تطبيقات استعلام فهرس فايس المكشوفة في نوير، بما في ذلك فهارس وحدة المعالجة المركزية ووحدة معالجة الرسومات.</p>
<p>تعرف على المزيد حول <a href="https://milvus.io/blog/2022-2-14-bitset.md">كيفية تمكين مجموعة البتات من تعدد استخدامات البحث المتجه</a>.</p>
<h3 id="2-Support-for-more-similarity-metrics-for-indexing-binary-vectors" class="common-anchor-header">2. دعم المزيد من مقاييس التشابه لفهرسة المتجهات الثنائية</h3><p>بالإضافة إلى <a href="https://milvus.io/docs/v2.0.x/metric.md#Hamming-distance">هامينغ،</a> يدعم نوهير أيضًا <a href="https://milvus.io/docs/v2.0.x/metric.md#Jaccard-distance">Jaccard</a> <a href="https://milvus.io/docs/v2.0.x/metric.md#Tanimoto-distance">وTanimoto و</a>Tanimoto <a href="https://milvus.io/docs/v2.0.x/metric.md#Substructure">وSupstructure وSubstructure</a>. يمكن استخدام Jaccard وTanimoto لقياس التشابه بين مجموعتين من العينات بينما يمكن استخدام البنية الفائقة والبنية الفرعية لقياس تشابه البنى الكيميائية.</p>
<h3 id="3-Support-for-AVX512-instruction-set" class="common-anchor-header">3. دعم مجموعة تعليمات AVX512</h3><p>يدعم فايس نفسه مجموعات تعليمات متعددة بما في ذلك <a href="https://en.wikipedia.org/wiki/AArch64">AArch64،</a> <a href="https://en.wikipedia.org/wiki/SSE4#SSE4.2">SSE4.2،</a> <a href="https://en.wikipedia.org/wiki/Advanced_Vector_Extensions">AVX2</a>. يوسع Knowhere مجموعات التعليمات المدعومة عن طريق إضافة <a href="https://en.wikipedia.org/wiki/AVX-512">AVX512،</a> والتي يمكن أن <a href="https://milvus.io/blog/milvus-performance-AVX-512-vs-AVX2.md">تحسن أداء بناء الفهرس والاستعلام بنسبة 20% إلى 30%</a> مقارنةً ب AVX2.</p>
<h3 id="4-Automatic-SIMD-instruction-selection" class="common-anchor-header">4. الاختيار التلقائي لتعليمات SIMD</h3><p>تم تصميم Knowhere ليعمل بشكل جيد على مجموعة واسعة من معالجات وحدة المعالجة المركزية (سواءً في المنصات المحلية أو السحابية) مع تعليمات SIMD مختلفة (على سبيل المثال، SIMD SSE و AVX و AVX2 و AVX512). وبالتالي، فإن التحدي هو، بالنظر إلى جزء واحد من برنامج ثنائي البرمجيات (أي Milvus)، كيف يمكن جعله يستدعي تلقائيًا تعليمات SIMD المناسبة على أي معالج وحدة المعالجة المركزية؟ لا يدعم Faiss الاختيار التلقائي لتعليمات SIMD ويحتاج المستخدمون إلى تحديد علامة SIMD يدويًا (على سبيل المثال، "-msse4") أثناء التحويل البرمجي. ومع ذلك، تم بناء Knowhere من خلال إعادة هيكلة قاعدة كود Faiss. يتم تحليل الدوال الشائعة (على سبيل المثال، حوسبة التشابه) التي تعتمد على تسريع SIMD. ثم يتم تنفيذ أربعة إصدارات لكل دالة (أي SSE، AVX، AVX2، AVX512) ويتم وضع كل منها في ملف مصدر منفصل. ثم يتم تجميع الملفات المصدرية بشكل فردي مع علامة SIMD المقابلة. لذلك، في وقت التشغيل، يمكن ل Knowhere اختيار تعليمات SIMD الأنسب تلقائيًا في وقت التشغيل بناءً على علامات وحدة المعالجة المركزية الحالية ثم ربط مؤشرات الدالة الصحيحة باستخدام التثبيت.</p>
<h3 id="5-Other-performance-optimization" class="common-anchor-header">5. تحسينات أخرى للأداء</h3><p>اقرأ <a href="https://www.cs.purdue.edu/homes/csjgwang/pubs/SIGMOD21_Milvus.pdf">ميلفوس: نظام إدارة بيانات المتجهات المصمم لغرض معين</a> لمعرفة المزيد عن تحسين أداء نوهير.</p>
<h2 id="Understanding-the-Knowhere-code" class="common-anchor-header">فهم كود نوير<button data-href="#Understanding-the-Knowhere-code" class="anchor-icon" translate="no">
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
    </button></h2><p>كما ذكرنا في القسم الأول، يتعامل نوير مع عمليات البحث عن المتجهات فقط. لذلك، يعالج Knowhere فقط الحقل المتجه للكيان (حاليًا، يتم دعم حقل متجه واحد فقط للكيانات في المجموعة). يستهدف بناء الفهرس والبحث عن تشابه المتجهات أيضاً الحقل المتجه في مقطع ما. للحصول على فهم أفضل لنموذج البيانات، اقرأ المدونة <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Data-Model">هنا</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Entity_fields_6aa517cc4c.png" alt="entity fields" class="doc-image" id="entity-fields" />
   </span> <span class="img-wrapper"> <span>حقول الكيانات</span> </span></p>
<h3 id="Index" class="common-anchor-header">الفهرس</h3><p>الفهرس هو نوع من بنية البيانات المستقلة عن البيانات المتجهة الأصلية. وتتطلب الفهرسة أربع خطوات: إنشاء فهرس، وتدريب البيانات، وإدراج البيانات، وإنشاء فهرس.</p>
<p>بالنسبة لبعض تطبيقات الذكاء الاصطناعي، يعد تدريب مجموعة البيانات عملية مستقلة عن البحث عن المتجهات. في هذا النوع من التطبيقات، يتم تدريب البيانات من مجموعات البيانات أولاً ثم إدراجها في قاعدة بيانات متجهة مثل Milvus للبحث عن التشابه. توفر مجموعات البيانات المفتوحة مثل sift1M و sift1B بيانات للتدريب والاختبار. ومع ذلك، في Knowhere، يتم خلط بيانات التدريب والبحث معًا. وهذا يعني أن نوهير يقوم بتدريب جميع البيانات في مقطع ما ثم يقوم بإدراج جميع البيانات المدربة وإنشاء فهرس لها.</p>
<h3 id="Knowhere-code-structure" class="common-anchor-header">هيكل كود نوير</h3><p>DataObj هي الفئة الأساسية لكل بنية البيانات في نوير. <code translate="no">Size()</code> هي الطريقة الافتراضية الوحيدة في DataObj. يرث صنف الفهرس من DataObj مع حقل يسمى &quot;size_&quot;. تحتوي فئة الفهرس أيضًا على طريقتين افتراضيتين - <code translate="no">Serialize()</code> و <code translate="no">Load()</code>. فئة VecIndex المشتقة من الفهرس هي الفئة الأساسية الافتراضية لجميع فهارس المتجهات. توفر VecIndex طرقًا تتضمن <code translate="no">Train()</code> و <code translate="no">Query()</code> و <code translate="no">GetStatistics()</code> و <code translate="no">ClearStatistics()</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Knowhere_base_classes_9d610618d9.png" alt="base clase" class="doc-image" id="base-clase" />
   </span> <span class="img-wrapper"> <span>الفئة الأساسية</span> </span></p>
<p>يتم سرد أنواع الفهارس الأخرى على اليمين في الشكل أعلاه.</p>
<ul>
<li>يحتوي فهرس فايس على فئتين فرعيتين: فهرس FaissBaseIndex لجميع الفهارس على متجهات النقطة العائمة، وفهرس FaissBaseBinaryIndex لجميع الفهارس على المتجهات الثنائية.</li>
<li>GPUIndex هي الفئة الأساسية لجميع فهارس Faiss GPU.</li>
<li>OffsetBaseBaseIndex هي الفئة الأساسية لجميع الفهارس المطورة ذاتيًا. يتم تخزين معرف المتجه فقط في ملف الفهرس. ونتيجة لذلك، يمكن تقليل حجم ملف الفهرس للمتجهات ذات الـ 128 بُعدًا بمقدار 2 من حيث الحجم. نوصي بأخذ المتجهات الأصلية في الاعتبار أيضًا عند استخدام هذا النوع من الفهرس للبحث عن تشابه المتجهات.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/IDMAP_8773a4511c.png" alt="IDMAP" class="doc-image" id="idmap" />
   </span> <span class="img-wrapper"> <span>IDMAP</span> </span></p>
<p>من الناحية الفنية، <a href="https://github.com/facebookresearch/faiss/wiki/Guidelines-to-choose-an-index#then-flat">IDMAP</a> ليس فهرسًا، بل يُستخدم للبحث بالقوة الغاشمة. عندما يتم إدراج المتجهات في قاعدة بيانات المتجهات، لا يلزم تدريب البيانات وبناء الفهرس. سيتم إجراء عمليات البحث مباشرةً على بيانات المتجهات المدرجة.</p>
<p>ومع ذلك، من أجل اتساق الكود، يرث IDMAP أيضًا من فئة VecIndex بجميع واجهاتها الافتراضية. استخدام IDMAP هو نفسه استخدام الفهارس الأخرى.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/IVF_42b0f123d1.png" alt="IVF" class="doc-image" id="ivf" />
   </span> <span class="img-wrapper"> <span>IVF</span> </span></p>
<p>فهارس IVF (الملف المقلوب) هي الأكثر استخدامًا. وفئة IVF مشتقة من VecIndex وFaissBaseIndex، وتمتد كذلك إلى IVFSQ وIVFPQ. يشتق GPUIVF من GPUIndex وIVF. ثم يمتد GPUIVF كذلك إلى GPUIVFSQ وGPUIVFPQ.</p>
<p>IVFSQHybrid هي فئة للفهرس الهجين المطور ذاتيًا الذي يتم تنفيذه بواسطة التكميم الخشن على وحدة معالجة الرسومات. ويتم تنفيذ البحث في الدلو على وحدة المعالجة المركزية. يمكن أن يقلل هذا النوع من الفهرس من حدوث نسخ الذاكرة بين وحدة المعالجة المركزية ووحدة معالجة الرسومات من خلال الاستفادة من قوة الحوسبة لوحدة معالجة الرسومات. يحتوي IVFSQHybrid على نفس معدل الاستدعاء مثل GPUIVFSQ ولكنه يأتي بأداء أفضل.</p>
<p>بنية الفئة الأساسية للفهارس الثنائية أبسط نسبيًا. يتم اشتقاق BinaryIDMAP و BinaryIVF من FaissBaseBinaryBinaryIndex و VecIndex.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/third_party_index_34ad029848.png" alt="third-party index" class="doc-image" id="third-party-index" />
   </span> <span class="img-wrapper"> <span>فهرس الطرف الثالث</span> </span></p>
<p>في الوقت الحالي، هناك نوعان فقط من فهارس الطرف الثالث مدعومان باستثناء فهرس فايس: الفهرس القائم على الشجرة Annoy، والفهرس القائم على الرسم البياني HNSW. هذان الفهرسان الخارجيان الشائعان والمستخدمان بشكل متكرر كلاهما مشتقان من VecIndex.</p>
<h2 id="Adding-indexes-to-Knowhere" class="common-anchor-header">إضافة فهارس إلى "نوير<button data-href="#Adding-indexes-to-Knowhere" class="anchor-icon" translate="no">
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
    </button></h2><p>إذا كنت تريد إضافة فهارس جديدة إلى نوير، يمكنك الرجوع إلى الفهارس الموجودة أولاً:</p>
<ul>
<li>لإضافة فهرس قائم على الكمية، ارجع إلى IVF_FLAT.</li>
<li>لإضافة فهرس قائم على الرسم البياني، ارجع إلى HNSW.</li>
<li>لإضافة فهرس مستند إلى الشجرة، ارجع إلى أنوي.</li>
</ul>
<p>بعد الرجوع إلى الفهرس الموجود، يمكنك اتباع الخطوات أدناه لإضافة فهرس جديد إلى نوير.</p>
<ol>
<li>أضف اسم الفهرس الجديد في <code translate="no">IndexEnum</code>. نوع البيانات هو سلسلة.</li>
<li>أضف فحص التحقق من صحة البيانات على الفهرس الجديد في الملف <code translate="no">ConfAdapter.cpp</code>. التحقق من الصحة هو بشكل أساسي للتحقق من صحة المعلمات لتدريب البيانات والاستعلام.</li>
<li>قم بإنشاء ملف جديد للفهرس الجديد. يجب أن تتضمن الفئة الأساسية للفهرس الجديد <code translate="no">VecIndex</code> ، والواجهة الافتراضية اللازمة <code translate="no">VecIndex</code>.</li>
<li>أضف منطق بناء الفهرس للفهرس الجديد في <code translate="no">VecIndexFactory::CreateVecIndex()</code>.</li>
<li>أضف اختبار الوحدة ضمن الدليل <code translate="no">unittest</code>.</li>
</ol>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">حول سلسلة الغوص العميق<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>مع <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">الإعلان الرسمي عن التوفر العام</a> لميلفوس 2.0، نظمنا سلسلة مدونات الغوص العميق هذه لتقديم تفسير متعمق لبنية ميلفوس وكود المصدر. تشمل الموضوعات التي تتناولها سلسلة المدونات هذه ما يلي:</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">نظرة عامة على بنية ميلفوس</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">واجهات برمجة التطبيقات وحزم تطوير البرمجيات بايثون</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">معالجة البيانات</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">إدارة البيانات</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">الاستعلام في الوقت الحقيقي</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">محرك التنفيذ القياسي</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">نظام ضمان الجودة</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">محرك التنفيذ المتجه</a></li>
</ul>
