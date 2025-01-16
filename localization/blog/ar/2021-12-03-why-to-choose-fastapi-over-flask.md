---
id: 2021-12-03-why-to-choose-fastapi-over-flask.md
title: لماذا تختار FastAPI على Flask؟
author: Yunmei
date: 2021-12-03T00:00:00.000Z
desc: اختيار إطار العمل المناسب وفقاً لسيناريو التطبيق الخاص بك
cover: assets.zilliz.com/1_d5de035def.png
tag: Engineering
isPublish: false
---
<p>لمساعدتك على البدء سريعًا في استخدام قاعدة البيانات المتجهة مفتوحة المصدر Milvus، أصدرنا مشروعًا آخر مفتوح المصدر تابعًا لنا، وهو Milvus <a href="https://github.com/milvus-io/bootcamp">Bootcamp</a> على GitHub. لا يوفر معسكر تدريب Milvus Bootcamp البرامج النصية والبيانات للاختبارات المعيارية فحسب، بل يتضمن أيضًا مشاريع تستخدم Milvus لبناء بعض المنتجات القابلة للتطبيق (الحد الأدنى من المنتجات القابلة للتطبيق)، مثل نظام بحث عكسي عن الصور، أو نظام تحليل فيديو، أو روبوت محادثة لضمان الجودة، أو نظام توصية. يمكنك تعلم كيفية تطبيق البحث عن التشابه المتجه في عالم مليء بالبيانات غير المنظمة والحصول على بعض الخبرة العملية في معسكر تدريب Milvus Bootcamp.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_5b60157b4d.png" alt="2.png" class="doc-image" id="2.png" />
   </span> <span class="img-wrapper"> <span>2.png</span> </span></p>
<p>نحن نقدم كلاً من خدمات الواجهة الأمامية والخلفية للمشاريع في مخيم ميلفوس التدريبي. ومع ذلك، فقد اتخذنا مؤخرًا قرارًا بتغيير إطار عمل الويب المعتمد من Flask إلى FastAPI.</p>
<p>تهدف هذه المقالة إلى شرح دوافعنا وراء هذا التغيير في إطار الويب المعتمد لميلفوس بوتكامب من خلال توضيح سبب اختيارنا ل FastAPI بدلاً من فلاسك.</p>
<h2 id="Web-frameworks-for-Python" class="common-anchor-header">أطر الويب لبايثون<button data-href="#Web-frameworks-for-Python" class="anchor-icon" translate="no">
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
    </button></h2><p>يشير إطار الويب إلى مجموعة من الحزم أو الوحدات النمطية. وهو عبارة عن مجموعة من بنية برمجية لتطوير الويب تتيح لك كتابة تطبيقات أو خدمات الويب وتوفر عليك عناء التعامل مع التفاصيل منخفضة المستوى مثل البروتوكولات أو المقابس أو إدارة العمليات/المؤشرات. يمكن أن يقلل استخدام إطار عمل الويب بشكل كبير من عبء العمل في تطوير تطبيقات الويب حيث يمكنك ببساطة "توصيل" التعليمات البرمجية الخاصة بك في إطار العمل، دون الحاجة إلى مزيد من الاهتمام عند التعامل مع التخزين المؤقت للبيانات والوصول إلى قاعدة البيانات والتحقق من أمان البيانات. لمزيد من المعلومات حول ماهية إطار عمل الويب لبايثون، راجع <a href="https://wiki.python.org/moin/WebFrameworks">أطر الويب</a>.</p>
<p>هناك أنواع مختلفة من أطر عمل الويب لبايثون. وتشمل تلك السائدة منها Django و Flask و Tornado و FastAPI.</p>
<h3 id="Flask" class="common-anchor-header">فلاسك</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_1abd170939.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span></p>
<p><a href="https://flask.palletsprojects.com/en/2.0.x/">فلاسك</a> هو إطار عمل مصغر خفيف الوزن مصمم لبايثون، مع نواة بسيطة وسهلة الاستخدام تسمح لك بتطوير تطبيقات الويب الخاصة بك. بالإضافة إلى ذلك، فإن نواة فلاسك قابلة للتوسيع أيضًا. لذلك، يدعم Flask تمديد الوظائف المختلفة عند الطلب لتلبية احتياجاتك الشخصية أثناء تطوير تطبيقات الويب. وهذا يعني أنه باستخدام مكتبة من المكونات الإضافية المختلفة في Flask، يمكنك تطوير مواقع ويب قوية.</p>
<p>يتميز فلاسك بالخصائص التالية:</p>
<ol>
<li>Flask هو إطار عمل مصغر لا يعتمد على أدوات أو مكونات أخرى محددة من مكتبات الطرف الثالث لتوفير وظائف مشتركة. لا يحتوي فلاسك على طبقة تجريد لقاعدة البيانات، ولا يتطلب التحقق من صحة النماذج. ومع ذلك، فإن Flask قابل للتوسعة بشكل كبير ويدعم إضافة وظائف التطبيق بطريقة مشابهة للتطبيقات داخل Flask نفسه. تتضمن الامتدادات ذات الصلة معادلات العلاقة بين الكائنات والتحقق من صحة النماذج ومعالجة التحميل وتقنيات المصادقة المفتوحة وبعض الأدوات الشائعة المصممة لأطر عمل الويب.</li>
<li>Flask هو إطار عمل تطبيق ويب يعتمد على <a href="https://wsgi.readthedocs.io/">WSGI</a> (واجهة بوابة خادم الويب). WSGI عبارة عن واجهة بسيطة تربط خادم ويب مع تطبيق ويب أو إطار عمل محدد للغة بايثون.</li>
<li>يتضمن Flask مكتبتين أساسيتين للوظائف، <a href="https://www.palletsprojects.com/p/werkzeug">Werkzeug</a> و <a href="https://www.palletsprojects.com/p/jinja">Jinja2</a>. Werkzeug هي مجموعة أدوات WSGI التي تنفذ الطلبات وكائنات الاستجابة والوظائف العملية، والتي تسمح لك ببناء أطر عمل الويب فوقها. Jinja2 هو محرك نمذجة شائع كامل المواصفات لبايثون. يحتوي على دعم كامل ل Unicode، مع بيئة تنفيذ رمل متكاملة اختيارية ولكنها معتمدة على نطاق واسع.</li>
</ol>
<h3 id="FastAPI" class="common-anchor-header">FastAPI</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_05cb0dac4e.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<p><a href="https://fastapi.tiangolo.com/">FastAPI</a> هو إطار عمل حديث لتطبيقات الويب من بايثون يتمتع بنفس مستوى الأداء العالي الذي يتمتع به Go و NodeJS. يعتمد جوهر FastAPI على <a href="https://www.starlette.io/">Starlette</a> و <a href="https://pydantic-docs.helpmanual.io/">Pydantic</a>. Starlette عبارة عن مجموعة أدوات إطار عمل <a href="https://asgi.readthedocs.io/">ASGI</a>(واجهة بوابة الخادم غير المتزامن) خفيفة الوزن لبناء خدمات <a href="https://docs.python.org/3/library/asyncio.html">Asyncio</a> عالية الأداء. Pydantic عبارة عن مكتبة تحدد التحقق من صحة البيانات وتسلسلها وتوثيقها بناءً على تلميحات نوع Python.</p>
<p>تتميز FastAPI بالخصائص التالية:</p>
<ol>
<li>FastAPI هو إطار عمل تطبيق ويب يعتمد على ASGI، وهي واجهة بروتوكول بوابة غير متزامنة تربط خدمات بروتوكول الشبكة وتطبيقات Python. يمكن ل FastAPI التعامل مع مجموعة متنوعة من أنواع البروتوكولات الشائعة، بما في ذلك HTTP و HTTP2 و WebSocket.</li>
<li>يعتمد FastAPI على Pydantic، والذي يوفر وظيفة التحقق من نوع بيانات الواجهة. لا تحتاج إلى التحقق بشكل إضافي من معلمة الواجهة، أو كتابة شيفرة إضافية للتحقق مما إذا كانت المعلمات فارغة أو ما إذا كان نوع البيانات صحيحًا. يمكن أن يؤدي استخدام FastAPI إلى تجنب الأخطاء البشرية في التعليمات البرمجية بفعالية وتحسين كفاءة التطوير.</li>
<li>يدعم FastAPI المستند بصيغتين - <a href="https://swagger.io/specification/">OpenAPI</a> (Swagger سابقًا) <a href="https://www.redoc.com/">وRedoc</a>. لذلك، لا تحتاج كمستخدم إلى قضاء وقت إضافي في كتابة مستندات واجهة إضافية. يظهر مستند OpenAPI الذي يوفره FastAPI في لقطة الشاشة أدناه.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_d91d34cb0f.png" alt="5.png" class="doc-image" id="5.png" />
   </span> <span class="img-wrapper"> <span>5.png</span> </span></p>
<h3 id="Flask-Vs-FastAPI" class="common-anchor-header">فلاسك مقابل FastAPI</h3><p>يوضح الجدول أدناه الاختلافات بين Flask و FastAPI في عدة جوانب.</p>
<table>
<thead>
<tr><th></th><th><strong>FastAPI</strong></th><th><strong>فلاسك</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>بوابة الواجهة</strong></td><td>ASGI</td><td>WSGI</td></tr>
<tr><td><strong>إطار عمل غير متزامن</strong></td><td>✅</td><td>❌</td></tr>
<tr><td><strong>الأداء</strong></td><td>أسرع</td><td>أبطأ</td></tr>
<tr><td><strong>مستند تفاعلي</strong></td><td>OpenAPI, Redoc</td><td>لا يوجد</td></tr>
<tr><td><strong>التحقق من البيانات</strong></td><td>✅</td><td>❌</td></tr>
<tr><td><strong>تكاليف التطوير</strong></td><td>أقل</td><td>أعلى</td></tr>
<tr><td><strong>سهولة الاستخدام</strong></td><td>أقل</td><td>أعلى</td></tr>
<tr><td><strong>مرونة</strong></td><td>أقل مرونة</td><td>أكثر مرونة</td></tr>
<tr><td><strong>مجتمع</strong></td><td>أصغر</td><td>أكثر نشاطاً</td></tr>
</tbody>
</table>
<h2 id="Why-FastAPI" class="common-anchor-header">لماذا FastAPI؟<button data-href="#Why-FastAPI" class="anchor-icon" translate="no">
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
    </button></h2><p>قبل اتخاذ قرار بشأن إطار عمل تطبيق الويب Python الذي سنختاره للمشاريع في Milvus Bootcamp، بحثنا في العديد من أطر العمل السائدة بما في ذلك Django و Flask و FastAPI و Tornado وغيرها. نظرًا لأن المشاريع في Milvus Bootcamp بمثابة مراجع لك، فإن أولويتنا هي اعتماد إطار عمل خارجي في غاية الخفة والبراعة. وفقًا لهذه القاعدة، قلصنا خياراتنا إلى Flask و FastAPI.</p>
<p>يمكنك الاطلاع على المقارنة بين إطاري الويب في القسم السابق. فيما يلي شرح تفصيلي لدوافعنا لاختيار FastAPI على Flask للمشاريع في مخيم ميلفوس بوتكامب. هناك عدة أسباب:</p>
<h3 id="1-Performance" class="common-anchor-header">1. الأداء</h3><p>تتمحور معظم المشاريع في Milvus Bootcamp حول أنظمة البحث العكسي عن الصور، وروبوتات الدردشة لضمان الجودة، ومحركات البحث النصية، والتي تتطلب جميعها متطلبات عالية لمعالجة البيانات في الوقت الفعلي. وفقًا لذلك، نحتاج إلى إطار عمل بأداء متميز، وهو بالضبط ما يميز FastAPI. لذلك، من من منظور أداء النظام، قررنا اختيار FastAPI.</p>
<h3 id="2-Efficiency" class="common-anchor-header">2. الكفاءة</h3><p>عند استخدام Flask، تحتاج إلى كتابة تعليمة برمجية للتحقق من نوع البيانات في كل واجهة من الواجهات حتى يتمكن النظام من تحديد ما إذا كانت بيانات الإدخال فارغة أم لا. ومع ذلك، من خلال دعم التحقق التلقائي من نوع البيانات، يساعد FastAPI على تجنب الأخطاء البشرية في الترميز أثناء تطوير النظام ويمكن أن يعزز كفاءة التطوير بشكل كبير. يتم وضع Bootcamp كنوع من موارد التدريب. وهذا يعني أن التعليمات البرمجية والمكونات التي نستخدمها يجب أن تكون بديهية وذات كفاءة عالية. في هذا الصدد، اخترنا FastAPI لتحسين كفاءة النظام وتعزيز تجربة المستخدم.</p>
<h3 id="3-Asynchronous-framework" class="common-anchor-header">3. إطار عمل غير متزامن</h3><p>FastAPI هو بطبيعته إطار عمل غير متزامن. في الأصل، أصدرنا أربعة <a href="https://zilliz.com/milvus-demos?isZilliz=true">عروض</a> تجريبية، البحث العكسي عن الصور، وتحليل الفيديو، وروبوت الدردشة الآلي لضمان الجودة، والبحث عن التشابه الجزيئي. في هذه العروض التوضيحية، يمكنك تحميل مجموعات البيانات وسيُطلب منك على الفور &quot;تم استلام الطلب&quot;. وعندما يتم تحميل البيانات إلى النظام التجريبي، ستتلقى مطالبة أخرى &quot;تم تحميل البيانات بنجاح&quot;. هذه عملية غير متزامنة تتطلب إطار عمل يدعم هذه الميزة. FastAPI هو في حد ذاته إطار عمل غير متزامن. لمواءمة جميع موارد Milvus، قررنا اعتماد مجموعة واحدة من أدوات وبرامج التطوير لكل من Milvus Bootcamp و Milvus demos demos. ونتيجة لذلك، قمنا بتغيير إطار العمل من Flask إلى FastAPI.</p>
<h3 id="4-Automatic-interactive-documents" class="common-anchor-header">4. المستندات التفاعلية التلقائية</h3><p>بالطريقة التقليدية، عندما تنتهي من كتابة الشيفرة البرمجية لجانب الخادم، تحتاج إلى كتابة مستند إضافي لإنشاء واجهة، ثم استخدام أدوات مثل <a href="https://www.postman.com/">Postman</a> لاختبار واجهة برمجة التطبيقات وتصحيح الأخطاء. إذن ماذا لو كنت تريد فقط البدء بسرعة في جزء تطوير جانب الخادم من المشاريع في Milvus Bootcamp دون كتابة كود إضافي لإنشاء واجهة؟ FastAPI هو الحل. من خلال توفير مستند OpenAPI، يمكن لـ FastAPI أن يوفر عليك عناء اختبار أو تصحيح أخطاء واجهات برمجة التطبيقات والتعاون مع فرق الواجهة الأمامية لتطوير واجهة المستخدم. باستخدام FastAPI، لا يزال بإمكانك تجربة التطبيق المدمج بسرعة مع واجهة تلقائية ولكن بديهية دون بذل جهود إضافية للبرمجة.</p>
<h3 id="5-User-friendliness" class="common-anchor-header">5. سهولة الاستخدام</h3><p>يعد FastAPI أسهل في الاستخدام والتطوير، مما يتيح لك إيلاء المزيد من الاهتمام للتنفيذ المحدد للمشروع نفسه. بدون قضاء الكثير من الوقت في تطوير أطر عمل الويب، يمكنك التركيز أكثر على فهم المشاريع في Milvus Bootcamp.</p>
<h2 id="Recap" class="common-anchor-header">الخلاصة<button data-href="#Recap" class="anchor-icon" translate="no">
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
    </button></h2><p>لدى Flask و FlastAPI إيجابيات وسلبيات خاصة بهما. كإطار عمل ناشئ لتطبيقات الويب، فإن FlastAPI، في جوهره، مبني على مجموعات أدوات ومكتبة ناضجة، Starlette و Pydantic. FastAPI هو إطار عمل غير متزامن مع أداء عالٍ. وقد دفعتنا براعته وقابليته للتوسعة ودعمه للتحقق التلقائي من نوع البيانات، إلى جانب العديد من الميزات القوية الأخرى، إلى اعتماد FastAPI كإطار عمل لمشاريع Milvus Bootcamp.</p>
<p>يرجى ملاحظة أنه يجب عليك اختيار إطار العمل المناسب وفقًا لسيناريو التطبيق الخاص بك إذا كنت ترغب في بناء نظام بحث عن التشابه المتجه في الإنتاج.</p>
<h2 id="About-the-author" class="common-anchor-header">نبذة عن المؤلف<button data-href="#About-the-author" class="anchor-icon" translate="no">
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
    </button></h2><p>يونمي لي، مهندسة بيانات في Zilliz، تخرجت من جامعة هواتشونغ للعلوم والتكنولوجيا وحصلت على شهادة في علوم الكمبيوتر. منذ انضمامها إلى Zilliz، تعمل على استكشاف حلول لمشروع Milvus مفتوح المصدر ومساعدة المستخدمين على تطبيق Milvus في سيناريوهات العالم الحقيقي. ينصب تركيزها الرئيسي على البرمجة اللغوية العصبية وأنظمة التوصيات، وترغب في تعميق تركيزها في هذين المجالين. تحب قضاء الوقت بمفردها والقراءة.</p>
<h2 id="Looking-for-more-resources" class="common-anchor-header">هل تبحث عن المزيد من الموارد؟<button data-href="#Looking-for-more-resources" class="anchor-icon" translate="no">
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
<li><p>ابدأ في بناء نظام ذكاء اصطناعي مع ميلفوس واحصل على المزيد من الخبرة العملية من خلال قراءة دروسنا التعليمية!</p>
<ul>
<li><a href="https://milvus.io/blog/2021-10-10-milvus-helps-analys-vedios.md">ما هي؟ من هي؟ يساعد ميلفوس في تحليل مقاطع الفيديو بذكاء</a></li>
<li><a href="https://milvus.io/blog/2021-09-26-onnx.md">الجمع بين نماذج الذكاء الاصطناعي للبحث عن الصور باستخدام ONNX و Milvus</a></li>
<li><a href="https://milvus.io/blog/dna-sequence-classification-based-on-milvus.md">تصنيف تسلسل الحمض النووي استنادًا إلى Milvus</a></li>
<li><a href="https://milvus.io/blog/audio-retrieval-based-on-milvus.md">استرجاع الصوت استنادًا إلى ميلفوس</a></li>
<li><a href="https://milvus.io/blog/building-video-search-system-with-milvus.md">4 خطوات لبناء نظام بحث عن الفيديو</a></li>
<li><a href="https://milvus.io/blog/building-intelligent-chatbot-with-nlp-and-milvus.md">بناء نظام ذكي لضمان الجودة باستخدام البرمجة اللغوية العصبية وميلفوس</a></li>
<li><a href="https://milvus.io/blog/molecular-structure-similarity-with-milvus.md">تسريع اكتشاف الأدوية الجديدة</a></li>
</ul></li>
<li><p>تفاعل مع مجتمعنا مفتوح المصدر:</p>
<ul>
<li>ابحث أو ساهم في Milvus على <a href="https://bit.ly/307b7jC">GitHub</a>.</li>
<li>تفاعل مع المجتمع عبر <a href="https://bit.ly/3qiyTEk">المنتدى</a>.</li>
<li>تواصل معنا على <a href="https://bit.ly/3ob7kd8">تويتر</a>.</li>
</ul></li>
</ul>
