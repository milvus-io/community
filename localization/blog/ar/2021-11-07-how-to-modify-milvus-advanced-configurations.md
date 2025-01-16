---
id: 2021-11-07-how-to-modify-milvus-advanced-configurations.md
title: كيفية تعديل تكوينات ميلفوس المتقدمة
author: Zilliz
date: 2021-11-08T00:00:00.000Z
desc: كيفية تعديل تكوين Milvus المنشور على Kubernetes
cover: assets.zilliz.com/modify_4d93b9da3a.png
tag: Engineering
---
<p><em>يوفن زونغ، مهندسة تطوير اختبارات زيليز، تخرجت من جامعة هواتشونغ للعلوم والتكنولوجيا وحصلت على درجة الماجستير في تكنولوجيا الكمبيوتر. وهي تعمل حاليًا في ضمان الجودة لقاعدة بيانات Milvus vector، بما في ذلك على سبيل المثال لا الحصر اختبار تكامل الواجهة، واختبار SDK، واختبار المعيار، وما إلى ذلك. تُعدّ يوفن من المتحمسين لحل المشكلات في اختبار وتطوير Milvus، وهي من أشد المعجبين بنظرية هندسة الفوضى وممارسة حفر الأخطاء.</em></p>
<h2 id="Background" class="common-anchor-header">الخلفية<button data-href="#Background" class="anchor-icon" translate="no">
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
    </button></h2><p>أثناء استخدام قاعدة بيانات Milvus vector، ستحتاج إلى تعديل التكوين الافتراضي لتلبية متطلبات السيناريوهات المختلفة. في السابق، شارك أحد مستخدمي Milvus سابقًا حول <a href="/blog/ar/2021-10-22-apply-configuration-changes-on-milvus-2.md">كيفية تعديل تكوين Milvus المنشور باستخدام Docker Compose</a>. وفي هذه المقالة، أود أن أشارككم كيفية تعديل تكوين Milvus المنشور على Kubernetes.</p>
<h2 id="Modify-configuration-of-Milvus-on-Kubernetes" class="common-anchor-header">تعديل تكوين Milvus على Kubernetes<button data-href="#Modify-configuration-of-Milvus-on-Kubernetes" class="anchor-icon" translate="no">
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
    </button></h2><p>يمكنك اختيار خطط تعديل مختلفة وفقًا لمعلمات التكوين التي ترغب في تعديلها. يتم تخزين جميع ملفات تكوين Milvus ضمن <strong>milvus/configs</strong>. أثناء تثبيت Milvus على Kubernetes، ستتم إضافة مستودع مخطط Milvus Helm Chart محليًا. من خلال تشغيل <code translate="no">helm show values milvus/milvus</code> ، يمكنك التحقق من المعلمات التي يمكن تعديلها مباشرة باستخدام المخطط. بالنسبة للمعلمات القابلة للتعديل باستخدام Chart، يمكنك تمرير المعلمة باستخدام <code translate="no">--values</code> أو <code translate="no">--set</code>. للمزيد من المعلومات، راجع <a href="https://artifacthub.io/packages/helm/milvus/milvus">مخطط ميلفوس هيلم</a> و <a href="https://helm.sh/docs/">هيلم</a>.</p>
<p>إذا كانت المعلمات التي تتوقع تعديلها غير موجودة في القائمة، يمكنك اتباع التعليمات أدناه.</p>
<p>في الخطوات التالية، سيتم تعديل المعلمة <code translate="no">rootcoord.dmlChannelNum</code> في <strong>/milvus/configs/advanced/root_coord.yaml</strong> لأغراض العرض التوضيحي. يتم تنفيذ إدارة ملف التكوين في Milvus على Kubernetes من خلال كائن مورد ConfigMap. لتغيير المعلمة، يجب عليك أولاً تحديث كائن ConfigMap لإصدار المخطط المقابل، ثم تعديل ملفات موارد النشر للقرون المقابلة.</p>
<p>احذر من أن هذه الطريقة تنطبق فقط على تعديل المعلمات على تطبيق Milvus الذي تم نشره. لتعديل المعلمات في <strong>/milvus/configs/advanced/*.yaml</strong> قبل النشر، ستحتاج إلى إعادة تطوير مخطط Milvus Helm.</p>
<h3 id="Modify-ConfigMap-YAML" class="common-anchor-header">تعديل YAML ConfigMap YAML</h3><p>كما هو موضح أدناه، يتوافق إصدار Milvus الذي يعمل على Kubernetes مع كائن ConfigMap بنفس اسم الإصدار. يتضمن قسم <code translate="no">data</code> من كائن ConfigMap التكوينات الموجودة في <strong>milvus.yaml</strong> فقط. لتغيير <code translate="no">rootcoord.dmlChannelNum</code> في <strong>root_coord.yaml،</strong> يجب عليك إضافة المعلمات في <strong>root_coord.yaml</strong> إلى القسم <code translate="no">data</code> في كائن ConfigMap YAML وتغيير المعلمة المحددة.</p>
<pre><code translate="no">kind: ConfigMap
apiVersion: v1
metadata:
  name: milvus-chaos
  ...
data:
  milvus.yaml: &gt;
    ......
  root_coord.yaml: |
    rootcoord:
      dmlChannelNum: 128
      maxPartitionNum: 4096
      minSegmentSizeToEnableIndex: 1024
      <span class="hljs-built_in">timeout</span>: 3600 <span class="hljs-comment"># time out, 5 seconds</span>
      timeTickInterval: 200 <span class="hljs-comment"># ms</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Modify-Deployment-YAML" class="common-anchor-header">تعديل YAML النشر</h3><p>يمكن الإشارة إلى البيانات المخزنة في ConfigMap في وحدة تخزين من نوع configMap ثم استهلاكها من قبل التطبيقات المعبأة في حاويات والتي تعمل في جراب. لتوجيه البودات إلى ملفات التكوين الجديدة، يجب عليك تعديل قوالب البودات التي تحتاج إلى تحميل التكوينات في <strong>root_coord.yaml</strong>. على وجه التحديد، تحتاج إلى إضافة إعلان تحميل ضمن قسم <code translate="no">spec.template.spec.containers.volumeMounts</code> في نشر YAML.</p>
<p>بأخذ YAML YAML للنشر في جراب rootcoord كمثال، يتم تحديد وحدة تخزين من نوع <code translate="no">configMap</code> باسم <strong>milvus-config</strong> في القسم <code translate="no">.spec.volumes</code>. وفي القسم <code translate="no">spec.template.spec.containers.volumeMounts</code> ، يتم الإعلان عن وحدة التخزين لتحميل <strong>milvus.yaml</strong> من إصدار Milvus الخاص بك على <strong>/milvus/configs/milvus.yaml</strong>. وبالمثل، تحتاج فقط إلى إضافة إعلان تحميل خاص لحاوية rootcoord لتحميل <strong>root_coord.yaml</strong> على <strong>/milvus/configs/advanced/root_coord.yaml،</strong> وبالتالي يمكن للحاوية الوصول إلى ملف التكوين الجديد.</p>
<pre><code translate="no" class="language-yaml">spec:
  replicas: 1
  selector:
    ......
  template:
    metadata:
      ...
    spec:
      volumes:
        - name: milvus-config
          configMap:
            name: milvus-chaos
            defaultMode: 420
      containers:
        - name: rootcoord
          image: <span class="hljs-string">&#x27;milvusdb/milvus-dev:master-20210906-86afde4&#x27;</span>
          args:
            ...
          ports:
            ...
          resources: {}
          volumeMounts:
            - name: milvus-config
              readOnly: <span class="hljs-literal">true</span>
              mountPath: /milvus/configs/milvus.yaml
              subPath: milvus.yaml
            - name: milvus-config
              readOnly: <span class="hljs-literal">true</span>
              mountPath: /milvus/configs/advanced/`root_coord.yaml
              subPath: root_coord.yaml
          terminationMessagePath: /dev/termination-log
          terminationMessagePolicy: File
          imagePullPolicy: IfNotPresent
      restartPolicy: Always
      terminationGracePeriodSeconds: 30
      dnsPolicy: ClusterFirst
      securityContext: {}
      schedulerName: default-scheduler
<button class="copy-code-btn"></button></code></pre>
<h3 id="Verify-the-result" class="common-anchor-header">التحقق من النتيجة</h3><p>يتحقق الكوبيت مما إذا كانت خريطة التكوين المثبتة حديثة في كل مزامنة دورية. عندما يتم تحديث خريطة التكوين المستهلكة في المجلد، يتم تحديث المفاتيح المتوقعة تلقائيًا أيضًا. عند تشغيل الكبسولة الجديدة مرة أخرى، يمكنك التحقق مما إذا كان التعديل ناجحًا في الكبسولة. يتم مشاركة الأوامر للتحقق من المعلمة <code translate="no">rootcoord.dmlChannelNum</code> أدناه.</p>
<pre><code translate="no" class="language-bash">$ kctl <span class="hljs-built_in">exec</span> -ti milvus-chaos-rootcoord-6f56794f5b-xp2zs -- sh
<span class="hljs-comment"># cd configs/advanced</span>
<span class="hljs-comment"># pwd</span>
/milvus/configs/advanced
<span class="hljs-comment"># ls</span>
channel.yaml  common.yaml  data_coord.yaml  data_node.yaml  etcd.yaml  proxy.yaml  query_node.yaml  root_coord.yaml
<span class="hljs-comment"># cat root_coord.yaml</span>
rootcoord:
  dmlChannelNum: 128
  maxPartitionNum: 4096
  minSegmentSizeToEnableIndex: 1024
  <span class="hljs-built_in">timeout</span>: 3600 <span class="hljs-comment"># time out, 5 seconds</span>
  timeTickInterval: 200 <span class="hljs-comment"># ms</span>
<span class="hljs-comment"># exit</span>
<button class="copy-code-btn"></button></code></pre>
<p>أعلاه هي طريقة تعديل التكوينات المتقدمة في Milvus المنشورة على Kubernetes. سيدمج الإصدار المستقبلي من Milvus جميع التكوينات في ملف واحد، وسيدعم تحديث التكوين عبر مخطط الدفة. ولكن قبل ذلك، آمل أن تساعدك هذه المقالة كحل مؤقت.</p>
<h2 id="Engage-with-our-open-source-community" class="common-anchor-header">تفاعل مع مجتمعنا مفتوح المصدر:<button data-href="#Engage-with-our-open-source-community" class="anchor-icon" translate="no">
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
<li><p>ابحث أو ساهم في Milvus على <a href="https://bit.ly/307b7jC">GitHub</a>.</p></li>
<li><p>تفاعل مع المجتمع عبر <a href="https://bit.ly/3qiyTEk">المنتدى</a>.</p></li>
<li><p>تواصل معنا على <a href="https://bit.ly/3ob7kd8">تويتر</a>.</p></li>
</ul>
