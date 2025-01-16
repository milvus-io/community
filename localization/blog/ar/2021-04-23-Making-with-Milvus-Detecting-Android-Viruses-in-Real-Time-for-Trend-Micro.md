---
id: Making-with-Milvus-Detecting-Android-Viruses-in-Real-Time-for-Trend-Micro.md
title: العمل مع ميلفوس للكشف عن فيروسات الأندرويد في الوقت الحقيقي لصالح تريند مايكرو
author: milvus
date: 2021-04-23T06:46:13.732Z
desc: >-
  تعرف على كيفية استخدام Milvus للتخفيف من التهديدات التي تتعرض لها البيانات
  الهامة وتعزيز الأمن السيبراني من خلال الكشف عن الفيروسات في الوقت الحقيقي.
cover: assets.zilliz.com/blog_Trend_Micro_5c8ba3e2ce.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/Making-with-Milvus-Detecting-Android-Viruses-in-Real-Time-for-Trend-Micro
---
<custom-h1>صنع مع ميلفوس: الكشف عن فيروسات الأندرويد في الوقت الفعلي لصالح تريند مايكرو</custom-h1><p>لا يزال الأمن السيبراني يشكل تهديداً مستمراً لكل من الأفراد والشركات، مع تزايد مخاوف خصوصية البيانات لدى <a href="https://www.getapp.com/resources/annual-data-security-report/">86% من الشركات</a> في عام 2020، واعتقاد <a href="https://merchants.fiserv.com/content/dam/firstdata/us/en/documents/pdf/digital-commerce-cybersecurity-ebook.pdf">23%</a> فقط <a href="https://merchants.fiserv.com/content/dam/firstdata/us/en/documents/pdf/digital-commerce-cybersecurity-ebook.pdf">من المستهلكين</a> أن بياناتهم الشخصية آمنة جداً. ومع ازدياد انتشار البرمجيات الخبيثة وتعقيدها بشكل مطرد، أصبح من الضروري اتباع نهج استباقي للكشف عن التهديدات. <a href="https://www.trendmicro.com/en_us/business.html">تريند مايكرو</a> هي شركة عالمية رائدة في مجال أمن السحابة الهجينة والدفاع عن الشبكات وأمن الشركات الصغيرة وأمن نقاط النهاية. ولحماية الأجهزة التي تعمل بنظام أندرويد من الفيروسات، قامت الشركة بتصميم تريند مايكرو موبايل سيكيوريتي - وهو تطبيق للهواتف المحمولة يقارن حزم تطبيقات أندرويد (APK) من متجر جوجل بلاي بقاعدة بيانات للبرمجيات الخبيثة المعروفة. يعمل نظام الكشف عن الفيروسات على النحو التالي:</p>
<ul>
<li>يتم الزحف إلى ملفات APK الخارجية (حزمة تطبيقات أندرويد) من متجر Google Play.</li>
<li>يتم تحويل البرامج الضارة المعروفة إلى ناقلات وتخزينها في <a href="https://www.milvus.io/docs/v1.0.0/overview.md">Milvus</a>.</li>
<li>كما يتم تحويل ملفات APK الجديدة إلى نواقل، ثم مقارنتها بقاعدة بيانات البرمجيات الخبيثة باستخدام البحث عن التشابه.</li>
<li>إذا كان ناقل APK مشابهًا لأي من نواقل البرمجيات الخبيثة، يزود التطبيق المستخدمين بمعلومات مفصلة عن الفيروس ومستوى تهديده.</li>
</ul>
<p>ولكي يعمل النظام، يجب أن يقوم النظام بإجراء بحث تشابه عالي الكفاءة على مجموعات بيانات ضخمة من المتجهات في الوقت الفعلي. في البداية، استخدم تريند <a href="https://www.mysql.com/">مايكرو MySQL</a>. ومع ذلك، مع توسع أعمالها، ازداد عدد ملفات APK التي تحتوي على شيفرة شائنة مخزنة في قاعدة بياناتها. بدأ فريق خوارزمية الشركة في البحث عن حلول بديلة للبحث عن التشابه المتجهي بعد أن تجاوز بسرعة MySQL.</p>
<p><br/></p>
<h3 id="Comparing-vector-similarity-search-solutions" class="common-anchor-header">مقارنة حلول البحث عن التشابه المتجهي</h3><p>هناك عدد من حلول البحث عن تشابه المتجهات المتاحة، والعديد منها مفتوح المصدر. على الرغم من أن الظروف تختلف من مشروع لآخر، إلا أن معظم المستخدمين يستفيدون من الاستفادة من قاعدة بيانات متجهات مصممة لمعالجة البيانات غير المنظمة وتحليلها بدلاً من مكتبة بسيطة تتطلب تكوينًا واسع النطاق. نقارن أدناه بعض حلول البحث عن تشابه المتجهات الشائعة ونوضح سبب اختيار Trend Micro لـ Milvus.</p>
<h4 id="Faiss" class="common-anchor-header">فايس</h4><p><a href="https://ai.facebook.com/tools/faiss/">Faiss</a> هي مكتبة تم تطويرها بواسطة Facebook AI Research تتيح البحث الفعال عن التشابه وتجميع المتجهات الكثيفة بكفاءة. تحتوي الخوارزميات التي تحتويها على متجهات بحث من أي حجم في مجموعات. كُتبت Faiss بلغة C++ مع أغلفة لـ Python/numpy، وتدعم عددًا من الفهارس بما في ذلك IndexFlatL2 و IndexFlatIP و HNSW و IVF.</p>
<p>على الرغم من أن Faiss أداة مفيدة بشكل لا يصدق، إلا أن لها قيودًا. فهي تعمل فقط كمكتبة خوارزمية أساسية، وليست قاعدة بيانات لإدارة مجموعات البيانات المتجهة. بالإضافة إلى ذلك، فهي لا تقدم إصدارًا موزعًا أو خدمات مراقبة أو حزم تطوير البرمجيات أو التوافر العالي، وهي الميزات الرئيسية لمعظم الخدمات المستندة إلى السحابة.</p>
<h4 id="Plug-ins-based-on-Faiss--other-ANN-search-libraries" class="common-anchor-header">المكونات الإضافية القائمة على Faiss ومكتبات بحث ANN الأخرى</h4><p>هناك العديد من المكونات الإضافية المبنية على Faiss و NMSLIB ومكتبات بحث ANN الأخرى المصممة لتعزيز الوظائف الأساسية للأداة الأساسية التي تشغلها. Elasticsearch (ES) هو محرك بحث يعتمد على مكتبة لوسين مع عدد من هذه المكونات الإضافية. فيما يلي مخطط معماري لمكونات ES الإضافية:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_3ce4e516c3.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>يعد الدعم المدمج للأنظمة الموزعة ميزة رئيسية لحل ES. وهذا يوفر وقت المطورين وأموال الشركات بفضل التعليمات البرمجية التي لا يلزم كتابتها. المكونات الإضافية لـ ES متقدمة تقنيًا ومنتشرة. يوفر Elasticsearch لغة QueryDSL (لغة خاصة بالمجال)، والتي تحدد الاستعلامات بناءً على JSON ويسهل فهمها. تتيح مجموعة كاملة من خدمات ES إمكانية إجراء بحث متجه/ نصي وتصفية البيانات القياسية في وقت واحد.</p>
<p>أمازون، وعلي بابا، ونيتيس هي عدد قليل من شركات التكنولوجيا الكبيرة التي تعتمد حاليًا على المكونات الإضافية لـ Elasticsearch للبحث عن التشابه المتجه. تتمثل الجوانب السلبية الأساسية لهذا الحل في ارتفاع استهلاك الذاكرة وعدم وجود دعم لضبط الأداء. في المقابل، طوّر <a href="http://jd.com/">موقع JD.com</a> حلاً موزعاً خاصاً به يعتمد على Faiss يسمى <a href="https://github.com/vearch/vearch">Vaearch</a>. ومع ذلك، لا يزال Vearch مشروعًا في مرحلة الحضانة ومجتمعه مفتوح المصدر غير نشط نسبيًا.</p>
<h4 id="Milvus" class="common-anchor-header">ميلفوس</h4><p><a href="https://www.milvus.io/">Milvus</a> هي قاعدة بيانات متجهة مفتوحة المصدر أنشأتها <a href="https://zilliz.com">شركة Zilliz</a>. وهي مرنة للغاية وموثوقة وسريعة للغاية. من خلال تغليف العديد من مكتبات الفهارس المعتمدة على نطاق واسع، مثل Faiss وNMSLIB وAnnoy، يوفر Milvus مجموعة شاملة من واجهات برمجة التطبيقات البديهية، مما يسمح للمطورين باختيار نوع الفهرس المثالي لسيناريو عملهم. كما يوفر حلولاً موزعة وخدمات مراقبة. تمتلك Milvus مجتمعاً مفتوح المصدر نشطاً للغاية وأكثر من 5.5 ألف نجمة على <a href="https://github.com/milvus-io/milvus">Github</a>.</p>
<h4 id="Milvus-bests-the-competition" class="common-anchor-header">يتفوق ميلفوس على منافسيه</h4><p>قمنا بتجميع عدد من نتائج الاختبارات المختلفة من مختلف حلول البحث عن التشابه المتجه المذكورة أعلاه. وكما نرى في جدول المقارنة التالي، كان Milvus أسرع بكثير من المنافسين على الرغم من اختباره على مجموعة بيانات مكونة من مليار متجه ذي 128 بُعدًا.</p>
<table>
<thead>
<tr><th style="text-align:left"><strong>المحرك</strong></th><th style="text-align:left"><strong>الأداء (مللي ثانية)</strong></th><th style="text-align:left"><strong>حجم مجموعة البيانات (مليون)</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:left">ES</td><td style="text-align:left">600</td><td style="text-align:left">1</td></tr>
<tr><td style="text-align:left">ES + سحابة علي بابا</td><td style="text-align:left">900</td><td style="text-align:left">20</td></tr>
<tr><td style="text-align:left">ميلفوس</td><td style="text-align:left">27</td><td style="text-align:left">1000+</td></tr>
<tr><td style="text-align:left">SPTAG</td><td style="text-align:left">غير جيد</td><td style="text-align:left"></td></tr>
<tr><td style="text-align:left">ES + nmslib، فايس</td><td style="text-align:left">90</td><td style="text-align:left">150</td></tr>
</tbody>
</table>
<h6 id="A-comparison-of-vector-similarity-search-solutions" class="common-anchor-header"><em>مقارنة بين حلول البحث عن تشابه المتجهات.</em></h6><p>بعد الموازنة بين إيجابيات وسلبيات كل حل، استقرت Trend Micro على Milvus لنموذج استرجاع المتجهات. وبفضل الأداء الاستثنائي على مجموعات البيانات الضخمة ذات الحجم الملياري، من الواضح لماذا اختارت الشركة Milvus لخدمة أمن الأجهزة المحمولة التي تتطلب البحث عن تشابه المتجهات في الوقت الفعلي.</p>
<p><br/></p>
<h3 id="Designing-a-system-for-real-time-virus-detection" class="common-anchor-header">تصميم نظام للكشف عن الفيروسات في الوقت الحقيقي</h3><p>لدى Trend Micro أكثر من 10 ملايين ملف APK خبيث مخزّن في قاعدة بيانات MySQL الخاصة بها، مع إضافة 100 ألف ملف APK جديد كل يوم. يعمل النظام من خلال استخراج وحساب قيم Thash لمكونات مختلفة من ملف APK، ثم يستخدم خوارزمية Sha256 لتحويلها إلى ملفات ثنائية وتوليد قيم Sha256 بت 256 التي تميز ملف APK عن غيره. نظرًا لأن قيم Sha256 تختلف باختلاف ملفات APK، يمكن أن يكون لملف APK واحد قيمة Thash مجمعة واحدة وقيمة Sha256 فريدة واحدة.</p>
<p>تُستخدم قيم Sha256 فقط للتمييز بين ملفات APK، وتُستخدم قيم Thash لاسترجاع تشابه المتجهات. قد يكون لملفات APK المتشابهة نفس قيم Thash ولكن قيم Sha256 مختلفة.</p>
<p>وللكشف عن ملفات APK ذات التعليمات البرمجية الشائنة طوّرت شركة Trend Micro نظامها الخاص لاسترجاع قيم Thash المتشابهة وقيم Sha256 المقابلة لها. اختارت Trend Micro نظام Milvus لإجراء بحث فوري عن تشابه المتجهات على مجموعات بيانات المتجهات الضخمة المحولة من قيم Thash. بعد تشغيل بحث التشابه، يتم الاستعلام عن قيم Sha256 المقابلة في MySQL. تتم أيضًا إضافة طبقة تخزين Redis للتخزين المؤقت إلى البنية لتعيين قيم Thash إلى قيم Sha256، مما يقلل بشكل كبير من وقت الاستعلام.</p>
<p>فيما يلي مخطط بنية نظام تريند مايكرو لأمن الأجهزة المحمولة.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_20210118_022039_ae824b663c.png" alt="image-20210118-022039.png" class="doc-image" id="image-20210118-022039.png" />
   </span> <span class="img-wrapper"> <span>image-20210118-022039.png</span> </span></p>
<p><br/></p>
<p>يساعد اختيار مقياس المسافة المناسب في تحسين أداء تصنيف المتجهات وتجميعها. يوضح الجدول التالي مقاييس <a href="https://www.milvus.io/docs/v1.0.0/metric.md#binary">المسافة</a> والفهارس المقابلة التي تعمل مع المتجهات الثنائية.</p>
<table>
<thead>
<tr><th><strong>مقاييس المسافة</strong></th><th><strong>أنواع الفهرس</strong></th></tr>
</thead>
<tbody>
<tr><td>- جاكارد <br/> - تانيموتو <br/> - هامينج</td><td>- مسطحة <br/> - ivf_flat</td></tr>
<tr><td>- البنية الفوقية <br/> - البنية التحتية - البنية التحتية</td><td>مسطحة</td></tr>
</tbody>
</table>
<h6 id="Distance-metrics-and-indexes-for-binary-vectors" class="common-anchor-header"><em>مقاييس المسافة والفهارس للمتجهات الثنائية.</em></h6><p><br/></p>
<p>يحول Trend Micro قيم Thash إلى متجهات ثنائية ويخزنها في Milvus. بالنسبة لهذا السيناريو، يستخدم Trend Micro مسافة هامينج لمقارنة المتجهات.</p>
<p>وسيدعم Milvus قريبًا معرّف متجه السلسلة، ولن يتعين تعيين معرّفات الأعداد الصحيحة إلى الاسم المقابل بتنسيق السلسلة. وهذا يجعل طبقة Redis للتخزين المؤقت غير ضرورية ويجعل بنية النظام أقل ضخامة.</p>
<p>يعتمد Trend Micro حلاً قائماً على السحابة وينشر العديد من المهام على <a href="https://kubernetes.io/">Kubernetes</a>. ولتحقيق التوافرية العالية، تستخدم تريند مايكرو برنامج <a href="https://www.milvus.io/docs/v1.0.0/mishards.md">Mishards،</a> وهو برنامج وسيط لتجزئة مجموعة ميلفوس تم تطويره بلغة بايثون.</p>
<p>![image-20210118-022104.png](https://assets.zilliz.com/image_20210118_022104_3001950ee8.png &quot;Mishards architecture in Milvus.)</p>
<p><br/></p>
<p>تفصل Trend Micro بين التخزين وحساب المسافة من خلال تخزين جميع المتجهات في <a href="https://aws.amazon.com/efs/">EFS</a> (نظام الملفات المرن) الذي توفره <a href="https://aws.amazon.com/">AWS</a>. هذه الممارسة هي اتجاه شائع في الصناعة. يتم استخدام Kubernetes لبدء تشغيل عقد قراءة متعددة، وتطوير خدمات LoadBalancer على عقد القراءة هذه لضمان التوافر العالي.</p>
<p>للحفاظ على اتساق البيانات يدعم ميشاردز عقدة كتابة واحدة فقط. ومع ذلك، ستتوفر نسخة موزعة من ميلفوس مع دعم عقد كتابة متعددة في الأشهر القادمة.</p>
<p><br/></p>
<h3 id="Monitoring-and-Alert-Functions" class="common-anchor-header">وظائف المراقبة والتنبيه</h3><p>يتوافق Milvus مع أنظمة المراقبة المبنية على <a href="https://prometheus.io/">Prometheus،</a> ويستخدم <a href="https://grafana.com/">Grafana،</a> وهي منصة مفتوحة المصدر لتحليلات السلاسل الزمنية، لتصور مقاييس الأداء المختلفة.</p>
<p>يراقب Prometheus المقاييس التالية ويخزنها:</p>
<ul>
<li>مقاييس أداء ميلفوس بما في ذلك سرعة الإدراج وسرعة الاستعلام ووقت تشغيل ميلفوس.</li>
<li>مقاييس أداء النظام بما في ذلك استخدام وحدة المعالجة المركزية/وحدة معالجة الرسومات وحركة مرور الشبكة وسرعة الوصول إلى القرص.</li>
<li>مقاييس تخزين الأجهزة بما في ذلك حجم البيانات وإجمالي عدد الملفات.</li>
</ul>
<p>يعمل نظام المراقبة والتنبيه على النحو التالي:</p>
<ul>
<li>يقوم عميل Milvus بدفع بيانات المقاييس المخصصة إلى Pushgateway.</li>
<li>يضمن Pushgateway إرسال بيانات المقاييس قصيرة الأجل وسريعة الزوال بأمان إلى Prometheus.</li>
<li>يستمر Prometheus في سحب البيانات من Pushgateway.</li>
<li>يقوم مدير التنبيه بتعيين عتبة التنبيه للمقاييس المختلفة ويطلق الإنذارات من خلال رسائل البريد الإلكتروني أو الرسائل.</li>
</ul>
<p><br/></p>
<h3 id="System-Performance" class="common-anchor-header">أداء النظام</h3><p>مرّ شهران منذ إطلاق خدمة ThashSearch المبنية على Milvus لأول مرة. يوضّح الرسم البياني أدناه أن زمن انتقال الاستعلام من طرف إلى طرف أقل من 95 ميلي ثانية.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_20210118_022116_a0c735ce20.png" alt="image-20210118-022116.png" class="doc-image" id="image-20210118-022116.png" />
   </span> <span class="img-wrapper"> <span>image-20210118-022116.png</span> </span></p>
<p><br/></p>
<p>الإدراج سريع أيضاً. يستغرق الأمر حوالي 10 ثوانٍ لإدراج 3 ملايين متجه 192 بُعدًا. بمساعدة من Milvus، تمكن أداء النظام من تلبية معايير الأداء التي حددتها Trend Micro.</p>
<p><br/></p>
<h3 id="Don’t-be-a-stranger" class="common-anchor-header">لا تكن غريباً</h3><ul>
<li>ابحث أو ساهم في Milvus على <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>تفاعل مع المجتمع عبر <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>تواصل معنا على <a href="https://twitter.com/milvusio">تويتر</a>.</li>
</ul>
