---
id: 2021-12-03-why-to-choose-fastapi-over-flask.md
title: ¿Por qué elegir FastAPI en lugar de Flask?
author: Yunmei
date: 2021-12-03T00:00:00.000Z
desc: elija el marco adecuado según el escenario de su aplicación
cover: assets.zilliz.com/1_d5de035def.png
tag: Engineering
isPublish: false
---
<p>Para ayudarle a empezar rápidamente con Milvus, la base de datos vectorial de código abierto, hemos publicado otro proyecto de código abierto afiliado, <a href="https://github.com/milvus-io/bootcamp">Milvus Bootcamp</a> en GitHub. Milvus Bootcamp no sólo proporciona scripts y datos para pruebas comparativas, sino que también incluye proyectos que utilizan Milvus para construir algunos MVP (productos mínimos viables), como un sistema de búsqueda inversa de imágenes, un sistema de análisis de vídeo, un chatbot de control de calidad o un sistema de recomendación. Puede aprender a aplicar la búsqueda de similitud vectorial en un mundo lleno de datos no estructurados y obtener experiencia práctica en Milvus Bootcamp.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_5b60157b4d.png" alt="2.png" class="doc-image" id="2.png" />
   </span> <span class="img-wrapper"> <span>2.png</span> </span></p>
<p>Proporcionamos servicios front-end y back-end para los proyectos de Milvus Bootcamp. Sin embargo, recientemente hemos tomado la decisión de cambiar el framework web adoptado de Flask a FastAPI.</p>
<p>Este artículo tiene como objetivo explicar nuestra motivación detrás de este cambio en el marco web adoptado para Milvus Bootcamp aclarando por qué elegimos FastAPI en lugar de Flask.</p>
<h2 id="Web-frameworks-for-Python" class="common-anchor-header">Frameworks web para Python<button data-href="#Web-frameworks-for-Python" class="anchor-icon" translate="no">
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
    </button></h2><p>Un marco web se refiere a una colección de paquetes o módulos. Es un conjunto de arquitectura de software para el desarrollo web que le permite escribir aplicaciones o servicios web y le ahorra la molestia de manejar detalles de bajo nivel como protocolos, sockets o gestión de procesos/hilos. El uso de un framework web puede reducir significativamente la carga de trabajo que supone desarrollar aplicaciones web, ya que basta con "enchufar" el código al framework, sin necesidad de prestar más atención a la gestión de la caché de datos, el acceso a bases de datos y la verificación de la seguridad de los datos. Para más información sobre qué es un framework web para Python, consulta <a href="https://wiki.python.org/moin/WebFrameworks">Web Frameworks</a>.</p>
<p>Hay varios tipos de frameworks web para Python. Los principales incluyen Django, Flask, Tornado, y FastAPI.</p>
<h3 id="Flask" class="common-anchor-header">Flask</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_1abd170939.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span></p>
<p><a href="https://flask.palletsprojects.com/en/2.0.x/">Flask</a> es un microframework ligero diseñado para Python, con un núcleo sencillo y fácil de usar que te permite desarrollar tus propias aplicaciones web. Además, el núcleo de Flask también es extensible. Por lo tanto, Flask soporta la extensión bajo demanda de diferentes funciones para satisfacer sus necesidades personalizadas durante el desarrollo de aplicaciones web. Es decir, con una biblioteca de varios plug-ins en Flask, puede desarrollar potentes sitios web.</p>
<p>Flask tiene las siguientes características:</p>
<ol>
<li>Flask es un microframework que no depende de otras herramientas específicas o componentes de librerías de terceros para proporcionar funcionalidades compartidas. Flask no tiene una capa de abstracción de base de datos, y no requiere validación de formularios. Sin embargo, Flask es altamente extensible y soporta la adición de funcionalidades de aplicación de forma similar a las implementaciones dentro del propio Flask. Las extensiones relevantes incluyen mapeadores objeto-relacionales, validación de formularios, procesamiento de cargas, tecnologías de autenticación abierta y algunas herramientas comunes diseñadas para marcos web.</li>
<li>Flask es un marco de aplicaciones web basado en <a href="https://wsgi.readthedocs.io/">WSGI</a> (Web Server Gateway Interface). WSGI es una interfaz sencilla que conecta un servidor web con una aplicación o marco web definido para el lenguaje Python.</li>
<li>Flask incluye dos bibliotecas de funciones básicas, <a href="https://www.palletsprojects.com/p/werkzeug">Werkzeug</a> y <a href="https://www.palletsprojects.com/p/jinja">Jinja2</a>. Werkzeug es un conjunto de herramientas WSGI que implementa peticiones, objetos de respuesta y funciones prácticas, lo que permite construir frameworks web sobre él. Jinja2 es un popular motor de plantillas completo para Python. Tiene soporte completo para Unicode, con un entorno de ejecución sandbox integrado opcional pero ampliamente adoptado.</li>
</ol>
<h3 id="FastAPI" class="common-anchor-header">FastAPI</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_05cb0dac4e.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<p><a href="https://fastapi.tiangolo.com/">FastAPI</a> es un moderno framework de aplicaciones web para Python que tiene el mismo nivel de alto rendimiento que Go y NodeJS. El núcleo de FastAPI se basa en <a href="https://www.starlette.io/">Starlette</a> y <a href="https://pydantic-docs.helpmanual.io/">Pydantic</a>. Starlette es un ligero conjunto de herramientas <a href="https://asgi.readthedocs.io/">ASGI</a>(Asynchronous Server Gateway Interface) para construir servicios <a href="https://docs.python.org/3/library/asyncio.html">Asyncio</a> de alto rendimiento. Pydantic es una biblioteca que define la validación, serialización y documentación de datos basándose en las sugerencias de tipos de Python.</p>
<p>FastAPI tiene las siguientes características:</p>
<ol>
<li>FastAPI es un framework de aplicaciones web basado en ASGI, una interfaz de protocolo de pasarela asíncrona que conecta servicios de protocolo de red y aplicaciones Python. FastAPI puede manejar una variedad de tipos de protocolos comunes, incluyendo HTTP, HTTP2 y WebSocket.</li>
<li>FastAPI se basa en Pydantic, que proporciona la función de verificación del tipo de datos de la interfaz. No es necesario verificar adicionalmente el parámetro de la interfaz, ni escribir código adicional para verificar si los parámetros están vacíos o si el tipo de datos es correcto. El uso de FastAPI puede evitar eficazmente errores humanos en el código y mejorar la eficiencia del desarrollo.</li>
<li>FastAPI admite documentos en dos formatos: <a href="https://swagger.io/specification/">OpenAPI</a> (antes Swagger) y <a href="https://www.redoc.com/">Redoc</a>. Por lo tanto, como usuario no es necesario gastar tiempo extra escribiendo documentos de interfaz adicionales. El documento OpenAPI proporcionado por FastAPI se muestra en la siguiente captura de pantalla.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_d91d34cb0f.png" alt="5.png" class="doc-image" id="5.png" />
   </span> <span class="img-wrapper"> <span>5.png</span> </span></p>
<h3 id="Flask-Vs-FastAPI" class="common-anchor-header">Flask vs. FastAPI</h3><p>La siguiente tabla muestra las diferencias entre Flask y FastAPI en varios aspectos.</p>
<table>
<thead>
<tr><th></th><th><strong>FastAPI</strong></th><th><strong>Flask</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Pasarela de interfaz</strong></td><td>ASGI</td><td>WSGI</td></tr>
<tr><td><strong>Marco de trabajo asíncrono</strong></td><td>✅</td><td>❌</td></tr>
<tr><td><strong>Rendimiento</strong></td><td>Más rápido</td><td>Más lento</td></tr>
<tr><td><strong>Documentos interactivos</strong></td><td>OpenAPI, Redoc</td><td>Ninguno</td></tr>
<tr><td><strong>Verificación de datos</strong></td><td>✅</td><td>❌</td></tr>
<tr><td><strong>Costes de desarrollo</strong></td><td>Más bajos</td><td>Mayores</td></tr>
<tr><td><strong>Facilidad de uso</strong></td><td>Menor</td><td>Mayor</td></tr>
<tr><td><strong>Flexibilidad</strong></td><td>Menos flexible</td><td>Más flexible</td></tr>
<tr><td><strong>Comunidad</strong></td><td>Más pequeña</td><td>Más activa</td></tr>
</tbody>
</table>
<h2 id="Why-FastAPI" class="common-anchor-header">¿Por qué FastAPI?<button data-href="#Why-FastAPI" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de decidir qué marco de aplicaciones web Python elegir para los proyectos de Milvus Bootcamp, investigamos varios marcos principales como Django, Flask, FastAPI y Tornado, entre otros. Dado que los proyectos en Milvus Bootcamp sirven como referencia para usted, nuestra prioridad es adoptar un marco externo de máxima ligereza y destreza. De acuerdo con esta regla, redujimos nuestras opciones a Flask y FastAPI.</p>
<p>Puedes ver la comparación entre los dos frameworks web en la sección anterior. Lo que sigue es una explicación detallada de nuestra motivación para elegir FastAPI sobre Flask para los proyectos en Milvus Bootcamp. Hay varias razones:</p>
<h3 id="1-Performance" class="common-anchor-header">1. Rendimiento</h3><p>La mayoría de los proyectos en Milvus Bootcamp se construyen en torno a sistemas de búsqueda inversa de imágenes, chatbots de control de calidad, motores de búsqueda de texto, todos los cuales tienen altas demandas de procesamiento de datos en tiempo real. En consecuencia, necesitamos un marco de trabajo con un rendimiento excepcional, que es exactamente un punto destacado de FastAPI. Por lo tanto, desde la perspectiva del rendimiento del sistema, decidimos elegir FastAPI.</p>
<h3 id="2-Efficiency" class="common-anchor-header">2. Eficiencia</h3><p>Cuando se utiliza Flask, es necesario escribir código para la verificación del tipo de datos en cada una de las interfaces para que el sistema pueda determinar si los datos de entrada están vacíos o no. Sin embargo, al soportar la verificación automática del tipo de datos, FastAPI ayuda a evitar errores humanos en la codificación durante el desarrollo del sistema y puede aumentar enormemente la eficiencia del desarrollo. Bootcamp se posiciona como un tipo de recurso de formación. Esto significa que el código y los componentes que utilizamos deben ser intuitivos y muy eficientes. En este sentido, elegimos FastAPI para mejorar la eficiencia del sistema y mejorar la experiencia del usuario.</p>
<h3 id="3-Asynchronous-framework" class="common-anchor-header">3. Marco asíncrono</h3><p>FastAPI es inherentemente un framework asíncrono. Originalmente, lanzamos cuatro <a href="https://zilliz.com/milvus-demos?isZilliz=true">demos</a>, búsqueda inversa de imágenes, análisis de vídeo, chatbot de control de calidad y búsqueda de similitud molecular. En estas demos, puedes cargar conjuntos de datos y se te preguntará inmediatamente &quot;solicitud recibida&quot;. Y cuando los datos se hayan cargado en el sistema de demostración, recibirá otro mensaje: &quot;carga de datos correcta&quot;. Se trata de un proceso asíncrono que requiere un marco de trabajo compatible con esta función. FastAPI es en sí mismo un marco asíncrono. Para alinear todos los recursos de Milvus, decidimos adoptar un único conjunto de herramientas de desarrollo y software tanto para Milvus Bootcamp como para las demos de Milvus. Como resultado, cambiamos el framework de Flask a FastAPI.</p>
<h3 id="4-Automatic-interactive-documents" class="common-anchor-header">4. Documentos interactivos automáticos</h3><p>De forma tradicional, cuando terminas de escribir el código para el lado del servidor, tienes que escribir un documento adicional para crear una interfaz, y luego utilizar herramientas como <a href="https://www.postman.com/">Postman</a> para las pruebas y depuración de la API. Entonces, ¿qué pasa si sólo quiere empezar rápidamente con la parte de desarrollo del lado del servidor web de los proyectos en Milvus Bootcamp sin escribir código adicional para crear una interfaz? FastAPI es la solución. Al proporcionar un documento OpenAPI, FastAPI puede ahorrarle la molestia de probar o depurar las API y colaborar con los equipos de front-end para desarrollar una interfaz de usuario. Con FastAPI, aún puede probar rápidamente la aplicación construida con una interfaz automática pero intuitiva sin esfuerzos adicionales para la codificación.</p>
<h3 id="5-User-friendliness" class="common-anchor-header">5. Facilidad de uso</h3><p>FastAPI es más fácil de usar y desarrollar, lo que le permite prestar más atención a la implementación específica del proyecto en sí. Sin dedicar demasiado tiempo al desarrollo de frameworks web, puede centrarse más en la comprensión de los proyectos en Milvus Bootcamp.</p>
<h2 id="Recap" class="common-anchor-header">Recapitulemos<button data-href="#Recap" class="anchor-icon" translate="no">
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
    </button></h2><p>Flask y FlastAPI tienen sus propios pros y contras. Como marco de aplicaciones web emergente, FlastAPI, en su núcleo, se basa en conjuntos de herramientas y bibliotecas maduras, Starlette y Pydantic. FastAPI es un framework asíncrono de alto rendimiento. Su destreza, extensibilidad y soporte para la verificación automática de tipos de datos, junto con muchas otras potentes características, nos impulsaron a adoptar FastAPI como el framework para los proyectos Milvus Bootcamp.</p>
<p>Tenga en cuenta que debe elegir el marco adecuado según el escenario de su aplicación si desea construir un sistema de búsqueda de similitud vectorial en producción.</p>
<h2 id="About-the-author" class="common-anchor-header">Sobre el autor<button data-href="#About-the-author" class="anchor-icon" translate="no">
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
    </button></h2><p>Yunmei Li, ingeniera de datos de Zilliz, se licenció en informática por la Universidad de Ciencia y Tecnología de Huazhong. Desde que se unió a Zilliz, ha estado trabajando en la exploración de soluciones para el proyecto de código abierto Milvus y ayudando a los usuarios a aplicar Milvus en escenarios del mundo real. Su principal interés se centra en la PNL y los sistemas de recomendación, y le gustaría profundizar aún más en estas dos áreas. Le gusta pasar tiempo a solas y leer.</p>
<h2 id="Looking-for-more-resources" class="common-anchor-header">¿Buscas más recursos?<button data-href="#Looking-for-more-resources" class="anchor-icon" translate="no">
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
<li><p>Comience a construir sistemas de IA con Milvus y obtenga más experiencia práctica leyendo nuestros tutoriales.</p>
<ul>
<li><a href="https://milvus.io/blog/2021-10-10-milvus-helps-analys-vedios.md">¿Qué es? ¿Quién es? Milvus ayuda a analizar vídeos de forma inteligente</a></li>
<li><a href="https://milvus.io/blog/2021-09-26-onnx.md">Combinar modelos de IA para la búsqueda de imágenes utilizando ONNX y Milvus</a></li>
<li><a href="https://milvus.io/blog/dna-sequence-classification-based-on-milvus.md">Clasificación de secuencias de ADN basada en Milvus</a></li>
<li><a href="https://milvus.io/blog/audio-retrieval-based-on-milvus.md">Recuperación de audio basada en Milvus</a></li>
<li><a href="https://milvus.io/blog/building-video-search-system-with-milvus.md">4 pasos para crear un sistema de búsqueda de vídeos</a></li>
<li><a href="https://milvus.io/blog/building-intelligent-chatbot-with-nlp-and-milvus.md">Creación de un sistema inteligente de control de calidad con NLP y Milvus</a></li>
<li><a href="https://milvus.io/blog/molecular-structure-similarity-with-milvus.md">Acelerar el descubrimiento de nuevos fármacos</a></li>
</ul></li>
<li><p>Participe en nuestra comunidad de código abierto:</p>
<ul>
<li>Encuentre o contribuya a Milvus en <a href="https://bit.ly/307b7jC">GitHub</a>.</li>
<li>Interactúe con la comunidad a través <a href="https://bit.ly/3qiyTEk">del Foro</a>.</li>
<li>Conéctese con nosotros en <a href="https://bit.ly/3ob7kd8">Twitter</a>.</li>
</ul></li>
</ul>
