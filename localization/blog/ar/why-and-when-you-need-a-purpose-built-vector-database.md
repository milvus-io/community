---
id: why-and-when-you-need-a-purpose-built-vector-database.md
title: لماذا ومتى تحتاج إلى قاعدة بيانات متجهات مصممة لغرض معين؟
author: James Luan
date: 2023-08-29T00:00:00.000Z
cover: >-
  assets.zilliz.com/Why_you_need_a_real_vector_database2_20230830_075505_1_4b32582c87.png
tag: Engineering
tags: >-
  Vector Database, AI, Artificial Intelligence, Machine Learning, Milvus, LLM,
  Large Language Models, Embeddings, Vector search, Vector similarity search
desc: >-
  يقدم هذا المنشور لمحة عامة عن البحث عن المتجهات وطريقة عملها، ويقارن بين
  تقنيات البحث عن المتجهات المختلفة، ويشرح سبب أهمية اختيار قاعدة بيانات متجهات
  مصممة لهذا الغرض.
recommend: true
canonicalUrl: >-
  https://www.aiacceleratorinstitute.com/why-and-when-do-you-need-a-purpose-built-vector-database/
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Why_you_need_a_real_vector_database2_20230830_075505_1_4b32582c87.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>نُشرت هذه المقالة في الأصل على موقع <a href="https://www.aiacceleratorinstitute.com/why-and-when-do-you-need-a-purpose-built-vector-database/">AIAI</a> ويعاد نشرها هنا بإذن.</em></p>
<p>أدى تزايد شعبية <a href="https://zilliz.com/learn/ChatGPT-Vector-Database-Prompt-as-code">ChatGPT</a> وغيرها من النماذج اللغوية الكبيرة (LLMs) إلى زيادة شعبية تقنيات البحث المتجه، بما في ذلك قواعد بيانات المتجهات المصممة لهذا الغرض مثل <a href="https://milvus.io/docs/overview.md">Milvus</a> و <a href="https://zilliz.com/cloud">Zilliz Cloud،</a> ومكتبات البحث المتجه مثل <a href="https://zilliz.com/blog/set-up-with-facebook-ai-similarity-search-faiss">FAISS،</a> ومكونات البحث المتجه المدمجة مع قواعد البيانات التقليدية. ومع ذلك، قد يكون اختيار الحل الأفضل لاحتياجاتك أمراً صعباً. مثل الاختيار بين مطعم راقٍ وسلسلة مطاعم للوجبات السريعة، يعتمد اختيار تقنية البحث المتجه المناسبة على احتياجاتك وتوقعاتك.</p>
<p>في هذا المنشور، سأقدم لمحة عامة عن البحث المتجه ووظائفه، وأقارن بين تقنيات البحث المتجه المختلفة، وأشرح سبب أهمية اختيار قاعدة بيانات متجهة مصممة لهذا الغرض.</p>
<h2 id="What-is-vector-search-and-how-does-it-work" class="common-anchor-header">ما هو البحث المتجه، وكيف يعمل؟<button data-href="#What-is-vector-search-and-how-does-it-work" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/blog/vector-similarity-search">البحث عن</a> المتجهات، والمعروف أيضًا باسم البحث عن تشابه المتجهات، هو تقنية لاسترجاع أفضل-ك من النتائج الأكثر تشابهًا أو ارتباطًا دلاليًا بمتجه استعلام معين من بين مجموعة واسعة من بيانات المتجهات الكثيفة.</p>
<p>قبل إجراء عمليات البحث عن التشابه، نستفيد من الشبكات العصبية لتحويل <a href="https://zilliz.com/blog/introduction-to-unstructured-data">البيانات غير المهيكلة،</a> مثل النصوص والصور ومقاطع الفيديو والصوت، إلى متجهات رقمية عالية الأبعاد تسمى متجهات التضمين. على سبيل المثال، يمكننا استخدام الشبكة العصبية التلافيفية ResNet-50 المدربة مسبقًا لتحويل صورة طائر إلى مجموعة من التضمينات ذات 2048 بُعدًا. ندرج هنا العناصر المتجهة الثلاثة الأولى والأخيرة: <code translate="no">[0.1392, 0.3572, 0.1988, ..., 0.2888, 0.6611, 0.2909]</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/bird_image_4a1be18f99.png" alt="A bird image by Patrice Bouchard" class="doc-image" id="a-bird-image-by-patrice-bouchard" />
   </span> <span class="img-wrapper"> <span>صورة طائر بواسطة باتريس بوشارد</span> </span></p>
<p>بعد توليد متجهات التضمين، تقارن محركات البحث عن المتجهات المسافة المكانية بين متجه الاستعلام المدخلات والمتجهات في مخازن المتجهات. كلما اقتربوا في الفضاء، كلما كانوا أكثر تشابهاً.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_3732_20230510_073643_25f985523e.png" alt="Embedding arithmetic" class="doc-image" id="embedding-arithmetic" />
   </span> <span class="img-wrapper"> <span>حساب التضمين</span> </span></p>
<h2 id="Popular-vector-search-technologies" class="common-anchor-header">تقنيات البحث عن المتجهات الشائعة<button data-href="#Popular-vector-search-technologies" class="anchor-icon" translate="no">
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
    </button></h2><p>تتوفر العديد من تقنيات البحث عن المتجهات في السوق، بما في ذلك مكتبات التعلم الآلي مثل NumPy من Python، ومكتبات البحث عن المتجهات مثل FAISS، ومكونات البحث عن المتجهات المبنية على قواعد البيانات التقليدية، وقواعد البيانات المتجهة المتخصصة مثل Milvus و Zilliz Cloud.</p>
<h3 id="Machine-learning-libraries" class="common-anchor-header">مكتبات التعلم الآلي</h3><p>يعد استخدام مكتبات التعلم الآلي أسهل طريقة لتنفيذ عمليات البحث المتجهية. على سبيل المثال، يمكننا استخدام NumPy من Python لتنفيذ خوارزمية الجار الأقرب في أقل من 20 سطرًا من التعليمات البرمجية.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np

<span class="hljs-comment"># Function to calculate euclidean distance</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">euclidean_distance</span>(<span class="hljs-params">a, b</span>):
<span class="hljs-keyword">return</span> np.linalg.norm(a - b)

<span class="hljs-comment"># Function to perform knn</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">knn</span>(<span class="hljs-params">data, target, k</span>):
<span class="hljs-comment"># Calculate distances between target and all points in the data</span>
distances = [euclidean_distance(d, target) <span class="hljs-keyword">for</span> d <span class="hljs-keyword">in</span> data]
<span class="hljs-comment"># Combine distances with data indices</span>
distances = np.array(<span class="hljs-built_in">list</span>(<span class="hljs-built_in">zip</span>(distances, np.arange(<span class="hljs-built_in">len</span>(data)))))

<span class="hljs-comment"># Sort by distance</span>
sorted_distances = distances[distances[:, <span class="hljs-number">0</span>].argsort()]

<span class="hljs-comment"># Get the top k closest indices</span>
closest_k_indices = sorted_distances[:k, <span class="hljs-number">1</span>].astype(<span class="hljs-built_in">int</span>)

<span class="hljs-comment"># Return the top k closest vectors</span>
<span class="hljs-keyword">return</span> data[closest_k_indices]
<button class="copy-code-btn"></button></code></pre>
<p>يمكننا توليد 100 متجه ثنائي الأبعاد وإيجاد أقرب جار للمتجه [0.5، 0.5].</p>
<pre><code translate="no"><span class="hljs-comment"># Define some 2D vectors</span>
data = np.random.rand(<span class="hljs-number">100</span>, <span class="hljs-number">2</span>)

<span class="hljs-comment"># Define a target vector</span>
target = np.array([<span class="hljs-number">0.5</span>, <span class="hljs-number">0.5</span>])

<span class="hljs-comment"># Define k</span>
k = <span class="hljs-number">3</span>

<span class="hljs-comment"># Perform knn</span>
closest_vectors = knn(data, target, k)

<span class="hljs-comment"># Print the result</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;The closest vectors are:&quot;</span>)
<span class="hljs-built_in">print</span>(closest_vectors)
<button class="copy-code-btn"></button></code></pre>
<p>توفر مكتبات التعلم الآلي، مثل NumPy من Python، مرونة كبيرة بتكلفة منخفضة. ومع ذلك، فإن لها بعض القيود. على سبيل المثال، يمكنها فقط التعامل مع كمية صغيرة من البيانات ولا تضمن ثبات البيانات.</p>
<p>أوصي فقط باستخدام NumPy أو مكتبات التعلم الآلي الأخرى للبحث المتجه عندما:</p>
<ul>
<li>تحتاج إلى نماذج أولية سريعة.</li>
<li>لا تهتم باستمرار البيانات.</li>
<li>حجم بياناتك أقل من مليون، ولا تحتاج إلى تصفية عددية.</li>
<li>لا تحتاج إلى أداء عالٍ.</li>
</ul>
<h3 id="Vector-search-libraries" class="common-anchor-header">مكتبات البحث المتجهية</h3><p>يمكن أن تساعدك مكتبات البحث المتجهية في بناء نظام بحث متجهي نموذجي عالي الأداء بسرعة. FAISS هو مثال نموذجي. وهي مفتوحة المصدر وتم تطويرها بواسطة Meta للبحث الفعال عن التشابه وتجميع المتجهات الكثيفة. يمكن ل FAISS التعامل مع مجموعات المتجهات من أي حجم، حتى تلك التي لا يمكن تحميلها بالكامل في الذاكرة. بالإضافة إلى ذلك، يوفر FAISS أدوات للتقييم وضبط المعلمات. على الرغم من كتابته بلغة C++، إلا أن FAISS يوفر واجهة Python/NumPy.</p>
<p>فيما يلي رمز لمثال بحث متجه يعتمد على FAISS:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">import</span> faiss

<span class="hljs-comment"># Generate some example data</span>
dimension = <span class="hljs-number">64</span> <span class="hljs-comment"># dimension of the vector space</span>
database_size = <span class="hljs-number">10000</span> <span class="hljs-comment"># size of the database</span>
query_size = <span class="hljs-number">100</span> <span class="hljs-comment"># number of queries to perform</span>
np.random.seed(<span class="hljs-number">123</span>) <span class="hljs-comment"># make the random numbers predictable</span>

<span class="hljs-comment"># Generating vectors to index in the database (db_vectors)</span>
db_vectors = np.random.random((database_size, dimension)).astype(<span class="hljs-string">&#x27;float32&#x27;</span>)

<span class="hljs-comment"># Generating vectors for query (query_vectors)</span>
query_vectors = np.random.random((query_size, dimension)).astype(<span class="hljs-string">&#x27;float32&#x27;</span>)

<span class="hljs-comment"># Building the index</span>
index = faiss.IndexFlatL2(dimension) <span class="hljs-comment"># using the L2 distance metric</span>
<span class="hljs-built_in">print</span>(index.is_trained) <span class="hljs-comment"># should return True</span>

<span class="hljs-comment"># Adding vectors to the index</span>
index.add(db_vectors)
<span class="hljs-built_in">print</span>(index.ntotal) <span class="hljs-comment"># should return database_size (10000)</span>

<span class="hljs-comment"># Perform a search</span>
k = <span class="hljs-number">4</span> <span class="hljs-comment"># we want to see 4 nearest neighbors</span>
distances, indices = index.search(query_vectors, k)

<span class="hljs-comment"># Print the results</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Indices of nearest neighbors: \n&quot;</span>, indices)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nL2 distances to the nearest neighbors: \n&quot;</span>, distances)
<button class="copy-code-btn"></button></code></pre>
<p>تعد مكتبات البحث عن المتجهات مثل FAISS سهلة الاستخدام وسريعة بما يكفي للتعامل مع بيئات الإنتاج على نطاق صغير مع ملايين المتجهات. يمكنك تحسين أداء استعلاماتها من خلال استخدام التكميم ووحدات معالجة الرسومات وتقليل أبعاد البيانات.</p>
<p>ومع ذلك، فإن هذه المكتبات لديها بعض القيود عند استخدامها في الإنتاج. على سبيل المثال، لا تدعم FAISS إضافة البيانات وحذفها في الوقت الحقيقي، أو المكالمات عن بُعد، أو اللغات المتعددة، أو التصفية القياسية، أو قابلية التوسع، أو التعافي من الكوارث.</p>
<h3 id="Different-types-of-vector-databases" class="common-anchor-header">أنواع مختلفة من قواعد البيانات المتجهة</h3><p>ظهرت قواعد البيانات المتجهة لمعالجة قيود المكتبات المذكورة أعلاه، مما يوفر حلاً أكثر شمولاً وعملياً لتطبيقات الإنتاج.</p>
<p>تتوفر أربعة أنواع من قواعد البيانات المتجهة في ساحة المعركة:</p>
<ul>
<li>قواعد البيانات العلائقية أو العمودية الحالية التي تتضمن مكونًا إضافيًا للبحث عن المتجهات. مثال على ذلك PG Vector.</li>
<li>محركات البحث التقليدية ذات الفهرس المقلوب مع دعم فهرسة المتجهات الكثيفة. <a href="https://zilliz.com/comparison/elastic-vs-milvus">ElasticSearch</a> مثال على ذلك.</li>
<li>قواعد البيانات المتجهة خفيفة الوزن المبنية على مكتبات البحث المتجهية. كروما مثال على ذلك.</li>
<li><strong>قواعد البيانات المتجهة المصممة لغرض معين</strong>. هذا النوع من قواعد البيانات مصمم خصيصًا ومحسّن للبحث عن المتجهات من الأسفل إلى الأعلى. عادةً ما تقدم قواعد البيانات المتجهة المصممة لغرض معين ميزات أكثر تقدمًا، بما في ذلك الحوسبة الموزعة واستعادة البيانات بعد الكوارث واستمرار البيانات. <a href="https://zilliz.com/what-is-milvus">ميلفوس</a> هو مثال أساسي على ذلك.</li>
</ul>
<p>لا يتم إنشاء جميع قواعد البيانات المتجهة على قدم المساواة. فكل حزمة لها مزايا وقيود فريدة من نوعها، مما يجعلها أكثر أو أقل ملاءمة للتطبيقات المختلفة.</p>
<p>أفضّل قواعد البيانات المتجهة المتخصصة على الحلول الأخرى لأنها الخيار الأكثر كفاءة وملاءمة، وتقدم العديد من المزايا الفريدة. في الأقسام التالية، سأستخدم ميلفوس كمثال لشرح أسباب تفضيلي لها.</p>
<h2 id="Key-benefits-of-purpose-built-vector-databases" class="common-anchor-header">الفوائد الرئيسية لقواعد البيانات المتجهة المصممة لهذا الغرض<button data-href="#Key-benefits-of-purpose-built-vector-databases" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/">ميلفوس</a> هي قاعدة بيانات متجهات مفتوحة المصدر وموزعة ومصممة لهذا الغرض، ويمكنها تخزين وفهرسة وإدارة واسترجاع مليارات من متجهات التضمين. وهي أيضًا واحدة من أشهر قواعد البيانات المتجهة الأكثر شيوعًا <a href="https://zilliz.com/use-cases/llm-retrieval-augmented-generation">للجيل المعزز لاسترجاع LLM</a>. كمثال نموذجي لقواعد البيانات المتجهة المصممة لهذا الغرض، تشترك ميلفوس في العديد من المزايا الفريدة مع نظيراتها.</p>
<h3 id="Data-Persistence-and-Cost-Effective-Storage" class="common-anchor-header">ثبات البيانات والتخزين الفعال من حيث التكلفة</h3><p>في حين أن منع فقدان البيانات هو الحد الأدنى من متطلبات قاعدة البيانات، فإن العديد من قواعد البيانات المتجهة أحادية الجهاز وخفيفة الوزن لا تعطي الأولوية لموثوقية البيانات. على النقيض من ذلك، فإن قواعد البيانات المتجهة الموزعة المصممة لهذا الغرض مثل <a href="https://zilliz.com/what-is-milvus">ميلفوس</a> تعطي الأولوية لمرونة النظام وقابلية التوسع واستمرار البيانات من خلال فصل التخزين عن الحوسبة.</p>
<p>علاوةً على ذلك، تحتاج معظم قواعد البيانات المتجهة التي تستخدم فهارس أقرب جار تقريبي (ANN) إلى الكثير من الذاكرة لإجراء البحث عن المتجهات، حيث إنها تقوم بتحميل فهارس ANN في الذاكرة فقط. ومع ذلك، تدعم Milvus فهارس الأقراص، مما يجعل التخزين أكثر فعالية من حيث التكلفة بأكثر من عشرة أضعاف الفهارس داخل الذاكرة.</p>
<h3 id="Optimal-Query-Performance" class="common-anchor-header">الأداء الأمثل للاستعلام</h3><p>توفر قاعدة البيانات المتجهة المتخصصة الأداء الأمثل للاستعلام مقارنةً بخيارات البحث المتجهة الأخرى. على سبيل المثال، تعدّ Milvus أسرع بعشر مرات في معالجة الاستعلامات من ملحقات البحث المتجه. يستخدم Milvus <a href="https://zilliz.com/glossary/anns">خوارزمية ANN</a> بدلاً من خوارزمية البحث الوحشي KNN للبحث المتجه بشكل أسرع. بالإضافة إلى ذلك، فإنه يقوم بتجزئة فهارسه، مما يقلل من الوقت الذي يستغرقه إنشاء فهرس مع زيادة حجم البيانات. يُمكّن هذا النهج ميلفوس من التعامل بسهولة مع مليارات المتجهات مع إضافات البيانات وحذفها في الوقت الفعلي. وعلى النقيض من ذلك، فإن الوظائف الإضافية الأخرى للبحث عن المتجهات مناسبة فقط للسيناريوهات التي تحتوي على أقل من عشرات الملايين من البيانات والإضافات والحذف غير المتكرر.</p>
<p>يدعم Milvus أيضًا تسريع وحدة معالجة الرسومات. تُظهر الاختبارات الداخلية أن فهرسة المتجهات المسرَّعة بوحدة معالجة الرسومات يمكن أن تحقق أكثر من 10,000+ QPS عند البحث في عشرات الملايين من البيانات، وهو أسرع بعشر مرات على الأقل من فهرسة وحدة المعالجة المركزية التقليدية لأداء الاستعلام في جهاز واحد.</p>
<h3 id="System-Reliability" class="common-anchor-header">موثوقية النظام</h3><p>تستخدم العديد من التطبيقات قواعد البيانات المتجهة للاستعلامات عبر الإنترنت التي تتطلب زمن استعلام منخفض وإنتاجية عالية. وتتطلب هذه التطبيقات تجاوز الفشل في جهاز واحد على مستوى الدقائق، وبعضها يتطلب التعافي من الكوارث عبر المناطق في السيناريوهات الحرجة. وتعاني استراتيجيات النسخ المتماثل التقليدية القائمة على رافت/باكسوس من إهدار خطير للموارد وتحتاج إلى مساعدة لتجزئة البيانات مسبقًا، مما يؤدي إلى ضعف الموثوقية. في المقابل، تمتلك Milvus بنية موزعة تستفيد من قوائم انتظار رسائل K8s من أجل التوافر العالي، مما يقلل من وقت الاسترداد ويوفر الموارد.</p>
<h3 id="Operability-and-Observability" class="common-anchor-header">قابلية التشغيل والمراقبة</h3><p>لخدمة المستخدمين من المؤسسات بشكل أفضل، يجب أن تقدم قواعد البيانات المتجهة مجموعة من الميزات على مستوى المؤسسات لتحسين قابلية التشغيل والمراقبة. تدعم Milvus طرق نشر متعددة، بما في ذلك مخطط K8s Operator و Helm، و docker-compose، وPip install، مما يجعلها في متناول المستخدمين ذوي الاحتياجات المختلفة. كما يوفر Milvus أيضًا نظام مراقبة وإنذار يعتمد على Grafana و Prometheus و Loki، مما يحسّن من إمكانية مراقبته. وبفضل البنية السحابية الموزعة الأصلية، تُعد Milvus أول قاعدة بيانات متجهة في المجال تدعم العزل متعدد المستأجرين، ونظام RBAC، وتحديد الحصص، والترقيات المتجددة. كل هذه الأساليب تجعل إدارة Milvus ومراقبتها أبسط بكثير.</p>
<h2 id="Getting-started-with-Milvus-in-3-simple-steps-within-10-minutes" class="common-anchor-header">بدء العمل مع Milvus في 3 خطوات بسيطة في غضون 10 دقائق<button data-href="#Getting-started-with-Milvus-in-3-simple-steps-within-10-minutes" class="anchor-icon" translate="no">
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
    </button></h2><p>يعد إنشاء قاعدة بيانات متجهة مهمة معقدة، ولكن استخدام واحدة منها بسيط مثل استخدام Numpy و FAISS. حتى الطلاب الذين ليسوا على دراية بالذكاء الاصطناعي يمكنهم تنفيذ البحث المتجه استنادًا إلى Milvus في عشر دقائق فقط. لتجربة خدمات بحث متجهية عالية الأداء وقابلة للتطوير، اتبع هذه الخطوات الثلاث:</p>
<ul>
<li>نشر ميلفوس على الخادم الخاص بك بمساعدة <a href="https://milvus.io/docs/install_standalone-docker.md">مستند نشر ميلفوس</a>.</li>
<li>تنفيذ البحث المتجه باستخدام 50 سطرًا فقط من التعليمات البرمجية بالرجوع إلى مستند <a href="https://milvus.io/docs/example_code.md">Hello Milvus</a>.</li>
<li>استكشف <a href="https://github.com/towhee-io/examples/">أمثلة مستندات Towhee</a> لاكتساب نظرة ثاقبة <a href="https://zilliz.com/use-cases">لحالات الاستخدام</a> الشائعة <a href="https://zilliz.com/use-cases">لقواعد بيانات المتجهات</a>.</li>
</ul>
