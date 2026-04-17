---
id: AI-applications-with-Milvus.md
title: كيفية إنشاء 4 تطبيقات ذكاء اصطناعي شائعة مع ميلفوس
author: milvus
date: 2021-04-08T04:14:03.700Z
desc: >-
  تعمل Milvus على تسريع تطوير تطبيقات التعلم الآلي وعمليات التعلم الآلي (MLOps).
  باستخدام Milvus، يمكنك تطوير الحد الأدنى من المنتجات القابلة للتطبيق (MVP)
  بسرعة مع الحفاظ على التكاليف في حدود أقل.
cover: assets.zilliz.com/blog_cover_4a9807b9e0.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/AI-applications-with-Milvus'
---
<custom-h1>كيف تصنع 4 تطبيقات ذكاء اصطناعي شهيرة باستخدام Milvus</custom-h1><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/blog_cover_4a9807b9e0.png" alt="blog cover.png" class="doc-image" id="blog-cover.png" />
   </span> <span class="img-wrapper"> <span>غلاف المدونة.png</span> </span></p>
<p><a href="https://milvus.io/">Milvus</a> هي قاعدة بيانات متجهات مفتوحة المصدر. يدعم إضافة وحذف وتحديث وإضافة مجموعات البيانات المتجهة الضخمة التي تم إنشاؤها عن طريق استخراج متجهات الميزات من البيانات غير المنظمة باستخدام نماذج الذكاء الاصطناعي. وبفضل مجموعة شاملة من واجهات برمجة التطبيقات البديهية، ودعم العديد من مكتبات الفهرسة المعتمدة على نطاق واسع (مثل Faiss وNMSLIB وAnnoy)، يعمل Milvus على تسريع تطوير تطبيقات التعلم الآلي وعمليات التعلم الآلي (MLOps). وباستخدام Milvus، يمكنك تطوير الحد الأدنى من المنتجات القابلة للتطبيق (MVP) بسرعة مع الحفاظ على التكاليف في حدود أقل.</p>
<p>&quot;ما هي الموارد المتاحة لتطوير تطبيق ذكاء اصطناعي باستخدام Milvus؟&quot; سؤال شائع في مجتمع Milvus. قامت <a href="https://zilliz.com/">شركة</a> Zilliz، وهي <a href="https://zilliz.com/">الشركة</a> التي تقف وراء Milvus، بتطوير عدد من العروض التوضيحية التي تستفيد من Milvus لإجراء بحث تشابه بسرعة البرق لتشغيل التطبيقات الذكية. يمكن العثور على التعليمات البرمجية المصدرية لحلول Milvus على <a href="https://github.com/zilliz-bootcamp">zilliz-bootcamp</a>. توضح السيناريوهات التفاعلية التالية معالجة اللغة الطبيعية، والبحث العكسي عن الصور، والبحث الصوتي، والرؤية الحاسوبية.</p>
<p>لا تتردد في تجربة الحلول لاكتساب بعض الخبرة العملية مع سيناريوهات محددة! شارك سيناريوهات التطبيقات الخاصة بك عبر:</p>
<ul>
<li><a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">سلاك</a></li>
<li><a href="https://github.com/milvus-io/milvus/discussions">جيثب</a></li>
</ul>
<p><br/></p>
<p><strong>الانتقال إلى:</strong></p>
<ul>
<li><a href="#natural-language-processing-chatbots">معالجة اللغة الطبيعية (روبوتات الدردشة الآلية)</a></li>
<li><a href="#reverse-image-search-systems">البحث العكسي عن الصور</a></li>
<li><a href="#audio-search-systems">البحث الصوتي</a></li>
<li><a href="#video-object-detection-computer-vision">اكتشاف كائنات الفيديو (رؤية الكمبيوتر)</a></li>
</ul>
<p><br/></p>
<h3 id="Natural-language-processing-chatbots" class="common-anchor-header">معالجة اللغة الطبيعية (روبوتات الدردشة الآلية)</h3><p>يمكن استخدام برنامج Milvus لبناء روبوتات الدردشة الآلية التي تستخدم معالجة اللغة الطبيعية لمحاكاة المشغّل المباشر، والإجابة عن الأسئلة، وتوجيه المستخدمين إلى المعلومات ذات الصلة، وتقليل تكاليف العمالة. لتوضيح سيناريو هذا التطبيق، قامت شركة Zilliz ببناء روبوت دردشة مدعوم بالذكاء الاصطناعي يفهم اللغة الدلالية من خلال الجمع بين Milvus <a href="https://en.wikipedia.org/wiki/BERT_(language_model)">وBERT،</a> وهو نموذج تعلم آلي (ML) تم تطويره للتدريب المسبق على البرمجة اللغوية العصبية.</p>
<p>👉كود المصدر ：رمز المصدر: <a href="https://github.com/zilliz-bootcamp/intelligent_question_answering_v2">zilliz-bootcamp/intelligent_question_answering_v2</a></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_c301a9e4bd.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<h4 id="How-to-use" class="common-anchor-header">كيفية الاستخدام</h4><ol>
<li><p>قم بتحميل مجموعة بيانات تتضمن أزواج الأسئلة والأجوبة. قم بتنسيق الأسئلة والأجوبة في عمودين منفصلين. بدلاً من ذلك، تتوفر <a href="https://zilliz.com/solutions/qa">مجموعة بيانات نموذجية</a> للتنزيل.</p></li>
<li><p>بعد كتابة سؤالك، سيتم استرجاع قائمة بالأسئلة المتشابهة من مجموعة البيانات التي تم تحميلها.</p></li>
<li><p>اكشف عن الإجابة باختيار السؤال الأكثر تشابهًا مع سؤالك.</p></li>
</ol>
<p>👉فيديو ：<a href="https://www.youtube.com/watch?v=ANgoyvgAxgU">[عرض توضيحي] نظام ضمان الجودة المدعوم من ميلفوس</a></p>
<h4 id="How-it-works" class="common-anchor-header">كيف يعمل</h4><p>يتم تحويل الأسئلة إلى ناقلات ميزات باستخدام نموذج BERT من Google، ثم يتم استخدام Milvus لإدارة مجموعة البيانات والاستعلام عنها.</p>
<p><strong>معالجة البيانات:</strong></p>
<ol>
<li>يُستخدم نموذج BERT لتحويل أزواج الأسئلة والأجوبة التي تم تحميلها إلى متجهات ذات 768 بُعدًا. ثم يتم استيراد المتجهات إلى ميلفوس وتعيين معرفات فردية لها.</li>
<li>يتم تخزين معرفات متجهات الأسئلة والإجابة المقابلة في PostgreSQL.</li>
</ol>
<p><strong>البحث عن الأسئلة المتشابهة:</strong></p>
<ol>
<li>يتم استخدام BERT لاستخراج متجهات السمات من سؤال المستخدم.</li>
<li>يسترجع Milvus معرّفات المتجهات للأسئلة الأكثر تشابهًا مع السؤال المدخل.</li>
<li>يبحث النظام عن الإجابات المقابلة في PostgreSQL.</li>
</ol>
<p><br/></p>
<h3 id="Reverse-image-search-systems" class="common-anchor-header">أنظمة البحث العكسي عن الصور</h3><p>يعمل البحث العكسي عن الصور على تحويل التجارة الإلكترونية من خلال توصيات المنتجات الشخصية وأدوات البحث عن المنتجات المماثلة التي يمكن أن تعزز المبيعات. في سيناريو التطبيق هذا، قام زيلز ببناء نظام بحث عكسي عن الصور من خلال الجمع بين Milvus و <a href="https://towardsdatascience.com/how-to-use-a-pre-trained-model-vgg-for-image-classification-8dd7c4a4a517">VGG،</a> وهو نموذج تعلم الآلة الذي يمكنه استخراج ميزات الصورة.</p>
<p>👉رمز المصدر:<a href="https://github.com/zilliz-bootcamp/image_search">zilliz-bootcamp/image_search</a></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_09000e2e2e.jpeg" alt="2.jpeg" class="doc-image" id="2.jpeg" />
   </span> <span class="img-wrapper"> <span>2.jpeg</span> </span></p>
<h4 id="How-to-use" class="common-anchor-header">كيفية الاستخدام</h4><ol>
<li>قم بتحميل مجموعة بيانات صور مضغوطة تتألف من صور .jpg فقط (لا تُقبل أنواع ملفات الصور الأخرى). بدلاً من ذلك، تتوفر <a href="https://zilliz.com/solutions/image-search">مجموعة بيانات نموذجية</a> للتنزيل.</li>
<li>قم بتحميل صورة لاستخدامها كمدخل بحث للعثور على صور متشابهة.</li>
</ol>
<p>👉فيديو: <a href="https://www.youtube.com/watch?v=mTO8YdQObKY">[عرض توضيحي] البحث عن الصور بواسطة ميلفوس</a></p>
<h4 id="How-it-works" class="common-anchor-header">كيف يعمل</h4><p>يتم تحويل الصور إلى متجهات ميزات مكونة من 512 بُعدًا باستخدام نموذج VGG، ثم يتم استخدام Milvus لإدارة مجموعة البيانات والاستعلام عنها.</p>
<p><strong>معالجة البيانات:</strong></p>
<ol>
<li>يُستخدم نموذج VGG لتحويل مجموعة بيانات الصور التي تم تحميلها إلى متجهات ميزات. يتم بعد ذلك استيراد المتجهات إلى ملفوس وتعيين معرّفات فردية لها.</li>
<li>يتم تخزين متجهات ميزات الصور ومسارات ملفات الصور المقابلة في CacheDB.</li>
</ol>
<p><strong>البحث عن الصور المتشابهة:</strong></p>
<ol>
<li>يتم استخدام VGG لتحويل الصورة التي قام المستخدم بتحميلها إلى متجهات ميزات.</li>
<li>يتم استرداد معرّفات المتجهات للصور الأكثر تشابهًا مع الصورة المدخلة من Milvus.</li>
<li>يبحث النظام عن مسارات ملفات الصور المتشابهة في CacheDB.</li>
</ol>
<p><br/></p>
<h3 id="Audio-search-systems" class="common-anchor-header">أنظمة البحث الصوتي</h3><p>يتيح البحث عن الكلام والموسيقى والمؤثرات الصوتية وأنواع أخرى من البحث الصوتي إمكانية الاستعلام بسرعة عن كميات هائلة من البيانات الصوتية وإظهار الأصوات المتشابهة. تشمل التطبيقات تحديد المؤثرات الصوتية المتشابهة وتقليل انتهاك الملكية الفكرية وغير ذلك. لتوضيح سيناريو هذا التطبيق، قام Zilliz ببناء نظام بحث عالي الكفاءة عن التشابه الصوتي من خلال الجمع بين Milvus و <a href="https://arxiv.org/abs/1912.10211">PANNs - وهي</a>شبكات عصبية صوتية واسعة النطاق مُدربة مسبقًا ومصممة للتعرف على الأنماط الصوتية.</p>
<p>👉كود المصدر:：رمز المصدر:<a href="https://github.com/zilliz-bootcamp/audio_search">zilliz-bootcamp/audio_search</a> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_419bac3dd2.png" alt="3.png" class="doc-image" id="3.png" /><span>3.png</span> </span></p>
<h4 id="How-to-use" class="common-anchor-header">كيفية الاستخدام</h4><ol>
<li>قم بتحميل مجموعة بيانات صوتية مضغوطة تتألف من ملفات .wav فقط (لا تُقبل أنواع الملفات الصوتية الأخرى). بدلاً من ذلك، تتوفر <a href="https://zilliz.com/solutions/audio-search">مجموعة بيانات نموذجية</a> للتنزيل.</li>
<li>قم بتحميل ملف .wav لاستخدامه كمدخل بحث للعثور على صوت مشابه.</li>
</ol>
<p>👉فيديو: <a href="https://www.youtube.com/watch?v=0eQHeqriCXw">[عرض توضيحي] بحث صوتي مدعوم من ميلفوس</a></p>
<h4 id="How-it-works" class="common-anchor-header">كيف يعمل</h4><p>يتم تحويل الصوت إلى متجهات ميزات باستخدام PANNs، وهي شبكات عصبية صوتية كبيرة الحجم مدربة مسبقًا ومصممة للتعرف على أنماط الصوت. ثم يتم استخدام Milvus لإدارة مجموعة البيانات والاستعلام عنها.</p>
<p><strong>معالجة البيانات:</strong></p>
<ol>
<li>تقوم شبكات PANNs بتحويل الصوت من مجموعة البيانات التي تم تحميلها إلى متجهات ميزات. ثم يتم استيراد المتجهات إلى ميلفوس وتخصيص معرّفات فردية لها.</li>
<li>يتم تخزين معرّفات متجهات السمات الصوتية ومسارات ملفات .wav المقابلة لها في PostgreSQL.</li>
</ol>
<p><strong>البحث عن الصوت المتشابه:</strong></p>
<ol>
<li>يتم استخدام PANNs لتحويل ملف الصوت الذي قام المستخدم بتحميله إلى متجهات ميزات.</li>
<li>يتم استرداد معرّفات المتجهات للصوت الأكثر تشابهًا مع الملف الذي تم تحميله من Milvus عن طريق حساب مسافة الضرب الداخلي (IP).</li>
<li>يبحث النظام عن مسارات الملفات الصوتية المقابلة في MySQL.</li>
</ol>
<p><br/></p>
<h3 id="Video-object-detection-computer-vision" class="common-anchor-header">اكتشاف كائنات الفيديو (رؤية الكمبيوتر)</h3><p>للكشف عن كائنات الفيديو تطبيقات في رؤية الكمبيوتر واسترجاع الصور والقيادة الذاتية وغيرها. لتوضيح سيناريو هذا التطبيق، قام زيلز ببناء نظام للكشف عن كائنات الفيديو من خلال الجمع بين Milvus والتقنيات والخوارزميات بما في ذلك <a href="https://en.wikipedia.org/wiki/OpenCV">OpenCV</a> و <a href="https://towardsdatascience.com/yolo-v3-object-detection-53fb7d3bfe6b">YOLOv3</a> و <a href="https://www.mathworks.com/help/deeplearning/ref/resnet50.html">ResNet50</a>.</p>
<p>👉كود المصدر: <a href="https://github.com/zilliz-bootcamp/video_analysis">zilliz-bootcamp/فيديو_تحليل_الفيديو</a></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_54b4ceb2ad.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<h4 id="How-to-use" class="common-anchor-header">كيفية الاستخدام</h4><ol>
<li>قم بتحميل مجموعة بيانات صور مضغوطة تتألف من ملفات .jpg فقط (لا تُقبل أنواع ملفات الصور الأخرى). تأكد من تسمية كل ملف صورة حسب الكائن الذي يصوره. بدلاً من ذلك، تتوفر <a href="https://zilliz.com/solutions/video-obj-analysis">مجموعة بيانات نموذجية</a> للتنزيل.</li>
<li>قم بتحميل مقطع فيديو لاستخدامه في التحليل.</li>
<li>انقر فوق زر التشغيل لعرض الفيديو الذي تم تحميله مع عرض نتائج اكتشاف الكائن في الوقت الفعلي.</li>
</ol>
<p>👉فيديو: <a href="https://www.youtube.com/watch?v=m9rosLClByc">[عرض توضيحي] نظام كشف الأجسام بالفيديو مدعوم من ميلفوس</a></p>
<h4 id="How-it-works" class="common-anchor-header">كيف يعمل</h4><p>يتم تحويل صور الأجسام إلى ناقلات ميزات ذات 2048 بُعدًا باستخدام ResNet50. ثم يتم استخدام Milvus لإدارة مجموعة البيانات والاستعلام عنها.</p>
<p><strong>معالجة البيانات:</strong></p>
<ol>
<li>يقوم ResNet50 بتحويل صور الكائنات إلى متجهات سمات ذات 2048 بُعدًا. ثم يتم استيراد المتجهات إلى Milvus وتعيين معرّفات فردية لها.</li>
<li>يتم تخزين معرفات متجهات السمات الصوتية ومسارات ملفات الصور المقابلة لها في MySQL.</li>
</ol>
<p><strong>الكشف عن الكائنات في الفيديو:</strong></p>
<ol>
<li>يستخدم OpenCV لقص الفيديو.</li>
<li>يُستخدم YOLOv3 لاكتشاف الأجسام في الفيديو.</li>
<li>يقوم ResNet50 بتحويل صور الأجسام المكتشفة إلى متجهات ميزات ذات 2048 بُعدًا.</li>
</ol>
<p>يبحث Milvus عن صور الكائنات الأكثر تشابهًا في مجموعة البيانات التي تم تحميلها. يتم استرداد أسماء الكائنات المقابلة ومسارات ملفات الصور من MySQL.</p>
