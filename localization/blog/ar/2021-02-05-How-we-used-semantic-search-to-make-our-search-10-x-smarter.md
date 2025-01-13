---
id: How-we-used-semantic-search-to-make-our-search-10-x-smarter.md
title: البحث القائم على الكلمات الرئيسية
author: Rahul Yadav
date: 2021-02-05T06:27:15.076Z
desc: >-
  استخدمت Tokopedia شركة Milvus لبناء نظام بحث أكثر ذكاءً بمقدار 10 أضعاف، مما
  أدى إلى تحسين تجربة المستخدم بشكل كبير.
cover: >-
  assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_1_a7bac91379.jpeg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/How-we-used-semantic-search-to-make-our-search-10-x-smarter
---
<custom-h1>كيف استخدمنا البحث الدلالي لجعل بحثنا أكثر ذكاءً 10 مرات</custom-h1><p>ندرك في Tokopedia أن القيمة في مجموعة منتجاتنا لا تتحقق إلا عندما يتمكن المشترون من العثور على المنتجات ذات الصلة بهم، لذلك نسعى جاهدين لتحسين ملاءمة نتائج البحث.</p>
<p>ولتعزيز هذا الجهد، نقدم <strong>بحث التشابه</strong> على Tokopedia. إذا انتقلت إلى صفحة نتائج البحث على الأجهزة المحمولة، ستجد زر "..." الذي يعرض قائمة تمنحك خيار البحث عن منتجات مشابهة للمنتج.</p>
<h2 id="Keyword-based-search" class="common-anchor-header">البحث القائم على الكلمات الرئيسية<button data-href="#Keyword-based-search" class="anchor-icon" translate="no">
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
    </button></h2><p>يستخدم Tokopedia Search <strong>Elasticsearch</strong> للبحث عن المنتجات وترتيبها. لكل طلب بحث، نقوم أولاً بالاستعلام من Elasticsearch، الذي يقوم بترتيب المنتجات وفقًا لاستعلام البحث. يقوم ElasticSearch بتخزين كل كلمة كسلسلة من الأرقام التي تمثل رموز <a href="https://en.wikipedia.org/wiki/ASCII">ASCII</a> (أو UTF) لكل حرف. ينشئ <a href="https://en.wikipedia.org/wiki/Inverted_index">فهرسًا مقلوبًا</a> لاكتشاف المستندات التي تحتوي على كلمات من استعلام المستخدم بسرعة، ثم يعثر على أفضل تطابق بينها باستخدام خوارزميات تسجيل درجات مختلفة. لا تولي خوارزميات تسجيل الدرجات هذه اهتمامًا كبيرًا لما تعنيه الكلمات، بل لمدى تكرار ورودها في المستند، ومدى قربها من بعضها البعض، وما إلى ذلك. من الواضح أن تمثيل ASCII يحتوي على معلومات كافية لنقل الدلالات (ففي النهاية نحن البشر يمكننا فهمها). لسوء الحظ، لا توجد خوارزمية جيدة للكمبيوتر لمقارنة الكلمات المشفرة بترميز ASCII حسب معناها.</p>
<h2 id="Vector-representation" class="common-anchor-header">تمثيل المتجهات<button data-href="#Vector-representation" class="anchor-icon" translate="no">
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
    </button></h2><p>قد يكون أحد الحلول لهذه المشكلة هو التوصل إلى تمثيل بديل، لا يخبرنا فقط عن الحروف التي تحتويها الكلمة بل يخبرنا أيضًا بشيء عن معناها. على سبيل المثال، يمكننا ترميز <em>الكلمات الأخرى التي تُستخدم معها الكلمة بشكل متكرر</em> (ممثلة بالسياق المحتمل). ثم نفترض بعد ذلك أن السياقات المتشابهة تمثل أشياء متشابهة، ونحاول المقارنة بينها باستخدام طرق رياضية. يمكننا حتى أن نجد طريقة لترميز جمل كاملة حسب معناها.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_2_776af567a8.png" alt="Blog_How we used semantic search to make our search 10x smarter_2.png" class="doc-image" id="blog_how-we-used-semantic-search-to-make-our-search-10x-smarter_2.png" />
   </span> <span class="img-wrapper"> <span>مدونة_كيف استخدمنا البحث الدلالي لجعل بحثنا أكثر ذكاءً 10 مرات_2.png</span> </span></p>
<h2 id="Select-an-embedding-similarity-search-engine" class="common-anchor-header">حدد محرك بحث تشابه التضمين<button data-href="#Select-an-embedding-similarity-search-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>الآن بعد أن أصبح لدينا متجهات الميزات، فإن المشكلة المتبقية هي كيفية استرداد المتجهات المتشابهة مع المتجه الهدف من الحجم الكبير من المتجهات. عندما يتعلق الأمر بمحرك البحث عن التضمينات، جربنا POC على عدة محركات متاحة على Github، بعضها مثل FAISS وVearch وMilvus.</p>
<p>نحن نفضل Milvus على المحركات الأخرى بناءً على نتائج اختبار التحميل. من ناحية، لقد استخدمنا FAISS من قبل على فرق أخرى وبالتالي نود تجربة شيء جديد. مقارنةً بـ Milvus، فإن FAISS هو أكثر من مكتبة أساسية، وبالتالي ليس مناسبًا تمامًا للاستخدام. عندما تعلمنا المزيد عن ميلفوس، قررنا أخيرًا اعتماد ميلفوس لميزتيه الرئيسيتين:</p>
<ul>
<li><p>ميلفوس سهل الاستخدام للغاية. كل ما عليك فعله هو سحب صورة Docker الخاصة به وتحديث المعلمات بناءً على السيناريو الخاص بك.</p></li>
<li><p>يدعم المزيد من الفهارس ولديه وثائق داعمة مفصلة.</p></li>
</ul>
<p>وباختصار، فإن Milvus ودود جدًا للمستخدمين والوثائق مفصلة تمامًا. إذا واجهتك أي مشكلة، فيمكنك عادةً العثور على حلول في الوثائق؛ وإلا يمكنك دائمًا الحصول على الدعم من مجتمع Milvus.</p>
<h2 id="Milvus-cluster-service" class="common-anchor-header">خدمة مجموعة ميلفوس العنقودية<button data-href="#Milvus-cluster-service" class="anchor-icon" translate="no">
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
    </button></h2><p>بعد أن قررنا استخدام Milvus كمحرك بحث ناقل للميزات، قررنا استخدام Milvus في إحدى حالات استخدام خدمة الإعلانات حيث أردنا مطابقة الكلمات المفتاحية ذات <a href="https://www.tradegecko.com/blog/wholesale-management/what-is-fill-rate-and-why-does-it-matter-for-wholesalers">معدل التعبئة المنخفض</a> مع الكلمات المفتاحية ذات معدل التعبئة المرتفع. قمنا بتهيئة عقدة مستقلة في بيئة التطوير (DEV) وبدأنا العرض، وكانت تعمل بشكل جيد لبضعة أيام، وأعطتنا مقاييس محسنة لنسبة النقر إلى الظهور/العائد الافتراضي. إذا تعطلت عقدة مستقلة في الإنتاج، فستصبح الخدمة بأكملها غير متاحة. وبالتالي، نحن بحاجة إلى نشر خدمة بحث متاحة بشكل كبير.</p>
<p>يوفر Milvus كلاً من Mishards، وهو برنامج وسيط لتجزئة المجموعة، و Milvus-Helm للتكوين. في Tokopedia نستخدم كتب تشغيل Ansible لإعداد البنية التحتية، لذا أنشأنا كتاب تشغيل لتنسيق البنية التحتية. يوضح الرسم البياني أدناه من وثائق ميلفوس كيف يعمل ميشاردز:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_3_4fa0c8a1a1.png" alt="Blog_How we used semantic search to make our search 10x smarter_3.png" class="doc-image" id="blog_how-we-used-semantic-search-to-make-our-search-10x-smarter_3.png" />
   </span> <span class="img-wrapper"> <span>مدونة_كيف استخدمنا البحث الدلالي لجعل بحثنا أكثر ذكاءً 10 مرات_3.png</span> </span></p>
<p>تقوم Mishards بتتابع الطلب من المنبع إلى وحداته الفرعية التي تقسم طلب المنبع، ثم تجمع نتائج الخدمات الفرعية وتعيدها إلى المنبع. البنية الشاملة للحل العنقودي القائم على Mishards موضحة أدناه: <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_4_724618be4e.jpeg" alt="Blog_How we used semantic search to make our search 10x smarter_4.jpeg" class="doc-image" id="blog_how-we-used-semantic-search-to-make-our-search-10x-smarter_4.jpeg" /><span>مدونة_كيف استخدمنا البحث الدلالي لجعل بحثنا أذكى 10 مرات_4.jpeg</span> </span></p>
<p>توفر الوثائق الرسمية مقدمة واضحة لـ Mishards. يمكنك الرجوع إلى <a href="https://milvus.io/cn/docs/v0.10.2/mishards.md">Mishards</a> إذا كنت مهتمًا.</p>
<p>في خدمة الكلمات الرئيسية إلى الكلمات الرئيسية الخاصة بنا، قمنا بنشر عقدة واحدة قابلة للكتابة، وعقدتين للقراءة فقط، ومثيل واحد من Mishards للبرامج الوسيطة في GCP، باستخدام Milvus ansible. لقد كانت مستقرة حتى الآن. إن أحد المكونات الضخمة التي تجعل من الممكن الاستعلام بكفاءة عن مجموعات البيانات التي يبلغ عددها مليون أو مليار أو حتى تريليون متجه التي تعتمد عليها محركات البحث عن التشابه هو <a href="https://milvus.io/docs/v0.10.5/index.md">الفهرسة،</a> وهي عملية تنظيم البيانات التي تسرّع البحث عن البيانات الضخمة بشكل كبير.</p>
<h2 id="How-does-vector-indexing-accelerate-similarity-search" class="common-anchor-header">كيف تعمل فهرسة المتجهات على تسريع البحث عن التشابه؟<button data-href="#How-does-vector-indexing-accelerate-similarity-search" class="anchor-icon" translate="no">
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
    </button></h2><p>تعمل محركات البحث عن التشابه من خلال مقارنة المدخلات بقاعدة بيانات للعثور على العناصر الأكثر تشابهًا مع المدخلات. الفهرسة هي عملية تنظيم البيانات بكفاءة، وتلعب دورًا رئيسيًا في جعل البحث عن التشابه مفيدًا من خلال تسريع الاستعلامات التي تستغرق وقتًا طويلاً على مجموعات البيانات الضخمة بشكل كبير. بعد فهرسة مجموعة بيانات متجهة ضخمة، يمكن توجيه الاستعلامات إلى مجموعات أو مجموعات فرعية من البيانات التي من المرجح أن تحتوي على متجهات مشابهة لاستعلام الإدخال. من الناحية العملية، يعني هذا عمليًا التضحية بدرجة معينة من الدقة لتسريع الاستعلامات على البيانات المتجهة الضخمة حقًا.</p>
<p>يمكن تشبيه ذلك بقاموس، حيث يتم فرز الكلمات أبجديًا. عند البحث عن كلمة ما، من الممكن الانتقال بسرعة إلى قسم يحتوي فقط على كلمات تحمل نفس الحرف الأول من الكلمة - مما يسرّع بشكل كبير من عملية البحث عن تعريف الكلمة المدخلة.</p>
<h2 id="What-next-you-ask" class="common-anchor-header">ماذا بعد ذلك؟<button data-href="#What-next-you-ask" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_5_035480c8af.jpeg" alt="Blog_How we used semantic search to make our search 10x smarter_5.jpeg" class="doc-image" id="blog_how-we-used-semantic-search-to-make-our-search-10x-smarter_5.jpeg" />
   </span> <span class="img-wrapper"> <span>مدونة_كيف استخدمنا البحث الدلالي لجعل بحثنا أذكى 10 مرات_5.jpeg</span> </span></p>
<p>كما هو موضح أعلاه، لا يوجد حل يناسب الجميع، فنحن نريد دائمًا تحسين أداء النموذج المستخدم للحصول على التضمينات.</p>
<p>أيضًا، من وجهة نظر تقنية، نريد تشغيل نماذج تعلم متعددة في نفس الوقت ومقارنة النتائج من التجارب المختلفة. شاهد هذه المساحة لمزيد من المعلومات عن تجاربنا مثل البحث عن الصور والبحث عن الفيديو.</p>
<p><br/></p>
<h2 id="References" class="common-anchor-header">المراجع:<button data-href="#References" class="anchor-icon" translate="no">
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
<li>مستندات ميشاردز ：https://milvus.io/docs/v0.10.2/mishards.md</li>
<li>ميشاردز: https://github.com/milvus-io/milvus/tree/master/shards</li>
<li>ميلفوس-هيلم: https://github.com/milvus-io/milvus-helm/tree/master/charts/milvus</li>
</ul>
<p><br/></p>
<p><em>تمت إعادة نشر مقالة المدونة هذه من: https://medium.com/tokopedia-engineering/how-we-used-semantic-search-to-make-our-search-10x-smarter-bd9c7f601821</em></p>
<p>اقرأ <a href="https://zilliz.com/user-stories">قصص المستخدمين</a> الآخرين لمعرفة المزيد عن صنع الأشياء باستخدام ميلفوس.</p>
