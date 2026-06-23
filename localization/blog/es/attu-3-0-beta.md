---
id: attu-3-0-beta.md
title: >
  Attu 3.0 Beta: gestión de múltiples clústeres, agente de IA y una consola
  Milvus rediseñada
author: Ray Jiang
date: 2026-06-11T00:00:00.000Z
cover: assets.zilliz.com/Attu_3_0_New_cover_1af4c44467.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Attu, Milvus, vector database, AI agent, database management'
meta_keywords: >-
  Attu 3.0, Milvus management, Attu AI Agent, multi-cluster Milvus, vector
  database GUI
meta_title: >
  Attu 3.0 Beta: Multi-Cluster Management, AI Agent, and a Rebuilt Milvus
  Console
desc: >
  La versión beta de Attu 3.0 renueva la consola de gestión de Milvus con
  funciones de gestión multiclúster, estado persistente, un agente de IA
  integrado, diagnósticos avanzados, métricas en tiempo real, depuración de API,
  copias de seguridad y restauración, y flujos de trabajo RBAC simplificados.
origin: 'https://milvus.io/blog/attu-3-0-beta.md'
---
<p>Ya está disponible Attu 3.0 Beta.</p>
<p><a href="https://github.com/zilliztech/attu"><strong>Attu</strong></a> es la consola de gestión de código abierto para <a href="https://milvus.io"><strong>Milvus</strong></a>. Si has utilizado Milvus de forma local o en producción, probablemente hayas utilizado Attu para inspeccionar colecciones, explorar datos, gestionar esquemas o comprobar qué está sucediendo dentro de un clúster.</p>
<p>Attu 2.x funcionaba bien para la gestión básica de un único clúster. Sin embargo, a medida que crecían las implementaciones de Milvus, sus limitaciones se hicieron más evidentes. Solo podía conectarse a una instancia de Milvus a la vez. El estado de la conexión se perdía tras reiniciar un contenedor. La exploración de datos se centraba principalmente en las colecciones. El diagnóstico, la supervisión, la depuración de la API, las copias de seguridad y la restauración, así como la gestión de permisos, solían requerir herramientas independientes o pasos manuales.</p>
<p><strong>Attu 3.0 Beta supone una reconstrucción completa de la experiencia de gestión de Milvus.</strong></p>
<p>Esta versión añade gestión multiclúster, estado local persistente, un agente de IA integrado con más de 50 herramientas de Milvus, capacidades de diagnóstico avanzadas, un explorador de datos rediseñado, métricas de Prometheus integradas, un «API Playground», copias de seguridad y restauraciones basadas en la interfaz gráfica de usuario (GUI) y flujos de trabajo RBAC simplificados.</p>
<p>En resumen, Attu ya no es solo un visor ligero para una instancia de Milvus. Se está convirtiendo en una consola de operaciones práctica para desarrolladores y equipos que gestionan Milvus en entornos locales, de prueba y de producción.</p>
<h2 id="What-Changed-in-Attu-30-Beta" class="common-anchor-header">Qué ha cambiado en Attu 3.0 Beta<button data-href="#What-Changed-in-Attu-30-Beta" class="anchor-icon" translate="no">
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
    </button></h2><p>A continuación se presenta una comparación general entre Attu 2.x y Attu 3.0 Beta.</p>
<table>
<thead>
<tr><th>Característica</th><th>Attu 2.x</th><th>Attu 3.0 Beta</th></tr>
</thead>
<tbody>
<tr><td>Conexiones de clúster</td><td>Solo una instancia</td><td>Varios clústeres con cambio con un solo clic</td></tr>
<tr><td>Persistencia de estado</td><td>Sin estado; se pierde al reiniciar el contenedor</td><td>Base de datos local; se conserva tras los reinicios</td></tr>
<tr><td>Asistencia mediante IA</td><td>Ninguna</td><td>Agente integrado con más de 50 herramientas de Milvus</td></tr>
<tr><td>Diagnóstico</td><td>Investigación manual</td><td>4 habilidades de diagnóstico integradas de nivel experto</td></tr>
<tr><td>Gestión RBAC</td><td>Páginas independientes, flujo de varios pasos</td><td>Creación de usuarios en contexto con un solo clic</td></tr>
<tr><td>Navegación por los datos</td><td>Lista plana de colecciones</td><td>Árbol jerárquico: base de datos → colección → partición</td></tr>
<tr><td>Supervisión</td><td>Se requiere Grafana externo</td><td>Panel de métricas de Prometheus integrado</td></tr>
<tr><td>Depuración de la API</td><td>Herramientas externas como curl o Postman</td><td>Entorno de pruebas de la API REST integrado</td></tr>
<tr><td>Copia de seguridad y restauración</td><td>Solo CLI</td><td>Interfaz gráfica de usuario con compatibilidad con S3, MinIO, GCS y Azure</td></tr>
<tr><td>Integración con LLM</td><td>Ninguna</td><td>BYOL: OpenAI, Anthropic, DeepSeek, Gemini y más</td></tr>
</tbody>
</table>
<h2 id="Manage-Multiple-Milvus-Clusters-From-One-Sidebar" class="common-anchor-header">Gestiona varios clústeres de Milvus desde una sola barra lateral<button data-href="#Manage-Multiple-Milvus-Clusters-From-One-Sidebar" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>El mayor cambio en el día a día es la gestión de múltiples clústeres.</strong> Attu 3.0 puede conectarse a todas las instancias de Milvus que ejecutes y mostrarlas en una única barra lateral.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_2_aaf3fddf83.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Imagen: Barra lateral de Attu 3.0 que muestra varias conexiones a Milvus con indicadores de estado</p>
<p>En Attu 2.x, cambiar de un clúster de Milvus a otro implicaba desconectarse, volver a conectarse y esperar. Si tenías clústeres separados para desarrollo, entorno de prueba, producción o diferentes líneas de negocio, a menudo acababas con una pestaña del navegador por cada clúster.</p>
<p>Attu 3.0 sustituye ese flujo por una barra lateral izquierda permanente. Todas las conexiones a Milvus aparecen en un solo lugar, con un indicador de estado en tiempo real junto a cada una. Un punto verde significa que se puede acceder al clúster. Un punto rojo significa que el clúster está inactivo o no está disponible.</p>
<p>Cambiar de clúster se hace con un solo clic. Attu conserva el contexto de cada conexión, por lo que no es necesario volver a conectarse cada vez que se cambia de entorno.</p>
<h3 id="Connection-Setup-Is-Less-Fragile" class="common-anchor-header">La configuración de las conexiones es menos frágil</h3><p>Las nuevas conexiones admiten cifrado TLS/SSL, autenticación mediante token y autenticación con nombre de usuario y contraseña. Puedes probar una conexión antes de guardarla, conservar los detalles de la conexión localmente y borrar de forma masiva las conexiones inactivas cuando los entornos antiguos ya no sean necesarios.</p>
<p><strong>Cada clúster dispone de su propio espacio de trabajo.</strong> La vista general, el explorador de datos, la gestión de usuarios, las métricas y las operaciones se limitan al clúster seleccionado actualmente. Esto hace que sea mucho más difícil confundir el entorno de prueba con el de producción o ejecutar una operación en el lugar equivocado.</p>
<p>Para cualquiera que gestione más de una instancia de Milvus, este es uno de los cambios más importantes de Attu 3.0. Puede parecer algo básico, pero elimina gran parte de los cambios de pestaña y las dificultades para volver a conectarse del trabajo diario con Milvus.</p>
<h2 id="Local-State-Now-Survives-Restarts" class="common-anchor-header">El estado local ahora se conserva tras los reinicios<button data-href="#Local-State-Now-Survives-Restarts" class="anchor-icon" translate="no">
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
    </button></h2><p>Attu 2.x carecía de estado. Si el contenedor se reiniciaba, la información de conexión guardada desaparecía y había que volver a configurar el espacio de trabajo.</p>
<p><strong>Attu 3.0 incorpora una base de datos local que conserva las configuraciones del clúster, el historial de conversaciones del agente, las habilidades personalizadas, la configuración del LLM y las preferencias del usuario.</strong></p>
<p>Al ejecutar Attu con Docker, monta un volumen para conservar ese estado:</p>
<pre><code translate="no" class="language-bash">docker run -d --name attu -p 3000:3000 -v attu-data:/data zilliz/attu:v3.0.0-beta.6
<button class="copy-code-btn"></button></code></pre>
<p>Con el volumen montado, reiniciar el contenedor ya no significa empezar desde cero.</p>
<p>Esto también es importante para el nuevo agente de IA. El historial de conversaciones, las habilidades personalizadas y la configuración del LLM pueden conservarse localmente, por lo que Attu se convierte en una consola que puedes seguir utilizando a lo largo del tiempo, en lugar de una interfaz de usuario temporal que se reinicia tras cada reinicio.</p>
<h2 id="Use-the-Built-in-AI-Agent-to-Operate-Milvus-in-Natural-Language" class="common-anchor-header">Utiliza el agente de IA integrado para manejar Milvus en lenguaje natural<button data-href="#Use-the-Built-in-AI-Agent-to-Operate-Milvus-in-Natural-Language" class="anchor-icon" translate="no">
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
    </button></h2><p>Attu 3.0 incluye un agente de IA integrado para la gestión de Milvus. No se trata de un chatbot de documentación. <strong>El agente está conectado a más de 50 herramientas de Milvus, por lo que puede inspeccionar el estado del clúster y ejecutar operaciones reales a través de Attu.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_3_92689d4337.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Imagen: El agente de IA de Attu 3.0 puede invocar herramientas de Milvus a partir de solicitudes en lenguaje natural</p>
<h3 id="50+-Built-in-Tools-Across-Common-Milvus-Workflows" class="common-anchor-header">Más de 50 herramientas integradas para los flujos de trabajo habituales de Milvus</h3><p>El agente se encarga de las operaciones diarias, los diagnósticos, los permisos y la gestión del clúster. Puedes formular preguntas o dar instrucciones como, por ejemplo:</p>
<table>
<thead>
<tr><th>Escenario</th><th>Ejemplos de comandos</th></tr>
</thead>
<tbody>
<tr><td>Operaciones cotidianas</td><td>«Muestra todas mis colecciones».<br>«Crea una colección con los campos id, título e incrustación. Utiliza la dimensión 768 para el campo de incrustación».<br>«Inserta algunos datos de prueba en my_collection».<br>«Busca en my_collection los 10 registros más similares a “inteligencia artificial”».</td></tr>
<tr><td>Operaciones y diagnóstico</td><td>«¿Mi clúster funciona correctamente?»<br>«¿Por qué es tan lenta la búsqueda?»<br>«¿Qué colecciones consumen más memoria?»<br>«¿Ha habido alguna consulta lenta recientemente?»</td></tr>
<tr><td>Permisos</td><td>«Crea un usuario de solo lectura llamado analyst».<br>«Otorga todos los privilegios al rol de administrador».<br>«Comprueba qué privilegios tiene el usuario zhangsan».</td></tr>
<tr><td>Gestión del clúster</td><td>«Mostrar la versión y la configuración actuales de Milvus».<br>«Mostrar el uso de los grupos de recursos».<br>«Compacta my_collection por mí».</td></tr>
</tbody>
</table>
<h3 id="Destructive-Actions-Require-Approval" class="common-anchor-header">Las acciones destructivas requieren aprobación</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_4_130d227620.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Imagen: Las operaciones destructivas o delicadas muestran un cuadro de diálogo de confirmación antes de su ejecución</p>
<p><strong>El agente está diseñado para ser transparente y controlable.</strong> Las operaciones no destructivas, como listar colecciones o leer métricas, devuelven los resultados directamente.</p>
<p>Las operaciones destructivas o delicadas, como eliminar una colección, borrar datos o modificar privilegios, activan un cuadro de diálogo de confirmación. El cuadro de diálogo muestra los parámetros exactos y espera la aprobación antes de ejecutar la operación.</p>
<p>También puedes ver qué herramientas ha invocado el agente, cuántos tokens ha utilizado y si alguna llamada a una herramienta ha fallado. Esto es importante para un agente de gestión de bases de datos. Los usuarios deben poder comprender lo que ha hecho el agente, no solo ver el resultado final.</p>
<h2 id="Run-Expert-Diagnostic-Skills-From-the-Console" class="common-anchor-header">Ejecutar habilidades de diagnóstico avanzadas desde la consola<button data-href="#Run-Expert-Diagnostic-Skills-From-the-Console" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>El agente de IA incluye cuatro habilidades de diagnóstico integradas.</strong> Se trata de flujos de trabajo guiados para situaciones habituales de resolución de problemas en Milvus, no de indicaciones genéricas.</p>
<table>
<thead>
<tr><th>Habilidad de diagnóstico</th><th>Qué comprueba</th></tr>
</thead>
<tbody>
<tr><td>Diagnóstico del estado del clúster</td><td>Versión, estado de los nodos, estado de cada componente y métricas clave.</td></tr>
<tr><td>Diagnóstico del rendimiento de búsqueda</td><td>Integridad de los índices, fragmentación de segmentos, equilibrio de réplicas y señales relacionadas con el rendimiento de las búsquedas.</td></tr>
<tr><td>Diagnóstico de la escritura de datos</td><td>Inserciones lentas, comprobaciones de datos perdidos, anomalías en el vaciado y síntomas en la ruta de escritura.</td></tr>
<tr><td>Auditoría de configuración</td><td>Ajustes arriesgados o incorrectos que pueden afectar a la estabilidad, el rendimiento o el comportamiento esperado.</td></tr>
</tbody>
</table>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_5_306b8464cb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Imagen: Attu 3.0 incluye habilidades de diagnóstico integradas y admite habilidades personalizadas</p>
<p>También puedes crear habilidades personalizadas en lenguaje natural. Una habilidad puede codificar una lista de comprobación previa al lanzamiento, una comprobación de la calidad de los datos para una recopilación específica o un flujo de diagnóstico que tu equipo ejecute para una carga de trabajo conocida.</p>
<p>Una habilidad personalizada es, en esencia, conocimiento del dominio más un procedimiento. Una vez guardada, el agente puede reutilizarla en lugar de depender cada vez de una indicación puntual.</p>
<h2 id="Bring-Your-Own-LLM-Provider" class="common-anchor-header">Trae tu propio proveedor de LLM<button data-href="#Bring-Your-Own-LLM-Provider" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Attu no incluye ni actúa como proxy de ningún servicio de LLM.</strong> Tú configuras tu propio proveedor y mantienes el control sobre la ruta del modelo.</p>
<p>Entre los proveedores compatibles se incluyen OpenAI, Anthropic, DeepSeek, Google Gemini, OpenRouter y puntos finales personalizados compatibles con OpenAI.</p>
<table>
<thead>
<tr><th>Proveedor</th><th>Modelos de ejemplo</th></tr>
</thead>
<tbody>
<tr><td>OpenAI</td><td>GPT-5.5</td></tr>
<tr><td>Anthropic</td><td>Claude Opus 4.8</td></tr>
<tr><td>DeepSeek</td><td>DeepSeek-V4</td></tr>
<tr><td>Google Gemini</td><td>Gemini 3.5</td></tr>
<tr><td>OpenRouter</td><td>Cualquier modelo enrutado</td></tr>
<tr><td>Punto final personalizado</td><td>Cualquier API compatible con OpenAI</td></tr>
</tbody>
</table>
<p>Tu clave de API se cifra localmente y no se sube a ningún servicio gestionado por Attu. Este diseño es importante para los equipos que desean contar con asistencia de IA, pero que siguen necesitando controlar las credenciales, el flujo de datos y la elección del proveedor.</p>
<p>En la práctica, BYOL permite utilizar el agente en diferentes entornos. Un equipo puede utilizar OpenAI. Otro puede utilizar un modelo de Anthropic. Un tercero puede enrutar a través de un punto final compatible con OpenAI. Attu no impone un único proveedor de modelos.</p>
<h2 id="Browse-Milvus-Data-With-a-Database-→-Collection-→-Partition-Tree" class="common-anchor-header">Explora los datos de Milvus con un árbol de «Base de datos → Colección → Partición»<button data-href="#Browse-Milvus-Data-With-a-Database-→-Collection-→-Partition-Tree" class="anchor-icon" translate="no">
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
    </button></h2><p>Attu 3.0 también rediseña el explorador de datos. Attu 2.x presentaba principalmente una lista plana de colecciones. Esto resulta difícil de usar cuando un clúster tiene varias bases de datos, docenas de colecciones y datos particionados.</p>
<p><strong>El nuevo explorador utiliza una jerarquía que se ajusta a la forma en que Milvus organiza los datos: base de datos → colección → partición.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_7_3fe672c16d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Imagen: El explorador de datos rediseñado utiliza una navegación jerárquica para bases de datos, colecciones y particiones</p>
<h3 id="Data-Operations-Are-Closer-to-Where-You-Browse" class="common-anchor-header">Las operaciones con datos están más cerca de donde se navega</h3><p>El explorador de datos mantiene las operaciones que los usuarios ya esperan y añade más acciones directamente en la interfaz de usuario:</p>
<ul>
<li>Arrastrar y soltar una colección en otra base de datos.</li>
<li>Realizar una búsqueda vectorial escribiendo texto directamente, siempre que se haya configurado un modelo de incrustación.</li>
<li>Examinar las puntuaciones de similitud y filtrar los resultados con facetas.</li>
<li>Importar y exportar datos en formatos CSV, JSON y Parquet.</li>
<li>Visualizar y editar el esquema de una colección de forma visual, incluyendo compatibilidad con campos dinámicos.</li>
<li>Crear, eliminar y examinar particiones y estadísticas de particiones.</li>
<li>Gestiona todo el ciclo de vida de la colección: crear, cargar, publicar, copiar, renombrar, mover entre bases de datos y eliminar.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_8_952fd26c44.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Imagen: Navegador de datos de Attu 3.0 con búsqueda vectorial y revisión de resultados</p>
<p>La mayoría de estas acciones están disponibles a través de menús contextuales o paneles de operaciones. Para las tareas habituales con colecciones, ya no es necesario alternar entre la navegación por la interfaz de usuario y las operaciones de línea de comandos.</p>
<p>Attu 3.0 es también la línea de productos en la que seguirá incorporándose el soporte de la interfaz de usuario para las nuevas capacidades <a href="https://milvus.io/docs/release_notes.md">de Milvus 3.0</a>, como las instantáneas y los vectores nulos, a medida que dichas características maduren.</p>
<h2 id="Check-Operations-Metrics-Slow-Queries-Topology-and-Backups-in-One-Place" class="common-anchor-header">Consulta operaciones, métricas, consultas lentas, topología y copias de seguridad en un solo lugar<button data-href="#Check-Operations-Metrics-Slow-Queries-Topology-and-Backups-in-One-Place" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Attu 3.0 incorpora más información operativa a la consola.</strong> El área de Operaciones y Supervisión incluye una visión general del clúster, métricas en tiempo real, análisis de consultas lentas, topología, así como copias de seguridad y restauración.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_9_4085e60553.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Imagen: Página de operaciones y monitorización de Attu 3.0</p>
<p>El objetivo no es sustituir todos los sistemas de observabilidad que ya utiliza un equipo de producción. Los equipos pueden seguir utilizando Prometheus, Grafana, los registros, las alertas y su pila de monitorización existente. El objetivo es que las preguntas habituales sobre Milvus puedan responderse desde dentro de Attu.</p>
<table>
<thead>
<tr><th>Área</th><th>Qué puedes hacer</th></tr>
</thead>
<tbody>
<tr><td>Resumen visual del clúster</td><td>Ver de un vistazo la versión de Milvus, el modo de implementación, el número de nodos, el número de bases de datos, el número de colecciones, el estado de carga y las entidades de cuota.</td></tr>
<tr><td>Métricas en tiempo real</td><td>Analiza el QPS, las tasas de inserción/eliminación, la latencia de las consultas, la tasa de aciertos en la caché y otras métricas relacionadas respaldadas por Prometheus.</td></tr>
<tr><td>Análisis de consultas lentas</td><td>Analice las consultas lentas por tipo, duración, colección, marca de tiempo, origen y contexto de resolución de problemas relacionado.</td></tr>
<tr><td>Vista de la topología</td><td>Comprenda la topología de los nodos y las conexiones entre componentes como RootCoord, DataCoord, IndexCoord, QueryCoord y Proxy.</td></tr>
<tr><td>Copia de seguridad y restauración</td><td>Crea copias de seguridad completas o incrementales en S3, MinIO, GCS o Azure, y descarga los metadatos de la copia de seguridad en formato ZIP o sube uno para restaurar.</td></tr>
</tbody>
</table>
<p>Las copias de seguridad y la restauración son especialmente importantes porque trasladan a la interfaz gráfica de usuario (GUI) un flujo de trabajo que antes dependía del uso de la interfaz de línea de comandos (CLI). Esto resulta útil para las pruebas locales, la validación en entornos de prueba y para los equipos que desean una ruta de recuperación más visible.</p>
<h2 id="Debug-Milvus-REST-APIs-With-the-Built-in-API-Playground" class="common-anchor-header">Depuración de las API REST de Milvus con el entorno de pruebas de API integrado<button data-href="#Debug-Milvus-REST-APIs-With-the-Built-in-API-Playground" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Attu 3.0 incorpora un entorno de pruebas de API REST para el desarrollo y la depuración de la API de Milvus.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_10_7630afab16.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Imagen: Entorno de pruebas de la API de Attu 3.0</p>
<p>El entorno de pruebas cataloga los puntos finales REST de Milvus por categorías. Selecciona una base de datos y una colección, y Attu rellena automáticamente el contexto de ejecución. Desde allí, puedes enviar una solicitud con un solo clic e inspeccionar la respuesta en tiempo real.</p>
<p>Esto resulta útil cuando se desea probar una llamada a la API sin tener que configurar comandos curl ni una colección de Postman. También es útil para comprender cómo se corresponde una función de Milvus con la API REST, ya que permite pasar directamente del contexto de la interfaz de usuario al cuerpo de la solicitud.</p>
<p>Para los desarrolladores de aplicaciones, el API Playground es un entorno de depuración. Para los nuevos usuarios de Milvus, es un entorno de aprendizaje. Para los equipos de la plataforma, es una forma rápida de validar operaciones antes de convertirlas en scripts o código de aplicación.</p>
<h2 id="Manage-RBAC-Beside-the-Database-or-Collection" class="common-anchor-header">Gestionar el RBAC junto a la base de datos o la colección<button data-href="#Manage-RBAC-Beside-the-Database-or-Collection" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Attu 3.0 cambia la forma en que se perciben los flujos de trabajo de permisos en la interfaz de usuario.</strong> En lugar de tratar <a href="https://milvus.io/docs/rbac.md">el RBAC</a> como una tarea administrativa independiente, acerca el control de acceso a las pestañas de la base de datos y las colecciones, donde los usuarios ya están trabajando.</p>
<p>El modelo subyacente sigue siendo el RBAC de Milvus: usuarios, roles, <a href="https://milvus.io/docs/grant_privileges.md">privilegios</a>, concesiones y revocaciones. Attu 3.0 simplifica el proceso operativo en torno a ese modelo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_11_8b431e168c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Imagen: Gestión contextual de usuarios y permisos en Attu 3.0</p>
<h3 id="One-Click-User-Creation-for-Common-Scopes" class="common-anchor-header">Creación de usuarios con un solo clic para ámbitos comunes</h3><p>En Attu 2.x, conceder acceso de solo lectura a una colección solía implicar varios pasos: crear el usuario, crear un rol, configurar los privilegios, asignar el rol al usuario y asegurarse de que el ámbito fuera el correcto.</p>
<p><strong>En Attu 3.0, puedes abrir una colección, ir a la pestaña «Usuarios», hacer clic en «Crear usuario», elegir «Solo lectura» o «Lectura y escritura», y dejar que Attu complete el flujo de trabajo.</strong> El sistema crea el usuario, genera una contraseña segura, crea el rol con el ámbito correspondiente y aplica la concesión.</p>
<p>El mismo patrón funciona a nivel de base de datos. También puedes autorizar a un usuario existente para que acceda a la colección actual o revocar el acceso con un solo clic.</p>
<p>Esto mantiene la gestión de permisos cerca del recurso que se está protegiendo. No es necesario navegar por varias páginas de administración ni recordar una convención de nomenclatura de roles solo para conceder a un compañero de equipo un acceso con ámbito específico.</p>
<h2 id="What-This-Beta-Means-for-Attu-Users" class="common-anchor-header">Qué significa esta versión beta para los usuarios de Attu<button data-href="#What-This-Beta-Means-for-Attu-Users" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>La versión beta de Attu 3.0 es la mayor actualización de la consola de gestión de Milvus desde el lanzamiento inicial de Attu.</strong> No se trata solo de una renovación visual, sino que cambia el alcance de lo que Attu puede gestionar.</p>
<p>La principal mejora es que Attu ahora se adapta a la forma en que muchos usuarios de Milvus trabajan realmente: múltiples clústeres, configuraciones locales persistentes, más movimiento de datos, más control de acceso, más resolución de problemas y una mayor necesidad de comprender el comportamiento de los clústeres sin tener que cambiar de herramienta.</p>
<p>Los aspectos más destacados son:</p>
<ul>
<li>Gestión de múltiples clústeres con indicadores de estado y cambio con un solo clic.</li>
<li>Estado local persistente para configuraciones de clústeres, preferencias, configuración de LLM, historial de agentes y habilidades personalizadas.</li>
<li>Un agente de IA integrado con más de 50 herramientas de Milvus y puertas de confirmación para acciones destructivas.</li>
<li>Cuatro habilidades de diagnóstico especializadas integradas para el estado del clúster, el rendimiento de la búsqueda, las escrituras de datos y la revisión de la configuración.</li>
<li>Un explorador de datos rediseñado con navegación de base de datos → colección → partición y operaciones de colección más completas.</li>
<li>Métricas de Prometheus integradas, análisis de consultas lentas, topología y copias de seguridad y restauración.</li>
<li>Un entorno de pruebas de la API REST para depurar y aprender las API de Milvus.</li>
<li>Flujos de trabajo RBAC que se ejecutan junto a la base de datos o la colección, no solo en un flujo de administración independiente.</li>
</ul>
<p>Si utilizas Attu únicamente para el desarrollo local de Milvus, la versión 3.0 te ofrece una consola más completa. Si gestionas varios entornos de Milvus, solo por los cambios en el soporte multiclúster y el estado persistente ya merece la pena probarla. Si sueles depurar problemas de rendimiento o de permisos, el agente, los diagnósticos, las métricas y los flujos de trabajo RBAC en contexto deberían ahorrarte tiempo de inmediato.</p>
<h2 id="Get-Started" class="common-anchor-header">Empieza ya<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p>Prueba Attu 3.0 Beta con Docker:</p>
<pre><code translate="no" class="language-bash">docker run -d --name attu -p 3000:3000 -v attu-data:/data zilliz/attu:v3.0.0-beta.6
<button class="copy-code-btn"></button></code></pre>
<p>A continuación, abre:</p>
<pre><code translate="no"><span class="hljs-attr">http</span>:<span class="hljs-comment">//localhost:3000</span>
<button class="copy-code-btn"></button></code></pre>
<p>Añade tu conexión a Milvus desde la barra lateral y empieza a explorar la nueva consola.</p>
<p>¿Prefieres una aplicación de escritorio? Descarga la versión para tu plataforma desde <a href="https://github.com/zilliztech/attu/releases"><strong>GitHub Releases</strong></a>. Attu 3.0 Beta ofrece paquetes de escritorio para macOS, Linux y Windows. Las versiones recientes también incluyen un paquete de servidor independiente para Linux que permite ejecutar Attu sin necesidad de Docker ni Electron.</p>
<p><strong>¿Tienes alguna pregunta?</strong> Comparte tu configuración de múltiples clústeres, tus habilidades con agentes personalizados o tu caso de diagnóstico en el <a href="https://discord.gg/milvus"><strong>Discord de Milvus</strong></a>, o reserva una <a href="https://meetings.hubspot.com/chloe-williams1/milvus-meeting?uuid=8d218acf-a841-4869-8330-91daff5e8a02"><strong>sesión</strong></a> de <a href="https://meetings.hubspot.com/chloe-williams1/milvus-meeting?uuid=8d218acf-a841-4869-8330-91daff5e8a02"><strong>«Milvus Office Hours»</strong></a> para resolverlo junto con la comunidad.</p>
<p><strong>¿No quieres gestionar tú mismo la infraestructura de Milvus?</strong> <a href="https://cloud.zilliz.com/signup"><strong>Zilliz Cloud</strong></a> es la plataforma totalmente gestionada de los creadores de Milvus. Mantiene la API de Milvus y añade una infraestructura gestionada para la búsqueda vectorial en tiempo real, el descubrimiento a gran escala y las operaciones de datos con IA. Para los equipos con requisitos de soberanía de datos, Zilliz Cloud <strong>BYOC</strong> se ejecuta dentro de tu propia cuenta en la nube, de modo que los datos permanecen en tu VPC mientras Zilliz se encarga de las operaciones.</p>
