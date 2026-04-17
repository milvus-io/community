---
id: create-a-custom-anthropic-skill-for-milvus-to-quickly-spin-up-rag.md
title: >-
  Comment les compétences anthropiques modifient l'outillage des agents - et
  comment créer une compétence personnalisée pour Milvus afin de lancer
  rapidement RAG
author: Min Yin
date: 2026-01-23T00:00:00.000Z
cover: assets.zilliz.com/skills_cover_new_8caa774cc5.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Claude Code, Anthropic Skills, MCP, RAG, Milvus'
meta_title: |
  Create a Custom Anthropic Skill for Milvus to Quickly Spin Up RAG
desc: >-
  Découvrez ce que sont les compétences et comment créer une compétence
  personnalisée dans Claude Code qui construit des systèmes RAG soutenus par
  Milvus à partir d'instructions en langage naturel à l'aide d'un flux de
  travail réutilisable.
origin: >-
  https://milvus.io/blog/create-a-custom-anthropic-skill-for-milvus-to-quickly-spin-up-rag.md
---
<p>L'utilisation des outils joue un rôle important dans le fonctionnement d'un agent. L'agent doit choisir le bon outil, décider quand l'appeler et formater les entrées correctement. Sur le papier, cela semble simple, mais une fois que l'on commence à construire des systèmes réels, on trouve beaucoup de cas limites et de modes de défaillance.</p>
<p>De nombreuses équipes utilisent des définitions d'outils de type MCP pour organiser tout cela, mais le MCP a quelques défauts. Le modèle doit raisonner sur tous les outils à la fois, et il n'y a pas beaucoup de structure pour guider ses décisions. De plus, chaque définition d'outil doit se trouver dans la fenêtre de contexte. Certaines d'entre elles sont volumineuses - le MCP de GitHub représente environ 26k tokens - ce qui mange le contexte avant même que l'agent ne commence à faire du vrai travail.</p>
<p>Anthropic a introduit les <a href="https://github.com/anthropics/skills?tab=readme-ov-file"><strong>compétences</strong></a> pour améliorer cette situation. Les compétences sont plus petites, plus ciblées et plus faciles à charger à la demande. Au lieu de tout déverser dans le contexte, vous empaquetez la logique du domaine, les workflows ou les scripts dans des unités compactes que l'agent peut extraire seulement quand il en a besoin.</p>
<p>Dans ce billet, j'expliquerai comment fonctionnent les compétences anthropiques et je décrirai ensuite la construction d'une compétence simple dans Claude Code qui transforme le langage naturel en une base de connaissances <a href="https://milvus.io/">soutenue par Milvus</a>- une configuration rapide pour RAG sans câblage supplémentaire.</p>
<h2 id="What-Are-Anthropic-Skills" class="common-anchor-header">Que sont les compétences anthropiques ?<button data-href="#What-Are-Anthropic-Skills" class="anchor-icon" translate="no">
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
    </button></h2><p>Les<a href="https://milvus.io/blog/is-mcp-already-outdated-the-real-reason-anthropic-shipped-skills-and-how-to-pair-them-with-milvus.md">compétences anthropiques</a> (ou compétences d'agent) sont des dossiers qui regroupent les instructions, les scripts et les fichiers de référence dont un agent a besoin pour effectuer une tâche spécifique. Il s'agit de petits ensembles de capacités autonomes. Une compétence peut définir la manière de générer un rapport, d'effectuer une analyse ou de suivre un flux de travail particulier ou un ensemble de règles.</p>
<p>L'idée clé est que les compétences sont modulaires et peuvent être chargées à la demande. Au lieu d'insérer d'énormes définitions d'outils dans la fenêtre contextuelle, l'agent n'y fait entrer que les compétences dont il a besoin. Cela permet de limiter l'utilisation du contexte tout en donnant au modèle des indications claires sur les outils existants, le moment où il faut les appeler et la manière d'exécuter chaque étape.</p>
<p>Le format est intentionnellement simple, et pour cette raison, il est déjà supporté ou facilement adapté à travers un grand nombre d'outils de développement - Claude Code, Cursor, VS Code extensions, intégrations GitHub, configurations de style Codex, et ainsi de suite.</p>
<p>Une compétence suit une structure de dossiers cohérente :</p>
<pre><code translate="no">skill-name/

├── SKILL.md       <span class="hljs-comment"># Required: Skill instructions and metadata</span>

├── scripts/         <span class="hljs-comment"># Optional: helper scripts</span>

├── templates/       <span class="hljs-comment"># Optional: document templates</span>

└── resources/       <span class="hljs-comment"># Optional: reference materials</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>1.</strong> <code translate="no">SKILL.md</code> <strong>(Core File)</strong></p>
<p>Il s'agit du guide d'exécution pour l'agent - le document qui indique à l'agent exactement comment la tâche doit être exécutée. Il définit les métadonnées de la compétence (telles que le nom, la description et les mots clés du déclencheur), le flux d'exécution et les paramètres par défaut. Dans ce fichier, vous devez décrire clairement</p>
<ul>
<li><p><strong>le moment où la compétence doit être exécutée :</strong> Par exemple, déclencher la compétence lorsque l'entrée de l'utilisateur comprend une phrase comme "traiter des fichiers CSV avec Python".</p></li>
<li><p><strong>Comment la tâche doit être exécutée :</strong> Présentez les étapes d'exécution dans l'ordre, par exemple : interpréter la demande de l'utilisateur → appeler les scripts de prétraitement du répertoire <code translate="no">scripts/</code> → générer le code requis → formater la sortie à l'aide des modèles de <code translate="no">templates/</code>.</p></li>
<li><p><strong>Règles et contraintes :</strong> Spécifier des détails tels que les conventions de codage, les formats de sortie et la manière dont les erreurs doivent être gérées.</p></li>
</ul>
<p><strong>2.</strong> <code translate="no">scripts/</code> <strong>(Scripts d'exécution)</strong></p>
<p>Ce répertoire contient des scripts pré-écrits dans des langages tels que Python, Shell ou Node.js. L'agent peut appeler ces scripts directement, au lieu de générer le même code à plusieurs reprises au moment de l'exécution. Les exemples typiques sont <code translate="no">create_collection.py</code> et <code translate="no">check_env.py</code>.</p>
<p><strong>3.</strong> <code translate="no">templates/</code> <strong>(modèles de documents)</strong></p>
<p>Fichiers modèles réutilisables que l'agent peut utiliser pour générer un contenu personnalisé. Les exemples les plus courants sont les modèles de rapport ou les modèles de configuration.</p>
<p><strong>4.</strong> <code translate="no">resources/</code> <strong>(Documents de référence)</strong></p>
<p>Documents de référence que l'agent peut consulter pendant l'exécution, tels que la documentation de l'API, les spécifications techniques ou les guides de bonnes pratiques.</p>
<p>Dans l'ensemble, cette structure reflète la manière dont le travail est transmis à un nouveau membre de l'équipe : <code translate="no">SKILL.md</code> explique le travail, <code translate="no">scripts/</code> fournit des outils prêts à l'emploi, <code translate="no">templates/</code> définit les formats standard et <code translate="no">resources/</code> fournit des informations générales. Avec tout cela en place, l'agent peut exécuter la tâche de manière fiable et avec un minimum d'approximation.</p>
<h2 id="Hands-on-Tutorial-Creating-a-Custom-Skill-for-a-Milvus-Powered-RAG-System" class="common-anchor-header">Tutoriel pratique : Création d'une compétence personnalisée pour un système RAG alimenté par Milvus<button data-href="#Hands-on-Tutorial-Creating-a-Custom-Skill-for-a-Milvus-Powered-RAG-System" class="anchor-icon" translate="no">
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
    </button></h2><p>Dans cette section, nous allons construire une compétence personnalisée capable de mettre en place une collection Milvus et d'assembler un pipeline RAG complet à partir d'instructions simples en langage naturel. L'objectif est d'éviter tout le travail de configuration habituel - pas de conception manuelle de schéma, pas de configuration d'index, pas de code passe-partout. Vous dites à l'agent ce que vous voulez, et Skill s'occupe des éléments Milvus pour vous.</p>
<h3 id="Design-Overview" class="common-anchor-header">Présentation de la conception</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/design_overview_d4c886291b.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Prerequisites" class="common-anchor-header">Conditions préalables</h3><table>
<thead>
<tr><th>Composant</th><th>Exigences</th></tr>
</thead>
<tbody>
<tr><td>CLI</td><td><code translate="no">claude-code</code></td></tr>
<tr><td>Modèles</td><td>GLM 4.7, OpenAI</td></tr>
<tr><td>Conteneur</td><td>Docker</td></tr>
<tr><td>Milvus</td><td>2.6.8</td></tr>
<tr><td>Plate-forme de configuration de modèles</td><td>CC-Switch</td></tr>
<tr><td>Gestionnaire de paquets</td><td>npm</td></tr>
<tr><td>Langage de développement</td><td>Python</td></tr>
</tbody>
</table>
<h3 id="Step-1-Environment-Setup" class="common-anchor-header">Étape 1 : Configuration de l'environnement</h3><p><strong>Installer CC-Switch</strong> <code translate="no">claude-code</code></p>
<pre><code translate="no">npm install -g <span class="hljs-meta">@anthropic</span>-ai/claude-code
<button class="copy-code-btn"></button></code></pre>
<p><strong>Installer CC-Switch</strong></p>
<p><strong>Note :</strong> CC-Switch est un outil de changement de modèle qui permet de passer facilement d'une API de modèle à l'autre lors de l'exécution locale de modèles d'IA.</p>
<p>Référentiel du projet <a href="https://github.com/farion1231/cc-switch">: https://github.com/farion1231/cc-switch</a></p>
<p><strong>Sélectionnez Claude et ajoutez une clé API</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_0cdfab2e54.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_615ee13649.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Vérifier l'état actuel</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_f1c13da1fe.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Déployer et démarrer Milvus-Standalone</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Download docker-compose.yml</span>

wget https://github.com/milvus-io/milvus/releases/download/v2<span class="hljs-number">.6</span><span class="hljs-number">.8</span>/milvus-standalone-docker-compose.yml -O docker-compose.yml

  

<span class="hljs-comment"># Start Milvus (check port mapping: 19530:19530)</span>

docker-compose up -d

  

<span class="hljs-comment"># Verify that the services are running</span>

docker ps | grep milvus

<span class="hljs-comment"># You should see three containers: milvus-standalone, milvus-etcd, milvus-minio</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code1_9c6a1a7f93.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Configurer la clé API OpenAI</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Add this to ~/.bashrc or ~/.zshrc</span>

OPENAI_API_KEY=your_openai_api_key_here
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Create-the-Custom-Skill-for-Milvus" class="common-anchor-header">Étape 2 : Créer la compétence personnalisée pour Milvus</h3><p><strong>Créer la structure du répertoire</strong></p>
<pre><code translate="no"><span class="hljs-built_in">cd</span> ~/.claude/skills/

<span class="hljs-built_in">mkdir</span> -p milvus-skills/example milvus-skills/scripts
<button class="copy-code-btn"></button></code></pre>
<p><strong>Initialiser</strong> <code translate="no">SKILL.md</code></p>
<p><strong>Note :</strong> SKILL.md sert de guide d'exécution de l'agent. Il définit ce que la compétence fait et comment elle doit être déclenchée.</p>
<pre><code translate="no"><span class="hljs-attr">name</span>: milvus-collection-builder

<span class="hljs-attr">description</span>: <span class="hljs-title class_">Create</span> <span class="hljs-title class_">Milvus</span> collections <span class="hljs-keyword">using</span> natural language, supporting both <span class="hljs-variable constant_">RAG</span> and text search scenarios
<button class="copy-code-btn"></button></code></pre>
<p><strong>Écrire les scripts de base</strong></p>
<table>
<thead>
<tr><th>Type de script</th><th>Nom du fichier</th><th>Objectif</th></tr>
</thead>
<tbody>
<tr><td>Vérification de l'environnement</td><td><code translate="no">check_env.py</code></td><td>Vérifie la version de Python, les dépendances nécessaires et la connexion à Milvus.</td></tr>
<tr><td>Analyse de l'intention</td><td><code translate="no">intent_parser.py</code></td><td>Convertit des requêtes telles que "construire une base de données RAG" en une intention structurée telle que <code translate="no">scene=rag</code></td></tr>
<tr><td>Création d'une collection</td><td><code translate="no">milvus_builder.py</code></td><td>Le constructeur de base qui génère le schéma de la collection et la configuration de l'index.</td></tr>
<tr><td>Ingestion de données</td><td><code translate="no">insert_milvus_data.py</code></td><td>Charge les documents, les regroupe, génère des embeddings et écrit les données dans Milvus.</td></tr>
<tr><td>Exemple 1</td><td><code translate="no">basic_text_search.py</code></td><td>Démontre comment créer un système de recherche de documents.</td></tr>
<tr><td>Exemple 2</td><td><code translate="no">rag_knowledge_base.py</code></td><td>Démontre comment construire une base de connaissances RAG complète.</td></tr>
</tbody>
</table>
<p>Ces scripts montrent comment transformer une compétence centrée sur Milvus en quelque chose de pratique : un système de recherche de documents fonctionnel et une configuration de questions-réponses intelligentes (RAG).</p>
<h3 id="Step-3-Enable-the-Skill-and-Run-a-Test" class="common-anchor-header">Étape 3 : Activer la compétence et effectuer un test</h3><p><strong>Décrire la demande en langage naturel</strong></p>
<pre><code translate="no"><span class="hljs-string">&quot;I want to build an RAG system.&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test1_64fd549573.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Création d'un système RAG</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test2_80656d59b1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Insérer un échantillon de données</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test3_392753eb73.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Exécuter une requête</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test4_75e23c6a3a.png" alt="" class="doc-image" id="" />
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
    </button></h2><p>Dans ce tutoriel, nous avons construit un système RAG alimenté par Milvus à l'aide d'une compétence personnalisée. L'objectif n'était pas seulement de montrer une autre façon d'appeler Milvus, mais aussi de montrer comment les compétences peuvent transformer ce qui est normalement une configuration lourde en plusieurs étapes en quelque chose que vous pouvez réutiliser et sur lequel vous pouvez itérer. Au lieu de définir manuellement des schémas, d'ajuster des index ou d'assembler du code de flux de travail, la compétence prend en charge la plupart des tâches administratives afin que vous puissiez vous concentrer sur les parties de RAG qui comptent réellement.</p>
<p>Ce n'est qu'un début. Un pipeline RAG complet comporte de nombreux éléments mobiles : prétraitement, regroupement, paramètres de recherche hybride, reclassement, évaluation, etc. Tous ces éléments peuvent être regroupés dans des compétences distinctes et composés en fonction de votre cas d'utilisation. Si votre équipe dispose de normes internes pour les dimensions des vecteurs, les paramètres d'index, les modèles d'invite ou la logique de recherche, les compétences sont un moyen propre d'encoder ces connaissances et de les rendre reproductibles.</p>
<p>Pour les nouveaux développeurs, cela abaisse la barrière d'entrée - il n'est pas nécessaire d'apprendre tous les détails de Milvus avant de faire fonctionner quelque chose. Pour les équipes expérimentées, cela permet de réduire les configurations répétées et de maintenir la cohérence des projets entre les environnements. Les compétences ne remplaceront pas une conception réfléchie du système, mais elles éliminent de nombreuses frictions inutiles.</p>
<p>L'implémentation complète est disponible dans le <a href="https://github.com/yinmin2020/open-milvus-skills">dépôt open-source</a>, et vous pouvez explorer d'autres exemples construits par la communauté sur la <a href="https://skillsmp.com/">place de marché des compétences</a>.</p>
<h2 id="Stay-tuned" class="common-anchor-header">Restez à l'écoute !<button data-href="#Stay-tuned" class="anchor-icon" translate="no">
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
    </button></h2><p>Nous travaillons également à l'introduction de compétences officielles Milvus et Zilliz Cloud qui couvrent les modèles RAG courants et les meilleures pratiques de production. Si vous avez des idées ou des flux de travail spécifiques que vous souhaitez voir pris en charge, rejoignez notre <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">canal Slack</a> et discutez avec nos ingénieurs. Et si vous souhaitez obtenir des conseils pour votre propre installation, vous pouvez toujours réserver une session <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a>.</p>
