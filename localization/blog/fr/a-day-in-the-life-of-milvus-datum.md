---
id: a-day-in-the-life-of-milvus-datum.md
title: Une journée dans la vie d'un Milvus Datum
author: 'Stefan Webb, Anthony Tu'
date: 2025-03-17T00:00:00.000Z
desc: 'Promenons-nous donc dans une journée de la vie de Dave, le référentiel Milvus.'
cover: assets.zilliz.com/a_day_in_the_life_of_a_milvus_datum_ca279f7f59.png
tag: Engineering
tags: 'Deep Research, open source AI, Milvus, LangChain, DeepSeek R1'
recommend: true
canonicalUrl: 'https://milvus.io/blog/a-day-in-the-life-of-milvus-datum.md'
---
<p>Construire une <a href="https://zilliz.com/learn/what-is-vector-database">base de données vectorielles</a> performante comme Milvus, qui s'étend à des milliards de vecteurs et gère un trafic à l'échelle du web, n'est pas une mince affaire. Elle nécessite une conception prudente et intelligente d'un système distribué. Nécessairement, il y aura un compromis entre la performance et la simplicité dans les composants internes d'un tel système.</p>
<p>Bien que nous ayons essayé d'équilibrer ce compromis, certains aspects internes sont restés opaques. Cet article vise à dissiper tout mystère sur la façon dont Milvus décompose l'insertion de données, l'indexation et le service entre les nœuds. Il est essentiel de comprendre ces processus à un niveau élevé pour optimiser efficacement les performances des requêtes, la stabilité du système et les problèmes liés au débogage.</p>
<p>Promenons-nous donc dans une journée de la vie de Dave, la donnée Milvus. Imaginez que vous insériez Dave dans votre collection dans un <a href="https://milvus.io/docs/install-overview.md#Milvus-Distributed">déploiement distribué Milvus</a> (voir le diagramme ci-dessous). En ce qui vous concerne, il est directement inséré dans la collection. Cependant, en coulisses, de nombreuses étapes se déroulent dans des sous-systèmes indépendants.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/a_day_in_the_life_of_a_milvus_datum_ca279f7f59.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Proxy-Nodes-and-the-Message-Queue" class="common-anchor-header">Nœuds proxy et file d'attente des messages<button data-href="#Proxy-Nodes-and-the-Message-Queue" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Proxy_Nodes_and_the_Message_Queue_03a0fde0c5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Au départ, vous appelez l'objet MilvusClient, par exemple via la bibliothèque PyMilvus, et envoyez une demande <code translate="no">_insert()</code>_ à un <em>nœud proxy</em>. Les nœuds proxy sont la passerelle entre l'utilisateur et le système de base de données. Ils effectuent des opérations telles que l'équilibrage de la charge sur le trafic entrant et le regroupement de plusieurs résultats avant qu'ils ne soient renvoyés à l'utilisateur.</p>
<p>Une fonction de hachage est appliquée à la clé primaire de l'élément pour déterminer le <em>canal</em> auquel l'envoyer. Les canaux, mis en œuvre avec des sujets Pulsar ou Kafka, représentent un terrain d'attente pour les données en continu, qui peuvent ensuite être envoyées aux abonnés du canal.</p>
<h2 id="Data-Nodes-Segments-and-Chunks" class="common-anchor-header">Nœuds de données, segments et morceaux<button data-href="#Data-Nodes-Segments-and-Chunks" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Data_Nodes_Segments_and_Chunks_ae122dd1ac.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Une fois que les données ont été envoyées au canal approprié, celui-ci les envoie au segment correspondant dans le <em>nœud de données</em>. Les nœuds de données sont chargés de stocker et de gérer des tampons de données appelés <em>segments croissants</em>. Il y a un segment croissant par groupe de données.</p>
<p>Au fur et à mesure que des données sont insérées dans un segment, celui-ci croît jusqu'à atteindre une taille maximale, fixée par défaut à 122 Mo. Pendant ce temps, des parties plus petites du segment, par défaut de 16 Mo et appelées " <em>chunks</em>", sont transférées vers un stockage persistant, par exemple en utilisant S3 d'AWS ou un autre stockage compatible tel que MinIO. Chaque morceau est un fichier physique sur le stockage d'objets et il y a un fichier séparé par champ. La figure ci-dessus illustre la hiérarchie des fichiers sur le stockage objet.</p>
<p>En résumé, les données d'une collection sont réparties entre les nœuds de données, à l'intérieur desquels elles sont divisées en segments pour la mise en mémoire tampon, qui sont à leur tour divisés en morceaux par champ pour le stockage persistant. Les deux diagrammes ci-dessus permettent d'y voir plus clair. En divisant les données entrantes de cette manière, nous exploitons pleinement le parallélisme de la bande passante du réseau, du calcul et du stockage de la grappe.</p>
<h2 id="Sealing-Merging-and-Compacting-Segments" class="common-anchor-header">Sceller, fusionner et compacter les segments<button data-href="#Sealing-Merging-and-Compacting-Segments" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Sealing_Merging_and_Compacting_Segments_d5a6a37261.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Jusqu'à présent, nous avons raconté comment notre sympathique donnée Dave passe d'une requête <code translate="no">_insert()</code>_ à un stockage persistant. Bien entendu, son histoire ne s'arrête pas là. D'autres étapes permettent de rendre le processus de recherche et d'indexation plus efficace. En gérant la taille et le nombre de segments, le système exploite pleinement le parallélisme du cluster.</p>
<p>Lorsqu'un segment atteint sa taille maximale sur un nœud de données, par défaut 122 Mo, on dit qu'il est <em>scellé</em>. Cela signifie que la mémoire tampon du nœud de données est vidée pour faire place à un nouveau segment, et que les morceaux correspondants dans le stockage persistant sont marqués comme appartenant à un segment fermé.</p>
<p>Les nœuds de données recherchent périodiquement des segments scellés plus petits et les fusionnent en segments plus grands jusqu'à ce qu'ils atteignent une taille maximale de 1 Go (par défaut) par segment. Rappelons que lorsqu'un élément est supprimé dans Milvus, il est simplement marqué d'un drapeau de suppression - c'est un peu comme le couloir de la mort pour Dave. Lorsque le nombre d'éléments supprimés dans un segment dépasse un seuil donné, par défaut 20 %, la taille du segment est réduite, une opération que nous appelons <em>compactage</em>.</p>
<p>Indexation et recherche dans les segments</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Indexing_and_Searching_through_Segments_478c0067be.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Indexing_and_Searching_through_Segments_1_0c31b5a340.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Il existe un type de nœud supplémentaire, le <em>nœud d'index</em>, qui est responsable de la construction d'index pour les segments scellés. Lorsque le segment est scellé, le nœud de données envoie une demande à un nœud d'index pour construire un index. Le nœud d'index envoie ensuite l'index terminé au stockage d'objets. Chaque segment scellé a son propre index stocké dans un fichier séparé. Vous pouvez examiner ce fichier manuellement en accédant au seau - voir la figure ci-dessus pour la hiérarchie des fichiers.</p>
<p>Les nœuds de requête - et pas seulement les nœuds de données - s'abonnent aux sujets de la file d'attente des messages pour les segments correspondants. Les segments croissants sont répliqués sur les nœuds d'interrogation, et le nœud charge en mémoire les segments scellés appartenant à la collection en fonction des besoins. Il construit un index pour chaque segment croissant au fur et à mesure de l'arrivée des données et charge les index finalisés pour les segments scellés à partir du magasin de données.</p>
<p>Imaginons maintenant que vous appeliez l'objet MilvusClient avec une requête <em>search()</em> qui englobe Dave. Après avoir été acheminé vers tous les nœuds de requête via le nœud proxy, chaque nœud de requête effectue une recherche de similarité vectorielle (ou une autre méthode de recherche telle que la requête, la recherche par plage ou la recherche par groupement), en parcourant les segments un par un. Les résultats sont rassemblés entre les nœuds à la manière de MapReduce et renvoyés à l'utilisateur, Dave étant heureux d'être enfin réuni avec vous.</p>
<h2 id="Discussion" class="common-anchor-header">Discussion<button data-href="#Discussion" class="anchor-icon" translate="no">
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
    </button></h2><p>Nous avons couvert une journée dans la vie de Dave the datum, à la fois pour les opérations <code translate="no">_insert()</code>_ et <code translate="no">_search()</code>_. D'autres opérations comme <code translate="no">_delete()</code>_ et <code translate="no">_upsert()</code>_ fonctionnent de manière similaire. Inévitablement, nous avons dû simplifier notre discussion et omettre les détails les plus fins. Dans l'ensemble, cependant, vous devriez maintenant avoir une idée suffisante de la manière dont Milvus est conçu pour que le parallélisme entre les nœuds d'un système distribué soit robuste et efficace, et de la manière dont vous pouvez l'utiliser pour l'optimisation et le débogage.</p>
<p><em>Un point important à retenir de cet article : Milvus est conçu avec une séparation des préoccupations entre les types de nœuds. Chaque type de nœud a une fonction spécifique, mutuellement exclusive, et il y a une séparation du stockage et du calcul.</em> Il en résulte que chaque composant peut être mis à l'échelle de manière indépendante, les paramètres pouvant être ajustés en fonction du cas d'utilisation et des schémas de trafic. Par exemple, vous pouvez faire évoluer le nombre de nœuds de requête pour répondre à l'augmentation du trafic sans faire évoluer les nœuds de données et d'index. Grâce à cette flexibilité, certains utilisateurs de Milvus traitent des milliards de vecteurs et servent un trafic à l'échelle du Web, avec une latence d'interrogation inférieure à 100 ms.</p>
<p>Vous pouvez également profiter des avantages de la conception distribuée de Milvus sans même déployer un cluster distribué grâce à <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, un service entièrement géré de Milvus. <a href="https://cloud.zilliz.com/signup">Inscrivez-vous dès aujourd'hui à la version gratuite de Zilliz Cloud et mettez Dave en action !</a></p>
