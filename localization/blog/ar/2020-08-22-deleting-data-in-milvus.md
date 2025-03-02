---
id: deleting-data-in-milvus.md
title: الخاتمة
author: milvus
date: 2020-08-22T20:27:23.266Z
desc: >-
  في الإصدار 0.7.0 من Milvus، توصلنا في الإصدار 0.7.0 إلى تصميم جديد تمامًا لجعل
  الحذف أكثر كفاءة ودعم المزيد من أنواع الفهارس.
cover: assets.zilliz.com/header_c9b45e546c.png
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/deleting-data-in-milvus'
---
<custom-h1>كيفية تحقيق ميلفوس لدالة الحذف</custom-h1><p>تتناول هذه المقالة كيفية تنفيذ ميلفوس لوظيفة الحذف. كميزة طال انتظارها من قبل العديد من المستخدمين، تم إدخال دالة الحذف إلى الإصدار 0.7.0 من ميلفوس. لم نقم باستدعاء remove_ids في FAISS مباشرة، وبدلاً من ذلك، توصلنا إلى تصميم جديد تمامًا لجعل الحذف أكثر كفاءة ودعم المزيد من أنواع الفهارس.</p>
<p>في <a href="https://medium.com/unstructured-data-service/how-milvus-implements-dynamic-data-update-and-query-d15e04a85e7d?source=friends_link&amp;sk=cc38bee61bc194f30324ed17e86886f3">كيفية تحقيق Milvus للتحديث الديناميكي للبيانات والاستعلام،</a> قدمنا العملية بأكملها من إدراج البيانات إلى مسح البيانات. دعونا نلخص بعض الأساسيات. يدير MemManager جميع المخازن المؤقتة للإدراج، مع كل MemTable يتوافق مع مجموعة (قمنا بإعادة تسمية "جدول" إلى "مجموعة" في الإصدار 0.7.0 من Milvus). يقسم Milvus تلقائيًا البيانات المدرجة في الذاكرة إلى عدة ملفات MemTableFiles. عند مسح البيانات إلى القرص، يتم تسلسل كل ملف MemTableFile إلى ملف خام. احتفظنا بهذه البنية عند تصميم دالة الحذف.</p>
<p>نحدد وظيفة طريقة الحذف على أنها حذف جميع البيانات المطابقة لمعرفات الكيانات المحددة في مجموعة محددة. عند تطوير هذه الدالة، قمنا بتصميم سيناريوهين. الأول هو حذف البيانات التي لا تزال في المخزن المؤقت للإدراج، والثاني هو حذف البيانات التي تم مسحها إلى القرص. السيناريو الأول أكثر بديهية. يمكننا العثور على MemTableFile المطابق للمعرف المحدد، وحذف البيانات الموجودة في الذاكرة مباشرةً (الشكل 1). نظرًا لأنه لا يمكن إجراء عملية حذف وإدراج البيانات في نفس الوقت، وبسبب الآلية التي تغير MemTableFile من قابل للتغيير إلى غير قابل للتغيير عند مسح البيانات، يتم إجراء الحذف فقط في المخزن المؤقت القابل للتغيير. بهذه الطريقة، لا تتعارض عملية الحذف مع مسح البيانات، وبالتالي ضمان اتساق البيانات.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_delete_request_milvus_fa1e7941da.jpg" alt="1-delete-request-milvus.jpg" class="doc-image" id="1-delete-request-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>1-حذف-طلب-حذف-ملفوس.jpg</span> </span></p>
<p>السيناريو الثاني أكثر تعقيدًا ولكنه أكثر شيوعًا، حيث أنه في معظم الحالات تبقى البيانات في المخزن المؤقت القابل للإدراج لفترة وجيزة قبل أن يتم مسحها إلى القرص. وبالنظر إلى عدم كفاءة تحميل البيانات التي تم مسحها إلى الذاكرة من أجل الحذف الصلب، قررنا اللجوء إلى الحذف الناعم، وهو نهج أكثر كفاءة. بدلاً من الحذف الفعلي للبيانات التي تم مسحها، يقوم الحذف الناعم بحفظ المعرفات المحذوفة في ملف منفصل. بهذه الطريقة، يمكننا تصفية تلك المعرفات المحذوفة أثناء عمليات القراءة، مثل البحث.</p>
<p>عندما يتعلق الأمر بالتنفيذ، لدينا العديد من المشكلات التي يجب مراعاتها. في Milvus، تكون البيانات مرئية أو، بعبارة أخرى، قابلة للاسترداد، فقط عندما يتم مسحها إلى القرص. لذلك، لا يتم حذف البيانات التي تم مسحها أثناء استدعاء أسلوب الحذف، ولكن في عملية المسح التالية. والسبب في ذلك هو أن ملفات البيانات التي تم مسحها إلى القرص لن تتضمن بيانات جديدة بعد ذلك، وبالتالي لا يؤثر الحذف الناعم على البيانات التي تم مسحها. عند استدعاء الحذف، يمكنك حذف البيانات التي لا تزال في المخزن المؤقت المدرج مباشرة، بينما بالنسبة للبيانات التي تم مسحها، تحتاج إلى تسجيل معرف البيانات المحذوفة في الذاكرة. عند مسح البيانات إلى القرص، يكتب Milvus المعرف المحذوف إلى ملف DEL لتسجيل الكيان الذي تم حذفه في المقطع المقابل. لن تظهر هذه التحديثات إلا بعد اكتمال مسح البيانات. هذه العملية موضحة في الشكل 2. قبل الإصدار 0.7.0، لم يكن لدينا سوى آلية التنظيف التلقائي؛ أي أن ميلفوس يقوم بتسلسل البيانات في المخزن المؤقت للإدراج كل ثانية. في تصميمنا الجديد، أضفنا طريقة تدفق تسمح للمطوّرين باستدعائها بعد طريقة الحذف، مما يضمن أن البيانات المدرجة حديثًا مرئية وأن البيانات المحذوفة لم تعد قابلة للاسترداد.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_delete_request_milvus_c7fc97ef07.jpg" alt="2-delete-request-milvus.jpg" class="doc-image" id="2-delete-request-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>2-حذف-طلب-حذف-ملفوس.jpg</span> </span></p>
<p>المشكلة الثانية هي أن ملف البيانات الخام وملف الفهرس هما ملفان منفصلان في ملف Milvus، وسجلان مستقلان في البيانات الوصفية. عند حذف معرّف محدد، نحتاج إلى العثور على الملف الخام وملف الفهرس المطابق للمعرّف وتسجيلهما معًا. وفقًا لذلك، قدمنا مفهوم المقطع. يحتوي المقطع على الملف الخام (الذي يتضمن ملفات المتجه الخام وملفات المعرف) وملف الفهرس وملف DEL. المقطع هو الوحدة الأساسية لقراءة المتجهات وكتابتها والبحث فيها في ملف ميلفوس. تتكون المجموعة (الشكل 3) من عدة مقاطع. وبالتالي، هناك العديد من مجلدات المقاطع تحت مجلد المجموعة في القرص. نظرًا لأن البيانات الوصفية الخاصة بنا تعتمد على قواعد البيانات العلائقية (SQLite أو MySQL)، فمن السهل جدًا تسجيل العلاقة داخل المقاطع، ولم تعد عملية الحذف تتطلب معالجة منفصلة للملف الخام وملف الفهرس.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_delete_request_milvus_ee40340279.jpg" alt="3-delete-request-milvus.jpg" class="doc-image" id="3-delete-request-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>3-حذف-مطلب-حذف-ملف-ملفوس.jpg</span> </span></p>
<p>المشكلة الثالثة هي كيفية تصفية البيانات المحذوفة أثناء البحث. من الناحية العملية، المعرف المسجل بواسطة DEL هو إزاحة البيانات المقابلة المخزنة في المقطع. نظرًا لأن المقطع المحذوف لا يتضمن بيانات جديدة، فلن يتغير الإزاحة. بنية بيانات DEL عبارة عن خريطة نقطية في الذاكرة، حيث يمثل البت النشط إزاحة محذوفة. وقمنا أيضًا بتحديث FAISS وفقًا لذلك: عند البحث في FAISS، لن يتم تضمين المتجه المقابل للبت النشط في حساب المسافة (الشكل 4). لن يتم تناول التغييرات على FAISS بالتفصيل هنا.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_delete_request_milvus_f5a29e25df.jpg" alt="4-delete-request-milvus.jpg" class="doc-image" id="4-delete-request-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>4-حذف-طلب-ميلفوس.jpg</span> </span></p>
<p>المسألة الأخيرة تتعلق بتحسين الأداء. عند حذف البيانات المحذوفة، تحتاج أولاً إلى معرفة الجزء من المجموعة الذي يوجد فيه المعرف المحذوف ثم تسجيل إزاحته. الطريقة الأكثر مباشرة هي البحث في جميع المعرفات في كل شريحة. التحسين الذي نفكر فيه هو إضافة مرشح بلوم إلى كل شريحة. مرشح بلوم هو عبارة عن بنية بيانات عشوائية تُستخدم للتحقق مما إذا كان العنصر عضوًا في مجموعة ما. لذلك، يمكننا تحميل مرشح التفتح فقط لكل مقطع. فقط عندما يحدد مرشح التفتح أن المعرف المحذوف موجود في المقطع الحالي يمكننا العثور على الإزاحة المقابلة في المقطع، وإلا يمكننا تجاهل هذا المقطع (الشكل 5). لقد اخترنا فلتر التفتح لأنه يستخدم مساحة أقل وهو أكثر كفاءة في البحث من العديد من أقرانه، مثل جداول التجزئة. على الرغم من أن فلتر التفتح لديه معدل معين من الإيجابيات الكاذبة، إلا أنه يمكننا تقليل المقاطع التي تحتاج إلى البحث إلى العدد المثالي لضبط الاحتمالية. وفي الوقت نفسه، يحتاج مرشح التفتح أيضًا إلى دعم الحذف. خلاف ذلك، لا يزال من الممكن العثور على معرّف الكيان المحذوف في مرشح التفتح، مما يؤدي إلى زيادة معدل الإيجابية الكاذبة. لهذا السبب، نستخدم مرشح ازدهار العد لأنه يدعم الحذف. في هذه المقالة، لن نتوسع في شرح كيفية عمل مرشح التفتح. يمكنك الرجوع إلى ويكيبيديا إذا كنت مهتمًا.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_delete_request_milvus_bd26633b55.jpg" alt="5-delete-request-milvus.jpg" class="doc-image" id="5-delete-request-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>5-حذف-طلب-مطلب-ملفوس.jpg</span> </span></p>
<h2 id="Wrapping-up" class="common-anchor-header">الخاتمة<button data-href="#Wrapping-up" class="anchor-icon" translate="no">
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
    </button></h2><p>لقد قدمنا لك حتى الآن مقدمة موجزة عن كيفية حذف ميلفوس للمتجهات حسب المعرف. كما تعلمون، نحن نستخدم الحذف الناعم لحذف البيانات المحذوفة. مع زيادة البيانات المحذوفة، نحتاج إلى ضغط المقاطع في المجموعة لتحرير المساحة التي تشغلها البيانات المحذوفة. بالإضافة إلى ذلك، إذا كان قد تم فهرسة مقطع ما بالفعل، فإن الضغط يحذف أيضًا ملف الفهرس السابق وينشئ فهارس جديدة. في الوقت الحالي، يحتاج المطورون إلى استدعاء طريقة الضغط لضغط البيانات. في المستقبل، نأمل أن نقدم آلية فحص. على سبيل المثال، عندما يصل مقدار البيانات المحذوفة إلى حد معين أو عندما يتغير توزيع البيانات بعد الحذف، يقوم ميلفوس تلقائيًا بضغط المقطع.</p>
<p>لقد قدمنا الآن فلسفة التصميم وراء وظيفة الحذف وتنفيذها. هناك بالتأكيد مجال للتحسين، ونرحب بأي من تعليقاتكم أو اقتراحاتكم.</p>
<p>تعرف على ميلفوس: https://github.com/milvus-io/milvus. يمكنك أيضًا الانضمام إلى مجتمعنا <a href="https://milvusio.slack.com/join/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ#/">Slack</a> للمناقشات التقنية!</p>
