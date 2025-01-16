---
id: build-multi-tenancy-rag-with-milvus-best-practices-part-one.md
title: >-
  Diseño de RAG multitenencia con Milvus: mejores prácticas para bases de
  conocimiento empresariales escalables
author: Robert Guo
date: 2024-12-04T00:00:00.000Z
cover: assets.zilliz.com/Designing_Multi_Tenancy_RAG_with_Milvus_40b3737145.png
tag: Engineering
tags: >-
  Milvus, contribute to open-source projects, vector databases, Contribute to
  Milvus
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/build-multi-tenancy-rag-with-milvus-best-practices-part-one
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
    </button></h2><p>En los últimos dos años, <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">la Generación Mejorada por Recuperación (RAG)</a> ha surgido como una solución de confianza para que las grandes organizaciones mejoren sus aplicaciones <a href="https://zilliz.com/glossary/large-language-models-(llms)">basadas en LLM</a>, especialmente aquellas con usuarios diversos. A medida que estas aplicaciones crecen, resulta esencial implementar un marco de multiarrendamiento. <strong>La multitenencia</strong> proporciona un acceso seguro y aislado a los datos para diferentes grupos de usuarios, lo que garantiza la confianza de los usuarios, el cumplimiento de las normas reglamentarias y la mejora de la eficiencia operativa.</p>
<p><a href="https://zilliz.com/what-is-milvus">Milvus</a> es una <a href="https://zilliz.com/learn/what-is-vector-database">base de datos vectorial</a> de código abierto creada para manejar <a href="https://zilliz.com/glossary/vector-embeddings">datos vectoriales</a> de alta dimensión. Es un componente de infraestructura indispensable del GAR, que almacena y recupera información contextual para los LLM de fuentes externas. Milvus ofrece <a href="https://milvus.io/docs/multi_tenancy.md">estrategias flexibles de multi-tenencia</a> para diversas necesidades, incluyendo <strong>multi-tenencia a nivel de base de datos, a nivel de colección y a nivel de partición</strong>.</p>
<p>En este post, cubriremos:</p>
<ul>
<li><p>Qué es la multitenencia y por qué es importante</p></li>
<li><p>Estrategias de multiarrendamiento en Milvus</p></li>
<li><p>Ejemplo: Estrategia de multiarrendamiento para una base de conocimiento empresarial potenciada por RAG</p></li>
</ul>
<h2 id="What-is-Multi-Tenancy-and-Why-It-Matters" class="common-anchor-header">Qué es la multitenencia y por qué es importante<button data-href="#What-is-Multi-Tenancy-and-Why-It-Matters" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/multi_tenancy.md"><strong>El multiarrendamiento</strong></a> es una arquitectura en la que varios clientes o equipos, conocidos como &quot;<strong>arrendatarios&quot;,</strong> comparten una única instancia de una aplicación o sistema. Los datos y las configuraciones de cada inquilino están aislados lógicamente, lo que garantiza la privacidad y la seguridad, mientras que todos los inquilinos comparten la misma infraestructura subyacente.</p>
<p>Imagine una plataforma SaaS que proporciona soluciones basadas en el conocimiento a múltiples empresas. Cada empresa es un inquilino.</p>
<ul>
<li><p>El inquilino A es una organización sanitaria que almacena preguntas frecuentes dirigidas a los pacientes y documentos de cumplimiento.</p></li>
<li><p>El inquilino B es una empresa tecnológica que gestiona flujos de trabajo internos de solución de problemas de TI.</p></li>
<li><p>El inquilino C es una empresa minorista con preguntas frecuentes de atención al cliente para devoluciones de productos.</p></li>
</ul>
<p>Cada inquilino opera en un entorno completamente aislado, garantizando que ningún dato del inquilino A se filtre al sistema del inquilino B o viceversa. Además, la asignación de recursos, el rendimiento de las consultas y las decisiones de escalado son específicas de cada inquilino, lo que garantiza un alto rendimiento independientemente de los picos de carga de trabajo en un inquilino.</p>
<p>El multiarrendamiento también funciona para sistemas que dan servicio a diferentes equipos dentro de la misma organización. Imagínese una gran empresa que utiliza una base de conocimientos basada en RAG para dar servicio a sus departamentos internos, como RRHH, Legal y Marketing. En esta configuración, cada <strong>departamento es un inquilino</strong> con datos y recursos aislados.</p>
<p>El multiarrendamiento ofrece importantes ventajas, como <strong>la rentabilidad, la escalabilidad y una sólida seguridad de los datos</strong>. Al compartir una única infraestructura, los proveedores de servicios pueden reducir los gastos generales y garantizar un consumo más eficaz de los recursos. Este enfoque también se adapta sin esfuerzo: la incorporación de nuevos inquilinos requiere muchos menos recursos que la creación de instancias independientes para cada uno, como ocurre con los modelos de tenencia única. Y lo que es más importante, la multitenencia mantiene una sólida seguridad de los datos al garantizar un estricto aislamiento de los datos de cada inquilino, con controles de acceso y cifrado que protegen la información confidencial de accesos no autorizados. Además, las actualizaciones, los parches y las nuevas funciones pueden desplegarse simultáneamente en todos los inquilinos, lo que simplifica el mantenimiento del sistema y reduce la carga de trabajo de los administradores, al tiempo que garantiza el cumplimiento de las normas de seguridad y conformidad.</p>
<h2 id="Multi-Tenancy-Strategies-in-Milvus" class="common-anchor-header">Estrategias de multiarrendamiento en Milvus<button data-href="#Multi-Tenancy-Strategies-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Para entender cómo Milvus soporta la multitenencia, es importante ver primero cómo organiza los datos de usuario.</p>
<h3 id="How-Milvus-Organizes-User-Data" class="common-anchor-header">Cómo organiza Milvus los datos de usuario</h3><p>Milvus estructura los datos en tres capas, yendo de lo amplio a lo granular: <a href="https://milvus.io/docs/manage_databases.md"><strong>Base de datos</strong></a>, <a href="https://milvus.io/docs/manage-collections.md"><strong>Colección</strong></a> y <a href="https://milvus.io/docs/manage-partitions.md"><strong>Partición/Clave de partición</strong></a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_How_Milvus_organizes_user_data_4521c4b8f9.png" alt="Figure- How Milvus organizes user data .png" class="doc-image" id="figure--how-milvus-organizes-user-data-.png" />
   </span> <span class="img-wrapper"> <span>Figura- Cómo organiza Milvus los datos de usuario .png</span> </span></p>
<p><em>Figura: Cómo organiza Milvus los datos de usuario</em></p>
<ul>
<li><p><strong>Base de datos</strong>: Actúa como un contenedor lógico, similar a una base de datos en los sistemas relacionales tradicionales.</p></li>
<li><p><strong>Colección</strong>: Comparable a una tabla dentro de una base de datos, una colección organiza los datos en grupos manejables.</p></li>
<li><p><strong>Partición/Clave de partición</strong>: Dentro de una colección, los datos pueden segmentarse aún más por <strong>Particiones</strong>. Utilizando una clave de <strong>partición</strong>, los datos con la misma clave se agrupan. Por ejemplo, si utiliza un <strong>ID de usuario</strong> como <strong>clave</strong> de <strong>partición</strong>, todos los datos de un usuario específico se almacenarán en el mismo segmento lógico. Esto facilita la recuperación de datos vinculados a usuarios individuales.</p></li>
</ul>
<p>A medida que se pasa de <strong>la Base de Datos</strong> a la <strong>Colección</strong> y a la <strong>Clave de Partición</strong>, la granularidad de la organización de los datos se hace progresivamente más fina.</p>
<p>Para garantizar una mayor seguridad de los datos y un control de acceso adecuado, Milvus también proporciona un sólido <a href="https://zilliz.com/blog/enabling-fine-grained-access-control-with-milvus-row-level-rbac"><strong>Control de Acceso Basado en Funciones (RBAC)</strong></a>, que permite a los administradores definir permisos específicos para cada usuario. Sólo los usuarios autorizados pueden acceder a determinados datos.</p>
<p>Milvus admite <a href="https://milvus.io/docs/multi_tenancy.md">múltiples estrategias</a> para implementar la multitenencia, ofreciendo flexibilidad basada en las necesidades de su aplicación: <strong>multitenencia a nivel de base de datos, a nivel de colección y a nivel de partición</strong>.</p>
<h3 id="Database-Level-Multi-Tenancy" class="common-anchor-header">Multi-tenencia a nivel de base de datos</h3><p>Con el enfoque de multiarrendamiento a nivel de base de datos, a cada arrendatario se le asigna su propia base de datos dentro del mismo clúster Milvus. Esta estrategia proporciona un fuerte aislamiento de los datos y garantiza un rendimiento óptimo de las búsquedas. Sin embargo, puede conducir a una utilización ineficiente de los recursos si algunos inquilinos permanecen inactivos.</p>
<h3 id="Collection-Level-Multi-Tenancy" class="common-anchor-header">Multiarrendamiento a nivel de colección</h3><p>Aquí, en la multitenencia a nivel de colección, podemos organizar los datos para los inquilinos de dos maneras.</p>
<ul>
<li><p><strong>Una colección para todos los arrendatarios</strong>: Todos los arrendatarios comparten una única colección, con campos específicos del arrendatario utilizados para el filtrado. Aunque es fácil de implementar, este enfoque puede encontrar cuellos de botella en el rendimiento a medida que aumenta el número de inquilinos.</p></li>
<li><p><strong>Una colección por inquilino</strong>: Cada inquilino puede tener una colección dedicada, lo que mejora el aislamiento y el rendimiento, pero requiere más recursos. Esta configuración puede enfrentarse a limitaciones de escalabilidad si el número de inquilinos supera la capacidad de recogida de Milvus.</p></li>
</ul>
<h3 id="Partition-Level-Multi-Tenancy" class="common-anchor-header">Multiarrendamiento a nivel de partición</h3><p>Partition-Level Multi-Tenancy se centra en la organización de inquilinos dentro de una única colección. Aquí, también tenemos dos formas de organizar los datos de los inquilinos.</p>
<ul>
<li><p><strong>Una partición por inquilino</strong>: Los inquilinos comparten una colección, pero sus datos se almacenan en particiones separadas. Podemos aislar los datos asignando a cada tenant una partición dedicada, equilibrando el aislamiento y el rendimiento de la búsqueda. Sin embargo, este enfoque está restringido por el límite máximo de particiones de Milvus.</p></li>
<li><p><strong>Multiarrendamiento basado en claves de partición</strong>: Se trata de una opción más escalable en la que una única colección utiliza claves de partición para distinguir a los inquilinos. Este método simplifica la gestión de recursos y permite una mayor escalabilidad, pero no admite la inserción masiva de datos.</p></li>
</ul>
<p>La siguiente tabla resume las principales diferencias entre los enfoques de multitenencia basados en claves.</p>
<table>
<thead>
<tr><th><strong>Granularidad</strong></th><th><strong>A nivel de base de datos</strong></th><th><strong>Nivel de colección</strong></th><th><strong>Nivel de clave de partición</strong></th></tr>
</thead>
<tbody>
<tr><td>Número máximo de inquilinos admitidos</td><td>~1,000</td><td>~10,000</td><td>~10,000,000</td></tr>
<tr><td>Flexibilidad de organización de datos</td><td>Alta: Los usuarios pueden definir múltiples colecciones con esquemas personalizados.</td><td>Media: Los usuarios están limitados a una colección con un esquema personalizado.</td><td>Baja: Todos los usuarios comparten una colección, lo que requiere un esquema coherente.</td></tr>
<tr><td>Coste por usuario</td><td>Alto</td><td>Medio</td><td>Bajo</td></tr>
<tr><td>Aislamiento de recursos físicos</td><td>Sí</td><td>Sí</td><td>No</td></tr>
<tr><td>RBAC</td><td>Sí</td><td>Sí</td><td>No</td></tr>
<tr><td>Rendimiento de la búsqueda</td><td>Fuerte</td><td>Media</td><td>Fuerte</td></tr>
</tbody>
</table>
<h2 id="Example-Multi-Tenancy-Strategy-for-a-RAG-Powered-Enterprise-Knowledge-Base" class="common-anchor-header">Ejemplo: Estrategia de multiarrendamiento para una base de conocimiento empresarial potenciada por RAG<button data-href="#Example-Multi-Tenancy-Strategy-for-a-RAG-Powered-Enterprise-Knowledge-Base" class="anchor-icon" translate="no">
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
    </button></h2><p>Al diseñar la estrategia de multiarrendamiento para un sistema RAG, es esencial alinear su enfoque con las necesidades específicas de su empresa y sus arrendatarios. Milvus ofrece varias estrategias de multiarrendamiento, y elegir la correcta depende del número de arrendatarios, sus requisitos y el nivel de aislamiento de datos necesario. A continuación le ofrecemos una guía práctica para tomar estas decisiones, tomando como ejemplo una base de conocimiento empresarial impulsada por RAG.</p>
<h3 id="Understanding-Tenant-Structure-Before-Choosing-a-Multi-Tenancy-Strategy" class="common-anchor-header">Comprender la estructura de los inquilinos antes de elegir una estrategia multiinquilino</h3><p>Una base de conocimiento empresarial impulsada por RAG a menudo sirve a un pequeño número de inquilinos. Estos inquilinos suelen ser unidades de negocio independientes como TI, Ventas, Legal y Marketing, cada una de las cuales requiere servicios de base de conocimiento distintos. Por ejemplo, el departamento de RR.HH. gestiona información sensible sobre los empleados, como guías de incorporación y políticas de beneficios, que deben ser confidenciales y accesibles sólo para el personal de RR.HH..</p>
<p>En este caso, cada unidad de negocio debe tratarse como un inquilino independiente y una <strong>estrategia de multiarrendamiento a nivel de base de datos</strong> suele ser la más adecuada. Al asignar bases de datos dedicadas a cada inquilino, las organizaciones pueden lograr un fuerte aislamiento lógico, simplificando la gestión y mejorando la seguridad. Esta configuración proporciona a los inquilinos una gran flexibilidad: pueden definir modelos de datos personalizados dentro de las colecciones, crear tantas colecciones como sea necesario y gestionar de forma independiente el control de acceso a sus colecciones.</p>
<h3 id="Enhancing-Security-with-Physical-Resource-Isolation" class="common-anchor-header">Mejora de la seguridad con el aislamiento de recursos físicos</h3><p>En situaciones en las que la seguridad de los datos es una prioridad, el aislamiento lógico a nivel de base de datos puede no ser suficiente. Por ejemplo, algunas unidades de negocio pueden manejar datos críticos o altamente sensibles, requiriendo garantías más fuertes contra la interferencia de otros inquilinos. En estos casos, podemos aplicar un <a href="https://milvus.io/docs/resource_group.md">enfoque de aislamiento físico</a> sobre una estructura multiarrendamiento a nivel de base de datos.</p>
<p>Milvus nos permite asignar componentes lógicos, como bases de datos y colecciones, a recursos físicos. Este método garantiza que las actividades de otros inquilinos no afecten a las operaciones críticas. Exploremos cómo funciona este enfoque en la práctica.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_How_Milvus_manages_physical_resources_6269b908d7.png" alt="Figure- How Milvus manages physical resources.png" class="doc-image" id="figure--how-milvus-manages-physical-resources.png" />
   </span> <span class="img-wrapper"> <span>Figura- Cómo gestiona Milvus los recursos físicos.png</span> </span></p>
<p>Figura: Cómo gestiona Milvus los recursos físicos</p>
<p>Como se muestra en el diagrama anterior, hay tres capas de gestión de recursos en Milvus: <strong>Nodo de consulta</strong>, <strong>Grupo de recursos</strong> y <strong>Base de datos</strong>.</p>
<ul>
<li><p><strong>Nodo de consulta</strong>: El componente que procesa las tareas de consulta. Se ejecuta en una máquina física o contenedor (por ejemplo, un pod en Kubernetes).</p></li>
<li><p><strong>Grupo de recursos</strong>: Una colección de Nodos de Consulta que actúa como puente entre los componentes lógicos (bases de datos y colecciones) y los recursos físicos. Puede asignar una o más bases de datos o colecciones a un único Grupo de Recursos.</p></li>
</ul>
<p>En el ejemplo del diagrama anterior, hay tres <strong>bases de datos lógicas</strong>: X, Y y Z.</p>
<ul>
<li><p><strong>Base de datos X</strong>: contiene <strong>la colección A</strong>.</p></li>
<li><p><strong>Base de datos Y</strong>: contiene las <strong>colecciones B</strong> y <strong>C</strong>.</p></li>
<li><p><strong>Base de datos Z</strong>: contiene las <strong>colecciones D</strong> y <strong>E</strong>.</p></li>
</ul>
<p>Supongamos que <strong>la base</strong> de <strong>datos X</strong> contiene una base de conocimientos crítica que no queremos que se vea afectada por la carga de la <strong>base</strong> de <strong>datos Y</strong> o la <strong>base de datos Z</strong>. Para garantizar el aislamiento de los datos:</p>
<ul>
<li><p>A<strong>la Base de Datos X</strong> se le asigna su propio <strong>Grupo de Recursos</strong> para garantizar que su base de conocimiento crítica no se ve afectada por las cargas de trabajo de otras bases de datos.</p></li>
<li><p><strong>La colección E</strong> también se asigna a un <strong>grupo de recursos</strong> independiente dentro de su base de datos principal<strong>(Z</strong>). Esto proporciona aislamiento a nivel de colección para datos críticos específicos dentro de una base de datos compartida.</p></li>
</ul>
<p>Mientras tanto, las colecciones restantes de <strong>las bases de datos Y</strong> y <strong>Z</strong> comparten los recursos físicos del <strong>grupo de recursos 2</strong>.</p>
<p>Al asignar cuidadosamente los componentes lógicos a los recursos físicos, las organizaciones pueden lograr una arquitectura multi-tenancy flexible, escalable y segura adaptada a sus necesidades empresariales específicas.</p>
<h3 id="Designing-End-User-Level-Access" class="common-anchor-header">Diseño del acceso a nivel de usuario final</h3><p>Ahora que hemos aprendido las mejores prácticas para elegir una estrategia multi-tenancy para un RAG empresarial, vamos a explorar cómo diseñar el acceso a nivel de usuario en este tipo de sistemas.</p>
<p>En estos sistemas, los usuarios finales suelen interactuar con la base de conocimientos en modo de sólo lectura a través de los LLM. Sin embargo, las organizaciones siguen necesitando hacer un seguimiento de los datos de preguntas y respuestas generados por los usuarios y vincularlos a usuarios específicos con diversos fines, como mejorar la precisión de la base de conocimientos u ofrecer servicios personalizados.</p>
<p>Tomemos como ejemplo el servicio de consultas inteligentes de un hospital. Los pacientes pueden hacer preguntas como: "¿Hay alguna cita disponible con el especialista hoy?" o "¿Se necesita alguna preparación específica para mi próxima cirugía?". Aunque estas preguntas no afectan directamente a la base de conocimientos, es importante que el hospital realice un seguimiento de estas interacciones para mejorar los servicios. Estos pares de preguntas y respuestas suelen almacenarse en una base de datos independiente (no tiene por qué ser necesariamente una base de datos vectorial) dedicada a registrar las interacciones.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_The_multi_tenancy_architecture_for_an_enterprise_RAG_knowledge_base_7c9ad8d4d1.png" alt="Figure- The multi-tenancy architecture for an enterprise RAG knowledge base .png" class="doc-image" id="figure--the-multi-tenancy-architecture-for-an-enterprise-rag-knowledge-base-.png" />
   </span> <span class="img-wrapper"> <span>Figura- Arquitectura multiarrendamiento para una base de conocimientos RAG empresarial .png</span> </span></p>
<p><em>Figura: Arquitectura multiarrendamiento para una base de conocimientos RAG empresarial</em></p>
<p>El diagrama anterior muestra la arquitectura multi-tenencia de un sistema RAG empresarial.</p>
<ul>
<li><p><strong>Los administradores del</strong> sistema supervisan el sistema RAG, gestionan la asignación de recursos, asignan bases de datos, las asignan a grupos de recursos y garantizan la escalabilidad. Se encargan de la infraestructura física, como se muestra en el diagrama, donde cada grupo de recursos (por ejemplo, los grupos de recursos 1, 2 y 3) se asigna a servidores físicos (nodos de consulta).</p></li>
<li><p><strong>Los inquilinos (propietarios de bases de datos y desarrolladores)</strong> gestionan la base de conocimientos, iterando sobre ella a partir de los datos de preguntas y respuestas generados por los usuarios, como se muestra en el diagrama. Diferentes bases de datos (Base de datos X, Y, Z) contienen colecciones con diferentes contenidos de la base de conocimientos (Colección A, B, etc.).</p></li>
<li><p><strong>Los usuarios finales</strong> interactúan con el sistema en modo de sólo lectura a través del LLM. A medida que consultan el sistema, sus preguntas se registran en la tabla de registro de preguntas y respuestas (una base de datos independiente), con lo que el sistema recibe continuamente datos valiosos.</p></li>
</ul>
<p>Este diseño garantiza que cada capa del proceso -desde la interacción con el usuario hasta la administración del sistema- funcione a la perfección, ayudando a la organización a crear una base de conocimientos sólida y en continua mejora.</p>
<h2 id="Summary" class="common-anchor-header">Resumen<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>En este blog, hemos explorado cómo los marcos <a href="https://milvus.io/docs/multi_tenancy.md"><strong>multi-tenancy</strong></a> juegan un papel crítico en la escalabilidad, seguridad y rendimiento de las bases de conocimiento impulsadas por RAG. Al aislar los datos y los recursos para diferentes inquilinos, las empresas pueden garantizar la privacidad, el cumplimiento normativo y la asignación optimizada de recursos a través de una infraestructura compartida. <a href="https://milvus.io/docs/overview.md">Milvus</a>, con sus estrategias flexibles de multiarrendamiento, permite a las empresas elegir el nivel adecuado de aislamiento de datos -desde el nivel de base de datos hasta el nivel de partición- en función de sus necesidades específicas. Elegir el enfoque de multiarrendamiento adecuado garantiza que las empresas puedan ofrecer servicios personalizados a los inquilinos, incluso cuando se trata de datos y cargas de trabajo diversos.</p>
<p>Siguiendo las mejores prácticas aquí descritas, las organizaciones pueden diseñar y gestionar eficazmente sistemas RAG multiarrendamiento que no sólo ofrecen experiencias de usuario superiores, sino que también se escalan sin esfuerzo a medida que crecen las necesidades empresariales. La arquitectura de Milvus garantiza que las empresas puedan mantener altos niveles de aislamiento, seguridad y rendimiento, lo que la convierte en un componente crucial en la creación de bases de conocimiento potenciadas por RAG de nivel empresarial.</p>
<h2 id="Stay-Tuned-for-More-Insights-into-Multi-Tenancy-RAG" class="common-anchor-header">Manténgase en sintonía para obtener más información sobre RAG de tenencia múltiple<button data-href="#Stay-Tuned-for-More-Insights-into-Multi-Tenancy-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>En este blog, hemos discutido cómo las estrategias de tenencia múltiple de Milvus están diseñadas para administrar inquilinos, pero no usuarios finales dentro de esos inquilinos. Las interacciones de los usuarios finales suelen producirse en la capa de la aplicación, mientras que la propia base de datos vectorial permanece ajena a esos usuarios.</p>
<p>Es posible que se pregunte: <em>Si quiero ofrecer respuestas más precisas basadas en el historial de consultas de cada usuario final, ¿no necesita Milvus mantener un contexto de preguntas y respuestas personalizado para cada usuario?</em></p>
<p>Es una gran pregunta, y la respuesta depende realmente del caso de uso. Por ejemplo, en un servicio de consulta a la carta, las consultas son aleatorias, y la atención se centra más en la calidad de la base de conocimientos que en hacer un seguimiento del contexto histórico de un usuario.</p>
<p>Sin embargo, en otros casos, los sistemas GAR deben ser conscientes del contexto. Cuando esto es necesario, Milvus tiene que colaborar con la capa de aplicación para mantener una memoria personalizada del contexto de cada usuario. Este diseño es especialmente importante para aplicaciones con usuarios finales masivos, que exploraremos con más detalle en mi próximo post. Permanezca atento para conocer más detalles.</p>
