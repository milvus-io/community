---
id: >-
  milvus-2-2-12-easier-access-faster-vector-search-speeds-better-user-experience.md
title: 'Milvus 2.2.12: وصول أسهل، وسرعات بحث أسرع عن المتجهات، وتجربة مستخدم أفضل'
author: 'Owen Jiao, Fendy Feng'
date: 2023-07-28T00:00:00.000Z
cover: assets.zilliz.com/What_s_New_in_2_2_12_20230720_143424_7d19280738.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Vector Search
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/milvus-2-2-12-easier-access-faster-vector-search-speeds-better-user-experience.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_s_New_in_2_2_12_20230720_143424_7d19280738.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>يسرنا أن نعلن عن الإصدار الأخير من Milvus 2.2.12. يتضمن هذا التحديث العديد من الميزات الجديدة، مثل دعم واجهة برمجة تطبيقات RESTful، ووظيفة <code translate="no">json_contains</code> ، واسترجاع المتجهات أثناء عمليات البحث في الشبكة الوطنية استجابةً لتعليقات المستخدمين. كما قمنا أيضًا بتبسيط تجربة المستخدم وتحسين سرعات البحث عن المتجهات وحل العديد من المشكلات. دعونا نتعمق في ما يمكن أن نتوقعه من Milvus 2.2.12.</p>
<h2 id="Support-for-RESTful-API" class="common-anchor-header">دعم واجهة برمجة تطبيقات RESTful<button data-href="#Support-for-RESTful-API" class="anchor-icon" translate="no">
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
    </button></h2><p>يدعم الإصدار Milvus 2.2.12 الآن واجهة برمجة تطبيقات RESTful API، والتي تمكّن المستخدمين من الوصول إلى Milvus دون تثبيت عميل، مما يجعل عمليات الخادم والعميل سهلة. بالإضافة إلى ذلك، أصبح نشر Milvus أكثر ملاءمة لأن Milvus SDK وواجهة برمجة تطبيقات RESTful API يشتركان في نفس رقم المنفذ.</p>
<p><strong>ملاحظة</strong>: ما زلنا نوصي باستخدام SDK لنشر Milvus للعمليات المتقدمة أو إذا كان عملك حساسًا لوقت الاستجابة.</p>
<h2 id="Vector-retrieval-during-ANN-searches" class="common-anchor-header">استرجاع المتجهات أثناء عمليات البحث عن الشبكة الوطنية<button data-href="#Vector-retrieval-during-ANN-searches" class="anchor-icon" translate="no">
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
    </button></h2><p>في الإصدارات السابقة، لم يكن Milvus يسمح باسترجاع المتجهات أثناء عمليات البحث عن الجار الأقرب التقريبي (ANN) لتحديد أولويات الأداء واستخدام الذاكرة. ونتيجةً لذلك، كان يجب تقسيم استرجاع المتجهات الخام إلى خطوتين: إجراء بحث الشبكة العصبية الاصطناعية ثم الاستعلام عن المتجهات الخام بناءً على معرّفاتها. أدى هذا النهج إلى زيادة تكاليف التطوير وجعل من الصعب على المستخدمين نشر واعتماد Milvus.</p>
<p>مع الإصدار Milvus 2.2.12، يمكن للمستخدمين استرداد المتجهات الخام أثناء عمليات بحث الشبكة العصبية الاصطناعية من خلال تعيين حقل المتجه كحقل إخراج والاستعلام في مجموعات مفهرسة بـ HNSW أو DiskANN أو IVF-FLAT. بالإضافة إلى ذلك، يمكن للمستخدمين توقع سرعة استرجاع المتجهات بشكل أسرع بكثير.</p>
<h2 id="Support-for-operations-on-JSON-arrays" class="common-anchor-header">دعم العمليات على مصفوفات JSON<button data-href="#Support-for-operations-on-JSON-arrays" class="anchor-icon" translate="no">
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
    </button></h2><p>أضفنا مؤخرًا دعم JSON في Milvus 2.2.8. ومنذ ذلك الحين، أرسل المستخدمون العديد من الطلبات لدعم عمليات إضافية لمصفوفات JSON، مثل التضمين والاستبعاد والتقاطع والاتحاد والفرق وغيرها. في Milvus 2.2.12، أعطينا الأولوية لدعم الدالة <code translate="no">json_contains</code> لتمكين عملية التضمين. سنستمر في إضافة الدعم للمشغلات الأخرى في الإصدارات المستقبلية.</p>
<h2 id="Enhancements-and-bug-fixes" class="common-anchor-header">التحسينات وإصلاح الأخطاء<button data-href="#Enhancements-and-bug-fixes" class="anchor-icon" translate="no">
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
    </button></h2><p>بالإضافة إلى تقديم ميزات جديدة، حسّن الإصدار Milvus 2.2.12 أداء البحث المتجه مع تقليل النفقات العامة، مما يسهل التعامل مع عمليات البحث المكثفة في توبك. علاوة على ذلك، فهو يحسّن أداء الكتابة في حالات تمكين مفتاح التقسيم والأقسام المتعددة ويحسّن استخدام وحدة المعالجة المركزية للأجهزة الكبيرة. يعالج هذا التحديث العديد من المشكلات: الاستخدام المفرط للقرص، والضغط العالق، وحذف البيانات غير المتكرر، وفشل الإدراج بالجملة. للمزيد من المعلومات، يُرجى الرجوع إلى <a href="https://milvus.io/docs/release_notes.md#2212">ملاحظات الإصدار Milvus 2.2.12</a>.</p>
<h2 id="Lets-keep-in-touch" class="common-anchor-header">لنبقى على اتصال!<button data-href="#Lets-keep-in-touch" class="anchor-icon" translate="no">
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
    </button></h2><p>إذا كانت لديك أسئلة أو ملاحظات حول Milvus، لا تتردد في التواصل معنا عبر <a href="https://twitter.com/milvusio">تويتر</a> أو <a href="https://www.linkedin.com/company/the-milvus-project">لينكد إن</a>. نرحب بك أيضًا للانضمام إلى <a href="https://milvus.io/slack/">قناة Slack</a> الخاصة بنا للدردشة مع مهندسينا والمجتمع مباشرةً أو الاطلاع على <a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">ساعات العمل يوم الثلاثاء</a>!</p>
