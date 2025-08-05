---
id: deploying-milvus-on-kubernetes-just-got-easier-with-the-milvus-operator.md
title: Desplegar Milvus en Kubernetes es ahora más fácil con Milvus Operator
author: Min Yin
date: 2025-08-04T00:00:00.000Z
desc: >-
  Milvus Operator es una herramienta de gestión nativa de Kubernetes que
  automatiza el ciclo de vida completo de las implementaciones de bases de datos
  vectoriales de Milvus.
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
<p>Configurar un clúster Milvus listo para producción no debería ser como desactivar una bomba. Sin embargo, cualquiera que haya configurado manualmente despliegues Kubernetes para bases de datos vectoriales conoce el ejercicio: docenas de archivos YAML, gestión de dependencias intrincada y esa sensación de hundimiento cuando algo se rompe a las 2 AM y no estás seguro de cuál de los 47 archivos de configuración es el culpable.</p>
<p>El enfoque tradicional para desplegar Milvus implica orquestar múltiples servicios -etcd para el almacenamiento de metadatos, Pulsar para la cola de mensajes, MinIO para el almacenamiento de objetos y los diversos componentes de Milvus. Cada servicio requiere una configuración cuidadosa, una secuencia de arranque adecuada y un mantenimiento continuo. Si esto se extiende a múltiples entornos o clústeres, la complejidad operativa se vuelve abrumadora.</p>
<p>Aquí es donde <a href="https://github.com/zilliztech/milvus-operator"><strong>Milvus Operator</strong></a> cambia fundamentalmente las reglas del juego. En lugar de gestionar la infraestructura manualmente, usted describe lo que desea y Operator se encarga del cómo.</p>
<h2 id="What-is-the-Milvus-Operator" class="common-anchor-header">¿Qué es Milvus Operator?<button data-href="#What-is-the-Milvus-Operator" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/install_cluster-milvusoperator.md"><strong>Milvus Operator</strong></a> es una herramienta de gestión nativa de Kubernetes que automatiza el ciclo de vida completo de las implementaciones de bases de datos vectoriales de Milvus. Construido sobre el patrón de Kubernetes Operator, encapsula años de conocimiento operativo sobre la ejecución de Milvus en producción y codifica esa experiencia en un software que se ejecuta junto con su clúster.</p>
<p>Piense en ello como tener un administrador experto de Milvus que nunca duerme, nunca comete errores tipográficos y tiene memoria perfecta de cada detalle de configuración. El Operator supervisa continuamente la salud de su clúster, gestiona automáticamente las decisiones de escalado, gestiona las actualizaciones sin tiempo de inactividad y se recupera de los fallos más rápido que cualquier operador humano.</p>
<p>En esencia, Operator ofrece cuatro funciones esenciales.</p>
<ul>
<li><p><strong>Despliegue automatizado</strong>: Configure un clúster Milvus totalmente funcional con un único manifiesto.</p></li>
<li><p><strong>Gestión del ciclo de vida</strong>: Automatice las actualizaciones, el escalado horizontal y el desmantelamiento de recursos en un orden definido y seguro.</p></li>
<li><p><strong>Supervisión y comprobaciones de estado integradas</strong>: Supervise continuamente el estado de los componentes de Milvus y sus dependencias relacionadas, incluidos etcd, Pulsar y MinIO.</p></li>
<li><p><strong>Mejores prácticas operativas por defecto</strong>: Aplique patrones nativos de Kubernetes que garanticen la confiabilidad sin requerir un profundo conocimiento de la plataforma.</p></li>
</ul>
<h3 id="Understanding-the-Kubernetes-Operator-Pattern" class="common-anchor-header">Comprender el patrón de operador de Kubernetes</h3><p>Antes de explorar las ventajas de Milvus Operator, entendamos primero la base sobre la que se construye: el <strong>patrón Kubernetes Operator.</strong></p>
<p>El patrón Kubernetes Operator ayuda a gestionar aplicaciones complejas que necesitan algo más que las funciones básicas de Kubernetes. Un Operador tiene tres partes principales:</p>
<ul>
<li><p><strong>Las definiciones de recursos personalizadas</strong> permiten describir la aplicación mediante archivos de configuración al estilo de Kubernetes.</p></li>
<li><p><strong>Un Controlador</strong> observa estas configuraciones y realiza los cambios necesarios en su clúster.</p></li>
<li><p><strong>State Management</strong> se asegura de que su clúster coincide con lo que usted ha solicitado y corrige cualquier diferencia.</p></li>
</ul>
<p>Esto significa que usted puede describir su despliegue Milvus de una manera familiar, y el Operador se encarga de todo el trabajo detallado de la creación de vainas, la creación de redes, y la gestión del ciclo de vida ...</p>
<h2 id="How-the-Milvus-Operator-Works" class="common-anchor-header">Cómo funciona Milvus Operator<button data-href="#How-the-Milvus-Operator-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Operator sigue un proceso directo que hace que la gestión de la base de datos sea mucho más sencilla. Desglosemos el modelo operativo central de Milvus Operator:</p>
<ol>
<li><p><strong>Recurso personalizado (CR):</strong> Los usuarios definen un despliegue de Milvus utilizando un CR (por ejemplo, tipo: <code translate="no">Milvus</code>). Este archivo incluye configuraciones tales como modo de cluster, versión de imagen, requerimientos de recursos y dependencias.</p></li>
<li><p><strong>Lógica del controlador:</strong> El controlador del Operator está atento a las CR nuevas o actualizadas. Una vez que detecta un cambio, orquesta la creación de los componentes necesarios: servicios Milvus y dependencias como etcd, Pulsar y MinIO.</p></li>
<li><p><strong>Gestión automatizada del ciclo de vida:</strong> Cuando se producen cambios, como la actualización de la versión o la modificación del almacenamiento, Operator realiza actualizaciones continuas o reconfigura los componentes sin interrumpir el clúster.</p></li>
<li><p><strong>Autocuración:</strong> El controlador comprueba continuamente el estado de cada componente. Si algo falla, sustituye automáticamente el pod o restaura el estado del servicio para garantizar el tiempo de actividad.</p></li>
</ol>
<p>Este enfoque es mucho más potente que los despliegues YAML o Helm tradicionales porque proporciona una gestión continua en lugar de una configuración inicial.</p>
<h2 id="Why-Use-Milvus-Operator-Instead-of-Helm-or-YAML" class="common-anchor-header">¿Por qué utilizar Milvus Operator en lugar de Helm o YAML?<button data-href="#Why-Use-Milvus-Operator-Instead-of-Helm-or-YAML" class="anchor-icon" translate="no">
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
    </button></h2><p>Al desplegar Milvus, puede elegir entre archivos YAML manuales, gráficos Helm o el Operador Milvus. Cada uno tiene su lugar, pero el Operator ofrece ventajas significativas para las operaciones en curso.</p>
<h3 id="Operation-Automation" class="common-anchor-header">Automatización de operaciones</h3><p>Los métodos tradicionales requieren trabajo manual para las tareas rutinarias. El escalado implica actualizar varios archivos de configuración y coordinar los cambios. Las actualizaciones requieren una planificación cuidadosa para evitar interrupciones del servicio. Operator gestiona estas tareas automáticamente. Puede detectar cuándo es necesario escalar y realizar los cambios de forma segura. Las ampliaciones se convierten en simples actualizaciones de la configuración que el operador ejecuta en la secuencia adecuada y con capacidad de reversión si es necesario.</p>
<h3 id="Better-State-Visibility" class="common-anchor-header">Mejor visibilidad del estado</h3><p>Los archivos YAML le dicen a Kubernetes lo que usted quiere, pero no le muestran el estado actual de su sistema. Helm ayuda con la gestión de la configuración, pero no supervisa el estado de ejecución de su aplicación. El Operador vigila continuamente todo su clúster. Puede detectar problemas como problemas de recursos o respuestas lentas y tomar medidas antes de que se conviertan en problemas graves. Esta supervisión proactiva mejora significativamente la fiabilidad.</p>
<h3 id="Easier-Long-term-Management" class="common-anchor-header">Gestión a largo plazo más sencilla</h3><p>Gestionar múltiples entornos con archivos YAML significa mantener sincronizados muchos archivos de configuración. Incluso con plantillas Helm, las operaciones complejas siguen requiriendo una importante coordinación manual.</p>
<p>The Operator encapsula el conocimiento de gestión de Milvus en su código. Esto significa que los equipos pueden gestionar clusters de forma efectiva sin convertirse en expertos en cada componente. La interfaz operativa se mantiene consistente a medida que su infraestructura escala.</p>
<p>Utilizar Operator significa optar por un enfoque más automatizado de la gestión de Milvus. Reduce el trabajo manual a la vez que mejora la fiabilidad a través de la experiencia integrada, ventajas valiosas a medida que las bases de datos vectoriales se vuelven más críticas para las aplicaciones.</p>
<h3 id="The-Architecture-of-Milvus-Operation" class="common-anchor-header">La arquitectura de Milvus Operation</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_operator_deployment_architecture_3ff8570480.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>El diagrama representa claramente la estructura de despliegue de Milvus Operator dentro de un clúster Kubernetes:</p>
<ul>
<li><p>Izquierda (Área azul): Componentes centrales de Operator, incluyendo el Controlador y el Milvus-CRD.</p></li>
<li><p>Derecha (Área Verde): Varios componentes del clúster Milvus, como el Proxy, el Coordinador y el Nodo.</p></li>
<li><p>Centro (Flechas - "crear/gestionar"): El flujo de operaciones que muestra cómo el Operador gestiona el cluster Milvus.</p></li>
<li><p>Parte inferior (Área naranja): Servicios dependientes como etcd y MinIO/S3/MQ.</p></li>
</ul>
<p>Esta estructura visual, con bloques de colores distintos y flechas direccionales, aclara eficazmente las interacciones y el flujo de datos entre los diferentes componentes.</p>
<h2 id="Getting-Started-with-Milvus-Operator" class="common-anchor-header">Primeros pasos con Milvus Operator<button data-href="#Getting-Started-with-Milvus-Operator" class="anchor-icon" translate="no">
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
    </button></h2><p>Esta guía le muestra cómo desplegar Milvus utilizando el Operador. Utilizaremos estas versiones en esta guía.</p>
<ul>
<li><p><strong>Sistema operativo</strong>: openEuler 22.03 LTS SP3 x86_64</p></li>
<li><p><strong>Kubernetes</strong>: v1.28.8</p></li>
<li><p><strong>Milvus</strong>: v2.5.4</p></li>
</ul>
<h3 id="1-Prerequisites" class="common-anchor-header">(1) Requisitos previos</h3><p>Su cluster Kubernetes necesita al menos una StorageClass configurada. Puede comprobar cuáles están disponibles:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> sc
<button class="copy-code-btn"></button></code></pre>
<p>En nuestro ejemplo, tenemos dos opciones:</p>
<ul>
<li><p><code translate="no">local</code> (por defecto) - utiliza discos locales</p></li>
<li><p><code translate="no">nfs-sc</code>- utiliza almacenamiento NFS (bien para pruebas, pero evítelo en producción)</p></li>
</ul>
<pre><code translate="no">RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
<span class="hljs-built_in">local</span> (default)   openebs.io/local      Delete    WaitForFirstConsumer   <span class="hljs-literal">false</span>    284d
nfs-sc            k8s-sigs.io/nfs-...   Delete    Immediate              <span class="hljs-literal">false</span>    230d
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Installing-Milvus-Operator" class="common-anchor-header">(2) Instalando Milvus Operator</h3><p>Puede instalar Operator con <a href="https://milvus.io/docs/install_cluster-milvusoperator.md#Install-with-Helm">Helm</a> o <a href="https://milvus.io/docs/install_cluster-milvusoperator.md#Install-with-kubectl">kubectl</a>. Usaremos kubectl ya que es más sencillo.</p>
<p>Descargue el manifiesto de despliegue de Operator:</p>
<pre><code translate="no">wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/zilliztech/milvus-operator/main/deploy/manifests/deployment.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>Sustituya la dirección de la imagen (opcional):</p>
<p><strong>Opcional: Utilice un registro de imágenes diferente</strong> Si no puede acceder a DockerHub o prefiere su propio registro:</p>
<p><em>Nota: La dirección del repositorio de imágenes proporcionada aquí es para fines de prueba. Sustitúyala por su dirección de repositorio real según sea necesario.</em></p>
<pre><code translate="no">sed -i <span class="hljs-string">&#x27;s#milvusdb/milvus-operator:v1.2.1#registry.milvus-mirror.cn/&amp;#g&#x27;</span> deployment.<span class="hljs-property">yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>Instale Milvus Operator:</p>
<pre><code translate="no">kubectl apply -f deployment.yaml
<button class="copy-code-btn"></button></code></pre>
<p>Después de la instalación, debería ver una salida similar a:</p>
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
<p>Verifique el despliegue de Milvus Operator y los recursos del pod:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> deployment,pod -n milvus-<span class="hljs-keyword">operator</span>
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">NAME                              READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/milvus-operator   1/1     1            1           10m
NAME                                   READY   STATUS        RESTARTS   AGE
pod/milvus-operator-54d4fb854b-7hprh   1/1     Running       0          97s
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Deploying-the-Milvus-Cluster" class="common-anchor-header">(3) Desplegando el Cluster Milvus</h3><p>Una vez que el pod Milvus Operator está en ejecución, puede desplegar el cluster Milvus con los siguientes pasos.</p>
<p>Descargue el manifiesto de despliegue del cluster Milvus:</p>
<pre><code translate="no">wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/zilliztech/milvus-operator/main/config/samples/milvus_cluster_default.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>La configuración por defecto es mínima:</p>
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
<p><strong>Para un despliegue real, querrá personalizarla:</strong></p>
<ul>
<li><p>Nombre personalizado del cluster: <code translate="no">milvus-release-v25</code></p></li>
<li><p>Custom Image: (para usar una imagen online diferente o una imagen offline local) <code translate="no">registry.milvus-mirror.cn/milvusdb/milvus:v2.5.4</code></p></li>
<li><p>Nombre personalizado de StorageClass: En entornos con múltiples clases de almacenamiento, puede que necesite especificar la StorageClass para componentes persistentes como MinIO y etcd. En este ejemplo, se utiliza <code translate="no">nfs-sc</code>.</p></li>
<li><p>Recursos personalizados: Establezca los límites de CPU y memoria para los componentes de Milvus. Por defecto, no se establecen límites, lo que podría sobrecargar sus nodos Kubernetes.</p></li>
<li><p>Eliminación automática de recursos relacionados: Por defecto, cuando se elimina el clúster Milvus, se conservan los recursos asociados.</p></li>
</ul>
<p>Para configurar parámetros adicionales, consulte:</p>
<ul>
<li><p><a href="https://github.com/zilliztech/milvus-operator/blob/main/docs/CRD/milvus.md">Definición de recursos personalizados de Milvus</a></p></li>
<li><p><a href="https://artifacthub.io/packages/helm/apache/pulsar/3.3.0?modal=values">Valores de Pulsar</a></p></li>
</ul>
<p>El manifiesto modificado es:</p>
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
<p>Desplegar el clúster Milvus:</p>
<pre><code translate="no">kubectl apply -f milvus_cluster_default.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Verifying-Milvus-Cluster-Status" class="common-anchor-header">Verificación del estado del clúster Milvus</h4><p>Milvus Operator configura primero las dependencias de middleware para Milvus-como etcd, Zookeeper, Pulsar y MinIO-antes de desplegar los componentes de Milvus (por ejemplo, proxy, coordinador y nodos).</p>
<p>Ver Despliegues:</p>
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
<p>Nota especial:</p>
<p>Puede observar que el Operador Milvus crea un despliegue <code translate="no">standalone</code> y <code translate="no">querynode-1</code> con 0 réplicas.</p>
<p>Esto es intencionado. Hemos enviado un problema al repositorio de Milvus Operator, la respuesta oficial es:</p>
<ul>
<li><p>a. Los despliegues funcionan como se espera. La versión independiente se mantiene para permitir transiciones sin problemas de un clúster a un despliegue independiente sin interrupción del servicio.</p></li>
<li><p>b. Disponer tanto de <code translate="no">querynode-0</code> como de <code translate="no">querynode-1</code> es útil durante las actualizaciones continuas. Al final, sólo uno de ellos estará activo.</p></li>
</ul>
<h4 id="Verifying-That-All-Pods-Are-Running-Correctly" class="common-anchor-header">Verificación de que todos los Pods funcionan correctamente</h4><p>Una vez que su cluster Milvus esté listo, verifique que todos los pods están funcionando como se esperaba:</p>
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
<h4 id="Verifying-the-StorageClass" class="common-anchor-header">Verificación de la StorageClass</h4><p>Asegúrese de que su StorageClass personalizada (<code translate="no">nfs-sc</code>) y las capacidades de almacenamiento especificadas se han aplicado correctamente:</p>
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
<h4 id="Verifying-Milvus-Resource-Limits" class="common-anchor-header">Verificación de los límites de recursos de Milvus</h4><p>Por ejemplo, para verificar que los límites de recursos para el componente <code translate="no">mixcoord</code> se han aplicado correctamente, ejecute:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> deployment milvus-release-v25-milvus-mixcoord -o jsonpath=<span class="hljs-string">&#x27;{.spec.template.spec.containers[*].resources.limits}&#x27;</span> | jq
{
  <span class="hljs-string">&quot;cpu&quot;</span>: <span class="hljs-string">&quot;2&quot;</span>,
  <span class="hljs-string">&quot;memory&quot;</span>: <span class="hljs-string">&quot;8Gi&quot;</span>
}
<button class="copy-code-btn"></button></code></pre>
<h4 id="Verifying-the-Custom-Image" class="common-anchor-header">Verificación de la imagen personalizada</h4><p>Confirme que se está utilizando la imagen personalizada correcta:</p>
<pre><code translate="no">kubectl get deployment milvus-release-v25-milvus-mixcoord -o jsonpath=<span class="hljs-string">&#x27;{.spec.template.spec.containers[0].image}&#x27;</span>
registry.milvus-mirror.cn/milvusdb/milvus:v2.5.4
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Accessing-Your-Cluster-from-Outside" class="common-anchor-header">(4) Acceso a su cluster desde el exterior</h3><p>Una pregunta común es: ¿Cómo puede acceder a los servicios Milvus desde fuera de su clúster Kubernetes?</p>
<p>Por defecto, el servicio Milvus desplegado por el Operador es de tipo <code translate="no">ClusterIP</code>, lo que significa que sólo es accesible dentro del clúster. Para exponerlo externamente, debe definir un método de acceso externo. Esta guía opta por el enfoque más simple: utilizar un NodePort.</p>
<p>Cree y edite el manifiesto del servicio para el acceso externo:</p>
<pre><code translate="no">vi milvus-external-svc.yaml
<button class="copy-code-btn"></button></code></pre>
<p>Incluya el siguiente contenido:</p>
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
<li>Aplique el manifiesto de servicio externo:</li>
</ol>
<pre><code translate="no">kubectl apply -f milvus-external-svc.yaml
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>Compruebe el estado del servicio externo:</li>
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
<li>Acceso a Milvus WebUI</li>
</ol>
<p>Milvus proporciona una GUI integrada-la Milvus WebUI-que mejora la observabilidad con una interfaz intuitiva. Utilícela para supervisar las métricas de los componentes de Milvus y sus dependencias, revisar información detallada sobre bases de datos y colecciones, e inspeccionar los detalles completos de la configuración. Para más detalles, consulte la <a href="https://milvus.io/docs/milvus-webui.md">documentación oficial de Milvus WebUI</a>.</p>
<p>Tras el despliegue, abra la siguiente URL en su navegador (sustituya <code translate="no">&lt;any_k8s_node_IP&gt;</code> por la dirección IP de cualquier nodo Kubernetes):</p>
<p><code translate="no">http://&lt;any_k8s_node_IP&gt;:31531/webui/</code></p>
<p>Esto iniciará la interfaz WebUI.</p>
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
    </button></h2><p><strong>Milvus Operator</strong> es más que una herramienta de despliegue: es una inversión estratégica en excelencia operativa para la infraestructura de bases de datos de vectores. Al automatizar las tareas rutinarias e integrar las mejores prácticas en su entorno Kubernetes, libera a los equipos para que se centren en lo que más importa: crear y mejorar aplicaciones basadas en IA.</p>
<p>La adopción de la gestión basada en operadores requiere cierto esfuerzo inicial, incluidos cambios en los flujos de trabajo y los procesos de los equipos. Pero para las organizaciones que operan a gran escala -o que planean hacerlo- los beneficios a largo plazo son significativos: mayor fiabilidad, menor sobrecarga operativa y ciclos de despliegue más rápidos y coherentes.</p>
<p>A medida que la IA se convierte en el núcleo de las operaciones empresariales modernas, la necesidad de una infraestructura de base de datos vectorial sólida y escalable no hace más que crecer. Milvus Operator respalda esta evolución ofreciendo un enfoque maduro y centrado en la automatización que se adapta a su carga de trabajo y a sus necesidades específicas.</p>
<p>Si su equipo se enfrenta a una complejidad operativa, prevé un crecimiento o simplemente desea reducir la gestión manual de la infraestructura, la adopción temprana de Milvus Operator puede ayudarle a evitar futuras deudas técnicas y mejorar la resistencia general del sistema.</p>
<p>El futuro de la infraestructura es inteligente, automatizado y fácil de desarrollar. <strong>Milvus Operator lleva ese futuro a su capa de base de datos, hoy mismo.</strong></p>
<hr>
