---
id: 2021-11-08-frustrated-with-new-data-our-vector-database-can-help.md
title: مقدمة
author: Zilliz
date: 2021-11-08T00:00:00.000Z
desc: >-
  تصميم وممارسة أنظمة قواعد بيانات المتجهات الموجهة للذكاء الاصطناعي ذات الأغراض
  العامة
cover: assets.zilliz.com/Frustrated_with_new_data_5051d3ad15.png
tag: Engineering
---
<custom-h1>هل تشعر بالإحباط من البيانات الجديدة؟ يمكن لقاعدة بيانات Vector الخاصة بنا المساعدة</custom-h1><p>في عصر البيانات الضخمة، ما هي تقنيات وتطبيقات قواعد البيانات التي ستبرز في عصر البيانات الضخمة؟ ما الذي سيُغيّر قواعد البيانات؟</p>
<p>مع البيانات غير المهيكلة التي تمثل ما يقرب من 80-90% من جميع البيانات المخزنة؛ ما الذي يفترض أن نفعله ببحيرات البيانات المتنامية هذه؟ قد يفكر المرء في استخدام الأساليب التحليلية التقليدية، ولكن هذه الأساليب تفشل في استخلاص المعلومات المفيدة، هذا إن وجدت معلومات على الإطلاق. وللإجابة على هذا السؤال، شارك "الفرسان الثلاثة" من فريق البحث والتطوير في شركة Zilliz، وهم الدكتور رينتونغ قوه والسيد شياوفان لوان والدكتور شياومنغ يي، في تأليف مقال لمناقشة التصميم والتحديات التي تواجهنا عند بناء نظام قاعدة بيانات متجهية للأغراض العامة.</p>
<p>وقد تم تضمين هذا المقال في مجلة Programmer، وهي مجلة تصدرها شبكة CSDN، أكبر مجتمع لمطوري البرمجيات في الصين. يتضمن هذا العدد من "المبرمج" أيضًا مقالات بقلم جيفري أولمان، الحائز على جائزة تورينج لعام 2020، ويان ليكون، الحائز على جائزة تورينج لعام 2018، ومارك بورتر، رئيس قسم التكنولوجيا في MongoDB، وزينكون يانغ، مؤسس OceanBase، ودونغشو هوانغ، مؤسس PingCAP، وغيرهم.</p>
<p>فيما يلي نشارك معك المقالة الكاملة:</p>
<custom-h1>تصميم وممارسة أنظمة قواعد البيانات المتجهة ذات الأغراض العامة الموجهة نحو الذكاء الاصطناعي</custom-h1><h2 id="Introduction" class="common-anchor-header">مقدمة<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>يمكن لتطبيقات البيانات الحديثة التعامل بسهولة مع البيانات المهيكلة، والتي تمثل حوالي 20% من بيانات اليوم. وتوجد في صندوق أدواتها أنظمة مثل قواعد البيانات العلائقية وقواعد بيانات NoSQL وغيرها؛ وعلى النقيض من ذلك، فإن البيانات غير المهيكلة، والتي تمثل حوالي 80% من جميع البيانات، لا توجد أي أنظمة موثوقة في مكانها. ولحل هذه المشكلة، سيناقش هذا المقال نقاط الضعف التي تعاني منها تحليلات البيانات التقليدية مع البيانات غير المهيكلة وسيناقش كذلك البنية والتحديات التي واجهتنا في بناء نظام قاعدة البيانات المتجهة للأغراض العامة.</p>
<h2 id="Data-Revolution-in-the-AI-era" class="common-anchor-header">ثورة البيانات في عصر الذكاء الاصطناعي<button data-href="#Data-Revolution-in-the-AI-era" class="anchor-icon" translate="no">
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
    </button></h2><p>في ظل التطور السريع لتقنيات الجيل الخامس وإنترنت الأشياء، تسعى الصناعات إلى مضاعفة قنوات جمع البيانات وإسقاط العالم الحقيقي على الفضاء الرقمي. وعلى الرغم من أنها جلبت بعض التحديات الهائلة، إلا أنها جلبت معها أيضاً فوائد هائلة للصناعة المتنامية. أحد هذه التحديات الصعبة هو كيفية الحصول على رؤى أعمق في هذه البيانات الجديدة الواردة.</p>
<p>وفقًا لإحصاءات IDC، تم إنشاء أكثر من 40,000 إكسابايت من البيانات الجديدة في جميع أنحاء العالم في عام 2020 وحده. من إجمالي هذه البيانات، 20٪ فقط من هذه البيانات هي بيانات منظمة - وهي بيانات منظمة للغاية ويسهل تنظيمها وتحليلها من خلال الحسابات الرقمية والجبر العلائقي. وعلى النقيض من ذلك، فإن البيانات غير المنظمة (التي تستحوذ على الـ 80% المتبقية) غنية للغاية في اختلافات أنواع البيانات، مما يجعل من الصعب الكشف عن الدلالات العميقة من خلال أساليب تحليل البيانات التقليدية.</p>
<p>لحسن الحظ، نحن نشهد تطورًا متزامنًا وسريعًا في البيانات غير المهيكلة والذكاء الاصطناعي، حيث يتيح لنا الذكاء الاصطناعي فهم البيانات بشكل أفضل من خلال أنواع مختلفة من الشبكات العصبية، كما هو موضح في الشكل 1.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/newdata1_d5c34497d0.jpeg" alt="newdata1.jpeg" class="doc-image" id="newdata1.jpeg" />
   </span> <span class="img-wrapper"> <span>newdata1.jpeg</span> </span></p>
<p>سرعان ما اكتسبت تقنية التضمين شعبية كبيرة بعد ظهور Word2vec لأول مرة، حيث وصلت فكرة "تضمين كل شيء" إلى جميع قطاعات التعلم الآلي. أدى ذلك إلى ظهور طبقتين رئيسيتين للبيانات: طبقة البيانات الخام وطبقة البيانات المتجهة. تتألف طبقة البيانات الخام من البيانات غير المهيكلة وأنواع معينة من البيانات المهيكلة؛ أما طبقة المتجهات فهي مجموعة من التضمينات القابلة للتحليل بسهولة والتي تنشأ من الطبقة الخام التي تمر عبر نماذج التعلم الآلي.</p>
<p>عند مقارنتها بالبيانات الخام، تتميز البيانات المضمّنة في المتجهات بالمزايا التالية:</p>
<ul>
<li>تعد متجهات التضمين نوعًا مجردًا من البيانات، مما يعني أنه يمكننا بناء نظام جبر موحد مخصص لتقليل تعقيد البيانات غير المنظمة.</li>
<li>يتم التعبير عن متجهات التضمين من خلال متجهات الفاصلة العائمة الكثيفة، مما يسمح للتطبيقات بالاستفادة من SIMD. مع دعم SIMD من قِبل وحدات معالجة الرسومات وجميع وحدات المعالجة المركزية الحديثة تقريبًا، يمكن أن تحقق الحسابات عبر المتجهات أداءً عاليًا بتكلفة منخفضة نسبيًا.</li>
<li>تشغل البيانات المتجهة المشفرة عبر نماذج التعلم الآلي مساحة تخزين أقل من البيانات الأصلية غير المهيكلة، مما يسمح بإنتاجية أعلى.</li>
<li>يمكن أيضًا إجراء العمليات الحسابية عبر متجهات التضمين. ويوضح الشكل 2 مثالاً على المطابقة التقريبية الدلالية عبر النماذج - الصور الموضحة في الشكل هي نتيجة مطابقة تضمينات الكلمات مع تضمينات الصور.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/newdata2_14e0554305.png" alt="newdata2.png" class="doc-image" id="newdata2.png" />
   </span> <span class="img-wrapper"> <span>newdata2.png</span> </span></p>
<p>كما هو موضح في الشكل 3، يمكن الجمع بين دلالات الصور والكلمات من خلال عملية جمع وطرح بسيطة للمتجهات عبر التضمينات المقابلة لها.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/newdata3_3c71fc56b9.png" alt="newdata3.png" class="doc-image" id="newdata3.png" />
   </span> <span class="img-wrapper"> <span>newdata3.png</span> </span></p>
<p>بصرف النظر عن الميزات المذكورة أعلاه، يدعم هذان المشغلان بيانات استعلام أكثر تعقيدًا في السيناريوهات العملية. توصية المحتوى مثال معروف جيدًا. بشكل عام، يقوم النظام بتضمين كل من المحتوى وتفضيلات المشاهدة الخاصة بالمستخدمين. بعد ذلك، يقوم النظام بمطابقة تفضيلات المستخدم المضمنة مع المحتوى المضمن الأكثر تشابهًا من خلال تحليل التشابه الدلالي، مما ينتج عنه محتوى جديد مشابه لتفضيلات المستخدمين. لا تقتصر طبقة البيانات المتجهة هذه على أنظمة التوصية فحسب، بل تشمل حالات الاستخدام التجارة الإلكترونية، وتحليل البرمجيات الخبيثة، وتحليل البيانات، والتحقق من القياسات الحيوية، وتحليل الصيغ الكيميائية، والتمويل، والتأمين، وما إلى ذلك.</p>
<h2 id="Unstructured-data-requires-a-complete-basic-software-stack" class="common-anchor-header">تتطلب البيانات غير المهيكلة حزمة برمجيات أساسية كاملة<button data-href="#Unstructured-data-requires-a-complete-basic-software-stack" class="anchor-icon" translate="no">
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
    </button></h2><p>تقع برمجيات النظام في أساس جميع التطبيقات الموجهة نحو البيانات، ولكن برمجيات نظام البيانات التي تم إنشاؤها على مدى العقود العديدة الماضية، مثل قواعد البيانات ومحركات تحليل البيانات وما إلى ذلك، تهدف إلى التعامل مع البيانات المنظمة. تعتمد تطبيقات البيانات الحديثة بشكل حصري تقريباً على البيانات غير المنظمة ولا تستفيد من أنظمة إدارة قواعد البيانات التقليدية.</p>
<p>ولمعالجة هذه المشكلة، قمنا بتطوير نظام قاعدة بيانات متجهية للأغراض العامة موجه للذكاء الاصطناعي ومفتوح المصدر باسم <em>Milvus</em> (المرجع رقم 1~2). عند مقارنته بأنظمة قواعد البيانات التقليدية، يعمل نظام Milvus على طبقة مختلفة من البيانات. تعمل قواعد البيانات التقليدية، مثل قواعد البيانات العلائقية، وقواعد بيانات KV، وقواعد البيانات النصية، وقواعد بيانات الصور/الفيديو، إلخ... على طبقة البيانات الخام، بينما يعمل ميلفوس على طبقة البيانات المتجهة.</p>
<p>في الفصول التالية، سنناقش الميزات الجديدة والتصميم المعماري والتحديات التقنية التي واجهناها عند بناء ميلفوس.</p>
<h2 id="Major-attributes-of-vector-database" class="common-anchor-header">السمات الرئيسية لقاعدة بيانات المتجهات<button data-href="#Major-attributes-of-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>تقوم قواعد بيانات المتجهات بتخزين المتجهات واسترجاعها وتحليلها، وكما هو الحال مع أي قاعدة بيانات أخرى، توفر أيضًا واجهة قياسية لعمليات CRUD. وبالإضافة إلى هذه السمات "القياسية"، فإن السمات المذكورة أدناه هي أيضًا صفات مهمة لقاعدة بيانات المتجهات:</p>
<ul>
<li><strong>دعم مشغلي المتجهات عالية الكفاءة</strong></li>
</ul>
<p>يركز دعم مشغلي المتجهات في محرك التحليل على مستويين. أولاً، يجب أن تدعم قاعدة بيانات المتجهات أنواعًا مختلفة من المشغلات، على سبيل المثال، مطابقة التشابه الدلالي والحساب الدلالي المذكور أعلاه. بالإضافة إلى ذلك، يجب أن تدعم مجموعة متنوعة من مقاييس التشابه لحسابات التشابه الأساسية. عادةً ما يتم قياس هذا التشابه كميًا كمسافة مكانية بين المتجهات، مع وجود مقاييس شائعة هي المسافة الإقليدية ومسافة جيب التمام ومسافة الضرب الداخلي.</p>
<ul>
<li><strong>دعم فهرسة المتجهات</strong></li>
</ul>
<p>بالمقارنة مع الفهارس المستندة إلى الشجرة ب أو الشجرة المتجهة في قواعد البيانات التقليدية، عادةً ما تستهلك الفهارس المتجهة عالية الأبعاد موارد حوسبة أكثر بكثير. نوصي باستخدام خوارزميات التجميع وفهرسة الرسم البياني، وإعطاء الأولوية لعمليات المصفوفة والمتجه، وبالتالي الاستفادة الكاملة من قدرات تسريع حساب المتجهات للأجهزة المذكورة سابقًا.</p>
<ul>
<li><strong>تجربة مستخدم متسقة عبر بيئات النشر المختلفة</strong></li>
</ul>
<p>عادةً ما يتم تطوير قواعد البيانات المتجهة ونشرها في بيئات مختلفة. في المرحلة التمهيدية، يعمل علماء البيانات ومهندسو الخوارزميات في الغالب على أجهزة الكمبيوتر المحمولة ومحطات العمل الخاصة بهم، حيث يولون اهتمامًا أكبر لكفاءة التحقق وسرعة التكرار. عند اكتمال التحقق، قد يقومون بنشر قاعدة البيانات بالحجم الكامل على مجموعة خاصة أو على السحابة. لذلك، يجب أن يوفر نظام قاعدة البيانات المتجهة المؤهل أداءً وتجربة مستخدم متسقة عبر بيئات النشر المختلفة.</p>
<ul>
<li><strong>دعم البحث المختلط</strong></li>
</ul>
<p>تظهر تطبيقات جديدة مع انتشار قواعد البيانات المتجهة في كل مكان. من بين كل هذه المتطلبات، أكثر ما يتم ذكره بشكل متكرر هو البحث المختلط على المتجهات وأنواع أخرى من البيانات. ومن الأمثلة القليلة على ذلك البحث التقريبي الأقرب إلى الجار (ANNS) بعد التصفية القياسية، والاستدعاء متعدد القنوات من البحث في النص الكامل والبحث المتجه، والبحث الهجين للبيانات المكانية الزمانية والبيانات المتجهة. تتطلب مثل هذه التحديات قابلية التوسع المرن وتحسين الاستعلامات لدمج محركات البحث المتجه بفعالية مع محركات البحث الأقرب إلى النص الكامل والنص ومحركات البحث الأخرى.</p>
<ul>
<li><strong>البنية السحابية الأصلية</strong></li>
</ul>
<p>يتزايد حجم فطر البيانات المتجهة مع النمو الهائل في جمع البيانات. تتوافق البيانات المتجهة عالية الأبعاد ذات الحجم التريليوني مع آلاف التيرابايت من التخزين، وهو ما يتجاوز بكثير حدود عقدة واحدة. نتيجةً لذلك، تُعد قابلية التوسيع الأفقي قدرة أساسية لقاعدة بيانات المتجهات، ويجب أن تلبي متطلبات المستخدمين من المرونة وسرعة النشر. علاوةً على ذلك، يجب أن تقلل أيضًا من تعقيدات تشغيل النظام وصيانته مع تحسين إمكانية المراقبة بمساعدة البنية التحتية السحابية. تأتي بعض هذه الاحتياجات في شكل عزل متعدد المستأجرين ولقطات البيانات والنسخ الاحتياطي وتشفير البيانات وتصور البيانات، وهي أمور شائعة في قواعد البيانات التقليدية.</p>
<h2 id="Vector-database-system-architecture" class="common-anchor-header">بنية نظام قاعدة البيانات المتجهة<button data-href="#Vector-database-system-architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>يتبع نظام Milvus 2.0 مبادئ تصميم &quot;السجل كبيانات&quot;، و&quot;معالجة الدُفعات والدفق الموحد&quot;، و&quot;عديم الحالة&quot;، و&quot;الخدمات المصغرة&quot;. يصور الشكل 4 البنية الشاملة لـ Milvus 2.0.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/newdata4_b7f3ab6969.png" alt="newdata4.png" class="doc-image" id="newdata4.png" />
   </span> <span class="img-wrapper"> <span>newdata4.png</span> </span></p>
<p><strong>السجل كبيانات</strong>: لا يحتفظ ميلفوس 2.0 بأي جداول فعلية. بدلاً من ذلك، فإنه يضمن موثوقية البيانات من خلال ثبات السجل ولقطات السجل. يقوم وسيط السجل (العمود الفقري للنظام) بتخزين السجلات وفصل المكونات والخدمات من خلال آلية نشر السجل والاشتراك في السجل (pub-sub). وكما هو موضح في الشكل 5، يتألف وسيط السجل من &quot;تسلسل السجل&quot; و&quot;مشترك السجل&quot;. يسجل تسلسل السجل جميع العمليات التي تغير حالة المجموعة (ما يعادل جدولاً في قاعدة بيانات علائقية)؛ ويشترك المشترك في السجل في تسلسل السجل لتحديث بياناته المحلية وتقديم الخدمات في شكل نسخ للقراءة فقط. تتيح آلية pub-sub أيضًا إمكانية توسيع النظام من حيث التقاط بيانات التغيير (CDC) والنشر الموزع عالميًا.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/newdata5_853dd38bc3.png" alt="newdata5.png" class="doc-image" id="newdata5.png" />
   </span> <span class="img-wrapper"> <span>newdata5.png</span> </span></p>
<p><strong>معالجة موحدة للدفعات والدفق</strong>: يسمح دفق السجل لـ Milvus بتحديث البيانات في الوقت الحقيقي، وبالتالي ضمان إمكانية التسليم في الوقت الحقيقي. علاوةً على ذلك، من خلال تحويل دفعات البيانات إلى لقطات من السجل وبناء فهرس على اللقطات، تستطيع Milvus تحقيق كفاءة استعلام أعلى. أثناء الاستعلام، تدمج Milvus نتائج الاستعلام من كل من البيانات الإضافية والبيانات التاريخية لضمان تكامل البيانات التي يتم إرجاعها. يوازن هذا التصميم بشكل أفضل بين الأداء والكفاءة في الوقت الحقيقي، مما يخفف من عبء الصيانة لكل من الأنظمة المتصلة وغير المتصلة بالإنترنت مقارنةً ببنية لامدا التقليدية.</p>
<p><strong>عديم الحالة</strong>: تحرر البنية التحتية السحابية ومكونات التخزين مفتوحة المصدر Milvus من استمرار البيانات داخل مكوناتها الخاصة. يقوم Milvus 2.0 باستمرار البيانات مع ثلاثة أنواع من التخزين: تخزين البيانات الوصفية وتخزين السجل وتخزين الكائنات. لا يقوم تخزين البيانات الوصفية بتخزين البيانات الوصفية فحسب، بل يتعامل أيضًا مع اكتشاف الخدمات وإدارة العقدة. يقوم تخزين السجل بتنفيذ ثبات البيانات المتزايد والاشتراك في نشر البيانات. يخزن تخزين الكائنات لقطات السجل والفهارس وبعض نتائج الحسابات الوسيطة.</p>
<p><strong>الخدمات المصغرة</strong>: تتبع Milvus مبادئ الفصل بين مستوى البيانات ومستوى التحكم، وفصل القراءة/الكتابة، وفصل المهام عبر الإنترنت/خارج الإنترنت. وهي تتألف من أربع طبقات من الخدمة: طبقة الوصول، وطبقة المنسق، وطبقة العامل، وطبقة التخزين. هذه الطبقات مستقلة بشكل متبادل عندما يتعلق الأمر بالتوسع والتعافي من الكوارث. بصفتها الطبقة الأمامية ونقطة نهاية المستخدم، تتعامل طبقة الوصول مع اتصالات العميل وتتحقق من صحة طلبات العميل وتجمع نتائج الاستعلام. وباعتبارها &quot;العقل&quot; للنظام، تتولى طبقة المنسق مهام إدارة طوبولوجيا المجموعة وموازنة التحميل وإعلان البيانات وإدارة البيانات. تحتوي الطبقة العاملة على "أطراف" النظام، حيث تقوم بتنفيذ تحديثات البيانات والاستعلامات وعمليات بناء الفهرس. وأخيرًا، تكون طبقة التخزين مسؤولة عن ثبات البيانات وتكرارها. وعموماً، يضمن هذا التصميم القائم على الخدمات المصغرة تعقيداً للنظام يمكن التحكم فيه، حيث يكون كل مكون مسؤولاً عن وظيفته المقابلة. يوضح Milvus حدود الخدمة من خلال واجهات واضحة المعالم، ويفصل بين الخدمات على أساس دقة التفاصيل، مما يزيد من تحسين قابلية التوسع المرن وتوزيع الموارد.</p>
<h2 id="Technical-challenges-faced-by-vector-databases" class="common-anchor-header">التحديات التقنية التي تواجه قواعد البيانات المتجهة<button data-href="#Technical-challenges-faced-by-vector-databases" class="anchor-icon" translate="no">
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
    </button></h2><p>تركزت الأبحاث المبكرة حول قواعد البيانات المتجهة بشكل أساسي على تصميم هياكل الفهرس عالية الكفاءة وطرق الاستعلام - وقد نتج عن ذلك مجموعة متنوعة من مكتبات خوارزميات البحث المتجهية (المرجع رقم 3 ~ 5). على مدى السنوات القليلة الماضية، ألقى عدد متزايد من الفرق الأكاديمية والهندسية نظرة جديدة على مشكلات البحث المتجه من منظور تصميم النظام، واقترحوا بعض الحلول المنهجية. بتلخيص الدراسات الحالية وطلب المستخدمين، نصنف التحديات التقنية الرئيسية لقواعد البيانات المتجهة على النحو التالي</p>
<ul>
<li><strong>تحسين نسبة التكلفة إلى الأداء بالنسبة للحمل</strong></li>
</ul>
<p>مقارنةً بأنواع البيانات التقليدية، يستغرق تحليل البيانات المتجهة موارد تخزين وحوسبة أكثر بكثير بسبب أبعادها العالية. وعلاوة على ذلك، أظهر المستخدمون تفضيلات متنوعة لخصائص التحميل وتحسين نسبة التكلفة إلى الأداء بالنسبة إلى حلول البحث عن المتجهات. على سبيل المثال، يفضل المستخدمون، الذين يعملون مع مجموعات بيانات كبيرة للغاية (عشرات أو مئات المليارات من المتجهات)، الحلول ذات تكاليف تخزين البيانات المنخفضة والتباين في زمن انتقال البحث، بينما قد يطلب آخرون أداء بحث أعلى ومتوسط زمن انتقال غير متغير. لتلبية مثل هذه التفضيلات المتنوعة، يجب أن يكون مكون الفهرس الأساسي لقاعدة بيانات المتجهات قادرًا على دعم هياكل الفهرس وخوارزميات البحث بأنواع مختلفة من أجهزة التخزين والحوسبة.</p>
<p>على سبيل المثال، يجب مراعاة تخزين البيانات المتجهة وبيانات الفهرس المقابلة في وسائط تخزين أرخص (مثل NVM و SSD) عند خفض تكاليف التخزين. ومع ذلك، تعمل معظم خوارزميات البحث المتجه الحالية على البيانات المقروءة مباشرةً من الذاكرة. لتجنب فقدان الأداء الناجم عن استخدام محركات الأقراص، يجب أن تكون قاعدة البيانات المتجهة قادرة على استغلال موقع الوصول إلى البيانات مع خوارزميات البحث بالإضافة إلى القدرة على التكيف مع حلول التخزين للبيانات المتجهة وهيكل الفهرس (المرجع رقم 6~8). من أجل تحسين الأداء، ركزت الأبحاث المعاصرة على تقنيات تسريع الأجهزة التي تشمل وحدة معالجة الرسومات، ووحدة المعالجة العصبية ووحدة المعالجة العصبية و FPGA، وما إلى ذلك (المرجع رقم 9). ومع ذلك، تتنوع الأجهزة والرقائق الخاصة بالتسريع في تصميم البنية الخاصة بالتسريع، ولم يتم حل مشكلة التنفيذ الأكثر كفاءة عبر مسرعات الأجهزة المختلفة.</p>
<ul>
<li><strong>تكوين النظام الآلي وضبطه</strong></li>
</ul>
<p>تسعى معظم الدراسات الحالية حول خوارزميات البحث المتجه إلى تحقيق توازن مرن بين تكاليف التخزين والأداء الحسابي ودقة البحث. بشكل عام، تؤثر كل من معلمات الخوارزمية وميزات البيانات على الأداء الفعلي للخوارزمية. ونظرًا لاختلاف متطلبات المستخدم من حيث التكاليف والأداء، فإن اختيار طريقة البحث المتجه التي تناسب احتياجاته وميزات البيانات يشكل تحديًا كبيرًا.</p>
<p>ومع ذلك، فإن الأساليب اليدوية لتحليل تأثيرات توزيع البيانات على خوارزميات البحث ليست فعالة بسبب الأبعاد العالية للبيانات المتجهة. ولمعالجة هذه المشكلة، تسعى الأوساط الأكاديمية والصناعية إلى إيجاد حلول توصية خوارزمية تعتمد على التعلم الآلي (المرجع رقم 10).</p>
<p>كما يعد تصميم خوارزمية بحث متجه ذكي مدعوم بالتعلم الآلي نقطة بحث ساخنة أيضًا. بشكل عام، يتم تطوير خوارزميات البحث المتجه الحالية بشكل عام لبيانات المتجهات ذات الأبعاد وأنماط التوزيع المختلفة. ونتيجة لذلك، فإنها لا تدعم هياكل فهرس محددة وفقًا لخصائص البيانات، وبالتالي لا يتوفر لها مساحة كبيرة للتحسين. يجب أن تستكشف الدراسات المستقبلية أيضًا تقنيات التعلم الآلي الفعالة التي يمكنها تصميم هياكل الفهرس وفقًا لخصائص البيانات المختلفة (المرجع رقم 11-12).</p>
<ul>
<li><strong>دعم دلالات الاستعلام المتقدمة</strong></li>
</ul>
<p>غالبًا ما تعتمد التطبيقات الحديثة على استعلامات أكثر تقدمًا عبر المتجهات - لم تعد دلالات البحث التقليدية الأقرب من الجوار قابلة للتطبيق على البحث في البيانات المتجهة. علاوة على ذلك، يظهر الطلب على البحث المشترك عبر قواعد بيانات متجهات متعددة أو على البيانات المتجهة وغير المتجهة (المرجع رقم 13).</p>
<p>على وجه التحديد، تنمو الاختلافات في مقاييس المسافة لتشابه المتجهات بسرعة. لا يمكن أن تلبي درجات التشابه التقليدية، مثل المسافة الإقليدية ومسافة الضرب الداخلي ومسافة جيب التمام جميع متطلبات التطبيق. مع تعميم تكنولوجيا الذكاء الاصطناعي، تقوم العديد من الصناعات بتطوير مقاييس التشابه المتجهية الخاصة بمجالها الخاص، مثل مسافة تانيموتو ومسافة ماهالانوبيس والمسافة الفوقية والبنية الفوقية والبنية الفرعية. ويُعد دمج مقاييس التقييم هذه في خوارزميات البحث الحالية وتصميم خوارزميات جديدة تستخدم المقاييس المذكورة مشكلتين بحثيتين صعبتين.</p>
<p>مع زيادة تعقيد خدمات المستخدم، ستحتاج التطبيقات إلى البحث عبر كل من البيانات المتجهة والبيانات غير المتجهة. على سبيل المثال، يقوم موصى المحتوى بتحليل تفضيلات المستخدمين وعلاقاتهم الاجتماعية ومطابقتها مع الموضوعات الساخنة الحالية لسحب المحتوى المناسب للمستخدمين. تتضمن عمليات البحث هذه عادةً استعلامات على أنواع بيانات متعددة أو عبر أنظمة معالجة بيانات متعددة. يعد دعم عمليات البحث الهجينة هذه بكفاءة ومرونة تحديًا آخر في تصميم النظام.</p>
<h2 id="Authors" class="common-anchor-header">المؤلفون<button data-href="#Authors" class="anchor-icon" translate="no">
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
    </button></h2><p>الدكتور رينتونغ قوه (دكتوراه في برمجيات ونظريات الحاسوب، جامعة هواتشونغ للعلوم والتكنولوجيا)، شريك ومدير البحث والتطوير في شركة زيليز. وهو عضو في اللجنة الفنية للاتحاد الصيني للكمبيوتر المعنية بالحوسبة الموزعة والمعالجة (CCF TCDCP). تركز أبحاثه على قواعد البيانات والنظام الموزع ونظام التخزين المؤقت والحوسبة غير المتجانسة. وقد نُشرت أعماله البحثية في العديد من المؤتمرات والمجلات رفيعة المستوى، بما في ذلك Usenix ATC وICS وDATE وTPDS. يسعى الدكتور قوه بصفته المهندس المعماري لشركة Milvus، إلى إيجاد حلول لتطوير أنظمة تحليل البيانات القائمة على الذكاء الاصطناعي القابلة للتطوير والفعالة من حيث التكلفة.</p>
<p>شياوفان لوان، شريك ومدير الهندسة في شركة Zilliz، وعضو اللجنة الاستشارية الفنية لمؤسسة LF AI &amp; Data Foundation. عمل على التوالي في المقر الرئيسي لشركة أوراكل في الولايات المتحدة وشركة Hedvig، وهي شركة ناشئة للتخزين المعرّف بالبرمجيات. انضم إلى فريق قاعدة بيانات علي بابا السحابية وكان مسؤولاً عن تطوير قاعدة بيانات NoSQL HBase وLindorm. حصل لوان على درجة الماجستير في هندسة الحاسبات الإلكترونية من جامعة كورنيل.</p>
<p>الدكتور شياومينغ يي (حاصل على درجة الدكتوراه في هندسة الحاسوب من جامعة هواتشونغ للعلوم والتكنولوجيا)، باحث أول وقائد فريق البحث في شركة Zilliz. تركز أبحاثه على إدارة البيانات عالية الأبعاد، واسترجاع المعلومات على نطاق واسع، وتخصيص الموارد في الأنظمة الموزعة. وقد نُشرت أعمال الدكتور يي البحثية في مجلات رائدة ومؤتمرات دولية بما في ذلك مجلة IEEE Network Magazine، وIEEE/ACM TON، وACM SIGMOD، وIEEE ICDCS، وACM TOMPECS.</p>
<p>تخرج فيليب هالتماير، مهندس بيانات زيليز، من جامعة كاليفورنيا في سانتا كروز وحصل على بكالوريوس في علوم الحاسوب. بعد انضمامه إلى Zilliz، يقضي فيليب معظم وقته في العمل على عمليات النشر السحابية، وتفاعلات العملاء، والمحادثات التقنية، وتطوير تطبيقات الذكاء الاصطناعي.</p>
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
    </button></h2><ol>
<li>مشروع ميلفوس: https://github.com/milvus-io/milvus</li>
<li>ميلفوس: نظام إدارة بيانات المتجهات المصمم لغرض معين، SIGMOD'21</li>
<li>مشروع فايس: https://github.com/facebookresearch/faiss</li>
<li>مشروع أنوي: https://github.com/spotify/annoy</li>
<li>مشروع SPTAG: https://github.com/microsoft/SPTAG</li>
<li>GRIP: نظام GRIP: بحث متعدد المخازن عالي الأداء عالي السعة والأداء لأقرب جار لمحرك بحث المتجهات، CIKM'19</li>
<li>DiskANN: بحث دقيق سريع دقيق بمليار نقطة لأقرب جار على عقدة واحدة، NIPS'19</li>
<li>HM-ANN: بحث أقرب جار فعال بمليار نقطة على ذاكرة غير متجانسة، NIPS'20</li>
<li>SONG: بحث تقريبي لأقرب جار على وحدة معالجة الرسومات، ICDE'20</li>
<li>عرض توضيحي لخدمة الضبط التلقائي لنظام إدارة قواعد البيانات التلقائي، VLDB'18</li>
<li>حالة هياكل الفهرس المستفادة، SIGMOD'18</li>
<li>تحسين البحث التقريبي لأقرب جار من خلال الإنهاء المبكر التكيفي المتعلم، SIGMOD'20</li>
<li>AnalyticDB-V: محرك تحليلي هجين نحو دمج الاستعلام للبيانات المهيكلة وغير المهيكلة، VLDB'20</li>
</ol>
<h2 id="Engage-with-our-open-source-community" class="common-anchor-header">تفاعل مع مجتمعنا مفتوح المصدر:<button data-href="#Engage-with-our-open-source-community" class="anchor-icon" translate="no">
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
<li>ابحث عن أو ساهم في Milvus على <a href="https://bit.ly/3khejQB">GitHub</a>.</li>
<li>تفاعل مع المجتمع عبر <a href="https://bit.ly/307HVsY">المنتدى</a>.</li>
<li>تواصل معنا على <a href="https://bit.ly/3wn5aek">تويتر</a>.</li>
</ul>
