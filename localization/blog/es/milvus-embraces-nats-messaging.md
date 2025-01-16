---
id: milvus-embraces-nats-messaging.md
title: 'Optimización de la comunicación de datos: Milvus adopta NATS Messaging'
author: Zhen Ye
date: 2023-11-24T00:00:00.000Z
desc: >-
  Presentación de la integración de NATS y Milvus, exploración de sus
  características, proceso de configuración y migración, y resultados de las
  pruebas de rendimiento.
cover: assets.zilliz.com/Exploring_NATS_878f48c848.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, NATS, Message Queues, RocksMQ
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/optimizing-data-communication-milvus-embraces-nats-messaging
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Exploring_NATS_878f48c848.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>En el intrincado tapiz del tratamiento de datos, la comunicación sin fisuras es el hilo que une las operaciones. <a href="https://zilliz.com/what-is-milvus">Milvus</a>, la pionera <a href="https://zilliz.com/cloud">base de datos vectorial de código abierto</a>, se ha embarcado en un viaje transformador con su última función: la integración de la mensajería NATS. En esta completa entrada de blog, desentrañaremos los entresijos de esta integración, explorando sus características principales, el proceso de configuración, los beneficios de la migración y cómo se compara con su predecesor, RocksMQ.</p>
<h2 id="Understanding-the-role-of-message-queues-in-Milvus" class="common-anchor-header">Comprender el papel de las colas de mensajes en Milvus<button data-href="#Understanding-the-role-of-message-queues-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>En la arquitectura nativa en la nube de Milvus, la cola de mensajes, o Log Broker, tiene una importancia fundamental. Es la columna vertebral que garantiza los flujos de datos persistentes, la sincronización, las notificaciones de eventos y la integridad de los datos durante las recuperaciones del sistema. Tradicionalmente, RocksMQ era la opción más sencilla en el modo Milvus Standalone, especialmente cuando se comparaba con Pulsar y Kafka, pero sus limitaciones se hicieron evidentes con datos extensos y escenarios complejos.</p>
<p>Milvus 2.3 introduce NATS, una implementación MQ de nodo único, que redefine la forma de gestionar flujos de datos. A diferencia de sus predecesores, NATS libera a los usuarios de Milvus de las limitaciones de rendimiento, ofreciendo una experiencia sin fisuras en el manejo de volúmenes de datos sustanciales.</p>
<h2 id="What-is-NATS" class="common-anchor-header">¿Qué es NATS?<button data-href="#What-is-NATS" class="anchor-icon" translate="no">
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
    </button></h2><p>NATS es una tecnología de conectividad de sistemas distribuidos implementada en Go. Soporta varios modos de comunicación como Request-Reply y Publish-Subscribe entre sistemas, proporciona persistencia de datos a través de JetStream, y ofrece capacidades distribuidas a través de RAFT incorporado. Puede consultar el <a href="https://nats.io/">sitio web oficial de</a> NATS para una comprensión más detallada de NATS.</p>
<p>En el modo Milvus 2.3 Standalone, NATS, JetStream y PubSub proporcionan a Milvus sólidas capacidades MQ.</p>
<h2 id="Enabling-NATS" class="common-anchor-header">Activación de NATS<button data-href="#Enabling-NATS" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3 ofrece una nueva opción de control, <code translate="no">mq.type</code>, que permite a los usuarios especificar el tipo de MQ que desean utilizar. Para habilitar NATS, configure <code translate="no">mq.type=natsmq</code>. Si ve registros similares a los siguientes después de iniciar instancias Milvus, ha habilitado correctamente NATS como cola de mensajes.</p>
<pre><code translate="no">[INFO] [dependency/factory.go:83] [<span class="hljs-string">&quot;try to init mq&quot;</span>] [standalone=<span class="hljs-literal">true</span>] [mqType=natsmq]
<button class="copy-code-btn"></button></code></pre>
<h2 id="Configuring-NATS-for-Milvus" class="common-anchor-header">Configuración de NATS para Milvus<button data-href="#Configuring-NATS-for-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Las opciones de personalización de NATS incluyen especificar el puerto de escucha, el directorio de almacenamiento JetStream, el tamaño máximo de la carga útil y el tiempo de espera de inicialización. El ajuste fino de estos parámetros garantiza un rendimiento y una fiabilidad óptimos.</p>
<pre><code translate="no">natsmq:
server: <span class="hljs-comment"># server side configuration for natsmq.</span>
port: <span class="hljs-number">4222</span> <span class="hljs-comment"># 4222 by default, Port for nats server listening.</span>
storeDir: /var/lib/milvus/nats <span class="hljs-comment"># /var/lib/milvus/nats by default, directory to use for JetStream storage of nats.</span>
maxFileStore: <span class="hljs-number">17179869184</span> <span class="hljs-comment"># (B) 16GB by default, Maximum size of the &#x27;file&#x27; storage.</span>
maxPayload: <span class="hljs-number">8388608</span> <span class="hljs-comment"># (B) 8MB by default, Maximum number of bytes in a message payload.</span>
maxPending: <span class="hljs-number">67108864</span> <span class="hljs-comment"># (B) 64MB by default, Maximum number of bytes buffered for a connection Applies to client connections.</span>
initializeTimeout: <span class="hljs-number">4000</span> <span class="hljs-comment"># (ms) 4s by default, waiting for initialization of natsmq finished.</span>
monitor:
trace: false <span class="hljs-comment"># false by default, If true enable protocol trace log messages.</span>
debug: false <span class="hljs-comment"># false by default, If true enable debug log messages.</span>
logTime: true <span class="hljs-comment"># true by default, If set to false, log without timestamps.</span>
logFile: /tmp/milvus/logs/nats.log <span class="hljs-comment"># /tmp/milvus/logs/nats.log by default, Log file path relative to .. of milvus binary if use relative path.</span>
logSizeLimit: <span class="hljs-number">536870912</span> <span class="hljs-comment"># (B) 512MB by default, Size in bytes after the log file rolls over to a new one.</span>
retention:
maxAge: <span class="hljs-number">4320</span> <span class="hljs-comment"># (min) 3 days by default, Maximum age of any message in the P-channel.</span>
maxBytes: <span class="hljs-comment"># (B) None by default, How many bytes the single P-channel may contain. Removing oldest messages if the P-channel exceeds this size.</span>
maxMsgs: <span class="hljs-comment"># None by default, How many message the single P-channel may contain. Removing oldest messages if the P-channel exceeds this limit.</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Nota:</strong></p>
<ul>
<li><p>Debe especificar <code translate="no">server.port</code> para la escucha del servidor NATS. Si hay un conflicto de puertos, Milvus no puede iniciarse. Configure <code translate="no">server.port=-1</code> para seleccionar un puerto al azar.</p></li>
<li><p><code translate="no">storeDir</code> Especifica el directorio para el almacenamiento de JetStream. Recomendamos almacenar el directorio en una unidad de estado sólido (SSD) de alto rendimiento para mejorar el rendimiento de lectura/escritura de Milvus.</p></li>
<li><p><code translate="no">maxFileStore</code> establece el límite superior del tamaño de almacenamiento JetStream. Si se supera este límite, no se podrán seguir escribiendo datos.</p></li>
<li><p><code translate="no">maxPayload</code> limita el tamaño de los mensajes individuales. Debe mantenerlo por encima de 5 MB para evitar rechazos de escritura.</p></li>
<li><p><code translate="no">initializeTimeout</code>controla el tiempo de espera de inicio del servidor NATS.</p></li>
<li><p><code translate="no">monitor</code> configura los registros independientes de NATS.</p></li>
<li><p><code translate="no">retention</code> controla el mecanismo de retención de los mensajes NATS.</p></li>
</ul>
<p>Para más información, consulte <a href="https://docs.nats.io/running-a-nats-service/configuration">la documentación oficial de NATS</a>.</p>
<h2 id="Migrating-from-RocksMQ-to-NATS" class="common-anchor-header">Migración de RocksMQ a NATS<button data-href="#Migrating-from-RocksMQ-to-NATS" class="anchor-icon" translate="no">
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
    </button></h2><p>La migración de RocksMQ a NATS es un proceso continuo que implica pasos como detener las operaciones de escritura, vaciar los datos, modificar las configuraciones y verificar la migración a través de los registros de Milvus.</p>
<ol>
<li><p>Antes de iniciar la migración, detenga todas las operaciones de escritura en Milvus.</p></li>
<li><p>Ejecute la operación <code translate="no">FlushALL</code> en Milvus y espere a que finalice. Este paso garantiza que todos los datos pendientes se vacíen y que el sistema esté listo para el cierre.</p></li>
<li><p>Modifique el archivo de configuración de Milvus configurando <code translate="no">mq.type=natsmq</code> y ajustando las opciones pertinentes en la sección <code translate="no">natsmq</code>.</p></li>
<li><p>Inicie Milvus 2.3.</p></li>
<li><p>Haga una copia de seguridad y limpie los datos originales almacenados en el directorio <code translate="no">rocksmq.path</code>. (Opcional)</p></li>
</ol>
<h2 id="NATS-vs-RocksMQ-A-Performance-Showdown" class="common-anchor-header">NATS vs. RocksMQ: Un enfrentamiento de rendimiento<button data-href="#NATS-vs-RocksMQ-A-Performance-Showdown" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="PubSub-Performance-Testing" class="common-anchor-header">Pruebas de rendimiento Pub/Sub</h3><ul>
<li><p><strong>Plataforma de pruebas:</strong> Chip M1 Pro / Memoria: 16GB</p></li>
<li><p><strong>Escenario de la prueba:</strong> Suscripción y publicación de paquetes de datos aleatorios a un tema repetidamente hasta que se reciba el último resultado publicado.</p></li>
<li><p><strong>Resultados:</strong></p>
<ul>
<li><p>Para paquetes de datos más pequeños (&lt; 64kb), RocksMQ supera a NATS en cuanto a memoria, CPU y velocidad de respuesta.</p></li>
<li><p>Para paquetes de datos más grandes (&gt; 64kb), NATS supera a RocksMQ, ofreciendo tiempos de respuesta mucho más rápidos.</p></li>
</ul></li>
</ul>
<table>
<thead>
<tr><th>Tipo de prueba</th><th>MQ</th><th>número de operaciones</th><th>Coste por operación</th><th>Coste de memoria</th><th>Tiempo total CPU</th><th>Coste de almacenamiento</th></tr>
</thead>
<tbody>
<tr><td>5MB*100 Pub/Sub</td><td>NATS</td><td>50</td><td>1,650328186 s/op</td><td>4,29 GB</td><td>85.58</td><td>25G</td></tr>
<tr><td>5MB*100 Pub/Sub</td><td>RocksMQ</td><td>50</td><td>2.475595131 s/op</td><td>1,18 GB</td><td>81.42</td><td>19G</td></tr>
<tr><td>1MB*500 Pub/Sub</td><td>NATS</td><td>50</td><td>2.248722593 s/op</td><td>2,60 GB</td><td>96.50</td><td>25G</td></tr>
<tr><td>1MB*500 Pub/Sub</td><td>RocksMQ</td><td>50</td><td>2.554614279 s/op</td><td>614,9 MB</td><td>80.19</td><td>19G</td></tr>
<tr><td>64KB*10000 Pub/Sub</td><td>NATS</td><td>50</td><td>2.133345262 s/op</td><td>3,29 GB</td><td>97.59</td><td>31G</td></tr>
<tr><td>64KB*10000 Pub/Sub</td><td>RocksMQ</td><td>50</td><td>3.253778195 s/op</td><td>331,2 MB</td><td>134.6</td><td>24G</td></tr>
<tr><td>1KB*50000 Pub/Sub</td><td>NATS</td><td>50</td><td>2.629391004 s/op</td><td>635,1 MB</td><td>179.67</td><td>2.6G</td></tr>
<tr><td>1KB*50000 Pub/Sub</td><td>RocksMQ</td><td>50</td><td>0,897638581 s/op</td><td>232,3 MB</td><td>60.42</td><td>521M</td></tr>
</tbody>
</table>
<p>Tabla 1: Resultados de las pruebas de rendimiento Pub/Sub</p>
<h3 id="Milvus-Integration-Testing" class="common-anchor-header">Pruebas de integración de Milvus</h3><p><strong>Tamaño de los datos:</strong> 100M</p>
<p><strong>Resultado:</strong> En pruebas exhaustivas con un conjunto de datos de 100 millones de vectores, NATS mostró una menor latencia de búsqueda y consulta de vectores.</p>
<table>
<thead>
<tr><th>Métricas</th><th>RocksMQ (ms)</th><th>NATS (ms)</th></tr>
</thead>
<tbody>
<tr><td>Latencia media de búsqueda de vectores</td><td>23.55</td><td>20.17</td></tr>
<tr><td>Peticiones de búsqueda vectorial por segundo (RPS)</td><td>2.95</td><td>3.07</td></tr>
<tr><td>Latencia media de la consulta</td><td>7.2</td><td>6.74</td></tr>
<tr><td>Peticiones de consulta por segundo (RPS)</td><td>1.47</td><td>1.54</td></tr>
</tbody>
</table>
<p>Tabla 2: Resultados de las pruebas de integración de Milvus con un conjunto de datos de 100 millones</p>
<p><strong>Conjunto de datos: &lt;100M</strong></p>
<p><strong>Resultado:</strong> Para conjuntos de datos inferiores a 100M, NATS y RocksMQ muestran un rendimiento similar.</p>
<h2 id="Conclusion-Empowering-Milvus-with-NATS-messaging" class="common-anchor-header">Conclusión: Potenciación de Milvus con la mensajería NATS<button data-href="#Conclusion-Empowering-Milvus-with-NATS-messaging" class="anchor-icon" translate="no">
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
    </button></h2><p>La integración de NATS en Milvus supone un avance significativo en el procesamiento de datos. Tanto si se adentra en el análisis en tiempo real como en aplicaciones de aprendizaje automático o en cualquier empresa que haga un uso intensivo de los datos, NATS dota a sus proyectos de eficacia, fiabilidad y velocidad. A medida que evoluciona el panorama de los datos, contar con un sistema de mensajería robusto como NATS dentro de Milvus garantiza una comunicación de datos fluida, fiable y de alto rendimiento.</p>
