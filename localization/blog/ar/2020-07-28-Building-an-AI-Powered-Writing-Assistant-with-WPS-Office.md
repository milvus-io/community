---
id: Building-an-AI-Powered-Writing-Assistant-with-WPS-Office.md
title: بناء مساعد كتابة مدعوم بالذكاء الاصطناعي لمكتب WPS
author: milvus
date: 2020-07-28T03:35:40.105Z
desc: >-
  تعرّف على كيفية استفادة Kingsoft من محرك البحث عن التشابه مفتوح المصدر Milvus،
  وهو محرك بحث عن التشابه مفتوح المصدر، لبناء محرك توصيات لمساعد الكتابة المدعوم
  بالذكاء الاصطناعي في WPS Office.
cover: assets.zilliz.com/wps_thumbnail_6cb7876963.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/Building-an-AI-Powered-Writing-Assistant-with-WPS-Office
---
<custom-h1>إنشاء مساعد كتابة مدعوم بالذكاء الاصطناعي لأداة WPS Office</custom-h1><p>WPS Office هي أداة إنتاجية طورتها شركة Kingsoft ولديها أكثر من 150 مليون مستخدم حول العالم. قام قسم الذكاء الاصطناعي (AI) في الشركة ببناء مساعد كتابة ذكي من الصفر باستخدام خوارزميات المطابقة الدلالية مثل التعرف على النوايا وتجميع النصوص. وتوجد الأداة كتطبيق ويب <a href="https://walkthechat.com/wechat-mini-programs-simple-introduction/">وبرنامج WeChat مصغر</a> يساعد المستخدمين على إنشاء الخطوط العريضة والفقرات الفردية والمستندات بأكملها بسرعة بمجرد إدخال عنوان واختيار ما يصل إلى خمس كلمات رئيسية.</p>
<p>ويستخدم محرك التوصيات الخاص بمساعد الكتابة محرك "ميلفوس"، وهو محرك بحث تشابه مفتوح المصدر، لتشغيل وحدة معالجة المتجهات الأساسية. سنستكشف أدناه عملية إنشاء مساعد الكتابة الذكي لمكاتب WPS Office، بما في ذلك كيفية استخراج الميزات من البيانات غير المهيكلة بالإضافة إلى الدور الذي يلعبه Milvus في تخزين البيانات وتشغيل محرك التوصيات الخاص بالأداة.</p>
<p>الانتقال إلى:</p>
<ul>
<li><a href="#building-an-ai-powered-writing-assistant-for-wps-office">بناء مساعد الكتابة المدعوم بالذكاء الاصطناعي لمكتب WPS Office</a><ul>
<li><a href="#making-sense-of-unstructured-textual-data">فهم البيانات النصية غير المهيكلة</a></li>
<li><a href="#using-the-tfidf-model-to-maximize-feature-extraction">استخدام نموذج TFIDF لتعظيم استخراج الميزات</a></li>
<li><a href="#extracting-features-with-the-bi-directional-lstm-cnns-crf-deep-learning-model">استخراج الميزات باستخدام نموذج التعلّم العميق ثنائي الاتجاه LSTM-CNNs-CRF</a></li>
<li><a href="#creating-sentence-embeddings-using-infersent">إنشاء تضمينات الجمل باستخدام Infersent</a></li>
<li><a href="#storing-and-querying-vectors-with-milvus">تخزين المتجهات والاستعلام عنها باستخدام Milvus</a></li>
<li><a href="#ai-isnt-replacing-writers-its-helping-them-write">الذكاء الاصطناعي لا يحل محل الكتّاب، بل يساعدهم على الكتابة</a></li>
</ul></li>
</ul>
<h3 id="Making-sense-of-unstructured-textual-data" class="common-anchor-header">فهم البيانات النصية غير المنظمة</h3><p>على غرار أي مشكلة حديثة تستحق الحل، يبدأ بناء مساعد الكتابة WPS ببيانات فوضوية. عشرات الملايين من المستندات النصية الكثيفة التي يجب أن تُستخرج منها ميزات ذات معنى، لنكون أكثر دقة. لفهم مدى تعقيد هذه المشكلة، فكّر في كيفية قيام صحفيين من وسيلتين إخباريتين مختلفتين بإعداد تقرير عن نفس الموضوع.</p>
<p>في حين أن كلاهما سيلتزمان بالقواعد والمبادئ والعمليات التي تحكم بنية الجملة، إلا أنهما سيقومان باختيارات مختلفة للكلمات، وسيقومان بإنشاء جمل متفاوتة الطول، وسيستخدمان هياكل المقالات الخاصة بهما لسرد قصص متشابهة (أو ربما متباينة). على عكس مجموعات البيانات المهيكلة ذات العدد الثابت من الأبعاد، تفتقر أجسام النصوص بطبيعتها إلى البنية لأن البنية التي تحكمها مرنة للغاية. من أجل العثور على المعنى، يجب استخراج الميزات القابلة للقراءة الآلية من مجموعة غير منظمة من المستندات. لكن أولاً، يجب تنظيف البيانات.</p>
<p>هناك مجموعة متنوعة من الطرق لتنظيف البيانات النصية، والتي لن تتناول هذه المقالة أيًا منها بعمق. ومع ذلك، فإن هذه خطوة مهمة تسبق معالجة البيانات، ويمكن أن تشمل إزالة العلامات، وإزالة الأحرف المعجمة، وتوسيع الانقباضات، وإزالة الأحرف الخاصة، وإزالة الكلمات المتوقفة، وغير ذلك. يمكن الاطلاع على شرح مفصّل لطرق المعالجة المسبقة وتنظيف البيانات النصية <a href="https://towardsdatascience.com/understanding-feature-engineering-part-3-traditional-methods-for-text-data-f6f7d70acd41">هنا</a>.</p>
<h3 id="Using-the-TFIDF-model-to-maximize-feature-extraction" class="common-anchor-header">استخدام نموذج TFIDF لتعظيم استخراج الميزات</h3><p>للبدء في فهم البيانات النصية غير المهيكلة، تم تطبيق نموذج تكرار المصطلح-تكرار المستند العكسي (TFIDF) على مجموعة النصوص التي يستخرج منها مساعد الكتابة في WPS. يستخدم هذا النموذج مزيجًا من مقياسين، تكرار المصطلح وتكرار المستند العكسي، لإعطاء كل كلمة داخل المستند قيمة TFIDF. يمثل تكرار المصطلح (TF) العدد الخام للمصطلح في المستند مقسومًا على العدد الإجمالي للمصطلحات في المستند، بينما يمثل تكرار المستند العكسي (IDF) عدد المستندات في مجموعة المستندات مقسومًا على عدد المستندات التي يظهر فيها المصطلح.</p>
<p>ويوفر حاصل ضرب TF و IDF مقياسًا لمدى تكرار ظهور المصطلح في المستند مضروبًا في مدى تفرّد الكلمة في مجموعة المستندات. في نهاية المطاف، تُعد قيم TFIDF مقياسًا لمدى ارتباط كلمة ما بمستند ضمن مجموعة من المستندات. يتم فرز المصطلحات حسب قيم TFIDF، ويمكن إعطاء المصطلحات ذات القيم المنخفضة (أي الكلمات الشائعة) وزنًا أقل عند استخدام التعلّم العميق لاستخراج السمات من مجموعة المستندات.</p>
<h3 id="Extracting-features-with-the-bi-directional-LSTM-CNNs-CRF-deep-learning-model" class="common-anchor-header">استخراج الميزات باستخدام نموذج التعلّم العميق ثنائي الاتجاه LSTM-CNNs-CRF ثنائي الاتجاه</h3><p>باستخدام مزيج من الذاكرة طويلة المدى ثنائية الاتجاه (BLSTM) والشبكات العصبية التلافيفية (CNN) والحقول العشوائية الشرطية (CRF) يمكن استخراج تمثيلات على مستوى الكلمات والأحرف من مجموعة النصوص. يعمل <a href="https://arxiv.org/pdf/1603.01354.pdf">نموذج BLSTM-CNNs-CRF</a> المستخدم في بناء مساعد الكتابة المكتبية WPS Office على النحو التالي:</p>
<ol>
<li><strong>سي إن إن:</strong> يتم استخدام تضمينات الأحرف كمدخلات لشبكة CNN، ثم يتم استخراج تراكيب الكلمات ذات الصلة من الناحية الدلالية (أي البادئة أو اللاحقة) وترميزها إلى متجهات تمثيل على مستوى الحرف.</li>
<li><strong>BLSTM:</strong> يتم ربط المتجهات على مستوى الأحرف مع متجهات تضمين الكلمات ثم يتم إدخالها في شبكة BLSTM. يتم تقديم كل تسلسل إلى الأمام والخلف إلى حالتين مخفيتين منفصلتين لالتقاط المعلومات السابقة والمستقبلية.</li>
<li><strong>CRF:</strong> يتم تغذية متجهات الخرج من BLSTM إلى طبقة CRF لفك تشفير أفضل تسلسل للتسمية بشكل مشترك.</li>
</ol>
<p>أصبحت الشبكة العصبية الآن قادرة على استخراج وتصنيف الكيانات المسماة من نص غير منظم. وتسمى هذه العملية <a href="https://en.wikipedia.org/wiki/Named-entity_recognition">بالتعرّف على الكيانات المسماة (NER)</a> وتتضمن تحديد وتصنيف فئات مثل أسماء الأشخاص والمؤسسات والمواقع الجغرافية وغيرها. تلعب هذه الكيانات دورًا مهمًا في فرز البيانات واستدعائها. ومن هنا يمكن استخلاص الجمل والفقرات والملخصات الرئيسية من مجموعة البيانات.</p>
<h3 id="Creating-sentence-embeddings-using-Infersent" class="common-anchor-header">إنشاء تضمينات الجمل باستخدام Infersent</h3><p>تُستخدم طريقة<a href="https://github.com/facebookresearch/InferSent">Infersent،</a> وهي طريقة تضمين جمل خاضعة للإشراف صممها فيسبوك تقوم بتضمين جمل كاملة في فضاء متجه، لإنشاء متجهات يتم إدخالها في قاعدة بيانات Milvus. وقد تم تدريب Infersent باستخدام مجموعة ستانفورد للاستدلال على اللغة الطبيعية (SNLI)، والتي تحتوي على 570 ألف زوج من الجمل التي تمت كتابتها وتسميتها من قبل البشر. يمكن العثور على معلومات إضافية حول كيفية عمل Infersent <a href="https://medium.com/analytics-vidhya/sentence-embeddings-facebooks-infersent-6ac4a9fc2001">هنا</a>.</p>
<h3 id="Storing-and-querying-vectors-with-Milvus" class="common-anchor-header">تخزين المتجهات والاستعلام عنها باستخدام Milvus</h3><p><a href="https://www.milvus.io/">ميلفوس</a> هو محرك بحث تشابه مفتوح المصدر يدعم إضافة وحذف وتحديث والبحث شبه الفوري عن التضمينات على نطاق تريليون بايت. لتحسين أداء الاستعلام، يسمح Milvus بتحديد نوع فهرس لكل حقل متجه. يستخدم المساعد الذكي لمكتب WPS Office فهرس IVF_FLAT، وهو نوع الفهرس الأساسي للملف المقلوب (IVF) حيث تعني كلمة "مسطح" أن المتجهات مخزنة بدون ضغط أو تكميم. يعتمد التجميع على IndexFlat2، والذي يستخدم البحث الدقيق للمسافة L2.</p>
<p>على الرغم من أن IVF_FLAT لديه معدل استرجاع استعلام بنسبة 100%، إلا أن افتقاره للضغط يؤدي إلى سرعات استعلام بطيئة نسبيًا. تُستخدم <a href="https://milvus.io/docs/manage-partitions.md">وظيفة التقسيم</a> في Milvus لتقسيم البيانات إلى أجزاء متعددة من التخزين الفعلي بناءً على قواعد محددة مسبقًا، مما يجعل الاستعلامات أسرع وأكثر دقة. عند إضافة المتجهات إلى ميلفوس، تحدد العلامات القسم الذي يجب إضافة البيانات إليه. تستخدم استعلامات البيانات المتجهة علامات لتحديد القسم الذي يجب تنفيذ الاستعلام عليه. يمكن تقسيم البيانات بشكل أكبر إلى أجزاء داخل كل قسم لزيادة تحسين السرعة.</p>
<p>يستخدم مساعد الكتابة الذكي أيضًا مجموعات Kubernetes، مما يسمح بتشغيل حاويات التطبيقات عبر أجهزة وبيئات متعددة، بالإضافة إلى MySQL لإدارة البيانات الوصفية.</p>
<h3 id="AI-isn’t-replacing-writers-it’s-helping-them-write" class="common-anchor-header">الذكاء الاصطناعي لا يحل محل الكتّاب، بل يساعدهم على الكتابة</h3><p>يعتمد مساعد الكتابة من Kingsoft لـ WPS Office على نظام Milvus لإدارة قاعدة بيانات تضم أكثر من مليوني مستند والاستعلام عنها. يتسم النظام بمرونة عالية، وهو قادر على إجراء بحث في الوقت الفعلي تقريباً على مجموعات بيانات بمقياس تريليون. وتكتمل الاستعلامات في 0.2 ثانية في المتوسط، مما يعني أنه يمكن إنشاء مستندات كاملة على الفور تقريباً باستخدام عنوان أو بضع كلمات رئيسية فقط. على الرغم من أن الذكاء الاصطناعي لا يحل محل الكُتّاب المحترفين، إلا أن التكنولوجيا الموجودة اليوم قادرة على زيادة عملية الكتابة بطرق جديدة ومثيرة للاهتمام. المستقبل غير معروف، ولكن على الأقل يمكن للكتّاب أن يتطلعوا إلى طرق أكثر إنتاجية وأقل صعوبة بالنسبة للبعض في "وضع القلم على الورق".</p>
<p>تم استخدام المصادر التالية في هذه المقالة:</p>
<ul>
<li>"<a href="https://arxiv.org/pdf/1603.01354.pdf">وضع العلامات التسلسلية من النهاية إلى النهاية عن طريق LSTM-CNNs-CRF ثنائية الاتجاه</a>"، شويزي ما وإدوارد هوفي.</li>
<li>"<a href="https://towardsdatascience.com/understanding-feature-engineering-part-3-traditional-methods-for-text-data-f6f7d70acd41">الطرق التقليدية للبيانات النصية</a>"، ديبانجان (دي جي) ساركار.</li>
<li>"<a href="https://ieeexplore.ieee.org/document/8780663">استخراج ميزات النص استنادًا إلى TF-IDF ربط الدلالات الدلالية</a>"، تشينغ ليو، وجينغ وانغ، وديهاي زانغ، ويون يانغ، وناي ياو وانغ.</li>
<li>"<a href="https://medium.com/analytics-vidhya/sentence-embeddings-facebooks-infersent-6ac4a9fc2001">فهم تضمينات الجمل باستخدام إنفيرسنت فيسبوك</a>"، ريحان أحمد</li>
<li>"<a href="https://arxiv.org/pdf/1705.02364.pdf">التعلم الخاضع للإشراف لتمثيلات الجمل العالمية من بيانات استدلال اللغة الطبيعية</a>"، ألكسيس كونو، دوي كيلا، هولجر شوينك، لويك بارولت، أنطوان بوردس.</li>
</ul>
<p>اقرأ <a href="https://zilliz.com/user-stories">قصص المستخدمين</a> الآخرين لمعرفة المزيد حول صنع الأشياء باستخدام ميلفوس.</p>
