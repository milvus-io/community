---
id: langchain-vs-langgraph.md
title: >-
  سلسلة اللغات مقابل LangChain مقابل LangGraph: دليل المطور لاختيار أطر عمل
  الذكاء الاصطناعي الخاص بك
author: Min Yin
date: 2025-09-09T00:00:00.000Z
desc: >-
  قارن بين LangChain وLangGraph لتطبيقات LLM. اعرف كيف يختلفان في البنية وإدارة
  الحالة وحالات الاستخدام - بالإضافة إلى وقت استخدام كل منهما.
cover: assets.zilliz.com/Chat_GPT_Image_Sep_9_2025_09_42_12_PM_1_49154d15cc.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, langchain, langgraph'
meta_keywords: 'Milvus, vector database, langchain, langgraph, langchain vs langgraph'
meta_title: |
  LangChain vs LangGraph: A Developer's Guide to Choosing Your AI Frameworks
origin: 'https://milvus.io/blog/langchain-vs-langgraph.md'
---
<p>عند البناء باستخدام النماذج اللغوية الكبيرة (LLMs)، فإن إطار العمل الذي تختاره له تأثير كبير على تجربة التطوير الخاصة بك. فالإطار الجيد يعمل على تبسيط سير العمل، ويقلل من النمطية، ويسهل الانتقال من النموذج الأولي إلى الإنتاج. أما الإطار السيئ فيمكن أن يؤدي إلى العكس، مما يزيد من الاحتكاك والديون التقنية.</p>
<p>اثنان من أكثر الخيارات شيوعًا اليوم هما <a href="https://python.langchain.com/docs/introduction/"><strong>LangChain</strong></a> <a href="https://langchain-ai.github.io/langgraph/"><strong>وLangGraph،</strong></a> وكلاهما مفتوح المصدر وأنشأهما فريق LangChain. يركز LangChain على تنسيق المكوّنات وأتمتة سير العمل، مما يجعله مناسبًا جيدًا لحالات الاستخدام الشائعة مثل التوليد المعزز للاسترجاع<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">(RAG)</a>. يعتمد LangGraph على LangChain مع بنية قائمة على الرسم البياني، وهو مناسب بشكل أفضل للتطبيقات ذات الحالة وصنع القرار المعقد والتنسيق متعدد العوامل.</p>
<p>في هذا الدليل، سنقارن بين الإطارين جنبًا إلى جنب: كيفية عملهما، ونقاط قوتهما، وأنواع المشاريع التي تناسبهما. في النهاية، سيكون لديك فكرة أوضح عن أيهما أكثر ملاءمة لاحتياجاتك.</p>
<h2 id="LangChain-Your-Component-Library-and-LCEL-Orchestration-Powerhouse" class="common-anchor-header">سلسلة اللغات: مكتبة مكوّناتك وقوة تنسيق LCEL<button data-href="#LangChain-Your-Component-Library-and-LCEL-Orchestration-Powerhouse" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/langchain-ai/langchain"><strong>LangChain</strong></a> هو إطار عمل مفتوح المصدر مصمم لجعل بناء تطبيقات LLM أكثر قابلية للإدارة. يمكنك التفكير فيه على أنه البرنامج الوسيط الذي يقع بين نموذجك (على سبيل المثال، <a href="https://milvus.io/blog/gpt-5-review-accuracy-up-prices-down-code-strong-but-bad-for-creativity.md">GPT-5</a> من OpenAI أو <a href="https://milvus.io/blog/claude-code-vs-gemini-cli-which-ones-the-real-dev-co-pilot.md">Claude</a> من Anthropic) وتطبيقك الفعلي. وتتمثل مهمتها الرئيسية في مساعدتك في ربط جميع الأجزاء المتحركة <em>معًا</em>: المطالبات، وواجهات برمجة التطبيقات الخارجية، <a href="https://zilliz.com/learn/what-is-vector-database">وقواعد البيانات المتجهة،</a> ومنطق الأعمال المخصص.</p>
<p>خذ RAG كمثال. فبدلًا من ربط كل شيء من الصفر، تمنحك LangChain تجريدات جاهزة لربط LLM بمخزن متجه (مثل <a href="https://milvus.io/">Milvus</a> أو <a href="https://zilliz.com/cloud">Zilliz Cloud</a>)، وتشغيل البحث الدلالي، وتغذية النتائج في موجهك. بالإضافة إلى ذلك، يوفر أدوات مساعدة للقوالب الفورية، والوكلاء الذين يمكنهم استدعاء الأدوات، وطبقات التنسيق التي تحافظ على قابلية صيانة تدفقات العمل المعقدة.</p>
<p><strong>ما الذي يجعل LangChain متميزًا؟</strong></p>
<ul>
<li><p><strong>مكتبة مكونات غنية</strong> - أدوات تحميل المستندات، ومقسمات النصوص، وموصلات تخزين المتجهات، وواجهات النماذج، وغيرها.</p></li>
<li><p><strong>LCEL (لغة تعبير لانغ تشين) التنسيق</strong> - طريقة توضيحية لخلط المكونات ومطابقتها مع تقليل استخدام القوالب النمطية.</p></li>
<li><p><strong>تكامل سهل</strong> - يعمل بسلاسة مع واجهات برمجة التطبيقات وقواعد البيانات والأدوات الخارجية.</p></li>
<li><p><strong>نظام بيئي ناضج</strong> - توثيق قوي وأمثلة ومجتمع نشط.</p></li>
</ul>
<h2 id="LangGraph-Your-Go-To-for-Stateful-Agent-Systems" class="common-anchor-header">لانجغراف: هدفك المفضل لأنظمة الوكلاء ذات الحالة<button data-href="#LangGraph-Your-Go-To-for-Stateful-Agent-Systems" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/langchain-ai/langgraph">LangGraph</a> هو امتداد متخصص ل LangChain يركز على التطبيقات ذات الحالة. فبدلًا من كتابة سير العمل كبرنامج نصي خطي، يمكنك تعريفها كرسم بياني من العقد والحواف - أي آلة حالة في الأساس. تمثّل كل عقدة إجراءً (مثل استدعاء جهاز LLM أو الاستعلام عن قاعدة بيانات أو التحقق من حالة)، بينما تحدد الحواف كيفية تحرك التدفق اعتمادًا على النتائج. هذه البنية تجعل من السهل التعامل مع الحلقات والتفرع وإعادة المحاولة دون أن تتحول الشيفرة إلى مجموعة متشابكة من عبارات If/less.</p>
<p>هذه الطريقة مفيدة بشكل خاص لحالات الاستخدام المتقدمة مثل الطيارين المساعدين <a href="https://zilliz.com/blog/what-exactly-are-ai-agents-why-openai-and-langchain-are-fighting-over-their-definition">والوكلاء المستقلين</a>. تحتاج هذه الأنظمة غالبًا إلى تتبع الذاكرة، أو التعامل مع النتائج غير المتوقعة، أو اتخاذ القرارات بشكل ديناميكي. من خلال نمذجة المنطق بشكل صريح كرسم بياني، يجعل LangGraph هذه السلوكيات أكثر شفافية وقابلية للصيانة.</p>
<p><strong>تتضمن الميزات الأساسية ل LangGraph ما يلي:</strong></p>
<ul>
<li><p><strong>بنية قائمة على الرسم البياني</strong> - دعم أصلي للحلقات والتتبع العكسي وتدفقات التحكم المعقدة.</p></li>
<li><p><strong>إدارة الحالة</strong> - تضمن الحالة المركزية الحفاظ على السياق عبر الخطوات.</p></li>
<li><p><strong>دعم تعدد الوكلاء</strong> - مصمم للسيناريوهات التي يتعاون فيها عدة وكلاء أو ينسقون فيما بينهم.</p></li>
<li><p><strong>أدوات التصحيح</strong> - التصور والتصحيح عبر LangSmith Studio لتتبع تنفيذ الرسم البياني.</p></li>
</ul>
<h2 id="LangChain-vs-LangGraph-Technical-Deep-Dive" class="common-anchor-header">سلسلة اللغات مقابل الرسم البياني: التعمق التقني<button data-href="#LangChain-vs-LangGraph-Technical-Deep-Dive" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Architecture" class="common-anchor-header">البنية</h3><p>تستخدم لانج تشين <strong>LCEL (لغة تعبير لانج تشين)</strong> لربط المكونات معًا في خط أنابيب خطي. إنها توضيحية وقابلة للقراءة ورائعة لسير العمل المباشر مثل RAG.</p>
<pre><code translate="no"><span class="hljs-comment"># LangChain LCEL orchestration example</span>
<span class="hljs-keyword">from</span> langchain.prompts <span class="hljs-keyword">import</span> ChatPromptTemplate
<span class="hljs-keyword">from</span> langchain.chat_models <span class="hljs-keyword">import</span> ChatOpenAI

prompt = ChatPromptTemplate.from_template(<span class="hljs-string">&quot;Please answer the following question: {question}&quot;</span>)
model = ChatOpenAI()

<span class="hljs-comment"># LCEL chain orchestration</span>
chain = prompt | model

<span class="hljs-comment"># Run the chain</span>
result = chain.invoke({<span class="hljs-string">&quot;question&quot;</span>: <span class="hljs-string">&quot;What is artificial intelligence?&quot;</span>})
<button class="copy-code-btn"></button></code></pre>
<p>تتبع LangGraph نهجًا مختلفًا: يتم التعبير عن سير العمل <strong>كرسم بياني من العقد والحواف</strong>. تحدد كل عقدة إجراءً، ويدير محرك الرسم البياني الحالة والتفرع وإعادة المحاولة.</p>
<pre><code translate="no"><span class="hljs-comment"># LangGraph graph structure definition</span>
<span class="hljs-keyword">from</span> langgraph.graph <span class="hljs-keyword">import</span> StateGraph
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> TypedDict

<span class="hljs-keyword">class</span> <span class="hljs-title class_">State</span>(<span class="hljs-title class_ inherited__">TypedDict</span>):
    messages: <span class="hljs-built_in">list</span>
    current_step: <span class="hljs-built_in">str</span>

<span class="hljs-keyword">def</span> <span class="hljs-title function_">node_a</span>(<span class="hljs-params">state: State</span>) -&gt; State:
    <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;messages&quot;</span>: state[<span class="hljs-string">&quot;messages&quot;</span>] + [<span class="hljs-string">&quot;Processing A&quot;</span>], <span class="hljs-string">&quot;current_step&quot;</span>: <span class="hljs-string">&quot;A&quot;</span>}

<span class="hljs-keyword">def</span> <span class="hljs-title function_">node_b</span>(<span class="hljs-params">state: State</span>) -&gt; State:
    <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;messages&quot;</span>: state[<span class="hljs-string">&quot;messages&quot;</span>] + [<span class="hljs-string">&quot;Processing B&quot;</span>], <span class="hljs-string">&quot;current_step&quot;</span>: <span class="hljs-string">&quot;B&quot;</span>}

graph = StateGraph(State)
graph.add_node(<span class="hljs-string">&quot;node_a&quot;</span>, node_a)
graph.add_node(<span class="hljs-string">&quot;node_b&quot;</span>, node_b)
graph.add_edge(<span class="hljs-string">&quot;node_a&quot;</span>, <span class="hljs-string">&quot;node_b&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>حيث يمنحك LCEL خط سير خطي نظيف، بينما يدعم LangGraph الحلقات والتفرع والتدفقات الشرطية. وهذا يجعله أكثر ملاءمة <strong>للأنظمة الشبيهة بالوكلاء</strong> أو التفاعلات متعددة الخطوات التي لا تتبع خطًا مستقيمًا.</p>
<h3 id="State-Management" class="common-anchor-header">إدارة الحالة</h3><ul>
<li><p><strong>سلسلة اللغات</strong>: تستخدم مكونات الذاكرة لتمرير السياق. تعمل بشكل جيد للمحادثات البسيطة متعددة الأدوار أو تدفقات العمل الخطية.</p></li>
<li><p><strong>لانجغراف</strong>: يستخدم نظام حالة مركزي يدعم التراجع، والتراجع، والتاريخ التفصيلي. ضروري للتطبيقات طويلة الأمد، والتطبيقات ذات الحالة التي تكون فيها استمرارية السياق مهمة.</p></li>
</ul>
<h3 id="Execution-Models" class="common-anchor-header">نماذج التنفيذ</h3><table>
<thead>
<tr><th><strong>الميزة</strong></th><th><strong>سلسلة اللغات</strong></th><th><strong>مخطط لانجغراف</strong></th></tr>
</thead>
<tbody>
<tr><td>وضع التنفيذ</td><td>التنسيق الخطي</td><td>تنفيذ الحالة (الرسم البياني)</td></tr>
<tr><td>دعم الحلقات</td><td>دعم محدود</td><td>الدعم الأصلي</td></tr>
<tr><td>التفرع الشرطي</td><td>منفذة عبر RunnableMap</td><td>الدعم الأصلي</td></tr>
<tr><td>معالجة الاستثناءات</td><td>منفذة عبر التفرع القابل للتشغيل</td><td>دعم مدمج</td></tr>
<tr><td>معالجة الأخطاء</td><td>نقل على مستوى السلسلة</td><td>معالجة على مستوى العقدة</td></tr>
</tbody>
</table>
<h2 id="Real-World-Use-Cases-When-to-Use-Each" class="common-anchor-header">حالات الاستخدام الواقعية: متى تستخدم كل منها<button data-href="#Real-World-Use-Cases-When-to-Use-Each" class="anchor-icon" translate="no">
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
    </button></h2><p>الأطر لا تتعلق فقط بالبنية - فهي تتألق في مواقف مختلفة. لذا فالسؤال الحقيقي هو: متى يجب عليك الوصول إلى LangChain، ومتى يكون LangGraph أكثر منطقية؟ لنلقِ نظرة على بعض السيناريوهات العملية.</p>
<h3 id="When-LangChain-Is-Your-Best-Choice" class="common-anchor-header">عندما يكون LangChain هو خيارك الأفضل</h3><h4 id="1-Straightforward-Task-Processing" class="common-anchor-header">1. معالجة المهام المباشرة</h4><p>تُعد LangChain مناسبة تمامًا عندما تحتاج إلى تحويل المدخلات إلى مخرجات دون الحاجة إلى تتبع الحالة الثقيلة أو منطق التفرع. على سبيل المثال، امتداد المتصفح الذي يترجم النص المحدد:</p>
<pre><code translate="no"><span class="hljs-comment"># Implementing simple text translation using LCEL</span>
<span class="hljs-keyword">from</span> langchain.prompts <span class="hljs-keyword">import</span> ChatPromptTemplate
<span class="hljs-keyword">from</span> langchain.chat_models <span class="hljs-keyword">import</span> ChatOpenAI

prompt = ChatPromptTemplate.from_template(<span class="hljs-string">&quot;Translate the following text to English: {text}&quot;</span>)
model = ChatOpenAI()
chain = prompt | model

result = chain.invoke({<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Hello, World!&quot;</span>})
<button class="copy-code-btn"></button></code></pre>
<p>في هذه الحالة، ليست هناك حاجة للذاكرة أو إعادة المحاولة أو المنطق متعدد الخطوات - فقط تحويل فعال من مدخلات إلى مخرجات. تحافظ سلسلة اللغات على نظافة الشيفرة البرمجية وتركيزها.</p>
<h4 id="2-Foundation-Components" class="common-anchor-header">2. المكوّنات الأساسية</h4><p>توفر LangChain مكوّنات أساسية غنية يمكن أن تكون بمثابة لبنات بناء لبناء أنظمة أكثر تعقيدًا. حتى عندما تبني الفرق باستخدام LangGraph، فإنها غالبًا ما تعتمد على مكونات LangChain الناضجة. يقدم إطار العمل:</p>
<ul>
<li><p><strong>موصلات مخازن المتجهات</strong> - واجهات موحدة لقواعد البيانات مثل ميلفوس وزيليز كلاود.</p></li>
<li><p><strong>أدوات تحميل وتقسيم المستندات</strong> - لملفات PDF وصفحات الويب والمحتويات الأخرى.</p></li>
<li><p><strong>واجهات</strong> النماذج - أغلفة موحدة لواجهات LLMs الشائعة.</p></li>
</ul>
<p>هذا لا يجعل LangChain أداة سير عمل فحسب، بل يجعلها أيضًا مكتبة مكونات موثوقة للأنظمة الأكبر حجمًا.</p>
<h3 id="When-LangGraph-Is-the-Clear-Winner" class="common-anchor-header">عندما يكون LangGraph هو الفائز الواضح</h3><h4 id="1-Sophisticated-Agent-Development" class="common-anchor-header">1. تطوير الوكيل المتطور</h4><p>تتفوق LangGraph عندما تقوم ببناء أنظمة وكلاء متقدمة تحتاج إلى التكرار والتفرع والتكيف. إليك نمط وكيل مبسط:</p>
<pre><code translate="no"><span class="hljs-comment"># Simplified Agent system example</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">agent</span>(<span class="hljs-params">state</span>):
    messages = state[<span class="hljs-string">&quot;messages&quot;</span>]
    <span class="hljs-comment"># Agent thinks and decides next action</span>
    action = decide_action(messages)
    <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;action&quot;</span>: action, <span class="hljs-string">&quot;messages&quot;</span>: messages}

<span class="hljs-keyword">def</span> <span class="hljs-title function_">tool_executor</span>(<span class="hljs-params">state</span>):
    <span class="hljs-comment"># Execute tool calls</span>
    action = state[<span class="hljs-string">&quot;action&quot;</span>]
    result = execute_tool(action)
    <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;result&quot;</span>: result, <span class="hljs-string">&quot;messages&quot;</span>: state[<span class="hljs-string">&quot;messages&quot;</span>] + [result]}

<span class="hljs-comment"># Build Agent graph</span>
graph = StateGraph()
graph.add_node(<span class="hljs-string">&quot;agent&quot;</span>, agent)
graph.add_node(<span class="hljs-string">&quot;tool_executor&quot;</span>, tool_executor)
graph.add_edge(<span class="hljs-string">&quot;agent&quot;</span>, <span class="hljs-string">&quot;tool_executor&quot;</span>)
graph.add_edge(<span class="hljs-string">&quot;tool_executor&quot;</span>, <span class="hljs-string">&quot;agent&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>مثال:</strong> توضح الميزات المتقدمة في GitHub Copilot X ميزات GitHub Copilot X المتقدمة بشكل مثالي بنية وكيل LangGraph أثناء العمل. يتفهم النظام نوايا المطورين، ويقسم مهام البرمجة المعقدة إلى خطوات يمكن إدارتها، وينفذ عمليات متعددة بالتسلسل، ويتعلم من النتائج الوسيطة، ويكيف نهجه بناءً على ما يكتشفه على طول الطريق.</p>
<h4 id="2-Advanced-Multi-Turn-Conversation-Systems" class="common-anchor-header">2. أنظمة محادثة متقدمة متعددة الأدوار</h4><p>قدرات إدارة الحالة في LangGraph تجعله مناسبًا جدًا لبناء أنظمة محادثة معقدة متعددة الأدوار:</p>
<ul>
<li><p><strong>أنظمة خدمة العملاء</strong>: قادرة على تتبع تاريخ المحادثة وفهم السياق وتقديم استجابات متماسكة</p></li>
<li><p><strong>أنظمة التدريس التعليمي</strong>: تعديل استراتيجيات التدريس بناءً على تاريخ إجابات الطلاب</p></li>
<li><p><strong>أنظمة محاكاة المقابلات الشخصية</strong>: تعديل أسئلة المقابلات بناءً على إجابات المرشحين</p></li>
</ul>
<p><strong>مثال على ذلك:</strong> يعرض نظام Duolingo التعليمي القائم على الذكاء الاصطناعي هذا الأمر بشكل مثالي. حيث يحلل النظام باستمرار أنماط استجابة كل متعلم، ويحدد الثغرات المعرفية المحددة، ويتتبع تقدم التعلم عبر جلسات متعددة، ويقدم تجارب تعلم لغة مخصصة تتكيف مع أنماط التعلم الفردية وتفضيلات السرعة ومجالات الصعوبة.</p>
<h4 id="3-Multi-Agent-Collaboration-Ecosystems" class="common-anchor-header">3. الأنظمة البيئية التعاونية متعددة الوكلاء</h4><p>يدعم LangGraph بشكل أصلي الأنظمة البيئية حيث يتم التنسيق بين عدة وكلاء. ومن الأمثلة على ذلك:</p>
<ul>
<li><p><strong>محاكاة التعاون الجماعي</strong>: أدوار متعددة تنجز مهام معقدة بشكل تعاوني</p></li>
<li><p><strong>أنظمة المناقشة</strong>: أدوار متعددة تحمل وجهات نظر مختلفة تشارك في المناقشة</p></li>
<li><p><strong>منصات التعاون الإبداعي</strong>: وكلاء أذكياء من مجالات مهنية مختلفة يبتكرون معاً</p></li>
</ul>
<p>وقد أظهر هذا النهج نتائج واعدة في مجالات بحثية مثل اكتشاف الأدوية، حيث يقوم الوكلاء بنمذجة مجالات الخبرة المختلفة ودمج النتائج في رؤى جديدة.</p>
<h3 id="Making-the-Right-Choice-A-Decision-Framework" class="common-anchor-header">اتخاذ الخيار الصحيح: إطار عمل القرار</h3><table>
<thead>
<tr><th><strong>خصائص المشروع</strong></th><th><strong>الإطار الموصى به</strong></th><th><strong>لماذا</strong></th></tr>
</thead>
<tbody>
<tr><td>مهام بسيطة لمرة واحدة</td><td>سلسلة اللغات</td><td>تنسيق LCEL بسيط وبديهي</td></tr>
<tr><td>ترجمة/تحسين النص</td><td>سلسلة اللغات</td><td>لا حاجة لإدارة الحالة المعقدة</td></tr>
<tr><td>أنظمة الوكيل</td><td>لانجغراف</td><td>إدارة حالة قوية وتدفق تحكم قوي للحالة</td></tr>
<tr><td>أنظمة المحادثة متعددة الأدوار</td><td>لانجغراف</td><td>تتبع الحالة وإدارة السياق</td></tr>
<tr><td>تعاون متعدد الوكلاء</td><td>لانجغراف</td><td>دعم أصلي للتفاعل متعدد العقد</td></tr>
<tr><td>الأنظمة التي تتطلب استخدام الأدوات</td><td>لانجغراف</td><td>تحكم مرن في تدفق استدعاء الأداة</td></tr>
</tbody>
</table>
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
    </button></h2><p>في معظم الحالات، يعتبر كل من LangChain وLangGraph مكملين لبعضهما البعض وليس متنافسين. يمنحك LangChain أساسًا متينًا من المكونات وتنسيق LCEL - وهو أمر رائع للنماذج الأولية السريعة أو المهام عديمة الحالة أو المشاريع التي تحتاج فقط إلى تدفقات نظيفة من المدخلات إلى المخرجات. يتدخل LangGraph عندما يتخطى تطبيقك هذا النموذج الخطي ويتطلب حالة أو تفرعًا أو عوامل متعددة تعمل معًا.</p>
<ul>
<li><p><strong>اختر LangChain</strong> إذا كان تركيزك ينصب على المهام المباشرة مثل ترجمة النصوص، أو معالجة المستندات، أو تحويل البيانات، حيث يكون كل طلب قائم بذاته.</p></li>
<li><p><strong>اختر LangGraph</strong> إذا كنت تقوم ببناء محادثات متعددة الأدوار أو أنظمة وكلاء أو أنظمة تعاونية للوكلاء حيث يكون السياق واتخاذ القرار مهمًا.</p></li>
<li><p><strong>امزج بين الاثنين</strong> للحصول على أفضل النتائج. تبدأ العديد من أنظمة الإنتاج بمكونات LangChain (محملات المستندات، وموصلات مخزن المتجهات، وواجهات النماذج) ثم إضافة LangGraph لإدارة منطق قائم على الرسم البياني في الأعلى.</p></li>
</ul>
<p>في النهاية، الأمر لا يتعلق بملاحقة الاتجاهات بقدر ما يتعلق بمواءمة إطار العمل مع الاحتياجات الحقيقية لمشروعك. كلا النظامين البيئيين يتطوران بسرعة، مدفوعين بمجتمعات نشطة ووثائق قوية. من خلال فهم المكان المناسب لكل منهما، ستكون مجهزًا بشكل أفضل لتصميم تطبيقات ذات نطاق واسع - سواء كنت تقوم ببناء أول خط أنابيب RAG الخاص بك مع Milvus أو تنسيق نظام معقد متعدد العوامل.</p>
