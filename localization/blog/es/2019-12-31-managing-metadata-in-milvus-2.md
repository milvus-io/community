---
id: managing-metadata-in-milvus-2.md
title: Campos de la tabla Tables
author: milvus
date: 2019-12-31T20:41:13.864Z
desc: Campos de la tabla de metadatos
cover: assets.zilliz.com/header_c65a2a523c.png
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/managing-metadata-in-milvus-2'
---
<custom-h1>Gestión de metadatos de Milvus (2)</custom-h1><p>En el último blog, mencionamos cómo ver sus metadatos utilizando MySQL o SQLite. Este artículo pretende principalmente presentar en detalle los campos de las tablas de metadatos.</p>
<h2 id="Fields-in-the-codeTablescode-table" class="common-anchor-header">Campos de la tabla <code translate="no">Tables</code> <button data-href="#Fields-in-the-codeTablescode-table" class="anchor-icon" translate="no">
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
    </button></h2><p>Tomemos SQLite como ejemplo. El siguiente resultado procede de la versión 0.5.0. En la versión 0.6.0 se han añadido algunos campos, que se presentarán más adelante. Hay una fila en <code translate="no">Tables</code> que especifica una tabla vectorial de 512 dimensiones con el nombre &lt;codetable_1</code>. Cuando se crea la tabla, <code translate="no">index_file_size</code> es 1024 MB, <code translate="no">engine_type</code> es 1 (FLAT), <code translate="no">nlist</code> es 16384, <code translate="no">metric_type</code> es 1 (distancia euclidiana L2). id es el identificador único de la tabla. <code translate="no">state</code> es el estado de la tabla con 0 indicando un estado normal. <code translate="no">created_on</code> es el tiempo de creación. <code translate="no">flag</code> es la bandera reservada para uso interno.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_image_1_be4ca78ccb.png" alt="1-image-1.png" class="doc-image" id="1-image-1.png" />
   </span> <span class="img-wrapper"> <span>1-image-1.png</span> </span></p>
<p>La siguiente tabla muestra los tipos de campo y las descripciones de los campos en <code translate="no">Tables</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_field_types_descriptions_milvus_metadata_d0b068c413.png" alt="2-field-types-descriptions-milvus-metadata.png" class="doc-image" id="2-field-types-descriptions-milvus-metadata.png" />
   </span> <span class="img-wrapper"> <span>2-tipos-de-campo-descripciones-milvus-metadata.png</span> </span></p>
<p>La partición de tablas se habilita en 0.6.0 con algunos campos nuevos, como <code translate="no">owner_table</code>，<code translate="no">partition_tag</code> y <code translate="no">version</code>. Una tabla vectorial, <code translate="no">table_1</code>, tiene una partición llamada <code translate="no">table_1_p1</code>, que también es una tabla vectorial. <code translate="no">partition_name</code> corresponde a <code translate="no">table_id</code>. Los campos de una tabla de partición se heredan de <code translate="no">owner table</code>, con el campo de la tabla propietaria especificando el nombre de la tabla propietaria y el campo <code translate="no">partition_tag</code> especificando la etiqueta de la partición.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_image_2_a2a8bbc9ae.png" alt="3-image-2.png" class="doc-image" id="3-image-2.png" />
   </span> <span class="img-wrapper"> <span>3-image-2.png</span> </span></p>
<p>La siguiente tabla muestra los nuevos campos en 0.6.0:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_new_fields_milvus_0_6_0_bb82bfaadf.png" alt="4-new-fields-milvus-0.6.0.png" class="doc-image" id="4-new-fields-milvus-0.6.0.png" />
   </span> <span class="img-wrapper"> <span>4-campos-nuevos-milvus-0.6.0.png</span> </span></p>
<h2 id="Fields-in-the-TableFiles-table" class="common-anchor-header">Campos de la tabla TableFiles<button data-href="#Fields-in-the-TableFiles-table" class="anchor-icon" translate="no">
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
    </button></h2><p>El siguiente ejemplo contiene dos archivos, ambos pertenecientes a la tabla de vectores <code translate="no">table_1</code>. El tipo de índice (<code translate="no">engine_type</code>) del primer archivo es 1 (FLAT); el estado del archivo (<code translate="no">file_type</code>) es 7 (copia de seguridad del archivo original); <code translate="no">file_size</code> es 411200113 bytes; el número de filas del vector es 200.000. El tipo de índice del segundo archivo es 2 (IVFLAT); el estado del archivo es 3 (archivo de índice). El segundo fichero es en realidad el índice del primer fichero. Introduciremos más información en próximos artículos.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_image_3_5e22c937ed.png" alt="5-image-3.png" class="doc-image" id="5-image-3.png" />
   </span> <span class="img-wrapper"> <span>5-imagen-3.png</span> </span></p>
<p>La siguiente tabla muestra los campos y las descripciones de <code translate="no">TableFiles</code>:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_field_types_descriptions_tablefile_7a7b57d715.png" alt="6-field-types-descriptions-tablefile.png" class="doc-image" id="6-field-types-descriptions-tablefile.png" />
   </span> <span class="img-wrapper"> <span>6-field-types-descriptions-tablefile.png</span> </span></p>
<h2 id="What’s-coming-next" class="common-anchor-header">Próximos artículos<button data-href="#What’s-coming-next" class="anchor-icon" translate="no">
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
    </button></h2><p>El próximo artículo le mostrará cómo utilizar SQLite para gestionar metadatos en Milvus. Esté atento.</p>
<p>Si tiene alguna pregunta, únase a nuestro <a href="https://join.slack.com/t/milvusio/shared_invite/enQtNzY1OTQ0NDI3NjMzLWNmYmM1NmNjOTQ5MGI5NDhhYmRhMGU5M2NhNzhhMDMzY2MzNDdlYjM5ODQ5MmE3ODFlYzU3YjJkNmVlNDQ2ZTk">canal de Slack o</a>envíe una incidencia al repositorio.</p>
<p>Repo de GitHub: https://github.com/milvus-io/milvus</p>
