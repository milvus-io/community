---
id: milmil-a-milvus-powered-faq-chatbot-that-answers-questions-about-milvus.md
title: >-
  MilMil Un chatbot de preguntas frecuentes impulsado por Milvus que responde a
  preguntas sobre Milvus
author: milvus
date: 2021-07-20T07:21:43.897Z
desc: >-
  Uso de herramientas de búsqueda vectorial de código abierto para crear un
  servicio de respuesta a preguntas.
cover: assets.zilliz.com/milmil_4600f33f1c.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/milmil-a-milvus-powered-faq-chatbot-that-answers-questions-about-milvus
---
<custom-h1>MilMil: Un chatbot de preguntas frecuentes sobre Milvus que responde a preguntas sobre Milvus</custom-h1><p>ha creado recientemente MilMil, un chatbot de preguntas frecuentes sobre Milvus creado por y para los usuarios de Milvus. MilMil está disponible 24/7 en <a href="https://milvus.io/">Milvus.io</a> para responder a preguntas comunes sobre Milvus, la base de datos vectorial de código abierto más avanzada del mundo.</p>
<p>Este sistema de respuesta a preguntas no sólo ayuda a resolver con mayor rapidez los problemas comunes que encuentran los usuarios de Milvus, sino que identifica nuevos problemas basándose en los envíos de los usuarios. La base de datos de MilMil incluye preguntas que los usuarios han hecho desde que el proyecto se lanzó por primera vez bajo una licencia de código abierto en 2019. Las preguntas se almacenan en dos colecciones, una para Milvus 1.x y anteriores y otra para Milvus 2.0.</p>
<p>Actualmente MilMil solo está disponible en inglés.</p>
<h2 id="How-does-MilMil-work" class="common-anchor-header">¿Cómo funciona MilMil?<button data-href="#How-does-MilMil-work" class="anchor-icon" translate="no">
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
    </button></h2><p>MilMil se basa en el modelo <em>sentence-transformers/paraphrase-mpnet-base-v2</em> para obtener representaciones vectoriales de la base de datos de preguntas frecuentes, después se utiliza Milvus para la recuperación de similitud vectorial para devolver preguntas semánticamente similares.</p>
<p>En primer lugar, los datos de las FAQ se convierten en vectores semánticos mediante BERT, un modelo de procesamiento del lenguaje natural (PLN). A continuación, los vectores se insertan en Milvus y se asigna a cada uno un identificador único. Por último, las preguntas y respuestas se insertan en PostgreSQL, una base de datos relacional, junto con sus ID vectoriales.</p>
<p>Cuando los usuarios envían una pregunta, el sistema la convierte en un vector de características mediante BERT. A continuación, busca en Milvus los cinco vectores más similares al vector de la consulta y recupera sus ID. Por último, se devuelven al usuario las preguntas y respuestas que corresponden a los ID de los vectores recuperados.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/system_process_dca67a80a6.png" alt="system-process.png" class="doc-image" id="system-process.png" />
   </span> <span class="img-wrapper"> <span>sistema-proceso.png</span> </span></p>
<p>Vea el proyecto <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/question_answering_system">del sistema de respuesta a preguntas</a> en el Milvus bootcamp para explorar el código utilizado para construir chatbots de IA.</p>
<h2 id="Ask-MilMil-about-Milvus" class="common-anchor-header">Pregunte a MilMil sobre Milvus<button data-href="#Ask-MilMil-about-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Para chatear con MilMil, vaya a cualquier página de <a href="https://milvus.io/">Milvus.io</a> y haga clic en el icono del pájaro de la esquina inferior derecha. Escriba su pregunta en el cuadro de entrada de texto y pulse enviar. MilMil le responderá en milisegundos. Además, la lista desplegable de la esquina superior izquierda puede utilizarse para cambiar entre la documentación técnica de las distintas versiones de Milvus.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_chatbot_icon_f3c25708ca.png" alt="milvus-chatbot-icon.png" class="doc-image" id="milvus-chatbot-icon.png" />
   </span> <span class="img-wrapper"> <span>milvus-chatbot-icon.png</span> </span></p>
<p>Después de enviar una pregunta, el bot devuelve inmediatamente tres preguntas que son semánticamente similares a la pregunta de consulta. Puede hacer clic en "Ver respuesta" para examinar las posibles respuestas a su pregunta, o en "Ver más" para ver más preguntas relacionadas con su búsqueda. Si no encuentra una respuesta adecuada, haga clic en "Escriba aquí sus comentarios" para formular su pregunta junto con una dirección de correo electrónico. ¡La ayuda de la comunidad Milvus llegará en breve!</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/chatbot_UI_0f4a7655d4.png" alt="chatbot_UI.png" class="doc-image" id="chatbot_ui.png" />
   </span> <span class="img-wrapper"> <span>chatbot_UI.png</span> </span></p>
<p>Pruebe MilMil y díganos qué le parece. Todas las preguntas, comentarios o cualquier forma de feedback son bienvenidos.</p>
<h2 id="Dont-be-a-stranger" class="common-anchor-header">No seas un extraño<button data-href="#Dont-be-a-stranger" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li>Encuentra o contribuye a Milvus en <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>Interactúa con la comunidad a través de <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Conéctese con nosotros en <a href="https://twitter.com/milvusio">Twitter</a>.</li>
</ul>
