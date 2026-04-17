---
id: >-
  why-im-against-claude-codes-grep-only-retrieval-it-just-burns-too-many-tokens.md
title: لماذا أنا ضد استرجاع كلود كود كلود فقط؟ إنه يحرق الكثير من الرموز
author: Cheney Zhang
date: 2025-08-25T00:00:00.000Z
desc: >-
  تعرف على كيفية استرجاع الرموز البرمجية المستندة إلى المتجهات التي تقلل من
  استهلاك رمز Claude Code بنسبة 40%. حل مفتوح المصدر مع سهولة تكامل MCP. جرّب
  كلود-كونيكت اليوم.
cover: >-
  assets.zilliz.com/why_im_against_claude_codes_grep_only_retrieval_it_just_burns_too_many_tokens_milvus_cover_2928b4b72d.png
tag: Engineering
recommend: false
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Claude Code, vector search, AI IDE, code retrieval, token optimization'
meta_title: >
  Why I’m Against Claude Code’s Grep-Only Retrieval? It Just Burns Too Many
  Tokens
origin: >
  https://milvus.io/blog/why-im-against-claude-codes-grep-only-retrieval-it-just-burns-too-many-tokens.md
---
<p>مساعدو الترميز بالذكاء الاصطناعي آخذون في الانتشار. في العامين الماضيين فقط، تحولت أدوات مثل Cursor وClaude Code وGemini CLI وQwen Code من أدوات مثيرة للفضول إلى رفقاء يوميين لملايين المطورين. ولكن وراء هذا الصعود السريع يكمن صراع محتدم حول شيء بسيط بشكل مخادع: <strong>كيف ينبغي لمساعد البرمجة بالذكاء الاصطناعي أن يبحث في الواقع في قاعدة التعليمات البرمجية الخاصة بك عن السياق؟</strong></p>
<p>في الوقت الحالي، هناك طريقتان:</p>
<ul>
<li><p><strong>البحث الناقل المدعوم بالبحث الناقل RAG</strong> (الاسترجاع الدلالي).</p></li>
<li><p><strong>البحث بالكلمات الرئيسية باستخدام grep</strong> (مطابقة السلاسل الحرفية).</p></li>
</ul>
<p>وقد اختار كلود كود وجيميني الطريقة الأخيرة. في الواقع، اعترف أحد مهندسي كلود صراحةً على Hacker News أن Claude Code لا يستخدم RAG على الإطلاق. بدلاً من ذلك، يقوم فقط بالبحث في الريبو الخاص بك سطراً بسطر (ما يسمونه "البحث العميل") - لا دلالات ولا هيكلية، فقط مطابقة سلسلة خام.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_2b03e89759.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>هذا الوحي قسم المجتمع:</p>
<ul>
<li><p>يدافع<strong>المؤيدون</strong> عن بساطة grep. فهو سريع، ودقيق، والأهم من ذلك أنه يمكن التنبؤ به. في البرمجة، كما يجادلون، الدقة هي كل شيء، ولا تزال التضمينات الحالية غامضة للغاية بحيث لا يمكن الوثوق بها.</p></li>
<li><p>يرى<strong>النقاد</strong> أن جريب طريق مسدود. فهو يغرقك في تطابقات غير ذات صلة، ويحرق الرموز، ويعطل سير عملك. بدون فهم دلالات الألفاظ، فإن الأمر يشبه أن تطلب من ذكائك الاصطناعي أن يصحح أخطاءك وأنت معصوب العينين.</p></li>
</ul>
<p>كلا الجانبين لديه وجهة نظر. وبعد بناء واختبار الحل الخاص بي، يمكنني قول ما يلي: نهج RAG القائم على البحث المتجه يغير اللعبة. <strong>فهو لا يجعل البحث أسرع وأكثر دقة بشكل كبير فحسب، بل يقلل أيضًا من استخدام الرمز المميز بنسبة 40% أو أكثر. (انتقل إلى الجزء الخاص بسياق كلود للاطلاع على منهجي)</strong></p>
<p>إذًا لماذا يعتبر البحث المتجه مقيدًا جدًا؟ وكيف يمكن للبحث المتجه أن يحقق نتائج أفضل في الواقع العملي؟ دعنا نحلل الأمر.</p>
<h2 id="What’s-Wrong-with-Claude-Code’s-Grep-Only-Code-Search" class="common-anchor-header">ما هو الخطأ في بحث كلود كود كلود عن الشيفرة الرمادية فقط؟<button data-href="#What’s-Wrong-with-Claude-Code’s-Grep-Only-Code-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>واجهت هذه المشكلة أثناء تصحيح مشكلة شائكة. أطلق كلود كود استعلامات البحث عن الكودات عبر الريبو الخاص بي، وألقى إليّ كرات عملاقة من النصوص غير ذات الصلة. بعد دقيقة واحدة، لم أعثر على الملف ذي الصلة. بعد خمس دقائق، حصلت أخيرًا على الأسطر العشرة الصحيحة - لكنها كانت مدفونة في 500 سطر من الضوضاء.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_299eeeaea5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>هذه ليست حالة حافة. يُظهر تصفح مشكلات Claude Code في GitHub الكثير من المطورين المحبطين الذين يواجهون نفس المشكلة:</p>
<ul>
<li><p>المشكلة 1:<a href="https://github.com/anthropics/claude-code/issues/1315"> https://github.com/anthropics/claude-code/issues/1315</a></p></li>
<li><p>المشكلة2:<a href="https://github.com/anthropics/claude-code/issues/4556"> https://github.com/anthropics/claude-code/issues/4556</a></p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_938c7244da.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>يتلخّص إحباط المجتمع في ثلاث نقاط ألم:</p>
<ol>
<li><p><strong>تضخم الرموز.</strong> كل تفريغ لـ grep يجرف كميات هائلة من التعليمات البرمجية غير ذات الصلة إلى LLM، مما يؤدي إلى زيادة التكاليف التي تتزايد بشكل مروع مع حجم الريبو.</p></li>
<li><p><strong>ضريبة الوقت.</strong> أنت عالق في الانتظار بينما يلعب الذكاء الاصطناعي عشرين سؤالاً مع قاعدة التعليمات البرمجية الخاصة بك، مما يقتل التركيز والتدفق.</p></li>
<li><p><strong>سياق صفري.</strong> يطابق Grep السلاسل الحرفية. ليس لديه أي إحساس بالمعنى أو العلاقات، لذا فأنت تبحث بشكل أعمى.</p></li>
</ol>
<p>هذا هو سبب أهمية المناقشة: grep ليس مجرد "مدرسة قديمة"، بل إنه يعيق البرمجة بمساعدة الذكاء الاصطناعي.</p>
<h2 id="Claude-Code-vs-Cursor-Why-the-Latter-Has-Better-Code-Context" class="common-anchor-header">كود كلود مقابل المؤشر: لماذا يمتلك الأخير سياق كود أفضل<button data-href="#Claude-Code-vs-Cursor-Why-the-Latter-Has-Better-Code-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>عندما يتعلق الأمر بسياق التعليمات البرمجية، فقد قام Cursor بعمل أفضل. فمنذ اليوم الأول، اتجه كورسور إلى <strong>فهرسة قاعدة التعليمات البر</strong>مجية: قسّم الريبو الخاص بك إلى أجزاء ذات معنى، وقم بتضمين هذه الأجزاء في متجهات، واسترجعها دلاليًا كلما احتاج الذكاء الاصطناعي إلى سياق. هذا هو كتاب التوليد المعزز للاسترجاع (RAG) المطبق على الكود البرمجي، والنتائج تتحدث عن نفسها: سياق أكثر إحكامًا، وإهدار أقل للرموز، واسترجاع أسرع.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_a9f5beb01d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>على النقيض من ذلك، ضاعف كلود كود من البساطة. لا فهارس، ولا تضمينات، بل مجرد بحث في الجريب. هذا يعني أن كل بحث هو عبارة عن مطابقة حرفية للسلسلة، دون فهم البنية أو الدلالات. إنه سريع من الناحية النظرية، ولكن في الممارسة العملية، غالبًا ما ينتهي الأمر بالمطورين إلى غربلة أكوام من المطابقات غير ذات الصلة قبل العثور على الإبرة التي يحتاجونها بالفعل.</p>
<table>
<thead>
<tr><th></th><th><strong>كود كلود</strong></th><th><strong>المؤشر</strong></th></tr>
</thead>
<tbody>
<tr><td>دقة البحث</td><td>لا يُظهر سوى التطابقات التامة - لا يُغفل أي شيء يحمل اسمًا مختلفًا.</td><td>يعثر على التعليمات البرمجية ذات الصلة من الناحية الدلالية حتى عندما لا تتطابق الكلمات الرئيسية تمامًا.</td></tr>
<tr><td>الكفاءة</td><td>يقوم Grep بتفريغ كتل ضخمة من التعليمات البرمجية في النموذج، مما يؤدي إلى زيادة تكاليف الرمز المميز.</td><td>الأجزاء الأصغر حجماً والأعلى إشارة تقلل من حمل الرموز بنسبة 30-40%.</td></tr>
<tr><td>قابلية التوسع</td><td>يُعاد استرجاع الريبو في كل مرة، مما يؤدي إلى إبطاء نمو المشاريع.</td><td>يفهرس مرة واحدة، ثم يسترجع على نطاق واسع بأقل قدر من التأخير.</td></tr>
<tr><td>الفلسفة</td><td>البقاء في الحد الأدنى - لا بنية تحتية إضافية.</td><td>فهرسة كل شيء واسترجاعه بذكاء.</td></tr>
</tbody>
</table>
<p>فلماذا لم يحذُ كلود (أو جيميني أو كلاين) حذو كورسور؟ الأسباب تقنية جزئيًا وثقافية جزئيًا. <strong>استرجاع المتجهات ليس بالأمر الهيّن - فأنت بحاجة إلى حل مشكلة التقطيع والتحديثات التدريجية والفهرسة على نطاق واسع.</strong> ولكن الأهم من ذلك أن كلود كود مبني على البساطة: لا خوادم، لا فهارس، فقط واجهة برمجة تطبيقات نظيفة. لا تتناسب التضمينات وقواعد البيانات المتجهة مع فلسفة التصميم هذه.</p>
<p>هذه البساطة جذابة - لكنها أيضًا تحد من سقف ما يمكن أن يقدمه كلود كود. إن رغبة Cursor في الاستثمار في البنية التحتية الحقيقية للفهرسة هي السبب في أنها تبدو أكثر قوة اليوم.</p>
<h2 id="Claude-Context-an-Open-Source-Project-for-Adding-Semantic-Code-Search-to-Claude-Code" class="common-anchor-header">سياق كلود: مشروع مفتوح المصدر لإضافة البحث الدلالي عن الكود إلى كلود كود<button data-href="#Claude-Context-an-Open-Source-Project-for-Adding-Semantic-Code-Search-to-Claude-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>كلود كود أداة قوية - لكن سياق الكود ضعيف. قام Cursor بحل هذه المشكلة من خلال فهرسة قاعدة الكودات، لكن Cursor مغلق المصدر، ومغلق على الاشتراكات، وباهظ الثمن بالنسبة للأفراد أو الفرق الصغيرة.</p>
<p>هذه الفجوة هي السبب في أننا بدأنا في بناء حلنا الخاص مفتوح المصدر: <a href="https://github.com/zilliztech/claude-context"><strong>سياق كلود</strong></a>.</p>
<p>Claude<a href="https://github.com/zilliztech/claude-context"><strong>Context</strong></a> هو مكون إضافي مفتوح المصدر لبرنامج MCP يجلب <strong>البحث الدلالي عن الكود</strong> إلى Claude Code (وأي عامل ترميز آخر للذكاء الاصطناعي يتحدث MCP). فبدلاً من البحث الغاشم عن الريبو الخاص بك باستخدام grep، فإنه يدمج قواعد البيانات المتجهة مع نماذج التضمين لإعطاء LLMs <em>سياقًا عميقًا ومستهدفًا</em> من قاعدة التعليمات البرمجية بأكملها. والنتيجة: استرجاع أكثر دقة وإهدار أقل للرموز وتجربة أفضل بكثير للمطورين.</p>
<p>إليك كيف بنيناها:</p>
<h3 id="Technologies-We-Use" class="common-anchor-header">التقنيات التي نستخدمها</h3><p><strong>🔌 طبقة الواجهة: MCP كموصل عالمي</strong></p>
<p>أردنا أن يعمل هذا في كل مكان - وليس فقط كلود. يعمل بروتوكول سياق النموذج MCP (بروتوكول سياق النموذج) مثل معيار USB لـ LLMs، مما يسمح للأدوات الخارجية بالتوصيل بسلاسة. من خلال تغليف Claude Context كخادم MCP، فإنه لا يعمل فقط مع Claude Code ولكن أيضًا مع Gemini CLI و Qwen Code و Cline وحتى Cursor.</p>
<p><strong>🗄️ قاعدة بيانات المتجهات: زيليز كلاود</strong></p>
<p>بالنسبة للعمود الفقري، اخترنا <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (خدمة مُدارة بالكامل مبنية على <a href="https://milvus.io/">Milvus</a>). إنها عالية الأداء، وسحابة أصلية، ومرنة، ومصممة لأعباء عمل الذكاء الاصطناعي مثل فهرسة قاعدة البيانات البرمجية. وهذا يعني استرجاعًا منخفض التأخير، ومقياسًا شبه مطلق، وموثوقية صلبة للغاية.</p>
<p><strong>🧩 تضمين النماذج: مرن حسب التصميمالفرق المختلفة</strong>لها احتياجات مختلفة، لذا يدعم Claude Context العديد من موفري التضمين خارج الصندوق:</p>
<ul>
<li><p><strong>تضمينات OpenAI</strong> للاستقرار والاعتماد الواسع.</p></li>
<li><p><strong>تضمينات Voyage</strong> للأداء المخصص للرموز.</p></li>
<li><p><strong>Ollama</strong> لعمليات التضمين المحلية التي تراعي الخصوصية أولاً.</p></li>
</ul>
<p>يمكن إدراج نماذج إضافية مع تطور المتطلبات.</p>
<p><strong>💻 اختيار اللغة: TypeScript</strong></p>
<p>ناقشنا بايثون مقابل TypeScript. فازت TypeScript - ليس فقط من أجل التوافق على مستوى التطبيق (مكونات VSCode الإضافية وأدوات الويب) ولكن أيضًا لأن Claude Code و Gemini CLI نفسها تعتمد على TypeScript. وهذا يجعل التكامل سلسًا ويحافظ على تماسك النظام البيئي.</p>
<h3 id="System-Architecture" class="common-anchor-header">بنية النظام</h3><p>يتبع Claude Context تصميمًا نظيفًا متعدد الطبقات:</p>
<ul>
<li><p>تتعامل<strong>الوحدات الأساسية</strong> مع الرفع الثقيل: تحليل التعليمات البرمجية، والتقطيع، والفهرسة، والاسترجاع، والمزامنة.</p></li>
<li><p>تتعامل<strong>واجهة المستخدم</strong> مع عمليات التكامل - خوادم برنامج التحكم في المحتوى، أو ملحقات VSCode، أو محولات أخرى.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/5_0c70864d6f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>يحافظ هذا الفصل على قابلية إعادة استخدام المحرك الأساسي عبر بيئات مختلفة مع السماح للتكاملات بالتطور بسرعة مع ظهور مساعدي ترميز ذكاء اصطناعي جدد.</p>
<h3 id="Core-Module-Implementation" class="common-anchor-header">تنفيذ الوحدة الأساسية</h3><p>تشكل الوحدات الأساسية أساس النظام بأكمله. فهي تجرد قواعد البيانات المتجهة ونماذج التضمين والمكونات الأخرى إلى وحدات قابلة للتركيب تنشئ كائن سياق مما يتيح قواعد بيانات متجهة مختلفة ونماذج تضمين لسيناريوهات مختلفة.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">Context</span>, <span class="hljs-title class_">MilvusVectorDatabase</span>, <span class="hljs-title class_">OpenAIEmbedding</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@zilliz/claude-context-core&#x27;</span>;
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
<h2 id="Solving-Key-Technical-Challenges" class="common-anchor-header">حل التحديات التقنية الرئيسية<button data-href="#Solving-Key-Technical-Challenges" class="anchor-icon" translate="no">
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
    </button></h2><p>لم يكن بناء Claude Context يتعلق فقط بتوصيل التضمينات وقاعدة بيانات المتجهات. فالعمل الحقيقي جاء في حل المشاكل الصعبة التي تؤدي إلى فهرسة الرموز على نطاق واسع. إليك كيف تعاملنا مع أكبر ثلاثة تحديات:</p>
<h3 id="Challenge-1-Intelligent-Code-Chunking" class="common-anchor-header">التحدي 1: التجزئة الذكية للأكواد البرمجية</h3><p>لا يمكن تقسيم التعليمات البرمجية حسب الأسطر أو الأحرف. فذلك يخلق أجزاءً فوضوية وغير مكتملة ويزيل المنطق الذي يجعل الكود مفهوماً.</p>
<p>حللنا هذه المشكلة <strong>باستراتيجيتين متكاملتين</strong>:</p>
<h4 id="AST-Based-Chunking-Primary-Strategy" class="common-anchor-header">التجزئة المستندة إلى AST (الاستراتيجية الأساسية)</h4><p>هذا هو النهج الافتراضي، باستخدام المحللين الشجريين لفهم بنية تركيب الشيفرة البرمجية وتقسيمها على طول الحدود الدلالية: الدوال، والفئات، والطرق. هذا يوفر:</p>
<ul>
<li><p><strong>اكتمال بناء الجملة</strong> - لا توجد دوال مقطّعة أو تعريفات مقطوعة.</p></li>
<li><p><strong>التماسك المنطقي</strong> - يبقى المنطق المترابط معًا من أجل استرجاع دلالي أفضل.</p></li>
<li><p><strong>دعم متعدد اللغات</strong> - يعمل عبر JS وPython وJava وGo والمزيد عبر قواعد نحوية شجرية.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/6_e976593d7e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h4 id="LangChain-Text-Splitting-Fallback-Strategy" class="common-anchor-header">تجزئة النص اللغوي (استراتيجية احتياطية)</h4><p>بالنسبة للغات التي لا تستطيع AST تحليلها أو عندما يفشل التحليل، يوفر <code translate="no">RecursiveCharacterTextSplitter</code> الخاص بـ LangChain نسخة احتياطية موثوقة.</p>
<pre><code translate="no"><span class="hljs-comment">// Use recursive character splitting to maintain code structure</span>
<span class="hljs-keyword">const</span> splitter = <span class="hljs-title class_">RecursiveCharacterTextSplitter</span>.<span class="hljs-title function_">fromLanguage</span>(language, { 
  <span class="hljs-attr">chunkSize</span>: <span class="hljs-number">1000</span>, 
  <span class="hljs-attr">chunkOverlap</span>: <span class="hljs-number">200</span>,
});
<button class="copy-code-btn"></button></code></pre>
<p>إنها أقل "ذكاءً" من AST، لكنها موثوقة للغاية - مما يضمن عدم ترك المطورين عالقين أبدًا. وتوازن هاتان الاستراتيجيتان معًا بين الثراء الدلالي وقابلية التطبيق العالمي.</p>
<h3 id="Challenge-2-Handling-Code-Changes-Efficiently" class="common-anchor-header">التحدي 2: التعامل مع تغييرات التعليمات البرمجية بكفاءة</h3><p>تمثل إدارة تغييرات التعليمات البرمجية أحد أكبر التحديات في أنظمة فهرسة التعليمات البرمجية. فإعادة فهرسة مشاريع بأكملها لإجراء تعديلات طفيفة على الملفات سيكون غير عملي تماماً.</p>
<p>لحل هذه المشكلة، قمنا ببناء آلية المزامنة القائمة على Merkle Tree.</p>
<h4 id="Merkle-Trees-The-Foundation-of-Change-Detection" class="common-anchor-header">Merkle Trees: أساس اكتشاف التغيير</h4><p>تُنشئ Merkle Trees نظام "بصمة" هرمي حيث يكون لكل ملف بصمة تجزئة خاصة به، ويكون للمجلدات بصمات أصابع بناءً على محتوياتها، وكل شيء ينتهي ببصمة جذر فريدة لقاعدة الكود بأكملها.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/7_79adb21c84.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>عندما يتغير محتوى الملف، تتسلسل بصمات التجزئة لأعلى عبر كل طبقة إلى العقدة الجذرية. يتيح ذلك إمكانية الكشف السريع عن التغييرات من خلال مقارنة بصمات الأصابع التجزئة طبقة تلو الأخرى من الجذر إلى الأسفل، مما يتيح تحديد التعديلات التي طرأت على الملفات وتحديد موقعها بسرعة دون إعادة فهرسة المشروع بالكامل.</p>
<p>يقوم النظام بإجراء فحوصات مزامنة المصافحة كل 5 دقائق باستخدام عملية مبسطة من ثلاث مراحل:</p>
<p><strong>المرحلة 1:</strong> يحسب<strong>الكشف بسرعة البرق</strong> تجزئة جذر Merkle لقاعدة الكود بأكملها ويقارنها مع اللقطة السابقة. تعني تجزئات الجذر المتطابقة عدم حدوث أي تغييرات - يتخطى النظام جميع عمليات المعالجة في أجزاء من الثانية.</p>
<p><strong>المرحلة 2:</strong> يتم تشغيل<strong>المقارنة الدقيقة</strong> عند اختلاف تجزئات الجذر، وإجراء تحليل مفصّل على مستوى الملف لتحديد الملفات التي تمت إضافتها أو حذفها أو تعديلها بالضبط.</p>
<p><strong>المرحلة 3: تقوم التحديثات التزايدية</strong> بإعادة حساب المتجهات فقط للملفات التي تم تغييرها وتحديث قاعدة بيانات المتجهات وفقًا لذلك، مما يزيد من الكفاءة إلى أقصى حد.</p>
<h4 id="Local-Snapshot-Management" class="common-anchor-header">إدارة اللقطات المحلية</h4><p>تستمر جميع حالات المزامنة محلياً في دليل المستخدم <code translate="no">~/.context/merkle/</code>. تحتفظ كل قاعدة رمز بملف لقطة مستقل خاص بها يحتوي على جداول تجزئة الملفات وبيانات شجرة Merkle المتسلسلة، مما يضمن استعادة الحالة بدقة حتى بعد إعادة تشغيل البرنامج.</p>
<p>يوفر هذا التصميم مزايا واضحة: تكتمل معظم عمليات التحقق في أجزاء من الثانية في حالة عدم وجود أي تغييرات، ولا تؤدي سوى الملفات المعدلة بالفعل إلى إعادة المعالجة (لتجنب الهدر الحسابي الهائل)، وتعمل استعادة الحالة بشكل لا تشوبه شائبة عبر جلسات البرنامج.</p>
<p>من من منظور تجربة المستخدم، يؤدي تعديل دالة واحدة إلى إعادة الفهرسة لهذا الملف فقط، وليس المشروع بأكمله، مما يحسن كفاءة التطوير بشكل كبير.</p>
<h3 id="Challenge-3-Designing-the-MCP-Interface" class="common-anchor-header">التحدي 3: تصميم واجهة MCP</h3><p>حتى أذكى محرك فهرسة لا فائدة منه بدون واجهة نظيفة تواجه المطورين. كان MCP هو الخيار الواضح، لكنه قدم تحديات فريدة من نوعها:</p>
<h4 id="🔹-Tool-Design-Keep-It-Simple" class="common-anchor-header"><strong>🔹 تصميم الأداة: إبقائها بسيطة</strong></h4><p>تعمل وحدة MCP كواجهة تواجه المستخدم، مما يجعل تجربة المستخدم على رأس الأولويات.</p>
<p>يبدأ تصميم الأداة بتجريد عمليات الفهرسة والبحث القياسية لقاعدة التعليمات البرمجية في أداتين أساسيتين: <code translate="no">index_codebase</code> لفهرسة قواعد التعليمات البرمجية و <code translate="no">search_code</code> للبحث في التعليمات البرمجية.</p>
<p>وهذا يثير سؤالًا مهمًا: ما هي الأدوات الإضافية الضرورية؟</p>
<p>يتطلب تعداد الأدوات توازنًا دقيقًا - فالكثير من الأدوات يخلق عبئًا معرفيًا زائدًا ويربك عملية اختيار أداة LLM، في حين أن القليل منها قد يفوت وظائف أساسية.</p>
<p>يساعد العمل بشكل عكسي من حالات الاستخدام الواقعية في الإجابة على هذا السؤال.</p>
<h4 id="Addressing-Background-Processing-Challenges" class="common-anchor-header">معالجة تحديات المعالجة الخلفية</h4><p>يمكن أن تستغرق قواعد الرموز الكبيرة وقتًا طويلاً للفهرسة. يجبر النهج الساذج المتمثل في الانتظار المتزامن للإنجاز المستخدمين على الانتظار لعدة دقائق، وهو أمر غير مقبول ببساطة. تصبح المعالجة الخلفية غير المتزامنة ضرورية، لكن MCP لا يدعم هذا النمط أصلاً.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_e1f0aa290f.png" alt="8.png" class="doc-image" id="8.png" />
   </span> <span class="img-wrapper"> <span>8.png</span> </span></p>
<p>يقوم خادم MCP الخاص بنا بتشغيل عملية في الخلفية داخل خادم MCP للتعامل مع الفهرسة مع إعادة رسائل بدء التشغيل للمستخدمين على الفور، مما يسمح لهم بمواصلة العمل.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/9_1cb37d15f3.png" alt="9.png" class="doc-image" id="9.png" />
   </span> <span class="img-wrapper"> <span>9.png</span> </span></p>
<p>وهذا يخلق تحديًا جديدًا: كيف يمكن للمستخدمين تتبع تقدم الفهرسة؟</p>
<p>أداة مخصصة للاستعلام عن تقدم الفهرسة أو الحالة تحل هذه المشكلة بشكل أنيق. حيث تقوم عملية الفهرسة في الخلفية بتخزين معلومات التقدم بشكل غير متزامن بشكل غير متزامن، مما يتيح للمستخدمين التحقق من نسب الإنجاز أو حالة النجاح أو حالات الفشل في أي وقت. بالإضافة إلى ذلك، تتعامل أداة المسح اليدوي للفهرسة مع الحالات التي يحتاج فيها المستخدمون إلى إعادة تعيين الفهارس غير الدقيقة أو إعادة تشغيل عملية الفهرسة.</p>
<p><strong>تصميم الأداة النهائية:</strong></p>
<p><code translate="no">index_codebase</code> - قاعدة رمز الفهرس<code translate="no">search_code</code> - رمز البحث<code translate="no">get_indexing_status</code> - حالة فهرسة الاستعلام<code translate="no">clear_index</code> - مسح الفهرس</p>
<p>أربع أدوات تحقق التوازن المثالي بين البساطة والوظائف.</p>
<h4 id="🔹-Environment-Variable-Management" class="common-anchor-header">🔹 إدارة متغيرات البيئة</h4><p>غالبًا ما يتم التغاضي عن إدارة متغيرات البيئة على الرغم من تأثيرها الكبير على تجربة المستخدم. إن اشتراط تكوين مفتاح API منفصل لكل عميل MCP من شأنه أن يجبر المستخدمين على تكوين بيانات الاعتماد عدة مرات عند التبديل بين Claude Code و Gemini CLI.</p>
<p>يزيل نهج التكوين العام هذا الاحتكاك من خلال إنشاء ملف <code translate="no">~/.context/.env</code> في الدليل الرئيسي للمستخدم:</p>
<pre><code translate="no"><span class="hljs-comment"># ~/.context/.env</span>
OPENAI_API_KEY=your-api-key-here
MILVUS_TOKEN=your-milvus-token
<button class="copy-code-btn"></button></code></pre>
<p><strong>يوفر هذا النهج مزايا واضحة:</strong> يقوم المستخدمون بالتهيئة مرة واحدة واستخدامها في كل مكان عبر جميع عملاء MCP، وتتركز جميع التكوينات في موقع واحد لسهولة الصيانة، ولا تتشتت مفاتيح واجهة برمجة التطبيقات الحساسة عبر ملفات تكوين متعددة.</p>
<p>ننفذ أيضًا تسلسلًا هرميًا للأولويات من ثلاثة مستويات: متغيرات بيئة العملية لها الأولوية القصوى، وملفات التكوين العامة لها أولوية متوسطة، والقيم الافتراضية تعمل كاحتياطيات.</p>
<p>يوفر هذا التصميم مرونة هائلة: يمكن للمطورين استخدام متغيرات البيئة لتجاوزات الاختبار المؤقتة، ويمكن لبيئات الإنتاج حقن تكوينات حساسة من خلال متغيرات بيئة النظام لتعزيز الأمان، ويمكن للمستخدمين التهيئة مرة واحدة للعمل بسلاسة عبر Claude Code و Gemini CLI والأدوات الأخرى.</p>
<p>عند هذه النقطة، تكتمل البنية الأساسية لخادم MCP، والتي تشمل تحليل التعليمات البرمجية وتخزين المتجهات من خلال الاسترجاع الذكي وإدارة التكوين. وقد تم تصميم كل مكون بعناية وتحسينه لإنشاء نظام قوي وسهل الاستخدام.</p>
<h2 id="Hands-on-Testing" class="common-anchor-header">اختبار عملي<button data-href="#Hands-on-Testing" class="anchor-icon" translate="no">
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
    </button></h2><p>إذاً كيف يعمل كلود كونكتيكت عملياً؟ لقد اختبرته على نفس سيناريو البحث عن الأخطاء الذي أصابني بالإحباط في البداية.</p>
<p>كان التثبيت أمرًا واحدًا فقط قبل إطلاق كلود كود:</p>
<pre><code translate="no">claude mcp add claude-context -e OPENAI_API_KEY=your-openai-api-key -e MILVUS_TOKEN=your-zilliz-cloud-api-key -- npx <span class="hljs-meta">@zilliz</span>/claude-context-mcp<span class="hljs-meta">@latest</span>
<button class="copy-code-btn"></button></code></pre>
<p>بمجرد أن تمت فهرسة قاعدة التعليمات البرمجية الخاصة بي، أعطيت Claude Code نفس وصف الخطأ الذي أرسلته في السابق في <strong>مطاردة أوزة مدتها خمس دقائق مدعومة بـ grep</strong>. هذه المرة، من خلال مكالمات <code translate="no">claude-context</code> MCP، <strong>حدد على الفور الملف ورقم السطر بالضبط،</strong> مع شرح كامل للمشكلة.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_context_gif_e04d07cd00.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>لم يكن الفرق دقيقًا - بل كان ليلاً ونهارًا.</p>
<p>ولم يكن الأمر مجرد بحث عن الأخطاء. فمع دمج Claude Context، أنتج Claude Code نتائج ذات جودة أعلى باستمرار في جميع أنحاء العالم:</p>
<ul>
<li><p><strong>حل المشكلات</strong></p></li>
<li><p><strong>إعادة هيكلة التعليمات البرمجية</strong></p></li>
<li><p><strong>اكتشاف التعليمات البرمجية المكررة</strong></p></li>
<li><p><strong>اختبار شامل</strong></p></li>
</ul>
<p>يظهر تعزيز الأداء في الأرقام أيضًا. في الاختبار جنباً إلى جنب</p>
<ul>
<li><p>انخفض استخدام الرمز المميز بأكثر من 40%، دون أي خسارة في الاستدعاء.</p></li>
<li><p>وهذا يُترجم مباشرةً إلى تكاليف أقل لواجهة برمجة التطبيقات واستجابات أسرع.</p></li>
<li><p>وبدلاً من ذلك، وبنفس الميزانية، قدم Claude Context عمليات استرجاع أكثر دقة بكثير.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/11_2659dd3429.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>لقد قمنا بفتح مصدر Claude Context على GitHub، وقد حصل بالفعل على أكثر من 2.6 ألف نجمة. شكراً لكم جميعاً على دعمكم وإعجاباتكم.</p>
<p>يمكنك تجربته بنفسك:</p>
<ul>
<li><p>GitHub:<a href="https://github.com/zilliztech/claude-context"> github.com/zilliztech/claude-context</a></p></li>
<li><p>npm:<a href="https://www.npmjs.com/package/@zilliz/claude-context-mcp"> @zilliz/claude-context-mcp</a></p></li>
</ul>
<p>المعايير التفصيلية ومنهجية الاختبار متوفرة في الريبو - نود الحصول على تعليقاتكم.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/12_88bf595b15.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Looking-Forward" class="common-anchor-header">التطلع إلى الأمام<button data-href="#Looking-Forward" class="anchor-icon" translate="no">
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
    </button></h2><p>ما بدأ كإحباط مع grep في كلود كود نما إلى حل قوي: Claude <a href="https://github.com/zilliztech/claude-context"><strong>Context - وهو</strong></a>مكون إضافي مفتوح المصدر لبرنامج MCP يجلب البحث الدلالي المدعوم بالمتجهات إلى Claude Code وغيره من مساعدي الترميز. الرسالة بسيطة: ليس على المطورين الاكتفاء بأدوات الذكاء الاصطناعي غير الفعالة. فمع RAG واسترجاع المتجهات، يمكنك تصحيح الأخطاء بشكل أسرع، وخفض تكاليف الرموز بنسبة 40%، والحصول أخيرًا على مساعدة الذكاء الاصطناعي التي تفهم حقًا قاعدة التعليمات البرمجية الخاصة بك.</p>
<p>وهذا لا يقتصر على كلود كود. نظرًا لأن Claude Context مبني على معايير مفتوحة، فإن نفس النهج يعمل بسلاسة مع Gemini CLI و Qwen Code و Cursor و Cline وغيرها. لا مزيد من الحبس في مفاضلات البائعين التي تعطي الأولوية للبساطة على الأداء.</p>
<p>نود أن تكون جزءًا من هذا المستقبل:</p>
<ul>
<li><p><strong>جرّب</strong> <a href="https://github.com/zilliztech/claude-context"><strong>سياق كلود</strong></a><strong>:</strong> إنه مفتوح المصدر ومجاني تمامًا</p></li>
<li><p><strong>ساهم في تطويره</strong></p></li>
<li><p><strong>أو قم ببناء الحل الخاص بك</strong> باستخدام Claude Context</p></li>
</ul>
<p>👉 شارك بتعليقاتك أو اطرح أسئلتك أو احصل على المساعدة من خلال الانضمام إلى <a href="https://discord.com/invite/8uyFbECzPX"><strong>مجتمع Discord</strong></a> الخاص بنا.</p>
