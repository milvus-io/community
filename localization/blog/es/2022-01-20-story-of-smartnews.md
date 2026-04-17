---
id: 2022-01-20-story-of-smartnews.md
title: 'La historia de SmartNews: de usuario de Milvus a colaborador activo'
author: Milvus
date: 2022-01-20T00:00:00.000Z
desc: 'Conozca la historia de SmartNews, usuario y colaborador de Milvus.'
cover: assets.zilliz.com/Smartnews_user_to_contributor_f219e6e008.png
tag: Scenarios
---
<p>Este artículo ha sido traducido por <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
<p>La información está en todas partes en nuestras vidas. Meta (antes conocida como Facebook), Instagram, Twitter y otras plataformas de medios sociales hacen que los flujos de información sean cada vez más ubicuos. Por ello, los motores que gestionan estos flujos de información se han convertido en un elemento imprescindible en la arquitectura de la mayoría de los sistemas. Sin embargo, como usuario de plataformas de medios sociales y aplicaciones relevantes, apuesto a que te habrán molestado los artículos, noticias, memes y demás duplicados. La exposición a contenidos duplicados dificulta el proceso de recuperación de información y da lugar a una mala experiencia de usuario.</p>
<p>Para un producto que se ocupa de flujos de información, es prioritario que los desarrolladores encuentren un procesador de datos flexible que pueda integrarse perfectamente en la arquitectura del sistema para desduplicar noticias o anuncios idénticos.</p>
<p><a href="https://www.smartnews.com/en/">SmartNews</a>, valorada en <a href="https://techcrunch.com/2021/09/15/news-aggregator-smartnews-raises-230-million-valuing-its-business-at-2-billion/">2.000 millones de dólares</a>, es la empresa de aplicaciones de noticias más valorada de Estados Unidos. Cabe destacar que antes era usuaria de Milvus, una base de datos vectorial de código abierto, pero más tarde se transformó en colaboradora activa del proyecto Milvus.</p>
<p>Este artículo cuenta la historia de SmartNews y explica por qué decidió contribuir al proyecto Milvus.</p>
<h2 id="An-overview-of-SmartNews" class="common-anchor-header">Visión general de SmartNews<button data-href="#An-overview-of-SmartNews" class="anchor-icon" translate="no">
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
    </button></h2><p>SmartNews, fundada en 2012, tiene su sede en Tokio (Japón). La aplicación de noticias desarrollada por SmartNews ha sido siempre <a href="https://www.businessinsider.com/guides/smartnews-free-news-app-2018-9">la mejor valorada</a> en el mercado japonés. SmartNews es la app de noticias de <a href="https://about.smartnews.com/en/2019/06/12/smartnews-builds-global-momentum-with-over-500-us-growth-new-executives-and-three-new-offices/">más rápido crecimiento</a> y también cuenta con <a href="https://about.smartnews.com/en/2018/07/21/smartnews-reaches-more-than-10-million-monthly-active-users-in-the-united-states-and-japan/">una alta viscosidad de usuarios</a> en el mercado estadounidense. Según las estadísticas de <a href="https://www.appannie.com/en/">APP Annie</a>, la duración media mensual de las sesiones de SmartNews ocupaba el primer lugar entre todas las aplicaciones de noticias a finales de julio de 2021, por encima de la duración acumulada de las sesiones de AppleNews y Google News.</p>
<p>Con el rápido crecimiento de la base de usuarios y la viscosidad, SmartNews tiene que enfrentarse a más retos en términos de mecanismo de recomendación y algoritmo de IA. Dichos retos incluyen la utilización de características discretas masivas en el aprendizaje automático (ML) a gran escala, la aceleración de la consulta de datos no estructurados con la búsqueda de similitud vectorial, etc.</p>
<p>A principios de 2021, el equipo del algoritmo de anuncios dinámicos de SmartNews solicitó al equipo de infraestructura de IA que optimizara las funciones de recuperación y consulta de anuncios. Tras dos meses de investigación, el ingeniero de infraestructura de IA Shu decidió utilizar Milvus, una base de datos vectorial de código abierto que admite múltiples índices y métricas de similitud y actualizaciones de datos en línea. Más de mil organizaciones de todo el mundo confían en Milvus.</p>
<h2 id="Advertisement-recommendation-powered-by-vector-similarity-search" class="common-anchor-header">Recomendación de anuncios mediante búsqueda vectorial de similitudes<button data-href="#Advertisement-recommendation-powered-by-vector-similarity-search" class="anchor-icon" translate="no">
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
    </button></h2><p>La base de datos vectorial de código abierto Milvus se utiliza en el sistema SmartNews Ad para buscar y recomendar a los usuarios anuncios dinámicos a partir de un conjunto de datos a escala de 10 millones de millones. De este modo, SmartNews puede crear una relación de correspondencia entre dos conjuntos de datos previamente incomparables: los datos de los usuarios y los datos de los anuncios. En el segundo trimestre de 2021, Shu consiguió desplegar Milvus 1.0 en Kubernetes. Más información sobre cómo <a href="https://milvus.io/docs">desplegar</a> Milvus.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image1_2a88ed162f.png" alt="img" class="doc-image" id="img" />
   </span> <span class="img-wrapper"> <span>img</span> </span></p>
<p>Tras el exitoso despliegue de Milvus 1.0, el primer proyecto en utilizar Milvus fue el proyecto de retirada de anuncios iniciado por el equipo de anuncios de SmartNews. Durante la fase inicial, el conjunto de datos de anuncios era a escala de un millón. Mientras tanto, la latencia P99 se controlaba estrictamente en menos de 10 milisegundos.</p>
<p>En junio de 2021, Shu y sus colegas del equipo de algoritmos aplicaron Milvus a más escenarios empresariales e intentaron la agregación de datos y la actualización de datos/índices en línea en tiempo real.</p>
<p>Por ahora, Milvus, la base de datos vectorial de código abierto, se ha utilizado en varios escenarios empresariales en SmartNews, incluida la recomendación de anuncios.</p>
<h2 id="From-a-user-to-an-active-contributor" class="common-anchor-header"><strong>De usuario a colaborador activo</strong><button data-href="#From-a-user-to-an-active-contributor" class="anchor-icon" translate="no">
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
    </button></h2><p>Durante la integración de Milvus en la arquitectura de productos de Smartnews, Shu y otros desarrolladores solicitaron funciones como la recarga en caliente, el TTL (tiempo de vida) de los artículos, la actualización/sustitución de artículos, etc. Estas funciones también son deseadas por muchos usuarios. También son funciones deseadas por muchos usuarios de la comunidad Milvus. Por lo tanto, Dennis Zhao, jefe del equipo de infraestructura de IA en SmartNews decidió desarrollar y contribuir con la función de recarga en caliente a la comunidad. Dennis creía que "el equipo de SmartNews se ha beneficiado de la comunidad Milvus, por lo tanto, estamos más que dispuestos a contribuir si tenemos algo que compartir con la comunidad."</p>
<p>La recarga de datos permite editar el código mientras se ejecuta. Con la ayuda de la recarga de datos, los desarrolladores ya no necesitan detenerse en un punto de interrupción o reiniciar la aplicación. En su lugar, pueden editar el código directamente y ver el resultado en tiempo real.</p>
<p>A finales de julio, Yusup, ingeniero de SmartNews, propuso la idea de utilizar <a href="https://milvus.io/docs/v2.0.x/collection_alias.md#Collection-Alias">alias de colecciones</a> para lograr la recarga en caliente.</p>
<p>La creación de alias de colección se refiere a la especificación de nombres de alias para una colección. Una colección puede tener varios alias. Sin embargo, un alias corresponde como máximo a una colección. Basta con establecer una analogía entre una colección y una taquilla. Un casillero, al igual que una colección, tiene su propio número y posición, que siempre permanecerán invariables. Sin embargo, siempre puedes meter y sacar cosas diferentes de la taquilla. Del mismo modo, el nombre de la colección es fijo, pero los datos de la colección son dinámicos. Siempre puede insertar o eliminar vectores en una colección, ya que la eliminación de datos está soportada en la <a href="https://milvus.io/docs/v2.0.x/release_notes.md#v200-PreGA">versión</a> Milvus <a href="https://milvus.io/docs/v2.0.x/release_notes.md#v200-PreGA">pre-GA</a>.</p>
<p>En el caso del negocio publicitario SmartNews, se insertan o actualizan cerca de 100 millones de vectores a medida que se generan nuevos vectores publicitarios dinámicos. Existen varias soluciones al respecto:</p>
<ul>
<li>Solución 1: borrar primero los datos antiguos e insertar los nuevos.</li>
<li>Solución 2: crear una nueva colección para los nuevos datos.</li>
<li>Solución 3: utilizar alias de colecciones.</li>
</ul>
<p>En el caso de la solución 1, uno de los inconvenientes más evidentes es que requiere mucho tiempo, sobre todo cuando el conjunto de datos que hay que actualizar es enorme. Por lo general, se tardan horas en actualizar un conjunto de datos a escala de 100 millones.</p>
<p>En cuanto a la solución 2, el problema es que la nueva colección no está disponible inmediatamente para la búsqueda. Es decir, una colección no se puede buscar durante la carga. Además, Milvus no permite que dos colecciones utilicen el mismo nombre de colección. Cambiar a una nueva colección siempre requeriría que los usuarios modificaran manualmente el código del lado del cliente. Es decir, los usuarios tendrían que revisar el valor del parámetro <code translate="no">collection_name</code> cada vez que necesitaran cambiar de una colección a otra.</p>
<p>La solución 3 sería la solución milagrosa. Sólo tiene que insertar los nuevos datos en una nueva colección y utilizar el alias de colección. De este modo, sólo tendrá que cambiar el alias de la colección cada vez que necesite cambiar de colección para realizar la búsqueda. No es necesario realizar esfuerzos adicionales para revisar el código. Esta solución le ahorra los problemas mencionados en las dos soluciones anteriores.</p>
<p>Yusup partió de esta petición y ayudó a todo el equipo de SmartNews a comprender la arquitectura de Milvus. Al cabo de un mes y medio, el proyecto Milvus recibió de Yusup un PR sobre la recarga en caliente. Y más tarde, esta función está oficialmente disponible junto con el lanzamiento de Milvus 2.0.0-RC7.</p>
<p>Actualmente, el equipo de infraestructura de IA está tomando la iniciativa para desplegar Milvus 2.0 y migrar todos los datos gradualmente de Milvus 1.0 a 2.0.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image2_96c064a627.png" alt="img_collection alias" class="doc-image" id="img_collection-alias" />
   </span> <span class="img-wrapper"> <span>img_collection alias</span> </span></p>
<p>La compatibilidad con el alias de colección puede mejorar enormemente la experiencia del usuario, especialmente para aquellas grandes empresas de Internet con grandes volúmenes de solicitudes de usuarios. Chenglong Li, ingeniero de datos de la comunidad Milvus, que ayudó a construir el puente entre Milvus y Smartnews, dijo: "La función de alias de colección surge de la petición real de negocio de SmartNews, un usuario de Milvus. Y SmartNews aportó el código a la comunidad Milvus. Este acto de reciprocidad es un gran ejemplo del espíritu del código abierto: de la comunidad y para la comunidad. Esperamos ver más colaboradores como SmartNews y construir conjuntamente una comunidad Milvus más próspera."</p>
<p>"Actualmente, parte del negocio publicitario está adoptando Milvus como base de datos vectorial offline. Se acerca el lanzamiento oficial de Mivus 2.0, y esperamos poder utilizar Milvus para construir sistemas más fiables y proporcionar servicios en tiempo real para más escenarios empresariales", dijo Dennis.</p>
<blockquote>
<p>Actualización: ¡Milvus 2.0 ya está disponible en general! <a href="/blog/es/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">Más información</a></p>
</blockquote>
