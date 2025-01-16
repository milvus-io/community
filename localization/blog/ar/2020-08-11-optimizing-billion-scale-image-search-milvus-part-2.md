---
id: optimizing-billion-scale-image-search-milvus-part-2.md
title: الجيل الثاني من نظام البحث عن طريق الصور
author: Rife Wang
date: 2020-08-11T22:20:27.855Z
desc: >-
  حالة مستخدم للاستفادة من Milvus لبناء نظام بحث عن تشابه الصور للأعمال التجارية
  في العالم الحقيقي.
cover: assets.zilliz.com/header_c73631b1e7.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/optimizing-billion-scale-image-search-milvus-part-2'
---
<custom-h1>رحلة تحسين البحث عن الصور على نطاق المليار صورة (2/2)</custom-h1><p>هذه المقالة هي الجزء الثاني من <strong>رحلة تحسين البحث عن الصور على نطاق المليار من UPYUN</strong>. إذا فاتك الجزء الأول، انقر <a href="https://zilliz.com/blog/optimizing-billion-scale-image-search-milvus-part-1">هنا</a>.</p>
<h2 id="The-second-generation-search-by-image-system" class="common-anchor-header">الجيل الثاني من نظام البحث عن طريق الصور<button data-href="#The-second-generation-search-by-image-system" class="anchor-icon" translate="no">
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
    </button></h2><p>يختار الجيل الثاني من نظام البحث عن طريق الصور من الناحية التقنية حل CNN + Milvus. يعتمد النظام على متجهات الميزات ويوفر دعمًا تقنيًا أفضل.</p>
<h2 id="Feature-extraction" class="common-anchor-header">استخراج الميزات<button data-href="#Feature-extraction" class="anchor-icon" translate="no">
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
    </button></h2><p>في مجال الرؤية الحاسوبية، أصبح استخدام الذكاء الاصطناعي هو السائد في مجال الرؤية الحاسوبية. وبالمثل، يستخدم استخراج الميزات في الجيل الثاني من نظام البحث عن طريق الصورة من الجيل الثاني الشبكة العصبية التلافيفية (CNN) كتقنية أساسية</p>
<p>يصعب فهم مصطلح CNN. نركز هنا على الإجابة عن سؤالين:</p>
<ul>
<li>ما الذي يمكن أن تفعله شبكة CNN؟</li>
<li>لماذا يمكنني استخدام شبكة CNN للبحث عن الصور؟</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_meme_649be6dfe8.jpg" alt="1-meme.jpg" class="doc-image" id="1-meme.jpg" />
   </span> <span class="img-wrapper"> <span>1-ميم.jpg</span> </span></p>
<p>هناك العديد من المنافسات في مجال الذكاء الاصطناعي وتصنيف الصور من أهمها. تتمثل مهمة تصنيف الصور في تحديد ما إذا كان محتوى الصورة يتعلق بقطة أو كلب أو تفاحة أو كمثرى أو غيرها من أنواع الأشياء.</p>
<p>ما الذي يمكن أن تفعله CNN؟ يمكنها استخراج الميزات والتعرف على الأشياء. فهو يستخرج الميزات من أبعاد متعددة ويقيس مدى قرب ميزات الصورة من ميزات القطط أو الكلاب. ويمكننا اختيار الأقرب منها كنتيجة للتعرف على الأشياء، وهو ما يشير إلى ما إذا كان محتوى صورة معينة يتعلق بقط أو كلب أو أي شيء آخر.</p>
<p>ما هي العلاقة بين وظيفة تحديد الكائنات في شبكة CNN والبحث عن طريق الصورة؟ ما نريده ليس نتيجة التحديد النهائية، بل متجه السمات المستخرجة من أبعاد متعددة. يجب أن تكون متجهات السمات لصورتين متشابهتين في المحتوى متقاربة.</p>
<h3 id="Which-CNN-model-should-I-use" class="common-anchor-header">ما هو نموذج CNN الذي يجب أن أستخدمه؟</h3><p>الإجابة هي VGG16. لماذا تختاره؟ أولاً، يتمتع VGG16 بقدرة جيدة على التعميم، أي أنه متعدد الاستخدامات. ثانيًا، تحتوي متجهات السمات المستخرجة بواسطة VGG16 على 512 بُعدًا. إذا كان هناك عدد قليل جدًا من الأبعاد، فقد تتأثر الدقة. إذا كان هناك الكثير من الأبعاد، فإن تكلفة تخزين وحساب متجهات السمات هذه مرتفعة نسبيًا.</p>
<p>يعد استخدام شبكة CNN لاستخراج ميزات الصورة حلاً سائدًا. يمكننا استخدام VGG16 كنموذج و Keras + TensorFlow للتنفيذ التقني. هذا هو المثال الرسمي لـ Keras:</p>
<pre><code translate="no">from keras.applications.vgg16 import VGG16
from keras.preprocessing import image
from keras.applications.vgg16 import preprocess_input
import numpy as np
model = VGG16(weights=’imagenet’, include_top=False)
img_path = ‘elephant.jpg’
img = image.load_img(img_path, target_size=(224, 224))
x = image.img_to_array(img)
x = np.expand_dims(x, axis=0)
x = preprocess_input(x)
features = model.predict(x)
</code></pre>
<p>الميزات المستخرجة هنا هي متجهات الميزات.</p>
<h3 id="1-Normalization" class="common-anchor-header">1. التطبيع</h3><p>لتسهيل العمليات اللاحقة، غالبًا ما نقوم بتطبيع الميزة:</p>
<p>ما يتم استخدامه لاحقًا هو أيضًا تطبيع <code translate="no">norm_feat</code>.</p>
<h3 id="2-Image-description" class="common-anchor-header">2. وصف الصورة</h3><p>يتم تحميل الصورة باستخدام طريقة <code translate="no">image.load_img</code> من <code translate="no">keras.preprocessing</code>:</p>
<pre><code translate="no">from keras.preprocessing import image
img_path = 'elephant.jpg'
img = image.load_img(img_path, target_size=(224, 224))
</code></pre>
<p>في الواقع، إنها في الواقع طريقة TensorFlow التي تستدعيها Keras. لمزيد من التفاصيل، راجع وثائق TensorFlow. كائن الصورة النهائي هو في الواقع مثيل صورة PIL (PIL المستخدمة من قبل TensorFlow).</p>
<h3 id="3-Bytes-conversion" class="common-anchor-header">3. تحويل البايتات</h3><p>من الناحية العملية، غالبًا ما يتم نقل محتوى الصورة عبر الشبكة. لذلك، بدلًا من تحميل الصور من المسار، نفضل تحويل بيانات البايت مباشرةً إلى كائنات صورة، أي صور PIL:</p>
<pre><code translate="no">import io
from PIL import Image

# img_bytes: 图片内容 bytes
img = Image.open(io.BytesIO(img_bytes))
img = img.convert('RGB')

img = img.resize((224, 224), Image.NEAREST)
</code></pre>
<p>صورة img أعلاه هي نفس النتيجة التي تم الحصول عليها بواسطة طريقة image.load_img. هناك أمران يجب الانتباه إليهما:</p>
<ul>
<li>يجب أن تقوم بتحويل RGB.</li>
<li>يجب تغيير الحجم (تغيير الحجم هو المعلمة الثانية من <code translate="no">load_img method</code>).</li>
</ul>
<h3 id="4-Black-border-processing" class="common-anchor-header">4. معالجة الحدود السوداء</h3><p>قد تحتوي الصور، مثل لقطات الشاشة، أحيانًا على عدد غير قليل من الحدود السوداء. هذه الحدود السوداء ليس لها قيمة عملية وتسبب الكثير من التداخل. لهذا السبب، تعد إزالة الحدود السوداء ممارسة شائعة أيضًا.</p>
<p>الحد الأسود هو في الأساس صف أو عمود من وحدات البكسل حيث تكون جميع وحدات البكسل (0، 0، 0) (صورة RGB). لإزالة الحد الأسود هو العثور على هذه الصفوف أو الأعمدة وحذفها. هذه في الواقع عملية ضرب مصفوفة ثلاثية الأبعاد في NumPy.</p>
<p>مثال على إزالة الحدود السوداء الأفقية:</p>
<pre><code translate="no"># -*- coding: utf-8 -*-
import numpy as np
from keras.preprocessing import image
def RemoveBlackEdge(img):
Args:
       img: PIL image instance
Returns:
       PIL image instance
&quot;&quot;&quot;
   width = img.width
   img = image.img_to_array(img)
   img_without_black = img[~np.all(img == np.zeros((1, width, 3), np.uint8), axis=(1, 2))]
   img = image.array_to_img(img_without_black)
return img
</code></pre>
<p>هذا إلى حد كبير ما أريد أن أتحدث عنه باستخدام شبكة CNN لاستخراج ميزات الصورة وتنفيذ معالجة أخرى للصور. الآن دعونا نلقي نظرة على محركات البحث المتجهة.</p>
<h2 id="Vector-search-engine" class="common-anchor-header">محرك البحث المتجه<button data-href="#Vector-search-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>تم حل مشكلة استخراج متجهات السمات من الصور. ثم المشاكل المتبقية هي:</p>
<ul>
<li>كيفية تخزين متجهات السمات؟</li>
<li>كيفية حساب تشابه متجهات السمات، أي كيفية البحث؟ يمكن لمحرك البحث المتجه مفتوح المصدر Milvus حل هاتين المشكلتين. حتى الآن، يعمل بشكل جيد في بيئة الإنتاج لدينا.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_milvus_logo_3a7411f2c8.png" alt="3-milvus-logo.png" class="doc-image" id="3-milvus-logo.png" />
   </span> <span class="img-wrapper"> <span>3-ميلفوس-شعار.png</span> </span></p>
<h2 id="Milvus-the-vector-search-engine" class="common-anchor-header">ميلفوس، محرك البحث المتجه<button data-href="#Milvus-the-vector-search-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>استخراج متجهات السمات من الصورة ليس كافياً على الإطلاق. نحن بحاجة أيضًا إلى إدارة متجهات الميزات هذه ديناميكيًا (إضافة وحذف وتحديث)، وحساب تشابه المتجهات، وإرجاع بيانات المتجهات في أقرب نطاق جار. يؤدي محرك البحث المتجه مفتوح المصدر Milvus هذه المهام بشكل جيد.</p>
<p>ستصف بقية هذه المقالة الممارسات والنقاط المحددة التي يجب ملاحظتها.</p>
<h3 id="1-Requirements-for-CPU" class="common-anchor-header">1. متطلبات وحدة المعالجة المركزية</h3><p>لاستخدام Milvus، يجب أن تدعم وحدة المعالجة المركزية الخاصة بك مجموعة تعليمات avx2. بالنسبة لأنظمة لينكس، استخدم الأمر التالي للتحقق من مجموعات التعليمات التي تدعمها وحدة المعالجة المركزية لديك:</p>
<p><code translate="no">cat /proc/cpuinfo | grep flags</code></p>
<p>ثم تحصل على شيء مثل:</p>
<pre><code translate="no">flags           : fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb         rdtscp lm constant_tsc arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2     ssse3 sdbg fma cx16 xtpr pdcm pcid dca sse4_1 sse4_2 x2apic movbe popcnt aes xsave avx f16c rdrand lahf_lm abm cpuid_fault epb invpcid_single pti intel_ppin tpr_shadow vnmi flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid cqm xsaveopt cqm_llc cqm_occup_llc dtherm ida arat pln pts
</code></pre>
<p>ما يلي الأعلام هي مجموعات التعليمات التي تدعمها وحدة المعالجة المركزية لديك. بالطبع، هذه أكثر بكثير مما أحتاج إليه. أريد فقط معرفة ما إذا كانت مجموعة تعليمات معينة، مثل avx2، مدعومة. ما عليك سوى إضافة grep لتصفية ذلك:</p>
<pre><code translate="no">cat /proc/cpuinfo | grep flags | grep avx2
</code></pre>
<p>إذا لم يتم إرجاع أي نتيجة، فهذا يعني أن مجموعة التعليمات المحددة هذه غير مدعومة. تحتاج إلى تغيير جهازك إذن.</p>
<h3 id="2-Capacity-planning" class="common-anchor-header">2. تخطيط السعة</h3><p>تخطيط السعة هو أول اعتباراتنا عندما نصمم نظامًا. ما مقدار البيانات التي نحتاج إلى تخزينها؟ ما مقدار الذاكرة ومساحة القرص التي تتطلبها البيانات؟</p>
<p>لنقم ببعض العمليات الحسابية السريعة. كل بعد من أبعاد المتجه هو float32. ويشغل النوع float32 4 بايت. إذاً متجه من 512 بُعداً يتطلب 2 كيلوبايت من التخزين. وعلى نفس المنوال</p>
<ul>
<li>ألف متجه من 512 بُعداً يتطلب 2 ميغابايت من التخزين.</li>
<li>مليون متجه من 512 بُعدًا يتطلب 2 جيجابايت من التخزين.</li>
<li>10 ملايين متجه من 512 بُعدًا تتطلب 20 جيجابايت من التخزين.</li>
<li>100 مليون متجه 512 بُعداً تتطلب 200 جيجابايت من التخزين.</li>
<li>يتطلب مليار متجه من 512 متجه 512 بُعدًا 2 تيرابايت من التخزين.</li>
</ul>
<p>إذا أردنا تخزين جميع البيانات في الذاكرة، فإن النظام يحتاج إلى سعة الذاكرة المقابلة على الأقل.</p>
<p>يوصى باستخدام أداة حساب الحجم الرسمية: أداة تحجيم ميلفوس.</p>
<p>في الواقع قد لا تكون ذاكرتنا بهذا الحجم. (لا يهم حقًا إذا لم يكن لديك ذاكرة كافية. يقوم ميلفوس تلقائيًا بمسح البيانات على القرص). بالإضافة إلى البيانات المتجهة الأصلية، نحتاج أيضًا إلى النظر في تخزين البيانات الأخرى مثل السجلات.</p>
<h3 id="3-System-configuration" class="common-anchor-header">3. تكوين النظام</h3><p>لمزيد من المعلومات حول تكوين النظام، راجع وثائق ملفوس:</p>
<ul>
<li>تكوين خادم ميلفوس: https://milvus.io/docs/v0.10.1/milvus_config.md</li>
</ul>
<h3 id="4-Database-design" class="common-anchor-header">4. تصميم قاعدة البيانات</h3><p><strong>التجميع والتقسيم</strong></p>
<ul>
<li>يُعرف التجميع أيضًا باسم الجدول.</li>
<li>يشير التقسيم إلى الأقسام الموجودة داخل مجموعة.</li>
</ul>
<p>إن التنفيذ الأساسي للتقسيم هو في الواقع نفس تنفيذ المجموعة، باستثناء أن التقسيم يكون تحت مجموعة. ولكن مع الأقسام، يصبح تنظيم البيانات أكثر مرونة. يمكننا أيضًا الاستعلام عن قسم معين في مجموعة لتحقيق نتائج استعلام أفضل.</p>
<p>كم عدد المجموعات والأقسام التي يمكننا الحصول عليها؟ المعلومات الأساسية عن المجموعة والقسم موجودة في البيانات الوصفية. يستخدم Milvus إما SQLite (التكامل الداخلي لـ Milvus) أو MySQL (يتطلب اتصالاً خارجيًا) لإدارة البيانات الوصفية الداخلية. إذا كنت تستخدم SQLite بشكل افتراضي لإدارة البيانات الوصفية (Metadata)، فسوف تعاني من فقدان شديد في الأداء عندما تكون أعداد المجموعات والأقسام كبيرة جداً. ولذلك، يجب ألا يتجاوز العدد الإجمالي للمجموعات والأقسام 50,000 (سيحدد Milvus 0.8.0 هذا العدد بـ 4,096). إذا كنت بحاجة إلى تعيين رقم أكبر، فمن المستحسن استخدام MySQL عبر اتصال خارجي.</p>
<p>بنية البيانات التي تدعمها مجموعة وقسم ميلفوس بسيطة للغاية، أي <code translate="no">ID + vector</code>. بمعنى آخر، لا يوجد سوى عمودين في الجدول: المعرف وبيانات المتجه.</p>
<p><strong>ملاحظة:</strong></p>
<ul>
<li>يجب أن يكون المعرف أعدادًا صحيحة.</li>
<li>نحتاج إلى التأكد من أن المعرف فريد داخل مجموعة وليس داخل قسم.</li>
</ul>
<p><strong>التصفية الشرطية</strong></p>
<p>عندما نستخدم قواعد البيانات التقليدية، يمكننا تحديد قيم الحقول كشروط تصفية. على الرغم من أن ميلفوس لا يقوم بالتصفية بنفس الطريقة بالضبط، يمكننا تنفيذ تصفية مشروطة بسيطة باستخدام المجموعات والأقسام. على سبيل المثال، لدينا كمية كبيرة من بيانات الصور والبيانات تخص مستخدمين محددين. ثم يمكننا تقسيم البيانات إلى أقسام حسب المستخدم. لذلك، فإن استخدام المستخدم كشرط تصفية هو في الواقع تحديد القسم.</p>
<p><strong>البيانات المهيكلة وتعيين المتجهات</strong></p>
<p>يدعم Milvus فقط بنية بيانات المعرف + المتجه. ولكن في سيناريوهات العمل، ما نحتاجه هو بيانات منظمة تحمل معنى العمل. بمعنى آخر، نحتاج إلى العثور على بيانات منظمة من خلال المتجهات. وفقًا لذلك، نحتاج إلى الحفاظ على علاقات التعيين بين البيانات المنظمة والمتجهات من خلال المعرف.</p>
<pre><code translate="no">structured data ID &lt;--&gt; mapping table &lt;--&gt; Milvus ID
</code></pre>
<p><strong>تحديد الفهرس</strong></p>
<p>يمكنك الرجوع إلى المقالات التالية:</p>
<ul>
<li>أنواع الفهرس: https://www.milvus.io/docs/v0.10.1/index.md</li>
<li>كيفية تحديد الفهرس: https://medium.com/@milvusio/كيفية اختيار فهرس في ميلفوس-4f3d1525259212</li>
</ul>
<h3 id="5-Processing-search-results" class="common-anchor-header">5. معالجة نتائج البحث</h3><p>نتائج البحث في ميلفوس هي مجموعة من المعرف + المسافة:</p>
<ul>
<li>المعرف: المعرف في المجموعة.</li>
<li>المسافة: تشير قيمة المسافة من 0 ~ 1 إلى مستوى التشابه؛ كلما كانت القيمة أصغر، كلما كان المتجهان أكثر تشابهًا.</li>
</ul>
<p><strong>تصفية البيانات التي يكون معرّفها -1</strong></p>
<p>عندما يكون عدد المجموعات صغيرًا جدًا، قد تحتوي نتائج البحث على بيانات معرفها -1. نحتاج إلى تصفيتها بأنفسنا.</p>
<p><strong>ترقيم الصفحات</strong></p>
<p>البحث عن المتجهات مختلف تمامًا. يتم فرز نتائج الاستعلام بترتيب تنازلي من حيث التشابه، ويتم تحديد أكثر النتائج تشابهًا (topK) من النتائج (يتم تحديد topK من قبل المستخدم في وقت الاستعلام).</p>
<p>لا يدعم ميلفوس ترقيم الصفحات. نحتاج إلى تنفيذ وظيفة ترقيم الصفحات بأنفسنا إذا احتجنا إليها في العمل. على سبيل المثال، إذا كان لدينا عشر نتائج في كل صفحة ونريد عرض الصفحة الثالثة فقط، نحتاج إلى تحديد أن topK = 30 وإرجاع آخر عشر نتائج فقط.</p>
<p><strong>عتبة التشابه للأعمال</strong></p>
<p>تتراوح المسافة بين متجهي صورتين بين 0 و1. إذا أردنا تحديد ما إذا كانت صورتان متشابهتين في سيناريو عمل معين، نحتاج إلى تحديد عتبة ضمن هذا النطاق. تكون الصورتان متشابهتين إذا كانت المسافة بينهما أصغر من العتبة، أو تكونان مختلفتين تمامًا عن بعضهما البعض إذا كانت المسافة أكبر من العتبة. تحتاج إلى ضبط العتبة لتلبية احتياجات عملك الخاصة.</p>
<blockquote>
<p>تمت كتابة هذه المقالة من قبل rifewang، مستخدم Milvus ومهندس برمجيات في UPYUN. إذا أعجبك هذا المقال، فمرحبًا بك لتلقي التحية على https://github.com/rifewang.</p>
</blockquote>
