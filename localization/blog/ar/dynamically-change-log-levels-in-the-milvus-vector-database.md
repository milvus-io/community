---
id: dynamically-change-log-levels-in-the-milvus-vector-database.md
title: تغيير مستويات السجل ديناميكيًا في قاعدة بيانات ناقلات ميلفوس
author: Enwei Jiao
date: 2022-09-21T00:00:00.000Z
desc: تعرف على كيفية ضبط مستوى السجل في ميلفوس دون إعادة تشغيل الخدمة.
cover: >-
  assets.zilliz.com/Dynamically_Change_Log_Levels_in_the_Milvus_Vector_Database_58e31c66cc.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: >-
  https://milvus.io/blog/dynamically-change-log-levels-in-the-milvus-vector-database.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Dynamically_Change_Log_Levels_in_the_Milvus_Vector_Database_58e31c66cc.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>صورة الغلاف</span> </span></p>
<blockquote>
<p>هذا المقال بقلم <a href="https://github.com/jiaoew1991">إنوي جياو</a> وترجمة <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">أنجيلا ني</a>.</p>
</blockquote>
<p>لمنع الإفراط في إخراج السجلات من التأثير على أداء القرص والنظام، يقوم ميلفوس افتراضيًا بإخراج السجلات على مستوى <code translate="no">info</code> أثناء التشغيل. ومع ذلك، في بعض الأحيان لا تكون السجلات على مستوى <code translate="no">info</code> كافية لمساعدتنا في تحديد الأخطاء والمشاكل بكفاءة. ما هو أسوأ من ذلك، في بعض الحالات، قد يؤدي تغيير مستوى السجل وإعادة تشغيل الخدمة إلى فشل إعادة إنتاج المشاكل، مما يجعل استكشاف الأخطاء وإصلاحها أكثر صعوبة. وبالتالي، فإن هناك حاجة ماسة إلى دعم تغيير مستويات السجل ديناميكيًا في قاعدة بيانات مالفوس ناقلات.</p>
<p>تهدف هذه المقالة إلى تقديم الآلية الكامنة وراء تمكين تغيير مستويات السجل ديناميكيًا وتقديم إرشادات حول كيفية القيام بذلك في قاعدة بيانات مالفوس ناقلات.</p>
<p><strong>الانتقال إلى:</strong></p>
<ul>
<li><a href="#Mechanism">الآلية</a></li>
<li><a href="#How-to-dynamically-change-log-levels">كيفية تغيير مستويات السجل ديناميكياً</a></li>
</ul>
<h2 id="Mechanism" class="common-anchor-header">الآلية<button data-href="#Mechanism" class="anchor-icon" translate="no">
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
    </button></h2><p>تتبنى قاعدة بيانات Milvus vector قاعدة بيانات Milvus المتجهة مسجّل <a href="https://github.com/uber-go/zap">zap</a> مفتوح المصدر من قبل أوبر. كواحد من أقوى مكونات السجل في النظام البيئي للغة Go، يتضمن zap وحدة <a href="https://github.com/uber-go/zap/blob/master/http_handler.go">http_handler.go</a> بحيث يمكنك عرض مستوى السجل الحالي وتغيير مستوى السجل ديناميكيًا عبر واجهة HTTP.</p>
<p>يستمع ميلفوس إلى خدمة HTTP التي يوفرها منفذ <code translate="no">9091</code>. ولذلك، يمكنك الوصول إلى المنفذ <code translate="no">9091</code> للاستفادة من ميزات مثل تصحيح الأداء والمقاييس والتحقق من الصحة. وبالمثل، يتم إعادة استخدام المنفذ <code translate="no">9091</code> لتمكين تعديل مستوى السجل الديناميكي وإضافة مسار <code translate="no">/log/level</code> إلى المنفذ أيضًا. راجع<a href="https://github.com/milvus-io/milvus/pull/18430"> واجهة السجل PR</a> لمزيد من المعلومات.</p>
<h2 id="How-to-dynamically-change-log-levels" class="common-anchor-header">كيفية تغيير مستويات السجل ديناميكيًا<button data-href="#How-to-dynamically-change-log-levels" class="anchor-icon" translate="no">
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
    </button></h2><p>يوفر هذا القسم إرشادات حول كيفية تغيير مستويات السجل ديناميكياً دون الحاجة إلى إعادة تشغيل خدمة Milvus قيد التشغيل.</p>
<h3 id="Prerequisite" class="common-anchor-header">المتطلبات الأساسية</h3><p>تأكد من إمكانية الوصول إلى المنفذ <code translate="no">9091</code> الخاص بمكونات Milvus.</p>
<h3 id="Change-the-log-level" class="common-anchor-header">تغيير مستوى السجل</h3><p>لنفترض أن عنوان IP الخاص بوكيل Milvus هو <code translate="no">192.168.48.12</code>.</p>
<p>يمكنك أولاً تشغيل <code translate="no">$ curl -X GET 192.168.48.12:9091/log/level</code> للتحقق من مستوى السجل الحالي للوكيل.</p>
<p>ثم يمكنك إجراء تعديلات من خلال تحديد مستوى السجل. تتضمن خيارات مستوى السجل:</p>
<ul>
<li><p><code translate="no">debug</code></p></li>
<li><p><code translate="no">info</code></p></li>
<li><p><code translate="no">warn</code></p></li>
<li><p><code translate="no">error</code></p></li>
<li><p><code translate="no">dpanic</code></p></li>
<li><p><code translate="no">panic</code></p></li>
<li><p><code translate="no">fatal</code></p></li>
</ul>
<p>يقوم رمز المثال التالي بتغيير مستوى السجل من مستوى السجل الافتراضي من <code translate="no">info</code> إلى <code translate="no">error</code>.</p>
<pre><code translate="no" class="language-Python">$ curl -X PUT 192.168.48.12:9091/log/level -d level=error
<button class="copy-code-btn"></button></code></pre>
