---
id: getting-started-with-hnswlib.md
title: بدء استخدام HNSWlib
author: Haziqa Sajid
date: 2024-11-25T00:00:00.000Z
desc: >-
  مكتبة HNSWlib، وهي مكتبة تطبق HNSW، ذات كفاءة عالية وقابلة للتطوير، وتعمل بشكل
  جيد حتى مع ملايين النقاط. تعلم كيفية تنفيذها في دقائق.
metaTitle: Getting Started with HNSWlib
cover: assets.zilliz.com/Getting_Started_with_HNS_Wlib_30922def3e.png
tag: Engineering
tags: >-
  HNSWlib, HNSW Hierarchical Navigable Small Worlds, Vector Search, Approximate
  Nearest Neighbor (ANN) search, ANNS
recommend: true
canonicalUrl: 'https://milvus.io/blog/getting-started-with-hnswlib.md'
---
<p>يسمح<a href="https://zilliz.com/glossary/semantic-search">البحث الدلالي</a> للآلات بفهم اللغة وتحقيق نتائج بحث أفضل، وهو أمر ضروري في الذكاء الاصطناعي وتحليلات البيانات. بمجرد تمثيل اللغة على شكل <a href="https://zilliz.com/learn/everything-you-should-know-about-vector-embeddings">تضمينات،</a> يمكن إجراء البحث باستخدام طرق دقيقة أو تقريبية. البحث التقريبي لأقرب جار تقريبي<a href="https://zilliz.com/glossary/anns">(ANN</a>) هو طريقة تُستخدم للعثور بسرعة على النقاط في مجموعة البيانات الأقرب إلى نقطة استعلام معينة، على عكس <a href="https://zilliz.com/blog/k-nearest-neighbor-algorithm-for-machine-learning">البحث الدقيق لأقرب جار،</a> والذي يمكن أن يكون مكلفًا حسابيًا للبيانات عالية الأبعاد. تسمح ANN باسترجاع أسرع من خلال توفير نتائج قريبة تقريبًا من أقرب الجيران.</p>
<p>إحدى خوارزميات البحث عن الجار الأقرب التقريبي (ANN) هي <a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">HNSW</a> (العوالم الصغيرة القابلة للتنقل الهرمي)، التي يتم تنفيذها ضمن <a href="https://zilliz.com/learn/learn-hnswlib-graph-based-library-for-fast-anns">HNSWlib،</a> والتي ستكون محور مناقشة اليوم. في هذه المدونة، سنقوم بـ</p>
<ul>
<li><p>فهم خوارزمية HNSW.</p></li>
<li><p>استكشاف HNSWlib وميزاته الرئيسية.</p></li>
<li><p>إعداد HNSWlib، مع تغطية بناء الفهرس وتنفيذ البحث.</p></li>
<li><p>مقارنته مع ميلفوس.</p></li>
</ul>
<h2 id="Understanding-HNSW" class="common-anchor-header">فهم HNSW<button data-href="#Understanding-HNSW" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>العوالم الصغيرة القابلة للتنقل الهرمية القابلة للتنقل (</strong><a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW"><strong>HNSW</strong></a><strong>)</strong> هي بنية بيانات قائمة على الرسم البياني تسمح بإجراء عمليات بحث فعالة عن التشابه، خاصةً في المساحات عالية الأبعاد، من خلال بناء رسم بياني متعدد الطبقات لشبكات "العوالم الصغيرة". يعالج HNSW، الذي تم تقديمه في <a href="https://arxiv.org/abs/1603.09320">عام</a> 2016، مشكلات قابلية التوسع المرتبطة بأساليب البحث التقليدية مثل عمليات البحث القائمة على القوة الغاشمة والبحث القائم على الأشجار. وهو مثالي للتطبيقات التي تتضمن مجموعات بيانات كبيرة، مثل أنظمة التوصيات والتعرف على الصور <a href="https://zilliz.com/vector-database-use-cases/llm-retrieval-augmented-generation">وتوليد الاسترجاع المعزز (RAG)</a>.</p>
<h3 id="Why-HNSW-Matters" class="common-anchor-header">سبب أهمية HNSW</h3><p>يعمل HNSW على تحسين أداء البحث الأقرب من الجوار في المساحات عالية الأبعاد بشكل كبير. فالجمع بين البنية الهرمية وقابلية التنقل في العالم الصغير يتجنب عدم الكفاءة الحسابية للطرق القديمة، مما يمكّنها من الأداء الجيد حتى مع مجموعات البيانات الضخمة والمعقدة. لفهم ذلك بشكل أفضل، دعونا نلقي نظرة على كيفية عملها الآن.</p>
<h3 id="How-HNSW-Works" class="common-anchor-header">كيف يعمل HNSW</h3><ol>
<li><p><strong>الطبقات الهرمية:</strong> ينظّم HNSW البيانات في تسلسل هرمي من الطبقات، حيث تحتوي كل طبقة على عقد متصلة بحواف. تكون الطبقات العليا متناثرة، مما يسمح "بتخطي" واسع عبر الرسم البياني، مثل تصغير الخريطة لرؤية الطرق السريعة الرئيسية فقط بين المدن. تزداد كثافة الطبقات السفلى كثافة، مما يوفر تفاصيل أدق والمزيد من الروابط بين الجيران الأقرب.</p></li>
<li><p><strong>مفهوم العوالم الصغيرة القابلة للملاحة:</strong> تعتمد كل طبقة في HNSW على مفهوم شبكة "العوالم الصغيرة"، حيث تكون العقد (نقاط البيانات) على بعد بضع "قفزات" فقط من بعضها البعض. وتبدأ خوارزمية البحث من أعلى طبقة متناثرة وتعمل باتجاه الأسفل، وتنتقل إلى طبقات أكثر كثافة بشكل تدريجي لتحسين البحث. ويشبه هذا النهج الانتقال من رؤية شاملة نزولاً إلى التفاصيل على مستوى الجوار، مما يؤدي إلى تضييق منطقة البحث تدريجياً.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Fig_1_An_Example_of_a_Navigable_Small_World_Graph_afa737ee9f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://daniel-at-world.blogspot.com/2019/04/navigable-small-world-graphs-for.html">الشكل 1</a>: مثال على الرسم البياني للعالم الصغير القابل للتنقل</p>
<ol start="3">
<li><strong>الهيكل الشبيه بقائمة التخطي:</strong> يشبه الجانب الهرمي من HNSW قائمة التخطي، وهي بنية بيانات احتمالية حيث تحتوي الطبقات العليا على عدد أقل من العقد، مما يسمح بإجراء عمليات بحث أولية أسرع.</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Fig_2_An_Example_of_Skip_List_Structure_f41b07234d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://www.cs.cmu.edu/~ckingsf/bioinfo-lectures/skiplists.pdf">تين 2</a>: مثال على بنية قائمة التخطي</p>
<p>للبحث عن 96 في قائمة التخطي المحددة، نبدأ من المستوى الأعلى في أقصى اليسار عند عقدة الرأس. بالانتقال إلى اليمين، نواجه 31، أي أقل من 96، لذا نواصل إلى العقدة التالية. والآن، نحتاج إلى الانتقال إلى أسفل مستوى حيث نرى 31 مرة أخرى؛ وبما أنه لا يزال أقل من 96، فإننا ننزل مستوى آخر. نجد 31 مرة أخرى، ثم نتحرك إلى اليمين ونصل إلى 96، وهي القيمة المستهدفة. وهكذا، نحدد موقع 96 دون الحاجة إلى النزول إلى أدنى مستويات قائمة التخطي.</p>
<ol start="4">
<li><p><strong>كفاءة البحث:</strong> تبدأ خوارزمية HNSW من عقدة دخول في أعلى طبقة، وتتقدم إلى الجيران الأقرب مع كل خطوة. وهي تنزل عبر الطبقات، مستخدمةً كل واحدة منها للاستكشاف الخشن إلى الدقيق، حتى تصل إلى أدنى طبقة حيث من المحتمل أن تكون العقد الأكثر تشابهًا. يقلل هذا التنقل بين الطبقات من عدد العقد والحواف التي يجب استكشافها، مما يجعل البحث سريعًا ودقيقًا.</p></li>
<li><p><strong>الإدراج والصيانة</strong>: عند إضافة عقدة جديدة، تحدد الخوارزمية طبقة دخولها بناءً على الاحتمالية وتربطها بالعقد القريبة باستخدام إرشادات اختيار الجار. تهدف هذه الاستدلالية إلى تحسين الاتصال، وإنشاء روابط تحسّن إمكانية التنقل مع تحقيق التوازن بين كثافة الرسم البياني. يحافظ هذا النهج على قوة البنية وقابليتها للتكيف مع نقاط البيانات الجديدة.</p></li>
</ol>
<p>في حين أن لدينا فهمًا أساسيًا لخوارزمية HNSW، إلا أن تطبيقها من الصفر قد يكون أمرًا صعبًا. لحسن الحظ، قام المجتمع بتطوير مكتبات مثل <a href="https://github.com/nmslib/hnswlib">HNSWlib</a> لتبسيط الاستخدام، مما يجعل الوصول إليها سهلًا دون أن تحك رأسك. لذا، دعونا نلقي نظرة فاحصة على HNSWlib.</p>
<h2 id="Overview-of-HNSWlib" class="common-anchor-header">نظرة عامة على HNSWlib<button data-href="#Overview-of-HNSWlib" class="anchor-icon" translate="no">
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
    </button></h2><p>HNSWlib، وهي مكتبة شائعة تطبق HNSWlib، وهي مكتبة عالية الكفاءة وقابلة للتطوير، وتعمل بشكل جيد حتى مع ملايين النقاط. وهي تحقق تعقيدًا زمنيًا دون الخطي من خلال السماح بالقفز السريع بين طبقات الرسم البياني وتحسين البحث عن البيانات الكثيفة عالية الأبعاد. فيما يلي الميزات الرئيسية لـ HNSWlib ما يلي:</p>
<ul>
<li><p><strong>بنية قائمة على الرسم البياني:</strong> رسم بياني متعدد الطبقات يمثل نقاط البيانات، مما يسمح بإجراء عمليات بحث سريعة وأقرب إلى الأقرب.</p></li>
<li><p><strong>كفاءة عالية الأبعاد:</strong> مُحسَّن للبيانات عالية الأبعاد، مما يوفر عمليات بحث تقريبية سريعة ودقيقة.</p></li>
<li><p><strong>وقت بحث شبه خطي:</strong> يحقق تعقيدًا شبه خطي من خلال تخطي الطبقات، مما يحسن السرعة بشكل كبير.</p></li>
<li><p><strong>تحديثات ديناميكية:</strong> يدعم إدراج العقد وحذفها في الوقت الفعلي دون الحاجة إلى إعادة بناء رسم بياني كامل.</p></li>
<li><p><strong>كفاءة الذاكرة:</strong> استخدام فعال للذاكرة، مناسب لمجموعات البيانات الكبيرة.</p></li>
<li><p><strong>قابلية التوسع:</strong> يتسع بشكل جيد لملايين نقاط البيانات، مما يجعله مثاليًا للتطبيقات متوسطة الحجم مثل أنظمة التوصيات.</p></li>
</ul>
<p><strong>ملاحظة:</strong> HNSWlib ممتاز لإنشاء نماذج أولية بسيطة لتطبيقات البحث المتجه. ومع ذلك، نظرًا لقيود قابلية التوسع، قد تكون هناك خيارات أفضل مثل <a href="https://zilliz.com/blog/what-is-a-real-vector-database">قواعد البيانات المتجهة المصممة لهذا الغرض</a> لسيناريوهات أكثر تعقيدًا تتضمن مئات الملايين أو حتى مليارات نقاط البيانات. دعونا نرى ذلك في العمل.</p>
<h2 id="Getting-Started-with-HNSWlib-A-Step-by-Step-Guide" class="common-anchor-header">البدء باستخدام HNSWlib: دليل خطوة بخطوة<button data-href="#Getting-Started-with-HNSWlib-A-Step-by-Step-Guide" class="anchor-icon" translate="no">
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
    </button></h2><p>سيوضح هذا القسم استخدام HNSWlib <a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">كمكتبة بحث متجه</a> من خلال إنشاء فهرس HNSW، وإدراج البيانات، وإجراء عمليات البحث. لنبدأ بالتثبيت:</p>
<h3 id="Setup-and-Imports" class="common-anchor-header">الإعداد والواردات</h3><p>لبدء استخدام HNSWlib في Python، قم أولاً بتثبيته باستخدام pip:</p>
<pre><code translate="no">pip install hnswlib
<button class="copy-code-btn"></button></code></pre>
<p>ثم، قم باستيراد المكتبات الضرورية:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> hnswlib 
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<button class="copy-code-btn"></button></code></pre>
<h3 id="Preparing-Data" class="common-anchor-header">إعداد البيانات</h3><p>في هذا المثال، سنستخدم في هذا المثال <code translate="no">NumPy</code>لإنشاء مجموعة بيانات عشوائية تحتوي على 10000 عنصر، كل منها بحجم بُعد 256.</p>
<pre><code translate="no">dim = <span class="hljs-number">256</span>  <span class="hljs-comment"># Dimensionality of your vectors</span>
num_elements = <span class="hljs-number">10000</span>  <span class="hljs-comment"># Number of elements to insert</span>
<button class="copy-code-btn"></button></code></pre>
<p>لننشئ البيانات:</p>
<pre><code translate="no">data = np.random.rand(num_elements, dim).astype(np.float32)  <span class="hljs-comment"># Example data</span>
<button class="copy-code-btn"></button></code></pre>
<p>الآن أصبحت بياناتنا جاهزة، دعنا ننشئ فهرسًا.</p>
<h3 id="Building-an-Index" class="common-anchor-header">بناء فهرس</h3><p>عند إنشاء فهرس، نحتاج إلى تحديد أبعاد المتجهات ونوع المساحة. لنقم بإنشاء فهرس:</p>
<pre><code translate="no">p = hnswlib.<span class="hljs-title class_">Index</span>(space=<span class="hljs-string">&#x27;l2&#x27;</span>, dim=dim)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">space='l2'</code>: تحدد هذه المعلمة مقياس المسافة المستخدم للتشابه. ضبطه على <code translate="no">'l2'</code> يعني استخدام المسافة الإقليدية (معيار L2). إذا قمت بتعيينه بدلاً من ذلك على <code translate="no">'ip'</code> ، فسيستخدم الضرب الداخلي، وهو أمر مفيد لمهام مثل تشابه جيب التمام.</li>
</ul>
<ul>
<li><code translate="no">dim=dim</code>: تحدد هذه المعلمة بُعدية نقاط البيانات التي ستعمل معها. يجب أن تتطابق مع بُعد البيانات التي تخطط لإضافتها إلى الفهرس.</li>
</ul>
<p>إليك كيفية تهيئة الفهرس:</p>
<pre><code translate="no">p.init_index(max_elements=num_elements, ef_construction=200, M=16)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">max_elements=num_elements</code>: يحدّد هذا الحد الأقصى لعدد العناصر التي يمكن إضافتها إلى الفهرس. <code translate="no">Num_elements</code> هو السعة القصوى، لذا قمنا بتعيين هذا على 10000 لأننا نعمل مع 10000 نقطة بيانات.</li>
</ul>
<ul>
<li><code translate="no">ef_construction=200</code>: تتحكم هذه المعلمة في مفاضلة الدقة مقابل سرعة البناء أثناء إنشاء الفهرس. تعمل القيمة الأعلى على تحسين الاستدعاء (الدقة) ولكنها تزيد من استخدام الذاكرة ووقت الإنشاء. تتراوح القيم الشائعة من 100 إلى 200.</li>
</ul>
<ul>
<li><code translate="no">M=16</code>: تحدد هذه المعلمة عدد الروابط ثنائية الاتجاه التي تم إنشاؤها لكل نقطة بيانات، مما يؤثر على الدقة وسرعة البحث. تتراوح القيم النموذجية بين 12 و48؛ وغالبًا ما تكون 16 قيمة جيدة لتحقيق توازن جيد بين الدقة والسرعة المعتدلة.</li>
</ul>
<pre><code translate="no">p.set_ef(<span class="hljs-number">50</span>)  <span class="hljs-comment"># This parameter controls the speed/accuracy trade-off</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">ef</code>: تحدد المعلمة <code translate="no">ef</code> ، وهي اختصار لـ "عامل الاستكشاف"، عدد الجيران الذين يتم فحصهم أثناء البحث. يؤدي ارتفاع قيمة <code translate="no">ef</code> إلى استكشاف عدد أكبر من الجيران، مما يزيد بشكل عام من دقة (استرجاع) البحث ولكنه يجعله أبطأ أيضًا. وعلى العكس، يمكن أن تؤدي القيمة الأقل <code translate="no">ef</code> إلى البحث بشكل أسرع ولكنها قد تقلل من الدقة.</li>
</ul>
<p>في هذه الحالة، يعني ضبط <code translate="no">ef</code> على 50 أن خوارزمية البحث ستقيّم ما يصل إلى 50 جارًا عند العثور على نقاط البيانات الأكثر تشابهًا.</p>
<p>ملاحظة: <code translate="no">ef_construction</code> يضبط جهد البحث عن الجيران أثناء إنشاء الفهرس، مما يعزز الدقة ولكنه يبطئ عملية الإنشاء. <code translate="no">ef</code> يتحكم في جهد البحث أثناء الاستعلام، ويوازن بين السرعة والاستدعاء ديناميكيًا لكل استعلام.</p>
<h3 id="Performing-Searches" class="common-anchor-header">إجراء عمليات البحث</h3><p>لإجراء بحث أقرب جار باستخدام HNSWlib، نقوم أولاً بإنشاء متجه استعلام عشوائي. في هذا المثال، تتطابق أبعاد المتجه مع البيانات المفهرسة.</p>
<pre><code translate="no">query_vector = np.random.rand(dim).astype(np.float32)  <span class="hljs-comment"># Example query</span>

labels, distances = p.knn_query(query_vector, k=<span class="hljs-number">5</span>)  <span class="hljs-comment"># k is the number of nearest neighbors</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">query_vector</code>: ينشئ هذا السطر متجهًا عشوائيًا بنفس أبعاد البيانات المفهرسة، مما يضمن التوافق مع أقرب بحث جار.</li>
<li><code translate="no">knn_query</code>: تبحث الطريقة عن <code translate="no">k</code> أقرب جيران <code translate="no">query_vector</code> داخل الفهرس <code translate="no">p</code>. تُرجع مصفوفتين: <code translate="no">labels</code> ، والتي تحتوي على مؤشرات أقرب الجيران، و <code translate="no">distances</code> ، والتي تشير إلى المسافات من متجه الاستعلام إلى كل من هؤلاء الجيران. هنا، <code translate="no">k=5</code> يحدد أننا نريد العثور على أقرب خمسة جيران.</li>
</ul>
<p>فيما يلي النتائج بعد طباعة التسميات والمسافات:</p>
<pre><code translate="no"><span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Nearest neighbors&#x27; labels:&quot;</span>, labels)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Distances:&quot;</span>, distances)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">&gt; Nearest neighbors&#x27; labels: [[4498 1751 5647 4483 2471]]
&gt; Distances: [[33.718    35.484592 35.627766 35.828312 35.91495 ]]
<button class="copy-code-btn"></button></code></pre>
<p>ها هو لدينا، دليل بسيط لبدء استخدام HNSWlib.</p>
<p>كما ذكرنا، HNSWlib هو محرك بحث متجه رائع للنماذج الأولية أو لتجربة مجموعات بيانات متوسطة الحجم. إذا كانت لديك متطلبات قابلية توسع أعلى أو كنت بحاجة إلى ميزات أخرى على مستوى المؤسسة، فقد تحتاج إلى اختيار قاعدة بيانات متجهة مصممة لهذا الغرض مثل قاعدة بيانات المتجهات مفتوحة المصدر <a href="https://zilliz.com/what-is-milvus">Milvus</a> أو خدمتها المدارة بالكامل على <a href="https://zilliz.com/cloud">Zilliz Cloud</a>. لذا، سنقارن في القسم التالي بين HNSWlib و Milvus.</p>
<h2 id="HNSWlib-vs-Purpose-Built-Vector-Databases-Like-Milvus" class="common-anchor-header">HNSWlib مقابل قواعد البيانات المتجهة المصممة لغرض معين مثل Milvus<button data-href="#HNSWlib-vs-Purpose-Built-Vector-Databases-Like-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>تقوم <a href="https://zilliz.com/learn/what-is-vector-database">قاعدة البيانات المتجهة</a> بتخزين البيانات كتمثيلات رياضية، مما يمكّن <a href="https://zilliz.com/ai-models">نماذج التعلم الآلي</a> من تشغيل البحث والتوصيات وتوليد النصوص من خلال تحديد البيانات من خلال <a href="https://zilliz.com/blog/similarity-metrics-for-vector-search">مقاييس التشابه</a> لفهم السياق.</p>
<p>تعمل مكتبات مؤشرات المتجهات مثل HNSWlib على تحسين<a href="https://zilliz.com/learn/vector-similarity-search">البحث عن المتجهات</a> واسترجاعها ولكنها تفتقر إلى ميزات الإدارة الخاصة بقاعدة البيانات الكاملة. من ناحية أخرى، تم تصميم قواعد بيانات المتجهات، مثل <a href="https://milvus.io/">Milvus،</a> للتعامل مع تضمينات المتجهات على نطاق واسع، مما يوفر مزايا في إدارة البيانات والفهرسة وقدرات الاستعلام التي تفتقر إليها المكتبات المستقلة عادةً. فيما يلي بعض الفوائد الأخرى لاستخدام Milvus:</p>
<ul>
<li><p><strong>بحث تشابه المتجهات عالي السرعة</strong>: يوفر Milvus أداء بحث على مستوى أجزاء من الثانية عبر مجموعات بيانات متجهات بمليار من البيانات، وهو مثالي لتطبيقات مثل استرجاع الصور وأنظمة التوصيات ومعالجة اللغات الطبيعية<a href="https://zilliz.com/learn/A-Beginner-Guide-to-Natural-Language-Processing">(NLP)</a> والتوليد المعزز للاسترجاع<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">(RAG</a>).</p></li>
<li><p><strong>قابلية التوسع والتوافر العالي:</strong> صُممت Milvus للتعامل مع أحجام البيانات الضخمة، وهي مصممة للتعامل مع أحجام البيانات الضخمة، وتتوسع أفقياً وتتضمن آليات النسخ المتماثل وتجاوز الفشل من أجل الموثوقية.</p></li>
<li><p><strong>البنية الموزعة:</strong> يستخدم Milvus بنية موزعة وقابلة للتطوير تفصل بين التخزين والحوسبة عبر عقد متعددة لتحقيق المرونة والمتانة.</p></li>
<li><p><a href="https://zilliz.com/blog/a-review-of-hybrid-search-in-milvus"><strong>البحث الهجين</strong></a><strong>:</strong> يدعم Milvus البحث متعدد الوسائط، <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">والبحث الهجين المتناثر والكثيف،</a> والبحث الهجين الكثيف <a href="https://thenewstack.io/elasticsearch-was-great-but-vector-databases-are-the-future/">والبحث بالنص الكامل،</a> مما يوفر وظائف بحث متعددة ومرنة.</p></li>
<li><p><strong>دعم مرن للبيانات</strong>: يدعم Milvus أنواعًا مختلفة من البيانات - المتجهات والمقاييس والبيانات المهيكلة - مما يسمح بإدارة وتحليل سلس داخل نظام واحد.</p></li>
<li><p><a href="https://discord.com/invite/8uyFbECzPX"><strong>مجتمع</strong></a> <strong>ودعم</strong><a href="https://discord.com/invite/8uyFbECzPX"><strong>نشط</strong></a>: يوفر مجتمع مزدهر تحديثات ودروسًا تعليمية ودعمًا منتظمًا، مما يضمن بقاء ميلفوس متماشيًا مع احتياجات المستخدم والتقدم في هذا المجال.</p></li>
<li><p><a href="https://milvus.io/docs/integrations_overview.md">تكامل الذكاء الاصطناعي</a>: تتكامل Milvus مع العديد من أطر وتقنيات الذكاء الاصطناعي الشائعة، مما يسهل على المطورين بناء التطبيقات باستخدام حزم التقنيات المألوفة لديهم.</p></li>
</ul>
<p>توفر Milvus أيضًا خدمة مُدارة بالكامل على <a href="https://zilliz.com/cloud">Ziliz Cloud،</a> وهي خدمة خالية من المتاعب وأسرع 10 مرات من Milvus.</p>
<h3 id="Comparison-Milvus-vs-HNSWlib" class="common-anchor-header">مقارنة: ميلفوس مقابل HNSWlib</h3><table>
<thead>
<tr><th style="text-align:center"><strong>الميزة</strong></th><th style="text-align:center"><strong>ميلفوس</strong></th><th style="text-align:center"><strong>HNSWlib</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">قابلية التوسع</td><td style="text-align:center">يتعامل مع مليارات المتجهات بكل سهولة</td><td style="text-align:center">مناسب لمجموعات البيانات الصغيرة بسبب استخدام ذاكرة الوصول العشوائي</td></tr>
<tr><td style="text-align:center">مثالي ل</td><td style="text-align:center">النماذج الأولية والتجارب والتطبيقات على مستوى المؤسسات</td><td style="text-align:center">يركز على النماذج الأولية ومهام ANN خفيفة الوزن</td></tr>
<tr><td style="text-align:center">الفهرسة</td><td style="text-align:center">يدعم أكثر من 10 خوارزميات فهرسة، بما في ذلك HNSW، وDiskANN، والتكميم الكمي، والثنائي</td><td style="text-align:center">يستخدم HNSW القائم على الرسم البياني فقط</td></tr>
<tr><td style="text-align:center">التكامل</td><td style="text-align:center">يقدم واجهات برمجة التطبيقات والخدمات السحابية الأصلية</td><td style="text-align:center">تعمل كمكتبة مستقلة خفيفة الوزن ومستقلة</td></tr>
<tr><td style="text-align:center">الأداء</td><td style="text-align:center">يحسِّن البيانات الكبيرة والاستعلامات الموزعة</td><td style="text-align:center">يوفر سرعة عالية ولكن قابلية توسع محدودة</td></tr>
</tbody>
</table>
<p>بشكل عام، يُفضَّل استخدام Milvus بشكل عام للتطبيقات واسعة النطاق على مستوى الإنتاج ذات احتياجات الفهرسة المعقدة، بينما تُعد مكتبة HNSWlib مثالية للنماذج الأولية وحالات الاستخدام الأكثر بساطة.</p>
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
    </button></h2><p>يمكن أن يكون البحث الدلالي كثيف الاستخدام للموارد، لذا فإن هيكلة البيانات الداخلية، مثل تلك التي يقوم بها HNSW، ضرورية لاسترجاع البيانات بشكل أسرع. تهتم مكتبات مثل HNSWlib بالتنفيذ، بحيث يكون لدى المطورين وصفات جاهزة لوضع نماذج أولية لقدرات المتجهات. مع بضعة أسطر من التعليمات البرمجية، يمكننا بناء الفهرس الخاص بنا وإجراء عمليات البحث.</p>
<p>HNSWlib طريقة رائعة للبدء. ومع ذلك، إذا كنت ترغب في بناء تطبيقات ذكاء اصطناعي معقدة وجاهزة للإنتاج، فإن قواعد بيانات المتجهات المصممة لهذا الغرض هي الخيار الأفضل. على سبيل المثال، <a href="https://milvus.io/">Milvus</a> هي قاعدة بيانات متجهة مفتوحة المصدر مع العديد من الميزات الجاهزة للمؤسسات مثل البحث المتجه عالي السرعة وقابلية التوسع والتوافر والمرونة من حيث أنواع البيانات ولغة البرمجة.</p>
<h2 id="Further-Reading" class="common-anchor-header">للمزيد من القراءة<button data-href="#Further-Reading" class="anchor-icon" translate="no">
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
<li><p><a href="https://zilliz.com/learn/faiss">ما هو فايس (بحث التشابه بالذكاء الاصطناعي على فيسبوك)؟ </a></p></li>
<li><p><a href="https://zilliz.com/learn/learn-hnswlib-graph-based-library-for-fast-anns">ما هو HNSWlib؟ مكتبة تستند إلى الرسم البياني للبحث السريع في الشبكات العصبية الاصطناعية </a></p></li>
<li><p><a href="https://zilliz.com/learn/what-is-scann-scalable-nearest-neighbors-google">ما هو ScaNN (أقرب الجيران القابل للتطوير)؟ </a></p></li>
<li><p><a href="https://zilliz.com/vector-database-benchmark-tool?database=ZillizCloud%2CMilvus%2CElasticCloud%2CPgVector%2CPinecone%2CQdrantCloud%2CWeaviateCloud&amp;dataset=medium&amp;filter=none%2Clow%2Chigh&amp;tab=1">VectorDBBench: أداة قياس مرجعية مفتوحة المصدر ل VectorDB</a></p></li>
<li><p><a href="https://zilliz.com/learn/generative-ai">مركز موارد الذكاء الاصطناعي التوليدي | زيليز</a></p></li>
<li><p><a href="https://zilliz.com/learn/what-is-vector-database">ما هي قواعد البيانات المتجهة وكيف تعمل؟ </a></p></li>
<li><p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">ما هو RAG؟ </a></p></li>
<li><p><a href="https://zilliz.com/ai-models">أفضل نماذج الذكاء الاصطناعي أداءً لتطبيقات الذكاء الاصطناعي التوليدي | Zilliz</a></p></li>
</ul>
