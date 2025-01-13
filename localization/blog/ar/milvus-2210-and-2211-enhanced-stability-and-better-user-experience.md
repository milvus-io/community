---
id: milvus-2210-and-2211-enhanced-stability-and-better-user-experience.md
title: 'Milvus 2.2.10 و2.2.11: تحديثات طفيفة لتحسين استقرار النظام وتجربة المستخدم'
author: 'Fendy Feng, Owen Jiao'
date: 2023-07-06T00:00:00.000Z
cover: assets.zilliz.com/What_s_New_in_Milvus_2_2_10_and_2_2_11_5018946465.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
desc: تقديم ميزات وتحسينات جديدة في Milvus 2.2.10 و 2.2.11
recommend: true
metaTitle: Milvus 2.2.10 & 2.2.11 Enhanced System Stability and User Experience
canonicalUrl: >-
  https://milvus.io/blog/milvus-2210-and-2211-enhanced-stability-and-better-user-experience.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_s_New_in_Milvus_2_2_10_and_2_2_11_5018946465.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>تحياتي، عشاق Milvus! يسعدنا أن نعلن أننا قد أصدرنا للتو الإصدارين Milvus 2.2.10 و2.2.11، وهما تحديثان ثانويان يركزان بشكل أساسي على إصلاح الأخطاء وتحسين الأداء بشكل عام. يمكنك أن تتوقع نظامًا أكثر استقرارًا وتجربة مستخدم أفضل مع التحديثين. دعونا نلقي نظرة سريعة على الجديد في هذين الإصدارين.</p>
<h2 id="Milvus-2210" class="common-anchor-header">ميلفوس 2.2.10<button data-href="#Milvus-2210" class="anchor-icon" translate="no">
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
    </button></h2><p>قام الإصدار Milvus 2.2.10 بإصلاح الأعطال العرضية للنظام، وتسريع التحميل والفهرسة، وتقليل استخدام الذاكرة في عقد البيانات، وإجراء العديد من التحسينات الأخرى. فيما يلي بعض التغييرات البارزة:</p>
<ul>
<li>تم استبدال كاتب حمولة CGO القديم بكاتب حمولة CGO جديد مكتوب بلغة Go خالصة، مما قلل من استخدام الذاكرة في عقد البيانات.</li>
<li>إضافة <code translate="no">go-api/v2</code> إلى ملف <code translate="no">milvus-proto</code> لمنع الخلط مع إصدارات <code translate="no">milvus-proto</code> المختلفة.</li>
<li>ترقية Gin من الإصدار 1.9.0 إلى 1.9.1 لإصلاح خطأ في الدالة <code translate="no">Context.FileAttachment</code>.</li>
<li>تمت إضافة التحكم في الوصول المستند إلى الأدوار (RBAC) لواجهات برمجة تطبيقات FlushAll وواجهات برمجة تطبيقات قواعد البيانات.</li>
<li>إصلاح التعطل العشوائي الناجم عن AWS S3 SDK.</li>
<li>تحسين سرعات التحميل والفهرسة.</li>
</ul>
<p>لمزيد من التفاصيل، راجع <a href="https://milvus.io/docs/release_notes.md#2210">ملاحظات الإصدار Milvus 2.2.10 ملاحظات الإصدار</a>.</p>
<h2 id="Milvus-2211" class="common-anchor-header">ملفوس 2.2.11<button data-href="#Milvus-2211" class="anchor-icon" translate="no">
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
    </button></h2><p>قام الإصدار Milvus 2.2.11 بحل العديد من المشكلات لتحسين استقرار النظام. كما قام أيضًا بتحسين أدائه في المراقبة والتسجيل وتحديد المعدل واعتراض الطلبات عبر المجموعات. انظر أدناه للاطلاع على أبرز ميزات هذا التحديث.</p>
<ul>
<li>تمت إضافة معترض إلى خادم Milvus GRPC لمنع أي مشاكل في التوجيه عبر المجموعات.</li>
<li>إضافة رموز خطأ إلى مدير القطع الصغيرة لتسهيل تشخيص الأخطاء وإصلاحها.</li>
<li>استخدام مجموعة كوروتين أحادية لتجنب إهدار الكوروتينات وتعظيم استخدام الموارد.</li>
<li>تقليل استخدام القرص ل RocksMq إلى عُشر مستواه الأصلي من خلال تمكين ضغط zstd.</li>
<li>إصلاح ذعر QueryNode العرضي أثناء التحميل.</li>
<li>إصلاح مشكلة اختناق طلبات القراءة الناجمة عن سوء حساب طول قائمة الانتظار مرتين.</li>
<li>إصلاح المشكلات المتعلقة بإرجاع GetObject لقيم فارغة على نظام MacOS.</li>
<li>إصلاح التعطل الناجم عن الاستخدام غير الصحيح لمُعدِّل noexcept.</li>
</ul>
<p>للمزيد من التفاصيل، راجع <a href="https://milvus.io/docs/release_notes.md#2211">ملاحظات الإصدار Milvus 2.2.11</a>.</p>
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
    </button></h2><p>إذا كانت لديك أسئلة أو ملاحظات حول Milvus، لا تتردد في الاتصال بنا عبر <a href="https://twitter.com/milvusio">تويتر</a> أو <a href="https://www.linkedin.com/company/the-milvus-project">لينكد إن إن</a>. نرحب بك أيضًا للانضمام إلى <a href="https://milvus.io/slack/">قناة Slack</a> الخاصة بنا للدردشة مع مهندسينا والمجتمع مباشرةً أو الاطلاع على <a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">ساعات العمل يوم الثلاثاء</a>!</p>
