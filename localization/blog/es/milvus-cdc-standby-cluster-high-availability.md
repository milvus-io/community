---
id: milvus-cdc-standby-cluster-high-availability.md
title: >-
  Alta disponibilidad de bases de datos vectoriales: cómo crear un clúster en
  espera Milvus con CDC
author: Cal Huang
date: 2026-3-26
cover: assets.zilliz.com/download_2867bc5064.jpg
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  vector database high availability, Milvus CDC, standby cluster, disaster
  recovery, change data capture
meta_title: |
  Vector Database High Availability: Milvus CDC Standby Cluster Guide
desc: >-
  Aprenda a crear una base de datos vectorial de alta disponibilidad con Milvus
  CDC. Guía paso a paso para la replicación primaria-standby, failover y DR de
  producción.
origin: 'https://milvus.io/blog/milvus-cdc-standby-cluster-high-availability.md'
---
<p>Toda base de datos de producción necesita un plan para cuando las cosas van mal. Las bases de datos relacionales cuentan desde hace décadas con el envío WAL, la replicación binlog y la conmutación por error automatizada. Pero <a href="https://zilliz.com/learn/what-is-a-vector-database">las bases de datos vectoriales</a>, a pesar de haberse convertido en la infraestructura central de las aplicaciones de IA, todavía se están poniendo al día en este frente. En el mejor de los casos, la mayoría ofrece redundancia a nivel de nodo. Si un clúster completo se cae, hay que restaurar a partir de copias de seguridad y reconstruir <a href="https://zilliz.com/learn/vector-index">los índices vectoriales</a> desde cero, un proceso que puede llevar horas y costar miles de dólares en computación, porque regenerar <a href="https://zilliz.com/glossary/vector-embeddings">las incrustaciones</a> a través de su canalización ML no es barato.</p>
<p><a href="https://milvus.io/">Milvus</a> adopta un enfoque diferente. Ofrece una alta disponibilidad por capas: réplicas a nivel de nodo para una rápida conmutación por error dentro de un clúster, replicación basada en CDC para la protección a nivel de clúster y entre regiones, y copias de seguridad para la recuperación de la red de seguridad. Este modelo por capas es una práctica estándar en las bases de datos tradicionales; Milvus es la primera base de datos vectorial importante que lo aplica a las cargas de trabajo vectoriales.</p>
<p>Esta guía cubre dos cosas: las estrategias de alta disponibilidad disponibles para las bases de datos vectoriales (para que pueda evaluar lo que realmente significa "listo para producción"), y un tutorial práctico para configurar la replicación primaria-standby de Milvus CDC desde cero.</p>
<blockquote>
<p>Esta es <strong>la Parte 1</strong> de una serie:</p>
<ul>
<li><strong>Parte 1</strong> (este artículo): Configuración de la replicación primaria-standby en clusters nuevos</li>
<li><strong>Parte 2</strong>: Añadir CDC a un cluster existente que ya tiene datos, utilizando <a href="https://milvus.io/docs/milvus_backup_overview.md">Milvus Backup</a></li>
<li><strong>Parte 3</strong>: Gestión de la conmutación por error - promoción del sistema en espera cuando el primario deja de funcionar</li>
</ul>
</blockquote>
<h2 id="Why-Does-High-Availability-Matter-More-for-Vector-Databases" class="common-anchor-header">¿Por qué la alta disponibilidad es más importante para las bases de datos vectoriales?<button data-href="#Why-Does-High-Availability-Matter-More-for-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>Cuando una base de datos SQL tradicional deja de funcionar, se pierde el acceso a los registros estructurados, pero los propios datos suelen poder reimportarse desde fuentes anteriores. Cuando una base de datos vectorial se cae, la recuperación es fundamentalmente más difícil.</p>
<p>Las bases de datos vectoriales almacenan <a href="https://zilliz.com/glossary/vector-embeddings">representaciones</a> numéricas densas generadas por modelos de ML. Reconstruirlas significa volver a ejecutar todo el conjunto de datos a través del proceso de incrustación: cargar documentos sin procesar, agruparlos, llamar a un <a href="https://zilliz.com/ai-models">modelo de incrustación</a> y volver a indexar todo. Para un conjunto de datos con cientos de millones de vectores, esto puede llevar días y costar miles de dólares en cálculo de GPU.</p>
<p>Mientras tanto, los sistemas que dependen de la <a href="https://zilliz.com/learn/what-is-vector-search">búsqueda vectorial</a> se encuentran a menudo en la ruta crítica:</p>
<ul>
<li>Si la base de datos<strong><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">de</a></strong> vectores se cae, la recuperación se detiene y la IA devuelve respuestas genéricas o alucinadas.</li>
<li><strong>Motores de recomendación</strong> que ofrecen sugerencias de productos o contenidos en tiempo real: el tiempo de inactividad significa pérdida de ingresos.</li>
<li>Sistemas de<strong>detección de fraudes y control de anomalías</strong> que se basan en <a href="https://zilliz.com/glossary/similarity-search">la búsqueda de similitudes</a> para señalar actividades sospechosas: un vacío en la cobertura crea una ventana de vulnerabilidad.</li>
<li><strong>Sistemas de agentes autónomos</strong> que utilizan almacenes de vectores para la recuperación de memoria y herramientas: los agentes fallan o entran en bucle sin su base de conocimientos.</li>
</ul>
<p>Si está evaluando bases de datos vectoriales para cualquiera de estos casos de uso, la alta disponibilidad no es una característica que esté bien tener para comprobarla más tarde. Debe ser una de las primeras cosas que tenga en cuenta.</p>
<h2 id="What-Does-Production-Grade-HA-Look-Like-for-a-Vector-Database" class="common-anchor-header">¿Qué aspecto tiene la alta disponibilidad de nivel de producción para una base de datos vectorial?<button data-href="#What-Does-Production-Grade-HA-Look-Like-for-a-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p>No toda la alta disponibilidad es igual. Una base de datos vectorial que sólo gestiona los fallos de nodos dentro de un único clúster no tiene la "alta disponibilidad" que requiere un sistema de producción. La verdadera HA necesita cubrir tres capas:</p>
<table>
<thead>
<tr><th>Capa</th><th>Contra qué protege</th><th>Cómo funciona</th><th>Tiempo de recuperación</th><th>Pérdida de datos</th></tr>
</thead>
<tbody>
<tr><td><strong>A nivel de nodo</strong> (réplica múltiple)</td><td>Caída de un único nodo, fallo de hardware, eliminación de OOM, fallo de AZ</td><td>Copia los mismos <a href="https://milvus.io/docs/glossary.md">segmentos de datos</a> en varios nodos; otros nodos absorben la carga</td><td>Instantáneo</td><td>Cero</td></tr>
<tr><td><strong>A nivel</strong> de clúster (replicación CDC)</td><td>Caída de todo el clúster: despliegue incorrecto de K8s, eliminación del espacio de nombres, corrupción del almacenamiento</td><td>Transmite cada escritura a un clúster en espera a través del <a href="https://milvus.io/docs/four_layers.md">registro de escritura en cabeza</a>; el clúster en espera siempre va unos segundos por detrás.</td><td>Minutos</td><td>Segundos</td></tr>
<tr><td><strong>Red de seguridad</strong> (copias de seguridad periódicas)</td><td>Corrupción catastrófica de datos, ransomware, error humano que se propaga a través de la replicación</td><td>Realiza instantáneas periódicas y las almacena en una ubicación independiente.</td><td>Horas</td><td>Horas (desde la última copia de seguridad)</td></tr>
</tbody>
</table>
<p>Estas capas son complementarias, no alternativas. Un despliegue de producción debería apilarlas:</p>
<ol>
<li><strong><a href="https://milvus.io/docs/replica.md">Multi-replica</a> primero</strong> - maneja los fallos más comunes (caídas de nodos, fallos de AZ) con cero tiempo de inactividad y cero pérdida de datos.</li>
<li><strong><a href="https://milvus.io/docs/milvus-cdc-overview.md">CDC</a> a continuación</strong> - protege contra fallos que multi-replica no puede: interrupciones en todo el clúster, error humano catastrófico. El clúster en espera se encuentra en un dominio de fallo diferente.</li>
<li><strong><a href="https://milvus.io/docs/milvus_backup_overview.md">Copias de seguridad periódicas</a> siempre</strong>: su red de seguridad de último recurso. Ni siquiera el CDC puede salvarle si los datos dañados se replican en el clúster en espera antes de que usted los detecte.</li>
</ol>
<p>Cuando evalúe bases de datos vectoriales, pregúntese: ¿cuál de estas tres capas soporta realmente el producto? La mayoría de las bases de datos vectoriales actuales sólo ofrecen la primera. Milvus admite las tres, con CDC como función integrada, no como complemento de terceros.</p>
<h2 id="What-Is-Milvus-CDC-and-How-Does-It-Work" class="common-anchor-header">¿Qué es Milvus CDC y cómo funciona?<button data-href="#What-Is-Milvus-CDC-and-How-Does-It-Work" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Milvus CDC (Change Data Capture)</strong> es una función de replicación incorporada que lee el <a href="https://milvus.io/docs/four_layers.md">registro de escritura en cabeza (WAL</a> ) del clúster primario y transmite cada entrada a un clúster en espera separado. El clúster en espera replica las entradas y termina con los mismos datos, normalmente con segundos de retraso.</p>
<p>El patrón está bien establecido en el mundo de las bases de datos. MySQL tiene replicación binlog. PostgreSQL tiene envío WAL. MongoDB tiene replicación basada en oplog. Se trata de técnicas probadas que han mantenido las bases de datos relacionales y documentales funcionando en producción durante décadas. Milvus aporta el mismo enfoque a las cargas de trabajo vectoriales: es la primera <a href="https://zilliz.com/learn/what-is-a-vector-database">base de datos vectorial</a> importante que ofrece replicación basada en WAL como característica integrada.</p>
<p>Tres propiedades hacen de CDC una buena opción para la recuperación de desastres:</p>
<ul>
<li><strong>Sincronización de baja latencia.</strong> CDC transmite las operaciones a medida que se producen, no en lotes programados. En condiciones normales, el repositorio se mantiene unos segundos por detrás del primario.</li>
<li><strong>Repetición ordenada.</strong> Las operaciones llegan al repositorio en el mismo orden en que se escribieron. Los datos se mantienen coherentes sin reconciliación.</li>
<li><strong>Recuperación de puntos de control.</strong> Si el proceso CDC se bloquea o la red se cae, se reanuda desde donde lo dejó. No se omite ni duplica ningún dato.</li>
</ul>
<h3 id="How-Does-the-CDC-Architecture-Work" class="common-anchor-header">¿Cómo funciona la arquitectura CDC?</h3><p>Un despliegue CDC tiene tres componentes:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_cdc_standby_cluster_high_availability_1_7c6e5baf76.png" alt="CDC architecture showing Source Cluster with Streaming Nodes and CDC Nodes consuming the WAL, replicating data to the Target Cluster's Proxy layer, which forwards DDL/DCL/DML operations to Streaming Nodes and appends to WAL" class="doc-image" id="cdc-architecture-showing-source-cluster-with-streaming-nodes-and-cdc-nodes-consuming-the-wal,-replicating-data-to-the-target-cluster's-proxy-layer,-which-forwards-ddl/dcl/dml-operations-to-streaming-nodes-and-appends-to-wal" />
   </span> <span class="img-wrapper"> <span>La arquitectura CDC muestra el Cluster de Origen con Nodos de Streaming y Nodos CDC consumiendo el WAL, replicando los datos a la capa Proxy del Cluster de Destino, que reenvía las operaciones DDL/DCL/DML a los Nodos de Streaming y las añade al WAL</span> </span>.</p>
<table>
<thead>
<tr><th>Componente</th><th>Función</th></tr>
</thead>
<tbody>
<tr><td><strong>Cluster primario</strong></td><td>La <a href="https://milvus.io/docs/architecture_overview.md">instancia Milvus</a> de producción. Todas las lecturas y escrituras van aquí. Cada escritura se registra en el WAL.</td></tr>
<tr><td><strong>Nodo CDC</strong></td><td>Un proceso en segundo plano junto al primario. Lee las entradas de la WAL y las envía a la instancia en espera. Se ejecuta independientemente de la ruta de lectura/escritura - sin impacto en el rendimiento de las consultas o inserciones.</td></tr>
<tr><td><strong>Clúster en espera</strong></td><td>Una instancia Milvus separada que replica las entradas WAL reenviadas. Mantiene los mismos datos que el primario, con segundos de retraso. Puede servir consultas de lectura pero no acepta escrituras.</td></tr>
</tbody>
</table>
<p>El flujo: las escrituras llegan al primario → el Nodo CDC las copia al standby → el standby las replica. Nada más habla con la ruta de escritura del standby. Si el primario se cae, el standby ya tiene casi todos los datos y puede ser promovido.</p>
<h2 id="Tutorial-Setting-Up-a-Milvus-CDC-Standby-Cluster" class="common-anchor-header">Tutorial: Configuración de un clúster en espera Milvus CDC<button data-href="#Tutorial-Setting-Up-a-Milvus-CDC-Standby-Cluster" class="anchor-icon" translate="no">
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
    </button></h2><p>El resto de este artículo es un recorrido práctico. Al final, tendrá dos clusters Milvus funcionando con replicación en tiempo real entre ellos.</p>
<h3 id="Prerequisites" class="common-anchor-header">Requisitos previos</h3><p>Antes de comenzar:</p>
<ul>
<li><strong><a href="https://milvus.io/">Milvus</a> v2.6.6 o posterior.</strong> CDC requiere esta versión. Se recomienda el último parche 2.6.x.</li>
<li><strong><a href="https://milvus.io/docs/install_cluster-milvusoperator.md">Milvus Operator</a> v1.3.4 o posterior.</strong> Esta guía utiliza Operator para la gestión de clústeres en Kubernetes.</li>
<li><strong>Un clúster Kubernetes en ejecución</strong> con <code translate="no">kubectl</code> y <code translate="no">helm</code> configurados.</li>
<li><strong>Python con <a href="https://milvus.io/docs/install-pymilvus.md">pymilvus</a></strong> para el paso de configuración de replicación.</li>
</ul>
<p>Dos limitaciones en la versión actual:</p>
<table>
<thead>
<tr><th>Limitación</th><th>Detalles</th></tr>
</thead>
<tbody>
<tr><td>Una única réplica CDC</td><td>Una réplica CDC por clúster. La distribución de CDC está prevista para una futura versión.</td></tr>
<tr><td>Sin BulkInsert</td><td>No se admite<a href="https://milvus.io/docs/import-data.md">BulkInsert</a> con CDC activado. También previsto para una futura versión.</td></tr>
</tbody>
</table>
<h3 id="Step-1-Upgrade-the-Milvus-Operator" class="common-anchor-header">Paso 1: Actualizar el Operador Milvus</h3><p>Actualice Milvus Operator a la versión v1.3.4 o posterior:</p>
<pre><code translate="no">helm repo add zilliztech-milvus-operator https://zilliztech.github.io/milvus-operator/
<span class="hljs-comment"># &quot;zilliztech-milvus-operator&quot; has been added to your repositories</span>

helm repo update zilliztech-milvus-operator
<span class="hljs-comment"># Hang tight while we grab the latest from your chart repositories...</span>
<span class="hljs-comment"># ...Successfully got an update from the &quot;zilliztech-milvus-operator&quot; chart repository</span>
<span class="hljs-comment"># Update Complete. ⎈Happy Helming!⎈</span>

helm -n milvus-operator upgrade milvus-operator zilliztech-milvus-operator/milvus-operator
<span class="hljs-comment"># Release &quot;milvus-operator&quot; has been upgraded. Happy Helming!</span>
<span class="hljs-comment"># NAME: milvus-operator</span>
<span class="hljs-comment"># LAST DEPLOYED: Wed Dec  3 17:25:28 2025</span>
<span class="hljs-comment"># NAMESPACE: milvus-operator</span>
<span class="hljs-comment"># STATUS: deployed</span>
<span class="hljs-comment"># REVISION: 30</span>
<span class="hljs-comment"># TEST SUITE: None</span>
<span class="hljs-comment"># NOTES:</span>
<span class="hljs-comment"># Milvus Operator Is Starting, use `kubectl get -n milvus-operator deploy/milvus-operator` to check if its successfully installed</span>
<span class="hljs-comment"># Full Installation doc can be found in https://github.com/zilliztech/milvus-operator/blob/main/docs/installation/installation.md</span>
<span class="hljs-comment"># Quick start with `kubectl apply -f https://raw.githubusercontent.com/zilliztech/milvus-operator/main/config/samples/milvus_minimum.yaml`</span>
<span class="hljs-comment"># More samples can be found in https://github.com/zilliztech/milvus-operator/tree/main/config/samples</span>
<span class="hljs-comment"># CRD Documentation can be found in https://github.com/zilliztech/milvus-operator/tree/main/docs/CRD</span>
<span class="hljs-comment"># Administration Documentation can be found in https://github.com/zilliztech/milvus-operator/tree/main/docs/administration</span>
<button class="copy-code-btn"></button></code></pre>
<p>Compruebe que el pod de operador se está ejecutando:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> pods -n milvus-<span class="hljs-keyword">operator</span>
<span class="hljs-meta"># NAME                             READY   STATUS    RESTARTS   AGE</span>
<span class="hljs-meta"># milvus-operator-9fc99f88-h2hwz   1/1     Running   0          54s</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Deploy-the-Primary-Cluster" class="common-anchor-header">Paso 2: Despliegue del clúster primario</h3><p>Cree un archivo YAML para el cluster primario (fuente). La sección <code translate="no">cdc</code> bajo <code translate="no">components</code> indica al Operador que despliegue un Nodo CDC junto al cluster:</p>
<pre><code translate="no"><span class="hljs-comment"># This is a sample to deploy a milvus cluster with cdc.</span>
apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: source-cluster
  namespace: milvus
  labels:
    app: milvus
spec:
  mode: cluster
  components:
    image: milvusdb/milvus:v2<span class="hljs-number">.6</span><span class="hljs-number">.6</span> <span class="hljs-comment"># Use version 2.6.6 or above, as CDC is available from 2.6.6 onwards</span>
    cdc:
      replicas: <span class="hljs-number">1</span>  <span class="hljs-comment"># Currently, CDC only supports 1 replica</span>
  dependencies:
    msgStreamType: woodpecker
<button class="copy-code-btn"></button></code></pre>
<p>La configuración <code translate="no">msgStreamType: woodpecker</code> utiliza el <a href="https://milvus.io/docs/four_layers.md">Woodpecker WAL</a> integrado de Milvus en lugar de una cola de mensajes externa como Kafka o Pulsar. Woodpecker es un registro de escritura nativo de la nube introducido en Milvus 2.6 que elimina la necesidad de una infraestructura de mensajería externa.</p>
<p>Aplique la configuración:</p>
<pre><code translate="no">kubectl create namespace milvus
<span class="hljs-comment"># namespace/milvus created</span>
kubectl apply -f milvus_source_cluster.yaml
<span class="hljs-comment"># milvus.milvus.io/source-cluster created</span>
<button class="copy-code-btn"></button></code></pre>
<p>Espere a que todos los pods alcancen el estado Running. Confirme que el pod CDC está activo:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> pods -n milvus
<span class="hljs-meta"># Look for source-cluster-milvus-cdc-xxx in Running state</span>
<span class="hljs-meta"># NAME                                                READY   STATUS    RESTARTS   AGE</span>
<span class="hljs-meta"># source-cluster-milvus-cdc-66d64747bd-sckxj          1/1     Running   0          2m42s</span>
<span class="hljs-meta"># source-cluster-milvus-datanode-85f9f56fd-qgbzq       1/1     Running   0          2m42s</span>
<span class="hljs-meta"># ...</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Deploy-the-Standby-Cluster" class="common-anchor-header">Paso 3: Despliegue del cluster en espera</h3><p>El cluster en espera (destino) utiliza la misma versión de Milvus pero no incluye un componente CDC - sólo recibe datos replicados:</p>
<pre><code translate="no"><span class="hljs-comment"># This is a sample to deploy a milvus cluster with cdc.</span>
apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: target-cluster
  namespace: milvus
  labels:
    app: milvus
spec:
  mode: cluster
  components:
    image: milvusdb/milvus:v2<span class="hljs-number">.6</span><span class="hljs-number">.6</span> <span class="hljs-comment"># Use version 2.6.6 or above, as CDC is available from 2.6.6 onwards</span>
  dependencies:
    msgStreamType: woodpecker
<button class="copy-code-btn"></button></code></pre>
<p>Aplicar:</p>
<pre><code translate="no">kubectl apply -f milvus_target_cluster.yaml
<span class="hljs-comment"># milvus.milvus.io/target-cluster created</span>
<button class="copy-code-btn"></button></code></pre>
<p>Compruebe que todos los pods están en funcionamiento:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> pods -n milvus
<span class="hljs-meta"># NAME                                                   READY   STATUS    RESTARTS   AGE</span>
<span class="hljs-meta"># ...</span>
<span class="hljs-meta"># target-cluster-milvus-datanode-7ffc8cdb6b-xhzcd        1/1     Running   0          104m</span>
<span class="hljs-meta"># target-cluster-milvus-mixcoord-8649b87c98-btk7m        1/1     Running   0          104m</span>
<span class="hljs-meta"># ...</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Configure-the-Replication-Relationship" class="common-anchor-header">Paso 4: Configurar la relación de replicación</h3><p>Con ambos clusters en ejecución, configure la topología de replicación utilizando Python con <a href="https://milvus.io/docs/install-pymilvus.md">pymilvus</a>.</p>
<p>Defina los detalles de conexión del cluster y los nombres de los canales físicos (pchannel):</p>
<pre><code translate="no">source_cluster_addr = <span class="hljs-string">&quot;http://10.98.124.90:19530&quot;</span> <span class="hljs-comment"># example address — replace with your actual Milvus server address</span>
target_cluster_addr = <span class="hljs-string">&quot;http://10.109.234.172:19530&quot;</span>
source_cluster_token = <span class="hljs-string">&quot;root:Milvus&quot;</span>
target_cluster_token = <span class="hljs-string">&quot;root:Milvus&quot;</span>
source_cluster_id = <span class="hljs-string">&quot;source-cluster&quot;</span>
target_cluster_id = <span class="hljs-string">&quot;target-cluster&quot;</span>
pchannel_num = <span class="hljs-number">16</span>

source_cluster_pchannels = []
target_cluster_pchannels = []
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(pchannel_num):
    source_cluster_pchannels.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{source_cluster_id}</span>-rootcoord-dml_<span class="hljs-subst">{i}</span>&quot;</span>)
    target_cluster_pchannels.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{target_cluster_id}</span>-rootcoord-dml_<span class="hljs-subst">{i}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Construir la configuración de replicación:</p>
<pre><code translate="no">config = {
    <span class="hljs-string">&quot;clusters&quot;</span>: [
        {
            <span class="hljs-string">&quot;cluster_id&quot;</span>: source_cluster_id,
            <span class="hljs-string">&quot;connection_param&quot;</span>: {
                <span class="hljs-string">&quot;uri&quot;</span>: source_cluster_addr,
                <span class="hljs-string">&quot;token&quot;</span>: source_cluster_token
            },
            <span class="hljs-string">&quot;pchannels&quot;</span>: source_cluster_pchannels
        },
        {
            <span class="hljs-string">&quot;cluster_id&quot;</span>: target_cluster_id,
            <span class="hljs-string">&quot;connection_param&quot;</span>: {
                <span class="hljs-string">&quot;uri&quot;</span>: target_cluster_addr,
                <span class="hljs-string">&quot;token&quot;</span>: target_cluster_token
            },
            <span class="hljs-string">&quot;pchannels&quot;</span>: target_cluster_pchannels
        }
    ],
    <span class="hljs-string">&quot;cross_cluster_topology&quot;</span>: [
        {
            <span class="hljs-string">&quot;source_cluster_id&quot;</span>: source_cluster_id,
            <span class="hljs-string">&quot;target_cluster_id&quot;</span>: target_cluster_id
        }
    ]
}
<button class="copy-code-btn"></button></code></pre>
<p>Aplicar a ambos clusters:</p>
<pre><code translate="no">from pymilvus <span class="hljs-keyword">import</span> MilvusClient

source_client = MilvusClient(uri=source_cluster_addr, token=source_cluster_token)
source_client.update_replicate_configuration(**config)
source_client.<span class="hljs-built_in">close</span>()

target_client = MilvusClient(uri=target_cluster_addr, token=target_cluster_token)
target_client.update_replicate_configuration(**config)
target_client.<span class="hljs-built_in">close</span>()
<button class="copy-code-btn"></button></code></pre>
<p>Una vez que esto tenga éxito, los cambios incrementales en el primario comenzarán a replicarse automáticamente en el secundario.</p>
<h3 id="Step-5-Verify-That-Replication-Works" class="common-anchor-header">Paso 5: Verificar que la replicación funciona</h3><ol>
<li>Conéctese al primario y <a href="https://milvus.io/docs/manage-collections.md">cree una colección</a>, <a href="https://milvus.io/docs/insert-update-delete.md">inserte algunos vectores</a> y <a href="https://milvus.io/docs/load-and-release.md">cárguela</a>.</li>
<li>Ejecute una búsqueda en el primario para confirmar que los datos están ahí.</li>
<li>Conéctese al servidor en espera y ejecute la misma búsqueda.</li>
<li>Si el sistema en espera devuelve los mismos resultados, la replicación está funcionando.</li>
</ol>
<p>El <a href="https://milvus.io/docs/quickstart.md">inicio rápido de Milvus</a> cubre la creación, inserción y búsqueda de colecciones si necesita una referencia.</p>
<h2 id="Running-CDC-in-Production" class="common-anchor-header">Ejecutar CDC en producción<button data-href="#Running-CDC-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Configurar CDC es la parte más sencilla. Mantener su fiabilidad a lo largo del tiempo requiere prestar atención a algunas áreas operativas.</p>
<h3 id="Monitor-Replication-Lag" class="common-anchor-header">Supervisar el retraso en la replicación</h3><p>El sistema en espera siempre va ligeramente por detrás del primario, algo inherente a la replicación asíncrona. Con una carga normal, el retraso es de unos segundos. Pero los picos de escritura, la congestión de la red o la presión sobre los recursos del servidor en espera pueden hacer que aumente.</p>
<p>Siga el retraso como una métrica y alerte sobre él. Un retraso que crece sin recuperarse normalmente significa que el Nodo CDC no puede mantener el rendimiento de escritura. Compruebe primero el ancho de banda de la red entre clusters, y luego considere si el nodo en espera necesita más recursos.</p>
<h3 id="Use-the-Standby-for-Read-Scaling" class="common-anchor-header">Utilice el Standby para escalar la lectura</h3><p>El nodo en espera no es sólo una copia de seguridad fría que permanece inactiva hasta que se produce un desastre. Acepta <a href="https://milvus.io/docs/single-vector-search.md">solicitudes de búsqueda y consulta</a> mientras la replicación está activa: sólo se bloquean las escrituras. Esto permite usos prácticos:</p>
<ul>
<li>Enrutar cargas de trabajo de <a href="https://zilliz.com/glossary/similarity-search">búsqueda</a> o análisis de <a href="https://zilliz.com/glossary/similarity-search">similitud</a> por lotes al standby.</li>
<li>Dividir el tráfico de lectura durante las horas punta para reducir la presión sobre el primario.</li>
<li>Ejecutar consultas costosas (top-K de gran tamaño, búsquedas filtradas en grandes colecciones) sin afectar a la latencia de escritura de producción.</li>
</ul>
<p>Esto convierte su infraestructura de DR en un activo de rendimiento. El sistema en espera se gana su sustento incluso cuando nada se rompe.</p>
<h3 id="Size-the-Standby-Correctly" class="common-anchor-header">Dimensione correctamente la reserva</h3><p>El servidor en espera repite todas las escrituras del principal, por lo que necesita recursos de computación y memoria similares. Si también le envía lecturas, tenga en cuenta esa carga adicional. Los requisitos de almacenamiento son idénticos: contiene los mismos datos.</p>
<h3 id="Test-Failover-Before-You-Need-It" class="common-anchor-header">Pruebe la conmutación por error antes de necesitarla</h3><p>No espere a que se produzca una interrupción real para descubrir que su proceso de conmutación por error no funciona. Realice simulacros periódicos:</p>
<ol>
<li>Detenga las escrituras en el primario.</li>
<li>Espere a que el repositorio se ponga al día (lag → 0)</li>
<li>Promueva el sistema en espera</li>
<li>Compruebe que las consultas devuelven los resultados esperados</li>
<li>Invierta el proceso</li>
</ol>
<p>Mida cuánto tarda cada paso y documéntelo. El objetivo es hacer de la conmutación por error un procedimiento rutinario con tiempos conocidos, no una improvisación estresante a las 3 de la mañana. La Parte 3 de esta serie cubre el proceso de conmutación por error en detalle.</p>
<h2 id="Dont-Want-to-Manage-CDC-Yourself-Zilliz-Cloud-Handles-It" class="common-anchor-header">¿No quiere gestionar el CDC usted mismo? Zilliz Cloud se encarga<button data-href="#Dont-Want-to-Manage-CDC-Yourself-Zilliz-Cloud-Handles-It" class="anchor-icon" translate="no">
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
    </button></h2><p>La configuración y el funcionamiento de la replicación CDC de Milvus es potente, pero conlleva una sobrecarga operativa: usted gestiona dos clústeres, supervisa el estado de la replicación, gestiona los libros de ejecución de la conmutación por error y mantiene la infraestructura en todas las regiones. Para los equipos que desean HA de nivel de producción sin la carga operativa, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (Milvus gestionado) lo proporciona de inmediato.</p>
<p><strong>Global Cluster</strong> es la característica principal de Zilliz Cloud. Le permite ejecutar una implementación de Milvus que abarca varias regiones (Norteamérica, Europa, Asia-Pacífico, etc.) como un único clúster lógico. Utiliza la misma tecnología de replicación CDC/WAL descrita en este artículo, pero totalmente gestionada:</p>
<table>
<thead>
<tr><th>Capacidad</th><th>CDC autogestionado (este artículo)</th><th>Clúster global de Zilliz Cloud</th></tr>
</thead>
<tbody>
<tr><td><strong>Replicación</strong></td><td>Usted configura y supervisa</td><td>Canalización CDC automatizada y asíncrona</td></tr>
<tr><td><strong>Conmutación por error</strong></td><td>Manual de ejecución</td><td>Automatizado: sin cambios de código ni actualizaciones de cadenas de conexión</td></tr>
<tr><td><strong>Autorreparación</strong></td><td>Reaprovisionamiento del clúster fallido</td><td>Automático: detecta el estado obsoleto, se reinicia y se reconstruye como un nuevo secundario.</td></tr>
<tr><td><strong>Región cruzada</strong></td><td>Despliegue y gestión de ambos clústeres</td><td>Multirregión integrada con acceso de lectura local</td></tr>
<tr><td><strong>RPO</strong></td><td>Segundos (depende de su supervisión)</td><td>Segundos (no planificado) / Cero (conmutación planificada)</td></tr>
<tr><td><strong>RTO</strong></td><td>Minutos (depende de su libro de ejecución)</td><td>Minutos (automatizado)</td></tr>
</tbody>
</table>
<p>Además del clúster global, el plan Business Critical incluye funciones de recuperación ante desastres adicionales:</p>
<ul>
<li><strong>Point-in-Time Recovery (PITR)</strong> - retrocede una colección a cualquier momento dentro de la ventana de retención, útil para recuperarse de borrados accidentales o corrupción de datos que se replica al standby.</li>
<li><strong>Copia de seguridad entre regiones</strong>: replicación automatizada y continua de la copia de seguridad a una región de destino. La restauración a nuevos clústeres se realiza en cuestión de minutos.</li>
<li><strong>SLA de tiempo de actividad del 99,99%</strong>: respaldado por un despliegue multi-AZ con múltiples réplicas.</li>
</ul>
<p>Si está ejecutando búsqueda vectorial en producción y la DR es un requisito, vale la pena evaluar Zilliz Cloud junto con el enfoque Milvus autogestionado. <a href="https://zilliz.com/contact-sales">Póngase en contacto con el equipo de Zilliz</a> para obtener más información.</p>
<h2 id="Whats-Next" class="common-anchor-header">Lo que sigue<button data-href="#Whats-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>Este artículo cubrió el panorama de HA para bases de datos vectoriales y recorrió la construcción de un par primario-standby desde cero. Próximamente:</p>
<ul>
<li><strong>Parte 2</strong>: Agregar CDC a un clúster Milvus existente que ya tiene datos, utilizando <a href="https://milvus.io/docs/milvus_backup_overview.md">Milvus Backup</a> para sembrar el standby antes de habilitar la replicación.</li>
<li><strong>Parte 3</strong>: Gestión de la conmutación por error: promoción del standby, redirección del tráfico y recuperación del primario original.</li>
</ul>
<p>Permanezca atento.</p>
<hr>
<p>Si está ejecutando <a href="https://milvus.io/">Milvus</a> en producción y pensando en la recuperación de desastres, nos encantaría ayudarle:</p>
<ul>
<li>Únase a la <a href="https://slack.milvus.io/">comunidad Milvus Slack</a> para hacer preguntas, compartir su arquitectura HA y aprender de otros equipos que ejecutan Milvus a escala.</li>
<li><a href="https://milvus.io/office-hours">Reserve una sesión gratuita de 20 minutos de Milvus Office Hours</a> para revisar su configuración de recuperación ante desastres, ya sea la configuración de CDC, la planificación de la conmutación por error o la implementación multirregión.</li>
<li>Si prefiere saltarse la configuración de la infraestructura y pasar directamente a la alta disponibilidad lista para la producción, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (Milvus gestionado) ofrece alta disponibilidad entre regiones a través de su función de clúster global, sin necesidad de configuración manual de CDC.</li>
</ul>
<hr>
<p>Algunas preguntas que surgen cuando los equipos empiezan a configurar la alta disponibilidad de la base de datos vectorial:</p>
<p><strong>P: ¿Ralentiza CDC el clúster primario?</strong></p>
<p>No. El nodo CDC lee los registros WAL de forma asíncrona, independientemente de la ruta de lectura/escritura. No compite con consultas o inserciones por recursos en el primario. No verá ninguna diferencia de rendimiento con CDC activado.</p>
<p><strong>P: ¿Puede CDC replicar datos que existían antes de su activación?</strong></p>
<p>No, CDC sólo captura los cambios desde el momento en que se activa. Para introducir datos existentes en el sistema en espera, utilice <a href="https://milvus.io/docs/milvus_backup_overview.md">Milvus Backup</a> para sembrar primero el sistema en espera y, a continuación, active CDC para la replicación continua. La parte 2 de esta serie cubre este flujo de trabajo.</p>
<p><strong>P: ¿Sigo necesitando CDC si ya tengo activada la réplica múltiple?</strong></p>
<p>Protegen contra diferentes modos de fallo. <a href="https://milvus.io/docs/replica.md">Multi-replica</a> mantiene copias de los mismos <a href="https://milvus.io/docs/glossary.md">segmentos</a> a través de nodos dentro de un cluster - genial para fallos de nodos, inútil cuando todo el cluster desaparece (mal despliegue, interrupción de AZ, eliminación de espacio de nombres). CDC mantiene un cluster separado en un dominio de fallo diferente con datos casi en tiempo real. Para todo lo que vaya más allá de un entorno de desarrollo, se necesitan ambos.</p>
<p><strong>P: ¿Cómo se compara Milvus CDC con la replicación en otras bases de datos vectoriales?</strong></p>
<p>La mayoría de las bases de datos vectoriales actuales ofrecen redundancia a nivel de nodo (equivalente a la réplica múltiple) pero carecen de replicación a nivel de clúster. Milvus es actualmente la única base de datos vectorial importante con replicación CDC incorporada basada en WAL - el mismo patrón probado que las bases de datos relacionales como PostgreSQL y MySQL han utilizado durante décadas. Si la conmutación por error entre clústeres o regiones es un requisito, este es un diferenciador significativo que debe evaluarse.</p>
