---
id: 2022-1-25-annoucing-general-availability-of-milvus-2-0.md
title: Disponibilidad general de Milvus 2.0
author: Xiaofan Luan
date: 2022-01-25T00:00:00.000Z
desc: Una forma sencilla de manejar datos masivos de alta dimensión
cover: assets.zilliz.com/Milvus_2_0_GA_4308a0f552.png
tag: News
---
<p>Estimados miembros y amigos de la comunidad Milvus:</p>
<p>Hoy, seis meses después de que se hiciera pública la primera versión candidata (RC), estamos encantados de anunciar que Milvus 2.0 está <a href="https://milvus.io/docs/v2.0.x/release_notes.md#v200">disponible de forma general (GA)</a> y listo para la producción. Ha sido un largo viaje, y agradecemos a todos - colaboradores de la comunidad, usuarios, y la Fundación LF AI &amp; Data - a lo largo del camino que nos ayudaron a hacer esto posible.</p>
<p>Hoy en día, la capacidad de manejar miles de millones de datos de alta dimensionalidad es muy importante para los sistemas de IA, y por buenas razones:</p>
<ol>
<li>Los datos no estructurados ocupan volúmenes dominantes en comparación con los datos estructurados tradicionales.</li>
<li>La actualidad de los datos nunca ha sido tan importante. Los científicos de datos están ansiosos por soluciones de datos oportunas en lugar del compromiso tradicional T+1.</li>
<li>El coste y el rendimiento se han vuelto aún más críticos y, sin embargo, sigue existiendo una gran brecha entre las soluciones actuales y los casos de uso del mundo real. De ahí Milvus 2.0. Milvus es una base de datos que ayuda a manejar datos de alta dimensión a escala. Está diseñada para la nube con la capacidad de ejecutarse en cualquier lugar. Si ha estado siguiendo nuestras versiones RC, sabrá que hemos dedicado un gran esfuerzo a hacer que Milvus sea más estable y más fácil de implementar y mantener.</li>
</ol>
<h2 id="Milvus-20-GA-now-offers" class="common-anchor-header">Milvus 2.0 GA ahora ofrece<button data-href="#Milvus-20-GA-now-offers" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Eliminación de entidades</strong></p>
<p>Como base de datos, Milvus soporta ahora el borrado <a href="https://milvus.io/docs/v2.0.x/delete_data.md">de entidades por clave primaria</a> y soportará el borrado de entidades por expresión más adelante.</p>
<p><strong>Equilibrio de carga automático</strong></p>
<p>Milvus soporta ahora la política de equilibrio de carga plugin para equilibrar la carga de cada nodo de consulta y nodo de datos. Gracias a la desagregación de la computación y el almacenamiento, el equilibrio se realizará en sólo un par de minutos.</p>
<p><strong>Traspaso</strong></p>
<p>Una vez sellados los segmentos en crecimiento mediante la descarga, las tareas de traspaso sustituyen los segmentos en crecimiento por segmentos históricos indexados para mejorar el rendimiento de la búsqueda.</p>
<p><strong>Compactación de datos</strong></p>
<p>La compactación de datos es una tarea en segundo plano para fusionar segmentos pequeños en grandes y limpiar los datos lógicos eliminados.</p>
<p><strong>Compatibilidad con etcd integrado y almacenamiento de datos local</strong></p>
<p>En el modo autónomo de Milvus, podemos eliminar la dependencia de etcd/MinIO con unas pocas configuraciones. El almacenamiento local de datos también puede utilizarse como caché local para evitar cargar todos los datos en la memoria principal.</p>
<p><strong>SDKs multilenguaje</strong></p>
<p>Además de <a href="https://github.com/milvus-io/pymilvus">PyMilvus</a>, <a href="https://github.com/milvus-io/milvus-sdk-node">Node.js</a>, <a href="https://github.com/milvus-io/milvus-sdk-java">Java</a> y <a href="https://github.com/milvus-io/milvus-sdk-go">Go</a> SDKs están ahora listos para usar.</p>
<p><strong>Operador Milvus K8s</strong></p>
<p><a href="https://milvus.io/docs/v2.0.x/install_cluster-milvusoperator.md">Milvus Operator</a> proporciona una solución sencilla para desplegar y gestionar una pila de servicios Milvus completa, incluyendo tanto los componentes Milvus como sus dependencias relevantes (por ejemplo, etcd, Pulsar y MinIO), en los clústeres <a href="https://kubernetes.io/">Kubernetes</a> de destino de forma escalable y altamente disponible.</p>
<p><strong>Herramientas que ayudan a gestionar Milvus</strong></p>
<p>Tenemos que agradecer <a href="https://zilliz.com/">a Zilliz</a> la fantástica aportación de herramientas de gestión. Ahora tenemos <a href="https://milvus.io/docs/v2.0.x/attu.md">Attu</a>, que nos permite interactuar con Milvus a través de una GUI intuitiva, y <a href="https://milvus.io/docs/v2.0.x/cli_overview.md">Milvus_CLI</a>, una herramienta de línea de comandos para gestionar Milvus.</p>
<p>Gracias a los 212 colaboradores, la comunidad completó 6718 commits durante los últimos 6 meses, y se han cerrado toneladas de problemas de estabilidad y rendimiento. Abriremos nuestro informe de estabilidad y rendimiento poco después del lanzamiento de la versión 2.0 GA.</p>
<h2 id="Whats-next" class="common-anchor-header">¿Y ahora qué?<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Funcionalidad</strong></p>
<p>La compatibilidad con los tipos de cadenas será la próxima característica estrella de Milvus 2.1. También incorporaremos el mecanismo de tiempo de vida (TTL) y la gestión básica de ACL para satisfacer mejor las necesidades de los usuarios.</p>
<p><strong>Disponibilidad</strong></p>
<p>Estamos trabajando en la refactorización del mecanismo de programación de coordenadas de consulta para soportar múltiples réplicas de memoria para cada segmento. Con múltiples réplicas activas, Milvus puede soportar una conmutación por error y una ejecución especulativa más rápidas para reducir el tiempo de inactividad a un par de segundos.</p>
<p><strong>Rendimiento</strong></p>
<p>Los resultados de las pruebas de rendimiento se ofrecerán en breve en nuestros sitios web. Se prevé que en las siguientes versiones se produzca una impresionante mejora del rendimiento. Nuestro objetivo es reducir a la mitad la latencia de búsqueda en conjuntos de datos más pequeños y duplicar el rendimiento del sistema.</p>
<p><strong>Facilidad de uso</strong></p>
<p>Milvus está diseñado para funcionar en cualquier lugar. Daremos soporte a Milvus en MacOS (tanto M1 como X86) y en servidores ARM en las próximas pequeñas versiones. También ofreceremos PyMilvus embebido para que pueda simplemente <code translate="no">pip install</code> Milvus sin una configuración compleja del entorno.</p>
<p><strong>Gobierno de la comunidad</strong></p>
<p>Perfeccionaremos las normas de afiliación y aclararemos los requisitos y responsabilidades de las funciones de los colaboradores. También se está desarrollando un programa de mentores; para cualquiera que esté interesado en bases de datos nativas de la nube, búsqueda vectorial y/o gobierno de la comunidad, no dude en ponerse en contacto con nosotros.</p>
<p>Estamos muy entusiasmados con la última versión de Milvus GA. Como siempre, estamos encantados de escuchar sus comentarios. Si encuentra algún problema, no dude en ponerse en contacto con nosotros en <a href="https://github.com/milvus-io/milvus">GitHub</a> o a través de <a href="http://milvusio.slack.com/">Slack</a>.</p>
<p><br/></p>
<p>Saludos cordiales,</p>
<p>Xiaofan Luan</p>
<p>Mantenedor del proyecto Milvus</p>
<p><br/></p>
<blockquote>
<p><em>Editado por <a href="https://github.com/claireyuw">Claire Yu</a>.</em></p>
</blockquote>
