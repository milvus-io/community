---
id: >-
  2021-12-10-image-based-trademark-similarity-search-system-a-smarter-solution-to-ip-protection.md
title: >-
  ميلفوس في حماية الملكية الفكرية ：بناء نظام بحث عن تشابه العلامات التجارية مع
  ميلفوس
author: Zilliz
date: 2021-12-10T00:00:00.000Z
desc: تعلم كيفية تطبيق البحث عن تشابه المتجهات في مجال حماية الملكية الفكرية.
cover: assets.zilliz.com/IP_protection_0a33547579.png
tag: Scenarios
---
<p>في السنوات الأخيرة، أصبحت مسألة حماية الملكية الفكرية تحت الأضواء مع تزايد وعي الناس بانتهاك الملكية الفكرية. وعلى وجه الخصوص، نشطت شركة Apple Inc. عملاق التكنولوجيا متعددة الجنسيات في <a href="https://en.wikipedia.org/wiki/Apple_Inc._litigation">رفع دعاوى قضائية ضد شركات مختلفة لانتهاكها</a> للملكية الفكرية، بما في ذلك انتهاك العلامات التجارية وبراءات الاختراع والتصاميم. وبصرف النظر عن تلك القضايا الأكثر شهرة، <a href="https://www.smh.com.au/business/apple-bites-over-woolworths-logo-20091005-ghzr.html">اعترضت</a> شركة Apple Inc. أيضًا <a href="https://www.smh.com.au/business/apple-bites-over-woolworths-logo-20091005-ghzr.html">على طلب علامة تجارية من قبل Woolworths Limited،</a> وهي سلسلة متاجر أسترالية كبيرة، على أساس انتهاك العلامة التجارية في عام 2009.  وقد جادلت شركة Apple. Inc أن شعار العلامة التجارية الأسترالية، وهو عبارة عن حرف &quot;w&quot; منمّق، يشبه شعارها الخاص بالتفاحة. ولذلك، اعترضت شركة Apple Inc. على مجموعة المنتجات، بما في ذلك الأجهزة الإلكترونية، التي تقدمت Woolworths بطلب بيعها مع الشعار. انتهت القصة بتعديل وولوورثز لشعارها وسحب أبل اعتراضها.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Logo_of_Woolworths_b04ece5b20.png" alt="Logo of Woolworths.png" class="doc-image" id="logo-of-woolworths.png" />
   </span> <span class="img-wrapper"> <span>شعار Woolworths.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Logo_of_Apple_Inc_181e5bd5f8.png" alt="Logo of Apple Inc.png" class="doc-image" id="logo-of-apple-inc.png" />
   </span> <span class="img-wrapper"> <span>شعار شركة Apple Inc.png</span> </span></p>
<p>مع الوعي المتزايد بثقافة العلامات التجارية، تراقب الشركات عن كثب أي تهديدات من شأنها الإضرار بحقوق الملكية الفكرية الخاصة بها. يشمل انتهاك الملكية الفكرية ما يلي:</p>
<ul>
<li>انتهاك حقوق الطبع والنشر</li>
<li>التعدي على براءات الاختراع</li>
<li>التعدي على العلامات التجارية</li>
<li>التعدي على التصميم</li>
<li>البغاء الإلكتروني</li>
</ul>
<p>يدور النزاع المذكور أعلاه بين Apple وWoolworths بشكل أساسي حول التعدي على العلامات التجارية، وبالتحديد التشابه بين صور العلامات التجارية للكيانين. ولكي لا تصبح وول ورثز أخرى، فإن البحث الشامل عن تشابه العلامات التجارية هو خطوة حاسمة لمقدمي الطلبات قبل تقديم الطلبات وأثناء مراجعة طلبات العلامات التجارية. ويتم اللجوء الأكثر شيوعًا من خلال البحث في <a href="https://tmsearch.uspto.gov/search/search-information">قاعدة بيانات مكتب الولايات المتحدة لبراءات الاختراع والعلامات التجارية (USPTO)</a> التي تحتوي على جميع تسجيلات وطلبات العلامات التجارية النشطة وغير النشطة. وعلى الرغم من واجهة المستخدم غير الساحرة، إلا أن عملية البحث هذه تشوبها عيوب كثيرة بسبب طبيعتها القائمة على النصوص، حيث تعتمد على الكلمات ورموز تصميم العلامات التجارية (وهي عبارة عن تسميات مشروحة يدوياً لسمات التصميم) للبحث عن الصور.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_8_b2fff6ca11.png" alt="8.png" class="doc-image" id="8.png" />
   </span> <span class="img-wrapper"> <span>8.png</span> </span></p>
<p>وبالتالي، يهدف هذا المقال إلى عرض كيفية بناء نظام بحث فعال قائم على الصور للبحث عن تشابه العلامات التجارية باستخدام قاعدة بيانات متجهات <a href="https://milvus.io">Milvus،</a> وهي قاعدة بيانات متجهة مفتوحة المصدر.</p>
<h2 id="A-vector-similarity-search-system-for-trademarks" class="common-anchor-header">نظام بحث عن التشابه المتجه للعلامات التجارية<button data-href="#A-vector-similarity-search-system-for-trademarks" class="anchor-icon" translate="no">
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
    </button></h2><p>لبناء نظام بحث عن التشابه المتجه للعلامات التجارية، عليك اتباع الخطوات التالية:</p>
<ol>
<li>إعداد مجموعة بيانات ضخمة من الشعارات. من المحتمل أن يستخدم النظام مجموعة بيانات <a href="https://developer.uspto.gov/product/trademark-24-hour-box-and-supplemental">كهذه</a>).</li>
<li>تدريب نموذج استخراج سمات الصور باستخدام مجموعة البيانات والنماذج القائمة على البيانات أو خوارزميات الذكاء الاصطناعي.</li>
<li>تحويل الشعارات إلى متجهات باستخدام النموذج أو الخوارزمية المدرّبة في الخطوة 2.</li>
<li>قم بتخزين المتجهات وإجراء عمليات البحث عن تشابه المتجهات في قاعدة بيانات المتجهات مفتوحة المصدر Milvus.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/trademark_system_e9700df555.png" alt="Nike.png" class="doc-image" id="nike.png" />
   </span> <span class="img-wrapper"> <span>Nike.png</span> </span></p>
<p>في الأقسام التالية، دعونا نلقي نظرة فاحصة على الخطوتين الرئيسيتين في بناء نظام بحث عن تشابه المتجهات للعلامات التجارية: استخدام نماذج الذكاء الاصطناعي لاستخراج سمات الصور، واستخدام Milvus للبحث عن تشابه المتجهات. في حالتنا هذه، استخدمنا VGG16، وهي شبكة عصبية تلافيفية (CNN)، لاستخراج ميزات الصور وتحويلها إلى متجهات تضمين.</p>
<h3 id="Using-VGG16-for-image-feature-extraction" class="common-anchor-header">استخدام VGG16 لاستخراج ميزات الصورة</h3><p>إن<a href="https://medium.com/@mygreatlearning/what-is-vgg16-introduction-to-vgg16-f2d63849f615">VGG16</a> عبارة عن شبكة عصبية ملتفة (CNN) مصممة للتعرف على الصور على نطاق واسع. هذا النموذج سريع ودقيق في التعرف على الصور ويمكن تطبيقه على الصور من جميع الأحجام. فيما يلي رسمان توضيحيان لبنية VGG16.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vgg16_layers_9e621f62cc.png" alt="9.png" class="doc-image" id="9.png" />
   </span> <span class="img-wrapper"> <span>9.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vgg16_architecture_992614e882.png" alt="10.png" class="doc-image" id="10.png" />
   </span> <span class="img-wrapper"> <span>10.png</span> </span></p>
<p>نموذج VGG16، كما يوحي اسمه، عبارة عن شبكة CNN ذات 16 طبقة. تحتوي جميع نماذج VGG، بما في ذلك VGG16 و VGG19، على 5 كتل VGG، مع وجود طبقة أو أكثر من الطبقات التلافيفية في كل كتلة VGG. وفي نهاية كل كتلة، يتم توصيل طبقة تجميع قصوى لتقليل حجم صورة الإدخال. يكون عدد النواة متكافئًا داخل كل طبقة تلافيفية ولكنه يتضاعف في كل كتلة VGG. لذلك، يزداد عدد النوى في النموذج من 64 في الكتلة الأولى إلى 512 في الكتلتين الرابعة والخامسة. جميع النواة التلافيفية<em>بحجم 33 بينما نواة التجميع كلها بحجم 22</em>. هذا يساعد على الحفاظ على مزيد من المعلومات حول صورة الإدخال.</p>
<p>لذلك، يعد VGG16 نموذجًا مناسبًا للتعرف على الصور لمجموعات البيانات الضخمة في هذه الحالة. يمكنك استخدام Python و Tensorflow و Keras لتدريب نموذج استخراج ميزات الصور على أساس VGG16.</p>
<h3 id="Using-Milvus-for-vector-similarity-search" class="common-anchor-header">استخدام Milvus للبحث عن تشابه المتجهات</h3><p>بعد استخدام نموذج VGG16 لاستخراج ميزات الصورة وتحويل صور الشعار إلى متجهات تضمين، تحتاج إلى البحث عن متجهات متشابهة من مجموعة بيانات ضخمة.</p>
<p>Milvus عبارة عن قاعدة بيانات سحابية أصلية تتميز بقابلية توسع ومرونة عالية. أيضًا، كقاعدة بيانات، يمكنها ضمان اتساق البيانات. بالنسبة لنظام بحث عن تشابه العلامات التجارية مثل هذا، يتم تحميل بيانات جديدة مثل أحدث تسجيلات العلامات التجارية إلى النظام في الوقت الفعلي. ويجب أن تكون هذه البيانات التي تم تحميلها حديثًا متاحة للبحث على الفور. ولذلك، تعتمد هذه المقالة على قاعدة البيانات المتجهة مفتوحة المصدر Milvus، لإجراء بحث تشابه المتجهات.</p>
<p>عند إدراج متجهات الشعار، يمكنك إنشاء مجموعات في Milvus لأنواع مختلفة من متجهات الشعار وفقًا <a href="https://en.wikipedia.org/wiki/International_(Nice)_Classification_of_Goods_and_Services">للتصنيف الدولي (نيس) للسلع والخدمات،</a> وهو نظام لتصنيف السلع والخدمات لتسجيل العلامات التجارية. على سبيل المثال، يمكنك إدراج مجموعة من ناقلات شعارات العلامات التجارية للملابس في مجموعة باسم &quot;الملابس&quot; في ميلفوس وإدراج مجموعة أخرى من ناقلات شعارات العلامات التجارية التكنولوجية في مجموعة مختلفة باسم &quot;التكنولوجيا&quot;. من خلال القيام بذلك، يمكنك زيادة كفاءة وسرعة البحث عن تشابه المتجهات بشكل كبير.</p>
<p>لا يدعم Milvus فهارس متعددة للبحث عن تشابه المتجهات فحسب، بل يوفر أيضًا واجهات برمجة تطبيقات وأدوات غنية لتسهيل عمليات التطوير. الرسم البياني التالي هو توضيح <a href="https://milvus.io/docs/v2.0.x/architecture_overview.md">لبنية Milvus</a>. يمكنك معرفة المزيد عن Milvus من خلال قراءة <a href="https://milvus.io/docs/v2.0.x/overview.md">مقدمته</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_architecture_ea45a5ab53.png" alt="11.png" class="doc-image" id="11.png" />
   </span> <span class="img-wrapper"> <span>11.png</span> </span></p>
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
    </button></h2><ul>
<li><p>بناء المزيد من أنظمة البحث عن تشابه المتجهات لسيناريوهات التطبيقات الأخرى باستخدام Milvus:</p>
<ul>
<li><a href="https://milvus.io/blog/dna-sequence-classification-based-on-milvus.md">تصنيف تسلسل الحمض النووي استنادًا إلى Milvus</a></li>
<li><a href="https://milvus.io/blog/audio-retrieval-based-on-milvus.md">استرجاع الصوت استنادًا إلى ميلفوس</a></li>
<li><a href="https://milvus.io/blog/building-video-search-system-with-milvus.md">4 خطوات لبناء نظام بحث عن الفيديو</a></li>
<li><a href="https://milvus.io/blog/building-intelligent-chatbot-with-nlp-and-milvus.md">بناء نظام ذكي لضمان الجودة باستخدام البرمجة اللغوية العصبية وميلفوس</a></li>
<li><a href="https://milvus.io/blog/molecular-structure-similarity-with-milvus.md">تسريع اكتشاف الأدوية الجديدة</a></li>
</ul></li>
<li><p>تفاعل مع مجتمعنا مفتوح المصدر:</p>
<ul>
<li>ابحث أو ساهم في Milvus على <a href="https://bit.ly/307b7jC">GitHub</a>.</li>
<li>تفاعل مع المجتمع عبر <a href="https://bit.ly/3qiyTEk">المنتدى</a>.</li>
<li>تواصل معنا على <a href="https://bit.ly/3ob7kd8">تويتر</a>.</li>
</ul></li>
</ul>
