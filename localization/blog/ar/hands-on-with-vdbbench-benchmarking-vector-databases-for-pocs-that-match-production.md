---
id: >-
  hands-on-with-vdbbench-benchmarking-vector-databases-for-pocs-that-match-production.md
title: >-
  التدريب العملي مع VDBBench: قياس أداء قواعد بيانات المتجهات لقواعد بيانات
  المتجهات من أجل قواعد بيانات العمليات الأولية التي تتطابق مع الإنتاج
author: Yifan Cai
date: 2025-08-15T00:00:00.000Z
desc: >-
  تعرف على كيفية اختبار قواعد البيانات المتجهة باستخدام بيانات إنتاج حقيقية
  باستخدام VDBBench. دليل تفصيلي لمجموعة البيانات المخصصة POCs التي تتنبأ
  بالأداء الفعلي.
cover: assets.zilliz.com/vdbbench_cover_min_2f86466839.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: >-
  VectorDBBench, POC, vector database, VDBBench, benchmarking vector database,
  how to choose a vector database
meta_title: |
  Tutorial | How to Evaluate VectorDBs that Match Production via VDBBench
origin: >-
  https://milvus.io/blog/hands-on-with-vdbbench-benchmarking-vector-databases-for-pocs-that-match-production.md
---
<p>تُعد قواعد البيانات المتجهة الآن جزءًا أساسيًا من البنية التحتية للذكاء الاصطناعي، حيث تعمل على تشغيل العديد من التطبيقات التي تعمل بنظام LLM لخدمة العملاء وتوليد المحتوى والبحث والتوصيات وغيرها.</p>
<p>مع وجود العديد من الخيارات في السوق، بدءًا من قواعد البيانات المتجهة المصممة لهذا الغرض مثل Milvus وZilliz Cloud إلى قواعد البيانات التقليدية مع البحث المتجه كإضافة، فإن <strong>اختيار الخيار المناسب ليس بسيطًا مثل قراءة المخططات المعيارية.</strong></p>
<p>تقوم معظم الفرق بتشغيل إثبات المفهوم (POC) قبل الالتزام، وهو أمر ذكي من الناحية النظرية - ولكن من الناحية العملية، فإن العديد من معايير البائعين التي تبدو رائعة على الورق تنهار في ظل ظروف العالم الحقيقي.</p>
<p>أحد الأسباب الرئيسية لذلك هو أن معظم ادعاءات الأداء تستند إلى مجموعات بيانات قديمة من 2006-2012 (SIFT و GloVe و LAION) التي تتصرف بشكل مختلف تمامًا عن التضمينات الحديثة. على سبيل المثال، تستخدم SIFT متجهات ذات 128 بُعدًا، في حين أن نماذج الذكاء الاصطناعي الحالية تنتج أبعادًا أعلى بكثير - 3072 لأحدث نماذج OpenAI، و1024 لنماذج Cohere - وهو تحول كبير يؤثر على الأداء والتكلفة وقابلية التوسع.</p>
<h2 id="The-Fix-Test-with-Your-Data-Not-Canned-Benchmarks" class="common-anchor-header">الحل: اختبر ببياناتك وليس بالمعايير المعلبة<button data-href="#The-Fix-Test-with-Your-Data-Not-Canned-Benchmarks" class="anchor-icon" translate="no">
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
    </button></h2><p>الحل الأبسط والأكثر فاعلية: قم بإجراء تقييم POC الخاص بك باستخدام المتجهات التي يولدها تطبيقك بالفعل. وهذا يعني استخدام نماذج التضمين الخاصة بك، واستفساراتك الحقيقية، وتوزيع بياناتك الفعلي.</p>
<p>هذا هو بالضبط ما تم تصميم <a href="https://milvus.io/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md"><strong>VDBBench</strong></a> - أداة قياس أداء قاعدة البيانات المتجهة مفتوحة المصدر - من أجله. وهي تدعم تقييم ومقارنة أي قاعدة بيانات متجهة، بما في ذلك Milvus وElasticsearch وpgvector وغيرها، وتحاكي أعباء عمل الإنتاج الحقيقي.</p>
<p><a href="https://github.com/zilliztech/VectorDBBench">تنزيل VDBBench 1.0 → →</a><a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch&amp;__hstc=175614333.dc4bcf53f6c7d650ea8978dcdb9e7009.1727350436713.1755165753372.1755169827021.775&amp;__hssc=175614333.3.1755169827021&amp;__hsfp=1940526538"> عرض لوحة المتصدرين →</a> | <a href="https://milvus.io/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md">ما هو VDBBench</a></p>
<p>يتيح لك VDBench:</p>
<ul>
<li><p><strong>الاختبار باستخدام بياناتك الخاصة</strong> من نماذج التضمين الخاصة بك</p></li>
<li><p>محاكاة <strong>عمليات الإدراج المتزامنة والاستعلامات واستيعاب التدفق المتزامن</strong></p></li>
<li><p>قياس <strong>زمن الاستجابة P95/P99، والإنتاجية المستدامة، ودقة الاسترجاع</strong></p></li>
<li><p>قياس الأداء عبر قواعد بيانات متعددة في ظروف متطابقة</p></li>
<li><p>يسمح <strong>باختبار مجموعة بيانات مخصصة</strong> بحيث تتطابق النتائج مع الإنتاج بالفعل</p></li>
</ul>
<p>بعد ذلك، سنرشدك إلى كيفية تشغيل اختبار POC على مستوى الإنتاج باستخدام VDBBench وبياناتك الحقيقية - حتى تتمكن من اتخاذ قرار واثق ومثبت في المستقبل.</p>
<h2 id="How-to-Evaluate-VectorDBs-with-Your-Custom-Datasets-with-VDBBench" class="common-anchor-header">كيفية تقييم VectorDBs مع مجموعات بياناتك المخصصة باستخدام VDBBench<button data-href="#How-to-Evaluate-VectorDBs-with-Your-Custom-Datasets-with-VDBBench" class="anchor-icon" translate="no">
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
    </button></h2><p>قبل البدء، تأكد من تثبيت Python 3.11 أو أعلى. ستحتاج إلى بيانات متجهة بصيغة CSV أو NPY، وحوالي 2-3 ساعات لإكمال الإعداد والاختبار، ومعرفة متوسطة بلغة Python لاستكشاف الأخطاء وإصلاحها إذا لزم الأمر.</p>
<h3 id="Installation-and-Configuration" class="common-anchor-header">التثبيت والتهيئة</h3><p>إذا كنت تقوم بتقييم قاعدة بيانات واحدة، فقم بتشغيل هذا الأمر:</p>
<pre><code translate="no">pip install vectordb-bench
<button class="copy-code-btn"></button></code></pre>
<p>إذا كنت ستقارن جميع قواعد البيانات المدعومة، فقم بتشغيل الأمر:</p>
<pre><code translate="no">pip install vectordb-bench[<span class="hljs-built_in">all</span>]
<button class="copy-code-btn"></button></code></pre>
<p>لعملاء قواعد بيانات محددة (مثل: Elasticsearch):</p>
<pre><code translate="no">pip install vectordb-bench[elastic]
<button class="copy-code-btn"></button></code></pre>
<p>راجع <a href="https://github.com/zilliztech/VectorDBBench">صفحة GitHub</a> هذه لمعرفة جميع قواعد البيانات المدعومة وأوامر التثبيت الخاصة بها.</p>
<h3 id="Launching-VDBBench" class="common-anchor-header">تشغيل VDBBench</h3><p>ابدأ تشغيل <strong>VDBBench</strong> باستخدام:</p>
<pre><code translate="no">init_bench
<button class="copy-code-btn"></button></code></pre>
<p>مخرجات وحدة التحكم المتوقعة: 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_expected_console_output_66e1a218b7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>ستكون واجهة الويب متاحة محلياً:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_2e4dd7ea69.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Data-Preparation-and-Format-Conversion" class="common-anchor-header">إعداد البيانات وتحويل التنسيق</h3><p>يتطلب VDBBench ملفات باركيه منظمة مع مخططات محددة لضمان اختبار متسق عبر قواعد البيانات ومجموعات البيانات المختلفة.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>اسم الملف</strong></th><th style="text-align:center"><strong>الغرض</strong></th><th style="text-align:center"><strong>مطلوب</strong></th><th style="text-align:center"><strong>مثال على المحتوى</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">train.parquet</td><td style="text-align:center">مجموعة متجهات لإدراج قاعدة البيانات</td><td style="text-align:center">✅</td><td style="text-align:center">معرف المتجه + بيانات المتجه (قائمة[عائمة])</td></tr>
<tr><td style="text-align:center">test.parquet</td><td style="text-align:center">مجموعة المتجهات للاستعلامات</td><td style="text-align:center">✅</td><td style="text-align:center">معرف المتجه + بيانات المتجه (قائمة[عائم])</td></tr>
<tr><td style="text-align:center">الجيران.باركيه</td><td style="text-align:center">الحقيقة الأساسية لمتجهات الاستعلام (قائمة معرّفات الجيران الفعلية الأقرب إلى الجيران)</td><td style="text-align:center">✅</td><td style="text-align:center">معرف الاستعلام_id -&gt; [قائمة معرفات الجيران المتشابهة]</td></tr>
<tr><td style="text-align:center">عددية_ملصقات.باركيه</td><td style="text-align:center">تسميات (بيانات وصفية تصف كيانات أخرى غير المتجهات)</td><td style="text-align:center">❌</td><td style="text-align:center">المعرف -&gt; التسمية</td></tr>
</tbody>
</table>
<p>مواصفات الملف المطلوب:</p>
<ul>
<li><p>يجب أن يحتوي<strong>ملف متجه التدريب (train.parquet)</strong> على عمود معرّف يحتوي على أعداد صحيحة متزايدة وعمود متجه يحتوي على مصفوفات عائمة 32. أسماء الأعمدة قابلة للتكوين، ولكن يجب أن يستخدم عمود المعرف أنواع الأعداد الصحيحة للفهرسة المناسبة.</p></li>
<li><p>يتبع<strong>ملف متجه الاختبار (test.parquet)</strong> نفس بنية بيانات التدريب. يجب أن يكون اسم عمود المعرف هو "معرف" بينما يمكن تخصيص أسماء أعمدة المتجهات لتتناسب مع مخطط البيانات.</p></li>
<li><p><strong>ملف الحقيقة الأساسية (neighbors.parquet)</strong> يحتوي على أقرب الجيران المرجعيين لكل استعلام اختبار. ويتطلب عمود معرّف يتوافق مع معرّفات متجهات الاختبار وعمود صفيف الجيران الذي يحتوي على معرّفات أقرب الجيران الصحيحة من مجموعة التدريب.</p></li>
<li><p><strong>ملف التسميات القياسية (Scalar_labels.parquet)</strong> اختياري ويحتوي على تسميات البيانات الوصفية المرتبطة بمتجهات التدريب، وهو مفيد لاختبار البحث المصفى.</p></li>
</ul>
<h3 id="Data-Format-Challenges" class="common-anchor-header">تحديات تنسيق البيانات</h3><p>توجد معظم بيانات متجهات الإنتاج بتنسيقات لا تتطابق مباشرةً مع متطلبات VDBBench. عادةً ما تخزن ملفات CSV التضمينات كتمثيلات سلسلة من المصفوفات، وتحتوي ملفات NPY على مصفوفات رقمية خام بدون بيانات وصفية، وغالبًا ما تستخدم صادرات قواعد البيانات JSON أو تنسيقات منظمة أخرى.</p>
<p>ينطوي تحويل هذه التنسيقات يدويًا على عدة خطوات معقدة: تحليل تمثيلات السلاسل إلى مصفوفات رقمية، وحساب أقرب الجيران بالضبط باستخدام مكتبات مثل FAISS، وتقسيم مجموعات البيانات بشكل صحيح مع الحفاظ على اتساق المعرف، وضمان تطابق جميع أنواع البيانات مع مواصفات الباركيه.</p>
<h3 id="Automated-Format-Conversion" class="common-anchor-header">التحويل الآلي للتنسيق</h3><p>لتبسيط عملية التحويل، قمنا بتطوير برنامج نصي من لغة Python يتعامل مع تحويل التنسيق وحساب الحقيقة الأساسية وهيكلة البيانات بشكل صحيح تلقائيًا.</p>
<p><strong>تنسيق إدخال CSV:</strong></p>
<pre><code translate="no"><span class="hljs-built_in">id</span>,emb,label
<span class="hljs-number">1</span>,<span class="hljs-string">&quot;[0.12,0.56,0.89,...]&quot;</span>,A
<span class="hljs-number">2</span>,<span class="hljs-string">&quot;[0.33,0.48,0.90,...]&quot;</span>,B
<button class="copy-code-btn"></button></code></pre>
<p><strong>تنسيق إدخال NPY:</strong></p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
vectors = np.<span class="hljs-property">random</span>.<span class="hljs-title function_">rand</span>(<span class="hljs-number">10000</span>, <span class="hljs-number">768</span>).<span class="hljs-title function_">astype</span>(<span class="hljs-string">&#x27;float32&#x27;</span>)
np.<span class="hljs-title function_">save</span>(<span class="hljs-string">&quot;vectors.npy&quot;</span>, vectors)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Conversion-Script-Implementation" class="common-anchor-header">تنفيذ البرنامج النصي للتحويل</h3><p><strong>تثبيت التبعيات المطلوبة:</strong></p>
<pre><code translate="no">pip install numpy pandas faiss-cpu
<button class="copy-code-btn"></button></code></pre>
<p><strong>تنفيذ التحويل:</strong></p>
<pre><code translate="no">python convert_to_vdb_format.py \
  --train data/train.csv \
  --<span class="hljs-built_in">test</span> data/test.csv \
  --out datasets/custom \
  --topk 10
<button class="copy-code-btn"></button></code></pre>
<p><strong>مرجع المعلمة:</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>اسم المعلمة</strong></th><th style="text-align:center"><strong>مطلوب</strong></th><th style="text-align:center"><strong>النوع</strong></th><th style="text-align:center"><strong>الوصف</strong></th><th style="text-align:center"><strong>القيمة الافتراضية</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><code translate="no">--train</code></td><td style="text-align:center">نعم</td><td style="text-align:center">سلسلة</td><td style="text-align:center">مسار بيانات التدريب، يدعم تنسيق CSV أو NPY. يجب أن يحتوي ملف CSV على عمود معرف، إذا لم يكن هناك عمود معرف سيتم إنشاؤه تلقائيًا</td><td style="text-align:center">لا يوجد</td></tr>
<tr><td style="text-align:center"><code translate="no">--test</code></td><td style="text-align:center">نعم</td><td style="text-align:center">سلسلة</td><td style="text-align:center">مسار بيانات الاستعلام، يدعم تنسيق CSV أو NPY. نفس تنسيق بيانات التدريب</td><td style="text-align:center">لا يوجد</td></tr>
<tr><td style="text-align:center"><code translate="no">--out</code></td><td style="text-align:center">نعم</td><td style="text-align:center">سلسلة</td><td style="text-align:center">مسار دليل الإخراج، يحفظ ملفات الباركيه المحولة وملفات الفهرس المجاور</td><td style="text-align:center">لا يوجد</td></tr>
<tr><td style="text-align:center"><code translate="no">--labels</code></td><td style="text-align:center">لا يوجد</td><td style="text-align:center">سلسلة</td><td style="text-align:center">مسار ملف CSV للتسمية، يجب أن يحتوي على عمود التسميات (منسق كمصفوفة سلاسل)، يُستخدم لحفظ التسميات</td><td style="text-align:center">لا يوجد</td></tr>
<tr><td style="text-align:center"><code translate="no">--topk</code></td><td style="text-align:center">لا يوجد</td><td style="text-align:center">عدد صحيح</td><td style="text-align:center">عدد أقرب الجيران المراد إرجاعه عند الحساب</td><td style="text-align:center">10</td></tr>
</tbody>
</table>
<p><strong>هيكل دليل الإخراج:</strong></p>
<pre><code translate="no">datasets/custom/
├── train.parquet        <span class="hljs-comment"># Training vectors</span>
├── test.parquet         <span class="hljs-comment"># Query vectors  </span>
├── neighbors.parquet    <span class="hljs-comment"># Ground Truth</span>
└── scalar_labels.parquet <span class="hljs-comment"># Optional scalar labels</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Complete-Conversion-Script" class="common-anchor-header">إكمال البرنامج النصي للتحويل</h3><pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> argparse
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">import</span> pandas <span class="hljs-keyword">as</span> pd
<span class="hljs-keyword">import</span> faiss
<span class="hljs-keyword">from</span> ast <span class="hljs-keyword">import</span> literal_eval
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">Optional</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">load_csv</span>(<span class="hljs-params">path: <span class="hljs-built_in">str</span></span>):
    df = pd.read_csv(path)
    <span class="hljs-keyword">if</span> <span class="hljs-string">&#x27;emb&#x27;</span> <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> df.columns:
        <span class="hljs-keyword">raise</span> ValueError(<span class="hljs-string">f&quot;CSV file missing &#x27;emb&#x27; column: <span class="hljs-subst">{path}</span>&quot;</span>)
   df[<span class="hljs-string">&#x27;emb&#x27;</span>] = df[<span class="hljs-string">&#x27;emb&#x27;</span>].apply(literal_eval)
    <span class="hljs-keyword">if</span> <span class="hljs-string">&#x27;id&#x27;</span> <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> df.columns:
        df.insert(<span class="hljs-number">0</span>, <span class="hljs-string">&#x27;id&#x27;</span>, <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(df)))
    <span class="hljs-keyword">return</span> df
<span class="hljs-keyword">def</span> <span class="hljs-title function_">load_npy</span>(<span class="hljs-params">path: <span class="hljs-built_in">str</span></span>):
    arr = np.load(path)
    df = pd.DataFrame({
        <span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-built_in">range</span>(arr.shape[<span class="hljs-number">0</span>]),
        <span class="hljs-string">&#x27;emb&#x27;</span>: arr.tolist()
    })
    <span class="hljs-keyword">return</span> df
<span class="hljs-keyword">def</span> <span class="hljs-title function_">load_vectors</span>(<span class="hljs-params">path: <span class="hljs-built_in">str</span></span>) -&gt; pd.DataFrame:
    <span class="hljs-keyword">if</span> path.endswith(<span class="hljs-string">&#x27;.csv&#x27;</span>):
        <span class="hljs-keyword">return</span> load_csv(path)
    <span class="hljs-keyword">elif</span> path.endswith(<span class="hljs-string">&#x27;.npy&#x27;</span>):
        <span class="hljs-keyword">return</span> load_npy(path)
    <span class="hljs-keyword">else</span>:
        <span class="hljs-keyword">raise</span> ValueError(<span class="hljs-string">f&quot;Unsupported file format: <span class="hljs-subst">{path}</span>&quot;</span>)
<span class="hljs-keyword">def</span> <span class="hljs-title function_">compute_ground_truth</span>(<span class="hljs-params">train_vectors: np.ndarray, test_vectors: np.ndarray, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">10</span></span>):
    dim = train_vectors.shape[<span class="hljs-number">1</span>]
    index = faiss.IndexFlatL2(dim)
    index.add(train_vectors)
    _, indices = index.search(test_vectors, top_k)
    <span class="hljs-keyword">return</span> indices
<span class="hljs-keyword">def</span> <span class="hljs-title function_">save_ground_truth</span>(<span class="hljs-params">df_path: <span class="hljs-built_in">str</span>, indices: np.ndarray</span>):
    df = pd.DataFrame({
        <span class="hljs-string">&quot;id&quot;</span>: np.arange(indices.shape[<span class="hljs-number">0</span>]),
        <span class="hljs-string">&quot;neighbors_id&quot;</span>: indices.tolist()
    })
    df.to_parquet(df_path, index=<span class="hljs-literal">False</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;✅ Ground truth saved successfully: <span class="hljs-subst">{df_path}</span>&quot;</span>)
<span class="hljs-keyword">def</span> <span class="hljs-title function_">main</span>(<span class="hljs-params">train_path: <span class="hljs-built_in">str</span>, test_path: <span class="hljs-built_in">str</span>, output_dir: <span class="hljs-built_in">str</span>,
         label_path: <span class="hljs-type">Optional</span>[<span class="hljs-built_in">str</span>] = <span class="hljs-literal">None</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">10</span></span>):
    os.makedirs(output_dir, exist_ok=<span class="hljs-literal">True</span>)
    <span class="hljs-comment"># Load training and query data</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;📥 Loading training data...&quot;</span>)
    train_df = load_vectors(train_path)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;📥 Loading query data...&quot;</span>)
    test_df = load_vectors(test_path)
    <span class="hljs-comment"># Extract vectors and convert to numpy</span>
    train_vectors = np.array(train_df[<span class="hljs-string">&#x27;emb&#x27;</span>].to_list(), dtype=<span class="hljs-string">&#x27;float32&#x27;</span>)
    test_vectors = np.array(test_df[<span class="hljs-string">&#x27;emb&#x27;</span>].to_list(), dtype=<span class="hljs-string">&#x27;float32&#x27;</span>)
    <span class="hljs-comment"># Save parquet files retaining all fields</span>
    train_df.to_parquet(os.path.join(output_dir, <span class="hljs-string">&#x27;train.parquet&#x27;</span>), index=<span class="hljs-literal">False</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;✅ train.parquet saved successfully, <span class="hljs-subst">{<span class="hljs-built_in">len</span>(train_df)}</span> records total&quot;</span>)
    test_df.to_parquet(os.path.join(output_dir, <span class="hljs-string">&#x27;test.parquet&#x27;</span>), index=<span class="hljs-literal">False</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;✅ test.parquet saved successfully, <span class="hljs-subst">{<span class="hljs-built_in">len</span>(test_df)}</span> records total&quot;</span>)
    <span class="hljs-comment"># Compute ground truth</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;🔍 Computing Ground Truth (nearest neighbors)...&quot;</span>)
    gt_indices = compute_ground_truth(train_vectors, test_vectors, top_k=top_k)
    save_ground_truth(os.path.join(output_dir, <span class="hljs-string">&#x27;neighbors.parquet&#x27;</span>), gt_indices)
    <span class="hljs-comment"># Load and save label file (if provided)</span>
    <span class="hljs-keyword">if</span> label_path:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;📥 Loading label file...&quot;</span>)
        label_df = pd.read_csv(label_path)
        <span class="hljs-keyword">if</span> <span class="hljs-string">&#x27;labels&#x27;</span> <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> label_df.columns:
            <span class="hljs-keyword">raise</span> ValueError(<span class="hljs-string">&quot;Label file must contain &#x27;labels&#x27; column&quot;</span>)
        label_df[<span class="hljs-string">&#x27;labels&#x27;</span>] = label_df[<span class="hljs-string">&#x27;labels&#x27;</span>].apply(literal_eval)
        label_df.to_parquet(os.path.join(output_dir, <span class="hljs-string">&#x27;scalar_labels.parquet&#x27;</span>), index=<span class="hljs-literal">False</span>)
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;✅ Label file saved as scalar_labels.parquet&quot;</span>)

<span class="hljs-keyword">if</span> 
name
 == <span class="hljs-string">&quot;__main__&quot;</span>:
    parser = argparse.ArgumentParser(description=<span class="hljs-string">&quot;Convert CSV/NPY vectors to VectorDBBench data format (retaining all columns)&quot;</span>)
    parser.add_argument(<span class="hljs-string">&quot;--train&quot;</span>, required=<span class="hljs-literal">True</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Training data path (CSV or NPY)&quot;</span>)
    parser.add_argument(<span class="hljs-string">&quot;--test&quot;</span>, required=<span class="hljs-literal">True</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Query data path (CSV or NPY)&quot;</span>)
    parser.add_argument(<span class="hljs-string">&quot;--out&quot;</span>, required=<span class="hljs-literal">True</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Output directory&quot;</span>)
    parser.add_argument(<span class="hljs-string">&quot;--labels&quot;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Label CSV path (optional)&quot;</span>)
    parser.add_argument(<span class="hljs-string">&quot;--topk&quot;</span>, <span class="hljs-built_in">type</span>=<span class="hljs-built_in">int</span>, default=<span class="hljs-number">10</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Ground truth&quot;</span>)
    args = parser.parse_args()
    main(args.train, args.test, args.out, args.labels, args.topk)
<button class="copy-code-btn"></button></code></pre>
<p><strong>ناتج عملية التحويل:</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_conversion_process_output_0827ba75c9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>التحقق من الملفات التي تم إنشاؤها:</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_f02cd2964e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Custom-Dataset-Configuration" class="common-anchor-header">تكوين مجموعة البيانات المخصصة</h3><p>انتقل إلى قسم تكوين مجموعة البيانات المخصصة في واجهة الويب:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/5_aa14b75b5d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>توفر واجهة التكوين حقولاً لبيانات تعريف مجموعة البيانات ومواصفات مسار الملف:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/6_1b64832990.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>معلمات التكوين:</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>اسم المعلمة</strong></th><th style="text-align:center"><strong>المعنى</strong></th><th style="text-align:center"><strong>اقتراحات التكوين</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">الاسم</td><td style="text-align:center">اسم مجموعة البيانات (معرّف فريد)</td><td style="text-align:center">أي اسم، على سبيل المثال, <code translate="no">my_custom_dataset</code></td></tr>
<tr><td style="text-align:center">مسار المجلد</td><td style="text-align:center">مسار دليل ملف مجموعة البيانات</td><td style="text-align:center">على سبيل المثال, <code translate="no">/data/datasets/custom</code></td></tr>
<tr><td style="text-align:center">خافت</td><td style="text-align:center">أبعاد المتجه</td><td style="text-align:center">يجب أن تتطابق مع ملفات البيانات، على سبيل المثال، 768</td></tr>
<tr><td style="text-align:center">الحجم</td><td style="text-align:center">عدد المتجهات (اختياري)</td><td style="text-align:center">يمكن تركه فارغًا، وسيقوم النظام بالكشف التلقائي</td></tr>
<tr><td style="text-align:center">نوع القياس</td><td style="text-align:center">طريقة قياس التشابه</td><td style="text-align:center">عادةً ما تستخدم L2 (المسافة الإقليدية) أو IP (المنتج الداخلي)</td></tr>
<tr><td style="text-align:center">اسم ملف التدريب</td><td style="text-align:center">اسم ملف مجموعة التدريب (بدون امتداد .parquet)</td><td style="text-align:center">إذا <code translate="no">train.parquet</code> ، املأ <code translate="no">train</code>. تستخدم الملفات المتعددة فاصلة، على سبيل المثال, <code translate="no">train1,train2</code></td></tr>
<tr><td style="text-align:center">اسم ملف الاختبار</td><td style="text-align:center">اسم ملف مجموعة الاستعلام (بدون امتداد .parquet)</td><td style="text-align:center">إذا <code translate="no">test.parquet</code> ، املأ <code translate="no">test</code></td></tr>
<tr><td style="text-align:center">اسم ملف الحقيقة الأرضية</td><td style="text-align:center">اسم ملف الحقيقة الأرضية (بدون امتداد .parquet)</td><td style="text-align:center">إذا <code translate="no">neighbors.parquet</code> ، املأ <code translate="no">neighbors</code></td></tr>
<tr><td style="text-align:center">اسم معرف التدريب</td><td style="text-align:center">اسم عمود معرف بيانات التدريب</td><td style="text-align:center">عادةً <code translate="no">id</code></td></tr>
<tr><td style="text-align:center">اسم متجه بيانات التدريب</td><td style="text-align:center">اسم عمود متجه بيانات التدريب</td><td style="text-align:center">إذا كان اسم العمود الذي تم إنشاؤه بواسطة البرنامج النصي هو <code translate="no">emb</code> ، قم بتعبئة <code translate="no">emb</code></td></tr>
<tr><td style="text-align:center">اسم عمود متجه بيانات الاختبار</td><td style="text-align:center">اسم عمود متجه بيانات الاختبار</td><td style="text-align:center">عادةً ما يكون نفس اسم عمود متجه بيانات التدريب، على سبيل المثال, <code translate="no">emb</code></td></tr>
<tr><td style="text-align:center">اسم عمود متجه بيانات الاختبار</td><td style="text-align:center">اسم عمود الجار الأقرب في الحقيقة الأرضية</td><td style="text-align:center">إذا كان اسم العمود هو <code translate="no">neighbors_id</code> ، املأ <code translate="no">neighbors_id</code></td></tr>
<tr><td style="text-align:center">اسم ملف التسميات القياسية</td><td style="text-align:center">(اختياري) اسم ملف التسمية (بدون امتداد .parquet)</td><td style="text-align:center">إذا تم إنشاء <code translate="no">scalar_labels.parquet</code> ، قم بتعبئة <code translate="no">scalar_labels</code> ، وإلا اتركه فارغًا</td></tr>
<tr><td style="text-align:center">نسب التسميات</td><td style="text-align:center">(اختياري) نسبة مرشح التسمية</td><td style="text-align:center">على سبيل المثال، <code translate="no">0.001</code> ،<code translate="no">0.02</code> ، ،<code translate="no">0.5</code> ، اتركها فارغة إذا لم تكن هناك حاجة إلى تصفية التسمية</td></tr>
<tr><td style="text-align:center">الوصف</td><td style="text-align:center">وصف مجموعة البيانات</td><td style="text-align:center">لا يمكن ملاحظة سياق العمل أو طريقة الإنشاء</td></tr>
</tbody>
</table>
<p>احفظ التكوين لمتابعة إعداد الاختبار.</p>
<h3 id="Test-Execution-and-Database-Configuration" class="common-anchor-header">تنفيذ الاختبار وتكوين قاعدة البيانات</h3><p>الوصول إلى واجهة تكوين الاختبار:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/7_3ecdcb1034.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>اختيار قاعدة البيانات وتكوينها (ميلفوس كمثال):</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/8_356a2d8c39.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>تعيين مجموعة البيانات:</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/9_dataset_assignment_85ba7b24ca.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>اختبار البيانات الوصفية والتوسيم:</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/10_test_metadata_and_labeling_293f6f2b99.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>تنفيذ الاختبار:</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/11_test_execution_76acb42c98.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Results-Analysis-and-Performance-Evaluation" class="common-anchor-header">تحليل النتائج وتقييم الأداء<button data-href="#Results-Analysis-and-Performance-Evaluation" class="anchor-icon" translate="no">
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
    </button></h2><p>توفر واجهة النتائج تحليلات شاملة للأداء:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/12_993c536c20.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Test-Configuration-Summary" class="common-anchor-header">ملخص تكوين الاختبار</h3><p>اختبر التقييم مستويات التزامن من 1 و5 و10 عمليات متزامنة (مقيدة بموارد الأجهزة المتاحة)، وأبعاد المتجهات 768، وحجم مجموعة البيانات 3000 متجه تدريبي و3000 استعلام اختبار، مع تعطيل تصفية التسمية القياسية لهذا الاختبار.</p>
<h3 id="Critical-Implementation-Considerations" class="common-anchor-header">اعتبارات التنفيذ الحرجة</h3><ul>
<li><p><strong>تناسق الأبعاد:</strong> سيؤدي عدم تطابق أبعاد المتجهات بين مجموعتي بيانات التدريب والاختبار إلى فشل فوري في الاختبار. تحقق من محاذاة الأبعاد أثناء إعداد البيانات لتجنب أخطاء وقت التشغيل.</p></li>
<li><p><strong>دقة الحقيقة الأرضية:</strong> تؤدي حسابات الحقيقة الأرضية غير الصحيحة إلى إبطال قياسات معدل الاسترجاع. يستخدم البرنامج النصي للتحويل المقدم البرنامج النصي FAISS مع مسافة L2 لحساب أقرب جار دقيق، مما يضمن نتائج مرجعية دقيقة.</p></li>
<li><p><strong>متطلبات مقياس مجموعة البيانات:</strong> قد تنتج مجموعات البيانات الصغيرة (أقل من 10000 متجه) قياسات غير متسقة لمعدل الاسترجاع بسبب عدم كفاية توليد الأحمال. ضع في اعتبارك توسيع حجم مجموعة البيانات لإجراء اختبار إنتاجية أكثر موثوقية.</p></li>
<li><p><strong>تخصيص الموارد:</strong> يمكن أن تحدّ قيود ذاكرة حاوية Docker وقيود وحدة المعالجة المركزية بشكل مصطنع من أداء قاعدة البيانات أثناء الاختبار. راقب استخدام الموارد واضبط حدود الحاوية حسب الحاجة لقياس الأداء بدقة.</p></li>
<li><p><strong>مراقبة الأخطاء:</strong> قد يقوم <strong>VDBBench</strong> بتسجيل الأخطاء في مخرجات وحدة التحكم التي لا تظهر في واجهة الويب. مراقبة السجلات الطرفية أثناء تنفيذ الاختبار للحصول على معلومات تشخيصية كاملة.</p></li>
</ul>
<h2 id="Supplemental-Tools-Test-Data-Generation" class="common-anchor-header">الأدوات التكميلية: توليد بيانات الاختبار<button data-href="#Supplemental-Tools-Test-Data-Generation" class="anchor-icon" translate="no">
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
    </button></h2><p>بالنسبة لسيناريوهات التطوير والاختبارات الموحدة، يمكنك إنشاء مجموعات بيانات اصطناعية بخصائص مضبوطة:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> pandas <span class="hljs-keyword">as</span> pd
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">def</span> <span class="hljs-title function_">generate_csv</span>(<span class="hljs-params">num_records: <span class="hljs-built_in">int</span>, dim: <span class="hljs-built_in">int</span>, filename: <span class="hljs-built_in">str</span></span>):
    ids = <span class="hljs-built_in">range</span>(num_records)
    vectors = np.random.rand(num_records, dim).<span class="hljs-built_in">round</span>(<span class="hljs-number">6</span>) 
    emb_str = [<span class="hljs-built_in">str</span>(<span class="hljs-built_in">list</span>(vec)) <span class="hljs-keyword">for</span> vec <span class="hljs-keyword">in</span> vectors]
    df = pd.DataFrame({
        <span class="hljs-string">&#x27;id&#x27;</span>: ids,
        <span class="hljs-string">&#x27;emb&#x27;</span>: emb_str
    })
    df.to_csv(filename, index=<span class="hljs-literal">False</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Generated file <span class="hljs-subst">{filename}</span>, <span class="hljs-subst">{num_records}</span> records total, vector dimension <span class="hljs-subst">{dim}</span>&quot;</span>)
<span class="hljs-keyword">if</span>
name
 == <span class="hljs-string">&quot;__main__&quot;</span>:
    num_records = <span class="hljs-number">3000</span>  <span class="hljs-comment"># Number of records to generate</span>
    dim = <span class="hljs-number">768</span>  <span class="hljs-comment"># Vector dimension</span>

    generate_csv(num_records, dim, <span class="hljs-string">&quot;train.csv&quot;</span>)
    generate_csv(num_records, dim, <span class="hljs-string">&quot;test.csv&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>تنشئ هذه الأداة مجموعات بيانات بأبعاد محددة وأعداد سجلات محددة لسيناريوهات اختبار النماذج الأولية والاختبار الأساسي.</p>
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
    </button></h2><p>لقد تعلمت للتو كيفية التحرر من "المسرح المعياري" الذي ضلل عددًا لا يحصى من قرارات قواعد البيانات المتجهة. باستخدام VDBBench ومجموعة البيانات الخاصة بك، يمكنك إنشاء مقاييس QPS على مستوى الإنتاج، والكمون والاسترجاع - لا مزيد من التخمين من البيانات الأكاديمية التي تعود إلى عقود من الزمن.</p>
<p>توقف عن الاعتماد على المعايير المعلبة التي لا علاقة لها بأعباء عملك الحقيقية. في غضون ساعات فقط - وليس أسابيع - سترى بالضبط كيفية أداء قاعدة البيانات مع <em>ناقلاتك</em> <em>واستعلاماتك</em> <em>وقيودك</em>. هذا يعني أنه يمكنك إجراء المكالمة بثقة، وتجنب إعادة الكتابة المؤلمة لاحقًا، وشحن الأنظمة التي تعمل بالفعل في الإنتاج.</p>
<ul>
<li><p>جرب VDBBench مع أعباء العمل الخاصة بك: <a href="https://github.com/zilliztech/VectorDBBench">https://github.com/zilliztech/VectorDBBench</a></p></li>
<li><p>عرض نتائج اختبار قواعد البيانات المتجهة الرئيسية: <a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch&amp;__hstc=175614333.dc4bcf53f6c7d650ea8978dcdb9e7009.1727350436713.1755165753372.1755169827021.775&amp;__hssc=175614333.3.1755169827021&amp;__hsfp=1940526538">لوحة المتصدرين VDBBench</a></p></li>
</ul>
<p>هل لديك أسئلة أو تريد مشاركة نتائجك؟ انضم إلى المحادثة على<a href="https://github.com/zilliztech/VectorDBBench"> GitHub</a> أو تواصل مع مجتمعنا على <a href="https://discord.com/invite/FG6hMJStWu">Discord</a>.</p>
<hr>
<p><em>هذا هو المنشور الأول في سلسلة دليل VectorDB POC Guide - وهو عبارة عن طرق عملية تم اختبارها من قبل المطورين لبناء بنية تحتية للذكاء الاصطناعي تعمل تحت ضغط العالم الحقيقي. ترقبوا المزيد!</em></p>
