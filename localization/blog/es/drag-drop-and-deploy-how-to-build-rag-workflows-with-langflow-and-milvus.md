---
id: drag-drop-and-deploy-how-to-build-rag-workflows-with-langflow-and-milvus.md
title: >-
  Arrastrar, soltar y desplegar: Cómo construir flujos de trabajo RAG con
  Langflow y Milvus
author: Min Yin
date: 2025-10-30T00:00:00.000Z
cover: assets.zilliz.com/drag_drop_deploy_859c4369e8.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Langflow, Milvus, RAG, AI workflow'
meta_title: 'Drag, Drop, and Deploy RAG Workflows with Langflow & Milvus'
desc: >-
  Aprenda a crear flujos de trabajo RAG visuales con Langflow y Milvus.
  Arrastre, suelte y despliegue aplicaciones de IA contextualizadas en cuestión
  de minutos, sin necesidad de codificación.
origin: >-
  https://milvus.io/blog/drag-drop-and-deploy-how-to-build-rag-workflows-with-langflow-and-milvus.md
---
<p>Crear un flujo de trabajo de IA a menudo parece más difícil de lo que debería. Entre escribir código, depurar llamadas a la API y gestionar canalizaciones de datos, el proceso puede consumir horas antes incluso de ver resultados. <a href="https://www.langflow.org/"><strong>Langflow</strong></a> y <a href="https://milvus.io/"><strong>Milvus</strong></a> simplifican esto drásticamente, ofreciéndole una forma sencilla de diseñar, probar e implementar flujos de trabajo de generación de recuperación aumentada (RAG) en cuestión de minutos, no de días.</p>
<p><strong>Langflow</strong> ofrece una interfaz limpia de arrastrar y soltar que se parece más a esbozar ideas en una pizarra que a codificar. Puede conectar visualmente modelos lingüísticos, fuentes de datos y herramientas externas para definir la lógica de su flujo de trabajo, todo ello sin tocar una sola línea de código.</p>
<p>Combinado con <strong>Milvus</strong>, la base de datos vectorial de código abierto que proporciona a los LLM memoria a largo plazo y comprensión contextual, ambos forman un entorno completo para RAG de nivel de producción. Milvus almacena y recupera eficazmente incrustaciones de datos específicos de su empresa o dominio, lo que permite a los LLM generar respuestas fundamentadas, precisas y conscientes del contexto.</p>
<p>En esta guía, le explicaremos cómo combinar Langflow y Milvus para crear un flujo de trabajo RAG avanzado, todo ello con sólo arrastrar, soltar y hacer clic.</p>
<h2 id="What-is-Langflow" class="common-anchor-header">¿Qué es Langflow?<button data-href="#What-is-Langflow" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de ir a través de la demostración RAG, vamos a aprender lo que Langflow es y lo que puede hacer.</p>
<p>Langflow es un framework de código abierto basado en Python que facilita la creación y experimentación con aplicaciones de IA. Es compatible con las capacidades clave de la IA, como los agentes y el Protocolo de Contexto de Modelo (MCP), ofreciendo a los desarrolladores y no desarrolladores por igual una base flexible para la creación de sistemas inteligentes.</p>
<p>En su núcleo, Langflow proporciona un editor visual. Puede arrastrar, soltar y conectar diferentes recursos para diseñar aplicaciones completas que combinen modelos, herramientas y fuentes de datos. Cuando exporta un flujo de trabajo, Langflow genera automáticamente un archivo llamado <code translate="no">FLOW_NAME.json</code> en su máquina local. Este archivo registra todos los nodos, aristas y metadatos que describen su flujo, permitiéndole controlar versiones, compartir y reproducir proyectos fácilmente entre equipos.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Langflow_s_visual_editor_cd553ad4ad.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Entre bastidores, un motor de ejecución basado en Python ejecuta el flujo. Organiza los LLM, las herramientas, los módulos de recuperación y la lógica de enrutamiento, gestionando el flujo de datos, el estado y la gestión de errores para garantizar una ejecución fluida de principio a fin.</p>
<p>Langflow también incluye una amplia biblioteca de componentes con adaptadores predefinidos para los LLM y las bases de datos vectoriales más populares, incluido <a href="https://milvus.io/">Milvus</a>. Puede ampliar esto aún más mediante la creación de componentes Python personalizados para casos de uso especializados. Para pruebas y optimización, Langflow ofrece ejecución paso a paso, un Playground para pruebas rápidas e integraciones con LangSmith y Langfuse para monitorizar, depurar y reproducir flujos de trabajo de principio a fin.</p>
<h2 id="Hands-on-Demo-How-to-Build-a-RAG-Workflow-with-Langflow-and-Milvus" class="common-anchor-header">Demostración práctica: Cómo construir un flujo de trabajo RAG con Langflow y Milvus<button data-href="#Hands-on-Demo-How-to-Build-a-RAG-Workflow-with-Langflow-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Basándose en la arquitectura de Langflow, Milvus puede servir como base de datos vectorial que gestiona las incrustaciones y recupera datos privados de la empresa o conocimientos específicos del dominio.</p>
<p>En esta demostración, utilizaremos la plantilla Vector Store RAG de Langflow para mostrar cómo integrar Milvus y construir un índice vectorial a partir de datos locales, permitiendo una respuesta a preguntas eficiente y mejorada por el contexto.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_processing_flow_289a9376c9.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Prerequisites" class="common-anchor-header">Requisitos previos：</h3><p>1.Python 3.11 (o Conda)</p>
<p>2.uv</p>
<p>3.Docker y Docker Compose</p>
<p>4.Llave OpenAI</p>
<h3 id="Step-1-Deploy-Milvus-Vector-Database" class="common-anchor-header">Paso 1. Desplegar Milvus Vector Database</h3><p>Descargue los archivos de despliegue.</p>
<pre><code translate="no">wget &lt;https://github.com/Milvus-io/Milvus/releases/download/v2.5.12/Milvus-standalone-docker-compose.yml&gt; -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<p>Inicie el servicio Milvus.</p>
<pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/start_milvus_service_860353ed55.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Create-a-Python-Virtual-Environment" class="common-anchor-header">Paso 2. Crear un entorno virtual Python Cree un entorno virtual Python</h3><pre><code translate="no">conda create -n langflow
<span class="hljs-comment"># activate langflow and launch it</span>
conda activate langflow
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Install-the-Latest-Packages" class="common-anchor-header">Paso 3. Instalar los últimos paquetes Instale los últimos paquetes</h3><pre><code translate="no">pip install langflow -U
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Launch-Langflow" class="common-anchor-header">Paso 4. Iniciar Langflow Iniciar Langflow</h3><pre><code translate="no">uv run langflow run
<button class="copy-code-btn"></button></code></pre>
<p>Visite Langflow.</p>
<pre><code translate="no">&lt;<span class="hljs-attr">http</span>:<span class="hljs-comment">//127.0.0.1:7860&gt;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-5-Configure-the-RAG-Template" class="common-anchor-header">Paso 5. Configure la plantilla RAG</h3><p>Seleccione la plantilla Vector Store RAG en Langflow.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/rag1_fcb0d1c3c5.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/rag2_f750e10a41.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Elija Milvus como su base de datos vectorial por defecto.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb_milvus_925c6ce846.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>En el panel izquierdo, busque "Milvus" y añádalo a su flujo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/add_milvus1_862d14d0d0.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/add_milvus2_4e3d6aacda.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Configure los detalles de conexión de Milvus. Deje las otras opciones por defecto por ahora.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/connect1_a27d3e4f43.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/connect2_d8421c1525.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Añade tu clave API de OpenAI al nodo correspondiente.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/openai_key_7a6596868c.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/openai_key2_4753bfb4d0.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-6-Prepare-Test-Data" class="common-anchor-header">Paso 6. Prepare los Datos de Prueba</h3><p>Nota: Utilice las FAQ oficiales para Milvus 2.6 como datos de prueba.</p>
<pre><code translate="no">https://github.com/milvus-io/milvus-docs/blob/v2.6.x/site/en/faq/product_faq.md
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-7-Phase-One-Testing" class="common-anchor-header">Paso 7. Fase Uno de Pruebas</h3><p>Cargue su conjunto de datos e ingréselo en Milvus. Nota: Langflow convierte entonces su texto en representaciones vectoriales. Debe cargar al menos dos conjuntos de datos, o el proceso de incrustación fallará. Se trata de un error conocido en la implementación actual de los nodos de Langflow.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ingest_7b804d870a.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ingest2_fc7f1e4d9a.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Compruebe el estado de sus nodos.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test_48e02d48ca.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-8-Phase-Two-Testing" class="common-anchor-header">Paso 8. Fase dos de pruebas</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ingest_7b804d870a.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-9-Run-the-Full-RAG-Workflow" class="common-anchor-header">Paso 9. Ejecute el flujo de trabajo RAG completo. Ejecute el flujo de trabajo RAG completo</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/full_flow1_5b4f4962f5.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/full_flow2_535c722a3d.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>Construir flujos de trabajo de IA no tiene por qué ser complicado. Langflow + Milvus lo hace rápido, visual y con código ligero - una forma sencilla de mejorar RAG sin grandes esfuerzos de ingeniería.</p>
<p>La interfaz de arrastrar y soltar de Langflow hace que sea una opción adecuada para la enseñanza, talleres o demostraciones en vivo, donde se necesita demostrar cómo funcionan los sistemas de IA de una manera clara e interactiva. Para los equipos que buscan integrar un diseño de flujo de trabajo intuitivo con la recuperación de vectores de nivel empresarial, la combinación de la simplicidad de Langflow con la búsqueda de alto rendimiento de Milvus ofrece tanto flexibilidad como potencia.</p>
<p>👉 Empiece a crear flujos de trabajo RAG más inteligentes con <a href="https://milvus.io/">Milvus</a> hoy mismo.</p>
<p>Tiene preguntas o desea una inmersión profunda en cualquier característica? Únete a nuestro<a href="https://discord.com/invite/8uyFbECzPX"> canal de Discord</a> o presenta incidencias en<a href="https://github.com/milvus-io/milvus"> GitHub</a>. También puede reservar una sesión individual de 20 minutos para obtener información, orientación y respuestas a sus preguntas a través de<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
