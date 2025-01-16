---
id: how-to-deploy-open-source-milvus-vector-database-on-amazon-eks.md
title: >-
  Как развернуть базу данных Milvus Vector с открытым исходным кодом на Amazon
  EKS
author: AWS
date: 2024-08-09T00:00:00.000Z
desc: >-
  Пошаговое руководство по развертыванию векторной базы данных Milvus на AWS с
  использованием управляемых сервисов Amazon EKS, S3, MSK и ELB.
cover: assets.zilliz.com/Getting_started_with_Milvus_cluster_and_K8s_1_34b2c81802.png
tag: Engineering
tags: 'Milvus, Vector Database, Amazon EKS, RAG'
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/how-to-deploy-open-source-milvus-vector-database-on-amazon-eks.md
---
<p><em>Эта статья была первоначально опубликована на <a href="https://aws.amazon.com/cn/blogs/china/build-open-source-vector-database-milvus-based-on-amazon-eks/"><em>сайте AWS</em></a>, переведена, отредактирована и опубликована здесь с разрешения.</em></p>
<h2 id="An-Overview-of-Vector-Embeddings-and-Vector-Databases" class="common-anchor-header">Обзор векторных вкраплений и векторных баз данных<button data-href="#An-Overview-of-Vector-Embeddings-and-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>Развитие <a href="https://zilliz.com/learn/generative-ai">генеративного искусственного интеллекта (GenAI)</a>, в частности больших языковых моделей<a href="https://zilliz.com/glossary/large-language-models-(llms)">(LLM</a>), значительно повысило интерес к <a href="https://zilliz.com/learn/what-is-vector-database">векторным базам данных</a>, сделав их важным компонентом экосистемы GenAI. В результате векторные базы данных находят все большее <a href="https://milvus.io/use-cases">применение</a>.</p>
<p>По прогнозам <a href="https://venturebeat.com/data-infrastructure/report-80-of-global-datasphere-will-be-unstructured-by-2025/">IDC</a>, к 2025 году более 80 % бизнес-данных будут неструктурированными, существующими в таких форматах, как текст, изображения, аудио и видео. Понимание, обработка, хранение и запрос такого огромного количества <a href="https://zilliz.com/learn/introduction-to-unstructured-data">неструктурированных данных</a> в масштабе представляет собой серьезную проблему. Общепринятой практикой в GenAI и глубоком обучении является преобразование неструктурированных данных в векторные вкрапления, их хранение и индексация в векторных базах данных, таких как <a href="https://milvus.io/intro">Milvus</a> или <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (полностью управляемый Milvus), для поиска <a href="https://zilliz.com/learn/vector-similarity-search">по векторному сходству</a> или семантическому сходству.</p>
<p>Но что же такое <a href="https://zilliz.com/glossary/vector-embeddings">векторные вкрапления</a>? Проще говоря, это числовые представления чисел с плавающей точкой в высокоразмерном пространстве. <a href="https://zilliz.com/blog/similarity-metrics-for-vector-search">Расстояние между двумя векторами</a> указывает на их релевантность: чем они ближе, тем более релевантны друг другу, и наоборот. Это означает, что похожие векторы соответствуют похожим исходным данным, что отличается от традиционного поиска по ключевым словам или точного поиска.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_2_How_to_perform_a_vector_search_f38e8533a2.png" alt="How to perform a vector similarity search" class="doc-image" id="how-to-perform-a-vector-similarity-search" />
   </span> <span class="img-wrapper"> <span>Как выполнить поиск векторного сходства</span> </span></p>
<p><em>Рисунок 1: Как выполнить поиск векторного сходства</em></p>
<p>Возможность хранения, индексирования и поиска векторных вкраплений является основной функциональностью векторных баз данных. В настоящее время основные векторные базы данных делятся на две категории. Первая категория расширяет существующие продукты реляционных баз данных, такие как Amazon OpenSearch Service с плагином <a href="https://zilliz.com/blog/k-nearest-neighbor-algorithm-for-machine-learning">KNN</a> и Amazon RDS для <a href="https://zilliz.com/comparison/milvus-vs-pgvector">PostgreSQL</a> с расширением pgvector. Вторая категория включает в себя специализированные продукты векторных баз данных, в том числе такие известные примеры, как Milvus, Zilliz Cloud (полностью управляемый Milvus), <a href="https://zilliz.com/comparison/pinecone-vs-zilliz-vs-milvus">Pinecone</a>, <a href="https://zilliz.com/comparison/milvus-vs-weaviate">Weaviate</a>, <a href="https://zilliz.com/comparison/milvus-vs-qdrant">Qdrant</a> и <a href="https://zilliz.com/blog/milvus-vs-chroma">Chroma</a>.</p>
<p>Методы встраивания и векторные базы данных находят широкое применение в различных сферах <a href="https://zilliz.com/vector-database-use-cases">использования ИИ</a>, включая поиск по сходству изображений, дедупликацию и анализ видео, обработку естественного языка, рекомендательные системы, целевую рекламу, персонализированный поиск, интеллектуальное обслуживание клиентов и выявление мошенничества.</p>
<p><a href="https://milvus.io/docs/quickstart.md">Milvus</a> - один из самых популярных вариантов с открытым исходным кодом среди многочисленных векторных баз данных. В этом посте мы познакомимся с Milvus и рассмотрим практику развертывания Milvus на AWS EKS.</p>
<h2 id="What-is-Milvus" class="common-anchor-header">Что такое Milvus?<button data-href="#What-is-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/intro">Milvus</a> - это очень гибкая, надежная и молниеносная облачная нативная векторная база данных с открытым исходным кодом. Она обеспечивает работу приложений для поиска векторных сходств и искусственного интеллекта и стремится сделать векторные базы данных доступными для каждой организации. Milvus может хранить, индексировать и управлять миллиардом с лишним векторных вкраплений, созданных глубокими нейронными сетями и другими моделями машинного обучения (ML).</p>
<p>Milvus был выпущен под <a href="https://github.com/milvus-io/milvus/blob/master/LICENSE">лицензией Apache License 2.0 с открытым исходным кодом</a> в октябре 2019 года. В настоящее время он является дипломным проектом <a href="https://lfaidata.foundation/">LF AI &amp; Data Foundation</a>. На момент написания этого блога Milvus достиг более <a href="https://hub.docker.com/r/milvusdb/milvus">50 миллионов</a> загрузок <a href="https://hub.docker.com/r/milvusdb/milvus">Docker pull</a> и используется <a href="https://milvus.io/">многими клиентами</a>, такими как NVIDIA, AT&amp;T, IBM, eBay, Shopee и Walmart.</p>
<h3 id="Milvus-Key-Features" class="common-anchor-header">Ключевые особенности Milvus</h3><p>Будучи облачной векторной базой данных, Milvus может похвастаться следующими ключевыми особенностями:</p>
<ul>
<li><p>Высокая производительность и миллисекундный поиск в векторных наборах данных миллиардного масштаба.</p></li>
<li><p>Поддержка нескольких языков и набор инструментов.</p></li>
<li><p>Горизонтальная масштабируемость и высокая надежность даже в случае сбоев.</p></li>
<li><p><a href="https://zilliz.com/blog/a-review-of-hybrid-search-in-milvus">Гибридный поиск</a>, достигаемый за счет объединения скалярной фильтрации с векторным поиском сходства.</p></li>
</ul>
<h3 id="Milvus-Architecture" class="common-anchor-header">Архитектура Milvus</h3><p>Milvus следует принципу разделения потока данных и потока управления. Система состоит из четырех уровней, как показано на диаграмме:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_Architecture_Overview_fd10aeffb8.png" alt="Milvus Architecture" class="doc-image" id="milvus-architecture" />
   </span> <span class="img-wrapper"> <span>Архитектура Milvus</span> </span></p>
<p><em>Рисунок 2 Архитектура Milvus</em></p>
<ul>
<li><p><strong>Уровень доступа:</strong> Уровень доступа состоит из группы нестационарных прокси-серверов и служит в качестве переднего уровня системы и конечной точки для пользователей.</p></li>
<li><p><strong>Служба координаторов:</strong> Служба координатора распределяет задачи между рабочими узлами.</p></li>
<li><p><strong>Рабочие узлы:</strong> Рабочие узлы - это немые исполнители, которые следуют инструкциям службы координаторов и выполняют команды DML/DDL, инициированные пользователем.</p></li>
<li><p><strong>Хранилище:</strong> Хранилище отвечает за сохранение данных. Оно включает в себя метахранилище, брокер журналов и хранилище объектов.</p></li>
</ul>
<h3 id="Milvus-Deployment-Options" class="common-anchor-header">Варианты развертывания Milvus</h3><p>Milvus поддерживает три режима работы: <a href="https://milvus.io/docs/install-overview.md">Milvus Lite, Standalone и Distributed</a>.</p>
<ul>
<li><p><strong>Milvus Lite</strong> - это библиотека Python, которая может быть импортирована в локальные приложения. Как облегченная версия Milvus, она идеально подходит для быстрого создания прототипов в Jupyter Notebooks или для работы на смарт-устройствах с ограниченными ресурсами.</p></li>
<li><p><strong>Milvus Standalone</strong>- это серверное развертывание на одной машине. Если у вас есть производственная рабочая нагрузка, но вы предпочитаете не использовать Kubernetes, запуск Milvus Standalone на одной машине с достаточным количеством памяти будет хорошим вариантом.</p></li>
<li><p><strong>Milvus Distributed</strong> может быть развернут на кластерах Kubernetes. Он поддерживает большие массивы данных, более высокую доступность и масштабируемость и больше подходит для производственных сред.</p></li>
</ul>
<p>Milvus с самого начала был разработан для поддержки Kubernetes и может быть легко развернут на AWS. Мы можем использовать Amazon Elastic Kubernetes Service (Amazon EKS) в качестве управляемого Kubernetes, Amazon S3 в качестве хранилища объектов, Amazon Managed Streaming for Apache Kafka (Amazon MSK) в качестве хранилища сообщений и Amazon Elastic Load Balancing (Amazon ELB) в качестве балансировщика нагрузки для создания надежного, эластичного кластера баз данных Milvus.</p>
<p>Далее мы дадим пошаговое руководство по развертыванию кластера Milvus с помощью EKS и других сервисов.</p>
<h2 id="Deploying-Milvus-on-AWS-EKS" class="common-anchor-header">Развертывание Milvus на AWS EKS<button data-href="#Deploying-Milvus-on-AWS-EKS" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Prerequisites" class="common-anchor-header">Необходимые условия</h3><p>Мы будем использовать AWS CLI для создания кластера EKS и развертывания базы данных Milvus. Для этого необходимы следующие предварительные условия:</p>
<ul>
<li><p>ПК/Mac или экземпляр Amazon EC2 с установленным<a href="https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"> AWS CLI</a> и настроенными соответствующими правами. Инструменты AWS CLI установлены по умолчанию, если вы используете Amazon Linux 2 или Amazon Linux 2023.</p></li>
<li><p><a href="https://docs.aws.amazon.com/eks/latest/userguide/getting-started.html">Установленные инструменты EKS</a>, включая Helm, Kubectl, eksctl и т. д.</p></li>
<li><p>Ведро Amazon S3.</p></li>
<li><p>Экземпляр Amazon MSK.</p></li>
</ul>
<h3 id="Considerations-when-creating-MSK" class="common-anchor-header">Соображения при создании MSK</h3><ul>
<li>Последняя стабильная версия Milvus (v2.3.13) зависит от функции Kafka <code translate="no">autoCreateTopics</code>. Поэтому при создании MSK нам необходимо использовать пользовательскую конфигурацию и изменить свойство <code translate="no">auto.create.topics.enable</code> со значения по умолчанию <code translate="no">false</code> на <code translate="no">true</code>. Кроме того, для увеличения пропускной способности MSK рекомендуется увеличить значения <code translate="no">message.max.bytes</code> и <code translate="no">replica.fetch.max.bytes</code>. Подробности см. в разделе <a href="https://docs.aws.amazon.com/msk/latest/developerguide/msk-configuration-properties.html">Пользовательские конфигурации MSK</a>.</li>
</ul>
<pre><code translate="no">auto.create.topics.enable=true
message.<span class="hljs-built_in">max</span>.<span class="hljs-built_in">bytes</span>=<span class="hljs-number">10485880</span>
replica.fetch.<span class="hljs-built_in">max</span>.<span class="hljs-built_in">bytes</span>=<span class="hljs-number">20971760</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Milvus не поддерживает аутентификацию MSK на основе ролей IAM. Поэтому при создании MSK включите опцию <code translate="no">SASL/SCRAM authentication</code> в конфигурации безопасности и настройте <code translate="no">username</code> и <code translate="no">password</code> в AWS Secrets Manager. Подробности смотрите в разделе <a href="https://docs.aws.amazon.com/msk/latest/developerguide/msk-password.html">Аутентификация учетных данных при входе в систему с помощью AWS Secrets Manager</a>.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_3_Security_settings_enable_SASL_SCRAM_authentication_9cf7cdde00.png" alt="Figure 3 Security settings enable SASL SCRAM authentication.png" class="doc-image" id="figure-3-security-settings-enable-sasl-scram-authentication.png" />
   </span> <span class="img-wrapper"> <span>Рисунок 3 Настройки безопасности: включить аутентификацию SASL SCRAM.png</span> </span></p>
<p><em>Рисунок 3: Настройки безопасности: включить аутентификацию SASL/SCRAM</em></p>
<ul>
<li>Нам нужно разрешить доступ к группе безопасности MSK из группы безопасности кластера EKS или диапазона IP-адресов.</li>
</ul>
<h3 id="Creating-an-EKS-Cluster" class="common-anchor-header">Создание кластера EKS</h3><p>Существует множество способов создания кластера EKS, например, через консоль, CloudFormation, eksctl и т. д. В этом посте мы покажем, как создать кластер EKS с помощью eksctl.</p>
<p><code translate="no">eksctl</code> это простой инструмент командной строки для создания и управления кластерами Kubernetes на Amazon EKS. Он обеспечивает самый быстрый и простой способ создания нового кластера с узлами для Amazon EKS. Дополнительную информацию см. на <a href="https://eksctl.io/">сайте</a> eksctl.</p>
<ol>
<li>Сначала создайте файл <code translate="no">eks_cluster.yaml</code> с помощью следующего фрагмента кода. Замените <code translate="no">cluster-name</code> на имя кластера, замените <code translate="no">region-code</code> на регион AWS, в котором вы хотите создать кластер, и замените <code translate="no">private-subnet-idx</code> на частные подсети. Примечание: Этот файл конфигурации создает кластер EKS в существующем VPC, указывая частные подсети. Если вы хотите создать новый VPC, удалите конфигурацию VPC и подсетей, и тогда <code translate="no">eksctl</code> автоматически создаст новую.</li>
</ol>
<pre><code translate="no">apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig

metadata:
 name: &lt;cluster-name&gt;
 region: &lt;region-code&gt;
 version: <span class="hljs-string">&quot;1.26&quot;</span>

iam:
 withOIDC: true

 serviceAccounts:
 - metadata:
     name: aws-load-balancer-controller
     namespace: kube-system
   wellKnownPolicies:
     awsLoadBalancerController: true
 - metadata:
     name: milvus-s3-access-sa
     <span class="hljs-comment"># if no namespace is set, &quot;default&quot; will be used;</span>
     <span class="hljs-comment"># the namespace will be created if it doesn&#x27;t exist already</span>
     namespace: milvus
     labels: {aws-usage: <span class="hljs-string">&quot;milvus&quot;</span>}
   attachPolicyARNs:
   - <span class="hljs-string">&quot;arn:aws:iam::aws:policy/AmazonS3FullAccess&quot;</span>

<span class="hljs-comment"># Use existed VPC to create EKS.</span>
<span class="hljs-comment"># If you don&#x27;t config vpc subnets, eksctl will automatically create a brand new VPC</span>
vpc:
 subnets:
   private:
     us-west-2a: { <span class="hljs-built_in">id</span>: &lt;private-subnet-id1&gt; }
     us-west-2b: { <span class="hljs-built_in">id</span>: &lt;private-subnet-id2&gt; }
     us-west-2c: { <span class="hljs-built_in">id</span>: &lt;private-subnet-id3&gt; }

managedNodeGroups:
 - name: ng-<span class="hljs-number">1</span>-milvus
   labels: { role: milvus }
   instanceType: m6i<span class="hljs-number">.2</span>xlarge
   desiredCapacity: <span class="hljs-number">3</span>
   privateNetworking: true
  
addons:
- name: vpc-cni <span class="hljs-comment"># no version is specified so it deploys the default version</span>
 attachPolicyARNs:
   - arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy
- name: coredns
 version: latest <span class="hljs-comment"># auto discovers the latest available</span>
- name: kube-proxy
 version: latest
- name: aws-ebs-csi-driver
 wellKnownPolicies:      <span class="hljs-comment"># add IAM and service account</span>
   ebsCSIController: true
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>Затем выполните команду <code translate="no">eksctl</code> для создания кластера EKS.</li>
</ol>
<pre><code translate="no">eksctl create cluster -f eks_cluster.yaml
<button class="copy-code-btn"></button></code></pre>
<p>Эта команда создаст следующие ресурсы:</p>
<ul>
<li><p>Кластер EKS с указанной версией.</p></li>
<li><p>Группа управляемых узлов с тремя экземплярами EC2 m6i.2xlarge.</p></li>
<li><p><a href="https://docs.aws.amazon.com/en_us/eks/latest/userguide/enable-iam-roles-for-service-accounts.html">Провайдер идентификации IAM OIDC</a> и учетная запись ServiceAccount под названием <code translate="no">aws-load-balancer-controller</code>, которую мы будем использовать позже при установке <strong>контроллера балансировщика нагрузки AWS</strong>.</p></li>
<li><p>Пространство имен <code translate="no">milvus</code> и ServiceAccount <code translate="no">milvus-s3-access-sa</code> в этом пространстве имен. Это пространство имен будет использоваться позже при настройке S3 в качестве хранилища объектов для Milvus.</p>
<p>Примечание: Для простоты здесь <code translate="no">milvus-s3-access-sa</code> предоставлены полные права доступа к S3. В производственных развертываниях рекомендуется следовать принципу наименьших привилегий и предоставлять доступ только к конкретному ведру S3, используемому для Milvus.</p></li>
<li><p>Несколько дополнений, где <code translate="no">vpc-cni</code>, <code translate="no">coredns</code>, <code translate="no">kube-proxy</code> - основные дополнения, необходимые EKS. <code translate="no">aws-ebs-csi-driver</code> - драйвер AWS EBS CSI, который позволяет кластерам EKS управлять жизненным циклом томов Amazon EBS.</p></li>
</ul>
<p>Теперь нам нужно дождаться завершения создания кластера.</p>
<p>Дождитесь завершения создания кластера. В процессе создания кластера файл <code translate="no">kubeconfig</code> будет автоматически создан или обновлен. Вы также можете обновить его вручную, выполнив следующую команду. Обязательно замените <code translate="no">region-code</code> на регион AWS, в котором создается кластер, и замените <code translate="no">cluster-name</code> на имя кластера.</p>
<pre><code translate="no">aws eks update-kubeconfig --region &lt;region-code&gt; --name &lt;cluster-name&gt;
<button class="copy-code-btn"></button></code></pre>
<p>После создания кластера вы можете просмотреть узлы, выполнив следующую команду:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> nodes -A -o wide
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li>Создайте <code translate="no">ebs-sc</code> StorageClass, настроенный на GP3 в качестве типа хранилища, и установите его в качестве StorageClass по умолчанию. Milvus использует etcd в качестве метахранилища и нуждается в этом StorageClass для создания и управления PVC.</li>
</ol>
<pre><code translate="no">cat &lt;&lt;EOF | kubectl apply -f -
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
 name: ebs-sc
 annotations:
   storageclass.kubernetes.io/<span class="hljs-keyword">is</span>-default-<span class="hljs-keyword">class</span>: <span class="hljs-string">&quot;true&quot;</span>
provisioner: ebs.csi.aws.com
volumeBindingMode: WaitForFirstConsumer
parameters:
 <span class="hljs-built_in">type</span>: gp3
EOF
<button class="copy-code-btn"></button></code></pre>
<p>Затем установите исходный <code translate="no">gp2</code> StorageClass не по умолчанию:</p>
<pre><code translate="no">kubectl patch storage<span class="hljs-keyword">class</span> <span class="hljs-title class_">gp2</span> -p <span class="hljs-string">&#x27;{&quot;metadata&quot;: {&quot;annotations&quot;:{&quot;storageclass.kubernetes.io/is-default-class&quot;:&quot;false&quot;}}}&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<ol start="4">
<li>Установите контроллер балансировщика нагрузки AWS. Мы будем использовать этот контроллер позже для Milvus Service и Attu Ingress, поэтому давайте установим его заранее.</li>
</ol>
<ul>
<li>Сначала добавьте репо <code translate="no">eks-charts</code> и обновите его.</li>
</ul>
<pre><code translate="no">helm repo <span class="hljs-keyword">add</span> eks https:<span class="hljs-comment">//aws.github.io/eks-charts</span>
helm repo update
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Затем установите контроллер AWS Load Balancer Controller. Замените <code translate="no">cluster-name</code> на имя вашего кластера. Учетная запись ServiceAccount с именем <code translate="no">aws-load-balancer-controller</code> уже была создана, когда мы создавали кластер EKS на предыдущих шагах.</li>
</ul>
<pre><code translate="no">helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
 -n kube-system \
 --<span class="hljs-built_in">set</span> clusterName=&lt;cluster-name&gt; \
 --<span class="hljs-built_in">set</span> serviceAccount.create=<span class="hljs-literal">false</span> \
 --<span class="hljs-built_in">set</span> serviceAccount.name=aws-load-balancer-controller
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Проверьте, успешно ли установлен контроллер.</li>
</ul>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> deployment -n kube-system aws-load-balancer-controller
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Результат должен выглядеть следующим образом:</li>
</ul>
<pre><code translate="no">NAME                           READY   UP-TO-DATE   AVAILABLE   AGE
aws-load-balancer-controller   2/2     2            2           12m
<button class="copy-code-btn"></button></code></pre>
<h3 id="Deploying-a-Milvus-Cluster" class="common-anchor-header">Развертывание кластера Milvus</h3><p>Milvus поддерживает несколько методов развертывания, таких как Operator и Helm. Operator проще, но Helm более прямой и гибкий. В этом примере мы будем использовать Helm для развертывания Milvus.</p>
<p>При развертывании Milvus с помощью Helm вы можете настроить конфигурацию с помощью файла <code translate="no">values.yaml</code>. Щелкните <a href="https://raw.githubusercontent.com/milvus-io/milvus-helm/master/charts/milvus/values.yaml">values.yaml</a>, чтобы просмотреть все параметры. По умолчанию Milvus создает внутрикластерные minio и pulsar в качестве хранилища объектов и хранилища сообщений, соответственно. Мы внесем некоторые изменения в конфигурацию, чтобы сделать ее более подходящей для производства.</p>
<ol>
<li>Сначала добавьте репо Milvus Helm и обновите его.</li>
</ol>
<pre><code translate="no">helm repo <span class="hljs-keyword">add</span> milvus https:<span class="hljs-comment">//zilliztech.github.io/milvus-helm/</span>
helm repo update
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>Создайте файл <code translate="no">milvus_cluster.yaml</code> со следующим фрагментом кода. Этот фрагмент кода настраивает конфигурацию Milvus, например, настраивает Amazon S3 в качестве хранилища объектов и Amazon MSK в качестве очереди сообщений. Подробные объяснения и рекомендации по настройке мы предоставим позже.</li>
</ol>
<pre><code translate="no"><span class="hljs-comment">#####################################</span>
<span class="hljs-comment"># Section 1</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># Configure S3 as the Object Storage</span>
<span class="hljs-comment">#####################################</span>

<span class="hljs-comment"># Service account</span>
<span class="hljs-comment"># - this service account are used by External S3 access</span>
serviceAccount:
  create: false
  name: milvus-s3-access-sa

<span class="hljs-comment"># Close in-cluster minio</span>
minio:
  enabled: false

<span class="hljs-comment"># External S3</span>
<span class="hljs-comment"># - these configs are only used when `externalS3.enabled` is true</span>
externalS3:
  enabled: true
  host: <span class="hljs-string">&quot;s3.&lt;region-code&gt;.amazonaws.com&quot;</span>
  port: <span class="hljs-string">&quot;443&quot;</span>
  useSSL: true
  bucketName: <span class="hljs-string">&quot;&lt;bucket-name&gt;&quot;</span>
  rootPath: <span class="hljs-string">&quot;&lt;root-path&gt;&quot;</span>
  useIAM: true
  cloudProvider: <span class="hljs-string">&quot;aws&quot;</span>
  iamEndpoint: <span class="hljs-string">&quot;&quot;</span>

<span class="hljs-comment">#####################################</span>
<span class="hljs-comment"># Section 2</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># Configure MSK as the Message Storage</span>
<span class="hljs-comment">#####################################</span>

<span class="hljs-comment"># Close in-cluster pulsar</span>
pulsar:
  enabled: false

<span class="hljs-comment"># External kafka</span>
<span class="hljs-comment"># - these configs are only used when `externalKafka.enabled` is true</span>
externalKafka:
  enabled: true
  brokerList: <span class="hljs-string">&quot;&lt;broker-list&gt;&quot;</span>
  securityProtocol: SASL_SSL
  sasl:
    mechanisms: SCRAM-SHA-<span class="hljs-number">512</span>
    username: <span class="hljs-string">&quot;&lt;username&gt;&quot;</span>
    password: <span class="hljs-string">&quot;&lt;password&gt;&quot;</span>
    
<span class="hljs-comment">#####################################</span>
<span class="hljs-comment"># Section 3</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># Expose the Milvus service to be accessed from outside the cluster (LoadBalancer service).</span>
<span class="hljs-comment"># or access it from within the cluster (ClusterIP service). Set the service type and the port to serve it.</span>
<span class="hljs-comment">#####################################</span>
service:
  <span class="hljs-built_in">type</span>: LoadBalancer
  port: <span class="hljs-number">19530</span>
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-<span class="hljs-built_in">type</span>: external <span class="hljs-comment">#AWS Load Balancer Controller fulfills services that has this annotation</span>
    service.beta.kubernetes.io/aws-load-balancer-name : milvus-service <span class="hljs-comment">#User defined name given to AWS Network Load Balancer</span>
    service.beta.kubernetes.io/aws-load-balancer-scheme: internal <span class="hljs-comment"># internal or internet-facing, later allowing for public access via internet</span>
    service.beta.kubernetes.io/aws-load-balancer-nlb-target-<span class="hljs-built_in">type</span>: ip <span class="hljs-comment">#The Pod IPs should be used as the target IPs (rather than the node IPs)</span>
    
<span class="hljs-comment">#####################################</span>
<span class="hljs-comment"># Section 4</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># Installing Attu the Milvus management GUI</span>
<span class="hljs-comment">#####################################</span>
attu:
  enabled: true
  name: attu
  ingress:
    enabled: true
    annotations:
      kubernetes.io/ingress.<span class="hljs-keyword">class</span>: alb <span class="hljs-comment"># Annotation: set ALB ingress type</span>
      alb.ingress.kubernetes.io/scheme: internet-facing <span class="hljs-comment">#Places the load balancer on public subnets</span>
      alb.ingress.kubernetes.io/target-<span class="hljs-built_in">type</span>: ip <span class="hljs-comment">#The Pod IPs should be used as the target IPs (rather than the node IPs)</span>
      alb.ingress.kubernetes.io/group.name: attu <span class="hljs-comment"># Groups multiple Ingress resources</span>
    hosts:
      -
      
<span class="hljs-comment">#####################################</span>
<span class="hljs-comment"># Section 5</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># HA deployment of Milvus Core Components</span>
<span class="hljs-comment">#####################################</span>
rootCoordinator:
  replicas: <span class="hljs-number">2</span>
  activeStandby:
    enabled: true  <span class="hljs-comment"># Enable active-standby when you set multiple replicas for root coordinator</span>
  resources:
    limits:
      cpu: <span class="hljs-number">1</span>
      memory: 2Gi
indexCoordinator:
  replicas: <span class="hljs-number">2</span>
  activeStandby:
    enabled: true  <span class="hljs-comment"># Enable active-standby when you set multiple replicas for index coordinator</span>
  resources:
    limits:
      cpu: <span class="hljs-string">&quot;0.5&quot;</span>
      memory: <span class="hljs-number">0.5</span>Gi
queryCoordinator:
  replicas: <span class="hljs-number">2</span>
  activeStandby:
    enabled: true  <span class="hljs-comment"># Enable active-standby when you set multiple replicas for query coordinator</span>
  resources:
    limits:
      cpu: <span class="hljs-string">&quot;0.5&quot;</span>
      memory: <span class="hljs-number">0.5</span>Gi
dataCoordinator:
  replicas: <span class="hljs-number">2</span>
  activeStandby:
    enabled: true  <span class="hljs-comment"># Enable active-standby when you set multiple replicas for data coordinator</span>
  resources:
    limits:
      cpu: <span class="hljs-string">&quot;0.5&quot;</span>
      memory: <span class="hljs-number">0.5</span>Gi
proxy:
  replicas: <span class="hljs-number">2</span>
  resources:
    limits:
      cpu: <span class="hljs-number">1</span>
      memory: 4Gi

<span class="hljs-comment">#####################################</span>
<span class="hljs-comment"># Section 6</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># Milvus Resource Allocation</span>
<span class="hljs-comment">#####################################</span>
queryNode:
  replicas: <span class="hljs-number">1</span>
  resources:
    limits:
      cpu: <span class="hljs-number">2</span>
      memory: 8Gi
dataNode:
  replicas: <span class="hljs-number">1</span>
  resources:
    limits:
      cpu: <span class="hljs-number">1</span>
      memory: 4Gi
indexNode:
  replicas: <span class="hljs-number">1</span>
  resources:
    limits:
      cpu: <span class="hljs-number">4</span>
      memory: 8Gi
<button class="copy-code-btn"></button></code></pre>
<p>Код содержит шесть секций. Следуйте следующим инструкциям, чтобы изменить соответствующие конфигурации.</p>
<p><strong>Раздел 1</strong>: Настройка S3 в качестве хранилища объектов. ServiceAccount предоставляет Milvus доступ к S3 (в данном случае это <code translate="no">milvus-s3-access-sa</code>, который был создан при создании кластера EKS). Обязательно замените <code translate="no">&lt;region-code&gt;</code> на регион AWS, в котором расположен ваш кластер. Замените <code translate="no">&lt;bucket-name&gt;</code> на имя вашего ведра S3, а <code translate="no">&lt;root-path&gt;</code> - на префикс для ведра S3 (это поле можно оставить пустым).</p>
<p><strong>Раздел 2</strong>: Настройка MSK в качестве хранилища сообщений. Замените <code translate="no">&lt;broker-list&gt;</code> адресами конечных точек, соответствующих типу аутентификации SASL/SCRAM в MSK. Замените <code translate="no">&lt;username&gt;</code> и <code translate="no">&lt;password&gt;</code> на имя пользователя и пароль учетной записи MSK. Вы можете получить <code translate="no">&lt;broker-list&gt;</code> из информации о клиенте MSK, как показано на рисунке ниже.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_4_Configure_MSK_as_the_Message_Storage_of_Milvus_a9e602e0b9.png" alt="Figure 4 Configure MSK as the Message Storage of Milvus.png" class="doc-image" id="figure-4-configure-msk-as-the-message-storage-of-milvus.png" />
   </span> <span class="img-wrapper"> <span>Рисунок 4 Настройка MSK в качестве хранилища сообщений Milvus.png</span> </span></p>
<p><em>Рисунок 4: Настройка MSK в качестве хранилища сообщений Milvus</em></p>
<p><strong>Раздел 3:</strong> Раскрываем службу Milvus и разрешаем доступ извне кластера. По умолчанию конечная точка Milvus использует сервис типа ClusterIP, который доступен только внутри кластера EKS. При необходимости вы можете изменить его на тип LoadBalancer, чтобы разрешить доступ извне кластера EKS. Служба типа LoadBalancer использует Amazon NLB в качестве балансировщика нагрузки. В соответствии с лучшими практиками безопасности, <code translate="no">aws-load-balancer-scheme</code> по умолчанию настроен на внутренний режим, что означает, что доступ к Milvus разрешен только через внутреннюю сеть. Нажмите, чтобы <a href="https://docs.aws.amazon.com/eks/latest/userguide/network-load-balancing.html">просмотреть инструкции по настройке NLB</a>.</p>
<p><strong>Раздел 4:</strong> Установите и настройте <a href="https://github.com/zilliztech/attu">Attu</a>, инструмент администрирования milvus с открытым исходным кодом. Он имеет интуитивно понятный графический интерфейс, который позволяет легко взаимодействовать с Milvus. Мы включим Attu, настроим вход с помощью AWS ALB и установим тип <code translate="no">internet-facing</code>, чтобы к Attu можно было получить доступ через Интернет. Щелкните <a href="https://docs.aws.amazon.com/eks/latest/userguide/alb-ingress.html">этот документ</a>, чтобы ознакомиться с руководством по настройке ALB.</p>
<p><strong>Раздел 5:</strong> Включите HA-развертывание основных компонентов Milvus. Milvus содержит множество независимых и разрозненных компонентов. Например, служба координатора выступает в качестве уровня управления, обеспечивая координацию для компонентов Root, Query, Data и Index. Прокси-сервер на уровне доступа служит конечной точкой доступа к базе данных. По умолчанию для этих компонентов используется только 1 реплика стручка. Развертывание нескольких реплик этих компонентов службы особенно необходимо для повышения доступности Milvus.</p>
<p><strong>Примечание:</strong> Для развертывания нескольких реплик компонентов координаторов Root, Query, Data и Index требуется включение опции <code translate="no">activeStandby</code>.</p>
<p><strong>Раздел 6:</strong> Настройте распределение ресурсов для компонентов Milvus в соответствии с требованиями рабочих нагрузок. На веб-сайте Milvus также имеется <a href="https://milvus.io/tools/sizing/">инструмент определения размеров</a> для создания предложений по конфигурации на основе объема данных, размеров векторов, типов индексов и т. д. Он также может сгенерировать конфигурационный файл Helm одним щелчком мыши. Следующая конфигурация - это предложение, выданное инструментом для 1 миллиона векторов 1024 размеров и типа индекса HNSW.</p>
<ol>
<li>Используйте Helm для создания Milvus (развернутого в пространстве имен <code translate="no">milvus</code>). Примечание: Вы можете заменить <code translate="no">&lt;demo&gt;</code> на собственное имя.</li>
</ol>
<pre><code translate="no">helm install &lt;demo&gt; milvus/milvus -n milvus -f milvus_cluster.yaml
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>Выполните следующую команду, чтобы проверить состояние развертывания.</li>
</ol>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> deployment -n milvus
<button class="copy-code-btn"></button></code></pre>
<p>Следующий вывод показывает, что все компоненты Milvus находятся в состоянии AVAILABLE, а для компонентов координации включено несколько реплик.</p>
<pre><code translate="no">NAME                     READY   UP-TO-DATE   AVAILABLE   AGE
demo-milvus-attu         1/1     1            1           5m27s
demo-milvus-datacoord    2/2     2            2           5m27s
demo-milvus-datanode     1/1     1            1           5m27s
demo-milvus-indexcoord   2/2     2            2           5m27s
demo-milvus-indexnode    1/1     1            1           5m27s
demo-milvus-proxy        2/2     2            2           5m27s
demo-milvus-querycoord   2/2     2            2           5m27s
demo-milvus-querynode    1/1     1            1           5m27s
demo-milvus-rootcoord    2/2     2            2           5m27s
<button class="copy-code-btn"></button></code></pre>
<h3 id="Accessing-and-Managing-Milvus" class="common-anchor-header">Доступ к Milvus и управление им</h3><p>Итак, мы успешно развернули базу данных векторов Milvus. Теперь мы можем получить доступ к Milvus через конечные точки. Milvus открывает конечные точки через сервисы Kubernetes. Attu открывает конечные точки через Kubernetes Ingress.</p>
<h4 id="Accessing-Milvus-endpoints" class="common-anchor-header"><strong>Доступ к конечным точкам Milvus</strong></h4><p>Выполните следующую команду, чтобы получить конечные точки сервисов:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> svc -n milvus
<button class="copy-code-btn"></button></code></pre>
<p>Вы можете просмотреть несколько сервисов. Milvus поддерживает два порта, порт <code translate="no">19530</code> и порт <code translate="no">9091</code>:</p>
<ul>
<li>Порт <code translate="no">19530</code> предназначен для gRPC и RESTful API. Это порт по умолчанию, когда вы подключаетесь к серверу Milvus с помощью различных Milvus SDK или HTTP-клиентов.</li>
<li>Порт <code translate="no">9091</code> - это порт управления для сбора метрик, профилирования pprof и зондов здоровья в Kubernetes.</li>
</ul>
<p>Сервис <code translate="no">demo-milvus</code> предоставляет конечную точку доступа к базе данных, которая используется для установления соединения с клиентами. В качестве балансировщика нагрузки сервиса используется NLB. Конечную точку службы можно получить из столбца <code translate="no">EXTERNAL-IP</code>.</p>
<pre><code translate="no">NAME                     TYPE           CLUSTER-IP       EXTERNAL-IP                                               PORT(S)                          AGE
demo-etcd                ClusterIP      <span class="hljs-number">172.20</span><span class="hljs-number">.103</span><span class="hljs-number">.138</span>   &lt;none&gt;                                                    <span class="hljs-number">2379</span>/TCP,<span class="hljs-number">2380</span>/TCP                62m
demo-etcd-headless       ClusterIP      <span class="hljs-literal">None</span>             &lt;none&gt;                                                    <span class="hljs-number">2379</span>/TCP,<span class="hljs-number">2380</span>/TCP                62m
demo-milvus              LoadBalancer   <span class="hljs-number">172.20</span><span class="hljs-number">.219</span><span class="hljs-number">.33</span>    milvus-nlb-xxxx.elb.us-west-<span class="hljs-number">2.</span>amazonaws.com               <span class="hljs-number">19530</span>:<span class="hljs-number">31201</span>/TCP,<span class="hljs-number">9091</span>:<span class="hljs-number">31088</span>/TCP   62m
demo-milvus-datacoord    ClusterIP      <span class="hljs-number">172.20</span><span class="hljs-number">.214</span><span class="hljs-number">.106</span>   &lt;none&gt;                                                    <span class="hljs-number">13333</span>/TCP,<span class="hljs-number">9091</span>/TCP               62m
demo-milvus-datanode     ClusterIP      <span class="hljs-literal">None</span>             &lt;none&gt;                                                    <span class="hljs-number">9091</span>/TCP                         62m
demo-milvus-indexcoord   ClusterIP      <span class="hljs-number">172.20</span><span class="hljs-number">.106</span><span class="hljs-number">.51</span>    &lt;none&gt;                                                    <span class="hljs-number">31000</span>/TCP,<span class="hljs-number">9091</span>/TCP               62m
demo-milvus-indexnode    ClusterIP      <span class="hljs-literal">None</span>             &lt;none&gt;                                                    <span class="hljs-number">9091</span>/TCP                         62m
demo-milvus-querycoord   ClusterIP      <span class="hljs-number">172.20</span><span class="hljs-number">.136</span><span class="hljs-number">.213</span>   &lt;none&gt;                                                    <span class="hljs-number">19531</span>/TCP,<span class="hljs-number">9091</span>/TCP               62m
demo-milvus-querynode    ClusterIP      <span class="hljs-literal">None</span>             &lt;none&gt;                                                    <span class="hljs-number">9091</span>/TCP                         62m
demo-milvus-rootcoord    ClusterIP      <span class="hljs-number">172.20</span><span class="hljs-number">.173</span><span class="hljs-number">.98</span>    &lt;none&gt;                                                    <span class="hljs-number">53100</span>/TCP,<span class="hljs-number">9091</span>/TCP               62m
<button class="copy-code-btn"></button></code></pre>
<h4 id="Managing-Milvus-using-Attu" class="common-anchor-header"><strong>Управление Milvus с помощью Attu</strong></h4><p>Как было описано ранее, мы установили Attu для управления Milvus. Выполните следующую команду, чтобы получить конечную точку:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> ingress -n milvus
<button class="copy-code-btn"></button></code></pre>
<p>Вы увидите ингресс под названием <code translate="no">demo-milvus-attu</code>, где столбец <code translate="no">ADDRESS</code> - это URL-адрес доступа.</p>
<pre><code translate="no">NAME            CLASS   HOSTS   ADDRESS                                     PORTS   AGE
demo-milvus-attu   &lt;none&gt;   *       k8s-attu-xxxx.us-west-2.elb.amazonaws.com   80      27s
<button class="copy-code-btn"></button></code></pre>
<p>Откройте адрес Ingress в браузере и увидите следующую страницу. Нажмите <strong>Connect</strong>, чтобы войти в систему.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_5_Log_in_to_your_Attu_account_bde25a6da5.png" alt="Figure 5 Log in to your Attu account.png" class="doc-image" id="figure-5-log-in-to-your-attu-account.png" />
   </span> <span class="img-wrapper"> <span>Рисунок 5 Вход в учетную запись Attu.png</span> </span></p>
<p><em>Рисунок 5: Вход в учетную запись Attu</em></p>
<p>После входа в систему вы сможете управлять базами данных Milvus через Attu.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_6_The_Attu_interface_3e818e6833.png" alt="Figure 6 The Attu interface.png" class="doc-image" id="figure-6-the-attu-interface.png" />
   </span> <span class="img-wrapper"> <span>Рисунок 6 Интерфейс Attu.png</span> </span></p>
<p>Рисунок 6: Интерфейс Attu</p>
<h2 id="Testing-the-Milvus-vector-database" class="common-anchor-header">Тестирование векторной базы данных Milvus<button data-href="#Testing-the-Milvus-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>Мы будем использовать <a href="https://milvus.io/docs/example_code.md">код примера</a> Milvus, чтобы проверить, правильно ли работает база данных Milvus. Сначала загрузите код примера <code translate="no">hello_milvus.py</code> с помощью следующей команды:</p>
<pre><code translate="no">wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/pymilvus/master/examples/hello_milvus.py</span>
<button class="copy-code-btn"></button></code></pre>
<p>Измените host в коде примера на конечную точку сервиса Milvus.</p>
<pre><code translate="no"><span class="hljs-built_in">print</span>(fmt.<span class="hljs-built_in">format</span>(<span class="hljs-string">&quot;start connecting to Milvus&quot;</span>))
connections.connect(<span class="hljs-string">&quot;default&quot;</span>, host=<span class="hljs-string">&quot;milvus-nlb-xxx.elb.us-west-2.amazonaws.com&quot;</span>, port=<span class="hljs-string">&quot;19530&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Запустите код:</p>
<pre><code translate="no">python3 hello_milvus.py
<button class="copy-code-btn"></button></code></pre>
<p>Если система вернет следующий результат, это означает, что Milvus работает нормально.</p>
<pre><code translate="no">=== start connecting to <span class="hljs-title class_">Milvus</span>     ===
<span class="hljs-title class_">Does</span> collection hello_milvus exist <span class="hljs-keyword">in</span> <span class="hljs-title class_">Milvus</span>: <span class="hljs-title class_">False</span>
=== <span class="hljs-title class_">Create</span> collection <span class="hljs-string">`hello_milvus`</span> ===
=== <span class="hljs-title class_">Start</span> inserting entities       ===
<span class="hljs-title class_">Number</span> <span class="hljs-keyword">of</span> entities <span class="hljs-keyword">in</span> <span class="hljs-title class_">Milvus</span>: <span class="hljs-number">3000</span>
=== <span class="hljs-title class_">Start</span> <span class="hljs-title class_">Creating</span> index <span class="hljs-variable constant_">IVF_FLAT</span>  ===
=== <span class="hljs-title class_">Start</span> loading                  ===
<button class="copy-code-btn"></button></code></pre>
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
    </button></h2><p>В этой статье мы познакомились с <a href="https://milvus.io/intro">Milvus</a>, одной из самых популярных векторных баз данных с открытым исходным кодом, и привели руководство по развертыванию Milvus на AWS с помощью управляемых сервисов Amazon EKS, S3, MSK и ELB для достижения большей эластичности и надежности.</p>
<p>Являясь основным компонентом различных систем GenAI, в частности Retrieval Augmented Generation (RAG), Milvus поддерживает и интегрируется с различными основными моделями и фреймворками GenAI, включая Amazon Sagemaker, PyTorch, HuggingFace, LlamaIndex и LangChain. Начните свой путь к инновациям GenAI с Milvus уже сегодня!</p>
<h2 id="References" class="common-anchor-header">Ссылки<button data-href="#References" class="anchor-icon" translate="no">
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
<li><a href="https://docs.aws.amazon.com/eks/latest/userguide/getting-started.html">Руководство пользователя Amazon EKS</a></li>
<li><a href="https://milvus.io/">Официальный сайт Milvus</a></li>
<li><a href="https://github.com/milvus-io/milvus">Репозиторий Milvus на GitHub</a></li>
<li><a href="https://eksctl.io/">Официальный сайт eksctl</a></li>
</ul>
