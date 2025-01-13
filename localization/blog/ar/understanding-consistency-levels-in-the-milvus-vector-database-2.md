---
id: understanding-consistency-levels-in-the-milvus-vector-database-2.md
title: فهم مستوى الاتساق في قاعدة بيانات ناقلات ميلفوس - الجزء الثاني
author: Jiquan Long
date: 2022-09-13T00:00:00.000Z
desc: >-
  تشريح للآلية الكامنة وراء مستويات الاتساق القابلة للضبط في قاعدة بيانات Milvus
  vector.
cover: assets.zilliz.com/1280_X1280_0e0d4bc107.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: >-
  https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1280_X1280_0e0d4bc107.png" alt="Cover_image" class="doc-image" id="cover_image" />
   </span> <span class="img-wrapper"> <span>صورة_الغلاف</span> </span></p>
<blockquote>
<p>كتب هذه المقالة <a href="https://github.com/longjiquan">جيكوان لونج</a> ونسختها <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">أنجيلا ني</a>.</p>
</blockquote>
<p>في <a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">المدونة السابقة</a> حول الاتساق، شرحنا في المدونة <a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">السابقة</a> ما هو مدلول الاتساق في قاعدة البيانات المتجهة الموزعة، وغطينا مستويات الاتساق الأربعة - القوي، والثبات المحدود، والجلسة، والنهائي المدعوم في قاعدة بيانات ميلفوس المتجهة، وشرحنا سيناريو التطبيق الأنسب لكل مستوى من مستويات الاتساق.</p>
<p>في هذا المنشور، سنواصل دراسة الآلية الكامنة وراء تمكين مستخدمي قاعدة بيانات Milvus vector من اختيار مستوى الاتساق المثالي لسيناريوهات التطبيق المختلفة بمرونة. سنقدم أيضًا برنامجًا تعليميًا أساسيًا حول كيفية ضبط مستوى الاتساق في قاعدة بيانات Milvus vector.</p>
<p><strong>الانتقال إلى:</strong></p>
<ul>
<li><a href="#The-underlying-time-tick-mechanism">آلية التجزئة الزمنية الأساسية</a></li>
<li><a href="#Guarantee-timestamp">ضمان الطابع الزمني</a></li>
<li><a href="#Consistency-levels">مستويات الاتساق</a></li>
<li><a href="#How-to-tune-consistency-level-in-Milvus">كيفية ضبط مستوى الاتساق في ملفوس؟</a></li>
</ul>
<h2 id="The-underlying-time-tick-mechanism" class="common-anchor-header">آلية التجزئة الزمنية الأساسية<button data-href="#The-underlying-time-tick-mechanism" class="anchor-icon" translate="no">
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
    </button></h2><p>يستخدم Milvus آلية علامة الوقت لضمان مستويات مختلفة من الاتساق عند إجراء بحث أو استعلام متجه. علامة الوقت هي العلامة المائية لـ Milvus التي تعمل كساعة في Milvus وتدل على النقطة الزمنية التي يوجد فيها نظام Milvus. كلما كان هناك طلب بلغة معالجة البيانات (DML) يتم إرساله إلى قاعدة بيانات Milvus vector، فإنه يقوم بتعيين طابع زمني للطلب. كما هو موضح في الشكل أدناه، عندما يتم إدراج بيانات جديدة في قائمة انتظار الرسائل على سبيل المثال، لا يقوم Milvus بوضع طابع زمني على هذه البيانات المدرجة فحسب، بل يقوم أيضًا بإدراج علامات زمنية على فترات منتظمة.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/timetick_b395df9804.png" alt="timetick" class="doc-image" id="timetick" />
   </span> <span class="img-wrapper"> <span>timetick</span> </span></p>
<p>لنأخذ <code translate="no">syncTs1</code> في الشكل أعلاه كمثال. عندما يرى المستهلكون النهائيون مثل عقد الاستعلام <code translate="no">syncTs1</code> ، تفهم مكونات المستهلك أن جميع البيانات التي تم إدراجها قبل <code translate="no">syncTs1</code> قد تم استهلاكها. بمعنى آخر، لن تظهر طلبات إدراج البيانات التي تكون قيم طابعها الزمني أصغر من <code translate="no">syncTs1</code> في قائمة انتظار الرسائل.</p>
<h2 id="Guarantee-Timestamp" class="common-anchor-header">ضمان الطابع الزمني<button data-href="#Guarantee-Timestamp" class="anchor-icon" translate="no">
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
    </button></h2><p>كما ذكرنا في القسم السابق، تحصل مكونات المستهلك النهائية مثل عقد الاستعلام باستمرار على رسائل طلبات إدراج البيانات وعلامة الوقت من قائمة انتظار الرسائل. في كل مرة يتم فيها استهلاك علامة زمنية، ستضع عقدة الاستعلام علامة على هذه العلامة الزمنية المستهلكة كوقت قابل للخدمة - <code translate="no">ServiceTime</code> وجميع البيانات التي تم إدراجها قبل <code translate="no">ServiceTime</code> مرئية لعقدة الاستعلام.</p>
<p>بالإضافة إلى <code translate="no">ServiceTime</code> ، تعتمد ميلفوس أيضًا نوعًا من الطابع الزمني - الطابع الزمني المضمون (<code translate="no">GuaranteeTS</code>) لتلبية الحاجة إلى مستويات مختلفة من الاتساق والتوافر من قبل مختلف المستخدمين. هذا يعني أنه يمكن لمستخدمي قاعدة بيانات ميلفوس المتجهة تحديد <code translate="no">GuaranteeTs</code> من أجل إبلاغ عقد الاستعلام بأن جميع البيانات قبل <code translate="no">GuaranteeTs</code> يجب أن تكون مرئية ومشاركة عند إجراء بحث أو استعلام.</p>
<p>هناك عادةً سيناريوهان عندما تنفذ عقدة الاستعلام طلب بحث في قاعدة بيانات ميلفوس المتجهة.</p>
<h3 id="Scenario-1-Execute-search-request-immediately" class="common-anchor-header">السيناريو 1: تنفيذ طلب البحث على الفور</h3><p>كما هو موضح في الشكل أدناه، إذا كان <code translate="no">GuaranteeTs</code> أصغر من <code translate="no">ServiceTime</code> ، يمكن لعُقد الاستعلام تنفيذ طلب البحث على الفور.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/execute_immediately_dd1913775d.png" alt="execute_immediately" class="doc-image" id="execute_immediately" />
   </span> <span class="img-wrapper"> <span>تنفيذ_فوراً</span> </span></p>
<h3 id="Scenario-2-Wait-till-ServiceTime--GuaranteeTs" class="common-anchor-header">السيناريو 2: انتظر حتى "وقت الخدمة&gt; ضمانات"</h3><p>إذا كان <code translate="no">GuaranteeTs</code> أكبر من <code translate="no">ServiceTime</code> ، يجب أن تستمر عقد الاستعلام في استهلاك علامة الوقت من قائمة انتظار الرسائل. لا يمكن تنفيذ طلبات البحث حتى يصبح <code translate="no">ServiceTime</code> أكبر من <code translate="no">GuaranteeTs</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/wait_search_f09a2f6cf9.png" alt="wait_search" class="doc-image" id="wait_search" />
   </span> <span class="img-wrapper"> <span>انتظار_البحث</span> </span></p>
<h2 id="Consistency-Levels" class="common-anchor-header">مستويات الاتساق<button data-href="#Consistency-Levels" class="anchor-icon" translate="no">
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
    </button></h2><p>لذلك، يكون <code translate="no">GuaranteeTs</code> قابلاً للتكوين في طلب البحث لتحقيق مستوى الاتساق الذي تحدده. يضمن <code translate="no">GuaranteeTs</code> ذو القيمة الكبيرة اتساقًا <a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md#Strong">قويًا</a> على حساب زمن انتقال عالٍ للبحث. ويقلل <code translate="no">GuaranteeTs</code> ذو القيمة الصغيرة من زمن انتقال البحث ولكن رؤية البيانات معرضة للخطر.</p>
<p><code translate="no">GuaranteeTs</code> في ميلفوس هو تنسيق طابع زمني هجين. وليس لدى المستخدم أي فكرة عن <a href="https://github.com/milvus-io/milvus/blob/master/docs/design_docs/20211214-milvus_hybrid_ts.md">TSO</a> داخل Milvus. لذلك، يعد تحديد قيمة<code translate="no">GuaranteeTs</code> مهمة معقدة للغاية بالنسبة للمستخدمين. ولتوفير العناء على المستخدمين وتوفير تجربة مستخدم مثالية، لا يتطلب Milvus من المستخدمين سوى اختيار مستوى الاتساق المحدد، وستتعامل قاعدة بيانات Milvus المتجهة تلقائيًا مع قيمة <code translate="no">GuaranteeTs</code> للمستخدمين. وهذا يعني أن مستخدم Milvus يحتاج فقط إلى الاختيار من بين مستويات الاتساق الأربعة: <code translate="no">Strong</code> <code translate="no">Bounded</code> و <code translate="no">Session</code> و و <code translate="no">Eventually</code>. ويتوافق كل مستوى من مستويات الاتساق مع قيمة <code translate="no">GuaranteeTs</code> معينة.</p>
<p>ويوضح الشكل أدناه <code translate="no">GuaranteeTs</code> لكل مستوى من مستويات الاتساق الأربعة في قاعدة بيانات ميلفوس المتجهة.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/guarantee_ts_f4b3e119d3.png" alt="guarantee_ts" class="doc-image" id="guarantee_ts" />
   </span> <span class="img-wrapper"> <span>الضمانات</span> </span></p>
<p>تدعم قاعدة بيانات ميلفوس المتجهة أربعة مستويات من الاتساق:</p>
<ul>
<li><p><code translate="no">CONSISTENCY_STRONG</code>: يتم تعيين <code translate="no">GuaranteeTs</code> إلى نفس قيمة أحدث طابع زمني للنظام، وتنتظر عقد الاستعلام حتى ينتقل وقت الخدمة إلى أحدث طابع زمني للنظام لمعالجة طلب البحث أو الاستعلام.</p></li>
<li><p><code translate="no">CONSISTENCY_EVENTUALLY</code>:: <code translate="no">GuaranteeTs</code> يتم تعيينها إلى قيمة أصغر بكثير من أحدث طابع زمني للنظام من أجل تخطي التحقق من الاتساق. تبحث عقد الاستعلام على الفور في طريقة عرض البيانات الموجودة.</p></li>
<li><p><code translate="no">CONSISTENCY_BOUNDED</code>: يتم تعيين <code translate="no">GuaranteeTs</code> إلى قيمة أصغر نسبيًا من أحدث طابع زمني للنظام، وتبحث عقد الاستعلام على طريقة عرض بيانات أقل تحديثًا بشكل مقبول.</p></li>
<li><p><code translate="no">CONSISTENCY_SESSION</code>: يستخدم العميل الطابع الزمني لآخر عملية كتابة كـ <code translate="no">GuaranteeTs</code> بحيث يمكن لكل عميل على الأقل استرداد البيانات التي تم إدراجها بنفسه.</p></li>
</ul>
<h2 id="How-to-tune-consistency-level-in-Milvus" class="common-anchor-header">كيف يمكن ضبط مستوى الاتساق في ميلفوس؟<button data-href="#How-to-tune-consistency-level-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>يدعم Milvus ضبط مستوى الاتساق عند <a href="https://milvus.io/docs/v2.1.x/create_collection.md">إنشاء مجموعة</a> أو إجراء <a href="https://milvus.io/docs/v2.1.x/search.md">بحث</a> أو <a href="https://milvus.io/docs/v2.1.x/query.md">استعلام</a>.</p>
<h3 id="Conduct-a-vector-similarity-search" class="common-anchor-header">إجراء بحث تشابه متجهي</h3><p>لإجراء بحث تشابه متجه بمستوى الاتساق الذي تريده، ما عليك سوى تعيين قيمة المعلمة <code translate="no">consistency_level</code> إما <code translate="no">Strong</code> أو <code translate="no">Bounded</code> أو <code translate="no">Session</code> أو <code translate="no">Eventually</code>. إذا لم تقم بتعيين قيمة المعلمة <code translate="no">consistency_level</code> ، فسيكون مستوى الاتساق <code translate="no">Bounded</code> افتراضيًا. يقوم المثال بإجراء بحث تشابه متجه باستخدام <code translate="no">Strong</code> الاتساق.</p>
<pre><code translate="no">results = collection.search(
        data=[[0.1, 0.2]], 
        anns_field=<span class="hljs-string">&quot;book_intro&quot;</span>, 
        param=search_params, 
        <span class="hljs-built_in">limit</span>=10, 
        <span class="hljs-built_in">expr</span>=None,
        consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Conduct-a-vector-query" class="common-anchor-header">إجراء استعلام متجه</h3><p>على غرار إجراء بحث تشابه متجه، يمكنك تحديد قيمة المعلمة <code translate="no">consistency_level</code> عند إجراء استعلام متجه. يُجري المثال إجراء استعلام متجه بتناسق <code translate="no">Strong</code>.</p>
<pre><code translate="no">res = collection.query(
  <span class="hljs-built_in">expr</span> = <span class="hljs-string">&quot;book_id in [2,4,6,8]&quot;</span>, 
  output_fields = [<span class="hljs-string">&quot;book_id&quot;</span>, <span class="hljs-string">&quot;book_intro&quot;</span>],
  consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Whats-next" class="common-anchor-header">ما التالي<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>مع الإصدار الرسمي لميلفوس 2.1، أعددنا سلسلة من المدونات التي تقدم الميزات الجديدة. اقرأ المزيد في سلسلة المدونات هذه:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">كيفية استخدام بيانات السلسلة لتمكين تطبيقات البحث عن التشابه لديك</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">استخدام ميلفوس المدمج لتثبيت وتشغيل ميلفوس مع بايثون على الفور</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">زيادة إنتاجية قراءة قاعدة بيانات المتجهات باستخدام النسخ المتماثلة في الذاكرة</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">فهم مستوى الاتساق في قاعدة بيانات Milvus Vector في قاعدة بيانات Milvus</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">فهم مستوى الاتساق في قاعدة بيانات Milvus Vector (الجزء الثاني)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">كيف تضمن قاعدة بيانات Milvus Vector أمان البيانات؟</a></li>
</ul>
