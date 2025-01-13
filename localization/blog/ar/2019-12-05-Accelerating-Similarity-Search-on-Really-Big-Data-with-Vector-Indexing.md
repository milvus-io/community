---
id: Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing.md
title: تسريع البحث عن التشابه في البيانات الضخمة حقًا باستخدام فهرسة المتجهات
author: milvus
date: 2019-12-05T08:33:04.230Z
desc: >-
  بدون فهرسة المتجهات، ستكون العديد من التطبيقات الحديثة للذكاء الاصطناعي بطيئة
  بشكل مستحيل. تعرف على كيفية اختيار الفهرس المناسب لتطبيق التعلم الآلي التالي.
cover: assets.zilliz.com/4_1143e443aa.jpg
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing
---
<custom-h1>تسريع البحث عن التشابه على البيانات الضخمة حقًا باستخدام فهرسة المتجهات</custom-h1><p>من الرؤية الحاسوبية إلى اكتشاف الأدوية الجديدة، تعمل محركات البحث عن التشابه المتجهي على تشغيل العديد من تطبيقات الذكاء الاصطناعي الشائعة. إن أحد المكونات الضخمة التي تجعل من الممكن الاستعلام بكفاءة عن مجموعات البيانات التي تبلغ مليون أو مليار أو حتى تريليون متجه التي تعتمد عليها محركات البحث عن التشابه هو الفهرسة، وهي عملية تنظيم البيانات التي تسرّع البحث في البيانات الضخمة بشكل كبير. يغطي هذا المقال الدور الذي تلعبه الفهرسة في جعل البحث عن التشابه المتجه فعالاً، وأنواع الفهرسة المختلفة للملفات المقلوبة المتجهة (IVF)، ونصائح حول الفهرس الذي يجب استخدامه في سيناريوهات مختلفة.</p>
<p><strong>الانتقال إلى:</strong></p>
<ul>
<li><a href="#accelerating-similarity-search-on-really-big-data-with-vector-indexing">تسريع البحث عن التشابه في البيانات الضخمة حقًا باستخدام الفهرسة المتجهة</a><ul>
<li><a href="#how-does-vector-indexing-accelerate-similarity-search-and-machine-learning">كيف تعمل فهرسة المتجهات على تسريع البحث عن التشابه والتعلم الآلي؟</a></li>
<li><a href="#what-are-different-types-of-ivf-indexes-and-which-scenarios-are-they-best-suited-for">ما هي الأنواع المختلفة من فهارس الفهرسة المتجهة وما هي السيناريوهات الأنسب لها؟</a></li>
<li><a href="#flat-good-for-searching-relatively-small-million-scale-datasets-when-100-recall-is-required">الفهرسة المسطحة: جيد للبحث في مجموعات البيانات الصغيرة نسبيًا (بمقياس مليون) عندما يكون الاستدعاء بنسبة 100%.</a><ul>
<li><a href="#flat-performance-test-results">نتائج اختبار أداء FLAT:</a><ul>
<li><a href="#query-time-test-results-for-the-flat-index-in-milvus"><em>نتائج اختبار وقت الاستعلام لفهرس FLAT في Milvus.</em></a></li>
</ul></li>
<li><a href="#key-takeaways">النتائج الرئيسية:</a></li>
</ul></li>
<li><a href="#ivf_flat-improves-speed-at-the-expense-of-accuracy-and-vice-versa">IVF_FLAT: يحسن السرعة على حساب الدقة (والعكس صحيح).</a><ul>
<li><a href="#ivf_flat-performance-test-results">نتائج اختبار أداء IVF_FLAT:</a><ul>
<li><a href="#query-time-test-results-for-ivf_flat-index-in-milvus"><em>نتائج اختبار وقت الاستعلام لمؤشر IVF_FLAT في Milvus.</em></a></li>
</ul></li>
<li><a href="#key-takeaways-1">النتائج الرئيسية:</a><ul>
<li><a href="#recall-rate-test-results-for-the-ivf_flat-index-in-milvus"><em>نتائج اختبار معدل الاسترجاع لمؤشر IVF_FLAT في Milvus.</em></a></li>
</ul></li>
<li><a href="#key-takeaways-2">النتائج الرئيسية:</a></li>
</ul></li>
<li><a href="#ivf_sq8-faster-and-less-resource-hungry-than-ivf_flat-but-also-less-accurate">IVF_SQ8: أسرع وأقل استهلاكًا للموارد من IVF_FFLAT، ولكنه أيضًا أقل دقة.</a><ul>
<li><a href="#ivf_sq8-performance-test-results">نتائج اختبار أداء IVF_SQ8:</a><ul>
<li><a href="#query-time-test-results-for-ivf_sq8-index-in-milvus"><em>نتائج اختبار وقت الاستعلام لفهرس IVF_SQ8 في Milvus.</em></a></li>
</ul></li>
<li><a href="#key-takeaways-3">النتائج الرئيسية:</a><ul>
<li><a href="#recall-rate-test-results-for-ivf_sq8-index-in-milvus"><em>نتائج اختبار معدل الاسترجاع لمؤشر IVF_SQ8 في Milvus.</em></a></li>
</ul></li>
<li><a href="#key-takeaways-4">النتائج الرئيسية:</a></li>
</ul></li>
<li><a href="#ivf_sq8h-new-hybrid-gpucpu-approach-that-is-even-faster-than-ivf_sq8">IVF_SQ8H: نهج هجين جديد لوحدة معالجة الرسومات/وحدة المعالجة المركزية أسرع من IVF_SQ8.</a><ul>
<li><a href="#ivf_sq8h-performance-test-results">نتائج اختبار أداء IVF_SQ8H:</a><ul>
<li><a href="#query-time-test-results-for-ivf_sq8h-index-in-milvus"><em>نتائج اختبار وقت الاستعلام لفهرس IVF_SQ8H في Milvus.</em></a></li>
</ul></li>
<li><a href="#key-takeaways-5">الوجبات الرئيسية:</a></li>
</ul></li>
<li><a href="#learn-more-about-milvus-a-massive-scale-vector-data-management-platform">تعرف على المزيد حول Milvus، منصة إدارة البيانات المتجهة واسعة النطاق.</a></li>
<li><a href="#methodology">المنهجية</a><ul>
<li><a href="#performance-testing-environment">بيئة اختبار الأداء</a></li>
<li><a href="#relevant-technical-concepts">المفاهيم التقنية ذات الصلة</a></li>
<li><a href="#resources">الموارد</a></li>
</ul></li>
</ul></li>
</ul>
<h3 id="How-does-vector-indexing-accelerate-similarity-search-and-machine-learning" class="common-anchor-header">كيف تعمل فهرسة المتجهات على تسريع البحث عن التشابه والتعلم الآلي؟</h3><p>تعمل محركات البحث عن التشابه من خلال مقارنة المدخلات بقاعدة بيانات للعثور على العناصر الأكثر تشابهًا مع المدخلات. الفهرسة هي عملية تنظيم البيانات بكفاءة، وتلعب دورًا رئيسيًا في جعل البحث عن التشابه مفيدًا من خلال تسريع الاستعلامات التي تستغرق وقتًا طويلاً على مجموعات البيانات الكبيرة بشكل كبير. بعد فهرسة مجموعة بيانات متجهة ضخمة، يمكن توجيه الاستعلامات إلى مجموعات أو مجموعات فرعية من البيانات التي من المرجح أن تحتوي على متجهات مشابهة لاستعلام الإدخال. من الناحية العملية، يعني هذا عمليًا التضحية بدرجة معينة من الدقة لتسريع الاستعلامات على البيانات المتجهة الضخمة حقًا.</p>
<p>يمكن تشبيه ذلك بقاموس، حيث يتم فرز الكلمات أبجديًا. عند البحث عن كلمة ما، من الممكن الانتقال بسرعة إلى قسم يحتوي فقط على كلمات تحمل نفس الحرف الأول من الكلمة - مما يسرّع بشكل كبير من عملية البحث عن تعريف الكلمة المدخلة.</p>
<h3 id="What-are-different-types-of-IVF-indexes-and-which-scenarios-are-they-best-suited-for" class="common-anchor-header">ما هي الأنواع المختلفة من فهارس IVF وما هي السيناريوهات الأنسب لها؟</h3><p>هناك العديد من الفهارس المصممة للبحث عن التشابه المتجهي عالي الأبعاد، ولكل منها مقايضات في الأداء والدقة ومتطلبات التخزين. تغطي هذه المقالة العديد من أنواع فهارس الفهرس المتجهية الشائعة ونقاط قوتها وضعفها، بالإضافة إلى نتائج اختبار الأداء لكل نوع من الفهارس. يقيس اختبار الأداء وقت الاستعلام ومعدلات الاستدعاء لكل نوع من أنواع الفهارس في <a href="https://milvus.io/">Milvus،</a> وهي منصة مفتوحة المصدر لإدارة البيانات المتجهة. للحصول على معلومات إضافية حول بيئة الاختبار، راجع قسم المنهجية في أسفل هذه المقالة.</p>
<h3 id="FLAT-Good-for-searching-relatively-small-million-scale-datasets-when-100-recall-is-required" class="common-anchor-header">مسطح: جيد للبحث في مجموعات البيانات الصغيرة نسبيًا (بمقياس مليون) عندما يكون الاستدعاء مطلوبًا بنسبة 100%.</h3><p>بالنسبة لتطبيقات البحث عن تشابه المتجهات التي تتطلب دقة مثالية وتعتمد على مجموعات بيانات صغيرة نسبيًا (بمقياس مليون)، يعد فهرس FLAT خيارًا جيدًا. لا يقوم FLAT بضغط المتجهات، وهو الفهرس الوحيد الذي يمكن أن يضمن نتائج بحث دقيقة. يمكن أيضًا استخدام النتائج من FLAT كنقطة مقارنة للنتائج التي تنتجها الفهارس الأخرى التي لديها أقل من 100% من الاستدعاء.</p>
<p>يتميز FLAT بالدقة لأنه يتبع نهجًا شاملًا في البحث، مما يعني أنه لكل استعلام تتم مقارنة المدخلات المستهدفة بكل متجه في مجموعة البيانات. هذا يجعل من FLAT أبطأ فهرس في قائمتنا، وهو غير مناسب للاستعلام عن بيانات المتجهات الضخمة. لا توجد معلمات لفهرس FLAT في Milvus، ولا يتطلب استخدامه تدريبًا على البيانات أو تخزينًا إضافيًا.</p>
<h4 id="FLAT-performance-test-results" class="common-anchor-header">نتائج اختبار أداء FLAT:</h4><p>تم إجراء اختبار أداء وقت استعلام FLAT في Milvus باستخدام مجموعة بيانات مكونة من مليوني متجه ذي 128 بُعدًا.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_2_f34fb95d65.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_2.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_2.png" />
   </span> <span class="img-wrapper"> <span>مدونة_تسريع البحث عن التشابه على البيانات الضخمة حقًا باستخدام فهرسة المتجهات_2.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">الوجبات الرئيسية</h4><ul>
<li>مع زيادة nq (عدد المتجهات المستهدفة للاستعلام)، يزداد وقت الاستعلام.</li>
<li>باستخدام فهرس FLAT في Milvus، يمكننا أن نرى أن وقت الاستعلام يرتفع بشكل حاد بمجرد أن يتجاوز nq 200.</li>
<li>بشكل عام، يكون فهرس FLAT أسرع وأكثر اتساقًا عند تشغيل Milvus على وحدة معالجة الرسومات مقابل وحدة المعالجة المركزية. ومع ذلك، تكون استعلامات FLAT على وحدة المعالجة المركزية أسرع عندما يكون nq أقل من 20.</li>
</ul>
<h3 id="IVFFLAT-Improves-speed-at-the-expense-of-accuracy-and-vice-versa" class="common-anchor-header">IVF_FLAT: يحسن السرعة على حساب الدقة (والعكس صحيح).</h3><p>تتمثل إحدى الطرق الشائعة لتسريع عملية البحث عن التشابه على حساب الدقة في إجراء بحث تقريبي لأقرب جار (ANN). تقلل خوارزميات ANN من متطلبات التخزين والحمل الحسابي من خلال تجميع المتجهات المتشابهة معًا، مما يؤدي إلى بحث أسرع عن المتجهات. IVF_FLAT هو نوع فهرس الملفات المقلوب الأساسي ويعتمد على شكل من أشكال بحث ANN.</p>
<p>يقسم IVF_FLAT بيانات المتجهات إلى عدد من الوحدات العنقودية (nlist)، ثم يقارن المسافات بين متجه الإدخال المستهدف ومركز كل مجموعة. اعتمادًا على عدد المجموعات التي تم تعيين النظام للاستعلام عنها (nprobe)، يتم إرجاع نتائج بحث التشابه بناءً على المقارنات بين المدخلات المستهدفة والمتجهات في المجموعة (المجموعات) الأكثر تشابهًا فقط - مما يقلل بشكل كبير من وقت الاستعلام.</p>
<p>من خلال ضبط nprobe، يمكن إيجاد توازن مثالي بين الدقة والسرعة لسيناريو معين. تُظهر نتائج اختبار أداء IVF_FLAT الخاص بنا أن وقت الاستعلام يزداد بشكل حاد مع زيادة عدد متجهات المدخلات المستهدفة (nq) وعدد المجموعات المطلوب البحث عنها (nprobe). لا يقوم IVF_FLAT بضغط بيانات المتجهات، ومع ذلك، تتضمن ملفات الفهرس بيانات وصفية تزيد بشكل هامشي من متطلبات التخزين مقارنةً بمجموعة بيانات المتجهات الخام غير المفهرسة.</p>
<h4 id="IVFFLAT-performance-test-results" class="common-anchor-header">نتائج اختبار أداء IVF_FLAT:</h4><p>تم إجراء اختبار أداء وقت الاستعلام IVF_FLAT في Milvus باستخدام مجموعة بيانات SIFT العامة 1B SIFT، والتي تحتوي على مليار متجه ذي 128 بُعدًا.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_3_92055190d7.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_3.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_3.png" />
   </span> <span class="img-wrapper"> <span>مدونة_تسريع البحث عن التشابه على البيانات الضخمة حقاً باستخدام فهرسة المتجهات_3.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">الوجبات الرئيسية</h4><ul>
<li>عند التشغيل على وحدة المعالجة المركزية، يزداد وقت الاستعلام عن فهرس IVF_FLAT في Milvus مع كل من nprobe و nq. هذا يعني أنه كلما زاد عدد متجهات الإدخال التي يحتويها الاستعلام، أو كلما زاد عدد المجموعات التي يبحث فيها الاستعلام، كلما زاد وقت الاستعلام.</li>
<li>على GPU، يُظهر الفهرس تباينًا أقل في الوقت مقابل التغييرات في nq و nprobe. ويرجع ذلك إلى أن بيانات الفهرس كبيرة، كما أن نسخ البيانات من ذاكرة وحدة المعالجة المركزية إلى ذاكرة وحدة معالجة الرسومات يمثل معظم إجمالي وقت الاستعلام.</li>
<li>في جميع السيناريوهات، باستثناء عندما يكون nq = 1,000 و nprobe = 32، يكون فهرس IVF_FLAT أكثر كفاءة عند تشغيله على وحدة المعالجة المركزية.</li>
</ul>
<p>تم إجراء اختبار أداء استرجاع IVF_FLAT في Milvus باستخدام كل من مجموعة بيانات SIFT العامة 1M SIFT، والتي تحتوي على مليون متجه 128 بُعدًا، ومجموعة بيانات glove-200-angular-ular، والتي تحتوي على أكثر من مليون متجه 200 بُعد، لبناء الفهرس (nq = 16,384).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_4_8c8a6b628e.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_4.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_4.png" />
   </span> <span class="img-wrapper"> <span>مدونة_تسريع البحث عن التشابه في البيانات الضخمة حقًا باستخدام فهرسة المتجهات_4.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">الوجبات الرئيسية:</h4><ul>
<li>يمكن تحسين فهرس IVF_FLAT من أجل الدقة، وتحقيق معدل استرجاع أعلى من 0.99 على مجموعة بيانات SIFT 1M SIFT عندما يكون nprobe = 256.</li>
</ul>
<h3 id="IVFSQ8-Faster-and-less-resource-hungry-than-IVFFLAT-but-also-less-accurate" class="common-anchor-header">IVF_SQ8: أسرع وأقل استهلاكًا للموارد من IVF_FLAT، ولكنه أيضًا أقل دقة.</h3><p>لا يقوم IVF_SQLAT بإجراء أي ضغط، لذا فإن ملفات الفهرس التي ينتجها تكون بنفس حجم بيانات المتجه الأصلية غير المفهرسة تقريبًا. على سبيل المثال، إذا كان حجم مجموعة بيانات SIFT 1B الأصلية 476 جيجابايت، فإن ملفات فهرس IVF_FLAT الخاصة بها ستكون أكبر قليلاً (حوالي 470 جيجابايت). سيؤدي تحميل جميع ملفات الفهرس في الذاكرة إلى استهلاك 470 جيجابايت من مساحة التخزين.</p>
<p>عندما تكون موارد ذاكرة القرص أو وحدة المعالجة المركزية أو وحدة معالجة الرسومات محدودة، فإن IVF_SQ8 هو خيار أفضل من IVF_FLAT. يمكن لهذا النوع من الفهرس تحويل كل FLOAT (4 بايت) إلى UINT8 (1 بايت) عن طريق إجراء تكميم قياسي. يقلل هذا من استهلاك القرص ووحدة المعالجة المركزية وذاكرة وحدة معالجة الرسومات بنسبة 70-75%. بالنسبة لمجموعة بيانات SIFT 1B، تتطلب ملفات فهرس IVF_SQ8 مساحة تخزين 140 جيجابايت فقط.</p>
<h4 id="IVFSQ8-performance-test-results" class="common-anchor-header">نتائج اختبار أداء IVF_SQ8:</h4><p>تم إجراء اختبار وقت الاستعلام IVF_SQ8 في Milvus باستخدام مجموعة بيانات 1B SIFT العامة، والتي تحتوي على مليار متجه 128 بُعدًا، لبناء الفهرس.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_5_467fafbec4.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_5.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_5.png" />
   </span> <span class="img-wrapper"> <span>مدونة_تسريع البحث عن التشابه على البيانات الضخمة حقًا باستخدام فهرسة المتجهات_5.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">الوجبات الرئيسية</h4><ul>
<li>من خلال تقليل حجم ملف الفهرس، يوفر IVF_SQ8 تحسينات ملحوظة في الأداء مقارنةً ب IVF_SQL8. يتبع IVF_SQ8 منحنى أداء مماثل لمنحنى أداء IVF_FLAT، مع زيادة وقت الاستعلام مع nq و nprobe.</li>
<li>على غرار IVF_SQ8، يشهد IVF_SQ8 أداءً أسرع عند التشغيل على وحدة المعالجة المركزية وعندما يكون nq و nprobe أصغر.</li>
</ul>
<p>تم إجراء اختبار أداء الاستدعاء IVF_SQ8 في Milvus باستخدام كلٍ من مجموعة بيانات SIFT العامة 1M SIFT، والتي تحتوي على مليون متجه ذي 128 بُعد، ومجموعة بيانات glove-200-angular، والتي تحتوي على أكثر من مليون متجه ذي 200 بُعد، لبناء الفهرس (nlist = 16,384).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_6_b1e0e5b6a5.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_6.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_6.png" />
   </span> <span class="img-wrapper"> <span>مدونة_تسريع البحث عن التشابه على البيانات الضخمة حقًا باستخدام فهرسة المتجهات_6.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">الوجبات الرئيسية:</h4><ul>
<li>على الرغم من ضغط البيانات الأصلية، لا يشهد IVF_SQ8 انخفاضًا كبيرًا في دقة الاستعلام. عبر إعدادات nprobe المختلفة، فإن IVF_SQ8 لديه معدل استرجاع أقل بنسبة 1% على الأكثر من IVF_FLAT.</li>
</ul>
<h3 id="IVFSQ8H-New-hybrid-GPUCPU-approach-that-is-even-faster-than-IVFSQ8" class="common-anchor-header">IVF_SQ8H: نهج هجين جديد لوحدة معالجة الرسومات/وحدة المعالجة المركزية أسرع من IVF_SQ8.</h3><p>IVF_SQ8H هو نوع فهرس جديد يعمل على تحسين أداء الاستعلام مقارنةً ب IVF_SQ8. عندما يتم الاستعلام عن فهرس IVF_SQ8 الذي يعمل على وحدة المعالجة المركزية، يتم قضاء معظم الوقت الإجمالي للاستعلام في العثور على مجموعات nprobe الأقرب إلى متجه الإدخال المستهدف. ولتقليل وقت الاستعلام، يقوم IVF_SQ8 بنسخ البيانات الخاصة بعمليات التكميم الخشنة، والتي تكون أصغر من ملفات الفهرس، إلى ذاكرة وحدة معالجة الرسومات، مما يسرع بشكل كبير من عمليات التكميم الخشنة. ثم يحدد gpu_search_threshold_threshold الجهاز الذي يقوم بتشغيل الاستعلام. عندما تكون nq &gt;= gpu_search_threshold، تقوم وحدة معالجة الرسومات بتشغيل الاستعلام؛ وإلا فإن وحدة المعالجة المركزية تقوم بتشغيل الاستعلام.</p>
<p>IVF_SQ8H هو نوع فهرس هجين يتطلب أن تعمل وحدة المعالجة المركزية ووحدة معالجة الرسومات معًا. لا يمكن استخدامه إلا مع Milvus الممكّن لوحدة معالجة الرسومات.</p>
<h4 id="IVFSQ8H-performance-test-results" class="common-anchor-header">نتائج اختبار أداء IVF_SQ8H:</h4><p>تم إجراء اختبار أداء وقت الاستعلام IVF_SQ8H في Milvus باستخدام مجموعة بيانات SIFT العامة 1B SIFT، والتي تحتوي على مليار متجه 128 بُعدًا، لبناء الفهرس.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_7_b70bfe8bce.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_7.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_7.png" />
   </span> <span class="img-wrapper"> <span>مدونة_تسريع البحث عن التشابه في البيانات الضخمة حقًا باستخدام فهرسة المتجهات_7.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">الوجبات الرئيسية</h4><ul>
<li>عندما تكون nq أقل من أو تساوي 1,000، فإن IVF_SQ8H تشهد أزمنة استعلام أسرع من IVFSQ8 بضعف سرعة IVFSQ8 تقريبًا.</li>
<li>عندما يكون nq = 2000، تكون أزمنة الاستعلام لـ IVFSQ8H و IVF_SQ8 هي نفسها. ومع ذلك، إذا كانت معلمة gpu_search_threshold_threshold أقل من 2000، سيتفوق IVF_SQ8H على IVF_SQ8.</li>
<li>يتطابق معدل استدعاء الاستعلام في IVF_SQ8H مع IVF_SQ8، مما يعني تحقيق وقت استعلام أقل دون خسارة في دقة البحث.</li>
</ul>
<h3 id="Learn-more-about-Milvus-a-massive-scale-vector-data-management-platform" class="common-anchor-header">تعرّف على المزيد حول Milvus، منصة إدارة بيانات المتجهات واسعة النطاق.</h3><p>Milvus عبارة عن منصة إدارة بيانات المتجهات التي يمكنها تشغيل تطبيقات البحث عن التشابه في مجالات تشمل الذكاء الاصطناعي والتعلم العميق وحسابات المتجهات التقليدية وغيرها. للحصول على معلومات إضافية حول Milvus، اطلع على الموارد التالية:</p>
<ul>
<li>Milvus متاح بموجب ترخيص مفتوح المصدر على <a href="https://github.com/milvus-io/milvus">GitHub</a>.</li>
<li>أنواع الفهارس الإضافية، بما في ذلك الفهارس المستندة إلى الرسم البياني والشجرة، مدعومة في Milvus. للاطلاع على قائمة شاملة بأنواع الفهارس المدعومة، راجع <a href="https://milvus.io/docs/v0.11.0/index.md">وثائق الفهارس المتجهة</a> في ملفوس.</li>
<li>لمعرفة المزيد عن الشركة التي أطلقت Milvus، تفضل بزيارة <a href="https://zilliz.com/">Zilliz.com.</a></li>
<li>دردش مع مجتمع Milvus أو احصل على المساعدة في حل مشكلة على <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
</ul>
<h3 id="Methodology" class="common-anchor-header">المنهجية</h3><h4 id="Performance-testing-environment" class="common-anchor-header">بيئة اختبار الأداء</h4><p>تكوين الخادم المستخدم في اختبارات الأداء المشار إليها في هذه المقالة هو كما يلي:</p>
<ul>
<li>Intel ® Xeon ® Platinum 8163 @ 2.50 جيجا هرتز، 24 نواة</li>
<li>GeForce GTX GTX 2080Ti × 4</li>
<li>ذاكرة 768 جيجابايت</li>
</ul>
<h4 id="Relevant-technical-concepts" class="common-anchor-header">المفاهيم التقنية ذات الصلة</h4><p>على الرغم من أنها ليست ضرورية لفهم هذه المقالة، إليك بعض المفاهيم التقنية المفيدة لتفسير نتائج اختبارات أداء الفهرس:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_8_a6c1de937f.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_8.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_8.png" />
   </span> <span class="img-wrapper"> <span>مدونة_تسريع البحث عن التشابه على البيانات الضخمة حقًا باستخدام فهرسة المتجهات_8.png</span> </span></p>
<h4 id="Resources" class="common-anchor-header">المصادر</h4><p>تم استخدام المصادر التالية لهذه المقالة:</p>
<ul>
<li>"<a href="https://books.google.com/books/about/Encyclopedia_of_Database_Systems.html?id=YdT3wQEACAAJ">موسوعة أنظمة قواعد البيانات</a>"، لينغ ليو و م. تامر أوزسو.</li>
</ul>
