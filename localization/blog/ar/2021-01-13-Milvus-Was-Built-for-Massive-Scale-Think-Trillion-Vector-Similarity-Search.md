---
id: Milvus-Was-Built-for-Massive-Scale-Think-Trillion-Vector-Similarity-Search.md
title: تم تصميم Milvus للبحث عن تشابه المتجهات على نطاق واسع (فكر في التريليون)
author: milvus
date: 2021-01-13T08:56:00.480Z
desc: >-
  استكشف قوة المصدر المفتوح في مشروعك التالي للذكاء الاصطناعي أو التعلم الآلي.
  قم بإدارة البيانات المتجهة على نطاق واسع وقم بإدارة البيانات المتجهة على نطاق
  واسع وقم بتشغيل البحث عن التشابه باستخدام Milvus.
cover: assets.zilliz.com/1_9a6be0b54f.jpg
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/Milvus-Was-Built-for-Massive-Scale-Think-Trillion-Vector-Similarity-Search
---
<custom-h1>صُممت شركة Milvus للبحث عن تشابه المتجهات على نطاق واسع (فكر في تريليون)</custom-h1><p>كل يوم، يتم إهدار عدد لا يُحصى من الرؤى المهمة للأعمال التجارية لأن الشركات لا تستطيع فهم بياناتها الخاصة. تشير التقديرات إلى أن البيانات غير المهيكلة، مثل النصوص والصور والفيديو والصوت، تمثل 80% من جميع البيانات - ولكن يتم تحليل 1% منها فقط. لحسن الحظ، يجعل <a href="https://medium.com/unstructured-data-service/the-easiest-way-to-search-among-1-billion-image-vectors-d6faf72e361f">الذكاء الاصطناعي (AI)</a> والبرمجيات مفتوحة المصدر وقانون مور التحليلات على نطاق الآلة أكثر سهولة من أي وقت مضى. باستخدام البحث عن التشابه المتجه، من الممكن استخراج القيمة من مجموعات البيانات الضخمة غير المهيكلة. وتتضمن هذه التقنية تحويل البيانات غير المهيكلة إلى متجهات مميزة، وهي صيغة بيانات رقمية سهلة الاستخدام آليًا يمكن معالجتها وتحليلها في الوقت الفعلي.</p>
<p>البحث عن تشابه المتجهات له تطبيقات تشمل التجارة الإلكترونية والأمن وتطوير الأدوية الجديدة وغيرها. وتعتمد هذه الحلول على مجموعات بيانات ديناميكية تحتوي على ملايين أو مليارات أو حتى تريليونات من المتجهات، وغالباً ما تعتمد فائدتها على إرجاع نتائج شبه فورية. <a href="https://milvus.io/">Milvus</a> هو حل مفتوح المصدر لإدارة البيانات المتجهة تم إنشاؤه من الألف إلى الياء لإدارة مجموعات البيانات المتجهة الكبيرة والبحث فيها بكفاءة. تغطي هذه المقالة نهج ميلفوس في إدارة بيانات المتجهات، بالإضافة إلى كيفية تحسين النظام الأساسي للبحث في تشابه المتجهات.</p>
<p><strong>الانتقال إلى:</strong></p>
<ul>
<li><a href="#milvus-was-built-for-massive-scale-think-trillion-vector-similarity-search">تم تصميم Milvus من أجل البحث عن تشابه المتجهات على نطاق واسع (فكر في تريليون)</a><ul>
<li><a href="#lsm-trees-keep-dynamic-data-management-efficient-at-massive-scales">تحافظ أشجار LSM على كفاءة إدارة البيانات الديناميكية على نطاقات هائلة</a>- <a href="#a-segment-of-10-dimensional-vectors-in-milvus"><em>شريحة من المتجهات ذات 10 أبعاد في Milvus</em></a>.</li>
<li><a href="#data-management-is-optimized-for-rapid-access-and-limited-fragmentation">تم تحسين إدارة البيانات من أجل الوصول السريع والتجزئة المحدودة</a>- <a href="#an-illustration-of-inserting-vectors-in-milvus"><em>رسم توضيحي لإدراج المتجهات في ملفوس</em></a>- <a href="#queried-data-files-before-the-merge"><em>ملفات البيانات المستعلم عنها قبل الدمج</em></a>- <a href="#queried-data-files-after-the-merge"><em>ملفات البيانات المستعلم عنها بعد الدمج</em></a></li>
<li><a href="#similarity-searched-is-accelerated-by-indexing-vector-data">يتم تسريع البحث عن التشابه عن طريق فهرسة البيانات المتجهة</a></li>
<li><a href="#learn-more-about-milvus">معرفة المزيد عن ميلفوس</a></li>
</ul></li>
</ul>
<h3 id="LSM-trees-keep-dynamic-data-management-efficient-at-massive-scales" class="common-anchor-header">تحافظ أشجار LSM على كفاءة إدارة البيانات الديناميكية على نطاقات ضخمة</h3><p>لتوفير إدارة ديناميكية فعالة للبيانات، يستخدم Milvus بنية بيانات شجرة الدمج المهيكلة السجلية (LSM tree). تعتبر أشجار LSM مناسبة تمامًا للوصول إلى البيانات التي تحتوي على عدد كبير من عمليات الإدراج والحذف. للحصول على معلومات مفصلة حول السمات المحددة لأشجار LSM التي تساعد على ضمان إدارة البيانات الديناميكية عالية الأداء، راجع <a href="http://paperhub.s3.amazonaws.com/18e91eb4db2114a06ea614f0384f2784.pdf">البحث الأصلي</a> الذي نشره مخترعوها. أشجار LSM هي بنية البيانات الأساسية التي تستخدمها العديد من قواعد البيانات الشائعة، بما في ذلك <a href="https://cloud.google.com/bigtable">BigTable</a> <a href="https://cassandra.apache.org/">وCassandra</a> <a href="https://rocksdb.org/">وRocksDB</a>.</p>
<p>تتواجد المتجهات ككيانات في ميلفوس ويتم تخزينها في مقاطع. يحتوي كل مقطع على ما يصل إلى 8 ملايين كيان تقريبًا. يحتوي كل كيان على حقول لمعرف فريد ومدخلات متجه، حيث يمثل هذا الأخير في أي مكان من 1 إلى 32768 بُعدًا.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Milvus_Was_Built_for_Massive_Scale_Think_Trillion_Vector_Similarity_Search_2_492d31c7a0.png" alt="Blog_Milvus Was Built for Massive-Scale (Think Trillion) Vector Similarity Search_2.png" class="doc-image" id="blog_milvus-was-built-for-massive-scale-(think-trillion)-vector-similarity-search_2.png" />
   </span> <span class="img-wrapper"> <span>Blog_Milvus تم تصميمه للبحث عن تشابه المتجهات على نطاق واسع (فكر في تريليون) متجه_2.png</span> </span></p>
<h3 id="Data-management-is-optimized-for-rapid-access-and-limited-fragmentation" class="common-anchor-header">تم تحسين إدارة البيانات من أجل الوصول السريع والتجزئة المحدودة</h3><p>عند تلقي طلب إدراج، يكتب Milvus بيانات جديدة في <a href="https://milvus.io/docs/v0.11.0/write_ahead_log.md">سجل الكتابة المسبق (WAL)</a>. بعد تسجيل الطلب بنجاح في ملف السجل، تتم كتابة البيانات إلى مخزن مؤقت قابل للتغيير. وأخيراً، يؤدي أحد المشغلات الثلاثة إلى أن يصبح المخزن المؤقت غير قابل للتغيير ويتم مسحه إلى القرص:</p>
<ol>
<li><strong>الفواصل الزمنية:</strong> يتم مسح البيانات بانتظام إلى القرص على فترات زمنية محددة (ثانية واحدة افتراضيًا).</li>
<li><strong>حجم المخزن المؤقت:</strong> تصل البيانات المتراكمة إلى الحد الأعلى للمخزن المؤقت القابل للتغيير (128 ميجابايت).</li>
<li><strong>المشغل اليدوي:</strong> يتم مسح البيانات يدويًا إلى القرص عندما يستدعي العميل وظيفة التدفق.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Milvus_Was_Built_for_Massive_Scale_Think_Trillion_Vector_Similarity_Search_3_852dc2c9bb.png" alt="Blog_Milvus Was Built for Massive-Scale (Think Trillion) Vector Similarity Search_3.png" class="doc-image" id="blog_milvus-was-built-for-massive-scale-(think-trillion)-vector-similarity-search_3.png" />
   </span> <span class="img-wrapper"> <span>Blog_Milvus صُمم من أجل البحث عن تشابه المتجهات على نطاق واسع (فكّر في تريليون) _3.png</span> </span></p>
<p>يمكن للمستخدمين إضافة عشرات أو ملايين المتجهات في المرة الواحدة، مما يؤدي إلى إنشاء ملفات بيانات بأحجام مختلفة عند إدراج متجهات جديدة. وينتج عن ذلك تجزئة يمكن أن تؤدي إلى تعقيد إدارة البيانات وإبطاء البحث عن تشابه المتجهات. ولمنع التجزئة المفرطة للبيانات، يدمج برنامج Milvus أجزاء البيانات باستمرار حتى يصل حجم الملف المدمج إلى حد يمكن للمستخدم تكوينه (على سبيل المثال، 1 جيجابايت). على سبيل المثال، بالنظر إلى حد أعلى يبلغ 1 جيجابايت، فإن إدراج 100 مليون متجه من 512 متجهًا سيؤدي إلى 200 ملف بيانات فقط.</p>
<p>في سيناريوهات الحساب التزايدي حيث يتم إدراج المتجهات والبحث عنها بشكل متزامن، يجعل Milvus بيانات المتجهات المدرجة حديثًا متاحة على الفور للبحث قبل دمجها مع البيانات الأخرى. بعد دمج البيانات، ستتم إزالة ملفات البيانات الأصلية وسيتم استخدام الملف المدمج حديثًا للبحث بدلاً من ذلك.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Milvus_Was_Built_for_Massive_Scale_Think_Trillion_Vector_Similarity_Search_4_6bef3d914c.png" alt="Blog_Milvus Was Built for Massive-Scale (Think Trillion) Vector Similarity Search_4.png" class="doc-image" id="blog_milvus-was-built-for-massive-scale-(think-trillion)-vector-similarity-search_4.png" />
   </span> <span class="img-wrapper"> <span>Blog_Milvus تم تصميمه للبحث عن تشابه المتجهات على نطاق واسع (فكّر في تريليون) _4.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Milvus_Was_Built_for_Massive_Scale_Think_Trillion_Vector_Similarity_Search_5_3851c2d789.png" alt="Blog_Milvus Was Built for Massive-Scale (Think Trillion) Vector Similarity Search_5.png" class="doc-image" id="blog_milvus-was-built-for-massive-scale-(think-trillion)-vector-similarity-search_5.png" />
   </span> <span class="img-wrapper"> <span>Blog_Milvus تم تصميمه للبحث عن تشابه المتجهات على نطاق واسع (فكّر تريليون) _5.png</span> </span></p>
<h3 id="Similarity-searched-is-accelerated-by-indexing-vector-data" class="common-anchor-header">يتم تسريع البحث عن التشابه من خلال فهرسة البيانات المتجهة</h3><p>بشكل افتراضي، يعتمد ميلفوس على البحث بالقوة الغاشمة عند الاستعلام عن بيانات المتجهات. يُعرف هذا النهج أيضًا باسم البحث الشامل، ويتحقق هذا النهج من جميع بيانات المتجهات في كل مرة يتم فيها تشغيل الاستعلام. مع مجموعات البيانات التي تحتوي على ملايين أو مليارات المتجهات متعددة الأبعاد، تكون هذه العملية بطيئة جدًا بحيث لا تكون مفيدة في معظم سيناريوهات البحث عن التشابه. للمساعدة في تسريع وقت الاستعلام، يتم استخدام خوارزميات لإنشاء فهرس متجه. يتم تجميع البيانات المفهرسة بحيث تكون المتجهات المتشابهة أقرب إلى بعضها البعض، مما يسمح لمحرك البحث عن التشابه بالاستعلام عن جزء فقط من إجمالي البيانات، مما يقلل بشكل كبير من أوقات الاستعلام مع التضحية بالدقة.</p>
<p>تستخدم معظم أنواع الفهارس المتجهة التي يدعمها Milvus خوارزميات البحث التقريبي الأقرب إلى الجار (ANN). هناك العديد من فهارس ANN، وكل منها يأتي مع مفاضلات بين الأداء والدقة ومتطلبات التخزين. يدعم Milvus الفهارس المستندة إلى التكميم والرسم البياني والشجرة، وكلها تخدم سيناريوهات تطبيق مختلفة. راجع <a href="https://milvus.io/docs/v0.11.0/index.md#CPU">وثائق</a> Milvus <a href="https://milvus.io/docs/v0.11.0/index.md#CPU">الفنية</a> للحصول على مزيد من المعلومات حول بناء الفهارس والأنواع المحددة من الفهارس المتجهة التي يدعمها.</p>
<p>يولد بناء الفهرس الكثير من البيانات الوصفية. على سبيل المثال، فإن فهرسة 100 مليون متجه مكون من 512 متجهًا محفوظًا في 200 ملف بيانات سينتج عنه 200 ملف فهرسة إضافي. من أجل التحقق بكفاءة من حالات الملفات وحذف أو إدراج ملفات جديدة، يلزم وجود نظام فعال لإدارة البيانات الوصفية. يستخدم Milvus معالجة المعاملات عبر الإنترنت (OLTP)، وهي تقنية معالجة بيانات مناسبة تمامًا لتحديث و/أو حذف كميات صغيرة من البيانات في قاعدة البيانات. يستخدم Milvus SQLite أو MySQL لإدارة البيانات الوصفية.</p>
<h3 id="Learn-more-about-Milvus" class="common-anchor-header">تعرف على المزيد حول ميلفوس</h3><p>Milvus هي منصة مفتوحة المصدر لإدارة البيانات المتجهة وهي حاليًا في مرحلة الاحتضان في مؤسسة لينكس <a href="https://lfaidata.foundation/">للذكاء الاصطناعي والبيانات،</a> وهي منظمة تابعة لمؤسسة لينكس. تم جعل Milvus مفتوح المصدر في عام 2019 من قبل شركة <a href="https://zilliz.com">Zilliz،</a> وهي شركة برمجيات علوم البيانات التي أطلقت المشروع. يمكن العثور على مزيد من المعلومات حول ميلفوس على <a href="https://milvus.io/">موقعها الإلكتروني</a>. إذا كنت مهتمًا بالبحث عن التشابه المتجه، أو استخدام الذكاء الاصطناعي لإطلاق إمكانات البيانات غير المهيكلة، يُرجى الانضمام إلى <a href="https://github.com/milvus-io">مجتمعنا مفتوح المصدر</a> على GitHub.</p>
