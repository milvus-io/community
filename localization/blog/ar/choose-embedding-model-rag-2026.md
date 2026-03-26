---
id: choose-embedding-model-rag-2026.md
title: 'كيف تختار أفضل نموذج تضمين لـ RAG في عام 2026: 10 نماذج تم قياسها'
author: Cheney Zhang
date: 2026-3-26
cover: assets.zilliz.com/embedding_model_cover_ab72ccd651.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, Gemini Embedding 2, Embedding Model, RAG'
meta_keywords: >-
  best embedding model for RAG, embedding model comparison, multimodal embedding
  benchmark, MRL dimension compression, Gemini Embedding 2
meta_title: |
  Best Embedding Model for RAG 2026: 10 Models Compared
desc: >-
  لقد قمنا بقياس 10 نماذج تضمين قياسية على مهام ضغط الوسائط المتعددة واللغات
  والمستندات الطويلة والأبعاد. انظر أي منها يناسب خط أنابيب RAG الخاص بك.
origin: 'https://milvus.io/blog/choose-embedding-model-rag-2026.md'
---
<p><strong>خلاصة القول:</strong> اختبرنا 10 <a href="https://zilliz.com/ai-models">نماذج تضمين</a> عبر أربعة سيناريوهات إنتاجية تفتقدها المعايير العامة: الاسترجاع عبر الوسائط، والاسترجاع عبر اللغات، واسترجاع المعلومات الرئيسية، وضغط الأبعاد. لا يوجد نموذج واحد يفوز بكل شيء. Gemini Embedding 2 هو الأفضل في كل شيء. تتفوق Qwen3-VL-2B مفتوحة المصدر على واجهات برمجة التطبيقات المغلقة المصدر في المهام متعددة النماذج. إذا كنت بحاجة إلى ضغط الأبعاد لحفظ التخزين، فاستخدم Voyage Multimodal 3.5 أو Jina Embedddings v4.</p>
<h2 id="Why-MTEB-Isnt-Enough-for-Choosing-an-Embedding-Model" class="common-anchor-header">لماذا لا يكفي MTEB لاختيار نموذج التضمين<button data-href="#Why-MTEB-Isnt-Enough-for-Choosing-an-Embedding-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>تبدأ معظم النماذج الأولية لـ <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> بنموذج التضمين النصي OpenAI- تضمين النص 3-صغير. إنه رخيص وسهل الدمج، ويعمل بشكل جيد بما فيه الكفاية لاسترجاع النصوص الإنجليزية. لكن إنتاج RAG يتجاوزه بسرعة. يلتقط خط الإنتاج الخاص بك صوراً، وملفات PDF، ومستندات متعددة اللغات - ويتوقف <a href="https://zilliz.com/ai-models">نموذج التضمين</a> النصي فقط عن كونه كافياً.</p>
<p>تخبرك <a href="https://huggingface.co/spaces/mteb/leaderboard">لوحة المتصدرين في MTEB</a> بوجود خيارات أفضل. المشكلة؟ يختبر MTEB استرجاع النصوص بلغة واحدة فقط. فهو لا يغطي الاسترجاع متعدد الوسائط (الاستعلامات النصية مقابل مجموعات الصور)، أو البحث متعدد اللغات (استعلام صيني يعثر على مستند إنجليزي)، أو دقة المستندات الطويلة، أو مقدار الجودة التي تفقدها عند اقتطاع <a href="https://zilliz.com/glossary/dimension">أبعاد التضمين</a> لحفظ التخزين في <a href="https://zilliz.com/learn/what-is-a-vector-database">قاعدة بياناتك المتجهة</a>.</p>
<p>إذن ما هو نموذج التضمين الذي يجب أن تستخدمه؟ يعتمد ذلك على أنواع بياناتك ولغاتك وأطوال مستنداتك وما إذا كنت بحاجة إلى ضغط الأبعاد. لقد أنشأنا معيارًا يسمى <strong>CCKM</strong> واختبرنا 10 نماذج تم إصدارها بين عامي 2025 و2026 عبر تلك الأبعاد بالضبط.</p>
<h2 id="What-Is-the-CCKM-Benchmark" class="common-anchor-header">ما هو معيار CCKM؟<button data-href="#What-Is-the-CCKM-Benchmark" class="anchor-icon" translate="no">
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
    </button></h2><p>يختبر معيار<strong>CCKM (CCKM</strong> ) أربعة إمكانيات تفتقدها المعايير القياسية:</p>
<table>
<thead>
<tr><th>البُعد</th><th>ماذا يختبر</th><th>لماذا هو مهم</th></tr>
</thead>
<tbody>
<tr><td><strong>الاسترجاع متعدد الوسائط</strong></td><td>مطابقة أوصاف النص مع الصورة الصحيحة عند وجود مشتتات شبه متطابقة</td><td>تحتاج خطوط أنابيب<a href="https://zilliz.com/learn/multimodal-rag">الاسترجاع متعدد الوسائط</a> إلى تضمين النص والصورة في نفس المساحة المتجهة</td></tr>
<tr><td><strong>الاسترجاع عبر اللغات</strong></td><td>العثور على المستند الإنجليزي الصحيح من استعلام صيني، والعكس بالعكس</td><td>غالبًا ما تكون قواعد معارف الإنتاج متعددة اللغات</td></tr>
<tr><td><strong>استرجاع المعلومات الأساسية</strong></td><td>تحديد موقع حقيقة معينة مدفونة في مستند مكون من 4 آلاف إلى 32 ألف حرف (إبرة في كومة قش)</td><td>تعالج أنظمة RAG في كثير من الأحيان مستندات طويلة مثل العقود والأوراق البحثية</td></tr>
<tr><td><strong>ضغط أبعاد MRL</strong></td><td>قياس مقدار الجودة التي يفقدها النموذج عند اقتطاع التضمينات إلى 256 بُعدًا</td><td>أبعاد أقل = تكلفة تخزين أقل في قاعدة بيانات المتجهات، ولكن بأي تكلفة للجودة؟</td></tr>
</tbody>
</table>
<p>لا يغطي MTEB أيًا من ذلك. تضيف MMEB التضمينات متعددة الوسائط ولكنها تتخطى التضمينات السالبة الصلبة، لذا تسجل النماذج درجات عالية دون إثبات أنها تتعامل مع الفروق الدقيقة. تم تصميم CCKM لتغطية ما يفوتهم.</p>
<h2 id="Which-Embedding-Models-Did-We-Test-Gemini-Embedding-2-Jina-Embeddings-v4-and-More" class="common-anchor-header">ما هي نماذج التضمين التي اختبرناها؟ تضمين الجوزاء 2، تضمين الجوزاء 2، تضمين جينا v4، والمزيد<button data-href="#Which-Embedding-Models-Did-We-Test-Gemini-Embedding-2-Jina-Embeddings-v4-and-More" class="anchor-icon" translate="no">
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
    </button></h2><p>لقد اختبرنا 10 نماذج تغطي كلاً من خدمات واجهة برمجة التطبيقات والخيارات مفتوحة المصدر، بالإضافة إلى CLIP ViT-L-14 كخط أساس لعام 2021.</p>
<table>
<thead>
<tr><th>النموذج</th><th>المصدر</th><th>المعلمات</th><th>الأبعاد</th><th>الطريقة</th><th>السمة الرئيسية</th></tr>
</thead>
<tbody>
<tr><td>تضمين الجوزاء 2</td><td>جوجل</td><td>غير معلن</td><td>3072</td><td>نص / صورة / فيديو / صوت / PDF</td><td>جميع الوسائط، أوسع تغطية</td></tr>
<tr><td>Jina Embedddings v4</td><td>جينا للذكاء الاصطناعي</td><td>3.8B</td><td>2048</td><td>نص / صورة / PDF</td><td>محولات MRL + LoRA</td></tr>
<tr><td>فوياج متعدد الوسائط 3.5</td><td>Voyage AI (MongoDB)</td><td>غير معلن</td><td>1024</td><td>نص / صورة / فيديو</td><td>متوازن عبر المهام</td></tr>
<tr><td>Qwen3-VL-Embedding-2B</td><td>علي بابا كوين</td><td>2B</td><td>2048</td><td>نص / صورة / فيديو</td><td>مفتوح المصدر، خفيف الوزن متعدد الوسائط</td></tr>
<tr><td>Jina CLIP v2</td><td>جينا للذكاء الاصطناعي</td><td>~1B</td><td>1024</td><td>نص / صورة</td><td>بنية CLIP المحدثة</td></tr>
<tr><td>Cohere Embed v4</td><td>كوهير</td><td>غير معلن</td><td>ثابت</td><td>نص</td><td>استرجاع المؤسسة</td></tr>
<tr><td>OpenAI تضمين النص-التضمين النصي 3-الكبير</td><td>OpenAI</td><td>غير معلن</td><td>3072</td><td>نص</td><td>الأكثر استخداماً</td></tr>
<tr><td><a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings">BGE-M3</a></td><td>BAAI</td><td>568M</td><td>1024</td><td>النص</td><td>مفتوح المصدر، أكثر من 100 لغة</td></tr>
<tr><td>مكسباي-تضمين-كبير</td><td>Mixedbread AI</td><td>335M</td><td>1024</td><td>نص</td><td>خفيف الوزن، يركز على اللغة الإنجليزية</td></tr>
<tr><td>نص-تضمين-نص-نومي</td><td>الذكاء الاصطناعي النومي</td><td>137M</td><td>768</td><td>نص</td><td>خفيف الوزن للغاية</td></tr>
<tr><td>CLIP ViT-L-14</td><td>OpenAI (2021)</td><td>428M</td><td>768</td><td>نص/صورة</td><td>خط الأساس</td></tr>
</tbody>
</table>
<h2 id="Cross-Modal-Retrieval-Which-Models-Handle-Text-to-Image-Search" class="common-anchor-header">الاسترجاع عبر النماذج: ما هي النماذج التي تتعامل مع البحث من نص إلى صورة؟<button data-href="#Cross-Modal-Retrieval-Which-Models-Handle-Text-to-Image-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>إذا كان خط معالجة RAG الخاص بك يتعامل مع الصور جنبًا إلى جنب مع النص، فإن نموذج التضمين يحتاج إلى وضع كلتا الطريقتين في نفس <a href="https://zilliz.com/glossary/vector-embeddings">المساحة المتجهة</a>. فكّر في البحث عن الصور في التجارة الإلكترونية، أو قواعد المعرفة المختلطة بين الصور والنصوص، أو أي نظام يحتاج فيه الاستعلام النصي إلى العثور على الصورة الصحيحة.</p>
<h3 id="Method" class="common-anchor-header">الطريقة</h3><p>أخذنا 200 زوج من الصور والنصوص من COCO val2017. لكل صورة، أنشأ GPT-4o-mini وصفًا تفصيليًا. ثم قمنا بكتابة 3 أوصاف سلبية صعبة لكل صورة - أوصاف تختلف عن الوصف الصحيح بتفاصيل واحدة أو اثنتين فقط. يجب على النموذج أن يعثر على التطابق الصحيح في مجموعة من 200 صورة و600 مشتت.</p>
<p>مثال من مجموعة البيانات:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_9_3965746e33.png" alt="Vintage brown leather suitcases with travel stickers including California and Cuba, placed on a metal luggage rack against a blue sky — used as a test image in the cross-modal retrieval benchmark" class="doc-image" id="vintage-brown-leather-suitcases-with-travel-stickers-including-california-and-cuba,-placed-on-a-metal-luggage-rack-against-a-blue-sky-—-used-as-a-test-image-in-the-cross-modal-retrieval-benchmark" />
   </span> <span class="img-wrapper"> <span>حقائب جلدية بنية اللون عتيقة عليها ملصقات سفر بما في ذلك كاليفورنيا وكوبا، موضوعة على رف معدني للأمتعة مقابل سماء زرقاء - تُستخدم كصورة اختبار في معيار الاسترجاع متعدد الوسائط</span> </span></p>
<blockquote>
<p><strong>الوصف الصحيح:</strong> "تُظهر الصورة حقائب جلدية بنية اللون عتيقة مع ملصقات سفر مختلفة بما في ذلك "كاليفورنيا" و"كوبا" و"نيويورك"، موضوعة على رف أمتعة معدني مقابل سماء زرقاء صافية."</p>
<p><strong>سلبي للغاية:</strong> الجملة ذاتها، لكن "كاليفورنيا" تصبح "فلوريدا" و"السماء الزرقاء" تصبح "سماء ملبدة بالغيوم". يجب على العارض أن يفهم تفاصيل الصورة بالفعل لتمييزها.</p>
</blockquote>
<p><strong>تسجيل النقاط:</strong></p>
<ul>
<li>توليد <a href="https://zilliz.com/glossary/vector-embeddings">التضمينات</a> لجميع الصور وجميع النصوص (200 وصف صحيح + 600 وصف سلبي صعب).</li>
<li><strong>نص إلى صورة (t2i):</strong> يبحث كل وصف في 200 صورة عن أقرب تطابق. سجل نقطة إذا كانت النتيجة الأولى صحيحة.</li>
<li><strong>صورة إلى نص (i2t):</strong> تبحث كل صورة في كل 800 نص عن أقرب تطابق. يتم تسجيل نقطة فقط إذا كانت النتيجة العليا هي الوصف الصحيح، وليس النتيجة السلبية الصلبة.</li>
<li><strong>الدرجة النهائية:</strong> hard_avg_R@1 = (دقة t2i + دقة i2t) / 2</li>
</ul>
<h3 id="Results" class="common-anchor-header">النتائج</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_1_6f1fddae56.png" alt="Horizontal bar chart showing Cross-Modal Retrieval Ranking: Qwen3-VL-2B leads at 0.945, followed by Gemini Embed 2 at 0.928, Voyage MM-3.5 at 0.900, Jina CLIP v2 at 0.873, and CLIP ViT-L-14 at 0.768" class="doc-image" id="horizontal-bar-chart-showing-cross-modal-retrieval-ranking:-qwen3-vl-2b-leads-at-0.945,-followed-by-gemini-embed-2-at-0.928,-voyage-mm-3.5-at-0.900,-jina-clip-v2-at-0.873,-and-clip-vit-l-14-at-0.768" />
   <span>مخطط شريطي أفقي يوضح ترتيب الاسترجاع عبر النماذج: Qwen3-VL-2B في الصدارة بـ 0.945، يليه Gemini Embed 2 بـ 0.928، ثم Voyage MM-3.5 بـ 0.900، ثم Jina CLIP v2 بـ 0.873، وCLIP ViT-L-14 بـ 0.768</span> </span></p>
<p>جاء نموذج Qwen3-VL-2B، وهو نموذج معلمة 2B مفتوح المصدر من فريق Qwen التابع لشركة علي بابا، في المرتبة الأولى - متقدمًا على كل واجهة برمجة تطبيقات مغلقة المصدر.</p>
<p>تفسر<strong>فجوة الطرائق</strong> معظم الفرق. تقوم نماذج التضمين بتعيين النصوص والصور في نفس الفضاء المتجه، ولكن من الناحية العملية، تميل الطريقتان إلى التجميع في مناطق مختلفة. تقيس فجوة الطرائق المسافة L2 بين هاتين المجموعتين. فجوة أصغر = استرجاع أسهل عبر الطرائق.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_8_c5067a3434.png" alt="Visualization comparing large modality gap (0.73, text and image embedding clusters far apart) versus small modality gap (0.25, clusters overlapping) — smaller gap makes cross-modal matching easier" class="doc-image" id="visualization-comparing-large-modality-gap-(0.73,-text-and-image-embedding-clusters-far-apart)-versus-small-modality-gap-(0.25,-clusters-overlapping)-—-smaller-gap-makes-cross-modal-matching-easier" />
   </span> <span class="img-wrapper"> <span>التصور الذي يقارن بين فجوة الطرائق الكبيرة (0.73، مجموعات تضمين النص والصورة متباعدة عن بعضها البعض) مقابل فجوة الطرائق الصغيرة (0.25، المجموعات متداخلة) - الفجوة الأصغر تجعل المطابقة بين الطرائق أسهل</span> </span></p>
<table>
<thead>
<tr><th>النموذج</th><th>النتيجة (R@1)</th><th>فجوة الطرائق</th><th>البارامترات</th></tr>
</thead>
<tbody>
<tr><td>Qwen3-VL-2B</td><td>0.945</td><td>0.25</td><td>2B (مفتوح المصدر)</td></tr>
<tr><td>تضمين الجوزاء 2</td><td>0.928</td><td>0.73</td><td>غير معروف (مغلق)</td></tr>
<tr><td>فوياج متعدد الوسائط 3.5</td><td>0.900</td><td>0.59</td><td>غير معروف (مغلق)</td></tr>
<tr><td>Jina CLIP v2</td><td>0.873</td><td>0.87</td><td>~1B</td></tr>
<tr><td>CLIP ViT-L-14</td><td>0.768</td><td>0.83</td><td>428M</td></tr>
</tbody>
</table>
<p>تبلغ فجوة الطرائق في Qwen 0.25 - أي ما يقرب من ثلث فجوة الطرائق في Gemini 0.73. في <a href="https://zilliz.com/learn/what-is-a-vector-database">قاعدة بيانات متجهة</a> مثل <a href="https://milvus.io/">Milvus،</a> تعني فجوة الطرائق الصغيرة أنه يمكنك تخزين تضمينات النصوص والصور في نفس <a href="https://milvus.io/docs/manage-collections.md">المجموعة</a> <a href="https://milvus.io/docs/single-vector-search.md">والبحث</a> عبر كليهما مباشرةً. يمكن للفجوة الكبيرة أن تجعل <a href="https://zilliz.com/glossary/similarity-search">البحث في التشابه</a> عبر الوسائط أقل موثوقية، وقد تحتاج إلى خطوة إعادة ترتيب للتعويض.</p>
<h2 id="Cross-Lingual-Retrieval-Which-Models-Align-Meaning-Across-Languages" class="common-anchor-header">الاسترجاع عبر اللغات: ما هي النماذج التي تحاذي المعنى عبر اللغات؟<button data-href="#Cross-Lingual-Retrieval-Which-Models-Align-Meaning-Across-Languages" class="anchor-icon" translate="no">
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
    </button></h2><p>قواعد المعرفة متعددة اللغات شائعة في الإنتاج. يطرح المستخدم سؤالاً باللغة الصينية، ولكن الإجابة موجودة في مستند باللغة الإنجليزية - أو العكس. يحتاج نموذج التضمين إلى مواءمة المعنى عبر اللغات، وليس فقط داخل لغة واحدة.</p>
<h3 id="Method" class="common-anchor-header">الطريقة</h3><p>قمنا ببناء 166 زوجاً من الجمل المتوازية باللغتين الصينية والإنجليزية عبر ثلاثة مستويات صعوبة:</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_6_75caab66a7.png" alt="Cross-lingual difficulty tiers: Easy tier maps literal translations like 我爱你 to I love you; Medium tier maps paraphrased sentences like 这道菜太咸了 to This dish is too salty with hard negatives; Hard tier maps Chinese idioms like 画蛇添足 to gilding the lily with semantically different hard negatives" class="doc-image" id="cross-lingual-difficulty-tiers:-easy-tier-maps-literal-translations-like-我爱你-to-i-love-you;-medium-tier-maps-paraphrased-sentences-like-这道菜太咸了-to-this-dish-is-too-salty-with-hard-negatives;-hard-tier-maps-chinese-idioms-like-画蛇添足-to-gilding-the-lily-with-semantically-different-hard-negatives" />
   <span>مستويات صعوبة عبر اللغات: المستوى السهل يعيّن الترجمات الحرفية مثل أنا أحبك؛ والمستوى المتوسط يعيّن الجمل المعاد صياغتها مثل هذا الطبق مالح جدًا مع السلبيات الصعبة؛ والمستوى الصعب يعيّن التعابير الصينية مثل: أنا أحبك مع السلبيات الصعبة المختلفة دلاليًا</span> </span></p>
<p>تحصل كل لغة أيضًا على 152 مشتتًا سلبيًا صعبًا.</p>
<p><strong>تسجيل النقاط:</strong></p>
<ul>
<li>توليد التضمينات لجميع النصوص الصينية (166 صحيحة + 152 مشتتًا) وجميع النصوص الإنجليزية (166 صحيحة + 152 مشتتًا).</li>
<li><strong>الصينية → الإنجليزية:</strong> تبحث كل جملة صينية في 318 نصًا إنجليزيًا عن ترجمتها الصحيحة.</li>
<li><strong>الإنجليزية → الصينية:</strong> نفس الشيء بالعكس.</li>
<li><strong>النتيجة النهائية:</strong> hard_avg_R@1 = (دقة zh →en + دقة en →zh) / 2</li>
</ul>
<h3 id="Results" class="common-anchor-header">النتائج</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_2_d1c3500423.png" alt="Horizontal bar chart showing Cross-Lingual Retrieval Ranking: Gemini Embed 2 leads at 0.997, followed by Qwen3-VL-2B at 0.988, Jina v4 at 0.985, Voyage MM-3.5 at 0.982, down to mxbai at 0.120" class="doc-image" id="horizontal-bar-chart-showing-cross-lingual-retrieval-ranking:-gemini-embed-2-leads-at-0.997,-followed-by-qwen3-vl-2b-at-0.988,-jina-v4-at-0.985,-voyage-mm-3.5-at-0.982,-down-to-mxbai-at-0.120" />
   <span>مخطط شريطي أفقي يوضح ترتيب الاسترجاع عبر اللغات: يتصدر Gemini Embed 2 عند 0.997، يليه Qwen3-VL-2B عند 0.988، ثم Jina v4 عند 0.985، ثم Voyage MM-3.5 عند 0.982، وصولاً إلى mxbai عند 0.120</span> </span></p>
<p>حصل Gemini Embedding 2 على 0.997 - وهو أعلى معدل من أي نموذج تم اختباره. لقد كان النموذج الوحيد الذي حصل على 1.000 درجة كاملة في المستوى الصعب، حيث تتطلب أزواج مثل "画蛇添" → "تذهيب الزنبق" فهمًا <a href="https://zilliz.com/glossary/semantic-search">دلاليًا</a> حقيقيًا عبر اللغات، وليس مطابقة الأنماط.</p>
<table>
<thead>
<tr><th>النموذج</th><th>النتيجة (R@1)</th><th>سهلة</th><th>متوسطة</th><th>صعب (تعابير اصطلاحية)</th></tr>
</thead>
<tbody>
<tr><td>تضمين الجوزاء 2</td><td>0.997</td><td>1.000</td><td>1.000</td><td>1.000</td></tr>
<tr><td>Qwen3-VL-2B</td><td>0.988</td><td>1.000</td><td>1.000</td><td>0.969</td></tr>
<tr><td>تضمينات جينا V4</td><td>0.985</td><td>1.000</td><td>1.000</td><td>0.969</td></tr>
<tr><td>Voyage Multimodal 3.5</td><td>0.982</td><td>1.000</td><td>1.000</td><td>0.938</td></tr>
<tr><td>أوبن إيه آي 3-كبير</td><td>0.967</td><td>1.000</td><td>1.000</td><td>0.906</td></tr>
<tr><td>Cohere Embed v4</td><td>0.955</td><td>1.000</td><td>0.980</td><td>0.875</td></tr>
<tr><td>BGE-M3 (568M)</td><td>0.940</td><td>1.000</td><td>0.960</td><td>0.844</td></tr>
<tr><td>نص-تضمين-نص-رسمي (137M)</td><td>0.154</td><td>0.300</td><td>0.120</td><td>0.031</td></tr>
<tr><td>مكسباي-تضمين-كبير (335M)</td><td>0.120</td><td>0.220</td><td>0.080</td><td>0.031</td></tr>
</tbody>
</table>
<p>أفضل 7 نماذج تحصل جميعها على 0.93 في النتيجة الإجمالية - يحدث التمايز الحقيقي في المستوى الصعب (المصطلحات الصينية). النماذج السبعة الأولى تحصل على 0.93 في المهام متعددة اللغات.</p>
<h2 id="Key-Information-Retrieval-Can-Models-Find-a-Needle-in-a-32K-Token-Document" class="common-anchor-header">استرجاع المعلومات الأساسية: هل تستطيع النماذج العثور على إبرة في مستند مكون من 32 ألف كلمة؟<button data-href="#Key-Information-Retrieval-Can-Models-Find-a-Needle-in-a-32K-Token-Document" class="anchor-icon" translate="no">
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
    </button></h2><p>غالبًا ما تقوم أنظمة RAG بمعالجة المستندات الطويلة - العقود القانونية، والأوراق البحثية، والتقارير الداخلية التي تحتوي على <a href="https://zilliz.com/learn/introduction-to-unstructured-data">بيانات غير منظمة</a>. والسؤال هو ما إذا كان لا يزال بإمكان نموذج التضمين العثور على حقيقة واحدة محددة مدفونة في آلاف الأحرف من النص المحيط.</p>
<h3 id="Method" class="common-anchor-header">الطريقة</h3><p>أخذنا مقالات ويكيبيديا بأطوال متفاوتة (من 4 آلاف إلى 32 ألف حرف) ككومة قش وأدخلنا حقيقة واحدة ملفقة - الإبرة - في مواضع مختلفة: البداية و25% و50% و50% و75% والنهاية. يجب على النموذج أن يحدد، بناءً على تضمين الاستعلام، أي نسخة من المستند تحتوي على الإبرة.</p>
<p><strong>مثال:</strong></p>
<ul>
<li><strong>الإبرة:</strong> "أعلنت شركة ميريديان عن إيرادات ربع سنوية بقيمة 847.3 مليون دولار في الربع الثالث من عام 2025."</li>
<li><strong>استعلام:</strong> "ماذا كانت الإيرادات الفصلية لشركة ميريديان كوربوريشن؟</li>
<li><strong>كومة قش:</strong> مقالة من 32,000 حرف في ويكيبيديا عن التمثيل الضوئي، مع إخفاء الإبرة في مكان ما بالداخل.</li>
</ul>
<p><strong>التسجيل:</strong></p>
<ul>
<li>توليد تضمينات للاستعلام، والمستند الذي يحتوي على الإبرة، والمستند الذي لا يحتوي على الإبرة.</li>
<li>إذا كان الاستعلام أكثر تشابهًا مع المستند الذي يحتوي على الإبرة، فاحسبه كنتيجة.</li>
<li>متوسط الدقة عبر جميع أطوال المستندات ومواضع الإبرة.</li>
<li><strong>المقاييس النهائية:</strong> الدقة الإجمالية ومعدل التدهور (مقدار انخفاض الدقة من أقصر مستند إلى أطول مستند).</li>
</ul>
<h3 id="Results" class="common-anchor-header">النتائج</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_5_2bdc89516a.png" alt="Heatmap showing Needle-in-a-Haystack accuracy by document length: Gemini Embed 2 scores 1.000 across all lengths up to 32K; top 7 models score perfectly within their context windows; mxbai and nomic degrade sharply at 4K+" class="doc-image" id="heatmap-showing-needle-in-a-haystack-accuracy-by-document-length:-gemini-embed-2-scores-1.000-across-all-lengths-up-to-32k;-top-7-models-score-perfectly-within-their-context-windows;-mxbai-and-nomic-degrade-sharply-at-4k+" />
   <span>خريطة حرارية توضح دقة إبرة في كومة قش حسب طول المستند: يسجل Gemini Embedbed 2 درجة 1.000 عبر جميع الأطوال حتى 32 ألفًا؛ أفضل 7 نماذج تسجل نتائج مثالية ضمن نوافذ السياق الخاصة بها؛ يتدهور mxbai و nomic بشكل حاد عند 4K+</span> </span></p>
<p>Gemini Embedding 2 هو النموذج الوحيد الذي تم اختباره عبر النطاق الكامل 4K-32K، وقد سجل نقاطًا مثالية في كل الأطوال. لا يوجد نموذج آخر في هذا الاختبار لديه نافذة سياق تصل إلى 32K.</p>
<table>
<thead>
<tr><th>النموذج</th><th>1K</th><th>4K</th><th>8K</th><th>16K</th><th>32K</th><th>الإجمالي</th><th>التدهور</th></tr>
</thead>
<tbody>
<tr><td>تضمين الجوزاء 2</td><td>1.000</td><td>1.000</td><td>1.000</td><td>1.000</td><td>1.000</td><td>1.000</td><td>0%</td></tr>
<tr><td>OpenAI 3-كبير</td><td>1.000</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>تضمينات جينا إصدارات 4</td><td>1.000</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>Cohere Embed v4</td><td>1.000</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>Qwen3-VL-2B</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>رحلة متعددة الوسائط 3.5 - 3.5</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>جينا كليب v2</td><td>1.000</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>BGE-M3 (568M)</td><td>1.000</td><td>1.000</td><td>0.920</td><td>-</td><td>-</td><td>0.973</td><td>8%</td></tr>
<tr><td>مكسباي-تضمين-كبير (335M)</td><td>0.980</td><td>0.600</td><td>0.400</td><td>-</td><td>-</td><td>0.660</td><td>58%</td></tr>
<tr><td>نص-تضمين-نص-رسمي (137M)</td><td>1.000</td><td>0.460</td><td>0.440</td><td>-</td><td>-</td><td>0.633</td><td>56%</td></tr>
</tbody>
</table>
<p>"-" تعني أن طول المستند يتجاوز نافذة سياق النموذج.</p>
<p>تسجل النماذج السبعة الأوائل نتائج مثالية ضمن نوافذ سياقها. يبدأ BGE-M3 بالانخفاض عند 8K (0.920). تنخفض النماذج خفيفة الوزن (mxbai و nomic) إلى 0.4-0.6 عند 4 آلاف حرف فقط - أي حوالي 1000 رمز. بالنسبة لـ mxbai، يعكس هذا الانخفاض جزئيًا اقتطاع نافذة السياق المكونة من 512 رمزًا لمعظم المستند.</p>
<h2 id="MRL-Dimension-Compression-How-Much-Quality-Do-You-Lose-at-256-Dimensions" class="common-anchor-header">ضغط أبعاد MRL: ما مقدار الجودة التي تفقدها عند 256 بُعدًا؟<button data-href="#MRL-Dimension-Compression-How-Much-Quality-Do-You-Lose-at-256-Dimensions" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>تعلُّم تمثيل ماتريوشكا (MRL)</strong> هو تقنية تدريب تجعل الأبعاد N الأولى للمتجه ذات معنى بمفردها. خذ متجهًا مكونًا من 3072 بُعدًا، واقتطعه إلى 256 بُعدًا، وسيظل محتفظًا بمعظم جودته الدلالية. أبعاد أقل تعني تكاليف أقل للتخزين والذاكرة في <a href="https://zilliz.com/learn/what-is-a-vector-database">قاعدة بيانات المتجهات،</a> فالانتقال من 3072 إلى 256 بُعدًا يعني تخفيض التخزين 12 مرة.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_10_aef8755877.png" alt="Illustration showing MRL dimension truncation: 3072 dimensions at full quality, 1024 at 95%, 512 at 90%, 256 at 85% — with 12x storage savings at 256 dimensions" class="doc-image" id="illustration-showing-mrl-dimension-truncation:-3072-dimensions-at-full-quality,-1024-at-95%,-512-at-90%,-256-at-85%-—-with-12x-storage-savings-at-256-dimensions" />
   <span>رسم توضيحي يوضح اقتطاع أبعاد MRL: 3072 بُعدًا بجودة كاملة، 1024 بجودة 95%، 512 بجودة 90%، 256 بجودة 85% - مع توفير 12 ضعفًا في التخزين عند 256 بُعدًا</span> </span></p>
<h3 id="Method" class="common-anchor-header">الطريقة</h3><p>استخدمنا 150 زوجًا من الجُمل من معيار STS-B، لكل منها درجة تشابه مُعللة من قبل الإنسان (0-5). بالنسبة لكل نموذج، أنشأنا التضمينات بأبعاد كاملة، ثم اقتطعنا الأبعاد إلى 1024 و512 و256.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_4_44266e5456.png" alt="STS-B data examples showing sentence pairs with human similarity scores: A girl is styling her hair vs A girl is brushing her hair scores 2.5; A group of men play soccer on the beach vs A group of boys are playing soccer on the beach scores 3.6" class="doc-image" id="sts-b-data-examples-showing-sentence-pairs-with-human-similarity-scores:-a-girl-is-styling-her-hair-vs-a-girl-is-brushing-her-hair-scores-2.5;-a-group-of-men-play-soccer-on-the-beach-vs-a-group-of-boys-are-playing-soccer-on-the-beach-scores-3.6" />
   <span>أمثلة لبيانات STS-B تُظهر أزواج الجمل مع درجات التشابه البشري: فتاة تصفف شعرها مقابل فتاة تصفف شعرها بنتيجة 2.5؛ مجموعة من الرجال يلعبون كرة القدم على الشاطئ مقابل مجموعة من الأولاد يلعبون كرة القدم على الشاطئ بنتيجة 3.6</span> </span></p>
<p><strong>تسجيل النقاط:</strong></p>
<ul>
<li>في كل مستوى بُعد، احسب <a href="https://zilliz.com/glossary/cosine-similarity">التشابه في جيب التمام</a> بين تضمينات كل زوج من الجمل.</li>
<li>قارن ترتيب التشابه في النموذج بالترتيب البشري باستخدام مقياس <strong>سبيرمان ρ</strong> (ارتباط الرتب).</li>
</ul>
<blockquote>
<p><strong>ما هو معيار سبيرمان ρ؟</strong> إنه يقيس مدى توافق الترتيبين. إذا صنف البشر الزوج (أ) على أنه الأكثر تشابهًا، و(ب) في المرتبة الثانية، و(ج) في المرتبة الثانية و(ج) في المرتبة الثالثة - وينتج عن تشابه جيب التمام في النموذج نفس الترتيب أ &gt; ب &gt; ج - فإن ρ يقترب من 1.0. يعني ρ يساوي 1.0 توافقًا تامًا. و ρ من 0 يعني عدم وجود ارتباط.</p>
</blockquote>
<p><strong>المقاييس النهائية:</strong> spearman_rho (الأعلى هو الأفضل) و min_viable_dim (أصغر بُعد تبقى فيه الجودة في حدود 5% من الأداء الكامل البعد).</p>
<h3 id="Results" class="common-anchor-header">النتائج</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_3_7192725ed6.png" alt="Dot plot showing MRL Full Dimension vs 256 Dimension Quality: Voyage MM-3.5 leads with +0.6% change, Jina v4 +0.5%, while Gemini Embed 2 shows -0.6% at the bottom" class="doc-image" id="dot-plot-showing-mrl-full-dimension-vs-256-dimension-quality:-voyage-mm-3.5-leads-with-+0.6%-change,-jina-v4-+0.5%,-while-gemini-embed-2-shows--0.6%-at-the-bottom" />
   <span>مخطط نقطي يُظهر البُعد الكامل لـ MRL مقابل جودة 256 بُعد: يتصدر Voyage MM-3.5 بتغير + 0.6%، وJina v4 + 0.5%، بينما يظهر Gemini Embed 2 -0.6% في الأسفل</span> </span></p>
<p>إذا كنت تخطط لتقليل تكاليف التخزين في <a href="https://milvus.io/">Milvus</a> أو أي قاعدة بيانات متجهة أخرى عن طريق اقتطاع الأبعاد، فإن هذه النتيجة مهمة.</p>
<table>
<thead>
<tr><th>النموذج</th><th>ρ (خافت كامل)</th><th>ρ (256 خافت)</th><th>الاضمحلال</th></tr>
</thead>
<tbody>
<tr><td>رحلة متعددة الوسائط 3.5</td><td>0.880</td><td>0.874</td><td>0.7%</td></tr>
<tr><td>تضمينات جينا إصدارات 4</td><td>0.833</td><td>0.828</td><td>0.6%</td></tr>
<tr><td>مكسباي-تضمين-كبير (335M)</td><td>0.815</td><td>0.795</td><td>2.5%</td></tr>
<tr><td>سميك-تضمين-نص (137 مليون)</td><td>0.781</td><td>0.774</td><td>0.8%</td></tr>
<tr><td>OpenAI 3-الكبير</td><td>0.767</td><td>0.762</td><td>0.6%</td></tr>
<tr><td>تضمين الجوزاء 2</td><td>0.683</td><td>0.689</td><td>-0.8%</td></tr>
</tbody>
</table>
<p>تتصدر كل من Voyage وJina v4 لأن كلاهما تم تدريبهما صراحةً باستخدام MRL كهدف. ليس لضغط الأبعاد علاقة كبيرة بحجم النموذج - ما يهم هو ما إذا كان النموذج قد تم تدريبه على ذلك.</p>
<p>ملاحظة حول درجة Gemini: يعكس تصنيف MRL مدى جودة النموذج في الحفاظ على الجودة بعد الاقتطاع، وليس مدى جودة استرجاعه للأبعاد الكاملة. إن استرجاع Gemini للأبعاد الكاملة قوي - وقد أثبتت نتائج المعلومات عبر اللغات والمعلومات الأساسية ذلك بالفعل. لم يتم تحسينه فقط للتقليص. إذا لم تكن بحاجة إلى ضغط الأبعاد، فهذا المقياس لا ينطبق عليك.</p>
<h2 id="Which-Embedding-Model-Should-You-Use" class="common-anchor-header">أي نموذج تضمين يجب عليك استخدامه؟<button data-href="#Which-Embedding-Model-Should-You-Use" class="anchor-icon" translate="no">
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
    </button></h2><p>لا يوجد نموذج واحد يفوز بكل شيء. إليك بطاقة النتائج الكاملة</p>
<table>
<thead>
<tr><th>النموذج</th><th>البارامترات</th><th>عبر الوسائط</th><th>متعدد اللغات</th><th>المعلومات الأساسية</th><th>MRL ρ</th></tr>
</thead>
<tbody>
<tr><td>تضمين الجوزاء 2</td><td>غير معلن</td><td>0.928</td><td>0.997</td><td>1.000</td><td>0.668</td></tr>
<tr><td>فوياج متعدد الوسائط 3.5</td><td>غير معلن</td><td>0.900</td><td>0.982</td><td>1.000</td><td>0.880</td></tr>
<tr><td>تضمين جينا تضمينات v4</td><td>3.8B</td><td>-</td><td>0.985</td><td>1.000</td><td>0.833</td></tr>
<tr><td>Qwen3-VL-2B</td><td>2B</td><td>0.945</td><td>0.988</td><td>1.000</td><td>0.774</td></tr>
<tr><td>OpenAI 3-كبير</td><td>غير معلن</td><td>-</td><td>0.967</td><td>1.000</td><td>0.760</td></tr>
<tr><td>Cohere Embed v4</td><td>لم يتم الكشف عنها</td><td>-</td><td>0.955</td><td>1.000</td><td>-</td></tr>
<tr><td>جينا كليب v2</td><td>~1B</td><td>0.873</td><td>0.934</td><td>1.000</td><td>-</td></tr>
<tr><td>BGE-M3</td><td>568M</td><td>-</td><td>0.940</td><td>0.973</td><td>0.744</td></tr>
<tr><td>مكسباي-تضمين-كبير</td><td>335M</td><td>-</td><td>0.120</td><td>0.660</td><td>0.815</td></tr>
<tr><td>نص-تضمين-نص-رسمي</td><td>137M</td><td>-</td><td>0.154</td><td>0.633</td><td>0.780</td></tr>
<tr><td>CLIP ViT-L-14</td><td>428M</td><td>0.768</td><td>0.030</td><td>-</td><td>-</td></tr>
</tbody>
</table>
<p>"-" تعني أن النموذج لا يدعم تلك الطريقة أو القدرة. CLIP هو خط الأساس لعام 2021 كمرجع.</p>
<p>إليك ما يبرز</p>
<ul>
<li><strong>عبر الوسائط</strong> Qwen3-VL-2B (0.945) أولًا، ثم Gemini (0.928) ثانيًا، ثم Voyage (0.900) ثالثًا. تغلب نموذج 2B مفتوح المصدر 2B على كل واجهة برمجة تطبيقات مغلقة المصدر. كان العامل الحاسم هو فجوة الطرائق وليس عدد المعلمات.</li>
<li><strong>متعدد اللغات:</strong> يتصدر Gemini (0.997) - النموذج الوحيد الذي حصل على درجة مثالية في المحاذاة على مستوى المصطلحات. أفضل 8 نماذج حصلت جميعها على 0.93. النماذج خفيفة الوزن للغة الإنجليزية فقط تسجل درجات قريبة من الصفر.</li>
<li><strong>معلومات أساسية:</strong> تسجل نماذج API والنماذج مفتوحة المصدر الكبيرة والمفتوحة المصدر نقاطًا مثالية حتى 8 آلاف. تبدأ النماذج الأقل من 335M في التدهور عند 4K. Gemini هو النموذج الوحيد الذي يتعامل مع 32K بدرجة مثالية.</li>
<li><strong>ضغط أبعاد MRL:</strong> تتقدم Voyage (0.880) وJina v4 (0.833) حيث تفقد أقل من 1% عند 256 بُعدًا. تأتي Gemini (0.668) في المرتبة الأخيرة - قوية في الأبعاد الكاملة، وغير محسّنة للاقتطاع.</li>
</ul>
<h3 id="How-to-Pick-A-Decision-Flowchart" class="common-anchor-header">كيفية الاختيار: مخطط انسيابي للقرار</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_7_b2bd48bdcc.png" alt="Embedding model selection flowchart: Start → Need images or video? → Yes: Need to self-host? → Yes: Qwen3-VL-2B, No: Gemini Embedding 2. No images → Need to save storage? → Yes: Jina v4 or Voyage, No: Need multilingual? → Yes: Gemini Embedding 2, No: OpenAI 3-large" class="doc-image" id="embedding-model-selection-flowchart:-start-→-need-images-or-video?-→-yes:-need-to-self-host?-→-yes:-qwen3-vl-2b,-no:-gemini-embedding-2.-no-images-→-need-to-save-storage?-→-yes:-jina-v4-or-voyage,-no:-need-multilingual?-→-yes:-gemini-embedding-2,-no:-openai-3-large" />
   <span>مخطط انسيابي لاختيار نموذج التضمين: ابدأ ← هل تحتاج إلى صور أو فيديو؟ → نعم: هل تحتاج إلى استضافة ذاتية؟ → نعم: Qwen3-VL-2B، لا: تضمين الجوزاء 2. لا توجد صور → هل تحتاج إلى حفظ التخزين؟ → نعم: نعم: جينا v4 أو Voyage، لا: هل تحتاج إلى تعدد اللغات؟</span> </span>→ <span class="img-wrapper"> <span>نعم: نعم: تضمين الجوزاء 2، لا: OpenAI 3-large</span> </span></p>
<h3 id="The-Best-All-Rounder-Gemini-Embedding-2" class="common-anchor-header">الأفضل في كل شيء تضمين الجوزاء 2</h3><p>بشكل عام، Gemini Embedding 2 هو أقوى نموذج شامل في هذا المعيار.</p>
<p><strong>نقاط القوة</strong> الأول في التضمين متعدد اللغات (0.997) واسترجاع المعلومات الأساسية (1.000 عبر جميع الأطوال حتى 32 ألف). الثاني في الوسائط المتعددة (0.928). أوسع تغطية للوسائط - خمس وسائط (نص، صورة، فيديو، صوت، ملف PDF) حيث تصل معظم النماذج إلى ثلاث وسائط.</p>
<p><strong>نقاط الضعف:</strong> الأخير في ضغط MRL (ρ = 0.668). تفوّق عليه في الضغط متعدد الوسائط Qwen3-VL-2B مفتوح المصدر.</p>
<p>إذا لم تكن بحاجة إلى ضغط الأبعاد، فإن Gemini ليس لديه منافس حقيقي في الجمع بين استرجاع متعدد اللغات + استرجاع المستندات الطويلة. ولكن من أجل الدقة عبر الوسائط أو تحسين التخزين، فإن النماذج المتخصصة تعمل بشكل أفضل.</p>
<h2 id="Limitations" class="common-anchor-header">القيود<button data-href="#Limitations" class="anchor-icon" translate="no">
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
<li>لم ندرج كل النماذج التي تستحق الدراسة - كان NV-Embed-v2 من NVIDIA و v5-text من جينا على القائمة ولكننا لم نصل إلى هذه الجولة.</li>
<li>لقد ركزنا على طرائق النصوص والصور؛ لم تتم تغطية تضمين الفيديو والصوت وملفات PDF (على الرغم من ادعاء بعض النماذج دعمها).</li>
<li>كان استرجاع الرموز والسيناريوهات الأخرى الخاصة بالمجال خارج النطاق.</li>
<li>كانت أحجام العينات صغيرة نسبيًا، لذلك قد تندرج الاختلافات الضيقة في الترتيب بين النماذج ضمن الضوضاء الإحصائية.</li>
</ul>
<p>ستكون نتائج هذه المقالة قديمة في غضون عام. يتم شحن النماذج الجديدة باستمرار، وتتغير لوحة المتصدرين مع كل إصدار. الاستثمار الأكثر ديمومة هو بناء خط أنابيب التقييم الخاص بك - تحديد أنواع البيانات الخاصة بك، وأنماط الاستعلام الخاصة بك، وأطوال المستندات، وتشغيل النماذج الجديدة من خلال اختباراتك الخاصة عند انخفاضها. تستحق المعايير العامة مثل MTEB و MMTEB و MMEB المراقبة، ولكن يجب أن تأتي المكالمة النهائية دائمًا من بياناتك الخاصة.</p>
<p><a href="https://github.com/zc277584121/mm-embedding-bench">إن كود المعيار الخاص بنا مفتوح المصدر على GitHub</a> - قم بتضمينه وتكييفه مع حالة الاستخدام الخاصة بك.</p>
<hr>
<p>بمجرد أن تختار نموذج التضمين الخاص بك، فأنت بحاجة إلى مكان ما لتخزين تلك المتجهات والبحث فيها على نطاق واسع. <a href="https://milvus.io/">Milvus</a> هي قاعدة بيانات المتجهات مفتوحة المصدر الأكثر اعتمادًا في العالم مع <a href="https://github.com/milvus-io/milvus">أكثر من 43 ألف نجم</a> على <a href="https://github.com/milvus-io/milvus">GitHub</a> مصممة لهذا الغرض بالضبط - فهي تدعم الأبعاد المقطوعة من MRL، والمجموعات المختلطة متعددة الوسائط، والبحث الهجين الذي يجمع بين المتجهات الكثيفة والمتناثرة، وتتراوح <a href="https://milvus.io/docs/architecture_overview.md">من كمبيوتر محمول إلى مليارات المتجهات</a>.</p>
<ul>
<li>ابدأ باستخدام <a href="https://milvus.io/docs/quickstart.md">دليل Milvus Quickstart،</a> أو قم بالتثبيت باستخدام <code translate="no">pip install pymilvus</code>.</li>
<li>انضم إلى تطبيق <a href="https://milvusio.slack.com/">Milvus Slack</a> أو <a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord</a> لطرح أسئلة حول دمج تكامل النماذج أو استراتيجيات فهرسة المتجهات أو توسيع نطاق الإنتاج.</li>
<li><a href="https://milvus.io/office-hours">احجز جلسة ساعات عمل مجانية في Milvus Office Hours</a> للتعرف على بنية RAG الخاصة بك - يمكننا مساعدتك في اختيار النموذج وتصميم مخطط المجموعة وضبط الأداء.</li>
<li>إذا كنت تفضّل تخطي أعمال البنية التحتية، فإن <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (المدارة من قبل Milvus) تقدم لك مستوى مجاني للبدء.</li>
</ul>
<hr>
<p>بعض الأسئلة التي تظهر عندما يختار المهندسون نموذج التضمين لإنتاج RAG:</p>
<p><strong>س: هل يجب أن أستخدم نموذج التضمين متعدد الوسائط حتى لو لم يكن لديّ سوى بيانات نصية في الوقت الحالي؟</strong></p>
<p>يعتمد ذلك على خارطة الطريق الخاصة بك. إذا كان من المحتمل أن يضيف خط الإنتاج الخاص بك صورًا أو ملفات PDF أو طرائق أخرى في غضون 6-12 شهرًا القادمة، فإن البدء بنموذج متعدد الوسائط مثل Gemini Embedding 2 أو Voyage Multimodal 3.5 يجنبك عملية ترحيل مؤلمة لاحقًا - لن تحتاج إلى إعادة تضمين مجموعة بياناتك بالكامل. إذا كنت واثقًا من أنها نصية فقط في المستقبل المنظور، فإن نموذجًا يركز على النصوص مثل OpenAI 3-large أو Cohere Embed v4 سيمنحك سعرًا/أداءً أفضل.</p>
<p><strong>س: ما مقدار التخزين الذي يوفره ضغط أبعاد MRL فعليًا في قاعدة بيانات المتجهات؟</strong></p>
<p>إن الانتقال من 3072 بُعدًا إلى 256 بُعدًا هو تخفيض 12 ضعفًا في التخزين لكل متجه. بالنسبة لمجموعة <a href="https://milvus.io/">Milvus</a> التي تحتوي على 100 مليون متجه بـ 100 مليون متجه في float32، هذا يساوي تقريبًا 1.14 تيرابايت → 95 جيجابايت. وتكمن المشكلة في أن جميع النماذج لا تتعامل مع الاقتطاع بشكل جيد - حيث تفقد Voyage Multimodal 3.5 وJina Embeddings v4 أقل من 1% من الجودة عند 256 بُعدًا، بينما تتدهور جودة النماذج الأخرى بشكل كبير.</p>
<p><strong>س: هل Qwen3-VL-2B أفضل حقًا من Gemini Embedding 2 للبحث متعدد الوسائط؟</strong></p>
<p>على معيارنا، نعم - سجل Qwen3-VL-2B 0.945 مقابل 0.928 من Gemini في الاسترجاع الصعب عبر الأنماط مع مشتتات شبه متطابقة. والسبب الرئيسي في ذلك هو فجوة الطرائق الأصغر بكثير في Qwen (0.25 مقابل 0.73)، مما يعني أن النص والصورة <a href="https://zilliz.com/glossary/vector-embeddings">المضمنة</a> يتجمعان معًا في الفضاء المتجه. ومع ذلك، فإن Gemini يغطي خمس طرائق بينما يغطي Qwen ثلاث طرائق، لذلك إذا كنت بحاجة إلى تضمين الصوت أو PDF، فإن Gemini هو الخيار الوحيد.</p>
<p><strong>س: هل يمكنني استخدام نماذج التضمين هذه مع Milvus مباشرةً؟</strong></p>
<p>ج: نعم. تُخرج جميع هذه النماذج متجهات عائمة قياسية، والتي يمكنك <a href="https://milvus.io/docs/insert-update-delete.md">إدراجها في Milvus</a> والبحث باستخدام <a href="https://zilliz.com/glossary/cosine-similarity">تشابه جيب التمام</a> أو مسافة L2 أو المنتج الداخلي. يعمل <a href="https://milvus.io/docs/install-pymilvus.md">PyMilvus</a> مع أي نموذج تضمين - قم بإنشاء متجهاتك باستخدام مجموعة تطوير البرمجيات الخاصة بالنموذج، ثم قم بتخزينها والبحث عنها في Milvus. بالنسبة للمتجهات المقطوعة من MRL، ما عليك سوى تعيين بُعد المجموعة إلى هدفك (على سبيل المثال، 256) عند <a href="https://milvus.io/docs/manage-collections.md">إنشاء المجموعة</a>.</p>
