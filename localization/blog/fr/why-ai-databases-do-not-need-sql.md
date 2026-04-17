---
id: why-ai-databases-do-not-need-sql.md
title: Pourquoi les bases de données d'IA n'ont pas besoin de SQL
author: James Luan
date: 2025-05-30T00:00:00.000Z
cover: assets.zilliz.com/why_ai_databases_don_t_need_SQL_2d12f615df.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, SQL, AI Agents, LLM'
meta_keywords: 'SQL, AI Databases, vector databases, AI Agents'
meta_title: |
  Why AI Databases Don't Need SQL
desc: >-
  Que cela vous plaise ou non, la vérité est que SQL est voué au déclin à l'ère
  de l'IA.
origin: 'https://milvus.io/blog/why-ai-databases-do-not-need-sql.md'
---
<p>Pendant des décennies, <code translate="no">SELECT * FROM WHERE</code> a été la règle d'or des requêtes de base de données. Qu'il s'agisse de systèmes de reporting, d'analyses financières ou de requêtes sur le comportement des utilisateurs, nous nous sommes habitués à utiliser un langage structuré pour manipuler les données avec précision. Même NoSQL, qui a proclamé une "révolution anti-SQL", a fini par céder et a introduit la prise en charge de SQL, reconnaissant ainsi sa position apparemment irremplaçable.</p>
<p><em>Mais vous êtes-vous déjà demandé : nous avons passé plus de 50 ans à apprendre aux ordinateurs à parler le langage humain, alors pourquoi obligeons-nous encore les humains à parler &quot;informatique&quot; ?</em></p>
<p><strong>Que cela vous plaise ou non, la vérité est là : le langage SQL est voué au déclin à l'ère de l'IA.</strong> Il peut encore être utilisé dans les systèmes existants, mais il devient de moins en moins pertinent pour les applications modernes de l'IA. La révolution de l'IA n'est pas seulement en train de changer la façon dont nous construisons les logiciels, elle est en train de rendre SQL obsolète, et la plupart des développeurs sont trop occupés à optimiser leurs JOINs pour s'en rendre compte.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_ai_databases_don_t_need_SQL_2d12f615df.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Natural-Language-The-New-Interface-for-AI-Databases" class="common-anchor-header">Le langage naturel : La nouvelle interface des bases de données d'IA<button data-href="#Natural-Language-The-New-Interface-for-AI-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>L'avenir de l'interaction avec les bases de données ne réside pas dans l'apprentissage d'un meilleur langage SQL, mais dans l'<strong>abandon total de la syntaxe</strong>.</p>
<p>Au lieu de se débattre avec des requêtes SQL complexes, imaginez que vous puissiez simplement dire : "Aidez-moi à trouver les utilisateurs dont les achats ont été effectués récemment" :</p>
<p><em>"Aidez-moi à trouver les utilisateurs dont le comportement d'achat récent est le plus similaire à celui de nos meilleurs clients du dernier trimestre."</em></p>
<p>Le système comprend votre intention et décide automatiquement :</p>
<ul>
<li><p>Doit-il interroger des tables structurées ou effectuer une recherche de similarité vectorielle à travers des enregistrements d'utilisateurs ?</p></li>
<li><p>Doit-il faire appel à des API externes pour enrichir les données ?</p></li>
<li><p>Comment classer et filtrer les résultats ?</p></li>
</ul>
<p>Tout cela se fait automatiquement. Pas de syntaxe. Pas de débogage. Pas de recherche sur Stack Overflow pour savoir "comment faire une fonction window avec plusieurs CTE". Vous n'êtes plus un &quot;programmeur&quot; de base de données, vous discutez avec un système de données intelligent.</p>
<p>Ce n'est pas de la science-fiction. Selon les prévisions de Gartner, d'ici 2026, la plupart des entreprises donneront la priorité au langage naturel en tant qu'interface de requête principale, le langage SQL passant d'une compétence "indispensable" à une compétence "facultative".</p>
<p>La transformation est déjà en cours :</p>
<p><strong>✅ Zéro barrière syntaxique :</strong> Les noms de champs, les relations entre les tables et l'optimisation des requêtes deviennent le problème du système, pas le vôtre.</p>
<p><strong>✅ Des données non structurées conviviales : les</strong> images, l'audio et le texte deviennent des objets de requête de premier ordre<strong>.</strong> </p>
<p><strong>Accès démocratisé :</strong> Les équipes d'exploitation, les chefs de produit et les analystes peuvent interroger directement les données aussi facilement que votre ingénieur principal.</p>
<h2 id="Natural-Language-Is-Just-the-Surface-AI-Agents-Are-the-Real-Brain" class="common-anchor-header">Le langage naturel n'est que la surface ; les agents d'IA sont le véritable cerveau<button data-href="#Natural-Language-Is-Just-the-Surface-AI-Agents-Are-the-Real-Brain" class="anchor-icon" translate="no">
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
    </button></h2><p>Les requêtes en langage naturel ne sont que la partie émergée de l'iceberg. La véritable avancée réside dans les <a href="https://zilliz.com/blog/what-exactly-are-ai-agents-why-openai-and-langchain-are-fighting-over-their-definition">agents d'IA</a> qui peuvent raisonner sur les données comme le font les humains.</p>
<p>Comprendre le langage humain est la première étape. Comprendre ce que vous voulez et l'exécuter efficacement, c'est là que la magie opère.</p>
<p>Les agents d'intelligence artificielle servent de "cerveau" à la base de données :</p>
<ul>
<li><p><strong>🤔 la compréhension de l'intention :</strong> Déterminer les champs, les bases de données et les index dont vous avez réellement besoin.</p></li>
<li><p><strong>⚙️ Sélection de la stratégie :</strong> Choix entre le filtrage structuré, la similarité vectorielle ou les approches hybrides.</p></li>
<li><p><strong>📦 Orchestration des capacités :</strong> Exécution des API, déclenchement des services, coordination des requêtes intersystèmes.</p></li>
<li><p><strong>🧾 Mise en forme intelligente :</strong> Renvoyer des résultats que vous pouvez immédiatement comprendre et sur lesquels vous pouvez agir.</p></li>
</ul>
<p>Voici ce que cela donne en pratique. Dans la <a href="https://milvus.io/">base de données vectorielles Milvus,</a> une recherche de similarité complexe devient triviale :</p>
<pre><code translate="no">results = collection.search(query_vector, top_k=<span class="hljs-number">10</span>, <span class="hljs-built_in">filter</span>=<span class="hljs-string">&quot;is_active == true&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Une ligne. Pas de JOIN. Pas de sous-requêtes. Pas de réglage des performances.</strong> La <a href="https://zilliz.com/learn/what-is-vector-database">base de données vectorielle</a> traite la similarité sémantique tandis que les filtres traditionnels traitent les correspondances exactes. C'est plus rapide, plus simple et cela permet de comprendre ce que vous voulez.</p>
<p>Cette approche "API-first" s'intègre naturellement aux capacités d'<a href="https://zilliz.com/blog/function-calling-vs-mcp-vs-a2a-developers-guide-to-ai-agent-protocols">appel de fonctions</a> des grands modèles de langage - exécution plus rapide, moins d'erreurs, intégration plus facile.</p>
<h2 id="Why-SQL-Falls-Apart-in-the-AI-Era" class="common-anchor-header">Pourquoi SQL s'effondre à l'ère de l'IA<button data-href="#Why-SQL-Falls-Apart-in-the-AI-Era" class="anchor-icon" translate="no">
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
    </button></h2><p>Le langage SQL a été conçu pour un monde structuré. Cependant, l'avenir dominé par l'IA sera dominé par les données non structurées, la compréhension sémantique et la récupération intelligente - tout ce que SQL n'a jamais été conçu pour gérer.</p>
<p>Les applications modernes sont inondées de données non structurées, notamment d'enchâssements de texte issus de modèles de langage, de vecteurs d'images provenant de systèmes de vision artificielle, d'empreintes audio issues de la reconnaissance vocale et de représentations multimodales combinant du texte, des images et des métadonnées.</p>
<p>Ces données ne s'inscrivent pas proprement dans des lignes et des colonnes - elles existent sous forme de vecteurs intégrés dans un espace sémantique à haute dimension, et SQL n'a absolument aucune idée de ce qu'il faut en faire.</p>
<h3 id="SQL-+-Vector-A-Beautiful-Idea-That-Executes-Poorly" class="common-anchor-header">SQL + Vecteur : Une belle idée mal exécutée</h3><p>Cherchant désespérément à rester pertinentes, les bases de données traditionnelles ajoutent des capacités vectorielles à SQL. PostgreSQL a ajouté l'opérateur <code translate="no">&lt;-&gt;</code> pour la recherche de similarités vectorielles :</p>
<pre><code translate="no">SELECT *
  FROM items
 ORDER BY embedding &lt;-&gt; query_vector
 LIMIT 10;
<button class="copy-code-btn"></button></code></pre>
<p>Cela semble astucieux, mais c'est une erreur fondamentale. Vous forcez les opérations vectorielles à passer par des analyseurs SQL, des optimiseurs de requêtes et des systèmes de transaction conçus pour un modèle de données complètement différent.</p>
<p>La pénalité de performance est brutale :</p>
<p>📊 <strong>Données de référence réelles</strong>: Dans des conditions identiques, Milvus, conçu à cet effet, offre une latence de requête inférieure de 60 % et un débit 4,5 fois plus élevé par rapport à PostgreSQL avec pgvector.</p>
<p>Pourquoi des performances aussi médiocres ? Les bases de données traditionnelles créent des chemins d'exécution inutilement complexes :</p>
<ul>
<li><p><strong>Surcharge de l'analyseur</strong>: Les requêtes vectorielles sont forcées de passer par la validation de la syntaxe SQL.</p></li>
<li><p><strong>Confusion des optimiseurs</strong>: Les planificateurs de requêtes optimisés pour les jointures relationnelles ont du mal à gérer les recherches par similarité.</p></li>
<li><p><strong>inefficacité du stockage</strong>: Les vecteurs stockés sous forme de BLOB nécessitent un encodage/décodage constant.</p></li>
<li><p><strong>Inadéquation des index</strong>: Les arbres B et les structures LSM ne sont pas du tout adaptés à la recherche de similarités en haute dimension.</p></li>
</ul>
<h3 id="Relational-vs-AIVector-Databases-Fundamentally-Different-Philosophies" class="common-anchor-header">Bases de données relationnelles et bases de données vectorielles : Des philosophies fondamentalement différentes</h3><p>L'incompatibilité va plus loin que les performances. Il s'agit d'approches totalement différentes des données :</p>
<table>
<thead>
<tr><th><strong>Aspect</strong></th><th><strong>Bases de données SQL/relationnelles</strong></th><th><strong>Bases de données vectorielles/IA</strong></th></tr>
</thead>
<tbody>
<tr><td>Modèle de données</td><td>Champs structurés (nombres, chaînes) en lignes et en colonnes</td><td>Représentations vectorielles à haute dimension de données non structurées (texte, images, audio)</td></tr>
<tr><td>Logique d'interrogation</td><td>Correspondance exacte + opérations booléennes</td><td>Correspondance par similarité + recherche sémantique</td></tr>
<tr><td>Interface</td><td>SQL</td><td>Langage naturel + APIs Python</td></tr>
<tr><td>Philosophie</td><td>Conformité ACID, cohérence parfaite</td><td>Rappel optimisé, pertinence sémantique, performance en temps réel</td></tr>
<tr><td>Stratégie d'indexation</td><td>Arbres B+, index de hachage, etc.</td><td>HNSW, IVF, quantification de produits, etc.</td></tr>
<tr><td>Principaux cas d'utilisation</td><td>Transactions, rapports, analyses</td><td>Recherche sémantique, recherche multimodale, recommandations, systèmes RAG, agents IA</td></tr>
</tbody>
</table>
<p>Essayer de faire fonctionner SQL pour des opérations vectorielles, c'est comme utiliser un tournevis comme marteau - ce n'est pas techniquement impossible, mais vous n'utilisez pas le bon outil pour ce travail.</p>
<h2 id="Vector-Databases-Purpose-Built-for-AI" class="common-anchor-header">Bases de données vectorielles : Conçues pour l'IA<button data-href="#Vector-Databases-Purpose-Built-for-AI" class="anchor-icon" translate="no">
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
    </button></h2><p>Les bases de données vectorielles telles que <a href="https://milvus.io/">Milvus</a> et <a href="https://zilliz.com/">Zilliz Cloud</a> ne sont pas des &quot;bases de données SQL avec des fonctions vectorielles&quot; - ce sont des systèmes de données intelligents conçus dès le départ pour des applications natives de l'IA.</p>
<h3 id="1-Native-Multimodal-Support" class="common-anchor-header">1. Prise en charge multimodale native</h3><p>Les vraies applications d'IA ne se contentent pas de stocker du texte : elles travaillent avec des images, du son, de la vidéo et des documents complexes imbriqués. Les bases de données vectorielles gèrent divers types de données et structures multi-vectorielles telles que <a href="https://zilliz.com/learn/explore-colbert-token-level-embedding-and-ranking-model-for-similarity-search">ColBERT</a> et <a href="https://zilliz.com/blog/colpali-milvus-redefine-document-retrieval-with-vision-language-models">ColPALI</a>, et s'adaptent aux riches représentations sémantiques des différents modèles d'IA.</p>
<h3 id="2-Agent-Friendly-Architecture" class="common-anchor-header">2. Architecture adaptée aux agents</h3><p>Les grands modèles de langage excellent dans l'appel de fonctions, et non dans la génération SQL. Les bases de données vectorielles offrent des API en Python qui s'intègrent de façon transparente aux agents d'intelligence artificielle, permettant la réalisation d'opérations complexes, telles que l'extraction de vecteurs, le filtrage, le reclassement et la mise en évidence sémantique, le tout en un seul appel de fonction, sans nécessiter de couche de traduction du langage d'interrogation.</p>
<h3 id="3-Semantic-Intelligence-Built-In" class="common-anchor-header">3. Intelligence sémantique intégrée</h3><p>Les bases de données vectorielles ne se contentent pas d'exécuter des commandes, elles<strong>comprennent l'intention.</strong> En travaillant avec des agents d'intelligence artificielle et d'autres applications d'intelligence artificielle, elles s'affranchissent de la correspondance littérale des mots clés pour réaliser une véritable recherche sémantique. Elles ne savent pas seulement "comment interroger" mais "ce que vous voulez vraiment trouver".</p>
<h3 id="4-Optimized-for-Relevance-Not-Just-Speed" class="common-anchor-header">4. Optimisées pour la pertinence, pas seulement pour la vitesse</h3><p>Comme les grands modèles de langage, les bases de données vectorielles établissent un équilibre entre performance et rappel. Grâce au filtrage des métadonnées, à la <a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">recherche vectorielle hybride et à la recherche plein texte</a>, ainsi qu'aux algorithmes de reclassement, elles améliorent en permanence la qualité et la pertinence des résultats, en trouvant des contenus qui ont réellement de la valeur, et pas seulement des contenus rapides à récupérer.</p>
<h2 id="The-Future-of-Databases-is-Conversational" class="common-anchor-header">L'avenir des bases de données est conversationnel<button data-href="#The-Future-of-Databases-is-Conversational" class="anchor-icon" translate="no">
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
    </button></h2><p>Les bases de données vectorielles représentent un changement fondamental dans la façon dont nous envisageons l'interaction des données. Elles ne remplacent pas les bases de données relationnelles - elles sont conçues spécialement pour les charges de travail d'IA et répondent à des problèmes totalement différents dans un monde où l'IA occupe une place prépondérante.</p>
<p>Tout comme les grands modèles de langage n'ont pas amélioré les moteurs de règles traditionnels mais ont redéfini entièrement l'interaction homme-machine, les bases de données vectorielles redéfinissent la manière dont nous trouvons et travaillons avec l'information.</p>
<p>Nous passons de "langages écrits pour que les machines les lisent" à des "systèmes qui comprennent l'intention humaine". Les bases de données évoluent, passant d'exécutants de requêtes rigides à des agents de données intelligents qui comprennent le contexte et font remonter des informations de manière proactive.</p>
<p>Les développeurs qui conçoivent aujourd'hui des applications d'IA ne veulent pas écrire du SQL : ils veulent décrire ce dont ils ont besoin et laisser des systèmes intelligents déterminer comment l'obtenir.</p>
<p>La prochaine fois que vous aurez besoin de trouver quelque chose dans vos données, essayez une approche différente. N'écrivez pas de requête, dites simplement ce que vous cherchez. Votre base de données pourrait vous surprendre en comprenant ce que vous voulez dire.</p>
<p><em>Et si ce n'est pas le cas ? Il est peut-être temps d'améliorer votre base de données, et non vos compétences en SQL.</em></p>
