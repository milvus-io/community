---
id: create-a-custom-anthropic-skill-for-milvus-to-quickly-spin-up-rag.md
title: >-
  كيف تغيّر المهارات الأنثروبولوجية أدوات الوكيل - وكيفية بناء مهارة مخصصة
  لميلفوس لتدوير RAG بسرعة
author: Min Yin
date: 2026-01-23T00:00:00.000Z
cover: assets.zilliz.com/skills_cover_new_8caa774cc5.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Claude Code, Anthropic Skills, MCP, RAG, Milvus'
meta_title: |
  Create a Custom Anthropic Skill for Milvus to Quickly Spin Up RAG
desc: >-
  تعرّف على ماهية المهارات وكيفية إنشاء مهارة مخصصة في Claude Code تقوم ببناء
  أنظمة RAG المدعومة من Milvus من تعليمات اللغة الطبيعية باستخدام سير عمل قابل
  لإعادة الاستخدام.
origin: >-
  https://milvus.io/blog/create-a-custom-anthropic-skill-for-milvus-to-quickly-spin-up-rag.md
---
<p>يعد استخدام الأداة جزءًا كبيرًا من عمل الوكيل. يحتاج الوكيل إلى اختيار الأداة المناسبة، وتحديد وقت استدعائها، وتنسيق المدخلات بشكل صحيح. على الورق يبدو ذلك واضحًا ومباشرًا، ولكن بمجرد أن تبدأ في بناء أنظمة حقيقية، ستجد الكثير من الحالات الحادة وأنماط الفشل.</p>
<p>تستخدم العديد من الفرق تعريفات الأدوات على غرار MCP لتنظيم ذلك، لكن MCP لديه بعض الحواف الخشنة. يتعين على النموذج التفكير في جميع الأدوات في وقت واحد، ولا يوجد الكثير من الهيكلية لتوجيه قراراته. علاوة على ذلك، يجب أن يعيش كل تعريف أداة في نافذة السياق. بعض هذه الأدوات كبيرة - GitHub MCP حوالي 26 ألف رمز - مما يستهلك السياق قبل أن يبدأ الوكيل في القيام بعمل حقيقي.</p>
<p>قدمت أنثروبيك <a href="https://github.com/anthropics/skills?tab=readme-ov-file"><strong>المهارات</strong></a> لتحسين هذا الوضع. المهارات أصغر حجمًا وأكثر تركيزًا وأسهل في التحميل عند الطلب. بدلاً من تفريغ كل شيء في السياق، يمكنك تجميع منطق المجال أو سير العمل أو البرامج النصية في وحدات مدمجة يمكن للوكيل سحبها عند الحاجة فقط.</p>
<p>في هذا المنشور، سأستعرض في هذا المنشور كيفية عمل المهارات الأنثروبولوجية، ثم سأتناول كيفية بناء مهارة بسيطة في كود كلود والتي تحول اللغة الطبيعية إلى قاعدة معرفية <a href="https://milvus.io/">مدعومة من ميلفوس</a>- إعداد سريع لـ RAG دون الحاجة إلى أسلاك إضافية.</p>
<h2 id="What-Are-Anthropic-Skills" class="common-anchor-header">ما هي المهارات الأنثروبولوجية؟<button data-href="#What-Are-Anthropic-Skills" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/blog/is-mcp-already-outdated-the-real-reason-anthropic-shipped-skills-and-how-to-pair-them-with-milvus.md">المهارات الأنثروبولوجية</a> (أو مهارات الوكيل) هي مجرد مجلدات تجمع التعليمات والنصوص والملفات المرجعية التي يحتاجها الوكيل للتعامل مع مهمة معينة. فكر فيها كحزم قدرات صغيرة مكتفية ذاتيًا. قد تحدد المهارة كيفية إنشاء تقرير أو إجراء تحليل أو اتباع سير عمل أو مجموعة معينة من القواعد.</p>
<p>الفكرة الأساسية هي أن المهارات هي وحدات نمطية ويمكن تحميلها عند الطلب. بدلاً من حشو تعريفات الأدوات الضخمة في نافذة السياق، يقوم الوكيل بسحب المهارة التي يحتاجها فقط. هذا يحافظ على استخدام السياق منخفضًا مع إعطاء النموذج إرشادات واضحة حول الأدوات الموجودة ومتى يتم استدعاؤها وكيفية تنفيذ كل خطوة.</p>
<p>التنسيق بسيط عن قصد، وبسبب ذلك، فهو مدعوم بالفعل أو يمكن تكييفه بسهولة عبر مجموعة من أدوات المطورين - كلود كود، وكورسور، وامتدادات VS Code، وتكامل GitHub، وإعدادات على غرار Codex، وما إلى ذلك.</p>
<p>تتبع المهارة هيكل مجلد متناسق</p>
<pre><code translate="no">skill-name/

├── SKILL.md       <span class="hljs-comment"># Required: Skill instructions and metadata</span>

├── scripts/         <span class="hljs-comment"># Optional: helper scripts</span>

├── templates/       <span class="hljs-comment"># Optional: document templates</span>

└── resources/       <span class="hljs-comment"># Optional: reference materials</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>1.</strong> <code translate="no">SKILL.md</code> <strong>(الملف الأساسي)</strong></p>
<p>هذا هو دليل التنفيذ للوكيل - المستند الذي يخبر الوكيل بالضبط كيف ينبغي تنفيذ المهمة. وهو يحدد البيانات الوصفية للمهارة (مثل الاسم والوصف والكلمات المفتاحية للمشغل)، وسير التنفيذ، والإعدادات الافتراضية. في هذا الملف، يجب أن تصف بوضوح</p>
<ul>
<li><p><strong>متى يجب تشغيل المهارة:</strong> على سبيل المثال، تشغيل المهارة عندما تتضمن مدخلات المستخدم عبارة مثل "معالجة ملفات CSV باستخدام Python."</p></li>
<li><p><strong>كيف يجب تنفيذ المهمة:</strong> وضع خطوات التنفيذ بالترتيب، مثل: تفسير طلب المستخدم ← استدعاء البرامج النصية للمعالجة المسبقة من الدليل <code translate="no">scripts/</code> ← إنشاء الكود المطلوب ← تنسيق المخرجات باستخدام قوالب من <code translate="no">templates/</code>.</p></li>
<li><p><strong>القواعد والقيود:</strong> تحديد التفاصيل مثل اصطلاحات الترميز وتنسيقات الإخراج وكيفية التعامل مع الأخطاء.</p></li>
</ul>
<p><strong>2.</strong> <code translate="no">scripts/</code> <strong>(البرامج النصية للتنفيذ)</strong></p>
<p>يحتوي هذا الدليل على نصوص مكتوبة مسبقًا بلغات مثل Python أو Shell أو Node.js. يمكن للوكيل استدعاء هذه البرامج النصية مباشرة، بدلاً من إنشاء نفس الكود بشكل متكرر في وقت التشغيل. تتضمن الأمثلة النموذجية <code translate="no">create_collection.py</code> و <code translate="no">check_env.py</code>.</p>
<p><strong>3.</strong> <code translate="no">templates/</code> <strong>(قوالب المستندات)</strong></p>
<p>ملفات قوالب قابلة لإعادة الاستخدام يمكن للوكيل استخدامها لإنشاء محتوى مخصص. تتضمن الأمثلة الشائعة قوالب التقارير أو قوالب التكوين.</p>
<p><strong>4.</strong> <code translate="no">resources/</code> <strong>(المواد المرجعية)</strong></p>
<p>المستندات المرجعية التي يمكن للوكيل الرجوع إليها أثناء التنفيذ، مثل وثائق واجهة برمجة التطبيقات أو المواصفات الفنية أو أدلة أفضل الممارسات.</p>
<p>بشكل عام، يعكس هذا الهيكل كيفية تسليم العمل إلى زميل جديد في الفريق: <code translate="no">SKILL.md</code> يشرح الوظيفة، <code translate="no">scripts/</code> يوفر الأدوات الجاهزة للاستخدام، <code translate="no">templates/</code> يحدد التنسيقات القياسية، و <code translate="no">resources/</code> يوفر معلومات أساسية. مع وجود كل هذا، يمكن للوكيل تنفيذ المهمة بشكل موثوق وبأقل قدر من التخمين.</p>
<h2 id="Hands-on-Tutorial-Creating-a-Custom-Skill-for-a-Milvus-Powered-RAG-System" class="common-anchor-header">برنامج تعليمي عملي: إنشاء مهارة مخصصة لنظام RAG المدعوم من ميلفوس<button data-href="#Hands-on-Tutorial-Creating-a-Custom-Skill-for-a-Milvus-Powered-RAG-System" class="anchor-icon" translate="no">
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
    </button></h2><p>في هذا القسم، سنستعرض في هذا القسم إنشاء مهارة مخصصة يمكنها إعداد مجموعة Milvus وتجميع خط أنابيب RAG كامل من تعليمات اللغة الطبيعية البسيطة. الهدف هو تخطي جميع أعمال الإعداد المعتادة - لا تصميم مخطط يدوي ولا تكوين فهرس ولا كود برمجي. أنت تخبر الوكيل بما تريد، وتتولى المهارة معالجة أجزاء Milvus نيابةً عنك.</p>
<h3 id="Design-Overview" class="common-anchor-header">نظرة عامة على التصميم</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/design_overview_d4c886291b.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Prerequisites" class="common-anchor-header">المتطلبات الأساسية</h3><table>
<thead>
<tr><th>المكون</th><th>المتطلبات</th></tr>
</thead>
<tbody>
<tr><td>CLI</td><td><code translate="no">claude-code</code></td></tr>
<tr><td>النماذج</td><td>GLM 4.7، OpenAI</td></tr>
<tr><td>الحاوية</td><td>حاوية</td></tr>
<tr><td>ميلفوس</td><td>2.6.8</td></tr>
<tr><td>منصة تكوين النموذج</td><td>CC-Switch</td></tr>
<tr><td>مدير الحزم</td><td>npm</td></tr>
<tr><td>لغة التطوير</td><td>بايثون</td></tr>
</tbody>
</table>
<h3 id="Step-1-Environment-Setup" class="common-anchor-header">الخطوة 1: إعداد البيئة</h3><p><strong>تثبيت</strong> <code translate="no">claude-code</code></p>
<pre><code translate="no">npm install -g <span class="hljs-meta">@anthropic</span>-ai/claude-code
<button class="copy-code-btn"></button></code></pre>
<p><strong>تثبيت CC-Switch</strong></p>
<p><strong>ملاحظة:</strong> CC-Switch هي أداة لتبديل النماذج تسهّل التبديل بين واجهات برمجة التطبيقات المختلفة للنماذج عند تشغيل نماذج الذكاء الاصطناعي محليًا.</p>
<p>مستودع المشروع: <a href="https://github.com/farion1231/cc-switch">https://github.com/farion1231/cc-switch</a></p>
<p><strong>حدد كلود وأضف مفتاح واجهة برمجة التطبيقات</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_0cdfab2e54.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_615ee13649.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>تحقق من الحالة الحالية</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_f1c13da1fe.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>نشر وبدء تشغيل ميلفوس-ستاندالون</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Download docker-compose.yml</span>

wget https://github.com/milvus-io/milvus/releases/download/v2<span class="hljs-number">.6</span><span class="hljs-number">.8</span>/milvus-standalone-docker-compose.yml -O docker-compose.yml

  

<span class="hljs-comment"># Start Milvus (check port mapping: 19530:19530)</span>

docker-compose up -d

  

<span class="hljs-comment"># Verify that the services are running</span>

docker ps | grep milvus

<span class="hljs-comment"># You should see three containers: milvus-standalone, milvus-etcd, milvus-minio</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code1_9c6a1a7f93.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>تكوين مفتاح OpenAI API Key</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Add this to ~/.bashrc or ~/.zshrc</span>

OPENAI_API_KEY=your_openai_api_key_here
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Create-the-Custom-Skill-for-Milvus" class="common-anchor-header">الخطوة 2: إنشاء المهارة المخصصة لميلفوس</h3><p><strong>إنشاء هيكل الدليل</strong></p>
<pre><code translate="no"><span class="hljs-built_in">cd</span> ~/.claude/skills/

<span class="hljs-built_in">mkdir</span> -p milvus-skills/example milvus-skills/scripts
<button class="copy-code-btn"></button></code></pre>
<p><strong>التهيئة</strong> <code translate="no">SKILL.md</code></p>
<p><strong>ملاحظة:</strong> يعمل SKILL.md كدليل تنفيذ الوكيل. فهو يحدد ما تقوم به المهارة وكيف ينبغي تشغيلها.</p>
<pre><code translate="no"><span class="hljs-attr">name</span>: milvus-collection-builder

<span class="hljs-attr">description</span>: <span class="hljs-title class_">Create</span> <span class="hljs-title class_">Milvus</span> collections <span class="hljs-keyword">using</span> natural language, supporting both <span class="hljs-variable constant_">RAG</span> and text search scenarios
<button class="copy-code-btn"></button></code></pre>
<p><strong>اكتب البرامج النصية الأساسية</strong></p>
<table>
<thead>
<tr><th>نوع البرنامج النصي</th><th>اسم الملف</th><th>الغرض</th></tr>
</thead>
<tbody>
<tr><td>التحقق من البيئة</td><td><code translate="no">check_env.py</code></td><td>التحقق من إصدار Python، والتبعيات المطلوبة، واتصال Milvus</td></tr>
<tr><td>تحليل النية</td><td><code translate="no">intent_parser.py</code></td><td>يقوم بتحويل الطلبات مثل "إنشاء قاعدة بيانات RAG" إلى نية منظمة مثل <code translate="no">scene=rag</code></td></tr>
<tr><td>إنشاء مجموعة</td><td><code translate="no">milvus_builder.py</code></td><td>المنشئ الأساسي الذي ينشئ مخطط المجموعة وتكوين الفهرس</td></tr>
<tr><td>استيعاب البيانات</td><td><code translate="no">insert_milvus_data.py</code></td><td>يقوم بتحميل المستندات وتجزئتها وتوليد التضمينات وكتابة البيانات في Milvus</td></tr>
<tr><td>المثال 1</td><td><code translate="no">basic_text_search.py</code></td><td>يوضح كيفية إنشاء نظام بحث عن المستندات</td></tr>
<tr><td>مثال 2</td><td><code translate="no">rag_knowledge_base.py</code></td><td>يوضح كيفية إنشاء قاعدة معرفية كاملة من RAG</td></tr>
</tbody>
</table>
<p>توضح هذه البرامج النصية كيفية تحويل المهارة التي تركز على Milvus إلى شيء عملي: نظام بحث فعال في المستندات وإعداد قاعدة معرفية ذكية للأسئلة والأجوبة (RAG).</p>
<h3 id="Step-3-Enable-the-Skill-and-Run-a-Test" class="common-anchor-header">الخطوة 3: تمكين المهارة وإجراء اختبار</h3><p><strong>وصف الطلب بلغة طبيعية</strong></p>
<pre><code translate="no"><span class="hljs-string">&quot;I want to build an RAG system.&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test1_64fd549573.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>إنشاء نظام RAG</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test2_80656d59b1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>إدراج بيانات العينة</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test3_392753eb73.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>تشغيل استعلام</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test4_75e23c6a3a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>في هذا البرنامج التعليمي، استعرضنا في هذا البرنامج التعليمي بناء نظام RAG مدعوم من Milvus باستخدام مهارة مخصصة. لم يكن الهدف فقط إظهار طريقة أخرى لاستدعاء Milvus - بل كان الهدف هو إظهار كيف يمكن للمهارات تحويل ما هو عادةً إعداد متعدد الخطوات وثقيل التكوين إلى شيء يمكنك إعادة استخدامه وتكراره. بدلاً من تحديد المخططات يدويًا، أو ضبط الفهارس، أو تجميع كود سير العمل معًا، تتعامل المهارة مع معظم الإجراءات المتعارف عليها حتى تتمكن من التركيز على أجزاء RAG المهمة بالفعل.</p>
<p>هذه هي البداية فقط. يحتوي خط أنابيب RAG الكامل على الكثير من الأجزاء المتحركة: المعالجة المسبقة، والتقطيع، وإعدادات البحث المختلط، وإعادة الترتيب، والتقييم، وغير ذلك. يمكن تجميع كل هذه الأجزاء كمهارات منفصلة وتكوينها حسب حالة الاستخدام الخاصة بك. إذا كان لدى فريقك معايير داخلية لأبعاد المتجهات، أو بارامترات الفهرس، أو قوالب المطالبة، أو منطق الاسترجاع، فإن المهارات هي طريقة نظيفة لترميز تلك المعرفة وجعلها قابلة للتكرار.</p>
<p>بالنسبة للمطورين الجدد، يقلل هذا من عائق الدخول - لا حاجة لتعلم كل تفاصيل ميلفوس قبل تشغيل شيء ما. أما بالنسبة للفرق ذات الخبرة، فهي تقلل من الإعداد المتكرر وتساعد في الحفاظ على اتساق المشاريع عبر البيئات. لن تحل المهارات محل تصميم النظام المدروس، لكنها تزيل الكثير من الاحتكاك غير الضروري.</p>
<p>👉 يتوفر التطبيق الكامل في <a href="https://github.com/yinmin2020/open-milvus-skills">مستودع مفتوح المصدر،</a> ويمكنك استكشاف المزيد من الأمثلة التي أنشأها المجتمع في <a href="https://skillsmp.com/">سوق المهارات</a>.</p>
<h2 id="Stay-tuned" class="common-anchor-header">ترقبوا!<button data-href="#Stay-tuned" class="anchor-icon" translate="no">
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
    </button></h2><p>نحن نعمل أيضًا على تقديم مهارات Milvus وZilliz Cloud الرسمية التي تغطي أنماط RAG الشائعة وأفضل ممارسات الإنتاج. إذا كانت لديك أفكار أو عمليات سير عمل محددة تريد دعمها، انضم إلى <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">قناة Slack</a> الخاصة بنا وتحدث مع مهندسينا. وإذا كنت ترغب في الحصول على إرشادات لإعداداتك الخاصة، يمكنك دائمًا حجز جلسة <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">ساعات عمل Milvus المكتبية</a>.</p>
