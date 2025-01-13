---
id: how-to-deploy-open-source-milvus-vector-database-on-amazon-eks.md
title: >-
  Cómo implementar la base de datos vectorial Milvus de código abierto en Amazon
  EKS
author: AWS
date: 2024-08-09T00:00:00.000Z
desc: >-
  Una guía paso a paso sobre la implementación de la base de datos vectorial
  Milvus en AWS utilizando servicios administrados como Amazon EKS, S3, MSK y
  ELB.
cover: assets.zilliz.com/Getting_started_with_Milvus_cluster_and_K8s_1_34b2c81802.png
tag: Engineering
tags: 'Milvus, Vector Database, Amazon EKS, RAG'
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/how-to-deploy-open-source-milvus-vector-database-on-amazon-eks.md
---
<p><em>Este artículo se publicó originalmente en el <a href="https://aws.amazon.com/cn/blogs/china/build-open-source-vector-database-milvus-based-on-amazon-eks/"><em>sitio web de AWS</em></a> y se ha traducido, editado y publicado aquí con permiso.</em></p>
<h2 id="An-Overview-of-Vector-Embeddings-and-Vector-Databases" class="common-anchor-header">Visión general de las incrustaciones vectoriales y las bases de datos vectoriales<button data-href="#An-Overview-of-Vector-Embeddings-and-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>El auge de <a href="https://zilliz.com/learn/generative-ai">la IA Generativa (GenAI</a>), en particular de los grandes modelos de lenguaje<a href="https://zilliz.com/glossary/large-language-models-(llms)">(LLM</a>), ha impulsado significativamente el interés en las <a href="https://zilliz.com/learn/what-is-vector-database">bases de datos</a> vectoriales, estableciéndolas como un componente esencial dentro del ecosistema GenAI. Como resultado, las bases de datos vectoriales se están adoptando en <a href="https://milvus.io/use-cases">casos de uso</a> cada vez más frecuentes.</p>
<p>Un <a href="https://venturebeat.com/data-infrastructure/report-80-of-global-datasphere-will-be-unstructured-by-2025/">informe de IDC</a> predice que, para 2025, más del 80% de los datos empresariales serán no estructurados y existirán en formatos como texto, imágenes, audio y vídeos. Comprender, procesar, almacenar y consultar esta enorme cantidad de <a href="https://zilliz.com/learn/introduction-to-unstructured-data">datos no estructurados</a> a gran escala supone un reto importante. La práctica común en GenAI y aprendizaje profundo es transformar los datos no estructurados en incrustaciones vectoriales, almacenarlos e indexarlos en una base de datos vectorial como <a href="https://milvus.io/intro">Milvus</a> o <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (el Milvus totalmente gestionado) para búsquedas de <a href="https://zilliz.com/learn/vector-similarity-search">similitud vectorial</a> o similitud semántica.</p>
<p>Pero, ¿qué son exactamente las <a href="https://zilliz.com/glossary/vector-embeddings">incrustaciones vectoriales</a>? En pocas palabras, son representaciones numéricas de números de coma flotante en un espacio de alta dimensión. La <a href="https://zilliz.com/blog/similarity-metrics-for-vector-search">distancia entre dos vectores</a> indica su relevancia: cuanto más próximos están, más relevantes son entre sí, y viceversa. Esto significa que vectores similares corresponden a datos originales similares, lo que difiere de las búsquedas tradicionales por palabras clave o exactas.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_2_How_to_perform_a_vector_search_f38e8533a2.png" alt="How to perform a vector similarity search" class="doc-image" id="how-to-perform-a-vector-similarity-search" />
   </span> <span class="img-wrapper"> <span>Cómo realizar una búsqueda por similitud vectorial</span> </span></p>
<p><em>Figura 1: Cómo realizar una búsqueda de similitud vectorial</em></p>
<p>La capacidad de almacenar, indexar y buscar incrustaciones vectoriales es la funcionalidad principal de las bases de datos vectoriales. Actualmente, las principales bases de datos vectoriales se dividen en dos categorías. La primera categoría amplía los productos de bases de datos relacionales existentes, como Amazon OpenSearch Service con el complemento <a href="https://zilliz.com/blog/k-nearest-neighbor-algorithm-for-machine-learning">KNN</a> y Amazon RDS para <a href="https://zilliz.com/comparison/milvus-vs-pgvector">PostgreSQL</a> con la extensión pgvector. La segunda categoría comprende productos especializados de bases de datos vectoriales, incluidos ejemplos bien conocidos como Milvus, Zilliz Cloud (el Milvus totalmente gestionado), <a href="https://zilliz.com/comparison/pinecone-vs-zilliz-vs-milvus">Pinecone</a>, <a href="https://zilliz.com/comparison/milvus-vs-weaviate">Weaviate</a>, <a href="https://zilliz.com/comparison/milvus-vs-qdrant">Qdrant</a> y <a href="https://zilliz.com/blog/milvus-vs-chroma">Chroma</a>.</p>
<p>Las técnicas de incrustación y las bases de datos vectoriales tienen amplias aplicaciones en diversos <a href="https://zilliz.com/vector-database-use-cases">casos de uso impulsados por la IA</a>, como la búsqueda por similitud de imágenes, la deduplicación y el análisis de vídeos, el procesamiento del lenguaje natural, los sistemas de recomendación, la publicidad dirigida, la búsqueda personalizada, el servicio inteligente de atención al cliente y la detección de fraudes.</p>
<p><a href="https://milvus.io/docs/quickstart.md">Milvus</a> es una de las opciones de código abierto más populares entre las numerosas bases de datos vectoriales. Este post presenta Milvus y explora la práctica de implementar Milvus en AWS EKS.</p>
<h2 id="What-is-Milvus" class="common-anchor-header">¿Qué es Milvus?<button data-href="#What-is-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/intro">Milvus</a> es una base de datos vectorial de código abierto, nativa en la nube, altamente flexible, fiable y ultrarrápida. Potencia la búsqueda de similitud vectorial y las aplicaciones de IA y se esfuerza por hacer que las bases de datos vectoriales sean accesibles para todas las organizaciones. Milvus puede almacenar, indexar y gestionar más de mil millones de incrustaciones vectoriales generadas por redes neuronales profundas y otros modelos de aprendizaje automático (ML).</p>
<p>Milvus se publicó bajo la <a href="https://github.com/milvus-io/milvus/blob/master/LICENSE">Licencia Apache 2.0 de código abierto</a> en octubre de 2019. Actualmente es un proyecto de posgrado bajo <a href="https://lfaidata.foundation/">LF AI &amp; Data Foundation</a>. En el momento de escribir este blog, Milvus había alcanzado más de <a href="https://hub.docker.com/r/milvusdb/milvus">50 millones de</a> descargas de <a href="https://hub.docker.com/r/milvusdb/milvus">Docker pull</a> y era utilizado por <a href="https://milvus.io/">muchos clientes</a>, como NVIDIA, AT&amp;T, IBM, eBay, Shopee y Walmart.</p>
<h3 id="Milvus-Key-Features" class="common-anchor-header">Características principales de Milvus</h3><p>Como base de datos vectorial nativa de la nube, Milvus cuenta con las siguientes características clave:</p>
<ul>
<li><p>Alto rendimiento y búsqueda en milisegundos en conjuntos de datos vectoriales a escala de miles de millones.</p></li>
<li><p>Soporte multilingüe y cadena de herramientas.</p></li>
<li><p>Escalabilidad horizontal y alta fiabilidad incluso en caso de interrupción.</p></li>
<li><p><a href="https://zilliz.com/blog/a-review-of-hybrid-search-in-milvus">Búsqueda híbrida</a>, lograda combinando el filtrado escalar con la búsqueda de similitud vectorial.</p></li>
</ul>
<h3 id="Milvus-Architecture" class="common-anchor-header">Arquitectura de Milvus</h3><p>Milvus sigue el principio de separar el flujo de datos del flujo de control. El sistema se divide en cuatro niveles, como se muestra en el diagrama:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_Architecture_Overview_fd10aeffb8.png" alt="Milvus Architecture" class="doc-image" id="milvus-architecture" />
   </span> <span class="img-wrapper"> <span>Arquitectura de Milvus</span> </span></p>
<p><em>Figura 2 Arquitectura de Milvus</em></p>
<ul>
<li><p><strong>Capa de acceso:</strong> La capa de acceso está compuesta por un grupo de proxies sin estado y sirve como capa frontal del sistema y punto final para los usuarios.</p></li>
<li><p><strong>Servicio de coordinación:</strong> El servicio coordinador asigna tareas a los nodos trabajadores.</p></li>
<li><p><strong>Nodos trabajadores:</strong> Los nodos trabajadores son ejecutores tontos que siguen instrucciones del servicio coordinador y ejecutan comandos DML/DDL activados por el usuario.</p></li>
<li><p><strong>Almacenamiento:</strong> El almacenamiento es responsable de la persistencia de los datos. Comprende un metaalmacenamiento, un corredor de registros y un almacenamiento de objetos.</p></li>
</ul>
<h3 id="Milvus-Deployment-Options" class="common-anchor-header">Opciones de despliegue de Milvus</h3><p>Milvus admite tres modos de ejecución: <a href="https://milvus.io/docs/install-overview.md">Milvus Lite, Independiente y Distribuido</a>.</p>
<ul>
<li><p><strong>Milvus Lite</strong> es una biblioteca Python que puede importarse en aplicaciones locales. Como versión ligera de Milvus, es ideal para la creación rápida de prototipos en cuadernos Jupyter o para su ejecución en dispositivos inteligentes con recursos limitados.</p></li>
<li><p><strong>Milvus Standalone es</strong>una implementación de servidor de una sola máquina. Si tiene una carga de trabajo de producción pero prefiere no usar Kubernetes, ejecutar Milvus Standalone en una sola máquina con suficiente memoria es una buena opción.</p></li>
<li><p><strong>Milvus Distributed</strong> puede desplegarse en clústeres Kubernetes. Soporta conjuntos de datos más grandes, mayor disponibilidad y escalabilidad, y es más adecuado para entornos de producción.</p></li>
</ul>
<p>Milvus está diseñado desde el principio para soportar Kubernetes, y puede desplegarse fácilmente en AWS. Podemos utilizar Amazon Elastic Kubernetes Service (Amazon EKS) como Kubernetes administrado, Amazon S3 como almacenamiento de objetos, Amazon Managed Streaming para Apache Kafka (Amazon MSK) como almacenamiento de mensajes y Amazon Elastic Load Balancing (Amazon ELB) como balanceador de carga para crear un clúster de base de datos Milvus fiable y elástico.</p>
<p>A continuación, proporcionaremos una guía paso a paso sobre la implementación de un clúster Milvus utilizando EKS y otros servicios.</p>
<h2 id="Deploying-Milvus-on-AWS-EKS" class="common-anchor-header">Implementación de Milvus en AWS EKS<button data-href="#Deploying-Milvus-on-AWS-EKS" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Prerequisites" class="common-anchor-header">Requisitos previos</h3><p>Utilizaremos AWS CLI para crear un clúster EKS e implementar una base de datos Milvus. Se requieren los siguientes prerrequisitos:</p>
<ul>
<li><p>Un PC/Mac o una instancia de Amazon EC2 con<a href="https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"> AWS CLI</a> instalado y configurado con los permisos adecuados. Las herramientas de AWS CLI están instaladas por defecto si utiliza Amazon Linux 2 o Amazon Linux 2023.</p></li>
<li><p><a href="https://docs.aws.amazon.com/eks/latest/userguide/getting-started.html">Herramientas EKS instaladas</a>, incluidas Helm, Kubectl, eksctl, etc.</p></li>
<li><p>Un bucket de Amazon S3.</p></li>
<li><p>Una instancia de Amazon MSK.</p></li>
</ul>
<h3 id="Considerations-when-creating-MSK" class="common-anchor-header">Consideraciones al crear MSK</h3><ul>
<li>La última versión estable de Milvus (v2.3.13) depende de la función <code translate="no">autoCreateTopics</code> de Kafka. Por lo tanto, al crear MSK, debemos utilizar una configuración personalizada y cambiar la propiedad <code translate="no">auto.create.topics.enable</code> de la predeterminada <code translate="no">false</code> a <code translate="no">true</code>. Además, para aumentar el rendimiento de mensajes de MSK, se recomienda aumentar los valores de <code translate="no">message.max.bytes</code> y <code translate="no">replica.fetch.max.bytes</code>. Consulte <a href="https://docs.aws.amazon.com/msk/latest/developerguide/msk-configuration-properties.html">Configuraciones MSK personalizadas</a> para obtener más detalles.</li>
</ul>
<pre><code translate="no">auto.create.topics.enable=true
message.<span class="hljs-built_in">max</span>.<span class="hljs-built_in">bytes</span>=<span class="hljs-number">10485880</span>
replica.fetch.<span class="hljs-built_in">max</span>.<span class="hljs-built_in">bytes</span>=<span class="hljs-number">20971760</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Milvus no soporta la autenticación basada en roles IAM de MSK. Por lo tanto, al crear MSK, habilite la opción <code translate="no">SASL/SCRAM authentication</code> en la configuración de seguridad, y configure <code translate="no">username</code> y <code translate="no">password</code> en el Administrador de Secretos de AWS. Consulte <a href="https://docs.aws.amazon.com/msk/latest/developerguide/msk-password.html">Autenticación de credenciales de inicio de sesión con AWS Secrets</a> Manager para obtener más detalles.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_3_Security_settings_enable_SASL_SCRAM_authentication_9cf7cdde00.png" alt="Figure 3 Security settings enable SASL SCRAM authentication.png" class="doc-image" id="figure-3-security-settings-enable-sasl-scram-authentication.png" />
   </span> <span class="img-wrapper"> <span>Figura 3 Configuración de seguridad</span> </span>: habilitar <span class="img-wrapper"> <span>autenticación SASL SCRAM.png</span> </span></p>
<p><em>Figura 3: Configuración de seguridad: habilitar autenticación SASL/SCRAM</em></p>
<ul>
<li>Debemos habilitar el acceso al grupo de seguridad MSK desde el grupo de seguridad o el rango de direcciones IP del clúster EKS.</li>
</ul>
<h3 id="Creating-an-EKS-Cluster" class="common-anchor-header">Creación de un clúster EKS</h3><p>Hay muchas formas de crear un cluster EKS, como por ejemplo a través de la consola, CloudFormation, eksctl, etc. Este post mostrará cómo crear un clúster EKS utilizando eksctl.</p>
<p><code translate="no">eksctl</code> es una sencilla herramienta de línea de comandos para crear y administrar clústeres Kubernetes en Amazon EKS. Proporciona la forma más rápida y sencilla de crear un nuevo clúster con nodos para Amazon EKS. Consulte el <a href="https://eksctl.io/">sitio web</a> de eksctl para obtener más información.</p>
<ol>
<li>En primer lugar, cree un archivo <code translate="no">eks_cluster.yaml</code> con el siguiente fragmento de código. Sustituya <code translate="no">cluster-name</code> por el nombre de su clúster, sustituya <code translate="no">region-code</code> por la región de AWS en la que desea crear el clúster y sustituya <code translate="no">private-subnet-idx</code> por sus subredes privadas. Nota: Este archivo de configuración crea un clúster EKS en una VPC existente especificando subredes privadas. Si desea crear una nueva VPC, elimine la configuración de VPC y subredes y, a continuación, <code translate="no">eksctl</code> creará automáticamente una nueva.</li>
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
<li>A continuación, ejecute el comando <code translate="no">eksctl</code> para crear el clúster EKS.</li>
</ol>
<pre><code translate="no">eksctl create cluster -f eks_cluster.yaml
<button class="copy-code-btn"></button></code></pre>
<p>Este comando creará los siguientes recursos:</p>
<ul>
<li><p>Un clúster EKS con la versión especificada.</p></li>
<li><p>Un grupo de nodos gestionados con tres instancias EC2 m6i.2xlarge.</p></li>
<li><p>Un <a href="https://docs.aws.amazon.com/en_us/eks/latest/userguide/enable-iam-roles-for-service-accounts.html">proveedor de identidad IAM OIDC</a> y una ServiceAccount llamada <code translate="no">aws-load-balancer-controller</code>, que utilizaremos más adelante cuando instalemos el <strong>AWS Load Balancer Controller</strong>.</p></li>
<li><p>Un espacio de nombres <code translate="no">milvus</code> y una ServiceAccount <code translate="no">milvus-s3-access-sa</code> dentro de este espacio de nombres. Este espacio de nombres se utilizará más adelante cuando configuremos S3 como almacenamiento de objetos para Milvus.</p>
<p>Nota: Para simplificar, a <code translate="no">milvus-s3-access-sa</code> se le conceden permisos completos de acceso a S3. En despliegues de producción, se recomienda seguir el principio del menor privilegio y sólo conceder acceso al cubo S3 específico utilizado para Milvus.</p></li>
<li><p>Múltiples complementos, donde <code translate="no">vpc-cni</code>, <code translate="no">coredns</code>, <code translate="no">kube-proxy</code> son complementos básicos requeridos por EKS. <code translate="no">aws-ebs-csi-driver</code> es el controlador CSI de AWS EBS que permite a los clústeres EKS gestionar el ciclo de vida de los volúmenes de Amazon EBS.</p></li>
</ul>
<p>Ahora sólo tenemos que esperar a que se complete la creación del clúster.</p>
<p>Esperar a que se complete la creación del clúster. Durante el proceso de creación del clúster, el archivo <code translate="no">kubeconfig</code> se creará o actualizará automáticamente. También puede actualizarlo manualmente ejecutando el siguiente comando. Asegúrese de sustituir <code translate="no">region-code</code> por la región de AWS en la que se está creando el clúster y <code translate="no">cluster-name</code> por el nombre del clúster.</p>
<pre><code translate="no">aws eks update-kubeconfig --region &lt;region-code&gt; --name &lt;cluster-name&gt;
<button class="copy-code-btn"></button></code></pre>
<p>Una vez creado el clúster, puede ver los nodos ejecutando:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> nodes -A -o wide
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li>Crear un <code translate="no">ebs-sc</code> StorageClass configurado con GP3 como tipo de almacenamiento, y establecerlo como StorageClass por defecto. Milvus utiliza etcd como su Meta Storage y necesita esta StorageClass para crear y administrar PVCs.</li>
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
<p>A continuación, establezca la StorageClass original de <code translate="no">gp2</code> como no predeterminada:</p>
<pre><code translate="no">kubectl patch storage<span class="hljs-keyword">class</span> <span class="hljs-title class_">gp2</span> -p <span class="hljs-string">&#x27;{&quot;metadata&quot;: {&quot;annotations&quot;:{&quot;storageclass.kubernetes.io/is-default-class&quot;:&quot;false&quot;}}}&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<ol start="4">
<li>Instala el AWS Load Balancer Controller. Utilizaremos este controlador más adelante para el Servicio Milvus y Attu Ingress, así que vamos a instalarlo de antemano.</li>
</ol>
<ul>
<li>Primero, añade el repo <code translate="no">eks-charts</code> y actualízalo.</li>
</ul>
<pre><code translate="no">helm repo <span class="hljs-keyword">add</span> eks https:<span class="hljs-comment">//aws.github.io/eks-charts</span>
helm repo update
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Luego, instala el AWS Load Balancer Controller. Sustituye <code translate="no">cluster-name</code> por el nombre de tu clúster. La ServiceAccount denominada <code translate="no">aws-load-balancer-controller</code> ya se creó cuando creamos el clúster EKS en los pasos anteriores.</li>
</ul>
<pre><code translate="no">helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
 -n kube-system \
 --<span class="hljs-built_in">set</span> clusterName=&lt;cluster-name&gt; \
 --<span class="hljs-built_in">set</span> serviceAccount.create=<span class="hljs-literal">false</span> \
 --<span class="hljs-built_in">set</span> serviceAccount.name=aws-load-balancer-controller
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Compruebe si el controlador se ha instalado correctamente.</li>
</ul>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> deployment -n kube-system aws-load-balancer-controller
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>El resultado debería ser el siguiente:</li>
</ul>
<pre><code translate="no">NAME                           READY   UP-TO-DATE   AVAILABLE   AGE
aws-load-balancer-controller   2/2     2            2           12m
<button class="copy-code-btn"></button></code></pre>
<h3 id="Deploying-a-Milvus-Cluster" class="common-anchor-header">Desplegando un Cluster Milvus</h3><p>Milvus soporta múltiples métodos de despliegue, como Operator y Helm. Operator es más simple, pero Helm es más directo y flexible. Usaremos Helm para desplegar Milvus en este ejemplo.</p>
<p>Al desplegar Milvus con Helm, puede personalizar la configuración a través del archivo <code translate="no">values.yaml</code>. Haga clic en <a href="https://raw.githubusercontent.com/milvus-io/milvus-helm/master/charts/milvus/values.yaml">values.yaml</a> para ver todas las opciones. Por defecto, Milvus crea en el cluster minio y pulsar como Almacenamiento de Objetos y Almacenamiento de Mensajes, respectivamente. Vamos a hacer algunos cambios de configuración para que sea más adecuado para la producción.</p>
<ol>
<li>En primer lugar, añada el repositorio Milvus Helm y actualícelo.</li>
</ol>
<pre><code translate="no">helm repo <span class="hljs-keyword">add</span> milvus https:<span class="hljs-comment">//zilliztech.github.io/milvus-helm/</span>
helm repo update
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>Cree un archivo <code translate="no">milvus_cluster.yaml</code> con el siguiente fragmento de código. Este fragmento de código personaliza la configuración de Milvus, como la configuración de Amazon S3 como almacenamiento de objetos y Amazon MSK como cola de mensajes. Proporcionaremos explicaciones detalladas y orientación sobre la configuración más adelante.</li>
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
<p>El código contiene seis secciones. Sigue las siguientes instrucciones para cambiar las configuraciones correspondientes.</p>
<p><strong>Sección 1</strong>: Configurar S3 como almacenamiento de objetos. El serviceAccount concede a Milvus acceso a S3 (en este caso, es <code translate="no">milvus-s3-access-sa</code>, que se creó cuando creamos el cluster EKS). Asegúrese de sustituir <code translate="no">&lt;region-code&gt;</code> por la región de AWS en la que se encuentra su clúster. Sustituya <code translate="no">&lt;bucket-name&gt;</code> por el nombre de su bucket de S3 y <code translate="no">&lt;root-path&gt;</code> por el prefijo del bucket de S3 (este campo puede dejarse vacío).</p>
<p><strong>Sección 2</strong>: Configure MSK como almacenamiento de mensajes. Sustituya <code translate="no">&lt;broker-list&gt;</code> por las direcciones de endpoint correspondientes al tipo de autenticación SASL/SCRAM de MSK. Sustituya <code translate="no">&lt;username&gt;</code> y <code translate="no">&lt;password&gt;</code> por el nombre de usuario y la contraseña de la cuenta MSK. Puede obtener <code translate="no">&lt;broker-list&gt;</code> de la información del cliente MSK, como se muestra en la imagen siguiente.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_4_Configure_MSK_as_the_Message_Storage_of_Milvus_a9e602e0b9.png" alt="Figure 4 Configure MSK as the Message Storage of Milvus.png" class="doc-image" id="figure-4-configure-msk-as-the-message-storage-of-milvus.png" />
   </span> <span class="img-wrapper"> <span>Figura 4 Configurar MSK como almacenamiento de mensajes de Milvus.png</span> </span></p>
<p><em>Figura 4: Configurar MSK como almacenamiento de mensajes de Milvus</em></p>
<p><strong>Sección 3:</strong> Exponer el servicio Milvus y permitir el acceso desde fuera del cluster. El punto final de Milvus utiliza el servicio de tipo ClusterIP por defecto, que sólo es accesible dentro del clúster EKS. Si es necesario, puede cambiarlo a tipo LoadBalancer para permitir el acceso desde fuera del cluster EKS. El servicio de tipo LoadBalancer utiliza Amazon NLB como balanceador de carga. De acuerdo con las mejores prácticas de seguridad, <code translate="no">aws-load-balancer-scheme</code> está configurado como modo interno por defecto aquí, lo que significa que sólo se permite el acceso a Milvus desde la intranet. Haga clic para <a href="https://docs.aws.amazon.com/eks/latest/userguide/network-load-balancing.html">ver las instrucciones de configuración de NLB</a>.</p>
<p><strong>Sección 4:</strong> Instale y configure <a href="https://github.com/zilliztech/attu">Attu</a>, una herramienta de administración de milvus de código abierto. Tiene una GUI intuitiva que le permite interactuar fácilmente con Milvus. Habilitamos Attu, configuramos el ingreso utilizando AWS ALB y lo configuramos en el tipo <code translate="no">internet-facing</code> para que se pueda acceder a Attu a través de Internet. Haga clic en <a href="https://docs.aws.amazon.com/eks/latest/userguide/alb-ingress.html">este documento</a> para obtener la guía de configuración de ALB.</p>
<p><strong>Sección 5:</strong> Habilitar el despliegue en HA de los componentes principales de Milvus. Milvus contiene múltiples componentes independientes y desacoplados. Por ejemplo, el servicio coordinador actúa como capa de control, gestionando la coordinación para los componentes Raíz, Consulta, Datos e Índice. El Proxy en la capa de acceso sirve como punto final de acceso a la base de datos. Por defecto, estos componentes sólo tienen una réplica de pod. El despliegue de múltiples réplicas de estos componentes de servicio es especialmente necesario para mejorar la disponibilidad de Milvus.</p>
<p><strong>Nota:</strong> El despliegue de múltiples réplicas de los componentes coordinadores de Raíz, Consulta, Datos e Índice requiere la opción <code translate="no">activeStandby</code> activada.</p>
<p><strong>Sección 6:</strong> Ajuste la asignación de recursos para los componentes de Milvus para satisfacer los requisitos de sus cargas de trabajo. El sitio web de Milvus también proporciona una <a href="https://milvus.io/tools/sizing/">herramienta de dimensionamiento</a> para generar sugerencias de configuración basadas en el volumen de datos, dimensiones del vector, tipos de índice, etc. También puede generar un archivo de configuración Helm con un solo clic. La siguiente configuración es la sugerencia dada por la herramienta para 1 millón de vectores de 1024 dimensiones y tipo de índice HNSW.</p>
<ol>
<li>Utilice Helm para crear Milvus (desplegado en el espacio de nombres <code translate="no">milvus</code>). Nota: Puede sustituir <code translate="no">&lt;demo&gt;</code> por un nombre personalizado.</li>
</ol>
<pre><code translate="no">helm install &lt;demo&gt; milvus/milvus -n milvus -f milvus_cluster.yaml
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>Ejecute el siguiente comando para comprobar el estado del despliegue.</li>
</ol>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> deployment -n milvus
<button class="copy-code-btn"></button></code></pre>
<p>La siguiente salida muestra que los componentes de Milvus están todos DISPONIBLES, y los componentes de coordinación tienen múltiples réplicas habilitadas.</p>
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
<h3 id="Accessing-and-Managing-Milvus" class="common-anchor-header">Acceso y gestión de Milvus</h3><p>Hasta ahora, hemos desplegado con éxito la base de datos vectorial Milvus. Ahora, podemos acceder a Milvus a través de puntos finales. Milvus expone puntos finales a través de servicios Kubernetes. Attu expone puntos finales a través de Kubernetes Ingress.</p>
<h4 id="Accessing-Milvus-endpoints" class="common-anchor-header"><strong>Acceso a los puntos finales de Milvus</strong></h4><p>Ejecute el siguiente comando para obtener los puntos finales del servicio:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> svc -n milvus
<button class="copy-code-btn"></button></code></pre>
<p>Puede ver varios servicios. Milvus admite dos puertos, el puerto <code translate="no">19530</code> y el puerto <code translate="no">9091</code>:</p>
<ul>
<li>El puerto <code translate="no">19530</code> es para gRPC y RESTful API. Es el puerto por defecto cuando se conecta a un servidor Milvus con diferentes Milvus SDKs o clientes HTTP.</li>
<li>El puerto <code translate="no">9091</code> es un puerto de gestión para la recopilación de métricas, perfiles pprof y sondas de salud dentro de Kubernetes.</li>
</ul>
<p>El servicio <code translate="no">demo-milvus</code> proporciona un punto final de acceso a la base de datos, que se utiliza para establecer una conexión desde los clientes. Utiliza NLB como equilibrador de carga del servicio. Puede obtener el punto final del servicio en la columna <code translate="no">EXTERNAL-IP</code>.</p>
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
<h4 id="Managing-Milvus-using-Attu" class="common-anchor-header"><strong>Gestión de Milvus con Attu</strong></h4><p>Como se ha descrito anteriormente, hemos instalado Attu para gestionar Milvus. Ejecute el siguiente comando para obtener el endpoint:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> ingress -n milvus
<button class="copy-code-btn"></button></code></pre>
<p>Puede ver un Ingress llamado <code translate="no">demo-milvus-attu</code>, donde la columna <code translate="no">ADDRESS</code> es la URL de acceso.</p>
<pre><code translate="no">NAME            CLASS   HOSTS   ADDRESS                                     PORTS   AGE
demo-milvus-attu   &lt;none&gt;   *       k8s-attu-xxxx.us-west-2.elb.amazonaws.com   80      27s
<button class="copy-code-btn"></button></code></pre>
<p>Abra la dirección Ingress en un navegador y vea la siguiente página. Haga clic en <strong>Conectar</strong> para iniciar sesión.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_5_Log_in_to_your_Attu_account_bde25a6da5.png" alt="Figure 5 Log in to your Attu account.png" class="doc-image" id="figure-5-log-in-to-your-attu-account.png" />
   </span> <span class="img-wrapper"> <span>Figura 5 Inicie sesión en su cuenta Attu.png</span> </span></p>
<p><em>Figura 5: Inicie sesión en su cuenta de Attu</em></p>
<p>Después de iniciar sesión, puede gestionar las bases de datos de Milvus a través de Attu.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_6_The_Attu_interface_3e818e6833.png" alt="Figure 6 The Attu interface.png" class="doc-image" id="figure-6-the-attu-interface.png" />
   </span> <span class="img-wrapper"> <span>Figura 6 La interfaz de Attu.png</span> </span></p>
<p>Figura 6: La interfaz de Attu</p>
<h2 id="Testing-the-Milvus-vector-database" class="common-anchor-header">Probar la base de datos vectorial Milvus<button data-href="#Testing-the-Milvus-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>Utilizaremos el <a href="https://milvus.io/docs/example_code.md">código de ejemplo</a> de Milvus para probar si la base de datos Milvus funciona correctamente. En primer lugar, descargue el código de ejemplo <code translate="no">hello_milvus.py</code> utilizando el siguiente comando:</p>
<pre><code translate="no">wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/pymilvus/master/examples/hello_milvus.py</span>
<button class="copy-code-btn"></button></code></pre>
<p>Modifique el host en el código de ejemplo al punto final del servicio Milvus.</p>
<pre><code translate="no"><span class="hljs-built_in">print</span>(fmt.<span class="hljs-built_in">format</span>(<span class="hljs-string">&quot;start connecting to Milvus&quot;</span>))
connections.connect(<span class="hljs-string">&quot;default&quot;</span>, host=<span class="hljs-string">&quot;milvus-nlb-xxx.elb.us-west-2.amazonaws.com&quot;</span>, port=<span class="hljs-string">&quot;19530&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Ejecute el código:</p>
<pre><code translate="no">python3 hello_milvus.py
<button class="copy-code-btn"></button></code></pre>
<p>Si el sistema devuelve el siguiente resultado, indica que Milvus funciona con normalidad.</p>
<pre><code translate="no">=== start connecting to <span class="hljs-title class_">Milvus</span>     ===
<span class="hljs-title class_">Does</span> collection hello_milvus exist <span class="hljs-keyword">in</span> <span class="hljs-title class_">Milvus</span>: <span class="hljs-title class_">False</span>
=== <span class="hljs-title class_">Create</span> collection <span class="hljs-string">`hello_milvus`</span> ===
=== <span class="hljs-title class_">Start</span> inserting entities       ===
<span class="hljs-title class_">Number</span> <span class="hljs-keyword">of</span> entities <span class="hljs-keyword">in</span> <span class="hljs-title class_">Milvus</span>: <span class="hljs-number">3000</span>
=== <span class="hljs-title class_">Start</span> <span class="hljs-title class_">Creating</span> index <span class="hljs-variable constant_">IVF_FLAT</span>  ===
=== <span class="hljs-title class_">Start</span> loading                  ===
<button class="copy-code-btn"></button></code></pre>
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
    </button></h2><p>Este post presenta <a href="https://milvus.io/intro">Milvus</a>, una de las bases de datos vectoriales de código abierto más populares, y proporciona una guía sobre el despliegue de Milvus en AWS utilizando servicios gestionados como Amazon EKS, S3, MSK y ELB para lograr una mayor elasticidad y fiabilidad.</p>
<p>Como componente central de varios sistemas GenAI, en particular Retrieval Augmented Generation (RAG), Milvus admite y se integra con una variedad de modelos y marcos GenAI principales, incluidos Amazon Sagemaker, PyTorch, HuggingFace, LlamaIndex y LangChain. Comience hoy mismo su viaje hacia la innovación GenAI con Milvus.</p>
<h2 id="References" class="common-anchor-header">Referencias<button data-href="#References" class="anchor-icon" translate="no">
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
<li><a href="https://docs.aws.amazon.com/eks/latest/userguide/getting-started.html">Guía del usuario de Amazon EKS</a></li>
<li><a href="https://milvus.io/">Sitio web oficial de Milvus</a></li>
<li><a href="https://github.com/milvus-io/milvus">Repositorio GitHub de Milvus</a></li>
<li><a href="https://eksctl.io/">Sitio web oficial de eksctl</a></li>
</ul>
