---
id: we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md
title: لقد استخرجنا نظام ذاكرة OpenClaw وقمنا بفتح مصادره (memsearch)
author: Cheney Zhang
date: 2026-02-13T00:00:00.000Z
cover: assets.zilliz.com/memsearch_openclaw_memory_11zon_b2a6b4cbb9.jpg
tag: Engineering
recommend: true
publishToMedium: true
tags: 'OpenClaw, AI agent memory, vector search, Milvus'
meta_keywords: >-
  OpenClaw, AI agent memory, persistent memory, Python, vector search, Milvus,
  memsearch
meta_title: |
  We Extracted OpenClaw’s Memory System and Open-Sourced It (memsearch)
desc: >-
  لقد استخرجنا بنية ذاكرة OpenClaw للذكاء الاصطناعي في مكتبة memsearch - وهي
  مكتبة بايثون مستقلة مع سجلات Markdown، وبحث متجه هجين، ودعم Git.
origin: >-
  https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md
---
<p>ينتشر<a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw</a> (clawdbot و moltbot سابقًا) انتشارًا هائلاً - <a href="https://github.com/openclaw/openclaw">أكثر من 189 ألف نجمة على GitHub</a> في أقل من أسبوعين. هذا جنون. تدور معظم هذه الضجة حول قدراته المستقلة والوكيلة عبر قنوات الدردشة اليومية، بما في ذلك iMessages وواتساب وسلاك وتيليجرام وغيرها.</p>
<p>ولكن بصفتنا مهندسين نعمل على نظام قاعدة بيانات متجهة، فإن ما لفت انتباهنا حقًا هو <strong>نهج OpenClaw في الذاكرة طويلة المدى</strong>. فعلى عكس معظم أنظمة الذاكرة الموجودة، فإن OpenClaw يجعل الذكاء الاصطناعي الخاص به يكتب تلقائياً سجلات يومية كملفات Markdown. هذه الملفات هي مصدر الحقيقة، والنموذج "يتذكر" فقط ما تتم كتابته على القرص. يمكن للمطورين البشريين فتح ملفات التخفيض تلك، وتحريرها مباشرة، واستخلاص المبادئ طويلة المدى، ورؤية ما يتذكره الذكاء الاصطناعي بالضبط في أي وقت. لا توجد صناديق سوداء. بصراحة، إنها واحدة من أنظف بنيات الذاكرة التي رأيناها وأكثرها ملاءمة للمطورين.</p>
<p>لذلك بطبيعة الحال، كان لدينا سؤال: <strong><em>لماذا يجب أن يعمل هذا فقط داخل OpenClaw؟ ماذا لو كان بإمكان أي وكيل الحصول على ذاكرة كهذه؟</em></strong> لقد أخذنا بنية الذاكرة الدقيقة من OpenClaw وقمنا ببناء <a href="https://github.com/zilliztech/memsearch">memsearch</a> - مكتبة ذاكرة طويلة الأجل مستقلة وقابلة للتوصيل والتشغيل تمنح أي وكيل ذاكرة ثابتة وشفافة وقابلة للتحرير البشري. لا تعتمد على بقية OpenClaw. ما عليك سوى إسقاطها، وسيحصل وكيلك على ذاكرة دائمة مع بحث مدعوم من Milvus/Zilliz Cloud، بالإضافة إلى سجلات Markdown كمصدر أساسي للحقيقة.</p>
<iframe width="997" height="561" src="https://www.youtube.com/embed/VRzqRVFm39s" title="MemSearch: OpenClaw's long-term memory" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<ul>
<li><p><strong>GitHub Repo:</strong> <a href="https://github.com/zilliztech/memsearch">github.com/zilliztech/memsearch</a> (مفتوح المصدر، رخصة MIT)</p></li>
<li><p><strong>التوثيق:</strong> <a href="https://zilliztech.github.io/memsearch/">https://zilliztech.github.io/memsearch/</a></p></li>
<li><p><strong>ملحق كود كلود:</strong> <a href="https://zilliztech.github.io/memsearch/claude-plugin/">https://zilliztech.github.io/memsearch/claude-plugin/</a></p></li>
</ul>
<h2 id="What-Makes-OpenClaws-Memory-Different" class="common-anchor-header">ما الذي يجعل ذاكرة OpenClaw مختلفة<button data-href="#What-Makes-OpenClaws-Memory-Different" class="anchor-icon" translate="no">
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
    </button></h2><p>قبل الغوص في بنية ذاكرة OpenClaw، دعنا نوضح مفهومين: <strong>السياق</strong> <strong>والذاكرة</strong>. يبدو أنهما متشابهان ولكنهما يعملان بشكل مختلف تمامًا في الممارسة العملية.</p>
<ul>
<li><p><strong>السياق</strong> هو كل شيء يراه الوكيل في طلب واحد - مطالبات النظام، وملفات التوجيه على مستوى المشروع مثل <code translate="no">AGENTS.md</code> و <code translate="no">SOUL.md</code> ، وسجل المحادثة (الرسائل، ومكالمات الأدوات، والملخصات المضغوطة)، ورسالة المستخدم الحالية. وهي محددة النطاق لجلسة واحدة ومضغوطة نسبيًا.</p></li>
<li><p><strong>الذاكرة</strong> هي ما يستمر عبر الجلسات. وهي تعيش على القرص المحلي - السجل الكامل للمحادثات السابقة والملفات التي عمل عليها الوكيل وتفضيلات المستخدم. غير ملخص. غير مضغوطة. الأشياء الخام.</p></li>
</ul>
<p>الآن إليك قرار التصميم الذي يجعل نهج OpenClaw مميزًا: <strong>يتم تخزين كل الذاكرة كملفات Markdown عادية على نظام الملفات المحلي.</strong> بعد كل جلسة، يكتب الذكاء الاصطناعي التحديثات إلى سجلات Markdown هذه تلقائيًا. يمكنك - وأي مطور - فتحها وتحريرها وإعادة تنظيمها أو حذفها أو تنقيحها. وفي الوقت نفسه، تجلس قاعدة بيانات المتجهات جنبًا إلى جنب مع هذا النظام، حيث تقوم بإنشاء فهرس لاسترجاعها والحفاظ عليه. كلما تغير ملف Markdown، يكتشف النظام التغيير ويعيد فهرسته تلقائيًا.</p>
<p>إذا كنت قد استخدمت أدوات مثل Mem0 أو Zep، فستلاحظ الفرق على الفور. تخزن تلك الأنظمة الذكريات على شكل تضمينات - هذه هي النسخة الوحيدة. لا يمكنك قراءة ما يتذكره وكيلك. لا يمكنك إصلاح ذاكرة سيئة عن طريق تحرير صف. يمنحك نهج OpenClaw كلا الأمرين: شفافية الملفات العادية وقوة استرجاع البحث المتجه باستخدام قاعدة بيانات متجهة. يمكنك قراءتها، <code translate="no">git diff</code> ، ، استرجاعها - إنها مجرد ملفات.</p>
<p>الجانب السلبي الوحيد؟ في الوقت الحالي يرتبط نظام الذاكرة الذي يعتمد على Markdown أولًا بشكل وثيق مع نظام OpenClaw البيئي الكامل - عملية البوابة، وموصلات النظام الأساسي، وتكوين مساحة العمل، والبنية التحتية للمراسلة. إذا كنت تريد فقط نموذج الذاكرة، فهذا يتطلب الكثير من الآلات لسحبها.</p>
<p>ولهذا السبب بالضبط قمنا ببناء <a href="http://github.com/zilliztech/memsearch"><strong>Memsearch</strong></a>: نفس الفلسفة - التخفيض كمصدر للحقيقة، الفهرسة التلقائية للمتجهات، قابلة للتحرير البشري بالكامل - ولكن يتم تقديمها كمكتبة خفيفة الوزن ومستقلة يمكنك إسقاطها في أي بنية عميلة.</p>
<h2 id="How-Memsearch-Works" class="common-anchor-header">كيف يعمل Memsearch<button data-href="#How-Memsearch-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>كما ذكرنا سابقًا، <a href="https://github.com/zilliztech/memsearch">memsearch</a> هي مكتبة ذاكرة طويلة الأجل مستقلة تمامًا تنفذ نفس بنية الذاكرة المستخدمة في OpenClaw - دون جلب بقية مكدس OpenClaw. يمكنك توصيلها بأي إطار عمل وكيل (Claude و GPT و Llama والوكلاء المخصصين ومحركات سير العمل) ومنح نظامك على الفور ذاكرة ثابتة وشفافة وقابلة للتحرير البشري.</p>
<p>يتم تخزين كل ذاكرة الوكيل في memsearch كنص عادي Markdown في دليل محلي. البنية بسيطة عن قصد حتى يتمكن المطورون من فهمها في لمحة:</p>
<pre><code translate="no">~/your-project/
└── memory/
    ├── MEMORY.md              <span class="hljs-comment"># Hand-written long-term memory</span>
    ├── 2026-02-09.md          <span class="hljs-comment"># Today&#x27;s work log</span>
    ├── 2026-02-08.md
    └── 2026-02-07.md
<button class="copy-code-btn"></button></code></pre>
<p>يستخدم Memsearch <a href="https://milvus.io/"><strong>Milvus</strong></a> كقاعدة بيانات متجهة لفهرسة ملفات Markdown هذه لاسترجاع دلالي سريع. لكن الأهم من ذلك أن فهرس المتجه <em>ليس</em> مصدر الحقيقة، بل الملفات هي مصدر الحقيقة. إذا حذفت فهرس Milvus بالكامل، <strong>فلن تخسر شيئًا.</strong> يقوم Memsearch ببساطة بإعادة تضمين ملفات Markdown وإعادة فهرستها وإعادة بناء طبقة الاسترجاع الكاملة في بضع دقائق. وهذا يعني أن ذاكرة وكيلك شفافة ودائمة وقابلة لإعادة البناء بالكامل.</p>
<p>فيما يلي القدرات الأساسية لـ memsearch:</p>
<h3 id="Readable-Markdown-Makes-Debugging-as-Simple-as-Editing-a-File" class="common-anchor-header">يجعل Markdown القابل للقراءة تصحيح الأخطاء بسيطًا مثل تحرير ملف</h3><p>عادةً ما يكون تصحيح أخطاء ذاكرة الذكاء الاصطناعي مؤلمًا. عندما ينتج الوكيل إجابة خاطئة، فإن معظم أنظمة الذاكرة لا تعطيك أي طريقة واضحة لمعرفة <em>ما</em> قام بتخزينه بالفعل. يتمثل سير العمل النموذجي في كتابة كود مخصص للاستعلام عن واجهة برمجة تطبيقات الذاكرة، ثم غربلة التضمينات المبهمة أو فقاعات JSON المطولة - ولا يخبرك أي منهما بالكثير عن الحالة الداخلية الحقيقية للذكاء الاصطناعي.</p>
<p><strong>يقضي memsearch على هذه الفئة الكاملة من المشاكل.</strong> تعيش جميع الذكريات في مجلد الذاكرة/المجلد كمجلد Markdown عادي:</p>
<pre><code translate="no" class="language-markdown"><span class="hljs-meta">## Morning</span>
- Fixed N+<span class="hljs-number">1</span> query issue — <span class="hljs-function">switched to <span class="hljs-title">selectinload</span>()
- Query count dropped <span class="hljs-keyword">from</span> 152 to 3
</span><button class="copy-code-btn"></button></code></pre>
<p>إذا أخطأ الذكاء الاصطناعي في شيء ما، فإن إصلاحه بسيط مثل تحرير الملف. قم بتحديث الإدخال، واحفظ، وسيقوم ميمسارش بإعادة فهرسة التغيير تلقائيًا. خمس ثوانٍ. لا استدعاءات لواجهة برمجة التطبيقات. لا أدوات. لا يوجد غموض. يمكنك تصحيح أخطاء ذاكرة الذكاء الاصطناعي بنفس الطريقة التي تصحح بها الوثائق - من خلال تحرير ملف.</p>
<h3 id="Git-Backed-Memory-Means-Teams-Can-Track-Review-and-Roll-Back-Changes" class="common-anchor-header">تعني الذاكرة المدعومة من Git أنه يمكن للفرق تتبع التغييرات ومراجعتها واسترجاعها</h3><p>يصعب التعاون في ذاكرة الذكاء الاصطناعي التي تعيش في قاعدة بيانات. إن معرفة من قام بتغيير ماذا ومتى يعني البحث في سجلات التدقيق، والعديد من الحلول لا توفر هذه السجلات. تحدث التغييرات بصمت، والخلافات حول ما يجب أن يتذكره الذكاء الاصطناعي ليس لها مسار حل واضح. ينتهي الأمر بالفرق بالاعتماد على رسائل سلاك والافتراضات.</p>
<p>يعمل Memsearch على إصلاح هذه المشكلة من خلال جعل الذاكرة مجرد ملفات Markdown - مما يعني أن <strong>Git يتعامل مع الإصدار تلقائيًا</strong>. أمر واحد يعرض التاريخ بأكمله:</p>
<pre><code translate="no" class="language-bash">git <span class="hljs-built_in">log</span> memory/MEMORY.md
git diff HEAD~1 memory/2026-02-09.md
<button class="copy-code-btn"></button></code></pre>
<p>الآن تشارك ذاكرة الذكاء الاصطناعي في نفس سير العمل مثل التعليمات البرمجية. تظهر جميع القرارات المتعلقة بالبنية وتحديثات التكوين وتغييرات التفضيلات في الاختلافات التي يمكن لأي شخص التعليق عليها أو الموافقة عليها أو التراجع عنها:</p>
<pre><code translate="no" class="language-diff">+ <span class="hljs-meta">## Architecture Decision</span>
+ - Use Kafka <span class="hljs-keyword">for</span> <span class="hljs-keyword">event</span> bus instead of RabbitMQ
+ - Reason: better horizontal scaling
<button class="copy-code-btn"></button></code></pre>
<h3 id="Plaintext-Memory-Makes-Migration-Nearly-Effortless" class="common-anchor-header">ذاكرة النص العادي تجعل عملية الترحيل شبه سهلة</h3><p>الترحيل هو أحد أكبر التكاليف الخفية لأطر الذاكرة. فالانتقال من أداة إلى أخرى يعني عادةً تصدير البيانات، وتحويل التنسيقات، وإعادة الاستيراد، والأمل في أن تكون الحقول متوافقة. هذا النوع من العمل يمكن أن يستغرق نصف يوم بسهولة، والنتيجة غير مضمونة أبدًا.</p>
<p>يتجنب memsearch هذه المشكلة تمامًا لأن الذاكرة عبارة عن نص عادي Markdown. لا يوجد تنسيق خاص، ولا يوجد مخطط لترجمته، ولا شيء لترحيله:</p>
<ul>
<li><p><strong>تبديل الأجهزة:</strong> <code translate="no">rsync</code> مجلد الذاكرة. تم.</p></li>
<li><p><strong>تبديل نماذج التضمين:</strong> أعد تشغيل أمر الفهرس. سيستغرق الأمر خمس دقائق، وستبقى ملفات التضمين دون تغيير.</p></li>
<li><p><strong>تبديل نشر قاعدة بيانات المتجهات:</strong> تغيير قيمة تكوين واحدة. على سبيل المثال، الانتقال من ميلفوس لايت في التطوير إلى زيليز كلاود في الإنتاج:</p></li>
</ul>
<pre><code translate="no" class="language-python"><span class="hljs-meta"># Development</span>
ms = MemSearch(milvus_uri=<span class="hljs-string">&quot;~/.memsearch/milvus.db&quot;</span>)

<span class="hljs-meta"># Production (change only this <span class="hljs-keyword">line</span>)</span>
ms = MemSearch(milvus_uri=<span class="hljs-string">&quot;https://xxx.zillizcloud.com&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>تظل ملفات الذاكرة الخاصة بك كما هي تمامًا. يمكن للبنية التحتية المحيطة بها أن تتطور بحرية. والنتيجة هي قابلية النقل على المدى الطويل - وهي خاصية نادرة في أنظمة الذكاء الاصطناعي.</p>
<h3 id="Shared-Markdown-Files-Let-Humans-and-Agents-Co-Author-Memory" class="common-anchor-header">تسمح ملفات التخفيضات المشتركة للبشر والوكلاء بالمشاركة في تأليف الذاكرة</h3><p>في معظم حلول الذاكرة، يتطلب تحرير ما يتذكره الذكاء الاصطناعي كتابة كود برمجي مقابل واجهة برمجة التطبيقات. وهذا يعني أن المطورين فقط هم من يستطيعون الحفاظ على ذاكرة الذكاء الاصطناعي، وحتى بالنسبة لهم، فإن الأمر مرهق.</p>
<p>تتيح Memsearch تقسيمًا أكثر طبيعية للمسؤولية:</p>
<ul>
<li><p><strong>يتعامل الذكاء الاصطناعي مع</strong> السجلات اليومية التلقائية (<code translate="no">YYYY-MM-DD.md</code>) مع تفاصيل التنفيذ مثل "تم نشر الإصدار 2.3.1، تحسن الأداء بنسبة 12%".</p></li>
<li><p><strong>يتعامل البشر مع:</strong> المبادئ طويلة المدى في <code translate="no">MEMORY.md</code> ، مثل "مكدس الفريق: Python + FastAPI + PostgreSQL."</p></li>
</ul>
<p>يقوم كلا الجانبين بتحرير ملفات Markdown نفسها باستخدام الأدوات التي يستخدمونها بالفعل. لا توجد استدعاءات لواجهة برمجة التطبيقات، ولا أدوات خاصة، ولا حارس بوابة. عندما تكون الذاكرة مقفلة داخل قاعدة بيانات، فإن هذا النوع من التأليف المشترك غير ممكن. memsearch يجعلها memsearch هي الافتراضية.</p>
<h2 id="Under-the-Hood-memsearch-Runs-on-Four-Workflows-That-Keep-Memory-Fast-Fresh-and-Lean" class="common-anchor-header">تحت الغطاء: يعمل memsearch على أربعة تدفقات عمل أساسية تحافظ على الذاكرة سريعة وجديدة وخفيفة الوزن<button data-href="#Under-the-Hood-memsearch-Runs-on-Four-Workflows-That-Keep-Memory-Fast-Fresh-and-Lean" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ms1_c855cb19a5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>يحتوي memsearch على أربعة تدفقات عمل أساسية: <strong>المشاهدة</strong> (المراقبة) ← <strong>الفهرسة</strong> (التجميع والتضمين) ← <strong>البحث</strong> (الاسترجاع) ← <strong>الدمج</strong> (التلخيص). إليك ما يفعله كل واحد منها.</p>
<h3 id="1-Watch-Automatically-Re-Index-on-Every-File-Save" class="common-anchor-header">1. شاهد: إعادة الفهرسة تلقائيًا عند كل حفظ ملف</h3><p>يراقب سير عمل <strong>المشاهدة</strong> جميع ملفات Markdown في الذاكرة/الدليل ويقوم بتشغيل إعادة الفهرسة كلما تم تعديل ملف وحفظه. يضمن <strong>التأخير الذي يبلغ 1500 مللي ثانية</strong> اكتشاف التحديثات دون إهدار الحوسبة: إذا حدثت عمليات حفظ متعددة في تتابع سريع، يُعاد ضبط المؤقت ولا يتم تشغيله إلا عندما تستقر عمليات التحرير.</p>
<p>يتم ضبط هذا التأخير تجريبيًا:</p>
<ul>
<li><p><strong>100 مللي ثانية</strong> → حساس للغاية؛ يتم إطلاقه عند كل ضغطة مفتاح، مما يؤدي إلى حرق استدعاءات التضمين</p></li>
<li><p><strong>10 ثوانٍ</strong> → بطيء جدًا؛ يلاحظ المطورون تأخيرًا</p></li>
<li><p><strong>1500 مللي ثانية</strong> → التوازن المثالي بين الاستجابة وكفاءة الموارد</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ms2_92fdb7f1f8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>من الناحية العملية، هذا يعني أنه يمكن للمطوّر كتابة التعليمات البرمجية في نافذة وتحرير <code translate="no">MEMORY.md</code> في نافذة أخرى، وإضافة عنوان URL لمستندات واجهة برمجة التطبيقات أو تصحيح إدخال قديم. احفظ الملف، وسيلتقط استعلام الذكاء الاصطناعي التالي الذاكرة الجديدة. لا إعادة تشغيل ولا إعادة فهرسة يدوية.</p>
<h3 id="2-Index-Smart-Chunking-Deduplication-and-Version-Aware-Embeddings" class="common-anchor-header">2. الفهرس: التقطيع الذكي، وإلغاء التكرار، والتضمين المدرك للإصدار</h3><p>الفهرس هو سير العمل الحرج للأداء. وهو يتعامل مع ثلاثة أشياء: <strong>التقطيع، وإلغاء التكرار، ومعرفات القطع المدمجة.</strong></p>
<p>يقوم<strong>التقطيع</strong> بتقسيم النص على طول الحدود الدلالية - العناوين وعناوينها - بحيث يبقى المحتوى المرتبط معًا. هذا يتجنب الحالات التي يتم فيها تقسيم عبارة مثل "تهيئة ريديس" عبر القطع.</p>
<p>على سبيل المثال، هذا Markdown:</p>
<pre><code translate="no" class="language-markdown"><span class="hljs-comment">## Redis Caching</span>
We use Redis <span class="hljs-keyword">for</span> L1 cache <span class="hljs-keyword">with</span> 5<span class="hljs-built_in">min</span> TTL.
The connection pool <span class="hljs-keyword">is</span> configured <span class="hljs-keyword">with</span> <span class="hljs-built_in">max</span> <span class="hljs-number">100</span> connections.

<span class="hljs-comment">## Database</span>
PostgreSQL <span class="hljs-number">16</span> <span class="hljs-keyword">is</span> the primary database.
<button class="copy-code-btn"></button></code></pre>
<p>تصبح قطعتين:</p>
<ul>
<li><p>الجزء 1: <code translate="no">## Redis Caching\nWe use Redis for L1 cache...</code></p></li>
<li><p>القطعة 2: <code translate="no">## Database\nPostgreSQL 16 is the primary database.</code></p></li>
</ul>
<p>يستخدم<strong>إلغاء التكرار</strong> تجزئة SHA-256 لكل قطعة لتجنب تضمين نفس النص مرتين. إذا ذكرت ملفات متعددة "PostgreSQL 16"، يتم استدعاء واجهة برمجة تطبيقات التضمين مرة واحدة، وليس مرة واحدة لكل ملف. بالنسبة لحوالي 500 كيلوبايت من النص، فإن هذا يوفر حوالي <strong> 0.15 دولار في الشهر.</strong> على نطاق واسع، يصل ذلك إلى مئات الدولارات.</p>
<p>يرمز<strong>تصميم معرف القطعة</strong> كل ما يلزم لمعرفة ما إذا كانت القطعة قديمة أم لا. التنسيق هو <code translate="no">hash(source_path:start_line:end_line:content_hash:model_version)</code>. الحقل <code translate="no">model_version</code> هو الجزء المهم: عندما تتم ترقية نموذج التضمين من <code translate="no">text-embedding-3-small</code> إلى <code translate="no">text-embedding-3-large</code> ، تصبح التضمينات القديمة غير صالحة. نظرًا لأن إصدار النموذج مدمج في المعرف، فإن النظام يحدد تلقائيًا القطع التي تحتاج إلى إعادة التضمين. لا حاجة للتنظيف اليدوي.</p>
<h3 id="3-Search-Hybrid-Vector-+-BM25-Retrieval-for-Maximum-Accuracy" class="common-anchor-header">3. البحث: استرجاع المتجه الهجين + استرجاع BM25 لتحقيق أقصى قدر من الدقة</h3><p>يستخدم الاسترجاع نهج بحث هجين: بحث متجه مرجح بنسبة 70% وبحث BM25 مرجح بنسبة 30%. يوازن هذا بين حاجتين مختلفتين تنشأان بشكل متكرر في الممارسة العملية.</p>
<ul>
<li><p>يعالج<strong>البحث المتجه</strong> المطابقة الدلالية. يؤدي الاستعلام عن "تكوين ذاكرة التخزين المؤقت ل Redis" إلى إرجاع جزء يحتوي على "ذاكرة التخزين المؤقت Redis L1 مع 5 دقائق من الوقت المستغرق للتخزين المؤقت" على الرغم من اختلاف الصياغة. هذا مفيد عندما يتذكر المطور المفهوم ولكن ليس الصياغة الدقيقة.</p></li>
<li><p>يتعامل<strong>BM25</strong> مع المطابقة التامة. لا يؤدي الاستعلام عن "PostgreSQL 16" إلى إرجاع نتائج حول "PostgreSQL 15". هذا الأمر مهم بالنسبة لرموز الأخطاء وأسماء الدوال والسلوك الخاص بالإصدار، حيث لا يكون التقارب جيدًا بما فيه الكفاية.</p></li>
</ul>
<p>يعمل التقسيم الافتراضي 70/30 بشكل جيد لمعظم حالات الاستخدام. بالنسبة لمهام سير العمل التي تميل بشكل كبير نحو المطابقات التامة، فإن رفع وزن BM25 إلى 50% هو تغيير تكوين من سطر واحد.</p>
<p>يتم إرجاع النتائج على شكل أجزاء من أعلى K (افتراضيًا 3)، يتم اقتطاع كل منها إلى 200 حرف. عندما تكون هناك حاجة إلى المحتوى الكامل، يقوم <code translate="no">memsearch expand &lt;chunk_hash&gt;</code> بتحميله. هذا الإفصاح التدريجي يحافظ على استخدام نافذة سياق LLM بسيطًا دون التضحية بالوصول إلى التفاصيل.</p>
<h3 id="4-Compact-Summarize-Historical-Memory-to-Keep-Context-Clean" class="common-anchor-header">4. مدمج: تلخيص الذاكرة التاريخية للحفاظ على السياق نظيفاً</h3><p>تصبح الذاكرة المتراكمة مشكلة في نهاية المطاف. حيث تملأ الإدخالات القديمة نافذة السياق، وتزيد من تكاليف الرمز المميز، وتضيف ضوضاء تقلل من جودة الإجابة. يعالج Compact هذه المشكلة عن طريق استدعاء LLM لتلخيص الذاكرة التاريخية في شكل مكثف، ثم حذف أو أرشفة النسخ الأصلية. يمكن تشغيله يدويًا أو جدولته للتشغيل على فترات منتظمة.</p>
<h2 id="How-to-get-started-with-memsearch" class="common-anchor-header">كيف تبدأ باستخدام memsearch<button data-href="#How-to-get-started-with-memsearch" class="anchor-icon" translate="no">
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
    </button></h2><p>يوفر Memsearch كلاً من <strong>واجهة برمجة تطبيقات Python API</strong> وواجهة <strong>برمجة تطبيقات Python</strong> <strong>وواجهة برمجة تطبيقات CLI،</strong> بحيث يمكنك استخدامه داخل أطر عمل الوكيل أو كأداة تصحيح أخطاء مستقلة. الإعداد في حده الأدنى، والنظام مصمم بحيث تبدو بيئة التطوير المحلية ونشر الإنتاج متطابقة تقريبًا.</p>
<p>يدعم Memsearch ثلاث خلفيات متوافقة مع Milvus، وكلها مكشوفة من خلال <strong>نفس واجهة برمجة التطبيقات</strong>:</p>
<ul>
<li><p><a href="https://milvus.io/docs/milvus_lite.md"><strong>ميلفوس لايت (افتراضي)</strong></a><strong>:</strong> ملف <code translate="no">.db</code> محلي، بدون تهيئة، مناسب للاستخدام الفردي.</p></li>
<li><p><strong>Milvus Standalone / Cluster:</strong> مستضاف ذاتيًا، ويدعم وكلاء متعددين يتشاركون البيانات، ومناسب لبيئات الفريق.</p></li>
<li><p><a href="https://zilliz.com/cloud"><strong>زيليز كلاود</strong></a><strong>:</strong> مُدار بالكامل، مع التوسيع التلقائي، والنسخ الاحتياطي، والتوافر العالي، والعزل. مثالي لأعباء عمل الإنتاج.</p></li>
</ul>
<p>عادةً ما يكون التحويل من التطوير المحلي إلى الإنتاج <strong>تغييراً في التكوين من سطر واحد</strong>. تبقى شفرتك كما هي.</p>
<h3 id="Install" class="common-anchor-header">التثبيت</h3><pre><code translate="no" class="language-bash">pip install memsearch
<button class="copy-code-btn"></button></code></pre>
<p>يدعم memsearch أيضًا العديد من موفري التضمين، بما في ذلك OpenAI وGoogle وVoyage وOllama والنماذج المحلية. وهذا يضمن بقاء بنية الذاكرة الخاصة بك محمولة ومحايدة للبائعين.</p>
<h3 id="Option-1-Python-API-integrated-into-your-agent-framework" class="common-anchor-header">الخيار 1: واجهة برمجة تطبيقات بايثون (مدمجة في إطار عمل وكيلك)</h3><p>فيما يلي مثال بسيط على حلقة وكيل كاملة باستخدام memsearch. يمكنك النسخ/اللصق والتعديل حسب الحاجة:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">from</span> memsearch <span class="hljs-keyword">import</span> MemSearch

llm = OpenAI()
ms = MemSearch(paths=[<span class="hljs-string">&quot;./memory/&quot;</span>])

<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">agent_chat</span>(<span class="hljs-params">user_input: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-comment"># 1. Recall — search relevant memories</span>
    memories = <span class="hljs-keyword">await</span> ms.search(user_input, top_k=<span class="hljs-number">3</span>)
    context = <span class="hljs-string">&quot;\n&quot;</span>.join(<span class="hljs-string">f&quot;- <span class="hljs-subst">{m[<span class="hljs-string">&#x27;content&#x27;</span>][:<span class="hljs-number">200</span>]}</span>&quot;</span> <span class="hljs-keyword">for</span> m <span class="hljs-keyword">in</span> memories)

    <span class="hljs-comment"># 2. Think — call LLM</span>
    resp = llm.chat.completions.create(
        model=<span class="hljs-string">&quot;gpt-4o-mini&quot;</span>,
        messages=[
            {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">f&quot;Memories:\n<span class="hljs-subst">{context}</span>&quot;</span>},
            {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: user_input},
        ],
    )

    <span class="hljs-comment"># 3. Remember — write to markdown, update index</span>
    save_memory(<span class="hljs-string">f&quot;## <span class="hljs-subst">{user_input}</span>\n<span class="hljs-subst">{resp.choices[<span class="hljs-number">0</span>].message.content}</span>&quot;</span>)
    <span class="hljs-keyword">await</span> ms.index()
    <span class="hljs-keyword">return</span> resp.choices[<span class="hljs-number">0</span>].message.content
<button class="copy-code-btn"></button></code></pre>
<p>هذا يوضح الحلقة الأساسية:</p>
<ul>
<li><p><strong>تذكّر</strong>: تقوم memsearch بتنفيذ عملية استرجاع المتجه الهجين + BM25</p></li>
<li><p><strong>فكر</strong>: يعالج LLM الخاص بك مدخلات المستخدم + الذاكرة المسترجعة</p></li>
<li><p><strong>تذكر</strong>: يقوم الوكيل بكتابة ذاكرة جديدة إلى Markdown، وتقوم memsearch بتحديث فهرسها</p></li>
</ul>
<p>يتلاءم هذا النمط بشكل طبيعي مع أي نظام وكيل - سلسلة اللغة، أو AutoGPT، أو الموجهات الدلالية، أو LangGraph، أو حلقات الوكيل المخصصة. إنه لا يعتمد على إطار العمل حسب التصميم.</p>
<h3 id="Option-2-CLI-quick-operations-good-for-debugging" class="common-anchor-header">الخيار 2: CLI (عمليات سريعة، جيدة لتصحيح الأخطاء)</h3><p>واجهة CLI مثالية لسير العمل المستقلة، أو الفحوصات السريعة، أو فحص الذاكرة أثناء التطوير:</p>
<pre><code translate="no" class="language-bash">memsearch index ./docs/              <span class="hljs-comment"># Index files</span>
memsearch search <span class="hljs-string">&quot;Redis caching&quot;</span>     <span class="hljs-comment"># Search</span>
memsearch watch ./docs/              <span class="hljs-comment"># Watch for file changes</span>
memsearch compact                    <span class="hljs-comment"># Compact old memory</span>
<button class="copy-code-btn"></button></code></pre>
<p>تعكس واجهة CLI إمكانيات واجهة برمجة تطبيقات Python ولكنها تعمل دون كتابة أي شيفرة برمجية - وهي مثالية لتصحيح الأخطاء أو عمليات الفحص أو الترحيل أو التحقق من بنية مجلد الذاكرة.</p>
<h2 id="How-memsearch-Compares-to-Other-Memory-Solutions" class="common-anchor-header">كيفية مقارنة memsearch بحلول الذاكرة الأخرى<button data-href="#How-memsearch-Compares-to-Other-Memory-Solutions" class="anchor-icon" translate="no">
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
    </button></h2><p>السؤال الأكثر شيوعًا الذي يطرحه المطورون هو لماذا يستخدمون memsearch في حين أن الخيارات القائمة موجودة بالفعل. الإجابة المختصرة: تستبدل memsearch الميزات المتقدمة مثل الرسوم البيانية المعرفية الزمنية بالشفافية وقابلية النقل والبساطة. بالنسبة لمعظم حالات استخدام ذاكرة الوكيل، هذه هي المقايضة الصحيحة.</p>
<table>
<thead>
<tr><th>الحل</th><th>نقاط القوة</th><th>القيود</th><th>الأفضل ل</th></tr>
</thead>
<tbody>
<tr><td>ميمسارش</td><td>ذاكرة نص عادي شفافة، مشاركة الإنسان والذكاء الاصطناعي في التأليف، عدم وجود احتكاك في الترحيل، سهولة تصحيح الأخطاء، سهولة التصحيح، Git-native</td><td>لا توجد رسوم بيانية زمنية مدمجة أو هياكل ذاكرة معقدة متعددة العوامل</td><td>فرق العمل التي تقدر التحكم والبساطة وقابلية النقل في الذاكرة طويلة المدى</td></tr>
<tr><td>ميم0</td><td>مُدار بالكامل، لا توجد بنية تحتية للتشغيل أو الصيانة</td><td>مبهمة - لا يمكن فحص الذاكرة أو تحريرها يدويًا؛ التضمينات هي التمثيل الوحيد</td><td>الفرق التي ترغب في خدمة مُدارة دون تدخل من أحد ولا بأس من رؤية أقل</td></tr>
<tr><td>Zep</td><td>مجموعة ميزات غنية: الذاكرة الزمنية، والنمذجة متعددة الشخصيات، والرسوم البيانية المعرفية المعقدة</td><td>بنية ثقيلة؛ المزيد من الأجزاء المتحركة؛ أصعب في التعلم والتشغيل</td><td>الوكلاء الذين يحتاجون حقًا إلى هياكل ذاكرة متقدمة أو تفكير مدرك للوقت</td></tr>
<tr><td>لانج ميم / ليتا</td><td>تكامل عميق وسلس داخل أنظمتها البيئية الخاصة بها</td><td>انغلاق الإطار؛ صعوبة النقل إلى حزم الوكلاء الآخرين</td><td>الفرق الملتزمة بالفعل بهذه الأطر المحددة</td></tr>
</tbody>
</table>
<h2 id="Start-Using-memsearch-and-Join-the-Project" class="common-anchor-header">ابدأ باستخدام memsearch وانضم إلى المشروع<button data-href="#Start-Using-memsearch-and-Join-the-Project" class="anchor-icon" translate="no">
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
    </button></h2><p>Memsearch مفتوح المصدر بالكامل بموجب ترخيص MIT، والمستودع جاهز لتجارب الإنتاج اليوم.</p>
<ul>
<li><p><strong>الريبو:</strong> <a href="https://github.com/zilliztech/memsearch">github.com/zilliztech/memsearch</a></p></li>
<li><p><strong>المستندات</strong> <a href="https://zilliztech.github.io/memsearch">: zilliztech.github.io/memsearch</a></p></li>
</ul>
<p>إذا كنت تقوم ببناء وكيل يحتاج إلى تذكر الأشياء عبر الجلسات وتريد التحكم الكامل فيما يتذكره، فإن memsearch يستحق البحث. يتم تثبيت المكتبة باستخدام <code translate="no">pip install</code> واحد، وتعمل مع أي إطار عمل وكيل، وتخزن كل شيء في شكل Markdown يمكنك قراءته وتحريره وإصداره باستخدام Git.</p>
<p>نحن نعمل بنشاط على تطوير memsearch ونود الحصول على مدخلات من المجتمع.</p>
<ul>
<li><p>افتح مشكلة إذا تعطل شيء ما.</p></li>
<li><p>أرسل تقرير علاقات عامة إذا كنت ترغب في توسيع المكتبة.</p></li>
<li><p>ضع نجمة على الريبو إذا كانت فلسفة ماركداون كمصدر للحقيقة تلقى صدى لديك.</p></li>
</ul>
<p>لم يعد نظام ذاكرة OpenClaw مقفلًا داخل OpenClaw. الآن، يمكن لأي شخص استخدامه.</p>
<h2 id="Keep-Reading" class="common-anchor-header">تابع القراءة<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">ما هو OpenClaw؟ الدليل الكامل لعامل الذكاء الاصطناعي مفتوح المصدر</a></p></li>
<li><p><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">البرنامج التعليمي لـ OpenClaw الاتصال بـ Slack لمساعد الذكاء الاصطناعي المحلي</a></p></li>
<li><p><a href="https://milvus.io/blog/clawdbot-long-running-ai-agents-langgraph-milvus.md">بناء وكلاء ذكاء اصطناعي على غرار Clawdbot-Style AI Agents مع LangGraph و Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/is-rag-become-outdated-now-long-running-agents-like-claude-cowork-are-emerging.md">RAG مقابل الوكلاء طويل المدى: هل RAG عفا عليها الزمن؟</a></p></li>
<li><p><a href="https://milvus.io/blog/create-a-custom-anthropic-skill-for-milvus-to-quickly-spin-up-rag.md">إنشاء مهارة أنثروبك مخصصة لـ Milvus لتدوير RAG بسرعة</a></p></li>
</ul>
