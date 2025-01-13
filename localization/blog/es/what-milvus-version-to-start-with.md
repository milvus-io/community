---
id: what-milvus-version-to-start-with.md
title: Con qué versión de Milvus empezar
author: Chris Churilo
date: 2024-02-19T00:00:00.000Z
desc: >-
  Una guía completa de las características y capacidades de cada versión de
  Milvus para tomar una decisión informada para sus proyectos de búsqueda
  vectorial.
cover: assets.zilliz.com/which_milvus_to_start_4a4250e314.jpeg
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: true
canonicalUrl: 'https://milvus.io/blog/what-milvus-version-to-start-with.md'
---
<custom-h1>Introducción a las versiones de Milvus</custom-h1><p>La selección de la versión Milvus adecuada es fundamental para el éxito de cualquier proyecto que aproveche la tecnología de búsqueda vectorial. Con diferentes versiones de Milvus adaptadas a distintos requisitos, comprender la importancia de seleccionar la versión correcta es crucial para lograr los resultados deseados.</p>
<p>La versión correcta de Milvus puede ayudar a un desarrollador a aprender y crear prototipos rápidamente o ayudar a optimizar la utilización de recursos, agilizar los esfuerzos de desarrollo y garantizar la compatibilidad con la infraestructura y las herramientas existentes. En última instancia, se trata de mantener la productividad del desarrollador y mejorar la eficacia, la fiabilidad y la satisfacción del usuario.</p>
<h2 id="Available-Milvus-versions" class="common-anchor-header">Versiones disponibles de Milvus<button data-href="#Available-Milvus-versions" class="anchor-icon" translate="no">
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
    </button></h2><p>Hay tres versiones de Milvus disponibles para los desarrolladores, y todas son de código abierto. Las tres versiones son Milvus Lite, Milvus Standalone y Milvus Cluster, que difieren en características y en cómo los usuarios planean utilizar Milvus a corto y largo plazo. Explorémoslas individualmente.</p>
<h2 id="Milvus-Lite" class="common-anchor-header">Milvus Lite<button data-href="#Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>Como su nombre indica, Milvus Lite es una versión ligera que se integra perfectamente con Google Colab y Jupyter Notebook. Está empaquetado como un único binario sin dependencias adicionales, lo que hace que sea fácil de instalar y ejecutar en su máquina o incrustar en aplicaciones Python. Además, Milvus Lite incluye un servidor independiente Milvus basado en CLI, proporcionando flexibilidad para ejecutarlo directamente en su máquina. El hecho de incrustarlo en su código Python o utilizarlo como servidor independiente depende totalmente de sus preferencias y de los requisitos específicos de su aplicación.</p>
<h3 id="Features-and-Capabilities" class="common-anchor-header">Características y capacidades</h3><p>Milvus Lite incluye todas las características principales de búsqueda vectorial de Milvus.</p>
<ul>
<li><p><strong>Capacidades de búsqueda</strong>: Admite búsquedas top-k, de rango e híbridas, incluido el filtrado de metadatos, para satisfacer diversos requisitos de búsqueda.</p></li>
<li><p><strong>Tipos de índices y métricas de similitud</strong>: Ofrece soporte para 11 tipos de índices y cinco métricas de similitud, proporcionando flexibilidad y opciones de personalización para su caso de uso específico.</p></li>
<li><p><strong>Procesamiento de datos</strong>: Permite el procesamiento por lotes (Apache Parquet, Arrays, JSON) y en flujo, con una integración perfecta a través de conectores para Airbyte, Apache Kafka y Apache Spark.</p></li>
<li><p><strong>Operaciones CRUD</strong>: Ofrece soporte completo CRUD (crear, leer, actualizar/upsertar, eliminar), facultando a los usuarios con capacidades integrales de gestión de datos.</p></li>
</ul>
<h3 id="Applications-and-limitations" class="common-anchor-header">Aplicaciones y limitaciones</h3><p>Milvus Lite es ideal para la creación rápida de prototipos y el desarrollo local, ofreciendo soporte para la configuración rápida y la experimentación con conjuntos de datos a pequeña escala en su máquina. Sin embargo, sus limitaciones se hacen evidentes al pasar a entornos de producción con conjuntos de datos más grandes y requisitos de infraestructura más exigentes. Por ello, aunque Milvus Lite es una herramienta excelente para la exploración y las pruebas iniciales, puede no ser adecuada para desplegar aplicaciones en entornos de gran volumen o listos para la producción.</p>
<h3 id="Available-Resources" class="common-anchor-header">Recursos disponibles</h3><ul>
<li><p><a href="https://milvus.io/docs/milvus_lite.md">Documentación</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-lite/">Repositorio Github</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-lite/tree/main/examples">Ejemplo de Google Colab</a></p></li>
<li><p><a href="https://www.youtube.com/watch?v=IgJdrGiB5ZY">Vídeo de introducción</a></p></li>
</ul>
<h2 id="Milvus-Standalone" class="common-anchor-header">Milvus autónomo<button data-href="#Milvus-Standalone" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus ofrece dos modos operativos: Standalone y Cluster. Ambos modos son idénticos en cuanto a las características básicas de la base de datos vectorial y difieren en cuanto al tamaño de los datos y los requisitos de escalabilidad. Esta distinción le permite seleccionar el modo que mejor se ajuste al tamaño de su conjunto de datos, volumen de tráfico y otros requisitos de infraestructura para la producción.</p>
<p>Milvus Standalone es un modo de funcionamiento para el sistema de base de datos vectorial de Milvus en el que funciona de forma independiente como una única instancia sin ninguna agrupación o configuración distribuida. Milvus se ejecuta en un único servidor o máquina en este modo, proporcionando funcionalidades como la indexación y la búsqueda de vectores. Es adecuado para situaciones en las que la escala de volumen de datos y tráfico es relativamente pequeña y no requiere las capacidades distribuidas que proporciona una configuración en clúster.</p>
<h3 id="Features-and-Capabilities" class="common-anchor-header">Características y capacidades</h3><ul>
<li><p><strong>Alto rendimiento</strong>: Realice búsquedas vectoriales en conjuntos de datos masivos (miles de millones o más) con una velocidad y eficacia excepcionales.</p></li>
<li><p><strong>Capacidades de búsqueda</strong>: Admite búsquedas top-k, de rango e híbridas, incluido el filtrado de metadatos, para satisfacer diversos requisitos de búsqueda.</p></li>
<li><p><strong>Tipos de índices y métricas de similitud</strong>: Ofrece soporte para 11 tipos de índices y 5 métricas de similitud, proporcionando flexibilidad y opciones de personalización para su caso de uso específico.</p></li>
<li><p><strong>Procesamiento de datos</strong>: Permite el procesamiento tanto por lotes (Apache Parquet, Arrays, Json) como por flujos, con una integración perfecta a través de conectores para Airbyte, Apache Kafka y Apache Spark.</p></li>
<li><p><strong>Replicación de datos y conmutación por error</strong>: Las funciones integradas de replicación y failover/failback garantizan la integridad de los datos y la disponibilidad de la aplicación, incluso durante interrupciones o fallos.</p></li>
<li><p><strong>Escalabilidad</strong>: Consiga escalabilidad dinámica con escalado a nivel de componentes, lo que permite un escalado ascendente y descendente sin interrupciones en función de la demanda. Milvus puede autoescalar a nivel de componente, optimizando la asignación de recursos para mejorar la eficiencia.</p></li>
<li><p><strong>Arrendamiento múltiple</strong>: Soporta multi-tenancy con la capacidad de gestionar hasta 10.000 colecciones/particiones en un cluster, proporcionando una utilización eficiente de los recursos y aislamiento para diferentes usuarios o aplicaciones.</p></li>
<li><p><strong>Operaciones CRUD</strong>: Ofrece soporte completo CRUD (crear, leer, actualizar/upsertar, eliminar), facultando a los usuarios con capacidades integrales de gestión de datos.</p></li>
</ul>
<h3 id="Essential-components" class="common-anchor-header">Componentes esenciales:</h3><ul>
<li><p>Milvus: El componente funcional central.</p></li>
<li><p>etcd: El motor de metadatos responsable de acceder y almacenar metadatos de los componentes internos de Milvus, incluyendo proxies, nodos de índice y más.</p></li>
<li><p>MinIO: El motor de almacenamiento responsable de la persistencia de datos dentro de Milvus.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Screenshot_2024_02_19_at_4_16_41_PM_5e635586a7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figura 1: Arquitectura independiente de Milvus</p>
<h3 id="Available-Resources" class="common-anchor-header">Recursos disponibles</h3><ul>
<li><p>Documentación</p>
<ul>
<li><p><a href="https://milvus.io/docs/prerequisite-docker.md">Lista de comprobación del entorno para Milvus con Docker Compose</a></p></li>
<li><p><a href="https://milvus.io/docs/install_standalone-docker.md">Instalar Milvus Standalone con Docker</a></p></li>
</ul></li>
<li><p><a href="https://github.com/milvus-io/milvus">Repositorio Github</a></p></li>
</ul>
<h2 id="Milvus-Cluster" class="common-anchor-header">Milvus Cluster<button data-href="#Milvus-Cluster" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Cluster es un modo de operación para el sistema de base de datos vectorial Milvus donde opera y se distribuye a través de múltiples nodos o servidores. En este modo, las instancias de Milvus se agrupan para formar un sistema unificado que puede manejar mayores volúmenes de datos y mayores cargas de tráfico en comparación con una configuración independiente. Milvus Cluster ofrece características de escalabilidad, tolerancia a fallos y equilibrio de carga, lo que lo hace adecuado para escenarios que necesitan manejar grandes volúmenes de datos y servir muchas consultas concurrentes de forma eficiente.</p>
<h3 id="Features-and-Capabilities" class="common-anchor-header">Características y capacidades</h3><ul>
<li><p>Hereda todas las funciones disponibles en Milvus Standalone, incluida la búsqueda vectorial de alto rendimiento, la compatibilidad con múltiples tipos de índices y métricas de similitud, y la integración perfecta con marcos de procesamiento por lotes y de flujo.</p></li>
<li><p>Ofrece una disponibilidad, un rendimiento y una optimización de costes sin precedentes al aprovechar la informática distribuida y el equilibrio de carga en varios nodos.</p></li>
<li><p>Permite desplegar y escalar cargas de trabajo seguras y de nivel empresarial con costes totales más bajos mediante la utilización eficiente de los recursos en todo el clúster y la optimización de la asignación de recursos en función de las demandas de la carga de trabajo.</p></li>
</ul>
<h3 id="Essential-components" class="common-anchor-header">Componentes esenciales:</h3><p>Milvus Cluster incluye ocho componentes de microservicios y tres dependencias de terceros. Todos los microservicios pueden desplegarse en Kubernetes independientemente unos de otros.</p>
<h4 id="Microservice-components" class="common-anchor-header">Componentes de microservicio</h4><ul>
<li><p>Coordenada raíz</p></li>
<li><p>Proxy</p></li>
<li><p>Nodo de consulta</p></li>
<li><p>Nodo de consulta</p></li>
<li><p>Coordenada de índice</p></li>
<li><p>Nodo índice</p></li>
<li><p>Coordenada de datos</p></li>
<li><p>Nodo de datos</p></li>
</ul>
<h4 id="Third-party-dependencies" class="common-anchor-header">Dependencias de terceros</h4><ul>
<li><p>etcd: Almacena metadatos para varios componentes del clúster.</p></li>
<li><p>MinIO: Responsable de la persistencia de datos de archivos de gran tamaño en el clúster, como archivos de índice y de registro binario.</p></li>
<li><p>Pulsar: Gestiona los registros de operaciones de mutación recientes, genera registros de flujo y proporciona servicios de publicación y suscripción de registros.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Screenshot_2024_02_19_at_4_18_01_PM_88971280ed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figura 2: Arquitectura del clúster Milvus</p>
<h4 id="Available-Resources" class="common-anchor-header">Recursos disponibles</h4><ul>
<li><p><a href="https://milvus.io/docs/install_cluster-milvusoperator.md">Documentación</a> | Cómo empezar</p>
<ul>
<li><p><a href="https://milvus.io/docs/install_cluster-milvusoperator.md">Instalar Milvus Cluster con Milvus Operator</a></p></li>
<li><p><a href="https://milvus.io/docs/install_cluster-helm.md">Instalar Milvus Cluster con Helm</a></p></li>
<li><p><a href="https://milvus.io/docs/scaleout.md">Cómo escalar un clúster Milvus</a></p></li>
</ul></li>
<li><p><a href="https://github.com/milvus-io/milvus">Repositorio Github</a></p></li>
</ul>
<h2 id="Making-the-Decision-on-which-Milvus-version-to-use" class="common-anchor-header">Tomar la decisión sobre qué versión de Milvus utilizar<button data-href="#Making-the-Decision-on-which-Milvus-version-to-use" class="anchor-icon" translate="no">
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
    </button></h2><p>Al decidir qué versión de Milvus utilizar para su proyecto, debe considerar factores como el tamaño de su conjunto de datos, el volumen de tráfico, los requisitos de escalabilidad y las limitaciones del entorno de producción. Milvus Lite es perfecto para crear prototipos en su ordenador portátil. Milvus Standalone ofrece un alto rendimiento y flexibilidad para realizar búsquedas vectoriales en sus conjuntos de datos, por lo que es adecuado para implementaciones a menor escala, CI/CD e implementaciones fuera de línea cuando no tiene soporte para Kubernetes... Y, por último, Milvus Cluster ofrece una disponibilidad, escalabilidad y optimización de costes sin precedentes para cargas de trabajo de nivel empresarial, por lo que es la opción preferida para entornos de producción a gran escala y altamente disponibles.</p>
<p>Existe otra versión sin complicaciones, que es una versión gestionada de Milvus llamada <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>.</p>
<p>En última instancia, la versión de Milvus dependerá de su caso de uso específico, requisitos de infraestructura y objetivos a largo plazo. Al evaluar cuidadosamente estos factores y comprender las características y capacidades de cada versión, puede tomar una decisión informada que se alinee con las necesidades y objetivos de su proyecto. Tanto si elige Milvus Standalone como Milvus Cluster, puede aprovechar la potencia de las bases de datos vectoriales para mejorar el rendimiento y la eficiencia de sus aplicaciones de IA.</p>
