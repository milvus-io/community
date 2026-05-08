---
id: claude-code-context-management-tools.md
title: أفضل 7 أدوات مفتوحة المصدر لإدارة سياق كود كلود كود كلود
author: Cheney Zhang
date: 2026-5-7
cover: assets.zilliz.com/cccm_11zon_848f7f1c6b.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Claude Code context, Claude Code tools, token management, MCP code search, AI
  agent memory
meta_title: |
  7 Best Open-Source Tools for Claude Code Context Management
desc: >-
  جلسات كود كلود الطويلة تفقد الإشارة بسرعة. تعلم 7 أدوات لتقليص الضجيج الطرفي،
  واسترجاع الأكواد، ومخرجات الأداة، والذاكرة، واستخدام الرمز المميز.
origin: 'https://milvus.io/blog/claude-code-context-management-tools.md'
---
<p>يمكنك أن تعطي Claude Code نافذة سياق مكونة من 1 مليون رمز وتظل تحصل على إجابات أسوأ بمرور الوقت. المشكلة ليست فقط في حجم السياق. إنها جودة السياق.</p>
<p>تتدهور جلسات Claude Code عندما تتنافس كل من سجلات المحطة الطرفية ومخرجات الأداة الخام وقراءات الملفات المتكررة والاستجابات المطولة وسجل المشروع المنسي على الاهتمام. في عمليات سير عمل الوكيل طويلة الأمد، تتحول هذه الضوضاء إلى حلقة: يفقد النموذج الخيط، وتضيف المزيد من المنعطفات لإصلاح الإجابة، وتضيف هذه المنعطفات الإضافية المزيد من الضوضاء.</p>
<p>هذا هو <strong>عدم تركيز السياق</strong>: لدى النموذج مساحة كافية للاحتفاظ بالمعلومات، لكن المعلومات المهمة مدفونة تحت سياق منخفض الإشارة. يمكن أن تجعل النوافذ الأكبر حجمًا هذا الأمر أسهل في التجاهل لأن المطورين يتوقفون عن التفكير بعناية فيما يدخل في المطالبة.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_13_3e7a004cd6.png" alt="Prompt caching diagram showing how reused prefixes can still add billed context across turns" class="doc-image" id="prompt-caching-diagram-showing-how-reused-prefixes-can-still-add-billed-context-across-turns" />
   </span> <span class="img-wrapper"> <span>مخطط التخزين المؤقت للموجه يوضح كيف يمكن للبادئات المعاد استخدامها أن تظل تضيف سياقًا مفوترًا عبر المنعطفات</span> </span></p>
<p>يمكن للتخزين المؤقت للموجه أن يقلل من تكلفة البادئات المتكررة، ولكنه لا يحول نافذة السياق إلى درج للخردة. ما زلت تدفع مقابل الرموز الجديدة، وما زلت بحاجة إلى النموذج للاستدلال على المعلومات الصحيحة.</p>
<p>تستعرض هذه المقالة سبع أدوات مفتوحة المصدر تهاجم إلغاء تركيز السياق من طبقات مختلفة: مخرجات النهاية، ومخرجات الأدوات، والتنقل في قاعدة الشيفرة، وقراءة الملفات، وإسهاب النموذج، واسترجاع الشيفرة الدلالية، والذاكرة العابرة للجلسات. كما يشرح أيضًا كيف ترتبط هذه الأفكار بتصميم <a href="https://zilliz.com/learn/what-is-vector-database">قاعدة بيانات المتجهات،</a> <a href="https://zilliz.com/learn/vector-similarity-search">والبحث عن تشابه المتجهات،</a> وأنظمة الاسترجاع مثل ميلفوس.</p>
<h2 id="What-causes-Claude-Code-context-defocus" class="common-anchor-header">ما الذي يسبب عدم تركيز سياق كود كلود كود؟<button data-href="#What-causes-Claude-Code-context-defocus" class="anchor-icon" translate="no">
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
    </button></h2><p>عادةً ما يأتي عدم تركيز سياق كلود كود من خمسة أنماط من الفشل: الكثير من نصوص التعليمات الأولية، ومخرجات الأدوات الصاخبة، والاستكشاف المتكرر لقاعدة الشفرات، واستجابات النماذج الطويلة، وفجوات الذاكرة عبر الجلسات أو الوكلاء.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_15_56a2da172a.png" alt="Five causes of Claude Code context loss: redundant instructions, messy tool output, repeated codebase retrieval, long responses, and memory gaps" class="doc-image" id="five-causes-of-claude-code-context-loss:-redundant-instructions,-messy-tool-output,-repeated-codebase-retrieval,-long-responses,-and-memory-gaps" />
   </span> <span class="img-wrapper"> <span>خمسة أسباب لفقدان سياق كود كلود كود: التعليمات الزائدة عن الحاجة، ومخرجات الأداة الفوضوية، واسترجاع قاعدة الشيفرات المتكرر، والاستجابات الطويلة، وفجوات الذاكرة</span> </span></p>
<table>
<thead>
<tr><th>وضع فشل السياق</th><th>كيف يبدو في كلود كود</th><th>فئة الأداة التي تساعد</th></tr>
</thead>
<tbody>
<tr><td>سجلات المحطة الطرفية صاخبة</td><td><code translate="no">git</code> <code translate="no">pytest</code> ، ، و ، و CLI السحابية تفريغ نص أكثر مما يحتاجه النموذج. <code translate="no">gh</code></td><td>ضغط مخرجات CLI</td></tr>
<tr><td>مخرجات الأداة تغمر النافذة</td><td>تدخل سجلات الاختبار، وتفريغات DOM، ومخرجات MCP إلى الدردشة ككتل خام عملاقة.</td><td>صندوق رمل مخرجات الأدوات</td></tr>
<tr><td>تكرار التنقل في قاعدة الرموز</td><td>يسرد كلود الدلائل ويبحث في الدلائل ويقرأ الملفات ويكرر نفس الاستكشاف في كل جلسة.</td><td>الرسم البياني للرموز أو الاسترجاع الدلالي</td></tr>
<tr><td>قراءات الملفات واسعة جدًا</td><td>يقرأ النموذج ملفًا كاملاً عندما يحتاج إلى رمز أو ملخص واحد فقط.</td><td>قراءة الكود التدريجي</td></tr>
<tr><td>كلود يتحدث كثيرًا</td><td>تضيف الإجابة نفسها سياقًا غير ضروري للمنعطفات المستقبلية.</td><td>ضغط الاستجابة</td></tr>
<tr><td>الذاكرة لا تستمر</td><td>تعيد شرح قرارات المشروع في كل مرة تبدأ فيها جلسة جديدة.</td><td>ذاكرة التخفيضات أولاً</td></tr>
</tbody>
</table>
<p>يجب على مكدس إدارة السياق الجيد أن يقوم بثلاثة أشياء: إبعاد الملفات غير المرغوب فيها، واسترجاع معرفة المشروع الصحيحة عند الطلب، والحفاظ على القرارات الدائمة عبر الجلسات.</p>
<h2 id="Which-Claude-Code-context-tool-should-you-use-first" class="common-anchor-header">ما أداة سياق كلود كود التي يجب أن تستخدمها أولاً؟<button data-href="#Which-Claude-Code-context-tool-should-you-use-first" class="anchor-icon" translate="no">
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
    </button></h2><p>ابدأ بالطبقة التي تخلق أكبر قدر من التشويش في سير عملك. إذا كانت مخرجاتك الطرفية هي المشكلة، فابدأ بـ RTK. إذا كان Claude يستمر في التجول في مستودع كبير، فابدأ بـ claude-context أو Code-review-gagram. إذا كانت مشكلتك الحقيقية هي إعادة شرح نفس القرارات كل يوم، فابدأ بـ memsearch.</p>
<table>
<thead>
<tr><th>أداة</th><th>المشكلة الرئيسية التي تحلها</th><th>الأنسب</th></tr>
</thead>
<tbody>
<tr><td><a href="https://github.com/rtk-ai/rtk">RTK</a></td><td>المخرجات الطرفية الصاخبة من أوامر المطورين الشائعة.</td><td>المطورون الذين يقومون بتشغيل العديد من أوامر CLI داخل Claude Code.</td></tr>
<tr><td><a href="https://github.com/mksglu/context-mode">وضع السياق</a></td><td>مخرجات أداة خام ضخمة تدخل في المحادثة الرئيسية.</td><td>مستخدمو أدوات Playwright أو GitHub أو GitHub أو السجل أو MCP-tool الثقيلون.</td></tr>
<tr><td><a href="https://github.com/tirth8205/code-review-graph">كود-مراجعة-رسم بياني</a></td><td>استكشاف قاعدة الكود الأعمى في الريبوسات الكبيرة.</td><td>المراجعات وتحليل التبعية وأسئلة نصف قطر الانفجار.</td></tr>
<tr><td><a href="https://github.com/Mibayy/token-savior">منقذ الرموز</a></td><td>قراءة ملف كامل عندما يكون ملخص الرمز كافيًا.</td><td>ملفات كبيرة وعمليات بحث متكررة عن الرموز وقراءة الشيفرة البرمجية بشكل تدريجي.</td></tr>
<tr><td><a href="https://github.com/JuliusBrussee/caveman">رجل الكهف</a></td><td>عادات الاستجابة المطولة الخاصة بكلود.</td><td>المستخدمون الذين يريدون إخراجًا مقتضبًا وسياقًا مستقبليًا أصغر.</td></tr>
<tr><td><a href="https://github.com/zilliztech/claude-context">سياق كلود-سياق</a></td><td>إعادة استكشاف قاعدة الشيفرة في كل جلسة.</td><td>البحث الدلالي عن الكود الدلالي من خلال MCP.</td></tr>
<tr><td><a href="https://github.com/zilliztech/memsearch">memsearch</a></td><td>فقدان ذاكرة المشروع عبر الجلسات والوكلاء ومفاتيح تبديل النماذج.</td><td>مشاريع طويلة الأمد مع قرارات ودروس دائمة.</td></tr>
</tbody>
</table>
<p>تقلل الأدوات الخمس الأولى ما يدخل أو يبقى في السياق. تعمل الأداتان الأخيرتان على تسهيل استدعاء السياق المفيد.</p>
<h2 id="RTK-compresses-raw-command-output-before-Claude-sees-it" class="common-anchor-header">يقوم RTK بضغط مخرجات الأوامر الخام قبل أن يراها كلود<button data-href="#RTK-compresses-raw-command-output-before-Claude-sees-it" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/rtk_de6e8e7fb3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>RTK هو وكيل CLI لتقليل استخدام الرموز من أوامر المطورين الشائعة. يشير وصف GitHub الخاص به إلى أنه يقلل من استهلاك الرموز الرمزية LLM بنسبة 60-90% في أوامر المطورين الشائعة، ويتم شحنه كثنائي Rust واحد.</p>
<p>في الاستخدام اليومي لـ Claude Code، غالبًا ما تقوم الأوامر مثل <code translate="no">git status</code> و <code translate="no">pytest</code> وقوائم الدليل بتفريغ معلومات البيئة الكاملة وأوصاف الحالة في نافذة السياق. يحتاج النموذج عادةً إلى إجابة أصغر فقط: ما هي الملفات التي تغيرت أو فشل الاختبار أو مكان توقف العلاقات العامة أو الملفات الرئيسية الموجودة في الدليل.</p>
<p>يقع RTK بين الصدفة وكلود. ويمكنه إعادة كتابة الأوامر من خلال خطافات Claude Code وتمرير المخرجات المضغوطة.</p>
<p>الإخراج الخام <code translate="no">git status</code>:</p>
<pre><code translate="no" class="language-bash">On branch feat/payment-retry
Your branch is up to <span class="hljs-built_in">date</span> with <span class="hljs-string">&#x27;origin/feat/payment-retry&#x27;</span>.

Changes not staged <span class="hljs-keyword">for</span> commit:
  modified:   src/webhook/handler.ts
  modified:   src/queue/dlq.ts
  modified:   tests/webhook.test.ts

Untracked files:
  docs/notes.md

no changes added to commit
<button class="copy-code-btn"></button></code></pre>
<p>ما يهم في الواقع:</p>
<pre><code translate="no" class="language-bash">3 modified, 1 untracked
- src/webhook/handler.ts
- src/queue/dlq.ts
- tests/webhook.test.ts
<button class="copy-code-btn"></button></code></pre>
<p>نفس القصة مع <code translate="no">pytest</code>. الإخراج الخام مليء بالحالات العابرة وضوضاء البيئة:</p>
<pre><code translate="no" class="language-markdown">============================= <span class="hljs-built_in">test</span> session starts =============================
platform darwin -- Python 3.12.4, pytest-8.4.1
collected 128 items

tests/test_auth.py ....................................
tests/test_webhook.py ....F....
tests/test_queue.py ...................................

================================== FAILURES ==================================
________________ test_retry_to_dlq __________________
E   AssertionError: expected status code 202, got 500
<button class="copy-code-btn"></button></code></pre>
<p>مضغوط، الإشارة فورية:</p>
<pre><code translate="no" class="language-apache">128 tests collected, 1 failed
FAIL tests/test_webhook.py::test_retry_to_dlq
AssertionError: expected status code 202, got 500
<button class="copy-code-btn"></button></code></pre>
<p>RTK هو أسهل نقطة بداية عندما يأتي انتفاخ السياق من أوامر الصدفة بدلًا من استرجاع التعليمات البرمجية.</p>
<h2 id="Context-Mode-sandboxes-giant-tool-outputs-outside-the-main-chat" class="common-anchor-header">وضع السياق يضع مخرجات الأداة العملاقة خارج الدردشة الرئيسية في وضع الحماية<button data-href="#Context-Mode-sandboxes-giant-tool-outputs-outside-the-main-chat" class="anchor-icon" translate="no">
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
    </button></h2><p>صُمم وضع السياق للكتل الخام التي تُرجعها الأدوات: سجلات الاختبار، ولقطات DOM للمتصفح، وحمولات GitHub، ومخرجات أداة MCP، والصفحات المُلغاة. يسلط وصف GitHub الخاص به الضوء على تحسين نافذة السياق لوكلاء ترميز الذكاء الاصطناعي ويبلغ 98% من مخرجات الأدوات.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_5_f00e17ea6f.png" alt="Context Mode GitHub repository card showing sandboxed tool output and context optimization positioning" class="doc-image" id="context-mode-github-repository-card-showing-sandboxed-tool-output-and-context-optimization-positioning" />
   </span> <span class="img-wrapper"> <span>بطاقة مستودع GitHub لوضع السياق تعرض بطاقة مستودع GitHub التي تعرض مخرجات الأدوات الموضوعة في وضع الحماية وموضع تحسين السياق</span> </span></p>
<p>ويتمثل نهجها في عزل مخرجات الأدوات الكبيرة في صندوق رمل محلي وفهرس محلي، ثم تمرير الملخصات ومقابض الاسترجاع فقط إلى محادثة Claude.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_12_32e50fec44.png" alt="Context Mode flow showing large tool output moving through sandbox execution, SQLite or FTS indexes, summaries, and retrieval results" class="doc-image" id="context-mode-flow-showing-large-tool-output-moving-through-sandbox-execution,-sqlite-or-fts-indexes,-summaries,-and-retrieval-results" />
   </span> <span class="img-wrapper"> <span>تدفق وضع السياق الذي يُظهر مخرجات الأداة الكبيرة التي تنتقل عبر تنفيذ صندوق الرمل وفهارس SQLite أو FTS والملخصات ونتائج الاسترجاع</span> </span></p>
<p>هذا التدفق مفيد لأن وكيل الترميز غالبًا ما يحتاج إلى العقدة الفاشلة أو المحدد المعطل أو تتبع المكدس ذي الصلة، وليس إلى DOM بأكمله أو كل سطر اختبار ناجح. يحافظ وضع السياق على توفر الناتج الكامل محليًا مع منعه من الهيمنة على المحادثة الرئيسية.</p>
<p>هذا مشابه لكيفية فصل أنظمة <a href="https://zilliz.com/blog/hybrid-search-with-milvus">البحث المختلطة</a> الإنتاجية بين التخزين والاسترجاع. تحتفظ بالبيانات الأولية في مكان ما دائم، ثم تسترجع الشريحة المهمة فقط.</p>
<h2 id="code-review-graph-maps-code-structure-before-Claude-navigates-it" class="common-anchor-header">رسم بياني لمراجعة الشيفرة-رسم بياني يحدد بنية الشيفرة قبل أن يتنقل كلود فيها<button data-href="#code-review-graph-maps-code-structure-before-Claude-navigates-it" class="anchor-icon" translate="no">
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
    </button></h2><p>يعالج Code-review-gagram مشكلة مختلفة: لا يحتاج كلود دائمًا إلى المزيد من النصوص؛ بل يحتاج إلى خريطة أفضل.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_8_6d4632f3c9.png" alt="code-review-graph logo image used in the original article" class="doc-image" id="code-review-graph-logo-image-used-in-the-original-article" />
   </span> <span class="img-wrapper"> <span>صورة شعار Code-review-gagram المستخدمة في المقالة الأصلية</span> </span></p>
<p>في مستودع كبير، يمكن أن يؤدي سؤال بسيط إلى استكشاف مكلف:</p>
<blockquote>
<p>بعد تغيير منطق تسجيل الدخول هذا، ما هي الملفات والاختبارات التي تتأثر؟</p>
</blockquote>
<p>بدون رسم بياني للشفرة البرمجية، حركة كلود النموذجية هي</p>
<pre><code translate="no" class="language-perl"><span class="hljs-built_in">read</span> auth.ts
grep login
<span class="hljs-built_in">read</span> middleware
<span class="hljs-built_in">read</span> tests
keep guessing
<button class="copy-code-btn"></button></code></pre>
<p>يقوم كود-مراجعة-رسم بياني للكود ببناء خريطة هيكلية لقاعدة الشيفرة مسبقًا. ويستخدم Tree-sitter لتحليل الدوال، والفئات، والواردات، وعلاقات الاستدعاء، والوراثة، وتبعيات الاختبار، ثم يكتب الرسم البياني في SQLite.</p>
<p>وهذا يجعلها مفيدة لمراجعة الشيفرة وتحليل نصف قطر الانفجار. بدلاً من أن تطلب من Claude إعادة اكتشاف الرسم البياني التبعي من خلال القراءات المتكررة، يمكنك السماح له بالاستعلام عن البنية أولاً.</p>
<p>هذا قريب من <a href="https://zilliz.com/blog/semantic-search-vs-lexical-search-vs-full-text-search">البحث الدلالي،</a> ولكنه ليس متطابقًا. يجيب الرسم البياني الهيكلي عن "ما الذي يعتمد على ماذا؟ يجيب الاسترجاع الدلالي على "ما هو الرمز المرتبط مفاهيميًا بهذا السؤال؟ في عمليات سير العمل الحقيقية لمساعدة الشيفرة البرمجية، غالبًا ما تحتاج إلى كليهما.</p>
<h2 id="Token-Savior-gives-Claude-symbol-summaries-before-full-files" class="common-anchor-header">يقدم Token Savior ملخصات رموز كلود قبل الملفات الكاملة<button data-href="#Token-Savior-gives-Claude-symbol-summaries-before-full-files" class="anchor-icon" translate="no">
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
    </button></h2><p>فكرة Token Savior الأساسية بسيطة: لا ترسل الملف الكامل بشكل افتراضي. أرسل فهرسًا أو ملخصًا للرموز أولاً، ثم قم بالتوسع فقط عندما تحتاج المهمة إلى مزيد من التفاصيل.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_10_5f63ad36d1.png" alt="Token Savior GitHub repository card showing its MCP server description and project statistics" class="doc-image" id="token-savior-github-repository-card-showing-its-mcp-server-description-and-project-statistics" />
   </span> <span class="img-wrapper"> <span>بطاقة مستودع Token Savior GitHub الخاصة بـ Token Savior GitHub التي تعرض وصف خادم MCP وإحصائيات المشروع</span> </span></p>
<p>إذا كنت تسأل عن مكان معالجة خطاف الويب الخاص بالدفع، فغالبًا لا يحتاج النموذج غالبًا إلى كل سطر من كل ملف ذي صلة. فهو يحتاج أولاً إلى معرفة ما إذا كان الملف أو الرمز ذا صلة.</p>
<p>يقدم الرمز المنقذ الرمز في طبقات:</p>
<table>
<thead>
<tr><th>طبقة</th><th>ما يتلقاه كلود</th><th>عندما يتوسع</th></tr>
</thead>
<tbody>
<tr><td>الملخص</td><td>الفهرس وأسماء الرموز والأوصاف المختصرة.</td><td>الاستجابة الأولى الافتراضية</td></tr>
<tr><td>مقتطف</td><td>مقطع رمز أصغر حول الرمز ذي الصلة.</td><td>عندما يكون الملخص ذا صلة على الأرجح.</td></tr>
<tr><td>ملف كامل</td><td>محتوى الملف الكامل.</td><td>فقط عندما يتطلب ذلك التحرير أو التفكير العميق.</td></tr>
</tbody>
</table>
<p>هذا يعكس كيف يقرأ المطورون الشيفرة في الواقع. أنت تفحص، وتتأكد من الملاءمة، ثم تفتح الملف الكامل فقط عند الضرورة. كما أنه يشبه أيضًا نمط الاسترجاع التدريجي المستخدم في <a href="https://zilliz.com/blog/metadata-filtering-hybrid-search-or-agent-in-rag-applications">تطبيقات RAG</a>: استرجاع واسع بما فيه الكفاية للتوجيه، ثم تضييق السياق قبل التوليد.</p>
<h2 id="Caveman-reduces-Claudes-own-response-bloat" class="common-anchor-header">يقلل Caveman من تضخم استجابة كلود الخاصة به<button data-href="#Caveman-reduces-Claudes-own-response-bloat" class="anchor-icon" translate="no">
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
    </button></h2><p>تركز معظم أدوات السياق على ما يدخل في النموذج. يستهدف Caveman ما ينتجه كلود.</p>
<p>Caveman هي مهارة/مكوِّن إضافي من Claude Code تقوم بتجريد الحشو والمجاملات والجمل المجمّلة والتفسير الزائد والتراكيب المتكررة. الهدف ليس إزالة المعرفة؛ بل جعل الإجابة أكثر كثافة.</p>
<p>بدون رجل الكهف:</p>
<blockquote>
<p>سبب إعادة تصيير مكون React الخاص بك هو على الأرجح بسبب...</p>
</blockquote>
<p>مع Caveman:</p>
<blockquote>
<p>مرجع كائن جديد في كل عملية تصيير. خاصية الكائن المضمنة = مرجع جديد = إعادة تصيير. التفاف في الاستخدام.</p>
</blockquote>
<p>هذا مهم لأن إجابات كلود الخاصة تصبح سياقًا مستقبليًا. إذا كانت كل إجابة تتضمن شرحًا طويلًا، يبدأ الدور التالي بنص أكثر مما يحتاج إليه. يمكن للإجابات الأقصر تحسين الدور التالي بقدر تحسينها للدور الحالي.</p>
<p>بالنسبة للفرق التي تفكر في <a href="https://zilliz.com/blog/context-engineering-for-ai-agents">هندسة السياق لوكلاء الذكاء الاصطناعي،</a> فإن Caveman هو تذكير بأن سياسة الإخراج جزء من سياسة السياق.</p>
<h2 id="claude-context-adds-semantic-code-search-through-MCP" class="common-anchor-header">تضيف claude-context البحث الدلالي عن التعليمات البرمجية من خلال MCP<button data-href="#claude-context-adds-semantic-code-search-through-MCP" class="anchor-icon" translate="no">
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
    </button></h2><p>يحل claude-context مشكلة الاستكشاف المتكرر لقاعدة البرمجة مع الاسترجاع الدلالي. فهو يقوم بفهرسة مستودع وتخزين أجزاء التعليمات البرمجية في قاعدة بيانات متجهة، ويعرض البحث من خلال <a href="https://zilliz.com/glossary/model-context-protocol-%28mcp%29">بروتوكول سياق النموذج</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_2_a0cc547fe3.png" alt="Claude Context repository shown on GitHub Trending in the original article" class="doc-image" id="claude-context-repository-shown-on-github-trending-in-the-original-article" />
   </span> <span class="img-wrapper"> <span>مستودع سياق كلود المعروض على GitHub Trending في المقالة الأصلية</span> </span></p>
<p>في قاعدة الشيفرة الكبيرة، تسأل كلود باستمرار أسئلة مثل</p>
<blockquote>
<p>ساعدني في معرفة أجزاء الشيفرة التي قد تكون مرتبطة بهذا الخطأ.</p>
</blockquote>
<p>بدون طبقة استرجاع، غالبًا ما تكون طريقة كلود الافتراضية هي</p>
<pre><code translate="no" class="language-perl">list the directory
grep around
<span class="hljs-built_in">read</span> a bunch of files
keep guessing
<button class="copy-code-btn"></button></code></pre>
<p>كلود السياق ينقل هذا العمل إلى طبقة استرجاع. تقوم بتجزئة المستودع وتوليد التضمينات، وتخزينها في <a href="https://milvus.io/blog/claude-context-reduce-claude-code-token-usage.md">فهرس شيفرة مدعوم من ميلفوس</a> واسترجاع أجزاء الشيفرة ذات الصلة قبل أن يبدأ النموذج بقراءة الملفات بشكل أعمى.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_11_f9d952830d.png" alt="claude-context flow showing codebase chunking, embeddings, vector database and hybrid search, relevant code retrieval, and Claude context injection" class="doc-image" id="claude-context-flow-showing-codebase-chunking,-embeddings,-vector-database-and-hybrid-search,-relevant-code-retrieval,-and-claude-context-injection" />
   </span> <span class="img-wrapper"> <span>تدفق سياق كلود-سياق كلود الذي يُظهر تقطيع قاعدة الأكواد، والتضمينات، وقاعدة البيانات المتجهة والبحث الهجين، واسترجاع الأكواد ذات الصلة، وحقن سياق كلود</span> </span></p>
<p>هذا هو المكان الذي تبدأ فيه أدوات ترميز الذكاء الاصطناعي في الظهور كأنظمة بحث. أنت بحاجة إلى التقطيع والتضمين والبيانات الوصفية والمطابقة المعجمية والترتيب والتحديث. هذه هي نفس اللبنات الأساسية وراء <a href="https://zilliz.com/blog/top-10-context-engineering-techniques-you-should-know-for-production-rag">استرجاع RAG للإنتاج،</a> <a href="https://milvus.io/blog/build-smarter-rag-routing-hybrid-retrieval.md">وتوجيه الاسترجاع الهجين،</a> <a href="https://milvus.io/blog/choose-embedding-model-rag-2026.md">واختيار نموذج التضمين</a>.</p>
<h2 id="memsearch-keeps-useful-memory-across-sessions-and-agents" class="common-anchor-header">يحتفظ memsearch بالذاكرة المفيدة عبر الجلسات والوكلاء<button data-href="#memsearch-keeps-useful-memory-across-sessions-and-agents" class="anchor-icon" translate="no">
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
    </button></h2><p>يعالج memsearch الجانب الآخر من المشكلة: ليس ما يجب نسيانه، بل كيفية استرجاع ما هو مهم.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_7_d39c2f200e.png" alt="memsearch logo image from the original article" class="doc-image" id="memsearch-logo-image-from-the-original-article" />
   </span> <span class="img-wrapper"> <span>صورة شعار memsearch من المقالة الأصلية</span> </span></p>
<p>تخيل أنك أخبرت كلود يوم الاثنين:</p>
<blockquote>
<p>لا يمكن إعادة محاولة خطاف الويب الخاص بنا عند الفشل - يجب أن تذهب الأحداث الفاشلة إلى قائمة انتظار الحروف الميتة.</p>
</blockquote>
<p>في يوم الأربعاء، تفتح جلسة جديدة وتسأل:</p>
<blockquote>
<p>ما الذي يمكننا تحسينه في طبقة خطاف الويب؟</p>
</blockquote>
<p>بدون ذاكرة دائمة، يتعامل كلود مع قرار يوم الاثنين كما لو أنه لم يحدث أبدًا. تشرح ذلك مرة أخرى.</p>
<p>يخزّن memsearch الذاكرة كملفات Markdown محلية قابلة للقراءة من قبل البشر ويستخدم Milvus كفهرس استرجاع قابل لإعادة البناء. يحافظ هذا التصميم على الذاكرة قابلة للتحرير من قبل البشر بينما يجعلها قابلة للبحث من قبل الوكلاء.</p>
<p>في وقت الاسترجاع، تستخدم memsearch الاسترجاع التدريجي: البحث أولاً، والتوسع إذا لزم الأمر، ثم الانتقال إلى النسخة الأصلية فقط عند الضرورة.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20260507_210137_73d4b0b8ea.png" alt="memsearch progressive retrieval flow showing search, expand, transcript, and summarized return to the main conversation" class="doc-image" id="memsearch-progressive-retrieval-flow-showing-search,-expand,-transcript,-and-summarized-return-to-the-main-conversation" />
   </span> <span class="img-wrapper"> <span>تدفق الاسترجاع التدريجي لـ memsearch الذي يُظهر البحث، والتوسيع، والنسخة، والعودة الملخصة إلى المحادثة الرئيسية</span> </span></p>
<p>هذا النمط الذي يعتمد على التخفيض أولاً مفيد للفرق التي تعمل عبر الجلسات والنماذج والوكلاء. كما أنه يقترن بشكل طبيعي مع <a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">ذاكرة وكلاء الذكاء الاصطناعي طويلة المدى،</a> <a href="https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md">والذاكرة المشتركة متعددة الوك</a>لاء، والمشكلة الأوسع المتمثلة في منع <a href="https://zilliz.com/ai-faq/can-context-engineering-help-reduce-context-rot">تعفن السياق في أنظمة الوكلاء</a>.</p>
<h2 id="How-do-these-tools-work-together" class="common-anchor-header">كيف تعمل هذه الأدوات معًا؟<button data-href="#How-do-these-tools-work-together" class="anchor-icon" translate="no">
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
    </button></h2><p>الأدوات السبعة متكاملة وليست قابلة للتبديل. استخدمها كطبقات.</p>
<table>
<thead>
<tr><th>الطبقات</th><th>استخدام هذه الأدوات</th><th>لماذا</th></tr>
</thead>
<tbody>
<tr><td>إزالة ضوضاء الأوامر</td><td>RTK</td><td>ضغط المخرجات الطرفية ذات الحجم الكبير قبل وصولها إلى Claude.</td></tr>
<tr><td>وضع الحماية لمخرجات الأداة الخام</td><td>وضع السياق</td><td>احتفظ بالسجلات الكبيرة و DOMs وحمولات الأداة خارج المحادثة الرئيسية.</td></tr>
<tr><td>خريطة بنية الكود</td><td>كود-مراجعة-رسم بياني</td><td>أجب عن أسئلة التبعية ونصف قطر الانفجار دون قراءات عمياء للملفات.</td></tr>
<tr><td>قراءة الشيفرة تدريجيًا</td><td>الرمز المنقذ</td><td>ابدأ بملخصات الرموز، ثم توسع فقط حسب الحاجة.</td></tr>
<tr><td>ضغط إجابات كلود</td><td>رجل الكهف</td><td>امنع مخرجات النموذج الخاصة من أن تصبح تضخمًا في السياق في المستقبل.</td></tr>
<tr><td>استرجاع الشيفرة ذات الصلة</td><td>سياق كلود-سياق</td><td>استخدام البحث الدلالي والهجين عن الشيفرة البرمجية بدلاً من حلقات البحث المتكررة</td></tr>
<tr><td>إعادة استخدام القرارات الدائمة</td><td>memsearch</td><td>استرجاع سجل المشروع عبر الجلسات والوكلاء ومفاتيح تبديل النماذج.</td></tr>
</tbody>
</table>
<p>ترتيب الطرح العملي هو</p>
<ol>
<li><strong>أوقف الضوضاء الواضحة أولاً.</strong> أضف RTK أو وضع السياق إذا كانت مخرجات الصدفة وحمولات الأدوات تهيمن على سياقك.</li>
<li><strong>إصلاح التنقل في المستودع.</strong> أضف مخطط مراجعة الكود-الرسم البياني للهيكل أو سياق النص لاسترجاع الكود الدلالي.</li>
<li><strong>تحكم في ما تبقى.</strong> استخدم Token Savior و Caveman لإبقاء قراءات الملفات واستجابات النماذج مضغوطة.</li>
<li><strong>الحفاظ على المعرفة الدائمة.</strong> استخدم memsearch عندما تصبح التفسيرات المتكررة عنق الزجاجة.</li>
</ol>
<h2 id="Keep-in-touch" class="common-anchor-header">ابق على اتصال<button data-href="#Keep-in-touch" class="anchor-icon" translate="no">
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
<li>انضم إلى <a href="https://discord.com/invite/8uyFbECzPX">مجتمع Milvus Discord</a> لطرح الأسئلة ومقارنة أنماط إدارة السياق مع المطورين الآخرين.</li>
<li><a href="https://milvus.io/office-hours">احجز جلسة مجانية في ساعات عمل Milvus المكتبية</a> إذا كنت تريد المساعدة في تصميم طبقة استرجاع للكود أو الذاكرة أو أعباء عمل RAG.</li>
<li>إذا كنت تفضل تخطي إعداد البنية التحتية، فإن <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (Milvus المُدارة من Milvus) تقدم طبقة مجانية للبدء.</li>
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
    </button></h2><p><strong>كيف يمكنني تقليل استخدام رمز كلود كود كلود دون فقدان السياق المفيد؟</strong></p>
<p>ابدأ بضغط المدخلات الأكثر ضوضاءً: مخرجات المنصة وحمولات الأدوات الخام وقراءات التعليمات البرمجية المتكررة. ثم أضف أدوات الاسترجاع مثل claude-context أو code-review-gagram حتى يتمكن كلود من سحب التعليمات البرمجية ذات الصلة بدلاً من استكشاف المستودع من الصفر.</p>
<p><strong>هل يجب استخدام claude-context أو code-review-graph لريبو كبير؟</strong></p>
<p>استخدم claude-context عندما تحتاج إلى بحث دلالي عن الشيفرة البرمجية خاصةً عندما لا تعرف اسم الملف أو الرمز بالضبط. استخدم كود-مراجعة-رسم بياني عندما تحتاج إلى إجابات هيكلية مثل علاقات الاستدعاء والواردات وتبعيات الاختبار ومراجعة نصف قطر الانفجار.</p>
<p><strong>هل تختلف الذاكرة عن استرجاع الشيفرة في كلود كود؟</strong></p>
<p>نعم. استرجاع الكود يعثر على ملفات المشروع أو الرموز ذات الصلة. يسترجع استرجاع الذاكرة القرارات الدائمة، وتفضيلات المستخدم، وسجل التصحيح، والدروس عبر الجلسات. يركز بحث الذاكرة على الذاكرة، بينما يركز سياق كلود كود على استرجاع الكود.</p>
<p><strong>هل تحل هذه الأدوات محل التخزين المؤقت الفوري أو نافذة سياق أكبر؟</strong></p>
<p>لا، فالتخزين المؤقت الفوري ونوافذ السياق الكبيرة تساعد في السعة والتكلفة، لكنها لا تحدد المعلومات التي تستحق الاهتمام. تعمل أدوات إدارة السياق على تحسين جودة وكثافة ما يدخل إلى النموذج في المقام الأول. <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/cccm_11zon_848f7f1c6b.png" alt="cccm 11zon" class="doc-image" id="cccm-11zon" /><span>cccm 11zon</span> </span></p>
