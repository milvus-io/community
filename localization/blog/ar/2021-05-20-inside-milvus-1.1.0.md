---
id: inside-milvus-1.1.0.md
title: الميزات الجديدة
author: milvus
date: 2021-05-20T08:35:42.700Z
desc: >-
  وصل الإصدار Milvus v1.1.0! الميزات الجديدة والتحسينات وإصلاحات الأخطاء متاحة
  الآن.
cover: assets.zilliz.com/v1_1_cover_487e70971a.jpeg
tag: News
canonicalUrl: 'https://zilliz.com/blog/inside-milvus-1.1.0'
---
<custom-h1>داخل ميلفوس 1.1.0</custom-h1><p><a href="https://github.com/milvus-io">Milvus</a> هو مشروع برمجيات مفتوحة المصدر (OSS) مستمر يركز على بناء أسرع قاعدة بيانات متجهات في العالم وأكثرها موثوقية. الميزات الجديدة داخل Milvus v1.1.0 هي أول التحديثات القادمة بفضل الدعم طويل الأمد من مجتمع البرمجيات مفتوحة المصدر والرعاية من Zilliz. تغطي مقالة المدونة هذه الميزات الجديدة والتحسينات وإصلاحات الأخطاء المضمنة في الإصدار Milvus v1.1.0.</p>
<p><strong>انتقل إلى:</strong></p>
<ul>
<li><a href="#new-features">الميزات الجديدة</a></li>
<li><a href="#improvements">التحسينات</a></li>
<li><a href="#bug-fixes">إصلاحات الأخطاء</a></li>
</ul>
<p><br/></p>
<h2 id="New-features" class="common-anchor-header">الميزات الجديدة<button data-href="#New-features" class="anchor-icon" translate="no">
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
    </button></h2><p>مثل أي مشروع برمجيات مفتوحة المصدر، فإن ميلفوس هو عمل دائم قيد التطوير. نحن نسعى جاهدين للاستماع إلى مستخدمينا ومجتمع المصادر المفتوحة لتحديد أولويات الميزات الأكثر أهمية. يقدم آخر تحديث، Milvus v1.1.0، الميزات الجديدة التالية:</p>
<h3 id="Specify-partitions-with-getentitybyid-method-calls" class="common-anchor-header">تحديد الأقسام باستخدام <code translate="no">get_entity_by_id()</code> استدعاءات طريقة </h3><p>لزيادة تسريع البحث عن تشابه المتجهات، يدعم Milvus 1.1.0 الآن استرجاع المتجهات من قسم محدد. بشكل عام، يدعم Milvus الاستعلام عن المتجهات من خلال معرفات متجهات محددة. في الإصدار Milvus 1.0 من Milvus 1.0، يؤدي استدعاء الطريقة <code translate="no">get_entity_by_id()</code> إلى البحث في المجموعة بأكملها، وهو ما قد يستغرق وقتًا طويلاً بالنسبة لمجموعات البيانات الكبيرة. كما نرى من الكود أدناه، يستخدم <code translate="no">GetVectorsByIdHelper</code> بنية <code translate="no">FileHolder</code> للتكرار والعثور على متجه محدد.</p>
<pre><code translate="no">std::vector&lt;meta::CollectionSchema&gt; collection_array; 
 <span class="hljs-type">auto</span> <span class="hljs-variable">status</span> <span class="hljs-operator">=</span> meta_ptr_-&gt;ShowPartitions(collection.collection_id_, collection_array); 
  
 collection_array.push_back(collection); 
 status = meta_ptr_-&gt;FilesByTypeEx(collection_array, file_types, files_holder); 
 <span class="hljs-keyword">if</span> (!status.ok()) { 
     std::<span class="hljs-type">string</span> <span class="hljs-variable">err_msg</span> <span class="hljs-operator">=</span> <span class="hljs-string">&quot;Failed to get files for GetVectorByID: &quot;</span> + status.message(); 
     LOG_ENGINE_ERROR_ &lt;&lt; err_msg; 
     <span class="hljs-keyword">return</span> status; 
 } 
  
 <span class="hljs-keyword">if</span> (files_holder.HoldFiles().empty()) { 
     LOG_ENGINE_DEBUG_ &lt;&lt; <span class="hljs-string">&quot;No files to get vector by id from&quot;</span>; 
     <span class="hljs-keyword">return</span> Status(DB_NOT_FOUND, <span class="hljs-string">&quot;Collection is empty&quot;</span>); 
 } 
  
 cache::CpuCacheMgr::GetInstance()-&gt;PrintInfo(); 
 status = GetVectorsByIdHelper(id_array, vectors, files_holder); 
DBImpl::GetVectorsByIdHelper(const IDNumbers&amp; id_array, std::vector&lt;engine::VectorsData&gt;&amp; vectors, 
                              meta::FilesHolder&amp; files_holder) { 
     <span class="hljs-comment">// attention: this is a copy, not a reference, since the files_holder.UnMarkFile will change the array internal </span>
     milvus::engine::meta::<span class="hljs-type">SegmentsSchema</span> <span class="hljs-variable">files</span> <span class="hljs-operator">=</span> files_holder.HoldFiles(); 
     LOG_ENGINE_DEBUG_ &lt;&lt; <span class="hljs-string">&quot;Getting vector by id in &quot;</span> &lt;&lt; files.size() &lt;&lt; <span class="hljs-string">&quot; files, id count = &quot;</span> &lt;&lt; id_array.size(); 
  
     <span class="hljs-comment">// sometimes not all of id_array can be found, we need to return empty vector for id not found </span>
     <span class="hljs-comment">// for example: </span>
     <span class="hljs-comment">// id_array = [1, -1, 2, -1, 3] </span>
     <span class="hljs-comment">// vectors should return [valid_vector, empty_vector, valid_vector, empty_vector, valid_vector] </span>
     <span class="hljs-comment">// the ID2RAW is to ensure returned vector sequence is consist with id_array </span>
     <span class="hljs-type">using</span> <span class="hljs-variable">ID2VECTOR</span> <span class="hljs-operator">=</span> std::map&lt;int64_t, VectorsData&gt;; 
     ID2VECTOR map_id2vector; 
  
     vectors.clear(); 
  
     <span class="hljs-type">IDNumbers</span> <span class="hljs-variable">temp_ids</span> <span class="hljs-operator">=</span> id_array; 
     <span class="hljs-keyword">for</span> (auto&amp; file : files) { 
<button class="copy-code-btn"></button></code></pre>
<p>ومع ذلك، لا يتم تصفية هذه البنية من خلال أي أقسام في <code translate="no">FilesByTypeEx()</code>. في Milvus v1.1.0، من الممكن للنظام أن يمرر أسماء الأقسام إلى حلقة <code translate="no">GetVectorsIdHelper</code> بحيث يحتوي <code translate="no">FileHolder</code> على مقاطع من أقسام محددة فقط. وبعبارة أخرى، إذا كنت تعرف بالضبط القسم الذي ينتمي إليه متجه البحث، يمكنك تحديد اسم القسم في استدعاء طريقة <code translate="no">get_entity_by_id()</code> لتسريع عملية البحث.</p>
<p>لم نقم فقط بإجراء تعديلات على التعليمات البرمجية التي تتحكم في استعلامات النظام على مستوى خادم Milvus، بل قمنا أيضًا بتحديث جميع حزم SDKs الخاصة بنا (Python وGo وC++ وJava وRESTful) بإضافة معلمة لتحديد أسماء الأقسام. على سبيل المثال، في pymilvus، تم تغيير تعريف <code translate="no">get_entity_by_id</code> <code translate="no">def get_entity_by_id(self, collection_name, ids, timeout=None)</code> إلى <code translate="no">def get_entity_by_id(self, collection_name, partition_tags=None, ids, timeout=None)</code>.</p>
<p><br/></p>
<h3 id="Specify-partitions-with-deleteentitybyid-method-calls" class="common-anchor-header">تحديد الأقسام باستخدام استدعاءات الأسلوب <code translate="no">delete_entity_by_id()</code> </h3><p>لجعل إدارة المتجهات أكثر كفاءة، يدعم Milvus v1.1.0 الآن تحديد أسماء الأقسام عند حذف متجه في مجموعة. في الإصدار Milvus 1.0، لا يمكن حذف المتجهات في مجموعة إلا عن طريق المعرف. عند استدعاء طريقة الحذف، سيقوم Milvus بمسح جميع المتجهات في المجموعة. ومع ذلك، فإنه من الأكثر كفاءة بكثير مسح الأجزاء ذات الصلة فقط عند العمل مع مجموعات بيانات متجهات ضخمة بملايين أو مليارات أو حتى تريليون متجه. على غرار الميزة الجديدة لتحديد الأقسام باستخدام استدعاءات الأسلوب <code translate="no">get_entity_by_id()</code> ، تم إجراء تعديلات على كود Milvus باستخدام نفس المنطق.</p>
<p><br/></p>
<h3 id="New-method-releasecollection" class="common-anchor-header">طريقة جديدة <code translate="no">release_collection()</code></h3><p>لتحرير ذاكرة Milvus المستخدمة لتحميل المجموعات في وقت التشغيل، تمت إضافة طريقة جديدة <code translate="no">release_collection()</code> في Milvus v1.1.0 لتفريغ مجموعات محددة يدويًا من ذاكرة التخزين المؤقت.</p>
<p><br/></p>
<h2 id="Improvements" class="common-anchor-header">التحسينات<button data-href="#Improvements" class="anchor-icon" translate="no">
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
    </button></h2><p>على الرغم من أن الميزات الجديدة عادةً ما تكون في غاية الأهمية، إلا أنه من المهم أيضًا تحسين ما لدينا بالفعل. ما يلي هو ترقيات وتحسينات عامة أخرى على الإصدار 1.0 من ميلفوس.</p>
<p><br/></p>
<h3 id="Improved-performance-of-getentitybyid-method-call" class="common-anchor-header">تحسين أداء استدعاء الأسلوب <code translate="no">get_entity_by_id()</code> </h3><p>الرسم البياني أدناه هو مقارنة أداء البحث المتجه بين Milvus v1.0 و Milvus v1.1.0:</p>
<blockquote>
<p>وحدة المعالجة المركزية: وحدة المعالجة المركزية Intel® Core™ i7-8550U @ 1.80 جيجا هرتز * 8 <br/>حجم ملف المقطع = 1024 ميجابايت <br/>عدد الصفوف = 1,000,000 <br/>خافت = 128</p>
</blockquote>
<table>
<thead>
<tr><th style="text-align:center">رقم معرف الاستعلام</th><th style="text-align:center">v 1.0.0</th><th style="text-align:center">v1.1.0</th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">10</td><td style="text-align:center">9 مللي ثانية</td><td style="text-align:center">2 مللي ثانية</td></tr>
<tr><td style="text-align:center">100</td><td style="text-align:center">149 مللي ثانية</td><td style="text-align:center">19 مللي ثانية</td></tr>
</tbody>
</table>
<p><br/></p>
<h3 id="Hnswlib-upgraded-to-v050" class="common-anchor-header">تمت ترقية Hnswlib إلى الإصدار 0.5.0</h3><p>تتبنى Milvus العديد من مكتبات الفهارس المستخدمة على نطاق واسع، بما في ذلك Faiss وNMSLIB وHnswlib وAnnoy لتبسيط عملية اختيار نوع الفهرس المناسب لسيناريو معين.</p>
<p>تمت ترقية Hnswlib من الإصدار 0.3.0 إلى الإصدار 0.5.0 في الإصدار Milvus 1.1.0 بسبب اكتشاف خطأ في الإصدار السابق. بالإضافة إلى ذلك، أدت ترقية Hnswlib إلى تحسين أداء <code translate="no">addPoint()</code> في بناء الفهرس.</p>
<p>أنشأ أحد مطوّري Zilliz طلب سحب (PR) لتحسين أداء Hnswlib أثناء بناء الفهارس في Milvus. انظر <a href="https://github.com/nmslib/hnswlib/pull/298">PR #298</a> للحصول على التفاصيل.</p>
<p>الرسم البياني أدناه عبارة عن مقارنة بين أداء <code translate="no">addPoint()</code> بين أداء Hnswlib 0.5.0 وطلب العلاقات العامة المقترح:</p>
<blockquote>
<p>وحدة المعالجة المركزية: وحدة المعالجة المركزية Intel® Core™ i7-8550U @ 1.80 جيجا هرتز * 8 <br/>مجموعة البيانات: sift_1M (عدد الصفوف = 1000000، خافت = 128، المساحة = L2)</p>
</blockquote>
<table>
<thead>
<tr><th style="text-align:center"></th><th style="text-align:center">0.5.0</th><th style="text-align:center">PR-298</th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">M = 16، ef_construction = 100</td><td style="text-align:center">274406 مللي ثانية</td><td style="text-align:center">265631 مللي ثانية</td></tr>
<tr><td style="text-align:center">M = 16، ef_construction = 200</td><td style="text-align:center">522411 مللي ثانية</td><td style="text-align:center">499639 مللي ثانية</td></tr>
</tbody>
</table>
<p><br/></p>
<h3 id="Improved-IVF-index-training-performance" class="common-anchor-header">تحسين أداء التدريب على فهرس IVF</h3><p>يتضمن إنشاء الفهرس التدريب وإدخال البيانات وكتابتها على القرص. يعمل الإصدار Milvus 1.1.0 على تحسين عنصر التدريب في بناء الفهرس. الرسم البياني أدناه هو مقارنة لأداء تدريب فهرس IVF بين Milvus 1.0 و Milvus 1.1.0:</p>
<blockquote>
<p>وحدة المعالجة المركزية: وحدة المعالجة المركزية Intel® Core™ i7-8550U @ 1.80 جيجا هرتز * 8 <br/>مجموعة البيانات: sift_1m (عدد الصفوف = 1000000، خافت = 128، نوع_المقياس = L2)</p>
</blockquote>
<table>
<thead>
<tr><th style="text-align:center"></th><th style="text-align:center">الإصدار 1.0.0 (مللي ثانية)</th><th style="text-align:center">الإصدار 1.1.0 (مللي ثانية)</th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">ivf_flat (nlist = 2048)</td><td style="text-align:center">90079</td><td style="text-align:center">81544</td></tr>
<tr><td style="text-align:center">ivf_pq (قائمة رقمية = 2048، م=16)</td><td style="text-align:center">103535</td><td style="text-align:center">97115</td></tr>
<tr><td style="text-align:center">ivf_pq (القائمة = 2048، م=32)</td><td style="text-align:center">108638</td><td style="text-align:center">104558</td></tr>
<tr><td style="text-align:center">ivf_flat (القائمة = 4096)</td><td style="text-align:center">340643</td><td style="text-align:center">310685</td></tr>
<tr><td style="text-align:center">ivf_pq (القائمة = 4096، م=16)</td><td style="text-align:center">351982</td><td style="text-align:center">323758</td></tr>
<tr><td style="text-align:center">ivf_pq (القائمة = 4096، م=32)</td><td style="text-align:center">357359</td><td style="text-align:center">330887</td></tr>
</tbody>
</table>
<p><br/></p>
<h2 id="Bug-fixes" class="common-anchor-header">إصلاحات الأخطاء<button data-href="#Bug-fixes" class="anchor-icon" translate="no">
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
    </button></h2><p>قمنا أيضًا بإصلاح بعض الأخطاء لجعل Milvus أكثر استقرارًا وفعالية عند إدارة مجموعات البيانات المتجهة. انظر <a href="https://milvus.io/docs/v1.1.0/release_notes.md#Fixed-issues">المشكلات التي تم إصلاحها</a> لمزيد من التفاصيل.</p>
