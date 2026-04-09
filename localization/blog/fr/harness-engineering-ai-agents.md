---
id: harness-engineering-ai-agents.md
title: >-
  Ingénierie de l'harnais : La couche d'exécution dont les agents d'IA ont
  réellement besoin
author: Min Yin
date: 2026-4-9
cover: assets.zilliz.com/05842e3a_b21b_41c9_9d29_13b8d7afa211_428ab449a7.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  harness engineering, AI agent infrastructure, hybrid search, Milvus 2.6,
  Sparse-BM25
meta_title: |
  What Is Harness Engineering for AI Agents? | Milvus
desc: >-
  Harness Engineering construit l'environnement d'exécution autour des agents
  d'IA autonomes. Découvrez ce que c'est, comment OpenAI l'a utilisé et pourquoi
  il nécessite une recherche hybride.
origin: 'https://milvus.io/blog/harness-engineering-ai-agents.md'
---
<p>Mitchell Hashimoto a fondé HashiCorp et co-créé Terraform. En février 2026, il a publié un <a href="https://mitchellh.com/writing/my-ai-adoption-journey">billet de blog</a> décrivant une habitude qu'il avait prise en travaillant avec des agents d'intelligence artificielle : chaque fois qu'un agent commettait une erreur, il concevait une solution permanente dans l'environnement de l'agent. C'est ce qu'il a appelé "l'ingénierie du harnais". En quelques semaines, <a href="https://openai.com/index/harness-engineering/">OpenAI</a> et <a href="https://www.anthropic.com/engineering/harness-design-long-running-apps">Anthropic</a> ont publié des articles d'ingénierie développant cette idée. Le terme " <em>Harness Engineering" (ingénierie du harnais</em> ) était né.</p>
<p>Il a résonné parce qu'il nomme un problème que tous les ingénieurs qui construisent des <a href="https://zilliz.com/glossary/ai-agents">agents d'intelligence artificielle</a> ont déjà rencontré. L'<a href="https://zilliz.com/glossary/prompt-as-code-(prompt-engineering)">ingénierie rapide</a> permet d'obtenir de meilleurs résultats en un seul tour. L'ingénierie contextuelle gère ce que le modèle voit. Mais ni l'une ni l'autre n'aborde ce qui se passe lorsqu'un agent fonctionne de manière autonome pendant des heures, prenant des centaines de décisions sans supervision. C'est cette lacune que Harness Engineering comble - et il dépend presque toujours de la recherche hybride (recherche hybride plein texte et sémantique) pour fonctionner.</p>
<h2 id="What-Is-Harness-Engineering" class="common-anchor-header">Qu'est-ce que l'ingénierie harnais ?<button data-href="#What-Is-Harness-Engineering" class="anchor-icon" translate="no">
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
    </button></h2><p>Le Harness Engineering est la discipline qui consiste à concevoir l'environnement d'exécution autour d'un agent IA autonome. Elle définit les outils que l'agent peut appeler, où il obtient des informations, comment il valide ses propres décisions et quand il doit s'arrêter.</p>
<p>Pour comprendre l'importance de cette discipline, considérons trois niveaux de développement d'un agent d'IA :</p>
<table>
<thead>
<tr><th>Couche</th><th>Ce qu'il optimise</th><th>Champ d'application</th><th>Exemple</th></tr>
</thead>
<tbody>
<tr><td><strong>Ingénierie des invites</strong></td><td>Ce que vous dites au modèle</td><td>Échange unique</td><td>Exemples brefs, incitations à la réflexion en chaîne</td></tr>
<tr><td><strong>Contexte Ingénierie</strong></td><td>Ce que le modèle peut voir</td><td><a href="https://zilliz.com/glossary/context-window">Fenêtre de contexte</a></td><td>Recherche de documents, compression de l'historique</td></tr>
<tr><td><strong>Ingénierie de l'harnachement</strong></td><td>Le monde dans lequel l'agent opère</td><td>Exécution autonome sur plusieurs heures</td><td>Outils, logique de validation, contraintes architecturales</td></tr>
</tbody>
</table>
<p><strong>Prompt Engineering</strong> optimise la qualité d'un échange unique - formulation, structure, exemples. Une conversation, un résultat.</p>
<p>L'<strong>ingénierie du contexte</strong> gère la quantité d'informations que le modèle peut voir en même temps - quels documents récupérer, comment compresser l'historique, ce qui rentre dans la fenêtre de contexte et ce qui est laissé de côté.</p>
<p>L'<strong>ingénierie de l'harnachement</strong> construit le monde dans lequel l'agent opère. Outils, sources de connaissances, logique de validation, contraintes architecturales - tout ce qui détermine si un agent peut fonctionner de manière fiable à travers des centaines de décisions sans supervision humaine.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/harness_engineering_ai_agents_4_2f4bc35890.png" alt="Three layers of AI agent development: Prompt Engineering optimizes what you say, Context Engineering manages what the model sees, and Harness Engineering designs the execution environment" class="doc-image" id="three-layers-of-ai-agent-development:-prompt-engineering-optimizes-what-you-say,-context-engineering-manages-what-the-model-sees,-and-harness-engineering-designs-the-execution-environment" />
   <span>Trois couches de développement d'agents d'intelligence artificielle : L'ingénierie de la promesse optimise ce que vous dites, l'ingénierie du contexte gère ce que le modèle voit et l'ingénierie de l'harnachement conçoit l'environnement d'exécution</span> </span></p>
<p>Les deux premières couches déterminent la qualité d'un seul tour. La troisième détermine si un agent peut fonctionner pendant des heures sans que vous le surveilliez.</p>
<p>Il ne s'agit pas d'approches concurrentes. Il s'agit d'une progression. Au fur et à mesure que les capacités de l'agent augmentent, la même équipe passe par les trois couches, souvent dans le cadre d'un même projet.</p>
<h2 id="How-OpenAI-Used-Harness-Engineering-to-Build-a-Million-Line-Codebase-and-Lessons-They-Learnt" class="common-anchor-header">Comment OpenAI a utilisé Harness Engineering pour construire une base de code d'un million de lignes et les leçons qu'elle en a tirées<button data-href="#How-OpenAI-Used-Harness-Engineering-to-Build-a-Million-Line-Codebase-and-Lessons-They-Learnt" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenAI a mené une expérience interne qui met Harness Engineering en termes concrets. Elle l'a décrite dans son article de blog sur l'ingénierie, <a href="https://openai.com/index/harness-engineering/">"Harness Engineering : Leveraging Codex in an Agent-First World".</a> Une équipe de trois personnes a commencé avec un référentiel vide à la fin du mois d'août 2025. Pendant cinq mois, ils n'ont écrit aucun code eux-mêmes - chaque ligne était générée par Codex, l'agent de codage piloté par l'IA d'OpenAI. Résultat : un million de lignes de code de production et 1 500 demandes de modification fusionnées.</p>
<p>Ce n'est pas le résultat qui est intéressant. Ce sont les quatre problèmes qu'ils ont rencontrés et les solutions qu'ils ont élaborées.</p>
<h3 id="Problem-1-No-Shared-Understanding-of-the-Codebase" class="common-anchor-header">Problème 1 : Pas de compréhension partagée de la base de code</h3><p>Quelle couche d'abstraction l'agent doit-il utiliser ? Quelles sont les conventions d'appellation ? Où en est la discussion sur l'architecture de la semaine dernière ? Sans réponse, l'agent a deviné - et s'est trompé - à plusieurs reprises.</p>
<p>Le premier réflexe a été de créer un fichier <code translate="no">AGENTS.md</code> contenant toutes les conventions, règles et décisions historiques. Cela a échoué pour quatre raisons. Le contexte est rare, et un fichier d'instructions surchargé a évincé la tâche proprement dite. Lorsque tout est marqué comme important, rien ne l'est. La documentation pourrit - les règles de la deuxième semaine deviennent erronées à la huitième semaine. Et un document plat ne peut pas être vérifié mécaniquement.</p>
<p>La solution : réduire <code translate="no">AGENTS.md</code> à 100 lignes. Pas de règles - une carte. Il pointe vers un répertoire <code translate="no">docs/</code> structuré contenant des décisions de conception, des plans d'exécution, des spécifications de produit et des documents de référence. Linters et CI vérifient que les liens croisés restent intacts. L'agent navigue vers ce dont il a besoin.</p>
<p>Le principe sous-jacent est le suivant : si quelque chose n'est pas dans le contexte au moment de l'exécution, il n'existe pas pour l'agent.</p>
<h3 id="Problem-2-Human-QA-Couldnt-Keep-Pace-with-Agent-Output" class="common-anchor-header">Problème 2 : l'assurance qualité humaine ne pouvait pas suivre le rythme de la production de l'agent</h3><p>L'équipe a intégré le protocole Chrome DevTools dans Codex. L'agent pouvait effectuer des captures d'écran des chemins d'interface utilisateur, observer les événements d'exécution et interroger les journaux avec LogQL et les métriques avec PromQL. Ils ont fixé un seuil concret : un service devait démarrer en moins de 800 millisecondes avant qu'une tâche ne soit considérée comme terminée. Les tâches du Codex ont été exécutées pendant plus de six heures d'affilée, généralement pendant que les ingénieurs dormaient.</p>
<h3 id="Problem-3-Architectural-Drift-Without-Constraints" class="common-anchor-header">Problème 3 : Dérive architecturale sans contraintes</h3><p>Sans garde-fou, l'agent reproduisait tous les modèles qu'il trouvait dans la base de données, y compris les mauvais.</p>
<p>La solution : une architecture en couches stricte avec une seule direction de dépendance imposée - Types → Config → Repo → Service → Runtime → UI. Les linters personnalisés appliquent ces règles mécaniquement, avec des messages d'erreur qui incluent l'instruction de correction en ligne.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/harness_engineering_ai_agents_3_f0fc3c9e92.png" alt="Strict layered architecture with one-way dependency validation: Types at the base, UI at the top, custom linters enforce rules with inline fix suggestions" class="doc-image" id="strict-layered-architecture-with-one-way-dependency-validation:-types-at-the-base,-ui-at-the-top,-custom-linters-enforce-rules-with-inline-fix-suggestions" />
   <span>Architecture en couches stricte avec validation des dépendances à sens unique : Les types sont à la base, l'interface utilisateur au sommet, les linters personnalisés appliquent les règles avec des suggestions de correction en ligne.</span> </span></p>
<p>Dans une équipe humaine, cette contrainte apparaît généralement lorsque l'entreprise passe à des centaines d'ingénieurs. Pour un agent de codage, c'est une condition préalable dès le premier jour. Plus un agent évolue rapidement sans contraintes, plus la dérive architecturale s'aggrave.</p>
<h3 id="Problem-4-Silent-Technical-Debt" class="common-anchor-header">Problème 4 : Dette technique silencieuse</h3><p>La solution : encoder les principes fondamentaux du projet dans le référentiel, puis exécuter des tâches Codex en arrière-plan selon un calendrier pour rechercher les déviations et soumettre des PR de remaniement. La plupart ont été fusionnés automatiquement en moins d'une minute - de petits paiements continus plutôt qu'un calcul périodique.</p>
<h2 id="Why-AI-Agents-Cant-Grade-Their-Own-Work" class="common-anchor-header">Pourquoi les agents d'IA ne peuvent pas noter leur propre travail<button data-href="#Why-AI-Agents-Cant-Grade-Their-Own-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>L'expérience d'OpenAI a prouvé que Harness Engineering fonctionne. Mais des recherches distinctes ont mis en évidence un mode d'échec en son sein : les agents sont systématiquement incapables d'évaluer leur propre travail.</p>
<p>Le problème se présente sous deux formes.</p>
<p><strong>L'anxiété liée au contexte.</strong> À mesure que la fenêtre contextuelle se remplit, les agents commencent à terminer les tâches prématurément - non pas parce que le travail est terminé, mais parce qu'ils sentent que la limite de la fenêtre approche. Cognition, l'équipe à l'origine de l'agent de codage d'IA Devin, <a href="https://cognition.ai/blog/devin-sonnet-4-5-lessons-and-challenges">a documenté ce comportement</a> lors de la reconstruction de Devin pour Claude Sonnet 4.5 : le modèle a pris conscience de sa propre fenêtre de contexte et a commencé à prendre des raccourcis bien avant d'être à court de place.</p>
<p>Leur solution a été de la pure ingénierie de harnais. Ils ont activé le contexte beta de 1M de tokens mais ont plafonné l'utilisation réelle à 200K tokens - trompant le modèle en lui faisant croire qu'il avait suffisamment de marge de manœuvre. L'anxiété a disparu. Aucun changement de modèle n'a été nécessaire ; il s'agit simplement d'un environnement plus intelligent.</p>
<p>L'atténuation générale la plus courante est le compactage : résumer l'historique et laisser le même agent continuer avec un contexte compressé. Cela préserve la continuité mais n'élimine pas le comportement sous-jacent. Une alternative est la réinitialisation du contexte : effacer la fenêtre, démarrer une nouvelle instance et transférer l'état par le biais d'un artefact structuré. Cette solution supprime entièrement le déclencheur d'anxiété mais exige un document de transfert complet - les lacunes dans l'artefact signifient des lacunes dans la compréhension du nouvel agent.</p>
<p><strong>Biais d'auto-évaluation.</strong> Lorsque les agents évaluent leur propre production, ils lui attribuent une note élevée. Même pour des tâches comportant des critères objectifs de réussite ou d'échec, l'agent repère un problème, se persuade qu'il n'est pas grave et approuve un travail qui devrait échouer.</p>
<p>La solution s'inspire des GAN (Generative Adversarial Networks) : il s'agit de séparer complètement le générateur de l'évaluateur. Dans un GAN, deux réseaux neuronaux s'affrontent - l'un génère, l'autre juge - et cette tension contradictoire oblige à améliorer la qualité. La même dynamique s'applique aux <a href="https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md">systèmes multi-agents</a>.</p>
<p>Anthropic a testé cela avec un ensemble de trois agents - planificateur, générateur, évaluateur - contre un agent solo chargé de construire un moteur de jeu rétro en 2D. Ils décrivent l'expérience complète dans <a href="https://www.anthropic.com/engineering/harness-design-long-running-apps">"Harness Design for Long-Running Application Development"</a> (Anthropic, 2026). Le planificateur développe un court message en un cahier des charges complet, en laissant délibérément les détails de mise en œuvre non spécifiés - la surspécification précoce se traduit par des erreurs en aval. Le Générateur met en œuvre les fonctionnalités au cours des sprints, mais avant d'écrire le code, il signe un contrat de sprint avec l'Évaluateur : une définition partagée de "fait". L'évaluateur utilise Playwright (le cadre d'automatisation de navigateur open-source de Microsoft) pour parcourir l'application comme un véritable utilisateur, en testant l'interface utilisateur, l'API et le comportement de la base de données. En cas d'échec, le sprint échoue.</p>
<p>L'agent solo a produit un jeu qui s'est techniquement lancé, mais les connexions entité-temps d'exécution étaient rompues au niveau du code, ce qui ne peut être découvert qu'en lisant la source. L'attelage à trois agents a produit un jeu jouable avec une génération de niveaux assistée par l'IA, des animations de sprites et des effets sonores.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/harness_engineering_ai_agents_1_38a13120a7.png" alt="Comparison of solo agent versus three-agent harness: solo agent ran 20 minutes at nine dollars with broken core functionality, while the full harness ran 6 hours at two hundred dollars producing a fully functional game with AI-assisted features" class="doc-image" id="comparison-of-solo-agent-versus-three-agent-harness:-solo-agent-ran-20-minutes-at-nine-dollars-with-broken-core-functionality,-while-the-full-harness-ran-6-hours-at-two-hundred-dollars-producing-a-fully-functional-game-with-ai-assisted-features" />
   </span> <span class="img-wrapper"> <span>Comparaison entre l'agent solo et l'architecture à trois agents : l'agent solo a fonctionné pendant 20 minutes pour un coût de neuf dollars, avec des fonctionnalités de base défectueuses, tandis que l'architecture complète a fonctionné pendant 6 heures pour un coût de deux cents dollars, produisant un jeu entièrement fonctionnel avec des fonctions assistées par l'IA.</span> </span></p>
<p>L'architecture à trois agents a coûté environ 20 fois plus cher. Le résultat est passé d'inutilisable à utilisable. C'est là l'essentiel de l'échange qu'effectue Harness Engineering : une surcharge structurelle en échange de la fiabilité.</p>
<h2 id="The-Retrieval-Problem-Inside-Every-Agent-Harness" class="common-anchor-header">Le problème de la recherche à l'intérieur de chaque harnais d'agents<button data-href="#The-Retrieval-Problem-Inside-Every-Agent-Harness" class="anchor-icon" translate="no">
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
    </button></h2><p>Les deux modèles - le système structuré <code translate="no">docs/</code> et le cycle de sprint Générateur/Evaluateur - partagent une dépendance silencieuse : l'agent doit trouver la bonne information à partir d'une base de connaissances vivante et évolutive lorsqu'il en a besoin.</p>
<p>C'est plus difficile qu'il n'y paraît. Prenons un exemple concret : le générateur exécute le sprint 3, qui consiste à mettre en œuvre l'authentification des utilisateurs. Avant d'écrire le code, il a besoin de deux types d'informations.</p>
<p>Tout d'abord, une requête <a href="https://zilliz.com/glossary/semantic-search">sémantique</a>: <em>quels sont les principes de conception de ce produit concernant les sessions utilisateur ?</em> Le document pertinent pourrait utiliser "gestion de session" ou "contrôle d'accès" - et non "authentification de l'utilisateur". Sans compréhension sémantique, la recherche passe à côté.</p>
<p>Deuxièmement, une requête de correspondance exacte : <em>quels sont les documents qui font référence à la fonction <code translate="no">validateToken</code>?</em> Le nom d'une fonction est une chaîne arbitraire sans signification sémantique. La <a href="https://zilliz.com/glossary/vector-embeddings">recherche basée sur l'intégration</a> ne peut pas le trouver de manière fiable. Seule la correspondance par mot-clé fonctionne.</p>
<p>Ces deux requêtes sont simultanées. Elles ne peuvent pas être séparées en étapes séquentielles.</p>
<p>La <a href="https://zilliz.com/learn/vector-similarity-search">recherche vectorielle</a> pure échoue sur les correspondances exactes. La <a href="https://milvus.io/docs/embed-with-bm25.md">BM25</a> traditionnelle échoue sur les requêtes sémantiques et ne peut pas prédire quel vocabulaire un document utilisera. Avant Milvus 2.5, la seule option était de disposer de deux systèmes de recherche parallèles - un index vectoriel et un <a href="https://milvus.io/docs/full-text-search.md">index plein texte</a> - fonctionnant simultanément au moment de la requête avec une logique de fusion des résultats personnalisée. Pour un référentiel <code translate="no">docs/</code> en direct avec des mises à jour continues, les deux index devaient rester synchronisés : chaque modification de document déclenchait une réindexation à deux endroits, avec un risque constant d'incohérence.</p>
<h2 id="How-Milvus-26-Solves-Agent-Retrieval-with-a-Single-Hybrid-Pipeline" class="common-anchor-header">Comment Milvus 2.6 résout la question de la recherche d'agents avec un pipeline hybride unique<button data-href="#How-Milvus-26-Solves-Agent-Retrieval-with-a-Single-Hybrid-Pipeline" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus est une <a href="https://zilliz.com/learn/what-is-vector-database">base de données vectorielle</a> open-source conçue pour les charges de travail d'IA. La base de données Sparse-BM25 de Milvus 2.6 résout le problème de l'extraction à deux pipelines en un seul système.</p>
<p>Lors de l'ingestion, Milvus génère deux représentations simultanément : un <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">encastrement dense</a> pour la recherche sémantique et un <a href="https://milvus.io/docs/sparse_vector.md">vecteur clairsemé codé en TF</a> pour la notation BM25. Les <a href="https://zilliz.com/learn/tf-idf-understanding-term-frequency-inverse-document-frequency-in-nlp">statistiques</a> globales de l <a href="https://zilliz.com/learn/tf-idf-understanding-term-frequency-inverse-document-frequency-in-nlp">'IDF</a> sont mises à jour automatiquement au fur et à mesure que des documents sont ajoutés ou supprimés - aucune réindexation manuelle n'est nécessaire. Au moment de l'interrogation, une entrée en langage naturel génère en interne les deux types de vecteurs d'interrogation. La <a href="https://milvus.io/docs/rrf-ranker.md">fusion réciproque des rangs (RRF)</a> fusionne les résultats classés et l'appelant reçoit un seul ensemble de résultats unifiés.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/harness_engineering_ai_agents_2_8504a6ee08.png" alt="Before and after: two separate systems with manual sync, fragmented results, and custom fusion logic versus Milvus 2.6 single pipeline with dense embedding, Sparse BM25, RRF fusion, and automatic IDF maintenance producing unified results" class="doc-image" id="before-and-after:-two-separate-systems-with-manual-sync,-fragmented-results,-and-custom-fusion-logic-versus-milvus-2.6-single-pipeline-with-dense-embedding,-sparse-bm25,-rrf-fusion,-and-automatic-idf-maintenance-producing-unified-results" />
   </span> <span class="img-wrapper"> <span>Avant et après : deux systèmes distincts avec synchronisation manuelle, résultats fragmentés et logique de fusion personnalisée par rapport au pipeline unique Milvus 2.6 avec intégration dense, Sparse BM25, fusion RRF et maintenance IDF automatique produisant des résultats unifiés.</span> </span></p>
<p>Une interface. Un seul index à maintenir.</p>
<p>Sur le <a href="https://zilliz.com/glossary/beir">benchmark BEIR</a> - une suite d'évaluation standard couvrant 18 ensembles de données de recherche hétérogènes - Milvus atteint un débit 3 à 4 fois plus élevé qu'Elasticsearch à rappel équivalent, avec une amélioration QPS jusqu'à 7 fois sur des charges de travail spécifiques. Pour le scénario sprint, une seule requête permet de trouver à la fois le principe de conception de la session (chemin sémantique) et tous les documents mentionnant <code translate="no">validateToken</code> (chemin exact). Le référentiel <code translate="no">docs/</code> est mis à jour en permanence ; la maintenance BM25 IDF signifie qu'un document nouvellement écrit participe à l'évaluation de la requête suivante sans qu'il soit nécessaire de reconstruire le lot.</p>
<p>Il s'agit de la couche d'extraction conçue exactement pour cette catégorie de problèmes. Lorsqu'un agent harness doit rechercher dans une base de connaissances vivante - documentation de code, décisions de conception, historique des sprints - la recherche hybride à pipeline unique n'est pas un avantage. C'est ce qui permet au reste du harnais de fonctionner.</p>
<h2 id="The-Best-Harness-Components-Are-Designed-to-Be-Deleted" class="common-anchor-header">Les meilleurs composants du harnais sont conçus pour être supprimés<button data-href="#The-Best-Harness-Components-Are-Designed-to-Be-Deleted" class="anchor-icon" translate="no">
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
    </button></h2><p>Chaque composant d'un harnais encode une hypothèse sur les limites du modèle. La décomposition en sprints était nécessaire lorsque les modèles perdaient leur cohérence sur de longues tâches. La réinitialisation du contexte était nécessaire lorsque les modèles ressentaient de l'anxiété à l'approche de la limite de la fenêtre. Les agents évaluateurs sont devenus nécessaires lorsque le biais d'auto-évaluation était ingérable.</p>
<p>Ces hypothèses expirent. L'astuce de la fenêtre contextuelle de la cognition peut devenir inutile à mesure que les modèles développent une véritable résistance aux contextes longs. Au fur et à mesure que les modèles s'améliorent, d'autres composants deviendront des frais généraux inutiles qui ralentissent les agents sans ajouter de fiabilité.</p>
<p>Harness Engineering n'est pas une architecture fixe. C'est un système recalibré à chaque nouvelle version de modèle. La première question après une mise à jour majeure n'est pas "que puis-je ajouter ?". C'est "que puis-je enlever ?".</p>
<p>La même logique s'applique à la recherche. À mesure que les modèles traitent des contextes plus longs de manière plus fiable, les stratégies de découpage et le moment de la récupération changeront. Les informations qui doivent être soigneusement fragmentées aujourd'hui pourront être ingérées sous forme de pages entières demain. L'infrastructure de recherche s'adapte en même temps que le modèle.</p>
<p>Chaque composant d'un harnais bien construit attend d'être rendu redondant par un modèle plus intelligent. Ce n'est pas un problème. C'est l'objectif.</p>
<h2 id="Get-Started-with-Milvus" class="common-anchor-header">Commencer avec Milvus<button data-href="#Get-Started-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Si vous construisez une infrastructure d'agents qui a besoin d'une recherche hybride - recherche sémantique et par mot-clé dans un seul pipeline - voici par où commencer :</p>
<ul>
<li>Lisez les <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><strong>notes de mise à jour de Milvus 2.6</strong></a> pour obtenir tous les détails sur Sparse-BM25, la maintenance automatique de l'IDF et les repères de performance.</li>
<li>Rejoignez la <a href="https://milvus.io/community"><strong>communauté Milvus</strong></a> pour poser des questions et partager ce que vous construisez.</li>
<li><a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"><strong>Réservez une session gratuite Milvus Office Hours</strong></a> pour étudier votre cas d'utilisation avec un expert en bases de données vectorielles.</li>
<li>Si vous préférez sauter l'étape de l'installation de l'infrastructure, <a href="https://cloud.zilliz.com/signup"><strong>Zilliz Cloud</strong></a> (qui gère entièrement Milvus) propose un niveau gratuit pour démarrer avec 100 $ de crédits gratuits lors de l'enregistrement avec l'adresse électronique professionnelle.</li>
<li>Mettez-nous en vedette sur GitHub : <a href="https://github.com/milvus-io/milvus"><strong>milvus-io/milvus</strong></a> - 43k+ étoiles et en croissance.</li>
</ul>
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
    </button></h2><h3 id="What-is-harness-engineering-and-how-is-it-different-from-prompt-engineering" class="common-anchor-header">Qu'est-ce que le harness engineering et en quoi est-il différent du prompt engineering ?</h3><p>L'ingénierie des messages optimise ce que vous dites à un modèle en un seul échange - formulation, structure, exemples. Harness Engineering construit l'environnement d'exécution autour d'un agent IA autonome : les outils qu'il peut appeler, les connaissances auxquelles il peut accéder, la logique de validation qui vérifie son travail et les contraintes qui empêchent la dérive architecturale. L'ingénierie rapide façonne un tour de conversation. L'ingénierie d'harnachement détermine si un agent peut fonctionner de manière fiable pendant des heures en prenant des centaines de décisions sans supervision humaine.</p>
<h3 id="Why-do-AI-agents-need-both-vector-search-and-BM25-at-the-same-time" class="common-anchor-header">Pourquoi les agents d'intelligence artificielle ont-ils besoin à la fois de la recherche vectorielle et de BM25 ?</h3><p>Les agents doivent répondre simultanément à deux requêtes de recherche fondamentalement différentes. Les requêtes sémantiques - <em>quels sont nos principes de conception concernant les sessions utilisateur ?</em> - requièrent des encastrements vectoriels denses pour faire correspondre des contenus conceptuellement liés, quel que soit le vocabulaire. Requêtes de correspondance exacte - <em>quels sont les documents qui font référence à la fonction <code translate="no">validateToken</code>?</em> - nécessitent une notation des mots-clés BM25, car les noms de fonctions sont des chaînes arbitraires sans signification sémantique. Un système de recherche qui ne traite qu'un mode manquera systématiquement les requêtes de l'autre type.</p>
<h3 id="How-does-Milvus-Sparse-BM25-work-for-agent-knowledge-retrieval" class="common-anchor-header">Comment Milvus Sparse-BM25 fonctionne-t-il pour la recherche de connaissances sur les agents ?</h3><p>Lors de l'ingestion, Milvus génère simultanément un encastrement dense et un vecteur clair encodé par TF pour chaque document. Les statistiques IDF globales sont mises à jour en temps réel au fur et à mesure que la base de connaissances évolue - aucune réindexation manuelle n'est nécessaire. Au moment de l'interrogation, les deux types de vecteurs sont générés en interne, la fusion réciproque des rangs fusionne les résultats classés et l'agent reçoit un seul ensemble de résultats unifiés. L'ensemble du pipeline s'exécute via une seule interface et un seul index, ce qui est essentiel pour les bases de connaissances mises à jour en permanence, comme un référentiel de documentation de code.</p>
<h3 id="When-should-I-add-an-evaluator-agent-to-my-agent-harness" class="common-anchor-header">Quand dois-je ajouter un agent évaluateur à mon harnais d'agents ?</h3><p>Ajoutez un évaluateur séparé lorsque la qualité des résultats de votre générateur ne peut pas être vérifiée uniquement par des tests automatisés, ou lorsque des biais d'auto-évaluation ont fait passer des défauts inaperçus. Le principe clé : l'évaluateur doit être architecturalement séparé du générateur - le contexte partagé réintroduit le même biais que vous essayez d'éliminer. L'évaluateur doit avoir accès aux outils d'exécution (automatisation du navigateur, appels d'API, requêtes de base de données) pour tester le comportement, et pas seulement pour examiner le code. Les <a href="https://www.anthropic.com/engineering/harness-design-long-running-apps">recherches d'</a> Anthropic ont montré que cette séparation inspirée du GAN a permis de faire passer la qualité des résultats de "techniquement lancés mais cassés" à "entièrement fonctionnels avec des fonctionnalités que l'agent solo n'a jamais essayées".</p>
