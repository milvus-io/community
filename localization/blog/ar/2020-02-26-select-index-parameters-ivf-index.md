---
id: select-index-parameters-ivf-index.md
title: 1. index_file_size
author: milvus
date: 2020-02-26T22:57:02.071Z
desc: أفضل الممارسات لمؤشر التلقيح الصناعي
cover: assets.zilliz.com/header_4d3fc44879.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/select-index-parameters-ivf-index'
---
<custom-h1>كيفية تحديد معلمات الفهرس لفهرس IVF</custom-h1><p>في <a href="https://medium.com/@milvusio/best-practices-for-milvus-configuration-f38f1e922418">أفضل الممارسات لتكوين Milvus،</a> تم تقديم بعض أفضل الممارسات لتكوين Milvus 0.6.0. في هذه المقالة، سنقدم أيضًا بعض أفضل الممارسات لتعيين المعلمات الرئيسية في عملاء Milvus للعمليات بما في ذلك إنشاء جدول وإنشاء الفهارس والبحث. يمكن أن تؤثر هذه المعلمات على أداء البحث.</p>
<h2 id="1-codeindexfilesizecode" class="common-anchor-header">1. <code translate="no">index_file_size</code><button data-href="#1-codeindexfilesizecode" class="anchor-icon" translate="no">
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
    </button></h2><p>عند إنشاء جدول، تُستخدم معلمة index_file_size لتحديد حجم ملف واحد لتخزين البيانات بالميجابايت. الافتراضي هو 1024. عندما يتم استيراد البيانات المتجهة، يقوم ميلفوس بتجميع البيانات بشكل تدريجي في ملفات. عندما يصل حجم الملف إلى حجم_ملف_المفهرس_الحجم، لا يقبل هذا الملف بيانات جديدة ويقوم Milvus بحفظ البيانات الجديدة في ملف آخر. هذه كلها ملفات بيانات خام. عند إنشاء فهرس، يقوم Milvus بإنشاء ملف فهرس لكل ملف بيانات خام. بالنسبة لنوع فهرس IVFLAT، فإن حجم ملف الفهرس يساوي تقريباً حجم ملف البيانات الخام المقابل. بالنسبة لفهرس SQ8، يبلغ حجم ملف الفهرس حوالي 30 بالمائة من ملف البيانات الخام المقابل.</p>
<p>أثناء البحث، يبحث Milvus في كل ملف فهرس واحدًا تلو الآخر. وفقًا لتجربتنا، عندما يتغير حجم_ملف_الفهرس من 1024 إلى 2048، يتحسن أداء البحث بنسبة 30 بالمائة إلى 50 بالمائة. ومع ذلك، إذا كانت القيمة كبيرة جدًا، فقد يفشل تحميل الملفات الكبيرة إلى ذاكرة وحدة معالجة الرسومات (أو حتى ذاكرة وحدة المعالجة المركزية). على سبيل المثال، إذا كانت ذاكرة وحدة معالجة الرسومات 2 غيغابايت وكان حجم_ملف_الفهرس 3 غيغابايت، فلا يمكن تحميل ملف الفهرس إلى ذاكرة وحدة معالجة الرسومات. عادةً، نقوم بتعيين index_file_size على 1024 ميجابايت أو 2048 ميجابايت.</p>
<p>يعرض الجدول التالي اختبارًا باستخدام sift50m للفهرس_ملف_الحجم. نوع الفهرس هو SQ8.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_sift50m_test_results_milvus_74f60de4aa.png" alt="1-sift50m-test-results-milvus.png" class="doc-image" id="1-sift50m-test-results-milvus.png" />
   </span> <span class="img-wrapper"> <span>1- sift50m-test-results-milvus.png</span> </span></p>
<p>يمكننا أن نرى أنه في وضع وحدة المعالجة المركزية ووضع وحدة معالجة الرسومات، عندما يكون حجم_ملف_الفهرس 2048 ميغابايت بدلاً من 1024 ميغابايت، يتحسن أداء البحث بشكل ملحوظ.</p>
<h2 id="2-codenlistcode-and-codenprobecode" class="common-anchor-header">2. <code translate="no">nlist</code> <strong>و</strong> <code translate="no">nprobe</code><button data-href="#2-codenlistcode-and-codenprobecode" class="anchor-icon" translate="no">
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
    </button></h2><p>تُستخدم المعلمة <code translate="no">nlist</code> لإنشاء الفهرس وتُستخدم المعلمة <code translate="no">nprobe</code> للبحث. يستخدم كل من IVFLAT و SQ8 خوارزميات التجميع لتقسيم عدد كبير من المتجهات إلى مجموعات أو دلاء. <code translate="no">nlist</code> هو عدد الدلاء أثناء التجميع.</p>
<p>عند البحث باستخدام الفهارس، تتمثل الخطوة الأولى في العثور على عدد معين من الدلاء الأقرب إلى المتجه الهدف، والخطوة الثانية هي العثور على أكثر المتجهات k تشابهًا من الدلاء حسب المسافة بين المتجهات. <code translate="no">nprobe</code> هو عدد الدلاء في الخطوة الأولى.</p>
<p>بشكل عام، تؤدي زيادة <code translate="no">nlist</code> إلى زيادة عدد الدلاء وعدد أقل من المتجهات في الدلو أثناء التجميع. ونتيجة لذلك، ينخفض حمل الحساب ويتحسن أداء البحث. ومع ذلك، مع وجود عدد أقل من المتجهات لمقارنة التشابه، قد تضيع النتيجة الصحيحة.</p>
<p>تؤدي زيادة <code translate="no">nprobe</code> إلى مزيد من الدلاء للبحث. نتيجة لذلك، يزداد حمل الحساب ويتدهور أداء البحث، لكن دقة البحث تتحسن. قد يختلف الوضع باختلاف مجموعات البيانات ذات التوزيعات المختلفة. يجب أيضًا مراعاة حجم مجموعة البيانات عند تعيين <code translate="no">nlist</code> و <code translate="no">nprobe</code>. بشكل عام، من المستحسن أن يكون <code translate="no">nlist</code> <code translate="no">4 * sqrt(n)</code> ، حيث n هو العدد الإجمالي للمتجهات. بالنسبة إلى <code translate="no">nprobe</code> ، يجب عليك إجراء مفاضلة بين الدقة والكفاءة وأفضل طريقة هي تحديد القيمة من خلال التجربة والخطأ.</p>
<p>يوضح الجدول التالي اختبارًا باستخدام sift50m لـ <code translate="no">nlist</code> و <code translate="no">nprobe</code>. نوع الفهرس هو SQ8.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/sq8_index_test_sift50m_b5daa9f7b5.png" alt="sq8-index-test-sift50m.png" class="doc-image" id="sq8-index-test-sift50m.png" />
   </span> <span class="img-wrapper"> <span>sq8-index-test-sift50m.png</span> </span></p>
<p>يقارن الجدول أداء البحث ودقته باستخدام قيم مختلفة لـ <code translate="no">nlist</code>/<code translate="no">nprobe</code>. يتم عرض نتائج وحدة معالجة الرسومات فقط لأن اختبارات وحدة المعالجة المركزية ووحدة معالجة الرسومات لها نتائج مماثلة. في هذا الاختبار، مع زيادة قيم <code translate="no">nlist</code>/<code translate="no">nprobe</code> بنفس النسبة المئوية، تزداد دقة البحث أيضًا. عندما يكون <code translate="no">nlist</code> = 4096 و <code translate="no">nprobe</code> 128، يكون لدى Milvus أفضل أداء بحث. في الختام، عند تحديد قيم <code translate="no">nlist</code> و <code translate="no">nprobe</code> ، يجب إجراء مفاضلة بين الأداء والدقة مع مراعاة مجموعات البيانات والمتطلبات المختلفة.</p>
<h2 id="Summary" class="common-anchor-header">الملخص<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p><code translate="no">index_file_size</code>: عندما يكون حجم البيانات أكبر من <code translate="no">index_file_size</code> ، كلما كانت قيمة <code translate="no">index_file_size</code> أكبر، كان أداء البحث أفضل.<code translate="no">nlist</code> و <code translate="no">nprobe</code>： يجب إجراء مفاضلة بين الأداء والدقة.</p>
