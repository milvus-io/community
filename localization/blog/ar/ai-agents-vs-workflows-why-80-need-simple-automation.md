---
id: ai-agents-vs-workflows-why-80-need-simple-automation.md
title: >-
  وكلاء الذكاء الاصطناعي أم مهام سير العمل؟ لماذا يجب عليك تخطي الوكلاء في 80%
  من مهام الأتمتة
author: Min Yin
date: 2025-08-11T00:00:00.000Z
desc: >-
  يوفر التكامل بين Refly وMilvus نهجًا عمليًا للأتمتة - نهجًا يقدّر الموثوقية
  وسهولة الاستخدام على التعقيد غير الضروري.
cover: >-
  assets.zilliz.com/AI_Agents_or_Workflows_Why_You_Should_Skip_Agents_for_80_of_Automation_Tasks_9f54386e8a.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus, AI Agent, workflow, Refly, vector database'
meta_title: |
  AI Agents or Workflows? Why Skip Agents for 80% of Automation
origin: 'https://milvus.io/blog/ai-agents-vs-workflows-why-80-need-simple-automation.md'
---
<p>وكلاء الذكاء الاصطناعي موجودون في كل مكان الآن - بدءاً من روبوتات البرمجة إلى روبوتات خدمة العملاء - ويمكن أن يكونوا جيدين بشكل مذهل في التفكير المعقد. ومثل الكثير منكم، أنا أحبهم. ولكن بعد بناء كل من الوكلاء وسير عمل الأتمتة، تعلمت حقيقة بسيطة: الوكلاء <strong>ليسوا الحل الأفضل لكل مشكلة.</strong></p>
<p>على سبيل المثال، عندما قمتُ ببناء نظام متعدد الوكلاء مع CrewAI لفك تشفير التعلم الآلي، أصبحت الأمور فوضوية بسرعة. تجاهل وكلاء البحث برامج زحف الويب بنسبة 70% من الوقت. أسقط وكلاء الملخص الاستشهادات. وانهار التنسيق كلما كانت المهام غير واضحة تماماً.</p>
<p>ولا يقتصر الأمر على التجارب فقط. فالكثيرون منا يتنقلون بالفعل بين ChatGPT للعصف الذهني، وClaude للترميز، ونصف دزينة من واجهات برمجة التطبيقات لمعالجة البيانات - نفكر بهدوء: <em>يجب أن تكون هناك طريقة أفضل لجعل كل هذا يعمل معًا.</em></p>
<p>في بعض الأحيان، تكون الإجابة هي وكيل. في كثير من الأحيان، هو <strong>سير عمل ذكاء اصطناعي مصمم بشكل جيد</strong> يدمج أدواتك الحالية في شيء قوي، دون تعقيد لا يمكن التنبؤ به.</p>
<h2 id="Building-Smarter-AI-Workflows-with-Refly-and-Milvus" class="common-anchor-header">بناء سير عمل ذكاء اصطناعي أكثر ذكاءً مع Refly وMilvus<button data-href="#Building-Smarter-AI-Workflows-with-Refly-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>أعلم أن بعضكم يهز رأسه بالفعل: "سير العمل؟ إنها جامدة. إنها ليست ذكية بما يكفي لأتمتة الذكاء الاصطناعي الحقيقية." نقطة عادلة - معظم عمليات سير العمل جامدة، لأنها مصممة على غرار خطوط التجميع القديمة: الخطوة أ ← الخطوة ب ← الخطوة ج، لا يسمح بالانحراف.</p>
<p>لكن المشكلة الحقيقية ليست في <em>فكرة</em> سير العمل، بل في <em>التنفيذ</em>. لا يتعين علينا أن نكتفي بخطوط أنابيب خطية هشة. يمكننا تصميم عمليات سير عمل أكثر ذكاءً تتكيف مع السياق، وتتسم بالمرونة والإبداع، وتحقق نتائج يمكن التنبؤ بها.</p>
<p>في هذا الدليل، سنقوم ببناء نظام كامل لإنشاء المحتوى باستخدام Refly وMilvus لإظهار لماذا يمكن أن تتفوق عمليات سير عمل الذكاء الاصطناعي على البنى المعقدة متعددة العوامل، خاصةً إذا كنت تهتم بالسرعة والموثوقية وقابلية الصيانة.</p>
<h3 id="The-Tools-We’re-Using" class="common-anchor-header">الأدوات التي نستخدمها</h3><p><a href="https://refly.ai/"><strong>ريفلي</strong></a>: منصة إنشاء محتوى مفتوحة المصدر قائمة على الذكاء الاصطناعي مبنية على مفهوم "اللوحة القماشية الحرة".</p>
<ul>
<li><p><strong>الإمكانيات الأساسية:</strong> اللوحة الذكية، وإدارة المعرفة، والحوار متعدد الخيوط، وأدوات الإنشاء الاحترافية.</p></li>
<li><p><strong>لماذا هي مفيدة:</strong> يتيح لك بناء سير العمل بالسحب والإفلات إمكانية ربط الأدوات معًا في تسلسل أتمتة متماسك، دون تقييدك في تنفيذ جامد أحادي المسار.</p></li>
</ul>
<p><a href="https://milvus.io/"><strong>Milvus</strong></a>: قاعدة بيانات متجهة مفتوحة المصدر تتعامل مع طبقة البيانات.</p>
<ul>
<li><p><strong>ما أهمية ذلك:</strong> يتعلق إنشاء المحتوى في الغالب بالعثور على المعلومات الموجودة وإعادة تجميعها. تتعامل قواعد البيانات التقليدية مع البيانات المهيكلة بشكل جيد، ولكن معظم الأعمال الإبداعية تتضمن تنسيقات غير منظمة - مستندات وصور ومقاطع فيديو.</p></li>
<li><p><strong>ما الذي يضيفه:</strong> تستفيد Milvus من نماذج التضمين المدمجة لترميز البيانات غير المهيكلة كمتجهات، مما يتيح البحث الدلالي حتى تتمكن عمليات سير العمل من استرداد السياق ذي الصلة بزمن انتقال يبلغ جزء من الثانية. من خلال بروتوكولات مثل MCP، يتكامل بسلاسة مع أطر عمل الذكاء الاصطناعي الخاصة بك، مما يتيح لك الاستعلام عن البيانات بلغة طبيعية بدلاً من المصارعة مع بناء قواعد البيانات.</p></li>
</ul>
<h3 id="Setting-Up-Your-Environment" class="common-anchor-header">إعداد بيئتك</h3><p>دعني أطلعك على إعداد سير العمل هذا محلياً.</p>
<p><strong>قائمة مراجعة سريعة للإعداد:</strong></p>
<ul>
<li><p>أوبونتو 20.04+ (أو لينكس مشابه)</p></li>
<li><p>Docker + Docker Compose</p></li>
<li><p>مفتاح واجهة برمجة التطبيقات من أي LLM يدعم استدعاء الدالة. هنا في هذا الدليل، سأستخدم <a href="https://platform.moonshot.ai/docs/introduction#text-generation-model">Moonshot'</a>s LLM.</p></li>
</ul>
<p><strong>متطلبات النظام</strong></p>
<ul>
<li><p>وحدة المعالجة المركزية 8 أنوية كحد أدنى (يوصى بـ 16 نواة)</p></li>
<li><p>الذاكرة: 16 جيجابايت كحد أدنى (يوصى ب 32 جيجابايت)</p></li>
<li><p>التخزين: قرص SSD سعة 100 جيجابايت كحد أدنى (يوصى ب 500 جيجابايت)</p></li>
<li><p>الشبكة: مطلوب اتصال مستقر بالإنترنت</p></li>
</ul>
<p><strong>تبعيات البرامج</strong></p>
<ul>
<li><p>نظام التشغيل: لينكس (يوصى باستخدام Ubuntu 20.04+)</p></li>
<li><p>نظام الحاويات: Docker + Docker Compose</p></li>
<li><p>بايثون: الإصدار 3.11 أو أعلى</p></li>
<li><p>نموذج اللغة: أي نموذج يدعم استدعاءات الدالة (الخدمات عبر الإنترنت أو النشر دون اتصال بالإنترنت يعمل كلاهما)</p></li>
</ul>
<h3 id="Step-1-Deploy-the-Milvus-Vector-Database" class="common-anchor-header">الخطوة 1: نشر قاعدة بيانات ميلفوس فيكتور</h3><p><strong>1.1 تحميل ميلفوس</strong></p>
<pre><code translate="no">wget https://github.com/milvus-io/milvus/releases/download/v2.5.12/milvus-standalone-docker-compose.yml -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<p><strong>1.2 إطلاق خدمات ميلفوس</strong></p>
<pre><code translate="no">docker-compose up -d
docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_b93ce78614.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Deploy-the-Refly-Platform" class="common-anchor-header">الخطوة 2: نشر منصة ريفلي</h3><p><strong>2.1 استنساخ المستودع</strong></p>
<p>يمكنك استخدام القيم الافتراضية لجميع متغيرات البيئة ما لم تكن لديك متطلبات محددة:</p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/refly-ai/refly.git
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-built_in">cd</span> deploy/docker
<span class="hljs-built_in">cp</span> ../../apps/api/.env.example .<span class="hljs-built_in">env</span> <span class="hljs-comment"># copy the example api env file</span>
docker compose up -d
<button class="copy-code-btn"></button></code></pre>
<p><strong>2.2 التحقق من حالة الخدمة</strong></p>
<pre><code translate="no">docker ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_cfcde2c570.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-Set-Up-MCP-Services" class="common-anchor-header">الخطوة 3: إعداد خدمات MCP</h3><p><strong>3.1 تحميل خادم ميلفوس MCP</strong></p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/zilliztech/mcp-server-milvus.git
<span class="hljs-built_in">cd</span> mcp-server-milvus
<button class="copy-code-btn"></button></code></pre>
<p><strong>3.2 بدء تشغيل خدمة MCP</strong></p>
<p>يستخدم هذا المثال وضع SSE. استبدل URI بنقطة نهاية خدمة Milvus المتوفرة لديك:</p>
<pre><code translate="no">uv run src/mcp_server_milvus/server.py --sse --milvus-uri http://localhost:19530 --port 8000
<button class="copy-code-btn"></button></code></pre>
<p><strong>3.3 قم بتأكيد تشغيل خدمة MCP</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_b755922c41.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Configuration-and-Setup" class="common-anchor-header">الخطوة 4: التهيئة والإعداد</h3><p>الآن بعد أن أصبحت البنية التحتية الخاصة بك قيد التشغيل، دعنا نهيئ كل شيء للعمل معًا بسلاسة.</p>
<p><strong>4.1 الوصول إلى منصة Refly</strong></p>
<p>انتقل إلى مثيل Refly المحلي الخاص بك:</p>
<pre><code translate="no"><span class="hljs-attr">http</span>:<span class="hljs-comment">//192.168.7.148:5700</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_c1e421fece.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.2 أنشئ حسابك</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/42_4b8af22fe3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/422_e8cd8439f0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.3 قم بتكوين نموذج اللغة الخاص بك</strong></p>
<p>في هذا الدليل، سنستخدم <a href="https://platform.moonshot.ai/docs/introduction#text-generation-model">Moonshot</a>. أولاً، قم بالتسجيل والحصول على مفتاح API الخاص بك.</p>
<p><strong>4.4 أضف موفر النموذج الخاص بك</strong></p>
<p>أدخل مفتاح واجهة برمجة التطبيقات الذي حصلت عليه في الخطوة السابقة:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/44_b085f9a263.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.5 قم بتهيئة نموذج LLM</strong></p>
<p>تأكد من تحديد نموذج يدعم قدرات استدعاء الدالة، حيث أن هذا ضروري لتكاملات سير العمل التي سنقوم ببنائها:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/45_a05213d0fa.pngQ" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.6 دمج خدمة Milvus-MCP</strong></p>
<p>لاحظ أن إصدار الويب لا يدعم اتصالات من نوع stdio، لذلك سنستخدم نقطة نهاية HTTP التي أنشأناها سابقًا:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/46_027e21e479.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/462_959ee44a78.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>ممتاز! بعد تكوين كل شيء، دعنا نرى هذا النظام قيد التنفيذ من خلال بعض الأمثلة العملية.</p>
<p><strong>4.7 مثال: استرجاع المتجهات بكفاءة مع خادم MCP-Milvus-Server</strong></p>
<p>يوضح هذا المثال كيف يعمل <strong>خادم MCP-Milvus-Server</strong> كبرنامج وسيط بين نماذج الذكاء الاصطناعي الخاصة بك ومثيلات قاعدة بيانات متجهات ميلفوس. فهو يعمل كمترجم - قبول طلبات اللغة الطبيعية من نموذج الذكاء الاصطناعي الخاص بك، وتحويلها إلى استعلامات قاعدة البيانات الصحيحة، وإرجاع النتائج - حتى تتمكن نماذجك من العمل مع بيانات المتجهات دون معرفة أي بناء جملة قاعدة بيانات.</p>
<p><strong>4.7.1 إنشاء لوحة جديدة</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/471_a684e275ed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.7.2 بدء محادثة</strong></p>
<p>افتح واجهة الحوار، وحدد نموذجك، وأدخل سؤالك، وأرسل.</p>
<p><strong>4.7.3 راجع النتائج</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/473_7c24a28999.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>ما يحدث هنا رائع جدًا: لقد أظهرنا للتو تحكمًا لغويًا طبيعيًا في قاعدة بيانات متجه ميلفوس باستخدام <a href="https://milvus.io/blog/talk-to-vector-db-manage-milvus-via-natural-language.md">MCP-Milvus-Server</a> كطبقة تكامل. لا يوجد بناء جملة استعلام معقدة - فقط أخبر النظام بما تحتاجه بلغة إنجليزية بسيطة، وسيتولى النظام عمليات قاعدة البيانات نيابةً عنك.</p>
<p><strong>4.8 مثال 2: بناء دليل نشر إعادة النشر مع تدفقات العمل</strong></p>
<p>يوضح هذا المثال الثاني القوة الحقيقية لتنسيق سير العمل. سنقوم بإنشاء دليل نشر كامل من خلال الجمع بين أدوات الذكاء الاصطناعي المتعددة ومصادر البيانات في عملية واحدة متماسكة.</p>
<p><strong>4.8.1 اجمع موادك المصدرية</strong></p>
<p>تكمن قوة Refly في مرونته في التعامل مع تنسيقات الإدخال المختلفة. يمكنك استيراد الموارد بتنسيقات متعددة، سواء كانت مستندات أو صور أو بيانات منظمة.</p>
<p><strong>4.8.2 إنشاء المهام وربط بطاقات الموارد</strong></p>
<p>سنقوم الآن بإنشاء سير عملنا من خلال تحديد المهام وربطها بموادنا المصدرية.</p>
<p><strong>4.8.3 إنشاء ثلاث مهام معالجة</strong></p>
<p>هذا هو المكان الذي يتألق فيه نهج سير العمل حقًا. فبدلاً من محاولة التعامل مع كل شيء في عملية واحدة معقدة، نقوم بتقسيم العمل إلى ثلاث مهام مركزة تدمج المواد التي تم تحميلها وتنقيحها بشكل منهجي.</p>
<ul>
<li><p><strong>مهمة تكامل المحتوى</strong>: دمج وهيكلة المواد المصدرية</p></li>
<li><p><strong>مهمة تنقيح المحتوى</strong>: تحسين الوضوح والتدفق</p></li>
<li><p><strong>تجميع المسودة النهائية</strong>: إنشاء مخرجات جاهزة للنشر</p></li>
</ul>
<p>النتائج تتحدث عن نفسها. ما كان يستغرق ساعات من التنسيق اليدوي عبر أدوات متعددة يتم التعامل معه الآن تلقائيًا، مع بناء كل خطوة بشكل منطقي على الخطوة السابقة.</p>
<p><strong>إمكانيات سير العمل متعدد الوسائط:</strong></p>
<ul>
<li><p><strong>توليد الصور ومعالجتها</strong>: التكامل مع النماذج عالية الجودة بما في ذلك flux-schnell وflux-pro وSDXL</p></li>
<li><p><strong>توليد الفيديو وفهمه</strong>: دعم العديد من نماذج الفيديو المنمقة، بما في ذلك سيدانس وكلينغ وفيو</p></li>
<li><p><strong>أدوات توليد الصوت</strong>: توليد الموسيقى من خلال نماذج مثل Lyria-2 وتوليف الصوت عبر نماذج مثل Chatterbox</p></li>
<li><p><strong>معالجة متكاملة</strong>: يمكن الرجوع إلى جميع المخرجات متعددة الوسائط وتحليلها وإعادة معالجتها داخل النظام</p></li>
</ul>
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
    </button></h2><p>يقدم تكامل <strong>Refly</strong> و <strong>Milvus</strong> نهجًا عمليًا للأتمتة - نهجًا يقدّر الموثوقية وسهولة الاستخدام على التعقيد غير الضروري. من خلال الجمع بين تنسيق سير العمل والمعالجة متعددة الوسائط، يمكن للفرق الانتقال من المفهوم إلى النشر بشكل أسرع مع الاحتفاظ بالتحكم الكامل في كل مرحلة.</p>
<p>لا يتعلق الأمر برفض وكلاء الذكاء الاصطناعي. فهي ذات قيمة في معالجة المشاكل المعقدة حقاً والتي لا يمكن التنبؤ بها. ولكن بالنسبة للعديد من احتياجات الأتمتة - خاصةً في إنشاء المحتوى ومعالجة البيانات - يمكن لسير العمل المصمم جيدًا أن يحقق نتائج أفضل مع نفقات أقل.</p>
<p>مع تطور تكنولوجيا الذكاء الاصطناعي، من المرجح أن تمزج الأنظمة الأكثر فعالية بين الاستراتيجيتين:</p>
<ul>
<li><p><strong>تدفقات العمل</strong> حيث تكون إمكانية التنبؤ والصيانة وقابلية التكرار هي المفتاح.</p></li>
<li><p><strong>الوكلاء</strong> حيث يكون التفكير الحقيقي والقدرة على التكيف وحل المشكلات المفتوح مطلوبًا.</p></li>
</ul>
<p>الهدف ليس بناء الذكاء الاصطناعي الأكثر بهرجة - بل بناء الذكاء الاصطناعي الأكثر <em>فائدة</em>. وفي كثير من الأحيان، يكون الحل الأكثر فائدة هو الأكثر وضوحًا أيضًا.</p>
