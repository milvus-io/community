---
id: how-to-build-productionready-ai-agents-with-deep-agents-and-milvus.md
title: كيفية بناء وكلاء ذكاء اصطناعي جاهزين للإنتاج باستخدام الوكلاء العميقين وMilvus
author: Min Yin
date: 2026-03-02T00:00:00.000Z
cover: assets.zilliz.com/cover_deepagents_b45edd5f94.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Deep Agents, AI agents, Milvus vector database, LangChain agents, persistent
  agent memory
meta_title: |
  How to Build Production-Ready AI Agents with Deep Agents
desc: >-
  تعرّف على كيفية إنشاء وكلاء ذكاء اصطناعي قابلين للتطوير باستخدام Deep Agents
  وMilvus للمهام طويلة الأمد، وتكاليف الرموز الرمزية المنخفضة، والذاكرة
  المستمرة.
origin: >-
  https://milvus.io/blog/how-to-build-productionready-ai-agents-with-deep-agents-and-milvus.md
---
<p>تقوم المزيد والمزيد من الفرق ببناء المزيد من وكلاء الذكاء الاصطناعي، وأصبحت المهام التي يكلفون بها أكثر تعقيدًا. تتضمن العديد من مهام سير العمل في العالم الحقيقي مهام طويلة الأمد ذات خطوات متعددة والعديد من استدعاءات الأدوات. ومع نمو هذه المهام، تظهر مشكلتان بسرعة: ارتفاع تكاليف الرموز الرمزية وحدود نافذة سياق النموذج. كما يحتاج الوكلاء في كثير من الأحيان إلى تذكر المعلومات عبر الجلسات، مثل نتائج البحث السابقة أو تفضيلات المستخدم أو المحادثات السابقة.</p>
<p>وتساعد أطر عمل مثل <a href="https://docs.langchain.com/oss/python/deepagents/overview"><strong>Deep Agents،</strong></a> التي أصدرتها LangChain، في تنظيم سير العمل هذا. فهي توفر طريقة منظمة لتشغيل الوكلاء، مع دعم لتخطيط المهام، والوصول إلى الملفات، وتفويض الوكيل الفرعي. وهذا يجعل من السهل بناء وكلاء يمكنهم التعامل مع المهام الطويلة متعددة الخطوات بشكل أكثر موثوقية.</p>
<p>لكن تدفقات العمل وحدها لا تكفي. يحتاج الوكلاء أيضًا إلى <strong>ذاكرة طويلة المدى</strong> حتى يتمكنوا من استرجاع المعلومات المفيدة من الجلسات السابقة. وهنا يأتي دور <a href="https://milvus.io/"><strong>Milvus،</strong></a> وهي قاعدة بيانات متجهة مفتوحة المصدر. من خلال تخزين تضمينات المحادثات والمستندات ونتائج الأدوات، تسمح Milvus للوكلاء بالبحث واسترجاع المعارف السابقة.</p>
<p>في هذه المقالة، سنشرح في هذه المقالة كيفية عمل Deep Agents ونوضح كيفية دمجها مع Milvus لبناء وكلاء ذكاء اصطناعي مع تدفقات عمل منظمة وذاكرة طويلة الأجل.</p>
<h2 id="What-Is-Deep-Agents" class="common-anchor-header">ما هو Deep Agents؟<button data-href="#What-Is-Deep-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>الوكلاء<strong>العميقون</strong> هو إطار عمل للوكلاء مفتوح المصدر أنشأه فريق LangChain. وهو مصمم لمساعدة الوكلاء على التعامل مع المهام طويلة الأمد ومتعددة الخطوات بشكل أكثر موثوقية. وهو يركز على ثلاث قدرات رئيسية:</p>
<p><strong>1. تخطيط المهام</strong></p>
<p>يتضمن Deep Agents أدوات مدمجة مثل <code translate="no">write_todos</code> و <code translate="no">read_todos</code>. يقوم الوكيل بتقسيم مهمة معقدة إلى قائمة مهام واضحة، ثم يعمل من خلال كل عنصر خطوة بخطوة، ويضع علامة على المهام عند اكتمالها.</p>
<p><strong>2. الوصول إلى نظام الملفات</strong></p>
<p>يوفر أدوات مثل <code translate="no">ls</code> و <code translate="no">read_file</code> و <code translate="no">write_file</code> ، بحيث يمكن للوكيل عرض الملفات وقراءتها وكتابتها. إذا أنتجت الأداة مخرجات كبيرة، يتم حفظ النتيجة تلقائيًا في ملف بدلاً من البقاء في نافذة سياق النموذج. يساعد ذلك في منع امتلاء نافذة السياق.</p>
<p><strong>3. تفويض الوكيل الفرعي</strong></p>
<p>باستخدام الأداة <code translate="no">task</code> ، يمكن للوكيل الرئيسي تفويض المهام الفرعية إلى وكلاء فرعيين متخصصين. لكل وكيل فرعي نافذة سياق وأدوات خاصة به، مما يساعد في الحفاظ على تنظيم العمل.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_59401bc198.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>من الناحية الفنية، الوكيل الذي تم إنشاؤه باستخدام <code translate="no">create_deep_agent</code> هو عبارة عن أداة <strong>LangGraph StateGraph</strong> مجمّعة. (LangGraph هي مكتبة سير العمل التي طورها فريق LangChain، و StateGraph هي بنية الحالة الأساسية لها). لهذا السبب، يمكن للوكلاء العميقين استخدام ميزات LangGraph مباشرةً مثل تدفق الإخراج، ونقاط التفتيش، والتفاعل البشري داخل الحلقة.</p>
<p><strong>فما الذي يجعل الوكلاء العميقين مفيدة في الممارسة العملية؟</strong></p>
<p>غالبًا ما تواجه مهام الوكيل طويلة الأمد مشاكل مثل حدود السياق والتكاليف الرمزية العالية والتنفيذ غير الموثوق به. يساعد برنامج Deep Agents في حل هذه المشكلات من خلال جعل مهام سير عمل الوكيل أكثر تنظيماً وأسهل في إدارتها. من خلال تقليل النمو غير الضروري للسياق، فإنه يقلل من استخدام الرمز المميز ويحافظ على المهام طويلة الأمد أكثر فعالية من حيث التكلفة.</p>
<p>كما أنه يجعل المهام المعقدة متعددة الخطوات أسهل في التنظيم. يمكن تشغيل المهام الفرعية بشكل مستقل دون التداخل مع بعضها البعض، مما يحسن الموثوقية. في الوقت نفسه، يتسم النظام بالمرونة، مما يسمح للمطورين بتخصيصه وتوسيعه مع نمو وكلائهم من تجارب بسيطة إلى تطبيقات الإنتاج.</p>
<h2 id="Customization-in-Deep-Agents" class="common-anchor-header">التخصيص في الوكلاء العميقين<button data-href="#Customization-in-Deep-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>لا يمكن لإطار عمل عام أن يغطي كل احتياجات الصناعة أو الأعمال. صُمم Deep Agents ليكون مرناً، بحيث يمكن للمطورين تعديله ليناسب حالات الاستخدام الخاصة بهم.</p>
<p>مع التخصيص، يمكنك</p>
<ul>
<li><p>ربط أدواتك الداخلية وواجهات برمجة التطبيقات الخاصة بك</p></li>
<li><p>تحديد مهام سير العمل الخاصة بالمجال</p></li>
<li><p>التأكد من أن الوكيل يتبع قواعد العمل</p></li>
<li><p>دعم الذاكرة ومشاركة المعرفة عبر الجلسات</p></li>
</ul>
<p>فيما يلي الطرق الرئيسية التي يمكنك من خلالها تخصيص الوكيل العميق:</p>
<h3 id="System-Prompt-Customization" class="common-anchor-header">تخصيص موجه النظام</h3><p>يمكنك إضافة موجه النظام الخاص بك فوق التعليمات الافتراضية التي توفرها البرامج الوسيطة. وهذا مفيد لتحديد قواعد المجال وسير العمل.</p>
<p>قد تتضمن المطالبة المخصصة الجيدة ما يلي:</p>
<ul>
<li><strong>قواعد سير عمل المجال</strong></li>
</ul>
<p>مثال: "بالنسبة لمهام تحليل البيانات، قم دائمًا بإجراء تحليل استكشافي قبل بناء نموذج."</p>
<ul>
<li><strong>أمثلة محددة</strong></li>
</ul>
<p>مثال: "اجمع بين طلبات البحث في الأدبيات المتشابهة في عنصر مهام واحد."</p>
<ul>
<li><strong>قواعد الإيقاف</strong></li>
</ul>
<p>مثال: "التوقف إذا تم استخدام أكثر من 100 طلب أداة."</p>
<ul>
<li><strong>إرشادات تنسيق الأدوات</strong></li>
</ul>
<p>مثال: "استخدم <code translate="no">grep</code> للعثور على مواقع التعليمات البرمجية، ثم استخدم <code translate="no">read_file</code> لعرض التفاصيل."</p>
<p>تجنب تكرار التعليمات التي تتعامل معها البرامج الوسيطة بالفعل، وتجنب إضافة قواعد تتعارض مع السلوك الافتراضي.</p>
<h3 id="Tools" class="common-anchor-header">الأدوات</h3><p>يمكنك إضافة أدواتك الخاصة إلى مجموعة الأدوات المدمجة. تُعرَّف الأدوات على أنها دوال بايثون عادية، وتصف السلاسل الوثائقية الخاصة بها ما تقوم به.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">def</span> <span class="hljs-title function_">internet_search</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-string">&quot;&quot;&quot;Run a web search&quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> tavily_client.search(query)
agent = create_deep_agent(tools=[internet_search])
<button class="copy-code-btn"></button></code></pre>
<p>يدعم Deep Agents أيضًا الأدوات التي تتبع معيار بروتوكول سياق النموذج (MCP) من خلال <code translate="no">langchain-mcp-adapters</code>.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain_mcp_adapters.client <span class="hljs-keyword">import</span> MultiServerMCPClient
<span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">main</span>():
    mcp_client = MultiServerMCPClient(...)
    mcp_tools = <span class="hljs-keyword">await</span> mcp_client.get_tools()
    agent = create_deep_agent(tools=mcp_tools)
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">for</span> chunk <span class="hljs-keyword">in</span> agent.astream({<span class="hljs-string">&quot;messages&quot;</span>: [{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;...&quot;</span>}]}):
        chunk[<span class="hljs-string">&quot;messages&quot;</span>][-<span class="hljs-number">1</span>].pretty_print()
<button class="copy-code-btn"></button></code></pre>
<h3 id="Middleware" class="common-anchor-header">البرمجيات الوسيطة</h3><p>يمكنك كتابة برامج وسيطة مخصصة من أجل:</p>
<ul>
<li><p>إضافة أو تعديل الأدوات</p></li>
<li><p>ضبط المطالبات</p></li>
<li><p>الربط بمراحل مختلفة من تنفيذ الوكيل</p></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain_core.tools <span class="hljs-keyword">import</span> tool
<span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">from</span> deepagents.middleware <span class="hljs-keyword">import</span> AgentMiddleware
<span class="hljs-meta">@tool</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">get_weather</span>(<span class="hljs-params">city: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-string">&quot;&quot;&quot;Get the weather in a city.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> <span class="hljs-string">f&quot;The weather in <span class="hljs-subst">{city}</span> is sunny.&quot;</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">WeatherMiddleware</span>(<span class="hljs-title class_ inherited__">AgentMiddleware</span>):
    tools = [get_weather]
agent = create_deep_agent(middleware=[WeatherMiddleware()])
<button class="copy-code-btn"></button></code></pre>
<p>يتضمن Deep Agents أيضًا برنامجًا وسيطًا مدمجًا للتخطيط وإدارة الوكيل الفرعي والتحكم في التنفيذ.</p>
<table>
<thead>
<tr><th>البرمجيات الوسيطة</th><th>الوظيفة</th></tr>
</thead>
<tbody>
<tr><td>البرمجيات الوسيطة TodoListMiddleware</td><td>توفر أدوات كتابة_المهام وقراءة_المهام لإدارة قوائم المهام</td></tr>
<tr><td>البرمجيات الوسيطة لنظام الملفات</td><td>يوفر أدوات تشغيل الملفات ويحفظ مخرجات الأدوات الكبيرة تلقائيًا</td></tr>
<tr><td>البرنامج الوسيط SubAgentMiddleware</td><td>يوفر أداة المهام لتفويض العمل إلى الوكلاء الفرعيين</td></tr>
<tr><td>برمجيات وسيطة للتلخيص</td><td>يلخّص تلقائيًا عندما يتجاوز السياق 170 ألف رمز</td></tr>
<tr><td>البرنامج الوسيط AnthropicPromptCromptCachingMiddleware</td><td>تمكين التخزين المؤقت الفوري لنماذج أنثروبيك</td></tr>
<tr><td>البرنامج الوسيط PatchToolCallsMiddleware</td><td>إصلاح استدعاءات الأدوات غير المكتملة الناتجة عن الانقطاعات</td></tr>
<tr><td>برنامج HumanInTheLoopMiddleware</td><td>يهيئ الأدوات التي تتطلب موافقة بشرية</td></tr>
</tbody>
</table>
<h3 id="Sub-agents" class="common-anchor-header">الوكلاء الفرعيون</h3><p>يمكن للوكيل الرئيسي تفويض المهام الفرعية إلى الوكلاء الفرعيين باستخدام الأداة <code translate="no">task</code>. يتم تشغيل كل وكيل فرعي في نافذة السياق الخاصة به ولديه أدواته الخاصة وموجه النظام الخاص به.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
research_subagent = {
    <span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;research-agent&quot;</span>,
    <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Used to research in-depth questions&quot;</span>,
    <span class="hljs-string">&quot;prompt&quot;</span>: <span class="hljs-string">&quot;You are an expert researcher&quot;</span>,
    <span class="hljs-string">&quot;tools&quot;</span>: [internet_search],
    <span class="hljs-string">&quot;model&quot;</span>: <span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,  <span class="hljs-comment"># Optional, defaults to main agent model</span>
}
agent = create_deep_agent(subagents=[research_subagent])
<button class="copy-code-btn"></button></code></pre>
<p>بالنسبة لحالات الاستخدام المتقدمة، يمكنك حتى تمرير سير عمل LangGraph المُنشأ مسبقًا كعامل فرعي.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> <span class="hljs-title class_">CompiledSubAgent</span>, create_deep_agent
custom_graph = <span class="hljs-title function_">create_agent</span>(model=..., tools=..., prompt=...)
agent = <span class="hljs-title function_">create_deep_agent</span>(
    subagents=[<span class="hljs-title class_">CompiledSubAgent</span>(
        name=<span class="hljs-string">&quot;data-analyzer&quot;</span>,
        description=<span class="hljs-string">&quot;Specialized agent for data analysis&quot;</span>,
        runnable=custom_graph
    )]
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="interrupton-Human-Approval-Control" class="common-anchor-header"><code translate="no">interrupt_on</code> (التحكم في الموافقة البشرية)</h3><p>يمكنك تحديد أدوات معينة تتطلب موافقة بشرية باستخدام المعلمة <code translate="no">interrupt_on</code>. عندما يستدعي الوكيل إحدى هذه الأدوات، يتوقف التنفيذ مؤقتًا حتى يقوم شخص بمراجعتها والموافقة عليها.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain_core.tools <span class="hljs-keyword">import</span> tool
<span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">from</span> langgraph.checkpoint.memory <span class="hljs-keyword">import</span> MemorySaver
<span class="hljs-meta">@tool</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">delete_file</span>(<span class="hljs-params">path: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-string">&quot;&quot;&quot;Delete a file from the filesystem.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> <span class="hljs-string">f&quot;Deleted <span class="hljs-subst">{path}</span>&quot;</span>
agent = create_deep_agent(
    tools=[delete_file],
    interrupt_on={
        <span class="hljs-string">&quot;delete_file&quot;</span>: {
            <span class="hljs-string">&quot;allowed_decisions&quot;</span>: [<span class="hljs-string">&quot;approve&quot;</span>, <span class="hljs-string">&quot;edit&quot;</span>, <span class="hljs-string">&quot;reject&quot;</span>]
        }
    },
    checkpointer=MemorySaver()
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Backend-Customization-Storage" class="common-anchor-header">تخصيص الواجهة الخلفية (التخزين)</h3><p>يمكنك اختيار خلفيات تخزين مختلفة للتحكم في كيفية التعامل مع الملفات. تتضمن الخيارات الحالية ما يلي:</p>
<ul>
<li><p><strong>StateBackend</strong> (التخزين المؤقت)</p></li>
<li><p><strong>FilesystemBackend</strong> (تخزين القرص المحلي)</p></li>
</ul>
<pre><code translate="no"><span class="hljs-title class_">StoreBackend</span>(persistent storage)、<span class="hljs-title class_">CompositeBackend</span>(hybrid routing)。
<span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">from</span> deepagents.<span class="hljs-property">backends</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">FilesystemBackend</span>
agent = <span class="hljs-title function_">create_deep_agent</span>(
    backend=<span class="hljs-title class_">FilesystemBackend</span>(root_dir=<span class="hljs-string">&quot;/path/to/project&quot;</span>)
)
<button class="copy-code-btn"></button></code></pre>
<p>من خلال تغيير الخلفية، يمكنك ضبط سلوك تخزين الملفات دون تغيير التصميم العام للنظام.</p>
<h2 id="Why-Use-Deep-Agents-with-Milvus-for-AI-Agents" class="common-anchor-header">لماذا استخدام الوكلاء العميقين مع Milvus لوكلاء الذكاء الاصطناعي؟<button data-href="#Why-Use-Deep-Agents-with-Milvus-for-AI-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>في التطبيقات الحقيقية، غالباً ما يحتاج الوكلاء في التطبيقات الحقيقية إلى ذاكرة تدوم عبر الجلسات. على سبيل المثال، قد يحتاجون إلى تذكر تفضيلات المستخدم، أو بناء معرفة بالمجال بمرور الوقت، أو تسجيل الملاحظات لتعديل السلوك، أو تتبع مهام البحث طويلة الأجل.</p>
<p>بشكل افتراضي، يستخدم Deep Agents <code translate="no">StateBackend</code> ، والذي يخزن البيانات خلال جلسة واحدة فقط. عندما تنتهي الجلسة، يتم مسح كل شيء. هذا يعني أنه لا يمكن أن يدعم الذاكرة طويلة الأجل العابرة للجلسات.</p>
<p>ولتمكين الذاكرة المستمرة، نستخدم <a href="https://milvus.io/"><strong>Milvus</strong></a> كقاعدة بيانات المتجهات مع <code translate="no">StoreBackend</code>. وإليك كيفية عملها: يتم تحويل محتوى المحادثة المهمة ونتائج الأدوات إلى تضمينات (متجهات رقمية تمثل المعنى) وتخزينها في Milvus. عندما تبدأ مهمة جديدة، يقوم الوكيل بإجراء بحث دلالي لاسترجاع الذكريات السابقة ذات الصلة. وهذا يسمح للوكيل "بتذكر" المعلومات ذات الصلة من الجلسات السابقة.</p>
<p>يعتبر Milvus مناسبًا تمامًا لحالة الاستخدام هذه بسبب بنية الفصل بين الحوسبة والتخزين. وهو يدعم:</p>
<ul>
<li><p>التحجيم الأفقي لعشرات المليارات من المتجهات</p></li>
<li><p>الاستعلامات عالية السرعة</p></li>
<li><p>تحديثات البيانات في الوقت الحقيقي</p></li>
<li><p>النشر الجاهز للإنتاج للأنظمة واسعة النطاق</p></li>
</ul>
<p>من الناحية الفنية، يستخدم برنامج Deep Agents <code translate="no">CompositeBackend</code> لتوجيه مسارات مختلفة إلى خلفيات تخزين مختلفة:</p>
<table>
<thead>
<tr><th>المسار</th><th>الواجهة الخلفية</th><th>الغرض</th></tr>
</thead>
<tbody>
<tr><td>/مساحة العمل/، /Temp/</td><td>الحالة الخلفية</td><td>بيانات مؤقتة، يتم مسحها بعد الجلسة</td></tr>
<tr><td>/الذكريات/، /المعرفة/</td><td>مخزن الخلفية + ميلفوس</td><td>بيانات دائمة، قابلة للبحث عبر الجلسات</td></tr>
</tbody>
</table>
<p>مع هذا الإعداد، يحتاج المطورون فقط إلى حفظ البيانات طويلة الأجل تحت مسارات مثل <code translate="no">/memories/</code>. يتعامل النظام تلقائيًا مع الذاكرة العابرة للجلسات. يتم توفير خطوات التكوين التفصيلية في القسم أدناه.</p>
<h2 id="Hands-on-Build-an-AI-Agent-with-Long-Term-Memory-Using-Milvus-and-Deep-Agents" class="common-anchor-header">التدريب العملي: بناء عميل ذكاء اصطناعي بذاكرة طويلة الأجل باستخدام ميلفوس والوكلاء العميقين<button data-href="#Hands-on-Build-an-AI-Agent-with-Long-Term-Memory-Using-Milvus-and-Deep-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>يوضح هذا المثال كيفية منح وكيل يستند إلى DeepAgents ذاكرة مستمرة باستخدام Milvus.</p>
<h3 id="Step-1-Install-dependencies" class="common-anchor-header">الخطوة 1: تثبيت التبعيات</h3><pre><code translate="no">pip install deepagents tavily-python langchain-milvus
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Set-up-the-memory-backend" class="common-anchor-header">الخطوة 2: إعداد الواجهة الخلفية للذاكرة</h3><pre><code translate="no"><span class="hljs-keyword">from</span> deepagents.backends <span class="hljs-keyword">import</span> CompositeBackend, StateBackend, StoreBackend
<span class="hljs-keyword">from</span> langchain_milvus.storage <span class="hljs-keyword">import</span> MilvusStore
<span class="hljs-comment"># from langgraph.store.memory import InMemoryStore # for testing only</span>
<span class="hljs-comment"># Configure Milvus storage</span>
milvus_store = MilvusStore(
    collection_name=<span class="hljs-string">&quot;agent_memories&quot;</span>,
    embedding_service=... <span class="hljs-comment"># embedding is required here, or use MilvusStore default configuration</span>
)
backend = CompositeBackend(
    default=StateBackend(),
    routes={<span class="hljs-string">&quot;/memories/&quot;</span>: StoreBackend(store=InMemoryStore())} 
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Create-the-agent" class="common-anchor-header">الخطوة 3: إنشاء الوكيل</h3><pre><code translate="no"><span class="hljs-keyword">from</span> tavily <span class="hljs-keyword">import</span> TavilyClient
<span class="hljs-keyword">import</span> os
tavily_client = TavilyClient(api_key=os.environ[<span class="hljs-string">&quot;TAVILY_API_KEY&quot;</span>])
<span class="hljs-keyword">def</span> <span class="hljs-title function_">internet_search</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, max_results: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-string">&quot;&quot;&quot;Perform an internet search&quot;&quot;&quot;</span>
    results = tavily_client.search(query, max_results=max_results)
    <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n&quot;</span>.join([<span class="hljs-string">f&quot;<span class="hljs-subst">{r[<span class="hljs-string">&#x27;title&#x27;</span>]}</span>: <span class="hljs-subst">{r[<span class="hljs-string">&#x27;content&#x27;</span>]}</span>&quot;</span> <span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> results[<span class="hljs-string">&quot;results&quot;</span>]])
agent = create_deep_agent(
    tools=[internet_search],
    system_prompt=<span class="hljs-string">&quot;You are a research expert. Write important findings to the /memories/ directory for cross-session reuse.&quot;</span>,
    backend=backend
)
<span class="hljs-comment"># Run the agent</span>
result = agent.invoke({
    <span class="hljs-string">&quot;messages&quot;</span>: [{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Research the technical features of the Milvus vector database&quot;</span>}]
})
<button class="copy-code-btn"></button></code></pre>
<p><strong>النقاط الرئيسية</strong></p>
<ul>
<li><strong>المسار الدائم</strong></li>
</ul>
<p>أي ملفات محفوظة تحت <code translate="no">/memories/</code> سيتم تخزينها بشكل دائم ويمكن الوصول إليها عبر جلسات عمل مختلفة.</p>
<ul>
<li><strong>إعداد الإنتاج</strong></li>
</ul>
<p>يستخدم المثال <code translate="no">InMemoryStore()</code> للاختبار. في الإنتاج، استبدله بمحول Milvus لتمكين البحث الدلالي القابل للتطوير.</p>
<ul>
<li><strong>الذاكرة التلقائية</strong></li>
</ul>
<p>يحفظ الوكيل تلقائياً نتائج البحث والمخرجات المهمة في مجلد <code translate="no">/memories/</code>. في المهام اللاحقة، يمكنه البحث واسترجاع المعلومات السابقة ذات الصلة.</p>
<h2 id="Built-in-Tools-Overview" class="common-anchor-header">نظرة عامة على الأدوات المدمجة<button data-href="#Built-in-Tools-Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>يتضمن Deep Agents عدة أدوات مدمجة، يتم توفيرها من خلال البرامج الوسيطة. وهي تنقسم إلى ثلاث مجموعات رئيسية:</p>
<h3 id="Task-Management-TodoListMiddleware" class="common-anchor-header">إدارة المهام (<code translate="no">TodoListMiddleware</code>)</h3><ul>
<li><code translate="no">write_todos</code></li>
</ul>
<p>إنشاء قائمة مهام منظمة. يمكن أن تتضمن كل مهمة وصفًا وأولوية وتبعيات.</p>
<ul>
<li><code translate="no">read_todos</code></li>
</ul>
<p>يعرض قائمة المهام الحالية، بما في ذلك المهام المكتملة والمهام المعلقة.</p>
<h3 id="File-System-Tools-FilesystemMiddleware" class="common-anchor-header">أدوات نظام الملفات (<code translate="no">FilesystemMiddleware</code>)</h3><ul>
<li><code translate="no">ls</code></li>
</ul>
<p>يسرد الملفات في دليل. يجب استخدام مسار مطلق (يبدأ ب <code translate="no">/</code>).</p>
<ul>
<li><code translate="no">read_file</code></li>
</ul>
<p>يقرأ محتوى الملف. يدعم <code translate="no">offset</code> و <code translate="no">limit</code> للملفات الكبيرة.</p>
<ul>
<li><code translate="no">write_file</code></li>
</ul>
<p>إنشاء ملف أو الكتابة فوقه.</p>
<ul>
<li><code translate="no">edit_file</code></li>
</ul>
<p>يستبدل نصًا معينًا داخل ملف.</p>
<ul>
<li><code translate="no">glob</code></li>
</ul>
<p>يبحث عن الملفات باستخدام أنماط، مثل <code translate="no">**/*.py</code> للبحث عن جميع ملفات Python.</p>
<ul>
<li><code translate="no">grep</code></li>
</ul>
<p>يبحث عن نص داخل الملفات.</p>
<ul>
<li><code translate="no">execute</code></li>
</ul>
<p>يقوم بتشغيل أوامر الصدفة في بيئة رمل. يتطلب دعم الواجهة الخلفية <code translate="no">SandboxBackendProtocol</code>.</p>
<h3 id="Sub-agent-Delegation-SubAgentMiddleware" class="common-anchor-header">تفويض الوكيل الفرعي (<code translate="no">SubAgentMiddleware</code>)</h3><ul>
<li><code translate="no">task</code></li>
</ul>
<p>يرسل مهمة فرعية إلى وكيل فرعي محدد. يمكنك توفير اسم الوكيل الفرعي ووصف المهمة.</p>
<h3 id="How-Tool-Outputs-Are-Handled" class="common-anchor-header">كيفية التعامل مع مخرجات الأداة</h3><p>إذا كانت الأداة تولد نتيجة كبيرة، يقوم Deep Agents تلقائيًا بحفظها في ملف.</p>
<p>على سبيل المثال، إذا قامت الأداة <code translate="no">internet_search</code> بإرجاع محتوى بحجم 100 كيلوبايت، يقوم النظام بحفظه في شيء مثل <code translate="no">/tool_results/internet_search_1.txt</code>. يحتفظ الوكيل بمسار الملف فقط في سياقه. هذا يقلل من استخدام الرمز المميز ويبقي نافذة السياق صغيرة.</p>
<h2 id="DeepAgents-vs-Agent-Builder-When-Should-You-Use-Each" class="common-anchor-header">الوكلاء العميقون مقابل منشئ الوكيل: متى يجب استخدام كل منهما؟<button data-href="#DeepAgents-vs-Agent-Builder-When-Should-You-Use-Each" class="anchor-icon" translate="no">
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
    </button></h2><p><em>نظرًا لأن هذه المقالة تركز على DeepAgents، فمن المفيد أيضًا فهم كيفية مقارنتها مع</em> <a href="https://www.langchain.com/langsmith/agent-builder"><em>Agent</em></a><em> Builder، وهو خيار آخر لبناء الوكلاء في نظام LangChain البيئي.</em></p>
<p>تقدم LangChain عدة طرق لبناء وكلاء الذكاء الاصطناعي، وعادةً ما يعتمد الخيار الأفضل على مدى تحكمك في النظام.</p>
<p>تم تصميم<strong>DeepAgents</strong> لبناء وكلاء مستقلين يتعاملون مع مهام طويلة الأمد ومتعددة الخطوات. وهو يمنح المطورين التحكم الكامل في كيفية تخطيط الوكيل للمهام واستخدام الأدوات وإدارة الذاكرة. ولأنه مبني على LangGraph، يمكنك تخصيص المكونات، ودمج أدوات Python، وتعديل الواجهة الخلفية للتخزين. وهذا يجعل من DeepAgents مناسبًا بشكل جيد لسير العمل المعقد وأنظمة الإنتاج حيث تكون الموثوقية والمرونة مهمة.</p>
<p>في المقابل، يركز<strong>Agent Builder</strong> على سهولة الاستخدام. فهو يخفي معظم التفاصيل التقنية، بحيث يمكنك وصف الوكيل وإضافة الأدوات وتشغيله بسرعة. يتم التعامل مع الذاكرة واستخدام الأدوات وخطوات الموافقة البشرية تلقائيًا. هذا يجعل Agent Builder مفيدًا للنماذج الأولية السريعة أو الأدوات الداخلية أو التجارب المبكرة.</p>
<p><strong>لا يعتبر Agent Builder و DeepAgents نظامين منفصلين - فهما جزء من نفس المكدس.</strong> تم بناء Agent Builder على رأس DeepAgents. تبدأ العديد من الفرق باستخدام Agent Builder لاختبار الأفكار، ثم تتحول إلى DeepAgents عندما تحتاج إلى مزيد من التحكم. يمكن أيضًا تحويل مهام سير العمل التي تم إنشاؤها باستخدام DeepAgents إلى قوالب Agent Builder حتى يتمكن الآخرون من إعادة استخدامها بسهولة.</p>
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
    </button></h2><p>يسهّل Deep Agents إدارة مهام سير عمل الوكيل المعقدة باستخدام ثلاث أفكار رئيسية: تخطيط المهام، وتخزين الملفات، وتفويض الوكيل الفرعي. تعمل هذه الآليات على تحويل العمليات الفوضوية متعددة الخطوات إلى عمليات سير عمل منظمة. عند دمجها مع Milvus للبحث المتجه، يمكن للوكيل أيضًا الاحتفاظ بذاكرة طويلة المدى عبر الجلسات.</p>
<p>بالنسبة للمطورين، هذا يعني انخفاض تكاليف التوكنات ونظام أكثر موثوقية يمكن أن يتوسع من عرض تجريبي بسيط إلى بيئة إنتاج.</p>
<p>إذا كنت تقوم ببناء وكلاء ذكاء اصطناعي يحتاجون إلى تدفقات عمل منظمة وذاكرة حقيقية طويلة الأجل، نود التواصل معك.</p>
<p>هل لديك أسئلة حول الوكلاء العميقين أو استخدام Milvus كواجهة خلفية للذاكرة الدائمة؟ انضم إلى <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">قناة Slack</a> الخاصة بنا أو احجز جلسة <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">ساعات عمل Milvus المكتبية</a> لمدة 20 دقيقة لمناقشة حالة الاستخدام الخاصة بك.</p>
