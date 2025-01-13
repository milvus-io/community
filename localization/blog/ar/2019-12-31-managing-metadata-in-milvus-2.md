---
id: managing-metadata-in-milvus-2.md
title: الحقول في الجدول Tables
author: milvus
date: 2019-12-31T20:41:13.864Z
desc: الحقول في جدول البيانات الوصفية
cover: assets.zilliz.com/header_c65a2a523c.png
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/managing-metadata-in-milvus-2'
---
<custom-h1>إدارة البيانات الوصفية في ميلفوس (2)</custom-h1><p>ذكرنا في المدونة الأخيرة كيفية عرض البيانات الوصفية باستخدام MySQL أو SQLite. تهدف هذه المقالة بشكل أساسي إلى تقديم الحقول في جداول البيانات الوصفية بالتفصيل.</p>
<h2 id="Fields-in-the-codeTablescode-table" class="common-anchor-header">الحقول في الجدول <code translate="no">Tables</code> <button data-href="#Fields-in-the-codeTablescode-table" class="anchor-icon" translate="no">
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
    </button></h2><p>خذ SQLite كمثال. تأتي النتيجة التالية من 0.5.0. تمت إضافة بعض الحقول إلى 0.6.0، والتي سيتم تقديمها لاحقًا. يوجد صف في <code translate="no">Tables</code> يحدد جدول متجه مكون من 512 بعدًا باسم &lt;codetable_1</code>. عندما يتم إنشاء الجدول، <code translate="no">index_file_size</code> هو 1024 ميغابايت، <code translate="no">engine_type</code> هو 1 (مسطح)، <code translate="no">nlist</code> هو 16384، <code translate="no">metric_type</code> هو 1 (المسافة الإقليدية L2). <code translate="no">state</code> هو المعرف هو المعرف الفريد للجدول. هو حالة الجدول مع 0 يشير إلى الحالة العادية. <code translate="no">created_on</code> هو وقت الإنشاء. <code translate="no">flag</code> هو العلم المحجوز للاستخدام الداخلي.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_image_1_be4ca78ccb.png" alt="1-image-1.png" class="doc-image" id="1-image-1.png" />
   </span> <span class="img-wrapper"> <span>1-صورة-1.png</span> </span></p>
<p>يوضح الجدول التالي أنواع الحقول وأوصاف الحقول في <code translate="no">Tables</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_field_types_descriptions_milvus_metadata_d0b068c413.png" alt="2-field-types-descriptions-milvus-metadata.png" class="doc-image" id="2-field-types-descriptions-milvus-metadata.png" />
   </span> <span class="img-wrapper"> <span>2-أنواع الحقول-أنواع-أوصاف-ملفوس-ميتاداتا.png</span> </span></p>
<p>تم تمكين تقسيم الجدول في 0.6.0 مع بعض الحقول الجديدة، بما في ذلك <code translate="no">owner_table</code>，<code translate="no">partition_tag</code> و <code translate="no">version</code>. يحتوي الجدول المتجه، <code translate="no">table_1</code> ، على قسم يسمى <code translate="no">table_1_p1</code> ، وهو أيضًا جدول متجه. <code translate="no">partition_name</code> يتوافق مع <code translate="no">table_id</code>. يتم توريث الحقول في جدول التقسيم من <code translate="no">owner table</code> ، حيث يحدد حقل جدول المالك اسم جدول المالك ويحدد الحقل <code translate="no">partition_tag</code> علامة القسم.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_image_2_a2a8bbc9ae.png" alt="3-image-2.png" class="doc-image" id="3-image-2.png" />
   </span> <span class="img-wrapper"> <span>3-صورة-2.png</span> </span></p>
<p>يوضح الجدول التالي الحقول الجديدة في 0.6.0:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_new_fields_milvus_0_6_0_bb82bfaadf.png" alt="4-new-fields-milvus-0.6.0.png" class="doc-image" id="4-new-fields-milvus-0.6.0.png" />
   </span> <span class="img-wrapper"> <span>4-حقول جديدة-ملف-ملف-0.6.0.0.png</span> </span></p>
<h2 id="Fields-in-the-TableFiles-table" class="common-anchor-header">الحقول في جدول TableFiles<button data-href="#Fields-in-the-TableFiles-table" class="anchor-icon" translate="no">
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
    </button></h2><p>يحتوي المثال التالي على ملفين، وكلاهما ينتمي إلى جدول <code translate="no">table_1</code> المتجه. نوع الفهرس (<code translate="no">engine_type</code>) للملف الأول هو 1 (مسطح)؛ حالة الملف (<code translate="no">file_type</code>) هي 7 (نسخة احتياطية من الملف الأصلي)؛ <code translate="no">file_size</code> هو 411200113 بايت؛ عدد صفوف المتجه هو 200,000. نوع فهرس الملف الثاني هو 2 (IVFLAT)؛ حالة الملف هي 3 (ملف الفهرس). الملف الثاني هو في الواقع فهرس الملف الأول. سنقدم المزيد من المعلومات في المقالات القادمة.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_image_3_5e22c937ed.png" alt="5-image-3.png" class="doc-image" id="5-image-3.png" />
   </span> <span class="img-wrapper"> <span>5-صورة 3.png</span> </span></p>
<p>يوضح الجدول التالي حقول وأوصاف <code translate="no">TableFiles</code>:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_field_types_descriptions_tablefile_7a7b57d715.png" alt="6-field-types-descriptions-tablefile.png" class="doc-image" id="6-field-types-descriptions-tablefile.png" />
   </span> <span class="img-wrapper"> <span>6-حقل-أنواع-أنواع-أوصاف-جدول-ملف.png</span> </span></p>
<h2 id="What’s-coming-next" class="common-anchor-header">ما هو قادم<button data-href="#What’s-coming-next" class="anchor-icon" translate="no">
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
    </button></h2><p>ستوضح لك المقالة القادمة كيفية استخدام SQLite لإدارة البيانات الوصفية في Milvus. ابقوا معنا!</p>
<p>أي أسئلة، مرحبًا بكم في الانضمام إلى <a href="https://join.slack.com/t/milvusio/shared_invite/enQtNzY1OTQ0NDI3NjMzLWNmYmM1NmNjOTQ5MGI5NDhhYmRhMGU5M2NhNzhhMDMzY2MzNDdlYjM5ODQ5MmE3ODFlYzU3YjJkNmVlNDQ2ZTk">قناة Slack</a>الخاصة بنا <a href="https://join.slack.com/t/milvusio/shared_invite/enQtNzY1OTQ0NDI3NjMzLWNmYmM1NmNjOTQ5MGI5NDhhYmRhMGU5M2NhNzhhMDMzY2MzNDdlYjM5ODQ5MmE3ODFlYzU3YjJkNmVlNDQ2ZTk">أو</a>تقديم مشكلة في الريبو.</p>
<p>ريبو جيثب: https://github.com/milvus-io/milvus</p>
