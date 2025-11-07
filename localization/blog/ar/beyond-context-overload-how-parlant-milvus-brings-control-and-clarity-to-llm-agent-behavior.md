---
id: >-
  beyond-context-overload-how-parlant-milvus-brings-control-and-clarity-to-llm-agent-behavior.md
title: >-
  ما بعد تحميل السياق الزائد: كيف يجلب Parlant × ميلفوس التحكم والوضوح لسلوك
  وكيل LLM
author: Min Yin
date: 2025-11-05T00:00:00.000Z
cover: assets.zilliz.com/parlant_cover1_d39ad6c8b0.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Parlant, Milvus, AI agents, vector database, LLM'
meta_title: How Parlant × Milvus Brings Control to LLM Agent Behavior
desc: >-
  اكتشف كيف يستخدم Parlant × Milvus نمذجة المحاذاة والذكاء المتجه لجعل سلوك وكيل
  LLM قابلاً للتحكم فيه وتفسيره وجاهزاً للإنتاج.
origin: >-
  https://milvus.io/blog/beyond-context-overload-how-parlant-milvus-brings-control-and-clarity-to-llm-agent-behavior.md
---
<p>تخيل أنه طُلب منك إكمال مهمة تتضمن 200 قاعدة عمل و50 أداة و30 عرضًا توضيحيًا، وليس لديك سوى ساعة واحدة للقيام بذلك. هذا ببساطة مستحيل. ومع ذلك فإننا غالبًا ما نتوقع من النماذج اللغوية الكبيرة أن تفعل ذلك بالضبط عندما نحولها إلى "وكلاء" ونثقلها بالتعليمات.</p>
<p>في الممارسة العملية، سرعان ما ينهار هذا النهج. حيث تقوم أطر عمل الوكلاء التقليدية، مثل LangChain أو LlamaIndex، بحقن جميع القواعد والأدوات في سياق النموذج في آن واحد، مما يؤدي إلى تعارض القواعد، وتحميل السياق فوق طاقته، وسلوك غير متوقع في الإنتاج.</p>
<p>ولمعالجة هذه المشكلة، اكتسب إطار عمل الوكيل مفتوح المصدر المسمى<a href="https://github.com/emcie-co/parlant?utm_source=chatgpt.com"> <strong>Parlant</strong></a> مؤخرًا زخمًا على GitHub. وهو يقدم نهجًا جديدًا يسمى نمذجة المحاذاة، إلى جانب آلية إشرافية وانتقالات مشروطة تجعل سلوك الوكيل أكثر قابلية للتحكم والتفسير.</p>
<p>عند إقرانها مع <a href="https://milvus.io/"><strong>Milvus،</strong></a> وهي قاعدة بيانات متجهة مفتوحة المصدر، تصبح Parlant أكثر قدرة. تضيف Milvus ذكاءً دلاليًا، مما يسمح للوكلاء باسترداد القواعد والسياق الأكثر صلة بشكل ديناميكي في الوقت الفعلي - مما يجعلها دقيقة وفعالة وجاهزة للإنتاج.</p>
<p>في هذا المنشور، سنستكشف في هذا المقال كيفية عمل Parlant تحت الغطاء - وكيف يتيح تكامله مع Milvus إمكانية الوصول إلى مستوى الإنتاج.</p>
<h2 id="Why-Traditional-Agent-Frameworks-Fall-Apart" class="common-anchor-header">لماذا تنهار أطر عمل الوكيل التقليدية<button data-href="#Why-Traditional-Agent-Frameworks-Fall-Apart" class="anchor-icon" translate="no">
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
    </button></h2><p>تحب أطر عمل الوكلاء التقليدية أن تكون كبيرة: مئات القواعد، وعشرات الأدوات، وحفنة من العروض التوضيحية - وكلها محشورة في موجه واحد مكتظ. قد يبدو الأمر رائعًا في عرض توضيحي أو اختبار صندوق رمل صغير، ولكن بمجرد أن تدفعه إلى الإنتاج، تبدأ الشقوق في الظهور بسرعة.</p>
<ul>
<li><p><strong>القواعد المتضاربة تجلب الفوضى:</strong> عندما تُطبَّق قاعدتان أو أكثر في نفس الوقت، لا تملك هذه الأطر طريقة مدمجة لتحديد أيهما يفوز. أحيانًا تختار واحدة. وأحيانًا تمزج الاثنين معًا. وأحيانًا تفعل شيئًا لا يمكن التنبؤ به تمامًا.</p></li>
<li><p><strong>حالات الحافة تكشف الثغرات:</strong> لا يمكنك التنبؤ بكل ما قد يقوله المستخدم. وعندما يصطدم نموذجك بشيء خارج بيانات التدريب الخاصة به، فإنه يتجه افتراضيًا إلى إجابات عامة وغير ملتزمة.</p></li>
<li><p><strong>تصحيح الأخطاء مؤلم ومكلف:</strong> عندما يسيء الوكيل التصرف، يكاد يكون من المستحيل تحديد القاعدة التي تسببت في المشكلة. نظرًا لأن كل شيء يعيش داخل موجه نظام عملاق واحد، فإن الطريقة الوحيدة لإصلاحه هي إعادة كتابة الموجه وإعادة اختبار كل شيء من الصفر.</p></li>
</ul>
<h2 id="What-is-Parlant-and-How-It-Works" class="common-anchor-header">ما هو "بارلانت" وكيف يعمل<button data-href="#What-is-Parlant-and-How-It-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Parlant هو محرك محاذاة مفتوح المصدر لوكلاء LLM. يمكنك التحكم بدقة في كيفية تصرف الوكيل عبر سيناريوهات مختلفة من خلال نمذجة عملية اتخاذ القرار الخاصة به بطريقة منظمة وقائمة على القواعد.</p>
<p>لمعالجة المشاكل الموجودة في أطر عمل الوكلاء التقليدية، يقدم Parlant نهجًا قويًا جديدًا: <strong>نمذجة المحاذاة</strong>. وتتمثل فكرته الأساسية في فصل تعريف القواعد عن تنفيذ القواعد، مما يضمن إدخال القواعد الأكثر صلة فقط في سياق الوكيل في أي وقت معين.</p>
<h3 id="Granular-Guidelines-The-Core-of-Alignment-Modeling" class="common-anchor-header">الإرشادات الدقيقة: جوهر نمذجة المواءمة</h3><p>يقع مفهوم <strong>المبادئ التوجيهية الحبيبية</strong> في صميم نموذج المواءمة في بارلانت. فبدلاً من كتابة موجه نظام عملاق واحد مليء بالقواعد، يمكنك تحديد إرشادات صغيرة ومعيارية - كل منها يصف كيف يجب على الوكيل التعامل مع نوع معين من المواقف.</p>
<p>يتكون كل مبدأ توجيهي من ثلاثة أجزاء:</p>
<ul>
<li><p><strong>الشرط</strong> - وصف بلغة طبيعية للوقت الذي يجب أن تنطبق فيه القاعدة. يقوم Parlant بتحويل هذا الشرط إلى متجه دلالي ويطابقه مع مدخلات المستخدم لمعرفة ما إذا كان ذا صلة.</p></li>
<li><p><strong>الإجراء</strong> - تعليمات واضحة تحدد كيفية استجابة الوكيل بمجرد استيفاء الشرط. يتم حقن هذا الإجراء في سياق LLM فقط عند تشغيله.</p></li>
<li><p><strong>الأدوات</strong> - أي وظائف خارجية أو واجهات برمجة تطبيقات مرتبطة بتلك القاعدة المحددة. يتم كشفها للوكيل فقط عندما يكون المبدأ التوجيهي نشطًا، مما يجعل استخدام الأداة خاضعًا للتحكم ومدركًا للسياق.</p></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">await</span> agent.<span class="hljs-title function_">create_guideline</span>(
    condition=<span class="hljs-string">&quot;The user asks about a refund and the order amount exceeds 500 RMB&quot;</span>,
    action=<span class="hljs-string">&quot;First call the order status check tool to confirm whether the refund conditions are met, then provide a detailed explanation of the refund process&quot;</span>,
    tools=[check_order_status, calculate_refund_amount]
)
<button class="copy-code-btn"></button></code></pre>
<p>في كل مرة يتفاعل فيها المستخدم مع الوكيل، يقوم Parlant بتشغيل خطوة مطابقة خفيفة للعثور على أكثر ثلاثة إلى خمسة إرشادات ذات صلة. يتم حقن تلك القواعد فقط في سياق النموذج، مما يحافظ على إيجاز وتركيز الإرشادات مع ضمان اتباع الوكيل للقواعد الصحيحة باستمرار.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/guideline_system_652fb287ce.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Supervising-Mechanism-for-Accuracy-and-Consistency" class="common-anchor-header">آلية الإشراف على الدقة والاتساق</h3><p>للحفاظ على مزيد من الدقة والاتساق، يقدم Parlant <strong>آلية إشراف</strong> تعمل كطبقة ثانية من مراقبة الجودة. تتكشف العملية في ثلاث خطوات:</p>
<p><strong>1. إنشاء رد مرشح</strong> - ينشئ الوكيل ردًا أوليًا بناءً على الإرشادات المتطابقة وسياق المحادثة الحالي.</p>
<p><strong>2. التحقق من الامتثال</strong> - تتم مقارنة الرد بالإرشادات النشطة للتحقق من اتباع كل التعليمات بشكل صحيح.</p>
<p><strong>3. المراجعة أو التأكيد</strong> - إذا تم العثور على أي مشاكل، يقوم النظام بتصحيح الإخراج؛ إذا تم التحقق من كل شيء، تتم الموافقة على الرد وإرساله إلى المستخدم.</p>
<p>تضمن آلية الإشراف هذه أن الوكيل لا يفهم القواعد فحسب، بل يلتزم بها فعليًا قبل الرد - مما يحسّن الموثوقية والتحكم على حد سواء.</p>
<h3 id="Conditional-Transitions-for-Control-and-Safety" class="common-anchor-header">الانتقالات الشرطية للتحكم والسلامة</h3><p>في أطر عمل الوكيل التقليدية، تكون كل أداة متاحة مكشوفة للوكيل في جميع الأوقات. غالبًا ما يؤدي نهج "كل شيء على الطاولة" هذا إلى مطالبات مثقلة واستدعاءات غير مقصودة للأداة. يحل Parlant هذا الأمر من خلال <strong>الانتقالات الشرطية</strong>. على غرار كيفية عمل آلات الحالة، لا يتم تشغيل إجراء أو أداة إلا عند استيفاء شرط معين. ترتبط كل أداة ارتباطًا وثيقًا بالمبدأ التوجيهي المقابل لها، ولا تصبح متاحة إلا عند تفعيل شرط ذلك المبدأ التوجيهي.</p>
<pre><code translate="no"><span class="hljs-comment"># The balance inquiry tool is exposed only when the condition &quot;the user wants to make a transfer&quot; is met</span>
<span class="hljs-keyword">await</span> agent.create_guideline(
    condition=<span class="hljs-string">&quot;The user wants to make a transfer&quot;</span>,
    action=<span class="hljs-string">&quot;First check the account balance. If the balance is below 500 RMB, remind the user that an overdraft fee may apply.&quot;</span>,
    tools=[get_user_account_balance]
)
<button class="copy-code-btn"></button></code></pre>
<p>تعمل هذه الآلية على تحويل استدعاء الأداة إلى انتقال مشروط - تنتقل الأدوات من "غير نشط" إلى "نشط" فقط عند استيفاء شروط تشغيلها. من خلال هيكلة التنفيذ بهذه الطريقة، يضمن Parlant أن كل إجراء يحدث بشكل مدروس وفي سياقه، مما يمنع إساءة الاستخدام مع تحسين كل من الكفاءة وسلامة النظام.</p>
<h2 id="How-Milvus-Powers-Parlant" class="common-anchor-header">كيف يقوم ميلفوس بتشغيل بارلانت<button data-href="#How-Milvus-Powers-Parlant" class="anchor-icon" translate="no">
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
    </button></h2><p>عندما ننظر تحت غطاء عملية مطابقة المبادئ التوجيهية في بارلانت، يتضح لنا تحدٍ تقني أساسي: كيف يمكن للنظام العثور على أكثر ثلاث إلى خمس قواعد ذات صلة من بين مئات - أو حتى آلاف - الخيارات في بضعة أجزاء من الثانية؟ وهنا بالضبط يأتي دور قاعدة بيانات المتجهات. الاسترجاع الدلالي هو ما يجعل ذلك ممكناً.</p>
<h3 id="How-Milvus-Supports-Parlant’s-Guideline-Matching-Process" class="common-anchor-header">كيف يدعم ميلفوس عملية مطابقة المبادئ التوجيهية في بارلانت</h3><p>تعمل مطابقة المبادئ التوجيهية من خلال التشابه الدلالي. يتم تحويل حقل حالة كل مبدأ توجيهي إلى تضمين متجه، بحيث يتم التقاط معناه بدلاً من مجرد نصه الحرفي. عندما يرسل المستخدم رسالة، يقارن Parlant دلالات تلك الرسالة مع جميع التضمينات الإرشادية المخزنة للعثور على أكثرها صلة.</p>
<p>إليك كيفية عمل العملية خطوة بخطوة:</p>
<p><strong>1. ترميز الاستعلام</strong> - يتم تحويل رسالة المستخدم وسجل المحادثات الأخيرة إلى متجه استعلام.</p>
<p><strong>2. البحث عن التشابه</strong> - يُجري النظام بحثًا عن التشابه داخل مخزن متجه المبادئ التوجيهية للعثور على أقرب التطابقات.</p>
<p><strong>3. استرداد أفضل النتائج</strong> - يتم إرجاع أفضل ثلاثة إلى خمسة إرشادات ذات صلة دلالية.</p>
<p><strong>4. الحقن في السياق</strong> - يتم بعد ذلك إدراج هذه الإرشادات المتطابقة ديناميكيًا في سياق LLM حتى يتمكن النموذج من العمل وفقًا للقواعد الصحيحة.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/guideline_matching_process_ffd874c77e.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>لجعل سير العمل هذا ممكناً، يجب أن توفر قاعدة بيانات المتجهات ثلاث قدرات حاسمة: البحث عن أقرب جار تقريبي (ANN) عالي الأداء، وتصفية البيانات الوصفية المرنة، وتحديثات المتجهات في الوقت الفعلي. توفر <a href="https://milvus.io/"><strong>Milvus،</strong></a> قاعدة بيانات المتجهات مفتوحة المصدر، وهي قاعدة بيانات المتجهات السحابية الأصلية مفتوحة المصدر، أداءً على مستوى الإنتاج في جميع المجالات الثلاثة.</p>
<p>لفهم كيفية عمل Milvus في سيناريوهات حقيقية، دعنا ننظر إلى وكيل خدمات مالية كمثال.</p>
<p>لنفترض أن النظام يحدد 800 إرشادات عمل تغطي مهام مثل الاستفسارات عن الحسابات، وتحويلات الأموال، واستشارات منتجات إدارة الثروات. في هذا الإعداد، يعمل نظام Milvus كطبقة تخزين واسترجاع لجميع بيانات المبادئ التوجيهية.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, Collection, FieldSchema, CollectionSchema, DataType
<span class="hljs-keyword">import</span> parlant.sdk <span class="hljs-keyword">as</span> p

<span class="hljs-comment"># Connect to Milvus</span>
connections.connect(host=<span class="hljs-string">&quot;localhost&quot;</span>, port=<span class="hljs-string">&quot;19530&quot;</span>)

<span class="hljs-comment"># Define the schema for the guideline collection</span>
fields = [
    FieldSchema(name=<span class="hljs-string">&quot;guideline_id&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">100</span>, is_primary=<span class="hljs-literal">True</span>),
    FieldSchema(name=<span class="hljs-string">&quot;condition_vector&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>),
    FieldSchema(name=<span class="hljs-string">&quot;condition_text&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">1000</span>),
    FieldSchema(name=<span class="hljs-string">&quot;action_text&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">2000</span>),
    FieldSchema(name=<span class="hljs-string">&quot;priority&quot;</span>, dtype=DataType.INT64),
    FieldSchema(name=<span class="hljs-string">&quot;business_domain&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
]
schema = CollectionSchema(fields=fields, description=<span class="hljs-string">&quot;Agent Guidelines&quot;</span>)
guideline_collection = Collection(name=<span class="hljs-string">&quot;agent_guidelines&quot;</span>, schema=schema)

<span class="hljs-comment"># Create an HNSW index for high-performance retrieval</span>
index_params = {
    <span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;HNSW&quot;</span>,
    <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>,
    <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>}
}
guideline_collection.create_index(field_name=<span class="hljs-string">&quot;condition_vector&quot;</span>, index_params=index_params)
<button class="copy-code-btn"></button></code></pre>
<p>والآن، عندما يقول المستخدم "أريد تحويل 100,000 رنمينبي إلى حساب والدتي"، فإن تدفق وقت التشغيل يكون</p>
<p><strong>1. إعادة توجيه الاستعلام</strong> - تحويل مدخلات المستخدم إلى متجه ذي 768 بُعدًا.</p>
<p><strong>2. الاسترجاع الهجين</strong> - تشغيل بحث تشابه متجه في Milvus مع تصفية البيانات الوصفية (على سبيل المثال، <code translate="no">business_domain=&quot;transfer&quot;</code>).</p>
<p><strong>3. ترتيب النتائج</strong> - رتب الإرشادات المرشحة بناءً على درجات التشابه مع قيم <strong>أولويتها</strong>.</p>
<p><strong>4. حقن السياق</strong> - حقن أفضل 3 إرشادات متطابقة <code translate="no">action_text</code> في سياق وكيل Parlant.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/bank_transfer_use_case_481d09a407.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>في هذا التكوين، يوفر Milvus زمن انتقال P99 أقل من 15 مللي ثانية، حتى عندما يصل حجم مكتبة المبادئ التوجيهية إلى 100,000 مدخل. وعلى سبيل المقارنة، يؤدي استخدام قاعدة بيانات علائقية تقليدية مع مطابقة الكلمات الرئيسية عادةً إلى زمن انتقال يتجاوز 200 مللي ثانية ودقة مطابقة أقل بكثير.</p>
<h3 id="How-Milvus-Enables-Long-Term-Memory-and-Personalization" class="common-anchor-header">كيفية تمكين Milvus للذاكرة طويلة المدى والتخصيص</h3><p>يقوم Milvus بأكثر من المطابقة الإرشادية. في السيناريوهات التي يحتاج فيها الوكلاء إلى ذاكرة طويلة الأجل واستجابات مخصصة، يمكن أن يعمل Milvus كطبقة ذاكرة تخزن وتسترجع تفاعلات المستخدمين السابقة على شكل تضمينات متجهة، مما يساعد الوكيل على تذكر ما تمت مناقشته من قبل.</p>
<pre><code translate="no"><span class="hljs-comment"># store user’s past interactions</span>
user_memory_fields = [
    FieldSchema(name=<span class="hljs-string">&quot;interaction_id&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">100</span>, is_primary=<span class="hljs-literal">True</span>),
    FieldSchema(name=<span class="hljs-string">&quot;user_id&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">50</span>),
    FieldSchema(name=<span class="hljs-string">&quot;interaction_vector&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>),
    FieldSchema(name=<span class="hljs-string">&quot;interaction_summary&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">500</span>),
    FieldSchema(name=<span class="hljs-string">&quot;timestamp&quot;</span>, dtype=DataType.INT64)
]
memory_collection = Collection(name=<span class="hljs-string">&quot;user_memory&quot;</span>, schema=CollectionSchema(user_memory_fields))
<button class="copy-code-btn"></button></code></pre>
<p>عندما يعود المستخدم نفسه، يمكن للوكيل استرجاع التفاعلات التاريخية الأكثر صلة من Milvus واستخدامها لتوليد تجربة أكثر ترابطاً وشبيهة بالبشر. على سبيل المثال، إذا سأل أحد المستخدمين عن صندوق استثماري في الأسبوع الماضي، يمكن للوكيل استرجاع هذا السياق والرد بشكل استباقي: "مرحباً بعودتك! هل لا تزال لديك أسئلة حول الصندوق الذي ناقشناه في المرة السابقة؟</p>
<h3 id="How-to-Optimize-Performance-for-Milvus-Powered-Agent-Systems" class="common-anchor-header">كيفية تحسين الأداء لأنظمة الوكلاء التي تعمل بنظام الوكيل المدعوم من ميلفوس</h3><p>عند نشر نظام وكيل مدعوم من Milvus في بيئة إنتاج، يصبح ضبط الأداء أمرًا بالغ الأهمية. لتحقيق زمن انتقال منخفض وإنتاجية عالية، هناك العديد من المعلمات الرئيسية التي تحتاج إلى الاهتمام:</p>
<p><strong>1. اختيار نوع الفهرس المناسب</strong></p>
<p>من المهم اختيار بنية الفهرس المناسبة. على سبيل المثال، يعد HNSW (العالم الصغير القابل للتنقل الهرمي) مثاليًا للسيناريوهات عالية الاستدعاء مثل التمويل أو الرعاية الصحية، حيث تكون الدقة أمرًا بالغ الأهمية. يعمل IVF_FLAT بشكل أفضل للتطبيقات واسعة النطاق مثل توصيات التجارة الإلكترونية، حيث يكون الاستدعاء الأقل قليلاً مقبولاً مقابل أداء أسرع واستخدام أقل للذاكرة.</p>
<p><strong>2. استراتيجية التجزئة</strong></p>
<p>عندما يتجاوز عدد الإرشادات المخزنة مليون مدخل، يوصى باستخدام <strong>التقسيم</strong> لتقسيم البيانات حسب مجال العمل أو حالة الاستخدام. يقلل التقسيم من مساحة البحث لكل استعلام، مما يحسن سرعة الاسترجاع ويحافظ على ثبات زمن الاستجابة حتى مع نمو مجموعة البيانات.</p>
<p><strong>3. تكوين ذاكرة التخزين المؤقت</strong></p>
<p>بالنسبة للمبادئ التوجيهية التي يتم الوصول إليها بشكل متكرر مثل استعلامات العملاء القياسية أو عمليات سير العمل ذات حركة المرور العالية، يمكنك استخدام التخزين المؤقت لنتائج استعلام Milvus. يسمح ذلك للنظام بإعادة استخدام النتائج السابقة، مما يقلل من زمن الاستجابة إلى أقل من 5 مللي ثانية لعمليات البحث المتكررة.</p>
<h2 id="Hands-on-Demo-How-to-Build-a-Smart-QA-System-with-Parlant-and-Milvus-Lite" class="common-anchor-header">عرض توضيحي عملي: كيفية بناء نظام ذكي للأسئلة والأجوبة باستخدام Parlant و Milvus Lite<button data-href="#Hands-on-Demo-How-to-Build-a-Smart-QA-System-with-Parlant-and-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus<a href="https://milvus.io/docs/install-overview.md">Lite</a> هو نسخة خفيفة الوزن من Milvus - مكتبة بايثون التي يمكن تضمينها بسهولة في تطبيقاتك. وهي مثالية للنماذج الأولية السريعة في بيئات مثل Jupyter Notebooks أو للتشغيل على الأجهزة المتطورة والذكية ذات الموارد الحوسبية المحدودة. على الرغم من صغر حجمه، إلا أن Milvus Lite يدعم نفس واجهات برمجة التطبيقات التي تدعمها عمليات نشر Milvus الأخرى. هذا يعني أن التعليمات البرمجية من جانب العميل التي تكتبها لـ Milvus Lite يمكن أن تتصل بسلاسة بمثيل Milvus أو Zilliz Cloud الكامل لاحقًا - دون الحاجة إلى إعادة الهيكلة.</p>
<p>في هذا العرض التوضيحي، سنستخدم Milvus Lite مع Parlant لتوضيح كيفية بناء نظام أسئلة وأجوبة ذكي يوفر إجابات سريعة ومدركة للسياق بأقل قدر من الإعداد.</p>
<h3 id="Prerequisites" class="common-anchor-header">المتطلبات الأساسية ：</h3><p>1- بارلانت جيثب: https://github.com/emcie-co/parlant</p>
<p>2- وثائق بارلانت: https://parlant.io/docs</p>
<p>3.python3.10+</p>
<p>4.OpenAI_key</p>
<p>5.MlivusLite</p>
<h3 id="Step-1-Install-Dependencies" class="common-anchor-header">الخطوة 1: تثبيت التبعيات</h3><pre><code translate="no"><span class="hljs-comment"># Install required Python packages</span>
pip install pymilvus parlant openai
<span class="hljs-comment"># Or, if you’re using a Conda environment:</span>
conda activate your_env_name
pip install pymilvus parlant openai
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Configure-Environment-Variables" class="common-anchor-header">الخطوة 2: تكوين متغيرات البيئة</h3><pre><code translate="no"><span class="hljs-comment"># Set your OpenAI API key</span>
<span class="hljs-built_in">export</span> OPENAI_API_KEY=<span class="hljs-string">&quot;your_openai_api_key_here&quot;</span>
<span class="hljs-comment"># Verify that the variable is set correctly</span>
<span class="hljs-built_in">echo</span> <span class="hljs-variable">$OPENAI_API_KEY</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Implement-the-Core-Code" class="common-anchor-header">الخطوة 3: تنفيذ الكود الأساسي</h3><ul>
<li>إنشاء مضمن OpenAI مخصص</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">class</span> <span class="hljs-title class_">OpenAIEmbedder</span>(p.Embedder):
    <span class="hljs-comment"># Converts text into vector embeddings with built-in timeout and retry</span>
    <span class="hljs-comment"># Dimension: 1536 (text-embedding-3-small)</span>
    <span class="hljs-comment"># Timeout: 60 seconds; Retries: up to 2 times</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>تهيئة القاعدة المعرفية</li>
</ul>
<p>1- قم بإنشاء مجموعة Milvus باسم kb_articles.</p>
<p>2- إدراج بيانات نموذجية (مثل سياسة الاسترداد وسياسة الاستبدال ووقت الشحن).</p>
<p>3- إنشاء فهرس HNSW لتسريع عملية الاسترجاع.</p>
<ul>
<li>بناء أداة البحث المتجه</li>
</ul>
<pre><code translate="no"><span class="hljs-meta">@p.tool</span>
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">vector_search</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span>, min_score: <span class="hljs-built_in">float</span> = <span class="hljs-number">0.35</span></span>):
    <span class="hljs-comment"># 1. Convert user query into a vector</span>
    <span class="hljs-comment"># 2. Perform similarity search in Milvus</span>
    <span class="hljs-comment"># 3. Return results with relevance above threshold</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>تكوين وكيل بارلانت</li>
</ul>
<p><strong>المبدأ التوجيهي 1:</strong> بالنسبة للأسئلة المتعلقة بالوقائع أو السياسات، يجب على الوكيل أولاً إجراء بحث متجه.</p>
<p><strong>المبدأ التوجيهي 2:</strong> عند العثور على دليل، يجب على الوكيل الرد باستخدام قالب منظم (ملخص + نقاط رئيسية + مصادر).</p>
<pre><code translate="no"><span class="hljs-comment"># Guideline 1: Run vector search for factual or policy-related questions</span>
<span class="hljs-keyword">await</span> agent.create_guideline(
            condition=<span class="hljs-string">&quot;User asks a factual question about policy, refund, exchange, or shipping&quot;</span>,
            action=(
                <span class="hljs-string">&quot;Call vector_search with the user&#x27;s query. &quot;</span>
                <span class="hljs-string">&quot;If evidence is found, synthesize an answer by quoting key sentences and cite doc_id/title. &quot;</span>
                <span class="hljs-string">&quot;If evidence is insufficient, ask a clarifying question before answering.&quot;</span>
            ),
            tools=[vector_search],

<span class="hljs-comment"># Guideline 2: Use a standardized, structured response when evidence is available</span>
<span class="hljs-keyword">await</span> agent.create_guideline(
            condition=<span class="hljs-string">&quot;Evidence is available&quot;</span>,
            action=(
                <span class="hljs-string">&quot;Answer with the following template:\\n&quot;</span>
                <span class="hljs-string">&quot;Summary: provide a concise conclusion.\\n&quot;</span>
                <span class="hljs-string">&quot;Key points: 2-3 bullets distilled from evidence.\\n&quot;</span>
                <span class="hljs-string">&quot;Sources: list doc_id and title.\\n&quot;</span>
                <span class="hljs-string">&quot;Note: if confidence is low, state limitations and ask for clarification.&quot;</span>
            ),
            tools=[],
        )

    tools=[],
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>اكتب الرمز الكامل</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> asyncio
<span class="hljs-keyword">import</span> json
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">List</span>, <span class="hljs-type">Dict</span>, <span class="hljs-type">Any</span>
<span class="hljs-keyword">import</span> parlant.sdk <span class="hljs-keyword">as</span> p
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType
<span class="hljs-comment"># 1) Environment variables: using OpenAI (as both the default generation model and embedding service)</span>
<span class="hljs-comment"># Make sure the OPENAI_API_KEY is set</span>
OPENAI_API_KEY = os.environ.get(<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>)
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> OPENAI_API_KEY:
    <span class="hljs-keyword">raise</span> RuntimeError(<span class="hljs-string">&quot;Please set OPENAI_API_KEY environment variable&quot;</span>)
<span class="hljs-comment"># 2) Initialize Milvus Lite (runs locally, no standalone service required)</span>
<span class="hljs-comment"># MilvusClient runs in Lite mode using a local file path (requires pymilvus &gt;= 2.x)</span>
client = MilvusClient(<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)  <span class="hljs-comment"># Lite mode uses a local file path</span>
COLLECTION = <span class="hljs-string">&quot;kb_articles&quot;</span>
<span class="hljs-comment"># 3) Example data: three policy or FAQ entries (in practice, you can load and chunk data from files)</span>
DOCS = [
    {<span class="hljs-string">&quot;doc_id&quot;</span>: <span class="hljs-string">&quot;POLICY-001&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>: <span class="hljs-string">&quot;Refund Policy&quot;</span>, <span class="hljs-string">&quot;chunk&quot;</span>: <span class="hljs-string">&quot;Refunds are available within 30 days of purchase if the product is unused.&quot;</span>},
    {<span class="hljs-string">&quot;doc_id&quot;</span>: <span class="hljs-string">&quot;POLICY-002&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>: <span class="hljs-string">&quot;Exchange Policy&quot;</span>, <span class="hljs-string">&quot;chunk&quot;</span>: <span class="hljs-string">&quot;Exchanges are permitted within 15 days; original packaging required.&quot;</span>},
    {<span class="hljs-string">&quot;doc_id&quot;</span>: <span class="hljs-string">&quot;FAQ-101&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>: <span class="hljs-string">&quot;Shipping Time&quot;</span>, <span class="hljs-string">&quot;chunk&quot;</span>: <span class="hljs-string">&quot;Standard shipping usually takes 3–5 business days within the country.&quot;</span>},
]
<span class="hljs-comment"># 4) Generate embeddings using OpenAI (you can replace this with another embedding service)</span>
<span class="hljs-comment"># Here we use Parlant’s built-in OpenAI embedder for simplicity, but you could also call the OpenAI SDK directly.</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">OpenAIEmbedder</span>(p.Embedder):
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">embed</span>(<span class="hljs-params">self, texts: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>], hints: <span class="hljs-type">Dict</span>[<span class="hljs-built_in">str</span>, <span class="hljs-type">Any</span>] = {}</span>) -&gt; p.EmbeddingResult:
        <span class="hljs-comment"># Generate text embeddings using the OpenAI API, with timeout and retry handling</span>
        <span class="hljs-keyword">import</span> openai
        <span class="hljs-keyword">try</span>:
            client = openai.AsyncOpenAI(
                api_key=OPENAI_API_KEY,
                timeout=<span class="hljs-number">60.0</span>,  <span class="hljs-comment"># 60-second timeout</span>
                max_retries=<span class="hljs-number">2</span>  <span class="hljs-comment"># Retry up to 2 times</span>
            )
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Generating embeddings for <span class="hljs-subst">{<span class="hljs-built_in">len</span>(texts)}</span> texts...&quot;</span>)
            response = <span class="hljs-keyword">await</span> client.embeddings.create(
                model=<span class="hljs-string">&quot;text-embedding-3-small&quot;</span>,
                <span class="hljs-built_in">input</span>=texts
            )
            vectors = [data.embedding <span class="hljs-keyword">for</span> data <span class="hljs-keyword">in</span> response.data]
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Successfully generated <span class="hljs-subst">{<span class="hljs-built_in">len</span>(vectors)}</span> embeddings.&quot;</span>)
            <span class="hljs-keyword">return</span> p.EmbeddingResult(vectors=vectors)
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;OpenAI API call failed: <span class="hljs-subst">{e}</span>&quot;</span>)
            <span class="hljs-comment"># Return mock vectors for testing Milvus connectivity</span>
            <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Using mock vectors for testing...&quot;</span>)
            <span class="hljs-keyword">import</span> random
            vectors = [[random.random() <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">1536</span>)] <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> texts]
            <span class="hljs-keyword">return</span> p.EmbeddingResult(vectors=vectors)
<span class="hljs-meta">    @property</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">id</span>(<span class="hljs-params">self</span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;text-embedding-3-small&quot;</span>
<span class="hljs-meta">    @property</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">max_tokens</span>(<span class="hljs-params">self</span>) -&gt; <span class="hljs-built_in">int</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-number">8192</span>
<span class="hljs-meta">    @property</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">tokenizer</span>(<span class="hljs-params">self</span>) -&gt; p.EstimatingTokenizer:
        <span class="hljs-keyword">from</span> parlant.core.nlp.tokenization <span class="hljs-keyword">import</span> ZeroEstimatingTokenizer
        <span class="hljs-keyword">return</span> ZeroEstimatingTokenizer()
<span class="hljs-meta">    @property</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">dimensions</span>(<span class="hljs-params">self</span>) -&gt; <span class="hljs-built_in">int</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-number">1536</span>
embedder = OpenAIEmbedder()
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">ensure_collection_and_load</span>():
    <span class="hljs-comment"># Create the collection (schema: primary key, vector field, additional fields)</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> client.has_collection(COLLECTION):
        client.create_collection(
            collection_name=COLLECTION,
            dimension=<span class="hljs-built_in">len</span>((<span class="hljs-keyword">await</span> embedder.embed([<span class="hljs-string">&quot;dimension_probe&quot;</span>])).vectors[<span class="hljs-number">0</span>]),
            <span class="hljs-comment"># Default metric: COSINE (can be changed with metric_type=&quot;COSINE&quot;)</span>
            auto_id=<span class="hljs-literal">True</span>,
        )
        <span class="hljs-comment"># Create an index to speed up retrieval (HNSW used here as an example)</span>
        client.create_index(
            collection_name=COLLECTION,
            field_name=<span class="hljs-string">&quot;vector&quot;</span>,
            index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
            metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
            params={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">32</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>}
        )
    <span class="hljs-comment"># Insert data (skip if already exists; simple idempotent logic for the demo)</span>
    <span class="hljs-comment"># Generate embeddings</span>
    chunks = [d[<span class="hljs-string">&quot;chunk&quot;</span>] <span class="hljs-keyword">for</span> d <span class="hljs-keyword">in</span> DOCS]
    embedding_result = <span class="hljs-keyword">await</span> embedder.embed(chunks)
    vectors = embedding_result.vectors
    <span class="hljs-comment"># Check if the same doc_id already exists; this is for demo purposes only — real applications should use stricter deduplication</span>
    <span class="hljs-comment"># Here we insert directly. In production, use an upsert operation or an explicit primary key</span>
    client.insert(
        COLLECTION,
        data=[
            {<span class="hljs-string">&quot;vector&quot;</span>: vectors[i], <span class="hljs-string">&quot;doc_id&quot;</span>: DOCS[i][<span class="hljs-string">&quot;doc_id&quot;</span>], <span class="hljs-string">&quot;title&quot;</span>: DOCS[i][<span class="hljs-string">&quot;title&quot;</span>], <span class="hljs-string">&quot;chunk&quot;</span>: DOCS[i][<span class="hljs-string">&quot;chunk&quot;</span>]}
            <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(DOCS))
        ],
    )
    <span class="hljs-comment"># Load into memory</span>
    client.load_collection(COLLECTION)
<span class="hljs-comment"># 5) Define the vector search tool (Parlant Tool)</span>
<span class="hljs-meta">@p.tool</span>
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">vector_search</span>(<span class="hljs-params">context: p.ToolContext, query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span>, min_score: <span class="hljs-built_in">float</span> = <span class="hljs-number">0.35</span></span>) -&gt; p.ToolResult:
    <span class="hljs-comment"># 5.1 Generate the query vector</span>
    embed_res = <span class="hljs-keyword">await</span> embedder.embed([query])
    qvec = embed_res.vectors[<span class="hljs-number">0</span>]
    <span class="hljs-comment"># 5.2 Search Milvus</span>
    results = client.search(
        collection_name=COLLECTION,
        data=[qvec],
        limit=top_k,
        output_fields=[<span class="hljs-string">&quot;doc_id&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;chunk&quot;</span>],
        search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;ef&quot;</span>: <span class="hljs-number">128</span>}},
    )
    <span class="hljs-comment"># 5.3 Assemble structured evidence and filter by score threshold</span>
    hits = []
    <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
        score = hit[<span class="hljs-string">&quot;distance&quot;</span>] <span class="hljs-keyword">if</span> <span class="hljs-string">&quot;distance&quot;</span> <span class="hljs-keyword">in</span> hit <span class="hljs-keyword">else</span> hit.get(<span class="hljs-string">&quot;score&quot;</span>, <span class="hljs-number">0.0</span>)
        <span class="hljs-keyword">if</span> score &gt;= min_score:
            hits.append({
                <span class="hljs-string">&quot;doc_id&quot;</span>: hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;doc_id&quot;</span>],
                <span class="hljs-string">&quot;title&quot;</span>: hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;title&quot;</span>],
                <span class="hljs-string">&quot;chunk&quot;</span>: hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;chunk&quot;</span>],
                <span class="hljs-string">&quot;score&quot;</span>: <span class="hljs-built_in">float</span>(score),
            })
    <span class="hljs-keyword">return</span> p.ToolResult({<span class="hljs-string">&quot;evidence&quot;</span>: hits})
<span class="hljs-comment"># 6) Run Parlant Server and create the Agent + Guidelines</span>
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">main</span>():
    <span class="hljs-keyword">await</span> ensure_collection_and_load()
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">with</span> p.Server() <span class="hljs-keyword">as</span> server:
        agent = <span class="hljs-keyword">await</span> server.create_agent(
            name=<span class="hljs-string">&quot;Policy Assistant&quot;</span>,
            description=<span class="hljs-string">&quot;Rule-controlled RAG assistant with Milvus Lite&quot;</span>,
        )
        <span class="hljs-comment"># Example variable: current time (can be used in templates or logs)</span>
<span class="hljs-meta">        @p.tool</span>
        <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">get_datetime</span>(<span class="hljs-params">context: p.ToolContext</span>) -&gt; p.ToolResult:
            <span class="hljs-keyword">from</span> datetime <span class="hljs-keyword">import</span> datetime
            <span class="hljs-keyword">return</span> p.ToolResult({<span class="hljs-string">&quot;now&quot;</span>: datetime.now().isoformat()})
        <span class="hljs-keyword">await</span> agent.create_variable(name=<span class="hljs-string">&quot;current-datetime&quot;</span>, tool=get_datetime)
        <span class="hljs-comment"># Core Guideline 1: Run vector search for factual or policy-related questions</span>
        <span class="hljs-keyword">await</span> agent.create_guideline(
            condition=<span class="hljs-string">&quot;User asks a factual question about policy, refund, exchange, or shipping&quot;</span>,
            action=(
                <span class="hljs-string">&quot;Call vector_search with the user&#x27;s query. &quot;</span>
                <span class="hljs-string">&quot;If evidence is found, synthesize an answer by quoting key sentences and cite doc_id/title. &quot;</span>
                <span class="hljs-string">&quot;If evidence is insufficient, ask a clarifying question before answering.&quot;</span>
            ),
            tools=[vector_search],
        )
        <span class="hljs-comment"># Core Guideline 2: Use a standardized, structured response when evidence is available</span>
        <span class="hljs-keyword">await</span> agent.create_guideline(
            condition=<span class="hljs-string">&quot;Evidence is available&quot;</span>,
            action=(
                <span class="hljs-string">&quot;Answer with the following template:\\n&quot;</span>
                <span class="hljs-string">&quot;Summary: provide a concise conclusion.\\n&quot;</span>
                <span class="hljs-string">&quot;Key points: 2-3 bullets distilled from evidence.\\n&quot;</span>
                <span class="hljs-string">&quot;Sources: list doc_id and title.\\n&quot;</span>
                <span class="hljs-string">&quot;Note: if confidence is low, state limitations and ask for clarification.&quot;</span>
            ),
            tools=[],
        )
        <span class="hljs-comment"># Hint: Local Playground URL</span>
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Playground: &lt;http://localhost:8800&gt;&quot;</span>)
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    asyncio.run(main())
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Run-the-Code" class="common-anchor-header">الخطوة 4: تشغيل الكود</h3><pre><code translate="no"><span class="hljs-comment"># Run the main program</span>
python main.py
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/python_main_eb7d7c6d73.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ul>
<li>قم بزيارة ساحة اللعب:</li>
</ul>
<pre><code translate="no">&lt;<span class="hljs-attr">http</span>:<span class="hljs-comment">//localhost:8800&gt;</span>
<button class="copy-code-btn"></button></code></pre>
<p>لقد نجحت الآن في بناء نظام أسئلة وأجوبة ذكي باستخدام بارلانت وميلفوس.</p>
<h2 id="Parlant-vs-LangChainLlamaIndex-How-They-Differ-and-How-They-Work-Together" class="common-anchor-header">Parlant مقابل LangChain/LlamaIndex: كيف يختلفان وكيف يعملان معاً<button data-href="#Parlant-vs-LangChainLlamaIndex-How-They-Differ-and-How-They-Work-Together" class="anchor-icon" translate="no">
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
    </button></h2><p>مقارنةً بأطر عمل الوكلاء الحاليين مثل <strong>LangChain</strong> أو <strong>LlamaIndex،</strong> كيف يختلف بارلانت عن أطر عمل الوكلاء الحاليين مثل <strong>LangChain</strong> أو LlamaIndex؟</p>
<p>إن LangChain و LlamaIndex هما إطارا عمل للأغراض العامة. فهي توفر مجموعة واسعة من المكونات والتكاملات، مما يجعلها مثالية للنماذج الأولية السريعة والتجارب البحثية. ومع ذلك، عندما يتعلق الأمر بالنشر في الإنتاج، غالبًا ما يحتاج المطورون إلى بناء طبقات إضافية بأنفسهم - مثل إدارة القواعد، والتحقق من الامتثال، وآليات الموثوقية - للحفاظ على اتساق الوكلاء وجدارتهم بالثقة.</p>
<p>يوفر Parlant إدارة المبادئ التوجيهية المدمجة، وآليات النقد الذاتي، وأدوات التوضيح التي تساعد المطورين على إدارة كيفية تصرف الوكيل واستجابته وأسبابه. هذا يجعل Parlant مناسبًا بشكل خاص لحالات الاستخدام عالية المخاطر التي تواجه العملاء حيث تكون الدقة والمساءلة مهمة، مثل الخدمات المالية والرعاية الصحية والخدمات القانونية.</p>
<p>في الواقع، يمكن أن تعمل هذه الأطر معًا:</p>
<ul>
<li><p>استخدم LangChain لإنشاء خطوط أنابيب معقدة لمعالجة البيانات أو تدفقات عمل الاسترجاع.</p></li>
<li><p>استخدم Parlant لإدارة طبقة التفاعل النهائية، مما يضمن أن المخرجات تتبع قواعد العمل وتظل قابلة للتفسير.</p></li>
<li><p>استخدم Milvus كأساس لقاعدة بيانات المتجهات لتقديم بحث دلالي في الوقت الحقيقي، والذاكرة، واسترجاع المعرفة عبر النظام.</p></li>
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
    </button></h2><p>مع انتقال وكلاء LLM من مرحلة التجريب إلى مرحلة الإنتاج، لم يعد السؤال الرئيسي هو ما يمكنهم القيام به - بل كيف يمكنهم القيام بذلك بشكل موثوق وآمن. توفر Parlant الهيكلية والتحكم لهذه الموثوقية، بينما توفر Milvus البنية التحتية القابلة للتطوير التي تحافظ على سرعة كل شيء وتراعي السياق.</p>
<p>ويسمحان معًا للمطورين ببناء وكلاء ذكاء اصطناعي ليسوا فقط قادرين على القيام بذلك، بل جديرين بالثقة وقابلين للتفسير وجاهزين للإنتاج.</p>
<p>🚀 تحقق من<a href="https://github.com/emcie-co/parlant?utm_source=chatgpt.com"> Parlant على GitHub</a> وقم بدمجه مع<a href="https://milvus.io"> Milvus</a> لبناء نظام الوكيل الذكي الخاص بك القائم على القواعد.</p>
<p>هل لديك أسئلة أو تريد التعمق في أي ميزة؟ انضم إلى<a href="https://discord.com/invite/8uyFbECzPX"> قناة Discord</a> الخاصة بنا أو قم بتسجيل المشكلات على<a href="https://github.com/milvus-io/milvus"> GitHub</a>. يمكنك أيضًا حجز جلسة فردية مدتها 20 دقيقة للحصول على رؤى وإرشادات وإجابات على أسئلتك من خلال<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> ساعات عمل Milvus المكتبية</a>.</p>
