---
id: choosing-a-vector-database-for-ann-search-at-reddit.md
title: Choix d'une base de données vectorielle pour la recherche ANN sur Reddit
author: Chris Fournie
date: 2025-11-28T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Nov_29_2025_12_03_05_AM_min_1_05250269a8.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, reddit'
meta_keywords: 'Milvus, vector database, reddit'
meta_title: |
  Choosing a vector database for ANN search at Reddit
desc: >-
  Cet article décrit le processus utilisé par l'équipe Reddit pour sélectionner
  la base de données vectorielles la plus appropriée et explique pourquoi elle a
  choisi Milvus.
origin: 'https://milvus.io/blog/choosing-a-vector-database-for-ann-search-at-reddit.md'
---
<p><em>Cet article a été rédigé par Chris Fournie, ingénieur logiciel chez Reddit, et publié à l'origine sur</em> <a href="https://www.reddit.com/r/RedditEng/comments/1ozxnjc/choosing_a_vector_database_for_ann_search_at/">Reddit</a>. Il est reproduit ici avec son autorisation.</p>
<p>En 2024, les équipes de Reddit ont utilisé diverses solutions pour effectuer une recherche vectorielle par approximation du plus proche voisin (ANN). Depuis la <a href="https://docs.cloud.google.com/vertex-ai/docs/vector-search/overview">recherche vectorielle Vertex AI</a> de Google et l'expérimentation de la <a href="https://solr.apache.org/guide/solr/latest/query-guide/dense-vector-search.html">recherche vectorielle ANN d'Apache Solr</a> pour certains grands ensembles de données, jusqu'à la <a href="https://github.com/facebookresearch/faiss">bibliothèque FAISS</a> de Facebook pour les petits ensembles de données (hébergés dans des wagons latéraux à échelle verticale). De plus en plus d'équipes de Reddit souhaitaient disposer d'une solution de recherche vectorielle ANN largement supportée, rentable, dotée des fonctionnalités de recherche souhaitées et capable de s'adapter aux données de la taille de Reddit. Pour répondre à ce besoin, nous avons recherché en 2025 la base de données vectorielle idéale pour les équipes de Reddit.</p>
<p>Ce billet décrit le processus que nous avons utilisé pour sélectionner la meilleure base de données vectorielles pour les besoins actuels de Reddit. Il ne décrit pas la meilleure base de données vectorielle en général, ni l'ensemble le plus essentiel d'exigences fonctionnelles et non fonctionnelles pour toutes les situations. Il décrit ce que Reddit et sa culture d'ingénierie ont valorisé et priorisé lors de la sélection d'une base de données vectorielle. Cet article peut servir d'inspiration pour votre propre collecte et évaluation des besoins, mais chaque organisation a sa propre culture, ses propres valeurs et ses propres besoins.</p>
<h2 id="Evaluation-process" class="common-anchor-header">Processus d'évaluation<button data-href="#Evaluation-process" class="anchor-icon" translate="no">
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
    </button></h2><p>Globalement, les étapes de sélection ont été les suivantes</p>
<p>1. Recueillir le contexte auprès des équipes</p>
<p>2. Évaluer qualitativement les solutions</p>
<p>3. Évaluer quantitativement les meilleurs candidats</p>
<p>4. Sélection finale</p>
<h3 id="1-Collect-context-from-teams" class="common-anchor-header">1. Collecte du contexte auprès des équipes</h3><p>Trois éléments de contexte ont été recueillis auprès des équipes intéressées par la recherche vectorielle ANN :</p>
<ul>
<li><p>Exigences fonctionnelles (par exemple, recherche vectorielle et lexicale hybride ? Requêtes de recherche par plage ? Filtrage par attributs non vectoriels)</p></li>
<li><p>Exigences non fonctionnelles (par exemple, peut-il prendre en charge 1B vecteurs ? Peut-il atteindre une latence P99 &lt;100ms ?).</p></li>
<li><p>Bases de données vectorielles auxquelles les équipes s'intéressaient déjà</p></li>
</ul>
<p>Il n'est pas facile d'interroger les équipes sur leurs besoins. Nombre d'entre elles décriront leurs besoins en fonction de la manière dont elles résolvent actuellement un problème, et votre défi consiste à comprendre et à éliminer ce biais.</p>
<p>Par exemple, une équipe utilisait déjà FAISS pour la recherche vectorielle ANN et a déclaré que la nouvelle solution devait renvoyer efficacement 10 000 résultats par appel de recherche. Après discussion, il s'est avéré que la raison de ces 10 000 résultats était qu'ils devaient effectuer un filtrage post hoc et que FAISS ne permettait pas de filtrer les résultats ANN au moment de la requête. Leur problème réel était qu'ils avaient besoin d'un filtrage, donc toute solution offrant un filtrage efficace suffirait, et le renvoi de 10 000 résultats était simplement une solution de contournement nécessaire pour améliorer leur rappel. Dans l'idéal, ils souhaiteraient pré-filtrer l'ensemble de la collection avant de trouver les plus proches voisins.</p>
<p>Il était également utile de demander aux équipes les bases de données vectorielles qu'elles utilisaient déjà ou qui les intéressaient. Si au moins une équipe a une opinion positive de sa solution actuelle, c'est un signe que la base de données vectorielle pourrait être une solution utile à partager dans l'ensemble de l'entreprise. Si les équipes n'ont que des avis négatifs sur une solution, nous ne devrions pas l'inclure comme option. Accepter les solutions qui intéressaient les équipes était aussi un moyen de s'assurer que les équipes se sentaient incluses dans le processus et nous a aidés à former une liste initiale des principaux candidats à évaluer ; il y a trop de solutions de recherche vectorielle ANN dans les bases de données nouvelles et existantes pour les tester toutes de manière exhaustive.</p>
<h3 id="2-Qualitatively-evaluate-solutions" class="common-anchor-header">2. Évaluer qualitativement les solutions</h3><p>À partir de la liste des solutions qui intéressaient les équipes, nous avons évalué qualitativement la solution de recherche vectorielle ANN qui répondait le mieux à nos besoins :</p>
<ul>
<li><p>recherché chaque solution et évalué la façon dont elle répondait à chaque exigence par rapport à l'importance pondérée de cette exigence</p></li>
<li><p>éliminé des solutions sur la base de critères qualitatifs et de discussions</p></li>
<li><p>Nous avons sélectionné les N meilleures solutions pour les tester quantitativement.</p></li>
</ul>
<p>Notre liste de départ de solutions de recherche vectorielle ANN incluait :</p>
<ul>
<li><p><a href="https://milvus.io/">Milvus</a></p></li>
<li><p>Qdrant</p></li>
<li><p>Weviate</p></li>
<li><p>Open Search</p></li>
<li><p>Pgvector (utilise déjà Postgres comme SGBDR)</p></li>
<li><p>Redis (déjà utilisé comme magasin et cache KV)</p></li>
<li><p>Cassandra (déjà utilisé pour la recherche non-ANN)</p></li>
<li><p>Solr (déjà utilisé pour la recherche lexicale et expérimenté avec la recherche vectorielle)</p></li>
<li><p>Vespa</p></li>
<li><p>Pinecone</p></li>
<li><p>Vertex AI (déjà utilisé pour la recherche vectorielle ANN)</p></li>
</ul>
<p>Nous avons ensuite pris toutes les exigences fonctionnelles et non fonctionnelles mentionnées par les équipes, ainsi que d'autres contraintes représentant nos valeurs et objectifs d'ingénierie, nous les avons inscrites dans une feuille de calcul et nous avons évalué leur importance (de 1 à 3, comme le montre le tableau abrégé ci-dessous).</p>
<p>Pour chaque solution comparée, nous avons évalué (sur une échelle de 0 à 3) dans quelle mesure chaque système répondait à cette exigence (comme le montre le tableau ci-dessous). La notation de cette manière étant quelque peu subjective, nous avons choisi un système et donné des exemples de notes accompagnés d'une justification écrite, et nous avons demandé aux évaluateurs de se référer à ces exemples. Nous avons également donné les indications suivantes pour l'attribution de chaque note : attribuer cette valeur si :</p>
<ul>
<li><p>0 : Pas de soutien/preuve de soutien aux exigences</p></li>
<li><p>1 : Soutien basique ou inadéquat de l'exigence</p></li>
<li><p>2 : Exigence raisonnablement prise en charge</p></li>
<li><p>3 : Prise en charge solide de l'exigence qui va au-delà des solutions comparables</p></li>
</ul>
<p>Nous avons ensuite créé une note globale pour chaque solution en faisant la somme du produit de la note de l'exigence d'une solution et de l'importance de cette exigence (par exemple, Qdrant a obtenu une note de 3 pour le reclassement/la combinaison des notes, qui a une importance de 2, donc 3 x 2 = 6, répétez cela pour toutes les lignes et faites la somme). Au final, nous obtenons une note globale qui peut être utilisée comme base pour classer et discuter des solutions, et des exigences les plus importantes (notez que la note n'est pas utilisée pour prendre une décision finale, mais comme outil de discussion).</p>
<p><strong><em>Note de l'éditeur :</em></strong> <em>cet examen était basé sur Milvus 2.4. Nous avons depuis déployé Milvus 2.5,</em> <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><em>Milvus 2.6</em></a><em>, et Milvus 3.0 est sur le point d'arriver, de sorte que certains chiffres peuvent être dépassés. Malgré cela, la comparaison offre toujours de bonnes perspectives et reste très utile.</em></p>
<table>
<thead>
<tr><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>Catégorie</strong></td><td><strong>Importance</strong></td><td><strong>Qdrant</strong></td><td><a href="https://milvus.io/"><strong>Milvus</strong></a> <strong>(2.4)</strong></td><td><strong>Cassandra</strong></td><td><strong>Weviate</strong></td><td><strong>Solr</strong></td><td><strong>Vertex AI</strong></td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Type de recherche</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">Recherche hybride</a></td><td>1</td><td>3</td><td>2</td><td>0</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Recherche par mot-clé</td><td>1</td><td>2</td><td>2</td><td>2</td><td>2</td><td>3</td><td>1</td></tr>
<tr><td>Recherche approximative de NN</td><td>3</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Plage de recherche</td><td>1</td><td>3</td><td>3</td><td>2</td><td>2</td><td>0</td><td>0</td></tr>
<tr><td>Re-rangement/combinaison des scores</td><td>2</td><td>3</td><td>2</td><td>0</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Méthode d'indexation</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>HNSW</td><td>3</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>Prise en charge de plusieurs méthodes d'indexation</td><td>3</td><td>0</td><td>3</td><td>1</td><td>2</td><td>1</td><td>1</td></tr>
<tr><td>Quantification</td><td>1</td><td>3</td><td>3</td><td>0</td><td>3</td><td>0</td><td>0</td></tr>
<tr><td>Hachage sensible à la localité (LSH)</td><td>1</td><td>0</td><td>0Note : <a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">Milvus 2.6 le prend en charge. </a></td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Données</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Types de vecteurs autres que flottants</td><td>1</td><td>2</td><td>2</td><td>0</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>Attributs de métadonnées sur les vecteurs (supporte des attributs multiples, une grande taille d'enregistrement, etc.)</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td>Options de filtrage des métadonnées (possibilité de filtrer sur les métadonnées, filtrage avant/après)</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td></tr>
<tr><td>Types de données des attributs de métadonnées (schéma robuste, par exemple bool, int, string, json, tableaux)</td><td>1</td><td>3</td><td>3</td><td>2</td><td>2</td><td>3</td><td>1</td></tr>
<tr><td>Limites des attributs de métadonnées (requêtes de plage, par exemple 10 &lt; x &lt; 15)</td><td>1</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td>Diversité des résultats par attribut (par exemple, ne pas obtenir plus de N résultats de chaque subreddit dans une réponse)</td><td>1</td><td>2</td><td>1</td><td>2</td><td>3</td><td>3</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Échelle</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Centaines de millions d'indices vectoriels</td><td>3</td><td>2</td><td>3</td><td></td><td>1</td><td>2</td><td>3</td></tr>
<tr><td>Indice vectoriel du milliard</td><td>1</td><td>2</td><td>2</td><td></td><td>1</td><td>2</td><td>2</td></tr>
<tr><td>Vecteurs de soutien au moins 2k</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td><td>1</td></tr>
<tr><td>Vecteurs de support supérieurs à 2k</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td><td>1</td><td>1</td></tr>
<tr><td>P95 Latence 50-100ms @ X QPS</td><td>3</td><td>2</td><td>2</td><td>2</td><td>1</td><td>1</td><td>2</td></tr>
<tr><td>P99 Latence &lt;= 10ms @ X QPS</td><td>3</td><td>2</td><td>2</td><td>2</td><td>3</td><td>1</td><td>2</td></tr>
<tr><td>Disponibilité à 99,9 % Récupération</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Disponibilité de 99,99 % indexation/stockage</td><td>2</td><td>1</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Opérations de stockage</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Hébergeable dans AWS</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>3</td><td>0</td></tr>
<tr><td>Multi-région</td><td>1</td><td>1</td><td>2</td><td>3</td><td>1</td><td>2</td><td>2</td></tr>
<tr><td>Mises à niveau sans temps d'arrêt</td><td>1</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td>Multi-cloud</td><td>1</td><td>3</td><td>3</td><td>3</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>APIs/Bibliothèques</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>gRPC</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td><td>2</td></tr>
<tr><td>API RESTful</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td>Aller à la bibliothèque</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td>Bibliothèque Java</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Python</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Autres langues (C++, Ruby, etc.)</td><td>1</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Opérations en cours d'exécution</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Mesures Prometheus</td><td>3</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>0</td></tr>
<tr><td>Opérations de base de la BD</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Insertions</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td><td>2</td></tr>
<tr><td>Opérateur Kubernetes</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>Pagination des résultats</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>Intégration d'une recherche par ID</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Renvoyer les emboîtements avec l'ID du candidat et les scores du candidat</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>ID fourni par l'utilisateur</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Capable d'effectuer des recherches dans un contexte de lots à grande échelle</td><td>1</td><td>2</td><td>1</td><td>1</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td>Sauvegardes / Instantanés : permet de créer des sauvegardes de l'ensemble de la base de données.</td><td>1</td><td>2</td><td>2</td><td>2</td><td>3</td><td>3</td><td>2</td></tr>
<tr><td>Prise en charge efficace des grands index (distinction entre le stockage à froid et le stockage à chaud)</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Soutien/Communauté</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Neutralité vis-à-vis des fournisseurs</td><td>3</td><td>3</td><td>2</td><td>3</td><td>2</td><td>3</td><td>0</td></tr>
<tr><td>Support api robuste</td><td>3</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Soutien aux fournisseurs</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>Vélocité de la Communauté</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>Base d'utilisateurs de la production</td><td>2</td><td>3</td><td>3</td><td>2</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td>Sentiment d'appartenance à la communauté</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td>Étoiles Github</td><td>1</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Configuration</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Traitement des secrets</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td><td>2</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Source d'information</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Source ouverte</td><td>3</td><td>3</td><td>3</td><td>3</td><td>2</td><td>3</td><td>0</td></tr>
<tr><td>Langue</td><td>2</td><td>3</td><td>3</td><td>2</td><td>3</td><td>2</td><td>0</td></tr>
<tr><td>Communiqués de presse</td><td>2</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Essais en amont</td><td>1</td><td>2</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Disponibilité de la documentation</td><td>3</td><td>3</td><td>3</td><td>2</td><td>1</td><td>2</td><td>1</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Coût</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Coût Efficace</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Performance</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Prise en charge de l'optimisation de l'utilisation des ressources pour l'unité centrale, la mémoire et le disque</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Mise en commun multi-nœuds (pod)</td><td>3</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Avoir la capacité de régler le système pour trouver un équilibre entre la latence et le débit</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Partitionnement défini par l'utilisateur (écritures)</td><td>1</td><td>3</td><td>2</td><td>3</td><td>1</td><td>2</td><td>0</td></tr>
<tr><td>Multi-locataires</td><td>1</td><td>3</td><td>2</td><td>1</td><td>3</td><td>2</td><td>2</td></tr>
<tr><td>Cloisonnement</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Réplication</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Redondance</td><td>1</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Basculement automatique</td><td>3</td><td>2</td><td>0 Note : <a href="https://milvus.io/docs/coordinator_ha.md">Milvus 2.6 le prend en charge. </a></td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Équilibrage de la charge</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Support GPU</td><td>1</td><td>0</td><td>2</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td></td><td></td><td><strong>Qdrant</strong></td><td><a href="https://milvus.io/"><strong>Milvus</strong></a></td><td><strong>Cassandre</strong></td><td><strong>Weviate</strong></td><td><strong>Solr</strong></td><td><strong>Vertex AI</strong></td></tr>
<tr><td><strong>Score global de la solution</strong></td><td></td><td>292</td><td>281</td><td>264</td><td>250</td><td>242</td><td>173</td></tr>
</tbody>
</table>
<p>Nous avons discuté des notes globales et des notes attribuées aux exigences des différents systèmes et nous avons cherché à comprendre si nous avions correctement pondéré l'importance des exigences et si certaines exigences étaient si importantes qu'elles devaient être considérées comme des contraintes fondamentales. L'une des exigences que nous avons identifiées était de savoir si la solution était open-source ou non, car nous souhaitions une solution dans laquelle nous pourrions nous impliquer, contribuer et résoudre rapidement de petits problèmes si nous en rencontrions à notre échelle. Contribuer et utiliser des logiciels open-source est un élément important de la culture d'ingénierie de Reddit. Les solutions hébergées uniquement (Vertex AI, Pinecone) ont donc été éliminées de notre réflexion.</p>
<p>Au cours des discussions, nous avons constaté que quelques autres exigences clés étaient d'une importance capitale pour nous :</p>
<ul>
<li><p>Échelle et fiabilité : nous voulions voir des preuves que d'autres entreprises utilisaient la solution avec plus de 100 millions de vecteurs, voire 1 milliard.</p></li>
<li><p>Communauté : Nous voulions une solution avec une communauté saine et dynamique dans cet espace en pleine évolution.</p></li>
<li><p>Types de métadonnées et filtrage expressifs pour permettre davantage de cas d'utilisation (filtrage par date, booléen, etc.)</p></li>
<li><p>Prise en charge de plusieurs types d'index (pas seulement HNSW ou DiskANN) pour mieux adapter les performances à nos nombreux cas d'utilisation uniques.</p></li>
</ul>
<p>Le résultat de nos discussions et l'affinement de nos exigences clés nous ont conduits à choisir de tester (dans l'ordre) quantitativement :</p>
<ol>
<li><p>Qdrant</p></li>
<li><p>Milvus</p></li>
<li><p>Vespa, et</p></li>
<li><p>Weviate</p></li>
</ol>
<p>Malheureusement, de telles décisions prennent du temps et des ressources, et aucune organisation ne dispose d'une quantité illimitée de ces deux éléments. Compte tenu de notre budget, nous avons décidé de tester Qdrant et Milvus, et de laisser les tests de Vespa et Weviate comme objectifs secondaires.</p>
<p>Qdrant vs Milvus était également un test intéressant de deux architectures différentes :</p>
<ul>
<li><p><strong>Qdrant :</strong> Types de nœuds homogènes qui effectuent toutes les opérations de la base de données vectorielles ANN.</p></li>
<li><p><strong>Milvus :</strong> <a href="https://milvus.io/docs/architecture_overview.md">types de nœuds hétérogènes</a> (Milvus ; un pour les requêtes, un autre pour l'indexation, un autre pour l'ingestion de données, un proxy, etc.)</p></li>
</ul>
<p>Lequel des deux était facile à configurer (un test de leur documentation) ? Lequel était facile à exécuter (un test de leurs fonctions de résilience et de leur polissage) ? Et lequel était le plus performant pour les cas d'utilisation et l'échelle qui nous intéressaient ? Nous avons cherché à répondre à ces questions en comparant quantitativement les solutions.</p>
<h3 id="3-Quantitatively-evaluate-top-contenders" class="common-anchor-header">3. Évaluer quantitativement les meilleures solutions</h3><p>Nous voulions mieux comprendre le degré d'évolutivité de chaque solution et, dans la foulée, découvrir ce que seraient l'installation, la configuration, la maintenance et l'exécution de chaque solution à grande échelle. Pour ce faire, nous avons collecté trois ensembles de données de vecteurs de documents et de requêtes pour trois cas d'utilisation différents, configuré chaque solution avec des ressources similaires dans Kubernetes, chargé des documents dans chaque solution et envoyé des charges de requêtes identiques à l'aide de <a href="https://k6.io/">K6 de Grafana</a> avec un exécuteur de taux d'arrivée de montée en puissance pour chauffer les systèmes avant d'atteindre un débit cible (par exemple, 100 QPS).</p>
<p>Nous avons testé le débit, le point de rupture de chaque solution, la relation entre le débit et la latence, et la façon dont ils réagissent à la perte de nœuds sous charge (taux d'erreur, impact sur la latence, etc.). L'<strong>effet du filtrage sur la latence</strong> était particulièrement intéressant. Nous avons également effectué des tests simples de type oui/non pour vérifier qu'une capacité décrite dans la documentation fonctionnait comme prévu (par exemple, insertions, suppressions, obtention par ID, administration des utilisateurs, etc.</p>
<p><strong>Les tests ont été effectués sur Milvus v2.4 et Qdrant v1.12.</strong> En raison de contraintes de temps, nous n'avons pas réglé ou testé de manière exhaustive tous les types de paramètres d'index ; des paramètres similaires ont été utilisés avec chaque solution, avec un biais en faveur d'un rappel ANN élevé, et les tests se sont concentrés sur les performances des index HNSW. Des ressources similaires en termes d'unité centrale et de mémoire ont également été attribuées à chaque solution.</p>
<p>Lors de notre expérimentation, nous avons constaté quelques différences intéressantes entre les deux solutions. Dans les expériences suivantes, chaque solution avait environ 340M Reddit post vectors de 384 dimensions chacun, pour HNSW, M=16, et efConstruction=100.</p>
<p>Dans une expérience, nous avons constaté que pour le même débit de requête (100 QPS sans ingestion en même temps), l'ajout du filtrage affectait la latence de Milvus plus que celle de Qdrant.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Post_query_latency_with_filtering_2cb4c03d5b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Temps de latence des requêtes avec filtrage</p>
<p>Par ailleurs, nous avons constaté qu'il y avait beaucoup plus d'interaction entre l'ingestion et la charge des requêtes sur Qdrant que sur Milvus (illustré ci-dessous à débit constant). Ceci est probablement dû à leur architecture ; Milvus répartit une grande partie de son ingestion sur des types de nœuds distincts de ceux qui servent le trafic de requête, alors que Qdrant sert à la fois l'ingestion et le trafic de requête à partir des mêmes nœuds.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Posts_query_latency_100_QPS_during_ingest_e919a448cb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Posts query latency @ 100 QPS during ingest</p>
<p>En testant la diversité des résultats par attribut (par exemple, ne pas obtenir plus de N résultats de chaque subreddit dans une réponse), nous avons constaté que pour le même débit, Milvus avait une latence pire que Qdrant (à 100 QPS).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Post_query_latency_with_result_diversity_b126f562cd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Temps de latence après la requête et diversité des résultats</p>
<p>Nous avons également voulu voir comment chaque solution s'adaptait à l'ajout de nouvelles répliques de données (c'est-à-dire que le facteur de réplication, RF, passait de 1 à 2). Dans un premier temps, avec RF=1, Qdrant nous a donné une latence satisfaisante pour un débit supérieur à celui de Milvus (le QPS supérieur n'est pas indiqué car les tests ne se sont pas terminés sans erreurs).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Qdrant_posts_RF_1_latency_for_varying_throughput_bc161c8b1c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qdrant affiche une latence RF=1 pour un débit variable</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_posts_RF_1_latency_for_varying_throughput_e81775b3af.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus affiche une latence RF=1 pour un débit variable</p>
<p>Cependant, en augmentant le facteur de réplication, la latence p99 de Qdrant s'est améliorée, mais Milvus a pu maintenir un débit plus élevé que Qdrant, avec une latence acceptable (Qdrant 400 QPS non indiqué car le test ne s'est pas terminé en raison d'une latence élevée et d'erreurs).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_posts_RF_2_latency_for_varying_throughput_7737dfb8a3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus affiche une latence RF=2 pour un débit variable.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Qdrant_posts_RF_2_latency_for_varying_throughput_13fb26aaa1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qdrant affiche une latence RF=2 pour un débit variable</p>
<p>En raison de contraintes de temps, nous n'avons pas eu le temps de comparer le rappel ANN entre les solutions sur nos ensembles de données, mais nous avons pris en compte les mesures de rappel ANN pour les solutions fournies par <a href="https://ann-benchmarks.com/">https://ann-benchmarks.com/</a> sur des ensembles de données accessibles au public.</p>
<h3 id="4-Final-selection" class="common-anchor-header">4. Sélection finale</h3><p><strong>Du point de vue des performances</strong>, sans beaucoup de réglages et en utilisant uniquement HNSW, Qdrant a semblé avoir une meilleure latence brute que Milvus dans de nombreux tests. Milvus semblait toutefois mieux s'adapter à une réplication accrue et offrait une meilleure isolation entre l'ingestion et la charge de la requête grâce à son architecture à nœuds multiples.</p>
<p><strong>Sur le plan opérationnel,</strong> malgré la complexité de l'architecture de Milvus (plusieurs types de nœuds, dépendant d'un journal d'écriture externe comme Kafka et d'un magasin de métadonnées comme etcd), nous avons eu plus de facilité à déboguer et à réparer Milvus que Qdrant lorsque l'une ou l'autre des solutions s'est retrouvée dans un mauvais état. Milvus dispose également d'un rééquilibrage automatique lors de l'augmentation du facteur de réplication d'une collection, alors que dans Qdrant open-source, la création manuelle ou l'abandon de shards est nécessaire pour augmenter le facteur de réplication (une fonctionnalité que nous aurions dû construire nous-mêmes ou utiliser la version non-open-source).</p>
<p>Milvus est une technologie plus "Reddit" que Qdrant ; elle partage plus de similitudes avec le reste de notre pile technologique. Milvus est écrit en Golang, notre langage de programmation backend préféré, et il est donc plus facile pour nous d'y contribuer que Qdrant, qui est écrit en Rust. Milvus a une excellente vélocité de projet pour son offre open-source par rapport à Qdrant, et il répondait à plus de nos exigences clés.</p>
<p>En fin de compte, les deux solutions ont répondu à la plupart de nos exigences, et dans certains cas, Qdrant avait un avantage en termes de performances, mais nous avons estimé que nous pouvions faire évoluer Milvus davantage, que nous étions plus à l'aise pour l'utiliser, et qu'il correspondait mieux à notre organisation que Qdrant. Nous aurions aimé avoir plus de temps pour tester Vespa et Weaviate, mais ils ont également été sélectionnés pour des raisons d'organisation (Vespa étant basé sur Java) et d'architecture (Weaviate étant de type single-node comme Qdrant).</p>
<h2 id="Key-takeaways" class="common-anchor-header">Principaux enseignements<button data-href="#Key-takeaways" class="anchor-icon" translate="no">
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
<li><p>Remettez en question les exigences qui vous sont imposées et essayez d'éliminer les préjugés sur les solutions existantes.</p></li>
<li><p>Attribuez une note aux solutions candidates et utilisez-la pour éclairer la discussion sur les exigences essentielles, et non pas comme une fin en soi.</p></li>
<li><p>Évaluez quantitativement les solutions, mais en cours de route, prenez note de ce que c'est que de travailler avec la solution.</p></li>
<li><p>Choisissez la solution qui convient le mieux à votre organisation du point de vue de la maintenance, des coûts, de la convivialité et des performances, et pas seulement parce qu'elle est la plus performante.</p></li>
</ul>
<h2 id="Acknowledgements" class="common-anchor-header">Remerciements<button data-href="#Acknowledgements" class="anchor-icon" translate="no">
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
    </button></h2><p>Ce travail d'évaluation a été réalisé par Ben Kochie, Charles Njoroge, Amit Kumar et moi-même. Nous remercions également les autres personnes qui ont contribué à ce travail, notamment Annie Yang, Konrad Reiche, Sabrina Kong et Andrew Johnson, pour la recherche de solutions qualitatives.</p>
<h2 id="Editor’s-Notes" class="common-anchor-header">Notes de l'éditeur<button data-href="#Editor’s-Notes" class="anchor-icon" translate="no">
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
    </button></h2><p>Nous tenons à remercier sincèrement l'équipe d'ingénieurs de Reddit, non seulement pour avoir choisi Milvus pour leurs charges de travail de recherche vectorielle, mais aussi pour avoir pris le temps de publier une évaluation aussi détaillée et équitable. Il est rare de voir ce niveau de transparence dans la manière dont de véritables équipes d'ingénieurs comparent les bases de données, et leur rapport sera utile à tous les membres de la communauté Milvus (et au-delà) qui essaient de comprendre le paysage croissant des bases de données vectorielles.</p>
<p>Comme Chris le mentionne dans son article, il n'existe pas de "meilleure" base de données vectorielles. Ce qui compte, c'est de savoir si un système correspond à votre charge de travail, à vos contraintes et à votre philosophie opérationnelle. La comparaison de Reddit reflète bien cette réalité. Milvus n'est pas en tête de toutes les catégories, et c'est tout à fait normal étant donné les compromis entre les différents modèles de données et les objectifs de performance.</p>
<p>Une chose mérite d'être clarifiée : L'évaluation de Reddit a utilisé <strong>Milvus 2.4</strong>, qui était la version stable à l'époque. Certaines fonctionnalités, comme LSH et plusieurs optimisations d'index, n'existaient pas encore ou n'étaient pas mûres dans la version 2.4, de sorte que certains scores reflètent naturellement cette ancienne base de référence. Depuis, nous avons publié Milvus 2.5 puis <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><strong>Milvus 2.6</strong></a>, et c'est un système très différent en termes de performances, d'efficacité et de flexibilité. La réponse de la communauté a été forte et de nombreuses équipes ont déjà procédé à la mise à niveau.</p>
<p><strong>Voici un aperçu des nouveautés de Milvus 2.6 :</strong></p>
<ul>
<li><p>Jusqu'à <strong>72 % de réduction de l'utilisation de la mémoire</strong> et des <strong>requêtes 4× plus rapides</strong> avec la quantification à 1 bit RaBitQ</p></li>
<li><p><strong>Réduction des coûts de 50 %</strong> grâce au stockage intelligent à plusieurs niveaux</p></li>
<li><p><strong>Recherche plein texte BM25 4 fois plus rapide</strong> qu'Elasticsearch</p></li>
<li><p><strong>Filtrage JSON 100× plus rapide</strong> avec le nouveau Path Index</p></li>
<li><p>Une nouvelle architecture sans disque pour une recherche plus fraîche à moindre coût</p></li>
<li><p>Un flux de travail "data-in, data-out" plus simple pour intégrer des pipelines</p></li>
<li><p>Prise en charge de <strong>plus de 100 000 collections</strong> pour gérer les grands environnements multi-tenants.</p></li>
</ul>
<p>Si vous souhaitez obtenir une analyse complète, voici quelques bonnes informations complémentaires :</p>
<ul>
<li><p>Blog : <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Présentation de Milvus 2.6 : Recherche vectorielle abordable à l'échelle du milliard</a></p></li>
<li><p><a href="https://milvus.io/docs/release_notes.md">Notes de mise à jour de Milvus 2.6 : </a></p></li>
<li><p><a href="https://milvus.io/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md">VDBBench 1.0 : Analyse comparative du monde réel pour les bases de données vectorielles - Milvus Blog</a></p></li>
</ul>
<p>Vous avez des questions ou souhaitez approfondir une fonctionnalité ? Rejoignez notre<a href="https://discord.com/invite/8uyFbECzPX"> canal Discord</a> ou déposez des questions sur<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Vous pouvez également réserver une session individuelle de 20 minutes pour obtenir des informations, des conseils et des réponses à vos questions dans le cadre des<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
