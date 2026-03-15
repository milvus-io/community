---
id: i-built-a-stock-monitoring-agent-with-openclaw-exa-and-milvus-for-20month.md
title: >-
  لقد أنشأت وكيلًا لمراقبة الأسهم باستخدام OpenClaw وExa وMilvus مقابل 20
  دولارًا شهريًا
author: Cheney Zhang
date: 2026-3-13
cover: assets.zilliz.com/blog_Open_Claw_3_510bc283aa.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'AI agent, stock monitoring agent, Milvus, vector database, OpenClaw'
meta_keywords: 'AI agent, stock monitoring agent, Milvus, vector database, OpenClaw'
meta_title: |
  OpenClaw Tutorial: AI Stock Agent with Exa and Milvus
desc: >-
  دليل تفصيلي خطوة بخطوة لبناء وكيل لمراقبة الأسهم بالذكاء الاصطناعي باستخدام
  OpenClaw وExa وMilvus. ملخصات صباحية وذاكرة تداول وتنبيهات مقابل 20 دولارًا
  شهريًا.
origin: >-
  https://milvus.io/blog/i-built-a-stock-monitoring-agent-with-openclaw-exa-and-milvus-for-20month.md
---
<p>أتداول في الأسهم الأمريكية بشكل جانبي، وهي طريقة مهذبة للقول بأنني أخسر المال كهواية. ويمزح زملائي في العمل بأن استراتيجيتي هي "الشراء عند الإثارة والبيع عند الخوف، والتكرار أسبوعيًا."</p>
<p>جزء التكرار هو ما يقتلني. في كل مرة أحدق فيها في السوق، ينتهي بي الأمر بإجراء صفقة لم أخطط لها. يرتفع النفط، فأقوم بالبيع بدافع الذعر. يرتفع سهم التكنولوجيا بنسبة 4%، فأقوم بمطاردته. وبعد مرور أسبوع، أنظر إلى سجل تداولاتي وأتساءل: <em>ألم أفعل هذا الشيء بالضبط في الربع الأخير؟</em></p>
<p>لذلك قمت بإنشاء وكيل مع OpenClaw يراقب السوق بدلاً مني ويمنعني من ارتكاب نفس الأخطاء. إنه لا يتداول أو يلمس أموالي؛ فهو يمنعني من فعل شيء ندمت عليه بالفعل مرة واحدة.</p>
<p>يتكون هذا الوكيل من ثلاثة أجزاء ويكلف حوالي 20 دولارًا شهريًا:</p>
<ul>
<li><strong><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw</a></strong> <strong>لتشغيل كل شيء على الطيار الآلي.</strong> يقوم OpenClaw بتشغيل الوكيل على نبضات القلب لمدة 30 دقيقة ولا يرسل لي الأوامر إلا عندما يكون هناك شيء مهم بالفعل، مما يخفف من حالة الخوف من الفومو التي كانت تبقيني ملتصقاً بالشاشة. في السابق، كنت كلما شاهدت الأسعار، كلما زاد تفاعلي مع الأسعار، كلما كان رد فعلي أكثر اندفاعاً.</li>
<li><strong><a href="https://exa.ai/">إكسا</a></strong> <strong>لعمليات البحث الدقيقة في الوقت الحقيقي.</strong> يتصفح Exa مصادر المعلومات المنتقاة بعناية ويلخصها وفقًا لجدول زمني، حتى أحصل على موجز دقيق كل صباح. في السابق، كنت أقضي ساعة يوميًا في غربلة الرسائل غير المرغوب فيها والتكهنات لتحسين محركات البحث للعثور على أخبار موثوقة - ولا يمكن أن يكون ذلك آليًا لأن المواقع المالية تُحدَّث يوميًا لمحاربة الكاشطات.</li>
<li><strong><a href="https://milvus.io/">Milvus</a> للتاريخ الشخصي والتفضيلات.</strong> يقوم Milvus بتخزين تاريخ تداولاتي، ويقوم الوكيل بالبحث فيه قبل أن أتخذ قرارًا ما - إذا كنت على وشك تكرار شيء ندمت عليه، فإنه يخبرني بذلك. في السابق، كانت مراجعة التداولات السابقة مملة بما فيه الكفاية لدرجة أنني لم أفعل ذلك، لذا استمرت الأخطاء نفسها في الحدوث مع مؤشرات مختلفة. <a href="https://zilliz.com/cloud">Zilliz Cloud</a> هو الإصدار المُدار بالكامل من Milvus. إذا كنت ترغب في تجربة خالية من المتاعب، فإن Zilliz Cloud هو خيار رائع<a href="https://cloud.zilliz.com/signup?utm_page=zilliz-cloud-free-tier&amp;utm_button=banner_left&amp;_gl=1*373c3v*_gcl_au*MjEwODY2Nzk5NS4xNzY5Njg1NzY4*_ga*MTU0OTAxMzY5Ni4xNzY5Njg1NzY4*_ga_Q1F8R2NWDP*czE3NzM0MDYzOTEkbzUwJGcwJHQxNzczNDA2MzkxJGo2MCRsMCRoMA..*_ga_KKMVYG8YF2*czE3NzM0MDYzOTEkbzc0JGcwJHQxNzczNDA2MzkxJGo2MCRsMCRoMA..">(الفئة المجانية متاحة</a>).</li>
</ul>
<p>إليك كيفية إعداده، خطوة بخطوة.</p>
<h2 id="Step-1-Get-Real-Time-Market-Intelligence-with-Exa" class="common-anchor-header">الخطوة 1: احصل على معلومات السوق في الوقت الفعلي باستخدام Exa<button data-href="#Step-1-Get-Real-Time-Market-Intelligence-with-Exa" class="anchor-icon" translate="no">
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
    </button></h2><p>من قبل، جربت تصفح التطبيقات المالية، وكتابة أدوات الكشط، والبحث في محطات البيانات الاحترافية. دفنت التطبيقات الإشارة تحت الضوضاء، وتعطلت أدوات الكشط باستمرار، وكانت واجهات برمجة التطبيقات الاحترافية أسعارها مناسبة للمتداولين من المؤسسات. Exa عبارة عن واجهة برمجة تطبيقات بحث مصممة لوكلاء الذكاء الاصطناعي تحل المشكلات المذكورة أعلاه.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Open_Claw_1_fa9d10fd00.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong><a href="https://exa.ai/">Exa</a></strong> عبارة عن واجهة برمجة تطبيقات للبحث على الويب تقوم بإرجاع بيانات منظمة وجاهزة للذكاء الاصطناعي. وهي مدعومة من قبل <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (الخدمة المُدارة بالكامل من Milvus).  إذا كان Perplexity هو محرك بحث يستخدمه البشر، فإن Exa يستخدمه الذكاء الاصطناعي. يقوم الوكيل بإرسال استعلام، وتقوم إكسا بإرجاع نص المقالة والجمل الرئيسية والملخصات على هيئة JSON - وهو مخرجات منظمة يمكن للوكيل تحليلها والتصرف عليها مباشرة، دون الحاجة إلى كشط.</p>
<p>تستخدم إكسا أيضًا البحث الدلالي تحت الغطاء، بحيث يمكن للوكيل الاستعلام بلغة طبيعية. فالاستعلام مثل "لماذا انخفض سهم NVIDIA على الرغم من الأرباح القوية للربع الرابع من عام 2026" يُرجع تفاصيل المحللين من رويترز وبلومبرج، وليس صفحة من طعم النقر على محركات البحث.</p>
<p>لدى Exa فئة مجانية - 1000 عملية بحث في الشهر، وهي أكثر من كافية للبدء. للمتابعة، قم بتثبيت SDK واستبدل مفتاح API الخاص بك:</p>
<pre><code translate="no">pip install exa-py
<button class="copy-code-btn"></button></code></pre>
<p>إليك المكالمة الأساسية:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> exa_py <span class="hljs-keyword">import</span> Exa

exa = Exa(api_key=<span class="hljs-string">&quot;your-api-key&quot;</span>)

<span class="hljs-comment"># Semantic search — describe what you want in plain language</span>
result = exa.search(
    <span class="hljs-string">&quot;Why did NVIDIA stock drop despite strong Q4 2026 earnings&quot;</span>,
    <span class="hljs-built_in">type</span>=<span class="hljs-string">&quot;neural&quot;</span>,          <span class="hljs-comment"># semantic search, not keyword</span>
    num_results=<span class="hljs-number">10</span>,
    start_published_date=<span class="hljs-string">&quot;2026-02-25&quot;</span>,   <span class="hljs-comment"># only search for latest information</span>
    contents={
        <span class="hljs-string">&quot;text&quot;</span>: {<span class="hljs-string">&quot;max_characters&quot;</span>: <span class="hljs-number">3000</span>},       <span class="hljs-comment"># get full article text</span>
        <span class="hljs-string">&quot;highlights&quot;</span>: {<span class="hljs-string">&quot;num_sentences&quot;</span>: <span class="hljs-number">3</span>},     <span class="hljs-comment"># key sentences</span>
        <span class="hljs-string">&quot;summary&quot;</span>: {<span class="hljs-string">&quot;query&quot;</span>: <span class="hljs-string">&quot;What caused the stock drop?&quot;</span>}  <span class="hljs-comment"># AI summary</span>
    }
)

<span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> result.results:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[<span class="hljs-subst">{r.published_date}</span>] <span class="hljs-subst">{r.title}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  Summary: <span class="hljs-subst">{r.summary}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  URL: <span class="hljs-subst">{r.url}</span>\n&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>تقوم معلمة المحتويات بمعظم العمل الشاق هنا - يسحب النص المقال كاملاً، ويستخرج النص النص الكامل، ويستخرج الملخص الجمل الرئيسية، ويُنشئ الملخص ملخصًا مركزًا بناءً على سؤال تقدمه. تستبدل مكالمة واحدة لواجهة برمجة التطبيقات عشرين دقيقة من التنقل بين علامات التبويب.</p>
<p>هذا النمط الأساسي يغطي الكثير، لكن انتهى بي الأمر ببناء أربعة أشكال مختلفة للتعامل مع المواقف المختلفة التي أواجهها بانتظام:</p>
<ul>
<li><strong>التصفية حسب مصداقية المصدر.</strong> بالنسبة لتحليل الأرباح، أريد فقط رويترز أو بلومبرج أو وول ستريت جورنال - وليس مزارع المحتوى التي تعيد كتابة تقاريرها بعد اثنتي عشرة ساعة.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Only financial reports from trusted sources</span>
earnings = exa.search(
    <span class="hljs-string">&quot;NVIDIA Q4 2026 earnings analysis&quot;</span>,
    category=<span class="hljs-string">&quot;financial report&quot;</span>,
    num_results=<span class="hljs-number">5</span>,
    include_domains=[<span class="hljs-string">&quot;reuters.com&quot;</span>, <span class="hljs-string">&quot;bloomberg.com&quot;</span>, <span class="hljs-string">&quot;wsj.com&quot;</span>],
    contents={<span class="hljs-string">&quot;highlights&quot;</span>: <span class="hljs-literal">True</span>}
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>العثور على تحليلات متشابهة.</strong> عندما أقرأ مقالاً واحداً جيداً، أريد المزيد من وجهات النظر حول نفس الموضوع دون البحث عنها يدوياً.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># &quot;Show me more analysis like this one&quot;</span>
similar = exa.find_similar(
    url=<span class="hljs-string">&quot;https://fortune.com/2026/02/25/nvidia-nvda-earnings-q4-results&quot;</span>,
    num_results=<span class="hljs-number">10</span>,
    start_published_date=<span class="hljs-string">&quot;2026-02-20&quot;</span>,
    contents={<span class="hljs-string">&quot;text&quot;</span>: {<span class="hljs-string">&quot;max_characters&quot;</span>: <span class="hljs-number">2000</span>}}
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>البحث العميق عن الأسئلة المعقدة.</strong> لا يمكن الإجابة على بعض الأسئلة من خلال مقال واحد - مثل كيفية تأثير التوترات في الشرق الأوسط على سلاسل توريد أشباه الموصلات. يجمع البحث العميق بين مصادر متعددة ويعيد ملخصات منظمة.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Complex question — needs multi-source synthesis</span>
deep_result = exa.search(
    <span class="hljs-string">&quot;How will Middle East tensions affect global tech supply chain and semiconductor stocks&quot;</span>,
    <span class="hljs-built_in">type</span>=<span class="hljs-string">&quot;deep&quot;</span>,
    num_results=<span class="hljs-number">8</span>,
    contents={
        <span class="hljs-string">&quot;summary&quot;</span>: {
            <span class="hljs-string">&quot;query&quot;</span>: <span class="hljs-string">&quot;Extract: 1) supply chain risk 2) stock impact 3) timeline&quot;</span>
        }
    }
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>رصد الأخبار في الوقت الحقيقي.</strong> خلال ساعات عمل السوق، أحتاج إلى تصفية الأخبار العاجلة إلى اليوم الحالي فقط.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Breaking news only — today&#x27; iss date 2026-03-05</span>
breaking = exa.search(
    <span class="hljs-string">&quot;US stock market breaking news today&quot;</span>,
    category=<span class="hljs-string">&quot;news&quot;</span>,
    num_results=<span class="hljs-number">20</span>,
    start_published_date=<span class="hljs-string">&quot;2026-03-05&quot;</span>,
    contents={<span class="hljs-string">&quot;highlights&quot;</span>: {<span class="hljs-string">&quot;num_sentences&quot;</span>: <span class="hljs-number">2</span>}}
)
<button class="copy-code-btn"></button></code></pre>
<p>لقد كتبت حوالي عشرة نماذج باستخدام هذه الأنماط، تغطي سياسة الاحتياطي الفيدرالي وأرباح التكنولوجيا وأسعار النفط والمؤشرات الكلية. يتم تشغيلها تلقائيًا كل صباح ودفع النتائج إلى هاتفي. ما كان يستغرق ساعة من التصفح يستغرق الآن خمس دقائق من قراءة الملخصات أثناء تناول القهوة.</p>
<h2 id="Step-2-Store-Trading-History-in-Milvus-for-Smarter-Decisions" class="common-anchor-header">الخطوة 2: تخزين سجل التداول في Milvus لاتخاذ قرارات أكثر ذكاءً<button data-href="#Step-2-Store-Trading-History-in-Milvus-for-Smarter-Decisions" class="anchor-icon" translate="no">
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
    </button></h2><p>أصلحت Exa مشكلة معلوماتي. ولكنني كنت ما زلت أكرر نفس الصفقات - البيع بدافع الذعر أثناء الانخفاضات التي تعافت في غضون أيام، ومطاردة الزخم في الأسهم التي كانت بالفعل مبالغًا في أسعارها. كنت أتصرف بناءً على العاطفة وأندم على ذلك وأنسى الدرس في الوقت الذي يأتي فيه موقف مماثل.</p>
<p>كنت بحاجة إلى قاعدة معرفية شخصية: تداولاتي السابقة ومنطقي وإخفاقاتي. ليس شيئًا يجب أن أراجعه يدويًا (لقد جربت ذلك ولم أحافظ عليه أبدًا)، ولكن شيئًا يمكن للوكيل أن يبحث فيه من تلقاء نفسه كلما ظهر موقف مماثل. إذا كنت على وشك تكرار الخطأ، أريد أن يخبرني الوكيل قبل أن أضغط على الزر. إن مطابقة "الموقف الحالي" مع "التجربة السابقة" هي مشكلة بحث عن التشابه تحلّها قواعد البيانات المتجهة، لذا كان يجب تخزين جميع بياناتي في واحدة.</p>
<p>لقد استخدمت <a href="https://github.com/milvus-io/milvus-lite">Milvus Lite،</a> وهو إصدار خفيف الوزن من Milvus يعمل محليًا دون إعداد خادم. إنه مثالي للنماذج الأولية والتجريب. قسمت بياناتي إلى ثلاث مجموعات. بُعد التضمين هو 1536 لمطابقة نموذج التضمين النصي 3-التضمين الصغير الخاص بـ OpenAI، والذي يمكن استخدامه مباشرةً:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI

milvus = MilvusClient(<span class="hljs-string">&quot;./my_investment_brain.db&quot;</span>)
llm = OpenAI()

<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed</span>(<span class="hljs-params">text: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">float</span>]:
    <span class="hljs-keyword">return</span> llm.embeddings.create(
        <span class="hljs-built_in">input</span>=text, model=<span class="hljs-string">&quot;text-embedding-3-small&quot;</span>
    ).data[<span class="hljs-number">0</span>].embedding

<span class="hljs-comment"># Collection 1: past decisions and lessons</span>
<span class="hljs-comment"># Every trade I make, I write a short review afterward</span>
milvus.create_collection(
    <span class="hljs-string">&quot;decisions&quot;</span>,
    dimension=<span class="hljs-number">1536</span>,
    auto_id=<span class="hljs-literal">True</span>
)

<span class="hljs-comment"># Collection 2: my preferences and biases</span>
<span class="hljs-comment"># Things like &quot;I tend to hold tech stocks too long&quot;</span>
milvus.create_collection(
    <span class="hljs-string">&quot;preferences&quot;</span>,
    dimension=<span class="hljs-number">1536</span>,
    auto_id=<span class="hljs-literal">True</span>
)

<span class="hljs-comment"># Collection 3: market patterns I&#x27;ve observed</span>
<span class="hljs-comment"># &quot;When VIX &gt; 30 and Fed is dovish, buy the dip usually works&quot;</span>
milvus.create_collection(
    <span class="hljs-string">&quot;patterns&quot;</span>,
    dimension=<span class="hljs-number">1536</span>,
    auto_id=<span class="hljs-literal">True</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>ترسم المجموعات الثلاث خريطة لثلاثة أنواع من البيانات الشخصية، لكل منها استراتيجية استرجاع مختلفة:</p>
<table>
<thead>
<tr><th><strong>النوع</strong></th><th><strong>ما يخزنه</strong></th><th><strong>كيف يستخدمها الوكيل</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>التفضيلات</strong></td><td>التحيزات، وتحمّل المخاطر، وفلسفة الاستثمار ("أميل إلى الاحتفاظ بأسهم التكنولوجيا لفترة طويلة جدًا")</td><td>يتم تحميلها في سياق الوكيل في كل عملية تشغيل</td></tr>
<tr><td><strong>القرارات والأنماط</strong></td><td>الصفقات السابقة المحددة، والدروس المستفادة، وملاحظات السوق</td><td>يتم استرجاعها عن طريق البحث عن التشابه فقط عند ظهور موقف ذي صلة</td></tr>
<tr><td><strong>المعرفة الخارجية</strong></td><td>تقارير الأبحاث، وإيداعات هيئة الأوراق المالية والبورصات، والبيانات العامة</td><td>غير مخزنة في ميلفوس - يمكن البحث فيها من خلال إكسا</td></tr>
</tbody>
</table>
<p>قد يعني خلطها في مجموعة واحدة إما أن يؤدي إلى تضخيم كل مطالبة بسجل تداول غير ذي صلة أو فقدان التحيزات الأساسية عندما لا تتطابق مع الاستعلام الحالي بشكل كافٍ.</p>
<p>بمجرد وجود المجموعات، يحتاج الوكيل إلى تعبئتها تلقائيًا. لا أرغب في كتابة الملاحظات بعد كل محادثة، لذلك قمتُ ببناء مستخرج ذاكرة يعمل في نهاية كل جلسة دردشة.</p>
<p>يقوم بأمرين: الاستخراج والاستخلاص. يطلب المستخرج من LLM سحب الأفكار المنظمة من المحادثة - القرارات، والتفضيلات، والأنماط، والدروس - ويوجه كل منها إلى المجموعة الصحيحة. قبل تخزين أي شيء، يتحقق من التشابه مع ما هو موجود بالفعل. إذا كانت البصيرة الجديدة مشابهة بنسبة تزيد عن 92% لرؤية جديدة أكثر من 92% لمدخل موجود بالفعل، يتم تخطيها.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json

<span class="hljs-keyword">def</span> <span class="hljs-title function_">extract_and_store_memories</span>(<span class="hljs-params">conversation: <span class="hljs-built_in">list</span>[<span class="hljs-built_in">dict</span>]</span>) -&gt; <span class="hljs-built_in">int</span>:
    <span class="hljs-string">&quot;&quot;&quot;
    After each chat session, extract personal insights
    and store them in Milvus automatically.
    &quot;&quot;&quot;</span>
    <span class="hljs-comment"># Ask LLM to extract structured memories from conversation</span>
    extraction_prompt = <span class="hljs-string">&quot;&quot;&quot;
    Analyze this conversation and extract any personal investment insights.
    Look for:
    1. DECISIONS: specific buy/sell actions and reasoning
    2. PREFERENCES: risk tolerance, sector biases, holding patterns
    3. PATTERNS: market observations, correlations the user noticed
    4. LESSONS: things the user learned or mistakes they reflected on

    Return a JSON array. Each item has:
    - &quot;type&quot;: one of &quot;decision&quot;, &quot;preference&quot;, &quot;pattern&quot;, &quot;lesson&quot;
    - &quot;content&quot;: the insight in 2-3 sentences
    - &quot;confidence&quot;: how explicitly the user stated this (high/medium/low)

    Only extract what the user clearly expressed. Do not infer or guess.
    If nothing relevant, return an empty array.
    &quot;&quot;&quot;</span>

    response = llm.chat.completions.create(
        model=<span class="hljs-string">&quot;gpt-4o&quot;</span>,
        messages=[
            {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: extraction_prompt},
            *conversation
        ],
        response_format={<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;json_object&quot;</span>}
    )

    memories = json.loads(response.choices[<span class="hljs-number">0</span>].message.content)
    stored = <span class="hljs-number">0</span>

    <span class="hljs-keyword">for</span> mem <span class="hljs-keyword">in</span> memories.get(<span class="hljs-string">&quot;items&quot;</span>, []):
        <span class="hljs-keyword">if</span> mem[<span class="hljs-string">&quot;confidence&quot;</span>] == <span class="hljs-string">&quot;low&quot;</span>:
            <span class="hljs-keyword">continue</span>    <span class="hljs-comment"># skip uncertain inferences</span>

        collection = {
            <span class="hljs-string">&quot;decision&quot;</span>: <span class="hljs-string">&quot;decisions&quot;</span>,
            <span class="hljs-string">&quot;lesson&quot;</span>: <span class="hljs-string">&quot;decisions&quot;</span>,
            <span class="hljs-string">&quot;preference&quot;</span>: <span class="hljs-string">&quot;preferences&quot;</span>,
            <span class="hljs-string">&quot;pattern&quot;</span>: <span class="hljs-string">&quot;patterns&quot;</span>
        }.get(mem[<span class="hljs-string">&quot;type&quot;</span>], <span class="hljs-string">&quot;decisions&quot;</span>)

        <span class="hljs-comment"># Check for duplicates — don&#x27;t store the same insight twice</span>
        existing = milvus.search(
            collection,
            data=[embed(mem[<span class="hljs-string">&quot;content&quot;</span>])],
            limit=<span class="hljs-number">1</span>,
            output_fields=[<span class="hljs-string">&quot;text&quot;</span>]
        )

        <span class="hljs-keyword">if</span> existing[<span class="hljs-number">0</span>] <span class="hljs-keyword">and</span> existing[<span class="hljs-number">0</span>][<span class="hljs-number">0</span>][<span class="hljs-string">&quot;distance&quot;</span>] &gt; <span class="hljs-number">0.92</span>:
            <span class="hljs-keyword">continue</span>    <span class="hljs-comment"># too similar to existing memory, skip</span>

        milvus.insert(collection, [{
            <span class="hljs-string">&quot;vector&quot;</span>: embed(mem[<span class="hljs-string">&quot;content&quot;</span>]),
            <span class="hljs-string">&quot;text&quot;</span>: mem[<span class="hljs-string">&quot;content&quot;</span>],
            <span class="hljs-string">&quot;type&quot;</span>: mem[<span class="hljs-string">&quot;type&quot;</span>],
            <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;chat_extraction&quot;</span>,
            <span class="hljs-string">&quot;date&quot;</span>: <span class="hljs-string">&quot;2026-03-05&quot;</span>
        }])
        stored += <span class="hljs-number">1</span>

    <span class="hljs-keyword">return</span> stored
<button class="copy-code-btn"></button></code></pre>
<p>عندما أواجه وضعًا جديدًا في السوق وتبدأ الرغبة في التداول، يقوم الوكيل بتشغيل وظيفة الاستدعاء. أصف ما يحدث، فيقوم بالبحث في المجموعات الثلاث عن السجل التاريخي ذي الصلة:</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">recall_my_experience</span>(<span class="hljs-params">situation: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">dict</span>:
    <span class="hljs-string">&quot;&quot;&quot;
    Given a current market situation, retrieve my relevant
    past experiences, preferences, and observed patterns.
    &quot;&quot;&quot;</span>
    query_vec = embed(situation)

    <span class="hljs-comment"># Search all three collections in parallel</span>
    past_decisions = milvus.search(
        <span class="hljs-string">&quot;decisions&quot;</span>, data=[query_vec], limit=<span class="hljs-number">3</span>,
        output_fields=[<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;date&quot;</span>, <span class="hljs-string">&quot;tag&quot;</span>]
    )
    my_preferences = milvus.search(
        <span class="hljs-string">&quot;preferences&quot;</span>, data=[query_vec], limit=<span class="hljs-number">2</span>,
        output_fields=[<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;type&quot;</span>]
    )
    my_patterns = milvus.search(
        <span class="hljs-string">&quot;patterns&quot;</span>, data=[query_vec], limit=<span class="hljs-number">2</span>,
        output_fields=[<span class="hljs-string">&quot;text&quot;</span>]
    )

    <span class="hljs-keyword">return</span> {
        <span class="hljs-string">&quot;past_decisions&quot;</span>: [h[<span class="hljs-string">&quot;entity&quot;</span>] <span class="hljs-keyword">for</span> h <span class="hljs-keyword">in</span> past_decisions[<span class="hljs-number">0</span>]],
        <span class="hljs-string">&quot;preferences&quot;</span>: [h[<span class="hljs-string">&quot;entity&quot;</span>] <span class="hljs-keyword">for</span> h <span class="hljs-keyword">in</span> my_preferences[<span class="hljs-number">0</span>]],
        <span class="hljs-string">&quot;patterns&quot;</span>: [h[<span class="hljs-string">&quot;entity&quot;</span>] <span class="hljs-keyword">for</span> h <span class="hljs-keyword">in</span> my_patterns[<span class="hljs-number">0</span>]]
    }

<span class="hljs-comment"># When Agent analyzes current tech selloff:</span>
context = recall_my_experience(
    <span class="hljs-string">&quot;tech stocks dropping 3-4% due to Middle East tensions, March 2026&quot;</span>
)

<span class="hljs-comment"># context now contains:</span>
<span class="hljs-comment"># - My 2024-10 lesson about not panic-selling during ME crisis</span>
<span class="hljs-comment"># - My preference: &quot;I tend to overweight geopolitical risk&quot;</span>
<span class="hljs-comment"># - My pattern: &quot;tech selloffs from geopolitics recover in 1-3 weeks&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>على سبيل المثال، عندما انخفضت أسهم شركات التكنولوجيا بنسبة 3-4% بسبب التوترات في الشرق الأوسط في أوائل شهر مارس، قام الوكيل بسحب ثلاثة أشياء: درس من أكتوبر 2024 حول عدم البيع بدافع الذعر أثناء الانخفاض الجيوسياسي، وملاحظة تفضيلية بأنني أميل إلى زيادة الوزن الزائد للمخاطر الجيوسياسية، ونمط سجلته بأن عمليات البيع المكثفة للتكنولوجيا المدفوعة بالتوترات الجيوسياسية عادةً ما تتعافى في غضون أسبوع إلى ثلاثة أسابيع.</p>
<p>أطلق زميلي في العمل على ذلك اسم "التعلم المعزز لمستثمري التجزئة" حيث يتم تدريبي على نموذج يتم تدريبه على دالة الخسارة الخاصة بي. هذا عادل بما فيه الكفاية. على الأقل هناك الآن حلقة تغذية مرتدة بين ما قمت به وما أنا على وشك القيام به.</p>
<h2 id="Step-3-Teach-Your-Agent-to-Analyze-with-OpenClaw-Skills" class="common-anchor-header">الخطوة 3: علّم وكيلك التحليل باستخدام مهارات OpenClaw<button data-href="#Step-3-Teach-Your-Agent-to-Analyze-with-OpenClaw-Skills" class="anchor-icon" translate="no">
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
    </button></h2><p>في هذه المرحلة يكون لدى الوكيل معلومات جيدة<a href="https://exa.ai/">(إكسا</a>) وذاكرة شخصية<a href="https://github.com/milvus-io/milvus-lite">(ميلفوس</a>). ولكن إذا سلمت كلاهما لوكيل (LLM) وقلت له "حلل هذا"، فستحصل على رد عام يشمل كل شيء. فهي تذكر كل زاوية ممكنة وتختتم بـ "يجب على المستثمرين أن يوازنوا بين المخاطر"، وبعبارة أخرى، لا شيء.</p>
<p>الحل هو أن تكتب إطارك التحليلي الخاص بك وتعطيه للوكيل كتعليمات واضحة. ما هي المؤشرات التي تهتم بها، وما هي المواقف التي تعتبرها خطيرة، ومتى تكون متحفظًا مقابل العدوانية. تختلف هذه القواعد من مستثمر لآخر، لذا عليك أن تحددها بنفسك.</p>
<p>يقوم OpenClaw بذلك من خلال المهارات - ملفات تخفيض السعر في دليل المهارات/الدليل. عندما يواجه الوكيل موقفًا ذا صلة، يقوم بتحميل المهارة المطابقة ويتبع إطار العمل الخاص بك بدلاً من الانطلاق الحر.</p>
<p>إليك واحدة كتبتها لتقييم الأسهم بعد تقرير الأرباح:</p>
<pre><code translate="no">---
name: post-earnings-eval
description: &gt;
  Evaluate whether to buy, hold, or sell after an earnings report.
  Trigger when discussing any stock&#x27;s post-earnings price action,
  or when a watchlist stock reports earnings.
---

## Post-Earnings Evaluation Framework

When analyzing a stock after earnings release:

### Step 1: Get the facts
Use Exa to search for:
- Actual vs expected: revenue, EPS, forward guidance
- Analyst reactions from top-tier sources
- Options market implied move vs actual move

### Step 2: Check my history
Use Milvus recall to find:
- Have I traded this stock after earnings before?
- What did I get right or wrong last time?
- Do I have a known bias about this sector?

### Step 3: Apply my rules
- If revenue beat &gt; 5% AND guidance raised → lean BUY
- If stock drops &gt; 5% on a beat → likely sentiment/macro driven
  - Check: is the drop about THIS company or the whole market?
  - Check my history: did I overreact to similar drops before?
- If P/E &gt; 2x sector average after beat → caution, priced for perfection

### Step 4: Output format
Signal: BUY / HOLD / SELL / WAIT
Confidence: High / Medium / Low
Reasoning: 3 bullets max
Past mistake reminder: what I got wrong in similar situations

IMPORTANT: Always surface my past mistakes. I have a tendency to
let fear override data. If my Milvus history shows I regretted
selling after a dip, say so explicitly.
<button class="copy-code-btn"></button></code></pre>
<p>السطر الأخير هو الأكثر أهمية: "أظهر دائمًا أخطائي السابقة. لدي ميل للسماح للخوف بتجاوز البيانات. إذا أظهر تاريخي في ميلفوس أنني ندمت على البيع بعد الانخفاض، فقل ذلك صراحةً." هذه آلية تصحيح مصممة خصيصًا لعلم النفس الخاص بي. ستعمل نسختك على ترميز ميولك الخاصة.</p>
<p>لقد كتبت مهارات مماثلة لتحليل المشاعر، والمؤشرات الكلية، وإشارات تناوب القطاعات. كما كتبت أيضًا مهارات تحاكي كيف سيقيم المستثمرون الذين أعجب بهم نفس الموقف - إطار القيمة الخاص ببافيت، والنهج الكلي لبريدج ووتر. هذه ليست منطلقات لاتخاذ القرار؛ إنها وجهات نظر إضافية.</p>
<p>تحذير: لا تدع أصحاب الماجستير في القانون يحسبون المؤشرات الفنية مثل مؤشر القوة النسبية RSI أو مؤشر الماكد MACD. فهم يهلوسون الأرقام بثقة. قم بحسابها بنفسك أو اتصل بواجهة برمجة تطبيقات مخصصة، وأدخل النتائج في المهارة كمدخلات.</p>
<h2 id="Step-4-Start-Your-Agent-with-OpenClaw-Heartbeat" class="common-anchor-header">الخطوة 4: ابدأ عميلك باستخدام OpenClaw Heartbeat<button data-href="#Step-4-Start-Your-Agent-with-OpenClaw-Heartbeat" class="anchor-icon" translate="no">
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
    </button></h2><p>كل شيء أعلاه لا يزال يتطلب منك تشغيله يدويًا. إذا اضطررت إلى فتح محطة طرفية في كل مرة تريد فيها تحديثًا، فستعود إلى المربع الأول - ربما ستضطر إلى تشغيل تطبيق الوساطة الخاص بك أثناء الاجتماعات مرة أخرى.</p>
<p>تعمل آلية Heartbeat من OpenClaw على إصلاح ذلك. تقوم البوابة باستدعاء الوكيل كل 30 دقيقة (قابلة للتكوين)، ويتحقق الوكيل من ملف HEARTBEAT.md ليقرر ما يجب فعله في تلك اللحظة. إنه ملف ترميز بقواعد تستند إلى الوقت:</p>
<pre><code translate="no"><span class="hljs-meta"># HEARTBEAT.md — runs every 30 minutes automatically</span>

<span class="hljs-meta">## Morning brief (6:30-7:30 AM only)</span>
- Use Exa to search overnight US market news, Asian markets, oil prices
- Search Milvus <span class="hljs-keyword">for</span> my current positions <span class="hljs-keyword">and</span> relevant past experiences
- <span class="hljs-function">Generate a personalized morning <span class="hljs-title">brief</span> (<span class="hljs-params">under <span class="hljs-number">500</span> words</span>)
- Flag anything related to my past mistakes <span class="hljs-keyword">or</span> current holdings
- End <span class="hljs-keyword">with</span> 1-3 action items
- Send the brief to my phone

## Price <span class="hljs-title">alerts</span> (<span class="hljs-params">during US market hours <span class="hljs-number">9</span>:<span class="hljs-number">30</span> AM - <span class="hljs-number">4</span>:<span class="hljs-number">00</span> PM ET</span>)
- Check price changes <span class="hljs-keyword">for</span>: NVDA, TSM, MSFT, AAPL, GOOGL
- If any stock moved more than 3% since last check:
  - Search Milvus <span class="hljs-keyword">for</span>: why I hold <span class="hljs-keyword">this</span> stock, my exit criteria
  - Generate alert <span class="hljs-keyword">with</span> context <span class="hljs-keyword">and</span> recommendation
  - Send alert to my phone

## End of day <span class="hljs-title">summary</span> (<span class="hljs-params">after <span class="hljs-number">4</span>:<span class="hljs-number">30</span> PM ET <span class="hljs-keyword">on</span> weekdays</span>)
- Summarize today&#x27;s market action <span class="hljs-keyword">for</span> my watchlist
- Compare actual moves <span class="hljs-keyword">with</span> my morning expectations
- Note any <span class="hljs-keyword">new</span> patterns worth remembering
</span><button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Open_Claw_2_1690efaffd.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Results-Less-Screen-Time-Fewer-Impulsive-Trades" class="common-anchor-header">النتائج: وقت أقل على الشاشة، وتداولات أقل اندفاعًا<button data-href="#Results-Less-Screen-Time-Fewer-Impulsive-Trades" class="anchor-icon" translate="no">
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
    </button></h2><p>إليك ما ينتجه النظام بالفعل يومًا بعد يوم:</p>
<ul>
<li><strong>موجز الصباح (7:00 صباحًا).</strong> يقوم الوكيل بتشغيل Exa طوال الليل، ويسحب مواقعي والتاريخ ذي الصلة من Milvus، ويرسل ملخصًا مخصصًا إلى هاتفي - أقل من 500 كلمة. ما حدث خلال الليل، وما علاقته بممتلكاتي، وما بين بند إلى ثلاثة بنود للعمل. أقرأه أثناء تنظيف أسناني بالفرشاة.</li>
<li><strong>التنبيهات اليومية (9:30 صباحًا - 4:00 مساءً بالتوقيت الشرقي).</strong> كل 30 دقيقة، يتحقق الوكيل من قائمة المراقبة الخاصة بي. إذا تحرك أي سهم بأكثر من 3%، أتلقى إشعارًا يتضمن السياق: لماذا اشتريته، وأين هو وقف الخسارة، وما إذا كنت قد مررت بموقف مماثل من قبل.</li>
<li><strong>المراجعة الأسبوعية (عطلات نهاية الأسبوع).</strong> يقوم الوكيل بتجميع الأسبوع كاملاً - تحركات السوق، وكيفية مقارنتها بتوقعاتي الصباحية، والأنماط التي تستحق التذكر. أقضي 30 دقيقة في قراءتها يوم السبت. أما باقي أيام الأسبوع، أتعمد الابتعاد عن الشاشة.</li>
</ul>
<p>هذه النقطة الأخيرة هي التغيير الأكبر. فالوكيل لا يوفر الوقت فحسب، بل يحررني أيضًا من مراقبة السوق. لا يمكنك البيع بذعر إذا لم تكن تراقب الأسعار.</p>
<p>قبل هذا النظام، كنت أقضي من 10 إلى 15 ساعة أسبوعيًا في جمع المعلومات ومراقبة السوق ومراجعة الصفقات، مبعثرة عبر الاجتماعات ووقت التنقل والتمرير في وقت متأخر من الليل. أما الآن فهي ساعتان تقريبًا: خمس دقائق في الموجز الصباحي كل يوم، بالإضافة إلى 30 دقيقة في مراجعة نهاية الأسبوع.</p>
<p>جودة المعلومات أفضل أيضًا. فأنا أقرأ ملخصات من رويترز وبلومبرج بدلاً من أي شيء انتشر على تويتر. ومع قيام الوكيل بسحب أخطائي السابقة في كل مرة أميل فيها إلى التصرف، فقد قللت من صفقاتي المتهورة بشكل كبير. لا أستطيع إثبات أن هذا جعلني مستثمرًا أفضل حتى الآن، لكنه جعلني مستثمرًا أقل تهورًا.</p>
<p><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span>التكلفة الإجمالية:</span></span></span> <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>10/شهر</mi><mn>لـOpenClaw،</mn><mo separator="true"> و10/شهر</mo></mrow></semantics></math></span></span> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">لـOpenClaw، و10/شهر</span><span class="mord mathnormal" style="margin-right:0.02691em;">لـOpenClaw،</span></span></span></span> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mpunct"> و10/شهر</span></span></span></span>لـEXA، وقليل من الكهرباء للحفاظ على تشغيل Milvus Lite.</p>
<h2 id="Conclusion" class="common-anchor-header">الخلاصة<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>ظللت أقوم بنفس التداولات المتهورة لأن معلوماتي كانت سيئة، ونادراً ما كنت أراجع تاريخي الخاص، كما أن التحديق في السوق طوال اليوم جعل الأمر أسوأ. لذلك قمت ببناء وكيل ذكاء اصطناعي يحل هذه المشاكل من خلال القيام بثلاثة أشياء:</p>
<ul>
<li><strong>يجمع أخبار السوق الموثوق بها تلقائيًا</strong> <strong>باستخدام</strong> <strong><a href="https://exa.ai/">Exa،</a></strong> بحيث أبدأ كل صباح بموجز موجزًا نظيفًا بدلاً من ساعة من التحديق في السوق.</li>
<li><strong>يتذكر تداولاتي السابقة مع <a href="https://milvus.io/">Milvus</a> ويحذرني</strong> عندما أكون على وشك تكرار الخطأ، باستخدام Milvus كقاعدة بيانات شخصية للمتجهات.</li>
<li><strong>يعمل على</strong> <strong>الطيار الآلي</strong> <strong><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw</a></strong> <strong>ويتصل بي فقط عندما يكون الأمر مهمًا،</strong> باستخدام مهارات OpenClaw و Heartbeat - لا توجد مهام مكررة، ولا يوجد رمز غراء.</li>
</ul>
<p>التكلفة الإجمالية: 20 دولارًا شهريًا. الوكيل لا يتداول أو يلمس أموالي.</p>
<p>لم يكن التغيير الأكبر هو البيانات أو التنبيهات. بل هو أنني توقفت عن مراقبة السوق. لقد نسيت الأمر تمامًا يوم الأربعاء الماضي، وهو ما لم يحدث أبدًا طوال سنوات تداولي. ما زلت أخسر المال في بعض الأحيان، ولكن في كثير من الأحيان أقل بكثير، وأنا في الواقع أستمتع بعطلات نهاية الأسبوع مرة أخرى. لم يقم زملائي في العمل بتحديث النكتة حتى الآن، ولكن امنح الأمر بعض الوقت.</p>
<p>استغرق بناء الوكيل أيضًا عطلتي نهاية أسبوع فقط. قبل عام مضى، كان نفس الإعداد يعني كتابة برامج الجدولة وخطوط أنابيب الإشعارات وإدارة الذاكرة من الصفر. مع OpenClaw، استغرقت معظم ذلك الوقت في توضيح قواعد التداول الخاصة بي، وليس كتابة البنية التحتية.</p>
<p>وبمجرد إنشائها لحالة استخدام واحدة، تكون البنية قابلة للنقل.  استبدل قوالب البحث في Exa بقوالب البحث في OpenClaw، وسيكون لديك وكيل يراقب الأوراق البحثية أو يتتبع المنافسين أو يراقب التغييرات التنظيمية أو يتابع اضطرابات سلسلة التوريد.</p>
<p>إذا كنت ترغب في تجربته</p>
<ul>
<li><strong><a href="https://milvus.io/docs/quickstart.md">Milvus quickstart</a></strong> - احصل على قاعدة بيانات متجهة تعمل محليًا في أقل من خمس دقائق</li>
<li><strong>مستندات</strong><strong><a href="https://docs.openclaw.ai/">OpenClaw</a></strong> - قم بإعداد وكيلك الأول باستخدام المهارات ونبض القلب</li>
<li><strong>واجهة برمجة تطبيقات</strong><strong><a href="https://exa.ai/">إكسا</a></strong> - 1,000 عملية بحث مجانية شهريًا للبدء</li>
</ul>
<p>هل لديك أسئلة أو تريد مساعدة في تصحيح الأخطاء أو تريد فقط إظهار ما قمت ببنائه؟ انضم إلى قناة <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Milvus Slack</a> - إنها أسرع طريقة للحصول على المساعدة من المجتمع والفريق على حد سواء. وإذا كنت تفضل التحدث عن الإعداد الخاص بك على انفراد، فاحجز <a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour?__hstc=175614333.156cb1e50b398e3753dedcd15f8758f6.1769685782884.1773222362027.1773227913204.54&amp;__hssc=175614333.2.1773227913204&amp;__hsfp=1c9f7a3cc56fa6c486704004556598ad&amp;uuid=be611eac-2f37-4c1d-9494-71ae4e097f89">ساعة مكتبية في Milvus</a> لمدة 20 دقيقة.</p>
<h2 id="Keep-Reading" class="common-anchor-header">تابع القراءة<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
<li><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">شرح OpenClaw (المعروف سابقاً باسم Clawdbot وMoltbot): دليل كامل لوكيل الذكاء الاصطناعي المستقل</a></li>
<li><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">دليل خطوة بخطوة لإعداد OpenClaw (Clawdbot/Moltbot سابقاً) مع Slack</a></li>
<li><a href="https://milvus.io/blog/why-ai-agents-like-openclaw-burn-through-tokens-and-how-to-cut-costs.md">لماذا يحرق وكلاء الذكاء الاصطناعي مثل OpenClaw الرموز وكيفية خفض التكاليف</a></li>
<li><a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">لقد استخرجنا نظام ذاكرة OpenClaw وقمنا بفتح مصادره (memsearch)</a></li>
</ul>
