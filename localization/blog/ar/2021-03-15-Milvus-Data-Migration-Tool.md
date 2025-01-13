---
id: Milvus-Data-Migration-Tool.md
title: تقديم أداة ميلفوس لترحيل البيانات
author: Zilliz
date: 2021-03-15T10:19:51.125Z
desc: >-
  تعرف على كيفية استخدام أداة ترحيل البيانات Milvus لتحسين كفاءة إدارة البيانات
  بشكل كبير وتقليل تكاليف DevOps.
cover: assets.zilliz.com/Generic_Tool_Announcement_97eb04a898.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/Milvus-Data-Migration-Tool'
---
<custom-h1>تقديم أداة ميلفوس لترحيل البيانات</custom-h1><p><em><strong>ملاحظة مهمة</strong>: تم إهمال أداة ترحيل بيانات ميفوس. لترحيل البيانات من قواعد البيانات الأخرى إلى ميلفوس، نوصي باستخدام أداة ترحيل البيانات Milvus-migration Tool الأكثر تقدماً.</em></p>
<p>تدعم أداة Milvus-migration حاليًا:</p>
<ul>
<li>من Elasticsearch إلى Milvus 2.x</li>
<li>من فايس إلى ميلفوس 2.x</li>
<li>ميلفوس 1.x إلى ميلفوس 2.x</li>
<li>من Milvus 2.3.x إلى Milvus 2.3.x أو أعلى</li>
</ul>
<p>سندعم الترحيل من المزيد من مصادر البيانات المتجهة مثل Pinecone و Chroma و Qdrant. ترقبوا.</p>
<p><strong>لمزيد من المعلومات، راجع <a href="https://milvus.io/docs/migrate_overview.md">وثائق Milvus-migration</a> أو <a href="https://github.com/zilliztech/milvus-migration">مستودع GitHub</a> الخاص به.</strong></p>
<p>--------------------------------- <strong>أداة ترحيل بيانات ميفوس تم إهمالها</strong> ----------------------</p>
<h3 id="Overview" class="common-anchor-header">نظرة عامة</h3><p><a href="https://github.com/milvus-io/milvus-tools">MilvusDM</a> (Milvus Data Migration) هي أداة مفتوحة المصدر مصممة خصيصًا لاستيراد وتصدير ملفات البيانات باستخدام Milvus. يمكن لأداة MilvusDM تحسين كفاءة إدارة البيانات بشكل كبير وتقليل تكاليف DevOps بالطرق التالية:</p>
<ul>
<li><p><a href="#faiss-to-milvus">من فايس إلى ملف</a>وس: استيراد البيانات غير المضغوطة من فايس إلى ملفوس.</p></li>
<li><p><a href="#hdf5-to-milvus">HDF5 إلى</a> ملفوس: استيراد ملفات HDF5 إلى ملفوس.</p></li>
<li><p>Milvus<a href="#milvus-to-milvus">إلى Mil</a>vus: ترحيل البيانات من مصدر Milvus إلى هدف Milvus مختلف.</p></li>
<li><p>ميلفوس<a href="#milvus-to-hdf5">إلى HDF5</a>: حفظ البيانات في ميلفوس كملفات HDF5.</p></li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvusdm_blog_1_199cbdebe7.png" alt="milvusdm blog 1.png" class="doc-image" id="milvusdm-blog-1.png" />
   </span> <span class="img-wrapper"> <span>مدونة Milvusdm 1.png</span> </span></p>
<p>MilvusDM مستضاف على <a href="https://github.com/milvus-io/milvus-tools">Github</a> ويمكن تثبيته بسهولة عن طريق تشغيل سطر الأوامر <code translate="no">pip3 install pymilvusdm</code>. يسمح لك MilvusDM بترحيل البيانات في مجموعة أو قسم معين. سنشرح في الأقسام التالية كيفية استخدام كل نوع من أنواع ترحيل البيانات.</p>
<p><br/></p>
<h3 id="Faiss-to-Milvus" class="common-anchor-header">فايس إلى ملفوس</h3><h4 id="Steps" class="common-anchor-header">الخطوات</h4><p>1- قم بتنزيل <strong>F2M.yaml:</strong></p>
<pre><code translate="no">$ wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/F2</span>
<button class="copy-code-btn"></button></code></pre>
<p>2- قم بتعيين المعلمات التالية:</p>
<ul>
<li><p><code translate="no">data_path</code>: مسار البيانات (المتجهات والمعرفات المقابلة لها) في فايس.</p></li>
<li><p><code translate="no">dest_host</code>: عنوان خادم ميلفوس.</p></li>
<li><p><code translate="no">dest_port</code>: منفذ خادم ميلفوس.</p></li>
<li><p><code translate="no">mode</code>: يمكن استيراد البيانات إلى ميلفوس باستخدام الأوضاع التالية:</p>
<ul>
<li><p>تخطي: تجاهل البيانات إذا كانت المجموعة أو القسم موجود بالفعل.</p></li>
<li><p>إلحاق: إلحاق البيانات إذا كانت المجموعة أو القسم موجود بالفعل.</p></li>
<li><p>الكتابة فوق: حذف البيانات قبل الإدراج إذا كانت المجموعة أو القسم موجود بالفعل.</p></li>
</ul></li>
<li><p><code translate="no">dest_collection_name</code>: اسم المجموعة المستقبلة لاستيراد البيانات.</p></li>
<li><p><code translate="no">dest_partition_name</code>: اسم قسم الاستقبال لاستيراد البيانات.</p></li>
<li><p><code translate="no">collection_parameter</code>: المعلومات الخاصة بالمجموعة مثل البعد المتجه وحجم ملف الفهرس ومقياس المسافة.</p></li>
</ul>
<pre><code translate="no">F2M:
  milvus_version: <span class="hljs-number">1.0</span><span class="hljs-number">.0</span>
  data_path: <span class="hljs-string">&#x27;/home/data/faiss.index&#x27;</span>
  dest_host: <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>
  dest_port: <span class="hljs-number">19530</span>
  mode: <span class="hljs-string">&#x27;append&#x27;</span>        <span class="hljs-comment"># &#x27;skip/append/overwrite&#x27;</span>
  dest_collection_name: <span class="hljs-string">&#x27;test&#x27;</span>
  dest_partition_name: <span class="hljs-string">&#x27;&#x27;</span>
  collection_parameter:
    dimension: <span class="hljs-number">256</span>
    index_file_size: <span class="hljs-number">1024</span>
    metric_type: <span class="hljs-string">&#x27;L2&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>3- تشغيل <strong>F2M.yaml:</strong></p>
<pre><code translate="no">$ milvusdm --yaml F2M.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Sample-Code" class="common-anchor-header">نموذج التعليمات البرمجية</h4><p>1- قراءة ملفات فايس لاسترداد المتجهات والمعرفات المقابلة لها.</p>
<pre><code translate="no">ids, vectors = faiss_data.read_faiss_data()
<button class="copy-code-btn"></button></code></pre>
<p>2- إدراج البيانات المسترجعة في ملف ميلفوس:</p>
<pre><code translate="no">insert_milvus.insert_data(vectors, <span class="hljs-variable language_">self</span>.dest_collection_name, <span class="hljs-variable language_">self</span>.collection_parameter, <span class="hljs-variable language_">self</span>.mode, ids, <span class="hljs-variable language_">self</span>.dest_partition_name)
<button class="copy-code-btn"></button></code></pre>
<p><br/></p>
<h3 id="HDF5-to-Milvus" class="common-anchor-header">من HDF5 إلى ملفوس</h3><h4 id="Steps" class="common-anchor-header">الخطوات</h4><p>1- قم بتنزيل <strong>H2M.yaml.</strong></p>
<pre><code translate="no">$ wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/H2M.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>2- تعيين المعلمات التالية:</p>
<ul>
<li><p><code translate="no">data_path</code>: المسار إلى ملفات HDF5.</p></li>
<li><p><code translate="no">data_dir</code>: الدليل الذي يحتوي على ملفات HDF5.</p></li>
<li><p><code translate="no">dest_host</code>: عنوان خادم ميلفوس.</p></li>
<li><p><code translate="no">dest_port</code>: منفذ خادم ميلفوس.</p></li>
<li><p><code translate="no">mode</code>: يمكن استيراد البيانات إلى ميلفوس باستخدام الأوضاع التالية:</p>
<ul>
<li><p>تخطي: تجاهل البيانات إذا كانت المجموعة أو القسم موجود بالفعل.</p></li>
<li><p>إلحاق: إلحاق البيانات إذا كانت المجموعة أو القسم موجود بالفعل.</p></li>
<li><p>الكتابة فوق: حذف البيانات قبل الإدراج إذا كانت المجموعة أو القسم موجود بالفعل.</p></li>
</ul></li>
<li><p><code translate="no">dest_collection_name</code>: اسم المجموعة المستقبلة لاستيراد البيانات.</p></li>
<li><p><code translate="no">dest_partition_name</code>: اسم قسم الاستقبال لاستيراد البيانات.</p></li>
<li><p><code translate="no">collection_parameter</code>: المعلومات الخاصة بالمجموعة مثل البعد المتجه وحجم ملف الفهرس ومقياس المسافة.</p></li>
</ul>
<blockquote>
<p>قم بتعيين إما <code translate="no">data_path</code> أو <code translate="no">data_dir</code>. <strong>لا</strong> تقم بتعيين كليهما. استخدم <code translate="no">data_path</code> لتحديد مسارات ملفات متعددة، أو <code translate="no">data_dir</code> لتحديد الدليل الذي يحتوي على ملف البيانات.</p>
</blockquote>
<pre><code translate="no">H2M:
  milvus-version: 1.0.0
  data_path:
    - /Users/zilliz/float_1.h5
    - /Users/zilliz/float_2.h5
  data_dir:
  dest_host: <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>
  dest_port: 19530
  mode: <span class="hljs-string">&#x27;overwrite&#x27;</span>        <span class="hljs-comment"># &#x27;skip/append/overwrite&#x27;</span>
  dest_collection_name: <span class="hljs-string">&#x27;test_float&#x27;</span>
  dest_partition_name: <span class="hljs-string">&#x27;partition_1&#x27;</span>
  collection_parameter:
    dimension: 128
    index_file_size: 1024
    metric_type: <span class="hljs-string">&#x27;L2&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>3- قم بتشغيل <strong>H2M.yaml:</strong></p>
<pre><code translate="no">$ milvusdm --yaml H2M.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Sample-Code" class="common-anchor-header">نموذج التعليمات البرمجية</h4><p>1- اقرأ ملفات HDF5 لاسترداد المتجهات والمعرفات المقابلة لها:</p>
<pre><code translate="no">vectors, ids = <span class="hljs-variable language_">self</span>.file.read_hdf5_data()
<button class="copy-code-btn"></button></code></pre>
<p>2- أدخل البيانات المسترجعة في ميلفوس:</p>
<pre><code translate="no">ids = insert_milvus.insert_data(vectors, <span class="hljs-variable language_">self</span>.c_name, <span class="hljs-variable language_">self</span>.c_param, <span class="hljs-variable language_">self</span>.mode, ids,<span class="hljs-variable language_">self</span>.p_name)
<button class="copy-code-btn"></button></code></pre>
<p><br/></p>
<h3 id="Milvus-to-Milvus" class="common-anchor-header">ميلفوس إلى ميلفوس</h3><h4 id="Steps" class="common-anchor-header">الخطوات</h4><p>1- قم بتنزيل <strong>M2M.yaml.</strong></p>
<pre><code translate="no">$ wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/M2M.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>2- قم بتعيين المعلمات التالية:</p>
<ul>
<li><p><code translate="no">source_milvus_path</code>: مسار عمل ميلفوس المصدر.</p></li>
<li><p><code translate="no">mysql_parameter</code>: إعدادات مصدر Milvus MySQL. إذا لم يتم استخدام MySQL، قم بتعيين mysql_parameter كـ ''.</p></li>
<li><p><code translate="no">source_collection</code>: أسماء المجموعة وأقسامها في المصدر ملفوس المصدر.</p></li>
<li><p><code translate="no">dest_host</code>: عنوان خادم ميلفوس.</p></li>
<li><p><code translate="no">dest_port</code>: منفذ خادم ميلفوس.</p></li>
<li><p><code translate="no">mode</code>: يمكن استيراد البيانات إلى ميلفوس باستخدام الأوضاع التالية:</p>
<ul>
<li><p>تخطي: تجاهل البيانات إذا كانت المجموعة أو القسم موجود بالفعل.</p></li>
<li><p>إلحاق: إلحاق البيانات إذا كانت المجموعة أو القسم موجود بالفعل.</p></li>
<li><p>الكتابة فوق: إذا كانت المجموعة أو القسم موجوداً بالفعل، احذف البيانات قبل إدراجها.حذف البيانات قبل الإدراج إذا كانت المجموعة أو القسم موجوداً بالفعل.</p></li>
</ul></li>
</ul>
<pre><code translate="no">M2M:
  milvus_version: 1.0.0
  source_milvus_path: <span class="hljs-string">&#x27;/home/user/milvus&#x27;</span>
  mysql_parameter:
    host: <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>
    user: <span class="hljs-string">&#x27;root&#x27;</span>
    port: 3306
    password: <span class="hljs-string">&#x27;123456&#x27;</span>
    database: <span class="hljs-string">&#x27;milvus&#x27;</span>
  source_collection:
    <span class="hljs-built_in">test</span>:
      - <span class="hljs-string">&#x27;partition_1&#x27;</span>
      - <span class="hljs-string">&#x27;partition_2&#x27;</span>
  dest_host: <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>
  dest_port: 19530
  mode: <span class="hljs-string">&#x27;skip&#x27;</span> <span class="hljs-comment"># &#x27;skip/append/overwrite&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>3- تشغيل <strong>M2M.yaml.</strong></p>
<pre><code translate="no">$ milvusdm --yaml M2M.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Sample-Code" class="common-anchor-header">كود العينة</h4><p>1- وفقًا للبيانات الوصفية للمجموعة أو القسم المحدد، اقرأ الملفات الموجودة ضمن <strong>milvus/db</strong> على محرك الأقراص المحلي لاسترداد المتجهات والمعرفات المقابلة لها من المصدر Milvus.</p>
<pre><code translate="no">collection_parameter, _ = milvus_meta.get_collection_info(collection_name)
r_vectors, r_ids, r_rows = milvusdb.read_milvus_file(<span class="hljs-variable language_">self</span>.milvus_meta, collection_name, partition_tag)
<button class="copy-code-btn"></button></code></pre>
<p>2- أدخل البيانات التي تم استرجاعها في الميلفوس الهدف.</p>
<pre><code translate="no">milvus_insert.insert_data(r_vectors, collection_name, collection_parameter, <span class="hljs-variable language_">self</span>.mode, r_ids, partition_tag)
<button class="copy-code-btn"></button></code></pre>
<p><br/></p>
<h3 id="Milvus-to-HDF5" class="common-anchor-header">ميلفوس إلى HDF5</h3><h4 id="Steps" class="common-anchor-header">الخطوات</h4><p>1- قم بتنزيل <strong>M2H.yaml:</strong></p>
<pre><code translate="no">$ wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/M2H.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>2- قم بتعيين المعلمات التالية:</p>
<ul>
<li><p><code translate="no">source_milvus_path</code>: مسار عمل ميلفوس المصدر.</p></li>
<li><p><code translate="no">mysql_parameter</code>: إعدادات مصدر Milvus MySQL. إذا لم يتم استخدام MySQL، قم بتعيين mysql_parameter كـ ''.</p></li>
<li><p><code translate="no">source_collection</code>: أسماء المجموعة وأقسامها في المصدر ملفوس المصدر.</p></li>
<li><p><code translate="no">data_dir</code>: دليل لحفظ ملفات HDF5 المحفوظة.</p></li>
</ul>
<pre><code translate="no">M2H:
  milvus_version: <span class="hljs-number">1.0</span><span class="hljs-number">.0</span>
  source_milvus_path: <span class="hljs-string">&#x27;/home/user/milvus&#x27;</span>
  mysql_parameter:
    host: <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>
    user: <span class="hljs-string">&#x27;root&#x27;</span>
    port: <span class="hljs-number">3306</span>
    password: <span class="hljs-string">&#x27;123456&#x27;</span>
    database: <span class="hljs-string">&#x27;milvus&#x27;</span>
  source_collection: # specify the <span class="hljs-string">&#x27;partition_1&#x27;</span> and <span class="hljs-string">&#x27;partition_2&#x27;</span> partitions of the <span class="hljs-string">&#x27;test&#x27;</span> collection.
    test:
      - <span class="hljs-string">&#x27;partition_1&#x27;</span>
      - <span class="hljs-string">&#x27;partition_2&#x27;</span>
  data_dir: <span class="hljs-string">&#x27;/home/user/data&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>3- قم بتشغيل <strong>M2H.yaml:</strong></p>
<pre><code translate="no">$ milvusdm --yaml M2H.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Sample-Code" class="common-anchor-header">كود العينة</h4><p>1- وفقًا للبيانات الوصفية للمجموعة أو القسم المحدد، اقرأ الملفات الموجودة ضمن <strong>milvus/db</strong> على محرك الأقراص المحلي لاسترداد المتجهات والمعرفات المقابلة لها.</p>
<pre><code translate="no">collection_parameter, version = milvus_meta.get_collection_info(collection_name)
r_vectors, r_ids, r_rows = milvusdb.read_milvus_file(<span class="hljs-variable language_">self</span>.milvus_meta, collection_name, partition_tag)
<button class="copy-code-btn"></button></code></pre>
<p>2- احفظ البيانات المسترجعة كملفات HDF5.</p>
<pre><code translate="no">data_save.save_yaml(collection_name, partition_tag, collection_parameter, version, save_hdf5_name)
<button class="copy-code-btn"></button></code></pre>
<h3 id="MilvusDM-File-Structure" class="common-anchor-header">بنية ملف MilvusDM</h3><p>يوضح مخطط التدفق أدناه كيف يقوم MilvusDM بتنفيذ المهام المختلفة وفقًا لملف YAML الذي يتلقاه:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvusdm_blog_2_7824b16e5e.png" alt="milvusdm blog 2.png" class="doc-image" id="milvusdm-blog-2.png" />
   </span> <span class="img-wrapper"> <span>milvusdm blog 2.png</span> </span></p>
<p>بنية ملف MilvusDM:</p>
<ul>
<li><p>بيميلفوسدم</p>
<ul>
<li><p>النواة</p>
<ul>
<li><p><strong>milvus_client.py</strong>: ينفذ عمليات العميل في ميلفوس.</p></li>
<li><p><strong>read_data.py</strong>: يقرأ ملفات بيانات HDF5 على محرك الأقراص المحلي. (أضف الكود الخاص بك هنا لدعم قراءة ملفات البيانات بتنسيقات أخرى).</p></li>
<li><p><strong>read_faiss_data.py</strong>: يقرأ ملفات البيانات في Faiss.</p></li>
<li><p><strong>read_milvus_data.py</strong>: يقرأ ملفات البيانات في Milvus.</p></li>
<li><p><strong>read_milvus_meta.py</strong>: يقرأ البيانات الوصفية في ميلفوس.</p></li>
<li><p><strong>data_to_milvus.py</strong>: ينشئ مجموعات أو أقسام بناءً على معلمات في ملفات YAML ويستورد المتجهات ومعرفات المتجهات المقابلة إلى ملف Milvus.</p></li>
<li><p><strong>save_data.py</strong>: يحفظ البيانات كملفات HDF5.</p></li>
<li><p><strong>write_logs.py</strong>: يكتب السجلات أثناء وقت التشغيل.</p></li>
</ul></li>
<li><p><strong>faiss_to_milvus.py</strong>: يستورد البيانات من فايس إلى ملفوس.</p></li>
<li><p><strong>hdf5_to_milvus.py</strong>: يستورد البيانات في ملفات HDF5 إلى ملف ميلفوس.</p></li>
<li><p><strong>milvus_to_milvus.py</strong>: يقوم بترحيل البيانات من المصدر Milvus إلى الهدف Milvus.</p></li>
<li><p><strong>milvus_to_hdf5.py</strong>: تصدير البيانات في ميلفوس وحفظها كملفات HDF5.</p></li>
<li><p><strong>main.py</strong>: ينفذ المهام المقابلة وفقًا لملف YAML المستلم.</p></li>
<li><p><strong>setting.py</strong>: الإعدادات المتعلقة بتشغيل كود MilvusDM.</p></li>
</ul></li>
<li><p><strong>setup.py</strong>: ينشئ حزم ملفات <strong>pymilvusdm</strong> ويرفعها إلى PyPI (فهرس حزم Python).</p></li>
</ul>
<p><br/></p>
<h3 id="Recap" class="common-anchor-header">الخلاصة</h3><p>تتعامل MilvusDM بشكل أساسي مع ترحيل البيانات من وإلى ميلفوس، والتي تشمل من فايس إلى ميلفوس، ومن HDF5 إلى ميلفوس، ومن ميلفوس إلى ميلفوس، ومن ميلفوس إلى ميلفوس، ومن ميلفوس إلى HDF5.</p>
<p>الميزات التالية مخطط لها في الإصدارات القادمة:</p>
<ul>
<li><p>استيراد البيانات الثنائية من فايس إلى ميلفوس.</p></li>
<li><p>قائمة الكتل والسماح بترحيل البيانات بين المصدر ميلفوس المصدر وميلفوس الهدف.</p></li>
<li><p>دمج واستيراد البيانات من مجموعات أو أقسام متعددة في المصدر ميلفوس المصدر إلى مجموعة جديدة في الهدف ميلفوس.</p></li>
<li><p>النسخ الاحتياطي واستعادة بيانات ملفوس.</p></li>
</ul>
<p>مشروع MilvusDM مفتوح المصدر على <a href="https://github.com/milvus-io/milvus-tools">Github</a>. نرحب بأي وجميع المساهمات في المشروع. امنحه نجمة 🌟، ولا تتردد في تقديم <a href="https://github.com/milvus-io/milvus-tools/issues">مشكلة</a> أو إرسال التعليمات البرمجية الخاصة بك!</p>
