---
id: 25-million-vectors-1gb-memory-milvus-flat.md
title: >-
  Comment exécuter 25 millions de vecteurs d'images avec moins de 1 Go de
  mémoire dans Milvus ?
author: Jack Li
date: 2026-6-3
cover: >-
  assets.zilliz.com/25_million_vectors_1gb_memory_milvus_flat_md_1_19b2539810.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus FLAT index, vector database memory, mmap vector index, FP16 vector
  quantization, image search
meta_title: |
  How to Run 25 Million Image Vectors on Under 1GB of Memory in Milvus
desc: >-
  Comment un utilisateur de la communauté a exécuté une recherche d'images de 25
  millions de vecteurs sur &lt;1 Go de mémoire dans Milvus en utilisant FLAT,
  FP16 et mmap - au lieu des 139 Go estimés par l'outil de dimensionnement.
origin: 'https://milvus.io/blog/25-million-vectors-1gb-memory-milvus-flat.md'
---
<p>Un utilisateur de Milvus nous a récemment fait part d'un problème très pratique de recherche d'images.</p>
<p>"Nous devons effectuer une recherche d'image à image sur 25 millions d'images, codées sous forme de vecteurs à 1280 dimensions. Une seule machine servira la charge de travail. Elle dispose de 64 Go de mémoire vive et 32 Go au maximum peuvent être consacrés à la base de données vectorielle. Mais l'<a href="https://milvus.io/tools/sizing"><strong>outil de dimensionnement de Milvus</strong></a> indique que nous avons besoin de 139 Go. Sommes-nous cuits ?"</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/25_million_vectors_1gb_memory_milvus_flat_md_2_06e0f8be39.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Résultats de l'estimation de l'outil de dimensionnement : 25M × 1280 vecteurs dimensionnels, taille des données brutes 119.2 GB, mémoire de chargement 139.4 GB</p>
<p>Pas tout à fait.</p>
<p>Au début, la réponse évidente semblait être un index plus avancé. Si l'ensemble de données est volumineux et que la mémoire est limitée, un index ANN plus intelligent devrait certainement aider. Dans ce cas, cela n'a pas été le cas. L'index qui a finalement fonctionné était l'option la plus simple de Milvus : <a href="https://milvus.io/docs/flat.md"><strong>FLAT</strong></a>.</p>
<p>Le résultat a été meilleur que prévu : la mémoire à l'état stable est restée inférieure à 1 Go, la mémoire résidente du conteneur était d'environ 600 Mo et la latence des requêtes à chaud est restée inférieure à 100 ms. Le démarrage a brièvement culminé à environ 12,5 Go, et la première requête a pris environ 30 secondes pendant que le système se réchauffait.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/25_million_vectors_1gb_memory_milvus_flat_md_3_272794fc9b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>L'important n'est pas que FLAT ait magiquement rendu 25 millions de comparaisons par force brute bon marché. Ce n'est pas le cas. Ce qui est important, c'est que cette charge de travail n'a presque jamais cherché les 25 millions de vecteurs. Les filtres scalaires ont d'abord restreint chaque requête, et FLAT n'a comparé que les vecteurs à l'intérieur de cet ensemble de candidats beaucoup plus restreint.</p>
<p>Cet article explique ce qui a échoué, pourquoi FLAT a fonctionné, et quand le même schéma vaut la peine d'être essayé dans votre propre charge de travail.</p>
<h2 id="Why-AISAQ-and-IVFFLAT-Did-Not-Work-Here" class="common-anchor-header">Pourquoi AISAQ et IVF_FLAT n'ont pas fonctionné ici ?<button data-href="#Why-AISAQ-and-IVFFLAT-Did-Not-Work-Here" class="anchor-icon" translate="no">
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
    </button></h2><p>Avant FLAT, l'utilisateur a essayé deux index qui semblaient plus naturels pour une machine à contraintes.</p>
<p><strong>Première tentative :</strong> <a href="https://milvus.io/docs/aisaq.md"><strong>AISAQ</strong></a><strong>.</strong> AISAQ est un index orienté disque conçu pour limiter l'utilisation de la mémoire. Le problème dans cette charge de travail était le chemin de construction et de chargement. Lors d'un test antérieur avec 55 millions de vecteurs, un chargement de collection a écrit 249 Go de données temporaires sur le disque et a pris trop de temps pour être pratique.</p>
<p><strong>Deuxième essai : IVF_FLAT.</strong> IVF_FLAT semblait également raisonnable car il s'agit d'un index ANN standard. L'index a été construit avec succès, mais la charge de collecte s'est arrêtée à 14 % et n'a jamais repris.</p>
<p>Après ces deux impasses, l'utilisateur a essayé l'option la plus ennuyeuse : FLAT. Elle s'est chargée proprement. Elle a également donné le meilleur comportement d'exécution pour ce modèle de requête spécifique.</p>
<table>
<thead>
<tr><th><strong>Index</strong></th><th><strong>Pourquoi c'était prometteur</strong></th><th><strong>Ce qui s'est passé dans cette charge de travail</strong></th></tr>
</thead>
<tbody>
<tr><td>AISAQ</td><td>Index orienté disque avec une faible utilisation de la mémoire en théorie</td><td>Le chemin de construction/chargement a généré de gros fichiers temporaires. Lors d'un test sur 55 millions de vecteurs, une charge de collecte a écrit 249 Go de données temporaires et s'est révélée lente.</td></tr>
<tr><td>IVF_FLAT</td><td>Index ANN standard avec un coût de recherche inférieur à celui d'un balayage complet</td><td>L'index a été construit, mais le chargement de la collection s'est arrêté à 14 % et ne s'est pas rétabli.</td></tr>
<tr><td>FLAT</td><td>Pas de structure ANN supplémentaire et pas de complexité dans la construction de l'index</td><td>La mémoire à l'état stable est restée inférieure à 1 Go. La mémoire résidente du conteneur était d'environ 600 Mo. Le démarrage a atteint un pic de près de 12,5 Go. La première requête a pris environ 30 secondes, puis les requêtes à chaud sont restées inférieures à 100 ms.</td></tr>
</tbody>
</table>
<p>La leçon est simple : un index efficace en théorie peut être mal adapté à une machine, à une forme de données et à un modèle de requête spécifiques.</p>
<h2 id="Why-FLAT-Worked" class="common-anchor-header">Pourquoi FLAT a fonctionné<button data-href="#Why-FLAT-Worked" class="anchor-icon" translate="no">
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
    </button></h2><p>FLAT est l'index le plus simple pris en charge par Milvus. Pas de graphique. Pas d'arbre. Pas de regroupement. Il compare directement le vecteur de la requête aux vecteurs candidats.</p>
<p>Cela semble être le mauvais outil pour 25 millions de vecteurs. Ce ne serait pas non plus le bon outil si chaque requête portait sur l'ensemble de la collection.</p>
<p>Mais cette charge de travail comportait un filtre puissant en amont de la recherche vectorielle. Chaque requête a d'abord restreint l'espace de recherche avec des champs scalaires tels que <code translate="no">dataid</code> et <code translate="no">classid</code>. Ce n'est qu'ensuite que Milvus a exécuté une recherche de similarité vectorielle. Le problème est ainsi passé de "recherche de 25 millions de vecteurs" à "recherche de quelques centaines à quelques dizaines de milliers de vecteurs après filtrage".</p>
<p>Trois éléments ont permis à la configuration de fonctionner : Le stockage des vecteurs en FP16, le mmap pour les données vectorielles brutes et le filtrage scalaire avant la passe FLAT.</p>
<h2 id="Optimization-1-FP16-Cuts-Vector-Data-in-Half" class="common-anchor-header">Optimisation 1 : le FP16 réduit de moitié les données vectorielles<button data-href="#Optimization-1-FP16-Cuts-Vector-Data-in-Half" class="anchor-icon" translate="no">
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
    </button></h2><p>Les vecteurs avaient 1280 dimensions. Stockés en FP32, chaque vecteur nécessite 5120 octets :</p>
<p><code translate="no">1280 dimensions x 4 bytes = 5120 bytes</code></p>
<p>Sur 25 millions de vecteurs, cela représente environ 119,2 Go de données vectorielles brutes. Le format FP16 réduit chaque dimension de 4 octets à 2 octets :</p>
<p><code translate="no">1280 dimensions x 2 bytes = 2560 bytes</code></p>
<p>Les données vectorielles brutes sont donc réduites à environ 59,6 Go.</p>
<p>Cela ne tient toujours pas dans la mémoire vive disponible, mais cela réduit de moitié la quantité de données vectorielles que Milvus et le système d'exploitation doivent traiter. Dans de nombreuses charges de travail de recherche d'images, FP16 a un faible impact sur le rappel, mais ce n'est pas une règle absolue. Testez le rappel avec vos propres embeddings, métriques et barres de qualité avant d'en faire une règle par défaut.</p>
<h2 id="Optimization-2-mmap-Keeps-Raw-Vectors-Off-the-Process-Heap" class="common-anchor-header">Optimisation 2 : mmap garde les vecteurs bruts hors de la pile du processus<button data-href="#Optimization-2-mmap-Keeps-Raw-Vectors-Off-the-Process-Heap" class="anchor-icon" translate="no">
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
    </button></h2><p>Même après le FP16, environ 60 Go de vecteurs sont encore trop pour le budget mémoire. C'est là que <a href="https://milvus.io/docs/mmap.md"><strong>mmap</strong></a> devient utile.</p>
<p>Avec mmap, Milvus peut accéder aux données vectorielles par le biais de fichiers mappés en mémoire au lieu de charger l'ensemble du champ vectoriel brut dans la mémoire du processus. Le système d'exploitation met en page les données au fur et à mesure que les requêtes les touchent et peut conserver les pages chaudes dans son cache de pages.</p>
<p>Dans l'environnement Milvus 2.6.14 de cet utilisateur, la configuration mmap au niveau du cluster couvrait déjà les données vectorielles brutes, de sorte que l'utilisateur n'a pas eu besoin de définir mmap manuellement.</p>
<p>Un détail a été source de confusion lors du débogage : Attu affiche la configuration de mmap au niveau du schéma, et non la configuration par défaut au niveau du cluster. <a href="https://zilliz.com/attu"><strong>Attu</strong></a> peut donc indiquer que mmap est désactivé même si la configuration au niveau du cluster active effectivement mmap pour le chemin de données.</p>
<p>Le compromis est simple. mmap permet d'économiser de la RAM, mais il utilise plus fortement le disque et le cache de page du système d'exploitation. Vous avez toujours besoin de la capacité du disque SSD pour les fichiers vectoriels, et la première requête peut être plus lente pendant que les pages pertinentes sont lues sur le disque.</p>
<h2 id="Optimization-3-Scalar-Filtering-Is-the-Real-Performance-Multiplier" class="common-anchor-header">Optimisation 3 : le filtrage scalaire est le véritable multiplicateur de performances<button data-href="#Optimization-3-Scalar-Filtering-Is-the-Real-Performance-Multiplier" class="anchor-icon" translate="no">
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
    </button></h2><p>FP16 et mmap expliquent le nombre de mémoire. Le filtrage scalaire explique le chiffre de latence.</p>
<p>Chaque requête de cette charge de travail incluait une expression de filtrage comme celle-ci :</p>
<pre><code translate="no" class="language-sql">dataid in [123] AND classid in [0, 2, 3]
<button class="copy-code-btn"></button></code></pre>
<p>Ce filtre s'exécutait avant l'étape de comparaison des vecteurs. Au lieu de comparer avec 25 millions de vecteurs, FLAT a comparé avec l'ensemble de candidats filtrés, qui allait de quelques centaines à quelques dizaines de milliers de vecteurs.</p>
<p>C'est pourquoi les requêtes chaudes sont restées inférieures à 100 ms. Des dizaines de milliers de comparaisons de vecteurs sont pratiques sur une unité centrale moderne. Vingt-cinq millions de comparaisons par requête, c'est une tout autre histoire.</p>
<p>Cela explique également pourquoi IVF_FLAT et HNSW n'ont pas été utiles ici. Une fois que le filtrage scalaire a suffisamment réduit l'ensemble des candidats, une structure ANN supplémentaire peut devenir un poids mort. Elle ajoute de la mémoire, du temps de construction et de la complexité de chargement, mais elle n'améliore pas beaucoup la latence.</p>
<p>Une mise en garde s'impose. Les filtres de cette charge de travail étaient simples. Si vos filtres utilisent de grandes listes <code translate="no">IN</code>, des motifs <code translate="no">LIKE</code>, des prédicats de plage ou des conditions JSON imbriquées, ajoutez des index scalaires sur les champs concernés et mesurez directement l'étape du filtre.</p>
<table>
<thead>
<tr><th>Optimisation</th><th>Ce qu'elle fait</th><th>Pourquoi c'est important ici</th><th>Compromis</th></tr>
</thead>
<tbody>
<tr><td>Stockage vectoriel FP16</td><td>Stockage de chaque dimension vectorielle sur 2 octets au lieu de 4 octets</td><td>Réduction des données vectorielles brutes d'environ 119,2 Go à environ 59,6 Go</td><td>L'impact sur le rappel dépend de vos enchâssements et de votre métrique. Testez-le.</td></tr>
<tr><td>mmap sur les vecteurs bruts</td><td>Met en correspondance les fichiers vectoriels à partir du disque au lieu de charger le champ vectoriel brut complet dans la mémoire du processus.</td><td>Maintient la mémoire du processus à un niveau bas tout en permettant au système d'exploitation de paginer les données en fonction des besoins.</td><td>Nécessite la capacité d'un disque SSD et peut rendre les requêtes froides plus lentes.</td></tr>
<tr><td>Filtrage scalaire d'abord</td><td>Filtre les champs scalaires avant la comparaison des vecteurs</td><td>Réduit chaque requête de 25 millions de candidats à des centaines ou des dizaines de milliers.</td><td>Les filtres complexes peuvent nécessiter des index scalaires.</td></tr>
</tbody>
</table>
<h2 id="Where-This-Pattern-Applies" class="common-anchor-header">Domaines d'application de ce modèle<button data-href="#Where-This-Pattern-Applies" class="anchor-icon" translate="no">
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
    </button></h2><p>Le cas de la recherche d'images a fonctionné parce que l'espace de recherche réel était beaucoup plus petit que la collection totale. Cette même forme apparaît dans de nombreuses charges de travail de production.</p>
<ol>
<li><strong>RAG multi-locataires :</strong> filtrez d'abord par <code translate="no">tenant_id</code>, <code translate="no">workspace_id</code> ou <code translate="no">project_id</code>. Chaque locataire peut n'avoir que des milliers ou des dizaines de milliers de morceaux.</li>
<li><strong>Recherche de produits dans le commerce électronique :</strong> Filtre par catégorie, marque, vendeur, région ou disponibilité avant la recherche vectorielle.</li>
<li><strong>Recherche de journaux et de documents :</strong> Filtre par période, source, service ou type de document avant la recherche sémantique.</li>
<li><strong>Recherche d'images ou de médias avec étiquettes :</strong> Filtre par ensemble de données, classe, client ou groupe d'actifs avant de comparer les encastrements.</li>
</ol>
<p>Ce sont de bons candidats pour FLAT + FP16 + mmap car la collection complète peut être importante alors que chaque requête ne concerne qu'un petit sous-ensemble.</p>
<p>Le modèle ne s'applique pas lorsque chaque requête porte sur l'ensemble de la collection. Si chaque requête doit vraiment parcourir les 25 millions de vecteurs, FLAT n'offrira pas la même latence. Dans ce cas, utilisez un index ANN tel que HNSW, IVF, ou un index orienté disque, et planifiez les compromis en termes de mémoire, de disque et de temps de construction.</p>
<h2 id="How-to-Read-the-Sizing-Tool-Estimate" class="common-anchor-header">Comment lire l'estimation de l'outil de dimensionnement<button data-href="#How-to-Read-the-Sizing-Tool-Estimate" class="anchor-icon" translate="no">
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
    </button></h2><p>L'outil de dimensionnement Milvus est un point de départ et non un verdict final sur votre matériel.</p>
<p>Dans ce cas, l'estimation de 139,4 Go de mémoire de chargement a servi de référence prudente pour 25 millions de vecteurs FP32 à 1280 dimensions. La charge de travail réelle a modifié plusieurs hypothèses :</p>
<ol>
<li>FP16 a réduit de moitié la taille des vecteurs bruts.</li>
<li>mmap a permis d'éviter de charger l'intégralité du champ de vecteurs bruts dans la mémoire de traitement.</li>
<li>FLAT a évité les structures d'index ANN supplémentaires.</li>
<li>Les filtres scalaires ont permis à chaque requête de rechercher un ensemble de candidats beaucoup plus petit.</li>
</ol>
<p>C'est la raison pour laquelle les tests de charge de travail réelle sont importants. Avant de rejeter une configuration matérielle sur la seule base d'une estimation de la taille, testez avec votre précision vectorielle réelle, votre type d'index, votre configuration mmap, vos filtres scalaires, votre comportement de requête à froid et votre comportement de requête à chaud.</p>
<h2 id="Get-Started" class="common-anchor-header">Commencez<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p>Si vous voulez essayer la même recette, commencez par le modèle de requête, et non par le nom de l'index.</p>
<ol>
<li>Vérifiez si chaque requête a des filtres scalaires sélectifs.</li>
<li>Estimez le nombre de vecteurs restants après le filtrage.</li>
<li>Stockez les vecteurs en tant que FP16 si le test de rappel semble bon.</li>
<li>Utiliser FLAT lorsque l'ensemble des candidats filtrés est suffisamment petit pour permettre une comparaison brute.</li>
<li>Vérifier le comportement de mmap pour les données vectorielles brutes. Vérifier les paramètres au niveau du schéma et la configuration au niveau du cluster.</li>
<li>Mesurez la mémoire de démarrage, la latence de la première requête, la latence de la requête à chaud et les entrées/sorties sur disque.</li>
<li>Ajoutez des index scalaires si l'évaluation des filtres devient un goulot d'étranglement.</li>
</ol>
<p>Pour les tests locaux, commencez par le <a href="https://milvus.io/docs/quickstart.md"><strong>quickstart Milvus</strong></a> ou le dépôt Milvus <a href="https://github.com/milvus-io/milvus"><strong>GitHub</strong></a>. Utilisez Attu pour inspecter les collections, mais n'oubliez pas qu'Attu peut ne pas afficher les valeurs par défaut de mmap au niveau du cluster.</p>
<p>Si vous ne souhaitez pas gérer l'infrastructure vous-même, <a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a> est le service géré de Milvus. Vous obtenez le même noyau Milvus avec des opérations gérées, une mise à l'échelle et un niveau gratuit pour les tests. <a href="https://cloud.zilliz.com/signup"><strong>Inscrivez-vous</strong></a> pour obtenir 100 $ de crédits gratuits avec votre adresse électronique professionnelle, ou <a href="https://cloud.zilliz.com/login"><strong>connectez-vous</strong></a> si vous avez déjà un compte.</p>
