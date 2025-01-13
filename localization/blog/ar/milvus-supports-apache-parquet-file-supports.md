---
id: milvus-supports-apache-parquet-file-supports.md
title: يدعم Milvus عمليات استيراد ملفات Apache Parquet لتحسين كفاءة معالجة البيانات
author: 'Cai Zhang, Fendy Feng'
date: 2024-3-8
desc: >-
  من خلال تبني Apache Parquet، يمكن للمستخدمين تبسيط عمليات استيراد البيانات
  والاستمتاع بتوفير كبير في تكاليف التخزين والحساب.
metaTitle: Milvus Supports Imports of Apache Parquet Files
cover: assets.zilliz.com/Milvus_Supports_the_Imports_of_Parquet_Files_3288e755b8.png
tag: Engineering
tags: >-
  Data science, Database, Tech, Artificial Intelligence, Vector Management,
  Milvus
recommend: true
canonicalUrl: 'https://milvus.io/blog/milvus-supports-apache-parquet-file-supports.md'
---
<p>تخطو<a href="https://zilliz.com/what-is-milvus">Milvus،</a> قاعدة البيانات المتجهة القابلة للتطوير بدرجة كبيرة والمعروفة بقدرتها على التعامل مع مجموعات البيانات الضخمة، خطوة كبيرة إلى الأمام من خلال تقديم دعم ملف Parquet في <a href="https://zilliz.com/blog/what-is-new-in-milvus-2-3-4">الإصدار 2.3.4</a>. من خلال تبني Apache Parquet، يمكن للمستخدمين تبسيط عمليات استيراد البيانات والاستمتاع بتوفير كبير في تكاليف التخزين والحساب.</p>
<p>في آخر منشور لنا، نستكشف مزايا الباركيه والفوائد التي يجلبها لمستخدمي ميلفوس. كما نناقش الدافع وراء دمج هذه الميزة ونقدم دليلًا تفصيليًا حول استيراد ملفات الباركيه بسلاسة إلى ميلفوس، مما يفتح إمكانيات جديدة لإدارة البيانات وتحليلها بكفاءة.</p>
<h2 id="What-Is-Apache-Parquet" class="common-anchor-header">ما هو أباتشي باركيه؟<button data-href="#What-Is-Apache-Parquet" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://parquet.apache.org/">Apache Parquet</a> هو تنسيق ملف بيانات شائع مفتوح المصدر موجه نحو الأعمدة مصمم لتعزيز كفاءة تخزين ومعالجة مجموعات البيانات واسعة النطاق. على النقيض من تنسيقات البيانات التقليدية الموجهة نحو الصفوف مثل CSV أو JSON، يخزن Parquet البيانات حسب العمود، مما يوفر أنظمة ضغط وترميز أكثر كفاءة للبيانات. يُترجم هذا النهج إلى تحسين الأداء، وتقليل متطلبات التخزين، وتعزيز قوة المعالجة، مما يجعله مثاليًا للتعامل مع البيانات المعقدة بكميات كبيرة.</p>
<h2 id="How-Milvus-Users-Benefit-from-the-Support-for-Parquet-File-Imports" class="common-anchor-header">كيف يستفيد مستخدمو Milvus من دعم واردات ملفات الباركيه<button data-href="#How-Milvus-Users-Benefit-from-the-Support-for-Parquet-File-Imports" class="anchor-icon" translate="no">
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
    </button></h2><p>يوسع Milvus الدعم لعمليات استيراد الملفات الباركيه، مما يوفر للمستخدمين تجارب محسّنة ومزايا متنوعة، بما في ذلك خفض نفقات التخزين والحساب، وإدارة البيانات بشكل مبسّط، وعملية استيراد مبسّطة.</p>
<h3 id="Optimized-Storage-Efficiency-and-Streamlined-Data-Management" class="common-anchor-header">كفاءة تخزين محسّنة وإدارة بيانات مبسّطة</h3><p>يوفر Parquet خيارات ضغط مرنة ومخططات ترميز فعالة تلبي احتياجات أنواع البيانات المختلفة، مما يضمن كفاءة التخزين المثلى. تُعد هذه المرونة ذات قيمة خاصة في البيئات السحابية حيث يرتبط كل أونصة من التوفير في التخزين مباشرةً بتخفيضات ملموسة في التكلفة. وبفضل هذه الميزة الجديدة في Milvus، يمكن للمستخدمين دمج جميع بياناتهم المتنوعة في ملف واحد دون عناء، مما يسهل إدارة البيانات ويعزز تجربة المستخدم بشكل عام. هذه الميزة مفيدة بشكل خاص للمستخدمين الذين يعملون مع أنواع بيانات المصفوفات متغيرة الطول، والذين يمكنهم الآن الاستمتاع بعملية استيراد بيانات مبسطة.</p>
<h3 id="Improved-Query-Performance" class="common-anchor-header">تحسين أداء الاستعلام</h3><p>يعمل تصميم التخزين العمودي وطرق الضغط المتقدمة في Parquet على تحسين أداء الاستعلام بشكل كبير. عند إجراء الاستعلامات، يمكن للمستخدمين التركيز فقط على البيانات ذات الصلة دون مسح البيانات غير ذات الصلة. تقلل هذه القراءة الانتقائية للأعمدة من استخدام وحدة المعالجة المركزية، مما يؤدي إلى تسريع أوقات الاستعلام.</p>
<h3 id="Broad-Language-Compatibility" class="common-anchor-header">توافق واسع مع اللغات</h3><p>يتوفر الباركيه بلغات متعددة مثل Java و C++ C و Python وهو متوافق مع عدد كبير من أدوات معالجة البيانات. مع دعم ملفات الباركيه، يمكن لمستخدمي Milvus الذين يستخدمون حزم SDK مختلفة إنشاء ملفات الباركيه بسلاسة لتحليلها داخل قاعدة البيانات.</p>
<h2 id="How-to-Import-Parquet-Files-into-Milvus" class="common-anchor-header">كيفية استيراد ملفات الباركيه إلى ميلفوس<button data-href="#How-to-Import-Parquet-Files-into-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>إذا كانت بياناتك بتنسيق ملف باركيه بالفعل، فإن الاستيراد سهل. قم بتحميل ملف الباركيه إلى نظام تخزين كائنات مثل MinIO، وستكون جاهزًا للاستيراد.</p>
<p>مقتطف الشيفرة أدناه هو مثال على استيراد ملفات الباركيه إلى ميلفوس.</p>
<pre><code translate="no">remote_files = []
<span class="hljs-keyword">try</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Prepare upload files&quot;</span>)
    minio_client = Minio(endpoint=MINIO_ADDRESS, access_key=MINIO_ACCESS_KEY, secret_key=MINIO_SECRET_KEY,
                         secure=<span class="hljs-literal">False</span>)
    found = minio_client.bucket_exists(bucket_name)
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> found:
        minio_client.make_bucket(bucket_name)
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;MinIO bucket &#x27;{}&#x27; doesn&#x27;t exist&quot;</span>.<span class="hljs-built_in">format</span>(bucket_name))
        <span class="hljs-keyword">return</span> <span class="hljs-literal">False</span>, []

    <span class="hljs-comment"># set your remote data path</span>
    remote_data_path = <span class="hljs-string">&quot;milvus_bulkinsert&quot;</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">upload_file</span>(<span class="hljs-params">f: <span class="hljs-built_in">str</span></span>):
        file_name = os.path.basename(f)
        minio_file_path = os.path.join(remote_data_path, <span class="hljs-string">&quot;parquet&quot;</span>, file_name)
        minio_client.fput_object(bucket_name, minio_file_path, f)
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Upload file &#x27;{}&#x27; to &#x27;{}&#x27;&quot;</span>.<span class="hljs-built_in">format</span>(f, minio_file_path))
        remote_files.append(minio_file_path)

    upload_file(data_file)

<span class="hljs-keyword">except</span> S3Error <span class="hljs-keyword">as</span> e:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Failed to connect MinIO server {}, error: {}&quot;</span>.<span class="hljs-built_in">format</span>(MINIO_ADDRESS, e))
    <span class="hljs-keyword">return</span> <span class="hljs-literal">False</span>, []

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Successfully upload files: {}&quot;</span>.<span class="hljs-built_in">format</span>(remote_files))
<span class="hljs-keyword">return</span> <span class="hljs-literal">True</span>, remote_files
<button class="copy-code-btn"></button></code></pre>
<p>إذا كانت بياناتك ليست ملفات باركيه أو تحتوي على حقول ديناميكية، يمكنك الاستفادة من BulkWriter، أداة تحويل تنسيق البيانات الخاصة بنا، لمساعدتك في إنشاء ملفات باركيه. لقد تبنّى BulkWriter الآن الباركيه كتنسيق بيانات الإخراج الافتراضي، مما يضمن تجربة أكثر سهولة للمطورين.</p>
<p>مقتطف الشيفرة أدناه هو مثال على استخدام BulkWriter لتوليد ملفات Parquet.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">import</span> json

<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> (
    RemoteBulkWriter,
    BulkFileType,
)

remote_writer = RemoteBulkWriter(
        schema=your_collection_schema,
        remote_path=<span class="hljs-string">&quot;your_remote_data_path&quot;</span>,
        connect_param=RemoteBulkWriter.ConnectParam(
            endpoint=YOUR_MINIO_ADDRESS,
            access_key=YOUR_MINIO_ACCESS_KEY,
            secret_key=YOUR_MINIO_SECRET_KEY,
            bucket_name=<span class="hljs-string">&quot;a-bucket&quot;</span>,
        ),
        file_type=BulkFileType.PARQUET,
)

<span class="hljs-comment"># append your data</span>
batch_count = <span class="hljs-number">10000</span>
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(batch_count):
    row = {
        <span class="hljs-string">&quot;id&quot;</span>: i,
        <span class="hljs-string">&quot;bool&quot;</span>: <span class="hljs-literal">True</span> <span class="hljs-keyword">if</span> i % <span class="hljs-number">5</span> == <span class="hljs-number">0</span> <span class="hljs-keyword">else</span> <span class="hljs-literal">False</span>,
        <span class="hljs-string">&quot;int8&quot;</span>: i % <span class="hljs-number">128</span>,
        <span class="hljs-string">&quot;int16&quot;</span>: i % <span class="hljs-number">1000</span>,
        <span class="hljs-string">&quot;int32&quot;</span>: i % <span class="hljs-number">100000</span>,
        <span class="hljs-string">&quot;int64&quot;</span>: i,
        <span class="hljs-string">&quot;float&quot;</span>: i / <span class="hljs-number">3</span>,
        <span class="hljs-string">&quot;double&quot;</span>: i / <span class="hljs-number">7</span>,
        <span class="hljs-string">&quot;varchar&quot;</span>: <span class="hljs-string">f&quot;varchar_<span class="hljs-subst">{i}</span>&quot;</span>,
        <span class="hljs-string">&quot;json&quot;</span>: {<span class="hljs-string">&quot;dummy&quot;</span>: i, <span class="hljs-string">&quot;ok&quot;</span>: <span class="hljs-string">f&quot;name_<span class="hljs-subst">{i}</span>&quot;</span>},
        <span class="hljs-string">&quot;vector&quot;</span>: gen_binary_vector() <span class="hljs-keyword">if</span> bin_vec <span class="hljs-keyword">else</span> gen_float_vector(),
        <span class="hljs-string">f&quot;dynamic_<span class="hljs-subst">{i}</span>&quot;</span>: i,
    }
    remote_writer.append_row(row)

<span class="hljs-comment"># append rows by numpy type</span>
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(batch_count):
    remote_writer.append_row({
        <span class="hljs-string">&quot;id&quot;</span>: np.int64(i + batch_count),
        <span class="hljs-string">&quot;bool&quot;</span>: <span class="hljs-literal">True</span> <span class="hljs-keyword">if</span> i % <span class="hljs-number">3</span> == <span class="hljs-number">0</span> <span class="hljs-keyword">else</span> <span class="hljs-literal">False</span>,
        <span class="hljs-string">&quot;int8&quot;</span>: np.int8(i % <span class="hljs-number">128</span>),
        <span class="hljs-string">&quot;int16&quot;</span>: np.int16(i % <span class="hljs-number">1000</span>),
        <span class="hljs-string">&quot;int32&quot;</span>: np.int32(i % <span class="hljs-number">100000</span>),
        <span class="hljs-string">&quot;int64&quot;</span>: np.int64(i),
        <span class="hljs-string">&quot;float&quot;</span>: np.float32(i / <span class="hljs-number">3</span>),
        <span class="hljs-string">&quot;double&quot;</span>: np.float64(i / <span class="hljs-number">7</span>),
        <span class="hljs-string">&quot;varchar&quot;</span>: <span class="hljs-string">f&quot;varchar_<span class="hljs-subst">{i}</span>&quot;</span>,
        <span class="hljs-string">&quot;json&quot;</span>: json.dumps({<span class="hljs-string">&quot;dummy&quot;</span>: i, <span class="hljs-string">&quot;ok&quot;</span>: <span class="hljs-string">f&quot;name_<span class="hljs-subst">{i}</span>&quot;</span>}),
        <span class="hljs-string">&quot;vector&quot;</span>: gen_binary_vector() <span class="hljs-keyword">if</span> bin_vec <span class="hljs-keyword">else</span> gen_float_vector(),
        <span class="hljs-string">f&quot;dynamic_<span class="hljs-subst">{i}</span>&quot;</span>: i,
    })

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{remote_writer.total_row_count}</span> rows appends&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{remote_writer.buffer_row_count}</span> rows in buffer not flushed&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Generate data files...&quot;</span>)
remote_writer.commit()
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Data files have been uploaded: <span class="hljs-subst">{remote_writer.batch_files}</span>&quot;</span>)
remote_files = remote_writer.batch_files
<button class="copy-code-btn"></button></code></pre>
<p>بعد ذلك، يمكنك البدء في استيراد ملفات الباركيه الخاصة بك إلى Milvus.</p>
<pre><code translate="no">remote_files = [remote_file_path]
task_id = utility.do_bulk_insert(collection_name=collection_name,
                                 files=remote_files)

task_ids = [task_id]         
states = wait_tasks_to_state(task_ids, BulkInsertState.ImportCompleted)
complete_count = 0
for state in states:
    if state.state == BulkInsertState.ImportCompleted:
        complete_count = complete_count + 1
<button class="copy-code-btn"></button></code></pre>
<p>الآن، يتم دمج بياناتك بسلاسة في Milvus.</p>
<h2 id="Whats-Next" class="common-anchor-header">ما التالي؟<button data-href="#Whats-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>مع استمرار Milvus في دعم أحجام البيانات المتزايدة باستمرار، ينشأ التحدي في إدارة عمليات الاستيراد الكبيرة، خاصةً عندما تتجاوز ملفات الباركيه 10 جيجابايت. ولمواجهة هذا التحدي، نخطط لفصل بيانات الاستيراد إلى أعمدة قياسية وأخرى متجهة، وإنشاء ملفين باركيه لكل عملية استيراد لتخفيف ضغط الإدخال/الإخراج. بالنسبة لمجموعات البيانات التي تتجاوز عدة مئات من الجيجابايت، نوصي باستيراد البيانات عدة مرات.</p>
