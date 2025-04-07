---
id: >-
  generate-more-creative-and-curated-ghibli-style-images-with-gpt-4o-and-milvus.md
title: توليد المزيد من الصور الإبداعية والمنسقة بأسلوب جيبلي باستخدام GPT-4o وMilvus
author: Lumina Wang
date: 2025-04-01T00:00:00.000Z
desc: >-
  توصيل بياناتك الخاصة مع GPT-4o باستخدام Milvus للحصول على المزيد من مخرجات
  الصور المنسقة
cover: assets.zilliz.com/GPT_4opagephoto_5e934b89e5.png
tag: Engineering
tags: 'GPT-4o, Database, Milvus, Artificial Intelligence, Image Generation'
canonicalUrl: >-
  https://milvus.io/blog/generate-more-creative-and-curated-ghibli-style-images-with-gpt-4o-and-milvus.md
---
<h2 id="Everyone-Became-an-Artist-Overnight-with-GPT-4o" class="common-anchor-header">أصبح الجميع فنانين بين عشية وضحاها مع GPT-4o<button data-href="#Everyone-Became-an-Artist-Overnight-with-GPT-4o" class="anchor-icon" translate="no">
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
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/four_panel_1788f825e3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>صدّق أو لا تصدق، الصورة التي رأيتها للتو كانت من إنشاء الذكاء الاصطناعي - وتحديداً بواسطة GPT-4o الذي تم إصداره حديثاً!</em></p>
<p>عندما أطلق OpenAI خاصية توليد الصور الأصلية في GPT-4o في 26 مارس، لم يكن أحد يتوقع التسونامي الإبداعي الذي تبع ذلك. بين عشية وضحاها، انفجر الإنترنت بين عشية وضحاها بصور على غرار صور Ghibli التي تم إنشاؤها بواسطة الذكاء الاصطناعي - تم تحويل المشاهير والسياسيين والحيوانات الأليفة وحتى المستخدمين أنفسهم إلى شخصيات ساحرة من استوديو جيبلي مع بعض المطالبات البسيطة. لقد كان الطلب هائلاً لدرجة أن سام ألتمان نفسه اضطر إلى "مناشدة" المستخدمين أن يبطئوا من وتيرة عملهم، حيث غرّد على تويتر بأن "وحدات معالجة الرسومات في OpenAI تذوب".</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Ghibli_32e739c2ac.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>مثال على الصور التي تم إنشاؤها بواسطة GPT-4o (رصيد X@جايسون ريد)</p>
<h2 id="Why-GPT-4o-Changes-Everything" class="common-anchor-header">لماذا يغير GPT-4o كل شيء<button data-href="#Why-GPT-4o-Changes-Everything" class="anchor-icon" translate="no">
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
    </button></h2><p>بالنسبة للصناعات الإبداعية، يمثل ذلك نقلة نوعية. يمكن الآن إنجاز المهام التي كانت تتطلب يوماً كاملاً من فريق تصميم كامل في دقائق معدودة. ما يجعل GPT-4o مختلفاً عن مولدات الصور السابقة هو <strong>تناسقه البصري الرائع وواجهته البديهية</strong>. فهو يدعم المحادثات متعددة الأدوار التي تتيح لك تنقيح الصور بإضافة عناصر، أو تعديل النسب، أو تغيير الأنماط، أو حتى تحويل ثنائية الأبعاد إلى ثلاثية الأبعاد - أي وضع مصمم محترف في جيبك.</p>
<p>ما السر وراء أداء GPT-4o المتفوق؟ إنها بنية الانحدار التلقائي. على عكس نماذج الانتشار (مثل الانتشار المستقر) التي تحلل الصور إلى ضوضاء قبل إعادة بنائها، يولّد GPT-4o الصور بالتتابع - رمزاً رمزاً في كل مرة - مع الحفاظ على الوعي السياقي طوال العملية. يفسر هذا الاختلاف المعماري الأساسي سبب إنتاج GPT-4o لنتائج أكثر تماسكاً مع مطالبات أكثر وضوحاً وطبيعية.</p>
<p>ولكن هنا حيث تصبح الأمور مثيرة للاهتمام بالنسبة للمطورين: <strong>يشير عدد متزايد من الدلائل إلى اتجاه رئيسي - نماذج الذكاء الاصطناعي نفسها أصبحت منتجات. وببساطة، فإن معظم المنتجات التي تقوم ببساطة بلف نماذج الذكاء الاصطناعي الكبيرة حول بيانات المجال العام معرضة لخطر التخلف عن الركب.</strong></p>
<p>إن القوة الحقيقية لهذه التطورات تأتي من الجمع بين النماذج الكبيرة ذات الأغراض العامة والبيانات <strong>الخاصة ذات المجال الخاص</strong>. قد يكون هذا المزيج هو استراتيجية البقاء المثلى لمعظم الشركات في عصر النماذج اللغوية الكبيرة. ومع استمرار تطور النماذج الأساسية، فإن الميزة التنافسية الدائمة ستكون من نصيب أولئك الذين يمكنهم دمج مجموعات البيانات الخاصة بهم بفعالية مع أنظمة الذكاء الاصطناعي القوية هذه.</p>
<p>دعنا نستكشف كيفية ربط بياناتك الخاصة مع GPT-4o باستخدام Milvus، وهي قاعدة بيانات متجهة مفتوحة المصدر وعالية الأداء.</p>
<h2 id="Connecting-Your-Private-Data-with-GPT-4o-Using-Milvus-for-More-Curated-Image-Outputs" class="common-anchor-header">ربط بياناتك الخاصة مع GPT-4o باستخدام Milvus للحصول على مخرجات صور أكثر تنظيماً<button data-href="#Connecting-Your-Private-Data-with-GPT-4o-Using-Milvus-for-More-Curated-Image-Outputs" class="anchor-icon" translate="no">
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
    </button></h2><p>قواعد البيانات المتجهة هي التقنية الرئيسية التي تربط بياناتك الخاصة بنماذج الذكاء الاصطناعي. فهي تعمل من خلال تحويل المحتوى الخاص بك - سواءً كان صورًا أو نصوصًا أو صوتًا - إلى تمثيلات رياضية (متجهات) تلتقط معانيها وخصائصها. يسمح ذلك بإجراء بحث دلالي يعتمد على التشابه بدلاً من الكلمات المفتاحية فقط.</p>
<p>ميلفوس، باعتباره قاعدة بيانات متجهات رائدة مفتوحة المصدر، مناسب بشكل خاص للتواصل مع أدوات الذكاء الاصطناعي التوليدي مثل GPT-4o. إليك كيف استخدمتها لحل تحدٍ شخصي.</p>
<h3 id="Background" class="common-anchor-header">الخلفية</h3><p>في أحد الأيام، خطرت لي هذه الفكرة الرائعة - تحويل كل شقاوة كلبي كولا، إلى شريط هزلي. لكن كانت هناك مشكلة: كيف يمكنني التدقيق في عشرات الآلاف من الصور من العمل والرحلات ومغامرات الطعام للعثور على لحظات كولا المؤذية؟</p>
<p>الجواب؟ استيراد جميع صوري إلى Milvus وإجراء بحث عن الصور.</p>
<p>لنستعرض التنفيذ خطوة بخطوة.</p>
<h4 id="Dependencies-and-Environment" class="common-anchor-header">التبعيات والبيئة</h4><p>أولاً، تحتاج إلى تجهيز بيئتك بالحزم المناسبة:</p>
<pre><code translate="no">pip install pymilvus --upgrade
pip install torch numpy scikit-learn pillow
<button class="copy-code-btn"></button></code></pre>
<h4 id="Prepare-the-Data" class="common-anchor-header">إعداد البيانات</h4><p>سأستخدم مكتبة الصور الخاصة بي، والتي تحتوي على حوالي 30,000 صورة، كمجموعة بيانات في هذا الدليل. إذا لم يكن لديك أي مجموعة بيانات في متناول اليد، قم بتنزيل مجموعة بيانات نموذجية من Milvus وقم بفك ضغطها:</p>
<pre><code translate="no">!wget https://github.com/milvus-io/pymilvus-assets/releases/download/imagedata/reverse_image_search.<span class="hljs-built_in">zip</span>
!unzip -q -o reverse_image_search.<span class="hljs-built_in">zip</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Define-the-Feature-Extractor" class="common-anchor-header">تحديد مستخرج الميزات</h4><p>سنستخدم وضع ResNet-50 من مكتبة <code translate="no">timm</code> لاستخراج متجهات التضمين من صورنا. تم تدريب هذا النموذج على ملايين الصور ويمكنه استخراج ميزات ذات معنى تمثل المحتوى المرئي.</p>
<pre><code translate="no">    <span class="hljs-keyword">import</span> torch
    <span class="hljs-keyword">from</span> PIL <span class="hljs-keyword">import</span> Image
    <span class="hljs-keyword">import</span> timm
    <span class="hljs-keyword">from</span> sklearn.preprocessing <span class="hljs-keyword">import</span> normalize
    <span class="hljs-keyword">from</span> timm.data <span class="hljs-keyword">import</span> resolve_data_config
    <span class="hljs-keyword">from</span> timm.data.transforms_factory <span class="hljs-keyword">import</span> create_transform
    <span class="hljs-keyword">class</span> <span class="hljs-title class_">FeatureExtractor</span>:
        <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self, modelname</span>):
            <span class="hljs-comment"># Load the pre-trained model</span>
            <span class="hljs-variable language_">self</span>.model = timm.create_model(
                modelname, pretrained=<span class="hljs-literal">True</span>, num_classes=<span class="hljs-number">0</span>, global_pool=<span class="hljs-string">&quot;avg&quot;</span>
            )
            <span class="hljs-variable language_">self</span>.model.<span class="hljs-built_in">eval</span>()
            <span class="hljs-comment"># Get the input size required by the model</span>
            <span class="hljs-variable language_">self</span>.input_size = <span class="hljs-variable language_">self</span>.model.default_cfg[<span class="hljs-string">&quot;input_size&quot;</span>]
            config = resolve_data_config({}, model=modelname)
            <span class="hljs-comment"># Get the preprocessing function provided by TIMM for the model</span>
            <span class="hljs-variable language_">self</span>.preprocess = create_transform(**config)
        <span class="hljs-keyword">def</span> <span class="hljs-title function_">__call__</span>(<span class="hljs-params">self, imagepath</span>):
            <span class="hljs-comment"># Preprocess the input image</span>
            input_image = Image.<span class="hljs-built_in">open</span>(imagepath).convert(<span class="hljs-string">&quot;RGB&quot;</span>)  <span class="hljs-comment"># Convert to RGB if needed</span>
            input_image = <span class="hljs-variable language_">self</span>.preprocess(input_image)
            <span class="hljs-comment"># Convert the image to a PyTorch tensor and add a batch dimension</span>
            input_tensor = input_image.unsqueeze(<span class="hljs-number">0</span>)
            <span class="hljs-comment"># Perform inference</span>
            <span class="hljs-keyword">with</span> torch.no_grad():
                output = <span class="hljs-variable language_">self</span>.model(input_tensor)
            <span class="hljs-comment"># Extract the feature vector</span>
            feature_vector = output.squeeze().numpy()
            <span class="hljs-keyword">return</span> normalize(feature_vector.reshape(<span class="hljs-number">1</span>, -<span class="hljs-number">1</span>), norm=<span class="hljs-string">&quot;l2&quot;</span>).flatten()
<button class="copy-code-btn"></button></code></pre>
<h4 id="Create-a-Milvus-Collection" class="common-anchor-header">إنشاء مجموعة ميلفوس</h4><p>بعد ذلك، سننشئ مجموعة Milvus لتخزين تضمينات الصور لدينا. فكر في هذا كقاعدة بيانات متخصصة مصممة خصيصًا للبحث عن تشابه المتجهات:</p>
<pre><code translate="no">    <span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
    client = MilvusClient(uri=<span class="hljs-string">&quot;example.db&quot;</span>)
    <span class="hljs-keyword">if</span> client.has_collection(collection_name=<span class="hljs-string">&quot;image_embeddings&quot;</span>):
        client.drop_collection(collection_name=<span class="hljs-string">&quot;image_embeddings&quot;</span>)

    client.create_collection(
        collection_name=<span class="hljs-string">&quot;image_embeddings&quot;</span>,
        vector_field_name=<span class="hljs-string">&quot;vector&quot;</span>,
        dimension=<span class="hljs-number">2048</span>,
        auto_id=<span class="hljs-literal">True</span>,
        enable_dynamic_field=<span class="hljs-literal">True</span>,
        metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    )
<button class="copy-code-btn"></button></code></pre>
<p><strong>ملاحظات حول معلمات MilvusClient:</strong></p>
<ul>
<li><p><strong>الإعداد المحلي:</strong> إن استخدام ملف محلي (على سبيل المثال، <code translate="no">./milvus.db</code>) هو أسهل طريقة للبدء - سوف يتعامل ميلفوس لايت مع جميع بياناتك.</p></li>
<li><p><strong>التوسعة:</strong> بالنسبة لمجموعات البيانات الكبيرة، قم بإعداد خادم Milvus قوي باستخدام Docker أو Kubernetes واستخدم URI الخاص به (على سبيل المثال، <code translate="no">http://localhost:19530</code>).</p></li>
<li><p><strong>خيار السحابة:</strong> إذا كنت في خدمة Zilliz Cloud (الخدمة المُدارة بالكامل من Milvus)، اضبط URI والرمز المميز لمطابقة نقطة النهاية العامة ومفتاح واجهة برمجة التطبيقات.</p></li>
</ul>
<h4 id="Insert-Image-Embeddings-into-Milvus" class="common-anchor-header">إدراج تضمين الصور في ميلفوس</h4><p>تأتي الآن عملية تحليل كل صورة وتخزين تمثيلها المتجه. قد تستغرق هذه الخطوة بعض الوقت اعتمادًا على حجم مجموعة البيانات الخاصة بك، ولكنها عملية لمرة واحدة:</p>
<pre><code translate="no">    <span class="hljs-keyword">import</span> os
    <span class="hljs-keyword">from</span> some_module <span class="hljs-keyword">import</span> FeatureExtractor  <span class="hljs-comment"># Replace with your feature extraction module</span>
    extractor = FeatureExtractor(<span class="hljs-string">&quot;resnet50&quot;</span>)
    root = <span class="hljs-string">&quot;./train&quot;</span>  <span class="hljs-comment"># Path to your dataset</span>
    insert = <span class="hljs-literal">True</span>
    <span class="hljs-keyword">if</span> insert:
        <span class="hljs-keyword">for</span> dirpath, _, filenames <span class="hljs-keyword">in</span> os.walk(root):
            <span class="hljs-keyword">for</span> filename <span class="hljs-keyword">in</span> filenames:
                <span class="hljs-keyword">if</span> filename.endswith(<span class="hljs-string">&quot;.jpeg&quot;</span>):
                    filepath = os.path.join(dirpath, filename)
                    image_embedding = extractor(filepath)
                    client.insert(
                        <span class="hljs-string">&quot;image_embeddings&quot;</span>,
                        {<span class="hljs-string">&quot;vector&quot;</span>: image_embedding, <span class="hljs-string">&quot;filename&quot;</span>: filepath},
                    )
<button class="copy-code-btn"></button></code></pre>
<h4 id="Conduct-an-Image-Search" class="common-anchor-header">إجراء بحث عن الصور</h4><p>بعد ملء قاعدة البيانات الخاصة بنا، يمكننا الآن البحث عن الصور المتشابهة. هذا هو المكان الذي يحدث فيه السحر - يمكننا العثور على صور متشابهة بصريًا باستخدام التشابه المتجه:</p>
<pre><code translate="no">    <span class="hljs-keyword">from</span> IPython.display <span class="hljs-keyword">import</span> display
    <span class="hljs-keyword">from</span> PIL <span class="hljs-keyword">import</span> Image
    query_image = <span class="hljs-string">&quot;./search-image.jpeg&quot;</span>  <span class="hljs-comment"># The image you want to search with</span>
    results = client.search(
        <span class="hljs-string">&quot;image_embeddings&quot;</span>,
        data=[extractor(query_image)],
        output_fields=[<span class="hljs-string">&quot;filename&quot;</span>],
        search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
        limit=<span class="hljs-number">6</span>,  <span class="hljs-comment"># Top-k results</span>
    )
    images = []
    <span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results:
        <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> result[:<span class="hljs-number">10</span>]:
            filename = hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;filename&quot;</span>]
            img = Image.<span class="hljs-built_in">open</span>(filename)
            img = img.resize((<span class="hljs-number">150</span>, <span class="hljs-number">150</span>))
            images.append(img)
    width = <span class="hljs-number">150</span> * <span class="hljs-number">3</span>
    height = <span class="hljs-number">150</span> * <span class="hljs-number">2</span>
    concatenated_image = Image.new(<span class="hljs-string">&quot;RGB&quot;</span>, (width, height))
    <span class="hljs-keyword">for</span> idx, img <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(images):
        x = idx % <span class="hljs-number">5</span>
        y = idx // <span class="hljs-number">5</span>
        concatenated_image.paste(img, (x * <span class="hljs-number">150</span>, y * <span class="hljs-number">150</span>))

    display(<span class="hljs-string">&quot;query&quot;</span>)
    display(Image.<span class="hljs-built_in">open</span>(query_image).resize((<span class="hljs-number">150</span>, <span class="hljs-number">150</span>)))
    display(<span class="hljs-string">&quot;results&quot;</span>)
    display(concatenated_image)
<button class="copy-code-btn"></button></code></pre>
<p><strong>تظهر الصور التي تم إرجاعها على النحو التالي:</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_1_8d4e88c6dd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Combine-Vector-Search-with-GPT-4o-Generating-Ghibli-Style-Images-with-Images-Returned-by-Milvus" class="common-anchor-header">دمج البحث المتجه مع GPT-4o: توليد صور على نمط جيبلي مع الصور التي تم إرجاعها بواسطة ميلفوس</h3><p>الآن يأتي الجزء المثير: استخدام نتائج بحثنا عن الصور كمدخلات لـ GPT-4o لتوليد محتوى إبداعي. في حالتي، أردت إنشاء شرائط مصورة تظهر كلبي كولا بناءً على الصور التي التقطتها.</p>
<p>سير العمل بسيط ولكنه قوي:</p>
<ol>
<li><p>استخدم البحث المتجه للعثور على صور كولا ذات الصلة من مجموعتي</p></li>
<li><p>تلقيم هذه الصور إلى GPT-4o بمطالبات إبداعية</p></li>
<li><p>توليد رسوم هزلية فريدة بناءً على الإلهام البصري</p></li>
</ol>
<p>إليك بعض الأمثلة على ما يمكن أن ينتجه هذا المزيج:</p>
<p><strong>المطالبات التي أستخدمها</strong></p>
<ul>
<li><p><em>"أنشئ شريطًا هزليًا كوميديًا مضحكًا مكونًا من أربع لوحات بالألوان الكاملة يظهر فيه كلب من فصيلة بوردر كولي تم ضبطه يقضم فأرًا - مع لحظة محرجة عندما يكتشف المالك ذلك."<br><em>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Screenshot_2025_04_02_at_11_34_43_1d7141eef3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</em></em></p></li>
<li><p><em>"ارسم قصة مصورة يظهر فيها هذا الكلب وهو يرتدي زيًا ظريفًا."<br><em>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/cutedog_6fdb1e9c79.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</em></em></p></li>
<li><p><em>"باستخدام هذا الكلب كنموذج، ارسم قصة مصورة له وهو يذهب إلى مدرسة هوجورتس للسحر والشعوذة."<br><em>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Screenshot_2025_04_02_at_11_44_00_ce932cd035.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</em></em></p></li>
</ul>
<h3 id="A-Few-Quick-Tips-from-My-Experience-of-Image-Generation" class="common-anchor-header">بعض النصائح السريعة من تجربتي في توليد الصور:</h3><ol>
<li><p><strong>اجعل الأمر بسيطًا</strong>: على عكس نماذج الانتشار الصعبة تلك، فإن GPT-4o يعمل بشكل أفضل مع المطالبات المباشرة. لقد وجدت نفسي أكتب مطالبات أقصر وأقصر كلما تقدمت في العمل، وأحصل على نتائج أفضل.</p></li>
<li><p><strong>اللغة الإنجليزية تعمل بشكل أفضل</strong>: حاولت كتابة المطالبات باللغة الصينية لبعض القصص المصورة، لكن النتائج لم تكن رائعة. انتهى بي الأمر بكتابة مطالباتي باللغة الإنجليزية ثم ترجمة القصص المصورة النهائية عند الحاجة.</p></li>
<li><p><strong>ليست جيدة لجيل الفيديو</strong>: لا ترفع آمالك كثيرًا مع Sora حتى الآن - لا يزال أمام مقاطع الفيديو التي تم إنشاؤها بواسطة الذكاء الاصطناعي طريق طويل عندما يتعلق الأمر بالحركة السلسة وخطوط القصة المتماسكة.</p></li>
</ol>
<h2 id="Whats-Next-My-Perspective-and-Open-for-Discussion" class="common-anchor-header">ما التالي؟ وجهة نظري ومفتوحة للنقاش<button data-href="#Whats-Next-My-Perspective-and-Open-for-Discussion" class="anchor-icon" translate="no">
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
    </button></h2><p>مع تصدر الصور التي تم إنشاؤها بالذكاء الاصطناعي المشهد، فإن نظرة سريعة على الإصدارات الرئيسية لـ OpenAI على مدار الأشهر الستة الماضية تُظهر نمطاً واضحاً: سواء كانت GPTs لأسواق التطبيقات، أو DeepResearch لإنشاء التقارير، أو GPT-4o لإنشاء الصور التخاطبية، أو Sora لسحر الفيديو - نماذج الذكاء الاصطناعي الكبيرة تخرج من وراء الستار إلى دائرة الضوء. فما كان في السابق تقنية تجريبية أصبح الآن في طور النضج ليتحول إلى منتجات حقيقية قابلة للاستخدام.</p>
<p>مع قبول GPT-4o والنماذج المماثلة على نطاق واسع، تتجه معظم عمليات سير العمل والوكلاء الأذكياء القائمة على الانتشار المستقر نحو التقادم. ومع ذلك، تظل القيمة التي لا يمكن الاستغناء عنها للبيانات الخاصة والبصيرة البشرية قوية. على سبيل المثال، على الرغم من أن الذكاء الاصطناعي لن يحل محل الوكالات الإبداعية بشكل كامل، إلا أن دمج قاعدة بيانات ميلفوس المتجهة مع نماذج GPT يمكّن الوكالات من توليد أفكار جديدة ومبتكرة مستوحاة من نجاحاتها السابقة بسرعة. يمكن لمنصات التجارة الإلكترونية تصميم ملابس مخصصة بناءً على اتجاهات التسوق، ويمكن للمؤسسات الأكاديمية إنشاء صور فورية للأوراق البحثية.</p>
<p>لقد بدأ عصر المنتجات المدعومة بنماذج الذكاء الاصطناعي، وقد بدأ للتو السباق على التنقيب عن منجم ذهب البيانات. بالنسبة للمطورين والشركات على حد سواء، الرسالة واضحة: ادمج بياناتك الفريدة مع هذه النماذج القوية أو خاطر بالتخلف عن الركب.</p>
