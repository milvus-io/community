---
id: milvus-rustfs-vibe-coding-build-a-lightweight-rag-chatbot-from-scratch.md
title: 'ميلفوس + RustFS+ ترميز فيب فيب: بناء روبوت محادثة RAG خفيف الوزن من الصفر'
author: Jinghe Ma
date: 2026-3-10
cover: assets.zilliz.com/blog_Milvus_Rust_FS_Vibe_Coding_Chatbot_7_f25795481e.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, RustFS, RAG chatbot,  vector database, S3-compatible object storage'
meta_keywords: 'Milvus, RustFS, RAG chatbot,  vector database, S3-compatible object storage'
meta_title: |
  Milvus + RustFS: Build a Lightweight RAG Chatbot
desc: >-
  أنشئ روبوت محادثة RAG خفيف الوزن باستخدام Milvus و RustFS و FastAPI و Next.js
  باستخدام مستندات RustFS كقاعدة معرفية.
origin: >-
  https://milvus.io/blog/milvus-rustfs-vibe-coding-build-a-lightweight-rag-chatbot-from-scratch.md
---
<p><em>ساهم في هذه المدونة جينغي ما، أحد المساهمين في مجتمع</em><em> ميلفوس،</em> <em>وتنشر هنا بإذن.</em></p>
<p>أردتُ روبوت محادثة يمكنه الإجابة عن الأسئلة الواردة في الوثائق الخاصة بي، وأردتُ تحكماً كاملاً في المكدس الذي يقف خلفه - من تخزين الكائنات إلى واجهة الدردشة. قادني ذلك إلى إنشاء روبوت محادثة RAG خفيف الوزن باستخدام <a href="https://milvus.io/">Milvus</a> و <a href="https://rustfs.com/">RustFS</a> في الأساس.</p>
<p><a href="https://milvus.io/">Milvus</a> هو قاعدة البيانات المتجهة مفتوحة المصدر الأكثر اعتمادًا على نطاق واسع لبناء تطبيقات RAG. وهو يفصل الحوسبة عن التخزين، ويحتفظ بالبيانات الساخنة في الذاكرة أو على SSD للبحث السريع مع الاعتماد على تخزين الكائنات في الأسفل لإدارة البيانات القابلة للتطوير والفعالة من حيث التكلفة. ولأنها تعمل مع التخزين المتوافق مع S3، فقد كانت مناسبة بشكل طبيعي لهذا المشروع.</p>
<p>بالنسبة لطبقة التخزين، اخترتُ <a href="https://rustfs.com/">RustFS،</a> وهو نظام تخزين كائنات متوافق مع S3 مفتوح المصدر ومكتوب بلغة Rust. يمكن نشره عبر مخطط ثنائي أو Docker أو Helm. على الرغم من أنه لا يزال في مرحلة ألفا ولا يوصى به لأحمال عمل الإنتاج، إلا أنه كان مستقرًا بما يكفي لهذا البناء.</p>
<p>بمجرد إنشاء البنية التحتية، كنت بحاجة إلى قاعدة معرفية للاستعلام عنها. كانت وثائق RustFS - حوالي 80 ملف Markdown - نقطة انطلاق مناسبة. قمتُ بتقطيع المستندات وإنشاء التضمينات وتخزينها في Milvus، ثم قمتُ بترميز الباقي: <a href="https://fastapi.tiangolo.com/">FastAPI</a> للواجهة الخلفية و <a href="https://nextjs.org/">Next.js</a> لواجهة الدردشة.</p>
<p>في هذا المنشور، سأغطي النظام الكامل من البداية إلى النهاية. الكود متاح على https://github.com/majinghe/chatbot. إنه نموذج أولي عامل وليس نظامًا جاهزًا للإنتاج، ولكن الهدف هو توفير بنية واضحة وقابلة للتوسيع يمكنك تكييفها لاستخدامك الخاص. يستعرض كل قسم أدناه طبقة واحدة، من البنية التحتية إلى الواجهة الأمامية.</p>
<h2 id="Installing-Milvus-and-RustFS-with-Docker-Compose" class="common-anchor-header">تثبيت Milvus و RustFS مع Docker Compose<button data-href="#Installing-Milvus-and-RustFS-with-Docker-Compose" class="anchor-icon" translate="no">
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
    </button></h2><p>لنبدأ بتثبيت <a href="https://milvus.io/">Milvus</a> و <a href="https://rustfs.com/">RustFS</a>.</p>
<p>يمكن أن يعمل Milvus مع أي تخزين كائن متوافق مع S3، على الرغم من أن MinIO هي الواجهة الخلفية الافتراضية في الإعداد القياسي. بما أن MinIO لم تعد تقبل مساهمات المجتمع، سنستبدلها ب RustFS في هذا المثال.</p>
<p>لإجراء هذا التغيير، قم بتحديث تكوين تخزين الكائنات في configs/milvus.yaml داخل مستودع Milvus. يبدو القسم ذو الصلة بهذا الشكل:</p>
<pre><code translate="no"><span class="hljs-attr">minio</span>:
  <span class="hljs-attr">address</span>: <span class="hljs-attr">localhost</span>:<span class="hljs-number">9000</span>
  <span class="hljs-attr">port</span>: <span class="hljs-number">9000</span>
  <span class="hljs-attr">accessKeyID</span>: rustfsadmin
  <span class="hljs-attr">secretAccessKey</span>: rustfsadmin
  <span class="hljs-attr">useSSL</span>: <span class="hljs-literal">false</span>
  <span class="hljs-attr">bucketName</span>: <span class="hljs-string">&quot;rustfs-bucket&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>هناك طريقتان لتطبيق هذا التغيير:</p>
<ul>
<li><strong>تحميل ملف تكوين محلي.</strong> نسخ configs/milvus.yaml محليًا، وتحديث حقول MinIO للإشارة إلى RustFS، ثم تحميله في الحاوية عبر وحدة تخزين Docker.</li>
<li><strong>قم بالتصحيح عند بدء التشغيل باستخدام</strong> <strong>yq****.</strong> قم بتعديل أمر الحاوية لتشغيل yq مقابل /milvus/configs/milvus.yaml قبل بدء عملية Milvus.</li>
</ul>
<p>يستخدم هذا البناء النهج الأول. تحصل خدمة Milvus في docker-compose.yml على إدخال وحدة تخزين إضافية:</p>
<pre><code translate="no">- <span class="hljs-variable">${DOCKER_VOLUME_DIRECTORY:-.}</span>/volumes/milvus/milvus.yaml:/milvus/configs/milvus.yaml:ro
<button class="copy-code-btn"></button></code></pre>
<h3 id="The-Docker-Compose-Setup" class="common-anchor-header">إعداد Docker-compose</h3><p>يقوم docker-compose.yml الكامل بتشغيل أربع خدمات.</p>
<p><strong>إلخd</strong> - يعتمد ميلفوس على إلخd لتخزين البيانات الوصفية:</p>
<pre><code translate="no">etcd:
    container_name: milvus-etcd
    image: quay.io/coreos/etcd:v3.5.18
    environment:
      - ETCD_AUTO_COMPACTION_MODE=revision
      - ETCD_AUTO_COMPACTION_RETENTION=1000
      - ETCD_QUOTA_BACKEND_BYTES=4294967296
      - ETCD_SNAPSHOT_COUNT=50000
    volumes:
      - <span class="hljs-variable">${DOCKER_VOLUME_DIRECTORY:-.}</span>/volumes/etcd:/etcd
    <span class="hljs-built_in">command</span>: etcd -advertise-client-urls=http://etcd:2379 -listen-client-urls http://0.0.0.0:2379 --data-dir /etcd
    healthcheck:
      <span class="hljs-built_in">test</span>: [<span class="hljs-string">&quot;CMD&quot;</span>, <span class="hljs-string">&quot;etcdctl&quot;</span>, <span class="hljs-string">&quot;endpoint&quot;</span>, <span class="hljs-string">&quot;health&quot;</span>]
      interval: 30s
      <span class="hljs-built_in">timeout</span>: 20s
      retries: 3
<button class="copy-code-btn"></button></code></pre>
<p><strong>Attu</strong> - واجهة مستخدم مرئية لميلفوس، تم تطويرها ومفتوحة المصدر من قبل Zilliz (ملاحظة: الإصدارات بعد 2.6 مغلقة المصدر):</p>
<pre><code translate="no">  attu:
    container_name: milvus-attu
    image: zilliz/attu:v2.6
    environment:
      - MILVUS_URL=milvus-standalone:19530
    ports:
      - <span class="hljs-string">&quot;8000:3000&quot;</span>
    restart: unless-stopped
<button class="copy-code-btn"></button></code></pre>
<p><strong>RustFS</strong> - الواجهة الخلفية لتخزين الكائنات:</p>
<pre><code translate="no">rustfs:
    container_name: milvus-rustfs
    image: rustfs/rustfs:1.0.0-alpha.58
    environment:
      - RUSTFS_VOLUMES=/data/rustfs0,/data/rustfs1,/data/rustfs2,/data/rustfs3
      - RUSTFS_ADDRESS=0.0.0.0:9000
      - RUSTFS_CONSOLE_ADDRESS=0.0.0.0:9001
      - RUSTFS_CONSOLE_ENABLE=<span class="hljs-literal">true</span>
      - RUSTFS_EXTERNAL_ADDRESS=:9000  <span class="hljs-comment"># Same as internal since no port mapping</span>
      - RUSTFS_CORS_ALLOWED_ORIGINS=*
      - RUSTFS_CONSOLE_CORS_ALLOWED_ORIGINS=*
      - RUSTFS_ACCESS_KEY=rustfsadmin
      - RUSTFS_SECRET_KEY=rustfsadmin
    ports:
      - <span class="hljs-string">&quot;9000:9000&quot;</span># S3 API port
      - <span class="hljs-string">&quot;9001:9001&quot;</span># Console port
    volumes:
      - rustfs_data_0:/data/rustfs0
      - rustfs_data_1:/data/rustfs1
      - rustfs_data_2:/data/rustfs2
      - rustfs_data_3:/data/rustfs3
      - logs_data:/app/logs
    restart: unless-stopped
    healthcheck:
      <span class="hljs-built_in">test</span>:
        [
          <span class="hljs-string">&quot;CMD&quot;</span>,
          <span class="hljs-string">&quot;sh&quot;</span>, <span class="hljs-string">&quot;-c&quot;</span>,
          <span class="hljs-string">&quot;curl -f http://localhost:9000/health &amp;&amp; curl -f http://localhost:9001/health&quot;</span>
        ]
      interval: 30s
      <span class="hljs-built_in">timeout</span>: 10s
      retries: 3
      start_period: 40s
<button class="copy-code-btn"></button></code></pre>
<p><strong>ميلفوس</strong> - يعمل في الوضع المستقل:</p>
<pre><code translate="no">  standalone:
    container_name: milvus-standalone
    image: milvusdb/milvus:v2.6.0
    <span class="hljs-built_in">command</span>: [<span class="hljs-string">&quot;milvus&quot;</span>, <span class="hljs-string">&quot;run&quot;</span>, <span class="hljs-string">&quot;standalone&quot;</span>]
    security_opt:
    - seccomp:unconfined
    environment:
      ETCD_ENDPOINTS: etcd:2379
      MINIO_ADDRESS: rustfs:9000
      MQ_TYPE: woodpecker
    volumes:
      - <span class="hljs-variable">${DOCKER_VOLUME_DIRECTORY:-.}</span>/volumes/milvus:/var/lib/milvus
      - <span class="hljs-variable">${DOCKER_VOLUME_DIRECTORY:-.}</span>/volumes/milvus/milvus.yaml:/milvus/configs/milvus.yaml:ro
    healthcheck:
      <span class="hljs-built_in">test</span>: [<span class="hljs-string">&quot;CMD&quot;</span>, <span class="hljs-string">&quot;curl&quot;</span>, <span class="hljs-string">&quot;-f&quot;</span>, <span class="hljs-string">&quot;http://localhost:9091/healthz&quot;</span>]
      interval: 30s
      start_period: 90s
      <span class="hljs-built_in">timeout</span>: 20s
      retries: 3
    ports:
      - <span class="hljs-string">&quot;19530:19530&quot;</span>
      - <span class="hljs-string">&quot;9091:9091&quot;</span>
    depends_on:
      - <span class="hljs-string">&quot;etcd&quot;</span>
      - <span class="hljs-string">&quot;rustfs&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Starting-Everything" class="common-anchor-header">بدء تشغيل كل شيء</h3><p>بمجرد الانتهاء من التهيئة، قم بتشغيل جميع الخدمات الأربع:</p>
<pre><code translate="no">docker compose -f docker-compose.yml up -d
<button class="copy-code-btn"></button></code></pre>
<p>يمكنك التحقق من تشغيل كل شيء باستخدام:</p>
<pre><code translate="no">docker ps
CONTAINER ID   IMAGE                                             COMMAND                  CREATED          STATUS                      PORTS                                                                                      NAMES
4404b5cc6f7e   milvusdb/milvus:v2.6.0                            <span class="hljs-string">&quot;/tini -- milvus run…&quot;</span>   53 minutes ago   Up 53 minutes (healthy)     0.0.0.0:9091-&gt;9091/tcp, :::9091-&gt;9091/tcp, 0.0.0.0:19530-&gt;19530/tcp, :::19530-&gt;19530/tcp   milvus-standalone
40ddc8ed08bb   zilliz/attu:v2.6                                  <span class="hljs-string">&quot;docker-entrypoint.s…&quot;</span>   53 minutes ago   Up 53 minutes               0.0.0.0:8000-&gt;3000/tcp, :::8000-&gt;3000/tcp                                                  milvus-attu
3d2c8d80a8ce   quay.io/coreos/etcd:v3.5.18                       <span class="hljs-string">&quot;etcd -advertise-cli…&quot;</span>   53 minutes ago   Up 53 minutes (healthy)     2379-2380/tcp                                                                              milvus-etcd
d760f6690ea7   rustfs/rustfs:1.0.0-alpha.58                      <span class="hljs-string">&quot;/entrypoint.sh rust…&quot;</span>   53 minutes ago   Up 53 minutes (unhealthy)   0.0.0.0:9000-9001-&gt;9000-9001/tcp, :::9000-9001-&gt;9000-9001/tcp                              milvus-rustfs
<button class="copy-code-btn"></button></code></pre>
<p>بعد تشغيل جميع الحاويات الأربع، تكون خدماتك متاحة على</p>
<ul>
<li><strong>ميلفوس:</strong> <ip>:19530</li>
<li><strong>RustFS:</strong> <ip>:9000</li>
<li><strong>أتو:</strong> <ip>:8000</li>
</ul>
<h2 id="Vectorizing-the-RustFS-Docs-and-Storing-Embeddings-in-Milvus" class="common-anchor-header">توجيه مستندات RustFS وتخزين التضمينات في Milvus<button data-href="#Vectorizing-the-RustFS-Docs-and-Storing-Embeddings-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>مع تشغيل Milvus و RustFS، فإن الخطوة التالية هي بناء القاعدة المعرفية. المادة المصدرية هي وثائق RustFS الصينية: 80 ملف Markdown التي ستقوم بتقطيعها وتضمينها وتخزينها في Milvus.</p>
<h3 id="Reading-and-Chunking-the-Docs" class="common-anchor-header">قراءة المستندات وتقطيعها</h3><p>يقرأ النص البرمجي بشكل متكرر كل ملف .md في مجلد المستندات، ثم يقسم محتوى كل ملف إلى أجزاء حسب السطر الجديد:</p>
<pre><code translate="no"><span class="hljs-comment"># 3. Read Markdown files</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">load_markdown_files</span>(<span class="hljs-params">folder</span>):
    files = glob.glob(os.path.join(folder, <span class="hljs-string">&quot;**&quot;</span>, <span class="hljs-string">&quot;*.md&quot;</span>), recursive=<span class="hljs-literal">True</span>)
    docs = []
    <span class="hljs-keyword">for</span> f <span class="hljs-keyword">in</span> files:
        <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(f, <span class="hljs-string">&quot;r&quot;</span>, encoding=<span class="hljs-string">&quot;utf-8&quot;</span>) <span class="hljs-keyword">as</span> fp:
            docs.append(fp.read())
    <span class="hljs-keyword">return</span> docs

<span class="hljs-comment"># 4. Split documents (simple paragraph-based splitting)</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">split_into_chunks</span>(<span class="hljs-params">text, max_len=<span class="hljs-number">500</span></span>):
    chunks, current = [], []
    <span class="hljs-keyword">for</span> line <span class="hljs-keyword">in</span> text.split(<span class="hljs-string">&quot;\n&quot;</span>):
        <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(<span class="hljs-string">&quot; &quot;</span>.join(current)) + <span class="hljs-built_in">len</span>(line) &lt; max_len:
            current.append(line)
        <span class="hljs-keyword">else</span>:
            chunks.append(<span class="hljs-string">&quot; &quot;</span>.join(current))
            current = [line]
    <span class="hljs-keyword">if</span> current:
        chunks.append(<span class="hljs-string">&quot; &quot;</span>.join(current))
    <span class="hljs-keyword">return</span> chunks
<button class="copy-code-btn"></button></code></pre>
<p>استراتيجية التقطيع هذه بسيطة عن قصد. إذا كنت تريد تحكمًا أكثر إحكامًا - التقسيم على الرؤوس أو الحفاظ على كتل التعليمات البرمجية أو تداخل الأجزاء لاسترجاع أفضل - فهذا هو المكان المناسب للتكرار.</p>
<h3 id="Embedding-the-Chunks" class="common-anchor-header">تضمين القطع</h3><p>بعد أن تكون القطع جاهزة، يمكنك تضمينها باستخدام نموذج التضمين النصي 3 الكبير في OpenAI، والذي يُخرج متجهات ذات 3072 بُعدًا:</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">embed_texts</span>(<span class="hljs-params">texts</span>):
    response = client.embeddings.create(
        model=<span class="hljs-string">&quot;text-embedding-3-large&quot;</span>,
        <span class="hljs-built_in">input</span>=texts
    )
    <span class="hljs-keyword">return</span> [d.embedding <span class="hljs-keyword">for</span> d <span class="hljs-keyword">in</span> response.data]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Storing-Embeddings-in-Milvus" class="common-anchor-header">تخزين التضمينات في ميلفوس</h3><p>ينظّم ميلفوس البيانات في مجموعات، كل منها محدد بمخطط. هنا، يقوم كل سجل بتخزين جزء النص الخام إلى جانب متجه التضمين الخاص به:</p>
<pre><code translate="no"><span class="hljs-comment"># Connect to Milvus</span>
connections.connect(<span class="hljs-string">&quot;default&quot;</span>, host=<span class="hljs-string">&quot;ip&quot;</span>, port=<span class="hljs-string">&quot;19530&quot;</span>)

<span class="hljs-comment"># Define the schema</span>
fields = [
    FieldSchema(name=<span class="hljs-string">&quot;id&quot;</span>, dtype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">True</span>),
    FieldSchema(name=<span class="hljs-string">&quot;content&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">2000</span>),
    FieldSchema(name=<span class="hljs-string">&quot;embedding&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">3072</span>),
]
schema = CollectionSchema(fields, description=<span class="hljs-string">&quot;Markdown docs collection&quot;</span>)

<span class="hljs-comment"># Create the collection</span>
<span class="hljs-keyword">if</span> utility.has_collection(<span class="hljs-string">&quot;docs_collection&quot;</span>):
    utility.drop_collection(<span class="hljs-string">&quot;docs_collection&quot;</span>)

collection = Collection(name=<span class="hljs-string">&quot;docs_collection&quot;</span>, schema=schema)

<span class="hljs-comment"># Insert data</span>
collection.insert([all_chunks, embeddings])
collection.flush()
<button class="copy-code-btn"></button></code></pre>
<p>بمجرد اكتمال الإدراج، يمكنك التحقق من المجموعة في أتو على <ip>:8000 - يجب أن ترى مجموعة docs_collection مدرجة ضمن المجموعات.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Milvus_Rust_FS_Vibe_Coding_Chatbot_2_a787e96076.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>يمكنك أيضًا التحقق من RustFS على <ip>:9000 للتأكد من أن البيانات الأساسية هبطت في مخزن الكائنات.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Milvus_Rust_FS_Vibe_Coding_Chatbot_6_0e6d8c9471.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Building-a-RAG-Pipeline-with-Milvus-and-OpenAI’s-GPT-5" class="common-anchor-header">بناء خط أنابيب RAG مع Milvus و OpenAI's GPT-5<button data-href="#Building-a-RAG-Pipeline-with-Milvus-and-OpenAI’s-GPT-5" class="anchor-icon" translate="no">
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
    </button></h2><p>مع التضمينات المخزنة في Milvus، لديك كل ما تحتاجه لبناء خط أنابيب RAG. التدفق هو: تضمين استعلام المستخدم، واسترداد الأجزاء الأكثر تشابهًا من الناحية الدلالية من Milvus، وتجميع المطالبة، واستدعاء GPT-5، يستخدم الإنشاء هنا GPT-5 الخاص ب OpenAI، ولكن أي نموذج قادر على الدردشة يعمل هنا - طبقة الاسترجاع هي ما يهم، ويتعامل Milvus مع ذلك بغض النظر عن النموذج الذي يولد الإجابة النهائية.</p>
<pre><code translate="no"><span class="hljs-comment"># 1. Embed the query</span>
query_embedding = embed_texts(query)

<span class="hljs-comment"># 2. Retrieve similar documents from Milvus</span>
    search_params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}}
    results = collection.search(
        data=[query_embedding],
        anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
        param=search_params,
        limit=<span class="hljs-number">3</span>,
        output_fields=[<span class="hljs-string">&quot;content&quot;</span>]
    )

docs = [hit.entity.get(<span class="hljs-string">&quot;text&quot;</span>) <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]]

<span class="hljs-comment"># 3. Assemble the RAG prompt</span>
prompt = <span class="hljs-string">f&quot;You are a RustFS expert. Answer the question based on the following documents:\n\n<span class="hljs-subst">{docs}</span>\n\nUser question: <span class="hljs-subst">{query}</span>&quot;</span>

<span class="hljs-comment"># 4. Call the LLM</span>
    response = client.chat.completions.create(
        model=<span class="hljs-string">&quot;gpt-5&quot;</span>, <span class="hljs-comment"># swap to any OpenAI model, or replace this call with another LLM provider</span>
        messages=[{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: prompt}],
        <span class="hljs-comment"># max_tokens=16384,</span>
        <span class="hljs-comment"># temperature=1.0,</span>
        <span class="hljs-comment"># top_p=1.0,</span>
    )

    answer = response.choices[<span class="hljs-number">0</span>].message.content

    <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;answer&quot;</span>: answer, <span class="hljs-string">&quot;sources&quot;</span>: docs}
<button class="copy-code-btn"></button></code></pre>
<p>لاختباره، قم بتشغيل استعلام:</p>
<pre><code translate="no"><span class="hljs-title class_">How</span> <span class="hljs-keyword">do</span> I install <span class="hljs-title class_">RustFS</span> <span class="hljs-keyword">in</span> <span class="hljs-title class_">Docker</span>?
<button class="copy-code-btn"></button></code></pre>
<p>نتائج الاستعلام:  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Milvus_Rust_FS_Vibe_Coding_Chatbot_5_2cd609c90c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Milvus_Rust_FS_Vibe_Coding_Chatbot_3_18f4476b7a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>تغليف كل شيء في FastAPI + Next.js Chatbot</p>
<p>يعمل خط أنابيب RAG، ولكن تشغيل برنامج Python النصي في كل مرة تريد فيها طرح سؤال يتعارض مع الغرض. لذا طلبت من الذكاء الاصطناعي اقتراح مكدس. وكانت الإجابة: <strong>FastAPI</strong> للواجهة الخلفية - كود RAG هو بالفعل Python، لذا فإن تغليفه في نقطة نهاية FastAPI هو الأنسب الطبيعي - و <strong>Next.js</strong> للواجهة الأمامية. يُظهر FastAPI منطق RAG كنقطة نهاية HTTP؛ يستدعيه Next.js ويعرض الاستجابة في نافذة دردشة.</p>
<h3 id="FastAPI-Backend" class="common-anchor-header">الواجهة الخلفية ل FastAPI</h3><p>يغلف FastAPI منطق RAG في نقطة نهاية POST واحدة. يمكن لأي عميل الآن الاستعلام عن قاعدة معارفك بطلب JSON:</p>
<pre><code translate="no">app = FastAPI()

<span class="hljs-meta">@app.post(<span class="hljs-params"><span class="hljs-string">&quot;/chat&quot;</span></span>)</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">chat</span>(<span class="hljs-params">req: ChatRequest</span>):
    query = req.query

......
<button class="copy-code-btn"></button></code></pre>
<p>ابدأ تشغيل الخادم بـ</p>
<pre><code translate="no">uvicorn main:app --reload --host <span class="hljs-number">0.0</span><span class="hljs-number">.0</span><span class="hljs-number">.0</span> --port <span class="hljs-number">9999</span>
INFO:     Will watch <span class="hljs-keyword">for</span> changes <span class="hljs-keyword">in</span> these directories: [<span class="hljs-string">&#x27;/home/xiaomage/milvus/chatbot/.venv&#x27;</span>]
INFO:     Uvicorn running <span class="hljs-keyword">on</span> http:<span class="hljs-comment">//0.0.0.0:9999 (Press CTRL+C to quit)</span>
INFO:     Started reloader process [<span class="hljs-number">2071374</span>] <span class="hljs-keyword">using</span> WatchFiles
INFO:     Started server process [<span class="hljs-number">2071376</span>]
INFO:     Waiting <span class="hljs-keyword">for</span> application startup.
INFO:     Application startup complete.
<button class="copy-code-btn"></button></code></pre>
<h3 id="Nextjs-Frontend" class="common-anchor-header">الواجهة الأمامية Next.js</h3><p>ترسل الواجهة الأمامية استعلام المستخدم إلى نقطة نهاية FastAPI وتعرض الاستجابة. منطق الجلب الأساسي:</p>
<p>جافا سكريبت</p>
<pre><code translate="no">   <span class="hljs-keyword">try</span> {
      <span class="hljs-keyword">const</span> res = <span class="hljs-keyword">await</span> <span class="hljs-title function_">fetch</span>(<span class="hljs-string">&#x27;http://localhost:9999/chat&#x27;</span>, {
        <span class="hljs-attr">method</span>: <span class="hljs-string">&#x27;POST&#x27;</span>,
        <span class="hljs-attr">headers</span>: { <span class="hljs-string">&#x27;Content-Type&#x27;</span>: <span class="hljs-string">&#x27;application/json&#x27;</span> },
        <span class="hljs-attr">body</span>: <span class="hljs-title class_">JSON</span>.<span class="hljs-title function_">stringify</span>({ <span class="hljs-attr">query</span>: input }),
      });

      <span class="hljs-keyword">const</span> data = <span class="hljs-keyword">await</span> res.<span class="hljs-title function_">json</span>();
      <span class="hljs-keyword">const</span> <span class="hljs-attr">botMessage</span>: <span class="hljs-title class_">Message</span> = { <span class="hljs-attr">role</span>: <span class="hljs-string">&#x27;bot&#x27;</span>, <span class="hljs-attr">content</span>: data.<span class="hljs-property">answer</span> || <span class="hljs-string">&#x27;No response&#x27;</span> };
      <span class="hljs-title function_">setMessages</span>(<span class="hljs-function"><span class="hljs-params">prev</span> =&gt;</span> [...prev, userMessage, botMessage]);
    } <span class="hljs-keyword">catch</span> (error) {
      <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">error</span>(error);
      <span class="hljs-keyword">const</span> <span class="hljs-attr">botMessage</span>: <span class="hljs-title class_">Message</span> = { <span class="hljs-attr">role</span>: <span class="hljs-string">&#x27;bot&#x27;</span>, <span class="hljs-attr">content</span>: <span class="hljs-string">&#x27;Error connecting to server.&#x27;</span> };
      <span class="hljs-title function_">setMessages</span>(<span class="hljs-function"><span class="hljs-params">prev</span> =&gt;</span> [...prev, botMessage]);
    } <span class="hljs-keyword">finally</span> {
      <span class="hljs-title function_">setLoading</span>(<span class="hljs-literal">false</span>);
    }
<button class="copy-code-btn"></button></code></pre>
<p>ابدأ الواجهة الأمامية بـ</p>
<pre><code translate="no">pnpm run dev -H <span class="hljs-number">0.0</span><span class="hljs-number">.0</span><span class="hljs-number">.0</span> -p <span class="hljs-number">3000</span>

&gt; rag-chatbot@<span class="hljs-number">0.1</span><span class="hljs-number">.0</span> dev /home/xiaomage/milvus/chatbot-web/rag-chatbot
&gt; next dev --turbopack -H <span class="hljs-number">0.0</span><span class="hljs-number">.0</span><span class="hljs-number">.0</span> -p <span class="hljs-number">3000</span>

   ▲ <span class="hljs-title class_">Next</span>.<span class="hljs-property">js</span> <span class="hljs-number">15.5</span><span class="hljs-number">.3</span> (<span class="hljs-title class_">Turbopack</span>)
   - <span class="hljs-title class_">Local</span>:        <span class="hljs-attr">http</span>:<span class="hljs-comment">//localhost:3000</span>
   - <span class="hljs-title class_">Network</span>:      <span class="hljs-attr">http</span>:<span class="hljs-comment">//0.0.0.0:3000</span>

 ✓ <span class="hljs-title class_">Starting</span>...
 ✓ <span class="hljs-title class_">Ready</span> <span class="hljs-keyword">in</span> 1288ms
<button class="copy-code-btn"></button></code></pre>
<p>افتح <code translate="no">http://&lt;ip&gt;:3000/chat</code> في متصفحك.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Milvus_Rust_FS_Vibe_Coding_Chatbot_1_0832811fc8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
اكتب سؤالاً:</p>
<pre><code translate="no"><span class="hljs-title class_">How</span> <span class="hljs-keyword">do</span> I install <span class="hljs-title class_">RustFS</span> <span class="hljs-keyword">in</span> <span class="hljs-title class_">Docker</span>?
<button class="copy-code-btn"></button></code></pre>
<p>استجابة واجهة الدردشة::</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Milvus_Rust_FS_Vibe_Coding_Chatbot_4_91d679ae50.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>وبذلك يكون روبوت الدردشة قد انتهى.</p>
<h2 id="Conclusion" class="common-anchor-header">الخلاصة<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>ما بدأ كفضول حول الواجهة الخلفية للتخزين في ميلفوس تحول إلى روبوت دردشة RAG يعمل بشكل كامل - وكان المسار من الأول إلى الآخر أقصر مما كان متوقعًا. إليك ما يغطيه الإنشاء، من النهاية إلى النهاية:</p>
<ul>
<li><strong><a href="http://milvus.io">Milvus</a></strong> <strong>+</strong> <strong><a href="https://rustfs.com/">RustFS</a></strong> <strong>مع Docker Compose.</strong> يعمل Milvus في الوضع المستقل مع RustFS كواجهة خلفية لتخزين الكائنات، ليحل محل MinIO الافتراضي. أربع خدمات إجمالاً: إلخd، وMilvus، وRustFS، وAtu.</li>
<li><strong>توجيه القاعدة المعرفية.</strong> وثائق RustFS - 80 ملف Markdown - يتم تجزئتها وتضمينها مع تضمين النص-تضمين 3 كبير وتخزينها في Milvus ك 466 ناقل.</li>
<li><strong>خط أنابيب RAG.</strong> في وقت الاستعلام، يتم تضمين سؤال المستخدم بنفس الطريقة، ويسترجع Milvus أكثر ثلاثة أجزاء متشابهة دلاليًا، ويُنشئ GPT-5 إجابةً ترتكز على تلك المستندات.</li>
<li><strong>واجهة مستخدم روبوت الدردشة الآلية.</strong> يغلّف FastAPI خط الأنابيب في نقطة نهاية POST واحدة؛ ويضع Next.js نافذة دردشة أمامها. لا مزيد من السقوط في محطة طرفية لطرح سؤال.</li>
</ul>
<p>بعض ما استخلصته من هذه العملية:</p>
<ul>
<li><strong><a href="https://milvus.io/docs">وثائق ميلفوس</a></strong> <strong>رائعة.</strong> خاصة أقسام النشر - واضحة وكاملة وسهلة المتابعة.</li>
<li><strong>من دواعي سروري العمل مع</strong><strong><a href="https://rustfs.com/">RustFS</a></strong> <strong>كواجهة خلفية لتخزين الكائنات.</strong> استغرق إسقاطه في MinIO جهدًا أقل مما كان متوقعًا.</li>
<li><strong>ترميز Vibe سريع، حتى استغرق الأمر حتى النطاق.</strong> ظل شيء واحد يقود إلى آخر - من ميلفوس إلى RAG إلى روبوت الدردشة إلى "ربما يجب أن أقوم بتحويل كل شيء إلى Dockerize". لا تتقارب المتطلبات من تلقاء نفسها.</li>
<li><strong>التصحيح يعلم أكثر من القراءة.</strong> كل فشل في هذه البنية جعل القسم التالي ينقر أسرع من أي وثائق.</li>
</ul>
<p>كل التعليمات البرمجية من هذه البنية موجودة على <a href="https://github.com/majinghe/chatbot"></a> github<a href="https://github.com/majinghe/chatbot">.com/majinghe/chatbot</a>. إذا كنت تريد تجربة <a href="http://milvus.io">ميلفوس</a> بنفسك، فإن <a href="https://milvus.io/docs/quickstart.md">البداية السريعة</a> هي مكان جيد للبدء. إذا كنت ترغب في التحدث حول ما تقوم ببنائه أو واجهت شيئًا غير متوقع، تعال واعثر علينا في <a href="https://milvus.io/slack">Milvus Slack</a>. أما إذا كنت تفضل إجراء محادثة مخصصة، فيمكنك أيضًا <a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour?uuid=4cb203e5-482a-47e0-90a6-7acc511d61f4">حجز موعد في ساعات العمل</a>.</p>
