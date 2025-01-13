---
id: deep-dive-2-milvus-sdk-and-api.md
title: Introduction au SDK et à l'API Milvus Python
author: Xuan Yang
date: 2022-03-21T00:00:00.000Z
desc: >-
  Découvrez comment les SDK interagissent avec Milvus et pourquoi l'API de type
  ORM vous permet de mieux gérer Milvus.
cover: assets.zilliz.com/20220322_175856_e8e7bea7dc.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220322_175856_e8e7bea7dc.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Image de couverture</span> </span></p>
<p>Par <a href="https://github.com/XuanYang-cn">Xuan Yang</a></p>
<h2 id="Background" class="common-anchor-header">Contexte<button data-href="#Background" class="anchor-icon" translate="no">
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
    </button></h2><p>L'illustration suivante présente l'interaction entre les SDK et Milvus par le biais de gRPC. Imaginez que Milvus soit une boîte noire. Les tampons de protocole sont utilisés pour définir les interfaces du serveur et la structure des informations qu'ils transportent. Par conséquent, toutes les opérations effectuées dans la boîte noire Milvus sont définies par l'API de protocole.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/SDK_10c9673111.png" alt="Interaction" class="doc-image" id="interaction" />
   </span> <span class="img-wrapper"> <span>Interaction</span> </span></p>
<h2 id="Milvus-Protocol-API" class="common-anchor-header">API du protocole Milvus<button data-href="#Milvus-Protocol-API" class="anchor-icon" translate="no">
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
    </button></h2><p>L'API de protocole Milvus se compose de <code translate="no">milvus.proto</code>, <code translate="no">common.proto</code>, et <code translate="no">schema.proto</code>, qui sont des fichiers de tampons de protocole dont le suffixe est <code translate="no">.proto</code>. Pour garantir un fonctionnement correct, les SDK doivent interagir avec Milvus à l'aide de ces fichiers Protocol Buffers.</p>
<h3 id="milvusproto" class="common-anchor-header">milvus.proto</h3><p><code translate="no">milvus.proto</code> est le composant essentiel de l'API de protocole Milvus car il définit l'interface <code translate="no">MilvusService</code>, qui définit également toutes les interfaces RPC de Milvus.</p>
<p>L'exemple de code suivant montre l'interface <code translate="no">CreatePartitionRequest</code>. Elle possède deux paramètres principaux de type chaîne <code translate="no">collection_name</code> et <code translate="no">partition_name</code>, sur la base desquels vous pouvez lancer une requête de création de partition.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/code_d5f034d58d.png" alt="CreatePartitionRequest" class="doc-image" id="createpartitionrequest" />
   </span> <span class="img-wrapper"> <span>CreatePartitionRequest</span> </span></p>
<p>Consultez un exemple de protocole dans le <a href="https://github.com/milvus-io/milvus-proto/blob/44f59db22b27cc55e4168c8e53b6e781c010a713/proto/milvus.proto">dépôt PyMilvus GitHub</a> à la ligne 19.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/create_partition_938691f07f.png" alt="Example" class="doc-image" id="example" />
   </span> <span class="img-wrapper"> <span>Exemple</span> </span></p>
<p>Vous pouvez trouver la définition de <code translate="no">CreatePartitionRequest</code> ici.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220321_112254_4ec4f35bd3.png" alt="Definition" class="doc-image" id="definition" />
   </span> <span class="img-wrapper"> <span>Définition</span> </span></p>
<p>Les contributeurs qui souhaitent développer une fonctionnalité de Milvus ou un SDK dans un langage de programmation différent sont invités à trouver toutes les interfaces que Milvus offre via RPC.</p>
<h3 id="commonproto" class="common-anchor-header">common.proto</h3><p><code translate="no">common.proto</code> définit les types d'information communs, y compris <code translate="no">ErrorCode</code>, et <code translate="no">Status</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220321_112303_eaafc432a8.png" alt="common.proto" class="doc-image" id="common.proto" />
   </span> <span class="img-wrapper"> <span>common.proto</span> </span></p>
<h3 id="schemaproto" class="common-anchor-header">schema.proto</h3><p><code translate="no">schema.proto</code> définit le schéma dans les paramètres. L'exemple de code suivant est un exemple de <code translate="no">CollectionSchema</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220321_112313_df4ebe36e7.png" alt="schema.proto" class="doc-image" id="schema.proto" />
   </span> <span class="img-wrapper"> <span>schema.proto</span> </span></p>
<p><code translate="no">milvus.proto</code>Les interfaces common.proto, <code translate="no">common.proto</code> et <code translate="no">schema.proto</code> constituent ensemble l'API de Milvus, représentant toutes les opérations qui peuvent être appelées via RPC.</p>
<p>Si vous creusez dans le code source et observez attentivement, vous constaterez que lorsque des interfaces telles que <code translate="no">create_index</code> sont appelées, elles appellent en fait plusieurs interfaces RPC telles que <code translate="no">describe_collection</code> et <code translate="no">describe_index</code>. Une grande partie de l'interface extérieure de Milvus est une combinaison de plusieurs interfaces RPC.</p>
<p>Après avoir compris les comportements de RPC, vous pouvez développer de nouvelles fonctionnalités pour Milvus en les combinant. Vous êtes plus que bienvenus pour utiliser votre imagination et votre créativité et contribuer à la communauté Milvus.</p>
<h2 id="PyMilvus-20" class="common-anchor-header">PyMilvus 2.0<button data-href="#PyMilvus-20" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Object-relational-mapping-ORM" class="common-anchor-header">Mappage objet-relationnel (ORM)</h3><p>Pour résumer, le mapping objet-relationnel (ORM) fait référence au fait que lorsque vous opérez sur un objet local, ces opérations affectent l'objet correspondant sur le serveur. L'API de type ORM de PyMilvus présente les caractéristiques suivantes :</p>
<ol>
<li>Elle opère directement sur les objets.</li>
<li>Elle isole la logique du service et les détails de l'accès aux données.</li>
<li>Elle masque la complexité de la mise en œuvre et vous pouvez exécuter les mêmes scripts sur différentes instances Milvus, quelles que soient leurs approches de déploiement ou leur mise en œuvre.</li>
</ol>
<h3 id="ORM-style-API" class="common-anchor-header">API de type ORM</h3><p>L'une des caractéristiques essentielles de l'API de type ORM réside dans le contrôle de la connexion Milvus. Par exemple, vous pouvez spécifier des alias pour plusieurs serveurs Milvus et vous y connecter ou vous en déconnecter simplement avec leurs alias. Vous pouvez même supprimer l'adresse du serveur local et contrôler certains objets par le biais d'une connexion spécifique.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220321_112320_d5ff08a582.png" alt="Control Connection" class="doc-image" id="control-connection" />
   </span> <span class="img-wrapper"> <span>Contrôle de la connexion</span> </span></p>
<p>Une autre caractéristique de l'API de type ORM est que, après abstraction, toutes les opérations peuvent être effectuées directement sur les objets, y compris la collection, la partition et l'index.</p>
<p>Vous pouvez abstraire un objet de collection en récupérant un objet existant ou en en créant un nouveau. Vous pouvez également affecter une connexion Milvus à des objets spécifiques à l'aide d'un alias de connexion, afin de pouvoir opérer sur ces objets localement.</p>
<p>Pour créer un objet de partition, vous pouvez soit le créer avec son objet de collection parent, soit le faire de la même manière que lorsque vous créez un objet de collection. Ces méthodes peuvent également être employées pour un objet index.</p>
<p>Si ces objets de partition ou d'index existent, vous pouvez les obtenir par l'intermédiaire de leur objet de collection parent.</p>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">À propos de la série Deep Dive<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>Avec l'<a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">annonce officielle de la disponibilité générale</a> de Milvus 2.0, nous avons orchestré cette série de blogs Milvus Deep Dive afin de fournir une interprétation approfondie de l'architecture et du code source de Milvus. Les sujets abordés dans cette série de blogs sont les suivants</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Vue d'ensemble de l'architecture Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">API et SDK Python</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Traitement des données</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Gestion des données</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">Requête en temps réel</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">Moteur d'exécution scalaire</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">Système d'assurance qualité</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">Moteur d'exécution vectoriel</a></li>
</ul>
