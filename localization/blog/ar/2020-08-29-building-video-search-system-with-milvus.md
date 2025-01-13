---
id: building-video-search-system-with-milvus.md
title: نظرة عامة على النظام
author: milvus
date: 2020-08-29T00:18:19.703Z
desc: البحث عن مقاطع الفيديو حسب الصورة باستخدام ميلفوس
cover: assets.zilliz.com/header_3a822736b3.gif
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/building-video-search-system-with-milvus'
---
<custom-h1>4 خطوات لبناء نظام بحث عن الفيديو</custom-h1><p>كما يوحي اسمه، البحث عن مقاطع الفيديو عن طريق الصورة هو عملية استرجاع من مستودع مقاطع الفيديو التي تحتوي على إطارات مشابهة للصورة المُدخَلة. تتمثل إحدى الخطوات الرئيسية في تحويل مقاطع الفيديو إلى تضمينات، أي استخراج الإطارات الرئيسية وتحويل ميزاتها إلى متجهات. والآن، قد يتساءل بعض القراء الفضوليين عن الفرق بين البحث عن الفيديو حسب الصورة والبحث عن صورة حسب الصورة؟ في الواقع، إن البحث عن الإطارات الرئيسية في مقاطع الفيديو يعادل البحث عن صورة بصورة.</p>
<p>يمكنك الرجوع إلى مقالنا السابق <a href="https://medium.com/unstructured-data-service/milvus-application-1-building-a-reverse-image-search-system-based-on-milvus-and-vgg-aed4788dd1ea">Milvus x VGG: بناء نظام استرجاع الصور القائم على المحتوى</a> إذا كنت مهتمًا.</p>
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
    </button></h2><p>يوضح الرسم البياني التالي سير العمل النموذجي لنظام البحث عن الفيديو هذا.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_video_search_system_workflow_c68d658b93.png" alt="1-video-search-system-workflow.png" class="doc-image" id="1-video-search-system-workflow.png" />
   </span> <span class="img-wrapper"> <span>1-video-search-system-workflow.png</span> </span></p>
<p>عند استيراد مقاطع الفيديو، نستخدم مكتبة OpenCV لتقطيع كل مقطع فيديو إلى إطارات، ونستخرج متجهات الإطارات الرئيسية باستخدام نموذج استخراج سمات الصورة VGG، ثم ندرج المتجهات المستخرجة (التضمينات) في ملفوس. نستخدم Minio لتخزين مقاطع الفيديو الأصلية وRedis لتخزين الارتباطات بين مقاطع الفيديو والمتجهات.</p>
<p>عند البحث عن مقاطع الفيديو، نستخدم نفس نموذج VGG لتحويل الصورة المدخلة إلى متجه ميزة وإدخاله في Milvus للعثور على المتجهات الأكثر تشابهًا. بعد ذلك، يسترجع النظام مقاطع الفيديو المقابلة من Minio على واجهته وفقًا للارتباطات في ريديس.</p>
<h2 id="Data-preparation" class="common-anchor-header">إعداد البيانات<button data-href="#Data-preparation" class="anchor-icon" translate="no">
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
    </button></h2><p>في هذه المقالة، نستخدم حوالي 100,000 ملف GIF من Tumblr كمجموعة بيانات نموذجية في بناء حل شامل للبحث عن الفيديو. يمكنك استخدام مستودعات الفيديو الخاصة بك.</p>
<h2 id="Deployment" class="common-anchor-header">النشر<button data-href="#Deployment" class="anchor-icon" translate="no">
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
    </button></h2><p>الكود الخاص ببناء نظام استرجاع الفيديو في هذه المقالة موجود على GitHub.</p>
<h3 id="Step-1-Build-Docker-images" class="common-anchor-header">الخطوة 1: بناء صور Docker.</h3><p>يتطلب نظام استرجاع الفيديو إرساء Milvus v0.7.1 docker، وRedis docker، وMinio docker، وDocker للواجهة الأمامية، وDocker لواجهة برمجة التطبيقات الخلفية. تحتاج إلى بناء وحدة إرساء الواجهة الأمامية ووحدة إرساء واجهة برمجة التطبيقات الخلفية بنفسك، بينما يمكنك سحب وحدات الإرساء الثلاثة الأخرى مباشرةً من Docker Hub.</p>
<pre><code translate="no"># Get the video search code
$ git clone -b 0.10.0 https://github.com/JackLCL/search-video-demo.git

# Build front-end interface docker and api docker images
$ cd search-video-demo &amp; make all
</code></pre>
<h2 id="Step-2-Configure-the-environment" class="common-anchor-header">الخطوة 2: تهيئة البيئة.<button data-href="#Step-2-Configure-the-environment" class="anchor-icon" translate="no">
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
    </button></h2><p>نستخدم هنا docker-compose.yml لإدارة الحاويات الخمس المذكورة أعلاه. انظر الجدول التالي للاطلاع على تكوين docker-compose.yml:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_configure_docker_compose_yml_a33329e5e9.png" alt="2-configure-docker-compose-yml.png" class="doc-image" id="2-configure-docker-compose-yml.png" />
   </span> <span class="img-wrapper"> <span>2-configure-docker-compose-compose-yml.png</span> </span></p>
<p>عنوان IP 192.168.1.38 في الجدول أعلاه هو عنوان الخادم المخصص لبناء نظام استرجاع الفيديو في هذه المقالة. تحتاج إلى تحديثه إلى عنوان الخادم الخاص بك.</p>
<p>تحتاج إلى إنشاء دلائل تخزين يدويًا لـ Milvus وRedis وMinio، ثم إضافة المسارات المقابلة في docker-compose.yml. في هذا المثال، أنشأنا الدلائل التالية:</p>
<pre><code translate="no">/mnt/redis/data /mnt/minio/data /mnt/milvus/db
</code></pre>
<p>يمكنك تكوين Milvus، وRedis، وMinio في docker-compose.yml على النحو التالي:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_configure_milvus_redis_minio_docker_compose_yml_4a8104d53e.png" alt="3-configure-milvus-redis-minio-docker-compose-yml.png" class="doc-image" id="3-configure-milvus-redis-minio-docker-compose-yml.png" />
   </span> <span class="img-wrapper"> <span>3-configure-milvigure-milvus-redis-minio-docker-compose-yml.png</span> </span></p>
<h2 id="Step-3-Start-the-system" class="common-anchor-header">الخطوة 3: ابدأ تشغيل النظام.<button data-href="#Step-3-Start-the-system" class="anchor-icon" translate="no">
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
    </button></h2><p>استخدم docker-compose.yml المعدل لبدء تشغيل حاويات docker الخمس التي ستُستخدم في نظام استرجاع الفيديو:</p>
<pre><code translate="no">$ docker-compose up -d
</code></pre>
<p>بعد ذلك، يمكنك تشغيل docker-compose ps للتحقق مما إذا كانت حاويات docker الخمس قد بدأت بشكل صحيح. تُظهر لقطة الشاشة التالية واجهة نموذجية بعد بدء التشغيل الناجح.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_sucessful_setup_f2b3006487.png" alt="4-sucessful-setup.png" class="doc-image" id="4-sucessful-setup.png" />
   </span> <span class="img-wrapper"> <span>4-بدء التشغيل الناجح.png</span> </span></p>
<p>الآن، لقد نجحت في بناء نظام بحث عن الفيديو، على الرغم من أن قاعدة البيانات لا تحتوي على مقاطع فيديو.</p>
<h2 id="Step-4-Import-videos" class="common-anchor-header">الخطوة 4: استيراد مقاطع الفيديو.<button data-href="#Step-4-Import-videos" class="anchor-icon" translate="no">
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
    </button></h2><p>في دليل النشر في مستودع النظام، يقع استيراد_data.py، وهو البرنامج النصي لاستيراد مقاطع الفيديو. ما عليك سوى تحديث المسار إلى ملفات الفيديو والفاصل الزمني للاستيراد لتشغيل البرنامج النصي.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_update_path_video_5065928961.png" alt="5-update-path-video.png" class="doc-image" id="5-update-path-video.png" />
   </span> <span class="img-wrapper"> <span>5-تحديث المسار-باث-فيديو.png</span> </span></p>
<p>data_path: المسار إلى مقاطع الفيديو المراد استيرادها.</p>
<p>time.sleep(0.5): الفاصل الزمني الذي يستورد فيه النظام مقاطع الفيديو. يحتوي الخادم الذي نستخدمه لبناء نظام البحث عن الفيديو على 96 نواة وحدة معالجة مركزية. لذلك، يوصى بتعيين الفاصل الزمني على 0.5 ثانية. قم بتعيين الفاصل الزمني على قيمة أكبر إذا كان الخادم لديك يحتوي على عدد أقل من أنوية وحدة المعالجة المركزية. وإلا، فإن عملية الاستيراد ستضع عبئًا على وحدة المعالجة المركزية، وستخلق عمليات زومبي.</p>
<p>قم بتشغيل import_data.py لاستيراد مقاطع الفيديو.</p>
<pre><code translate="no">$ cd deploy
$ python3 import_data.py
</code></pre>
<p>بمجرد أن يتم استيراد الفيديوهات، ستكون جاهزًا مع نظام البحث عن الفيديو الخاص بك!</p>
<h2 id="Interface-display" class="common-anchor-header">عرض الواجهة<button data-href="#Interface-display" class="anchor-icon" translate="no">
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
    </button></h2><p>افتح متصفحك وادخل إلى 192.168.1.38:8001 لترى واجهة نظام البحث عن الفيديو كما هو موضح أدناه.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_video_search_interface_4c26d93e02.png" alt="6-video-search-interface.png" class="doc-image" id="6-video-search-interface.png" />
   </span> <span class="img-wrapper"> <span>6-واجهة البحث عن الفيديو. png</span> </span></p>
<p>قم بتبديل مفتاح الترس في أعلى اليمين لعرض جميع مقاطع الفيديو في المستودع.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_view_all_videos_repository_26ff37cad5.png" alt="7-view-all-videos-repository.png" class="doc-image" id="7-view-all-videos-repository.png" />
   </span> <span class="img-wrapper"> <span>7-عرض جميع مقاطع الفيديو في المستودع.png</span> </span></p>
<p>انقر على مربع التحميل في أعلى اليسار لإدخال صورة مستهدفة. كما هو موضح أدناه، يعرض النظام مقاطع الفيديو التي تحتوي على الإطارات الأكثر تشابهًا.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_enjoy_recommender_system_cats_bda1bf9db3.png" alt="8-enjoy-recommender-system-cats.png" class="doc-image" id="8-enjoy-recommender-system-cats.png" />
   </span> <span class="img-wrapper"> <span>8-enjoy-RE-recommender-نظام-قطط.png</span> </span></p>
<p>بعد ذلك، استمتع بنظام البحث عن الفيديو!</p>
<h2 id="Build-your-own" class="common-anchor-header">أنشئ نظامك الخاص<button data-href="#Build-your-own" class="anchor-icon" translate="no">
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
    </button></h2><p>في هذه المقالة، استخدمنا ميلفوس لبناء نظام للبحث عن مقاطع الفيديو حسب الصور. هذا مثال على تطبيق ميلفوس في معالجة البيانات غير المنظمة.</p>
<p>تتوافق Milvus مع العديد من أطر التعلم العميق، وتتيح عمليات البحث في أجزاء من الثانية لمتجهات بمليارات الثواني. لا تتردد في أخذ Milvus معك إلى المزيد من سيناريوهات الذكاء الاصطناعي: https://github.com/milvus-io/milvus.</p>
<p>لا تكن غريبًا، تابعنا على <a href="https://twitter.com/milvusio/">تويتر</a> أو انضم إلينا على <a href="https://milvusio.slack.com/join/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ#/">سلاك</a>! 👇🏻</p>
