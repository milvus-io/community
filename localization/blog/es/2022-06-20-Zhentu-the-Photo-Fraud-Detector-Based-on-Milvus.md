---
id: 2022-06-20-Zhentu-the-Photo-Fraud-Detector-Based-on-Milvus.md
title: 'Zhentu: el detector de fraudes fotográficos basado en Milvus'
author: 'Yan Shi, Minwei Tang'
date: 2022-06-20T00:00:00.000Z
desc: >-
  ¿Cómo está construido el sistema de detección de Zhentu con Milvus como motor
  de búsqueda de vectores?
cover: assets.zilliz.com/zhentu_0ae11c98ee.png
tag: Scenarios
tags: Use Cases of Milvus
canonicalUrl: >-
  https://milvus.io/blog/2022-06-20-Zhentu-the-Photo-Fraud-Detector-Based-on-Milvus.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/zhentu_0ae11c98ee.png" alt="cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>imagen de portada</span> </span></p>
<blockquote>
<p>Este artículo ha sido escrito por Yan Shi y Minwei Tang, ingenieros superiores de algoritmos de BestPay, y traducido por <a href="https://www.linkedin.cn/incareer/in/rosie-zhang-694528149">Rosie Zhang</a>.</p>
</blockquote>
<p>En los últimos años, a medida que el comercio electrónico y las transacciones en línea se han convertido en algo habitual en todo el mundo, también ha florecido el fraude en el comercio electrónico. Mediante el uso de fotos generadas por ordenador en lugar de las reales para pasar la verificación de identidad en las plataformas de negocios en línea, los estafadores crean cuentas falsas masivas y se aprovechan de las ofertas especiales de las empresas (por ejemplo, regalos de membresía, cupones, fichas), lo que conlleva pérdidas irrecuperables tanto para los consumidores como para las empresas.</p>
<p>Los métodos tradicionales de control de riesgos ya no son eficaces ante la gran cantidad de datos. Para resolver el problema, <a href="https://www.bestpay.com.cn">BestPay</a> creó un detector de fraudes fotográficos, denominado Zhentu (que significa detectar imágenes en chino), basado en tecnologías de aprendizaje profundo (DL) y procesamiento digital de imágenes (DIP). Zhentu es aplicable a varios escenarios que implican el reconocimiento de imágenes, y una rama importante es la identificación de licencias comerciales falsas. Si la foto de la licencia comercial enviada por un usuario es muy similar a otra foto ya existente en la biblioteca de fotos de una plataforma, es probable que el usuario haya robado la foto en algún lugar o haya falsificado una licencia con fines fraudulentos.</p>
<p>Los algoritmos tradicionales para medir la similitud de imágenes, como <a href="https://en.wikipedia.org/wiki/Peak_signal-to-noise_ratio">PSNR</a> y ORB, son lentos e imprecisos, solo aplicables a tareas offline. El aprendizaje profundo, en cambio, es capaz de procesar datos de imágenes a gran escala en tiempo real y es el método definitivo para emparejar imágenes similares. Con los esfuerzos conjuntos del equipo de I+D de BestPay y <a href="https://milvus.io/">la comunidad Milvus</a>, se desarrolla un sistema de detección de fraudes fotográficos como parte de Zhentu. Funciona convirtiendo cantidades masivas de datos de imágenes en vectores de características mediante modelos de aprendizaje profundo e insertándolos en <a href="https://milvus.io/">Milvus</a>, un motor de búsqueda vectorial. Con Milvus, el sistema de detección es capaz de indexar billones de vectores y recuperar eficientemente fotos similares entre decenas de millones de imágenes.</p>
<p><strong>Ir a:</strong></p>
<ul>
<li><a href="#an-overview-of-zhentu">Visión general de Zhentu</a></li>
<li><a href="#system-structure">Estructura del sistema</a></li>
<li><a href="#deployment"><strong>Despliegue</strong></a></li>
<li><a href="#real-world-performance"><strong>Rendimiento en el mundo real</strong></a></li>
<li><a href="#reference"><strong>Referencia</strong></a></li>
<li><a href="#about-bestpay"><strong>Acerca de BestPay</strong></a></li>
</ul>
<h2 id="An-overview-of-Zhentu" class="common-anchor-header">Una visión general de Zhentu<button data-href="#An-overview-of-Zhentu" class="anchor-icon" translate="no">
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
    </button></h2><p>Zhentu es un producto multimedia de control de riesgos visuales diseñado por BestPay y profundamente integrado con tecnologías de aprendizaje automático (ML) y de reconocimiento de imágenes mediante redes neuronales. Su algoritmo incorporado puede identificar con precisión a los defraudadores durante la autenticación del usuario y responder al nivel de milisegundos. Con su tecnología líder en el sector y su solución innovadora, Zhentu ha obtenido cinco patentes y dos derechos de autor de software. Actualmente se utiliza en varios bancos e instituciones financieras para ayudar a identificar con antelación posibles riesgos.</p>
<h2 id="System-structure" class="common-anchor-header">Estructura del sistema<button data-href="#System-structure" class="anchor-icon" translate="no">
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
    </button></h2><p>BestPay cuenta actualmente con más de 10 millones de fotos de licencias comerciales, y el volumen real sigue creciendo exponencialmente a medida que crece el negocio. Para recuperar rápidamente fotos similares de una base de datos tan grande, Zhentu ha elegido Milvus como motor de cálculo de similitud de vectores de características. La estructura general del sistema de detección de fraude fotográfico se muestra en el siguiente diagrama.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Structure_of_the_photo_fraud_detection_system_cf5d20d431.png" alt="img" class="doc-image" id="img" />
   </span> <span class="img-wrapper"> <span>img</span> </span></p>
<p>El procedimiento puede dividirse en cuatro pasos:</p>
<ol>
<li><p>Preprocesamiento de la imagen. El preprocesamiento, que incluye la reducción de ruido, la eliminación de ruido y la mejora del contraste, garantiza tanto la integridad de la información original como la eliminación de información inútil de la señal de la imagen.</p></li>
<li><p>Extracción de vectores de características. Se utiliza un modelo de aprendizaje profundo especialmente entrenado para extraer los vectores de características de la imagen. La conversión de las imágenes en vectores para la posterior búsqueda de similitudes es una operación rutinaria.</p></li>
<li><p>Normalización. La normalización de los vectores de características extraídos ayuda a mejorar la eficiencia del procesamiento posterior.</p></li>
<li><p>Búsqueda vectorial con Milvus. Inserción de los vectores de características normalizados en la base de datos Milvus para la búsqueda de similitud vectorial.</p></li>
</ol>
<h2 id="Deployment" class="common-anchor-header"><strong>Despliegue</strong><button data-href="#Deployment" class="anchor-icon" translate="no">
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
    </button></h2><p>A continuación se describe brevemente cómo se despliega el sistema de detección de fraude fotográfico de Zhentu.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_architecture_ea45a5ab53.png" alt="Milvus system architecture" class="doc-image" id="milvus-system-architecture" />
   </span> <span class="img-wrapper"> <span>Arquitectura del sistema Milvus</span> </span></p>
<p>Desplegamos nuestro <a href="https://milvus.io/docs/v2.0.x/install_cluster-helm.md">clúster Milvus en Kubernetes</a> para garantizar la alta disponibilidad y la sincronización en tiempo real de los servicios en la nube. Los pasos generales son los siguientes:</p>
<ol>
<li><p>Ver los recursos disponibles. Ejecute el comando <code translate="no">kubectl describe nodes</code> para ver los recursos que el clúster Kubernetes puede asignar a los casos creados.</p></li>
<li><p>Asignar recursos. Ejecute el comando <code translate="no">kubect`` -- apply xxx.yaml</code> para asignar recursos de memoria y CPU para los componentes del clúster Milvus utilizando Helm.</p></li>
<li><p>Aplique la nueva configuración. Ejecute el comando <code translate="no">helm upgrade my-release milvus/milvus --reuse-values -fresources.yaml</code>.</p></li>
<li><p>Aplique la nueva configuración al cluster Milvus. El clúster desplegado de esta forma no sólo nos permite ajustar la capacidad del sistema en función de las diferentes necesidades empresariales, sino que también satisface mejor los requisitos de alto rendimiento para la recuperación masiva de datos vectoriales.</p></li>
</ol>
<p>Puede <a href="https://milvus.io/docs/v2.0.x/configure-docker.md">configurar Milvus</a> para optimizar el rendimiento de la búsqueda para diferentes tipos de datos de diferentes escenarios empresariales, como se muestra en los dos ejemplos siguientes.</p>
<p>Al <a href="https://milvus.io/docs/v2.0.x/build_index.md">construir el índice vectorial</a>, parametrizamos el índice de acuerdo con el escenario real del sistema de la siguiente manera:</p>
<pre><code translate="no" class="language-Python">index = {<span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;IVF_PQ&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">2048</span>}, <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>}
<button class="copy-code-btn"></button></code></pre>
<p><a href="https://milvus.io/docs/v2.0.x/index.md#IVF_PQ">IVF_PQ</a> realiza la agrupación del índice IVF antes de cuantificar el producto de los vectores. Se caracteriza por una consulta de disco de alta velocidad y un consumo de memoria muy bajo, lo que satisface las necesidades de la aplicación real de Zhentu.</p>
<p>Además, establecemos los parámetros de búsqueda óptimos de la siguiente manera:</p>
<pre><code translate="no" class="language-Python">search_params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">32</span>}}
<button class="copy-code-btn"></button></code></pre>
<p>Como los vectores ya están normalizados antes de introducirlos en Milvus, se elige el producto interior (PI) para calcular la distancia entre dos vectores. Los experimentos han demostrado que la tasa de recuperación aumenta en torno a un 15% utilizando el PI en lugar de la distancia euclídea (L2).</p>
<p>Los ejemplos anteriores demuestran que podemos probar y configurar los parámetros de Milvus en función de diferentes escenarios empresariales y requisitos de rendimiento.</p>
<p>Además, Milvus no sólo integra diferentes bibliotecas de índices, sino que también admite diferentes tipos de índices y métodos de cálculo de similitud. Milvus también proporciona SDK oficiales en varios idiomas y API enriquecidas para la inserción, consulta, etc., lo que permite a nuestros grupos de negocio front-end utilizar los SDK para llamar a la central de control de riesgos.</p>
<h2 id="Real-world-performance" class="common-anchor-header"><strong>Rendimiento en el mundo real</strong><button data-href="#Real-world-performance" class="anchor-icon" translate="no">
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
    </button></h2><p>Hasta ahora, el sistema de detección de fraude fotográfico ha funcionado de manera constante, ayudando a las empresas a identificar a posibles defraudadores. En 2021, detectó más de 20.000 licencias falsas a lo largo del año. En términos de velocidad de consulta, una consulta de vector único entre decenas de millones de vectores tarda menos de 1 segundo, y el tiempo medio de consulta por lotes es inferior a 0,08 segundos. La búsqueda de alto rendimiento de Milvus satisface las necesidades de precisión y concurrencia de las empresas.</p>
<h2 id="Reference" class="common-anchor-header"><strong>Referencia</strong><button data-href="#Reference" class="anchor-icon" translate="no">
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
    </button></h2><p>Aglave P, Kolkure V S. Implementation of High Performance Feature Extraction Method Using Oriented Fast and Rotated Brief Algorithm[J]. Int. J. Res. Eng. Technol, 2015, 4: 394-397.</p>
<h2 id="About-BestPay" class="common-anchor-header"><strong>Acerca de BestPay</strong><button data-href="#About-BestPay" class="anchor-icon" translate="no">
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
    </button></h2><p>China Telecom BestPay Co, Ltd es una filial de propiedad total de China Telecom. Opera los negocios de pago y finanzas. BestPay se compromete a utilizar tecnologías de vanguardia como big data, inteligencia artificial y computación en la nube para potenciar la innovación empresarial, proporcionando productos inteligentes, soluciones de control de riesgos y otros servicios. Hasta enero de 2016, la app llamada BestPay ha atraído a más de 200 millones de usuarios y se ha convertido en el tercer operador de plataformas de pago en China, siguiendo de cerca a Alipay y WeChat Payment.</p>
