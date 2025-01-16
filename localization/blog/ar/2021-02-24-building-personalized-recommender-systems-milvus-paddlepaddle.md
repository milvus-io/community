---
id: building-personalized-recommender-systems-milvus-paddlepaddle.md
title: مقدمة أساسية
author: Shiyu Chen
date: 2021-02-24T23:12:34.209Z
desc: كيفية بناء نظام توصية مدعوم بالتعلم العميق
cover: assets.zilliz.com/header_e6c4a8aee6.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-personalized-recommender-systems-milvus-paddlepaddle
---
<custom-h1>بناء أنظمة التوصية الشخصية باستخدام Milvus وPaddlePaddle</custom-h1><h2 id="Background-Introduction" class="common-anchor-header">مقدمة أساسية<button data-href="#Background-Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>مع التطور المستمر لتكنولوجيا الشبكات والتوسع المستمر في نطاق التجارة الإلكترونية، ينمو عدد السلع وتنوعها بسرعة ويحتاج المستخدمون إلى قضاء الكثير من الوقت للعثور على السلع التي يرغبون في شرائها. هذا هو الحمل الزائد للمعلومات. ولحل هذه المشكلة، ظهر نظام التوصية إلى حيز الوجود.</p>
<p>نظام التوصية هو مجموعة فرعية من نظام تصفية المعلومات، والذي يمكن استخدامه في مجموعة من المجالات مثل الأفلام والموسيقى والتجارة الإلكترونية وتوصيات تدفق المعلومات. يكتشف نظام التوصيات الاحتياجات والاهتمامات الشخصية للمستخدم من خلال تحليل سلوكيات المستخدم والتنقيب عنها، ويوصي بالمعلومات أو المنتجات التي قد تهم المستخدم. وخلافًا لمحركات البحث، لا يتطلب نظام التوصيات من المستخدمين وصف احتياجاتهم بدقة، بل يقوم بنمذجة سلوكهم التاريخي لتقديم معلومات استباقية تلبي اهتمامات المستخدم واحتياجاته.</p>
<p>في هذه المقالة نستخدم PaddlePaddle، وهي منصة تعلم عميق من بايدو، لبناء نموذج ودمج محرك البحث Milvus، وهو محرك بحث متجه التشابه، لبناء نظام توصية مخصص يمكنه تزويد المستخدمين بمعلومات مثيرة للاهتمام بسرعة وبدقة.</p>
<h2 id="Data-Preparation" class="common-anchor-header">إعداد البيانات<button data-href="#Data-Preparation" class="anchor-icon" translate="no">
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
    </button></h2><p>نأخذ مجموعة بيانات MovieLens Million Dataset (ml-1m) [1] كمثال. تحتوي مجموعة بيانات ml-1m على 1,000,000 مراجعة لـ 4,000 فيلم من قبل 6,000 مستخدم، تم جمعها من قبل مختبر أبحاث GroupLens. تتضمن البيانات الأصلية بيانات ميزة الفيلم وميزة المستخدم وتقييم المستخدم للفيلم، يمكنك الرجوع إلى ml-1m-README [2] .</p>
<p>تتضمن مجموعة بيانات ml-1m 3 ملفات .dat: films.dat 、 Users.dat و ratings.dat.dat.movies.dat تتضمن ميزات الفيلم، انظر المثال أدناه:</p>
<pre><code translate="no">MovieID::Title::Genres
1::ToyStory(1995)::Animation|Children's|Comedy
</code></pre>
<p>هذا يعني أن معرّف الفيلم هو 1، والعنوان هو 《قصة لعبة》، وهو مقسم إلى ثلاث فئات. هذه الفئات الثلاث هي الرسوم المتحركة والأطفال والكوميديا.</p>
<p>يتضمن users.dat ميزات المستخدم، انظر المثال أدناه:</p>
<pre><code translate="no">UserID::Gender::Age::Occupation::Zip-code
1::F::1::10::48067
</code></pre>
<p>هذا يعني أن معرّف المستخدم هو 1، أنثى وعمرها أقل من 18 عامًا. معرف المهنة هو 10.</p>
<p>التصنيفات.dat يتضمن ميزة تصنيف الفيلم، انظر المثال أدناه:</p>
<p>معرف المستخدم::معرف الفيلم::التصنيف::الطابع الزمني 1::1193::5::978300760</p>
<p>أي أن المستخدم 1 يقيّم الفيلم 1193 بـ 5 نقاط.</p>
<h2 id="Fusion-Recommendation-Model" class="common-anchor-header">نموذج توصية الاندماج<button data-href="#Fusion-Recommendation-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>استخدمنا في نظام التوصيات المخصصة للأفلام نموذج توصية الاندماج [3] الذي طبقه PaddlePaddle. تم إنشاء هذا النموذج من ممارسته الصناعية.</p>
<p>أولاً، خذ ميزات المستخدم وميزات الفيلم كمدخلات للشبكة العصبية، حيث:</p>
<ul>
<li>تتضمن ميزات المستخدم أربع معلومات عن السمات: هوية المستخدم والجنس والمهنة والعمر.</li>
<li>تتضمن ميزة الفيلم ثلاث معلومات عن السمات: معرف الفيلم، ومعرف نوع الفيلم، واسم الفيلم.</li>
</ul>
<p>بالنسبة لميزة المستخدم، قم بتعيين معرف المستخدم إلى تمثيل متجه بحجم أبعاد 256، وأدخل الطبقة المتصلة بالكامل، وقم بإجراء معالجة مماثلة للسمات الثلاث الأخرى. ثم يتم توصيل تمثيلات السمات الأربع بشكل كامل وإضافتها بشكل منفصل.</p>
<p>بالنسبة لميزات الفيلم، تتم معالجة معرف الفيلم بطريقة مشابهة لمعرف المستخدم. يتم إدخال معرّف نوع الفيلم مباشرةً في الطبقة المتصلة بالكامل في شكل متجه، ويتم تمثيل اسم الفيلم بواسطة متجه ثابت الطول باستخدام شبكة عصبية تلافيفية نصية. يتم بعد ذلك توصيل تمثيلات السمات الثلاث بشكل كامل وإضافتها بشكل منفصل.</p>
<p>بعد الحصول على التمثيل المتجه للمستخدم والفيلم، يتم حساب التشابه في جيب التمام بينهما كنتيجة لنظام التوصيات المخصص. أخيراً، يتم استخدام مربع الفرق بين درجة التشابه ودرجة المستخدم الحقيقية كدالة خسارة لنموذج الانحدار.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_user_film_personalized_recommender_Milvus_9ec39f501d.jpg" alt="1-user-film-personalized-recommender-Milvus.jpg" class="doc-image" id="1-user-film-personalized-recommender-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>1-مستخدم-فيلم-توصية-شخصية-موصى به-مستخدم-ملفوس.jpg</span> </span></p>
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
    </button></h2><p>بالاقتران مع نموذج توصية الاندماج في PaddlePaddle، يتم تخزين متجه ميزة الفيلم الذي تم إنشاؤه بواسطة النموذج في محرك البحث عن تشابه المتجهات في Milvus، ويتم استخدام ميزة المستخدم كمتجه الهدف الذي سيتم البحث عنه. يتم إجراء البحث عن التشابه في Milvus للحصول على نتيجة الاستعلام كأفلام موصى بها للمستخدم.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_system_overview_5652afdca7.jpg" alt="2-system-overview.jpg" class="doc-image" id="2-system-overview.jpg" />
   </span> <span class="img-wrapper"> <span>2-نظام-عرض النظام</span> </span></p>
<blockquote>
<p>يتم توفير طريقة المنتج الداخلي (IP) في Milvus لحساب المسافة المتجهة. بعد تطبيع البيانات، يتوافق تشابه المنتج الداخلي مع نتيجة تشابه جيب التمام في نموذج توصية الاندماج.</p>
</blockquote>
<h2 id="Application-of-Personal-Recommender-System" class="common-anchor-header">تطبيق نظام التوصية الشخصية<button data-href="#Application-of-Personal-Recommender-System" class="anchor-icon" translate="no">
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
    </button></h2><p>هناك ثلاث خطوات في بناء نظام توصية شخصي باستخدام Milvus، يُرجى الرجوع إلى معسكر تدريب Mivus Bootcamp [4].</p>
<h3 id="Step-1Model-Training" class="common-anchor-header">الخطوة 1 ： تدريب النموذج</h3><pre><code translate="no"># run train.py
    $ python train.py
</code></pre>
<p>سيؤدي تشغيل هذا الأمر إلى إنشاء نموذج recommendender_system.inference.model في الدليل، والذي يمكنه تحويل بيانات الفيلم وبيانات المستخدم إلى متجهات ميزة، وإنشاء بيانات التطبيق ليقوم ميلفوس بتخزينها واسترجاعها.</p>
<h3 id="Step-2Data-Preprocessing" class="common-anchor-header">الخطوة 2 ： المعالجة المسبقة للبيانات</h3><pre><code translate="no"># Data preprocessing, -f followed by the parameter raw movie data file name
    $ python get_movies_data.py -f movies_origin.txt
</code></pre>
<p>سيؤدي تشغيل هذا الأمر إلى إنشاء بيانات الاختبار films_data.txt في الدليل لتحقيق المعالجة المسبقة لبيانات الفيلم.</p>
<h3 id="Step-3Implementing-Personal-Recommender-System-with-Milvus" class="common-anchor-header">الخطوة 3 ：تنفيذ نظام التوصيات الشخصية باستخدام Milvus</h3><pre><code translate="no"># Implementing personal recommender system based on user conditions
    $ python infer_milvus.py -a &lt;age&gt;-g &lt;gender&gt;-j &lt;job&gt;[-i]
</code></pre>
<p>سيؤدي تشغيل هذا الأمر إلى تنفيذ توصيات مخصصة للمستخدمين المحددين.</p>
<p>العملية الرئيسية هي:</p>
<ul>
<li>من خلال تحميل_نموذج_الاستدلال، تتم معالجة بيانات الفيلم بواسطة النموذج لإنشاء متجه ميزة الفيلم.</li>
<li>تحميل متجه ميزة الفيلم في Milvus عبر milvus.insert.</li>
<li>وفقًا لعمر المستخدم/جنس المستخدم/المهنة المحددة من قبل المعلمات، يتم تحويله إلى متجه ميزات المستخدم، ويتم استخدام milvus.search_vectors لاسترجاع التشابه، ويتم إرجاع النتيجة ذات التشابه الأعلى بين المستخدم والفيلم.</li>
</ul>
<p>توقع أفضل خمسة أفلام يهتم بها المستخدم:</p>
<pre><code translate="no">TopIdsTitleScore
03030Yojimbo2.9444923996925354
13871Shane2.8583481907844543
23467Hud2.849525213241577
31809Hana-bi2.826111316680908
43184Montana2.8119677305221558 
</code></pre>
<h2 id="Summary" class="common-anchor-header">ملخص<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>من خلال إدخال معلومات المستخدم ومعلومات الفيلم إلى نموذج توصية الاندماج يمكننا الحصول على درجات مطابقة، ومن ثم فرز درجات جميع الأفلام بناءً على المستخدم للتوصية بالأفلام التي قد تهم المستخدم. <strong>تجمع هذه المقالة بين Milvus و PaddlePaddle لبناء نظام توصية مخصص. يتم استخدام Milvus، وهو محرك بحث متجه، لتخزين جميع بيانات ميزات الأفلام، ثم يتم إجراء استرجاع التشابه على ميزات المستخدم في Milvus.</strong> نتيجة البحث هي تصنيف الفيلم الذي يوصي به النظام للمستخدم.</p>
<p>يتوافق محرك البحث عن تشابه المتجهات Milvus [5] مع العديد من منصات التعلم العميق، ويبحث في مليارات المتجهات باستجابة لا تتجاوز أجزاء من الثانية. يمكنك استكشاف المزيد من إمكانيات تطبيقات الذكاء الاصطناعي مع ميلفوس بكل سهولة!</p>
<h2 id="Reference" class="common-anchor-header">المرجع<button data-href="#Reference" class="anchor-icon" translate="no">
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
<li>مجموعة بيانات MovieLens Million Dataset (ml-1m): http://files.grouplens.org/datasets/movielens/ml-1m.zip</li>
<li>ml-1m-README: http://files.grouplens.org/datasets/movielens/ml-1m-README.txt</li>
<li>نموذج توصية الاندماج بواسطة PaddlePaddle: https://www.paddlepaddle.org.cn/documentation/docs/zh/beginners_guide/basics/recommender_system/index.html#id7</li>
<li>Bootcamp: https://github.com/milvus-io/bootcamp/tree/master/solutions/recommendation_system</li>
<li>ميلفوس: https://milvus.io/</li>
</ol>
