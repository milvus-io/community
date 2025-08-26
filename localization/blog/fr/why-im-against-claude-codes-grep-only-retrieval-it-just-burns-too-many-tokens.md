---
id: >-
  why-im-against-claude-codes-grep-only-retrieval-it-just-burns-too-many-tokens.md
title: >-
  Pourquoi suis-je contre la récupération Grep exclusive de Claude Code ? Il
  brûle trop de jetons
author: Cheney Zhang
date: 2025-08-25T00:00:00.000Z
desc: >-
  Découvrez comment la récupération de codes vectoriels permet de réduire de 40
  % la consommation de jetons Claude Code. Solution open-source avec intégration
  MCP facile. Essayez claude-context dès aujourd'hui.
cover: >-
  assets.zilliz.com/why_im_against_claude_codes_grep_only_retrieval_it_just_burns_too_many_tokens_milvus_cover_2928b4b72d.png
tag: Engineering
recommend: false
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Claude Code, vector search, AI IDE, code retrieval, token optimization'
meta_title: >
  Why I’m Against Claude Code’s Grep-Only Retrieval? It Just Burns Too Many
  Tokens
origin: >
  https://milvus.io/blog/why-im-against-claude-codes-grep-only-retrieval-it-just-burns-too-many-tokens.md
---
<p>Les assistants de codage à base d'IA sont en pleine explosion. Au cours des deux dernières années, des outils tels que Cursor, Claude Code, Gemini CLI et Qwen Code sont passés du statut de curiosité à celui de compagnon quotidien pour des millions de développeurs. Mais derrière cet essor rapide se cache une bataille naissante sur un sujet d'une simplicité trompeuse : <strong>comment un assistant de codage IA doit-il rechercher le contexte de votre base de code ?</strong></p>
<p>À l'heure actuelle, il existe deux approches :</p>
<ul>
<li><p><strong>RAG</strong> (récupération sémantique)<strong>alimenté par la recherche vectorielle</strong>.</p></li>
<li><p><strong>La recherche par mot-clé avec grep</strong> (correspondance de chaîne littérale).</p></li>
</ul>
<p>Claude Code et Gemini ont choisi cette dernière approche. En fait, un ingénieur de Claude a ouvertement admis sur Hacker News que Claude Code n'utilise pas du tout RAG. Au lieu de cela, il se contente de parcourir votre repo ligne par ligne (ce qu'ils appellent "agentic search") - pas de sémantique, pas de structure, juste des chaînes de caractères brutes.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_2b03e89759.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Cette révélation a divisé la communauté :</p>
<ul>
<li><p><strong>Les partisans</strong> défendent la simplicité de grep. Il est rapide, exact et, surtout, prévisible. Dans le domaine de la programmation, la précision est primordiale, et les représentations actuelles sont encore trop floues pour que l'on puisse s'y fier.</p></li>
<li><p><strong>Les critiques</strong> considèrent grep comme une impasse. Il vous noie dans des correspondances non pertinentes, brûle des jetons et bloque votre flux de travail. Sans compréhension sémantique, c'est comme si vous demandiez à votre IA de déboguer les yeux bandés.</p></li>
</ul>
<p>Les deux parties ont raison. Après avoir conçu et testé ma propre solution, je peux affirmer que l'approche RAG basée sur la recherche vectorielle change la donne. <strong>Non seulement elle accélère considérablement la recherche et la rend plus précise, mais elle réduit également l'utilisation des jetons de 40 % ou plus. (Passez à la partie Claude Contexte pour connaître mon approche)</strong></p>
<p>Pourquoi grep est-il si limité ? Et comment la recherche vectorielle peut-elle donner de meilleurs résultats dans la pratique ? Voyons cela en détail.</p>
<h2 id="What’s-Wrong-with-Claude-Code’s-Grep-Only-Code-Search" class="common-anchor-header">Qu'est-ce qui ne va pas avec la recherche de code Grep de Claude Code ?<button data-href="#What’s-Wrong-with-Claude-Code’s-Grep-Only-Code-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>J'ai rencontré ce problème lors du débogage d'un problème épineux. Claude Code lançait des requêtes grep à travers mon repo, déversant d'énormes blocs de texte non pertinent. Une minute plus tard, je n'avais toujours pas trouvé le fichier en question. Cinq minutes plus tard, j'avais enfin trouvé les 10 bonnes lignes, mais elles avaient été noyées dans 500 lignes de bruit.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_299eeeaea5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ce n'est pas un cas isolé. En parcourant les problèmes de Claude Code sur GitHub, on constate que de nombreux développeurs frustrés se heurtent au même mur :</p>
<ul>
<li><p>issue1<a href="https://github.com/anthropics/claude-code/issues/1315">: https://github.com/anthropics/claude-code/issues/1315</a></p></li>
<li><p>problème 2<a href="https://github.com/anthropics/claude-code/issues/4556">: https://github.com/anthropics/claude-code/issues/4556</a></p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_938c7244da.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>La frustration de la communauté se résume à trois points de douleur :</p>
<ol>
<li><p><strong>Le gonflement des jetons.</strong> Chaque grep dump déverse des quantités massives de code non pertinent dans le LLM, augmentant les coûts qui s'échelonnent horriblement avec la taille du repo.</p></li>
<li><p><strong>Taxe sur le temps.</strong> Vous devez attendre pendant que l'IA pose vingt questions à votre base de code, ce qui nuit à la concentration et à la fluidité.</p></li>
<li><p><strong>Zéro contexte.</strong> Grep fait correspondre des chaînes de caractères littérales. Il n'a aucune notion de sens ou de relation, et vous effectuez donc une recherche à l'aveugle.</p></li>
</ol>
<p>C'est pourquoi le débat est important : grep n'est pas seulement "old school", il freine activement la programmation assistée par l'IA.</p>
<h2 id="Claude-Code-vs-Cursor-Why-the-Latter-Has-Better-Code-Context" class="common-anchor-header">Code Claude vs Curseur : Pourquoi le dernier a un meilleur contexte de code<button data-href="#Claude-Code-vs-Cursor-Why-the-Latter-Has-Better-Code-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>En ce qui concerne le contexte du code, Cursor a fait un meilleur travail. Dès le premier jour, Cursor s'est penché sur l'<strong>indexation de la base de code</strong>: divisez votre repo en morceaux significatifs, intégrez ces morceaux dans des vecteurs et récupérez-les sémantiquement chaque fois que l'IA a besoin d'un contexte. Il s'agit d'une méthode classique de génération améliorée par récupération (RAG) appliquée au code, et les résultats parlent d'eux-mêmes : un contexte plus étroit, moins de jetons gaspillés et une récupération plus rapide.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_a9f5beb01d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Claude Code, en revanche, a redoublé de simplicité. Pas d'index, pas d'intégration - juste grep. Cela signifie que chaque recherche est une correspondance de chaîne littérale, sans aucune compréhension de la structure ou de la sémantique. C'est rapide en théorie, mais en pratique, les développeurs finissent souvent par passer au crible des bottes de foin de correspondances non pertinentes avant de trouver l'aiguille dont ils ont réellement besoin.</p>
<table>
<thead>
<tr><th></th><th><strong>Code Claude</strong></th><th><strong>Curseur</strong></th></tr>
</thead>
<tbody>
<tr><td>Précision de la recherche</td><td>Ne fait apparaître que les correspondances exactes - ne trouve pas ce qui est nommé différemment.</td><td>Trouve du code sémantiquement pertinent même si les mots-clés ne correspondent pas exactement.</td></tr>
<tr><td>Efficacité</td><td>Grep déverse d'énormes blocs de code dans le modèle, ce qui augmente le coût des jetons.</td><td>Des morceaux plus petits et plus significatifs réduisent la charge de jetons de 30 à 40 %.</td></tr>
<tr><td>Évolutivité</td><td>Re-grep le repo à chaque fois, ce qui ralentit la croissance des projets.</td><td>Indexation une fois, puis récupération à l'échelle avec un décalage minimal.</td></tr>
<tr><td>Philosophie</td><td>Rester minimal - pas d'infrastructure supplémentaire.</td><td>Indexer tout, récupérer intelligemment.</td></tr>
</tbody>
</table>
<p>Pourquoi Claude (ou Gemini, ou Cline) n'a-t-il pas suivi l'exemple de Cursor ? Les raisons sont en partie techniques et en partie culturelles. <strong>La recherche vectorielle n'est pas triviale - il faut résoudre les problèmes de découpage, de mises à jour incrémentales et d'indexation à grande échelle.</strong> Mais surtout, Claude Code est construit autour du minimalisme : pas de serveurs, pas d'index, juste un CLI propre. Les embeddings et les bases de données vectorielles ne correspondent pas à cette philosophie de conception.</p>
<p>Cette simplicité est séduisante, mais elle limite aussi les possibilités de Claude Code. La volonté de Cursor d'investir dans une véritable infrastructure d'indexation est la raison pour laquelle il semble plus puissant aujourd'hui.</p>
<h2 id="Claude-Context-an-Open-Source-Project-for-Adding-Semantic-Code-Search-to-Claude-Code" class="common-anchor-header">Claude Context : un projet Open-Source pour ajouter la recherche sémantique de code à Claude Code<button data-href="#Claude-Context-an-Open-Source-Project-for-Adding-Semantic-Code-Search-to-Claude-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Code est un outil puissant, mais son contexte de code est médiocre. Cursor a résolu ce problème avec l'indexation de la base de code, mais Cursor est fermé, verrouillé par des abonnements, et coûteux pour les individus ou les petites équipes.</p>
<p>C'est pourquoi nous avons commencé à construire notre propre solution open-source : <a href="https://github.com/zilliztech/claude-context"><strong>Claude Context</strong></a>.</p>
<p><a href="https://github.com/zilliztech/claude-context"><strong>Claude Context</strong></a> est un plugin MCP open-source qui apporte la <strong>recherche sémantique de code</strong> à Claude Code (et à tout autre agent de codage IA qui parle MCP). Au lieu de forcer brutalement votre repo avec grep, il intègre des bases de données vectorielles avec des modèles d'intégration pour donner aux LLMs un <em>contexte profond et ciblé à</em> partir de l'ensemble de votre base de code. Le résultat : une recherche plus précise, moins de gaspillage de jetons, et une bien meilleure expérience pour les développeurs.</p>
<p>Voici comment nous l'avons construit :</p>
<h3 id="Technologies-We-Use" class="common-anchor-header">Technologies utilisées</h3><p><strong>Couche d'interface : MCP en tant que connecteur universel</strong></p>
<p>Nous voulions que cela fonctionne partout, pas seulement chez Claude. MCP (Model Context Protocol) agit comme la norme USB pour les LLM, permettant aux outils externes de se connecter de manière transparente. En présentant Claude Context comme un serveur MCP, il fonctionne non seulement avec Claude Code mais aussi avec Gemini CLI, Qwen Code, Cline, et même Cursor.</p>
<p><strong>🗄️ Base de données vectorielles : Zilliz Cloud</strong></p>
<p>Pour le backbone, nous avons choisi <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (un service entièrement géré basé sur <a href="https://milvus.io/">Milvus</a>). Il s'agit d'un service haute performance, cloud-native, élastique et conçu pour les charges de travail d'IA telles que l'indexation de bases de code. Cela signifie une récupération à faible latence, une échelle quasi infinie et une fiabilité à toute épreuve.</p>
<p><strong>🧩 Modèles d'intégration : Flexible dès la conceptionDifférentes</strong>équipes ont des besoins différents, c'est pourquoi Claude Context prend en charge plusieurs fournisseurs d'intégration dès sa sortie de l'usine :</p>
<ul>
<li><p><strong>OpenAI embeddings</strong> pour la stabilité et l'adoption à grande échelle.</p></li>
<li><p><strong>Voyage embeddings</strong> pour une performance spécialisée dans le code.</p></li>
<li><p><strong>Ollama</strong> pour les déploiements locaux axés sur la protection de la vie privée.</p></li>
</ul>
<p>D'autres modèles peuvent être intégrés au fur et à mesure de l'évolution des besoins.</p>
<p><strong>💻 Choix du langage : TypeScript</strong></p>
<p>Nous avons débattu entre Python et TypeScript. TypeScript l'a emporté, non seulement pour la compatibilité au niveau de l'application (plugins VSCode, outils Web), mais aussi parce que Claude Code et Gemini CLI sont eux-mêmes basés sur TypeScript. Cela rend l'intégration transparente et maintient la cohérence de l'écosystème.</p>
<h3 id="System-Architecture" class="common-anchor-header">Architecture du système</h3><p>Claude Context suit une conception propre, en couches :</p>
<ul>
<li><p>Les<strong>modules de base</strong> gèrent le gros du travail : analyse du code, découpage, indexation, récupération et synchronisation.</p></li>
<li><p>L'<strong>interface utilisateur</strong> gère les intégrations - serveurs MCP, plugins VSCode ou autres adaptateurs.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/5_0c70864d6f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Cette séparation permet au moteur central d'être réutilisé dans différents environnements tout en permettant aux intégrations d'évoluer rapidement au fur et à mesure de l'apparition de nouveaux assistants de codage d'IA.</p>
<h3 id="Core-Module-Implementation" class="common-anchor-header">Mise en œuvre des modules de base</h3><p>Les modules de base constituent le fondement de l'ensemble du système. Ils abstraient les bases de données vectorielles, les modèles d'intégration et d'autres composants en modules composables qui créent un objet Contexte, permettant différentes bases de données vectorielles et modèles d'intégration pour différents scénarios.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">Context</span>, <span class="hljs-title class_">MilvusVectorDatabase</span>, <span class="hljs-title class_">OpenAIEmbedding</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@zilliz/claude-context-core&#x27;</span>;
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
<h2 id="Solving-Key-Technical-Challenges" class="common-anchor-header">Résoudre les principaux défis techniques<button data-href="#Solving-Key-Technical-Challenges" class="anchor-icon" translate="no">
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
    </button></h2><p>Construire Claude Context n'était pas seulement une question de câblage d'encastrements et de base de données vectorielles. Le vrai travail a consisté à résoudre les problèmes difficiles qui font ou défont l'indexation de code à l'échelle. Voici comment nous avons abordé les trois plus grands défis :</p>
<h3 id="Challenge-1-Intelligent-Code-Chunking" class="common-anchor-header">Défi 1 : Découpage intelligent du code</h3><p>Le code ne peut pas être divisé en lignes ou en caractères. Cela crée des fragments désordonnés et incomplets et supprime la logique qui rend le code compréhensible.</p>
<p>Nous avons résolu ce problème à l'aide de <strong>deux stratégies complémentaires</strong>:</p>
<h4 id="AST-Based-Chunking-Primary-Strategy" class="common-anchor-header">Découpage basé sur l'AST (stratégie principale)</h4><p>Il s'agit de l'approche par défaut, qui utilise des analyseurs syntaxiques pour comprendre la structure syntaxique du code et le découper le long des frontières sémantiques : fonctions, classes, méthodes. Cela permet d'obtenir</p>
<ul>
<li><p><strong>Complétude de la syntaxe</strong> - pas de fonctions coupées ou de déclarations brisées.</p></li>
<li><p><strong>Cohérence logique</strong> - les éléments logiques connexes restent ensemble pour une meilleure récupération sémantique.</p></li>
<li><p><strong>Prise en charge multilingue</strong> - fonctionne avec JS, Python, Java, Go, et plus encore grâce à des grammaires de type "tree-sitter".</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/6_e976593d7e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h4 id="LangChain-Text-Splitting-Fallback-Strategy" class="common-anchor-header">Fractionnement de texte LangChain (stratégie de repli)</h4><p>Pour les langues qu'AST ne peut pas analyser ou lorsque l'analyse échoue, le site <code translate="no">RecursiveCharacterTextSplitter</code> de LangChain offre une solution de secours fiable.</p>
<pre><code translate="no"><span class="hljs-comment">// Use recursive character splitting to maintain code structure</span>
<span class="hljs-keyword">const</span> splitter = <span class="hljs-title class_">RecursiveCharacterTextSplitter</span>.<span class="hljs-title function_">fromLanguage</span>(language, { 
  <span class="hljs-attr">chunkSize</span>: <span class="hljs-number">1000</span>, 
  <span class="hljs-attr">chunkOverlap</span>: <span class="hljs-number">200</span>,
});
<button class="copy-code-btn"></button></code></pre>
<p>Il est moins "intelligent" que l'AST, mais très fiable, ce qui garantit aux développeurs qu'ils ne seront jamais laissés en rade. Ensemble, ces deux stratégies permettent d'équilibrer la richesse sémantique et l'applicabilité universelle.</p>
<h3 id="Challenge-2-Handling-Code-Changes-Efficiently" class="common-anchor-header">Défi n° 2 : gérer efficacement les modifications de code</h3><p>La gestion des modifications du code représente l'un des plus grands défis des systèmes d'indexation du code. Réindexer des projets entiers pour des modifications mineures de fichiers serait totalement impraticable.</p>
<p>Pour résoudre ce problème, nous avons mis au point un mécanisme de synchronisation basé sur les arbres de Merkle.</p>
<h4 id="Merkle-Trees-The-Foundation-of-Change-Detection" class="common-anchor-header">Arbres de Merkle : La base de la détection des changements</h4><p>Les arbres de Merkle créent un système hiérarchique d'"empreintes digitales" dans lequel chaque fichier a sa propre empreinte de hachage, les dossiers ont des empreintes basées sur leur contenu, et le tout aboutit à une empreinte unique du nœud racine pour l'ensemble de la base de code.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/7_79adb21c84.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Lorsque le contenu d'un fichier est modifié, les empreintes de hachage remontent en cascade à travers chaque couche jusqu'au nœud racine. Cela permet de détecter rapidement les modifications en comparant les empreintes de hachage couche par couche à partir de la racine, ce qui permet d'identifier et de localiser rapidement les modifications apportées aux fichiers sans réindexer l'ensemble du projet.</p>
<p>Le système effectue des contrôles de synchronisation toutes les 5 minutes à l'aide d'un processus rationalisé en trois phases :</p>
<p><strong>Phase 1 : La détection rapide comme l'éclair</strong> calcule le hachage Merkle de la racine de l'ensemble de la base de code et le compare à l'instantané précédent. Des hachages de racines identiques signifient qu'aucune modification n'a été apportée et le système saute tout le traitement en quelques millisecondes.</p>
<p>La<strong>phase 2 : Comparaison précise</strong> se déclenche lorsque les hachages de la racine diffèrent, en effectuant une analyse détaillée au niveau des fichiers pour identifier exactement les fichiers ajoutés, supprimés ou modifiés.</p>
<p><strong>Phase 3 : Mises à jour incrémentielles</strong> recalcule les vecteurs uniquement pour les fichiers modifiés et met à jour la base de données vectorielle en conséquence, ce qui optimise l'efficacité.</p>
<h4 id="Local-Snapshot-Management" class="common-anchor-header">Gestion des instantanés locaux</h4><p>Tous les états de synchronisation sont conservés localement dans le répertoire <code translate="no">~/.context/merkle/</code> de l'utilisateur. Chaque base de code conserve son propre fichier d'instantanés indépendant contenant les tables de hachage des fichiers et les données sérialisées de l'arbre Merkle, ce qui garantit une récupération précise de l'état, même après le redémarrage du programme.</p>
<p>Cette conception présente des avantages évidents : la plupart des vérifications sont effectuées en quelques millisecondes lorsqu'il n'y a pas de changement, seuls les fichiers réellement modifiés déclenchent un retraitement (ce qui évite un gaspillage massif de ressources informatiques), et la récupération de l'état fonctionne parfaitement entre les sessions du programme.</p>
<p>Du point de vue de l'utilisateur, la modification d'une seule fonction déclenche la réindexation de ce seul fichier, et non de l'ensemble du projet, ce qui améliore considérablement l'efficacité du développement.</p>
<h3 id="Challenge-3-Designing-the-MCP-Interface" class="common-anchor-header">Défi 3 : Conception de l'interface MCP</h3><p>Même le moteur d'indexation le plus intelligent est inutile sans une interface propre pour le développeur. MCP était le choix évident, mais il a introduit des défis uniques :</p>
<h4 id="🔹-Tool-Design-Keep-It-Simple" class="common-anchor-header"><strong>🔹 Conception de l'outil : Rester simple</strong></h4><p>Le module MCP sert d'interface avec l'utilisateur, ce qui fait de l'expérience utilisateur la priorité absolue.</p>
<p>La conception des outils commence par l'abstraction des opérations standard d'indexation et de recherche dans les bases de code en deux outils principaux : <code translate="no">index_codebase</code> pour l'indexation des bases de code et <code translate="no">search_code</code> pour la recherche dans le code.</p>
<p>Cela soulève une question importante : quels sont les outils supplémentaires nécessaires ?</p>
<p>Le nombre d'outils doit être soigneusement équilibré - trop d'outils créent une surcharge cognitive et brouillent la sélection des outils LLM, tandis que trop peu d'outils risquent de manquer des fonctionnalités essentielles.</p>
<p>Travailler à rebours à partir de cas d'utilisation réels permet de répondre à cette question.</p>
<h4 id="Addressing-Background-Processing-Challenges" class="common-anchor-header">Relever les défis du traitement en arrière-plan</h4><p>L'indexation de grandes bases de code peut prendre un temps considérable. L'approche naïve consistant à attendre de manière synchrone que l'indexation soit terminée oblige les utilisateurs à attendre plusieurs minutes, ce qui est tout simplement inacceptable. Le traitement asynchrone en arrière-plan devient essentiel, mais MCP ne supporte pas nativement ce modèle.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_e1f0aa290f.png" alt="8.png" class="doc-image" id="8.png" />
   </span> <span class="img-wrapper"> <span>8.png</span> </span></p>
<p>Notre serveur MCP exécute un processus d'arrière-plan au sein du serveur MCP pour gérer l'indexation tout en renvoyant immédiatement les messages de démarrage aux utilisateurs, ce qui leur permet de continuer à travailler.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/9_1cb37d15f3.png" alt="9.png" class="doc-image" id="9.png" />
   </span> <span class="img-wrapper"> <span>9.png</span> </span></p>
<p>Cela crée un nouveau défi : comment les utilisateurs peuvent-ils suivre la progression de l'indexation ?</p>
<p>Un outil dédié à l'interrogation de la progression ou de l'état de l'indexation résout élégamment ce problème. Le processus d'indexation en arrière-plan met en cache de manière asynchrone les informations relatives à la progression, ce qui permet aux utilisateurs de vérifier à tout moment les pourcentages d'achèvement, l'état de réussite ou les conditions d'échec. En outre, un outil d'effacement manuel des index gère les situations où les utilisateurs doivent réinitialiser les index inexacts ou redémarrer le processus d'indexation.</p>
<p><strong>Conception finale de l'outil :</strong></p>
<p><code translate="no">index_codebase</code> - Base de code d'indexation<code translate="no">search_code</code> - Code de recherche<code translate="no">get_indexing_status</code> - Statut d'indexation<code translate="no">clear_index</code> - Effacer l'index</p>
<p>Quatre outils qui atteignent l'équilibre parfait entre simplicité et fonctionnalité.</p>
<h4 id="🔹-Environment-Variable-Management" class="common-anchor-header">🔹 Gestion des variables d'environnement</h4><p>La gestion des variables d'environnement est souvent négligée alors qu'elle a un impact significatif sur l'expérience utilisateur. Exiger une configuration séparée de la clé API pour chaque client MCP obligerait les utilisateurs à configurer les informations d'identification plusieurs fois lorsqu'ils passent de Claude Code à Gemini CLI.</p>
<p>Une approche de configuration globale élimine cette friction en créant un fichier <code translate="no">~/.context/.env</code> dans le répertoire personnel de l'utilisateur :</p>
<pre><code translate="no"><span class="hljs-comment"># ~/.context/.env</span>
OPENAI_API_KEY=your-api-key-here
MILVUS_TOKEN=your-milvus-token
<button class="copy-code-btn"></button></code></pre>
<p><strong>Cette approche offre des avantages évidents :</strong> les utilisateurs configurent une fois et utilisent partout à travers tous les clients MCP, toutes les configurations sont centralisées dans un seul endroit pour une maintenance facile, et les clés API sensibles ne sont pas dispersées à travers de multiples fichiers de configuration.</p>
<p>Nous mettons également en œuvre une hiérarchie de priorité à trois niveaux : les variables d'environnement de processus ont la priorité la plus élevée, les fichiers de configuration globaux ont une priorité moyenne et les valeurs par défaut servent de repli.</p>
<p>Cette conception offre une grande flexibilité : les développeurs peuvent utiliser les variables d'environnement pour des tests temporaires, les environnements de production peuvent injecter des configurations sensibles à travers les variables d'environnement du système pour une sécurité accrue, et les utilisateurs configurent une fois pour travailler de façon transparente à travers Claude Code, Gemini CLI, et d'autres outils.</p>
<p>À ce stade, l'architecture de base du serveur MCP est complète, couvrant l'analyse du code et le stockage des vecteurs jusqu'à la récupération intelligente et la gestion de la configuration. Chaque composant a été soigneusement conçu et optimisé pour créer un système à la fois puissant et convivial.</p>
<h2 id="Hands-on-Testing" class="common-anchor-header">Tests pratiques<button data-href="#Hands-on-Testing" class="anchor-icon" translate="no">
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
    </button></h2><p>Comment Claude Context se comporte-t-il en pratique ? Je l'ai testé exactement dans le même scénario de chasse aux bogues qui m'avait initialement frustré.</p>
<p>L'installation n'était qu'une commande avant de lancer Claude Code :</p>
<pre><code translate="no">claude mcp add claude-context -e OPENAI_API_KEY=your-openai-api-key -e MILVUS_TOKEN=your-zilliz-cloud-api-key -- npx <span class="hljs-meta">@zilliz</span>/claude-context-mcp<span class="hljs-meta">@latest</span>
<button class="copy-code-btn"></button></code></pre>
<p>Une fois ma base de code indexée, j'ai donné à Claude Code la même description de bogue que celle qui l'avait précédemment lancé dans une <strong>chasse à l'oie de cinq minutes à l'aide de grep</strong>. Cette fois, grâce à <code translate="no">claude-context</code> MCP calls, il a <strong>immédiatement localisé le fichier et le numéro de ligne exacts</strong>, accompagnés d'une explication du problème.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_context_gif_e04d07cd00.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>La différence n'était pas subtile, c'était le jour et la nuit.</p>
<p>Et il ne s'agissait pas seulement d'une chasse aux bogues. Avec l'intégration de Claude Context, Claude Code a toujours produit des résultats de meilleure qualité :</p>
<ul>
<li><p><strong>Résolution de problèmes</strong></p></li>
<li><p><strong>Refonte du code</strong></p></li>
<li><p><strong>Détection de code en double</strong></p></li>
<li><p><strong>Tests complets</strong></p></li>
</ul>
<p>L'amélioration des performances est également visible dans les chiffres. Lors de tests comparatifs :</p>
<ul>
<li><p>L'utilisation de jetons a chuté de plus de 40 %, sans perte de mémoire.</p></li>
<li><p>Cela se traduit directement par des coûts d'API moins élevés et des réponses plus rapides.</p></li>
<li><p>Par ailleurs, avec le même budget, Claude Context a fourni des résultats beaucoup plus précis.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/11_2659dd3429.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Nous avons mis Claude Context en open-source sur GitHub, et il a déjà obtenu plus de 2,6 km d'étoiles. Nous vous remercions tous pour votre soutien et vos commentaires.</p>
<p>Vous pouvez l'essayer vous-même :</p>
<ul>
<li><p>GitHub :<a href="https://github.com/zilliztech/claude-context"> github.com/zilliztech/claude-context</a></p></li>
<li><p>npm :<a href="https://www.npmjs.com/package/@zilliz/claude-context-mcp"> @zilliz/claude-context-mcp</a></p></li>
</ul>
<p>Des benchmarks détaillés et une méthodologie de test sont disponibles dans le repo. Nous serions ravis de recevoir vos commentaires.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/12_88bf595b15.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Looking-Forward" class="common-anchor-header">Regarder vers l'avenir<button data-href="#Looking-Forward" class="anchor-icon" translate="no">
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
    </button></h2><p>Ce qui a commencé comme une frustration avec grep dans Claude Code s'est transformé en une solution solide : <a href="https://github.com/zilliztech/claude-context"><strong>Claude Context - un</strong></a>plugin MCP open-source qui apporte une recherche sémantique et vectorielle à Claude Code et à d'autres assistants de codage. Le message est simple : les développeurs n'ont pas à se contenter d'outils d'IA inefficaces. Avec RAG et la recherche vectorielle, vous pouvez déboguer plus rapidement, réduire les coûts des jetons de 40 % et obtenir enfin une assistance IA qui comprend vraiment votre base de code.</p>
<p>Et cela ne se limite pas à Claude Code. Parce que Claude Context est construit sur des standards ouverts, la même approche fonctionne de manière transparente avec Gemini CLI, Qwen Code, Cursor, Cline, et plus encore. Plus besoin de se laisser enfermer dans les compromis des fournisseurs qui privilégient la simplicité à la performance.</p>
<p>Nous aimerions que vous fassiez partie de cet avenir :</p>
<ul>
<li><p><strong>Essayez</strong> <a href="https://github.com/zilliztech/claude-context"><strong>Claude Context</strong></a><strong>:</strong> il est open-source et totalement gratuit</p></li>
<li><p><strong>Contribuez à son développement</strong></p></li>
<li><p><strong>Ou construisez votre propre solution</strong> en utilisant Claude Context</p></li>
</ul>
<p>👉 Partagez vos commentaires, posez des questions ou obtenez de l'aide en rejoignant notre <a href="https://discord.com/invite/8uyFbECzPX"><strong>communauté Discord</strong></a>.</p>
