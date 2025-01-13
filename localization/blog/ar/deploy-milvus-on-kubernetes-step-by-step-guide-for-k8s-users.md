---
id: deploy-milvus-on-kubernetes-step-by-step-guide-for-k8s-users.md
title: 'نشر Milvus على Kubernetes: دليل تفصيلي لمستخدمي Kubernetes خطوة بخطوة'
author: Gael Gu
date: 2024-09-26T00:00:00.000Z
desc: >-
  سيوفر هذا الدليل إرشادات واضحة وخطوة بخطوة لإعداد Milvus على Kubernetes
  باستخدام مشغل Milvus.
cover: >-
  assets.zilliz.com/Deploying_Milvus_on_Kubernetes_A_Step_by_Step_Guide_for_Kubernetes_Users_4193487867.png
tag: Engineering
tags: 'Vector Databases, Milvus, RAG, LLM, K8s Deployment'
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/deploy-milvus-on-kubernetes-step-by-step-guide-for-k8s-users.md
---
<p><a href="https://zilliz.com/what-is-milvus"><strong>Milvus</strong></a> عبارة عن <a href="https://zilliz.com/learn/what-is-vector-database">قاعدة بيانات متجهة</a> مفتوحة المصدر مصممة لتخزين كميات هائلة من <a href="https://zilliz.com/learn/introduction-to-unstructured-data">البيانات غير المنظمة</a> وفهرستها والبحث فيها من خلال تمثيلات متجهة، مما يجعلها مثالية للتطبيقات التي تعتمد على الذكاء الاصطناعي، مثل البحث عن التشابه، <a href="https://zilliz.com/glossary/semantic-search">والبحث الدلالي،</a> والجيل المعزز للاسترجاع<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">(RAG)</a>، ومحركات التوصيات، ومهام التعلم الآلي الأخرى.</p>
<p>ولكن ما يجعل Milvus أكثر قوة هو تكامله السلس مع Kubernetes. إذا كنت من هواة Kubernetes، فأنت تعلم أن المنصة مثالية لتنسيق الأنظمة الموزعة القابلة للتطوير. تستفيد Milvus استفادة كاملة من قدرات Kubernetes، مما يتيح لك نشر مجموعات Milvus الموزعة وتوسيع نطاقها وإدارتها بسهولة. سيوفر هذا الدليل إرشادات واضحة وخطوة بخطوة لإعداد Milvus على Kubernetes باستخدام مشغل Milvus.</p>
<h2 id="Prerequisites" class="common-anchor-header">المتطلبات الأساسية<button data-href="#Prerequisites" class="anchor-icon" translate="no">
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
    </button></h2><p>قبل أن نبدأ، تأكد من توفر المتطلبات الأساسية التالية:</p>
<ul>
<li><p>مجموعة Kubernetes قيد التشغيل. إذا كنت تختبر محليًا، فإن <code translate="no">minikube</code> هو خيار رائع.</p></li>
<li><p><code translate="no">kubectl</code> مثبتة ومهيأة للتفاعل مع مجموعة Kubernetes الخاصة بك.</p></li>
<li><p>الإلمام بمفاهيم Kubernetes الأساسية مثل البودات والخدمات وعمليات النشر.</p></li>
</ul>
<h2 id="Step-1-Installing-Minikube-For-Local-Testing" class="common-anchor-header">الخطوة 1: تثبيت Minikube (للاختبار المحلي)<button data-href="#Step-1-Installing-Minikube-For-Local-Testing" class="anchor-icon" translate="no">
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
    </button></h2><p>إذا كنت بحاجة إلى إعداد بيئة Kubernetes محلية، فإن <code translate="no">minikube</code> هي الأداة المناسبة لك. تعليمات التثبيت الرسمية موجودة على <a href="https://minikube.sigs.k8s.io/docs/start/">صفحة بدء تشغيل minikube</a>.</p>
<h3 id="1-Install-Minikube" class="common-anchor-header">1. تثبيت الميني كيوب</h3><p>قم بزيارة<a href="https://github.com/kubernetes/minikube/releases"> صفحة إصدارات minikube</a> وقم بتنزيل الإصدار المناسب لنظام التشغيل الخاص بك. بالنسبة لنظام التشغيل macOS/Linux، يمكنك استخدام الأمر التالي:</p>
<pre><code translate="no">$ curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
$ <span class="hljs-built_in">sudo</span> install minikube-linux-amd64 /usr/local/bin/minikube &amp;&amp; <span class="hljs-built_in">rm</span> minikube-linux-amd64
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Start-Minikube" class="common-anchor-header">2. ابدأ تشغيل مينيكيوب</h3><pre><code translate="no">$ minikube start
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Interact-with-Cluster" class="common-anchor-header">3. تفاعل مع المجموعة</h3><p>يمكنك الآن التفاعل مع مجموعاتك باستخدام kubectl داخل minikube. إذا لم تكن قد قمت بتثبيت kubectl، فسيقوم الميني كيوب بتنزيل الإصدار المناسب بشكل افتراضي.</p>
<pre><code translate="no">$ minikube kubectl cluster-info
<button class="copy-code-btn"></button></code></pre>
<p>بدلاً من ذلك، يمكنك إنشاء رابط رمزي إلى ثنائي الميني كيوب المسمى <code translate="no">kubectl</code> لتسهيل الاستخدام.</p>
<pre><code translate="no">$ <span class="hljs-built_in">sudo</span> <span class="hljs-built_in">ln</span> -s $(<span class="hljs-built_in">which</span> minikube) /usr/local/bin/kubectl
$ kubectl cluster-info
<button class="copy-code-btn"></button></code></pre>
<h2 id="Step-2-Configuring-the-StorageClass" class="common-anchor-header">الخطوة 2: تكوين فئة التخزين<button data-href="#Step-2-Configuring-the-StorageClass" class="anchor-icon" translate="no">
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
    </button></h2><p>في Kubernetes، تحدد <strong>StorageClass</strong> أنواع التخزين المتاحة لأحمال العمل الخاصة بك، مما يوفر المرونة في إدارة تكوينات التخزين المختلفة. قبل المتابعة، يجب عليك التأكد من توفر StorageClass الافتراضي في مجموعتك. إليك كيفية التحقق من ذلك وتكوين واحدة إذا لزم الأمر.</p>
<h3 id="1-Check-Installed-StorageClasses" class="common-anchor-header">1. تحقق من فئات التخزين المثبتة</h3><p>لمعرفة فئات التخزين المتاحة في مجموعة Kubernetes الخاصة بك، قم بتشغيل الأمر التالي:</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> sc
<button class="copy-code-btn"></button></code></pre>
<p>سيعرض هذا الأمر قائمة بفئات التخزين المثبتة في مجموعتك. إذا تم تكوين فئة تخزين افتراضية بالفعل، فسيتم تمييزها بـ <code translate="no">(default)</code>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/storage_classes_installed_in_your_cluster_21d36d6ac8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Configure-a-Default-StorageClass-if-necessary" class="common-anchor-header">2. تكوين فئة تخزين افتراضية (إذا لزم الأمر)</h3><p>إذا لم يتم تعيين أي فئة تخزين افتراضية، يمكنك إنشاء واحدة من خلال تعريفها في ملف YAML. استخدم المثال التالي لإنشاء فئة تخزين افتراضية:</p>
<pre><code translate="no"><span class="hljs-attr">apiVersion</span>: storage.<span class="hljs-property">k8s</span>.<span class="hljs-property">io</span>/v1
<span class="hljs-attr">kind</span>: <span class="hljs-title class_">StorageClass</span>
<span class="hljs-attr">metadata</span>:
 <span class="hljs-attr">name</span>: <span class="hljs-keyword">default</span>-storage<span class="hljs-keyword">class</span>
<span class="hljs-title class_">provisioner</span>: k8s.<span class="hljs-property">io</span>/minikube-hostpath
<button class="copy-code-btn"></button></code></pre>
<p>يعرّف تكوين YAML هذا ملف YAML <code translate="no">StorageClass</code> يسمى <code translate="no">default-storageclass</code> يستخدم أداة التزويد <code translate="no">minikube-hostpath</code> ، التي يشيع استخدامها في بيئات التطوير المحلية.</p>
<h3 id="3-Apply-the-StorageClass" class="common-anchor-header">3. تطبيق StorageClass</h3><p>بمجرد إنشاء الملف <code translate="no">default-storageclass.yaml</code> ، قم بتطبيقه على مجموعتك باستخدام الأمر التالي:</p>
<pre><code translate="no">$ kubectl apply -f <span class="hljs-keyword">default</span>-storageclass.<span class="hljs-property">yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>سيؤدي هذا إلى إعداد StorageClass الافتراضي لمجموعتك، مما يضمن إدارة احتياجات التخزين الخاصة بك بشكل صحيح في المستقبل.</p>
<h2 id="Step-3-Installing-Milvus-Using-the-Milvus-Operator" class="common-anchor-header">الخطوة 3: تثبيت Milvus باستخدام مشغل Milvus<button data-href="#Step-3-Installing-Milvus-Using-the-Milvus-Operator" class="anchor-icon" translate="no">
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
    </button></h2><p>يعمل مشغل Milvus على تبسيط عملية نشر Milvus على Kubernetes، وإدارة النشر والتوسع والتحديثات. قبل تثبيت مشغل Milvus، ستحتاج إلى تثبيت <strong>مدير الشهادات،</strong> الذي يوفر شهادات لخادم خطاف الويب الذي يستخدمه مشغل Milvus.</p>
<h3 id="1-Install-cert-manager" class="common-anchor-header">1. تثبيت مدير الشهادات</h3><p>يتطلب مشغل Milvus مدير <a href="https://cert-manager.io/docs/installation/supported-releases/">الشهادات</a> لإدارة الشهادات من أجل الاتصال الآمن. تأكد من تثبيت <strong>الإصدار 1.1.3 من cert-manager</strong> أو إصدار أحدث. لتثبيته، قم بتشغيل الأمر التالي:</p>
<pre><code translate="no">$ kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.5.3/cert-manager.yaml
<button class="copy-code-btn"></button></code></pre>
<p>بعد التثبيت، تحقق من تشغيل كبسولات cert-manager من خلال تنفيذ:</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> pods -n cert-manager
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/verify_that_the_cert_manager_pods_are_running_bb44c2b6d5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Install-the-Milvus-Operator" class="common-anchor-header">2. تثبيت مشغل ميلفوس</h3><p>بمجرد تشغيل مدير الشهادات وتشغيله، يمكنك تثبيت مشغل ميلفوس. قم بتشغيل الأمر التالي لنشره باستخدام <code translate="no">kubectl</code>:</p>
<pre><code translate="no">$ kubectl apply -f <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/zilliztech/milvus-operator/main/deploy/manifests/deployment.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>يمكنك التحقق مما إذا كانت جراب مشغل ميلفوس قيد التشغيل باستخدام الأمر التالي:</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> pods -n milvus-<span class="hljs-keyword">operator</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/check_if_the_Milvus_Operator_pod_is_running_6e7ac41ebf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="3-Deploy-Milvus-Cluster" class="common-anchor-header">3. نشر مجموعة ميلفوس العنقودية</h3><p>بمجرد تشغيل جراب مشغل Milvus، يمكنك نشر مجموعة Milvus مع المشغل. يقوم الأمر التالي بنشر مجموعة Milvus مع مكوناتها وتوابعها في كبسولات منفصلة باستخدام التكوينات الافتراضية:</p>
<pre><code translate="no">$ kubectl apply -f <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/zilliztech/milvus-operator/main/config/samples/milvus_cluster_default.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Deploy_Milvus_Cluster_8b5d5343af.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>لتخصيص إعدادات Milvus، ستحتاج إلى استبدال ملف YAML بملف YAML الخاص بالتكوين الخاص بك. بالإضافة إلى تحرير الملف أو إنشائه يدويًا، يمكنك استخدام أداة تحجيم Milvus لضبط التكوينات ثم تنزيل ملف YAML المقابل.</p>
<p>لتخصيص إعدادات Milvus، يجب عليك استبدال ملف YAML الافتراضي بتكوينك الخاص. يمكنك إما تحرير هذا الملف يدويًا أو إنشاء هذا الملف، وتخصيصه وفقًا لمتطلباتك الخاصة.</p>
<p>وبدلاً من ذلك، يمكنك استخدام <a href="https://milvus.io/tools/sizing"><strong>أداة تحجيم Milvus Sizing Tool</strong></a> للحصول على نهج أكثر انسيابية. تسمح لك هذه الأداة بضبط الإعدادات المختلفة، مثل تخصيص الموارد وخيارات التخزين، ثم تنزيل ملف YAML المقابل مع التكوينات التي تريدها. يضمن ذلك تحسين نشر ميلفوس الخاص بك لحالة الاستخدام الخاصة بك.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Milvus_sizing_tool_024693df9d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>الشكل: أداة تحجيم ميلفوس</p>
<p>قد يستغرق الأمر بعض الوقت لإنهاء عملية النشر. يمكنك التحقق من حالة مجموعة ميلفوس الخاصة بك عبر الأمر:</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> milvus my-release
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/check_the_status_of_your_Milvus_cluster_bcbd85fd70.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>بمجرد أن يصبح عنقود ميلفوس الخاص بك جاهزًا، يجب أن تكون جميع البودات في عنقود ميلفوس قيد التشغيل أو مكتملة:</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> pods
<button class="copy-code-btn"></button></code></pre>
<h2 id="Step-4-Accessing-Your-Milvus-Cluster" class="common-anchor-header">الخطوة 4: الوصول إلى مجموعة ميلفوس العنقودية الخاصة بك<button data-href="#Step-4-Accessing-Your-Milvus-Cluster" class="anchor-icon" translate="no">
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
    </button></h2><p>بمجرد نشر مجموعة Milvus العنقودية الخاصة بك، تحتاج إلى الوصول إليها عن طريق إعادة توجيه منفذ محلي إلى منفذ خدمة Milvus. اتبع هذه الخطوات لاسترداد منفذ الخدمة وإعداد إعادة توجيه المنفذ.</p>
<h4 id="1-Get-the-Service-Port" class="common-anchor-header"><strong>1. احصل على منفذ الخدمة</strong></h4><p>أولاً، حدد منفذ الخدمة باستخدام الأمر التالي. استبدل <code translate="no">&lt;YOUR_MILVUS_PROXY_POD&gt;</code> باسم جراب وكيل Milvus الخاص بك، والذي يبدأ عادةً بـ <code translate="no">my-release-milvus-proxy-</code>:</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> pod &lt;YOUR_MILVUS_PROXY_POD&gt; --template =<span class="hljs-string">&#x27;{{(index (index .spec.containers 0).ports 0).containerPort}}{{&quot;\n&quot;}}&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>سيعيد هذا الأمر رقم المنفذ الذي تستخدمه خدمة ميلفوس الخاصة بك.</p>
<h4 id="2-Forward-the-Port" class="common-anchor-header"><strong>2. إعادة توجيه المنفذ</strong></h4><p>للوصول إلى مجموعة ميلفوس محليًا، قم بإعادة توجيه منفذ محلي إلى منفذ الخدمة باستخدام الأمر التالي. استبدل <code translate="no">&lt;YOUR_LOCAL_PORT&gt;</code> بالمنفذ المحلي الذي تريد استخدامه و <code translate="no">&lt;YOUR_SERVICE_PORT&gt;</code> بمنفذ الخدمة الذي تم استرجاعه في الخطوة السابقة:</p>
<pre><code translate="no">$ kubectl port-forward --address 0.0.0.0 service/my-release-milvus &lt;YOUR_LOCAL_PORT&gt;:&lt;YOUR_SERVICE_PORT&gt;
<button class="copy-code-btn"></button></code></pre>
<p>يسمح هذا الأمر بإعادة توجيه المنفذ للاستماع على جميع عناوين IP للجهاز المضيف. إذا كنت تحتاج فقط إلى الخدمة للاستماع على <code translate="no">localhost</code> ، يمكنك حذف الخيار <code translate="no">--address 0.0.0.0</code>.</p>
<p>بمجرد إعداد إعادة توجيه المنفذ، يمكنك الوصول إلى مجموعة ميلفوس الخاصة بك عبر المنفذ المحلي المحدد لمزيد من العمليات أو عمليات التكامل.</p>
<h2 id="Step-5-Connecting-to-Milvus-Using-Python-SDK" class="common-anchor-header">الخطوة 5: الاتصال ب Milvus باستخدام Python SDK<button data-href="#Step-5-Connecting-to-Milvus-Using-Python-SDK" class="anchor-icon" translate="no">
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
    </button></h2><p>مع تشغيل مجموعة Milvus الخاصة بك، يمكنك الآن التفاعل معها باستخدام أي من أدوات تطوير البرمجيات الخاصة ب Milvus. في هذا المثال، سنستخدم في هذا المثال <a href="https://zilliz.com/blog/what-is-pymilvus">PyMilvus،</a> وهي مجموعة <strong>أدوات تطوير البرمجيات</strong> الخاصة ب Milvus <strong>Python SDK،</strong> للاتصال بالمجموعة وإجراء العمليات الأساسية.</p>
<h3 id="1-Install-PyMilvus" class="common-anchor-header">1. تثبيت PyMilvus</h3><p>للتفاعل مع Milvus عبر Python، تحتاج إلى تثبيت الحزمة <code translate="no">pymilvus</code>:</p>
<pre><code translate="no">$ pip install pymilvus
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Connect-to-Milvus" class="common-anchor-header">2. الاتصال بميلفوس</h3><p>فيما يلي نموذج برنامج نصي من بايثون يتصل بمجموعة ميلفوس ويوضح كيفية تنفيذ العمليات الأساسية مثل إنشاء مجموعة.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-comment"># Connect to the Milvus server</span>
client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:&lt;YOUR_LOCAL_PORT&gt;&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-comment"># Create a collection</span>
collection_name = <span class="hljs-string">&quot;example_collection&quot;</span>
<span class="hljs-keyword">if</span> client.has_collection(collection_name):
   client.drop_collection(collection_name)
client.create_collection(
   collection_name=collection_name,
   dimension=<span class="hljs-number">768</span>,  <span class="hljs-comment"># The vectors we will use in this demo has 768 dimensions</span>
)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Explanation" class="common-anchor-header">الشرح:</h4><ul>
<li><p>الاتصال ب Milvus: يتصل البرنامج النصي بخادم Milvus الذي يعمل على <code translate="no">localhost</code> باستخدام المنفذ المحلي الذي قمت بإعداده في الخطوة 4.</p></li>
<li><p>إنشاء مجموعة: يتحقق البرنامج النصي مما إذا كانت المجموعة المسماة <code translate="no">example_collection</code> موجودة بالفعل، ويسقطها إذا كان الأمر كذلك، ثم ينشئ مجموعة جديدة ذات أبعاد 768.</p></li>
</ul>
<p>ينشئ هذا النص البرمجي اتصالاً بمجموعة ميلفوس وينشئ مجموعة، ويعمل كنقطة بداية لعمليات أكثر تعقيدًا مثل إدراج المتجهات وإجراء عمليات بحث عن التشابه.</p>
<h2 id="Conclusion" class="common-anchor-header">الخاتمة<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>يؤدي نشر Milvus في إعداد موزع على Kubernetes إلى فتح إمكانات قوية لإدارة البيانات المتجهة واسعة النطاق، مما يتيح قابلية التوسع السلس والتطبيقات عالية الأداء القائمة على الذكاء الاصطناعي. باتباع هذا الدليل، تكون قد تعلمت كيفية إعداد Milvus باستخدام مشغل Milvus، مما يجعل العملية مبسطة وفعالة.</p>
<p>بينما تستمر في استكشاف Milvus، فكّر في توسيع نطاق مجموعتك لتلبية الطلبات المتزايدة أو نشرها على المنصات السحابية مثل Amazon EKS أو Google Cloud أو Microsoft Azure. ولتحسين الإدارة والمراقبة، توفر أدوات مثل <a href="https://milvus.io/docs/milvus_backup_overview.md"><strong>Milvus Backup</strong></a> <a href="https://milvus.io/docs/birdwatcher_overview.md"><strong>وBirdwatcher</strong></a> <a href="https://github.com/zilliztech/attu"><strong>وAttu</strong></a> دعمًا قيّمًا للحفاظ على سلامة وأداء عمليات النشر الخاصة بك.</p>
<p>أنت الآن جاهز للاستفادة من الإمكانات الكاملة لـ Milvus على Kubernetes - نشر سعيد! 🚀</p>
<h2 id="Further-Resources" class="common-anchor-header">المزيد من الموارد<button data-href="#Further-Resources" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/docs/overview.md">وثائق ميلفوس</a></p></li>
<li><p><a href="https://zilliz.com/blog/choose-the-right-milvus-deployment-mode-ai-applications">ميلفوس لايت مقابل المستقل مقابل الموزع: ما هو الوضع المناسب لك؟ </a></p></li>
<li><p><a href="https://zilliz.com/blog/milvus-on-gpu-with-nvidia-rapids-cuvs">الشحن الفائق للبحث المتجه: Milvus على وحدات معالجة الرسومات باستخدام NVIDIA RAPIDS cuVS</a></p></li>
<li><p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">ما هو RAG؟ </a></p></li>
<li><p><a href="https://zilliz.com/learn/generative-ai">مركز موارد الذكاء الاصطناعي التوليدي | زيليز</a></p></li>
<li><p><a href="https://zilliz.com/ai-models">نماذج الذكاء الاصطناعي الأفضل أداءً لتطبيقات الذكاء الاصطناعي التوليدي | Zilliz</a></p></li>
</ul>
