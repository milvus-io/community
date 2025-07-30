---
id: build-open-source-alternative-to-cursor-with-code-context.md
title: بناء بديل مفتوح المصدر لـ Cursor مع سياق الكود
author: Cheney Zhang
date: 2025-07-24T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Jul_26_2025_08_26_35_PM_b728fb730c.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'vector database, mcp, LLM, claude, gemini'
meta_keywords: 'Cursor, Claude Code, Gemini CLI, Code search, semantic code search'
meta_title: |
  Building an Open-Source Alternative to Cursor with Code Context
desc: >-
  سياق الكود - وهو مكون إضافي مفتوح المصدر ومتوافق مع MCP يجلب بحثًا دلاليًا
  قويًا عن الكود إلى أي عامل ترميز بالذكاء الاصطناعي، و Claude Code و Gemini
  CLI، و IDE مثل VSCode، وحتى بيئات مثل Chrome.
origin: >-
  https://milvus.io/blog/build-open-source-alternative-to-cursor-with-code-context.md
---
<h2 id="The-AI-Coding-BoomAnd-Its-Blind-Spot" class="common-anchor-header">ازدهار ترميز الذكاء الاصطناعي - والنقطة العمياء فيه<button data-href="#The-AI-Coding-BoomAnd-Its-Blind-Spot" class="anchor-icon" translate="no">
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
    </button></h2><p>أدوات الترميز بالذكاء الاصطناعي منتشرة في كل مكان - وهي تنتشر لسبب وجيه. من <a href="https://milvus.io/blog/claude-code-vs-gemini-cli-which-ones-the-real-dev-co-pilot.md">Claude Code، وGemini CLI</a> إلى بدائل Cursor مفتوحة المصدر، يمكن لهذه الوكلاء كتابة الدوال، وشرح تبعية التعليمات البرمجية، وإعادة هيكلة ملفات كاملة بمطالبة واحدة. يتسابق المطورون لدمجها في سير عملهم، وهي تحقق الضجة التي تُثار حولها من نواحٍ عديدة.</p>
<p><strong>ولكن عندما يتعلق الأمر <em>بفهم قاعدة التعليمات البرمجية الخاصة بك،</em> فإن معظم أدوات الذكاء الاصطناعي تصطدم بحائط.</strong></p>
<p>اطلب من Claude Code العثور على "المكان الذي يتعامل فيه هذا المشروع مع مصادقة المستخدم"، وسيتراجع على <code translate="no">grep -r &quot;auth&quot;</code>- حيث سيخرج 87 تطابقًا غير مترابط عبر التعليقات وأسماء المتغيرات وأسماء الملفات، ومن المحتمل أن يفتقد العديد من الوظائف التي تحتوي على منطق المصادقة ولكن لا تسمى "مصادقة". جرّب Gemini CLI، وسيبحث عن كلمات مفتاحية مثل "تسجيل الدخول" أو "كلمة المرور"، وسيفتقد دوال مثل <code translate="no">verifyCredentials()</code> بالكامل. هذه الأدوات رائعة في توليد التعليمات البرمجية، ولكن عندما يحين وقت التنقل أو تصحيح الأخطاء أو استكشاف الأنظمة غير المألوفة، فإنها تنهار. ما لم ترسل قاعدة البرمجة بأكملها إلى قاعدة الرموز البرمجية بأكملها إلى LLM من أجل السياق - من خلال الرموز والوقت - فإنها تكافح لتقديم إجابات ذات مغزى.</p>
<p><em>هذه هي الفجوة الحقيقية في أدوات الذكاء الاصطناعي اليوم:</em> <strong><em>سياق الكود.</em></strong></p>
<h2 id="Cursor-Nailed-ItBut-Not-for-Everyone" class="common-anchor-header">لقد نجح المؤشر في ذلك - ولكن ليس للجميع<button data-href="#Cursor-Nailed-ItBut-Not-for-Everyone" class="anchor-icon" translate="no">
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
    </button></h2><p>يعالج<strong>Cursor</strong> هذه المشكلة وجهاً لوجه. فبدلاً من البحث عن الكلمات المفتاحية، يقوم ببناء خريطة دلالية لقاعدة التعليمات البرمجية الخاصة بك باستخدام أشجار بناء الجمل والتضمينات المتجهة والبحث المدرك للرمز. اسأله "أين هو منطق التحقق من صحة البريد الإلكتروني؟" وسيُعيد لك <code translate="no">isValidEmailFormat()</code> - ليس لأن الاسم مطابق، ولكن لأنه يفهم ما <em>يفعله</em> هذا الرمز.</p>
<p>على الرغم من قوة Cursor، إلا أنه قد لا يكون مناسبًا للجميع. <strong><em>فبرنامج Cursor مغلق المصدر، ومستضاف على السحابة، وقائم على الاشتراك.</em></strong> وهذا يضعه بعيدًا عن متناول الفرق التي تعمل مع التعليمات البرمجية الحساسة، والمؤسسات المهتمة بالأمن، والمطورين المستقلين، والطلاب، وأي شخص يفضل الأنظمة المفتوحة.</p>
<h2 id="What-if-You-Could-Build-Your-Own-Cursor" class="common-anchor-header">ماذا لو كان بإمكانك بناء المؤشر الخاص بك؟<button data-href="#What-if-You-Could-Build-Your-Own-Cursor" class="anchor-icon" translate="no">
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
    </button></h2><p>إليك الأمر: التكنولوجيا الأساسية وراء Cursor ليست مسجلة الملكية. إنه مبني على أسس مفتوحة المصدر مثبتة - قواعد بيانات متجهة مثل <a href="https://milvus.io/">Milvus،</a> <a href="https://zilliz.com/ai-models">ونماذج التضمين،</a> ومحللي بناء الجملة مع Tree-sitter - وكلها متاحة لأي شخص يرغب في توصيل النقاط.</p>
<p><em>لذا، سألنا:</em> <strong><em>ماذا لو كان بإمكان أي شخص أن يبني المؤشر الخاص به؟</em></strong> يعمل على بنيتك التحتية. بدون رسوم اشتراك. قابل للتخصيص بالكامل. تحكم كامل في التعليمات البرمجية والبيانات الخاصة بك.</p>
<p>لهذا السبب قمنا ببناء <a href="https://github.com/zilliztech/code-context"><strong>Code Context - وهو</strong></a>مكون إضافي مفتوح المصدر ومتوافق مع MCP يجلب بحثًا دلاليًا قويًا عن التعليمات البرمجية إلى أي وكيل ترميز بالذكاء الاصطناعي، مثل Claude Code و Gemini CLI، و IDEs مثل VSCode، وحتى بيئات مثل Google Chrome. كما أنه يمنحك القدرة على بناء وكيل الترميز الخاص بك مثل Cursor من الصفر، مما يتيح لك التنقل الذكي في الوقت الحقيقي لقاعدة التعليمات البرمجية الخاصة بك.</p>
<p><strong><em>لا اشتراكات. لا صناديق سوداء. فقط ذكاء الكود - بشروطك أنت.</em></strong></p>
<p>في بقية هذا المنشور، سنتعرف على كيفية عمل Code Context - وكيف يمكنك البدء في استخدامه اليوم.</p>
<h2 id="Code-Context-Open-Source-Alternative-to-Cursors-Intelligence" class="common-anchor-header">سياق الكود: البديل المفتوح المصدر لذكاء كود السياق<button data-href="#Code-Context-Open-Source-Alternative-to-Cursors-Intelligence" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/code-context"><strong>سياق</strong></a> التعليمات البرمجية هو محرك بحث دلالي مفتوح المصدر ومتوافق مع MCP. سواء كنت تنشئ مساعد ترميز ذكاء اصطناعي مخصص من الصفر أو تضيف وعيًا دلاليًا إلى وكلاء ترميز الذكاء الاصطناعي مثل Claude Code و Gemini CLI، فإن Code Context هو المحرك الذي يجعل ذلك ممكنًا.</p>
<p>وهو يعمل محلياً، ويتكامل مع أدواتك وبيئاتك المفضلة، مثل VS Code ومتصفحات Chrome، ويوفر فهماً قوياً للأكواد دون الاعتماد على المنصات السحابية المغلقة المصدر فقط.</p>
<p><strong>تشمل القدرات الأساسية ما يلي:</strong></p>
<ul>
<li><p><strong>البحث الدلالي عن التعليمات البرمجية عبر اللغة الطبيعية:</strong> البحث عن التعليمات البرمجية باستخدام لغة إنجليزية بسيطة. ابحث عن مفاهيم مثل "التحقق من تسجيل دخول المستخدم" أو "منطق معالجة الدفع"، ويحدد سياق التعليمات البرمجية موقع الوظائف ذات الصلة - حتى لو لم تتطابق مع الكلمات الرئيسية بالضبط.</p></li>
<li><p><strong>دعم متعدد اللغات:</strong> ابحث بسلاسة عبر أكثر من 15 لغة برمجة، بما في ذلك JavaScript وPython وJava وGo، مع فهم دلالي متسق عبرها جميعاً.</p></li>
<li><p><strong>تقطيع الكود القائم على AST:</strong> يتم تقسيم الكود تلقائيًا إلى وحدات منطقية، مثل الدوال والفئات، باستخدام تحليل AST، مما يضمن أن تكون نتائج البحث كاملة وذات مغزى ولا تنقطع أبدًا في منتصف الوظيفة.</p></li>
<li><p><strong>فهرسة مباشرة وتزايدية:</strong> تتم فهرسة تغييرات التعليمات البرمجية في الوقت الفعلي. أثناء قيامك بتحرير الملفات، يظل فهرس البحث محدثًا - لا حاجة للتحديث اليدوي أو إعادة الفهرسة.</p></li>
<li><p><strong>نشر محلي وآمن بالكامل:</strong> تشغيل كل شيء على البنية التحتية الخاصة بك. يدعم Code Context النماذج المحلية عبر Ollama والفهرسة عبر <a href="https://milvus.io/">Milvus،</a> بحيث لا يغادر رمزك بيئتك أبدًا.</p></li>
<li><p><strong>تكامل IDE من الدرجة الأولى:</strong> يتيح لك ملحق VSCode البحث والانتقال إلى النتائج على الفور - مباشرةً من المحرر الخاص بك، دون تبديل السياق.</p></li>
<li><p><strong>دعم بروتوكول MCP:</strong> يتحدث سياق الكود بروتوكول MCP، مما يجعل من السهل التكامل مع مساعدي الترميز بالذكاء الاصطناعي وإدخال البحث الدلالي مباشرةً في سير عملهم.</p></li>
<li><p><strong>دعم البرنامج المساعد للمتصفح:</strong> ابحث في المستودعات مباشرةً من GitHub في متصفحك - لا علامات تبويب ولا نسخ ولصق، فقط سياق فوري أينما كنت تعمل.</p></li>
</ul>
<h3 id="How-Code-Context-Works" class="common-anchor-header">كيف يعمل سياق الكود</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/How_Code_Context_Works_3faaa2fff3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>يستخدم Code Context بنية معيارية مع وحدة تنسيق أساسية ومكونات متخصصة للتضمين والتحليل والتخزين والاسترجاع.</p>
<h3 id="The-Core-Module-Code-Context-Core" class="common-anchor-header">الوحدة الأساسية: نواة سياق الكود الأساسية</h3><p>تقع الوحدة <strong>الأساسية</strong> لسياق التعليمات البرمجية في قلب سياق التعليمات البرمجية (Code Context Core)، والتي تنسق تحليل التعليمات البرمجية وتضمينها وتخزينها واسترجاعها الدلالي:</p>
<ul>
<li><p>تقوم<strong>وحدة معالجة النص</strong> بتقسيم وتحليل الشيفرة البرمجية باستخدام Tree-sitter لتحليل AST المدرك للغة.</p></li>
<li><p>وتدعم<strong>واجهة الت</strong> ضمين الواجهة الخلفية القابلة للتوصيل - OpenAI و VoyageAI حاليًا - لتحويل أجزاء التعليمات البرمجية إلى تضمينات متجهة تلتقط معناها الدلالي وعلاقاتها السياقية.</p></li>
<li><p><strong>تقوم واجهة قاعدة بيانات المتجهات</strong> بتخزين هذه التضمينات في مثيل <a href="https://milvus.io/">Milvus</a> المستضاف ذاتيًا (افتراضيًا) أو في <a href="https://zilliz.com/cloud">Zilliz Cloud،</a> الإصدار المُدار من Milvus.</p></li>
</ul>
<p>تتم مزامنة كل هذا مع نظام الملفات الخاص بك على أساس مجدول، مما يضمن بقاء الفهرس محدثًا دون الحاجة إلى تدخل يدوي.</p>
<h3 id="Extension-Modules-on-top-of-Code-Context-Core" class="common-anchor-header">وحدات الامتداد على رأس كود السياق الأساسي</h3><ul>
<li><p><strong>ملحق VSCode</strong>: تكامل سلس مع IDE للبحث الدلالي السريع داخل المحرر والانتقال إلى التعريف.</p></li>
<li><p><strong>ملحق كروم</strong>: بحث دلالي مضمن في الكود الدلالي أثناء تصفح مستودعات GitHub - لا حاجة للتبديل بين علامات التبويب.</p></li>
<li><p><strong>خادم MCP</strong>: يعرض سياق التعليمات البرمجية لأي مساعد ترميز بالذكاء الاصطناعي عبر بروتوكول MCP، مما يتيح المساعدة في الوقت الحقيقي، والمساعدة المدركة للسياق.</p></li>
</ul>
<h2 id="Getting-Started-with-Code-Context" class="common-anchor-header">البدء باستخدام سياق الكود<button data-href="#Getting-Started-with-Code-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>يمكن توصيل سياق التعليمات البرمجية بأدوات الترميز التي تستخدمها بالفعل أو لإنشاء مساعد ترميز مخصص للذكاء الاصطناعي من البداية. سنستعرض في هذا القسم كلا السيناريوهين:</p>
<ul>
<li><p>كيفية دمج Code Context مع الأدوات الحالية</p></li>
<li><p>كيفية إعداد الوحدة النمطية الأساسية للبحث الدلالي المستقل عن التعليمات البرمجية عند إنشاء مساعد ترميز الذكاء الاصطناعي الخاص بك</p></li>
</ul>
<h3 id="MCP-Integration" class="common-anchor-header">تكامل MCP</h3><p>يدعم Code Context <strong>بروتوكول سياق الكود بروتوكول سياق النموذج (MCP)</strong>، مما يسمح لوكلاء الترميز بالذكاء الاصطناعي مثل Claude Code باستخدامه كواجهة خلفية دلالية.</p>
<p>للتكامل مع Claude Code:</p>
<pre><code translate="no">claude mcp add code-context -e OPENAI_API_KEY=your-openai-api-key -e MILVUS_ADDRESS=your-zilliz-cloud-<span class="hljs-keyword">public</span>-endpoint -e MILVUS_TOKEN=your-zilliz-cloud-api-key -- npx <span class="hljs-meta">@zilliz</span>/code-context-mcp<span class="hljs-meta">@latest</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mcp_code_context_processed_3908097481.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>بمجرد التهيئة، سيتصل Claude Code تلقائيًا بـ Code Context للبحث عن الكود الدلالي عند الحاجة.</p>
<p>للاندماج مع أدوات أو بيئات أخرى، تحقق من<a href="https://github.com/zilliztech/code-context"> مستودع GitHub</a> الخاص بنا للحصول على المزيد من الأمثلة والمحولات.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/MCP_Integration_2_683c7ef73d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Building-Your-Own-AI-Coding-Assistant-with-Code-Context" class="common-anchor-header">بناء مساعد الترميز بالذكاء الاصطناعي الخاص بك باستخدام Code Context</h3><p>لإنشاء مساعد مخصص للذكاء الاصطناعي باستخدام Code Context، ستقوم بإعداد الوحدة الأساسية للبحث الدلالي عن التعليمات البرمجية في ثلاث خطوات فقط:</p>
<ol>
<li><p>تكوين نموذج التضمين الخاص بك</p></li>
<li><p>الاتصال بقاعدة بياناتك المتجهة</p></li>
<li><p>فهرسة مشروعك وبدء البحث</p></li>
</ol>
<p>إليك مثالاً باستخدام <strong>OpenAI Embeddings</strong> وقاعدة <strong>بيانات</strong> <a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a> <strong>vector</strong> كواجهة خلفية للمتجهات:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">CodeContext</span>, <span class="hljs-title class_">MilvusVectorDatabase</span>, <span class="hljs-title class_">OpenAIEmbedding</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@zilliz/code-context-core&#x27;</span>;

<span class="hljs-comment">// Initialize embedding model</span>
<span class="hljs-keyword">const</span> embedding = <span class="hljs-keyword">new</span> <span class="hljs-title class_">OpenAIEmbedding</span>({
    <span class="hljs-attr">apiKey</span>: <span class="hljs-string">&#x27;your-openai-api-key&#x27;</span>,
    <span class="hljs-attr">model</span>: <span class="hljs-string">&#x27;text-embedding-3-small&#x27;</span>
});

<span class="hljs-comment">// Initialize Zilliz Cloud vector database</span>
<span class="hljs-comment">// Sign up for free at https://zilliz.com/cloud</span>
<span class="hljs-keyword">const</span> vectorDatabase = <span class="hljs-keyword">new</span> <span class="hljs-title class_">MilvusVectorDatabase</span>({
    <span class="hljs-attr">address</span>: <span class="hljs-string">&#x27;https://xxx-xxxxxxxxxxxx.serverless.gcp-us-west1.cloud.zilliz.com&#x27;</span>,
    <span class="hljs-attr">token</span>: <span class="hljs-string">&#x27;xxxxxxx&#x27;</span>
});

<span class="hljs-comment">// Create the Code Context indexer</span>
<span class="hljs-keyword">const</span> context = <span class="hljs-keyword">new</span> <span class="hljs-title class_">CodeContext</span>({ embedding, vectorDatabase });

<span class="hljs-comment">// Index the codebase</span>
<span class="hljs-keyword">await</span> context.<span class="hljs-title function_">indexCodebase</span>(<span class="hljs-string">&#x27;./your-project&#x27;</span>);

<span class="hljs-comment">// Perform semantic code search</span>
<span class="hljs-keyword">const</span> results = <span class="hljs-keyword">await</span> context.<span class="hljs-title function_">semanticSearch</span>(<span class="hljs-string">&#x27;./your-project&#x27;</span>, <span class="hljs-string">&#x27;vector database operations&#x27;</span>, <span class="hljs-number">5</span>);
results.<span class="hljs-title function_">forEach</span>(<span class="hljs-function"><span class="hljs-params">result</span> =&gt;</span> {
    <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">`<span class="hljs-subst">${result.relativePath}</span>:<span class="hljs-subst">${result.startLine}</span>-<span class="hljs-subst">${result.endLine}</span>`</span>);
    <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">`score: <span class="hljs-subst">${(result.score * <span class="hljs-number">100</span>).toFixed(<span class="hljs-number">2</span>)}</span>%`</span>);
});
<button class="copy-code-btn"></button></code></pre>
<h3 id="VSCode-Extension" class="common-anchor-header">ملحق كود VSCode</h3><p>يتوفر سياق التعليمات البرمجية كملحق VSCode باسم <strong>"البحث الدلالي عن</strong> التعليمات البرمجية <strong>"،</strong> والذي يجلب البحث الذكي القائم على اللغة الطبيعية في محرّرك مباشرةً.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/VS_Code_Extension_e358f36464.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>بمجرد التثبيت:</p>
<ul>
<li><p>تكوين مفتاح API الخاص بك</p></li>
<li><p>فهرسة مشروعك</p></li>
<li><p>استخدم استعلامات باللغة الإنجليزية البسيطة (لا حاجة للمطابقة التامة)</p></li>
<li><p>الانتقال إلى النتائج على الفور باستخدام النقر للتنقل</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mcp_code_context_processed_3908097481.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>هذا يجعل الاستكشاف الدلالي جزءًا أصليًا من سير عمل الترميز الخاص بك - لا حاجة إلى محطة طرفية أو متصفح.</p>
<h3 id="Chrome-Extension-Coming-Soon" class="common-anchor-header">امتداد كروم (قريباً)</h3><p>تجلب <strong>إضافة كروم</strong> القادمة الخاصة بنا "سياق التعليمات البرمجية" إلى صفحات الويب الخاصة ب GitHub، مما يسمح لك بإجراء بحث دلالي عن التعليمات البرمجية مباشرةً داخل أي مستودع عام - دون الحاجة إلى تبديل السياق أو علامات التبويب.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/chrome_4e67b683d7.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>ستتمكن من استكشاف قواعد التعليمات البرمجية غير المألوفة بنفس إمكانيات البحث العميق التي لديك محلياً. ترقبوا - الإضافة قيد التطوير وسيتم إطلاقها قريباً.</p>
<h2 id="Why-Use-Code-Context" class="common-anchor-header">لماذا استخدام سياق التعليمات البرمجية؟<button data-href="#Why-Use-Code-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>يساعدك الإعداد الأساسي على العمل بسرعة، ولكن المكان الذي يتألق فيه <strong>Code Context</strong> حقًا هو بيئات التطوير الاحترافية عالية الأداء. تم تصميم ميزاته المتقدمة لدعم عمليات سير العمل الجادة، بدءاً من عمليات النشر على نطاق المؤسسة إلى أدوات الذكاء الاصطناعي المخصصة.</p>
<h3 id="Private-Deployment-for-Enterprise-Grade-Security" class="common-anchor-header">النشر الخاص للأمان على مستوى المؤسسات</h3><p>يدعم Code Context النشر دون اتصال بالإنترنت بشكل كامل باستخدام نموذج التضمين المحلي لـ <strong>Ollama</strong> و <strong>Milvus</strong> كقاعدة بيانات متجهة ذاتية الاستضافة. يتيح ذلك خط أنابيب خاص بالكامل للبحث عن التعليمات البرمجية: لا توجد مكالمات لواجهة برمجة التطبيقات، ولا يوجد نقل عبر الإنترنت، ولا تغادر أي بيانات بيئتك المحلية.</p>
<p>تعتبر هذه البنية مثالية للصناعات ذات متطلبات الامتثال الصارمة - مثل التمويل والحكومة والدفاع - حيث تكون سرية التعليمات البرمجية غير قابلة للتفاوض.</p>
<h3 id="Real-Time-Indexing-with-Intelligent-File-Sync" class="common-anchor-header">الفهرسة في الوقت الحقيقي مع المزامنة الذكية للملفات</h3><p>لا ينبغي أن يكون تحديث فهرس التعليمات البرمجية بطيئاً أو يدوياً. يشتمل Code Context على <strong>نظام مراقبة الملفات المستند إلى Merkle Tree</strong> الذي يكتشف التغييرات على الفور ويقوم بإجراء تحديثات متزايدة في الوقت الفعلي.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/workflow_0fd958fe81.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>من خلال إعادة فهرسة الملفات المعدلة فقط، فإنه يقلل من أوقات التحديث للمستودعات الكبيرة من دقائق إلى ثوانٍ. وهذا يضمن أن الرمز الذي كتبته للتو قابل للبحث بالفعل، دون الحاجة إلى النقر على "تحديث".</p>
<p>في بيئات التطوير السريع، هذا النوع من الفورية أمر بالغ الأهمية.</p>
<h3 id="AST-Parsing-That-Understands-Code-Like-You-Do" class="common-anchor-header">تحليل AST الذي يفهم الكود كما تفهمه أنت</h3><p>تقسم أدوات البحث التقليدية عن التعليمات البرمجية النص حسب عدد الأسطر أو عدد الأحرف، وغالباً ما تكسر الوحدات المنطقية وتعطي نتائج مربكة.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/AST_Parsing_That_Understands_Code_Like_You_Do_3236afc075.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>سياق الكود يعمل بشكل أفضل. فهو يستخدم تحليل AST لتحليل الشجرة لفهم بنية الكود الفعلية. وهو يحدد الدوال والفئات والواجهات والوحدات البينية والوحدات النمطية الكاملة، مما يوفر نتائج نظيفة وكاملة من الناحية الدلالية.</p>
<p>وهو يدعم لغات البرمجة الرئيسية، بما في ذلك JavaScript/TypeScript وPython وJava وC/C++C وGo وRust، مع استراتيجيات خاصة بكل لغة لتقطيع دقيق. أما بالنسبة للغات غير المدعومة، فإنه يعود إلى التحليل القائم على القواعد، مما يضمن معالجة رشيقة دون أعطال أو نتائج فارغة.</p>
<p>تغذي هذه الوحدات البرمجية المهيكلة أيضًا البيانات الوصفية من أجل بحث دلالي أكثر دقة.</p>
<h3 id="Open-Source-and-Extensible-by-Design" class="common-anchor-header">مفتوح المصدر وقابل للتوسيع حسب التصميم</h3><p>سياق الكود مفتوح المصدر بالكامل تحت رخصة MIT. جميع الوحدات الأساسية متاحة للجمهور على GitHub.</p>
<p>نحن نؤمن بأن البنية التحتية المفتوحة هي المفتاح لبناء أدوات مطورين قوية وجديرة بالثقة - وندعو المطورين لتوسيعها لنماذج أو لغات أو حالات استخدام جديدة.</p>
<h3 id="Solving-the-Context-Window-Problem-for-AI-Assistants" class="common-anchor-header">حل مشكلة نافذة السياق لمساعدات الذكاء الاصطناعي</h3><p>لدى النماذج اللغوية الكبيرة (LLMs) حد صعب: نافذة السياق الخاصة بها. وهذا يقيّدها من رؤية قاعدة التعليمات البرمجية بأكملها، مما يقلل من دقة الاستكمالات والإصلاحات والاقتراحات.</p>
<p>يساعد سياق الكود في سد هذه الفجوة. حيث يسترجع البحث الدلالي عن التعليمات البرمجية الأجزاء <em>الصحيحة</em> من التعليمات البرمجية، مما يمنح مساعد الذكاء الاصطناعي سياقاً مركّزاً وملائماً للتفكير فيه. وهو يحسّن جودة المخرجات التي ينشئها الذكاء الاصطناعي من خلال السماح للنموذج "بتكبير" ما يهم فعلاً.</p>
<p>تفتقر أدوات ترميز الذكاء الاصطناعي الشائعة، مثل Claude Code و Gemini CLI، إلى البحث الدلالي الأصلي عن التعليمات البرمجية - فهي تعتمد على الاستدلال السطحي القائم على الكلمات الرئيسية. إن سياق الكود، عند دمجها عبر <strong>MCP،</strong> يمنحها ترقية دماغية.</p>
<h3 id="Built-for-Developers-by-Developers" class="common-anchor-header">صُمم للمطورين، بواسطة المطورين</h3><p>يتم تجميع Code Context لإعادة الاستخدام المعياري: يتوفر كل مكون كحزمة <strong>npm</strong> مستقلة. يمكنك المزج والمطابقة والتوسيع حسب الحاجة لمشروعك.</p>
<ul>
<li><p>هل تحتاج فقط إلى بحث دلالي عن التعليمات البرمجية؟ استخدم<code translate="no">@zilliz/code-context-core</code></p></li>
<li><p>هل تريد توصيله بعامل ذكاء اصطناعي؟ أضف <code translate="no">@zilliz/code-context-mcp</code></p></li>
<li><p>بناء أداة IDE/المتصفح الخاص بك؟ اطلع على أمثلة VSCode وإضافات كروم الخاصة بنا</p></li>
</ul>
<p>بعض الأمثلة على تطبيقات سياق التعليمات البرمجية:</p>
<ul>
<li><p><strong>ملحقات الإكمال التلقائي المدركة للسياق</strong> التي تسحب المقتطفات ذات الصلة لإكمال LLM بشكل أفضل</p></li>
<li><p><strong>كاشفات الأخطاء الذكية</strong> التي تجمع التعليمات البرمجية المحيطة لتحسين اقتراحات الإصلاح</p></li>
<li><p><strong>أدوات إعادة هيكلة التعليمات البرمجية الآمنة</strong> التي تجد المواقع ذات الصلة الدلالية تلقائيًا</p></li>
<li><p><strong>مصورات معمارية</strong> تبني مخططات من علاقات التعليمات البرمجية الدلالية</p></li>
<li><p><strong>مساعدو مراجعة الشيفرة البرمجية الأكثر ذكاءً</strong> التي تبرز التطبيقات التاريخية أثناء مراجعات العلاقات العامة</p></li>
</ul>
<h2 id="Welcome-to-Join-Our-Community" class="common-anchor-header">مرحبًا بك في الانضمام إلى مجتمعنا<button data-href="#Welcome-to-Join-Our-Community" class="anchor-icon" translate="no">
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
    </button></h2><p>إن<a href="https://github.com/zilliztech/code-context"><strong>Code Context</strong></a> هو أكثر من مجرد أداة - إنه منصة لاستكشاف كيف يمكن <strong>للذكاء الاصطناعي وقواعد البيانات المتجهة</strong> العمل معاً لفهم الكود بشكل حقيقي. ومع تحول التطوير بمساعدة الذكاء الاصطناعي إلى القاعدة، نعتقد أن البحث الدلالي عن الكود سيكون قدرة أساسية.</p>
<p>نرحب بالمساهمات من جميع الأنواع:</p>
<ul>
<li><p>دعم لغات جديدة</p></li>
<li><p>خلفيات نموذج التضمين الجديدة</p></li>
<li><p>عمليات سير عمل مبتكرة بمساعدة الذكاء الاصطناعي</p></li>
<li><p>الملاحظات وتقارير الأخطاء وأفكار التصميم</p></li>
</ul>
<p>اعثر علينا هنا:</p>
<ul>
<li><p><a href="https://github.com/zilliztech/code-context">سياق البرمجة على GitHub</a> | <a href="https://www.npmjs.com/package/@zilliz/code-context-mcp"><strong>حزمة MCP npm</strong></a> | <a href="https://marketplace.visualstudio.com/items?itemName=zilliz.semanticcodesearch"><strong>سوق VSCode</strong></a></p></li>
<li><p><a href="https://discuss.milvus.io/">Discord</a> | <a href="https://www.linkedin.com/company/the-milvus-project/">LinkedIn</a> | <a href="https://x.com/zilliz_universe">X</a> | <a href="https://www.youtube.com/@MilvusVectorDatabase/featured">YouTube</a></p></li>
</ul>
<p>معاً، يمكننا بناء البنية التحتية للجيل القادم من أدوات تطوير الذكاء الاصطناعي - شفافة وقوية وتضع المطور أولاً.</p>
<p><a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour">
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/office_hour_83d4623510.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</a></p>
