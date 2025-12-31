---
id: >-
  milvus-rbac-explained-secure-your-vector-database-with-role-based-access-control.md
title: >-
  شرح ميلفوس RBAC: تأمين قاعدة بيانات المتجهات الخاصة بك باستخدام التحكم في
  الوصول المستند إلى الأدوار
author: Juan Xu
date: 2025-12-31T00:00:00.000Z
cover: assets.zilliz.com/RBAC_in_Milvus_Cover_1fe181b31d.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, RBAC, access control, vector database security'
meta_title: |
  Milvus RBAC Guide: How to Control Access to Your Vector Database
desc: >-
  تعرّف على سبب أهمية RBAC، وكيفية عمل RBAC في Milvus، وكيفية تكوين التحكم في
  الوصول، وكيف يتيح الوصول الأقل امتيازاً، والفصل الواضح بين الأدوار، وعمليات
  الإنتاج الآمنة.
origin: >-
  https://milvus.io/blog/milvus-rbac-explained-secure-your-vector-database-with-role-based-access-control.md
---
<p>عند إنشاء نظام قاعدة بيانات، يقضي المهندسون معظم وقتهم في التركيز على الأداء: أنواع الفهارس، والاستدعاء، والكمون والإنتاجية، والتوسع. ولكن بمجرد أن ينتقل النظام إلى ما هو أبعد من جهاز كمبيوتر محمول لمطور واحد، يصبح سؤال آخر بنفس الأهمية: <strong>من يمكنه فعل ماذا داخل مجموعة ميلفوس الخاصة بك؟</strong> بمعنى آخر - التحكم في الوصول.</p>
<p>في جميع أنحاء الصناعة، تنبع العديد من الحوادث التشغيلية من أخطاء بسيطة في الأذونات. يتم تشغيل برنامج نصي في بيئة خاطئة. حساب خدمة لديه وصول أوسع من المقصود. ينتهي الأمر ببيانات اعتماد مسؤول مشترك في CI. عادةً ما تظهر هذه المشكلات على شكل أسئلة عملية للغاية:</p>
<ul>
<li><p>هل يُسمح للمطورين بحذف مجموعات الإنتاج؟</p></li>
<li><p>لماذا يمكن لحساب اختبار قراءة بيانات ناقلات الإنتاج؟</p></li>
<li><p>لماذا يتم تسجيل دخول خدمات متعددة بنفس دور المسؤول؟</p></li>
<li><p>هل يمكن أن يكون لوظائف التحليلات وصول للقراءة فقط مع عدم وجود امتيازات للكتابة؟</p></li>
</ul>
<p>يعالج<a href="https://milvus.io/">Milvus</a> هذه التحديات من خلال <a href="https://milvus.io/docs/rbac.md">التحكم في الوصول المستند إلى الدور (RBAC)</a>. فبدلاً من منح كل مستخدم حقوق المسؤول الفائق أو محاولة فرض قيود في التعليمات البرمجية للتطبيق، يتيح لك التحكم في الوصول المستند إلى الأدوار (RBAC) تحديد أذونات دقيقة في طبقة قاعدة البيانات. يحصل كل مستخدم أو خدمة على القدرات التي يحتاجها بالضبط - لا أكثر.</p>
<p>يشرح هذا المنشور كيفية عمل RBAC في Milvus، وكيفية تكوينه، وكيفية تطبيقه بأمان في بيئات الإنتاج.</p>
<h2 id="Why-Access-Control-Matters-When-Using-Milvus" class="common-anchor-header">لماذا يعتبر التحكم في الوصول مهمًا عند استخدام ميلفوس<button data-href="#Why-Access-Control-Matters-When-Using-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>عندما تكون الفرق صغيرة، وتخدم تطبيقات الذكاء الاصطناعي الخاصة بها عددًا محدودًا من المستخدمين، عادةً ما تكون البنية التحتية بسيطة. حيث يقوم عدد قليل من المهندسين بإدارة النظام؛ ويتم استخدام ميلفوس للتطوير أو الاختبار فقط؛ وتكون تدفقات العمل التشغيلية مباشرة. في هذه المرحلة المبكرة، نادرًا ما يبدو التحكم في الوصول أمرًا ملحًا - لأن سطح المخاطر صغير ويمكن عكس أي أخطاء بسهولة.</p>
<p>مع انتقال ميلفوس إلى مرحلة الإنتاج وتزايد عدد المستخدمين والخدمات والمشغلين، يتغير نموذج الاستخدام بسرعة. تشمل السيناريوهات الشائعة ما يلي:</p>
<ul>
<li><p>أنظمة أعمال متعددة تتشارك نفس مثيل ميلفوس</p></li>
<li><p>فرق متعددة تصل إلى نفس مجموعات المتجهات</p></li>
<li><p>بيانات الاختبار والتدريج وبيانات الإنتاج التي تتعايش في مجموعة واحدة</p></li>
<li><p>أدوار مختلفة تحتاج إلى مستويات مختلفة من الوصول، من الاستعلامات للقراءة فقط إلى الكتابة والتحكم التشغيلي</p></li>
</ul>
<p>بدون حدود وصول واضحة المعالم، تخلق هذه الإعدادات مخاطر يمكن التنبؤ بها:</p>
<ul>
<li><p>قد تؤدي عمليات سير عمل الاختبار إلى حذف مجموعات الإنتاج عن طريق الخطأ</p></li>
<li><p>قد يقوم المطورون بتعديل الفهارس التي تستخدمها الخدمات المباشرة عن غير قصد</p></li>
<li><p>الاستخدام الواسع النطاق للحساب <code translate="no">root</code> يجعل من المستحيل تتبع الإجراءات أو التدقيق فيها</p></li>
<li><p>قد يحصل التطبيق المخترق على وصول غير مقيد إلى جميع بيانات المتجهات.</p></li>
</ul>
<p>مع تزايد الاستخدام، لم يعد الاعتماد على الاصطلاحات غير الرسمية أو حسابات المسؤول المشتركة مستداماً. يصبح نموذج الوصول المتسق والقابل للتنفيذ أمرًا ضروريًا - وهذا بالضبط ما يوفره نظام Milvus RBAC.</p>
<h2 id="What-is-RBAC-in-Milvus" class="common-anchor-header">ما هو RBAC في ميلفوس<button data-href="#What-is-RBAC-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/rbac.md">RBAC (التحكم في الوصول المستند إلى الدور)</a> هو نموذج إذن يتحكم في الوصول بناءً على <strong>الأدوار</strong> بدلاً من المستخدمين الفرديين. في ميلفوس، يتيح لك التحكم في الوصول القائم على الأدوار في ميلفوس تحديد العمليات التي يُسمح للمستخدم أو الخدمة بتنفيذها بالضبط - وعلى أي موارد محددة. يوفر طريقة منظمة وقابلة للتطوير لإدارة الأمان مع نمو نظامك من مطور واحد إلى بيئة إنتاج كاملة.</p>
<p>يتمحور نظام Milvus RBAC حول المكونات الأساسية التالية:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/users_roles_privileges_030620f913.png" alt="Users Roles Privileges" class="doc-image" id="users-roles-privileges" />
   </span> <span class="img-wrapper"> <span>امتيازات أدوار المستخدمين</span> </span></p>
<ul>
<li><p><strong>المورد</strong>: الكيان الذي يتم الوصول إليه. في ميلفوس، تتضمن الموارد <strong>المثيل</strong> <strong>وقاعدة البيانات</strong> <strong>والمجموعة</strong>.</p></li>
<li><p><strong>الامتيازات</strong>: عملية محددة مسموح بها على مورد - على سبيل المثال، إنشاء مجموعة أو إدراج بيانات أو حذف كيانات.</p></li>
<li><p><strong>مجموعة الامتيازات</strong>: مجموعة محددة مسبقاً من الامتيازات ذات الصلة، مثل "للقراءة فقط" أو "الكتابة".</p></li>
<li><p><strong>الدور</strong>: مجموعة من الامتيازات والموارد التي تنطبق عليها. يحدد الدور العمليات <em>التي</em> يمكن تنفيذها <em>وأين</em> يمكن تنفيذها.</p></li>
<li><p><strong>المستخدم</strong>: هوية في ميلفوس. لكل مستخدم معرف فريد ويتم تعيين دور واحد أو أكثر له.</p></li>
</ul>
<p>تشكل هذه المكونات تسلسلاً هرمياً واضحاً:</p>
<ol>
<li><p><strong>يتم تعيين أدوار للمستخدمين</strong></p></li>
<li><p><strong>تحدد الأدوار الامتيازات</strong></p></li>
<li><p><strong>تنطبق الامتيازات على موارد محددة</strong></p></li>
</ol>
<p>أحد مبادئ التصميم الرئيسية في ميلفوس هو أن <strong>الأذونات لا يتم تعيينها مباشرة للمستخدمين</strong>. تمر جميع الصلاحيات عبر الأدوار. هذا التوجيه يبسط الإدارة، ويقلل من أخطاء التكوين، ويجعل تغييرات الأذونات متوقعة.</p>
<p>يتم توسيع نطاق هذا النموذج بشكل نظيف في عمليات النشر الحقيقية. عندما يشترك عدة مستخدمين في دور ما، فإن تحديث امتيازات الدور يقوم على الفور بتحديث الأذونات لهم جميعًا - دون تعديل كل مستخدم على حدة. إنها نقطة تحكم واحدة تتماشى مع كيفية إدارة البنية التحتية الحديثة للوصول.</p>
<h2 id="How-RBAC-Works-in-Milvus" class="common-anchor-header">كيفية عمل RBAC في ميلفوس<button data-href="#How-RBAC-Works-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>عندما يرسل العميل طلباً إلى Milvus، يقوم النظام بتقييمه من خلال سلسلة من خطوات التفويض. يجب أن تجتاز كل خطوة قبل السماح بمتابعة العملية:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_rbac_works_afe48bc717.png" alt="How RBAC Works in Milvus" class="doc-image" id="how-rbac-works-in-milvus" />
   </span> <span class="img-wrapper"> <span>كيفية عمل RBAC في ملفوس</span> </span></p>
<ol>
<li><p><strong>مصادقة الطلب:</strong> يتحقق ميلفوس أولاً من هوية المستخدم. إذا فشلت المصادقة، يتم رفض الطلب مع ظهور خطأ مصادقة.</p></li>
<li><p><strong>التحقق من تعيين الدور:</strong> بعد المصادقة، يتحقق ميلفوس مما إذا كان المستخدم لديه دور واحد على الأقل معين. إذا لم يتم العثور على أي دور، يتم رفض الطلب مع ظهور خطأ رفض الإذن.</p></li>
<li><p><strong>التحقق من الامتيازات المطلوبة:</strong> يقوم Milvus بعد ذلك بتقييم ما إذا كان دور المستخدم يمنح الامتياز المطلوب على المورد الهدف. في حالة فشل التحقق من الامتيازات، يتم رفض الطلب مع ظهور خطأ رفض الإذن.</p></li>
<li><p><strong>تنفيذ العملية:</strong> إذا نجحت جميع عمليات التحقق، يقوم ميلفوس بتنفيذ العملية المطلوبة وإرجاع النتيجة.</p></li>
</ol>
<h2 id="How-to-Configure-Access-Control-via-RBAC-in-Milvus" class="common-anchor-header">كيفية تكوين التحكم في الوصول عبر RBAC في ميلفوس<button data-href="#How-to-Configure-Access-Control-via-RBAC-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Prerequisites" class="common-anchor-header">1. المتطلبات الأساسية</h3><p>قبل أن يتم تقييم قواعد RBAC وتطبيقها، يجب تمكين مصادقة المستخدم بحيث يمكن ربط كل طلب إلى Milvus بهوية مستخدم معين.</p>
<p>فيما يلي طريقتان قياسيتان للنشر.</p>
<ul>
<li><strong>النشر باستخدام Docker Compose</strong></li>
</ul>
<p>إذا تم نشر ملف Milvus باستخدام Docker Compose، فقم بتحرير ملف التكوين <code translate="no">milvus.yaml</code> وقم بتمكين التخويل عن طريق تعيين <code translate="no">common.security.authorizationEnabled</code> إلى <code translate="no">true</code>:</p>
<pre><code translate="no"><span class="hljs-attr">common</span>:
  <span class="hljs-attr">security</span>:
    <span class="hljs-attr">authorizationEnabled</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>النشر باستخدام مخططات هيلم</strong></li>
</ul>
<p>إذا تم نشر ملف Milvus باستخدام مخططات Helm، فقم بتحرير الملف <code translate="no">values.yaml</code> وأضف التكوين التالي ضمن <code translate="no">extraConfigFiles.user.yaml</code>:</p>
<pre><code translate="no"><span class="hljs-attr">extraConfigFiles</span>:
  user.<span class="hljs-property">yaml</span>: |+
    <span class="hljs-attr">common</span>:
      <span class="hljs-attr">security</span>:
        <span class="hljs-attr">authorizationEnabled</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Initialization" class="common-anchor-header">2. التهيئة</h3><p>بشكل افتراضي، يقوم ميلفوس بإنشاء مستخدم مدمج <code translate="no">root</code> عند بدء تشغيل النظام. كلمة المرور الافتراضية لهذا المستخدم هي <code translate="no">Milvus</code>.</p>
<p>كخطوة أمان أولية، استخدم المستخدم <code translate="no">root</code> للاتصال بـ Milvus وقم بتغيير كلمة المرور الافتراضية على الفور. يوصى بشدة باستخدام كلمة مرور معقدة لمنع الوصول غير المصرح به.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-comment"># Connect to Milvus using the default root user</span>
client = MilvusClient(
    uri=<span class="hljs-string">&#x27;http://localhost:19530&#x27;</span>, 
    token=<span class="hljs-string">&quot;root:Milvus&quot;</span>
)
<span class="hljs-comment"># Update the root password</span>
client.update_password(
    user_name=<span class="hljs-string">&quot;root&quot;</span>,
    old_password=<span class="hljs-string">&quot;Milvus&quot;</span>, 
    new_password=<span class="hljs-string">&quot;xgOoLudt3Kc#Pq68&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Core-Operations" class="common-anchor-header">3. العمليات الأساسية</h3><p><strong>إنشاء المستخدمين</strong></p>
<p>للاستخدام اليومي، يوصى بإنشاء مستخدمين مخصصين بدلاً من استخدام حساب <code translate="no">root</code>.</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>, password=<span class="hljs-string">&quot;P@ssw0rd&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>إنشاء الأدوار</strong></p>
<p>يوفر ميلفوس دورًا مدمجًا <code translate="no">admin</code> مع امتيازات إدارية كاملة. ومع ذلك، بالنسبة لمعظم سيناريوهات الإنتاج، يوصى بإنشاء أدوار مخصصة لتحقيق تحكم وصول أكثر دقة.</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>إنشاء مجموعات امتيازات</strong></p>
<p>مجموعة الامتيازات هي مجموعة من الامتيازات المتعددة. لتبسيط إدارة الأذونات، يمكن تجميع الامتيازات ذات الصلة ومنحها معاً.</p>
<p>يتضمن ميلفوس مجموعات الامتيازات المضمنة التالية:</p>
<ul>
<li><p><code translate="no">COLL_RO</code> <code translate="no">COLL_RW</code>, <code translate="no">COLL_ADMIN</code></p></li>
<li><p><code translate="no">DB_RO</code>، <code translate="no">DB_RW</code>, <code translate="no">DB_ADMIN</code></p></li>
<li><p><code translate="no">Cluster_RO</code> <code translate="no">Cluster_RW</code>, <code translate="no">Cluster_ADMIN</code></p></li>
</ul>
<p>يمكن أن يؤدي استخدام مجموعات الامتيازات المضمنة هذه إلى تقليل تعقيد تصميم الأذونات بشكل كبير وتحسين الاتساق بين الأدوار.</p>
<p>يمكنك إما استخدام مجموعات الامتيازات المضمنة مباشرةً أو إنشاء مجموعات امتيازات مخصصة حسب الحاجة.</p>
<pre><code translate="no"><span class="hljs-comment"># Create a privilege group</span>
client.create_privilege_group(group_name=<span class="hljs-string">&#x27;privilege_group_1&#x27;</span>）
<span class="hljs-comment"># Add privileges to the privilege group</span>
client.add_privileges_to_group(group_name=<span class="hljs-string">&#x27;privilege_group_1&#x27;</span>, privileges=[<span class="hljs-string">&#x27;Query&#x27;</span>, <span class="hljs-string">&#x27;Search&#x27;</span>])
<button class="copy-code-btn"></button></code></pre>
<p><strong>منح الامتيازات أو مجموعات الامتيازات للأدوار</strong></p>
<p>بعد إنشاء الدور، يمكن منح الامتيازات أو مجموعات الامتيازات للدور. يمكن تحديد الموارد المستهدفة لهذه الامتيازات على مستويات مختلفة، بما في ذلك المثيل أو قاعدة البيانات أو المجموعات الفردية.</p>
<pre><code translate="no">client.<span class="hljs-title function_">grant_privilege_v2</span>(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;Search&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
client.<span class="hljs-title function_">grant_privilege_v2</span>(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;privilege_group_1&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
client.<span class="hljs-title function_">grant_privilege_v2</span>(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;ClusterReadOnly&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;*&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p><strong>منح الأدوار للمستخدمين</strong></p>
<p>بمجرد تعيين الأدوار لمستخدم، يمكن للمستخدم الوصول إلى الموارد وتنفيذ العمليات التي تحددها تلك الأدوار. يمكن منح مستخدم واحد دورًا واحدًا أو عدة أدوار، اعتمادًا على نطاق الوصول المطلوب.</p>
<pre><code translate="no">client.<span class="hljs-title function_">grant_role</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>, role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Inspect-and-Revoke-Access" class="common-anchor-header">4. فحص وإلغاء الوصول</h3><p><strong>فحص الأدوار المعينة لمستخدم</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">describe_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>فحص الامتيازات المعينة لدور ما</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">describe_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>إلغاء الامتيازات من أحد الأدوار</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">revoke_privilege_v2</span>(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;Search&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
client.<span class="hljs-title function_">revoke_privilege_v2</span>(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;privilege_group_1&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p><strong>إبطال الأدوار من مستخدم</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">revoke_role</span>(
    user_name=<span class="hljs-string">&#x27;user_1&#x27;</span>,
    role_name=<span class="hljs-string">&#x27;role_a&#x27;</span>
)
<button class="copy-code-btn"></button></code></pre>
<p><strong>حذف المستخدمين والأدوار</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">drop_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>)
client.<span class="hljs-title function_">drop_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Example-Access-Control-Design-for-a-Milvus-Powered-RAG-System" class="common-anchor-header">مثال: تصميم التحكم بالوصول لنظام RAG المدعوم من ميلفوس<button data-href="#Example-Access-Control-Design-for-a-Milvus-Powered-RAG-System" class="anchor-icon" translate="no">
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
    </button></h2><p>ضع في اعتبارك نظام الاسترجاع المعزز (RAG) المبني على نظام Milvus.</p>
<p>في هذا النظام، يكون للمكونات والمستخدمين المختلفين مسؤوليات منفصلة بوضوح، ويتطلب كل منها مستوى مختلف من الوصول.</p>
<table>
<thead>
<tr><th>الجهة الفاعلة</th><th>المسؤولية</th><th>الوصول المطلوب</th></tr>
</thead>
<tbody>
<tr><td>مسؤول المنصة</td><td>عمليات النظام وتكوينه</td><td>الإدارة على مستوى المثيل</td></tr>
<tr><td>خدمة استيعاب المتجهات</td><td>إدخال بيانات المتجهات وتحديثاتها</td><td>الوصول للقراءة والكتابة</td></tr>
<tr><td>خدمة البحث</td><td>البحث عن المتجهات واسترجاعها</td><td>الوصول للقراءة فقط</td></tr>
</tbody>
</table>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
client = MilvusClient(
    uri=<span class="hljs-string">&#x27;http://localhost:19530&#x27;</span>,
    token=<span class="hljs-string">&quot;root:xxx&quot;</span>  <span class="hljs-comment"># Replace with the updated root password</span>
)
<span class="hljs-comment"># 1. Create a user (use a strong password)</span>
client.create_user(user_name=<span class="hljs-string">&quot;rag_admin&quot;</span>, password=<span class="hljs-string">&quot;xxx&quot;</span>)
client.create_user(user_name=<span class="hljs-string">&quot;rag_reader&quot;</span>, password=<span class="hljs-string">&quot;xxx&quot;</span>)
client.create_user(user_name=<span class="hljs-string">&quot;rag_writer&quot;</span>, password=<span class="hljs-string">&quot;xxx&quot;</span>)
<span class="hljs-comment"># 2. Create roles</span>
client.create_role(role_name=<span class="hljs-string">&quot;role_admin&quot;</span>)
client.create_role(role_name=<span class="hljs-string">&quot;role_read_only&quot;</span>)
client.create_role(role_name=<span class="hljs-string">&quot;role_read_write&quot;</span>)
<span class="hljs-comment"># 3. Grant privileges to the role</span>
<span class="hljs-comment">## Using built-in Milvus privilege groups</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_admin&quot;</span>,
    privilege=<span class="hljs-string">&quot;Cluster_Admin&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;*&#x27;</span>,
)
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_read_only&quot;</span>,
    privilege=<span class="hljs-string">&quot;COLL_RO&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_read_write&quot;</span>,
    privilege=<span class="hljs-string">&quot;COLL_RW&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
<span class="hljs-comment"># 4. Assign the role to the user</span>
client.grant_role(user_name=<span class="hljs-string">&quot;rag_admin&quot;</span>, role_name=<span class="hljs-string">&quot;role_admin&quot;</span>)
client.grant_role(user_name=<span class="hljs-string">&quot;rag_reader&quot;</span>, role_name=<span class="hljs-string">&quot;role_read_only&quot;</span>)
client.grant_role(user_name=<span class="hljs-string">&quot;rag_writer&quot;</span>, role_name=<span class="hljs-string">&quot;role_read_write&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Quick-Tips-How-to-Operate-Access-Control-Safely-in-Production" class="common-anchor-header">نصائح سريعة: كيفية تشغيل التحكم في الوصول بأمان في الإنتاج<button data-href="#Quick-Tips-How-to-Operate-Access-Control-Safely-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>لضمان بقاء التحكم في الوصول فعالاً وقابلاً للإدارة في أنظمة الإنتاج طويلة الأمد، اتبع هذه الإرشادات العملية.</p>
<p><strong>1. تغيير كلمة المرور الافتراضية</strong> <code translate="no">root</code> <strong>والحد من استخدام</strong> <strong>الحساب</strong> <code translate="no">root</code> </p>
<p>قم بتحديث كلمة المرور الافتراضية <code translate="no">root</code> مباشرة بعد التهيئة وقصر استخدامها على المهام الإدارية فقط. تجنب استخدام أو مشاركة حساب الجذر في العمليات الروتينية. بدلاً من ذلك، قم بإنشاء مستخدمين وأدوار مخصصة للوصول اليومي لتقليل المخاطر وتحسين المساءلة.</p>
<p><strong>2. اعزل مثيلات ميلفوس فعلياً عبر البيئات</strong></p>
<p>نشر مثيلات Milvus منفصلة للتطوير والتدريج والإنتاج. يوفر العزل المادي حدود أمان أقوى من التحكم المنطقي في الوصول وحده ويقلل بشكل كبير من مخاطر الأخطاء عبر البيئات.</p>
<p><strong>3. اتبع مبدأ الامتيازات الأقل</strong></p>
<p>منح الأذونات المطلوبة لكل دور فقط:</p>
<ul>
<li><p><strong>بيئات التطوير:</strong> يمكن أن تكون الأذونات أكثر تساهلاً لدعم التكرار والاختبار</p></li>
<li><p><strong>بيئات الإنتاج:</strong> يجب أن تقتصر الأذونات على ما هو ضروري فقط.</p></li>
<li><p><strong>عمليات التدقيق المنتظمة:</strong> مراجعة الأذونات الحالية بشكل دوري للتأكد من أنها لا تزال مطلوبة.</p></li>
</ul>
<p><strong>4. إلغاء الأذونات بشكل فعال عندما لا تكون هناك حاجة إليها.</strong></p>
<p>التحكم في الوصول ليس إعداداً لمرة واحدة، بل يتطلب صيانة مستمرة. قم بإلغاء الأدوار والامتيازات على الفور عندما يتغير المستخدمون أو الخدمات أو المسؤوليات. هذا يمنع الأذونات غير المستخدمة من التراكم بمرور الوقت وتصبح مخاطر أمنية خفية.</p>
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
    </button></h2><p>تكوين التحكم في الوصول في ميلفوس ليس معقدًا بطبيعته، ولكنه ضروري لتشغيل النظام بأمان وموثوقية في الإنتاج. باستخدام نموذج RBAC جيد التصميم، يمكنك:</p>
<ul>
<li><p><strong>الحد من المخاطر</strong> عن طريق منع العمليات العرضية أو المدمرة</p></li>
<li><p><strong>تحسين الأمان</strong> من خلال فرض الوصول الأقل امتيازاً إلى بيانات المتجهات</p></li>
<li><p><strong>توحيد العمليات</strong> من خلال فصل واضح للمسؤوليات</p></li>
<li><p><strong>توسيع النطاق بثقة،</strong> ووضع الأساس لعمليات النشر متعددة المستأجرين وعلى نطاق واسع</p></li>
</ul>
<p>التحكم في الوصول ليس ميزة اختيارية أو مهمة لمرة واحدة. إنه جزء أساسي من تشغيل Milvus بأمان على المدى الطويل.</p>
<p>👉 ابدأ ببناء خط أساس أمني متين باستخدام <a href="https://milvus.io/docs/rbac.md">RBAC</a> لنشر Milvus الخاص بك.</p>
<p>هل لديك أسئلة أو تريد التعمق في أي ميزة من أحدث إصدار من Milvus؟ انضم إلى<a href="https://discord.com/invite/8uyFbECzPX"> قناة Discord</a> الخاصة بنا أو قم بتسجيل المشكلات على<a href="https://github.com/milvus-io/milvus"> GitHub</a>. يمكنك أيضًا حجز جلسة فردية مدتها 20 دقيقة للحصول على رؤى وإرشادات وإجابات على أسئلتك من خلال<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> ساعات عمل Milvus المكتبية</a>.</p>
