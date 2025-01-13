---
id: deep-dive-7-query-expression.md
title: كيف تفهم قاعدة البيانات استعلامك وتنفذه؟
author: Milvus
date: 2022-05-05T00:00:00.000Z
desc: الاستعلام المتجه هو عملية استرجاع المتجهات عن طريق التصفية القياسية.
cover: assets.zilliz.com/Deep_Dive_7_baae830823.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-7-query-expression.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deep_Dive_7_baae830823.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>صورة الغلاف</span> </span></p>
<blockquote>
<p>هذه المقالة من تأليف <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">أنجيلا ني</a>.</p>
</blockquote>
<p><a href="https://milvus.io/docs/v2.0.x/query.md">الاستعلام عن المتجهات</a> في ميلفوس هو عملية استرجاع المتجهات عن طريق التصفية العددية القائمة على التعبير المنطقي. باستخدام التصفية القياسية، يمكن للمستخدمين تقييد نتائج استعلامهم بشروط معينة مطبقة على سمات البيانات. على سبيل المثال، إذا استفسر المستخدم عن الأفلام التي صدرت خلال الفترة 1990-2010 والتي حصلت على درجات أعلى من 8.5، فلن تظهر له سوى الأفلام التي تستوفي سماتها (سنة الإصدار والدرجة) الشرط.</p>
<p>يهدف هذا المنشور إلى فحص كيفية إكمال الاستعلام في ميلفوس بدءًا من إدخال تعبير الاستعلام إلى إنشاء خطة الاستعلام وتنفيذ الاستعلام.</p>
<p><strong>الانتقال إلى:</strong></p>
<ul>
<li><a href="#Query-expression">تعبير الاستعلام</a></li>
<li><a href="#Plan-AST-generation">توليد خطة AST</a></li>
<li><a href="#Query-execution">تنفيذ الاستعلام</a></li>
</ul>
<h2 id="Query-expression" class="common-anchor-header">تعبير الاستعلام<button data-href="#Query-expression" class="anchor-icon" translate="no">
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
    </button></h2><p>يعتمد تعبير الاستعلام مع تصفية السمات في ميلفوس على صيغة EBNF (صيغة باكوس-ناور الموسعة). الصورة أدناه هي قواعد التعبير في ملفوس.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Expression_Syntax_966493a5be.png" alt="Expression Syntax" class="doc-image" id="expression-syntax" />
   </span> <span class="img-wrapper"> <span>بناء جملة التعبير</span> </span></p>
<p>يمكن إنشاء التعبيرات المنطقية باستخدام مجموعة من العوامل المنطقية الثنائية، والعوامل المنطقية الأحادية، والتعبيرات المنطقية، والتعبيرات المنطقية، والتعبيرات المفردة. بما أن بناء الجملة EBNF هو بحد ذاته متكرر، يمكن أن يكون التعبير المنطقي نتيجةً لتركيبة أو جزءًا من تعبير منطقي أكبر. يمكن أن يحتوي التعبير المنطقي على العديد من التعبيرات المنطقية الفرعية. تنطبق القاعدة نفسها في ميلفوس. إذا احتاج المستخدم إلى تصفية سمات النتائج بالعديد من الشروط، يمكن للمستخدم إنشاء مجموعة شروط التصفية الخاصة به من خلال الجمع بين عوامل وتعبيرات منطقية مختلفة.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Boolean_expression_1_dce12f8483.png" alt="Boolean expression" class="doc-image" id="boolean-expression" />
   </span> <span class="img-wrapper"> <span>التعبير المنطقي</span> </span></p>
<p>تُظهر الصورة أعلاه جزءًا من <a href="https://milvus.io/docs/v2.0.x/boolean.md">قواعد التعبير المنطقي</a> في ميلفوس. يمكن إضافة العوامل المنطقية الأحادية إلى التعبير. يدعم ميلفوس حاليًا المشغّل المنطقي الأحادي &quot;ليس&quot; فقط، والذي يشير إلى أن النظام يحتاج إلى أخذ المتجهات التي لا تفي قيم حقولها القياسية بنتائج الحساب. تتضمن العوامل المنطقية الثنائية &quot;و&quot; و &quot;أو&quot;. تتضمن التعبيرات المفردة تعبيرات الحدود وتعبيرات المقارنة.</p>
<p>يتم أيضًا دعم العمليات الحسابية الأساسية مثل الجمع والطرح والضرب والقسمة أثناء الاستعلام في ميلفوس. توضح الصورة التالية أسبقية العمليات. يتم سرد المعاملات من الأعلى إلى الأسفل بأسبقية تنازلية.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Precedence_b8cfbdf17b.png" alt="Precedence" class="doc-image" id="precedence" />
   </span> <span class="img-wrapper"> <span>الأسبقية</span> </span></p>
<h3 id="How-a-query-expression-on-certain-films-is-processed-in-Milvus" class="common-anchor-header">كيف تتم معالجة تعبير استعلام على أفلام معينة في ملفوس؟</h3><p>لنفترض أن هناك وفرة من بيانات الأفلام المخزنة في ملفوس ويريد المستخدم الاستعلام عن أفلام معينة. كمثال على ذلك، تحتوي كل بيانات فيلم مخزنة في ملفوس على الحقول الخمسة التالية: معرّف الفيلم، وسنة الإصدار، ونوع الفيلم، والنتيجة، والملصق. في هذا المثال، نوع بيانات معرّف الفيلم وسنة الإصدار هو int64، بينما درجات الفيلم هي بيانات ذات نقاط عائمة. أيضًا، يتم تخزين ملصقات الأفلام بصيغة متجهات النقطة العائمة، ونوع الفيلم بصيغة بيانات السلسلة. وتجدر الإشارة إلى أن دعم نوع بيانات السلسلة هو ميزة جديدة في Milvus 2.1.</p>
<p>على سبيل المثال، إذا أراد المستخدم الاستعلام عن الأفلام ذات الدرجات الأعلى من 8.5. كما يجب أن تكون الأفلام قد صدرت خلال عقد من الزمن قبل عام 2000 إلى عقد بعد عام 2000 أو أن تكون أنواعها إما أفلام كوميدية أو أفلام أكشن، يحتاج المستخدم إلى إدخال التعبير المسند التالي: <code translate="no">score &gt; 8.5 &amp;&amp; (2000 - 10 &lt; release_year &lt; 2000 + 10 || type in [comedy,action])</code>.</p>
<p>عند استلام تعبير الاستعلام، سيقوم النظام بتنفيذه حسب الأسبقية التالية:</p>
<ol>
<li>الاستعلام عن الأفلام ذات الدرجات الأعلى من 8.5. تسمى نتائج الاستعلام &quot;نتيجة 1&quot;.</li>
<li>احسب 2000 - 10 للحصول على "النتيجة2" (1990).</li>
<li>احسب 2000 + 10 للحصول على "النتيجة3" (2010).</li>
<li>الاستعلام عن الأفلام بقيمة <code translate="no">release_year</code> أكبر من &quot;النتيجة2&quot; وأصغر من &quot;النتيجة3&quot;. وهذا يعني أن النظام يحتاج إلى الاستعلام عن الأفلام التي تم إصدارها بين عامي 1990 و2010. تسمى نتائج الاستعلام &quot;نتيجة4&quot;.</li>
<li>الاستعلام عن الأفلام التي هي إما أفلام كوميدية أو أفلام حركة. تُسمى نتائج الاستعلام &quot;نتيجة5&quot;.</li>
<li>اجمع بين "النتيجة4" و"النتيجة5" للحصول على الأفلام التي تم إصدارها بين عامي 1990 و2010 أو التي تنتمي إلى فئة الأفلام الكوميدية أو أفلام الحركة. تسمى النتائج &quot;نتيجة6&quot;.</li>
<li>خذ الجزء المشترك في "النتيجة1" و"النتيجة6" للحصول على النتائج النهائية التي تستوفي جميع الشروط.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_16_00972a6e5d.png" alt="Film example" class="doc-image" id="film-example" />
   </span> <span class="img-wrapper"> <span>مثال فيلم</span> </span></p>
<h2 id="Plan-AST-generation" class="common-anchor-header">توليد خطة AST<button data-href="#Plan-AST-generation" class="anchor-icon" translate="no">
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
    </button></h2><p>تستفيد Milvus من الأداة مفتوحة المصدر <a href="https://www.antlr.org/">ANTLR</a> (أداة أخرى للتعرّف على اللغة) لتوليد خطة AST (شجرة بناء الجملة المجردة). ANTLR هو مولد محلل قوي لقراءة أو معالجة أو تنفيذ أو ترجمة نص البنية أو الملفات الثنائية. بشكل أكثر تحديدًا، يمكن لـ ANTLR توليد محلل لبناء أشجار التحليل والسير فيها بناءً على بناء أو قواعد محددة مسبقًا. الصورة التالية هي مثال يكون فيه تعبير الإدخال &quot;SP=100؛&quot; تُنشئ LEXER، وهي وظيفة التعرّف على اللغة المدمجة في ANTLR، أربعة رموز لتعبير الإدخال - &quot;SP&quot; و &quot;=&quot; و &quot;100&quot; و &quot;؛&quot;. ثم تقوم الأداة بعد ذلك بتحليل الرموز الأربعة لتوليد شجرة التحليل المقابلة.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/parse_tree_b2c3fb0b36.png" alt="parse tree" class="doc-image" id="parse-tree" />
   </span> <span class="img-wrapper"> <span>شجرة التحليل</span> </span></p>
<p>تُعد آلية المشي جزءًا مهمًا في أداة ANTLR. وهي مصممة للسير عبر جميع أشجار التحليل لفحص ما إذا كانت كل عقدة تخضع لقواعد النحو، أو للكشف عن بعض الكلمات الحساسة. بعض واجهات برمجة التطبيقات ذات الصلة مدرجة في الصورة أدناه. بما أن ANTLR يبدأ من العقدة الجذرية وينزل إلى الأسفل عبر كل عقدة فرعية وصولاً إلى الأسفل، فلا حاجة للتمييز بين ترتيب كيفية السير عبر شجرة التحليل.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/parse_tree_walker_9a27942502.png" alt="parse tree walker" class="doc-image" id="parse-tree-walker" />
   </span> <span class="img-wrapper"> <span>مشي شجرة التحليل</span> </span></p>
<p>يُنشئ Milvus PlanAST للاستعلام بطريقة مشابهة لـ ANTLR. ومع ذلك، يتطلب استخدام ANTLR إعادة تعريف قواعد بناء الجملة المعقدة نوعًا ما. لذلك، يتبنى Milvus إحدى القواعد الأكثر انتشارًا - قواعد التعبير المنطقي، ويعتمد على حزمة <a href="https://github.com/antonmedv/expr">Expr</a> المفتوحة المصدر على GitHub للاستعلام وتحليل بناء جملة تعبيرات الاستعلام.</p>
<p>أثناء الاستعلام مع تصفية السمات، سينشئ ميلفوس شجرة خطة بدائية غير محلولة باستخدام أداة تحليل النملة، وهي طريقة التحليل التي يوفرها Expr، عند استلام تعبير الاستعلام. شجرة الخطة البدائية التي سنحصل عليها هي شجرة ثنائية بسيطة. ثم يتم ضبط شجرة الخطة بواسطة Expr والمحسِّن المدمج في Milvus. المُحسِّن في Milvus مشابه تمامًا لآلية المشي المذكورة أعلاه. ونظرًا لأن وظيفة تحسين شجرة الخطة التي يوفرها Expr متطورة جدًا، يتم تخفيف عبء مُحسِّن Milvus المدمج إلى حد كبير. في النهاية، يقوم المحلل بتحليل شجرة الخطة المحسّنة بطريقة عودية لتوليد AST للخطة في بنية <a href="https://developers.google.com/protocol-buffers">مخازن البروتوكول</a> (protobuf).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/plan_AST_workflow_3e50b7a0d4.png" alt="plan AST workflow" class="doc-image" id="plan-ast-workflow" />
   </span> <span class="img-wrapper"> <span>سير عمل AST للخطة</span> </span></p>
<h2 id="Query-execution" class="common-anchor-header">تنفيذ الاستعلام<button data-href="#Query-execution" class="anchor-icon" translate="no">
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
    </button></h2><p>تنفيذ الاستعلام هو في الأساس تنفيذ AST للخطة التي تم إنشاؤها في الخطوات السابقة.</p>
<p>في ميلفوس، يتم تعريف AST للخطة في بنية البروتوكول. الصورة أدناه هي رسالة مع بنية البروتو. هناك ستة أنواع من التعبيرات، من بينها تعبير ثنائي وتعبير أحادي يمكن أن يكون التعبير المنطقي الثنائي والتعبير المنطقي الأحادي.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Protobuf1_232132dcf2.png" alt="protobuf1" class="doc-image" id="protobuf1" />
   </span> <span class="img-wrapper"> <span>بروتوبوف1</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/protobuf2_193f92f033.png" alt="protobuf2" class="doc-image" id="protobuf2" />
   </span> <span class="img-wrapper"> <span>بروتوبوف2</span> </span></p>
<p>الصورة أدناه هي صورة UML لتعبير الاستعلام. وهي توضح الفئة الأساسية والفئة المشتقة لكل تعبير. كل صنف يأتي مع طريقة لقبول معلمات الزائر. هذا هو نمط تصميم الزائر النموذجي. يستخدم Milvus هذا النمط لتنفيذ خطة AST حيث أن أكبر ميزة له هي أن المستخدمين لا يتعين عليهم القيام بأي شيء للتعبيرات البدائية ولكن يمكنهم الوصول مباشرة إلى أحد الأساليب في الأنماط لتعديل فئة تعبير استعلام معينة والعناصر ذات الصلة.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/UML_1238bc30e1.png" alt="UML" class="doc-image" id="uml" />
   </span> <span class="img-wrapper"> <span>UML</span> </span></p>
<p>عند تنفيذ خطة AST، يتلقى ميلفوس أولاً عقدة خطة من النوع الأولي. Then a segcore-type plan node is obtained via the internal C++ proto parser. عند الحصول على هذين النوعين من عقد الخطة، يقبل Milvus سلسلة من الوصول إلى الفئة ثم يعدل وينفذ في البنية الداخلية لعقد الخطة. أخيرًا، يبحث Milvus في جميع عقد خطة التنفيذ للحصول على النتائج التي تمت تصفيتها. يتم إخراج النتائج النهائية بصيغة قناع البت. قناع البت هو مصفوفة من أرقام البتات ("0" و"1"). يتم تمييز تلك البيانات المستوفية لشروط التصفية على أنها "1" في القناع النقطي، بينما يتم تمييز البيانات التي لا تستوفي المتطلبات على أنها "0" في القناع النقطي.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/execute_workflow_d89f1ee925.png" alt="execute workflow" class="doc-image" id="execute-workflow" />
   </span> <span class="img-wrapper"> <span>تنفيذ سير العمل</span> </span></p>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">حول سلسلة الغوص العميق<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>مع <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">الإعلان الرسمي عن توفر</a> الإصدار 2.0 من Milvus 2.0 بشكل عام، قمنا بتنظيم سلسلة مدونات Milvus Deep Dive هذه لتقديم تفسير متعمق لبنية Milvus ورمز المصدر. تشمل الموضوعات التي تتناولها سلسلة المدونات هذه ما يلي:</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">نظرة عامة على بنية ميلفوس</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">واجهات برمجة التطبيقات وحزم تطوير البرمجيات بايثون</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">معالجة البيانات</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">إدارة البيانات</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">الاستعلام في الوقت الحقيقي</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">محرك التنفيذ القياسي</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">نظام ضمان الجودة</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">محرك التنفيذ المتجه</a></li>
</ul>
