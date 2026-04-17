---
id: 2019-12-18-datafile-cleanup.md
title: Estrategia de borrado anterior y problemas relacionados
author: Yihua Mo
date: 2019-12-18T00:00:00.000Z
desc: >-
  Hemos mejorado la estrategia de eliminación de archivos para solucionar los
  problemas relacionados con las operaciones de consulta.
cover: null
tag: Engineering
---
<custom-h1>Mejoras del mecanismo de limpieza de archivos de datos</custom-h1><blockquote>
<p>autor: Yihua Mo</p>
<p>Fecha: 2019-12-18</p>
</blockquote>
<h2 id="Previous-delete-strategy-and-related-problems" class="common-anchor-header">Estrategia de borrado anterior y problemas relacionados<button data-href="#Previous-delete-strategy-and-related-problems" class="anchor-icon" translate="no">
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
    </button></h2><p>En <a href="/blog/es/2019-11-08-data-management.md">Managing Data in Massive-Scale Vector Search Engine</a>, mencionamos el mecanismo de borrado de archivos de datos. El borrado incluye el borrado suave y el borrado fuerte. Después de realizar una operación de borrado en una tabla, la tabla se marca como borrado suave. Las operaciones de búsqueda o actualización posteriores ya no están permitidas. Sin embargo, la operación de consulta que se inicia antes de la eliminación puede seguir ejecutándose. La tabla se elimina realmente, junto con los metadatos y otros archivos, sólo cuando finaliza la operación de consulta.</p>
<p>Entonces, ¿cuándo se borran realmente los ficheros marcados con soft-delete? Antes de la versión 0.6.0, la estrategia consistía en que un fichero se borraba realmente tras 5 minutos de borrado suave. La siguiente figura muestra la estrategia:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/datafile_clean/5mins.png" alt="5mins" class="doc-image" id="5mins" />
   </span> <span class="img-wrapper"> <span>5mins</span> </span></p>
<p>Esta estrategia se basa en la premisa de que las consultas normalmente no duran más de 5 minutos y no es fiable. Si una consulta dura más de 5 minutos, la consulta fallará. La razón es que cuando se inicia una consulta, Milvus recopila información sobre los ficheros en los que se puede buscar y crea tareas de consulta. A continuación, el programador de consultas carga los ficheros en memoria uno a uno y busca los ficheros uno a uno. Si al cargar un archivo éste ya no existe, la consulta fallará.</p>
<p>Ampliar el tiempo puede ayudar a reducir el riesgo de fallos en las consultas, pero también causa otro problema: el uso del disco es demasiado grande. La razón es que cuando se insertan grandes cantidades de vectores, Milvus combina continuamente archivos de datos y los archivos combinados no se eliminan inmediatamente del disco, aunque no se produzca ninguna consulta. Si la inserción de datos es demasiado rápida y/o la cantidad de datos insertados es demasiado grande, el uso extra de disco puede ascender a decenas de GBs. Consulte la siguiente figura como ejemplo:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/datafile_clean/5min_result.png" alt="result" class="doc-image" id="result" />
   </span> <span class="img-wrapper"> <span>resultado</span> </span></p>
<p>Como se muestra en la figura anterior, el primer lote de datos insertados (insert_1) se vuelca al disco y se convierte en file_1, luego insert_2 se convierte en file_2. El hilo responsable de la combinación de archivos combina los archivos en archivo_3. A continuación, el fichero_1 y el fichero_2 se marcan como borrados suaves. El tercer lote de datos de inserción se convierte en el fichero_4. El hilo combina el fichero_3 y el fichero_4 en el fichero_5 y marca el fichero_3 y el fichero_4 como borrado suave.</p>
<p>Del mismo modo, se combinan insert_6 e insert_5. En t3, el fichero_5 y el fichero_6 se marcan como borrado suave. Entre t3 y t4, aunque muchos ficheros se marcan como borrado suave, siguen en el disco. Los archivos se borran realmente después de t4. Así, entre t3 y t4, el uso del disco es de 64 + 64 + 128 + 64 + 196 + 64 + 256 = 836 MB. Los datos insertados son 64 + 64 + 64 + 64 = 256 MB. El uso del disco es 3 veces el tamaño de los datos insertados. Cuanto mayor sea la velocidad de escritura del disco, mayor será el uso del disco durante un periodo de tiempo específico.</p>
<h2 id="Improvements-of-the-delete-strategy-in-060" class="common-anchor-header">Mejoras de la estrategia de borrado en 0.6.0<button data-href="#Improvements-of-the-delete-strategy-in-060" class="anchor-icon" translate="no">
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
    </button></h2><p>Así, hemos cambiado la estrategia de borrado de ficheros en la v0.6.0. Hard-delete ya no utiliza el tiempo como disparador. En su lugar, el disparador es cuando el archivo no está en uso por ninguna tarea.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/datafile_clean/new_strategy.png" alt="newstrategy" class="doc-image" id="newstrategy" />
   </span> <span class="img-wrapper"> <span>nueva estrategia</span> </span></p>
<p>Supongamos que se insertan dos lotes de vectores. En t1 se da una petición de consulta, Milvus adquiere dos ficheros a consultar (fichero_1 y fichero_2, porque fichero_3 todavía no existe.) Entonces, el hilo del backend empieza a combinar los dos ficheros con la consulta ejecutándose al mismo tiempo. Cuando se genera el archivo_3, el archivo_1 y el archivo_2 se marcan como borrados suaves. Después de la consulta, ninguna otra tarea utilizará el archivo_1 y el archivo_2, por lo que se eliminarán en t4. El intervalo entre t2 y t4 es muy pequeño y depende del intervalo de la consulta. De este modo, los ficheros no utilizados se eliminarán a tiempo.</p>
<p>En cuanto a la implementación interna, el recuento de referencias, que resulta familiar a los ingenieros de software, se utiliza para determinar si un archivo puede ser hard-deleted. Para explicarlo mediante una comparación, cuando un jugador tiene vidas en una partida, puede seguir jugando. Cuando el número de vidas llega a 0, el juego termina. Milvus controla el estado de cada fichero. Cuando un fichero es utilizado por una tarea, se le añade una vida. Cuando el fichero deja de utilizarse, se le quita una vida. Cuando un archivo está marcado con soft-delete y el número de vidas es 0, el archivo está listo para hard-delete.</p>
<h2 id="Related-blogs" class="common-anchor-header">Blogs relacionados<button data-href="#Related-blogs" class="anchor-icon" translate="no">
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
<li><a href="/blog/es/2019-11-08-data-management.md">Gestión de datos en un buscador vectorial masivo</a></li>
<li><a href="https://milvus.io/blog/managing-metadata-in-milvus-1.md">Gestión de metadatos de Milvus (1): Cómo ver metadatos</a></li>
<li><a href="/blog/es/2019-12-27-meta-table.md">Gestión de metadatos de Milvus (2): Campos de la tabla de metadatos</a></li>
</ul>
