---
id: test-and-deploy-vector-search-solutions-milvus-bootcamp.md
title: اختبار حلول البحث المتجه ونشرها بسرعة باستخدام برنامج Milvus 2.0 Bootcamp
author: milvus
date: 2021-07-15T03:05:45.742Z
desc: >-
  قم ببناء واختبار وتخصيص حلول البحث عن تشابه المتجهات باستخدام Milvus، وهي
  قاعدة بيانات متجهات مفتوحة المصدر.
cover: assets.zilliz.com/cover_80db9ee49c.png
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/test-and-deploy-vector-search-solutions-milvus-bootcamp
---
<custom-h1>اختبار حلول البحث المتجه ونشرها بسرعة مع معسكر التدريب Milvus 2.0 Milvus 2.0</custom-h1><p>مع إصدار Milvus 2.0، قام الفريق بتجديد <a href="https://github.com/milvus-io/bootcamp">معسكر تدريب</a> Milvus التمهيدي. يقدم المعسكر التمهيدي الجديد والمحسّن أدلة إرشادية محدثة وأمثلة برمجية أسهل في المتابعة لمجموعة متنوعة من حالات الاستخدام وعمليات النشر. بالإضافة إلى ذلك، تم تحديث هذا الإصدار الجديد لـ <a href="https://milvus.io/blog/milvus2.0-redefining-vector-database.md">Milvus 2.0،</a> وهو إصدار معاد تصوره من قاعدة البيانات المتجهة الأكثر تقدمًا في العالم.</p>
<h3 id="Stress-test-your-system-against-1M-and-100M-dataset-benchmarks" class="common-anchor-header">اختبار الضغط على النظام الخاص بك مقابل معايير مجموعة بيانات 1 مليون و100 مليون</h3><p>يحتوي <a href="https://github.com/milvus-io/bootcamp/tree/master/benchmark_test">الدليل المعياري</a> على مليون و100 مليون اختبار معياري للمتجهات التي تشير إلى كيفية تفاعل نظامك مع مجموعات البيانات ذات الأحجام المختلفة.</p>
<p><br/></p>
<h3 id="Explore-and-build-popular-vector-similarity-search-solutions" class="common-anchor-header">استكشاف وإنشاء حلول بحث تشابه المتجهات الشائعة</h3><p>يتضمن <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions">دليل الحلول</a> حالات استخدام بحث التشابه المتجه الأكثر شيوعًا. وتحتوي كل حالة استخدام على حل دفتري وحل قابل للنشر على قاعدة بيانات. تتضمن حالات الاستخدام:</p>
<ul>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/reverse_image_search">بحث تشابه الصور</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/video_similarity_search">بحث تشابه الفيديو</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/audio_similarity_search">بحث تشابه الصوت</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/recommendation_system">نظام التوصيات</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/molecular_similarity_search">البحث الجزيئي</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/question_answering_system">نظام الإجابة عن الأسئلة</a></li>
</ul>
<p><br/></p>
<h3 id="Quickly-deploy-a-fully-built-application-on-any-system" class="common-anchor-header">نشر تطبيق كامل البناء بسرعة على أي نظام</h3><p>حلول النشر السريع عبارة عن حلول مرساة تتيح للمستخدمين نشر تطبيقات مبنية بالكامل على أي نظام. هذه الحلول مثالية للعروض التوضيحية الموجزة، ولكنها تتطلب عملاً إضافياً لتخصيصها وفهمها مقارنةً بالدفاتر الدفترية.</p>
<p><br/></p>
<h3 id="Use-scenario-specific-notebooks-to-easily-deploy-pre-configured-applications" class="common-anchor-header">استخدم دفاتر الملاحظات الخاصة بسيناريو محدد لنشر التطبيقات المهيأة مسبقاً بسهولة</h3><p>تحتوي دفاتر الملاحظات على مثال بسيط لنشر Milvus لحل المشكلة في حالة استخدام معينة. يمكن تشغيل كل مثال من الأمثلة من البداية إلى النهاية دون الحاجة إلى إدارة الملفات أو التكوينات. كما أن كل دفتر ملاحظات سهل المتابعة وقابل للتعديل، مما يجعلها ملفات أساسية مثالية لمشاريع أخرى.</p>
<p><br/></p>
<h3 id="Image-similarity-search-notebook-example" class="common-anchor-header">مثال دفتر بحث تشابه الصور</h3><p>يعد البحث عن تشابه الصور أحد الأفكار الأساسية وراء العديد من التقنيات المختلفة، بما في ذلك السيارات ذاتية القيادة التي تتعرف على الأجسام. يشرح هذا المثال كيفية بناء برامج الرؤية الحاسوبية بسهولة باستخدام ميلفوس.</p>
<p>يدور هذا الدفتر حول ثلاثة أشياء:</p>
<ul>
<li>خادم ميلفوس</li>
<li>خادم ريديس (لتخزين البيانات الوصفية)</li>
<li>نموذج Resnet-18 المدرب مسبقًا.</li>
</ul>
<h4 id="Step-1-Download-required-packages" class="common-anchor-header">الخطوة 1: تنزيل الحزم المطلوبة</h4><p>ابدأ بتنزيل جميع الحزم المطلوبة لهذا المشروع. يتضمن هذا الدفتر جدولاً يسرد الحزم التي يجب استخدامها.</p>
<pre><code translate="no">pip install -r requirements.txt
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-2-Server-startup" class="common-anchor-header">الخطوة 2: بدء تشغيل الخادم</h4><p>بعد تثبيت الحزم، ابدأ تشغيل الخوادم وتأكد من تشغيل كلاهما بشكل صحيح. تأكد من اتباع التعليمات الصحيحة لبدء تشغيل خادمي <a href="https://milvus.io/docs/v2.0.x/install_standalone-docker.md">ميلفوس</a> <a href="https://hub.docker.com/_/redis">وريديس</a>.</p>
<h4 id="Step-3-Download-project-data" class="common-anchor-header">الخطوة 3: تنزيل بيانات المشروع</h4><p>يسحب هذا الدفتر افتراضيًا مقتطفًا من بيانات VOCImage لاستخدامه كمثال، ولكن يجب أن يعمل أي دليل يحتوي على صور طالما أنه يتبع بنية الملف التي يمكن رؤيتها في أعلى الدفتر.</p>
<pre><code translate="no">! gdown <span class="hljs-string">&quot;https://drive.google.com/u/1/uc?id=1jdudBiUu41kL-U5lhH3ari_WBRXyedWo&amp;export=download&quot;</span>
! tar -xf <span class="hljs-string">&#x27;VOCdevkit.zip&#x27;</span>
! <span class="hljs-built_in">rm</span> <span class="hljs-string">&#x27;VOCdevkit.zip&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-4-Connect-to-the-servers" class="common-anchor-header">الخطوة 4: الاتصال بالخوادم</h4><p>في هذا المثال، تعمل الخوادم على المنافذ الافتراضية على المضيف المحلي.</p>
<pre><code translate="no">connections.<span class="hljs-title function_">connect</span>(host=<span class="hljs-string">&quot;127.0.0.1&quot;</span>, port=<span class="hljs-number">19537</span>)
red = redis.<span class="hljs-title class_">Redis</span>(host = <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>, port=<span class="hljs-number">6379</span>, db=<span class="hljs-number">0</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-5-Create-a-collection" class="common-anchor-header">الخطوة 5: إنشاء مجموعة</h4><p>بعد بدء تشغيل الخوادم، قم بإنشاء مجموعة في ميلفوس لتخزين جميع المتجهات. في هذا المثال، تم تعيين حجم البُعد على 512، وهو حجم مخرجات ريسنت 18، وتم تعيين مقياس التشابه على المسافة الإقليدية (L2). يدعم ميلفوس مجموعة متنوعة من <a href="https://milvus.io/docs/v2.0.x/metric.md">مقاييس التشابه</a> المختلفة.</p>
<pre><code translate="no">collection_name = <span class="hljs-string">&quot;image_similarity_search&quot;</span>
dim = <span class="hljs-number">512</span>
default_fields = [
    schema.FieldSchema(name=<span class="hljs-string">&quot;id&quot;</span>, dtype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">True</span>),
    schema.FieldSchema(name=<span class="hljs-string">&quot;vector&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=dim)
]
default_schema = schema.CollectionSchema(fields=default_fields, description=<span class="hljs-string">&quot;Image test collection&quot;</span>)
collection = Collection(name=collection_name, schema=default_schema)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-6-Build-an-index-for-the-collection" class="common-anchor-header">الخطوة 6: إنشاء فهرس للمجموعة</h4><p>بمجرد إنشاء المجموعة، قم ببناء فهرس لها. في هذه الحالة، يتم استخدام فهرس IVF_SQ8. يتطلب هذا الفهرس معلمة "nlist"، والتي تخبر ميلفوس بعدد المجموعات التي يجب إنشاؤها داخل كل ملف بيانات (مقطع). تتطلب <a href="https://milvus.io/docs/v2.0.x/index.md">المؤشرات</a> المختلفة معلمات مختلفة.</p>
<pre><code translate="no">default_index = {<span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;IVF_SQ8&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">2048</span>}, <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>}
collection.<span class="hljs-title function_">create_index</span>(field_name=<span class="hljs-string">&quot;vector&quot;</span>, index_params=default_index)
collection.<span class="hljs-title function_">load</span>()
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-7-Set-up-model-and-data-loader" class="common-anchor-header">الخطوة 7: إعداد النموذج ومُحمّل البيانات</h4><p>بعد بناء فهرس IVF_SQ8، قم بإعداد الشبكة العصبية ومُحمّل البيانات. الشبكة العصبية pytorch resnet-18 المُستخدمة في هذا المثال خالية من الطبقة الأخيرة التي تضغط المتجهات للتصنيف وقد تفقد معلومات قيّمة.</p>
<pre><code translate="no">model = torch.hub.load(<span class="hljs-string">&#x27;pytorch/vision:v0.9.0&#x27;</span>, <span class="hljs-string">&#x27;resnet18&#x27;</span>, pretrained=<span class="hljs-literal">True</span>)
encoder = torch.nn.Sequential(*(<span class="hljs-built_in">list</span>(model.children())[:-<span class="hljs-number">1</span>]))
<button class="copy-code-btn"></button></code></pre>
<p>يجب تعديل مجموعة البيانات ومُحمّل البيانات بحيث تكون قادرة على معالجة الصور مسبقًا وتجميعها مع توفير مسارات ملفات الصور. يمكن القيام بذلك باستخدام أداة تحميل بيانات torchvision المعدلة قليلاً. من أجل المعالجة المسبقة، يجب اقتصاص الصور وتطبيعها نظرًا لأن نموذج resnet-18 يتم تدريبه على حجم ونطاق قيم محددين.</p>
<pre><code translate="no">dataset = ImageFolderWithPaths(data_dir, transform=transforms.Compose([
                                                transforms.Resize(256),
                                                transforms.CenterCrop(224),
                                                transforms.ToTensor(),
                                                transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])]))

dataloader = torch.utils.data.DataLoader(dataset, num_workers=0, batch_si
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-8-Insert-vectors-into-the-collection" class="common-anchor-header">الخطوة 8: إدراج المتجهات في المجموعة</h4><p>بعد إعداد المجموعة، يمكن معالجة الصور وتحميلها في المجموعة التي تم إنشاؤها. يتم أولاً سحب الصور بواسطة أداة تحميل البيانات وتشغيلها من خلال نموذج resnet-18. ثم يتم إدراج تضمينات المتجهات الناتجة في Milvus، والتي تُرجع معرّفًا فريدًا لكل متجه. يتم بعد ذلك إدراج معرّفات المتجهات ومسارات ملفات الصور كأزواج قيمة مفتاح في خادم ريديس.</p>
<pre><code translate="no">steps = <span class="hljs-built_in">len</span>(dataloader)
step = <span class="hljs-number">0</span>
<span class="hljs-keyword">for</span> inputs, labels, paths <span class="hljs-keyword">in</span> dataloader:
    <span class="hljs-keyword">with</span> torch.no_grad():
        output = encoder(inputs).squeeze()
        output = output.numpy()

    mr = collection.insert([output.tolist()])
    ids = mr.primary_keys
    <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(ids)):
        red.<span class="hljs-built_in">set</span>(<span class="hljs-built_in">str</span>(ids[x]), paths[x])
    <span class="hljs-keyword">if</span> step%<span class="hljs-number">5</span> == <span class="hljs-number">0</span>:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Insert Step: &quot;</span> + <span class="hljs-built_in">str</span>(step) + <span class="hljs-string">&quot;/&quot;</span> + <span class="hljs-built_in">str</span>(steps))
    step += <span class="hljs-number">1</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-9-Conduct-a-vector-similarity-search" class="common-anchor-header">الخطوة 9: إجراء بحث عن تشابه المتجهات</h4><p>بمجرد إدراج جميع البيانات في Milvus وRedis، يمكن إجراء بحث تشابه المتجهات الفعلي. في هذا المثال، يتم سحب ثلاث صور تم اختيارها عشوائيًا من خادم Redis لإجراء بحث تشابه المتجهات.</p>
<pre><code translate="no">random_ids = [<span class="hljs-built_in">int</span>(red.randomkey()) <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">3</span>)]
search_images = [x.decode(<span class="hljs-string">&quot;utf-8&quot;</span>) <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> red.mget(random_ids)]
<button class="copy-code-btn"></button></code></pre>
<p>تمر هذه الصور أولاً بنفس المعالجة المسبقة التي تم العثور عليها في الخطوة 7 ثم يتم دفعها من خلال نموذج resnet-18.</p>
<pre><code translate="no">transform_ops = transforms.Compose([
                transforms.Resize(<span class="hljs-number">256</span>),
                transforms.CenterCrop(<span class="hljs-number">224</span>),
                transforms.ToTensor(),
                transforms.Normalize(mean=[<span class="hljs-number">0.485</span>, <span class="hljs-number">0.456</span>, <span class="hljs-number">0.406</span>], std=[<span class="hljs-number">0.229</span>, <span class="hljs-number">0.224</span>, <span class="hljs-number">0.225</span>])])

embeddings = [transform_ops(Image.<span class="hljs-built_in">open</span>(x)) <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> search_images]
embeddings = torch.stack(embeddings, dim=<span class="hljs-number">0</span>)

<span class="hljs-keyword">with</span> torch.no_grad():
    embeddings = encoder(embeddings).squeeze().numpy()
<button class="copy-code-btn"></button></code></pre>
<p>ثم يتم استخدام التضمينات المتجهة الناتجة لإجراء بحث. أولاً، قم بتعيين معلمات البحث، بما في ذلك اسم المجموعة المراد البحث فيها، و nprobe (عدد المجموعات المراد البحث فيها)، و top_k (عدد المتجهات التي تم إرجاعها). في هذا المثال، يجب أن يكون البحث سريعًا جدًا.</p>
<pre><code translate="no">search_params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: 32}}
start = time.time()
results = collection.search(embeddings, <span class="hljs-string">&quot;vector&quot;</span>, param=search_params, <span class="hljs-built_in">limit</span>=3, <span class="hljs-built_in">expr</span>=None)
end = time.time() - start
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-10-Image-search-results" class="common-anchor-header">الخطوة 10: نتائج البحث عن الصور</h4><p>يتم استخدام معرّفات المتجهات التي تم إرجاعها من الاستعلامات للعثور على الصور المقابلة. ثم يتم استخدام Matplotlib لعرض نتائج البحث عن الصور.<br/></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/pic1_c8652c7fae.png" alt="pic1.png" class="doc-image" id="pic1.png" />
   </span> <span class="img-wrapper"> <span>pic1.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/pic2_355b054161.png" alt="pic2.png" class="doc-image" id="pic2.png" /><span>pic2.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/pic3_01780c6aac.png" alt="pic3.png" class="doc-image" id="pic3.png" /><span>pic3.png</span> </span></p>
<p><br/></p>
<h3 id="Learn-how-to-deploy-Milvus-in-different-enviroments" class="common-anchor-header">تعلم كيفية نشر ميلفوس في بيئات مختلفة</h3><p>يحتوي <a href="https://github.com/milvus-io/bootcamp/tree/master/deployments">قسم عمليات النشر</a> في معسكر التمهيد الجديد على جميع المعلومات الخاصة باستخدام ميلفوس في بيئات وإعدادات مختلفة. ويتضمن نشر ميشاردز، واستخدام Kubernetes مع ميلفوس، وموازنة التحميل، والمزيد. تحتوي كل بيئة على دليل مفصل خطوة بخطوة يشرح كيفية تشغيل ميلفوس فيها.</p>
<p><br/></p>
<h3 id="Dont-be-a-stranger" class="common-anchor-header">لا تكن غريباً</h3><ul>
<li>اقرأ <a href="https://zilliz.com/blog">مدونتنا</a></li>
<li>تفاعل مع مجتمعنا مفتوح المصدر على <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>استخدم أو ساهم في Milvus، قاعدة البيانات المتجهة الأكثر شعبية في العالم، على <a href="https://github.com/milvus-io/milvus">Github</a>.</li>
</ul>
