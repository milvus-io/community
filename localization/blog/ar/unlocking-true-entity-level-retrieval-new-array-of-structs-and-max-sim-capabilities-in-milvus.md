---
id: >-
  unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md
title: >-
  فتح الاسترجاع الحقيقي على مستوى الكيان: مجموعة جديدة من الهياكل وقدرات MAX_SIM
  في ميلفوس
author: 'Jeremy Zhu, Min Tian'
date: 2025-12-05T00:00:00.000Z
cover: assets.zilliz.com/array_of_struct_cover_457c5a104b.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, Array of Structs, MAX_SIM, vector database, multi-vector retrieval'
meta_title: |
  Array of Structs in Milvus: Entity-Level Multi-Vector Retrieval
desc: >-
  تعرّف على كيفية تمكين مصفوفة الهياكل وMax_SIM في Milvus من إجراء بحث حقيقي على
  مستوى الكيان للبيانات متعددة النواقل، مما يؤدي إلى التخلص من الاستبعاد وتحسين
  دقة الاسترجاع.
origin: >-
  https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md
---
<p>إذا كنت قد أنشأت تطبيقات ذكاء اصطناعي فوق قواعد البيانات المتجهة، فمن المحتمل أنك واجهت نفس المشكلة: تسترجع قاعدة البيانات تضمينات الأجزاء الفردية، لكن تطبيقك يهتم <strong><em>بالكيانات</em>.</strong> عدم التطابق يجعل سير عمل الاسترجاع بأكمله معقدًا.</p>
<p>من المحتمل أنك رأيت ذلك مرارًا وتكرارًا:</p>
<ul>
<li><p><strong>قواعد المعرفة RAG:</strong> يتم تجزئة المقالات إلى أجزاء مضمنة في فقرات، لذلك يقوم محرك البحث بإرجاع أجزاء متناثرة بدلاً من المستند الكامل.</p></li>
<li><p><strong>توصيات التجارة الإلكترونية:</strong> يحتوي المنتج على تضمينات صور متعددة، ويعيد نظامك خمس زوايا لنفس العنصر بدلاً من خمسة منتجات فريدة.</p></li>
<li><p><strong>منصات الفيديو:</strong> يتم تقسيم مقاطع الفيديو إلى تضمينات مقاطع فيديو، ولكن نتائج البحث تُظهر شرائح من نفس الفيديو بدلاً من إدخال واحد مدمج.</p></li>
<li><p><strong>استرجاع على غرار ColBERT / ColPali:</strong> تتوسع المستندات إلى مئات من التضمينات على مستوى الرمز أو مستوى التصحيح، وتعود نتائجك كقطع صغيرة لا تزال تتطلب الدمج.</p></li>
</ul>
<p>تنبع كل هذه المشكلات من <em>نفس الفجوة المعمارية</em>: معظم قواعد البيانات المتجهة تتعامل مع كل تضمين كصف منفصل، بينما تعمل التطبيقات الحقيقية على كيانات ذات مستوى أعلى - المستندات والمنتجات ومقاطع الفيديو والعناصر والمشاهد. ونتيجةً لذلك، تضطر الفرق الهندسية إلى إعادة بناء الكيانات يدويًا باستخدام منطق إلغاء التكرار، والتجميع، والتجميع، والتجميع في مجموعات، وإعادة ترتيبها. إنها تعمل، لكنها هشة وبطيئة وتضخم طبقة التطبيق الخاصة بك بمنطق لا ينبغي أن يكون هناك في المقام الأول.</p>
<p>يغلق<a href="https://milvus.io/docs/release_notes.md#v264">ميلفوس 2.6.4</a> هذه الفجوة بميزة جديدة: <a href="https://milvus.io/docs/array-of-structs.md"><strong>صفيف الهياكل</strong></a> مع نوع القياس <strong>MAX_SIM</strong>. تسمح هذه الميزات معًا بتخزين جميع التضمينات لكيان واحد في سجل واحد وتمكين Milvus من تسجيل الكيان وإرجاعه بشكل كلي. لا مزيد من مجموعات النتائج المكررة المملوءة. لا مزيد من المعالجة اللاحقة المعقدة مثل إعادة الترتيب والدمج</p>
<p>سنستعرض في هذه المقالة كيفية عمل مصفوفة الهياكل و MAX_SIM - وسنوضحها من خلال مثالين حقيقيين: استرجاع مستندات ويكيبيديا والبحث عن المستندات المستندة إلى صور ColPali.</p>
<h2 id="What-is-an-Array-of-Structs" class="common-anchor-header">ما هي مصفوفة الهياكل؟<button data-href="#What-is-an-Array-of-Structs" class="anchor-icon" translate="no">
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
    </button></h2><p>في ميلفوس، يسمح حقل <strong>مصفوفة الهياكل</strong> باحتواء سجل واحد على <em>قائمة مرتبة</em> من عناصر الهيكل، كل منها يتبع نفس المخطط المحدد مسبقًا. يمكن أن تحتوي البنية على متجهات متعددة بالإضافة إلى حقول قياسية أو سلاسل أو أي أنواع أخرى مدعومة. بعبارة أخرى، يتيح لك تجميع جميع الأجزاء التي تنتمي إلى كيان واحد - تضمين الفقرات، وطرق عرض الصور، وناقلات الرموز، والبيانات الوصفية - مباشرةً داخل صف واحد.</p>
<p>فيما يلي مثال لكيان من مجموعة تحتوي على حقل صفيف من الهياكل.</p>
<pre><code translate="no">{
    <span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">0</span>,
    <span class="hljs-string">&#x27;title&#x27;</span>: <span class="hljs-string">&#x27;Walden&#x27;</span>,
    <span class="hljs-string">&#x27;title_vector&#x27;</span>: [<span class="hljs-number">0.1</span>, <span class="hljs-number">0.2</span>, <span class="hljs-number">0.3</span>, <span class="hljs-number">0.4</span>, <span class="hljs-number">0.5</span>],
    <span class="hljs-string">&#x27;author&#x27;</span>: <span class="hljs-string">&#x27;Henry David Thoreau&#x27;</span>,
    <span class="hljs-string">&#x27;year_of_publication&#x27;</span>: <span class="hljs-number">1845</span>,
    <span class="hljs-comment">// highlight-start</span>
    <span class="hljs-string">&#x27;chunks&#x27;</span>: [
        {
            <span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;When I wrote the following pages, or rather the bulk of them...&#x27;</span>,
            <span class="hljs-string">&#x27;text_vector&#x27;</span>: [<span class="hljs-number">0.3</span>, <span class="hljs-number">0.2</span>, <span class="hljs-number">0.3</span>, <span class="hljs-number">0.2</span>, <span class="hljs-number">0.5</span>],
            <span class="hljs-string">&#x27;chapter&#x27;</span>: <span class="hljs-string">&#x27;Economy&#x27;</span>,
        },
        {
            <span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;I would fain say something, not so much concerning the Chinese and...&#x27;</span>,
            <span class="hljs-string">&#x27;text_vector&#x27;</span>: [<span class="hljs-number">0.7</span>, <span class="hljs-number">0.4</span>, <span class="hljs-number">0.2</span>, <span class="hljs-number">0.7</span>, <span class="hljs-number">0.8</span>],
            <span class="hljs-string">&#x27;chapter&#x27;</span>: <span class="hljs-string">&#x27;Economy&#x27;</span>
        }
    ]
    <span class="hljs-comment">// hightlight-end</span>
}
<button class="copy-code-btn"></button></code></pre>
<p>في المثال أعلاه، الحقل <code translate="no">chunks</code> هو حقل صفيف من حقول الهياكل، ويحتوي كل عنصر من عناصر الهياكل على الحقول الخاصة به، وهي <code translate="no">text</code> و <code translate="no">text_vector</code> و <code translate="no">chapter</code>.</p>
<p>يحل هذا النهج مشكلة نمذجة طويلة الأمد في قواعد البيانات المتجهة. تقليديًا، يجب أن يصبح كل تضمين أو سمة صفًا خاصًا به، مما يفرض تقسيم <strong>الكيانات متعددة المتجهات (المستندات والمنتجات ومقاطع الفيديو)</strong> إلى عشرات أو مئات أو حتى آلاف السجلات. باستخدام Array of Structs، يتيح لك Milvus تخزين الكيان متعدد المتجهات بالكامل في حقل واحد، مما يجعله مناسبًا بشكل طبيعي لقوائم الفقرات أو تضمينات الرموز أو تسلسلات المقاطع أو الصور متعددة المشاهد أو أي سيناريو يتكون فيه عنصر منطقي واحد من العديد من المتجهات.</p>
<h2 id="How-Does-an-Array-of-Structs-Work-with-MAXSIM" class="common-anchor-header">كيف تعمل مصفوفة الهياكل مع MAX_SIM؟<button data-href="#How-Does-an-Array-of-Structs-Work-with-MAXSIM" class="anchor-icon" translate="no">
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
    </button></h2><p>يوجد فوق بنية مصفوفة الهياكل الجديدة هذه <strong>MAX_SIM،</strong> وهي استراتيجية تسجيل جديدة تجعل استرجاع الدلالات مدركًا للكيانات. عند ورود استعلام، يقارنه Milvus مع <em>كل</em> متجه داخل كل مصفوفة من الهياكل ويأخذ <strong>الحد الأقصى للتشابه</strong> كدرجة نهائية للكيان. ثم يتم ترتيب الكيان وإرجاعه بناءً على تلك الدرجة الواحدة. هذا يتجنب مشكلة قاعدة البيانات المتجهة التقليدية المتمثلة في استرداد الأجزاء المبعثرة ودفع عبء التجميع وإلغاء التصنيف وإعادة الترتيب إلى طبقة التطبيق. باستخدام MAX_SIM، يصبح الاسترجاع على مستوى الكيان مدمجًا ومتسقًا وفعالًا.</p>
<p>لفهم كيفية عمل MAX_SIM عمليًا، دعونا نستعرض مثالًا ملموسًا.</p>
<p><strong>ملاحظة:</strong> يتم إنشاء جميع المتجهات في هذا المثال بواسطة نموذج التضمين نفسه، ويتم قياس التشابه باستخدام تشابه جيب التمام في النطاق [0،1].</p>
<p>لنفترض أن مستخدمًا يبحث عن <strong>"دورة تعلم الآلة للمبتدئين".</strong></p>
<p>تم ترميز الاستعلام إلى ثلاثة <strong>رموز</strong>:</p>
<ul>
<li><p><em>تعلّم الآلة</em></p></li>
<li><p><em>مبتدئ</em></p></li>
<li><p><em>دورة تدريبية</em></p></li>
</ul>
<p>يتم بعد ذلك <strong>تحويل</strong> كل رمز من هذه الرموز <strong>إلى متجه تضمين</strong> بواسطة نفس نموذج التضمين المستخدم للمستندات.</p>
<p>والآن، تخيل أن قاعدة البيانات المتجهة تحتوي على مستندين:</p>
<ul>
<li><p><strong>doc_1:</strong> <em>دليل تمهيدي للشبكات العصبية العميقة باستخدام بايثون</em></p></li>
<li><p><strong>المستند_2:</strong> <em>دليل متقدم لقراءة أوراق LLM</em></p></li>
</ul>
<p>تم تضمين كلا المستندين في متجهات وتم تخزينهما داخل مصفوفة من الهياكل.</p>
<h3 id="Step-1-Compute-MAXSIM-for-doc1" class="common-anchor-header"><strong>الخطوة 1: حساب MAX_SIM لـ doc_1</strong></h3><p>بالنسبة لكل متجه استعلام، يحسب ميلفوس تشابه جيب التمام مقابل كل متجه في doc_1:</p>
<table>
<thead>
<tr><th></th><th>مقدمة</th><th>دليل</th><th>الشبكات العصبية العميقة</th><th>بيثون</th></tr>
</thead>
<tbody>
<tr><td>التعلم الآلي</td><td>0.0</td><td>0.0</td><td><strong>0.9</strong></td><td>0.3</td></tr>
<tr><td>مبتدئ</td><td><strong>0.8</strong></td><td>0.1</td><td>0.0</td><td>0.3</td></tr>
<tr><td>الدورة</td><td>0.3</td><td><strong>0.7</strong></td><td>0.1</td><td>0.1</td></tr>
</tbody>
</table>
<p>لكل متجه استعلام، يختار MAX_SIM <strong>أعلى</strong> تشابه من صفه:</p>
<ul>
<li><p>التعلم الآلي → الشبكات العصبية العميقة (0.9)</p></li>
<li><p>مبتدئ → مقدمة (0.8)</p></li>
<li><p>الدورة التدريبية → دليل (0.7)</p></li>
</ul>
<p>جمع أفضل التطابقات يعطي doc_1 <strong>درجة MAX_SIM 2.4</strong>.</p>
<h3 id="Step-2-Compute-MAXSIM-for-doc2" class="common-anchor-header">الخطوة 2: حساب MAX_SIM للمستند_2</h3><p>الآن نكرر العملية للمستند_2:</p>
<table>
<thead>
<tr><th></th><th>متقدم</th><th>الدليل</th><th>LLM</th><th>الورقي</th><th>القراءة</th></tr>
</thead>
<tbody>
<tr><td>التعلم الآلي</td><td>0.1</td><td>0.2</td><td><strong>0.9</strong></td><td>0.3</td><td>0.1</td></tr>
<tr><td>مبتدئ</td><td>0.4</td><td><strong>0.6</strong></td><td>0.0</td><td>0.2</td><td>0.5</td></tr>
<tr><td>الدورة</td><td>0.5</td><td><strong>0.8</strong></td><td>0.1</td><td>0.4</td><td>0.7</td></tr>
</tbody>
</table>
<p>أفضل التطابقات لـ doc_2 هي</p>
<ul>
<li><p>"التعلم الآلي" → "LLM" (0.9)</p></li>
<li><p>"مبتدئ" → "دليل" (0.6)</p></li>
<li><p>"دورة" → "مرشد" (0.8)</p></li>
</ul>
<p>جمعها يعطي doc_2 <strong>درجة MAX_SIM 2.3</strong>.</p>
<h3 id="Step-3-Compare-the-Scores" class="common-anchor-header">الخطوة 3: مقارنة الدرجات</h3><p>نظرًا لأن <strong>2.4 &gt; 2.3،</strong> فإن <strong>المستند_1 يحتل مرتبة أعلى من المستند2،</strong> وهو أمر منطقي بديهي لأن المستند_1 أقرب إلى دليل تعلم آلي تمهيدي.</p>
<p>من هذا المثال يمكننا تسليط الضوء على ثلاث خصائص أساسية لـ MAX_SIM</p>
<ul>
<li><p><strong>الدلالي أولاً، وليس على أساس الكلمات الرئيسية:</strong> يقارن MAX_SIM التضمينات، وليس النصوص الحرفية. على الرغم من أن <em>"التعلّم الآلي"</em> و <em>"الشبكات العصبية العميقة"</em> لا يشتركان في أي كلمات متداخلة، إلا أن التشابه الدلالي بينهما يبلغ 0.9. وهذا ما يجعل MAX_SIM قويًا تجاه المرادفات وإعادة الصياغة والتداخل المفاهيمي وأعباء العمل الحديثة الغنية بالتضمينات.</p></li>
<li><p><strong>غير حساس للطول والترتيب:</strong> لا يتطلب MAX_SIM أن يحتوي المستند والاستعلام على نفس عدد المتجهات (على سبيل المثال، يحتوي المستند_1 على 4 متجهات بينما يحتوي المستند 2 على 5 متجهات، وكلاهما يعمل بشكل جيد). كما أنه يتجاهل أيضًا ترتيب المتجهات - ظهور "مبتدئ" في الاستعلام سابقًا وظهور "مقدمة" لاحقًا في المستند ليس له أي تأثير على النتيجة.</p></li>
<li><p><strong>كل متجه استعلام مهم:</strong> يأخذ MAX_SIM أفضل تطابق لكل متجه استعلام ويجمع أفضل الدرجات. هذا يمنع المتجهات غير المتطابقة من تحريف النتيجة ويضمن أن كل رمز استعلام مهم يساهم في النتيجة النهائية. على سبيل المثال، يقلل التطابق الأقل جودة لرمز "مبتدئ" في doc_2 من نتيجته الإجمالية مباشرةً.</p></li>
</ul>
<h2 id="Why-MAXSIM-+-Array-of-Structs-Matter-in-Vector-Database" class="common-anchor-header">سبب أهمية MAX_SIM + صفيف الهياكل في قاعدة بيانات المتجهات<button data-href="#Why-MAXSIM-+-Array-of-Structs-Matter-in-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/">Milvus</a> هي قاعدة بيانات متجهات مفتوحة المصدر وعالية الأداء وتدعم الآن بشكل كامل MAX_SIM مع مصفوفة الهياكل، مما يتيح استرجاع متعدد المتجهات على مستوى الكيانات:</p>
<ul>
<li><p><strong>تخزين الكيانات متعددة المتجهات محليًا:</strong> تسمح لك Array of Structs بتخزين مجموعات من المتجهات ذات الصلة في حقل واحد دون تقسيمها إلى صفوف منفصلة أو جداول مساعدة.</p></li>
<li><p><strong>حساب أفضل تطابق فعال:</strong> بالاقتران مع فهارس المتجهات مثل IVF و HNSW، يمكن ل MAX_SIM حساب أفضل التطابقات دون مسح كل متجه، مما يحافظ على الأداء العالي حتى مع المستندات الكبيرة.</p></li>
<li><p><strong>مصمم خصيصًا لأعباء العمل ذات الدلالات الثقيلة:</strong> تتفوق هذه الطريقة في استرجاع النصوص الطويلة، والمطابقة الدلالية متعددة الأوجه، ومحاذاة ملخص المستندات، والاستعلامات متعددة الكلمات الرئيسية، وسيناريوهات الذكاء الاصطناعي الأخرى التي تتطلب استدلالاً دلاليًا مرنًا ودقيقًا.</p></li>
</ul>
<h2 id="When-to-Use-an-Array-of-Structs" class="common-anchor-header">متى تستخدم مصفوفة الهياكل<button data-href="#When-to-Use-an-Array-of-Structs" class="anchor-icon" translate="no">
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
    </button></h2><p>تصبح قيمة مصفوفة <strong>الهياكل</strong> واضحة عندما تنظر إلى ما تتيحه. توفر هذه الميزة في جوهرها ثلاث قدرات أساسية:</p>
<ul>
<li><p><strong>إنها تجمع البيانات غير المتجانسة - المتجهات</strong>والمقاييس والسلاسل والبيانات الوصفية - في كائن واحد منظم.</p></li>
<li><p><strong>تقوم بمحاذاة التخزين مع كيانات العالم الحقيقي،</strong> بحيث يتم ربط كل صف من قاعدة البيانات بشكل نظيف بعنصر فعلي مثل مقالة أو منتج أو فيديو.</p></li>
<li><p><strong>عند دمجها مع الدوال المجمعة مثل MAX_SIM،</strong> فإنها تتيح استرجاعًا حقيقيًا متعدد المتجهات على مستوى الكيان مباشرةً من قاعدة البيانات، مما يلغي التكرار أو التجميع أو إعادة الترتيب في طبقة التطبيق.</p></li>
</ul>
<p>وبسبب هذه الخصائص، فإن مصفوفة الهياكل مناسبة بشكل طبيعي عندما <em>يتم تمثيل كيان منطقي واحد بواسطة ناقلات متعددة</em>. تشمل الأمثلة الشائعة المقالات المقسمة إلى فقرات، أو المستندات المتحللة إلى تضمينات رمزية، أو المنتجات الممثلة بصور متعددة. إذا كانت نتائج البحث الخاصة بك تعاني من تكرار النتائج، أو أجزاء مبعثرة، أو ظهور نفس الكيان عدة مرات في أعلى النتائج، فإن مصفوفة الهياكل تحل هذه المشكلات في طبقة التخزين والاسترجاع - وليس من خلال التصحيح اللاحق في التعليمات البرمجية للتطبيق.</p>
<p>يعد هذا النمط قويًا بشكل خاص لأنظمة الذكاء الاصطناعي الحديثة التي تعتمد على <strong>الاسترجاع متعدد النواقل</strong>. على سبيل المثال:</p>
<ul>
<li><p>يمثّل<a href="https://zilliz.com/learn/explore-colbert-token-level-embedding-and-ranking-model-for-similarity-search"><strong>ColBERT</strong></a> مستندًا واحدًا على شكل 100-500 رمز مضمن لمطابقة دلالية دقيقة عبر مجالات مثل النصوص القانونية والأبحاث الأكاديمية.</p></li>
<li><p><a href="https://zilliz.com/blog/colpali-enhanced-doc-retrieval-with-vision-language-models-and-colbert-strategy">يقوم<strong>ColPali</strong> بتحويل </a>كل صفحة من صفحات PDF إلى 256-1024 رقعة صورة لاسترجاع متعدد الوسائط عبر البيانات المالية والعقود والفواتير وغيرها من المستندات الممسوحة ضوئيًا.</p></li>
</ul>
<p>تسمح مصفوفة من الهياكل لـ Milvus بتخزين جميع هذه المتجهات تحت كيان واحد وحساب التشابه الكلي (على سبيل المثال، MAX_SIM) بكفاءة وبشكل أصلي. لتوضيح ذلك، إليك مثالين ملموسين.</p>
<h3 id="Example-1-E-commerce-Product-Search" class="common-anchor-header">مثال 1: البحث عن منتجات التجارة الإلكترونية</h3><p>في السابق، كان يتم تخزين المنتجات ذات الصور المتعددة في مخطط مسطح - صورة واحدة لكل صف. كان المنتج الذي يحتوي على لقطات أمامية وجانبية وزاوية ينتج عنه ثلاثة صفوف. غالبًا ما كانت نتائج البحث تُرجع صورًا متعددة لنفس المنتج، مما كان يتطلب إلغاء التكرار وإعادة الترتيب يدويًا.</p>
<p>باستخدام مصفوفة الهياكل، يصبح كل منتج <strong>صفًا واحدًا</strong>. تعيش جميع عمليات تضمين الصور والبيانات الوصفية (الزاوية، is_primary، وما إلى ذلك) داخل حقل <code translate="no">images</code> كمصفوفة من الهياكل. يفهم ميلفوس أنها تنتمي إلى نفس المنتج ويعيد المنتج ككل - وليس صوره الفردية.</p>
<h3 id="Example-2-Knowledge-Base-or-Wikipedia-Search" class="common-anchor-header">مثال 2: قاعدة المعرفة أو البحث في ويكيبيديا</h3><p>في السابق، كانت مقالة واحدة في ويكيبيديا مقسمة إلى <em>عدد N</em> من الفقرات. كانت نتائج البحث تُرجع فقرات مبعثرة، مما يجبر النظام على تجميعها وتخمين المقالة التي تنتمي إليها.</p>
<p>مع صفيف الهياكل، تصبح المقالة بأكملها <strong>صفًا واحدًا</strong>. يتم تجميع جميع الفقرات وتضميناتها تحت حقل الفقرات، وتُرجع قاعدة البيانات المقالة كاملة، وليس أجزاءً مجزأة.</p>
<h2 id="Hands-on-Tutorials-Document-Level-Retrieval-with-the-Array-of-Structs" class="common-anchor-header">دروس عملية: استرجاع على مستوى المستند باستخدام صفيف الهياكل<button data-href="#Hands-on-Tutorials-Document-Level-Retrieval-with-the-Array-of-Structs" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Wikipedia-Document-Retrieval" class="common-anchor-header">1. استرجاع مستند ويكيبيديا</h3><p>سنستعرض في هذا البرنامج التعليمي كيفية استخدام مصفوفة <strong>الهياكل</strong> لتحويل البيانات على مستوى الفقرة إلى سجلات مستند كاملة - مما يسمح لملفوس بإجراء <strong>استرجاع حقيقي على مستوى المستند</strong> بدلاً من إرجاع أجزاء معزولة.</p>
<p>تخزن العديد من خطوط أنابيب القاعدة المعرفية مقالات ويكيبيديا على شكل فقرات. يعمل هذا بشكل جيد للتضمين والفهرسة، لكنه يعطل الاسترجاع: عادةً ما يُرجع استعلام المستخدم فقرات مبعثرة، مما يجبرك على تجميع المقالة يدويًا وإعادة بنائها. باستخدام مصفوفة من الهياكل و MAX_SIM، يمكننا إعادة تصميم مخطط التخزين بحيث <strong>تصبح كل مقالة صفًا واحدًا،</strong> ويمكن لـ Milvus ترتيب المستند بأكمله وإرجاعه أصلاً.</p>
<p>سنوضح في الخطوات التالية كيفية:</p>
<ol>
<li><p>التحميل والمعالجة المسبقة لبيانات فقرات ويكيبيديا</p></li>
<li><p>تجميع كل الفقرات التي تنتمي إلى نفس المقالة في مصفوفة من الهياكل</p></li>
<li><p>إدراج هذه المستندات المهيكلة في ميلفوس</p></li>
<li><p>قم بتشغيل استعلامات MAX_SIM لاسترداد المقالات الكاملة - بشكل نظيف، دون حذف أو إعادة ترتيب</p></li>
</ol>
<p>بحلول نهاية هذا البرنامج التعليمي، سيكون لديك خط أنابيب يعمل حيث يتعامل ميلفوس مع الاسترجاع على مستوى الكيان مباشرة، بالطريقة التي يتوقعها المستخدمون بالضبط.</p>
<p><strong>نموذج البيانات:</strong></p>
<pre><code translate="no">{
    <span class="hljs-string">&quot;wiki_id&quot;</span>: <span class="hljs-built_in">int</span>,                  <span class="hljs-comment"># WIKI ID(primary key） </span>
    <span class="hljs-string">&quot;paragraphs&quot;</span>: ARRAY&lt;STRUCT&lt;      <span class="hljs-comment"># Array of paragraph structs</span>
        text:VARCHAR                 <span class="hljs-comment"># Paragraph text</span>
        emb: FLOAT_VECTOR(<span class="hljs-number">768</span>)       <span class="hljs-comment"># Embedding for each paragraph</span>
    &gt;&gt;
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>الخطوة 1: تجميع البيانات وتحويلها</strong></p>
<p>في هذا العرض التوضيحي، نستخدم مجموعة بيانات <a href="https://huggingface.co/datasets/Cohere/wikipedia-22-12-simple-embeddings">تضمينات ويكيبيديا البسيطة</a>.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> pandas <span class="hljs-keyword">as</span> pd
<span class="hljs-keyword">import</span> pyarrow <span class="hljs-keyword">as</span> pa

<span class="hljs-comment"># Load the dataset and group by wiki_id</span>
df = pd.read_parquet(<span class="hljs-string">&quot;train-*.parquet&quot;</span>)
grouped = df.groupby(<span class="hljs-string">&#x27;wiki_id&#x27;</span>)

<span class="hljs-comment"># Build the paragraph array for each article</span>
wiki_data = []
<span class="hljs-keyword">for</span> wiki_id, group <span class="hljs-keyword">in</span> grouped:
    wiki_data.append({
        <span class="hljs-string">&#x27;wiki_id&#x27;</span>: wiki_id,
        <span class="hljs-string">&#x27;paragraphs&#x27;</span>: [{<span class="hljs-string">&#x27;text&#x27;</span>: row[<span class="hljs-string">&#x27;text&#x27;</span>], <span class="hljs-string">&#x27;emb&#x27;</span>: row[<span class="hljs-string">&#x27;emb&#x27;</span>]}
                       <span class="hljs-keyword">for</span> _, row <span class="hljs-keyword">in</span> group.iterrows()]
    })
<button class="copy-code-btn"></button></code></pre>
<p><strong>الخطوة 2: إنشاء مجموعة ميلفوس</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
schema = client.create_schema()
schema.add_field(<span class="hljs-string">&quot;wiki_id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)

<span class="hljs-comment"># Define the Struct schema</span>
struct_schema = client.create_struct_field_schema()
struct_schema.add_field(<span class="hljs-string">&quot;text&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">65535</span>)
struct_schema.add_field(<span class="hljs-string">&quot;emb&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>)

schema.add_field(<span class="hljs-string">&quot;paragraphs&quot;</span>, DataType.ARRAY,
                 element_type=DataType.STRUCT,
                 struct_schema=struct_schema, max_capacity=<span class="hljs-number">200</span>)

client.create_collection(<span class="hljs-string">&quot;wiki_docs&quot;</span>, schema=schema)
<button class="copy-code-btn"></button></code></pre>
<p><strong>الخطوة 3: إدراج البيانات وبناء الفهرس</strong></p>
<pre><code translate="no"><span class="hljs-meta"># Batch insert documents</span>
client.insert(<span class="hljs-string">&quot;wiki_docs&quot;</span>, wiki_data)

<span class="hljs-meta"># Create an HNSW index</span>
index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;paragraphs[emb]&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;MAX_SIM_COSINE&quot;</span>,
    <span class="hljs-keyword">params</span>={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>}
)
client.create_index(<span class="hljs-string">&quot;wiki_docs&quot;</span>, index_params)
client.load_collection(<span class="hljs-string">&quot;wiki_docs&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>الخطوة 4: البحث في المستندات</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Search query</span>
<span class="hljs-keyword">import</span> cohere
<span class="hljs-keyword">from</span> pymilvus.client.embedding_list <span class="hljs-keyword">import</span> EmbeddingList

<span class="hljs-comment"># The dataset uses Cohere&#x27;s multilingual-22-12 embedding model, so we must embed the query using the same model.</span>
co = cohere.Client(<span class="hljs-string">f&quot;&lt;&lt;COHERE_API_KEY&gt;&gt;&quot;</span>)
query = <span class="hljs-string">&#x27;Who founded Youtube&#x27;</span>
response = co.embed(texts=[query], model=<span class="hljs-string">&#x27;multilingual-22-12&#x27;</span>)
query_embedding = response.embeddings
query_emb_list = EmbeddingList()

<span class="hljs-keyword">for</span> vec <span class="hljs-keyword">in</span> query_embedding[<span class="hljs-number">0</span>]:
    query_emb_list.add(vec)

results = client.search(
    collection_name=<span class="hljs-string">&quot;wiki_docs&quot;</span>,
    data=[query_emb_list],
    anns_field=<span class="hljs-string">&quot;paragraphs[emb]&quot;</span>,
    search_params={
        <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;MAX_SIM_COSINE&quot;</span>,
        <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;ef&quot;</span>: <span class="hljs-number">200</span>, <span class="hljs-string">&quot;retrieval_ann_ratio&quot;</span>: <span class="hljs-number">3</span>}
    },
    limit=<span class="hljs-number">10</span>,
    output_fields=[<span class="hljs-string">&quot;wiki_id&quot;</span>]
)

<span class="hljs-comment"># Results: directly return 10 full articles!</span>
<span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Article <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;wiki_id&#x27;</span>]}</span>: Score <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>مقارنة المخرجات: الاسترجاع التقليدي مقابل صفيف الهياكل</strong></p>
<p>يصبح تأثير مصفوفة الهياكل واضحًا عندما ننظر إلى ما ترجعه قاعدة البيانات بالفعل:</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>البُعد</strong></th><th style="text-align:center"><strong>النهج التقليدي</strong></th><th style="text-align:center"><strong>صفيف الهياكل</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>مخرجات قاعدة البيانات</strong></td><td style="text-align:center">إرجاع <strong>أفضل 100 فقرة</strong> (تكرار كبير)</td><td style="text-align:center">إرجاع <em>أفضل 10 مستندات كاملة</em> - نظيفة ودقيقة</td></tr>
<tr><td style="text-align:center"><strong>منطق التطبيق</strong></td><td style="text-align:center">يتطلب <strong>التجميع وإلغاء التكرار وإعادة الترتيب</strong> (معقد)</td><td style="text-align:center">لا حاجة إلى معالجة لاحقة - تأتي النتائج على مستوى الكيان مباشرةً من ميلفوس</td></tr>
</tbody>
</table>
<p>في مثال ويكيبيديا، عرضنا أبسط حالة فقط: دمج متجهات الفقرات في تمثيل موحد للمستند. لكن القوة الحقيقية لـ Array of Structs هي أنه يعمم على <strong>أي</strong> نموذج بيانات متعدد المتجهات - سواءً كانت خطوط أنابيب الاسترجاع الكلاسيكية أو بنى الذكاء الاصطناعي الحديثة.</p>
<p><strong>سيناريوهات الاسترجاع التقليدية متعددة النواقل</strong></p>
<p>تعمل العديد من أنظمة البحث والتوصيات الراسخة بشكل طبيعي على الكيانات ذات المتجهات المتعددة المرتبطة بها. تتوافق مصفوفة الهياكل مع حالات الاستخدام هذه بشكل نظيف:</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>السيناريو</strong></th><th style="text-align:center"><strong>نموذج البيانات</strong></th><th style="text-align:center"><strong>المتجهات لكل كيان</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">🛍️ <strong>منتجات التجارة الإلكترونية</strong></td><td style="text-align:center">منتج واحد ← صور متعددة</td><td style="text-align:center">5-20</td></tr>
<tr><td style="text-align:center">🎬 <strong>البحث عن الفيديو</strong></td><td style="text-align:center">فيديو واحد ← مقاطع متعددة</td><td style="text-align:center">20-100</td></tr>
<tr><td style="text-align:center">📖 <strong>استرجاع الورق</strong></td><td style="text-align:center">ورقة واحدة ← مقاطع متعددة</td><td style="text-align:center">5-15</td></tr>
</tbody>
</table>
<p><strong>أعباء عمل نموذج الذكاء الاصطناعي (حالات الاستخدام الرئيسية متعددة النواقل)</strong></p>
<p>تصبح مصفوفة الهياكل أكثر أهمية في نماذج الذكاء الاصطناعي الحديثة التي تنتج عن قصد مجموعات كبيرة من المتجهات لكل كيان من أجل التفكير الدلالي الدقيق.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>النموذج</strong></th><th style="text-align:center"><strong>نموذج البيانات</strong></th><th style="text-align:center"><strong>المتجهات لكل كيان</strong></th><th style="text-align:center"><strong>التطبيق</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>كولبيرت</strong></td><td style="text-align:center">مستند واحد → العديد من التضمينات الرمزية</td><td style="text-align:center">100-500</td><td style="text-align:center">النصوص القانونية، والأبحاث الأكاديمية، واسترجاع المستندات الدقيقة</td></tr>
<tr><td style="text-align:center"><strong>كولبالي</strong></td><td style="text-align:center">صفحة PDF واحدة → العديد من التضمينات الرمزية</td><td style="text-align:center">256-1024</td><td style="text-align:center">تقارير مالية، وعقود، وفواتير، وبحث عن مستندات متعددة الوسائط</td></tr>
</tbody>
</table>
<p><em>تتطلب</em> هذه النماذج نمط تخزين متعدد النواقل. قبل مصفوفة الهياكل، كان على المطورين تقسيم المتجهات عبر الصفوف وإعادة تجميع النتائج يدويًا. مع Milvus، يمكن الآن تخزين هذه الكيانات واسترجاعها محليًا، مع تعامل MAX_SIM مع التسجيل على مستوى المستند تلقائيًا.</p>
<h3 id="2-ColPali-Image-Based-Document-Search" class="common-anchor-header">2. بحث المستندات القائم على الصور ColPali</h3><p><a href="https://zilliz.com/blog/colpali-enhanced-doc-retrieval-with-vision-language-models-and-colbert-strategy"><strong>ColPali</strong></a> هو نموذج قوي لاسترجاع ملفات PDF متعددة الوسائط. فبدلاً من الاعتماد على النص، يعالج كل صفحة PDF كصورة ويقسمها إلى ما يصل إلى 1024 رقعة مرئية، مما يؤدي إلى إنشاء تضمين واحد لكل رقعة. في ظل مخطط قاعدة البيانات التقليدية، سيتطلب ذلك تخزين صفحة واحدة كمئات أو آلاف الصفوف المنفصلة، مما يجعل من المستحيل على قاعدة البيانات فهم أن هذه الصفوف تنتمي إلى نفس الصفحة. ونتيجة لذلك، يصبح البحث على مستوى الكيان مجزأ وغير عملي.</p>
<p>تحل Array of Structs هذه المشكلة بشكل نظيف من خلال تخزين جميع تضمينات التصحيح <em>داخل حقل</em> واحد، مما يسمح لـ Milvus بمعالجة الصفحة ككيان واحد متماسك متعدد المتجهات.</p>
<p>يعتمد البحث التقليدي لملفات PDF التقليدية غالبًا على <strong>التعرف الضوئي على الحروف OCR،</strong> والذي يحول صور الصفحة إلى نص. يعمل هذا مع النص العادي ولكنه يفقد المخططات والجداول والتخطيط والإشارات البصرية الأخرى. يتجنب ColPali هذا القيد من خلال العمل مباشرةً على صور الصفحات، مع الحفاظ على جميع المعلومات المرئية والنصية. المفاضلة هي الحجم: تحتوي كل صفحة الآن على مئات المتجهات، وهو ما يتطلب قاعدة بيانات يمكنها تجميع العديد من التضمينات في كيان واحد - وهو بالضبط ما توفره Array of Structs + MAX_SIM.</p>
<p>حالة الاستخدام الأكثر شيوعًا هي <strong>Vision RAG،</strong> حيث تصبح كل صفحة PDF كيانًا متعدد المتجهات. تتضمن السيناريوهات النموذجية ما يلي:</p>
<ul>
<li><p><strong>التقارير المالية:</strong> البحث في آلاف ملفات PDF عن الصفحات التي تحتوي على مخططات أو جداول محددة.</p></li>
<li><p><strong>العقود:</strong> استرجاع البنود من المستندات القانونية الممسوحة ضوئيًا أو المصورة.</p></li>
<li><p><strong>الفواتير:</strong> البحث عن الفواتير حسب البائع أو المبلغ أو التخطيط.</p></li>
<li><p><strong>العروض التقديمية:</strong> تحديد موقع الشرائح التي تحتوي على شكل أو مخطط معين.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Col_Pali_1daaab3c1c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>نموذج البيانات:</strong></p>
<pre><code translate="no">{
    <span class="hljs-string">&quot;page_id&quot;</span>: <span class="hljs-built_in">int</span>,                     <span class="hljs-comment"># Page ID (primary key) </span>
    <span class="hljs-string">&quot;page_number&quot;</span>: <span class="hljs-built_in">int</span>,                 <span class="hljs-comment"># Page number within the document </span>
    <span class="hljs-string">&quot;doc_name&quot;</span>: VARCHAR,                <span class="hljs-comment"># Document name</span>
    <span class="hljs-string">&quot;patches&quot;</span>: ARRAY&lt;STRUCT&lt;            <span class="hljs-comment"># Array of patch objects</span>
        patch_embedding: FLOAT_VECTOR(<span class="hljs-number">128</span>)  <span class="hljs-comment"># Embedding for each patch</span>
    &gt;&gt;
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>الخطوة 1: إعداد البيانات</strong>يمكنك الرجوع إلى المستند للحصول على تفاصيل حول كيفية تحويل ColPali للصور أو النصوص إلى تمثيلات متعددة المتجهات.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> torch
<span class="hljs-keyword">from</span> PIL <span class="hljs-keyword">import</span> Image

<span class="hljs-keyword">from</span> colpali_engine.models <span class="hljs-keyword">import</span> ColPali, ColPaliProcessor

model_name = <span class="hljs-string">&quot;vidore/colpali-v1.3&quot;</span>

model = ColPali.from_pretrained(
    model_name,
    torch_dtype=torch.bfloat16,
    device_map=<span class="hljs-string">&quot;cuda:0&quot;</span>,  <span class="hljs-comment"># or &quot;mps&quot; if on Apple Silicon</span>
).<span class="hljs-built_in">eval</span>()

processor = ColPaliProcessor.from_pretrained(model_name)
<span class="hljs-comment"># Example: 2 documents, 5 pages each, total 10 images</span>
images = [
    Image.<span class="hljs-built_in">open</span>(<span class="hljs-string">&quot;path/to/your/image1.png&quot;</span>), 
    Image.<span class="hljs-built_in">open</span>(<span class="hljs-string">&quot;path/to/your/image2.png&quot;</span>), 
    ....
    Image.<span class="hljs-built_in">open</span>(<span class="hljs-string">&quot;path/to/your/image10.png&quot;</span>)
]
<span class="hljs-comment"># Convert each image into multiple patch embeddings</span>
batch_images = processor.process_images(images).to(model.device)
<span class="hljs-keyword">with</span> torch.no_grad():
    image_embeddings = model(**batch_images)
<button class="copy-code-btn"></button></code></pre>
<p><strong>الخطوة 2: إنشاء مجموعة ميلفوس</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
schema = client.create_schema()
schema.add_field(<span class="hljs-string">&quot;page_id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;page_number&quot;</span>, DataType.INT64)
schema.add_field(<span class="hljs-string">&quot;doc_name&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">500</span>)

<span class="hljs-comment"># Struct Array for patches</span>
struct_schema = client.create_struct_field_schema()
struct_schema.add_field(<span class="hljs-string">&quot;patch_embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">128</span>)

schema.add_field(<span class="hljs-string">&quot;patches&quot;</span>, DataType.ARRAY,
                 element_type=DataType.STRUCT,
                 struct_schema=struct_schema, max_capacity=<span class="hljs-number">2048</span>)

client.create_collection(<span class="hljs-string">&quot;doc_pages&quot;</span>, schema=schema)
<button class="copy-code-btn"></button></code></pre>
<p><strong>الخطوة 3: إدراج البيانات وإنشاء الفهرس</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Prepare data for insertion</span>
page_data=[
    {
        <span class="hljs-string">&quot;page_id&quot;</span>: <span class="hljs-number">0</span>,
        <span class="hljs-string">&quot;page_number&quot;</span>: <span class="hljs-number">0</span>,
        <span class="hljs-string">&quot;doc_name&quot;</span>: <span class="hljs-string">&quot;Q1_Financial_Report.pdf&quot;</span>,
        <span class="hljs-string">&quot;patches&quot;</span>: [
            {<span class="hljs-string">&quot;patch_embedding&quot;</span>: emb} <span class="hljs-keyword">for</span> emb <span class="hljs-keyword">in</span> image_embeddings[<span class="hljs-number">0</span>]
        ],
    },
    ...,
    {
        <span class="hljs-string">&quot;page_id&quot;</span>: <span class="hljs-number">9</span>,
        <span class="hljs-string">&quot;page_number&quot;</span>: <span class="hljs-number">4</span>,
        <span class="hljs-string">&quot;doc_name&quot;</span>: <span class="hljs-string">&quot;Product_Manual.pdf&quot;</span>,
        <span class="hljs-string">&quot;patches&quot;</span>: [
            {<span class="hljs-string">&quot;patch_embedding&quot;</span>: emb} <span class="hljs-keyword">for</span> emb <span class="hljs-keyword">in</span> image_embeddings[<span class="hljs-number">9</span>]
        ],
    },
]

client.insert(<span class="hljs-string">&quot;doc_pages&quot;</span>, page_data)

<span class="hljs-comment"># Create index</span>
index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;patches[patch_embedding]&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;MAX_SIM_IP&quot;</span>,
    params={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">32</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>}
)
client.create_index(<span class="hljs-string">&quot;doc_pages&quot;</span>, index_params)
client.load_collection(<span class="hljs-string">&quot;doc_pages&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>الخطوة 4: البحث متعدد الوسائط: استعلام نصي ← نتائج الصور</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Run the search</span>
<span class="hljs-keyword">from</span> pymilvus.client.embedding_list <span class="hljs-keyword">import</span> EmbeddingList

queries = [
    <span class="hljs-string">&quot;quarterly revenue growth chart&quot;</span>    
]
<span class="hljs-comment"># Convert the text query into a multi-vector representation</span>
batch_queries = processor.process_queries(queries).to(model.device)
<span class="hljs-keyword">with</span> torch.no_grad():
    query_embeddings = model(**batch_queries)

query_emb_list = EmbeddingList()
<span class="hljs-keyword">for</span> vec <span class="hljs-keyword">in</span> query_embeddings[<span class="hljs-number">0</span>]:
    query_emb_list.add(vec)
results = client.search(
    collection_name=<span class="hljs-string">&quot;doc_pages&quot;</span>,
    data=[query_emb_list],
    anns_field=<span class="hljs-string">&quot;patches[patch_embedding]&quot;</span>,
    search_params={
        <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;MAX_SIM_IP&quot;</span>,
        <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;ef&quot;</span>: <span class="hljs-number">100</span>, <span class="hljs-string">&quot;retrieval_ann_ratio&quot;</span>: <span class="hljs-number">3</span>}
    },
    limit=<span class="hljs-number">3</span>,
    output_fields=[<span class="hljs-string">&quot;page_id&quot;</span>, <span class="hljs-string">&quot;doc_name&quot;</span>, <span class="hljs-string">&quot;page_number&quot;</span>]
)


<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Query: &#x27;<span class="hljs-subst">{queries[<span class="hljs-number">0</span>]}</span>&#x27;&quot;</span>)
<span class="hljs-keyword">for</span> i, hit <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results, <span class="hljs-number">1</span>):
    entity = hit[<span class="hljs-string">&#x27;entity&#x27;</span>]
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;doc_name&#x27;</span>]}</span> - Page <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;page_number&#x27;</span>]}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   Score: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>\n&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>عينة من المخرجات:</strong></p>
<pre><code translate="no"><span class="hljs-title class_">Query</span>: <span class="hljs-string">&#x27;quarterly revenue growth chart&#x27;</span>
<span class="hljs-number">1.</span> Q1_Financial_Report.<span class="hljs-property">pdf</span> - <span class="hljs-title class_">Page</span> <span class="hljs-number">2</span>
   <span class="hljs-title class_">Score</span>: <span class="hljs-number">0.9123</span>

<span class="hljs-number">2.</span> Q1_Financial_Report.<span class="hljs-property">pdf</span> - <span class="hljs-title class_">Page</span> <span class="hljs-number">1</span>
   <span class="hljs-title class_">Score</span>: <span class="hljs-number">0.7654</span>

<span class="hljs-number">3.</span> <span class="hljs-title class_">Product</span>_Manual.<span class="hljs-property">pdf</span> - <span class="hljs-title class_">Page</span> <span class="hljs-number">1</span>
   <span class="hljs-title class_">Score</span>: <span class="hljs-number">0.5231</span>
<button class="copy-code-btn"></button></code></pre>
<p>هنا، تعرض النتائج مباشرةً صفحات PDF كاملة. لا داعي للقلق بشأن تضمين 1024 رقعة أساسية - يعالج ميلفوس كل التجميع تلقائيًا.</p>
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
    </button></h2><p>تخزن معظم قواعد البيانات المتجهة كل جزء كسجل مستقل، مما يعني أن التطبيقات يجب أن تعيد تجميع تلك الأجزاء عندما تحتاج إلى مستند أو منتج أو صفحة كاملة. مصفوفة من الهياكل تغير ذلك. من خلال الجمع بين الكميات القياسية والمتجهات والنصوص والحقول الأخرى في كائن منظم واحد، فهي تسمح لصف واحد في قاعدة البيانات بتمثيل كيان واحد كامل من البداية إلى النهاية.</p>
<p>والنتيجة بسيطة ولكنها قوية: العمل الذي كان يتطلب تجميعًا معقدًا وإلغاءً وإعادة ترتيب في طبقة التطبيق يصبح قدرة قاعدة بيانات أصلية. وهذا هو بالضبط ما يتجه إليه مستقبل قواعد البيانات المتجهة - هياكل أكثر ثراءً واسترجاعًا أكثر ذكاءً وخطوط أنابيب أبسط.</p>
<p>لمزيد من المعلومات حول صفيف الهياكل و MAX_SIM، راجع الوثائق أدناه:</p>
<ul>
<li><a href="https://milvus.io/docs/array-of-structs.md">صفيف الهياكل | وثائق ملفوس</a></li>
</ul>
<p>هل لديك أسئلة أو تريد التعمق في أي ميزة في أحدث إصدار من Milvus؟ انضم إلى<a href="https://discord.com/invite/8uyFbECzPX"> قناة Discord</a> الخاصة بنا أو قم بتسجيل المشكلات على<a href="https://github.com/milvus-io/milvus"> GitHub</a>. يمكنك أيضًا حجز جلسة فردية مدتها 20 دقيقة للحصول على رؤى وإرشادات وإجابات لأسئلتك من خلال<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> ساعات عمل Milvus المكتبية</a>.</p>
