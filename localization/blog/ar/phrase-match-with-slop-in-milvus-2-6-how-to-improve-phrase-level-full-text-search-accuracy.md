---
id: >-
  phrase-match-with-slop-in-milvus-2-6-how-to-improve-phrase-level-full-text-search-accuracy.md
title: >-
  مطابقة العبارات مع الانحدار في الإصدار 2.6 من ميلفوس: كيفية تحسين دقة البحث عن
  النص الكامل على مستوى العبارة
author: Alex Zhang
date: 2025-12-29T00:00:00.000Z
cover: assets.zilliz.com/Phrase_Match_Cover_93a84b0587.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus 2.6, Phrase Match, full-text search, keyword matching, vector search'
meta_title: |
  Phrase Match with Slop: Better Full-Text Search Accuracy in Milvus
desc: >-
  تعرف على كيفية دعم مطابقة العبارة في الإصدار Milvus 2.6 للبحث في النص الكامل
  على مستوى العبارة مع الانحدار، مما يتيح تصفية الكلمات الرئيسية بشكل أكثر
  تسامحًا للإنتاج في العالم الحقيقي.
origin: >-
  https://milvus.io/blog/phrase-match-with-slop-in-milvus-2-6-how-to-improve-phrase-level-full-text-search-accuracy.md
---
<p>مع استمرار انفجار البيانات غير المهيكلة واستمرار ازدياد ذكاء نماذج الذكاء الاصطناعي، أصبح البحث المتجه طبقة الاسترجاع الافتراضية للعديد من أنظمة الذكاء الاصطناعي - خطوط أنابيب الذكاء الاصطناعي والبحث بالذكاء الاصطناعي والوكلاء ومحركات التوصيات وغيرها. إنه يعمل لأنه يلتقط المعنى: ليس فقط الكلمات التي يكتبها المستخدمون، ولكن القصد من وراءها.</p>
<p>ومع ذلك، بمجرد انتقال هذه التطبيقات إلى مرحلة الإنتاج، غالبًا ما تكتشف الفرق أن الفهم الدلالي ليس سوى جانب واحد من مشكلة الاسترجاع. تعتمد العديد من أعباء العمل أيضًا على قواعد نصية صارمة - مثل مطابقة المصطلحات الدقيقة، أو الحفاظ على ترتيب الكلمات، أو تحديد العبارات التي تحمل أهمية تقنية أو قانونية أو تشغيلية.</p>
<p>يزيل<a href="https://milvus.io/docs/release_notes.md#v267">الإصدار Milvus 2.6</a> هذا الانقسام من خلال إدخال البحث عن النص الكامل الأصلي مباشرةً في قاعدة بيانات المتجهات. وبفضل الفهارس الرمزية والموضعية المضمنة في المحرك الأساسي، يمكن ل Milvus تفسير القصد الدلالي للاستعلام مع فرض قيود دقيقة على مستوى الكلمات الرئيسية والعبارات. والنتيجة هي خط أنابيب استرجاع موحد يعزز فيه المعنى والمبنى بعضهما البعض بدلاً من العيش في أنظمة منفصلة.</p>
<p>تُعد<a href="https://milvus.io/docs/phrase-match.md">مطابقة العبارات</a> جزءًا أساسيًا من إمكانية النص الكامل هذه. فهو يحدد تسلسل المصطلحات التي تظهر معًا وبالترتيب - وهو أمر حاسم للكشف عن أنماط السجلات، وتوقيعات الأخطاء، وأسماء المنتجات، وأي نص يحدد فيه ترتيب الكلمات المعنى. سنشرح في هذا المنشور كيفية عمل <a href="https://milvus.io/docs/phrase-match.md">مطابقة العبارة</a> في <a href="https://milvus.io/">Milvus،</a> وكيف يضيف <code translate="no">slop</code> المرونة اللازمة للنص الواقعي، ولماذا تجعل هذه الميزات البحث الهجين المتجه-النص الكامل ليس فقط ممكنًا بل عمليًا في قاعدة بيانات واحدة.</p>
<h2 id="What-is-Phrase-Match" class="common-anchor-header">ما هو تطابق العبارات؟<button data-href="#What-is-Phrase-Match" class="anchor-icon" translate="no">
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
    </button></h2><p>Phrase Match هو نوع من الاستعلام عن النص الكامل في Milvus يركز على <em>البنية - وتحديدًا،</em>ما إذا كان تسلسل الكلمات يظهر بنفس الترتيب داخل المستند. عندما لا يُسمح بأي مرونة، يتصرف الاستعلام بشكل صارم: يجب أن تظهر المصطلحات بجانب بعضها البعض وبالتسلسل. وبالتالي فإن استعلام مثل <strong>"التعلم الآلي للروبوتات"</strong> يتطابق فقط عندما تظهر هذه الكلمات الثلاث كعبارة متصلة.</p>
<p>يكمن التحدي في أن النص الحقيقي نادراً ما يتصرف بهذه الدقة. فاللغة الطبيعية تُدخِل ضوضاء: حيث تنزلق الصفات الإضافية، وتعيد السجلات ترتيب الحقول، وتكتسب أسماء المنتجات معدّلات، ولا يكتب المؤلفون البشر مع وضع محركات الاستعلام في الاعتبار. تنكسر المطابقة الصارمة للعبارات بسهولة - يمكن أن تتسبب كلمة واحدة مُدرجة أو إعادة صياغة واحدة أو مصطلح واحد مبدل في حدوث خطأ. وفي العديد من أنظمة الذكاء الاصطناعي، وخاصة تلك التي تواجه الإنتاج، فإن فقدان سطر سجل ذي صلة أو عبارة محفزة للقاعدة غير مقبول.</p>
<p>يعالج ميلفوس 2.6 هذا الاحتكاك بآلية بسيطة: <strong>الانحدار</strong>. يحدد الانحدار <em>مقدار مساحة المناورة المسموح بها بين</em> عبارات <em>الاستعلام</em>. وبدلاً من التعامل مع العبارة على أنها هشة وغير مرنة، يتيح لك الانحدار تحديد ما إذا كانت كلمة واحدة إضافية مقبولة أو كلمتين، أو حتى ما إذا كانت إعادة الترتيب الطفيفة يجب أن تظل تُعتبر مطابقة. هذا ينقل البحث عن العبارة من اختبار نجاح-فشل ثنائي إلى أداة استرجاع مضبوطة وقابلة للضبط.</p>
<p>لمعرفة سبب أهمية ذلك، تخيل أن تبحث في السجلات عن جميع المتغيرات للخطأ المألوف في الشبكات <strong>"إعادة تعيين الاتصال من قبل النظير".</strong> عملياً، قد تبدو سجلاتك كما يلي:</p>
<pre><code translate="no">connection reset <span class="hljs-keyword">by</span> peer
connection fast reset <span class="hljs-keyword">by</span> peer
connection was suddenly reset <span class="hljs-keyword">by</span> the peer
peer reset connection <span class="hljs-keyword">by</span> ...
peer unexpected connection reset happened
<button class="copy-code-btn"></button></code></pre>
<p>في لمحة خاطفة، كل هذه تمثل نفس الحدث الأساسي. لكن طرق الاسترجاع الشائعة تكافح:</p>
<h3 id="BM25-struggles-with-structure" class="common-anchor-header">يكافح BM25 مع البنية.</h3><p>فهو ينظر إلى الاستعلام كحقيبة من الكلمات المفتاحية، متجاهلاً ترتيب ظهورها. وطالما ظهرت كلمة "اتصال" و"نظير" في مكان ما، فقد يصنف BM25 المستند في مرتبة عالية - حتى لو كانت العبارة معكوسة أو غير مرتبطة بالمفهوم الذي تبحث عنه بالفعل.</p>
<h3 id="Vector-search-struggles-with-constraints" class="common-anchor-header">يكافح البحث المتجه مع القيود.</h3><p>تتفوق التضمينات في التقاط المعنى والعلاقات الدلالية، لكنها لا تستطيع فرض قاعدة مثل "يجب أن تظهر هذه الكلمات في هذا التسلسل". قد تسترجع رسائل مرتبطة دلاليًا، ولكنك قد تفتقد النمط الهيكلي الدقيق المطلوب لتصحيح الأخطاء أو الامتثال.</p>
<p>تملأ مطابقة العبارة الفجوة بين هذين النهجين. باستخدام <strong>الانحدار،</strong> يمكنك تحديد مقدار الاختلاف المقبول بالضبط:</p>
<ul>
<li><p><code translate="no">slop = 0</code> - المطابقة التامة (يجب أن تظهر جميع المصطلحات بشكل متجاور ومرتب).</p></li>
<li><p><code translate="no">slop = 1</code> - السماح بكلمة واحدة إضافية (يغطي الاختلافات الشائعة في اللغة الطبيعية بمصطلح واحد مُدرج).</p></li>
<li><p><code translate="no">slop = 2</code> - السماح بإدراج كلمات متعددة (يعالج الصياغة الوصفية أو المطولة).</p></li>
<li><p><code translate="no">slop = 3</code> - السماح بإعادة الترتيب (يدعم العبارات المعكوسة أو غير المرتبة، وغالبًا ما تكون أصعب حالة في النص الواقعي).</p></li>
</ul>
<p>بدلاً من أن تأمل في أن تقوم خوارزمية التسجيل "بالترتيب الصحيح"، يمكنك الإعلان صراحةً عن التسامح البنيوي الذي يتطلبه تطبيقك.</p>
<h2 id="How-Phrase-Match-Works-in-Milvus" class="common-anchor-header">كيفية عمل مطابقة العبارات في ميلفوس<button data-href="#How-Phrase-Match-Works-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>مدعومًا بمكتبة محرك البحث <a href="https://github.com/quickwit-oss/tantivy">Tantivy،</a> يتم تنفيذ مطابقة العبارة في Milvus على رأس فهرس مقلوب مع معلومات موضعية. فبدلاً من التحقق فقط من ظهور المصطلحات في مستند ما، فإنه يتحقق من ظهورها بالترتيب الصحيح وضمن مسافة يمكن التحكم فيها.</p>
<p>يوضح الرسم البياني أدناه العملية:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/phrase_match_workflow_a4f3badb66.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>1. ترميز المستند (مع تحديد المواقع)</strong></p>
<p>عندما يتم إدراج المستندات في Milvus، تتم معالجة حقول النص بواسطة <a href="https://milvus.io/docs/analyzer-overview.md">محلل،</a> والذي يقسم النص إلى رموز (كلمات أو مصطلحات) ويسجل موضع كل رمز داخل المستند. على سبيل المثال، يتم ترميز <code translate="no">doc_1</code> على أنه: <code translate="no">machine (pos=0), learning (pos=1), boosts (pos=2), efficiency (pos=3)</code>.</p>
<p><strong>2. إنشاء الفهرس المقلوب</strong></p>
<p>بعد ذلك، يقوم ميلفوس بإنشاء فهرس مقلوب. فبدلاً من تعيين المستندات إلى محتوياتها، يقوم الفهرس المقلوب بتعيين كل رمز إلى المستندات التي يظهر فيها، إلى جانب جميع المواضع المسجلة لهذا الرمز داخل كل مستند.</p>
<p><strong>3. مطابقة العبارة</strong></p>
<p>عندما يتم تنفيذ استعلام عن عبارة، يستخدم ميلفوس أولاً الفهرس المقلوب لتحديد المستندات التي تحتوي على جميع رموز الاستعلام. ثم يقوم بعد ذلك بالتحقق من صحة كل مرشح من خلال مقارنة مواضع الرموز الرمزية للتأكد من ظهور العبارات بالترتيب الصحيح وضمن المسافة المسموح بها <code translate="no">slop</code>. يتم إرجاع المستندات التي تستوفي كلا الشرطين فقط كمطابقات.</p>
<p>يلخص الرسم البياني أدناه كيفية عمل مطابقة العبارة من طرف إلى طرف.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/workflow2_63c168b107.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="How-to-Enable-Phrase-Match-in-Milvus" class="common-anchor-header">كيفية تمكين مطابقة العبارة في ملفوس<button data-href="#How-to-Enable-Phrase-Match-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>تعمل مطابقة العبارة على الحقول من النوع <strong><code translate="no">VARCHAR</code></strong>نوع السلسلة في ملفوس. لاستخدامها، يجب عليك تكوين مخطط مجموعتك بحيث يقوم Milvus بإجراء تحليل النص وتخزين المعلومات الموضعية للحقل. يتم ذلك من خلال تمكين معلمتين: <code translate="no">enable_analyzer</code> و <code translate="no">enable_match</code>.</p>
<h3 id="Set-enableanalyzer-and-enablematch" class="common-anchor-header">تعيين تمكين_المحلل وتمكين_المطابقة</h3><p>لتشغيل مطابقة العبارة لحقل VARCHAR معين، قم بتعيين المعلمتين على <code translate="no">True</code> عند تحديد مخطط الحقل. يخبران معًا ميلفوس بـ</p>
<ul>
<li><p><strong>ترميز</strong> النص (عبر <code translate="no">enable_analyzer</code>)، و</p></li>
<li><p><strong>إنشاء فهرس مقلوب مع إزاحات موضعية</strong> (عبر <code translate="no">enable_match</code>).</p></li>
</ul>
<p>تعتمد مطابقة العبارة على كلتا الخطوتين: يقوم المحلل بتقسيم النص إلى رموز، ويخزن فهرس المطابقة مكان ظهور تلك الرموز، مما يتيح الاستعلامات الفعالة القائمة على العبارات والعلامات المائلة.</p>
<p>فيما يلي مثال على تكوين المخطط الذي يتيح مطابقة العبارة على حقل <code translate="no">text</code>:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

schema = MilvusClient.create_schema(enable_dynamic_field=<span class="hljs-literal">False</span>)
schema.add_field(
    field_name=<span class="hljs-string">&quot;id&quot;</span>,
    datatype=DataType.INT64,
    is_primary=<span class="hljs-literal">True</span>,
    auto_id=<span class="hljs-literal">True</span>
)
schema.add_field(
    field_name=<span class="hljs-string">&#x27;text&#x27;</span>,                 <span class="hljs-comment"># Name of the field</span>
    datatype=DataType.VARCHAR,         <span class="hljs-comment"># Field data type set as VARCHAR (string)</span>
    max_length=<span class="hljs-number">1000</span>,                   <span class="hljs-comment"># Maximum length of the string</span>
    enable_analyzer=<span class="hljs-literal">True</span>,              <span class="hljs-comment"># Enables text analysis (tokenization)</span>
    enable_match=<span class="hljs-literal">True</span>                  <span class="hljs-comment"># Enables inverted indexing for phrase matching</span>
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;embeddings&quot;</span>,
    datatype=DataType.FLOAT_VECTOR,
    dim=<span class="hljs-number">5</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Search-with-Phrase-Match-How-Slop-Affects-the-Candidate-Set" class="common-anchor-header">البحث باستخدام مطابقة العبارة: كيف يؤثر الانحدار على مجموعة المرشحين<button data-href="#Search-with-Phrase-Match-How-Slop-Affects-the-Candidate-Set" class="anchor-icon" translate="no">
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
    </button></h2><p>بمجرد تمكين المطابقة لحقل VARCHAR في مخطط المجموعة الخاص بك، يمكنك إجراء مطابقات العبارات باستخدام التعبير <code translate="no">PHRASE_MATCH</code>.</p>
<p>ملاحظة: التعبير <code translate="no">PHRASE_MATCH</code> غير حساس لحالة الأحرف. يمكنك استخدام إما <code translate="no">PHRASE_MATCH</code> أو <code translate="no">phrase_match</code>.</p>
<p>في عمليات البحث، يتم تطبيق مطابقة العبارة عادةً قبل ترتيب التشابه المتجه. يقوم أولاً بتصفية المستندات بناءً على قيود نصية صريحة، مما يؤدي إلى تضييق نطاق المجموعة المرشحة. ثم يتم إعادة ترتيب المستندات المتبقية باستخدام تضمينات المتجهات.</p>
<p>يوضح المثال أدناه كيف تؤثر القيم المختلفة <code translate="no">slop</code> على هذه العملية. من خلال ضبط المعلمة <code translate="no">slop</code> ، يمكنك التحكم مباشرةً في المستندات التي تجتاز مرشح العبارات وتنتقل إلى مرحلة ترتيب المتجهات.</p>
<p>لنفترض أن لديك مجموعة باسم <code translate="no">tech_articles</code> تحتوي على الكيانات الخمسة التالية:</p>
<table>
<thead>
<tr><th><strong>doc_id</strong></th><th><strong>نص</strong></th></tr>
</thead>
<tbody>
<tr><td>1</td><td>التعلم الآلي يعزز الكفاءة في تحليل البيانات على نطاق واسع</td></tr>
<tr><td>2</td><td>يُعد تعلم النهج القائم على الآلة أمرًا حيويًا لتقدم الذكاء الاصطناعي الحديث</td></tr>
<tr><td>3</td><td>تعمل البنى الآلية للتعلم العميق على تحسين الأحمال الحاسوبية</td></tr>
<tr><td>4</td><td>تعمل الآلة بسرعة على تحسين أداء النموذج للتعلم المستمر</td></tr>
<tr><td>5</td><td>يؤدي تعلم خوارزميات الآلة المتقدمة إلى توسيع قدرات الذكاء الاصطناعي</td></tr>
</tbody>
</table>
<p><strong><code translate="no">slop=1</code></strong></p>
<p>هنا، نسمح هنا بـ 1. يتم تطبيق الفلتر على المستندات التي تحتوي على عبارة "آلة التعلم" مع مرونة طفيفة.</p>
<pre><code translate="no"><span class="hljs-comment"># Example: Filter documents containing &quot;learning machine&quot; with slop=1</span>
filter_slop1 = <span class="hljs-string">&quot;PHRASE_MATCH(text, &#x27;learning machine&#x27;, 1)&quot;</span>

result_slop1 = client.search(
    collection_name=<span class="hljs-string">&quot;tech_articles&quot;</span>,
    anns_field=<span class="hljs-string">&quot;embeddings&quot;</span>,
    data=[query_vector],
    <span class="hljs-built_in">filter</span>=filter_slop1,
    search_params={<span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
    limit=<span class="hljs-number">10</span>,
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>نتائج المطابقة:</p>
<table>
<thead>
<tr><th>doc_id</th><th>نص</th></tr>
</thead>
<tbody>
<tr><td>2</td><td>يعد تعلم النهج القائم على الآلة أمرًا حيويًا لتقدم الذكاء الاصطناعي الحديث</td></tr>
<tr><td>3</td><td>تعمل البنى الآلية للتعلم العميق على تحسين الأحمال الحسابية</td></tr>
<tr><td>5</td><td>يؤدي تعلم خوارزميات الآلة المتقدمة إلى توسيع قدرات الذكاء الاصطناعي</td></tr>
</tbody>
</table>
<p><strong><code translate="no">slop=2</code></strong></p>
<p>يسمح هذا المثال بـ 2 منحدر، مما يعني أنه يُسمح بما يصل إلى رمزين إضافيين (أو مصطلحين معكوسين) بين كلمتي "آلة" و"تعلم".</p>
<pre><code translate="no"><span class="hljs-comment"># Example: Filter documents containing &quot;machine learning&quot; with slop=2</span>
filter_slop2 = <span class="hljs-string">&quot;PHRASE_MATCH(text, &#x27;machine learning&#x27;, 2)&quot;</span>

result_slop2 = client.search(
    collection_name=<span class="hljs-string">&quot;tech_articles&quot;</span>,
    anns_field=<span class="hljs-string">&quot;embeddings&quot;</span>,             <span class="hljs-comment"># Vector field name</span>
    data=[query_vector],                 <span class="hljs-comment"># Query vector</span>
    <span class="hljs-built_in">filter</span>=filter_slop2,                 <span class="hljs-comment"># Filter expression</span>
    search_params={<span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
    limit=<span class="hljs-number">10</span>,                            <span class="hljs-comment"># Maximum results to return</span>
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>نتائج المطابقة:</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>doc_id</strong></th><th style="text-align:center"><strong>نص</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">1</td><td style="text-align:center">يعزز التعلم الآلي الكفاءة في تحليل البيانات على نطاق واسع</td></tr>
<tr><td style="text-align:center">3</td><td style="text-align:center">تعمل البنى الآلية للتعلم العميق على تحسين الأحمال الحسابية</td></tr>
</tbody>
</table>
<p><strong><code translate="no">slop=3</code></strong></p>
<p>في هذا المثال، يوفر المنحدر 3 المزيد من المرونة. يبحث المرشح عن "التعلم الآلي" مع السماح بما يصل إلى ثلاثة مواضع رمزية بين الكلمات.</p>
<pre><code translate="no"><span class="hljs-comment"># Example: Filter documents containing &quot;machine learning&quot; with slop=3</span>
filter_slop3 = <span class="hljs-string">&quot;PHRASE_MATCH(text, &#x27;machine learning&#x27;, 3)&quot;</span>

result_slop2 = client.search(
    collection_name=<span class="hljs-string">&quot;tech_articles&quot;</span>,
    anns_field=<span class="hljs-string">&quot;embeddings&quot;</span>,             <span class="hljs-comment"># Vector field name</span>
    data=[query_vector],                 <span class="hljs-comment"># Query vector</span>
    <span class="hljs-built_in">filter</span>=filter_slop3,                 <span class="hljs-comment"># Filter expression</span>
    search_params={<span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
    limit=<span class="hljs-number">10</span>,                            <span class="hljs-comment"># Maximum results to return</span>
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>نتائج المطابقة:</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>doc_id</strong></th><th style="text-align:center"><strong>نص</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">1</td><td style="text-align:center">التعلّم الآلي يعزز الكفاءة في تحليل البيانات على نطاق واسع</td></tr>
<tr><td style="text-align:center">2</td><td style="text-align:center">يُعد تعلم النهج القائم على الآلة أمرًا حيويًا لتقدم الذكاء الاصطناعي الحديث</td></tr>
<tr><td style="text-align:center">3</td><td style="text-align:center">تعمل البنى الآلية للتعلم العميق على تحسين الأحمال الحسابية</td></tr>
<tr><td style="text-align:center">5</td><td style="text-align:center">تعلم خوارزميات الآلة المتقدمة يوسع قدرات الذكاء الاصطناعي</td></tr>
</tbody>
</table>
<h2 id="Quick-Tips-What-You-Need-to-Know-Before-Enabling-Phrase-Match-in-Milvus" class="common-anchor-header">نصائح سريعة ما تحتاج إلى معرفته قبل تمكين مطابقة العبارات في ميلفوس<button data-href="#Quick-Tips-What-You-Need-to-Know-Before-Enabling-Phrase-Match-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>توفر مطابقة العبارات دعمًا للتصفية على مستوى العبارة، ولكن تمكينها ينطوي على أكثر من مجرد تكوين وقت الاستعلام. من المفيد أن تكون على دراية بالاعتبارات المرتبطة بها قبل تطبيقها في إعداد الإنتاج.</p>
<ul>
<li><p>يؤدي تمكين مطابقة العبارة على حقل ما إلى إنشاء فهرس مقلوب، مما يزيد من استخدام التخزين. تعتمد التكلفة الدقيقة على عوامل مثل طول النص، وعدد الرموز الفريدة، وتكوين المحلل. عند العمل مع حقول نصية كبيرة أو بيانات عالية الكاردينالية، يجب أخذ هذه التكلفة الزائدة في الاعتبار مقدمًا.</p></li>
<li><p>تكوين المحلّل هو خيار تصميم حاسم آخر. بمجرد تعريف المحلل في مخطط المجموعة، لا يمكن تغييره. يتطلب التبديل إلى محلل مختلف في وقت لاحق إسقاط المجموعة الحالية وإعادة إنشائها بمخطط جديد. لهذا السبب، يجب التعامل مع اختيار المحلل كقرار طويل الأمد وليس كتجربة.</p></li>
<li><p>يرتبط سلوك مطابقة العبارة ارتباطًا وثيقًا بكيفية ترميز النص. قبل تطبيق محلل على مجموعة كاملة، يوصى باستخدام طريقة <code translate="no">run_analyzer</code> لفحص مخرجات الترميز والتأكد من مطابقتها لتوقعاتك. يمكن أن تساعد هذه الخطوة في تجنب عدم التطابق الدقيق ونتائج الاستعلام غير المتوقعة لاحقًا. لمزيد من المعلومات، راجع <a href="https://milvus.io/docs/analyzer-overview.md#share-DYZvdQ2vUowWEwx1MEHcdjNNnqT">نظرة عامة</a> على <a href="https://milvus.io/docs/analyzer-overview.md#share-DYZvdQ2vUowWEwx1MEHcdjNNnqT">المحلل</a>.</p></li>
</ul>
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
    </button></h2><p>مطابقة العبارة هي نوع بحث أساسي في النص الكامل يتيح قيودًا على مستوى العبارة والقيود الموضعية تتجاوز مجرد مطابقة الكلمات المفتاحية. من خلال العمل على ترتيب الرمز المميز والقرب، فإنه يوفر طريقة دقيقة ويمكن التنبؤ بها لتصفية المستندات بناءً على كيفية ظهور المصطلحات فعليًا في النص.</p>
<p>في أنظمة الاسترجاع الحديثة، عادةً ما يتم تطبيق مطابقة العبارة قبل الترتيب المستند إلى المتجه. فهو يقصر أولاً مجموعة المستندات المرشحة على المستندات التي تفي صراحةً بالعبارات أو التراكيب المطلوبة. ثم يتم استخدام البحث المتجه لترتيب هذه النتائج حسب الصلة الدلالية. يكون هذا النمط فعالاً بشكل خاص في سيناريوهات مثل تحليل السجلات، والبحث في الوثائق التقنية، وخطوط أنابيب RAG، حيث يجب فرض قيود نصية قبل النظر في التشابه الدلالي.</p>
<p>مع إدخال المعلمة <code translate="no">slop</code> في Milvus 2.6، أصبحت مطابقة العبارات أكثر تسامحًا مع التباين اللغوي الطبيعي مع الاحتفاظ بدورها كآلية تصفية النص الكامل. وهذا يجعل من السهل تطبيق القيود على مستوى العبارة في عمليات سير عمل استرجاع الإنتاج.</p>
<p>جربه مع البرامج النصية <a href="https://github.com/openvino-book/Milvus-Phrase-Match-Demo">التجريبية،</a> واستكشف <a href="https://milvus.io/docs/release_notes.md#v267">Milvus 2.6</a> لترى كيف يتناسب الاسترجاع المدرك للعبارات مع مجموعتك.</p>
<p>هل لديك أسئلة أو تريد التعمق في أي ميزة من أحدث إصدار من ميلفوس؟ انضم إلى<a href="https://discord.com/invite/8uyFbECzPX"> قناة Discord</a> الخاصة بنا أو قم بتسجيل المشكلات على<a href="https://github.com/milvus-io/milvus"> GitHub</a>. يمكنك أيضًا حجز جلسة فردية مدتها 20 دقيقة للحصول على رؤى وإرشادات وإجابات لأسئلتك من خلال<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> ساعات عمل Milvus المكتبية</a>.</p>
