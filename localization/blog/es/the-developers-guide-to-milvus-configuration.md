---
id: the-developers-guide-to-milvus-configuration.md
title: Guía del desarrollador para la configuración de Milvus
author: Jack Li
date: 2025-04-23T00:00:00.000Z
desc: >-
  Simplifique la configuración de Milvus con nuestra guía específica. Descubra
  los parámetros clave que debe ajustar para mejorar el rendimiento de sus
  aplicaciones de bases de datos vectoriales.
cover: assets.zilliz.com/The_Developer_s_Guide_to_Milvus_Configuration_1519241756.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus, configurations, performance, scalability, stability'
meta_title: The Developer’s Guide to Milvus Configuration
origin: 'https://milvus.io/blog/the-developers-guide-to-milvus-configuration.md'
---
<h2 id="Introduction" class="common-anchor-header">Introducción<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Como desarrollador que trabaja con Milvus, es probable que se haya encontrado con el desalentador archivo de configuración <code translate="no">milvus.yaml</code> con sus más de 500 parámetros. Manejar esta complejidad puede ser un reto cuando todo lo que quieres es optimizar el rendimiento de tu base de datos vectorial.</p>
<p>Buenas noticias: no es necesario entender todos los parámetros. Esta guía se centra en los ajustes críticos que realmente afectan al rendimiento, destacando exactamente qué valores ajustar para su caso de uso específico.</p>
<p>Tanto si estás creando un sistema de recomendación que necesita consultas ultrarrápidas como si estás optimizando una aplicación de búsqueda vectorial con restricciones de costes, te mostraré exactamente qué parámetros modificar con valores prácticos y probados. Al final de esta guía, sabrá cómo ajustar las configuraciones de Milvus para obtener el máximo rendimiento basado en escenarios de implementación del mundo real.</p>
<h2 id="Configuration-Categories" class="common-anchor-header">Categorías de configuración<button data-href="#Configuration-Categories" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de sumergirnos en parámetros específicos, desglosemos la estructura del archivo de configuración. Cuando trabaje con <code translate="no">milvus.yaml</code>, tratará con tres categorías de parámetros:</p>
<ul>
<li><p><strong>Dependencia Configuraciones de componentes</strong>: Servicios externos a los que Milvus se conecta (<code translate="no">etcd</code>, <code translate="no">minio</code>, <code translate="no">mq</code>) - críticos para la configuración del cluster y la persistencia de datos.</p></li>
<li><p><strong>Configuraciones de componentes internos</strong>: Arquitectura interna de Milvus (<code translate="no">proxy</code>, <code translate="no">queryNode</code>, etc.) - clave para el ajuste del rendimiento</p></li>
<li><p><strong>Configuraciones funcionales</strong>: Seguridad, registro y límites de recursos - importante para despliegues de producción</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_Configurations_f9a7e45dce.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Milvus-Dependency-Component-Configurations" class="common-anchor-header">Configuraciones de componentes de dependencia de Milvus<button data-href="#Milvus-Dependency-Component-Configurations" class="anchor-icon" translate="no">
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
    </button></h2><p>Empecemos con los servicios externos de los que depende Milvus. Estas configuraciones son particularmente importantes cuando se pasa del desarrollo a la producción.</p>
<h3 id="etcd-Metadata-Store" class="common-anchor-header"><code translate="no">etcd</code>: Almacén de metadatos</h3><p>Milvus depende de <code translate="no">etcd</code> para la persistencia de metadatos y la coordinación de servicios. Los siguientes parámetros son cruciales:</p>
<ul>
<li><p><code translate="no">Etcd.endpoints</code>: Especifica la dirección del cluster etcd. Por defecto, Milvus lanza una instancia agrupada, pero en entornos empresariales, la mejor práctica es conectarse a un servicio gestionado <code translate="no">etcd</code> para una mejor disponibilidad y control operativo.</p></li>
<li><p><code translate="no">etcd.rootPath</code>: Define el prefijo clave para almacenar los datos relacionados con Milvus en etcd. Si está operando múltiples clusters Milvus en el mismo backend etcd, usar diferentes rutas raíz permite un aislamiento limpio de metadatos.</p></li>
<li><p><code translate="no">etcd.auth</code>: Controla las credenciales de autenticación. Milvus no habilita etcd auth por defecto, pero si su instancia administrada de etcd requiere credenciales, debe especificarlas aquí.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/etcd_in_milvusyaml_dc600c6974.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="minio-Object-Storage" class="common-anchor-header"><code translate="no">minio</code>: Almacenamiento de objetos</h3><p>A pesar del nombre, esta sección gobierna todos los clientes de servicios de almacenamiento de objetos compatibles con S3. Admite proveedores como AWS S3, GCS y Aliyun OSS a través de la configuración <code translate="no">cloudProvider</code>.</p>
<p>Presta atención a estas cuatro configuraciones clave:</p>
<ul>
<li><p><code translate="no">minio.address / minio.port</code>: Utilízalas para especificar el punto final de tu servicio de almacenamiento de objetos.</p></li>
<li><p><code translate="no">minio.bucketName</code>: Asigne cubos separados (o prefijos lógicos) para evitar colisiones de datos cuando ejecute múltiples clusters Milvus.</p></li>
<li><p><code translate="no">minio.rootPath</code>: Habilita el espaciado de nombres dentro del cubo para el aislamiento de datos.</p></li>
<li><p><code translate="no">minio.cloudProvider</code>: Identifica el backend OSS. Para obtener una lista completa de compatibilidad, consulte la <a href="https://milvus.io/docs/product_faq.md#Where-does-Milvus-store-data">documentación de Milvus</a>.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/minio_in_milvusyaml_faa11c9fcd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="mq-Message-Queue" class="common-anchor-header"><code translate="no">mq</code>: Cola de mensajes</h3><p>Milvus utiliza una cola de mensajes para la propagación interna de eventos, ya sea Pulsar (por defecto) o Kafka. Preste atención a los tres parámetros siguientes.</p>
<ol>
<li><p><code translate="no">pulsar.address/pulsar.port</code>: Establezca estos valores para utilizar un cluster Pulsar externo.</p></li>
<li><p><code translate="no">pulsar.tenant</code>: Define el nombre del inquilino. Cuando múltiples clusters Milvus comparten una instancia Pulsar, esto asegura una separación limpia de canales.</p></li>
<li><p><code translate="no">msgChannel.chanNamePrefix.cluster</code>: Si prefiere evitar el modelo de inquilino de Pulsar, ajuste el prefijo del canal para evitar colisiones.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mq_in_milvusyaml1_2214739c84.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mq_in_milvusyaml2_a44ff64936.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus también soporta Kafka como cola de mensajes. Para utilizar Kafka en su lugar, comente los ajustes específicos de Pulsar y descomente el bloque de configuración de Kafka.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mq_in_milvusyaml3_d41f44f77a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Milvus-Internal-Component-Configurations" class="common-anchor-header">Configuraciones de componentes internos de Milvus<button data-href="#Milvus-Internal-Component-Configurations" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="rootCoord-Metadata-+-Timestamps" class="common-anchor-header"><code translate="no">rootCoord</code>: Metadatos + Marcas de tiempo</h3><p>El nodo <code translate="no">rootCoord</code> gestiona los cambios de metadatos (DDL/DCL) y la gestión de marcas de tiempo.</p>
<ol>
<li><p><code translate="no">rootCoord.maxPartitionNum</code>： Establece el límite superior del número de particiones por colección. Aunque el límite duro es 1024, este parámetro sirve principalmente como salvaguarda. Para sistemas multi-arrendatario, evite usar particiones como límites de aislamiento - en su lugar, implemente una estrategia de clave de arrendatario que escale a millones de arrendatarios lógicos.</p></li>
<li><p><code translate="no">rootCoord.enableActiveStandby</code>：Habilita la alta disponibilidad activando un nodo de reserva. Esto es crítico ya que los nodos coordinadores Milvus no escalan horizontalmente por defecto.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/root_Coord_in_milvusyaml_9c2417dbaf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="proxy-API-Gateway-+-Request-Router" class="common-anchor-header"><code translate="no">proxy</code>: Pasarela API + Enrutador de peticiones</h3><p>El <code translate="no">proxy</code> maneja las solicitudes del cliente, la validación de solicitudes y la agregación de resultados.</p>
<ul>
<li><p><code translate="no">proxy.maxFieldNum</code>: Limita el número de campos (escalares + vectoriales) por colección. Manténgalo por debajo de 64 para minimizar la complejidad del esquema y reducir la sobrecarga de E/S.</p></li>
<li><p><code translate="no">proxy.maxVectorFieldNum</code>: Controla el número de campos vectoriales en una colección. Milvus soporta la búsqueda multimodal, pero en la práctica, 10 campos vectoriales es un límite superior seguro.</p></li>
<li><p><code translate="no">proxy.maxShardNum</code>:Define el número de fragmentos de ingestión. Como regla general</p>
<ul>
<li><p>&lt; 200M registros → 1 fragmento</p></li>
<li><p>200-400M registros → 2 fragmentos</p></li>
<li><p>Más allá, la escala es lineal</p></li>
</ul></li>
<li><p><code translate="no">proxy.accesslog</code>: Cuando está activado, registra información detallada de la solicitud (usuario, IP, endpoint, SDK). Útil para auditoría y depuración.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/proxy_in_milvusyaml_897b33c759.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="queryNode-Query-Execution" class="common-anchor-header"><code translate="no">queryNode</code>: Ejecución de consultas</h3><p>Gestiona la ejecución de la búsqueda vectorial y la carga de segmentos. Preste atención al siguiente parámetro.</p>
<ul>
<li><code translate="no">queryNode.mmap</code>: Activa la E/S mapeada en memoria para cargar campos escalares y segmentos. Activar <code translate="no">mmap</code> ayuda a reducir el espacio de memoria, pero puede degradar la latencia si la E/S de disco se convierte en un cuello de botella.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/query_Node_in_milvusyaml_36e1bf378a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="dataCoord-Segment-+-Index-Management" class="common-anchor-header"><code translate="no">dataCoord</code>: Gestión de segmentos e índices</h3><p>Este parámetro controla la segmentación de datos, la indexación, la compactación y la recolección de basura (GC). Los parámetros clave de configuración incluyen:</p>
<ol>
<li><p><code translate="no">dataCoord.segment.maxSize</code>: Especifica el tamaño máximo de un segmento de datos en memoria. Los segmentos más grandes generalmente significan menos segmentos totales en el sistema, lo que puede mejorar el rendimiento de la consulta al reducir la sobrecarga de indexación y búsqueda. Por ejemplo, algunos usuarios que ejecutan instancias de <code translate="no">queryNode</code> con 128 GB de RAM informaron de que el aumento de esta configuración de 1 GB a 8 GB dio lugar a un rendimiento de consulta aproximadamente 4 veces más rápido.</p></li>
<li><p><code translate="no">dataCoord.segment.diskSegmentMaxSize</code>: Al igual que en el caso anterior, este parámetro controla el tamaño máximo de <a href="https://milvus.io/docs/disk_index.md#On-disk-Index">los índices de disco</a> (índice diskann).</p></li>
<li><p><code translate="no">dataCoord.segment.sealProportion</code>: Determina cuándo se cierra un segmento en crecimiento (es decir, se finaliza y se indexa). El segmento se sella cuando alcanza <code translate="no">maxSize * sealProportion</code>. Por defecto, con <code translate="no">maxSize = 1024MB</code> y <code translate="no">sealProportion = 0.12</code>, un segmento se sellará en torno a los 123 MB.</p></li>
</ol>
<ul>
<li><p>Los valores más bajos (por ejemplo, 0,12) activan el sellado antes, lo que puede ayudar a crear índices más rápidamente, lo que resulta útil en cargas de trabajo con actualizaciones frecuentes.</p></li>
<li><p>Los valores más altos (por ejemplo, de 0,3 a 0,5) retrasan el sellado, lo que reduce la sobrecarga de indexación y resulta más adecuado para escenarios de ingestión fuera de línea o por lotes.</p></li>
</ul>
<ol start="4">
<li><p><code translate="no">dataCoord.segment.expansionRate</code>:  Establece el factor de expansión permitido durante la compactación. Milvus calcula el tamaño máximo de segmento permitido durante la compactación como <code translate="no">maxSize * expansionRate</code>.</p></li>
<li><p><code translate="no">dataCoord.gc.dropTolerance</code>: Después de compactar un segmento o de eliminar una colección, Milvus no borra inmediatamente los datos subyacentes. En su lugar, marca los segmentos para su eliminación y espera a que se complete el ciclo de recogida de basura (GC). Este parámetro controla la duración de ese retraso.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_Coord_in_milvusyaml1_100d98a081.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_Coord_in_milvusyaml2_7fa8c5f2c0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Other-Functional-Configurations" class="common-anchor-header">Otras configuraciones funcionales<button data-href="#Other-Functional-Configurations" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="log-Observability-and-Diagnostics" class="common-anchor-header"><code translate="no">log</code>: Observabilidad y diagnóstico</h3><p>Un registro robusto es una piedra angular de cualquier sistema distribuido, y Milvus no es una excepción. Una configuración de registro bien configurada no sólo ayuda con la depuración de problemas a medida que surgen, sino que también asegura una mejor visibilidad de la salud del sistema y el comportamiento en el tiempo.</p>
<p>Para los despliegues de producción, recomendamos integrar los registros de Milvus con herramientas centralizadas de registro y supervisión, como <a href="https://milvus.io/docs/configure_grafana_loki.md#Deploy-Loki">Loki</a>, para agilizar el análisis y las alertas. Los ajustes clave incluyen:</p>
<ol>
<li><p><code translate="no">log.level</code>: Controla la verbosidad de la salida del registro. En entornos de producción, utilice el nivel <code translate="no">info</code> para capturar los detalles esenciales del tiempo de ejecución sin sobrecargar el sistema. Durante el desarrollo o la resolución de problemas, puede cambiar a <code translate="no">debug</code> para obtener información más detallada sobre las operaciones internas. ⚠️ Tenga cuidado con el nivel <code translate="no">debug</code> en producción: genera un gran volumen de registros, que puede consumir rápidamente espacio en disco y degradar el rendimiento de E/S si no se controla.</p></li>
<li><p><code translate="no">log.file</code>: Por defecto, Milvus escribe los registros en la salida estándar (stdout), lo que es adecuado para entornos en contenedores donde los registros se recogen a través de sidecars o agentes de nodo. Para habilitar el registro basado en archivos en su lugar, puede configurar:</p></li>
</ol>
<ul>
<li><p>Tamaño máximo de archivo antes de la rotación</p></li>
<li><p>Periodo de retención de archivos</p></li>
<li><p>Número de archivos de registro de copia de seguridad para mantener</p></li>
</ul>
<p>Esto es útil en entornos bare-metal o on-prem donde el envío de registros stdout no está disponible.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/log_in_milvusyaml_248ead1264.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="security-Authentication-and-Access-Control" class="common-anchor-header"><code translate="no">security</code>: Autenticación y control de acceso</h3><p>Milvus soporta la <a href="https://milvus.io/docs/authenticate.md?tab=docker">autenticación de usuarios</a> y el <a href="https://milvus.io/docs/rbac.md">control de acceso basado en roles (RBAC)</a>, ambos configurados en el módulo <code translate="no">common</code>. Estas configuraciones son esenciales para asegurar entornos multi-tenant o cualquier despliegue expuesto a clientes externos.</p>
<p>Los parámetros clave incluyen:</p>
<ol>
<li><p><code translate="no">common.security.authorizationEnabled</code>: Esta opción activa o desactiva la autenticación y el RBAC. Está desactivado por defecto, lo que significa que todas las operaciones están permitidas sin comprobaciones de identidad. Para reforzar el control de acceso seguro, establezca este parámetro en <code translate="no">true</code>.</p></li>
<li><p><code translate="no">common.security.defaultRootPassword</code>: Cuando la autenticación está activada, este parámetro define la contraseña inicial para el usuario incorporado en <code translate="no">root</code>.</p></li>
</ol>
<p>Asegúrese de cambiar la contraseña predeterminada inmediatamente después de habilitar la autenticación para evitar vulnerabilidades de seguridad en entornos de producción.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/security_in_milvusyaml_a8d0187b5a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="quotaAndLimits-Rate-Limiting-and-Write-Control" class="common-anchor-header"><code translate="no">quotaAndLimits</code>: Limitación de velocidad y control de escritura</h3><p>La sección <code translate="no">quotaAndLimits</code> en <code translate="no">milvus.yaml</code> juega un papel crítico en el control del flujo de datos a través del sistema. Gobierna los límites de velocidad para operaciones como inserciones, eliminaciones, descargas y consultas, asegurando la estabilidad del cluster bajo cargas de trabajo pesadas y previniendo la degradación del rendimiento debido a la amplificación de escritura o compactación excesiva.</p>
<p>Los parámetros clave son:</p>
<p><code translate="no">quotaAndLimits.flushRate.collection</code>: Controla la frecuencia con la que Milvus vacía los datos de una colección.</p>
<ul>
<li><p><strong>Valor por defecto</strong>: <code translate="no">0.1</code>, lo que significa que el sistema permite una descarga cada 10 segundos.</p></li>
<li><p>La operación flush sella un segmento creciente y lo persiste desde la cola de mensajes al almacenamiento de objetos.</p></li>
<li><p>Una descarga demasiado frecuente puede generar muchos segmentos sellados pequeños, lo que aumenta la sobrecarga de compactación y perjudica el rendimiento de las consultas.</p></li>
</ul>
<p>La mejor práctica: En la mayoría de los casos, deja que Milvus se encargue de esto automáticamente. Un segmento creciente se sella una vez que alcanza <code translate="no">maxSize * sealProportion</code>, y los segmentos sellados se vacían cada 10 minutos. Las descargas manuales solo se recomiendan después de inserciones masivas cuando se sabe que no van a llegar más datos.</p>
<p>También hay que tener en cuenta que <strong>la visibilidad de los datos</strong> viene determinada por el <em>nivel de consistencia</em> de la consulta, no por el tiempo de descarga, por lo que la descarga no hace que los nuevos datos se puedan consultar inmediatamente.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/quota_And_Limits1_be185e571f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><code translate="no">quotaAndLimits.upsertRate</code>/<code translate="no">quotaAndLimits.deleteRate</code>: Estos parámetros definen la tasa máxima permitida para las operaciones de upsert y delete.</p>
<ul>
<li><p>Milvus se basa en una arquitectura de almacenamiento LSM-Tree, lo que significa que las actualizaciones y eliminaciones frecuentes activan la compactación. Esto puede consumir muchos recursos y reducir el rendimiento general si no se gestiona con cuidado.</p></li>
<li><p>Se recomienda limitar <code translate="no">upsertRate</code> y <code translate="no">deleteRate</code> a <strong>0,5 MB/s</strong> para evitar sobrecargar el proceso de compactación.</p></li>
</ul>
<p>¿Necesitas actualizar rápidamente un gran conjunto de datos? Utilice una estrategia de alias de colección:</p>
<ul>
<li><p>Inserta los nuevos datos en una nueva colección.</p></li>
<li><p>Una vez completada la actualización, vuelve a apuntar el alias a la nueva colección. Esto evita la penalización por compactación de las actualizaciones in situ y permite un cambio instantáneo.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/quota_And_Limits2_32c8640190.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Real-World-Configuration-Examples" class="common-anchor-header">Ejemplos de configuración real<button data-href="#Real-World-Configuration-Examples" class="anchor-icon" translate="no">
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
    </button></h2><p>Recorramos dos escenarios de despliegue comunes para ilustrar cómo pueden ajustarse los parámetros de configuración de Milvus para adaptarse a diferentes objetivos operativos.</p>
<h3 id="⚡-Example-1-High-Performance-Configuration" class="common-anchor-header">⚡ Ejemplo 1: Configuración de alto rendimiento</h3><p>Cuando la latencia de la consulta es crítica para la misión (piense en motores de recomendación, plataformas de búsqueda semántica o calificación de riesgos en tiempo real), cada milisegundo cuenta. En estos casos de uso, normalmente se apoyará en índices basados en gráficos como <strong>HNSW</strong> o <strong>DISKANN</strong>, y optimizará tanto el uso de memoria como el comportamiento del ciclo de vida de los segmentos.</p>
<p>Principales estrategias de ajuste:</p>
<ul>
<li><p>Aumentar <code translate="no">dataCoord.segment.maxSize</code> y <code translate="no">dataCoord.segment.diskSegmentMaxSize</code>: Aumente estos valores a 4 GB o incluso 8 GB, en función de la RAM disponible. Los segmentos más grandes reducen el número de creaciones de índices y mejoran el rendimiento de las consultas al minimizar el desbordamiento de los segmentos. Sin embargo, los segmentos más grandes consumen más memoria en el momento de la consulta, así que asegúrese de que sus instancias <code translate="no">indexNode</code> y <code translate="no">queryNode</code> tienen espacio suficiente.</p></li>
<li><p>Baje <code translate="no">dataCoord.segment.sealProportion</code> y <code translate="no">dataCoord.segment.expansionRate</code>: Apunte a un tamaño de segmento creciente alrededor de 200MB antes del sellado. Esto mantiene predecible el uso de la memoria del segmento y reduce la carga del Delegator (el queryNode líder que coordina la búsqueda distribuida).</p></li>
</ul>
<p>Regla general: Favorecer menos segmentos de mayor tamaño cuando la memoria es abundante y la latencia es una prioridad. Sea conservador con los umbrales de sellado si la frescura del índice importa.</p>
<h3 id="💰-Example-2-Cost-Optimized-Configuration" class="common-anchor-header">💰 Ejemplo 2: Configuración con optimización de costes</h3><p>Si está priorizando la eficiencia de costes sobre el rendimiento bruto -común en pipelines de entrenamiento de modelos, herramientas internas de bajo QPS o búsqueda de imágenes de cola larga- puede intercambiar la recuperación o la latencia para reducir significativamente las demandas de infraestructura.</p>
<p>Estrategias recomendadas:</p>
<ul>
<li><p><strong>Utilizar la cuantificación de índices:</strong> Los tipos de índice como <code translate="no">SCANN</code>, <code translate="no">IVF_SQ8</code> o <code translate="no">HNSW_PQ/PRQ/SQ</code> (introducidos en Milvus 2.5) reducen drásticamente el tamaño del índice y la huella de memoria. Son ideales para cargas de trabajo en las que la precisión es menos crítica que la escala o el presupuesto.</p></li>
<li><p><strong>Adopte una estrategia de indexación respaldada por disco:</strong> Establezca el tipo de índice en <code translate="no">DISKANN</code> para permitir la búsqueda basada exclusivamente en disco. <strong>Active</strong> <code translate="no">mmap</code> para una descarga selectiva de memoria.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/query_Node_in_milvusyaml_36e1bf378a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Para un ahorro extremo de memoria, active <code translate="no">mmap</code> para lo siguiente: <code translate="no">vectorField</code>, <code translate="no">vectorIndex</code>, <code translate="no">scalarField</code>, y <code translate="no">scalarIndex</code>. Esto descarga grandes cantidades de datos a la memoria virtual, reduciendo significativamente el uso de RAM residente.</p>
<p>⚠️ Advertencia: Si el filtrado escalar es una parte importante de su carga de trabajo de consulta, considere desactivar <code translate="no">mmap</code> para <code translate="no">vectorIndex</code> y <code translate="no">scalarIndex</code>. La asignación de memoria puede degradar el rendimiento de las consultas escalares en entornos con restricciones de E/S.</p>
<h4 id="Disk-usage-tip" class="common-anchor-header">Consejo sobre el uso del disco</h4><ul>
<li><p>Los índices HNSW creados con <code translate="no">mmap</code> pueden aumentar el tamaño total de los datos hasta <strong>1,8 veces</strong>.</p></li>
<li><p>Un disco físico de 100 GB sólo puede albergar ~50 GB de datos efectivos si se tienen en cuenta la sobrecarga del índice y el almacenamiento en caché.</p></li>
<li><p>Cuando trabaje con <code translate="no">mmap</code>, prevea siempre almacenamiento adicional, especialmente si también almacena en caché los vectores originales localmente.</p></li>
</ul>
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
    </button></h2><p>Ajustar Milvus no consiste en perseguir números perfectos, sino en moldear el sistema en función del comportamiento real de su carga de trabajo. Las optimizaciones más impactantes a menudo provienen de la comprensión de cómo Milvus maneja la E/S, el ciclo de vida de los segmentos y la indexación bajo presión. Éstas son las vías en las que una configuración incorrecta es más perjudicial y en las que un ajuste cuidadoso produce los mayores beneficios.</p>
<p>Si es nuevo en Milvus, los parámetros de configuración que hemos cubierto cubrirán el 80-90% de sus necesidades de rendimiento y estabilidad. Empiece por ahí. Una vez que haya adquirido cierta intuición, profundice en las especificaciones completas de <code translate="no">milvus.yaml</code> y en la documentación oficial: descubrirá controles más precisos que pueden hacer que su implantación pase de ser funcional a excepcional.</p>
<p>Con las configuraciones adecuadas, estará preparado para crear sistemas de búsqueda vectorial escalables y de alto rendimiento que se ajusten a sus prioridades operativas, ya se trate de servicios de baja latencia, almacenamiento rentable o cargas de trabajo analíticas de alto rendimiento.</p>
