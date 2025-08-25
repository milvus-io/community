---
id: >-
  stop-your-ai-assistant-from-writing-outdated-code-with-milvus-sdk-code-helper.md
title: >-
  أوقف مساعد الذكاء الاصطناعي الخاص بك من كتابة التعليمات البرمجية القديمة
  باستخدام مساعد التعليمات البرمجية Milvus SDK
author: 'Cheney Zhang, Stacy Li'
date: 2025-08-22T00:00:00.000Z
desc: >-
  برنامج تعليمي مفصّل خطوة بخطوة حول إعداد مساعد كود Milvus SDK لإيقاف مساعدي
  الذكاء الاصطناعي من إنشاء كود قديم وضمان أفضل الممارسات.
cover: >-
  assets.zilliz.com/stop_your_ai_assistant_from_writing_outdated_code_with_milvus_sdk_code_helper_min_64fa8d3396.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus SDK Code Helper, AI coding assistant, MCP server, vibe coding, pymilvus'
meta_title: |
  Milvus SDK Code Helper Tutorial: Fix AI Outdated Code
origin: >-
  https://milvus.io/blog/stop-your-ai-assistant-from-writing-outdated-code-with-milvus-sdk-code-helper.md
---
<h2 id="Introduction" class="common-anchor-header">مقدمة<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>تعمل برمجة Vibe Coding على تغيير طريقة كتابتنا للبرمجيات. فأدوات مثل Cursor و Windsurf تجعل التطوير يبدو سهلاً وبديهيًا - اطلب دالة واحصل على مقتطف، تحتاج إلى استدعاء سريع لواجهة برمجة التطبيقات، ويتم إنشاؤها قبل أن تنتهي من الكتابة. الوعد هو تطوير سلس وسلس حيث يتوقع مساعد الذكاء الاصطناعي احتياجاتك ويقدم لك ما تريده بالضبط.</p>
<p>ولكن هناك عيب خطير يكسر هذا التدفق الجميل: كثيراً ما ينشئ مساعدو الذكاء الاصطناعي كوداً قديماً يتعطل في الإنتاج.</p>
<p>تأمل هذا المثال: طلبت من Cursor إنشاء كود اتصال Milvus، وأنتج هذا:</p>
<pre><code translate="no">connections.<span class="hljs-title function_">connect</span>(<span class="hljs-string">&quot;default&quot;</span>, host=<span class="hljs-string">&quot;localhost&quot;</span>, port=<span class="hljs-string">&quot;19530&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>كان هذا يعمل بشكل مثالي، لكن مجموعة أدوات تطوير البرمجيات الحالية الخاصة بـ pymilvus توصي باستخدام <code translate="no">MilvusClient</code> لجميع الاتصالات والعمليات. لم تعد الطريقة القديمة تعتبر من أفضل الممارسات، ومع ذلك يستمر مساعدو الذكاء الاصطناعي في اقتراحها لأن بيانات التدريب الخاصة بهم غالبًا ما تكون قديمة منذ أشهر أو سنوات.</p>
<p>وعلى الرغم من كل التقدم المحرز في أدوات ترميز Vibe Coding، لا يزال المطورون يقضون وقتًا طويلاً في سد "الميل الأخير" بين التعليمات البرمجية التي تم إنشاؤها والحلول الجاهزة للإنتاج. الشعور موجود، لكن الدقة ليست موجودة.</p>
<h3 id="What-is-the-Milvus-SDK-Code-Helper" class="common-anchor-header">ما هو مساعد كود Milvus SDK Code Helper؟</h3><p>إن Milvus <strong>SDK Code Helper</strong> هو حل يركز على المطورين ويحل مشكلة <em>"</em> الميل <em>الأخير"</em> في ترميز Vibe Coding - سد الفجوة بين الترميز بمساعدة الذكاء الاصطناعي وتطبيقات Milvus الجاهزة للإنتاج.</p>
<p>وهو في جوهره عبارة عن <strong>خادم بروتوكول سياق النموذج (MCP)</strong> الذي يربط IDE المدعوم بالذكاء الاصطناعي مباشرةً بأحدث وثائق Milvus الرسمية. وبالاقتران مع توليد الاسترجاع المعزز (RAG)، فإنه يضمن أن الكود الذي ينشئه مساعدك دقيق ومحدث ومتماشي دائمًا مع أفضل ممارسات Milvus.</p>
<p>وبدلاً من المقتطفات القديمة أو التخمينات، ستحصل على اقتراحات أكواد مدركة للسياق ومتوافقة مع المعايير - مباشرةً داخل سير عمل التطوير لديك.</p>
<p><strong>الفوائد الرئيسية:</strong></p>
<ul>
<li><p>⚡ <strong>التهيئة مرة واحدة، وتعزيز الكفاءة إلى الأبد</strong>: قم بإعداده مرة واحدة واستمتع بتوليد التعليمات البرمجية المحدثة باستمرار</p></li>
<li><p><strong>🎯 محدث دائمًا</strong>: الوصول إلى أحدث وثائق Milvus SDK الرسمية.</p></li>
<li><p>📈 <strong>تحسين جودة التعليمات البرمجية</strong>: إنشاء كود يتبع أفضل الممارسات الحالية</p></li>
<li><p>🌊 <strong>تدفق مستعاد</strong>: حافظ على تجربة ترميز Vibe Coding سلسة وغير متقطعة</p></li>
</ul>
<p><strong>ثلاث أدوات في أداة واحدة</strong></p>
<ol>
<li><p><code translate="no">pymilvus-code-generator</code> ← كتابة كود بايثون بسرعة لمهام Milvus الشائعة (مثل إنشاء مجموعات وإدراج البيانات وتشغيل عمليات البحث عن المتجهات).</p></li>
<li><p><code translate="no">orm-client-code-converter</code> → تحديث كود بايثون القديم عن طريق استبدال أنماط إدارة علاقات العملاء القديمة بأحدث بناء جملة <code translate="no">MilvusClient</code>.</p></li>
<li><p><code translate="no">language-translator</code> ← تحويل كود Milvus SDK بسلاسة بين اللغات (على سبيل المثال، Python ↔ TypeScript).</p></li>
</ol>
<p>راجع الموارد أدناه لمزيد من التفاصيل:</p>
<ul>
<li><p>مدونة: <a href="https://milvus.io/blog/why-vibe-coding-generate-outdated-code-and-how-to-fix-it-with-milvus-mcp.md">لماذا يولد ترميز Vibe الخاص بك كودًا قديمًا وكيفية إصلاحه باستخدام Milvus MCP </a></p></li>
<li><p>المستند: <a href="https://milvus.io/docs/milvus-sdk-helper-mcp.md#Quickstart">دليل مساعد التعليمات البرمجية لميلفوس SDK | وثائق ميلفوس</a></p></li>
</ul>
<h3 id="Before-You-Begin" class="common-anchor-header">قبل أن تبدأ</h3><p>قبل الغوص في عملية الإعداد، دعنا نتفحص الفرق الكبير الذي يحدثه مساعد الكود عمليًا. توضح المقارنة أدناه كيف ينتج عن نفس الطلب لإنشاء مجموعة Milvus نتائج مختلفة تمامًا:</p>
<table>
<thead>
<tr><th><strong>تم تمكين مساعد كود MCP Code Helper:</strong></th><th><strong>تم تعطيل مساعد كود MCP Code Helper:</strong></th></tr>
</thead>
<tbody>
<tr><td>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mcp_enabled_fcb94737fb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</td><td>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mcp_disabled_769db4faee.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</td></tr>
</tbody>
</table>
<p>يوضح هذا تمامًا المشكلة الأساسية: بدون مساعد الكود: بدون مساعد الكود، حتى أكثر مساعدي الذكاء الاصطناعي تقدمًا ينشئ كودًا باستخدام أنماط ORM SDK القديمة التي لم يعد يوصى بها. يضمن لك مساعد التعليمات البرمجية الحصول على أحدث تطبيق حديث وفعال ومعتمد رسميًا في كل مرة.</p>
<p><strong>الفرق في الممارسة العملية:</strong></p>
<ul>
<li><p><strong>النهج الحديث</strong>: كود نظيف وقابل للصيانة باستخدام أفضل الممارسات الحالية</p></li>
<li><p><strong>نهج مهمل</strong>: كود يعمل ولكنه يتبع أنماطًا قديمة</p></li>
<li><p><strong>تأثير الإنتاج</strong>: الكود الحالي أكثر كفاءة، وأسهل في الصيانة، ومقاوم للمستقبل</p></li>
</ul>
<p>سيرشدك هذا الدليل إلى كيفية إعداد مساعد كود Milvus SDK Code Helper عبر العديد من IDEs وبيئات التطوير الخاصة بالذكاء الاصطناعي. عملية الإعداد مباشرة وتستغرق عادةً بضع دقائق فقط لكل IDE.</p>
<h2 id="Setting-Up-the-Milvus-SDK-Code-Helper" class="common-anchor-header">إعداد مساعد البرمجة Milvus SDK برمجة Milvus SDK<button data-href="#Setting-Up-the-Milvus-SDK-Code-Helper" class="anchor-icon" translate="no">
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
    </button></h2><p>توفر الأقسام التالية إرشادات الإعداد التفصيلية لكل IDE وبيئة تطوير مدعومة. اختر القسم الذي يتوافق مع إعداد التطوير المفضل لديك.</p>
<h3 id="Cursor-IDE-Setup" class="common-anchor-header">إعداد Cursor IDE</h3><p>يوفر Cursor تكاملًا سلسًا مع خوادم MCP من خلال نظام التكوين المدمج الخاص به.</p>
<p><strong>الخطوة 1: الوصول إلى إعدادات MCP</strong></p>
<p>انتقل إلى: الإعدادات ← إعدادات المؤشر ← إعدادات المؤشر ← الأدوات والتكاملات ← إضافة خادم MCP عالمي جديد</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/cursor_mcp_configuration_interface_9ff0b7dcb7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
 <em>واجهة تكوين MCP المؤشر MCP</em></p>
<p><strong>الخطوة 2: تكوين خادم MCP</strong></p>
<p>لديك خياران للتكوين:</p>
<p><strong>الخيار أ: التكوين العام (موصى به)</strong></p>
<p>أضف التكوين التالي إلى ملف Cursor <code translate="no">~/.cursor/mcp.json</code> الخاص بك Cursor :</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;sdk-code-helper&quot;</span>: {
      <span class="hljs-string">&quot;url&quot;</span>: <span class="hljs-string">&quot;https://sdk.milvus.io/mcp/&quot;</span>,
      <span class="hljs-string">&quot;headers&quot;</span>: {
        <span class="hljs-string">&quot;Accept&quot;</span>: <span class="hljs-string">&quot;text/event-stream&quot;</span>
      }
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>الخيار ب: التكوين الخاص بالمشروع</strong></p>
<p>قم بإنشاء ملف <code translate="no">.cursor/mcp.json</code> في مجلد المشروع الخاص بك بنفس التكوين أعلاه.</p>
<p>للحصول على خيارات التكوين الإضافية واستكشاف الأخطاء وإصلاحها، راجع<a href="https://docs.cursor.com/context/model-context-protocol"> وثائق Cursor Cursor MCP</a>.</p>
<h3 id="Claude-Desktop-Setup" class="common-anchor-header">إعداد كلود لسطح المكتب</h3><p>يوفر Claude Desktop تكاملاً مباشراً مع MCP من خلال نظام التكوين الخاص به.</p>
<p><strong>الخطوة 1: تحديد موقع ملف التكوين</strong></p>
<p>أضف التكوين التالي إلى ملف تكوين Claude Desktop الخاص بك:</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;sdk-code-helper&quot;</span>: {
      <span class="hljs-string">&quot;url&quot;</span>: <span class="hljs-string">&quot;https://sdk.milvus.io/mcp/&quot;</span>,
      <span class="hljs-string">&quot;headers&quot;</span>: {
        <span class="hljs-string">&quot;Accept&quot;</span>: <span class="hljs-string">&quot;text/event-stream&quot;</span>
      }
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>الخطوة 2: أعد تشغيل Claude Desktop</strong></p>
<p>بعد حفظ التكوين، أعد تشغيل Claude Desktop لتفعيل خادم MCP الجديد.</p>
<h3 id="Claude-Code-Setup" class="common-anchor-header">إعداد كلود كود</h3><p>يوفر Claude Code تهيئة سطر الأوامر لخوادم MCP، مما يجعله مثاليًا للمطورين الذين يفضلون الإعداد المستند إلى المحطة الطرفية.</p>
<p><strong>الخطوة 1: إضافة خادم MCP عبر سطر الأوامر</strong></p>
<p>نفّذ الأمر التالي في جهازك الطرفي:</p>
<pre><code translate="no">claude mcp add-json sdk-code-helper --json &#x27;{
  &quot;url&quot;: &quot;https://sdk.milvus.io/mcp/&quot;,
  &quot;headers&quot;: {
    &quot;Accept&quot;: &quot;text/event-stream&quot;
  }
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>الخطوة 2: التحقق من التثبيت</strong></p>
<p>سيتم تهيئة خادم MCP تلقائيًا وسيكون جاهزًا للاستخدام فورًا بعد تشغيل الأمر.</p>
<h3 id="Windsurf-IDE-Setup" class="common-anchor-header">إعداد Windsurf IDE</h3><p>يدعم Windsurf تكوين MCP من خلال نظام الإعدادات المستند إلى JSON.</p>
<p><strong>الخطوة 1: الوصول إلى إعدادات MCP</strong></p>
<p>قم بإضافة التكوين التالي إلى ملف إعدادات MCP Windsurf MCP الخاص بك:</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;sdk-code-helper&quot;</span>: {
      <span class="hljs-string">&quot;url&quot;</span>: <span class="hljs-string">&quot;https://sdk.milvus.io/mcp/&quot;</span>,
      <span class="hljs-string">&quot;headers&quot;</span>: {
        <span class="hljs-string">&quot;Accept&quot;</span>: <span class="hljs-string">&quot;text/event-stream&quot;</span>
      }
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>الخطوة 2: تطبيق التكوين</strong></p>
<p>احفظ ملف الإعدادات وأعد تشغيل Windsurf لتنشيط خادم MCP.</p>
<h3 id="VS-Code-Setup" class="common-anchor-header">إعداد رمز VS</h3><p>يتطلب تكامل VS Code ملحقًا متوافقًا مع MCP ليعمل بشكل صحيح.</p>
<p><strong>الخطوة 1: تثبيت ملحق MCP</strong></p>
<p>تأكد من تثبيت ملحق متوافق مع MCP في VS Code.</p>
<p><strong>الخطوة 2: تكوين خادم MCP</strong></p>
<p>أضف التكوين التالي إلى إعدادات MCP في VS Code MCP:</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;sdk-code-helper&quot;</span>: {
      <span class="hljs-string">&quot;url&quot;</span>: <span class="hljs-string">&quot;https://sdk.milvus.io/mcp/&quot;</span>,
      <span class="hljs-string">&quot;headers&quot;</span>: {
        <span class="hljs-string">&quot;Accept&quot;</span>: <span class="hljs-string">&quot;text/event-stream&quot;</span>
      }
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Cherry-Studio-Setup" class="common-anchor-header">إعداد Cherry Studio</h3><p>يوفر Cherry Studio واجهة رسومية سهلة الاستخدام لتهيئة خادم MCP، مما يجعلها في متناول المطورين الذين يفضلون عمليات الإعداد المرئية.</p>
<p><strong>الخطوة 1: الوصول إلى إعدادات خادم MCP</strong></p>
<p>انتقل إلى الإعدادات → خوادم MCP → إضافة خادم من خلال واجهة Cherry Studio.</p>
<p><strong>الخطوة 2: تكوين تفاصيل الخادم</strong></p>
<p>املأ نموذج تكوين الخادم بالمعلومات التالية:</p>
<ul>
<li><p><strong>الاسم</strong>: <code translate="no">sdk code helper</code></p></li>
<li><p><strong>النوع</strong>: <code translate="no">Streamable HTTP</code></p></li>
<li><p><strong>عنوان URL</strong>: <code translate="no">https://sdk.milvus.io/mcp/</code></p></li>
<li><p><strong>الرؤوس</strong>: <code translate="no">&quot;Accept&quot;: &quot;text/event-stream&quot;</code></p></li>
</ul>
<p><strong>الخطوة 3: حفظ وتفعيل</strong></p>
<p>انقر فوق حفظ لتنشيط تكوين الخادم.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/cherry_studio_mcp_configuration_interface_b7dce8b26d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>واجهة تكوين Cherry Studio MCP</em></p>
<h3 id="Cline-Setup" class="common-anchor-header">إعداد كلاين</h3><p>يستخدم Cline نظام تكوين قائم على JSON يمكن الوصول إليه من خلال واجهته.</p>
<p><strong>الخطوة 1: الوصول إلى إعدادات MCP</strong></p>
<ol>
<li><p>افتح Cline وانقر على أيقونة خوادم MCP في شريط التنقل العلوي</p></li>
<li><p>حدد علامة التبويب المثبتة</p></li>
<li><p>انقر على إعدادات MCP المتقدمة</p></li>
</ol>
<p><strong>الخطوة 2: تحرير ملف التكوين</strong> في ملف <code translate="no">cline_mcp_settings.json</code> ، أضف التكوين التالي:</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;sdk-code-helper&quot;</span>: {
      <span class="hljs-string">&quot;url&quot;</span>: <span class="hljs-string">&quot;https://sdk.milvus.io/mcp/&quot;</span>,
      <span class="hljs-string">&quot;headers&quot;</span>: {
        <span class="hljs-string">&quot;Accept&quot;</span>: <span class="hljs-string">&quot;text/event-stream&quot;</span>
      }
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>الخطوة 3: حفظ وإعادة التشغيل</strong></p>
<p>احفظ ملف التكوين وأعد تشغيل Cline لتطبيق التغييرات.</p>
<h3 id="Augment-Setup" class="common-anchor-header">تعزيز الإعداد</h3><p>يوفر Augment الوصول إلى تكوين MCP من خلال لوحة الإعدادات المتقدمة الخاصة به.</p>
<p><strong>الخطوة 1: الوصول إلى الإعدادات</strong></p>
<ol>
<li><p>اضغط على Cmd/Ctrl + Shift + P أو انتقل إلى قائمة الهامبرغر في لوحة Augment</p></li>
<li><p>حدد تحرير الإعدادات</p></li>
<li><p>ضمن خيارات متقدمة، انقر فوق تحرير في settings.json</p></li>
</ol>
<p><strong>الخطوة 2: إضافة تكوين الخادم</strong></p>
<p>أضف تكوين الخادم إلى المصفوفة <code translate="no">mcpServers</code> في الكائن <code translate="no">augment.advanced</code>:</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;sdk-code-helper&quot;</span>: {
      <span class="hljs-string">&quot;url&quot;</span>: <span class="hljs-string">&quot;https://sdk.milvus.io/mcp/&quot;</span>,
      <span class="hljs-string">&quot;headers&quot;</span>: {
        <span class="hljs-string">&quot;Accept&quot;</span>: <span class="hljs-string">&quot;text/event-stream&quot;</span>
      }
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Gemini-CLI-Setup" class="common-anchor-header">إعداد Gemini CLI</h3><p>يتطلب Gemini CLI تكوينًا يدويًا من خلال ملف إعدادات JSON.</p>
<p><strong>الخطوة 1: إنشاء ملف الإعدادات أو تحريره</strong></p>
<p>قم بإنشاء أو تحرير ملف <code translate="no">~/.gemini/settings.json</code> على نظامك.</p>
<p><strong>الخطوة 2: إضافة تكوين</strong></p>
<p>أدخل التكوين التالي في ملف الإعدادات:</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;sdk-code-helper&quot;</span>: {
      <span class="hljs-string">&quot;url&quot;</span>: <span class="hljs-string">&quot;https://sdk.milvus.io/mcp/&quot;</span>,
      <span class="hljs-string">&quot;headers&quot;</span>: {
        <span class="hljs-string">&quot;Accept&quot;</span>: <span class="hljs-string">&quot;text/event-stream&quot;</span>
      }
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>الخطوة 3: تطبيق التغييرات</strong></p>
<p>احفظ الملف وأعد تشغيل Gemini CLI لتطبيق تغييرات التكوين.</p>
<h3 id="Roo-Code-Setup" class="common-anchor-header">إعداد Roo Code</h3><p>يستخدم Roo Code ملف تكوين JSON مركزي لإدارة خوادم MCP.</p>
<p><strong>الخطوة 1: الوصول إلى التكوين العام</strong></p>
<ol>
<li><p>افتح Roo Code</p></li>
<li><p>انتقل إلى الإعدادات → خوادم MCP → تحرير التكوين العام</p></li>
</ol>
<p><strong>الخطوة 2: تحرير ملف التكوين</strong></p>
<p>في ملف <code translate="no">mcp_settings.json</code> ، أضف التكوين التالي:</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;sdk-code-helper&quot;</span>: {
      <span class="hljs-string">&quot;url&quot;</span>: <span class="hljs-string">&quot;https://sdk.milvus.io/mcp/&quot;</span>,
      <span class="hljs-string">&quot;headers&quot;</span>: {
        <span class="hljs-string">&quot;Accept&quot;</span>: <span class="hljs-string">&quot;text/event-stream&quot;</span>
      }
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>الخطوة 3: تنشيط الخادم</strong></p>
<p>احفظ الملف لتنشيط خادم MCP تلقائيًا.</p>
<h3 id="Verification-and-Testing" class="common-anchor-header">التحقق والاختبار</h3><p>بعد الانتهاء من الإعداد لـ IDE الذي اخترته، يمكنك التحقق من أن مساعد كود Milvus SDK يعمل بشكل صحيح من خلال:</p>
<ol>
<li><p><strong>اختبار إنشاء التعليمات البرمجية</strong>: اطلب من مساعد الذكاء الاصطناعي الخاص بك توليد التعليمات البرمجية المتعلقة بـ Milvus ومراقبة ما إذا كان يستخدم أفضل الممارسات الحالية</p></li>
<li><p><strong>التحقق من الوصول إلى الوثائق</strong>: اطلب معلومات حول ميزات Milvus محددة للتأكد من أن المساعد يقدم إجابات محدثة</p></li>
<li><p><strong>مقارنة النتائج</strong>: قم بتوليد نفس طلب التعليمات البرمجية مع المساعد وبدونه لمعرفة الفرق في الجودة والحداثة</p></li>
</ol>
<h2 id="Conclusion" class="common-anchor-header">الخاتمة<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>من خلال إعداد مساعد كود Milvus SDK، تكون قد اتخذت خطوة حاسمة نحو مستقبل التطوير - حيث لا يقوم مساعدو الذكاء الاصطناعي بتوليد كود سريع فحسب، بل <strong>كود دقيق وحديث</strong>. فبدلاً من الاعتماد على بيانات التدريب الثابتة التي أصبحت قديمة، فإننا نتجه نحو أنظمة معرفة ديناميكية آنية تتطور مع التقنيات التي تدعمها.</p>
<p>ومع ازدياد تطوّر مساعدي ترميز الذكاء الاصطناعي في مجال البرمجة ستزداد الفجوة بين الأدوات ذات المعرفة الحالية وتلك التي لا تمتلكها اتساعاً. إن مساعد البرمجة Milvus SDK هو مجرد البداية - نتوقع أن نرى خوادم معرفية متخصصة مماثلة للتقنيات والأطر الرئيسية الأخرى. المستقبل ملك للمطورين الذين يستطيعون تسخير سرعة الذكاء الاصطناعي مع ضمان الدقة والحداثة. أنت الآن مجهز بكلا الأمرين.</p>
