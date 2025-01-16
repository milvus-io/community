---
id: >-
  2022-06-23-How-Short-video-Platform-Likee-Removes-Duplicate-Videos-with-Milvus.md
title: >-
  كيف تزيل منصة مقاطع الفيديو القصيرة Likee مقاطع الفيديو المكررة باستخدام
  Milvus
author: 'Xinyang Guo, Baoyu Han'
date: 2022-06-23T00:00:00.000Z
desc: >-
  تعرّف على كيفية استخدام Likee لـ Milvus لتحديد مقاطع الفيديو المكررة في أجزاء
  من الثانية.
cover: >-
  assets.zilliz.com/How_Short_video_Platform_Likee_Removes_Duplicate_Videos_with_Milvus_07bd75ec82.png
tag: Scenarios
tags: Use Cases of Milvus
canonicalUrl: >-
  https://milvus.io/blog/2022-06-23-How-Short-video-Platform-Likee-Removes-Duplicate-Videos-with-Milvus.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/How_Short_video_Platform_Likee_Removes_Duplicate_Videos_with_Milvus_07bd75ec82.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>صورة الغلاف</span> </span></p>
<blockquote>
<p>كتب هذا المقال شينيانغ قوه وباويو هان، مهندسان في شركة BIGO، وترجمته <a href="https://www.linkedin.cn/incareer/in/rosie-zhang-694528149">روزي تشانغ</a>.</p>
</blockquote>
<p>شركة BIGO<a href="https://www.bigo.sg/">Technology</a> (BIGO) هي واحدة من أسرع شركات التكنولوجيا السنغافورية نموًا. بدعم من تكنولوجيا الذكاء الاصطناعي، اكتسبت منتجات وخدمات BIGO القائمة على الفيديو شعبية هائلة في جميع أنحاء العالم، مع أكثر من 400 مليون مستخدم في أكثر من 150 دولة. وتشمل هذه المنتجات وخدمات <a href="https://www.bigo.tv/bigo_intro/en.html?hk=true">Bigo Live</a> (البث المباشر) و <a href="https://likee.video/">Likee</a> (مقاطع الفيديو القصيرة).</p>
<p>Likee هي منصة عالمية لإنشاء مقاطع الفيديو القصيرة حيث يمكن للمستخدمين مشاركة لحظاتهم والتعبير عن أنفسهم والتواصل مع العالم. ولزيادة تجربة المستخدم والتوصية بمحتوى عالي الجودة للمستخدمين، تحتاج Likee إلى التخلص من مقاطع الفيديو المكررة من بين الكم الهائل من مقاطع الفيديو التي ينشئها المستخدمون كل يوم، وهو ما لا يمثل مهمة سهلة.</p>
<p>تعرض هذه المدونة كيفية استخدام BIGO لـ <a href="https://milvus.io">Milvus،</a> وهي قاعدة بيانات متجهة مفتوحة المصدر، لإزالة مقاطع الفيديو المكررة بشكل فعال.</p>
<p><strong>الانتقال إلى:</strong></p>
<ul>
<li><a href="#Overview">نظرة عامة</a></li>
<li><a href="#Video-deduplication-workflow">سير عمل إلغاء تكرار الفيديو</a></li>
<li><a href="#System-architecture">بنية النظام</a></li>
<li><a href="#Using-Milvus-vector-database-to-power-similarity-search">استخدام Milvus لتشغيل البحث عن التشابه</a></li>
</ul>
<custom-h1>نظرة عامة</custom-h1><p>Milvus هي قاعدة بيانات متجهة مفتوحة المصدر تتميز ببحث متجه فائق السرعة. بدعم من Milvus، يمكن ل Likee إكمال البحث في غضون 200 مللي ثانية مع ضمان معدل استرجاع مرتفع. وفي الوقت نفسه، من خلال <a href="https://milvus.io/docs/v2.0.x/scaleout.md#Scale-a-Milvus-Cluster">توسيع نطاق Milvus أفقيًا،</a> تزيد Likee بنجاح من إنتاجية الاستعلامات المتجهة، مما يزيد من كفاءتها.</p>
<custom-h1>سير عمل إلغاء تكرار الفيديو</custom-h1><p>كيف يحدد Likee مقاطع الفيديو المكررة؟ في كل مرة يتم فيها إدخال مقطع فيديو استعلام في نظام Likee، يتم تقطيعه إلى 15-20 إطارًا ويتم تحويل كل إطار إلى متجه ميزة. ثم يقوم Likee بالبحث في قاعدة بيانات تضم 700 مليون متجه للعثور على أفضل K أكثر المتجهات تشابهًا. يتوافق كل واحد من أفضل متجهات K مع مقطع فيديو في قاعدة البيانات. يقوم Likee بإجراء المزيد من عمليات البحث المنقّحة للحصول على النتائج النهائية وتحديد مقاطع الفيديو التي ستتم إزالتها.</p>
<custom-h1>بنية النظام</custom-h1><p>دعونا نلقي نظرة فاحصة على كيفية عمل نظام Likee لإزالة الازدواجية في الفيديو باستخدام Milvus. كما هو موضح في الرسم البياني أدناه، ستتم كتابة مقاطع الفيديو الجديدة التي يتم تحميلها إلى Likee إلى نظام تخزين البيانات Kafka في الوقت الفعلي ويستهلكها مستهلكو Kafka. يتم استخراج متجهات الميزات الخاصة بمقاطع الفيديو هذه من خلال نماذج التعلّم العميق، حيث يتم تحويل البيانات غير المهيكلة (الفيديو) إلى متجهات ميزات. يتم تجميع متجهات الميزات هذه بواسطة النظام وإرسالها إلى مدقق التشابه.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Likee_1_6f7ebcd8fc.png" alt="Architechure of Likee's video de-duplication system" class="doc-image" id="architechure-of-likee's-video-de-duplication-system" />
   </span> <span class="img-wrapper"> <span>التصميم الهندسي لنظام إلغاء ازدواجية الفيديو في Likee</span> </span></p>
<p>ستتم فهرسة ناقلات الميزات المستخرجة بواسطة Milvus وتخزينها في Ceph، قبل أن يتم <a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">تحميلها بواسطة عقدة استعلام Milvus</a> لمزيد من البحث. سيتم أيضًا تخزين معرّفات الفيديو المقابلة لمتجهات الميزات هذه في نفس الوقت في TiDB أو Pika وفقًا للاحتياجات الفعلية.</p>
<h3 id="Using-Milvus-vector-database-to-power-similarity-search" class="common-anchor-header">استخدام قاعدة بيانات متجهات Milvus لتشغيل البحث عن التشابه</h3><p>عند البحث عن متجهات متشابهة، تشكل مليارات البيانات الموجودة، إلى جانب كميات كبيرة من البيانات الجديدة التي يتم إنشاؤها كل يوم، تحديات كبيرة لوظائف محرك البحث عن المتجهات. بعد تحليل شامل، اختارت Likee في النهاية محرك البحث المتجه الموزع Milvus، وهو محرك بحث متجهي موزع ذو أداء عالٍ ومعدل استرجاع مرتفع، لإجراء بحث تشابه المتجهات.</p>
<p>كما هو موضح في الرسم البياني أدناه، يسير إجراء بحث التشابه على النحو التالي:</p>
<ol>
<li><p>أولاً، يُجري برنامج Milvus بحثًا دفعيًا لاستدعاء أفضل 100 متجه متشابه لكل متجه من متجهات السمات المتعددة المستخرجة من فيديو جديد. يرتبط كل متجه مشابه بمعرف الفيديو المقابل له.</p></li>
<li><p>ثانيًا، من خلال مقارنة معرّفات الفيديو، يزيل Milvus مقاطع الفيديو المكررة ويسترجع متجهات الملامح لمقاطع الفيديو المتبقية من TiDB أو Pika.</p></li>
<li><p>أخيرًا، يحسب Milvus التشابه بين كل مجموعة من متجهات الميزات المسترجعة ومتجهات ميزات الفيديو المستعلم ويضع درجات التشابه بينهما. يتم إرجاع معرف الفيديو الذي حصل على أعلى الدرجات كنتيجة. وهكذا يتم الانتهاء من البحث عن تشابه الفيديو.</p></li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/02_a24d251c8f.png" alt="Procedure of a similarity search" class="doc-image" id="procedure-of-a-similarity-search" />
   </span> <span class="img-wrapper"> <span>إجراء بحث التشابه</span> </span></p>
<p>بصفته محرك بحث متجه عالي الأداء، قام ميلفوس بعمل استثنائي في نظام إلغاء ازدواجية الفيديو الخاص بشركة Likee، مما عزز بشكل كبير نمو أعمال الفيديو القصير في BIGO. فيما يتعلق بأعمال الفيديو، هناك العديد من السيناريوهات الأخرى التي يمكن تطبيق Milvus عليها، مثل حظر المحتوى غير القانوني أو التوصية بمقاطع الفيديو المخصصة. تتطلع كل من BIGO و Milvus إلى التعاون المستقبلي في المزيد من المجالات.</p>
