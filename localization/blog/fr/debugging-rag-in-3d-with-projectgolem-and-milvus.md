---
id: debugging-rag-in-3d-with-projectgolem-and-milvus.md
title: >-
  Et si vous pouviez voir pourquoi RAG échoue ? Débogage de RAG en 3D avec
  Project_Golem et Milvus
author: Min Yin
date: 2026-02-18T00:00:00.000Z
cover: assets.zilliz.com/Debugging_RAG_in_3_D_f1b45f9a99_5f98979c06.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, RAG'
meta_keywords: 'Project_Golem, milvus, RAG'
meta_title: |
  Debugging RAG in 3D with Project_Golem and Milvus
desc: >-
  Découvrez comment Project_Golem et Milvus rendent les systèmes RAG observables
  en visualisant l'espace vectoriel, en déboguant les erreurs de recherche et en
  adaptant la recherche vectorielle en temps réel.
origin: 'https://milvus.io/blog/debugging-rag-in-3d-with-projectgolem-and-milvus.md'
---
<p>Lorsque la recherche par RAG ne fonctionne pas, vous savez généralement qu'elle est défectueuse - les documents pertinents n'apparaissent pas, ou les documents non pertinents apparaissent. Mais c'est une autre histoire que de comprendre pourquoi. Tout ce dont vous disposez, ce sont des scores de similarité et une liste plate de résultats. Il n'y a aucun moyen de voir comment les documents sont réellement positionnés dans l'espace vectoriel, comment les morceaux sont liés les uns aux autres, ou où votre requête a atterri par rapport au contenu auquel elle aurait dû correspondre. En pratique, cela signifie que le débogage des RAG se fait principalement par essais et erreurs : modifier la stratégie de découpage, changer le modèle d'intégration, ajuster le top-k, et espérer que les résultats s'améliorent.</p>
<p><a href="https://github.com/CyberMagician/Project_Golem">Project_Golem</a> est un outil open-source qui rend l'espace vectoriel visible. Il utilise UMAP pour projeter des encastrements à haute dimension en 3D et Three.js pour les rendre interactifs dans le navigateur. Au lieu de deviner pourquoi la recherche a échoué, vous pouvez voir comment les morceaux se regroupent sémantiquement, où votre requête atterrit et quels documents ont été récupérés - le tout dans une seule interface visuelle.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/debugging_rag_in_3d_with_projectgolem_and_milvus_1_01de566e04.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>C'est extraordinaire. Cependant, le projet original Project_Golem a été conçu pour de petites démonstrations, et non pour des systèmes réels. Il s'appuie sur des fichiers plats, une recherche brute et des reconstructions de l'ensemble des données, ce qui signifie qu'il s'effondre rapidement lorsque vos données dépassent quelques milliers de documents.</p>
<p>Pour combler cette lacune, nous avons intégré Project_Golem avec <a href="https://milvus.io/docs/release_notes.md#v268">Milvus</a> (plus précisément la version 2.6.8) en tant qu'épine dorsale vectorielle. Milvus est une base de données vectorielles haute performance open-source qui gère l'ingestion en temps réel, l'indexation évolutive et la recherche à la milliseconde, tandis que Project_Golem reste concentré sur ce qu'il fait de mieux : rendre visible le comportement de la recherche vectorielle. Ensemble, ils transforment la visualisation 3D d'une démo jouet en un outil de débogage pratique pour les systèmes RAG de production.</p>
<p>Dans ce billet, nous allons présenter Project_Golem et montrer comment nous l'avons intégré à Milvus pour rendre le comportement de recherche vectorielle observable, évolutif et prêt pour la production.</p>
<h2 id="What-Is-ProjectGolem" class="common-anchor-header">Qu'est-ce que Project_Golem ?<button data-href="#What-Is-ProjectGolem" class="anchor-icon" translate="no">
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
    </button></h2><p>Le débogage RAG est difficile pour une raison simple : les espaces vectoriels sont à haute dimension et les humains ne peuvent pas les voir.</p>
<p><a href="https://github.com/CyberMagician/Project_Golem">Project_Golem</a> est un outil basé sur un navigateur qui vous permet de voir l'espace vectoriel dans lequel votre système RAG fonctionne. Il prend les encastrements à haute dimension qui alimentent la recherche - typiquement 768 ou 1536 dimensions - et les projette dans une scène interactive en 3D que vous pouvez explorer directement.</p>
<p>Voici comment cela fonctionne sous le capot :</p>
<ul>
<li>Réduction de la dimensionnalité avec UMAP. Project_Golem utilise UMAP pour comprimer des vecteurs à haute dimension en trois dimensions tout en préservant leurs distances relatives. Les morceaux qui sont sémantiquement similaires dans l'espace d'origine restent proches les uns des autres dans la projection 3D ; les morceaux qui n'ont pas de rapport entre eux se retrouvent éloignés les uns des autres.</li>
<li>Rendu 3D avec Three.js. Chaque morceau de document apparaît comme un nœud dans une scène 3D rendue dans le navigateur. Vous pouvez faire pivoter, zoomer et explorer l'espace pour voir comment vos documents se regroupent - quels sujets sont étroitement liés, lesquels se chevauchent et où se situent les limites.</li>
<li>Mise en évidence au moment de la requête. Lorsque vous lancez une requête, la recherche s'effectue toujours dans l'espace à haute dimension d'origine en utilisant la similarité cosinusoïdale. Mais une fois les résultats obtenus, les morceaux retrouvés s'illuminent dans la vue en 3D. Vous pouvez immédiatement voir où votre requête a atterri par rapport aux résultats - et, ce qui est tout aussi important, par rapport aux documents qu'elle n'a pas retrouvés.</li>
</ul>
<p>C'est ce qui rend Project_Golem utile pour le débogage. Au lieu de regarder une liste de résultats classés et de deviner pourquoi un document pertinent n'a pas été retrouvé, vous pouvez voir s'il se trouve dans un groupe éloigné (un problème d'intégration), s'il se superpose à un contenu non pertinent (un problème de regroupement) ou s'il est juste en dehors du seuil de récupération (un problème de configuration). La vue 3D transforme les scores de similarité abstraits en relations spatiales sur lesquelles il est possible de raisonner.</p>
<h2 id="Why-ProjectGolem-Isnt-Production-Ready" class="common-anchor-header">Pourquoi Project_Golem n'est pas prêt pour la production<button data-href="#Why-ProjectGolem-Isnt-Production-Ready" class="anchor-icon" translate="no">
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
    </button></h2><p>Le projet_Golem a été conçu comme un prototype de visualisation, et il fonctionne bien pour cela. Mais son architecture repose sur des hypothèses qui s'effondrent rapidement à grande échelle - d'une manière qui a de l'importance si vous voulez l'utiliser pour le débogage de RAG dans le monde réel.</p>
<h3 id="Every-Update-Requires-a-Full-Rebuild" class="common-anchor-header">Chaque mise à jour nécessite une reconstruction complète</h3><p>Il s'agit de la limitation la plus fondamentale. Dans la conception originale, l'ajout de nouveaux documents déclenche une reconstruction complète du pipeline : les embeddings sont régénérés et écrits dans des fichiers .npy, UMAP est réexécuté sur l'ensemble du jeu de données et les coordonnées 3D sont réexportées sous forme de JSON.</p>
<p>Même à l'échelle de 100 000 documents, une exécution UMAP à cœur unique prend de 5 à 10 minutes. À l'échelle du million de documents, cela devient totalement impraticable. Vous ne pouvez pas utiliser cette méthode pour les ensembles de données qui changent continuellement (flux d'actualités, documentation, conversations d'utilisateurs), car chaque mise à jour implique d'attendre un cycle de retraitement complet.</p>
<h3 id="Brute-Force-Search-Doesnt-Scale" class="common-anchor-header">La recherche musclée n'est pas évolutive</h3><p>La recherche a son propre plafond. L'implémentation originale utilise NumPy pour la recherche brute de similarité cosinus - complexité temporelle linéaire, pas d'indexation. Sur un ensemble de données d'un million de documents, une seule requête peut prendre plus d'une seconde. C'est inutilisable pour un système interactif ou en ligne.</p>
<p>La pression sur la mémoire aggrave le problème. Chaque vecteur float32 de 768 dimensions occupe environ 3 Ko, de sorte qu'un ensemble de données d'un million de vecteurs nécessite plus de 3 Go de mémoire - le tout chargé dans un tableau NumPy plat sans structure d'indexation pour rendre la recherche efficace.</p>
<h3 id="No-Metadata-Filtering-No-Multi-Tenancy" class="common-anchor-header">Pas de filtrage des métadonnées, pas de multilocation</h3><p>Dans un système RAG réel, la similarité vectorielle est rarement le seul critère de recherche. Il est presque toujours nécessaire de filtrer par métadonnées, comme le type de document, l'horodatage, les autorisations de l'utilisateur ou les limites de l'application. Un système RAG de support client, par exemple, doit limiter la recherche aux documents d'un locataire spécifique - et non pas à l'ensemble des données.</p>
<p>Project_Golem ne supporte rien de tout cela. Il n'y a pas d'index ANN (comme HNSW ou IVF), pas de filtrage scalaire, pas d'isolation des locataires et pas de recherche hybride. Il s'agit d'une couche de visualisation sans moteur de recherche de production.</p>
<h2 id="How-Milvus-Powers-ProjectGolem’s-Retrieval-Layer" class="common-anchor-header">Comment Milvus alimente la couche de recherche de Project_Golem<button data-href="#How-Milvus-Powers-ProjectGolem’s-Retrieval-Layer" class="anchor-icon" translate="no">
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
    </button></h2><p>La section précédente a identifié trois lacunes : les reconstructions complètes à chaque mise à jour, la recherche par force brute et l'absence de récupération tenant compte des métadonnées. Ces trois lacunes ont la même origine : Project_Golem n'a pas de couche de base de données. La récupération, le stockage et la visualisation sont enchevêtrés dans un seul pipeline, de sorte que la modification de n'importe quelle partie oblige à tout reconstruire.</p>
<p>La solution n'est pas d'optimiser ce pipeline. Il s'agit de le séparer.</p>
<p>En intégrant Milvus 2.6.8 en tant qu'épine dorsale vectorielle, la récupération devient une couche dédiée, de qualité production, qui fonctionne indépendamment de la visualisation. Milvus gère le stockage, l'indexation et la recherche des vecteurs. Project_Golem se concentre uniquement sur le rendu - en consommant les identifiants de documents de Milvus et en les mettant en évidence dans la vue 3D.</p>
<p>Cette séparation produit deux flux propres et indépendants :</p>
<p>Flux de recherche (en ligne, au niveau de la milliseconde)</p>
<ul>
<li>Votre requête est convertie en un vecteur à l'aide des embeddings OpenAI.</li>
<li>Le vecteur de la requête est envoyé à une collection Milvus.</li>
<li>Milvus AUTOINDEX sélectionne et optimise l'index approprié.</li>
<li>Une recherche de similarité cosinus en temps réel renvoie les ID des documents pertinents.</li>
</ul>
<p>Flux de visualisation (hors ligne, à l'échelle de la démonstration)</p>
<ul>
<li>UMAP génère des coordonnées 3D pendant l'ingestion des données (n_neighbors=30, min_dist=0.1).</li>
<li>Les coordonnées sont stockées dans golem_cortex.json.</li>
<li>Le frontend met en évidence les nœuds 3D correspondants en utilisant les ID des documents renvoyés par Milvus.</li>
</ul>
<p>Le point critique : la recherche n'attend plus la visualisation. Vous pouvez ingérer de nouveaux documents et les rechercher immédiatement - la vue en 3D les rattrape selon son propre calendrier.</p>
<h3 id="What-Streaming-Nodes-Change" class="common-anchor-header">Ce que les nœuds de streaming changent</h3><p>Cette ingestion en temps réel est assurée par une nouvelle fonctionnalité de Milvus 2.6.8 : les <a href="https://milvus.io/docs/configure_streamingnode.md#streamingNode-related-Configurations">nœuds de diffusion en continu</a>. Dans les versions précédentes, l'ingestion en temps réel nécessitait une file d'attente de messages externe telle que Kafka ou Pulsar. Les nœuds de flux déplacent cette coordination dans Milvus lui-même - les nouveaux vecteurs sont ingérés en continu, les index sont mis à jour de manière incrémentielle et les documents nouvellement ajoutés deviennent immédiatement consultables sans reconstruction complète et sans dépendances externes.</p>
<p>Pour le Projet_Golem, c'est ce qui rend l'architecture pratique. Vous pouvez continuer à ajouter des documents à votre système RAG - nouveaux articles, documents mis à jour, contenu généré par les utilisateurs - et la recherche reste à jour sans déclencher le coûteux cycle UMAP → JSON → rechargement.</p>
<h3 id="Extending-Visualization-to-Million-Scale-Future-Path" class="common-anchor-header">Extension de la visualisation à l'échelle du million (voie future)</h3><p>Avec cette configuration soutenue par Milvus, Project_Golem prend actuellement en charge des démonstrations interactives pour environ 10 000 documents. L'extraction s'étend bien au-delà - Milvus gère des millions - mais le pipeline de visualisation repose toujours sur des exécutions UMAP par lots. Pour combler cette lacune, l'architecture peut être étendue avec un pipeline de visualisation incrémental :</p>
<ul>
<li><p>Déclencheurs de mise à jour : Le système est à l'écoute des événements d'insertion dans la collection Milvus. Lorsque les documents nouvellement ajoutés atteignent un seuil défini (par exemple, 1 000 éléments), une mise à jour incrémentale est déclenchée.</p></li>
<li><p>Projection incrémentielle : Au lieu de réexécuter l'UMAP sur l'ensemble du jeu de données, les nouveaux vecteurs sont projetés dans l'espace 3D existant à l'aide de la méthode transform() de l'UMAP. Cela permet de préserver la structure globale tout en réduisant considérablement les coûts de calcul.</p></li>
<li><p>Synchronisation frontale : Les fragments de coordonnées mis à jour sont transmis au frontend via WebSocket, ce qui permet aux nouveaux nœuds d'apparaître dynamiquement sans avoir à recharger l'ensemble de la scène.</p></li>
</ul>
<p>Au-delà de l'évolutivité, Milvus 2.6.8 permet une recherche hybride en combinant la similarité vectorielle avec la recherche plein texte et le filtrage scalaire. Cela ouvre la voie à des interactions 3D plus riches, telles que la mise en évidence des mots clés, le filtrage par catégorie et le découpage temporel, offrant aux développeurs des moyens plus puissants d'explorer, de déboguer et de raisonner sur le comportement des RAG.</p>
<h2 id="How-to-Deploy-and-Explore-ProjectGolem-with-Milvus" class="common-anchor-header">Comment déployer et explorer Project_Golem avec Milvus<button data-href="#How-to-Deploy-and-Explore-ProjectGolem-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Le Projet_Golem mis à jour est désormais en open source sur <a href="https://github.com/yinmin2020/Project_Golem_Milvus">GitHub</a>. En utilisant la documentation officielle de Milvus comme ensemble de données, nous parcourons le processus complet de visualisation de l'extraction de RAG en 3D. L'installation utilise Docker et Python et est facile à suivre, même si vous partez de zéro.</p>
<h3 id="Prerequisites" class="common-anchor-header">Conditions préalables</h3><ul>
<li>Docker ≥ 20.10</li>
<li>Docker Compose ≥ 2.0</li>
<li>Python ≥ 3.11</li>
<li>Une clé API OpenAI</li>
<li>Un jeu de données (documentation Milvus au format Markdown).</li>
</ul>
<h3 id="1-Deploy-Milvus" class="common-anchor-header">1. Déployer Milvus</h3><pre><code translate="no">Download docker-compose.yml
wget https://github.com/milvus-io/milvus/releases/download/v2.6.8/milvus-standalone-docker-compose.yml -O docker-compose.yml
Start Milvus（verify port mapping：19530:19530）
docker-compose up -d
Verify that the services are running
docker ps | grep milvus
You should see three containers：milvus-standalone, milvus-etcd, milvus-minio
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Core-Implementation" class="common-anchor-header">2. Mise en œuvre du noyau</h3><p>Intégration de Milvus (ingest.py)</p>
<p>Remarque : l'implémentation prend en charge jusqu'à huit catégories de documents. Si le nombre de catégories dépasse cette limite, les couleurs sont réutilisées à la ronde.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">from</span> pymilvus.milvus_client.index <span class="hljs-keyword">import</span> IndexParams
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">from</span> langchain_text_splitters <span class="hljs-keyword">import</span> RecursiveCharacterTextSplitter
<span class="hljs-keyword">import</span> umap
<span class="hljs-keyword">from</span> sklearn.neighbors <span class="hljs-keyword">import</span> NearestNeighbors
<span class="hljs-keyword">import</span> json
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> glob
--- CONFIG ---
MILVUS_URI = <span class="hljs-string">&quot;http://localhost:19530&quot;</span>
COLLECTION_NAME = <span class="hljs-string">&quot;golem_memories&quot;</span>
JSON_OUTPUT_PATH = <span class="hljs-string">&quot;./golem_cortex.json&quot;</span>
Data directory (users place .md files <span class="hljs-keyword">in</span> this folder)
DATA_DIR = <span class="hljs-string">&quot;./data&quot;</span>
OpenAI Embedding Config
OPENAI_API_KEY = os.getenv(<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>)
OPENAI_BASE_URL = <span class="hljs-string">&quot;https://api.openai.com/v1&quot;</span>  <span class="hljs-comment">#</span>
OPENAI_EMBEDDING_MODEL = <span class="hljs-string">&quot;text-embedding-3-small&quot;</span>
<span class="hljs-number">1536</span> dimensions
EMBEDDING_DIM = <span class="hljs-number">1536</span>
Color mapping: colors are assigned automatically <span class="hljs-keyword">and</span> reused <span class="hljs-keyword">in</span> a <span class="hljs-built_in">round</span>-robin manner
COLORS = [
[<span class="hljs-number">0.29</span>, <span class="hljs-number">0.87</span>, <span class="hljs-number">0.50</span>],
Green
[<span class="hljs-number">0.22</span>, <span class="hljs-number">0.74</span>, <span class="hljs-number">0.97</span>],
Blue
[<span class="hljs-number">0.60</span>, <span class="hljs-number">0.20</span>, <span class="hljs-number">0.80</span>],
Purple
[<span class="hljs-number">0.94</span>, <span class="hljs-number">0.94</span>, <span class="hljs-number">0.20</span>],
Gold
[<span class="hljs-number">0.98</span>, <span class="hljs-number">0.55</span>, <span class="hljs-number">0.00</span>],
Orange
[<span class="hljs-number">0.90</span>, <span class="hljs-number">0.30</span>, <span class="hljs-number">0.40</span>],
Red
[<span class="hljs-number">0.40</span>, <span class="hljs-number">0.90</span>, <span class="hljs-number">0.90</span>],
Cyan
[<span class="hljs-number">0.95</span>, <span class="hljs-number">0.50</span>, <span class="hljs-number">0.90</span>],
Magenta
]
<span class="hljs-keyword">def</span> <span class="hljs-title function_">get_embeddings</span>(<span class="hljs-params">texts</span>):
<span class="hljs-string">&quot;&quot;&quot;Batch embedding using OpenAI API&quot;&quot;&quot;</span>
client = OpenAI(api_key=OPENAI_API_KEY, base_url=OPENAI_BASE_URL)
embeddings = []
batch_size = <span class="hljs-number">100</span>
OpenAI allows multiple texts per request
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">0</span>, <span class="hljs-built_in">len</span>(texts), batch_size):
batch = texts[i:i + batch_size]
response = client.embeddings.create(
model=OPENAI_EMBEDDING_MODEL,
<span class="hljs-built_in">input</span>=batch
)
embeddings.extend([item.embedding <span class="hljs-keyword">for</span> item <span class="hljs-keyword">in</span> response.data])
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Embedded <span class="hljs-subst">{<span class="hljs-built_in">min</span>(i + batch_size, <span class="hljs-built_in">len</span>(texts))}</span>/<span class="hljs-subst">{<span class="hljs-built_in">len</span>(texts)}</span>...&quot;</span>)
<span class="hljs-keyword">return</span> np.array(embeddings)
<span class="hljs-keyword">def</span> <span class="hljs-title function_">load_markdown_files</span>(<span class="hljs-params">data_dir</span>):
<span class="hljs-string">&quot;&quot;&quot;Load all markdown files from the data directory&quot;&quot;&quot;</span>
md_files = glob.glob(os.path.join(data_dir, <span class="hljs-string">&quot;**/*.md&quot;</span>), recursive=<span class="hljs-literal">True</span>)
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> md_files:
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ❌ ERROR: No .md files found in &#x27;<span class="hljs-subst">{data_dir}</span>&#x27;&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   👉 Create a &#x27;<span class="hljs-subst">{data_dir}</span>&#x27; folder and put your markdown files there.&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   👉 Example: <span class="hljs-subst">{data_dir}</span>/doc1.md, <span class="hljs-subst">{data_dir}</span>/docs/doc2.md&quot;</span>)
<span class="hljs-keyword">return</span> <span class="hljs-literal">None</span>
docs = []
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n📚 FOUND <span class="hljs-subst">{<span class="hljs-built_in">len</span>(md_files)}</span> MARKDOWN FILES:&quot;</span>)
<span class="hljs-keyword">for</span> i, file_path <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(md_files):
filename = os.path.basename(file_path)
Categories are derived <span class="hljs-keyword">from</span> the file’s path relative to data_dir
rel_path = os.path.relpath(file_path, data_dir)
category = os.path.dirname(rel_path) <span class="hljs-keyword">if</span> os.path.dirname(rel_path) <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;default&quot;</span>
<span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&#x27;r&#x27;</span>, encoding=<span class="hljs-string">&#x27;utf-8&#x27;</span>) <span class="hljs-keyword">as</span> f:
content = f.read()
docs.append({
<span class="hljs-string">&quot;title&quot;</span>: filename,
<span class="hljs-string">&quot;text&quot;</span>: content,
<span class="hljs-string">&quot;cat&quot;</span>: category,
<span class="hljs-string">&quot;path&quot;</span>: file_path
})
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>. [<span class="hljs-subst">{category}</span>] <span class="hljs-subst">{filename}</span>&quot;</span>)
<span class="hljs-keyword">return</span> docs
<span class="hljs-keyword">def</span> <span class="hljs-title function_">ingest_dense</span>():
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;🧠 PROJECT GOLEM - NEURAL MEMORY BUILDER&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;=&quot;</span> * <span class="hljs-number">50</span>)
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> OPENAI_API_KEY:
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   ❌ ERROR: OPENAI_API_KEY environment variable not set!&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   👉 Run: export OPENAI_API_KEY=&#x27;your-key-here&#x27;&quot;</span>)
<span class="hljs-keyword">return</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Using OpenAI Embedding: <span class="hljs-subst">{OPENAI_EMBEDDING_MODEL}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Embedding Dimension: <span class="hljs-subst">{EMBEDDING_DIM}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Data Directory: <span class="hljs-subst">{DATA_DIR}</span>&quot;</span>)
<span class="hljs-number">1.</span> Load local markdown files
docs = load_markdown_files(DATA_DIR)
<span class="hljs-keyword">if</span> docs <span class="hljs-keyword">is</span> <span class="hljs-literal">None</span>:
<span class="hljs-keyword">return</span>
<span class="hljs-number">2.</span> Split documents into chunks
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n📦 PROCESSING DOCUMENTS...&quot;</span>)
splitter = RecursiveCharacterTextSplitter(chunk_size=<span class="hljs-number">800</span>, chunk_overlap=<span class="hljs-number">50</span>)
chunks = []
raw_texts = []
colors = []
chunk_titles = []
categories = []
<span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> docs:
doc_chunks = splitter.create_documents([doc[<span class="hljs-string">&#x27;text&#x27;</span>]])
cat_index = <span class="hljs-built_in">hash</span>(doc[<span class="hljs-string">&#x27;cat&#x27;</span>]) % <span class="hljs-built_in">len</span>(COLORS)
<span class="hljs-keyword">for</span> i, chunk <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(doc_chunks):
chunks.append({
<span class="hljs-string">&quot;text&quot;</span>: chunk.page_content,
<span class="hljs-string">&quot;title&quot;</span>: doc[<span class="hljs-string">&#x27;title&#x27;</span>],
<span class="hljs-string">&quot;cat&quot;</span>: doc[<span class="hljs-string">&#x27;cat&#x27;</span>]
})
raw_texts.append(chunk.page_content)
colors.append(COLORS[cat_index])
chunk_titles.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{doc[<span class="hljs-string">&#x27;title&#x27;</span>]}</span> (chunk <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>)&quot;</span>)
categories.append(doc[<span class="hljs-string">&#x27;cat&#x27;</span>])
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Created <span class="hljs-subst">{<span class="hljs-built_in">len</span>(chunks)}</span> text chunks from <span class="hljs-subst">{<span class="hljs-built_in">len</span>(docs)}</span> documents&quot;</span>)
<span class="hljs-number">3.</span> Generate embeddings
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n🔮 GENERATING EMBEDDINGS...&quot;</span>)
vectors = get_embeddings(raw_texts)
<span class="hljs-number">4.</span> 3D Projection (UMAP)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n🎨 CALCULATING 3D MANIFOLD...&quot;</span>)
reducer = umap.UMAP(n_components=<span class="hljs-number">3</span>, n_neighbors=<span class="hljs-number">30</span>, min_dist=<span class="hljs-number">0.1</span>, metric=<span class="hljs-string">&#x27;cosine&#x27;</span>)
embeddings_3d = reducer.fit_transform(vectors)
<span class="hljs-number">5.</span> Wiring (KNN)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   ↳ Wiring Synapses (finding connections)...&quot;</span>)
nbrs = NearestNeighbors(n_neighbors=<span class="hljs-number">8</span>, metric=<span class="hljs-string">&#x27;cosine&#x27;</span>).fit(vectors)
distances, indices = nbrs.kneighbors(vectors)
<span class="hljs-number">6.</span> Prepare output data
cortex_data = []
milvus_data = []
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(chunks)):
cortex_data.append({
<span class="hljs-string">&quot;id&quot;</span>: i,
<span class="hljs-string">&quot;title&quot;</span>: chunk_titles[i],
<span class="hljs-string">&quot;cat&quot;</span>: categories[i],
<span class="hljs-string">&quot;pos&quot;</span>: embeddings_3d[i].tolist(),
<span class="hljs-string">&quot;col&quot;</span>: colors[i],
<span class="hljs-string">&quot;nbs&quot;</span>: indices[i][<span class="hljs-number">1</span>:].tolist()
})
milvus_data.append({
<span class="hljs-string">&quot;id&quot;</span>: i,
<span class="hljs-string">&quot;text&quot;</span>: chunks[i][<span class="hljs-string">&#x27;text&#x27;</span>],
<span class="hljs-string">&quot;title&quot;</span>: chunk_titles[i],
<span class="hljs-string">&quot;category&quot;</span>: categories[i],
<span class="hljs-string">&quot;vector&quot;</span>: vectors[i].tolist()
})
<span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(JSON_OUTPUT_PATH, <span class="hljs-string">&#x27;w&#x27;</span>) <span class="hljs-keyword">as</span> f:
json.dump(cortex_data, f)
<span class="hljs-number">7.</span> Store vectors <span class="hljs-keyword">in</span> Milvus
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n💾 STORING IN MILVUS...&quot;</span>)
client = MilvusClient(uri=MILVUS_URI)
Drop existing collection <span class="hljs-keyword">if</span> it exists
<span class="hljs-keyword">if</span> client.has_collection(COLLECTION_NAME):
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Dropping existing collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27;...&quot;</span>)
client.drop_collection(COLLECTION_NAME)
Create new collection
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Creating collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; (dim=<span class="hljs-subst">{EMBEDDING_DIM}</span>)...&quot;</span>)
client.create_collection(
collection_name=COLLECTION_NAME,
dimension=EMBEDDING_DIM
)
Insert data
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Inserting <span class="hljs-subst">{<span class="hljs-built_in">len</span>(milvus_data)}</span> vectors...&quot;</span>)
client.insert(
collection_name=COLLECTION_NAME,
data=milvus_data
)
Create index <span class="hljs-keyword">for</span> faster search
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   ↳ Creating index...&quot;</span>)
index_params = IndexParams()
index_params.add_index(
field_name=<span class="hljs-string">&quot;vector&quot;</span>,
index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>
)
client.create_index(
collection_name=COLLECTION_NAME,
index_params=index_params
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n✅ CORTEX GENERATED SUCCESSFULLY!&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   📊 <span class="hljs-subst">{<span class="hljs-built_in">len</span>(chunks)}</span> memory nodes stored in Milvus&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   📁 Cortex data saved to: <span class="hljs-subst">{JSON_OUTPUT_PATH}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   🚀 Run &#x27;python GolemServer.py&#x27; to start the server&quot;</span>)
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
ingest_dense()
<button class="copy-code-btn"></button></code></pre>
<p>Visualisation frontale (GolemServer.py)</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> flask <span class="hljs-keyword">import</span> Flask, request, jsonify, send_from_directory
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">import</span> json
<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> sys
--- CONFIG ---
Explicitly <span class="hljs-built_in">set</span> the folder to where this script <span class="hljs-keyword">is</span> located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OpenAI Embedding Config
OPENAI_API_KEY = os.getenv(<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>)
OPENAI_BASE_URL = <span class="hljs-string">&quot;https://api.openai.com/v1&quot;</span>
OPENAI_EMBEDDING_MODEL = <span class="hljs-string">&quot;text-embedding-3-small&quot;</span>
Milvus Config
MILVUS_URI = <span class="hljs-string">&quot;http://localhost:19530&quot;</span>
COLLECTION_NAME = <span class="hljs-string">&quot;golem_memories&quot;</span>
These <span class="hljs-keyword">match</span> the files generated by ingest.py
JSON_FILE = <span class="hljs-string">&quot;golem_cortex.json&quot;</span>
UPDATED: Matches your new repo filename
HTML_FILE = <span class="hljs-string">&quot;index.html&quot;</span>
app = Flask(__name__, static_folder=BASE_DIR)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n🧠 PROJECT GOLEM SERVER&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   📂 Serving from: <span class="hljs-subst">{BASE_DIR}</span>&quot;</span>)
--- DIAGNOSTICS ---
Check <span class="hljs-keyword">if</span> files exist before starting
missing_files = []
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> os.path.exists(os.path.join(BASE_DIR, JSON_FILE)):
missing_files.append(JSON_FILE)
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> os.path.exists(os.path.join(BASE_DIR, HTML_FILE)):
missing_files.append(HTML_FILE)
<span class="hljs-keyword">if</span> missing_files:
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ❌ CRITICAL ERROR: Missing files in this folder:&quot;</span>)
<span class="hljs-keyword">for</span> f <span class="hljs-keyword">in</span> missing_files:
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;      - <span class="hljs-subst">{f}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   👉 Did you run &#x27;python ingest.py&#x27; successfully?&quot;</span>)
sys.exit(<span class="hljs-number">1</span>)
<span class="hljs-keyword">else</span>:
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ✅ Files Verified: Cortex Map found.&quot;</span>)
Check API Key
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> OPENAI_API_KEY:
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ❌ CRITICAL ERROR: OPENAI_API_KEY environment variable not set!&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   👉 Run: export OPENAI_API_KEY=&#x27;your-key-here&#x27;&quot;</span>)
sys.exit(<span class="hljs-number">1</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Using OpenAI Embedding: <span class="hljs-subst">{OPENAI_EMBEDDING_MODEL}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   ↳ Connecting to Milvus...&quot;</span>)
milvus_client = MilvusClient(uri=MILVUS_URI)
Verify collection exists
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> milvus_client.has_collection(COLLECTION_NAME):
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ❌ CRITICAL ERROR: Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; not found in Milvus.&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   👉 Did you run &#x27;python ingest.py&#x27; successfully?&quot;</span>)
sys.exit(<span class="hljs-number">1</span>)
Initialize OpenAI client
openai_client = OpenAI(api_key=OPENAI_API_KEY, base_url=OPENAI_BASE_URL)
--- ROUTES ---
<span class="hljs-meta">@app.route(<span class="hljs-params"><span class="hljs-string">&#x27;/&#x27;</span></span>)</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">root</span>():
Force serve the specific HTML file
<span class="hljs-keyword">return</span> send_from_directory(BASE_DIR, HTML_FILE)
<span class="hljs-meta">@app.route(<span class="hljs-params"><span class="hljs-string">&#x27;/&#x27;</span></span>)</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">serve_static</span>(<span class="hljs-params">filename</span>):
<span class="hljs-keyword">return</span> send_from_directory(BASE_DIR, filename)
<span class="hljs-meta">@app.route(<span class="hljs-params"><span class="hljs-string">&#x27;/query&#x27;</span>, methods=[<span class="hljs-string">&#x27;POST&#x27;</span>]</span>)</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">query_brain</span>():
data = request.json
text = data.get(<span class="hljs-string">&#x27;query&#x27;</span>, <span class="hljs-string">&#x27;&#x27;</span>)
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> text: <span class="hljs-keyword">return</span> jsonify({<span class="hljs-string">&quot;indices&quot;</span>: []})
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;🔎 Query: <span class="hljs-subst">{text}</span>&quot;</span>)
Get query embedding <span class="hljs-keyword">from</span> OpenAI
response = openai_client.embeddings.create(
model=OPENAI_EMBEDDING_MODEL,
<span class="hljs-built_in">input</span>=text
)
query_vec = response.data[<span class="hljs-number">0</span>].embedding
Search <span class="hljs-keyword">in</span> Milvus
results = milvus_client.search(
collection_name=COLLECTION_NAME,
data=[query_vec],
limit=<span class="hljs-number">50</span>,
output_fields=[<span class="hljs-string">&quot;id&quot;</span>]
)
Extract indices <span class="hljs-keyword">and</span> scores
indices = [r[<span class="hljs-string">&#x27;id&#x27;</span>] <span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]]
scores = [r[<span class="hljs-string">&#x27;distance&#x27;</span>] <span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]]
<span class="hljs-keyword">return</span> jsonify({
<span class="hljs-string">&quot;indices&quot;</span>: indices,
<span class="hljs-string">&quot;scores&quot;</span>: scores
})
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&#x27;__main__&#x27;</span>:
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   ✅ SYSTEM ONLINE: http://localhost:8000&quot;</span>)
app.run(port=<span class="hljs-number">8000</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Télécharger le jeu de données et le placer dans le répertoire spécifié.</p>
<pre><code translate="no">https://github.com/milvus-io/milvus-docs/tree/v2.6.x/site/en
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/debugging_rag_in_3d_with_projectgolem_and_milvus_4_3d17b01fec.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="3-Start-the-project" class="common-anchor-header">3. Démarrer le projet</h3><p>Conversion de l'intégration de texte dans l'espace 3D</p>
<pre><code translate="no">python ingest.py
<button class="copy-code-btn"></button></code></pre>
<p>[image]</p>
<p>Démarrer le service frontal</p>
<pre><code translate="no">python GolemServer.py
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Visualization-and-Interaction" class="common-anchor-header">4. Visualisation et interaction</h3><p>Une fois que le frontend a reçu les résultats de la recherche, la luminosité des nœuds est mise à l'échelle sur la base des scores de similarité cosinus, tandis que les couleurs d'origine des nœuds sont conservées pour maintenir des groupes de catégories clairs. Des lignes semi-transparentes sont tracées entre le point d'interrogation et chaque nœud correspondant, et la caméra effectue des panoramiques et des zooms pour se concentrer sur le groupe activé.</p>
<h4 id="Example-1-In-Domain-Match" class="common-anchor-header">Exemple 1 : Correspondance dans le domaine</h4><p>Requête : "Quels sont les types d'index pris en charge par Milvus ?</p>
<p>Comportement de visualisation :</p>
<ul>
<li><p>Dans l'espace 3D, environ 15 nœuds du groupe rouge intitulé INDEXES présentent une augmentation notable de la luminosité (environ 2 à 3 fois).</p></li>
<li><p>Les nœuds correspondants comprennent des morceaux de documents tels que index_types.md, hnsw_index.md et ivf_index.md.</p></li>
<li><p>Des lignes semi-transparentes sont tracées entre le vecteur de requête et chaque nœud correspondant, et la caméra se concentre sur le groupe rouge.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/debugging_rag_in_3d_with_projectgolem_and_milvus_2_c2522b6a67.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h4 id="Example-2-Out-of-Domain-Query-Rejection" class="common-anchor-header">Exemple 2 : Rejet d'une requête hors domaine</h4><p>Requête : "Combien coûte le repas KFC ?"</p>
<p>Comportement de visualisation :</p>
<ul>
<li><p>Tous les nœuds conservent leur couleur d'origine et leur taille n'est que légèrement modifiée (moins de 1,1×).</p></li>
<li><p>Les nœuds correspondants sont dispersés dans plusieurs groupes de couleurs différentes, sans concentration sémantique claire.</p></li>
<li><p>La caméra ne déclenche pas d'action de mise au point, car le seuil de similarité (0,5) n'est pas atteint.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/debugging_rag_in_3d_with_projectgolem_and_milvus_3_39b9383771.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Conclusion" class="common-anchor-header">Conclusion<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Project_Golem associé à Milvus ne remplacera pas votre pipeline d'évaluation RAG existant - mais il ajoute quelque chose qui manque totalement à la plupart des pipelines : la possibilité de voir ce qui se passe dans l'espace vectoriel.</p>
<p>Avec cette configuration, vous pouvez faire la différence entre un échec de récupération causé par un mauvais encastrement, un échec causé par un mauvais découpage et un échec causé par un seuil juste un peu trop serré. Ce type de diagnostic nécessitait auparavant de deviner et d'itérer. Aujourd'hui, vous pouvez le voir.</p>
<p>L'intégration actuelle prend en charge le débogage interactif à l'échelle de la démonstration (~10 000 documents), la base de données vectorielle de Milvus se chargeant de la récupération de niveau production en coulisses. Le chemin vers la visualisation à l'échelle du million est tracé mais pas encore construit - c'est donc le bon moment pour s'impliquer.</p>
<p>Consultez <a href="https://github.com/CyberMagician/Project_Golem">Project_Golem</a> sur GitHub, essayez-le avec votre propre jeu de données et voyez à quoi ressemble votre espace vectoriel.</p>
<p>Si vous avez des questions ou souhaitez partager vos découvertes, rejoignez notre <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">canal Slack</a> ou réservez une session <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a> pour obtenir des conseils pratiques sur votre installation.</p>
