---
id: drag-drop-and-deploy-how-to-build-rag-workflows-with-langflow-and-milvus.md
title: 'السحب والإسقاط والنشر: كيفية إنشاء مهام سير عمل RAG باستخدام لانجفلو وميلفوس'
author: Min Yin
date: 2025-10-30T00:00:00.000Z
cover: assets.zilliz.com/drag_drop_deploy_859c4369e8.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Langflow, Milvus, RAG, AI workflow'
meta_title: 'Drag, Drop, and Deploy RAG Workflows with Langflow & Milvus'
desc: >-
  تعرّف على كيفية إنشاء تدفقات عمل RAG المرئية باستخدام Langflow وMilvus. قم
  بسحب تطبيقات الذكاء الاصطناعي المدركة للسياق وإسقاطها ونشرها في دقائق - دون
  الحاجة إلى ترميز.
origin: >-
  https://milvus.io/blog/drag-drop-and-deploy-how-to-build-rag-workflows-with-langflow-and-milvus.md
---
<p>غالباً ما يبدو بناء سير عمل الذكاء الاصطناعي أصعب مما ينبغي. فبين كتابة التعليمات البرمجية الصمغية، وتصحيح أخطاء مكالمات واجهة برمجة التطبيقات، وإدارة خطوط أنابيب البيانات، يمكن أن تستغرق العملية ساعات قبل أن ترى النتائج. يعمل كل من <a href="https://www.langflow.org/"><strong>Langflow</strong></a> و <a href="https://milvus.io/"><strong>Milvus</strong></a> على تبسيط هذا الأمر بشكل كبير - مما يمنحك طريقة خفيفة من التعليمات البرمجية لتصميم واختبار ونشر تدفقات عمل الجيل المعزز للاسترجاع (RAG) في دقائق وليس أيام.</p>
<p>يوفر<strong>لانغفلو</strong> واجهة سحب وإفلات نظيفة وواضحة تشبه رسم الأفكار على السبورة البيضاء أكثر من البرمجة. يمكنك ربط نماذج اللغة ومصادر البيانات والأدوات الخارجية بصريًا لتحديد منطق سير عملك - كل ذلك دون لمس سطر من التعليمات البرمجية.</p>
<p>وبالاقتران مع <strong>Milvus،</strong> قاعدة البيانات المتجهة مفتوحة المصدر التي تمنح نماذج اللغة الإنجليزية طويلة المدى والفهم السياقي، يشكل الاثنان بيئة كاملة لـ RAG على مستوى الإنتاج. يقوم Milvus بتخزين واسترجاع التضمينات بكفاءة من بيانات مؤسستك أو البيانات الخاصة بالمجال، مما يسمح لآلات إدارة التعلم الآلي بتوليد إجابات مستندة ودقيقة ومدركة للسياق.</p>
<p>في هذا الدليل، سنتعرف في هذا الدليل على كيفية الجمع بين Langflow وMilvus لبناء سير عمل متقدم في RAG - كل ذلك من خلال بضع عمليات سحب وإسقاط ونقرات.</p>
<h2 id="What-is-Langflow" class="common-anchor-header">ما هو لانج فلو؟<button data-href="#What-is-Langflow" class="anchor-icon" translate="no">
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
    </button></h2><p>قبل الانتقال إلى العرض التوضيحي ل RAG، دعنا نتعرف على ماهية Langflow وما يمكنه القيام به.</p>
<p>لانغفلو هو إطار عمل مفتوح المصدر قائم على لغة بايثون يسهّل بناء تطبيقات الذكاء الاصطناعي وتجربتها. وهو يدعم القدرات الرئيسية للذكاء الاصطناعي مثل الوكلاء وبروتوكول سياق النموذج (MCP)، مما يمنح المطورين وغير المطورين على حد سواء أساسًا مرنًا لإنشاء أنظمة ذكية.</p>
<p>يوفر Langflow في جوهره محررًا مرئيًا. يمكنك سحب وإسقاط وربط موارد مختلفة لتصميم تطبيقات كاملة تجمع بين النماذج والأدوات ومصادر البيانات. عندما تقوم بتصدير سير عمل، يقوم Langflow تلقائيًا بإنشاء ملف باسم <code translate="no">FLOW_NAME.json</code> على جهازك المحلي. يسجل هذا الملف جميع العقد والحواف والبيانات الوصفية التي تصف سير عملك، مما يسمح لك بالتحكم في الإصدار ومشاركة وإعادة إنتاج المشاريع بسهولة عبر الفرق.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Langflow_s_visual_editor_cd553ad4ad.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>خلف الكواليس، يقوم محرك وقت تشغيل قائم على Python بتنفيذ التدفق. يقوم بتنسيق LLMs والأدوات ووحدات الاسترجاع ومنطق التوجيه - إدارة تدفق البيانات والحالة ومعالجة الأخطاء لضمان التنفيذ السلس من البداية إلى النهاية.</p>
<p>يتضمن Langflow أيضًا مكتبة مكوِّنات غنية مع محولات مبنية مسبقًا لمكيفات LLM وقواعد بيانات متجهة شائعة - بما في ذلك <a href="https://milvus.io/">Milvus</a>. يمكنك توسيع ذلك أكثر من خلال إنشاء مكونات بايثون مخصصة لحالات الاستخدام المتخصصة. للاختبار والتحسين، يوفر Langflow التنفيذ خطوة بخطوة، وملعب للاختبار السريع، والتكامل مع LangSmith وLangfuse لمراقبة سير العمل وتصحيح الأخطاء وإعادة تشغيل سير العمل من البداية إلى النهاية.</p>
<h2 id="Hands-on-Demo-How-to-Build-a-RAG-Workflow-with-Langflow-and-Milvus" class="common-anchor-header">عرض توضيحي عملي: كيفية بناء سير عمل RAG مع لانغفلو وميلفوس<button data-href="#Hands-on-Demo-How-to-Build-a-RAG-Workflow-with-Langflow-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>استنادًا إلى بنية Langflow، يمكن أن يعمل Milvus كقاعدة بيانات متجهة تدير التضمينات وتسترجع بيانات المؤسسة الخاصة أو المعرفة الخاصة بالمجال.</p>
<p>في هذا العرض التوضيحي، سنستخدم قالب Vector Store RAG الخاص بـ Langflow لتوضيح كيفية دمج Milvus وإنشاء فهرس متجه من البيانات المحلية، مما يتيح الإجابة الفعالة والمحسّنة للسياق على الأسئلة.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_processing_flow_289a9376c9.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Prerequisites" class="common-anchor-header">المتطلبات الأساسية ：</h3><p>1- بايثون 3.11 (أو كوندا)</p>
<p>2.uv</p>
<p>3.Docker &amp; Docker Compose</p>
<p>4- مفتاح OpenAI</p>
<h3 id="Step-1-Deploy-Milvus-Vector-Database" class="common-anchor-header">الخطوة 1. نشر قاعدة بيانات Milvus Vector</h3><p>قم بتنزيل ملفات النشر.</p>
<pre><code translate="no">wget &lt;https://github.com/Milvus-io/Milvus/releases/download/v2.5.12/Milvus-standalone-docker-compose.yml&gt; -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<p>ابدأ تشغيل خدمة Milvus.</p>
<pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/start_milvus_service_860353ed55.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Create-a-Python-Virtual-Environment" class="common-anchor-header">الخطوة 2. إنشاء بيئة بايثون الافتراضية</h3><pre><code translate="no">conda create -n langflow
<span class="hljs-comment"># activate langflow and launch it</span>
conda activate langflow
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Install-the-Latest-Packages" class="common-anchor-header">الخطوة 3. تثبيت أحدث الحزم</h3><pre><code translate="no">pip install langflow -U
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Launch-Langflow" class="common-anchor-header">الخطوة 4. قم بتشغيل Langflow</h3><pre><code translate="no">uv run langflow run
<button class="copy-code-btn"></button></code></pre>
<p>قم بزيارة Langflow.</p>
<pre><code translate="no">&lt;<span class="hljs-attr">http</span>:<span class="hljs-comment">//127.0.0.1:7860&gt;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-5-Configure-the-RAG-Template" class="common-anchor-header">الخطوة 5. تكوين قالب RAG</h3><p>حدد قالب Vector Store RAG في Langflow.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/rag1_fcb0d1c3c5.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/rag2_f750e10a41.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>اختر ميلفوس كقاعدة بيانات المتجهات الافتراضية.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb_milvus_925c6ce846.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>في اللوحة اليسرى، ابحث عن "Milvus" وأضفه إلى تدفقك.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/add_milvus1_862d14d0d0.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/add_milvus2_4e3d6aacda.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>قم بتكوين تفاصيل اتصال Milvus. اترك الخيارات الأخرى كإعداد افتراضي في الوقت الحالي.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/connect1_a27d3e4f43.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/connect2_d8421c1525.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>أضف مفتاح OpenAI API الخاص بك إلى العقدة ذات الصلة.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/openai_key_7a6596868c.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/openai_key2_4753bfb4d0.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-6-Prepare-Test-Data" class="common-anchor-header">الخطوة 6. قم بإعداد بيانات الاختبار</h3><p>ملاحظة: استخدم الأسئلة الشائعة الرسمية ل Milvus 2.6 كبيانات اختبار.</p>
<pre><code translate="no">https://github.com/milvus-io/milvus-docs/blob/v2.6.x/site/en/faq/product_faq.md
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-7-Phase-One-Testing" class="common-anchor-header">الخطوة 7. اختبار المرحلة الأولى</h3><p>ارفع مجموعة البيانات الخاصة بك وأدخلها في ملفوس. ملاحظة: تقوم لانجفلو بعد ذلك بتحويل النص إلى تمثيلات متجهة. يجب عليك تحميل مجموعتي بيانات على الأقل، وإلا ستفشل عملية التضمين. هذا خطأ معروف في تنفيذ عقدة لانغفلو الحالية.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ingest_7b804d870a.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ingest2_fc7f1e4d9a.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>تحقق من حالة العقد الخاصة بك.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test_48e02d48ca.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-8-Phase-Two-Testing" class="common-anchor-header">الخطوة 8. اختبار المرحلة الثانية</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ingest_7b804d870a.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-9-Run-the-Full-RAG-Workflow" class="common-anchor-header">الخطوة 9. قم بتشغيل سير عمل RAG الكامل</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/full_flow1_5b4f4962f5.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/full_flow2_535c722a3d.webp" alt="" class="doc-image" id="" />
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
    </button></h2><p>لا يجب أن يكون بناء سير عمل الذكاء الاصطناعي معقدًا. يجعل Langflow + Milvus الأمر سريعًا ومرئيًا وخفيفًا - طريقة بسيطة لتحسين RAG دون بذل جهد هندسي كبير.</p>
<p>تجعل واجهة السحب والإفلات في Langflow خيارًا مناسبًا للتدريس أو ورش العمل أو العروض التوضيحية المباشرة، حيث تحتاج إلى توضيح كيفية عمل أنظمة الذكاء الاصطناعي بطريقة واضحة وتفاعلية. بالنسبة للفرق التي تسعى إلى دمج تصميم سير العمل البديهي مع استرجاع المتجهات على مستوى المؤسسات، فإن الجمع بين بساطة Langflow مع بحث Milvus عالي الأداء يوفر المرونة والقوة.</p>
<p>👉 ابدأ في بناء تدفقات عمل RAG أكثر ذكاءً مع <a href="https://milvus.io/">Milvus</a> اليوم.</p>
<p>هل لديك أسئلة أو تريد التعمق في أي ميزة؟ انضم إلى<a href="https://discord.com/invite/8uyFbECzPX"> قناة Discord</a> الخاصة بنا أو قم بتسجيل المشكلات على<a href="https://github.com/milvus-io/milvus"> GitHub</a>. يمكنك أيضًا حجز جلسة فردية مدتها 20 دقيقة للحصول على رؤى وإرشادات وإجابات لأسئلتك من خلال<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> ساعات عمل Milvus المكتبية</a>.</p>
