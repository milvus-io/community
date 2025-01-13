---
id: building-a-wardrobe-and-outfit-planning-app-with-milvus.md
title: نظرة عامة على النظام
author: Yu Fang
date: 2021-07-09T06:30:06.439Z
desc: >-
  اكتشف كيف تستخدم Mozat قاعدة بيانات Milvus، وهي قاعدة بيانات متجهة مفتوحة
  المصدر، لتشغيل تطبيق أزياء يقدم توصيات مخصصة للأزياء ونظام بحث عن الصور.
cover: assets.zilliz.com/mozat_blog_0ea9218c71.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-a-wardrobe-and-outfit-planning-app-with-milvus
---
<custom-h1>إنشاء تطبيق لتخطيط الملابس والأزياء مع ميلفوس</custom-h1><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_1_5f239a8d48.png" alt="stylepedia-1.png" class="doc-image" id="stylepedia-1.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-1.png</span> </span></p>
<p>تأسست <a href="http://www.mozat.com/home">شركة Mozat</a> في عام 2003، وهي شركة ناشئة يقع مقرها الرئيسي في سنغافورة ولها مكاتب في الصين والمملكة العربية السعودية. تتخصص الشركة في بناء تطبيقات التواصل الاجتماعي والتواصل وأسلوب الحياة. <a href="https://stylepedia.com/">ستايلبيديا</a> هو تطبيق لخزانة الملابس صممته شركة Mozat يساعد المستخدمين على اكتشاف أنماط جديدة والتواصل مع أشخاص آخرين شغوفين بالموضة. وتشمل ميزاته الرئيسية القدرة على تنظيم خزانة ملابس رقمية، وتوصيات أسلوب مخصصة، ووظائف وسائل التواصل الاجتماعي، وأداة بحث عن الصور للعثور على عناصر مشابهة لشيء شوهد على الإنترنت أو في الحياة الواقعية.</p>
<p>يُستخدم<a href="https://milvus.io">ميلفوس</a> لتشغيل نظام البحث عن الصور داخل ستايلبيديا. يتعامل التطبيق مع ثلاثة أنواع من الصور: صور المستخدم، وصور المنتجات، وصور الأزياء. يمكن أن تتضمن كل صورة عنصر واحد أو أكثر، مما يزيد من تعقيد كل استعلام. ولكي يكون مفيدًا، يجب أن يكون نظام البحث عن الصور دقيقًا وسريعًا ومستقرًا، وهي ميزات تضع أساسًا تقنيًا متينًا لإضافة وظائف جديدة للتطبيق مثل اقتراحات الملابس وتوصيات محتوى الموضة.</p>
<h2 id="System-overview" class="common-anchor-header">نظرة عامة على النظام<button data-href="#System-overview" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_system_process_8e7e2ab3e4.png" alt="stylepedia-system-process.png" class="doc-image" id="stylepedia-system-process.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-ystem-process.png</span> </span></p>
<p>ينقسم نظام البحث عن الصور إلى مكونات غير متصلة بالإنترنت وأخرى متصلة بالإنترنت.</p>
<p>في وضع عدم الاتصال بالإنترنت، يتم تحويل الصور إلى متجهات وإدراجها في قاعدة بيانات متجهة (Milvus). في سير عمل البيانات، يتم تحويل صور المنتجات وصور الأزياء ذات الصلة إلى متجهات سمات ذات 512 بُعدًا باستخدام نماذج اكتشاف الكائنات واستخراج السمات. ثم تتم فهرسة بيانات المتجهات وإضافتها إلى قاعدة بيانات المتجهات.</p>
<p>يتم الاستعلام عن قاعدة بيانات الصور عبر الإنترنت ويتم إرجاع الصور المتشابهة إلى المستخدم. على غرار المكوّن غير المتصل بالإنترنت، تتم معالجة صورة الاستعلام عن طريق نماذج اكتشاف الكائنات واستخراج السمات للحصول على متجه السمة. باستخدام متجه الميزة، يبحث برنامج Milvus عن متجهات TopK المتشابهة ويحصل على معرّفات الصور المقابلة لها. أخيرًا، بعد المعالجة اللاحقة (التصفية والفرز وما إلى ذلك)، يتم إرجاع مجموعة من الصور المشابهة لصورة الاستعلام.</p>
<h2 id="Implementation" class="common-anchor-header">التنفيذ<button data-href="#Implementation" class="anchor-icon" translate="no">
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
    </button></h2><p>ينقسم التنفيذ إلى أربع وحدات:</p>
<ol>
<li>الكشف عن الملابس</li>
<li>استخراج الميزات</li>
<li>البحث عن تشابه المتجهات</li>
<li>المعالجة اللاحقة</li>
</ol>
<h3 id="Garment-detection" class="common-anchor-header">الكشف عن الملابس</h3><p>في وحدة الكشف عن الملابس، يُستخدم <a href="https://pytorch.org/hub/ultralytics_yolov5/">YOLOv5،</a> وهو إطار عمل للكشف عن الأهداف على مرحلة واحدة وقائم على المرساة، كنموذج للكشف عن الأجسام لصغر حجمه واستدلاله في الوقت الحقيقي. يقدم أربعة أحجام للنموذج (YOLOv5s/m/l/x)، ولكل حجم محدد إيجابيات وسلبيات. ستعمل النماذج الأكبر حجماً بشكل أفضل (دقة أعلى) ولكنها تتطلب قوة حوسبة أكبر بكثير وتعمل بشكل أبطأ. نظرًا لأن العناصر في هذه الحالة هي عناصر كبيرة نسبيًا ويسهل اكتشافها، فإن النموذج الأصغر، YOLOv5s، يكفي.</p>
<p>يتم التعرّف على عناصر الملابس في كل صورة واقتصاصها لتكون بمثابة مدخلات نموذج استخراج الميزة المستخدمة في المعالجة اللاحقة. في الوقت نفسه، يتنبأ نموذج اكتشاف العناصر أيضًا بتصنيف الملابس وفقًا لفئات محددة مسبقًا (القمصان والملابس الخارجية والسراويل والتنانير والفساتين والسراويل القصيرة).</p>
<h3 id="Feature-extraction" class="common-anchor-header">استخراج الميزات</h3><p>مفتاح البحث عن التشابه هو نموذج استخراج الميزات. يتم تضمين صور الملابس التي تم اقتصاصها في متجهات ذات نقاط عائمة ذات 512 بُعداً تمثل سماتها بتنسيق بيانات رقمية قابلة للقراءة آلياً. تم اعتماد منهجية التعلّم <a href="https://github.com/Joon-Park92/Survey_of_Deep_Metric_Learning">المتري العميق (DML)</a> مع <a href="https://arxiv.org/abs/1905.11946">EfficientNet</a> كنموذج العمود الفقري.</p>
<p>يهدف التعلّم المتري إلى تدريب وحدة استخراج السمات غير الخطية المستندة إلى شبكة CNN (أو وحدة تشفير) لتقليل المسافة بين متجهات السمات المقابلة لنفس فئة العينات، وزيادة المسافة بين متجهات السمات المقابلة لفئات مختلفة من العينات. في هذا السيناريو، تشير فئة العينات نفسها إلى نفس فئة العينات.</p>
<p>تأخذ EfficientNet في الاعتبار كلاً من السرعة والدقة عند قياس عرض الشبكة وعمقها ودقتها بشكل موحد. تُستخدم شبكة EfficientNet-B4 كشبكة لاستخراج الميزات، ومخرجات الطبقة المتصلة بالكامل في نهاية المطاف هي ميزات الصورة اللازمة لإجراء بحث تشابه المتجهات.</p>
<h3 id="Vector-similarity-search" class="common-anchor-header">بحث التشابه المتجه</h3><p>Milvus عبارة عن قاعدة بيانات متجهات مفتوحة المصدر تدعم عمليات الإنشاء والقراءة والتحديث والحذف (CRUD) بالإضافة إلى البحث في الوقت الفعلي تقريبًا على مجموعات بيانات بحجم تريليون بايت. في Stylepedia، يتم استخدامه للبحث عن التشابه المتجه على نطاق واسع لأنه مرن للغاية ومستقر وموثوق وسريع للغاية. يوسع Milvus قدرات مكتبات الفهرس المتجه المستخدمة على نطاق واسع (Faiss وNMSLIB وAnnoy وغيرها)، ويوفر مجموعة من واجهات برمجة التطبيقات البسيطة والبديهية التي تسمح للمستخدمين بتحديد نوع الفهرس المثالي لسيناريو معين.</p>
<p>وبالنظر إلى متطلبات السيناريو وحجم البيانات، استخدم مطورو Stylepedia توزيع وحدة المعالجة المركزية فقط من Milvus المقترن بفهرس HNSW. تم إنشاء مجموعتين مفهرستين، إحداهما للمنتجات والأخرى لصور الأزياء، لتشغيل وظائف التطبيق المختلفة. تنقسم كل مجموعة إلى ستة أقسام بناءً على نتائج الكشف والتصنيف لتضييق نطاق البحث. يقوم برنامج Milvus بإجراء البحث على عشرات الملايين من المتجهات في أجزاء من الثانية، مما يوفر الأداء الأمثل مع الحفاظ على انخفاض تكاليف التطوير وتقليل استهلاك الموارد.</p>
<h3 id="Post-processing" class="common-anchor-header">المعالجة اللاحقة</h3><p>لتحسين التشابه بين نتائج استرجاع الصور وصورة الاستعلام، نستخدم تصفية الألوان وتصفية العلامات الرئيسية (طول الأكمام، وطول الملابس، ونمط الياقة، وما إلى ذلك) لتصفية الصور غير المؤهلة. وبالإضافة إلى ذلك، يتم استخدام خوارزمية تقييم جودة الصورة للتأكد من تقديم صور ذات جودة أعلى للمستخدمين أولاً.</p>
<h2 id="Application" class="common-anchor-header">التطبيق<button data-href="#Application" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="User-uploads-and-image-search" class="common-anchor-header">تحميل المستخدم والبحث عن الصور</h3><p>يمكن للمستخدمين التقاط صور لملابسهم الخاصة وتحميلها على خزانة ستايلبيديا الرقمية، ثم استرجاع صور المنتجات الأكثر تشابهاً مع الصور التي قاموا بتحميلها.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_search_results_0568e20dc0.png" alt="stylepedia-search-results.png" class="doc-image" id="stylepedia-search-results.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-search-results.png</span> </span></p>
<h3 id="Outfit-suggestions" class="common-anchor-header">اقتراحات الملابس</h3><p>من خلال إجراء بحث عن التشابه على قاعدة بيانات ستايلبيديا يمكن للمستخدمين العثور على صور الأزياء التي تحتوي على قطعة أزياء معينة. قد تكون هذه الملابس الجديدة التي يفكر شخص ما في شرائها، أو شيء من مجموعته الخاصة يمكن ارتداؤه أو تنسيقه بشكل مختلف. ومن ثم، من خلال تجميع العناصر التي غالباً ما يتم إقرانها معها، يتم إنشاء اقتراحات للأزياء. على سبيل المثال، يمكن أن تتناسب سترة سوداء لراكبي الدراجات النارية مع مجموعة متنوعة من العناصر، مثل بنطلون جينز أسود ضيق. يمكن للمستخدمين بعد ذلك تصفح صور الأزياء ذات الصلة حيث يحدث هذا التطابق في الصيغة المحددة.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_jacket_outfit_e84914da9e.png" alt="stylepedia-jacket-outfit.png" class="doc-image" id="stylepedia-jacket-outfit.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-jacket-jacket-outfit.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_jacket_snapshot_25f53cc09b.png" alt="stylepedia-jacket-snapshot.png" class="doc-image" id="stylepedia-jacket-snapshot.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-jacket-snapshot.png</span> </span></p>
<h3 id="Fashion-photograph-recommendations" class="common-anchor-header">توصيات صور الأزياء</h3><p>استناداً إلى سجل تصفح المستخدم وإعجاباته ومحتويات خزانة ملابسه الرقمية، يقوم النظام بحساب التشابه ويقدم توصيات صور أزياء مخصصة قد تكون ذات أهمية.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_user_wardrobe_6770c856b9.png" alt="stylepedia-user-wardrobe.png" class="doc-image" id="stylepedia-user-wardrobe.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-user-user-wardrobe.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_streetsnap_rec_901601a34d.png" alt="stylepedia-streetsnap-rec.png" class="doc-image" id="stylepedia-streetsnap-rec.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-streetsnap-rec.png</span> </span></p>
<p>من خلال الجمع بين منهجيات التعلم العميق ومنهجيات الرؤية الحاسوبية، تمكنت موزات من بناء نظام بحث سريع ومستقر ودقيق عن تشابه الصور باستخدام ميلفوس لتشغيل ميزات مختلفة في تطبيق Stylepedia.</p>
<h2 id="Dont-be-a-stranger" class="common-anchor-header">لا تكن غريباً<button data-href="#Dont-be-a-stranger" class="anchor-icon" translate="no">
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
<li>ابحث أو ساهم في Milvus على <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>تفاعل مع المجتمع عبر <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>تواصل معنا على <a href="https://twitter.com/milvusio">تويتر</a>.</li>
</ul>
