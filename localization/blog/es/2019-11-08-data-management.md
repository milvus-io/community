---
id: 2019-11-08-data-management.md
title: Cómo se realiza la gestión de datos en Milvus
author: Yihua Mo
date: 2019-11-08T00:00:00.000Z
desc: Este post presenta la estrategia de gestión de datos en Milvus.
cover: null
tag: Engineering
origin: null
---
<custom-h1>Gestión de datos en un buscador vectorial masivo</custom-h1><blockquote>
<p>Autor: Yihua Mo</p>
<p>Fecha: 2019-11-08</p>
</blockquote>
<h2 id="How-data-management-is-done-in-Milvus" class="common-anchor-header">Cómo se realiza la gestión de datos en Milvus<button data-href="#How-data-management-is-done-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>En primer lugar, algunos conceptos básicos de Milvus:</p>
<ul>
<li>Tabla: Tabla es un conjunto de datos de vectores, donde cada vector tiene un ID único. Cada vector y su ID representan una fila de la tabla. Todos los vectores de una tabla deben tener las mismas dimensiones. A continuación se muestra un ejemplo de una tabla con vectores de 10 dimensiones:</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/table.png" alt="table" class="doc-image" id="table" />
   </span> <span class="img-wrapper"> <span>tabla</span> </span></p>
<ul>
<li>Índice: La creación de índices es el proceso de agrupación de vectores mediante un algoritmo determinado, que requiere espacio adicional en disco. Algunos tipos de índices requieren menos espacio ya que simplifican y comprimen los vectores, mientras que otros tipos requieren más espacio que los vectores sin procesar.</li>
</ul>
<p>En Milvus, los usuarios pueden realizar tareas como crear una tabla, insertar vectores, crear índices, buscar vectores, recuperar información de la tabla, eliminar tablas, eliminar datos parciales de una tabla y eliminar índices, etc.</p>
<p>Supongamos que tenemos 100 millones de vectores de 512 dimensiones y necesitamos insertarlos y gestionarlos en Milvus para una búsqueda eficiente de vectores.</p>
<p><strong>(1) Inserción de vectores</strong></p>
<p>Veamos cómo se insertan los vectores en Milvus.</p>
<p>Como cada vector ocupa 2 KB de espacio, el espacio mínimo de almacenamiento para 100 millones de vectores es de unos 200 GB, lo que hace poco realista la inserción única de todos estos vectores. Es necesario que haya varios archivos de datos en lugar de uno. El rendimiento de la inserción es uno de los indicadores clave del rendimiento. Milvus admite la inserción única de cientos o incluso decenas de miles de vectores. Por ejemplo, la inserción única de 30.000 vectores de 512 dimensiones suele tardar sólo 1 segundo.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/insert.png" alt="insert" class="doc-image" id="insert" />
   </span> <span class="img-wrapper"> <span>inserción</span> </span></p>
<p>No todas las inserciones de vectores se cargan en disco. Milvus reserva un búfer mutable en la memoria de la CPU para cada tabla que se crea, donde los datos insertados pueden escribirse rápidamente. Y a medida que los datos en el buffer mutable alcanzan un cierto tamaño, este espacio será etiquetado como inmutable. Mientras tanto, se reservará un nuevo búfer mutable. Los datos del búfer inmutable se escriben regularmente en el disco y se libera la memoria de la CPU correspondiente. El mecanismo de escritura regular en disco es similar al utilizado en Elasticsearch, que escribe los datos almacenados en búfer en el disco cada 1 segundo. Además, los usuarios que estén familiarizados con LevelDB/RocksDB pueden ver aquí cierto parecido con MemTable.</p>
<p>Los objetivos del mecanismo de inserción de datos son</p>
<ul>
<li>La inserción de datos debe ser eficiente.</li>
<li>Los datos insertados pueden ser utilizados instantáneamente.</li>
<li>Los archivos de datos no deben estar demasiado fragmentados.</li>
</ul>
<p><strong>(2) Fichero de datos sin procesar</strong></p>
<p>Cuando los vectores se escriben en el disco, se guardan en un archivo de datos brutos que los contiene. Como ya se ha mencionado, los vectores a gran escala deben guardarse y gestionarse en varios archivos de datos. El tamaño de los datos insertados varía, ya que los usuarios pueden insertar 10 vectores o 1 millón de vectores a la vez. Sin embargo, la operación de escritura en disco se ejecuta una vez cada 1 segundo. Así, se generan ficheros de datos de distintos tamaños.</p>
<p>Los ficheros de datos fragmentados no son cómodos de gestionar ni de fácil acceso para la búsqueda de vectores. Milvus fusiona constantemente estos pequeños ficheros de datos hasta que el tamaño del fichero fusionado alcanza un tamaño determinado, por ejemplo, 1GB. Este tamaño concreto puede configurarse en el parámetro de la API <code translate="no">index_file_size</code> en la creación de tablas. Por lo tanto, 100 millones de vectores de 512 dimensiones se distribuirán y guardarán en unos 200 archivos de datos.</p>
<p>Teniendo en cuenta los escenarios de cálculo incremental, en los que los vectores se insertan y buscan simultáneamente, debemos asegurarnos de que una vez que los vectores se escriben en el disco, están disponibles para la búsqueda. Así, antes de que se fusionen los archivos de datos pequeños, se puede acceder a ellos y realizar búsquedas. Una vez finalizada la fusión, se eliminarán los archivos de datos pequeños y, en su lugar, se utilizarán para la búsqueda los archivos recién fusionados.</p>
<p>Este es el aspecto de los ficheros consultados antes de la fusión:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/rawdata1.png" alt="rawdata1" class="doc-image" id="rawdata1" />
   </span> <span class="img-wrapper"> <span>rawdata1</span> </span></p>
<p>Archivos consultados después de la fusión:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/rawdata2.png" alt="rawdata2" class="doc-image" id="rawdata2" />
   </span> <span class="img-wrapper"> <span>rawdata2</span> </span></p>
<p><strong>(3) Fichero índice</strong></p>
<p>La búsqueda basada en el archivo de datos brutos es una búsqueda de fuerza bruta que compara las distancias entre los vectores de consulta y los vectores de origen, y calcula los k vectores más cercanos. La búsqueda por fuerza bruta es ineficaz. La eficacia de la búsqueda puede aumentar considerablemente si se basa en un archivo de índices en el que se indexan los vectores. La creación de índices requiere espacio adicional en disco y suele llevar mucho tiempo.</p>
<p>¿Cuáles son las diferencias entre los archivos de datos brutos y los archivos de índice? En pocas palabras, el archivo de datos sin procesar registra todos los vectores junto con su ID único, mientras que el archivo de índice registra los resultados de la agrupación de vectores, como el tipo de índice, los centroides de los clústeres y los vectores de cada clúster.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/indexfile.png" alt="indexfile" class="doc-image" id="indexfile" />
   </span> <span class="img-wrapper"> <span>archivo de índice</span> </span></p>
<p>En términos generales, el archivo de índice contiene más información que el archivo de datos sin procesar, pero su tamaño es mucho menor, ya que los vectores se simplifican y cuantizan durante el proceso de creación del índice (para determinados tipos de índice).</p>
<p>Las tablas recién creadas se buscan por defecto mediante cálculo bruto. Una vez creado el índice en el sistema, Milvus construirá automáticamente el índice para los archivos fusionados que alcancen el tamaño de 1 GB en un hilo independiente. Cuando finaliza la construcción del índice, se genera un nuevo archivo de índice. Los archivos de datos sin procesar se archivarán para la construcción de índices basados en otros tipos de índices.</p>
<p>Milvus construye automáticamente el índice para los ficheros que alcanzan 1 GB:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/buildindex.png" alt="buildindex" class="doc-image" id="buildindex" />
   </span> <span class="img-wrapper"> <span>buildindex</span> </span></p>
<p>Construcción del índice completada:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/indexcomplete.png" alt="indexcomplete" class="doc-image" id="indexcomplete" />
   </span> <span class="img-wrapper"> <span>indexcomplete</span> </span></p>
<p>El índice no se creará automáticamente para los ficheros de datos brutos que no alcancen 1 GB, lo que puede ralentizar la velocidad de búsqueda. Para evitar esta situación, debe forzar manualmente la construcción del índice para esta tabla.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/forcebuild.png" alt="forcebuild" class="doc-image" id="forcebuild" />
   </span> <span class="img-wrapper"> <span>forzar creación</span> </span></p>
<p>Después de forzar la creación del índice para el archivo, el rendimiento de la búsqueda mejora considerablemente.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/indexfinal.png" alt="indexfinal" class="doc-image" id="indexfinal" />
   </span> <span class="img-wrapper"> <span>indexfinal</span> </span></p>
<p><strong>(4) Metadatos</strong></p>
<p>Como se ha mencionado anteriormente, 100 millones de vectores de 512 dimensiones se guardan en 200 archivos de disco. Cuando se construye el índice para estos vectores, habría 200 archivos de índice adicionales, lo que hace que el número total de archivos sea de 400 (incluyendo tanto los archivos de disco como los archivos de índice). Se necesita un mecanismo eficaz para gestionar los metadatos (estados de los archivos y otra información) de estos archivos con el fin de comprobar los estados de los archivos, eliminarlos o crearlos.</p>
<p>El uso de bases de datos OLTP para gestionar esta información es una buena opción. Milvus autónomo utiliza SQLite para gestionar los metadatos, mientras que en el despliegue distribuido, Milvus utiliza MySQL. Cuando se inicia el servidor Milvus, se crean 2 tablas (a saber, 'Tables' y 'TableFiles') en SQLite/MySQL respectivamente. Tables" registra la información de las tablas y "TableFiles" registra la información de los archivos de datos y los archivos de índice.</p>
<p>Como se muestra en el diagrama de flujo siguiente, "Tables" contiene información de metadatos como el nombre de la tabla (table_id), la dimensión del vector (dimension), la fecha de creación de la tabla (created_on), el estado de la tabla (state), el tipo de índice (engine_type), el número de clusters vectoriales (nlist) y el método de cálculo de la distancia (metric_type).</p>
<p>Y 'TableFiles' contiene el nombre de la tabla a la que pertenece el archivo (table_id), el tipo de índice del archivo (engine_type), el nombre del archivo (file_id), el tipo de archivo (file_type), el tamaño del archivo (file_size), el número de filas (row_count) y la fecha de creación del archivo (created_on).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/Metadata.png" alt="metadata" class="doc-image" id="metadata" />
   </span> <span class="img-wrapper"> <span>metadatos</span> </span></p>
<p>Con estos metadatos se pueden ejecutar diversas operaciones. A continuación se ofrecen algunos ejemplos:</p>
<ul>
<li>Para crear una tabla, Meta Manager sólo necesita ejecutar una sentencia SQL: <code translate="no">INSERT INTO TABLES VALUES(1, 'table_2, 512, xxx, xxx, ...)</code>.</li>
<li>Para ejecutar la búsqueda vectorial en la tabla_2, Meta Manager ejecutará una consulta en SQLite/MySQL, que es una sentencia SQL de facto: <code translate="no">SELECT * FROM TableFiles WHERE table_id='table_2'</code> para recuperar la información de los ficheros de la tabla_2. A continuación, estos archivos serán cargados en memoria por el Programador de consultas para el cálculo de la búsqueda.</li>
<li>No está permitido borrar instantáneamente una tabla ya que puede haber consultas ejecutándose en ella. Por eso existen las opciones de borrado suave y borrado fuerte para una tabla. Cuando se elimina una tabla, se marca como "eliminación suave" y no se permite realizar más consultas o cambios en ella. Sin embargo, las consultas que se estaban ejecutando antes de la eliminación siguen en curso. Sólo cuando se hayan completado todas estas consultas previas al borrado, la tabla, junto con sus metadatos y archivos relacionados, se borrará definitivamente.</li>
</ul>
<p><strong>(5) Programador de consultas</strong></p>
<p>El siguiente gráfico muestra el proceso de búsqueda de vectores tanto en la CPU como en la GPU mediante la consulta de archivos (archivos de datos sin procesar y archivos de índice) que se copian y guardan en el disco, en la memoria de la CPU y en la memoria de la GPU para los topk vectores más similares.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/topkresult.png" alt="topkresult" class="doc-image" id="topkresult" />
   </span> <span class="img-wrapper"> <span>topkresult</span> </span></p>
<p>El algoritmo de programación de consultas mejora significativamente el rendimiento del sistema. La filosofía básica del diseño es lograr el mejor rendimiento de búsqueda mediante la máxima utilización de los recursos de hardware. A continuación se ofrece una breve descripción del programador de consultas, pero en el futuro se dedicará un artículo específico a este tema.</p>
<p>Llamamos "consulta fría" a la primera consulta sobre una tabla determinada, y "consulta caliente" a las consultas posteriores. Cuando se realiza la primera consulta contra una tabla dada, Milvus realiza mucho trabajo para cargar datos en la memoria de la CPU, y algunos datos en la memoria de la GPU, lo que consume mucho tiempo. En consultas posteriores, la búsqueda es mucho más rápida, ya que parte o la totalidad de los datos ya están en la memoria de la CPU, lo que ahorra el tiempo de lectura del disco.</p>
<p>Para acortar el tiempo de búsqueda de la primera consulta, Milvus proporciona la configuración Preload Table (<code translate="no">preload_table</code>) que permite la precarga automática de tablas en la memoria de la CPU al arrancar el servidor. Para una tabla que contiene 100 millones de vectores de 512 dimensiones, lo que equivale a 200 GB, la velocidad de búsqueda es la más rápida si hay suficiente memoria en la CPU para almacenar todos estos datos. Sin embargo, si la tabla contiene vectores a escala de miles de millones, a veces es inevitable liberar memoria de la CPU/GPU para añadir nuevos datos que no se consultan. Actualmente, utilizamos LRU (Latest Recently Used) como estrategia de sustitución de datos.</p>
<p>Como se muestra en el siguiente gráfico, supongamos que hay una tabla que tiene 6 archivos de índice almacenados en el disco. La memoria de la CPU sólo puede almacenar 3 archivos de índice, y la memoria de la GPU sólo 1 archivo de índice.</p>
<p>Cuando se inicia la búsqueda, se cargan 3 archivos de índice en la memoria de la CPU para la consulta. El primer archivo se liberará de la memoria de la CPU inmediatamente después de ser consultado. Mientras tanto, el cuarto archivo se carga en la memoria de la CPU. Del mismo modo, cuando se consulta un archivo en la memoria de la GPU, se libera al instante y se sustituye por un nuevo archivo.</p>
<p>El planificador de consultas gestiona principalmente dos conjuntos de colas de tareas: una cola se ocupa de la carga de datos y otra de la ejecución de búsquedas.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/queryschedule.png" alt="queryschedule" class="doc-image" id="queryschedule" />
   </span> <span class="img-wrapper"> <span>programador de consultas</span> </span></p>
<p><strong>(6) Reductor de resultados</strong></p>
<p>Hay 2 parámetros clave relacionados con la búsqueda vectorial: uno es "n", que significa n número de vectores objetivo; otro es "k", que significa los k vectores más similares. Los resultados de la búsqueda son en realidad n conjuntos de KVP (pares clave-valor), cada uno con k pares clave-valor. Como las consultas deben ejecutarse en cada fichero individual, ya sea un fichero de datos brutos o un fichero índice, se obtendrán n conjuntos de los k resultados más parecidos para cada fichero. Todos estos conjuntos de resultados se fusionan para obtener los conjuntos de resultados top-k de la tabla.</p>
<p>El siguiente ejemplo muestra cómo se combinan y reducen los conjuntos de resultados para la búsqueda vectorial en una tabla con 4 archivos de índice (n=2, k=3). Observe que cada conjunto de resultados tiene 2 columnas. La columna de la izquierda representa el id del vector y la columna de la derecha representa la distancia euclídea.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/resultreduce.png" alt="result" class="doc-image" id="result" />
   </span> <span class="img-wrapper"> <span>resultado</span> </span></p>
<p><strong>(7) Optimización futura</strong></p>
<p>A continuación se exponen algunas reflexiones sobre posibles optimizaciones de la gestión de datos.</p>
<ul>
<li>¿Qué pasaría si los datos en el búfer inmutable o incluso en el búfer mutable también se pudieran consultar instantáneamente? Actualmente, los datos del búfer inmutable no pueden consultarse hasta que se escriben en el disco. Algunos usuarios están más interesados en el acceso instantáneo a los datos tras su inserción.</li>
<li>Proporcionar una función de partición de tablas que permita al usuario dividir tablas muy grandes en particiones más pequeñas y ejecutar búsquedas vectoriales en una partición determinada.</li>
<li>Añadir a los vectores algunos atributos que puedan filtrarse. Por ejemplo, algunos usuarios sólo quieren buscar entre los vectores con determinados atributos. Es necesario recuperar los atributos de los vectores e incluso los vectores en bruto. Un posible enfoque es utilizar una base de datos KV como RocksDB.</li>
<li>Proporcionar una funcionalidad de migración de datos que permita la migración automática de datos obsoletos a otro espacio de almacenamiento. En algunos escenarios en los que los datos fluyen continuamente, es posible que los datos envejezcan. Como algunos usuarios sólo se interesan por los datos del mes más reciente y realizan búsquedas en ellos, los datos más antiguos pierden utilidad y consumen mucho espacio en disco. Un mecanismo de migración de datos ayuda a liberar espacio en disco para los nuevos datos.</li>
</ul>
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
    </button></h2><p>Este artículo presenta principalmente la estrategia de gestión de datos en Milvus. Próximamente se publicarán más artículos sobre el despliegue distribuido de Milvus, la selección de métodos de indexación vectorial y el programador de consultas. Permanezca atento.</p>
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
<li><a href="https://medium.com/@milvusio/milvus-metadata-management-1-6b9e05c06fb0">Gestión de metadatos de Milvus (1): Cómo visualizar metadatos</a></li>
<li><a href="https://medium.com/@milvusio/milvus-metadata-management-2-fields-in-the-metadata-table-3bf0d296ca6d">Gestión de metadatos de Milvus (2): Campos de la tabla de metadatos</a></li>
</ul>
