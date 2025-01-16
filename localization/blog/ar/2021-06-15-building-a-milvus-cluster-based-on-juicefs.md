---
id: building-a-milvus-cluster-based-on-juicefs.md
title: ما هو JuiceFS؟
author: Changjian Gao and Jingjing Jia
date: 2021-06-15T07:21:07.938Z
desc: >-
  تعرّف على كيفية إنشاء مجموعة Milvus العنقودية استنادًا إلى نظام الملفات
  المشتركة JuiceFS، وهو نظام ملفات مشترك مصمم للبيئات السحابية الأصلية.
cover: assets.zilliz.com/Juice_FS_blog_cover_851cc9e726.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/building-a-milvus-cluster-based-on-juicefs'
---
<custom-h1>بناء مجموعة ميلفوس العنقودية القائمة على JuiceFS</custom-h1><p>التعاون بين المجتمعات مفتوحة المصدر شيء سحري. لا يقتصر الأمر على المتطوعين المتحمسين والأذكياء والمبدعين الذين يحافظون على ابتكار الحلول مفتوحة المصدر فحسب، بل يعملون أيضًا على الجمع بين الأدوات المختلفة معًا بطرق مثيرة للاهتمام ومفيدة. <a href="https://milvus.io/">ميلفوس،</a> قاعدة البيانات المتجهة الأكثر شعبية في العالم، و <a href="https://github.com/juicedata/juicefs">JuiceFS،</a> وهو نظام ملفات مشترك مصمم للبيئات السحابية الأصلية، اتحدا بهذه الروح من قبل مجتمعاتهما مفتوحة المصدر. تشرح هذه المقالة ما هو نظام JuiceFS، وكيفية بناء مجموعة Milvus استنادًا إلى تخزين الملفات المشتركة JuiceFS، والأداء الذي يمكن للمستخدمين توقعه باستخدام هذا الحل.</p>
<h2 id="What-is-JuiceFS" class="common-anchor-header"><strong>ما هو JuiceFS؟</strong><button data-href="#What-is-JuiceFS" class="anchor-icon" translate="no">
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
    </button></h2><p>JuiceFS هو نظام ملفات POSIX موزع مفتوح المصدر عالي الأداء ومفتوح المصدر، والذي يمكن بناؤه على رأس ريديس و S3. وقد تم تصميمه للبيئات السحابية الأصلية ويدعم إدارة البيانات من أي نوع وتحليلها وأرشفتها ونسخها احتياطيًا. يُستخدم JuiceFS بشكل شائع لحل تحديات البيانات الضخمة، وبناء تطبيقات الذكاء الاصطناعي (AI)، وجمع السجلات. يدعم النظام أيضًا مشاركة البيانات عبر عدة عملاء ويمكن استخدامه مباشرةً كتخزين مشترك في Milvus.</p>
<p>بعد استمرار البيانات والبيانات الوصفية المقابلة لها في تخزين الكائنات <a href="https://redis.io/">وRedis</a> على التوالي، يعمل نظام JuiceFS كبرنامج وسيط عديم الحالة. تتحقق مشاركة البيانات من خلال تمكين التطبيقات المختلفة من الالتحام مع بعضها البعض بسلاسة من خلال واجهة نظام ملفات قياسية. يعتمد JuiceFS على Redis، وهو مخزن بيانات مفتوح المصدر في الذاكرة، لتخزين البيانات الوصفية. يتم استخدام Redis لأنه يضمن الذرية ويوفر عمليات بيانات وصفية عالية الأداء. يتم تخزين جميع البيانات في تخزين الكائنات من خلال عميل JuiceFS. مخطط البنية على النحو التالي:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/juicefs_architecture_2023b37a4e.png" alt="juicefs-architecture.png" class="doc-image" id="juicefs-architecture.png" />
   </span> <span class="img-wrapper"> <span>JuiceFS-architecture.png</span> </span></p>
<h2 id="Build-a-Milvus-cluster-based-on-JuiceFS" class="common-anchor-header"><strong>بناء مجموعة Milvus على أساس JuiceFS</strong><button data-href="#Build-a-Milvus-cluster-based-on-JuiceFS" class="anchor-icon" translate="no">
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
    </button></h2><p>تعمل مجموعة Milvus المبنية باستخدام JuiceFS (انظر مخطط البنية أدناه) عن طريق تقسيم الطلبات الأولية باستخدام Mishards، وهي برمجية وسيطة لتجزئة المجموعة، لتوزيع الطلبات إلى وحداتها الفرعية. عند إدراج البيانات، تقوم Mishards بتخصيص طلبات المنبع إلى عقدة الكتابة في Milvus، والتي تخزن البيانات المدرجة حديثًا في JuiceFS. عند قراءة البيانات، يقوم Mishards بتحميل البيانات من JuiceFS من خلال عقدة قراءة Milvus إلى الذاكرة للمعالجة، ثم يجمع النتائج ويعيدها من الخدمات الفرعية في المنبع.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_cluster_built_with_juicefs_3a43cd262c.png" alt="milvus-cluster-built-with-juicefs.png" class="doc-image" id="milvus-cluster-built-with-juicefs.png" />
   </span> <span class="img-wrapper"> <span>milvus-cluster-built-built-with-juicefs.png</span> </span></p>
<h3 id="Step-1-Launch-MySQL-service" class="common-anchor-header"><strong>الخطوة 1: تشغيل خدمة MySQL</strong></h3><p>قم بتشغيل خدمة MySQL على <strong>أي</strong> عقدة في المجموعة. لمزيد من التفاصيل، راجع <a href="https://milvus.io/docs/v1.1.0/data_manage.md">إدارة البيانات الوصفية مع MySQL</a>.</p>
<h3 id="Step-2-Create-a-JuiceFS-file-system" class="common-anchor-header"><strong>الخطوة 2: إنشاء نظام ملفات JuiceFS</strong></h3><p>لأغراض العرض التوضيحي، يتم استخدام برنامج JuiceFS الثنائي الذي تم تجميعه مسبقًا. قم بتحميل <a href="https://github.com/juicedata/juicefs/releases">حزمة التثبيت</a> الصحيحة لنظامك واتبع <a href="https://github.com/juicedata/juicefs-quickstart">دليل البدء السريع</a> لبرنامج JuiceFS للحصول على تعليمات التثبيت التفصيلية. لإنشاء نظام ملفات JuiceFS، قم أولاً بإعداد قاعدة بيانات Redis لتخزين البيانات الوصفية. يوصى في عمليات النشر السحابية العامة باستضافة خدمة Redis على نفس السحابة التي يستضيفها التطبيق. بالإضافة إلى ذلك، قم بإعداد تخزين الكائنات ل JuiceFS. في هذا المثال، يتم استخدام Azure Blob Storage؛ ومع ذلك، يدعم JuiceFS جميع خدمات الكائنات تقريبًا. حدد خدمة تخزين الكائنات التي تناسب متطلبات السيناريو الخاص بك.</p>
<p>بعد تهيئة خدمة Redis وتخزين الكائنات، قم بتهيئة نظام ملفات جديد وقم بتحميل JuiceFS إلى الدليل المحلي:</p>
<pre><code translate="no">1 $  <span class="hljs-built_in">export</span> AZURE_STORAGE_CONNECTION_STRING=<span class="hljs-string">&quot;DefaultEndpointsProtocol=https;AccountName=XXX;AccountKey=XXX;EndpointSuffix=core.windows.net&quot;</span>
2 $ ./juicefs format \
3     --storage wasb \
4     --bucket https://&lt;container&gt; \
5     ... \
6     localhost <span class="hljs-built_in">test</span> <span class="hljs-comment">#format</span>
7 $ ./juicefs mount -d localhost ~/jfs  <span class="hljs-comment">#mount</span>
8
<button class="copy-code-btn"></button></code></pre>
<blockquote>
<p>إذا كان خادم Redis لا يعمل محلياً، استبدل المضيف المحلي بالعنوان التالي: <code translate="no">redis://&lt;user:password&gt;@host:6379/1</code>.</p>
</blockquote>
<p>عند نجاح التثبيت، يُرجع JuiceFS صفحة التخزين المشتركة <strong>/root/jfs</strong>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/installation_success_9d05279ecd.png" alt="installation-success.png" class="doc-image" id="installation-success.png" />
   </span> <span class="img-wrapper"> <span>installation-success.png</span> </span></p>
<h3 id="Step-3-Start-Milvus" class="common-anchor-header"><strong>الخطوة 3: بدء تشغيل ميلفوس</strong></h3><p>يجب أن تكون جميع العُقد في المجموعة مثبتة على Milvus، ويجب تكوين كل عقدة Milvus بإذن قراءة أو كتابة. يمكن تهيئة عقدة Milvus واحدة فقط كعقدة كتابة، ويجب أن تكون البقية عقد قراءة. أولاً، قم بتعيين معلمات القسمين <code translate="no">cluster</code> و <code translate="no">general</code> في ملف تكوين نظام Milvus <strong>server_config.yaml</strong>:</p>
<p><strong>القسم</strong> <code translate="no">cluster</code></p>
<table>
<thead>
<tr><th style="text-align:left"><strong>المعلمة</strong></th><th style="text-align:left"><strong>الوصف</strong></th><th style="text-align:left"><strong>التكوين</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:left"><code translate="no">enable</code></td><td style="text-align:left">ما إذا كان سيتم تمكين وضع المجموعة</td><td style="text-align:left"><code translate="no">true</code></td></tr>
<tr><td style="text-align:left"><code translate="no">role</code></td><td style="text-align:left">دور نشر ميلفوس</td><td style="text-align:left"><code translate="no">rw</code>/<code translate="no">ro</code></td></tr>
</tbody>
</table>
<p><strong>القسم</strong> <code translate="no">general</code></p>
<pre><code translate="no"><span class="hljs-comment"># meta_uri is the URI for metadata storage, using MySQL (for Milvus Cluster). Format: mysql://&lt;username:password&gt;@host:port/database</span>
general:
  timezone: UTC+8
  meta_uri: mysql://root:milvusroot@host:3306/milvus
<button class="copy-code-btn"></button></code></pre>
<p>أثناء التثبيت، يتم تعيين مسار التخزين المشترك لـ JuiceFS الذي تم تكوينه على أنه <strong>/root/jfs/milvus/db</strong>.</p>
<pre><code translate="no">1 <span class="hljs-built_in">sudo</span> docker run -d --name milvus_gpu_1.0.0 --gpus all \
2 -p 19530:19530 \
3 -p 19121:19121 \
4 -v /root/jfs/milvus/db:/var/lib/milvus/db \  <span class="hljs-comment">#/root/jfs/milvus/db is the shared storage path</span>
5 -v /home/<span class="hljs-variable">$USER</span>/milvus/conf:/var/lib/milvus/conf \
6 -v /home/<span class="hljs-variable">$USER</span>/milvus/logs:/var/lib/milvus/logs \
7 -v /home/<span class="hljs-variable">$USER</span>/milvus/wal:/var/lib/milvus/wal \
8 milvusdb/milvus:1.0.0-gpu-d030521-1ea92e
9
<button class="copy-code-btn"></button></code></pre>
<p>بعد اكتمال التثبيت، ابدأ تشغيل Milvus وتأكد من تشغيله بشكل صحيح. أخيرًا، ابدأ تشغيل خدمة Mishards على <strong>أي</strong> من العقد في الكتلة. تُظهر الصورة أدناه تشغيل Mishards بنجاح. لمزيد من المعلومات، راجع البرنامج <a href="https://github.com/milvus-io/bootcamp/tree/new-bootcamp/deployments/juicefs">التعليمي</a> GitHub.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/mishards_launch_success_921695d3a8.png" alt="mishards-launch-success.png" class="doc-image" id="mishards-launch-success.png" />
   </span> <span class="img-wrapper"> <span>mishards-launch-success.png</span> </span></p>
<h2 id="Performance-benchmarks" class="common-anchor-header"><strong>معايير الأداء</strong><button data-href="#Performance-benchmarks" class="anchor-icon" translate="no">
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
    </button></h2><p>عادةً ما يتم تنفيذ حلول التخزين المشتركة بواسطة أنظمة التخزين المتصلة بالشبكة (NAS). تشمل أنواع أنظمة NAS الشائعة الاستخدام نظام ملفات الشبكة (NFS) وكتلة رسائل الخادم (SMB). وتوفر المنصات السحابية العامة بشكل عام خدمات تخزين مُدارة متوافقة مع هذه البروتوكولات، مثل نظام الملفات المرن (EFS) من أمازون.</p>
<p>على عكس أنظمة NAS التقليدية، يتم تنفيذ JuiceFS استنادًا إلى نظام الملفات في فضاء المستخدمين (FUSE)، حيث تتم جميع عمليات قراءة البيانات وكتابتها مباشرةً من جانب التطبيق، مما يقلل من زمن الوصول. هناك أيضًا ميزات فريدة في JuiceFS لا يمكن العثور عليها في أنظمة NAS الأخرى، مثل ضغط البيانات والتخزين المؤقت.</p>
<p>يكشف الاختبار المعياري أن نظام JuiceFS يقدم مزايا كبيرة مقارنةً بنظام EFS. في معيار البيانات الوصفية (الشكل 1)، يشهد نظام JuiceFS عمليات إدخال/إخراج في الثانية (IOPS) أعلى بعشر مرات من نظام EFS. بالإضافة إلى ذلك، يُظهر معيار إنتاجية الإدخال/الإخراج (الشكل 2) تفوق أداء JuiceFS على EFS في كل من سيناريوهات العمل الفردي والمتعدد.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/performance_benchmark_1_b7fcbb4439.png" alt="performance-benchmark-1.png" class="doc-image" id="performance-benchmark-1.png" />
   </span> <span class="img-wrapper"> <span>الأداء-معيار الأداء-1.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/performance_benchmark_2_e311098123.png" alt="performance-benchmark-2.png" class="doc-image" id="performance-benchmark-2.png" />
   </span> <span class="img-wrapper"> <span>الأداء-معيار الأداء-2.png</span> </span></p>
<p>بالإضافة إلى ذلك، يُظهر الاختبار المعياري أن وقت استرجاع الاستعلام الأول، أو الوقت اللازم لتحميل البيانات المدرجة حديثًا من القرص إلى الذاكرة، بالنسبة لمجموعة Milvus المستندة إلى JuiceFS هو 0.032 ثانية فقط في المتوسط، مما يشير إلى أن البيانات يتم تحميلها من القرص إلى الذاكرة بشكل فوري تقريبًا. بالنسبة لهذا الاختبار، تم قياس وقت استرجاع الاستعلام الأول باستخدام مليون صف من البيانات المتجهة ذات 128 بُعدًا تم إدراجها على دفعات من 100 ألف على فترات تتراوح من 1 إلى 8 ثوانٍ.</p>
<p>إن JuiceFS هو نظام تخزين ملفات مشترك مستقر وموثوق به، وتوفر مجموعة Milvus المبنية على JuiceFS أداءً عاليًا وسعة تخزين مرنة.</p>
<h2 id="Learn-more-about-Milvus" class="common-anchor-header"><strong>اعرف المزيد عن ميلفوس</strong><button data-href="#Learn-more-about-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus هو أداة قوية قادرة على تشغيل مجموعة واسعة من تطبيقات الذكاء الاصطناعي وتطبيقات البحث عن التشابه المتجه. لمعرفة المزيد عن المشروع، اطلع على الموارد التالية:</p>
<ul>
<li>اقرأ <a href="https://zilliz.com/blog">مدونتنا</a>.</li>
<li>تفاعل مع مجتمعنا مفتوح المصدر على <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>استخدم أو ساهم في قاعدة بيانات المتجهات الأكثر شعبية في العالم على <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>اختبر تطبيقات الذكاء الاصطناعي وانشرها بسرعة من خلال <a href="https://github.com/milvus-io/bootcamp">معسكرنا التدريبي</a> الجديد.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/writer_bio_changjian_gao_68018f7716.png" alt="writer bio-changjian gao.png" class="doc-image" id="writer-bio-changjian-gao.png" />
   </span> <span class="img-wrapper"> <span>السيرة الذاتية</span> </span> <span class="img-wrapper"> <span>للكاتب-تشانغجيان</span> </span> <span class="img-wrapper"> <span>جاو.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/writer_bio_jingjing_jia_a85d1c2e3b.png" alt="writer bio-jingjing jia.png" class="doc-image" id="writer-bio-jingjing-jia.png" /><span>السيرة الذاتية للكاتب-جينغجينغ جيا.png</span> </span></p>
