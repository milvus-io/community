---
id: getting-started-with-milvus-cluster-and-k8s.md
title: الشروع في العمل مع مجموعة ميلفوس العنقودية و K8s
author: Stephen Batifol
date: 2024-04-03T00:00:00.000Z
desc: >-
  من خلال هذا البرنامج التعليمي، ستتعلم أساسيات إعداد Milvus مع Helm، وإنشاء
  مجموعة، وإجراء عمليات استيعاب البيانات وعمليات البحث عن التشابه.
cover: assets.zilliz.com/Getting_started_with_Milvus_cluster_and_K8s_1_34b2c81802.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Kubernetes
recommend: true
canonicalUrl: 'https://milvus.io/blog/getting-started-with-milvus-and-k8s.md'
---
<h2 id="Introduction" class="common-anchor-header">مقدمة<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus هي قاعدة بيانات متجهات موزعة تهدف إلى تخزين وفهرسة وإدارة متجهات التضمين الضخمة. إن قدرتها على الفهرسة والبحث بكفاءة من خلال تريليونات من المتجهات تجعل من Milvus خيارًا مفضلاً لأعباء عمل الذكاء الاصطناعي والتعلم الآلي.</p>
<p>من ناحية أخرى، يتفوق Kubernetes (K8s) في إدارة التطبيقات المدمجة في حاويات وتوسيع نطاقها. فهو يوفر ميزات مثل التوسع التلقائي، والشفاء الذاتي، وموازنة التحميل، وهي ميزات ضرورية للحفاظ على التوافر والأداء العالي في بيئات الإنتاج.</p>
<h2 id="Why-Use-Them-Together" class="common-anchor-header">لماذا نستخدمهما معاً؟<button data-href="#Why-Use-Them-Together" class="anchor-icon" translate="no">
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
    </button></h2><p>يمكن لـ K8s توسيع نطاق مجموعات Milvus تلقائيًا بناءً على عبء العمل. مع نمو بياناتك أو زيادة عدد الاستعلامات، يمكن لـ K8s تشغيل المزيد من مثيلات Milvus للتعامل مع الحمل، مما يضمن استمرار استجابة تطبيقاتك.</p>
<p>إحدى الميزات البارزة في K8s هي التوسعة الأفقية، مما يجعل توسيع مجموعة Milvus الخاصة بك أمرًا سهلاً. مع نمو مجموعة البيانات الخاصة بك، تستوعب K8s هذا النمو دون عناء، مما يجعلها حلاً مباشرًا وفعالًا.</p>
<p>بالإضافة إلى ذلك، فإن القدرة على التعامل مع الاستعلامات تتوسع أفقياً مع K8s. فمع زيادة حمل الاستعلام، يمكن ل K8s نشر المزيد من مثيلات Milvus للتعامل مع استعلامات البحث المتزايدة عن التشابه، مما يضمن استجابات منخفضة زمن الاستجابة حتى في ظل الأحمال الثقيلة.</p>
<h2 id="Prerequisites--Setting-Up-K8s" class="common-anchor-header">المتطلبات الأساسية وإعداد K8s<button data-href="#Prerequisites--Setting-Up-K8s" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Prerequisites" class="common-anchor-header">المتطلبات الأساسية</h3><ul>
<li><p><strong>Docker</strong> - تأكد من تثبيت Docker على نظامك.</p></li>
<li><p><strong>Kubernetes</strong> - جهّز مجموعة Kubernetes العنقودية. يمكنك استخدام <code translate="no">minikube</code> للتطوير المحلي أو خدمة Kubernetes الخاصة بمزود خدمة سحابية لبيئات الإنتاج.</p></li>
<li><p><strong>Helm</strong> - قم بتثبيت Helm، وهو مدير حزم لـ Kubernetes، لمساعدتك في إدارة تطبيقات Kubernetes، يمكنك مراجعة وثائقنا لمعرفة كيفية القيام بذلك <a href="https://milvus.io/docs/install_cluster-helm.md">https://milvus.io/docs/install_cluster-helm.md</a></p></li>
<li><p><strong>Kubectl</strong> - قم بتثبيت <code translate="no">kubectl</code> ، وهي أداة سطر أوامر للتفاعل مع مجموعات Kubernetes، لنشر التطبيقات وفحص موارد المجموعة وإدارتها وعرض السجلات.</p></li>
</ul>
<h3 id="Setting-Up-K8s" class="common-anchor-header">إعداد K8s</h3><p>بعد تثبيت كل ما هو مطلوب لتشغيل مجموعة K8s، وإذا كنت تستخدم <code translate="no">minikube</code> ، فابدأ تشغيل مجموعتك باستخدام:</p>
<pre><code translate="no">minikube start
<button class="copy-code-btn"></button></code></pre>
<p>تحقق من حالة مجموعة K8s الخاصة بك باستخدام:</p>
<pre><code translate="no">kubectl cluster-info
<button class="copy-code-btn"></button></code></pre>
<h3 id="Deploying-Milvus-on-K8s" class="common-anchor-header">نشر ميلفوس على K8s</h3><p>في عملية النشر هذه، سنختار Milvus في وضع الكتلة للاستفادة من قدراته الموزعة الكاملة. سنستخدم Helm، لتبسيط عملية التثبيت.</p>
<p><strong>1. أمر تثبيت Helm</strong></p>
<pre><code translate="no">helm install my-milvus milvus/milvus --<span class="hljs-built_in">set</span> pulsar.enabled=<span class="hljs-literal">false</span> --<span class="hljs-built_in">set</span> kafka.enabled=<span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<p>يقوم هذا الأمر بتثبيت Milvus على مجموعة K8s الخاصة بك مع تمكين Kafka وتعطيل Pulsar. يعمل Kafka كنظام مراسلة داخل Milvus، حيث يتعامل مع تدفق البيانات بين المكونات المختلفة. يؤدي تعطيل Pulsar وتمكين Kafka إلى تخصيص عملية النشر وفقًا لتفضيلات ومتطلبات المراسلة الخاصة بنا.</p>
<p><strong>2. إعادة توجيه المنفذ</strong></p>
<p>للوصول إلى ميلفوس من جهازك المحلي، قم بإنشاء منفذ لإعادة توجيه المنفذ: <code translate="no">kubectl port-forward svc/my-milvus 27017:19530</code>.</p>
<p>يقوم هذا الأمر بتعيين المنفذ <code translate="no">19530</code> من خدمة Milvus <code translate="no">svc/my-milvus</code> إلى نفس المنفذ على جهازك المحلي، مما يسمح لك بالاتصال بـ Milvus باستخدام أدوات محلية. إذا تركت المنفذ المحلي غير محدد (كما هو الحال في <code translate="no">:19530</code>)، سيقوم K8s بتخصيص منفذ متاح، مما يجعله ديناميكيًا. تأكد من ملاحظة المنفذ المحلي المخصص إذا اخترت هذه الطريقة.</p>
<p><strong>3. التحقق من النشر:</strong></p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> pods 

NAME                                    READY   STATUS    RESTARTS   AGE
my-milvus-datacoord<span class="hljs-number">-595b</span>996bd4-zprpd    <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-datanode-d9d555785<span class="hljs-number">-47</span>nkt      <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-etcd<span class="hljs-number">-0</span>                        <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">84</span>m
my-milvus-etcd<span class="hljs-number">-1</span>                        <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-etcd<span class="hljs-number">-2</span>                        <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-indexcoord<span class="hljs-number">-65b</span>c68968c<span class="hljs-number">-6</span>jg6q   <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-indexnode<span class="hljs-number">-54586f</span>55d-z9vx4     <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-kafka<span class="hljs-number">-0</span>                       <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-kafka<span class="hljs-number">-1</span>                       <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-kafka<span class="hljs-number">-2</span>                       <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-minio<span class="hljs-number">-0</span>                       <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">96</span>m
my-milvus-minio<span class="hljs-number">-1</span>                       <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">96</span>m
my-milvus-minio<span class="hljs-number">-2</span>                       <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">96</span>m
my-milvus-minio<span class="hljs-number">-3</span>                       <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">96</span>m
my-milvus-proxy<span class="hljs-number">-76b</span>b7d497f-sqwvd        <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-querycoord<span class="hljs-number">-6f</span>4c7b7598-b6twj   <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-querynode<span class="hljs-number">-677b</span>df485b-ktc6m    <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-rootcoord<span class="hljs-number">-7498f</span>ddfd8-v5zw8    <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-zookeeper<span class="hljs-number">-0</span>                   <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-zookeeper<span class="hljs-number">-1</span>                   <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-zookeeper<span class="hljs-number">-2</span>                   <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
<button class="copy-code-btn"></button></code></pre>
<p>يجب أن ترى قائمة بالقرون مشابهة للمخرجات أعلاه، وكلها في حالة التشغيل. يشير هذا إلى أن مجموعة ميلفوس الخاصة بك تعمل. على وجه التحديد، ابحث عن 1/1 تحت العمود <code translate="no">READY</code> ، مما يدل على أن كل كبسولة جاهزة تمامًا وتعمل. إذا لم تكن أي كبسولات في حالة التشغيل، فقد تحتاج إلى مزيد من التحقيق لضمان نشر ناجح.</p>
<p>مع نشر مجموعة Milvus الخاصة بك وتأكيد تشغيل جميع المكونات، فأنت الآن جاهز للمتابعة إلى استيعاب البيانات والفهرسة. سيتضمن ذلك الاتصال بمثيل Milvus الخاص بك، وإنشاء مجموعات، وإدراج ناقلات للبحث والاسترجاع.</p>
<h2 id="Data-Ingestion-and-Indexing" class="common-anchor-header">استيعاب البيانات والفهرسة<button data-href="#Data-Ingestion-and-Indexing" class="anchor-icon" translate="no">
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
    </button></h2><p>للبدء في استيعاب وفهرسة البيانات في مجموعة ميلفوس الخاصة بنا، سنستخدم مجموعة أدوات تطوير البرمجيات pymilvus SDK. هناك خياران للتثبيت:</p>
<ul>
<li><p>SDK الأساسي: <code translate="no">pip install pymilvus</code></p></li>
<li><p>لتضمين النصوص الغنية والنماذج المتقدمة: <code translate="no">pip install pymilvus[model]</code></p></li>
</ul>
<p>وقت إدراج البيانات في مجموعتنا، سنستخدم <code translate="no">pymilvus</code> ، يمكنك إما تثبيت SDK فقط مع <code translate="no">pip install pymilvus</code> أو إذا كنت ترغب في استخراج تضمينات النص الغني، يمكنك أيضًا استخدام <code translate="no">PyMilvus Models</code> عن طريق التثبيت <code translate="no">pip install pymilvus[model]</code>.</p>
<h3 id="Connecting-and-Creating-a-Collection" class="common-anchor-header">الاتصال وإنشاء مجموعة:</h3><p>أولاً، قم بالاتصال بمثيل ميلفوس الخاص بك باستخدام المنفذ الذي قمت بإعادة توجيهه سابقاً. تأكد من تطابق URI مع المنفذ المحلي المعين من قبل K8s:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>

client = <span class="hljs-title class_">MilvusClient</span>(
        uri=<span class="hljs-string">&quot;http://127.0.0.1:52070&quot;</span>,
    )

client.<span class="hljs-title function_">create_collection</span>(collection_name=<span class="hljs-string">&quot;quick_setup&quot;</span>, dimension=<span class="hljs-number">5</span>)
<button class="copy-code-btn"></button></code></pre>
<p>تحدد المعلمة <code translate="no">dimension=5</code> حجم المتجه لهذه المجموعة، وهو أمر ضروري لإمكانيات البحث عن المتجهات.</p>
<h3 id="Insert-Data" class="common-anchor-header">إدراج البيانات</h3><p>إليك كيفية إدراج مجموعة أولية من البيانات، حيث يمثل كل متجه عنصرًا، ويضيف حقل اللون سمة وصفية:</p>
<pre><code translate="no">data=[
    {<span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">0</span>, <span class="hljs-string">&quot;vector&quot;</span>: [<span class="hljs-number">0.3580376395471989</span>, -<span class="hljs-number">0.6023495712049978</span>, <span class="hljs-number">0.18414012509913835</span>, -<span class="hljs-number">0.26286205330961354</span>, <span class="hljs-number">0.9029438446296592</span>], <span class="hljs-string">&quot;color&quot;</span>: <span class="hljs-string">&quot;pink_8682&quot;</span>},
    {<span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">1</span>, <span class="hljs-string">&quot;vector&quot;</span>: [<span class="hljs-number">0.19886812562848388</span>, <span class="hljs-number">0.06023560599112088</span>, <span class="hljs-number">0.6976963061752597</span>, <span class="hljs-number">0.2614474506242501</span>, <span class="hljs-number">0.838729485096104</span>], <span class="hljs-string">&quot;color&quot;</span>: <span class="hljs-string">&quot;red_7025&quot;</span>},
    {<span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">2</span>, <span class="hljs-string">&quot;vector&quot;</span>: [<span class="hljs-number">0.43742130801983836</span>, -<span class="hljs-number">0.5597502546264526</span>, <span class="hljs-number">0.6457887650909682</span>, <span class="hljs-number">0.7894058910881185</span>, <span class="hljs-number">0.20785793220625592</span>], <span class="hljs-string">&quot;color&quot;</span>: <span class="hljs-string">&quot;orange_6781&quot;</span>},
    {<span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">3</span>, <span class="hljs-string">&quot;vector&quot;</span>: [<span class="hljs-number">0.3172005263489739</span>, <span class="hljs-number">0.9719044792798428</span>, -<span class="hljs-number">0.36981146090600725</span>, -<span class="hljs-number">0.4860894583077995</span>, <span class="hljs-number">0.95791889146345</span>], <span class="hljs-string">&quot;color&quot;</span>: <span class="hljs-string">&quot;pink_9298&quot;</span>},
    {<span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">4</span>, <span class="hljs-string">&quot;vector&quot;</span>: [<span class="hljs-number">0.4452349528804562</span>, -<span class="hljs-number">0.8757026943054742</span>, <span class="hljs-number">0.8220779437047674</span>, <span class="hljs-number">0.46406290649483184</span>, <span class="hljs-number">0.30337481143159106</span>], <span class="hljs-string">&quot;color&quot;</span>: <span class="hljs-string">&quot;red_4794&quot;</span>},
    {<span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">5</span>, <span class="hljs-string">&quot;vector&quot;</span>: [<span class="hljs-number">0.985825131989184</span>, -<span class="hljs-number">0.8144651566660419</span>, <span class="hljs-number">0.6299267002202009</span>, <span class="hljs-number">0.1206906911183383</span>, -<span class="hljs-number">0.1446277761879955</span>], <span class="hljs-string">&quot;color&quot;</span>: <span class="hljs-string">&quot;yellow_4222&quot;</span>},
    {<span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">6</span>, <span class="hljs-string">&quot;vector&quot;</span>: [<span class="hljs-number">0.8371977790571115</span>, -<span class="hljs-number">0.015764369584852833</span>, -<span class="hljs-number">0.31062937026679327</span>, -<span class="hljs-number">0.562666951622192</span>, -<span class="hljs-number">0.8984947637863987</span>], <span class="hljs-string">&quot;color&quot;</span>: <span class="hljs-string">&quot;red_9392&quot;</span>},
    {<span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">7</span>, <span class="hljs-string">&quot;vector&quot;</span>: [-<span class="hljs-number">0.33445148015177995</span>, -<span class="hljs-number">0.2567135004164067</span>, <span class="hljs-number">0.8987539745369246</span>, <span class="hljs-number">0.9402995886420709</span>, <span class="hljs-number">0.5378064918413052</span>], <span class="hljs-string">&quot;color&quot;</span>: <span class="hljs-string">&quot;grey_8510&quot;</span>},
    {<span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">8</span>, <span class="hljs-string">&quot;vector&quot;</span>: [<span class="hljs-number">0.39524717779832685</span>, <span class="hljs-number">0.4000257286739164</span>, -<span class="hljs-number">0.5890507376891594</span>, -<span class="hljs-number">0.8650502298996872</span>, -<span class="hljs-number">0.6140360785406336</span>], <span class="hljs-string">&quot;color&quot;</span>: <span class="hljs-string">&quot;white_9381&quot;</span>},
    {<span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">9</span>, <span class="hljs-string">&quot;vector&quot;</span>: [<span class="hljs-number">0.5718280481994695</span>, <span class="hljs-number">0.24070317428066512</span>, -<span class="hljs-number">0.3737913482606834</span>, -<span class="hljs-number">0.06726932177492717</span>, -<span class="hljs-number">0.6980531615588608</span>], <span class="hljs-string">&quot;color&quot;</span>: <span class="hljs-string">&quot;purple_4976&quot;</span>}
]

res = client.insert(
    collection_name=<span class="hljs-string">&quot;quick_setup&quot;</span>,
    data=data
)

<span class="hljs-built_in">print</span>(res)
<button class="copy-code-btn"></button></code></pre>
<p>يفترض الرمز المقدم أنك قمت بإنشاء مجموعة بطريقة الإعداد السريع. كما هو موضح في الكود أعلاه,</p>
<p>يتم تنظيم البيانات المراد إدراجها في قائمة من القواميس، حيث يمثل كل قاموس سجل بيانات، يُطلق عليه اسم كيان.</p>
<p>ويحتوي كل قاموس على حقل غير معرّف بشكل منهجي يسمى اللون.</p>
<p>يحتوي كل قاموس على المفاتيح المقابلة لكل من الحقول المحددة مسبقًا والحقول الديناميكية.</p>
<h3 id="Insert-Even-More-Data" class="common-anchor-header">إدراج المزيد من البيانات</h3><pre><code translate="no">colors = [<span class="hljs-string">&quot;green&quot;</span>, <span class="hljs-string">&quot;blue&quot;</span>, <span class="hljs-string">&quot;yellow&quot;</span>, <span class="hljs-string">&quot;red&quot;</span>, <span class="hljs-string">&quot;black&quot;</span>, <span class="hljs-string">&quot;white&quot;</span>, <span class="hljs-string">&quot;purple&quot;</span>, <span class="hljs-string">&quot;pink&quot;</span>, <span class="hljs-string">&quot;orange&quot;</span>, <span class="hljs-string">&quot;brown&quot;</span>, <span class="hljs-string">&quot;grey&quot;</span>]
data = [ {
    <span class="hljs-string">&quot;id&quot;</span>: i, 
    <span class="hljs-string">&quot;vector&quot;</span>: [ random.uniform(-<span class="hljs-number">1</span>, <span class="hljs-number">1</span>) <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">5</span>) ], 
    <span class="hljs-string">&quot;color&quot;</span>: <span class="hljs-string">f&quot;<span class="hljs-subst">{random.choice(colors)}</span>_<span class="hljs-subst">{<span class="hljs-built_in">str</span>(random.randint(<span class="hljs-number">1000</span>, <span class="hljs-number">9999</span>))}</span>&quot;</span> 
} <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">1000</span>) ]

res = client.insert(
    collection_name=<span class="hljs-string">&quot;quick_setup&quot;</span>,
    data=data[<span class="hljs-number">10</span>:]
)

<span class="hljs-built_in">print</span>(res)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Similarity-Search" class="common-anchor-header">بحث التشابه<button data-href="#Similarity-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>بعد ملء المجموعة، يمكنك إجراء بحث تشابه للعثور على متجهات قريبة من متجه الاستعلام. قيمة متغير query_vectors هي قائمة تحتوي على قائمة فرعية من المتجهات. تمثل القائمة الفرعية تضمين متجه من 5 أبعاد.</p>
<pre><code translate="no">query_vectors = [
    [0.041732933, 0.013779674, -0.027564144, -0.013061441, 0.009748648]
]

res = client.search(
    collection_name=<span class="hljs-string">&quot;quick_setup&quot;</span>,     <span class="hljs-comment"># target collection</span>
    data=query_vectors,                <span class="hljs-comment"># query vectors</span>
    <span class="hljs-built_in">limit</span>=3,                           <span class="hljs-comment"># number of returned entities</span>
)

<span class="hljs-built_in">print</span>(res)
<button class="copy-code-btn"></button></code></pre>
<p>يبحث هذا الاستعلام عن أفضل 3 متجهات الأكثر تشابهًا مع متجه الاستعلام، مما يوضح قدرات البحث القوية في Milvus.</p>
<h2 id="Uninstall-Milvus-from-K8s" class="common-anchor-header">إلغاء تثبيت ميلفوس من K8s<button data-href="#Uninstall-Milvus-from-K8s" class="anchor-icon" translate="no">
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
    </button></h2><p>بمجرد الانتهاء من هذا البرنامج التعليمي، لا تتردد في إلغاء تثبيت Milvus من مجموعة K8s الخاصة بك باستخدام:<code translate="no">helm uninstall my-milvus</code>.</p>
<p>سيؤدي هذا الأمر إلى إزالة جميع مكونات Milvus المنشورة في الإصدار <code translate="no">my-milvus</code> ، مما يؤدي إلى تحرير موارد المجموعة.</p>
<h2 id="Conclusion" class="common-anchor-header">خاتمة<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
<li><p>يُظهر نشر Milvus على مجموعة Kubernetes قابلية التوسع والمرونة في قواعد البيانات المتجهة في التعامل مع أعباء عمل الذكاء الاصطناعي والتعلم الآلي. من خلال هذا البرنامج التعليمي، تكون قد تعلمت أساسيات إعداد Milvus مع Helm، وإنشاء مجموعة، وإجراء عمليات استيعاب البيانات وعمليات البحث عن التشابه.</p></li>
<li><p>يجب أن يكون تثبيت Milvus على مجموعة Kubernetes مع Helm أمرًا بسيطًا ومباشرًا. للتعمق أكثر في توسيع نطاق مجموعات Milvus لمجموعات بيانات أكبر أو أعباء عمل أكثر كثافة، تقدم وثائقنا إرشادات مفصلة <a href="https://milvus.io/docs/scaleout.md">https://milvus.io/docs/scaleout.md</a></p></li>
</ul>
<p>لا تتردد في التحقق من الكود على <a href="https://github.com/stephen37/K8s-tutorial-milvus">Github،</a> وتحقق من <a href="https://github.com/milvus-io/milvus">Milvus،</a> وجرّب تكوينات وحالات استخدام مختلفة، وشارك تجاربك مع المجتمع من خلال الانضمام إلى <a href="https://discord.gg/FG6hMJStWu">Discord</a> الخاص بنا.</p>
