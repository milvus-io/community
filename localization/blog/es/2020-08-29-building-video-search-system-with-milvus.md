---
id: building-video-search-system-with-milvus.md
title: Visión general del sistema
author: milvus
date: 2020-08-29T00:18:19.703Z
desc: Buscar vídeos por imagen con Milvus
cover: assets.zilliz.com/header_3a822736b3.gif
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/building-video-search-system-with-milvus'
---
<custom-h1>4 pasos para crear un sistema de búsqueda de vídeos</custom-h1><p>Como su nombre indica, la búsqueda de vídeos por imagen es el proceso de recuperar del repositorio vídeos que contengan fotogramas similares a la imagen de entrada. Uno de los pasos clave es convertir los vídeos en incrustaciones, es decir, extraer los fotogramas clave y convertir sus características en vectores. Ahora bien, algunos lectores curiosos se preguntarán cuál es la diferencia entre buscar un vídeo por imagen y buscar una imagen por imagen. De hecho, buscar los fotogramas clave en los vídeos es equivalente a buscar una imagen por imagen.</p>
<p>Si está interesado, puede consultar nuestro artículo anterior <a href="https://medium.com/unstructured-data-service/milvus-application-1-building-a-reverse-image-search-system-based-on-milvus-and-vgg-aed4788dd1ea">Milvus x VGG: Construcción de un sistema de recuperación de imágenes basado en el contenido</a>.</p>
<h2 id="System-overview" class="common-anchor-header">Visión general del sistema<button data-href="#System-overview" class="anchor-icon" translate="no">
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
    </button></h2><p>El siguiente diagrama ilustra el flujo de trabajo típico de un sistema de búsqueda de vídeo de este tipo.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_video_search_system_workflow_c68d658b93.png" alt="1-video-search-system-workflow.png" class="doc-image" id="1-video-search-system-workflow.png" />
   </span> <span class="img-wrapper"> <span>1-flujo-de-trabajo-del-sistema-de-búsqueda-de-vídeos.png</span> </span></p>
<p>Cuando importamos vídeos, utilizamos la biblioteca OpenCV para cortar cada vídeo en fotogramas, extraer vectores de los fotogramas clave utilizando el modelo de extracción de características de imagen VGG y, a continuación, insertar los vectores extraídos (embeddings) en Milvus. Utilizamos Minio para almacenar los vídeos originales y Redis para almacenar las correlaciones entre vídeos y vectores.</p>
<p>Cuando buscamos vídeos, utilizamos el mismo modelo VGG para convertir la imagen de entrada en un vector de características e insertarlo en Milvus para encontrar los vectores con mayor similitud. A continuación, el sistema recupera los vídeos correspondientes de Minio en su interfaz en función de las correlaciones en Redis.</p>
<h2 id="Data-preparation" class="common-anchor-header">Preparación de los datos<button data-href="#Data-preparation" class="anchor-icon" translate="no">
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
    </button></h2><p>En este artículo, utilizamos unos 100.000 archivos GIF de Tumblr como conjunto de datos de muestra para crear una solución integral de búsqueda de vídeos. Puedes utilizar tus propios repositorios de vídeo.</p>
<h2 id="Deployment" class="common-anchor-header">Implementación<button data-href="#Deployment" class="anchor-icon" translate="no">
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
    </button></h2><p>El código para construir el sistema de recuperación de vídeo en este artículo está en GitHub.</p>
<h3 id="Step-1-Build-Docker-images" class="common-anchor-header">Paso 1: Crear imágenes Docker.</h3><p>El sistema de recuperación de vídeo requiere Milvus v0.7.1 docker, Redis docker, Minio docker, la interfaz front-end docker, y la API back-end docker. Usted necesita construir la interfaz de front-end docker y la API back-end docker por sí mismo, mientras que usted puede tirar de los otros tres dockers directamente desde Docker Hub.</p>
<pre><code translate="no"># Get the video search code
$ git clone -b 0.10.0 https://github.com/JackLCL/search-video-demo.git

# Build front-end interface docker and api docker images
$ cd search-video-demo &amp; make all
</code></pre>
<h2 id="Step-2-Configure-the-environment" class="common-anchor-header">Paso 2: Configurar el entorno.<button data-href="#Step-2-Configure-the-environment" class="anchor-icon" translate="no">
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
    </button></h2><p>Aquí utilizamos docker-compose.yml para gestionar los cinco contenedores mencionados. Consulte la siguiente tabla para la configuración de docker-compose.yml:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_configure_docker_compose_yml_a33329e5e9.png" alt="2-configure-docker-compose-yml.png" class="doc-image" id="2-configure-docker-compose-yml.png" />
   </span> <span class="img-wrapper"> <span>2-configurar-docker-compose-yml.png</span> </span></p>
<p>La dirección IP 192.168.1.38 en la tabla anterior es la dirección del servidor especialmente para construir el sistema de recuperación de vídeo en este artículo. Necesitas actualizarla a tu dirección de servidor.</p>
<p>Necesitas crear manualmente directorios de almacenamiento para Milvus, Redis y Minio, y luego añadir las rutas correspondientes en docker-compose.yml. En este ejemplo, hemos creado los siguientes directorios:</p>
<pre><code translate="no">/mnt/redis/data /mnt/minio/data /mnt/milvus/db
</code></pre>
<p>Puede configurar Milvus, Redis y Minio en docker-compose.yml de la siguiente manera:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_configure_milvus_redis_minio_docker_compose_yml_4a8104d53e.png" alt="3-configure-milvus-redis-minio-docker-compose-yml.png" class="doc-image" id="3-configure-milvus-redis-minio-docker-compose-yml.png" />
   </span> <span class="img-wrapper"> <span>3-configure-milvus-redis-minio-docker-compose-yml.png</span> </span></p>
<h2 id="Step-3-Start-the-system" class="common-anchor-header">Paso 3: Inicie el sistema.<button data-href="#Step-3-Start-the-system" class="anchor-icon" translate="no">
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
    </button></h2><p>Utilice el docker-compose.yml modificado para iniciar los cinco contenedores docker que se utilizarán en el sistema de recuperación de vídeo:</p>
<pre><code translate="no">$ docker-compose up -d
</code></pre>
<p>A continuación, puede ejecutar docker-compose ps para comprobar si los cinco contenedores docker se han iniciado correctamente. La siguiente captura de pantalla muestra una interfaz típica después de un arranque correcto.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_sucessful_setup_f2b3006487.png" alt="4-sucessful-setup.png" class="doc-image" id="4-sucessful-setup.png" />
   </span> <span class="img-wrapper"> <span>4-sucessful-setup.png</span> </span></p>
<p>Ahora, has construido con éxito un sistema de búsqueda de vídeos, aunque la base de datos no tiene vídeos.</p>
<h2 id="Step-4-Import-videos" class="common-anchor-header">Paso 4: Importar vídeos.<button data-href="#Step-4-Import-videos" class="anchor-icon" translate="no">
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
    </button></h2><p>En el directorio deploy del repositorio del sistema, se encuentra import_data.py, script para importar vídeos. Sólo es necesario actualizar la ruta a los archivos de vídeo y el intervalo de importación para ejecutar el script.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_update_path_video_5065928961.png" alt="5-update-path-video.png" class="doc-image" id="5-update-path-video.png" />
   </span> <span class="img-wrapper"> <span>5-actualizar-ruta-video.png</span> </span></p>
<p>ruta_datos: La ruta de los vídeos a importar.</p>
<p>time.sleep(0.5): El intervalo en el que el sistema importa los vídeos. El servidor que utilizamos para construir el sistema de búsqueda de vídeos tiene 96 núcleos de CPU. Por lo tanto, se recomienda establecer el intervalo en 0,5 segundos. Ajuste el intervalo a un valor mayor si su servidor tiene menos núcleos de CPU. De lo contrario, el proceso de importación supondrá una carga para la CPU y creará procesos zombis.</p>
<p>Ejecuta import_data.py para importar los vídeos.</p>
<pre><code translate="no">$ cd deploy
$ python3 import_data.py
</code></pre>
<p>Una vez importados los vídeos, ¡ya tienes tu propio sistema de búsqueda de vídeos!</p>
<h2 id="Interface-display" class="common-anchor-header">Visualización de la interfaz<button data-href="#Interface-display" class="anchor-icon" translate="no">
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
    </button></h2><p>Abre tu navegador e introduce 192.168.1.38:8001 para ver la interfaz del sistema de búsqueda de vídeos como se muestra a continuación.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_video_search_interface_4c26d93e02.png" alt="6-video-search-interface.png" class="doc-image" id="6-video-search-interface.png" />
   </span> <span class="img-wrapper"> <span>6-video-search-interface.png</span> </span></p>
<p>Activa el interruptor de engranaje de la parte superior derecha para ver todos los vídeos del repositorio.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_view_all_videos_repository_26ff37cad5.png" alt="7-view-all-videos-repository.png" class="doc-image" id="7-view-all-videos-repository.png" />
   </span> <span class="img-wrapper"> <span>7-ver-todos-los-videos-repositorio.png</span> </span></p>
<p>Haz clic en el cuadro de carga de la parte superior izquierda para introducir una imagen de destino. Como se muestra a continuación, el sistema devuelve los vídeos que contienen los fotogramas más similares.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_enjoy_recommender_system_cats_bda1bf9db3.png" alt="8-enjoy-recommender-system-cats.png" class="doc-image" id="8-enjoy-recommender-system-cats.png" />
   </span> <span class="img-wrapper"> <span>8-disfruta-del-sistema-recomendador-gatos.png</span> </span></p>
<p>A continuación, ¡diviértete con nuestro sistema de búsqueda de vídeos!</p>
<h2 id="Build-your-own" class="common-anchor-header">Construye el tuyo propio<button data-href="#Build-your-own" class="anchor-icon" translate="no">
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
    </button></h2><p>En este artículo, hemos utilizado Milvus para construir un sistema de búsqueda de vídeos por imágenes. Esto ejemplifica la aplicación de Milvus en el procesamiento de datos no estructurados.</p>
<p>Milvus es compatible con múltiples marcos de aprendizaje profundo, y hace posible búsquedas en milisegundos para vectores a escala de miles de millones. No dude en llevar Milvus con usted a más escenarios de IA: https://github.com/milvus-io/milvus.</p>
<p>No seas un extraño, síguenos en <a href="https://twitter.com/milvusio/">Twitter</a> o únete a nosotros en <a href="https://milvusio.slack.com/join/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ#/">Slack</a>! 👇🏻</p>
