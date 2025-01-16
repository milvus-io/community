---
id: deep-dive-3-data-processing.md
title: كيف تتم معالجة البيانات في قاعدة بيانات المتجهات؟
author: Zhenshan Cao
date: 2022-03-28T00:00:00.000Z
desc: >-
  توفر Milvus بنية تحتية لإدارة البيانات ضرورية لتطبيقات الذكاء الاصطناعي
  الإنتاجية. تكشف هذه المقالة عن تعقيدات معالجة البيانات في الداخل.
cover: assets.zilliz.com/How_Is_Data_Processed_in_a_Vector_Database_9fb236bc01.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-3-data-processing.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/How_Is_Data_Processed_in_a_Vector_Database_9fb236bc01.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>صورة الغلاف</span> </span></p>
<blockquote>
<p>هذا المقال بقلم <a href="https://github.com/czs007">زنشان كاو</a> وترجمة <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">أنجيلا ني</a>.</p>
</blockquote>
<p>في المنشورين السابقين في هذه السلسلة من المدونة، قمنا بالفعل بتغطية <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">بنية نظام</a> Milvus، قاعدة البيانات المتجهة الأكثر تقدمًا في العالم، <a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">وحزمة تطوير البرمجيات وواجهة برمجة التطبيقات</a> الخاصة به <a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">من بايثون</a>.</p>
<p>تهدف هذه التدوينة بشكل أساسي إلى مساعدتك في فهم كيفية معالجة البيانات في ميلفوس من خلال التعمق في نظام ميلفوس وفحص التفاعل بين مكونات معالجة البيانات.</p>
<p><em>بعض الموارد المفيدة قبل البدء مدرجة أدناه. نوصي بقراءتها أولاً لفهم الموضوع في هذا المنشور بشكل أفضل.</em></p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">التعمق في بنية ميلفوس</a></li>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Data-Model">نموذج بيانات ميلفوس</a></li>
<li><a href="https://milvus.io/docs/v2.0.x/four_layers.md">دور ووظيفة كل مكون من مكونات ملفوس</a></li>
<li><a href="https://milvus.io/docs/v2.0.x/data_processing.md">معالجة البيانات في ميلفوس</a></li>
</ul>
<h2 id="MsgStream-interface" class="common-anchor-header">واجهة MsgStream<button data-href="#MsgStream-interface" class="anchor-icon" translate="no">
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
    </button></h2><p>تعد<a href="https://github.com/milvus-io/milvus/blob/ca129d4308cc7221bb900b3722dea9b256e514f9/docs/developer_guides/chap04_message_stream.md">واجهة MsgStream</a> حاسمة لمعالجة البيانات في ميلفوس. عند استدعاء <code translate="no">Start()</code> ، يكتب الكوروتين في الخلفية البيانات في <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Log-as-data">وسيط السجل</a> أو يقرأ البيانات من هناك. عند استدعاء <code translate="no">Close()</code> ، يتوقف الكوروتين.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Msg_Stream_interface_66b70309a7.png" alt="MsgStream interface" class="doc-image" id="msgstream-interface" />
   </span> <span class="img-wrapper"> <span>واجهة MsgStream</span> </span></p>
<p>يمكن أن يعمل MsgStream كمنتج ومستهلك. تُعرّف الواجهة <code translate="no">AsProducer(channels []string)</code> الواجهة MsgStream كمنتج بينما يُعرّفها <code translate="no">AsConsumer(channels []string, subNamestring)</code>كمستهلك. تتم مشاركة المعلمة <code translate="no">channels</code> في كلتا الواجهتين وتستخدم لتحديد القنوات (الفعلية) التي يجب كتابة البيانات فيها أو قراءة البيانات منها.</p>
<blockquote>
<p>يمكن تحديد عدد الأجزاء في المجموعة عند إنشاء المجموعة. يتوافق كل جزء مع <a href="https://milvus.io/docs/v2.0.x/glossary.md#VChannel">قناة افتراضية (vchannel)</a>. لذلك، يمكن أن تحتوي المجموعة على عدة قنوات افتراضية. يعين Milvus لكل قناة افتراضية في وسيط السجل <a href="https://milvus.io/docs/v2.0.x/glossary.md#PChannel">قناة فعلية (pchannel)</a>.</p>
</blockquote>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Each_virtual_channel_shard_corresponds_to_a_physical_channel_7cd60e4ed1.png" alt="Each virtual channel/shard corresponds to a physical channel." class="doc-image" id="each-virtual-channel/shard-corresponds-to-a-physical-channel." />
   </span> <span class="img-wrapper"> <span>تتوافق كل قناة/قناة افتراضية مع قناة فعلية</span>. </span></p>
<p><code translate="no">Produce()</code> في واجهة MsgStream المسؤولة عن كتابة البيانات في قنوات pchannels في وسيط السجل. يمكن كتابة البيانات بطريقتين:</p>
<ul>
<li>الكتابة المفردة: تتم كتابة الكيانات في أجزاء مختلفة (قناة افتراضية) بواسطة قيم تجزئة المفاتيح الأساسية. ثم تتدفق هذه الكيانات إلى قنوات pchannels المقابلة في وسيط السجل.</li>
<li>كتابة البث: تتم كتابة الكيانات في جميع قنوات pchannels المحددة بواسطة المعلمة <code translate="no">channels</code>.</li>
</ul>
<p><code translate="no">Consume()</code> هو نوع من واجهة برمجة التطبيقات المحظورة. إذا لم تكن هناك بيانات متوفرة في قناة pchannel المحددة، فسيتم حظر الكوروتين عند استدعاء <code translate="no">Consume()</code> في واجهة MsgStream. من ناحية أخرى، <code translate="no">Chan()</code> هو واجهة برمجة تطبيقات غير محظورة، مما يعني أن الكوروتين يقرأ البيانات ويعالجها فقط في حالة وجود بيانات موجودة في قناة pchannel المحددة. خلاف ذلك، يمكن للكوروتين معالجة مهام أخرى ولن يتم حظره عند عدم توفر بيانات.</p>
<p><code translate="no">Seek()</code> هي طريقة لاستعادة الفشل. عند بدء تشغيل عقدة جديدة، يمكن الحصول على سجل استهلاك البيانات واستئناف استهلاك البيانات من حيث تم إيقافها عن طريق استدعاء <code translate="no">Seek()</code>.</p>
<h2 id="Write-data" class="common-anchor-header">كتابة البيانات<button data-href="#Write-data" class="anchor-icon" translate="no">
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
    </button></h2><p>يمكن أن تكون البيانات المكتوبة في قنوات vchannels (أجزاء) مختلفة إما إدراج رسالة أو حذف رسالة. يمكن أيضًا تسمية هذه القنوات vchannels بقنوات DmChannels (قنوات معالجة البيانات).</p>
<p>قد تشترك مجموعات مختلفة في نفس قنوات pchannels في وسيط السجل. يمكن أن تحتوي المجموعة الواحدة على أجزاء متعددة وبالتالي قنوات vchannels متعددة مقابلة. وبالتالي تتدفق الكيانات الموجودة في نفس المجموعة إلى عدة قنوات pchannels مقابلة في وسيط السجل. ونتيجةً لذلك، تتمثل فائدة مشاركة قنوات pchannels في زيادة حجم الإنتاجية التي يتيحها التزامن العالي لوسيط السجل.</p>
<p>عندما يتم إنشاء مجموعة، لا يتم تحديد عدد الأجزاء فقط، بل يتم تحديد التعيين بين القنوات الافتراضية والقنوات pchannels في وسيط السجل.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Write_path_in_Milvus_00d93fb377.png" alt="Write path in Milvus" class="doc-image" id="write-path-in-milvus" />
   </span> <span class="img-wrapper"> <span>مسار الكتابة في ميلفوس</span> </span></p>
<p>كما هو موضح في الرسم التوضيحي أعلاه، في مسار الكتابة، يكتب الوكلاء البيانات في وسيط السجل عبر واجهة <code translate="no">AsProducer()</code> لـ MsgStream. ثم تستهلك عقد البيانات البيانات، ثم تقوم بتحويل البيانات المستهلكة وتخزينها في مخزن الكائنات. مسار التخزين هو نوع من المعلومات الوصفية التي سيتم تسجيلها في إلخd بواسطة منسقي البيانات.</p>
<h3 id="Flowgraph" class="common-anchor-header">مخطط التدفق</h3><p>نظرًا لأن المجموعات المختلفة قد تشترك في نفس قنوات pchannels في وسيط السجل، فعند استهلاك البيانات، تحتاج عقد البيانات أو عقد الاستعلام إلى الحكم على المجموعة التي تنتمي إليها البيانات في قناة pchannel. لحل هذه المشكلة، قدمنا مخطط التدفق في ميلفوس. وهو مسؤول بشكل أساسي عن تصفية البيانات في قناة pchannel مشتركة حسب معرّفات المجموعة. لذا، يمكننا القول أن كل مخطط تدفق يعالج تدفق البيانات في جزء (قناة vchannel) مطابق في مجموعة.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Flowgraph_in_write_path_1b201e1b71.png" alt="Flowgraph in write path" class="doc-image" id="flowgraph-in-write-path" />
   </span> <span class="img-wrapper"> <span>مخطط التدفق في مسار الكتابة</span> </span></p>
<h3 id="MsgStream-creation" class="common-anchor-header">إنشاء MsgStream</h3><p>عند كتابة البيانات، يتم إنشاء كائن MsgStream في السيناريوهين التاليين:</p>
<ul>
<li>عندما يتلقى الوكيل طلب إدراج بيانات، فإنه يحاول أولاً الحصول على التعيين بين قنوات vchannels وقنوات pchannels عبر المنسق الجذر (المنسق الجذر). ثم يقوم الوكيل بإنشاء كائن MsgStream.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Creating_Msg_Stream_object_in_write_path_Scenario_1_bdd0f94d8b.png" alt="Scenario 1" class="doc-image" id="scenario-1" />
   </span> <span class="img-wrapper"> <span>السيناريو 1</span> </span></p>
<ul>
<li>عند بدء تشغيل عقدة البيانات وقراءة المعلومات الوصفية للقنوات في etcd، يتم إنشاء كائن MsgStream.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Creating_Msg_Stream_object_in_write_path_Scenario_2_5b3f99a6d1.png" alt="Scenario 2" class="doc-image" id="scenario-2" />
   </span> <span class="img-wrapper"> <span>السيناريو 2</span> </span></p>
<h2 id="Read-data" class="common-anchor-header">قراءة البيانات<button data-href="#Read-data" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Read_path_in_Milvus_c2f0ae5109.png" alt="Read path in Milvus" class="doc-image" id="read-path-in-milvus" />
   </span> <span class="img-wrapper"> <span>مسار القراءة في ميلفوس</span> </span></p>
<p>سير العمل العام لقراءة البيانات موضح في الصورة أعلاه. يتم بث طلبات الاستعلام عبر قناة DqRequestChannel إلى عقد الاستعلام. تقوم عقد الاستعلام بتنفيذ مهام الاستعلام بالتوازي. تمر نتائج الاستعلام من عقد الاستعلام عبر gRPC ويقوم الوكيل بتجميع النتائج وإرجاعها إلى العميل.</p>
<p>لإلقاء نظرة فاحصة على عملية قراءة البيانات، يمكننا أن نرى أن الوكيل يكتب طلبات الاستعلام في قناة DqRequestChannel. ثم تستهلك عقد الاستعلام الرسائل عن طريق الاشتراك في قناة DqRequestChannel. يتم بث كل رسالة في قناة DqRequestChannel بحيث يمكن لجميع عقد الاستعلام المشتركة تلقي الرسالة.</p>
<p>عندما تتلقى عقد الاستعلام طلبات الاستعلام، فإنها تجري استعلامًا محليًا على كل من البيانات الدفعية المخزنة في قطاعات مختومة وبيانات التدفق التي يتم إدراجها ديناميكيًا في Milvus وتخزينها في قطاعات متزايدة. بعد ذلك، تحتاج عقد الاستعلام إلى تجميع نتائج الاستعلام في كل من <a href="https://milvus.io/docs/v2.0.x/glossary.md#Segment">القطاعات المختومة والمتنامية</a>. يتم تمرير هذه النتائج المجمعة إلى الوكيل عبر gRPC.</p>
<p>يجمع الوكيل جميع النتائج من عقد استعلام متعددة ثم يجمعها للحصول على النتائج النهائية. ثم يقوم الوكيل بإرجاع نتائج الاستعلام النهائية إلى العميل. نظرًا لأن كل طلب استعلام ونتائج الاستعلام المقابلة له يتم تصنيفها بنفس معرّف الطلب الفريد، يمكن للوكيل معرفة نتائج الاستعلام التي تتوافق مع طلب الاستعلام.</p>
<h3 id="Flowgraph" class="common-anchor-header">مخطط التدفق</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Flowgraph_in_read_path_8a5faf2d58.png" alt="Flowgraph in read path" class="doc-image" id="flowgraph-in-read-path" />
   </span> <span class="img-wrapper"> <span>مخطط التدفق في مسار القراءة</span> </span></p>
<p>على غرار مسار الكتابة، يتم تقديم مخططات التدفق أيضًا في مسار القراءة. يطبّق ميلفوس بنية لامدا الموحدة، والتي تدمج معالجة البيانات الإضافية والتاريخية. لذلك، تحتاج عُقد الاستعلام إلى الحصول على بيانات التدفق في الوقت الفعلي أيضًا. وبالمثل، تقوم التدفقات في مسار القراءة بتصفية البيانات من مجموعات مختلفة وتمييزها.</p>
<h3 id="MsgStream-creation" class="common-anchor-header">إنشاء MsgStream</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Creating_Msg_Stream_object_in_read_path_7f059bde2f.png" alt="Creating MsgStream object in read path" class="doc-image" id="creating-msgstream-object-in-read-path" />
   </span> <span class="img-wrapper"> <span>إنشاء كائن MsgStream في مسار القراءة</span> </span></p>
<p>عند قراءة البيانات، يتم إنشاء كائن MsgStream في السيناريو التالي:</p>
<ul>
<li>في Milvus، لا يمكن قراءة البيانات ما لم يتم تحميلها. عندما يتلقى الوكيل طلب تحميل البيانات، فإنه يرسل الطلب إلى منسق الاستعلام الذي يقرر طريقة تعيين الأجزاء إلى عقد استعلام مختلفة. يتم إرسال معلومات التعيين (أي أسماء القنوات الافتراضية والتعيين بين القنوات الافتراضية وقنوات pchannels المقابلة لها) إلى عقد الاستعلام عبر استدعاء الأسلوب أو RPC (استدعاء إجراء عن بعد). بعد ذلك، تنشئ عقد الاستعلام كائنات MsgStream المقابلة لاستهلاك البيانات.</li>
</ul>
<h2 id="DDL-operations" class="common-anchor-header">عمليات DDL<button data-href="#DDL-operations" class="anchor-icon" translate="no">
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
    </button></h2><p>يرمز DDL إلى لغة تعريف البيانات. يمكن تصنيف عمليات DDL على البيانات الوصفية إلى طلبات كتابة وطلبات قراءة. ومع ذلك، يتم التعامل مع هذين النوعين من الطلبات بالتساوي أثناء معالجة البيانات الوصفية.</p>
<p>تتضمن طلبات القراءة على البيانات الوصفية ما يلي:</p>
<ul>
<li>مخطط مجموعة الاستعلام</li>
<li>معلومات فهرسة الاستعلام والمزيد</li>
</ul>
<p>تتضمن طلبات الكتابة:</p>
<ul>
<li>إنشاء مجموعة</li>
<li>إسقاط مجموعة</li>
<li>إنشاء فهرس</li>
<li>إسقاط فهرس والمزيد</li>
</ul>
<p>يتم إرسال طلبات DDL إلى الوكيل من العميل، ويقوم الوكيل كذلك بتمرير هذه الطلبات بالترتيب المستلم إلى التنسيق الجذر الذي يقوم بتعيين طابع زمني لكل طلب DDL وإجراء عمليات فحص ديناميكية للطلبات. يعالج الوكيل كل طلب بطريقة تسلسلية، أي طلب DDL واحد في كل مرة. لن يقوم الوكيل بمعالجة الطلب التالي حتى يكمل معالجة الطلب السابق ويتلقى النتائج من المنسق الجذر.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/DDL_operations_02679a393c.png" alt="DDL operations." class="doc-image" id="ddl-operations." />
   </span> <span class="img-wrapper"> <span>عمليات DDL</span>. </span></p>
<p>كما هو موضح في الرسم التوضيحي أعلاه، هناك <code translate="no">K</code> طلبات DDL في قائمة انتظار مهام التنسيق الجذر. يتم ترتيب طلبات DDL في قائمة انتظار المهام حسب ترتيب استلامها من قبل المنسق الجذر. لذا، فإن <code translate="no">ddl1</code> هو أول طلب يتم إرساله إلى المنسق الجذر، و <code translate="no">ddlK</code> هو آخر طلب في هذه الدفعة. يعالج المنسق الجذري الطلبات واحدًا تلو الآخر بالترتيب الزمني.</p>
<p>في النظام الموزع، يتم تمكين الاتصال بين الوكلاء والتنسيق الجذري بواسطة gRPC. يحتفظ المنسق الجذر بسجل بالحد الأقصى لقيمة الطابع الزمني للمهام المنفذة لضمان معالجة جميع طلبات DDL بالترتيب الزمني.</p>
<p>لنفترض وجود وكيلين مستقلين، الوكيل 1 والوكيل 2. وكلاهما يرسلان طلبات DDL إلى نفس الإحداثي الجذر. ومع ذلك، فإن إحدى المشاكل هي أن الطلبات السابقة لا يتم إرسالها بالضرورة إلى التنسيق الجذر قبل الطلبات التي يتلقاها وكيل آخر في وقت لاحق. على سبيل المثال، في الصورة أعلاه، عندما يتم إرسال <code translate="no">DDL_K-1</code> إلى المنسق الجذر من الوكيل 1، يكون <code translate="no">DDL_K</code> من الوكيل 2 قد تم قبوله بالفعل وتنفيذه من قبل المنسق الجذر. كما هو مسجل من قبل الإحداثي الجذر، فإن الحد الأقصى لقيمة الطابع الزمني للمهام المنفذة في هذه المرحلة هو <code translate="no">K</code>. لذلك من أجل عدم مقاطعة الترتيب الزمني، سيتم رفض الطلب <code translate="no">DDL_K-1</code> من قبل قائمة انتظار المهام الخاصة بالمنسق الجذر . ومع ذلك، إذا قام الوكيل 2 بإرسال الطلب <code translate="no">DDL_K+5</code> إلى التنسيق الجذر في هذه النقطة، فسيتم قبول الطلب في قائمة انتظار المهام وسيتم تنفيذه لاحقًا وفقًا لقيمة الطابع الزمني الخاص به.</p>
<h2 id="Indexing" class="common-anchor-header">الفهرسة<button data-href="#Indexing" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Building-an-index" class="common-anchor-header">بناء فهرس</h3><p>عند تلقي طلبات بناء الفهرس من العميل، يقوم الوكيل أولاً بإجراء فحوصات ثابتة على الطلبات وإرسالها إلى المنسق الجذر. ثم يقوم المنسق الجذر بإبقاء طلبات بناء الفهرس هذه في مخزن التعريف (إلخd) ويرسل الطلبات إلى منسق الفهرس (منسق الفهرس).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Building_an_index_e130a4e715.png" alt="Building an index." class="doc-image" id="building-an-index." />
   </span> <span class="img-wrapper"> <span>بناء فهرس</span>. </span></p>
<p>كما هو موضح أعلاه، عندما يتلقى منسق الفهرس طلبات بناء الفهرس من المنسق الجذر، فإنه يقوم أولاً باستمرار المهمة في مخزن التعريف (إلخd). الحالة الأولية لمهمة بناء الفهرس هي <code translate="no">Unissued</code>. يحتفظ منسق الفهرس بسجل لتحميل المهام لكل عقدة فهرس، ويرسل المهام الواردة إلى عقدة فهرس أقل تحميلًا. عند الانتهاء من المهمة، تقوم عقدة الفهرس بكتابة حالة المهمة، إما <code translate="no">Finished</code> أو <code translate="no">Failed</code> في مخزن التعريف، وهو عبارة عن إلخd في ميلفوس. بعد ذلك سيفهم منسق الفهرس ما إذا كانت مهمة بناء الفهرس قد نجحت أو فشلت من خلال البحث في إلخd. إذا فشلت المهمة بسبب محدودية موارد النظام أو تسرب عقدة الفهرس، سيعيد منسق الفهرس تشغيل العملية بأكملها وتعيين نفس المهمة إلى عقدة فهرس أخرى.</p>
<h3 id="Dropping-an-index" class="common-anchor-header">إسقاط فهرس</h3><p>بالإضافة إلى ذلك، فإن منسق الفهرس مسؤول أيضاً عن طلبات إسقاط الفهارس.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Dropping_an_index_afdab6a339.png" alt="Dropping an index." class="doc-image" id="dropping-an-index." />
   </span> <span class="img-wrapper"> <span>إسقاط فهرس</span>. </span></p>
<p>عندما يتلقى منسق الفهرس طلب إسقاط فهرس من العميل، يقوم أولاً بوضع علامة على الفهرس على أنه &quot;تم إسقاطه&quot;، ويعيد النتيجة إلى العميل مع إخطار منسق الفهرس. ثم يقوم منسق الفهرس بتصفية جميع مهام الفهرسة باستخدام <code translate="no">IndexID</code> ويتم إسقاط المهام المطابقة للشرط.</p>
<p>سيحذف الروتين الخلفي لمنسق الفهرس تدريجيًا جميع مهام الفهرسة التي تم وضع علامة "مسقطة" عليها من مخزن الكائنات (MinIO و S3). تتضمن هذه العملية واجهة recycleIndexFiles. عندما يتم حذف جميع ملفات الفهرسة المطابقة، تتم إزالة المعلومات الوصفية لمهام الفهرسة المحذوفة من التخزين الوصفية (إلخd).</p>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">حول سلسلة الغوص العميق<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>مع <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">الإعلان الرسمي عن توفر</a> الإصدار 2.0 من Milvus 2.0 بشكل عام، قمنا بتنظيم سلسلة مدونة Milvus Deep Dive هذه لتقديم تفسير متعمق لبنية Milvus ورمز المصدر. تشمل الموضوعات التي تتناولها سلسلة المدونات هذه ما يلي:</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">نظرة عامة على بنية ميلفوس</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">واجهات برمجة التطبيقات وحزم تطوير البرمجيات بايثون</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">معالجة البيانات</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">إدارة البيانات</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">الاستعلام في الوقت الحقيقي</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">محرك التنفيذ القياسي</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">نظام ضمان الجودة</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">محرك التنفيذ المتجه</a></li>
</ul>
