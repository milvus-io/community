---
id: >-
  Ingesting-Chaos-MLOps-Behind-Handling-Unstructured-Data-Reliably-at-Scale-for-RAG.md
title: >-
  استيعاب الفوضى: العمليات الإدارية وراء التعامل مع البيانات غير المهيكلة بشكل
  موثوق على نطاق واسع لـ RAG
author: David Garnitz
date: 2023-10-16T00:00:00.000Z
cover: assets.zilliz.com/Ingesting_Chaos_20231017_110103_54fe2009cb.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Retrieval Augmented Generation, RAG, Unstructured Data
recommend: true
desc: >-
  وبفضل تقنيات مثل VectorFlow وMilvus، يمكن للفريق إجراء الاختبارات بكفاءة عبر
  بيئات مختلفة مع الالتزام بمتطلبات الخصوصية والأمان.
canonicalUrl: >-
  https://milvus.io/blog/Ingesting-Chaos-MLOps-Behind-Handling-Unstructured-Data-Reliably-at-Scale-for-RAG.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Ingesting_Chaos_20231017_110103_54fe2009cb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>يتم توليد البيانات بشكل أسرع من أي وقت مضى بكل الأشكال التي يمكن تخيلها. هذه البيانات هي البنزين الذي سيشغّل موجة جديدة من تطبيقات الذكاء الاصطناعي، ولكن تحتاج محركات تحسين الإنتاجية هذه إلى المساعدة في استيعاب هذا الوقود. إن المجموعة الواسعة من السيناريوهات والحالات المتطورة المحيطة بالبيانات غير المهيكلة تجعل من الصعب استخدامها في أنظمة الذكاء الاصطناعي الإنتاجية.</p>
<p>بالنسبة للمبتدئين، هناك عدد كبير من مصادر البيانات. تقوم هذه بتصدير البيانات بتنسيقات ملفات مختلفة، ولكل منها خصائصه الغريبة. على سبيل المثال، تختلف كيفية معالجة ملف PDF اختلافًا كبيرًا اعتمادًا على مصدرها. من المرجح أن يركز إدخال ملف PDF لقضية تقاضي في الأوراق المالية على البيانات النصية. في المقابل، ستكون مواصفات تصميم نظام لمهندس صواريخ مليئة بالمخططات التي تتطلب معالجة بصرية. ويضيف عدم وجود مخطط محدد في البيانات غير المنظمة مزيدًا من التعقيد. وحتى عندما يتم التغلب على تحدي معالجة البيانات، تظل مشكلة استيعابها على نطاق واسع قائمة. يمكن أن يختلف حجم الملفات بشكل كبير، مما يغير كيفية معالجتها. يمكنك معالجة تحميل 1 ميغابايت بسرعة على واجهة برمجة التطبيقات عبر HTTP، ولكن قراءة عشرات الجيجابايتات من ملف واحد تتطلب تدفقًا وعاملًا مخصصًا.</p>
<p>إن التغلب على هذه التحديات التقليدية في هندسة البيانات هو رهان أساسي لتوصيل البيانات الخام إلى <a href="https://zilliz.com/glossary/large-language-models-(llms)">LLMs</a> عبر <a href="https://zilliz.com/learn/what-is-vector-database">قواعد بيانات المتجهات</a> مثل <a href="https://github.com/milvus-io/milvus">Milvus</a>. ومع ذلك، تتطلب حالات الاستخدام الناشئة مثل إجراء عمليات البحث عن التشابه الدلالي بمساعدة قاعدة بيانات المتجهات خطوات معالجة جديدة مثل تقطيع البيانات المصدر، وتنسيق البيانات الوصفية لعمليات البحث الهجينة، واختيار نموذج تضمين المتجهات المناسب، وضبط معلمات البحث لتحديد البيانات التي يجب تغذية LLM بها. إن عمليات سير العمل هذه جديدة جدًا لدرجة أنه لا توجد أفضل الممارسات الثابتة التي يمكن للمطورين اتباعها. وبدلاً من ذلك، يجب عليهم إجراء التجارب للعثور على التكوين الصحيح وحالة الاستخدام الصحيحة لبياناتهم. ولتسريع هذه العملية، فإن استخدام خط أنابيب تضمين المتجهات للتعامل مع إدخال البيانات في قاعدة بيانات المتجهات لا يقدر بثمن.</p>
<p>سيقوم خط أنابيب تضمين المتجهات مثل <a href="https://github.com/dgarnitz/vectorflow">VectorFlow</a> بتوصيل بياناتك الأولية بقاعدة بيانات المتجهات، بما في ذلك التقطيع وتنسيق البيانات الوصفية والتضمين والتحميل. يُمكّن VectorFlow الفرق الهندسية من التركيز على منطق التطبيق الأساسي، وتجربة معلمات الاسترجاع المختلفة الناتجة عن نموذج التضمين واستراتيجية التقطيع وحقول البيانات الوصفية وجوانب البحث لمعرفة ما هو الأفضل أداءً.</p>
<p>من خلال عملنا في مساعدة الفرق الهندسية في نقل أنظمة <a href="https://zilliz.com/use-cases/llm-retrieval-augmented-generation">التوليد المعزز للاسترجاع (RAG)</a> من النموذج الأولي إلى الإنتاج، لاحظنا نجاح النهج التالي في اختبار المعلمات المختلفة لخط أنابيب البحث RAG:</p>
<ol>
<li>استخدم مجموعة صغيرة من البيانات المألوفة لديك لسرعة التكرار، مثل بعض ملفات PDF التي تحتوي على أجزاء ذات صلة باستعلامات البحث.</li>
<li>ضع مجموعة قياسية من الأسئلة والأجوبة حول تلك المجموعة الفرعية من البيانات. على سبيل المثال، بعد قراءة ملفات PDF، اكتب قائمة بالأسئلة واطلب من فريقك الاتفاق على الإجابات.</li>
<li>قم بإنشاء نظام تقييم آلي يسجل أداء الاسترجاع في كل سؤال. تتمثل إحدى طرق القيام بذلك في أخذ الإجابة من نظام الاسترجاع وتشغيلها مرة أخرى من خلال نظام الاسترجاع مع مطالبة تسأل عما إذا كانت نتيجة الاسترجاع هذه تجيب على السؤال الذي تم إعطاء الإجابة الصحيحة عليه. يجب أن تكون هذه الإجابة "نعم" أو "لا". على سبيل المثال، إذا كان لديك 25 سؤالاً في مستنداتك، وحصل النظام على 20 إجابة صحيحة، يمكنك استخدام ذلك لقياسها مقارنةً بالمناهج الأخرى.</li>
<li>تأكد من استخدام LLM مختلفة للتقييم عن تلك التي استخدمتها لترميز التضمينات المتجهة المخزنة في قاعدة البيانات. عادةً ما يكون نموذج LLM للتقييم من نوع وحدة فك التشفير مثل GPT-4. شيء واحد يجب تذكره هو تكلفة هذه التقييمات عند تشغيلها بشكل متكرر. تتمتع النماذج مفتوحة المصدر مثل Llama2 70B أو Deci AI LLM 6B، والتي يمكن تشغيلها على وحدة معالجة رسومية واحدة أصغر حجماً، بنفس الأداء تقريباً بجزء بسيط من التكلفة.</li>
<li>قم بتشغيل كل اختبار عدة مرات وحساب متوسط النتيجة لتخفيف عشوائية LLM.</li>
</ol>
<p>مع الاحتفاظ بكل خيار ثابت باستثناء خيار واحد، يمكنك تحديد المعلمات التي تعمل بشكل أفضل لحالة الاستخدام الخاصة بك بسرعة. يجعل خط أنابيب التضمين المتجه مثل VectorFlow هذا الأمر سهلاً بشكل خاص على جانب الاستيعاب، حيث يمكنك تجربة استراتيجيات التقطيع المختلفة وأطوال القطع وتداخلات القطع ونماذج التضمين مفتوحة المصدر بسرعة لمعرفة ما يؤدي إلى أفضل النتائج. هذا مفيد بشكل خاص عندما تحتوي مجموعة بياناتك على أنواع ملفات ومصادر بيانات مختلفة تتطلب منطقًا مخصصًا.</p>
<p>بمجرد أن يعرف الفريق ما يصلح لحالة استخدامه، يمكّنهم خط أنابيب التضمين المتجه من الانتقال بسرعة إلى الإنتاج دون الحاجة إلى إعادة تصميم النظام لمراعاة أمور مثل الموثوقية والمراقبة. وبفضل تقنيات مثل VectorFlow <a href="https://zilliz.com/what-is-milvus">وMilvus،</a> وهي تقنيات مفتوحة المصدر ولا تعتمد على النظام الأساسي، يمكن للفريق إجراء الاختبار بكفاءة عبر بيئات مختلفة مع الالتزام بمتطلبات الخصوصية والأمان.</p>
