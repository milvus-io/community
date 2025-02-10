---
id: i-built-a-deep-research-with-open-source-so-can-you.md
title: لقد بنيت بحثًا عميقًا باستخدام المصادر المفتوحة - ويمكنك ذلك أيضًا!
author: Stefan Webb
date: 2025-02-6
desc: >-
  تعرّف على كيفية إنشاء وكيل على غرار البحث العميق باستخدام أدوات مفتوحة المصدر
  مثل Milvus وDebSeek R1 وLangChain.
cover: >-
  assets.zilliz.com/I_Built_a_Deep_Research_with_Open_Source_and_So_Can_You_7eb2a38078.png
tag: Tutorials
tags: 'Deep Research, open source AI, Milvus, LangChain, DeepSeek R1'
recommend: true
canonicalUrl: 'https://milvus.io/blog/i-built-a-deep-research-with-open-source-so-can-you.md'
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deep_research_blog_image_95225226eb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>حسناً، في الواقع، وكيل محدود النطاق يمكنه التفكير والتخطيط واستخدام الأدوات وما إلى ذلك لإجراء بحث باستخدام ويكيبيديا. ومع ذلك، ليس سيئًا لبضع ساعات من العمل...</p>
<p>ما لم تكن مقيمًا تحت صخرة، أو في كهف، أو في دير جبلي بعيد، فستكون قد سمعت عن إطلاق OpenAI لـ OpenAI لـ <em>Deep Research</em> في 2 فبراير 2025. يعد هذا المنتج الجديد بإحداث ثورة في كيفية إجابتنا على الأسئلة التي تتطلب تجميع كميات كبيرة من المعلومات المتنوعة.</p>
<p>تكتب استفسارك، وتحدد خيار البحث العميق، وتقوم المنصة بالبحث في الويب بشكل مستقل، وتقوم بإجراء الاستدلال على ما تكتشفه، وتجمع مصادر متعددة في تقرير متماسك ومقتبس بالكامل. يستغرق الأمر عدة أوامر من حيث الحجم لإنتاج مخرجاته مقارنةً بروبوت الدردشة الآلي القياسي، ولكن النتيجة تكون أكثر تفصيلاً وأكثر استنباطاً ودقة.</p>
<h2 id="How-does-it-work" class="common-anchor-header">كيف تعمل هذه التقنية؟<button data-href="#How-does-it-work" class="anchor-icon" translate="no">
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
    </button></h2><p>ولكن كيف تعمل هذه التقنية، ولماذا تُعد تقنية البحث العميق تحسناً ملحوظاً مقارنةً بالمحاولات السابقة (مثل <em>البحث العميق</em> من جوجل - تنبيه وارد بشأن نزاع على علامة تجارية)؟ سنترك هذا الأخير لمنشور مستقبلي. أما بالنسبة للسابق، فلا شك أن هناك الكثير من "الصلصة السرية" الكامنة وراء Deep Research. يمكننا أن نستخلص بعض التفاصيل من منشور إصدار OpenAI، والذي ألخصه فيما يلي.</p>
<p><strong>يستغل Deep Research التطورات الحديثة في النماذج التأسيسية المتخصصة في مهام الاستدلال:</strong></p>
<ul>
<li><p>"... تم ضبطه على نموذج الاستدلال OpenAI o3 القادم..."</p></li>
<li><p>"... يستفيد من الاستدلال للبحث في كميات هائلة من النصوص وتفسيرها وتحليلها..."</p></li>
</ul>
<p><strong>يستخدم "البحث العميق" سير عمل وكيلي متطور مع التخطيط والتفكير والذاكرة:</strong></p>
<ul>
<li><p>"... تعلّم تخطيط وتنفيذ مسار متعدد الخطوات..."</p></li>
<li><p>"... التراجع والتفاعل مع المعلومات في الوقت الفعلي..."</p></li>
<li><p>"... التمحور حسب الحاجة كرد فعل على المعلومات التي تواجهها..."</p></li>
</ul>
<p><strong>يتم تدريب برنامج Deep Research على بيانات خاصة باستخدام عدة أنواع من الضبط الدقيق، وهو على الأرجح عنصر أساسي في أدائه:</strong></p>
<ul>
<li><p>"... تم تدريبه باستخدام التعلّم المعزز الشامل على مهام التصفح والاستدلال الصعبة عبر مجموعة من المجالات..."</p></li>
<li><p>"... مُحسّن لتصفح الويب وتحليل البيانات..."</p></li>
</ul>
<p>إن التصميم الدقيق لسير عمل الوكيل هو سر، ومع ذلك، يمكننا بناء شيء ما بأنفسنا استنادًا إلى أفكار راسخة حول كيفية هيكلة الوكلاء.</p>
<p><strong>ملاحظة واحدة قبل أن نبدأ</strong>: من السهل أن تنجرف وراء حمى الذكاء الاصطناعي التوليدي، خاصةً عندما يتم إصدار منتج جديد يبدو أنه خطوة في التحسين. ومع ذلك، فإن الأبحاث العميقة، كما تقر OpenAI، لها قيود مشتركة بين تقنيات الذكاء الاصطناعي التوليدي. يجب أن نتذكر أن نفكر بشكل نقدي في المخرجات من حيث أنها قد تحتوي على حقائق خاطئة ("هلوسات")، وتنسيق واستشهادات غير صحيحة، وتختلف بشكل كبير في الجودة بناءً على البذرة العشوائية.</p>
<h2 id="Can-I-build-my-own" class="common-anchor-header">هل يمكنني بناء ما يخصني؟<button data-href="#Can-I-build-my-own" class="anchor-icon" translate="no">
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
    </button></h2><p>بالتأكيد! دعونا نبني "بحثنا العميق" الخاص بنا، يعمل محليًا وباستخدام أدوات مفتوحة المصدر. سوف نتسلح فقط بمعرفة أساسية بالذكاء الاصطناعي التوليدي، والحس السليم، وبضع ساعات عمل إضافية، ووحدة معالجة الرسومات، <a href="https://milvus.io/docs">وMilvus</a> <a href="https://huggingface.co/unsloth/DeepSeek-R1-Distill-Llama-8B-unsloth-bnb-4bit">وDebSeek R1</a> <a href="https://python.langchain.com/docs/introduction/">وLangChain</a> مفتوحة المصدر.</p>
<p>لا يمكننا أن نأمل في تكرار أداء OpenAI بالطبع، ولكن نموذجنا الأولي سيُظهر بالحد الأدنى بعض الأفكار الرئيسية التي من المحتمل أن تكون وراء تقنيتهم، حيث يجمع بين التقدم في نماذج التفكير مع التقدم في سير العمل العميل. والأهم من ذلك، وعلى عكس OpenAI، سنستخدم أدوات مفتوحة المصدر فقط، وسنكون قادرين على نشر نظامنا محلياً - فالمصدر المفتوح يوفر لنا مرونة كبيرة بالتأكيد!</p>
<p>سنضع بعض الافتراضات المبسطة لتقليل نطاق مشروعنا:</p>
<ul>
<li><p>سنستخدم وضع استدلالي مفتوح المصدر تم تقطيره ثم <a href="https://zilliz.com/learn/unlock-power-of-vector-quantization-techniques-for-efficient-data-compression-and-retrieval">تكميمه</a> لـ 4 بت يمكن تشغيله محلياً.</p></li>
<li><p>لن نقوم بإجراء ضبط إضافي على نموذج الاستدلال الخاص بنا بأنفسنا.</p></li>
<li><p>الأداة الوحيدة التي يمتلكها وكيلنا هي القدرة على تنزيل صفحة ويكيبيديا وقراءتها وإجراء استعلامات RAG منفصلة (لن يكون لدينا إمكانية الوصول إلى الويب بالكامل).</p></li>
<li><p>سيعالج وكيلنا البيانات النصية فقط، وليس الصور وملفات PDF، إلخ.</p></li>
<li><p>لن يتراجع وكيلنا أو يأخذ في الاعتبار المحاور.</p></li>
<li><p>سيتحكم وكيلنا (ليس بعد) في تدفق التنفيذ الخاص به بناءً على مخرجاته.</p></li>
<li><p>تحتوي ويكيبيديا على الحقيقة والحقيقة الكاملة ولا شيء غير الحقيقة.</p></li>
</ul>
<p>سنستخدم <a href="https://milvus.io/docs">Milvus</a> لقاعدة بياناتنا المتجهة، <a href="https://huggingface.co/unsloth/DeepSeek-R1-Distill-Llama-8B-unsloth-bnb-4bit">وDeepSeek R1</a> كنموذج استدلالي لدينا، <a href="https://python.langchain.com/docs/introduction/">وLangChain</a> لتنفيذ RAG. لنبدأ!</p>
<custom-h1>وكيل الحد الأدنى للبحث عبر الإنترنت</custom-h1><p>سنستخدم نموذجنا الذهني لكيفية إجراء البشر للبحث لتصميم سير عمل الوكيل:</p>
<h3 id="DefineRefine-Question" class="common-anchor-header">تحديد/تحديد السؤال</h3><p>يبدأ البحث بتحديد السؤال. نعتبر أن السؤال هو استفسار المستخدم، ومع ذلك، فإننا نستخدم نموذجنا المنطقي لضمان التعبير عن السؤال بطريقة محددة وواضحة ومركزة. أي أن خطوتنا الأولى هي إعادة كتابة المطالبة واستخراج أي استفسارات فرعية أو أسئلة فرعية. نحن نستفيد بشكل فعال من تخصص نماذجنا الأساسية للتفكير، وطريقة بسيطة للإخراج المنظم JSON.</p>
<p>فيما يلي مثال على تتبع الاستدلال حيث يقوم DeepSeek بتنقيح السؤال "كيف تغيرت الجبيرة بمرور الوقت؟</p>
<pre><code translate="no" class="language-text">&lt;think&gt;

Alright, so I need to <span class="hljs-built_in">break</span> down the question <span class="hljs-string">&quot;How has the cast changed over time?&quot;</span> related to the evolution of The Simpsons. Let me think about what aspects are involved here.

First, I know that the cast has changed a lot, but I need to figure out the intermediate questions to approach this. The main question is about changes <span class="hljs-keyword">in</span> the cast over <span class="hljs-keyword">time</span>, so I should consider different areas that contribute to this change.

I guess the first sub-question would be about the original cast members. Who were the main voices and how did they evolve? Then, there might be new cast additions over the years, so another sub-question about that.

Also, some original voice actors have left, so I should include a sub-question about departures. Then, new voice actors joining would be another point.

The show has been popular <span class="hljs-keyword">for</span> a long <span class="hljs-keyword">time</span>, so recurring roles changing might be another aspect. Additionally, the role of the show <span class="hljs-keyword">in</span> society might have influenced casting choices, so a sub-question about that.

Lastly, the overall impact on the cast<span class="hljs-string">&#x27;s careers could be another angle. So, I should list these as sub-questions to cover all aspects.

&lt;/think&gt;
</span><button class="copy-code-btn"></button></code></pre>
<h3 id="Search" class="common-anchor-header">بحث</h3><p>بعد ذلك، نجري "مراجعة أدبية" لمقالات ويكيبيديا. في الوقت الراهن، نقرأ مقالًا واحدًا ونترك التنقل بين الروابط إلى تكرار مستقبلي. اكتشفنا أثناء وضع النماذج الأولية أن استكشاف الروابط يمكن أن يصبح مكلفًا للغاية إذا كان كل رابط يتطلب استدعاءً لنموذج الاستدلال. نقوم بتحليل المقالة وتخزين بياناتها في قاعدة بياناتنا المتجهة، Milvus، على غرار تدوين الملاحظات.</p>
<p>فيما يلي مقتطف شيفرة توضح كيف نخزن صفحة ويكيبيديا في ميلفوس باستخدام تكاملها مع لانغ تشين:</p>
<pre><code translate="no" class="language-python">wiki_wiki = wikipediaapi.Wikipedia(user_agent=<span class="hljs-string">&#x27;MilvusDeepResearchBot (&lt;insert your email&gt;)&#x27;</span>, language=<span class="hljs-string">&#x27;en&#x27;</span>)
page_py = wiki_wiki.page(page_title)

text_splitter = RecursiveCharacterTextSplitter(chunk_size=<span class="hljs-number">2000</span>, chunk_overlap=<span class="hljs-number">200</span>)
docs = text_splitter.create_documents([page_py.text])

vectorstore = Milvus.from_documents(  <span class="hljs-comment"># or Zilliz.from_documents</span>
    documents=docs,
    embedding=embeddings,
    connection_args={
        <span class="hljs-string">&quot;uri&quot;</span>: <span class="hljs-string">&quot;./milvus_demo.db&quot;</span>,
    },
    drop_old=<span class="hljs-literal">True</span>, 
    index_params={
        <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>,
        <span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;FLAT&quot;</span>,  
        <span class="hljs-string">&quot;params&quot;</span>: {},
    },
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Analyze" class="common-anchor-header">تحليل</h3><p>يعود الوكيل إلى أسئلته ويجيب عليها بناءً على المعلومات ذات الصلة في المستند. سنترك سير عمل التحليل/التفكير متعدد الخطوات للعمل المستقبلي، بالإضافة إلى أي تفكير نقدي حول مصداقية مصادرنا وتحيزها.</p>
<p>فيما يلي مقتطف كود يوضّح إنشاء RAG باستخدام LangChain والإجابة على أسئلتنا الفرعية بشكل منفصل.</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># Define the RAG chain for response generation</span>
rag_chain = (
    {<span class="hljs-string">&quot;context&quot;</span>: retriever | format_docs, <span class="hljs-string">&quot;question&quot;</span>: RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

<span class="hljs-comment"># Prompt the RAG for each question</span>
answers = {}
total = <span class="hljs-built_in">len</span>(leaves(breakdown))

pbar = tqdm(total=total)
<span class="hljs-keyword">for</span> k, v <span class="hljs-keyword">in</span> breakdown.items():
    <span class="hljs-keyword">if</span> v == []:
        <span class="hljs-built_in">print</span>(k)
        answers[k] = rag_chain.invoke(k).split(<span class="hljs-string">&#x27;&lt;/think&gt;&#x27;</span>)[-<span class="hljs-number">1</span>].strip()
        pbar.update(<span class="hljs-number">1</span>)
    <span class="hljs-keyword">else</span>:
        <span class="hljs-keyword">for</span> q <span class="hljs-keyword">in</span> v:
            <span class="hljs-built_in">print</span>(q)
            answers[q] = rag_chain.invoke(q).split(<span class="hljs-string">&#x27;&lt;/think&gt;&#x27;</span>)[-<span class="hljs-number">1</span>].strip()
            pbar.update(<span class="hljs-number">1</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Synthesize" class="common-anchor-header">التوليف</h3><p>بعد أن ينجز الوكيل بحثه، ينشئ مخططًا منظمًا، أو بالأحرى هيكلًا هيكليًا للنتائج التي توصل إليها لتلخيصها في تقرير. ثم يكمل بعد ذلك كل قسم، ويملأه بعنوان القسم والمحتوى المقابل. نترك سير عمل أكثر تعقيدًا مع التفكير وإعادة الترتيب وإعادة الكتابة لتكرار مستقبلي. يتضمن هذا الجزء من العامل التخطيط واستخدام الأداة والذاكرة.</p>
<p>انظر <a href="https://drive.google.com/file/d/1waKX_NTgiY-47bYE0cI6qD8Cjn3zjrL6/view?usp=sharing">دفتر الملاحظات المرفق</a> للاطلاع على الشيفرة الكاملة <a href="https://drive.google.com/file/d/15xeEe_EqY-29V2IlAvDy5yGdJdEPSHOh/view?usp=drive_link">وملف التقرير المحفوظ</a> للحصول على مثال على المخرجات.</p>
<h2 id="Results" class="common-anchor-header">النتائج<button data-href="#Results" class="anchor-icon" translate="no">
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
    </button></h2><p>استفسارنا للاختبار هو <em>"كيف تغيرت عائلة سمبسون مع مرور الوقت؟"</em> ومصدر البيانات هو مقالة ويكيبيديا عن "عائلة سمبسون". فيما يلي قسم واحد من <a href="https://drive.google.com/file/d/15xeEe_EqY-29V2IlAvDy5yGdJdEPSHOh/view?usp=sharing">التقرير الذي تم إنشاؤه</a>:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/result_query_424beba224.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Summary-What-we-built-and-what’s-next" class="common-anchor-header">ملخص: ما بنيناه وما هو التالي<button data-href="#Summary-What-we-built-and-what’s-next" class="anchor-icon" translate="no">
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
    </button></h2><p>في غضون ساعاتٍ قليلة، قمنا بتصميم سير عملٍ أساسيٍ عميلٍ يمكن أن يستنتج ويخطط ويسترجع المعلومات من ويكيبيديا لإنشاء تقرير بحثي منظم. على الرغم من أن هذا النموذج الأولي بعيدٌ كل البعد عن OpenAI's Deep Research، إلا أنه يوضح قوة الأدوات مفتوحة المصدر مثل Milvus وDebSeek وLangChain في بناء وكلاء بحث مستقلين.</p>
<p>بالطبع، هناك مجال كبير للتحسين. يمكن للتكرارات المستقبلية</p>
<ul>
<li><p>التوسع إلى ما هو أبعد من ويكيبيديا للبحث في مصادر متعددة بشكل ديناميكي</p></li>
<li><p>إدخال التتبع العكسي والتفكير لتحسين الاستجابات</p></li>
<li><p>تحسين تدفق التنفيذ بناءً على تفكير الوكيل نفسه</p></li>
</ul>
<p>يمنحنا المصدر المفتوح المرونة والتحكم الذي لا يمنحه المصدر المغلق. سواء للبحث الأكاديمي، أو لتوليف المحتوى، أو المساعدة المدعومة بالذكاء الاصطناعي، فإن بناء وكلاء البحث الخاص بنا يفتح لنا إمكانيات مثيرة. ترقبوا المنشور التالي حيث نستكشف إضافة استرجاع الويب في الوقت الحقيقي، والاستدلال متعدد الخطوات، وتدفق التنفيذ المشروط!</p>
<h2 id="Resources" class="common-anchor-header">الموارد<button data-href="#Resources" class="anchor-icon" translate="no">
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
<li><p>دفتر الملاحظات <em>"</em><a href="https://colab.research.google.com/drive/1W5tW8SqWXve7ZwbSb9pVdbt5R2wq105O?usp=sharing"><em>خط الأساس لأبحاث عميقة مفتوحة المصدر</em></a><em>"</em></p></li>
<li><p>تقرير<a href="https://drive.google.com/file/d/15xeEe_EqY-29V2IlAvDy5yGdJdEPSHOh/view?usp=drive_link"><em>"تطور مسلسل عائلة سمبسون كبرنامج على مر الزمن، ويغطي التغييرات في المحتوى، والفكاهة، وتطوير الشخصيات، والرسوم المتحركة، ودورها في المجتمع.</em></a><em>"</em></p></li>
<li><p><a href="https://milvus.io/docs">وثائق قاعدة بيانات ميلفوس المتجهة</a></p></li>
<li><p><a href="https://huggingface.co/unsloth/DeepSeek-R1-Distill-Llama-8B-unsloth-bnb-4bit">صفحة نموذج DeepSeek R1 المقطرة والمقيسة كمياً</a></p></li>
<li><p><a href="https://python.langchain.com/docs/introduction/">️🔗 LangChain</a></p></li>
<li><p><a href="https://help.openai.com/en/articles/10500283-deep-research-faq">الأسئلة الشائعة حول البحث العميق | مركز مساعدة OpenAI</a></p></li>
</ul>
