---
id: dynamic-data-update-and-query-milvus.md
title: Préparation
author: milvus
date: 2020-04-13T21:02:08.632Z
desc: La recherche de vecteurs est désormais plus intuitive et plus pratique
cover: assets.zilliz.com/header_62d7b8c823.png
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/dynamic-data-update-and-query-milvus'
---
<custom-h1>Comment Milvus met en œuvre la mise à jour et l'interrogation dynamiques des données</custom-h1><p>Dans cet article, nous décrirons principalement comment les données vectorielles sont enregistrées dans la mémoire de Milvus et comment ces enregistrements sont maintenus.</p>
<p>Voici nos principaux objectifs en matière de conception :</p>
<ol>
<li>L'efficacité de l'importation des données doit être élevée.</li>
<li>Les données peuvent être visualisées dès que possible après leur importation.</li>
<li>Éviter la fragmentation des fichiers de données.</li>
</ol>
<p>Par conséquent, nous avons créé un tampon de mémoire (tampon d'insertion) pour insérer les données afin de réduire le nombre de changements de contexte des entrées-sorties aléatoires sur le disque et le système d'exploitation afin d'améliorer les performances de l'insertion des données. L'architecture de stockage de la mémoire basée sur MemTable et MemTableFile nous permet de gérer et de sérialiser les données de manière plus pratique. L'état de la mémoire tampon est divisé entre Mutable et Immutable, ce qui permet aux données d'être persistées sur le disque tout en maintenant les services externes disponibles.</p>
<h2 id="Preparation" class="common-anchor-header">Préparation<button data-href="#Preparation" class="anchor-icon" translate="no">
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
    </button></h2><p>Lorsque l'utilisateur est prêt à insérer un vecteur dans Milvus, il doit d'abord créer une collection (* Milvus renomme Table en Collection dans la version 0.7.0). La collection est l'unité de base pour l'enregistrement et la recherche de vecteurs dans Milvus.</p>
<p>Chaque collection a un nom unique et certaines propriétés qui peuvent être définies, et les vecteurs sont insérés ou recherchés en fonction du nom de la collection. Lors de la création d'une nouvelle collection, Milvus enregistre les informations relatives à cette collection dans les métadonnées.</p>
<h2 id="Data-Insertion" class="common-anchor-header">Insertion de données<button data-href="#Data-Insertion" class="anchor-icon" translate="no">
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
    </button></h2><p>Lorsque l'utilisateur envoie une demande d'insertion de données, les données sont sérialisées et désérialisées pour atteindre le serveur Milvus. Les données sont alors écrites dans la mémoire. L'écriture en mémoire se divise grosso modo en plusieurs étapes :</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_data_insertion_milvus_99448bae50.png" alt="2-data-insertion-milvus.png" class="doc-image" id="2-data-insertion-milvus.png" />
   </span> <span class="img-wrapper"> <span>2-data-insertion-milvus.png</span> </span></p>
<ol>
<li>Dans MemManager, trouver ou créer une nouvelle MemTable correspondant au nom de la Collection. Chaque MemTable correspond à un tampon de collection en mémoire.</li>
<li>Un MemTable contient un ou plusieurs MemTableFile. Chaque fois que nous créons un nouveau fichier MemTableFile, nous enregistrons simultanément cette information dans le Meta. Nous divisons les MemTableFile en deux états : Mutable et Immuable. Lorsque la taille du fichier MemTableFile atteint le seuil fixé, il devient immuable. Chaque table de mémoire ne peut avoir qu'une seule table de mémoire mutable à écrire à tout moment.</li>
<li>Les données de chaque fichier MemTableFile sont finalement enregistrées dans la mémoire au format du type d'index défini. Le fichier MemTableFile est l'unité de base pour la gestion des données en mémoire.</li>
<li>À tout moment, l'utilisation de la mémoire par les données insérées ne dépassera pas la valeur prédéfinie (insert_buffer_size). En effet, à chaque demande d'insertion de données, MemManager peut facilement calculer la mémoire occupée par le fichier MemTableFile contenu dans chaque MemTable, puis coordonner la demande d'insertion en fonction de la mémoire actuelle.</li>
</ol>
<p>Grâce à l'architecture multiniveau de MemManager, MemTable et MemTableFile, l'insertion de données peut être mieux gérée et maintenue. Bien entendu, ils peuvent faire bien plus que cela.</p>
<h2 id="Near-Real-time-Query" class="common-anchor-header">Requête en temps quasi réel<button data-href="#Near-Real-time-Query" class="anchor-icon" translate="no">
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
    </button></h2><p>Dans Milvus, vous ne devez attendre qu'une seconde au maximum pour que les données insérées passent de la mémoire au disque. L'ensemble de ce processus peut être résumé par l'image suivante :</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_near_real_time_query_milvus_f3cfdd00fb.png" alt="2-near-real-time-query-milvus.png" class="doc-image" id="2-near-real-time-query-milvus.png" />
   </span> <span class="img-wrapper"> <span>2-near-real-time-query-milvus.png</span> </span></p>
<p>Tout d'abord, les données insérées entrent dans un tampon d'insertion en mémoire. Le tampon passera périodiquement de l'état mutable initial à l'état immuable en préparation de la sérialisation. Ensuite, ces tampons immuables seront périodiquement sérialisés sur le disque par le thread de sérialisation en arrière-plan. Une fois les données placées, les informations relatives à l'ordre sont enregistrées dans les métadonnées. À ce stade, les données peuvent être recherchées !</p>
<p>Nous allons maintenant décrire en détail les étapes de l'image.</p>
<p>Nous connaissons déjà le processus d'insertion des données dans le tampon mutable. L'étape suivante consiste à passer du tampon mutable au tampon immuable :</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_mutable_buffer_immutable_buffer_milvus_282b66c5fe.png" alt="3-mutable-buffer-immutable-buffer-milvus.png" class="doc-image" id="3-mutable-buffer-immutable-buffer-milvus.png" />
   </span> <span class="img-wrapper"> <span>3-mutable-buffer-immutable-buffer-milvus.png</span> </span></p>
<p>La file d'attente immuable fournira au thread de sérialisation en arrière-plan l'état immuable et le fichier MemTable prêt à être sérialisé. Chaque table de mémoire gère sa propre file d'attente immuable, et lorsque la taille du seul fichier mutable MemTableFile de la table de mémoire atteint le seuil, il entre dans la file d'attente immuable. Un thread d'arrière-plan responsable de ToImmutable extrait périodiquement tous les MemTableFiles de la file d'attente immuable gérée par MemTable et les envoie dans la file d'attente immuable totale. Il convient de noter que les deux opérations d'écriture de données dans la mémoire et de changement des données dans la mémoire dans un état qui ne peut pas être écrit ne peuvent pas se produire en même temps, et qu'un verrou commun est nécessaire. Toutefois, l'opération ToImmutable est très simple et n'entraîne pratiquement aucun retard, de sorte que l'impact sur les performances des données insérées est minime.</p>
<p>L'étape suivante consiste à sérialiser le fichier MemTableFile dans la file d'attente de sérialisation sur le disque. Cette opération est principalement divisée en trois étapes :</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_serialize_memtablefile_milvus_95766abdfb.png" alt="4-serialize-memtablefile-milvus.png" class="doc-image" id="4-serialize-memtablefile-milvus.png" />
   </span> <span class="img-wrapper"> <span>4-serialize-memtablefile-milvus.png</span> </span></p>
<p>Tout d'abord, le thread de sérialisation en arrière-plan extrait périodiquement les MemTableFile de la file d'attente immuable. Ensuite, ils sont sérialisés en fichiers bruts de taille fixe (Raw TableFiles). Enfin, nous enregistrons ces informations dans les métadonnées. Lorsque nous effectuons une recherche vectorielle, nous interrogeons le fichier TableFile correspondant dans les métadonnées. À partir de là, ces données peuvent être recherchées !</p>
<p>En outre, en fonction de l'ensemble index_file_size, une fois que le thread de sérialisation a terminé un cycle de sérialisation, il fusionne certains TableFiles de taille fixe en un TableFile, et enregistre également ces informations dans les métadonnées. Le fichier TableFile peut alors être indexé. La construction de l'index est également asynchrone. Un autre thread d'arrière-plan responsable de la construction de l'index lira périodiquement le fichier TableFile dans l'état ToIndex des métadonnées afin de procéder à la construction de l'index correspondant.</p>
<h2 id="Vector-search" class="common-anchor-header">Recherche vectorielle<button data-href="#Vector-search" class="anchor-icon" translate="no">
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
    </button></h2><p>En fait, vous constaterez qu'avec l'aide de TableFile et des métadonnées, la recherche vectorielle devient plus intuitive et plus pratique. En général, nous devons obtenir les TableFiles correspondant à la collection interrogée à partir des métadonnées, effectuer une recherche dans chaque TableFile et enfin fusionner. Dans cet article, nous ne nous attarderons pas sur la mise en œuvre spécifique de la recherche.</p>
<p>Si vous souhaitez en savoir plus, nous vous invitons à lire notre code source ou nos autres articles techniques sur Milvus !</p>
