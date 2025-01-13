---
id: 2021-10-22-apply-configuration-changes-on-milvus-2.md
title: >-
  Technical Sharing:Aplicar cambios de configuración en Milvus 2.0 utilizando
  Docker Compose
author: Jingjing
date: 2021-10-22T00:00:00.000Z
desc: Aprenda a aplicar cambios de configuración en Milvus 2.0
cover: assets.zilliz.com/Modify_configurations_f9162c5670.png
tag: Engineering
---
<custom-h1>Compartición técnica: Aplicar cambios de configuración en Milvus 2.0 utilizando Docker Compose</custom-h1><p><em>Jingjing Jia, ingeniera de datos de Zilliz, se licenció en Informática por la Universidad Xi'an Jiaotong. Tras unirse a Zilliz, trabaja principalmente en el preprocesamiento de datos, el despliegue de modelos de IA, la investigación tecnológica relacionada con Milvus y la ayuda a los usuarios de la comunidad a implementar escenarios de aplicación. Es muy paciente, le gusta comunicarse con los socios de la comunidad y disfruta escuchando música y viendo anime.</em></p>
<p>Como usuaria habitual de Milvus, estaba muy ilusionada con la nueva versión Milvus 2.0 RC. Según la introducción en el sitio web oficial, Milvus 2.0 parece superar a sus predecesores por un amplio margen. Tenía muchas ganas de probarlo.</p>
<p>Y lo hice.  Sin embargo, cuando realmente tuve en mis manos Milvus 2.0, me di cuenta de que no era capaz de modificar el archivo de configuración en Milvus 2.0 tan fácilmente como lo hice con Milvus 1.1.1. No podía cambiar el archivo de configuración dentro del contenedor docker de Milvus 2.0 iniciado con Docker Compose, e incluso forzar el cambio no tendría efecto. Más tarde, me enteré de que Milvus 2.0 RC era incapaz de detectar los cambios en el archivo de configuración después de la instalación. Y la futura versión estable solucionará este problema.</p>
<p>Después de haber probado diferentes enfoques, he encontrado una manera fiable de aplicar cambios a los archivos de configuración para Milvus 2.0 standalone &amp; cluster, y aquí está cómo.</p>
<p>Tenga en cuenta que todos los cambios en la configuración deben hacerse antes de reiniciar Milvus utilizando Docker Compose.</p>
<h2 id="Modify-configuration-file-in-Milvus-standalone" class="common-anchor-header">Modificar el archivo de configuración en Milvus standalone<button data-href="#Modify-configuration-file-in-Milvus-standalone" class="anchor-icon" translate="no">
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
    </button></h2><p>En primer lugar, tendrá que <a href="https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml">descargar</a> una copia del archivo <strong>milvus.yaml</strong> a su dispositivo local.</p>
<p>A continuación, puede cambiar las configuraciones en el archivo. Por ejemplo, puede cambiar el formato del registro como <code translate="no">.json</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_1_ee4a16a3ee.png" alt="1.1.png" class="doc-image" id="1.1.png" />
   </span> <span class="img-wrapper"> <span>1.1.png</span> </span></p>
<p>Una vez modificado el archivo <strong>milvus</strong>.yaml, también tendrá que <a href="https://github.com/milvus-io/milvus/blob/master/deployments/docker/standalone/docker-compose.yml">descargar</a> y modificar en archivo <strong>docker-compose.yaml</strong> para standalone mapeando la ruta local a milvus.yaml en la correspondiente ruta del contenedor docker al archivo de configuración <code translate="no">/milvus/configs/milvus.yaml</code> en la sección <code translate="no">volumes</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_2_5e7c73708c.png" alt="1.2.png" class="doc-image" id="1.2.png" />
   </span> <span class="img-wrapper"> <span>1.2.png</span> </span></p>
<p>Por último, inicie Milvus standalone utilizando <code translate="no">docker-compose up -d</code> y compruebe si las modificaciones se han realizado correctamente. Por ejemplo, ejecute <code translate="no">docker logs</code> para comprobar el formato del registro.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_3_a0406df3ab.png" alt="1.3.png" class="doc-image" id="1.3.png" />
   </span> <span class="img-wrapper"> <span>1.3.png</span> </span></p>
<h2 id="Modify-configuration-file-in-Milvus-cluster" class="common-anchor-header">Modificar el archivo de configuración en el cluster Milvus<button data-href="#Modify-configuration-file-in-Milvus-cluster" class="anchor-icon" translate="no">
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
    </button></h2><p>En primer lugar, <a href="https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml">descargue</a> y modifique el archivo <strong>milvus.yaml</strong> para adaptarlo a sus necesidades.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_4_758b182846.png" alt="1.4.png" class="doc-image" id="1.4.png" />
   </span> <span class="img-wrapper"> <span>1.4.png</span> </span></p>
<p>A continuación, deberá <a href="https://github.com/milvus-io/milvus/blob/master/deployments/docker/cluster/docker-compose.yml">descargar</a> y modificar el archivo <strong>docker-compose.yml</strong> del clúster asignando la ruta local a <strong>milvus.yam</strong> l a la ruta correspondiente a los archivos de configuración de todos los componentes, es decir, coordenada raíz, coordenada de datos, nodo de datos, coordenada de consulta, nodo de consulta, coordenada de índice, nodo de índice y proxy.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_5_80e15811b8.png" alt="1.5.png" class="doc-image" id="1.5.png" />
   </span> <span class="img-wrapper"> <span>1.5.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_6_b2f3e4e47f.png" alt="1.6.png" class="doc-image" id="1.6.png" />
   </span> <span class="img-wrapper"> <span>1</span> </span>. <span class="img-wrapper"> <span>6.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_7_4d1eb5e1e5.png" alt="1.7.png" class="doc-image" id="1.7.png" /></span> <span class="img-wrapper">1 </span>. <span class="img-wrapper">7 <span>.png</span> </span></p>
<p>Por último, puede iniciar el clúster Milvus utilizando <code translate="no">docker-compose up -d</code> y comprobar si las modificaciones se han realizado correctamente.</p>
<h2 id="Change-log-file-path-in-configuration-file" class="common-anchor-header">Cambiar la ruta del archivo de registro en el archivo de configuración<button data-href="#Change-log-file-path-in-configuration-file" class="anchor-icon" translate="no">
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
    </button></h2><p>En primer lugar, <a href="https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml">descargue</a> el archivo <strong>milvus.yaml</strong> y cambie la sección <code translate="no">rootPath</code> como el directorio donde espera almacenar los archivos de registro en el contenedor Docker.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_8_e3bdc4843f.png" alt="1.8.png" class="doc-image" id="1.8.png" />
   </span> <span class="img-wrapper"> <span>1.8.png</span> </span></p>
<p>A continuación, descargue el archivo <strong>docker-compose.yml</strong> correspondiente para Milvus <a href="https://github.com/milvus-io/milvus/blob/master/deployments/docker/standalone/docker-compose.yml">standalone</a> o <a href="https://github.com/milvus-io/milvus/blob/master/deployments/docker/cluster/docker-compose.yml">cluster</a>.</p>
<p>Para el modo autónomo, deberá asignar la ruta local a <strong>milvus.yaml</strong> a la ruta correspondiente del contenedor Docker al archivo de configuración <code translate="no">/milvus/configs/milvus.yaml</code>, y asignar el directorio del archivo de registro local al directorio del contenedor Docker que creó anteriormente.</p>
<p>Para el cluster, necesitará mapear ambas rutas en cada componente.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_9_22d8929d92.png" alt="1.9.png" class="doc-image" id="1.9.png" />
   </span> <span class="img-wrapper"> <span>1.9.png</span> </span></p>
<p>Por último, inicie Milvus standalone o cluster utilizando <code translate="no">docker-compose up -d</code> y compruebe los archivos de registro para ver si la modificación se ha realizado correctamente.</p>
