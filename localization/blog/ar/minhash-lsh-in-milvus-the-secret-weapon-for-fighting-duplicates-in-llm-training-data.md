---
id: >-
  minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md
title: 'MinHash LSH في Milvus: السلاح السري لمحاربة التكرارات في بيانات تدريب LLM'
author: 'Li Liu, Yaya Cheng'
date: 2025-05-16T00:00:00.000Z
desc: >-
  يوفر MinHash LSH في الإصدار Milvus 2.6 حلاً فعالاً لإلغاء تكرار مجموعات بيانات
  التدريب الضخمة على إدارة التعلم الآلي ذات المستوى المنخفض، مع معالجة أسرع
  بمرتين وتوفير في التكاليف بمقدار 3 إلى 5 مرات مقارنةً بالطرق التقليدية.
cover: assets.zilliz.com/Chat_GPT_Image_May_16_2025_09_46_39_PM_1f3290ce5e.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'MinHash LSH, Locality Sensitive Hashing, Milvus, LLM training data'
meta_title: >
  MinHash LSH in Milvus: The Secret Weapon for Fighting Duplicates in LLM
  Training Data
origin: >-
  https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md
---
<p>لقد غيرت نماذج اللغات الكبيرة (LLMs) مشهد الذكاء الاصطناعي من خلال قدرتها على كتابة التعليمات البرمجية وإنشاء المحتوى وحل المشكلات المعقدة. ومع ذلك، تتطلب هذه النماذج القوية كميات هائلة من البيانات عالية الجودة لتغذية تدريبها.</p>
<p>ويكمن التحدي في أن بيانات التدريب الأولية غالباً ما تحتوي على قدر كبير من التكرار. فالأمر أشبه بتعليم الطفل بتكرار نفس الدروس مراراً وتكراراً مع تخطي مواضيع أخرى مهمة. تواصلت معنا إحدى شركات الذكاء الاصطناعي الكبيرة بشأن هذه المشكلة بالتحديد، حيث كانت تقوم ببناء نموذج لغوي جديد وطموح ولكنها واجهت صعوبة في إلغاء تكرار عشرات المليارات من المستندات. لم تتمكن طرق المطابقة التقليدية من التوسع في هذا الحجم، وتطلبت أدوات إلغاء التكرار المتخصصة موارد حاسوبية هائلة، مما جعلها غير مجدية اقتصادياً.</p>
<p>ولحل هذه المشكلة، فإن حلنا هو: فهرسة MinHash LSH (التجزئة الحساسة للموقع)، والتي ستكون متاحة في الإصدار 2.6 من Milvus. ستستكشف هذه المقالة كيف تحل MinHash LSH (التجزئة الحساسة للموقع) مشكلة إلغاء البيانات المكررة بكفاءة لتدريب LLM.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Chat_GPT_Image_May_16_2025_09_46_39_PM_1f3290ce5e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Data-Deduplication-Why-It-Matters-for-LLM-Training" class="common-anchor-header">إلغاء البيانات المكررة: لماذا هو مهم لتدريب LLM<button data-href="#Data-Deduplication-Why-It-Matters-for-LLM-Training" class="anchor-icon" translate="no">
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
    </button></h2><p>تعد البيانات عالية الجودة والمتنوعة ضرورية لتدريب الآلات ذات المحركات ذات المحركات ذات المحركات المنخفضة المستوى القوية. عندما يظهر محتوى مكرر في بيانات التدريب، فإن ذلك يخلق العديد من المشاكل الهامة:</p>
<ul>
<li><p><strong>الموارد المهدرة:</strong> تزيد البيانات المكررة من وقت التدريب والتكاليف واستهلاك الطاقة.</p></li>
<li><p><strong>انخفاض الأداء:</strong> يمكن أن تتكيف النماذج بشكل مفرط مع المحتوى المكرر، مما يحد من قدرتها على التعميم على المعلومات الجديدة.</p></li>
<li><p><strong>تأثير الحفظ:</strong> يزيد المحتوى المكرر من فرصة حفظ النماذج لنص معين وإعادة إنتاجه حرفيًا. كما يمكن أن يؤدي ذلك إلى تسريب الخصوصية أو مشاكل في حقوق النشر.</p></li>
<li><p><strong>التقييمات المضللة:</strong> يمكن أن تؤدي التكرارات بين مجموعات التدريب والاختبار إلى تضخيم مقاييس الأداء عن طريق الخطأ.</p></li>
</ul>
<p>هناك ثلاث طرق رئيسية للعثور على التكرارات وإزالتها:</p>
<ul>
<li><p><strong>المطابقة التامة:</strong> تحديد التكرارات المتطابقة من خلال التجزئة.</p></li>
<li><p><strong>المطابقة التقريبية:</strong> يعثر على التكرارات القريبة من التكرارات باستخدام خوارزميات مثل MinHash LSH وجاكارد للتشابه.</p></li>
<li><p><strong>المطابقة الدلالية:</strong> تحديد المحتوى ذي المعنى المتشابه باستخدام التضمينات المتجهة.</p></li>
</ul>
<p>مع وجود متراكبات ما قبل التدريب التي تصل إلى تيرابايت أو حتى بيتابايت، فإن طرق المطابقة الدقيقة التقليدية مثل المقارنات الثنائية غير مجدية من الناحية الحسابية. يضيف إلغاء التكرار الدلالي نفقات كبيرة باستخدام نماذج التضمين لتوليد المتجهات. نحن بحاجة إلى طرق تقريبية أكثر ابتكاراً - مثل <strong>MinHash LSH - التي</strong>توازن بين الاستدعاء والدقة مع الحفاظ على التكاليف قابلة للإدارة، مما يجعل إلغاء البيانات المكررة على نطاق واسع أمراً عملياً.</p>
<h2 id="MinHash-LSH-Efficiently-Detecting-Near-Duplicates-in-Massive-Datasets" class="common-anchor-header">MinHash LSH: الكشف بكفاءة عن التكرارات شبه المكررة في مجموعات البيانات الضخمة<button data-href="#MinHash-LSH-Efficiently-Detecting-Near-Duplicates-in-Massive-Datasets" class="anchor-icon" translate="no">
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
    </button></h2><p>للعثور على التكرارات شبه المكررة في محيط من بيانات التدريب، نحتاج إلى خوارزمية مطابقة تقريبية تتسم بالكفاءة والدقة في آنٍ واحد. تعد MinHash LSH (التجزئة الحساسة للموقع) أداة رائعة لتحقيق هذا الهدف. دعنا نحلل هذا المصطلح الذي يبدو معقدًا خطوة بخطوة.</p>
<h3 id="Step-1-Representing-Documents-with-MinHash" class="common-anchor-header">الخطوة 1: تمثيل المستندات باستخدام MinHash</h3><p>أولاً، نحتاج إلى طريقة لقياس تشابه المستندات. يستخدم النهج القياسي تشابه جاكارد:</p>
<p><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><mi>J</mi><mo stretchy="false">(</mo><mi>A</mi><mo separator="true">,</mo><mi>B</mi><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">=∣A∩B∣∣A∪B∣J(A,B) = \frac{|A\cap B|}{|A \cup B|}</annotation></semantics></math></span></span></span><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="katex-display"><span class="katex">J<span class="katex-html" aria-hidden="true"><span class="base"><span class="mopen">(</span><span class="mord mathnormal">A</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span></span></span> B<span class="katex-html" aria-hidden="true"><span class="base"><span class="mclose">)</span><span class="mspace" style="margin-right:0.2778em;"></span></span></span> =</span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="katex-display"><span class="katex"></span></span><span class="strut" style="height:2.363em;vertical-align:-0.936em;"></span> <span class="katex-display"><span class="katex"></span></span><span class="mopen nulldelimiter"></span> <span class="katex-display"><span class="katex"></span></span><span class="pstrut" style="height:3em;"></span> <span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.427em;"><span style="top:-2.314em;"><span class="mord"><span class="mord mathnormal">∣A</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">∪</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mord">B∣</span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span></span></span></span></span></span></span></span></span></span><span class="pstrut" style="height:3em;"></span> <span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.427em;"><span style="top:-3.677em;"><span class="mord"><span class="mord mathnormal">∣A</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">∩</span><span class="mspace" style="margin-right:0.2222em;"></span></span></span></span><span class="vlist-s">B∣​</span></span></span></span></span></span></span></span></span><span class="vlist-r"><span class="vlist" style="height:0.936em;"><span></span></span></span><span class="mclose nulldelimiter"></span></p>
<p>تقيس هذه الصيغة التداخل بين المستند A والمستند B - وتحديداً نسبة العناصر المشتركة إلى إجمالي العناصر الفريدة. تعني القيمة الأعلى أن المستندات أكثر تشابهًا.</p>
<p>ومع ذلك، فإن حساب ذلك مباشرةً لمليارات من أزواج المستندات يستهلك الكثير من الموارد ويستغرق سنوات. ينشئ MinHash "بصمات" (توقيعات) مدمجة تحافظ على علاقات التشابه مع جعل المقارنات أسرع بكثير.</p>
<ol>
<li><strong>التجزئة:</strong> تقسيم كل مستند إلى تسلسلات متداخلة من الكلمات أو الأحرف (k-shingles). على سبيل المثال، تنتج جملة "أحب البحث عن المتجهات" مع k=3 (حسب الكلمة): {"أحب المتجهات"، "أحب البحث عن المتجهات"}</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/shingling_858ad58efa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol start="2">
<li><strong>MinHashing:</strong> قم بتطبيق دوال تجزئة متعددة على كل مجموعة من التجزئة وسجل الحد الأدنى لقيمة التجزئة من كل دالة. ينتج عن ذلك متجه توقيع لكل مستند.</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/minhash_041003210a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>عند حساب التشابه، فإن احتمالية محاذاة قيم التجزئة في نفس المواضع في توقيعات MinHash لمستندين (وهو ما يتوافق مع مسافة جاكارد لهذه التوقيعات) يوفر تقريبًا قريبًا لتشابه جاكارد لمجموعات التجزئة الأصلية. يسمح لنا ذلك بتقدير تشابه المستندات بفعالية دون مقارنة النصوص الأصلية الأكبر مباشرةً؛ وبدلاً من ذلك، يمكننا تحليل توقيعات MinHash المدمجة الخاصة بها.</p>
<p>يتضمن مبدأ MinHash المدمج استخدام الكلمة ذات أصغر قيمة تجزئة لتمثيل المستند بأكمله، مما يعزز الدقة من خلال دمج دوال تجزئة إضافية. من المرجح أن يتم التغاضي عن التغييرات الطفيفة في الكلمات لأنها لا تؤثر عادةً على الحد الأدنى لقيمة التجزئة. في المقابل، تميل التغييرات الأكثر جوهرية إلى تغيير قيمة التجزئة ويتم اكتشافها بسهولة أكبر. يمكن النظر إلى هذه الطريقة على أنها تجميع صغير لقيم التجزئة عبر كلمات مختلفة. بالإضافة إلى MinHash، تتوفر بدائل مثل SimHash لتوليد توقيعات المستندات، ولكن لن تتم مناقشتها هنا.</p>
<h3 id="Step-2-Identifying-Similar-Documents-via-LSH" class="common-anchor-header">الخطوة 2: تحديد المستندات المتشابهة عبر LSH</h3><p>حتى مع توقيعات MinHash المدمجة، تظل مقارنة كل زوج عبر ملايين أو مليارات المستندات مكلفة حسابيًا. وهنا يأتي دور <strong>التجزئة الحساسة للموقع (LSH)</strong>.</p>
<p>تتمثل الفكرة الرئيسية للتجزئة الحساسة للموقع في استخدام دوال التجزئة التي <strong>تتسبب عن قصد في حدوث تصادمات -</strong>من المرجح أن يتم تجزئة العناصر <strong>المتشابهة</strong>في نفس الدلو، بينما لا يتم تجزئة العناصر غير المتشابهة. هذا هو عكس التجزئة التقليدية، والتي تهدف إلى تجنب التصادمات.</p>
<p>بالنسبة ل MinHash، فإن استراتيجية LSH الشائعة هي <strong>تقنية النطاقات</strong>:</p>
<ol>
<li><p><strong>النطاقات</strong>: تقسيم كل توقيع MinHash MinHash (متجه طوله <em>N</em>) إلى <em>نطاقات b،</em> كل منها يحتوي على <em>r</em> خافت<em>(N = b × r</em>).</p></li>
<li><p><strong>تجزئة النطاقات:</strong> تجزئة كل نطاق (متجه فرعي من قيم <em>r</em> ) إلى دلو باستخدام دالة تجزئة قياسية.</p></li>
<li><p><strong>الأزواج المرشحة:</strong> إذا كان هناك مستندان يشتركان في دلو في <strong>أي</strong> نطاق، يتم وضع علامة عليهما كمطابقات محتملة.</p></li>
</ol>
<p>من خلال تعديل عدد النطاقات (ب) وعدد الأبعاد لكل نطاق ®، يمكنك التحكم في المفاضلة بين الاستدعاء والدقة وكفاءة البحث.</p>
<p>الفكرة الأساسية هي: المستندات المتشابهة للغاية سيكون لها العديد من قيم التجزئة المتطابقة في توقيعات MinHash الخاصة بها. عندما يتم تقسيم هذه التواقيع إلى نطاقات، فإن نطاقًا واحدًا يحتوي على جميع القيم المتطابقة يكفي لوضع مستندين في نفس المجموعة. وكلما كانت المستندات أكثر تشابهًا، زادت احتمالية حدوث ذلك في نطاق واحد على الأقل، مما يسمح ل LSH بإظهار الأزواج المرشحة بكفاءة دون مقارنة جميع التواقيع بشكل شامل.</p>
<p>باختصار، يتيح <strong>MinHash + LSH</strong> إمكانية إلغاء البيانات المكررة التقريبية القابلة للتطوير: يقوم برنامج MinHash بضغط المستندات في توقيعات مضغوطة، ويقوم LSH بتضييق مساحة البحث بكفاءة من خلال تجميع التطابقات المحتملة. الأمر أشبه باكتشاف التوائم في حشد من الناس: أولاً، خذ لقطة سريعة لكل شخص (MinHash)، ثم قم بتجميع التوائم المتشابهة (LSH)، ثم افحص المجموعات الأصغر عن كثب بحثًا عن التكرارات الفعلية.</p>
<h2 id="Integrating-MinHash-LSH-in-Milvus-26" class="common-anchor-header">دمج MinHash MinHash LSH في Milvus 2.6<button data-href="#Integrating-MinHash-LSH-in-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>أدت الحاجة الواقعية إلى دمج MinHash LSH في Milvus 2.6. كما ذُكر سابقًا، واجهنا أحد مستخدمي Milvus - إحدى الشركات الرائدة في مجال إدارة التعلم الآلي - تحديًا يتمثل في إلغاء تكرار كميات هائلة من البيانات النصية بكفاءة من أجل التدريب المسبق على إدارة التعلم الآلي.</p>
<p>عادةً ما تعتمد خطوط أنابيب إلغاء البيانات المكررة التقليدية على أدوات خارجية منفصلة عن أنظمة التخزين والاسترجاع، مما يتطلب عمليات نقل مكلفة للبيانات بين المكونات. يزيد سير العمل المجزأ هذا من النفقات التشغيلية ويمنع الاستفادة الكاملة من موارد الحوسبة الموزعة.</p>
<p>وإدراكًا لنقاط قوة ميلفوس في التعامل مع البيانات المتجهة عالية الإنتاجية، ظهرت فكرة طبيعية: <strong><em>ماذا لو تم تضمين MinHash LSH في Milvus بشكل أصلي، مما يجعل إلغاء البيانات المكررة التقريبية ميزة قاعدة بيانات من الدرجة الأولى؟</em></strong></p>
<p>يتيح هذا النهج سير عمل كامل من إلغاء البيانات المكررة إلى الاسترجاع الدلالي داخل Milvus، مما يبسّط عمليات MLOPS مع الاستفادة من قابلية التوسع وواجهة برمجة التطبيقات الموحدة. وبالتعاون مع شريكنا، قمنا بتحسين MinHash LSH مع بنية Milvus السحابية الأصلية، مما أدى إلى حل سريع وقابل للتطوير لإلغاء البيانات المكررة على نطاق واسع.</p>
<h3 id="Core-capabilities-in-Milvus-26-include" class="common-anchor-header">تشمل القدرات الأساسية في Milvus 2.6 ما يلي:</h3><ul>
<li><p><strong>فهرسة MinHash LSH الأصلية:</strong> يطبق تقنية النطاقات القياسية ل LSH ويدعم إعادة ترتيب جاكارد الاختيارية لتحسين الاسترجاع. يوفر كلاً من التطبيقات داخل الذاكرة والتطبيقات المستندة إلى mmap لتحقيق المرونة عبر أعباء العمل المختلفة.</p></li>
<li><p><strong>تكامل سلس لواجهة برمجة التطبيقات:</strong> يمكن للمستخدمين تحديد حقول متجهات MinHash، وإنشاء فهارس <code translate="no">MINHASH_LSH</code> ، وإدراج بيانات التوقيع، وإجراء عمليات بحث تقريبية عن التشابه باستخدام مجموعة أدوات تطوير البرمجيات القياسية وواجهات برمجة التطبيقات التوضيحية الخاصة ب Milvus.</p></li>
<li><p><strong>موزعة وقابلة للتطوير:</strong> تدعم هذه الميزة المبنية على بنية Milvus السحابية الأصلية، التوسع الأفقي لمجموعات البيانات الكبيرة والمعالجة عالية الإنتاجية.</p></li>
</ul>
<p>حقق هذا التكامل نتائج مبهرة. من خلال تشغيل MinHash LSH على Milvus<a href="https://zilliz.com/cloud">(Zilliz Cloud</a>) المُدارة بالكامل، ساعدنا هذا المستخدم على إلغاء تكرار <strong>10 مليارات مستند</strong> بكفاءة. ومقارنةً بنهجهم السابق القائم على MapReduce، ضاعف الحل الجديد <strong>سرعة المعالجة أكثر من الضعف</strong> وحقق <strong>وفورات في التكاليف بمعدل 3-5 أضعاف،</strong> وذلك بفضل فهرسة Milvus المحسّنة وتنفيذ الاستعلامات.</p>
<h2 id="Hands-On-Deduplicating-LLM-Datasets-Using-Milvus" class="common-anchor-header">التدريب العملي: إلغاء تكرار مجموعات بيانات LLM باستخدام Milvus<button data-href="#Hands-On-Deduplicating-LLM-Datasets-Using-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>دعونا نشمّر عن سواعدنا ونستخدم MinHash LSH في Milvus 2.6 لإجراء إلغاء البيانات المكررة على نطاق واسع.</p>
<h3 id="Prerequisite-Generating-MinHash-Signatures" class="common-anchor-header">المتطلبات الأساسية: إنشاء توقيعات MinHash MinHash</h3><p>يتعامل Milvus مع الفهرسة والبحث في توقيعات MinHash <strong>التي تم إنشاؤها مسبقًا</strong>. ستحتاج إلى إنشاء هذه التواقيع أثناء المعالجة المسبقة باستخدام أدوات مثل <code translate="no">datasketch</code> في Python أو تطبيق مخصص. الخطوات النموذجية هي</p>
<ol>
<li><p>قراءة المستندات الخام</p></li>
<li><p>تجزئة كل مستند (ترميز أو تجزئة)</p></li>
<li><p>تطبيق دوال تجزئة متعددة لتوليد توقيع MinHash (على سبيل المثال، مصفوفة uint64 بحجم 128)</p></li>
</ol>
<pre><code translate="no"><span class="hljs-keyword">from</span> datasketch <span class="hljs-keyword">import</span> MinHash

text = <span class="hljs-string">&quot;example text for minhash signature&quot;</span>
tokens = text.lower().split()  <span class="hljs-comment"># Step 1 &amp; 2: preprocess + tokenize/shingle</span>
mh = MinHash(num_perm=<span class="hljs-number">128</span>)     <span class="hljs-comment"># Step 3: initialize MinHash</span>
<span class="hljs-keyword">for</span> token <span class="hljs-keyword">in</span> tokens:
    mh.update(token.encode(<span class="hljs-string">&#x27;utf-8&#x27;</span>))  <span class="hljs-comment"># Add shingles to MinHash</span>
signature = mh.hashvalues  <span class="hljs-comment"># This is your MinHash signature (128-dimensional)</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-1-Create-a-Schema-in-Milvus" class="common-anchor-header">الخطوة 1: إنشاء مخطط في ميلفوس</h3><p>نحن بحاجة إلى إنشاء مجموعة Milvus لتخزين توقيعات MinHash ومعرفات المستندات المقابلة لها.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> DataType
MILVUS_URI = <span class="hljs-string">&quot;localhost:19530&quot;</span>
COLLECTION_NAME = <span class="hljs-string">&quot;llm_data_dedup_minhash&quot;</span>
MINHASH_DIM = <span class="hljs-number">128</span>
MINHASH_BIT_WIDTH = <span class="hljs-number">64</span> <span class="hljs-comment"># Assuming 64-bit hash values</span>

<span class="hljs-comment"># Load data from NPY file</span>
base = np.load(<span class="hljs-string">&#x27;minhash_vectors.npy&#x27;</span>)
ids = [<span class="hljs-built_in">str</span>(i) <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(base.shape[<span class="hljs-number">0</span>])]  <span class="hljs-comment"># Generate string IDs</span>

client = MilvusClient(uri=MILVUS_URI)
<span class="hljs-comment"># Check and drop existing collection if needed</span>
<span class="hljs-keyword">if</span> collection_name <span class="hljs-keyword">in</span> client.list_collections():
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection <span class="hljs-subst">{collection_name}</span> exists, dropping it...&quot;</span>)
    client.drop_collection(collection_name)
<span class="hljs-comment"># Create collection schema</span>
schema = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">False</span>,
    enable_dynamic_field=<span class="hljs-literal">False</span>,
)

schema.add_field(field_name=<span class="hljs-string">&quot;input_id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;minhash&quot;</span>, datatype=DataType.BINARY_VECTOR, dim=MINHASH_DIM * MINHASH_BIT_WIDTH)
schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">200</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Create-the-MINHASHLSH-Index-and-Collection" class="common-anchor-header"><strong>الخطوة 2: إنشاء فهرس MINHASH_LSH والمجموعة</strong></h3><p>هذه هي الخطوة الأساسية. نحتاج إلى تحديد JACCARD كنوع القياس وتكوين المعلمات المتعلقة بـ LSH.</p>
<pre><code translate="no">INDEX_FIELD_NAME = <span class="hljs-string">&quot;minhash_signature&quot;</span>
<span class="hljs-comment"># Metric type, should be JACCARD for MinHash LSH</span>
METRIC_TYPE = <span class="hljs-string">&quot;MHJACCARD&quot;</span>
INDEX_TYPE = <span class="hljs-string">&quot;MINHASH_LSH&quot;</span>
MINHASH_DIM = <span class="hljs-number">128</span>
MINHASH_BIT_WIDTH = <span class="hljs-number">64</span> <span class="hljs-comment"># Assuming 64-bit hash values</span>

index_params = MilvusClient.prepare_index_params()

index_params.add_index(
    field_name=INDEX_FIELD_NAME,
    index_type=INDEX_TYPE,
    metric_type=METRIC_TYPE,
    params={
        <span class="hljs-comment"># LSH-specific parameters might be configured here, e.g.:</span>
        <span class="hljs-comment"># &quot;band&quot;: 32, # Hypothetical parameter: number of bands</span>
        <span class="hljs-comment"># &quot;element_bit_width&quot;: 64 # Bit width of minhash values</span>
    }
)
<span class="hljs-comment"># Create collection</span>
client.create_collection(
    collection_name=collection_name,
    schema=schema,
    index_params=index_params
)
<button class="copy-code-btn"></button></code></pre>
<p>ملاحظة حول ضبط المعلمة: تعتمد فعالية MinHash LSH بشكل كبير على خيارات المعلمات. على سبيل المثال، يؤثر عدد دوال التجزئة المستخدمة أثناء إنشاء توقيع MinHash (أي <code translate="no">MINHASH_DIM</code>) على دقة التوقيع وحجمه. في مرحلة LSH، يحدد عدد النطاقات (<code translate="no">num_bands</code>) والصفوف لكل نطاق معًا نطاق حساسية عتبة التشابه والتوازن بين الاستدعاء والدقة. يحتاج المستخدمون إلى التجربة والضبط الدقيق بناءً على خصائص مجموعة البيانات الخاصة بهم ومتطلبات إلغاء التكرار. غالبًا ما تكون هذه عملية تكرارية.</p>
<h3 id="Step-3-Insert-MinHash-Signatures" class="common-anchor-header"><strong>الخطوة 3: إدراج تواقيع MinHash الصغيرة</strong></h3><p>لنفترض أن لديك مجموعة من المستندات وتوقيعات MinHash المقابلة لها.</p>
<pre><code translate="no"><span class="hljs-comment"># Insert data in batches</span>
batch_size = <span class="hljs-number">2000</span>
total_records = base.shape[<span class="hljs-number">0</span>]
num_batches = (total_records + batch_size - <span class="hljs-number">1</span>) // batch_size

<span class="hljs-keyword">for</span> batch_idx <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(num_batches):
    start = batch_idx * batch_size
    end = <span class="hljs-built_in">min</span>((batch_idx + <span class="hljs-number">1</span>) * batch_size, total_records)
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserting batch <span class="hljs-subst">{batch_idx + <span class="hljs-number">1</span>}</span>/<span class="hljs-subst">{num_batches}</span> (records <span class="hljs-subst">{start}</span>-<span class="hljs-subst">{end}</span>)&quot;</span>)
    
    <span class="hljs-comment"># Prepare batch data</span>
    batch_data = [{
        <span class="hljs-string">&quot;input_id&quot;</span>: i,
        <span class="hljs-string">&quot;minhash&quot;</span>: base[i].tobytes(),
        <span class="hljs-string">&quot;id&quot;</span>: ids[i]
    } <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(start, end)]
    
    <span class="hljs-comment"># Insert batch</span>
    client.insert(collection_name, batch_data)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Data insertion complete&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-5-Search-for-Near-Duplicates" class="common-anchor-header">الخطوة 5: ابحث عن التكرارات القريبة التكرار</h3><p>استخدم توقيع MinHash الخاص بالمستند للبحث عن المستندات المتشابهة في المجموعة.</p>
<pre><code translate="no"><span class="hljs-comment"># Perform search</span>
search_vectors = [vec.tobytes() <span class="hljs-keyword">for</span> vec <span class="hljs-keyword">in</span> base[:<span class="hljs-number">10</span>]]
results = client.search(
    collection_name, 
    data=search_vectors, 
    param={<span class="hljs-string">&quot;metric_type&quot;</span>: METRIC_TYPE, <span class="hljs-string">&quot;params&quot;</span>: search_params_lsh},
    limit=<span class="hljs-number">1</span>, 
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>])

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results:&quot;</span>)
<span class="hljs-keyword">for</span> i, result <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results):
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Query <span class="hljs-subst">{i}</span>:&quot;</span>)
    <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> result:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  - ID: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;id&#x27;</span>]}</span>, Distance: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-6-Post-Processing-and-Clustering" class="common-anchor-header">الخطوة 6: المعالجة اللاحقة والتجميع</h3><p>النتائج التي تم إرجاعها هي <strong>مستندات شبه مكررة مرشحة</strong>. لتكوين مجموعات إلغاء التكرار الكاملة، يمكنك تطبيق تقنيات التجميع مثل <strong>Union-Find</strong> على الأزواج المرشحة. تمثل كل مجموعة ناتجة مجموعة من التكرارات؛ احتفظ بمستند تمثيلي واحد وقم بأرشفة أو إزالة الباقي.</p>
<h2 id="Conclusion" class="common-anchor-header"><strong>الخاتمة</strong><button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>تُعد MinHash LSH في Milvus 2.6 قفزة إلى الأمام في معالجة بيانات الذكاء الاصطناعي. ما بدأ كحل لإلغاء البيانات المكررة LLM يفتح الآن الأبواب لحالات استخدام أوسع - تنظيف محتوى الويب وإدارة الكتالوجات واكتشاف الانتحال والمزيد.</p>
<p>إذا كانت لديك حالة استخدام مماثلة، يُرجى التواصل معنا على موقع <a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord</a> للتسجيل في <a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour">اجتماع ساعة العمل</a>.</p>
