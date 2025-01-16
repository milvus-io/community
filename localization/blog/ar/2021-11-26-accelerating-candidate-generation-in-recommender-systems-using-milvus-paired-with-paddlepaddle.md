---
id: >-
  2021-11-26-accelerating-candidate-generation-in-recommender-systems-using-milvus-paired-with-paddlepaddle.md
title: >-
  تسريع عملية توليد المرشحين في أنظمة التوصية باستخدام Milvus المقترن بـ
  PaddlePaddle
author: Yunmei
date: 2021-11-26T00:00:00.000Z
desc: الحد الأدنى لسير عمل نظام التوصية
cover: assets.zilliz.com/Candidate_generation_9baf7beb86.png
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/accelerating-candidate-generation-in-recommender-systems-using-milvus-paired-with-paddlepaddle
---
<p>إذا كانت لديك خبرة في تطوير نظام توصية، فمن المرجح أنك وقعت ضحية لواحدة على الأقل مما يلي:</p>
<ul>
<li>النظام بطيء للغاية عند إرجاع النتائج بسبب الكم الهائل من مجموعات البيانات.</li>
<li>لا يمكن معالجة البيانات المدرجة حديثًا في الوقت الفعلي للبحث أو الاستعلام.</li>
<li>نشر نظام التوصية أمر شاق.</li>
</ul>
<p>تهدف هذه المقالة إلى معالجة المشكلات المذكورة أعلاه وتقديم بعض الأفكار من خلال تقديم مشروع نظام التوصية بالمنتجات الذي يستخدم قاعدة بيانات Milvus، وهي قاعدة بيانات متجهة مفتوحة المصدر، مقترنة بمنصة PaddlePaddle، وهي منصة للتعلم العميق.</p>
<p>تتناول هذه المقالة وصفًا موجزًا للحد الأدنى من سير عمل نظام التوصية. ثم ينتقل إلى تقديم المكونات الرئيسية وتفاصيل تنفيذ هذا المشروع.</p>
<h2 id="The-basic-workflow-of-a-recommender-system" class="common-anchor-header">سير العمل الأساسي لنظام التوصية<button data-href="#The-basic-workflow-of-a-recommender-system" class="anchor-icon" translate="no">
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
    </button></h2><p>قبل التعمق في المشروع نفسه، دعونا أولاً نلقي نظرة على سير العمل الأساسي لنظام التوصية. يمكن لنظام التوصية إرجاع نتائج مخصصة وفقًا لاهتمامات واحتياجات المستخدم الفريدة. ولتقديم مثل هذه التوصيات المخصصة، يمر النظام بمرحلتين، توليد المرشحين وترتيبهم.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_29e27eb9b1.png" alt="2.png" class="doc-image" id="2.png" />
   </span> <span class="img-wrapper"> <span>2.png</span> </span></p>
<p>المرحلة الأولى هي توليد المرشحين، والتي تُرجع البيانات الأكثر صلة أو البيانات المشابهة، مثل منتج أو مقطع فيديو يطابق ملف تعريف المستخدم. أثناء توليد المرشحين، يقارن النظام سمة المستخدم بالبيانات المخزنة في قاعدة بياناته، ويسترجع تلك البيانات المشابهة. ثم أثناء الترتيب، يقوم النظام بتصنيف البيانات المسترجعة وإعادة ترتيبها. وأخيرًا، يتم عرض تلك النتائج في أعلى القائمة على المستخدمين.</p>
<p>في حالة نظام التوصية بالمنتجات، يقوم النظام أولاً بمقارنة الملف الشخصي للمستخدم بخصائص المنتجات الموجودة في المخزون لتصفية قائمة المنتجات التي تلبي احتياجات المستخدم. ثم يقوم النظام بتصنيف المنتجات بناءً على مدى تشابهها مع الملف الشخصي للمستخدم، ثم يقوم بترتيبها، وأخيرًا يُعيد أفضل 10 منتجات للمستخدم.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_5850ba2c46.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span></p>
<h2 id="System-architecture" class="common-anchor-header">بنية النظام<button data-href="#System-architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>يستخدم نظام التوصية بالمنتجات في هذا المشروع ثلاثة مكونات: MIND و PaddleRec و Milvus.</p>
<h3 id="MIND" class="common-anchor-header">MIND</h3><p><a href="https://arxiv.org/pdf/1904.08030">MIND،</a> وهي اختصار لعبارة &quot;شبكة متعددة الاهتمامات مع التوجيه الديناميكي للتوصية في Tmall&quot;، هي خوارزمية طورتها مجموعة علي بابا. قبل اقتراح MIND، استخدمت معظم نماذج الذكاء الاصطناعي السائدة للتوصية متجهًا واحدًا لتمثيل اهتمامات المستخدم المتنوعة. ومع ذلك، لا يكفي متجه واحد لتمثيل الاهتمامات الدقيقة للمستخدم. لذلك، تم اقتراح خوارزمية MIND لتحويل اهتمامات المستخدم المتعددة إلى عدة متجهات.</p>
<p>على وجه التحديد، تتبنى MIND <a href="https://arxiv.org/pdf/2005.09347">شبكة متعددة</a> الاهتمامات مع توجيه ديناميكي لمعالجة الاهتمامات المتعددة لمستخدم واحد خلال مرحلة توليد المرشحين. شبكة الاهتمامات المتعددة هي طبقة من مستخرج الاهتمامات المتعددة مبني على آلية توجيه الكبسولة. يمكن استخدامها لدمج السلوكيات السابقة للمستخدم مع اهتماماته المتعددة، لتوفير ملف تعريف دقيق للمستخدم.</p>
<p>يوضح الرسم البياني التالي بنية شبكة MIND.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_9e6f284ea2.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<p>لتمثيل سمة المستخدمين، تأخذ MIND سلوكيات المستخدم واهتمامات المستخدم كمدخلات، ثم تغذيها في طبقة التضمين لتوليد متجهات المستخدم، بما في ذلك متجهات اهتمامات المستخدم ومتجهات سلوك المستخدم. ثم يتم تغذية متجهات سلوك المستخدم في طبقة مستخرج الاهتمامات المتعددة لتوليد كبسولات اهتمامات المستخدمين. بعد تجميع كبسولات اهتمامات المستخدم مع تضمينات سلوك المستخدم واستخدام عدة طبقات ReLU لتحويلها، يُنتج MIND عدة متجهات تمثيلية للمستخدم. وقد حدد هذا المشروع أن MIND سيُخرج في النهاية أربعة متجهات تمثيل للمستخدمين.</p>
<p>من ناحية أخرى، تمر سمات المنتج عبر طبقة التضمين ويتم تحويلها إلى متجهات عناصر متفرقة. ثم يمر كل متجه عنصر عبر طبقة التجميع ليصبح متجهًا كثيفًا.</p>
<p>عندما يتم تحويل جميع البيانات إلى متجهات، يتم إدخال طبقة انتباه إضافية مدركة للتسميات لتوجيه عملية التدريب.</p>
<h3 id="PaddleRec" class="common-anchor-header">PaddleRec</h3><p><a href="https://github.com/PaddlePaddle/PaddleRec/blob/release/2.2.0/README_EN.md">PaddleRec</a> هي مكتبة نموذج بحث واسع النطاق للتوصية. وهي جزء من نظام Baidu <a href="https://github.com/PaddlePaddle/Paddle">PaddlePaddle</a> البيئي. يهدف PaddleRec إلى تزويد المطورين بحل متكامل لبناء نظام توصية بطريقة سهلة وسريعة.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_35f7526ea7.png" alt="5.png" class="doc-image" id="5.png" />
   </span> <span class="img-wrapper"> <span>5.png</span> </span></p>
<p>كما ذُكر في الفقرة الافتتاحية، غالبًا ما يواجه المهندسون الذين يطورون أنظمة التوصية تحديات ضعف قابلية الاستخدام والنشر المعقد للنظام. ومع ذلك، يمكن أن يساعد PaddleRec المطورين في الجوانب التالية:</p>
<ul>
<li><p>سهولة الاستخدام: PaddleRec عبارة عن مكتبة مفتوحة المصدر تضم العديد من النماذج الشائعة في هذا المجال، بما في ذلك نماذج لتوليد المرشحين، والترتيب، وإعادة الترتيب، وتعدد المهام، وغير ذلك. باستخدام PaddleRec، يمكنك اختبار فعالية النموذج على الفور وتحسين كفاءته من خلال التكرار. يوفر لك PaddleRec طريقة سهلة لتدريب النماذج للأنظمة الموزعة بأداء ممتاز. وهو مُحسَّن لمعالجة البيانات على نطاق واسع للمتجهات المتفرقة. يمكنك بسهولة توسيع نطاق PaddleRec أفقيًا وتسريع سرعة الحوسبة الخاصة به. لذلك، يمكنك بناء بيئات تدريب سريعة على Kubernetes باستخدام PaddleRec.</p></li>
<li><p>دعم النشر: يوفر PaddleRec حلول نشر عبر الإنترنت لنماذجه. تكون النماذج جاهزة للاستخدام على الفور بعد التدريب، وتتميز بالمرونة والتوافر العالي.</p></li>
</ul>
<h3 id="Milvus" class="common-anchor-header">ميلفوس</h3><p><a href="https://milvus.io/docs/v2.0.x/overview.md">Milvus</a> هي قاعدة بيانات متجهة تتميز ببنية سحابية أصلية. وهي مفتوحة المصدر على <a href="https://github.com/milvus-io">GitHub</a> ويمكن استخدامها لتخزين وفهرسة وإدارة متجهات التضمين الضخمة التي تم إنشاؤها بواسطة الشبكات العصبية العميقة ونماذج التعلم الآلي الأخرى. يغلف Milvus العديد من مكتبات البحث عن الجار الأقرب التقريبي (ANN) من الدرجة الأولى بما في ذلك Faiss و NMSLIB و Annoy. يمكنك أيضًا توسيع نطاق Milvus وفقًا لحاجتك. خدمة Milvus متوفرة بشكل كبير وتدعم المعالجة المجمعة والموحدة للدفعات والتدفق. تلتزم Milvus بتبسيط عملية إدارة البيانات غير المنظمة وتوفير تجربة مستخدم متسقة في بيئات النشر المختلفة. يحتوي على الميزات التالية:</p>
<ul>
<li><p>أداء عالٍ عند إجراء بحث متجه على مجموعات بيانات ضخمة.</p></li>
<li><p>مجتمع مطور أولاً يقدم دعمًا متعدد اللغات وسلسلة أدوات متعددة اللغات.</p></li>
<li><p>قابلية توسع سحابي وموثوقية عالية حتى في حالة حدوث عطل.</p></li>
<li><p>بحث هجين يتحقق من خلال إقران التصفية القياسية مع البحث عن التشابه المتجه.</p></li>
</ul>
<p>يُستخدم برنامج Milvus للبحث عن التشابه المتجه وإدارة المتجهات في هذا المشروع لأنه قادر على حل مشكلة التحديثات المتكررة للبيانات مع الحفاظ على استقرار النظام.</p>
<h2 id="System-implementation" class="common-anchor-header">تنفيذ النظام<button data-href="#System-implementation" class="anchor-icon" translate="no">
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
    </button></h2><p>لبناء نظام التوصية بالمنتج في هذا المشروع، عليك اتباع الخطوات التالية:</p>
<ol>
<li>معالجة البيانات</li>
<li>تدريب النموذج</li>
<li>اختبار النموذج</li>
<li>توليد العناصر المرشحة للمنتجات<ol>
<li>تخزين البيانات: يتم الحصول على متجهات العناصر من خلال النموذج المدرّب ويتم تخزينها في ميلفوس.</li>
<li>البحث عن البيانات: يتم تغذية متجهات المستخدم الأربعة التي تم إنشاؤها بواسطة MIND في Milvus للبحث عن تشابه المتجهات.</li>
<li>ترتيب البيانات: كل متجه من المتجهات الأربعة له متجهات العناصر المتشابهة <code translate="no">top_k</code> الخاصة به، ويتم ترتيب أربع مجموعات من المتجهات <code translate="no">top_k</code> لإرجاع قائمة نهائية من <code translate="no">top_k</code> المتجهات الأكثر تشابهًا.</li>
</ol></li>
</ol>
<p>تتم استضافة الكود المصدري لهذا المشروع على منصة <a href="https://aistudio.baidu.com/aistudio/projectdetail/2250360?contributionType=1&amp;shared=1">Baidu AI Studio</a>. القسم التالي هو شرح مفصل للشفرة المصدرية لهذا المشروع.</p>
<h3 id="Step-1-Data-processing" class="common-anchor-header">الخطوة 1. معالجة البيانات</h3><p>تأتي مجموعة البيانات الأصلية من مجموعة بيانات كتب أمازون المقدمة من <a href="https://github.com/THUDM/ComiRec">ComiRec</a>. ومع ذلك، يستخدم هذا المشروع البيانات التي يتم تنزيلها من PaddleRec ومعالجتها بواسطة PaddleRec. راجع <a href="https://github.com/PaddlePaddle/PaddleRec/tree/release/2.1.0/datasets/AmazonBook">مجموعة بيانات AmazonBook</a> في مشروع PaddleRec لمزيد من المعلومات.</p>
<p>من المتوقع أن تظهر مجموعة البيانات الخاصة بالتدريب بالصيغة التالية، حيث يمثل كل عمود</p>
<ul>
<li><code translate="no">Uid</code>: معرّف المستخدم.</li>
<li><code translate="no">item_id</code>: معرّف عنصر المنتج الذي تم النقر عليه من قبل المستخدم.</li>
<li><code translate="no">Time</code>: الطابع الزمني أو ترتيب النقر.</li>
</ul>
<p>من المتوقع أن تظهر مجموعة البيانات الخاصة بالاختبار بالصيغة التالية، حيث يمثل كل عمود</p>
<ul>
<li><p><code translate="no">Uid</code>: معرّف المستخدم.</p></li>
<li><p><code translate="no">hist_item</code>: معرف عنصر المنتج في سلوك نقر المستخدم التاريخي. عندما يكون هناك عدة <code translate="no">hist_item</code> ، يتم فرزها وفقًا للطابع الزمني.</p></li>
<li><p><code translate="no">eval_item</code>: التسلسل الفعلي الذي ينقر فيه المستخدم على المنتجات.</p></li>
</ul>
<h3 id="Step-2-Model-training" class="common-anchor-header">الخطوة 2. تدريب النموذج</h3><p>يستخدم تدريب النموذج البيانات المعالجة في الخطوة السابقة ويعتمد نموذج التوليد المرشح، MIND، المبني على PaddleRec.</p>
<h4 id="1-Model-input" class="common-anchor-header">1. <strong>مدخلات</strong> <strong>النموذج</strong> </h4><p>في <code translate="no">dygraph_model.py</code> ، قم بتشغيل التعليمات البرمجية التالية لمعالجة البيانات وتحويلها إلى مدخلات النموذج. تفرز هذه العملية العناصر التي نقر عليها المستخدم نفسه في البيانات الأصلية وفقًا للطابع الزمني، وتجمعها لتكوين تسلسل. بعد ذلك، اختر عشوائيًا <code translate="no">item``_``id</code> من التسلسل كـ <code translate="no">target_item</code> ، واستخرج العناصر العشرة قبل <code translate="no">target_item</code> كـ <code translate="no">hist_item</code> لمدخلات النموذج. إذا لم يكن التسلسل طويلًا بما فيه الكفاية، يمكن تعيينه على أنه 0. <code translate="no">seq_len</code> يجب أن يكون الطول الفعلي للتسلسل <code translate="no">hist_item</code>.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">create_feeds_train</span>(<span class="hljs-params">self, batch_data</span>):
    hist_item = paddle.to_tensor(batch_data[<span class="hljs-number">0</span>], dtype=<span class="hljs-string">&quot;int64&quot;</span>)
    target_item = paddle.to_tensor(batch_data[<span class="hljs-number">1</span>], dtype=<span class="hljs-string">&quot;int64&quot;</span>)
    seq_len = paddle.to_tensor(batch_data[<span class="hljs-number">2</span>], dtype=<span class="hljs-string">&quot;int64&quot;</span>)
    <span class="hljs-keyword">return</span> [hist_item, target_item, seq_len]
<button class="copy-code-btn"></button></code></pre>
<p>ارجع إلى البرنامج النصي <code translate="no">/home/aistudio/recommend/model/mind/mind_reader.py</code> للحصول على رمز قراءة مجموعة البيانات الأصلية.</p>
<h4 id="2-Model-networking" class="common-anchor-header">2. <strong>نموذج الربط الشبكي</strong></h4><p>الكود التالي هو مقتطف من <code translate="no">net.py</code>. <code translate="no">class Mind_Capsual_Layer</code> يحدد طبقة مستخرج الاهتمامات المتعددة المبنية على آلية توجيه كبسولة الاهتمامات. تقوم الدالة <code translate="no">label_aware_attention()</code> بتنفيذ تقنية الانتباه المدرك للتسمية في خوارزمية MIND. تقوم الدالة <code translate="no">forward()</code> في <code translate="no">class MindLayer</code> بنمذجة خصائص المستخدم وتوليد متجهات الوزن المقابلة.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">class</span> <span class="hljs-title class_">Mind_Capsual_Layer</span>(nn.Layer):
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self</span>):
        <span class="hljs-built_in">super</span>(Mind_Capsual_Layer, <span class="hljs-variable language_">self</span>).__init__()
        <span class="hljs-variable language_">self</span>.iters = iters
        <span class="hljs-variable language_">self</span>.input_units = input_units
        <span class="hljs-variable language_">self</span>.output_units = output_units
        <span class="hljs-variable language_">self</span>.maxlen = maxlen
        <span class="hljs-variable language_">self</span>.init_std = init_std
        <span class="hljs-variable language_">self</span>.k_max = k_max
        <span class="hljs-variable language_">self</span>.batch_size = batch_size
        <span class="hljs-comment"># B2I routing</span>
        <span class="hljs-variable language_">self</span>.routing_logits = <span class="hljs-variable language_">self</span>.create_parameter(
            shape=[<span class="hljs-number">1</span>, <span class="hljs-variable language_">self</span>.k_max, <span class="hljs-variable language_">self</span>.maxlen],
            attr=paddle.ParamAttr(
                name=<span class="hljs-string">&quot;routing_logits&quot;</span>, trainable=<span class="hljs-literal">False</span>),
            default_initializer=nn.initializer.Normal(
                mean=<span class="hljs-number">0.0</span>, std=<span class="hljs-variable language_">self</span>.init_std))
        <span class="hljs-comment"># bilinear mapping</span>
        <span class="hljs-variable language_">self</span>.bilinear_mapping_matrix = <span class="hljs-variable language_">self</span>.create_parameter(
            shape=[<span class="hljs-variable language_">self</span>.input_units, <span class="hljs-variable language_">self</span>.output_units],
            attr=paddle.ParamAttr(
                name=<span class="hljs-string">&quot;bilinear_mapping_matrix&quot;</span>, trainable=<span class="hljs-literal">True</span>),
            default_initializer=nn.initializer.Normal(
                mean=<span class="hljs-number">0.0</span>, std=<span class="hljs-variable language_">self</span>.init_std))
                
<span class="hljs-keyword">class</span> <span class="hljs-title class_">MindLayer</span>(nn.Layer):

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">label_aware_attention</span>(<span class="hljs-params">self, keys, query</span>):
        weight = paddle.<span class="hljs-built_in">sum</span>(keys * query, axis=-<span class="hljs-number">1</span>, keepdim=<span class="hljs-literal">True</span>)
        weight = paddle.<span class="hljs-built_in">pow</span>(weight, <span class="hljs-variable language_">self</span>.pow_p)  <span class="hljs-comment"># [x,k_max,1]</span>
        weight = F.softmax(weight, axis=<span class="hljs-number">1</span>)
        output = paddle.<span class="hljs-built_in">sum</span>(keys * weight, axis=<span class="hljs-number">1</span>)
        <span class="hljs-keyword">return</span> output, weight

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">forward</span>(<span class="hljs-params">self, hist_item, seqlen, labels=<span class="hljs-literal">None</span></span>):
        hit_item_emb = <span class="hljs-variable language_">self</span>.item_emb(hist_item)  <span class="hljs-comment"># [B, seqlen, embed_dim]</span>
        user_cap, cap_weights, cap_mask = <span class="hljs-variable language_">self</span>.capsual_layer(hit_item_emb, seqlen)
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> <span class="hljs-variable language_">self</span>.training:
            <span class="hljs-keyword">return</span> user_cap, cap_weights
        target_emb = <span class="hljs-variable language_">self</span>.item_emb(labels)
        user_emb, W = <span class="hljs-variable language_">self</span>.label_aware_attention(user_cap, target_emb)

        <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.sampled_softmax(
            user_emb, labels, <span class="hljs-variable language_">self</span>.item_emb.weight,
            <span class="hljs-variable language_">self</span>.embedding_bias), W, user_cap, cap_weights, cap_mask
<button class="copy-code-btn"></button></code></pre>
<p>ارجع إلى البرنامج النصي <code translate="no">/home/aistudio/recommend/model/mind/net.py</code> للاطلاع على بنية الشبكة المحددة لـ MIND.</p>
<h4 id="3-Model-optimization" class="common-anchor-header">3. <strong>تحسين النموذج</strong></h4><p>يستخدم هذا المشروع <a href="https://arxiv.org/pdf/1412.6980">خوارزمية آدم</a> كمحسِّن للنموذج.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">create_optimizer</span>(<span class="hljs-params">self, dy_model, config</span>):
    lr = config.get(<span class="hljs-string">&quot;hyper_parameters.optimizer.learning_rate&quot;</span>, <span class="hljs-number">0.001</span>)
    optimizer = paddle.optimizer.Adam(
        learning_rate=lr, parameters=dy_model.parameters())
    <span class="hljs-keyword">return</span> optimizer
<button class="copy-code-btn"></button></code></pre>
<p>بالإضافة إلى ذلك، يكتب PaddleRec المعلمات الفائقة في <code translate="no">config.yaml</code> ، لذلك تحتاج فقط إلى تعديل هذا الملف لرؤية مقارنة واضحة بين فعالية النموذجين لتحسين كفاءة النموذج. عند تدريب النموذج، يمكن أن ينتج التأثير الضعيف للنموذج عن عدم ملاءمة النموذج أو الإفراط في ملاءمته. لذلك يمكنك تحسينه عن طريق تعديل عدد جولات التدريب. في هذا المشروع، ما عليك سوى تغيير عدد جولات التدريب في <code translate="no">config.yaml</code> للعثور على العدد المثالي لجولات التدريب. بالإضافة إلى ذلك، يمكنك أيضًا تغيير مُحسِّن النموذج، <code translate="no">optimizer.class</code> ، أو <code translate="no">learning_rate</code> لتصحيح الأخطاء. يوضح ما يلي جزءًا من المعلمات في <code translate="no">config.yaml</code>.</p>
<pre><code translate="no" class="language-YAML">runner:
  use_gpu: <span class="hljs-literal">True</span>
  use_auc: <span class="hljs-literal">False</span>
  train_batch_size: <span class="hljs-number">128</span>
  epochs: <span class="hljs-number">20</span>
  print_interval: <span class="hljs-number">10</span>
  model_save_path: <span class="hljs-string">&quot;output_model_mind&quot;</span>

<span class="hljs-comment"># hyper parameters of user-defined network</span>
hyper_parameters:
  <span class="hljs-comment"># optimizer config</span>
  optimizer:
    <span class="hljs-keyword">class</span>: Adam
    learning_rate: <span class="hljs-number">0.005</span>
<button class="copy-code-btn"></button></code></pre>
<p>ارجع إلى البرنامج النصي <code translate="no">/home/aistudio/recommend/model/mind/dygraph_model.py</code> للحصول على التنفيذ المفصل.</p>
<h4 id="4-Model-training" class="common-anchor-header">4. <strong>تدريب النموذج</strong></h4><p>قم بتشغيل الأمر التالي لبدء تدريب النموذج.</p>
<pre><code translate="no" class="language-Bash">python -u trainer.py -m mind/config.yaml
<button class="copy-code-btn"></button></code></pre>
<p>ارجع إلى <code translate="no">/home/aistudio/recommend/model/trainer.py</code> لمشروع تدريب النموذج.</p>
<h3 id="Step-3-Model-testing" class="common-anchor-header">الخطوة 3. اختبار النموذج</h3><p>تستخدم هذه الخطوة مجموعة بيانات الاختبار للتحقق من الأداء، مثل معدل استرجاع النموذج المدرّب.</p>
<p>أثناء اختبار النموذج، يتم تحميل جميع متجهات العناصر من النموذج، ثم يتم استيرادها إلى قاعدة بيانات المتجهات مفتوحة المصدر Milvus. اقرأ مجموعة بيانات الاختبار من خلال البرنامج النصي <code translate="no">/home/aistudio/recommend/model/mind/mind_infer_reader.py</code>. تحميل النموذج في الخطوة السابقة، وتغذية مجموعة بيانات الاختبار في النموذج للحصول على أربعة متجهات اهتمام للمستخدم. ابحث عن متجهات العناصر الخمسين الأكثر تشابهًا مع متجهات الاهتمامات الأربعة في ميلفوس. يمكنك التوصية بالنتائج التي تم إرجاعها للمستخدمين.</p>
<p>قم بتشغيل الأمر التالي لاختبار النموذج.</p>
<pre><code translate="no" class="language-Bash">python -u infer.py -m mind/config.yaml -top_n 50
<button class="copy-code-btn"></button></code></pre>
<p>أثناء اختبار النموذج، يوفر النظام عدة مؤشرات لتقييم فعالية النموذج، مثل Recall@50، وNDCG@50، وHetRate@50. تقدم هذه المقالة تعديل معلمة واحدة فقط. ومع ذلك، في سيناريو التطبيق الخاص بك، تحتاج إلى تدريب المزيد من الحقب الزمنية للحصول على تأثير أفضل للنموذج.  يمكنك أيضًا تحسين فعالية النموذج باستخدام محسنات مختلفة، وتعيين معدلات تعلم مختلفة، وزيادة عدد جولات الاختبار. يوصى بحفظ عدة نماذج بتأثيرات مختلفة، ثم اختيار النموذج الذي يتمتع بأفضل أداء ويناسب تطبيقك بشكل أفضل.</p>
<h3 id="Step-4-Generating-product-item-candidates" class="common-anchor-header">الخطوة 4. توليد عناصر المنتج المرشحة</h3><p>لإنشاء خدمة توليد العناصر المرشحة للمنتج، يستخدم هذا المشروع النموذج المدرّب في الخطوات السابقة، مقترنًا بخدمة Milvus. أثناء توليد المرشحين، يتم استخدام FASTAPI لتوفير الواجهة. عند بدء تشغيل الخدمة، يمكنك تشغيل الأوامر مباشرة في المحطة الطرفية عبر <code translate="no">curl</code>.</p>
<p>قم بتشغيل الأمر التالي لتوليد مرشحين أوليين.</p>
<pre><code translate="no" class="language-Bash">uvicorn main:app
<button class="copy-code-btn"></button></code></pre>
<p>توفر الخدمة أربعة أنواع من الواجهات:</p>
<ul>
<li><strong>إدراج</strong>: قم بتشغيل الأمر التالي لقراءة ناقلات العناصر من النموذج الخاص بك وإدراجها في مجموعة في ميلفوس.</li>
</ul>
<pre><code translate="no" class="language-Nginx">curl -X <span class="hljs-string">&#x27;POST&#x27;</span> \
  <span class="hljs-string">&#x27;http://127.0.0.1:8000/rec/insert_data&#x27;</span> \
  -H <span class="hljs-string">&#x27;accept: application/json&#x27;</span> \
  -d <span class="hljs-string">&#x27;&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>توليد مرشحين أوليين</strong>: أدخل التسلسل الذي ينقر فيه المستخدم على المنتجات، واكتشف المنتج التالي الذي قد ينقر عليه المستخدم. يمكنك أيضًا توليد العناصر المرشحة للمنتجات على دفعات لعدة مستخدمين دفعة واحدة. <code translate="no">hist_item</code> في الأمر التالي هو متجه ثنائي الأبعاد، ويمثل كل صف تسلسل المنتجات التي نقر عليها المستخدم في الماضي. يمكنك تحديد طول التسلسل. النتائج التي تم إرجاعها هي أيضًا مجموعات من المتجهات ثنائية الأبعاد، ويمثل كل صف منها <code translate="no">item id</code>s التي تم إرجاعها للمستخدمين.</li>
</ul>
<pre><code translate="no" class="language-Ada">curl -X <span class="hljs-string">&#x27;POST&#x27;</span> \
  <span class="hljs-string">&#x27;http://127.0.0.1:8000/rec/recall&#x27;</span> \
  -H <span class="hljs-string">&#x27;accept: application/json&#x27;</span> \
  -H <span class="hljs-string">&#x27;Content-Type: application/json&#x27;</span> \
  -d <span class="hljs-string">&#x27;{
  &quot;top_k&quot;: 50,
  &quot;hist_item&quot;: [[43,23,65,675,3456,8654,123454,54367,234561],[675,3456,8654,123454,76543,1234,9769,5670,65443,123098,34219,234098]]
}&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>الاستعلام عن العدد الإجمالي</strong> <strong>لعناصر المنتج</strong>: قم بتشغيل الأمر التالي لإرجاع العدد الإجمالي لمتجهات العناصر المخزنة في قاعدة بيانات ميلفوس.</li>
</ul>
<pre><code translate="no" class="language-Nginx">curl -X <span class="hljs-string">&#x27;POST&#x27;</span> \
  <span class="hljs-string">&#x27;http://127.0.0.1:8000/rec/count&#x27;</span> \
  -H <span class="hljs-string">&#x27;accept: application/json&#x27;</span> \
  -d <span class="hljs-string">&#x27;&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>حذف</strong>: قم بتشغيل الأمر التالي لحذف جميع البيانات المخزنة في قاعدة بيانات ملفوس .</li>
</ul>
<pre><code translate="no" class="language-Nginx">curl -X <span class="hljs-string">&#x27;POST&#x27;</span> \
  <span class="hljs-string">&#x27;http://127.0.0.1:8000/qa/drop&#x27;</span> \
  -H <span class="hljs-string">&#x27;accept: application/json&#x27;</span> \
  -d <span class="hljs-string">&#x27;&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>إذا قمت بتشغيل خدمة إنشاء المرشح على خادمك المحلي، يمكنك أيضًا الوصول إلى الواجهات المذكورة أعلاه على <code translate="no">127.0.0.1:8000/docs</code>. يمكنك التلاعب بالنقر على الواجهات الأربع وإدخال قيمة المعلمات. ثم انقر فوق "جربها" للحصول على نتيجة التوصية.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_43e41086f8.png" alt="6.png" class="doc-image" id="6.png" />
   </span> <span class="img-wrapper"> <span>6.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_f016a3221d.png" alt="7.png" class="doc-image" id="7.png" />
   </span> <span class="img-wrapper"> <span>7.png</span> </span></p>
<h2 id="Recap" class="common-anchor-header">الخلاصة<button data-href="#Recap" class="anchor-icon" translate="no">
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
    </button></h2><p>تركز هذه المقالة بشكل أساسي على المرحلة الأولى من توليد المرشحين في بناء نظام التوصية. كما أنها توفر حلاً لتسريع هذه العملية من خلال الجمع بين Milvus وخوارزمية MIND و PaddleRec، وبالتالي فقد عالجت المشكلة المقترحة في الفقرة الافتتاحية.</p>
<p>ماذا لو كان النظام بطيئًا للغاية عند إرجاع النتائج بسبب الكم الهائل من مجموعات البيانات؟ تم تصميم Milvus، قاعدة بيانات المتجهات مفتوحة المصدر، للبحث عن التشابه بسرعة فائقة على مجموعات بيانات متجهات كثيفة تحتوي على ملايين أو مليارات أو حتى تريليونات من المتجهات.</p>
<p>ماذا لو تعذّرت معالجة البيانات المدرجة حديثًا في الوقت الفعلي للبحث أو الاستعلام؟ يمكنك استخدام برنامج Milvus لأنه يدعم المعالجة المجمّعة والدفق الموحّد ويمكّنك من البحث والاستعلام عن البيانات المدرجة حديثًا في الوقت الفعلي. كما أن نموذج MIND قادر على تحويل سلوك المستخدم الجديد في الوقت الفعلي وإدراج ناقلات المستخدم في Milvus بشكل فوري.</p>
<p>ماذا لو كان النشر المعقد مخيفًا للغاية؟ يمكن لمكتبة PaddleRec، وهي مكتبة قوية تنتمي إلى نظام PaddlePaddle، أن توفر لك حلاً متكاملاً لنشر نظام التوصيات الخاص بك أو التطبيقات الأخرى بطريقة سهلة وسريعة.</p>
<h2 id="About-the-author" class="common-anchor-header">نبذة عن المؤلف<button data-href="#About-the-author" class="anchor-icon" translate="no">
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
    </button></h2><p>يونمي لي، مهندسة بيانات لدى Zilliz، تخرجت من جامعة هواتشونغ للعلوم والتكنولوجيا وحصلت على شهادة في علوم الكمبيوتر. منذ انضمامها إلى Zilliz، تعمل على استكشاف حلول لمشروع Milvus مفتوح المصدر ومساعدة المستخدمين على تطبيق Milvus في سيناريوهات العالم الحقيقي. ينصب تركيزها الرئيسي على البرمجة اللغوية العصبية وأنظمة التوصيات، وترغب في تعميق تركيزها في هذين المجالين. تحب قضاء الوقت بمفردها والقراءة.</p>
<h2 id="Looking-for-more-resources" class="common-anchor-header">هل تبحث عن المزيد من الموارد؟<button data-href="#Looking-for-more-resources" class="anchor-icon" translate="no">
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
<li>المزيد من حالات المستخدم لبناء نظام التوصية:<ul>
<li><a href="https://milvus.io/blog/building-a-personalized-product-recommender-system-with-vipshop-and-milvus.md">بناء نظام توصية بمنتج مخصص مع فيب شوب مع ميلفوس</a></li>
<li><a href="https://milvus.io/blog/building-a-wardrobe-and-outfit-planning-app-with-milvus.md">بناء تطبيق لتخطيط خزانة الملابس والأزياء مع ميلفوس</a></li>
<li><a href="https://milvus.io/blog/building-an-intelligent-news-recommendation-system-inside-sohu-news-app.md">بناء نظام ذكي للتوصية بالأخبار داخل تطبيق Sohu News</a></li>
<li><a href="https://milvus.io/blog/music-recommender-system-item-based-collaborative-filtering-milvus.md">التصفية التعاونية القائمة على العناصر لنظام التوصية بالموسيقى</a></li>
<li><a href="https://milvus.io/blog/Making-with-Milvus-AI-Powered-News-Recommendation-Inside-Xiaomi-Mobile-Browser.md">صنع مع ميلفوس: التوصية بالأخبار المدعومة بالذكاء الاصطناعي داخل متصفح الهاتف المحمول الخاص بشاومي</a></li>
</ul></li>
<li>المزيد من مشاريع "ميلفوس" بالتعاون مع مجتمعات أخرى<ul>
<li><a href="https://milvus.io/blog/2021-09-26-onnx.md">الجمع بين نماذج الذكاء الاصطناعي للبحث عن الصور باستخدام ONNX و Milvus</a></li>
<li><a href="https://milvus.io/blog/graph-based-recommendation-system-with-milvus.md">بناء نظام توصية قائم على الرسم البياني باستخدام مجموعات بيانات Milvus و PinSage و DGL و Movielens</a></li>
<li><a href="https://milvus.io/blog/building-a-milvus-cluster-based-on-juicefs.md">بناء مجموعة بيانات Milvus القائمة على JuiceFS</a></li>
</ul></li>
<li>تفاعل مع مجتمعنا مفتوح المصدر<ul>
<li>ابحث أو ساهم في Milvus على <a href="https://bit.ly/307b7jC">GitHub</a></li>
<li>تفاعل مع المجتمع عبر <a href="https://bit.ly/3qiyTEk">المنتدى</a></li>
<li>تواصل معنا على <a href="https://bit.ly/3ob7kd8">تويتر</a></li>
</ul></li>
</ul>
