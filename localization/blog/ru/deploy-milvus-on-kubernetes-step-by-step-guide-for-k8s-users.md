---
id: deploy-milvus-on-kubernetes-step-by-step-guide-for-k8s-users.md
title: >-
  Развертывание Milvus на Kubernetes: Пошаговое руководство для пользователей
  Kubernetes
author: Gael Gu
date: 2024-09-26T00:00:00.000Z
desc: >-
  В этом руководстве вы найдете четкое пошаговое описание настройки Milvus на
  Kubernetes с помощью Milvus Operator.
cover: >-
  assets.zilliz.com/Deploying_Milvus_on_Kubernetes_A_Step_by_Step_Guide_for_Kubernetes_Users_4193487867.png
tag: Engineering
tags: 'Vector Databases, Milvus, RAG, LLM, K8s Deployment'
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/deploy-milvus-on-kubernetes-step-by-step-guide-for-k8s-users.md
---
<p><a href="https://zilliz.com/what-is-milvus"><strong>Milvus</strong></a> - это <a href="https://zilliz.com/learn/what-is-vector-database">векторная база данных</a> с открытым исходным кодом, предназначенная для хранения, индексации и поиска огромных объемов <a href="https://zilliz.com/learn/introduction-to-unstructured-data">неструктурированных данных</a> с помощью векторных представлений, что делает ее идеальной для приложений, основанных на искусственном интеллекте, таких как поиск по сходству, <a href="https://zilliz.com/glossary/semantic-search">семантический поиск</a>, поиск с расширенной генерацией<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">(RAG</a>), рекомендательные системы и другие задачи машинного обучения.</p>
<p>Но что делает Milvus еще более мощным, так это его бесшовная интеграция с Kubernetes. Если вы являетесь поклонником Kubernetes, то знаете, что эта платформа идеально подходит для оркестровки масштабируемых распределенных систем. Milvus в полной мере использует возможности Kubernetes, позволяя вам легко развертывать, масштабировать и управлять распределенными кластерами Milvus. В этом руководстве вы найдете четкий пошаговый инструктаж по настройке Milvus на Kubernetes с помощью Milvus Operator.</p>
<h2 id="Prerequisites" class="common-anchor-header">Предварительные условия<button data-href="#Prerequisites" class="anchor-icon" translate="no">
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
    </button></h2><p>Прежде чем мы начнем, убедитесь, что у вас есть следующие необходимые условия:</p>
<ul>
<li><p>Запущенный кластер Kubernetes. Если вы проводите тестирование локально, отлично подойдет <code translate="no">minikube</code>.</p></li>
<li><p><code translate="no">kubectl</code> Установлен и настроен для взаимодействия с кластером Kubernetes.</p></li>
<li><p>Знакомство с основными концепциями Kubernetes, такими как поды, сервисы и развертывания.</p></li>
</ul>
<h2 id="Step-1-Installing-Minikube-For-Local-Testing" class="common-anchor-header">Шаг 1: Установка Minikube (для локального тестирования)<button data-href="#Step-1-Installing-Minikube-For-Local-Testing" class="anchor-icon" translate="no">
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
    </button></h2><p>Если вам нужно создать локальную среду Kubernetes, вам подойдет инструмент <code translate="no">minikube</code>. Официальные инструкции по установке находятся на <a href="https://minikube.sigs.k8s.io/docs/start/">странице начала работы с minikube</a>.</p>
<h3 id="1-Install-Minikube" class="common-anchor-header">1. Установите Minikube</h3><p>Перейдите на<a href="https://github.com/kubernetes/minikube/releases"> страницу релизов minikube</a> и загрузите подходящую версию для вашей операционной системы. Для macOS/Linux вы можете использовать следующую команду:</p>
<pre><code translate="no">$ curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
$ <span class="hljs-built_in">sudo</span> install minikube-linux-amd64 /usr/local/bin/minikube &amp;&amp; <span class="hljs-built_in">rm</span> minikube-linux-amd64
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Start-Minikube" class="common-anchor-header">2. Запустите Minikube</h3><pre><code translate="no">$ minikube start
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Interact-with-Cluster" class="common-anchor-header">3. Взаимодействие с кластером</h3><p>Теперь вы можете взаимодействовать с вашими кластерами с помощью kubectl внутри minikube. Если вы не установили kubectl, minikube загрузит соответствующую версию по умолчанию.</p>
<pre><code translate="no">$ minikube kubectl cluster-info
<button class="copy-code-btn"></button></code></pre>
<p>В качестве альтернативы вы можете создать символическую ссылку на двоичный файл minikube с именем <code translate="no">kubectl</code> для более удобного использования.</p>
<pre><code translate="no">$ <span class="hljs-built_in">sudo</span> <span class="hljs-built_in">ln</span> -s $(<span class="hljs-built_in">which</span> minikube) /usr/local/bin/kubectl
$ kubectl cluster-info
<button class="copy-code-btn"></button></code></pre>
<h2 id="Step-2-Configuring-the-StorageClass" class="common-anchor-header">Шаг 2: Настройка класса хранилища<button data-href="#Step-2-Configuring-the-StorageClass" class="anchor-icon" translate="no">
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
    </button></h2><p>В Kubernetes <strong>класс StorageClass</strong> определяет типы хранилищ, доступных для рабочих нагрузок, обеспечивая гибкость в управлении различными конфигурациями хранилищ. Прежде чем приступить к работе, необходимо убедиться, что в вашем кластере доступен StorageClass по умолчанию. Ниже описано, как проверить и при необходимости настроить его.</p>
<h3 id="1-Check-Installed-StorageClasses" class="common-anchor-header">1. Проверка установленных классов хранения</h3><p>Чтобы увидеть доступные StorageClasses в кластере Kubernetes, выполните следующую команду:</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> sc
<button class="copy-code-btn"></button></code></pre>
<p>В результате будет отображен список классов хранения, установленных в вашем кластере. Если класс хранения по умолчанию уже настроен, он будет отмечен символом <code translate="no">(default)</code>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/storage_classes_installed_in_your_cluster_21d36d6ac8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Configure-a-Default-StorageClass-if-necessary" class="common-anchor-header">2. Настройте класс хранения по умолчанию (если необходимо).</h3><p>Если класс хранения по умолчанию не задан, его можно создать, определив в файле YAML. Используйте следующий пример для создания класса хранения по умолчанию:</p>
<pre><code translate="no"><span class="hljs-attr">apiVersion</span>: storage.<span class="hljs-property">k8s</span>.<span class="hljs-property">io</span>/v1
<span class="hljs-attr">kind</span>: <span class="hljs-title class_">StorageClass</span>
<span class="hljs-attr">metadata</span>:
 <span class="hljs-attr">name</span>: <span class="hljs-keyword">default</span>-storage<span class="hljs-keyword">class</span>
<span class="hljs-title class_">provisioner</span>: k8s.<span class="hljs-property">io</span>/minikube-hostpath
<button class="copy-code-btn"></button></code></pre>
<p>Эта конфигурация YAML определяет <code translate="no">StorageClass</code> под названием <code translate="no">default-storageclass</code>, который использует провизор <code translate="no">minikube-hostpath</code>, обычно используемый в локальных средах разработки.</p>
<h3 id="3-Apply-the-StorageClass" class="common-anchor-header">3. Примените StorageClass</h3><p>После создания файла <code translate="no">default-storageclass.yaml</code> примените его к кластеру с помощью следующей команды:</p>
<pre><code translate="no">$ kubectl apply -f <span class="hljs-keyword">default</span>-storageclass.<span class="hljs-property">yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>Это установит StorageClass по умолчанию для вашего кластера, что обеспечит правильное управление вашими потребностями в хранении данных в будущем.</p>
<h2 id="Step-3-Installing-Milvus-Using-the-Milvus-Operator" class="common-anchor-header">Шаг 3: Установка Milvus с помощью Milvus Operator<button data-href="#Step-3-Installing-Milvus-Using-the-Milvus-Operator" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Operator упрощает развертывание Milvus на Kubernetes, управление развертыванием, масштабированием и обновлениями. Перед установкой Milvus Operator необходимо установить <strong>cert-manager</strong>, который предоставляет сертификаты для сервера webhook, используемого Milvus Operator.</p>
<h3 id="1-Install-cert-manager" class="common-anchor-header">1. Установите cert-manager</h3><p>Milvus Operator требует <a href="https://cert-manager.io/docs/installation/supported-releases/">cert-manager</a> для управления сертификатами для безопасной связи. Убедитесь, что вы установили <strong>cert-manager версии 1.1.3</strong> или более поздней. Чтобы установить его, выполните следующую команду:</p>
<pre><code translate="no">$ kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.5.3/cert-manager.yaml
<button class="copy-code-btn"></button></code></pre>
<p>После установки убедитесь, что капсулы cert-manager запущены, выполнив:</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> pods -n cert-manager
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/verify_that_the_cert_manager_pods_are_running_bb44c2b6d5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Install-the-Milvus-Operator" class="common-anchor-header">2. Установите оператор Milvus</h3><p>После того как cert-manager запущен, можно установить Milvus Operator. Выполните следующую команду, чтобы развернуть его с помощью <code translate="no">kubectl</code>:</p>
<pre><code translate="no">$ kubectl apply -f <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/zilliztech/milvus-operator/main/deploy/manifests/deployment.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>Проверить, запущен ли модуль Milvus Operator, можно с помощью следующей команды:</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> pods -n milvus-<span class="hljs-keyword">operator</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/check_if_the_Milvus_Operator_pod_is_running_6e7ac41ebf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="3-Deploy-Milvus-Cluster" class="common-anchor-header">3. Развертывание кластера Milvus</h3><p>После того как капсула Milvus Operator запущена, вы можете развернуть кластер Milvus с оператором. Следующая команда развертывает кластер Milvus с его компонентами и зависимостями в отдельных подкадах с использованием конфигураций по умолчанию:</p>
<pre><code translate="no">$ kubectl apply -f <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/zilliztech/milvus-operator/main/config/samples/milvus_cluster_default.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Deploy_Milvus_Cluster_8b5d5343af.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Чтобы изменить настройки Milvus, вам нужно заменить YAML-файл на свой собственный конфигурационный YAML-файл. Помимо ручного редактирования или создания файла, вы можете использовать Milvus Sizing Tool для настройки конфигураций, а затем загрузить соответствующий YAML-файл.</p>
<p>В качестве альтернативы можно использовать <a href="https://milvus.io/tools/sizing"><strong>Milvus Sizing Tool</strong></a> для более рационального подхода. Этот инструмент позволяет настроить различные параметры, такие как распределение ресурсов и параметры хранения, а затем загрузить соответствующий YAML-файл с нужными конфигурациями. Это гарантирует, что развертывание Milvus будет оптимизировано для конкретного случая использования.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Milvus_sizing_tool_024693df9d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Рисунок: Инструмент определения размеров Milvus</p>
<p>Завершение развертывания может занять некоторое время. Вы можете проверить состояние вашего кластера Milvus с помощью команды:</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> milvus my-release
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/check_the_status_of_your_Milvus_cluster_bcbd85fd70.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Когда ваш кластер Milvus будет готов, все поды в кластере Milvus должны быть запущены или завершены:</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> pods
<button class="copy-code-btn"></button></code></pre>
<h2 id="Step-4-Accessing-Your-Milvus-Cluster" class="common-anchor-header">Шаг 4: Доступ к кластеру Milvus<button data-href="#Step-4-Accessing-Your-Milvus-Cluster" class="anchor-icon" translate="no">
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
    </button></h2><p>После развертывания кластера Milvus вам нужно получить к нему доступ, перенаправив локальный порт на порт службы Milvus. Выполните следующие шаги, чтобы получить порт службы и настроить переадресацию портов.</p>
<h4 id="1-Get-the-Service-Port" class="common-anchor-header"><strong>1. Получение порта службы</strong></h4><p>Сначала определите порт службы с помощью следующей команды. Замените <code translate="no">&lt;YOUR_MILVUS_PROXY_POD&gt;</code> на имя вашей прокси-подсистемы Milvus, которое обычно начинается с <code translate="no">my-release-milvus-proxy-</code>:</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> pod &lt;YOUR_MILVUS_PROXY_POD&gt; --template =<span class="hljs-string">&#x27;{{(index (index .spec.containers 0).ports 0).containerPort}}{{&quot;\n&quot;}}&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Эта команда вернет номер порта, который использует ваша служба Milvus.</p>
<h4 id="2-Forward-the-Port" class="common-anchor-header"><strong>2. Переадресация порта</strong></h4><p>Чтобы получить локальный доступ к кластеру Milvus, перенаправьте локальный порт на порт службы с помощью следующей команды. Замените <code translate="no">&lt;YOUR_LOCAL_PORT&gt;</code> на локальный порт, который вы хотите использовать, а <code translate="no">&lt;YOUR_SERVICE_PORT&gt;</code> - на порт службы, полученный на предыдущем шаге:</p>
<pre><code translate="no">$ kubectl port-forward --address 0.0.0.0 service/my-release-milvus &lt;YOUR_LOCAL_PORT&gt;:&lt;YOUR_SERVICE_PORT&gt;
<button class="copy-code-btn"></button></code></pre>
<p>Эта команда позволяет переадресовать порт для прослушивания всех IP-адресов хост-машины. Если вам нужно, чтобы служба прослушивала только <code translate="no">localhost</code>, вы можете опустить опцию <code translate="no">--address 0.0.0.0</code>.</p>
<p>После настройки переадресации портов вы сможете получить доступ к кластеру Milvus через указанный локальный порт для дальнейших операций или интеграций.</p>
<h2 id="Step-5-Connecting-to-Milvus-Using-Python-SDK" class="common-anchor-header">Шаг 5: Подключение к Milvus с помощью Python SDK<button data-href="#Step-5-Connecting-to-Milvus-Using-Python-SDK" class="anchor-icon" translate="no">
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
    </button></h2><p>Теперь, когда ваш кластер Milvus запущен, вы можете взаимодействовать с ним, используя любой Milvus SDK. В этом примере мы будем использовать <a href="https://zilliz.com/blog/what-is-pymilvus">PyMilvus</a>, Milvus's <strong>Python SDK,</strong> для подключения к кластеру и выполнения основных операций.</p>
<h3 id="1-Install-PyMilvus" class="common-anchor-header">1. Установите PyMilvus</h3><p>Чтобы взаимодействовать с Milvus через Python, необходимо установить пакет <code translate="no">pymilvus</code>:</p>
<pre><code translate="no">$ pip install pymilvus
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Connect-to-Milvus" class="common-anchor-header">2. Подключитесь к Milvus</h3><p>Ниже приведен пример сценария Python, который подключается к кластеру Milvus и демонстрирует выполнение основных операций, таких как создание коллекции.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-comment"># Connect to the Milvus server</span>
client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:&lt;YOUR_LOCAL_PORT&gt;&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-comment"># Create a collection</span>
collection_name = <span class="hljs-string">&quot;example_collection&quot;</span>
<span class="hljs-keyword">if</span> client.has_collection(collection_name):
   client.drop_collection(collection_name)
client.create_collection(
   collection_name=collection_name,
   dimension=<span class="hljs-number">768</span>,  <span class="hljs-comment"># The vectors we will use in this demo has 768 dimensions</span>
)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Explanation" class="common-anchor-header">Пояснение:</h4><ul>
<li><p>Подключение к Milvus: сценарий подключается к серверу Milvus, запущенному на <code translate="no">localhost</code>, используя локальный порт, который вы установили на шаге 4.</p></li>
<li><p>Создать коллекцию: Он проверяет, существует ли уже коллекция с именем <code translate="no">example_collection</code>, удаляет ее, если да, а затем создает новую коллекцию с векторами размерностью 768.</p></li>
</ul>
<p>Этот сценарий устанавливает соединение с кластером Milvus и создает коллекцию, служащую отправной точкой для более сложных операций, таких как вставка векторов и выполнение поиска по сходству.</p>
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
    </button></h2><p>Развертывание Milvus в распределенной системе на Kubernetes открывает мощные возможности для управления крупными векторными данными, обеспечивая плавное масштабирование и высокопроизводительные приложения, основанные на искусственном интеллекте. Следуя этому руководству, вы узнали, как настроить Milvus с помощью Milvus Operator, что делает этот процесс простым и эффективным.</p>
<p>Продолжая изучать Milvus, рассмотрите возможность масштабирования кластера для удовлетворения растущих потребностей или развертывания его на облачных платформах, таких как Amazon EKS, Google Cloud или Microsoft Azure. Для расширенного управления и мониторинга такие инструменты, как <a href="https://milvus.io/docs/milvus_backup_overview.md"><strong>Milvus Backup</strong></a>, <a href="https://milvus.io/docs/birdwatcher_overview.md"><strong>Birdwatcher</strong></a> и <a href="https://github.com/zilliztech/attu"><strong>Attu</strong></a>, предлагают ценную поддержку для поддержания работоспособности и производительности ваших развертываний.</p>
<p>Теперь вы готовы использовать весь потенциал Milvus на Kubernetes - счастливого развертывания! 🚀</p>
<h2 id="Further-Resources" class="common-anchor-header">Дополнительные ресурсы<button data-href="#Further-Resources" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/docs/overview.md">Документация по Milvus</a></p></li>
<li><p><a href="https://zilliz.com/blog/choose-the-right-milvus-deployment-mode-ai-applications">Milvus Lite vs. Standalone vs. Distributed: Какой режим подходит именно вам? </a></p></li>
<li><p><a href="https://zilliz.com/blog/milvus-on-gpu-with-nvidia-rapids-cuvs">Усиление векторного поиска: Milvus на GPU с NVIDIA RAPIDS cuVS</a></p></li>
<li><p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Что такое RAG? </a></p></li>
<li><p><a href="https://zilliz.com/learn/generative-ai">Ресурсный хаб генеративного ИИ | Zilliz</a></p></li>
<li><p><a href="https://zilliz.com/ai-models">Лучшие модели ИИ для ваших приложений GenAI | Zilliz</a></p></li>
</ul>
