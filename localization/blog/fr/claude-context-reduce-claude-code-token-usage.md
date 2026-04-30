---
id: claude-context-reduce-claude-code-token-usage.md
title: >-
  Contexte Claude : Réduire l'utilisation de jetons pour les codes Claude grâce
  à la récupération de codes par Milvus
author: Cheney Zhang
date: 2026-4-30
cover: assets.zilliz.com/image_3b2d2999ac.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Claude Context, Claude Code token usage, code retrieval, MCP server, Milvus'
meta_title: |
  Claude Context: Cut Claude Code Token Usage with Milvus
desc: >-
  Claude Code brûle des jetons sur grep ? Découvrez comment Claude Context
  utilise la recherche hybride soutenue par Milvus pour réduire l'utilisation
  des jetons de 39,4 %.
origin: 'https://milvus.io/blog/claude-context-reduce-claude-code-token-usage.md'
---
<p>Les grandes fenêtres contextuelles donnent aux agents de codage de l'IA l'impression d'être illimités, jusqu'à ce qu'ils commencent à lire la moitié de votre référentiel pour répondre à une seule question. Pour de nombreux utilisateurs de Claude Code, la partie la plus coûteuse n'est pas seulement le raisonnement du modèle. C'est la boucle de recherche : rechercher un mot-clé, lire un fichier, rechercher à nouveau, lire d'autres fichiers, et continuer à payer pour un contexte non pertinent.</p>
<p>Claude Context est un serveur MCP open-source de récupération de code qui donne à Claude Code et à d'autres agents de codage IA un meilleur moyen de trouver du code pertinent. Il indexe votre référentiel, stocke des morceaux de code consultables dans une <a href="https://zilliz.com/learn/what-is-vector-database">base de données vectorielle</a> et utilise la <a href="https://zilliz.com/blog/hybrid-search-with-milvus">récupération hybride</a> pour que l'agent puisse extraire le code dont il a réellement besoin au lieu d'inonder l'invite avec des résultats grep.</p>
<p>Dans nos benchmarks, Claude Context a réduit la consommation de jetons de 39,4% en moyenne et les appels d'outils de 36,1% tout en préservant la qualité de la recherche. Ce billet explique pourquoi la recherche de type grep gaspille le contexte, comment Claude Context fonctionne sous le capot, et comment il se compare à un flux de travail de base sur des tâches de débogage réelles.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_6_68b1f70723.png" alt="Claude Context GitHub repository trending and passing 10,000 stars" class="doc-image" id="claude-context-github-repository-trending-and-passing-10,000-stars" />
   </span> <span class="img-wrapper"> <span>Dépôt GitHub de Claude Context : tendance et dépassement des 10 000 étoiles</span> </span></p>
<h2 id="Why-grep-style-code-retrieval-burns-tokens-in-AI-coding-agents" class="common-anchor-header">Pourquoi la recherche de code de type grep brûle des tokens dans les agents de codage de l'IA<button data-href="#Why-grep-style-code-retrieval-burns-tokens-in-AI-coding-agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Un agent de codage IA ne peut écrire du code utile que s'il comprend la base de code autour de la tâche : les chemins d'appel des fonctions, les conventions de nommage, les tests associés, les modèles de données et les modèles d'implémentation historiques. Une grande fenêtre contextuelle est utile, mais elle ne résout pas le problème de la recherche. Si les mauvais fichiers entrent dans le contexte, le modèle gaspille encore des jetons et peut raisonner à partir d'un code non pertinent.</p>
<p>L'extraction de code s'effectue généralement selon deux grands modèles :</p>
<table>
<thead>
<tr><th>Modèle de récupération</th><th>Comment cela fonctionne-t-il ?</th><th>Les points faibles</th></tr>
</thead>
<tbody>
<tr><td>Récupération de type Grep</td><td>Recherche de chaînes littérales, puis lecture des fichiers ou des plages de lignes correspondants.</td><td>Ne tient pas compte du code sémantiquement lié, renvoie des correspondances bruyantes et nécessite souvent des cycles de recherche/lecture répétés.</td></tr>
<tr><td>Recherche de type RAG</td><td>Indexer le code à l'avance, puis récupérer les morceaux pertinents à l'aide d'une recherche sémantique, lexicale ou hybride.</td><td>Nécessite une logique de découpage, d'intégration, d'indexation et de mise à jour que la plupart des outils de codage ne souhaitent pas prendre en charge directement.</td></tr>
</tbody>
</table>
<p>Il s'agit de la même distinction que celle que les développeurs observent dans la conception des <a href="https://zilliz.com/blog/metadata-filtering-hybrid-search-or-agent-in-rag-applications">applications RAG</a>: la correspondance littérale est utile, mais elle est rarement suffisante lorsque le sens est important. Une fonction nommée <code translate="no">compute_final_cost()</code> peut être pertinente pour une requête portant sur <code translate="no">calculate_total_price()</code>, même si les mots exacts ne correspondent pas. C'est là que la <a href="https://zilliz.com/blog/semantic-search-vs-lexical-search-vs-full-text-search">recherche sémantique</a> est utile.</p>
<p>Lors d'une opération de débogage, Claude Code a cherché et lu des fichiers à plusieurs reprises avant de trouver la bonne zone. Après plusieurs minutes, seule une petite partie du code qu'il avait consommé était pertinente.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_4_69b8455aeb.png" alt="Claude Code grep-style search spending time on irrelevant file reads" class="doc-image" id="claude-code-grep-style-search-spending-time-on-irrelevant-file-reads" />
   </span> <span class="img-wrapper"> <span>La recherche de type grep de Claude Code passe du temps à lire des fichiers non pertinents</span> </span></p>
<p>Ce schéma est suffisamment courant pour que les développeurs s'en plaignent publiquement : l'agent peut être intelligent, mais la boucle de recherche de contexte reste coûteuse et imprécise.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_8_b857ab4777.png" alt="Developer comment about Claude Code context and token usage" class="doc-image" id="developer-comment-about-claude-code-context-and-token-usage" />
   </span> <span class="img-wrapper"> <span>Commentaire d'un développeur sur l'utilisation du contexte et des jetons de Claude Code</span> </span></p>
<p>La recherche de type Grep échoue de trois manières prévisibles :</p>
<ul>
<li><strong>Surcharge d'informations :</strong> les grands référentiels produisent de nombreuses correspondances littérales, dont la plupart ne sont pas utiles pour la tâche en cours.</li>
<li><strong>Cécité sémantique :</strong> grep recherche des chaînes de caractères, et non des intentions, des comportements ou des modèles d'implémentation équivalents.</li>
<li><strong>Perte de contexte :</strong> les correspondances au niveau des lignes n'incluent pas automatiquement la classe environnante, les dépendances, les tests ou le graphe des appels.</li>
</ul>
<p>Une meilleure couche de récupération de code doit combiner la précision des mots-clés avec la compréhension sémantique, puis retourner des morceaux suffisamment complets pour que le modèle puisse raisonner sur le code.</p>
<h2 id="What-is-Claude-Context" class="common-anchor-header">Qu'est-ce que Claude Context ?<button data-href="#What-is-Claude-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Context est un serveur open-source <a href="https://zilliz.com/glossary/model-context-protocol-(mcp)">Model Context Protocol</a> pour la récupération de code. Il relie les outils de codage de l'IA à un index de code soutenu par Milvus, de sorte qu'un agent peut rechercher un référentiel par signification au lieu de s'appuyer uniquement sur une recherche de texte littéral.</p>
<p>L'objectif est simple : lorsque l'agent demande un contexte, il doit renvoyer le plus petit ensemble utile de morceaux de code. Claude Context y parvient en analysant la base de code, en générant des embeddings, en stockant les morceaux dans la <a href="https://zilliz.com/what-is-milvus">base de données vectorielle Milvus</a>, et en exposant la recherche à travers des outils compatibles MCP.</p>
<table>
<thead>
<tr><th>Problème Grep</th><th>Approche de Claude Context</th></tr>
</thead>
<tbody>
<tr><td>Trop de correspondances non pertinentes</td><td>Classer les morceaux de code en fonction de la similarité des vecteurs et de la pertinence des mots-clés.</td></tr>
<tr><td>Pas de compréhension sémantique</td><td>Utiliser un <a href="https://zilliz.com/blog/voyage-ai-embeddings-and-rerankers-for-search-and-rag">modèle d'intégration</a> pour que les implémentations apparentées puissent correspondre même si les noms diffèrent.</td></tr>
<tr><td>Manque de contexte environnant</td><td>Retourner des morceaux de code complets avec suffisamment de structure pour que le modèle puisse raisonner sur le comportement.</td></tr>
<tr><td>Lectures répétées de fichiers</td><td>Recherchez d'abord l'index, puis lisez ou éditez uniquement les fichiers importants.</td></tr>
</tbody>
</table>
<p>Parce que Claude Contexte est exposé à travers MCP, il peut fonctionner avec Claude Code, Gemini CLI, les hôtes MCP de type Cursor, et d'autres environnements compatibles avec MCP. La même couche d'extraction peut supporter plusieurs interfaces d'agents.</p>
<h2 id="How-Claude-Context-works-under-the-hood" class="common-anchor-header">Comment fonctionne Claude Context sous le capot<button data-href="#How-Claude-Context-works-under-the-hood" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Context a deux couches principales : un module de base réutilisable et des modules d'intégration. Le noyau gère l'analyse, le découpage, l'indexation, la recherche et la synchronisation incrémentale. La couche supérieure expose ces capacités par le biais d'intégrations MCP et d'éditeurs.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_5_cf9f17013f.png" alt="Claude Context architecture showing MCP integrations, core module, embedding provider, and vector database" class="doc-image" id="claude-context-architecture-showing-mcp-integrations,-core-module,-embedding-provider,-and-vector-database" />
   </span> <span class="img-wrapper"> <span>Architecture de Claude Context montrant les intégrations MCP, le module de base, le fournisseur d'intégration et la base de données vectorielle.</span> </span></p>
<h3 id="How-does-MCP-connect-Claude-Context-to-coding-agents" class="common-anchor-header">Comment MCP relie Claude Context aux agents de codage ?</h3><p>MCP fournit l'interface entre l'hôte LLM et les outils externes. En exposant Claude Context en tant que serveur MCP, la couche de recherche reste indépendante de tout IDE ou assistant de codage. L'agent appelle un outil de recherche ; Claude Contexte gère l'index du code et renvoie les morceaux pertinents.</p>
<p>Si vous souhaitez comprendre le modèle plus large, le <a href="https://milvus.io/docs/milvus_and_mcp.md">guide MCP + Milvus</a> montre comment MCP peut connecter des outils d'intelligence artificielle à des opérations de base de données vectorielles.</p>
<h3 id="Why-use-Milvus-for-code-retrieval" class="common-anchor-header">Pourquoi utiliser Milvus pour la recherche de code ?</h3><p>La recherche de code nécessite une recherche vectorielle rapide, un filtrage des métadonnées et une échelle suffisante pour gérer de grands référentiels. Milvus est conçu pour la recherche vectorielle haute performance et peut prendre en charge les vecteurs denses, les vecteurs épars et les flux de travail de reranking. Pour les équipes qui construisent des systèmes d'agents à forte capacité de recherche, la documentation sur la <a href="https://milvus.io/docs/multi-vector-search.md">recherche hybride multi-vectorielle</a> et l'<a href="https://milvus.io/api-reference/pymilvus/v2.6.x/MilvusClient/Vector/hybrid_search.md">API PyMilvus hybrid_search</a> montrent le même modèle de recherche sous-jacent que celui utilisé dans les systèmes de production.</p>
<p>Claude Context peut utiliser Zilliz Cloud comme backend Milvus géré, ce qui évite d'exécuter et de mettre à l'échelle la base de données vectorielle soi-même. La même architecture peut également être adaptée aux déploiements Milvus autogérés.</p>
<h3 id="Which-embedding-providers-does-Claude-Context-support" class="common-anchor-header">Quels sont les fournisseurs d'intégration pris en charge par Claude Context ?</h3><p>Claude Context prend en charge plusieurs options d'intégration :</p>
<table>
<thead>
<tr><th>Fournisseur</th><th>Meilleure adaptation</th></tr>
</thead>
<tbody>
<tr><td>Encastrements OpenAI</td><td>Intégration hébergée à usage général avec un large soutien de l'écosystème.</td></tr>
<tr><td>Incorporations de Voyage AI</td><td>Recherche orientée code, en particulier lorsque la qualité de la recherche est importante.</td></tr>
<tr><td>Ollama</td><td>Flux de travail d'intégration locale pour les environnements sensibles à la confidentialité.</td></tr>
</tbody>
</table>
<p>Pour les flux de travail Milvus connexes, voir l'<a href="https://milvus.io/docs/embeddings.md">aperçu de l'intégration Milvus</a>, l'<a href="https://milvus.io/docs/embed-with-openai.md">intégration de l'intégration OpenAI</a>, l'<a href="https://milvus.io/docs/embed-with-voyage.md">intégration de l'intégration Voyage</a> et les exemples d'exécution d'<a href="https://zilliz.com/blog/simplifying-legal-research-with-rag-milvus-ollama">Ollama avec Milvus</a>.</p>
<h3 id="Why-is-the-core-library-written-in-TypeScript" class="common-anchor-header">Pourquoi la bibliothèque de base est-elle écrite en TypeScript ?</h3><p>Claude Context est écrit en TypeScript parce que beaucoup d'intégrations d'agents de codage, de plugins d'éditeurs et d'hôtes MCP sont déjà en TypeScript. Garder le noyau de récupération en TypeScript facilite l'intégration avec les outils de la couche applicative tout en exposant une API propre.</p>
<p>Le module de base fait abstraction de la base de données vectorielle et du fournisseur d'intégration dans un objet composable <code translate="no">Context</code>:</p>
<pre><code translate="no" class="language-javascript"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">Context</span>, <span class="hljs-title class_">MilvusVectorDatabase</span>, <span class="hljs-title class_">OpenAIEmbedding</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@zilliz/claude-context-core&#x27;</span>;
<span class="hljs-comment">// Initialize embedding provider</span>
<span class="hljs-keyword">const</span> embedding = <span class="hljs-keyword">new</span> <span class="hljs-title class_">OpenAIEmbedding</span>(...);
<span class="hljs-comment">// Initialize vector database</span>
<span class="hljs-keyword">const</span> vectorDatabase = <span class="hljs-keyword">new</span> <span class="hljs-title class_">MilvusVectorDatabase</span>(...);
<span class="hljs-comment">// Create context instance</span>
<span class="hljs-keyword">const</span> context = <span class="hljs-keyword">new</span> <span class="hljs-title class_">Context</span>({embedding, vectorDatabase});
<span class="hljs-comment">// Index your codebase with progress tracking</span>
<span class="hljs-keyword">const</span> stats = <span class="hljs-keyword">await</span> context.<span class="hljs-title function_">indexCodebase</span>(<span class="hljs-string">&#x27;./your-project&#x27;</span>);
<span class="hljs-comment">// Perform semantic search</span>
<span class="hljs-keyword">const</span> results = <span class="hljs-keyword">await</span> context.<span class="hljs-title function_">semanticSearch</span>(<span class="hljs-string">&#x27;./your-project&#x27;</span>, <span class="hljs-string">&#x27;vector database operations&#x27;</span>);
<button class="copy-code-btn"></button></code></pre>
<h2 id="How-Claude-Context-chunks-code-and-keeps-indexes-fresh" class="common-anchor-header">Comment Claude Context fragmente le code et maintient les index à jour<button data-href="#How-Claude-Context-chunks-code-and-keeps-indexes-fresh" class="anchor-icon" translate="no">
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
    </button></h2><p>Le regroupement et les mises à jour incrémentales déterminent si un système de recherche de code est utilisable dans la pratique. Si les morceaux sont trop petits, le modèle perd son contexte. Si les morceaux sont trop grands, le système de recherche renvoie du bruit. Si l'indexation est trop lente, les développeurs cessent de l'utiliser.</p>
<p>Claude Context gère ces problèmes avec un découpage basé sur l'AST, un séparateur de texte de secours et une détection des changements basée sur l'arbre Merkle.</p>
<h3 id="How-does-AST-based-code-chunking-preserve-context" class="common-anchor-header">Comment le découpage du code basé sur l'AST préserve-t-il le contexte ?</h3><p>Le découpage AST est la stratégie principale. Au lieu de découper les fichiers en fonction du nombre de lignes ou de caractères, Claude Contexte analyse la structure du code et le découpe autour d'unités sémantiques telles que les fonctions, les classes et les méthodes.</p>
<p>Cela donne à chaque morceau trois propriétés utiles :</p>
<table>
<thead>
<tr><th>Propriété</th><th>Importance</th></tr>
</thead>
<tbody>
<tr><td>Complétude syntaxique</td><td>Les fonctions et les classes ne sont pas séparées par le milieu.</td></tr>
<tr><td>Cohérence logique</td><td>La logique connexe reste ensemble, de sorte que les morceaux récupérés sont plus faciles à utiliser pour le modèle.</td></tr>
<tr><td>Prise en charge multilingue</td><td>Différents analyseurs syntaxiques peuvent gérer JavaScript, Python, Java, Go et d'autres langages.</td></tr>
</tbody>
</table>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_9_153144cc04.png" alt="AST-based code chunking preserving complete syntactic units and chunking results" class="doc-image" id="ast-based-code-chunking-preserving-complete-syntactic-units-and-chunking-results" />
   </span> <span class="img-wrapper"> <span>Le découpage du code basé sur l'AST préserve les unités syntaxiques complètes et les résultats du découpage.</span> </span></p>
<h3 id="What-happens-when-AST-parsing-fails" class="common-anchor-header">Que se passe-t-il lorsque l'analyse AST échoue ?</h3><p>Pour les langages ou les fichiers que l'analyse AST ne peut pas traiter, Claude Context se rabat sur la méthode LangChain <code translate="no">RecursiveCharacterTextSplitter</code>. Cette méthode est moins précise que le découpage AST, mais elle empêche l'indexation d'échouer sur des entrées non prises en charge.</p>
<pre><code translate="no" class="language-php"><span class="hljs-comment">// Use recursive character splitting to preserve code structure</span>
<span class="hljs-keyword">const</span> splitter = <span class="hljs-title class_">RecursiveCharacterTextSplitter</span>.<span class="hljs-title function_">fromLanguage</span>(language, {
    <span class="hljs-attr">chunkSize</span>: <span class="hljs-number">1000</span>,
    <span class="hljs-attr">chunkOverlap</span>: <span class="hljs-number">200</span>,
});
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-does-Claude-Context-avoid-re-indexing-the-whole-repository" class="common-anchor-header">Comment Claude Context évite-t-il de réindexer l'ensemble du référentiel ?</h3><p>Réindexer un référentiel entier après chaque modification est trop coûteux. Claude Context utilise un arbre de Merkle pour détecter exactement ce qui a changé.</p>
<p>Un arbre de Merkle attribue un hachage à chaque fichier, dérive le hachage de chaque répertoire à partir de ses enfants et regroupe l'ensemble du référentiel en un hachage racine. Si le hachage de la racine est inchangé, Claude Context peut ignorer l'indexation. Si la racine change, il parcourt l'arbre pour trouver les fichiers modifiés et ne réintègre que ces fichiers.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_10_73daa3ca83.png" alt="Merkle tree change detection comparing unchanged and changed file hashes" class="doc-image" id="merkle-tree-change-detection-comparing-unchanged-and-changed-file-hashes" />
   </span> <span class="img-wrapper"> <span>Détection des changements dans l'arbre de Merkle en comparant les hachages de fichiers inchangés et modifiés</span> </span></p>
<p>Sync s'exécute en trois étapes :</p>
<table>
<thead>
<tr><th>Étape</th><th>Ce qui se passe</th><th>Pourquoi c'est efficace</th></tr>
</thead>
<tbody>
<tr><td>Vérification rapide</td><td>Comparer la racine Merkle actuelle avec le dernier instantané.</td><td>Si rien n'a changé, la vérification se termine rapidement.</td></tr>
<tr><td>Diffusion précise</td><td>Parcourez l'arbre pour identifier les fichiers ajoutés, supprimés et modifiés.</td><td>Seuls les chemins modifiés avancent.</td></tr>
<tr><td>Mise à jour incrémentale</td><td>Recalculer les embeddings pour les fichiers modifiés et mettre à jour Milvus.</td><td>L'index vectoriel reste frais sans reconstruction complète.</td></tr>
</tbody>
</table>
<p>L'état de la synchronisation locale est stocké sous <code translate="no">~/.context/merkle/</code>, de sorte que Claude Context peut restaurer la table de hachage des fichiers et l'arbre de Merkle sérialisé après un redémarrage.</p>
<h2 id="What-happens-when-Claude-Code-uses-Claude-Context" class="common-anchor-header">Que se passe-t-il lorsque Claude Code utilise Claude Context ?<button data-href="#What-happens-when-Claude-Code-uses-Claude-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>L'installation est une commande unique avant le lancement de Claude Code :</p>
<pre><code translate="no" class="language-nginx">claude mcp add claude-context -e OPENAI_API_KEY=your-openai-api-key -e MILVUS_TOKEN=your-zilliz-cloud-api-key -- npx <span class="hljs-meta">@zilliz</span>/claude-context-mcp<span class="hljs-meta">@latest</span>
<button class="copy-code-btn"></button></code></pre>
<p>Après avoir indexé le référentiel, Claude Code peut appeler Claude Context lorsqu'il a besoin du contexte de la base de code. Dans le même scénario de recherche de bogues qui, auparavant, faisait perdre du temps à grep et à la lecture de fichiers, Claude Context a trouvé le fichier et le numéro de ligne exacts avec une explication complète.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/article_12_9ad25bd75b.gif" alt="Claude Context demo showing Claude Code finding the relevant bug location" class="doc-image" id="claude-context-demo-showing-claude-code-finding-the-relevant-bug-location" />
   </span> <span class="img-wrapper"> <span>Démonstration de Claude Context montrant que Claude Code a trouvé l'emplacement du bogue en question.</span> </span></p>
<p>L'outil ne se limite pas à la recherche de bogues. Il aide également à la refactorisation, à la détection de code dupliqué, à la résolution de problèmes, à la génération de tests et à toute tâche pour laquelle l'agent a besoin d'un contexte de référentiel précis.</p>
<p>À rappel équivalent, Claude Context a réduit la consommation de jetons de 39,4 % et les appels d'outils de 36,1 % dans notre benchmark. Cela est important car les appels d'outils et les lectures de fichiers non pertinents dominent souvent le coût des flux de travail de l'agent de codage.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_3_e20064021b.png" alt="Benchmark chart showing Claude Context reducing token usage and tool calls versus baseline" class="doc-image" id="benchmark-chart-showing-claude-context-reducing-token-usage-and-tool-calls-versus-baseline" />
   </span> <span class="img-wrapper"> <span>Graphique de référence montrant la réduction de l'utilisation des jetons et des appels d'outils par Claude Context par rapport à la référence.</span> </span></p>
<p>Le projet a maintenant plus de 10 000 étoiles GitHub, et le référentiel comprend les détails complets du benchmark et les liens vers les paquets.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_7_210af604bd.png" alt="Claude Context GitHub star history showing rapid growth" class="doc-image" id="claude-context-github-star-history-showing-rapid-growth" />
   </span> <span class="img-wrapper"> <span>L'historique des étoiles GitHub de Claude Context montre une croissance rapide.</span> </span></p>
<h2 id="How-does-Claude-Context-compare-with-grep-on-real-bugs" class="common-anchor-header">Comment Claude Context se compare-t-il à grep sur des bogues réels ?<button data-href="#How-does-Claude-Context-compare-with-grep-on-real-bugs" class="anchor-icon" translate="no">
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
    </button></h2><p>Le benchmark compare la recherche de texte pure avec la récupération de code soutenue par Milvus sur des tâches de débogage réelles. La différence ne réside pas seulement dans la réduction du nombre de tokens. Claude Context modifie le chemin de recherche de l'agent : il commence plus près de l'implémentation qui doit être modifiée.</p>
<table>
<thead>
<tr><th>Cas</th><th>Comportement de base</th><th>Comportement de Claude Context</th><th>Réduction des jetons</th></tr>
</thead>
<tbody>
<tr><td>Bug de Django <code translate="no">YearLookup</code> </td><td>Recherche du mauvais symbole apparenté et modification de la logique d'enregistrement.</td><td>La logique d'optimisation de <code translate="no">YearLookup</code> a été trouvée directement.</td><td>93% de tokens en moins</td></tr>
<tr><td>Xarray <code translate="no">swap_dims()</code> bug</td><td>Lecture de fichiers épars autour des mentions de <code translate="no">swap_dims</code>.</td><td>Trouvé l'implémentation et les tests associés plus directement.</td><td>62% de jetons en moins</td></tr>
</tbody>
</table>
<h3 id="Case-1-Django-YearLookup-bug" class="common-anchor-header">Cas 1 : Bug Django YearLookup</h3><p><strong>Description du problème :</strong> Dans le cadre de Django, l'optimisation de la requête <code translate="no">YearLookup</code> interrompt le filtrage <code translate="no">__iso_year</code>. Lors de l'utilisation du filtre <code translate="no">__iso_year</code>, la classe <code translate="no">YearLookup</code> applique incorrectement l'optimisation standard BETWEEN - valable pour les années civiles, mais pas pour les années à numérotation hebdomadaire ISO.</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># This should use EXTRACT(&#x27;isoyear&#x27; FROM ...) but incorrectly uses BETWEEN</span>
DTModel.objects.<span class="hljs-built_in">filter</span>(start_date__iso_year=<span class="hljs-number">2020</span>)

<span class="hljs-comment"># Generated: WHERE &quot;start_date&quot; BETWEEN 2020-01-01 AND 2020-12-31</span>
<span class="hljs-comment"># Should be: WHERE EXTRACT(&#x27;isoyear&#x27; FROM &quot;start_date&quot;) = 2020</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Ligne de base (grep) :</strong></p>
<pre><code translate="no" class="language-swift">🔧 <span class="hljs-title function_">directory_tree</span>()
⚙️ <span class="hljs-title class_">Result</span>: <span class="hljs-title class_">Retrieved</span> <span class="hljs-number">3000</span>+ lines <span class="hljs-keyword">of</span> directory <span class="hljs-title function_">structure</span> (~50k tokens)
   <span class="hljs-title class_">Problem</span>: <span class="hljs-title class_">Massive</span> information overload, no direct relevance
🔧 <span class="hljs-title function_">search_text</span>(<span class="hljs-string">&#x27;ExtractIsoYear&#x27;</span>)
⚙️ <span class="hljs-title class_">Result</span>: <span class="hljs-title class_">Found</span> <span class="hljs-number">21</span> matches across multiple <span class="hljs-attr">files</span>:
   - django/db/models/functions/__init__.<span class="hljs-property">py</span>:<span class="hljs-number">5</span> (<span class="hljs-keyword">import</span> statement)
   - django/db/models/functions/__init__.<span class="hljs-property">py</span>:<span class="hljs-number">31</span> (<span class="hljs-keyword">export</span> list)  
   - django/db/models/functions/datetime.<span class="hljs-property">py</span>:<span class="hljs-number">93</span> (<span class="hljs-title class_">ExtractIsoYear</span> <span class="hljs-keyword">class</span>)
   <span class="hljs-title class_">Problem</span>: <span class="hljs-title class_">Most</span> are unrelated imports and registrations
🔧 <span class="hljs-title function_">edit_file</span>(<span class="hljs-string">&#x27;django/db/models/functions/datetime.py&#x27;</span>)
⚙️ <span class="hljs-title class_">Modified</span> multiple registration statements, but <span class="hljs-variable language_">this</span> is the wrong direction <span class="hljs-keyword">for</span> a fix
<button class="copy-code-btn"></button></code></pre>
<p>La recherche de texte se concentre sur l'enregistrement <code translate="no">ExtractIsoYear</code> au lieu de la logique d'optimisation dans <code translate="no">YearLookup</code>.</p>
<p><strong>Contexte de Claude :</strong></p>
<pre><code translate="no" class="language-bash">🔧 search_code(<span class="hljs-string">&#x27;YearLookup&#x27;</span>)
⚙️ Found <span class="hljs-number">10</span> results <span class="hljs-keyword">for</span> query: <span class="hljs-string">&quot;YearLookup&quot;</span> across the codebase
   <span class="hljs-number">1.</span> Code <span class="hljs-title function_">snippet</span> <span class="hljs-params">(python)</span> [repo__django__django]
      Location: django/db/models/lookups.py:<span class="hljs-number">568</span>-<span class="hljs-number">577</span>
      Context: YearExact <span class="hljs-keyword">class</span> <span class="hljs-title class_">and</span> get_bound_params method
   <span class="hljs-number">2.</span> Code <span class="hljs-title function_">snippet</span> <span class="hljs-params">(python)</span> [repo__django__django]  
      Location: django/db/models/lookups.py:<span class="hljs-number">538</span>-<span class="hljs-number">569</span>
      Context: YearLookup base <span class="hljs-keyword">class</span> <span class="hljs-title class_">and</span> year_lookup_bounds method
🔧 edit_file(django/db/models/lookups.py)
⚙️ Successfully modified the core optimization logic, adding ISO year handling
<button class="copy-code-btn"></button></code></pre>
<p>La recherche sémantique a compris que <code translate="no">YearLookup</code> était le concept central et est allée directement à la bonne classe.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_2_159ccffec9.png" alt="Django YearLookup benchmark table showing 93 percent fewer tokens with Claude Context" class="doc-image" id="django-yearlookup-benchmark-table-showing-93-percent-fewer-tokens-with-claude-context" />
   </span> <span class="img-wrapper"> <span>Tableau de référence Django YearLookup montrant 93 % de tokens en moins avec Claude Context</span> </span></p>
<p><strong>Résultat :</strong> 93 % de mots-clés en moins.</p>
<h3 id="Case-2-Xarray-swapdims-bug" class="common-anchor-header">Cas 2 : Bug Xarray swap_dims</h3><p><strong>Description du problème :</strong> La méthode <code translate="no">.swap_dims()</code> de la bibliothèque Xarray mute de manière inattendue l'objet original, violant ainsi l'attente d'immuabilité.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">import</span> xarray <span class="hljs-keyword">as</span> xr
nz = <span class="hljs-number">11</span>
ds = xr.Dataset({
    <span class="hljs-string">&quot;y&quot;</span>: (<span class="hljs-string">&quot;z&quot;</span>, np.random.rand(nz)),
    <span class="hljs-string">&quot;lev&quot;</span>: (<span class="hljs-string">&quot;z&quot;</span>, np.arange(nz) * <span class="hljs-number">10</span>),
})

<span class="hljs-comment"># This shouldn&#x27;t modify ds, but it does</span>
ds2 = ds.swap_dims(z=<span class="hljs-string">&quot;lev&quot;</span>).rename_dims(lev=<span class="hljs-string">&quot;z&quot;</span>).reset_index(<span class="hljs-string">&quot;lev&quot;</span>).reset_coords()
ds2.swap_dims(z=<span class="hljs-string">&#x27;lev&#x27;</span>)  <span class="hljs-comment"># this unexpectedly modifies ds2[&#x27;lev&#x27;]</span>
<span class="hljs-comment"># ds2[&#x27;lev&#x27;] now has dimension &#x27;lev&#x27; instead of &#x27;z&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Base (grep) :</strong></p>
<pre><code translate="no" class="language-bash">🔧 list_directory(<span class="hljs-string">&#x27;repo__pydata__xarray&#x27;</span>)
⚙️ Result: Retrieved directory structure across multiple subdirectories
   Problem: Basic directory navigation, no targeted search
🔧 search_text(<span class="hljs-string">&#x27;swap_dims&#x27;</span>)
⚙️ Result: Found 21 matches across core files:
   - xarray/core/common.py:600 (Dataset.swap_dims reference)
   - xarray/core/dataarray.py:753 (<span class="hljs-string">&quot;.rename() or .swap_dims() instead.&quot;</span>)
   - xarray/core/dataarray.py:2026 (DataArray.swap_dims reference)
   - xarray/core/dataarray.py:2044 (def swap_dims method)
   Problem: Many matches scattered across different contexts
🔧 read_file(<span class="hljs-string">&#x27;xarray/core/dataarray.py&#x27;</span>, offset=2000, <span class="hljs-built_in">limit</span>=40)
⚙️ Result: Read lines 2001-2040 showing rename method documentation

🔧 read_file(<span class="hljs-string">&#x27;xarray/core/dataset.py&#x27;</span>, offset=3600, <span class="hljs-built_in">limit</span>=40) 
⚙️ Result: Read lines 3601-3640 showing rename_dims method
<button class="copy-code-btn"></button></code></pre>
<p>La ligne de base a passé du temps à naviguer dans les répertoires et à lire le code voisin avant de localiser le chemin d'implémentation réel.</p>
<p><strong>Claude Context :</strong></p>
<pre><code translate="no" class="language-bash">🔧 search_code(<span class="hljs-string">&#x27;.swap_dims()&#x27;</span>)
⚙️ Found <span class="hljs-number">10</span> results <span class="hljs-keyword">for</span> query: <span class="hljs-string">&quot;.swap_dims()&quot;</span> across the codebase
   <span class="hljs-number">1.</span> <span class="hljs-function">Code <span class="hljs-title">snippet</span> (<span class="hljs-params">python</span>) [repo__pydata__xarray]
      Location: xarray/tests/test_formatting_html.py:67-76
   2. Code <span class="hljs-title">snippet</span> (<span class="hljs-params">python</span>) [repo__pydata__xarray]
      Location: xarray/tests/test_dataset.py:2926-2979
🔧 <span class="hljs-title">edit_file</span>(<span class="hljs-params"><span class="hljs-string">&#x27;xarray/core/dataset.py&#x27;</span></span>)
⚙️ Successfully modified the <span class="hljs-keyword">file</span>, added dimension handling logic
🔧 <span class="hljs-title">edit_file</span>(<span class="hljs-params"><span class="hljs-string">&#x27;xarray/core/dataarray.py&#x27;</span></span>)
⚙️ Successfully modified the <span class="hljs-keyword">file</span>, ensuring the original DataArray <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> mutated
</span><button class="copy-code-btn"></button></code></pre>
<p>La recherche sémantique a permis de localiser plus rapidement l'implémentation <code translate="no">swap_dims()</code> et le contexte associé.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_1_d75e931f20.png" alt="Xarray swap_dims benchmark table showing 62 percent fewer tokens with Claude Context" class="doc-image" id="xarray-swap_dims-benchmark-table-showing-62-percent-fewer-tokens-with-claude-context" />
   </span> <span class="img-wrapper"> <span>Tableau de référence Xarray swap_dims montrant 62% de tokens en moins avec Claude Context</span> </span></p>
<p><strong>Résultat :</strong> 62% de tokens en moins.</p>
<h2 id="Get-started-with-Claude-Context" class="common-anchor-header">Commencer avec Claude Context<button data-href="#Get-started-with-Claude-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>Si vous souhaitez essayer l'outil décrit dans cet article, commencez par le <a href="https://github.com/zilliztech/claude-context">dépôt GitHub Claude Context</a> et le <a href="https://www.npmjs.com/package/%40zilliz/claude-context-mcp">package MCP Claude Context</a>. Le dépôt comprend des instructions d'installation, des benchmarks et les paquets TypeScript de base.</p>
<p>Si vous souhaitez comprendre ou personnaliser la couche d'extraction, ces ressources sont des étapes utiles :</p>
<ul>
<li>Apprenez les bases de la base de données vectorielle avec le <a href="https://milvus.io/docs/quickstart.md">Quickstart Milvus</a>.</li>
<li>Explorez la <a href="https://milvus.io/docs/full-text-search.md">recherche plein texte Milvus</a> et le <a href="https://milvus.io/docs/full_text_search_with_milvus.md">tutoriel de recherche plein texte LangChain</a> si vous souhaitez combiner la recherche de type BM25 avec des vecteurs denses.</li>
<li>Examinez les <a href="https://zilliz.com/blog/top-5-open-source-vector-search-engines">moteurs de recherche vectorielle open-source</a> si vous comparez les options d'infrastructure.</li>
<li>Essayez le <a href="https://zilliz.com/blog/zilliz-cloud-just-landed-in-claude-code">plugin Zilliz Cloud pour Claude Code</a> si vous souhaitez effectuer des opérations de base de données vectorielles directement dans le flux de travail de Claude Code.</li>
</ul>
<p>Pour obtenir de l'aide sur Milvus ou l'architecture de recherche de code, rejoignez la <a href="https://milvus.io/community/">communauté Milvus</a> ou réservez les <a href="https://milvus.io/office-hours">heures de bureau Milvus</a> pour des conseils personnalisés. Si vous préférez sauter l'étape de l'installation de l'infrastructure, <a href="https://cloud.zilliz.com/signup">inscrivez-vous à Z</a> illiz <a href="https://cloud.zilliz.com/signup">Cloud</a> ou <a href="https://cloud.zilliz.com/login">connectez-vous à Zilliz Cloud</a> et utilisez Milvus géré comme backend.</p>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">Questions fréquemment posées<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Why-does-Claude-Code-use-so-many-tokens-on-some-coding-tasks" class="common-anchor-header">Pourquoi Claude Code utilise-t-il autant de jetons pour certaines tâches de codage ?</h3><p>Claude Code peut utiliser de nombreux jetons lorsqu'une tâche nécessite des recherches répétées et des boucles de lecture de fichiers dans un grand référentiel. Si l'agent effectue une recherche par mot-clé, lit des fichiers non pertinents, puis effectue une nouvelle recherche, chaque fichier lu ajoute des jetons même si le code n'est pas utile pour la tâche.</p>
<h3 id="How-does-Claude-Context-reduce-Claude-Code-token-usage" class="common-anchor-header">Comment Claude Context réduit-il l'utilisation des jetons de Claude Code ?</h3><p>Claude Context réduit l'utilisation des jetons en recherchant un index de code soutenu par Milvus avant que l'agent ne lise les fichiers. Il récupère les morceaux de code pertinents grâce à la recherche hybride, de sorte que Claude Code peut inspecter moins de fichiers et consacrer une plus grande partie de sa fenêtre de contexte au code réellement important.</p>
<h3 id="Is-Claude-Context-only-for-Claude-Code" class="common-anchor-header">Claude Context est-il réservé à Claude Code ?</h3><p>Non. Claude Context est exposé en tant que serveur MCP, il peut donc fonctionner avec n'importe quel outil de codage qui supporte MCP. Claude Code est l'exemple principal de ce billet, mais la même couche de récupération peut prendre en charge d'autres IDE compatibles MCP et des flux de travail d'agents.</p>
<h3 id="Do-I-need-Zilliz-Cloud-to-use-Claude-Context" class="common-anchor-header">Ai-je besoin de Zilliz Cloud pour utiliser Claude Context ?</h3><p>Claude Context peut utiliser Zilliz Cloud en tant que backend Milvus géré, ce qui est la solution la plus simple si vous ne souhaitez pas gérer une infrastructure de base de données vectorielle. La même architecture de recherche est basée sur les concepts Milvus, de sorte que les équipes peuvent également l'adapter aux déploiements Milvus autogérés.</p>
