---
id: how-to-debug-slow-requests-in-milvus.md
title: كيفية تصحيح أخطاء طلبات البحث البطيء في ميلفوس
author: Jael Gu
date: 2025-10-02T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Oct_2_2025_10_52_33_AM_min_fdb227d8c6.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, vector database, slow requests, debug Milvus'
meta_title: |
  How to Debug Slow Search Requests in Milvus
desc: >-
  في هذا المنشور، سوف نشارك كيفية فرز الطلبات البطيئة في Milvus ونشارك الخطوات
  العملية التي يمكنك اتخاذها للحفاظ على زمن استجابة يمكن التنبؤ به ومستقر ومنخفض
  باستمرار.
origin: 'https://milvus.io/blog/how-to-debug-slow-requests-in-milvus.md'
---
<p>الأداء هو جوهر ميلفوس. في الظروف العادية، يكتمل طلب البحث داخل Milvus في أجزاء من الثانية فقط. ولكن ماذا يحدث عندما تتباطأ مجموعتك - عندما يمتد زمن انتقال البحث إلى ثوانٍ كاملة بدلاً من ذلك؟</p>
<p>لا تحدث عمليات البحث البطيئة في كثير من الأحيان، ولكنها قد تظهر على نطاق واسع أو في ظل أعباء عمل معقدة. وعندما تحدث، فإنها تكون مهمة: فهي تعطل تجربة المستخدم، وتؤدي إلى تشويه أداء التطبيق، وغالبًا ما تكشف عن أوجه القصور الخفية في إعداداتك.</p>
<p>في هذا المنشور، سنستعرض كيفية فرز الطلبات البطيئة في ميلفوس ونشارك الخطوات العملية التي يمكنك اتخاذها للحفاظ على زمن انتقال يمكن التنبؤ به ومستقر ومنخفض باستمرار.</p>
<h2 id="Identifying-Slow-Searches" class="common-anchor-header">تحديد عمليات البحث البطيئة<button data-href="#Identifying-Slow-Searches" class="anchor-icon" translate="no">
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
    </button></h2><p>يبدأ تشخيص الطلبات البطيئة بسؤالين: <strong>كم مرة يحدث ذلك وأين يذهب الوقت؟</strong> يمنحك ميلفوس كلا الإجابتين من خلال المقاييس والسجلات.</p>
<h3 id="Milvus-Metrics" class="common-anchor-header">مقاييس ميلفوس</h3><p>يصدّر ميلفوس مقاييس مفصّلة يمكنك مراقبتها في لوحات معلومات Grafana.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_2_64a5881bf2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_3_b7b8b369ec.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>تتضمن اللوحات الرئيسية ما يلي:</p>
<ul>
<li><p><strong>جودة الخدمة ← الاستعلام البطيء</strong>: يضع علامات على أي طلب يتجاوز proxy.slowQuerySpanSpanInSeconds (الافتراضي: 5 ثوانٍ). يتم تمييزها أيضًا في Prometheus.</p></li>
<li><p><strong>جودة الخدمة → زمن انتقال البحث</strong>: يعرض التوزيع الإجمالي لزمن الاستجابة. إذا كان هذا يبدو طبيعيًا، ولكن لا يزال المستخدمون النهائيون يرون تأخيرات في البحث، فمن المحتمل أن تكون المشكلة خارج Milvus - في الشبكة أو طبقة التطبيق.</p></li>
<li><p><strong>عقدة الاستعلام → زمن انتقال البحث حسب المرحلة</strong>: تقسيم الكمون إلى مراحل قائمة الانتظار والاستعلام والتقليل. لإسناد أعمق، تكشف لوحات مثل الكمون <em>التصفوي</em> <em>القياسي</em> وزمن <em>انتقال البحث المتجه وزمن انتقال البحث المتجه</em> وزمن <em>انتظار tSafe Latency</em> عن المرحلة المهيمنة.</p></li>
</ul>
<h3 id="Milvus-Logs" class="common-anchor-header">سجلات ميلفوس</h3><p>يسجل Milvus أيضًا أي طلب يستغرق أكثر من ثانية واحدة، موسومًا بعلامات مثل [بحث بطيء]. تُظهر هذه السجلات <em>أي</em> الاستعلامات بطيئة، مكمّلةً بذلك الرؤى المستقاة من المقاييس. كقاعدة عامة</p>
<ul>
<li><p><strong>&lt; 30 مللي ثانية</strong> ← زمن انتقال البحث السليم في معظم السيناريوهات</p></li>
<li><p><strong>&gt; 100 مللي ثانية</strong> → يستحق البحث</p></li>
<li><p><strong>&gt; 1 ثانية</strong> → بطيء بالتأكيد ويتطلب الانتباه</p></li>
</ul>
<p>مثال على السجل:</p>
<pre><code translate="no">[<span class="hljs-number">2025</span>/<span class="hljs-number">08</span>/<span class="hljs-number">23</span> <span class="hljs-number">19</span>:<span class="hljs-number">22</span>:<span class="hljs-number">19.900</span> +<span class="hljs-number">00</span>:<span class="hljs-number">00</span>] [INFO] [proxy/impl.<span class="hljs-keyword">go</span>:<span class="hljs-number">3141</span>] [<span class="hljs-string">&quot;Search slow&quot;</span>] [traceID=<span class="hljs-number">9100</span>b3092108604716f1472e4c7d54e4] [role=proxy] [db=<span class="hljs-keyword">default</span>] [collection=my_repos] [partitions=<span class="hljs-string">&quot;[]&quot;</span>] [dsl=<span class="hljs-string">&quot;user == \&quot;milvus-io\&quot; &amp;&amp; repo == \&quot;proxy.slowQuerySpanInSeconds\&quot;&quot;</span>] [<span class="hljs-built_in">len</span>(PlaceholderGroup)=<span class="hljs-number">8204</span>] [OutputFields=<span class="hljs-string">&quot;[user,repo,path,descripion]&quot;</span>] [search_params=<span class="hljs-string">&quot;[{\&quot;key\&quot;:\&quot;topk\&quot;,\&quot;value\&quot;:\&quot;10\&quot;},{\&quot;key\&quot;:\&quot;metric_type\&quot;,\&quot;value\&quot;:\&quot;COSINE\&quot;},{\&quot;key\&quot;:\&quot;anns_field\&quot;,\&quot;value\&quot;:\&quot;vector\&quot;},{\&quot;key\&quot;:\&quot;params\&quot;,\&quot;value\&quot;:\&quot;{\\\&quot;nprobe\\\&quot;:256,\\\&quot;metric_type\\\&quot;:\\\&quot;COSINE\\\&quot;}\&quot;}]&quot;</span>] [ConsistencyLevel=Strong] [useDefaultConsistency=<span class="hljs-literal">true</span>] [guarantee_timestamp=<span class="hljs-number">460318735832711168</span>] [nq=<span class="hljs-number">1</span>] [duration=<span class="hljs-number">5</span>m12<span class="hljs-number">.002784545</span>s] [durationPerNq=<span class="hljs-number">5</span>m12<span class="hljs-number">.002784545</span>s]
<button class="copy-code-btn"></button></code></pre>
<p>باختصار، <strong>تخبرك المقاييس إلى أين يذهب الوقت؛ بينما تخبرك السجلات عن الاستعلامات التي يتم ضربها.</strong></p>
<h2 id="Analyzing-Root-Cause" class="common-anchor-header">تحليل السبب الجذري<button data-href="#Analyzing-Root-Cause" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Heavy-Workload" class="common-anchor-header">عبء العمل الثقيل</h3><p>السبب الشائع لبطء الطلبات هو عبء العمل الزائد. عندما يكون للطلب <strong>عدد</strong> كبير جدًا من الاستعلامات (عدد الاستعلامات لكل طلب)، يمكن أن يعمل لفترة طويلة ويحتكر موارد عقدة الاستعلام. تتراكم الطلبات الأخرى خلفه، مما يؤدي إلى ارتفاع زمن انتقال قائمة الانتظار. حتى إذا كان لكل طلب عدد قليل من NQ، فإن الإنتاجية الإجمالية العالية جدًا (QPS) يمكن أن تسبب نفس التأثير، حيث قد يدمج Milvus طلبات البحث المتزامنة داخليًا.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/high_workload_cf9c75e24c.png" alt=" " class="doc-image" id="-" />
    <span> </span>
  </span>
</p>
<p><strong>إشارات يجب مراقبتها:</strong></p>
<ul>
<li><p>تُظهر جميع الاستعلامات زمن انتقال مرتفع بشكل غير متوقع.</p></li>
<li><p>تبلغ مقاييس عقدة الاستعلام عن <strong>زمن انتقال</strong> عالٍ <strong>في قائمة الانتظار</strong>.</p></li>
<li><p>تُظهر السجلات طلبًا ذا عدد سعات كبيرة ومدة إجمالية طويلة، ولكن مدة صغيرة نسبيًا لكل عدد سعات - مما يشير إلى أن طلبًا واحدًا كبير الحجم يهيمن على الموارد.</p></li>
</ul>
<p><strong>كيفية إصلاح ذلك:</strong></p>
<ul>
<li><p><strong>الاستعلامات المجمعة</strong>: اجعل NQ متواضعًا لتجنب التحميل الزائد على طلب واحد.</p></li>
<li><p><strong>توسيع نطاق عقد الاستعلام</strong>: إذا كان التزامن العالي جزءًا منتظمًا من عبء العمل لديك، أضف عقد الاستعلام لتوزيع الحمل والحفاظ على زمن انتقال منخفض.</p></li>
</ul>
<h3 id="Inefficient-Filtering" class="common-anchor-header">تصفية غير فعالة</h3><p>يأتي عنق الزجاجة الشائع الآخر من المرشحات غير الفعالة. إذا تم إجراء تعبيرات التصفية بشكل سيء أو كانت الحقول تفتقر إلى الفهارس العددية، فقد يعود ميلفوس إلى <strong>المسح الكامل</strong> بدلاً من مسح مجموعة فرعية صغيرة مستهدفة. يمكن لفلاتر JSON وإعدادات الاتساق الصارمة أن تزيد من النفقات العامة.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/inefficient_filtering_e524615d63.png" alt=" " class="doc-image" id="-" />
    <span> </span>
  </span>
</p>
<p><strong>إشارات يجب الانتباه لها:</strong></p>
<ul>
<li><p><strong>كمون عامل التصفية القياسي</strong> العالي في مقاييس عقدة الاستعلام.</p></li>
<li><p>طفرات كمون ملحوظة فقط عند تطبيق المرشحات.</p></li>
<li><p><strong>زمن انتظار</strong> طويل <strong>tSafe Latency</strong> إذا تم تمكين الاتساق الصارم.</p></li>
</ul>
<p><strong>كيفية إصلاحه:</strong></p>
<ul>
<li><strong>تبسيط تعبيرات التصفية</strong>: تقليل تعقيد خطة الاستعلام عن طريق تحسين عوامل التصفية. على سبيل المثال، استبدل سلاسل OR الطويلة بتعبير IN:</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Replace chains of OR conditions with IN</span>
tag = {<span class="hljs-string">&quot;tag&quot;</span>: [<span class="hljs-string">&quot;A&quot;</span>, <span class="hljs-string">&quot;B&quot;</span>, <span class="hljs-string">&quot;C&quot;</span>, <span class="hljs-string">&quot;D&quot;</span>]}
filter_expr = <span class="hljs-string">&quot;tag IN {tag}&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><p>يقدم Milvus أيضًا آلية نمذجة تعبيرات التصفية المصممة لتحسين الكفاءة من خلال تقليل الوقت المستغرق في تحليل التعبيرات المعقدة. راجع <a href="https://milvus.io/docs/filtering-templating.md">هذا المستند</a> لمزيد من التفاصيل.</p></li>
<li><p><strong>إضافة فهارس مناسبة</strong>: تجنب عمليات المسح الكامل عن طريق إنشاء فهارس عددية على الحقول المستخدمة في المرشحات.</p></li>
<li><p><strong>التعامل مع JSON بكفاءة</strong>: قدم Milvus 2.6 فهرس المسار والفهارس المسطحة لحقول JSON، مما يتيح التعامل الفعال مع بيانات JSON. يوجد أيضًا تمزيق JSON على <a href="https://milvus.io/docs/roadmap.md">خارطة الطريق</a> لتحسين الأداء بشكل أكبر. راجع <a href="https://milvus.io/docs/use-json-fields.md#JSON-Field">مستند حقل JSON</a> للحصول على معلومات إضافية.</p></li>
<li><p><strong>ضبط مستوى الاتساق</strong>: استخدم القراءات المتناسقة <em>المحدودة</em> أو المتناسقة <em>في نهاية المطاف</em> عندما لا تكون هناك حاجة إلى ضمانات صارمة، مما يقلل من وقت انتظار <em>tSafe</em>.</p></li>
</ul>
<h3 id="Improper-Choice-of-Vector-Index" class="common-anchor-header">اختيار غير مناسب لفهرس المتجهات</h3><p><a href="https://milvus.io/docs/index-explained.md">فهارس المتجهات</a> ليست مقاسًا واحدًا يناسب الجميع. اختيار الفهرس الخاطئ يمكن أن يؤثر بشكل كبير على زمن الانتظار. توفر الفهارس داخل الذاكرة أسرع أداء ولكنها تستهلك المزيد من الذاكرة، بينما توفر الفهارس على القرص الذاكرة على حساب السرعة. تتطلب المتجهات الثنائية أيضًا استراتيجيات فهرسة متخصصة.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_4_25fa1b9c13.png" alt=" " class="doc-image" id="-" />
    <span> </span>
  </span>
</p>
<p><strong>إشارات يجب الانتباه لها:</strong></p>
<ul>
<li><p>الكمون العالي للبحث عن المتجهات في مقاييس عقدة الاستعلام.</p></li>
<li><p>تشبع القرص بالإدخال/الإخراج عند استخدام DiskANN أو MMAP.</p></li>
<li><p>استعلامات أبطأ مباشرة بعد إعادة التشغيل بسبب بدء التشغيل البارد لذاكرة التخزين المؤقت.</p></li>
</ul>
<p><strong>كيفية إصلاحه:</strong></p>
<ul>
<li><p><strong>تطابق الفهرس مع عبء العمل (المتجهات العائمة):</strong></p>
<ul>
<li><p><strong>HNSW</strong> - الأفضل لحالات الاستخدام داخل الذاكرة مع استدعاء عالٍ وزمن انتقال منخفض.</p></li>
<li><p><strong>عائلة IVF</strong> - مفاضلات مرنة بين الاسترجاع والسرعة.</p></li>
<li><p><strong>DiskANN</strong> - تدعم مجموعات البيانات بمليار حجم، ولكنها تتطلب نطاقًا تردديًا قويًا على القرص.</p></li>
</ul></li>
<li><p><strong>للمتجهات الثنائية:</strong> استخدم <a href="https://milvus.io/docs/minhash-lsh.md">فهرس MINHASH_LSH</a> (الذي تم تقديمه في Milvus 2.6) مع مقياس MHJACCARD لتقريب تشابه جاكارد بكفاءة.</p></li>
<li><p><strong>تمكين</strong> <a href="https://milvus.io/docs/mmap.md"><strong>MMAP</strong></a>: قم بتعيين ملفات الفهرس في الذاكرة بدلاً من الاحتفاظ بها مقيمة بالكامل لتحقيق التوازن بين زمن الاستجابة واستخدام الذاكرة.</p></li>
<li><p><strong>ضبط معلمات الفهرس/البحث</strong>: اضبط الإعدادات لتحقيق التوازن بين الاستدعاء والكمون لحجم عملك.</p></li>
<li><p><strong>التخفيف من حالات البدء البارد</strong>: قم بإحماء المقاطع التي يتم الوصول إليها بشكل متكرر بعد إعادة التشغيل لتجنب بطء الاستعلام الأولي.</p></li>
</ul>
<h3 id="Runtime--Environment-Conditions" class="common-anchor-header">ظروف وقت التشغيل والبيئة</h3><p>ليست جميع الاستعلامات البطيئة ناتجة عن الاستعلام نفسه. غالبًا ما تتشارك عقد الاستعلام الموارد مع وظائف الخلفية، مثل الضغط أو ترحيل البيانات أو بناء الفهرس. يمكن أن تؤدي عمليات الإدراج المتكررة إلى توليد العديد من المقاطع الصغيرة غير المفهرسة، مما يجبر عمليات البحث على مسح البيانات الأولية. في بعض الحالات، يمكن أيضًا أن تؤدي أوجه القصور الخاصة بالإصدار إلى حدوث تأخير في الكمون حتى يتم تصحيحه.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/img_v3_02q5_4dd2e545_93dc_4c58_b609_d76d50c2013g_aad0a89208.png" alt=" " class="doc-image" id="-" />
    <span> </span>
  </span>
</p>
<p><strong>إشارات يجب مراقبتها:</strong></p>
<ul>
<li><p>ارتفاع استخدام وحدة المعالجة المركزية أثناء مهام الخلفية (الضغط، الترحيل، إنشاء الفهرس).</p></li>
<li><p>تشبع القرص بالإدخال/الإخراج الذي يؤثر على أداء الاستعلام.</p></li>
<li><p>الإحماء البطيء جداً لذاكرة التخزين المؤقت بعد إعادة التشغيل.</p></li>
<li><p>أعداد كبيرة من المقاطع الصغيرة غير المفهرسة (من عمليات الإدراج المتكررة).</p></li>
<li><p>انحدارات الكمون المرتبطة بإصدارات محددة من Milvus.</p></li>
</ul>
<p><strong>كيفية إصلاحه:</strong></p>
<ul>
<li><p><strong>إعادة جدولة مهام الخلفية</strong> (على سبيل المثال، الضغط) في غير ساعات الذروة.</p></li>
<li><p><strong>تحرير المجموعات غير المستخدمة</strong> لتحرير الذاكرة.</p></li>
<li><p><strong>احتساب وقت الإحماء</strong> بعد إعادة التشغيل؛ قم بتسخين ذاكرات التخزين المؤقت مسبقًا إذا لزم الأمر.</p></li>
<li><p><strong>عمليات الإدراج المجمعة</strong> لتقليل إنشاء المقاطع الصغيرة والسماح للضغط بالمواكبة.</p></li>
<li><p><strong>حافظ على التحديث</strong>: قم بالترقية إلى إصدارات Milvus الأحدث لإصلاح الأخطاء والتحسينات.</p></li>
<li><p><strong>توفير الموارد</strong>: خصص وحدة المعالجة المركزية/الذاكرة الإضافية لأحمال العمل الحساسة لوقت الاستجابة.</p></li>
</ul>
<p>من خلال مطابقة كل إشارة مع الإجراء الصحيح، يمكن حل معظم الاستعلامات البطيئة بسرعة وبشكل متوقع.</p>
<h2 id="Best-Practices-to-Prevent-Slow-Searches" class="common-anchor-header">أفضل الممارسات لمنع عمليات البحث البطيئة<button data-href="#Best-Practices-to-Prevent-Slow-Searches" class="anchor-icon" translate="no">
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
    </button></h2><p>أفضل جلسة تصحيح الأخطاء هي تلك التي لا تحتاج إلى تشغيلها أبدًا. من خلال تجربتنا، فإن بعض العادات البسيطة تقطع شوطاً طويلاً نحو منع الاستعلامات البطيئة في ميلفوس:</p>
<ul>
<li><p><strong>تخطيط تخصيص الموارد</strong> لتجنب ازدحام وحدة المعالجة المركزية والقرص.</p></li>
<li><p><strong>قم بتعيين تنبيهات استباقية</strong> لكل من حالات الفشل وارتفاع زمن الاستجابة.</p></li>
<li><p><strong>اجعل تعبيرات التصفية</strong> قصيرة وبسيطة وفعالة.</p></li>
<li><p><strong>إدراج الدُفعات</strong> وإبقاء NQ/QPS عند مستويات مستدامة.</p></li>
<li><p><strong>فهرسة جميع الحقول</strong> المستخدمة في الفلاتر.</p></li>
</ul>
<p>الاستعلامات البطيئة في ميلفوس نادرة الحدوث، وعندما تظهر، عادةً ما يكون لها أسباب واضحة يمكن تشخيصها. باستخدام المقاييس والسجلات والنهج المنظم، يمكنك تحديد المشكلات وحلها بسرعة. هذا هو دليل التشغيل نفسه الذي يستخدمه فريق الدعم لدينا كل يوم - وهو الآن متاح لك أيضًا.</p>
<p>نأمل أن يوفر هذا الدليل ليس فقط إطار عمل لاستكشاف الأخطاء وإصلاحها ولكن أيضًا الثقة للحفاظ على أعباء عمل Milvus الخاصة بك بسلاسة وكفاءة.</p>
<h2 id="💡-Want-to-dive-deeper" class="common-anchor-header">💡 هل تريد التعمق أكثر؟<button data-href="#💡-Want-to-dive-deeper" class="anchor-icon" translate="no">
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
<li><p>انضم إلى <a href="https://discord.com/invite/8uyFbECzPX"><strong>Milvus Discord</strong></a> لطرح الأسئلة ومشاركة الخبرات والتعلم من المجتمع.</p></li>
<li><p>اشترك في <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"><strong>ساعات عمل Milvus المكتبية</strong></a> للتحدث مباشرةً مع الفريق والحصول على مساعدة عملية في أعباء العمل الخاصة بك.</p></li>
</ul>
