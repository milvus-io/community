---
id: >-
  hands-on-tutorial-build-your-own-coding-copilot-with-qwen3-coder-qwen-code-and-code-context.md
title: >-
  برنامج تعليمي عملي: أنشئ برنامجك التجريبي للبرمجة باستخدام Qwen3-Coder و Qwen
  Code و Code Context
author: Lumina Wang
date: 2025-07-29T00:00:00.000Z
desc: >-
  تعلّم كيفية إنشاء مساعد الترميز بالذكاء الاصطناعي الخاص بك باستخدام
  Qwen3-Coder و Qwen Code CLI والمكوِّن الإضافي Code Context لفهم الكود الدلالي
  العميق.
cover: assets.zilliz.com/_9dfadf5877.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Qwen3 Code, Qwen3, Cursor, Code Context, Code Search'
meta_title: |
  Build a Coding Copilot with Qwen3-Coder & Code Context
origin: >-
  https://milvus.io/blog/hands-on-tutorial-build-your-own-coding-copilot-with-qwen3-coder-qwen-code-and-code-context.md
---
<p>تشتعل ساحة معركة مساعد الترميز بالذكاء الاصطناعي بسرعة. لقد رأينا <a href="https://milvus.io/blog/claude-code-vs-gemini-cli-which-ones-the-real-dev-co-pilot.md#Claude-Code-or-Gemini-CLI-Choose-Your-Co-Pilot-Wisely">كلود كود</a> من شركة أنثروبيك يُحدث موجات، <a href="https://milvus.io/blog/claude-code-vs-gemini-cli-which-ones-the-real-dev-co-pilot.md#Claude-Code-or-Gemini-CLI-Choose-Your-Co-Pilot-Wisely">وGemini CLI</a> من جوجل يُحدث تغييراً في سير العمل في المحطات، وOpenAI's Codex من OpenAI الذي يعمل على تشغيل GitHub Copilot، وCursoror الذي يكسب مستخدمي VS Code، <strong>والآن تدخل Alibaba Cloud مع Qwen Code.</strong></p>
<p>بصراحة، هذه أخبار رائعة للمطورين. فالمزيد من اللاعبين يعني أدوات أفضل، وميزات مبتكرة، والأهم من ذلك، <strong>بدائل مفتوحة المصدر</strong> للحلول المملوكة المكلفة. دعونا نتعرف على ما يجلبه هذا اللاعب الأخير إلى الطاولة.</p>
<h2 id="Meet-Qwen3-Coder-and-Qwen-Code" class="common-anchor-header">تعرف على Qwen3-Coder و Qwen Code<button data-href="#Meet-Qwen3-Coder-and-Qwen-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>أصدرت Alibaba Cloud مؤخرًا<a href="https://github.com/QwenLM/Qwen3-Coder"> <strong>Qwen3-Coder،</strong></a> وهو نموذج ترميز عميل مفتوح المصدر يحقق أحدث النتائج عبر معايير متعددة. كما أطلقت الشركة أيضًا<a href="https://github.com/QwenLM/qwen-code"> <strong>Qwen Code</strong></a>، وهي أداة برمجة ذكاء اصطناعي مفتوحة المصدر لترميز الذكاء الاصطناعي CLI مبنية على Gemini CLI ولكنها معززة بمحللات متخصصة لـ Qwen3-Coder.</p>
<p>ويوفر النموذج الرئيسي، <strong>Qwen3-Coder-480B-A35B-Instruct،</strong> قدرات مذهلة: دعم أصلي لـ 358 لغة برمجة ونافذة سياق 256 ألف رمز (قابلة للتوسيع إلى 1 مليون رمز عبر YaRN)، وتكامل سلس مع Claude Code وCline ومساعدات الترميز الأخرى.</p>
<h2 id="The-Universal-Blind-Spot-in-Modern-AI-Coding-Copilots" class="common-anchor-header">النقطة العمياء العالمية في مساعدي الترميز بالذكاء الاصطناعي الحديثين<button data-href="#The-Universal-Blind-Spot-in-Modern-AI-Coding-Copilots" class="anchor-icon" translate="no">
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
    </button></h2><p>على الرغم من قوة Qwen3-Coder، إلا أنني مهتم أكثر بمساعد الترميز الخاص به: <strong>كوين كود</strong>. إليك ما وجدته مثيراً للاهتمام. على الرغم من كل الابتكار، يشترك Qwen Code في نفس القيد الذي يشترك فيه كل من Claude Code و Gemini CLI: <strong><em>إنهما رائعان في توليد أكواد برمجية جديدة ولكنهما يعانيان في فهم قواعد الأكواد الموجودة.</em></strong></p>
<p>خذ هذا المثال: أنت تطلب من Gemini CLI أو Qwen Code "العثور على المكان الذي يتعامل فيه هذا المشروع مع مصادقة المستخدم". تبدأ الأداة في البحث عن الكلمات الرئيسية الواضحة مثل "تسجيل الدخول" أو "كلمة المرور" ولكنها تغفل تمامًا عن وظيفة <code translate="no">verifyCredentials()</code> المهمة. ما لم تكن على استعداد لحرق الرموز من خلال تغذية قاعدة التعليمات البرمجية بأكملها كسياق - وهو أمر مكلف ويستغرق وقتًا طويلاً - فإن هذه الأدوات تصطدم بالحائط بسرعة كبيرة.</p>
<p><strong><em>هذه هي الفجوة الحقيقية في أدوات الذكاء الاصطناعي اليوم: الفهم الذكي لسياق التعليمات البرمجية.</em></strong></p>
<h2 id="Supercharge-Any-Coding-Copilot-with-Semantic-Code-Search" class="common-anchor-header">شحن أي برنامج ترميز تجريبي فائق مع البحث الدلالي عن التعليمات البرمجية<button data-href="#Supercharge-Any-Coding-Copilot-with-Semantic-Code-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>ماذا لو كان بإمكانك أن تمنح أي برنامج مساعد للذكاء الاصطناعي في البرمجة - سواءً كان Claude Code أو Gemini CLI أو Qwen Code - القدرة على فهم قاعدة الأكواد الخاصة بك بشكل دلالي؟ ماذا لو كان بإمكانك بناء شيء قوي مثل Cursor لمشاريعك الخاصة دون رسوم اشتراك باهظة، مع الحفاظ على التحكم الكامل في التعليمات البرمجية والبيانات الخاصة بك؟</p>
<p>حسنًا، أدخل<a href="https://github.com/zilliztech/code-context"> <strong>Code Context - وهو</strong></a>مكون إضافي مفتوح المصدر ومتوافق مع MCP يحول أي عامل ترميز للذكاء الاصطناعي إلى قوة مدركة للسياق. إنه أشبه بمنح مساعد الذكاء الاصطناعي الخاص بك الذاكرة المؤسسية لمطور كبير عمل على قاعدة التعليمات البرمجية الخاصة بك لسنوات. سواء كنت تستخدم Qwen Code، أو Claude Code، أو Gemini CLI، أو تعمل على VSCode، أو حتى الترميز على Chrome، فإن <strong>Code Context</strong> يجلب البحث الدلالي عن التعليمات البرمجية إلى سير عملك.</p>
<p>هل أنت مستعد لرؤية كيف يعمل هذا؟ دعنا ننشئ برنامجًا تجريبيًا للبرمجة بالذكاء الاصطناعي على مستوى المؤسسات باستخدام <strong>Qwen3-Coder + Qwen Code + Code Context</strong>.</p>
<h2 id="Hands-On-Tutorial-Building-Your-Own-AI-Coding-Copilot" class="common-anchor-header">برنامج تعليمي عملي: بناء طيار مساعد الترميز بالذكاء الاصطناعي الخاص بك<button data-href="#Hands-On-Tutorial-Building-Your-Own-AI-Coding-Copilot" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Prerequisites" class="common-anchor-header">المتطلبات الأساسية</h3><p>قبل أن نبدأ، تأكد من أن لديك</p>
<ul>
<li><p><strong>Node.js 20+</strong> مثبتًا</p></li>
<li><p><strong>مفتاح OpenAI API</strong><a href="https://openai.com/index/openai-api/">(احصل على واحد من هنا</a>)</p></li>
<li><p><strong>حساب علي بابا كلاود</strong> للوصول إلى Qwen3-Coder<a href="https://www.alibabacloud.com/en">(احصل على واحد هنا</a>)</p></li>
<li><p><strong>حساب زيليز كلاود</strong> لقاعدة بيانات المتجهات<a href="https://cloud.zilliz.com/login">(سجل هنا</a> مجانًا إذا لم يكن لديك حساب بعد)</p></li>
</ul>
<p><strong>ملاحظات: 1)</strong> في هذا البرنامج التعليمي، سنستخدم Qwen3-Coder-Plus، النسخة التجارية من Qwen3-Coder، نظرًا لقدراته القوية في البرمجة وسهولة استخدامه. إذا كنت تفضل خياراً مفتوح المصدر، يمكنك استخدام Qwen3-coder-480b-a35b-instruct بدلاً من ذلك. 2) بينما يوفر Qwen3-Coder-Plus أداءً ممتازًا وسهولة في الاستخدام، إلا أنه يأتي مع استهلاك عالٍ للرموز. تأكد من مراعاة ذلك في خطط ميزانية مؤسستك.</p>
<h3 id="Step-1-Environment-Setup" class="common-anchor-header">الخطوة 1: إعداد البيئة</h3><p>تحقق من تثبيت Node.js الخاص بك:</p>
<pre><code translate="no">curl -qL <span class="hljs-attr">https</span>:<span class="hljs-comment">//www.npmjs.com/install.sh | sh</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Install-Qwen-Code" class="common-anchor-header">الخطوة 2: تثبيت كود كوين</h3><pre><code translate="no">npm install -g <span class="hljs-meta">@qwen</span>-code/qwen-code
qwen --version
<button class="copy-code-btn"></button></code></pre>
<p>إذا رأيت رقم الإصدار كما هو موضح أدناه، فهذا يعني أن التثبيت كان ناجحًا.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_0d5ebc152e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-Configure-Qwen-Code" class="common-anchor-header">الخطوة 3: تكوين كود كوين</h3><p>انتقل إلى دليل مشروعك وقم بتهيئة كود كوين.</p>
<pre><code translate="no">Qwen
<button class="copy-code-btn"></button></code></pre>
<p>بعد ذلك، سترى صفحة مثل أدناه.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_e6598ea982.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>متطلبات تكوين واجهة برمجة التطبيقات:</strong></p>
<ul>
<li><p>مفتاح واجهة برمجة التطبيقات: الحصول عليه من<a href="https://modelstudio.console.alibabacloud.com/"> استوديو نموذج علي بابا السحابي</a></p></li>
<li><p>عنوان URL الأساسي: <code translate="no">https://dashscope.aliyuncs.com/compatible-mode/v1</code></p></li>
<li><p>اختيار النموذج:</p>
<ul>
<li><p><code translate="no">qwen3-coder-plus</code> (الإصدار التجاري، الأكثر قدرة)</p></li>
<li><p><code translate="no">qwen3-coder-480b-a35b-instruct</code> (الإصدار مفتوح المصدر)</p></li>
</ul></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_5ed0c54084.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>بعد التهيئة، اضغط على <strong>Enter</strong> للمتابعة.</p>
<h3 id="Step-4-Test-Basic-Functionality" class="common-anchor-header">الخطوة 4: اختبار الوظائف الأساسية</h3><p>دعنا نتحقق من إعدادك باختبارين عمليين:</p>
<p><strong>الاختبار 1: فهم الكود</strong></p>
<p>موجه: "لخص بنية هذا المشروع ومكوناته الرئيسية في جملة واحدة."</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_41e601fc82.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>أجاد كوين3-مبرمج-بلس في التلخيص - واصفًا المشروع بأنه برنامج تعليمي تقني مبني على ميلفوس، مع التركيز على أنظمة RAG واستراتيجيات الاسترجاع وغيرها.</p>
<p><strong>الاختبار 2: توليد التعليمات البرمجية</strong></p>
<p>موجه: "يرجى إنشاء لعبة صغيرة من تتريس"</p>
<p>في أقل من دقيقة، يقوم Qwen3-coder-plus:</p>
<ul>
<li><p>يقوم بتثبيت المكتبات المطلوبة بشكل مستقل</p></li>
<li><p>يبني منطق اللعبة</p></li>
<li><p>ينشئ تطبيقًا كاملاً وقابلاً للتشغيل</p></li>
<li><p>يتعامل مع كل التعقيدات التي عادةً ما تقضي ساعات في البحث عنها</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/6_c67e1725eb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/7_fd91d5a290.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>هذا يعرض تطويرًا مستقلًا حقيقيًا - ليس فقط إكمال التعليمات البرمجية، ولكن اتخاذ القرارات المعمارية وتقديم الحل الكامل.</p>
<h3 id="Step-5-Set-Up-Your-Vector-Database" class="common-anchor-header">الخطوة 5: إعداد قاعدة بيانات المتجهات</h3><p>سنستخدم <a href="https://zilliz.com/cloud">Zilliz Cloud</a> كقاعدة بيانات المتجهات في هذا البرنامج التعليمي.</p>
<p><strong>قم بإنشاء مجموعة زيليز:</strong></p>
<ol>
<li><p>قم بتسجيل الدخول إلى<a href="https://cloud.zilliz.com/"> وحدة تحكم Zilliz Cloud</a></p></li>
<li><p>قم بإنشاء مجموعة جديدة</p></li>
<li><p>انسخ <strong>نقطة النهاية العامة</strong> <strong>والرمز المميز</strong></p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/8_5e692e6e80.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/9_753f281055.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-6-Configure-Code-Context-Integration" class="common-anchor-header">الخطوة 6: تكوين تكامل سياق التعليمات البرمجية</h3><p>إنشاء <code translate="no">~/.qwen/settings.json</code>:</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;code-context&quot;</span>: {
      <span class="hljs-string">&quot;command&quot;</span>: <span class="hljs-string">&quot;npx&quot;</span>,
      <span class="hljs-string">&quot;args&quot;</span>: [<span class="hljs-string">&quot;@zilliz/code-context-mcp@latest&quot;</span>],
      <span class="hljs-string">&quot;env&quot;</span>: {
        <span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>: <span class="hljs-string">&quot;sk-xxxxxxxxxx&quot;</span>,
        <span class="hljs-string">&quot;MILVUS_ADDRESS&quot;</span>: <span class="hljs-string">&quot;https://in03-xxxx.cloud.zilliz.com&quot;</span>,
        <span class="hljs-string">&quot;MILVUS_TOKEN&quot;</span>: <span class="hljs-string">&quot;4f699xxxxx&quot;</span>
      },
      <span class="hljs-string">&quot;cwd&quot;</span>: <span class="hljs-string">&quot;./server-directory&quot;</span>,
      <span class="hljs-string">&quot;timeout&quot;</span>: <span class="hljs-number">30000</span>,
      <span class="hljs-string">&quot;trust&quot;</span>: <span class="hljs-literal">false</span>
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-7-Activate-Enhanced-Capabilities" class="common-anchor-header">الخطوة 7: تفعيل القدرات المحسّنة</h3><p>أعد تشغيل كوين كود:</p>
<pre><code translate="no">Qwen
<button class="copy-code-btn"></button></code></pre>
<p>اضغط على <strong>Ctrl + T</strong> لرؤية ثلاث أدوات جديدة داخل خادم MCP الخاص بنا:</p>
<ul>
<li><p><code translate="no">index-codebase</code>: إنشاء فهارس دلالية لفهم المستودع</p></li>
<li><p><code translate="no">search-code</code>: البحث عن التعليمات البرمجية بلغة طبيعية عبر قاعدة التعليمات البرمجية الخاصة بك</p></li>
<li><p><code translate="no">clear-index</code>: يعيد تعيين الفهارس عند الحاجة.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/10_bebbb44460.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-8-Test-the-Complete-Integration" class="common-anchor-header">الخطوة 8: اختبار التكامل الكامل</h3><p>إليك مثال حقيقي: في أحد المشاريع الكبيرة، قمنا بمراجعة أسماء التعليمات البرمجية ووجدنا أن "النافذة الأوسع" تبدو غير احترافية، لذا قررنا تغييرها.</p>
<p>موجه: "ابحث عن جميع الدوال المتعلقة بـ 'النافذة الأوسع' التي تحتاج إلى إعادة تسمية احترافية."</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/11_c54398c4f2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>كما هو موضح في الشكل أدناه، استدعى qwen3-coder-plus أولاً الأداة <code translate="no">index_codebase</code> لإنشاء فهرس للمشروع بأكمله.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/12_25a7f3a039.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>بعد ذلك، أنشأت الأداة <code translate="no">index_codebase</code> فهارس لـ 539 ملفًا في هذا المشروع، وقسمتها إلى 9,991 جزءًا. بعد إنشاء الفهرس مباشرة، استدعت الأداة <code translate="no">search_code</code>لإجراء الاستعلام.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/13_6766663346.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>بعد ذلك، أبلغتنا الأداة أنها عثرت على الملفات المقابلة التي تحتاج إلى تعديل.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/14_7b3c7e9cc0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>وأخيراً، اكتشفت 4 مشكلات باستخدام سياق التعليمات البرمجية، بما في ذلك الدوال والواردات وبعض التسميات في الوثائق، مما ساعدنا على إكمال هذه المهمة الصغيرة.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/15_a529905b28.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>مع إضافة سياق التعليمات البرمجية، يقدم <code translate="no">qwen3-coder-plus</code> الآن بحثاً أكثر ذكاءً عن التعليمات البرمجية وفهماً أفضل لبيئات الترميز.</p>
<h3 id="What-Youve-Built" class="common-anchor-header">ما قمت ببنائه</h3><p>أصبح لديك الآن مساعد ترميز متكامل للذكاء الاصطناعي يجمع بين:</p>
<ul>
<li><p><strong>Qwen3-Coder</strong>: توليد الكود الذكي والتطوير المستقل</p></li>
<li><p><strong>سياق الكود</strong>: الفهم الدلالي لقواعد البرمجة الحالية</p></li>
<li><p><strong>توافق عالمي</strong>: يعمل مع Claude Code، و Gemini CLI، و VSCode، والمزيد</p></li>
</ul>
<p>هذا ليس مجرد تطوير أسرع - إنه يتيح أساليب جديدة تمامًا لتحديث الإرث والتعاون بين الفرق والتطور المعماري.</p>
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
    </button></h2><p>بصفتي مطورًا، جربت الكثير من أدوات ترميز الذكاء الاصطناعي - من Claude Code إلى Cursor و Gemini CLI، و Qwen Code - وعلى الرغم من أنها رائعة في إنشاء شيفرة جديدة، إلا أنها عادةً ما تفشل عندما يتعلق الأمر بفهم قواعد الشيفرات الحالية. هذه هي نقطة الألم الحقيقية: ليس كتابة الدوال من الصفر، بل التنقل في الشيفرة البرمجية المعقدة والفوضوية والإرثية، ومعرفة <em>سبب</em> القيام بالأشياء بطريقة معينة.</p>
<p>هذا ما يجعل هذا الإعداد مع <strong>Qwen3-Coder + Qwen Code + سياق الكود</strong> مقنعًا للغاية. يمكنك الحصول على أفضل ما في العالمين: نموذج ترميز قوي يمكنه إنشاء تطبيقات كاملة الميزات <em>وطبقة</em> بحث دلالية تفهم بالفعل تاريخ مشروعك وهيكله واصطلاحات التسمية.</p>
<p>مع البحث المتجه والنظام البيئي للمكونات الإضافية MCP، لن تكون عالقًا في لصق ملفات عشوائية في نافذة المطالبة أو التمرير عبر الريبو الخاص بك في محاولة للعثور على السياق الصحيح. ما عليك سوى أن تسأل بلغة واضحة، وسيعثر لك على الملفات أو الوظائف أو القرارات ذات الصلة - مثل وجود مطور كبير يتذكر كل شيء.</p>
<p>لنكون واضحين، هذا النهج ليس فقط أسرع - إنه في الواقع يغير طريقة عملك. إنها خطوة نحو نوع جديد من سير عمل التطوير حيث لا يكون الذكاء الاصطناعي مجرد مساعد في الترميز، بل مساعداً هندسياً، وزميلاً في الفريق يفهم سياق المشروع بأكمله.</p>
<p><em>ومع ذلك... تحذير عادل: إن Qwen3-Coder-Plus مدهش، ولكنه متعطش جداً للرموز. مجرد بناء هذا النموذج الأولي استهلك 20 مليون توكن. لذا نعم-أنا الآن رسميًا خارج نطاق الاعتمادات 😅</em></p>
<p>__</p>
