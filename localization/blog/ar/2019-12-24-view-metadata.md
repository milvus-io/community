---
id: 2019-12-24-view-metadata.md
title: إدارة البيانات الوصفية لميلفوس (1) كيفية عرض البيانات الوصفية
author: Yihua Mo
date: 2019-12-24T00:00:00.000Z
desc: >-
  يدعم Milvus تخزين البيانات الوصفية في SQLite أو MySQL. يقدم هذا المنشور كيفية
  عرض البيانات الوصفية باستخدام SQLite و MySQL.
cover: null
tag: Engineering
isPublish: false
---
<custom-h1>إدارة البيانات الوصفية لميلفوس ميتاداتا (1)</custom-h1><h2 id="How-to-View-Metadata" class="common-anchor-header">كيفية عرض البيانات الوصفية<button data-href="#How-to-View-Metadata" class="anchor-icon" translate="no">
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
<p>التاريخ: 2019-12-24</p>
</blockquote>
<p>لقد قدمنا بعض المعلومات حول البيانات الوصفية في <a href="https://medium.com/@milvusio/managing-data-in-massive-scale-vector-search-engine-db2e8941ce2f">إدارة البيانات في محرك البحث المتجه الضخم</a>. توضح هذه المقالة بشكل أساسي كيفية عرض البيانات الوصفية لميلفوس.</p>
<p>يدعم Milvus تخزين البيانات الوصفية في SQLite أو MySQL. هناك معلمة <code translate="no">backend_url</code> (في ملف التكوين <code translate="no">server_config.yaml</code>) يمكنك من خلالها تحديد ما إذا كنت تريد استخدام SQLite أو MySQL لإدارة البيانات الوصفية.</p>
<h3 id="SQLite" class="common-anchor-header">SQLite</h3><p>إذا تم استخدام SQLite، فسيتم إنشاء ملف <code translate="no">meta.sqlite</code> في دليل البيانات (المحدد في <code translate="no">primary_path</code> من ملف التكوين <code translate="no">server_config.yaml</code>) بعد بدء تشغيل Milvus. لعرض الملف، ما عليك سوى تثبيت عميل SQLite.</p>
<p>قم بتثبيت SQLite3 من سطر الأوامر:</p>
<pre><code translate="no" class="language-shell"><span class="hljs-built_in">sudo</span> apt-get install sqlite3
<button class="copy-code-btn"></button></code></pre>
<p>ثم أدخل دليل بيانات Milvus، وافتح ملف التعريف باستخدام SQLite3:</p>
<pre><code translate="no" class="language-shell">sqlite3 meta.sqlite
<button class="copy-code-btn"></button></code></pre>
<p>الآن، لقد دخلت بالفعل إلى سطر أوامر عميل SQLite. فقط استخدم بعض الأوامر لمعرفة ما هو موجود في البيانات الوصفية.</p>
<p>لجعل تنضيد النتائج المطبوعة أسهل للقراءة البشرية:</p>
<pre><code translate="no" class="language-sql">.mode column
.header <span class="hljs-keyword">on</span>
<button class="copy-code-btn"></button></code></pre>
<p>للاستعلام عن الجداول وملفات الجداول باستخدام عبارات SQL (غير حساسة لحالة الأحرف):</p>
<pre><code translate="no" class="language-sql">SELECT \* FROM Tables
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no" class="language-sql">SELECT \* FROM TableFiles
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/sqlite3.png" alt="sqlite3" class="doc-image" id="sqlite3" />
   </span> <span class="img-wrapper"> <span>sqlite3</span> </span></p>
<h3 id="MySQL" class="common-anchor-header">MySQL</h3><p>إذا كنت تستخدم MySQL، فأنت بحاجة إلى تحديد عنوان خدمة MySQL في <code translate="no">backend_url</code> من ملف التكوين <code translate="no">server_config.yaml</code>.</p>
<p>على سبيل المثال، تشير الإعدادات التالية إلى أن خدمة MySQL يتم نشرها محليًا، مع المنفذ '3306'، واسم المستخدم 'root'، وكلمة المرور '123456'، واسم قاعدة البيانات 'milvus':</p>
<pre><code translate="no">db_config:

   backend_url: mysql://root:123456@127.0.0.1:3306/milvus
<button class="copy-code-btn"></button></code></pre>
<p>أولاً، قم بتثبيت عميل MySQL:</p>
<pre><code translate="no" class="language-shell">sudo apt-<span class="hljs-keyword">get</span> install <span class="hljs-literal">default</span>-mysql-client
<button class="copy-code-btn"></button></code></pre>
<p>بعد بدء تشغيل Milvus، سيتم إنشاء جدولين (الجداول و TableFiles) في خدمة MySQL المحددة بواسطة <code translate="no">backend_url</code>.</p>
<p>استخدم الأمر التالي للاتصال بخدمة MySQL:</p>
<pre><code translate="no" class="language-shell">mysql -h127.0.0.1 -uroot -p123456 -Dmilvus
<button class="copy-code-btn"></button></code></pre>
<p>الآن، يمكنك استخدام عبارات SQL للاستعلام عن معلومات البيانات الوصفية:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/mysql.png" alt="mysql" class="doc-image" id="mysql" />
   </span> <span class="img-wrapper"> <span>mysql</span> </span></p>
<h2 id="相关博客" class="common-anchor-header">相񟻫 博񟻫<button data-href="#相关博客" class="anchor-icon" translate="no">
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
<li><a href="https://medium.com/@milvusio/managing-data-in-massive-scale-vector-search-engine-db2e8941ce2f">إدارة البيانات في محرك البحث المتجه الهائل النطاق</a></li>
<li><a href="https://medium.com/@milvusio/milvus-metadata-management-2-fields-in-the-metadata-table-3bf0d296ca6d">إدارة البيانات الوصفية لميلفوس للبيانات الوصفية (2): الحقول في جدول البيانات الوصفية</a></li>
</ul>
