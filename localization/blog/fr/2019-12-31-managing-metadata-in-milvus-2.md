---
id: managing-metadata-in-milvus-2.md
title: Champs de la table Tables
author: milvus
date: 2019-12-31T20:41:13.864Z
desc: Champs de la table des métadonnées
cover: assets.zilliz.com/header_c65a2a523c.png
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/managing-metadata-in-milvus-2'
---
<custom-h1>Gestion des métadonnées Milvus (2)</custom-h1><p>Dans le dernier blog, nous avons mentionné comment visualiser vos métadonnées en utilisant MySQL ou SQLite. Cet article vise principalement à présenter en détail les champs des tables de métadonnées.</p>
<h2 id="Fields-in-the-codeTablescode-table" class="common-anchor-header">Champs de la table <code translate="no">Tables</code> <button data-href="#Fields-in-the-codeTablescode-table" class="anchor-icon" translate="no">
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
    </button></h2><p>Prenons l'exemple de SQLite. Le résultat suivant provient de la version 0.5.0. Certains champs ont été ajoutés à la version 0.6.0 et seront présentés ultérieurement. Il y a une ligne dans <code translate="no">Tables</code> qui spécifie un tableau vectoriel de 512 dimensions avec le nom &lt;codetable_1</code>. Lorsque la table est créée, <code translate="no">index_file_size</code> vaut 1024 Mo, <code translate="no">engine_type</code> vaut 1 (FLAT), <code translate="no">nlist</code> vaut 16384, <code translate="no">metric_type</code> vaut 1 (distance euclidienne L2). id est l'identifiant unique de la table. <code translate="no">state</code> est l'état de la table, 0 indiquant un état normal. <code translate="no">created_on</code> est l'heure de création. <code translate="no">flag</code> est le drapeau réservé à l'usage interne.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_image_1_be4ca78ccb.png" alt="1-image-1.png" class="doc-image" id="1-image-1.png" />
   </span> <span class="img-wrapper"> <span>1-image-1.png</span> </span></p>
<p>Le tableau suivant présente les types de champs et les descriptions des champs de <code translate="no">Tables</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_field_types_descriptions_milvus_metadata_d0b068c413.png" alt="2-field-types-descriptions-milvus-metadata.png" class="doc-image" id="2-field-types-descriptions-milvus-metadata.png" />
   </span> <span class="img-wrapper"> <span>2-field-types-descriptions-milvus-metadata.png</span> </span></p>
<p>Le partitionnement des tables est activé dans la version 0.6.0 avec quelques nouveaux champs, dont <code translate="no">owner_table</code>，<code translate="no">partition_tag</code> et <code translate="no">version</code>. Une table vectorielle, <code translate="no">table_1</code>, possède une partition appelée <code translate="no">table_1_p1</code>, qui est également une table vectorielle. <code translate="no">partition_name</code> correspond à <code translate="no">table_id</code>. Les champs d'une table de partition sont hérités de la table <code translate="no">owner table</code>, le champ owner table spécifiant le nom de la table propriétaire et le champ <code translate="no">partition_tag</code> spécifiant la balise de la partition.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_image_2_a2a8bbc9ae.png" alt="3-image-2.png" class="doc-image" id="3-image-2.png" />
   </span> <span class="img-wrapper"> <span>3-image-2.png</span> </span></p>
<p>Le tableau suivant présente les nouveaux champs de la version 0.6.0 :</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_new_fields_milvus_0_6_0_bb82bfaadf.png" alt="4-new-fields-milvus-0.6.0.png" class="doc-image" id="4-new-fields-milvus-0.6.0.png" />
   </span> <span class="img-wrapper"> <span>4-nouveaux-champs-milvus-0.6.0.png</span> </span></p>
<h2 id="Fields-in-the-TableFiles-table" class="common-anchor-header">Champs de la table TableFiles<button data-href="#Fields-in-the-TableFiles-table" class="anchor-icon" translate="no">
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
    </button></h2><p>L'exemple suivant contient deux fichiers appartenant tous deux à la table vectorielle <code translate="no">table_1</code>. Le type d'index (<code translate="no">engine_type</code>) du premier fichier est 1 (FLAT) ; l'état du fichier (<code translate="no">file_type</code>) est 7 (sauvegarde du fichier original) ; <code translate="no">file_size</code> correspond à 411200113 octets ; le nombre de lignes du vecteur est 200 000. Le type d'index du deuxième fichier est 2 (IVFLAT) ; l'état du fichier est 3 (fichier d'index). Le deuxième fichier est en fait l'index du premier fichier. Nous présenterons plus d'informations dans les prochains articles.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_image_3_5e22c937ed.png" alt="5-image-3.png" class="doc-image" id="5-image-3.png" />
   </span> <span class="img-wrapper"> <span>5-image-3.png</span> </span></p>
<p>Le tableau suivant présente les champs et les descriptions de <code translate="no">TableFiles</code>:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_field_types_descriptions_tablefile_7a7b57d715.png" alt="6-field-types-descriptions-tablefile.png" class="doc-image" id="6-field-types-descriptions-tablefile.png" />
   </span> <span class="img-wrapper"> <span>6-field-types-descriptions-tablefile.png</span> </span></p>
<h2 id="What’s-coming-next" class="common-anchor-header">Prochaines étapes<button data-href="#What’s-coming-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Le prochain article vous montrera comment utiliser SQLite pour gérer les métadonnées dans Milvus. Restez à l'écoute !</p>
<p>Si vous avez des questions, n'hésitez pas à rejoindre notre <a href="https://join.slack.com/t/milvusio/shared_invite/enQtNzY1OTQ0NDI3NjMzLWNmYmM1NmNjOTQ5MGI5NDhhYmRhMGU5M2NhNzhhMDMzY2MzNDdlYjM5ODQ5MmE3ODFlYzU3YjJkNmVlNDQ2ZTk">canal Slack ou à</a>déposer un problème dans le repo.</p>
<p>Dépôt GitHub : https://github.com/milvus-io/milvus</p>
