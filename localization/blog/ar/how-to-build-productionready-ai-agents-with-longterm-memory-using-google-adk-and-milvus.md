---
id: >-
  how-to-build-productionready-ai-agents-with-longterm-memory-using-google-adk-and-milvus.md
title: >-
  كيفية بناء وكلاء ذكاء اصطناعي جاهزين للإنتاج مع ذاكرة طويلة المدى باستخدام
  Google ADK و Milvus
author: Min Yin
date: 2026-02-26T00:00:00.000Z
cover: 'https://assets.zilliz.com/cover_c543dbeab4.png'
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, RAG'
meta_keywords: >-
  AI agent memory, long-term memory, ADK framework, Milvus vector database,
  semantic retrieval
meta_title: |
  Production AI Agents with Persistent Memory Using Google ADK and Milvus
desc: >-
  بناء وكلاء ذكاء اصطناعي بذاكرة حقيقية طويلة المدى باستخدام ADK وMilvus، حيث
  يغطي تصميم الذاكرة، والاسترجاع الدلالي، وعزل المستخدم، والبنية الجاهزة
  للإنتاج.
origin: >-
  https://milvus.io/blog/how-to-build-productionready-ai-agents-with-longterm-memory-using-google-adk-and-milvus.md
---
<p>عند بناء وكلاء أذكياء، فإن إحدى أصعب المشاكل هي إدارة الذاكرة: تحديد ما يجب أن يتذكره الوكيل وما يجب أن ينساه.</p>
<p>ليس من المفترض أن تدوم كل الذاكرة. بعض البيانات مطلوبة فقط للمحادثة الحالية ويجب مسحها عند انتهائها. أما البيانات الأخرى، مثل تفضيلات المستخدم، فيجب أن تستمر عبر المحادثات. عندما تختلط هذه البيانات، تتراكم البيانات المؤقتة وتضيع المعلومات المهمة.</p>
<p>المشكلة الحقيقية هي مشكلة معمارية. لا تفرض معظم أطر العمل فصلًا واضحًا بين الذاكرة قصيرة الأجل والذاكرة طويلة الأجل، مما يترك المطورين للتعامل معها يدويًا.</p>
<p>تعالج <a href="https://google.github.io/adk-docs/">مجموعة أدوات تطوير العوامل</a> مفتوحة المصدر من Google <a href="https://google.github.io/adk-docs/">(ADK)</a>، التي تم إصدارها في عام 2025، هذه المشكلة على مستوى إطار العمل من خلال جعل إدارة الذاكرة من اهتمامات الدرجة الأولى. فهي تفرض فصلًا افتراضيًا بين ذاكرة الجلسة قصيرة المدى وذاكرة المدى الطويل.</p>
<p>في هذه المقالة، سنلقي نظرة على كيفية عمل هذا الفصل عمليًا. باستخدام Milvus كقاعدة بيانات المتجه، سنقوم ببناء وكيل جاهز للإنتاج مع ذاكرة حقيقية طويلة الأجل من الصفر.</p>
<h2 id="ADK’s-Core-Design-Principles" class="common-anchor-header">مبادئ تصميم ADK الأساسية<button data-href="#ADK’s-Core-Design-Principles" class="anchor-icon" translate="no">
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
    </button></h2><p>تم تصميم ADK لإزالة إدارة الذاكرة من على عاتق المطور. يفصل الإطار تلقائيًا بيانات الجلسة قصيرة الأجل عن الذاكرة طويلة الأجل ويعالج كل منها بشكل مناسب. يقوم بذلك من خلال أربعة خيارات تصميم أساسية.</p>
<h3 id="Built-in-Interfaces-for-Short--and-Long-Term-Memory" class="common-anchor-header">واجهات مدمجة للذاكرة قصيرة وطويلة الأمد</h3><p>يأتي كل وكيل ADK مع واجهتين مدمجتين لإدارة الذاكرة:</p>
<p><strong>خدمة الجلسة (البيانات المؤقتة)</strong></p>
<ul>
<li><strong>ما تقوم بتخزينه</strong>: محتوى المحادثة الحالي والنتائج الوسيطة من استدعاءات الأداة</li>
<li><strong>متى يتم مسحها</strong>: يتم مسحها تلقائيًا عند انتهاء الجلسة</li>
<li><strong>مكان تخزينها</strong>: في الذاكرة (الأسرع) أو قاعدة بيانات أو خدمة سحابية</li>
</ul>
<p><strong>خدمة الذاكرة (الذاكرة طويلة المدى)</strong></p>
<ul>
<li><strong>ماذا تخزن</strong>: المعلومات التي يجب تذكرها، مثل تفضيلات المستخدم أو السجلات السابقة</li>
<li><strong>متى يتم مسحها</strong>: لا يتم مسحها تلقائيًا؛ يجب حذفها يدويًا</li>
<li><strong>مكان تخزينها</strong>: تحدد ADK الواجهة فقط؛ أما الواجهة الخلفية للتخزين فهي متروكة لك (على سبيل المثال، ميلفوس)</li>
</ul>
<h3 id="A-Three-Layer-Architecture" class="common-anchor-header">بنية ثلاثية الطبقات</h3><p>تقسم ADK النظام إلى ثلاث طبقات، لكل منها مسؤولية واحدة:</p>
<ul>
<li><strong>طبقة الوكيل</strong>: حيث يوجد منطق العمل، مثل "استرجاع الذاكرة ذات الصلة قبل الرد على المستخدم".</li>
<li><strong>طبقة وقت التشغيل</strong>: يديرها إطار العمل، وهي مسؤولة عن إنشاء الجلسات وتدميرها وتتبع كل خطوة من خطوات التنفيذ.</li>
<li><strong>طبقة الخدمة</strong>: تتكامل مع أنظمة خارجية، مثل قواعد البيانات المتجهة مثل ميلفوس أو واجهات برمجة التطبيقات النموذجية الكبيرة.</li>
</ul>
<p>تحافظ هذه البنية على الاهتمامات منفصلة: يعيش منطق العمل في الوكيل، بينما يعيش التخزين في مكان آخر. يمكنك تحديث أحدهما دون كسر الآخر.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/how_to_build_productionready_ai_agents_with_longterm_memory_using_google_adk_and_milvus_2_6af7f3a395.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Everything-Is-Recorded-as-Events" class="common-anchor-header">يتم تسجيل كل شيء كأحداث</h3><p>يتم تسجيل كل إجراء يتخذه الوكيل - استدعاء أداة استدعاء الذاكرة، استدعاء نموذج، توليد استجابة - <strong>كحدث</strong>.</p>
<p>هذا له فائدتان عمليتان. أولاً، عندما يحدث خطأ ما، يمكن للمطورين إعادة تشغيل التفاعل بأكمله خطوة بخطوة للعثور على نقطة الفشل بالضبط. ثانياً، من أجل التدقيق والامتثال، يوفر النظام تتبعاً كاملاً لتنفيذ كل تفاعل للمستخدم.</p>
<h3 id="Prefix-Based-Data-Scoping" class="common-anchor-header">تحديد نطاق البيانات المستند إلى البادئة</h3><p>يتحكم ADK في رؤية البيانات باستخدام بادئات مفاتيح بسيطة:</p>
<ul>
<li><strong>temp:xxx</strong> - مرئية فقط داخل الجلسة الحالية ويتم إزالتها تلقائيًا عند انتهائها</li>
<li><strong>المستخدم:xxx</strong> - مشتركة عبر جميع الجلسات لنفس المستخدم، مما يتيح تفضيلات المستخدم المستمرة</li>
<li><strong>التطبيق:xxx</strong> - مشترك عالميًا عبر جميع المستخدمين، ومناسب للمعرفة على مستوى التطبيق مثل وثائق المنتج</li>
</ul>
<p>باستخدام البادئات، يمكن للمطورين التحكم في نطاق البيانات دون كتابة منطق وصول إضافي. يتعامل إطار العمل مع الرؤية والعمر الافتراضي تلقائيًا.</p>
<h2 id="Milvus-as-the-Memory-Backend-for-ADK" class="common-anchor-header">ميلفوس كواجهة خلفية للذاكرة في ADK<button data-href="#Milvus-as-the-Memory-Backend-for-ADK" class="anchor-icon" translate="no">
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
    </button></h2><p>في ADK، تعد MemoryService في ADK مجرد واجهة. وهي تحدد كيفية استخدام الذاكرة طويلة المدى، ولكن ليس كيفية تخزينها. اختيار قاعدة البيانات متروك للمطور. فما نوع قاعدة البيانات التي تعمل بشكل جيد كواجهة خلفية لذاكرة الوكيل؟</p>
<h3 id="What-an-Agent-Memory-System-Needs--and-How-Milvus-Delivers" class="common-anchor-header">ما يحتاجه نظام ذاكرة الوكيل - وكيف يقدمه ميلفوس</h3><ul>
<li><strong>الاسترجاع الدلالي</strong></li>
</ul>
<p><strong>الحاجة</strong>:</p>
<p>نادرًا ما يطرح المستخدمون نفس السؤال بنفس الطريقة. "لا يتصل" و"مهلة الاتصال" تعنيان نفس الشيء. يجب أن يفهم نظام الذاكرة المعنى، وليس فقط مطابقة الكلمات الرئيسية.</p>
<p><strong>كيف يلبي ميلفوس ذلك</strong>:</p>
<p>يدعم Milvus العديد من أنواع فهارس المتجهات، مثل HNSW و DiskANN، مما يسمح للمطورين باختيار ما يناسب عبء العمل الخاص بهم. حتى مع وجود عشرات الملايين من المتجهات، يمكن أن يظل زمن انتقال الاستعلام أقل من 10 مللي ثانية، وهو سريع بما يكفي لاستخدام الوكيل.</p>
<ul>
<li><strong>الاستعلامات الهجينة</strong></li>
</ul>
<p><strong>الحاجة</strong></p>
<p>يتطلب استدعاء الذاكرة أكثر من البحث الدلالي. يجب على النظام أيضًا التصفية حسب الحقول المهيكلة مثل user_id بحيث يتم إرجاع بيانات المستخدم الحالي فقط.</p>
<p><strong>كيف يلبي ميلفوس ذلك</strong>:</p>
<p>يدعم ميلفوس أصلاً الاستعلامات المختلطة التي تجمع بين البحث المتجه والتصفية العددية. على سبيل المثال، يمكنه استرداد سجلات متشابهة دلاليًا أثناء تطبيق عامل تصفية مثل user_id = 'xxx' في نفس الاستعلام، دون الإضرار بالأداء أو جودة الاستدعاء.</p>
<ul>
<li><strong>قابلية التوسع</strong></li>
</ul>
<p><strong>الحاجة</strong>:</p>
<p>مع تزايد عدد المستخدمين والذكريات المخزنة، يجب أن يتوسع النظام بسلاسة. يجب أن يظل الأداء مستقرًا مع زيادة البيانات، دون حدوث تباطؤ أو أعطال مفاجئة.</p>
<p><strong>كيف يلبي ميلفوس هذه الحاجة</strong>:</p>
<p>يستخدم ميلفوس بنية فصل بين الحوسبة والتخزين. يمكن توسيع سعة الاستعلام أفقياً عن طريق إضافة عقد الاستعلام حسب الحاجة. حتى النسخة المستقلة، التي تعمل على جهاز واحد، يمكنها التعامل مع عشرات الملايين من المتجهات، مما يجعلها مناسبة لعمليات النشر في المراحل المبكرة.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/how_to_build_productionready_ai_agents_with_longterm_memory_using_google_adk_and_milvus_4_e1d89e6986.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>ملاحظة: بالنسبة للتطوير والاختبار المحليين، تستخدم الأمثلة في هذه المقالة <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a> أو <a href="https://milvus.io/docs/install_standalone-docker.md">Milvus Standalone</a>.</p>
<h2 id="Building-an-Agent-with-Long-TermMemory-Powered-by-Milvus" class="common-anchor-header">بناء وكيل مع الذاكرة طويلة الأمد مدعوم من ميلفوس<button data-href="#Building-an-Agent-with-Long-TermMemory-Powered-by-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>في هذا القسم، نقوم ببناء وكيل دعم فني بسيط. عندما يطرح أحد المستخدمين سؤالاً، يبحث الوكيل عن تذاكر دعم سابقة مشابهة للإجابة عليها، بدلاً من تكرار نفس العمل.</p>
<p>هذا المثال مفيد لأنه يوضح ثلاث مشاكل شائعة يجب على أنظمة ذاكرة الوكيل الحقيقية التعامل معها.</p>
<ul>
<li><strong>الذاكرة طويلة المدى عبر الجلسات</strong></li>
</ul>
<p>قد يتعلق السؤال المطروح اليوم بتذكرة تم إنشاؤها منذ أسابيع. يجب على الوكيل أن يتذكر المعلومات عبر المحادثات، وليس فقط داخل الجلسة الحالية. هذا هو السبب في الحاجة إلى ذاكرة طويلة الأمد، تتم إدارتها من خلال MemoryService.</p>
<ul>
<li><strong>عزل المستخدم</strong></li>
</ul>
<p>يجب أن يبقى سجل دعم كل مستخدم خاصاً. يجب ألا تظهر البيانات من مستخدم واحد في نتائج مستخدم آخر. يتطلب هذا تصفية حقول مثل user_id، وهو ما يدعمه ميلفوس عبر الاستعلامات المختلطة.</p>
<ul>
<li><strong>المطابقة الدلالية</strong></li>
</ul>
<p>يصف المستخدمون نفس المشكلة بطرق مختلفة، مثل "لا يمكن الاتصال" أو "مهلة". مطابقة الكلمات الرئيسية ليست كافية. يحتاج الوكيل إلى بحث دلالي، وهو ما يوفره استرجاع المتجهات.</p>
<h3 id="Environment-setup" class="common-anchor-header">إعداد البيئة</h3><ul>
<li>بايثون 3.11+</li>
<li>Docker و Docker Compose</li>
<li>مفتاح واجهة برمجة تطبيقات الجوزاء</li>
</ul>
<p>يغطي هذا القسم الإعداد الأساسي للتأكد من إمكانية تشغيل البرنامج بشكل صحيح.</p>
<pre><code translate="no">pip install google-adk pymilvus google-generativeai  
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-string">&quot;&quot;&quot;  
ADK + Milvus + Gemini Long-term Memory Agent  
Demonstrates how to implement a cross-session memory recall system  
&quot;&quot;&quot;</span>  
<span class="hljs-keyword">import</span> os  
<span class="hljs-keyword">import</span> asyncio  
<span class="hljs-keyword">import</span> time  
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, Collection, FieldSchema, CollectionSchema, DataType, utility  
<span class="hljs-keyword">import</span> google.generativeai <span class="hljs-keyword">as</span> genai  
<span class="hljs-keyword">from</span> google.adk.agents <span class="hljs-keyword">import</span> Agent  
<span class="hljs-keyword">from</span> google.adk.tools <span class="hljs-keyword">import</span> FunctionTool  
<span class="hljs-keyword">from</span> google.adk.runners <span class="hljs-keyword">import</span> Runner  
<span class="hljs-keyword">from</span> google.adk.sessions <span class="hljs-keyword">import</span> InMemorySessionService  
<span class="hljs-keyword">from</span> google.genai <span class="hljs-keyword">import</span> types  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-1-Deploy-Milvus-Standalone-Docker" class="common-anchor-header">الخطوة 1: نشر ميلفوس مستقل (Docker)</h3><p><strong>(1) قم بتنزيل ملفات النشر</strong></p>
<pre><code translate="no">wget &lt;https://github.com/Milvus-io/Milvus/releases/download/v2.5.12/Milvus-standalone-docker-compose.yml&gt; -O docker-compose.yml  
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) ابدأ تشغيل خدمة Milvus</strong></p>
<pre><code translate="no">docker-compose up -d  
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">docker-compose ps -a  
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/how_to_build_productionready_ai_agents_with_longterm_memory_using_google_adk_and_milvus_1_0ab7f330eb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Model-and-Connection-Configuration" class="common-anchor-header">الخطوة 2: تكوين النموذج والاتصال</h3><p>تكوين واجهة برمجة تطبيقات الجوزاء وإعدادات اتصال Milvus.</p>
<pre><code translate="no"><span class="hljs-comment"># ==================== Configuration ====================  </span>
<span class="hljs-comment"># 1. Gemini API configuration  </span>
GOOGLE_API_KEY = os.getenv(<span class="hljs-string">&quot;GOOGLE_API_KEY&quot;</span>)  
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> GOOGLE_API_KEY:  
   <span class="hljs-keyword">raise</span> ValueError(<span class="hljs-string">&quot;Please set the GOOGLE_API_KEY environment variable&quot;</span>)  
genai.configure(api_key=GOOGLE_API_KEY)  
<span class="hljs-comment"># 2. Milvus connection configuration  </span>
MILVUS_HOST = os.getenv(<span class="hljs-string">&quot;MILVUS_HOST&quot;</span>, <span class="hljs-string">&quot;localhost&quot;</span>)  
MILVUS_PORT = os.getenv(<span class="hljs-string">&quot;MILVUS_PORT&quot;</span>, <span class="hljs-string">&quot;19530&quot;</span>)  
<span class="hljs-comment"># 3. Model selection (best combination within the free tier limits)  </span>
LLM_MODEL = <span class="hljs-string">&quot;gemini-2.5-flash-lite&quot;</span>  <span class="hljs-comment"># LLM model: 1000 RPD  </span>
EMBEDDING_MODEL = <span class="hljs-string">&quot;models/text-embedding-004&quot;</span>  <span class="hljs-comment"># Embedding model: 1000 RPD  </span>
EMBEDDING_DIM = <span class="hljs-number">768</span>  <span class="hljs-comment"># Vector dimension  </span>
<span class="hljs-comment"># 4. Application configuration  </span>
APP_NAME = <span class="hljs-string">&quot;tech_support&quot;</span>  
USER_ID = <span class="hljs-string">&quot;user_123&quot;</span>  
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;✓ Using model configuration:&quot;</span>)  
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  LLM: <span class="hljs-subst">{LLM_MODEL}</span>&quot;</span>)  
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  Embedding: <span class="hljs-subst">{EMBEDDING_MODEL}</span> (dimension: <span class="hljs-subst">{EMBEDDING_DIM}</span>)&quot;</span>)  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Milvus-Database-Initialization" class="common-anchor-header">الخطوة 3 تهيئة قاعدة بيانات Milvus</h3><p>إنشاء مجموعة قاعدة بيانات متجهة (مشابهة لجدول في قاعدة بيانات علائقية)</p>
<pre><code translate="no"><span class="hljs-comment"># ==================== Initialize Milvus ====================  </span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">init_milvus</span>():  
   <span class="hljs-string">&quot;&quot;&quot;Initialize Milvus connection and collection&quot;&quot;&quot;</span>  
   <span class="hljs-comment"># Step 1: Establish connection  </span>
   Try:  
       connections.connect(  
           alias=<span class="hljs-string">&quot;default&quot;</span>,  
           host=MILVUS_HOST,  
           port=MILVUS_PORT  
       )  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;✓ Connected to Milvus: <span class="hljs-subst">{MILVUS_HOST}</span>:<span class="hljs-subst">{MILVUS_PORT}</span>&quot;</span>)  
   <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;✗ Failed to connect to Milvus: <span class="hljs-subst">{e}</span>&quot;</span>)  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Hint: make sure Milvus is running&quot;</span>)  
       Raise  
   <span class="hljs-comment"># Step 2: Define data schema  </span>
   fields = [  
       FieldSchema(name=<span class="hljs-string">&quot;id&quot;</span>, dtype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">True</span>),  
       FieldSchema(name=<span class="hljs-string">&quot;user_id&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">100</span>),  
       FieldSchema(name=<span class="hljs-string">&quot;session_id&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">100</span>),  
       FieldSchema(name=<span class="hljs-string">&quot;question&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">2000</span>),  
       FieldSchema(name=<span class="hljs-string">&quot;solution&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">5000</span>),  
       FieldSchema(name=<span class="hljs-string">&quot;embedding&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=EMBEDDING_DIM),  
       FieldSchema(name=<span class="hljs-string">&quot;timestamp&quot;</span>, dtype=DataType.INT64)  
   ]  
   schema = CollectionSchema(fields, description=<span class="hljs-string">&quot;Tech support memory&quot;</span>)  
   collection_name = <span class="hljs-string">&quot;support_memory&quot;</span>  
   <span class="hljs-comment"># Step 3: Create or load the collection  </span>
   <span class="hljs-keyword">if</span> utility.has_collection(collection_name):  
       memory_collection = Collection(name=collection_name)  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;✓ Collection &#x27;<span class="hljs-subst">{collection_name}</span>&#x27; already exists&quot;</span>)  
   Else:  
       memory_collection = Collection(name=collection_name, schema=schema)  
   <span class="hljs-comment"># Step 4: Create vector index  </span>
   index_params = {  
       <span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;IVF_FLAT&quot;</span>,  
       <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>,  
       <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">128</span>}  
   }  
   memory_collection.create_index(field_name=<span class="hljs-string">&quot;embedding&quot;</span>, index_params=index_params)  
   <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;✓ Created collection &#x27;<span class="hljs-subst">{collection_name}</span>&#x27; and index&quot;</span>)  
   <span class="hljs-keyword">return</span> memory_collection  
<span class="hljs-comment"># Run initialization  </span>
memory_collection = init_milvus()  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Memory-Operation-Functions" class="common-anchor-header">الخطوة 4 وظائف تشغيل الذاكرة</h3><p>قم بتغليف منطق التخزين والاسترجاع كأدوات للوكيل.</p>
<p>(1) دالة تخزين الذاكرة</p>
<pre><code translate="no"><span class="hljs-comment"># ==================== Memory Operation Functions ====================  </span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">store_memory</span>(<span class="hljs-params">question: <span class="hljs-built_in">str</span>, solution: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:  
   <span class="hljs-string">&quot;&quot;&quot;  
   Store a solution record into the memory store  
   Args:  
       question: the user&#x27;s question  
       solution: the solution  
   Returns:  
       str: result message  
   &quot;&quot;&quot;</span>  
   Try:  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\\n[Tool Call] store_memory&quot;</span>)  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot; - question: <span class="hljs-subst">{question[:<span class="hljs-number">50</span>]}</span>...&quot;</span>)  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot; - solution: <span class="hljs-subst">{solution[:<span class="hljs-number">50</span>]}</span>...&quot;</span>)  
       <span class="hljs-comment"># Use global USER_ID (in production, this should come from ToolContext)  </span>
       user_id = USER_ID  
       session_id = <span class="hljs-string">f&quot;session_<span class="hljs-subst">{<span class="hljs-built_in">int</span>(time.time())}</span>&quot;</span>  
       <span class="hljs-comment"># Key step 1: convert the question into a 768-dimensional vector  </span>
       embedding_result = genai.embed_content(  
           model=EMBEDDING_MODEL,  
           content=question,  
           task_type=<span class="hljs-string">&quot;retrieval_document&quot;</span>,  <span class="hljs-comment"># specify document indexing task  </span>
           output_dimensionality=EMBEDDING_DIM  
       )  
       embedding = embedding_result[<span class="hljs-string">&quot;embedding&quot;</span>]  
       <span class="hljs-comment"># Key step 2: insert into Milvus  </span>
       memory_collection.insert([{  
           <span class="hljs-string">&quot;user_id&quot;</span>: user_id,  
           <span class="hljs-string">&quot;session_id&quot;</span>: session_id,  
           <span class="hljs-string">&quot;question&quot;</span>: question,  
           <span class="hljs-string">&quot;solution&quot;</span>: solution,  
           <span class="hljs-string">&quot;embedding&quot;</span>: embedding,  
           <span class="hljs-string">&quot;timestamp&quot;</span>: <span class="hljs-built_in">int</span>(time.time())  
       }])  
       <span class="hljs-comment"># Key step 3: flush to disk (ensure data persistence)  </span>
       memory_collection.flush()  
       result = <span class="hljs-string">&quot;✓ Successfully stored in memory&quot;</span>  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Tool Result] <span class="hljs-subst">{result}</span>&quot;</span>)  
       <span class="hljs-keyword">return</span> result  
   <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:  
       error_msg = <span class="hljs-string">f&quot;✗ Storage failed: <span class="hljs-subst">{<span class="hljs-built_in">str</span>(e)}</span>&quot;</span>  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Tool Error] <span class="hljs-subst">{error_msg}</span>&quot;</span>)  
       <span class="hljs-keyword">return</span> error_msg  
<button class="copy-code-btn"></button></code></pre>
<p>(2) دالة استرجاع الذاكرة</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">recall_memory</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">3</span></span>) -&gt; <span class="hljs-built_in">str</span>:  
   <span class="hljs-string">&quot;&quot;&quot;  
   Retrieve relevant historical cases from the memory store  
   Args:  
       query: query question  
       top_k: number of most similar results to return  
   Returns:  
       str: retrieval result  
   &quot;&quot;&quot;</span>  
   Try:  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\\n[Tool Call] recall_memory&quot;</span>)  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot; - query: <span class="hljs-subst">{query}</span>&quot;</span>)  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot; - top_k: <span class="hljs-subst">{top_k}</span>&quot;</span>)  
       user_id = USER_ID  
       <span class="hljs-comment"># Key step 1: convert the query into a vector  </span>
       embedding_result = genai.embed_content(  
           model=EMBEDDING_MODEL,  
           content=query,  
           task_type=<span class="hljs-string">&quot;retrieval_query&quot;</span>,  <span class="hljs-comment"># specify query task (different from indexing)  </span>
           output_dimensionality=EMBEDDING_DIM  
       )  
       query_embedding = embedding_result[<span class="hljs-string">&quot;embedding&quot;</span>]  
       <span class="hljs-comment"># Key step 2: load the collection into memory (required for the first query)  </span>
       memory_collection.load()  
       <span class="hljs-comment"># Key step 3: hybrid search (vector similarity + scalar filtering)  </span>
       results = memory_collection.search(  
           data=[query_embedding],  
           anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,  
           param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},  
           limit=top_k,  
           expr=<span class="hljs-string">f&#x27;user_id == &quot;<span class="hljs-subst">{user_id}</span>&quot;&#x27;</span>,  <span class="hljs-comment"># 🔑 key to user isolation  </span>
           output_fields=[<span class="hljs-string">&quot;question&quot;</span>, <span class="hljs-string">&quot;solution&quot;</span>, <span class="hljs-string">&quot;timestamp&quot;</span>]  
       )  
       <span class="hljs-comment"># Key step 4: format results  </span>
       <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> results[<span class="hljs-number">0</span>]:  
           result = <span class="hljs-string">&quot;No relevant historical cases found&quot;</span>  
           <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Tool Result] <span class="hljs-subst">{result}</span>&quot;</span>)  
           <span class="hljs-keyword">return</span> result  
       result_text = <span class="hljs-string">f&quot;Found <span class="hljs-subst">{<span class="hljs-built_in">len</span>(results[<span class="hljs-number">0</span>])}</span> relevant cases:\\n\\n&quot;</span>  
       <span class="hljs-keyword">for</span> i, hit <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results[<span class="hljs-number">0</span>]):  
           result_text += <span class="hljs-string">f&quot;Case <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span> (similarity: <span class="hljs-subst">{hit.score:<span class="hljs-number">.2</span>f}</span>):\\n&quot;</span>  
           result_text += <span class="hljs-string">f&quot;Question: <span class="hljs-subst">{hit.entity.get(<span class="hljs-string">&#x27;question&#x27;</span>)}</span>\\n&quot;</span>  
           result_text += <span class="hljs-string">f&quot;Solution: <span class="hljs-subst">{hit.entity.get(<span class="hljs-string">&#x27;solution&#x27;</span>)}</span>\\n\\n&quot;</span>  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Tool Result] Found <span class="hljs-subst">{<span class="hljs-built_in">len</span>(results[<span class="hljs-number">0</span>])}</span> cases&quot;</span>)  
       <span class="hljs-keyword">return</span> result_text  
   <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:  
       error_msg = <span class="hljs-string">f&quot;Retrieval failed: <span class="hljs-subst">{<span class="hljs-built_in">str</span>(e)}</span>&quot;</span>  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Tool Error] <span class="hljs-subst">{error_msg}</span>&quot;</span>)  
       <span class="hljs-keyword">return</span> error_msg  
<button class="copy-code-btn"></button></code></pre>
<p>(3) التسجيل كأداة ADK</p>
<pre><code translate="no"><span class="hljs-comment"># Usage  </span>
<span class="hljs-comment"># Wrap functions with FunctionTool  </span>
store_memory_tool = FunctionTool(func=store_memory)  
recall_memory_tool = FunctionTool(func=recall_memory)  
memory_tools = [store_memory_tool, recall_memory_tool]  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-5-Agent-Definition" class="common-anchor-header">الخطوة 5 تعريف الوكيل</h3><p>الفكرة الأساسية: تحديد منطق سلوك الوكيل.</p>
<pre><code translate="no"><span class="hljs-comment"># ==================== Create Agent ====================  </span>
support_agent = Agent(  
   model=LLM_MODEL,  
   name=<span class="hljs-string">&quot;support_agent&quot;</span>,  
   description=<span class="hljs-string">&quot;Technical support expert agent that can remember and recall historical cases&quot;</span>,  
   <span class="hljs-comment"># Key: the instruction defines the agent’s behavior  </span>
   instruction=<span class="hljs-string">&quot;&quot;&quot;  
You are a technical support expert. Strictly follow the process below:  
&lt;b&gt;When the user asks a technical question:&lt;/b&gt;  
1. Immediately call the recall_memory tool to search for historical cases  
  - Parameter query: use the user’s question text directly  
  - Do not ask for any additional information; call the tool directly  
2. Answer based on the retrieval result:  
  - If relevant cases are found: explain that similar historical cases were found and answer by referencing their solutions  
  - If no cases are found: explain that this is a new issue and answer based on your own knowledge  
3. After answering, ask: “Did this solution resolve your issue?”  
&lt;b&gt;When the user confirms the issue is resolved:&lt;/b&gt;  
- Immediately call the store_memory tool to save this Q&amp;A  
- Parameter question: the user’s original question  
- Parameter solution: the complete solution you provided  
&lt;b&gt;Important rules:&lt;/b&gt;  
- You must call a tool before answering  
- Do not ask for user_id or any other parameters  
- Only store memory when you see confirmation phrases such as “resolved”, “it works”, or “thanks”  
&quot;&quot;&quot;</span>,  
   tools=memory_tools  
)  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-6-Main-Program-and-Execution-Flow" class="common-anchor-header">الخطوة 6 البرنامج الرئيسي وتدفق التنفيذ</h3><p>يوضح العملية الكاملة لاسترجاع الذاكرة عبر الجلسات.</p>
<pre><code translate="no"><span class="hljs-comment"># ==================== Main Program ====================  </span>
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">main</span>():  
   <span class="hljs-string">&quot;&quot;&quot;Demonstrate cross-session memory recall&quot;&quot;&quot;</span>  
   <span class="hljs-comment"># Create Session service and Runner  </span>
   session_service = InMemorySessionService()  
   runner = Runner(  
       agent=support_agent,  
       app_name=APP_NAME,  
       session_service=session_service  
   )  
   <span class="hljs-comment"># ========== First round: build memory ==========  </span>
   <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\\n&quot;</span> + <span class="hljs-string">&quot;=&quot;</span> \* <span class="hljs-number">60</span>)  
   <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;First conversation: user asks a question and the solution is stored&quot;</span>)  
   <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> \* <span class="hljs-number">60</span>)  
   session1 = <span class="hljs-keyword">await</span> session_service.create_session(  
       app_name=APP_NAME,  
       user_id=USER_ID,  
       session_id=<span class="hljs-string">&quot;session_001&quot;</span>  
   )  
   <span class="hljs-comment"># User asks the first question  </span>
   <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\\n[User]: What should I do if Milvus connection times out?&quot;</span>)  
   content1 = types.Content(  
       role=<span class="hljs-string">&#x27;user&#x27;</span>,  
       parts=[types.Part(text=<span class="hljs-string">&quot;What should I do if Milvus connection times out?&quot;</span>)]  
   )  
   <span class="hljs-keyword">async</span> <span class="hljs-keyword">for</span> event <span class="hljs-keyword">in</span> runner.run_async(  
       user_id=USER_ID,  
       session_id=[session1.<span class="hljs-built_in">id</span>](http://session1.<span class="hljs-built_in">id</span>),  
       new_message=content1  
   ):  
       <span class="hljs-keyword">if</span> event.content <span class="hljs-keyword">and</span> event.content.parts:  
           <span class="hljs-keyword">for</span> part <span class="hljs-keyword">in</span> event.content.parts:  
               <span class="hljs-keyword">if</span> <span class="hljs-built_in">hasattr</span>(part, <span class="hljs-string">&#x27;text&#x27;</span>) <span class="hljs-keyword">and</span> part.text:  
                   <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Agent]: <span class="hljs-subst">{part.text}</span>&quot;</span>)  
   <span class="hljs-comment"># User confirms the issue is resolved  </span>
   <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\\n[User]: The issue is resolved, thanks!&quot;</span>)  
   content2 = types.Content(  
       role=<span class="hljs-string">&#x27;user&#x27;</span>,  
       parts=[types.Part(text=<span class="hljs-string">&quot;The issue is resolved, thanks!&quot;</span>)]  
   )  
   <span class="hljs-keyword">async</span> <span class="hljs-keyword">for</span> event <span class="hljs-keyword">in</span> runner.run_async(  
       user_id=USER_ID,  
       session_id=[session1.<span class="hljs-built_in">id</span>](http://session1.<span class="hljs-built_in">id</span>),  
       new_message=content2  
   ):  
       <span class="hljs-keyword">if</span> event.content <span class="hljs-keyword">and</span> event.content.parts:  
           <span class="hljs-keyword">for</span> part <span class="hljs-keyword">in</span> event.content.parts:  
               <span class="hljs-keyword">if</span> <span class="hljs-built_in">hasattr</span>(part, <span class="hljs-string">&#x27;text&#x27;</span>) <span class="hljs-keyword">and</span> part.text:  
                   <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Agent]: <span class="hljs-subst">{part.text}</span>&quot;</span>)  
   <span class="hljs-comment"># ========== Second round: recall memory ==========  </span>
   <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\\n&quot;</span> + <span class="hljs-string">&quot;=&quot;</span> \* <span class="hljs-number">60</span>)  
   <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Second conversation: new session with memory recall&quot;</span>)  
   <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> \* <span class="hljs-number">60</span>)  
   session2 = <span class="hljs-keyword">await</span> session_service.create_session(  
       app_name=APP_NAME,  
       user_id=USER_ID,  
       session_id=<span class="hljs-string">&quot;session_002&quot;</span>  
   )  
   <span class="hljs-comment"># User asks a similar question in a new session  </span>
   <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\\n[User]: Milvus can&#x27;t connect&quot;</span>)  
   content3 = types.Content(  
       role=<span class="hljs-string">&#x27;user&#x27;</span>,  
       parts=[types.Part(text=<span class="hljs-string">&quot;Milvus can&#x27;t connect&quot;</span>)]  
   )  
   <span class="hljs-keyword">async</span> <span class="hljs-keyword">for</span> event <span class="hljs-keyword">in</span> runner.run_async(  
       user_id=USER_ID,  
       session_id=[session2.<span class="hljs-built_in">id</span>](http://session2.<span class="hljs-built_in">id</span>),  
       new_message=content3  
   ):  
       <span class="hljs-keyword">if</span> event.content <span class="hljs-keyword">and</span> event.content.parts:  
           <span class="hljs-keyword">for</span> part <span class="hljs-keyword">in</span> event.content.parts:  
               <span class="hljs-keyword">if</span> <span class="hljs-built_in">hasattr</span>(part, <span class="hljs-string">&#x27;text&#x27;</span>) <span class="hljs-keyword">and</span> part.text:  
                   <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Agent]: <span class="hljs-subst">{part.text}</span>&quot;</span>)

  
<span class="hljs-comment"># Program entry point  </span>
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:  
   Try:  
       asyncio.run(main())  
   <span class="hljs-keyword">except</span> KeyboardInterrupt:  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\\n\\nProgram exited&quot;</span>)  
   <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\\n\\nProgram error: <span class="hljs-subst">{e}</span>&quot;</span>)  
       <span class="hljs-keyword">import</span> traceback  
       traceback.print_exc()  
   Finally:  
       Try:  
           connections.disconnect(alias=<span class="hljs-string">&quot;default&quot;</span>)  
           <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\\n✓ Disconnected from Milvus&quot;</span>)  
       Except:  
           <span class="hljs-keyword">pass</span>  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-7-Run-and-Test" class="common-anchor-header">الخطوة 7 التشغيل والاختبار</h3><p><strong>(1) تعيين متغيرات البيئة</strong></p>
<pre><code translate="no"><span class="hljs-keyword">export</span> <span class="hljs-variable constant_">GOOGLE_API_KEY</span>=<span class="hljs-string">&quot;your-gemini-api-key&quot;</span>  
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">python milvus_agent.py  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Expected-Output" class="common-anchor-header">المخرجات المتوقعة</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/how_to_build_productionready_ai_agents_with_longterm_memory_using_google_adk_and_milvus_5_0c5a37fe32.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/how_to_build_productionready_ai_agents_with_longterm_memory_using_google_adk_and_milvus_3_cf3a60bd51.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>يوضح الناتج كيفية عمل نظام الذاكرة في الاستخدام الحقيقي.</p>
<p>في المحادثة الأولى، يسأل المستخدم عن كيفية التعامل مع مهلة اتصال ميلفوس. يقدم الوكيل حلاً. بعد أن يؤكد المستخدم حل المشكلة، يقوم الوكيل بحفظ هذا السؤال والإجابة في الذاكرة.</p>
<p>في المحادثة الثانية، تبدأ جلسة جديدة. يسأل المستخدم نفس السؤال باستخدام كلمات مختلفة: "ميلفوس لا يمكنه الاتصال". يسترجع الوكيل تلقائياً حالة مشابهة من الذاكرة ويعطي نفس الحل.</p>
<p>لا حاجة لخطوات يدوية. يقرّر الوكيل متى يسترجع الحالات السابقة ومتى يخزّن الحالات الجديدة، مما يُظهر ثلاث قدرات رئيسية: الذاكرة العابرة للجلسات، والمطابقة الدلالية، وعزل المستخدم.</p>
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
    </button></h2><p>تفصل ADK بين السياق قصير المدى والذاكرة طويلة المدى على مستوى إطار العمل باستخدام SessionService و MemoryService. يتعامل <a href="https://milvus.io/">Milvus</a> مع البحث الدلالي والتصفية على مستوى المستخدم من خلال الاسترجاع القائم على المتجهات.</p>
<p>عند اختيار إطار عمل، فإن الهدف مهم. إذا كنت بحاجة إلى عزل قوي للحالة، وقابلية التدقيق، واستقرار الإنتاج، فإن ADK هو الأنسب. أما إذا كنت تعمل على وضع نماذج أولية أو تجري تجارب، فإن LangChain (إطار عمل بايثون شائع لبناء التطبيقات والوكلاء المستند إلى LLM بسرعة) يوفر مرونة أكبر.</p>
<p>بالنسبة لذاكرة الوكيل، القطعة الأساسية هي قاعدة البيانات. تعتمد الذاكرة الدلالية على قواعد البيانات المتجهة، بغض النظر عن إطار العمل الذي تستخدمه. يعمل برنامج Milvus بشكل جيد لأنه مفتوح المصدر، ويعمل محليًا، ويدعم التعامل مع مليارات المتجهات على جهاز واحد، ويدعم البحث الهجين المتجه والقياسي والبحث في النص الكامل. تغطي هذه الميزات كلاً من الاختبار المبكر واستخدام الإنتاج.</p>
<p>نأمل أن تساعدك هذه المقالة على فهم تصميم ذاكرة الوكيل بشكل أفضل واختيار الأدوات المناسبة لمشاريعك.</p>
<p>إذا كنت تقوم ببناء وكلاء ذكاء اصطناعي يحتاجون إلى ذاكرة حقيقية - وليس فقط نوافذ سياق أكبر - نود أن نسمع كيف تتعامل مع الأمر.</p>
<p>هل لديك أسئلة حول ADK، أو تصميم ذاكرة الوكيل، أو استخدام Milvus كواجهة خلفية للذاكرة؟ انضم إلى <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">قناة Slack</a> الخاصة بنا أو احجز جلسة <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">ساعات عمل Milvus المكتبية</a> لمدة 20 دقيقة للتحدث عن حالة استخدامك.</p>
