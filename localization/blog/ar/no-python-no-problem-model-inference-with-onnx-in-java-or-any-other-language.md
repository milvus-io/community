---
id: >-
  no-python-no-problem-model-inference-with-onnx-in-java-or-any-other-language.md
title: >-
  لا توجد بايثون، لا مشكلة: الاستدلال على النماذج باستخدام ONNX في جافا أو أي
  لغة أخرى
author: Stefan Webb
date: 2025-05-30T00:00:00.000Z
desc: >-
  ONNX (التبادل المفتوح للشبكات العصبية) هو نظام بيئي لا يعتمد على منصة واحدة من
  الأدوات اللازمة لإجراء استدلال نموذج الشبكة العصبية.
cover: assets.zilliz.com/No_Python_No_Problem_7fe97dad46.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: >-
  build AI apps with Python, ONNX (Open Neural Network Exchange), Model
  inference, vector databases, Milvus
meta_title: >
  No Python, No Problem: Model Inference with ONNX in Java, or Any Other
  Language
origin: >-
  https://milvus.io/blog/no-python-no-problem-model-inference-with-onnx-in-java-or-any-other-language.md
---
<p>لم يكن إنشاء تطبيقات الذكاء الاصطناعي التوليدي أسهل من أي وقت مضى. يسمح النظام البيئي الغني بالأدوات ونماذج الذكاء الاصطناعي ومجموعات البيانات حتى لمهندسي البرمجيات غير المتخصصين ببناء روبوتات دردشة ومولدات صور رائعة وغير ذلك. هذه الأدوات، في معظمها، مصممة لبايثون ومبنية على PyTorch. ولكن ماذا عن الحالات التي لا يمكنك فيها الوصول إلى Python في الإنتاج وتحتاج إلى استخدام Java أو Golang أو Rust أو C++ أو لغة أخرى؟</p>
<p>سوف نقتصر على الاستدلال على النماذج، بما في ذلك نماذج التضمين والنماذج التأسيسية؛ أما المهام الأخرى، مثل تدريب النماذج والضبط الدقيق، فلا تكتمل عادةً في وقت النشر. ما هي خياراتنا للاستدلال على النماذج بدون لغة بايثون؟ الحل الأكثر وضوحًا هو استخدام خدمة عبر الإنترنت من مزودي خدمات مثل أنثروبيك أو ميسترال. عادةً ما يوفرون عادةً مجموعة أدوات تطوير البرمجيات للغات أخرى غير بايثون، وإذا لم يفعلوا ذلك، فلن يتطلب الأمر سوى مكالمات بسيطة لواجهة برمجة تطبيقات REST. ولكن ماذا لو كان حلنا يجب أن يكون محليًا بالكامل بسبب، على سبيل المثال، مخاوف تتعلق بالامتثال أو الخصوصية؟</p>
<p>الحل الآخر هو تشغيل خادم Python محليًا. طُرحت المشكلة الأصلية على أنها عدم القدرة على تشغيل Python في الإنتاج، لذا فإن ذلك يستبعد استخدام خادم Python محلي. من المحتمل أن تعاني الحلول المحلية ذات الصلة من قيود قانونية أو أمنية أو تقنية مماثلة. <em>نحن بحاجة إلى حل مضمن بالكامل يسمح لنا باستدعاء النموذج مباشرةً من جافا أو لغة أخرى غير بايثون.</em></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/A_Python_metamorphoses_into_an_Onyx_butterfly_a65c340c47.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>الشكل 1: تحول بايثون إلى فراشة أونيكس.</em></p>
<h2 id="What-is-ONNX-Open-Neural-Network-Exchange" class="common-anchor-header">ما هو ONNX (تبادل الشبكة العصبية المفتوحة)؟<button data-href="#What-is-ONNX-Open-Neural-Network-Exchange" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/onnx/onnx">ONNX</a> (التبادل المفتوح للشبكات العصبية) هو نظام بيئي لا يعتمد على منصة محددة من الأدوات اللازمة لإجراء استدلال نموذج الشبكة العصبية. وقد تم تطويره في البداية من قبل فريق PyTorch في Meta (ثم فيسبوك)، مع مساهمات أخرى من مايكروسوفت وIBM وهواوي وإنتل وAMD وArm وكوالكوم. وهو حاليًا مشروع مفتوح المصدر مملوك لمؤسسة لينكس للذكاء الاصطناعي والبيانات. ONNX هي الطريقة الفعلية لتوزيع نماذج الشبكات العصبية التي لا تعتمد على المنصة.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/A_partial_ONNX_computational_graph_for_a_NN_transformer_11deebefe0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>الشكل 2: رسم بياني حسابي (جزئي) لـ ONNX لمحول الشبكة العصبية</em></p>
<p><strong>عادةً ما نستخدم "ONNX" بمعنى أضيق للإشارة إلى تنسيق الملف الخاص به.</strong> يمثل ملف نموذج ONNX رسمًا بيانيًا حسابيًا، وغالبًا ما يتضمن قيم الوزن لدالة رياضية، ويحدد المعيار العمليات الشائعة للشبكات العصبية. يمكنك التفكير فيه بشكل مشابه للرسم البياني الحسابي الذي تم إنشاؤه عند استخدام autodiff مع PyTorch. من من منظور آخر، يعمل تنسيق ملف ONNX <em>كتمثيل وسيط</em> (IR) للشبكات العصبية، يشبه إلى حد كبير تجميع التعليمات البرمجية الأصلية، والتي تتضمن أيضًا خطوة IR. انظر الرسم التوضيحي أعلاه الذي يصور رسمًا بيانيًا حسابيًا لملف ONNX.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/An_IR_allows_many_combinations_of_front_ends_and_back_ends_a05e259849.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>الشكل 3: يسمح التمثيل الوسيط (IR) بالعديد من التوليفات بين النهايات الأمامية والخلفية</em></p>
<p>يعد تنسيق ملف ONNX جزءًا واحدًا فقط من نظام ONNX البيئي، والذي يتضمن أيضًا مكتبات لمعالجة الرسوم البيانية الحسابية ومكتبات لتحميل وتشغيل ملفات نماذج ONNX. تمتد هذه المكتبات عبر اللغات والمنصات. نظرًا لأن ONNX هي مجرد لغة تمثيل وسيطة (لغة تمثيل وسيطة)، يمكن تطبيق التحسينات الخاصة بمنصة أجهزة معينة قبل تشغيلها مع التعليمات البرمجية الأصلية. انظر الشكل أعلاه الذي يوضح مجموعات من النهايات الأمامية والنهايات الخلفية.</p>
<h2 id="ONNX-Workflow" class="common-anchor-header">سير عمل ONNX<button data-href="#ONNX-Workflow" class="anchor-icon" translate="no">
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
    </button></h2><p>لأغراض المناقشة، سنبحث في استدعاء نموذج تضمين نصي من Java، على سبيل المثال، استعدادًا لإدخال البيانات إلى قاعدة بيانات المتجهات مفتوحة المصدر <a href="https://milvus.io/">Milvus</a>. لذا، إذا أردنا استدعاء نموذج التضمين أو النموذج التأسيسي من Java، فهل الأمر بسيط مثل استخدام مكتبة ONNX على ملف النموذج المقابل؟ نعم، ولكننا سنحتاج إلى شراء ملفات لكل من النموذج ومُشَفِّر التضمين (وفك التشفير لنماذج الأساس). يمكننا إنتاجها بأنفسنا باستخدام Python دون اتصال بالإنترنت، أي قبل الإنتاج، وهو ما سنشرحه الآن.</p>
<h2 id="Exporting-NN-Models-from-Python" class="common-anchor-header">تصدير نماذج الشبكة العصبية من بايثون<button data-href="#Exporting-NN-Models-from-Python" class="anchor-icon" translate="no">
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
    </button></h2><p>دعونا نفتح نموذج تضمين نصي شائع، <code translate="no">all-MiniLM-L6-v2</code> ، من بايثون باستخدام مكتبة محولات الجمل الخاصة بـ HuggingFace. سوف نستخدم مكتبة HF بشكل غير مباشر عبر مكتبة .txtai's util لأننا نحتاج إلى غلاف حول محولات الجمل التي تصدر أيضًا طبقات التجميع والتطبيع بعد دالة المحول. (تأخذ هذه الطبقات تضمينات الرموز الرمزية المعتمدة على السياق، أي مخرجات المحول، وتحولها إلى تضمين نص واحد).</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> txtai.pipeline <span class="hljs-keyword">import</span> HFOnnx

path = <span class="hljs-string">&quot;sentence-transformers/all-MiniLM-L6-v2&quot;</span>
onnx_model = HFOnnx()
model = onnx_model(path, <span class="hljs-string">&quot;pooling&quot;</span>, <span class="hljs-string">&quot;model.onnx&quot;</span>, <span class="hljs-literal">True</span>)
<button class="copy-code-btn"></button></code></pre>
<p>نوجه المكتبة لتصدير <code translate="no">sentence-transformers/all-MiniLM-L6-v2</code> من محور نموذج HuggingFace على شكل ONNX، مع تحديد المهمة على أنها تضمين نصي وتمكين تكميم النموذج. سيؤدي استدعاء <code translate="no">onnx_model()</code> إلى تنزيل النموذج من محور النموذج إذا لم يكن موجودًا بالفعل محليًا، وتحويل الطبقات الثلاث إلى ONNX، ودمج الرسوم البيانية الحسابية الخاصة بهم.</p>
<p>هل نحن جاهزون الآن لإجراء الاستدلال في جافا؟ ليس بهذه السرعة. يقوم النموذج بإدخال قائمة من الرموز (أو قائمة من القوائم لأكثر من عينة واحدة) تتوافق مع ترميز النص الذي نرغب في تضمينه. لذلك، ما لم نتمكن من إجراء كل الترميز قبل وقت الإنتاج، سنحتاج إلى تشغيل أداة الترميز من داخل Java.</p>
<p>هناك بعض الخيارات لهذا الأمر. يتضمن أحدها إما تنفيذ أو إيجاد تطبيق للرمز المميز للنموذج المعني بلغة جافا أو لغة أخرى، واستدعائه من جافا كمكتبة ثابتة أو مرتبطة ديناميكيًا. الحل الأسهل هو تحويل أداة الترميز إلى ملف ONNX واستخدامه من Java، تمامًا كما نستخدم ملف ONNX للنموذج.</p>
<p>ومع ذلك، فإن ONNX العادي لا يحتوي على العمليات الضرورية لتنفيذ الرسم البياني الحسابي للرمز المميز. لهذا السبب، أنشأت مايكروسوفت مكتبة لزيادة ONNX تسمى ONNXRuntime-Extensions. وهي تعرّف العمليات المفيدة لجميع أنواع المعالجة المسبقة واللاحقة للبيانات، وليس فقط الرموز النصية.</p>
<p>إليك كيفية تصدير أداة الترميز الخاصة بنا كملف ONNX:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> onnxruntime_extensions <span class="hljs-keyword">import</span> gen_processing_models
<span class="hljs-keyword">from</span> sentence_transformers <span class="hljs-keyword">import</span> SentenceTransformer

embedding_model = SentenceTransformer(<span class="hljs-string">&#x27;all-MiniLM-L6-v2&#x27;</span>)
tok_encode, _ = gen_processing_models(embedding_model.tokenizer, pre_kwargs={})

onnx_tokenizer_path = <span class="hljs-string">&quot;tokenizer.onnx&quot;</span>
<span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(tokenizer_path, <span class="hljs-string">&quot;wb&quot;</span>) <span class="hljs-keyword">as</span> f:
  f.write(tok_encode.SerializeToString())
<button class="copy-code-btn"></button></code></pre>
<p>لقد تخلصنا من أداة فك ترميز أداة الترميز، لأن تضمين الجمل لا يتطلب ذلك. والآن، لدينا ملفان: <code translate="no">tokenizer.onnx</code> لترميز النص، و <code translate="no">model.onnx</code> لتضمين سلاسل الرموز.</p>
<h2 id="Model-Inference-in-Java" class="common-anchor-header">استدلال النموذج في جافا<button data-href="#Model-Inference-in-Java" class="anchor-icon" translate="no">
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
    </button></h2><p>أصبح الآن تشغيل نموذجنا من داخل جافا أمرًا بسيطًا. فيما يلي بعض الأسطر المهمة من التعليمات البرمجية من المثال الكامل:</p>
<pre><code translate="no" class="language-java"><span class="hljs-comment">// Imports required for Java/ONNX integration</span>
<span class="hljs-keyword">import</span> ai.onnxruntime.*;
<span class="hljs-keyword">import</span> ai.onnxruntime.extensions.*;

…

<span class="hljs-comment">// Set up inference sessions for tokenizer and model</span>
<span class="hljs-type">var</span> <span class="hljs-variable">env</span> <span class="hljs-operator">=</span> OrtEnvironment.getEnvironment();

<span class="hljs-type">var</span> <span class="hljs-variable">sess_opt</span> <span class="hljs-operator">=</span> <span class="hljs-keyword">new</span> <span class="hljs-title class_">OrtSession</span>.SessionOptions();
sess_opt.registerCustomOpLibrary(OrtxPackage.getLibraryPath());

<span class="hljs-type">var</span> <span class="hljs-variable">tokenizer</span> <span class="hljs-operator">=</span> env.createSession(<span class="hljs-string">&quot;app/tokenizer.onnx&quot;</span>, sess_opt);
<span class="hljs-type">var</span> <span class="hljs-variable">model</span> <span class="hljs-operator">=</span> env.createSession(<span class="hljs-string">&quot;app/model.onnx&quot;</span>, sess_opt);

…

<span class="hljs-comment">// Perform inference and extract text embeddings into native Java</span>
<span class="hljs-type">var</span> <span class="hljs-variable">results</span> <span class="hljs-operator">=</span> session.run(inputs).get(<span class="hljs-string">&quot;embeddings&quot;</span>);
<span class="hljs-type">float</span>[][] embeddings = (<span class="hljs-type">float</span>[][]) results.get().getValue();
<button class="copy-code-btn"></button></code></pre>
<p>يمكن العثور على مثال عملي كامل في قسم الموارد.</p>
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
    </button></h2><p>لقد رأينا في هذا المنشور كيف يمكن تصدير نماذج مفتوحة المصدر من مركز نماذج HuggingFace واستخدامها مباشرةً من لغات أخرى غير Python. ومع ذلك، نلاحظ بعض المحاذير:</p>
<p>أولاً، تمتلك مكتبات ONNX وامتدادات وقت التشغيل مستويات متفاوتة من دعم الميزات. قد لا يكون من الممكن استخدام جميع النماذج عبر جميع اللغات حتى يتم إصدار تحديث SDK مستقبلي. تعد مكتبات وقت تشغيل ONNX لمكتبات وقت تشغيل ONNX لكل من Python و C++C و Java و JavaScript هي الأكثر شمولاً.</p>
<p>ثانيًا، يحتوي محور HuggingFace على ONNX المُصدَّر مسبقًا، لكن هذه النماذج لا تتضمن طبقات التجميع والتطبيع النهائية. يجب أن تكون على دراية بكيفية عمل <code translate="no">sentence-transformers</code> إذا كنت تنوي استخدام <code translate="no">torch.onnx</code> مباشرة.</p>
<p>ومع ذلك، تحظى ONNX بدعم كبار قادة الصناعة وهي في طريقها لأن تصبح وسيلة غير احتكاكية للذكاء الاصطناعي التوليدي عبر المنصات.</p>
<h2 id="Resources" class="common-anchor-header">الموارد<button data-href="#Resources" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><p><a href="https://github.com/milvus-io/bootcamp/tree/master/tutorials/quickstart/onnx_example">مثال على كود onnx في بايثون وجافا</a></p></li>
<li><p><a href="https://onnx.ai/">https://onnx.ai/</a></p></li>
<li><p><a href="https://onnxruntime.ai/">https://onnxruntime.ai/</a></p></li>
<li><p><a href="https://onnxruntime.ai/docs/extensions/">https://onnxruntime.ai/docs/extensions/</a></p></li>
<li><p><a href="https://milvus.io/blog">https://milvus.io/blog</a></p></li>
<li><p><a href="https://github.com/milvus-io/bootcamp/tree/master">https://github.com/milvus-io/bootcamp/tree/master</a></p></li>
</ul>
