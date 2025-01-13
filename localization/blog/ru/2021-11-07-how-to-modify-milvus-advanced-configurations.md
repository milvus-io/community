---
id: 2021-11-07-how-to-modify-milvus-advanced-configurations.md
title: Как изменить расширенные конфигурации Milvus
author: Zilliz
date: 2021-11-08T00:00:00.000Z
desc: 'Как изменить конфигурацию Milvus, развернутого на Kubernetes'
cover: assets.zilliz.com/modify_4d93b9da3a.png
tag: Engineering
---
<p><em>Юфен Цонг, инженер по разработке тестов Zilliz, окончила Хуачжунский университет науки и технологий со степенью магистра в области компьютерных технологий. В настоящее время она занимается обеспечением качества векторной базы данных Milvus, включая, помимо прочего, тестирование интеграции интерфейсов, тестирование SDK, тестирование бенчмарков и т. д. Юфэн с энтузиазмом занимается решением проблем, связанных с тестированием и разработкой Milvus, а также является большим поклонником теории хаос-инженерии и практики бурения неисправностей.</em></p>
<h2 id="Background" class="common-anchor-header">Справочная информация<button data-href="#Background" class="anchor-icon" translate="no">
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
    </button></h2><p>При использовании векторной базы данных Milvus вам потребуется изменить конфигурацию по умолчанию, чтобы удовлетворить требования различных сценариев. Ранее один из пользователей Milvus рассказывал о том <a href="/blog/ru/2021-10-22-apply-configuration-changes-on-milvus-2.md">, как изменить конфигурацию Milvus, развернутого с помощью Docker Compose</a>. А в этой статье я хочу поделиться с вами тем, как изменить конфигурацию Milvus, развернутого на Kubernetes.</p>
<h2 id="Modify-configuration-of-Milvus-on-Kubernetes" class="common-anchor-header">Изменение конфигурации Milvus на Kubernetes<button data-href="#Modify-configuration-of-Milvus-on-Kubernetes" class="anchor-icon" translate="no">
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
    </button></h2><p>Вы можете выбрать различные планы модификации в зависимости от параметров конфигурации, которые вы хотите изменить. Все файлы конфигурации Milvus хранятся в папке <strong>milvus/configs</strong>. При установке Milvus на Kubernetes локально будет добавлен репозиторий Milvus Helm Chart. Запустив <code translate="no">helm show values milvus/milvus</code>, вы можете проверить параметры, которые можно изменить непосредственно с помощью Chart. Для параметров, которые можно изменить с помощью Chart, можно передать параметр с помощью <code translate="no">--values</code> или <code translate="no">--set</code>. Дополнительные сведения см. в разделах <a href="https://artifacthub.io/packages/helm/milvus/milvus">Milvus Helm Chart</a> и <a href="https://helm.sh/docs/">Helm</a>.</p>
<p>Если параметров, которые вы хотите изменить, нет в списке, вы можете следовать приведенной ниже инструкции.</p>
<p>В следующих шагах в демонстрационных целях будет изменен параметр <code translate="no">rootcoord.dmlChannelNum</code> в файле <strong>/milvus/configs/advanced/root_coord.yaml</strong>. Управление файлами конфигурации Milvus на Kubernetes реализовано через объект ресурса ConfigMap. Чтобы изменить параметр, необходимо сначала обновить объект ConfigMap соответствующего релиза Chart, а затем изменить файлы ресурсов развертывания соответствующих капсул.</p>
<p>Обратите внимание, что этот метод применим только для изменения параметров развернутого приложения Milvus. Чтобы изменить параметры в <strong>/milvus/configs/advanced/*.yaml</strong> перед развертыванием, вам придется заново разработать Milvus Helm Chart.</p>
<h3 id="Modify-ConfigMap-YAML" class="common-anchor-header">Изменение ConfigMap YAML</h3><p>Как показано ниже, вашему релизу Milvus, запущенному на Kubernetes, соответствует объект ConfigMap с тем же именем, что и у релиза. Раздел <code translate="no">data</code> объекта ConfigMap включает только конфигурации в <strong>milvus.yaml</strong>. Чтобы изменить <code translate="no">rootcoord.dmlChannelNum</code> в <strong>root_coord.yaml</strong>, необходимо добавить параметры из <strong>root_coord.yaml</strong> в раздел <code translate="no">data</code> в ConfigMap YAML и изменить конкретный параметр.</p>
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
<h3 id="Modify-Deployment-YAML" class="common-anchor-header">Изменение YAML развертывания</h3><p>На данные, хранящиеся в ConfigMap, можно ссылаться в томе типа configMap и затем потреблять их контейнерными приложениями, запущенными в стручке. Чтобы направить стручки к новым конфигурационным файлам, необходимо изменить шаблоны стручков, которые должны загружать конфигурации в <strong>root_coord.yaml</strong>. В частности, нужно добавить объявление монтирования в раздел <code translate="no">spec.template.spec.containers.volumeMounts</code> в YAML развертывания.</p>
<p>Если взять в качестве примера YAML развертывания стручка rootcoord, то в секции <code translate="no">.spec.volumes</code> указан том типа <code translate="no">configMap</code> с именем <strong>milvus-config</strong>. А в секции <code translate="no">spec.template.spec.containers.volumeMounts</code> объявлено, что том будет монтировать <strong>milvus.yaml</strong> вашего релиза Milvus в <strong>/milvus/configs/milvus.yaml</strong>. Аналогично, вам нужно только добавить объявление монтирования специально для контейнера rootcoord, чтобы смонтировать <strong>root_coord.yaml</strong> в <strong>/milvus/configs/advanced/root_coord.yaml</strong>, и таким образом контейнер сможет получить доступ к новому файлу конфигурации.</p>
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
<h3 id="Verify-the-result" class="common-anchor-header">Проверка результата</h3><p>Куплет проверяет свежесть смонтированной ConfigMap при каждой периодической синхронизации. При обновлении ConfigMap, хранящейся в томе, автоматически обновляются и проецируемые ключи. Когда новый pod снова будет запущен, вы сможете проверить, успешно ли прошла модификация в pod. Команды для проверки параметра <code translate="no">rootcoord.dmlChannelNum</code> приведены ниже.</p>
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
<p>Выше приведен способ изменения расширенных конфигураций в Milvus, развернутом на Kubernetes. В будущем выпуске Milvus все конфигурации будут объединены в один файл и будет поддерживаться обновление конфигурации через helm chart. Но до этого, я надеюсь, эта статья поможет вам в качестве временного решения.</p>
<h2 id="Engage-with-our-open-source-community" class="common-anchor-header">Присоединяйтесь к нашему сообществу разработчиков с открытым исходным кодом:<button data-href="#Engage-with-our-open-source-community" class="anchor-icon" translate="no">
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
<li><p>Найдите Milvus на <a href="https://bit.ly/307b7jC">GitHub</a> или внесите в него свой вклад.</p></li>
<li><p>Взаимодействуйте с сообществом через <a href="https://bit.ly/3qiyTEk">форум</a>.</p></li>
<li><p>Общайтесь с нами в <a href="https://bit.ly/3ob7kd8">Twitter</a>.</p></li>
</ul>
