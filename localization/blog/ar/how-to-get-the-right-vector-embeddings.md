---
id: how-to-get-the-right-vector-embeddings.md
title: كيفية الحصول على تضمينات المتجهات الصحيحة
author: Yujian Tang
date: 2023-12-08T00:00:00.000Z
desc: >-
  مقدمة شاملة عن التضمينات المتجهة وكيفية توليدها باستخدام نماذج مفتوحة المصدر
  شائعة الاستخدام.
cover: assets.zilliz.com/How_to_Get_the_Right_Vector_Embedding_d9ebcacbbb.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Vector Embeddings, Image Embeddings, Text Embeddings
recommend: true
canonicalUrl: 'https://zilliz.com/blog/how-to-get-the-right-vector-embeddings'
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/How_to_Get_the_Right_Vector_Embedding_d9ebcacbbb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>نُشرت هذه المقالة في الأصل في <a href="https://thenewstack.io/how-to-get-the-right-vector-embeddings/">The New Stack</a> وأعيد نشرها هنا بإذن.</em></p>
<p><strong>مقدمة شاملة عن التضمينات المتجهة وكيفية إنشائها باستخدام النماذج مفتوحة المصدر الشائعة.</strong></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_to_get_right_vector_embeddings_e0838623b7.png" alt="Image by Денис Марчук from Pixabay" class="doc-image" id="image-by-денис-марчук-from-pixabay" />
   </span> <span class="img-wrapper"> <span>صورة بواسطة Денис Марчук من Pixabay</span> </span></p>
<p>يعد تضمين المتجهات أمرًا بالغ الأهمية عند العمل مع <a href="https://zilliz.com/blog/vector-similarity-search">التشابه الدلالي</a>. ومع ذلك، فإن المتجه هو ببساطة سلسلة من الأرقام، أما تضمين المتجهات فهو سلسلة من الأرقام التي تمثل البيانات المدخلة. باستخدام التضمينات المتجهية، يمكننا هيكلة <a href="https://zilliz.com/blog/introduction-to-unstructured-data">البيانات غير المنظمة</a> أو العمل مع أي نوع من البيانات من خلال تحويلها إلى سلسلة من الأرقام. يسمح لنا هذا النهج بإجراء عمليات رياضية على البيانات المدخلة، بدلاً من الاعتماد على المقارنات النوعية.</p>
<p>تُعد التضمينات المتجهة مؤثرة في العديد من المهام، خاصةً في <a href="https://zilliz.com/glossary/semantic-search">البحث الدلالي</a>. ومع ذلك، من الضروري الحصول على التضمينات المتجهة المناسبة قبل استخدامها. على سبيل المثال، إذا كنت تستخدم نموذج صورة لتضمين نص متجه، أو العكس، فمن المحتمل أن تحصل على نتائج سيئة.</p>
<p>سنتعرف في هذا المنشور على معنى التضمينات المتجهة وكيفية إنشاء التضمينات المتجهة المناسبة لتطبيقاتك باستخدام نماذج مختلفة وكيفية تحقيق أفضل استخدام للتضمينات المتجهة مع قواعد البيانات المتجهة مثل <a href="https://milvus.io/">Milvus</a> و <a href="https://zilliz.com/">Zilliz Cloud</a>.</p>
<h2 id="How-are-vector-embeddings-created" class="common-anchor-header">كيف يتم إنشاء التضمينات المتجهة؟<button data-href="#How-are-vector-embeddings-created" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/how_vector_embeddings_are_created_03f9b60c68.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>الآن بعد أن فهمنا أهمية التضمينات المتجهية، دعونا نتعرف على كيفية عملها. التضمين المتجه هو التمثيل الداخلي للبيانات المدخلة في نموذج التعلم العميق، والمعروف أيضًا باسم نماذج التضمين أو الشبكة العصبية العميقة. إذن، كيف نستخرج هذه المعلومات؟</p>
<p>نحصل على المتجهات عن طريق إزالة الطبقة الأخيرة وأخذ المخرجات من الطبقة قبل الأخيرة. عادةً ما تقوم الطبقة الأخيرة من الشبكة العصبية بإخراج تنبؤات النموذج، لذلك نأخذ مخرجات الطبقة قبل الأخيرة. التضمين المتجه هو البيانات التي يتم تغذية الطبقة التنبؤية للشبكة العصبية.</p>
<p>إن بُعدية التضمين المتجه تعادل حجم الطبقة ما قبل الأخيرة في النموذج، وبالتالي يمكن استبدالها بحجم المتجه أو طوله. تشمل الأبعاد المتجهة الشائعة 384 (التي تم إنشاؤها بواسطة محولات الجمل المصغرة (Sentence Transformers Mini-LM) و768 (بواسطة محولات الجمل MPNet) و1536 (بواسطة OpenAI) و2048 (بواسطة ResNet-50).</p>
<h2 id="What-does-a-vector-embedding-mean" class="common-anchor-header">ماذا يعني تضمين المتجهات؟<button data-href="#What-does-a-vector-embedding-mean" class="anchor-icon" translate="no">
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
    </button></h2><p>سألني أحدهم ذات مرة عن معنى كل بُعد في تضمين المتجهات. الإجابة المختصرة هي لا شيء. لا يعني بُعد واحد في التضمين الاتجاهي أي شيء، لأنه مجرّد للغاية بحيث لا يمكن تحديد معناه. ومع ذلك، عندما نأخذ جميع الأبعاد معًا، فإنها توفر المعنى الدلالي للبيانات المدخلة.</p>
<p>أبعاد المتجه هي تمثيلات مجردة عالية المستوى لسمات مختلفة. تعتمد السمات الممثلة على بيانات التدريب والنموذج نفسه. تولد نماذج النصوص ونماذج الصور تضمينات مختلفة لأنها مدربة على أنواع بيانات مختلفة بشكل أساسي. حتى النماذج النصية المختلفة تولد تضمينات مختلفة. أحياناً تختلف في الحجم، وأحياناً أخرى تختلف في السمات التي تمثلها. على سبيل المثال، النموذج المدرّب على البيانات القانونية سيتعلم أشياء مختلفة عن النموذج المدرّب على بيانات الرعاية الصحية. لقد استكشفتُ هذا الموضوع في منشوري الذي <a href="https://zilliz.com/blog/comparing-different-vector-embeddings">يقارن بين تضمينات المتجهات</a>.</p>
<h2 id="Generate-the-right-vector-embeddings" class="common-anchor-header">توليد التضمينات المتجهة الصحيحة<button data-href="#Generate-the-right-vector-embeddings" class="anchor-icon" translate="no">
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
    </button></h2><p>كيف تحصل على التضمينات المتجهة المناسبة؟ يبدأ كل شيء بتحديد نوع البيانات التي ترغب في تضمينها. يغطي هذا القسم تضمين خمسة أنواع مختلفة من البيانات: الصور، والنصوص، والصوت، ومقاطع الفيديو، والبيانات متعددة الوسائط. جميع النماذج التي نقدمها هنا مفتوحة المصدر وتأتي من Hugging Face أو PyTorch.</p>
<h3 id="Image-embeddings" class="common-anchor-header">تضمين الصور</h3><p>انطلق مجال التعرّف على الصور في عام 2012 بعد ظهور AlexNet في المشهد. ومنذ ذلك الحين، شهد مجال الرؤية الحاسوبية العديد من التطورات. أحدث النماذج البارزة في مجال التعرف على الصور هو ResNet-50، وهي شبكة متبقية عميقة مكونة من 50 طبقة تعتمد على بنية ResNet-34 السابقة.</p>
<p>تعمل الشبكات العصبية المتبقية (ResNet) على حل مشكلة التدرج المتلاشي في الشبكات العصبية التلافيفية العميقة باستخدام وصلات مختصرة. تسمح هذه الوصلات بانتقال المخرجات من الطبقات السابقة إلى الطبقات اللاحقة مباشرةً دون المرور عبر جميع الطبقات الوسيطة، وبالتالي تجنب مشكلة التدرج المتلاشي. يجعل هذا التصميم شبكة ResNet أقل تعقيدًا من شبكة VGGNet (مجموعة الهندسة البصرية)، وهي شبكة عصبية تلافيفية كانت الأفضل أداءً في السابق.</p>
<p>أوصي باثنين من تطبيقات ResNet-50 كأمثلة: <a href="https://huggingface.co/microsoft/resnet-50">ResNet 50 على Hugging Face</a> و <a href="https://pytorch.org/vision/main/models/generated/torchvision.models.resnet50.html">ResNet 50 على PyTorch Hub</a>. في حين أن الشبكات هي نفسها، تختلف عملية الحصول على التضمينات.</p>
<p>يوضح نموذج التعليمات البرمجية أدناه كيفية استخدام PyTorch للحصول على تضمينات المتجهات. أولاً، نقوم بتحميل النموذج من PyTorch Hub. بعد ذلك، نزيل الطبقة الأخيرة ونستدعي <code translate="no">.eval()</code> لتوجيه النموذج للتصرف كما لو كان يعمل للاستدلال. بعد ذلك، تقوم الدالة <code translate="no">embed</code> بإنشاء التضمين المتجه.</p>
<pre><code translate="no"><span class="hljs-comment"># Load the embedding model with the last layer removed</span>
model = torch.hub.load(<span class="hljs-string">&#x27;pytorch/vision:v0.10.0&#x27;</span>, <span class="hljs-string">&#x27;resnet50&#x27;</span>, pretrained=<span class="hljs-literal">True</span>) model = torch.nn.Sequential(*(<span class="hljs-built_in">list</span>(model.children())[:-<span class="hljs-number">1</span>]))
model.<span class="hljs-built_in">eval</span>()


<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed</span>(<span class="hljs-params">data</span>):
<span class="hljs-keyword">with</span> torch.no_grad():
output = model(torch.stack(data[<span class="hljs-number">0</span>])).squeeze()
<span class="hljs-keyword">return</span> output
<button class="copy-code-btn"></button></code></pre>
<p>يستخدم HuggingFace إعدادًا مختلفًا قليلاً. يوضح الرمز أدناه كيفية الحصول على تضمين متجه من Hugging Face. أولاً، نحتاج أولاً إلى مستخرج ميزات ونموذج من مكتبة <code translate="no">transformers</code>. سوف نستخدم مستخرج الميزة للحصول على مدخلات للنموذج ونستخدم النموذج للحصول على المخرجات واستخراج آخر حالة مخفية.</p>
<pre><code translate="no"><span class="hljs-comment"># Load model directly</span>
<span class="hljs-keyword">from</span> transformers <span class="hljs-keyword">import</span> AutoFeatureExtractor, AutoModelForImageClassification


extractor = AutoFeatureExtractor.from_pretrained(<span class="hljs-string">&quot;microsoft/resnet-50&quot;</span>)
model = AutoModelForImageClassification.from_pretrained(<span class="hljs-string">&quot;microsoft/resnet-50&quot;</span>)


<span class="hljs-keyword">from</span> PIL <span class="hljs-keyword">import</span> Image


image = Image.<span class="hljs-built_in">open</span>(<span class="hljs-string">&quot;&lt;image path&gt;&quot;</span>)
<span class="hljs-comment"># image = Resize(size=(256, 256))(image)</span>


inputs = extractor(images=image, return_tensors=<span class="hljs-string">&quot;pt&quot;</span>)
<span class="hljs-comment"># print(inputs)</span>


outputs = model(**inputs)
vector_embeddings = outputs[<span class="hljs-number">1</span>][-<span class="hljs-number">1</span>].squeeze()
<button class="copy-code-btn"></button></code></pre>
<h3 id="Text-embeddings" class="common-anchor-header">تضمين النص</h3><p>يجري المهندسون والباحثون تجارب على اللغة الطبيعية والذكاء الاصطناعي منذ اختراع الذكاء الاصطناعي. تتضمن بعض التجارب المبكرة ما يلي:</p>
<ul>
<li>ELIZA، أول روبوت معالج بالذكاء الاصطناعي.</li>
<li>غرفة جون سيرل الصينية، وهي تجربة فكرية تدرس ما إذا كانت القدرة على الترجمة بين اللغتين الصينية والإنجليزية تتطلب فهم اللغة.</li>
<li>الترجمة القائمة على القواعد بين الإنجليزية والروسية.</li>
</ul>
<p>لقد تطورت عملية الذكاء الاصطناعي على اللغة الطبيعية بشكل كبير من التضمينات القائمة على القواعد. بدءًا من الشبكات العصبية الأولية، أضفنا العلاقات التكرارية من خلال الشبكات العصبية العصبية الشبكية RNNs لتتبع الخطوات في الوقت المناسب. من هناك، استخدمنا المحولات لحل مشكلة تحويل التسلسل.</p>
<p>تتكون المحولات من مشفر، والذي يشفر المدخلات إلى مصفوفة تمثل الحالة، ومصفوفة انتباه ومفك تشفير. تقوم وحدة فك التشفير بفك تشفير الحالة ومصفوفة الانتباه للتنبؤ بالرمز التالي الصحيح لإنهاء تسلسل المخرجات. يتألف نموذج GPT-3، وهو النموذج اللغوي الأكثر شيوعًا حتى الآن، من أجهزة فك تشفير صارمة. فهي تشفر المدخلات وتتنبأ بالرمز (الرموز) التالية الصحيحة.</p>
<p>إليك نموذجين من مكتبة <code translate="no">sentence-transformers</code> من Hugging Face يمكنك استخدامهما بالإضافة إلى تضمينات OpenAI:</p>
<ul>
<li><a href="https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2">MiniLM-LM-L6-v2</a>: نموذج 384 بُعداً</li>
<li><a href="https://huggingface.co/sentence-transformers/all-mpnet-base-v2">MPNet-Base-V2</a>: نموذج 768 بُعدًا</li>
</ul>
<p>يمكنك الوصول إلى التضمينات من كلا النموذجين بنفس الطريقة.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> sentence_transformers <span class="hljs-keyword">import</span> SentenceTransformer


model = SentenceTransformer(<span class="hljs-string">&quot;&lt;model-name&gt;&quot;</span>)
vector_embeddings = model.encode(“&lt;<span class="hljs-built_in">input</span>&gt;”)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Multimodal-embeddings" class="common-anchor-header">التضمينات متعددة الوسائط</h3><p>النماذج متعددة الوسائط أقل تطوراً من نماذج الصور أو النماذج النصية. فهي غالبًا ما تربط الصور بالنصوص.</p>
<p>المثال مفتوح المصدر الأكثر فائدة هو نموذج <a href="https://huggingface.co/openai/clip-vit-large-patch14">CLIP VIT،</a> وهو نموذج من صورة إلى نص. يمكنك الوصول إلى تضمينات CLIP VIT بنفس الطريقة التي تصل بها إلى نموذج الصورة، كما هو موضح في الكود أدناه.</p>
<pre><code translate="no"><span class="hljs-comment"># Load model directly</span>
<span class="hljs-keyword">from</span> transformers <span class="hljs-keyword">import</span> AutoProcessor, AutoModelForZeroShotImageClassification


processor = AutoProcessor.from_pretrained(<span class="hljs-string">&quot;openai/clip-vit-large-patch14&quot;</span>)
model = AutoModelForZeroShotImageClassification.from_pretrained(<span class="hljs-string">&quot;openai/clip-vit-large-patch14&quot;</span>)
<span class="hljs-keyword">from</span> PIL <span class="hljs-keyword">import</span> Image


image = Image.<span class="hljs-built_in">open</span>(<span class="hljs-string">&quot;&lt;image path&gt;&quot;</span>)
<span class="hljs-comment"># image = Resize(size=(256, 256))(image)</span>


inputs = extractor(images=image, return_tensors=<span class="hljs-string">&quot;pt&quot;</span>)
<span class="hljs-comment"># print(inputs)</span>


outputs = model(**inputs)
vector_embeddings = outputs[<span class="hljs-number">1</span>][-<span class="hljs-number">1</span>].squeeze()
<button class="copy-code-btn"></button></code></pre>
<h3 id="Audio-embeddings" class="common-anchor-header">تضمينات الصوت</h3><p>حظي الذكاء الاصطناعي للصوت باهتمام أقل من الذكاء الاصطناعي للنصوص أو الصور. حالة الاستخدام الأكثر شيوعًا للصوت هي تحويل الكلام إلى نص في صناعات مثل مراكز الاتصال والتكنولوجيا الطبية وإمكانية الوصول. أحد النماذج مفتوحة المصدر الشائعة لتحويل الكلام إلى نص هو <a href="https://huggingface.co/openai/whisper-large-v2">Whisper من OpenAI</a>. يوضح الرمز أدناه كيفية الحصول على تضمينات المتجهات من نموذج تحويل الكلام إلى نص.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> torch
from transformers <span class="hljs-keyword">import</span> AutoFeatureExtractor, WhisperModel
from datasets <span class="hljs-keyword">import</span> <span class="hljs-type">load_dataset</span>


<span class="hljs-variable">model</span> <span class="hljs-operator">=</span> WhisperModel.from_pretrained(<span class="hljs-string">&quot;openai/whisper-base&quot;</span>)
feature_extractor = AutoFeatureExtractor.from_pretrained(<span class="hljs-string">&quot;openai/whisper-base&quot;</span>)
ds = load_dataset(<span class="hljs-string">&quot;hf-internal-testing/librispeech_asr_dummy&quot;</span>, <span class="hljs-string">&quot;clean&quot;</span>, split=<span class="hljs-string">&quot;validation&quot;</span>)
inputs = feature_extractor(ds[<span class="hljs-number">0</span>][<span class="hljs-string">&quot;audio&quot;</span>][<span class="hljs-string">&quot;array&quot;</span>], return_tensors=<span class="hljs-string">&quot;pt&quot;</span>)
input_features = inputs.<span class="hljs-type">input_features</span>
<span class="hljs-variable">decoder_input_ids</span> <span class="hljs-operator">=</span> torch.tensor([[<span class="hljs-number">1</span>, <span class="hljs-number">1</span>]]) * model.config.<span class="hljs-type">decoder_start_token_id</span>
<span class="hljs-variable">vector_embedding</span> <span class="hljs-operator">=</span> model(input_features, decoder_input_ids=decoder_input_ids).last_hidden_state
<button class="copy-code-btn"></button></code></pre>
<h3 id="Video-embeddings" class="common-anchor-header">تضمينات الفيديو</h3><p>تعد تضمينات الفيديو أكثر تعقيدًا من تضمينات الصوت أو الصورة. من الضروري اتباع نهج متعدد الوسائط عند العمل مع مقاطع الفيديو، لأنها تتضمن صوتًا وصورًا متزامنة. أحد نماذج الفيديو الشائعة هو <a href="https://huggingface.co/deepmind/multimodal-perceiver">المدرك متعدد الوسائط</a> من DeepMind. يوضح هذا <a href="https://github.com/NielsRogge/Transformers-Tutorials/blob/master/Perceiver/Perceiver_for_Multimodal_Autoencoding.ipynb">الدليل التعليمي</a> كيفية استخدام النموذج لتصنيف مقطع فيديو.</p>
<p>للحصول على تضمينات المدخلات، استخدم <code translate="no">outputs[1][-1].squeeze()</code> من الكود الموضح في الدفتر بدلاً من حذف المخرجات. أبرز مقتطف الكود هذا في الدالة <code translate="no">autoencode</code>.</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">autoencode_video</span>(<span class="hljs-params">images, audio</span>):
     <span class="hljs-comment"># only create entire video once as inputs</span>
     inputs = {<span class="hljs-string">&#x27;image&#x27;</span>: torch.from_numpy(np.moveaxis(images, -<span class="hljs-number">1</span>, <span class="hljs-number">2</span>)).<span class="hljs-built_in">float</span>().to(device),
               <span class="hljs-string">&#x27;audio&#x27;</span>: torch.from_numpy(audio).to(device),
               <span class="hljs-string">&#x27;label&#x27;</span>: torch.zeros((images.shape[<span class="hljs-number">0</span>], <span class="hljs-number">700</span>)).to(device)}
     nchunks = <span class="hljs-number">128</span>
     reconstruction = {}
     <span class="hljs-keyword">for</span> chunk_idx <span class="hljs-keyword">in</span> tqdm(<span class="hljs-built_in">range</span>(nchunks)):
          image_chunk_size = np.prod(images.shape[<span class="hljs-number">1</span>:-<span class="hljs-number">1</span>]) // nchunks
          audio_chunk_size = audio.shape[<span class="hljs-number">1</span>] // SAMPLES_PER_PATCH // nchunks
          subsampling = {
               <span class="hljs-string">&#x27;image&#x27;</span>: torch.arange(
                    image_chunk_size * chunk_idx, image_chunk_size * (chunk_idx + <span class="hljs-number">1</span>)),
               <span class="hljs-string">&#x27;audio&#x27;</span>: torch.arange(
                    audio_chunk_size * chunk_idx, audio_chunk_size * (chunk_idx + <span class="hljs-number">1</span>)),
               <span class="hljs-string">&#x27;label&#x27;</span>: <span class="hljs-literal">None</span>,
          }
     <span class="hljs-comment"># forward pass</span>
          <span class="hljs-keyword">with</span> torch.no_grad():
               outputs = model(inputs=inputs, subsampled_output_points=subsampling)


          output = {k:v.cpu() <span class="hljs-keyword">for</span> k,v <span class="hljs-keyword">in</span> outputs.logits.items()}
          reconstruction[<span class="hljs-string">&#x27;label&#x27;</span>] = output[<span class="hljs-string">&#x27;label&#x27;</span>]
          <span class="hljs-keyword">if</span> <span class="hljs-string">&#x27;image&#x27;</span> <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> reconstruction:
               reconstruction[<span class="hljs-string">&#x27;image&#x27;</span>] = output[<span class="hljs-string">&#x27;image&#x27;</span>]
               reconstruction[<span class="hljs-string">&#x27;audio&#x27;</span>] = output[<span class="hljs-string">&#x27;audio&#x27;</span>]
          <span class="hljs-keyword">else</span>:
               reconstruction[<span class="hljs-string">&#x27;image&#x27;</span>] = torch.cat(
                    [reconstruction[<span class="hljs-string">&#x27;image&#x27;</span>], output[<span class="hljs-string">&#x27;image&#x27;</span>]], dim=<span class="hljs-number">1</span>)
               reconstruction[<span class="hljs-string">&#x27;audio&#x27;</span>] = torch.cat(
                    [reconstruction[<span class="hljs-string">&#x27;audio&#x27;</span>], output[<span class="hljs-string">&#x27;audio&#x27;</span>]], dim=<span class="hljs-number">1</span>)
          vector_embeddings = outputs[<span class="hljs-number">1</span>][-<span class="hljs-number">1</span>].squeeze()
<span class="hljs-comment"># finally, reshape image and audio modalities back to original shape</span>
     reconstruction[<span class="hljs-string">&#x27;image&#x27;</span>] = torch.reshape(reconstruction[<span class="hljs-string">&#x27;image&#x27;</span>], images.shape)
     reconstruction[<span class="hljs-string">&#x27;audio&#x27;</span>] = torch.reshape(reconstruction[<span class="hljs-string">&#x27;audio&#x27;</span>], audio.shape)
     <span class="hljs-keyword">return</span> reconstruction


     <span class="hljs-keyword">return</span> <span class="hljs-literal">None</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Storing-indexing-and-searching-vector-embeddings-with-vector-databases" class="common-anchor-header">تخزين وفهرسة والبحث في التضمينات المتجهة باستخدام قواعد البيانات المتجهة<button data-href="#Storing-indexing-and-searching-vector-embeddings-with-vector-databases" class="anchor-icon" translate="no">
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
    </button></h2><p>الآن بعد أن فهمنا ما هي التضمينات المتجهة وكيفية توليدها باستخدام نماذج تضمين قوية مختلفة، فإن السؤال التالي هو كيفية تخزينها والاستفادة منها. قواعد البيانات المتجهة هي الحل.</p>
<p>قواعد البيانات المتجهة مثل <a href="https://zilliz.com/what-is-milvus">ميلفوس</a> <a href="https://zilliz.com/cloud">وزيليز كلاود</a> مصممة خصيصًا لتخزين وفهرسة والبحث عبر مجموعات بيانات ضخمة من البيانات غير المنظمة من خلال تضمينات المتجهات. كما أنها واحدة من أهم البنى التحتية لمختلف مكدسات الذكاء الاصطناعي.</p>
<p>تستخدم قواعد البيانات المتجهة عادةً خوارزمية <a href="https://zilliz.com/glossary/anns">الجار الأقرب التقريبي (ANN)</a> لحساب المسافة المكانية بين متجه الاستعلام والمتجهات المخزنة في قاعدة البيانات. وكلما اقترب المتجهان من بعضهما البعض، كلما كانت المسافة بينهما أكثر صلة. ثم تقوم الخوارزمية بالعثور على أقرب جيران k الأعلى وتسليمها للمستخدم.</p>
<p>تحظى قواعد البيانات المتجهة بشعبية في حالات الاستخدام مثل <a href="https://zilliz.com/use-cases/llm-retrieval-augmented-generation">الجيل المعزز لاسترجاع LLM</a> (RAG)، وأنظمة الأسئلة والأجوبة، وأنظمة التوصية، وعمليات البحث الدلالية، وعمليات البحث عن التشابه في الصور والفيديو والصوت.</p>
<p>لمعرفة المزيد حول تضمينات المتجهات والبيانات غير المهيكلة وقواعد البيانات المتجهة، يمكنك البدء بسلسلة <a href="https://zilliz.com/blog?tag=39&amp;page=1">قواعد البيانات المتجهة 101</a>.</p>
<h2 id="Summary" class="common-anchor-header">الملخص<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>المتجهات هي أداة قوية للعمل مع البيانات غير المنظمة. باستخدام المتجهات، يمكننا رياضياً مقارنة أجزاء مختلفة من البيانات غير المهيكلة بناءً على التشابه الدلالي. يعد اختيار نموذج التضمين المتجه الصحيح أمرًا بالغ الأهمية لبناء محرك بحث متجه لأي تطبيق.</p>
<p>في هذا المنشور، تعلمنا أن تضمينات المتجهات هي التمثيل الداخلي للبيانات المدخلة في الشبكة العصبية. ونتيجة لذلك، فإنها تعتمد بشكل كبير على بنية الشبكة والبيانات المستخدمة لتدريب النموذج. تتطلب أنواع البيانات المختلفة (مثل الصور والنصوص والصوت) نماذج محددة. لحسن الحظ، يتوفر العديد من النماذج مفتوحة المصدر المدربة مسبقًا للاستخدام. في هذا المنشور، قمنا بتغطية النماذج للأنواع الخمسة الأكثر شيوعًا من البيانات: الصور، والنصوص، والوسائط المتعددة، والصوت، والفيديو. بالإضافة إلى ذلك، إذا كنت ترغب في تحقيق أفضل استخدام لتضمينات المتجهات، فإن قواعد البيانات المتجهة هي الأداة الأكثر شيوعًا.</p>
