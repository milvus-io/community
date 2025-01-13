---
id: how-to-deploy-open-source-milvus-vector-database-on-amazon-eks.md
title: كيفية نشر قاعدة بيانات Milvus Vector مفتوحة المصدر على Amazon EKS
author: AWS
date: 2024-08-09T00:00:00.000Z
desc: >-
  دليل تفصيلي خطوة بخطوة حول نشر قاعدة بيانات Milvus vector على AWS باستخدام
  الخدمات المُدارة مثل Amazon EKS و S3 و MSK و ELB.
cover: assets.zilliz.com/Getting_started_with_Milvus_cluster_and_K8s_1_34b2c81802.png
tag: Engineering
tags: 'Milvus, Vector Database, Amazon EKS, RAG'
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/how-to-deploy-open-source-milvus-vector-database-on-amazon-eks.md
---
<p><em>نُشر هذا المنشور في الأصل على <a href="https://aws.amazon.com/cn/blogs/china/build-open-source-vector-database-milvus-based-on-amazon-eks/"><em>موقع AWS على الويب</em></a> وتمت ترجمته وتحريره وإعادة نشره هنا بإذن.</em></p>
<h2 id="An-Overview-of-Vector-Embeddings-and-Vector-Databases" class="common-anchor-header">نظرة عامة على تضمينات المتجهات وقواعد البيانات المتجهة<button data-href="#An-Overview-of-Vector-Embeddings-and-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>لقد عزز ظهور <a href="https://zilliz.com/learn/generative-ai">الذكاء الاصطناعي التوليدي (GenAI)</a>، ولا سيما النماذج اللغوية الكبيرة<a href="https://zilliz.com/glossary/large-language-models-(llms)">(LLMs</a>)، الاهتمام <a href="https://zilliz.com/learn/what-is-vector-database">بقواعد البيانات المتجهة</a> بشكل كبير، مما جعلها مكونًا أساسيًا في منظومة الذكاء الاصطناعي التوليدي. ونتيجة لذلك، يتم اعتماد قواعد البيانات المتجهة في <a href="https://milvus.io/use-cases">حالات الاستخدام</a> المتزايدة.</p>
<p>يتوقع <a href="https://venturebeat.com/data-infrastructure/report-80-of-global-datasphere-will-be-unstructured-by-2025/">تقرير شركة IDC</a> أنه بحلول عام 2025، سيكون أكثر من 80% من بيانات الأعمال غير منظمة، وموجودة في تنسيقات مثل النصوص والصور والصوت ومقاطع الفيديو. يمثل فهم هذا الكم الهائل من <a href="https://zilliz.com/learn/introduction-to-unstructured-data">البيانات غير المنظمة</a> ومعالجتها وتخزينها والاستعلام عنها على نطاق واسع تحديًا كبيرًا. تتمثل الممارسة الشائعة في الذكاء الاصطناعي الجيني والتعلم العميق في تحويل البيانات غير المهيكلة إلى تضمينات متجهة وتخزينها وفهرستها في قاعدة بيانات متجهة مثل <a href="https://milvus.io/intro">Milvus</a> أو <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (Milvus المدارة بالكامل) لعمليات البحث عن <a href="https://zilliz.com/learn/vector-similarity-search">التشابه المتجه</a> أو التشابه الدلالي.</p>
<p>ولكن ما هي بالضبط <a href="https://zilliz.com/glossary/vector-embeddings">تضمينات المت</a>جهات؟ ببساطة، هي تمثيلات عددية لأرقام الفاصلة العائمة في فضاء عالي الأبعاد. تشير <a href="https://zilliz.com/blog/similarity-metrics-for-vector-search">المسافة بين متجهين</a> إلى مدى ارتباطهما: فكلما كانت <a href="https://zilliz.com/blog/similarity-metrics-for-vector-search">المسافة بين متجهين</a> متقاربين، كلما كانا أكثر ارتباطًا ببعضهما البعض، والعكس صحيح. هذا يعني أن المتجهات المتشابهة تتوافق مع البيانات الأصلية المتشابهة، وهو ما يختلف عن عمليات البحث التقليدية بالكلمات الرئيسية أو البحث الدقيق.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_2_How_to_perform_a_vector_search_f38e8533a2.png" alt="How to perform a vector similarity search" class="doc-image" id="how-to-perform-a-vector-similarity-search" />
   </span> <span class="img-wrapper"> <span>كيفية إجراء بحث تشابه المتجهات</span> </span></p>
<p><em>الشكل 1: كيفية إجراء بحث تشابه المتجهات</em></p>
<p>إن القدرة على تخزين وفهرسة والبحث في تضمينات المتجهات هي الوظيفة الأساسية لقواعد بيانات المتجهات. تنقسم قواعد البيانات المتجهة السائدة حاليًا إلى فئتين. الفئة الأولى توسع منتجات قواعد البيانات العلائقية الحالية، مثل خدمة Amazon OpenSearch Service مع المكون الإضافي <a href="https://zilliz.com/blog/k-nearest-neighbor-algorithm-for-machine-learning">KNN</a> وAmazon RDS ل <a href="https://zilliz.com/comparison/milvus-vs-pgvector">PostgreSQL</a> مع امتداد pgvector. تتألف الفئة الثانية من منتجات قواعد البيانات المتجهة المتخصصة، بما في ذلك أمثلة معروفة مثل Milvus وZilliz Cloud (Milvus المدارة بالكامل) وP <a href="https://zilliz.com/comparison/pinecone-vs-zilliz-vs-milvus">Pinecone</a> <a href="https://zilliz.com/comparison/milvus-vs-weaviate">وWeaviate</a> <a href="https://zilliz.com/comparison/milvus-vs-qdrant">وQdrant</a> <a href="https://zilliz.com/blog/milvus-vs-chroma">وChroma</a>.</p>
<p>تتمتع تقنيات التضمين وقواعد البيانات المتجهة بتطبيقات واسعة النطاق عبر مختلف <a href="https://zilliz.com/vector-database-use-cases">حالات الاستخدام القائمة على الذكاء الاصطناعي،</a> بما في ذلك البحث عن تشابه الصور، وإلغاء تكرار الفيديو وتحليله، ومعالجة اللغة الطبيعية، وأنظمة التوصيات، والإعلانات المستهدفة، والبحث المخصص، وخدمة العملاء الذكية، واكتشاف الاحتيال.</p>
<p><a href="https://milvus.io/docs/quickstart.md">Milvus</a> هو أحد أكثر الخيارات مفتوحة المصدر شيوعًا من بين العديد من قواعد البيانات المتجهة. يقدم هذا المنشور Milvus ويستكشف ممارسة نشر Milvus على AWS EKS.</p>
<h2 id="What-is-Milvus" class="common-anchor-header">ما هو ميلفوس؟<button data-href="#What-is-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/intro">Milvus</a> هي قاعدة بيانات متجهية مفتوحة المصدر وموثوقة وسريعة للغاية ومفتوحة المصدر على السحابة. وهي تعمل على تشغيل تطبيقات البحث عن تشابه المتجهات والذكاء الاصطناعي وتسعى جاهدة لجعل قواعد بيانات المتجهات في متناول كل مؤسسة. يمكن ل Milvus تخزين وفهرسة وإدارة أكثر من مليار متجه تم إنشاؤها بواسطة الشبكات العصبية العميقة ونماذج التعلم الآلي الأخرى.</p>
<p>تم إصدار Milvus تحت <a href="https://github.com/milvus-io/milvus/blob/master/LICENSE">رخصة أباتشي مفتوحة المصدر 2.0</a> في أكتوبر 2019. وهو حاليًا مشروع تخرج في إطار <a href="https://lfaidata.foundation/">مؤسسة LF AI &amp; Data Foundation</a>. في وقت كتابة هذه المدونة، كانت Milvus قد وصلت إلى أكثر من <a href="https://hub.docker.com/r/milvusdb/milvus">50 مليون</a> عملية تنزيل من <a href="https://hub.docker.com/r/milvusdb/milvus">Docker draw</a> وتم استخدامها من قبل <a href="https://milvus.io/">العديد من العملاء،</a> مثل NVIDIA و AT&amp;T و IBM و eBay و Shopee و Walmart.</p>
<h3 id="Milvus-Key-Features" class="common-anchor-header">الميزات الرئيسية لـ Milvus</h3><p>كقاعدة بيانات متجهة سحابية أصلية، يتميز ميلفوس بالميزات الرئيسية التالية:</p>
<ul>
<li><p>أداء عالٍ وبحث في أجزاء من الثانية على مجموعات بيانات متجهات بمليار ثانية.</p></li>
<li><p>دعم متعدد اللغات وسلسلة أدوات.</p></li>
<li><p>قابلية التوسع الأفقي والموثوقية العالية حتى في حالة حدوث عطل.</p></li>
<li><p><a href="https://zilliz.com/blog/a-review-of-hybrid-search-in-milvus">بحث هجين</a> يتحقق من خلال إقران التصفية القياسية بالبحث عن التشابه المتجه.</p></li>
</ul>
<h3 id="Milvus-Architecture" class="common-anchor-header">بنية ميلفوس</h3><p>تتبع Milvus مبدأ الفصل بين تدفق البيانات وتدفق التحكم. ينقسم النظام إلى أربعة مستويات، كما هو موضح في الرسم البياني:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_Architecture_Overview_fd10aeffb8.png" alt="Milvus Architecture" class="doc-image" id="milvus-architecture" />
   </span> <span class="img-wrapper"> <span>بنية ميلفوس</span> </span></p>
<p><em>الشكل 2 بنية ميلفوس</em></p>
<ul>
<li><p><strong>طبقة الوصول:</strong> تتألف طبقة الوصول من مجموعة من الوكلاء عديمي الحالة وتعمل كطبقة أمامية للنظام ونقطة نهاية للمستخدمين.</p></li>
<li><p><strong>خدمة المنسق:</strong> تقوم خدمة المنسق بتعيين المهام للعقد العاملة.</p></li>
<li><p><strong>العقد العاملة:</strong> العقد العاملة هي عبارة عن منفّذات غبية تتبع التعليمات من خدمة المنسق وتنفذ أوامر DML/DDL التي يتم تشغيلها من قبل المستخدم.</p></li>
<li><p><strong>التخزين:</strong> التخزين مسؤول عن ثبات البيانات. وهو يتألف من التخزين الوصفية ووسيط السجل وتخزين الكائنات.</p></li>
</ul>
<h3 id="Milvus-Deployment-Options" class="common-anchor-header">خيارات نشر ميلفوس</h3><p>يدعم ميلفوس ثلاثة أوضاع تشغيل: <a href="https://milvus.io/docs/install-overview.md">ميلفوس لايت، ومستقل، وموزع</a>.</p>
<ul>
<li><p><strong>ميلفوس لايت</strong> هي مكتبة بايثون يمكن استيرادها إلى التطبيقات المحلية. وباعتبارها نسخة خفيفة الوزن من Milvus، فهي مثالية للنماذج الأولية السريعة في دفاتر Jupyter Notebooks أو التشغيل على الأجهزة الذكية ذات الموارد المحدودة.</p></li>
<li><p><strong>Milvus Standalone هو عبارة عن</strong>نشر خادم أحادي الجهاز. إذا كان لديك عبء عمل إنتاجي ولكنك تفضل عدم استخدام Kubernetes، فإن تشغيل Milvus Standalone على جهاز واحد بذاكرة كافية يعد خيارًا جيدًا.</p></li>
<li><p>يمكن نشر<strong>Milvus Distributed</strong> على مجموعات Kubernetes. وهو يدعم مجموعات بيانات أكبر، وتوافر أعلى، وقابلية أعلى للتوسع، وهو أكثر ملاءمة لبيئات الإنتاج.</p></li>
</ul>
<p>تم تصميم Milvus منذ البداية لدعم Kubernetes، ويمكن نشره بسهولة على AWS. يمكننا استخدام خدمة Amazon Elastic Kubernetes Service (Amazon EKS) كخدمة Kubernetes مُدارة، وAmazon S3 كتخزين كائنات، وAmazon Managed Streaming for Apache Kafka (Amazon MSK) كتخزين الرسائل، وAmazon Elastic Load Balancing (Amazon ELB) كموازن تحميل لبناء مجموعة قواعد بيانات Milvus موثوقة ومرنة.</p>
<p>بعد ذلك، سنقدم إرشادات خطوة بخطوة حول نشر مجموعة Milvus باستخدام EKS والخدمات الأخرى.</p>
<h2 id="Deploying-Milvus-on-AWS-EKS" class="common-anchor-header">نشر Milvus على AWS EKS<button data-href="#Deploying-Milvus-on-AWS-EKS" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Prerequisites" class="common-anchor-header">المتطلبات الأساسية</h3><p>سنستخدم AWS CLI لإنشاء مجموعة EKS ونشر قاعدة بيانات Milvus. المتطلبات الأساسية التالية مطلوبة:</p>
<ul>
<li><p>جهاز كمبيوتر / جهاز Mac أو مثيل Amazon EC2 مع تثبيت<a href="https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"> AWS CLI</a> وتهيئته بالأذونات المناسبة. يتم تثبيت أدوات AWS CLI بشكل افتراضي إذا كنت تستخدم Amazon Linux 2 أو Amazon Linux 2023.</p></li>
<li><p><a href="https://docs.aws.amazon.com/eks/latest/userguide/getting-started.html">أدوات EKS مث</a>بتة، بما في ذلك Helm و Kubectl و eksctl، إلخ.</p></li>
<li><p>دلو أمازون S3.</p></li>
<li><p>مثيل أمازون MSK.</p></li>
</ul>
<h3 id="Considerations-when-creating-MSK" class="common-anchor-header">اعتبارات عند إنشاء MSK</h3><ul>
<li>يعتمد أحدث إصدار مستقر من ميلفوس (الإصدار 2.3.13) على خاصية <code translate="no">autoCreateTopics</code> الخاصة بكافكا. لذلك عند إنشاء MSK، نحتاج إلى استخدام تكوين مخصص وتغيير الخاصية <code translate="no">auto.create.topics.enable</code> من الخاصية الافتراضية <code translate="no">false</code> إلى <code translate="no">true</code>. بالإضافة إلى ذلك، لزيادة إنتاجية الرسائل في MSK، يوصى بزيادة قيم <code translate="no">message.max.bytes</code> و <code translate="no">replica.fetch.max.bytes</code>. راجع <a href="https://docs.aws.amazon.com/msk/latest/developerguide/msk-configuration-properties.html">تكوينات MSK المخصصة</a> للحصول على التفاصيل.</li>
</ul>
<pre><code translate="no">auto.create.topics.enable=true
message.<span class="hljs-built_in">max</span>.<span class="hljs-built_in">bytes</span>=<span class="hljs-number">10485880</span>
replica.fetch.<span class="hljs-built_in">max</span>.<span class="hljs-built_in">bytes</span>=<span class="hljs-number">20971760</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>لا يدعم Milvus المصادقة المستندة إلى دور MSK في MSK. لذلك، عند إنشاء MSK، قم بتمكين الخيار <code translate="no">SASL/SCRAM authentication</code> في تكوين الأمان، وقم بتكوين <code translate="no">username</code> و <code translate="no">password</code> في مدير أسرار AWS. راجع <a href="https://docs.aws.amazon.com/msk/latest/developerguide/msk-password.html">مصادقة بيانات اعتماد تسجيل الدخول باستخدام AWS Secrets Manager</a> للحصول على التفاصيل.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_3_Security_settings_enable_SASL_SCRAM_authentication_9cf7cdde00.png" alt="Figure 3 Security settings enable SASL SCRAM authentication.png" class="doc-image" id="figure-3-security-settings-enable-sasl-scram-authentication.png" />
   </span> <span class="img-wrapper"> <span>الشكل 3: إعدادات الأمان تمكين مصادقة SASL SCRAM.png</span> </span></p>
<p><em>الشكل 3: إعدادات الأمان: تمكين مصادقة SASL/SCRAM</em></p>
<ul>
<li>نحن بحاجة إلى تمكين الوصول إلى مجموعة أمان MSK من مجموعة أمان مجموعة EKS العنقودية أو نطاق عناوين IP.</li>
</ul>
<h3 id="Creating-an-EKS-Cluster" class="common-anchor-header">إنشاء مجموعة EKS</h3><p>هناك العديد من الطرق لإنشاء مجموعة EKS، مثل عبر وحدة التحكم، CloudFormation، eksctl، إلخ. سيوضح هذا المنشور كيفية إنشاء مجموعة EKS باستخدام eksctl.</p>
<p><code translate="no">eksctl</code> هي أداة سطر أوامر بسيطة لإنشاء وإدارة مجموعات Kubernetes على Amazon EKS. يوفر أسرع وأسهل طريقة لإنشاء مجموعة جديدة مع عقد لأمازون EKS. راجع <a href="https://eksctl.io/">موقع</a> eksctl <a href="https://eksctl.io/">على الويب</a> لمزيد من المعلومات.</p>
<ol>
<li>أولاً، قم بإنشاء ملف <code translate="no">eks_cluster.yaml</code> باستخدام مقتطف الشفرة التالي. استبدل <code translate="no">cluster-name</code> باسم المجموعة الخاصة بك، واستبدل <code translate="no">region-code</code> بمنطقة AWS حيث تريد إنشاء المجموعة واستبدل <code translate="no">private-subnet-idx</code> بالشبكات الفرعية الخاصة بك. ملاحظة: يقوم ملف التكوين هذا بإنشاء مجموعة EKS في VPC موجودة عن طريق تحديد الشبكات الفرعية الخاصة. إذا كنت ترغب في إنشاء VPC جديد، فقم بإزالة تكوين VPC والشبكات الفرعية الخاصة بك، ثم سيقوم <code translate="no">eksctl</code> تلقائيًا بإنشاء واحدة جديدة.</li>
</ol>
<pre><code translate="no">apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig

metadata:
 name: &lt;cluster-name&gt;
 region: &lt;region-code&gt;
 version: <span class="hljs-string">&quot;1.26&quot;</span>

iam:
 withOIDC: true

 serviceAccounts:
 - metadata:
     name: aws-load-balancer-controller
     namespace: kube-system
   wellKnownPolicies:
     awsLoadBalancerController: true
 - metadata:
     name: milvus-s3-access-sa
     <span class="hljs-comment"># if no namespace is set, &quot;default&quot; will be used;</span>
     <span class="hljs-comment"># the namespace will be created if it doesn&#x27;t exist already</span>
     namespace: milvus
     labels: {aws-usage: <span class="hljs-string">&quot;milvus&quot;</span>}
   attachPolicyARNs:
   - <span class="hljs-string">&quot;arn:aws:iam::aws:policy/AmazonS3FullAccess&quot;</span>

<span class="hljs-comment"># Use existed VPC to create EKS.</span>
<span class="hljs-comment"># If you don&#x27;t config vpc subnets, eksctl will automatically create a brand new VPC</span>
vpc:
 subnets:
   private:
     us-west-2a: { <span class="hljs-built_in">id</span>: &lt;private-subnet-id1&gt; }
     us-west-2b: { <span class="hljs-built_in">id</span>: &lt;private-subnet-id2&gt; }
     us-west-2c: { <span class="hljs-built_in">id</span>: &lt;private-subnet-id3&gt; }

managedNodeGroups:
 - name: ng-<span class="hljs-number">1</span>-milvus
   labels: { role: milvus }
   instanceType: m6i<span class="hljs-number">.2</span>xlarge
   desiredCapacity: <span class="hljs-number">3</span>
   privateNetworking: true
  
addons:
- name: vpc-cni <span class="hljs-comment"># no version is specified so it deploys the default version</span>
 attachPolicyARNs:
   - arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy
- name: coredns
 version: latest <span class="hljs-comment"># auto discovers the latest available</span>
- name: kube-proxy
 version: latest
- name: aws-ebs-csi-driver
 wellKnownPolicies:      <span class="hljs-comment"># add IAM and service account</span>
   ebsCSIController: true
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>بعد ذلك، قم بتشغيل الأمر <code translate="no">eksctl</code> لإنشاء مجموعة EKS.</li>
</ol>
<pre><code translate="no">eksctl create cluster -f eks_cluster.yaml
<button class="copy-code-btn"></button></code></pre>
<p>سيقوم هذا الأمر بإنشاء الموارد التالية:</p>
<ul>
<li><p>مجموعة عقدة EKS بالإصدار المحدد.</p></li>
<li><p>مجموعة عُقَد مُدارة مع ثلاث مثيلات EC2 كبيرة m6i.2xlarge.</p></li>
<li><p><a href="https://docs.aws.amazon.com/en_us/eks/latest/userguide/enable-iam-roles-for-service-accounts.html">موفر هوية IAM OIDC</a> وحساب خدمة يسمى <code translate="no">aws-load-balancer-controller</code> ، والذي سنستخدمه لاحقًا عند تثبيت <strong>وحدة تحكم AWS Load Balancer Controller</strong>.</p></li>
<li><p>مساحة اسم <code translate="no">milvus</code> وحساب خدمة <code translate="no">milvus-s3-access-sa</code> ضمن مساحة الاسم هذه. سيتم استخدام مساحة الاسم هذه لاحقًا عند تكوين S3 كمخزن كائنات لـ Milvus.</p>
<p>ملاحظة: للتبسيط، يتم منح <code translate="no">milvus-s3-access-sa</code> هنا أذونات وصول S3 كاملة إلى S3. في عمليات نشر الإنتاج، يوصى باتباع مبدأ الامتيازات الأقل ومنح حق الوصول إلى دلو S3 المحدد المستخدم لـ Milvus فقط.</p></li>
<li><p>إضافات متعددة، حيث <code translate="no">vpc-cni</code> ، <code translate="no">coredns</code> ، <code translate="no">kube-proxy</code> هي إضافات أساسية مطلوبة من قبل EKS. <code translate="no">aws-ebs-csi-driver</code> هو برنامج تشغيل AWS EBS CSI الذي يسمح لمجموعات EKS بإدارة دورة حياة وحدات تخزين Amazon EBS.</p></li>
</ul>
<p>الآن، نحتاج فقط إلى انتظار اكتمال إنشاء المجموعة.</p>
<p>انتظر حتى يكتمل إنشاء المجموعة. أثناء عملية إنشاء المجموعة، سيتم إنشاء الملف <code translate="no">kubeconfig</code> أو تحديثه تلقائيًا. يمكنك أيضًا تحديثه يدويًا عن طريق تشغيل الأمر التالي. تأكد من استبدال <code translate="no">region-code</code> بمنطقة AWS حيث يتم إنشاء الكتلة الخاصة بك، واستبدال <code translate="no">cluster-name</code> باسم الكتلة الخاصة بك.</p>
<pre><code translate="no">aws eks update-kubeconfig --region &lt;region-code&gt; --name &lt;cluster-name&gt;
<button class="copy-code-btn"></button></code></pre>
<p>بمجرد إنشاء المجموعة، يمكنك عرض العقد عن طريق تشغيل:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> nodes -A -o wide
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li>قم بإنشاء <code translate="no">ebs-sc</code> StorageClass تم تكوينه باستخدام GP3 كنوع التخزين، وقم بتعيينه كنوع التخزين الافتراضي. يستخدم Milvus موقع etcd كتخزين تعريفي ويحتاج إلى فئة التخزين هذه لإنشاء وإدارة PVCs.</li>
</ol>
<pre><code translate="no">cat &lt;&lt;EOF | kubectl apply -f -
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
 name: ebs-sc
 annotations:
   storageclass.kubernetes.io/<span class="hljs-keyword">is</span>-default-<span class="hljs-keyword">class</span>: <span class="hljs-string">&quot;true&quot;</span>
provisioner: ebs.csi.aws.com
volumeBindingMode: WaitForFirstConsumer
parameters:
 <span class="hljs-built_in">type</span>: gp3
EOF
<button class="copy-code-btn"></button></code></pre>
<p>بعد ذلك، قم بتعيين <code translate="no">gp2</code> StorageClass الأصلي إلى غير افتراضي:</p>
<pre><code translate="no">kubectl patch storage<span class="hljs-keyword">class</span> <span class="hljs-title class_">gp2</span> -p <span class="hljs-string">&#x27;{&quot;metadata&quot;: {&quot;annotations&quot;:{&quot;storageclass.kubernetes.io/is-default-class&quot;:&quot;false&quot;}}}&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<ol start="4">
<li>تثبيت وحدة تحكم AWS Load Balancer Controller. سنستخدم وحدة التحكم هذه لاحقًا لخدمة Milvus وخدمة Attu Ingress، لذا دعنا نثبتها مسبقًا.</li>
</ol>
<ul>
<li>أولاً، قم بإضافة الريبو <code translate="no">eks-charts</code> وتحديثه.</li>
</ul>
<pre><code translate="no">helm repo <span class="hljs-keyword">add</span> eks https:<span class="hljs-comment">//aws.github.io/eks-charts</span>
helm repo update
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>بعد ذلك، قم بتثبيت وحدة تحكم AWS Load Balancer Controller. استبدل <code translate="no">cluster-name</code> باسم مجموعتك. تم إنشاء حساب الخدمة المسمى <code translate="no">aws-load-balancer-controller</code> بالفعل عندما أنشأنا مجموعة EKS في الخطوات السابقة.</li>
</ul>
<pre><code translate="no">helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
 -n kube-system \
 --<span class="hljs-built_in">set</span> clusterName=&lt;cluster-name&gt; \
 --<span class="hljs-built_in">set</span> serviceAccount.create=<span class="hljs-literal">false</span> \
 --<span class="hljs-built_in">set</span> serviceAccount.name=aws-load-balancer-controller
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>تحقق مما إذا تم تثبيت وحدة التحكم بنجاح.</li>
</ul>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> deployment -n kube-system aws-load-balancer-controller
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>يجب أن يبدو الناتج كما يلي:</li>
</ul>
<pre><code translate="no">NAME                           READY   UP-TO-DATE   AVAILABLE   AGE
aws-load-balancer-controller   2/2     2            2           12m
<button class="copy-code-btn"></button></code></pre>
<h3 id="Deploying-a-Milvus-Cluster" class="common-anchor-header">نشر مجموعة ميلفوس العنقودية</h3><p>يدعم Milvus طرق نشر متعددة، مثل المشغل و Helm. المشغل أبسط، لكن Helm أكثر مباشرة ومرونة. سنستخدم Helm لنشر Milvus في هذا المثال.</p>
<p>عند نشر Milvus باستخدام Helm، يمكنك تخصيص التكوين عبر الملف <code translate="no">values.yaml</code>. انقر على <a href="https://raw.githubusercontent.com/milvus-io/milvus-helm/master/charts/milvus/values.yaml">values.yaml</a> لعرض جميع الخيارات. بشكل افتراضي، يقوم Milvus بإنشاء مينيو وبولسار داخل الكتلة كتخزين الكائنات وتخزين الرسائل، على التوالي. سنقوم بإجراء بعض التغييرات في التكوين لجعلها أكثر ملاءمة للإنتاج.</p>
<ol>
<li>أولاً، قم بإضافة ريبو Milvus Helm وتحديثه.</li>
</ol>
<pre><code translate="no">helm repo <span class="hljs-keyword">add</span> milvus https:<span class="hljs-comment">//zilliztech.github.io/milvus-helm/</span>
helm repo update
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>قم بإنشاء ملف <code translate="no">milvus_cluster.yaml</code> مع مقتطف الشفرة التالي. يقوم هذا المقتطف البرمجي بتخصيص تكوين ملف Milvus، مثل تكوين Amazon S3 كمخزن للكائنات و Amazon MSK كقائمة انتظار للرسائل. سنقدم توضيحات مفصلة وإرشادات التكوين لاحقًا.</li>
</ol>
<pre><code translate="no"><span class="hljs-comment">#####################################</span>
<span class="hljs-comment"># Section 1</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># Configure S3 as the Object Storage</span>
<span class="hljs-comment">#####################################</span>

<span class="hljs-comment"># Service account</span>
<span class="hljs-comment"># - this service account are used by External S3 access</span>
serviceAccount:
  create: false
  name: milvus-s3-access-sa

<span class="hljs-comment"># Close in-cluster minio</span>
minio:
  enabled: false

<span class="hljs-comment"># External S3</span>
<span class="hljs-comment"># - these configs are only used when `externalS3.enabled` is true</span>
externalS3:
  enabled: true
  host: <span class="hljs-string">&quot;s3.&lt;region-code&gt;.amazonaws.com&quot;</span>
  port: <span class="hljs-string">&quot;443&quot;</span>
  useSSL: true
  bucketName: <span class="hljs-string">&quot;&lt;bucket-name&gt;&quot;</span>
  rootPath: <span class="hljs-string">&quot;&lt;root-path&gt;&quot;</span>
  useIAM: true
  cloudProvider: <span class="hljs-string">&quot;aws&quot;</span>
  iamEndpoint: <span class="hljs-string">&quot;&quot;</span>

<span class="hljs-comment">#####################################</span>
<span class="hljs-comment"># Section 2</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># Configure MSK as the Message Storage</span>
<span class="hljs-comment">#####################################</span>

<span class="hljs-comment"># Close in-cluster pulsar</span>
pulsar:
  enabled: false

<span class="hljs-comment"># External kafka</span>
<span class="hljs-comment"># - these configs are only used when `externalKafka.enabled` is true</span>
externalKafka:
  enabled: true
  brokerList: <span class="hljs-string">&quot;&lt;broker-list&gt;&quot;</span>
  securityProtocol: SASL_SSL
  sasl:
    mechanisms: SCRAM-SHA-<span class="hljs-number">512</span>
    username: <span class="hljs-string">&quot;&lt;username&gt;&quot;</span>
    password: <span class="hljs-string">&quot;&lt;password&gt;&quot;</span>
    
<span class="hljs-comment">#####################################</span>
<span class="hljs-comment"># Section 3</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># Expose the Milvus service to be accessed from outside the cluster (LoadBalancer service).</span>
<span class="hljs-comment"># or access it from within the cluster (ClusterIP service). Set the service type and the port to serve it.</span>
<span class="hljs-comment">#####################################</span>
service:
  <span class="hljs-built_in">type</span>: LoadBalancer
  port: <span class="hljs-number">19530</span>
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-<span class="hljs-built_in">type</span>: external <span class="hljs-comment">#AWS Load Balancer Controller fulfills services that has this annotation</span>
    service.beta.kubernetes.io/aws-load-balancer-name : milvus-service <span class="hljs-comment">#User defined name given to AWS Network Load Balancer</span>
    service.beta.kubernetes.io/aws-load-balancer-scheme: internal <span class="hljs-comment"># internal or internet-facing, later allowing for public access via internet</span>
    service.beta.kubernetes.io/aws-load-balancer-nlb-target-<span class="hljs-built_in">type</span>: ip <span class="hljs-comment">#The Pod IPs should be used as the target IPs (rather than the node IPs)</span>
    
<span class="hljs-comment">#####################################</span>
<span class="hljs-comment"># Section 4</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># Installing Attu the Milvus management GUI</span>
<span class="hljs-comment">#####################################</span>
attu:
  enabled: true
  name: attu
  ingress:
    enabled: true
    annotations:
      kubernetes.io/ingress.<span class="hljs-keyword">class</span>: alb <span class="hljs-comment"># Annotation: set ALB ingress type</span>
      alb.ingress.kubernetes.io/scheme: internet-facing <span class="hljs-comment">#Places the load balancer on public subnets</span>
      alb.ingress.kubernetes.io/target-<span class="hljs-built_in">type</span>: ip <span class="hljs-comment">#The Pod IPs should be used as the target IPs (rather than the node IPs)</span>
      alb.ingress.kubernetes.io/group.name: attu <span class="hljs-comment"># Groups multiple Ingress resources</span>
    hosts:
      -
      
<span class="hljs-comment">#####################################</span>
<span class="hljs-comment"># Section 5</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># HA deployment of Milvus Core Components</span>
<span class="hljs-comment">#####################################</span>
rootCoordinator:
  replicas: <span class="hljs-number">2</span>
  activeStandby:
    enabled: true  <span class="hljs-comment"># Enable active-standby when you set multiple replicas for root coordinator</span>
  resources:
    limits:
      cpu: <span class="hljs-number">1</span>
      memory: 2Gi
indexCoordinator:
  replicas: <span class="hljs-number">2</span>
  activeStandby:
    enabled: true  <span class="hljs-comment"># Enable active-standby when you set multiple replicas for index coordinator</span>
  resources:
    limits:
      cpu: <span class="hljs-string">&quot;0.5&quot;</span>
      memory: <span class="hljs-number">0.5</span>Gi
queryCoordinator:
  replicas: <span class="hljs-number">2</span>
  activeStandby:
    enabled: true  <span class="hljs-comment"># Enable active-standby when you set multiple replicas for query coordinator</span>
  resources:
    limits:
      cpu: <span class="hljs-string">&quot;0.5&quot;</span>
      memory: <span class="hljs-number">0.5</span>Gi
dataCoordinator:
  replicas: <span class="hljs-number">2</span>
  activeStandby:
    enabled: true  <span class="hljs-comment"># Enable active-standby when you set multiple replicas for data coordinator</span>
  resources:
    limits:
      cpu: <span class="hljs-string">&quot;0.5&quot;</span>
      memory: <span class="hljs-number">0.5</span>Gi
proxy:
  replicas: <span class="hljs-number">2</span>
  resources:
    limits:
      cpu: <span class="hljs-number">1</span>
      memory: 4Gi

<span class="hljs-comment">#####################################</span>
<span class="hljs-comment"># Section 6</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># Milvus Resource Allocation</span>
<span class="hljs-comment">#####################################</span>
queryNode:
  replicas: <span class="hljs-number">1</span>
  resources:
    limits:
      cpu: <span class="hljs-number">2</span>
      memory: 8Gi
dataNode:
  replicas: <span class="hljs-number">1</span>
  resources:
    limits:
      cpu: <span class="hljs-number">1</span>
      memory: 4Gi
indexNode:
  replicas: <span class="hljs-number">1</span>
  resources:
    limits:
      cpu: <span class="hljs-number">4</span>
      memory: 8Gi
<button class="copy-code-btn"></button></code></pre>
<p>يحتوي الكود على ستة أقسام. اتبع التعليمات التالية لتغيير التكوينات المقابلة.</p>
<p><strong>القسم 1</strong>: تكوين S3 كمخزن للكائنات. يمنح حساب الخدمة (ServiceAccount) ميلفوس حق الوصول إلى S3 (في هذه الحالة، هو <code translate="no">milvus-s3-access-sa</code> ، والذي تم إنشاؤه عندما أنشأنا مجموعة EKS). تأكد من استبدال <code translate="no">&lt;region-code&gt;</code> بمنطقة AWS حيث توجد مجموعتك. استبدل <code translate="no">&lt;bucket-name&gt;</code> باسم دلو S3 الخاص بك و <code translate="no">&lt;root-path&gt;</code> بالبادئة الخاصة بدلو S3 (يمكن ترك هذا الحقل فارغًا).</p>
<p><strong>القسم 2</strong>: تكوين MSK كمخزن رسائل. استبدل <code translate="no">&lt;broker-list&gt;</code> بعناوين نقطة النهاية المطابقة لنوع مصادقة SASL/SCRAM لـ MSK. استبدل <code translate="no">&lt;username&gt;</code> و <code translate="no">&lt;password&gt;</code> باسم المستخدم وكلمة المرور لحساب MSK. يمكنك الحصول على <code translate="no">&lt;broker-list&gt;</code> من معلومات عميل MSK، كما هو موضح في الصورة أدناه.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_4_Configure_MSK_as_the_Message_Storage_of_Milvus_a9e602e0b9.png" alt="Figure 4 Configure MSK as the Message Storage of Milvus.png" class="doc-image" id="figure-4-configure-msk-as-the-message-storage-of-milvus.png" />
   </span> <span class="img-wrapper"> <span>الشكل 4: تكوين MSK كمخزن رسائل لـ Milvus.png</span> </span></p>
<p><em>الشكل 4: تكوين MSK كمخزن للرسائل في ملفوس</em></p>
<p><strong>القسم 3:</strong> فضح خدمة ميلفوس وتمكين الوصول من خارج المجموعة. تستخدم نقطة نهاية ميلفوس خدمة من نوع ClusterIP بشكل افتراضي، والتي لا يمكن الوصول إليها إلا داخل مجموعة EKS. إذا لزم الأمر، يمكنك تغييرها إلى نوع LoadBalancer للسماح بالوصول من خارج مجموعة EKS. تستخدم خدمة نوع LoadBalancer من نوع LoadBalancer خدمة Amazon NLB كموازن تحميل. وفقًا لأفضل ممارسات الأمان، يتم تكوين <code translate="no">aws-load-balancer-scheme</code> كوضع داخلي افتراضيًا هنا، مما يعني أنه لا يُسمح إلا بالوصول إلى الإنترانت إلى Milvus. انقر <a href="https://docs.aws.amazon.com/eks/latest/userguide/network-load-balancing.html">لعرض إرشادات تكوين NLB</a>.</p>
<p><strong>القسم 4:</strong> قم بتثبيت وتكوين <a href="https://github.com/zilliztech/attu">Attu،</a> وهي أداة إدارة ميلفوس مفتوحة المصدر. تحتوي على واجهة مستخدم رسومية بديهية تتيح لك التفاعل بسهولة مع ميلفوس. نقوم بتمكين Attu، وتكوين الدخول باستخدام AWS ALB، وتعيينه على <code translate="no">internet-facing</code> بحيث يمكن الوصول إلى Attu عبر الإنترنت. انقر على <a href="https://docs.aws.amazon.com/eks/latest/userguide/alb-ingress.html">هذا المستند</a> للحصول على دليل تكوين ALB.</p>
<p><strong>القسم 5:</strong> تمكين النشر HA لمكونات ميلفوس الأساسية. يحتوي Milvus على مكونات متعددة مستقلة ومنفصلة. على سبيل المثال، تعمل خدمة المنسق كطبقة التحكم، وتتعامل مع التنسيق لمكونات الجذر والاستعلام والبيانات والفهرس. يعمل الوكيل في طبقة الوصول كنقطة نهاية الوصول إلى قاعدة البيانات. هذه المكونات الافتراضية لنسخة متماثلة واحدة فقط. يعد نشر نسخ متماثلة متعددة لمكونات الخدمة هذه ضروريًا بشكل خاص لتحسين توافر Milvus.</p>
<p><strong>ملاحظة:</strong> يتطلب النشر متعدد النسخ المتماثلة لمكونات منسق الجذر والاستعلام والبيانات والفهرس تمكين الخيار <code translate="no">activeStandby</code>.</p>
<p><strong>القسم 6:</strong> ضبط تخصيص الموارد لمكونات ملفوس لتلبية متطلبات أعباء العمل الخاصة بك. يوفر موقع Milvus الإلكتروني أيضًا <a href="https://milvus.io/tools/sizing/">أداة تحجيم</a> لتوليد اقتراحات تهيئة استنادًا إلى حجم البيانات وأبعاد المتجهات وأنواع الفهارس، إلخ. ويمكنه أيضًا إنشاء ملف تكوين Helm بنقرة واحدة فقط. التكوين التالي هو الاقتراح الذي قدمته الأداة لمليون و1024 متجه بأبعاد 1 مليون متجه ونوع فهرس HNSW.</p>
<ol>
<li>استخدم Helm لإنشاء Milvus (تم نشره في مساحة الاسم <code translate="no">milvus</code>). ملاحظة: يمكنك استبدال <code translate="no">&lt;demo&gt;</code> باسم مخصص.</li>
</ol>
<pre><code translate="no">helm install &lt;demo&gt; milvus/milvus -n milvus -f milvus_cluster.yaml
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>قم بتشغيل الأمر التالي للتحقق من حالة النشر.</li>
</ol>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> deployment -n milvus
<button class="copy-code-btn"></button></code></pre>
<p>يوضح الإخراج التالي أن مكونات Milvus كلها متوفرة، ومكونات التنسيق لها نسخ متماثلة متعددة ممكّنة.</p>
<pre><code translate="no">NAME                     READY   UP-TO-DATE   AVAILABLE   AGE
demo-milvus-attu         1/1     1            1           5m27s
demo-milvus-datacoord    2/2     2            2           5m27s
demo-milvus-datanode     1/1     1            1           5m27s
demo-milvus-indexcoord   2/2     2            2           5m27s
demo-milvus-indexnode    1/1     1            1           5m27s
demo-milvus-proxy        2/2     2            2           5m27s
demo-milvus-querycoord   2/2     2            2           5m27s
demo-milvus-querynode    1/1     1            1           5m27s
demo-milvus-rootcoord    2/2     2            2           5m27s
<button class="copy-code-btn"></button></code></pre>
<h3 id="Accessing-and-Managing-Milvus" class="common-anchor-header">الوصول إلى ميلفوس وإدارته</h3><p>لقد نجحنا حتى الآن في نشر قاعدة بيانات ميلفوس المتجهة. والآن، يمكننا الوصول إلى ميلفوس من خلال نقاط النهاية. يعرض Milvus نقاط النهاية عبر خدمات Kubernetes. يعرض Attu نقاط النهاية عبر Kubernetes Ingress.</p>
<h4 id="Accessing-Milvus-endpoints" class="common-anchor-header"><strong>الوصول إلى نقاط نهاية ميلفوس</strong></h4><p>قم بتشغيل الأمر التالي للحصول على نقاط نهاية الخدمة:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> svc -n milvus
<button class="copy-code-btn"></button></code></pre>
<p>يمكنك عرض العديد من الخدمات. يدعم Milvus منفذين، المنفذ <code translate="no">19530</code> والمنفذ <code translate="no">9091</code>:</p>
<ul>
<li>المنفذ <code translate="no">19530</code> مخصص لـ gRPC و RESTful API. وهو المنفذ الافتراضي عند الاتصال بخادم Milvus باستخدام حزم Milvus SDKs أو عملاء HTTP مختلفين.</li>
<li>المنفذ <code translate="no">9091</code> هو منفذ إدارة لجمع المقاييس، وتوصيف pprof، واختبارات الصحة داخل Kubernetes.</li>
</ul>
<p>توفر خدمة <code translate="no">demo-milvus</code> نقطة نهاية الوصول إلى قاعدة البيانات، والتي تُستخدم لإنشاء اتصال من العملاء. ويستخدم NLB كموازن تحميل الخدمة. يمكنك الحصول على نقطة نهاية الخدمة من العمود <code translate="no">EXTERNAL-IP</code>.</p>
<pre><code translate="no">NAME                     TYPE           CLUSTER-IP       EXTERNAL-IP                                               PORT(S)                          AGE
demo-etcd                ClusterIP      <span class="hljs-number">172.20</span><span class="hljs-number">.103</span><span class="hljs-number">.138</span>   &lt;none&gt;                                                    <span class="hljs-number">2379</span>/TCP,<span class="hljs-number">2380</span>/TCP                62m
demo-etcd-headless       ClusterIP      <span class="hljs-literal">None</span>             &lt;none&gt;                                                    <span class="hljs-number">2379</span>/TCP,<span class="hljs-number">2380</span>/TCP                62m
demo-milvus              LoadBalancer   <span class="hljs-number">172.20</span><span class="hljs-number">.219</span><span class="hljs-number">.33</span>    milvus-nlb-xxxx.elb.us-west-<span class="hljs-number">2.</span>amazonaws.com               <span class="hljs-number">19530</span>:<span class="hljs-number">31201</span>/TCP,<span class="hljs-number">9091</span>:<span class="hljs-number">31088</span>/TCP   62m
demo-milvus-datacoord    ClusterIP      <span class="hljs-number">172.20</span><span class="hljs-number">.214</span><span class="hljs-number">.106</span>   &lt;none&gt;                                                    <span class="hljs-number">13333</span>/TCP,<span class="hljs-number">9091</span>/TCP               62m
demo-milvus-datanode     ClusterIP      <span class="hljs-literal">None</span>             &lt;none&gt;                                                    <span class="hljs-number">9091</span>/TCP                         62m
demo-milvus-indexcoord   ClusterIP      <span class="hljs-number">172.20</span><span class="hljs-number">.106</span><span class="hljs-number">.51</span>    &lt;none&gt;                                                    <span class="hljs-number">31000</span>/TCP,<span class="hljs-number">9091</span>/TCP               62m
demo-milvus-indexnode    ClusterIP      <span class="hljs-literal">None</span>             &lt;none&gt;                                                    <span class="hljs-number">9091</span>/TCP                         62m
demo-milvus-querycoord   ClusterIP      <span class="hljs-number">172.20</span><span class="hljs-number">.136</span><span class="hljs-number">.213</span>   &lt;none&gt;                                                    <span class="hljs-number">19531</span>/TCP,<span class="hljs-number">9091</span>/TCP               62m
demo-milvus-querynode    ClusterIP      <span class="hljs-literal">None</span>             &lt;none&gt;                                                    <span class="hljs-number">9091</span>/TCP                         62m
demo-milvus-rootcoord    ClusterIP      <span class="hljs-number">172.20</span><span class="hljs-number">.173</span><span class="hljs-number">.98</span>    &lt;none&gt;                                                    <span class="hljs-number">53100</span>/TCP,<span class="hljs-number">9091</span>/TCP               62m
<button class="copy-code-btn"></button></code></pre>
<h4 id="Managing-Milvus-using-Attu" class="common-anchor-header"><strong>إدارة ميلفوس باستخدام أتو</strong></h4><p>كما هو موضح من قبل، قمنا بتثبيت Attu لإدارة ميلفوس. قم بتشغيل الأمر التالي للحصول على نقطة النهاية:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> ingress -n milvus
<button class="copy-code-btn"></button></code></pre>
<p>يمكنك رؤية مدخل يسمى <code translate="no">demo-milvus-attu</code> ، حيث العمود <code translate="no">ADDRESS</code> هو عنوان URL الخاص بالوصول.</p>
<pre><code translate="no">NAME            CLASS   HOSTS   ADDRESS                                     PORTS   AGE
demo-milvus-attu   &lt;none&gt;   *       k8s-attu-xxxx.us-west-2.elb.amazonaws.com   80      27s
<button class="copy-code-btn"></button></code></pre>
<p>افتح عنوان الدخول في المتصفح وشاهد الصفحة التالية. انقر على <strong>اتصال</strong> لتسجيل الدخول.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_5_Log_in_to_your_Attu_account_bde25a6da5.png" alt="Figure 5 Log in to your Attu account.png" class="doc-image" id="figure-5-log-in-to-your-attu-account.png" />
   </span> <span class="img-wrapper"> <span>الشكل 5 تسجيل الدخول إلى حساب أتو الخاص بك.png</span> </span></p>
<p><em>الشكل 5: تسجيل الدخول إلى حساب أتو الخاص بك</em></p>
<p>بعد تسجيل الدخول، يمكنك إدارة قواعد بيانات ملفوس من خلال أتو.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_6_The_Attu_interface_3e818e6833.png" alt="Figure 6 The Attu interface.png" class="doc-image" id="figure-6-the-attu-interface.png" />
   </span> <span class="img-wrapper"> <span>الشكل 6: واجهة أتو. png</span> </span></p>
<p>الشكل 6: واجهة أتو</p>
<h2 id="Testing-the-Milvus-vector-database" class="common-anchor-header">اختبار قاعدة بيانات ميلفوس المتجهة<button data-href="#Testing-the-Milvus-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>سنستخدم كود <a href="https://milvus.io/docs/example_code.md">مثال</a> ميلفوس لاختبار ما إذا كانت قاعدة بيانات ميلفوس تعمل بشكل صحيح. أولاً، قم بتحميل كود المثال <code translate="no">hello_milvus.py</code> باستخدام الأمر التالي:</p>
<pre><code translate="no">wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/pymilvus/master/examples/hello_milvus.py</span>
<button class="copy-code-btn"></button></code></pre>
<p>قم بتعديل المضيف في كود المثال إلى نقطة نهاية خدمة ميلفوس.</p>
<pre><code translate="no"><span class="hljs-built_in">print</span>(fmt.<span class="hljs-built_in">format</span>(<span class="hljs-string">&quot;start connecting to Milvus&quot;</span>))
connections.connect(<span class="hljs-string">&quot;default&quot;</span>, host=<span class="hljs-string">&quot;milvus-nlb-xxx.elb.us-west-2.amazonaws.com&quot;</span>, port=<span class="hljs-string">&quot;19530&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>قم بتشغيل الكود:</p>
<pre><code translate="no">python3 hello_milvus.py
<button class="copy-code-btn"></button></code></pre>
<p>إذا أرجع النظام النتيجة التالية، فهذا يشير إلى أن ميلفوس يعمل بشكل طبيعي.</p>
<pre><code translate="no">=== start connecting to <span class="hljs-title class_">Milvus</span>     ===
<span class="hljs-title class_">Does</span> collection hello_milvus exist <span class="hljs-keyword">in</span> <span class="hljs-title class_">Milvus</span>: <span class="hljs-title class_">False</span>
=== <span class="hljs-title class_">Create</span> collection <span class="hljs-string">`hello_milvus`</span> ===
=== <span class="hljs-title class_">Start</span> inserting entities       ===
<span class="hljs-title class_">Number</span> <span class="hljs-keyword">of</span> entities <span class="hljs-keyword">in</span> <span class="hljs-title class_">Milvus</span>: <span class="hljs-number">3000</span>
=== <span class="hljs-title class_">Start</span> <span class="hljs-title class_">Creating</span> index <span class="hljs-variable constant_">IVF_FLAT</span>  ===
=== <span class="hljs-title class_">Start</span> loading                  ===
<button class="copy-code-btn"></button></code></pre>
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
    </button></h2><p>يقدم هذا المنشور <a href="https://milvus.io/intro">Milvus،</a> إحدى أكثر قواعد البيانات المتجهة مفتوحة المصدر شيوعًا، ويوفر دليلًا حول نشر Milvus على AWS باستخدام الخدمات المدارة مثل Amazon EKS و S3 و MSK و ELB لتحقيق مرونة وموثوقية أكبر.</p>
<p>كمكون أساسي لأنظمة GenAI المختلفة، لا سيما الجيل المعزز للاسترجاع (RAG)، يدعم Milvus ويتكامل مع مجموعة متنوعة من نماذج وأطر عمل GenAI السائدة، بما في ذلك Amazon Sagemaker وPyTorch وPyTorch و HuggingFace وLlamaIndex وLangChain. ابدأ رحلة ابتكار GenAI مع Milvus اليوم!</p>
<h2 id="References" class="common-anchor-header">المراجع<button data-href="#References" class="anchor-icon" translate="no">
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
<li><a href="https://docs.aws.amazon.com/eks/latest/userguide/getting-started.html">دليل مستخدم Amazon EKS</a></li>
<li><a href="https://milvus.io/">الموقع الرسمي لميلفوس</a></li>
<li><a href="https://github.com/milvus-io/milvus">مستودع Milvus GitHub Milvus</a></li>
<li><a href="https://eksctl.io/">الموقع الرسمي ل eksctl</a></li>
</ul>
