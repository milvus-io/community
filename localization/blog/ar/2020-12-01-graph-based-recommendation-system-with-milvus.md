---
id: graph-based-recommendation-system-with-milvus.md
title: كيف تعمل أنظمة التوصية؟
author: Shiyu Chen
date: 2020-12-01T21:41:08.582Z
desc: >-
  يمكن أن تولد أنظمة التوصية الإيرادات وتقلل التكاليف وتوفر ميزة تنافسية. تعرف
  على كيفية إنشاء واحد مجاناً باستخدام أدوات مفتوحة المصدر.
cover: >-
  assets.zilliz.com/thisisengineering_raeng_z3c_Mj_I6k_P_I_unsplash_2228b9411c.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/graph-based-recommendation-system-with-milvus'
---
<custom-h1>بناء نظام توصية قائم على الرسم البياني باستخدام مجموعات بيانات Milvus و PinSage و DGL و MovieLens</custom-h1><p>يتم تشغيل أنظمة التوصية بواسطة خوارزميات لها <a href="https://www.npr.org/2021/06/03/1002772749/the-rise-of-recommendation-systems-how-machines-figure-out-the-things-we-want">بدايات متواضعة</a> تساعد البشر على غربلة البريد الإلكتروني غير المرغوب فيه. في عام 1990، استخدم المخترع دوغ تيري خوارزمية تصفية تعاونية لفرز البريد الإلكتروني المرغوب فيه من البريد غير المرغوب فيه. بمجرد "إبداء الإعجاب" أو "الكراهية" لرسالة بريد إلكتروني، بالتعاون مع آخرين يفعلون الشيء نفسه مع محتوى بريد مماثل، يمكن للمستخدمين تدريب أجهزة الكمبيوتر بسرعة على تحديد ما يجب دفعه إلى صندوق الوارد الخاص بالمستخدم - وما يجب عزله إلى مجلد البريد غير الهام.</p>
<p>بشكل عام، أنظمة التوصيات هي خوارزميات تقدم اقتراحات ذات صلة للمستخدمين. يمكن أن تكون الاقتراحات أفلامًا للمشاهدة، أو كتبًا للقراءة، أو منتجات للشراء، أو أي شيء آخر حسب السيناريو أو الصناعة. هذه الخوارزميات موجودة في كل مكان حولنا، وتؤثر على المحتوى الذي نستهلكه والمنتجات التي نشتريها من شركات التكنولوجيا الكبرى مثل Youtube وAmazon وNetflix وغيرها الكثير.</p>
<p>يمكن أن تكون أنظمة التوصيات المصممة بشكل جيد مصدراً أساسياً للإيرادات ومخفضاً للتكاليف ومُفاضلاً تنافسياً. وبفضل التكنولوجيا مفتوحة المصدر وانخفاض تكاليف الحوسبة، أصبحت أنظمة التوصيات المخصصة أكثر سهولة من أي وقت مضى. تشرح هذه المقالة كيفية استخدام Milvus، وهي قاعدة بيانات متجهة مفتوحة المصدر؛ PinSage، وهي شبكة عصبية تلافيفية للرسم البياني (GCN)؛ مكتبة الرسم البياني العميق (DGL)، وهي حزمة بيثون قابلة للتطوير للتعلم العميق على الرسوم البيانية؛ ومجموعات بيانات MovieLens لبناء نظام توصية قائم على الرسم البياني.</p>
<p><strong>الانتقال إلى:</strong></p>
<ul>
<li><a href="#how-do-recommendation-systems-work">كيف تعمل أنظمة التوصية؟</a></li>
<li><a href="#tools-for-building-a-recommender-system">أدوات لبناء نظام توصية</a></li>
<li><a href="#building-a-graph-based-recommender-system-with-milvus">بناء نظام توصية قائم على الرسم البياني باستخدام Milvus</a></li>
</ul>
<h2 id="How-do-recommendation-systems-work" class="common-anchor-header">كيف تعمل أنظمة التوصية؟<button data-href="#How-do-recommendation-systems-work" class="anchor-icon" translate="no">
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
    </button></h2><p>هناك طريقتان شائعتان لبناء أنظمة التوصية: التصفية التعاونية والتصفية القائمة على المحتوى. يستخدم معظم المطورين إحدى الطريقتين أو كلتيهما، وعلى الرغم من أن أنظمة التوصية يمكن أن تختلف في التعقيد والبناء، إلا أنها تتضمن عادةً ثلاثة عناصر أساسية</p>
<ol>
<li><strong>نموذج المستخدم:</strong> تتطلب أنظمة التوصية نمذجة خصائص المستخدم وتفضيلاته واحتياجاته. تبني العديد من أنظمة التوصية اقتراحاتها على مدخلات ضمنية أو صريحة على مستوى العنصر من المستخدمين.</li>
<li><strong>نموذج العنصر:</strong> تقوم أنظمة التوصية أيضًا بنمذجة العناصر من أجل تقديم توصيات للعناصر بناءً على صور المستخدم.</li>
<li><strong>خوارزمية التوصية:</strong> المكون الأساسي لأي نظام توصية هو الخوارزمية التي تشغل توصياته. وتشمل الخوارزميات الشائعة الاستخدام التصفية التعاونية، والنمذجة الدلالية الضمنية، والنمذجة القائمة على الرسم البياني، والتوصية المدمجة، وغيرها.</li>
</ol>
<p>على مستوى عالٍ، تقوم أنظمة التوصية التي تعتمد على التصفية التعاونية ببناء نموذج من سلوك المستخدم السابق (بما في ذلك مدخلات السلوك من مستخدمين مشابهين) للتنبؤ بما قد يهتم به المستخدم. تستخدم الأنظمة التي تعتمد على التصفية المستندة إلى المحتوى علامات منفصلة ومحددة مسبقًا استنادًا إلى خصائص العنصر للتوصية بعناصر متشابهة.</p>
<p>ومن الأمثلة على التصفية التعاونية محطة راديو مخصصة على Spotify تستند إلى سجل استماع المستخدم واهتماماته ومكتبته الموسيقية وغير ذلك. تقوم المحطة بتشغيل الموسيقى التي لم يقم المستخدم بحفظها أو التعبير عن اهتمامه بها، ولكن غالبًا ما يكون لدى المستخدمين الآخرين ذوي الذوق المماثل. من أمثلة التصفية القائمة على المحتوى محطة إذاعية تستند إلى أغنية أو فنان معين تستخدم سمات المدخلات للتوصية بموسيقى مشابهة.</p>
<h2 id="Tools-for-building-a-recommender-system" class="common-anchor-header">أدوات لبناء نظام توصية<button data-href="#Tools-for-building-a-recommender-system" class="anchor-icon" translate="no">
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
    </button></h2><p>في هذا المثال، يعتمد بناء نظام توصية قائم على الرسم البياني من الصفر على الأدوات التالية:</p>
<h3 id="Pinsage-A-graph-convolutional-network" class="common-anchor-header">بينساج: شبكة التفافية للرسم البياني</h3><p><a href="https://medium.com/pinterest-engineering/pinsage-a-new-graph-convolutional-neural-network-for-web-scale-recommender-systems-88795a107f48">PinSage</a> عبارة عن شبكة تلافيفية للرسم البياني عشوائية المشي قادرة على تعلم التضمينات للعقد في الرسوم البيانية على نطاق الويب التي تحتوي على مليارات من الكائنات. تم تطوير هذه الشبكة من قبل شركة <a href="https://www.pinterest.com/">Pinterest،</a> وهي شركة للوحات الدبابيس على الإنترنت، لتقديم توصيات مرئية موضوعية لمستخدميها.</p>
<p>يمكن لمستخدمي Pinterest "تثبيت" المحتوى الذي يثير اهتمامهم في "لوحات"، وهي مجموعات من المحتوى المثبت. مع وجود أكثر من <a href="https://business.pinterest.com/audience/">478 مليون</a> مستخدم نشط شهريًا (MAU) وأكثر من <a href="https://newsroom.pinterest.com/en/company">240 مليار</a> عنصر محفوظ، تمتلك الشركة كمية هائلة من بيانات المستخدمين التي يجب أن تبني تكنولوجيا جديدة لمواكبة ذلك.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_742d28f7a9.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>يستخدم PinSage الرسوم البيانية ثنائية الأجزاء للوحات الدبابيس لتوليد تضمينات عالية الجودة من الدبابيس التي تُستخدم للتوصية بمحتوى متشابه بصرياً للمستخدمين. على عكس خوارزميات GCN التقليدية، التي تقوم بإجراء عمليات التلافيف على مصفوفات السمات والرسم البياني الكامل، تقوم PinSage بأخذ عينات من العقد/الدبابيس القريبة وتقوم بإجراء عمليات تلافيف محلية أكثر كفاءة من خلال البناء الديناميكي للرسوم البيانية الحسابية.</p>
<p>سينتج عن إجراء عمليات التلافيف على كامل المنطقة المجاورة للعقدة رسم بياني حسابي ضخم. ولتقليل متطلبات الموارد، تقوم خوارزميات GCN التقليدية بتحديث تمثيل العقدة من خلال تجميع المعلومات من جوارها الذي يحتوي على عدد k-قفزة. تقوم PinSage بمحاكاة المشي العشوائي لتعيين المحتوى الذي تتم زيارته بشكل متكرر كجوار رئيسي ثم تقوم ببناء التواء بناءً عليه.</p>
<p>نظرًا لوجود تداخل في كثير من الأحيان في أحياء القفزات k-قفزة في كثير من الأحيان، ينتج عن الالتفاف المحلي على العقد عمليات حسابية متكررة. لتجنب ذلك، يقوم PinSage في كل خطوة تجميعية بتعيين جميع العقد دون حساب متكرر، ثم يربطها بعقد المستوى الأعلى المقابلة، وأخيراً يسترجع تضمينات عقد المستوى الأعلى.</p>
<h3 id="Deep-Graph-Library-A-scalable-python-package-for-deep-learning-on-graphs" class="common-anchor-header">مكتبة الرسم البياني العميق: حزمة بايثون قابلة للتطوير للتعلم العميق على الرسوم البيانية</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/dgl_framework_building_graph_based_recommender_milvus_af62de6dd4.png" alt="dgl-framework-building-graph-based-recommender-milvus.png" class="doc-image" id="dgl-framework-building-graph-based-recommender-milvus.png" />
   </span> <span class="img-wrapper"> <span>dgl-framework-building-gramraph-based-recommender-milvus.png</span> </span></p>
<p><a href="https://www.dgl.ai/">مكتبة</a> الرسوم<a href="https://www.dgl.ai/">البيانية</a> العميقة<a href="https://www.dgl.ai/">(DGL</a> ) هي حزمة بايثون مصممة لبناء نماذج الشبكات العصبية القائمة على الرسوم البيانية على رأس أطر التعلم العميق الحالية (مثل PyTorch وMXNet وGluon وغيرها). تشتمل DGL على واجهة خلفية سهلة الاستخدام، مما يجعل من السهل زرعها في الأطر القائمة على الموتر والتي تدعم التوليد التلقائي. تم تحسين خوارزمية PinSage المذكورة أعلاه للاستخدام مع DGL و PyTorch.</p>
<h3 id="Milvus-An-open-source-vector-database-built-for-AI-and-similarity-search" class="common-anchor-header">Milvus: قاعدة بيانات متجهة مفتوحة المصدر مصممة للذكاء الاصطناعي والبحث عن التشابه</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_does_milvus_work_6926180543.png" alt="how-does-milvus-work.png" class="doc-image" id="how-does-milvus-work.png" />
   </span> <span class="img-wrapper"> <span>كيف-يفعل-ميلفوس-عمل.png</span> </span></p>
<p>Milvus هي قاعدة بيانات متجهات مفتوحة المصدر مصممة لتشغيل تطبيقات البحث عن التشابه المتجهي والذكاء الاصطناعي (AI). على مستوى عالٍ، يعمل استخدام Milvus للبحث عن التشابه على النحو التالي:</p>
<ol>
<li>تُستخدم نماذج التعلم العميق لتحويل البيانات غير المهيكلة إلى متجهات مميزة، والتي يتم استيرادها إلى Milvus.</li>
<li>يقوم ميلفوس بتخزين وفهرسة متجهات السمات.</li>
<li>عند الطلب، يبحث Milvus عن المتجهات الأكثر تشابهًا مع متجه الإدخال ويعيدها.</li>
</ol>
<h2 id="Building-a-graph-based-recommendation-system-with-Milvus" class="common-anchor-header">بناء نظام توصية قائم على الرسم البياني باستخدام Milvus<button data-href="#Building-a-graph-based-recommendation-system-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/beike_intelligent_house_platform_diagram_6e278da118.jpg" alt="beike-intelligent-house-platform-diagram.jpg" class="doc-image" id="beike-intelligent-house-platform-diagram.jpg" />
   </span> <span class="img-wrapper"> <span>beike-intelligent-house-platform-diagram.jpg</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_building_graph_based_recommender_system_bf89770634.png" alt="3-building-graph-based-recommender-system.png" class="doc-image" id="3-building-graph-based-recommender-system.png" />
   </span> <span class="img-wrapper"> <span>3-بناء نظام توصية قائم على الرسم البياني. png</span> </span></p>
<p>يتضمن بناء نظام توصية قائم على الرسم البياني باستخدام Milvus الخطوات التالية:</p>
<h3 id="Step-1-Preprocess-data" class="common-anchor-header">الخطوة 1: المعالجة المسبقة للبيانات</h3><p>تتضمن المعالجة المسبقة للبيانات تحويل البيانات الخام إلى تنسيق يسهل فهمه. يستخدم هذا المثال مجموعات البيانات المفتوحة MovieLens[5] (m1-1m)، والتي تحتوي على 1,000,000 تقييم لـ 4,000 فيلم ساهم بها 6,000 مستخدم. تم جمع هذه البيانات بواسطة GroupLens وتتضمن أوصاف الأفلام وتقييمات الأفلام وخصائص المستخدم.</p>
<p>لاحظ أن مجموعات بيانات MovieLens المستخدمة في هذا المثال تتطلب الحد الأدنى من تنظيف البيانات أو تنظيمها. ومع ذلك، إذا كنت تستخدم مجموعات بيانات مختلفة فقد تختلف الأميال التي تقطعها.</p>
<p>للبدء في بناء نظام توصية، قم ببناء رسم بياني ثنائي بين المستخدم والفيلم لأغراض التصنيف باستخدام بيانات المستخدم والفيلم التاريخية من مجموعة بيانات MovieLens.</p>
<pre><code translate="no">graph_builder = PandasGraphBuilder()
graph_builder.add_entities(users, 'user_id', 'user')
graph_builder.add_entities(movies_categorical, 'movie_id', 'movie')
graph_builder.add_binary_relations(ratings, 'user_id', 'movie_id', 'watched')
graph_builder.add_binary_relations(ratings, 'movie_id', 'user_id', 'watched-by')
g = graph_builder.build()
</code></pre>
<h3 id="Step-2-Train-model-with-PinSage" class="common-anchor-header">الخطوة 2: تدريب النموذج باستخدام PinSage</h3><p>متجهات تضمين متجهات الدبابيس التي تم إنشاؤها باستخدام نموذج PinSage هي متجهات ميزات لمعلومات الفيلم المكتسبة. قم بإنشاء نموذج PinSage استنادًا إلى نموذج PinSage استنادًا إلى الرسم البياني الثنائي g وأبعاد متجه سمة الفيلم المخصص (256 د افتراضيًا). بعد ذلك، قم بتدريب النموذج باستخدام PyTorch للحصول على تضمينات h_item لـ 4000 فيلم.</p>
<pre><code translate="no"># Define the model
model = PinSAGEModel(g, item_ntype, textset, args.hidden_dims, args.num_layers).to(device)
opt = torch.optim.Adam(model.parameters(), lr=args.lr)
# Get the item embeddings
for blocks in dataloader_test:
   for i in range(len(blocks)):
   blocks[i] = blocks[i].to(device)
   h_item_batches.append(model.get_repr(blocks))
h_item = torch.cat(h_item_batches, 0)
</code></pre>
<h3 id="Step-3-Load-data" class="common-anchor-header">الخطوة 3: تحميل البيانات</h3><p>قم بتحميل تضمينات الفيلم h_item التي تم إنشاؤها بواسطة نموذج PinSage في Milvus، والتي ستعيد المعرفات المقابلة. قم باستيراد المعرفات ومعلومات الفيلم المقابلة إلى MySQL.</p>
<pre><code translate="no"># Load data to Milvus and MySQL
status, ids = milvus.insert(milvus_table, h_item)
load_movies_to_mysql(milvus_table, ids_info)
</code></pre>
<h3 id="Step-4-Conduct-vector-similarity-search" class="common-anchor-header">الخطوة 4: إجراء بحث التشابه المتجهي</h3><p>احصل على التضمينات المقابلة في Milvus استنادًا إلى معرّفات الأفلام، ثم استخدم Milvus لإجراء بحث التشابه مع هذه التضمينات. بعد ذلك، حدد معلومات الفيلم المقابلة في قاعدة بيانات MySQL.</p>
<pre><code translate="no"># Get embeddings that users like
_, user_like_vectors = milvus.get_entity_by_id(milvus_table, ids)
# Get the information with similar movies
_, ids = milvus.search(param = {milvus_table, user_like_vectors, top_k})
sql = &quot;select * from &quot; + movies_table + &quot; where milvus_id=&quot; + ids + &quot;;&quot;
results = cursor.execute(sql).fetchall()
</code></pre>
<h3 id="Step-5-Get-recommendations" class="common-anchor-header">الخطوة 5: الحصول على توصيات</h3><p>سيوصي النظام الآن بالأفلام الأكثر تشابهًا مع استعلامات بحث المستخدم. هذا هو سير العمل العام لبناء نظام توصيات. لاختبار أنظمة التوصية وتطبيقات الذكاء الاصطناعي الأخرى ونشرها بسرعة، جرّب <a href="https://github.com/milvus-io/bootcamp">مخيم Milvus التمهيدي</a>.</p>
<h2 id="Milvus-can-power-more-than-recommender-systems" class="common-anchor-header">يمكن لـ Milvus تشغيل أكثر من أنظمة التوصية<button data-href="#Milvus-can-power-more-than-recommender-systems" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus هو أداة قوية قادرة على تشغيل مجموعة كبيرة من تطبيقات الذكاء الاصطناعي وتطبيقات البحث عن التشابه المتجه. لمعرفة المزيد عن المشروع، اطلع على الموارد التالية:</p>
<ul>
<li>اقرأ <a href="https://zilliz.com/blog">مدونتنا</a>.</li>
<li>تفاعل مع مجتمعنا مفتوح المصدر على <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>استخدم أو ساهم في قاعدة بيانات المتجهات الأكثر شعبية في العالم على <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
</ul>
