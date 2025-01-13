---
id: 2021-10-22-apply-configuration-changes-on-milvus-2.md
title: 'المشاركة التقنية:تطبيق تغييرات التهيئة على Milvus 2.0 باستخدام Docker Compose'
author: Jingjing
date: 2021-10-22T00:00:00.000Z
desc: تعرف على كيفية تطبيق تغييرات التكوين على Milvus 2.0
cover: assets.zilliz.com/Modify_configurations_f9162c5670.png
tag: Engineering
---
<custom-h1>المشاركة التقنية: تطبيق تغييرات التكوين على Milvus 2.0 باستخدام Docker Compose</custom-h1><p><em>جينغجينغ جيا، مهندسة بيانات في Zilliz، تخرجت من جامعة شيان جياوتونغ بشهادة في علوم الحاسب الآلي. بعد انضمامها إلى Zilliz، تعمل بشكل أساسي على المعالجة المسبقة للبيانات، ونشر نماذج الذكاء الاصطناعي، وأبحاث التكنولوجيا ذات الصلة بـ Milvus، ومساعدة مستخدمي المجتمع على تنفيذ سيناريوهات التطبيق. هي صبورة جدًا، وتحب التواصل مع شركاء المجتمع، وتستمتع بالاستماع إلى الموسيقى ومشاهدة الأنيمي.</em></p>
<p>بصفتي مستخدمًا متكررًا لـ Milvus، كنت متحمسًا جدًا لإصدار Milvus 2.0 RC الذي تم إصداره حديثًا. وفقًا للمقدمة الموجودة على الموقع الرسمي، يبدو أن Milvus 2.0 يتفوق على سابقيه بفارق كبير. كنت متحمسًا جدًا لتجربته بنفسي.</p>
<p>وقد فعلت.  ومع ذلك، عندما وضعت يدي حقًا على Milvus 2.0، أدركت أنني لم أتمكن من تعديل ملف التكوين في Milvus 2.0 بنفس السهولة التي قمت بها مع Milvus 1.1.1. لم أتمكن من تغيير ملف التهيئة داخل حاوية دوكر في Milvus 2.0 التي بدأت باستخدام Docker Compose، وحتى فرض التغيير لم يكن يسري مفعوله. لاحقًا، علمت أن الإصدار Milvus 2.0 RC لم يكن قادرًا على اكتشاف التغييرات التي طرأت على ملف التكوين بعد التثبيت. وسيعمل الإصدار المستقر المستقبلي على إصلاح هذه المشكلة.</p>
<p>بعد تجربة طرق مختلفة، وجدت طريقة موثوقة لتطبيق التغييرات على ملفات التكوين لملف التكوين لـ Milvus 2.0 المستقل والمجموعة، وإليك الطريقة.</p>
<p>لاحظ أنه يجب إجراء جميع التغييرات على التكوين قبل إعادة تشغيل Milvus باستخدام Docker Compose.</p>
<h2 id="Modify-configuration-file-in-Milvus-standalone" class="common-anchor-header">تعديل ملف التكوين في ملف Milvus المستقل<button data-href="#Modify-configuration-file-in-Milvus-standalone" class="anchor-icon" translate="no">
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
    </button></h2><p>أولاً، ستحتاج إلى <a href="https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml">تنزيل</a> نسخة من ملف <strong>milvus.yaml</strong> إلى جهازك المحلي.</p>
<p>ثم يمكنك تغيير التكوينات في الملف. على سبيل المثال، يمكنك تغيير تنسيق السجل على النحو <code translate="no">.json</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_1_ee4a16a3ee.png" alt="1.1.png" class="doc-image" id="1.1.png" />
   </span> <span class="img-wrapper"> <span>1.1.png</span> </span></p>
<p>بمجرد تعديل ملف milvus <strong>.yaml،</strong> ستحتاج أيضًا إلى <a href="https://github.com/milvus-io/milvus/blob/master/deployments/docker/standalone/docker-compose.yml">تنزيل</a> وتعديل ملف <strong>docker-compose.yaml</strong> لملف مستقل عن طريق تعيين المسار المحلي إلى milvus.yaml على مسار حاوية docker المقابل لملف التكوين <code translate="no">/milvus/configs/milvus.yaml</code> ضمن قسم <code translate="no">volumes</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_2_5e7c73708c.png" alt="1.2.png" class="doc-image" id="1.2.png" />
   </span> <span class="img-wrapper"> <span>1.2.png</span> </span></p>
<p>أخيرًا، ابدأ تشغيل ميلفوس المستقل باستخدام <code translate="no">docker-compose up -d</code> وتحقق مما إذا كانت التعديلات ناجحة. على سبيل المثال، قم بتشغيل <code translate="no">docker logs</code> للتحقق من تنسيق السجل.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_3_a0406df3ab.png" alt="1.3.png" class="doc-image" id="1.3.png" />
   </span> <span class="img-wrapper"> <span>1.3.png</span> </span></p>
<h2 id="Modify-configuration-file-in-Milvus-cluster" class="common-anchor-header">تعديل ملف التكوين في مجموعة ميلفوس العنقودية<button data-href="#Modify-configuration-file-in-Milvus-cluster" class="anchor-icon" translate="no">
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
    </button></h2><p>أولاً، قم <a href="https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml">بتنزيل</a> ملف <strong>milvus.yaml</strong> وتعديله ليناسب احتياجاتك.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_4_758b182846.png" alt="1.4.png" class="doc-image" id="1.4.png" />
   </span> <span class="img-wrapper"> <span>1.4.png</span> </span></p>
<p>بعد ذلك ستحتاج إلى <a href="https://github.com/milvus-io/milvus/blob/master/deployments/docker/cluster/docker-compose.yml">تنزيل</a> ملف <strong>docker-compose.yml</strong> العنقودي وتعديله عن طريق تعيين المسار المحلي لملف <strong>milvus.yaml</strong> إلى المسار المقابل لملفات التكوين في جميع المكونات، أي تنسيق الجذر، وتنسيق البيانات، وعقدة البيانات، وتنسيق الاستعلام، وعقدة الاستعلام، وعقدة الاستعلام، وتنسيق الفهرس، وعقدة الفهرس، والوكيل.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_5_80e15811b8.png" alt="1.5.png" class="doc-image" id="1.5.png" />
   </span> <span class="img-wrapper"> <span>1.5.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_6_b2f3e4e47f.png" alt="1.6.png" class="doc-image" id="1.6.png" />
   </span> <span class="img-wrapper"> <span>1.6.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_7_4d1eb5e1e5.png" alt="1.7.png" class="doc-image" id="1.7.png" /></span> <span class="img-wrapper">1 </span>. <span class="img-wrapper">7 <span>.png</span> </span></p>
<p>أخيرًا، يمكنك بدء تشغيل مجموعة Milvus باستخدام <code translate="no">docker-compose up -d</code> والتحقق مما إذا كانت التعديلات ناجحة.</p>
<h2 id="Change-log-file-path-in-configuration-file" class="common-anchor-header">تغيير مسار ملف السجل في ملف التكوين<button data-href="#Change-log-file-path-in-configuration-file" class="anchor-icon" translate="no">
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
    </button></h2><p>أولاً، قم <a href="https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml">بتحميل</a> ملف <strong>milvus.yaml،</strong> وقم بتغيير القسم <code translate="no">rootPath</code> كدليل حيث تتوقع تخزين ملفات السجل في حاوية Docker.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_8_e3bdc4843f.png" alt="1.8.png" class="doc-image" id="1.8.png" />
   </span> <span class="img-wrapper"> <span>1.8.png</span> </span></p>
<p>بعد ذلك، قم بتنزيل ملف <strong>docker-compose.yml</strong> المقابل لملف Milvus <a href="https://github.com/milvus-io/milvus/blob/master/deployments/docker/standalone/docker-compose.yml">المستقل</a> أو <a href="https://github.com/milvus-io/milvus/blob/master/deployments/docker/cluster/docker-compose.yml">العنقودي</a>.</p>
<p>بالنسبة للمستقلة، ستحتاج إلى تعيين المسار المحلي لملف <strong>milvus.yaml</strong> إلى مسار حاوية دوكر المقابل لملف التكوين <code translate="no">/milvus/configs/milvus.yaml</code> ، وتعيين دليل ملف السجل المحلي إلى دليل حاوية دوكر الذي قمت بإنشائه مسبقًا.</p>
<p>بالنسبة للكتلة، ستحتاج إلى تعيين كلا المسارين في كل مكون.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_9_22d8929d92.png" alt="1.9.png" class="doc-image" id="1.9.png" />
   </span> <span class="img-wrapper"> <span>1.9.png</span> </span></p>
<p>أخيرًا، ابدأ تشغيل Milvus المستقل أو العنقودي باستخدام <code translate="no">docker-compose up -d</code> وتحقق من ملفات السجل لمعرفة ما إذا كان التعديل ناجحًا.</p>
