---
id: deepseek-v3-0324-minor-update-thats-crushing-top-ai-models.md
title: 'DeepSeek V3-0324: "التحديث البسيط" الذي يسحق أفضل نماذج الذكاء الاصطناعي'
author: Lumina Wang
date: 2025-03-25T00:00:00.000Z
desc: >-
  تم تدريب برنامج DeepSeek v3-0324 بمعلمات أكبر، ولديه نافذة سياق أطول وقدرات
  محسّنة في الاستدلال والترميز والرياضيات.
cover: assets.zilliz.com/Deep_Seek_V3_0324_033f6ff001.png
tag: Engineering
tags: 'DeepSeek V3-0324, DeepSeek V3, Milvus, RAG'
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/deepseek-v3-0324-minor-update-thats-crushing-top-ai-models.md
---
<p>أسقط DeepSeek بهدوء قنبلة الليلة الماضية. فقد تم التقليل من أهمية الإصدار الأخير،<a href="https://huggingface.co/deepseek-ai/DeepSeek-V3-0324"> DeepSeek v3-0324،</a> في الإعلان الرسمي على أنه مجرد <strong>"ترقية طفيفة"</strong> بدون تغييرات في واجهة برمجة التطبيقات. لكن اختبارنا المكثف في <a href="https://zilliz.com/">Zilliz</a> كشف عن شيء أكثر أهمية: يمثل هذا التحديث قفزة نوعية في الأداء، خاصةً في التفكير المنطقي والبرمجة وحل المشكلات الرياضية.</p>
<p>ما نراه ليس مجرد تحسينات تدريجية - إنه تحول أساسي يضع DeepSeek v3-0324 بين نخبة النماذج اللغوية. وهو مفتوح المصدر.</p>
<p><strong>يستحق هذا الإصدار اهتمامك الفوري للمطورين والمؤسسات التي تبني تطبيقات مدعومة بالذكاء الاصطناعي.</strong></p>
<h2 id="Whats-New-in-DeepSeek-v3-0324-and-How-Good-Is-It-Really" class="common-anchor-header">ما الجديد في الإصدار DeepSeek v3-0324 وما مدى جودته حقاً؟<button data-href="#Whats-New-in-DeepSeek-v3-0324-and-How-Good-Is-It-Really" class="anchor-icon" translate="no">
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
    </button></h2><p>يقدم الإصدار DeepSeek v3-0324 ثلاثة تحسينات رئيسية مقارنةً بسابقه <a href="https://zilliz.com/blog/why-deepseek-v3-is-taking-the-ai-world-by-storm">DeepSeek v3</a>:</p>
<ul>
<li><p><strong>نموذج أكبر، قوة أكبر:</strong> زاد عدد المعلمات من 671 مليار إلى 685 مليار، مما يسمح للنموذج بالتعامل مع تفكير أكثر تعقيداً وتوليد استجابات أكثر دقة.</p></li>
<li><p><strong>نافذة سياق ضخمة:</strong> مع ترقية طول سياق الرمز الرمزي الذي يبلغ 128 ألف، يمكن ل DeepSeek v3-0324 الاحتفاظ بالمزيد من المعلومات ومعالجتها في استعلام واحد، مما يجعله مثاليًا للمحادثات الطويلة وتحليل المستندات وتطبيقات الذكاء الاصطناعي القائمة على الاسترجاع.</p></li>
<li><p><strong>تحسين الاستدلال والترميز والرياضيات:</strong> يجلب هذا التحديث تعزيزًا ملحوظًا في قدرات المنطق والبرمجة والرياضيات، مما يجعله منافسًا قويًا في الترميز بمساعدة الذكاء الاصطناعي والبحث العلمي وحل المشكلات على مستوى المؤسسات.</p></li>
</ul>
<p>لكن الأرقام الأولية لا تروي القصة بأكملها. الأمر المثير للإعجاب حقاً هو كيف تمكن DeepSeek من تعزيز القدرة على التفكير وكفاءة التوليد في آن واحد - وهو أمر ينطوي عادةً على مقايضات هندسية.</p>
<h3 id="The-Secret-Sauce-Architectural-Innovation" class="common-anchor-header">الصلصة السرية: الابتكار المعماري</h3><p>تحت غطاء المحرك، يحتفظ DeepSeek v3-0324 ببنية <a href="https://arxiv.org/abs/2502.07864">الانتباه الكامن متعدد الرؤوس (MLA) </a>- وهي آلية فعالة تضغط ذاكرات التخزين المؤقت للقيمة الرئيسية (KV) باستخدام المتجهات الكامنة لتقليل استخدام الذاكرة والنفقات الحسابية أثناء الاستدلال. بالإضافة إلى ذلك، فهي تستبدل <a href="https://zilliz.com/glossary/feedforward-neural-networks-(fnn)">شبكات التغذية الأمامية</a> التقليدية <a href="https://zilliz.com/glossary/feedforward-neural-networks-(fnn)">(FFN)</a> بطبقات مزيج من الخبراء<a href="https://zilliz.com/learn/what-is-mixture-of-experts">(MoE</a>)، مما يحسّن كفاءة الحوسبة من خلال تنشيط أفضل الخبراء أداءً لكل رمز مميز بشكل ديناميكي.</p>
<p>ومع ذلك، فإن الترقية الأكثر إثارة هي <strong>التنبؤ متعدد الرموز (MTP)،</strong> والذي يسمح لكل رمز بالتنبؤ بعدة رموز مستقبلية في وقت واحد. يتغلب هذا على عنق الزجاجة الكبير في النماذج الانحدارية التلقائية التقليدية، مما يحسن الدقة وسرعة الاستدلال.</p>
<p>تخلق هذه الابتكارات معًا نموذجًا لا يتوسع بشكل جيد فحسب - بل يتوسع بذكاء، مما يجعل قدرات الذكاء الاصطناعي الاحترافية في متناول المزيد من فرق التطوير.</p>
<h2 id="Build-a-RAG-System-with-Milvus-and-DeepSeek-v3-0324-in-5-Minutes" class="common-anchor-header">بناء نظام RAG باستخدام Milvus و DeepSeek v3-0324 في 5 دقائق<button data-href="#Build-a-RAG-System-with-Milvus-and-DeepSeek-v3-0324-in-5-Minutes" class="anchor-icon" translate="no">
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
    </button></h2><p>إن قدرات الاستدلال القوية التي يتمتع بها DeepSeek v3-0324 تجعله مرشحًا مثاليًا لأنظمة الاسترجاع المعزز (RAG). في هذا البرنامج التعليمي، سنوضح لك في هذا البرنامج التعليمي كيفية إنشاء خط أنابيب RAG كامل باستخدام DeepSeek v3-0324 وقاعدة بيانات <a href="https://zilliz.com/what-is-milvus">Milvus</a> vector في خمس دقائق فقط. ستتعلم كيفية استرجاع المعرفة وتوليفها بكفاءة مع الحد الأدنى من الإعداد.</p>
<h3 id="Setting-Up-Your-Environment" class="common-anchor-header">إعداد بيئتك</h3><p>أولاً، لنقم بتثبيت التبعيات الضرورية:</p>
<pre><code translate="no">! pip install --upgrade pymilvus[model] openai requests tqdm
<button class="copy-code-btn"></button></code></pre>
<p><strong>ملاحظة:</strong> إذا كنت تستخدم Google Colab، ستحتاج إلى إعادة تشغيل وقت التشغيل بعد تثبيت هذه الحزم. انقر على قائمة "وقت التشغيل" في أعلى الشاشة وحدد "إعادة تشغيل الجلسة" من القائمة المنسدلة.</p>
<p>بما أن DeepSeek يوفر واجهة برمجة تطبيقات متوافقة مع OpenAI، ستحتاج إلى مفتاح API. يمكنك الحصول على واحد من خلال التسجيل في<a href="https://platform.deepseek.com/api_keys"> منصة DeepSeek</a>:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os

os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;DEEPSEEK_API_KEY&quot;</span>] = <span class="hljs-string">&quot;***********&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Preparing-Your-Data" class="common-anchor-header">إعداد بياناتك</h3><p>بالنسبة لهذا البرنامج التعليمي، سنستخدم صفحات الأسئلة الشائعة من <a href="https://github.com/milvus-io/milvus-docs/releases/download/v2.4.6-preview/milvus_docs_2.4.x_en.zip">وثائق ميلفوس 2.4.x</a> كمصدر معرفتنا:</p>
<pre><code translate="no">! wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
! unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs
<button class="copy-code-btn"></button></code></pre>
<p>والآن، لنقم بتحميل وإعداد محتوى الأسئلة الشائعة من ملفات تخفيض السعر:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob

<span class="hljs-comment"># Load all markdown files from the FAQ directory</span>
text_lines = []
<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()
        <span class="hljs-comment"># Split on headings to separate content sections</span>
        text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Setting-Up-the-Language-and-Embedding-Models" class="common-anchor-header">إعداد اللغة وتضمين النماذج</h3><p>سنستخدم <a href="https://openrouter.ai/">OpenRouter</a> للوصول إلى DeepSeek v3-0324. يوفر OpenRouter واجهة برمجة تطبيقات موحدة لنماذج ذكاء اصطناعي متعددة، مثل DeepSeek و Claude. من خلال إنشاء مفتاح DeepSeek V3 API مجاني على OpenRouter، يمكنك بسهولة تجربة DeepSeek V3 0324.</p>
<p>https://assets.zilliz.com/Setting_Up_the_Language_and_Embedding_Models_8b00595a6b.png</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAI</span>

deepseek_client = <span class="hljs-title class_">OpenAI</span>(
   api_key=<span class="hljs-string">&quot;&lt;OPENROUTER_API_KEY&gt;&quot;</span>,
   base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>بالنسبة لتضمين النصوص، سنستخدم <a href="https://milvus.io/docs/embeddings.md">نموذج التضمين المدمج في</a> Milvus، وهو نموذج خفيف الوزن وفعال:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model <span class="hljs-keyword">as</span> milvus_model

<span class="hljs-comment"># Initialize the embedding model</span>
embedding_model = milvus_model.DefaultEmbeddingFunction()

<span class="hljs-comment"># Test the embedding model</span>
test_embedding = embedding_model.encode_queries([<span class="hljs-string">&quot;This is a test&quot;</span>])[<span class="hljs-number">0</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embedding)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Embedding dimension: <span class="hljs-subst">{embedding_dim}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;First 10 values: <span class="hljs-subst">{test_embedding[:<span class="hljs-number">10</span>]}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Creating-a-Milvus-Collection" class="common-anchor-header">إنشاء مجموعة ميلفوس</h3><p>لنقم الآن بإعداد قاعدة بياناتنا المتجهة باستخدام Milvus:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

<span class="hljs-comment"># Initialize Milvus client (using Milvus Lite for simplicity)</span>
milvus_client = MilvusClient(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)
collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>

<span class="hljs-comment"># Remove existing collection if it exists</span>
<span class="hljs-keyword">if</span> milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)

<span class="hljs-comment"># Create a new collection</span>
milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;IP&quot;</span>,  <span class="hljs-comment"># Inner product distance</span>
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,  <span class="hljs-comment"># See https://milvus.io/docs/consistency.md for details</span>
)
<button class="copy-code-btn"></button></code></pre>
<p><strong>نصيحة احترافية</strong>: لسيناريوهات النشر المختلفة، يمكنك ضبط إعداد ميلفوس الخاص بك:</p>
<ul>
<li><p>للتطوير المحلي: استخدم <code translate="no">uri=&quot;./milvus.db&quot;</code> مع <a href="https://milvus.io/docs/milvus_lite.md">ميلفوس لايت</a></p></li>
<li><p>لمجموعات البيانات الكبيرة: قم بإعداد خادم Milvus عبر <a href="https://milvus.io/docs/quickstart.md">Docker/Kubernetes</a> واستخدمه <code translate="no">uri=&quot;http://localhost:19530&quot;</code></p></li>
<li><p>للإنتاج: استخدم<a href="https://zilliz.com/cloud"> Zilliz Cloud</a> مع نقطة النهاية السحابية ومفتاح API.</p></li>
</ul>
<h3 id="Loading-Data-into-Milvus" class="common-anchor-header">تحميل البيانات إلى ميلفوس</h3><p>لنقم بتحويل بياناتنا النصية إلى تضمينات وتخزينها في ميلفوس:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm

<span class="hljs-comment"># Create embeddings for all text chunks</span>
data = []
doc_embeddings = embedding_model.encode_documents(text_lines)

<span class="hljs-comment"># Create records with IDs, vectors, and text</span>
<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})

<span class="hljs-comment"># Insert data into Milvus</span>
milvus_client.insert(collection_name=collection_name, data=data)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">Creating embeddings:   0%|          | 0/72 [00:00&lt;?, ?it/s]huggingface/tokenizers: The current process just got forked, after parallelism has already been used. Disabling parallelism to avoid deadlocks...
To <span class="hljs-built_in">disable</span> this warning, you can either:
    - Avoid using `tokenizers` before the fork <span class="hljs-keyword">if</span> possible
    - Explicitly <span class="hljs-built_in">set</span> the environment variable TOKENIZERS_PARALLELISM=(<span class="hljs-literal">true</span> | <span class="hljs-literal">false</span>)
Creating embeddings: 100%|██████████| 72/72 [00:00&lt;00:00, 246522.36it/s]





{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Building-the-RAG-Pipeline" class="common-anchor-header">بناء خط أنابيب RAG</h3><h4 id="Step-1-Retrieve-Relevant-Information" class="common-anchor-header">الخطوة 1: استرجاع المعلومات ذات الصلة</h4><p>لنختبر نظام RAG الخاص بنا مع سؤال شائع:</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>

<span class="hljs-comment"># Search for relevant information</span>
search_res = milvus_client.search(
    collection_name=collection_name,
    data=embedding_model.encode_queries([question]),  <span class="hljs-comment"># Convert question to embedding</span>
    limit=<span class="hljs-number">3</span>,  <span class="hljs-comment"># Return top 3 results</span>
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},  <span class="hljs-comment"># Inner product distance</span>
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],  <span class="hljs-comment"># Return the text field</span>
)

<span class="hljs-comment"># Examine search results</span>
<span class="hljs-keyword">import</span> json
retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including [MinIO](https://min.io/), [AWS S3](https://aws.amazon.com/s3/?nc1=h_ls), [Google Cloud Storage](https://cloud.google.com/storage?hl=en#object-storage-for-companies-of-all-sizes) (GCS), [Azure Blob Storage](https://azure.microsoft.com/en-us/products/storage/blobs), [Alibaba Cloud OSS](https://www.alibabacloud.com/product/object-storage-service), and [Tencent Cloud Object Storage](https://www.tencentcloud.com/products/cos) (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        <span class="hljs-number">0.6572665572166443</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus flush data?\n\nMilvus returns success when inserted data are loaded to the message queue. However, the data are not yet flushed to the disk. Then Milvus&#x27; data node writes the data in the message queue to persistent storage as incremental logs. If `flush()` is called, the data node is forced to write all data in the message queue to persistent storage immediately.\n\n###&quot;</span>,
        <span class="hljs-number">0.6312146186828613</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus handle vector data types and precision?\n\nMilvus supports Binary, Float32, Float16, and BFloat16 vector types.\n\n- Binary vectors: Store binary data as sequences of 0s and 1s, used in image processing and information retrieval.\n- Float32 vectors: Default storage with a precision of about 7 decimal digits. Even Float64 values are stored with Float32 precision, leading to potential precision loss upon retrieval.\n- Float16 and BFloat16 vectors: Offer reduced precision and memory usage. Float16 is suitable for applications with limited bandwidth and storage, while BFloat16 balances range and efficiency, commonly used in deep learning to reduce computational requirements without significantly impacting accuracy.\n\n###&quot;</span>,
        <span class="hljs-number">0.6115777492523193</span>
    ]
]
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-2-Generate-a-Response-with-DeepSeek" class="common-anchor-header">الخطوة 2: إنشاء استجابة باستخدام DeepSeek</h4><p>لنستخدم الآن DeepSeek لتوليد استجابة بناءً على المعلومات المسترجعة:</p>
<pre><code translate="no"><span class="hljs-comment"># Combine retrieved text chunks</span>
context = <span class="hljs-string">&quot;\n&quot;</span>.join(
    [line_with_distance[<span class="hljs-number">0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)

<span class="hljs-comment"># Define prompts for the language model</span>
SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
You are an AI assistant. You are able to find answers to the questions from the contextual passage snippets provided.
&quot;&quot;&quot;</span>

USER_PROMPT = <span class="hljs-string">f&quot;&quot;&quot;
Use the following pieces of information enclosed in &lt;context&gt; tags to provide an answer to the question enclosed in &lt;question&gt; tags.

&lt;context&gt;
<span class="hljs-subst">{context}</span>
&lt;/context&gt;

&lt;question&gt;
<span class="hljs-subst">{question}</span>
&lt;/question&gt;
&quot;&quot;&quot;</span>

<span class="hljs-comment"># Generate response with DeepSeek</span>
response = deepseek_client.chat.completions.create(
    model=<span class="hljs-string">&quot;deepseek-chat&quot;</span>,
    messages=[
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT},
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT},
    ],
)

<span class="hljs-built_in">print</span>(response.choices[<span class="hljs-number">0</span>].message.content)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">In Milvus, data <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> two main categories: inserted data <span class="hljs-keyword">and</span> metadata.

<span class="hljs-number">1.</span> **Inserted Data**: This includes vector data, scalar data, <span class="hljs-keyword">and</span> collection-specific schema. The inserted data <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> incremental logs. Milvus supports various <span class="hljs-built_in">object</span> storage backends <span class="hljs-keyword">for</span> <span class="hljs-keyword">this</span> purpose, such <span class="hljs-keyword">as</span> MinIO, AWS S3, <span class="hljs-function">Google Cloud <span class="hljs-title">Storage</span> (<span class="hljs-params">GCS</span>), Azure Blob Storage, Alibaba Cloud OSS, <span class="hljs-keyword">and</span> Tencent Cloud Object <span class="hljs-title">Storage</span> (<span class="hljs-params">COS</span>).

2. **Metadata**: Metadata <span class="hljs-keyword">is</span> generated within Milvus <span class="hljs-keyword">and</span> <span class="hljs-keyword">is</span> specific to each Milvus module. This metadata <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> etcd, a distributed key-<span class="hljs-keyword">value</span> store.

Additionally, <span class="hljs-keyword">when</span> data <span class="hljs-keyword">is</span> inserted, it <span class="hljs-keyword">is</span> first loaded <span class="hljs-keyword">into</span> a message queue, <span class="hljs-keyword">and</span> Milvus returns success at <span class="hljs-keyword">this</span> stage. The data <span class="hljs-keyword">is</span> then written to persistent storage <span class="hljs-keyword">as</span> incremental logs <span class="hljs-keyword">by</span> the data node. If the `<span class="hljs-title">flush</span>()` function <span class="hljs-keyword">is</span> called, the data node <span class="hljs-keyword">is</span> forced to write all data <span class="hljs-keyword">in</span> the message queue to persistent storage immediately.
</span><button class="copy-code-btn"></button></code></pre>
<p>وها أنت ذا! لقد نجحت في بناء خط أنابيب RAG كامل باستخدام DeepSeek v3-0324 و Milvus. يمكن لهذا النظام الآن الإجابة على الأسئلة بناءً على وثائق Milvus بدقة عالية ووعي سياقي.</p>
<h2 id="Comparing-DeepSeek-V3-0324-Original-vs-RAG-Enhanced-Version" class="common-anchor-header">مقارنة DeepSeek-V3-0324: النسخة الأصلية مقابل النسخة المحسّنة من RAG<button data-href="#Comparing-DeepSeek-V3-0324-Original-vs-RAG-Enhanced-Version" class="anchor-icon" translate="no">
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
    </button></h2><p>النظرية شيء، ولكن الأداء في العالم الحقيقي هو المهم. لقد اختبرنا كلاً من DeepSeek v3-0324 القياسي (مع تعطيل "التفكير العميق") ونسختنا المحسّنة من RAG بنفس المطالبة: <em>اكتب كود HTML لإنشاء موقع ويب خيالي عن ميلفوس.</em></p>
<h3 id="Website-Built-with-The-Standard-Models-Output-Code" class="common-anchor-header">موقع الويب الذي تم إنشاؤه باستخدام كود إخراج النموذج القياسي</h3><p>هذا ما يبدو عليه الموقع الإلكتروني:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Website_Built_with_The_Standard_Model_s_Output_Code_695902b18a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>على الرغم من جاذبيته البصرية، إلا أن المحتوى يعتمد بشكل كبير على الأوصاف العامة ويفتقد العديد من الميزات التقنية الأساسية لـ Milvus.</p>
<h3 id="Website-Built-with-Code-Generated-by-the-RAG-Enhanced-Version" class="common-anchor-header">موقع الويب الذي تم إنشاؤه باستخدام الكود الذي تم إنشاؤه بواسطة النسخة المحسنة من RAG</h3><p>عندما قمنا بدمج ميلفوس كقاعدة معرفية، كانت النتائج مختلفة بشكل كبير:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Website_2_01341c647c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>لا يبدو موقع الويب الأخير أفضل فحسب - بل يُظهر فهمًا حقيقيًا لبنية ميلفوس وحالات الاستخدام والمزايا التقنية.</p>
<h2 id="Can-DeepSeek-v3-0324-Replace-Dedicated-Reasoning-Models" class="common-anchor-header">هل يمكن أن يحل DeepSeek v3-0324 محل نماذج الاستدلال المخصصة؟<button data-href="#Can-DeepSeek-v3-0324-Replace-Dedicated-Reasoning-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>جاء اكتشافنا الأكثر إثارة للدهشة عند مقارنة DeepSeek v3-0324 بنماذج الاستدلال المتخصصة مثل Claude 3.7 Sonnet و GPT-4 Turbo عبر مهام الاستدلال الرياضي والمنطقي والرمزي.</p>
<p>في حين تتفوق نماذج التفكير المنطقي المتخصصة في حل المشكلات متعددة الخطوات، إلا أنها غالباً ما تفعل ذلك على حساب الكفاءة. أظهرت معاييرنا القياسية أن النماذج المخصصة للاستدلال المنطقي كثيراً ما تفرط في تحليل المطالبات البسيطة، مما يولد رموزاً أكثر من اللازم بمقدار 2-3 أضعاف، ويزيد بشكل كبير من زمن الاستجابة وتكاليف واجهة برمجة التطبيقات.</p>
<p>يتبع DeepSeek v3-0324 نهجًا مختلفًا. فهو يُظهر اتساقًا منطقيًا مماثلًا ولكن بإيجاز أكبر بشكل ملحوظ - غالبًا ما ينتج حلولًا صحيحة باستخدام رموز أقل بنسبة 40-60%. لا تأتي هذه الكفاءة على حساب الدقة؛ ففي اختبارات توليد التعليمات البرمجية التي أجريناها، كانت حلول DeepSeek تتطابق أو تتجاوز وظائف الحلول التي يقدمها المنافسون الذين يركزون على المنطق.</p>
<p>بالنسبة للمطوّرين الذين يوازنون بين الأداء وقيود الميزانية، تُترجم ميزة الكفاءة هذه مباشرةً إلى انخفاض تكاليف واجهة برمجة التطبيقات وأوقات استجابة أسرع - وهي عوامل حاسمة لتطبيقات الإنتاج حيث تتوقف تجربة المستخدم على السرعة المتصورة.</p>
<h2 id="The-Future-of-AI-Models-Blurring-the-Reasoning-Divide" class="common-anchor-header">مستقبل نماذج الذكاء الاصطناعي: طمس الفجوة المنطقية<button data-href="#The-Future-of-AI-Models-Blurring-the-Reasoning-Divide" class="anchor-icon" translate="no">
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
    </button></h2><p>يتحدى أداء DeepSeek v3-0324 افتراضًا أساسيًا في صناعة الذكاء الاصطناعي: أن التفكير المنطقي والكفاءة يمثلان مفاضلة لا مفر منها. وهذا يشير إلى أننا قد نقترب من نقطة انعطاف يبدأ فيها التمييز بين النماذج المنطقية وغير المنطقية في التلاشي.</p>
<p>قد يقوم مزودو الذكاء الاصطناعي الرائدون في نهاية المطاف بإلغاء هذا التمييز تمامًا، وتطوير نماذج تضبط عمق الاستدلال بشكل ديناميكي بناءً على تعقيد المهمة. من شأن هذا المنطق التكيفي أن يحسّن من الكفاءة الحسابية وجودة الاستجابة، مما قد يُحدث ثورة في كيفية بناء تطبيقات الذكاء الاصطناعي ونشرها.</p>
<p>بالنسبة للمطورين الذين يقومون ببناء أنظمة RAG، يعد هذا التطور بحلول أكثر فعالية من حيث التكلفة توفر عمق التفكير في النماذج المتميزة دون نفقاتها الحسابية - مما يوسع ما هو ممكن مع الذكاء الاصطناعي مفتوح المصدر.</p>
