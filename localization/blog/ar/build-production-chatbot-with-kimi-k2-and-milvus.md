---
id: build-production-chatbot-with-kimi-k2-and-milvus.md
title: بناء روبوت دردشة آلي على مستوى الإنتاج مع Kimi K2 و Milvus
author: Lumina Wang
date: 2025-07-25T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Jul_26_2025_06_40_46_PM_a262e721ae.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'vector database, mcp, AI Agents, LLM, Kimi'
meta_keywords: 'Kimi K2, Milvus, AI agents, semantic search, tool calling'
meta_title: |
  Build a Production-Grade Chatbot with Kimi K2 and Milvus
desc: >-
  تعرّف على كيفية إنشاء Kimi K2 وMilvus وكيل ذكاء اصطناعي للإنتاج لمعالجة
  الملفات تلقائيًا والبحث الدلالي والأسئلة والأجوبة الذكية في مهام العالم
  الحقيقي.
origin: 'https://milvus.io/blog/build-production-chatbot-with-kimi-k2-and-milvus.md'
---
<p>أحدثت<a href="https://moonshotai.github.io/Kimi-K2/">Kimi K2</a> ضجة في الآونة الأخيرة - ولسبب وجيه. فقد أشاد به مؤسسو Hugging Face وغيرهم من رواد الصناعة الآخرين باعتباره نموذجاً مفتوح المصدر يضاهي في أدائه أفضل النماذج المغلقة، مثل GPT-4 وClaude، في العديد من المجالات.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/huggingface_leader_twitter_b96c9d3f21.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>هناك ميزتان خارقتان تميزان Kimi K2:</strong></p>
<ul>
<li><p><strong>الأداء المتطور</strong>: يحقق K2 أفضل النتائج على المعايير الرئيسية، مثل AIME2025، ويتفوق باستمرار على نماذج مثل Grok-4 في معظم الأبعاد.</p></li>
<li><p><strong>قدرات الوكيل القوية</strong>: لا يكتفي K2 باستدعاء الأدوات - بل يعرف متى يستخدمها، وكيفية التبديل بينها في منتصف المهمة، ومتى يتوقف عن استخدامها. وهذا يفتح حالات استخدام جادة في العالم الحقيقي.</p></li>
</ul>
<p>يُظهر اختبار المستخدم أن قدرات كيمي K2 في البرمجة تضاهي بالفعل قدرات Claude 4 بحوالي 20% من التكلفة. والأهم من ذلك أنه يدعم <strong>التخطيط المستقل للمهام واستخدام الأدوات</strong>. أنت تحدد الأدوات المتاحة، ويتعامل K2 مع وقت وكيفية استخدامها - لا حاجة إلى ضبط دقيق أو طبقة تنسيق.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Kimi_k2_performance_550ffd5c61.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>كما أنه يدعم أيضًا واجهات برمجة التطبيقات المتوافقة مع OpenAI وAnthropic، مما يسمح لأي شيء تم إنشاؤه لتلك الأنظمة البيئية - مثل Claude Code - بالتكامل مع Kimi K2 مباشرةً. من الواضح أن Moonshot AI يستهدف أعباء عمل الوكلاء.</p>
<p>في هذا البرنامج التعليمي، سأعرض كيفية إنشاء <strong>روبوت دردشة على مستوى الإنتاج باستخدام Kimi K2 و Milvus.</strong> سيتمكن روبوت الدردشة الآلي من تحميل الملفات، وتشغيل الأسئلة والأجوبة الذكية، وإدارة البيانات من خلال البحث المتجه، مما يلغي الحاجة إلى التقطيع اليدوي أو تضمين البرامج النصية أو الضبط الدقيق.</p>
<h2 id="What-We’ll-Build" class="common-anchor-header">ما سنقوم ببنائه<button data-href="#What-We’ll-Build" class="anchor-icon" translate="no">
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
    </button></h2><p>نقوم ببناء روبوت دردشة ذكي من خلال الجمع بين قدرات Kimi K2 المنطقية وأداء قاعدة بيانات المتجهات في Milvus. يتعامل النظام مع ثلاث عمليات أساسية لسير العمل التي يحتاجها المهندسون بالفعل:</p>
<ol>
<li><p><strong>المعالجة التلقائية للملفات وتقطيعها</strong> - تحميل المستندات بتنسيقات مختلفة والسماح للنظام بتقسيمها بذكاء إلى أجزاء قابلة للبحث</p></li>
<li><p><strong>البحث الدلالي</strong> - البحث عن المعلومات ذات الصلة باستخدام استعلامات اللغة الطبيعية، وليس مطابقة الكلمات الرئيسية</p></li>
<li><p><strong>اتخاذ القرارات بذكاء</strong> - يفهم المساعد السياق ويختار تلقائياً الأدوات المناسبة لكل مهمة</p></li>
</ol>
<p>تم بناء النظام بأكمله حول فئتين رئيسيتين فقط، مما يسهل فهمه وتعديله وتوسيعه:</p>
<ul>
<li><p><strong>فئة VectorDatabase</strong>: هذا هو العمود الفقري لمعالجة البيانات. وهي تتعامل مع كل ما يتعلق بقاعدة بيانات Milvus vector - بدءًا من الاتصال وإنشاء المجموعات إلى تقطيع الملفات وتشغيل عمليات البحث عن التشابه.</p></li>
<li><p><strong>فئة SmartAssistant</strong>: اعتبرها بمثابة دماغ النظام. فهو يفهم ما يريده المستخدمون ويحدد الأدوات التي يجب استخدامها لإنجاز المهمة.</p></li>
</ul>
<p>إليك كيفية عمله عملياً: يقوم المستخدمون بالدردشة مع المساعد الذكي باستخدام اللغة الطبيعية. يستفيد المساعد من قدرات التفكير لدى Kimi K2 لتحليل الطلبات، ثم يقوم بتنسيق 7 وظائف أدوات متخصصة للتفاعل مع قاعدة بيانات Milvus vector. إنه يشبه وجود منسق ذكي يعرف بالضبط عمليات قاعدة البيانات التي يجب تشغيلها بناءً على ما تطلبه.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/chatbot_architecture_ea73cac6ca.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Prerequisites-and-Setup" class="common-anchor-header">المتطلبات الأساسية والإعداد<button data-href="#Prerequisites-and-Setup" class="anchor-icon" translate="no">
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
    </button></h2><p>قبل الغوص في الكود البرمجي، تأكد من جاهزية ما يلي:</p>
<p><strong>متطلبات النظام:</strong></p>
<ul>
<li><p>بايثون 3.8 أو أعلى</p></li>
<li><p>خادم ميلفوس (سنستخدم المثيل المحلي على المنفذ 19530)</p></li>
<li><p>ذاكرة وصول عشوائي 4 جيجابايت على الأقل لمعالجة المستندات</p></li>
</ul>
<p><strong>مفاتيح واجهة برمجة التطبيقات المطلوبة:</strong></p>
<ul>
<li><p>مفتاح Kimi API من <a href="https://platform.moonshot.cn/">Moonshot AI</a></p></li>
<li><p>مفتاح OpenAI API لتضمينات النص (سنستخدم نموذج تضمين النص-تضمين النص-3-صغير)</p></li>
</ul>
<p><strong>التثبيت السريع:</strong></p>
<pre><code translate="no">pip install pymilvus openai numpy
<button class="copy-code-btn"></button></code></pre>
<p><strong>ابدأ تشغيل ميلفوس محلياً</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Using Docker (recommended)</span>
docker run -d --name milvus -p <span class="hljs-number">19530</span>:<span class="hljs-number">19530</span> milvusdb/milvus:latest

<span class="hljs-comment"># Or download and run the standalone version from milvus.io</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Import-Libraries-and-Basic-Configuration" class="common-anchor-header">استيراد المكتبات والتكوين الأساسي<button data-href="#Import-Libraries-and-Basic-Configuration" class="anchor-icon" translate="no">
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
    </button></h2><p>هنا، pymilvus هي مكتبة لعمليات قاعدة بيانات Milvus المتجهة، و openai تُستخدم لاستدعاء واجهات برمجة التطبيقات Kimi و OpenAI (تتضح هنا فائدة توافق واجهة برمجة التطبيقات Kimi K2 مع OpenAI و OpenAI و OpenAI).</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">List</span>, <span class="hljs-type">Dict</span>
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">import</span> time
<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> re
<button class="copy-code-btn"></button></code></pre>
<h2 id="Data-Processing-VectorDatabase-Class" class="common-anchor-header">معالجة البيانات: فئة VectorDatabase<button data-href="#Data-Processing-VectorDatabase-Class" class="anchor-icon" translate="no">
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
    </button></h2><p>هذه هي نواة معالجة البيانات للنظام بأكمله، وهي مسؤولة عن جميع التفاعلات مع قاعدة بيانات المتجهات. يمكن تقسيمها إلى وحدتين رئيسيتين: <strong>عمليات قاعدة بيانات متجهات ميلفوس المتجهة ونظام معالجة الملفات.</strong></p>
<p>تتمثل فلسفة التصميم هنا في فصل الاهتمامات - تركز هذه الفئة على عمليات البيانات فقط بينما تترك الذكاء لفئة SmartAssistant. هذا يجعل الشيفرة أكثر قابلية للصيانة والاختبار.</p>
<h3 id="Milvus-Vector-Database-Operations" class="common-anchor-header">عمليات قاعدة بيانات ميلفوس المتجهة</h3><h4 id="Initialization-Method" class="common-anchor-header"><strong>طريقة التهيئة</strong></h4><p>ينشئ عميل OpenAI لتوجيه النص، باستخدام نموذج تضمين النص-التضمين 3-صغير مع تعيين بُعد المتجه إلى 1536.</p>
<p>يقوم أيضًا بتهيئة عميل Milvus على أنه لا شيء، وإنشاء الاتصال عند الحاجة.</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self, openai_api_key: <span class="hljs-built_in">str</span></span>):
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;🔧 Initializing vector database components...&quot;</span>)
    
    <span class="hljs-comment"># OpenAI client for generating text vectors</span>
    <span class="hljs-variable language_">self</span>.openai_client = OpenAI(api_key=openai_api_key)
    <span class="hljs-variable language_">self</span>.vector_dimension = <span class="hljs-number">1536</span>  <span class="hljs-comment"># Vector dimension for OpenAI text-embedding-3-small</span>
    
    <span class="hljs-comment"># Milvus client</span>
    <span class="hljs-variable language_">self</span>.milvus_client = <span class="hljs-literal">None</span>
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;✅ Vector database component initialization complete&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Text-Vectorization" class="common-anchor-header"><strong>تضمين النص المتجه</strong></h4><p>يستدعي واجهة برمجة تطبيقات التضمين الخاصة ب OpenAI لتوجيه النص، مع إرجاع مصفوفة متجهات ذات 1536 بُعدًا.</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">generate_vector</span>(<span class="hljs-params">self, text: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-type">List</span>[<span class="hljs-built_in">float</span>]:
    <span class="hljs-string">&quot;&quot;&quot;Convert text to vector&quot;&quot;&quot;</span>
    response = <span class="hljs-variable language_">self</span>.openai_client.embeddings.create(
        <span class="hljs-built_in">input</span>=[text],
        model=<span class="hljs-string">&quot;text-embedding-3-small&quot;</span>
    )
    <span class="hljs-keyword">return</span> response.data[<span class="hljs-number">0</span>].embedding
<button class="copy-code-btn"></button></code></pre>
<h4 id="Database-Connection" class="common-anchor-header"><strong>اتصال قاعدة البيانات</strong></h4><p>إنشاء اتصال MilvusClient بقاعدة البيانات المحلية على المنفذ 19530 وإرجاع تنسيق قاموس نتائج موحد.</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">connect_database</span>(<span class="hljs-params">self</span>) -&gt; <span class="hljs-built_in">dict</span>:
    <span class="hljs-string">&quot;&quot;&quot;Connect to Milvus vector database&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        <span class="hljs-variable language_">self</span>.milvus_client = MilvusClient(
            uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>
        )
        <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">True</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">&quot;Successfully connected to Milvus vector database&quot;</span>}
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Connection failed: <span class="hljs-subst">{<span class="hljs-built_in">str</span>(e)}</span>&quot;</span>}
<button class="copy-code-btn"></button></code></pre>
<h4 id="Create-Collection" class="common-anchor-header"><strong>إنشاء مجموعة</strong></h4><ul>
<li><p><strong>التحقق من التكرار</strong>: يتجنب إنشاء مجموعات بنفس الاسم</p></li>
<li><p><strong>تعريف الهيكل</strong>: ثلاثة حقول: معرف (مفتاح أساسي)، نص (نص)، متجه (متجه)</p></li>
<li><p><strong>إنشاء فهرس</strong>: يستخدم خوارزمية <code translate="no">IVF_FLAT</code> وتشابه جيب التمام لتحسين كفاءة البحث</p></li>
<li><p><strong>معرّف تلقائي</strong>: يقوم النظام تلقائيًا بإنشاء معرّفات فريدة</p></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">create_collection</span>(<span class="hljs-params">self, collection_name: <span class="hljs-built_in">str</span>, description: <span class="hljs-built_in">str</span> = <span class="hljs-string">&quot;&quot;</span></span>) -&gt; <span class="hljs-built_in">dict</span>:
    <span class="hljs-string">&quot;&quot;&quot;Create document collection&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        <span class="hljs-comment"># Check if database is connected</span>
        <span class="hljs-keyword">if</span> <span class="hljs-variable language_">self</span>.milvus_client <span class="hljs-keyword">is</span> <span class="hljs-literal">None</span>:
            <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">&quot;Please connect to database first&quot;</span>}
        
        <span class="hljs-comment"># Check if collection already exists</span>
        <span class="hljs-keyword">if</span> <span class="hljs-variable language_">self</span>.milvus_client.has_collection(collection_name):
            <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Collection <span class="hljs-subst">{collection_name}</span> already exists&quot;</span>}
        
        <span class="hljs-comment"># Define collection structure</span>
        schema = <span class="hljs-variable language_">self</span>.milvus_client.create_schema(
            auto_id=<span class="hljs-literal">True</span>,
            enable_dynamic_field=<span class="hljs-literal">False</span>,
            description=description
        )
        
        <span class="hljs-comment"># Add fields</span>
        schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
        schema.add_field(field_name=<span class="hljs-string">&quot;text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">2000</span>)
        schema.add_field(field_name=<span class="hljs-string">&quot;vector&quot;</span>, datatype=DataType.FLOAT_VECTOR, dim=<span class="hljs-variable language_">self</span>.vector_dimension)
        
        <span class="hljs-comment"># Create index parameters</span>
        index_params = <span class="hljs-variable language_">self</span>.milvus_client.prepare_index_params()
        index_params.add_index(
            field_name=<span class="hljs-string">&quot;vector&quot;</span>,
            index_type=<span class="hljs-string">&quot;IVF_FLAT&quot;</span>,
            metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
            params={<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">128</span>}
        )
        
        <span class="hljs-comment"># Create collection</span>
        <span class="hljs-variable language_">self</span>.milvus_client.create_collection(
            collection_name=collection_name,
            schema=schema,
            index_params=index_params
        )
        
        <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">True</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Successfully created collection <span class="hljs-subst">{collection_name}</span>&quot;</span>}
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Failed to create collection: <span class="hljs-subst">{<span class="hljs-built_in">str</span>(e)}</span>&quot;</span>}
<button class="copy-code-btn"></button></code></pre>
<h4 id="Add-Documents-to-Collection" class="common-anchor-header"><strong>إضافة مستندات إلى المجموعة</strong></h4><p>ينشئ تمثيلات متجهة لجميع المستندات، ويجمعها في تنسيق القاموس المطلوب من قبل Milvus، ثم يقوم بإدراج البيانات على دفعات، ويعيد في النهاية عدد الإدراج ومعلومات الحالة.</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">add_documents</span>(<span class="hljs-params">self, collection_name: <span class="hljs-built_in">str</span>, documents: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>]</span>) -&gt; <span class="hljs-built_in">dict</span>:
    <span class="hljs-string">&quot;&quot;&quot;Add documents to collection&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        <span class="hljs-comment"># Check if database is connected</span>
        <span class="hljs-keyword">if</span> <span class="hljs-variable language_">self</span>.milvus_client <span class="hljs-keyword">is</span> <span class="hljs-literal">None</span>:
            <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">&quot;Please connect to database first&quot;</span>}
        
        <span class="hljs-comment"># Generate vectors for each document</span>
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;📝 Generating vectors for <span class="hljs-subst">{<span class="hljs-built_in">len</span>(documents)}</span> documents...&quot;</span>)
        vectors = []
        <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> documents:
            vector = <span class="hljs-variable language_">self</span>.generate_vector(doc)
            vectors.append(vector)
        
        <span class="hljs-comment"># Prepare insertion data</span>
        data = []
        <span class="hljs-keyword">for</span> i, (doc, vector) <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(<span class="hljs-built_in">zip</span>(documents, vectors)):
            data.append({
                <span class="hljs-string">&quot;text&quot;</span>: doc,
                <span class="hljs-string">&quot;vector&quot;</span>: vector
            })
        
        <span class="hljs-comment"># Insert data</span>
        result = <span class="hljs-variable language_">self</span>.milvus_client.insert(
            collection_name=collection_name,
            data=data
        )
        
        <span class="hljs-keyword">return</span> {
            <span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">True</span>,
            <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Successfully added <span class="hljs-subst">{<span class="hljs-built_in">len</span>(documents)}</span> documents to collection <span class="hljs-subst">{collection_name}</span>&quot;</span>,
            <span class="hljs-string">&quot;inserted_count&quot;</span>: <span class="hljs-built_in">len</span>(result[<span class="hljs-string">&quot;insert_count&quot;</span>]) <span class="hljs-keyword">if</span> <span class="hljs-string">&quot;insert_count&quot;</span> <span class="hljs-keyword">in</span> result <span class="hljs-keyword">else</span> <span class="hljs-built_in">len</span>(documents)
        }
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Failed to add documents: <span class="hljs-subst">{<span class="hljs-built_in">str</span>(e)}</span>&quot;</span>}
<button class="copy-code-btn"></button></code></pre>
<h4 id="Search-Similar-Documents" class="common-anchor-header"><strong>البحث في المستندات المتشابهة</strong></h4><p>يقوم بتحويل أسئلة المستخدم إلى متجهات ذات 1536 بُعدًا، ويستخدم جيب التمام لحساب التشابه الدلالي، ويعيد المستندات الأكثر صلة بترتيب تنازلي للتشابه.</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">search_documents</span>(<span class="hljs-params">self, collection_name: <span class="hljs-built_in">str</span>, query: <span class="hljs-built_in">str</span>, limit: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span></span>) -&gt; <span class="hljs-built_in">dict</span>:
    <span class="hljs-string">&quot;&quot;&quot;Search similar documents&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        <span class="hljs-comment"># Check if database is connected</span>
        <span class="hljs-keyword">if</span> <span class="hljs-variable language_">self</span>.milvus_client <span class="hljs-keyword">is</span> <span class="hljs-literal">None</span>:
            <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">&quot;Please connect to database first&quot;</span>}
        
        <span class="hljs-comment"># Convert query text to vector</span>
        query_vector = <span class="hljs-variable language_">self</span>.generate_vector(query)
        
        <span class="hljs-comment"># Search parameters</span>
        search_params = {
            <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>,
            <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}
        }
        
        <span class="hljs-comment"># Execute search</span>
        results = <span class="hljs-variable language_">self</span>.milvus_client.search(
            collection_name=collection_name,
            data=[query_vector],
            anns_field=<span class="hljs-string">&quot;vector&quot;</span>,
            search_params=search_params,
            limit=limit,
            output_fields=[<span class="hljs-string">&quot;text&quot;</span>]
        )
        
        <span class="hljs-comment"># Organize search results</span>
        found_docs = []
        <span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:  <span class="hljs-comment"># Take results from first query</span>
            found_docs.append({
                <span class="hljs-string">&quot;text&quot;</span>: result[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>],
                <span class="hljs-string">&quot;similarity&quot;</span>: <span class="hljs-string">f&quot;<span class="hljs-subst">{(<span class="hljs-number">1</span> - result[<span class="hljs-string">&#x27;distance&#x27;</span>]) * <span class="hljs-number">100</span>:<span class="hljs-number">.1</span>f}</span>%&quot;</span>
            })
        
        <span class="hljs-keyword">return</span> {
            <span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">True</span>,
            <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Found <span class="hljs-subst">{<span class="hljs-built_in">len</span>(found_docs)}</span> relevant documents&quot;</span>,
            <span class="hljs-string">&quot;query&quot;</span>: query,
            <span class="hljs-string">&quot;results&quot;</span>: found_docs
        }
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Search failed: <span class="hljs-subst">{<span class="hljs-built_in">str</span>(e)}</span>&quot;</span>}
<button class="copy-code-btn"></button></code></pre>
<h4 id="Query-Collections" class="common-anchor-header"><strong>الاستعلام عن المجموعات</strong></h4><p>يحصل على اسم المجموعة وعدد المستندات ومعلومات الوصف.</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">list_all_collections</span>(<span class="hljs-params">self</span>) -&gt; <span class="hljs-built_in">dict</span>:
    <span class="hljs-string">&quot;&quot;&quot;Query all collections in database&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        <span class="hljs-comment"># Check if database is connected</span>
        <span class="hljs-keyword">if</span> <span class="hljs-variable language_">self</span>.milvus_client <span class="hljs-keyword">is</span> <span class="hljs-literal">None</span>:
            <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">&quot;Please connect to database first&quot;</span>}
        
        <span class="hljs-comment"># Get all collection names</span>
        collections = <span class="hljs-variable language_">self</span>.milvus_client.list_collections()
        
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> collections:
            <span class="hljs-keyword">return</span> {
                <span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">True</span>,
                <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">&quot;No collections in database&quot;</span>,
                <span class="hljs-string">&quot;collections&quot;</span>: []
            }
        
        <span class="hljs-comment"># Get detailed information for each collection</span>
        collection_details = []
        <span class="hljs-keyword">for</span> collection_name <span class="hljs-keyword">in</span> collections:
            <span class="hljs-keyword">try</span>:
                <span class="hljs-comment"># Get collection statistics</span>
                stats = <span class="hljs-variable language_">self</span>.milvus_client.get_collection_stats(collection_name)
                doc_count = stats.get(<span class="hljs-string">&quot;row_count&quot;</span>, <span class="hljs-number">0</span>)
                
                <span class="hljs-comment"># Get collection description</span>
                desc_result = <span class="hljs-variable language_">self</span>.milvus_client.describe_collection(collection_name)
                description = desc_result.get(<span class="hljs-string">&quot;description&quot;</span>, <span class="hljs-string">&quot;No description&quot;</span>)
                
                collection_details.append({
                    <span class="hljs-string">&quot;name&quot;</span>: collection_name,
                    <span class="hljs-string">&quot;document_count&quot;</span>: doc_count,
                    <span class="hljs-string">&quot;description&quot;</span>: description
                })
            <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
                collection_details.append({
                    <span class="hljs-string">&quot;name&quot;</span>: collection_name,
                    <span class="hljs-string">&quot;document_count&quot;</span>: <span class="hljs-string">&quot;Failed to retrieve&quot;</span>,
                    <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">f&quot;Error: <span class="hljs-subst">{<span class="hljs-built_in">str</span>(e)}</span>&quot;</span>
                })
        
        <span class="hljs-keyword">return</span> {
            <span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">True</span>,
            <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Database contains <span class="hljs-subst">{<span class="hljs-built_in">len</span>(collections)}</span> collections total&quot;</span>,
            <span class="hljs-string">&quot;total_collections&quot;</span>: <span class="hljs-built_in">len</span>(collections),
            <span class="hljs-string">&quot;collections&quot;</span>: collection_details
        }
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Failed to query collections: <span class="hljs-subst">{<span class="hljs-built_in">str</span>(e)}</span>&quot;</span>}
<button class="copy-code-btn"></button></code></pre>
<h3 id="32-File-Processing-System" class="common-anchor-header"><strong>3.2 نظام معالجة الملفات</strong></h3><h4 id="Intelligent-Text-Chunking" class="common-anchor-header"><strong>التقطيع الذكي للنصوص</strong></h4><p><strong>استراتيجية التقطيع:</strong></p>
<ul>
<li><p><strong>أولوية الفقرة</strong>: التقسيم أولاً بفواصل أسطر مزدوجة للحفاظ على تكامل الفقرة</p></li>
<li><p><strong>معالجة الفقرات الطويلة</strong>: تقسيم الفقرات الطويلة جدًا بالنقاط وعلامات الاستفهام وعلامات التعجب</p></li>
<li><p><strong>التحكم في الحجم</strong>: التأكد من عدم تجاوز كل فقرة للحدود المسموح بها، مع حد أقصى لحجم الفقرة 500 حرف وتداخل 50 حرفًا لتجنب فقدان المعلومات المهمة عند حدود التقسيم</p></li>
<li><p><strong>الحفاظ على الدلالات</strong>: تجنب كسر الجمل في المنتصف</p></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">split_text_into_chunks</span>(<span class="hljs-params">self, text: <span class="hljs-built_in">str</span>, chunk_size: <span class="hljs-built_in">int</span> = <span class="hljs-number">500</span>, overlap: <span class="hljs-built_in">int</span> = <span class="hljs-number">50</span></span>) -&gt; <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>]:
    <span class="hljs-string">&quot;&quot;&quot;Split long text into chunks&quot;&quot;&quot;</span>
    <span class="hljs-comment"># Clean text</span>
    text = text.strip()
    
    <span class="hljs-comment"># Split by paragraphs</span>
    paragraphs = [p.strip() <span class="hljs-keyword">for</span> p <span class="hljs-keyword">in</span> text.split(<span class="hljs-string">&#x27;\n\n&#x27;</span>) <span class="hljs-keyword">if</span> p.strip()]
    
    chunks = []
    current_chunk = <span class="hljs-string">&quot;&quot;</span>
    
    <span class="hljs-keyword">for</span> paragraph <span class="hljs-keyword">in</span> paragraphs:
        <span class="hljs-comment"># If current paragraph is too long, needs further splitting</span>
        <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(paragraph) &gt; chunk_size:
            <span class="hljs-comment"># Save current chunk first</span>
            <span class="hljs-keyword">if</span> current_chunk:
                chunks.append(current_chunk.strip())
                current_chunk = <span class="hljs-string">&quot;&quot;</span>
            
            <span class="hljs-comment"># Split long paragraph by sentences</span>
            sentences = re.split(<span class="hljs-string">r&#x27;[。！？.!?]&#x27;</span>, paragraph)
            temp_chunk = <span class="hljs-string">&quot;&quot;</span>
            
            <span class="hljs-keyword">for</span> sentence <span class="hljs-keyword">in</span> sentences:
                sentence = sentence.strip()
                <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> sentence:
                    <span class="hljs-keyword">continue</span>
                
                <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(temp_chunk + sentence) &lt;= chunk_size:
                    temp_chunk += sentence + <span class="hljs-string">&quot;。&quot;</span>
                <span class="hljs-keyword">else</span>:
                    <span class="hljs-keyword">if</span> temp_chunk:
                        chunks.append(temp_chunk.strip())
                    temp_chunk = sentence + <span class="hljs-string">&quot;。&quot;</span>
            
            <span class="hljs-keyword">if</span> temp_chunk:
                chunks.append(temp_chunk.strip())
        
        <span class="hljs-comment"># If adding this paragraph won&#x27;t exceed limit</span>
        <span class="hljs-keyword">elif</span> <span class="hljs-built_in">len</span>(current_chunk + paragraph) &lt;= chunk_size:
            current_chunk += paragraph + <span class="hljs-string">&quot;\n\n&quot;</span>
        
        <span class="hljs-comment"># If it would exceed limit, save current chunk first, then start new one</span>
        <span class="hljs-keyword">else</span>:
            <span class="hljs-keyword">if</span> current_chunk:
                chunks.append(current_chunk.strip())
            current_chunk = paragraph + <span class="hljs-string">&quot;\n\n&quot;</span>
    
    <span class="hljs-comment"># Save last chunk</span>
    <span class="hljs-keyword">if</span> current_chunk:
        chunks.append(current_chunk.strip())
    
    <span class="hljs-comment"># Add overlapping content to improve context coherence</span>
    <span class="hljs-keyword">if</span> overlap &gt; <span class="hljs-number">0</span> <span class="hljs-keyword">and</span> <span class="hljs-built_in">len</span>(chunks) &gt; <span class="hljs-number">1</span>:
        overlapped_chunks = []
        <span class="hljs-keyword">for</span> i, chunk <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(chunks):
            <span class="hljs-keyword">if</span> i == <span class="hljs-number">0</span>:
                overlapped_chunks.append(chunk)
            <span class="hljs-keyword">else</span>:
                <span class="hljs-comment"># Take part of previous chunk as overlap</span>
                prev_chunk = chunks[i-<span class="hljs-number">1</span>]
                overlap_text = prev_chunk[-overlap:] <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(prev_chunk) &gt; overlap <span class="hljs-keyword">else</span> prev_chunk
                overlapped_chunk = overlap_text + <span class="hljs-string">&quot;\n&quot;</span> + chunk
                overlapped_chunks.append(overlapped_chunk)
        chunks = overlapped_chunks
    
    <span class="hljs-keyword">return</span> chunks
<button class="copy-code-btn"></button></code></pre>
<h4 id="File-Reading-and-Chunking" class="common-anchor-header"><strong>قراءة الملفات وتقطيعها</strong></h4><p>يدعم تحميلات ملفات المستخدم (txt و md و py وتنسيقات أخرى)، ويحاول تلقائيًا تنسيقات ترميز مختلفة، ويوفر ملاحظات مفصلة عن الأخطاء</p>
<p><strong>تعزيز البيانات الوصفية</strong>: المصدر_ملف يسجل مصدر المستند، و chunk_index يسجل فهرس تسلسل القطع، و total_chunks يسجل العدد الإجمالي للقطع، مما يسهل تتبع التكامل.</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">read_and_chunk_file</span>(<span class="hljs-params">self, file_path: <span class="hljs-built_in">str</span>, chunk_size: <span class="hljs-built_in">int</span> = <span class="hljs-number">500</span>, overlap: <span class="hljs-built_in">int</span> = <span class="hljs-number">50</span></span>) -&gt; <span class="hljs-built_in">dict</span>:
    <span class="hljs-string">&quot;&quot;&quot;Read local file and chunk into pieces&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        <span class="hljs-comment"># Check if file exists</span>
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> os.path.exists(file_path):
            <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;File does not exist: <span class="hljs-subst">{file_path}</span>&quot;</span>}
        
        <span class="hljs-comment"># Get file information</span>
        file_size = os.path.getsize(file_path)
        file_name = os.path.basename(file_path)
        
        <span class="hljs-comment"># Choose reading method based on file extension</span>
        file_ext = os.path.splitext(file_path)[<span class="hljs-number">1</span>].lower()
        
        <span class="hljs-keyword">if</span> file_ext <span class="hljs-keyword">in</span> [<span class="hljs-string">&#x27;.txt&#x27;</span>, <span class="hljs-string">&#x27;.md&#x27;</span>, <span class="hljs-string">&#x27;.py&#x27;</span>, <span class="hljs-string">&#x27;.js&#x27;</span>, <span class="hljs-string">&#x27;.html&#x27;</span>, <span class="hljs-string">&#x27;.css&#x27;</span>, <span class="hljs-string">&#x27;.json&#x27;</span>]:
            <span class="hljs-comment"># Text file, try multiple encodings</span>
            encodings = [<span class="hljs-string">&#x27;utf-8&#x27;</span>, <span class="hljs-string">&#x27;gbk&#x27;</span>, <span class="hljs-string">&#x27;gb2312&#x27;</span>, <span class="hljs-string">&#x27;latin-1&#x27;</span>]
            content = <span class="hljs-literal">None</span>
            used_encoding = <span class="hljs-literal">None</span>
            
            <span class="hljs-keyword">for</span> encoding <span class="hljs-keyword">in</span> encodings:
                <span class="hljs-keyword">try</span>:
                    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&#x27;r&#x27;</span>, encoding=encoding) <span class="hljs-keyword">as</span> f:
                        content = f.read()
                    used_encoding = encoding
                    <span class="hljs-keyword">break</span>
                <span class="hljs-keyword">except</span> UnicodeDecodeError:
                    <span class="hljs-keyword">continue</span>
            
            <span class="hljs-keyword">if</span> content <span class="hljs-keyword">is</span> <span class="hljs-literal">None</span>:
                <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">&quot;Cannot read file, encoding format not supported&quot;</span>}
            
            <span class="hljs-comment"># Split text</span>
            chunks = <span class="hljs-variable language_">self</span>.split_text_into_chunks(content, chunk_size, overlap)
            
            <span class="hljs-comment"># Add metadata to each chunk</span>
            chunk_data = []
            <span class="hljs-keyword">for</span> i, chunk <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(chunks):
                chunk_data.append({
                    <span class="hljs-string">&quot;text&quot;</span>: chunk,
                    <span class="hljs-string">&quot;source_file&quot;</span>: file_name,
                    <span class="hljs-string">&quot;chunk_index&quot;</span>: i,
                    <span class="hljs-string">&quot;total_chunks&quot;</span>: <span class="hljs-built_in">len</span>(chunks)
                })
            
            <span class="hljs-keyword">return</span> {
                <span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">True</span>,
                <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Successfully read and chunked file <span class="hljs-subst">{file_name}</span>&quot;</span>,
                <span class="hljs-string">&quot;total_chunks&quot;</span>: <span class="hljs-built_in">len</span>(chunks),
                <span class="hljs-string">&quot;chunks&quot;</span>: chunk_data
            }
        
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Failed to read file: <span class="hljs-subst">{<span class="hljs-built_in">str</span>(e)}</span>&quot;</span>}
<button class="copy-code-btn"></button></code></pre>
<h4 id="Upload-File-to-Collection" class="common-anchor-header"><strong>تحميل ملف إلى المجموعة</strong></h4><p>يستدعي <code translate="no">read_and_chunk_file</code> لتقطيع الملفات التي قام المستخدم بتحميلها ويُنشئ ناقلات لتخزينها في مجموعة محددة.</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">upload_file_to_collection</span>(<span class="hljs-params">self, file_path: <span class="hljs-built_in">str</span>, collection_name: <span class="hljs-built_in">str</span>, chunk_size: <span class="hljs-built_in">int</span> = <span class="hljs-number">500</span>, overlap: <span class="hljs-built_in">int</span> = <span class="hljs-number">50</span></span>) -&gt; <span class="hljs-built_in">dict</span>:
    <span class="hljs-string">&quot;&quot;&quot;Upload file to specified collection&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        <span class="hljs-comment"># Check if database is connected</span>
        <span class="hljs-keyword">if</span> <span class="hljs-variable language_">self</span>.milvus_client <span class="hljs-keyword">is</span> <span class="hljs-literal">None</span>:
            <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">&quot;Please connect to database first&quot;</span>}
        
        <span class="hljs-comment"># First read and chunk file</span>
        result = <span class="hljs-variable language_">self</span>.read_and_chunk_file(file_path, chunk_size, overlap)
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> result[<span class="hljs-string">&quot;success&quot;</span>]:
            <span class="hljs-keyword">return</span> result
        
        chunk_data = result[<span class="hljs-string">&quot;chunks&quot;</span>]
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;📝 Generating vectors for <span class="hljs-subst">{<span class="hljs-built_in">len</span>(chunk_data)}</span> text chunks...&quot;</span>)
        
        <span class="hljs-comment"># Generate vectors for each chunk</span>
        vectors = []
        texts = []
        <span class="hljs-keyword">for</span> chunk_info <span class="hljs-keyword">in</span> chunk_data:
            vector = <span class="hljs-variable language_">self</span>.generate_vector(chunk_info[<span class="hljs-string">&quot;text&quot;</span>])
            vectors.append(vector)
            
            <span class="hljs-comment"># Create text with metadata</span>
            enriched_text = <span class="hljs-string">f&quot;[File: <span class="hljs-subst">{chunk_info[<span class="hljs-string">&#x27;source_file&#x27;</span>]}</span> | Chunk: <span class="hljs-subst">{chunk_info[<span class="hljs-string">&#x27;chunk_index&#x27;</span>]+<span class="hljs-number">1</span>}</span>/<span class="hljs-subst">{chunk_info[<span class="hljs-string">&#x27;total_chunks&#x27;</span>]}</span>]\n<span class="hljs-subst">{chunk_info[<span class="hljs-string">&#x27;text&#x27;</span>]}</span>&quot;</span>
            texts.append(enriched_text)
        
        <span class="hljs-comment"># Prepare insertion data</span>
        data = []
        <span class="hljs-keyword">for</span> i, (text, vector) <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(<span class="hljs-built_in">zip</span>(texts, vectors)):
            data.append({
                <span class="hljs-string">&quot;text&quot;</span>: text,
                <span class="hljs-string">&quot;vector&quot;</span>: vector
            })
        
        <span class="hljs-comment"># Insert data into collection</span>
        insert_result = <span class="hljs-variable language_">self</span>.milvus_client.insert(
            collection_name=collection_name,
            data=data
        )
        
        <span class="hljs-keyword">return</span> {
            <span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">True</span>,
            <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Successfully uploaded file <span class="hljs-subst">{result[<span class="hljs-string">&#x27;file_name&#x27;</span>]}</span> to collection <span class="hljs-subst">{collection_name}</span>&quot;</span>,
            <span class="hljs-string">&quot;file_name&quot;</span>: result[<span class="hljs-string">&quot;file_name&quot;</span>],
            <span class="hljs-string">&quot;file_size&quot;</span>: result[<span class="hljs-string">&quot;file_size&quot;</span>],
            <span class="hljs-string">&quot;total_chunks&quot;</span>: result[<span class="hljs-string">&quot;total_chunks&quot;</span>],
            <span class="hljs-string">&quot;average_chunk_size&quot;</span>: result[<span class="hljs-string">&quot;average_chunk_size&quot;</span>],
            <span class="hljs-string">&quot;inserted_count&quot;</span>: <span class="hljs-built_in">len</span>(data),
            <span class="hljs-string">&quot;collection_name&quot;</span>: collection_name
        }
        
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Failed to upload file: <span class="hljs-subst">{<span class="hljs-built_in">str</span>(e)}</span>&quot;</span>}
<button class="copy-code-btn"></button></code></pre>
<h2 id="Intelligent-Decision-Making-SmartAssistant-Class" class="common-anchor-header">اتخاذ القرار الذكي: فئة المساعد الذكي<button data-href="#Intelligent-Decision-Making-SmartAssistant-Class" class="anchor-icon" translate="no">
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
    </button></h2><p>هذا هو عقل النظام، ويسمى أيضًا مركز القرار الذكي. هذا هو المكان الذي تتألق فيه قدرات التفكير المستقل في Kimi K2 - فهو لا يقوم فقط بتنفيذ مهام سير العمل المحددة مسبقًا، ولكنه في الواقع يفهم نية المستخدم ويتخذ قرارات ذكية بشأن الأدوات التي يجب استخدامها ومتى.</p>
<p>وتتمثل فلسفة التصميم هنا في إنشاء واجهة لغة طبيعية تبدو وكأنها تتحدث إلى مساعد مطلع، وليس تشغيل قاعدة بيانات من خلال الأوامر الصوتية.</p>
<h3 id="Initialization-and-Tool-Definition" class="common-anchor-header"><strong>التهيئة وتعريف الأداة</strong></h3><p>تتبع بنية تعريف الأداة تنسيق استدعاء الدالة الخاص ب OpenAI، والذي يدعمه Kimi K2 أصلاً. وهذا يجعل التكامل سلسًا ويسمح بتنسيق الأدوات المعقدة دون الحاجة إلى منطق تحليل مخصص.</p>
<p>الأدوات الأساسية (4):</p>
<p><code translate="no">connect_database</code> - إدارة اتصال قاعدة البيانات<code translate="no">create_collection</code> - إنشاء المجموعة<code translate="no">add_documents</code> - إضافة مستند دفعي<code translate="no">list_all_collections</code> - إدارة المجموعة</p>
<p>أدوات البحث (1):</p>
<p><code translate="no">search_documents</code> - البحث في مجموعة محددة</p>
<p>أدوات الملفات (2):</p>
<p><code translate="no">read_and_chunk_file</code> - معاينة الملفات وتقطيعها<code translate="no">upload_file_to_collection</code> - معالجة تحميل الملفات - معالجة تحميل الملفات</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self, kimi_api_key: <span class="hljs-built_in">str</span>, openai_api_key: <span class="hljs-built_in">str</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Initialize intelligent assistant&quot;&quot;&quot;</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;🚀 Starting intelligent assistant...&quot;</span>)
    
    <span class="hljs-comment"># Kimi client</span>
    <span class="hljs-variable language_">self</span>.kimi_client = OpenAI(
        api_key=kimi_api_key,
        base_url=<span class="hljs-string">&quot;https://api.moonshot.cn/v1&quot;</span>
    )
    
    <span class="hljs-comment"># Vector database</span>
    <span class="hljs-variable language_">self</span>.vector_db = VectorDatabase(openai_api_key)
    
    <span class="hljs-comment"># Define available tools</span>
    <span class="hljs-variable language_">self</span>.available_tools = [
        {
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;function&quot;</span>,
            <span class="hljs-string">&quot;function&quot;</span>: {
                <span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;connect_database&quot;</span>,
                <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Connect to vector database&quot;</span>,
                <span class="hljs-string">&quot;parameters&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;object&quot;</span>, <span class="hljs-string">&quot;properties&quot;</span>: {}, <span class="hljs-string">&quot;required&quot;</span>: []}
            }
        },
        {
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;function&quot;</span>,
            <span class="hljs-string">&quot;function&quot;</span>: {
                <span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;create_collection&quot;</span>,
                <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Create new document collection&quot;</span>,
                <span class="hljs-string">&quot;parameters&quot;</span>: {
                    <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;object&quot;</span>,
                    <span class="hljs-string">&quot;properties&quot;</span>: {
                        <span class="hljs-string">&quot;collection_name&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;string&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Collection name&quot;</span>},
                        <span class="hljs-string">&quot;description&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;string&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Collection description&quot;</span>}
                    },
                    <span class="hljs-string">&quot;required&quot;</span>: [<span class="hljs-string">&quot;collection_name&quot;</span>]
                }
            }
        },
        {
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;function&quot;</span>,
            <span class="hljs-string">&quot;function&quot;</span>: {
                <span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;add_documents&quot;</span>,
                <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Add documents to collection&quot;</span>,
                <span class="hljs-string">&quot;parameters&quot;</span>: {
                    <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;object&quot;</span>,
                    <span class="hljs-string">&quot;properties&quot;</span>: {
                        <span class="hljs-string">&quot;collection_name&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;string&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Collection name&quot;</span>},
                        <span class="hljs-string">&quot;documents&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;array&quot;</span>, <span class="hljs-string">&quot;items&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;string&quot;</span>}, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Document list&quot;</span>}
                    },
                    <span class="hljs-string">&quot;required&quot;</span>: [<span class="hljs-string">&quot;collection_name&quot;</span>, <span class="hljs-string">&quot;documents&quot;</span>]
                }
            }
        },
        {
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;function&quot;</span>,
            <span class="hljs-string">&quot;function&quot;</span>: {
                <span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;search_documents&quot;</span>,
                <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Search similar documents&quot;</span>,
                <span class="hljs-string">&quot;parameters&quot;</span>: {
                    <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;object&quot;</span>,
                    <span class="hljs-string">&quot;properties&quot;</span>: {
                        <span class="hljs-string">&quot;collection_name&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;string&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Collection name&quot;</span>},
                        <span class="hljs-string">&quot;query&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;string&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Search content&quot;</span>},
                        <span class="hljs-string">&quot;limit&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;integer&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Number of results&quot;</span>, <span class="hljs-string">&quot;default&quot;</span>: <span class="hljs-number">5</span>}
                    },
                    <span class="hljs-string">&quot;required&quot;</span>: [<span class="hljs-string">&quot;collection_name&quot;</span>, <span class="hljs-string">&quot;query&quot;</span>]
                }
            }
        },
        {
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;function&quot;</span>,
            <span class="hljs-string">&quot;function&quot;</span>: {
                <span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;list_all_collections&quot;</span>,
                <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Query information about all collections in database&quot;</span>,
                <span class="hljs-string">&quot;parameters&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;object&quot;</span>, <span class="hljs-string">&quot;properties&quot;</span>: {}, <span class="hljs-string">&quot;required&quot;</span>: []}
            }
        },
        {
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;function&quot;</span>,
            <span class="hljs-string">&quot;function&quot;</span>: {
                <span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;read_and_chunk_file&quot;</span>,
                <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Read local file and chunk into text blocks&quot;</span>,
                <span class="hljs-string">&quot;parameters&quot;</span>: {
                    <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;object&quot;</span>,
                    <span class="hljs-string">&quot;properties&quot;</span>: {
                        <span class="hljs-string">&quot;file_path&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;string&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;File path&quot;</span>},
                        <span class="hljs-string">&quot;chunk_size&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;integer&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Size of each text chunk&quot;</span>, <span class="hljs-string">&quot;default&quot;</span>: <span class="hljs-number">500</span>},
                        <span class="hljs-string">&quot;overlap&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;integer&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Overlapping characters between text chunks&quot;</span>, <span class="hljs-string">&quot;default&quot;</span>: <span class="hljs-number">50</span>}
                    },
                    <span class="hljs-string">&quot;required&quot;</span>: [<span class="hljs-string">&quot;file_path&quot;</span>]
                }
            }
        },
        {
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;function&quot;</span>,
            <span class="hljs-string">&quot;function&quot;</span>: {
                <span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;upload_file_to_collection&quot;</span>,
                <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Upload local file to specified collection, automatically chunk and vectorize&quot;</span>,
                <span class="hljs-string">&quot;parameters&quot;</span>: {
                    <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;object&quot;</span>,
                    <span class="hljs-string">&quot;properties&quot;</span>: {
                        <span class="hljs-string">&quot;file_path&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;string&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;File path&quot;</span>},
                        <span class="hljs-string">&quot;collection_name&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;string&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Target collection name&quot;</span>},
                        <span class="hljs-string">&quot;chunk_size&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;integer&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Size of each text chunk&quot;</span>, <span class="hljs-string">&quot;default&quot;</span>: <span class="hljs-number">500</span>},
                        <span class="hljs-string">&quot;overlap&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;integer&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Overlapping characters between text chunks&quot;</span>, <span class="hljs-string">&quot;default&quot;</span>: <span class="hljs-number">50</span>}
                    },
                    <span class="hljs-string">&quot;required&quot;</span>: [<span class="hljs-string">&quot;file_path&quot;</span>, <span class="hljs-string">&quot;collection_name&quot;</span>]
                }
            }
        }
    ]
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;✅ Intelligent assistant startup complete&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="42-Tool-Mapping-and-Execution" class="common-anchor-header"><strong>4.2 تعيين الأدوات وتنفيذها</strong></h3><p>يتم تنفيذ جميع الأدوات بشكل موحد من خلال _execute_tool.</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">_execute_tool</span>(<span class="hljs-params">self, tool_name: <span class="hljs-built_in">str</span>, args: <span class="hljs-built_in">dict</span></span>) -&gt; <span class="hljs-built_in">dict</span>:
    <span class="hljs-string">&quot;&quot;&quot;Execute specific tool&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> tool_name == <span class="hljs-string">&quot;connect_database&quot;</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.vector_db.connect_database()
    <span class="hljs-keyword">elif</span> tool_name == <span class="hljs-string">&quot;create_collection&quot;</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.vector_db.create_collection(**args)
    <span class="hljs-keyword">elif</span> tool_name == <span class="hljs-string">&quot;add_documents&quot;</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.vector_db.add_documents(**args)
    <span class="hljs-keyword">elif</span> tool_name == <span class="hljs-string">&quot;search_documents&quot;</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.vector_db.search_documents(**args)
    <span class="hljs-keyword">elif</span> tool_name == <span class="hljs-string">&quot;list_all_collections&quot;</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.vector_db.list_all_collections()
    <span class="hljs-keyword">elif</span> tool_name == <span class="hljs-string">&quot;read_and_chunk_file&quot;</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.vector_db.read_and_chunk_file(**args)
    <span class="hljs-keyword">elif</span> tool_name == <span class="hljs-string">&quot;upload_file_to_collection&quot;</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.vector_db.upload_file_to_collection(**args)
    <span class="hljs-keyword">else</span>:
        <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Unknown tool: <span class="hljs-subst">{tool_name}</span>&quot;</span>}
<button class="copy-code-btn"></button></code></pre>
<h3 id="43-Core-Conversation-Engine" class="common-anchor-header"><strong>4.3 محرك المحادثة الأساسي</strong></h3><p>هذا هو المكان الذي يحدث فيه السحر. تستدعي هذه الطريقة أحدث نموذج من كيمي:<a href="https://moonshotai.github.io/Kimi-K2/"> kimi-k2-0711-preview</a> لتحليل نية المستخدم، وتحديد الأدوات المطلوبة وتنفيذها تلقائيًا، ثم إعادة النتائج إلى كيمي، وأخيرًا توليد الإجابات النهائية بناءً على نتائج الأداة.</p>
<p>ما يجعل هذا الأمر قويًا بشكل خاص هو حلقة المحادثة - يمكن لـ Kimi K2 أن يربط مكالمات الأدوات المتعددة معًا، ويتعلم من النتائج الوسيطة، ويكيّف استراتيجيته بناءً على ما يكتشفه. وهذا يتيح سير العمل المعقد الذي يتطلب خطوات يدوية متعددة في الأنظمة التقليدية.</p>
<p><strong>تكوين المعلمة:</strong></p>
<ul>
<li><p><code translate="no">temperature=0.3</code>: يضمن انخفاض درجة الحرارة استقرار استدعاء الأداة</p></li>
<li><p><code translate="no">tool_choice=&quot;auto&quot;</code>: يتيح لـ Kimi أن يقرر بشكل مستقل ما إذا كان يجب استخدام الأدوات أم لا</p></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">execute_command</span>(<span class="hljs-params">self, user_command: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-string">&quot;&quot;&quot;Execute user command&quot;&quot;&quot;</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n📝 User command: <span class="hljs-subst">{user_command}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    
    <span class="hljs-comment"># Prepare conversation messages</span>
    messages = [
        {
            <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>,
            <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;&quot;&quot;You are an intelligent assistant that can help users manage vector databases and answer questions.

Intelligent Decision Principles:
1. Prioritize answer speed and quality, choose optimal response methods
2. For general knowledge questions, directly use your knowledge for quick responses
3. Only use database search in the following situations:
   - User explicitly requests searching database content
   - Questions involve user-uploaded specific documents or professional materials
   - Need to find specific, specialized information
4. You can handle file uploads, database management and other tasks
5. Always aim to provide the fastest, most accurate answers

Important Reminders:
- Before executing any database operations, please first call connect_database to connect to the database
- If encountering API limit errors, the system will automatically retry, please be patient

Remember: Don&#x27;t use tools just to use tools, but solve user problems in the optimal way.&quot;&quot;&quot;</span>
        },
        {
            <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>,
            <span class="hljs-string">&quot;content&quot;</span>: user_command
        }
    ]
    
    <span class="hljs-comment"># Start conversation and tool calling loop</span>
    <span class="hljs-keyword">while</span> <span class="hljs-literal">True</span>:
        <span class="hljs-keyword">try</span>:
            <span class="hljs-comment"># Call Kimi model - Add retry mechanism to handle API limits</span>
            max_retries = <span class="hljs-number">5</span>
            retry_delay = <span class="hljs-number">20</span>  <span class="hljs-comment"># seconds</span>
            
            <span class="hljs-keyword">for</span> attempt <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(max_retries):
                <span class="hljs-keyword">try</span>:
                    response = <span class="hljs-variable language_">self</span>.kimi_client.chat.completions.create(
                        model=<span class="hljs-string">&quot;kimi-k2-0711-preview&quot;</span>, <span class="hljs-comment">#moonshot-v1-8k</span>
                        messages=messages,
                        temperature=<span class="hljs-number">0.3</span>,
                        tools=<span class="hljs-variable language_">self</span>.available_tools,
                        tool_choice=<span class="hljs-string">&quot;auto&quot;</span>
                    )
                    <span class="hljs-keyword">break</span>  <span class="hljs-comment"># Success, break out of retry loop</span>
                <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
                    <span class="hljs-keyword">if</span> <span class="hljs-string">&quot;rate_limit&quot;</span> <span class="hljs-keyword">in</span> <span class="hljs-built_in">str</span>(e).lower() <span class="hljs-keyword">or</span> <span class="hljs-string">&quot;429&quot;</span> <span class="hljs-keyword">in</span> <span class="hljs-built_in">str</span>(e) <span class="hljs-keyword">and</span> attempt &lt; max_retries - <span class="hljs-number">1</span>:
                        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;⏳ Kimi API limit, waiting <span class="hljs-subst">{retry_delay}</span> seconds before retry... (attempt <span class="hljs-subst">{attempt + <span class="hljs-number">1</span>}</span>/<span class="hljs-subst">{max_retries}</span>)&quot;</span>)
                        time.sleep(retry_delay)
                        retry_delay *= <span class="hljs-number">1.5</span>  <span class="hljs-comment"># Moderately increase delay</span>
                        <span class="hljs-keyword">continue</span>
                    <span class="hljs-keyword">else</span>:
                        <span class="hljs-keyword">raise</span> e
            <span class="hljs-keyword">else</span>:
                <span class="hljs-keyword">raise</span> Exception(<span class="hljs-string">&quot;Failed to call Kimi API: exceeded maximum retry attempts&quot;</span>)
            
            choice = response.choices[<span class="hljs-number">0</span>]
            
            <span class="hljs-comment"># If need to call tools</span>
            <span class="hljs-keyword">if</span> choice.finish_reason == <span class="hljs-string">&quot;tool_calls&quot;</span>:
                messages.append(choice.message)
                
                <span class="hljs-comment"># Execute each tool call</span>
                <span class="hljs-keyword">for</span> tool_call <span class="hljs-keyword">in</span> choice.message.tool_calls:
                    tool_name = tool_call.function.name
                    tool_args = json.loads(tool_call.function.arguments)
                    
                    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;🔧 Calling tool: <span class="hljs-subst">{tool_name}</span>&quot;</span>)
                    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;📋 Parameters: <span class="hljs-subst">{tool_args}</span>&quot;</span>)
                    
                    <span class="hljs-comment"># Execute tool</span>
                    result = <span class="hljs-variable language_">self</span>._execute_tool(tool_name, tool_args)
                    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;✅ Result: <span class="hljs-subst">{result}</span>&quot;</span>)
                    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;-&quot;</span> * <span class="hljs-number">40</span>)
                    
                    <span class="hljs-comment"># Add tool result to conversation</span>
                    messages.append({
                        <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;tool&quot;</span>,
                        <span class="hljs-string">&quot;tool_call_id&quot;</span>: tool_call.<span class="hljs-built_in">id</span>,
                        <span class="hljs-string">&quot;name&quot;</span>: tool_name,
                        <span class="hljs-string">&quot;content&quot;</span>: json.dumps(result)
                    })
            
            <span class="hljs-comment"># If task completed</span>
            <span class="hljs-keyword">else</span>:
                final_response = choice.message.content
                <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;🎯 Task completed: <span class="hljs-subst">{final_response}</span>&quot;</span>)
                <span class="hljs-keyword">return</span> final_response
        
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            error_msg = <span class="hljs-string">f&quot;Execution error: <span class="hljs-subst">{<span class="hljs-built_in">str</span>(e)}</span>&quot;</span>
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;❌ <span class="hljs-subst">{error_msg}</span>&quot;</span>)
            <span class="hljs-keyword">return</span> error_msg
<button class="copy-code-btn"></button></code></pre>
<h2 id="Main-Program-and-Usage-Demonstration" class="common-anchor-header">البرنامج الرئيسي وشرح الاستخدام<button data-href="#Main-Program-and-Usage-Demonstration" class="anchor-icon" translate="no">
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
    </button></h2><p>يقوم هذا البرنامج الرئيسي بإعداد البيئة التفاعلية. للاستخدام في الإنتاج، ستحتاج إلى استبدال مفاتيح واجهة برمجة التطبيقات المشفرة بمتغيرات البيئة وإضافة تسجيل ومراقبة مناسبة.</p>
<p>احصل على <code translate="no">KIMI_API_KEY</code> و <code translate="no">OPENAI_API_KEY</code> من الموقع الرسمي لبدء الاستخدام.</p>
<pre><code translate="no">python
<span class="hljs-keyword">def</span> <span class="hljs-title function_">main</span>():
    <span class="hljs-string">&quot;&quot;&quot;Main program&quot;&quot;&quot;</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;🌟 Kimi K2 Intelligent Vector Database Assistant&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    
    <span class="hljs-comment"># API key configuration</span>
    KIMI_API_KEY = <span class="hljs-string">&quot;sk-xxxxxxxxxxxxxxxx&quot;</span>
    OPENAI_API_KEY = <span class="hljs-string">&quot;sk-proj-xxxxxxxxxxxxxxxx&quot;</span>
    
    <span class="hljs-comment"># Create intelligent assistant</span>
    assistant = SmartAssistant(KIMI_API_KEY, OPENAI_API_KEY)
    
    <span class="hljs-comment"># Interactive mode</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n🎮 Interactive mode (enter &#x27;quit&#x27; to exit)&quot;</span>)
    <span class="hljs-keyword">while</span> <span class="hljs-literal">True</span>:
        <span class="hljs-keyword">try</span>:
            user_input = <span class="hljs-built_in">input</span>(<span class="hljs-string">&quot;\nPlease enter command: &quot;</span>).strip()
            <span class="hljs-keyword">if</span> user_input.lower() <span class="hljs-keyword">in</span> [<span class="hljs-string">&#x27;quit&#x27;</span>, <span class="hljs-string">&#x27;exit&#x27;</span>]:
                <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;👋 Goodbye!&quot;</span>)
                <span class="hljs-keyword">break</span>
            
            <span class="hljs-keyword">if</span> user_input:
                assistant.execute_command(user_input)
                <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n&quot;</span> + <span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
        
        <span class="hljs-keyword">except</span> KeyboardInterrupt:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n👋 Goodbye!&quot;</span>)
            <span class="hljs-keyword">break</span>

<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    main()
<button class="copy-code-btn"></button></code></pre>
<h2 id="Usage-Examples" class="common-anchor-header">أمثلة على الاستخدام<button data-href="#Usage-Examples" class="anchor-icon" translate="no">
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
    </button></h2><p>توضح هذه الأمثلة قدرات النظام في سيناريوهات واقعية قد يواجهها المهندسون في بيئات الإنتاج.</p>
<h3 id="Upload-file-example" class="common-anchor-header">مثال تحميل ملف</h3><p>يوضح هذا المثال كيف يتعامل النظام مع سير عمل معقد بشكل مستقل. لاحظ كيف يقوم Kimi K2 بتحليل طلب المستخدم وتنفيذ الخطوات اللازمة بالترتيب الصحيح.</p>
<pre><code translate="no">User Input: Upload ./The Adventures of Sherlock Holmes.txt to the database
<button class="copy-code-btn"></button></code></pre>
<p>اللافت للنظر هنا هو أنه من خلال سلسلة استدعاء الأداة، يمكنك أن ترى أن Kimi K2 يقوم بتحليل الأمر ويعرف كيفية الاتصال بقاعدة البيانات (دالة connect_database) أولاً، ثم تحميل الملف إلى المجموعة (دالة upload_file_to_collection).</p>
<p>عند مواجهة خطأ، يعرف Kimi K2 أيضًا تصحيحه على الفور استنادًا إلى رسالة الخطأ، مع العلم أنه يجب عليه أولاً إنشاء المجموعة (create_collection) ثم تحميل الملف إلى المجموعة (الدالة upload_file_to_collection). يعد هذا الاسترداد المستقل للأخطاء ميزة رئيسية مقارنةً بالنهج النصية التقليدية.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/usage_example_1_a4c0b2a006.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>يعالج النظام تلقائيًا:</p>
<ol>
<li><p>اتصال قاعدة البيانات</p></li>
<li><p>إنشاء المجموعة (إذا لزم الأمر)</p></li>
<li><p>قراءة الملف وتقطيعه</p></li>
<li><p>توليد المتجهات</p></li>
<li><p>إدخال البيانات</p></li>
<li><p>الإبلاغ عن الحالة</p></li>
</ol>
<h3 id="Question-answer-example" class="common-anchor-header">مثال على الأسئلة والأجوبة</h3><p>يوضح هذا القسم ذكاء النظام في تحديد وقت استخدام الأدوات مقابل الاعتماد على المعرفة الموجودة.</p>
<pre><code translate="no">User Input: List five advantages of the Milvus vector database
<button class="copy-code-btn"></button></code></pre>
<p>من الصورة، يمكننا أن نرى أن Kimi K2 أجاب على سؤال المستخدم مباشرةً دون استدعاء أي دوال. وهذا يوضح كفاءة النظام - فهو لا يقوم بعمليات غير ضرورية في قاعدة البيانات للأسئلة التي يمكنه الإجابة عليها من بيانات التدريب الخاصة به.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/usage_example_2_c912f3273b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<pre><code translate="no"><span class="hljs-title class_">How</span> many stories are included <span class="hljs-keyword">in</span> the book <span class="hljs-string">&quot;Sherlock Holmes&quot;</span> that I uploaded? <span class="hljs-title class_">Summarize</span> each story <span class="hljs-keyword">in</span> one sentence.
<button class="copy-code-btn"></button></code></pre>
<p>بالنسبة لهذا الاستعلام، يحدد Kimi بشكل صحيح أنه يحتاج إلى البحث في محتوى المستند الذي تم تحميله. النظام:</p>
<ol>
<li><p>يدرك أن هذا يتطلب معلومات خاصة بالمستند</p></li>
<li><p>يستدعي الدالة search_documents</p></li>
<li><p>يحلل المحتوى المسترجع</p></li>
<li><p>يوفر إجابة شاملة استنادًا إلى المحتوى الفعلي الذي تم تحميله</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/usage_example_3_7517b69889.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/usage_example_4_96ea51a798.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Database-Management-Example" class="common-anchor-header">مثال على إدارة قاعدة البيانات</h3><p>يتم التعامل مع المهام الإدارية بنفس سلاسة الاستعلام عن المحتوى.</p>
<pre><code translate="no"><span class="hljs-built_in">list</span> <span class="hljs-built_in">all</span> the collections
<button class="copy-code-btn"></button></code></pre>
<p>يستخدم نظام Kimi K2 الأدوات المناسبة للإجابة على هذا السؤال بشكل صحيح، مما يدل على أنه يفهم كلاً من العمليات الإدارية وعمليات المحتوى.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/usage_example_5_457a4d5db0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>يوفر النظام معلومات شاملة بما في ذلك:</p>
<ul>
<li><p>أسماء المجموعات</p></li>
<li><p>أعداد المستندات</p></li>
<li><p>الأوصاف</p></li>
<li><p>إحصائيات قاعدة البيانات الإجمالية</p></li>
</ul>
<h2 id="The-Dawn-of-Production-AI-Agents" class="common-anchor-header">فجر وكلاء الذكاء الاصطناعي الإنتاجي<button data-href="#The-Dawn-of-Production-AI-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>من خلال ربط <strong>Kimi K2</strong> بـ <strong>Milvus،</strong> نكون قد تجاوزنا روبوتات الدردشة التقليدية أو البحث الدلالي الأساسي. ما قمنا ببنائه هو وكيل إنتاج حقيقي - وكيل يمكنه تفسير التعليمات المعقدة، وتقسيمها إلى تدفقات عمل قائمة على الأدوات، وتنفيذ مهام شاملة مثل معالجة الملفات، والبحث الدلالي، والأسئلة والأجوبة الذكية بأقل قدر من النفقات العامة.</p>
<p>تعكس هذه البنية تحولاً أوسع نطاقاً في تطوير الذكاء الاصطناعي، والانتقال من النماذج المعزولة إلى الأنظمة القابلة للتركيب، حيث يعمل التفكير والذاكرة والعمل جنباً إلى جنب. توفر أنظمة LLMs مثل Kimi K2 الاستدلال المرن، بينما توفر قواعد البيانات المتجهة مثل Milvus ذاكرة منظمة طويلة الأجل؛ وتتيح أداة استدعاء الأدوات التنفيذ في العالم الحقيقي.</p>
<p>بالنسبة للمطورين، لم يعد السؤال المطروح هو <em>ما إذا</em> كانت هذه المكونات قادرة على العمل معًا، بل <em>مدى</em> قدرتها على التعميم عبر النطاقات، والتوسع مع البيانات، والاستجابة لاحتياجات المستخدم التي تزداد تعقيدًا.</p>
<p><strong><em>وبالنظر إلى المستقبل، هناك نمط واحد أصبح واضحًا: LLM (التفكير) + Vector DB (المعرفة) + الأدوات (العمل) = وكلاء ذكاء اصطناعي حقيقيون.</em></strong></p>
<p>هذا النظام الذي بنيناه هو مجرد مثال واحد، ولكن المبادئ تنطبق على نطاق واسع. ومع استمرار تحسُّن الآلات ذات قاعدة البيانات المحلية ونضوج منظومات الأدوات، فإن ميلفوس في وضع يؤهلها لتظل جزءًا أساسيًا من مجموعة الذكاء الاصطناعي الإنتاجية - حيث تعمل على تشغيل أنظمة ذكية يمكنها التفكير في البيانات، وليس فقط استرجاعها.</p>
