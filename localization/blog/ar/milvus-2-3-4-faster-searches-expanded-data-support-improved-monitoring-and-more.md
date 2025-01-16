---
id: >-
  milvus-2-3-4-faster-searches-expanded-data-support-improved-monitoring-and-more.md
title: 'ميلفوس 2.3.4: عمليات بحث أسرع، ودعم موسع للبيانات، ومراقبة محسّنة والمزيد'
author: 'Ken Zhang, Fendy Feng'
date: 2024-01-12T00:00:00.000Z
cover: assets.zilliz.com/What_is_new_in_Milvus_2_3_4_1847b0fa8a.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Vector Search
desc: نقدم لك Milvus 2.3.4 الميزات والتحسينات الجديدة
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/milvus-2-3-4-faster-searches-expanded-data-support-improved-monitoring-and-more.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_is_new_in_Milvus_2_3_4_1847b0fa8a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>نحن متحمسون للكشف عن الإصدار الأخير من Milvus 2.3.4. يقدم هذا التحديث مجموعة من الميزات والتحسينات المصممة بدقة لتحسين الأداء وتعزيز الكفاءة وتقديم تجربة مستخدم سلسة. في منشور المدونة هذا، سنتناول في هذه المدونة أبرز مزايا الإصدار Milvus 2.3.4.</p>
<h2 id="Access-logs-for-improved-monitoring" class="common-anchor-header">سجلات الوصول لتحسين المراقبة<button data-href="#Access-logs-for-improved-monitoring" class="anchor-icon" translate="no">
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
    </button></h2><p>يدعم Milvus الآن سجلات الوصول، مما يوفر رؤى لا تقدر بثمن حول التفاعلات مع الواجهات الخارجية. تسجل هذه السجلات أسماء الطرق، وطلبات المستخدم، وأوقات الاستجابة، ورموز الخطأ، ومعلومات التفاعل الأخرى، مما يمكّن المطورين ومسؤولي النظام من إجراء تحليل الأداء، والتدقيق الأمني، واستكشاف الأخطاء وإصلاحها بكفاءة.</p>
<p><strong><em>ملاحظة:</em></strong> <em>تدعم سجلات الوصول حاليًا تفاعلات gRPC فقط. ومع ذلك، فإن التزامنا بالتحسين مستمر، وستعمل الإصدارات المستقبلية على توسيع هذه الإمكانية لتشمل سجلات الطلبات RESTful.</em></p>
<p>لمزيد من المعلومات التفصيلية، راجع <a href="https://milvus.io/docs/configure_access_logs.md">تكوين سجلات الوصول</a>.</p>
<h2 id="Parquet-file-imports-for-enhanced-data-processing-efficiency" class="common-anchor-header">واردات ملفات الباركيه لتحسين كفاءة معالجة البيانات<button data-href="#Parquet-file-imports-for-enhanced-data-processing-efficiency" class="anchor-icon" translate="no">
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
    </button></h2><p>يدعم الإصدار Milvus 2.3.4 الآن استيراد ملفات الباركيه، وهو تنسيق تخزين عمودي معتمد على نطاق واسع مصمم لتعزيز كفاءة تخزين ومعالجة مجموعات البيانات واسعة النطاق. تمنح هذه الإضافة المستخدمين مزيدًا من المرونة والكفاءة في مساعيهم لمعالجة البيانات. من خلال الاستغناء عن الحاجة إلى تحويلات تنسيق البيانات الشاقة، سيختبر المستخدمون الذين يديرون مجموعات بيانات كبيرة بتنسيق Parquet عملية استيراد بيانات مبسطة، مما يقلل بشكل كبير من الوقت المستغرق من الإعداد الأولي للبيانات إلى استرجاع المتجهات اللاحقة.</p>
<p>علاوةً على ذلك، تبنّت أداة تحويل تنسيق البيانات BulkWriter، BulkWriter، الآن Parquet كتنسيق بيانات الإخراج الافتراضي، مما يضمن تجربة أكثر سهولة للمطورين.</p>
<h2 id="Binlog-index-on-growing-segments-for-faster-searches" class="common-anchor-header">فهرس Binlog على المقاطع المتزايدة لعمليات بحث أسرع<button data-href="#Binlog-index-on-growing-segments-for-faster-searches" class="anchor-icon" translate="no">
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
    </button></h2><p>تستفيد Milvus الآن من فهرس Binlog على المقاطع المتزايدة، مما يؤدي إلى عمليات بحث أسرع تصل إلى عشرة أضعاف في المقاطع المتزايدة. يعزز هذا التحسين من كفاءة البحث بشكل كبير ويدعم المؤشرات المتقدمة مثل IVF أو المسح السريع، مما يحسن من تجربة المستخدم بشكل عام.</p>
<h2 id="Support-for-up-to-10000-collectionspartitions" class="common-anchor-header">دعم لما يصل إلى 10,000 مجموعة/قسم<button data-href="#Support-for-up-to-10000-collectionspartitions" class="anchor-icon" translate="no">
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
    </button></h2><p>على غرار الجداول والأقسام في قواعد البيانات العلائقية، فإن المجموعات والأقسام هي الوحدات الأساسية لتخزين البيانات المتجهة وإدارتها في Milvus. واستجابةً لاحتياجات المستخدمين المتطورة لتنظيم البيانات بشكل دقيق، يدعم الإصدار Milvus 2.3.4 الآن ما يصل إلى 10000 مجموعة/قسم في مجموعة واحدة، وهي قفزة كبيرة من الحد السابق البالغ 4096. يفيد هذا التحسين حالات الاستخدام المتنوعة، مثل إدارة قاعدة المعرفة والبيئات متعددة المستأجرين. ينبع الدعم الموسع للمجموعات/الأقسام من التحسينات التي تم إدخالها على آلية التجزئة الزمنية وإدارة الجوروتين واستخدام الذاكرة.</p>
<p><strong><em>ملاحظة:</em></strong> <em>الحد الموصى به لعدد المجموعات/الأقسام هو 10,000 مجموعة، لأن تجاوز هذا الحد قد يؤثر على استرداد الأعطال واستخدام الموارد.</em></p>
<h2 id="Other-enhancements" class="common-anchor-header">تحسينات أخرى<button data-href="#Other-enhancements" class="anchor-icon" translate="no">
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
    </button></h2><p>بالإضافة إلى الميزات المذكورة أعلاه، يتضمن الإصدار Milvus 2.3.4 العديد من التحسينات وإصلاحات الأخطاء. وتشمل هذه التحسينات تقليل استخدام الذاكرة أثناء استرجاع البيانات ومعالجة البيانات ذات الطول المتغير، وتحسين رسائل الأخطاء، وتسريع سرعة التحميل، وتحسين توازن أجزاء الاستعلام. تساهم هذه التحسينات الجماعية في توفير تجربة مستخدم أكثر سلاسة وفعالية بشكل عام.</p>
<p>للحصول على نظرة عامة شاملة على جميع التغييرات التي تم إدخالها في الإصدار Milvus 2.3.4، راجع <a href="https://milvus.io/docs/release_notes.md#v234">ملاحظات الإصدار</a>.</p>
<h2 id="Stay-connected" class="common-anchor-header">ابق على اتصال!<button data-href="#Stay-connected" class="anchor-icon" translate="no">
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
    </button></h2><p>إذا كانت لديك أسئلة أو ملاحظات حول Milvus، انضم إلى <a href="https://discord.com/invite/8uyFbECzPX">قناة Discord</a> الخاصة بنا للتفاعل مع مهندسينا والمجتمع مباشرةً أو انضم إلى <a href="https://discord.com/invite/RjNbk8RR4f">غداء مجتمع Milvus وتعلم</a> كل يوم ثلاثاء من الساعة 12-12:30 مساءً بتوقيت المحيط الهادي. نرحب بك أيضًا لمتابعتنا على <a href="https://twitter.com/milvusio">تويتر</a> أو <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a> للحصول على آخر الأخبار والتحديثات حول Milvus.</p>
