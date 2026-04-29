---
id: deepseek-v4-vs-gpt-55-vs-qwen36-which-model-should-you-use.md
title: 'DeepSeek V4 مقابل GPT-5.5.5 مقابل Qwen3.6: ما النموذج الذي يجب عليك استخدامه؟'
author: Lumina Wang
date: 2026-4-28
cover: assets.zilliz.com/blog_cover_narrow_1152x720_87d33982dd.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'DeepSeek V4, GPT-5.5 benchmark, Milvus RAG, Qwen3.6, vector database'
meta_title: |
  DeepSeek V4 RAG Benchmark with Milvus vs GPT-5.5 and Qwen
desc: >-
  قارن بين DeepSeek V4 وGPT-5.5.5 وQwen3.6 في اختبارات الاسترجاع والتصحيح
  واختبارات السياق الطويل، ثم أنشئ خط أنابيب Milvus RAG باستخدام DeepSeek V4.
origin: >-
  https://milvus.io/blog/deepseek-v4-vs-gpt-55-vs-qwen36-which-model-should-you-use.md
---
<p>تتحرك إصدارات النماذج الجديدة بشكل أسرع من قدرة فرق الإنتاج على تقييمها. تبدو كل من DeepSeek V4 و GPT-5.5.5 و Qwen3.6-35B-A3B قوية على الورق، ولكن السؤال الأصعب بالنسبة لمطوري تطبيقات الذكاء الاصطناعي هو السؤال العملي: أي نموذج يجب أن تستخدمه للأنظمة ذات الاسترجاع الثقيل ومهام الترميز وتحليل السياق الطويل <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">وخطوط أنابيب RAG؟</a></p>
<p><strong>تقارن هذه المقالة بين النماذج الثلاثة في الاختبارات العملية:</strong> الاسترجاع المباشر للمعلومات، وتصحيح الأخطاء المتزامنة مع التصحيح، واسترجاع علامات السياق الطويل. ثم يوضح كيفية توصيل DeepSeek V4 <a href="https://zilliz.com/learn/what-is-vector-database">بقاعدة بيانات Milvus vector،</a> بحيث يأتي السياق المسترجع من قاعدة معرفية قابلة للبحث بدلاً من معلمات النموذج وحدها.</p>
<h2 id="What-Are-DeepSeek-V4-GPT-55-and-Qwen36-35B-A3B" class="common-anchor-header">ما هي DeepSeek V4 و GPT-5.5.5 و Qwen3.6-35B-A3B؟<button data-href="#What-Are-DeepSeek-V4-GPT-55-and-Qwen36-35B-A3B" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>DeepSeek V4 و GPT-5.5.5 و Qwen3.6-35B-A3B هي نماذج ذكاء اصطناعي مختلفة تستهدف أجزاءً مختلفة من مكدس النماذج.</strong> يركّز DeepSeek V4 على الاستدلال طويل الأمد مفتوح السياق. يركز GPT-5.5.5 على الأداء المستضاف في الحدود، والترميز، والبحث عبر الإنترنت، والمهام ذات الأدوات الثقيلة. يركز Qwen3.6-35B-A3B على النشر متعدد الوسائط مفتوح الوزن مع بصمة أصغر بكثير من المعلمة النشطة.</p>
<p>المقارنة مهمة لأن نظام <a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">البحث المتجه الإنتاجي</a> نادرًا ما يعتمد على النموذج وحده. تؤثر كل من قدرة النموذج، وطول السياق، والتحكم في النشر، وجودة الاسترجاع، وتكلفة العرض على تجربة المستخدم النهائية.</p>
<h3 id="DeepSeek-V4-An-Open-Weight-MoE-Model-for-Long-Context-Cost-Control" class="common-anchor-header">DeepSeek V4: نموذج MoE مفتوح الوزن للتحكم في تكلفة السياق الطويل</h3><p><a href="https://api-docs.deepseek.com/news/news260424"><strong>DeepSeek V4</strong></a> <strong>عبارة عن عائلة نماذج MoE مفتوحة الوزن من طراز MoE التي أصدرتها DeepSeek في 24 أبريل 2026.</strong> يسرد الإصدار الرسمي نوعين مختلفين: DeepSeek V4-Pro و DeepSeek V4-Flash. يحتوي V4-Pro على 1.6 تيرابايت من المعلمات الإجمالية مع تنشيط 49B لكل رمز مميز، بينما يحتوي V4-Flash على 284B من المعلمات الإجمالية مع تنشيط 13B لكل رمز مميز. كلاهما يدعمان نافذة سياق 1M-رمز.</p>
<p>تسرد <a href="https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro">بطاقة نموذج DeepSeek V4-Pro</a> أيضًا أن النموذج مرخص من معهد ماساتشوستس للتكنولوجيا ومتاح من خلال Hugging Face و ModelScope. بالنسبة للفرق التي تقوم ببناء تدفقات عمل المستندات ذات السياق الطويل، فإن الجاذبية الرئيسية هي التحكم في التكلفة ومرونة النشر مقارنةً بواجهات برمجة التطبيقات الأمامية المغلقة بالكامل.</p>
<h3 id="GPT-55-A-Hosted-Frontier-Model-for-Coding-Research-and-Tool-Use" class="common-anchor-header">GPT-5.5.5: نموذج حدودي مستضاف للترميز والبحث واستخدام الأدوات</h3><p><a href="https://openai.com/index/introducing-gpt-5-5/"><strong>GPT-5.5</strong></a> <strong>هو نموذج حدودي مغلق أصدرته OpenAI في 23 أبريل 2026.</strong> يضعه OpenAI للترميز، والبحث عبر الإنترنت، وتحليل البيانات، وعمل المستندات، وعمل جداول البيانات، وتشغيل البرامج، والمهام القائمة على الأدوات. تسرد مستندات النموذج الرسمي <code translate="no">gpt-5.5</code> مع نافذة سياق واجهة برمجة التطبيقات بمليون رمز، بينما قد تختلف حدود منتجات Codex وChatGPT.</p>
<p>تشير تقارير OpenAI إلى نتائج معيارية قوية في الترميز: 82.7٪ على Terminal-Bench 2.0، و73.1٪ على Expert-SWE، و58.6٪ على SWE-Bench Pro. المفاضلة هي السعر: يسرد تسعير واجهة برمجة التطبيقات الرسمية GPT-5.5 بسعر 5 دولارات لكل مليون رمز إدخال و30 دولارًا لكل مليون رمز إخراج، قبل أي تفاصيل تسعير خاصة بالمنتج أو السياق الطويل.</p>
<h3 id="Qwen36-35B-A3B-A-Smaller-Active-Parameter-Model-for-Local-and-Multimodal-Workloads" class="common-anchor-header">Qwen3.6-35B-A3B: نموذج معيار نشط أصغر لأحمال العمل المحلية ومتعددة الوسائط</h3><p><a href="https://huggingface.co/Qwen/Qwen3.6-35B-A3B"><strong>Qwen3.6.6-35B-A3B</strong></a> <strong>هو نموذج وزارة الطاقة مفتوح الوزن من فريق Qwen التابع لعلي بابا.</strong> تسرد بطاقة النموذج الخاصة به 35 مليار معلمة إجمالية، و3 مليار معلمة مفعلة، ومشفّر رؤية، وترخيص Apache-2.0. وهي تدعم نافذة سياق أصلية مكونة من 262,144 رمزًا ويمكن أن تمتد إلى حوالي 1,010,000 رمز مع تحجيم YaRN.</p>
<p>هذا يجعل Qwen3.6-35B-A3B جذابًا عندما يكون النشر المحلي أو العرض الخاص أو إدخال النص المصور أو أعباء العمل باللغة الصينية أكثر أهمية من ملاءمة النموذج الحدودي المُدار.</p>
<h3 id="DeepSeek-V4-vs-GPT-55-vs-Qwen36-Model-Specs-Compared" class="common-anchor-header">DeepSeek V4 مقابل GPT-5.5.5 مقابل Qwen3.6: مقارنة مواصفات النموذج</h3><table>
<thead>
<tr><th>النموذج</th><th>نموذج النشر</th><th>معلومات المعلمة العامة</th><th>نافذة السياق</th><th>أقوى ملاءمة</th></tr>
</thead>
<tbody>
<tr><td>DeepSeek V4-Pro</td><td>مفتوح الوزن MoE؛ واجهة برمجة التطبيقات متاحة</td><td>إجمالي 1.6T / 49B نشط</td><td>1 مليون رمز</td><td>عمليات نشر هندسية طويلة السياق وحساسة من حيث التكلفة</td></tr>
<tr><td>GPT-5.5.5</td><td>نموذج مغلق مستضاف</td><td>غير معلن</td><td>1 مليون توكن في واجهة برمجة التطبيقات</td><td>الترميز، والبحث المباشر، واستخدام الأدوات، وأعلى قدرة إجمالية</td></tr>
<tr><td>Qwen3.6-35B-A3B</td><td>وزارة الطاقة متعددة الوسائط مفتوحة الوزن</td><td>إجمالي 35 مليار / 3 مليار نشط</td><td>262 ألف أصلية؛ حوالي 1 مليون مع YaRN</td><td>نشر محلي/خاص، ومدخلات متعددة الوسائط، وسيناريوهات باللغة الصينية</td></tr>
</tbody>
</table>
<h2 id="How-We-Tested-DeepSeek-V4-GPT-55-and-Qwen36" class="common-anchor-header">كيف اختبرنا DeepSeek V4 وGPT-5.5.5 و Qwen3.6<button data-href="#How-We-Tested-DeepSeek-V4-GPT-55-and-Qwen36" class="anchor-icon" translate="no">
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
    </button></h2><p>هذه الاختبارات ليست بديلاً عن مجموعات المعايير الكاملة. إنها اختبارات عملية تعكس أسئلة المطورين الشائعة: هل يمكن للنموذج استرداد المعلومات الحالية، والاستدلال على الأخطاء البرمجية الدقيقة، وتحديد موقع الحقائق داخل مستند طويل جدًا؟</p>
<h3 id="Which-Model-Handles-Real-Time-Information-Retrieval-Best" class="common-anchor-header">أي نموذج يتعامل مع استرجاع المعلومات في الوقت الحقيقي بشكل أفضل؟</h3><p>طرحنا على كل نموذج ثلاثة أسئلة حساسة للوقت باستخدام البحث على الويب حيثما كان متاحًا. كانت التعليمات بسيطة: إرجاع الإجابة فقط وتضمين عنوان URL المصدر.</p>
<table>
<thead>
<tr><th>السؤال</th><th>الإجابة المتوقعة في وقت الاختبار</th><th>المصدر</th></tr>
</thead>
<tbody>
<tr><td>ما هي تكلفة إنشاء صورة متوسطة الجودة بدقة 1024×1024 مع <code translate="no">gpt-image-2</code> من خلال واجهة برمجة تطبيقات OpenAI؟</td><td><code translate="no">\$0.053</code></td><td><a href="https://developers.openai.com/api/docs/guides/image-generation">تسعير إنشاء صورة OpenAI</a></td></tr>
<tr><td>ما هي الأغنية رقم 1 في قائمة بيلبورد هوت 100 لهذا الأسبوع، ومن هو الفنان؟</td><td><code translate="no">Choosin' Texas</code> بواسطة إيلا لانجلي</td><td><a href="https://www.billboard.com/charts/hot-100/">مخطط بيلبورد هوت 100</a></td></tr>
<tr><td>من يتصدر حالياً ترتيب سائقي الفورمولا 1 لعام 2026؟</td><td>كيمي أنتونيلي</td><td><a href="https://www.formula1.com/en/results/2026/drivers">ترتيب سائقي الفورمولا 1</a></td></tr>
</tbody>
</table>
<table>
<thead>
<tr><th>ملاحظة: هذه أسئلة حساسة للوقت. تعكس الإجابات المتوقعة النتائج في الوقت الذي أجرينا فيه الاختبار.</th></tr>
</thead>
<tbody>
</tbody>
</table>
<p>تستخدم صفحة تسعير الصور في OpenAI التسمية "متوسط" بدلاً من "قياسي" لنتيجة 0.053 دولار 1024×1024، لذلك تم تطبيع السؤال هنا ليتطابق مع صياغة واجهة برمجة التطبيقات الحالية.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_2_408d990bb6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_3_082d496650.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_4_7fd44e596b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Real-Time-Retrieval-Results-GPT-55-Had-the-Clearest-Advantage" class="common-anchor-header">نتائج الاسترجاع في الوقت الحقيقي: كان لدى GPT-5.5.5 الميزة الأوضح</h3><h4 id="DeepSeek-V4-Pro" class="common-anchor-header">DeepSeek V4-Pro</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_5_1e9d7c4c06.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>أجاب DeepSeek V4-Pro على السؤال الأول بشكل غير صحيح. لم يتمكن من الإجابة عن السؤالين الثاني والثالث من خلال البحث المباشر على الويب في هذا الإعداد.</p>
<p>تضمنت الإجابة الثانية عنوان URL الصحيح ل Billboard ولكنها لم تسترجع الأغنية رقم 1 الحالية. استخدمت الإجابة الثالثة المصدر الخاطئ، لذا اعتبرناها غير صحيحة.</p>
<h4 id="GPT-55" class="common-anchor-header">GPT-5.5.5</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_6_b146956865.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>تعامل GPT-5.5.5 مع هذا الاختبار بشكل أفضل بكثير. فقد كانت إجاباته قصيرة ودقيقة ومصدرية وسريعة. عندما تعتمد المهمة على معلومات حالية ويتوفر للنموذج استرجاع مباشر، كان لـ GPT-5.5.5 ميزة واضحة في هذا الإعداد.</p>
<h4 id="Qwen36-35B-A3B" class="common-anchor-header">Qwen3.6-35B-A3B</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_7_91686c177e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>أنتج Qwen3.6-35B-A3B نتيجة مشابهة لـ DeepSeek V4-Pro. لم يكن لديه وصول مباشر إلى الويب في هذا الإعداد، لذلك لم يتمكن من إكمال مهمة الاسترجاع في الوقت الفعلي.</p>
<h2 id="Which-Model-Is-Better-at-Debugging-Concurrency-Bugs" class="common-anchor-header">ما النموذج الأفضل في تصحيح أخطاء التزامن؟<button data-href="#Which-Model-Is-Better-at-Debugging-Concurrency-Bugs" class="anchor-icon" translate="no">
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
    </button></h2><p>استخدم الاختبار الثاني مثالاً للتحويل المصرفي من Python مع ثلاث طبقات من مشاكل التزامن. لم تكن المهمة هي العثور على حالة السباق الواضحة فحسب، بل كانت المهمة أيضًا شرح سبب تعطل الرصيد الكلي وتقديم كود مصحح.</p>
<table>
<thead>
<tr><th>الطبقة</th><th>المشكلة</th><th>ما الخطأ الذي يحدث</th></tr>
</thead>
<tbody>
<tr><td>الأساسي</td><td>حالة السباق</td><td><code translate="no">if self.balance &gt;= amount</code> و <code translate="no">self.balance -= amount</code> ليست ذرية. يمكن أن يجتاز خيطين التحقق من الرصيد في نفس الوقت، ثم يقوم كلاهما بطرح الأموال.</td></tr>
<tr><td>متوسط</td><td>خطر الوصول إلى طريق مسدود</td><td>يمكن أن يؤدي القفل الساذج لكل حساب إلى طريق مسدود عندما يقفل التحويل A →B القفل A أولاً بينما يقفل التحويل B →A القفل B أولاً. هذا هو القفل المسدود الكلاسيكي ABBA.</td></tr>
<tr><td>متقدم</td><td>نطاق قفل غير صحيح</td><td>الحماية فقط <code translate="no">self.balance</code> لا تحمي <code translate="no">target.balance</code>. يجب أن يكون الإصلاح الصحيح هو قفل كلا الحسابين بترتيب ثابت، عادةً حسب معرّف الحساب، أو استخدام قفل عام مع التزامن الأقل.</td></tr>
</tbody>
</table>
<p>المطالبة والرمز كما هو موضح أدناه:</p>
<pre><code translate="no" class="language-cpp">The following Python code simulates two bank accounts transferring
  money to each other. The total balance should always equal 2000,                                              
  but it often doesn&#x27;t after running.                                                                           
                                                                                                                
  Please:                                                                                                       
  1. Find ALL concurrency bugs in this code (not just the obvious one)                                          
  2. Explain why Total ≠ 2000 with a concrete thread execution example                                          
  3. Provide the corrected code                                                                                 
                                                                                                                
  import threading                                                                                              
                                                                  
  class BankAccount:
      def __init__(self, balance):
          self.balance = balance                                                                                
   
      def transfer(self, target, amount):                                                                       
          if self.balance &gt;= amount:                              
              self.balance -= amount
              target.balance += amount
              return True
          return False
                                                                                                                
  def stress_test():
      account_a = BankAccount(1000)                                                                             
      account_b = BankAccount(1000)                               

      def transfer_a_to_b():                                                                                    
          for _ in range(1000):
              account_a.transfer(account_b, 1)                                                                  
                                                                  
      def transfer_b_to_a():
          for _ in range(1000):
              account_b.transfer(account_a, 1)                                                                  
   
      threads = [threading.Thread(target=transfer_a_to_b) for _ in range(10)]                                   
      threads += [threading.Thread(target=transfer_b_to_a) for _ in range(10)]
                                                                                                                
      for t in threads: t.start()
      for t in threads: t.join()                                                                                
                                                                  
      print(f&quot;Total: {account_a.balance + account_b.balance}&quot;)                                                  
      print(f&quot;A: {account_a.balance}, B: {account_b.balance}&quot;)
                                                                                                                
  stress_test()
<button class="copy-code-btn"></button></code></pre>
<h3 id="Code-Debugging-Results-GPT-55-Gave-the-Most-Complete-Answer" class="common-anchor-header">نتائج تصحيح التعليمات البرمجية: أعطى GPT-5.5.5 الإجابة الأكثر اكتمالاً</h3><h4 id="DeepSeek-V4-Pro" class="common-anchor-header">DeepSeek V4-Pro</h4><p>قدم DeepSeek V4-Pro تحليلاً موجزًا وانتقل مباشرةً إلى حل القفل المرتب، وهي الطريقة القياسية لتجنب الجمود في ABBA. أظهرت إجابته الإصلاح الصحيح، لكنه لم يقضِ الكثير من الوقت في شرح السبب الذي يجعل الإصلاح الساذج القائم على القفل الساذج يقدم وضع فشل جديد.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_8_e2b4c41c46.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h4 id="GPT-55" class="common-anchor-header">GPT-5.5.5</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_9_d6b1e62c32.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>كان أداء GPT-5.5.5 الأفضل في هذا الاختبار. فقد وجد المشكلات الأساسية، وتوقع خطر الجمود، وشرح سبب فشل الكود الأصلي، وقدم تنفيذًا مصحححًا كاملًا.</p>
<h4 id="Qwen36-35B-A3B" class="common-anchor-header">Qwen3.6-35B-A3B</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_10_1177f51906.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>حدد Qwen3.6-35B-A3B الأخطاء بدقة، وكان تسلسل تنفيذ المثال الخاص به واضحًا. كان الجزء الأضعف هو الإصلاح: لقد اختار قفلًا عالميًا على مستوى الفئة، مما يجعل كل حساب يتشارك نفس القفل. ينجح ذلك في محاكاة صغيرة، لكنها مفاضلة ضعيفة بالنسبة لنظام مصرفي حقيقي لأن تحويلات الحسابات غير المرتبطة يجب أن تظل تنتظر على نفس القفل.</p>
<p><strong>باختصار:</strong> لم يحل GPT-5.5.5 الخطأ الحالي فحسب، بل حذر أيضًا من الخطأ التالي الذي قد يقدمه المطور. أعطى DeepSeek V4-Pro أنظف إصلاح غير GPT. وجد Qwen3.6 المشكلات وأنتج شيفرة تعمل، لكنه لم ينبه إلى الخلل في قابلية التوسع.</p>
<h2 id="Which-Model-Handles-Long-Context-Retrieval-Best" class="common-anchor-header">أي نموذج يتعامل مع استرجاع السياق الطويل بشكل أفضل؟<button data-href="#Which-Model-Handles-Long-Context-Retrieval-Best" class="anchor-icon" translate="no">
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
    </button></h2><p>بالنسبة لاختبار السياق الطويل، استخدمنا النص الكامل لكتاب <em>Dream of the Red Chamber،</em> حوالي 850,000 حرف صيني. أدخلنا علامة مخفية حول موضع 500,000 حرف:</p>
<p><code translate="no">【Milvus test verification code: ZK-7749-ALPHA】</code></p>
<p>ثم رفعنا الملف إلى كل نموذج وطلبنا منه العثور على محتوى العلامة وموضعها.</p>
<h3 id="Long-Context-Retrieval-Results-GPT-55-Found-the-Marker-Most-Precisely" class="common-anchor-header">نتائج استرجاع السياق الطويل: عثر GPT-5.5.5 على العلامة بدقة أكبر</h3><h4 id="DeepSeek-V4-Pro" class="common-anchor-header">DeepSeek V4-Pro</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_11_1f1ee0ec72.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>عثر DeepSeek V4-Pro على العلامة المخفية، لكنه لم يعثر على موضع الحرف الصحيح. كما أنه أعطى السياق المحيط الخاطئ. في هذا الاختبار، بدا أنه حدد موقع العلامة بشكل دلالي ولكنه فقد تحديد الموضع الدقيق أثناء التفكير في المستند.</p>
<h4 id="GPT-55" class="common-anchor-header">GPT-5.5.5</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_12_5b09068036.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>وجد GPT-5.5.5 محتوى العلامة والموضع والسياق المحيط بشكل صحيح. فقد أبلغ عن الموضع على أنه 500,002 وحتى أنه ميّز بين العدّ ذي الفهرس الصفري والعدّ ذي الفهرس الواحد. طابق السياق المحيط أيضًا النص المستخدم عند إدراج العلامة.</p>
<h4 id="Qwen36-35B-A3B" class="common-anchor-header">Qwen3.6-35B-A3B</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_13_ca4223c01d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>وجد Qwen3.6.6-35B-A3B محتوى العلامة والسياق القريب بشكل صحيح، لكن تقدير موقعه كان خاطئًا.</p>
<h2 id="What-Do-These-Tests-Say-About-Model-Selection" class="common-anchor-header">ماذا تقول هذه الاختبارات عن اختيار النموذج؟<button data-href="#What-Do-These-Tests-Say-About-Model-Selection" class="anchor-icon" translate="no">
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
    </button></h2><p>تشير الاختبارات الثلاثة إلى نمط اختيار عملي: <strong>GPT-5.5.5 هو اختيار القدرة، و DeepSeek V4-Pro هو اختيار أداء تكلفة السياق الطويل، و Qwen3.6-35B-A3B هو اختيار التحكم المحلي.</strong></p>
<table>
<thead>
<tr><th>الطراز</th><th>أفضل ملاءمة</th><th>ما حدث في اختباراتنا</th><th>التحذير الرئيسي</th></tr>
</thead>
<tbody>
<tr><td>GPT-5.5.5</td><td>أفضل قدرة إجمالية</td><td>فازت في اختبارات الاسترجاع المباشر، وتصحيح أخطاء التزامن، واختبارات علامات السياق الطويل</td><td>تكلفة أعلى؛ الأقوى عندما تبرر الدقة واستخدام الأداة العلاوة</td></tr>
<tr><td>DeepSeek V4-Pro</td><td>سياق طويل، ونشر أقل تكلفة</td><td>أعطت أقوى إصلاح غير GPT لخلل التزامن وعثرت على محتوى العلامة</td><td>يحتاج إلى أدوات استرجاع خارجية لمهام الويب المباشرة؛ كان تتبع الموقع الدقيق للأحرف أضعف في هذا الاختبار</td></tr>
<tr><td>Qwen3.6-35B-A3B</td><td>النشر المحلي، والأوزان المفتوحة، والمدخلات متعددة الوسائط، وأعباء العمل باللغة الصينية</td><td>كان أداؤه جيدًا في تحديد الأخطاء وفهم السياق الطويل</td><td>كانت جودة الإصلاح أقل قابلية للتطوير؛ لم يكن الوصول المباشر إلى الويب متاحًا في هذا الإعداد</td></tr>
</tbody>
</table>
<p>استخدم GPT-5.5.5 عندما تحتاج إلى أقوى النتائج، وتكون التكلفة ثانوية. استخدم DeepSeek V4-Pro عندما تحتاج إلى سياق طويل، وتكلفة خدمة أقل، ونشر سهل الاستخدام لواجهة برمجة التطبيقات. استخدم Qwen3.6-35B-35B-A3B عندما تكون الأوزان المفتوحة أو النشر الخاص أو الدعم متعدد الوسائط أو التحكم في كومة الخدمة أكثر أهمية.</p>
<p>ومع ذلك، بالنسبة للتطبيقات ذات الاسترجاع الثقيل، فإن اختيار النموذج هو نصف القصة فقط. فحتى النموذج القوي ذو السياق الطويل يحقق أداءً أفضل عندما يتم استرجاع السياق وتصفيته وتأسيسه بواسطة <a href="https://zilliz.com/learn/generative-ai">نظام بحث دلالي</a> مخصص.</p>
<h2 id="Why-RAG-Still-Matters-for-Long-Context-Models" class="common-anchor-header">لماذا لا يزال RAG مهمًا لنماذج السياق الطويل<button data-href="#Why-RAG-Still-Matters-for-Long-Context-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>لا تلغي نافذة السياق الطويل الحاجة إلى الاسترجاع. بل تغير استراتيجية الاسترجاع.</p>
<p>في تطبيق RAG، يجب ألا يفحص النموذج كل مستند في كل طلب. تخزن <a href="https://zilliz.com/learn/introduction-to-unstructured-data">بنية قاعدة البيانات المتجهة</a> التضمينات، وتبحث عن الأجزاء ذات الصلة من الناحية الدلالية، وتطبق مرشحات البيانات الوصفية وتعيد مجموعة سياق مضغوطة إلى النموذج. وهذا يعطي النموذج مدخلات أفضل مع تقليل التكلفة والكمون.</p>
<p>يناسب Milvus هذا الدور لأنه يتعامل مع <a href="https://milvus.io/docs/schema.md">مخططات المجموعة،</a> وفهرسة المتجهات، والبيانات الوصفية القياسية، وعمليات الاسترجاع في نظام واحد. ويمكنك البدء محليًا باستخدام <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite،</a> والانتقال إلى <a href="https://milvus.io/docs/quickstart.md">بدء تشغيل Milvus السريع</a> المستقل، والنشر باستخدام <a href="https://milvus.io/docs/install_standalone-docker.md">تثبيت Docker</a> أو <a href="https://milvus.io/docs/install_standalone-docker-compose.md">نشر Docker Compose،</a> والتوسع أكثر مع <a href="https://milvus.io/docs/install_cluster-milvusoperator.md">نشر Kubernetes</a> عندما ينمو عبء العمل.</p>
<h2 id="How-to-Build-a-RAG-Pipeline-with-Milvus-and-DeepSeek-V4" class="common-anchor-header">كيفية إنشاء خط أنابيب RAG باستخدام Milvus وDeepSeek V4<button data-href="#How-to-Build-a-RAG-Pipeline-with-Milvus-and-DeepSeek-V4" class="anchor-icon" translate="no">
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
    </button></h2><p>تقوم الإرشادات التفصيلية التالية ببناء خط أنابيب RAG صغير باستخدام DeepSeek V4-Pro للتوليد و Milvus للاسترجاع. تنطبق نفس البنية على نماذج LLMs الأخرى: إنشاء التضمينات، وتخزينها في مجموعة، والبحث عن السياق ذي الصلة، وتمرير هذا السياق إلى النموذج.</p>
<p>للحصول على شرح أوسع، راجع <a href="https://milvus.io/docs/build-rag-with-milvus.md">البرنامج التعليمي</a> الرسمي لـ <a href="https://milvus.io/docs/build-rag-with-milvus.md">Milvus RAG</a>. يُبقي هذا المثال خط الأنابيب صغيرًا حتى يسهل فحص تدفق الاسترجاع.</p>
<h2 id="Prepare-the-Environment" class="common-anchor-header">إعداد البيئة<button data-href="#Prepare-the-Environment" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Install-the-Dependencies" class="common-anchor-header">تثبيت التبعيات</h3><pre><code translate="no" class="language-python">! pip install --upgrade <span class="hljs-string">&quot;pymilvus[model]&quot;</span> openai requests tqdm
<button class="copy-code-btn"></button></code></pre>
<p>إذا كنت تستخدم Google Colab، فقد تحتاج إلى إعادة تشغيل وقت التشغيل بعد تثبيت التبعيات. انقر على قائمة <strong>وقت</strong> التشغيل، ثم حدد <strong>إعادة تشغيل الجلسة</strong>.</p>
<p>يدعم DeepSeek V4-Pro واجهة برمجة تطبيقات على غرار OpenAI. قم بتسجيل الدخول إلى موقع DeepSeek الرسمي وقم بتعيين <code translate="no">DEEPSEEK_API_KEY</code> كمتغير بيئة.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os

os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;DEEPSEEK_API_KEY&quot;</span>] = <span class="hljs-string">&quot;sk-*****************&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Prepare-the-Milvus-Documentation-Dataset" class="common-anchor-header">إعداد مجموعة بيانات وثائق Milvus Documentation Dataset</h3><p>نحن نستخدم صفحات الأسئلة الشائعة من <a href="https://github.com/milvus-io/milvus-docs/releases/download/v2.4.6-preview/milvus_docs_2.4.x_en.zip">أرشيف وثائق Milvus 2.4.x</a> كمصدر معرفي خاص. هذه مجموعة بيانات مبدئية بسيطة لعرض تجريبي صغير لـ RAG.</p>
<p>أولاً، قم بتنزيل ملف ZIP واستخرج الوثائق في المجلد <code translate="no">milvus_docs</code>.</p>
<pre><code translate="no" class="language-python">! wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
! unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs
<button class="copy-code-btn"></button></code></pre>
<p>نقوم بتحميل جميع ملفات Markdown من المجلد <code translate="no">milvus_docs/en/faq</code>. بالنسبة لكل مستند، نقوم بتقسيم محتوى الملف حسب <code translate="no">#</code> ، والذي يفصل تقريبًا بين أقسام Markdown الرئيسية.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob

text_lines = []

<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()

    text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Set-Up-DeepSeek-V4-and-the-Embedding-Model" class="common-anchor-header">إعداد DeepSeek V4 ونموذج التضمين</h3><pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAI</span>

deepseek_client = <span class="hljs-title class_">OpenAI</span>(
    api_key=os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;DEEPSEEK_API_KEY&quot;</span>],
    base_url=<span class="hljs-string">&quot;https://api.deepseek.com&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>بعد ذلك، اختر نموذج التضمين. يستخدم هذا المثال <code translate="no">DefaultEmbeddingFunction</code> من الوحدة النمطية لنموذج PyMilvus. راجع مستندات Milvus لمعرفة المزيد عن <a href="https://milvus.io/docs/embeddings.md">دوال التضمين</a>.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model <span class="hljs-keyword">as</span> milvus_model

embedding_model = milvus_model.<span class="hljs-title class_">DefaultEmbeddingFunction</span>()
<button class="copy-code-btn"></button></code></pre>
<p>أنشئ متجه اختبار، ثم اطبع بُعد المتجه والعناصر القليلة الأولى. يُستخدم البعد الذي تم إرجاعه عند إنشاء مجموعة ميلفوس.</p>
<pre><code translate="no">test_embedding = embedding_model.encode_queries([<span class="hljs-string">&quot;This is a test&quot;</span>])[<span class="hljs-number">0</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embedding)
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embedding[:<span class="hljs-number">10</span>])
<span class="hljs-number">768</span>
[-<span class="hljs-number">0.04836066</span>  <span class="hljs-number">0.07163023</span> -<span class="hljs-number">0.01130064</span> -<span class="hljs-number">0.03789345</span> -<span class="hljs-number">0.03320649</span> -<span class="hljs-number">0.01318448</span>
 -<span class="hljs-number">0.03041712</span> -<span class="hljs-number">0.02269499</span> -<span class="hljs-number">0.02317863</span> -<span class="hljs-number">0.00426028</span>]
<button class="copy-code-btn"></button></code></pre>
<h2 id="Load-Data-into-Milvus" class="common-anchor-header">تحميل البيانات إلى ملفوس<button data-href="#Load-Data-into-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Create-a-Milvus-Collection" class="common-anchor-header">إنشاء مجموعة ميلفوس</h3><p>تخزن مجموعة Milvus الحقول المتجهة والحقول القياسية والبيانات الوصفية الديناميكية الاختيارية. ويستخدم الإعداد السريع أدناه واجهة برمجة التطبيقات <code translate="no">MilvusClient</code> عالية المستوى؛ بالنسبة لمخططات الإنتاج، راجع المستندات الخاصة <a href="https://milvus.io/docs/manage-collections.md">بإدارة المجموعات</a> <a href="https://milvus.io/docs/create-collection.md">وإنشاء المجموعات</a>.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>

milvus_client = <span class="hljs-title class_">MilvusClient</span>(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)

collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>بعض الملاحظات حول <code translate="no">MilvusClient</code>:</p>
<ul>
<li>يعد الإعداد <code translate="no">uri</code> إلى ملف محلي، مثل <code translate="no">./milvus.db</code> ، هو الخيار الأسهل لأنه يستخدم تلقائيًا <a href="https://milvus.io/docs/milvus_lite.md">ملف Milvus Lite</a> ويخزن جميع البيانات في هذا الملف.</li>
<li>إذا كانت لديك مجموعة بيانات كبيرة، يمكنك إعداد خادم Milvus عالي الأداء على <a href="https://milvus.io/docs/quickstart.md">Docker أو Kubernetes</a>. في هذا الإعداد، استخدم URI الخادم URI، مثل <code translate="no">http://localhost:19530</code> ، كـ <code translate="no">uri</code>.</li>
<li>إذا كنت ترغب في استخدام <a href="https://docs.zilliz.com/">Zilliz Cloud،</a> الخدمة السحابية المدارة بالكامل لـ Milvus، قم بتعيين <code translate="no">uri</code> و <code translate="no">token</code> إلى <a href="https://docs.zilliz.com/docs/connect-to-cluster">نقطة النهاية العامة ومفتاح واجهة برمجة التطبيقات</a> من Zilliz Cloud.</li>
</ul>
<p>تحقق مما إذا كانت المجموعة موجودة بالفعل. إذا كانت موجودة، فاحذفها.</p>
<pre><code translate="no" class="language-python">if milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)
<button class="copy-code-btn"></button></code></pre>
<p>قم بإنشاء مجموعة جديدة بالمعلمات المحددة. إذا لم نحدد معلومات الحقل، يقوم ميلفوس تلقائيًا بإنشاء حقل افتراضي <code translate="no">id</code> كمفتاح أساسي وحقل متجه لتخزين البيانات المتجهة. يخزن حقل JSON المحجوز بيانات قياسية غير محددة في المخطط.</p>
<pre><code translate="no" class="language-python">milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;IP&quot;</span>,  <span class="hljs-comment"># Inner product distance</span>
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,  <span class="hljs-comment"># Strong consistency level</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>يعني مقياس <code translate="no">IP</code> تشابه المنتج الداخلي. يدعم Milvus أيضًا أنواع المقاييس الأخرى وخيارات الفهرس اعتمادًا على نوع المتجه وعبء العمل؛ راجع الأدلة الخاصة <a href="https://milvus.io/docs/id/metric.md">بأنواع المقاييس</a> <a href="https://milvus.io/docs/index_selection.md">واختيار الفهرس</a>. الإعداد <code translate="no">Strong</code> هو أحد <a href="https://milvus.io/docs/consistency.md">مستويات الاتساق</a> المتاحة.</p>
<h3 id="Insert-the-Embedded-Documents" class="common-anchor-header">إدراج المستندات المضمنة</h3><p>قم بتكرار البيانات النصية وإنشاء التضمينات وإدراج البيانات في ملفوس. هنا، نقوم بإضافة حقل جديد باسم <code translate="no">text</code>. نظرًا لعدم تعريفه بشكل صريح في مخطط المجموعة، تتم إضافته تلقائيًا إلى حقل JSON الديناميكي المحجوز. بالنسبة للبيانات الوصفية للإنتاج، راجع <a href="https://milvus.io/docs/enable-dynamic-field.md">دعم الحقل الديناميكي</a> <a href="https://milvus.io/docs/json-field-overview.md">والنظرة العامة لحقل JSON</a>.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm

data = []

doc_embeddings = embedding_model.encode_documents(text_lines)

<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})

milvus_client.insert(collection_name=collection_name, data=data)
Creating embeddings: <span class="hljs-number">100</span>%|█████████████████████████████████████████████████████████████████████████████████████████████████████████████████| <span class="hljs-number">72</span>/<span class="hljs-number">72</span> [<span class="hljs-number">00</span>:<span class="hljs-number">00</span>&lt;<span class="hljs-number">00</span>:<span class="hljs-number">00</span>, <span class="hljs-number">1222631.13</span>it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: <span class="hljs-number">72</span>, <span class="hljs-string">&#x27;ids&#x27;</span>: [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">3</span>, <span class="hljs-number">4</span>, <span class="hljs-number">5</span>, <span class="hljs-number">6</span>, <span class="hljs-number">7</span>, <span class="hljs-number">8</span>, <span class="hljs-number">9</span>, <span class="hljs-number">10</span>, <span class="hljs-number">11</span>, <span class="hljs-number">12</span>, <span class="hljs-number">13</span>, <span class="hljs-number">14</span>, <span class="hljs-number">15</span>, <span class="hljs-number">16</span>, <span class="hljs-number">17</span>, <span class="hljs-number">18</span>, <span class="hljs-number">19</span>, <span class="hljs-number">20</span>, <span class="hljs-number">21</span>, <span class="hljs-number">22</span>, <span class="hljs-number">23</span>, <span class="hljs-number">24</span>, <span class="hljs-number">25</span>, <span class="hljs-number">26</span>, <span class="hljs-number">27</span>, <span class="hljs-number">28</span>, <span class="hljs-number">29</span>, <span class="hljs-number">30</span>, <span class="hljs-number">31</span>, <span class="hljs-number">32</span>, <span class="hljs-number">33</span>, <span class="hljs-number">34</span>, <span class="hljs-number">35</span>, <span class="hljs-number">36</span>, <span class="hljs-number">37</span>, <span class="hljs-number">38</span>, <span class="hljs-number">39</span>, <span class="hljs-number">40</span>, <span class="hljs-number">41</span>, <span class="hljs-number">42</span>, <span class="hljs-number">43</span>, <span class="hljs-number">44</span>, <span class="hljs-number">45</span>, <span class="hljs-number">46</span>, <span class="hljs-number">47</span>, <span class="hljs-number">48</span>, <span class="hljs-number">49</span>, <span class="hljs-number">50</span>, <span class="hljs-number">51</span>, <span class="hljs-number">52</span>, <span class="hljs-number">53</span>, <span class="hljs-number">54</span>, <span class="hljs-number">55</span>, <span class="hljs-number">56</span>, <span class="hljs-number">57</span>, <span class="hljs-number">58</span>, <span class="hljs-number">59</span>, <span class="hljs-number">60</span>, <span class="hljs-number">61</span>, <span class="hljs-number">62</span>, <span class="hljs-number">63</span>, <span class="hljs-number">64</span>, <span class="hljs-number">65</span>, <span class="hljs-number">66</span>, <span class="hljs-number">67</span>, <span class="hljs-number">68</span>, <span class="hljs-number">69</span>, <span class="hljs-number">70</span>, <span class="hljs-number">71</span>], <span class="hljs-string">&#x27;cost&#x27;</span>: <span class="hljs-number">0</span>}
<button class="copy-code-btn"></button></code></pre>
<p>بالنسبة لمجموعات البيانات الأكبر حجمًا، يمكن توسيع نفس النمط مع تصميم مخطط صريح، <a href="https://milvus.io/docs/index-vector-fields.md">وفهارس الحقول المتجهة،</a> والفهارس القياسية، وعمليات دورة حياة البيانات مثل <a href="https://milvus.io/docs/insert-update-delete.md">الإدراج، والإدراج، والحذف</a>.</p>
<h2 id="Build-the-RAG-Retrieval-Flow" class="common-anchor-header">بناء تدفق استرجاع RAG<button data-href="#Build-the-RAG-Retrieval-Flow" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Search-Milvus-for-Relevant-Context" class="common-anchor-header">البحث في ميلفوس عن السياق ذي الصلة</h3><p>دعنا نحدد سؤالاً شائعًا عن ميلفوس.</p>
<pre><code translate="no" class="language-python">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>ابحث في المجموعة عن السؤال واسترجع أهم ثلاث مطابقات دلالية. هذا هو <a href="https://milvus.io/docs/single-vector-search.md">البحث</a> الأساسي <a href="https://milvus.io/docs/single-vector-search.md">أحادي المتجه</a> الأساسي. في الإنتاج، يمكنك دمجه مع <a href="https://milvus.io/docs/filtered-search.md">البحث المصفى،</a> <a href="https://milvus.io/docs/full-text-search.md">والبحث بالنص الكامل،</a> <a href="https://milvus.io/docs/multi-vector-search.md">والبحث الهجين متعدد النوا</a>قل، <a href="https://milvus.io/docs/reranking.md">واستراتيجيات إعادة الترتيب</a> لتحسين الملاءمة.</p>
<pre><code translate="no" class="language-python">search_res = milvus_client.search(
    collection_name=collection_name,
    data=embedding_model.encode_queries(
        [question]
    ),  <span class="hljs-comment"># Convert the question to an embedding vector</span>
    limit=<span class="hljs-number">3</span>,  <span class="hljs-comment"># Return top 3 results</span>
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},  <span class="hljs-comment"># Inner product distance</span>
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],  <span class="hljs-comment"># Return the text field</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>الآن دعنا نلقي نظرة على نتائج البحث للاستعلام.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json

retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))

[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including [MinIO](https://min.io/), [AWS S3](https://aws.amazon.com/s3/?nc1=h_ls), [Google Cloud Storage](https://cloud.google.com/storage?hl=en#object-storage-for-companies-of-all-sizes) (GCS), [Azure Blob Storage](https://azure.microsoft.com/en-us/products/storage/blobs), [Alibaba Cloud OSS](https://www.alibabacloud.com/product/object-storage-service), and [Tencent Cloud Object Storage](https://www.tencentcloud.com/products/cos) (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        <span class="hljs-number">0.6572665572166443</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus flush data?\n\nMilvus returns success when inserted data are loaded to the message queue. However, the data are not yet flushed to the disk. Then Milvus&#x27; data node writes the data in the message queue to persistent storage as incremental logs. If `flush()` is called, the data node is forced to write all data in the message queue to persistent storage immediately.\n\n###&quot;</span>,
        <span class="hljs-number">0.6312146186828613</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus handle vector data types and precision?\n\nMilvus supports Binary, Float32, Float16, and BFloat16 vector types.\n\n- Binary vectors: Store binary data as sequences of 0s and 1s, used in image processing and information retrieval.\n- Float32 vectors: Default storage with a precision of about 7 decimal digits. Even Float64 values are stored with Float32 precision, leading to potential precision loss upon retrieval.\n- Float16 and BFloat16 vectors: Offer reduced precision and memory usage. Float16 is suitable for applications with limited bandwidth and storage, while BFloat16 balances range and efficiency, commonly used in deep learning to reduce computational requirements without significantly impacting accuracy.\n\n###&quot;</span>,
        <span class="hljs-number">0.6115777492523193</span>
    ]
]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Generate-a-RAG-Answer-with-DeepSeek-V4" class="common-anchor-header">إنشاء إجابة RAG باستخدام DeepSeek V4</h3><p>تحويل المستندات المسترجعة إلى تنسيق سلسلة.</p>
<pre><code translate="no" class="language-python">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>تحديد مطالبات النظام والمستخدم لـ LLM. يتم تجميع هذه المطالبة من المستندات التي تم استرجاعها من ميلفوس.</p>
<pre><code translate="no" class="language-python">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
Human: You are an AI assistant. You are able to find answers to the questions from the contextual passage snippets provided.
&quot;&quot;&quot;</span>
USER_PROMPT = <span class="hljs-string">f&quot;&quot;&quot;
Use the following pieces of information enclosed in &lt;context&gt; tags to provide an answer to the question enclosed in &lt;question&gt; tags.
&lt;context&gt;
<span class="hljs-subst">{context}</span>
&lt;/context&gt;
&lt;question&gt;
<span class="hljs-subst">{question}</span>
&lt;/question&gt;
&quot;&quot;&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>استخدم النموذج المقدم من DeepSeek V4-Pro لإنشاء استجابة بناءً على المطالبة.</p>
<pre><code translate="no">response = deepseek_client.chat.completions.create(
    model=<span class="hljs-string">&quot;deepseek-v4-pro&quot;</span>,
    messages=[
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT},
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT},
    ],
)
print(response.choices[<span class="hljs-number">0</span>].message.content)
Milvus stores data <span class="hljs-keyword">in</span> two distinct ways depending <span class="hljs-keyword">on</span> the type:
- **Inserted data** (vector data, scalar data, <span class="hljs-keyword">and</span> collection-specific schema) are stored <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> incremental logs. Milvus supports multiple <span class="hljs-built_in">object</span> storage backends, such <span class="hljs-keyword">as</span> MinIO, AWS S3, Google Cloud Storage, Azure Blob Storage, Alibaba Cloud OSS, <span class="hljs-keyword">and</span> Tencent Cloud Object Storage. Before reaching persistent storage, the data <span class="hljs-keyword">is</span> initially loaded <span class="hljs-keyword">into</span> a message queue; a data node then writes it to disk, <span class="hljs-keyword">and</span> calling `flush()` forces an immediate write.
- **Metadata**, generated <span class="hljs-keyword">by</span> each Milvus module, <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> **etcd**.
<button class="copy-code-btn"></button></code></pre>
<p>عند هذه النقطة، يكون خط الأنابيب قد أكمل حلقة RAG الأساسية: تضمين المستندات، وتخزين المتجهات في Milvus، والبحث عن السياق ذي الصلة، وإنشاء إجابة باستخدام DeepSeek V4-Pro.</p>
<h2 id="What-Should-You-Improve-Before-Production" class="common-anchor-header">ما الذي يجب تحسينه قبل الإنتاج؟<button data-href="#What-Should-You-Improve-Before-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>يستخدم العرض التوضيحي تقسيمًا بسيطًا للأقسام واسترجاع أعلى k. هذا يكفي لإظهار الآليات، ولكن عادةً ما يحتاج RAG للإنتاج إلى مزيد من التحكم في الاسترجاع.</p>
<table>
<thead>
<tr><th>يحتاج الإنتاج</th><th>ميزة ميلفوس للنظر فيها</th><th>لماذا يساعد</th></tr>
</thead>
<tbody>
<tr><td>مزج الإشارات الدلالية والكلمات المفتاحية</td><td><a href="https://milvus.io/docs/hybrid_search_with_milvus.md">البحث الهجين مع ميلفوس</a></td><td>الجمع بين البحث المتجه الكثيف مع إشارات متناثرة أو إشارات النص الكامل</td></tr>
<tr><td>دمج النتائج من مسترجعات متعددة</td><td><a href="https://milvus.io/docs/milvus_hybrid_search_retriever.md">مسترجع البحث الهجين Milvus</a></td><td>يتيح لمهام سير عمل LangChain استخدام تصنيفات مرجحة أو على غرار RRF</td></tr>
<tr><td>تقييد النتائج حسب المستأجر أو الطابع الزمني أو نوع المستند</td><td>مرشحات البيانات الوصفية والقياسية</td><td>يبقي الاسترجاع في نطاق شريحة البيانات الصحيحة</td></tr>
<tr><td>الانتقال من خدمة Milvus المُدارة ذاتيًا إلى الخدمة المُدارة</td><td><a href="https://docs.zilliz.com/docs/migrate-from-milvus">الترحيل من ميلفوس إلى زيليز</a></td><td>يقلل من أعمال البنية التحتية مع الحفاظ على توافق Milvus</td></tr>
<tr><td>ربط التطبيقات المستضافة بأمان</td><td><a href="https://docs.zilliz.com/docs/manage-api-keys">مفاتيح Zilliz Cloud API</a></td><td>توفير التحكم في الوصول المستند إلى الرمز المميز لعملاء التطبيقات</td></tr>
</tbody>
</table>
<p>أهم عادة إنتاجية هي تقييم الاسترجاع بشكل منفصل عن التوليد. إذا كان السياق المسترجع ضعيفًا، فغالبًا ما يخفي تبديل LLM المشكلة بدلاً من حلها.</p>
<h2 id="Get-Started-with-Milvus-and-DeepSeek-RAG" class="common-anchor-header">ابدأ مع ميلفوس و DeepSeek RAG<button data-href="#Get-Started-with-Milvus-and-DeepSeek-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>إذا كنت ترغب في إعادة إنتاج البرنامج التعليمي، ابدأ <a href="https://milvus.io/docs">بوثائق Milvus</a> الرسمية <a href="https://milvus.io/docs/build-rag-with-milvus.md">ودليل بناء RAG مع Milvus</a>. للحصول على إعداد مُدار، <a href="https://docs.zilliz.com/docs/connect-to-cluster">اتصل بـ Zilliz Cloud</a> باستخدام نقطة نهاية المجموعة ومفتاح واجهة برمجة التطبيقات بدلاً من تشغيل Milvus محليًا.</p>
<p>إذا كنت تريد المساعدة في ضبط التقطيع أو الفهرسة أو الفلترة أو الاسترجاع المختلط، انضم إلى <a href="https://slack.milvus.io/">مجتمع Milvus Slack</a> أو احجز <a href="https://milvus.io/office-hours">جلسة</a> مجانية في <a href="https://milvus.io/office-hours">ساعات عمل Milvus المكتبية</a>. إذا كنت تفضل تخطي إعداد البنية التحتية، فاستخدم <a href="https://cloud.zilliz.com/login">تسجيل الدخول إلى Zilliz Cloud</a> أو أنشئ <a href="https://cloud.zilliz.com/signup">حساب Zilliz Cloud</a> لتشغيل Milvus المُدار.</p>
<h2 id="Questions-Developers-Ask-About-DeepSeek-V4-Milvus-and-RAG" class="common-anchor-header">الأسئلة التي يطرحها المطورون حول DeepSeek V4 وMilvus وRAG<button data-href="#Questions-Developers-Ask-About-DeepSeek-V4-Milvus-and-RAG" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Is-DeepSeek-V4-good-for-RAG" class="common-anchor-header">هل DeepSeek V4 جيد لـ RAG؟</h3><p>يعد DeepSeek V4-Pro مناسبًا جدًا لـ RAG عندما تحتاج إلى معالجة السياق الطويل وتكلفة خدمة أقل من النماذج المغلقة المتميزة. ما زلت بحاجة إلى طبقة استرجاع مثل Milvus لتحديد الأجزاء ذات الصلة، وتطبيق مرشحات البيانات الوصفية والحفاظ على تركيز المطالبة.</p>
<h3 id="Should-I-use-GPT-55-or-DeepSeek-V4-for-a-RAG-pipeline" class="common-anchor-header">هل يجب أن أستخدم GPT-5.5.5 أو DeepSeek V4 لخط أنابيب RAG؟</h3><p>استخدم GPT-5.5.5 عندما تكون جودة الإجابة، واستخدام الأداة، والبحث المباشر أكثر أهمية من التكلفة. استخدم DeepSeek V4-Pro عندما تكون معالجة السياق الطويل والتحكم في التكلفة أكثر أهمية، خاصةً إذا كانت طبقة الاسترجاع لديك توفر بالفعل سياقًا أساسيًا عالي الجودة.</p>
<h3 id="Can-I-run-Qwen36-35B-A3B-locally-for-private-RAG" class="common-anchor-header">هل يمكنني تشغيل Qwen3.6-35B-A3B محليًا لـ RAG الخاص؟</h3><p>نعم، Qwen3.6.6-35B-A3B مفتوح الوزن ومصمم للنشر الأكثر قابلية للتحكم. إنه مرشح جيد عندما تكون الخصوصية أو الخدمة المحلية أو المدخلات متعددة الوسائط أو الأداء باللغة الصينية مهمة، لكنك لا تزال بحاجة إلى التحقق من زمن الاستجابة والذاكرة وجودة الاسترجاع لجهازك.</p>
<h3 id="Do-long-context-models-make-vector-databases-unnecessary" class="common-anchor-header">هل تجعل نماذج السياق الطويل قواعد البيانات المتجهة غير ضرورية؟</h3><p>لا، يمكن للنماذج ذات السياق الطويل قراءة المزيد من النصوص، لكنها لا تزال تستفيد من الاسترجاع. تعمل قاعدة البيانات المتجهة على تضييق المدخلات إلى الأجزاء ذات الصلة، وتدعم تصفية البيانات الوصفية وتقلل من تكلفة الرمز المميز، وتسهل تحديث التطبيق مع تغير المستندات.</p>
