---
id: >-
  vllm-semantic-router-milvus-how-semantic-routing-and-caching-scale-ai-systems-the-smart-way.md
title: >-
  جهاز التوجيه الدلالي vLLM + ميلفوس: كيف يمكن للتوجيه الدلالي والتخزين المؤقت
  بناء أنظمة ذكاء اصطناعي قابلة للتطوير بالطريقة الذكية
author: Min Yin
date: 2025-10-17T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Oct_19_2025_04_30_18_PM_af7fda1170.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, semantic routing, cache layer, vector database, vllm semantic router'
meta_title: Scale Your AI Apps the Smart Way with vLLM Semantic Router and Milvus
desc: >-
  تعرّف على كيفية تحسين الاستدلال على النماذج الكبيرة وتقليل تكاليف الحوسبة
  وتعزيز أداء الذكاء الاصطناعي عبر عمليات النشر القابلة للتطوير.
origin: >-
  https://milvus.io/blog/vllm-semantic-router-milvus-how-semantic-routing-and-caching-scale-ai-systems-the-smart-way.md
---
<p>تعتمد معظم تطبيقات الذكاء الاصطناعي على نموذج واحد لكل طلب. لكن هذا النهج سرعان ما يصطدم بحدود. فالنماذج الكبيرة قوية ولكنها مكلفة، حتى عند استخدامها للاستعلامات البسيطة. أما النماذج الأصغر حجماً فهي أرخص وأسرع ولكنها لا تستطيع التعامل مع المنطق المعقد. عندما ترتفع حركة المرور - لنفترض أن تطبيق الذكاء الاصطناعي الخاص بك ينتشر فجأة مع عشرة ملايين مستخدم بين عشية وضحاها - يصبح عدم كفاءة هذا الإعداد القائم على نموذج واحد للجميع واضحًا بشكل مؤلم. يرتفع زمن الوصول، وترتفع فواتير وحدة معالجة الرسومات، ويبدأ النموذج الذي كان يعمل بشكل جيد بالأمس في اللهاث من أجل الهواء.</p>
<p>ويتعين <em>عليك</em> يا صديقي، <em>أنت</em> المهندس الذي يقف وراء هذا التطبيق، أن تصلح الأمر بسرعة.</p>
<p>تخيل نشر نماذج متعددة بأحجام مختلفة وجعل نظامك يختار تلقائياً أفضلها لكل طلب. الطلبات البسيطة تذهب إلى النماذج الأصغر؛ أما الطلبات المعقدة فتذهب إلى النماذج الأكبر. هذه هي الفكرة وراء <a href="https://github.com/vllm-project/semantic-router"><strong>الموجه الدلالي vLLM Semantic Router - وهي</strong></a>آلية توجيه توجه الطلبات بناءً على المعنى، وليس على نقاط النهاية. حيث يقوم بتحليل المحتوى الدلالي والتعقيد والقصد من كل مدخلات لتحديد النموذج اللغوي الأنسب، مما يضمن معالجة كل استعلام بواسطة النموذج الأفضل تجهيزًا له.</p>
<p>ولجعل هذا الأمر أكثر كفاءة، يقترن الموجه الدلالي مع <a href="https://milvus.io/"><strong>Milvus،</strong></a> وهي قاعدة بيانات متجهة مفتوحة المصدر تعمل <strong>كطبقة تخزين مؤقت دلالي</strong>. قبل إعادة حساب الاستجابة، يتحقق الموجه الدلالي مما إذا كان قد تمت معالجة استعلام مشابه دلالياً بالفعل ويسترجع النتيجة المخزنة مؤقتاً على الفور إذا تم العثور عليها. والنتيجة: استجابات أسرع، وتكاليف أقل، ونظام استرجاع يتوسع بذكاء بدلاً من الإهدار.</p>
<p>في هذا المنشور، سنتعمق أكثر في كيفية عمل الموجه <strong>الدلالي vLLM،</strong> وكيف يعمل <strong>Milvus</strong> على تشغيل طبقة التخزين المؤقت الخاصة به، وكيف يمكن تطبيق هذه البنية في تطبيقات الذكاء الاصطناعي في العالم الحقيقي.</p>
<h2 id="What-is-a-Semantic-Router" class="common-anchor-header">ما هو الموجه الدلالي؟<button data-href="#What-is-a-Semantic-Router" class="anchor-icon" translate="no">
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
    </button></h2><p>في جوهره، الموجه <strong>الدلالي</strong> هو نظام يقرر <em>أي نموذج</em> يجب أن يتعامل مع طلب معين بناءً على معناه وتعقيده وقصده. فبدلاً من توجيه كل شيء إلى نموذج واحد، يقوم بتوزيع الطلبات بذكاء عبر نماذج متعددة لتحقيق التوازن بين الدقة والكمون والتكلفة.</p>
<p>من الناحية المعمارية، فهو مبني على ثلاث طبقات رئيسية: <strong>التوجيه</strong> الدلالي، <strong>ومزيج النماذج (MoM)</strong>، وطبقة <strong>التخزين المؤقت</strong>.</p>
<h3 id="Semantic-Routing-Layer" class="common-anchor-header">طبقة التوجيه الدلالي</h3><p><strong>طبقة التوجيه الدلالي</strong> هي العقل المدبر للنظام. فهي تحلل كل مدخل - ما الذي يطلبه، ومدى تعقيده، ونوع الاستدلال الذي يتطلبه - لتحديد النموذج الأنسب للمهمة. على سبيل المثال، قد يتم توجيه عملية بحث بسيطة عن الحقائق إلى نموذج خفيف الوزن، بينما يتم توجيه استعلام استدلالي متعدد الخطوات إلى نموذج أكبر. يحافظ هذا التوجيه الديناميكي على استجابة النظام حتى مع زيادة حركة المرور وتنوع الاستعلامات.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/modern_approach_714403b61c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="The-Mixture-of-Models-MoM-Layer" class="common-anchor-header">طبقة مزيج النماذج (MoM)</h3><p>تدمج الطبقة الثانية، وهي طبقة مزيج <strong>النماذج (MoM)</strong>، نماذج متعددة ذات أحجام وقدرات مختلفة في نظام واحد موحد. وهي مستوحاة من بنية مزيج <a href="https://zilliz.com/learn/what-is-mixture-of-experts"><strong>النماذج</strong></a> <strong>(MoE)</strong> ، ولكن بدلاً من اختيار "خبراء" داخل نموذج واحد كبير، فإنها تعمل عبر نماذج مستقلة متعددة. يقلل هذا التصميم من زمن الاستجابة ويقلل من التكاليف ويتجنب التقيد بأي مزود نموذج واحد.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/MOM_0a3eb61985.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="The-Cache-Layer-Where-Milvus-Makes-the-Difference" class="common-anchor-header">طبقة التخزين المؤقت: حيث يصنع ميلفوس الفرق</h3><p>أخيرًا، <a href="https://milvus.io/">تعمل</a> <strong>طبقة ذاكرة التخزين المؤقت -</strong>التي تعمل بواسطة <a href="https://milvus.io/">قاعدة بيانات Milvus Vector Database -</a>بمثابة ذاكرة النظام. قبل تشغيل استعلام جديد، فإنها تتحقق مما إذا كان قد تمت معالجة طلب مشابه من الناحية الدلالية من قبل. إذا كان الأمر كذلك، فإنه يسترجع النتيجة المخزنة مؤقتًا على الفور، مما يوفر وقت الحوسبة ويحسن الإنتاجية.</p>
<p>تعتمد أنظمة التخزين المؤقت التقليدية على مخازن القيمة الرئيسية في الذاكرة، ومطابقة الطلبات حسب السلاسل أو القوالب الدقيقة. يعمل ذلك بشكل جيد عندما تكون الاستعلامات متكررة ومتوقعة. لكن المستخدمين الحقيقيين نادراً ما يكتبون نفس الشيء مرتين. وبمجرد أن تتغير الصياغة - ولو بشكل طفيف - تفشل ذاكرة التخزين المؤقت في التعرف على نفس القصد. وبمرور الوقت، ينخفض معدل الوصول إلى ذاكرة التخزين المؤقت، وتتلاشى مكاسب الأداء مع انحراف اللغة بشكل طبيعي.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/semantic_caching_for_vllm_routing_df889058c9.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>لإصلاح ذلك، نحتاج إلى تخزين مؤقت يفهم <em>المعنى،</em> وليس فقط الكلمات المطابقة. وهنا يأتي دور <strong>الاسترجاع الدلالي</strong>. فبدلاً من مقارنة السلاسل، فإنه يقارن بين التمثيلات المتجهة عالية الأبعاد التي تلتقط التشابه الدلالي. لكن التحدي يكمن في الحجم. إن إجراء بحث بالقوة الغاشمة عبر ملايين أو مليارات المتجهات على جهاز واحد (مع تعقيد زمني O(N-d)) أمر باهظ من الناحية الحسابية. حيث تنفجر تكاليف الذاكرة، وتنهار قابلية التوسع الأفقي، ويكافح النظام للتعامل مع الارتفاع المفاجئ في حركة المرور أو الاستعلامات الطويلة.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_routing_system_5837b93074.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>وباعتبارها قاعدة بيانات متجهة موزعة مصممة خصيصًا للبحث الدلالي واسع النطاق، توفر <strong>Milvus</strong> قابلية التوسع الأفقي والتسامح مع الأخطاء التي تحتاجها طبقة التخزين المؤقت هذه. فهو يخزّن التضمينات بكفاءة عبر العُقد ويقوم بإجراء عمليات بحث <a href="https://zilliz.com/blog/ANN-machine-learning">تقريبية لأقرب جار</a>(ANN) بأقل زمن استجابة، حتى على نطاق واسع. باستخدام عتبات التشابه الصحيحة والاستراتيجيات الاحتياطية الصحيحة، يضمن Milvus أداءً مستقرًا ويمكن التنبؤ به - مما يحول طبقة التخزين المؤقت إلى ذاكرة دلالية مرنة لنظام التوجيه بأكمله.</p>
<h2 id="How-Developers-Are-Using-Semantic-Router-+-Milvus-in-Production" class="common-anchor-header">كيف يستخدم المطورون الموجه الدلالي + Milvus في الإنتاج<button data-href="#How-Developers-Are-Using-Semantic-Router-+-Milvus-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>يتألق الجمع بين الموجه <strong>الدلالي vLLM Semantic Router</strong> <strong>وMilvus</strong> في بيئات الإنتاج في العالم الحقيقي حيث تكون السرعة والتكلفة وقابلية إعادة الاستخدام كلها أمور مهمة.</p>
<p>تبرز ثلاثة سيناريوهات شائعة:</p>
<h3 id="1-Customer-Service-QA" class="common-anchor-header">1. أسئلة وأجوبة خدمة العملاء</h3><p>تتعامل الروبوتات التي تواجه العملاء مع كميات هائلة من الاستفسارات المتكررة كل يوم - إعادة تعيين كلمة المرور وتحديثات الحساب وحالات التسليم. هذا المجال حساس من حيث التكلفة وزمن الاستجابة، مما يجعله مثاليًا للتوجيه الدلالي. يرسل الموجه الأسئلة الروتينية إلى نماذج أصغر وأسرع ويصعّد الأسئلة المعقدة أو الغامضة إلى نماذج أكبر للاستدلال الأعمق. في هذه الأثناء، يقوم ميلفوس بتخزين أزواج الأسئلة والأجوبة السابقة مؤقتًا، لذا عندما تظهر استفسارات مماثلة، يمكن للنظام إعادة استخدام الإجابات السابقة على الفور بدلاً من إعادة توليدها.</p>
<h3 id="2-Code-Assistance" class="common-anchor-header">2. المساعدة البرمجية</h3><p>في أدوات المطوّرين أو مساعدي IDE، تتداخل العديد من الاستعلامات - مساعدة في بناء الجملة، والبحث عن واجهة برمجة التطبيقات، وتلميحات صغيرة لتصحيح الأخطاء. من خلال تحليل البنية الدلالية لكل مطالبة، يختار الموجه ديناميكيًا حجم النموذج المناسب: خفيف الوزن للمهام البسيطة، وأكثر قدرة على التفكير متعدد الخطوات. يعزز Milvus الاستجابة بشكل أكبر من خلال التخزين المؤقت لمشاكل الترميز المماثلة وحلولها، مما يحول تفاعلات المستخدم السابقة إلى قاعدة معرفية قابلة لإعادة الاستخدام.</p>
<h3 id="3-Enterprise-Knowledge-Base" class="common-anchor-header">3. قاعدة المعرفة المؤسسية</h3><p>تميل الاستعلامات المؤسسية إلى التكرار بمرور الوقت - عمليات البحث عن السياسات، ومراجع الامتثال، والأسئلة الشائعة حول المنتجات. مع استخدام Milvus كطبقة تخزين مؤقت دلالي، يمكن تخزين الأسئلة المتكررة وإجاباتها واسترجاعها بكفاءة. وهذا يقلل من العمليات الحسابية الزائدة عن الحاجة مع الحفاظ على اتساق الإجابات عبر الأقسام والمناطق.</p>
<p>تحت غطاء المحرك، يتم تنفيذ خط أنابيب <strong>الموجه الدلالي + Milvus</strong> <strong>بلغة Go</strong> <strong>وRust</strong> لتحقيق أداء عالٍ وزمن استجابة منخفض. وهو مدمج في طبقة البوابة، ويراقب باستمرار المقاييس الرئيسية - مثل معدلات الوصول، وزمن انتقال التوجيه، وأداء النموذج - لضبط استراتيجيات التوجيه في الوقت الفعلي.</p>
<h2 id="How-to-Quickly-Test-the-Semantic-Caching-in-the-Semantic-Router" class="common-anchor-header">كيفية اختبار التخزين المؤقت الدلالي بسرعة في الموجه الدلالي<button data-href="#How-to-Quickly-Test-the-Semantic-Caching-in-the-Semantic-Router" class="anchor-icon" translate="no">
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
    </button></h2><p>قبل نشر التخزين المؤقت الدلالي على نطاق واسع، من المفيد التحقق من صحة سلوكه في إعداد محكوم. في هذا القسم، سنقوم في هذا القسم بإجراء اختبار محلي سريع يوضح كيفية استخدام الموجه الدلالي ل <strong>Milvus</strong> كذاكرة تخزين مؤقت دلالية. سترى كيف تصل الاستعلامات المتشابهة إلى ذاكرة التخزين المؤقت على الفور بينما تؤدي الاستعلامات الجديدة أو المتميزة إلى إنشاء نموذج - مما يثبت منطق التخزين المؤقت أثناء العمل.</p>
<h3 id="Prerequisites" class="common-anchor-header">المتطلبات الأساسية</h3><ul>
<li>بيئة الحاوية: Docker + Docker Compose</li>
<li>قاعدة بيانات المتجهات: خدمة ميلفوس</li>
<li>LLM + التضمين: تنزيل المشروع محلياً</li>
</ul>
<h3 id="1Deploy-the-Milvus-Vector-Database" class="common-anchor-header">1- نشر قاعدة بيانات Milvus Vector قاعدة بيانات Milvus</h3><p>تنزيل ملفات النشر</p>
<pre><code translate="no">wget https://github.com/Milvus-io/Milvus/releases/download/v2.5.12/Milvus-standalone-docker-compose.yml -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<p>ابدأ تشغيل خدمة ميلفوس</p>
<pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Start_the_Milvus_service_211f8b11f1.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Clone-the-project" class="common-anchor-header">2. استنساخ المشروع</h3><pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/vllm-project/semantic-router.git
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Download-local-models" class="common-anchor-header">3. تنزيل النماذج المحلية</h3><pre><code translate="no"><span class="hljs-built_in">cd</span> semantic-router
make download-models
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Download_local_models_6243011fa5.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="4-Configuration-Modifications" class="common-anchor-header">4. تعديلات التكوين</h3><p>ملاحظة: قم بتعديل نوع semantic_cache إلى milvus</p>
<pre><code translate="no">vim config.yaml
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">semantic_cache:
  enabled: true
  backend_type: <span class="hljs-string">&quot;milvus&quot;</span>  <span class="hljs-comment"># Options: &quot;memory&quot; or &quot;milvus&quot;</span>
  backend_config_path: <span class="hljs-string">&quot;config/cache/milvus.yaml&quot;</span>
  similarity_threshold: <span class="hljs-number">0.8</span>
  max_entries: <span class="hljs-number">1000</span>  <span class="hljs-comment"># Only applies to memory backend</span>
  ttl_seconds: <span class="hljs-number">3600</span>
  eviction_policy: <span class="hljs-string">&quot;fifo&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>تعديل تهيئة Mmilvus ملاحظة: قم بتعبئة خدمة Milvusmilvus التي تم نشرها للتو</p>
<pre><code translate="no">vim milvus.yaml
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-comment"># Milvus connection settings</span>
connection:
  <span class="hljs-comment"># Milvus server host (change for production deployment)</span>
  host: <span class="hljs-string">&quot;192.168.7.xxx&quot;</span>  <span class="hljs-comment"># For production: use your Milvus cluster endpoint</span>
  <span class="hljs-comment"># Milvus server port</span>
  port: <span class="hljs-number">19530</span>  <span class="hljs-comment"># Standard Milvus port</span>
  <span class="hljs-comment"># Database name (optional, defaults to &quot;default&quot;)</span>
  database: <span class="hljs-string">&quot;default&quot;</span>
  <span class="hljs-comment"># Connection timeout in seconds</span>
  timeout: <span class="hljs-number">30</span>
  <span class="hljs-comment"># Authentication (enable for production)</span>
  auth:
    enabled: false  <span class="hljs-comment"># Set to true for production</span>
    username: <span class="hljs-string">&quot;&quot;</span>    <span class="hljs-comment"># Your Milvus username</span>
    password: <span class="hljs-string">&quot;&quot;</span>    <span class="hljs-comment"># Your Milvus password</span>
  <span class="hljs-comment"># TLS/SSL configuration (recommended for production)</span>
  tls:
    enabled: false      <span class="hljs-comment"># Set to true for secure connections</span>
    cert_file: <span class="hljs-string">&quot;&quot;</span>       <span class="hljs-comment"># Path to client certificate</span>
    key_file: <span class="hljs-string">&quot;&quot;</span>        <span class="hljs-comment"># Path to client private key</span>
    ca_file: <span class="hljs-string">&quot;&quot;</span>         <span class="hljs-comment"># Path to CA certificate</span>
<span class="hljs-comment"># Collection settings</span>
collection:
  <span class="hljs-comment"># Name of the collection to store cache entries</span>
  name: <span class="hljs-string">&quot;semantic_cache&quot;</span>
  <span class="hljs-comment"># Description of the collection</span>
  description: <span class="hljs-string">&quot;Semantic cache for LLM request-response pairs&quot;</span>
  <span class="hljs-comment"># Vector field configuration</span>
  vector_field:
    <span class="hljs-comment"># Name of the vector field</span>
    name: <span class="hljs-string">&quot;embedding&quot;</span>
    <span class="hljs-comment"># Dimension of the embeddings (auto-detected from model at runtime)</span>
    dimension: <span class="hljs-number">384</span>  <span class="hljs-comment"># This value is ignored - dimension is auto-detected from the embedding model</span>
    <span class="hljs-comment"># Metric type for similarity calculation</span>
    metric_type: <span class="hljs-string">&quot;IP&quot;</span>  <span class="hljs-comment"># Inner Product (cosine similarity for normalized vectors)</span>
  <span class="hljs-comment"># Index configuration for the vector field</span>
  index:
    <span class="hljs-comment"># Index type (HNSW is recommended for most use cases)</span>
    <span class="hljs-built_in">type</span>: <span class="hljs-string">&quot;HNSW&quot;</span>
    <span class="hljs-comment"># Index parameters</span>
    params:
      M: <span class="hljs-number">16</span>              <span class="hljs-comment"># Number of bi-directional links for each node</span>
      efConstruction: <span class="hljs-number">64</span>  <span class="hljs-comment"># Search scope during index construction</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="5-Start-the-project" class="common-anchor-header">5. بدء تشغيل المشروع</h3><p>ملاحظة: يوصى بتعديل بعض تبعيات ملف Dockerfile إلى المصادر المحلية</p>
<pre><code translate="no">docker compose --profile testing up --build
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Start_the_project_4e7c2a8332.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="6-Test-Requests" class="common-anchor-header">6. اختبار الطلبات</h3><p>ملاحظة: طلبان إجمالاً (بدون ذاكرة تخزين مؤقت وضرب ذاكرة التخزين المؤقت) الطلب الأول:</p>
<pre><code translate="no"><span class="hljs-built_in">echo</span> <span class="hljs-string">&quot;=== 第一次请求（无缓存状态） ===&quot;</span> &amp;&amp; \
<span class="hljs-keyword">time</span> curl -X POST http://localhost:8801/v1/chat/completions \
  -H <span class="hljs-string">&quot;Content-Type: application/json&quot;</span> \
  -H <span class="hljs-string">&quot;Authorization: Bearer test-token&quot;</span> \
  -d <span class="hljs-string">&#x27;{
    &quot;model&quot;: &quot;auto&quot;,
    &quot;messages&quot;: [
      {&quot;role&quot;: &quot;system&quot;, &quot;content&quot;: &quot;You are a helpful assistant.&quot;},
      {&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;What are the main renewable energy sources?&quot;}
    ],
    &quot;temperature&quot;: 0.7
  }&#x27;</span> | jq .
<button class="copy-code-btn"></button></code></pre>
<p>الإخراج:</p>
<pre><code translate="no"><span class="hljs-built_in">real</span>    <span class="hljs-number">0</span>m16<span class="hljs-number">.546</span>s
user    <span class="hljs-number">0</span>m0<span class="hljs-number">.116</span>s
sys     <span class="hljs-number">0</span>m0<span class="hljs-number">.033</span>s
<button class="copy-code-btn"></button></code></pre>
<p>الطلب الثاني:</p>
<pre><code translate="no"><span class="hljs-built_in">echo</span> <span class="hljs-string">&quot;=== 第二次请求（缓存状态） ===&quot;</span> &amp;&amp; \
<span class="hljs-keyword">time</span> curl -X POST http://localhost:8801/v1/chat/completions \
  -H <span class="hljs-string">&quot;Content-Type: application/json&quot;</span> \
  -H <span class="hljs-string">&quot;Authorization: Bearer test-token&quot;</span> \
  -d <span class="hljs-string">&#x27;{
    &quot;model&quot;: &quot;auto&quot;,
    &quot;messages&quot;: [
      {&quot;role&quot;: &quot;system&quot;, &quot;content&quot;: &quot;You are a helpful assistant.&quot;},
      {&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;What are the main renewable energy sources?&quot;}
    ],
    &quot;temperature&quot;: 0.7
  }&#x27;</span> | jq .
<button class="copy-code-btn"></button></code></pre>
<p>الإخراج:</p>
<pre><code translate="no"><span class="hljs-built_in">real</span>    <span class="hljs-number">0</span>m2<span class="hljs-number">.393</span>s
user    <span class="hljs-number">0</span>m0<span class="hljs-number">.116</span>s
sys     <span class="hljs-number">0</span>m0<span class="hljs-number">.021</span>s
<button class="copy-code-btn"></button></code></pre>
<p>يوضح هذا الاختبار التخزين المؤقت الدلالي لموجه الدلالات أثناء العمل. من خلال الاستفادة من Milvus كقاعدة بيانات المتجه، فإنه يطابق الاستعلامات المتشابهة دلالياً بكفاءة، مما يحسن من أوقات الاستجابة عندما يسأل المستخدمون نفس الأسئلة أو أسئلة مشابهة.</p>
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
    </button></h2><p>مع نمو أعباء عمل الذكاء الاصطناعي وتزايد أعباء العمل في الذكاء الاصطناعي وأصبح تحسين التكلفة أمرًا ضروريًا، فإن الجمع بين موجه الدلالات vLLM و <a href="https://milvus.io/">Milvus</a> يوفر طريقة عملية للتوسع بذكاء. من خلال توجيه كل استعلام إلى النموذج الصحيح وتخزين النتائج المتشابهة دلالياً مع قاعدة بيانات متجهة موزعة، يقلل هذا الإعداد من النفقات العامة للحساب مع الحفاظ على سرعة الاستجابات واتساقها عبر حالات الاستخدام.</p>
<p>باختصار، ستحصل على تحجيم أكثر ذكاءً - قوة غاشمة أقل، وعقول أكثر.</p>
<p>إذا كنت ترغب في استكشاف هذا الأمر بشكل أكبر، انضم إلى المحادثة في <a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord</a> أو افتح مشكلة على<a href="https://github.com/milvus-io/milvus"> GitHub</a>. يمكنك أيضًا حجز<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> جلسة ساعات عمل Milvus المكتبية</a> لمدة 20 دقيقة للحصول على إرشادات فردية ورؤى وتعمّق تقني من الفريق الذي يقف وراء Milvus.</p>
