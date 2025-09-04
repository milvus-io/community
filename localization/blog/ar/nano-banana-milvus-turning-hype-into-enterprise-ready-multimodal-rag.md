---
id: nano-banana-milvus-turning-hype-into-enterprise-ready-multimodal-rag.md
title: 'نانو بانانا + ميلفوس: تحويل الضجيج إلى نظام RAG متعدد الوسائط جاهز للمؤسسات'
author: Lumina Wang
date: 2025-09-04T00:00:00.000Z
cover: assets.zilliz.com/me_with_a_dress_1_1_084defa237.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, mcp, AI Agents, nano banana'
meta_keywords: 'Vibe coding, nano banana, Milvus, model context protocol'
meta_title: |
  Nano Banana + Milvus: Turning Hype into Enterprise-Ready Multimodal RAG
desc: >-
  سنستعرض كيفية الجمع بين Nano Banana وMilvus لبناء نظام RAG متعدد الوسائط جاهز
  للمؤسسات - ولماذا يفتح هذا الاقتران الباب أمام الموجة التالية من تطبيقات
  الذكاء الاصطناعي.
origin: >-
  https://milvus.io/blog/nano-banana-milvus-turning-hype-into-enterprise-ready-multimodal-rag.md
---
<p>تنتشر نانو موزة النانو على وسائل التواصل الاجتماعي الآن ولسبب وجيه! ربما شاهدت الصور التي يولدها أو حتى جربته بنفسك. إنه أحدث نموذج لتوليد الصور يقوم بتحويل النص العادي إلى لقطات مجسمة قابلة للتحصيل بدقة وسرعة مذهلة.</p>
<p>اكتب شيئاً مثل <em>"بدّل قبعة وتنورة إيلون"،</em> وفي غضون 16 ثانية تقريباً، ستحصل على نتيجة واقعية: قميص مطوي وألوان ممزوجة وإكسسوارات في مكانها - بدون تعديلات يدوية. لا تأخير.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/beach_side_668179b830.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>لم أستطع مقاومة اختباره أيضًا. كان طلبي هو</p>
<p><em>"استخدم نموذج Nano Banana لتصميم مجسم تجاري بمقياس 1/7 للشخصية الموجودة في الرسم التوضيحي، بأسلوب وبيئة واقعيين. ضع المجسم على مكتب كمبيوتر، باستخدام قاعدة دائرية من الأكريليك الشفاف بدون أي نص. على شاشة الكمبيوتر، اعرض عملية نمذجة ZBrush للشخصية على شاشة الكمبيوتر. بجانب الشاشة، ضع صندوق تغليف ألعاب على غرار بانداي مطبوع عليه العمل الفني الأصلي."</em></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/me_with_a_dress_506a0ebf39.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>أذهلتني النتيجة - بدت لي النتيجة وكأنها نموذج أولي للإنتاج مباشرة من كشك المؤتمرات.</p>
<p>ليس من المستغرب أن تجد الفرق بالفعل حالات استخدام جادة لها. يقوم أحد عملائنا، وهي منصة ترفيهية على الهاتف المحمول تتميز بلعبة gacha ولعبة التلبيس، بتطوير ميزة تسمح للاعبين بتحميل الصور وتزيين صورهم الرمزية على الفور بإكسسوارات داخل اللعبة. تقوم العلامات التجارية للتجارة الإلكترونية بتجربة "التصوير مرة واحدة، وإعادة الاستخدام إلى الأبد": التقاط صورة نموذج أساسي ثم توليد أشكال لا نهاية لها من الملابس وتسريحة الشعر باستخدام الذكاء الاصطناعي، بدلاً من إعادة التصوير 20 مرة في الاستوديو.</p>
<p>ولكن هنا تكمن المشكلة - توليد الصور وحده لا يحل المشكلة بأكملها. تحتاج هذه الأنظمة أيضًا إلى <strong>الاسترجاع الذكي</strong>: القدرة على العثور الفوري على الملابس والدعائم والعناصر البصرية المناسبة من مكتبات الوسائط الضخمة غير المنظمة. بدون ذلك، فإن النموذج التوليدي هو تخمين في الظلام. ما تحتاجه الشركات حقًا هو <strong>نظام RAG متعدد الوسائط (RAG) متعدد الوسائط (الاسترجاع-التوليد المعزز) - حيث</strong>يتولى نانو بانانا الإبداع، وتتولى قاعدة بيانات متجهة قوية التعامل مع السياق.</p>
<p>وهنا يأتي دور <strong>"ميلفوس</strong> ". كقاعدة بيانات متجهة مفتوحة المصدر، يمكن لـ Milvus الفهرسة والبحث عبر مليارات التضمينات - الصور والنصوص والصوت وغيرها. وبالاقتران مع Nano Banana، يصبح العمود الفقري لخط أنابيب RAG متعدد الوسائط جاهز للإنتاج: البحث والمطابقة والتوليد على نطاق المؤسسة.</p>
<p>في بقية هذه المدونة، سنستعرض كيفية الجمع بين Nano Banana وMilvus لبناء نظام RAG متعدد الوسائط جاهز للمؤسسات - ولماذا يفتح هذا الاقتران الموجة التالية من تطبيقات الذكاء الاصطناعي.</p>
<h2 id="Building-a-Text-to-Image-Retrieval-Engine" class="common-anchor-header">بناء محرك استرجاع تحويل النص إلى صورة<button data-href="#Building-a-Text-to-Image-Retrieval-Engine" class="anchor-icon" translate="no">
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
    </button></h2><p>بالنسبة للعلامات التجارية للسلع الاستهلاكية سريعة الحركة واستوديوهات الألعاب والشركات الإعلامية، فإن عنق الزجاجة في توليد الصور بالذكاء الاصطناعي ليس النموذج، بل الفوضى.</p>
<p>فأرشيفاتهم عبارة عن مستنقع من البيانات غير المنظمة، بما في ذلك لقطات المنتجات، وأصول الشخصيات، ومقاطع الفيديو الترويجية، وعروض الأزياء. وعندما تحتاج إلى العثور على "العباءة الحمراء من إصدار الموسم الماضي من Lunar،" فحظاً موفقاً - لا يمكن للبحث التقليدي القائم على الكلمات الرئيسية التعامل مع ذلك.</p>
<p>الحل؟ بناء <strong>نظام استرجاع من نص إلى صورة</strong>.</p>
<p>إليك الطريقة: استخدم <a href="https://openai.com/research/clip?utm_source=chatgpt.com">CLIP</a> لتضمين بيانات النص والصورة في متجهات. قم بتخزين هذه المتجهات في <strong>Milvus،</strong> قاعدة بيانات المتجهات مفتوحة المصدر المصممة خصيصاً للبحث عن التشابه. ثم، عندما يكتب المستخدم وصفاً ("رداء حريري أحمر مع زخرفة ذهبية")، تضغط على قاعدة البيانات وتعيد أفضل 3 صور متشابهة دلالياً.</p>
<p>إنه سريع. إنه قابل للتطوير. ويحول مكتبة الوسائط الفوضوية إلى بنك أصول منظم وقابل للاستعلام.</p>
<p>إليك كيفية إنشائه:</p>
<p>تثبيت التبعيات</p>
<pre><code translate="no"><span class="hljs-comment"># Install necessary packages</span>
%pip install --upgrade pymilvus pillow matplotlib
%pip install git+https://github.com/openai/CLIP.git
<button class="copy-code-btn"></button></code></pre>
<p>استيراد المكتبات الضرورية</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> clip
<span class="hljs-keyword">import</span> torch
<span class="hljs-keyword">from</span> PIL <span class="hljs-keyword">import</span> Image
<span class="hljs-keyword">import</span> matplotlib.pyplot <span class="hljs-keyword">as</span> plt
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob
<span class="hljs-keyword">import</span> math

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;All libraries imported successfully!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>تهيئة عميل ميلفوس</p>
<pre><code translate="no"><span class="hljs-comment"># Initialize Milvus client</span>
milvus_client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>,token=<span class="hljs-string">&quot;root:Miluvs&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Milvus client initialized successfully!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>تحميل نموذج CLIP</p>
<pre><code translate="no"><span class="hljs-comment"># Load CLIP model</span>
model_name = <span class="hljs-string">&quot;ViT-B/32&quot;</span>
device = <span class="hljs-string">&quot;cuda&quot;</span> <span class="hljs-keyword">if</span> torch.cuda.is_available() <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;cpu&quot;</span>
model, preprocess = clip.load(model_name, device=device)
model.<span class="hljs-built_in">eval</span>()

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;CLIP model &#x27;<span class="hljs-subst">{model_name}</span>&#x27; loaded successfully, running on device: <span class="hljs-subst">{device}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Model input resolution: <span class="hljs-subst">{model.visual.input_resolution}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Context length: <span class="hljs-subst">{model.context_length}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Vocabulary size: <span class="hljs-subst">{model.vocab_size}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>نتيجة الإخراج</p>
<pre><code translate="no"><span class="hljs-variable constant_">CLIP</span> model <span class="hljs-string">`ViT-B/32`</span> loaded successfully, running <span class="hljs-attr">on</span>: cpu
 <span class="hljs-title class_">Model</span> input <span class="hljs-attr">resolution</span>: <span class="hljs-number">224</span>
 <span class="hljs-title class_">Context</span> <span class="hljs-attr">length</span>: <span class="hljs-number">77</span>
 <span class="hljs-title class_">Vocabulary</span> <span class="hljs-attr">size</span>: <span class="hljs-number">49</span>,<span class="hljs-number">408</span>
<button class="copy-code-btn"></button></code></pre>
<p>تحديد وظائف استخراج الميزات</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">encode_image</span>(<span class="hljs-params">image_path</span>):
    <span class="hljs-string">&quot;&quot;&quot;Encode image into normalized feature vector&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        image = preprocess(Image.<span class="hljs-built_in">open</span>(image_path)).unsqueeze(<span class="hljs-number">0</span>).to(device)
        
        <span class="hljs-keyword">with</span> torch.no_grad():
            image_features = model.encode_image(image)
            image_features /= image_features.norm(dim=-<span class="hljs-number">1</span>, keepdim=<span class="hljs-literal">True</span>)  <span class="hljs-comment"># Normalize</span>
        
        <span class="hljs-keyword">return</span> image_features.squeeze().cpu().tolist()
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Error processing image <span class="hljs-subst">{image_path}</span>: <span class="hljs-subst">{e}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-literal">None</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">encode_text</span>(<span class="hljs-params">text</span>):
    <span class="hljs-string">&quot;&quot;&quot;Encode text into normalized feature vector&quot;&quot;&quot;</span>
    text_tokens = clip.tokenize([text]).to(device)
    
    <span class="hljs-keyword">with</span> torch.no_grad():
        text_features = model.encode_text(text_tokens)
        text_features /= text_features.norm(dim=-<span class="hljs-number">1</span>, keepdim=<span class="hljs-literal">True</span>)  <span class="hljs-comment"># Normalize</span>
    
    <span class="hljs-keyword">return</span> text_features.squeeze().cpu().tolist()

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Feature extraction functions defined successfully!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>إنشاء مجموعة ميلفوس</p>
<pre><code translate="no">collection_name = <span class="hljs-string">&quot;production_image_collection&quot;</span>
<span class="hljs-comment"># If collection already exists, delete it</span>
<span class="hljs-keyword">if</span> milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Existing collection deleted: <span class="hljs-subst">{collection_name}</span>&quot;</span>)

<span class="hljs-comment"># Create new collection</span>
milvus_client.create_collection(
    collection_name=collection_name,
    dimension=<span class="hljs-number">512</span>,  <span class="hljs-comment"># CLIP ViT-B/32 embedding dimension</span>
    auto_id=<span class="hljs-literal">True</span>,  <span class="hljs-comment"># Auto-generate ID</span>
    enable_dynamic_field=<span class="hljs-literal">True</span>,  <span class="hljs-comment"># Enable dynamic fields</span>
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>  <span class="hljs-comment"># Use cosine similarity</span>
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{collection_name}</span>&#x27; created successfully!&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection info: <span class="hljs-subst">{milvus_client.describe_collection(collection_name)}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>ناتج نجاح إنشاء المجموعة:</p>
<pre><code translate="no">Existing collection deleted: production_image_collection
Collection <span class="hljs-string">&#x27;production_image_collection&#x27;</span> created successfully!
Collection info: {<span class="hljs-string">&#x27;collection_name&#x27;</span>: <span class="hljs-string">&#x27;production_image_collection&#x27;</span>, <span class="hljs-string">&#x27;auto_id&#x27;</span>: <span class="hljs-literal">True</span>, <span class="hljs-string">&#x27;num_shards&#x27;</span>: <span class="hljs-number">1</span>, <span class="hljs-string">&#x27;description&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>, <span class="hljs-string">&#x27;fields&#x27;</span>: [{<span class="hljs-string">&#x27;field_id&#x27;</span>: <span class="hljs-number">100</span>, <span class="hljs-string">&#x27;name&#x27;</span>: <span class="hljs-string">&#x27;id&#x27;</span>, <span class="hljs-string">&#x27;description&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>, <span class="hljs-string">&#x27;type&#x27;</span>: &lt;DataType.INT64: <span class="hljs-number">5</span>&gt;, <span class="hljs-string">&#x27;params&#x27;</span>: {}, <span class="hljs-string">&#x27;auto_id&#x27;</span>: <span class="hljs-literal">True</span>, <span class="hljs-string">&#x27;is_primary&#x27;</span>: <span class="hljs-literal">True</span>}, {<span class="hljs-string">&#x27;field_id&#x27;</span>: <span class="hljs-number">101</span>, <span class="hljs-string">&#x27;name&#x27;</span>: <span class="hljs-string">&#x27;vector&#x27;</span>, <span class="hljs-string">&#x27;description&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>, <span class="hljs-string">&#x27;type&#x27;</span>: &lt;DataType.FLOAT_VECTOR: <span class="hljs-number">101</span>&gt;, <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;dim&#x27;</span>: <span class="hljs-number">512</span>}}, {<span class="hljs-string">&#x27;field_id&#x27;</span>: <span class="hljs-number">102</span>, <span class="hljs-string">&#x27;name&#x27;</span>: <span class="hljs-string">&#x27;function&#x27;</span>: [], <span class="hljs-string">&#x27;aliases&#x27;</span>: [], <span class="hljs-string">&#x27;collection_id&#x27;</span>: <span class="hljs-number">460508990706033544</span>, <span class="hljs-string">&#x27;consistency_level&#x27;</span>: <span class="hljs-number">2</span>, <span class="hljs-string">&#x27;properties&#x27;</span>: {}, <span class="hljs-string">&#x27;num_partitions&#x27;</span>: <span class="hljs-number">1</span>, <span class="hljs-string">&#x27;enable_dynamic_field&#x27;</span>: <span class="hljs-literal">True</span>, <span class="hljs-string">&#x27;created_timestamp&#x27;</span>: <span class="hljs-number">460511723827494913</span>, <span class="hljs-string">&#x27;updated_timestamp&#x27;</span>: <span class="hljs-number">460511723827494913</span>}
<button class="copy-code-btn"></button></code></pre>
<p>معالجة الصور وإدراجها</p>
<pre><code translate="no"><span class="hljs-comment"># Set image directory path</span>
image_dir = <span class="hljs-string">&quot;./production_image&quot;</span>
raw_data = []

<span class="hljs-comment"># Get all supported image formats</span>
image_extensions = [<span class="hljs-string">&#x27;*.jpg&#x27;</span>, <span class="hljs-string">&#x27;*.jpeg&#x27;</span>, <span class="hljs-string">&#x27;*.png&#x27;</span>, <span class="hljs-string">&#x27;*.JPEG&#x27;</span>, <span class="hljs-string">&#x27;*.JPG&#x27;</span>, <span class="hljs-string">&#x27;*.PNG&#x27;</span>]
image_paths = []

<span class="hljs-keyword">for</span> ext <span class="hljs-keyword">in</span> image_extensions:
    image_paths.extend(glob(os.path.join(image_dir, ext)))

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Found <span class="hljs-subst">{<span class="hljs-built_in">len</span>(image_paths)}</span> images in <span class="hljs-subst">{image_dir}</span>&quot;</span>)

<span class="hljs-comment"># Process images and generate embeddings</span>
successful_count = <span class="hljs-number">0</span>
<span class="hljs-keyword">for</span> i, image_path <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(image_paths):
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Processing progress: <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>/<span class="hljs-subst">{<span class="hljs-built_in">len</span>(image_paths)}</span> - <span class="hljs-subst">{os.path.basename(image_path)}</span>&quot;</span>)
    
    image_embedding = encode_image(image_path)
    <span class="hljs-keyword">if</span> image_embedding <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> <span class="hljs-literal">None</span>:
        image_dict = {
            <span class="hljs-string">&quot;vector&quot;</span>: image_embedding,
            <span class="hljs-string">&quot;filepath&quot;</span>: image_path,
            <span class="hljs-string">&quot;filename&quot;</span>: os.path.basename(image_path)
        }
        raw_data.append(image_dict)
        successful_count += <span class="hljs-number">1</span>

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Successfully processed <span class="hljs-subst">{successful_count}</span> images&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>مخرجات تقدم معالجة الصور:</p>
<pre><code translate="no">Found 50 images <span class="hljs-keyword">in</span> ./production_image
Processing progress: 1/50 - download (5).jpeg
Processing progress: 2/50 - images (2).jpeg
Processing progress: 3/50 - download (23).jpeg
Processing progress: 4/50 - download.jpeg
Processing progress: 5/50 - images (14).jpeg
Processing progress: 6/50 - images (16).jpeg
…
Processing progress: 44/50 - download (10).jpeg
Processing progress: 45/50 - images (18).jpeg
Processing progress: 46/50 - download (9).jpeg
Processing progress: 47/50 - download (12).jpeg
Processing progress: 48/50 - images (1).jpeg
Processing progress: 49/50 - download.png
Processing progress: 50/50 - images.png
Successfully processed 50 images
<button class="copy-code-btn"></button></code></pre>
<p>إدراج البيانات في ميلفوس</p>
<pre><code translate="no"><span class="hljs-comment"># Insert data into Milvus</span>
<span class="hljs-keyword">if</span> raw_data:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Inserting data into Milvus...&quot;</span>)
    insert_result = milvus_client.insert(collection_name=collection_name, data=raw_data)
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Successfully inserted <span class="hljs-subst">{insert_result[<span class="hljs-string">&#x27;insert_count&#x27;</span>]}</span> images into Milvus&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Sample inserted IDs: <span class="hljs-subst">{insert_result[<span class="hljs-string">&#x27;ids&#x27;</span>][:<span class="hljs-number">5</span>]}</span>...&quot;</span>)  <span class="hljs-comment"># Show first 5 IDs</span>
<span class="hljs-keyword">else</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;No successfully processed image data to insert&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>تحديد وظائف البحث والتصور</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">search_images_by_text</span>(<span class="hljs-params">query_text, top_k=<span class="hljs-number">3</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Search images based on text query&quot;&quot;&quot;</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Search query: &#x27;<span class="hljs-subst">{query_text}</span>&#x27;&quot;</span>)
    
    <span class="hljs-comment"># Encode query text</span>
    query_embedding = encode_text(query_text)
    
    <span class="hljs-comment"># Search in Milvus</span>
    search_results = milvus_client.search(
        collection_name=collection_name,
        data=[query_embedding],
        limit=top_k,
        output_fields=[<span class="hljs-string">&quot;filepath&quot;</span>, <span class="hljs-string">&quot;filename&quot;</span>]
    )
    
    <span class="hljs-keyword">return</span> search_results[<span class="hljs-number">0</span>]


<span class="hljs-keyword">def</span> <span class="hljs-title function_">visualize_search_results</span>(<span class="hljs-params">query_text, results</span>):
    <span class="hljs-string">&quot;&quot;&quot;Visualize search results&quot;&quot;&quot;</span>
    num_images = <span class="hljs-built_in">len</span>(results)
    
    <span class="hljs-keyword">if</span> num_images == <span class="hljs-number">0</span>:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;No matching images found&quot;</span>)
        <span class="hljs-keyword">return</span>
    
    <span class="hljs-comment"># Create subplots</span>
    fig, axes = plt.subplots(<span class="hljs-number">1</span>, num_images, figsize=(<span class="hljs-number">5</span>*num_images, <span class="hljs-number">5</span>))
    fig.suptitle(<span class="hljs-string">f&#x27;Search Results: &quot;<span class="hljs-subst">{query_text}</span>&quot; (Top <span class="hljs-subst">{num_images}</span>)&#x27;</span>, fontsize=<span class="hljs-number">16</span>, fontweight=<span class="hljs-string">&#x27;bold&#x27;</span>)
    
    <span class="hljs-comment"># Handle single image case</span>
    <span class="hljs-keyword">if</span> num_images == <span class="hljs-number">1</span>:
        axes = [axes]
    
    <span class="hljs-comment"># Display images</span>
    <span class="hljs-keyword">for</span> i, result <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results):
        <span class="hljs-keyword">try</span>:
            img_path = result[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;filepath&#x27;</span>]
            filename = result[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;filename&#x27;</span>]
            score = result[<span class="hljs-string">&#x27;distance&#x27;</span>]
            
            <span class="hljs-comment"># Load and display image</span>
            img = Image.<span class="hljs-built_in">open</span>(img_path)
            axes[i].imshow(img)
            axes[i].set_title(<span class="hljs-string">f&quot;<span class="hljs-subst">{filename}</span>\nSimilarity: <span class="hljs-subst">{score:<span class="hljs-number">.3</span>f}</span>&quot;</span>, fontsize=<span class="hljs-number">10</span>)
            axes[i].axis(<span class="hljs-string">&#x27;off&#x27;</span>)
            
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>. File: <span class="hljs-subst">{filename}</span>, Similarity score: <span class="hljs-subst">{score:<span class="hljs-number">.4</span>f}</span>&quot;</span>)
            
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            axes[i].text(<span class="hljs-number">0.5</span>, <span class="hljs-number">0.5</span>, <span class="hljs-string">f&#x27;Error loading image\n<span class="hljs-subst">{<span class="hljs-built_in">str</span>(e)}</span>&#x27;</span>,
                        ha=<span class="hljs-string">&#x27;center&#x27;</span>, va=<span class="hljs-string">&#x27;center&#x27;</span>, transform=axes[i].transAxes)
            axes[i].axis(<span class="hljs-string">&#x27;off&#x27;</span>)
    
    plt.tight_layout()
    plt.show()

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Search and visualization functions defined successfully!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>تنفيذ البحث من نص إلى صورة</p>
<pre><code translate="no"><span class="hljs-comment"># Example search 1</span>
query1 = <span class="hljs-string">&quot;a golden watch&quot;</span>
results1 = search_images_by_text(query1, top_k=<span class="hljs-number">3</span>)
visualize_search_results(query1, results1)
<button class="copy-code-btn"></button></code></pre>
<p>مخرجات تنفيذ استعلام البحث</p>
<pre><code translate="no"><span class="hljs-title class_">Search</span> <span class="hljs-attr">query</span>: <span class="hljs-string">&#x27;a golden watch&#x27;</span>
<span class="hljs-number">1.</span> <span class="hljs-title class_">File</span>: <span class="hljs-title function_">images</span> (<span class="hljs-number">19</span>).<span class="hljs-property">jpeg</span>, <span class="hljs-title class_">Similarity</span> <span class="hljs-attr">score</span>: <span class="hljs-number">0.2934</span>
<span class="hljs-number">2.</span> <span class="hljs-title class_">File</span>: <span class="hljs-title function_">download</span> (<span class="hljs-number">26</span>).<span class="hljs-property">jpeg</span>, <span class="hljs-title class_">Similarity</span> <span class="hljs-attr">score</span>: <span class="hljs-number">0.3073</span>
<span class="hljs-number">3.</span> <span class="hljs-title class_">File</span>: <span class="hljs-title function_">images</span> (<span class="hljs-number">17</span>).<span class="hljs-property">jpeg</span>, <span class="hljs-title class_">Similarity</span> <span class="hljs-attr">score</span>: <span class="hljs-number">0.2717</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/watch_067c39ba51.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Using-Nano-banana-to-Create-Brand-Promotional-Images" class="common-anchor-header">استخدام نانو بانانا لإنشاء صور ترويجية للعلامة التجارية<button data-href="#Using-Nano-banana-to-Create-Brand-Promotional-Images" class="anchor-icon" translate="no">
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
    </button></h2><p>الآن بعد أن أصبح لدينا نظام البحث من نص إلى صورة الذي يعمل مع ميلفوس، دعنا ندمج نانو-بانانا لإنشاء محتوى ترويجي جديد بناءً على الأصول التي نسترجعها.</p>
<p>تثبيت Google SDK</p>
<pre><code translate="no">%pip install google-generativeai
%pip install requests
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Google Generative AI SDK installation complete!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>تكوين واجهة برمجة تطبيقات الجوزاء</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> google.<span class="hljs-property">generativeai</span> <span class="hljs-keyword">as</span> genai
<span class="hljs-keyword">from</span> <span class="hljs-variable constant_">PIL</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">Image</span>
<span class="hljs-keyword">from</span> io <span class="hljs-keyword">import</span> <span class="hljs-title class_">BytesIO</span>
genai.<span class="hljs-title function_">configure</span>(api_key=<span class="hljs-string">&quot;&lt;your_api_key&gt;&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>توليد صور جديدة</p>
<pre><code translate="no">prompt = (
    <span class="hljs-string">&quot;An European male model wearing a suit, carrying a gold watch.&quot;</span>
)

image = Image.<span class="hljs-built_in">open</span>(<span class="hljs-string">&quot;/path/to/image/watch.jpg&quot;</span>)

model = genai.GenerativeModel(<span class="hljs-string">&#x27;gemini-2.5-flash-image-preview&#x27;</span>)
response = model.generate_content([prompt, image])

<span class="hljs-keyword">for</span> part <span class="hljs-keyword">in</span> response.candidates[<span class="hljs-number">0</span>].content.parts:
    <span class="hljs-keyword">if</span> part.text <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> <span class="hljs-literal">None</span>:
        <span class="hljs-built_in">print</span>(part.text)
    <span class="hljs-keyword">elif</span> part.inline_data <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> <span class="hljs-literal">None</span>:
        image = Image.<span class="hljs-built_in">open</span>(BytesIO(part.inline_data.data))
        image.save(<span class="hljs-string">&quot;generated_image.png&quot;</span>)
        image.show()
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/suit_976b6f1df2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="What-This-Means-for-Your-Development-Workflow" class="common-anchor-header">ماذا يعني هذا لسير عمل التطوير الخاص بك<button data-href="#What-This-Means-for-Your-Development-Workflow" class="anchor-icon" translate="no">
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
    </button></h2><p>بصفتك مطورًا، فإن تكامل Milvus + Nano-banana هذا يغير بشكل أساسي كيفية التعامل مع مشاريع إنشاء المحتوى. فبدلاً من إدارة مكتبات الأصول الثابتة أو الاعتماد على فرق إبداعية باهظة الثمن، أصبح لديك الآن نظام ديناميكي يسترجع ويولد بالضبط ما يحتاجه تطبيقك في الوقت الفعلي.</p>
<p>تأمل سيناريو العميل الأخير التالي: أطلقت إحدى العلامات التجارية العديد من المنتجات الجديدة ولكنها اختارت تخطي خط إنتاج الصور التقليدي بالكامل. وباستخدام نظامنا المتكامل، تمكنوا من إنشاء صور ترويجية على الفور من خلال الجمع بين قاعدة بيانات منتجاتهم الحالية وقدرات توليد Nano-banana.</p>
<p><em>موجه: عارضة أزياء ترتدي هذه المنتجات على الشاطئ</em></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/model_5a2a042b46.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>تصبح القوة الحقيقية واضحة عندما تحتاج إلى إنشاء محتوى معقد ومتعدد المتغيرات يتطلب عادةً تنسيقًا مكثفًا بين المصورين والعارضات ومصممي الديكور. مع تعامل Milvus مع استرجاع الأصول وإدارة Nano-banana لعملية الإنشاء، يمكنك إنشاء مشاهد معقدة برمجيًا تتكيف مع متطلباتك الخاصة:</p>
<p><em>موجه: عارضة أزياء تقف وتتكئ على سيارة رياضية زرقاء مكشوفة. وهي ترتدي فستانًا من أعلى الرسن والإكسسوارات المصاحبة له. وهي مزينة بقلادة ماسية وساعة زرقاء، وترتدي حذاءً بكعب عالٍ في قدميها وتمسك بيدها قلادة لابوبو.</em></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/shoes_98e1e4c70b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>بالنسبة للمطورين الذين يعملون في مجال الألعاب أو المقتنيات، يفتح هذا النظام إمكانيات جديدة تماماً للنماذج الأولية السريعة والتحقق من صحة المفهوم. فبدلاً من استثمار أسابيع في النمذجة ثلاثية الأبعاد قبل معرفة ما إذا كان المفهوم ناجحاً أم لا، يمكنك الآن إنشاء تصورات واقعية للمنتج تتضمن التغليف والسياق البيئي وحتى عمليات التصنيع:</p>
<p><em>موجه: استخدم نموذج الموز النانو لإنشاء مجسم تجاري بمقياس 1/7 للشخصية الموجودة في الرسم التوضيحي، بأسلوب وبيئة واقعيين. ضع المجسم على مكتب كمبيوتر، باستخدام قاعدة دائرية من الأكريليك الشفاف بدون أي نص. على شاشة الكمبيوتر، اعرض عملية نمذجة ZBrush للشخصية على شاشة الكمبيوتر. بجانب شاشة الكمبيوتر، ضع صندوق تغليف لعبة على غرار BANDAI مطبوع عليه العمل الفني الأصلي.</em></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_3d_5189d53773.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Conclusion" class="common-anchor-header">الخاتمة<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>من من منظور تقني، نانو موزة النانو أكثر من مجرد حداثة - إنها جاهزة للإنتاج بطرق تهم المطورين. تتمثل أكبر نقاط قوته في الاتساق والقدرة على التحكم، مما يعني تقليل حالات الحافة التي تنزف في منطق التطبيق الخاص بك. وبنفس القدر من الأهمية، فهو يتعامل مع التفاصيل الدقيقة التي غالبًا ما تعرقل خطوط الأنابيب الآلية: الحفاظ على اتساق ألوان العلامة التجارية، وتوليد إضاءة وانعكاسات معقولة فيزيائيًا، وضمان الاتساق البصري عبر تنسيقات الإخراج المتعددة.</p>
<p>يحدث السحر الحقيقي عند دمجها مع قاعدة بيانات Milvus vector. لا تقوم قاعدة بيانات المتجهات بتخزين التضمينات فقط - بل تصبح مدير أصول ذكيًا يمكنه إظهار المحتوى التاريخي الأكثر صلة لتوجيه الأجيال الجديدة. والنتيجة: أوقات توليد أسرع (لأن النموذج يحتوي على سياق أفضل)، واتساق أعلى عبر تطبيقك، والقدرة على فرض إرشادات العلامة التجارية أو النمط تلقائيًا.</p>
<p>باختصار، يحول Milvus نانو بانانا من لعبة إبداعية إلى نظام مؤسسي قابل للتطوير.</p>
<p>بالطبع، لا يوجد نظام لا تشوبه شائبة. فالتعليمات المعقدة والمتعددة الخطوات يمكن أن تتسبب في حدوث عوائق، كما أن فيزياء الإضاءة أحياناً توسع الواقع أكثر مما تريد. الحل الأكثر موثوقية الذي رأيناه هو استكمال المطالبات النصية بصور مرجعية مخزنة في Milvus، مما يمنح النموذج أساسًا أكثر ثراءً ونتائج أكثر قابلية للتنبؤ ودورات تكرار أقصر. باستخدام هذا الإعداد، أنت لا تقوم فقط بتجربة نموذج RAG متعدد الوسائط - بل تقوم بتشغيله في الإنتاج بثقة.</p>
