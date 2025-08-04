---
id: deploying-milvus-on-kubernetes-just-got-easier-with-the-milvus-operator.md
title: نشر Milvus على Kubernetes أصبح أسهل مع مشغل Milvus
author: Min Yin
date: 2025-08-04T00:00:00.000Z
desc: >-
  مشغل Milvus Operator هو أداة إدارة أصلية لـ Kubernetes تعمل على أتمتة دورة
  الحياة الكاملة لعمليات نشر قاعدة بيانات Milvus vector.
cover: >-
  https://assets.zilliz.com/Deploying_Milvus_on_Kubernetes_Just_Got_Easier_with_the_Milvus_Operator_1f6f48e55c.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus Operator, Kubernetes, How to deploy Milvus on Kubernetes'
meta_title: |
  Deploy Milvus on K8s Just Got Easier with the Milvus Operator 
origin: >-
  https://milvus.io/blog/deploying-milvus-on-kubernetes-just-got-easier-with-the-milvus-operator.md
---
<p>لا ينبغي أن يبدو إعداد مجموعة Milvus جاهزة للإنتاج مثل نزع فتيل قنبلة. ومع ذلك، فإن أي شخص قام بتهيئة عمليات نشر Kubernetes يدويًا لقواعد البيانات المتجهة يعرف ما يجب القيام به: العشرات من ملفات YAML، وإدارة التبعية المعقدة، وهذا الشعور بالغرق عندما ينقطع شيء ما في الساعة 2 صباحًا ولا تكون متأكدًا من أي من ملفات التكوين ال 47 هو السبب.</p>
<p>يتضمن النهج التقليدي لنشر Milvus تنسيق خدمات متعددة -etcd لتخزين البيانات الوصفية وPulsar لترتيب الرسائل وMinIO لتخزين الكائنات ومكونات Milvus المختلفة نفسها. تتطلب كل خدمة تكوينًا دقيقًا وتسلسلًا مناسبًا لبدء التشغيل وصيانة مستمرة. وعند توسيع نطاق ذلك عبر بيئات أو مجموعات متعددة، يصبح التعقيد التشغيلي مربكًا للغاية.</p>
<p>هذا هو المكان الذي يغير فيه <a href="https://github.com/zilliztech/milvus-operator"><strong>مشغل Milvus</strong></a> اللعبة بشكل أساسي. فبدلاً من إدارة البنية التحتية يدوياً، يمكنك وصف ما تريد، ويتولى المشغّل كيفية القيام بذلك.</p>
<h2 id="What-is-the-Milvus-Operator" class="common-anchor-header">ما هو مشغل ميلفوس؟<button data-href="#What-is-the-Milvus-Operator" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/install_cluster-milvusoperator.md"><strong>مشغّل</strong></a> Milvus<a href="https://milvus.io/docs/install_cluster-milvusoperator.md"><strong>Operator</strong></a> هو أداة إدارة Kubernetes أصلية تعمل على أتمتة دورة الحياة الكاملة لعمليات نشر قاعدة بيانات Milvus المتجهة. وهي مبنية على نمط مشغل Kubernetes، وهي تلخص سنوات من المعرفة التشغيلية حول تشغيل Milvus في الإنتاج وتقنين تلك الخبرة في برنامج يعمل جنبًا إلى جنب مع مجموعتك.</p>
<p>فكّر في الأمر على أنه وجود مسؤول Milvus خبير لا ينام أبدًا، ولا يرتكب أخطاءً إملائية أبدًا، ولديه ذاكرة مثالية لكل تفاصيل التكوين. يراقب المشغّل باستمرار صحة مجموعتك، ويتعامل تلقائيًا مع قرارات التوسع، ويدير الترقيات دون توقف، ويتعافى من الأعطال بشكل أسرع من أي مشغل بشري.</p>
<p>يوفر المشغّل في جوهره أربع قدرات أساسية.</p>
<ul>
<li><p><strong>النشر الآلي</strong>: إعداد مجموعة Milvus كاملة الوظائف ببيان واحد.</p></li>
<li><p><strong>إدارة دورة الحياة</strong>: أتمتة الترقيات والتوسع الأفقي وتفكيك الموارد بترتيب محدد وآمن.</p></li>
<li><p><strong>المراقبة المدمجة وفحوصات الصحة</strong>: مراقبة حالة مكونات Milvus وتوابعها ذات الصلة باستمرار، بما في ذلك etcd وPulsar وMinIO.</p></li>
<li><p><strong>أفضل الممارسات التشغيلية بشكل افتراضي</strong>: تطبيق أنماط Kubernetes الأصلية التي تضمن الموثوقية دون الحاجة إلى معرفة عميقة بالمنصة.</p></li>
</ul>
<h3 id="Understanding-the-Kubernetes-Operator-Pattern" class="common-anchor-header">فهم نمط مشغّل Kubernetes</h3><p>قبل أن نستكشف مزايا مشغّل ميلفوس، دعونا أولاً نفهم الأساس الذي بُني عليه: <strong>نمط مش</strong>غّل <strong>Kubernetes.</strong></p>
<p>يساعد نمط مشغل Kubernetes في إدارة التطبيقات المعقدة التي تحتاج إلى أكثر من ميزات Kubernetes الأساسية. يتكون المشغل من ثلاثة أجزاء رئيسية:</p>
<ul>
<li><p>تتيح لك<strong>تعريفات الموارد المخصصة</strong> وصف تطبيقك باستخدام ملفات تكوين على غرار Kubernetes.</p></li>
<li><p>تراقب<strong>وحدة التحكم</strong> هذه التكوينات وتقوم بإجراء التغييرات اللازمة على مجموعتك.</p></li>
<li><p>تضمن<strong>إدارة الحالة</strong> تطابق مجموعتك مع ما طلبته وتصلح أي اختلافات.</p></li>
</ul>
<p>هذا يعني أنه يمكنك وصف نشر Milvus الخاص بك بطريقة مألوفة، ويتولى المشغل جميع الأعمال التفصيلية لإنشاء الكبسولات وإعداد الشبكات وإدارة دورة الحياة...</p>
<h2 id="How-the-Milvus-Operator-Works" class="common-anchor-header">كيف يعمل مشغل ميلفوس<button data-href="#How-the-Milvus-Operator-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>يتبع مشغل Milvus عملية مباشرة تجعل إدارة قاعدة البيانات أبسط بكثير. دعونا نفصل النموذج التشغيلي الأساسي لمشغل ميلفوس:</p>
<ol>
<li><p><strong>المورد المخصص (CR):</strong> يقوم المستخدمون بتعريف نشر Milvus باستخدام ملف CR (على سبيل المثال، النوع: <code translate="no">Milvus</code>). يتضمن هذا الملف تكوينات مثل وضع المجموعة وإصدار الصورة ومتطلبات الموارد والتبعيات.</p></li>
<li><p><strong>منطق وحدة التحكم:</strong> تراقب وحدة التحكم الخاصة بالمشغل بحثًا عن CRs جديدة أو محدثة. وبمجرد أن يكتشف أي تغيير، يقوم بتنسيق إنشاء المكونات المطلوبة - خدمات وتوابع ميلفوس مثل etcd وPulsar وMinIO.</p></li>
<li><p><strong>إدارة دورة الحياة الآلية:</strong> عند حدوث تغييرات - مثل تحديث الإصدار أو تعديل التخزين - يقوم المشغّل بإجراء تحديثات متجددة أو إعادة تكوين المكونات دون تعطيل المجموعة.</p></li>
<li><p><strong>المعالجة الذاتية:</strong> تتحقق وحدة التحكم باستمرار من صحة كل مكون. إذا تعطل شيء ما، فإنه يقوم تلقائيًا باستبدال الكبسولة أو استعادة حالة الخدمة لضمان وقت التشغيل.</p></li>
</ol>
<p>يعد هذا النهج أقوى بكثير من عمليات نشر YAML أو Helm التقليدية لأنه يوفر إدارة مستمرة بدلاً من الإعداد الأولي فقط.</p>
<h2 id="Why-Use-Milvus-Operator-Instead-of-Helm-or-YAML" class="common-anchor-header">لماذا استخدام مشغل Milvus بدلاً من Helm أو YAML؟<button data-href="#Why-Use-Milvus-Operator-Instead-of-Helm-or-YAML" class="anchor-icon" translate="no">
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
    </button></h2><p>عند نشر Milvus، يمكنك الاختيار بين ملفات YAML اليدوية أو مخططات Helm أو مشغل Milvus. لكل منهما مكانه، لكن المشغل يوفر مزايا كبيرة للعمليات الجارية.</p>
<h3 id="Operation-Automation" class="common-anchor-header">أتمتة العمليات</h3><p>تتطلب الطرق التقليدية العمل اليدوي للمهام الروتينية. التوسع يعني تحديث العديد من ملفات التكوين وتنسيق التغييرات. تحتاج الترقيات إلى تخطيط دقيق لتجنب انقطاع الخدمة. يتعامل المشغل مع هذه المهام تلقائياً. ويمكنه اكتشاف وقت الحاجة إلى القياس وإجراء التغييرات بأمان. تصبح الترقيات تحديثات تكوين بسيطة يقوم المشغل بتنفيذها مع التسلسل المناسب وإمكانيات التراجع إذا لزم الأمر.</p>
<h3 id="Better-State-Visibility" class="common-anchor-header">رؤية أفضل للحالة</h3><p>تخبر ملفات YAML Kubernetes بما تريد، لكنها لا تُظهر لك الحالة الصحية الحالية لنظامك. يساعد Helm في إدارة التكوين ولكنه لا يراقب حالة وقت تشغيل تطبيقك. يراقب المشغل باستمرار مجموعتك بأكملها. يمكنه اكتشاف مشاكل مثل مشاكل الموارد أو الاستجابات البطيئة واتخاذ إجراءات قبل أن تصبح مشاكل خطيرة. تعمل هذه المراقبة الاستباقية على تحسين الموثوقية بشكل كبير.</p>
<h3 id="Easier-Long-term-Management" class="common-anchor-header">إدارة أسهل على المدى الطويل</h3><p>تعني إدارة بيئات متعددة باستخدام ملفات YAML الحفاظ على مزامنة العديد من ملفات التكوين. حتى مع قوالب Helm، لا تزال العمليات المعقدة تتطلب تنسيقاً يدوياً كبيراً.</p>
<p>يقوم المشغّل بتغليف معرفة إدارة Milvus في التعليمات البرمجية الخاصة به. هذا يعني أنه يمكن للفرق إدارة المجموعات بفعالية دون أن يصبحوا خبراء في كل مكون. تظل الواجهة التشغيلية متسقة مع توسع بنيتك التحتية.</p>
<p>يعني استخدام المشغل اختيار نهج أكثر تلقائية لإدارة Milvus. فهو يقلل من العمل اليدوي مع تحسين الموثوقية من خلال الخبرة المدمجة - وهي مزايا ذات قيمة كبيرة حيث تصبح قواعد البيانات المتجهة أكثر أهمية للتطبيقات.</p>
<h3 id="The-Architecture-of-Milvus-Operation" class="common-anchor-header">بنية عملية ميلفوس التشغيلية</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_operator_deployment_architecture_3ff8570480.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>يصور الرسم البياني بوضوح هيكلية نشر مشغل Milvus ضمن مجموعة Kubernetes:</p>
<ul>
<li><p>اليسار (المنطقة الزرقاء): المكونات الأساسية للمشغل، بما في ذلك وحدة التحكم وMilvus-CRD.</p></li>
<li><p>اليمين (المنطقة الخضراء): المكونات المختلفة لمجموعة ميلفوس العنقودية، مثل الوكيل والمنسق والعقدة.</p></li>
<li><p>الوسط (الأسهم - "إنشاء/إدارة"): تدفق العمليات التي توضح كيفية إدارة المشغل لمجموعة ميلفوس العنقودية.</p></li>
<li><p>الأسفل (المنطقة البرتقالية): الخدمات التابعة مثل etcd و MinIO/S3/MQ.</p></li>
</ul>
<p>هذه البنية المرئية، مع الكتل الملونة المميزة والأسهم الاتجاهية، توضح بشكل فعال التفاعلات وتدفق البيانات بين المكونات المختلفة.</p>
<h2 id="Getting-Started-with-Milvus-Operator" class="common-anchor-header">الشروع في العمل مع مشغل ميلفوس<button data-href="#Getting-Started-with-Milvus-Operator" class="anchor-icon" translate="no">
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
    </button></h2><p>يوضح لك هذا الدليل التفصيلي كيفية نشر ميلفوس باستخدام المشغل. سنستخدم هذه الإصدارات في هذا الدليل.</p>
<ul>
<li><p><strong>نظام التشغيل</strong>: OpenEuler 22.03 LTS SP3 x86_64</p></li>
<li><p><strong>Kubernetes</strong>: v1.28.8</p></li>
<li><p><strong>ميلفوس</strong>: الإصدار 2.5.4</p></li>
</ul>
<h3 id="1-Prerequisites" class="common-anchor-header">(1) المتطلبات الأساسية</h3><p>تحتاج مجموعة Kubernetes الخاصة بك إلى تكوين فئة تخزين واحدة على الأقل. يمكنك التحقق مما هو متاح:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> sc
<button class="copy-code-btn"></button></code></pre>
<p>في مثالنا، لدينا خياران:</p>
<ul>
<li><p><code translate="no">local</code> (افتراضي) - يستخدم الأقراص المحلية</p></li>
<li><p><code translate="no">nfs-sc</code>- يستخدم تخزين NFS (جيد للاختبار، ولكن تجنبه في الإنتاج)</p></li>
</ul>
<pre><code translate="no">RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
<span class="hljs-built_in">local</span> (default)   openebs.io/local      Delete    WaitForFirstConsumer   <span class="hljs-literal">false</span>    284d
nfs-sc            k8s-sigs.io/nfs-...   Delete    Immediate              <span class="hljs-literal">false</span>    230d
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Installing-Milvus-Operator" class="common-anchor-header">(2) تثبيت مشغل ميلفوس</h3><p>يمكنك تثبيت المشغل باستخدام <a href="https://milvus.io/docs/install_cluster-milvusoperator.md#Install-with-Helm">Helm</a> أو <a href="https://milvus.io/docs/install_cluster-milvusoperator.md#Install-with-kubectl">kubectl</a>. سنستخدم kubectl لأنه أبسط.</p>
<p>قم بتنزيل بيان نشر المشغل:</p>
<pre><code translate="no">wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/zilliztech/milvus-operator/main/deploy/manifests/deployment.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>استبدل عنوان الصورة (اختياري):</p>
<p><strong>اختياري: استخدم مستودع صور مختلف</strong> إذا لم تتمكن من الوصول إلى DockerHub أو كنت تفضل مستودع الصور الخاص بك:</p>
<p><em>ملاحظة: عنوان مستودع الصور المقدم هنا هو لأغراض الاختبار. استبدله بعنوان مستودعك الفعلي حسب الحاجة.</em></p>
<pre><code translate="no">sed -i <span class="hljs-string">&#x27;s#milvusdb/milvus-operator:v1.2.1#registry.milvus-mirror.cn/&amp;#g&#x27;</span> deployment.<span class="hljs-property">yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>تثبيت مشغل ميلفوس:</p>
<pre><code translate="no">kubectl apply -f deployment.yaml
<button class="copy-code-btn"></button></code></pre>
<p>بعد التثبيت، يجب أن ترى مخرجات مشابهة ل:</p>
<pre><code translate="no">namespace/milvus-operator created
serviceaccount/milvus-operator created
customresourcedefinition.apiextensions.k8s.io/milvusclusters.milvus.io created
customresourcedefinition.apiextensions.k8s.io/milvuses.milvus.io created
customresourcedefinition.apiextensions.k8s.io/milvusupgrades.milvus.io created
clusterrole.rbac.authorization.k8s.io/milvus-operator-manager-role created
clusterrolebinding.rbac.authorization.k8s.io/milvus-operator-manager-rolebinding created
role.rbac.authorization.k8s.io/milvus-operator-leader-election-role created
rolebinding.rbac.authorization.k8s.io/milvus-operator-leader-election-rolebinding created
service/milvus-operator-metrics-service created
service/milvus-operator-webhook-service created
deployment.apps/milvus-operator created
<button class="copy-code-btn"></button></code></pre>
<p>تحقق من نشر مشغل Milvus وموارد جراب Milvus:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> deployment,pod -n milvus-<span class="hljs-keyword">operator</span>
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">NAME                              READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/milvus-operator   1/1     1            1           10m
NAME                                   READY   STATUS        RESTARTS   AGE
pod/milvus-operator-54d4fb854b-7hprh   1/1     Running       0          97s
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Deploying-the-Milvus-Cluster" class="common-anchor-header">(3) نشر مجموعة ميلفوس العنقودية</h3><p>بمجرد تشغيل جراب مشغل Milvus، يمكنك نشر مجموعة Milvus العنقودية بالخطوات التالية.</p>
<p>قم بتنزيل بيان نشر مجموعة ميلفوس العنقودية:</p>
<pre><code translate="no">wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/zilliztech/milvus-operator/main/config/samples/milvus_cluster_default.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>التكوين الافتراضي هو الحد الأدنى:</p>
<pre><code translate="no"><span class="hljs-comment"># This is a sample to deploy a milvus cluster in milvus-operator&#x27;s default configurations.</span>
apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: my-release
  labels:
    app: milvus
spec:
  mode: cluster
  dependencies: {}
  components: {}
  config: {}
<button class="copy-code-btn"></button></code></pre>
<p><strong>للنشر الحقيقي، ستحتاج إلى التخصيص:</strong></p>
<ul>
<li><p>اسم الكتلة المخصص: <code translate="no">milvus-release-v25</code></p></li>
<li><p>صورة مخصصة: (لاستخدام صورة مختلفة عبر الإنترنت أو صورة محلية غير متصلة بالإنترنت) <code translate="no">registry.milvus-mirror.cn/milvusdb/milvus:v2.5.4</code></p></li>
<li><p>اسم فئة التخزين المخصصة: في البيئات التي تحتوي على فئات تخزين متعددة، قد تحتاج إلى تحديد StorageClass للمكونات الثابتة مثل MinIO و etcd. في هذا المثال، يتم استخدام <code translate="no">nfs-sc</code>.</p></li>
<li><p>موارد مخصصة: تعيين حدود وحدة المعالجة المركزية والذاكرة لمكونات Milvus. بشكل افتراضي، لا يتم تعيين أي حدود، مما قد يؤدي إلى زيادة التحميل على عقد Kubernetes الخاصة بك.</p></li>
<li><p>الحذف التلقائي للموارد ذات الصلة: بشكل افتراضي، عند حذف مجموعة Milvus، يتم الاحتفاظ بالموارد المرتبطة بها.</p></li>
</ul>
<p>لتكوين معلمات إضافية، راجع:</p>
<ul>
<li><p><a href="https://github.com/zilliztech/milvus-operator/blob/main/docs/CRD/milvus.md">تعريف الموارد المخصصة لـ Milvus</a></p></li>
<li><p><a href="https://artifacthub.io/packages/helm/apache/pulsar/3.3.0?modal=values">قيم النابض</a></p></li>
</ul>
<p>البيان المعدل هو:</p>
<pre><code translate="no">apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: milvus-release-v25
  labels:
    app: milvus
spec:
  mode: cluster
  config: {}
  components:
    image: registry.milvus-mirror.cn/milvusdb/milvus:v2.5.4
    resources:
      limits:
        cpu: 2
        memory: 8Gi
  dependencies:
    etcd:
      inCluster:
        deletionPolicy: Delete
        pvcDeletion: <span class="hljs-literal">true</span>
        values:
          global:
            imageRegistry: registry.milvus-mirror.cn
            storageClass: nfs-sc
    storage:
      inCluster:
        deletionPolicy: Delete
        pvcDeletion: <span class="hljs-literal">true</span>
        values:
          resources:
            limits:
              cpu: 2
              memory: 8Gi
          image:
            repository: registry.milvus-mirror.cn/milvusdb/minio
            tag: RELEASE.2023-03-20T20-16-18Z
          persistence:
            storageClass: nfs-sc
            accessMode: ReadWriteOnce
            size: 10Gi
    pulsar:
      inCluster:
        chartVersion: pulsar-v3
        deletionPolicy: Delete
        pvcDeletion: <span class="hljs-literal">true</span>
        values:
          existingStorageClassName: nfs-sc
          pulsar_metadata:
            image:
              repository: registry.milvus-mirror.cn/apachepulsar/pulsar
              tag: 3.0.7
          zookeeper:
            replicaCount: 3
            volumes:
              data:
                size: 5Gi
                storageClassName: nfs-sc
          bookkeeper:
            volumes:
              journal:
                size: 5Gi
                storageClassName: nfs-sc
              ledgers:
                size: 5Gi
                storageClassName: nfs-sc
          images:
            zookeeper:
              repository: registry.milvus-mirror.cn/apachepulsar/pulsar
              tag: 3.0.7
            proxy:
              repository: registry.milvus-mirror.cn/apachepulsar/pulsar
              tag: 3.0.7
            broker:
              repository: registry.milvus-mirror.cn/apachepulsar/pulsar
              tag: 3.0.7
            bookie:
              repository: registry.milvus-mirror.cn/apachepulsar/pulsar
              tag: 3.0.7
            autorecovery:
              repository: registry.milvus-mirror.cn/apachepulsar/pulsar
              tag: 3.0.7
<button class="copy-code-btn"></button></code></pre>
<p>نشر مجموعة ميلفوس العنقودية:</p>
<pre><code translate="no">kubectl apply -f milvus_cluster_default.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Verifying-Milvus-Cluster-Status" class="common-anchor-header">التحقق من حالة مجموعة ميلفوس العنقودية</h4><p>يقوم مشغّل Milvus أولاً بإعداد تبعيات البرامج الوسيطة لـ Milvus - مثل etcd و Zookeeper و Pulsar و MinIO - قبل نشر مكونات Milvus (مثل الوكيل والمنسق والعقد).</p>
<p>عرض عمليات النشر:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> deployment
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">NAME                                    READY   UP-TO-DATE   AVAILABLE   AGE
milvus-release-v25-milvus-datanode      1/1     1            1           52m
milvus-release-v25-milvus-indexnode     1/1     1            1           52m
milvus-release-v25-milvus-mixcoord      1/1     1            1           52m
milvus-release-v25-milvus-proxy         1/1     1            1           52m
milvus-release-v25-milvus-querynode-0   1/1     1            1           52m
milvus-release-v25-milvus-querynode-1   0/0     0            0           52m
milvus-release-v25-milvus-standalone    0/0     0            0           52m
<button class="copy-code-btn"></button></code></pre>
<p>ملاحظة خاصة:</p>
<p>قد تلاحظ أن مشغل Milvus ينشئ <code translate="no">standalone</code> ونشر <code translate="no">querynode-1</code> مع 0 نسخ متماثلة.</p>
<p>هذا مقصود. لقد أرسلنا مشكلة إلى مستودع مشغل Milvus، والرد الرسمي هو:</p>
<ul>
<li><p>a. تعمل عمليات النشر كما هو متوقع. يتم الاحتفاظ بالإصدار المستقل للسماح بالانتقال السلس من مجموعة إلى نشر مستقل دون انقطاع الخدمة.</p></li>
<li><p>b. وجود كل من <code translate="no">querynode-0</code> و <code translate="no">querynode-1</code> مفيد أثناء الترقيات المتجددة. في النهاية، سيكون واحد منهم فقط نشطًا.</p></li>
</ul>
<h4 id="Verifying-That-All-Pods-Are-Running-Correctly" class="common-anchor-header">التحقق من أن جميع الكبسولات تعمل بشكل صحيح</h4><p>بمجرد أن تصبح مجموعة ميلفوس جاهزة، تحقق من أن جميع الكبسولات تعمل كما هو متوقع:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> pods
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">NAME                                                    READY   STATUS      RESTARTS        AGE
milvus-release-v25-etcd<span class="hljs-number">-0</span>                               <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m15s
milvus-release-v25-etcd<span class="hljs-number">-1</span>                               <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m15s
milvus-release-v25-etcd<span class="hljs-number">-2</span>                               <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m15s
milvus-release-v25-milvus-datanode<span class="hljs-number">-65b</span>ff7b4d9<span class="hljs-number">-9</span>h2xv     <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">4</span>m35s
milvus-release-v25-milvus-indexnode<span class="hljs-number">-5b</span>5cbb4cdc-cxvwj    <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">4</span>m35s
milvus-release-v25-milvus-mixcoord<span class="hljs-number">-64488898b</span>5-r76rw     <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">4</span>m35s
milvus-release-v25-milvus-proxy<span class="hljs-number">-5</span>c7fbcb69-cqmq4         <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">4</span>m35s
milvus-release-v25-milvus-querynode<span class="hljs-number">-0</span>-bc6f57d64-k2wnt   <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">4</span>m35s
milvus-release-v25-minio<span class="hljs-number">-0</span>                              <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m14s
milvus-release-v25-minio<span class="hljs-number">-1</span>                              <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m14s
milvus-release-v25-minio<span class="hljs-number">-2</span>                              <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m14s
milvus-release-v25-minio<span class="hljs-number">-3</span>                              <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m14s
milvus-release-v25-pulsar-bookie<span class="hljs-number">-0</span>                      <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-bookie<span class="hljs-number">-1</span>                      <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-bookie<span class="hljs-number">-2</span>                      <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-bookie-<span class="hljs-keyword">init</span><span class="hljs-number">-5</span>zf2z             <span class="hljs-number">0</span>/<span class="hljs-number">1</span>     Completed   <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-broker<span class="hljs-number">-0</span>                      <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-broker<span class="hljs-number">-1</span>                      <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-proxy<span class="hljs-number">-0</span>                       <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-proxy<span class="hljs-number">-1</span>                       <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-pulsar-<span class="hljs-keyword">init</span>-twznd             <span class="hljs-number">0</span>/<span class="hljs-number">1</span>     Completed   <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-recovery<span class="hljs-number">-0</span>                    <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">1</span> (<span class="hljs-number">6</span>m25s ago)   <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-zookeeper<span class="hljs-number">-0</span>                   <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-zookeeper<span class="hljs-number">-1</span>                   <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-zookeeper<span class="hljs-number">-2</span>                   <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
<button class="copy-code-btn"></button></code></pre>
<h4 id="Verifying-the-StorageClass" class="common-anchor-header">التحقق من فئة التخزين</h4><p>تأكد من تطبيق فئة التخزين المخصصة (<code translate="no">nfs-sc</code>) وسعات التخزين المحددة بشكل صحيح:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> pvc
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-variable constant_">NAME</span>                                                                             <span class="hljs-variable constant_">STATUS</span>   <span class="hljs-variable constant_">VOLUME</span>                                     <span class="hljs-variable constant_">CAPACITY</span>   <span class="hljs-variable constant_">ACCESS</span> <span class="hljs-variable constant_">MODES</span>   <span class="hljs-variable constant_">STORAGECLASS</span>   <span class="hljs-variable constant_">AGE</span>
data-milvus-release-v25-etcd-<span class="hljs-number">0</span>                                                   <span class="hljs-title class_">Bound</span>    pvc-3273f9ec-819f-<span class="hljs-number">4e84</span>-bdbe-3cd9df697a5f   10Gi       <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
data-milvus-release-v25-etcd-<span class="hljs-number">1</span>                                                   <span class="hljs-title class_">Bound</span>    pvc-01743e13-a989-4aea-8fd0-632ea8b13f98   10Gi       <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
data-milvus-release-v25-etcd-<span class="hljs-number">2</span>                                                   <span class="hljs-title class_">Bound</span>    pvc-594f1a63-efba-<span class="hljs-number">4993</span>-<span class="hljs-number">89e6</span>-3ee5e333073d   10Gi       <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
<span class="hljs-keyword">export</span>-milvus-release-v25-minio-<span class="hljs-number">0</span>                                                <span class="hljs-title class_">Bound</span>    pvc-477d4e3b-69d7-4bbe-80f7-b747dc4c79f7   10Gi       <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
<span class="hljs-keyword">export</span>-milvus-release-v25-minio-<span class="hljs-number">1</span>                                                <span class="hljs-title class_">Bound</span>    pvc-b12e46fa-8d29-48fb-9ac1-98f80d67b543   10Gi       <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
<span class="hljs-keyword">export</span>-milvus-release-v25-minio-<span class="hljs-number">2</span>                                                <span class="hljs-title class_">Bound</span>    pvc-2e67893e-<span class="hljs-number">9611</span>-43dd-<span class="hljs-number">9550</span>-b3a7705699ae   10Gi       <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
<span class="hljs-keyword">export</span>-milvus-release-v25-minio-<span class="hljs-number">3</span>                                                <span class="hljs-title class_">Bound</span>    pvc-572c4565-bc38-<span class="hljs-number">4215</span>-a13c-061d9199fdea   10Gi       <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-bookie-journal-milvus-release-v25-pulsar-bookie-<span class="hljs-number">0</span>      <span class="hljs-title class_">Bound</span>    pvc-183eff99-7a87-406d-9f17-b0fb30c7c0b3   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-bookie-journal-milvus-release-v25-pulsar-bookie-<span class="hljs-number">1</span>      <span class="hljs-title class_">Bound</span>    pvc-ebe32304-7d92-44d1-b6fb-4cbaf3207d25   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-bookie-journal-milvus-release-v25-pulsar-bookie-<span class="hljs-number">2</span>      <span class="hljs-title class_">Bound</span>    pvc-2ead9186-3d44-4faa-9ae7-784be7ecf6d2   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-bookie-ledgers-milvus-release-v25-pulsar-bookie-<span class="hljs-number">0</span>      <span class="hljs-title class_">Bound</span>    pvc-ff1b632d-0a66-4c13-a3bb-2550f9307614   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-bookie-ledgers-milvus-release-v25-pulsar-bookie-<span class="hljs-number">1</span>      <span class="hljs-title class_">Bound</span>    pvc-<span class="hljs-number">57159e85</span>-bb48-48a9-<span class="hljs-number">9706</span>-7a95af8da157   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-bookie-ledgers-milvus-release-v25-pulsar-bookie-<span class="hljs-number">2</span>      <span class="hljs-title class_">Bound</span>    pvc-eb235f29-afbd-4a40-9a7d-0340a9686053   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-zookeeper-data-milvus-release-v25-pulsar-zookeeper-<span class="hljs-number">0</span>   <span class="hljs-title class_">Bound</span>    pvc-<span class="hljs-number">40e02974</span>-3b7d-4f42-bfa7-3252b7615a36   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-zookeeper-data-milvus-release-v25-pulsar-zookeeper-<span class="hljs-number">1</span>   <span class="hljs-title class_">Bound</span>    pvc-<span class="hljs-number">75904229</span>-3bbf-458e-b0e3-3982e430621b   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-zookeeper-data-milvus-release-v25-pulsar-zookeeper-<span class="hljs-number">2</span>   <span class="hljs-title class_">Bound</span>    pvc-2e068b79-75ac-4aa9-<span class="hljs-number">9e90</span>-423ff399bad0   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
<button class="copy-code-btn"></button></code></pre>
<h4 id="Verifying-Milvus-Resource-Limits" class="common-anchor-header">التحقق من حدود موارد ميلفوس</h4><p>على سبيل المثال، للتحقق من أن حدود الموارد للمكون <code translate="no">mixcoord</code> قد تم تطبيقها بشكل صحيح، قم بتشغيل:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> deployment milvus-release-v25-milvus-mixcoord -o jsonpath=<span class="hljs-string">&#x27;{.spec.template.spec.containers[*].resources.limits}&#x27;</span> | jq
{
  <span class="hljs-string">&quot;cpu&quot;</span>: <span class="hljs-string">&quot;2&quot;</span>,
  <span class="hljs-string">&quot;memory&quot;</span>: <span class="hljs-string">&quot;8Gi&quot;</span>
}
<button class="copy-code-btn"></button></code></pre>
<h4 id="Verifying-the-Custom-Image" class="common-anchor-header">التحقق من الصورة المخصصة</h4><p>تأكد من أن الصورة المخصصة الصحيحة قيد الاستخدام:</p>
<pre><code translate="no">kubectl get deployment milvus-release-v25-milvus-mixcoord -o jsonpath=<span class="hljs-string">&#x27;{.spec.template.spec.containers[0].image}&#x27;</span>
registry.milvus-mirror.cn/milvusdb/milvus:v2.5.4
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Accessing-Your-Cluster-from-Outside" class="common-anchor-header">(4) الوصول إلى مجموعتك من الخارج</h3><p>السؤال الشائع هو: كيف يمكنك الوصول إلى خدمات Milvus من خارج مجموعة Kubernetes الخاصة بك؟</p>
<p>بشكل افتراضي، تكون خدمة Milvus التي ينشرها المشغل من النوع <code translate="no">ClusterIP</code> ، مما يعني أنه لا يمكن الوصول إليها إلا داخل الكتلة. لفضحه خارجيًا، يجب عليك تحديد طريقة وصول خارجية. يختار هذا الدليل أبسط طريقة: استخدام منفذ NodePort.</p>
<p>قم بإنشاء وتحرير بيان الخدمة للوصول الخارجي:</p>
<pre><code translate="no">vi milvus-external-svc.yaml
<button class="copy-code-btn"></button></code></pre>
<p>تضمين المحتوى التالي:</p>
<pre><code translate="no">kind: Service
apiVersion: v1
metadata:
  name: milvus-release-v25-external-svc
  namespace: default
  labels:
    app: dmilvus-release-v25-external-svc
spec:
  ports:
    - name: milvus
      protocol: TCP
      port: 19530
      targetPort: 19530
      nodePort: 31530
    - name: milvus-web
      protocol: TCP
      port: 9091
      targetPort: 9091
      nodePort: 31531
  selector:
    app.kubernetes.io/component: proxy
    app.kubernetes.io/instance: milvus-release-v25
    app.kubernetes.io/name: milvus
  clusterIP:
  <span class="hljs-built_in">type</span>: NodePort
<button class="copy-code-btn"></button></code></pre>
<ol>
<li>تطبيق بيان الخدمة الخارجية:</li>
</ol>
<pre><code translate="no">kubectl apply -f milvus-external-svc.yaml
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>التحقق من حالة الخدمة الخارجية:</li>
</ol>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> svc
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">NAME                                  TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)                                                       AGE
milvus-release-v25-external-svc       NodePort    <span class="hljs-number">10.233</span><span class="hljs-number">.8</span><span class="hljs-number">.166</span>    &lt;none&gt;        <span class="hljs-number">19530</span>:<span class="hljs-number">31530</span>/TCP,<span class="hljs-number">9091</span>:<span class="hljs-number">31531</span>/TCP                                43s
milvus-release-v25-etcd               ClusterIP   <span class="hljs-number">10.233</span><span class="hljs-number">.27</span><span class="hljs-number">.134</span>   &lt;none&gt;        <span class="hljs-number">2379</span>/TCP,<span class="hljs-number">2380</span>/TCP                                             16m
milvus-release-v25-etcd-headless      ClusterIP   <span class="hljs-literal">None</span>            &lt;none&gt;        <span class="hljs-number">2379</span>/TCP,<span class="hljs-number">2380</span>/TCP                                             16m
milvus-release-v25-milvus             ClusterIP   <span class="hljs-number">10.233</span><span class="hljs-number">.55</span><span class="hljs-number">.194</span>   &lt;none&gt;        <span class="hljs-number">19530</span>/TCP,<span class="hljs-number">9091</span>/TCP                                            13m
milvus-release-v25-minio              ClusterIP   <span class="hljs-number">10.233</span><span class="hljs-number">.1</span><span class="hljs-number">.56</span>     &lt;none&gt;        <span class="hljs-number">9000</span>/TCP                                                      16m
milvus-release-v25-minio-svc          ClusterIP   <span class="hljs-literal">None</span>            &lt;none&gt;        <span class="hljs-number">9000</span>/TCP                                                      16m
milvus-release-v25-pulsar-bookie      ClusterIP   <span class="hljs-literal">None</span>            &lt;none&gt;        <span class="hljs-number">3181</span>/TCP,<span class="hljs-number">8000</span>/TCP                                             16m
milvus-release-v25-pulsar-broker      ClusterIP   <span class="hljs-literal">None</span>            &lt;none&gt;        <span class="hljs-number">8080</span>/TCP,<span class="hljs-number">6650</span>/TCP                                             16m
milvus-release-v25-pulsar-proxy       ClusterIP   <span class="hljs-number">10.233</span><span class="hljs-number">.30</span><span class="hljs-number">.132</span>   &lt;none&gt;        <span class="hljs-number">80</span>/TCP,<span class="hljs-number">6650</span>/TCP                                               16m
milvus-release-v25-pulsar-recovery    ClusterIP   <span class="hljs-literal">None</span>            &lt;none&gt;        <span class="hljs-number">8000</span>/TCP                                                      16m
milvus-release-v25-pulsar-zookeeper   ClusterIP   <span class="hljs-literal">None</span>            &lt;none&gt;        <span class="hljs-number">8000</span>/TCP,<span class="hljs-number">2888</span>/TCP,<span class="hljs-number">3888</span>/TCP,<span class="hljs-number">2181</span>/TCP                           16m
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li>الوصول إلى Milvus WebUI</li>
</ol>
<p>يوفر Milvus واجهة مستخدم رسومية مدمجة - Milvus WebUI - والتي تعزز إمكانية المراقبة بواجهة سهلة الاستخدام. استخدمها لمراقبة مقاييس مكونات Milvus وتوابعها، ومراجعة المعلومات التفصيلية عن قواعد البيانات والمجموعات، وفحص تفاصيل التكوين الكاملة. للحصول على تفاصيل إضافية، راجع <a href="https://milvus.io/docs/milvus-webui.md">وثائق Milvus WebUI الرسمية</a>.</p>
<p>بعد النشر، افتح عنوان URL التالي في متصفحك (استبدل <code translate="no">&lt;any_k8s_node_IP&gt;</code> بعنوان IP لأي عقدة Kubernetes):</p>
<p><code translate="no">http://&lt;any_k8s_node_IP&gt;:31531/webui/</code></p>
<p>سيؤدي ذلك إلى تشغيل واجهة WebUI.</p>
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
    </button></h2><p>إن <strong>مشغل Milvus</strong> هو أكثر من مجرد أداة نشر - إنه استثمار استراتيجي في التميز التشغيلي للبنية التحتية لقاعدة بيانات المتجهات. من خلال أتمتة المهام الروتينية وتضمين أفضل الممارسات في بيئة Kubernetes الخاصة بك، فإنه يحرر الفرق للتركيز على ما هو أكثر أهمية: بناء وتحسين التطبيقات القائمة على الذكاء الاصطناعي.</p>
<p>يتطلب اعتماد الإدارة القائمة على المشغّل بعض الجهد المسبق، بما في ذلك التغييرات في سير العمل وعمليات الفريق. ولكن بالنسبة للمؤسسات التي تعمل على نطاق واسع - أو تخطط لذلك - فإن المكاسب طويلة الأجل كبيرة: زيادة الموثوقية وانخفاض النفقات التشغيلية ودورات نشر أسرع وأكثر اتساقاً.</p>
<p>نظرًا لأن الذكاء الاصطناعي أصبح أساسيًا لعمليات الأعمال الحديثة، تزداد الحاجة إلى بنية تحتية قوية وقابلة للتطوير لقاعدة بيانات المتجهات. يدعم مشغل Milvus Operator هذا التطور من خلال تقديم نهج ناضج قائم على الأتمتة أولاً يتناسب مع عبء العمل لديك ويتكيف مع احتياجاتك الخاصة.</p>
<p>إذا كان فريقك يواجه تعقيدًا تشغيليًا أو يتوقع نموًا أو يريد ببساطة تقليل الإدارة اليدوية للبنية التحتية، فإن اعتماد مشغل Milvus Operator مبكرًا يمكن أن يساعد في تجنب الديون التقنية المستقبلية وتحسين مرونة النظام بشكل عام.</p>
<p>مستقبل البنية التحتية ذكي وآلي وملائم للمطورين. <strong>يجلب Milvus Operator هذا المستقبل إلى طبقة قاعدة البيانات الخاصة بك - اليوم.</strong></p>
<hr>
