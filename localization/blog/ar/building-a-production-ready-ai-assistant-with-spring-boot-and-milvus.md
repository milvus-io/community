---
id: building-a-production-ready-ai-assistant-with-spring-boot-and-milvus.md
title: >-
  من المستندات إلى الحوار: بناء مساعد ذكاء اصطناعي جاهز للإنتاج باستخدام Spring
  Boot و Milvus
author: Gong Yi
date: 2025-06-23T00:00:00.000Z
cover: >-
  assets.zilliz.com/From_Docs_to_Dialogue_Building_an_AI_Assistant_with_Spring_and_Milvus_b8a470549a.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus, vector database, vector search, AI search, Spring Boot'
meta_title: |
  Building a Production-Ready AI Assistant with Spring Boot and Milvus
desc: >-
  من خلال الجمع بين Spring Boot وMilvus وOllama، نقوم بتحويل مستندات المؤسسة
  الثابتة إلى محادثات ديناميكية مدركة للسياق - مع إمكانية المراقبة الكاملة
  والذاكرة والأمان المدمجة.
origin: >-
  https://milvus.io/blog/building-a-production-ready-ai-assistant-with-spring-boot-and-milvus.md
---
<p>تعاني كل شركة من المشكلة نفسها: معرفة قيّمة عالقة في ملفات PDF ومستندات Word ومشاركات الملفات التي لا يستطيع أحد العثور عليها عندما يحتاج إليها. تجيب فرق الدعم على نفس الأسئلة بشكل متكرر، بينما يضيع المطورون ساعات في البحث في الوثائق القديمة.</p>
<p><strong>ماذا لو كان بإمكان مستنداتك الإجابة عن الأسئلة مباشرةً؟</strong></p>
<p>يوضح لك هذا البرنامج التعليمي كيفية إنشاء مساعد ذكاء اصطناعي جاهز للإنتاج يقوم بـ</p>
<ul>
<li><p>يحول مستنداتك الثابتة إلى نظام ذكي للأسئلة والأجوبة</p></li>
<li><p>يحافظ على سياق المحادثة والذاكرة</p></li>
<li><p>يتوسع للتعامل مع أعباء عمل المؤسسة</p></li>
<li><p>يتضمن الأمان والمراقبة وإمكانية الملاحظة خارج الصندوق</p></li>
</ul>
<h2 id="What-Well-Build" class="common-anchor-header">ما سنقوم ببنائه<button data-href="#What-Well-Build" class="anchor-icon" translate="no">
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
    </button></h2><p>بحلول نهاية هذا البرنامج التعليمي، سيكون لديك:</p>
<ul>
<li><p>خط أنابيب لاستيعاب المستندات يعالج ملفات PDF ومستندات Word</p></li>
<li><p>نظام بحث متجه مدعوم من ميلفوس للبحث الدلالي</p></li>
<li><p>واجهة برمجة تطبيقات للدردشة مع الوعي بالذاكرة والسياق</p></li>
<li><p>أمان ومراقبة على مستوى المؤسسات</p></li>
<li><p>مثال عملي كامل يمكنك نشره</p></li>
</ul>
<h2 id="Key-Components-We’ll-Use" class="common-anchor-header">المكونات الرئيسية التي سنستخدمها<button data-href="#Key-Components-We’ll-Use" class="anchor-icon" translate="no">
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
<li><p><a href="https://github.com/spring-projects/spring-boot"><strong>Spring Boot</strong></a> هو إطار عمل جافا مستخدم على نطاق واسع لبناء تطبيقات الواجهة الخلفية بأقل قدر من التكوين. وهو يوفر إنتاجية قوية للمطورين، وتكاملًا سلسًا مع الأدوات الحديثة، ودعمًا مدمجًا لواجهات برمجة تطبيقات REST، وإمكانية المراقبة، والأمان.</p></li>
<li><p><a href="https://milvus.io/"><strong>Milvus</strong></a> عبارة عن قاعدة بيانات متجهة مفتوحة المصدر وعالية الأداء وعالية الأداء ومصممة للبحث الدلالي. تسمح لك بتخزين التضمينات والبحث فيها بزمن انتقال بمقياس أجزاء من الثانية، حتى عبر مليارات المتجهات.</p></li>
<li><p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation"><strong>RAG</strong></a> عبارة عن بنية تجمع بين الاسترجاع والتوليد: فهي تجلب مقتطفات معرفية ذات صلة من قاعدة بيانات متجهة مثل Milvus، ثم تستخدم نموذجاً لغوياً لصياغة استجابة سياقية طليقة.</p></li>
<li><p><a href="https://ollama.com/"><strong>Ollama</strong></a>: مزود نموذج ذكاء اصطناعي محلي (متوافق مع OpenAI، مجاني تمامًا)</p></li>
</ul>
<h2 id="Prerequisites" class="common-anchor-header">المتطلبات الأساسية<button data-href="#Prerequisites" class="anchor-icon" translate="no">
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
    </button></h2><p>قبل البدء، تأكد من أن لديك</p>
<ul>
<li><p>جافا 17+ مثبتة</p></li>
<li><p>Docker، Docker Compose</p></li>
<li><p>Git لاستنساخ مستودع المثال</p></li>
<li><p>تثبيت Ollama وتشغيله محليًا</p></li>
<li><p>ميلفوس (عبر Docker)</p></li>
<li><p>Spring Boot 3.5.0 + Spring AI 1.0.0</p></li>
<li><p>ميكرومتر، حاويات الاختبار</p></li>
</ul>
<h2 id="Environment-Setup" class="common-anchor-header">إعداد البيئة<button data-href="#Environment-Setup" class="anchor-icon" translate="no">
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
    </button></h2><p>استنساخ مستودع المثال/: <a href="https://github.com/topikachu/spring-ai-rag">https://github.com/topikachu/spring-ai-rag</a></p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/topikachu/spring-ai-rag
<span class="hljs-built_in">cd</span> spring-ai-rag
<button class="copy-code-btn"></button></code></pre>
<p>تحقق من بيئتك</p>
<pre><code translate="no"><span class="hljs-comment"># Verify Docker is running correctly</span>
docker version
docker ps

<span class="hljs-comment"># Verify Java version</span>
java -version

<span class="hljs-comment"># Verify Ollama installation</span>
ollama --version
<button class="copy-code-btn"></button></code></pre>
<p>تنزيل نماذج أولاما:</p>
<pre><code translate="no"><span class="hljs-comment"># Pull required models for this project</span>
ollama pull mistral          <span class="hljs-comment"># Chat model</span>
ollama pull nomic-embed-text <span class="hljs-comment"># Embedding model</span>

<span class="hljs-comment"># Verify models are available</span>
ollama <span class="hljs-built_in">list</span>
<button class="copy-code-btn"></button></code></pre>
<p>التكوين الرئيسي (application.properties)</p>
<pre><code translate="no"><span class="hljs-comment"># Ollama Configuration (OpenAI-compatible API)</span>
spring.ai.openai.base-url=http://localhost:<span class="hljs-number">11434</span>
spring.ai.openai.chat.options.model=mistral
spring.ai.openai.embedding.options.model=nomic-embed-text
spring.ai.openai.embedding.options.dimensions=<span class="hljs-number">768</span>

<span class="hljs-comment"># Vector Store Configuration - dimensions must match embedding model</span>
spring.ai.vectorstore.milvus.embedding-dimension=<span class="hljs-number">768</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Document-ETL-Structuring-Unstructured-Text" class="common-anchor-header">مستند ETL: هيكلة النص غير المنظم<button data-href="#Document-ETL-Structuring-Unstructured-Text" class="anchor-icon" translate="no">
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
    </button></h2><p>يتطرق هذا القسم إلى قلب النظام - تحويل الملفات غير المهيكلة إلى استجابات ذكية قابلة للبحث باستخدام التضمينات المتجهة وفهرسة Milvus وخط أنابيب RAG الخاص بـ Spring AI.</p>
<p><strong>نظرة عامة على سير العمل:</strong></p>
<ul>
<li><p>استخدام <code translate="no">TikaDocReader</code> لقراءة ملفات PDF وملفات Word</p></li>
<li><p>استخدام التقسيم القائم على الرموز لتجزئة المستندات مع الحفاظ على السياق</p></li>
<li><p>توليد التضمينات باستخدام نموذج التضمين المتوافق مع OpenAI</p></li>
<li><p>قم بتخزين التضمينات في Milvus للبحث الدلالي لاحقًا</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/workflow_7e9f990b18.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>نموذج التنفيذ</p>
<pre><code translate="no">public <span class="hljs-title class_">Flux</span>&lt;<span class="hljs-title class_">Document</span>&gt; <span class="hljs-title function_">ingestionFlux</span>(<span class="hljs-params"></span>) {
  <span class="hljs-keyword">return</span> documentReader.<span class="hljs-title function_">getDocuments</span>()
          .<span class="hljs-title function_">flatMap</span>(<span class="hljs-variable language_">document</span> -&gt; {
            <span class="hljs-keyword">var</span> processChunks = <span class="hljs-title class_">Mono</span>.<span class="hljs-title function_">fromRunnable</span>(() -&gt; {
              <span class="hljs-keyword">var</span> chunks = textSplitter.<span class="hljs-title function_">apply</span>(<span class="hljs-title class_">List</span>.<span class="hljs-title function_">of</span>(<span class="hljs-variable language_">document</span>));
              vectorStore.<span class="hljs-title function_">write</span>(chunks); <span class="hljs-comment">// expensive operation</span>
            }).<span class="hljs-title function_">subscribeOn</span>(<span class="hljs-title class_">Schedulers</span>.<span class="hljs-title function_">boundedElastic</span>());

            <span class="hljs-keyword">return</span> <span class="hljs-title class_">Flux</span>.<span class="hljs-title function_">concat</span>(
                    <span class="hljs-title class_">Flux</span>.<span class="hljs-title function_">just</span>(<span class="hljs-variable language_">document</span>),
                    processChunks.<span class="hljs-title function_">then</span>(<span class="hljs-title class_">Mono</span>.<span class="hljs-title function_">empty</span>())
            );
          })
          .<span class="hljs-title function_">doOnComplete</span>(() -&gt; log.<span class="hljs-title function_">info</span>(<span class="hljs-string">&quot;RunIngestion() finished&quot;</span>))
          .<span class="hljs-title function_">doOnError</span>(e -&gt; log.<span class="hljs-title function_">error</span>(<span class="hljs-string">&quot;Error during ingestion&quot;</span>, e));
}
<button class="copy-code-btn"></button></code></pre>
<h2 id="Vector-Storage-Millisecond-Scale-Semantic-Search-with-Milvus" class="common-anchor-header">تخزين المتجهات: بحث دلالي بمقياس الميلي ثانية باستخدام Milvus<button data-href="#Vector-Storage-Millisecond-Scale-Semantic-Search-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>مثال على التكوين:</p>
<pre><code translate="no">spring.<span class="hljs-property">ai</span>.<span class="hljs-property">vectorstore</span>.<span class="hljs-property">milvus</span>.<span class="hljs-property">initialize</span>-schema=<span class="hljs-literal">true</span>
spring.<span class="hljs-property">ai</span>.<span class="hljs-property">vectorstore</span>.<span class="hljs-property">milvus</span>.<span class="hljs-property">embedding</span>-dimension=<span class="hljs-number">768</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>📌مثال:</strong> عندما يسأل أحد المستخدمين &quot;هل يدعم Spring Boot البرمجة التفاعلية مع WebFlux؟&quot;، يقوم Milvus بإرجاع مقاطع التوثيق ذات الصلة، ويقوم نموذج الذكاء الاصطناعي بإنشاء إجابة بلغة طبيعية مع تفاصيل تنفيذ محددة.</p>
<h2 id="Building-a-RAG-Enabled-Chat-Contextual-QA-with-Memory-Integration" class="common-anchor-header">بناء محادثة ممكّنة لـ RAG: الأسئلة والأجوبة السياقية مع تكامل الذاكرة<button data-href="#Building-a-RAG-Enabled-Chat-Contextual-QA-with-Memory-Integration" class="anchor-icon" translate="no">
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
    </button></h2><p>سير العمل الأساسي:</p>
<ol>
<li><p>يرسل المستخدم سؤالاً</p></li>
<li><p>يسترجع البحث المتجه أجزاء المستند الأكثر صلة بالموضوع</p></li>
<li><p>يقوم النظام بتحميل سياق المحادثة السابقة (عبر ريديس)</p></li>
<li><p>يقوم نموذج الذكاء الاصطناعي بإنشاء استجابة تتضمن كلاً من السياق الجديد والتاريخي</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/build_a_rag_chat_workflow_976dcd9aa2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>مثال على استرجاع + تكامل محادثة الذاكرة:</p>
<pre><code translate="no">public <span class="hljs-title class_">ChatClient</span>.<span class="hljs-property">ChatClientRequestSpec</span> <span class="hljs-title function_">input</span>(<span class="hljs-params"><span class="hljs-built_in">String</span> userInput, <span class="hljs-built_in">String</span> conversationId</span>) {
  <span class="hljs-keyword">return</span> chatClient.<span class="hljs-title function_">prompt</span>()
          .<span class="hljs-title function_">advisors</span>(
                  messageChatMemoryAdvisor,
                  retrievalAugmentationAdvisor
          )
          .<span class="hljs-title function_">advisors</span>(spec -&gt; spec.<span class="hljs-title function_">param</span>(<span class="hljs-variable constant_">CONVERSATION_ID</span>, conversationId))
          .<span class="hljs-title function_">user</span>(userInput);
}
<button class="copy-code-btn"></button></code></pre>
<p>للحصول على تجربة أكثر سلاسة للواجهة الأمامية، استخدم واجهة برمجة تطبيقات الدفق التفاعلي لإرجاع محتوى <code translate="no">Flux</code> عبر الأحداث المرسلة من الخادم (SSE) - مثالي لتأثيرات "الكتابة":</p>
<pre><code translate="no">public <span class="hljs-title class_">Flux</span>&lt;<span class="hljs-title class_">String</span>&gt; <span class="hljs-title function_">stream</span>(<span class="hljs-params"><span class="hljs-built_in">String</span> userInput, <span class="hljs-built_in">String</span> conversationId</span>) {
    <span class="hljs-keyword">return</span> <span class="hljs-title function_">input</span>(userInput, conversationId)
            .<span class="hljs-title function_">stream</span>().<span class="hljs-title function_">content</span>();
}
<button class="copy-code-btn"></button></code></pre>
<p>وحدة تحكم REST API:</p>
<pre><code translate="no">@<span class="hljs-title class_">PostMapping</span>(path = <span class="hljs-string">&quot;/chat&quot;</span>, produces = <span class="hljs-title class_">MediaType</span>.<span class="hljs-property">TEXT_EVENT_STREAM_VALUE</span>)
public <span class="hljs-title class_">Flux</span>&lt;<span class="hljs-title class_">String</span>&gt; <span class="hljs-title function_">chat</span>(<span class="hljs-params">@RequestBody ChatRequest chatRequest, @RequestParam() <span class="hljs-built_in">String</span> conversationId, Principal principal</span>) {
  <span class="hljs-keyword">var</span> conversationKey = <span class="hljs-title class_">String</span>.<span class="hljs-title function_">format</span>(<span class="hljs-string">&quot;%s:%s&quot;</span>, principal.<span class="hljs-title function_">getName</span>(), conversationId);
  <span class="hljs-keyword">return</span> chatService.<span class="hljs-title function_">stream</span>(chatRequest.<span class="hljs-property">userInput</span>, conversationKey)
          .<span class="hljs-title function_">doOnError</span>(exp -&gt; log.<span class="hljs-title function_">error</span>(<span class="hljs-string">&quot;Error in chat&quot;</span>, exp));
}
<button class="copy-code-btn"></button></code></pre>
<h2 id="Enterprise-Grade-API-Security-and-System-Observability" class="common-anchor-header">أمان واجهة برمجة التطبيقات على مستوى المؤسسات وإمكانية مراقبة النظام<button data-href="#Enterprise-Grade-API-Security-and-System-Observability" class="anchor-icon" translate="no">
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
    </button></h2><p>يضمن هذا القسم أن مساعد الذكاء الاصطناعي الخاص بك لا يعمل فقط - بل يعمل بشكل آمن، ويمكن تتبعه، ويعمل في ظل أعباء العمل في العالم الحقيقي.</p>
<h3 id="API-Security-Role-Based-Access-Control" class="common-anchor-header">أمان واجهة برمجة التطبيقات: التحكم في الوصول المستند إلى الدور</h3><p><strong>مثال: تأمين نقاط نهاية المسؤول</strong></p>
<pre><code translate="no"><span class="hljs-meta">@Override</span>
<span class="hljs-keyword">protected</span> <span class="hljs-keyword">void</span> <span class="hljs-title function_">configure</span><span class="hljs-params">(HttpSecurity http)</span> <span class="hljs-keyword">throws</span> Exception {
    http
        .httpBasic()
        .and()
        .authorizeRequests(authz -&gt; authz
            .antMatchers(<span class="hljs-string">&quot;/api/v1/index&quot;</span>).hasRole(<span class="hljs-string">&quot;ADMIN&quot;</span>)
            .anyRequest().authenticated()
        );
}
<button class="copy-code-btn"></button></code></pre>
<p>💡 <strong>نصيحة الإنتاج:</strong> بالنسبة لعمليات النشر في العالم الحقيقي، استخدم OAuth2 أو JWT للمصادقة القابلة للتطوير.</p>
<h3 id="Observability-Full-Stack-Tracing-and-Metrics" class="common-anchor-header">إمكانية المراقبة: تتبع المكدس الكامل والمقاييس</h3><p><strong>التتبع:</strong> سنستخدم OpenTelemetry JavaAgent لتتبع تدفقات الطلبات الكاملة من دردشة المستخدم إلى بحث Milvus واستجابة LLM - بما في ذلك امتدادات gRPC:</p>
<pre><code translate="no">-javaagent:&lt;path/to/opentelemetry-javaagent.jar&gt; \
-Dotel.metrics.exporter=none \
-Dotel.logs.exporter=none
<button class="copy-code-btn"></button></code></pre>
<p><strong>المقاييس:</strong> يعرض ميكروميتر تلقائيًا مقاييس متوافقة مع بروميثيوس:</p>
<ul>
<li>وقت استجابة النموذج</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># HELP gen_ai_client_operation_seconds  </span>
<span class="hljs-comment"># TYPE gen_ai_client_operation_seconds summary</span>
gen_ai_client_operation_seconds_count{...} <span class="hljs-number">1</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>وقت استرجاع المتجهات</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># HELP db_vector_client_operation_seconds</span>
<span class="hljs-comment"># TYPE db_vector_client_operation_seconds summary</span>
db_vector_client_operation_seconds_count{...} <span class="hljs-number">1</span>
<button class="copy-code-btn"></button></code></pre>
<p>التهيئة</p>
<pre><code translate="no">management.endpoints.web.exposure.include=prometheus
<button class="copy-code-btn"></button></code></pre>
<p>💡 <strong>ملاحظة فنية:</strong> يقدم Spring Boot 3.2 مشغلات OTEL، لكنها لا تغطي gRPC (التي يستخدمها Milvus). لضمان الرؤية من طرف إلى طرف، يستخدم هذا المشروع نهج JavaAgent.</p>
<h2 id="Running-the-Project-End-to-End-Execution" class="common-anchor-header">تشغيل المشروع: التنفيذ من النهاية إلى النهاية<button data-href="#Running-the-Project-End-to-End-Execution" class="anchor-icon" translate="no">
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
    </button></h2><p>بدء تشغيل النظام الكامل</p>
<pre><code translate="no"><span class="hljs-built_in">export</span> OPENAI_API_KEY=dummy
<span class="hljs-built_in">export</span> SPRING_PROFILES_ACTIVE=ollama-openai
ollama pull mistral            <span class="hljs-comment"># Pull chat model</span>
ollama pull nomic-embed-text   <span class="hljs-comment"># Pull embedding model</span>

mvn clean <span class="hljs-built_in">test</span> package
docker compose up -d
java -javaagent:target/otel/opentelemetry-javaagent.jar -Dotel.metrics.exporter=none -Dotel.logs.exporter=none  -Dinput.directory=<span class="hljs-variable">$PWD</span>/src/test/resources/corpus  -jar target/rag-0.0.1-SNAPSHOT.jar

curl --location <span class="hljs-string">&#x27;localhost:8080/api/v1/index&#x27;</span> \
--user <span class="hljs-string">&quot;admin:password&quot;</span> \
--header <span class="hljs-string">&#x27;Content-Type: application/json&#x27;</span> \
--data <span class="hljs-string">&#x27;{}&#x27;</span>

curl --location <span class="hljs-string">&#x27;localhost:8080/api/v1/chat?conversationId=flat&#x27;</span> \
--header <span class="hljs-string">&#x27;Content-Type: application/json&#x27;</span> \
--user <span class="hljs-string">&quot;user:password&quot;</span> \
--data <span class="hljs-string">&#x27;{
    &quot;userInput&quot;: &quot;Does milvus support FLAT type index?&quot;
}&#x27;</span>

curl --location <span class="hljs-string">&#x27;localhost:8080/api/v1/chat?conversationId=flat&#x27;</span> \
--header <span class="hljs-string">&#x27;Content-Type: application/json&#x27;</span> \
--user <span class="hljs-string">&quot;user:password&quot;</span> \
--data <span class="hljs-string">&#x27;{
    &quot;userInput&quot;: &quot;When shall I use this index type?&quot;
}&#x27;</span>

curl --location <span class="hljs-string">&#x27;localhost:8080/api/v1/chat?conversationId=hnsw&#x27;</span> \
--header <span class="hljs-string">&#x27;Content-Type: application/json&#x27;</span> \
--user <span class="hljs-string">&quot;user:password&quot;</span> \
--data <span class="hljs-string">&#x27;{
    &quot;userInput&quot;: &quot;Does milvus support HNSW type index?&quot;
}&#x27;</span>

curl --location <span class="hljs-string">&#x27;localhost:8080/api/v1/chat?conversationId=hnsw&#x27;</span> \
--header <span class="hljs-string">&#x27;Content-Type: application/json&#x27;</span> \
--user <span class="hljs-string">&quot;user:password&quot;</span> \
--data <span class="hljs-string">&#x27;{
    &quot;userInput&quot;: &quot;When shall I use this index type?&quot;
}&#x27;</span>

curl <span class="hljs-string">&quot;http://localhost:8080/actuator/prometheus&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>لعرض واجهة مستخدم التتبع، افتح<a href="http://localhost:16686/"> http://localhost:16686/</a></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/To_view_tracing_UI_686e8f54b9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Conclusion" class="common-anchor-header">خاتمة<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>لديك الآن مساعد ذكاء اصطناعي جاهز للإنتاج يحول المستندات الثابتة إلى محادثات ذكية. يتضمن النظام:</p>
<p>✅ <strong>معالجة المستندات</strong>: الاستيعاب الآلي والتوجيه ✅ <strong>البحث الدلالي</strong>: استرجاع سريع ودقيق باستخدام ميلفوس ✅ <strong>ذاكرة المحادثة</strong>: تجارب دردشة مدركة للسياق ✅ <strong>أمن المؤسسات</strong>: المصادقة والتحكم في الوصول</p>
<p>✅ <strong>إمكانية المراقبة الكاملة</strong>: المراقبة والتتبع والمقاييس</p>
<p>من خلال الدمج بين Spring Boot وMilvus وOllama، نحول مستندات المؤسسة الثابتة إلى محادثات ديناميكية مدركة للسياق - مع إمكانية المراقبة الكاملة والذاكرة والأمان المدمجة.</p>
<p>سواء كنت تقوم ببناء روبوتات مساعدين داخليين أو مساعدين خاصين بمجال معين أو روبوتات دعم موجهة للعملاء، فإن هذه البنية مصممة لتوسيع نطاق عبء العمل الخاص بك وإبقائك متحكمًا في بياناتك.</p>
<p>هل تشعر بالفضول بشأن ما يمكن أن تقدمه Milvus لحزمة الذكاء الاصطناعي الخاصة بك؟ استكشف<a href="https://milvus.io"> مشروع Milvus المفتوح المصدر،</a> وجرّب<a href="https://zilliz.com"> Milvus المُدار (Zilliz Cloud</a>) للحصول على تجربة خالية من المتاعب، أو انضم إلى <a href="https://discord.com/invite/8uyFbECzPX">قناة Discord</a> الخاصة بنا للحصول على المزيد من الأدلة العملية مثل هذه.</p>
