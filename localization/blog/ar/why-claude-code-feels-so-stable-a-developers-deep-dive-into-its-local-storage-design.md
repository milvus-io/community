---
id: >-
  why-claude-code-feels-so-stable-a-developers-deep-dive-into-its-local-storage-design.md
title: >-
  لماذا يبدو كود كلود مستقرًا للغاية: تعمق مطور في تصميم التخزين المحلي الخاص
  بها
author: Bill Chen
date: 2026-01-30T00:00:00.000Z
cover: assets.zilliz.com/cover_Claudecode_storage_81155960ef.jpeg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Claude, Claude Code, Vector Database, Retreival Augmented Generation, Milvus'
meta_keywords: 'Claude Code, AI agent, AI coding assistant, Agent memory'
meta_title: |
  How Claude Code Manages Local Storage for AI Agents
desc: >-
  تعمّق في تخزين Claude Code: سجلات جلسة JSONL، وعزل المشاريع، والتكوين متعدد
  الطبقات، ولقطات الملفات التي تجعل الترميز بمساعدة الذكاء الاصطناعي مستقرًا
  وقابلًا للاسترداد.
origin: >-
  https://milvus.io/blog/why-claude-code-feels-so-stable-a-developers-deep-dive-into-its-local-storage-design.md
---
<p>أصبح كلود كود في كل مكان مؤخرًا. يستخدمه المطورون لشحن الميزات بشكل أسرع، وأتمتة سير العمل، ووضع نماذج أولية للعوامل التي تعمل بالفعل في مشاريع حقيقية. والأمر الأكثر إثارة للدهشة هو عدد الأشخاص غير المبرمجين الذين قفزوا أيضاً - حيث قاموا ببناء الأدوات، وتوصيل المهام، والحصول على نتائج مفيدة دون أي إعداد تقريباً. من النادر رؤية أداة برمجة ذكاء اصطناعي تنتشر بهذه السرعة عبر العديد من مستويات المهارة المختلفة.</p>
<p>لكن ما يبرز حقاً هو مدى <em>استقرارها</em>. يتذكر Claude Code ما حدث عبر الجلسات، وينجو من الأعطال دون فقدان التقدم، ويتصرف كأداة تطوير محلية أكثر من كونه واجهة دردشة. تأتي هذه الموثوقية من كيفية تعامله مع التخزين المحلي.</p>
<p>فبدلاً من التعامل مع جلسة البرمجة على أنها دردشة مؤقتة، يقوم Claude Code بقراءة وكتابة ملفات حقيقية، ويخزن حالة المشروع على القرص، ويسجل كل خطوة من خطوات عمل الوكيل. يمكن استئناف الجلسات أو فحصها أو التراجع عنها دون تخمين، ويبقى كل مشروع معزولاً بشكل نظيف - مما يجنبك مشاكل التلوث المتبادل التي تواجهها العديد من أدوات الوكيل.</p>
<p>في هذا المنشور، سنلقي نظرة فاحصة على بنية التخزين الكامنة وراء هذا الاستقرار، ولماذا تلعب دوراً كبيراً في جعل Claude Code يبدو عملياً للتطوير اليومي.</p>
<h2 id="Challenges-Every-Local-AI-Coding-Assistant-Faces" class="common-anchor-header">التحديات التي يواجهها كل مساعد ترميز ذكاء اصطناعي محلي<button data-href="#Challenges-Every-Local-AI-Coding-Assistant-Faces" class="anchor-icon" translate="no">
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
    </button></h2><p>قبل شرح كيفية تعامل Claude Code مع التخزين، دعونا نلقي نظرة على المشكلات الشائعة التي تواجهها أدوات ترميز الذكاء الاصطناعي المحلية. تظهر هذه المشاكل بشكل طبيعي عندما يعمل المساعد مباشرةً على نظام الملفات الخاص بك ويحتفظ بالحالة مع مرور الوقت.</p>
<p><strong>1. تختلط بيانات المشروع عبر مساحات العمل.</strong></p>
<p>يقوم معظم المطورين بالتبديل بين عدة مستودعات على مدار اليوم. إذا قام المساعد بنقل الحالة من مشروع إلى آخر، يصبح من الصعب فهم سلوكه ويسهل عليه وضع افتراضات غير صحيحة. يحتاج كل مشروع إلى مساحة نظيفة ومعزولة خاصة به للحالة والتاريخ.</p>
<p><strong>2. يمكن أن تتسبب الأعطال في فقدان البيانات.</strong></p>
<p>أثناء جلسة الترميز، ينتج المساعد دفقًا مستمرًا من تعديلات البيانات المفيدة - تعديلات الملفات، واستدعاءات الأدوات، والخطوات الوسيطة. إذا لم يتم حفظ هذه البيانات على الفور، يمكن أن يؤدي التعطل أو إعادة التشغيل القسري إلى محوها. يقوم النظام الموثوق بكتابة الحالة المهمة على القرص بمجرد إنشائها حتى لا يضيع العمل بشكل غير متوقع.</p>
<p><strong>3. ليس من الواضح دائمًا ما فعله الوكيل بالفعل.</strong></p>
<p>تتضمن الجلسة النموذجية العديد من الإجراءات الصغيرة. بدون سجل واضح ومرتب لتلك الإجراءات، من الصعب تتبع كيفية وصول المساعد إلى مخرجات معينة أو تحديد الخطوة التي حدث فيها خطأ ما. السجل الكامل يجعل تصحيح الأخطاء ومراجعتها أكثر سهولة.</p>
<p><strong>4. يتطلب التراجع عن الأخطاء الكثير من الجهد.</strong></p>
<p>في بعض الأحيان يقوم المساعد بإجراء تغييرات لا تعمل تمامًا. إذا لم يكن لديك طريقة مدمجة للتراجع عن هذه التغييرات، فسينتهي بك الأمر بالبحث يدويًا عن التعديلات عبر الريبو. يجب أن يتتبع النظام تلقائيًا ما تم تغييره حتى تتمكن من التراجع عنه بشكل نظيف دون بذل جهد إضافي.</p>
<p><strong>5. تحتاج المشاريع المختلفة إلى إعدادات مختلفة.</strong></p>
<p>تختلف البيئات المحلية. فبعض المشاريع تتطلب أذونات أو أدوات أو قواعد دليل محددة؛ والبعض الآخر لديه نصوص برمجية أو سير عمل مخصص. يحتاج المساعد إلى احترام هذه الاختلافات والسماح بإعدادات لكل مشروع مع الحفاظ على اتساق سلوكه الأساسي.</p>
<h2 id="The-Storage-Design-Principles-Behind-Claude-Code" class="common-anchor-header">مبادئ تصميم التخزين الكامنة وراء كلود كود<button data-href="#The-Storage-Design-Principles-Behind-Claude-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>تصميم تخزين كلود كود مبني على أربع أفكار مباشرة. قد تبدو هذه الأفكار بسيطة، لكنها معًا تعالج المشاكل العملية التي تظهر عندما يعمل مساعد الذكاء الاصطناعي مباشرةً على جهازك وعبر مشاريع متعددة.</p>
<h3 id="1-Each-project-gets-its-own-storage" class="common-anchor-header">1. يحصل كل مشروع على مساحة تخزين خاصة به.</h3><p>يربط كلود كود جميع بيانات الجلسة بدليل المشروع الذي ينتمي إليه. وهذا يعني أن المحادثات والتعديلات والسجلات تبقى مع المشروع الذي أتت منه ولا تتسرب إلى مشاريع أخرى. إن إبقاء التخزين منفصلًا يجعل من السهل فهم سلوك المساعد ويجعل من السهل فحص أو حذف البيانات الخاصة بريبو معين.</p>
<h3 id="2-Data-is-saved-to-disk-right-away" class="common-anchor-header">2. يتم حفظ البيانات على القرص مباشرةً.</h3><p>بدلًا من الاحتفاظ ببيانات التفاعل في الذاكرة، يكتب Claude Code البيانات على القرص فور إنشائها. يتم إلحاق كل حدث - رسالة أو استدعاء أداة أو تحديث حالة - كمدخل جديد. إذا تعطل البرنامج أو تم إغلاقه بشكل غير متوقع، فإن كل شيء تقريبًا يظل موجودًا. هذا النهج يحافظ على استمرارية الجلسات دون إضافة الكثير من التعقيد.</p>
<h3 id="3-Every-action-has-a-clear-place-in-history" class="common-anchor-header">3. كل إجراء له مكان واضح في التاريخ.</h3><p>يربط كود كلود كود كل رسالة وإجراء أداة بالإجراء الذي يسبقها، مما يشكل تسلسلاً كاملاً. هذا التاريخ المرتب يجعل من الممكن مراجعة كيفية تطور الجلسة وتتبع الخطوات التي أدت إلى نتيجة محددة. بالنسبة للمطورين، فإن وجود هذا النوع من التتبع يجعل تصحيح الأخطاء وفهم سلوك الوكيل أسهل بكثير.</p>
<h3 id="4-Code-edits-are-easy-to-roll-back" class="common-anchor-header">4. من السهل التراجع عن التعديلات البرمجية.</h3><p>قبل أن يقوم المساعد بتحديث ملف ما، يحفظ Claude Code لقطة من حالته السابقة. إذا اتضح أن التغيير خاطئ، يمكنك استعادة الإصدار السابق دون البحث في الريبو أو تخمين ما تغير. شبكة الأمان البسيطة هذه تجعل التعديلات التي تعتمد على الذكاء الاصطناعي أقل خطورة بكثير.</p>
<h2 id="Claude-Code-Local-Storage-Layout" class="common-anchor-header">تخطيط التخزين المحلي لكود كلود كود<button data-href="#Claude-Code-Local-Storage-Layout" class="anchor-icon" translate="no">
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
    </button></h2><p>يخزن كلود كود جميع بياناته المحلية في مكان واحد: الدليل الرئيسي الخاص بك. هذا يحافظ على إمكانية التنبؤ بالنظام ويسهل فحصه أو تصحيحه أو تنظيفه عند الحاجة. يتم بناء تخطيط التخزين حول مكونين رئيسيين: ملف تكوين عام صغير ودليل بيانات أكبر حيث تعيش جميع الحالات على مستوى المشروع.</p>
<p><strong>مكونان أساسيان:</strong></p>
<ul>
<li><p><code translate="no">~/.claude.json</code>يخزن التكوين العام والاختصارات العامة، بما في ذلك تعيينات المشروع وإعدادات خادم MCP والمطالبات المستخدمة مؤخرًا.</p></li>
<li><p><code translate="no">~/.claude/</code>دليل البيانات الرئيسي، حيث يخزِّن كلود كود المحادثات وجلسات المشروع والأذونات والمكونات الإضافية والمهارات والمحفوظات وبيانات وقت التشغيل ذات الصلة.</p></li>
</ul>
<p>بعد ذلك، دعنا نلقي نظرة فاحصة على هذين المكونين الأساسيين.</p>
<p><strong>(1) التكوين العام</strong>: <code translate="no">~/.claude.json</code></p>
<p>يعمل هذا الملف كفهرس وليس مخزن بيانات. إنه يسجل المشاريع التي عملت عليها، والأدوات المرفقة بكل مشروع، والمطالبات التي استخدمتها مؤخرًا. لا يتم تخزين بيانات المحادثة نفسها هنا.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;projects&quot;</span>: {
    <span class="hljs-string">&quot;/Users/xxx/my-project&quot;</span>: {
      <span class="hljs-string">&quot;mcpServers&quot;</span>: {
        <span class="hljs-string">&quot;jarvis-tasks&quot;</span>: {
          <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;stdio&quot;</span>,
          <span class="hljs-string">&quot;command&quot;</span>: <span class="hljs-string">&quot;python&quot;</span>,
          <span class="hljs-string">&quot;args&quot;</span>: [<span class="hljs-string">&quot;/path/to/run_mcp.py&quot;</span>]
        }
      }
    }
  },
  <span class="hljs-string">&quot;recentPrompts&quot;</span>: [
    <span class="hljs-string">&quot;Fix the bug in auth module&quot;</span>,
    <span class="hljs-string">&quot;Add unit tests&quot;</span>
  ]
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) دليل البيانات الرئيسي</strong>: <code translate="no">~/.claude/</code></p>
<p>الدليل <code translate="no">~/.claude/</code> هو المكان الذي توجد فيه معظم الحالة المحلية لكلود كود. يعكس هيكله بعض أفكار التصميم الأساسية: عزل المشروع، والمثابرة الفورية، والاسترداد الآمن من الأخطاء.</p>
<pre><code translate="no">~/.claude/
├── settings.json                    <span class="hljs-comment"># Global settings (permissions, plugins, cleanup intervals)</span>
├── settings.local.json              <span class="hljs-comment"># Local settings (machine-specific, not committed to Git)</span>
├── history.jsonl                    <span class="hljs-comment"># Command history</span>
│
├── projects/                        <span class="hljs-comment"># 📁 Session data (organized by project, core directory)</span>
│   └── -Users-xxx-project/          <span class="hljs-comment"># Path-encoded project directory</span>
│       ├── {session-<span class="hljs-built_in">id</span>}.jsonl       <span class="hljs-comment"># Primary session data (JSONL format)</span>
│       └── agent-{agentId}.jsonl    <span class="hljs-comment"># Sub-agent session data</span>
│
├── session-env/                     <span class="hljs-comment"># Session environment variables</span>
│   └── {session-<span class="hljs-built_in">id</span>}/                <span class="hljs-comment"># Isolated by session ID</span>
│
├── skills/                          <span class="hljs-comment"># 📁 User-level skills (globally available)</span>
│   └── mac-mail/
│       └── SKILL.md
│
├── plugins/                         <span class="hljs-comment"># 📁 Plugin management</span>
│   ├── config.json                  <span class="hljs-comment"># Global plugin configuration</span>
│   ├── installed_plugins.json       <span class="hljs-comment"># List of installed plugins</span>
│   ├── known_marketplaces.json      <span class="hljs-comment"># Marketplace source configuration</span>
│   ├── cache/                       <span class="hljs-comment"># Plugin cache</span>
│   └── marketplaces/
│       └── anthropic-agent-skills/
│           ├── .claude-plugin/
│           │   └── marketplace.json
│           └── skills/
│               ├── pdf/
│               ├── docx/
│               └── frontend-design/
│
├── todos/                           <span class="hljs-comment"># Task list storage</span>
│   └── {session-<span class="hljs-built_in">id</span>}-*.json          <span class="hljs-comment"># Session-linked task files</span>
│
├── file-history/                    <span class="hljs-comment"># File edit history (stored by content hash)</span>
│   └── {content-<span class="hljs-built_in">hash</span>}/              <span class="hljs-comment"># Hash-named backup directory</span>
│
├── shell-snapshots/                 <span class="hljs-comment"># Shell state snapshots</span>
├── plans/                           <span class="hljs-comment"># Plan Mode storage</span>
├── local/                           <span class="hljs-comment"># Local tools / node_modules</span>
│   └── claude                       <span class="hljs-comment"># Claude CLI executable</span>
│   └── node_modules/                <span class="hljs-comment"># Local dependencies</span>
│
├── statsig/                         <span class="hljs-comment"># Feature flag cache</span>
├── telemetry/                       <span class="hljs-comment"># Telemetry data</span>
└── debug/                           <span class="hljs-comment"># Debug logs</span>
<button class="copy-code-btn"></button></code></pre>
<p>هذا التصميم بسيط عن قصد: كل شيء يولده كلود كود يعيش تحت دليل واحد، منظم حسب المشروع والجلسة. لا توجد حالة مخفية مبعثرة حول نظامك، ومن السهل فحصها أو تنظيفها عند الضرورة.</p>
<h2 id="How-Claude-Code-Manages-Configuration" class="common-anchor-header">كيف يدير كلود كود التكوين<button data-href="#How-Claude-Code-Manages-Configuration" class="anchor-icon" translate="no">
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
    </button></h2><p>تم تصميم نظام تهيئة Claude Code حول فكرة بسيطة: الحفاظ على اتساق السلوك الافتراضي عبر الأجهزة، مع السماح للبيئات والمشاريع الفردية بتخصيص ما تحتاج إليه. ولتحقيق ذلك، يستخدم كلود كود نموذج تكوين ثلاثي الطبقات. عندما يظهر الإعداد نفسه في أكثر من مكان، تفوز دائمًا الطبقة الأكثر تحديدًا.</p>
<h3 id="The-three-configuration-levels" class="common-anchor-header">مستويات التكوين الثلاثة</h3><p>يقوم كلود كود بتحميل التكوين بالترتيب التالي، من الأقل أولوية إلى الأعلى:</p>
<pre><code translate="no">┌─────────────────────────────────────────┐
│    <span class="hljs-title class_">Project</span>-level configuration          │  <span class="hljs-title class_">Highest</span> priority
│    project/.<span class="hljs-property">claude</span>/settings.<span class="hljs-property">json</span>        │  <span class="hljs-title class_">Project</span>-specific, overrides other configs
├─────────────────────────────────────────┤
│    <span class="hljs-title class_">Local</span> configuration                  │  <span class="hljs-title class_">Machine</span>-specific, not version-controlled
│    ~<span class="hljs-regexp">/.claude/</span>settings.<span class="hljs-property">local</span>.<span class="hljs-property">json</span>        │  <span class="hljs-title class_">Overrides</span> <span class="hljs-variable language_">global</span> configuration
├─────────────────────────────────────────┤
│    <span class="hljs-title class_">Global</span> configuration                 │  <span class="hljs-title class_">Lowest</span> priority
│    ~<span class="hljs-regexp">/.claude/</span>settings.<span class="hljs-property">json</span>              │  <span class="hljs-title class_">Base</span> <span class="hljs-keyword">default</span> configuration
└─────────────────────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<p>يمكنك التفكير في ذلك على أنه بدءًا من الإعدادات الافتراضية العامة، ثم تطبيق التعديلات الخاصة بالجهاز، وأخيرًا تطبيق القواعد الخاصة بالمشروع.</p>
<p>بعد ذلك، سنستعرض كل مستوى من مستويات التكوين بالتفصيل.</p>
<p><strong>(1) التكوين العام</strong>: <code translate="no">~/.claude/settings.json</code></p>
<p>يحدد التكوين العام السلوك الافتراضي لـ Claude Code في جميع المشاريع. هذا هو المكان الذي تقوم فيه بتعيين الأذونات الأساسية وتمكين الإضافات وتهيئة سلوك التنظيف.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;<span class="hljs-variable">$schema</span>&quot;</span>: <span class="hljs-string">&quot;https://json.schemastore.org/claude-code-settings.json&quot;</span>,
  <span class="hljs-string">&quot;permissions&quot;</span>: {
    <span class="hljs-string">&quot;allow&quot;</span>: [<span class="hljs-string">&quot;Read(**)&quot;</span>, <span class="hljs-string">&quot;Bash(npm:*)&quot;</span>],
    <span class="hljs-string">&quot;deny&quot;</span>: [<span class="hljs-string">&quot;Bash(rm -rf:*)&quot;</span>],
    <span class="hljs-string">&quot;ask&quot;</span>: [<span class="hljs-string">&quot;Edit&quot;</span>, <span class="hljs-string">&quot;Write&quot;</span>]
  },
  <span class="hljs-string">&quot;enabledPlugins&quot;</span>: {
    <span class="hljs-string">&quot;document-skills@anthropic-agent-skills&quot;</span>: <span class="hljs-literal">true</span>
  },
  <span class="hljs-string">&quot;cleanupPeriodDays&quot;</span>: 30
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) التكوين المحلي</strong>: <code translate="no">~/.claude/settings.local.json</code></p>
<p>التكوين المحلي خاص بجهاز واحد. لا يُقصد به أن تتم مشاركته أو التحقق منه في التحكم في الإصدار. هذا يجعله مكانًا جيدًا لمفاتيح واجهة برمجة التطبيقات أو الأدوات المحلية أو الأذونات الخاصة بالبيئة.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;permissions&quot;</span>: {
    <span class="hljs-string">&quot;allow&quot;</span>: [<span class="hljs-string">&quot;Bash(git:*)&quot;</span>, <span class="hljs-string">&quot;Bash(docker:*)&quot;</span>]
  },
  <span class="hljs-string">&quot;env&quot;</span>: {
    <span class="hljs-string">&quot;ANTHROPIC_API_KEY&quot;</span>: <span class="hljs-string">&quot;sk-ant-xxx&quot;</span>
  }
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>(3) التكوين على مستوى المشروع</strong>: <code translate="no">project/.claude/settings.json</code></p>
<p>ينطبق التكوين على مستوى المشروع فقط على مشروع واحد وله الأولوية القصوى. هذا هو المكان الذي تحدد فيه القواعد التي يجب تطبيقها دائمًا عند العمل في هذا المستودع.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;permissions&quot;</span>: {
    <span class="hljs-string">&quot;allow&quot;</span>: [<span class="hljs-string">&quot;Bash(pytest:*)&quot;</span>]
  }
}
<button class="copy-code-btn"></button></code></pre>
<p>مع تحديد طبقات التكوين، فإن السؤال التالي هو <strong>كيف يقوم كلود كود بتحديد التكوين والأذونات في وقت التشغيل.</strong></p>
<p>يطبق<strong>Claude Code</strong> التكوين في ثلاث طبقات: يبدأ بالافتراضيات العامة، ثم يطبق التجاوزات الخاصة بالجهاز، وأخيرًا يطبق القواعد الخاصة بالمشروع. عندما يظهر الإعداد نفسه في أماكن متعددة، تكون الأولوية للتكوين الأكثر تحديدًا.</p>
<p>تتبع الأذونات ترتيب تقييم ثابت:</p>
<ol>
<li><p><strong>رفض</strong> - يحظر دائمًا</p></li>
<li><p><strong>طلب</strong> - يتطلب تأكيدًا</p></li>
<li><p><strong>السماح</strong> - يعمل تلقائيًا</p></li>
<li><p><strong>افتراضي</strong> - يطبق فقط في حالة عدم تطابق أي قاعدة</p></li>
</ol>
<p>هذا يحافظ على أمان النظام بشكل افتراضي، مع الاستمرار في منح المشاريع والأجهزة الفردية المرونة التي تحتاجها.</p>
<h2 id="Session-Storage-How-Claude-Code-Persists-Core-Interaction-Data" class="common-anchor-header">تخزين الجلسات: كيف يحتفظ كلود كود ببيانات التفاعل الأساسية<button data-href="#Session-Storage-How-Claude-Code-Persists-Core-Interaction-Data" class="anchor-icon" translate="no">
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
    </button></h2><p>في <strong>كلود</strong> كود، الجلسات هي الوحدة الأساسية للبيانات. تلتقط جلسة العمل التفاعل الكامل بين المستخدم والذكاء الاصطناعي، بما في ذلك المحادثة نفسها، واستدعاءات الأداة، وتغييرات الملفات، والسياق ذي الصلة. إن كيفية تخزين الجلسات لها تأثير مباشر على موثوقية النظام وقابلية تصحيح الأخطاء والسلامة العامة.</p>
<h3 id="Keep-session-data-separate-for-each-project" class="common-anchor-header">الاحتفاظ ببيانات الجلسات منفصلة لكل مشروع</h3><p>بمجرد تحديد الجلسات، فإن السؤال التالي هو كيفية تخزين <strong>Claude Code</strong> لها بطريقة تحافظ على تنظيم البيانات وعزلها.</p>
<p>يعزل<strong>Claude Code</strong> بيانات الجلسات حسب المشروع. يتم تخزين جلسات كل مشروع تحت دليل مشتق من مسار ملف المشروع.</p>
<p>يتبع مسار التخزين هذا النمط:</p>
<p><code translate="no">~/.claude/projects/ + path-encoded project directory</code></p>
<p>لإنشاء اسم دليل صالح، يتم استبدال الأحرف الخاصة مثل <code translate="no">/</code> والمسافات و <code translate="no">~</code> بـ <code translate="no">-</code>.</p>
<p>على سبيل المثال:</p>
<p><code translate="no">/Users/bill/My Project → -Users-bill-My-Project</code></p>
<p>يضمن هذا النهج عدم اختلاط بيانات جلسات العمل من مشاريع مختلفة ويمكن إدارتها أو إزالتها على أساس كل مشروع على حدة.</p>
<h3 id="Why-sessions-are-stored-in-JSONL-format" class="common-anchor-header">لماذا يتم تخزين جلسات العمل بتنسيق JSONL</h3><p>يخزن<strong>Claude Code</strong> بيانات جلسات العمل باستخدام JSONL (خطوط JSONL) بدلاً من JSON القياسية.</p>
<p>في ملف JSON التقليدي، يتم تجميع جميع الرسائل معًا داخل بنية واحدة كبيرة، مما يعني أنه يجب قراءة الملف بأكمله وإعادة كتابته كلما تغير. في المقابل، يخزن JSONL كل رسالة كسطر خاص بها في الملف. سطر واحد يساوي رسالة واحدة، بدون غلاف خارجي.</p>
<table>
<thead>
<tr><th>الجانب</th><th>JSON القياسية</th><th>JSONL (خطوط JSON)</th></tr>
</thead>
<tbody>
<tr><td>كيف يتم تخزين البيانات</td><td>بنية واحدة كبيرة</td><td>رسالة واحدة لكل سطر</td></tr>
<tr><td>متى يتم حفظ البيانات</td><td>عادةً في النهاية</td><td>على الفور، لكل رسالة</td></tr>
<tr><td>تأثير التعطل</td><td>قد ينقطع الملف بأكمله</td><td>يتأثر السطر الأخير فقط</td></tr>
<tr><td>كتابة بيانات جديدة</td><td>إعادة كتابة الملف بأكمله</td><td>إلحاق سطر واحد</td></tr>
<tr><td>استخدام الذاكرة</td><td>تحميل كل شيء</td><td>قراءة سطر بسطر</td></tr>
</tbody>
</table>
<p>تعمل JSONL بشكل أفضل بعدة طرق رئيسية:</p>
<ul>
<li><p><strong>الحفظ الفوري:</strong> تتم كتابة كل رسالة على القرص بمجرد إنشائها، بدلاً من انتظار انتهاء الجلسة.</p></li>
<li><p><strong>مقاومة للأعطال</strong>: إذا تعطل البرنامج، قد تُفقد آخر رسالة غير مكتملة فقط. كل شيء مكتوب قبل ذلك يبقى سليماً.</p></li>
<li><p><strong>إلحاق سريع:</strong> تتم إضافة رسائل جديدة إلى نهاية الملف دون قراءة أو إعادة كتابة البيانات الموجودة.</p></li>
<li><p><strong>استخدام منخفض للذاكرة:</strong> يمكن قراءة ملفات جلسات العمل سطرًا واحدًا في كل مرة، لذلك لا يلزم تحميل الملف بأكمله في الذاكرة.</p></li>
</ul>
<p>يبدو ملف جلسة عمل JSONL المبسط بهذا الشكل:</p>
<pre><code translate="no">{<span class="hljs-string">&quot;type&quot;</span>:<span class="hljs-string">&quot;user&quot;</span>,<span class="hljs-string">&quot;message&quot;</span>:{<span class="hljs-string">&quot;role&quot;</span>:<span class="hljs-string">&quot;user&quot;</span>,<span class="hljs-string">&quot;content&quot;</span>:<span class="hljs-string">&quot;Hello&quot;</span>},<span class="hljs-string">&quot;timestamp&quot;</span>:<span class="hljs-string">&quot;2026-01-05T10:00:00Z&quot;</span>}
{<span class="hljs-string">&quot;type&quot;</span>:<span class="hljs-string">&quot;assistant&quot;</span>,<span class="hljs-string">&quot;message&quot;</span>:{<span class="hljs-string">&quot;role&quot;</span>:<span class="hljs-string">&quot;assistant&quot;</span>,<span class="hljs-string">&quot;content&quot;</span>:[{<span class="hljs-string">&quot;type&quot;</span>:<span class="hljs-string">&quot;text&quot;</span>,<span class="hljs-string">&quot;text&quot;</span>:<span class="hljs-string">&quot;Hi!&quot;</span>}]}}
{<span class="hljs-string">&quot;type&quot;</span>:<span class="hljs-string">&quot;user&quot;</span>,<span class="hljs-string">&quot;message&quot;</span>:{<span class="hljs-string">&quot;role&quot;</span>:<span class="hljs-string">&quot;user&quot;</span>,<span class="hljs-string">&quot;content&quot;</span>:<span class="hljs-string">&quot;Help me fix this bug&quot;</span>}}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Session-message-types" class="common-anchor-header">أنواع رسائل جلسة العمل</h3><p>يسجل ملف جلسة العمل كل ما يحدث أثناء التفاعل مع Claude Code. للقيام بذلك بوضوح، فإنه يستخدم أنواع رسائل مختلفة لأنواع مختلفة من الأحداث.</p>
<ul>
<li><p>تمثل<strong>رسائل المستخدم</strong> المدخلات الجديدة القادمة إلى النظام. وهذا لا يشمل فقط ما يكتبه المستخدم، بل يشمل أيضًا النتائج التي تُرجعها الأدوات، مثل مخرجات أمر shell. من وجهة نظر الذكاء الاصطناعي، كلاهما مدخلات يحتاج إلى الاستجابة لها.</p></li>
<li><p>تلتقط<strong>الرسائل المساعدة</strong> ما يفعله كلود استجابةً لذلك. تتضمن هذه الرسائل منطق الذكاء الاصطناعي، والنص الذي يولده، وأي أدوات يقرر استخدامها. كما أنها تسجّل تفاصيل الاستخدام، مثل عدد الرموز الرمزية، لتوفير صورة كاملة للتفاعل.</p></li>
<li><p><strong>لقطات محفوظات الملفات</strong> هي نقاط تفتيش للسلامة يتم إنشاؤها قبل أن يقوم كلود بتعديل أي ملفات. من خلال حفظ حالة الملف الأصلي أولاً، يتيح كلود كود إمكانية التراجع عن التغييرات إذا حدث خطأ ما.</p></li>
<li><p>توفر<strong>الملخصات</strong> نظرة عامة موجزة عن الجلسة وترتبط بالنتيجة النهائية. فهي تسهل فهم ما كانت عليه الجلسة دون إعادة تشغيل كل خطوة.</p></li>
</ul>
<p>لا تسجل أنواع الرسائل هذه معًا ليس فقط المحادثة، ولكن التسلسل الكامل للإجراءات والتأثيرات التي تحدث أثناء الجلسة.</p>
<p>لجعل هذا الأمر أكثر وضوحًا، دعنا نلقي نظرة على أمثلة محددة لرسائل المستخدم والرسائل المساعدة.</p>
<p><strong>(1) مثال على رسائل المستخدم:</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>,
  <span class="hljs-string">&quot;uuid&quot;</span>: <span class="hljs-string">&quot;7d90e1c9-e727-4291-8eb9-0e7b844c4348&quot;</span>,
  <span class="hljs-string">&quot;parentUuid&quot;</span>: <span class="hljs-literal">null</span>,
  <span class="hljs-string">&quot;sessionId&quot;</span>: <span class="hljs-string">&quot;e5d52290-e2c1-41d6-8e97-371401502fdf&quot;</span>,
  <span class="hljs-string">&quot;timestamp&quot;</span>: <span class="hljs-string">&quot;2026-01-05T10:00:00.000Z&quot;</span>,
  <span class="hljs-string">&quot;message&quot;</span>: {
    <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>,
    <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Analyze the architecture of this project&quot;</span>
  },
  <span class="hljs-string">&quot;cwd&quot;</span>: <span class="hljs-string">&quot;/Users/xxx/project&quot;</span>,
  <span class="hljs-string">&quot;gitBranch&quot;</span>: <span class="hljs-string">&quot;main&quot;</span>,
  <span class="hljs-string">&quot;version&quot;</span>: <span class="hljs-string">&quot;2.0.76&quot;</span>
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) مثال رسائل المساعد:</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;assistant&quot;</span>,
  <span class="hljs-string">&quot;uuid&quot;</span>: <span class="hljs-string">&quot;e684816e-f476-424d-92e3-1fe404f13212&quot;</span>,
  <span class="hljs-string">&quot;parentUuid&quot;</span>: <span class="hljs-string">&quot;7d90e1c9-e727-4291-8eb9-0e7b844c4348&quot;</span>,
  <span class="hljs-string">&quot;message&quot;</span>: {
    <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;assistant&quot;</span>,
    <span class="hljs-string">&quot;model&quot;</span>: <span class="hljs-string">&quot;claude-opus-4-5-20251101&quot;</span>,
    <span class="hljs-string">&quot;content&quot;</span>: [
      {
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;thinking&quot;</span>,
        <span class="hljs-string">&quot;thinking&quot;</span>: <span class="hljs-string">&quot;The user wants to understand the project architecture, so I need to check the directory structure first...&quot;</span>
      },
      {
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>,
        <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Let me take a look at the project structure first.&quot;</span>
      },
      {
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;tool_use&quot;</span>,
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-string">&quot;toolu_01ABC&quot;</span>,
        <span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;Bash&quot;</span>,
        <span class="hljs-string">&quot;input&quot;</span>: {<span class="hljs-string">&quot;command&quot;</span>: <span class="hljs-string">&quot;ls -la&quot;</span>}
      }
    ],
    <span class="hljs-string">&quot;usage&quot;</span>: {
      <span class="hljs-string">&quot;input_tokens&quot;</span>: <span class="hljs-number">1500</span>,
      <span class="hljs-string">&quot;output_tokens&quot;</span>: <span class="hljs-number">200</span>,
      <span class="hljs-string">&quot;cache_read_input_tokens&quot;</span>: <span class="hljs-number">50000</span>
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-Session-Messages-Are-Linked" class="common-anchor-header">كيف ترتبط رسائل الجلسة</h3><p>لا يقوم Claude Code بتخزين رسائل الجلسة كمدخلات معزولة. بدلاً من ذلك، فإنه يربطها معًا لتكوين سلسلة واضحة من الأحداث. تتضمن كل رسالة معرّفًا فريدًا (<code translate="no">uuid</code>) ومرجعًا للرسالة التي جاءت قبلها (<code translate="no">parentUuid</code>). هذا يجعل من الممكن معرفة ليس فقط ما حدث، ولكن لماذا حدث ذلك.</p>
<p>تبدأ الجلسة برسالة مستخدم، والتي تبدأ السلسلة. يشير كل رد من كلود إلى الرسالة التي تسببت في حدوثها. تتم إضافة مكالمات الأدوات ومخرجاتها بنفس الطريقة، مع ربط كل خطوة بالخطوة التي تسبقها. عندما تنتهي الجلسة، يتم إرفاق ملخص بالرسالة النهائية.</p>
<p>نظرًا لارتباط كل خطوة، يمكن لـ Claude Code إعادة تشغيل التسلسل الكامل للإجراءات وفهم كيفية إنتاج النتيجة، مما يجعل التصحيح والتحليل أسهل بكثير.</p>
<h2 id="Making-Code-Changes-Easy-to-Undo-with-File-Snapshots" class="common-anchor-header">تسهيل التراجع عن تغييرات التعليمات البرمجية باستخدام لقطات الملفات<button data-href="#Making-Code-Changes-Easy-to-Undo-with-File-Snapshots" class="anchor-icon" translate="no">
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
    </button></h2><p>لا تكون التعديلات التي يتم إنشاؤها بالذكاء الاصطناعي صحيحة دائمًا، وأحيانًا تسير في الاتجاه الخاطئ تمامًا. لجعل هذه التغييرات آمنة للتجربة، يستخدم Claude Code نظام لقطات بسيط يتيح لك التراجع عن التعديلات دون البحث في الاختلافات أو تنظيف الملفات يدويًا.</p>
<p>الفكرة واضحة ومباشرة: <strong>قبل أن يقوم كلود كود بتعديل ملف ما، يحفظ نسخة من المحتوى الأصلي.</strong> إذا تبين أن التعديل كان خطأً، يمكن للنظام استعادة النسخة السابقة على الفور.</p>
<h3 id="What-is-a-file-history-snapshot" class="common-anchor-header">ما هي <em>لقطة تاريخ الملف</em>؟</h3><p><em>لقطة تاريخ الملف</em> هي نقطة تدقيق تم إنشاؤها قبل تعديل الملفات. وهي تسجل المحتوى الأصلي لكل ملف يوشك <strong>كلود</strong> على تحريره. تعمل هذه اللقطات كمصدر بيانات لعمليات التراجع والاسترجاع.</p>
<p>عندما يرسل أحد المستخدمين رسالة قد تغير الملفات، يقوم <strong>كلود كود</strong> بإنشاء لقطة فارغة لتلك الرسالة. قبل التحرير، يقوم النظام بعمل نسخة احتياطية من المحتوى الأصلي لكل ملف مستهدف في اللقطة، ثم يطبق التعديلات مباشرةً على القرص. إذا قام المستخدم بتشغيل <em>عملية التراجع،</em> يستعيد <strong>Claude Code</strong> المحتوى المحفوظ ويكتب فوق الملفات المعدّلة.</p>
<p>من الناحية العملية، تبدو دورة حياة التعديل القابل للتراجع كما يلي:</p>
<ol>
<li><p><strong>يرسل المستخدم رسالة</strong>يقوم<strong>كلود</strong>كود بإنشاء سجل جديد فارغ <code translate="no">file-history-snapshot</code>.</p></li>
<li><p><strong>كلود يستعد لتعديل الملفاتيحدد</strong>النظام الملفات التي سيتم تحريرها ويقوم بعمل نسخة احتياطية من محتواها الأصلي في <code translate="no">trackedFileBackups</code>.</p></li>
<li><p>يقوم<strong>كلود بتنفيذ</strong>التعديليتم إجراء عمليات<strong>التحرير</strong>والكتابة، ويتم كتابة المحتوى المعدل على القرص.</p></li>
<li><p><strong>يقوم المستخدم بتشغيل عملية التراجعيضغط</strong>المستخدم على <strong>Esc + Esc،</strong> مما يشير إلى أنه يجب التراجع عن التغييرات.</p></li>
<li><p><strong>تتم استعادة المحتوى الأصلييتم استعادة المحتوى الأصلييقوم كلود</strong>كود بقراءة المحتوى المحفوظ من <code translate="no">trackedFileBackups</code> ويكتب فوق الملفات الحالية، ويكمل عملية التراجع.</p></li>
</ol>
<h3 id="Why-Undo-Works-Snapshots-Save-the-Old-Version" class="common-anchor-header">لماذا يعمل التراجع: اللقطات تحفظ الإصدار القديم</h3><p>يعمل التراجع في كلود كود لأن النظام يحفظ محتوى الملف <em>الأصلي</em> قبل حدوث أي تعديل.</p>
<p>فبدلاً من محاولة عكس التغييرات بعد حدوثها، يتبع كلود كود نهجًا أبسط: فهو ينسخ الملف كما كان موجودًا <em>قبل</em> التعديل ويخزن تلك النسخة في <code translate="no">trackedFileBackups</code>. عندما يقوم المستخدم بتشغيل عملية التراجع، يستعيد النظام هذه النسخة المحفوظة ويستبدل الملف الذي تم تعديله.</p>
<p>يوضح الرسم البياني أدناه هذا التدفق خطوة بخطوة:</p>
<pre><code translate="no">┌─────────────────────────┐
│    before edit,  app.py │
│    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;old&quot;</span>)         │───────→  Backed up into snapshot trackedFileBackups
└─────────────────────────┘

↓

┌──────────────────────────┐
│   After Claude edits     │
│    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;new&quot;</span>)          │───────→  Written to disk (overwrites the original file)
└──────────────────────────┘

↓

┌──────────────────────────┐
│    User triggers undo    │
│    Press   Esc + Esc     │───────→ Restore <span class="hljs-string">&quot;old&quot;</span> content to disk <span class="hljs-keyword">from</span> snapshot
└──────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<h3 id="What-a-file-History-snapshot-Looks-Like-Internally" class="common-anchor-header">كيف تبدو <em>لقطة ملف-تاريخ</em> الملف داخلياً</h3><p>يتم تخزين اللقطة نفسها كسجل منظم. وهو يلتقط البيانات الوصفية حول رسالة المستخدم، ووقت اللقطة، والأهم من ذلك - خريطة للملفات بمحتوياتها الأصلية.</p>
<p>يوضح المثال أدناه سجلاً واحداً <code translate="no">file-history-snapshot</code> تم إنشاؤه قبل أن يقوم كلود بتحرير أي ملفات. يخزّن كل إدخال في <code translate="no">trackedFileBackups</code> محتوى الملف <em>قبل</em> التعديل، والذي يُستخدم لاحقًا لاستعادة الملف أثناء عملية التراجع.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;file-history-snapshot&quot;</span>,
  <span class="hljs-string">&quot;messageId&quot;</span>: <span class="hljs-string">&quot;7d90e1c9-e727-4291-8eb9-0e7b844c4348&quot;</span>,
  <span class="hljs-string">&quot;snapshot&quot;</span>: {
    <span class="hljs-string">&quot;messageId&quot;</span>: <span class="hljs-string">&quot;7d90e1c9-e727-4291-8eb9-0e7b844c4348&quot;</span>,
    <span class="hljs-string">&quot;trackedFileBackups&quot;</span>: {
      <span class="hljs-string">&quot;/path/to/file1.py&quot;</span>: <span class="hljs-string">&quot;Original file content\ndef hello():\n    print(&#x27;old&#x27;)&quot;</span>,
      <span class="hljs-string">&quot;/path/to/file2.js&quot;</span>: <span class="hljs-string">&quot;// Original content...&quot;</span>
    },
    <span class="hljs-string">&quot;timestamp&quot;</span>: <span class="hljs-string">&quot;2026-01-05T10:00:00.000Z&quot;</span>
  },
  <span class="hljs-string">&quot;isSnapshotUpdate&quot;</span>: <span class="hljs-literal">false</span>
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Where-Snapshots-Are-Stored-and-How-Long-They-Are-Kept" class="common-anchor-header">مكان تخزين اللقطات ومدة الاحتفاظ بها</h3><ul>
<li><p><strong>مكان تخزين البيانات الوصفية للقطات</strong>: يتم ربط سجلات اللقطات بجلسة عمل محددة ويتم حفظها كملفات JSONL ضمن<code translate="no">~/.claude/projects/-path-to-project/{session-id}.jsonl</code>.</p></li>
<li><p><strong>حيث يتم الاحتفاظ بنسخة احتياطية من محتويات الملف الأصلي</strong>: يتم تخزين محتوى ما قبل التحرير لكل ملف بشكل منفصل حسب تجزئة المحتوى تحت<code translate="no">~/.claude/file-history/{content-hash}/</code>.</p></li>
<li><p><strong>مدة الاحتفاظ باللقطات افتراضيًا</strong>: يتم الاحتفاظ ببيانات اللقطات لمدة 30 يومًا، بما يتوافق مع الإعداد العام <code translate="no">cleanupPeriodDays</code>.</p></li>
<li><p><strong>كيفية تغيير فترة الاحتفاظ</strong>: يمكن تعديل عدد أيام الاحتفاظ عبر الحقل <code translate="no">cleanupPeriodDays</code> في <code translate="no">~/.claude/settings.json</code>.</p></li>
</ul>
<h3 id="Related-Commands" class="common-anchor-header">الأوامر ذات الصلة</h3><table>
<thead>
<tr><th>الأمر/الإجراء</th><th>الوصف</th></tr>
</thead>
<tbody>
<tr><td>إسك + إسك</td><td>التراجع عن آخر جولة من عمليات تحرير الملفات (الأكثر استخدامًا)</td></tr>
<tr><td>/ترجيع</td><td>العودة إلى نقطة تفتيش محددة مسبقًا (لقطة)</td></tr>
<tr><td>/ديف</td><td>عرض الاختلافات بين الملف الحالي والنسخة الاحتياطية للملف الحالي واللقطة الاحتياطية</td></tr>
</tbody>
</table>
<h2 id="Other-Important-Directories" class="common-anchor-header">دلائل مهمة أخرى<button data-href="#Other-Important-Directories" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>(1) المكونات الإضافية/ - إدارة المكونات الإضافية</strong></p>
<p>يخزن الدليل <code translate="no">plugins/</code> الإضافات التي تمنح كلود كود قدرات إضافية.</p>
<p>يخزن هذا الدليل <em>الإضافات</em> المثبتة، ومن أين أتت، والمهارات الإضافية التي توفرها تلك الإضافات. كما أنه يحتفظ بنسخ محلية من الإضافات التي تم تنزيلها حتى لا تحتاج إلى جلبها مرة أخرى.</p>
<pre><code translate="no">~/.claude/plugins/
├── config.json
│   Global plugin configuration (e.g., <span class="hljs-built_in">enable</span>/disable rules)
├── installed_plugins.json
│   List of installed plugins (including version and status)
├── known_marketplaces.json
│   Plugin marketplace <span class="hljs-built_in">source</span> configuration (e.g., Anthropic official marketplace)
├── cache/
│   Plugin download cache (avoids repeated downloads)
└── marketplaces/
    Marketplace <span class="hljs-built_in">source</span> storage
    └── anthropic-agent-skills/
        Official plugin marketplace
        ├── .claude-plugin/
        │   └── marketplace.json
        │       Marketplace metadata
        └── skills/
            Skills provided by the marketplace
            ├── pdf/
            │   PDF-related skills
            ├── docx/
            │   Word document processing skills
            └── frontend-design/
                Frontend design skills
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) المهارات/ - مكان تخزين المهارات وتطبيقها</strong></p>
<p>في Claude Code، المهارة هي قدرة صغيرة قابلة لإعادة الاستخدام تساعد كلود على أداء مهمة محددة، مثل العمل مع ملفات PDF، أو تحرير المستندات، أو اتباع سير عمل برمجي.</p>
<p>لا تتوفر جميع المهارات في كل مكان. فبعضها ينطبق على مستوى العالم، في حين أن بعضها الآخر يقتصر على مشروع واحد أو يتم توفيره بواسطة مكون إضافي. يُخزِّن Claude Code المهارات في مواقع مختلفة للتحكم في مكان استخدام كل مهارة.</p>
<p>يُظهر التسلسل الهرمي أدناه كيف يتم تصنيف المهارات حسب النطاق، من المهارات المتاحة عالميًا إلى المهارات الخاصة بالمشروع والمقدمة من قبل المكوّنات الإضافية.</p>
<table>
<thead>
<tr><th>المستوى</th><th>موقع التخزين</th><th>الوصف</th></tr>
</thead>
<tbody>
<tr><td>المستخدم</td><td>~/.claude/skills/</td><td>متاح عالمياً، ويمكن الوصول إليه من قبل جميع المشاريع</td></tr>
<tr><td>المشروع</td><td>المشروع/.claude/skills/</td><td>متاح فقط للمشروع الحالي، التخصيص الخاص بالمشروع الحالي</td></tr>
<tr><td>المكوّن الإضافي</td><td>~/.claude/plugins/ الأسواق/*/المهارات/</td><td>مثبت مع المكونات الإضافية، يعتمد على حالة تمكين المكون الإضافي</td></tr>
</tbody>
</table>
<p><strong>(3) todos/- تخزين قوائم المهام</strong></p>
<p>يقوم الدليل <code translate="no">todos/</code> بتخزين قوائم المهام التي ينشئها كلود لتتبع العمل أثناء المحادثة، مثل الخطوات التي يجب إكمالها، والعناصر قيد التقدم، والمهام المكتملة.</p>
<p>تُحفظ قوائم المهام كملفات JSON ضمن<code translate="no">~/.claude/todos/{session-id}-*.json</code>.يتضمن كل اسم ملف معرّف الجلسة، والذي يربط قائمة المهام بمحادثة معينة.</p>
<p>تأتي محتويات هذه الملفات من الأداة <code translate="no">TodoWrite</code> وتتضمن معلومات المهام الأساسية مثل وصف المهمة والحالة الحالية والأولوية والبيانات الوصفية ذات الصلة.</p>
<p><strong>(4) محلي/ - وقت التشغيل المحلي والأدوات المحلية</strong></p>
<p>يحتوي الدليل <code translate="no">local/</code> على الملفات الأساسية التي يحتاجها كلود كود للتشغيل على جهازك.</p>
<p>ويتضمن ذلك سطر الأوامر القابل للتنفيذ <code translate="no">claude</code> والدليل <code translate="no">node_modules/</code> الذي يحتوي على تبعيات وقت التشغيل. من خلال الاحتفاظ بهذه المكونات محلية، يمكن تشغيل Claude Code بشكل مستقل، دون الاعتماد على الخدمات الخارجية أو التثبيتات على مستوى النظام.</p>
<p><strong>（5） دلائل الدعم الإضافية</strong></p>
<ul>
<li><p><strong>shell-snapshots/:</strong> يخزّن لقطات حالة جلسة عمل الصدفة (مثل الدليل الحالي ومتغيرات البيئة)، مما يتيح استرجاع عملية الصدفة.</p></li>
<li><p><strong>خطط/:</strong> تخزين خطط التنفيذ التي تم إنشاؤها بواسطة وضع الخطة (على سبيل المثال، التفصيلات التفصيلية لمهام البرمجة متعددة الخطوات).</p></li>
<li><p><strong>statsig/:</strong> تخزين تكوينات علامة الميزة بشكل مؤقت (مثل ما إذا كانت الميزات الجديدة ممكّنة) لتقليل الطلبات المتكررة.</p></li>
<li><p><strong>القياس عن بُعد/:</strong> تخزين بيانات القياس عن بُعد المجهولة (مثل تكرار استخدام الميزات) لتحسين المنتج.</p></li>
<li><p><strong>التصحيح/:</strong> تخزين سجلات التصحيح (بما في ذلك مكدسات الأخطاء وتتبع التنفيذ) للمساعدة في استكشاف الأخطاء وإصلاحها.</p></li>
</ul>
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
    </button></h2><p>بعد التعمق في كيفية تخزين Claude Code وإدارة كل شيء محليًا، تصبح الصورة واضحة جدًا: تبدو الأداة مستقرة لأن الأساس متين. لا شيء خيالي - مجرد هندسة مدروسة. كل مشروع له مساحة خاصة به، وكل إجراء يتم تدوينه، ويتم نسخ تعديلات الملفات احتياطيًا قبل أن يتغير أي شيء. إنه نوع من التصميم الذي يقوم بعمله بهدوء ويتيح لك التركيز على عملك.</p>
<p>أكثر ما يعجبني هو أنه لا يوجد شيء غامض هنا. كلود كود يعمل بشكل جيد لأن الأساسيات تتم بشكل صحيح. إذا كنت قد حاولت من قبل بناء وكيل يلمس ملفات حقيقية، فأنت تعرف مدى سهولة انهيار الأمور - تختلط الحالات، وتختلط الحالات، وتمسح الأعطال التقدم، ويصبح التراجع تخمينًا. يتجنب Claude Code كل ذلك من خلال نموذج تخزين بسيط ومتسق ويصعب كسره.</p>
<p>بالنسبة للفرق التي تقوم ببناء وكلاء ذكاء اصطناعي محليين أو داخل الشركة، خاصةً في البيئات الآمنة، يوضح هذا النهج كيف أن التخزين القوي والمثابرة يجعلان أدوات الذكاء الاصطناعي موثوقة وعملية للتطوير اليومي.</p>
<p>إذا كنت تصمم وكلاء ذكاء اصطناعيًا محليًا أو محليًا وترغب في مناقشة بنية التخزين أو تصميم الجلسات أو الاستعادة الآمنة بمزيد من التفاصيل، فلا تتردد في الانضمام إلى <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">قناة Slack</a> الخاصة بنا، ويمكنك أيضًا حجز موعد فردي لمدة 20 دقيقة من خلال <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">ساعات عمل Milvus المكتبية</a> للحصول على إرشادات مخصصة.</p>
