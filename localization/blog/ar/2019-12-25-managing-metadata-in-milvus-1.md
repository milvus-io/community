---
id: managing-metadata-in-milvus-1.md
title: SQLite
author: milvus
date: 2019-12-25T19:21:42.469Z
desc: تعرف على كيفية عرض البيانات الوصفية في قاعدة بيانات متجهات ميلفوس.
cover: assets.zilliz.com/header_c2eb459468.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/managing-metadata-in-milvus-1'
---
<custom-h1>إدارة البيانات الوصفية في ميلفوس للبيانات الوصفية (1)</custom-h1><p>لقد قدمنا بعض المعلومات حول البيانات الوصفية في <a href="https://medium.com/@milvusio/managing-data-in-massive-scale-vector-search-engine-db2e8941ce2f">إدارة البيانات في محرك البحث المتجه الضخم</a>. توضح هذه المقالة بشكل أساسي كيفية عرض البيانات الوصفية لميلفوس.</p>
<p>يدعم Milvus تخزين البيانات الوصفية في SQLite أو MySQL. هناك معلمة <code translate="no">backend_url</code> (في ملف التكوين <code translate="no">server_config.yaml</code>) يمكنك من خلالها تحديد ما إذا كنت تريد استخدام SQLite أو MySQL لإدارة البيانات الوصفية.</p>
<h2 id="SQLite" class="common-anchor-header">SQLite<button data-href="#SQLite" class="anchor-icon" translate="no">
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
    </button></h2><p>إذا تم استخدام SQLite، فسيتم إنشاء ملف <code translate="no">meta.sqlite</code> في دليل البيانات (المحدد في <code translate="no">primary_path</code> من ملف التكوين <code translate="no">server_config.yaml</code>) بعد بدء تشغيل Milvus. لعرض الملف، ما عليك سوى تثبيت عميل SQLite.</p>
<p>قم بتثبيت SQLite3 من سطر الأوامر:</p>
<pre><code translate="no">sudo apt-get install sqlite3
</code></pre>
<p>ثم أدخل دليل بيانات Milvus، وافتح ملف التعريف باستخدام SQLite3:</p>
<pre><code translate="no">sqlite3 meta.sqlite
</code></pre>
<p>الآن، لقد دخلت بالفعل إلى سطر أوامر عميل SQLite. فقط استخدم بعض الأوامر لمعرفة ما هو موجود في البيانات الوصفية.</p>
<p>لجعل تنضيد النتائج المطبوعة أسهل للقراءة البشرية:</p>
<pre><code translate="no">. mode column
. header on
</code></pre>
<p>للاستعلام عن الجداول وملفات الجداول باستخدام عبارات SQL (غير حساسة لحالة الأحرف):</p>
<pre><code translate="no">SELECT * FROM Tables
SELECT * FROM TableFiles
</code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_use_sql_lite_2418fc1787.png" alt="1-use-sql-lite.png" class="doc-image" id="1-use-sql-lite.png" />
   </span> <span class="img-wrapper"> <span>1-استخدام-sql-lite.png</span> </span></p>
<h2 id="MySQL" class="common-anchor-header">MySQL<button data-href="#MySQL" class="anchor-icon" translate="no">
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
    </button></h2><p>إذا كنت تستخدم MySQL، فأنت بحاجة إلى تحديد عنوان خدمة MySQL في <code translate="no">backend_url</code> من ملف التكوين <code translate="no">server_config.yaml</code>.</p>
<p>على سبيل المثال، تشير الإعدادات التالية إلى أن خدمة MySQL يتم نشرها محليًا، مع المنفذ '3306'، واسم المستخدم 'root'، وكلمة المرور '123456'، واسم قاعدة البيانات 'milvus':</p>
<pre><code translate="no">db_config:
 backend_url: mysql://root:123456@127.0.0.1:3306/milvus
</code></pre>
<p>أولاً، قم بتثبيت عميل MySQL:</p>
<p>sudo apt-get install default-mysql-client</p>
<p>بعد بدء تشغيل Milvus، سيتم إنشاء جدولين (الجداول و TableFiles) في خدمة MySQL المحددة بواسطة <code translate="no">backend_url</code>.</p>
<p>استخدم الأمر التالي للاتصال بخدمة MySQL:</p>
<pre><code translate="no">mysql -h127.0.0.1 -uroot -p123456 -Dmilvus
</code></pre>
<p>الآن، يمكنك استخدام عبارات SQL للاستعلام عن معلومات البيانات الوصفية:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_my_sql_view_meta_data_c871735349.png" alt="2-my-sql-view-meta-data.png" class="doc-image" id="2-my-sql-view-meta-data.png" />
   </span> <span class="img-wrapper"> <span>2-موقع My-sql-view-meta-data.png</span> </span></p>
<h2 id="What’s-coming-next" class="common-anchor-header">ما التالي<button data-href="#What’s-coming-next" class="anchor-icon" translate="no">
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
    </button></h2><p>ستعرض المقالات التالية بالتفصيل مخطط جداول البيانات الوصفية. ترقبوا!</p>
<p>أي أسئلة، مرحبًا بكم للانضمام إلى <a href="https://join.slack.com/t/milvusio/shared_invite/enQtNzY1OTQ0NDI3NjMzLWNmYmM1NmNjOTQ5MGI5NDhhYmRhMGU5M2NhNzhhMDMzY2MzNDdlYjM5ODQ5MmE3ODFlYzU3YjJkNmVlNDQ2ZTk">قناة Slack</a> الخاصة بنا أو تقديم مشكلة في الريبو.</p>
<p>ريبو جيثب: https://github.com/milvus-io/milvus</p>
<p>إذا أعجبك هذا المقال أو وجدته مفيدًا، فلا تنسَ التصفيق!</p>
