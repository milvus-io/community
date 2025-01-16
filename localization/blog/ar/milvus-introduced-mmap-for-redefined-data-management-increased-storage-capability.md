---
id: >-
  milvus-introduced-mmap-for-redefined-data-management-increased-storage-capability.md
title: طرحت شركة ميلفوس خريطة MMap لإدارة البيانات المعاد تعريفها وزيادة قدرة التخزين
author: Yang Cen
date: 2023-11-15T00:00:00.000Z
desc: >-
  تُمكِّن ميزة Milvus MMap المستخدمين من التعامل مع المزيد من البيانات ضمن ذاكرة
  محدودة، مما يحقق توازنًا دقيقًا بين الأداء والتكلفة وحدود النظام.
cover: assets.zilliz.com/Exploring_M_Map_5086d652bd.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, MMap, Data Management, Vector Embeddings
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/milvus-introduced-mmap-for-redefined-data-management-increased-storage-capability
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Exploring_M_Map_5086d652bd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://zilliz.com/what-is-milvus">Milvus</a> هو الحل الأسرع في <a href="https://zilliz.com/blog/what-is-a-real-vector-database">قواعد البيانات المتجهة</a> مفتوحة المصدر، وهو يلبي احتياجات المستخدمين الذين لديهم متطلبات أداء مكثفة. ومع ذلك، فإن تنوع احتياجات المستخدمين يعكس البيانات التي يعملون بها. فالبعض يعطي الأولوية للحلول الصديقة للميزانية والتخزين الواسع على السرعة المطلقة. من خلال فهم هذا الطيف من المتطلبات، تقدم ميلفوس ميزة MMap، التي تعيد تعريف كيفية التعامل مع أحجام البيانات الكبيرة مع وعدها بكفاءة التكلفة دون التضحية بالوظائف.</p>
<h2 id="What-is-MMap" class="common-anchor-header">ما هي MMap؟<button data-href="#What-is-MMap" class="anchor-icon" translate="no">
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
    </button></h2><p>MMap، وهي اختصار للملفات المعينة بالذاكرة، تسد الفجوة بين الملفات والذاكرة داخل أنظمة التشغيل. تسمح هذه التقنية لـ Milvus بتعيين الملفات الكبيرة مباشرةً في مساحة ذاكرة النظام، وتحويل الملفات إلى كتل ذاكرة متجاورة. هذا التكامل يلغي الحاجة إلى عمليات القراءة أو الكتابة الصريحة، مما يغير بشكل أساسي كيفية إدارة Milvus للبيانات. يضمن الوصول السلس والتخزين الفعال للملفات الكبيرة أو الحالات التي يحتاج فيها المستخدمون إلى الوصول إلى الملفات بشكل عشوائي.</p>
<h2 id="Who-benefits-from-MMap" class="common-anchor-header">من المستفيد من MMap؟<button data-href="#Who-benefits-from-MMap" class="anchor-icon" translate="no">
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
    </button></h2><p>تتطلب قواعد البيانات المتجهة سعة ذاكرة كبيرة بسبب متطلبات تخزين البيانات المتجهة. مع ميزة MMap، تصبح معالجة المزيد من البيانات ضمن ذاكرة محدودة حقيقة واقعة. ومع ذلك، تأتي هذه القدرة المتزايدة بتكلفة أداء. يدير النظام الذاكرة بذكاء، حيث يقوم بإخلاء بعض البيانات بذكاء بناءً على التحميل والاستخدام. يسمح هذا الإخلاء ل Milvus بمعالجة المزيد من البيانات بنفس سعة الذاكرة.</p>
<p>خلال اختباراتنا، لاحظنا أنه مع وجود ذاكرة واسعة، تستقر جميع البيانات في الذاكرة بعد فترة الإحماء، مما يحافظ على أداء النظام. ومع ذلك، مع نمو حجم البيانات، ينخفض الأداء تدريجيًا. <strong>لذلك، نوصي باستخدام ميزة MMap للمستخدمين الأقل حساسية لتقلبات الأداء.</strong></p>
<h2 id="Enabling-MMap-in-Milvus-a-simple-configuration" class="common-anchor-header">تمكين MMap في Milvus: تكوين بسيط<button data-href="#Enabling-MMap-in-Milvus-a-simple-configuration" class="anchor-icon" translate="no">
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
    </button></h2><p>تمكين MMap في Milvus بسيط بشكل ملحوظ. كل ما عليك القيام به هو تعديل الملف <code translate="no">milvus.yaml</code>: أضف العنصر <code translate="no">mmapDirPath</code> ضمن تكوين <code translate="no">queryNode</code> وقم بتعيين مسار صالح كقيمة له.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/enabling_mmap_a2df88276b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Striking-the-balance-performance-storage-and-system-limits" class="common-anchor-header">تحقيق التوازن: الأداء والتخزين وحدود النظام<button data-href="#Striking-the-balance-performance-storage-and-system-limits" class="anchor-icon" translate="no">
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
    </button></h2><p>تؤثر أنماط الوصول إلى البيانات بشكل كبير على الأداء. تعمل ميزة MMap في Milvus على تحسين الوصول إلى البيانات بناءً على الموقع. تتيح ميزة MMap لـ Milvus كتابة البيانات العددية مباشرةً على القرص لمقاطع البيانات التي يتم الوصول إليها بالتسلسل. تخضع البيانات ذات الطول المتغير مثل السلاسل لعملية تسطيح ويتم فهرستها باستخدام مصفوفة إزاحات في الذاكرة. يضمن هذا النهج تحديد موقع الوصول إلى البيانات ويزيل عبء تخزين كل بيانات متغيرة الطول بشكل منفصل. التحسينات الخاصة بفهارس المتجهات دقيقة. يتم استخدام MMap بشكل انتقائي لبيانات المتجهات مع الاحتفاظ بقوائم المتجاورات في الذاكرة، مما يحافظ على ذاكرة كبيرة دون المساس بالأداء.</p>
<p>بالإضافة إلى ذلك، يزيد MMap من معالجة البيانات إلى أقصى حد من خلال تقليل استخدام الذاكرة. على عكس الإصدارات السابقة من Milvus حيث كان QueryNode ينسخ مجموعات بيانات كاملة، يعتمد MMap عملية تدفق مبسطة وخالية من النسخ أثناء التطوير. ويقلل هذا التحسين بشكل كبير من الحمل الزائد للذاكرة.</p>
<p><strong>تُظهر نتائج اختباراتنا الداخلية أن Milvus يمكنه التعامل بكفاءة مع ضعف حجم البيانات عند تمكين MMap.</strong></p>
<h2 id="The-road-ahead-continuous-innovation-and-user-centric-enhancements" class="common-anchor-header">الطريق إلى الأمام: الابتكار المستمر والتحسينات التي تركز على المستخدم<button data-href="#The-road-ahead-continuous-innovation-and-user-centric-enhancements" class="anchor-icon" translate="no">
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
    </button></h2><p>بينما لا تزال ميزة MMap في مرحلتها التجريبية، يلتزم فريق ميلفوس بالتحسين المستمر. ستعمل التحديثات المستقبلية على تحسين استخدام النظام للذاكرة، مما يمكّن ميلفوس من دعم أحجام بيانات أكثر شمولاً على عقدة واحدة. يمكن للمستخدمين توقع المزيد من التحكم الدقيق في ميزة MMap، مما يتيح إجراء تغييرات ديناميكية على المجموعات وأنماط تحميل الحقول المتقدمة. توفر هذه التحسينات مرونة غير مسبوقة، مما يسمح للمستخدمين بتكييف استراتيجيات معالجة البيانات الخاصة بهم وفقًا لمتطلبات محددة.</p>
<h2 id="Conclusion-redefining-data-processing-excellence-with-Milvus-MMap" class="common-anchor-header">الخلاصة: إعادة تعريف التميز في معالجة البيانات مع Milvus MMap<button data-href="#Conclusion-redefining-data-processing-excellence-with-Milvus-MMap" class="anchor-icon" translate="no">
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
    </button></h2><p>تمثل ميزة MMap في Milvus 2.3 قفزة كبيرة في تكنولوجيا معالجة البيانات. من خلال تحقيق توازن دقيق بين الأداء والتكلفة وحدود النظام، تمكّن Milvus المستخدمين من التعامل مع كميات هائلة من البيانات بكفاءة وفعالية من حيث التكلفة. ومع استمرار ميلفوس في التطور، تظل في طليعة الحلول المبتكرة، وتعيد تعريف حدود ما يمكن تحقيقه في إدارة البيانات.</p>
<p>ترقبوا المزيد من التطورات الرائدة مع استمرار ميلفوس في رحلتها نحو التميز غير المسبوق في معالجة البيانات.</p>
