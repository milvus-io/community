---
id: milvus-229-highly-anticipated-release-with-optimal-user-experience.md
title: 'ميلفوس 2.2.9: إصدار منتظر للغاية مع تجربة مستخدم مثالية مع تجربة مستخدم مثالية'
author: 'Owen Jiao, Fendy Feng'
date: 2023-06-06T00:00:00.000Z
cover: assets.zilliz.com/What_s_New_in_2_2_9_858e54a2d3.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/milvus-229-highly-anticipated-release-with-optimal-user-experience.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_s_New_in_2_2_9_858e54a2d3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>يسعدنا أن نعلن عن وصول الإصدار Milvus 2.2.9، وهو إصدار منتظر للغاية يمثل علامة فارقة مهمة للفريق والمجتمع. يقدم هذا الإصدار العديد من الميزات المثيرة، بما في ذلك الدعم الذي طال انتظاره لأنواع بيانات JSON والمخطط الديناميكي ومفاتيح التقسيم، مما يضمن تجربة مستخدم محسّنة وسير عمل تطويري مبسّط. بالإضافة إلى ذلك، يتضمن هذا الإصدار العديد من التحسينات وإصلاحات الأخطاء. انضم إلينا في استكشاف الإصدار Milvus 2.2.9 واكتشاف سبب أهمية هذا الإصدار.</p>
<h2 id="Optimized-user-experience-with-JSON-support" class="common-anchor-header">تجربة مستخدم محسّنة مع دعم JSON<button data-href="#Optimized-user-experience-with-JSON-support" class="anchor-icon" translate="no">
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
    </button></h2><p>قدّمت Milvus دعمًا منتظرًا للغاية لنوع بيانات JSON، مما يسمح بتخزين بيانات JSON بسلاسة إلى جانب البيانات الوصفية للمتجهات داخل مجموعات المستخدمين. وبفضل هذا التحسين، يمكن للمستخدمين إدراج بيانات JSON بكفاءة بشكل مجمّع وإجراء استعلام وتصفية متقدمة بناءً على محتويات حقول JSON. علاوةً على ذلك، يمكن للمستخدمين الاستفادة من التعبيرات وإجراء عمليات مصممة خصيصًا لحقول JSON الخاصة بمجموعة بياناتهم، وإنشاء استعلامات، وتطبيق عوامل تصفية بناءً على محتوى وهيكل حقول JSON الخاصة بهم، مما يسمح لهم باستخراج المعلومات ذات الصلة ومعالجة البيانات بشكل أفضل.</p>
<p>في المستقبل، سيضيف فريق Milvus فهارس للحقول داخل نوع JSON، مما يزيد من تحسين أداء الاستعلامات القياسية والمتجهة المختلطة. لذا ترقبوا التطورات المثيرة في المستقبل!</p>
<h2 id="Added-flexibility-with-support-for-dynamic-schema" class="common-anchor-header">مرونة إضافية مع دعم المخطط الديناميكي<button data-href="#Added-flexibility-with-support-for-dynamic-schema" class="anchor-icon" translate="no">
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
    </button></h2><p>مع دعم بيانات JSON، يوفر Milvus 2.2.9 الآن وظيفة المخطط الديناميكي من خلال مجموعة تطوير برمجيات مبسطة (SDK).</p>
<p>بدءًا من الإصدار Milvus 2.2.9، تتضمن Milvus SDK واجهة برمجة تطبيقات عالية المستوى تملأ تلقائيًا الحقول الديناميكية في حقل JSON المخفي للمجموعة، مما يسمح للمستخدمين بالتركيز فقط على حقول أعمالهم.</p>
<h2 id="Better-data-separation-and-enhanced-search-efficiency-with-Partition-Key" class="common-anchor-header">فصل أفضل للبيانات وتحسين كفاءة البحث مع مفتاح التقسيم<button data-href="#Better-data-separation-and-enhanced-search-efficiency-with-Partition-Key" class="anchor-icon" translate="no">
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
    </button></h2><p>يعمل الإصدار Milvus 2.2.9 على تحسين قدرات التقسيم من خلال تقديم ميزة مفتاح التقسيم. فهي تسمح بالأعمدة الخاصة بالمستخدم كمفاتيح أساسية للتقسيم، مما يلغي الحاجة إلى واجهات برمجة تطبيقات إضافية مثل <code translate="no">loadPartition</code> و <code translate="no">releasePartition</code>. تزيل هذه الميزة الجديدة أيضًا الحد الأقصى لعدد الأقسام، مما يؤدي إلى استخدام أكثر كفاءة للموارد.</p>
<h2 id="Support-for-Alibaba-Cloud-OSS" class="common-anchor-header">دعم Alibaba Cloud OSS<button data-href="#Support-for-Alibaba-Cloud-OSS" class="anchor-icon" translate="no">
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
    </button></h2><p>يدعم Milvus 2.2.9 الآن خدمة تخزين الكائنات (OSS) من Alibaba Cloud Cloud. يمكن لمستخدمي Alibaba Cloud تكوين <code translate="no">cloudProvider</code> بسهولة إلى Alibaba Cloud والاستفادة من التكامل السلس للتخزين الفعال واسترجاع البيانات المتجهة في السحابة.</p>
<p>بالإضافة إلى الميزات المذكورة سابقًا، يوفر الإصدار Milvus 2.2.9 دعمًا لقاعدة البيانات في التحكم في الوصول المستند إلى الأدوار (RBAC)، ويقدم إدارة الاتصال، ويتضمن العديد من التحسينات وإصلاحات الأخطاء. لمزيد من المعلومات، يرجى الرجوع إلى <a href="https://milvus.io/docs/release_notes.md">ملاحظات الإصدار Milvus 2.2.9</a>.</p>
<h2 id="Let’s-keep-in-touch" class="common-anchor-header">لنبقى على اتصال!<button data-href="#Let’s-keep-in-touch" class="anchor-icon" translate="no">
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
    </button></h2><p>إذا كانت لديك أسئلة أو ملاحظات حول Milvus، لا تتردد في الاتصال بنا عبر <a href="https://twitter.com/milvusio">تويتر</a> أو <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a>. نرحب بك أيضًا للانضمام إلى <a href="https://milvus.io/slack/">قناة Slack</a> الخاصة بنا للدردشة مع مهندسينا والمجتمع مباشرةً أو الاطلاع على <a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">ساعات العمل يوم الثلاثاء</a>!</p>
