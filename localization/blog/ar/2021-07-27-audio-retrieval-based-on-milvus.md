---
id: audio-retrieval-based-on-milvus.md
title: تقنيات المعالجة
author: Shiyu Chen
date: 2021-07-27T03:05:57.524Z
desc: >-
  يتيح استرجاع الصوت باستخدام Milvus إمكانية تصنيف البيانات الصوتية وتحليلها في
  الوقت الفعلي.
cover: assets.zilliz.com/blog_audio_search_56b990cee5.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/audio-retrieval-based-on-milvus'
---
<custom-h1>استرجاع الصوت استناداً إلى ميلفوس</custom-h1><p>الصوت هو نوع بيانات كثيف المعلومات. على الرغم من أنه قد يبدو قديمًا في عصر محتوى الفيديو، إلا أن الصوت لا يزال مصدرًا أساسيًا للمعلومات بالنسبة للعديد من الأشخاص. على الرغم من الانخفاض طويل الأجل في عدد المستمعين، فقد استمع 83% من الأمريكيين الذين تبلغ أعمارهم 12 عامًا أو أكثر إلى الراديو الأرضي (AM / FM) في أسبوع معين في عام 2020 (انخفاضًا من 89% في عام 2019). وعلى العكس من ذلك، شهد الصوت عبر الإنترنت ارتفاعًا مطردًا في عدد المستمعين على مدار العقدين الماضيين، حيث أفادت <a href="https://www.journalism.org/fact-sheet/audio-and-podcasting/">دراسة مركز بيو للأبحاث</a> نفسها أن 62% من الأمريكيين يستمعون إلى شكل من أشكاله أسبوعيًا.</p>
<p>كموجة، يتضمن الصوت أربع خصائص: التردد والسعة والشكل الموجي والمدة. وفي المصطلحات الموسيقية، تُسمى هذه الخصائص بطبقة الصوت والديناميكية والنغمة والمدة. تساعد الأصوات أيضًا البشر والحيوانات الأخرى على إدراك وفهم بيئتنا وفهمها، حيث توفر أدلة على سياق موقع وحركة الأشياء في محيطنا.</p>
<p>وباعتباره ناقل للمعلومات، يمكن تصنيف الصوت إلى ثلاث فئات:</p>
<ol>
<li><strong>الكلام:</strong> وسيط تواصل يتألف من كلمات وقواعد نحوية. يمكن تحويل الكلام إلى نص باستخدام خوارزميات التعرّف على الكلام.</li>
<li><strong>الموسيقى:</strong> أصوات صوتية و/أو آلات موسيقية مدمجة لإنتاج مقطوعة تتألف من اللحن والتناغم والإيقاع والجرس. يمكن تمثيل الموسيقى بنوتة موسيقية.</li>
<li><strong>الشكل الموجي:</strong> إشارة صوتية رقمية يتم الحصول عليها من خلال رقمنة الأصوات التناظرية. يمكن أن تمثل الأشكال الموجية الكلام والموسيقى والأصوات الطبيعية أو المركبة.</li>
</ol>
<p>يمكن استخدام استرجاع الصوت للبحث عن الوسائط عبر الإنترنت ومراقبتها في الوقت الفعلي للقضاء على انتهاك حقوق الملكية الفكرية. كما يضطلع بدور مهم في تصنيف البيانات الصوتية وتحليلها إحصائياً.</p>
<h2 id="Processing-Technologies" class="common-anchor-header">تقنيات المعالجة<button data-href="#Processing-Technologies" class="anchor-icon" translate="no">
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
    </button></h2><p>يتميز كل من الكلام والموسيقى والأصوات العامة الأخرى بخصائص فريدة ويتطلب أساليب معالجة مختلفة. عادةً ما يتم تقسيم الصوت إلى مجموعات تحتوي على كلام ومجموعات لا تحتوي على كلام:</p>
<ul>
<li>تتم معالجة الصوت الكلام عن طريق التعرف التلقائي على الكلام.</li>
<li>تتم معالجة الصوت غير الكلامي، بما في ذلك الصوت الموسيقي والمؤثرات الصوتية وإشارات الكلام المرقمنة، باستخدام أنظمة استرجاع الصوت.</li>
</ul>
<p>تركز هذه المقالة على كيفية استخدام نظام استرجاع الصوت لمعالجة البيانات الصوتية غير الكلامية. لا تتم تغطية التعرف على الكلام في هذه المقالة</p>
<h3 id="Audio-feature-extraction" class="common-anchor-header">استخراج ميزات الصوت</h3><p>يعتبر استخلاص الميزات أهم تقنية في أنظمة استرجاع الصوت لأنه يتيح البحث عن تشابه الصوت. تنقسم طرق استخراج الميزات الصوتية إلى فئتين:</p>
<ul>
<li>نماذج استخراج الميزات الصوتية التقليدية مثل نماذج المزيج الغوسي (GMMs) ونماذج ماركوف المخفية (HMMs);</li>
<li>نماذج استخراج السمات الصوتية القائمة على التعلم العميق، مثل الشبكات العصبية المتكررة (RNNs)، وشبكات الذاكرة طويلة المدى (LSTM)، وأطر الترميز وفك التشفير، وآليات الانتباه، وما إلى ذلك.</li>
</ul>
<p>تتمتع النماذج القائمة على التعلّم العميق بمعدل خطأ أقل من النماذج التقليدية بمقدار كبير، وبالتالي تكتسب زخمًا كتقنية أساسية في مجال معالجة الإشارات الصوتية.</p>
<p>عادةً ما يتم تمثيل البيانات الصوتية من خلال الميزات الصوتية المستخرجة. تقوم عملية الاسترجاع بالبحث عن هذه السمات والسمات ومقارنتها بدلاً من البيانات الصوتية نفسها. لذلك، تعتمد فعالية استرجاع التشابه الصوتي إلى حد كبير على جودة استخراج السمات.</p>
<p>في هذه المقالة، يتم استخدام <a href="https://github.com/qiuqiangkong/audioset_tagging_cnn">الشبكات العصبية الصوتية واسعة النطاق المدربة مسبقًا للتعرف على الأنماط الصوتية (PANNs)</a> لاستخراج متجهات السمات بمتوسط دقة (mAP) يبلغ 0.439 (هيرشي وآخرون، 2017).</p>
<p>بعد استخراج متجهات السمات للبيانات الصوتية، يمكننا تنفيذ تحليل متجهات السمات عالي الأداء باستخدام Milvus.</p>
<h3 id="Vector-similarity-search" class="common-anchor-header">البحث عن تشابه المتجهات</h3><p><a href="https://milvus.io/">Milvus</a> عبارة عن قاعدة بيانات متجهات سحابية مفتوحة المصدر ومفتوحة المصدر تم إنشاؤها لإدارة متجهات التضمين التي تم إنشاؤها بواسطة نماذج التعلم الآلي والشبكات العصبية. ويُستخدم على نطاق واسع في سيناريوهات مثل الرؤية الحاسوبية ومعالجة اللغات الطبيعية والكيمياء الحاسوبية وأنظمة التوصية الشخصية وغيرها.</p>
<p>يصور الرسم البياني التالي عملية البحث عن التشابه العامة باستخدام ميلفوس: <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_does_milvus_work_6926180543.png" alt="how-does-milvus-work.png" class="doc-image" id="how-does-milvus-work.png" /><span>كيف-يفعل-ميلفوس-عمل.png</span> </span></p>
<ol>
<li>يتم تحويل البيانات غير المهيكلة إلى متجهات ميزات بواسطة نماذج التعلم العميق وإدراجها في Milvus.</li>
<li>يقوم ميلفوس بتخزين وفهرسة متجهات الميزات هذه.</li>
<li>عند الطلب، يبحث ميلفوس عن المتجهات الأكثر تشابهًا مع متجه الاستعلام ويعيدها.</li>
</ol>
<h2 id="System-overview" class="common-anchor-header">نظرة عامة على النظام<button data-href="#System-overview" class="anchor-icon" translate="no">
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
    </button></h2><p>يتكون نظام استرجاع الصوت بشكل أساسي من جزأين: الإدراج (الخط الأسود) والبحث (الخط الأحمر).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/audio_retrieval_system_663a911c95.png" alt="audio-retrieval-system.png" class="doc-image" id="audio-retrieval-system.png" />
   </span> <span class="img-wrapper"> <span>Audio-retrieval-نظام-استرجاع الصوت.png</span> </span></p>
<p>تحتوي مجموعة البيانات النموذجية المستخدمة في هذا المشروع على أصوات ألعاب مفتوحة المصدر، والشفرة مفصلة في <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/audio_similarity_search">مخيم ميلفوس التمهيدي</a>.</p>
<h3 id="Step-1-Insert-data" class="common-anchor-header">الخطوة 1: إدراج البيانات</h3><p>فيما يلي مثال على الكود البرمجي لتوليد تضمينات صوتية باستخدام نموذج استدلال PANNs المدرب مسبقًا وإدراجها في Milvus، والذي يعيّن معرّفًا فريدًا لكل تضمين متجه.</p>
<pre><code translate="no"><span class="hljs-number">1</span> wav_name, vectors_audio = get_audio_embedding(audio_path)  
<span class="hljs-number">2</span> <span class="hljs-keyword">if</span> vectors_audio:    
<span class="hljs-number">3</span>     embeddings.<span class="hljs-built_in">append</span>(vectors_audio)  
<span class="hljs-number">4</span>     wav_names.<span class="hljs-built_in">append</span>(wav_name)  
<span class="hljs-number">5</span> ids_milvus = insert_vectors(milvus_client, table_name, embeddings)  
<span class="hljs-number">6</span> 
<button class="copy-code-btn"></button></code></pre>
<p>ثم يتم تخزين معرفات <strong>ids_milvus</strong> التي تم إرجاعها مع المعلومات الأخرى ذات الصلة (مثل <strong>wav_name</strong>) للبيانات الصوتية المحفوظة في قاعدة بيانات MySQL للمعالجة اللاحقة.</p>
<pre><code translate="no">1 get_ids_correlation(ids_milvus, wav_name)  
2 load_data_to_mysql(conn, cursor, table_name)    
3  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Audio-search" class="common-anchor-header">الخطوة 2: البحث عن الصوت</h3><p>يقوم Milvus بحساب مسافة الضرب الداخلي بين متجهات الميزات المخزنة مسبقًا ومتجهات ميزات الإدخال، المستخرجة من بيانات الصوت المستعلم باستخدام نموذج الاستدلال PANNs، وإرجاع <strong>ids_milvus</strong> لمتجهات الميزات المتشابهة، والتي تتوافق مع البيانات الصوتية التي تم البحث عنها.</p>
<pre><code translate="no"><span class="hljs-number">1</span> _, vectors_audio = get_audio_embedding(audio_filename)    
<span class="hljs-number">2</span> results = search_vectors(milvus_client, table_name, [vectors_audio], METRIC_TYPE, TOP_K)  
<span class="hljs-number">3</span> ids_milvus = [x.<span class="hljs-built_in">id</span> <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]]  
<span class="hljs-number">4</span> audio_name = search_by_milvus_ids(conn, cursor, ids_milvus, table_name)    
<span class="hljs-number">5</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="API-reference-and-demo" class="common-anchor-header">مرجع واجهة برمجة التطبيقات والعرض التوضيحي<button data-href="#API-reference-and-demo" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="API" class="common-anchor-header">واجهة برمجة التطبيقات</h3><p>تم بناء نظام استرجاع الصوت هذا بكود مفتوح المصدر. ميزاته الرئيسية هي إدراج البيانات الصوتية وحذفها. يمكن عرض جميع واجهات برمجة التطبيقات عن طريق كتابة <strong>127.0.0.1:<port></strong> /docs في المتصفح.</p>
<h3 id="Demo" class="common-anchor-header">العرض التوضيحي</h3><p>نستضيف عرضًا توضيحيًا <a href="https://zilliz.com/solutions">مباشرًا</a> لنظام استرجاع الصوت المستند إلى Milvus عبر الإنترنت يمكنك تجربته باستخدام بياناتك الصوتية الخاصة.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/audio_search_demo_cae60625db.png" alt="audio-search-demo.png" class="doc-image" id="audio-search-demo.png" />
   </span> <span class="img-wrapper"> <span>Audio-search-demo.png</span> </span></p>
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
    </button></h2><p>في عصر البيانات الضخمة، يجد الناس أن حياتهم مليئة بجميع أنواع المعلومات. ولتحقيق فهم أفضل لها، فإن استرجاع النصوص التقليدية لم يعد يفي بالغرض. تكنولوجيا استرجاع المعلومات اليوم في حاجة ماسة إلى استرجاع مختلف أنواع البيانات غير المهيكلة، مثل مقاطع الفيديو والصور والصوت.</p>
<p>يمكن تحويل البيانات غير المهيكلة، التي يصعب على أجهزة الكمبيوتر معالجتها، إلى متجهات ميزات باستخدام نماذج التعلم العميق. يمكن معالجة هذه البيانات المحوّلة بسهولة بواسطة الآلات، مما يمكّننا من تحليل البيانات غير المهيكلة بطرق لم يتمكن أسلافنا من القيام بها. يمكن لـ Milvus، وهي قاعدة بيانات متجهات مفتوحة المصدر، معالجة متجهات السمات المستخرجة بواسطة نماذج الذكاء الاصطناعي بكفاءة، كما توفر مجموعة متنوعة من حسابات تشابه المتجهات الشائعة.</p>
<h2 id="References" class="common-anchor-header">المراجع<button data-href="#References" class="anchor-icon" translate="no">
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
    </button></h2><p>Hershey, S., Chaudhuri, S., Ellis, D.P., Gemmeke, J.F., Jansen, A., Moore, R.C., Plakal, M., Platt, D., Saurous, R.A., Seybold, B. and Slaney, M., 2017, March. بنية شبكة CNN لتصنيف الصوت على نطاق واسع. في مؤتمر IEEE الدولي للصوتيات والكلام ومعالجة الإشارات (ICASSP) لعام 2017، ص 131-135، 2017</p>
<h2 id="Dont-be-a-stranger" class="common-anchor-header">لا تكن غريبًا<button data-href="#Dont-be-a-stranger" class="anchor-icon" translate="no">
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
<li><p>ابحث أو ساهم في Milvus على <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</p></li>
<li><p>تفاعل مع المجتمع عبر <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</p></li>
<li><p>تواصل معنا على <a href="https://twitter.com/milvusio">تويتر</a>.</p></li>
</ul>
