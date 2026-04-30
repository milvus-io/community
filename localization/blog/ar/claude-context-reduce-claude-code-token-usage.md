---
id: claude-context-reduce-claude-code-token-usage.md
title: 'سياق كلود: الحد من استخدام رمز كلود الرمزي مع استرجاع الرمز المدعوم من ميلفوس'
author: Cheney Zhang
date: 2026-4-30
cover: assets.zilliz.com/image_3b2d2999ac.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Claude Context, Claude Code token usage, code retrieval, MCP server, Milvus'
meta_title: |
  Claude Context: Cut Claude Code Token Usage with Milvus
desc: >-
  هل يحرق كلود كود الرموز الرمزية على جريب؟ شاهد كيف يستخدم Claude Context
  الاسترجاع الهجين المدعوم من Milvus لخفض استخدام الرموز بنسبة 39.4%.
origin: 'https://milvus.io/blog/claude-context-reduce-claude-code-token-usage.md'
---
<p>تجعل نوافذ السياق الكبيرة وكلاء ترميز الذكاء الاصطناعي يشعرون بأنهم بلا حدود، إلى أن يبدأوا في قراءة نصف مستودعك للإجابة عن سؤال واحد. بالنسبة للعديد من مستخدمي Claude Code، فإن الجزء المكلف ليس مجرد التفكير في النموذج. إنها حلقة الاسترجاع: البحث عن كلمة مفتاحية، وقراءة ملف، والبحث مرة أخرى، وقراءة المزيد من الملفات، والاستمرار في الدفع مقابل سياق غير ذي صلة.</p>
<p>Claude Context هو خادم MCP مفتوح المصدر لاسترجاع التعليمات البرمجية MCP الذي يمنح Claude Code وغيره من وكلاء ترميز الذكاء الاصطناعي طريقة أفضل للعثور على التعليمات البرمجية ذات الصلة. فهو يفهرس المستودع الخاص بك، ويخزّن أجزاء التعليمات البرمجية القابلة للبحث في <a href="https://zilliz.com/learn/what-is-vector-database">قاعدة بيانات متجهة،</a> ويستخدم <a href="https://zilliz.com/blog/hybrid-search-with-milvus">الاسترجاع الهجين</a> حتى يتمكن الوكيل من سحب التعليمات البرمجية التي يحتاجها بالفعل بدلاً من إغراق المطالبة بنتائج البحث.</p>
<p>في معاييرنا، قلل Claude Context من استهلاك الرموز بنسبة 39.4% في المتوسط وخفض استدعاءات الأداة بنسبة 36.1% مع الحفاظ على جودة الاسترجاع. يشرح هذا المنشور سبب إهدار الاسترجاع بنمط grep للسياق، وكيفية عمل Claude Context تحت الغطاء، وكيفية مقارنته بسير العمل الأساسي في مهام التصحيح الحقيقية.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_6_68b1f70723.png" alt="Claude Context GitHub repository trending and passing 10,000 stars" class="doc-image" id="claude-context-github-repository-trending-and-passing-10,000-stars" />
   </span> <span class="img-wrapper"> <span>يتجه مستودع Claude Context GitHub ويتجاوز 10,000 نجمة</span> </span></p>
<h2 id="Why-grep-style-code-retrieval-burns-tokens-in-AI-coding-agents" class="common-anchor-header">لماذا يحرق استرجاع التعليمات البرمجية بأسلوب grep الرموز في وكلاء ترميز الذكاء الاصطناعي<button data-href="#Why-grep-style-code-retrieval-burns-tokens-in-AI-coding-agents" class="anchor-icon" translate="no">
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
    </button></h2><p>لا يمكن لوكيل ترميز الذكاء الاصطناعي أن يكتب كودًا مفيدًا إلا إذا كان يفهم قاعدة الكود حول المهمة: مسارات استدعاء الدالة، واصطلاحات التسمية، والاختبارات ذات الصلة، ونماذج البيانات، وأنماط التنفيذ التاريخية. تساعد نافذة السياق الكبيرة، لكنها لا تحل مشكلة الاسترجاع. إذا دخلت الملفات الخاطئة في السياق، فإن النموذج لا يزال يضيع الرموز وقد يستنتج من التعليمات البرمجية غير ذات الصلة.</p>
<p>ينقسم استرجاع الرموز عادةً إلى نمطين عريضين:</p>
<table>
<thead>
<tr><th>نمط الاسترجاع</th><th>كيف يعمل</th><th>حيث ينهار</th></tr>
</thead>
<tbody>
<tr><td>استرجاع بأسلوب Grep</td><td>البحث في السلاسل الحرفية، ثم قراءة الملفات أو نطاقات الأسطر المطابقة.</td><td>يفتقد الرموز ذات الصلة الدلالية، ويعيد مطابقات صاخبة، وغالبًا ما يتطلب دورات بحث/قراءة متكررة.</td></tr>
<tr><td>الاسترجاع بأسلوب RAG</td><td>فهرسة الشيفرة البرمجية مسبقًا، ثم استرجاع الأجزاء ذات الصلة باستخدام البحث الدلالي أو المعجمي أو المختلط.</td><td>يتطلب منطق التقطيع والتضمين والفهرسة والتحديث الذي لا تريد معظم أدوات الترميز امتلاكه مباشرةً.</td></tr>
</tbody>
</table>
<p>هذا هو نفس التمييز الذي يراه المطورون في تصميم <a href="https://zilliz.com/blog/metadata-filtering-hybrid-search-or-agent-in-rag-applications">تطبيق RAG</a>: المطابقة الحرفية مفيدة، لكنها نادرًا ما تكون كافية عندما يكون المعنى مهمًا. قد تكون الدالة المسماة <code translate="no">compute_final_cost()</code> ذات صلة باستعلام عن <code translate="no">calculate_total_price()</code> حتى لو لم تتطابق الكلمات بالضبط. هذا هو المكان الذي يساعد فيه <a href="https://zilliz.com/blog/semantic-search-vs-lexical-search-vs-full-text-search">البحث الدلالي</a>.</p>
<p>في إحدى عمليات تصحيح الأخطاء، قام كلود كود بالبحث وقراءة الملفات مرارًا وتكرارًا قبل تحديد المنطقة الصحيحة. بعد عدة دقائق، لم يكن هناك سوى جزء صغير من التعليمات البرمجية التي استهلكها ذات صلة.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_4_69b8455aeb.png" alt="Claude Code grep-style search spending time on irrelevant file reads" class="doc-image" id="claude-code-grep-style-search-spending-time-on-irrelevant-file-reads" />
   </span> <span class="img-wrapper"> <span>كلود كود كلود كود يستهلك وقتًا في قراءة الملفات غير ذات الصلة</span> </span></p>
<p>هذا النمط شائع بما فيه الكفاية لدرجة أن المطورين يشتكون منه علنًا: يمكن أن يكون الوكيل ذكيًا، لكن حلقة استرجاع السياق لا تزال مكلفة وغير دقيقة.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_8_b857ab4777.png" alt="Developer comment about Claude Code context and token usage" class="doc-image" id="developer-comment-about-claude-code-context-and-token-usage" />
   </span> <span class="img-wrapper"> <span>تعليق المطورين حول سياق كود كلود واستخدام الرمز المميز</span> </span></p>
<p>يفشل الاسترجاع بأسلوب Grep في ثلاث طرق يمكن التنبؤ بها:</p>
<ul>
<li><strong>الحمل الزائد للمعلومات:</strong> تنتج المستودعات الكبيرة العديد من التطابقات الحرفية، ومعظمها غير مفيد للمهمة الحالية.</li>
<li><strong>العمى الدلالي:</strong> يطابق grep السلاسل وليس النية أو السلوك أو أنماط التنفيذ المكافئة.</li>
<li><strong>فقدان السياق:</strong> لا تتضمن المطابقات على مستوى السطر تلقائيًا الفئة المحيطة أو التبعيات أو الاختبارات أو الرسم البياني للاستدعاء.</li>
</ul>
<p>تحتاج طبقة استرجاع الشيفرة الأفضل إلى الجمع بين دقة الكلمات المفتاحية والفهم الدلالي، ثم إرجاع أجزاء كاملة بما يكفي للنموذج للتفكير في الشيفرة.</p>
<h2 id="What-is-Claude-Context" class="common-anchor-header">ما هو سياق كلود؟<button data-href="#What-is-Claude-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>سياق كلود هو خادم <a href="https://zilliz.com/glossary/model-context-protocol-(mcp)">بروتوكول سياق نموذج</a> مفتوح المصدر لاسترجاع الشيفرة البرمجية. وهو يربط أدوات الترميز بالذكاء الاصطناعي بفهرس كود مدعوم من Milvus، بحيث يمكن للوكيل البحث في مستودع حسب المعنى بدلاً من الاعتماد فقط على البحث الحرفي في النص.</p>
<p>الهدف بسيط: عندما يسأل الوكيل عن السياق، يُرجِع أصغر مجموعة مفيدة من أجزاء التعليمات البرمجية. يقوم Claude Context بذلك عن طريق تحليل قاعدة الكودات، وتوليد التضمينات، وتخزين القطع في <a href="https://zilliz.com/what-is-milvus">قاعدة بيانات Milvus vector،</a> وعرض الاسترجاع من خلال أدوات متوافقة مع MCP.</p>
<table>
<thead>
<tr><th>مشكلة Grep</th><th>نهج سياق كلود</th></tr>
</thead>
<tbody>
<tr><td>الكثير من التطابقات غير ذات الصلة</td><td>ترتيب أجزاء الكود حسب تشابه المتجهات وأهمية الكلمات الرئيسية.</td></tr>
<tr><td>لا يوجد فهم دلالي</td><td>استخدم <a href="https://zilliz.com/blog/voyage-ai-embeddings-and-rerankers-for-search-and-rag">نموذج التضمين</a> بحيث يمكن مطابقة التطبيقات ذات الصلة حتى عند اختلاف الأسماء.</td></tr>
<tr><td>السياق المحيط المفقود</td><td>إرجاع أجزاء التعليمات البرمجية الكاملة مع بنية كافية للنموذج للاستدلال على السلوك.</td></tr>
<tr><td>تكرار قراءة الملفات</td><td>ابحث في الفهرس أولاً، ثم اقرأ أو حرر الملفات المهمة فقط.</td></tr>
</tbody>
</table>
<p>نظرًا لأن سياق كلود مكشوف من خلال MCP، فيمكنه العمل مع كلود كود، و Gemini CLI، ومضيفي MCP على غرار Cursor على غرار Cursor، والبيئات الأخرى المتوافقة مع MCP. يمكن لطبقة الاسترجاع الأساسية نفسها أن تدعم واجهات متعددة للوكلاء.</p>
<h2 id="How-Claude-Context-works-under-the-hood" class="common-anchor-header">كيف يعمل Claude Context تحت الغطاء<button data-href="#How-Claude-Context-works-under-the-hood" class="anchor-icon" translate="no">
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
    </button></h2><p>يحتوي سياق كلود على طبقتين رئيسيتين: وحدة أساسية قابلة لإعادة الاستخدام ووحدات تكامل. تتعامل النواة مع التحليل، والتقطيع، والفهرسة، والبحث، والمزامنة الإضافية. تعرض الطبقة العليا هذه القدرات من خلال تكامل MCP والمحرر.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_5_cf9f17013f.png" alt="Claude Context architecture showing MCP integrations, core module, embedding provider, and vector database" class="doc-image" id="claude-context-architecture-showing-mcp-integrations,-core-module,-embedding-provider,-and-vector-database" />
   </span> <span class="img-wrapper"> <span>بنية سياق كلود تُظهر تكاملات MCP والوحدة الأساسية وموفر التضمين وقاعدة بيانات المتجهات</span> </span></p>
<h3 id="How-does-MCP-connect-Claude-Context-to-coding-agents" class="common-anchor-header">كيف تقوم MCP بربط كلود السياق بعوامل الترميز؟</h3><p>يوفر MCP الواجهة بين مضيف LLM والأدوات الخارجية. من خلال تعريض Claude Context كخادم MCP، تبقى طبقة الاسترجاع مستقلة عن أي IDE أو مساعد ترميز واحد. يتصل الوكيل بأداة بحث؛ ويتولى Claude Context التعامل مع فهرس التعليمات البرمجية وإرجاع الأجزاء ذات الصلة.</p>
<p>إذا كنت ترغب في فهم النمط الأوسع، يوضح <a href="https://milvus.io/docs/milvus_and_mcp.md">دليل MCP + Milvus</a> كيف يمكن لـ MCP ربط أدوات الذكاء الاصطناعي بعمليات قاعدة البيانات المتجهة.</p>
<h3 id="Why-use-Milvus-for-code-retrieval" class="common-anchor-header">لماذا استخدام Milvus لاسترجاع التعليمات البرمجية؟</h3><p>يحتاج استرجاع التعليمات البرمجية إلى بحث سريع في المتجهات، وتصفية البيانات الوصفية ونطاق كافٍ للتعامل مع المستودعات الكبيرة. تم تصميم Milvus للبحث عن المتجهات عالية الأداء ويمكنه دعم المتجهات الكثيفة والمتجهات المتفرقة وعمليات إعادة ترتيب سير العمل. بالنسبة للفرق التي تقوم ببناء أنظمة وكلاء الاسترجاع الثقيلة، تُظهر مستندات <a href="https://milvus.io/docs/multi-vector-search.md">البحث الهجين متعدد النواقل</a> <a href="https://milvus.io/api-reference/pymilvus/v2.6.x/MilvusClient/Vector/hybrid_search.md">وواجهة برمجة التطبيقات PyMilvus hybrid_search API</a> نفس نمط الاسترجاع الأساسي المستخدم في أنظمة الإنتاج.</p>
<p>يمكن لـ Claude Context استخدام Zilliz Cloud كواجهة خلفية مُدارة لـ Milvus، مما يجنبك تشغيل قاعدة بيانات المتجهات وتوسيع نطاقها بنفسك. يمكن أيضًا تكييف نفس البنية مع عمليات نشر Milvus المُدارة ذاتيًا.</p>
<h3 id="Which-embedding-providers-does-Claude-Context-support" class="common-anchor-header">ما هي موفّرات التضمين التي يدعمها Claude Context؟</h3><p>يدعم Claude Context خيارات تضمين متعددة:</p>
<table>
<thead>
<tr><th>الموفر</th><th>الأنسب</th></tr>
</thead>
<tbody>
<tr><td>تضمينات OpenAI</td><td>تضمينات مستضافة للأغراض العامة مع دعم واسع النطاق للنظام البيئي.</td></tr>
<tr><td>تضمينات Voyage AI</td><td>الاسترجاع الموجه بالرموز، خاصةً عندما تكون جودة البحث مهمة.</td></tr>
<tr><td>أولاما</td><td>عمليات سير عمل التضمين المحلية للبيئات الحساسة للخصوصية.</td></tr>
</tbody>
</table>
<p>للحصول على مهام سير عمل ميلفوس ذات الصلة، راجع <a href="https://milvus.io/docs/embeddings.md">نظرة عامة على تضمين ميلفوس،</a> <a href="https://milvus.io/docs/embed-with-openai.md">وتكامل تضمين OpenAI،</a> <a href="https://milvus.io/docs/embed-with-voyage.md">وتكامل تضمين V</a>oyage، وأمثلة على تشغيل <a href="https://zilliz.com/blog/simplifying-legal-research-with-rag-milvus-ollama">أولاما مع ميلفوس</a>.</p>
<h3 id="Why-is-the-core-library-written-in-TypeScript" class="common-anchor-header">لماذا كُتبت المكتبة الأساسية بلغة TypeScript؟</h3><p>كُتِب سياق كلود السياق في TypeScript لأن العديد من تكاملات وكيل الترميز، والمحرّر الإضافي، ومضيفي MCP هي بالفعل ثقيلة على TypeScript. إن الاحتفاظ بنواة الاسترجاع في TypeScript يجعل من السهل التكامل مع أدوات طبقة التطبيقات مع الاستمرار في عرض واجهة برمجة تطبيقات نظيفة.</p>
<p>تستخلص الوحدة الأساسية قاعدة بيانات المتجهات وموفر التضمين في كائن <code translate="no">Context</code> قابل للتركيب:</p>
<pre><code translate="no" class="language-javascript"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">Context</span>, <span class="hljs-title class_">MilvusVectorDatabase</span>, <span class="hljs-title class_">OpenAIEmbedding</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@zilliz/claude-context-core&#x27;</span>;
<span class="hljs-comment">// Initialize embedding provider</span>
<span class="hljs-keyword">const</span> embedding = <span class="hljs-keyword">new</span> <span class="hljs-title class_">OpenAIEmbedding</span>(...);
<span class="hljs-comment">// Initialize vector database</span>
<span class="hljs-keyword">const</span> vectorDatabase = <span class="hljs-keyword">new</span> <span class="hljs-title class_">MilvusVectorDatabase</span>(...);
<span class="hljs-comment">// Create context instance</span>
<span class="hljs-keyword">const</span> context = <span class="hljs-keyword">new</span> <span class="hljs-title class_">Context</span>({embedding, vectorDatabase});
<span class="hljs-comment">// Index your codebase with progress tracking</span>
<span class="hljs-keyword">const</span> stats = <span class="hljs-keyword">await</span> context.<span class="hljs-title function_">indexCodebase</span>(<span class="hljs-string">&#x27;./your-project&#x27;</span>);
<span class="hljs-comment">// Perform semantic search</span>
<span class="hljs-keyword">const</span> results = <span class="hljs-keyword">await</span> context.<span class="hljs-title function_">semanticSearch</span>(<span class="hljs-string">&#x27;./your-project&#x27;</span>, <span class="hljs-string">&#x27;vector database operations&#x27;</span>);
<button class="copy-code-btn"></button></code></pre>
<h2 id="How-Claude-Context-chunks-code-and-keeps-indexes-fresh" class="common-anchor-header">كيف يقوم سياق كلود السياق بتجزئة الشيفرة والحفاظ على تحديث الفهارس<button data-href="#How-Claude-Context-chunks-code-and-keeps-indexes-fresh" class="anchor-icon" translate="no">
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
    </button></h2><p>يحدد التقطيع والتحديثات التدريجية ما إذا كان نظام استرجاع التعليمات البرمجية قابلاً للاستخدام عملياً. إذا كانت القطع صغيرة جدًا، يفقد النموذج السياق. إذا كانت القطع كبيرة جدًا، فإن نظام الاسترجاع يعيد الضوضاء. إذا كانت الفهرسة بطيئة للغاية، يتوقف المطورون عن استخدامها.</p>
<p>يعالج Claude Context هذا الأمر من خلال التقطيع المستند إلى AST، ومقسم النص الاحتياطي، واكتشاف التغييرات المستندة إلى شجرة Merkle.</p>
<h3 id="How-does-AST-based-code-chunking-preserve-context" class="common-anchor-header">كيف يحافظ التقطيع المستند إلى AST على السياق؟</h3><p>التقطيع المستند إلى AST هو الاستراتيجية الأساسية. فبدلاً من تقسيم الملفات حسب عدد الأسطر أو عدد الأحرف، يقوم Claude Context بتحليل بنية الشيفرة البرمجية وتجزئتها حول وحدات دلالية مثل الدوال والفئات والأساليب.</p>
<p>وهذا يعطي كل قطعة ثلاث خصائص مفيدة:</p>
<table>
<thead>
<tr><th>الخاصية</th><th>سبب أهميتها</th></tr>
</thead>
<tbody>
<tr><td>الاكتمال النحوي</td><td>لا يتم تقسيم الدوال والفئات في المنتصف.</td></tr>
<tr><td>التماسك المنطقي</td><td>يبقى المنطق المترابط معًا، بحيث يسهل على النموذج استخدام الأجزاء المسترجعة.</td></tr>
<tr><td>دعم متعدد اللغات</td><td>يمكن للمحللين الشجريين المختلفين التعامل مع JavaScript و Python و Java و Go ولغات أخرى.</td></tr>
</tbody>
</table>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_9_153144cc04.png" alt="AST-based code chunking preserving complete syntactic units and chunking results" class="doc-image" id="ast-based-code-chunking-preserving-complete-syntactic-units-and-chunking-results" />
   </span> <span class="img-wrapper"> <span>تقطيع الكود القائم على AST مع الحفاظ على الوحدات النحوية الكاملة ونتائج التقطيع</span> </span></p>
<h3 id="What-happens-when-AST-parsing-fails" class="common-anchor-header">ماذا يحدث عندما يفشل تحليل AST؟</h3><p>بالنسبة للغات أو الملفات التي لا يستطيع تحليل AST التعامل معها، يعود Claude Context إلى لغة سلسلة اللغات <code translate="no">RecursiveCharacterTextSplitter</code>. وهو أقل دقة من تقطيع AST، لكنه يمنع فشل الفهرسة على المدخلات غير المدعومة.</p>
<pre><code translate="no" class="language-php"><span class="hljs-comment">// Use recursive character splitting to preserve code structure</span>
<span class="hljs-keyword">const</span> splitter = <span class="hljs-title class_">RecursiveCharacterTextSplitter</span>.<span class="hljs-title function_">fromLanguage</span>(language, {
    <span class="hljs-attr">chunkSize</span>: <span class="hljs-number">1000</span>,
    <span class="hljs-attr">chunkOverlap</span>: <span class="hljs-number">200</span>,
});
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-does-Claude-Context-avoid-re-indexing-the-whole-repository" class="common-anchor-header">كيف يتجنب Claude Context إعادة فهرسة المستودع بأكمله؟</h3><p>إعادة فهرسة مستودع كامل بعد كل تغيير مكلف للغاية. يستخدم Claude Context شجرة Merkle لاكتشاف ما تم تغييره بالضبط.</p>
<p>تقوم شجرة Merkle بتعيين تجزئة لكل ملف، وتشتق تجزئة كل دليل من أبنائه، وتجمع المستودع بأكمله في تجزئة جذرية. إذا لم تتغير تجزئة الجذر، يمكن ل Claude Context تخطي الفهرسة. إذا تغير الجذر، فإنه يمشي أسفل الشجرة للعثور على الملفات التي تم تغييرها ويعيد تضمين تلك الملفات فقط.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_10_73daa3ca83.png" alt="Merkle tree change detection comparing unchanged and changed file hashes" class="doc-image" id="merkle-tree-change-detection-comparing-unchanged-and-changed-file-hashes" />
   </span> <span class="img-wrapper"> <span>اكتشاف التغيير في شجرة Merkle لمقارنة تجزئات الملفات التي لم تتغير والملفات التي تم تغييرها</span> </span></p>
<p>تعمل المزامنة على ثلاث مراحل:</p>
<table>
<thead>
<tr><th>المرحلة</th><th>ما يحدث</th><th>لماذا هو فعال</th></tr>
</thead>
<tbody>
<tr><td>التحقق السريع</td><td>قارن جذر Merkle الحالي مع آخر لقطة.</td><td>إذا لم يتغير شيء، ينتهي الفحص بسرعة.</td></tr>
<tr><td>فرق دقيق</td><td>المشي في الشجرة لتحديد الملفات المضافة والمحذوفة والمعدلة.</td><td>تتحرك المسارات المتغيرة فقط إلى الأمام.</td></tr>
<tr><td>تحديث تزايدي</td><td>إعادة حساب التضمينات للملفات التي تم تغييرها وتحديث Milvus.</td><td>يبقى الفهرس المتجه حديثًا دون إعادة بناء كاملة.</td></tr>
</tbody>
</table>
<p>يتم تخزين حالة المزامنة المحلية ضمن <code translate="no">~/.context/merkle/</code> ، بحيث يمكن لـ Claude Context استعادة جدول تجزئة الملفات وشجرة Merkle المتسلسلة بعد إعادة التشغيل.</p>
<h2 id="What-happens-when-Claude-Code-uses-Claude-Context" class="common-anchor-header">ماذا يحدث عندما يستخدم كلود كود سياق كلود؟<button data-href="#What-happens-when-Claude-Code-uses-Claude-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>الإعداد هو أمر واحد قبل تشغيل Claude Code:</p>
<pre><code translate="no" class="language-nginx">claude mcp add claude-context -e OPENAI_API_KEY=your-openai-api-key -e MILVUS_TOKEN=your-zilliz-cloud-api-key -- npx <span class="hljs-meta">@zilliz</span>/claude-context-mcp<span class="hljs-meta">@latest</span>
<button class="copy-code-btn"></button></code></pre>
<p>بعد فهرسة المستودع، يمكن لـ Claude Code استدعاء Claude Code عندما يحتاج إلى سياق قاعدة الشيفرة. في نفس سيناريو البحث عن الأخطاء الذي كان يستغرق وقتًا طويلاً في السابق في قراءة الجريب والملفات، وجد Claude Context الملف ورقم السطر بالضبط مع شرح كامل.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/article_12_9ad25bd75b.gif" alt="Claude Context demo showing Claude Code finding the relevant bug location" class="doc-image" id="claude-context-demo-showing-claude-code-finding-the-relevant-bug-location" />
   </span> <span class="img-wrapper"> <span>عرض توضيحي لـ Claude Context يُظهر كلود كود العثور على موقع الخطأ ذي الصلة</span> </span></p>
<p>لا تقتصر الأداة على البحث عن الأخطاء. فهي تساعد أيضًا في إعادة الهيكلة، واكتشاف التعليمات البرمجية المكررة، وحل المشكلات، وإنشاء الاختبارات، وأي مهمة يحتاج فيها الوكيل إلى سياق مستودع دقيق.</p>
<p>عند الاستدعاء المكافئ، قلل Claude Context من استهلاك الرمز المميز بنسبة 39.4٪ وقلل من استدعاءات الأداة بنسبة 36.1٪ في معيارنا. هذا مهم لأن استدعاءات الأدوات وقراءات الملفات غير ذات الصلة غالبًا ما تهيمن على تكلفة سير عمل وكيل الترميز.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_3_e20064021b.png" alt="Benchmark chart showing Claude Context reducing token usage and tool calls versus baseline" class="doc-image" id="benchmark-chart-showing-claude-context-reducing-token-usage-and-tool-calls-versus-baseline" />
   </span> <span class="img-wrapper"> <span>مخطط معياري يُظهر تقليل استخدام الرمز المميز واستدعاءات الأدوات مقارنةً بخط الأساس</span> </span></p>
<p>يحتوي المشروع الآن على أكثر من 10,000 نجمة على GitHub، ويتضمن المستودع تفاصيل المعيار الكامل وروابط الحزمة.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_7_210af604bd.png" alt="Claude Context GitHub star history showing rapid growth" class="doc-image" id="claude-context-github-star-history-showing-rapid-growth" />
   </span> <span class="img-wrapper"> <span>تاريخ نجوم كلود كونكتيكت على GitHub يُظهر النمو السريع</span> </span></p>
<h2 id="How-does-Claude-Context-compare-with-grep-on-real-bugs" class="common-anchor-header">كيف يقارن سياق كلود سياق مع grep على الأخطاء الحقيقية؟<button data-href="#How-does-Claude-Context-compare-with-grep-on-real-bugs" class="anchor-icon" translate="no">
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
    </button></h2><p>يقارن المعيار بين البحث النصي البحت واسترجاع التعليمات البرمجية المدعومة من ميلفوس في مهام تصحيح الأخطاء الحقيقية. الفرق ليس مجرد عدد أقل من الرموز. يغير Claude Context مسار بحث الوكيل: فهو يبدأ أقرب إلى التنفيذ الذي يحتاج إلى تغيير.</p>
<table>
<thead>
<tr><th>الحالة</th><th>سلوك خط الأساس</th><th>سلوك سياق كلود</th><th>تقليل الرموز</th></tr>
</thead>
<tbody>
<tr><td>خطأ في Django <code translate="no">YearLookup</code> </td><td>تم البحث عن الرمز الخاطئ ذي الصلة وتحرير منطق التسجيل.</td><td>وجدت منطق التحسين <code translate="no">YearLookup</code> مباشرةً.</td><td>93% رموز أقل</td></tr>
<tr><td>خطأ Xarray <code translate="no">swap_dims()</code> </td><td>قراءة الملفات المتناثرة حول إشارات <code translate="no">swap_dims</code>.</td><td>العثور على التنفيذ والاختبارات ذات الصلة بشكل مباشر أكثر.</td><td>62% رموز أقل</td></tr>
</tbody>
</table>
<h3 id="Case-1-Django-YearLookup-bug" class="common-anchor-header">الحالة 1: خطأ في Django YearLookup</h3><p><strong>وصف المشكلة:</strong> في إطار عمل Django، يؤدي تحسين الاستعلام <code translate="no">YearLookup</code> إلى تعطل تصفية <code translate="no">__iso_year</code>. عند استخدام عامل التصفية <code translate="no">__iso_year</code> ، تطبق الفئة <code translate="no">YearLookup</code> بشكل غير صحيح تحسين BETWEEN القياسي - صالح للسنوات التقويمية، ولكن ليس للسنوات التي يتم ترقيمها حسب ISO الأسبوعية.</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># This should use EXTRACT(&#x27;isoyear&#x27; FROM ...) but incorrectly uses BETWEEN</span>
DTModel.objects.<span class="hljs-built_in">filter</span>(start_date__iso_year=<span class="hljs-number">2020</span>)

<span class="hljs-comment"># Generated: WHERE &quot;start_date&quot; BETWEEN 2020-01-01 AND 2020-12-31</span>
<span class="hljs-comment"># Should be: WHERE EXTRACT(&#x27;isoyear&#x27; FROM &quot;start_date&quot;) = 2020</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>خط الأساس (grep):</strong></p>
<pre><code translate="no" class="language-swift">🔧 <span class="hljs-title function_">directory_tree</span>()
⚙️ <span class="hljs-title class_">Result</span>: <span class="hljs-title class_">Retrieved</span> <span class="hljs-number">3000</span>+ lines <span class="hljs-keyword">of</span> directory <span class="hljs-title function_">structure</span> (~50k tokens)
   <span class="hljs-title class_">Problem</span>: <span class="hljs-title class_">Massive</span> information overload, no direct relevance
🔧 <span class="hljs-title function_">search_text</span>(<span class="hljs-string">&#x27;ExtractIsoYear&#x27;</span>)
⚙️ <span class="hljs-title class_">Result</span>: <span class="hljs-title class_">Found</span> <span class="hljs-number">21</span> matches across multiple <span class="hljs-attr">files</span>:
   - django/db/models/functions/__init__.<span class="hljs-property">py</span>:<span class="hljs-number">5</span> (<span class="hljs-keyword">import</span> statement)
   - django/db/models/functions/__init__.<span class="hljs-property">py</span>:<span class="hljs-number">31</span> (<span class="hljs-keyword">export</span> list)  
   - django/db/models/functions/datetime.<span class="hljs-property">py</span>:<span class="hljs-number">93</span> (<span class="hljs-title class_">ExtractIsoYear</span> <span class="hljs-keyword">class</span>)
   <span class="hljs-title class_">Problem</span>: <span class="hljs-title class_">Most</span> are unrelated imports and registrations
🔧 <span class="hljs-title function_">edit_file</span>(<span class="hljs-string">&#x27;django/db/models/functions/datetime.py&#x27;</span>)
⚙️ <span class="hljs-title class_">Modified</span> multiple registration statements, but <span class="hljs-variable language_">this</span> is the wrong direction <span class="hljs-keyword">for</span> a fix
<button class="copy-code-btn"></button></code></pre>
<p>ركز البحث النصي على التسجيل <code translate="no">ExtractIsoYear</code> بدلاً من منطق التحسين في <code translate="no">YearLookup</code>.</p>
<p><strong>سياق كلود:</strong></p>
<pre><code translate="no" class="language-bash">🔧 search_code(<span class="hljs-string">&#x27;YearLookup&#x27;</span>)
⚙️ Found <span class="hljs-number">10</span> results <span class="hljs-keyword">for</span> query: <span class="hljs-string">&quot;YearLookup&quot;</span> across the codebase
   <span class="hljs-number">1.</span> Code <span class="hljs-title function_">snippet</span> <span class="hljs-params">(python)</span> [repo__django__django]
      Location: django/db/models/lookups.py:<span class="hljs-number">568</span>-<span class="hljs-number">577</span>
      Context: YearExact <span class="hljs-keyword">class</span> <span class="hljs-title class_">and</span> get_bound_params method
   <span class="hljs-number">2.</span> Code <span class="hljs-title function_">snippet</span> <span class="hljs-params">(python)</span> [repo__django__django]  
      Location: django/db/models/lookups.py:<span class="hljs-number">538</span>-<span class="hljs-number">569</span>
      Context: YearLookup base <span class="hljs-keyword">class</span> <span class="hljs-title class_">and</span> year_lookup_bounds method
🔧 edit_file(django/db/models/lookups.py)
⚙️ Successfully modified the core optimization logic, adding ISO year handling
<button class="copy-code-btn"></button></code></pre>
<p>فهم البحث الدلالي <code translate="no">YearLookup</code> كمفهوم أساسي وانتقل مباشرةً إلى الفئة الصحيحة.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_2_159ccffec9.png" alt="Django YearLookup benchmark table showing 93 percent fewer tokens with Claude Context" class="doc-image" id="django-yearlookup-benchmark-table-showing-93-percent-fewer-tokens-with-claude-context" />
   </span> <span class="img-wrapper"> <span>يُظهر جدول Django YearLookup القياسي جدول قياس Django YearLookup عدد أقل من الرموز بنسبة 93% باستخدام سياق كلود</span> </span></p>
<p><strong>النتيجة:</strong> 93% أقل من الرموز.</p>
<h3 id="Case-2-Xarray-swapdims-bug" class="common-anchor-header">الحالة 2: خطأ في Xarray swap_dims</h3><p><strong>وصف المشكلة:</strong> يقوم أسلوب <code translate="no">.swap_dims()</code> الخاص بمكتبة Xarray بتبديل الكائن الأصلي بشكل غير متوقع، منتهكًا بذلك توقع الثبات.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">import</span> xarray <span class="hljs-keyword">as</span> xr
nz = <span class="hljs-number">11</span>
ds = xr.Dataset({
    <span class="hljs-string">&quot;y&quot;</span>: (<span class="hljs-string">&quot;z&quot;</span>, np.random.rand(nz)),
    <span class="hljs-string">&quot;lev&quot;</span>: (<span class="hljs-string">&quot;z&quot;</span>, np.arange(nz) * <span class="hljs-number">10</span>),
})

<span class="hljs-comment"># This shouldn&#x27;t modify ds, but it does</span>
ds2 = ds.swap_dims(z=<span class="hljs-string">&quot;lev&quot;</span>).rename_dims(lev=<span class="hljs-string">&quot;z&quot;</span>).reset_index(<span class="hljs-string">&quot;lev&quot;</span>).reset_coords()
ds2.swap_dims(z=<span class="hljs-string">&#x27;lev&#x27;</span>)  <span class="hljs-comment"># this unexpectedly modifies ds2[&#x27;lev&#x27;]</span>
<span class="hljs-comment"># ds2[&#x27;lev&#x27;] now has dimension &#x27;lev&#x27; instead of &#x27;z&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>الخط الأساسي (grep):</strong></p>
<pre><code translate="no" class="language-bash">🔧 list_directory(<span class="hljs-string">&#x27;repo__pydata__xarray&#x27;</span>)
⚙️ Result: Retrieved directory structure across multiple subdirectories
   Problem: Basic directory navigation, no targeted search
🔧 search_text(<span class="hljs-string">&#x27;swap_dims&#x27;</span>)
⚙️ Result: Found 21 matches across core files:
   - xarray/core/common.py:600 (Dataset.swap_dims reference)
   - xarray/core/dataarray.py:753 (<span class="hljs-string">&quot;.rename() or .swap_dims() instead.&quot;</span>)
   - xarray/core/dataarray.py:2026 (DataArray.swap_dims reference)
   - xarray/core/dataarray.py:2044 (def swap_dims method)
   Problem: Many matches scattered across different contexts
🔧 read_file(<span class="hljs-string">&#x27;xarray/core/dataarray.py&#x27;</span>, offset=2000, <span class="hljs-built_in">limit</span>=40)
⚙️ Result: Read lines 2001-2040 showing rename method documentation

🔧 read_file(<span class="hljs-string">&#x27;xarray/core/dataset.py&#x27;</span>, offset=3600, <span class="hljs-built_in">limit</span>=40) 
⚙️ Result: Read lines 3601-3640 showing rename_dims method
<button class="copy-code-btn"></button></code></pre>
<p>أمضى الخط الأساسي وقتًا في التنقل في الدلائل وقراءة التعليمات البرمجية القريبة قبل تحديد مسار التنفيذ الفعلي.</p>
<p><strong>سياق كلود:</strong></p>
<pre><code translate="no" class="language-bash">🔧 search_code(<span class="hljs-string">&#x27;.swap_dims()&#x27;</span>)
⚙️ Found <span class="hljs-number">10</span> results <span class="hljs-keyword">for</span> query: <span class="hljs-string">&quot;.swap_dims()&quot;</span> across the codebase
   <span class="hljs-number">1.</span> <span class="hljs-function">Code <span class="hljs-title">snippet</span> (<span class="hljs-params">python</span>) [repo__pydata__xarray]
      Location: xarray/tests/test_formatting_html.py:67-76
   2. Code <span class="hljs-title">snippet</span> (<span class="hljs-params">python</span>) [repo__pydata__xarray]
      Location: xarray/tests/test_dataset.py:2926-2979
🔧 <span class="hljs-title">edit_file</span>(<span class="hljs-params"><span class="hljs-string">&#x27;xarray/core/dataset.py&#x27;</span></span>)
⚙️ Successfully modified the <span class="hljs-keyword">file</span>, added dimension handling logic
🔧 <span class="hljs-title">edit_file</span>(<span class="hljs-params"><span class="hljs-string">&#x27;xarray/core/dataarray.py&#x27;</span></span>)
⚙️ Successfully modified the <span class="hljs-keyword">file</span>, ensuring the original DataArray <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> mutated
</span><button class="copy-code-btn"></button></code></pre>
<p>حدد البحث الدلالي موقع التنفيذ <code translate="no">swap_dims()</code> ذي الصلة والسياق ذي الصلة بشكل أسرع.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_1_d75e931f20.png" alt="Xarray swap_dims benchmark table showing 62 percent fewer tokens with Claude Context" class="doc-image" id="xarray-swap_dims-benchmark-table-showing-62-percent-fewer-tokens-with-claude-context" />
   </span> <span class="img-wrapper"> <span>جدول Xarray swap_dims القياسي يُظهر عددًا أقل من الرموز بنسبة 62% باستخدام Claude Context</span> </span></p>
<p><strong>النتيجة:</strong> 62% رموز أقل بنسبة 62%.</p>
<h2 id="Get-started-with-Claude-Context" class="common-anchor-header">ابدأ باستخدام Claude Context<button data-href="#Get-started-with-Claude-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>إذا كنت ترغب في تجربة الأداة الدقيقة من هذا المنشور، فابدأ بمستودع <a href="https://github.com/zilliztech/claude-context">Claude Context GitHub</a> <a href="https://www.npmjs.com/package/%40zilliz/claude-context-mcp">وحزمة Claude Context MCP</a>. يتضمن المستودع إرشادات الإعداد، والمعايير، وحزم TypeScript الأساسية.</p>
<p>إذا كنت تريد فهم طبقة الاسترجاع أو تخصيصها، فهذه الموارد هي خطوات تالية مفيدة:</p>
<ul>
<li>تعلّم أساسيات قاعدة بيانات المتجهات من خلال ملف <a href="https://milvus.io/docs/quickstart.md">Milvus Quickstart</a>.</li>
<li>استكشف <a href="https://milvus.io/docs/full-text-search.md">البحث عن النص الكامل</a> في <a href="https://milvus.io/docs/full-text-search.md">ميلفوس</a> والبحث عن <a href="https://milvus.io/docs/full_text_search_with_milvus.md">النص الكامل في برنامج البحث عن النص الكامل في لغة السلسلة</a> إذا كنت ترغب في الجمع بين البحث بأسلوب BM25 مع المتجهات الكثيفة.</li>
<li>راجع <a href="https://zilliz.com/blog/top-5-open-source-vector-search-engines">محركات البحث المتجهة مفتوحة المصدر</a> إذا كنت تقارن خيارات البنية التحتية.</li>
<li>جرّب <a href="https://zilliz.com/blog/zilliz-cloud-just-landed-in-claude-code">مُلحق Zilliz Cloud Plugin لـ Claude Code</a> إذا كنت تريد عمليات قاعدة بيانات المتجهات مباشرةً داخل سير عمل Claude Code.</li>
</ul>
<p>للحصول على المساعدة في Milvus أو بنية استرجاع الكود، انضم إلى <a href="https://milvus.io/community/">مجتمع Milvus</a> أو احجز <a href="https://milvus.io/office-hours">ساعات عمل Milvus المكتبية</a> للحصول على إرشادات فردية. إذا كنت تفضل تخطي إعداد البنية التحتية، قم بالتسجيل <a href="https://cloud.zilliz.com/signup">في Zilliz Cloud</a> أو قم بتسجيل <a href="https://cloud.zilliz.com/login">الدخول إلى Zilliz Cloud</a> واستخدم Milvus المُدار كواجهة خلفية.</p>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">الأسئلة المتداولة<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Why-does-Claude-Code-use-so-many-tokens-on-some-coding-tasks" class="common-anchor-header">لماذا يستخدم كلود كود العديد من الرموز في بعض مهام الترميز؟</h3><p>يمكن لـ Claude Code استخدام العديد من الرموز عندما تتطلب المهمة حلقات بحث وقراءة ملفات متكررة عبر مستودع كبير. إذا قام الوكيل بالبحث عن طريق الكلمات المفتاحية، وقراءة ملفات غير ذات صلة، ثم البحث مرة أخرى، فإن كل ملف تتم قراءته يضيف رموزًا حتى عندما لا يكون الرمز مفيدًا للمهمة.</p>
<h3 id="How-does-Claude-Context-reduce-Claude-Code-token-usage" class="common-anchor-header">كيف يقلل سياق كلود من استخدام الرموز الرمزية في كلود كود؟</h3><p>يقلل سياق كلود من استخدام الرموز الرمزية من خلال البحث في فهرس التعليمات البرمجية المدعوم من ميلفوس قبل أن يقرأ الوكيل الملفات. فهو يسترجع أجزاء التعليمات البرمجية ذات الصلة من خلال البحث المختلط، لذا يمكن لـ Claude Code فحص عدد أقل من الملفات وإنفاق المزيد من نافذة السياق على التعليمات البرمجية المهمة بالفعل.</p>
<h3 id="Is-Claude-Context-only-for-Claude-Code" class="common-anchor-header">هل سياق Claude Context مخصص لـ Claude Code فقط؟</h3><p>لا، فـ Claude Context مكشوف كخادم MCP، لذا يمكنه العمل مع أي أداة ترميز تدعم MCP. كلود كود هو المثال الرئيسي في هذا المنشور، ولكن يمكن لطبقة الاسترجاع نفسها أن تدعم أدوات برمجة أخرى متوافقة مع MCP IDE وسير عمل الوكيل.</p>
<h3 id="Do-I-need-Zilliz-Cloud-to-use-Claude-Context" class="common-anchor-header">هل أحتاج إلى Zilliz Cloud لاستخدام Claude Context؟</h3><p>يمكن لـ Claude Context استخدام Zilliz Cloud كواجهة خلفية مُدارة من Milvus، وهو أسهل مسار إذا كنت لا تريد تشغيل البنية التحتية لقاعدة بيانات المتجهات. تعتمد بنية الاسترجاع نفسها على مفاهيم Milvus، لذا يمكن للفرق أيضًا تكييفها مع عمليات نشر Milvus المُدارة ذاتيًا.</p>
