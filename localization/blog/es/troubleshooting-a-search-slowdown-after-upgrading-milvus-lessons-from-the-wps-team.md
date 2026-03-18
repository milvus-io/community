---
id: >-
  troubleshooting-a-search-slowdown-after-upgrading-milvus-lessons-from-the-wps-team.md
title: >-
  Solución de problemas de ralentización de la búsqueda tras actualizar Milvus:
  Lecciones del equipo de WPS
author: the WPS engineering team
date: 2026-3-18
cover: assets.zilliz.com/Version_A_Warm_Background_20b93359df.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: Milvus
meta_keywords: 'Milvus upgrade, milvus-backup, Milvus search latency, Milvus troubleshooting'
meta_title: |
  Troubleshooting a Search Slowdown After Upgrading Milvus
desc: >-
  Después de actualizar Milvus de 2.2 a 2.5, el equipo de WPS encontró una
  regresión de latencia de búsqueda de 3-5x. La causa: un único indicador de
  restauración de milvus-backup que fragmentaba segmentos.
origin: >-
  https://milvus.io/blog/troubleshooting-a-search-slowdown-after-upgrading-milvus-lessons-from-the-wps-team.md
---
<p><em>Este artículo ha sido escrito por el equipo de ingeniería de WPS en Kingsoft Office Software, que utiliza Milvus en un sistema de recomendación. Durante su actualización de Milvus 2.2.16 a 2.5.16, la latencia de búsqueda aumentó de 3 a 5 veces. Este artículo explica cómo investigaron el problema y lo solucionaron, y puede ser útil para otras personas de la comunidad que estén planeando una actualización similar.</em></p>
<h2 id="Why-We-Upgraded-Milvus" class="common-anchor-header">Por qué actualizamos Milvus<button data-href="#Why-We-Upgraded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Somos parte del equipo de ingeniería de WPS que construye software de productividad, y utilizamos Milvus como motor de búsqueda vectorial detrás de la búsqueda de similitud en tiempo real en nuestro sistema de recomendación en línea. Nuestro clúster de producción almacenaba decenas de millones de vectores, con una dimensión media de 768. Los datos eran servidos por 16 QueryNodes, y cada pod estaba configurado con límites de 16 núcleos de CPU y 48 GB de memoria.</p>
<p>Mientras ejecutábamos Milvus 2.2.16, nos encontramos con un grave problema de estabilidad que ya estaba afectando a la empresa. Con una alta concurrencia de consultas, <code translate="no">planparserv2.HandleCompare</code> podía provocar una excepción de puntero nulo, haciendo que el componente Proxy entrara en pánico y se reiniciara con frecuencia. Este error era muy fácil de desencadenar en escenarios de alta concurrencia y afectaba directamente a la disponibilidad de nuestro servicio de recomendación en línea.</p>
<p>A continuación se muestra el registro de errores real del Proxy y el seguimiento de la pila del incidente:</p>
<pre><code translate="no">[<span class="hljs-meta">2025/12/23 10:43:13.581 +00:00</span>] [ERROR] [concurrency/pool_option.go:<span class="hljs-number">53</span>] [<span class="hljs-string">&quot;Conc pool panicked&quot;</span>]
[<span class="hljs-meta">panic=<span class="hljs-string">&quot;runtime error: invalid memory address or nil pointer dereference&quot;</span></span>]
[<span class="hljs-meta">stack=<span class="hljs-string">&quot;...
github.com/milvus-io/milvus/internal/parser/planparserv2.HandleCompare
  /go/src/github.com/milvus-io/milvus/internal/parser/planparserv2/utils.go:331
github.com/milvus-io/milvus/internal/parser/planparserv2.(*ParserVisitor).VisitEquality
  /go/src/github.com/milvus-io/milvus/internal/parser/planparserv2/parser_visitor.go:345
...
github.com/milvus-io/milvus/internal/proxy.(*queryTask).PreExecute
  /go/src/github.com/milvus-io/milvus/internal/proxy/task_query.go:271
github.com/milvus-io/milvus/internal/proxy.(*taskScheduler).processTask
  /go/src/github.com/milvus-io/milvus/internal/proxy/task_scheduler.go:455
...&quot;</span></span>]

panic: runtime error: invalid memory address <span class="hljs-keyword">or</span> nil pointer dereference [recovered]
panic: runtime error: invalid memory address <span class="hljs-keyword">or</span> nil pointer dereference
[<span class="hljs-meta">signal SIGSEGV: segmentation violation code=0x1 addr=0x8 pc=0x2f1a02a</span>]
  
goroutine <span class="hljs-number">989</span> [running]:
github.com/milvus-io/milvus/<span class="hljs-keyword">internal</span>/parser/planparserv2.HandleCompare(...)
  /go/src/github.com/milvus-io/milvus/<span class="hljs-keyword">internal</span>/parser/planparserv2/utils.go:<span class="hljs-number">331</span> +<span class="hljs-number">0x2a</span>
github.com/milvus-io/milvus/<span class="hljs-keyword">internal</span>/parser/planparserv2.(*ParserVisitor).VisitEquality(...)
  /go/src/github.com/milvus-io/milvus/<span class="hljs-keyword">internal</span>/parser/planparserv2/parser_visitor.go:<span class="hljs-number">345</span> +<span class="hljs-number">0x7e5</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Lo que muestra el stack trace</strong>: El pánico se produjo durante el preprocesamiento de consultas en Proxy, dentro de <code translate="no">queryTask.PreExecute</code>. La ruta de llamada era:</p>
<p><code translate="no">taskScheduler.processTask</code> → <code translate="no">queryTask.PreExecute</code> → <code translate="no">planparserv2.CreateRetrievePlan</code> → <code translate="no">planparserv2.HandleCompare</code></p>
<p>El fallo se produjo cuando <code translate="no">HandleCompare</code> intentó acceder a memoria no válida en la dirección <code translate="no">0x8</code>, desencadenando un SIGSEGV y provocando el fallo del proceso Proxy.</p>
<p><strong>Para eliminar completamente este riesgo de estabilidad, decidimos actualizar el clúster de Milvus 2.2.16 a 2.5.16.</strong></p>
<h2 id="Backing-Up-Data-With-milvus-backup-Before-the-Upgrade" class="common-anchor-header">Copia de seguridad de datos con milvus-backup antes de la actualización<button data-href="#Backing-Up-Data-With-milvus-backup-Before-the-Upgrade" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de tocar el cluster de producción, hicimos una copia de seguridad de todo utilizando la herramienta oficial <a href="https://github.com/zilliztech/milvus-backup">milvus-backup</a>. Soporta copias de seguridad y restauración dentro del mismo cluster, entre clusters y entre versiones de Milvus.</p>
<h3 id="Checking-Version-Compatibility" class="common-anchor-header">Comprobación de la compatibilidad de versiones</h3><p>milvus-backup tiene dos reglas de versión para las <a href="https://milvus.io/docs/milvus_backup_overview.md">restauraciones entre versiones</a>:</p>
<ol>
<li><p><strong>El cluster de destino debe ejecutar la misma versión de Milvus o una más reciente.</strong> Una copia de seguridad de 2.2 puede cargarse en 2.5, pero no al revés.</p></li>
<li><p><strong>El destino debe ser al menos Milvus 2.4.</strong> Los objetivos de restauración más antiguos no son compatibles.</p></li>
</ol>
<p>Nuestra ruta (copia de seguridad de 2.2.16, carga en 2.5.16) cumple ambas reglas.</p>
<table>
<thead>
<tr><th>Copia de seguridad de ↓ \ Restaurar a →</th><th>2.4</th><th>2.5</th><th>2.6</th></tr>
</thead>
<tbody>
<tr><td>2.2</td><td>✅</td><td>✅</td><td>✅</td></tr>
<tr><td>2.3</td><td>✅</td><td>✅</td><td>✅</td></tr>
<tr><td>2.4</td><td>✅</td><td>✅</td><td>✅</td></tr>
<tr><td>2.5</td><td>❌</td><td>✅</td><td>✅</td></tr>
<tr><td>2.6</td><td>❌</td><td>❌</td><td>✅</td></tr>
</tbody>
</table>
<h3 id="How-Milvus-Backup-Works" class="common-anchor-header">Cómo funciona Milvus-Backup</h3><p>Milvus Backup facilita la copia de seguridad y la restauración de metadatos, segmentos y datos en todas las instancias de Milvus. Proporciona interfaces northbound, como una CLI, una API y un módulo Go basado en gRPC, para la manipulación flexible de los procesos de copia de seguridad y restauración.</p>
<p>Milvus Backup lee los metadatos de la colección y los segmentos de la instancia Milvus de origen para crear una copia de seguridad. A continuación, copia los datos de la colección de la ruta raíz de la instancia Milvus de origen y los guarda en la ruta raíz de la copia de seguridad.</p>
<p>Para restaurar a partir de una copia de seguridad, Milvus Backup crea una nueva colección en la instancia de Milvus de destino basándose en los metadatos de la colección y en la información de los segmentos de la copia de seguridad. A continuación, copia los datos de la copia de seguridad de la ruta raíz de la copia de seguridad a la ruta raíz de la instancia de destino.</p>
<h3 id="Running-the-Backup" class="common-anchor-header">Ejecución de la copia de seguridad</h3><p>Preparamos un archivo de configuración dedicado, <code translate="no">configs/backup.yaml</code>. Los campos principales se muestran a continuación, con los valores sensibles eliminados:</p>
<pre><code translate="no">milvus:
  address: <span class="hljs-number">1.1</span><span class="hljs-number">.1</span><span class="hljs-number">.1</span>  <span class="hljs-comment"># Source Milvus address</span>
  port: <span class="hljs-number">19530</span>  <span class="hljs-comment"># Source Milvus port</span>
  user: root  <span class="hljs-comment"># Source Milvus username (must have backup permissions)</span>
  password: &lt;PASS&gt; <span class="hljs-comment"># Source Milvus user password</span>

  etcd:
    endpoints: <span class="hljs-string">&quot;2.2.2.1:2379,2.2.2.2:2379,2.2.2.3:2379&quot;</span> <span class="hljs-comment"># Endpoints of the etcd cluster connected to Milvus</span>
    rootPath: <span class="hljs-string">&quot;by-dev&quot;</span>  <span class="hljs-comment"># Prefix of Milvus metadata in etcd. If not modified, the default is by-dev. It is recommended to check etcd before proceeding.</span>

minio:
  <span class="hljs-comment"># Source Milvus object storage bucket configuration</span>
  storageType: <span class="hljs-string">&quot;aliyun&quot;</span> <span class="hljs-comment"># support storage type: local, minio, s3, aws, gcp, ali(aliyun), azure, tc(tencent), gcpnative</span>
  address: ks3-cn-beijing-internal.ksyuncs.com <span class="hljs-comment"># Address of MinIO/S3</span>
  port: <span class="hljs-number">443</span>   <span class="hljs-comment"># Port of MinIO/S3</span>
  accessKeyID: &lt;Source <span class="hljs-built_in">object</span> storage AK&gt;  
  secretAccessKey: &lt;Source <span class="hljs-built_in">object</span> storage SK&gt; 
  useSSL: true
  bucketName: <span class="hljs-string">&quot;&lt;Source object storage bucket name&gt;&quot;</span>
  rootPath: <span class="hljs-string">&quot;file&quot;</span> <span class="hljs-comment"># Root directory prefix under the source object storage bucket where the current Milvus data is stored. If Milvus is installed using Helm Chart, the default prefix is file. It is recommended to log in to the object storage and verify before proceeding.</span>

  <span class="hljs-comment"># Object storage bucket configuration for storing backup data</span>
  backupStorageType: <span class="hljs-string">&quot;aliyun&quot;</span> <span class="hljs-comment"># support storage type: local, minio, s3, aws, gcp, ali(aliyun), azure, tc(tencent)</span>
  backupAddress: ks3-cn-beijing-internal.ksyuncs.com <span class="hljs-comment"># Address of MinIO/S3</span>
  backupPort: <span class="hljs-number">443</span>   <span class="hljs-comment"># Port of MinIO/S3</span>
  backupAccessKeyID: &lt;Backup bucket AK&gt; 
  backupSecretAccessKey: &lt;Backup bucket SK&gt; 
  backupBucketName: &lt;Backup bucket name&gt;
  backupRootPath: <span class="hljs-string">&quot;backup&quot;</span> <span class="hljs-comment"># Root path to store backup data. Backup data will be stored in backupBucketName/backupRootPath</span>
  backupUseSSL: true <span class="hljs-comment"># Access MinIO/S3 with SSL</span>
  crossStorage: <span class="hljs-string">&quot;true&quot;</span>  <span class="hljs-comment"># Must be set to true when performing cross-storage backup</span>
<button class="copy-code-btn"></button></code></pre>
<p>A continuación, ejecutamos este comando:</p>
<pre><code translate="no"><span class="hljs-comment"># Create a backup using milvus-backup</span>
./milvus-backup create --config configs/backup.yaml -n backup_v2216
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">milvus-backup</code> soporta <strong>backup en caliente</strong>, por lo que normalmente tiene poco impacto en el tráfico online. Ejecutarlo durante las horas de menor tráfico es más seguro para evitar la contención de recursos.</p>
<h3 id="Verifying-the-Backup" class="common-anchor-header">Verificación de la copia de seguridad</h3><p>Una vez finalizada la copia de seguridad, comprobamos que estaba completa y era utilizable. Principalmente comprobamos si el número de colecciones y segmentos de la copia de seguridad coincidía con los del clúster de origen.</p>
<pre><code translate="no" class="language-# List backups">./milvus-backup list --config configs/backup.yaml
<span class="hljs-comment"># View backup details and confirm the number of Collections and Segments</span>
./milvus-backup get --config configs/backup.yaml -n backup_v2216
<button class="copy-code-btn"></button></code></pre>
<p>Coincidían, así que pasamos a la actualización.</p>
<h2 id="Upgrading-With-Helm-Chart" class="common-anchor-header">Actualización con Helm Chart<button data-href="#Upgrading-With-Helm-Chart" class="anchor-icon" translate="no">
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
    </button></h2><p>El salto de tres versiones principales (2.2 → 2.5) con decenas de millones de vectores hacía que una actualización in situ fuera demasiado arriesgada. En su lugar, creamos un nuevo clúster y migramos los datos a él. El clúster antiguo permaneció en línea para el rollback.</p>
<h3 id="Deploying-the-New-Cluster" class="common-anchor-header">Despliegue del nuevo clúster</h3><p>Desplegamos el nuevo clúster Milvus 2.5.16 con Helm:</p>
<pre><code translate="no"><span class="hljs-comment"># Add the Milvus Helm repository</span>
: helm repo add milvus https://zilliztech.github.io/milvus-helm/
helm repo update  
<span class="hljs-comment"># Check the Helm chart version corresponding to the target Milvus version</span>
: helm search repo milvus/milvus -l | grep <span class="hljs-number">2.5</span><span class="hljs-number">.16</span>
milvus/milvus        <span class="hljs-number">4.2</span><span class="hljs-number">.58</span>               <span class="hljs-number">2.5</span><span class="hljs-number">.16</span>                    Milvus <span class="hljs-keyword">is</span> an <span class="hljs-built_in">open</span>-source vector database built ...
  
<span class="hljs-comment"># Deploy the new version cluster (with mmap disabled)</span>
helm install milvus-v25 milvus/milvus \
  --namespace milvus-new \
  --values values-v25.yaml \
  --version <span class="hljs-number">4.2</span><span class="hljs-number">.58</span> \
  --wait
<button class="copy-code-btn"></button></code></pre>
<h3 id="Key-Configuration-Changes-values-v25yaml" class="common-anchor-header">Cambios clave en la configuración (<code translate="no">values-v25.yaml</code>)</h3><p>Para que la comparación del rendimiento fuera justa, mantuvimos el nuevo cluster lo más similar posible al antiguo. Sólo cambiamos unas pocas configuraciones que importaban para esta carga de trabajo:</p>
<ul>
<li><p><strong>Desactivar Mmap</strong> (<code translate="no">mmap.enabled: false</code>): Nuestra carga de trabajo de recomendación es sensible a la latencia. Si Mmap está activado, algunos datos pueden ser leídos desde el disco cuando sea necesario, lo que puede añadir retraso de E/S de disco y causar picos de latencia. Lo desactivamos para que los datos permanezcan completamente en memoria y la latencia de la consulta sea más estable.</p></li>
<li><p><strong>Recuento de QueryNode:</strong> se mantuvo en <strong>16</strong>, igual que en el clúster antiguo.</p></li>
<li><p><strong>Límites de recursos:</strong> cada Pod sigue teniendo <strong>16 núcleos de CPU</strong>, igual que el clúster antiguo.</p></li>
</ul>
<h3 id="Tips-for-major-version-upgrades" class="common-anchor-header">Consejos para actualizaciones de versiones mayores:</h3><ul>
<li><p><strong>Construya un nuevo clúster en lugar de actualizarlo in situ.</strong> Evitará riesgos de compatibilidad de metadatos y mantendrá una ruta de retroceso limpia.</p></li>
<li><p><strong>Verifique su copia de seguridad antes de migrar.</strong> Una vez que los datos están en el formato de la nueva versión, no es fácil volver atrás.</p></li>
<li><p><strong>Mantenga ambos clústeres en funcionamiento durante la transición.</strong> Cambie el tráfico gradualmente y retire el clúster antiguo sólo después de una verificación completa.</p></li>
</ul>
<h2 id="Migrating-Data-After-the-Upgrade-with-Milvus-Backup-Restore" class="common-anchor-header">Migración de datos después de la actualización con Milvus-Backup Restore<button data-href="#Migrating-Data-After-the-Upgrade-with-Milvus-Backup-Restore" class="anchor-icon" translate="no">
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
    </button></h2><p>Utilizamos <code translate="no">milvus-backup restore</code> para cargar la copia de seguridad en el nuevo clúster. En la terminología de milvus-backup, "restaurar" significa "cargar los datos de la copia de seguridad en un clúster de destino". El destino debe ejecutar la misma versión de Milvus o una más reciente, por lo que, a pesar del nombre, las restauraciones siempre mueven los datos hacia adelante.</p>
<h3 id="Running-the-Restore" class="common-anchor-header">Ejecutar la restauración</h3><p>El archivo de configuración de la restauración, <code translate="no">configs/restore.yaml</code>, tenía que apuntar al <strong>nuevo cluster</strong> y a su configuración de almacenamiento. Los campos principales tenían este aspecto:</p>
<pre><code translate="no"><span class="hljs-comment"># Restore target Milvus connection information</span>
milvus:
  address: <span class="hljs-number">1.1</span><span class="hljs-number">.1</span><span class="hljs-number">.1</span>  <span class="hljs-comment"># Milvus address</span>
  port: <span class="hljs-number">19530</span>  <span class="hljs-comment"># Milvus port</span>
  user: root  <span class="hljs-comment"># Milvus username (must have restore permissions)</span>
  password: &lt;PASS&gt; <span class="hljs-comment"># Milvus user password  </span>
  etcd:
    endpoints: <span class="hljs-string">&quot;2.2.2.1:2379,2.2.2.2:2379,2.2.2.3:2379&quot;</span> <span class="hljs-comment"># Endpoints of the etcd cluster connected to the target Milvus</span>
    rootPath: <span class="hljs-string">&quot;by-dev&quot;</span>  <span class="hljs-comment"># Prefix of Milvus metadata in etcd. If not modified, the default is by-dev. It is recommended to check etcd before proceeding.</span>

minio:
  <span class="hljs-comment"># Target Milvus object storage bucket configuration</span>
  storageType: <span class="hljs-string">&quot;aliyun&quot;</span> <span class="hljs-comment"># support storage type: local, minio, s3, aws, gcp, ali(aliyun), azure, tc(tencent), gcpnative</span>
  address: ks3-cn-beijing-internal.ksyuncs.com <span class="hljs-comment"># Address of MinIO/S3</span>
  port: <span class="hljs-number">443</span>   <span class="hljs-comment"># Port of MinIO/S3</span>
  accessKeyID: &lt;Object storage AK&gt;  
  secretAccessKey: &lt;Object storage SK&gt; 
  useSSL: true
  bucketName: <span class="hljs-string">&quot;&lt;Object storage bucket name&gt;&quot;</span>
  rootPath: <span class="hljs-string">&quot;file&quot;</span> <span class="hljs-comment"># Root directory prefix under the object storage bucket where the current Milvus data is stored. If Milvus is installed using Helm Chart, the default prefix is file. It is recommended to log in to the object storage and verify before proceeding.</span>

  <span class="hljs-comment"># Object storage bucket configuration for storing backup data</span>
  backupStorageType: <span class="hljs-string">&quot;aliyun&quot;</span> <span class="hljs-comment"># support storage type: local, minio, s3, aws, gcp, ali(aliyun), azure, tc(tencent)</span>
  backupAddress: ks3-cn-beijing-internal.ksyuncs.com <span class="hljs-comment"># Address of MinIO/S3</span>
  backupPort: <span class="hljs-number">443</span>   <span class="hljs-comment"># Port of MinIO/S3</span>
  backupAccessKeyID: &lt;Backup bucket AK&gt; 
  backupSecretAccessKey: &lt;Backup bucket SK&gt; 
  backupBucketName: &lt;Backup bucket name&gt;
  backupRootPath: <span class="hljs-string">&quot;backup&quot;</span> <span class="hljs-comment"># Root path to store backup data. Backup data will be stored in backupBucketName/backupRootPath</span>
  backupUseSSL: true <span class="hljs-comment"># Access MinIO/S3 with SSL</span>
  crossStorage: <span class="hljs-string">&quot;true&quot;</span>  <span class="hljs-comment"># Must be set to true when performing cross-storage backup</span>
<button class="copy-code-btn"></button></code></pre>
<p>A continuación, ejecutamos:</p>
<pre><code translate="no">./milvus-backup restore --config configs/restore.yaml -n backup_v2216 --rebuild_index
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">restore.yaml</code> necesita la información de conexión de Milvus y MinIO del nuevo clúster para que los datos restaurados se escriban en el almacenamiento del nuevo clúster.</p>
<h3 id="Checks-After-Restore" class="common-anchor-header">Comprobaciones tras la restauración</h3><p>Una vez finalizada la restauración, comprobamos cuatro cosas para asegurarnos de que la migración era correcta:</p>
<ul>
<li><p><strong>Esquema.</strong> El esquema de la colección en el nuevo clúster tenía que coincidir exactamente con el antiguo, incluidas las definiciones de campo y las dimensiones del vector.</p></li>
<li><p><strong>Recuento total de filas.</strong> Comparamos el número total de entidades en los clústeres antiguo y nuevo para asegurarnos de que no se había perdido ningún dato.</p></li>
<li><p><strong>Estado de los índices.</strong> Confirmamos que todos los índices habían terminado de construirse y que su estado era <code translate="no">Finished</code>.</p></li>
<li><p><strong>Resultados de las consultas.</strong> Ejecutamos las mismas consultas en ambos clústeres y comparamos los ID devueltos y las puntuaciones de distancia para asegurarnos de que los resultados coincidían.</p></li>
</ul>
<h2 id="Gradual-Traffic-Shift-and-the-Latency-Surprise" class="common-anchor-header">Cambio gradual del tráfico y la sorpresa de la latencia<button data-href="#Gradual-Traffic-Shift-and-the-Latency-Surprise" class="anchor-icon" translate="no">
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
    </button></h2><p>Trasladamos el tráfico de producción al nuevo clúster por fases:</p>
<table>
<thead>
<tr><th>Fase</th><th>Proporción de tráfico</th><th>Duración</th><th>Lo que vimos</th></tr>
</thead>
<tbody>
<tr><td>Fase 1</td><td>5%</td><td>24 horas</td><td>Latencia de la consulta P99, tasa de error y precisión de los resultados</td></tr>
<tr><td>Fase 2</td><td>25%</td><td>48 horas</td><td>Latencia de consulta P99/P95, QPS, uso de CPU</td></tr>
<tr><td>Fase 3</td><td>50%</td><td>48 horas</td><td>Métricas de extremo a extremo, uso de recursos</td></tr>
<tr><td>Fase 4</td><td>100%</td><td>Seguimiento continuo</td><td>Estabilidad general de las métricas</td></tr>
</tbody>
</table>
<p>Mantuvimos el clúster antiguo en funcionamiento todo el tiempo para realizar un rollback instantáneo.</p>
<p><strong>Durante este despliegue, detectamos el problema: la latencia de búsqueda en el nuevo clúster v2.5.16 era de 3 a 5 veces mayor que en el clúster v2.2.16 antiguo.</strong></p>
<h2 id="Finding-the-Cause-of-the-Search-Slowdown" class="common-anchor-header">Encontrar la causa de la ralentización de la búsqueda<button data-href="#Finding-the-Cause-of-the-Search-Slowdown" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Step-1-Check-Overall-CPU-Usage" class="common-anchor-header">Paso 1: Comprobar el uso general de la CPU</h3><p>Comenzamos con el uso de CPU por componente para ver si el clúster estaba corto de recursos.</p>
<table>
<thead>
<tr><th>Componente</th><th>Uso de CPU (núcleos)</th><th>Análisis</th></tr>
</thead>
<tbody>
<tr><td>Nodo de consulta</td><td>10.1</td><td>El límite era de 16 núcleos, por lo que el uso fue de alrededor del 63%. No se utiliza completamente</td></tr>
<tr><td>Proxy</td><td>0.21</td><td>Muy bajo</td></tr>
<tr><td>MixCoord</td><td>0.11</td><td>Muy bajo</td></tr>
<tr><td>Nodo de datos</td><td>0.14</td><td>Muy bajo</td></tr>
<tr><td>IndexNode</td><td>0.02</td><td>Muy bajo</td></tr>
</tbody>
</table>
<p>Esto demostró que QueryNode todavía tenía suficiente CPU disponible. Por tanto, la ralentización <strong>no se debía a una escasez general de CPU</strong>.</p>
<h3 id="Step-2-Check-QueryNode-Balance" class="common-anchor-header">Paso 2: Comprobar el equilibrio de QueryNode</h3><p>La CPU total parecía estar bien, pero los pods individuales de QueryNode tenían un <strong>claro desequilibrio</strong>:</p>
<table>
<thead>
<tr><th>Pod QueryNode</th><th>Uso de CPU (Último)</th><th>Uso de CPU (máximo)</th></tr>
</thead>
<tbody>
<tr><td>querynode-pod-1</td><td>8.38%</td><td>9.91%</td></tr>
<tr><td>querynode-pod-2</td><td>5.34%</td><td>6.85%</td></tr>
<tr><td>querynode-pod-3</td><td>4.37%</td><td>6.73%</td></tr>
<tr><td>querynode-pod-4</td><td>4.26%</td><td>5.89%</td></tr>
<tr><td>querynode-pod-5</td><td>3.39%</td><td>4.82%</td></tr>
<tr><td>querynode-pod-6</td><td>3.97%</td><td>4.56%</td></tr>
<tr><td>querynode-pod-7</td><td>2.65%</td><td>4.46%</td></tr>
<tr><td>querynode-pod-8</td><td>2.01%</td><td>3.84%</td></tr>
<tr><td>querynode-pod-9</td><td>3.68%</td><td>3.69%</td></tr>
</tbody>
</table>
<p>Pod-1 utilizó casi 5 veces más CPU que pod-8. Esto es un problema porque Milvus extiende una consulta a todos los QueryNodes y espera a que termine el más lento. Unos pocos pods sobrecargados estaban arrastrando todas las búsquedas.</p>
<h3 id="Step-3-Compare-Segment-Distribution" class="common-anchor-header">Paso 3: Comparar la distribución de segmentos</h3><p>Una carga desigual suele indicar una distribución desigual de los datos, por lo que comparamos las distribuciones de segmentos entre los clusters antiguos y nuevos.</p>
<p><strong>Distribución de segmentos v2.2.16 (13 segmentos en total)</strong></p>
<table>
<thead>
<tr><th>Rango de recuento de filas</th><th>Número de segmentos</th><th>Estado</th></tr>
</thead>
<tbody>
<tr><td>740,000 ~ 745,000</td><td>12</td><td>Sellado</td></tr>
<tr><td>533,630</td><td>1</td><td>Sellado</td></tr>
</tbody>
</table>
<p>El antiguo clúster era bastante uniforme. Sólo tenía 13 segmentos, y la mayoría de ellos tenía unas <strong>740.000 filas</strong>.</p>
<p><strong>Distribución de segmentos v2.5.16 (21 segmentos en total)</strong></p>
<table>
<thead>
<tr><th>Rango de recuento de filas</th><th>Recuento de segmentos</th><th>Estado</th></tr>
</thead>
<tbody>
<tr><td>680,000 ~ 685,000</td><td>4</td><td>Sellado</td></tr>
<tr><td>560,000 ~ 682,550</td><td>5</td><td>Sellado</td></tr>
<tr><td>421,575 ~ 481,800</td><td>4</td><td>Sellado</td></tr>
<tr><td>358,575 ~ 399,725</td><td>4</td><td>Sellado</td></tr>
<tr><td>379,650 ~ 461,725</td><td>4</td><td>Sellado</td></tr>
</tbody>
</table>
<p>El nuevo clúster tenía un aspecto muy diferente. Tenía 21 segmentos (un 60% más), con distintos tamaños de segmento: algunos contenían ~685k filas, otros apenas 350k. La restauración había dispersado los datos de forma desigual.</p>
<h3 id="Root-Cause" class="common-anchor-header">Causa principal</h3><p>Rastreamos el problema hasta nuestro comando de restauración original:</p>
<pre><code translate="no">./milvus-backup restore --config configs/restore.yaml -n backup_v2216 \
  --rebuild_index \
  --use_v2_restore \
  --drop_exist_collection \
  --drop_exist_index
<button class="copy-code-btn"></button></code></pre>
<p>El indicador <code translate="no">--use_v2_restore</code> activa el modo de restauración de fusión de segmentos, que agrupa varios segmentos en un único trabajo de restauración. Este modo está diseñado para acelerar las restauraciones cuando hay muchos segmentos pequeños.</p>
<p>Pero en nuestra restauración de versiones cruzadas (2.2 → 2.5), la lógica v2 reconstruía los segmentos de forma diferente a la agrupación original: dividía los segmentos grandes en otros más pequeños y de tamaño desigual. Una vez cargados, algunos QueryNodes se atascaban con más datos que otros.</p>
<p>Esto afectaba al rendimiento de tres formas:</p>
<ul>
<li><p><strong>Nodos calientes:</strong> Los QueryNodes con segmentos más grandes o más numerosos tenían que hacer más trabajo.</p></li>
<li><p><strong>Efecto del nodo más lento:</strong> la latencia de la consulta distribuida depende del nodo más lento.</p></li>
<li><p><strong>Más sobrecarga de</strong> fusión: más segmentos también significaban más trabajo a la hora de fusionar resultados.</p></li>
</ul>
<h3 id="The-Fix" class="common-anchor-header">La solución</h3><p>Hemos eliminado <code translate="no">--use_v2_restore</code> y restaurado la lógica por defecto:</p>
<pre><code translate="no">./milvus-backup restore --config configs/restore.yaml -n backup_v2216
<button class="copy-code-btn"></button></code></pre>
<p>Primero limpiamos los datos erróneos del nuevo clúster y luego ejecutamos la restauración por defecto. La distribución de segmentos volvió a estar equilibrada, la latencia de búsqueda volvió a la normalidad y el problema desapareció.</p>
<h2 id="What-Wed-Do-Differently-Next-Time" class="common-anchor-header">Lo que haríamos diferente la próxima vez<button data-href="#What-Wed-Do-Differently-Next-Time" class="anchor-icon" translate="no">
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
    </button></h2><p>En este caso, tardamos demasiado en encontrar el verdadero problema: la <strong>distribución desigual de los segmentos</strong>. Esto es lo que lo habría hecho más rápido.</p>
<h3 id="Improve-Segment-Monitoring" class="common-anchor-header">Mejorar la supervisión de los segmentos</h3><p>Milvus no expone el recuento de segmentos, la distribución de filas o la distribución de tamaños por colección en los paneles estándar de Grafana. Tuvimos que buscar manualmente en <a href="https://github.com/zilliztech/attu">Attu</a> y etcd, lo que fue lento.</p>
<p>Sería útil añadir</p>
<ul>
<li><p>un <strong>panel de distribución de segmentos</strong> en Grafana, que muestre cuántos segmentos ha cargado cada QueryNode, además de sus recuentos de filas y tamaños</p></li>
<li><p>una <strong>alerta de desequilibrio</strong>, que se activa cuando los recuentos de filas de los segmentos en los nodos superan un umbral</p></li>
<li><p>una <strong>vista de comparación de la migración</strong>, para que los usuarios puedan comparar la distribución de segmentos entre los clústeres antiguos y nuevos después de una actualización.</p></li>
</ul>
<h3 id="Use-a-Standard-Migration-Checklist" class="common-anchor-header">Utilizar una lista de comprobación de migración estándar</h3><p>Comprobamos el recuento de filas y lo consideramos correcto. Pero no fue suficiente. Una validación completa posterior a la migración también debe cubrir:</p>
<ul>
<li><p><strong>La coherencia del esquema.</strong> ¿Coinciden las definiciones de los campos y las dimensiones de los vectores?</p></li>
<li><p><strong>Recuento de segmentos.</strong> ¿Ha cambiado drásticamente el número de segmentos?</p></li>
<li><p><strong>Equilibrio de segmentos.</strong> ¿Son razonablemente uniformes los recuentos de filas entre segmentos?</p></li>
<li><p><strong>Estado de los índices.</strong> ¿Están todos los índices en <code translate="no">finished</code>?</p></li>
<li><p><strong>Referencia de latencia.</strong> ¿Las latencias de consulta P50, P95 y P99 son similares a las del clúster antiguo?</p></li>
<li><p><strong>Equilibrio de carga.</strong> ¿Está el uso de CPU de QueryNode distribuido uniformemente entre los pods?</p></li>
</ul>
<h3 id="Add-Automated-Checks" class="common-anchor-header">Añadir comprobaciones automatizadas</h3><p>Puede programar esta validación con PyMilvus para detectar desequilibrios antes de que lleguen a producción:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, utility, Collection  
<span class="hljs-keyword">def</span> <span class="hljs-title function_">check_segment_balance</span>(<span class="hljs-params">collection_name: <span class="hljs-built_in">str</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Check Segment distribution balance&quot;&quot;&quot;</span>
    collection = Collection(collection_name)
    segments = utility.get_query_segment_info(collection_name)
    <span class="hljs-comment"># Group statistics by QueryNode</span>
    node_stats = {}
    <span class="hljs-keyword">for</span> seg <span class="hljs-keyword">in</span> segments:
        node_id = seg.nodeID
        <span class="hljs-keyword">if</span> node_id <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> node_stats:
            node_stats[node_id] = {<span class="hljs-string">&quot;count&quot;</span>: <span class="hljs-number">0</span>, <span class="hljs-string">&quot;rows&quot;</span>: <span class="hljs-number">0</span>}
        node_stats[node_id][<span class="hljs-string">&quot;count&quot;</span>] += <span class="hljs-number">1</span>
        node_stats[node_id][<span class="hljs-string">&quot;rows&quot;</span>] += seg.num_rows
    <span class="hljs-comment"># Calculate balance</span>
    row_counts = [v[<span class="hljs-string">&quot;rows&quot;</span>] <span class="hljs-keyword">for</span> v <span class="hljs-keyword">in</span> node_stats.values()]
    avg_rows = <span class="hljs-built_in">sum</span>(row_counts) / <span class="hljs-built_in">len</span>(row_counts)
    max_deviation = <span class="hljs-built_in">max</span>(<span class="hljs-built_in">abs</span>(r - avg_rows) / avg_rows <span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> row_counts)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Number of nodes: <span class="hljs-subst">{<span class="hljs-built_in">len</span>(node_stats)}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Average row count: <span class="hljs-subst">{avg_rows:<span class="hljs-number">.0</span>f}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Maximum deviation: <span class="hljs-subst">{max_deviation:<span class="hljs-number">.2</span>%}</span>&quot;</span>)
    <span class="hljs-keyword">if</span> max_deviation &gt; <span class="hljs-number">0.2</span>:  <span class="hljs-comment"># Raise a warning if deviation exceeds 20%</span>
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;⚠️ Warning: Segment distribution is unbalanced and may affect query performance!&quot;</span>)
    <span class="hljs-keyword">for</span> node_id, stats <span class="hljs-keyword">in</span> <span class="hljs-built_in">sorted</span>(node_stats.items()):
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  Node <span class="hljs-subst">{node_id}</span>: <span class="hljs-subst">{stats[<span class="hljs-string">&#x27;count&#x27;</span>]}</span> segments, <span class="hljs-subst">{stats[<span class="hljs-string">&#x27;rows&#x27;</span>]}</span> rows&quot;</span>)
  
<span class="hljs-comment"># Usage example</span>
connections.connect(host=<span class="hljs-string">&quot;localhost&quot;</span>, port=<span class="hljs-string">&quot;19530&quot;</span>)
check_segment_balance(<span class="hljs-string">&quot;your_collection_name&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Use-Existing-Tools-Better" class="common-anchor-header">Utilizar mejor las herramientas existentes</h3><p>Algunas herramientas ya soportan diagnósticos a nivel de segmento:</p>
<ul>
<li><p><strong>Birdwatcher:</strong> puede leer metadatos Etcd directamente y mostrar la disposición de los segmentos y la asignación de canales.</p></li>
<li><p><strong>Milvus Web UI (v2.5+):</strong> le permite inspeccionar la información del segmento visualmente</p></li>
<li><p><strong>Grafana + Prometheus:</strong> puede utilizarse para crear paneles personalizados para la supervisión de clústeres en tiempo real.</p></li>
</ul>
<h2 id="Suggestions-for-the-Milvus-Community" class="common-anchor-header">Sugerencias para la comunidad de Milvus<button data-href="#Suggestions-for-the-Milvus-Community" class="anchor-icon" translate="no">
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
    </button></h2><p>Algunos cambios en Milvus facilitarían este tipo de resolución de problemas:</p>
<ol>
<li><p><strong>Explicar más claramente la compatibilidad de parámetrosLa</strong>documentación de <code translate="no">milvus-backup</code> debería explicar claramente cómo se comportan opciones como <code translate="no">--use_v2_restore</code> durante las restauraciones entre versiones y los riesgos que pueden introducir.</p></li>
<li><p><strong>Añadir mejores comprobaciones tras la restauraciónUna vez</strong>finalizada la restauración de <code translate="no">restore</code>, sería útil que la herramienta imprimiera automáticamente un resumen de la distribución de segmentos.</p></li>
<li><p><strong>Exponer métricas relacionadas con el equilibrio</strong>Las métricas de<strong>Prometheus</strong>deberían incluir información sobre el equilibrio de segmentos, para que los usuarios puedan controlarlo directamente.</p></li>
<li><p><strong>Apoyar el análisis del plan de consultaSimilar</strong>a MySQL <code translate="no">EXPLAIN</code>, Milvus se beneficiaría de una herramienta que muestre cómo se ejecuta una consulta y ayude a localizar problemas de rendimiento.</p></li>
</ol>
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
    </button></h2><p>En resumen:</p>
<table>
<thead>
<tr><th>Etapa</th><th>Herramienta / Método</th><th>Punto clave</th></tr>
</thead>
<tbody>
<tr><td>Copia de seguridad</td><td>milvus-backup crear</td><td>Se admite la copia de seguridad en caliente, pero la copia de seguridad debe comprobarse cuidadosamente</td></tr>
<tr><td>Actualizar</td><td>Construya un nuevo cluster con Helm</td><td>Deshabilite Mmap para reducir las fluctuaciones de E/S y mantenga la configuración de recursos igual que en el clúster antiguo.</td></tr>
<tr><td>Migración</td><td>Restaurar milvus-backup</td><td>Tenga cuidado con --use_v2_restore. En la restauración de versiones cruzadas, no utilice lógica no predeterminada a menos que la entienda claramente.</td></tr>
<tr><td>Despliegue gris</td><td>Desplazamiento gradual del tráfico</td><td>Desplace el tráfico por etapas: 5% → 25% → 50% → 100%, y mantenga el clúster antiguo listo para el rollback</td></tr>
<tr><td>Solución de problemas</td><td>Grafana + análisis de segmentos</td><td>No te fijes solo en la CPU y la memoria. Comprueba también el balance de segmentos y la distribución de datos</td></tr>
<tr><td>Corregir</td><td>Eliminar los datos erróneos y restaurarlos de nuevo</td><td>Elimine el indicador erróneo, restaure con la lógica predeterminada y el rendimiento volverá a la normalidad</td></tr>
</tbody>
</table>
<p>Al migrar datos, es importante tener en cuenta algo más que si los datos están presentes y son precisos. También hay que prestar atención a <strong>cómo</strong> <strong>se distribuyen</strong> <strong>los datos</strong>.</p>
<p>El recuento y el tamaño de los segmentos determinan la uniformidad con la que Milvus distribuye el trabajo de consulta entre los nodos. Cuando los segmentos están desequilibrados, unos pocos nodos acaban haciendo la mayor parte del trabajo, y cada búsqueda paga por ello. Las actualizaciones entre versiones conllevan un riesgo adicional porque el proceso de restauración puede reconstruir segmentos de forma diferente al cluster original. Los indicadores como <code translate="no">--use_v2_restore</code> pueden fragmentar los datos de formas que el recuento de filas por sí solo no muestra.</p>
<p>Por lo tanto, el enfoque más seguro en la migración entre versiones es mantener la configuración de restauración predeterminada a menos que tenga una razón específica para hacer lo contrario. Además, la supervisión debe ir más allá de la CPU y la memoria; es necesario conocer la disposición subyacente de los datos, en particular la distribución y el equilibrio de los segmentos, para detectar antes los problemas.</p>
<h2 id="A-Note-from-the-Milvus-Team" class="common-anchor-header">Nota del equipo de Milvus<button data-href="#A-Note-from-the-Milvus-Team" class="anchor-icon" translate="no">
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
    </button></h2><p>Nos gustaría dar las gracias al equipo de ingeniería de WPS por compartir esta experiencia con la comunidad Milvus. Escritos como éste son valiosos porque capturan lecciones reales de producción y las hacen útiles para otros que se enfrentan a problemas similares.</p>
<p>Si su equipo tiene una lección técnica, una historia de solución de problemas o una experiencia práctica que valga la pena compartir, nos encantaría saber de usted. Únete a nuestro <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">canal de Slack</a> y ponte en contacto con nosotros.</p>
<p>Y si está trabajando en sus propios desafíos, esos mismos canales de la comunidad son un buen lugar para conectarse con los ingenieros de Milvus y otros usuarios. También puede reservar una sesión individual a través de <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a> para obtener ayuda con la copia de seguridad y la restauración, las actualizaciones entre versiones y el rendimiento de las consultas.</p>
<p><a href="https://zilliz.com/share-your-story">
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Milvus_1_9eca411038.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</a></p>
