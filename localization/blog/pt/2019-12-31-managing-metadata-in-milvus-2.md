---
id: managing-metadata-in-milvus-2.md
title: Campos da tabela Tables
author: milvus
date: 2019-12-31T20:41:13.864Z
desc: Campos na tabela de metadados
cover: assets.zilliz.com/header_c65a2a523c.png
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/managing-metadata-in-milvus-2'
---
<custom-h1>Gestão de metadados Milvus (2)</custom-h1><p>No último blogue, mencionámos como visualizar os seus metadados utilizando MySQL ou SQLite. Este artigo pretende sobretudo apresentar em pormenor os campos das tabelas de metadados.</p>
<h2 id="Fields-in-the-codeTablescode-table" class="common-anchor-header">Campos da tabela <code translate="no">Tables</code> <button data-href="#Fields-in-the-codeTablescode-table" class="anchor-icon" translate="no">
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
    </button></h2><p>Tomemos o SQLite como exemplo. O resultado seguinte vem da versão 0.5.0. Alguns campos foram adicionados à versão 0.6.0, que serão apresentados mais tarde. Há uma linha em <code translate="no">Tables</code> especificando uma tabela vetorial de 512 dimensões com o nome &lt;codetable_1</code>. Quando a tabela é criada, <code translate="no">index_file_size</code> é 1024 MB, <code translate="no">engine_type</code> é 1 (FLAT), <code translate="no">nlist</code> é 16384, <code translate="no">metric_type</code> é 1 (distância euclidiana L2). id é o identificador único da tabela. <code translate="no">state</code> é o estado da tabela, com 0 a indicar um estado normal. <code translate="no">created_on</code> é a hora de criação. <code translate="no">flag</code> é a bandeira reservada para uso interno.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_image_1_be4ca78ccb.png" alt="1-image-1.png" class="doc-image" id="1-image-1.png" />
   </span> <span class="img-wrapper"> <span>1-image-1.png</span> </span></p>
<p>O quadro seguinte mostra os tipos de campo e as descrições dos campos em <code translate="no">Tables</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_field_types_descriptions_milvus_metadata_d0b068c413.png" alt="2-field-types-descriptions-milvus-metadata.png" class="doc-image" id="2-field-types-descriptions-milvus-metadata.png" />
   </span> <span class="img-wrapper"> <span>2-field-types-descriptions-milvus-metadata.png</span> </span></p>
<p>O particionamento de tabelas é ativado na versão 0.6.0 com alguns campos novos, incluindo <code translate="no">owner_table</code>，<code translate="no">partition_tag</code> e <code translate="no">version</code>. Uma tabela vetorial, <code translate="no">table_1</code>, tem uma partição chamada <code translate="no">table_1_p1</code>, que também é uma tabela vetorial. <code translate="no">partition_name</code> corresponde a <code translate="no">table_id</code>. Os campos de uma tabela de partição são herdados da tabela <code translate="no">owner table</code>, com o campo owner table a especificar o nome da tabela proprietária e o campo <code translate="no">partition_tag</code> a especificar a etiqueta da partição.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_image_2_a2a8bbc9ae.png" alt="3-image-2.png" class="doc-image" id="3-image-2.png" />
   </span> <span class="img-wrapper"> <span>3-image-2.png</span> </span></p>
<p>A tabela seguinte mostra os novos campos na versão 0.6.0:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_new_fields_milvus_0_6_0_bb82bfaadf.png" alt="4-new-fields-milvus-0.6.0.png" class="doc-image" id="4-new-fields-milvus-0.6.0.png" />
   </span> <span class="img-wrapper"> <span>4-novos-campos-milvus-0.6.0.png</span> </span></p>
<h2 id="Fields-in-the-TableFiles-table" class="common-anchor-header">Campos na tabela TableFiles<button data-href="#Fields-in-the-TableFiles-table" class="anchor-icon" translate="no">
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
    </button></h2><p>O exemplo seguinte contém dois ficheiros, ambos pertencentes à tabela de vectores <code translate="no">table_1</code>. O tipo de índice (<code translate="no">engine_type</code>) do primeiro ficheiro é 1 (FLAT); o estado do ficheiro (<code translate="no">file_type</code>) é 7 (cópia de segurança do ficheiro original); <code translate="no">file_size</code> é 411200113 bytes; o número de linhas do vetor é 200.000. O tipo de índice do segundo ficheiro é 2 (IVFLAT); o estado do ficheiro é 3 (ficheiro de índice). O segundo ficheiro é, na realidade, o índice do primeiro ficheiro. Introduziremos mais informações nos próximos artigos.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_image_3_5e22c937ed.png" alt="5-image-3.png" class="doc-image" id="5-image-3.png" />
   </span> <span class="img-wrapper"> <span>5-imagem-3.png</span> </span></p>
<p>A tabela seguinte mostra os campos e as descrições de <code translate="no">TableFiles</code>:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_field_types_descriptions_tablefile_7a7b57d715.png" alt="6-field-types-descriptions-tablefile.png" class="doc-image" id="6-field-types-descriptions-tablefile.png" />
   </span> <span class="img-wrapper"> <span>6-field-types-descriptions-tablefile.png</span> </span></p>
<h2 id="What’s-coming-next" class="common-anchor-header">O que vem a seguir<button data-href="#What’s-coming-next" class="anchor-icon" translate="no">
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
    </button></h2><p>O próximo artigo irá mostrar-lhe como utilizar o SQLite para gerir metadados no Milvus. Fique atento!</p>
<p>Qualquer dúvida, junte-se ao nosso <a href="https://join.slack.com/t/milvusio/shared_invite/enQtNzY1OTQ0NDI3NjMzLWNmYmM1NmNjOTQ5MGI5NDhhYmRhMGU5M2NhNzhhMDMzY2MzNDdlYjM5ODQ5MmE3ODFlYzU3YjJkNmVlNDQ2ZTk">canal Slack ou</a>arquive um problema no repo.</p>
<p>GitHub repo: https://github.com/milvus-io/milvus</p>
