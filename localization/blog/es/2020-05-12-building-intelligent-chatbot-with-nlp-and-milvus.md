---
id: building-intelligent-chatbot-with-nlp-and-milvus.md
title: Arquitectura general
author: milvus
date: 2020-05-12T22:33:34.726Z
desc: Ya está aquí el nuevo robot de control de calidad
cover: assets.zilliz.com/header_ce3a0e103d.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/building-intelligent-chatbot-with-nlp-and-milvus'
---
<custom-h1>Creación de un sistema inteligente de control de calidad con NLP y Milvus</custom-h1><p>Proyecto Milvus：github.com/milvus-io/milvus</p>
<p>El sistema de respuesta a preguntas se utiliza comúnmente en el campo del procesamiento del lenguaje natural. Se utiliza para responder a preguntas en forma de lenguaje natural y tiene una amplia gama de aplicaciones. Las aplicaciones típicas son: interacción de voz inteligente, atención al cliente en línea, adquisición de conocimientos, chat emocional personalizado, etc. La mayoría de los sistemas de respuesta a preguntas pueden clasificarse en: sistemas de respuesta a preguntas generativos y de recuperación, sistemas de respuesta a preguntas de una sola ronda y sistemas de respuesta a preguntas de varias rondas, sistemas de respuesta a preguntas abiertas y sistemas de respuesta a preguntas específicas.</p>
<p>Este artículo trata principalmente de un sistema de control de calidad diseñado para un campo específico, que suele denominarse robot inteligente de atención al cliente. En el pasado, la construcción de un robot de atención al cliente solía requerir la conversión del conocimiento del dominio en una serie de reglas y grafos de conocimiento. El proceso de construcción depende en gran medida de la inteligencia "humana". Con la aplicación del aprendizaje profundo en el procesamiento del lenguaje natural (PLN), la lectura automática puede encontrar respuestas a preguntas coincidentes directamente a partir de documentos. El modelo lingüístico de aprendizaje profundo convierte las preguntas y los documentos en vectores semánticos para encontrar la respuesta coincidente.</p>
<p>Este artículo utiliza el modelo BERT de código abierto de Google y Milvus, un motor de búsqueda vectorial de código abierto, para construir rápidamente un robot de preguntas y respuestas basado en la comprensión semántica.</p>
<h2 id="Overall-Architecture" class="common-anchor-header">Arquitectura general<button data-href="#Overall-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>Este artículo implementa un sistema de respuesta a preguntas a través de la concordancia por similitud semántica. El proceso general de construcción es el siguiente</p>
<ol>
<li>Obtener un gran número de preguntas con respuestas en un campo específico ( un conjunto de preguntas estándar).</li>
<li>Utilizar el modelo BERT para convertir estas preguntas en vectores de características y almacenarlas en Milvus. Y Milvus asignará un ID de vector a cada vector de características al mismo tiempo.</li>
<li>Almacene estos ID de pregunta representativos y sus correspondientes respuestas en PostgreSQL.</li>
</ol>
<p>Cuando un usuario formula una pregunta:</p>
<ol>
<li>El modelo BERT la convierte en un vector de características.</li>
<li>Milvus realiza una búsqueda de similitud y recupera el ID más similar a la pregunta.</li>
<li>PostgreSQL devuelve la respuesta correspondiente.</li>
</ol>
<p>El diagrama de la arquitectura del sistema es el siguiente (las líneas azules representan el proceso de importación y las líneas amarillas el proceso de consulta):</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_system_architecture_milvus_bert_postgresql_63de466754.png" alt="1-system-architecture-milvus-bert-postgresql.png" class="doc-image" id="1-system-architecture-milvus-bert-postgresql.png" />
   </span> <span class="img-wrapper"> <span>1-arquitectura-sistema-milvus-bert-postgresql.png</span> </span></p>
<p>A continuación, le mostraremos cómo construir un sistema de preguntas y respuestas en línea paso a paso.</p>
<h2 id="Steps-to-Build-the-QA-System" class="common-anchor-header">Pasos para crear el sistema de preguntas y respuestas<button data-href="#Steps-to-Build-the-QA-System" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de empezar, necesita instalar Milvus y PostgreSQL. Para los pasos específicos de instalación, consulte el sitio web oficial de Milvus.</p>
<h3 id="1-Data-preparation" class="common-anchor-header">1. Preparación de los datos</h3><p>Los datos experimentales de este artículo proceden de: https://github.com/chatopera/insuranceqa-corpus-zh</p>
<p>El conjunto de datos contiene pares de datos de preguntas y respuestas relacionados con el sector de los seguros. En este artículo extraemos de él 20.000 pares de preguntas y respuestas. A través de este conjunto de datos de preguntas y respuestas, puedes construir rápidamente un robot de atención al cliente para el sector de los seguros.</p>
<h3 id="2-Generate-feature-vectors" class="common-anchor-header">2. Generar vectores de características</h3><p>Este sistema utiliza un modelo que BERT ha preentrenado. Descárgalo desde el siguiente enlace antes de iniciar un servicio: https://storage.googleapis.com/bert_models/2018_10_18/cased_L-24_H-1024_A-16.zip</p>
<p>Utilice este modelo para convertir la base de datos de preguntas en vectores de características para futuras búsquedas de similitudes. Para más información sobre el servicio BERT, consulte https://github.com/hanxiao/bert-as-service.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_code_block_e1b2021a91.png" alt="2-code-block.png" class="doc-image" id="2-code-block.png" />
   </span> <span class="img-wrapper"> <span>2-code-block.png</span> </span></p>
<h3 id="3-Import-to-Milvus-and-PostgreSQL" class="common-anchor-header">3. Importar a Milvus y PostgreSQL</h3><p>Normalice e importe los vectores de características generados a Milvus y, a continuación, importe los ID devueltos por Milvus y las respuestas correspondientes a PostgreSQL. A continuación se muestra la estructura de la tabla en PostgreSQL:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_import_milvus_postgresql_bb2a258c61.png" alt="3-import-milvus-postgresql.png" class="doc-image" id="3-import-milvus-postgresql.png" />
   </span> <span class="img-wrapper"> <span>3-import-milvus-postgresql.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_import_milvus_postgresql_2abc29a4c4.png" alt="4-import-milvus-postgresql.png" class="doc-image" id="4-import-milvus-postgresql.png" />
   </span> <span class="img-wrapper"> <span>4-importar-milvus-postgresql.png</span> </span></p>
<h3 id="4-Retrieve-Answers" class="common-anchor-header">4. Recuperar respuestas</h3><p>El usuario introduce una pregunta y, tras generar el vector de características mediante BERT, puede encontrar la pregunta más similar en la biblioteca Milvus. Este artículo utiliza la distancia coseno para representar la similitud entre dos frases. Dado que todos los vectores están normalizados, cuanto más se acerque la distancia coseno de los dos vectores de características a 1, mayor será la similitud.</p>
<p>En la práctica, es posible que su sistema no disponga de preguntas perfectamente coincidentes en la biblioteca. Entonces, puede establecer un umbral de 0,9. Si la mayor distancia de similitud recuperada es inferior a este umbral, el sistema le indicará que no incluye preguntas relacionadas.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_retrieve_answers_6424db1032.png" alt="4-retrieve-answers.png" class="doc-image" id="4-retrieve-answers.png" />
   </span> <span class="img-wrapper"> <span>4-recuperar-respuestas.png</span> </span></p>
<h2 id="System-Demonstration" class="common-anchor-header">Demostración del sistema<button data-href="#System-Demonstration" class="anchor-icon" translate="no">
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
    </button></h2><p>A continuación se muestra un ejemplo de interfaz del sistema:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_milvus_QA_system_application_e5860cee42.png" alt="5-milvus-QA-system-application.png" class="doc-image" id="5-milvus-qa-system-application.png" />
   </span> <span class="img-wrapper"> <span>5-milvus-QA-sistema-aplicacion.png</span> </span></p>
<p>Introduzca su pregunta en el cuadro de diálogo y recibirá la respuesta correspondiente:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_milvus_QA_system_application_2_8064237e2a.png" alt="5-milvus-QA-system-application-2.png" class="doc-image" id="5-milvus-qa-system-application-2.png" />
   </span> <span class="img-wrapper"> <span>5-milvus-QA-sistema-aplicación-2.png</span> </span></p>
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
    </button></h2><p>Después de leer este artículo, esperamos que le resulte fácil construir su propio sistema de preguntas y respuestas.</p>
<p>Con el modelo BERT, ya no es necesario clasificar y organizar de antemano los corpus de texto. Al mismo tiempo, gracias al alto rendimiento y la gran escalabilidad del motor de búsqueda vectorial de código abierto Milvus, su sistema de control de calidad puede soportar un corpus de hasta cientos de millones de textos.</p>
<p>Milvus se ha unido oficialmente a la Fundación Linux AI (LF AI) para su incubación. Le invitamos a unirse a la comunidad Milvus y a trabajar con nosotros para acelerar la aplicación de las tecnologías de IA.</p>
<p>=&gt; Pruebe nuestra demostración en línea aquí: https://www.milvus.io/scenarios</p>
