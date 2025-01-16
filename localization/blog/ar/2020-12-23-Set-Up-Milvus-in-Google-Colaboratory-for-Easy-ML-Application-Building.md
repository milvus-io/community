---
id: Set-Up-Milvus-in-Google-Colaboratory-for-Easy-ML-Application-Building.md
title: إعداد تطبيق Milvus في Google Colaboratory لبناء تطبيق التعلم الآلي بسهولة
author: milvus
date: 2020-12-23T10:30:58.020Z
desc: >-
  يجعل Google Colab تطوير تطبيقات التعلم الآلي واختبارها أمرًا سهلاً للغاية.
  تعرّف على كيفية إعداد Milvus في Colab لتحسين إدارة البيانات المتجهة على نطاق
  واسع.
cover: assets.zilliz.com/3_cbea41e9a6.jpg
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/Set-Up-Milvus-in-Google-Colaboratory-for-Easy-ML-Application-Building
---
<custom-h1>إعداد برنامج Milvus في Google Colaboratory لسهولة بناء تطبيقات تعلّم الآلة</custom-h1><p>يعمل التقدم التكنولوجي على الدوام على جعل الذكاء الاصطناعي والتحليلات على نطاق الآلة أكثر سهولة في الوصول إليها واستخدامها. إن <a href="https://techcrunch.com/2019/01/12/how-open-source-software-took-over-the-world/?guccounter=1&amp;guce_referrer=aHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS8&amp;guce_referrer_sig=AQAAAL_qokucWT-HjbiOznq2RlO5TG78V6UYf332FKnWl3_knuMo6t5HZvZkIHFL3fhYX0nLzM6V1lVVAK4G3BXZHENX3zCXXgggGt39L9HKde3BufW1-iM2oKm0NIav2fcqgxvfpvx_7EPGstI7c_n99stI9oJf9sdsRPTQ6Wnu7DYX">انتشار</a> البرامج مفتوحة المصدر ومجموعات البيانات العامة والأدوات المجانية الأخرى هي القوى الأساسية التي تقود هذا الاتجاه. من خلال الجمع بين اثنين من الموارد المجانية، وهما <a href="https://milvus.io/">Milvus</a> <a href="https://colab.research.google.com/notebooks/intro.ipynb#scrollTo=5fCEDCU_qrC0">وGoogle Colaboratory</a> ("Colab" اختصارًا)، يمكن لأي شخص إنشاء حلول قوية ومرنة للذكاء الاصطناعي وتحليلات البيانات. تقدم هذه المقالة إرشادات لإعداد Milvus في Colab، بالإضافة إلى إجراء العمليات الأساسية باستخدام مجموعة تطوير برامج Python (SDK).</p>
<p><strong>الانتقال إلى:</strong></p>
<ul>
<li><a href="#what-is-milvus">ما هو ميلفوس؟</a></li>
<li><a href="#what-is-google-colaboratory">ما هو Google Colaboratory؟</a></li>
<li><a href="#getting-started-with-milvus-in-google-colaboratory">الشروع في استخدام ملفوس في جوجل كولابوراتوري</a></li>
<li><a href="#run-basic-milvus-operations-in-google-colab-with-python">تشغيل عمليات Milvus الأساسية في Google Colaboratory باستخدام Python</a></li>
<li><a href="#milvus-and-google-colaboratory-work-beautifully-together">يعمل ميلفوس وجوجل كولابوراتوري معًا بشكل رائع</a></li>
</ul>
<h3 id="What-is-Milvus" class="common-anchor-header">ما هو ميلفوس؟</h3><p><a href="https://milvus.io/">Milvus</a> هو محرك بحث عن التشابه المتجه مفتوح المصدر يمكن أن يتكامل مع مكتبات الفهرسة المعتمدة على نطاق واسع، بما في ذلك Faiss وNMSLIB وAnnoy. تتضمن المنصة أيضًا مجموعة شاملة من واجهات برمجة التطبيقات البديهية. من خلال إقران Milvus بنماذج الذكاء الاصطناعي (AI)، يمكن بناء مجموعة متنوعة من التطبيقات بما في ذلك:</p>
<ul>
<li>محركات البحث عن الصور والفيديو والصوت والنصوص الدلالية.</li>
<li>أنظمة التوصيات وروبوتات الدردشة الآلية.</li>
<li>تطوير الأدوية الجديدة والفحص الجيني والتطبيقات الطبية الحيوية الأخرى.</li>
</ul>
<h3 id="What-is-Google-Colaboratory" class="common-anchor-header">ما هو Google Colaboratory؟</h3><p><a href="https://colab.research.google.com/notebooks/intro.ipynb#recent=true">Google Colaboratory</a> هو منتج من فريق أبحاث Google الذي يسمح لأي شخص بكتابة وتشغيل كود بايثون من متصفح الويب. تم تصميم Colaboratory مع وضع تطبيقات التعلُّم الآلي وتحليل البيانات في الاعتبار، ويوفر بيئة دفتر ملاحظات Jupyter مجانًا، ويتزامن مع Google Drive، ويتيح للمستخدمين الوصول إلى موارد الحوسبة السحابية القوية (بما في ذلك وحدات معالجة الرسومات). تدعم المنصة العديد من مكتبات التعلم الآلي الشائعة ويمكن دمجها مع PyTorch وTensorFlow وKeras وOpenCV.</p>
<h3 id="Getting-started-with-Milvus-in-Google-Colaboratory" class="common-anchor-header">الشروع في استخدام Milvus في Google Colaboratory</h3><p>على الرغم من أن Milvus يوصي <a href="https://milvus.io/docs/v0.10.4/milvus_docker-cpu.md">باستخدام Docker</a> لتثبيت الخدمة وبدء تشغيلها، إلا أن بيئة Google Colab السحابية الحالية لا تدعم تثبيت Docker. بالإضافة إلى ذلك، يهدف هذا البرنامج التعليمي إلى أن يكون متاحًا قدر الإمكان - ولا يستخدم الجميع Docker. قم بتثبيت النظام وبدء تشغيله عن طريق <a href="https://github.com/milvus-io/milvus/blob/master/DEVELOPMENT.md">تجميع التعليمات البرمجية المصدرية</a> لـ <a href="https://github.com/milvus-io/milvus/blob/master/DEVELOPMENT.md">Milvus</a> لتجنب استخدام Docker.</p>
<h3 id="Download-Milvus’-source-code-and-create-a-new-notebook-in-Colab" class="common-anchor-header">قم بتنزيل كود مصدر ميلفوس وإنشاء دفتر ملاحظات جديد في كولاب</h3><p>يأتي Google Colab مزودًا بجميع البرامج الداعمة لـ Milvus مثبتة مسبقًا، بما في ذلك أدوات التجميع المطلوبة GCC و CMake و Git وبرامج التشغيل CUDA و NVIDIA، مما يسهل عملية التثبيت والإعداد لـ Milvus. للبدء، قم بتنزيل التعليمات البرمجية المصدرية لميلفوس وأنشئ دفتر ملاحظات جديد في Google Colab:</p>
<ol>
<li>قم بتنزيل كود المصدر الخاص بـ Milvus Milvus_tutorial.ipynb.</li>
</ol>
<p><code translate="no">Wget https://raw.githubusercontent.com/milvus-io/bootcamp/0.10.0/getting_started/basics/milvus_tutorial/Milvus_tutorial.ipynb</code></p>
<ol start="2">
<li>قم بتحميل التعليمات البرمجية المصدرية لـ Milvus إلى <a href="https://colab.research.google.com/notebooks/intro.ipynb#recent=true">Google Colab</a> وأنشئ دفتر ملاحظات جديد.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Set_Up_Milvus_in_Google_Colaboratory_for_Easy_ML_Application_Building_2_27809b0ce2.png" alt="Blog_Set Up Milvus in Google Colaboratory for Easy ML Application Building_2.png" class="doc-image" id="blog_set-up-milvus-in-google-colaboratory-for-easy-ml-application-building_2.png" />
   </span> <span class="img-wrapper"> <span>Blog_Set Up Milvus في Google Colaboratory لبناء تطبيق التعلم الآلي بسهولة_2.png</span> </span></p>
<h3 id="Compile-Milvus-from-source-code" class="common-anchor-header">تجميع ميلفوس من الشيفرة المصدرية</h3><h4 id="Download-Milvus-source-code" class="common-anchor-header">تنزيل كود مصدر ميلفوس</h4><p><code translate="no">git clone -b 0.10.3 https://github.com/milvus-io/milvus.git</code></p>
<h4 id="Install-dependencies" class="common-anchor-header">تثبيت التبعيات</h4><p><code translate="no">% cd /content/milvus/core ./ubuntu_build_deps.sh./ubuntu_build_deps.sh</code></p>
<h4 id="Build-Milvus-source-code" class="common-anchor-header">بناء كود مصدر Milvus</h4><pre><code translate="no">% <span class="hljs-built_in">cd</span> /content/milvus/core
!<span class="hljs-built_in">ls</span>
!./build.sh -t Release
<span class="hljs-comment"># To build GPU version, add -g option, and switch the notebook settings with GPU</span>
<span class="hljs-comment">#((Edit -&gt; Notebook settings -&gt; select GPU))</span>
<span class="hljs-comment"># !./build.sh -t Release -g</span>
<button class="copy-code-btn"></button></code></pre>
<blockquote>
<p>ملاحظة: إذا تم تجميع إصدار GPU بشكل صحيح، سيظهر إشعار "تم تمكين موارد GPU!".</p>
</blockquote>
<h3 id="Launch-Milvus-server" class="common-anchor-header">تشغيل خادم ميلفوس</h3><h4 id="Add-lib-directory-to-LDLIBRARYPATH" class="common-anchor-header">أضف دليل lib/ إلى LD_LIBRARY_PATH:</h4><pre><code translate="no">% <span class="hljs-built_in">cd</span> /content/milvus/core/milvus
! <span class="hljs-built_in">echo</span> <span class="hljs-variable">$LD_LIBRARY_PATH</span>
import os
os.environ[<span class="hljs-string">&#x27;LD_LIBRARY_PATH&#x27;</span>] +=<span class="hljs-string">&quot;:/content/milvus/core/milvus/lib&quot;</span>
! <span class="hljs-built_in">echo</span> <span class="hljs-variable">$LD_LIBRARY_PATH</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Start-and-run-Milvus-server-in-the-background" class="common-anchor-header">بدء تشغيل خادم Milvus وتشغيله في الخلفية:</h4><pre><code translate="no">% <span class="hljs-built_in">cd</span> scripts
! <span class="hljs-built_in">ls</span>
! <span class="hljs-built_in">nohup</span> ./start_server.sh &amp;
<button class="copy-code-btn"></button></code></pre>
<h4 id="Show-Milvus-server-status" class="common-anchor-header">إظهار حالة خادم Milvus:</h4><pre><code translate="no">! <span class="hljs-built_in">ls</span>
! <span class="hljs-built_in">cat</span> nohup.out
<button class="copy-code-btn"></button></code></pre>
<blockquote>
<p>ملاحظة: إذا تم تشغيل خادم Milvus بنجاح، تظهر المطالبة التالية:</p>
</blockquote>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Set_Up_Milvus_in_Google_Colaboratory_for_Easy_ML_Application_Building_3_b15138cd59.png" alt="Blog_Set Up Milvus in Google Colaboratory for Easy ML Application Building_3.png" class="doc-image" id="blog_set-up-milvus-in-google-colaboratory-for-easy-ml-application-building_3.png" />
   </span> <span class="img-wrapper"> <span>Blog_Set Up Milvus في Google Colaboratory لبناء تطبيق ML سهل_3.png</span> </span></p>
<h3 id="Run-basic-Milvus-operations-in-Google-Colab-with-Python" class="common-anchor-header">تشغيل عمليات Milvus الأساسية في Google Colab باستخدام Python</h3><p>بعد بدء التشغيل بنجاح في Google Colab، يمكن لـ Milvus توفير مجموعة متنوعة من واجهات واجهة برمجة التطبيقات لـ Python و Java و Go و Restful و C++. فيما يلي إرشادات لاستخدام واجهة Python لتنفيذ عمليات Milvus الأساسية في Colab.</p>
<h4 id="Install-pymilvus" class="common-anchor-header">تثبيت pymilvus:</h4><p><code translate="no">! pip install pymilvus==0.2.14</code></p>
<h4 id="Connect-to-the-server" class="common-anchor-header">الاتصال بالخادم:</h4><pre><code translate="no"><span class="hljs-comment"># Connect to Milvus Server</span>
milvus = Milvus(_HOST, _PORT)


<span class="hljs-comment"># Return the status of the Milvus server.</span>
server_status = milvus.server_status(timeout=<span class="hljs-number">10</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Create-a-collectionpartitionindex" class="common-anchor-header">إنشاء مجموعة/قسم/فهرس:</h4><pre><code translate="no"><span class="hljs-comment"># Information needed to create a collection</span>
param={<span class="hljs-string">&#x27;collection_name&#x27;</span>:collection_name, <span class="hljs-string">&#x27;dimension&#x27;</span>: _DIM, <span class="hljs-string">&#x27;index_file_size&#x27;</span>: _INDEX_FILE_SIZE, <span class="hljs-string">&#x27;metric_type&#x27;</span>: MetricType.L2}

<span class="hljs-comment"># Create a collection.</span>
milvus.create_collection(param, timeout=<span class="hljs-number">10</span>)

<span class="hljs-comment"># Create a partition for a collection.</span>
milvus.create_partition(collection_name=collection_name, partition_tag=partition_tag, timeout=<span class="hljs-number">10</span>)
ivf_param = {<span class="hljs-string">&#x27;nlist&#x27;</span>: <span class="hljs-number">16384</span>}

<span class="hljs-comment"># Create index for a collection.</span>
milvus.create_index(collection_name=collection_name, index_type=IndexType.IVF_FLAT, params=ivf_param)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Insert-and-flush" class="common-anchor-header">إدراج وتدفق:</h4><pre><code translate="no"><span class="hljs-comment"># Insert vectors to a collection.</span>
milvus.insert(collection_name=collection_name, records=vectors, ids=ids)

<span class="hljs-comment"># Flush vector data in one collection or multiple collections to disk.</span>
milvus.flush(collection_name_array=[collection_name], timeout=<span class="hljs-literal">None</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Load-and-search" class="common-anchor-header">تحميل وبحث:</h4><pre><code translate="no"><span class="hljs-comment"># Load a collection for caching.</span>
milvus.load_collection(collection_name=collection_name, timeout=<span class="hljs-literal">None</span>)

<span class="hljs-comment"># Search vectors in a collection.</span>
search_param = { <span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">16</span> }
milvus.search(collection_name=collection_name,query_records=[vectors[<span class="hljs-number">0</span>]],partition_tags=<span class="hljs-literal">None</span>,top_k=<span class="hljs-number">10</span>,params=search_param)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Get-collectionindex-information" class="common-anchor-header">الحصول على معلومات المجموعة/الفهرس:</h4><pre><code translate="no"><span class="hljs-comment"># Return information of a collection.    milvus.get_collection_info(collection_name=collection_name, timeout=10)</span>

<span class="hljs-comment"># Show index information of a collection.    milvus.get_index_info(collection_name=collection_name, timeout=10)</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Get-vectors-by-ID" class="common-anchor-header">الحصول على المتجهات حسب المعرف:</h4><pre><code translate="no"><span class="hljs-comment"># List the ids in segment</span>
<span class="hljs-comment"># you can get the segment_name list by get_collection_stats() function.</span>
milvus.list_id_in_segment(collection_name =collection_name, segment_name=<span class="hljs-string">&#x27;1600328539015368000&#x27;</span>, timeout=<span class="hljs-literal">None</span>)

<span class="hljs-comment"># Return raw vectors according to ids, and you can get the ids list by list_id_in_segment() function.</span>
milvus.get_entity_by_id(collection_name=collection_name, ids=[<span class="hljs-number">0</span>], timeout=<span class="hljs-literal">None</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Getset-parameters" class="common-anchor-header">الحصول على/ضبط المعلمات:</h4><pre><code translate="no"># Get Milvus configurations.    milvus.get_config(parent_key=<span class="hljs-string">&#x27;cache&#x27;</span>, child_key=<span class="hljs-string">&#x27;cache_size&#x27;</span>)

# Set Milvus configurations.    milvus.set_config(parent_key=<span class="hljs-string">&#x27;cache&#x27;</span>, child_key=<span class="hljs-string">&#x27;cache_size&#x27;</span>, value=<span class="hljs-string">&#x27;5G&#x27;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Delete-indexvectorspartitioncollection" class="common-anchor-header">حذف الفهرس/المتجهات/المجموعة/المجموعة:</h4><pre><code translate="no"><span class="hljs-comment"># Remove an index.    milvus.drop_index(collection_name=collection_name, timeout=None)</span>

<span class="hljs-comment"># Delete vectors in a collection by vector ID.</span>
<span class="hljs-comment"># id_array (list[int]) -- list of vector id    milvus.delete_entity_by_id(collection_name=collection_name, id_array=[0], timeout=None)</span>

<span class="hljs-comment"># Delete a partition in a collection.    milvus.drop_partition(collection_name=collection_name, partition_tag=partition_tag, timeout=None)</span>

<span class="hljs-comment"># Delete a collection by name.    milvus.drop_collection(collection_name=collection_name, timeout=10)</span>
<button class="copy-code-btn"></button></code></pre>
<p><br/></p>
<h3 id="Milvus-and-Google-Colaboratory-work-beautifully-together" class="common-anchor-header">يعمل Milvus وGoogle Colaboratory معًا بشكل جميل</h3><p>إن Google Colaboratory هي خدمة سحابية مجانية وبديهية تبسط إلى حد كبير تجميع Milvus من التعليمات البرمجية المصدرية وتشغيل عمليات Python الأساسية. كلا الموردين متاحان لأي شخص لاستخدامهما، مما يجعل تكنولوجيا الذكاء الاصطناعي والتعلم الآلي في متناول الجميع. لمزيد من المعلومات حول ميلفوس، اطلع على الموارد التالية:</p>
<ul>
<li>للحصول على دروس إضافية تغطي مجموعة متنوعة من التطبيقات، قم بزيارة <a href="https://github.com/milvus-io/bootcamp">معسكر تدريب ميلفوس</a>.</li>
<li>بالنسبة للمطورين المهتمين بتقديم مساهمات أو الاستفادة من النظام، يمكنك العثور على <a href="https://github.com/milvus-io/milvus">Milvus على GitHub</a>.</li>
<li>للمزيد من المعلومات عن الشركة التي أطلقت ميلفوس، تفضل بزيارة <a href="https://zilliz.com/">Zilliz.com.</a></li>
</ul>
