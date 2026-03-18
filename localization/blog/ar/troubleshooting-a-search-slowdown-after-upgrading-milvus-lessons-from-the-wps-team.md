---
id: >-
  troubleshooting-a-search-slowdown-after-upgrading-milvus-lessons-from-the-wps-team.md
title: 'استكشاف أخطاء تباطؤ البحث وإصلاحها بعد ترقية ميلفوس: دروس من فريق WPS'
author: the WPS engineering team
date: 2026-3-18
cover: assets.zilliz.com/Version_A_Warm_Background_20b93359df.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: Milvus
meta_keywords: 'Milvus upgrade, milvus-backup, Milvus search latency, Milvus troubleshooting'
meta_title: |
  Troubleshooting a Search Slowdown After Upgrading Milvus
desc: >-
  بعد ترقية Milvus من 2.2 إلى 2.5، واجه فريق WPS تراجعًا في زمن انتقال البحث
  بمعدل 3-5 أضعاف. السبب: علامة واحدة لاستعادة النسخ الاحتياطية لملفوس النسخ
  الاحتياطي التي أدت إلى تجزئة المقاطع.
origin: >-
  https://milvus.io/blog/troubleshooting-a-search-slowdown-after-upgrading-milvus-lessons-from-the-wps-team.md
---
<p><em>ساهم في هذا المنشور فريق هندسة WPS في شركة Kingsoft Office Software، الذين يستخدمون Milvus في نظام التوصيات. أثناء ترقيتهم من Milvus 2.2.16 إلى 2.5.16، زاد زمن انتقال البحث بمقدار 3 إلى 5 أضعاف. توضح هذه المقالة كيف قاموا بالتحقيق في المشكلة وإصلاحها، وقد تكون مفيدة للآخرين في المجتمع الذين يخططون لترقية مماثلة.</em></p>
<h2 id="Why-We-Upgraded-Milvus" class="common-anchor-header">لماذا قمنا بترقية ميلفوس<button data-href="#Why-We-Upgraded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>نحن جزء من فريق هندسة WPS الذي يقوم ببناء برامج الإنتاجية، ونستخدم Milvus كمحرك بحث متجه وراء البحث عن التشابه في الوقت الحقيقي في نظام التوصيات عبر الإنترنت. قامت مجموعة الإنتاج لدينا بتخزين عشرات الملايين من المتجهات، بمتوسط أبعاد 768. تم تقديم البيانات بواسطة 16 عقدة استعلام، وتم تكوين كل جراب بحدود 16 نواة وحدة معالجة مركزية وذاكرة 48 جيجابايت.</p>
<p>أثناء تشغيل Milvus 2.2.16، واجهنا مشكلة خطيرة في الاستقرار كانت تؤثر بالفعل على العمل. في ظل التزامن العالي للاستعلام، يمكن أن يتسبب <code translate="no">planparserv2.HandleCompare</code> في حدوث استثناء مؤشر فارغ، مما يتسبب في ذعر مكون الوكيل وإعادة تشغيله بشكل متكرر. كان من السهل جدًا تشغيل هذا الخطأ في سيناريوهات تزامن الاستعلامات العالية وأثر بشكل مباشر على توافر خدمة التوصيات عبر الإنترنت.</p>
<p>فيما يلي سجل أخطاء الوكيل الفعلي وتتبع المكدس من الحادثة:</p>
<pre><code translate="no">[<span class="hljs-meta">2025/12/23 10:43:13.581 +00:00</span>] [ERROR] [concurrency/pool_option.go:<span class="hljs-number">53</span>] [<span class="hljs-string">&quot;Conc pool panicked&quot;</span>]
[<span class="hljs-meta">panic=<span class="hljs-string">&quot;runtime error: invalid memory address or nil pointer dereference&quot;</span></span>]
[<span class="hljs-meta">stack=<span class="hljs-string">&quot;...
github.com/milvus-io/milvus/internal/parser/planparserv2.HandleCompare
  /go/src/github.com/milvus-io/milvus/internal/parser/planparserv2/utils.go:331
github.com/milvus-io/milvus/internal/parser/planparserv2.(*ParserVisitor).VisitEquality
  /go/src/github.com/milvus-io/milvus/internal/parser/planparserv2/parser_visitor.go:345
...
github.com/milvus-io/milvus/internal/proxy.(*queryTask).PreExecute
  /go/src/github.com/milvus-io/milvus/internal/proxy/task_query.go:271
github.com/milvus-io/milvus/internal/proxy.(*taskScheduler).processTask
  /go/src/github.com/milvus-io/milvus/internal/proxy/task_scheduler.go:455
...&quot;</span></span>]

panic: runtime error: invalid memory address <span class="hljs-keyword">or</span> nil pointer dereference [recovered]
panic: runtime error: invalid memory address <span class="hljs-keyword">or</span> nil pointer dereference
[<span class="hljs-meta">signal SIGSEGV: segmentation violation code=0x1 addr=0x8 pc=0x2f1a02a</span>]
  
goroutine <span class="hljs-number">989</span> [running]:
github.com/milvus-io/milvus/<span class="hljs-keyword">internal</span>/parser/planparserv2.HandleCompare(...)
  /go/src/github.com/milvus-io/milvus/<span class="hljs-keyword">internal</span>/parser/planparserv2/utils.go:<span class="hljs-number">331</span> +<span class="hljs-number">0x2a</span>
github.com/milvus-io/milvus/<span class="hljs-keyword">internal</span>/parser/planparserv2.(*ParserVisitor).VisitEquality(...)
  /go/src/github.com/milvus-io/milvus/<span class="hljs-keyword">internal</span>/parser/planparserv2/parser_visitor.go:<span class="hljs-number">345</span> +<span class="hljs-number">0x7e5</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>ما يظهره تتبع المكدس</strong>: حدث الذعر أثناء المعالجة المسبقة للاستعلام في Proxy، ضمن <code translate="no">queryTask.PreExecute</code>. كان مسار الاستدعاء:</p>
<p><code translate="no">taskScheduler.processTask</code> → <code translate="no">queryTask.PreExecute</code> → <code translate="no">planparserv2.CreateRetrievePlan</code> → → <code translate="no">planparserv2.HandleCompare</code></p>
<p>حدث التعطل عندما حاول <code translate="no">HandleCompare</code> الوصول إلى ذاكرة غير صالحة في العنوان <code translate="no">0x8</code> ، مما أدى إلى حدوث SIGSEGV وتسبب في تعطل عملية الوكيل.</p>
<p><strong>وللقضاء تمامًا على خطر الاستقرار هذا، قررنا ترقية المجموعة من Milvus 2.2.16 إلى 2.5.16.</strong></p>
<h2 id="Backing-Up-Data-With-milvus-backup-Before-the-Upgrade" class="common-anchor-header">النسخ الاحتياطي للبيانات باستخدام النسخ الاحتياطي لملفوس قبل الترقية<button data-href="#Backing-Up-Data-With-milvus-backup-Before-the-Upgrade" class="anchor-icon" translate="no">
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
    </button></h2><p>قبل لمس مجموعة الإنتاج، قمنا بعمل نسخة احتياطية من كل شيء باستخدام أداة النسخ الاحتياطي الرسمية <a href="https://github.com/zilliztech/milvus-backup">milvus-backup</a>. تدعم الأداة النسخ الاحتياطي والاستعادة داخل نفس المجموعة وعبر المجموعات وعبر إصدارات ميلفوس.</p>
<h3 id="Checking-Version-Compatibility" class="common-anchor-header">التحقق من توافق الإصدارات</h3><p>تحتوي أداة النسخ الاحتياطي milvus-backup على قاعدتي إصدار لعمليات <a href="https://milvus.io/docs/milvus_backup_overview.md">الاستعادة عبر الإصدارات</a>:</p>
<ol>
<li><p><strong>يجب أن تقوم المجموعة الهدف بتشغيل نفس إصدار Milvus أو إصدار أحدث.</strong> يمكن تحميل نسخة احتياطية من 2.2 إلى 2.5، ولكن ليس العكس.</p></li>
<li><p><strong>يجب أن يكون الهدف على الأقل Milvus 2.4.</strong> أهداف الاستعادة الأقدم غير مدعومة.</p></li>
</ol>
<p>مسارنا (النسخ الاحتياطي من 2.2.16، والتحميل إلى 2.5.16) يفي بكلتا القاعدتين.</p>
<table>
<thead>
<tr><th>النسخ الاحتياطي من ↓ \ استعادة إلى →</th><th>2.4</th><th>2.5</th><th>2.6</th></tr>
</thead>
<tbody>
<tr><td>2.2</td><td>✅</td><td>✅</td><td>✅</td></tr>
<tr><td>2.3</td><td>✅</td><td>✅</td><td>✅</td></tr>
<tr><td>2.4</td><td>✅</td><td>✅</td><td>✅</td></tr>
<tr><td>2.5</td><td>❌</td><td>✅</td><td>✅</td></tr>
<tr><td>2.6</td><td>❌</td><td>❌</td><td>✅</td></tr>
</tbody>
</table>
<h3 id="How-Milvus-Backup-Works" class="common-anchor-header">كيف يعمل النسخ الاحتياطي لميلفوس</h3><p>يسهل النسخ الاحتياطي لميلفوس النسخ الاحتياطي واستعادة البيانات الوصفية والمقاطع والبيانات عبر مثيلات ميلفوس. يوفر واجهات متجهة شمالاً، مثل واجهة برمجة التطبيقات وواجهة برمجة التطبيقات ووحدة Go المستندة إلى gRPC، من أجل معالجة مرنة لعمليات النسخ الاحتياطي والاستعادة.</p>
<p>يقرأ برنامج Milvus Backup البيانات الوصفية للمجموعة والمقاطع من مثيل Milvus المصدر لإنشاء نسخة احتياطية. ثم يقوم بنسخ بيانات المجموعة من المسار الجذر لمثيل Milvus المصدر وحفظها في المسار الجذر للنسخ الاحتياطي.</p>
<p>للاستعادة من نسخة احتياطية، ينشئ Milvus Backup مجموعة جديدة في مثيل Milvus الهدف استنادًا إلى بيانات تعريف المجموعة ومعلومات المقطع في النسخة الاحتياطية. ثم يقوم بنسخ بيانات النسخة الاحتياطية من المسار الجذر للنسخة الاحتياطية إلى المسار الجذر للمثيل الهدف.</p>
<h3 id="Running-the-Backup" class="common-anchor-header">تشغيل النسخ الاحتياطي</h3><p>قمنا بإعداد ملف تكوين مخصص، <code translate="no">configs/backup.yaml</code>. الحقول الرئيسية موضحة أدناه، مع إزالة القيم الحساسة:</p>
<pre><code translate="no">milvus:
  address: <span class="hljs-number">1.1</span><span class="hljs-number">.1</span><span class="hljs-number">.1</span>  <span class="hljs-comment"># Source Milvus address</span>
  port: <span class="hljs-number">19530</span>  <span class="hljs-comment"># Source Milvus port</span>
  user: root  <span class="hljs-comment"># Source Milvus username (must have backup permissions)</span>
  password: &lt;PASS&gt; <span class="hljs-comment"># Source Milvus user password</span>

  etcd:
    endpoints: <span class="hljs-string">&quot;2.2.2.1:2379,2.2.2.2:2379,2.2.2.3:2379&quot;</span> <span class="hljs-comment"># Endpoints of the etcd cluster connected to Milvus</span>
    rootPath: <span class="hljs-string">&quot;by-dev&quot;</span>  <span class="hljs-comment"># Prefix of Milvus metadata in etcd. If not modified, the default is by-dev. It is recommended to check etcd before proceeding.</span>

minio:
  <span class="hljs-comment"># Source Milvus object storage bucket configuration</span>
  storageType: <span class="hljs-string">&quot;aliyun&quot;</span> <span class="hljs-comment"># support storage type: local, minio, s3, aws, gcp, ali(aliyun), azure, tc(tencent), gcpnative</span>
  address: ks3-cn-beijing-internal.ksyuncs.com <span class="hljs-comment"># Address of MinIO/S3</span>
  port: <span class="hljs-number">443</span>   <span class="hljs-comment"># Port of MinIO/S3</span>
  accessKeyID: &lt;Source <span class="hljs-built_in">object</span> storage AK&gt;  
  secretAccessKey: &lt;Source <span class="hljs-built_in">object</span> storage SK&gt; 
  useSSL: true
  bucketName: <span class="hljs-string">&quot;&lt;Source object storage bucket name&gt;&quot;</span>
  rootPath: <span class="hljs-string">&quot;file&quot;</span> <span class="hljs-comment"># Root directory prefix under the source object storage bucket where the current Milvus data is stored. If Milvus is installed using Helm Chart, the default prefix is file. It is recommended to log in to the object storage and verify before proceeding.</span>

  <span class="hljs-comment"># Object storage bucket configuration for storing backup data</span>
  backupStorageType: <span class="hljs-string">&quot;aliyun&quot;</span> <span class="hljs-comment"># support storage type: local, minio, s3, aws, gcp, ali(aliyun), azure, tc(tencent)</span>
  backupAddress: ks3-cn-beijing-internal.ksyuncs.com <span class="hljs-comment"># Address of MinIO/S3</span>
  backupPort: <span class="hljs-number">443</span>   <span class="hljs-comment"># Port of MinIO/S3</span>
  backupAccessKeyID: &lt;Backup bucket AK&gt; 
  backupSecretAccessKey: &lt;Backup bucket SK&gt; 
  backupBucketName: &lt;Backup bucket name&gt;
  backupRootPath: <span class="hljs-string">&quot;backup&quot;</span> <span class="hljs-comment"># Root path to store backup data. Backup data will be stored in backupBucketName/backupRootPath</span>
  backupUseSSL: true <span class="hljs-comment"># Access MinIO/S3 with SSL</span>
  crossStorage: <span class="hljs-string">&quot;true&quot;</span>  <span class="hljs-comment"># Must be set to true when performing cross-storage backup</span>
<button class="copy-code-btn"></button></code></pre>
<p>ثم قمنا بتشغيل هذا الأمر</p>
<pre><code translate="no"><span class="hljs-comment"># Create a backup using milvus-backup</span>
./milvus-backup create --config configs/backup.yaml -n backup_v2216
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">milvus-backup</code> يدعم <strong>النسخ الاحتياطي الساخن،</strong> لذلك عادةً ما يكون له تأثير ضئيل على حركة المرور على الإنترنت. لا يزال التشغيل في غير ساعات الذروة أكثر أمانًا لتجنب تنازع الموارد.</p>
<h3 id="Verifying-the-Backup" class="common-anchor-header">التحقق من النسخ الاحتياطي</h3><p>بعد انتهاء النسخ الاحتياطي، تحققنا من اكتماله وصلاحيته للاستخدام. لقد تحققنا بشكل أساسي مما إذا كان عدد المجموعات والمقاطع في النسخة الاحتياطية يتطابق مع تلك الموجودة في مجموعة المصدر.</p>
<pre><code translate="no" class="language-# List backups">./milvus-backup list --config configs/backup.yaml
<span class="hljs-comment"># View backup details and confirm the number of Collections and Segments</span>
./milvus-backup get --config configs/backup.yaml -n backup_v2216
<button class="copy-code-btn"></button></code></pre>
<p>كانت متطابقة، لذا انتقلنا إلى الترقية.</p>
<h2 id="Upgrading-With-Helm-Chart" class="common-anchor-header">الترقية باستخدام مخطط هيلم<button data-href="#Upgrading-With-Helm-Chart" class="anchor-icon" translate="no">
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
    </button></h2><p>إن القفز ثلاثة إصدارات رئيسية (2.2 → 2.5) مع عشرات الملايين من المتجهات جعل الترقية الموضعية محفوفة بالمخاطر. قمنا ببناء مجموعة جديدة بدلاً من ذلك وقمنا بترحيل البيانات إليها. وبقيت المجموعة القديمة متصلة بالإنترنت من أجل التراجع.</p>
<h3 id="Deploying-the-New-Cluster" class="common-anchor-header">نشر المجموعة الجديدة</h3><p>قمنا بنشر مجموعة Milvus 2.5.16 الجديدة مع Helm:</p>
<pre><code translate="no"><span class="hljs-comment"># Add the Milvus Helm repository</span>
: helm repo add milvus https://zilliztech.github.io/milvus-helm/
helm repo update  
<span class="hljs-comment"># Check the Helm chart version corresponding to the target Milvus version</span>
: helm search repo milvus/milvus -l | grep <span class="hljs-number">2.5</span><span class="hljs-number">.16</span>
milvus/milvus        <span class="hljs-number">4.2</span><span class="hljs-number">.58</span>               <span class="hljs-number">2.5</span><span class="hljs-number">.16</span>                    Milvus <span class="hljs-keyword">is</span> an <span class="hljs-built_in">open</span>-source vector database built ...
  
<span class="hljs-comment"># Deploy the new version cluster (with mmap disabled)</span>
helm install milvus-v25 milvus/milvus \
  --namespace milvus-new \
  --values values-v25.yaml \
  --version <span class="hljs-number">4.2</span><span class="hljs-number">.58</span> \
  --wait
<button class="copy-code-btn"></button></code></pre>
<h3 id="Key-Configuration-Changes-values-v25yaml" class="common-anchor-header">تغييرات التكوين الرئيسية (<code translate="no">values-v25.yaml</code>)</h3><p>لجعل مقارنة الأداء عادلة، أبقينا المجموعة الجديدة مشابهة للمجموعة القديمة قدر الإمكان. قمنا فقط بتغيير عدد قليل من الإعدادات المهمة لعبء العمل هذا:</p>
<ul>
<li><p><strong>تعطيل Mmap</strong> (<code translate="no">mmap.enabled: false</code>): عبء عملنا الموصى به حساس لزمن الاستجابة. إذا تم تمكين Mmap، فقد تتم قراءة بعض البيانات من القرص عند الحاجة، مما قد يضيف تأخيرًا في إدخال/إخراج القرص ويسبب ارتفاعًا في زمن الاستجابة. قمنا بإيقاف تشغيله حتى تبقى البيانات بالكامل في الذاكرة ويكون زمن انتقال الاستعلام أكثر استقرارًا.</p></li>
<li><p><strong>عدد عُقد الاستعلام:</strong> أبقينا على <strong>16</strong> عقدة، كما في المجموعة القديمة</p></li>
<li><p><strong>حدود الموارد:</strong> لا تزال كل عقدة تحتوي على <strong>16 نواة لوحدة المعالجة المركزية،</strong> مثل المجموعة القديمة</p></li>
</ul>
<h3 id="Tips-for-major-version-upgrades" class="common-anchor-header">نصائح لترقيات الإصدار الرئيسي:</h3><ul>
<li><p><strong>أنشئ مجموعة جديدة بدلاً من الترقية في مكانها.</strong> يمكنك تجنب مخاطر توافق البيانات الوصفية والحفاظ على مسار استرجاع نظيف.</p></li>
<li><p><strong>تحقق من النسخ الاحتياطي قبل الترحيل.</strong> بمجرد أن تكون البيانات بتنسيق الإصدار الجديد، لا يمكنك العودة بسهولة.</p></li>
<li><p><strong>حافظ على تشغيل كلا المجموعتين أثناء عملية الترحيل.</strong> قم بتحويل حركة المرور تدريجيًا ولا تقم بإيقاف تشغيل المجموعة القديمة إلا بعد التحقق الكامل.</p></li>
</ul>
<h2 id="Migrating-Data-After-the-Upgrade-with-Milvus-Backup-Restore" class="common-anchor-header">ترحيل البيانات بعد الترقية باستخدام استعادة النسخ الاحتياطية من ميلفوس<button data-href="#Migrating-Data-After-the-Upgrade-with-Milvus-Backup-Restore" class="anchor-icon" translate="no">
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
    </button></h2><p>استخدمنا <code translate="no">milvus-backup restore</code> لتحميل النسخة الاحتياطية إلى المجموعة الجديدة. في مصطلحات milvus-backup، تعني "الاستعادة" في مصطلحات Milvus-backup "تحميل بيانات النسخ الاحتياطي إلى الكتلة المستهدفة". يجب أن يقوم الهدف بتشغيل نفس إصدار ميلفوس أو إصدار أحدث، لذا، على الرغم من الاسم، فإن عمليات الاستعادة تنقل البيانات دائمًا إلى الأمام.</p>
<h3 id="Running-the-Restore" class="common-anchor-header">تشغيل الاستعادة</h3><p>يجب أن يشير ملف تكوين الاستعادة، <code translate="no">configs/restore.yaml</code> ، إلى <strong>الكتلة الجديدة</strong> وإعدادات التخزين الخاصة بها. بدت الحقول الرئيسية هكذا:</p>
<pre><code translate="no"><span class="hljs-comment"># Restore target Milvus connection information</span>
milvus:
  address: <span class="hljs-number">1.1</span><span class="hljs-number">.1</span><span class="hljs-number">.1</span>  <span class="hljs-comment"># Milvus address</span>
  port: <span class="hljs-number">19530</span>  <span class="hljs-comment"># Milvus port</span>
  user: root  <span class="hljs-comment"># Milvus username (must have restore permissions)</span>
  password: &lt;PASS&gt; <span class="hljs-comment"># Milvus user password  </span>
  etcd:
    endpoints: <span class="hljs-string">&quot;2.2.2.1:2379,2.2.2.2:2379,2.2.2.3:2379&quot;</span> <span class="hljs-comment"># Endpoints of the etcd cluster connected to the target Milvus</span>
    rootPath: <span class="hljs-string">&quot;by-dev&quot;</span>  <span class="hljs-comment"># Prefix of Milvus metadata in etcd. If not modified, the default is by-dev. It is recommended to check etcd before proceeding.</span>

minio:
  <span class="hljs-comment"># Target Milvus object storage bucket configuration</span>
  storageType: <span class="hljs-string">&quot;aliyun&quot;</span> <span class="hljs-comment"># support storage type: local, minio, s3, aws, gcp, ali(aliyun), azure, tc(tencent), gcpnative</span>
  address: ks3-cn-beijing-internal.ksyuncs.com <span class="hljs-comment"># Address of MinIO/S3</span>
  port: <span class="hljs-number">443</span>   <span class="hljs-comment"># Port of MinIO/S3</span>
  accessKeyID: &lt;Object storage AK&gt;  
  secretAccessKey: &lt;Object storage SK&gt; 
  useSSL: true
  bucketName: <span class="hljs-string">&quot;&lt;Object storage bucket name&gt;&quot;</span>
  rootPath: <span class="hljs-string">&quot;file&quot;</span> <span class="hljs-comment"># Root directory prefix under the object storage bucket where the current Milvus data is stored. If Milvus is installed using Helm Chart, the default prefix is file. It is recommended to log in to the object storage and verify before proceeding.</span>

  <span class="hljs-comment"># Object storage bucket configuration for storing backup data</span>
  backupStorageType: <span class="hljs-string">&quot;aliyun&quot;</span> <span class="hljs-comment"># support storage type: local, minio, s3, aws, gcp, ali(aliyun), azure, tc(tencent)</span>
  backupAddress: ks3-cn-beijing-internal.ksyuncs.com <span class="hljs-comment"># Address of MinIO/S3</span>
  backupPort: <span class="hljs-number">443</span>   <span class="hljs-comment"># Port of MinIO/S3</span>
  backupAccessKeyID: &lt;Backup bucket AK&gt; 
  backupSecretAccessKey: &lt;Backup bucket SK&gt; 
  backupBucketName: &lt;Backup bucket name&gt;
  backupRootPath: <span class="hljs-string">&quot;backup&quot;</span> <span class="hljs-comment"># Root path to store backup data. Backup data will be stored in backupBucketName/backupRootPath</span>
  backupUseSSL: true <span class="hljs-comment"># Access MinIO/S3 with SSL</span>
  crossStorage: <span class="hljs-string">&quot;true&quot;</span>  <span class="hljs-comment"># Must be set to true when performing cross-storage backup</span>
<button class="copy-code-btn"></button></code></pre>
<p>ثم قمنا بعد ذلك بتشغيل</p>
<pre><code translate="no">./milvus-backup restore --config configs/restore.yaml -n backup_v2216 --rebuild_index
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">restore.yaml</code> يحتاج إلى معلومات اتصال Milvus و MinIO الخاصة بالمجموعة الجديدة حتى تتم كتابة البيانات المستعادة إلى وحدة تخزين المجموعة الجديدة.</p>
<h3 id="Checks-After-Restore" class="common-anchor-header">الفحوصات بعد الاستعادة</h3><p>بعد انتهاء الاستعادة، تحققنا من أربعة أشياء للتأكد من صحة الترحيل:</p>
<ul>
<li><p><strong>المخطط.</strong> يجب أن يكون مخطط المجموعة في المجموعة الجديدة مطابقًا تمامًا للمخطط القديم، بما في ذلك تعريفات الحقول وأبعاد المتجهات.</p></li>
<li><p><strong>إجمالي عدد الصفوف.</strong> قارنا إجمالي عدد الكيانات في المجموعتين القديمة والجديدة للتأكد من عدم فقدان أي بيانات.</p></li>
<li><p><strong>حالة الفهرس.</strong> تأكدنا من أن جميع الفهارس قد انتهت من البناء وأن حالتها قد تم ضبطها على <code translate="no">Finished</code>.</p></li>
<li><p><strong>نتائج الاستعلام.</strong> قمنا بتشغيل نفس الاستعلامات على كلا المجموعتين وقارنا المعرفات التي تم إرجاعها ودرجات المسافة للتأكد من تطابق النتائج.</p></li>
</ul>
<h2 id="Gradual-Traffic-Shift-and-the-Latency-Surprise" class="common-anchor-header">التحول التدريجي لحركة المرور ومفاجأة الكمون<button data-href="#Gradual-Traffic-Shift-and-the-Latency-Surprise" class="anchor-icon" translate="no">
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
    </button></h2><p>نقلنا حركة مرور الإنتاج إلى المجموعة الجديدة على مراحل:</p>
<table>
<thead>
<tr><th>المرحلة</th><th>حصة حركة المرور</th><th>المدة</th><th>ما شاهدناه</th></tr>
</thead>
<tbody>
<tr><td>المرحلة 1</td><td>5%</td><td>24 ساعة</td><td>زمن استجابة استعلام P99، ومعدل الخطأ، ودقة النتائج</td></tr>
<tr><td>المرحلة 2</td><td>25%</td><td>48 ساعة</td><td>زمن استجابة الاستعلام P99/P95، معدل الخطأ، استخدام وحدة المعالجة المركزية</td></tr>
<tr><td>المرحلة 3</td><td>50%</td><td>48 ساعة</td><td>مقاييس النهاية إلى النهاية، استخدام الموارد</td></tr>
<tr><td>المرحلة 4</td><td>100%</td><td>المراقبة المستمرة</td><td>استقرار المقاييس الكلية</td></tr>
</tbody>
</table>
<p>لقد أبقينا المجموعة القديمة قيد التشغيل طوال الوقت من أجل الإعادة الفورية.</p>
<p><strong>خلال هذا الطرح، اكتشفنا المشكلة: كان زمن انتقال البحث على مجموعة الإصدار 2.5.16 الجديدة أعلى بـ 3-5 مرات من مجموعة الإصدار 2.2.16 القديمة.</strong></p>
<h2 id="Finding-the-Cause-of-the-Search-Slowdown" class="common-anchor-header">العثور على سبب تباطؤ البحث<button data-href="#Finding-the-Cause-of-the-Search-Slowdown" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Step-1-Check-Overall-CPU-Usage" class="common-anchor-header">الخطوة 1: التحقق من الاستخدام الكلي لوحدة المعالجة المركزية</h3><p>بدأنا باستخدام وحدة المعالجة المركزية لكل مكون لمعرفة ما إذا كان هناك نقص في الموارد في المجموعة.</p>
<table>
<thead>
<tr><th>المكوّن</th><th>استخدام وحدة المعالجة المركزية (النوى)</th><th>تحليل</th></tr>
</thead>
<tbody>
<tr><td>عقدة الاستعلام</td><td>10.1</td><td>كان الحد الأقصى 16 مركزًا، لذا كان الاستخدام حوالي 63%. غير مستخدم بالكامل</td></tr>
<tr><td>الوكيل</td><td>0.21</td><td>منخفض جدًا</td></tr>
<tr><td>ميكسكورد</td><td>0.11</td><td>منخفض جداً</td></tr>
<tr><td>عقدة البيانات</td><td>0.14</td><td>منخفضة جداً</td></tr>
<tr><td>عقدة الفهرس</td><td>0.02</td><td>منخفضة جداً</td></tr>
</tbody>
</table>
<p>أظهر هذا أن QueryNode لا يزال لديه ما يكفي من وحدة المعالجة المركزية المتاحة. لذلك <strong>لم</strong> يكن التباطؤ <strong>ناتجًا عن نقص في وحدة المعالجة المركزية بشكل عام</strong>.</p>
<h3 id="Step-2-Check-QueryNode-Balance" class="common-anchor-header">الخطوة 2: التحقق من رصيد QueryNode</h3><p>بدت وحدة المعالجة المركزية الإجمالية على ما يرام، ولكن كان هناك <strong>اختلال واضح في توازن</strong> كودات QueryNode الفردية:</p>
<table>
<thead>
<tr><th>جراب عقدة الاستعلام</th><th>استخدام وحدة المعالجة المركزية (الأخير)</th><th>استخدام وحدة المعالجة المركزية (الحد الأقصى)</th></tr>
</thead>
<tbody>
<tr><td>كويرينود-جراب-1</td><td>8.38%</td><td>9.91%</td></tr>
<tr><td>كويرينود-بود-2</td><td>5.34%</td><td>6.85%</td></tr>
<tr><td>كويرينود-بود-3</td><td>4.37%</td><td>6.73%</td></tr>
<tr><td>كويرينود-بود-4</td><td>4.26%</td><td>5.89%</td></tr>
<tr><td>كويرينود-بود-5</td><td>3.39%</td><td>4.82%</td></tr>
<tr><td>كويرينود-بود-6</td><td>3.97%</td><td>4.56%</td></tr>
<tr><td>كويرينود-بود-7</td><td>2.65%</td><td>4.46%</td></tr>
<tr><td>كويرينود-بود-8</td><td>2.01%</td><td>3.84%</td></tr>
<tr><td>كويرينود-بود-9</td><td>3.68%</td><td>3.69%</td></tr>
</tbody>
</table>
<p>استخدم الكود-1 ما يقرب من 5 أضعاف وحدة المعالجة المركزية التي استخدمها الكود-8. هذه مشكلة لأن ميلفوس يقوم بتوزيع الاستعلام على جميع عقد الاستعلام وينتظر انتهاء الأبطأ منها. كانت بعض الكبسولات المحملة بشكل زائد تعيق كل عملية بحث.</p>
<h3 id="Step-3-Compare-Segment-Distribution" class="common-anchor-header">الخطوة 3: مقارنة توزيع الشرائح</h3><p>يشير التحميل غير المتساوي عادةً إلى توزيع غير متساوٍ للبيانات، لذا قارنا تخطيطات المقاطع بين المجموعتين القديمة والجديدة.</p>
<p><strong>تخطيط المقطع v2.2.16 (إجمالي 13 مقطعًا)</strong></p>
<table>
<thead>
<tr><th>نطاق عدد الصفوف</th><th>عدد المقاطع</th><th>الحالة</th></tr>
</thead>
<tbody>
<tr><td>740,000 ~ 745,000</td><td>12</td><td>مختومة</td></tr>
<tr><td>533,630</td><td>1</td><td>مختومة</td></tr>
</tbody>
</table>
<p>كانت المجموعة القديمة متساوية إلى حد ما. كان يحتوي على 13 مقطعًا فقط، وكان معظمها يحتوي على حوالي <strong>740,000 صف</strong>.</p>
<p><strong>تخطيط مقطع الإصدار 2.5.16 (إجمالي 21 مقطعًا)</strong></p>
<table>
<thead>
<tr><th>نطاق عدد الصفوف</th><th>عدد الشرائح</th><th>الحالة</th></tr>
</thead>
<tbody>
<tr><td>680,000 ~ 685,000</td><td>4</td><td>مختومة</td></tr>
<tr><td>560,000 ~ 682,550</td><td>5</td><td>مختومة</td></tr>
<tr><td>421,575 ~ 481,800</td><td>4</td><td>مختومة</td></tr>
<tr><td>358,575 ~ 399,725</td><td>4</td><td>مختومة</td></tr>
<tr><td>379,650 ~ 461,725</td><td>4</td><td>مختومة</td></tr>
</tbody>
</table>
<p>بدت المجموعة الجديدة مختلفة تمامًا. كانت تحتوي على 21 مقطعًا (60% أكثر)، مع تفاوت في حجم المقطع: بعضها احتوى على حوالي 685 ألف صف، والبعض الآخر بالكاد 350 ألفًا. كانت الاستعادة قد بعثرت البيانات بشكل غير متساوٍ.</p>
<h3 id="Root-Cause" class="common-anchor-header">السبب الجذري</h3><p>لقد تتبعنا المشكلة إلى أمر الاستعادة الأصلي:</p>
<pre><code translate="no">./milvus-backup restore --config configs/restore.yaml -n backup_v2216 \
  --rebuild_index \
  --use_v2_restore \
  --drop_exist_collection \
  --drop_exist_index
<button class="copy-code-btn"></button></code></pre>
<p>تعمل علامة <code translate="no">--use_v2_restore</code> على تمكين وضع استعادة دمج المقاطع، والذي يقوم بتجميع مقاطع متعددة في مهمة استعادة واحدة. تم تصميم هذا الوضع لتسريع عمليات الاستعادة عندما يكون لديك العديد من المقاطع الصغيرة.</p>
<p>ولكن في استعادتنا عبر الإصدار المتقاطع (2.2 → 2.5)، قام منطق الإصدار 2 بإعادة بناء المقاطع بشكل مختلف عن المجموعة الأصلية: فقد قام بتقسيم المقاطع الكبيرة إلى مقاطع أصغر حجمًا وغير متساوية. بمجرد التحميل، علقت بعض عقد الاستعلام ببيانات أكثر من غيرها.</p>
<p>أضر هذا بالأداء بثلاث طرق:</p>
<ul>
<li><p><strong>العقد الساخنة:</strong> كان على عُقد الاستعلام ذات المقاطع الأكبر أو الأكثر القيام بمزيد من العمل</p></li>
<li><p><strong>تأثير العقدة الأبطأ:</strong> يعتمد زمن انتقال الاستعلام الموزع على أبطأ عقدة</p></li>
<li><p><strong>المزيد من نفقات الدمج:</strong> المزيد من المقاطع يعني أيضًا المزيد من العمل عند دمج النتائج</p></li>
</ul>
<h3 id="The-Fix" class="common-anchor-header">الإصلاح</h3><p>أزلنا <code translate="no">--use_v2_restore</code> واستعدنا بالمنطق الافتراضي:</p>
<pre><code translate="no">./milvus-backup restore --config configs/restore.yaml -n backup_v2216
<button class="copy-code-btn"></button></code></pre>
<p>قمنا بتنظيف البيانات السيئة من المجموعة الجديدة أولاً، ثم قمنا بتشغيل الاستعادة الافتراضية. عاد توزيع الشرائح إلى التوازن، وعاد زمن انتقال البحث إلى طبيعته، واختفت المشكلة.</p>
<h2 id="What-Wed-Do-Differently-Next-Time" class="common-anchor-header">ما الذي سنفعله بشكل مختلف في المرة القادمة<button data-href="#What-Wed-Do-Differently-Next-Time" class="anchor-icon" translate="no">
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
    </button></h2><p>في هذه الحالة، استغرقنا وقتًا طويلاً للعثور على المشكلة الحقيقية: <strong>التوزيع غير المتكافئ للشرائح</strong>. إليك ما كان سيجعل الأمر أسرع.</p>
<h3 id="Improve-Segment-Monitoring" class="common-anchor-header">تحسين مراقبة الشرائح</h3><p>لا يعرض ميلفوس عدد الشرائح، أو توزيع الصفوف، أو توزيع الحجم لكل مجموعة في لوحات معلومات Grafana القياسية. كان علينا أن نبحث يدويًا من خلال <a href="https://github.com/zilliztech/attu">Attu</a> و etcd، وهو ما كان بطيئًا.</p>
<p>سيكون من المفيد إضافة</p>
<ul>
<li><p><strong>لوحة معلومات لتوزيع المقاطع</strong> في Grafana، تُظهر عدد المقاطع التي تم تحميلها في كل عقدة استعلام، بالإضافة إلى عدد الصفوف وأحجامها</p></li>
<li><p><strong>تنبيه اختلال التوازن،</strong> يتم تشغيله عندما ينحرف عدد صفوف المقاطع عبر العقد إلى ما بعد الحد الأدنى</p></li>
<li><p><strong>طريقة عرض مقارنة الترحيل،</strong> بحيث يمكن للمستخدمين مقارنة توزيع المقاطع بين المجموعات القديمة والجديدة بعد الترقية</p></li>
</ul>
<h3 id="Use-a-Standard-Migration-Checklist" class="common-anchor-header">استخدام قائمة تدقيق الترحيل القياسية</h3><p>لقد تحققنا من عدد الصفوف واعتبرناها جيدة. لم يكن ذلك كافياً. يجب أن يغطي التحقق الكامل لما بعد الترحيل أيضًا:</p>
<ul>
<li><p><strong>اتساق المخطط.</strong> هل تتطابق تعريفات الحقول وأبعاد المتجهات؟</p></li>
<li><p><strong>عدد الشرائح.</strong> هل تغير عدد الشرائح بشكل كبير؟</p></li>
<li><p><strong>توازن الشرائح.</strong> هل عدد الصفوف عبر القطاعات متساوٍ بشكل معقول؟</p></li>
<li><p><strong>حالة الفهرس.</strong> هل جميع الفهارس <code translate="no">finished</code> ؟</p></li>
<li><p><strong>معيار الكمون.</strong> هل تبدو أزمنة استجابة الاستعلام P50 و P95 و P99 مشابهة للمجموعة القديمة؟</p></li>
<li><p><strong>توازن التحميل.</strong> هل استخدام وحدة المعالجة المركزية لـ QueryNode موزع بالتساوي عبر الكبسولات؟</p></li>
</ul>
<h3 id="Add-Automated-Checks" class="common-anchor-header">إضافة فحوصات آلية</h3><p>يمكنك برمجة هذا التحقق باستخدام PyMilvus لاكتشاف الخلل قبل أن يصل إلى الإنتاج:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, utility, Collection  
<span class="hljs-keyword">def</span> <span class="hljs-title function_">check_segment_balance</span>(<span class="hljs-params">collection_name: <span class="hljs-built_in">str</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Check Segment distribution balance&quot;&quot;&quot;</span>
    collection = Collection(collection_name)
    segments = utility.get_query_segment_info(collection_name)
    <span class="hljs-comment"># Group statistics by QueryNode</span>
    node_stats = {}
    <span class="hljs-keyword">for</span> seg <span class="hljs-keyword">in</span> segments:
        node_id = seg.nodeID
        <span class="hljs-keyword">if</span> node_id <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> node_stats:
            node_stats[node_id] = {<span class="hljs-string">&quot;count&quot;</span>: <span class="hljs-number">0</span>, <span class="hljs-string">&quot;rows&quot;</span>: <span class="hljs-number">0</span>}
        node_stats[node_id][<span class="hljs-string">&quot;count&quot;</span>] += <span class="hljs-number">1</span>
        node_stats[node_id][<span class="hljs-string">&quot;rows&quot;</span>] += seg.num_rows
    <span class="hljs-comment"># Calculate balance</span>
    row_counts = [v[<span class="hljs-string">&quot;rows&quot;</span>] <span class="hljs-keyword">for</span> v <span class="hljs-keyword">in</span> node_stats.values()]
    avg_rows = <span class="hljs-built_in">sum</span>(row_counts) / <span class="hljs-built_in">len</span>(row_counts)
    max_deviation = <span class="hljs-built_in">max</span>(<span class="hljs-built_in">abs</span>(r - avg_rows) / avg_rows <span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> row_counts)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Number of nodes: <span class="hljs-subst">{<span class="hljs-built_in">len</span>(node_stats)}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Average row count: <span class="hljs-subst">{avg_rows:<span class="hljs-number">.0</span>f}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Maximum deviation: <span class="hljs-subst">{max_deviation:<span class="hljs-number">.2</span>%}</span>&quot;</span>)
    <span class="hljs-keyword">if</span> max_deviation &gt; <span class="hljs-number">0.2</span>:  <span class="hljs-comment"># Raise a warning if deviation exceeds 20%</span>
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;⚠️ Warning: Segment distribution is unbalanced and may affect query performance!&quot;</span>)
    <span class="hljs-keyword">for</span> node_id, stats <span class="hljs-keyword">in</span> <span class="hljs-built_in">sorted</span>(node_stats.items()):
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  Node <span class="hljs-subst">{node_id}</span>: <span class="hljs-subst">{stats[<span class="hljs-string">&#x27;count&#x27;</span>]}</span> segments, <span class="hljs-subst">{stats[<span class="hljs-string">&#x27;rows&#x27;</span>]}</span> rows&quot;</span>)
  
<span class="hljs-comment"># Usage example</span>
connections.connect(host=<span class="hljs-string">&quot;localhost&quot;</span>, port=<span class="hljs-string">&quot;19530&quot;</span>)
check_segment_balance(<span class="hljs-string">&quot;your_collection_name&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Use-Existing-Tools-Better" class="common-anchor-header">استخدام الأدوات الموجودة بشكل أفضل</h3><p>هناك بعض الأدوات التي تدعم بالفعل التشخيص على مستوى القطاع:</p>
<ul>
<li><p><strong>Birdwatcher:</strong> يمكن قراءة البيانات الوصفية Etcd مباشرة وإظهار تخطيط المقطع وتعيين القناة</p></li>
<li><p><strong>واجهة مستخدم الويب Milvus Web UI (الإصدار 2.5+):</strong> تتيح لك فحص معلومات المقطع بصريًا</p></li>
<li><p><strong>Grafana + Prometheus:</strong> يمكن استخدامه لإنشاء لوحات معلومات مخصصة لمراقبة المجموعة في الوقت الفعلي</p></li>
</ul>
<h2 id="Suggestions-for-the-Milvus-Community" class="common-anchor-header">اقتراحات لمجتمع ميلفوس<button data-href="#Suggestions-for-the-Milvus-Community" class="anchor-icon" translate="no">
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
    </button></h2><p>بعض التغييرات في Milvus ستجعل هذا النوع من استكشاف الأخطاء وإصلاحها أسهل</p>
<ol>
<li><p><strong>شرح توافق المعلمات بشكل أوضحيجب</strong>أن تشرح مستندات <code translate="no">milvus-backup</code> بوضوح كيف تتصرف خيارات مثل <code translate="no">--use_v2_restore</code> أثناء عمليات الاستعادة عبر الإصدارات المتقاطعة والمخاطر التي قد تقدمها.</p></li>
<li><p><strong>إضافة فحوصات أفضل بعد الاستعادةبعد</strong>انتهاء <code translate="no">restore</code> ، سيكون من المفيد أن تطبع الأداة تلقائيًا ملخصًا لتوزيع المقطع.</p></li>
<li><p><strong>فضح المقاييس المتعلقة بالتوازنينبغي</strong>أن تتضمن مقاييس<strong>بروميثيوس</strong>معلومات عن توازن المقاطع، بحيث يمكن للمستخدمين مراقبتها مباشرة.</p></li>
<li><p><strong>دعم تحليل خطة الاستعلامعلى غرار</strong>MySQL <code translate="no">EXPLAIN</code> ، سيستفيد ميلفوس من أداة توضح كيفية تنفيذ الاستعلام وتساعد في تحديد مشاكل الأداء.</p></li>
</ol>
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
    </button></h2><p>خلاصة القول</p>
<table>
<thead>
<tr><th>المرحلة</th><th>الأداة / الطريقة</th><th>النقطة الأساسية</th></tr>
</thead>
<tbody>
<tr><td>النسخ الاحتياطي</td><td>إنشاء النسخ الاحتياطي ميلفوس النسخ الاحتياطي</td><td>النسخ الاحتياطي الساخن مدعوم، ولكن يجب التحقق من النسخة الاحتياطية بعناية</td></tr>
<tr><td>الترقية</td><td>إنشاء مجموعة جديدة باستخدام Helm</td><td>قم بتعطيل Mmap لتقليل اهتزاز الإدخال/الإخراج، وحافظ على إعدادات الموارد كما في المجموعة القديمة</td></tr>
<tr><td>الترحيل</td><td>استعادة النسخ الاحتياطي ميلفوس النسخ الاحتياطي</td><td>كن حذرًا مع --استخدام_v2_استعادة. في استعادة الإصدارات المتقاطعة، لا تستخدم المنطق غير الافتراضي إلا إذا كنت تفهمه بوضوح</td></tr>
<tr><td>الطرح الرمادي</td><td>نقل حركة المرور التدريجي</td><td>نقل حركة المرور على مراحل: 5٪ → 25٪ → 50٪ → 100٪، واحتفظ بالمجموعة القديمة جاهزة للاستعادة</td></tr>
<tr><td>استكشاف الأخطاء وإصلاحها</td><td>غرافانا + تحليل المقطع</td><td>لا تنظر فقط إلى وحدة المعالجة المركزية والذاكرة. تحقق أيضًا من توازن المقطع وتوزيع البيانات</td></tr>
<tr><td>إصلاح</td><td>إزالة البيانات السيئة واستعادتها مرة أخرى</td><td>إزالة العلامة الخاطئة، واستعادتها بالمنطق الافتراضي، ويعود الأداء إلى طبيعته</td></tr>
</tbody>
</table>
<p>عند ترحيل البيانات، من المهم مراعاة أكثر من مجرد ما إذا كانت البيانات موجودة ودقيقة. تحتاج أيضًا إلى الانتباه إلى <strong>كيفية</strong> <strong>توزيع</strong> <strong>البيانات</strong>.</p>
<p>يحدد عدد المقاطع وأحجام المقاطع كيفية توزيع ميلفوس لعمل الاستعلام بالتساوي عبر العقد. عندما تكون المقاطع غير متوازنة، ينتهي الأمر بعدد قليل من العقد إلى القيام بمعظم العمل، وكل بحث يدفع ثمنه. تنطوي الترقيات عبر الإصدارات المتقاطعة على مخاطر إضافية هنا لأن عملية الاستعادة قد تعيد بناء المقاطع بشكل مختلف عن المجموعة الأصلية. يمكن لعلامات مثل <code translate="no">--use_v2_restore</code> أن تجزئ بياناتك بطرق لن تظهرها أعداد الصفوف وحدها.</p>
<p>لذلك، فإن النهج الأكثر أمانًا في الترحيل عبر الإصدارات هو الالتزام بإعدادات الاستعادة الافتراضية ما لم يكن لديك سبب محدد للقيام بخلاف ذلك. أيضًا، يجب أن تتجاوز المراقبة وحدة المعالجة المركزية والذاكرة؛ فأنت بحاجة إلى نظرة ثاقبة على تخطيط البيانات الأساسي، وخاصةً توزيع الشرائح والتوازن، لاكتشاف المشاكل في وقت مبكر.</p>
<h2 id="A-Note-from-the-Milvus-Team" class="common-anchor-header">ملاحظة من فريق ميلفوس<button data-href="#A-Note-from-the-Milvus-Team" class="anchor-icon" translate="no">
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
    </button></h2><p>نود أن نشكر فريق هندسة WPS على مشاركة هذه التجربة مع مجتمع Milvus. تعتبر مثل هذه الكتابات قيّمة لأنها تلتقط دروس الإنتاج الحقيقية وتجعلها مفيدة للآخرين الذين يواجهون مشاكل مماثلة.</p>
<p>إذا كان لدى فريقك درسًا تقنيًا أو قصة استكشاف الأخطاء وإصلاحها أو تجربة عملية تستحق المشاركة، نود أن نسمع منك. انضم إلى <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">قناة Slack</a> الخاصة بنا وتواصل معنا هناك.</p>
<p>وإذا كنت تواجه تحديات خاصة بك، فإن قنوات المجتمع نفسها هي مكان جيد للتواصل مع مهندسي Milvus والمستخدمين الآخرين. يمكنك أيضًا حجز جلسة فردية من خلال <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">ساعات عمل Milvus المكتبية</a> للحصول على المساعدة في النسخ الاحتياطي والاستعادة والترقيات عبر الإصدارات المتقاطعة وأداء الاستعلام.</p>
<p><a href="https://zilliz.com/share-your-story">
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Milvus_1_9eca411038.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</a></p>
