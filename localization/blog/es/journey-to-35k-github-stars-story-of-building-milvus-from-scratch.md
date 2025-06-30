---
id: journey-to-35k-github-stars-story-of-building-milvus-from-scratch.md
title: >-
  Nuestro viaje a las más de 35.000 estrellas de GitHub: La historia real de la
  creación de Milvus desde cero
author: Zilliz
date: 2025-06-27T00:00:00.000Z
cover: assets.zilliz.com/Github_star_30_K_2_f329467096.png
tag: Announcements
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus, vector database, vector search, AI search, Zilliz Cloud'
meta_title: |
  Our Journey to 35K+ GitHub Stars: Building Milvus from Scratch
desc: >-
  Únete a nosotros en la celebración de Milvus, la base de datos vectorial que
  alcanzó 35,5K estrellas en GitHub. Descubre nuestra historia y cómo
  facilitamos las soluciones de IA a los desarrolladores.
origin: >-
  https://milvus.io/blog/journey-to-35k-github-stars-story-of-building-milvus-from-scratch.md
---
<p>Durante los últimos años, nos hemos centrado en una cosa: crear una base de datos vectorial preparada para la era de la IA. Lo difícil no es crear <em>una</em> base de datos, sino crear una que sea escalable, fácil de usar y que realmente resuelva problemas reales en la producción.</p>
<p>Este mes de junio hemos alcanzado un nuevo hito: Milvus alcanzó <a href="https://github.com/milvus-io/milvus">las 35.000 estrellas en GitHub</a> (ahora tiene 35,5K+ estrellas en el momento de escribir esto). No vamos a fingir que se trata de una cifra más: significa mucho para nosotros.</p>
<p>Cada estrella representa a un desarrollador que se ha tomado la molestia de ver lo que hemos creado, lo ha encontrado lo suficientemente útil como para marcarlo y, en muchos casos, ha decidido utilizarlo. Algunos de vosotros habéis ido más allá: presentando problemas, aportando código, respondiendo preguntas en nuestros foros y ayudando a otros desarrolladores cuando se quedan atascados.</p>
<p>Queríamos tomarnos un momento para compartir nuestra historia - la real, con todas las partes desordenadas incluidas.</p>
<h2 id="We-Started-Building-Milvus-Because-Nothing-Else-Worked" class="common-anchor-header">Empezamos a construir Milvus porque nada más funcionaba<button data-href="#We-Started-Building-Milvus-Because-Nothing-Else-Worked" class="anchor-icon" translate="no">
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
    </button></h2><p>Allá por 2017, comenzamos con una simple pregunta: A medida que las aplicaciones de IA comenzaban a surgir y los datos no estructurados explotaban, ¿cómo almacenar y buscar de manera eficiente las incrustaciones vectoriales que potencian la comprensión semántica?</p>
<p>Las bases de datos tradicionales no se crearon para esto. Están optimizadas para filas y columnas, no para vectores de alta dimensión. Las tecnologías y herramientas existentes eran imposibles o terriblemente lentas para lo que necesitábamos.</p>
<p>Probamos todo lo que había disponible. Soluciones improvisadas con Elasticsearch. Construimos índices personalizados sobre MySQL. Incluso experimentamos con FAISS, pero se diseñó como una biblioteca de investigación, no como una infraestructura de base de datos de producción. Nada ofrecía la solución completa que imaginábamos para las cargas de trabajo empresariales de IA.</p>
<p><strong>Así que empezamos a construir la nuestra propia.</strong> No porque pensáramos que sería fácil -las bases de datos son notoriamente difíciles de hacer bien-, sino porque podíamos ver hacia dónde se dirigía la IA y sabíamos que necesitaba una infraestructura diseñada específicamente para llegar allí.</p>
<p>En 2018, estábamos inmersos en el desarrollo de lo que se convertiría en <a href="https://milvus.io/">Milvus</a>. El término &quot;<strong>base de datos vectorial</strong>&quot; ni siquiera existía todavía. Estábamos creando esencialmente una nueva categoría de software de infraestructura, lo que era a la vez emocionante y aterrador.</p>
<h2 id="Open-Sourcing-Milvus-Building-in-Public" class="common-anchor-header">Open-Sourcing Milvus: construir en público<button data-href="#Open-Sourcing-Milvus-Building-in-Public" class="anchor-icon" translate="no">
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
    </button></h2><p>En noviembre de 2019, decidimos abrir la versión 0.10 de Milvus.</p>
<p>Open-sourcing significa exponer todos tus defectos al mundo. Cada hack, cada comentario TODO, cada decisión de diseño de la que no estás del todo seguro. Pero creíamos que si las bases de datos vectoriales iban a convertirse en una infraestructura crítica para la IA, tenían que ser abiertas y accesibles a todo el mundo.</p>
<p>La respuesta fue abrumadora. Los desarrolladores no sólo utilizaron Milvus, sino que lo mejoraron. Encontraron errores que habíamos pasado por alto, sugirieron funciones que no habíamos considerado e hicieron preguntas que nos hicieron reflexionar más sobre nuestras opciones de diseño.</p>
<p>En 2020, nos unimos a <a href="https://lfaidata.foundation/">la LF AI &amp; Data Foundation</a>. No fue sólo por credibilidad: nos enseñó a mantener un proyecto sostenible de código abierto. Cómo gestionar la gobernanza, la compatibilidad con versiones anteriores y crear software que dure años, no meses.</p>
<p>En 2021, lanzamos Milvus 1.0 y <a href="https://lfaidata.foundation/projects/milvus/">nos graduamos de la LF AI &amp; Data Foundation</a>. Ese mismo año, ganamos el <a href="https://big-ann-benchmarks.com/neurips21.html">desafío global</a> de <a href="https://big-ann-benchmarks.com/neurips21.html">BigANN</a> para la búsqueda vectorial a escala de miles de millones. Esa victoria nos hizo sentir bien, pero lo más importante es que validó que estábamos resolviendo problemas reales de la manera correcta.</p>
<h2 id="The-Hardest-Decision-Starting-Over" class="common-anchor-header">La decisión más difícil: Volver a empezar<button data-href="#The-Hardest-Decision-Starting-Over" class="anchor-icon" translate="no">
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
    </button></h2><p>Aquí es donde las cosas se complican. En 2021, Milvus 1.0 funcionaba bien para muchos casos de uso, pero los clientes empresariales seguían pidiendo lo mismo: una mejor arquitectura nativa en la nube, un escalado horizontal más sencillo y más simplicidad operativa.</p>
<p>Teníamos que elegir: poner parches o reconstruir desde cero. Elegimos reconstruir.</p>
<p>Milvus 2.0 fue esencialmente una reescritura completa. Introdujimos una arquitectura de almacenamiento-ordenador totalmente desacoplada con escalabilidad dinámica. Nos llevó dos años y, sinceramente, fue uno de los periodos más estresantes de la historia de nuestra empresa. Estábamos tirando por la borda un sistema que funcionaba y que miles de personas utilizaban para construir algo no probado.</p>
<p><strong>Pero cuando lanzamos Milvus 2.0 en 2022, Milvus pasó de ser una potente base de datos vectorial a una infraestructura lista para la producción que podía ampliarse a cargas de trabajo empresariales.</strong> Ese mismo año, también completamos una <a href="https://zilliz.com/news/vector-database-company-zilliz-series-b-extension">ronda de financiación de Serie B+, no</a>para quemar dinero, sino para duplicar la calidad del producto y la asistencia a los clientes globales. Sabíamos que este camino llevaría tiempo, pero cada paso tenía que construirse sobre una base sólida.</p>
<h2 id="When-Everything-Accelerated-with-AI" class="common-anchor-header">Cuando todo se aceleró con la IA<button data-href="#When-Everything-Accelerated-with-AI" class="anchor-icon" translate="no">
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
    </button></h2><p>2023 fue el año de <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> (retrieval-augmented generation). De repente, la búsqueda semántica pasó de ser una interesante técnica de IA a una infraestructura esencial para chatbots, sistemas de preguntas y respuestas sobre documentos y agentes de IA.</p>
<p>Las estrellas de GitHub de Milvus se dispararon. Las solicitudes de soporte se multiplicaron. Desarrolladores que nunca habían oído hablar de bases de datos vectoriales de repente hacían preguntas sofisticadas sobre estrategias de indexación y optimización de consultas.</p>
<p>Este crecimiento fue emocionante pero también abrumador. Nos dimos cuenta de que necesitábamos ampliar no sólo nuestra tecnología, sino todo nuestro enfoque de apoyo a la comunidad. Contratamos a más desarrolladores, reescribimos por completo nuestra documentación y empezamos a crear contenidos educativos para desarrolladores novatos en bases de datos vectoriales.</p>
<p>También lanzamos <a href="https://zilliz.com/cloud">Zilliz Cloud, nuestra</a>versión totalmente gestionada de Milvus. Algunas personas nos preguntaron por qué estábamos "comercializando" nuestro proyecto de código abierto. La respuesta honesta es que mantener una infraestructura de nivel empresarial es caro y complejo. Zilliz Cloud nos permite sostener y acelerar el desarrollo de Milvus manteniendo el núcleo del proyecto completamente de código abierto.</p>
<p>Entonces llegó 2024. <a href="https://zilliz.com/blog/zilliz-named-a-leader-in-the-forrester-wave-vector-database-report"><strong>Forrester nos nombró líderes</strong></a> <strong>en la categoría de bases de datos vectoriales.</strong> Milvus superó las 30.000 estrellas de GitHub. <strong>Y nos dimos cuenta: el camino que habíamos estado pavimentando durante siete años se había convertido finalmente en la autopista.</strong> A medida que más empresas adoptaron las bases de datos vectoriales como infraestructura crítica, nuestro crecimiento empresarial se aceleró rápidamente, validando que la base que habíamos construido podía escalar tanto técnica como comercialmente.</p>
<h2 id="The-Team-Behind-Milvus-Zilliz" class="common-anchor-header">El equipo detrás de Milvus: Zilliz<button data-href="#The-Team-Behind-Milvus-Zilliz" class="anchor-icon" translate="no">
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
    </button></h2><p>Aquí hay algo interesante: mucha gente conoce Milvus pero no Zilliz. En realidad, nos parece bien. <a href="https://zilliz.com/"><strong>Zilliz</strong></a> <strong>es el equipo que está detrás de Milvus: nosotros lo construimos, lo mantenemos y lo apoyamos.</strong></p>
<p>Lo que más nos importa son las cosas poco glamurosas que marcan la diferencia entre una demo chula y una infraestructura lista para producción: optimizaciones de rendimiento, parches de seguridad, documentación que realmente ayude a los principiantes y responder cuidadosamente a los problemas de GitHub.</p>
<p>Hemos creado un equipo de soporte global 24/7 en EE.UU., Europa y Asia, porque los desarrolladores necesitan ayuda en sus zonas horarias, no en las nuestras. Contamos con colaboradores de la comunidad a los que llamamos &quot;<a href="https://docs.google.com/forms/d/e/1FAIpQLSfkVTYObayOaND8M1ci9eF_YWvoKDb-xQjLJYZ-LhbCdLAt2Q/viewform">Embajadores de Milvus</a>&quot;, que organizan eventos, responden a las preguntas del foro y, a menudo, explican los conceptos mejor que nosotros.</p>
<p>También hemos dado la bienvenida a las integraciones con AWS, GCP y otros proveedores de la nube, incluso cuando ofrecen sus propias versiones gestionadas de Milvus. Más opciones de despliegue son buenas para los usuarios. Aunque nos hemos dado cuenta de que cuando los equipos se enfrentan a retos técnicos complejos, a menudo acaban acudiendo a nosotros directamente porque entendemos el sistema en el nivel más profundo.</p>
<p>Mucha gente piensa que el código abierto es sólo una &quot;caja de herramientas&quot;, pero en realidad es un &quot;proceso evolutivo&quot;, un esfuerzo colectivo de innumerables personas que lo aman y creen en él. Sólo quienes entienden de verdad la arquitectura pueden aportar el "por qué" de las correcciones de errores, los análisis de cuellos de botella en el rendimiento, la integración de sistemas de datos y los ajustes arquitectónicos.</p>
<p><strong>Así que si está utilizando Milvus de código abierto, o considerando las bases de datos vectoriales como un componente central de su sistema de IA, le animamos a que se ponga en contacto con nosotros directamente para obtener el soporte más profesional y oportuno.</strong></p>
<h2 id="Real-Impact-in-Production-The-Trust-from-Users" class="common-anchor-header">Impacto real en la producción: La confianza de los usuarios<button data-href="#Real-Impact-in-Production-The-Trust-from-Users" class="anchor-icon" translate="no">
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
    </button></h2><p>Los casos de uso de Milvus han crecido más allá de lo que imaginamos inicialmente. Estamos impulsando la infraestructura de IA para algunas de las empresas más exigentes del mundo en todos los sectores.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/zilliz_customers_66d3adfe97.png" alt="zilliz customers.png" class="doc-image" id="zilliz-customers.png" />
   </span> <span class="img-wrapper"> <span>zilliz clientes.png</span> </span></p>
<p><a href="https://zilliz.com/customers/bosch"><strong>Bosch</strong></a>, líder mundial en tecnología de automoción y pionero en conducción autónoma, revolucionó su análisis de datos con Milvus, consiguiendo una reducción del 80% en los costes de recopilación de datos y un ahorro anual de 1,4 millones de dólares al tiempo que buscaba miles de millones de escenarios de conducción en milisegundos para casos críticos.</p>
<p><a href="https://zilliz.com/customers/read-ai"><strong>Read AI</strong></a>, una de las empresas de inteligencia artificial productiva de más rápido crecimiento que atiende a millones de usuarios activos mensuales, utiliza Milvus para lograr una latencia de recuperación inferior a 20-50 ms en miles de millones de registros y una velocidad 5 veces superior en la búsqueda agéntica. Su CTO dice: "Milvus sirve como repositorio central y potencia nuestra recuperación de información entre miles de millones de registros."</p>
<p><a href="https://zilliz.com/customers/global-fintech-leader"><strong>Un líder global en tecnología financiera</strong></a>, una de las mayores plataformas de pago digital del mundo que procesa decenas de miles de millones de transacciones en más de 200 países y más de 25 divisas, eligió Milvus por su ingestión de lotes entre 5 y 10 veces más rápida que la competencia, completando en menos de 1 hora trabajos que a otros les llevaban más de 8 horas.</p>
<p><a href="https://zilliz.com/customers/filevine"><strong>Filevine</strong></a>, la principal plataforma de trabajo jurídico en la que confían miles de bufetes de abogados de todo Estados Unidos, gestiona 3.000 millones de vectores en millones de documentos jurídicos, lo que ahorra a los abogados entre un 60 y un 80% de tiempo en el análisis de documentos y consigue una "verdadera conciencia de los datos" para la gestión de casos jurídicos.</p>
<p>También estamos apoyando a <strong>NVIDIA, OpenAI, Microsoft, Salesforce, Walmart</strong> y muchos otros en casi todas las industrias. Más de 10.000 organizaciones han hecho de Milvus o Zilliz Cloud su base de datos vectorial de elección.</p>
<p>Estas no son solo historias de éxito técnico, son ejemplos de cómo las bases de datos vectoriales se están convirtiendo silenciosamente en una infraestructura crítica que impulsa las aplicaciones de IA que la gente utiliza todos los días.</p>
<h2 id="Why-We-Built-Zilliz-Cloud-Enterprise-Grade-Vector-Database-as-a-Service" class="common-anchor-header">Por qué creamos Zilliz Cloud: Base de datos vectorial de nivel empresarial como servicio<button data-href="#Why-We-Built-Zilliz-Cloud-Enterprise-Grade-Vector-Database-as-a-Service" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus es de código abierto y de uso gratuito. Pero el buen funcionamiento de Milvus a escala empresarial requiere una gran experiencia y recursos significativos. La selección de índices, la gestión de la memoria, las estrategias de escalado, las configuraciones de seguridad... no son decisiones triviales. Muchos equipos quieren la potencia de Milvus sin la complejidad operativa y con soporte empresarial, garantías de SLA, etc.</p>
<p>Por eso creamos <a href="https://zilliz.com/cloud">Zilliz Cloud, una</a>versión totalmente gestionada de Milvus desplegada en 25 regiones globales y 5 nubes principales, incluidas AWS, GCP y Azure, diseñada específicamente para cargas de trabajo de IA a escala empresarial que exigen rendimiento, seguridad y fiabilidad.</p>
<p>Esto es lo que hace diferente a Zilliz Cloud:</p>
<ul>
<li><p><strong>Escala masiva con alto rendimiento:</strong> Nuestro motor patentado AutoIndex impulsado por IA ofrece velocidades de consulta de 3 a 5 veces más rápidas que Milvus de código abierto, sin necesidad de ajustar el índice. La arquitectura nativa de la nube admite miles de millones de vectores y decenas de miles de consultas simultáneas al tiempo que mantiene tiempos de respuesta por debajo del segundo.</p></li>
<li><p><a href="https://zilliz.com/trust-center"><strong>Seguridad y conformidad integradas</strong></a><strong>:</strong> Cifrado en reposo y en tránsito, RBAC detallado, registro de auditoría completo, integración SAML/OAuth2.0 e implementaciones <a href="https://zilliz.com/bring-your-own-cloud">BYOC</a> (traiga su propia nube). Cumplimos con GDPR, HIPAA y otras normas mundiales que las empresas realmente necesitan.</p></li>
<li><p><strong>Optimizado para la rentabilidad:</strong> El almacenamiento de datos en caliente/frío por niveles, el escalado elástico que responde a las cargas de trabajo reales y los precios de pago por uso pueden reducir el coste total de propiedad en un 50% o más en comparación con los despliegues autogestionados.</p></li>
<li><p><strong>Verdaderamente agnóstico a la nube sin dependencia del proveedor:</strong> Despliegue en AWS, Azure, GCP, Alibaba Cloud o Tencent Cloud sin dependencia del proveedor. Garantizamos la coherencia y escalabilidad globales independientemente de dónde se ejecute.</p></li>
</ul>
<p>Puede que estas capacidades no parezcan llamativas, pero resuelven problemas reales y cotidianos a los que se enfrentan los equipos empresariales cuando crean aplicaciones de IA a escala. Y lo más importante: sigue siendo Milvus bajo el capó, por lo que no hay bloqueo de propiedad ni problemas de compatibilidad.</p>
<h2 id="Whats-Next-Vector-Data-Lake" class="common-anchor-header">Lo que viene a continuación: Lago de datos vectorial<button data-href="#Whats-Next-Vector-Data-Lake" class="anchor-icon" translate="no">
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
    </button></h2><p>Acuñamos el término &quot;<a href="https://zilliz.com/learn/what-is-vector-database">base de datos vectorial</a>&quot; y fuimos los primeros en construir una, pero no nos detenemos ahí. Ahora estamos construyendo la siguiente evolución: <strong>Vector Data Lake.</strong></p>
<p><strong>Este es el problema que estamos resolviendo: no todas las búsquedas vectoriales necesitan una latencia de milisegundos.</strong> Muchas empresas tienen conjuntos de datos masivos que se consultan ocasionalmente, como análisis de documentos históricos, cálculos de similitud por lotes y análisis de tendencias a largo plazo. Para estos casos de uso, una base de datos vectorial tradicional en tiempo real resulta excesiva y cara.</p>
<p>Vector Data Lake utiliza una arquitectura separada de almacenamiento y computación optimizada específicamente para vectores a gran escala a los que se accede con poca frecuencia, al tiempo que mantiene unos costes drásticamente inferiores a los de los sistemas en tiempo real.</p>
<p><strong>Entre las funciones principales se incluyen</strong></p>
<ul>
<li><p><strong>Pila de datos unificada:</strong> Conecta a la perfección las capas de datos en línea y fuera de línea con formatos consistentes y almacenamiento eficiente, por lo que puede mover datos entre capas calientes y frías sin reformatear o migraciones complejas.</p></li>
<li><p><strong>Ecosistema informático compatible:</strong> Funciona de forma nativa con frameworks como Spark y Ray, soportando todo, desde búsqueda vectorial hasta ETL y analítica tradicionales. Esto significa que sus equipos de datos existentes pueden trabajar con datos vectoriales utilizando herramientas que ya conocen.</p></li>
<li><p><strong>Arquitectura de costes optimizados:</strong> Los datos calientes permanecen en SSD o NVMe para un acceso rápido; los datos fríos se mueven automáticamente al almacenamiento de objetos como S3. La indexación inteligente y las estrategias de almacenamiento mantienen la E/S rápida cuando se necesita, al tiempo que hacen que los costes de almacenamiento sean predecibles y asequibles.</p></li>
</ul>
<p>No se trata de sustituir las bases de datos vectoriales, sino de ofrecer a las empresas la herramienta adecuada para cada carga de trabajo. Búsqueda en tiempo real para aplicaciones orientadas al usuario, lagos de datos vectoriales rentables para análisis y procesamiento histórico.</p>
<p>Seguimos creyendo en la lógica de la Ley de Moore y la paradoja de Jevons: a medida que disminuye el coste unitario de la informática, aumenta su adopción. Lo mismo se aplica a la infraestructura vectorial.</p>
<p>Al mejorar los índices, las estructuras de almacenamiento, el almacenamiento en caché y los modelos de despliegue, día tras día, esperamos hacer que la infraestructura de IA sea más accesible y asequible para todos, y ayudar a que los datos no estructurados entren en el futuro de la IA nativa.</p>
<h2 id="A-Big-Thanks-to-You-All" class="common-anchor-header">Muchas gracias a todos<button data-href="#A-Big-Thanks-to-You-All" class="anchor-icon" translate="no">
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
    </button></h2><p>Esas más de 35.000 estrellas representan algo de lo que estamos realmente orgullosos: una comunidad de desarrolladores que encuentran Milvus lo suficientemente útil como para recomendarlo y contribuir a él.</p>
<p>Pero no hemos terminado. Milvus tiene errores que corregir, mejoras de rendimiento que hacer y características que nuestra comunidad ha estado pidiendo. Nuestra hoja de ruta es pública, y realmente queremos su opinión sobre lo que hay que priorizar.</p>
<p>El número en sí no es lo que importa, sino la confianza que representan esas estrellas. Confianza en que seguiremos construyendo abiertamente, seguiremos escuchando los comentarios y seguiremos mejorando Milvus.</p>
<ul>
<li><p><strong>A nuestros colaboradores:</strong> sus PRs, informes de errores y mejoras en la documentación hacen que Milvus sea mejor cada día. Muchas gracias a todos.</p></li>
<li><p><strong>A nuestros usuarios:</strong> gracias por confiarnos sus cargas de trabajo de producción y por los comentarios que nos mantienen honestos.</p></li>
<li><p><strong>A nuestra comunidad:</strong> gracias por responder preguntas, organizar eventos y ayudar a los recién llegados a empezar.</p></li>
</ul>
<p>Si es nuevo en las bases de datos vectoriales, nos encantaría ayudarle a empezar. Si ya utiliza Milvus o Zilliz Cloud, nos encantaría <a href="https://zilliz.com/share-your-story">conocer su experiencia</a>. Y si simplemente sientes curiosidad por lo que estamos construyendo, nuestros canales comunitarios están siempre abiertos.</p>
<p>Sigamos construyendo juntos la infraestructura que hace posibles las aplicaciones de IA.</p>
<hr>
<p>Encuéntrenos aquí: <a href="https://github.com/milvus-io/milvus">Milvus en GitHub</a> |<a href="https://zilliz.com/"> Zilliz Cloud</a> |<a href="https://discuss.milvus.io/"> Discord</a> | <a href="https://www.linkedin.com/company/the-milvus-project/">LinkedIn</a> | <a href="https://x.com/zilliz_universe">X</a> | <a href="https://www.youtube.com/@MilvusVectorDatabase/featured">YouTube</a></p>
<p><a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour?__hstc=175614333.dc4bcf53f6c7d650ea8978dcdb9e7009.1727350436713.1751017913702.1751029841530.667&amp;__hssc=175614333.3.1751029841530&amp;__hsfp=3554976067">
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/office_hour_4fb9130a9b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</a></p>
