---
id: >-
  building-ai-agents-in-10-minutes-using-natural-language-with-langsmith-agent-builder-milvus.md
title: >-
  Construire des agents d'intelligence artificielle en 10 minutes en utilisant
  le langage naturel avec LangSmith Agent Builder + Milvus
author: Min Yin
date: 2026-01-22T00:00:00.000Z
desc: >-
  Apprenez à créer des agents d'intelligence artificielle dotés de mémoire en
  quelques minutes à l'aide de LangSmith Agent Builder et de Milvus - pas de
  code, langage naturel, prêt pour la production.
cover: assets.zilliz.com/cover_LS_MVS_ab8af19bfa.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: >-
  LangSmith Agent Builder, Milvus vector database, AI agent memory, no-code AI
  agents, building AI assistants
meta_title: |
  Build AI Agents in 10 Minutes with LangSmith Agent Builder & Milvus
origin: >-
  https://milvus.io/blog/building-ai-agents-in-10-minutes-using-natural-language-with-langsmith-agent-builder-milvus.md
---
<p>Alors que le développement de l'IA s'accélère, de plus en plus d'équipes découvrent que la création d'un assistant d'IA ne nécessite pas nécessairement une formation en ingénierie logicielle. Les personnes qui ont le plus besoin d'assistants - les équipes produits, les opérations, le support, les chercheurs - savent souvent exactement ce que l'agent doit faire, mais pas comment l'implémenter dans le code. Les outils traditionnels "sans code" ont tenté de combler ce fossé avec des canevas de type "glisser-déposer", mais ils s'effondrent dès que l'on a besoin d'un véritable comportement de l'agent : raisonnement en plusieurs étapes, utilisation d'outils ou mémoire persistante.</p>
<p>Le nouveau <a href="https://www.langchain.com/langsmith/agent-builder"><strong>LangSmith Agent Builder</strong></a> adopte une approche différente. Au lieu de concevoir des flux de travail, vous décrivez les objectifs de l'agent et les outils disponibles en langage clair, et le moteur d'exécution se charge de la prise de décision. Pas d'organigramme, pas de script, juste une intention claire.</p>
<p>Mais l'intention seule ne suffit pas à produire un assistant intelligent. C'est la <strong>mémoire</strong> qui le fait. C'est là que <a href="https://milvus.io/"><strong>Milvus</strong></a>, la base de données vectorielle open-source largement adoptée, fournit la base. En stockant les documents et l'historique des conversations sous forme d'enchâssements, Milvus permet à votre agent de se souvenir du contexte, d'extraire des informations pertinentes et de répondre avec précision à grande échelle.</p>
<p>Ce guide explique comment construire un assistant IA prêt à la production et doté d'une mémoire en utilisant <strong>LangSmith Agent Builder + Milvus</strong>, le tout sans écrire une seule ligne de code.</p>
<h2 id="What-is-LangSmith-Agent-Builder-and-How-It-Works" class="common-anchor-header">Qu'est-ce que LangSmith Agent Builder et comment fonctionne-t-il ?<button data-href="#What-is-LangSmith-Agent-Builder-and-How-It-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Comme son nom l'indique, <a href="https://www.google.com/search?q=LangSmith+Agent+Builder&amp;oq=what+is+LangSmith+Agent+Builder&amp;gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIHCAEQABiABDIHCAIQABiABDIHCAMQABiABDIHCAQQABiABDIHCAUQABiABDIHCAYQABiABDIHCAcQABiABDIGCAgQABgDMggICRAAGBYYHtIBCTI1OTJqMGoxNagCCLACAfEF2Mylr_IuXLk&amp;sourceid=chrome&amp;ie=UTF-8&amp;ved=2ahUKEwjV1LfvxZ6SAxVFsFYBHYzTJAsQgK4QegQIARAB">LangSmith Agent Builder</a> est un outil sans code de LangChain qui vous permet de construire, de déployer et de gérer des agents d'intelligence artificielle en langage clair. Au lieu d'écrire de la logique ou de concevoir des flux visuels, vous expliquez ce que l'agent doit faire, quels outils il peut utiliser et comment il doit se comporter. Le système se charge ensuite des tâches les plus ardues : génération d'invites, sélection d'outils, câblage des composants et activation de la mémoire.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/_57c5cee35b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Contrairement aux outils traditionnels de type "no-code" ou "workflow", Agent Builder n'a pas de canevas "drag-and-drop" ni de bibliothèque de nœuds. Vous interagissez avec lui de la même manière qu'avec ChatGPT. Décrivez ce que vous voulez construire, répondez à quelques questions de clarification, et l'Agent Builder produit un agent entièrement fonctionnel basé sur votre intention.</p>
<p>En coulisses, cet agent est construit à partir de quatre éléments de base.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_05b90b1f3d.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ul>
<li><strong>L'invite :</strong> L'invite est le cerveau de l'agent, qui définit ses objectifs, ses contraintes et sa logique de décision. LangSmith Agent Builder utilise le méta-prompting pour le construire automatiquement : vous décrivez ce que vous voulez, il pose des questions de clarification, et vos réponses sont synthétisées dans un prompt détaillé, prêt pour la production. Au lieu d'écrire la logique à la main, vous exprimez simplement votre intention.</li>
<li><strong>Outils :</strong> Les outils permettent à l'agent d'agir : envoyer des courriels, poster sur Slack, créer des événements de calendrier, rechercher des données ou appeler des API. Agent Builder intègre ces outils à travers le Model Context Protocol (MCP), qui fournit un moyen sécurisé et extensible d'exposer des capacités. Les utilisateurs peuvent s'appuyer sur les intégrations intégrées ou ajouter des serveurs MCP personnalisés, y compris les <a href="https://milvus.io/blog/why-vibe-coding-generate-outdated-code-and-how-to-fix-it-with-milvus-mcp.md">serveurs MCP Mil</a>vus pour la recherche vectorielle et la mémoire à long terme.</li>
<li><strong>Déclencheurs :</strong> Les déclencheurs définissent le moment où un agent s'exécute. En plus de l'exécution manuelle, vous pouvez attacher des agents à des calendriers ou à des événements externes afin qu'ils répondent automatiquement aux messages, aux courriels ou à l'activité des webhooks. Lorsqu'un déclencheur se déclenche, Agent Builder démarre un nouveau fil d'exécution et exécute la logique de l'agent, ce qui permet un comportement continu, piloté par les événements.</li>
<li><strong>Sous-agents :</strong> Les sous-agents divisent les tâches complexes en unités plus petites et spécialisées. Un agent principal peut déléguer le travail à des sous-agents - chacun ayant sa propre invite et son propre ensemble d'outils - afin que des tâches telles que la récupération de données, le résumé ou le formatage soient gérées par des assistants dédiés. Cela permet d'éviter une seule invite surchargée et de créer une architecture d'agent plus modulaire et évolutive.</li>
</ul>
<h2 id="How-Does-an-Agent-Remember-Your-Preferences" class="common-anchor-header">Comment un agent mémorise-t-il vos préférences ?<button data-href="#How-Does-an-Agent-Remember-Your-Preferences" class="anchor-icon" translate="no">
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
    </button></h2><p>Ce qui rend Agent Builder unique, c'est la façon dont il traite la <em>mémoire</em>. Au lieu de stocker les préférences dans l'historique du chat, l'agent peut mettre à jour ses propres règles de comportement en cours d'exécution. Si vous dites "A partir de maintenant, terminez chaque message Slack par un poème", l'agent ne traite pas cette demande comme une requête unique - il la stocke comme une préférence persistante qui s'appliquera dans les exécutions futures.</p>
<p>Sous le capot, l'agent conserve un fichier de mémoire interne, en quelque sorte son invite système évolutive. Chaque fois qu'il démarre, il lit ce fichier pour décider de son comportement. Lorsque vous apportez des corrections ou des contraintes, l'agent édite le fichier en y ajoutant des règles structurées telles que "Toujours terminer le briefing par un court poème édifiant". Cette approche est beaucoup plus stable que l'historique des conversations, car l'agent réécrit activement ses instructions opérationnelles au lieu d'enterrer vos préférences dans une transcription.</p>
<p>Cette conception est issue du FilesystemMiddleware de DeepAgents, mais elle est entièrement abstraite dans Agent Builder. Vous ne touchez jamais directement aux fichiers : vous exprimez les mises à jour en langage naturel et le système gère les modifications en coulisses. Si vous avez besoin de plus de contrôle, vous pouvez brancher un serveur MCP personnalisé ou passer à la couche DeepAgents pour une personnalisation avancée de la mémoire.</p>
<h2 id="Hands-on-Demo-Building-a-Milvus-Assistant-in-10-Minutes-using-Agent-Builder" class="common-anchor-header">Démonstration pratique : Création d'un assistant Milvus en 10 minutes à l'aide d'Agent Builder<button data-href="#Hands-on-Demo-Building-a-Milvus-Assistant-in-10-Minutes-using-Agent-Builder" class="anchor-icon" translate="no">
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
    </button></h2><p>Maintenant que nous avons couvert la philosophie de conception derrière Agent Builder, parcourons le processus de construction complet avec un exemple pratique. Notre objectif est de créer un assistant intelligent capable de répondre aux questions techniques relatives à Milvus, d'effectuer des recherches dans la documentation officielle et de mémoriser les préférences de l'utilisateur au fil du temps.</p>
<h3 id="Step-1-Sign-In-to-the-LangChain-Website" class="common-anchor-header">Étape 1. Se connecter au site web de LangChain</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_1_b3c461d39b.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Set-Up-Your-Anthropic-API-Key" class="common-anchor-header">Étape 2. Configurez votre clé API Anthropic</h3><p><strong>Remarque :</strong> Anthropic est pris en charge par défaut. Vous pouvez également utiliser un modèle personnalisé, à condition que son type soit inclus dans la liste officiellement supportée par LangChain.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_2_c04400695e.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>1. Ajouter une clé API</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_3_11db4b3824.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>2. Saisir et enregistrer la clé API</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_4_abfc27d796.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-Create-a-New-Agent" class="common-anchor-header">Etape 3. Créer un nouvel agent</h3><p><strong>Remarque :</strong> cliquez sur <strong>En savoir plus</strong> pour consulter la documentation d'utilisation.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_5_e90bf254f2.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_6_7c839d96f3.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol>
<li><strong>Configuration d'un modèle personnalisé (facultatif)</strong></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_7_0dfd5ff561.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(1) Entrez les paramètres et enregistrez</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_8_85f9e3008f.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_9_0d5d0c062c.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Describe-Your-Requirements-to-Create-the-Agent" class="common-anchor-header">Etape 4. Décrivez vos besoins pour créer l'agent</h3><p><strong>Remarque :</strong> Créez l'agent à l'aide d'une description en langage naturel.</p>
<pre><code translate="no">
I need a Milvus technical consultant to <span class="hljs-built_in">help</span> me answer technical questions about vector databases. 

Search the official documentation <span class="hljs-keyword">and</span> remember my preference <span class="hljs-keyword">for</span> the index <span class="hljs-built_in">type</span> I use. 

<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_10_0e033a5200.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol>
<li><strong>Le système pose des questions de suivi pour affiner les exigences</strong></li>
</ol>
<p>Question 1 : Sélectionnez les types d'index Milvus dont l'agent doit se souvenir.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_11_050ac891f0.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Question 2 : Choisissez comment l'agent doit traiter les questions techniques.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_12_d1d6d4f2ed.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Question 3 : Indiquez si l'agent doit se concentrer sur les conseils relatifs à une version spécifique de Milvus.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_13_5d60df75e9.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-5-Review-and-Confirm-the-Generated-Agent" class="common-anchor-header">Étape 5. Examiner et confirmer l'agent généré</h3><p><strong>Remarque :</strong> le système génère automatiquement la configuration de l'agent.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_14_8a596ae853.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Avant de créer l'agent, vous pouvez examiner ses métadonnées, ses outils et ses invites. Lorsque tout semble correct, cliquez sur <strong>Créer</strong> pour continuer.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_15_5c0b27aca7.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_16_998921b071.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-6-Explore-the-Interface-and-Feature-Areas" class="common-anchor-header">Étape 6. Explorer l'interface et les fonctionnalités</h3><p>Une fois l'agent créé, vous verrez trois zones fonctionnelles dans le coin inférieur gauche de l'interface :</p>
<p><strong>(1) Déclencheurs</strong></p>
<p>Les déclencheurs définissent le moment où l'agent doit s'exécuter, soit en réponse à des événements externes, soit selon un calendrier :</p>
<ul>
<li><strong>Slack :</strong> Active l'agent lorsqu'un message arrive dans un canal spécifique.</li>
<li><strong>Gmail :</strong> Déclencher l'agent lors de la réception d'un nouveau courriel</li>
<li><strong>Cron :</strong> Exécuter l'agent à un intervalle programmé</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_17_b77c603413.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(2) Boîte à outils</strong></p>
<p>Il s'agit de l'ensemble des outils que l'agent peut appeler. Dans l'exemple présenté, les trois outils sont générés automatiquement lors de la création, et vous pouvez en ajouter d'autres en cliquant sur <strong>Ajouter un outil</strong>.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_18_94637d4548.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Si votre agent a besoin de capacités de recherche vectorielle - telles que la recherche sémantique dans de grands volumes de documentation technique - vous pouvez déployer le serveur MCP de Milvus</strong> et l'ajouter ici à l'aide du bouton <strong>MCP</strong>. Assurez-vous que le serveur MCP s'exécute <strong>sur un point d'extrémité du réseau accessible</strong>; sinon, Agent Builder ne pourra pas l'invoquer.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_19_94fe99a3b8.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_20_f887a8fbda.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(3) Sous-agents</strong></p>
<p>Créez des modules d'agents indépendants dédiés à des sous-tâches spécifiques, permettant une conception modulaire du système.</p>
<h3 id="Step-7-Test-the-Agent" class="common-anchor-header">Étape 7. Tester l'agent</h3><p>Cliquez sur <strong>Test</strong> dans le coin supérieur droit pour passer en mode test. Vous trouverez ci-dessous un exemple des résultats du test.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_22_527619519b.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_23_639d40c40d.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_24_42a71d2592.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_25_8ab35e15f8.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Agent-Builder-vs-DeepAgents-Which-One-Should-You-Choose" class="common-anchor-header">Agent Builder vs. DeepAgents : Lequel choisir ?<button data-href="#Agent-Builder-vs-DeepAgents-Which-One-Should-You-Choose" class="anchor-icon" translate="no">
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
    </button></h2><p>LangChain propose plusieurs frameworks d'agents, et le bon choix dépend du degré de contrôle dont vous avez besoin. <a href="https://www.google.com/search?q=DeepAgents&amp;newwindow=1&amp;sca_esv=0e7ec9ce2aa7d5b4&amp;sxsrf=ANbL-n5pe1KqjmJVjQCqmc3jneYhmGGOUg%3A1769066335766&amp;ei=X89xab21Lp3a1e8Ppam06Ag&amp;ved=2ahUKEwio15nYzZ6SAxU_mq8BHcf3BqUQgK4QegQIARAB&amp;uact=5&amp;oq=what+is+DeepAgents&amp;gs_lp=Egxnd3Mtd2l6LXNlcnAiEndoYXQgaXMgRGVlcEFnZW50czIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzINEAAYgAQYsAMYQxiKBTINEAAYgAQYsAMYQxiKBUi8BlAYWL8FcAF4AZABAJgBqgKgAbAKqgEFMC4yLjS4AQPIAQD4AQGYAgGgAgyYAwCIBgGQBgqSBwExoAehHrIHALgHAMIHAzMtMcgHCYAIAA&amp;sclient=gws-wiz-serp">DeepAgents</a> est un outil de construction d'agents. Il est utilisé pour construire des agents d'intelligence artificielle autonomes et de longue durée qui gèrent des tâches complexes en plusieurs étapes. Basé sur LangGraph, il prend en charge la planification avancée, la gestion de contexte basée sur des fichiers et l'orchestration de sous-agents, ce qui en fait l'outil idéal pour les projets à long terme ou les projets de production.</p>
<p>Comment cela se compare-t-il à <strong>Agent Builder</strong>, et quand devriez-vous utiliser l'un ou l'autre ?</p>
<p><strong>Agent Builder</strong> se concentre sur la simplicité et la rapidité. Il fait abstraction de la plupart des détails d'implémentation, vous permettant de décrire votre agent en langage naturel, de configurer les outils et de l'exécuter immédiatement. La mémoire, l'utilisation des outils et les flux de travail humains dans la boucle sont gérés pour vous. Agent Builder est donc parfait pour le prototypage rapide, les outils internes et les premières étapes de validation où la facilité d'utilisation compte plus que le contrôle granulaire.</p>
<p><strong>DeepAgents</strong>, en revanche, est conçu pour les scénarios dans lesquels vous avez besoin d'un contrôle total sur la mémoire, l'exécution et l'infrastructure. Vous pouvez personnaliser l'intergiciel, intégrer n'importe quel outil Python, modifier le backend de stockage (y compris la persistance de la mémoire dans <a href="https://milvus.io/blog">Milvus</a>) et gérer explicitement le graphe d'état de l'agent. La contrepartie est un effort d'ingénierie - vous écrivez le code, gérez les dépendances et les modes de défaillance vous-même - mais vous obtenez une pile d'agents entièrement personnalisable.</p>
<p>Il est important de noter qu'<strong>Agent Builder et DeepAgents ne sont pas des écosystèmes distincts : ils forment un continuum unique</strong>. Agent Builder est construit au-dessus de DeepAgents. Cela signifie que vous pouvez commencer par un prototype rapide dans Agent Builder, puis passer à DeepAgents lorsque vous avez besoin de plus de flexibilité, sans tout réécrire à partir de zéro. L'inverse fonctionne également : les modèles construits dans DeepAgents peuvent être présentés comme des modèles d'Agent Builder afin que les utilisateurs non techniques puissent les réutiliser.</p>
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
    </button></h2><p>Grâce au développement de l'IA, la construction d'agents d'IA ne nécessite plus de flux de travail complexes ou d'ingénierie lourde. Avec LangSmith Agent Builder, vous pouvez créer des assistants avec état et longue durée d'exécution en utilisant uniquement le langage naturel. Vous vous concentrez sur la description de ce que l'agent doit faire, tandis que le système se charge de la planification, de l'exécution de l'outil et des mises à jour permanentes de la mémoire.</p>
<p>Associés à <a href="https://milvus.io/blog">Milvus</a>, ces agents bénéficient d'une mémoire fiable et persistante pour la recherche sémantique, le suivi des préférences et le contexte à long terme au fil des sessions. Que vous validiez une idée ou déployiez un système évolutif, LangSmith Agent Builder et Milvus constituent une base simple et flexible pour des agents qui ne se contentent pas de répondre - ils se souviennent et s'améliorent au fil du temps.</p>
<p>Vous avez des questions ou souhaitez une présentation plus approfondie ? Rejoignez notre <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">canal Slack</a> ou réservez une session <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours de</a> 20 minutes pour des conseils personnalisés.</p>
