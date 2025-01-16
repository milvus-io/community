---
id: deep-dive-6-oss-qa.md
title: ضمان جودة برمجيات المصدر المفتوح (OSS) - دراسة حالة ميلفوس
author: Wenxing Zhu
date: 2022-04-25T00:00:00.000Z
desc: ضمان الجودة هي عملية تحديد ما إذا كان المنتج أو الخدمة تفي بمتطلبات معينة.
cover: assets.zilliz.com/Deep_Dive_6_c2cd44801d.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-6-oss-qa.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deep_Dive_6_c2cd44801d.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>صورة الغلاف</span> </span></p>
<blockquote>
<p>هذا المقال بقلم <a href="https://github.com/zhuwenxing">ونكسينغ تشو</a> وأعدته <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">أنجيلا ني</a>.</p>
</blockquote>
<p>ضمان الجودة (QA) هو عملية منهجية لتحديد ما إذا كان المنتج أو الخدمة تفي بمتطلبات معينة. ويُعد نظام ضمان الجودة جزءًا لا غنى عنه في عملية البحث والتطوير لأنه، كما يوحي اسمه، يضمن جودة المنتج.</p>
<p>يقدم هذا المنشور إطار عمل ضمان الجودة المعتمد في تطوير قاعدة بيانات ميلفوس المتجهة، بهدف توفير دليل إرشادي للمطورين والمستخدمين المساهمين في العملية. كما سيغطي وحدات الاختبار الرئيسية في ملفوس بالإضافة إلى الأساليب والأدوات التي يمكن الاستفادة منها لتحسين كفاءة اختبارات ضمان الجودة.</p>
<p><strong>الانتقال إلى:</strong></p>
<ul>
<li><a href="#A-general-introduction-to-the-Milvus-QA-system">مقدمة عامة عن نظام ميلفوس لضمان الجودة</a></li>
<li><a href="#Test-modules-in-Milvus">وحدات الاختبار في ميلفوس</a></li>
<li><a href="#Tools-and-methods-for-better-QA-efficiency">أدوات وأساليب لتحسين كفاءة ضمان الجودة</a></li>
</ul>
<h2 id="A-general-introduction-to-the-Milvus-QA-system" class="common-anchor-header">مقدمة عامة عن نظام ميلفوس لضمان الجودة<button data-href="#A-general-introduction-to-the-Milvus-QA-system" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">بنية النظام</a> أمر بالغ الأهمية لإجراء اختبارات ضمان الجودة. فكلما كان مهندس ضمان الجودة على دراية أكبر بالنظام، زادت احتمالية توصله إلى خطة اختبار معقولة وفعالة.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_architecture_feaccc489d.png" alt="Milvus architecture" class="doc-image" id="milvus-architecture" />
   </span> <span class="img-wrapper"> <span>بنية ميلفوس</span> </span></p>
<p>تتبنى Milvus 2.0 <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#A-cloud-native-first-approach">بنية سحابية أصلية وموزعة ومتعددة الطبقات،</a> حيث تعتبر مجموعة أدوات تطوير البرمجيات <a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">المدخل الرئيسي</a> لتدفق <a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">البيانات</a> في Milvus. يستفيد مستخدمو Milvus من مجموعة تطوير البرمجيات SDK بشكل متكرر، وبالتالي هناك حاجة ماسة إلى إجراء اختبارات وظيفية على جانب SDK. أيضًا، يمكن أن تساعد اختبارات الوظائف على SDK في اكتشاف المشكلات الداخلية التي قد تكون موجودة داخل نظام Milvus. بصرف النظر عن الاختبارات الوظيفية، سيتم أيضًا إجراء أنواع أخرى من الاختبارات على قاعدة البيانات المتجهة، بما في ذلك اختبارات الوحدة، واختبارات النشر، واختبارات الموثوقية، واختبارات الثبات، واختبارات الأداء، واختبارات الأداء.</p>
<p>تجلب البنية السحابية الأصلية والموزعة كلاً من الملاءمة والتحديات لاختبارات ضمان الجودة. فعلى عكس الأنظمة التي يتم نشرها وتشغيلها محلياً، يمكن لمثيل Milvus الذي يتم نشره وتشغيله على مجموعة Kubernetes أن يضمن إجراء اختبار البرمجيات في نفس ظروف تطوير البرمجيات. ومع ذلك، فإن الجانب السلبي هو أن تعقيد البنية الموزعة يجلب المزيد من الشكوك التي يمكن أن تجعل اختبار ضمان الجودة للنظام أكثر صعوبة ومضنية. على سبيل المثال، يستخدم نظام ميلفوس 2.0 خدمات متناهية الصغر لمكونات مختلفة، وهذا يؤدي إلى زيادة عدد <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#A-bare-bones-skeleton-of-the-Milvus-architecture">الخدمات والعقد،</a> واحتمال أكبر لحدوث خطأ في النظام. وبالتالي، هناك حاجة إلى خطة ضمان جودة أكثر تطوراً وشمولاً لتحسين كفاءة الاختبار.</p>
<h3 id="QA-testings-and-issue-management" class="common-anchor-header">اختبارات ضمان الجودة وإدارة المشكلات</h3><p>يتضمن ضمان الجودة في ميلفوس كلاً من إجراء الاختبارات وإدارة المشكلات التي تظهر أثناء تطوير البرمجيات.</p>
<h4 id="QA-testings" class="common-anchor-header">اختبارات ضمان الجودة</h4><p>تُجري ميلفوس أنواعًا مختلفة من اختبارات ضمان الجودة وفقًا لميزات ميلفوس واحتياجات المستخدم حسب الأولوية كما هو موضح في الصورة أدناه.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_14_2aff081d41.png" alt="QA testing priority" class="doc-image" id="qa-testing-priority" />
   </span> <span class="img-wrapper"> <span>أولوية اختبار ضمان الجودة</span> </span></p>
<p>يتم إجراء اختبارات ضمان الجودة على الجوانب التالية في ميلفوس حسب الأولوية التالية:</p>
<ol>
<li><strong>الوظيفة</strong>: التحقق مما إذا كانت الوظائف والميزات تعمل كما تم تصميمها في الأصل.</li>
<li><strong>النشر</strong>: التحقق مما إذا كان بإمكان المستخدم نشر وإعادة تثبيت وترقية كل من إصدار Mivus المستقل ومجموعة Milvus بطرق مختلفة (Docker Compose أو Helm أو APT أو YUM، إلخ).</li>
<li><strong>الأداء</strong>:  اختبار أداء إدخال البيانات والفهرسة والبحث المتجه والاستعلام في Milvus.</li>
<li><strong>الاستقرار</strong>: تحقق مما إذا كان يمكن تشغيل Milvus بثبات لمدة 5-10 أيام تحت مستوى عادي من عبء العمل.</li>
<li><strong>الموثوقية</strong>: اختبار ما إذا كان ميلفوس لا يزال يعمل بشكل جزئي في حالة حدوث خطأ معين في النظام.</li>
<li><strong>التهيئة</strong>: التحقق مما إذا كان ميلفوس يعمل كما هو متوقع في ظل تهيئة معينة.</li>
<li><strong>التوافق</strong>: اختبار ما إذا كانت Milvus متوافقة مع أنواع مختلفة من الأجهزة أو البرامج.</li>
</ol>
<h4 id="Issue-management" class="common-anchor-header">إدارة المشكلات</h4><p>قد تظهر العديد من المشكلات أثناء تطوير البرمجيات. يمكن أن يكون مؤلف المشكلات النموذجية مهندسي ضمان الجودة أنفسهم أو مستخدمي ميلفوس من مجتمع المصدر المفتوح. فريق ضمان الجودة مسؤول عن حل المشكلات.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Issue_management_workflow_12c726efa1.png" alt="Issue management workflow" class="doc-image" id="issue-management-workflow" />
   </span> <span class="img-wrapper"> <span>سير عمل إدارة المشكلات</span> </span></p>
<p>عندما يتم إنشاء <a href="https://github.com/milvus-io/milvus/issues">مشكلة،</a> ستخضع للفرز أولاً. أثناء الفرز، سيتم فحص المشكلات الجديدة للتأكد من تقديم تفاصيل كافية عن المشكلات. إذا تم تأكيد المشكلة، فسيتم قبولها من قبل المطورين وسيحاولون إصلاح المشكلات. بمجرد الانتهاء من التطوير، يحتاج مؤلف المشكلة إلى التحقق مما إذا تم إصلاحها. إذا كانت الإجابة بنعم، سيتم إغلاق المشكلة في النهاية.</p>
<h3 id="When-is-QA-needed" class="common-anchor-header">متى تكون هناك حاجة إلى ضمان الجودة؟</h3><p>أحد المفاهيم الخاطئة الشائعة هو أن ضمان الجودة والتطوير مستقلان عن بعضهما البعض. ولكن الحقيقة هي أنه لضمان جودة النظام، هناك حاجة إلى جهود من كل من المطورين ومهندسي ضمان الجودة. لذلك، يجب إشراك ضمان الجودة طوال دورة الحياة بأكملها.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/QA_lifecycle_375f4fd8a8.png" alt="QA lifecycle" class="doc-image" id="qa-lifecycle" />
   </span> <span class="img-wrapper"> <span>دورة حياة ضمان الجودة</span> </span></p>
<p>كما هو موضح في الشكل أعلاه، تتضمن دورة حياة البحث والتطوير الكاملة للبرمجيات ثلاث مراحل.</p>
<p>خلال المرحلة الأولية، يقوم المطورون بنشر وثائق التصميم بينما يقوم مهندسو ضمان الجودة بوضع خطط الاختبار وتحديد معايير الإصدار وتعيين مهام ضمان الجودة. يجب أن يكون المطورون ومهندسو ضمان الجودة على دراية بكل من مستند التصميم وخطة الاختبار بحيث يتم مشاركة الفهم المتبادل لهدف الإصدار (من حيث الميزات والأداء والاستقرار وتقارب الأخطاء وما إلى ذلك) بين الفريقين.</p>
<p>أثناء البحث والتطوير، يتفاعل فريقا التطوير واختبارات ضمان الجودة بشكل متكرر لتطوير الميزات والوظائف والتحقق منها، وإصلاح الأخطاء والمشاكل التي يبلغ عنها <a href="https://slack.milvus.io/">مجتمع</a> المصدر المفتوح أيضًا.</p>
<p>خلال المرحلة النهائية، إذا تم استيفاء معايير الإصدار، يتم إصدار صورة Docker جديدة لإصدار Milvus الجديد. هناك حاجة إلى مذكرة إصدار تركز على الميزات الجديدة والأخطاء التي تم إصلاحها وعلامة إصدار للإصدار الرسمي. ثم سيقوم فريق ضمان الجودة أيضًا بنشر تقرير اختبار عن هذا الإصدار.</p>
<h2 id="Test-modules-in-Milvus" class="common-anchor-header">وحدات الاختبار في ملفوس<button data-href="#Test-modules-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>هناك العديد من وحدات الاختبار في ملفوس وسيشرح هذا القسم كل وحدة بالتفصيل.</p>
<h3 id="Unit-test" class="common-anchor-header">اختبار الوحدة</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Unit_test_7d3d422345.png" alt="Unit test" class="doc-image" id="unit-test" />
   </span> <span class="img-wrapper"> <span>اختبار الوحدة</span> </span></p>
<p>يمكن أن تساعد اختبارات الوحدة في تحديد الأخطاء البرمجية في مرحلة مبكرة وتوفير معايير التحقق من إعادة هيكلة التعليمات البرمجية. وفقًا لمعايير قبول طلب السحب (PR) في ميلفوس، يجب أن تكون <a href="https://app.codecov.io/gh/milvus-io/milvus/">تغطية</a> اختبار وحدة التعليمات البرمجية 80%.</p>
<h3 id="Function-test" class="common-anchor-header">اختبار الوظيفة</h3><p>يتم تنظيم اختبارات الوظائف في ميلفوس بشكل أساسي حول <a href="https://github.com/milvus-io/pymilvus">PyMilvus</a> و SDKs. الغرض الرئيسي من اختبارات الوظائف هو التحقق مما إذا كانت الواجهات تعمل كما تم تصميمها. اختبارات الوظائف لها وجهان:</p>
<ul>
<li>اختبار ما إذا كان بإمكان حزم SDKs إرجاع النتائج المتوقعة عند تمرير المعلمات الصحيحة.</li>
<li>اختبار ما إذا كان بإمكان SDKs معالجة الأخطاء وإرجاع رسائل خطأ معقولة عند تمرير معلمات غير صحيحة.</li>
</ul>
<p>يصور الشكل أدناه إطار العمل الحالي لاختبارات الدوال الذي يعتمد على إطار عمل <a href="https://pytest.org/">pytest</a> السائد. يضيف إطار العمل هذا غلافًا إلى PyMilvus ويمكّن الاختبار بواجهة اختبار مؤتمتة.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Function_test_41f837d3e7.png" alt="Function test" class="doc-image" id="function-test" />
   </span> <span class="img-wrapper"> <span>اختبار الدالة</span> </span></p>
<p>بالنظر إلى الحاجة إلى طريقة اختبار مشتركة والحاجة إلى إعادة استخدام بعض الدوال، تم اعتماد إطار الاختبار أعلاه، بدلاً من استخدام واجهة PyMilvus مباشرةً. كما تم تضمين وحدة "تحقق" في الإطار لتوفير الراحة في التحقق من القيم المتوقعة والفعلية.</p>
<p>تم تضمين ما يصل إلى 2700 حالة اختبار دالة في دليل <code translate="no">tests/python_client/testcases</code> ، وهي تغطي جميع واجهات PyMilvus تقريبًا بشكل كامل. تشرف اختبارات الدالة هذه بدقة على جودة كل عملية علاقات عامة.</p>
<h3 id="Deployment-test" class="common-anchor-header">اختبار النشر</h3><p>يأتي ميلفوس في وضعين: <a href="https://milvus.io/docs/v2.0.x/install_standalone-docker.md">مستقل</a> <a href="https://milvus.io/docs/v2.0.x/install_cluster-docker.md">وعنقودي</a>. وهناك طريقتان رئيسيتان لنشر ميلفوس: باستخدام Docker Compose أو Helm. وبعد نشر Milvus، يمكن للمستخدمين أيضًا إعادة تشغيل خدمة Milvus أو ترقيتها. هناك فئتان رئيسيتان لاختبار النشر: اختبار إعادة التشغيل واختبار الترقية.</p>
<p>يشير اختبار إعادة التشغيل إلى عملية اختبار ثبات البيانات، أي ما إذا كانت البيانات لا تزال متاحة بعد إعادة التشغيل. يشير اختبار الترقية إلى عملية اختبار توافق البيانات لمنع الحالات التي يتم فيها إدراج تنسيقات غير متوافقة للبيانات في ملفوس. يشترك كلا النوعين من اختبارات النشر في نفس سير العمل كما هو موضح في الصورة أدناه.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deployment_test_342ab3b3f5.png" alt="Deployment test" class="doc-image" id="deployment-test" />
   </span> <span class="img-wrapper"> <span>اختبار النشر</span> </span></p>
<p>في اختبار إعادة التشغيل، تستخدم عمليتا النشر نفس صورة docker. ومع ذلك في اختبار الترقية، تستخدم عملية النشر الأولى صورة docker لإصدار سابق بينما تستخدم عملية النشر الثانية صورة docker لإصدار لاحق. يتم حفظ نتائج الاختبار والبيانات في ملف <code translate="no">Volumes</code> أو <a href="https://kubernetes.io/docs/concepts/storage/persistent-volumes/">المطالبة بوحدة تخزين ثابتة</a> (PVC).</p>
<p>عند تشغيل الاختبار الأول، يتم إنشاء مجموعات متعددة وإجراء عمليات مختلفة لكل مجموعة من المجموعات. عند تشغيل الاختبار الثاني، سيكون التركيز الرئيسي على التحقق مما إذا كانت المجموعات التي تم إنشاؤها لا تزال متاحة لعمليات CRUD، وما إذا كان يمكن إنشاء مجموعات جديدة أخرى.</p>
<h3 id="Reliability-test" class="common-anchor-header">اختبار الموثوقية</h3><p>عادةً ما تعتمد الاختبارات على موثوقية النظام الموزع السحابي الأصلي على طريقة هندسة الفوضى التي تهدف إلى القضاء على الأخطاء وأعطال النظام في مهدها. وبعبارة أخرى، في اختبار هندسة الفوضى، نقوم في اختبار هندسة الفوضى بخلق حالات فشل النظام عن قصد لتحديد المشاكل في اختبارات الضغط وإصلاح أعطال النظام قبل أن تبدأ بالفعل في إحداث مخاطر. أثناء اختبار الفوضى في ميلفوس، نختار <a href="https://chaos-mesh.org/">شبكة الفوضى</a> كأداة لخلق الفوضى. هناك عدة أنواع من الإخفاقات التي يجب إنشاؤها:</p>
<ul>
<li>تعطل<strong>الكبسولة</strong>: محاكاة لسيناريو تعطل العقد.</li>
<li><strong>فشل الكبسولة</strong>: اختبار ما إذا كانت إحدى العقدة العاملة قد تعطلت وما إذا كان النظام بأكمله لا يزال بإمكانه الاستمرار في العمل.</li>
<li><strong>إجهاد الذاكرة</strong>: محاكاة لاستهلاك موارد الذاكرة ووحدة المعالجة المركزية الثقيلة من عقد العمل.</li>
<li><strong>تقسيم الشبكة</strong>: بما أن ميلفوس <a href="https://milvus.io/docs/v2.0.x/four_layers.md">يفصل التخزين عن الحوسبة،</a> فإن النظام يعتمد بشكل كبير على الاتصال بين المكونات المختلفة. هناك حاجة لمحاكاة السيناريو الذي يتم فيه تقسيم الاتصال بين مختلف الكبسولات لاختبار الترابط بين مكونات Milvus المختلفة.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Reliability_test_a7331b91f4.png" alt="Reliability test" class="doc-image" id="reliability-test" />
   </span> <span class="img-wrapper"> <span>اختبار الموثوقية</span> </span></p>
<p>يوضح الشكل أعلاه إطار عمل اختبار الموثوقية في ميلفوس الذي يمكنه أتمتة اختبارات الفوضى. يكون سير عمل اختبار الموثوقية كما يلي:</p>
<ol>
<li>تهيئة مجموعة Milvus من خلال قراءة تكوينات النشر.</li>
<li>عندما تكون الكتلة جاهزة، قم بتشغيل <code translate="no">test_e2e.py</code> لاختبار ما إذا كانت ميزات ميلفوس متوفرة.</li>
<li>تشغيل <code translate="no">hello_milvus.py</code> لاختبار ثبات البيانات. قم بإنشاء مجموعة باسم "hello_milvus" لإدراج البيانات وتدفقها وبناء الفهرس والبحث المتجه والاستعلام. لن يتم تحرير هذه المجموعة أو إسقاطها أثناء الاختبار.</li>
<li>قم بإنشاء كائن مراقبة سيبدأ ستة خيوط لتنفيذ عمليات الإنشاء والإدراج والتدفق والفهرس والبحث والاستعلام.</li>
</ol>
<pre><code translate="no">checkers = {
    Op.create: CreateChecker(),
    Op.insert: InsertFlushChecker(),
    Op.flush: InsertFlushChecker(flush=<span class="hljs-literal">True</span>),
    Op.index: IndexChecker(),
    Op.search: SearchChecker(),
    Op.query: QueryChecker()
}
<button class="copy-code-btn"></button></code></pre>
<ol start="5">
<li>قم بإجراء التأكيد الأول - جميع العمليات ناجحة كما هو متوقع.</li>
<li>أدخل فشل النظام إلى ميلفوس باستخدام Chaos Mesh لتحليل ملف yaml الذي يحدد الفشل. يمكن أن يكون الفشل هو قتل عقدة الاستعلام كل خمس ثوانٍ على سبيل المثال.</li>
<li>قم بإجراء التأكيد الثاني أثناء إدخال فشل النظام - احكم على ما إذا كانت النتائج التي تم إرجاعها للعمليات في Milvus أثناء فشل النظام تتطابق مع التوقع.</li>
<li>القضاء على الفشل عبر شبكة الفوضى.</li>
<li>عندما يتم استرداد خدمة Milvus (بمعنى أن جميع الكبسولات جاهزة)، قم بإجراء التأكيد الثالث - جميع العمليات ناجحة كما هو متوقع.</li>
<li>قم بتشغيل <code translate="no">test_e2e.py</code> لاختبار ما إذا كانت ميزات ميلفوس متوفرة. قد يتم حظر بعض العمليات أثناء الفوضى بسبب التأكيد الثالث. وحتى بعد التخلص من الفوضى، قد يستمر حظر بعض العمليات، مما يعيق نجاح التأكيد الثالث كما هو متوقع. تهدف هذه الخطوة إلى تسهيل التأكيد الثالث وتعمل كمعيار للتحقق مما إذا كانت خدمة Milvus قد تعافت.</li>
<li>تشغيل <code translate="no">hello_milvus.py</code> ، وتحميل المجموعة التي تم إنشاؤها، وإجراء عمليات CRUP على المجموعة. بعد ذلك، تحقق مما إذا كانت البيانات الموجودة قبل فشل النظام لا تزال متاحة بعد استرداد الفشل.</li>
<li>اجمع السجلات.</li>
</ol>
<h3 id="Stability-and-performance-test" class="common-anchor-header">اختبار الاستقرار والأداء</h3><p>يصف الشكل أدناه الأغراض وسيناريوهات الاختبار ومقاييس اختبار الاستقرار والأداء.</p>
<table>
<thead>
<tr><th></th><th>اختبار الاستقرار</th><th>اختبار الأداء</th></tr>
</thead>
<tbody>
<tr><td>الأغراض</td><td>- التأكد من قدرة Milvus على العمل بسلاسة لفترة زمنية محددة تحت عبء العمل العادي. <br> - التأكد من استهلاك الموارد بثبات عند بدء تشغيل خدمة ميلفوس.</td><td>- اختبار أداء جميع واجهات ميلفوس. <br> - العثور على التكوين الأمثل بمساعدة اختبارات الأداء.  <br> - العمل كمعيار للإصدارات المستقبلية. <br> - العثور على عنق الزجاجة الذي يعيق الأداء الأفضل.</td></tr>
<tr><td>السيناريوهات</td><td>- سيناريو القراءة المكثفة غير المتصلة بالإنترنت حيث يتم تحديث البيانات بالكاد بعد الإدراج وتكون النسبة المئوية لمعالجة كل نوع من الطلبات: طلب البحث 90%، طلب الإدراج 5%، والطلبات الأخرى 5%. <br> - السيناريو كثيف الكتابة عبر الإنترنت حيث يتم إدراج البيانات والبحث عنها في وقت واحد وتكون النسبة المئوية لمعالجة كل نوع من الطلبات هي: طلب إدراج 50%، وطلب بحث 40%، وطلب بحث 40%، وأخرى 10%.</td><td>- إدراج البيانات <br> - بناء الفهرس <br> - البحث المتجه</td></tr>
<tr><td>المقاييس</td><td>- استخدام الذاكرة <br> - استهلاك وحدة المعالجة المركزية <br> - زمن انتقال الإدخال والإخراج <br> - حالة كبسولات ميلفوس <br> - زمن استجابة خدمة Milvus <br> وما إلى ذلك</td><td>- إنتاجية البيانات أثناء إدخال البيانات <br> - الوقت الذي يستغرقه إنشاء فهرس <br> - وقت الاستجابة أثناء البحث المتجه <br> - الاستعلام في الثانية (QPS) <br> - الطلب في الثانية  <br> - معدل الاستدعاء <br> إلخ.</td></tr>
</tbody>
</table>
<p>يشترك كل من اختبار الاستقرار واختبار الأداء في نفس مجموعة سير العمل:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Stability_and_performance_test_6ed8532697.png" alt="Stability and performance test" class="doc-image" id="stability-and-performance-test" />
   </span> <span class="img-wrapper"> <span>اختبار الاستقرار والأداء</span> </span></p>
<ol>
<li>تحليل التكوينات وتحديثها، وتحديد المقاييس. يتوافق <code translate="no">server-configmap</code> مع تكوين ميلفوس المستقل أو العنقودي بينما يتوافق <code translate="no">client-configmap</code> مع تكوينات حالة الاختبار.</li>
<li>تكوين الخادم والعميل.</li>
<li>إعداد البيانات</li>
<li>طلب التفاعل بين الخادم والعميل.</li>
<li>إعداد التقارير وعرض المقاييس.</li>
</ol>
<h2 id="Tools-and-methods-for-better-QA-efficiency" class="common-anchor-header">أدوات وأساليب لتحسين كفاءة ضمان الجودة<button data-href="#Tools-and-methods-for-better-QA-efficiency" class="anchor-icon" translate="no">
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
    </button></h2><p>من قسم اختبار الوحدات، يمكننا أن نرى أن إجراءات معظم الاختبارات هي في الواقع متشابهة تقريبًا، وتتضمن بشكل أساسي تعديل تكوينات خادم ميلفوس والعميل وتمرير معلمات واجهة برمجة التطبيقات. عندما تكون هناك تكوينات متعددة، كلما زاد تنوع مجموعة التكوينات المختلفة، زادت سيناريوهات الاختبار التي يمكن أن تغطيها هذه التجارب والاختبارات. ونتيجةً لذلك، فإن إعادة استخدام الرموز والإجراءات تكون أكثر أهمية لعملية تعزيز كفاءة الاختبار.</p>
<h3 id="SDK-test-framework" class="common-anchor-header">إطار عمل اختبار SDK</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/SDK_test_framework_8219e28f4c.png" alt="SDK test framework" class="doc-image" id="sdk-test-framework" />
   </span> <span class="img-wrapper"> <span>إطار عمل اختبار SDK</span> </span></p>
<p>لتسريع عملية الاختبار، يمكننا إضافة غلاف <code translate="no">API_request</code> إلى إطار الاختبار الأصلي، وتعيينه كشيء مشابه لبوابة واجهة برمجة التطبيقات. ستكون بوابة واجهة برمجة التطبيقات هذه مسؤولة عن جمع جميع طلبات واجهة برمجة التطبيقات ثم تمريرها إلى Milvus لتلقي الردود بشكل جماعي. سيتم تمرير هذه الردود إلى العميل بعد ذلك. مثل هذا التصميم يجعل التقاط معلومات سجل معينة مثل المعلمات والنتائج المرتجعة أسهل بكثير. بالإضافة إلى ذلك، يمكن لمكون المدقق في إطار عمل اختبار SDK التحقق من النتائج من Milvus وفحصها. ويمكن تحديد جميع طرق الفحص داخل مكون المدقق هذا.</p>
<p>مع إطار عمل اختبار SDK، يمكن تغليف بعض عمليات التهيئة الحاسمة في دالة واحدة. وبذلك، يمكن التخلص من أجزاء كبيرة من الرموز المملة.</p>
<p>من الجدير بالذكر أيضًا أن كل حالة اختبار فردية مرتبطة بمجموعتها الفريدة لضمان عزل البيانات.</p>
<p>عند تنفيذ حالات الاختبار،<code translate="no">pytest-xdist</code> ، يمكن الاستفادة من امتداد pytest، لتنفيذ جميع حالات الاختبار الفردية بالتوازي، مما يعزز الكفاءة بشكل كبير.</p>
<h3 id="GitHub-action" class="common-anchor-header">إجراء GitHub</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Git_Hub_action_c3c1bed591.png" alt="GitHub action" class="doc-image" id="github-action" />
   </span> <span class="img-wrapper"> <span>إجراء GitHub</span> </span></p>
<p>تم اعتماد<a href="https://docs.github.com/en/actions">GitHub Action</a> أيضًا لتحسين كفاءة ضمان الجودة لخصائصه التالية:</p>
<ul>
<li>إنها أداة CI / CD أصلية مدمجة بعمق مع GitHub.</li>
<li>يأتي مع بيئة آلة مهيأة بشكل موحد وأدوات تطوير برمجيات شائعة مثبتة مسبقًا بما في ذلك Docker و Docker Compose، إلخ.</li>
<li>وهو يدعم العديد من أنظمة التشغيل والإصدارات بما في ذلك Ubuntu و MacOs و Windows-server، إلخ.</li>
<li>لديه سوق يقدم امتدادات غنية ووظائف خارج الصندوق.</li>
<li>تدعم مصفوفته الوظائف المتزامنة، وإعادة استخدام نفس تدفق الاختبار لتحسين الكفاءة</li>
</ul>
<p>بصرف النظر عن الخصائص المذكورة أعلاه، هناك سبب آخر لاعتماد GitHub Action وهو أن اختبارات النشر واختبارات الموثوقية تتطلب بيئة مستقلة ومعزولة. ويُعد GitHub Action مثاليًا لاختبارات الفحص اليومية على مجموعات البيانات صغيرة الحجم.</p>
<h3 id="Tools-for-benchmark-tests" class="common-anchor-header">أدوات للاختبارات المعيارية</h3><p>لجعل اختبارات ضمان الجودة أكثر كفاءة، يتم استخدام عدد من الأدوات.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_13_fbc71dfe4f.png" alt="QA tools" class="doc-image" id="qa-tools" />
   </span> <span class="img-wrapper"> <span>أدوات ضمان الجودة</span> </span></p>
<ul>
<li><a href="https://argoproj.github.io/">Argo</a>: مجموعة من الأدوات مفتوحة المصدر لـ Kubernetes لتشغيل مهام سير العمل وإدارة المجموعات من خلال جدولة المهام. ويمكنها أيضًا تمكين تشغيل مهام متعددة بالتوازي.</li>
<li><a href="https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/">لوحة معلومات Kubernetes</a>: واجهة مستخدم Kubernetes قائمة على الويب لتصور <code translate="no">server-configmap</code> و <code translate="no">client-configmap</code>.</li>
<li><a href="https://en.wikipedia.org/wiki/Network-attached_storage">NAS</a>: التخزين المتصل بالشبكة (NAS) هو خادم تخزين بيانات حاسوبية على مستوى الملفات لحفظ مجموعات البيانات الشائعة لمعايير الشبكة الوطنية.</li>
<li><a href="https://www.influxdata.com/">InfluxDB</a> و <a href="https://www.mongodb.com/">MongoDB</a>: قواعد بيانات لحفظ نتائج الاختبارات المعيارية.</li>
<li><a href="https://grafana.com/">Grafana</a>: حل مفتوح المصدر للتحليلات والمراقبة لمراقبة مقاييس موارد الخادم ومقاييس أداء العميل.</li>
<li><a href="https://redash.io/">Redash</a>: خدمة تساعد في تصور بياناتك وإنشاء مخططات للاختبارات المعيارية.</li>
</ul>
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
    </button></h2><p>مع <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">الإعلان الرسمي عن التوفر العام</a> ل Milvus 2.0، نظمنا سلسلة مدونات Milvus Deep Dive هذه لتقديم تفسير متعمق لبنية Milvus ورمز المصدر. تشمل الموضوعات التي تتناولها سلسلة المدونات هذه ما يلي:</p>
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
