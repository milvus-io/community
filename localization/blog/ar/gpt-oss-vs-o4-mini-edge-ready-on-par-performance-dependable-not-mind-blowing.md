---
id: >-
  gpt-oss-vs-o4-mini-edge-ready-on-par-performance-dependable-not-mind-blowing.md
title: >-
  GPT-oss مقابل o4-mini: أداء على مستوى عالٍ من الجاهزية والأداء - يمكن الاعتماد
  عليه وليس مذهلاً
author: Lumina Wang
date: 2025-08-07T00:00:00.000Z
desc: >-
  يسرق OpenAI الأضواء من خلال فتح المصادر لنموذجين من نماذج الاستدلال:
  gpt-oss-120b و gpt-oss-20b، المرخصين بشكل متساهل بموجب Apache 2.0.
cover: >-
  assets.zilliz.com/gpt_oss_vs_o4_mini_edge_ready_on_par_performance_dependable_not_mind_blowing_2bd27838c1.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'gpt-oss, OpenAI open source models, o4-mini, vector databases, deepseek'
meta_title: |
  GPT-oss vs o4-mini: Edge-Ready, Solid, But Not Disruptive
origin: >-
  https://milvus.io/blog/gpt-oss-vs-o4-mini-edge-ready-on-par-performance-dependable-not-mind-blowing.md
---
<p>لقد كان عالم الذكاء الاصطناعي ساخنًا. ففي غضون أسابيع قليلة، أطلقت شركة أنثروبيك Claude 4.1 Opus، وأذهلت شركة DeepMind الجميع بمحاكاة عالم Genie 3 - والآن، يسرق OpenAI الأضواء من خلال فتح مصادر نموذجين للتفكير: <a href="https://huggingface.co/openai/gpt-oss-120b">gpt-oss-120b</a> و <a href="https://huggingface.co/openai/gpt-oss-20b">gpt-oss-20b،</a> المرخصين بشكل متساهل تحت Apache 2.0.</p>
<p>بعد الإطلاق، قفز هذان النموذجان على الفور إلى المركز الأول في قائمة الأكثر تداولاً على موقع Hugging Face - ولسبب وجيه. هذه هي المرة الأولى منذ عام 2019 التي تصدر فيها OpenAI نماذج مفتوحة الوزن جاهزة للإنتاج بالفعل. لم تكن هذه الخطوة عرضية - فبعد سنوات من الدفع بالوصول إلى واجهة برمجة التطبيقات فقط، من الواضح أن OpenAI يستجيب لضغوط رواد المصادر المفتوحة مثل DeepSeek وLLaMA من Meta وQwen، الذين كانوا يهيمنون على كل من المعايير وسير عمل المطورين.</p>
<p>في هذا المنشور، سنستكشف ما الذي يجعل GPT-oss مختلفًا، وكيف يمكن مقارنته بالنماذج المفتوحة الرائدة مثل DeepSeek R1 و Qwen 3، ولماذا يجب على المطورين الاهتمام. سنستعرض أيضًا بناء نظام RAG قادر على التفكير المنطقي باستخدام GPT-oss و Milvus، قاعدة البيانات المتجهة مفتوحة المصدر الأكثر شيوعًا.</p>
<h2 id="What-Makes-GPT-oss-Special-and-Why-You-Should-Care" class="common-anchor-header">ما الذي يجعل GPT-oss مميزًا ولماذا يجب أن تهتم؟<button data-href="#What-Makes-GPT-oss-Special-and-Why-You-Should-Care" class="anchor-icon" translate="no">
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
    </button></h2><p>GPT-oss ليس مجرد إسقاط وزن آخر. إنها تقدم في خمسة مجالات رئيسية تهم المطورين:</p>
<h3 id="1-Built-for-Edge-Deployment" class="common-anchor-header">1: مصمم للنشر على الحافة</h3><p>يأتي GPT-oss في نوعين مختلفين بحجم استراتيجي:</p>
<ul>
<li><p>gPT-oss-120b: إجمالي 117B، 5.1B نشط لكل توكن</p></li>
<li><p>gpt-oss-20b: إجمالي 21B، 3.6B نشط لكل توكن</p></li>
</ul>
<p>باستخدام بنية خليط الخبراء (MoE)، تكون مجموعة فرعية فقط من المعلمات نشطة أثناء الاستدلال. هذا يجعل تشغيل كلا النموذجين خفيف الوزن بالنسبة لحجمهما:</p>
<ul>
<li><p>يعمل gpt-oss-120b على وحدة معالجة رسومات واحدة بسعة 80 جيجابايت (H100)</p></li>
<li><p>يتلاءم gpt-oss-20b مع 16 جيجابايت فقط من ذاكرة الوصول العشوائي الافتراضية، مما يعني أنه يعمل على أجهزة الكمبيوتر المحمولة المتطورة أو الأجهزة المتطورة</p></li>
</ul>
<p>وفقًا لاختبارات OpenAI، فإن gpt-oss-20b هو أسرع نموذج OpenAI للاستدلال - وهو مثالي لعمليات النشر ذات الكمون المنخفض أو وكلاء الاستدلال غير المتصل بالإنترنت.</p>
<h3 id="2-Strong-Benchmark-Performance" class="common-anchor-header">2: أداء معياري قوي</h3><p>وفقًا لتقييمات OpenAI:</p>
<ul>
<li><p>يؤدي<strong>gpt-oss-120b</strong> أداءً قريبًا من التكافؤ مع o4-mini في الاستدلال واستخدام الأدوات وترميز المنافسة (Codeforces، MMLU، TauBench)</p></li>
<li><p>يتنافس<strong>برنامج gpt-oss-20b</strong> مع o3-mini، بل ويتفوق عليه في الرياضيات والاستدلال في الرعاية الصحية</p></li>
</ul>
<h3 id="3-Cost-Efficient-Training" class="common-anchor-header">3: التدريب الفعال من حيث التكلفة</h3><p>يدّعي OpenAI أن أداءه يعادل أداء o3-mini و o4-mini، ولكن بتكاليف تدريب أقل بكثير:</p>
<ul>
<li><p><strong>GPT-OS-120b</strong>: 2.1 مليون ساعة H100 → حوالي 10 ملايين دولار</p></li>
<li><p><strong>gpt-oss-20b</strong>: 210 ألف ساعة H100 ساعة → ~ 1 مليون دولار أمريكي</p></li>
</ul>
<p>قارن ذلك بميزانيات بمئات الملايين من الدولارات وراء نماذج مثل GPT-4. يثبت GPT-oss أن خيارات التوسع والبنية الفعالة يمكن أن تقدم أداءً تنافسيًا دون بصمة كربونية هائلة.</p>
<h3 id="4-True-Open-Source-Freedom" class="common-anchor-header">4: الحرية الحقيقية مفتوحة المصدر</h3><p>يستخدم GPT-oss ترخيص Apache 2.0، مما يعني:</p>
<ul>
<li><p>الاستخدام التجاري مسموح به</p></li>
<li><p>حقوق تعديل وإعادة توزيع كاملة</p></li>
<li><p>لا توجد قيود على الاستخدام أو بنود حقوق النسخ.</p></li>
</ul>
<p>هذا مصدر مفتوح المصدر حقًا، وليس إصدارًا بحثيًا فقط. يمكنك ضبطه للاستخدام الخاص بالمجال، والنشر في الإنتاج مع التحكم الكامل، وبناء منتجات تجارية حوله. تتضمن الميزات الرئيسية عمق التفكير القابل للتهيئة (منخفض/متوسط/عالي)، والرؤية الكاملة لتسلسل الأفكار، واستدعاء الأداة الأصلية مع دعم الإخراج المنظم.</p>
<h3 id="5-Potential-GPT-5-Preview" class="common-anchor-header">5: معاينة GPT-5 المحتملة</h3><p>لم يفصح OpenAI عن كل شيء - لكن تفاصيل البنية تشير إلى أن هذا قد يستعرض اتجاه <strong>GPT-5</strong>:</p>
<ul>
<li><p>يستخدم MoE مع 4 خبراء لكل مدخل</p></li>
<li><p>يتبع انتباهًا كثيفًا متناوبًا + متناثرًا محليًا (نمط GPT-3)</p></li>
<li><p>يتميز بمزيد من رؤوس الانتباه</p></li>
<li><p>ومن المثير للاهتمام أن وحدات التحيز من GPT-2 قد عادت من جديد</p></li>
</ul>
<p>إذا كنت تترقب إشارات حول ما سيأتي بعد ذلك، فقد يكون GPT-oss أوضح تلميح عام حتى الآن.</p>
<h3 id="Core-Specifications" class="common-anchor-header">المواصفات الأساسية</h3><table>
<thead>
<tr><th></th><th></th><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>الطراز</strong></td><td><strong>إجمالي البارامز</strong></td><td><strong>البارامترات النشطة</strong></td><td><strong>الخبراء</strong></td><td><strong>طول السياق</strong></td><td><strong>طلب VRAM VRAM</strong></td></tr>
<tr><td>GPT-OS-120B</td><td>117B</td><td>5.1B</td><td>128</td><td>128k</td><td>80 جيجابايت</td></tr>
<tr><td>GPT-OS-20B</td><td>21B</td><td>3.6B</td><td>32</td><td>128k</td><td>16 جيجابايت</td></tr>
</tbody>
</table>
<p>يستخدم كلا النموذجين أداة ترميز o200k_harmony tokenizer ويدعمان طول سياق 128,000 رمز (حوالي 96,000-100,000 كلمة).</p>
<h2 id="GPT-oss-vs-Other-Reasoning-Models" class="common-anchor-header">GPT-oss مقابل نماذج الاستدلال الأخرى<button data-href="#GPT-oss-vs-Other-Reasoning-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>فيما يلي كيفية مقارنة GPT-oss بنماذج OpenAI الداخلية وكبار المنافسين المفتوحي المصدر:</p>
<table>
<thead>
<tr><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>النموذج</strong></td><td><strong>المعلمات (نشط)</strong></td><td><strong>الذاكرة</strong></td><td><strong>نقاط القوة</strong></td></tr>
<tr><td><strong>GPT-OS-120B</strong></td><td>117B (5.1B نشط)</td><td>80 جيجابايت</td><td>وحدة معالجة مركزية واحدة، منطقية مفتوحة</td></tr>
<tr><td><strong>gpt-oss-20b</strong></td><td>21B (3.6B نشط)</td><td>16 جيجابايت</td><td>نشر الحافة، استدلال سريع</td></tr>
<tr><td><strong>DeepSeek R1</strong></td><td>671B (حوالي 37B نشط)</td><td>موزع</td><td>رائد قياسي، أداء مثبت</td></tr>
<tr><td><strong>o4-mini (واجهة برمجة التطبيقات)</strong></td><td>مملوكة</td><td>واجهة برمجة التطبيقات فقط</td><td>منطق قوي (مغلق)</td></tr>
<tr><td><strong>o3-ميني (API)</strong></td><td>مملوكة</td><td>واجهة برمجة التطبيقات فقط</td><td>منطق خفيف الوزن (مغلق)</td></tr>
</tbody>
</table>
<p>استنادًا إلى نماذج القياس المختلفة، إليك ما وجدناه:</p>
<ul>
<li><p><strong>GPT-OS مقابل النماذج الخاصة بـ OpenAI:</strong> يتطابق gpt-oss-120b مع o4-mini في رياضيات المنافسة (AIME)، والترميز (Codeforces)، واستخدام الأدوات (TauBench). يعمل نموذج 20b بنفس أداء نموذج o3-mini على الرغم من كونه أصغر بكثير.</p></li>
<li><p><strong>GPT-oss مقابل DeepSeek R1:</strong> يتفوق DeepSeek R1 في الأداء الخالص لكنه يتطلب بنية تحتية موزعة. يوفر GPT-oss نشرًا أبسط - لا حاجة إلى إعداد موزع لنموذج 120b.</p></li>
</ul>
<p>باختصار، يوفر GPT-oss أفضل مزيج من الأداء والوصول المفتوح وقابلية النشر. يفوز DeepSeek R1 على الأداء الخالص، لكن GPT-oss يحقق التوازن الأمثل لمعظم المطورين.</p>
<h2 id="Hands-on-Building-with-GPT-oss-+-Milvus" class="common-anchor-header">التدريب العملي: البناء باستخدام GPT-oss + ميلفوس<button data-href="#Hands-on-Building-with-GPT-oss-+-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>الآن بعد أن رأينا ما يجلبه GPT-oss إلى الطاولة، حان الوقت لاستخدامه.</p>
<p>سنستعرض في الأقسام التالية برنامجًا تعليميًا عمليًا لبناء نظام RAG قادر على التفكير باستخدام gpt-oss-20b و Milvus، وكل ذلك يعمل محليًا، دون الحاجة إلى مفتاح API.</p>
<h3 id="Environment-Setup" class="common-anchor-header">إعداد البيئة</h3><pre><code translate="no">! pip install --upgrade <span class="hljs-string">&quot;pymilvus[model]&quot;</span> openai requests tqdm
<button class="copy-code-btn"></button></code></pre>
<h3 id="Dataset-Preparation" class="common-anchor-header">إعداد مجموعة البيانات</h3><p>سنستخدم وثائق ميلفوس كقاعدة معرفية لنا:</p>
<pre><code translate="no"><span class="hljs-comment"># Download and prepare Milvus docs</span>
! wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
! unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs

<span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob
text_lines = []
<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()
    text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Model-Setup" class="common-anchor-header">إعداد النموذج</h3><p>الوصول إلى GPT-oss من خلال <a href="https://openrouter.ai/openai/gpt-oss-20b:free">OpenRouter</a> (أو تشغيله محلياً). <a href="https://openrouter.ai/openai/gpt-oss-20b:free"><strong>OpenRouter</strong></a> عبارة عن منصة تتيح للمطورين الوصول والتبديل بين نماذج ذكاء اصطناعي متعددة (مثل GPT-4، كلود، ميسترال) من خلال واجهة برمجة تطبيقات واحدة موحدة. وهو مفيد لمقارنة النماذج أو إنشاء تطبيقات تعمل مع مزودي ذكاء اصطناعي مختلفين. الآن أصبحت سلسلة GPT-oss متاحة على OpenRouter الآن.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_46b575811f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI

<span class="hljs-comment"># Using OpenRouter for cloud access</span>
openai_client = OpenAI(
    api_key=<span class="hljs-string">&quot;&lt;OPENROUTER_API_KEY&gt;&quot;</span>,
    base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>,
)

<span class="hljs-comment"># Set up embedding model</span>
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model <span class="hljs-keyword">as</span> milvus_model
embedding_model = milvus_model.DefaultEmbeddingFunction()

<span class="hljs-comment"># Test embedding dimensions</span>
test_embedding = embedding_model.encode_queries([<span class="hljs-string">&quot;This is a test&quot;</span>])[<span class="hljs-number">0</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embedding)
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embedding[:<span class="hljs-number">10</span>])
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">768
[-0.04836066  0.07163023 -0.01130064 -0.03789345 -0.03320649 -0.01318448
 -0.03041712 -0.02269499 -0.02317863 -0.00426028]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Set-up-Milvus-vector-database" class="common-anchor-header">إعداد قاعدة بيانات متجه ميلفوس</h3><pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

<span class="hljs-comment"># Initialize Milvus client</span>
milvus_client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>, token=<span class="hljs-string">&quot;root:Milvus&quot;</span>)
collection_name = <span class="hljs-string">&quot;gpt_oss_rag_collection&quot;</span>

<span class="hljs-comment"># Clean up existing collection</span>
<span class="hljs-keyword">if</span> milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)

<span class="hljs-comment"># Create new collection</span>
milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;IP&quot;</span>,  <span class="hljs-comment"># Inner product distance</span>
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>حول إعدادات معلمات MilvusClient:</p>
<ul>
<li><p>يعد تعيين URI لملف محلي (على سبيل المثال، <code translate="no">./milvus.db</code>) الطريقة الأكثر ملاءمة لأنه يستخدم تلقائيًا Milvus Lite لتخزين جميع البيانات في هذا الملف.</p></li>
<li><p>بالنسبة للبيانات واسعة النطاق، يمكنك إعداد خادم Milvus أكثر قوة على Docker أو Kubernetes. في هذه الحالة، استخدم عنوان URI الخاص بالخادم (على سبيل المثال، <code translate="no">http://localhost:19530</code>) كـ URI الخاص بك.</p></li>
<li><p>إذا كنت ترغب في استخدام <a href="https://zilliz.com/cloud">Zilliz Cloud </a>(الخدمة المُدارة لـ Milvus)، قم بتعديل URI والرمز المميز، اللذين يتوافقان مع نقطة النهاية العامة ومفتاح API في Zilliz Cloud.</p></li>
</ul>
<h3 id="Adding-Documents-to-the-Collection" class="common-anchor-header">إضافة مستندات إلى المجموعة</h3><p>سنقوم الآن بإنشاء تضمينات لقطعنا النصية وإضافتها إلى ميلفوس:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm

data = []
doc_embeddings = embedding_model.encode_documents(text_lines)

<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})

milvus_client.insert(collection_name=collection_name, data=data)
<button class="copy-code-btn"></button></code></pre>
<p>الإخراج:</p>
<pre><code translate="no">Creating embeddings: 100%|█████████████████████████████████████████████████████████████████████████████████████████████████████████████████| 72/72 [00:00&lt;00:00, 1222631.13it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="RAG-Query-Pipeline" class="common-anchor-header">خط أنابيب استعلام RAG</h3><p>الآن للجزء المثير - دعونا نعد نظام RAG الخاص بنا للإجابة عن الأسئلة.</p>
<p>دعنا نحدد سؤالاً شائعاً عن ميلفوس:</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>ابحث عن هذا السؤال في المجموعة واسترجع أفضل 3 نتائج مطابقة دلاليًا:</p>
<pre><code translate="no">search_res = milvus_client.search(
    collection_name=collection_name,
    data=embedding_model.encode_queries(
        [question]
    ),  <span class="hljs-comment"># Convert the question to an embedding vector</span>
    limit=<span class="hljs-number">3</span>,  <span class="hljs-comment"># Return top 3 results</span>
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},  <span class="hljs-comment"># Inner product distance</span>
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],  <span class="hljs-comment"># Return the text field</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>لنلقِ نظرة على نتائج البحث لهذا الاستعلام:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json

retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including [MinIO](https://min.io/), [AWS S3](https://aws.amazon.com/s3/?nc1=h_ls), [Google Cloud Storage](https://cloud.google.com/storage?hl=en#object-storage-for-companies-of-all-sizes) (GCS), [Azure Blob Storage](https://azure.microsoft.com/en-us/products/storage/blobs), [Alibaba Cloud OSS](https://www.alibabacloud.com/product/object-storage-service), and [Tencent Cloud Object Storage](https://www.tencentcloud.com/products/cos) (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        <span class="hljs-number">0.6572664976119995</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus flush data?\n\nMilvus returns success when inserted data are loaded to the message queue. However, the data are not yet flushed to the disk. Then Milvus&#x27; data node writes the data in the message queue to persistent storage as incremental logs. If `flush()` is called, the data node is forced to write all data in the message queue to persistent storage immediately.\n\n###&quot;</span>,
        <span class="hljs-number">0.6312144994735718</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus handle vector data types and precision?\n\nMilvus supports Binary, Float32, Float16, and BFloat16 vector types.\n\n- Binary vectors: Store binary data as sequences of 0s and 1s, used in image processing and information retrieval.\n- Float32 vectors: Default storage with a precision of about 7 decimal digits. Even Float64 values are stored with Float32 precision, leading to potential precision loss upon retrieval.\n- Float16 and BFloat16 vectors: Offer reduced precision and memory usage. Float16 is suitable for applications with limited bandwidth and storage, while BFloat16 balances range and efficiency, commonly used in deep learning to reduce computational requirements without significantly impacting accuracy.\n\n###&quot;</span>,
        <span class="hljs-number">0.6115782856941223</span>
    ]
]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Using-the-GPT-oss-to-Build-a-RAG-Response" class="common-anchor-header">استخدام GPT-oss لإنشاء استجابة RAG</h3><p>تحويل المستندات المسترجعة إلى تنسيق سلسلة:</p>
<pre><code translate="no">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>توفير موجه النظام وموجه المستخدم لنموذج اللغة الكبيرة:</p>
<pre><code translate="no">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
Human: You are an AI assistant. You are able to find answers to the questions from the contextual passage snippets provided.
&quot;&quot;&quot;</span>
USER_PROMPT = <span class="hljs-string">f&quot;&quot;&quot;
Use the following pieces of information enclosed in &lt;context&gt; tags to provide an answer to the question enclosed in &lt;question&gt; tags.
&lt;context&gt;
<span class="hljs-subst">{context}</span>
&lt;/context&gt;
&lt;question&gt;
<span class="hljs-subst">{question}</span>
&lt;/question&gt;
&quot;&quot;&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>استخدام أحدث نموذج GPT-oss لإنشاء استجابة بناءً على المطالبة:</p>
<pre><code translate="no">response = openai_client.chat.completions.create(
    model=<span class="hljs-string">&quot;openai/gpt-oss-120b&quot;</span>,
    messages=[
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT},
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT},
    ],
)
<span class="hljs-built_in">print</span>(response.choices[<span class="hljs-number">0</span>].message.content)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">Milvus stores its data <span class="hljs-keyword">in</span> two distinct layers:

| Type of data | Where it <span class="hljs-keyword">is</span> stored | How it <span class="hljs-keyword">is</span> stored |
|-------------|-------------------|-----------------|
| **Inserted data** (vector data, scalar fields, collection‑specific schema) | In the **persistent <span class="hljs-built_in">object</span> storage** configured <span class="hljs-keyword">for</span> the cluster. The data are written <span class="hljs-keyword">as</span> **incremental logs** (append‑only logs) that are persisted <span class="hljs-keyword">by</span> the DataNode. | The DataNode reads <span class="hljs-keyword">from</span> the message‑<span class="hljs-function">queue <span class="hljs-keyword">and</span> writes the incoming data <span class="hljs-keyword">into</span> the storage <span class="hljs-title">backend</span> (<span class="hljs-params">MinIO, AWS S3, GCS, Azure Blob, Alibaba OSS, Tencent COS, etc.</span>). When a `<span class="hljs-title">flush</span>()` call <span class="hljs-keyword">is</span> issued, the DataNode forces all queued data to be written to the persistent storage immediately. |
| **Metadata** (<span class="hljs-params">information about collections, partitions, indexes, etc.</span>) | In **etcd**. Each Milvus <span class="hljs-title">module</span> (<span class="hljs-params">catalog, index, etc.</span>) keeps its own metadata. | The metadata <span class="hljs-keyword">is</span> generated <span class="hljs-keyword">and</span> managed <span class="hljs-keyword">by</span> Milvus <span class="hljs-keyword">and</span> persisted <span class="hljs-keyword">in</span> the distributed key‑<span class="hljs-keyword">value</span> store **etcd**. |

**Summary:**  
- **Inserted data**</span> = incremental logs stored <span class="hljs-keyword">in</span> the chosen <span class="hljs-built_in">object</span>‑storage backend.  
- **Metadata** = stored <span class="hljs-keyword">in</span> the distributed configuration store **etcd**.  


Together, <span class="hljs-function">these two storage <span class="hljs-title">mechanisms</span> (<span class="hljs-params"><span class="hljs-built_in">object</span> storage <span class="hljs-keyword">for</span> the actual data <span class="hljs-keyword">and</span> etcd <span class="hljs-keyword">for</span> metadata</span>) make up Milvus’s data‑storage architecture.
</span><button class="copy-code-btn"></button></code></pre>
<h2 id="Final-Thoughts-on-GPT-oss" class="common-anchor-header">الأفكار النهائية حول GPT-oss<button data-href="#Final-Thoughts-on-GPT-oss" class="anchor-icon" translate="no">
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
    </button></h2><p>GPT-oss هو اعتراف هادئ من OpenAI بأنه لا يمكن تجاهل المصدر المفتوح بعد الآن. إنه لا يتفوق على DeepSeek R1 أو Qwen 3 أو العديد من النماذج الأخرى، لكنه يجلب شيئًا لا يجلبونه: خط أنابيب تدريب OpenAI، مطبق على نموذج يمكنك فحصه وتشغيله محلياً.</p>
<p><strong>الأداء؟ جيد. ليس مذهلاً، ولكن يمكن الاعتماد عليه.</strong> نموذج 20B الذي يعمل على الأجهزة الاستهلاكية - أو حتى على الأجهزة المحمولة باستخدام LM Studio - هو نوع من المزايا العملية التي تهم المطورين بالفعل. إنها "هذا يعمل فقط" أكثر من "واو، هذا يغير كل شيء." وبصراحة، هذا جيد.</p>
<p><strong>ما ينقصه هو الدعم متعدد اللغات.</strong> إذا كنت تعمل بأي لغة أخرى غير الإنجليزية، ستواجه مشكلات في الصياغة والتهجئة والارتباك العام. من الواضح أن النموذج تم تدريبه باستخدام عدسة اللغة الإنجليزية أولاً. إذا كانت التغطية العالمية مهمة، فستحتاج على الأرجح إلى ضبطه باستخدام مجموعة بيانات متعددة اللغات.</p>
<p>لكن الأمر الأكثر إثارة للاهتمام هو التوقيت. يبدو إعلان OpenAI التشويقي على X - مع إسقاط "5" في كلمة "LIVESTREAM" - وكأنه إعداد. قد لا يكون GPT-oss هو العمل الرئيسي، ولكن يمكن أن يكون معاينة لما سيأتي في GPT-5. نفس المكونات، بمقياس مختلف. لننتظر.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_0fed950b8e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>الفوز الحقيقي هو وجود المزيد من الخيارات عالية الجودة.</strong> المنافسة تدفع إلى الابتكار، وعودة OpenAI إلى التطوير مفتوح المصدر يفيد الجميع. اختبر GPT-oss مقابل متطلباتك المحددة، ولكن اختر بناءً على ما يصلح بالفعل لحالة استخدامك، وليس على أساس التعرف على العلامة التجارية.</p>
