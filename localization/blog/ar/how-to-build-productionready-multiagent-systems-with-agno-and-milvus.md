---
id: how-to-build-productionready-multiagent-systems-with-agno-and-milvus.md
title: كيفية بناء أنظمة متعددة الوكلاء جاهزة للإنتاج باستخدام Agno وMilvus
author: Min Yin
date: 2026-02-10T00:00:00.000Z
cover: assets.zilliz.com/cover_b5fc8a3c48.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  production-ready multi-agent systems, Agno framework, Milvus vector database,
  AgentOS deployment, LLM agent architecture
meta_title: |
  How to Build Production-Ready Multi-Agent Systems with Agno and Milvus
desc: >-
  تعلّم كيفية إنشاء أنظمة متعددة العوامل جاهزة للإنتاج ونشرها وتوسيع نطاقها
  باستخدام Agno وAgentOS وMilvus لأعباء العمل في العالم الحقيقي.
origin: >-
  https://milvus.io/blog/how-to-build-productionready-multiagent-systems-with-agno-and-milvus.md
---
<p>إذا كنت تقوم ببناء وكلاء ذكاء اصطناعي، فربما تكون قد اصطدمت بهذا الحائط: يعمل العرض التوضيحي الخاص بك بشكل رائع، ولكن إدخاله في الإنتاج قصة مختلفة تمامًا.</p>
<p>لقد تناولنا إدارة ذاكرة الوكيل وإعادة الترتيب في منشورات سابقة. الآن دعونا نتناول التحدي الأكبر - بناء وكلاء يصمدون بالفعل في الإنتاج.</p>
<p>إليك الحقيقة: بيئات الإنتاج فوضوية. ونادراً ما يفي وكيل واحد بالغرض، ولهذا السبب تنتشر الأنظمة متعددة الوكلاء في كل مكان. لكن الأطر المتاحة اليوم تنقسم إلى معسكرين: خفيف الوزن الذي يعمل بشكل جيد ولكنه يتعطل تحت الحمل الحقيقي، أو القوي الذي يستغرق وقتاً طويلاً للتعلم والبناء.</p>
<p>لقد قمتُ بتجربة <a href="https://github.com/agno-agi/agno">Agno</a> مؤخرًا، ويبدو أنه يحقق حلًا وسطًا معقولًا يركز على جاهزية الإنتاج دون تعقيد مفرط. لقد اكتسب المشروع أكثر من 37,000 نجمة على GitHub في بضعة أشهر، مما يشير إلى أن المطورين الآخرين يجدونه مفيدًا أيضًا.</p>
<p>في هذا المنشور، سوف أشارك ما تعلمته أثناء بناء نظام متعدد العوامل باستخدام Agno مع <a href="https://milvus.io/">Milvus</a> كطبقة ذاكرة. سنلقي نظرة على كيفية مقارنة Agno ببدائل مثل LangGraph وسنتعرف على تطبيق كامل يمكنك تجربته بنفسك.</p>
<h2 id="What-Is-Agno" class="common-anchor-header">ما هو أغنو؟<button data-href="#What-Is-Agno" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/agno-agi/agno">Agno</a> هو إطار عمل متعدد العوامل مصمم خصيصًا للاستخدام في الإنتاج. يحتوي على طبقتين متميزتين:</p>
<ul>
<li><p><strong>طبقة إطار عمل Agno</strong>: حيث تحدد منطق وكيلك</p></li>
<li><p><strong>طبقة وقت تشغيل AgentOS</strong>: تحول هذا المنطق إلى خدمات HTTP التي يمكنك نشرها فعليًا</p></li>
</ul>
<p>فكّر في الأمر بهذه الطريقة: تحدد طبقة إطار العمل <em>ما</em> يجب أن يفعله وكلاؤك، بينما يتعامل AgentOS مع <em>كيفية</em> تنفيذ هذا العمل وتقديمه.</p>
<h3 id="The-Framework-Layer" class="common-anchor-header">طبقة إطار العمل</h3><p>هذا ما تعمل معه مباشرةً. وهي تقدم ثلاثة مفاهيم أساسية:</p>
<ul>
<li><p><strong>الوكيل</strong>: يتعامل مع نوع معين من المهام</p></li>
<li><p><strong>الفريق</strong>: ينسق بين عدة وكلاء لحل المشاكل المعقدة</p></li>
<li><p><strong>سير العمل</strong>: يحدد ترتيب وهيكل التنفيذ</p></li>
</ul>
<p>شيء واحد أقدّره: لست بحاجة إلى تعلم لغة برمجة رقمية DSL جديدة أو رسم مخططات انسيابية. يتم تعريف سلوك الوكيل باستخدام استدعاءات دالة بايثون القياسية. يتعامل إطار العمل مع استدعاء LLM وتنفيذ الأداة وإدارة الذاكرة.</p>
<h3 id="The-AgentOS-Runtime-Layer" class="common-anchor-header">طبقة وقت تشغيل AgentOS</h3><p>تم تصميم AgentOS لتلبية أحجام الطلبات الكبيرة من خلال التنفيذ غير المتزامن، كما أن بنيته عديمة الحالة تجعل التوسع سهلاً ومباشراً.</p>
<p>تتضمن الميزات الرئيسية ما يلي:</p>
<ul>
<li><p>تكامل واجهة برمجة FastAPI المدمج لعرض الوكلاء كنقاط نهاية HTTP</p></li>
<li><p>إدارة الجلسات وتدفق الاستجابات</p></li>
<li><p>مراقبة نقاط النهاية</p></li>
<li><p>دعم التوسع الأفقي</p></li>
</ul>
<p>من الناحية العملية، يتعامل AgentOS مع معظم أعمال البنية التحتية، مما يتيح لك التركيز على منطق الوكيل نفسه.</p>
<p>فيما يلي عرض عالي المستوى لبنية Agno.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_dfbf444ee6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Agno-vs-LangGraph" class="common-anchor-header">Agno مقابل LangGraph<button data-href="#Agno-vs-LangGraph" class="anchor-icon" translate="no">
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
    </button></h2><p>لفهم أين يناسب Agno، دعنا نقارنه مع LangGraph - أحد أكثر الأطر متعددة الوكلاء استخدامًا على نطاق واسع.</p>
<p>يستخدم<a href="https://www.langchain.com/langgraph"><strong>LangGraph</strong></a> آلة حالة قائمة على الرسم البياني. تقوم بنمذجة سير عمل وكيلك بالكامل كرسم بياني: الخطوات هي العقد، ومسارات التنفيذ هي الحواف. يعمل هذا بشكل جيد عندما تكون عمليتك ثابتة ومرتبة بشكل صارم. ولكن بالنسبة للسيناريوهات المفتوحة أو سيناريوهات المحادثة، قد يبدو ذلك مقيدًا. كلما أصبحت التفاعلات أكثر ديناميكية، يصبح الحفاظ على رسم بياني نظيف أكثر صعوبة.</p>
<p>يتخذ<strong>Agno</strong> نهجًا مختلفًا. فبدلاً من أن تكون طبقة تزامن بحتة، فهي نظام من طرف إلى طرف. حدّد سلوك وكيلك، وسيعرضه AgentOS تلقائيًا كخدمة HTTP جاهزة للإنتاج - مع المراقبة وقابلية التوسع ودعم المحادثة متعددة الأدوار المضمنة. لا توجد بوابة API منفصلة، ولا إدارة مخصصة للجلسات، ولا أدوات تشغيلية إضافية.</p>
<p>إليك مقارنة سريعة:</p>
<table>
<thead>
<tr><th>البُعد</th><th>لانجغراف</th><th>أغنو</th></tr>
</thead>
<tbody>
<tr><td>نموذج التنسيق</td><td>تعريف صريح للرسم البياني باستخدام العقد والحواف</td><td>تدفقات العمل التوضيحية المحددة بلغة بايثون</td></tr>
<tr><td>إدارة الحالة</td><td>فئات حالة مخصصة محددة ومدارة من قبل المطورين</td><td>نظام ذاكرة مدمج</td></tr>
<tr><td>التصحيح والمراقبة</td><td>لانجسميث (مدفوع)</td><td>واجهة مستخدم AgentOS (مفتوحة المصدر)</td></tr>
<tr><td>نموذج وقت التشغيل</td><td>مدمج في وقت تشغيل موجود</td><td>خدمة مستقلة قائمة على FastAPI</td></tr>
<tr><td>تعقيد النشر</td><td>يتطلب إعداداً إضافياً عبر LangServe</td><td>يعمل خارج الصندوق</td></tr>
</tbody>
</table>
<p>يمنحك LangGraph المزيد من المرونة والتحكم الدقيق. يعمل Agno على تحسين الوقت اللازم للإنتاج بشكل أسرع. يعتمد الاختيار الصحيح على مرحلة مشروعك والبنية التحتية الحالية ومستوى التخصيص الذي تحتاجه. إذا كنت غير متأكد، فإن تشغيل إثبات صغير للمفهوم مع كليهما ربما يكون الطريقة الأكثر موثوقية لاتخاذ القرار.</p>
<h2 id="Choosing-Milvus-for-the-Agent-Memory-Layer" class="common-anchor-header">اختيار ميلفوس لطبقة ذاكرة العميل<button data-href="#Choosing-Milvus-for-the-Agent-Memory-Layer" class="anchor-icon" translate="no">
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
    </button></h2><p>بمجرد اختيار إطار العمل، فإن القرار التالي هو كيفية تخزين الذاكرة والمعرفة. نحن نستخدم Milvus لهذا الغرض. <a href="https://milvus.io/">Milvus</a> هي قاعدة البيانات المتجهة مفتوحة المصدر الأكثر شيوعًا المصممة لأعباء عمل الذكاء الاصطناعي مع <a href="https://github.com/milvus-io/milvus">أكثر من 42,000</a> نجمة <a href="https://github.com/milvus-io/milvus">على GitHub</a>.</p>
<p><strong>تتمتع Agno بدعم Milvus الأصلي.</strong> تغلف الوحدة النمطية <code translate="no">agno.vectordb.milvus</code> ميزات الإنتاج مثل إدارة الاتصال، وإعادة المحاولة التلقائية، والكتابة المجمعة وتوليد التضمين. لستَ بحاجة إلى إنشاء تجمعات اتصال أو التعامل مع حالات فشل الشبكة بنفسك - فبضعة أسطر من لغة Python تمنحك طبقة ذاكرة متجهة عاملة.</p>
<p><strong>يتناسب ميلفوس مع احتياجاتك.</strong> وهو يدعم ثلاثة <a href="https://milvus.io/docs/install-overview.md">أوضاع للنشر:</a></p>
<ul>
<li><p><strong>ميلفوس لايت</strong>: خفيف الوزن وقائم على الملفات - رائع للتطوير والاختبار المحليين</p></li>
<li><p><strong>مستقل</strong>: نشر أحادي الخادم لأعباء عمل الإنتاج</p></li>
<li><p><strong>موزع</strong>: مجموعة كاملة لسيناريوهات واسعة النطاق</p></li>
</ul>
<p>يمكنك البدء باستخدام Milvus Lite للتحقق من صحة ذاكرة وكيلك محليًا، ثم الانتقال إلى المستقل أو الموزع مع تزايد حركة المرور - دون تغيير رمز التطبيق الخاص بك. هذه المرونة مفيدة بشكل خاص عندما تقوم بالتكرار بسرعة في المراحل المبكرة ولكنك تحتاج إلى مسار واضح للتوسع لاحقاً.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_1_1en_e0294d0ffa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Step-by-Step-Building-a-Production-Ready-Agno-Agent-with-Milvus" class="common-anchor-header">خطوة بخطوة: بناء وكيل أجنو جاهز للإنتاج مع ميلفوس<button data-href="#Step-by-Step-Building-a-Production-Ready-Agno-Agent-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>لنقم ببناء وكيل جاهز للإنتاج من الصفر.</p>
<p>سنبدأ بمثال بسيط لعامل واحد لإظهار سير العمل الكامل. ثم سنقوم بتوسيعه إلى نظام متعدد الوكلاء. سيقوم AgentOS بتجميع كل شيء تلقائيًا كخدمة HTTP قابلة للاستدعاء.</p>
<h3 id="1-Deploying-Milvus-Standalone-with-Docker" class="common-anchor-header">1. نشر Milvus Standalone مع Docker</h3><p><strong>(1) تنزيل ملفات النشر</strong></p>
<pre><code translate="no">**wget** **
&lt;https://github.com/Milvus-io/Milvus/releases/download/v2.****5****.****12****/Milvus-standalone-docker-compose.yml&gt; -O docker-compose.yml**
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) بدء تشغيل خدمة Milvus</strong></p>
<pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/_80575354d3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Core-Implementation" class="common-anchor-header">2. التنفيذ الأساسي</h3><pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">from</span> pathlib <span class="hljs-keyword">import</span> Path
<span class="hljs-keyword">from</span> agno.os <span class="hljs-keyword">import</span> AgentOS
<span class="hljs-keyword">from</span> agno.agent <span class="hljs-keyword">import</span> Agent
<span class="hljs-keyword">from</span> agno.models.openai <span class="hljs-keyword">import</span> OpenAIChat
<span class="hljs-keyword">from</span> agno.knowledge.knowledge <span class="hljs-keyword">import</span> Knowledge
<span class="hljs-keyword">from</span> agno.vectordb.milvus <span class="hljs-keyword">import</span> Milvus
<span class="hljs-keyword">from</span> agno.knowledge.embedder.openai <span class="hljs-keyword">import</span> OpenAIEmbedder
<span class="hljs-keyword">from</span> agno.db.sqlite <span class="hljs-keyword">import</span> SqliteDb
os.environ\[<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>\] = <span class="hljs-string">&quot;you-key-here&quot;</span>
data_dir = Path(<span class="hljs-string">&quot;./data&quot;</span>)
data_dir.mkdir(exist_ok=<span class="hljs-literal">True</span>)
knowledge_base = Knowledge(
    contents_db=SqliteDb(
        db_file=<span class="hljs-built_in">str</span>(data_dir / <span class="hljs-string">&quot;knowledge_contents.db&quot;</span>),
        knowledge_table=<span class="hljs-string">&quot;knowledge_contents&quot;</span>,
    ),
    vector_db=Milvus(
        collection=<span class="hljs-string">&quot;agno_knowledge&quot;</span>,
        uri=<span class="hljs-string">&quot;http://192.168.x.x:19530&quot;</span>,
        embedder=OpenAIEmbedder(<span class="hljs-built_in">id</span>=<span class="hljs-string">&quot;text-embedding-3-small&quot;</span>),
    ),
)
*<span class="hljs-comment"># Create Agent*</span>
agent = Agent(
    name=<span class="hljs-string">&quot;Knowledge Assistant&quot;</span>,
    model=OpenAIChat(<span class="hljs-built_in">id</span>=<span class="hljs-string">&quot;gpt-4o&quot;</span>),
    instructions=\[
        <span class="hljs-string">&quot;You are a knowledge base assistant that helps users query and manage knowledge base content.&quot;</span>,
        <span class="hljs-string">&quot;Answer questions in English.&quot;</span>,
        <span class="hljs-string">&quot;Always search the knowledge base before answering questions.&quot;</span>,
        <span class="hljs-string">&quot;If the knowledge base is empty, kindly prompt the user to upload documents.&quot;</span>
    \],
    knowledge=knowledge_base,
    search_knowledge=<span class="hljs-literal">True</span>,
    db=SqliteDb(
        db_file=<span class="hljs-built_in">str</span>(data_dir / <span class="hljs-string">&quot;agent.db&quot;</span>),
        session_table=<span class="hljs-string">&quot;agent_sessions&quot;</span>,
    ),
    add_history_to_context=<span class="hljs-literal">True</span>,
    markdown=<span class="hljs-literal">True</span>,
)
agent_os = AgentOS(agents=\[agent\])
app = agent_os.get_app()
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n🚀 Starting service...&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;📍 http://localhost:7777&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;💡 Please upload documents to the knowledge base in the UI\n&quot;</span>)
    agent_os.serve(app=<span class="hljs-string">&quot;knowledge_agent:app&quot;</span>, port=<span class="hljs-number">7777</span>, reload=<span class="hljs-literal">False</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>(1) تشغيل الوكيل</strong></p>
<pre><code translate="no">**python** **knowledge_agent.py**
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_df885706cf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="3-Connecting-to-the-AgentOS-Console" class="common-anchor-header">3. الاتصال بوحدة تحكم AgentOS</h3><p>https://os.agno.com/</p>
<p><strong>(1) إنشاء حساب وتسجيل الدخول</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_db0af51e58.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(2) قم بتوصيل وكيلك بـ AgentOS</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_0a8c6f9436.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(3) تكوين المنفذ المكشوف واسم الوكيل</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_3844011799.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(4) إضافة المستندات وفهرستها في ميلفوس</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/5_776ea7ca11.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/6_90b97c4660.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/7_a98262d8c5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/8_58b7d77eea.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(5) اختبار الوكيل من طرف إلى طرف</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/_6e61038ba5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>في هذا الإعداد، يتعامل ميلفوس مع الاسترجاع الدلالي عالي الأداء. عندما يتلقى مساعد قاعدة المعرفة سؤالاً تقنيًا، فإنه يستدعي الأداة <code translate="no">search_knowledge</code> لتضمين الاستعلام، ويسترجع أجزاء المستندات الأكثر صلة من ميلفوس، ويستخدم تلك النتائج كأساس لاستجابته.</p>
<p>يوفر Milvus ثلاثة خيارات للنشر، مما يسمح لك باختيار البنية التي تناسب متطلباتك التشغيلية مع الحفاظ على اتساق واجهات برمجة التطبيقات على مستوى التطبيق في جميع أوضاع النشر.</p>
<p>يعرض العرض التوضيحي أعلاه تدفق الاسترجاع والتوليد الأساسي. ومع ذلك، لنقل هذا التصميم إلى بيئة الإنتاج، يجب مناقشة العديد من الجوانب المعمارية بمزيد من التفصيل.</p>
<h2 id="How-Retrieval-Results-Are-Shared-Across-Agents" class="common-anchor-header">كيف تتم مشاركة نتائج الاسترجاع عبر الوكلاء<button data-href="#How-Retrieval-Results-Are-Shared-Across-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>يحتوي وضع فريق Agno على خيار <code translate="no">share_member_interactions=True</code> الذي يسمح للوكلاء اللاحقين بوراثة تاريخ التفاعل الكامل للوكلاء السابقين. من الناحية العملية، هذا يعني أنه عندما يسترجع الوكيل الأول المعلومات من ميلفوس، يمكن للوكلاء اللاحقين إعادة استخدام تلك النتائج بدلاً من إجراء نفس البحث مرة أخرى.</p>
<ul>
<li><p><strong>الجانب الإيجابي:</strong> يتم إطفاء تكاليف الاسترجاع عبر الفريق. يدعم البحث المتجه الواحد عدة وكلاء، مما يقلل من الاستعلامات الزائدة عن الحاجة.</p></li>
<li><p><strong>الجانب السلبي:</strong> تتضخم جودة الاسترجاع. إذا أرجع البحث الأولي نتائج غير كاملة أو غير دقيقة، فإن هذا الخطأ ينتشر إلى كل وكيل يعتمد عليه.</p></li>
</ul>
<p>هذا هو السبب الذي يجعل دقة الاسترجاع أكثر أهمية في الأنظمة متعددة الوكلاء. لا يؤدي الاسترجاع السيئ إلى تدهور استجابة وكيل واحد فقط - بل يؤثر على الفريق بأكمله.</p>
<p>إليك مثال على إعداد الفريق:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> agno.team <span class="hljs-keyword">import</span> Team
analyst = Agent(
    name=<span class="hljs-string">&quot;Data Analyst&quot;</span>,
    model=OpenAIChat(<span class="hljs-built_in">id</span>=<span class="hljs-string">&quot;gpt-4o&quot;</span>),
    knowledge=knowledge_base,
    search_knowledge=<span class="hljs-literal">True</span>,
    instructions=\[<span class="hljs-string">&quot;Analyze data and extract key metrics&quot;</span>\]
)
writer = Agent(
    name=<span class="hljs-string">&quot;Report Writer&quot;</span>,
    model=OpenAIChat(<span class="hljs-built_in">id</span>=<span class="hljs-string">&quot;gpt-4o&quot;</span>),
    knowledge=knowledge_base,
    search_knowledge=<span class="hljs-literal">True</span>,
    instructions=\[<span class="hljs-string">&quot;Write reports based on the analysis results&quot;</span>\]
)
team = Team(
    agents=\[analyst, writer\],
    share_member_interactions=<span class="hljs-literal">True</span>,  *<span class="hljs-comment"># Share knowledge retrieval results*</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Why-Agno-and-Milvus-Are-Layered-Separately" class="common-anchor-header">لماذا يتم وضع Agno و Milvus في طبقات منفصلة<button data-href="#Why-Agno-and-Milvus-Are-Layered-Separately" class="anchor-icon" translate="no">
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
    </button></h2><p>في هذه البنية، تقع <strong>Agno</strong> في طبقة المحادثة والتنسيق. وهو مسؤول عن إدارة تدفق الحوار، وتنسيق الوكلاء، والحفاظ على حالة المحادثة، مع استمرار سجل الجلسة في قاعدة بيانات علائقية. يتم التعامل مع معرفة المجال الفعلي للنظام - مثل وثائق المنتج والتقارير الفنية - بشكل منفصل وتخزينها كمتضمنات متجهة في <strong>Milvus</strong>. يحافظ هذا التقسيم الواضح على الفصل التام بين منطق المحادثة وتخزين المعرفة.</p>
<p>لماذا هذا مهم من الناحية التشغيلية:</p>
<ul>
<li><p><strong>التوسع المستقل</strong>: مع تزايد الطلب على Agno، أضف المزيد من مثيلات Agno. مع نمو حجم الاستعلام، قم بتوسيع Milvus عن طريق إضافة عقد الاستعلام. تتوسع كل طبقة بمعزل عن الأخرى.</p></li>
<li><p><strong>احتياجات الأجهزة المختلفة</strong>: Agno مرتبط بوحدة المعالجة المركزية والذاكرة (استدلال LLM، تنفيذ سير العمل). تم تحسين Milvus لاسترجاع المتجهات عالية الإنتاجية (إدخال/إخراج القرص، وأحيانًا تسريع وحدة معالجة الرسومات). الفصل بينهما يمنع التنازع على الموارد.</p></li>
<li><p><strong>تحسين التكلفة</strong>: يمكنك ضبط وتخصيص الموارد لكل طبقة بشكل مستقل.</p></li>
</ul>
<p>يمنحك هذا النهج متعدد الطبقات بنية أكثر كفاءة ومرونة وجاهزية للإنتاج.</p>
<h2 id="What-to-Monitor-When-Using-Agno-with-Milvus" class="common-anchor-header">ما يجب مراقبته عند استخدام Agno مع Milvus<button data-href="#What-to-Monitor-When-Using-Agno-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>تتمتع Agno بقدرات تقييم مدمجة، ولكن إضافة Milvus توسع ما يجب عليك مراقبته. بناءً على خبرتنا، ركز على ثلاثة مجالات:</p>
<ul>
<li><p><strong>جودة الاسترجاع</strong>: هل المستندات التي تُرجعها Milvus ذات صلة فعلية بالاستعلام، أم أنها متشابهة ظاهريًا فقط على مستوى المتجه؟</p></li>
<li><p><strong>إخلاص الإجابة</strong>: هل الاستجابة النهائية تستند إلى المحتوى المسترجع، أم أن آلية LLM تولد ادعاءات غير مدعومة؟</p></li>
<li><p><strong>تحليل زمن الاستجابة من النهاية إلى النهاية</strong>: لا تتبع فقط إجمالي زمن الاستجابة. بل قسّمه حسب المرحلة - توليد التضمينات، والبحث عن المتجهات، وتجميع السياق، واستدلال LLM - حتى تتمكن من تحديد أماكن حدوث التباطؤ.</p></li>
</ul>
<p><strong>مثال عملي:</strong> عندما تنمو مجموعة Milvus الخاصة بك من مليون إلى 10 ملايين متجه، قد تلاحظ أن زمن استجابة الاسترجاع يزداد. عادةً ما تكون هذه إشارة إلى ضبط معلمات الفهرس (مثل <code translate="no">nlist</code> و <code translate="no">nprobe</code>) أو التفكير في الانتقال من النشر المستقل إلى النشر الموزع.</p>
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
    </button></h2><p>يتطلب بناء أنظمة الوكلاء الجاهزة للإنتاج أكثر من مجرد توصيل مكالمات LLM وعروض الاسترجاع. أنت بحاجة إلى حدود معمارية واضحة، وبنية تحتية تتوسع بشكل مستقل، وإمكانية المراقبة لاكتشاف المشكلات في وقت مبكر.</p>
<p>في هذا المنشور، استعرضت في هذا المنشور كيف يمكن لأجنو وميلفوس العمل معًا: Agno للتنسيق متعدد العوامل، و Milvus للذاكرة القابلة للتطوير والاسترجاع الدلالي. من خلال إبقاء هذه الطبقات منفصلة، يمكنك الانتقال من النموذج الأولي إلى الإنتاج دون إعادة كتابة المنطق الأساسي - وتوسيع نطاق كل مكون حسب الحاجة.</p>
<p>إذا كنت تقوم بتجربة إعدادات مماثلة، سأكون فضوليًا لسماع ما يناسبك.</p>
<p><strong>أسئلة حول ميلفوس؟</strong> انضم إلى <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">قناة Slack</a> الخاصة بنا أو احجز جلسة <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">ساعات عمل Milvus</a> لمدة 20 دقيقة.</p>
