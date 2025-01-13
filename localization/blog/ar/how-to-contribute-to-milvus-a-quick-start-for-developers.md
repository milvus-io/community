---
id: how-to-contribute-to-milvus-a-quick-start-for-developers.md
title: 'كيفية المساهمة في ميلفوس: بداية سريعة للمطورين'
author: Shaoting Huang
date: 2024-12-01T00:00:00.000Z
cover: assets.zilliz.com/How_to_Contribute_to_Milvus_91e1432163.png
tag: Engineering
tags: >-
  Milvus, contribute to open-source projects, vector databases, Contribute to
  Milvus
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/how-to-contribute-to-milvus-a-quick-start-for-developers.md
---
<p><a href="https://github.com/milvus-io/milvus"><strong>Milvus</strong></a> هي <a href="https://zilliz.com/learn/what-is-vector-database">قاعدة بيانات متجهة</a> مفتوحة المصدر مصممة لإدارة البيانات المتجهة عالية الأبعاد. سواء كنت تقوم ببناء محركات بحث ذكية أو أنظمة توصية أو حلول ذكاء اصطناعي من الجيل التالي مثل الجيل المعزز للاسترجاع<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">(RAG</a>)، فإن Milvus أداة قوية في متناول يدك.</p>
<p>ولكن ما يدفع Milvus إلى الأمام حقًا ليس فقط تقنيته المتقدمة - بل <a href="https://zilliz.com/community">مجتمع المطورين</a> المتحمس والنابض بالحياة الذي يقف وراءه. كمشروع مفتوح المصدر، يزدهر ميلفوس ويتطور بفضل مساهمات المطورين أمثالك. كل إصلاح للأخطاء وإضافة للميزات وتحسين للأداء من المجتمع يجعل من ميلفوس أسرع وأكثر قابلية للتطوير وأكثر موثوقية.</p>
<p>سواءً كنت شغوفًا بالمصادر المفتوحة، أو متحمسًا للتعلم، أو ترغب في إحداث تأثير دائم في مجال الذكاء الاصطناعي، فإن ميلفوس هو المكان المثالي للمساهمة. سيرشدك هذا الدليل خلال العملية - بدءًا من إعداد بيئة التطوير الخاصة بك إلى إرسال أول طلب سحب. كما سنسلط الضوء على التحديات الشائعة التي قد تواجهك ونقدم لك الحلول للتغلب عليها.</p>
<p>هل أنت جاهز للانطلاق؟ لنجعل ميلفوس أفضل معًا!</p>
<h2 id="Setting-Up-Your-Milvus-Development-Environment" class="common-anchor-header">إعداد بيئة تطوير ميلفوس الخاصة بك<button data-href="#Setting-Up-Your-Milvus-Development-Environment" class="anchor-icon" translate="no">
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
    </button></h2><p>أول شيء أولاً: إعداد بيئة التطوير الخاصة بك. يمكنك إما تثبيت Milvus على جهازك المحلي أو استخدام Docker - كلتا الطريقتين سهلة، لكنك ستحتاج أيضًا إلى تثبيت بعض التبعيات التابعة لجهة خارجية لتشغيل كل شيء.</p>
<h3 id="Building-Milvus-Locally" class="common-anchor-header">بناء ميلفوس محلياً</h3><p>إذا كنت تحب بناء الأشياء من الصفر، فإن بناء ميلفوس على جهازك المحلي أمر سهل للغاية. يجعل Milvus الأمر سهلاً من خلال تجميع جميع التبعيات في البرنامج النصي <code translate="no">install_deps.sh</code>. إليك الإعداد السريع:</p>
<pre><code translate="no"><span class="hljs-comment"># Install third-party dependencies.</span>
$ <span class="hljs-built_in">cd</span> milvus/
$ ./scripts/install_deps.sh

<span class="hljs-comment"># Compile Milvus.</span>
$ make
<button class="copy-code-btn"></button></code></pre>
<h3 id="Building-Milvus-with-Docker" class="common-anchor-header">بناء ميلفوس باستخدام Docker</h3><p>إذا كنت تفضل Docker، فهناك طريقتان للقيام بذلك: يمكنك إما تشغيل الأوامر في حاوية مبنية مسبقًا أو تشغيل حاوية مطورة للحصول على نهج عملي أكثر.</p>
<pre><code translate="no"><span class="hljs-comment"># Option 1: Run commands in a pre-built Docker container  </span>
build/builder.sh make  

<span class="hljs-comment"># Option 2: Spin up a dev container  </span>
./scripts/devcontainer.sh up  
docker-compose -f docker-compose-devcontainer.yml ps  
docker <span class="hljs-built_in">exec</span> -ti milvus-builder-<span class="hljs-number">1</span> bash  
make milvus  
<button class="copy-code-btn"></button></code></pre>
<p><strong>ملاحظات المنصة:</strong> إذا كنت تستخدم نظام لينكس، فأنت على ما يرام - مشاكل التجميع نادرة جدًا. ومع ذلك، قد يواجه مستخدمو نظام ماك، خاصةً مع رقائق M1، بعض المشاكل على طول الطريق. لكن لا تقلق - لدينا دليل لمساعدتك في حل المشاكل الأكثر شيوعًا.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_OS_configuration_52092fb1b7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>الشكل: تكوين نظام التشغيل</em></p>
<p>للحصول على دليل الإعداد الكامل، راجع <a href="https://github.com/milvus-io/milvus/blob/master/DEVELOPMENT.md">دليل تطوير ميلفوس</a> الرسمي.</p>
<h3 id="Common-Issues-and-How-to-Fix-Them" class="common-anchor-header">المشاكل الشائعة وكيفية إصلاحها</h3><p>في بعض الأحيان، لا يسير إعداد بيئة تطوير ميلفوس بسلاسة كما هو مخطط له. لا تقلق - إليك ملخص سريع للمشاكل الشائعة التي قد تواجهها وكيفية إصلاحها بسرعة.</p>
<h4 id="Homebrew-Unexpected-Disconnect-While-Reading-Sideband-Packet" class="common-anchor-header">البيرة المنزلية: قطع اتصال غير متوقع أثناء قراءة حزمة النطاق الجانبي</h4><p>إذا كنت تستخدم Homebrew ورأيت خطأ مثل هذا:</p>
<pre><code translate="no">==&gt; Tapping homebrew/core
remote: Enumerating objects: 1107077, <span class="hljs-keyword">done</span>.
remote: Counting objects: 100% (228/228), <span class="hljs-keyword">done</span>.
remote: Compressing objects: 100% (157/157), <span class="hljs-keyword">done</span>.
error: 545 bytes of body are still expected.44 MiB | 341.00 KiB/s
fetch-pack: unexpected disconnect <span class="hljs-keyword">while</span> reading sideband packet
fatal: early EOF
fatal: index-pack failed
Failed during: git fetch --force origin refs/heads/master:refs/remotes/origin/master
myuser~ %
<button class="copy-code-btn"></button></code></pre>
<p><strong>الإصلاح:</strong> قم بزيادة حجم <code translate="no">http.postBuffer</code>:</p>
<pre><code translate="no">git config --<span class="hljs-variable language_">global</span> http.<span class="hljs-property">postBuffer</span> 1M
<button class="copy-code-btn"></button></code></pre>
<p>إذا كنت تواجه أيضًا <code translate="no">Brew: command not found</code> بعد تثبيت Homebrew، فقد تحتاج إلى إعداد تكوين مستخدم Git الخاص بك:</p>
<pre><code translate="no">git config --<span class="hljs-variable language_">global</span> user.<span class="hljs-property">email</span> xxxgit config --<span class="hljs-variable language_">global</span> user.<span class="hljs-property">name</span> xxx
<button class="copy-code-btn"></button></code></pre>
<h4 id="Docker-Error-Getting-Credentials" class="common-anchor-header">Docker: خطأ في الحصول على بيانات الاعتماد</h4><p>عند العمل مع Docker، قد ترى هذا:</p>
<pre><code translate="no"><span class="hljs-type">error</span> getting credentials - err: exit status <span class="hljs-number">1</span>, out: <span class="hljs-string">``</span>  
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Docker_Error_Getting_Credentials_797f3043fb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>إصلاح:</strong> افتح<code translate="no">~/.docker/config.json</code> وقم بإزالة الحقل <code translate="no">credsStore</code>.</p>
<h4 id="Python-No-Module-Named-imp" class="common-anchor-header">بايثون: لا توجد وحدة نمطية باسم "الجني</h4><p>إذا ألقت Python هذا الخطأ، فذلك لأن Python 3.12 أزال الوحدة النمطية <code translate="no">imp</code> ، والتي لا تزال بعض التبعيات القديمة تستخدمها.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Python_No_Module_Named_imp_65eb2c5c66.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>إصلاح:</strong> الرجوع إلى بايثون 3.11:</p>
<pre><code translate="no">brew install python@3.11  
<button class="copy-code-btn"></button></code></pre>
<h4 id="Conan-Unrecognized-Arguments-or-Command-Not-Found" class="common-anchor-header">كونان: الحجج غير المعترف بها أو الأمر غير موجود</h4><p><strong>مشكلة:</strong> إذا رأيت <code translate="no">Unrecognized arguments: --install-folder conan</code> ، فمن المحتمل أنك تستخدم إصدارًا غير متوافق من Conan.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conan_Unrecognized_Arguments_or_Command_Not_Found_8f2029db72.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>إصلاح المشكلة:</strong> الرجوع إلى إصدار Conan 1.61:</p>
<pre><code translate="no">pip install conan==1.61  
<button class="copy-code-btn"></button></code></pre>
<p><strong>المشكلة: المشكلة:</strong> إذا كنت ترى <code translate="no">Conan command not found</code> ، فهذا يعني أن بيئة Python الخاصة بك لم يتم إعدادها بشكل صحيح.</p>
<p><strong>الإصلاح:</strong> أضف دليل Python's bin إلى <code translate="no">PATH</code>:</p>
<pre><code translate="no"><span class="hljs-built_in">export</span> PATH=<span class="hljs-string">&quot;/path/to/python/bin:<span class="hljs-variable">$PATH</span>&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="LLVM-Use-of-Undeclared-Identifier-kSecFormatOpenSSL" class="common-anchor-header">LLVM: استخدام معرّف غير معلن 'kSecFormatOpenSSL'</h4><p>يعني هذا الخطأ عادةً أن تبعيات LLVM قديمة.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/LLVM_Use_of_Undeclared_Identifier_k_Sec_Format_Open_SSL_f0ca6f0166.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>تم الإصلاح:</strong> قم بإعادة تثبيت LLVM 15 وتحديث متغيرات البيئة الخاصة بك:</p>
<pre><code translate="no">brew reinstall llvm@<span class="hljs-number">15</span>
<span class="hljs-keyword">export</span> <span class="hljs-variable constant_">LDFLAGS</span>=<span class="hljs-string">&quot;-L/opt/homebrew/opt/llvm@15/lib&quot;</span>
<span class="hljs-keyword">export</span> <span class="hljs-variable constant_">CPPFLAGS</span>=<span class="hljs-string">&quot;-I/opt/homebrew/opt/llvm@15/include&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>نصائح احترافية</strong></p>
<ul>
<li><p>تحقق دائمًا من إصدارات أدواتك وتبعياتها.</p></li>
<li><p>إذا كان هناك شيء لا يزال لا يعمل، فإن<a href="https://github.com/milvus-io/milvus/issues"> صفحة مشكلات Milvus GitHub</a> هي مكان رائع للعثور على إجابات أو طلب المساعدة.</p></li>
</ul>
<h3 id="Configuring-VS-Code-for-C++-and-Go-Integration" class="common-anchor-header">تهيئة كود VS لتكامل C++C و Go</h3><p>إن جعل C++C و Go يعملان معًا في VS Code أسهل مما يبدو. باستخدام الإعداد الصحيح، يمكنك تبسيط عملية التطوير الخاصة بك لـ Milvus. ما عليك سوى تعديل ملف <code translate="no">user.settings</code> الخاص بك باستخدام التكوين أدناه:</p>
<pre><code translate="no">{
   <span class="hljs-string">&quot;go.toolsEnvVars&quot;</span>: {
       <span class="hljs-string">&quot;PKG_CONFIG_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/milvus/internal/core/output/lib/pkgconfig:/Users/zilliz/workspace/milvus/internal/core/output/lib64/pkgconfig&quot;</span>,
       <span class="hljs-string">&quot;LD_LIBRARY_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>,
       <span class="hljs-string">&quot;RPATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>
   },
   <span class="hljs-string">&quot;go.testEnvVars&quot;</span>: {
       <span class="hljs-string">&quot;PKG_CONFIG_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib/pkgconfig:/Users/zilliz/workspace/milvus/internal/core/output/lib64/pkgconfig&quot;</span>,
       <span class="hljs-string">&quot;LD_LIBRARY_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>,
       <span class="hljs-string">&quot;RPATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>
   },
   <span class="hljs-string">&quot;go.buildFlags&quot;</span>: [
       <span class="hljs-string">&quot;-ldflags=-r /Users/zilliz/workspace/milvus/internal/core/output/lib&quot;</span>
   ],
   <span class="hljs-string">&quot;terminal.integrated.env.linux&quot;</span>: {
       <span class="hljs-string">&quot;PKG_CONFIG_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib/pkgconfig:/Users/zilliz/workspace/milvus/internal/core/output/lib64/pkgconfig&quot;</span>,
       <span class="hljs-string">&quot;LD_LIBRARY_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>,
       <span class="hljs-string">&quot;RPATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>
   },
   <span class="hljs-string">&quot;go.useLanguageServer&quot;</span>: <span class="hljs-literal">true</span>,
   <span class="hljs-string">&quot;gopls&quot;</span>: {
       <span class="hljs-string">&quot;formatting.gofumpt&quot;</span>: <span class="hljs-literal">true</span>
   },
   <span class="hljs-string">&quot;go.formatTool&quot;</span>: <span class="hljs-string">&quot;gofumpt&quot;</span>,
   <span class="hljs-string">&quot;go.lintTool&quot;</span>: <span class="hljs-string">&quot;golangci-lint&quot;</span>,
   <span class="hljs-string">&quot;go.testTags&quot;</span>: <span class="hljs-string">&quot;dynamic&quot;</span>,
   <span class="hljs-string">&quot;go.testTimeout&quot;</span>: <span class="hljs-string">&quot;10m&quot;</span>
}
<button class="copy-code-btn"></button></code></pre>
<p>إليك ما يفعله هذا التكوين</p>
<ul>
<li><p><strong>متغيرات البيئة:</strong> إعداد مسارات <code translate="no">PKG_CONFIG_PATH</code> ، <code translate="no">LD_LIBRARY_PATH</code> ، و ، و <code translate="no">RPATH</code> ، وهي مسارات ضرورية لتحديد موقع المكتبات أثناء الإنشاءات والاختبارات.</p></li>
<li><p><strong>تكامل أدوات Go:</strong> تمكين خادم لغة Go (<code translate="no">gopls</code>) وتكوين أدوات مثل <code translate="no">gofumpt</code> للتنسيق و <code translate="no">golangci-lint</code> للتنسيق.</p></li>
<li><p><strong>إعداد الاختبار:</strong> يضيف <code translate="no">testTags</code> ويزيد المهلة الزمنية لتشغيل الاختبارات إلى 10 دقائق.</p></li>
</ul>
<p>بمجرد إضافته، يضمن هذا الإعداد تكاملاً سلسًا بين سير عمل C+++C و Go. إنه مثالي لبناء واختبار Milvus واختباره دون الحاجة إلى تعديل البيئة باستمرار.</p>
<p><strong>نصيحة احترافية</strong></p>
<p>بعد إعداد هذا الإعداد، قم بتشغيل بناء اختبار سريع للتأكد من أن كل شيء يعمل. إذا شعرت أن هناك شيئًا ما غير صحيح، تحقق مرة أخرى من المسارات وإصدار امتداد Go الخاص ب VS Code.</p>
<h2 id="Deploying-Milvus" class="common-anchor-header">نشر ميلفوس<button data-href="#Deploying-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>يدعم ميلفوس <a href="https://milvus.io/docs/install-overview.md">ثلاثة أوضاع للنشر - لايت،</a><strong>ومستقل،</strong> <strong>وموزع.</strong></p>
<ul>
<li><p>ميلفوس<a href="https://milvus.io/blog/introducing-milvus-lite.md"><strong>لايت</strong></a> هي مكتبة بايثون ونسخة خفيفة الوزن للغاية من ميلفوس. وهي مثالية للنماذج الأولية السريعة في بيئات Python أو بيئات دفتر الملاحظات وللتجارب المحلية صغيرة النطاق.</p></li>
<li><p><strong>Milvus Standalone</strong> هو خيار النشر أحادي العقدة ل Milvus، باستخدام نموذج خادم العميل. إنه مكافئ Milvus ل MySQLQL، في حين أن Milvus Lite يشبه SQLite.</p></li>
<li><p>Milvus<strong>Distributed</strong> هو الوضع الموزع لـ Milvus، وهو مثالي لمستخدمي المؤسسات الذين يقومون ببناء أنظمة قواعد بيانات متجهة واسعة النطاق أو منصات بيانات متجهة.</p></li>
</ul>
<p>تعتمد جميع عمليات النشر هذه على ثلاثة مكونات أساسية:</p>
<ul>
<li><p><strong>Milvus:</strong> محرك قاعدة البيانات المتجهة الذي يقود جميع العمليات.</p></li>
<li><p><strong>Etcd:</strong> محرك البيانات الوصفية الذي يدير البيانات الوصفية الداخلية لـ Milvus.</p></li>
<li><p><strong>MinIO:</strong> محرك التخزين الذي يضمن ثبات البيانات.</p></li>
</ul>
<p>عند تشغيله في الوضع <strong>الموزع،</strong> يشتمل Milvus أيضًا على <strong>Pulsar</strong> لمعالجة الرسائل الموزعة باستخدام آلية Pub/Sub، مما يجعله قابلاً للتطوير في البيئات عالية الإنتاجية.</p>
<h3 id="Milvus-Standalone" class="common-anchor-header">ميلفوس مستقل</h3><p>تم تصميم الوضع المستقل للإعدادات ذات المثيل الواحد، مما يجعله مثاليًا للاختبار والتطبيقات صغيرة النطاق. إليك كيفية البدء:</p>
<pre><code translate="no"><span class="hljs-comment"># Deploy Milvus Standalone  </span>
<span class="hljs-built_in">sudo</span> docker-compose -f deployments/docker/dev/docker-compose.yml up -d
<span class="hljs-comment"># Start the standalone service  </span>
bash ./scripts/start_standalone.sh
<button class="copy-code-btn"></button></code></pre>
<h3 id="Milvus-Distributed-previously-known-as-Milvus-Cluster" class="common-anchor-header">Milvus Distributed (المعروف سابقًا باسم Milvus Cluster)</h3><p>بالنسبة لمجموعات البيانات الكبيرة وحركة المرور العالية، يوفر الوضع الموزع قابلية التوسع الأفقي. فهو يجمع بين مثيلات Milvus المتعددة في نظام واحد متماسك. أصبح النشر سهلاً مع <strong>مشغّل Milvus،</strong> الذي يعمل على Kubernetes ويدير مجموعة Milvus بأكملها نيابةً عنك.</p>
<p>هل تريد إرشادات خطوة بخطوة؟ اطلع على <a href="https://milvus.io/docs/install_cluster-milvusoperator.md">دليل تثبيت Milvus</a>.</p>
<h2 id="Running-End-to-End-E2E-Tests" class="common-anchor-header">تشغيل الاختبارات من النهاية إلى النهاية (E2E)<button data-href="#Running-End-to-End-E2E-Tests" class="anchor-icon" translate="no">
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
    </button></h2><p>بمجرد نشر Milvus الخاص بك وتشغيله، يصبح اختبار وظائفه أمرًا سهلاً مع اختبارات E2E. تغطي هذه الاختبارات كل جزء من الإعداد لضمان عمل كل شيء كما هو متوقع. إليك كيفية تشغيلها:</p>
<pre><code translate="no"><span class="hljs-comment"># Navigate to the test directory  </span>
<span class="hljs-built_in">cd</span> tests/python_client  

<span class="hljs-comment"># Install dependencies  </span>
pip install -r requirements.txt  

<span class="hljs-comment"># Run E2E tests  </span>
pytest --tags=L0 -n auto  
<button class="copy-code-btn"></button></code></pre>
<p>للحصول على إرشادات متعمقة ونصائح حول استكشاف الأخطاء وإصلاحها، راجع <a href="https://github.com/milvus-io/milvus/blob/master/DEVELOPMENT.md#e2e-tests">دليل تطوير Milvus</a>.</p>
<p><strong>نصيحة احترافية</strong></p>
<p>إذا كنت جديدًا على Milvus، فابدأ باستخدام وضع Milvus Lite أو الوضع المستقل للتعرف على إمكانياته قبل الترقية إلى الوضع الموزع لأعباء العمل على مستوى الإنتاج.</p>
<h2 id="Submitting-Your-Code" class="common-anchor-header">إرسال الكود الخاص بك<button data-href="#Submitting-Your-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>تهانينا! لقد أنهيتَ جميع اختبارات الوحدة واختبارات E2E (أو قمتَ بتصحيحها وإعادة تجميعها حسب الحاجة). في حين أن البناء الأول قد يستغرق بعض الوقت، إلا أن البنى المستقبلية ستكون أسرع بكثير - لذا لا داعي للقلق. بعد اجتياز كل شيء، أنت جاهز لإرسال تغييراتك والمساهمة في ميلفوس!</p>
<h3 id="Link-Your-Pull-Request-PR-to-an-Issue" class="common-anchor-header">ربط طلب السحب (PR) الخاص بك بمشكلة</h3><p>يجب ربط كل طلب سحب إلى ميلفوس بمشكلة ذات صلة. إليك كيفية التعامل مع هذا الأمر:</p>
<ul>
<li><p><strong>تحقق من المشكلات الموجودة:</strong> ابحث في<a href="https://github.com/milvus-io/milvus/issues"> متعقب المشكلات</a> في<a href="https://github.com/milvus-io/milvus/issues"> ميلفوس</a> لمعرفة ما إذا كانت هناك بالفعل مشكلة متعلقة بتغييراتك.</p></li>
<li><p><strong>إنشاء مشكلة جديدة:</strong> إذا لم تكن هناك مشكلة ذات صلة، افتح مشكلة جديدة واشرح المشكلة التي تعمل على حلها أو الميزة التي تضيفها.</p></li>
</ul>
<h3 id="Submitting-Your-Code" class="common-anchor-header">إرسال الكود الخاص بك</h3><ol>
<li><p><strong>قم بتوسيع المستودع:</strong> ابدأ بتحويل<a href="https://github.com/milvus-io/milvus"> ريبو Milvus</a> إلى حسابك على GitHub.</p></li>
<li><p><strong>أنشئ فرعًا:</strong> استنسخ الفرع الخاص بك محليًا وأنشئ فرعًا جديدًا لتغييراتك.</p></li>
<li><p><strong>التزم بتوقيع موقّع بالتوقيع:</strong> تأكد من أن التزاماتك تتضمن توقيع <code translate="no">Signed-off-by</code> للامتثال لترخيص المصدر المفتوح:</p></li>
</ol>
<pre><code translate="no">git commit -m <span class="hljs-string">&quot;Commit of your change&quot;</span> -s
<button class="copy-code-btn"></button></code></pre>
<p>تصادق هذه الخطوة على أن مساهمتك تتماشى مع شهادة منشأ المطور (DCO).</p>
<h4 id="Helpful-Resources" class="common-anchor-header"><strong>موارد مفيدة</strong></h4><p>للاطلاع على الخطوات التفصيلية وأفضل الممارسات، راجع<a href="https://github.com/milvus-io/milvus/blob/master/CONTRIBUTING.md"> دليل مساهمة ميلفوس</a>.</p>
<h2 id="Opportunities-to-Contribute" class="common-anchor-header">فرص المساهمة<button data-href="#Opportunities-to-Contribute" class="anchor-icon" translate="no">
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
    </button></h2><p>تهانينا - لقد قمت بتشغيل ملفوس! لقد استكشفتَ أوضاع النشر الخاصة به، وقمتَ بإجراء اختباراتك، وربما تعمّقتَ في التعليمات البرمجية. الآن حان الوقت للارتقاء إلى مستوى أعلى: ساهم في <a href="https://github.com/milvus-io/milvus">ميلفوس</a> وساعد في تشكيل مستقبل الذكاء الاصطناعي <a href="https://zilliz.com/learn/introduction-to-unstructured-data">والبيانات غير المنظمة</a>.</p>
<p>بغض النظر عن مجموعة مهاراتك، هناك مكان لك في مجتمع Milvus! سواء أكنت مطورًا يحب حل التحديات المعقدة، أو كاتبًا تقنيًا يحب كتابة وثائق نظيفة أو مدونات هندسية، أو متحمسًا لعمليات النشر Kubernetes، فهناك طريقة لك لإحداث تأثير.</p>
<p>ألقِ نظرة على الفرص المتاحة أدناه واعثر على ما يناسبك. كل مساهمة تساعد في دفع ميلفوس إلى الأمام - ومن يدري؟ قد يؤدي طلب السحب التالي إلى تعزيز الموجة التالية من الابتكار. إذاً، ماذا تنتظر؟ لنبدأ! 🚀</p>
<table>
<thead>
<tr><th>المشاريع</th><th>مناسبة لـ</th><th>الإرشادات</th></tr>
</thead>
<tbody>
<tr><td><a href="https://github.com/milvus-io/milvus">ميلفوس</a>, <a href="https://github.com/milvus-io/milvus-sdk-go">ميلفوس-سدك-جو</a></td><td>مطورو Go</td><td>/</td></tr>
<tr><td><a href="https://github.com/milvus-io/milvus">ميلفوس</a>, <a href="https://github.com/milvus-io/knowhere">معرفة أين</a></td><td>مطورو CPP</td><td>/</td></tr>
<tr><td><a href="https://github.com/milvus-io/pymilvus">pymilvus</a>, <a href="https://github.com/milvus-io/milvus-sdk-node">milvus-sdk-node</a>, <a href="https://github.com/milvus-io/milvus-sdk-java">milvus-sdk-java</a></td><td>المطورون المهتمون باللغات الأخرى</td><td><a href="https://github.com/milvus-io/pymilvus/blob/master/CONTRIBUTING.md">المساهمة في PyMilvus PyMilvus</a></td></tr>
<tr><td><a href="https://github.com/milvus-io/milvus-helm">ميلفوس-هيلم</a></td><td>المتحمسون لـ Kubernetes</td><td>/</td></tr>
<tr><td><a href="https://github.com/milvus-io/milvus-docs">ميلفوس-دوكس،</a> <a href="https://github.com/milvus-io/community">ميلفوس-أيو/المجتمع/المدونة</a></td><td>الكتّاب التقنيون</td><td><a href="https://github.com/milvus-io/milvus-docs/blob/v2.0.0/CONTRIBUTING.md">المساهمة في مستندات ميلفوس</a></td></tr>
<tr><td><a href="https://github.com/zilliztech/milvus-insight">ميلفوس-إنسايت</a></td><td>مطورو الويب</td><td>/</td></tr>
</tbody>
</table>
<h2 id="A-Final-Word" class="common-anchor-header">كلمة أخيرة<button data-href="#A-Final-Word" class="anchor-icon" translate="no">
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
    </button></h2><p>تقدم ميلفوس العديد من حزم تطوير البرمجيات - <a href="https://milvus.io/docs/install-pymilvus.md">بايثون</a> (PyMilvus) <a href="https://milvus.io/docs/install-java.md">وجافا</a> <a href="https://milvus.io/docs/install-go.md">وجو وGo</a> <a href="https://milvus.io/docs/install-node.md">وNode.js - التي</a>تجعل من السهل البدء في البناء. المساهمة في Milvus لا تتعلق فقط بالرموز البرمجية - بل تتعلق بالانضمام إلى مجتمع حيوي ومبتكر.</p>
<p>🚀مرحباً بكم في مجتمع مطوري ميلفوس وبرمجة سعيدة! نحن متشوقون لرؤية ما ستبتكره.</p>
<h2 id="Further-Reading" class="common-anchor-header">المزيد من القراءة<button data-href="#Further-Reading" class="anchor-icon" translate="no">
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
<li><p><a href="https://zilliz.com/community">انضم إلى مجتمع مطوري الذكاء الاصطناعي في ميلفوس</a></p></li>
<li><p><a href="https://zilliz.com/learn/what-is-vector-database">ما هي قواعد البيانات المتجهة وكيف تعمل؟</a></p></li>
<li><p><a href="https://zilliz.com/blog/choose-the-right-milvus-deployment-mode-ai-applications">ميلفوس لايت مقابل المستقل مقابل الموزع: ما هو الوضع المناسب لك؟ </a></p></li>
<li><p><a href="https://zilliz.com/learn/milvus-notebooks">إنشاء تطبيقات الذكاء الاصطناعي باستخدام Milvus: البرامج التعليمية والدفاتر</a></p></li>
<li><p><a href="https://zilliz.com/ai-models">أفضل نماذج الذكاء الاصطناعي أداءً لتطبيقات GenAI الخاصة بك | Zilliz</a></p></li>
<li><p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">ما هو RAG؟</a></p></li>
<li><p><a href="https://zilliz.com/learn/generative-ai">مركز موارد الذكاء الاصطناعي التوليدي | زيليز</a></p></li>
</ul>
