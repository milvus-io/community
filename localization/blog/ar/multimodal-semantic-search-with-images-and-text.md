---
id: multimodal-semantic-search-with-images-and-text.md
title: البحث الدلالي متعدد الوسائط مع الصور والنصوص
author: Stefan Webb
date: 2025-02-3
desc: >-
  تعرّف على كيفية إنشاء تطبيق بحث دلالي باستخدام الذكاء الاصطناعي متعدد الوسائط
  الذي يفهم العلاقات بين النص والصورة، بما يتجاوز مطابقة الكلمات المفتاحية
  الأساسية.
cover: >-
  assets.zilliz.com/Multimodal_Semantic_Search_with_Images_and_Text_1_3da9b83015.png
tag: Engineering
tags: 'Milvus, Vector Database, Open Source, Semantic Search, Multimodal AI'
recommend: true
canonicalUrl: 'https://milvus.io/blog/multimodal-semantic-search-with-images-and-text.md'
---
<iframe width="100%" height="315" src="https://www.youtube.com/embed/bxE0_QYX_sU?si=PkOHFcZto-rda1Fv" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<p>نحن كبشر، نفسر العالم من خلال حواسنا. فنحن نسمع الأصوات ونرى الصور والفيديو والنصوص، وغالباً ما تكون في طبقات فوق بعضها البعض. نحن نفهم العالم من خلال هذه الطرائق المتعددة والعلاقة بينها. ولكي يضاهي الذكاء الاصطناعي القدرات البشرية أو يتجاوزها حقًا، يجب أن يطور هذه القدرة نفسها لفهم العالم من خلال عدسات متعددة في وقت واحد.</p>
<p>في هذا المنشور والفيديو المصاحب له (أعلاه) <a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/multimodal_retrieval_amazon_reviews.ipynb">والمذكرة،</a> سنعرض الإنجازات الأخيرة في النماذج التي يمكنها معالجة كل من النصوص والصور معاً. سنقوم بتوضيح ذلك من خلال بناء تطبيق بحث دلالي يتجاوز مجرد مطابقة الكلمات المفتاحية - فهو يفهم العلاقة بين ما يطلبه المستخدمون والمحتوى المرئي الذي يبحثون عنه.</p>
<p>ما يجعل هذا المشروع مثيرًا بشكل خاص هو أنه مبني بالكامل باستخدام أدوات مفتوحة المصدر: قاعدة بيانات Milvus vector، ومكتبات التعلم الآلي الخاصة ب HuggingFace، ومجموعة بيانات من مراجعات عملاء Amazon. من اللافت للنظر أنه قبل عقد من الزمان فقط، كان بناء شيء من هذا القبيل يتطلب موارد ملكية كبيرة. أما اليوم، فإن هذه المكونات القوية متاحة مجاناً ويمكن لأي شخص لديه فضول للتجربة أن يجمعها بطرق مبتكرة.</p>
<custom-h1>نظرة عامة</custom-h1><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/overview_97a124bc9a.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>تطبيق البحث متعدد الوسائط الخاص بنا هو من نوع <em>الاسترجاع وإعادة الترتيب.</em> إذا كنت على دراية بنوع <em>الاسترجاع والتوليد المعزز</em> (RAG) فهو مشابه جدًا، إلا أن الناتج النهائي هو قائمة من الصور التي أعيد تصنيفها بواسطة نموذج رؤية لغوية كبيرة (LLVM). يحتوي استعلام البحث الخاص بالمستخدم على كل من النص والصورة، والهدف هو مجموعة من الصور المفهرسة في قاعدة بيانات متجهة. تحتوي البنية على ثلاث خطوات - <em>الفهرسة،</em> <em>والاسترجاع،</em> <em>وإعادة الترتيب</em> (أقرب إلى "التوليد") - والتي نلخصها بدورها.</p>
<h2 id="Indexing" class="common-anchor-header">الفهرسة<button data-href="#Indexing" class="anchor-icon" translate="no">
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
    </button></h2><p>يجب أن يحتوي تطبيق البحث لدينا على شيء للبحث. في حالتنا، نستخدم مجموعة فرعية صغيرة من مجموعة بيانات "مراجعات أمازون 2023"، والتي تحتوي على نصوص وصور من مراجعات عملاء أمازون في جميع أنواع المنتجات. يمكنك أن تتخيل أن بحثاً دلالياً كهذا الذي نقوم ببنائه سيكون إضافة مفيدة لموقع إلكتروني للتجارة الإلكترونية. نحن نستخدم 900 صورة ونتجاهل النص، على الرغم من ملاحظة أن هذا الدفتر يمكن أن يتوسع إلى حجم الإنتاج مع قاعدة البيانات الصحيحة وعمليات نشر الاستدلال.</p>
<p>أول جزء من "السحر" في خط الأنابيب لدينا هو اختيار نموذج التضمين. نحن نستخدم نموذجًا متعدد الوسائط تم تطويره مؤخرًا يسمى <a href="https://huggingface.co/BAAI/bge-visualized">Visualized BGE</a> قادر على تضمين النص والصور معًا، أو كل منهما على حدة، في نفس المساحة بنموذج واحد حيث تكون النقاط المتقاربة متشابهة دلاليًا. تم تطوير نماذج أخرى من هذا القبيل مؤخرًا، على سبيل المثال <a href="https://github.com/google-deepmind/magiclens">MagicLens</a>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/indexing_1937241be5.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>يوضّح الشكل أعلاه: التضمين لـ [صورة لأسد من الجانب] بالإضافة إلى النص "منظر أمامي لهذا"، قريب من التضمين لـ [صورة أسد من الأمام] بدون نص. يُستخدم نفس النموذج لكل من مدخلات النص بالإضافة إلى الصورة ومدخلات الصورة فقط (وكذلك مدخلات النص فقط). <em>بهذه الطريقة، يكون النموذج قادرًا على فهم نية المستخدم في كيفية ارتباط نص الاستعلام بصورة الاستعلام.</em></p>
<p>نقوم بتضمين صور منتجاتنا الـ 900 بدون نص مطابق ونخزن التضمينات في قاعدة بيانات متجهة باستخدام <a href="https://milvus.io/docs">Milvus</a>.</p>
<h2 id="Retrieval" class="common-anchor-header">الاسترجاع<button data-href="#Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><p>الآن بعد أن تم بناء قاعدة البيانات الخاصة بنا، يمكننا تقديم استعلام المستخدم. تخيل أن مستخدمًا يأتي مع الاستعلام: "حافظة هاتف مع هذا" بالإضافة إلى [صورة نمر]. أي أنه يبحث عن أغطية هواتف تحمل طبعة جلد النمر.</p>
<p>لاحظ أن نص استعلام المستخدم يقول "هذا" بدلاً من "جلد نمر". يجب أن يكون نموذج التضمين الخاص بنا قادرًا على ربط كلمة "هذا" بما تشير إليه، وهو إنجاز مثير للإعجاب نظرًا لأن التكرار السابق للنماذج لم يكن قادرًا على التعامل مع مثل هذه التعليمات المفتوحة. تقدم <a href="https://arxiv.org/abs/2403.19651">ورقة MagicLens</a> أمثلة أخرى.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Retrieval_ad64f48e49.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>نقوم بتضمين نص الاستعلام والصورة معًا وإجراء بحث تشابه لقاعدة بيانات المتجهات، وإرجاع أفضل تسع نتائج. تظهر النتائج في الشكل أعلاه، إلى جانب صورة الاستعلام عن النمر. يبدو أن أعلى نتيجة ليست هي الأكثر صلة بالاستعلام. يبدو أن النتيجة السابعة هي الأكثر صلة بالموضوع، وهي عبارة عن غطاء هاتف مطبوع عليه جلد نمر.</p>
<h2 id="Generation" class="common-anchor-header">التوليد<button data-href="#Generation" class="anchor-icon" translate="no">
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
    </button></h2><p>يبدو أن بحثنا قد فشل في أن النتيجة الأولى ليست الأكثر صلة بالموضوع. ومع ذلك، يمكننا إصلاح ذلك بخطوة إعادة الترتيب. قد تكون على دراية بإعادة ترتيب العناصر المسترجعة كخطوة مهمة في العديد من خطوط أنابيب RAG. نستخدم <a href="https://huggingface.co/microsoft/Phi-3-vision-128k-instruct">Phi-3 Vision</a> كنموذج لإعادة التصنيف.</p>
<p>نطلب أولًا من LLVM إنشاء شرح لصورة الاستعلام. يقوم LLVM بإخراج:</p>
<p><em>"تُظهر الصورة لقطة مقرّبة لوجه نمر مع التركيز على فرائه المرقط وعينيه الخضراوين".</em></p>
<p>ثم نقوم بعد ذلك بتغذية هذا التعليق، وصورة واحدة مع النتائج التسعة وصورة الاستعلام، وننشئ مطالبة نصية تطلب من النموذج إعادة ترتيب النتائج، مع إعطاء الإجابة كقائمة وتقديم سبب لاختيار أفضل تطابق.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Generation_b016a6c26a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>يظهر الناتج في الشكل أعلاه - العنصر الأكثر ملاءمة الآن هو العنصر الأكثر ملاءمة هو الأنسب - والسبب المعطى هو</p>
<p><em>"العنصر الأكثر ملاءمة هو العنصر الذي يحمل سمة النمر، والذي يتطابق مع تعليمات استعلام المستخدم عن حافظة هاتف ذات سمة مماثلة."</em></p>
<p>تمكّنت أداة إعادة تصنيف LLVM الخاصة بنا من إجراء فهم عبر الصور والنصوص، وتحسين ملاءمة نتائج البحث. <em>إحدى القطع الأثرية المثيرة للاهتمام هي أن أداة إعادة التصنيف أعطت ثماني نتائج فقط وأسقطت واحدة فقط، مما يسلط الضوء على الحاجة إلى حواجز حماية ومخرجات منظمة.</em></p>
<h2 id="Summary" class="common-anchor-header">الملخص<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>في هذا المنشور <a href="https://www.youtube.com/watch?v=bxE0_QYX_sU">والفيديو</a> <a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/multimodal_retrieval_amazon_reviews.ipynb">والمذكرة</a> المصاحبة له، قمنا ببناء تطبيق للبحث الدلالي متعدد الوسائط عبر النصوص والصور. كان نموذج التضمين قادرًا على تضمين النص والصور معًا أو بشكل منفصل في نفس المساحة، وكان نموذج الأساس قادرًا على إدخال النص والصورة أثناء توليد النص استجابةً لذلك. <em>والأهم من ذلك أن نموذج التضمين كان قادرًا على ربط قصد المستخدم من التعليمات المفتوحة بصورة الاستعلام، وبهذه الطريقة تحديد كيفية رغبة المستخدم في أن ترتبط النتائج بالصورة المدخلة.</em></p>
<p>هذا مجرد لمحة عما سيأتي في المستقبل القريب. سوف نرى العديد من تطبيقات البحث متعدد الوسائط، والفهم والاستدلال متعدد الوسائط، وما إلى ذلك عبر طرائق متنوعة: الصورة، والفيديو، والصوت، والجزيئات، والشبكات الاجتماعية، والبيانات المجدولة، والسلاسل الزمنية، والإمكانات لا حدود لها.</p>
<p>وفي صميم هذه الأنظمة توجد قاعدة بيانات متجهة تحمل "الذاكرة" الخارجية للنظام. يعد Milvus خيارًا ممتازًا لهذا الغرض. فهو مفتوح المصدر، ومميز بالكامل (انظر <a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">هذه المقالة عن البحث عن النص الكامل في Milvus 2.5</a>) ويتوسع بكفاءة إلى مليارات المتجهات مع حركة مرور على نطاق الويب وزمن انتقال أقل من 100 مللي ثانية. تعرّف على المزيد في <a href="https://milvus.io/docs">مستندات Milvus،</a> وانضم إلى مجتمع <a href="https://milvus.io/discord">Discord</a> الخاص بنا، ونأمل أن نراك في <a href="https://lu.ma/unstructured-data-meetup">لقاء البيانات غير المهيكلة</a> القادم. حتى ذلك الحين!</p>
<h2 id="Resources" class="common-anchor-header">المصادر<button data-href="#Resources" class="anchor-icon" translate="no">
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
<li><p>دفتر الملاحظات: <a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/multimodal_retrieval_amazon_reviews.ipynb">"بحث متعدد الوسائط مع مراجعات أمازون وإعادة ترتيب LLVM</a>"</p></li>
<li><p><a href="https://www.youtube.com/watch?v=bxE0_QYX_sU">فيديو مطوري AWS على يوتيوب</a></p></li>
<li><p><a href="https://milvus.io/docs">وثائق ميلفوس</a></p></li>
<li><p><a href="https://lu.ma/unstructured-data-meetup">ملتقى البيانات غير المهيكلة</a></p></li>
<li><p>نموذج التضمين: <a href="https://huggingface.co/BAAI/bge-visualized">بطاقة نموذج BGE المرئية</a></p></li>
<li><p>نموذج التضمين البديل <a href="https://github.com/google-deepmind/magiclens">ريبو نموذج MagicLens السحري</a></p></li>
<li><p>LLVM <a href="https://huggingface.co/microsoft/Phi-3-vision-128k-instruct">بطاقة نموذج Phi-3 Vision</a></p></li>
<li><p>ورقة: "<a href="https://arxiv.org/abs/2403.19651">MagicLens: استرجاع الصور بإشراف ذاتي بتعليمات مفتوحة النهاية</a>"</p></li>
<li><p>مجموعة البيانات: <a href="https://amazon-reviews-2023.github.io/">مراجعات أمازون 2023</a></p></li>
</ul>
