---
id: 2019-12-27-meta-table.md
title: إدارة البيانات الوصفية لميلفوس (2) الحقول في جدول البيانات الوصفية
author: Yihua Mo
date: 2019-12-27T00:00:00.000Z
desc: تعرف على تفاصيل الحقول في جداول البيانات الوصفية في ميلفوس.
cover: null
tag: Engineering
---
<custom-h1>إدارة البيانات الوصفية لملفوس ميتاداتا (2)</custom-h1><h2 id="Fields-in-the-Metadata-Table" class="common-anchor-header">الحقول في جدول البيانات الوصفية<button data-href="#Fields-in-the-Metadata-Table" class="anchor-icon" translate="no">
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
    </button></h2><blockquote>
<p>المؤلف ييهوا مو</p>
<p>التاريخ: 2019-12-27</p>
</blockquote>
<p>ذكرنا في المدونة الأخيرة كيفية عرض البيانات الوصفية باستخدام MySQL أو SQLite. تهدف هذه المقالة بشكل أساسي إلى تقديم الحقول في جداول البيانات الوصفية بالتفصيل.</p>
<h3 id="Fields-in-the-Tables-table" class="common-anchor-header">الحقول في جدول &quot;<code translate="no">Tables</code>&quot;</h3><p>خذ SQLite كمثال. تأتي النتيجة التالية من 0.5.0. تمت إضافة بعض الحقول إلى 0.6.0، والتي سيتم تقديمها لاحقًا. يوجد صف في <code translate="no">Tables</code> يحدد جدول متجه مكون من 512 بعدًا باسم <code translate="no">table_1</code>. عند إنشاء الجدول، <code translate="no">index_file_size</code> هو 1024 ميغابايت، <code translate="no">engine_type</code> هو 1 (مسطح)، <code translate="no">nlist</code> هو 16384، <code translate="no">metric_type</code> هو 1 (المسافة الإقليدية L2). <code translate="no">id</code> هو المعرف الفريد للجدول. <code translate="no">state</code> هو حالة الجدول مع 0 يشير إلى الحالة العادية. <code translate="no">created_on</code> هو وقت الإنشاء. <code translate="no">flag</code> هو العلم المحجوز للاستخدام الداخلي.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/tables.png" alt="tables" class="doc-image" id="tables" />
   </span> <span class="img-wrapper"> <span>الجداول</span> </span></p>
<p>يوضح الجدول التالي أنواع الحقول وأوصاف الحقول في <code translate="no">Tables</code>.</p>
<table>
<thead>
<tr><th style="text-align:left">اسم الحقل</th><th style="text-align:left">نوع البيانات</th><th style="text-align:left">الوصف</th></tr>
</thead>
<tbody>
<tr><td style="text-align:left"><code translate="no">id</code></td><td style="text-align:left">int64</td><td style="text-align:left">المعرف الفريد لجدول المتجه. <code translate="no">id</code> يتزايد تلقائيًا.</td></tr>
<tr><td style="text-align:left"><code translate="no">table_id</code></td><td style="text-align:left">سلسلة</td><td style="text-align:left">اسم الجدول المتجه. <code translate="no">table_id</code> يجب أن يكون محدد من قبل المستخدم ويتبع إرشادات اسم ملف Linux.</td></tr>
<tr><td style="text-align:left"><code translate="no">state</code></td><td style="text-align:left">int32</td><td style="text-align:left">حالة الجدول المتجه. 0 تعني عادي و1 تعني محذوف (حذف ناعم).</td></tr>
<tr><td style="text-align:left"><code translate="no">dimension</code></td><td style="text-align:left">int16</td><td style="text-align:left">بُعد المتجه لجدول المتجهات. يجب أن يكون محدداً من قبل المستخدم.</td></tr>
<tr><td style="text-align:left"><code translate="no">created_on</code></td><td style="text-align:left">int64</td><td style="text-align:left">عدد المللي ثانية من 1 يناير 1970 إلى وقت إنشاء الجدول.</td></tr>
<tr><td style="text-align:left"><code translate="no">flag</code></td><td style="text-align:left">int64</td><td style="text-align:left">علم للاستخدام الداخلي، مثل ما إذا كان معرف المتجه معرفاً من قبل المستخدم. الافتراضي هو 0.</td></tr>
<tr><td style="text-align:left"><code translate="no">index_file_size</code></td><td style="text-align:left">int64</td><td style="text-align:left">إذا وصل حجم ملف البيانات إلى <code translate="no">index_file_size</code> ، لا يتم دمج الملف ويستخدم لبناء الفهارس. الافتراضي هو 1024 (ميغابايت).</td></tr>
<tr><td style="text-align:left"><code translate="no">engine_type</code></td><td style="text-align:left">int32</td><td style="text-align:left">نوع الفهرس المطلوب إنشاؤه لجدول متجه. الافتراضي هو 0، والذي يحدد فهرس غير صالح. 1 يحدد FLAT. 2 يحدد IVFLAT. 3 يحدد IVFSQ8. 4 يحدد NSG. 5 يحدد IVFSQ8H.</td></tr>
<tr><td style="text-align:left"><code translate="no">nlist</code></td><td style="text-align:left">int32</td><td style="text-align:left">عدد المجموعات التي تنقسم إليها المتجهات في كل ملف بيانات عند إنشاء الفهرس. الافتراضي هو 16384.</td></tr>
<tr><td style="text-align:left"><code translate="no">metric_type</code></td><td style="text-align:left">int32</td><td style="text-align:left">طريقة حساب المسافة بين المتجهات. 1 يحدد المسافة الإقليدية (L1) و2 يحدد الضرب الداخلي.</td></tr>
</tbody>
</table>
<p>تم تمكين تقسيم الجدول في 0.6.0 مع بعض الحقول الجديدة، بما في ذلك <code translate="no">owner_table</code>，<code translate="no">partition_tag</code> و <code translate="no">version</code>. يحتوي الجدول المتجه، <code translate="no">table_1</code> ، على قسم يسمى <code translate="no">table_1_p1</code> ، وهو أيضًا جدول متجه. <code translate="no">partition_name</code> يتوافق مع <code translate="no">table_id</code>. يتم توريث الحقول في جدول التقسيم من جدول المالك، حيث يحدد الحقل <code translate="no">owner table</code> اسم جدول المالك والحقل <code translate="no">partition_tag</code> الذي يحدد علامة التقسيم.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/tables_new.png" alt="tables_new" class="doc-image" id="tables_new" />
   </span> <span class="img-wrapper"> <span>الجداول_الجديدة</span> </span></p>
<p>يوضح الجدول التالي الحقول الجديدة في الإصدار 0.6.0:</p>
<table>
<thead>
<tr><th style="text-align:left">اسم الحقل</th><th style="text-align:left">نوع البيانات</th><th style="text-align:left">الوصف</th></tr>
</thead>
<tbody>
<tr><td style="text-align:left"><code translate="no">owner_table</code></td><td style="text-align:left">السلسلة</td><td style="text-align:left">الجدول الرئيسي للقسم.</td></tr>
<tr><td style="text-align:left"><code translate="no">partition_tag</code></td><td style="text-align:left">سلسلة</td><td style="text-align:left">علامة القسم. يجب ألا تكون سلسلة فارغة.</td></tr>
<tr><td style="text-align:left"><code translate="no">version</code></td><td style="text-align:left">سلسلة</td><td style="text-align:left">إصدار ميلفوس.</td></tr>
</tbody>
</table>
<h3 id="Fields-in-the-TableFiles-table" class="common-anchor-header">الحقول في جدول "<code translate="no">TableFiles&quot;</code> </h3><p>يحتوي المثال التالي على ملفين، كلاهما ينتمي إلى جدول متجه <code translate="no">table_1</code>. نوع الفهرس (<code translate="no">engine_type</code>) للملف الأول هو 1 (مسطح)؛ حالة الملف (<code translate="no">file_type</code>) هي 7 (نسخة احتياطية من الملف الأصلي)؛ <code translate="no">file_size</code> هو 411200113 بايت؛ عدد صفوف المتجهات هو 200,000. نوع فهرس الملف الثاني هو 2 (IVFLAT)؛ حالة الملف هي 3 (ملف الفهرس). الملف الثاني هو في الواقع فهرس الملف الأول. سنقدم المزيد من المعلومات في المقالات القادمة.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/tablefiles.png" alt="tablefiles" class="doc-image" id="tablefiles" />
   </span> <span class="img-wrapper"> <span>ملفات الجدول</span> </span></p>
<p>يوضح الجدول التالي حقول وأوصاف <code translate="no">TableFiles</code>:</p>
<table>
<thead>
<tr><th style="text-align:left">اسم الحقل</th><th style="text-align:left">نوع البيانات</th><th style="text-align:left">الوصف</th></tr>
</thead>
<tbody>
<tr><td style="text-align:left"><code translate="no">id</code></td><td style="text-align:left">int64</td><td style="text-align:left">المعرف الفريد لجدول متجه. <code translate="no">id</code> يتزايد تلقائيًا.</td></tr>
<tr><td style="text-align:left"><code translate="no">table_id</code></td><td style="text-align:left">سلسلة</td><td style="text-align:left">اسم الجدول المتجه.</td></tr>
<tr><td style="text-align:left"><code translate="no">engine_type</code></td><td style="text-align:left">int32</td><td style="text-align:left">نوع الفهرس المطلوب إنشاؤه لجدول متجه. الافتراضي هو 0، والذي يحدد فهرس غير صالح. 1 يحدد FLAT. 2 يحدد IVFLAT. 3 يحدد IVFSQ8. 4 يحدد NSG. 5 يحدد IVFSQ8H.</td></tr>
<tr><td style="text-align:left"><code translate="no">file_id</code></td><td style="text-align:left">السلسلة</td><td style="text-align:left">اسم الملف الذي تم إنشاؤه من وقت إنشاء الملف. يساوي 1000 مضروباً في عدد المللي ثانية من 1 يناير 1970 إلى وقت إنشاء الجدول.</td></tr>
<tr><td style="text-align:left"><code translate="no">file_type</code></td><td style="text-align:left">int32</td><td style="text-align:left">حالة الملف. 0 يحدد ملف بيانات متجه خام تم إنشاؤه حديثًا. 1 يحدد ملف بيانات متجه خام. 2 يحدد أنه سيتم إنشاء فهرس للملف. 3 يحدد أن الملف هو ملف فهرس. 4 يحدد أن الملف سيتم حذفه (حذف ناعم). 5 يحدد أن الملف تم إنشاؤه حديثاً ويستخدم لتخزين البيانات المركبة. 6 يحدد أن الملف تم إنشاؤه حديثاً ويستخدم لتخزين بيانات الفهرس. 7 يحدد حالة النسخ الاحتياطي لملف بيانات المتجه الخام.</td></tr>
<tr><td style="text-align:left"><code translate="no">file_size</code></td><td style="text-align:left">int64</td><td style="text-align:left">حجم الملف بالبايت.</td></tr>
<tr><td style="text-align:left"><code translate="no">row_count</code></td><td style="text-align:left">int64</td><td style="text-align:left">عدد المتجهات في الملف.</td></tr>
<tr><td style="text-align:left"><code translate="no">updated_time</code></td><td style="text-align:left">int64</td><td style="text-align:left">الطابع الزمني لآخر وقت تحديث، والذي يحدد عدد المللي ثانية من 1 يناير 1970 إلى وقت إنشاء الجدول.</td></tr>
<tr><td style="text-align:left"><code translate="no">created_on</code></td><td style="text-align:left">int64</td><td style="text-align:left">عدد المللي ثانية من 1 يناير 1970 إلى وقت إنشاء الجدول.</td></tr>
<tr><td style="text-align:left"><code translate="no">date</code></td><td style="text-align:left">int32</td><td style="text-align:left">تاريخ إنشاء الجدول. لا يزال هنا لأسباب تاريخية وستتم إزالته في الإصدارات المستقبلية.</td></tr>
</tbody>
</table>
<h2 id="Related-blogs" class="common-anchor-header">المدونات ذات الصلة<button data-href="#Related-blogs" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><a href="https://medium.com/@milvusio/managing-data-in-massive-scale-vector-search-engine-db2e8941ce2f">إدارة البيانات في محرك بحث المتجهات ذات النطاق الضخم</a></li>
<li><a href="https://medium.com/@milvusio/milvus-metadata-management-1-6b9e05c06fb0">إدارة البيانات الوصفية في ميلفوس ميتاداتا (1): كيفية عرض البيانات الوصفية</a></li>
</ul>
