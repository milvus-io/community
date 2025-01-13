---
id: intelligent-wardrobe-customization-system.md
title: بناء نظام تخصيص ذكي لخزانة الملابس مدعوم من قاعدة بيانات ميلفوس فيكتور
author: Yiyun Ni
date: 2022-07-08T00:00:00.000Z
desc: >-
  استخدام تقنية البحث عن التشابه لإطلاق إمكانات البيانات غير المهيكلة، حتى مثل
  خزائن الملابس ومكوناتها!
cover: assets.zilliz.com/Frame_1282_edc1fb7d99.png
tag: Engineering
tags: >-
  Data science, Database, Use Cases of Milvus, Artificial Intelligence, Vector
  Management
canonicalUrl: 'https://milvus.io/blog/intelligent-wardrobe-customization-system.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1282_edc1fb7d99.png" alt="cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>صورة الغلاف</span> </span></p>
<p>إذا كنت تبحث عن خزانة ملابس تتناسب تمامًا مع غرفة نومك أو غرفة القياس الخاصة بك، أراهن أن معظم الناس سيفكرون في تلك المصنوعة حسب المقاس. ومع ذلك، لا يمكن أن تمتد ميزانية الجميع إلى هذا الحد. فماذا عن تلك الجاهزة؟ تكمن المشكلة في هذا النوع من خزانة الملابس في أنها من المحتمل جدًا أن تكون أقل من توقعاتك لأنها ليست مرنة بما يكفي لتلبية احتياجاتك التخزينية الفريدة. بالإضافة إلى ذلك، عند البحث عبر الإنترنت، من الصعب إلى حد ما تلخيص نوع خزانة الملابس التي تبحثين عنها بكلمات رئيسية. من المحتمل جدًا أن تكون الكلمة المفتاحية التي تكتبها في مربع البحث (على سبيل المثال: خزانة ملابس مع صينية مجوهرات) مختلفة تمامًا عن كيفية تعريفها في محرك البحث (على سبيل المثال: خزانة ملابس مع <a href="https://www.ikea.com/us/en/p/komplement-pull-out-tray-with-insert-black-brown-s79249366/">صينية تسحب للخارج مع إدراج</a>).</p>
<p>ولكن بفضل التقنيات الناشئة، يوجد حل! توفر ايكيا، وهي مجموعة متاجر التجزئة للأثاث بالتجزئة، أداة تصميم شهيرة <a href="https://www.ikea.com/us/en/rooms/bedroom/how-to/how-to-design-your-perfect-pax-wardrobe-pub8b76dda0">PAX خزانة</a> الملابس التي تتيح للمستخدمين الاختيار من بين عدد من خزائن الملابس الجاهزة وتخصيص اللون والحجم والتصميم الداخلي لخزائن الملابس. سواءً كنت تحتاج إلى مساحة معلقة أو أرفف متعددة أو أدراج داخلية، فإن نظام التخصيص الذكي لخزانة الملابس هذا يمكنه دائماً تلبية احتياجاتك.</p>
<p>لإيجاد أو بناء خزانة ملابسك المثالية باستخدام نظام تصميم خزانة الملابس الذكي هذا، تحتاج إلى:</p>
<ol>
<li>تحديد المتطلبات الأساسية - الشكل (عادي أو على شكل حرف L أو على شكل حرف U) وطول خزانة الملابس وعمقها.</li>
<li>حدد احتياجاتك التخزينية والتنظيم الداخلي لخزانة الملابس (على سبيل المثال: مساحة معلقة ورف للسحب للسراويل، إلخ).</li>
<li>إضافة أو إزالة أجزاء من خزانة الملابس مثل الأدراج أو الأرفف.</li>
</ol>
<p>ثم يكتمل تصميمك. بسيط وسهل!</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Pax_system_ff4c3fa182.png" alt="pax system" class="doc-image" id="pax-system" />
   </span> <span class="img-wrapper"> <span>نظام باكس</span> </span></p>
<p>من المكونات المهمة جدًا التي تجعل نظام تصميم خزانة الملابس هذا ممكنًا هو <a href="https://zilliz.com/learn/what-is-vector-database">قاعدة البيانات المتجهة</a>. ولذلك، تهدف هذه المقالة إلى تقديم سير العمل وحلول البحث عن التشابه المستخدمة لبناء نظام تخصيص ذكي لخزانة الملابس مدعوم بالبحث عن التشابه المتجه.</p>
<p>الانتقال إلى:</p>
<ul>
<li><a href="#System-overview">نظرة عامة على النظام</a></li>
<li><a href="#Data-flow">تدفق البيانات</a></li>
<li><a href="#System-demo">عرض توضيحي للنظام</a></li>
</ul>
<h2 id="System-Overview" class="common-anchor-header">نظرة عامة على النظام<button data-href="#System-Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>من أجل تقديم أداة تخصيص ذكية لخزانة الملابس، نحتاج أولاً إلى تحديد منطق العمل وفهم سمات العناصر ورحلة المستخدم. خزائن الملابس مع مكوناتها مثل الأدراج والصواني والرفوف كلها بيانات غير منظمة. ولذلك، فإن الخطوة الثانية هي الاستفادة من خوارزميات وقواعد الذكاء الاصطناعي والمعرفة المسبقة ووصف العناصر وغير ذلك، لتحويل تلك البيانات غير المنظمة إلى نوع من البيانات التي يمكن فهمها بواسطة أجهزة الكمبيوتر - المتجهات!</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Customization_tool_overview_86d62e1730.png" alt="Customization tool overview" class="doc-image" id="customization-tool-overview" />
   </span> <span class="img-wrapper"> <span>نظرة عامة على أداة التخصيص</span> </span></p>
<p>من خلال المتجهات التي تم إنشاؤها، نحتاج إلى قواعد بيانات متجهات قوية ومحركات بحث لمعالجة تلك المتجهات.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/tool_architecutre_33fb646954.png" alt="tool architecture" class="doc-image" id="tool-architecture" />
   </span> <span class="img-wrapper"> <span>بنية الأداة</span> </span></p>
<p>تستفيد أداة التخصيص من بعض محركات البحث وقواعد البيانات الأكثر شيوعًا: Elasticsearch و <a href="https://milvus.io/">Milvus</a> و PostgreSQL.</p>
<h3 id="Why-Milvus" class="common-anchor-header">لماذا ميلفوس؟</h3><p>يحتوي مكوّن خزانة الملابس على معلومات معقدة للغاية، مثل اللون والشكل والتنظيم الداخلي، وما إلى ذلك. ومع ذلك، فإن الطريقة التقليدية للاحتفاظ ببيانات خزانة الملابس في قاعدة بيانات علائقية بعيدة كل البعد عن أن تكون كافية. الطريقة الشائعة هي استخدام تقنيات التضمين لتحويل خزائن الملابس إلى متجهات. لذلك، نحتاج إلى البحث عن نوع جديد من قواعد البيانات المصممة خصيصًا لتخزين المتجهات والبحث عن التشابه. بعد سبر العديد من الحلول الشائعة، تم اختيار قاعدة بيانات المتجهات <a href="https://github.com/milvus-io/milvus">Milvus</a> لأدائها الممتاز واستقرارها وتوافقها وسهولة استخدامها. الرسم البياني أدناه عبارة عن مقارنة بين العديد من حلول البحث عن المتجهات الشائعة.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Solution_comparison_d96b8f1dd5.png" alt="solution comparison" class="doc-image" id="solution-comparison" />
   </span> <span class="img-wrapper"> <span>مقارنة الحلول</span> </span></p>
<h3 id="System-workflow" class="common-anchor-header">سير عمل النظام</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/System_workflow_250c275ec1.png" alt="System workflow" class="doc-image" id="system-workflow" />
   </span> <span class="img-wrapper"> <span>سير عمل النظام</span> </span></p>
<p>يتم استخدام Elasticsearch لتصفية خشنة حسب حجم الخزانة واللون وما إلى ذلك. ثم تمر النتائج التي تمت تصفيتها من خلال قاعدة بيانات المتجهات Milvus للبحث عن التشابه ويتم ترتيب النتائج بناءً على المسافة/التشابه مع متجه الاستعلام. أخيرًا، يتم دمج النتائج وتنقيحها بناءً على رؤى العمل.</p>
<h2 id="Data-flow" class="common-anchor-header">تدفق البيانات<button data-href="#Data-flow" class="anchor-icon" translate="no">
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
    </button></h2><p>يشبه نظام تخصيص خزانة الملابس إلى حد كبير محركات البحث التقليدية وأنظمة التوصية. يحتوي على ثلاثة أجزاء:</p>
<ul>
<li>إعداد البيانات دون اتصال بالإنترنت بما في ذلك تعريف البيانات وتوليدها.</li>
<li>الخدمات عبر الإنترنت بما في ذلك الاستدعاء والترتيب.</li>
<li>المعالجة اللاحقة للبيانات بناءً على منطق العمل.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_flow_d0d9fa0fca.png" alt="Data flow" class="doc-image" id="data-flow" />
   </span> <span class="img-wrapper"> <span>تدفق البيانات</span> </span></p>
<h3 id="Offline-data-flow" class="common-anchor-header">تدفق البيانات دون اتصال بالإنترنت</h3><ol>
<li>تعريف البيانات باستخدام رؤية الأعمال.</li>
<li>استخدام المعرفة المسبقة لتحديد كيفية دمج المكونات المختلفة وتشكيلها في خزانة ملابس.</li>
<li>التعرف على تسميات ميزات خزانة الملابس وترميز الميزات في بيانات Elasticsearch في ملف <code translate="no">.json</code>.</li>
<li>إعداد بيانات الاستدعاء عن طريق ترميز البيانات غير المهيكلة إلى متجهات.</li>
<li>استخدام قاعدة بيانات Milvus قاعدة بيانات المتجهات لترتيب النتائج المسترجعة التي تم الحصول عليها في الخطوة السابقة.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/offline_data_flow_f91ac9cf4c.png" alt="offline data flow" class="doc-image" id="offline-data-flow" />
   </span> <span class="img-wrapper"> <span>تدفق البيانات دون اتصال بالإنترنت</span> </span></p>
<h3 id="Online-data-flow" class="common-anchor-header">تدفق البيانات عبر الإنترنت</h3><ol>
<li>تلقي طلب الاستعلام من المستخدمين وجمع ملفات تعريف المستخدمين.</li>
<li>فهم استعلام المستخدم من خلال تحديد متطلباتهم لخزانة الملابس.</li>
<li>البحث الخشن باستخدام Elasticsearch.</li>
<li>تسجيل النتائج التي تم الحصول عليها من البحث الخشن وترتيبها بناءً على حساب تشابه المتجهات في ميلفوس.</li>
<li>المعالجة اللاحقة وتنظيم النتائج على المنصة الخلفية لإنشاء النتائج النهائية.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/online_data_flow_1f2af25cc3.png" alt="online data flow" class="doc-image" id="online-data-flow" />
   </span> <span class="img-wrapper"> <span>تدفق البيانات عبر الإنترنت</span> </span></p>
<h3 id="Data-post-processing" class="common-anchor-header">المعالجة اللاحقة للبيانات</h3><p>يختلف منطق العمل بين كل شركة وأخرى. يمكنك إضافة لمسة نهائية للنتائج من خلال تطبيق منطق العمل الخاص بشركتك.</p>
<h2 id="System-demo" class="common-anchor-header">عرض توضيحي للنظام<button data-href="#System-demo" class="anchor-icon" translate="no">
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
    </button></h2><p>الآن دعنا نرى كيف يعمل النظام الذي بنيناه بالفعل.</p>
<p>تعرض واجهة المستخدم (UI) إمكانية وجود مجموعات مختلفة من مكونات خزانة الملابس.</p>
<p>يتم تصنيف كل مكون حسب ميزته (الحجم واللون وما إلى ذلك) وتخزينه في Elasticsearch (ES). عند تخزين التسميات في ES، هناك أربعة حقول بيانات رئيسية يجب ملؤها: المعرف والعلامات ومسار التخزين وحقول الدعم الأخرى. يتم استخدام ES والبيانات المصنفة في ES لاستدعاء دقيق وتصفية السمات.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/es_d5b0639610.png" alt="es" class="doc-image" id="es" />
   </span> <span class="img-wrapper"> <span>es</span> </span></p>
<p>ثم تُستخدم خوارزميات الذكاء الاصطناعي المختلفة لترميز خزانة الملابس إلى مجموعة من المتجهات. يتم تخزين مجموعات المتجهات في Milvus للبحث عن التشابه والترتيب. تُرجع هذه الخطوة نتائج أكثر دقة ودقة.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_38dd93a439.jpeg" alt="Milvus" class="doc-image" id="milvus" />
   </span> <span class="img-wrapper"> <span>ميلفوس</span> </span></p>
<p>يشكل كل من Elasticsearch و Milvus ومكونات النظام الأخرى مجتمعةً منصة تصميم التخصيص ككل. أثناء الاستدعاء، تكون اللغة الخاصة بالمجال (DSL) في Elasticsearch و Milvus على النحو التالي.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/dsl_df60097d23.png" alt="dsl" class="doc-image" id="dsl" />
   </span> <span class="img-wrapper"> <span>dsl</span> </span></p>
<h2 id="Looking-for-more-resources" class="common-anchor-header">هل تبحث عن المزيد من الموارد؟<button data-href="#Looking-for-more-resources" class="anchor-icon" translate="no">
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
    </button></h2><p>تعرف كيف يمكن لقاعدة بيانات Milvus المتجهة تشغيل المزيد من تطبيقات الذكاء الاصطناعي:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-06-23-How-Short-video-Platform-Likee-Removes-Duplicate-Videos-with-Milvus.md">كيف تزيل منصة الفيديو القصيرة Likee مقاطع الفيديو المكررة باستخدام Milvus</a></li>
<li><a href="https://milvus.io/blog/2022-06-20-Zhentu-the-Photo-Fraud-Detector-Based-on-Milvus.md">Zhentu - كاشف الاحتيال في الصور استناداً إلى Milvus</a></li>
</ul>
