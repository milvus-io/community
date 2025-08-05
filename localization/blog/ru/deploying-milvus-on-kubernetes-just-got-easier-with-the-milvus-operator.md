---
id: deploying-milvus-on-kubernetes-just-got-easier-with-the-milvus-operator.md
title: Развертывание Milvus на Kubernetes стало еще проще с Milvus Operator
author: Min Yin
date: 2025-08-04T00:00:00.000Z
desc: >-
  Milvus Operator - это инструмент управления, основанный на Kubernetes, который
  автоматизирует полный жизненный цикл развертывания векторных баз данных
  Milvus.
cover: >-
  assets.zilliz.com/Deploying_Milvus_on_Kubernetes_Just_Got_Easier_with_the_Milvus_Operator_1f6f48e55c.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus Operator, Kubernetes, How to deploy Milvus on Kubernetes'
meta_title: |
  Deploy Milvus on K8s Just Got Easier with the Milvus Operator 
origin: >-
  https://milvus.io/blog/deploying-milvus-on-kubernetes-just-got-easier-with-the-milvus-operator.md
---
<p>Настройка готового к производству кластера Milvus не должна быть похожа на обезвреживание бомбы. Однако каждый, кто вручную настраивал развертывание Kubernetes для векторных баз данных, знает, что это такое: десятки YAML-файлов, сложное управление зависимостями и то чувство замирания, когда что-то ломается в два часа ночи, а вы не уверены, какой из 47 конфигурационных файлов является виновником.</p>
<p>Традиционный подход к развертыванию Milvus включает в себя оркестровку множества сервисов -etcd для хранения метаданных, Pulsar для очереди сообщений, MinIO для хранения объектов, а также самих компонентов Milvus. Каждая служба требует тщательной настройки, правильной последовательности запуска и постоянного обслуживания. Если масштабировать это на несколько сред или кластеров, то сложность эксплуатации станет непомерной.</p>
<p>Именно здесь <a href="https://github.com/zilliztech/milvus-operator"><strong>Milvus Operator</strong></a> кардинально меняет ситуацию. Вместо того чтобы управлять инфраструктурой вручную, вы описываете, что вам нужно, а Оператор решает, как это сделать.</p>
<h2 id="What-is-the-Milvus-Operator" class="common-anchor-header">Что такое Milvus Operator?<button data-href="#What-is-the-Milvus-Operator" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/install_cluster-milvusoperator.md"><strong>Milvus Operator</strong></a> - это инструмент управления на базе Kubernetes, который автоматизирует полный жизненный цикл развертывания векторных баз данных Milvus. Построенный на основе шаблона Kubernetes Operator, он включает в себя многолетние знания о работе Milvus в производстве и кодирует эти знания в программное обеспечение, которое работает вместе с вашим кластером.</p>
<p>Подумайте об этом, как о наличии эксперта-администратора Milvus, который никогда не спит, никогда не делает опечаток и прекрасно помнит каждую деталь конфигурации. Оператор постоянно следит за состоянием вашего кластера, автоматически принимает решения о масштабировании, управляет обновлениями без простоев и восстанавливается после сбоев быстрее, чем это мог бы сделать любой оператор.</p>
<p>По своей сути Оператор предоставляет четыре основные возможности.</p>
<ul>
<li><p><strong>Автоматизированное развертывание</strong>: Создайте полнофункциональный кластер Milvus с помощью одного манифеста.</p></li>
<li><p><strong>Управление жизненным циклом</strong>: Автоматизируйте обновление, горизонтальное масштабирование и уничтожение ресурсов в определенном, безопасном порядке.</p></li>
<li><p><strong>Встроенный мониторинг и проверка состояния</strong>: Постоянный мониторинг состояния компонентов Milvus и связанных с ними зависимостей, включая etcd, Pulsar и MinIO.</p></li>
<li><p><strong>Лучшие практики работы по умолчанию</strong>: Применяйте нативные шаблоны Kubernetes, которые обеспечивают надежность без необходимости глубокого знания платформы.</p></li>
</ul>
<h3 id="Understanding-the-Kubernetes-Operator-Pattern" class="common-anchor-header">Понимание паттерна Kubernetes Operator</h3><p>Прежде чем мы рассмотрим преимущества Milvus Operator, давайте разберемся в фундаменте, на котором он построен: <strong>паттерне Kubernetes Operator.</strong></p>
<p>Паттерн Kubernetes Operator помогает управлять сложными приложениями, которым требуется нечто большее, чем базовые функции Kubernetes. Оператор состоит из трех основных частей:</p>
<ul>
<li><p><strong>Пользовательские определения ресурсов</strong> позволяют описать приложение с помощью конфигурационных файлов в стиле Kubernetes.</p></li>
<li><p><strong>Контроллер</strong> следит за этими конфигурациями и вносит необходимые изменения в ваш кластер.</p></li>
<li><p><strong>Управление состоянием</strong> обеспечивает соответствие кластера запрошенным вами параметрам и устраняет любые различия.</p></li>
</ul>
<p>Это означает, что вы можете описать развертывание Milvus привычным способом, а Оператор выполняет всю детальную работу по созданию стручков, настройке сети и управлению жизненным циклом...</p>
<h2 id="How-the-Milvus-Operator-Works" class="common-anchor-header">Принцип работы Milvus Operator<button data-href="#How-the-Milvus-Operator-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Operator следует прямолинейному процессу, который значительно упрощает управление базой данных. Давайте разберем основную операционную модель Milvus Operator:</p>
<ol>
<li><p><strong>Пользовательский ресурс (CR):</strong> Пользователи определяют развертывание Milvus с помощью CR (например, kind: <code translate="no">Milvus</code>). Этот файл включает такие конфигурации, как режим кластера, версия образа, требования к ресурсам и зависимости.</p></li>
<li><p><strong>Логика контроллера:</strong> Контроллер оператора следит за новыми или обновленными CR. Обнаружив изменения, он организует создание необходимых компонентов - сервисов Milvus и зависимостей, таких как etcd, Pulsar и MinIO.</p></li>
<li><p><strong>Автоматизированное управление жизненным циклом:</strong> При возникновении изменений - обновлении версии или изменении хранилища - оператор выполняет скользящие обновления или перенастраивает компоненты, не нарушая работу кластера.</p></li>
<li><p><strong>Самовосстановление:</strong> Контроллер постоянно проверяет состояние каждого компонента. Если что-то выходит из строя, он автоматически заменяет капсулу или восстанавливает состояние службы, чтобы обеспечить работоспособность.</p></li>
</ol>
<p>Этот подход гораздо мощнее традиционных развертываний YAML или Helm, поскольку обеспечивает постоянное управление, а не только первоначальную настройку.</p>
<h2 id="Why-Use-Milvus-Operator-Instead-of-Helm-or-YAML" class="common-anchor-header">Почему стоит использовать Milvus Operator вместо Helm или YAML?<button data-href="#Why-Use-Milvus-Operator-Instead-of-Helm-or-YAML" class="anchor-icon" translate="no">
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
    </button></h2><p>При развертывании Milvus вы можете выбирать между ручными YAML-файлами, диаграммами Helm и Milvus Operator. Каждый из них имеет свое место, но Оператор предлагает значительные преимущества для текущих операций.</p>
<h3 id="Operation-Automation" class="common-anchor-header">Автоматизация операций</h3><p>Традиционные методы требуют ручной работы для выполнения рутинных задач. Масштабирование означает обновление нескольких конфигурационных файлов и координацию изменений. Модернизация требует тщательного планирования, чтобы избежать перебоев в обслуживании. Operator справляется с этими задачами автоматически. Он может определить, когда необходимо масштабирование, и безопасно выполнить изменения. Обновления превращаются в простые обновления конфигурации, которые оператор выполняет с соблюдением последовательности и возможностью отката при необходимости.</p>
<h3 id="Better-State-Visibility" class="common-anchor-header">Улучшенная видимость состояния</h3><p>Файлы YAML сообщают Kubernetes, что вам нужно, но они не показывают текущее состояние системы. Helm помогает управлять конфигурацией, но не отслеживает состояние приложения во время выполнения. Оператор постоянно следит за состоянием всего кластера. Он может обнаружить такие проблемы, как проблемы с ресурсами или медленные ответы, и принять меры до того, как они превратятся в серьезные проблемы. Такой проактивный мониторинг значительно повышает надежность.</p>
<h3 id="Easier-Long-term-Management" class="common-anchor-header">Более простое долгосрочное управление</h3><p>Управление несколькими средами с помощью файлов YAML означает синхронизацию множества конфигурационных файлов. Даже при использовании шаблонов Helm сложные операции все равно требуют значительной ручной координации.</p>
<p>Operator заключает знания об управлении Milvus в своем коде. Это означает, что команды могут эффективно управлять кластерами, не становясь экспертами в каждом компоненте. Операционный интерфейс остается неизменным при масштабировании инфраструктуры.</p>
<p>Использование Оператора означает выбор более автоматизированного подхода к управлению Milvus. Это сокращает объем ручной работы и повышает надежность благодаря встроенному опыту - неоценимые преимущества, поскольку векторные базы данных становятся все более важными для приложений.</p>
<h3 id="The-Architecture-of-Milvus-Operation" class="common-anchor-header">Архитектура Milvus Operation</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_operator_deployment_architecture_3ff8570480.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>На диаграмме хорошо видна структура развертывания Milvus Operator в кластере Kubernetes:</p>
<ul>
<li><p>Слева (синяя область): Основные компоненты Оператора, включая контроллер и Milvus-CRD.</p></li>
<li><p>Справа (зеленая область): Различные компоненты кластера Milvus, такие как Proxy, Coordinator и Node.</p></li>
<li><p>Центр (стрелки - "создание/управление"): Поток операций, показывающий, как Оператор управляет кластером Milvus.</p></li>
<li><p>Внизу (оранжевая область): Зависимые сервисы, такие как etcd и MinIO/S3/MQ.</p></li>
</ul>
<p>Эта визуальная структура с отдельными цветными блоками и направленными стрелками эффективно поясняет взаимодействие и поток данных между различными компонентами.</p>
<h2 id="Getting-Started-with-Milvus-Operator" class="common-anchor-header">Начало работы с Milvus Operator<button data-href="#Getting-Started-with-Milvus-Operator" class="anchor-icon" translate="no">
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
    </button></h2><p>В этом руководстве показано, как развернуть Milvus с помощью Operator. В этом руководстве мы будем использовать эти версии.</p>
<ul>
<li><p><strong>Операционная система</strong>: openEuler 22.03 LTS SP3 x86_64</p></li>
<li><p><strong>Kubernetes</strong>: v1.28.8</p></li>
<li><p><strong>Milvus</strong>: v2.5.4</p></li>
</ul>
<h3 id="1-Prerequisites" class="common-anchor-header">(1) Необходимые условия</h3><p>В вашем кластере Kubernetes должен быть настроен хотя бы один StorageClass. Вы можете проверить, что доступно:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> sc
<button class="copy-code-btn"></button></code></pre>
<p>В нашем примере у нас есть два варианта:</p>
<ul>
<li><p><code translate="no">local</code> (по умолчанию) - использует локальные диски</p></li>
<li><p><code translate="no">nfs-sc</code>- использует NFS-хранилище (подходит для тестирования, но в производстве не рекомендуется).</p></li>
</ul>
<pre><code translate="no">RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
<span class="hljs-built_in">local</span> (default)   openebs.io/local      Delete    WaitForFirstConsumer   <span class="hljs-literal">false</span>    284d
nfs-sc            k8s-sigs.io/nfs-...   Delete    Immediate              <span class="hljs-literal">false</span>    230d
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Installing-Milvus-Operator" class="common-anchor-header">(2) Установка Milvus Operator</h3><p>Оператор можно установить с помощью <a href="https://milvus.io/docs/install_cluster-milvusoperator.md#Install-with-Helm">Helm</a> или <a href="https://milvus.io/docs/install_cluster-milvusoperator.md#Install-with-kubectl">kubectl</a>. Мы будем использовать kubectl, так как он проще.</p>
<p>Загрузите манифест развертывания Operator:</p>
<pre><code translate="no">wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/zilliztech/milvus-operator/main/deploy/manifests/deployment.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>Замените адрес образа (необязательно):</p>
<p><strong>Необязательно: Используйте другой реестр образов</strong>, если у вас нет доступа к DockerHub или вы предпочитаете свой собственный реестр:</p>
<p><em>Примечание: Адрес репозитория образов, указанный здесь, предназначен для тестирования. При необходимости замените его на адрес вашего реального репозитория.</em></p>
<pre><code translate="no">sed -i <span class="hljs-string">&#x27;s#milvusdb/milvus-operator:v1.2.1#registry.milvus-mirror.cn/&amp;#g&#x27;</span> deployment.<span class="hljs-property">yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>Установите Milvus Operator:</p>
<pre><code translate="no">kubectl apply -f deployment.yaml
<button class="copy-code-btn"></button></code></pre>
<p>После установки вы должны увидеть вывод, подобный этому:</p>
<pre><code translate="no">namespace/milvus-operator created
serviceaccount/milvus-operator created
customresourcedefinition.apiextensions.k8s.io/milvusclusters.milvus.io created
customresourcedefinition.apiextensions.k8s.io/milvuses.milvus.io created
customresourcedefinition.apiextensions.k8s.io/milvusupgrades.milvus.io created
clusterrole.rbac.authorization.k8s.io/milvus-operator-manager-role created
clusterrolebinding.rbac.authorization.k8s.io/milvus-operator-manager-rolebinding created
role.rbac.authorization.k8s.io/milvus-operator-leader-election-role created
rolebinding.rbac.authorization.k8s.io/milvus-operator-leader-election-rolebinding created
service/milvus-operator-metrics-service created
service/milvus-operator-webhook-service created
deployment.apps/milvus-operator created
<button class="copy-code-btn"></button></code></pre>
<p>Проверьте развертывание Milvus Operator и ресурсы стручков:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> deployment,pod -n milvus-<span class="hljs-keyword">operator</span>
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">NAME                              READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/milvus-operator   1/1     1            1           10m
NAME                                   READY   STATUS        RESTARTS   AGE
pod/milvus-operator-54d4fb854b-7hprh   1/1     Running       0          97s
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Deploying-the-Milvus-Cluster" class="common-anchor-header">(3) Развертывание кластера Milvus</h3><p>После запуска стручка Milvus Operator можно развернуть кластер Milvus, выполнив следующие действия.</p>
<p>Загрузите манифест развертывания кластера Milvus:</p>
<pre><code translate="no">wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/zilliztech/milvus-operator/main/config/samples/milvus_cluster_default.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>Конфигурация по умолчанию минимальна:</p>
<pre><code translate="no"><span class="hljs-comment"># This is a sample to deploy a milvus cluster in milvus-operator&#x27;s default configurations.</span>
apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: my-release
  labels:
    app: milvus
spec:
  mode: cluster
  dependencies: {}
  components: {}
  config: {}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Для реального развертывания вы захотите ее настроить:</strong></p>
<ul>
<li><p>Пользовательское имя кластера: <code translate="no">milvus-release-v25</code></p></li>
<li><p>Custom Image: (чтобы использовать другой онлайн образ или локальный автономный образ). <code translate="no">registry.milvus-mirror.cn/milvusdb/milvus:v2.5.4</code></p></li>
<li><p>Пользовательское имя класса хранения: В средах с несколькими классами хранения вам может понадобиться указать класс хранения для постоянных компонентов, таких как MinIO и etcd. В данном примере используется <code translate="no">nfs-sc</code>.</p></li>
<li><p>Пользовательские ресурсы: Установите ограничения на процессор и память для компонентов Milvus. По умолчанию лимиты не задаются, что может привести к перегрузке узлов Kubernetes.</p></li>
<li><p>Автоматическое удаление связанных ресурсов: По умолчанию при удалении кластера Milvus связанные с ним ресурсы сохраняются.</p></li>
</ul>
<p>Для дополнительной настройки параметров см:</p>
<ul>
<li><p><a href="https://github.com/zilliztech/milvus-operator/blob/main/docs/CRD/milvus.md">Milvus Custom Resource Definition</a></p></li>
<li><p><a href="https://artifacthub.io/packages/helm/apache/pulsar/3.3.0?modal=values">Значения Pulsar</a></p></li>
</ul>
<p>Измененный манифест выглядит следующим образом:</p>
<pre><code translate="no">apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: milvus-release-v25
  labels:
    app: milvus
spec:
  mode: cluster
  config: {}
  components:
    image: registry.milvus-mirror.cn/milvusdb/milvus:v2.5.4
    resources:
      limits:
        cpu: 2
        memory: 8Gi
  dependencies:
    etcd:
      inCluster:
        deletionPolicy: Delete
        pvcDeletion: <span class="hljs-literal">true</span>
        values:
          global:
            imageRegistry: registry.milvus-mirror.cn
            storageClass: nfs-sc
    storage:
      inCluster:
        deletionPolicy: Delete
        pvcDeletion: <span class="hljs-literal">true</span>
        values:
          resources:
            limits:
              cpu: 2
              memory: 8Gi
          image:
            repository: registry.milvus-mirror.cn/milvusdb/minio
            tag: RELEASE.2023-03-20T20-16-18Z
          persistence:
            storageClass: nfs-sc
            accessMode: ReadWriteOnce
            size: 10Gi
    pulsar:
      inCluster:
        chartVersion: pulsar-v3
        deletionPolicy: Delete
        pvcDeletion: <span class="hljs-literal">true</span>
        values:
          existingStorageClassName: nfs-sc
          pulsar_metadata:
            image:
              repository: registry.milvus-mirror.cn/apachepulsar/pulsar
              tag: 3.0.7
          zookeeper:
            replicaCount: 3
            volumes:
              data:
                size: 5Gi
                storageClassName: nfs-sc
          bookkeeper:
            volumes:
              journal:
                size: 5Gi
                storageClassName: nfs-sc
              ledgers:
                size: 5Gi
                storageClassName: nfs-sc
          images:
            zookeeper:
              repository: registry.milvus-mirror.cn/apachepulsar/pulsar
              tag: 3.0.7
            proxy:
              repository: registry.milvus-mirror.cn/apachepulsar/pulsar
              tag: 3.0.7
            broker:
              repository: registry.milvus-mirror.cn/apachepulsar/pulsar
              tag: 3.0.7
            bookie:
              repository: registry.milvus-mirror.cn/apachepulsar/pulsar
              tag: 3.0.7
            autorecovery:
              repository: registry.milvus-mirror.cn/apachepulsar/pulsar
              tag: 3.0.7
<button class="copy-code-btn"></button></code></pre>
<p>Разверните кластер Milvus:</p>
<pre><code translate="no">kubectl apply -f milvus_cluster_default.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Verifying-Milvus-Cluster-Status" class="common-anchor-header">Проверка состояния кластера Milvus</h4><p>Milvus Operator сначала устанавливает зависимости промежуточного ПО для Milvus - такие как etcd, Zookeeper, Pulsar и MinIO - перед развертыванием компонентов Milvus (например, прокси, координатора и узлов).</p>
<p>Посмотреть развертывания:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> deployment
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">NAME                                    READY   UP-TO-DATE   AVAILABLE   AGE
milvus-release-v25-milvus-datanode      1/1     1            1           52m
milvus-release-v25-milvus-indexnode     1/1     1            1           52m
milvus-release-v25-milvus-mixcoord      1/1     1            1           52m
milvus-release-v25-milvus-proxy         1/1     1            1           52m
milvus-release-v25-milvus-querynode-0   1/1     1            1           52m
milvus-release-v25-milvus-querynode-1   0/0     0            0           52m
milvus-release-v25-milvus-standalone    0/0     0            0           52m
<button class="copy-code-btn"></button></code></pre>
<p>Особое замечание:</p>
<p>Вы можете заметить, что Milvus Operator создает развертывание <code translate="no">standalone</code> и <code translate="no">querynode-1</code> с 0 репликами.</p>
<p>Это сделано намеренно. Мы отправили проблему в репозиторий Milvus Operator, и вот официальный ответ:</p>
<ul>
<li><p>a. Развертывания работают так, как ожидалось. Автономная версия сохраняется, чтобы обеспечить плавный переход от кластера к автономному развертыванию без прерывания обслуживания.</p></li>
<li><p>b. Наличие обеих версий <code translate="no">querynode-0</code> и <code translate="no">querynode-1</code> полезно при скользящих обновлениях. В конце концов, только один из них будет активен.</p></li>
</ul>
<h4 id="Verifying-That-All-Pods-Are-Running-Correctly" class="common-anchor-header">Проверка правильности работы всех подсистем</h4><p>Когда ваш кластер Milvus готов, проверьте, что все подсистемы работают так, как ожидалось:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> pods
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">NAME                                                    READY   STATUS      RESTARTS        AGE
milvus-release-v25-etcd<span class="hljs-number">-0</span>                               <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m15s
milvus-release-v25-etcd<span class="hljs-number">-1</span>                               <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m15s
milvus-release-v25-etcd<span class="hljs-number">-2</span>                               <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m15s
milvus-release-v25-milvus-datanode<span class="hljs-number">-65b</span>ff7b4d9<span class="hljs-number">-9</span>h2xv     <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">4</span>m35s
milvus-release-v25-milvus-indexnode<span class="hljs-number">-5b</span>5cbb4cdc-cxvwj    <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">4</span>m35s
milvus-release-v25-milvus-mixcoord<span class="hljs-number">-64488898b</span>5-r76rw     <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">4</span>m35s
milvus-release-v25-milvus-proxy<span class="hljs-number">-5</span>c7fbcb69-cqmq4         <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">4</span>m35s
milvus-release-v25-milvus-querynode<span class="hljs-number">-0</span>-bc6f57d64-k2wnt   <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">4</span>m35s
milvus-release-v25-minio<span class="hljs-number">-0</span>                              <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m14s
milvus-release-v25-minio<span class="hljs-number">-1</span>                              <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m14s
milvus-release-v25-minio<span class="hljs-number">-2</span>                              <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m14s
milvus-release-v25-minio<span class="hljs-number">-3</span>                              <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m14s
milvus-release-v25-pulsar-bookie<span class="hljs-number">-0</span>                      <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-bookie<span class="hljs-number">-1</span>                      <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-bookie<span class="hljs-number">-2</span>                      <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-bookie-<span class="hljs-keyword">init</span><span class="hljs-number">-5</span>zf2z             <span class="hljs-number">0</span>/<span class="hljs-number">1</span>     Completed   <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-broker<span class="hljs-number">-0</span>                      <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-broker<span class="hljs-number">-1</span>                      <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-proxy<span class="hljs-number">-0</span>                       <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-proxy<span class="hljs-number">-1</span>                       <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-pulsar-<span class="hljs-keyword">init</span>-twznd             <span class="hljs-number">0</span>/<span class="hljs-number">1</span>     Completed   <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-recovery<span class="hljs-number">-0</span>                    <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">1</span> (<span class="hljs-number">6</span>m25s ago)   <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-zookeeper<span class="hljs-number">-0</span>                   <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-zookeeper<span class="hljs-number">-1</span>                   <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-zookeeper<span class="hljs-number">-2</span>                   <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
<button class="copy-code-btn"></button></code></pre>
<h4 id="Verifying-the-StorageClass" class="common-anchor-header">Проверка класса хранилища</h4><p>Убедитесь, что ваш пользовательский StorageClass (<code translate="no">nfs-sc</code>) и указанные объемы хранения были применены правильно:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> pvc
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-variable constant_">NAME</span>                                                                             <span class="hljs-variable constant_">STATUS</span>   <span class="hljs-variable constant_">VOLUME</span>                                     <span class="hljs-variable constant_">CAPACITY</span>   <span class="hljs-variable constant_">ACCESS</span> <span class="hljs-variable constant_">MODES</span>   <span class="hljs-variable constant_">STORAGECLASS</span>   <span class="hljs-variable constant_">AGE</span>
data-milvus-release-v25-etcd-<span class="hljs-number">0</span>                                                   <span class="hljs-title class_">Bound</span>    pvc-3273f9ec-819f-<span class="hljs-number">4e84</span>-bdbe-3cd9df697a5f   10Gi       <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
data-milvus-release-v25-etcd-<span class="hljs-number">1</span>                                                   <span class="hljs-title class_">Bound</span>    pvc-01743e13-a989-4aea-8fd0-632ea8b13f98   10Gi       <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
data-milvus-release-v25-etcd-<span class="hljs-number">2</span>                                                   <span class="hljs-title class_">Bound</span>    pvc-594f1a63-efba-<span class="hljs-number">4993</span>-<span class="hljs-number">89e6</span>-3ee5e333073d   10Gi       <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
<span class="hljs-keyword">export</span>-milvus-release-v25-minio-<span class="hljs-number">0</span>                                                <span class="hljs-title class_">Bound</span>    pvc-477d4e3b-69d7-4bbe-80f7-b747dc4c79f7   10Gi       <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
<span class="hljs-keyword">export</span>-milvus-release-v25-minio-<span class="hljs-number">1</span>                                                <span class="hljs-title class_">Bound</span>    pvc-b12e46fa-8d29-48fb-9ac1-98f80d67b543   10Gi       <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
<span class="hljs-keyword">export</span>-milvus-release-v25-minio-<span class="hljs-number">2</span>                                                <span class="hljs-title class_">Bound</span>    pvc-2e67893e-<span class="hljs-number">9611</span>-43dd-<span class="hljs-number">9550</span>-b3a7705699ae   10Gi       <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
<span class="hljs-keyword">export</span>-milvus-release-v25-minio-<span class="hljs-number">3</span>                                                <span class="hljs-title class_">Bound</span>    pvc-572c4565-bc38-<span class="hljs-number">4215</span>-a13c-061d9199fdea   10Gi       <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-bookie-journal-milvus-release-v25-pulsar-bookie-<span class="hljs-number">0</span>      <span class="hljs-title class_">Bound</span>    pvc-183eff99-7a87-406d-9f17-b0fb30c7c0b3   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-bookie-journal-milvus-release-v25-pulsar-bookie-<span class="hljs-number">1</span>      <span class="hljs-title class_">Bound</span>    pvc-ebe32304-7d92-44d1-b6fb-4cbaf3207d25   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-bookie-journal-milvus-release-v25-pulsar-bookie-<span class="hljs-number">2</span>      <span class="hljs-title class_">Bound</span>    pvc-2ead9186-3d44-4faa-9ae7-784be7ecf6d2   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-bookie-ledgers-milvus-release-v25-pulsar-bookie-<span class="hljs-number">0</span>      <span class="hljs-title class_">Bound</span>    pvc-ff1b632d-0a66-4c13-a3bb-2550f9307614   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-bookie-ledgers-milvus-release-v25-pulsar-bookie-<span class="hljs-number">1</span>      <span class="hljs-title class_">Bound</span>    pvc-<span class="hljs-number">57159e85</span>-bb48-48a9-<span class="hljs-number">9706</span>-7a95af8da157   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-bookie-ledgers-milvus-release-v25-pulsar-bookie-<span class="hljs-number">2</span>      <span class="hljs-title class_">Bound</span>    pvc-eb235f29-afbd-4a40-9a7d-0340a9686053   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-zookeeper-data-milvus-release-v25-pulsar-zookeeper-<span class="hljs-number">0</span>   <span class="hljs-title class_">Bound</span>    pvc-<span class="hljs-number">40e02974</span>-3b7d-4f42-bfa7-3252b7615a36   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-zookeeper-data-milvus-release-v25-pulsar-zookeeper-<span class="hljs-number">1</span>   <span class="hljs-title class_">Bound</span>    pvc-<span class="hljs-number">75904229</span>-3bbf-458e-b0e3-3982e430621b   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-zookeeper-data-milvus-release-v25-pulsar-zookeeper-<span class="hljs-number">2</span>   <span class="hljs-title class_">Bound</span>    pvc-2e068b79-75ac-4aa9-<span class="hljs-number">9e90</span>-423ff399bad0   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
<button class="copy-code-btn"></button></code></pre>
<h4 id="Verifying-Milvus-Resource-Limits" class="common-anchor-header">Проверка лимитов ресурсов Milvus</h4><p>Например, чтобы проверить, что ограничения ресурсов для компонента <code translate="no">mixcoord</code> были применены правильно, выполните команду:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> deployment milvus-release-v25-milvus-mixcoord -o jsonpath=<span class="hljs-string">&#x27;{.spec.template.spec.containers[*].resources.limits}&#x27;</span> | jq
{
  <span class="hljs-string">&quot;cpu&quot;</span>: <span class="hljs-string">&quot;2&quot;</span>,
  <span class="hljs-string">&quot;memory&quot;</span>: <span class="hljs-string">&quot;8Gi&quot;</span>
}
<button class="copy-code-btn"></button></code></pre>
<h4 id="Verifying-the-Custom-Image" class="common-anchor-header">Проверка пользовательского образа</h4><p>Убедитесь, что используется правильный пользовательский образ:</p>
<pre><code translate="no">kubectl get deployment milvus-release-v25-milvus-mixcoord -o jsonpath=<span class="hljs-string">&#x27;{.spec.template.spec.containers[0].image}&#x27;</span>
registry.milvus-mirror.cn/milvusdb/milvus:v2.5.4
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Accessing-Your-Cluster-from-Outside" class="common-anchor-header">(4) Доступ к вашему кластеру извне</h3><p>Часто задают вопрос: как получить доступ к службам Milvus извне кластера Kubernetes?</p>
<p>По умолчанию служба Milvus, развернутая оператором, имеет тип <code translate="no">ClusterIP</code>, что означает, что она доступна только внутри кластера. Чтобы открыть его извне, необходимо определить метод внешнего доступа. В этом руководстве выбран самый простой подход: использование NodePort.</p>
<p>Создайте и отредактируйте манифест службы для внешнего доступа:</p>
<pre><code translate="no">vi milvus-external-svc.yaml
<button class="copy-code-btn"></button></code></pre>
<p>Включите следующее содержимое:</p>
<pre><code translate="no">kind: Service
apiVersion: v1
metadata:
  name: milvus-release-v25-external-svc
  namespace: default
  labels:
    app: dmilvus-release-v25-external-svc
spec:
  ports:
    - name: milvus
      protocol: TCP
      port: 19530
      targetPort: 19530
      nodePort: 31530
    - name: milvus-web
      protocol: TCP
      port: 9091
      targetPort: 9091
      nodePort: 31531
  selector:
    app.kubernetes.io/component: proxy
    app.kubernetes.io/instance: milvus-release-v25
    app.kubernetes.io/name: milvus
  clusterIP:
  <span class="hljs-built_in">type</span>: NodePort
<button class="copy-code-btn"></button></code></pre>
<ol>
<li>Примените манифест внешнего сервиса:</li>
</ol>
<pre><code translate="no">kubectl apply -f milvus-external-svc.yaml
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>Проверьте состояние внешнего сервиса:</li>
</ol>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> svc
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">NAME                                  TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)                                                       AGE
milvus-release-v25-external-svc       NodePort    <span class="hljs-number">10.233</span><span class="hljs-number">.8</span><span class="hljs-number">.166</span>    &lt;none&gt;        <span class="hljs-number">19530</span>:<span class="hljs-number">31530</span>/TCP,<span class="hljs-number">9091</span>:<span class="hljs-number">31531</span>/TCP                                43s
milvus-release-v25-etcd               ClusterIP   <span class="hljs-number">10.233</span><span class="hljs-number">.27</span><span class="hljs-number">.134</span>   &lt;none&gt;        <span class="hljs-number">2379</span>/TCP,<span class="hljs-number">2380</span>/TCP                                             16m
milvus-release-v25-etcd-headless      ClusterIP   <span class="hljs-literal">None</span>            &lt;none&gt;        <span class="hljs-number">2379</span>/TCP,<span class="hljs-number">2380</span>/TCP                                             16m
milvus-release-v25-milvus             ClusterIP   <span class="hljs-number">10.233</span><span class="hljs-number">.55</span><span class="hljs-number">.194</span>   &lt;none&gt;        <span class="hljs-number">19530</span>/TCP,<span class="hljs-number">9091</span>/TCP                                            13m
milvus-release-v25-minio              ClusterIP   <span class="hljs-number">10.233</span><span class="hljs-number">.1</span><span class="hljs-number">.56</span>     &lt;none&gt;        <span class="hljs-number">9000</span>/TCP                                                      16m
milvus-release-v25-minio-svc          ClusterIP   <span class="hljs-literal">None</span>            &lt;none&gt;        <span class="hljs-number">9000</span>/TCP                                                      16m
milvus-release-v25-pulsar-bookie      ClusterIP   <span class="hljs-literal">None</span>            &lt;none&gt;        <span class="hljs-number">3181</span>/TCP,<span class="hljs-number">8000</span>/TCP                                             16m
milvus-release-v25-pulsar-broker      ClusterIP   <span class="hljs-literal">None</span>            &lt;none&gt;        <span class="hljs-number">8080</span>/TCP,<span class="hljs-number">6650</span>/TCP                                             16m
milvus-release-v25-pulsar-proxy       ClusterIP   <span class="hljs-number">10.233</span><span class="hljs-number">.30</span><span class="hljs-number">.132</span>   &lt;none&gt;        <span class="hljs-number">80</span>/TCP,<span class="hljs-number">6650</span>/TCP                                               16m
milvus-release-v25-pulsar-recovery    ClusterIP   <span class="hljs-literal">None</span>            &lt;none&gt;        <span class="hljs-number">8000</span>/TCP                                                      16m
milvus-release-v25-pulsar-zookeeper   ClusterIP   <span class="hljs-literal">None</span>            &lt;none&gt;        <span class="hljs-number">8000</span>/TCP,<span class="hljs-number">2888</span>/TCP,<span class="hljs-number">3888</span>/TCP,<span class="hljs-number">2181</span>/TCP                           16m
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li>Доступ к Milvus WebUI</li>
</ol>
<p>Milvus предоставляет встроенный графический интерфейс - Milvus WebUI - который улучшает наблюдаемость благодаря интуитивно понятному интерфейсу. С его помощью можно отслеживать метрики для компонентов Milvus и их зависимостей, просматривать подробную информацию о базах данных и коллекциях, а также проверять все детали конфигурации. Для получения дополнительной информации обратитесь к <a href="https://milvus.io/docs/milvus-webui.md">официальной документации Milvus WebUI</a>.</p>
<p>После развертывания откройте в браузере следующий URL (замените <code translate="no">&lt;any_k8s_node_IP&gt;</code> на IP-адрес любого узла Kubernetes):</p>
<p><code translate="no">http://&lt;any_k8s_node_IP&gt;:31531/webui/</code></p>
<p>Это приведет к запуску интерфейса WebUI.</p>
<h2 id="Conclusion" class="common-anchor-header">Заключение<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Milvus Operator</strong> - это не просто инструмент развертывания, это стратегическая инвестиция в операционное совершенство инфраструктуры векторных баз данных. Автоматизируя рутинные задачи и внедряя лучшие практики в среду Kubernetes, он позволяет командам сосредоточиться на главном: создании и совершенствовании приложений, управляемых искусственным интеллектом.</p>
<p>Внедрение системы управления на основе операторов требует некоторых предварительных усилий, включая изменение рабочих процессов и командных процессов. Но для организаций, работающих в масштабе или планирующих это сделать, долгосрочные выгоды будут значительными: повышение надежности, снижение операционных издержек и более быстрые и последовательные циклы развертывания.</p>
<p>По мере того как искусственный интеллект становится основой современных бизнес-операций, потребность в надежной, масштабируемой инфраструктуре векторных баз данных только возрастает. Milvus Operator поддерживает эту эволюцию, предлагая зрелый, ориентированный на автоматизацию подход, который масштабируется вместе с рабочей нагрузкой и адаптируется к вашим конкретным потребностям.</p>
<p>Если ваша команда сталкивается с операционными сложностями, ожидает роста или просто хочет сократить ручное управление инфраструктурой, раннее внедрение Milvus Operator поможет избежать будущих технических долгов и повысить общую устойчивость системы.</p>
<p>Будущее инфраструктуры - это интеллект, автоматизация и удобство для разработчиков. <strong>Milvus Operator открывает это будущее для уровня баз данных уже сегодня.</strong></p>
<hr>
