---
id: milvus-access-control-rbac-guide.md
title: 'دليل ميلفوس للتحكم في الوصول: كيفية تكوين RBAC للإنتاج'
author: Jack Li and Juan Xu
date: 2026-3-26
cover: assets.zilliz.com/cover_access_control_2_3e211dd48b.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus access control, Milvus RBAC, vector database security, Milvus privilege
  groups, Milvus production setup
meta_title: |
  Milvus Access Control: Configure RBAC for Production
desc: >-
  دليل تفصيلي خطوة بخطوة لإعداد نظام Milvus RBAC في الإنتاج - المستخدمون،
  والأدوار، ومجموعات الامتيازات، والوصول على مستوى المجموعة، ومثال على نظام RAG
  كامل.
origin: 'https://milvus.io/blog/milvus-access-control-rbac-guide.md'
---
<p>إليك قصة أكثر شيوعًا مما ينبغي: يقوم مهندس ضمان الجودة بتشغيل برنامج نصي للتنظيف ضد ما يعتقد أنه بيئة التدريج. إلا أن سلسلة الاتصال تشير إلى الإنتاج. بعد ثوانٍ قليلة، تختفي مجموعات المتجهات الأساسية - تُفقد بيانات الميزات، ويعيد <a href="https://zilliz.com/glossary/similarity-search">البحث عن التشابه</a> نتائج فارغة، وتتدهور الخدمات في جميع المجالات. يجد التشريح اللاحق نفس السبب الجذري الذي يجده دائمًا: كان الجميع يتصلون بصيغة <code translate="no">root</code> ، ولم تكن هناك حدود وصول، ولم يوقف أي شيء حساب اختبار من إسقاط بيانات الإنتاج.</p>
<p>هذه ليست مرة واحدة. تميل الفرق التي تبني على <a href="https://milvus.io/">Milvus</a> - <a href="https://zilliz.com/learn/what-is-a-vector-database">وقواعد البيانات المتجهة</a> بشكل عام - إلى التركيز على <a href="https://zilliz.com/learn/vector-index">أداء الفهرس</a> والإنتاجية وحجم البيانات، بينما تتعامل مع التحكم في الوصول كشيء يمكن التعامل معه لاحقًا. لكن "لاحقًا" عادةً ما يأتي على شكل حادثة. مع انتقال Milvus من النموذج الأولي إلى العمود الفقري <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">لخطوط أنابيب RAG</a> للإنتاج، ومحركات التوصيات، <a href="https://zilliz.com/learn/what-is-vector-search">والبحث المتجه</a> في الوقت الحقيقي، يصبح السؤال الذي لا مفر منه: من يمكنه الوصول إلى مجموعة Milvus، وما الذي يُسمح له بالضبط بالقيام به؟</p>
<p>يتضمن Milvus نظام RBAC مدمج للإجابة على هذا السؤال. يغطي هذا الدليل ما هو نظام RBAC (RBAC)، وكيفية تطبيقه في Milvus، وكيفية تصميم نموذج التحكم في الوصول الذي يحافظ على سلامة الإنتاج - مع أمثلة برمجية وإرشادات كاملة لنظام RAG.</p>
<h2 id="What-Is-RBAC-Role-Based-Access-Control" class="common-anchor-header">ما هو التحكم في الوصول المستند إلى الدور (RBAC)؟<button data-href="#What-Is-RBAC-Role-Based-Access-Control" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>التحكم في الوصول المستند إلى الدور (RBAC)</strong> هو نموذج أمان لا يتم فيه تعيين الأذونات مباشرةً للمستخدمين الفرديين. بدلاً من ذلك، يتم تجميع الأذونات في أدوار، ويتم تعيين دور واحد أو أكثر للمستخدمين. الوصول الفعال للمستخدم هو اتحاد جميع الأذونات من الأدوار المعينة له. RBAC هو النموذج القياسي للتحكم في الوصول في أنظمة قواعد بيانات الإنتاج - تستخدمه PostgreSQL وMySQL وMongoDB ومعظم الخدمات السحابية.</p>
<p>تعمل RBAC على حل مشكلة أساسية في التوسع: عندما يكون لديك العشرات من المستخدمين والخدمات، تصبح إدارة الأذونات لكل مستخدم غير قابلة للصيانة. باستخدام RBAC، يمكنك تحديد دور مرة واحدة (على سبيل المثال، "للقراءة فقط على المجموعة X")، وتعيينه لعشر خدمات، وتحديثه في مكان واحد عندما تتغير المتطلبات.</p>
<h2 id="How-Does-Milvus-Implement-RBAC" class="common-anchor-header">كيف تقوم ميلفوس بتطبيق نظام RBAC؟<button data-href="#How-Does-Milvus-Implement-RBAC" class="anchor-icon" translate="no">
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
    </button></h2><p>يعتمد نظام Milvus RBAC على أربعة مفاهيم:</p>
<table>
<thead>
<tr><th>المفهوم</th><th>ماهيته</th><th>مثال</th></tr>
</thead>
<tbody>
<tr><td><strong>المورد</strong></td><td>الشيء الذي يتم الوصول إليه</td><td><a href="https://milvus.io/docs/architecture_overview.md">مثيل ميلفوس،</a> أو <a href="https://milvus.io/docs/manage-databases.md">قاعدة بيانات،</a> أو مجموعة محددة</td></tr>
<tr><td><strong>امتياز/مجموعة امتيازات</strong></td><td>الإجراء الذي يتم تنفيذه</td><td><code translate="no">Search</code> <code translate="no">Insert</code> ، أو ، أو مجموعة مثل (مجموعة للقراءة فقط) <code translate="no">DropCollection</code> <code translate="no">COLL_RO</code> </td></tr>
<tr><td><strong>الدور</strong></td><td>مجموعة مسماة من الامتيازات المحددة النطاق للموارد</td><td><code translate="no">role_read_only</code>:: يمكن البحث والاستعلام عن جميع المجموعات في قاعدة البيانات <code translate="no">default</code> </td></tr>
<tr><td><strong>المستخدم</strong></td><td>حساب ميلفوس (بشري أو حساب خدمة)</td><td><code translate="no">rag_writer</code>:: حساب الخدمة المستخدم من قبل خط أنابيب الاستيعاب</td></tr>
</tbody>
</table>
<p>لا يتم تعيين الوصول مباشرة للمستخدمين. يحصل المستخدمون على أدوار، والأدوار تحتوي على امتيازات، ويتم تحديد نطاق الامتيازات إلى الموارد. هذا هو نفس <a href="https://zilliz.com/blog/milvus-2-5-rbac-enhancements">نموذج RBAC</a> المستخدم في معظم أنظمة قواعد بيانات الإنتاج. إذا كان هناك عشرة مستخدمين يتشاركون نفس الدور، فإنك تقوم بتحديث الدور مرة واحدة وينطبق التغيير عليهم جميعاً.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_access_control_rbac_guide_1_c872ea8932.png" alt="Milvus RBAC model showing how Users are assigned to Roles, and Roles contain Privileges and Privilege Groups that apply to Resources" class="doc-image" id="milvus-rbac-model-showing-how-users-are-assigned-to-roles,-and-roles-contain-privileges-and-privilege-groups-that-apply-to-resources" />
   </span> <span class="img-wrapper"> <span>نموذج Milvus RBAC يوضح كيف يتم تعيين المستخدمين إلى الأدوار، والأدوار تحتوي على امتيازات ومجموعات امتيازات تنطبق على الموارد</span> </span></p>
<p>عندما يصل الطلب إلى ميلفوس، فإنه يمر بثلاث عمليات تحقق:</p>
<ol>
<li><strong>التحقق من المصادقة</strong> - هل هذا مستخدم صالح ببيانات اعتماد صحيحة؟</li>
<li><strong>التحقق من الدور</strong> - هل هذا المستخدم لديه دور واحد على الأقل معيّن؟</li>
<li><strong>التحقق من الامتيازات</strong> - هل يمنح أي من أدوار المستخدم الإجراء المطلوب على المورد المطلوب؟</li>
</ol>
<p>إذا فشل أي فحص، يتم رفض الطلب.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/milvus_access_control_rbac_guide_2_2275b37ea6.png" alt="Milvus authentication and authorization flow: Client Request goes through Authentication, Role Check, and Privilege Check — rejected at any failed step, executed only if all pass" class="doc-image" id="milvus-authentication-and-authorization-flow:-client-request-goes-through-authentication,-role-check,-and-privilege-check-—-rejected-at-any-failed-step,-executed-only-if-all-pass" />
   <span>تدفق مصادقة وتفويض ميلفوس: يمر طلب العميل من خلال المصادقة والتحقق من الدور والتحقق من الامتيازات - يتم رفض الطلب في أي خطوة فاشلة، ويتم تنفيذه فقط في حال اجتيازها كلها</span> </span></p>
<h2 id="How-to-Enable-Authentication-in-Milvus" class="common-anchor-header">كيفية تمكين المصادقة في ميلفوس<button data-href="#How-to-Enable-Authentication-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>بشكل افتراضي، يعمل Milvus بشكل افتراضي مع تعطيل المصادقة - كل اتصال لديه حق الوصول الكامل. الخطوة الأولى هي تشغيله.</p>
<h3 id="Docker-Compose" class="common-anchor-header">تكوين Docker Compose</h3><p>تحرير <code translate="no">milvus.yaml</code> وتعيين <code translate="no">authorizationEnabled</code> إلى <code translate="no">true</code>:</p>
<pre><code translate="no"><span class="hljs-attr">common</span>:
  <span class="hljs-attr">security</span>:
    <span class="hljs-attr">authorizationEnabled</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Helm-Charts" class="common-anchor-header">مخططات هيلم</h3><p>تحرير <code translate="no">values.yaml</code> وإضافة الإعداد تحت <code translate="no">extraConfigFiles</code>:</p>
<pre><code translate="no"><span class="hljs-attr">extraConfigFiles</span>:
  user.<span class="hljs-property">yaml</span>: |+
    <span class="hljs-attr">common</span>:
      <span class="hljs-attr">security</span>:
        <span class="hljs-attr">authorizationEnabled</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<p>بالنسبة لعمليات نشر <a href="https://milvus.io/docs/install_cluster-milvusoperator.md">مشغل Milvus</a> على <a href="https://milvus.io/docs/prerequisite-helm.md">Kubernetes،</a> يتم إدخال نفس التكوين في قسم Milvus CR <code translate="no">spec.config</code>.</p>
<p>بمجرد تمكين المصادقة وإعادة تشغيل Milvus، يجب على كل اتصال تقديم بيانات الاعتماد. ينشئ ميلفوس مستخدمًا افتراضيًا <code translate="no">root</code> بكلمة مرور <code translate="no">Milvus</code> - قم بتغييرها على الفور.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

<span class="hljs-comment"># Connect with the default root account</span>
client = MilvusClient(
    uri=<span class="hljs-string">&#x27;http://localhost:19530&#x27;</span>,
    token=<span class="hljs-string">&quot;root:Milvus&quot;</span>
)

<span class="hljs-comment"># Change the password</span>
client.update_password(
    user_name=<span class="hljs-string">&quot;root&quot;</span>,
    old_password=<span class="hljs-string">&quot;Milvus&quot;</span>,
    new_password=<span class="hljs-string">&quot;xgOoLudt3Kc#Pq68&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="How-to-Configure-Users-Roles-and-Privileges" class="common-anchor-header">كيفية تهيئة المستخدمين والأدوار والامتيازات<button data-href="#How-to-Configure-Users-Roles-and-Privileges" class="anchor-icon" translate="no">
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
    </button></h2><p>مع تمكين المصادقة، إليك سير عمل الإعداد النموذجي.</p>
<h3 id="Step-1-Create-Users" class="common-anchor-header">الخطوة 1: إنشاء المستخدمين</h3><p>لا تدع الخدمات أو أعضاء الفريق يستخدمون <code translate="no">root</code>. أنشئ حسابات مخصصة لكل مستخدم أو خدمة.</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>, password=<span class="hljs-string">&quot;P@ssw0rd&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Create-Roles" class="common-anchor-header">الخطوة 2: إنشاء الأدوار</h3><p>يحتوي Milvus على دور مدمج <code translate="no">admin</code> ، ولكن من الناحية العملية ستحتاج إلى أدوار مخصصة تتطابق مع أنماط الوصول الفعلية الخاصة بك.</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Create-Privilege-Groups" class="common-anchor-header">الخطوة 3: إنشاء مجموعات امتيازات</h3><p>تجمع مجموعة الامتيازات امتيازات متعددة تحت اسم واحد، مما يسهل إدارة الوصول على نطاق واسع. يوفر ميلفوس 9 مجموعات امتيازات مدمجة:</p>
<table>
<thead>
<tr><th>مجموعة مدمجة</th><th>النطاق</th><th>ما يسمح به</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">COLL_RO</code></td><td>المجموعة</td><td>عمليات للقراءة فقط (استعلام، بحث، إلخ)</td></tr>
<tr><td><code translate="no">COLL_RW</code></td><td>المجموعة</td><td>عمليات القراءة والكتابة</td></tr>
<tr><td><code translate="no">COLL_Admin</code></td><td>التجميع</td><td>إدارة المجموعة الكاملة</td></tr>
<tr><td><code translate="no">DB_RO</code></td><td>قاعدة البيانات</td><td>عمليات قاعدة البيانات للقراءة فقط</td></tr>
<tr><td><code translate="no">DB_RW</code></td><td>قاعدة البيانات</td><td>عمليات قاعدة البيانات للقراءة والكتابة</td></tr>
<tr><td><code translate="no">DB_Admin</code></td><td>قاعدة البيانات</td><td>إدارة قاعدة بيانات كاملة</td></tr>
<tr><td><code translate="no">Cluster_RO</code></td><td>المجموعة</td><td>عمليات المجموعة للقراءة فقط</td></tr>
<tr><td><code translate="no">Cluster_RW</code></td><td>المجموعة</td><td>عمليات المجموعة للقراءة والكتابة</td></tr>
<tr><td><code translate="no">Cluster_Admin</code></td><td>المجموعة</td><td>إدارة المجموعة الكاملة</td></tr>
</tbody>
</table>
<p>يمكنك أيضًا إنشاء مجموعات امتيازات مخصصة عندما لا تناسب المجموعات المضمنة:</p>
<pre><code translate="no"><span class="hljs-comment"># Create a privilege group</span>
client.create_privilege_group(group_name=<span class="hljs-string">&#x27;privilege_group_1&#x27;</span>)

<span class="hljs-comment"># Add privileges to the group</span>
client.add_privileges_to_group(
    group_name=<span class="hljs-string">&#x27;privilege_group_1&#x27;</span>,
    privileges=[<span class="hljs-string">&#x27;Query&#x27;</span>, <span class="hljs-string">&#x27;Search&#x27;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Grant-Privileges-to-a-Role" class="common-anchor-header">الخطوة 4: منح امتيازات لدور ما</h3><p>امنح امتيازات فردية أو مجموعات امتيازات إلى دور، على نطاق موارد محددة. تتحكم المعلمات <code translate="no">collection_name</code> و <code translate="no">db_name</code> في النطاق - استخدم <code translate="no">*</code> للجميع.</p>
<pre><code translate="no"><span class="hljs-comment"># Grant a single privilege</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;Search&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)

<span class="hljs-comment"># Grant a privilege group</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;privilege_group_1&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)

<span class="hljs-comment"># Grant a cluster-level privilege (* means all resources)</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;ClusterReadOnly&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;*&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-5-Assign-Roles-to-Users" class="common-anchor-header">الخطوة 5: تعيين الأدوار للمستخدمين</h3><p>يمكن للمستخدم أن يحمل أدوارًا متعددة. أذوناته الفعالة هي اتحاد جميع الأدوار المعينة.</p>
<pre><code translate="no">client.<span class="hljs-title function_">grant_role</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>, role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h2 id="How-to-Audit-and-Revoke-Access" class="common-anchor-header">كيفية التدقيق وإلغاء الوصول<button data-href="#How-to-Audit-and-Revoke-Access" class="anchor-icon" translate="no">
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
    </button></h2><p>معرفة ما هو الوصول الموجود لا يقل أهمية عن منحه. تتراكم الأذونات القديمة - من أعضاء الفريق السابقين، أو الخدمات المتوقفة عن العمل، أو جلسات التصحيح لمرة واحدة - بصمت وتوسع من نطاق الهجوم.</p>
<h3 id="Check-Current-Permissions" class="common-anchor-header">التحقق من الأذونات الحالية</h3><p>عرض الأدوار المعينة للمستخدم:</p>
<pre><code translate="no">client.<span class="hljs-title function_">describe_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>عرض الامتيازات الممنوحة للدور:</p>
<pre><code translate="no">client.<span class="hljs-title function_">describe_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Revoke-Privileges-from-a-Role" class="common-anchor-header">إلغاء تعيين امتيازات من دور</h3><pre><code translate="no"><span class="hljs-comment"># Remove a single privilege</span>
client.revoke_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;Search&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)

<span class="hljs-comment"># Remove a privilege group</span>
client.revoke_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;privilege_group_1&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Unassign-a-Role-from-a-User" class="common-anchor-header">إلغاء تعيين دور من مستخدم</h3><pre><code translate="no">client.<span class="hljs-title function_">revoke_role</span>(
    user_name=<span class="hljs-string">&#x27;user_1&#x27;</span>,
    role_name=<span class="hljs-string">&#x27;role_a&#x27;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Delete-Users-or-Roles" class="common-anchor-header">حذف المستخدمين أو الأدوار</h3><p>قم بإزالة جميع تعيينات الأدوار قبل حذف مستخدم، وإلغاء جميع الامتيازات قبل إسقاط دور:</p>
<pre><code translate="no">client.<span class="hljs-title function_">drop_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>)
client.<span class="hljs-title function_">drop_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Example-How-to-Design-RBAC-for-a-Production-RAG-System" class="common-anchor-header">مثال: كيفية تصميم RBAC لنظام RAG للإنتاج RAG<button data-href="#Example-How-to-Design-RBAC-for-a-Production-RAG-System" class="anchor-icon" translate="no">
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
    </button></h2><p>انقر فوق المفاهيم المجردة بشكل أسرع مع مثال ملموس. فكر في نظام <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> مبني على Milvus مع ثلاث خدمات متميزة:</p>
<table>
<thead>
<tr><th>الخدمة</th><th>المسؤولية</th><th>الوصول المطلوب</th></tr>
</thead>
<tbody>
<tr><td><strong>مسؤول المنصة</strong></td><td>إدارة مجموعة Milvus - إنشاء المجموعات، ومراقبة الحالة الصحية، والتعامل مع الترقيات</td><td>مشرف مجموعة كاملة</td></tr>
<tr><td><strong>خدمة الاستيعاب</strong></td><td>توليد <a href="https://zilliz.com/glossary/vector-embeddings">التضمينات المتجهة</a> من المستندات وكتابتها إلى المجموعات</td><td>القراءة + الكتابة على المجموعات</td></tr>
<tr><td><strong>خدمة البحث</strong></td><td>تتعامل مع استعلامات <a href="https://zilliz.com/learn/what-is-vector-search">البحث عن المتجهات</a> من المستخدمين النهائيين</td><td>للقراءة فقط على المجموعات</td></tr>
</tbody>
</table>
<p>إليك إعداد كامل باستخدام <a href="https://milvus.io/docs/install-pymilvus.md">PyMilvus</a>:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

client = MilvusClient(
    uri=<span class="hljs-string">&#x27;http://localhost:19530&#x27;</span>,
    token=<span class="hljs-string">&quot;root:xxx&quot;</span>  <span class="hljs-comment"># Replace with your updated root password</span>
)

<span class="hljs-comment"># 1. Create users</span>
client.create_user(user_name=<span class="hljs-string">&quot;rag_admin&quot;</span>, password=<span class="hljs-string">&quot;xxx&quot;</span>)
client.create_user(user_name=<span class="hljs-string">&quot;rag_reader&quot;</span>, password=<span class="hljs-string">&quot;xxx&quot;</span>)
client.create_user(user_name=<span class="hljs-string">&quot;rag_writer&quot;</span>, password=<span class="hljs-string">&quot;xxx&quot;</span>)

<span class="hljs-comment"># 2. Create roles</span>
client.create_role(role_name=<span class="hljs-string">&quot;role_admin&quot;</span>)
client.create_role(role_name=<span class="hljs-string">&quot;role_read_only&quot;</span>)
client.create_role(role_name=<span class="hljs-string">&quot;role_read_write&quot;</span>)

<span class="hljs-comment"># 3. Grant access to roles</span>

<span class="hljs-comment"># Admin role: cluster-level admin access</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_admin&quot;</span>,
    privilege=<span class="hljs-string">&quot;Cluster_Admin&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;*&#x27;</span>,
)

<span class="hljs-comment"># Read-only role: collection-level read-only access</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_read_only&quot;</span>,
    privilege=<span class="hljs-string">&quot;COLL_RO&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)

<span class="hljs-comment"># Read-write role: collection-level read and write access</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_read_write&quot;</span>,
    privilege=<span class="hljs-string">&quot;COLL_RW&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)

<span class="hljs-comment"># 4. Assign roles to users</span>
client.grant_role(user_name=<span class="hljs-string">&quot;rag_admin&quot;</span>, role_name=<span class="hljs-string">&quot;role_admin&quot;</span>)
client.grant_role(user_name=<span class="hljs-string">&quot;rag_reader&quot;</span>, role_name=<span class="hljs-string">&quot;role_read_only&quot;</span>)
client.grant_role(user_name=<span class="hljs-string">&quot;rag_writer&quot;</span>, role_name=<span class="hljs-string">&quot;role_read_write&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>تحصل كل خدمة على الوصول الذي تحتاجه بالضبط. لا يمكن لخدمة البحث حذف البيانات عن طريق الخطأ. لا يمكن لخدمة الاستيعاب تعديل إعدادات المجموعة. وإذا تسربت بيانات اعتماد خدمة البحث، يمكن للمهاجم قراءة <a href="https://zilliz.com/glossary/vector-embeddings">ناقلات التضمين</a> - ولكن لا يمكنه الكتابة أو الحذف أو التصعيد إلى المسؤول.</p>
<p>بالنسبة للفرق التي تدير الوصول عبر عمليات نشر Milvus المتعددة، توفر <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (Milvus المُدارة) نظام RBAC مدمج مع وحدة تحكم ويب لإدارة المستخدمين والأدوار والأذونات - لا حاجة إلى برمجة نصية. مفيد عندما تفضل إدارة الوصول من خلال واجهة المستخدم بدلاً من الاحتفاظ بنصوص الإعداد عبر البيئات.</p>
<h2 id="Access-Control-Best-Practices-for-Production" class="common-anchor-header">أفضل ممارسات التحكم في الوصول للإنتاج<button data-href="#Access-Control-Best-Practices-for-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>خطوات الإعداد أعلاه هي الآليات. فيما يلي مبادئ التصميم التي تحافظ على فعالية التحكم في الوصول بمرور الوقت.</p>
<h3 id="Lock-Down-the-Root-Account" class="common-anchor-header">تأمين حساب الجذر</h3><p>قم بتغيير كلمة المرور الافتراضية <code translate="no">root</code> قبل أي شيء آخر. في الإنتاج، يجب استخدام حساب الجذر فقط للعمليات الطارئة وتخزينه في مدير الأسرار - وليس ترميزه في تكوينات التطبيق أو مشاركته عبر Slack.</p>
<h3 id="Separate-Environments-Completely" class="common-anchor-header">بيئات منفصلة تمامًا</h3><p>استخدم <a href="https://milvus.io/docs/architecture_overview.md">مثيلات</a> مختلفة <a href="https://milvus.io/docs/architecture_overview.md">من Milvus</a> للتطوير والتدريج والإنتاج. يعد فصل البيئة عن طريق RBAC وحده أمرًا هشًا - سلسلة اتصال واحدة تم تكوينها بشكل خاطئ وخدمة تطوير تكتب إلى بيانات الإنتاج. الفصل المادي (مجموعات مختلفة وبيانات اعتماد مختلفة) يقضي على هذه الفئة من الحوادث تمامًا.</p>
<h3 id="Apply-Least-Privilege" class="common-anchor-header">تطبيق الحد الأدنى من الامتيازات</h3><p>امنح كل مستخدم وخدمة الحد الأدنى من الوصول اللازم لأداء وظيفته. ابدأ بالحد الأدنى ووسع فقط عندما تكون هناك حاجة محددة وموثقة. في بيئات التطوير، يمكنك أن تكون أكثر استرخاءً، ولكن يجب أن يكون الوصول إلى الإنتاج صارمًا ومراجعته بانتظام.</p>
<h3 id="Clean-Up-Stale-Access" class="common-anchor-header">تنظيف الوصول القديم</h3><p>عندما يغادر شخص ما الفريق أو يتم إيقاف تشغيل خدمة ما، قم بإلغاء أدوارهم وحذف حساباتهم على الفور. إن الحسابات غير المستخدمة ذات الأذونات النشطة هي أكثر النواقل شيوعًا للوصول غير المصرح به - فهي بيانات اعتماد صالحة لا يراقبها أحد.</p>
<h3 id="Scope-Privileges-to-Specific-Collections" class="common-anchor-header">نطاق الامتيازات لمجموعات محددة</h3><p>تجنب منح <code translate="no">collection_name='*'</code> إلا إذا كان الدور يحتاج حقًا إلى الوصول إلى كل مجموعة. في الإعدادات متعددة المستأجرين أو الأنظمة ذات خطوط أنابيب البيانات المتعددة، حدد نطاق كل دور في <a href="https://milvus.io/docs/manage-collections.md">المجموعات</a> التي يعمل عليها فقط. هذا يحد من نطاق الانفجار إذا تم اختراق بيانات الاعتماد.</p>
<hr>
<p>إذا كنت تقوم بنشر <a href="https://milvus.io/">Milvus</a> في الإنتاج وتعمل من خلال التحكم في الوصول أو الأمان أو التصميم متعدد المستأجرين، فنحن نود مساعدتك:</p>
<ul>
<li>انضم إلى <a href="https://slack.milvus.io/">مجتمع Milvus Slack</a> لمناقشة ممارسات النشر الحقيقية مع مهندسين آخرين يقومون بتشغيل Milvus على نطاق واسع.</li>
<li><a href="https://milvus.io/office-hours">احجز جلسة مجانية مدتها 20 دقيقة في ساعات عمل Milvus المكتبية</a> للتعرف على تصميم نظام التحكم في الدخول والخروج، سواء كان ذلك في بنية الأدوار أو تحديد نطاق المجموعة أو الأمان متعدد البيئات.</li>
<li>إذا كنت تفضل تخطي إعداد البنية الأساسية وإدارة التحكم في الوصول من خلال واجهة مستخدم، فإن <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (Milvus المُدارة من Milvus) تتضمن ميزة RBAC المدمجة مع وحدة تحكم على الويب - بالإضافة إلى <a href="https://zilliz.com/cloud-security">التشفير</a> وعزل الشبكة والتوافق مع SOC 2 خارج الصندوق.</li>
</ul>
<hr>
<p>بعض الأسئلة التي تظهر عندما تبدأ الفرق في تكوين التحكم في الوصول في Milvus:</p>
<p><strong>س: هل يمكنني تقييد المستخدم بمجموعات محددة فقط، وليس كلها؟</strong></p>
<p>ج: نعم. عند الاتصال <a href="https://milvus.io/docs/grant_privilege.md"><code translate="no">grant_privilege_v2</code></a>قم بتعيين <code translate="no">collection_name</code> إلى مجموعة محددة بدلاً من <code translate="no">*</code>. سيكون لدور المستخدم حق الوصول إلى تلك المجموعة فقط. يمكنك منح نفس الدور امتيازات على مجموعات متعددة عن طريق استدعاء الدالة مرة واحدة لكل مجموعة.</p>
<p><strong>س: ما الفرق بين الامتياز ومجموعة الامتيازات في ملفوس؟</strong></p>
<p>الامتياز هو إجراء واحد مثل <code translate="no">Search</code> أو <code translate="no">Insert</code> أو أو <code translate="no">DropCollection</code>. تجمع <a href="https://milvus.io/docs/privilege_group.md">مجموعة الامتيازات</a> امتيازات متعددة تحت اسم واحد - على سبيل المثال، <code translate="no">COLL_RO</code> تشمل جميع عمليات المجموعة للقراءة فقط. إن منح مجموعة الامتيازات يماثل من الناحية الوظيفية منح كل امتياز من الامتيازات المكونة لها بشكل فردي، ولكن إدارتها أسهل.</p>
<p><strong>س: هل يؤثر تمكين المصادقة على أداء استعلام Milvus؟</strong></p>
<p>ج: النفقات العامة لا تُذكر. يقوم Milvus بالتحقق من صحة بيانات الاعتماد والتحقق من أذونات الأدوار في كل طلب، ولكن هذا بحث في الذاكرة - يضيف ميكروثانية وليس أجزاء من الثانية. لا يوجد تأثير قابل للقياس على زمن <a href="https://milvus.io/docs/single-vector-search.md">البحث</a> أو <a href="https://milvus.io/docs/insert-update-delete.md">الإدراج</a>.</p>
<p><strong>س: هل يمكنني استخدام Milvus RBAC في إعداد متعدد المستأجرين؟</strong></p>
<p>ج: نعم. أنشئ أدوارًا منفصلة لكل مستأجر، وحدد نطاق امتيازات كل دور لمجموعات ذلك المستأجر، وقم بتعيين الدور المقابل لحساب خدمة كل مستأجر. يمنحك هذا عزلاً على مستوى المجموعة دون الحاجة إلى مثيلات Milvus منفصلة. للاستئجار المتعدد على نطاق أوسع، راجع <a href="https://milvus.io/docs/multi_tenancy.md">دليل الاستئجار المتعدد</a> في <a href="https://milvus.io/docs/multi_tenancy.md">ميلفوس</a>.</p>
