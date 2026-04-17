---
id: deploy-milvus-on-kubernetes-step-by-step-guide-for-k8s-users.md
title: >-
  Despliegue de Milvus en Kubernetes: Guía paso a paso para usuarios de
  Kubernetes
author: Gael Gu
date: 2024-09-26T00:00:00.000Z
desc: >-
  Esta guía proporcionará un recorrido claro y paso a paso para configurar
  Milvus en Kubernetes utilizando el Operador Milvus.
cover: >-
  assets.zilliz.com/Deploying_Milvus_on_Kubernetes_A_Step_by_Step_Guide_for_Kubernetes_Users_4193487867.png
tag: Engineering
tags: 'Vector Databases, Milvus, RAG, LLM, K8s Deployment'
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/deploy-milvus-on-kubernetes-step-by-step-guide-for-k8s-users.md
---
<p><a href="https://zilliz.com/what-is-milvus"><strong>Milvus</strong></a> es una <a href="https://zilliz.com/learn/what-is-vector-database">base de datos vectorial</a> de código abierto diseñada para almacenar, indexar y buscar cantidades masivas de <a href="https://zilliz.com/learn/introduction-to-unstructured-data">datos no estructurados</a> a través de representaciones vectoriales, lo que la hace perfecta para aplicaciones impulsadas por IA, como la búsqueda por similitud, la <a href="https://zilliz.com/glossary/semantic-search">búsqueda semántica</a>, la generación aumentada de recuperación<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">(RAG</a>), los motores de recomendación y otras tareas de aprendizaje automático.</p>
<p>Pero lo que hace que Milvus sea aún más potente es su perfecta integración con Kubernetes. Si es aficionado a Kubernetes, sabrá que la plataforma es perfecta para orquestar sistemas escalables y distribuidos. Milvus aprovecha al máximo las capacidades de Kubernetes, permitiéndole desplegar, escalar y gestionar fácilmente los clústeres distribuidos de Milvus. Esta guía le proporcionará una guía clara, paso a paso para configurar Milvus en Kubernetes utilizando el Operador Milvus.</p>
<h2 id="Prerequisites" class="common-anchor-header">Requisitos previos<button data-href="#Prerequisites" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de comenzar, asegúrese de contar con los siguientes prerrequisitos:</p>
<ul>
<li><p>Un clúster Kubernetes en funcionamiento. Si usted está probando localmente, <code translate="no">minikube</code> es una gran opción.</p></li>
<li><p><code translate="no">kubectl</code> instalado y configurado para interactuar con su clúster Kubernetes.</p></li>
<li><p>Familiaridad con conceptos básicos de Kubernetes como pods, servicios y despliegues.</p></li>
</ul>
<h2 id="Step-1-Installing-Minikube-For-Local-Testing" class="common-anchor-header">Paso 1: Instalación de Minikube (para pruebas locales)<button data-href="#Step-1-Installing-Minikube-For-Local-Testing" class="anchor-icon" translate="no">
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
    </button></h2><p>Si necesita configurar un entorno local Kubernetes, <code translate="no">minikube</code> es la herramienta para usted. Las instrucciones oficiales de instalación se encuentran en la <a href="https://minikube.sigs.k8s.io/docs/start/">página de inicio de minikube</a>.</p>
<h3 id="1-Install-Minikube" class="common-anchor-header">1. Instalar Minikube</h3><p>Visite la<a href="https://github.com/kubernetes/minikube/releases"> página de versiones de minikube</a> y descargue la versión adecuada para su sistema operativo. Para macOS/Linux, puedes utilizar el siguiente comando:</p>
<pre><code translate="no">$ curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
$ <span class="hljs-built_in">sudo</span> install minikube-linux-amd64 /usr/local/bin/minikube &amp;&amp; <span class="hljs-built_in">rm</span> minikube-linux-amd64
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Start-Minikube" class="common-anchor-header">2. Inicie Minikube</h3><pre><code translate="no">$ minikube start
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Interact-with-Cluster" class="common-anchor-header">3. Interactuar con el clúster</h3><p>Ahora, puedes interactuar con tus clusters con kubectl dentro de minikube. Si no ha instalado kubectl, minikube descargará la versión apropiada por defecto.</p>
<pre><code translate="no">$ minikube kubectl cluster-info
<button class="copy-code-btn"></button></code></pre>
<p>Alternativamente, puede crear un enlace simbólico al binario de minikube llamado <code translate="no">kubectl</code> para facilitar su uso.</p>
<pre><code translate="no">$ <span class="hljs-built_in">sudo</span> <span class="hljs-built_in">ln</span> -s $(<span class="hljs-built_in">which</span> minikube) /usr/local/bin/kubectl
$ kubectl cluster-info
<button class="copy-code-btn"></button></code></pre>
<h2 id="Step-2-Configuring-the-StorageClass" class="common-anchor-header">Paso 2: Configuración de la StorageClass<button data-href="#Step-2-Configuring-the-StorageClass" class="anchor-icon" translate="no">
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
    </button></h2><p>En Kubernetes, una <strong>StorageClass</strong> define los tipos de almacenamiento disponibles para sus cargas de trabajo, proporcionando flexibilidad en la gestión de diferentes configuraciones de almacenamiento. Antes de continuar, debe asegurarse de que haya una StorageClass predeterminada disponible en su clúster. A continuación se explica cómo comprobarlo y configurar una si es necesario.</p>
<h3 id="1-Check-Installed-StorageClasses" class="common-anchor-header">1. Comprobar StorageClasses instaladas</h3><p>Para ver las StorageClasses disponibles en su clúster Kubernetes, ejecute el siguiente comando:</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> sc
<button class="copy-code-btn"></button></code></pre>
<p>Esto mostrará la lista de clases de almacenamiento instaladas en su clúster. Si una StorageClass predeterminada ya está configurada, se marcará con <code translate="no">(default)</code>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/storage_classes_installed_in_your_cluster_21d36d6ac8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Configure-a-Default-StorageClass-if-necessary" class="common-anchor-header">2. Configure una StorageClass por defecto (si es necesario)</h3><p>Si no se ha configurado ninguna StorageClass por defecto, puede crear una definiéndola en un archivo YAML. Utilice el siguiente ejemplo para crear una StorageClass por defecto:</p>
<pre><code translate="no"><span class="hljs-attr">apiVersion</span>: storage.<span class="hljs-property">k8s</span>.<span class="hljs-property">io</span>/v1
<span class="hljs-attr">kind</span>: <span class="hljs-title class_">StorageClass</span>
<span class="hljs-attr">metadata</span>:
 <span class="hljs-attr">name</span>: <span class="hljs-keyword">default</span>-storage<span class="hljs-keyword">class</span>
<span class="hljs-title class_">provisioner</span>: k8s.<span class="hljs-property">io</span>/minikube-hostpath
<button class="copy-code-btn"></button></code></pre>
<p>Esta configuración YAML define un <code translate="no">StorageClass</code> llamado <code translate="no">default-storageclass</code> que utiliza el aprovisionador <code translate="no">minikube-hostpath</code>, comúnmente utilizado en entornos de desarrollo local.</p>
<h3 id="3-Apply-the-StorageClass" class="common-anchor-header">3. Aplicar la StorageClass</h3><p>Una vez creado el archivo <code translate="no">default-storageclass.yaml</code>, aplíquelo a su cluster utilizando el siguiente comando:</p>
<pre><code translate="no">$ kubectl apply -f <span class="hljs-keyword">default</span>-storageclass.<span class="hljs-property">yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>Esto configurará la StorageClass predeterminada para su clúster, asegurando que sus necesidades de almacenamiento se gestionen adecuadamente en el futuro.</p>
<h2 id="Step-3-Installing-Milvus-Using-the-Milvus-Operator" class="common-anchor-header">Paso 3: Instalar Milvus utilizando el Operador Milvus<button data-href="#Step-3-Installing-Milvus-Using-the-Milvus-Operator" class="anchor-icon" translate="no">
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
    </button></h2><p>El Operador Milvus simplifica el despliegue de Milvus en Kubernetes, gestionando el despliegue, escalado y actualizaciones. Antes de instalar el Operador Milvus, necesitará instalar el <strong>cert-manager</strong>, que proporciona certificados para el servidor webhook utilizado por el Operador Milvus.</p>
<h3 id="1-Install-cert-manager" class="common-anchor-header">1. Instalar cert-manager</h3><p>Milvus Operator requiere <a href="https://cert-manager.io/docs/installation/supported-releases/">cert-manager</a> para gestionar los certificados para una comunicación segura. Asegúrese de instalar <strong>cert-manager versión 1.1.3</strong> o posterior. Para instalarlo, ejecute el siguiente comando:</p>
<pre><code translate="no">$ kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.5.3/cert-manager.yaml
<button class="copy-code-btn"></button></code></pre>
<p>Tras la instalación, verifique que los pods cert-manager se están ejecutando ejecutando:</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> pods -n cert-manager
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/verify_that_the_cert_manager_pods_are_running_bb44c2b6d5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Install-the-Milvus-Operator" class="common-anchor-header">2. Instale el Operador Milvus</h3><p>Una vez que cert-manager esté en funcionamiento, puede instalar Milvus Operator. Ejecute el siguiente comando para desplegarlo utilizando <code translate="no">kubectl</code>:</p>
<pre><code translate="no">$ kubectl apply -f <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/zilliztech/milvus-operator/main/deploy/manifests/deployment.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>Puede comprobar si el pod Milvus Operator se está ejecutando mediante el siguiente comando:</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> pods -n milvus-<span class="hljs-keyword">operator</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/check_if_the_Milvus_Operator_pod_is_running_6e7ac41ebf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="3-Deploy-Milvus-Cluster" class="common-anchor-header">3. Despliegue de Milvus Cluster</h3><p>Una vez que el pod Milvus Operator se está ejecutando, puede desplegar un cluster Milvus con el operador. El siguiente comando despliega un cluster Milvus con sus componentes y dependencias en pods separados utilizando las configuraciones por defecto:</p>
<pre><code translate="no">$ kubectl apply -f <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/zilliztech/milvus-operator/main/config/samples/milvus_cluster_default.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Deploy_Milvus_Cluster_8b5d5343af.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Para personalizar la configuración de Milvus, tendrá que sustituir el archivo YAML por su propio archivo YAML de configuración. Además de editar o crear manualmente el archivo, puede utilizar Milvus Sizing Tool para ajustar las configuraciones y luego descargar el archivo YAML correspondiente.</p>
<p>Alternativamente, puede utilizar la <a href="https://milvus.io/tools/sizing"><strong>Milvus Sizing</strong></a> Tool para un enfoque más racionalizado. Esta herramienta le permite ajustar varias configuraciones, como la asignación de recursos y las opciones de almacenamiento, y luego descargar el archivo YAML correspondiente con las configuraciones deseadas. Esto garantiza que su despliegue de Milvus esté optimizado para su caso de uso específico.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Milvus_sizing_tool_024693df9d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figura: Herramienta de dimensionamiento de Milvus</p>
<p>El despliegue puede tardar algún tiempo en completarse. Puede comprobar el estado de su cluster Milvus a través del comando:</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> milvus my-release
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/check_the_status_of_your_Milvus_cluster_bcbd85fd70.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Una vez que su clúster Milvus esté listo, todos los pods del clúster Milvus deberían estar ejecutándose o completados:</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> pods
<button class="copy-code-btn"></button></code></pre>
<h2 id="Step-4-Accessing-Your-Milvus-Cluster" class="common-anchor-header">Paso 4: Acceso a su cluster Milvus<button data-href="#Step-4-Accessing-Your-Milvus-Cluster" class="anchor-icon" translate="no">
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
    </button></h2><p>Una vez desplegado su cluster Milvus, necesita acceder a él reenviando un puerto local al puerto de servicio Milvus. Siga estos pasos para recuperar el puerto de servicio y configurar el reenvío de puertos.</p>
<h4 id="1-Get-the-Service-Port" class="common-anchor-header"><strong>1. Obtener el puerto de servicio</strong></h4><p>En primer lugar, identifique el puerto de servicio utilizando el siguiente comando. Sustituya <code translate="no">&lt;YOUR_MILVUS_PROXY_POD&gt;</code> por el nombre de su pod proxy Milvus, que normalmente empieza por <code translate="no">my-release-milvus-proxy-</code>:</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> pod &lt;YOUR_MILVUS_PROXY_POD&gt; --template =<span class="hljs-string">&#x27;{{(index (index .spec.containers 0).ports 0).containerPort}}{{&quot;\n&quot;}}&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Este comando devolverá el número de puerto que está utilizando su servicio Milvus.</p>
<h4 id="2-Forward-the-Port" class="common-anchor-header"><strong>2. Reenvíe el puerto</strong></h4><p>Para acceder a su cluster Milvus localmente, reenvíe un puerto local al puerto de servicio utilizando el siguiente comando. Sustituya <code translate="no">&lt;YOUR_LOCAL_PORT&gt;</code> por el puerto local que desea utilizar y <code translate="no">&lt;YOUR_SERVICE_PORT&gt;</code> por el puerto de servicio obtenido en el paso anterior:</p>
<pre><code translate="no">$ kubectl port-forward --address 0.0.0.0 service/my-release-milvus &lt;YOUR_LOCAL_PORT&gt;:&lt;YOUR_SERVICE_PORT&gt;
<button class="copy-code-btn"></button></code></pre>
<p>Este comando permite el reenvío de puertos para escuchar en todas las direcciones IP de la máquina anfitriona. Si sólo necesita que el servicio escuche en <code translate="no">localhost</code>, puede omitir la opción <code translate="no">--address 0.0.0.0</code>.</p>
<p>Una vez configurado el reenvío de puertos, puede acceder a su cluster Milvus a través del puerto local especificado para otras operaciones o integraciones.</p>
<h2 id="Step-5-Connecting-to-Milvus-Using-Python-SDK" class="common-anchor-header">Paso 5: Conectarse a Milvus utilizando Python SDK<button data-href="#Step-5-Connecting-to-Milvus-Using-Python-SDK" class="anchor-icon" translate="no">
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
    </button></h2><p>Con su cluster Milvus en funcionamiento, ahora puede interactuar con él utilizando cualquier SDK Milvus. En este ejemplo, utilizaremos <a href="https://zilliz.com/blog/what-is-pymilvus">PyMilvus</a>, el <strong>SDK Python</strong> de Milvus <strong>,</strong> para conectarnos al cluster y realizar operaciones básicas.</p>
<h3 id="1-Install-PyMilvus" class="common-anchor-header">1. Instalar PyMilvus</h3><p>Para interactuar con Milvus a través de Python, necesita instalar el paquete <code translate="no">pymilvus</code>:</p>
<pre><code translate="no">$ pip install pymilvus
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Connect-to-Milvus" class="common-anchor-header">2. Conectarse a Milvus</h3><p>El siguiente es un script Python de ejemplo que se conecta a su cluster Milvus y demuestra cómo realizar operaciones básicas como crear una colección.</p>
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
<h4 id="Explanation" class="common-anchor-header">Explicación:</h4><ul>
<li><p>Conectarse a Milvus: El script se conecta al servidor Milvus que se ejecuta en <code translate="no">localhost</code> utilizando el puerto local que configuró en el Paso 4.</p></li>
<li><p>Crear una colección: Comprueba si ya existe una colección denominada <code translate="no">example_collection</code>, la elimina en caso afirmativo y, a continuación, crea una nueva colección con vectores de 768 dimensiones.</p></li>
</ul>
<p>Este script establece una conexión con el cluster Milvus y crea una colección, sirviendo como punto de partida para operaciones más complejas como insertar vectores y realizar búsquedas de similitud.</p>
<h2 id="Conclusion" class="common-anchor-header">Conclusión<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>El despliegue de Milvus en una configuración distribuida en Kubernetes desbloquea potentes capacidades para la gestión de datos vectoriales a gran escala, lo que permite una escalabilidad perfecta y aplicaciones de alto rendimiento impulsadas por IA. Siguiendo esta guía, usted ha aprendido cómo configurar Milvus usando el Operador Milvus, haciendo el proceso ágil y eficiente.</p>
<p>A medida que continúe explorando Milvus, considere escalar su clúster para satisfacer las crecientes demandas o implementarlo en plataformas en la nube como Amazon EKS, Google Cloud o Microsoft Azure. Para una mejor gestión y supervisión, herramientas como <a href="https://milvus.io/docs/milvus_backup_overview.md"><strong>Milvus Backup</strong></a>, <a href="https://milvus.io/docs/birdwatcher_overview.md"><strong>Birdwatcher</strong></a> y <a href="https://github.com/zilliztech/attu"><strong>Attu</strong></a> ofrecen un valioso apoyo para mantener la salud y el rendimiento de sus despliegues.</p>
<p>Ahora está listo para aprovechar todo el potencial de Milvus en Kubernetes: ¡feliz despliegue! 🚀</p>
<h2 id="Further-Resources" class="common-anchor-header">Recursos adicionales<button data-href="#Further-Resources" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/docs/overview.md">Documentación de Milvus</a></p></li>
<li><p><a href="https://zilliz.com/blog/choose-the-right-milvus-deployment-mode-ai-applications">Milvus Lite vs Independiente vs Distribuido: Qué modo es el adecuado para usted? </a></p></li>
<li><p><a href="https://zilliz.com/blog/milvus-on-gpu-with-nvidia-rapids-cuvs">Potenciación de la búsqueda vectorial: Milvus en GPUs con NVIDIA RAPIDS cuVS</a></p></li>
<li><p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">¿Qué es RAG? </a></p></li>
<li><p><a href="https://zilliz.com/learn/generative-ai">Generative AI Resource Hub | Zilliz</a></p></li>
<li><p><a href="https://zilliz.com/ai-models">Los mejores modelos de IA para tus aplicaciones GenAI | Zilliz</a></p></li>
</ul>
