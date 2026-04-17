---
id: >-
  how-to-cut-vector-database-costs-by-up-to-80-a-practical-milvus-optimization-guide.md
title: >-
  Comment réduire les coûts des bases de données vectorielles jusqu'à 80% :
  Guide pratique d'optimisation de Milvus
author: Jack Li
date: 2026-3-20
cover: assets.zilliz.com/cover_reduce_vdb_cost_by_80_56ed2fe3ae.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus cost optimization, vector database cost reduction, RAG cost
  optimization, HNSW vs IVF_SQ8, vector search cost
meta_title: |
  Milvus Cost Optimization Guide: Cut Vector Database Costs by Up to 80%
desc: >-
  Milvus est gratuit, mais l'infrastructure ne l'est pas. Découvrez comment
  réduire les coûts de mémoire des bases de données vectorielles de 60 à 80 %
  grâce à de meilleurs index, au MMap et au stockage hiérarchisé.
origin: >-
  https://milvus.io/blog/how-to-cut-vector-database-costs-by-up-to-80-a-practical-milvus-optimization-guide.md
---
<p>Votre prototype RAG fonctionnait très bien. Puis il est passé en production, le trafic a augmenté et votre facture de base de données vectorielles est passée de 500 à 5 000 dollars par mois. Cela vous rappelle quelque chose ?</p>
<p>Il s'agit là de l'un des problèmes de mise à l'échelle les plus fréquents dans les applications d'IA à l'heure actuelle. Vous avez construit quelque chose qui crée une réelle valeur ajoutée, mais les coûts d'infrastructure augmentent plus vite que votre base d'utilisateurs. Et lorsque vous regardez la facture, la base de données vectorielle est souvent la plus grande surprise - dans les déploiements que nous avons vus, elle peut représenter environ 40 à 50 % du coût total de l'application, juste derrière les appels d'API LLM.</p>
<p>Dans ce guide, j'expliquerai où va réellement l'argent et les choses spécifiques que vous pouvez faire pour le réduire - dans de nombreux cas de 60 à 80%. J'utiliserai <a href="https://milvus.io/">Milvus</a>, la base de données vectorielles open-source la plus populaire, comme exemple principal car c'est ce que je connais le mieux, mais les principes s'appliquent à la plupart des bases de données vectorielles.</p>
<p><em>Pour être clair :</em> <em><a href="https://milvus.io/">Milvus</a></em> <em>lui-même est gratuit et open source - vous ne payez jamais pour le logiciel. Le coût provient entièrement de l'infrastructure sur laquelle vous l'exécutez : instances en nuage, mémoire, stockage et réseau. La bonne nouvelle, c'est que la plupart de ces coûts d'infrastructure peuvent être réduits.</em></p>
<h2 id="Where-Does-the-Money-Actually-Go-When-Using-a-VectorDB" class="common-anchor-header">Où va réellement l'argent lorsque l'on utilise une VectorDB ?<button data-href="#Where-Does-the-Money-Actually-Go-When-Using-a-VectorDB" class="anchor-icon" translate="no">
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
    </button></h2><p>Commençons par un exemple concret. Supposons que vous ayez 100 millions de vecteurs, 768 dimensions, stockés en float32 - une configuration RAG assez typique. Voici à peu près ce que cela coûte par mois sur AWS :</p>
<table>
<thead>
<tr><th><strong>Composant de coût</strong></th><th><strong>Part</strong></th><th><strong>~Coût mensuel</strong></th><th><strong>Notes</strong></th></tr>
</thead>
<tbody>
<tr><td>Calcul (CPU + mémoire)</td><td>85-90%</td><td>$2,800</td><td>Le plus important - principalement dû à la mémoire</td></tr>
<tr><td>Réseau</td><td>5-10%</td><td>$250</td><td>Trafic inter-zones, charges utiles importantes.</td></tr>
<tr><td>Stockage</td><td>2-5%</td><td>$100</td><td>Bon marché - le stockage d'objets (S3/MinIO) est ~0,03 $/GB</td></tr>
</tbody>
</table>
<p>La conclusion est simple : la mémoire représente 85 à 90 % de votre budget. Le réseau et le stockage sont importants à la marge, mais si vous voulez réduire les coûts de manière significative, la mémoire est le levier. C'est sur ce point que porte l'ensemble de ce guide.</p>
<p><strong>Petite remarque sur le réseau et le stockage :</strong> Vous pouvez réduire les coûts de réseau en ne renvoyant que les champs dont vous avez besoin (ID, score, métadonnées clés) et en évitant les requêtes interrégionales. En ce qui concerne le stockage, Milvus sépare déjà le stockage du calcul - vos vecteurs sont stockés dans un système de stockage d'objets bon marché tel que S3, de sorte que même pour 100 millions de vecteurs, le stockage est généralement inférieur à 50 $/mois. Aucun de ces éléments ne fera bouger l'aiguille comme le fera l'optimisation de la mémoire.</p>
<h2 id="Why-Memory-Is-So-Expensive-for-Vector-Search" class="common-anchor-header">Pourquoi la mémoire est-elle si chère pour la recherche vectorielle ?<button data-href="#Why-Memory-Is-So-Expensive-for-Vector-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Si vous venez des bases de données traditionnelles, les besoins en mémoire pour la recherche vectorielle peuvent être surprenants. Une base de données relationnelle peut exploiter les index B-tree sur disque et le cache de page du système d'exploitation. La recherche vectorielle est différente - elle implique des calculs massifs en virgule flottante, et les index comme HNSW ou IVF doivent rester chargés en mémoire pour offrir une latence de l'ordre de la milliseconde.</p>
<p>Voici une formule rapide pour estimer vos besoins en mémoire :</p>
<p><strong>Mémoire requise = (vecteurs × dimensions × 4 octets) × multiplicateur d'index</strong></p>
<p>Pour notre exemple 100M × 768 × float32 avec HNSW (multiplicateur ~1,8x) :</p>
<ul>
<li>Données brutes : 100M × 768 × 4 octets ≈ 307 GB</li>
<li>Avec l'index HNSW : 307 GB × 1,8 ≈ 553 GB</li>
<li>Avec les frais généraux du système d'exploitation, le cache et la marge de manœuvre : ~ 768 Go au total</li>
<li>Sur AWS : 3× r6i.8xlarge (256 Go chacun) ≈ 2 800 $/mois</li>
</ul>
<p><strong>Voilà pour la base. Voyons maintenant comment la réduire.</strong></p>
<h2 id="1-Pick-the-Right-Index-to-Get-4x-Less-Memory-Usage" class="common-anchor-header">1. Choisir le bon index pour réduire de 4 fois l'utilisation de la mémoire<button data-href="#1-Pick-the-Right-Index-to-Get-4x-Less-Memory-Usage" class="anchor-icon" translate="no">
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
    </button></h2><p>C'est le changement le plus important que vous puissiez faire. Pour le même jeu de données de 100 millions de vecteurs, l'utilisation de la mémoire peut varier de 4 à 6 fois en fonction de votre choix d'index.</p>
<ul>
<li><strong>FLAT / IVF_FLAT</strong>: pratiquement aucune compression, de sorte que l'utilisation de la mémoire reste proche de la taille des données brutes, soit environ <strong>300 Go.</strong></li>
<li><strong>HNSW</strong>: stocke une structure graphique supplémentaire, de sorte que l'utilisation de la mémoire est généralement de <strong>1,5 à 2,0 fois</strong> la taille des données brutes, soit environ <strong>450 à 600 Go.</strong></li>
<li><strong>IVF_SQ8</strong>: compresse les valeurs float32 en uint8, ce qui donne une <strong>compression d'</strong>environ <strong>4 fois</strong>, de sorte que l'utilisation de la mémoire peut tomber à environ <strong>75 à 100 Go.</strong></li>
<li><strong>IVF_PQ / DiskANN</strong>: utilisation d'une compression plus forte ou d'un index sur disque, ce qui permet de réduire encore la mémoire à environ <strong>30 à 60 Go.</strong></li>
</ul>
<p>De nombreuses équipes commencent par utiliser HNSW parce qu'il offre la meilleure vitesse d'interrogation, mais elles finissent par payer 3 à 5 fois plus que nécessaire.</p>
<p>Voici comment les principaux types d'index se comparent :</p>
<table>
<thead>
<tr><th><strong>Index</strong></th><th><strong>Multiplicateur de mémoire</strong></th><th><strong>Vitesse d'interrogation</strong></th><th><strong>Rappel</strong></th><th><strong>Meilleur pour</strong></th></tr>
</thead>
<tbody>
<tr><td>FLAT</td><td>~1.0x</td><td>Lent</td><td>100%</td><td>Petits ensembles de données (&lt;1M), tests</td></tr>
<tr><td>IVF_FLAT</td><td>~1.05x</td><td>Moyenne</td><td>95-99%</td><td>Utilisation générale</td></tr>
<tr><td>IVF_SQ8</td><td>~0.30x</td><td>Moyenne</td><td>93-97%</td><td>Production sensible aux coûts (recommandée)</td></tr>
<tr><td>IVF_PQ</td><td>~0.12x</td><td>Rapide</td><td>70-80%</td><td>Très grands ensembles de données, extraction grossière</td></tr>
<tr><td>HNSW</td><td>~1.8x</td><td>Très rapide</td><td>98-99%</td><td>Uniquement lorsque la latence est plus importante que le coût</td></tr>
<tr><td>DiskANN</td><td>~0.08x</td><td>Moyennement rapide</td><td>95-98%</td><td>Très grande échelle avec des disques SSD NVMe</td></tr>
</tbody>
</table>
<p><strong>Conclusion :</strong> Le passage de HNSW ou IVF_FLAT à IVF_SQ8 réduit généralement le rappel de seulement 2 à 3 % (par exemple, de 97 % à 94-95 %) tout en réduisant le coût de la mémoire d'environ 70 %. Pour la plupart des charges de travail RAG, ce compromis en vaut absolument la peine. Si vous effectuez une extraction grossière ou si votre barre de précision est plus basse, IVF_PQ ou IVF_RABITQ peuvent encore augmenter les économies.</p>
<p><strong>Ma recommandation :</strong> Si vous utilisez HNSW en production et que le coût est une préoccupation, essayez d'abord IVF_SQ8 sur une collection de test. Mesurez le rappel sur vos requêtes réelles. La plupart des équipes sont surprises de voir à quel point la baisse de précision est faible.</p>
<h2 id="2-Stop-Loading-Everything-into-Memory-for-60-80-Cost-Reduction" class="common-anchor-header">2. Arrêter de tout charger en mémoire pour une réduction des coûts de 60 à 80<button data-href="#2-Stop-Loading-Everything-into-Memory-for-60-80-Cost-Reduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Même après avoir choisi un index plus efficace, il se peut que vous ayez encore plus de données en mémoire que nécessaire. Milvus propose deux façons de résoudre ce problème : <strong>MMap (disponible depuis la version 2.3) et le stockage hiérarchisé (disponible depuis la version 2.6). Ces deux méthodes permettent de réduire l'utilisation de la mémoire de 60 à 80 %.</strong></p>
<p>L'idée de base des deux méthodes est la même : toutes les données n'ont pas besoin d'être stockées en mémoire à tout moment. La différence réside dans la manière dont ils gèrent les données qui ne sont pas en mémoire.</p>
<h3 id="MMap-Memory-Mapped-Files" class="common-anchor-header">MMap (Memory-Mapped Files)</h3><p>MMap met en correspondance vos fichiers de données du disque local avec l'espace d'adressage du processus. L'ensemble des données reste sur le disque local du nœud et le système d'exploitation charge les pages en mémoire à la demande, uniquement lorsqu'elles sont consultées. Avant d'utiliser MMap, toutes les données sont téléchargées depuis le stockage d'objets (S3/MinIO) vers le disque local du QueryNode.</p>
<ul>
<li>L'utilisation de la mémoire est réduite à ~10-30% du mode pleine charge.</li>
<li>La latence reste stable et prévisible (les données sont sur le disque local, pas de recherche sur le réseau).</li>
<li>Compromis : le disque local doit être suffisamment grand pour contenir l'ensemble des données.</li>
</ul>
<h3 id="Tiered-Storage" class="common-anchor-header">Stockage hiérarchisé</h3><p>Le stockage hiérarchisé va encore plus loin. Au lieu de tout télécharger sur le disque local, il utilise le disque local comme cache pour les données chaudes et conserve le stockage d'objets comme couche primaire. Les données ne sont extraites du stockage d'objets qu'en cas de besoin.</p>
<ul>
<li>L'utilisation de la mémoire tombe à moins de 10 % du mode pleine charge.</li>
<li>L'utilisation du disque local diminue également - seules les données chaudes sont mises en cache (généralement 10 à 30 % du total).</li>
<li>Compromis : les manques de cache ajoutent une latence de 50 à 200 ms (extraction du stockage d'objets).</li>
</ul>
<h3 id="Data-flow-and-resource-usage" class="common-anchor-header">Flux de données et utilisation des ressources</h3><table>
<thead>
<tr><th><strong>Mode de fonctionnement</strong></th><th><strong>Flux de données</strong></th><th><strong>Utilisation de la mémoire</strong></th><th><strong>Utilisation du disque local</strong></th><th><strong>Temps de latence</strong></th></tr>
</thead>
<tbody>
<tr><td>Chargement complet traditionnel</td><td>Stockage d'objets → mémoire (100 %)</td><td>Très élevée (100 %)</td><td>Faible (temporaire uniquement)</td><td>Très faible et stable</td></tr>
<tr><td>MMap</td><td>Stockage d'objets → disque local (100 %) → mémoire (à la demande)</td><td>Faible (10-30%)</td><td>Élevé (100 %)</td><td>Faible et stable</td></tr>
<tr><td>Stockage hiérarchisé</td><td>Stockage d'objets ↔ cache local (données chaudes) → mémoire (à la demande)</td><td>Très faible (&lt;10%)</td><td>Faible (données chaudes uniquement)</td><td>Faible sur le cache hit, plus élevé sur le cache miss</td></tr>
</tbody>
</table>
<p><strong>Recommandation matérielle :</strong> les deux méthodes dépendent fortement des E/S disque locales, les <strong>disques SSD NVMe</strong> sont donc fortement recommandés, idéalement avec des <strong>IOPS supérieures à 10 000</strong>.</p>
<h3 id="MMap-vs-Tiered-Storage-Which-One-Should-You-Use" class="common-anchor-header">MMap vs. Tiered Storage : Lequel utiliser ?</h3><table>
<thead>
<tr><th><strong>Votre situation</strong></th><th><strong>Utiliser ceci</strong></th><th><strong>Pourquoi ?</strong></th></tr>
</thead>
<tbody>
<tr><td>Sensible à la latence (P99 &lt; 20ms)</td><td>MMap</td><td>Les données sont déjà sur le disque local - pas de recherche sur le réseau, latence stable</td></tr>
<tr><td>Accès uniforme (pas de répartition claire entre le chaud et le froid)</td><td>MMap</td><td>Le stockage hiérarchisé a besoin d'un décalage chaud/froid pour être efficace ; sans ce décalage, le taux de réussite du cache est faible.</td></tr>
<tr><td>Le coût est la priorité (des pics de latence occasionnels sont acceptables)</td><td>Stockage hiérarchisé</td><td>Économies de mémoire et de disque local (70 à 90 % de disque en moins)</td></tr>
<tr><td>Modèle chaud/froid clair (règle des 80/20)</td><td>Stockage hiérarchisé</td><td>Les données chaudes restent en cache, les données froides restent bon marché dans le stockage objet.</td></tr>
<tr><td>Très grande échelle (&gt;500M vecteurs)</td><td>Stockage hiérarchisé</td><td>Le disque local d'un nœud ne peut souvent pas contenir l'ensemble des données à cette échelle.</td></tr>
</tbody>
</table>
<p><strong>Remarque :</strong> MMap nécessite Milvus 2.3+. Le stockage hiérarchisé nécessite Milvus 2.6+. Les deux fonctionnent mieux avec des disques SSD NVMe (10 000+ IOPS recommandés).</p>
<h3 id="How-to-Configure-MMap" class="common-anchor-header">Comment configurer MMap</h3><p><strong>Option 1 : Configuration YAML (recommandée pour les nouveaux déploiements)</strong></p>
<p>Modifiez le fichier de configuration Milvus milvus.yaml et ajoutez les paramètres suivants dans la section queryNode :</p>
<pre><code translate="no">queryNode:
  mmap:
    vectorField: <span class="hljs-literal">true</span>      <span class="hljs-comment"># vector data</span>
    vectorIndex: <span class="hljs-literal">true</span>      <span class="hljs-comment"># vector index (largest source of savings!)</span>
    scalarField: <span class="hljs-literal">true</span>      <span class="hljs-comment"># scalar data (recommended for RAG workloads)</span>
    scalarIndex: <span class="hljs-literal">true</span>      <span class="hljs-comment"># scalar index</span>
    growingMmapEnabled: <span class="hljs-literal">false</span>  <span class="hljs-comment"># incremental data stays in memory</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Option 2 : Configuration Python SDK (pour les collections existantes)</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

<span class="hljs-comment"># You must release the collection before changing the mmap setting</span>
client.release_collection(<span class="hljs-string">&quot;my_collection&quot;</span>)

<span class="hljs-comment"># Enable MMap</span>
client.alter_collection_properties(
    collection_name=<span class="hljs-string">&quot;my_collection&quot;</span>,
    properties={<span class="hljs-string">&quot;mmap.enabled&quot;</span>: <span class="hljs-literal">True</span>}
)

<span class="hljs-comment"># Load the collection again to apply the MMap setting</span>
client.load_collection(<span class="hljs-string">&quot;my_collection&quot;</span>)

<span class="hljs-comment"># Verify that the setting has taken effect</span>
<span class="hljs-built_in">print</span>(client.describe_collection(<span class="hljs-string">&quot;my_collection&quot;</span>)[<span class="hljs-string">&quot;properties&quot;</span>])
<span class="hljs-comment"># Output: {&#x27;mmap.enabled&#x27;: &#x27;True&#x27;}</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-to-Configure-Tiered-Storage-Milvus-26+" class="common-anchor-header">Comment configurer le stockage hiérarchisé (Milvus 2.6+)</h3><p>Modifiez le fichier de configuration Milvus milvus.yaml et ajoutez les paramètres suivants dans la section queryNode :</p>
<pre><code translate="no">queryNode:
  segcore:
    tieredStorage:
      warmup:                                                                                                                                                      
          <span class="hljs-comment"># Options: sync, async, disable                      </span>
          <span class="hljs-comment"># Specifies when tiered storage cache warm-up happens.                                                                                                                             </span>
          <span class="hljs-comment"># - &quot;sync&quot;: data is loaded into the cache before the segment is considered fully loaded.                                                                                    </span>
          <span class="hljs-comment"># - &quot;disable&quot;: data is not proactively loaded into the cache, and is loaded only when needed by Search/Query tasks.                                                                            </span>
          <span class="hljs-comment"># The default is &quot;sync&quot;, but vector fields default to &quot;disable&quot;.                                                                                                            </span>
          scalarField: sync                                                                                                                                          
          scalarIndex: sync                                                                                                                                          
          vectorField: disable <span class="hljs-comment"># Cache warm-up for raw vector field data is disabled by default.</span>
          vectorIndex: sync
      memoryHighWatermarkRatio: <span class="hljs-number">0.85</span>   <span class="hljs-comment"># Start eviction when memory usage exceeds 85%</span>
      memoryLowWatermarkRatio: <span class="hljs-number">0.70</span>    <span class="hljs-comment"># Stop eviction when memory usage drops to 70%</span>
      diskHighWatermarkRatio: <span class="hljs-number">0.80</span>     <span class="hljs-comment"># High watermark for disk eviction</span>
      diskLowWatermarkRatio: <span class="hljs-number">0.75</span>      <span class="hljs-comment"># Low watermark for disk eviction</span>
      evictionEnabled: true            <span class="hljs-comment"># Must be enabled!</span>
      backgroundEvictionEnabled: true  <span class="hljs-comment"># Background eviction thread</span>
      cacheTtl: <span class="hljs-number">3600</span>                   <span class="hljs-comment"># Automatically evict if not accessed for 1 hour</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Use-Lower-Dimensional-Embeddings" class="common-anchor-header">Use Lower-Dimensional Embeddings<button data-href="#Use-Lower-Dimensional-Embeddings" class="anchor-icon" translate="no">
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
    </button></h2><p>Il est facile de l'oublier, mais la dimension influence directement votre coût. La mémoire, le stockage et le calcul augmentent linéairement avec le nombre de dimensions. Un modèle à 1536 dimensions coûte environ 4 fois plus d'infrastructure qu'un modèle à 384 dimensions pour les mêmes données.</p>
<p>Le coût des requêtes évolue de la même manière - la similarité cosinus est O(D), de sorte que les vecteurs de 768 dm nécessitent environ deux fois plus de calculs que les vecteurs de 384 dm par requête. Dans les charges de travail à haut QPS, cette différence se traduit directement par une réduction du nombre de nœuds nécessaires.</p>
<p>Voici comment les modèles d'intégration courants se comparent (en utilisant 384 dim comme référence 1.0x) :</p>
<table>
<thead>
<tr><th><strong>Modèle</strong></th><th><strong>Dimensions</strong></th><th><strong>Coût relatif</strong></th><th><strong>Rappel</strong></th><th><strong>Meilleur pour</strong></th></tr>
</thead>
<tbody>
<tr><td>texte-embedding-3-large</td><td>3072</td><td>8.0x</td><td>98%+</td><td>Lorsque la précision n'est pas négociable (recherche, soins de santé)</td></tr>
<tr><td>texte-encodage-3-petit</td><td>1536</td><td>4.0x</td><td>95-97%</td><td>Charges de travail RAG générales</td></tr>
<tr><td>DistilBERT</td><td>768</td><td>2.0x</td><td>92-95%</td><td>Bon équilibre coût-performance</td></tr>
<tr><td>tous-MiniLM-L6-v2</td><td>384</td><td>1.0x</td><td>88-92%</td><td>Charges de travail sensibles aux coûts</td></tr>
</tbody>
</table>
<p><strong>Conseil pratique :</strong> Ne partez pas du principe que vous avez besoin du modèle le plus grand. Testez sur un échantillon représentatif de vos requêtes réelles (1 million de vecteurs suffit généralement) et trouvez le modèle à la dimension la plus basse qui répond à vos critères de précision. De nombreuses équipes découvrent que 768 dimensions fonctionnent tout aussi bien que 1536 pour leur cas d'utilisation.</p>
<p><strong>Vous avez déjà opté pour un modèle à haute dimension ?</strong> Vous pouvez réduire les dimensions après coup. L'ACP (analyse en composantes principales) permet d'éliminer les caractéristiques redondantes, et les <a href="https://milvus.io/blog/matryoshka-embeddings-detail-at-multiple-scales.md">encastrements Matryoshka</a> vous permettent de vous limiter aux N premières dimensions tout en conservant l'essentiel de la qualité. Ces deux méthodes valent la peine d'être essayées avant d'intégrer à nouveau l'ensemble des données.</p>
<h2 id="Manage-Data-Lifecycle-with-Compaction-and-TTL" class="common-anchor-header">Gérer le cycle de vie des données avec le compactage et le TTL<button data-href="#Manage-Data-Lifecycle-with-Compaction-and-TTL" class="anchor-icon" translate="no">
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
    </button></h2><p>Ce point est moins prestigieux, mais il est tout de même important, en particulier pour les systèmes de production à long terme. Milvus utilise un modèle de stockage en annexe uniquement : lorsque vous supprimez des données, elles sont marquées comme supprimées mais ne sont pas supprimées immédiatement. Au fil du temps, ces données mortes s'accumulent, gaspillent de l'espace de stockage et obligent les requêtes à analyser plus de lignes que nécessaire.</p>
<h3 id="Compaction-Reclaim-Storage-from-Deleted-Data" class="common-anchor-header">Compaction : Récupérer l'espace de stockage des données supprimées</h3><p>Le compactage est le processus de nettoyage en arrière-plan de Milvus. Il fusionne les petits segments, supprime physiquement les données supprimées et réécrit les fichiers compactés. Ce processus est utile dans les cas suivants</p>
<ul>
<li>Vous avez des écritures et des suppressions fréquentes (catalogues de produits, mises à jour de contenu, journaux en temps réel).</li>
<li>Le nombre de segments ne cesse d'augmenter (ce qui accroît les frais généraux par requête).</li>
<li>L'utilisation du stockage augmente beaucoup plus rapidement que les données valides.</li>
</ul>
<p><strong>Attention :</strong> Le compactage est gourmand en E/S. Planifiez-le pendant les périodes de faible trafic (par exemple, la nuit) ou réglez les déclencheurs avec soin afin qu'il n'entre pas en concurrence avec les requêtes de production.</p>
<h3 id="TTLTime-to-Live-Automatically-Expire-Old-Vector-Data" class="common-anchor-header">TTL (Time to Live) : Expiration automatique des anciennes données vectorielles</h3><p>Pour les données qui expirent naturellement, le TTL est plus propre que la suppression manuelle. Définissez une durée de vie pour vos données et Milvus les marque automatiquement pour suppression lorsqu'elles expirent. Le compactage prend en charge le nettoyage proprement dit.</p>
<p>Ceci est utile pour :</p>
<ul>
<li>Journaux et données de session - ne conserver que les 7 ou 30 derniers jours</li>
<li>RAG sensibles au temps - préférer les connaissances récentes, laisser les anciens documents expirer.</li>
<li>Recommandations en temps réel - ne récupérer que les comportements récents de l'utilisateur.</li>
</ul>
<p>Ensemble, le compactage et le TTL empêchent votre système d'accumuler silencieusement des déchets. Ce n'est pas le levier de coût le plus important, mais il permet d'éviter le type d'augmentation lente de l'espace de stockage qui prend les équipes au dépourvu.</p>
<h2 id="One-More-Option-Zilliz-Cloud-Fully-Managed-Milvus" class="common-anchor-header">Une autre option : Zilliz Cloud (Milvus entièrement géré)<button data-href="#One-More-Option-Zilliz-Cloud-Fully-Managed-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Divulgation complète : <a href="https://zilliz.com/">Zilliz Cloud</a> est construit par la même équipe que Milvus, alors prenez ceci avec le grain de sel qui convient.</p>
<p>Cela dit, voici la partie contre-intuitive : même si Milvus est gratuit et open source, un service géré peut en fait coûter moins cher que l'auto-hébergement. La raison en est simple : le logiciel est gratuit, mais l'infrastructure en nuage pour le faire fonctionner ne l'est pas, et vous avez besoin d'ingénieurs pour l'exploiter et l'entretenir. Si un service géré peut faire le même travail avec moins de machines et moins d'heures d'ingénieur, votre facture totale diminue même après avoir payé le service lui-même.</p>
<p><a href="https://zilliz.com/">Zilliz Cloud</a> est un service entièrement géré fondé sur Milvus et compatible avec son API. Deux éléments ont une incidence sur le coût :</p>
<ul>
<li><strong>Une meilleure performance par nœud.</strong> Zilliz Cloud fonctionne sur Cardinal, notre moteur de recherche optimisé. D'après les <a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch">résultats de VectorDBBench</a>, il offre un débit 3 à 5 fois supérieur à celui de Milvus et est 10 fois plus rapide. En pratique, cela signifie que vous avez besoin d'environ un tiers à un cinquième du nombre de nœuds de calcul pour la même charge de travail.</li>
<li><strong>Optimisations intégrées.</strong> Les fonctionnalités abordées dans ce guide - MMap, stockage hiérarchisé et quantification d'index - sont intégrées et réglées automatiquement. La mise à l'échelle automatique ajuste la capacité en fonction de la charge réelle, de sorte que vous ne payez pas pour une marge de manœuvre dont vous n'avez pas besoin.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Howto_Cut_Vector_Database_Costsby_Upto80_A_Pract_1_5230ab94bf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>La<a href="https://zilliz.com/zilliz-migration-service">migration</a> est simple car les API et les formats de données sont compatibles. Zilliz fournit également un outil de migration pour vous aider. Pour une comparaison détaillée, voir : <a href="https://zilliz.com/zilliz-vs-milvus">Zilliz Cloud vs. Milvus</a></p>
<h2 id="Summary-A-Step-by-Step-Plan-to-Cut-Vector-Database-Costs" class="common-anchor-header">Résumé : un plan étape par étape pour réduire les coûts des bases de données vectorielles<button data-href="#Summary-A-Step-by-Step-Plan-to-Cut-Vector-Database-Costs" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Si vous ne faites qu'une chose, faites-la : vérifiez votre type d'index.</strong></p>
<p>Si vous exécutez HNSW sur une charge de travail sensible aux coûts, passez à IVF_SQ8. Cette seule mesure peut réduire le coût de la mémoire d'environ 70 % avec une perte de mémoire minimale.</p>
<p>Si vous souhaitez aller plus loin, voici l'ordre de priorité :</p>
<ul>
<li><strong>Changez d'index</strong> - HNSW → IVF_SQ8 pour la plupart des charges de travail. C'est la meilleure solution pour un changement d'architecture nul.</li>
<li><strong>Activer le MMap ou le stockage hiérarchisé</strong> - Arrêtez de tout garder en mémoire. Il s'agit d'un changement de configuration, pas d'une refonte.</li>
<li><strong>Évaluez vos dimensions d'intégration</strong> - Testez si un modèle plus petit répond à vos besoins de précision. Cela nécessite un nouvel encastrement, mais les économies réalisées sont considérables.</li>
<li><strong>Configurez le compactage et le TTL</strong> - Prévenez le gonflement silencieux des données, en particulier si vous avez des écritures/suppressions fréquentes.</li>
</ul>
<p>Combinées, ces stratégies peuvent réduire la facture de votre base de données vectorielle de 60 à 80 %. Toutes les équipes n'ont pas besoin de ces quatre stratégies. Commencez par modifier l'index, mesurez l'impact et descendez dans la liste.</p>
<p>Pour les équipes qui cherchent à réduire le travail opérationnel et à améliorer la rentabilité, <a href="https://zilliz.com/">Zilliz Cloud</a> (géré par Milvus) est une autre option.</p>
<p>Si vous travaillez sur l'une de ces optimisations et souhaitez comparer vos notes, la <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">communauté Milvus Slack</a> est un bon endroit pour poser des questions. Vous pouvez également participer aux <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a> pour discuter rapidement avec l'équipe d'ingénieurs de votre configuration spécifique.</p>
