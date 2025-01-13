---
id: 2022-06-20-Zhentu-the-Photo-Fraud-Detector-Based-on-Milvus.md
title: Zhentu - كاشف الاحتيال في الصور استنادًا إلى ميلفوس
author: 'Yan Shi, Minwei Tang'
date: 2022-06-20T00:00:00.000Z
desc: كيف يتم بناء نظام الكشف في Zhentu باستخدام ميلفوس كمحرك بحث عن المتجهات؟
cover: assets.zilliz.com/zhentu_0ae11c98ee.png
tag: Scenarios
tags: Use Cases of Milvus
canonicalUrl: >-
  https://milvus.io/blog/2022-06-20-Zhentu-the-Photo-Fraud-Detector-Based-on-Milvus.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/zhentu_0ae11c98ee.png" alt="cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>صورة الغلاف</span> </span></p>
<blockquote>
<p>كتب هذا المقال يان شي ومينوي تانغ، وهما مهندسا خوارزمية أول في شركة BestPay، وترجمته <a href="https://www.linkedin.cn/incareer/in/rosie-zhang-694528149">روزي تشانغ</a>.</p>
</blockquote>
<p>في السنوات الأخيرة، مع شيوع التجارة الإلكترونية والمعاملات عبر الإنترنت في جميع أنحاء العالم، ازدهرت عمليات الاحتيال في التجارة الإلكترونية أيضًا. فمن خلال استخدام الصور التي يتم إنشاؤها بواسطة الكمبيوتر بدلاً من الصور الحقيقية لتمرير عملية التحقق من الهوية على منصات الأعمال التجارية عبر الإنترنت، ينشئ المحتالون حسابات مزيفة ضخمة ويستفيدون من العروض الخاصة للشركات (مثل هدايا العضوية والقسائم والرموز المميزة)، مما يجلب خسائر لا يمكن تعويضها لكل من المستهلكين والشركات.</p>
<p>لم تعد الأساليب التقليدية للتحكم في المخاطر فعالة في مواجهة الكم الهائل من البيانات. ولحل هذه المشكلة، أنشأت <a href="https://www.bestpay.com.cn">BestPay</a> جهاز كشف الاحتيال بالصور، وهو Zhentu (أي كشف الصور باللغة الصينية)، استنادًا إلى تقنيات التعلم العميق (DL) ومعالجة الصور الرقمية (DIP). ويمكن تطبيق Zhentu على سيناريوهات مختلفة تتضمن التعرف على الصور، ومن أهم فروعه التعرف على التراخيص التجارية المزيفة. إذا كانت صورة الرخصة التجارية التي أرسلها أحد المستخدمين مشابهة جدًا لصورة أخرى موجودة بالفعل في مكتبة صور المنصة، فمن المحتمل أن يكون المستخدم قد سرق الصورة من مكان ما أو زوّر الرخصة لأغراض احتيالية.</p>
<p>الخوارزميات التقليدية لقياس تشابه الصور، مثل <a href="https://en.wikipedia.org/wiki/Peak_signal-to-noise_ratio">PSNR</a> و ORB، بطيئة وغير دقيقة، ولا تنطبق إلا على المهام غير المتصلة بالإنترنت. أما التعلم العميق، من ناحية أخرى، فهو قادر على معالجة بيانات الصور على نطاق واسع في الوقت الحقيقي، وهو الطريقة المثلى لمطابقة الصور المتشابهة. وبفضل الجهود المشتركة بين فريق البحث والتطوير في BestPay <a href="https://milvus.io/">ومجتمع Milvus،</a> تم تطوير نظام للكشف عن الاحتيال في الصور كجزء من Zhentu. يعمل هذا النظام من خلال تحويل كميات هائلة من بيانات الصور إلى متجهات للسمات من خلال نماذج التعلم العميق وإدراجها في <a href="https://milvus.io/">Milvus،</a> وهو محرك بحث متجه. باستخدام Milvus، يستطيع نظام الكشف فهرسة تريليونات من المتجهات واسترجاع الصور المتشابهة بكفاءة من بين عشرات الملايين من الصور.</p>
<p><strong>الانتقال إلى:</strong></p>
<ul>
<li><a href="#an-overview-of-zhentu">نظرة عامة على Zhentu</a></li>
<li><a href="#system-structure">هيكل النظام</a></li>
<li><a href="#deployment"><strong>النشر</strong></a></li>
<li><a href="#real-world-performance"><strong>الأداء في العالم الحقيقي</strong></a></li>
<li><a href="#reference"><strong>المرجع</strong></a></li>
<li><a href="#about-bestpay"><strong>حول BestPay</strong></a></li>
</ul>
<h2 id="An-overview-of-Zhentu" class="common-anchor-header">نظرة عامة على Zhentu<button data-href="#An-overview-of-Zhentu" class="anchor-icon" translate="no">
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
    </button></h2><p>Zhentu هو منتج التحكم في المخاطر المرئية متعدد الوسائط المصمم ذاتيًا من BestPay والمتكامل بعمق مع تقنيات التعلم الآلي (ML) والشبكة العصبية للتعرف على الصور. يمكن لخوارزميته المدمجة تحديد المحتالين بدقة أثناء مصادقة المستخدم والاستجابة على مستوى أجزاء من الثانية. وبفضل تقنيتها الرائدة في المجال وحلولها المبتكرة، فازت Zhentu بخمس براءات اختراع واثنين من حقوق التأليف والنشر للبرمجيات. ويجري استخدامه الآن في عدد من البنوك والمؤسسات المالية للمساعدة في تحديد المخاطر المحتملة مسبقاً.</p>
<h2 id="System-structure" class="common-anchor-header">هيكل النظام<button data-href="#System-structure" class="anchor-icon" translate="no">
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
    </button></h2><p>يحتوي BestPay حاليًا على أكثر من 10 ملايين صورة من رخص الأعمال التجارية، ولا يزال الحجم الفعلي ينمو بشكل كبير مع نمو الأعمال. من أجل استرداد الصور المتشابهة بسرعة من قاعدة البيانات الكبيرة هذه، اختارت Zhentu نظام Milvus كمحرك لحساب تشابه متجه الميزة. يظهر الهيكل العام لنظام الكشف عن الاحتيال في الصور في الرسم البياني أدناه.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Structure_of_the_photo_fraud_detection_system_cf5d20d431.png" alt="img" class="doc-image" id="img" />
   </span> <span class="img-wrapper"> <span>img</span> </span></p>
<p>يمكن تقسيم الإجراء إلى أربع خطوات:</p>
<ol>
<li><p>المعالجة المسبقة للصور. تضمن المعالجة المسبقة، بما في ذلك الحد من الضوضاء وإزالة الضوضاء وتحسين التباين، سلامة المعلومات الأصلية وإزالة المعلومات غير المفيدة من إشارة الصورة.</p></li>
<li><p>استخراج متجه الميزة. يتم استخدام نموذج تعلّم عميق مدرّب خصيصاً لاستخراج متجهات الميّزات الخاصة بالصورة. يعد تحويل الصور إلى متجهات لمزيد من البحث عن التشابه عملية روتينية.</p></li>
<li><p>التطبيع. يساعد تطبيع متجهات السمات المستخرجة على تحسين كفاءة المعالجة اللاحقة.</p></li>
<li><p>البحث عن المتجهات باستخدام ميلفوس. إدراج متجهات السمات المعيارية في قاعدة بيانات Milvus للبحث عن تشابه المتجهات.</p></li>
</ol>
<h2 id="Deployment" class="common-anchor-header"><strong>النشر</strong><button data-href="#Deployment" class="anchor-icon" translate="no">
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
    </button></h2><p>فيما يلي وصف موجز لكيفية نشر نظام Zhentu للكشف عن الاحتيال في الصور.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_architecture_ea45a5ab53.png" alt="Milvus system architecture" class="doc-image" id="milvus-system-architecture" />
   </span> <span class="img-wrapper"> <span>بنية نظام ميلفوس</span> </span></p>
<p>قمنا بنشر <a href="https://milvus.io/docs/v2.0.x/install_cluster-helm.md">مجموعة Milvus على Kubernetes</a> لضمان التوافر العالي والمزامنة في الوقت الحقيقي للخدمات السحابية. الخطوات العامة هي كما يلي:</p>
<ol>
<li><p>عرض الموارد المتاحة. قم بتشغيل الأمر <code translate="no">kubectl describe nodes</code> لمعرفة الموارد التي يمكن لمجموعة Kubernetes تخصيصها للحالات التي تم إنشاؤها.</p></li>
<li><p>تخصيص الموارد. قم بتشغيل الأمر <code translate="no">kubect`` -- apply xxx.yaml</code> لتخصيص موارد الذاكرة ووحدة المعالجة المركزية لمكونات مجموعة ميلفوس باستخدام Helm.</p></li>
<li><p>قم بتطبيق التكوين الجديد. قم بتشغيل الأمر <code translate="no">helm upgrade my-release milvus/milvus --reuse-values -fresources.yaml</code>.</p></li>
<li><p>قم بتطبيق التكوين الجديد على مجموعة مالفوس العنقودية. لا تسمح لنا الكتلة التي تم نشرها بهذه الطريقة بتعديل سعة النظام وفقًا لاحتياجات العمل المختلفة فحسب، بل تلبي أيضًا متطلبات الأداء العالي لاسترجاع البيانات المتجهة الضخمة بشكل أفضل.</p></li>
</ol>
<p>يمكنك <a href="https://milvus.io/docs/v2.0.x/configure-docker.md">تكوين Milvus</a> لتحسين أداء البحث لأنواع مختلفة من البيانات من سيناريوهات الأعمال المختلفة، كما هو موضح في المثالين التاليين.</p>
<p>عند <a href="https://milvus.io/docs/v2.0.x/build_index.md">إنشاء الفهرس المت</a>جه، نقوم بتكوين الفهرس وفقًا للسيناريو الفعلي للنظام على النحو التالي:</p>
<pre><code translate="no" class="language-Python">index = {<span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;IVF_PQ&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">2048</span>}, <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>}
<button class="copy-code-btn"></button></code></pre>
<p>يقوم<a href="https://milvus.io/docs/v2.0.x/index.md#IVF_PQ">IVF_PQ</a> بإجراء تجميع فهرس IVF قبل تكميم حاصل ضرب المتجهات. وهو يتميز باستعلام عالي السرعة على القرص واستهلاك منخفض جدًا للذاكرة، وهو ما يلبي احتياجات التطبيق الواقعي لـ Zhentu.</p>
<p>إلى جانب ذلك، قمنا بتعيين معلمات البحث المثلى على النحو التالي:</p>
<pre><code translate="no" class="language-Python">search_params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">32</span>}}
<button class="copy-code-btn"></button></code></pre>
<p>نظرًا لأن المتجهات قد تم تطبيعها بالفعل قبل إدخالها في Milvus، يتم اختيار الضرب الداخلي (IP) لحساب المسافة بين متجهين. أثبتت التجارب أن معدل الاسترجاع يرتفع بنسبة 15% تقريبًا باستخدام الضرب الداخلي (IP) مقارنةً باستخدام المسافة الإقليدية (L2).</p>
<p>توضح الأمثلة المذكورة أعلاه أنه يمكننا اختبار معلمات Milvus وتعيينها وفقًا لسيناريوهات العمل ومتطلبات الأداء المختلفة.</p>
<p>بالإضافة إلى ذلك، لا يدمج Milvus مكتبات الفهارس المختلفة فحسب، بل يدعم أيضًا أنواع الفهارس المختلفة وطرق حساب التشابه. كما يوفر Milvus أيضًا حزم SDKs رسمية بلغات متعددة وواجهات برمجة تطبيقات غنية للإدراج والاستعلام وما إلى ذلك، مما يسمح لمجموعات الأعمال الأمامية لدينا باستخدام حزم SDKs لاستدعاء مركز التحكم في المخاطر.</p>
<h2 id="Real-world-performance" class="common-anchor-header"><strong>الأداء الواقعي</strong><button data-href="#Real-world-performance" class="anchor-icon" translate="no">
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
    </button></h2><p>حتى الآن، يعمل نظام الكشف عن الاحتيال بالصور بشكل مطرد، مما يساعد الشركات على تحديد المحتالين المحتملين. ففي عام 2021، اكتشف النظام أكثر من 20,000 رخصة مزيفة على مدار العام. من حيث سرعة الاستعلام، يستغرق الاستعلام عن متجه واحد من بين عشرات الملايين من المتجهات أقل من ثانية واحدة، ومتوسط وقت الاستعلام الدفعي أقل من 0.08 ثانية. يلبي بحث Milvus عالي الأداء احتياجات الشركات من حيث الدقة والتزامن على حد سواء.</p>
<h2 id="Reference" class="common-anchor-header"><strong>المرجع</strong><button data-href="#Reference" class="anchor-icon" translate="no">
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
    </button></h2><p>Aglave P, Kolkure V. S. تنفيذ طريقة استخراج الميزات عالية الأداء باستخدام خوارزمية موجزة سريعة ومدورة موجهة [J]. Int. J. Res. Eng. Technol, 2015, 4: 394-397.</p>
<h2 id="About-BestPay" class="common-anchor-header"><strong>نبذة عن BestPay</strong><button data-href="#About-BestPay" class="anchor-icon" translate="no">
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
    </button></h2><p>شركة تشاينا تيليكوم بيست باي المحدودة هي شركة تابعة مملوكة بالكامل لشركة تشاينا تيليكوم. وهي تدير أعمال الدفع والتمويل. وتلتزم BestPay باستخدام التقنيات المتطورة مثل البيانات الضخمة والذكاء الاصطناعي والحوسبة السحابية لتمكين الابتكار في مجال الأعمال، وتوفير منتجات ذكية وحلول ذكية للتحكم في المخاطر وغيرها من الخدمات. وحتى يناير 2016، استقطب التطبيق المسمى BestPay أكثر من 200 مليون مستخدم وأصبح ثالث أكبر مشغل لمنصة دفع في الصين، بعد Alipay وWeChat Payment.</p>
