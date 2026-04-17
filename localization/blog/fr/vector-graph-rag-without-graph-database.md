---
id: vector-graph-rag-without-graph-database.md
title: Nous avons construit Graph RAG sans la base de données graphique
author: Cheney Zhang
date: 2026-4-17
cover: assets.zilliz.com/vector_graph_rag_without_graph_database_md_1_e9c1adda4a.jpeg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'graph RAG, multi-hop RAG, vector database, Milvus, knowledge graph RAG'
meta_title: |
  Graph RAG Without a Graph Database | Vector Graph RAG
desc: >-
  Open-source Vector Graph RAG ajoute le raisonnement multi-sauts à RAG en
  utilisant seulement Milvus. 87.8% Recall@5, 2 appels LLM par requête, pas de
  base de données de graphes nécessaire.
origin: 'https://milvus.io/blog/vector-graph-rag-without-graph-database.md'
---
<blockquote>
<p><strong><em>TL;DR :</em></strong> <em>Avez-vous réellement besoin d'une base de données de graphes pour Graph RAG ? Non. Mettez les entités, les relations et les passages dans Milvus. Utilisez l'expansion de sous-graphes au lieu de la traversée de graphes, et un rerank LLM au lieu de boucles d'agents à plusieurs tours. C'est le</em> <a href="https://github.com/zilliztech/vector-graph-rag"><strong><em>Vector Graph RAG</em></strong></a><strong><em>, et</em></strong> <em>c'est ce que nous avons construit. Cette approche atteint 87,8 % de Recall@5 en moyenne sur trois benchmarks d'assurance qualité multi-sauts et bat HippoRAG 2 sur une seule instance de Milvus.</em></p>
</blockquote>
<p>Les questions multi-sauts sont le mur que la plupart des pipelines RAG finissent par rencontrer. La réponse se trouve dans votre corpus, mais elle s'étend sur plusieurs passages connectés par des entités que la question ne nomme jamais. La solution la plus courante consiste à ajouter une base de données de graphes, ce qui implique d'utiliser deux systèmes au lieu d'un seul.</p>
<p>Nous nous heurtions constamment à ce mur et nous ne voulions pas utiliser deux bases de données juste pour le gérer. Nous avons donc créé et mis en libre accès <a href="https://github.com/zilliztech/vector-graph-rag">Vector Graph RAG</a>, une bibliothèque Python qui apporte le raisonnement multi-sauts à <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> en utilisant uniquement <a href="https://milvus.io/docs">Milvus</a>, la base de données vectorielle libre la plus largement adoptée. Elle fournit la même capacité multi-sauts avec une seule base de données au lieu de deux.</p>
<iframe width="826" height="465" src="https://www.youtube.com/embed/yCooOl-koxc" title="Stop Using Graph Database to Build Your Graph RAG System — Vector Graph RAG Explained" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<h2 id="Why-Multi-Hop-Questions-Break-Standard-RAG" class="common-anchor-header">Pourquoi les questions à sauts multiples ne sont pas compatibles avec le RAG standard<button data-href="#Why-Multi-Hop-Questions-Break-Standard-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>Les questions à sauts multiples ne respectent pas la norme RAG car la réponse dépend de relations entre entités que la recherche vectorielle ne peut pas voir. L'entité pont qui relie la question à la réponse ne figure souvent pas dans la question elle-même.</p>
<p>Les questions simples fonctionnent bien. Vous découpez les documents en morceaux, vous les intégrez, vous récupérez les correspondances les plus proches et vous les transmettez à un LLM. La question "Quels sont les index pris en charge par Milvus ?" se trouve dans un passage et la recherche vectorielle la trouve.</p>
<p>Les questions à sauts multiples ne correspondent pas à ce modèle. Prenons une question telle que <em>"Quels sont les effets secondaires à surveiller avec les médicaments de première intention contre le diabète ?"</em> dans une base de connaissances médicales.</p>
<p>Pour y répondre, il faut deux étapes de raisonnement. Tout d'abord, le système doit savoir que la metformine est le médicament de première intention pour le diabète. Ce n'est qu'ensuite qu'il peut rechercher les effets secondaires de la metformine : surveillance de la fonction rénale, gêne gastro-intestinale, carence en vitamine B12.</p>
<p>Le terme "metformine" est l'entité pont. Elle relie la question à la réponse, mais la question ne la mentionne jamais.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_2_8e769cbe40.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>C'est là que s'arrête la <a href="https://zilliz.com/learn/vector-similarity-search">recherche de similarités de Vector</a>. Elle récupère des passages qui ressemblent à la question, des guides de traitement du diabète et des listes d'effets secondaires de médicaments, mais elle ne peut pas suivre les relations entre les entités qui relient ces passages entre eux. Des faits tels que "la metformine est le médicament de première intention pour le diabète" se trouvent dans ces relations, et non dans le texte d'un seul passage.</p>
<h2 id="Why-Graph-Databases-and-Agentic-RAG-Arent-the-Answer" class="common-anchor-header">Pourquoi les bases de données graphiques et les RAG agentiques ne sont pas la solution<button data-href="#Why-Graph-Databases-and-Agentic-RAG-Arent-the-Answer" class="anchor-icon" translate="no">
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
    </button></h2><p>Les bases de données graphiques et les boucles itératives d'agents sont les moyens habituels de résoudre les RAG à sauts multiples. Les deux fonctionnent. Les deux coûtent plus cher que ce que la plupart des équipes veulent payer pour une seule fonctionnalité.</p>
<p>Commençons par la base de données de graphes. Vous extrayez des triples de vos documents, les stockez dans une base de données graphique et parcourez les arêtes pour trouver des connexions multi-sauts. Cela signifie qu'il faut faire fonctionner un deuxième système parallèlement à votre <a href="https://zilliz.com/learn/what-is-vector-database">base de données vectorielle</a>, apprendre Cypher ou Gremlin, et maintenir la synchronisation entre les bases de données vectorielles et les bases de données de graphes.</p>
<p>Les boucles itératives d'agents constituent l'autre approche. Le LLM récupère un lot, le raisonne, décide s'il a suffisamment de contexte et le récupère à nouveau si ce n'est pas le cas. L <a href="https://arxiv.org/abs/2212.10509">'IRCoT</a> (Trivedi et al., 2023) effectue 3 à 5 appels LLM par requête. Le RAG de l'agent peut dépasser 10 car c'est l'agent qui décide quand s'arrêter. Le coût par requête devient imprévisible et la latence P99 augmente chaque fois que l'agent exécute des tours supplémentaires.</p>
<p>Ces deux solutions ne conviennent pas aux équipes qui souhaitent un raisonnement multi-sauts sans avoir à reconstruire leur pile. Nous avons donc essayé autre chose.</p>
<h2 id="What-is-Vector-Graph-RAG-a-Graph-Structure-Inside-a-Vector-Database" class="common-anchor-header">Qu'est-ce que Vector Graph RAG, une structure graphique à l'intérieur d'une base de données vectorielle ?<button data-href="#What-is-Vector-Graph-RAG-a-Graph-Structure-Inside-a-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/vector-graph-rag"><strong>Vector Graph RAG</strong></a> est une bibliothèque Python open-source qui apporte le raisonnement multi-sauts à <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> en utilisant uniquement <a href="https://milvus.io/docs">Milvus</a>. Elle stocke la structure du graphe sous forme de références ID dans trois collections Milvus. Le parcours devient une chaîne de consultations de clés primaires dans Milvus au lieu de requêtes Cypher contre une base de données de graphes. Un seul Milvus accomplit les deux tâches.</p>
<p>Il fonctionne parce que les relations dans un graphe de connaissances ne sont que du texte. Le triple <em>(qui est la metformine, le médicament de première intention pour le diabète de type 2)</em> est une arête dirigée dans une base de données graphique. C'est aussi une phrase : "La metformine est le médicament de première intention pour le diabète de type 2". Vous pouvez intégrer cette phrase en tant que vecteur et la stocker dans <a href="https://milvus.io/docs">Milvus</a>, comme n'importe quel autre texte.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_3_da1305389a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Répondre à une requête multi-sauts signifie suivre les connexions entre ce que la requête mentionne (comme "diabète") et ce qu'elle ne mentionne pas (comme "metformine"). Cela ne fonctionne que si le stockage préserve ces connexions : quelle entité se connecte à quelle entité par le biais de quelle relation. Le texte brut peut faire l'objet d'une recherche, mais pas d'un suivi.</p>
<p>Pour que les connexions puissent être suivies dans Milvus, nous attribuons à chaque entité et à chaque relation un identifiant unique, puis nous les stockons dans des collections distinctes qui se réfèrent l'une à l'autre par l'intermédiaire de l'identifiant. Trois collections au total : les <strong>entités</strong> (les nœuds), les <strong>relations</strong> (les arêtes) et les <strong>passages</strong> (le texte source, dont le LLM a besoin pour générer des réponses). Chaque ligne possède un vecteur d'intégration, de sorte que nous pouvons effectuer une recherche sémantique dans n'importe laquelle des trois collections.</p>
<p>Les<strong>entités</strong> stockent les entités dédupliquées. Chacune possède un identifiant unique, un <a href="https://zilliz.com/glossary/vector-embeddings">vecteur d'intégration</a> pour la <a href="https://zilliz.com/glossary/semantic-search">recherche sémantique</a> et une liste d'identifiants de relations auxquelles elle participe.</p>
<table>
<thead>
<tr><th>id</th><th>nom</th><th>intégration</th><th>relation_ids</th></tr>
</thead>
<tbody>
<tr><td>e01</td><td>metformine</td><td>[0.12, ...]</td><td>[r01, r02, r03]</td></tr>
<tr><td>e02</td><td>diabète de type 2</td><td>[0.34, ...]</td><td>[r01, r04]</td></tr>
<tr><td>e03</td><td>fonction rénale</td><td>[0.56, ...]</td><td>[r02]</td></tr>
</tbody>
</table>
<p>Les<strong>relations</strong> stockent des triples de connaissances. Chaque relation enregistre les identifiants des entités sujet et objet, les identifiants de passage d'où elle provient, ainsi qu'une intégration du texte complet de la relation.</p>
<table>
<thead>
<tr><th>id</th><th>ID_sujet</th><th>identifiant_objet</th><th>texte</th><th>intégration</th><th>passage_ids</th></tr>
</thead>
<tbody>
<tr><td>r01</td><td>e01</td><td>e02</td><td>La metformine est le médicament de première intention pour le diabète de type 2</td><td>[0.78, ...]</td><td>[p01]</td></tr>
<tr><td>r02</td><td>e01</td><td>e03</td><td>Les patients sous metformine doivent faire l'objet d'un contrôle de la fonction rénale</td><td>[0.91, ...]</td><td>[p02]</td></tr>
</tbody>
</table>
<p>Les<strong>passages</strong> stockent les morceaux de documents originaux, avec des références aux entités et aux relations qui en ont été extraites.</p>
<p>Les trois collections se renvoient l'une à l'autre par l'intermédiaire de champs d'identification : les entités portent les identifiants de leurs relations, les relations portent les identifiants de leurs entités sujet et objet et de leurs passages sources, et les passages portent les identifiants de tout ce qui en a été extrait. Ce réseau de références d'identifiants constitue le graphe.</p>
<p>Le parcours est simplement une chaîne de consultations d'identifiants. Vous récupérez l'entité e01 pour obtenir son <code translate="no">relation_ids</code>, vous récupérez les relations r01 et r02 par ces ID, vous lisez le <code translate="no">object_id</code> de r01 pour découvrir l'entité e02, et vous continuez ainsi. Chaque saut est une <a href="https://milvus.io/docs/get-and-scalar-query.md">requête de clé primaire</a> Milvus standard. Aucun Cypher n'est nécessaire.</p>
<p>Vous pouvez vous demander si les allers-retours supplémentaires vers Milvus s'additionnent. Ce n'est pas le cas. L'expansion du sous-graphe coûte 2 à 3 requêtes basées sur l'ID pour un total de 20 à 30 ms. L'appel au LLM prend 1 à 3 secondes, ce qui rend les recherches d'ID invisibles à côté.</p>
<h2 id="How-Vector-Graph-RAG-Answers-a-Multi-Hop-Query" class="common-anchor-header">Comment Vector Graph RAG répond à une requête multi-sauts<button data-href="#How-Vector-Graph-RAG-Answers-a-Multi-Hop-Query" class="anchor-icon" translate="no">
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
    </button></h2><p>Le flux de recherche conduit une requête multi-sauts à une réponse fondée en quatre étapes : <strong>recherche de graines → expansion du sous-graphe → LLM rerank → génération de la réponse.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_4_86ccf5b914.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Nous allons nous pencher sur la question du diabète : <em>"Quels sont les effets secondaires à surveiller avec les médicaments de première intention contre le diabète ?"</em></p>
<h3 id="Step-1-Seed-Retrieval" class="common-anchor-header">Étape 1 : Récupération des graines</h3><p>Un LLM extrait les entités clés de la question : "diabète", "effets secondaires", "médicament de première intention". La recherche vectorielle dans Milvus trouve directement les entités et les relations les plus pertinentes.</p>
<p>Mais la metformine n'en fait pas partie. La question ne la mentionne pas et la recherche vectorielle ne peut donc pas la trouver.</p>
<h3 id="Step-2-Subgraph-Expansion" class="common-anchor-header">Étape 2 : Expansion des sous-graphes</h3><p>C'est à ce stade que le système Vector Graph RAG diverge du système RAG standard.</p>
<p>Le système suit les références d'identification des entités de départ d'un saut. Il récupère les ID des entités de départ, trouve toutes les relations contenant ces ID et intègre les nouveaux ID des entités dans le sous-graphe. Valeur par défaut : un saut.</p>
<p><strong>Metformin, l'entité pont, entre dans le sous-graphe.</strong></p>
<p>L'entité "Diabète" a une relation : <em>"La metformine est le médicament de première intention pour le diabète de type 2".</em> En suivant cette arête, la metformine entre dans le sous-graphe. Une fois que la metformine est dans le sous-graphe, elle est accompagnée de ses propres relations : <em>"Les patients sous metformine doivent faire l'objet d'un suivi de leur fonction rénale", "La metformine peut provoquer des troubles gastro-intestinaux", "L'utilisation à long terme de la metformine peut entraîner une carence en vitamine B12".</em></p>
<p>Deux faits qui se trouvaient dans des passages distincts sont désormais reliés par un saut d'expansion graphique. L'entité pont que la question n'a jamais mentionnée peut maintenant être découverte.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_5_8ac4a11d1c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-LLM-Rerank" class="common-anchor-header">Étape 3 : Rerank LLM</h3><p>L'expansion vous laisse avec des douzaines de relations candidates. La plupart sont du bruit.</p>
<pre><code translate="no">Expanded candidate pool (example):
r01: Metformin <span class="hljs-keyword">is</span> the first-line drug <span class="hljs-keyword">for</span> <span class="hljs-built_in">type</span> <span class="hljs-number">2</span> diabetes          ← Key
r02: Patients on metformin should have kidney function monitored   ← Key
r03: Metformin may cause gastrointestinal discomfort               ← Key
r04: <span class="hljs-type">Type</span> <span class="hljs-number">2</span> diabetes patients should have regular eye exams        ✗ Noise
r05: Insulin injection sites should be rotated                     ✗ Noise
r06: Diabetes <span class="hljs-keyword">is</span> linked to cardiovascular disease risk             ✗ Noise
r07: Metformin <span class="hljs-keyword">is</span> contraindicated <span class="hljs-keyword">in</span> severe liver dysfunction      ✗ Noise (contraindication, <span class="hljs-keyword">not</span> side effect)
r08: HbA1c <span class="hljs-keyword">is</span> a monitoring indicator <span class="hljs-keyword">for</span> diabetes                  ✗ Noise
r09: Sulfonylureas are second-line treatment <span class="hljs-keyword">for</span> <span class="hljs-built_in">type</span> <span class="hljs-number">2</span> diabetes   ✗ Noise (second-line, <span class="hljs-keyword">not</span> first-line)
r10: Long-term metformin use may lead to vitamin B12 deficiency    ← Key
...(more)
<button class="copy-code-btn"></button></code></pre>
<p>Le système envoie ces candidats et la question originale à un LLM : "Quels sont les effets secondaires des médicaments de première intention contre le diabète ?" Il s'agit d'un appel unique sans itération.</p>
<pre><code translate="no">After LLM filtering:
✓ r01: Metformin <span class="hljs-keyword">is</span> the first-line drug <span class="hljs-keyword">for</span> <span class="hljs-built_in">type</span> <span class="hljs-number">2</span> diabetes          → Establishes the bridge: first-line drug = metformin
✓ r02: Patients on metformin should have kidney function monitored   → Side effect: kidney impact
✓ r03: Metformin may cause gastrointestinal discomfort               → Side effect: GI issues
✓ r10: Long-term metformin use may lead to vitamin B12 deficiency    → Side effect: nutrient deficiency
<button class="copy-code-btn"></button></code></pre>
<p>Les relations sélectionnées couvrent toute la chaîne : diabète → metformine → surveillance des reins / gêne gastro-intestinale / carence en B12.</p>
<h3 id="Step-4-Answer-Generation" class="common-anchor-header">Étape 4 : Génération de réponses</h3><p>Le système récupère les passages originaux des relations sélectionnées et les envoie au LLM.</p>
<p>Le LLM génère des réponses à partir du texte complet du passage, et non à partir des triples tronqués. Les triples sont des résumés compressés. Ils ne contiennent pas le contexte, les mises en garde et les spécificités dont le LLM a besoin pour produire une réponse fondée.</p>
<h3 id="See-Vector-Graph-RAG-in-action" class="common-anchor-header">Voir Vector Graph RAG en action</h3><p>Nous avons également créé une interface interactive qui permet de visualiser chaque étape. Cliquez sur le panneau des étapes à gauche et le graphique se met à jour en temps réel : orange pour les nœuds de départ, bleu pour les nœuds étendus, vert pour les relations sélectionnées. Le flux de recherche devient ainsi concret et non plus abstrait.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_6_f6d8b1e841.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Why-One-Rerank-Beats-Multiple-Iterations" class="common-anchor-header">Pourquoi un seul Rerank vaut mieux que plusieurs itérations ?<button data-href="#Why-One-Rerank-Beats-Multiple-Iterations" class="anchor-icon" translate="no">
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
    </button></h2><p>Notre pipeline fait deux appels LLM par requête : un pour le rerank, un pour la génération. Les systèmes itératifs tels que IRCoT et Agentic RAG effectuent de 3 à 10 appels ou plus parce qu'ils font une boucle : récupérer, raisonner, récupérer à nouveau. Nous sautons la boucle parce que la recherche vectorielle et l'expansion des sous-graphes couvrent à la fois la similarité sémantique et les connexions structurelles en un seul passage, ce qui donne au LLM suffisamment de candidats pour terminer en un seul rerank.</p>
<table>
<thead>
<tr><th>Approche</th><th>Appels LLM par requête</th><th>Profil de latence</th><th>Coût relatif de l'API</th></tr>
</thead>
<tbody>
<tr><td>Graphique vectoriel RAG</td><td>2 (rerank + générer)</td><td>Fixe, prévisible</td><td>1x</td></tr>
<tr><td>IRCoT</td><td>3-5</td><td>Variable</td><td>~2-3x</td></tr>
<tr><td>RAG agentique</td><td>5-10+</td><td>Imprévisible</td><td>~3-5x</td></tr>
</tbody>
</table>
<p>En production, cela représente environ 60 % de réduction du coût de l'API, des réponses 2 à 3 fois plus rapides et une latence prévisible. Il n'y a pas de pic surprise lorsqu'un agent décide d'exécuter des tours supplémentaires.</p>
<h2 id="Benchmark-Results" class="common-anchor-header">Résultats de l'analyse comparative<button data-href="#Benchmark-Results" class="anchor-icon" translate="no">
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
    </button></h2><p>Vector Graph RAG obtient une moyenne de 87,8 % de rappel@5 sur trois benchmarks d'assurance qualité multi-sauts standard, égalant ou dépassant toutes les méthodes que nous avons testées, y compris HippoRAG 2, avec seulement Milvus et 2 appels LLM.</p>
<p>Nous avons évalué MuSiQue (2-4 sauts, le plus difficile), HotpotQA (2 sauts, le plus utilisé) et 2WikiMultiHopQA (2 sauts, raisonnement inter-documents). La mesure est Recall@5 : si les passages corrects apparaissent dans les 5 premiers résultats retrouvés.</p>
<p>Nous avons utilisé exactement les mêmes triples pré-extraits du <a href="https://github.com/OSU-NLP-Group/HippoRAG">référentiel HippoRAG</a> pour une comparaison équitable. Pas de réextraction, pas de prétraitement personnalisé. La comparaison isole l'algorithme d'extraction lui-même.</p>
<h3 id="Vector-Graph-RAGhttpsgithubcomzilliztechvector-graph-rag-vs-Standard-Naive-RAG" class="common-anchor-header"><a href="https://github.com/zilliztech/vector-graph-rag">Graphique vectoriel RAG</a> vs RAG standard (naïf)</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_7_61772e68c8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Vector Graph RAG fait passer la moyenne de Recall@5 de 73,4 % à 87,8 %, soit une amélioration de 19,6 points de pourcentage.</p>
<ul>
<li>MuSiQue : gain le plus important (+31,4 pp). Benchmark de 3-4 sauts, les questions multi-sauts les plus difficiles, et exactement là où l'expansion des sous-graphes a le plus d'impact.</li>
<li>2WikiMultiHopQA : forte amélioration (+27,7 points). Raisonnement inter-documents, une autre zone de prédilection pour l'expansion de sous-graphes.</li>
<li>HotpotQA : gain plus faible (+6,1 pp), mais le RAG standard obtient déjà un score de 90,8 % sur cet ensemble de données. Le plafond est bas.</li>
</ul>
<h3 id="Vector-Graph-RAGhttpsgithubcomzilliztechvector-graph-rag-vs-State-of-the-Art-Methods-SOTA" class="common-anchor-header"><a href="https://github.com/zilliztech/vector-graph-rag">Graphique vectoriel RAG</a> par rapport aux méthodes de pointe (SOTA)</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_8_2a0b90b574.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Le graphique vectoriel RAG obtient le score moyen le plus élevé (87,8 %) contre HippoRAG 2, IRCoT et NV-Embed-v2.</p>
<p>Point de référence par point de référence :</p>
<ul>
<li>HotpotQA : égalité avec HippoRAG 2 (96,3 % pour les deux)</li>
<li>2WikiMultiHopQA : 3,7 points d'avance (94,1 % contre 90,4 %)</li>
<li>MuSiQue (le plus difficile) : 1,7 point de moins (73,0 % contre 74,7 %)</li>
</ul>
<p>Vector Graph RAG atteint ces chiffres avec seulement 2 appels LLM par requête, pas de base de données de graphes, et pas de ColBERTv2. Il fonctionne sur l'infrastructure la plus simple de la comparaison et obtient toujours la moyenne la plus élevée.</p>
<h2 id="How-Vector-Graph-RAGhttpsgithubcomzilliztechvector-graph-rag-Compares-to-Other-Graph-RAG-Approaches" class="common-anchor-header">Comparaison de <a href="https://github.com/zilliztech/vector-graph-rag">Vector Graph RAG</a> avec d'autres approches Graph RAG<button data-href="#How-Vector-Graph-RAGhttpsgithubcomzilliztechvector-graph-rag-Compares-to-Other-Graph-RAG-Approaches" class="anchor-icon" translate="no">
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
    </button></h2><p>Les différentes approches de RAG graphique sont optimisées pour des problèmes différents. Vector Graph RAG est conçu pour l'assurance qualité multi-sauts en production, avec un coût prévisible et une infrastructure simple.</p>
<table>
<thead>
<tr><th></th><th>Microsoft GraphRAG</th><th>HippoRAG 2</th><th>IRCoT / RAG agentique</th><th><strong>Vector Graph RAG</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Infrastructure</strong></td><td>Base de données de graphes + base de données vectorielles</td><td>ColBERTv2 + graphe en mémoire</td><td>BD vectorielle + agents à plusieurs tours</td><td><strong>Milvus uniquement</strong></td></tr>
<tr><td><strong>Appels LLM par requête</strong></td><td>Variable</td><td>Modéré</td><td>3-10+</td><td><strong>2</strong></td></tr>
<tr><td><strong>Meilleur pour</strong></td><td>Résumés de corpus globaux</td><td>Recherche académique fine</td><td>Exploration complexe et ouverte</td><td><strong>Production de l'assurance qualité multi-sauts</strong></td></tr>
<tr><td><strong>Problèmes de mise à l'échelle</strong></td><td>Indexation LLM coûteuse</td><td>Graphique complet en mémoire</td><td>Latence et coût imprévisibles</td><td><strong>S'adapte à Milvus</strong></td></tr>
<tr><td><strong>Complexité d'installation</strong></td><td>Élevée</td><td>Moyenne-élevée</td><td>Moyenne</td><td><strong>Faible (pip install)</strong></td></tr>
</tbody>
</table>
<p><a href="https://github.com/microsoft/graphrag">Microsoft GraphRAG</a> utilise le regroupement hiérarchique de communautés pour répondre à des questions de synthèse globale telles que "quels sont les principaux thèmes de ce corpus ? Il s'agit d'un problème différent de celui de l'assurance qualité multi-sauts.&quot;</p>
<p><a href="https://arxiv.org/abs/2502.14802">HippoRAG 2</a> (Gutierrez et al., 2025) utilise l'extraction inspirée par la cognition avec la correspondance au niveau des jetons de ColBERTv2. Le chargement du graphe complet en mémoire limite l'extensibilité.</p>
<p>Les approches itératives telles que l'<a href="https://arxiv.org/abs/2212.10509">IRCoT</a> échangent la simplicité de l'infrastructure contre le coût du LLM et une latence imprévisible.</p>
<p>Vector Graph RAG s'adresse aux équipes d'assurance qualité multi-sauts de production qui souhaitent bénéficier d'un coût et d'une latence prévisibles sans avoir à ajouter une base de données de graphes.</p>
<h2 id="When-to-Use-Vector-Graph-RAG-and-Key-Use-Cases" class="common-anchor-header">Quand utiliser Vector Graph RAG et principaux cas d'utilisation<button data-href="#When-to-Use-Vector-Graph-RAG-and-Key-Use-Cases" class="anchor-icon" translate="no">
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
    </button></h2><p>Vector Graph RAG est conçu pour quatre types de charges de travail :</p>
<table>
<thead>
<tr><th>Scénario</th><th>Pourquoi il convient</th></tr>
</thead>
<tbody>
<tr><td><strong>Documents à forte densité de connaissances</strong></td><td>Codes juridiques avec références croisées, littérature biomédicale avec chaînes médicament-gène-maladie, documents financiers avec liens entreprise-personne-événement, documents techniques avec graphes de dépendance API</td></tr>
<tr><td><strong>Questions à 2-4 sauts</strong></td><td>Les questions à un saut fonctionnent bien avec le RAG standard. Les questions à cinq sauts ou plus peuvent nécessiter des méthodes itératives. La plage de 2 à 4 sauts est le point idéal pour l'expansion des sous-graphes.</td></tr>
<tr><td><strong>Déploiement simple</strong></td><td>Une base de données, un site <code translate="no">pip install</code>, pas d'infrastructure de graphe à apprendre.</td></tr>
<tr><td><strong>Sensibilité au coût et à la latence</strong></td><td>Deux appels LLM par requête, fixes et prévisibles. Avec des milliers de requêtes quotidiennes, la différence s'accroît.</td></tr>
</tbody>
</table>
<h2 id="Get-Started-with-Vector-Graph-RAG" class="common-anchor-header">Démarrer avec Vector Graph RAG<button data-href="#Get-Started-with-Vector-Graph-RAG" class="anchor-icon" translate="no">
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
    </button></h2><pre><code translate="no" class="language-bash">pip install vector-graph-rag

<span class="hljs-keyword">from</span> vector_graph_rag <span class="hljs-keyword">import</span> VectorGraphRAG

rag = VectorGraphRAG()  <span class="hljs-comment"># defaults to Milvus Lite, no server needed</span>

rag.add_texts([
    <span class="hljs-string">&quot;Metformin is the first-line drug for type 2 diabetes.&quot;</span>,
    <span class="hljs-string">&quot;Patients taking metformin should have their kidney function monitored regularly.&quot;</span>,
])

result = rag.query(<span class="hljs-string">&quot;What side effects should I watch for with first-line diabetes drugs?&quot;</span>)
<span class="hljs-built_in">print</span>(result.answer)
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">VectorGraphRAG()</code> sans arguments utilise par défaut <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>. Il crée un fichier local <code translate="no">.db</code>, comme SQLite. Pas de serveur à démarrer, rien à configurer.</p>
<p><code translate="no">add_texts()</code> Il appelle un LLM pour extraire les triples de votre texte, les vectorise et stocke le tout dans Milvus. <code translate="no">query()</code> exécute le flux d'extraction complet en quatre étapes : seed, expand, rerank, generate.</p>
<p>Pour la production, remplacez un paramètre URI. Le reste du code reste inchangé :</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># Local development</span>
rag = VectorGraphRAG()

<span class="hljs-comment"># Self-hosted Milvus</span>
rag = VectorGraphRAG(uri=<span class="hljs-string">&quot;http://your-milvus-server:19530&quot;</span>)

<span class="hljs-comment"># Zilliz Cloud (managed Milvus, free tier available)</span>
rag = VectorGraphRAG(uri=<span class="hljs-string">&quot;your-zilliz-endpoint&quot;</span>, token=<span class="hljs-string">&quot;your-api-key&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Pour importer des PDF, des pages web ou des fichiers Word :</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> vector_graph_rag.loaders <span class="hljs-keyword">import</span> DocumentImporter

importer = DocumentImporter(chunk_size=<span class="hljs-number">1000</span>, chunk_overlap=<span class="hljs-number">200</span>)
result = importer.import_sources([
    <span class="hljs-string">&quot;https://en.wikipedia.org/wiki/Metformin&quot;</span>,
    <span class="hljs-string">&quot;/path/to/clinical-guidelines.pdf&quot;</span>,
])
rag.add_documents(result.documents, extract_triplets=<span class="hljs-literal">True</span>)
<button class="copy-code-btn"></button></code></pre>
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
    </button></h2><p>Graph RAG n'a pas besoin d'une base de données de graphes. Vector Graph RAG stocke la structure du graphe sous forme de références ID dans trois collections Milvus, ce qui transforme la traversée du graphe en recherche de clé primaire et maintient chaque requête multi-sauts à un niveau fixe de deux appels LLM.</p>
<p>En un coup d'œil :</p>
<ul>
<li>Bibliothèque Python à source ouverte. Raisonnement multi-sauts sur Milvus uniquement.</li>
<li>Trois collections liées par ID. Entités (nœuds), relations (arêtes), passages (texte source). L'expansion des sous-graphes suit les ID pour découvrir les entités ponts que la requête ne mentionne pas.</li>
<li>Deux appels LLM par requête. Un rerank, une génération. Pas d'itération.</li>
<li>87,8 % de rappel moyen@5 sur MuSiQue, HotpotQA et 2WikiMultiHopQA, égalant ou battant HippoRAG 2 sur deux des trois.</li>
</ul>
<h3 id="Try-it" class="common-anchor-header">Essayez-le :</h3><ul>
<li><a href="https://github.com/zilliztech/vector-graph-rag">GitHub : zilliztech/vector-graph-rag</a> pour le code</li>
<li><a href="https://zilliztech.github.io/vector-graph-rag">Docs</a> pour l'API complète et les exemples</li>
<li>Rejoignez la <a href="https://discord.com/invite/8uyFbECzPX">communauté</a> <a href="https://slack.milvus.io/">Milvus</a> <a href="https://slack.milvus.io/">sur Discord</a> pour poser des questions et partager vos commentaires.</li>
<li><a href="https://milvus.io/office-hours">Réservez une session Milvus Office Hours</a> pour étudier votre cas d'utilisation.</li>
<li><a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> propose un niveau gratuit avec Milvus géré si vous préférez sauter l'étape de l'installation de l'infrastructure.</li>
</ul>
<h2 id="FAQ" class="common-anchor-header">FAQ (EN ANGLAIS)<button data-href="#FAQ" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Can-I-do-Graph-RAG-with-just-a-vector-database" class="common-anchor-header">Puis-je utiliser Graph RAG avec une simple base de données vectorielle ?</h3><p>Oui. Vector Graph RAG stocke la structure du graphe de connaissances (entités, relations et leurs connexions) dans trois collections Milvus liées par des références croisées d'ID. Au lieu de parcourir les arêtes d'une base de données de graphes, il enchaîne les recherches de clés primaires dans Milvus pour développer un sous-graphe autour des entités de départ. Cette méthode permet d'obtenir un taux de rappel moyen de 87,8 % sur trois points de référence multi-sauts standard sans aucune infrastructure de base de données graphique.</p>
<h3 id="How-does-Vector-Graph-RAG-compare-to-Microsoft-GraphRAG" class="common-anchor-header">Comment Vector Graph RAG se compare-t-il à Microsoft GraphRAG ?</h3><p>Ils résolvent des problèmes différents. Microsoft GraphRAG utilise le regroupement hiérarchique de communautés pour la synthèse globale de corpus ("Quels sont les principaux thèmes abordés dans ces documents ?"). Vector Graph RAG se concentre sur la réponse à des questions multi-sauts, où l'objectif est d'enchaîner des faits spécifiques à travers des passages. Vector Graph RAG n'a besoin que de Milvus et de deux appels LLM par requête. Microsoft GraphRAG nécessite une base de données de graphes et entraîne des coûts d'indexation plus élevés.</p>
<h3 id="What-types-of-questions-benefit-from-multi-hop-RAG" class="common-anchor-header">Quels sont les types de questions qui bénéficient du RAG multi-sauts ?</h3><p>Le RAG multi-sauts est utile pour les questions dont la réponse dépend de la connexion d'informations dispersées dans plusieurs passages, en particulier lorsqu'une entité clé n'apparaît jamais dans la question. Parmi les exemples, citons : "Quels sont les effets secondaires du médicament de première intention contre le diabète ?" (nécessite de découvrir la metformine comme passerelle), la recherche de références croisées dans des textes juridiques ou réglementaires, et la recherche de chaînes de dépendance dans la documentation technique. La RAG standard gère bien les recherches d'un seul fait. Le RAG multi-sauts apporte une valeur ajoutée lorsque le chemin de raisonnement est long de deux à quatre étapes.</p>
<h3 id="Do-I-need-to-extract-knowledge-graph-triples-manually" class="common-anchor-header">Dois-je extraire manuellement des triplets de graphes de connaissances ?</h3><p>Non. <code translate="no">add_texts()</code> et <code translate="no">add_documents()</code> appellent automatiquement un LLM pour extraire les entités et les relations, les vectoriser et les stocker dans Milvus. Vous pouvez importer des documents à partir d'URL, de PDF et de fichiers DOCX à l'aide de l'application intégrée <code translate="no">DocumentImporter</code>. Pour l'analyse comparative ou la migration, la bibliothèque prend en charge l'importation de triples pré-extraits à partir d'autres cadres comme HippoRAG.</p>
