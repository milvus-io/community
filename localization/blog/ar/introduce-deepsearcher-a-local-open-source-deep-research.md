---
id: introduce-deepsearcher-a-local-open-source-deep-research.md
title: 'تقديم DeepSearcher: بحث عميق محلي مفتوح المصدر ومفتوح المصدر'
author: Stefan Webb
date: 2025-02-21T00:00:00.000Z
desc: >-
  على النقيض من OpenAI's Deep Research، تم تشغيل هذا المثال محلياً، باستخدام
  نماذج وأدوات مفتوحة المصدر فقط مثل Milvus وLangChain.
cover: >-
  assets.zilliz.com/Introducing_Deep_Searcher_A_Local_Open_Source_Deep_Research_4d00da5b85.png
tag: Announcements
tags: DeepSearcher
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/introduce-deepsearcher-a-local-open-source-deep-research
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/deep_researcher_a0170dadd0.gif" alt="DeepSearcher" class="doc-image" id="deepsearcher" />
   </span> <span class="img-wrapper"> <span>DeepSearcher</span> </span></p>
<p>في المقالة السابقة <a href="https://milvus.io/blog/i-built-a-deep-research-with-open-source-so-can-you.md"><em>"لقد بنيت بحثًا عميقًا باستخدام المصدر المفتوح - ويمكنك ذلك أيضًا!"،</em></a> شرحنا بعض المبادئ التي يقوم عليها وكلاء البحث وأنشأنا نموذجًا أوليًا بسيطًا يولد تقارير مفصلة عن موضوع أو سؤال معين. أوضح المقال والمفكرة المقابلة المفاهيم الأساسية <em>لاستخدام الأداة،</em> <em>وتحلل الاستعلام،</em> <em>والاستدلال،</em> <em>والتفكير</em>. المثال في مقالنا السابق، على النقيض من OpenAI's Deep Research، تم تشغيله محليًا، باستخدام نماذج وأدوات مفتوحة المصدر فقط مثل <a href="https://milvus.io/docs">Milvus</a> وLangChain. (أشجعك على قراءة <a href="https://milvus.io/blog/i-built-a-deep-research-with-open-source-so-can-you.md">المقال أعلاه</a> قبل المتابعة).</p>
<p>في الأسابيع التالية، كان هناك انفجار في الاهتمام بفهم وإعادة إنتاج OpenAI's Deep Research. انظر، على سبيل المثال، <a href="https://www.perplexity.ai/hub/blog/introducing-perplexity-deep-research">Perplexity Deep Research</a> <a href="https://huggingface.co/blog/open-deep-research">وHugging Face's OpenResearch DeepResearch</a>. تختلف هذه الأدوات من حيث البنية والمنهجية على الرغم من اشتراكها في الهدف: البحث التكراري عن موضوع أو سؤال من خلال تصفح الويب أو المستندات الداخلية وإخراج تقرير مفصل ومستنير ومنظم بشكل جيد. والأهم من ذلك، يقوم العامل الأساسي بأتمتة التفكير في الإجراء الذي يجب اتخاذه في كل خطوة وسيطة.</p>
<p>في هذا المنشور، نبني على منشورنا السابق ونقدم مشروع Zilliz's <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a> مفتوح المصدر. يوضح وكيلنا مفاهيم إضافية: <em>توجيه الاستعلام، وتدفق التنفيذ المشروط،</em> <em>والزحف على الويب كأداة</em>. يتم تقديمه كمكتبة بايثون وأداة سطر أوامر بدلاً من دفتر ملاحظات Jupyter، وهو أكثر اكتمالاً من منشورنا السابق. على سبيل المثال، يمكنه إدخال مستندات مصدر متعددة ويمكنه تعيين نموذج التضمين وقاعدة بيانات المتجهات المستخدمة عبر ملف تهيئة. على الرغم من أن DeepSearcher لا يزال بسيطًا نسبيًا، إلا أنه يعد عرضًا رائعًا لـ RAG العميل وخطوة أخرى نحو أحدث تطبيقات الذكاء الاصطناعي.</p>
<p>بالإضافة إلى ذلك، نستكشف الحاجة إلى خدمات استدلال أسرع وأكثر كفاءة. تستفيد النماذج الاستدلالية من "توسيع نطاق الاستدلال"، أي العمليات الحسابية الإضافية، لتحسين مخرجاتها، وهذا بالإضافة إلى حقيقة أن تقريرًا واحدًا قد يتطلب مئات أو آلاف المكالمات من LLM ينتج عنه أن يكون عرض النطاق الترددي للاستدلال هو عنق الزجاجة الأساسي. نحن نستخدم <a href="https://sambanova.ai/press/fastest-deepseek-r1-671b-with-highest-efficiency">نموذج الاستدلال DeepSeek-R1 على أجهزة SambaNova المصممة خصيصاً</a> لهذا الغرض، والتي تبلغ سرعتها ضعف سرعة إخراج الرموز في الثانية مقارنةً بأقرب منافس (انظر الشكل أدناه).</p>
<p>كما توفر SambaNova Cloud أيضاً خدمة الاستدلال كخدمة لنماذج أخرى مفتوحة المصدر بما في ذلك Llama 3.x و Qwen2.5 و QwQ. تعمل خدمة الاستدلال على شريحة مخصصة من SambaNova تسمى وحدة تدفق البيانات القابلة لإعادة التشكيل (RDU)، وهي مصممة خصيصًا للاستدلال الفعال على نماذج الذكاء الاصطناعي التوليدي، مما يقلل التكلفة ويزيد من سرعة الاستدلال. <a href="https://sambanova.ai/technology/sn40l-rdu-ai-chip">اكتشف المزيد على موقعهم الإلكتروني.</a></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Output_speed_deepseek_r1_d820329f0a.png" alt="Output Speed- DeepSeek R1" class="doc-image" id="output-speed--deepseek-r1" />
   </span> <span class="img-wrapper"> <span>سرعة الإخراج - DeepSeek R1</span> </span></p>
<h2 id="DeepSearcher-Architecture" class="common-anchor-header">هندسة DeepSearcher المعمارية<button data-href="#DeepSearcher-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>تتبع هندسة <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a> معمارية <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a> ما نشرناه سابقًا من خلال تقسيم المشكلة إلى أربع خطوات - <em>تحديد/تحديد السؤال،</em> <em>البحث،</em> <em>التحليل،</em> <em>التوليف</em> - وإن كان هذه المرة مع بعض التداخل. نستعرض كل خطوة، مع تسليط الضوء على تحسينات <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/deepsearcher_architecture_088c7066d1.png" alt="DeepSearcher Architecture" class="doc-image" id="deepsearcher-architecture" />
   </span> <span class="img-wrapper"> <span>بنية الباحث العميق</span> </span></p>
<h3 id="Define-and-Refine-the-Question" class="common-anchor-header">تحديد السؤال وصقله</h3><pre><code translate="no" class="language-txt">Break down the original query <span class="hljs-keyword">into</span> <span class="hljs-keyword">new</span> sub queries: [
  <span class="hljs-string">&#x27;How has the cultural impact and societal relevance of The Simpsons evolved from its debut to the present?&#x27;</span>,
  <span class="hljs-string">&#x27;What changes in character development, humor, and storytelling styles have occurred across different seasons of The Simpsons?&#x27;</span>, 
  <span class="hljs-string">&#x27;How has the animation style and production technology of The Simpsons changed over time?&#x27;</span>,
  <span class="hljs-string">&#x27;How have audience demographics, reception, and ratings of The Simpsons shifted throughout its run?&#x27;</span>]
<button class="copy-code-btn"></button></code></pre>
<p>في تصميم DeepSearcher، تكون الحدود بين البحث عن السؤال وصقله غير واضحة. يتحلل استعلام المستخدم الأولي إلى استعلامات فرعية، كما في المنشور السابق. انظر أعلاه للاطلاع على الاستفسارات الفرعية الأولية الناتجة عن الاستعلام "كيف تغيرت عائلة سمبسون مع مرور الوقت؟ ومع ذلك، ستستمر خطوة البحث التالية في تنقيح السؤال حسب الحاجة.</p>
<h3 id="Research-and-Analyze" class="common-anchor-header">البحث والتحليل</h3><p>بعد تقسيم الاستفسار إلى استفسارات فرعية، يبدأ الجزء الخاص بالبحث من الوكيل. ويتضمن، بشكل تقريبي، أربع خطوات: <em>التوجيه،</em> <em>والبحث،</em> <em>والتفكير، والتكرار الشرطي</em>.</p>
<h4 id="Routing" class="common-anchor-header">التوجيه</h4><p>تحتوي قاعدة بياناتنا على جداول أو مجموعات متعددة من مصادر مختلفة. سيكون الأمر أكثر كفاءة إذا تمكنا من حصر البحث الدلالي في تلك المصادر ذات الصلة بالاستعلام المطروح فقط. يطلب موجه الاستعلام من موجه الاستعلام تحديد المجموعات التي يجب استرجاع المعلومات منها.</p>
<p>فيما يلي طريقة تشكيل موجه الاستعلام الموجه:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">get_vector_db_search_prompt</span>(<span class="hljs-params">
    question: <span class="hljs-built_in">str</span>,
    collection_names: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
    collection_descriptions: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
    context: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>] = <span class="hljs-literal">None</span>,
</span>):
    sections = []
    <span class="hljs-comment"># common prompt</span>
    common_prompt = <span class="hljs-string">f&quot;&quot;&quot;You are an advanced AI problem analyst. Use your reasoning ability and historical conversation information, based on all the existing data sets, to get absolutely accurate answers to the following questions, and generate a suitable question for each data set according to the data set description that may be related to the question.

Question: <span class="hljs-subst">{question}</span>
&quot;&quot;&quot;</span>
    sections.append(common_prompt)
    
    <span class="hljs-comment"># data set prompt</span>
    data_set = []
    <span class="hljs-keyword">for</span> i, collection_name <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(collection_names):
        data_set.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{collection_name}</span>: <span class="hljs-subst">{collection_descriptions[i]}</span>&quot;</span>)
    data_set_prompt = <span class="hljs-string">f&quot;&quot;&quot;The following is all the data set information. The format of data set information is data set name: data set description.

Data Sets And Descriptions:
&quot;&quot;&quot;</span>
    sections.append(data_set_prompt + <span class="hljs-string">&quot;\n&quot;</span>.join(data_set))
    
    <span class="hljs-comment"># context prompt</span>
    <span class="hljs-keyword">if</span> context:
        context_prompt = <span class="hljs-string">f&quot;&quot;&quot;The following is a condensed version of the historical conversation. This information needs to be combined in this analysis to generate questions that are closer to the answer. You must not generate the same or similar questions for the same data set, nor can you regenerate questions for data sets that have been determined to be unrelated.

Historical Conversation:
&quot;&quot;&quot;</span>
        sections.append(context_prompt + <span class="hljs-string">&quot;\n&quot;</span>.join(context))
    
    <span class="hljs-comment"># response prompt</span>
    response_prompt = <span class="hljs-string">f&quot;&quot;&quot;Based on the above, you can only select a few datasets from the following dataset list to generate appropriate related questions for the selected datasets in order to solve the above problems. The output format is json, where the key is the name of the dataset and the value is the corresponding generated question.

Data Sets:
&quot;&quot;&quot;</span>
    sections.append(response_prompt + <span class="hljs-string">&quot;\n&quot;</span>.join(collection_names))
    
    footer = <span class="hljs-string">&quot;&quot;&quot;Respond exclusively in valid JSON format matching exact JSON schema.

Critical Requirements:
- Include ONLY ONE action type
- Never add unsupported keys
- Exclude all non-JSON text, markdown, or explanations
- Maintain strict JSON syntax&quot;&quot;&quot;</span>
    sections.append(footer)
    <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n\n&quot;</span>.join(sections)
<button class="copy-code-btn"></button></code></pre>
<p>نجعل LLM يعيد مخرجات منظمة على هيئة JSON من أجل تحويل مخرجاته بسهولة إلى قرار بشأن ما يجب القيام به بعد ذلك.</p>
<h4 id="Search" class="common-anchor-header">البحث</h4><p>بعد اختيار مجموعات قواعد البيانات المختلفة عبر الخطوة السابقة، تقوم خطوة البحث بإجراء بحث تشابه مع <a href="https://milvus.io/docs">ميلفوس</a>. كما في الخطوة السابقة، تم تحديد بيانات المصدر مسبقًا وتقطيعها وتضمينها وتخزينها في قاعدة بيانات المتجهات. بالنسبة إلى DeepSearcher، يجب تحديد مصادر البيانات، سواء المحلية أو عبر الإنترنت، يدويًا. نترك البحث عبر الإنترنت للعمل المستقبلي.</p>
<h4 id="Reflection" class="common-anchor-header">الانعكاس</h4><p>على عكس المنشور السابق، يوضح DeepSearcher شكلاً حقيقيًا من أشكال الانعكاس العملي، حيث يقوم بإدخال المخرجات السابقة كسياق في موجه "يعكس" ما إذا كانت الأسئلة المطروحة حتى الآن والقطع المسترجعة ذات الصلة تحتوي على أي ثغرات معلوماتية. يمكن اعتبار ذلك خطوة تحليلية.</p>
<p>فيما يلي طريقة إنشاء المطالبة:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">get_reflect_prompt</span>(<span class="hljs-params">
   question: <span class="hljs-built_in">str</span>,
   mini_questions: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
   mini_chuncks: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
</span>):
    mini_chunk_str = <span class="hljs-string">&quot;&quot;</span>
    <span class="hljs-keyword">for</span> i, chunk <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(mini_chuncks):
        mini_chunk_str += <span class="hljs-string">f&quot;&quot;&quot;&lt;chunk_<span class="hljs-subst">{i}</span>&gt;\n<span class="hljs-subst">{chunk}</span>\n&lt;/chunk_<span class="hljs-subst">{i}</span>&gt;\n&quot;&quot;&quot;</span>
    reflect_prompt = <span class="hljs-string">f&quot;&quot;&quot;Determine whether additional search queries are needed based on the original query, previous sub queries, and all retrieved document chunks. If further research is required, provide a Python list of up to 3 search queries. If no further research is required, return an empty list.

If the original query is to write a report, then you prefer to generate some further queries, instead return an empty list.

    Original Query: <span class="hljs-subst">{question}</span>
    Previous Sub Queries: <span class="hljs-subst">{mini_questions}</span>
    Related Chunks: 
    <span class="hljs-subst">{mini_chunk_str}</span>
    &quot;&quot;&quot;</span>
   
    
    footer = <span class="hljs-string">&quot;&quot;&quot;Respond exclusively in valid List of str format without any other text.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> reflect_prompt + footer
<button class="copy-code-btn"></button></code></pre>
<p>مرّة أخرى، نجعل LLM يُرجع مخرجات منظّمة، وهذه المرّة كبيانات قابلة للتفسير بواسطة بايثون.</p>
<p>فيما يلي مثال على الاستفسارات الفرعية الجديدة "المكتشفة" عن طريق التفكير بعد الإجابة على الاستفسارات الفرعية الأولية أعلاه:</p>
<pre><code translate="no">New search queries <span class="hljs-keyword">for</span> <span class="hljs-built_in">next</span> iteration: [
  <span class="hljs-string">&quot;How have changes in The Simpsons&#x27; voice cast and production team influenced the show&#x27;s evolution over different seasons?&quot;</span>,
  <span class="hljs-string">&quot;What role has The Simpsons&#x27; satire and social commentary played in its adaptation to contemporary issues across decades?&quot;</span>,
  <span class="hljs-string">&#x27;How has The Simpsons addressed and incorporated shifts in media consumption, such as streaming services, into its distribution and content strategies?&#x27;</span>]
<button class="copy-code-btn"></button></code></pre>
<h4 id="Conditional-Repeat" class="common-anchor-header">التكرار الشرطي</h4><p>على عكس منشورنا السابق، يوضح DeepSearcher تدفق التنفيذ الشرطي. بعد التفكير فيما إذا كانت الأسئلة والإجابات حتى الآن مكتملة أم لا، إذا كانت هناك أسئلة إضافية يجب طرحها، يكرر الوكيل الخطوات المذكورة أعلاه. والأهم من ذلك أن تدفق التنفيذ (حلقة بينما) هو دالة لمخرجات LLM بدلاً من أن يكون مشفّرًا بشكل ثابت. في هذه الحالة لا يوجد سوى خيار ثنائي: <em>تكرار البحث</em> أو <em>إنشاء تقرير</em>. في الوكلاء الأكثر تعقيدًا قد يكون هناك العديد من الخيارات مثل: <em>متابعة الارتباط التشعبي،</em> <em>واسترجاع القطع، والتخزين في الذاكرة، والانعكاس،</em> إلخ. وبهذه الطريقة، يستمر تنقيح السؤال على النحو الذي يراه الوكيل مناسبًا حتى يقرر الخروج من الحلقة وإنشاء التقرير. في مثالنا Simpsons، يقوم DeepSearcher بجولتين أخريين لملء الفجوات باستعلامات فرعية إضافية.</p>
<h3 id="Synthesize" class="common-anchor-header">التوليف</h3><p>أخيرًا، يتم تجميع السؤال المفكك بالكامل والقطع المسترجعة في تقرير مع مطالبة واحدة. هذه هي الشيفرة لإنشاء المطالبة:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">get_final_answer_prompt</span>(<span class="hljs-params">
   question: <span class="hljs-built_in">str</span>, 
   mini_questions: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
   mini_chuncks: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
</span>):
    mini_chunk_str = <span class="hljs-string">&quot;&quot;</span>
    <span class="hljs-keyword">for</span> i, chunk <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(mini_chuncks):
        mini_chunk_str += <span class="hljs-string">f&quot;&quot;&quot;&lt;chunk_<span class="hljs-subst">{i}</span>&gt;\n<span class="hljs-subst">{chunk}</span>\n&lt;/chunk_<span class="hljs-subst">{i}</span>&gt;\n&quot;&quot;&quot;</span>
    summary_prompt = <span class="hljs-string">f&quot;&quot;&quot;You are an AI content analysis expert, good at summarizing content. Please summarize a specific and detailed answer or report based on the previous queries and the retrieved document chunks.

    Original Query: <span class="hljs-subst">{question}</span>
    Previous Sub Queries: <span class="hljs-subst">{mini_questions}</span>
    Related Chunks: 
    <span class="hljs-subst">{mini_chunk_str}</span>
    &quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> summary_prompt
<button class="copy-code-btn"></button></code></pre>
<p>يتميز هذا النهج عن نموذجنا الأولي الذي حلل كل سؤال على حدة وقام ببساطة بتجميع المخرجات، بإنتاج تقرير تكون فيه جميع الأجزاء متسقة مع بعضها البعض، أي لا يحتوي على معلومات متكررة أو متناقضة. يمكن لنظام أكثر تعقيدًا أن يجمع بين جوانب من كليهما، باستخدام تدفق التنفيذ الشرطي لهيكلة التقرير وتلخيصه وإعادة كتابته وعكسه وتدويره وما إلى ذلك، وهو ما نتركه للعمل المستقبلي.</p>
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
    </button></h2><p>فيما يلي عينة من التقرير الذي تم إنشاؤه بواسطة الاستعلام "كيف تغيرت عائلة سمبسون مع مرور الوقت؟" مع تمرير DeepSeek-R1 لصفحة ويكيبيديا عن عائلة سمبسون كمصدر للمعلومات:</p>
<pre><code translate="no" class="language-txt"><span class="hljs-title class_">Report</span>: <span class="hljs-title class_">The</span> <span class="hljs-title class_">Evolution</span> <span class="hljs-keyword">of</span> <span class="hljs-title class_">The</span> <span class="hljs-title class_">Simpsons</span> (<span class="hljs-number">1989</span>–<span class="hljs-title class_">Present</span>)
<span class="hljs-number">1.</span> <span class="hljs-title class_">Cultural</span> <span class="hljs-title class_">Impact</span> and <span class="hljs-title class_">Societal</span> <span class="hljs-title class_">Relevance</span>
<span class="hljs-title class_">The</span> <span class="hljs-title class_">Simpsons</span> debuted <span class="hljs-keyword">as</span> a subversive critique <span class="hljs-keyword">of</span> <span class="hljs-title class_">American</span> middle-<span class="hljs-keyword">class</span> <span class="hljs-title class_">life</span>, gaining notoriety <span class="hljs-keyword">for</span> its bold satire <span class="hljs-keyword">in</span> the 1990s. <span class="hljs-title class_">Initially</span> a countercultural phenomenon, it challenged norms <span class="hljs-keyword">with</span> episodes tackling religion, politics, and consumerism. <span class="hljs-title class_">Over</span> time, its cultural dominance waned <span class="hljs-keyword">as</span> competitors like <span class="hljs-title class_">South</span> <span class="hljs-title class_">Park</span> and <span class="hljs-title class_">Family</span> <span class="hljs-title class_">Guy</span> pushed boundaries further. <span class="hljs-title class_">By</span> the 2010s, the show transitioned <span class="hljs-keyword">from</span> trendsetter to nostalgic institution, balancing legacy appeal <span class="hljs-keyword">with</span> attempts to address modern issues like climate change and <span class="hljs-variable constant_">LGBTQ</span>+ rights, albeit <span class="hljs-keyword">with</span> less societal resonance.
…
<span class="hljs-title class_">Conclusion</span>
<span class="hljs-title class_">The</span> <span class="hljs-title class_">Simpsons</span> evolved <span class="hljs-keyword">from</span> a radical satire to a television institution, navigating shifts <span class="hljs-keyword">in</span> technology, politics, and audience expectations. <span class="hljs-title class_">While</span> its golden-age brilliance remains unmatched, its adaptability—through streaming, updated humor, and <span class="hljs-variable language_">global</span> outreach—secures its place <span class="hljs-keyword">as</span> a cultural touchstone. <span class="hljs-title class_">The</span> show’s longevity reflects both nostalgia and a pragmatic embrace <span class="hljs-keyword">of</span> change, even <span class="hljs-keyword">as</span> it grapples <span class="hljs-keyword">with</span> the challenges <span class="hljs-keyword">of</span> relevance <span class="hljs-keyword">in</span> a fragmented media landscape.
<button class="copy-code-btn"></button></code></pre>
<p>ابحث عن <a href="https://drive.google.com/file/d/1GE3rvxFFTKqro67ctTkknryUf-ojhduN/view?usp=sharing">التقرير الكامل هنا،</a> <a href="https://drive.google.com/file/d/1EGd16sJDNFnssk9yTd5o9jzbizrY_NS_/view?usp=sharing">وتقرير صادر عن DeepSearcher باستخدام GPT-4o mini</a> للمقارنة.</p>
<h2 id="Discussion" class="common-anchor-header">المناقشة<button data-href="#Discussion" class="anchor-icon" translate="no">
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
    </button></h2><p>قدمنا <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher،</a> وهو وكيل لإجراء الأبحاث وكتابة التقارير. نظامنا مبني على الفكرة الواردة في مقالنا السابق، مع إضافة ميزات مثل تدفق التنفيذ المشروط، وتوجيه الاستعلام، وواجهة محسنة. لقد تحولنا من الاستدلال المحلي بنموذج استدلال كمي صغير مكون من 4 بت إلى خدمة استدلال عبر الإنترنت لنموذج DeepSeek-R1 الضخم، مما أدى إلى تحسين نوعي في تقرير المخرجات. يعمل DeepSearcher العميق مع معظم خدمات الاستدلال مثل OpenAI و Gemini و DeepSeek و Grok 3 (قريباً!).</p>
<p>نماذج الاستدلال، خاصةً كما تُستخدم في وكلاء البحث، ثقيلة الاستدلال، وكنا محظوظين لتمكننا من استخدام أسرع عرض لـ DeepSeek-R1 من SambaNova الذي يعمل على أجهزتهم المخصصة. بالنسبة لاستعلامنا التوضيحي، أجرينا خمسة وستين مكالمة إلى خدمة الاستدلال DeepSeek-R1 من SambaNova، وأدخلنا حوالي 25 ألف رمز وأخرجنا 22 ألف رمز بتكلفة 0.30 دولار. لقد أُعجبنا بسرعة الاستدلال بالنظر إلى أن النموذج يحتوي على 671 مليار معلمة ويبلغ حجمه 3/4 تيرابايت. <a href="https://sambanova.ai/press/fastest-deepseek-r1-671b-with-highest-efficiency">اكتشف المزيد من التفاصيل هنا!</a></p>
<p>سوف نستمر في تكرار هذا العمل في منشورات مستقبلية، حيث سنستمر في دراسة مفاهيم وكلاء إضافيين ومساحة تصميم وكلاء البحث. في هذه الأثناء، ندعو الجميع لتجربة <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher،</a> <a href="https://github.com/zilliztech/deep-searcher">ووضع نجمة لنا على GitHub،</a> ومشاركة ملاحظاتكم!</p>
<h2 id="Resources" class="common-anchor-header">المصادر<button data-href="#Resources" class="anchor-icon" translate="no">
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
<li><p><a href="https://github.com/zilliztech/deep-searcher"><strong>الباحث العميق لزيليز</strong></a></p></li>
<li><p>معلومات أساسية للقراءة <a href="https://milvus.io/blog/i-built-a-deep-research-with-open-source-so-can-you.md"><strong><em>"لقد بنيت بحثًا عميقًا باستخدام المصدر المفتوح - ويمكنك ذلك أيضًا!"</em></strong></a></p></li>
<li><p><a href="https://sambanova.ai/press/fastest-deepseek-r1-671b-with-highest-efficiency"><strong>"SambaNova "SambaNova" يطلق أسرع DeepSeek-R1 671B بأعلى كفاءة</strong></a><em>"</em></p></li>
<li><p>"DeepSearcher <a href="https://drive.google.com/file/d/1GE3rvxFFTKqro67ctTkknryUf-ojhduN/view?usp=sharing">تقرير "DeepSeek-R1" عن عائلة سيمبسون</a></p></li>
<li><p>DeepSearcher: <a href="https://drive.google.com/file/d/1EGd16sJDNFnssk9yTd5o9jzbizrY_NS_/view?usp=sharing">تقرير GPT-4o المصغر عن عائلة سيمبسون</a></p></li>
<li><p><a href="https://milvus.io/docs">قاعدة بيانات ميلفوس مفتوحة المصدر للمتجهات</a></p></li>
</ul>
