---
id: talk-to-your-vector-database-managing-milvus-via-natural-language.md
title: 'تحدث إلى قاعدة بيانات المتجهات: إدارة ميلفوس عبر اللغة الطبيعية'
author: Lawrence Luo
date: 2025-08-01T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Aug_2_2025_01_17_45_PM_9c50d607bb.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'vector database, mcp, LLM, claude, gemini'
meta_keywords: 'Cursor, Claude Code, Gemini CLI, Code search, MCP'
meta_title: |
  Talk to Your Vector Database: Managing Milvus via Natural Language
desc: >-
  يربط خادم Milvus MCP Server Milvus مباشرةً بمساعدي الترميز بالذكاء الاصطناعي
  مثل Claude Code وCursoror من خلال MCP. يمكنك إدارة Milvus عبر اللغة الطبيعية.
origin: >-
  https://milvus.io/blog/talk-to-your-vector-database-managing-milvus-via-natural-language.md
---
<p>هل تمنيت يومًا أن تقول لمساعد الذكاء الاصطناعي الخاص بك، <em>"أرني جميع المجموعات في قاعدة بيانات المتجهات الخاصة بي"</em> أو <em>"ابحث عن مستندات مشابهة لهذا النص"</em> وتجعله يعمل بالفعل؟</p>
<p>يجعل <a href="http://github.com/zilliztech/mcp-server-milvus"><strong>خادم Milvus MCP Server</strong></a> هذا الأمر ممكنًا من خلال توصيل قاعدة بيانات Milvus vector مباشرةً بمساعدات ترميز الذكاء الاصطناعي مثل Claude Desktop و Cursor IDE من خلال بروتوكول سياق النموذج (MCP). بدلاً من كتابة كود <code translate="no">pymilvus</code> ، يمكنك إدارة Milvus بالكامل من خلال محادثات اللغة الطبيعية.</p>
<ul>
<li><p>بدون خادم Milvus MCP Server: كتابة نصوص Python البرمجية باستخدام pymilvus SDK للبحث في المتجهات</p></li>
<li><p>باستخدام خادم Milvus MCP Server: "ابحث عن مستندات مشابهة لهذا النص في مجموعتي."</p></li>
</ul>
<p>👉 <strong>مستودع GitHub:</strong><a href="https://github.com/zilliztech/mcp-server-milvus"> github.com/zilliztech/mcp-server-milvus</a></p>
<p>وإذا كنت تستخدم <a href="https://zilliz.com/cloud">زيليز كلاود</a> (Milvus المُدار)، فقد قمنا بتغطيتك أيضًا. في نهاية هذه المدونة، سنقدم أيضًا <strong>خادم Zilliz MCP Server،</strong> وهو خيار مُدار يعمل بسلاسة مع Zilliz Cloud. دعنا نتعمق في الأمر.</p>
<h2 id="What-Youll-Get-with-Milvus-MCP-Server" class="common-anchor-header">ما ستحصل عليه مع خادم Milvus MCP Server<button data-href="#What-Youll-Get-with-Milvus-MCP-Server" class="anchor-icon" translate="no">
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
    </button></h2><p>يمنح خادم Milvus MCP Server مساعد الذكاء الاصطناعي الخاص بك الإمكانيات التالية:</p>
<ul>
<li><p><strong>سرد واستكشاف</strong> مجموعات المتجهات</p></li>
<li><p><strong>البحث في المتجهات</strong> باستخدام التشابه الدلالي</p></li>
<li><p><strong>إنشاء مجموعات جديدة</strong> بمخططات مخصصة</p></li>
<li><p><strong>إدراج</strong> بيانات المتجهات<strong>وإدارتها</strong> </p></li>
<li><p><strong>تشغيل استعلامات معقدة</strong> دون كتابة تعليمات برمجية</p></li>
<li><p>والمزيد</p></li>
</ul>
<p>كل ذلك من خلال محادثة طبيعية، كما لو كنت تتحدث إلى خبير في قاعدة البيانات. اطلع على <a href="https://github.com/zilliztech/mcp-server-milvus?tab=readme-ov-file#available-tools">هذا الريبو</a> للاطلاع على القائمة الكاملة للإمكانيات.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/demo_adedb25430.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Quick-Start-Guide" class="common-anchor-header">دليل البدء السريع<button data-href="#Quick-Start-Guide" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Prerequisites" class="common-anchor-header">المتطلبات الأساسية</h3><p><strong>مطلوبة:</strong></p>
<ul>
<li><p>بايثون 3.10 أو أعلى</p></li>
<li><p>مثيل Milvus قيد التشغيل (محلي أو بعيد)</p></li>
<li><p><a href="https://github.com/astral-sh/uv">مدير حزم uv</a> (موصى به)</p></li>
</ul>
<p><strong>تطبيقات الذكاء الاصطناعي المدعومة:</strong></p>
<ul>
<li><p>سطح مكتب كلود</p></li>
<li><p>Cursor IDE</p></li>
<li><p>أي تطبيق متوافق مع MCP</p></li>
</ul>
<h3 id="Tech-Stack-We’ll-Use" class="common-anchor-header">المكدس التقني الذي سنستخدمه</h3><p>في هذا البرنامج التعليمي، سنستخدم المكدس التقني التالي:</p>
<ul>
<li><p><strong>وقت تشغيل اللغة:</strong> <a href="https://www.python.org/">بايثون 3.11</a></p></li>
<li><p><strong>مدير الحزم:</strong> UV</p></li>
<li><p><strong>IDE:</strong> المؤشر</p></li>
<li><p><strong>خادم MCP:</strong> mcp-server-milvus</p></li>
<li><p><strong>LLM:</strong> كلود 3.7</p></li>
<li><p><strong>قاعدة بيانات المتجهات:</strong> ميلفوس</p></li>
</ul>
<h3 id="Step-1-Install-Dependencies" class="common-anchor-header">الخطوة 1: تثبيت التبعيات</h3><p>أولاً، قم بتثبيت مدير حزم uv:</p>
<pre><code translate="no">curl -<span class="hljs-title class_">LsSf</span> <span class="hljs-attr">https</span>:<span class="hljs-comment">//astral.sh/uv/install.sh | sh</span>
<button class="copy-code-btn"></button></code></pre>
<p>أو:</p>
<pre><code translate="no">pip3 install uv -i <span class="hljs-attr">https</span>:<span class="hljs-comment">//mirrors.aliyun.com/pypi/simple</span>
<button class="copy-code-btn"></button></code></pre>
<p>تحقق من التثبيت:</p>
<pre><code translate="no">uv --version
uvx --version
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Step_1_Install_Dependencies_3e452c55e3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Set-Up-Milvus" class="common-anchor-header">الخطوة 2: إعداد Milvus</h3><p><a href="https://milvus.io/">Milvus</a> عبارة عن قاعدة بيانات متجهة مفتوحة المصدر أصلية لأعباء عمل الذكاء الاصطناعي، تم إنشاؤها بواسطة <a href="https://zilliz.com/">Zilliz</a>. صُممت للتعامل مع ملايين إلى مليارات من سجلات المتجهات، وقد اكتسبت أكثر من 36,000 نجمة على GitHub. استنادًا إلى هذا الأساس، تقدم Zilliz أيضًا <a href="https://zilliz.com/cloud">Zilliz Cloud - وهي</a>خدمة مُدارة بالكامل من Milvus مُصممة لسهولة الاستخدام، وفعالية التكلفة، والأمان مع بنية سحابية أصلية.</p>
<p>لمعرفة متطلبات نشر Milvus، قم بزيارة <a href="https://milvus.io/docs/prerequisite-docker.md">هذا الدليل على موقع المستند</a>.</p>
<p><strong>الحد الأدنى من المتطلبات:</strong></p>
<ul>
<li><p><strong>البرمجيات:</strong> Docker، Docker Compose</p></li>
<li><p><strong>ذاكرة الوصول العشوائي:</strong> 16 جيجابايت فأكثر</p></li>
<li><p><strong>القرص:</strong> 100 جيجابايت فأكثر</p></li>
</ul>
<p>قم بتنزيل ملف YAML للنشر:</p>
<pre><code translate="no">[root@Milvus ~]# wget https://github.com/milvus-io/milvus/releases/download/v2.5.4/milvus-standalone-docker-compose.yml -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<p>ابدأ تشغيل ميلفوس:</p>
<pre><code translate="no">[<span class="hljs-meta">root@Milvus ~</span>]<span class="hljs-meta"># docker-compose up -d</span>
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">[<span class="hljs-meta">root@Milvus ~</span>]<span class="hljs-meta"># docker ps -a</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Step_2_Set_Up_Milvus_4826468767.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>سيتوفر مثيل Milvus الخاص بك على <code translate="no">http://localhost:19530</code>.</p>
<h3 id="Step-3-Install-the-MCP-Server" class="common-anchor-header">الخطوة 3: تثبيت خادم MCP</h3><p>استنساخ واختبار خادم MCP:</p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/zilliztech/mcp-server-milvus.git
<span class="hljs-built_in">cd</span> mcp-server-milvus

<span class="hljs-comment"># Test the server locally</span>
uv run src/mcp_server_milvus/server.py --milvus-uri http://localhost:19530
<button class="copy-code-btn"></button></code></pre>
<p>نوصي بتثبيت التبعيات والتحقق محليًا قبل تسجيل الخادم في Cursor:</p>
<pre><code translate="no">uv run src/mcp_server_milvus/server.<span class="hljs-property">py</span> --milvus-uri <span class="hljs-attr">http</span>:<span class="hljs-comment">//192.168.4.48:19530</span>
<button class="copy-code-btn"></button></code></pre>
<p>إذا رأيت بدء تشغيل الخادم بنجاح، فأنت جاهز لتهيئة أداة الذكاء الاصطناعي الخاصة بك.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Step_3_Install_the_MCP_Server_9ce01351e6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Configure-Your-AI-Assistant" class="common-anchor-header">الخطوة 4: تكوين مساعد الذكاء الاصطناعي الخاص بك</h3><p><strong>الخيار أ: Claude Desktop</strong></p>
<ol>
<li><h4 id="Install-Claude-Desktop-from-claudeaidownloadhttpclaudeaidownload" class="common-anchor-header">قم بتثبيت Claude Desktop من <code translate="no">[claude.ai/download](http://claude.ai/download)</code>.</h4></li>
<li><p>افتح ملف التكوين:</p></li>
</ol>
<ul>
<li>macOS: <code translate="no">~/Library/Application Support/Claude/claude_desktop_config.json</code></li>
<li>ويندوز: <code translate="no">%APPDATA%\Claude\claude_desktop_config.json</code></li>
</ul>
<p>أضف هذا التكوين:</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;milvus&quot;</span>: {
      <span class="hljs-string">&quot;command&quot;</span>: <span class="hljs-string">&quot;/path/to/uv&quot;</span>,
      <span class="hljs-string">&quot;args&quot;</span>: [
        <span class="hljs-string">&quot;--directory&quot;</span>,
        <span class="hljs-string">&quot;/path/to/mcp-server-milvus&quot;</span>,
        <span class="hljs-string">&quot;run&quot;</span>,
        <span class="hljs-string">&quot;src/mcp_server_milvus/server.py&quot;</span>,
        <span class="hljs-string">&quot;--milvus-uri&quot;</span>,
        <span class="hljs-string">&quot;http://localhost:19530&quot;</span>
      ]
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<ol start="4">
<li>إعادة تشغيل Claude Desktop</li>
</ol>
<p><strong>الخيار ب: معرف المؤشر</strong></p>
<ol>
<li><p>افتح إعدادات المؤشر → الميزات → MCP</p></li>
<li><p>إضافة خادم MCP عالمي جديد (هذا ينشئ <code translate="no">.cursor/mcp.json</code>)</p></li>
<li><p>أضف هذا التكوين:</p></li>
</ol>
<p>ملاحظة: اضبط المسارات حسب بنية ملفك الفعلية.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;milvus&quot;</span>: {
      <span class="hljs-string">&quot;command&quot;</span>: <span class="hljs-string">&quot;/PATH/TO/uv&quot;</span>,
      <span class="hljs-string">&quot;args&quot;</span>: [
        <span class="hljs-string">&quot;--directory&quot;</span>,
        <span class="hljs-string">&quot;/path/to/mcp-server-milvus/src/mcp_server_milvus&quot;</span>,
        <span class="hljs-string">&quot;run&quot;</span>,
        <span class="hljs-string">&quot;server.py&quot;</span>,
        <span class="hljs-string">&quot;--milvus-uri&quot;</span>,
        <span class="hljs-string">&quot;http://127.0.0.1:19530&quot;</span>
      ]
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Option_B_Cursor_IDE_cd1321ea25.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>المعلمات:</strong></p>
<ul>
<li><code translate="no">/PATH/TO/uv</code> هو المسار إلى ملف uv القابل للتنفيذ</li>
<li><code translate="no">--directory</code> هو المسار إلى المشروع المستنسخ</li>
<li><code translate="no">--milvus-uri</code> هو نقطة نهاية خادم ميلفوس الخاص بك</li>
</ul>
<ol start="4">
<li>إعادة تشغيل المؤشر أو إعادة تحميل النافذة</li>
</ol>
<p><strong>نصيحة احترافية:</strong> ابحث عن المسار <code translate="no">uv</code> باستخدام <code translate="no">which uv</code> على نظام التشغيل macOS/Linux أو <code translate="no">where uv</code> على نظام Windows.</p>
<h3 id="Step-5-See-It-in-Action" class="common-anchor-header">الخطوة 5: شاهده أثناء العمل</h3><p>بمجرد التهيئة، جرّب أوامر اللغة الطبيعية هذه:</p>
<ul>
<li><p><strong>استكشف قاعدة بياناتك:</strong> "ما المجموعات الموجودة في قاعدة بيانات Milvus الخاصة بي؟</p></li>
<li><p><strong>أنشئ مجموعة جديدة:</strong> "إنشاء مجموعة تسمى 'مقالات' مع حقول للعنوان (سلسلة)، والمحتوى (سلسلة)، وحقل متجه مكون من 768 بُعدًا للتضمينات."</p></li>
<li><p><strong>ابحث عن محتوى مشابه:</strong> "ابحث عن المقالات الخمسة الأكثر تشابهًا مع 'تطبيقات التعلم الآلي' في مجموعة مقالاتي."</p></li>
<li><p><strong>إدراج البيانات:</strong> "إضافة مقالة جديدة بعنوان "اتجاهات الذكاء الاصطناعي 2024" والمحتوى "الذكاء الاصطناعي يستمر في التطور..." إلى مجموعة المقالات"</p></li>
</ul>
<p><strong>ما كان يتطلب أكثر من 30 دقيقة من الترميز يستغرق الآن ثوانٍ من المحادثة.</strong></p>
<p>يمكنك التحكم في الوقت الفعلي والوصول بلغة طبيعية إلى Milvus - دون كتابة قوالب برمجية أو تعلم واجهة برمجة التطبيقات.</p>
<h2 id="Troubleshooting" class="common-anchor-header">استكشاف الأخطاء وإصلاحها<button data-href="#Troubleshooting" class="anchor-icon" translate="no">
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
    </button></h2><p>إذا لم تظهر أدوات MCP، فأعد تشغيل تطبيق الذكاء الاصطناعي الخاص بك بالكامل، وتحقق من مسار UV باستخدام <code translate="no">which uv</code> ، واختبر الخادم يدويًا باستخدام <code translate="no">uv run src/mcp_server_milvus/server.py --milvus-uri http://localhost:19530</code>.</p>
<p>بالنسبة لأخطاء الاتصال، تحقق من تشغيل Milvus باستخدام <code translate="no">docker ps | grep milvus</code> ، وحاول استخدام <code translate="no">127.0.0.1</code> بدلاً من <code translate="no">localhost</code> ، وتحقق من إمكانية الوصول إلى المنفذ 19530.</p>
<p>إذا واجهت مشاكل في المصادقة، قم بتعيين متغير البيئة <code translate="no">MILVUS_TOKEN</code> إذا كان Milvus الخاص بك يتطلب المصادقة، وتحقق من الأذونات الخاصة بك للعمليات التي تحاول القيام بها.</p>
<h2 id="Managed-Alternative-Zilliz-MCP-Server" class="common-anchor-header">البديل المُدار خادم Zilliz MCP<button data-href="#Managed-Alternative-Zilliz-MCP-Server" class="anchor-icon" translate="no">
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
    </button></h2><p>يُعدّ <strong>خادم Milvus MCP Server</strong> مفتوح المصدر حلاً رائعاً لعمليات النشر المحلية أو المستضافة ذاتياً لـ Milvus. ولكن إذا كنت تستخدم <a href="https://zilliz.com/cloud">Zilliz Cloud -</a>الخدمة المدارة بالكامل على مستوى المؤسسات التي أنشأها مبتكرو Milvus - فهناك بديل مصمم لهذا الغرض: <a href="https://zilliz.com/blog/introducing-zilliz-mcp-server"><strong>خادم Zilliz MCP Server</strong></a>.</p>
<p>تعمل<a href="https://zilliz.com/cloud">Zilliz Cloud</a> على التخلص من عبء إدارة مثيل Milvus الخاص بك من خلال تقديم قاعدة بيانات سحابية متجهة قابلة للتطوير، وقابلة للتطوير، وآمنة وقابلة للأداء. يتكامل <strong>خادم</strong> Zilliz <strong>MCP Server</strong> مباشرةً مع Zilliz Cloud ويعرض قدراته كأدوات متوافقة مع MCP. هذا يعني أن مساعد الذكاء الاصطناعي الخاص بك - سواءً كان في Claude أو Cursor أو أي بيئة أخرى مدركة ل MCP - يمكنه الآن الاستعلام عن مساحة عمل Zilliz Cloud وإدارتها وتنسيقها باستخدام لغة طبيعية.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/zilliz_mcp_abe1ca1271.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>بدون كود برمجي. لا تبديل لعلامات التبويب. لا كتابة REST أو استدعاءات SDK يدويًا. فقط قل طلبك ودع مساعدك يتولى الباقي.</p>
<h3 id="🚀-Getting-Started-with-Zilliz-MCP-Server" class="common-anchor-header">🚀 الشروع في العمل مع خادم Zilliz MCP</h3><p>إذا كنت جاهزًا للبنية التحتية المتجهة الجاهزة للإنتاج مع سهولة اللغة الطبيعية، فإن البدء في العمل لا يستغرق سوى بضع خطوات:</p>
<ol>
<li><p><a href="https://cloud.zilliz.com/signup"><strong>اشترك في Zilliz Cloud</strong></a> - الفئة المجانية متاحة.</p></li>
<li><p><a href="http://github.com/zilliztech/zilliz-mcp-server"><strong>قم بتثبيت خادم Zilliz MCP Server</strong> من </a>مستودع GitHub.</p></li>
<li><p><strong>قم بتهيئة مساعدك المتوافق مع MCP</strong> (كلود، كورسور، إلخ) للاتصال بمثيل Zilliz Cloud الخاص بك.</p></li>
</ol>
<p>يمنحك هذا أفضل ما في العالمين: بحث متجه قوي مع بنية تحتية على مستوى الإنتاج، يمكن الوصول إليها الآن من خلال اللغة الإنجليزية البسيطة.</p>
<h2 id="Wrapping-Up" class="common-anchor-header">الخاتمة<button data-href="#Wrapping-Up" class="anchor-icon" translate="no">
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
    </button></h2><p>وهذا كل شيء - لقد تعلمت للتو كيفية تحويل Milvus إلى قاعدة بيانات متجهة سهلة الاستخدام باللغة الطبيعية يمكنك <em>التحدث إليها</em> حرفيًا. لا مزيد من التنقيب في مستندات SDK أو كتابة قوالب نمطية لمجرد تدوير مجموعة أو إجراء بحث.</p>
<p>سواءً كنت تقوم بتشغيل Milvus محليًا أو باستخدام Zilliz Cloud، فإن خادم MCP Server يمنح مساعد الذكاء الاصطناعي الخاص بك مجموعة أدوات لإدارة بياناتك المتجهة مثل المحترفين. ما عليك سوى كتابة ما تريد القيام به، ودع كلود أو كورسور يتعامل مع الباقي.</p>
<p>لذا انطلق - قم بتشغيل أداة تطوير الذكاء الاصطناعي الخاصة بك، واسأل "ما المجموعات التي لدي؟ لن ترغب أبدًا في العودة إلى كتابة الاستعلامات المتجهة يدويًا.</p>
<ul>
<li><p>إعداد محلي؟ استخدم<a href="https://github.com/zilliztech/mcp-server-milvus"> خادم Milvus MCP</a> مفتوح المصدر<a href="https://github.com/zilliztech/mcp-server-milvus"> Milvus MCP Server</a></p></li>
<li><p>هل تفضل خدمة مُدارة؟ قم بالتسجيل في Zilliz Cloud واستخدم<a href="https://github.com/zilliztech/zilliz-mcp-server"> خادم Zilliz MCP Server</a></p></li>
</ul>
<p>لديك الأدوات. الآن دع ذكاءك الاصطناعي يقوم بالكتابة.</p>
