---
id: claude-code-memory-memsearch.md
title: لقد قرأنا المصدر المسرب لـ Claude Code. إليك كيف تعمل ذاكرته بالفعل
author: Cheney Zhang
date: 2026-4-3
cover: assets.zilliz.com/claude_memory_845a789ee8.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Claude Code memory, AI agent memory, memsearch, Claude Code source leak,
  cross-agent memory
meta_title: |
  Claude Code Memory System Explained: 4 Layers, 5 Limits, and a Fix
desc: >-
  يكشف مصدر كلود كود المُسرَّب عن ذاكرة من 4 طبقات مكوّنة من 200 سطر مع بحث في
  grep فقط. فيما يلي كيفية عمل كل طبقة وما الذي تصلح به memsearch.
origin: 'https://milvus.io/blog/claude-code-memory-memsearch.md'
---
<p>تم شحن الكود المصدري لـ Claude Code علنًا عن طريق الخطأ. تضمّن الإصدار 2.1.88 ملف خريطة مصدر بسعة 59.8 ميغابايت كان يجب أن يُحذف من الإصدار. احتوى هذا الملف الوحيد على قاعدة شيفرة TypeScript كاملة وقابلة للقراءة - 512,000 سطر، وهي الآن معكوسة عبر GitHub.</p>
<p>لفت انتباهنا <a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">نظام الذاكرة</a>. كلود كود هو عامل ترميز الذكاء الاصطناعي الأكثر شيوعًا في السوق، والذاكرة هي الجزء الذي يتفاعل معه معظم المستخدمين دون فهم كيفية عملها تحت الغطاء. لذلك بحثنا في الأمر.</p>
<p>النسخة المختصرة: ذاكرة Claude Code أساسية أكثر مما تعتقد. فهي لا تتجاوز 200 سطر من الملاحظات. ويمكنه العثور على الذكريات فقط عن طريق المطابقة التامة للكلمات الرئيسية - إذا سألت عن "تعارضات المنافذ"، ولكن الملاحظة تقول "تعيين docker-compose"، فلن تحصل على شيء. ولا يترك أي شيء من ذلك كلود كود. قم بالتبديل إلى وكيل مختلف وستبدأ من الصفر.</p>
<p>إليك الطبقات الأربع</p>
<ul>
<li><strong>CLAUDE.md</strong> - ملف تكتبه بنفسك مع قواعد يتبعها كلود. يدوي وثابت ومحدود بمقدار ما تفكر في كتابته مسبقًا.</li>
<li><strong>ذاكرة تلقائية</strong> - يدوّن كلود ملاحظاته الخاصة أثناء الجلسات. مفيد، ولكنه محدود بفهرس مكون من 200 سطر بدون بحث حسب المعنى.</li>
<li><strong>الحلم التلقائي</strong> - عملية تنظيف في الخلفية تعمل على دمج الذكريات الفوضوية أثناء خمولك. يساعد في التخلص من الفوضى التي تعود لأيام، ولا يمكنه سد الشهور.</li>
<li><strong>KAIROS</strong> - وضع البرنامج الخفي الذي لم يتم إصداره والذي تم العثور عليه في الشيفرة المسربة. ليس في أي إصدار عام حتى الآن.</li>
</ul>
<p>أدناه، سنقوم بتفريغ كل طبقة، ثم نغطي مواضع تعطل البنية وما بنيناه لمعالجة الثغرات.</p>
<h2 id="How-Does-CLAUDEmd-Work" class="common-anchor-header">كيف يعمل CLAUDE.md؟<button data-href="#How-Does-CLAUDEmd-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>CLAUDE.md هو ملف Markdown تنشئه وتضعه في مجلد مشروعك. تملأه بكل ما تريد أن يتذكره كلود: قواعد نمط الشيفرة، بنية المشروع، أوامر الاختبار، خطوات النشر. يقوم كلود بتحميله في بداية كل جلسة.</p>
<p>توجد ثلاثة نطاقات: على مستوى المشروع (في جذر الريبو)، والشخصي (<code translate="no">~/.claude/CLAUDE.md</code>)، والتنظيمي (تكوين المؤسسة). يتم متابعة الملفات الأقصر بشكل أكثر موثوقية.</p>
<p>الحد الأقصى واضح: CLAUDE.md يحتفظ فقط بالأشياء التي كتبتها مسبقًا. قرارات التصحيح، والتفضيلات التي ذكرتها في منتصف المحادثة، والحالات الحادة التي اكتشفتها معًا - لا يتم تسجيل أي من ذلك إلا إذا توقفت وأضفتها يدويًا. معظم الناس لا يفعلون ذلك.</p>
<h2 id="How-Does-Auto-Memory-Work" class="common-anchor-header">كيف تعمل الذاكرة التلقائية؟<button data-href="#How-Does-Auto-Memory-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>تلتقط الذاكرة التلقائية ما يظهر أثناء العمل. يقرّر كلود ما يستحق الاحتفاظ به ويكتبه في مجلد ذاكرة على جهازك، مرتبًا في أربع فئات: المستخدم (الدور والتفضيلات)، والملاحظات (تصحيحاتك)، والمشروع (القرارات والسياق)، والمرجع (مكان وجود الأشياء).</p>
<p>كل ملاحظة هي ملف Markdown منفصل. نقطة الدخول هي <code translate="no">MEMORY.md</code> - فهرس حيث يكون كل سطر عبارة عن تسمية قصيرة (أقل من 150 حرفًا) تشير إلى ملف مفصل. يقرأ كلود الفهرس، ثم يسحب ملفات محددة عندما تبدو ذات صلة.</p>
<pre><code translate="no">~<span class="hljs-regexp">/.claude/</span>projects/-<span class="hljs-title class_">Users</span>-me-myproject/memory/
├── <span class="hljs-variable constant_">MEMORY</span>.<span class="hljs-property">md</span>                  ← index file, one pointer per line
├── user_role.<span class="hljs-property">md</span>               ← <span class="hljs-string">&quot;Backend engineer, fluent in Go, new to React&quot;</span>
├── feedback_testing.<span class="hljs-property">md</span>        ← <span class="hljs-string">&quot;Integration tests must use real DB, no mocking&quot;</span>
├── project_auth_rewrite.<span class="hljs-property">md</span>    ← <span class="hljs-string">&quot;Auth rewrite driven by compliance, not tech debt&quot;</span>
└── reference_linear.<span class="hljs-property">md</span>        ← <span class="hljs-string">&quot;Pipeline bugs tracked in Linear INGEST project&quot;</span>

<span class="hljs-variable constant_">MEMORY</span>.<span class="hljs-property">md</span> <span class="hljs-title function_">sample</span> (each line ≤<span class="hljs-number">150</span> chars):
- [<span class="hljs-title class_">User</span> role](user_role.<span class="hljs-property">md</span>) — <span class="hljs-title class_">Backend</span> engineer, strong <span class="hljs-title class_">Go</span>, <span class="hljs-keyword">new</span> to <span class="hljs-title class_">React</span>
- [<span class="hljs-title class_">Testing</span> rule](feedback_testing.<span class="hljs-property">md</span>) — <span class="hljs-title class_">No</span> mocking the database <span class="hljs-keyword">in</span> integration tests
- [<span class="hljs-title class_">Auth</span> rewrite](project_auth_rewrite.<span class="hljs-property">md</span>) — <span class="hljs-title class_">Compliance</span>-driven, not tech debt
- [<span class="hljs-title class_">Bug</span> tracker](reference_linear.<span class="hljs-property">md</span>) — <span class="hljs-title class_">Pipeline</span> bugs → <span class="hljs-title class_">Linear</span> <span class="hljs-variable constant_">INGEST</span>
<button class="copy-code-btn"></button></code></pre>
<p>يتم تحميل أول 200 سطر من MEMORY.md في كل جلسة. أي شيء بعد ذلك يكون غير مرئي.</p>
<p>خيار تصميم ذكي واحد: يخبر موجه النظام المسرب كلود أن يتعامل مع ذاكرته الخاصة كتلميح وليس كحقيقة. فهو يتحقق من الرمز الحقيقي قبل التصرف على أي شيء يتم تذكره، مما يساعد على تقليل الهلوسات - وهو نمط بدأت <a href="https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md">أطر عمل وكلاء الذكاء الاصطناعي</a> الأخرى في اعتماده.</p>
<h2 id="How-Does-Auto-Dream-Consolidate-Stale-Memories" class="common-anchor-header">كيف يدمج الحلم التلقائي الذكريات القديمة؟<button data-href="#How-Does-Auto-Dream-Consolidate-Stale-Memories" class="anchor-icon" translate="no">
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
    </button></h2><p>تلتقط الذاكرة التلقائية الملاحظات، ولكن بعد أسابيع من الاستخدام تصبح هذه الملاحظات قديمة. يصبح الإدخال الذي يقول "خطأ في النشر بالأمس" بلا معنى بعد أسبوع. ملاحظة تقول أنك تستخدم PostgreSQL؛ ملاحظة أحدث تقول أنك قمت بالترحيل إلى MySQL. الملفات المحذوفة لا تزال تحتوي على إدخالات الذاكرة. يمتلئ الفهرس بالتناقضات والمراجع القديمة.</p>
<p>الحلم التلقائي هو عملية التنظيف. يعمل في الخلفية و:</p>
<ul>
<li>يستبدل المراجع الزمنية المبهمة بالتواريخ الدقيقة. "مشكلة نشر الأمس" → "مشكلة نشر 2026-03-28".</li>
<li>يحل التناقضات. ملاحظة PostgreSQL + ملاحظة MySQL → يحتفظ بالحقيقة الحالية.</li>
<li>يحذف الإدخالات القديمة. تتم إزالة الملاحظات التي تشير إلى الملفات المحذوفة أو المهام المكتملة.</li>
<li>يحتفظ <code translate="no">MEMORY.md</code> أقل من 200 سطر.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_1_7973e94494.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>شروط التشغيل:</strong> أكثر من 24 ساعة منذ آخر تنظيف وتراكم 5 جلسات جديدة على الأقل. يمكنك أيضًا كتابة "حلم" لتشغيلها يدويًا. يتم تشغيل العملية في وكيل فرعي في الخلفية - مثل السكون الفعلي، لن يقاطع عملك النشط.</p>
<p>تبدأ مطالبة نظام وكيل الأحلام بـ <em>"أنت تقوم بحلم - تمرير انعكاسي على ملفات ذاكرتك."</em></p>
<h2 id="What-Is-KAIROS-Claude-Codes-Unreleased-Always-On-Mode" class="common-anchor-header">ما هو KAIROS؟ وضع كلود كود الذي لم يتم إصداره دائمًا<button data-href="#What-Is-KAIROS-Claude-Codes-Unreleased-Always-On-Mode" class="anchor-icon" translate="no">
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
    </button></h2><p>الطبقات الثلاث الأولى حية أو متداولة. تحتوي الشيفرة المسربة أيضًا على شيء لم يتم شحنه: KAIROS.</p>
<p>يظهر KAIROS - على ما يبدو أنه سمي على اسم الكلمة اليونانية التي تعني "اللحظة المناسبة" - أكثر من 150 مرة في المصدر. سيحول كود كلود من أداة تستخدمها بنشاط إلى مساعد في الخلفية يراقب مشروعك باستمرار.</p>
<p>استنادًا إلى الشيفرة المسربة، KAIROS:</p>
<ul>
<li>يحتفظ بسجل جاري للملاحظات والقرارات والإجراءات على مدار اليوم.</li>
<li>يتفقد على مؤقت. على فترات منتظمة، يتلقى إشارة ويقرر: التصرف، أو البقاء هادئًا.</li>
<li>يبقى بعيدًا عن طريقك. يتم تأجيل أي إجراء من شأنه أن يعيقك لأكثر من 15 ثانية.</li>
<li>يدير عملية تنظيف الأحلام داخليًا، بالإضافة إلى حلقة كاملة من المراقبة والتفكير والتصرف في الخلفية.</li>
<li>لديه أدوات حصرية لا يمتلكها كلود كود العادي: دفع الملفات إليك، وإرسال الإشعارات، ومراقبة طلبات سحب GitHub الخاصة بك.</li>
</ul>
<p>KAIROS وراء علامة ميزة وقت التحويل البرمجي. ليس في أي بناء عام. فكر في الأمر على أنه أنثروبيك يستكشف ما يحدث عندما تتوقف <a href="https://milvus.io/blog/langchain-and-milvus-build-production-ready-agents-with-real-long-term-memory.md">ذاكرة الوكيل</a> عن كونها جلسة بجلسة وتصبح قيد التشغيل دائمًا.</p>
<h2 id="Where-Does-Claude-Codes-Memory-Architecture-Break-Down" class="common-anchor-header">أين تتعطل بنية ذاكرة Claude Code؟<button data-href="#Where-Does-Claude-Codes-Memory-Architecture-Break-Down" class="anchor-icon" translate="no">
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
    </button></h2><p>تقوم ذاكرة كلود كود بعمل حقيقي. لكن هناك خمسة قيود هيكلية تقيد ما يمكنها التعامل معه مع نمو المشاريع.</p>
<table>
<thead>
<tr><th>القيود</th><th>ما يحدث</th></tr>
</thead>
<tbody>
<tr><td><strong>غطاء فهرس 200 سطر</strong></td><td><code translate="no">MEMORY.md</code> يحمل حوالي 25 كيلوبايت تشغيل مشروع لأشهر، ويتم دفع الإدخالات القديمة من قبل إدخالات جديدة. "ما هو تكوين "ريديس" الذي استقرينا عليه الأسبوع الماضي؟ - اختفت</td></tr>
<tr><td><strong>استرجاع Grep فقط</strong></td><td>يستخدم بحث الذاكرة <a href="https://milvus.io/docs/full-text-search.md">المطابقة</a> الحرفية <a href="https://milvus.io/docs/full-text-search.md">للكلمات المفتاحية</a>. أنت تتذكر "تعارضات منافذ وقت النشر"، لكن الملاحظة تقول "تعيين منفذ docker-compose". لا يمكن لـ Grep سد هذه الفجوة.</td></tr>
<tr><td><strong>الملخصات فقط، لا يوجد تعليل</strong></td><td>تحفظ الذاكرة التلقائية الملاحظات عالية المستوى، وليس خطوات التصحيح أو المنطق الذي أوصلك إلى هناك. تضيع <em>الكيفية</em>.</td></tr>
<tr><td><strong>يتراكم التعقيد دون إصلاح الأساس</strong></td><td>CLAUDE.md ← الذاكرة التلقائية ← الذاكرة التلقائية ← الحلم التلقائي ← كيروس. كل طبقة موجودة لأن الطبقة السابقة لم تكن كافية. ولكن لا يغير أي قدر من الطبقات ما يوجد تحتها: أداة واحدة، ملفات محلية، التقاط جلسة تلو الأخرى.</td></tr>
<tr><td><strong>الذاكرة مقفلة داخل كلود كود</strong></td><td>بدّل إلى OpenCode أو CodeCode أو Codex CLI أو أي عامل آخر وستبدأ من الصفر. لا تصدير ولا تنسيق مشترك ولا إمكانية نقل.</td></tr>
</tbody>
</table>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_2_b006110116.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>هذه ليست أخطاء. إنها الحدود الطبيعية للأداة الواحدة وبنية الملف المحلي. يتم شحن وكلاء جدد كل شهر، ويتغير سير العمل، ولكن يجب ألا تختفي المعرفة التي اكتسبتها في مشروع ما معهم. لهذا السبب قمنا ببناء <a href="https://github.com/zilliztech/memsearch">memsearch</a>.</p>
<h2 id="What-Is-memsearch-Persistent-Memory-for-Any-AI-Coding-Agent" class="common-anchor-header">ما هو memsearch؟ الذاكرة الدائمة لأي وكيل ترميز ذكاء اصطناعي<button data-href="#What-Is-memsearch-Persistent-Memory-for-Any-AI-Coding-Agent" class="anchor-icon" translate="no">
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
    </button></h2><p>يسحب<a href="https://github.com/zilliztech/memsearch">memsearch</a> الذاكرة من الوكيل إلى الطبقة الخاصة به. الوكلاء يأتون ويذهبون. وتبقى الذاكرة.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_3_4151da0414.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="How-to-Install-memsearch" class="common-anchor-header">كيفية تثبيت memsearch</h3><p>يقوم مستخدمو كلود كود بالتثبيت من السوق:</p>
<pre><code translate="no">/plugin marketplace add zilliztech/memsearch
/plugin install memsearch
<button class="copy-code-btn"></button></code></pre>
<p>تم. لا حاجة للتهيئة.</p>
<p>المنصات الأخرى بنفس البساطة. OpenClaw: <code translate="no">openclaw plugins install clawhub:memsearch</code>. واجهة برمجة تطبيقات Python عبر uv أو pip:</p>
<pre><code translate="no">uv tool install <span class="hljs-string">&quot;memsearch[onnx]&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="What-Does-memsearch-Capture" class="common-anchor-header">ماذا يلتقط memsearch؟</h3><p>بمجرد التثبيت، يتم ربط memsearch بدورة حياة الوكيل. يتم تلخيص كل محادثة وفهرستها تلقائيًا. عندما تطرح سؤالاً يحتاج إلى تاريخ، يتم تشغيل الاستدعاء من تلقاء نفسه.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_4_13b257186e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>تُخزَّن ملفات الذاكرة على شكل Markdown مؤرخة - ملف واحد في اليوم:</p>
<pre><code translate="no">.memsearch/
└── memory/
    ├── <span class="hljs-number">2026</span><span class="hljs-number">-03</span><span class="hljs-number">-28.</span>md    ← one <span class="hljs-keyword">file</span> per day
    ├── <span class="hljs-number">2026</span><span class="hljs-number">-03</span><span class="hljs-number">-29.</span>md
    ├── <span class="hljs-number">2026</span><span class="hljs-number">-03</span><span class="hljs-number">-30.</span>md
    └── <span class="hljs-number">2026</span><span class="hljs-number">-04</span><span class="hljs-number">-01.</span>md
<button class="copy-code-btn"></button></code></pre>
<p>يمكنك فتح ملفات الذاكرة وقراءتها وتحريرها في أي محرر نصوص. إذا أردت الترحيل، يمكنك نسخ المجلد. إذا كنت تريد التحكم في الإصدار، فإن git يعمل أصلاً.</p>
<p><a href="https://milvus.io/docs/index-explained.md">الفهرس المتجه</a> المخزن في <a href="https://milvus.io/docs/overview.md">ميلفوس</a> هو طبقة تخزين مؤقت - إذا فقدت في أي وقت، يمكنك إعادة بنائه من ملفات Markdown. تعيش بياناتك في الملفات وليس الفهرس.</p>
<h2 id="How-Does-memsearch-Find-Memories-Semantic-Search-vs-Grep" class="common-anchor-header">كيف يجد memsearch الذكريات؟ البحث الدلالي مقابل Grep<button data-href="#How-Does-memsearch-Find-Memories-Semantic-Search-vs-Grep" class="anchor-icon" translate="no">
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
    </button></h2><p>يستخدم استرجاع الذكريات في كلود كود البحث الدلالي - مطابقة الكلمات المفتاحية الحرفية. يعمل ذلك عندما يكون لديك بضع عشرات من الملاحظات، لكنه ينهار بعد أشهر من التاريخ عندما لا يمكنك تذكر الصياغة الدقيقة.</p>
<p>يستخدم memsearch <a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">البحث الهجين</a> بدلاً من ذلك. تعثر <a href="https://zilliz.com/glossary/semantic-search">المتجهات الدلالية</a> على المحتوى المرتبط باستعلامك حتى عندما تكون الصياغة مختلفة، بينما يطابق BM25 الكلمات المفتاحية الدقيقة. يدمج <a href="https://milvus.io/docs/rrf-ranker.md">RRF (اندماج الرتب المتبادل)</a> كلا مجموعتي النتائج ويصنفهما معًا.</p>
<p>لنفترض أنك تسأل "كيف أصلحنا مهلة ريديس الأسبوع الماضي"؟ - يفهم البحث الدلالي القصد ويجده. لنفترض أنك تسأل &quot;البحث عن <code translate="no">handleTimeout</code>&quot; - يصل BM25 إلى اسم الدالة بالضبط. يغطي المساران النقاط العمياء لبعضهما البعض.</p>
<p>عند تشغيل الاستدعاء، يبحث الوكيل الفرعي على ثلاث مراحل، ويتعمق أكثر عند الحاجة فقط:</p>
<h3 id="L1-Semantic-Search--Short-Previews" class="common-anchor-header">L1: البحث الدلالي - المعاينات القصيرة</h3><p>يقوم الوكيل الفرعي بتشغيل <code translate="no">memsearch search</code> مقابل فهرس ميلفوس ويسحب النتائج الأكثر صلة:</p>
<pre><code translate="no">┌─ L1 search results ────────────────────────────┐
│                                                 │
│  <span class="hljs-meta">#a3f8c1 [score: 0.85] memory/2026-03-28.md    │</span>
│  &gt; Redis port conflict during deploy, <span class="hljs-literal">default</span>   │
│    <span class="hljs-number">6379</span> occupied, switched to <span class="hljs-number">6380</span>, updated     │
│    docker-compose...                            │
│                                                 │
│  <span class="hljs-meta">#b7e2d4 [score: 0.72] memory/2026-03-25.md    │</span>
│  &gt; Auth module rewrite complete, JWT replaced   │
│    <span class="hljs-keyword">with</span> session tokens, mobile token refresh    │
│    was unreliable...                            │
│                                                 │
│  <span class="hljs-meta">#c9f1a6 [score: 0.68] memory/2026-03-20.md    │</span>
│  &gt; DB index optimization, added composite       │
│    index <span class="hljs-keyword">on</span> users table, query time dropped     │
│    <span class="hljs-keyword">from</span> <span class="hljs-number">800</span>ms to <span class="hljs-number">50</span>ms...                        │
│                                                 │
└─────────────────────────────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<p>تعرض كل نتيجة درجة الملاءمة والملف المصدر ومعاينة من 200 حرف. تتوقف معظم الاستعلامات هنا.</p>
<h3 id="L2-Full-Context--Expand-a-Specific-Result" class="common-anchor-header">L2: السياق الكامل - توسيع نتيجة محددة</h3><p>إذا لم تكن معاينة L1 كافية، يقوم الوكيل الفرعي بتشغيل <code translate="no">memsearch expand a3f8c1</code> لسحب الإدخال الكامل:</p>
<pre><code translate="no">┌─ L2 expanded result ───────────────────────────┐
│                                                 │
│  <span class="hljs-comment">## 2026-03-28 Deploy troubleshooting           │</span>
│                                                 │
│  Redis port conflict resolution:                │
│  1. docker-compose up → Redis container failed  │
│  2. Host port 6379 occupied by another instance │
│  3. Changed docker-compose.yml: <span class="hljs-string">&quot;6380:6379&quot;</span>     │
│  4. Updated .<span class="hljs-built_in">env</span>: REDIS_PORT=6380               │
│  5. Updated config/database.py connection       │
│                                                 │
│  Note: Only affects <span class="hljs-built_in">local</span> dev. Prod unaffected. │
│                                                 │
│  [<span class="hljs-built_in">source</span>: memory/2026-03-28.md  lines: 42-55]  │
└─────────────────────────────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<h3 id="L3-Raw-Conversation-Transcript" class="common-anchor-header">L3: نسخة المحادثة الأولية</h3><p>في الحالات النادرة التي تحتاج فيها إلى رؤية ما قيل بالضبط، يقوم الوكيل الفرعي بسحب النص الأصلي للمحادثة:</p>
<pre><code translate="no">┌─ L3 raw transcript ───────────────────────────┐
│                                                │
│  [user] docker-compose up won&#x27;t start, Redis   │
│         port conflict — can you take a look?   │
│                                                │
│  [agent] Checking host port usage...           │
│          Running lsof -i :6379...              │
│          Suggest remapping to port 6380...     │
│          (tool_call: Bash &quot;lsof -i :6379&quot;)     │
│          (tool_call: Edit &quot;docker-compose.yml&quot;)│
│                                                │
│  [user] Done. Anything else to update?         │
│                                                │
│  [agent] Also need to update .env and          │
│          database.py...                        │
│                                                │
└────────────────────────────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<p>يحافظ النص على كل شيء: كلماتك بالضبط، ورد الوكيل بالضبط، وكل أداة اتصال. تنتقل المراحل الثلاث من الخفيف إلى الثقيل - يقرر الوكيل الفرعي مدى عمق البحث، ثم يعيد النتائج المنظمة إلى جلستك الرئيسية.</p>
<h2 id="How-Does-memsearch-Share-Memory-Across-AI-Coding-Agents" class="common-anchor-header">كيف تشارك memsearch الذاكرة عبر وكلاء ترميز الذكاء الاصطناعي؟<button data-href="#How-Does-memsearch-Share-Memory-Across-AI-Coding-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>هذه هي الفجوة الأساسية بين memsearch وذاكرة كلود كود.</p>
<p>ذاكرة كلود كود مقفلة داخل أداة واحدة. استخدم OpenCode أو OpenClaw أو CodeClaw أو Codex CLI، وستبدأ من الصفر. ذاكرة MEMORY.md محلية، مرتبطة بمستخدم واحد ووكيل واحد.</p>
<p>يدعم memsearch أربعة وكلاء ترميز: Claude Code و OpenClaw و OpenCode و CodeCode و Codex CLI. يتشاركون نفس تنسيق ذاكرة Markdown ونفس <a href="https://milvus.io/docs/manage-collections.md">مجموعة Milvus</a>. الذكريات المكتوبة من أي وكيل يمكن البحث فيها من كل وكيل آخر.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_5_6ed2e386b9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>سيناريوهان حقيقيان</strong></p>
<p><strong>تبديل الأدوات.</strong> تقضي فترة ما بعد الظهيرة في Claude Code في اكتشاف خط أنابيب النشر، وتصطدم بالعديد من العقبات. يتم تلخيص المحادثات وفهرستها تلقائيًا. في اليوم التالي، تقوم بالتبديل إلى OpenCode وتسأل "كيف حللنا تعارض المنفذ بالأمس؟ يقوم OpenCode بالبحث في memsearch، ويعثر على ذكريات كلود كود بالأمس ويعطيك الإجابة الصحيحة.</p>
<p><strong>تعاون الفريق.</strong> وجّه الواجهة الخلفية لـ Milvus إلى <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> وسيقوم عدة مطورين على أجهزة مختلفة، باستخدام وكلاء مختلفين، بقراءة وكتابة ذاكرة المشروع نفسها. ينضم عضو جديد في الفريق ولا يحتاج إلى البحث في أشهر من Slack والمستندات - فالوكيل يعرف بالفعل.</p>
<h2 id="Developer-API" class="common-anchor-header">واجهة برمجة تطبيقات المطورين<button data-href="#Developer-API" class="anchor-icon" translate="no">
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
    </button></h2><p>إذا كنت تقوم ببناء <a href="https://milvus.io/blog/how-to-build-productionready-multiagent-systems-with-agno-and-milvus.md">أدوات الوكيل</a> الخاصة بك، توفر memsearch واجهة برمجة تطبيقات CLI وPython.</p>
<p><strong>CLI:</strong></p>
<pre><code translate="no" class="language-bash"><span class="hljs-comment"># Index markdown files</span>
memsearch index ./memory

<span class="hljs-comment"># Search memories</span>
memsearch search <span class="hljs-string">&quot;Redis port conflict&quot;</span>

<span class="hljs-comment"># Expand a specific memory&#x27;s full content</span>
memsearch <span class="hljs-built_in">expand</span> a3f8c1

<span class="hljs-comment"># Watch for file changes, auto-index</span>
memsearch watch ./memory

<span class="hljs-comment"># Compact old memories</span>
memsearch compact
<button class="copy-code-btn"></button></code></pre>
<p><strong>واجهة برمجة تطبيقات بايثون:</strong></p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> memsearch <span class="hljs-keyword">import</span> MemSearch

mem = MemSearch(paths=[<span class="hljs-string">&quot;./memory&quot;</span>])
<span class="hljs-keyword">await</span> mem.index()                          <span class="hljs-comment"># index markdown</span>
results = <span class="hljs-keyword">await</span> mem.search(<span class="hljs-string">&quot;Redis config&quot;</span>) <span class="hljs-comment"># hybrid search</span>
<span class="hljs-keyword">await</span> mem.compact()                        <span class="hljs-comment"># compact old memories</span>
<span class="hljs-keyword">await</span> mem.watch()                          <span class="hljs-comment"># auto-index on file change</span>
<button class="copy-code-btn"></button></code></pre>
<p>تحت الغطاء، يتعامل ميلفوس مع البحث المتجه. يمكنك تشغيله محليًا باستخدام <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a> (بدون تكوين)، أو التعاون عبر <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (تتوفر طبقة مجانية)، أو الاستضافة الذاتية باستخدام Docker. <a href="https://milvus.io/docs/embeddings.md">التضمينات</a> الافتراضية لـ ONNX - تعمل على وحدة المعالجة المركزية، لا حاجة لوحدة معالجة الرسومات. قم بالتبديل في OpenAI أو Ollama في أي وقت.</p>
<h2 id="Claude-Code-Memory-vs-memsearch-Full-Comparison" class="common-anchor-header">ذاكرة كلود كود كلود مقابل ميمسيرش: مقارنة كاملة<button data-href="#Claude-Code-Memory-vs-memsearch-Full-Comparison" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th>الميزة</th><th>ذاكرة كلود كود كلود</th><th>بحث الذاكرة</th></tr>
</thead>
<tbody>
<tr><td>ما يتم حفظه</td><td>ما يعتبره كلود مهمًا</td><td>كل محادثة، يتم تلخيصها تلقائياً</td></tr>
<tr><td>حد التخزين</td><td>~حوالي 200 سطر فهرس (حوالي 25 كيلوبايت)</td><td>غير محدود (ملفات يومية + فهرس متجه)</td></tr>
<tr><td>العثور على الذكريات القديمة</td><td>مطابقة الكلمات المفتاحية</td><td>بحث هجين قائم على المعنى + الكلمات المفتاحية (ميلفوس)</td></tr>
<tr><td>هل يمكنك قراءتها؟</td><td>التحقق من مجلد الذكريات يدويًا</td><td>افتح أي ملف .md</td></tr>
<tr><td>هل يمكنك تحريرها؟</td><td>تحرير الملفات يدويًا</td><td>نفس الشيء - إعادة الفهرسة التلقائية عند الحفظ</td></tr>
<tr><td>التحكم في الإصدار</td><td>غير مصمم لذلك</td><td>يعمل git أصلاً</td></tr>
<tr><td>دعم متعدد الأدوات</td><td>كود كلود فقط</td><td>4 وكلاء، ذاكرة مشتركة</td></tr>
<tr><td>استدعاء طويل الأمد</td><td>يتحلل بعد أسابيع</td><td>مستمر عبر شهور</td></tr>
</tbody>
</table>
<h2 id="Get-Started-with-memsearch" class="common-anchor-header">ابدأ مع memsearch<button data-href="#Get-Started-with-memsearch" class="anchor-icon" translate="no">
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
    </button></h2><p>تتمتع ذاكرة كلود كود بنقاط قوة حقيقية - التصميم المتشكك ذاتيًا، ومفهوم توحيد الأحلام، وميزانية الحجب التي تبلغ 15 ثانية في KAIROS. تفكر أنثروبيك بجدية في هذه المشكلة.</p>
<p>لكن ذاكرة الأداة الواحدة لها سقف. فبمجرد أن يمتد سير عملك على عدة وكلاء، أو عدة أشخاص، أو أكثر من بضعة أسابيع من التاريخ، فأنت بحاجة إلى ذاكرة موجودة من تلقاء نفسها.</p>
<ul>
<li>جرّب <a href="https://github.com/zilliztech/memsearch">memsearch</a> - مفتوح المصدر ومرخص من MIT. التثبيت في كلود كود بأمرين.</li>
<li>اقرأ <a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">كيف يعمل ميمسارش تحت الغطاء</a> أو <a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">دليل إضافات كلود كود</a>.</li>
<li>هل لديك أسئلة؟ انضم إلى <a href="https://discord.com/invite/8uyFbECzPX">مجتمع ميلفوس ديسكورد</a> أو <a href="https://milvus.io/office-hours">احجز جلسة ساعات العمل المجانية</a> للتعرف على حالة استخدامك.</li>
</ul>
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
    </button></h2><h3 id="How-does-Claude-Codes-memory-system-work-under-the-hood" class="common-anchor-header">كيف يعمل نظام ذاكرة كلود كود تحت الغطاء؟</h3><p>يستخدم كلود كود بنية ذاكرة من أربع طبقات، وكلها مخزنة كملفات Markdown محلية. CLAUDE.md هو ملف قواعد ثابت تكتبه يدويًا. تسمح الذاكرة التلقائية لكلود بحفظ ملاحظاته الخاصة أثناء الجلسات، منظمة في أربع فئات - تفضيلات المستخدم، والملاحظات، وسياق المشروع، والمؤشرات المرجعية. يدمج الحلم التلقائي الذكريات القديمة في الخلفية. KAIROS هو برنامج خفي دائم التشغيل لم يتم إصداره موجود في الشيفرة المصدرية المسربة. يتم تحديد النظام بأكمله بفهرس مكون من 200 سطر ويمكن البحث فيه فقط عن طريق المطابقة التامة للكلمات الرئيسية - لا يوجد بحث دلالي أو استدعاء قائم على المعنى.</p>
<h3 id="Can-AI-coding-agents-share-memory-across-different-tools" class="common-anchor-header">هل يمكن لوكلاء ترميز الذكاء الاصطناعي مشاركة الذاكرة عبر أدوات مختلفة؟</h3><p>ليس في الأصل. فذاكرة Claude Code مقفلة على Claude Code - لا يوجد تنسيق تصدير أو بروتوكول مشترك بين الوكلاء. إذا قمتَ بالتبديل إلى OpenCode أو Code Code أو Codex CLI أو OpenClaw، فإنك تبدأ من الصفر. تحل memsearch هذه المشكلة عن طريق تخزين الذكريات كملفات Markdown مؤرخة ومفهرسة في <a href="https://zilliz.com/learn/what-is-vector-database">قاعدة بيانات متجهة</a> (Milvus). جميع الوكلاء الأربعة المدعومين يقرأون ويكتبون نفس مخزن الذاكرة، لذا ينتقل السياق تلقائيًا عند تبديل الأدوات.</p>
<h3 id="What-is-the-difference-between-keyword-search-and-semantic-search-for-agent-memory" class="common-anchor-header">ما الفرق بين البحث بالكلمات المفتاحية والبحث الدلالي لذاكرة الوكيل؟</h3><p>يطابق البحث بالكلمات المفتاحية (grep) السلاسل الدقيقة - إذا كانت ذاكرتك تقول "docker-compose port mapping" ولكنك تبحث عن "تعارضات المنافذ"، فلن تُرجع شيئًا. يقوم البحث الدلالي بتحويل النص إلى <a href="https://zilliz.com/glossary/vector-embeddings">تضمينات متجهة</a> تلتقط المعنى، بحيث تتطابق المفاهيم ذات الصلة حتى مع اختلاف الصياغة. يجمع البحث الدلالي بين كلا النهجين مع البحث الهجين، مما يمنحك استدعاءً قائمًا على المعنى ودقة الكلمات المفتاحية الدقيقة في استعلام واحد.</p>
<h3 id="What-was-leaked-in-the-Claude-Code-source-code-incident" class="common-anchor-header">ما الذي تم تسريبه في حادثة شيفرة مصدر كلود كود؟</h3><p>شُحِن الإصدار 2.1.88 من Claude Code بملف خريطة مصدر بسعة 59.8 ميغابايت كان يجب أن يُزال من نسخة الإنتاج. احتوى الملف على قاعدة الشيفرة البرمجية الكاملة والقابلة للقراءة من TypeScript - حوالي 512,000 سطر - بما في ذلك تطبيق نظام الذاكرة الكامل، وعملية الدمج التلقائي للحلم، ومراجع إلى KAIROS، وهو وضع عامل يعمل دائمًا لم يتم إصداره. نُسخ الكود سريعًا عبر GitHub قبل أن يتم إزالته.</p>
