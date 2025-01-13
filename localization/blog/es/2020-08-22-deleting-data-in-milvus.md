---
id: deleting-data-in-milvus.md
title: Para terminar
author: milvus
date: 2020-08-22T20:27:23.266Z
desc: >-
  En Milvus v0.7.0 hemos creado un diseño completamente nuevo para que la
  eliminación sea más eficiente y admita más tipos de índices.
cover: assets.zilliz.com/header_c9b45e546c.png
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/deleting-data-in-milvus'
---
<custom-h1>Cómo Milvus realiza la función de borrado</custom-h1><p>Este artículo trata de cómo Milvus implementa la función de borrado. Como característica muy esperada por muchos usuarios, la función de borrado se introdujo en Milvus v0.7.0. No llamamos remove_ids en FAISS directamente, en su lugar, se nos ocurrió un nuevo diseño para hacer la eliminación más eficiente y soportar más tipos de índices.</p>
<p>En <a href="https://medium.com/unstructured-data-service/how-milvus-implements-dynamic-data-update-and-query-d15e04a85e7d?source=friends_link&amp;sk=cc38bee61bc194f30324ed17e86886f3">How Milvus Realizes Dynamic Data Update and Query (Cómo Milvus realiza la actualización y consulta dinámica de datos</a>), introdujimos el proceso completo desde la inserción de datos hasta el vaciado de datos. Recapitulemos algunos de los aspectos básicos. MemManager gestiona todos los búferes de inserción, con cada MemTable correspondiente a una colección (cambiamos el nombre de "tabla" a "colección" en Milvus v0.7.0). Milvus divide automáticamente los datos insertados en la memoria en múltiples MemTableFiles. Cuando los datos se vuelcan al disco, cada MemTableFile se serializa en un archivo sin procesar. Hemos mantenido esta arquitectura al diseñar la función de borrado.</p>
<p>Definimos la función del método delete como la eliminación de todos los datos correspondientes a los ID de entidad especificados en una colección específica. Al desarrollar esta función, diseñamos dos escenarios. El primero consiste en borrar los datos que aún se encuentran en el búfer de inserción, y el segundo en borrar los datos que se han volcado al disco. El primer escenario es más intuitivo. Podemos encontrar el MemTableFile correspondiente al ID especificado, y borrar los datos en la memoria directamente (Figura 1). Dado que el borrado y la inserción de datos no pueden realizarse al mismo tiempo, y debido al mecanismo que cambia el MemTableFile de mutable a inmutable al volcar los datos, el borrado sólo se realiza en el buffer mutable. De esta forma, la operación de borrado no choca con el volcado de datos, garantizando así la consistencia de los datos.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_delete_request_milvus_fa1e7941da.jpg" alt="1-delete-request-milvus.jpg" class="doc-image" id="1-delete-request-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>1-solicitud-de-borrado-milvus.jpg</span> </span></p>
<p>El segundo escenario es más complejo pero más habitual, ya que en la mayoría de los casos los datos permanecen brevemente en el búfer de inserción antes de ser volcados al disco. Dado que es tan ineficiente cargar los datos volcados a la memoria para un borrado duro, decidimos optar por un borrado suave, un enfoque más eficiente. En lugar de borrar los datos, el borrado suave guarda los IDs borrados en un archivo separado. De este modo, podemos filtrar los ID eliminados durante las operaciones de lectura, como la búsqueda.</p>
<p>En cuanto a la implementación, tenemos que tener en cuenta varias cuestiones. En Milvus, los datos son visibles o, en otras palabras, recuperables, sólo cuando se vuelcan al disco. Por lo tanto, los datos volcados no se borran durante la llamada al método delete, sino en la siguiente operación de volcado. La razón es que los ficheros de datos que han sido volcados al disco ya no incluirán nuevos datos, por lo que el borrado suave no afecta a los datos que han sido volcados. Cuando se llama a borrar, se pueden borrar directamente los datos que todavía están en el buffer de inserción, mientras que para los datos volcados, es necesario registrar el ID de los datos borrados en la memoria. Al volcar los datos al disco, Milvus escribe el ID borrado en el fichero DEL para registrar qué entidad del segmento correspondiente se ha borrado. Estas actualizaciones sólo serán visibles una vez finalizada la descarga de datos. Este proceso se ilustra en la figura 2. Antes de la versión 0.7.0, sólo disponíamos de un mecanismo de descarga automática; es decir, Milvus serializa los datos en el búfer de inserción cada segundo. En nuestro nuevo diseño, hemos añadido un método flush que permite a los desarrolladores llamar después del método delete, asegurando que los datos recién insertados son visibles y los datos borrados ya no son recuperables.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_delete_request_milvus_c7fc97ef07.jpg" alt="2-delete-request-milvus.jpg" class="doc-image" id="2-delete-request-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>2-solicitud-de-borrado-milvus.jpg</span> </span></p>
<p>El segundo problema es que el archivo de datos brutos y el archivo de índice son dos archivos separados en Milvus, y dos registros independientes en los metadatos. Al borrar un ID especificado, necesitamos encontrar el archivo de datos brutos y el archivo de índice correspondientes al ID y registrarlos juntos. En consecuencia, introducimos el concepto de segmento. Un segmento contiene el fichero RAW (que incluye los ficheros vectoriales RAW y los ficheros ID), el fichero índice y el fichero DEL. El segmento es la unidad más básica para leer, escribir y buscar vectores en Milvus. Una colección (Figura 3) se compone de múltiples segmentos. Por lo tanto, hay múltiples carpetas de segmentos bajo una carpeta de colección en el disco. Como nuestros metadatos se basan en bases de datos relacionales (SQLite o MySQL), es muy sencillo registrar la relación dentro de un segmento, y la operación de borrado ya no requiere procesar por separado el archivo en bruto y el archivo de índice.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_delete_request_milvus_ee40340279.jpg" alt="3-delete-request-milvus.jpg" class="doc-image" id="3-delete-request-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>3-solicitud-de-borrado-milvus.jpg</span> </span></p>
<p>La tercera cuestión es cómo filtrar los datos borrados durante una búsqueda. En la práctica, el ID registrado por DEL es el desplazamiento de los datos correspondientes almacenados en el segmento. Dado que el segmento vaciado no incluye datos nuevos, el desplazamiento no cambiará. La estructura de datos de DEL es un mapa de bits en la memoria, donde un bit activo representa un desplazamiento borrado. También hemos actualizado FAISS en consecuencia: al buscar en FAISS, el vector correspondiente al bit activo ya no se incluirá en el cálculo de la distancia (Figura 4). Los cambios en FAISS no se tratarán en detalle aquí.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_delete_request_milvus_f5a29e25df.jpg" alt="4-delete-request-milvus.jpg" class="doc-image" id="4-delete-request-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>4-borrar-solicitud-milvus.jpg</span> </span></p>
<p>La última cuestión se refiere a la mejora del rendimiento. Al borrar datos borrados, primero hay que averiguar en qué segmento de la colección se encuentra el ID borrado y luego registrar su desplazamiento. Lo más sencillo es buscar todos los ID de cada segmento. La optimización en la que estamos pensando es añadir un filtro Bloom a cada segmento. El filtro Bloom es una estructura de datos aleatoria que se utiliza para comprobar si un elemento es miembro de un conjunto. Por lo tanto, podemos cargar sólo el filtro bloom de cada segmento. Sólo cuando el filtro bloom determina que el ID eliminado está en el segmento actual, podemos encontrar el desplazamiento correspondiente en el segmento; de lo contrario, podemos ignorar este segmento (Figura 5). Elegimos el filtro bloom porque utiliza menos espacio y es más eficiente en la búsqueda que muchos de sus homólogos, como las tablas hash. Aunque el filtro bloom tiene un cierto índice de falsos positivos, podemos reducir los segmentos que hay que buscar al número ideal para ajustar la probabilidad. Por otra parte, el filtro de floración también debe permitir la eliminación. De lo contrario, el ID de la entidad eliminada puede seguir apareciendo en el filtro de floración, lo que aumentaría la tasa de falsos positivos. Por este motivo, utilizamos el filtro de floración de recuento, ya que admite la eliminación. En este artículo no vamos a explicar en detalle cómo funciona el filtro de floración. Si está interesado, puede consultar la Wikipedia.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_delete_request_milvus_bd26633b55.jpg" alt="5-delete-request-milvus.jpg" class="doc-image" id="5-delete-request-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>5-solicitud-de-borrado-milvus.jpg</span> </span></p>
<h2 id="Wrapping-up" class="common-anchor-header">Para terminar<button data-href="#Wrapping-up" class="anchor-icon" translate="no">
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
    </button></h2><p>Hasta ahora, le hemos dado una breve introducción sobre cómo Milvus borra vectores por ID. Como ya sabe, utilizamos el borrado suave para eliminar los datos que se descargan. A medida que aumentan los datos borrados, necesitamos compactar los segmentos de la colección para liberar el espacio ocupado por los datos borrados. Además, si un segmento ya ha sido indexado, compactar también borra el archivo de índice anterior y crea nuevos índices. Por ahora, los desarrolladores deben llamar al método compact para compactar los datos. En el futuro, esperamos introducir un mecanismo de inspección. Por ejemplo, cuando la cantidad de datos borrados alcance un determinado umbral o la distribución de los datos haya cambiado después de un borrado, Milvus compactará automáticamente el segmento.</p>
<p>Ahora hemos introducido la filosofía de diseño detrás de la función de borrado y su implementación. Definitivamente hay margen de mejora, y cualquiera de sus comentarios o sugerencias son bienvenidos.</p>
<p>Conozca Milvus: https://github.com/milvus-io/milvus. También puede unirse a nuestra comunidad <a href="https://milvusio.slack.com/join/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ#/">Slack</a> para discusiones técnicas.</p>
