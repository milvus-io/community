---
id: deep-dive-6-oss-qa.md
title: >-
  Aseguramiento de la calidad del software de código abierto (OSS): estudio de
  caso de Milvus
author: Wenxing Zhu
date: 2022-04-25T00:00:00.000Z
desc: >-
  La garantía de calidad es un proceso que consiste en determinar si un producto
  o servicio cumple determinados requisitos.
cover: assets.zilliz.com/Deep_Dive_6_c2cd44801d.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-6-oss-qa.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deep_Dive_6_c2cd44801d.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Imagen de portada</span> </span></p>
<blockquote>
<p>Este artículo ha sido escrito por <a href="https://github.com/zhuwenxing">Wenxing Zhu</a> y transcrito por <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>La garantía de calidad (GC) es un proceso sistemático para determinar si un producto o servicio cumple ciertos requisitos. Un sistema de GC es una parte indispensable del proceso de I+D porque, como su nombre indica, garantiza la calidad del producto.</p>
<p>Este post presenta el marco de control de calidad adoptado en el desarrollo de la base de datos vectorial Milvus, con el objetivo de proporcionar una guía para que los desarrolladores y usuarios contribuyan a participar en el proceso. También cubrirá los principales módulos de prueba en Milvus, así como los métodos y herramientas que se pueden aprovechar para mejorar la eficiencia de las pruebas de control de calidad.</p>
<p><strong>Ir a:</strong></p>
<ul>
<li><a href="#A-general-introduction-to-the-Milvus-QA-system">Introducción general al sistema de control de calidad Milvus</a></li>
<li><a href="#Test-modules-in-Milvus">Módulos de prueba en Milvus</a></li>
<li><a href="#Tools-and-methods-for-better-QA-efficiency">Herramientas y métodos para mejorar la eficacia del control de calidad</a></li>
</ul>
<h2 id="A-general-introduction-to-the-Milvus-QA-system" class="common-anchor-header">Introducción general al sistema Milvus QA<button data-href="#A-general-introduction-to-the-Milvus-QA-system" class="anchor-icon" translate="no">
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
    </button></h2><p>La <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">arquitectura del sistema</a> es fundamental para realizar pruebas de garantía de calidad. Cuanto más familiarizado esté un ingeniero de control de calidad con el sistema, más probabilidades tendrá de elaborar un plan de pruebas razonable y eficaz.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_architecture_feaccc489d.png" alt="Milvus architecture" class="doc-image" id="milvus-architecture" />
   </span> <span class="img-wrapper"> <span>Arquitectura de Milvus</span> </span></p>
<p>Milvus 2.0 adopta una <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#A-cloud-native-first-approach">arquitectura nativa en la nube, distribuida y en capas</a>, siendo el SDK la <a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">entrada principal para que los datos</a> fluyan en Milvus. Los usuarios de Milvus utilizan el SDK con mucha frecuencia, por lo que las pruebas funcionales en el lado del SDK son muy necesarias. Además, las pruebas funcionales del SDK pueden ayudar a detectar los problemas internos que puedan existir en el sistema Milvus. Aparte de las pruebas funcionales, también se llevarán a cabo otros tipos de pruebas en la base de datos vectorial, incluidas pruebas unitarias, pruebas de despliegue, pruebas de fiabilidad, pruebas de estabilidad y pruebas de rendimiento.</p>
<p>Una arquitectura distribuida y nativa de la nube aporta tanto comodidad como desafíos a las pruebas de control de calidad. A diferencia de los sistemas que se despliegan y ejecutan localmente, una instancia de Milvus desplegada y ejecutada en un clúster Kubernetes puede garantizar que las pruebas de software se lleven a cabo en las mismas circunstancias que el desarrollo de software. Sin embargo, el inconveniente es que la complejidad de la arquitectura distribuida conlleva más incertidumbres que pueden hacer que las pruebas de control de calidad del sistema sean aún más difíciles y extenuantes. Por ejemplo, Milvus 2.0 utiliza microservicios de diferentes componentes, lo que conlleva un mayor número de <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#A-bare-bones-skeleton-of-the-Milvus-architecture">servicios y nodos</a>, y una mayor posibilidad de que se produzca un error en el sistema. En consecuencia, se necesita un plan de control de calidad más sofisticado y exhaustivo para mejorar la eficacia de las pruebas.</p>
<h3 id="QA-testings-and-issue-management" class="common-anchor-header">Pruebas de control de calidad y gestión de problemas</h3><p>La garantía de calidad en Milvus implica tanto la realización de pruebas como la gestión de los problemas que surgen durante el desarrollo del software.</p>
<h4 id="QA-testings" class="common-anchor-header">Pruebas de control de calidad</h4><p>Milvus lleva a cabo diferentes tipos de pruebas de control de calidad según las características de Milvus y las necesidades de los usuarios en orden de prioridad, como se muestra en la siguiente imagen.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_14_2aff081d41.png" alt="QA testing priority" class="doc-image" id="qa-testing-priority" />
   </span> <span class="img-wrapper"> <span>Prioridad de las pruebas de control de calidad</span> </span></p>
<p>En Milvus, las pruebas de control de calidad se llevan a cabo sobre los siguientes aspectos en el siguiente orden de prioridad:</p>
<ol>
<li><strong>Funciones</strong>: Verificar si las funciones y características funcionan como se diseñaron originalmente.</li>
<li><strong>Despliegue</strong>: Comprobar si un usuario puede desplegar, reinstalar y actualizar tanto la versión independiente de Mivus como el clúster de Milvus con diferentes métodos (Docker Compose, Helm, APT o YUM, etc.).</li>
<li><strong>Rendimiento</strong>:  Pruebe el rendimiento de la inserción, indexación, búsqueda vectorial y consulta de datos en Milvus.</li>
<li><strong>Estabilidad</strong>: Compruebe si Milvus puede funcionar de forma estable durante 5-10 días con un nivel normal de carga de trabajo.</li>
<li><strong>Fiabilidad</strong>: Compruebe si Milvus puede seguir funcionando parcialmente en caso de que se produzca algún error en el sistema.</li>
<li><strong>Configuración</strong>: Verificar si Milvus funciona como se espera bajo cierta configuración.</li>
<li><strong>Compatibilidad</strong>: Compruebe si Milvus es compatible con diferentes tipos de hardware o software.</li>
</ol>
<h4 id="Issue-management" class="common-anchor-header">Gestión de problemas</h4><p>Durante el desarrollo de software pueden surgir muchos problemas. Los autores de los problemas pueden ser los propios ingenieros de control de calidad o usuarios de Milvus de la comunidad de código abierto. El equipo de control de calidad es responsable de resolver las incidencias.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Issue_management_workflow_12c726efa1.png" alt="Issue management workflow" class="doc-image" id="issue-management-workflow" />
   </span> <span class="img-wrapper"> <span>Flujo de trabajo de la gestión de incidencias</span> </span></p>
<p>Cuando se crea una <a href="https://github.com/milvus-io/milvus/issues">incidencia</a>, primero se somete a un triaje. Durante el triaje, se examinarán las nuevas incidencias para garantizar que se proporcionan detalles suficientes sobre las mismas. Si se confirma la incidencia, los desarrolladores la aceptarán e intentarán solucionarla. Una vez finalizado el desarrollo, el autor de la incidencia debe comprobar si se ha solucionado. En caso afirmativo, la incidencia se cerrará.</p>
<h3 id="When-is-QA-needed" class="common-anchor-header">¿Cuándo es necesaria la GC?</h3><p>Un error común es creer que la garantía de calidad y el desarrollo son independientes entre sí. Sin embargo, la verdad es que para garantizar la calidad del sistema se necesitan los esfuerzos tanto de los desarrolladores como de los ingenieros de control de calidad. Por lo tanto, el control de calidad debe participar en todo el ciclo de vida.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/QA_lifecycle_375f4fd8a8.png" alt="QA lifecycle" class="doc-image" id="qa-lifecycle" />
   </span> <span class="img-wrapper"> <span>Ciclo de vida de la GC</span> </span></p>
<p>Como se muestra en la figura anterior, un ciclo de vida completo de I+D de software incluye tres etapas.</p>
<p>Durante la fase inicial, los desarrolladores publican la documentación del diseño, mientras que los ingenieros de control de calidad elaboran planes de pruebas, definen criterios de lanzamiento y asignan tareas de control de calidad. Los desarrolladores y los ingenieros de control de calidad deben estar familiarizados tanto con la documentación de diseño como con el plan de pruebas para que ambos equipos compartan una comprensión mutua del objetivo de la versión (en términos de características, rendimiento, estabilidad, convergencia de errores, etc.).</p>
<p>Durante la fase de I+D, las pruebas de desarrollo y control de calidad interactúan con frecuencia para desarrollar y verificar características y funciones, así como para corregir errores y problemas notificados por la <a href="https://slack.milvus.io/">comunidad de</a> código abierto.</p>
<p>Durante la etapa final, si se cumplen los criterios de lanzamiento, se publicará una nueva imagen Docker de la nueva versión de Milvus. Para el lanzamiento oficial se necesita una nota de lanzamiento centrada en las nuevas características y los errores corregidos, así como una etiqueta de lanzamiento. A continuación, el equipo de control de calidad también publicará un informe de pruebas sobre esta versión.</p>
<h2 id="Test-modules-in-Milvus" class="common-anchor-header">Módulos de prueba en Milvus<button data-href="#Test-modules-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Hay varios módulos de prueba en Milvus y esta sección explicará cada módulo en detalle.</p>
<h3 id="Unit-test" class="common-anchor-header">Prueba unitaria</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Unit_test_7d3d422345.png" alt="Unit test" class="doc-image" id="unit-test" />
   </span> <span class="img-wrapper"> <span>Pruebas unitarias</span> </span></p>
<p>Las pruebas unitarias pueden ayudar a identificar errores de software en una fase temprana y proporcionar un criterio de verificación para la reestructuración del código. De acuerdo con los criterios de aceptación de Milvus pull request (PR), la <a href="https://app.codecov.io/gh/milvus-io/milvus/">cobertura</a> de la prueba unitaria del código debe ser del 80%.</p>
<h3 id="Function-test" class="common-anchor-header">Pruebas funcionales</h3><p>Las pruebas de función en Milvus se organizan principalmente en torno a <a href="https://github.com/milvus-io/pymilvus">PyMilvus</a> y SDKs. El propósito principal de las pruebas de función es verificar si las interfaces pueden trabajar como fueron diseñadas. Las pruebas de función tienen dos facetas:</p>
<ul>
<li>Probar si los SDKs pueden devolver los resultados esperados cuando se pasan los parámetros correctos.</li>
<li>Probar si los SDK pueden gestionar errores y devolver mensajes de error razonables cuando se pasan parámetros incorrectos.</li>
</ul>
<p>La siguiente figura muestra el marco actual para las pruebas de funciones, que se basa en el marco general <a href="https://pytest.org/">pytest</a>. Este marco añade una envoltura a PyMilvus y potencia las pruebas con una interfaz de pruebas automatizada.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Function_test_41f837d3e7.png" alt="Function test" class="doc-image" id="function-test" />
   </span> <span class="img-wrapper"> <span>Prueba de funciones</span> </span></p>
<p>Teniendo en cuenta que se necesita un método de pruebas compartido y que algunas funciones deben reutilizarse, se adopta el marco de pruebas anterior, en lugar de utilizar directamente la interfaz de PyMilvus. También se incluye en el marco un módulo "check" para facilitar la comprobación de los valores esperados y reales.</p>
<p>En el directorio <code translate="no">tests/python_client/testcases</code> se incorporan hasta 2.700 casos de pruebas de funciones, que cubren por completo casi todas las interfaces de PyMilvus. Estas pruebas de funciones supervisan estrictamente la calidad de cada RP.</p>
<h3 id="Deployment-test" class="common-anchor-header">Prueba de despliegue</h3><p>Milvus viene en dos modos: <a href="https://milvus.io/docs/v2.0.x/install_standalone-docker.md">standalone</a> y <a href="https://milvus.io/docs/v2.0.x/install_cluster-docker.md">cluster</a>. Y hay dos formas principales de desplegar Milvus: usando Docker Compose o Helm. Y después de desplegar Milvus, los usuarios también pueden reiniciar o actualizar el servicio Milvus. Hay dos categorías principales de prueba de despliegue: prueba de reinicio y prueba de actualización.</p>
<p>La prueba de reinicio se refiere al proceso de probar la persistencia de los datos, es decir, si los datos siguen estando disponibles después de un reinicio. La prueba de actualización se refiere al proceso de comprobar la compatibilidad de los datos para evitar situaciones en las que se introduzcan en Milvus formatos de datos incompatibles. Ambos tipos de pruebas de despliegue comparten el mismo flujo de trabajo, como se ilustra en la imagen siguiente.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deployment_test_342ab3b3f5.png" alt="Deployment test" class="doc-image" id="deployment-test" />
   </span> <span class="img-wrapper"> <span>Prueba de despliegue</span> </span></p>
<p>En una prueba de reinicio, los dos despliegues utilizan la misma imagen docker. Sin embargo, en una prueba de actualización, el primer despliegue utiliza una imagen Docker de una versión anterior, mientras que el segundo despliegue utiliza una imagen Docker de una versión posterior. Los resultados de la prueba y los datos se guardan en el archivo <code translate="no">Volumes</code> o en la <a href="https://kubernetes.io/docs/concepts/storage/persistent-volumes/">reclamación de volumen persistente</a> (PVC).</p>
<p>Al ejecutar la primera prueba, se crean varias colecciones y se realizan diferentes operaciones en cada una de ellas. Al ejecutar la segunda prueba, el objetivo principal será comprobar si las colecciones creadas siguen estando disponibles para operaciones CRUD y si se pueden seguir creando nuevas colecciones.</p>
<h3 id="Reliability-test" class="common-anchor-header">Prueba de fiabilidad</h3><p>Las pruebas de fiabilidad de los sistemas distribuidos nativos de la nube suelen adoptar un método de ingeniería del caos cuyo objetivo es cortar de raíz los errores y los fallos del sistema. En otras palabras, en una prueba de ingeniería del caos, creamos a propósito fallos del sistema para identificar los problemas en las pruebas de presión y solucionar los fallos del sistema antes de que realmente empiecen a hacer daño. Durante una prueba de caos en Milvus, elegimos <a href="https://chaos-mesh.org/">Chaos Mesh</a> como herramienta para crear un caos. Hay varios tipos de fallos que es necesario crear:</p>
<ul>
<li><strong>Pod kill</strong>: una simulación del escenario en el que los nodos están caídos.</li>
<li><strong>Pod failure</strong>: Prueba si uno de los nodos trabajadores falla y si todo el sistema puede seguir funcionando.</li>
<li><strong>Memory stress</strong>: una simulación de gran consumo de recursos de memoria y CPU de los nodos de trabajo.</li>
<li><strong>Partición de red</strong>: Dado que Milvus <a href="https://milvus.io/docs/v2.0.x/four_layers.md">separa el almacenamiento de la computación</a>, el sistema depende en gran medida de la comunicación entre varios componentes. Se necesita una simulación del escenario en el que la comunicación entre los diferentes pods está particionada para probar la interdependencia de los diferentes componentes de Milvus.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Reliability_test_a7331b91f4.png" alt="Reliability test" class="doc-image" id="reliability-test" />
   </span> <span class="img-wrapper"> <span>Prueba de fiabilidad</span> </span></p>
<p>La figura anterior muestra el marco de pruebas de fiabilidad en Milvus que puede automatizar las pruebas de caos. El flujo de trabajo de una prueba de fiabilidad es el siguiente:</p>
<ol>
<li>Inicializar un cluster Milvus leyendo las configuraciones de despliegue.</li>
<li>Cuando el cluster esté listo, ejecute <code translate="no">test_e2e.py</code> para probar si las características de Milvus están disponibles.</li>
<li>Ejecute <code translate="no">hello_milvus.py</code> para probar la persistencia de los datos. Cree una colección llamada "hello_milvus" para la inserción, vaciado, creación de índices, búsqueda vectorial y consulta de datos. Esta colección no se liberará ni se eliminará durante la prueba.</li>
<li>Cree un objeto de monitorización que iniciará seis hilos que ejecutarán las operaciones de creación, inserción, vaciado, indexación, búsqueda y consulta.</li>
</ol>
<pre><code translate="no">checkers = {
    Op.create: CreateChecker(),
    Op.insert: InsertFlushChecker(),
    Op.flush: InsertFlushChecker(flush=<span class="hljs-literal">True</span>),
    Op.index: IndexChecker(),
    Op.search: SearchChecker(),
    Op.query: QueryChecker()
}
<button class="copy-code-btn"></button></code></pre>
<ol start="5">
<li>Realice la primera afirmación: todas las operaciones se realizan correctamente, como se esperaba.</li>
<li>Introduzca un fallo del sistema en Milvus utilizando Chaos Mesh para analizar el archivo yaml que define el fallo. Un fallo puede ser matar el nodo de consulta cada cinco segundos, por ejemplo.</li>
<li>Haga la segunda afirmación mientras introduce un fallo del sistema - Juzgue si los resultados devueltos de las operaciones en Milvus durante un fallo del sistema coinciden con las expectativas.</li>
<li>Elimine el fallo mediante Chaos Mesh.</li>
<li>Cuando se recupere el servicio Milvus (lo que significa que todos los pods están listos), haga la tercera afirmación - todas las operaciones tienen éxito como se esperaba.</li>
<li>Ejecute <code translate="no">test_e2e.py</code> para comprobar si las funciones de Milvus están disponibles. Algunas de las operaciones durante el caos podrían bloquearse debido a la tercera aserción. E incluso después de eliminar el caos, algunas operaciones podrían seguir bloqueadas, lo que impediría que la tercera afirmación tuviera el éxito esperado. Este paso pretende facilitar la tercera aserción y sirve como estándar para comprobar si el servicio Milvus se ha recuperado.</li>
<li>Ejecute <code translate="no">hello_milvus.py</code>, cargue la colección creada y realice operaciones CRUP en la colección. A continuación, compruebe si los datos existentes antes del fallo del sistema siguen estando disponibles tras la recuperación del fallo.</li>
<li>Recopile los registros.</li>
</ol>
<h3 id="Stability-and-performance-test" class="common-anchor-header">Prueba de estabilidad y rendimiento</h3><p>En la siguiente figura se describen los objetivos, los escenarios de prueba y las métricas de las pruebas de estabilidad y rendimiento.</p>
<table>
<thead>
<tr><th></th><th>Prueba de estabilidad</th><th>Prueba de rendimiento</th></tr>
</thead>
<tbody>
<tr><td>Propósitos</td><td>- Garantizar que Milvus puede funcionar sin problemas durante un periodo de tiempo fijo con una carga de trabajo normal. <br> - Asegurarse de que los recursos se consumen de forma estable cuando se inicia el servicio Milvus.</td><td>- Probar el rendimiento de todas las interfaces de Milvus. <br> - Encontrar la configuración óptima con la ayuda de pruebas de rendimiento.  <br> - Servir de referencia para futuras versiones. <br> - Encontrar el cuello de botella que impide un mejor rendimiento.</td></tr>
<tr><td>Escenarios</td><td>- Escenario de lectura intensiva fuera de línea en el que los datos apenas se actualizan tras su inserción y el porcentaje de procesamiento de cada tipo de solicitud es: solicitud de búsqueda 90%, solicitud de inserción 5%, otros 5%. <br> - Escenario de escritura intensiva en línea, en el que los datos se insertan y buscan simultáneamente y el porcentaje de procesamiento de cada tipo de solicitud es: solicitud de inserción 50%, solicitud de búsqueda 40%, otras 10%.</td><td>- Inserción de datos <br> - Creación de índices <br> - Búsqueda vectorial</td></tr>
<tr><td>Métricas</td><td>- Consumo de memoria <br> - Consumo de CPU <br> - Latencia IO <br> - Estado de los pods Milvus <br> - Tiempo de respuesta del servicio Milvus <br> etc.</td><td>- El rendimiento durante la inserción de datos <br> - El tiempo que se tarda en construir un índice <br> - Tiempo de respuesta durante una búsqueda vectorial <br> - Consulta por segundo (QPS) <br> - Solicitud por segundo  <br> - Tasa de recuperación <br> etc.</td></tr>
</tbody>
</table>
<p>Tanto la prueba de estabilidad como la de rendimiento comparten el mismo conjunto de flujo de trabajo:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Stability_and_performance_test_6ed8532697.png" alt="Stability and performance test" class="doc-image" id="stability-and-performance-test" />
   </span> <span class="img-wrapper"> <span>Prueba de estabilidad y rendimiento</span> </span></p>
<ol>
<li>Analizar y actualizar las configuraciones y definir las métricas. El <code translate="no">server-configmap</code> corresponde a la configuración de Milvus standalone o cluster mientras que <code translate="no">client-configmap</code> corresponde a las configuraciones de los casos de prueba.</li>
<li>Configurar el servidor y el cliente.</li>
<li>Preparación de los datos</li>
<li>Solicitar la interacción entre el servidor y el cliente.</li>
<li>Informe y visualización de métricas.</li>
</ol>
<h2 id="Tools-and-methods-for-better-QA-efficiency" class="common-anchor-header">Herramientas y métodos para mejorar la eficacia del control de calidad<button data-href="#Tools-and-methods-for-better-QA-efficiency" class="anchor-icon" translate="no">
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
    </button></h2><p>En la sección de pruebas de módulos, podemos ver que el procedimiento para la mayoría de las pruebas es de hecho casi el mismo, e implica principalmente la modificación de las configuraciones del servidor y del cliente de Milvus, y el paso de parámetros de la API. Cuando hay múltiples configuraciones, cuanto más variada es la combinación de las diferentes configuraciones, más escenarios de pruebas pueden cubrir estos experimentos y pruebas. En consecuencia, la reutilización de códigos y procedimientos es tanto más crítica para el proceso de mejora de la eficacia de las pruebas.</p>
<h3 id="SDK-test-framework" class="common-anchor-header">Marco de pruebas SDK</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/SDK_test_framework_8219e28f4c.png" alt="SDK test framework" class="doc-image" id="sdk-test-framework" />
   </span> <span class="img-wrapper"> <span>Marco de pruebas del SDK</span> </span></p>
<p>Para acelerar el proceso de pruebas, podemos añadir un envoltorio <code translate="no">API_request</code> al marco de pruebas original, y configurarlo como algo similar a la pasarela API. Esta pasarela de API se encargará de recoger todas las solicitudes de API y luego las pasará a Milvus para recibir colectivamente las respuestas. Estas respuestas se devolverán después al cliente. Tal diseño hace que la captura de cierta información de registro como parámetros y resultados devueltos sea mucho más fácil. Además, el componente de comprobación del marco de pruebas SDK puede verificar y examinar los resultados de Milvus. Y todos los métodos de comprobación pueden definirse dentro de este componente comprobador.</p>
<p>Con el marco de pruebas SDK, algunos procesos cruciales de inicialización pueden ser envueltos en una sola función. Al hacerlo, se pueden eliminar grandes trozos de códigos tediosos.</p>
<p>También cabe destacar que cada caso de prueba individual está relacionado con su colección única para garantizar el aislamiento de los datos.</p>
<p>Al ejecutar los casos de prueba,<code translate="no">pytest-xdist</code>, la extensión pytest, puede aprovecharse para ejecutar todos los casos de prueba individuales en paralelo, lo que aumenta enormemente la eficiencia.</p>
<h3 id="GitHub-action" class="common-anchor-header">Acción GitHub</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Git_Hub_action_c3c1bed591.png" alt="GitHub action" class="doc-image" id="github-action" />
    Acción </span> <span class="img-wrapper"> <span>GitHub</span> </span></p>
<p><a href="https://docs.github.com/en/actions">GitHub Action</a> también se adopta para mejorar la eficiencia de la GC por sus siguientes características:</p>
<ul>
<li>Es una herramienta nativa de CI/CD profundamente integrada con GitHub.</li>
<li>Viene con un entorno de máquina uniformemente configurado y herramientas de desarrollo de software comunes preinstaladas, incluyendo Docker, Docker Compose, etc.</li>
<li>Soporta múltiples sistemas operativos y versiones incluyendo Ubuntu, MacOs, Windows-server, etc.</li>
<li>Tiene un mercado que ofrece ricas extensiones y funciones out-of-box.</li>
<li>Su matriz soporta trabajos concurrentes, y la reutilización del mismo flujo de pruebas para mejorar la eficiencia.</li>
</ul>
<p>Aparte de las características anteriores, otra razón para adoptar GitHub action es que las pruebas de despliegue y las pruebas de fiabilidad requieren un entorno independiente y aislado. Y GitHub Action es ideal para las comprobaciones de inspección diarias en conjuntos de datos a pequeña escala.</p>
<h3 id="Tools-for-benchmark-tests" class="common-anchor-header">Herramientas para pruebas de referencia</h3><p>Para que las pruebas de control de calidad sean más eficientes, se utilizan varias herramientas.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_13_fbc71dfe4f.png" alt="QA tools" class="doc-image" id="qa-tools" />
   </span> <span class="img-wrapper"> <span>Herramientas de control de calidad</span> </span></p>
<ul>
<li><a href="https://argoproj.github.io/">Argo</a>: un conjunto de herramientas de código abierto para Kubernetes que permite ejecutar flujos de trabajo y gestionar clústeres mediante la programación de tareas. También permite ejecutar varias tareas en paralelo.</li>
<li><a href="https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/">Kubernetes dashboard</a>: interfaz de usuario de Kubernetes basada en web para visualizar <code translate="no">server-configmap</code> y <code translate="no">client-configmap</code>.</li>
<li><a href="https://en.wikipedia.org/wiki/Network-attached_storage">NAS</a>: el almacenamiento conectado a la red (NAS) es un servidor de almacenamiento de datos informáticos a nivel de archivo para guardar conjuntos de datos de referencia de RNA comunes.</li>
<li><a href="https://www.influxdata.com/">InfluxDB</a> y <a href="https://www.mongodb.com/">MongoDB</a>: bases de datos para guardar los resultados de las pruebas de referencia.</li>
<li><a href="https://grafana.com/">Grafana</a>: Una solución de análisis y monitorización de código abierto para monitorizar las métricas de recursos del servidor y las métricas de rendimiento del cliente.</li>
<li><a href="https://redash.io/">Redash</a>: Un servicio que ayuda a visualizar tus datos y crear gráficos para pruebas de benchmark.</li>
</ul>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">Acerca de la serie Deep Dive<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>Con el <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">anuncio oficial de la disponibilidad general</a> de Milvus 2.0, hemos organizado esta serie de blogs Milvus Deep Dive para ofrecer una interpretación en profundidad de la arquitectura y el código fuente de Milvus. Los temas tratados en esta serie de blogs incluyen</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Visión general de la arquitectura de Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">API y SDK de Python</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Procesamiento de datos</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Gestión de datos</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">Consultas en tiempo real</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">Motor de ejecución escalar</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">Sistema de control de calidad</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">Motor de ejecución vectorial</a></li>
</ul>
