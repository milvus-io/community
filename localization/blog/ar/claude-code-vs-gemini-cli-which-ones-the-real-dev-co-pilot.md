---
id: claude-code-vs-gemini-cli-which-ones-the-real-dev-co-pilot.md
title: 'Claude Code مقابل Gemini CLI: أيهما مساعد المطور الحقيقي؟'
author: Min Yin
date: 2025-07-09T00:00:00.000Z
desc: >-
  قارن بين Gemini CLI و Claude Code، وهما أداتا ترميز بالذكاء الاصطناعي تعملان
  على تحويل سير العمل في المحطة الطرفية. أيهما يجب أن يدعم مشروعك القادم؟
cover: assets.zilliz.com/Claude_Code_vs_Gemini_CLI_e3a04a49cf.jpeg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, Gemini, Claude'
meta_keywords: >-
  Claude Code, Gemini CLI, Natural Language Coding, Vibe Coding, AI Coding
  Assistants
meta_title: |
  Claude Code vs Gemini CLI: Who’s the Real Dev Co-Pilot?
origin: >-
  https://milvus.io/blog/claude-code-vs-gemini-cli-which-ones-the-real-dev-co-pilot.md
---
<p>IDE الخاص بك متضخم. مساعد الترميز الخاص بك قديم. وما زلت عالقًا في النقر بزر الماوس الأيمن لإعادة البناء؟ مرحباً بك في نهضة CLI.</p>
<p>يتطور مساعدي البرمجة بالذكاء الاصطناعي من أدوات للتحايل إلى أدوات مفضلة للمطورين. فبالإضافة إلى "كورسور" (Cursor) الذي يعدّ من الشركات الناشئة، يجلب <a href="https://www.anthropic.com/claude-code"><strong>كلود كود</strong></a> <strong>من أنثروبيك</strong> الدقة والصقل. <a href="https://github.com/google-gemini/gemini-cli"><strong>Gemini CLI</strong></a> من جوجل سريعة ومجانية ومتعطشة للسياق. كلاهما يعد بجعل اللغة الطبيعية هي البرمجة النصية الجديدة للغة الصدفة. إذًا أيهما يجب <em>أن</em> تثق به لإعادة هيكلة الريبو التالي؟</p>
<p>مما رأيته، كان لـ Claude Code الصدارة المبكرة. لكن اللعبة تغيرت بسرعة. بعد إطلاق Gemini CLI، تهافت المطورون عليه - حيث<strong>حصل على 15.1 ألف نجمة على GitHub في غضون 24 ساعة.</strong> وحتى الآن، تجاوز عدد نجومه <strong>55,000 نجمة</strong> وما زال العدد يتزايد. مذهل!</p>
<p>إليكم هذه الوجبات السريعة حول سبب تحمس الكثير من المطورين ل Gemini CLI:</p>
<ul>
<li><p><strong>إنه مفتوح المصدر تحت Apache 2.0 ومجاني تمامًا:</strong> يتصل Gemini CLI بنموذج فلاش Gemini 2.0 من Google من الدرجة الأولى دون أي تكلفة. ما عليك سوى تسجيل الدخول باستخدام حسابك الشخصي على Google للوصول إلى Gemini Code Assist. خلال فترة المعاينة، يمكنك الحصول على ما يصل إلى 60 طلبًا في الدقيقة و1000 طلب يومي - كل ذلك مجانًا.</p></li>
<li><p><strong>إنها قوة حقيقية متعددة المهام:</strong> بالإضافة إلى البرمجة (أقوى ما يميزه)، فهو يتعامل مع إدارة الملفات، وإنشاء المحتوى، والتحكم في البرامج النصية، وحتى قدرات البحث العميق.</p></li>
<li><p><strong>إنه خفيف الوزن:</strong> يمكنك تضمينه بسلاسة في البرامج النصية الطرفية أو استخدامه كعامل مستقل.</p></li>
<li><p><strong>يوفر طول سياق طويل:</strong> مع مليون رمز من السياق (حوالي 750,000 كلمة)، يمكنه استيعاب قواعد برمجية كاملة للمشاريع الأصغر حجماً في مسار واحد.</p></li>
</ul>
<h2 id="Why-Developers-Are-Ditching-IDEs-for-AI-Powered-Terminals" class="common-anchor-header">لماذا يتخلى المطورون عن المُعرّفات البرمجية IDEs لصالح المنصات التي تعمل بالذكاء الاصطناعي<button data-href="#Why-Developers-Are-Ditching-IDEs-for-AI-Powered-Terminals" class="anchor-icon" translate="no">
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
    </button></h2><p>لماذا هذا الحماس لهذه الأدوات القائمة على المحطات الطرفية؟ بصفتكم مطورين، ربما شعرتم بهذا الألم: فالمُعرّفات IDEs التقليدية تحتوي على ميزات مثيرة للإعجاب، ولكنها تأتي مع تعقيدات في سير العمل تقتل الزخم. هل تريد إعادة هيكلة وظيفة واحدة؟ تحتاج إلى تحديد الشيفرة، والنقر بزر الماوس الأيمن لقائمة السياق، والانتقال إلى "إعادة الهيكلة"، واختيار نوع إعادة الهيكلة المحدد، وتهيئة الخيارات في مربع حوار، وأخيرًا تطبيق التغييرات.</p>
<p><strong>لقد غيّرت أدوات الذكاء الاصطناعي الطرفية سير العمل هذا من خلال تبسيط جميع العمليات في أوامر اللغة الطبيعية.</strong> فبدلاً من حفظ بناء جملة الأوامر، يمكنك ببساطة أن تقول: &quot;<em>ساعدني في إعادة هيكلة هذه الدالة لتحسين سهولة القراءة</em>&quot;، وتراقب الأداة وهي تتعامل مع العملية بأكملها.</p>
<p>هذه ليست مجرد راحة - إنها نقلة أساسية في طريقة تفكيرنا. تتحول العمليات التقنية المعقدة إلى محادثات بلغة طبيعية، مما يحررنا من التركيز على منطق الأعمال بدلاً من آليات الأدوات.</p>
<h2 id="Claude-Code-or-Gemini-CLI-Choose-Your-Co-Pilot-Wisely" class="common-anchor-header">كلود كود أو Gemini CLI؟ اختر برنامجك المساعد بحكمة<button data-href="#Claude-Code-or-Gemini-CLI-Choose-Your-Co-Pilot-Wisely" class="anchor-icon" translate="no">
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
    </button></h2><p>نظرًا لأن Claude Code شائع جدًا وسهل الاستخدام، وقد هيمن على الاعتماد سابقًا، فكيف يمكن مقارنته بـ Gemini CLI الجديد؟ كيف يجب أن نختار بين الاثنين؟ دعونا نلقي نظرة فاحصة على أدوات ترميز الذكاء الاصطناعي هذه.</p>
<h3 id="1-Cost-Free-vs-Paid" class="common-anchor-header"><strong>1. التكلفة: المجانية مقابل المدفوعة</strong></h3><ul>
<li><p><strong>Gemini CLI</strong> مجاني تمامًا مع أي حساب في Google، ويوفر 1000 طلب في اليوم و60 طلبًا في الدقيقة، دون الحاجة إلى إعداد فواتير.</p></li>
<li><p>يتطلب<strong>Claude Code</strong> اشتراكًا نشطًا من أنثروبيك ويتبع نموذج الدفع لكل استخدام، ولكنه يتضمن أمانًا ودعمًا على مستوى المؤسسات وهو أمر ذو قيمة للمشاريع التجارية.</p></li>
</ul>
<h3 id="2-Context-Window-How-Much-Code-Can-It-See" class="common-anchor-header"><strong>2. نافذة السياق: ما مقدار الكود الذي يمكن رؤيته؟</strong></h3><ul>
<li><p><strong>Gemini CLI:</strong> 1 مليون رمز (حوالي 750,000 كلمة)</p></li>
<li><p><strong>كود كلود:</strong> حوالي 200,000 رمز (حوالي 150,000 كلمة)</p></li>
</ul>
<p>تمكّن نوافذ السياق الأكبر النماذج من الرجوع إلى المزيد من محتوى الإدخال عند إنشاء الاستجابات. كما أنها تساعد في الحفاظ على تماسك المحادثة في الحوارات متعددة الأدوار، مما يمنح النموذج ذاكرة أفضل للمحادثة بأكملها.</p>
<p>بشكل أساسي، يمكن لـ Gemini CLI تحليل مشروعك الصغير إلى المتوسط بالكامل في جلسة واحدة، مما يجعله مثاليًا لفهم قواعد الشفرات الكبيرة والعلاقات عبر الملفات. يعمل Claude Code بشكل أفضل عندما تركز على ملفات أو وظائف محددة.</p>
<h3 id="3-Code-Quality-vs-Speed" class="common-anchor-header"><strong>3. جودة الكود مقابل السرعة</strong></h3><table>
<thead>
<tr><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>الميزة</strong></td><td><strong>جيميني CLI</strong></td><td><strong>كود كلود</strong></td><td><strong>الملاحظات</strong></td></tr>
<tr><td><strong>سرعة الترميز</strong></td><td>8.5/10</td><td>7.2/10</td><td>الجوزاء يولد كودًا أسرع</td></tr>
<tr><td><strong>جودة الترميز</strong></td><td>7.8/10</td><td>9.1/10</td><td>يولد كلود كودًا عالي الجودة</td></tr>
<tr><td><strong>معالجة الأخطاء</strong></td><td>7.5/10</td><td>8.8/10</td><td>كلود أفضل في معالجة الأخطاء</td></tr>
<tr><td><strong>فهم السياق</strong></td><td>9.2/10</td><td>7.9/10</td><td>يمتلك Gemini ذاكرة أطول</td></tr>
<tr><td><strong>دعم متعدد اللغات</strong></td><td>8.9/10</td><td>8.5/10</td><td>كلاهما ممتاز</td></tr>
</tbody>
</table>
<ul>
<li><p>ينشئ<strong>Gemini CLI</strong> شيفرة أسرع ويتفوق في فهم السياقات الكبيرة، مما يجعله رائعًا للنماذج الأولية السريعة.</p></li>
<li><p>أما<strong>Claude Code</strong> فتتقن الدقة ومعالجة الأخطاء، مما يجعلها أكثر ملاءمة لبيئات الإنتاج حيث تكون جودة التعليمات البرمجية أمرًا بالغ الأهمية.</p></li>
</ul>
<h3 id="4-Platform-Support-Where-Can-You-Run-It" class="common-anchor-header"><strong>4. دعم المنصة: أين يمكنك تشغيله؟</strong></h3><ul>
<li><p>يعمل<strong>Gemini CLI</strong> بشكل جيد على حد سواء عبر أنظمة ويندوز وماك ولينكس منذ اليوم الأول.</p></li>
<li><p>تم تحسين<strong>Claude Code</strong> لنظام macOS أولاً، وعلى الرغم من أنه يعمل على منصات أخرى، إلا أن أفضل تجربة لا تزال على نظام Mac.</p></li>
</ul>
<h3 id="5-Authentication-and-Access" class="common-anchor-header"><strong>5. المصادقة والوصول</strong></h3><p>يتطلب<strong>Claude Code</strong> اشتراكًا نشطًا في أنثروبيك (Pro أو Max أو Team أو Enterprise) أو الوصول إلى واجهة برمجة التطبيقات من خلال AWS Bedrock/Vertex AI. هذا يعني أنك بحاجة إلى إعداد الفوترة قبل أن تتمكن من البدء في استخدامه.</p>
<p>يقدم<strong>Gemini CLI</strong> خطة مجانية سخية لأصحاب حسابات Google الفردية، بما في ذلك 1000 طلب مجاني في اليوم و60 طلبًا في الدقيقة لنموذج Gemini 2.0 Flash كامل الميزات. يمكن للمستخدمين الذين يحتاجون إلى حدود أعلى أو نماذج محددة الترقية عبر مفاتيح واجهة برمجة التطبيقات.</p>
<h3 id="6-Feature-Comparison-Overview" class="common-anchor-header"><strong>6. نظرة عامة على مقارنة الميزات</strong></h3><table>
<thead>
<tr><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>الميزة</strong></td><td><strong>رمز كلود</strong></td><td><strong>واجهة مستخدم Gemini CLI</strong></td></tr>
<tr><td>طول نافذة السياق</td><td>200 ألف رمز</td><td>1 مليون رمز</td></tr>
<tr><td>دعم متعدد الوسائط</td><td>محدود</td><td>قوي (صور، ملفات PDF، إلخ)</td></tr>
<tr><td>فهم الرموز</td><td>ممتاز</td><td>ممتاز</td></tr>
<tr><td>تكامل الأدوات</td><td>أساسي</td><td>غنية (خوادم MCP)</td></tr>
<tr><td>الأمان</td><td>على مستوى المؤسسات</td><td>قياسي</td></tr>
<tr><td>الطلبات المجانية</td><td>محدودة</td><td>60/دقيقة، 1000/يوم</td></tr>
</tbody>
</table>
<h2 id="When-to-Choose-Claude-Code-vs-Gemini-CLI" class="common-anchor-header">متى تختار Claude Code مقابل Gemini CLI؟<button data-href="#When-to-Choose-Claude-Code-vs-Gemini-CLI" class="anchor-icon" translate="no">
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
    </button></h2><p>والآن بعد أن قارنا الميزات الرئيسية لكلتا الأداتين، إليك ما أراه مناسبًا حول متى تختار كل منهما:</p>
<p><strong>اختر Gemini CLI إذا:</strong></p>
<ul>
<li><p>الفعالية من حيث التكلفة والتجريب السريع من الأولويات</p></li>
<li><p>إذا كنت تعمل على مشاريع كبيرة تحتاج إلى نوافذ سياق ضخمة</p></li>
<li><p>كنت تحب الأدوات المتطورة والمفتوحة المصدر.</p></li>
<li><p>التوافق عبر المنصات أمر بالغ الأهمية</p></li>
<li><p>تريد قدرات قوية متعددة الوسائط</p></li>
</ul>
<p><strong>اختر Claude Code إذا:</strong></p>
<ul>
<li><p>تحتاج إلى إنشاء كود عالي الجودة</p></li>
<li><p>كنت تقوم ببناء تطبيقات تجارية ذات مهام حرجة</p></li>
<li><p>الدعم على مستوى المؤسسات غير قابل للتفاوض</p></li>
<li><p>جودة الكود تتفوق على اعتبارات التكلفة</p></li>
<li><p>كنت تعمل بشكل أساسي على نظام macOS</p></li>
</ul>
<h2 id="Claude-Code-vs-Gemini-CLI-Setup-and-Best-Practices" class="common-anchor-header">كود كلود مقابل Gemini CLI: الإعداد وأفضل الممارسات<button data-href="#Claude-Code-vs-Gemini-CLI-Setup-and-Best-Practices" class="anchor-icon" translate="no">
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
    </button></h2><p>الآن بعد أن أصبح لدينا فهم أساسي لإمكانيات هاتين الأداتين الطرفيتين للذكاء الاصطناعي، دعنا نلقي نظرة فاحصة على كيفية البدء باستخدامهما وأفضل الممارسات.</p>
<h3 id="Claude-Code-Setup-and-Best-Practices" class="common-anchor-header">إعداد كلود كود وأفضل الممارسات</h3><p><strong>التثبيت:</strong> يتطلب كلود كود npm و Node.js الإصدار 18 أو أعلى.</p>
<pre><code translate="no"><span class="hljs-comment"># Install Claude Code on your system</span>
npm install -g @anthropic-ai/claude-code

<span class="hljs-comment"># Set up API key</span>
claude config <span class="hljs-built_in">set</span> api-key YOUR_API_KEY

<span class="hljs-comment"># Verify installation was successful</span>
claude --version

<span class="hljs-comment"># Launch Claude Code</span>
Claude
<button class="copy-code-btn"></button></code></pre>
<p>****  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_c413bbf950.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
****</p>
<p><strong>أفضل الممارسات لكود كلود:</strong></p>
<ol>
<li><strong>ابدأ بفهم البنية:</strong> عند الاقتراب من مشروع جديد، اطلب من Claude Code مساعدتك في فهم الهيكل العام أولاً باستخدام لغة طبيعية.</li>
</ol>
<pre><code translate="no"><span class="hljs-meta"># Let Claude analyze project architecture</span>
&gt; Analyze the main architectural components of <span class="hljs-keyword">this</span> project

<span class="hljs-meta"># Understand security mechanisms</span>
&gt; What security measures does <span class="hljs-keyword">this</span> system have?

<span class="hljs-meta"># Get code overview</span>
&gt; Give me an overview of <span class="hljs-keyword">this</span> codebase
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li><strong>كن محددًا وقدم السياق:</strong> كلما زاد السياق الذي تقدمه، كلما كانت اقتراحات كلود كود أكثر دقة.</li>
</ol>
<pre><code translate="no"><span class="hljs-meta"># Implement specific features</span>
&gt; Implement an initial version <span class="hljs-keyword">for</span> GitHub issue <span class="hljs-meta">#123</span>

<span class="hljs-meta"># Code migration</span>
&gt; Help me migrate <span class="hljs-keyword">this</span> codebase to the latest Java version, first create a plan

<span class="hljs-meta"># Code refactoring</span>
&gt; Refactor <span class="hljs-keyword">this</span> function to make it more readable <span class="hljs-keyword">and</span> maintainable
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li><strong>استخدمه لتصحيح الأخطاء والتحسين:</strong></li>
</ol>
<pre><code translate="no"><span class="hljs-meta"># Error analysis</span>
&gt; What caused <span class="hljs-keyword">this</span> error? How can we fix it?

<span class="hljs-meta"># Performance optimization</span>
&gt; Analyze the performance bottlenecks <span class="hljs-keyword">in</span> <span class="hljs-keyword">this</span> code

<span class="hljs-meta"># Code review</span>
&gt; Review <span class="hljs-keyword">this</span> pull request <span class="hljs-keyword">and</span> point <span class="hljs-keyword">out</span> potential issues
<button class="copy-code-btn"></button></code></pre>
<p><strong>ملخص:</strong></p>
<ul>
<li><p>استخدم التعلّم التدريجي من خلال البدء بتفسيرات بسيطة للأكواد، ثم الانتقال تدريجيًا إلى مهام توليد أكواد أكثر تعقيدًا</p></li>
<li><p>حافظ على سياق المحادثة لأن كلود كود يتذكر المناقشات السابقة</p></li>
<li><p>تقديم ملاحظات باستخدام الأمر <code translate="no">bug</code> للإبلاغ عن المشكلات والمساعدة في تحسين الأداة</p></li>
<li><p>حافظ على الوعي بالأمان من خلال مراجعة سياسات جمع البيانات وتوخي الحذر مع التعليمات البرمجية الحساسة</p></li>
</ul>
<h3 id="Gemini-CLI-Setup-and-Best-Practices" class="common-anchor-header">إعداد Gemini CLI وأفضل الممارسات</h3><p><strong>التثبيت:</strong> مثل كود Claude Code، يتطلب Gemini CLI الإصدار 18 أو أعلى من Npm و Node.js.</p>
<pre><code translate="no"><span class="hljs-comment"># Install Gemini CLI</span>
npm install -g @google/gemini-cli

<span class="hljs-comment"># Login to your Google account</span>
gemini auth login

<span class="hljs-comment"># Verify installation</span>
gemini --version

<span class="hljs-comment"># Launch Gemini CLI</span>
Gemini
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_bec1984bb0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>إذا كان لديك حساب شخصي، قم بتسجيل الدخول باستخدام حساب Google الخاص بك للوصول الفوري، بحد أقصى 60 طلبًا في الدقيقة. للحصول على حدود أعلى، قم بتكوين مفتاح API الخاص بك:</p>
<pre><code translate="no"><span class="hljs-keyword">export</span> <span class="hljs-variable constant_">GEMINI_API_KEY</span>=<span class="hljs-string">&quot;YOUR_API_KEY&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>أفضل الممارسات لـ Gemini CLI:</strong></p>
<ol>
<li><strong>ابدأ بفهم البنية:</strong> على غرار Claude Code، عند الاقتراب من مشروع جديد، اطلب من Gemini CLI مساعدتك في فهم البنية العامة أولاً باستخدام اللغة الطبيعية. لاحظ أن Gemini CLI يدعم نافذة سياق بمليون رمز مميز، مما يجعله فعالاً للغاية لتحليل قاعدة التعليمات البرمجية على نطاق واسع.</li>
</ol>
<pre><code translate="no"><span class="hljs-meta"># Analyze project architecture</span>
&gt; Analyze the main architectural components of <span class="hljs-keyword">this</span> project

<span class="hljs-meta"># Understand security mechanisms</span>
&gt; What security measures does <span class="hljs-keyword">this</span> system have?

<span class="hljs-meta"># Get code overview</span>
&gt; Give me an overview of <span class="hljs-keyword">this</span> codebase
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li><strong>استفد من قدراته متعددة الوسائط:</strong> هذا هو المكان الذي يتألق فيه Gemini CLI حقًا.</li>
</ol>
<pre><code translate="no"><span class="hljs-meta"># Generate app from PDF</span>
&gt; Create a <span class="hljs-keyword">new</span> app based <span class="hljs-keyword">on</span> <span class="hljs-keyword">this</span> PDF design document

<span class="hljs-meta"># Generate code from sketch</span>
&gt; Generate frontend code based <span class="hljs-keyword">on</span> <span class="hljs-keyword">this</span> UI sketch

<span class="hljs-meta"># Image processing tasks</span>
&gt; Convert all images <span class="hljs-keyword">in</span> <span class="hljs-keyword">this</span> directory to PNG format <span class="hljs-keyword">and</span> rename <span class="hljs-keyword">using</span> EXIF data
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li><strong>استكشف تكامل الأدوات:</strong> يمكن أن تتكامل Gemini CLI مع العديد من الأدوات وخوادم MCP لتحسين الوظائف.</li>
</ol>
<pre><code translate="no"><span class="hljs-comment"># Connect external tools</span>
&gt; Use MCP server to connect my <span class="hljs-built_in">local</span> system tools

<span class="hljs-comment"># Media generation</span>
&gt; Use Imagen to generate project logo

<span class="hljs-comment"># Search integration</span>
&gt; Use Google search tool to find related technical documentation
<button class="copy-code-btn"></button></code></pre>
<p><strong>ملخص:</strong></p>
<ul>
<li><p>كن موجهًا نحو المشروع: قم دائمًا بتشغيل Gemini من دليل المشروع الخاص بك لفهم سياقي أفضل</p></li>
<li><p>استفد إلى أقصى حد من الميزات متعددة الوسائط باستخدام الصور والمستندات والوسائط الأخرى كمدخلات، وليس فقط النصوص</p></li>
<li><p>استكشف تكامل الأدوات من خلال ربط الأدوات الخارجية بخوادم MCP</p></li>
<li><p>تعزيز إمكانيات البحث باستخدام بحث Google المدمج للحصول على أحدث المعلومات</p></li>
</ul>
<h2 id="AI-Code-is-Outdated-on-Arrival-Here’s-How-to-Fix-it-with-Milvus" class="common-anchor-header">كود الذكاء الاصطناعي قديم عند الوصول. إليك كيفية إصلاحها باستخدام ميلفوس<button data-href="#AI-Code-is-Outdated-on-Arrival-Here’s-How-to-Fix-it-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><em>تعتبر أدوات ترميز الذكاء الاصطناعي مثل Claude Code و Gemini CLI قوية - ولكن لديها نقطة عمياء:</em> <strong><em>فهي لا تعرف ما هو حديث</em></strong><em>.</em></p>
<p><em>الحقيقة؟ تولد معظم النماذج أنماطاً قديمة مباشرةً من الصندوق. لقد تم تدريبهم منذ شهور، وأحيانًا سنوات. لذلك في حين أنها يمكن أن تولد التعليمات البرمجية بسرعة، إلا أنها لا تضمن أنها تعكس</em> <strong><em>أحدث</em></strong><em> إصدارات</em> <strong><em>واجهات برمجة التطبيقات</em></strong><em> أو أطر العمل أو SDK.</em></p>
<p><strong>مثال حقيقي:</strong></p>
<p>اسأل Cursor عن كيفية الاتصال بـ Milvus، وقد تحصل على هذا:</p>
<pre><code translate="no">connections.<span class="hljs-title function_">connect</span>(<span class="hljs-string">&quot;default&quot;</span>, host=<span class="hljs-string">&quot;localhost&quot;</span>, port=<span class="hljs-string">&quot;19530&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>يبدو جيدًا، إلا أن هذه الطريقة مهملة الآن. الطريقة الموصى بها هي استخدام <code translate="no">MilvusClient</code> ولكن معظم المساعدين لا يعرفون ذلك حتى الآن.</p>
<p>أو استخدم واجهة برمجة التطبيقات الخاصة بـ OpenAI. لا تزال العديد من الأدوات تقترح <code translate="no">gpt-3.5-turbo</code> عبر <code translate="no">openai.ChatCompletion</code> ، وهي طريقة تم إهمالها في مارس 2024. إنها أبطأ، وتكلفتها أعلى، وتقدم نتائج أسوأ. لكن LLM لا تعرف ذلك.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_8f0d1a42b6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_5_3f4c4a0d4c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="The-Fix-Real-Time-Intelligence-with-Milvus-MCP-+-RAG" class="common-anchor-header">الإصلاح: الذكاء في الوقت الحقيقي مع Milvus MCP + RAG</h3><p>لحل هذه المشكلة، قمنا بدمج فكرتين قويتين:</p>
<ul>
<li><p><strong>بروتوكول سياق النموذج (MCP)</strong>: معيار للأدوات العميلة للتفاعل مع الأنظمة الحية من خلال اللغة الطبيعية</p></li>
<li><p><strong>الجيل المعزز للاسترجاع (RAG)</strong>: يجلب المحتوى الأحدث والأكثر صلة عند الطلب</p></li>
</ul>
<p>إنهما معاً يجعلان مساعدك أكثر ذكاءً وحداثة.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_e6bc6cacd6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>إليك كيفية عملها:</strong></p>
<ol>
<li><p>قم بمعالجة الوثائق ومراجع SDK وأدلة واجهة برمجة التطبيقات (API) الخاصة بك مسبقًا</p></li>
<li><p>قم بتخزينها كتضمينات متجهة في <a href="https://milvus.io/"><strong>Milvus،</strong></a> قاعدة بيانات المتجهات مفتوحة المصدر الخاصة بنا</p></li>
<li><p>عندما يطرح أحد المطورين سؤالاً (على سبيل المثال "كيف يمكنني الاتصال بـ Milvus؟")، يقوم النظام</p>
<ul>
<li><p>يجري <strong>بحثًا دلاليًا</strong></p></li>
<li><p>يسترجع المستندات والأمثلة الأكثر صلة بالموضوع</p></li>
<li><p>يقوم بإدخالها في سياق مطالبة المساعد.</p></li>
</ul></li>
</ol>
<ol start="4">
<li>النتيجة: اقتراحات برمجية تعكس <strong>بالضبط ما هو صحيح الآن</strong></li>
</ol>
<h3 id="Live-Code-Live-Docs" class="common-anchor-header">كود مباشر، مستندات مباشرة</h3><p>باستخدام <strong>خادم Milvus MCP Server،</strong> يمكنك توصيل هذا التدفق مباشرةً ببيئة البرمجة الخاصة بك. يصبح المساعدون أكثر ذكاءً. تتحسن الكودات البرمجية. يبقى المطورون في التدفق.</p>
<p>وهذا ليس نظريًا فقط - لقد اختبرنا هذا الأمر في مواجهة إعدادات أخرى مثل وضع وكيل Cursor's Agent Mode و Context7 و DeepWiki. الفرق؟ لا يلخص Milvus + MCP مشروعك فحسب - بل يبقى متزامنًا معه.</p>
<p>شاهده أثناء العمل: <a href="https://milvus.io/blog/why-vibe-coding-generate-outdated-code-and-how-to-fix-it-with-milvus-mcp.md">لماذا يولد ترميزك الافتراضي كودًا قديمًا وكيفية إصلاحه باستخدام Milvus MCP </a></p>
<h2 id="The-Future-of-Coding-is-ConversationalAnd-Its-Happening-Right-Now" class="common-anchor-header">مستقبل البرمجة هو مستقبل المحادثة - وهو يحدث الآن<button data-href="#The-Future-of-Coding-is-ConversationalAnd-Its-Happening-Right-Now" class="anchor-icon" translate="no">
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
    </button></h2><p>لقد بدأت للتو ثورة الذكاء الاصطناعي الطرفي. ومع نضوج هذه الأدوات، سنرى على الأرجح تكاملاً أكثر إحكاماً مع سير عمل التطوير، وجودة أفضل للأكواد، وحلولاً لمشكلة العملة من خلال أساليب مثل MCP+RAG.</p>
<p>سواء اخترت Claude Code لجودتها أو Gemini CLI لسهولة الوصول إليها وقوتها، هناك شيء واحد واضح: <strong>برمجة اللغة الطبيعية موجودة لتبقى</strong>. والسؤال ليس ما إذا كنت ستعتمد هذه الأدوات من عدمه، بل كيفية دمجها بفعالية في سير عمل التطوير لديك.</p>
<p>نحن نشهد تحولاً جوهرياً من حفظ بناء الجملة إلى إجراء محادثات مع التعليمات البرمجية الخاصة بنا. <strong>إن مستقبل البرمجة هو مستقبل المحادثة - وهو يحدث الآن في محطتك الطرفية.</strong></p>
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
<li><p><a href="https://milvus.io/blog/building-a-production-ready-ai-assistant-with-spring-boot-and-milvus.md">بناء مساعد ذكاء اصطناعي جاهز للإنتاج باستخدام Spring Boot و Milvus</a></p></li>
<li><p><a href="https://zilliz.com/blog/introducing-zilliz-mcp-server">خادم Zilliz MCP: الوصول باللغة الطبيعية إلى قواعد بيانات المتجهات - مدونة Zilliz</a></p></li>
<li><p><a href="https://milvus.io/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md">VDBBench 1.0: قياس الأداء في العالم الحقيقي لقواعد بيانات المتجهات - مدونة ميلفوس</a></p></li>
<li><p><a href="https://milvus.io/blog/why-vibe-coding-generate-outdated-code-and-how-to-fix-it-with-milvus-mcp.md">لماذا يولد ترميزك المتجه كودًا قديمًا وكيفية إصلاحه باستخدام Milvus MCP</a></p></li>
<li><p><a href="https://milvus.io/blog/why-ai-databases-do-not-need-sql.md">لماذا لا تحتاج قواعد بيانات الذكاء الاصطناعي إلى SQL </a></p></li>
</ul>
