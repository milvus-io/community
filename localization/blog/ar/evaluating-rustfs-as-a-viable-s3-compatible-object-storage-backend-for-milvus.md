---
id: >-
  evaluating-rustfs-as-a-viable-s3-compatible-object-storage-backend-for-milvus.md
title: >-
  توقف MinIO عن قبول تغييرات المجتمع: تقييم RustFS كواجهة خلفية لتخزين الكائنات
  متوافقة مع S3 قابلة للتطبيق في ميلفوس
author: Min Yin
date: 2026-01-14T00:00:00.000Z
cover: assets.zilliz.com/Min_IO_cover_4102d4ef61.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'object storage, S3 compatible storage, MinIO, RustFS, Milvus'
meta_title: |
  Evaluating RustFS for Milvus S3-Compatible Object Storage
desc: >-
  تعرّف على كيفية اعتماد Milvus على تخزين الكائنات المتوافق مع S3، وكيفية نشر
  RustFS كبديل MinIO في Milvus من خلال جولة عملية.
origin: >-
  https://milvus.io/blog/evaluating-rustfs-as-a-viable-s3-compatible-object-storage-backend-for-milvus.md
---
<p><em>هذا المنشور بقلم مين يين، أحد أكثر المساهمين النشطين في مجتمع ميلفوس، ويتم نشره هنا بإذن.</em></p>
<p><a href="https://github.com/minio/minio">MinIO</a> هو نظام تخزين كائنات مفتوح المصدر وعالي الأداء ومتوافق مع S3 يستخدم على نطاق واسع في الذكاء الاصطناعي/التعلم الآلي والتحليلات وأعباء العمل الأخرى كثيفة البيانات. بالنسبة للعديد من عمليات نشر <a href="https://milvus.io/">Milvus،</a> كان أيضًا الخيار الافتراضي لتخزين الكائنات. ومع ذلك، قام فريق MinIO مؤخرًا بتحديث <a href="https://github.com/minio/minio?tab=readme-ov-file">GitHub README</a> الخاص به ليشير إلى أن <strong><em>هذا المشروع لم يعد يقبل تغييرات جديدة</em></strong><em>.</em></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/minio_7b7df16860.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>في الواقع، على مدى السنوات القليلة الماضية، حولت MinIO اهتمامها تدريجيًا نحو العروض التجارية، وشددت نموذج الترخيص والتوزيع الخاص بها، وقلصت التطوير النشط في مستودع المجتمع. إن نقل المشروع مفتوح المصدر إلى وضع الصيانة هو النتيجة الطبيعية لهذا التحول الأوسع نطاقاً.</p>
<p>بالنسبة لمستخدمي Milvus الذين يعتمدون على MinIO بشكل افتراضي، من الصعب تجاهل هذا التغيير. يقع تخزين الكائنات في قلب طبقة المثابرة في Milvus، ولا تعتمد موثوقيتها بمرور الوقت على ما يعمل اليوم فحسب، بل على ما إذا كان النظام يستمر في التطور جنبًا إلى جنب مع أعباء العمل التي يدعمها.</p>
<p>على هذه الخلفية، تستكشف هذه المقالة <a href="https://github.com/rustfs/rustfs">نظام RustFS</a> كبديل محتمل. نظام RustFS هو نظام تخزين كائنات متوافق مع S3 قائم على Rust ومتوافق مع S3 ويركز على سلامة الذاكرة وتصميم الأنظمة الحديثة. لا يزال تجريبيًا، وهذه المناقشة ليست توصية إنتاج.</p>
<h2 id="The-Milvus-Architecture-and-Where-the-Object-Storage-Component-Sits" class="common-anchor-header">بنية ميلفوس وأين يقع مكوّن تخزين الكائنات<button data-href="#The-Milvus-Architecture-and-Where-the-Object-Storage-Component-Sits" class="anchor-icon" translate="no">
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
    </button></h2><p>يعتمد ميلفوس 2.6 على بنية تخزين وحوسبة منفصلة تماماً. في هذا النموذج، تتألف طبقة التخزين من ثلاثة مكونات مستقلة، يخدم كل منها دورًا مميزًا.</p>
<p>يخزن Etcd البيانات الوصفية، ويتعامل Pulsar أو Kafka مع سجلات التدفق، ويوفر تخزين الكائنات - عادةً MinIO أو خدمة متوافقة مع S3 - ثباتًا دائمًا للبيانات المتجهة وملفات الفهرس. نظرًا لفصل التخزين عن الحوسبة، يمكن ل Milvus توسيع نطاق عقد الحوسبة بشكل مستقل مع الاعتماد على واجهة تخزين خلفية مشتركة وموثوقة.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_architecture_fe897f1098.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="The-Role-of-Object-Storage-in-Milvus" class="common-anchor-header">دور تخزين الكائنات في ميلفوس</h3><p>تخزين الكائنات هو طبقة التخزين الدائمة في ميلفوس. يتم تخزين بيانات المتجه الخام كمدونات ثنائية، ويتم تخزين هياكل الفهرس مثل HNSW و IVF_FLAT هناك أيضًا.</p>
<p>هذا التصميم يجعل عقد الحوسبة عديمة الحالة. لا تقوم عقد الاستعلام بتخزين البيانات محليًا؛ وبدلاً من ذلك، فإنها تقوم بتحميل المقاطع والفهارس من تخزين الكائنات عند الطلب. ونتيجة لذلك، يمكن للعقد أن تتوسع أو تنخفض بحرية، وتتعافى بسرعة من الأعطال، وتدعم موازنة التحميل الديناميكية عبر المجموعة دون إعادة موازنة البيانات في طبقة التخزين.</p>
<pre><code translate="no">my-milvus-bucket/
├── files/                          <span class="hljs-comment"># rootPath (default)</span>
│   ├── insert_log/                 <span class="hljs-comment"># insert binlogs</span>
│   │   └── {Collection_ID}/
│   │       └── {Partition_ID}/
│   │           └── {Segment_ID}/
│   │               └── {Field_ID}/
│   │                   └── {Log_ID}     <span class="hljs-comment"># Per-field binlog files</span>
│   │
│   ├── delta_log/                  <span class="hljs-comment"># Delete binlogs</span>
│   │   └── {Collection_ID}/
│   │       └── {Partition_ID}/
│   │           └── {Segment_ID}/
│   │               └── {Log_ID}        
│   │
│   ├── stats_log/                  <span class="hljs-comment"># Statistical data (e.g., Bloom filters)</span>
│   │   └── {Collection_ID}/
│   │       └── {Partition_ID}/
│   │           └── {Segment_ID}/
│   │               └── {Field_ID}/
│   │                   └── {Log_ID}
│   │
│   └── index_files/                <span class="hljs-comment"># Index files</span>
│       └── {Build_ID}_{Index_Version}_{Segment_ID}_{Field_ID}/
│           ├── index_file_0
│           ├── index_file_1
│           └── ...
<button class="copy-code-btn"></button></code></pre>
<h3 id="Why-Milvus-Uses-the-S3-API" class="common-anchor-header">لماذا يستخدم Milvus واجهة برمجة تطبيقات S3</h3><p>بدلاً من تحديد بروتوكول تخزين مخصص، تستخدم Milvus واجهة برمجة تطبيقات S3 كواجهة تخزين كائناتها. أصبح S3 معيارًا فعليًا لتخزين الكائنات: يدعمه موفرو الخدمات السحابية الرئيسيون مثل AWS S3 و Alibaba Cloud OSS و Tencent Cloud COS، بينما الأنظمة مفتوحة المصدر مثل MinIO و Ceph RGW و SeaweedFS و RustFS متوافقة تمامًا.</p>
<p>من خلال التوحيد القياسي على واجهة برمجة تطبيقات S3، يمكن ل Milvus الاعتماد على حزم SDKs Go الناضجة والمُختبرة جيدًا بدلاً من الحفاظ على تكامل منفصل لكل واجهة تخزين خلفية. هذا التجريد يمنح المستخدمين أيضًا مرونة في النشر: MinIO للتطوير المحلي، أو تخزين الكائنات السحابية في الإنتاج، أو Ceph و RustFS للبيئات الخاصة. وطالما أن نقطة النهاية المتوافقة مع S3 متوفرة، فإن Milvus لا يحتاج إلى معرفة - أو الاهتمام - بنظام التخزين المستخدم تحتها.</p>
<pre><code translate="no"><span class="hljs-comment"># Milvus configuration file milvus.yaml</span>
minio:
 address: localhost
 port: <span class="hljs-number">9000</span>
 accessKeyID: minioadmin
 secretAccessKey: minioadmin
 useSSL: false
 bucketName: milvus-bucket
<button class="copy-code-btn"></button></code></pre>
<h2 id="Evaluating-RustFS-as-an-S3-Compatible-Object-Storage-Backend-for-Milvus" class="common-anchor-header">تقييم RustFS كواجهة خلفية لتخزين الكائنات متوافقة مع S3 ل Milvus<button data-href="#Evaluating-RustFS-as-an-S3-Compatible-Object-Storage-Backend-for-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Project-Overview" class="common-anchor-header">نظرة عامة على المشروع</h3><p>RustFS هو نظام تخزين كائنات موزع مكتوب بلغة Rust. وهو حاليًا في مرحلة ألفا (الإصدار 1.0.0.0-alpha.68) ويهدف إلى الجمع بين البساطة التشغيلية ل MinIO ونقاط قوة Rust في سلامة الذاكرة والأداء. يتوفر المزيد من التفاصيل على <a href="https://github.com/rustfs/rustfs">GitHub</a>.</p>
<p>لا يزال RustFS قيد التطوير النشط، ولم يتم إصدار وضع التوزيع الخاص به رسميًا بعد. ونتيجة لذلك، لا يوصى باستخدام RustFS للإنتاج أو أعباء العمل الحرجة في هذه المرحلة.</p>
<h3 id="Architecture-Design" class="common-anchor-header">تصميم البنية</h3><p>يتبع RustFS تصميمًا مشابهًا من الناحية المفاهيمية ل MinIO. يعرض خادم HTTP واجهة برمجة تطبيقات متوافقة مع S3، بينما يتعامل مدير الكائنات مع البيانات الوصفية للكائنات، ويكون محرك التخزين مسؤولاً عن إدارة كتلة البيانات. في طبقة التخزين، يعتمد RustFS على أنظمة الملفات القياسية مثل XFS أو ext4.</p>
<p>بالنسبة للوضع الموزع المخطط له، يعتزم RustFS استخدام إلخd لتنسيق البيانات الوصفية مع عقد RustFS المتعددة التي تشكل مجموعة. يتماشى هذا التصميم بشكل وثيق مع بنيات تخزين الكائنات الشائعة، مما يجعل RustFS مألوفًا للمستخدمين ذوي الخبرة في MinIO.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/architecture_design_852f73b2c8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Compatibility-with-Milvus" class="common-anchor-header">التوافق مع ميلفوس</h3><p>قبل التفكير في استخدام RustFS كواجهة خلفية بديلة لتخزين الكائنات، من الضروري تقييم ما إذا كانت تفي بمتطلبات التخزين الأساسية ل Milvus.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>متطلبات Milvus</strong></th><th style="text-align:center"><strong>واجهة برمجة تطبيقات S3</strong></th><th style="text-align:center"><strong>دعم RustFS</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">ثبات البيانات المتجهة</td><td style="text-align:center"><code translate="no">PutObject</code>, <code translate="no">GetObject</code></td><td style="text-align:center">✅ مدعوم بالكامل</td></tr>
<tr><td style="text-align:center">إدارة ملفات الفهرس</td><td style="text-align:center"><code translate="no">ListObjects</code>, <code translate="no">DeleteObject</code></td><td style="text-align:center">✅ مدعومة بالكامل</td></tr>
<tr><td style="text-align:center">عمليات دمج الأجزاء</td><td style="text-align:center">تحميل متعدد الأجزاء</td><td style="text-align:center">✅ مدعومة بالكامل</td></tr>
<tr><td style="text-align:center">ضمانات الاتساق</td><td style="text-align:center">قراءة قوية بعد الكتابة</td><td style="text-align:center">✅ اتساق قوي (عقدة واحدة)</td></tr>
</tbody>
</table>
<p>بناءً على هذا التقييم، يفي تطبيق واجهة برمجة تطبيقات S3 الحالية في RustFS بالمتطلبات الوظيفية الأساسية ل Milvus. وهذا يجعله مناسبًا للاختبار العملي في البيئات غير الإنتاجية.</p>
<h2 id="Hands-On-Replacing-MinIO-with-RustFS-in-Milvus" class="common-anchor-header">التدريب العملي: استبدال MinIO ب RustFS في Milvus<button data-href="#Hands-On-Replacing-MinIO-with-RustFS-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>الهدف من هذا التمرين هو استبدال خدمة تخزين كائنات MinIO الافتراضية ونشر Milvus 2.6.7 باستخدام RustFS كواجهة خلفية لتخزين الكائنات.</p>
<h3 id="Prerequisites" class="common-anchor-header">المتطلبات الأساسية</h3><ol>
<li><p>يتم تثبيت Docker و Docker Compose (الإصدار ≥ 20.10)، ويمكن للنظام سحب الصور وتشغيل الحاويات بشكل طبيعي.</p></li>
<li><p>يتوفر دليل محلي لتخزين بيانات الكائنات، مثل <code translate="no">/volume/data/</code> (أو مسار مخصص).</p></li>
<li><p>يكون المنفذ المضيف 9000 مفتوحًا للوصول الخارجي، أو يتم تكوين منفذ بديل وفقًا لذلك.</p></li>
<li><p>تعمل حاوية RustFS كمستخدم غير جذر (<code translate="no">rustfs</code>). تأكد من أن دليل بيانات المضيف مملوك لمستخدم UID 10001.</p></li>
</ol>
<h3 id="Step-1-Create-the-Data-Directory-and-Set-Permissions" class="common-anchor-header">الخطوة 1: إنشاء دليل البيانات وتعيين الأذونات</h3><pre><code translate="no"><span class="hljs-comment"># Create the project directory</span>
<span class="hljs-built_in">mkdir</span> -p milvus-rustfs &amp;&amp; <span class="hljs-built_in">cd</span> milvus-rustfs
<span class="hljs-comment"># Create the data directory</span>
<span class="hljs-built_in">mkdir</span> -p volumes/{rustfs, etcd, milvus}
<span class="hljs-comment"># Update permissions for the RustFS directory</span>
<span class="hljs-built_in">sudo</span> <span class="hljs-built_in">chown</span> -R 10001:10001 volumes/rustfs
<button class="copy-code-btn"></button></code></pre>
<p><strong>قم بتنزيل ملف تكوين Docker الرسمي</strong></p>
<pre><code translate="no">wget https://github.com/milvus-io/milvus/releases/download/v2.6.7/milvus-standalone-docker-compose.yml -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Modify-the-Object-Storage-Service" class="common-anchor-header">الخطوة 2: تعديل خدمة تخزين الكائنات</h3><p><strong>تعريف خدمة RustFS</strong></p>
<p>ملاحظة: تأكد من تطابق مفتاح الوصول والمفتاح السري مع بيانات الاعتماد التي تم تكوينها في خدمة Milvus.</p>
<pre><code translate="no">rustfs:
 container_name: milvus-rustfs
 image: registry.cn-hangzhou.aliyuncs.com/rustfs/rustfs: latest
 environment:
 RUSTFS_ACCESS_KEY: minioadmin
 RUSTFS_SECRET_KEY: minioadmin
 RUSTFS_CONSOLE_ENABLE: “<span class="hljs-literal">true</span>”
 RUSTFS_REGION: us-east-1
 <span class="hljs-comment"># RUSTFS_SERVER_DOMAINS: localhost# Optional; not required for local deployments</span>
 ports:
 - “9001:9001”
 - “9000:9000”
 volumes:
 - <span class="hljs-variable">${DOCKER_VOLUME_DIRECTORY:-.}</span>/volumes/rustfs:/data
 <span class="hljs-built_in">command</span>: &gt;
 --address :9000
 --console-enable
 /data
 healthcheck:
 <span class="hljs-built_in">test</span>: [“CMD”, “curl”, “-f”, “http://localhost:9000/health<span class="hljs-string">&quot;]
 interval: 30s
 timeout: 20s
 retries: 3
</span><button class="copy-code-btn"></button></code></pre>
<p><strong>أكمل التهيئة</strong></p>
<p>ملاحظة: يفترض تكوين التخزين في Milvus حاليًا افتراضات نمط MinIO الافتراضية ولا يسمح بعد بقيم مفاتيح الوصول المخصصة أو قيم المفاتيح السرية. عند استخدام RustFS كبديل، يجب أن يستخدم نفس بيانات الاعتماد الافتراضية التي يتوقعها Milvus.</p>
<pre><code translate="no">version: ‘3.5’
services:
 etcd:
 container_name: milvus-etcd
 image: registry.cn-hangzhou.aliyuncs.com/etcd/etcd: v3.5.25
 environment:
 - ETCD_AUTO_COMPACTION_MODE=revision
 - ETCD_AUTO_COMPACTION_RETENTION=1000
 - ETCD_QUOTA_BACKEND_BYTES=4294967296
 - ETCD_SNAPSHOT_COUNT=50000
 volumes:
 - <span class="hljs-variable">${DOCKER_VOLUME_DIRECTORY:-.}</span>/volumes/etcd:/etcd
 <span class="hljs-built_in">command</span>: etcd -advertise-client-urls=http://etcd:2379 -listen-client-urls http://0.0.0.0:2379 --data-dir /etcd
 healthcheck:
 <span class="hljs-built_in">test</span>: [“CMD”, “etcdctl”, “endpoint”, “health”]
 interval: 30s
 <span class="hljs-built_in">timeout</span>: 20s
 retries: 3
 rustfs:
 container_name: milvus-rustfs
 image: registry.cn-hangzhou.aliyuncs.com/rustfs/rustfs: latest
 environment:
 RUSTFS_ACCESS_KEY: minioadmin
 RUSTFS_SECRET_KEY: minioadmin
 RUSTFS_CONSOLE_ENABLE: “<span class="hljs-literal">true</span>”
 RUSTFS_REGION: us-east-1
 <span class="hljs-comment"># RUSTFS_SERVER_DOMAINS: localhost# Optional; not required for local deployments</span>
 ports:
 - “9001:9001”
 - “9000:9000”
 volumes:
 - <span class="hljs-variable">${DOCKER_VOLUME_DIRECTORY:-.}</span>/volumes/rustfs:/data
 <span class="hljs-built_in">command</span>: &gt;
 --address :9000
 --console-enable
 /data
 healthcheck:
 <span class="hljs-built_in">test</span>: [“CMD”, “curl”, “-f”, “http://localhost:9000/health<span class="hljs-string">&quot;]
 interval: 30s
 timeout: 20s
 retries: 3
 standalone:
 container_name: milvus-standalone
 image: registry.cn-hangzhou.aliyuncs.com/milvus/milvus: v2.6.7
 command: [”milvus“, ”run“, ”standalone“]
 security_opt:
 - seccomp: unconfined
 environment:
 MINIO_REGION: us-east-1
 ETCD_ENDPOINTS: etcd:2379
 MINIO_ADDRESS: rustfs:9000
 MINIO_ACCESS_KEY: minioadmin
 MINIO_SECRET_KEY: minioadmin
 MINIO_USE_SSL: ”false“
 MQ_TYPE: rocksmq
 volumes:
 - <span class="hljs-variable">${DOCKER_VOLUME_DIRECTORY:-.}</span>/volumes/milvus:/var/lib/milvus
 healthcheck:
 test: [”CMD“, ”curl“, ”-f“, ”http://localhost:9091/healthz&quot;</span>]
 interval: 30s
 start_period: 90s
 <span class="hljs-built_in">timeout</span>: 20s
 retries: 3
 ports:
 - “19530:19530”
 - “9091:9091”
 depends_on:
 - “etcd”
 - “rustfs”
networks:
 default:
 name: milvus
<button class="copy-code-btn"></button></code></pre>
<p><strong>بدء تشغيل الخدمات</strong></p>
<pre><code translate="no">docker-compose -f docker-compose.yaml up -d
<button class="copy-code-btn"></button></code></pre>
<p><strong>التحقق من حالة الخدمة</strong></p>
<pre><code translate="no">docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code_d64dc88a96.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>الوصول إلى واجهة مستخدم الويب RustFS</strong></p>
<p>افتح واجهة ويب RustFS في متصفحك: <a href="http://localhost:9001">http://localhost:9001</a></p>
<p>قم بتسجيل الدخول باستخدام بيانات الاعتماد الافتراضية: اسم المستخدم وكلمة المرور كلاهما minioadmin.</p>
<p><strong>اختبر خدمة Milvus</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, Collection, FieldSchema, CollectionSchema, DataType
<span class="hljs-comment"># connect to Milvus</span>
connections.connect(
 alias=<span class="hljs-string">&quot;default&quot;</span>,
 host=<span class="hljs-string">&#x27;localhost&#x27;</span>,
 port=<span class="hljs-string">&#x27;19530&#x27;</span>
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;✓ Successfully connected to Milvus!&quot;</span>)
<span class="hljs-comment"># create test collection</span>
fields = [
 FieldSchema(name=<span class="hljs-string">&quot;id&quot;</span>, dtype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">True</span>),
 FieldSchema(name=<span class="hljs-string">&quot;embedding&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">128</span>)
]
schema = CollectionSchema(fields=fields, description=<span class="hljs-string">&quot;test collection&quot;</span>)
collection = Collection(name=<span class="hljs-string">&quot;test_collection&quot;</span>, schema=schema)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;✓ Test collection created!&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;✓ RustFS verified as the S3 storage backend!&quot;</span>)

<span class="hljs-comment">### Step 3: Storage Performance Testing (Experimental)</span>

**Test Design**

Two Milvus deployments were <span class="hljs-built_in">set</span> up on identical hardware (<span class="hljs-number">16</span> cores / <span class="hljs-number">32</span> GB memory / NVMe SSD), using RustFS <span class="hljs-keyword">and</span> MinIO respectively <span class="hljs-keyword">as</span> the <span class="hljs-built_in">object</span> storage backend. The test dataset consisted of <span class="hljs-number">1</span>,<span class="hljs-number">000</span>,<span class="hljs-number">000</span> vectors <span class="hljs-keyword">with</span> <span class="hljs-number">768</span> dimensions, using an HNSW index <span class="hljs-keyword">with</span> parameters _M = 16_ <span class="hljs-keyword">and</span> _efConstruction = 200_. Data was inserted <span class="hljs-keyword">in</span> batches of <span class="hljs-number">5</span>,<span class="hljs-number">000.</span>

The following metrics were evaluated: Insert throughput, Index build time, Cold <span class="hljs-keyword">and</span> warm load time, Search latency, Storage footprint.

**Test Code**

Note: Only the core parts of the test code are shown below.

<button class="copy-code-btn"></button></code></pre>
<p>تعريف milvus_load_bench(dim=768، الصفوف=1_000_000، الدفعة=5000): المجموعة = المجموعة(...) # إدراج الاختبار t0 = time.perf_counter() ل i في النطاق(0، الصفوف، الدفعة): المجموعة.insert([rng.random((batch, dim), dtype=np.float32).tolist()]) insert_time = time.perf_counter() - t0 # إنشاء الفهرس collection.flush() collection.create_index(field_name=&quot;التضمين&quot;، index_params={&quot;index_type&quot;: &quot;HNSW&quot;، ...}) # اختبار التحميل (بداية باردة + بدايتين دافئتين) التجميع.التحرير() load_times = [] لـ i في النطاق (3): إذا i &gt; 0: collection.release(); time.sleep(2) collection.load() load_times.append(...) # اختبار الاستعلام search_times = [] لـ _ في النطاق (3): collection.search(queries, limit=10, ...)</p>
<pre><code translate="no">
**Test Command**

<button class="copy-code-btn"></button></code></pre>
<custom-h1>RustFS: --منفذ 19530 - منفذ 19530 -نقطة نهاية s3 http://localhost:9000 - مقعد دلو s3</custom-h1><custom-h1>MinIO: - المنفذ 19531 -نقطة نهاية-s3 -نقطة نهاية-s3 http://localhost:9001 -دلو-دلو-دلو-دلو-دلو</custom-h1><p>python bench.py milvus-load-bench - dim 768 - الصفوف 1000000 - الدفعة 5000 <br>
-نوع الفهرس HNSW -تكرار التحميل 3 -التحرير قبل التحميل -إجراء البحث -إسقاط ما بعد</p>
<pre><code translate="no">
**Performance Results**

- **RustFS**

<span class="hljs-function">Faster <span class="hljs-title">writes</span> (<span class="hljs-params">+<span class="hljs-number">57</span>%</span>), lower storage <span class="hljs-title">usage</span> (<span class="hljs-params">–<span class="hljs-number">57</span>%</span>), <span class="hljs-keyword">and</span> faster warm <span class="hljs-title">loads</span> (<span class="hljs-params">+<span class="hljs-number">67</span>%</span>), making it suitable <span class="hljs-keyword">for</span> write-heavy, cost-sensitive workloads. 

Much slower <span class="hljs-title">queries</span> (<span class="hljs-params"><span class="hljs-number">7.96</span> ms vs. <span class="hljs-number">1.85</span> ms, ~+<span class="hljs-number">330</span>% latency</span>) <span class="hljs-keyword">with</span> noticeable <span class="hljs-title">variance</span> (<span class="hljs-params">up to <span class="hljs-number">17.14</span> ms</span>), <span class="hljs-keyword">and</span> 43% slower index builds. Not suitable <span class="hljs-keyword">for</span> query-intensive applications.

- **MinIO**

Excellent query <span class="hljs-title">performance</span> (<span class="hljs-params">**<span class="hljs-number">1.85</span> ms** average latency</span>), mature small-<span class="hljs-keyword">file</span> <span class="hljs-keyword">and</span> random I/O optimizations, <span class="hljs-keyword">and</span> a well-established ecosystem.


|     **Metric**    |  **RustFS**  |   **MinIO**  | **Difference** |
| :---------------: | :----------: | :----------: | :------------: |
| Insert Throughput | 4,472 rows/s | 2,845 rows/s |      0.57      |
|  Index Build Time |     803 s    |     562 s    |      -43%      |
| <span class="hljs-title">Load</span> (<span class="hljs-params">Cold Start</span>) |    22.7 s    |    18.3 s    |      -24%      |
| <span class="hljs-title">Load</span> (<span class="hljs-params">Warm Start</span>) |    0.009 s   |    0.027 s   |      0.67      |
|   Search Latency  |    7.96 ms   |    1.85 ms   |    **-330%**   |
|   Storage Usage   |    7.8 GB    |    18.0 GB   |      0.57      |

RustFS significantly outperforms MinIO <span class="hljs-keyword">in</span> write performance <span class="hljs-keyword">and</span> storage efficiency, <span class="hljs-keyword">with</span> both showing roughly 57% improvement. This demonstrates the system-level advantages of the Rust ecosystem. However, the 330% gap <span class="hljs-keyword">in</span> query latency limits RustFS’s suitability <span class="hljs-keyword">for</span> query-intensive workloads.

For **production environments**, cloud-managed <span class="hljs-built_in">object</span> storage services like **AWS S3** are recommended first, <span class="hljs-keyword">as</span> they are mature, stable, <span class="hljs-keyword">and</span> require no operational effort. Self-hosted solutions are better suited to specific scenarios: RustFS <span class="hljs-keyword">for</span> cost-sensitive <span class="hljs-keyword">or</span> write-intensive workloads, MinIO <span class="hljs-keyword">for</span> query-intensive use cases, <span class="hljs-keyword">and</span> Ceph <span class="hljs-keyword">for</span> data sovereignty. With further optimization <span class="hljs-keyword">in</span> random read performance, RustFS has the potential to become a strong self-hosted option.


## Conclusion

MinIO’s decision to stop accepting <span class="hljs-keyword">new</span> community contributions <span class="hljs-keyword">is</span> disappointing <span class="hljs-keyword">for</span> many developers, but it won’t disrupt Milvus users. Milvus depends <span class="hljs-keyword">on</span> the S3 API—<span class="hljs-keyword">not</span> any specific vendor implementation—so swapping storage backends <span class="hljs-keyword">is</span> straightforward. This S3-compatibility layer <span class="hljs-keyword">is</span> intentional: it ensures Milvus stays flexible, portable, <span class="hljs-keyword">and</span> decoupled <span class="hljs-keyword">from</span> vendor <span class="hljs-keyword">lock</span>-<span class="hljs-keyword">in</span>.

For production deployments, cloud-managed services such <span class="hljs-keyword">as</span> AWS S3 <span class="hljs-keyword">and</span> Alibaba Cloud OSS remain the most reliable options. They’re mature, highly available, <span class="hljs-keyword">and</span> drastically reduce the operational load compared to running your own <span class="hljs-built_in">object</span> storage. Self-hosted systems like MinIO <span class="hljs-keyword">or</span> Ceph still make sense <span class="hljs-keyword">in</span> cost-sensitive environments <span class="hljs-keyword">or</span> <span class="hljs-keyword">where</span> data sovereignty <span class="hljs-keyword">is</span> non-negotiable, but they require significantly more engineering overhead to operate safely at scale.

RustFS <span class="hljs-keyword">is</span> interesting—Apache 2.0-licensed, Rust-based, <span class="hljs-keyword">and</span> community-driven—but it&#x27;s still early. The performance gap <span class="hljs-keyword">is</span> noticeable, <span class="hljs-keyword">and</span> the distributed mode hasn’t shipped yet. It’s <span class="hljs-keyword">not</span> production-ready today, but it’s a project worth watching <span class="hljs-keyword">as</span> it matures.

If you’re comparing <span class="hljs-built_in">object</span> storage options <span class="hljs-keyword">for</span> Milvus, evaluating MinIO replacements, <span class="hljs-keyword">or</span> weighing the operational trade-offs of different backends, we’d love to hear <span class="hljs-keyword">from</span> you.

Join our[ Discord channel](<span class="hljs-params">https://discord.com/invite/<span class="hljs-number">8u</span>yFbECzPX</span>) <span class="hljs-keyword">and</span> share your thoughts. You can also book a 20-minute one-<span class="hljs-keyword">on</span>-one session to <span class="hljs-keyword">get</span> insights, guidance, <span class="hljs-keyword">and</span> answers to your questions through[ Milvus Office Hours](<span class="hljs-params">https://milvus.io/blog/<span class="hljs-keyword">join</span>-milvus-office-hours-to-<span class="hljs-keyword">get</span>-support-<span class="hljs-keyword">from</span>-vectordb-experts.md</span>).
</span><button class="copy-code-btn"></button></code></pre>
