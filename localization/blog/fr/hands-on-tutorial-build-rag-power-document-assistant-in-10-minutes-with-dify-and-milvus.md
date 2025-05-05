---
id: >-
  hands-on-tutorial-build-rag-power-document-assistant-in-10-minutes-with-dify-and-milvus.md
title: >-
  Tutoriel pratique : Construire un assistant documentaire alimenté par RAG en
  10 minutes avec Dify et Milvus
author: Ruben Winastwan
date: 2025-04-28T00:00:00.000Z
desc: >-
  Apprenez à créer un assistant documentaire alimenté par l'IA en utilisant
  Retrieval Augmented Generation (RAG) avec Dify et Milvus dans ce tutoriel de
  développement rapide et pratique.
cover: assets.zilliz.com/build_rag_with_dify_and_milvus_2ab76c6afd.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'RAG, retrieval augmented generation, Dify, Milvus, no-code AI'
meta_title: |
  Build a RAG Document Assistant in 10 Minutes | Dify & Milvus Tutorial
origin: >-
  https://milvus.io/blog/hands-on-tutorial-build-rag-power-document-assistant-in-10-minutes-with-dify-and-milvus.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/build_rag_with_dify_and_milvus_2ab76c6afd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Et si vous pouviez transformer l'ensemble de votre bibliothèque documentaire - des milliers de pages de spécifications techniques, de wikis internes et de documentation de code - en un assistant IA intelligent qui répond instantanément à des questions spécifiques ?</p>
<p>Mieux encore, que se passerait-il si vous pouviez le construire en moins de temps qu'il n'en faut pour résoudre un conflit de fusion ?</p>
<p>C'est la promesse de la <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Génération Augmentée de Récupération</a> (RAG) lorsqu'elle est mise en œuvre de la bonne manière.</p>
<p>Bien que ChatGPT et les autres LLM soient impressionnants, ils atteignent rapidement leurs limites lorsqu'ils sont interrogés sur la documentation, la base de code ou la base de connaissances spécifiques à votre entreprise. La RAG comble cette lacune en intégrant vos données propriétaires dans la conversation, vous offrant ainsi des capacités d'IA directement liées à votre travail.</p>
<p>Le problème ? La mise en œuvre traditionnelle de RAG se présente comme suit</p>
<ul>
<li><p>Écrire des pipelines de génération d'intégration personnalisés</p></li>
<li><p>Configurer et déployer une base de données vectorielle</p></li>
<li><p>Concevoir des modèles d'invite complexes</p></li>
<li><p>Construire une logique de recherche et des seuils de similarité</p></li>
<li><p>Créer une interface utilisable</p></li>
</ul>
<p>Et si vous pouviez passer directement aux résultats ?</p>
<p>Dans ce tutoriel, nous allons créer une application RAG simple à l'aide de deux outils destinés aux développeurs :</p>
<ul>
<li><p><a href="https://github.com/langgenius/dify">Dify</a>: Une plateforme open-source qui gère l'orchestration RAG avec une configuration minimale.</p></li>
<li><p><a href="https://milvus.io/docs/overview.md">Milvus</a>: une base de données vectorielle open-source ultra-rapide conçue pour la recherche de similarités et les recherches d'intelligence artificielle.</p></li>
</ul>
<p>À la fin de ce guide de 10 minutes, vous disposerez d'un assistant IA opérationnel capable de répondre à des questions détaillées sur n'importe quelle collection de documents, sans avoir besoin d'un diplôme en apprentissage automatique.</p>
<h2 id="What-Youll-Build" class="common-anchor-header">Ce que vous allez construire<button data-href="#What-Youll-Build" class="anchor-icon" translate="no">
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
    </button></h2><p>En seulement quelques minutes de travail actif, vous créerez :</p>
<ul>
<li><p>Un pipeline de traitement de documents qui convertit n'importe quel PDF en connaissances interrogeables.</p></li>
<li><p>Un système de recherche vectorielle qui trouve exactement la bonne information</p></li>
<li><p>Une interface de chatbot qui répond aux questions techniques avec une grande précision.</p></li>
<li><p>Une solution déployable que vous pouvez intégrer à vos outils existants.</p></li>
</ul>
<p>Le plus beau ? La plupart des éléments sont configurés via une simple interface utilisateur (UI) au lieu d'un code personnalisé.</p>
<h2 id="What-Youll-Need" class="common-anchor-header">Ce dont vous aurez besoin<button data-href="#What-Youll-Need" class="anchor-icon" translate="no">
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
<li><p>Des connaissances de base sur Docker (juste le niveau <code translate="no">docker-compose up -d</code> )</p></li>
<li><p>Une clé API OpenAI</p></li>
<li><p>Un document PDF à expérimenter (nous utiliserons un document de recherche)</p></li>
</ul>
<p>Prêt à construire quelque chose d'utile en un temps record ? C'est parti !</p>
<h2 id="Building-Your-RAG-Application-with-Milvus-and-Dify" class="common-anchor-header">Construire votre application RAG avec Milvus et Dify<button data-href="#Building-Your-RAG-Application-with-Milvus-and-Dify" class="anchor-icon" translate="no">
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
    </button></h2><p>Dans cette section, nous allons créer une application RAG simple avec Dify, qui nous permettra de poser des questions sur les informations contenues dans un document de recherche. Pour le document de recherche, vous pouvez utiliser n'importe quel document ; cependant, dans ce cas, nous utiliserons le célèbre document qui nous a fait découvrir l'architecture Transformer, &quot;<a href="https://arxiv.org/abs/1706.03762">Attention is All You Need</a>&quot; (l<a href="https://arxiv.org/abs/1706.03762">'attention est tout ce dont vous avez besoin</a>).</p>
<p>Nous utiliserons Milvus comme stockage vectoriel, où nous stockerons tous les contextes nécessaires. Pour le modèle d'intégration et le LLM, nous utiliserons les modèles d'OpenAI. Par conséquent, nous devons d'abord configurer une clé API OpenAI. Vous pouvez en savoir plus sur la configuration<a href="https://platform.openai.com/docs/quickstart"> ici</a>.</p>
<h3 id="Step-1-Starting-Dify-and-Milvus-Containers" class="common-anchor-header">Étape 1 : Démarrer les conteneurs Dify et Milvus</h3><p>Dans cet exemple, nous allons auto-héberger Dify avec Docker Compose. Par conséquent, avant de commencer, assurez-vous que Docker est installé sur votre machine locale. Si ce n'est pas le cas, installez Docker en vous référant à<a href="https://docs.docker.com/desktop/"> sa page d'installation</a>.</p>
<p>Une fois Docker installé, nous devons cloner le code source de Dify sur notre machine locale avec la commande suivante :</p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> &lt;&lt;<span class="hljs-string">https://github.com/langgenius/dify.git&gt;&gt;
</span><button class="copy-code-btn"></button></code></pre>
<p>Ensuite, allez dans le répertoire <code translate="no">docker</code> à l'intérieur du code source que vous venez de cloner. Là, vous devez copier le fichier <code translate="no">.env</code> avec la commande suivante :</p>
<pre><code translate="no"><span class="hljs-built_in">cd</span> dify/docker
<span class="hljs-built_in">cp</span> .env.example .<span class="hljs-built_in">env</span>
<button class="copy-code-btn"></button></code></pre>
<p>En bref, le fichier <code translate="no">.env</code> contient les configurations nécessaires pour mettre en place votre application Dify, comme la sélection des bases de données vectorielles, les identifiants nécessaires pour accéder à votre base de données vectorielles, l'adresse de votre application Dify, etc.</p>
<p>Puisque nous allons utiliser Milvus comme base de données vectorielles, nous devons changer la valeur de la variable <code translate="no">VECTOR_STORE</code> dans le fichier <code translate="no">.env</code> en <code translate="no">milvus</code>. De même, nous devons changer la variable <code translate="no">MILVUS_URI</code> en <code translate="no">http://host.docker.internal:19530</code> pour nous assurer qu'il n'y a pas de problème de communication entre les conteneurs Docker plus tard après le déploiement.</p>
<pre><code translate="no"><span class="hljs-variable constant_">VECTOR_STORE</span>=milvus
<span class="hljs-variable constant_">MILVUS_URI</span>=<span class="hljs-attr">http</span>:<span class="hljs-comment">//host.docker.internal:19530</span>
<button class="copy-code-btn"></button></code></pre>
<p>Nous sommes maintenant prêts à démarrer les conteneurs Docker. Pour ce faire, il suffit d'exécuter la commande <code translate="no">docker compose up -d</code>. Une fois la commande terminée, vous verrez une sortie similaire dans votre terminal comme ci-dessous :</p>
<pre><code translate="no">docker compose up -d
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/docker_compose_179216f113.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Nous pouvons vérifier l'état de tous les conteneurs et voir s'ils sont opérationnels avec la commande <code translate="no">docker compose ps</code>. S'ils sont tous en bonne santé, vous verrez une sortie comme ci-dessous :</p>
<pre><code translate="no">docker compose ps
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/docker_compose_2_1a084ba137.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Enfin, si nous nous rendons sur<a href="http://localhost/install"> </a>http://localhost/install, vous verrez une page d'atterrissage Dify où nous pouvons nous inscrire et commencer à construire notre application RAG en un rien de temps.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_login_d2bf4d4468.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Une fois que vous vous êtes inscrit, il vous suffit de vous connecter à Dify avec vos informations d'identification.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/difi_login_2_5a8ea9c2d6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Setting-Up-OpenAI-API-Key" class="common-anchor-header">Étape 2 : Configuration de la clé API OpenAI</h3><p>La première chose à faire après s'être inscrit à Dify est de configurer nos clés API que nous utiliserons pour appeler le modèle d'intégration ainsi que le LLM. Puisque nous allons utiliser des modèles d'OpenAI, nous devons insérer notre clé API OpenAI dans notre profil. Pour ce faire, allez dans "Settings" en passant votre curseur sur votre profil en haut à droite de l'interface utilisateur, comme vous pouvez le voir dans la capture d'écran ci-dessous :</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_settings_8ff08fab97.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ensuite, allez dans "Model Provider", passez votre curseur sur OpenAI, puis cliquez sur "Setup". Vous verrez alors un écran pop-up qui vous demandera d'entrer votre clé API OpenAI. Une fois que nous avons terminé, nous sommes prêts à utiliser les modèles d'OpenAI comme modèle d'intégration et LLM.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_model_providers_491b313b12.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-Inserting-Documents-into-Knowledge-Base" class="common-anchor-header">Étape 3 : Insérer des documents dans la base de connaissances</h3><p>Maintenant, stockons la base de connaissances pour notre application RAG. La base de connaissances consiste en une collection de documents ou de textes internes qui peuvent être utilisés comme contextes pertinents pour aider le LLM à générer des réponses plus précises.</p>
<p>Dans notre cas d'utilisation, notre base de connaissances est essentiellement le document "L'attention est tout ce dont vous avez besoin". Cependant, nous ne pouvons pas stocker le document tel quel pour plusieurs raisons. Tout d'abord, l'article est trop long, et donner un contexte trop long au LLM ne serait pas utile car le contexte est trop large. Deuxièmement, nous ne pouvons pas effectuer de recherche de similarité pour obtenir le contexte le plus pertinent si notre entrée est un texte brut.</p>
<p>Par conséquent, il y a au moins deux étapes à franchir avant de stocker notre document dans la base de connaissances. Tout d'abord, nous devons diviser l'article en morceaux de texte, puis transformer chaque morceau en un encastrement via un modèle d'encastrement. Enfin, nous pouvons stocker ces embeddings dans Milvus en tant que base de données vectorielle.</p>
<p>Dify nous permet de diviser facilement les textes de l'article en morceaux et de les transformer en embeddings. Tout ce que nous avons à faire est de télécharger le fichier PDF de l'article, de définir la longueur des morceaux et de choisir le modèle d'intégration à l'aide d'un curseur. Pour réaliser toutes ces étapes, allez dans &quot;Connaissances&quot; et cliquez sur &quot;Créer des connaissances&quot;. Ensuite, vous serez invité à télécharger le fichier PDF à partir de votre ordinateur local. Il est donc préférable de télécharger l'article depuis ArXiv et de l'enregistrer sur votre ordinateur.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_knowledge_cc21a5c430.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Une fois le fichier téléchargé, nous pouvons définir la longueur des morceaux, la méthode d'indexation, le modèle d'intégration que nous voulons utiliser et les paramètres de récupération.</p>
<p>Dans la zone "Chunk Setting", vous pouvez choisir n'importe quel nombre comme longueur maximale du morceau (dans notre cas d'utilisation, nous le fixerons à 100). Ensuite, pour la "Méthode d'indexation", nous devons choisir l'option "Haute qualité" car elle nous permettra d'effectuer des recherches de similarité pour trouver des contextes pertinents. Pour "Embedding Model", vous pouvez choisir n'importe quel modèle d'intégration d'OpenAI, mais dans cet exemple, nous allons utiliser le modèle text-embedding-3-small. Enfin, pour "Retrieval Setting", nous devons choisir "Vector Search" car nous voulons effectuer des recherches de similarité pour trouver les contextes les plus pertinents.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Dify_save_837dbc0cf6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Si vous cliquez sur "Save &amp; Process" et que tout se passe bien, vous verrez apparaître une coche verte, comme le montre la capture d'écran suivante :</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_knowledge_created_d46b96385f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Creating-the-RAG-App" class="common-anchor-header">Étape 4 : Création de l'application RAG</h3><p>Jusqu'à présent, nous avons réussi à créer une base de connaissances et à la stocker dans notre base de données Milvus. Nous sommes maintenant prêts à créer l'application RAG.</p>
<p>La création de l'application RAG avec Dify est très simple. Nous devons aller dans "Studio" au lieu de "Knowledge" comme précédemment, puis cliquer sur "Create from Blank". Ensuite, choisissez "Chatbot" comme type d'application et donnez un nom à votre application dans le champ prévu à cet effet. Une fois que vous avez terminé, cliquez sur "Créer". La page suivante s'affiche :</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_create_f5691f193d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Dans le champ "Instruction", nous pouvons écrire une invite système telle que "Répondre à la requête de l'utilisateur de manière concise". Ensuite, dans le champ "Contexte", nous devons cliquer sur le symbole "Ajouter", puis ajouter la base de connaissances que nous venons de créer. De cette façon, notre application RAG ira chercher les contextes possibles dans cette base de connaissances pour répondre à la requête de l'utilisateur.</p>
<p>Maintenant que nous avons ajouté la base de connaissances à notre application RAG, la dernière chose à faire est de choisir le LLM d'OpenAI. Pour ce faire, vous pouvez cliquer sur la liste de modèles disponible dans le coin supérieur droit, comme vous pouvez le voir dans la capture d'écran ci-dessous :</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_llm_c3b79ded37.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Nous sommes maintenant prêts à publier notre application RAG ! Dans le coin supérieur droit, cliquez sur "Publier", et vous trouverez plusieurs façons de publier notre application RAG : nous pouvons simplement l'exécuter dans un navigateur, l'intégrer à notre site web, ou accéder à l'application via l'API. Dans cet exemple, nous allons simplement exécuter notre application dans un navigateur, nous pouvons donc cliquer sur &quot;Run App&quot;.</p>
<p>Et c'est tout ! Vous pouvez maintenant demander au LLM tout ce qui concerne le document "L'attention est tout ce dont vous avez besoin" ou tout autre document inclus dans notre base de connaissances.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/rag_attention_is_all_you_need_8582d3a69a.png" alt="" class="doc-image" id="" />
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
    </button></h2><p>Vous avez maintenant construit une application RAG fonctionnelle en utilisant Dify et Milvus, avec un minimum de code et de configuration. Cette approche rend l'architecture complexe de RAG accessible aux développeurs sans nécessiter d'expertise approfondie dans les bases de données vectorielles ou l'intégration LLM. Principaux enseignements :</p>
<ol>
<li><strong>Faible coût d'installation</strong>: L'utilisation de Docker Compose simplifie le déploiement</li>
<li><strong>Orchestration sans code/à faible code</strong>: Dify gère la majeure partie du pipeline RAG</li>
<li><strong>Base de données vectorielles prête pour la production</strong>: Milvus assure un stockage et une récupération efficaces des données embarquées.</li>
<li><strong>Architecture extensible</strong>: Il est facile d'ajouter des documents ou d'ajuster les paramètres :</li>
</ol>
<ul>
<li>la mise en place de l'authentification pour votre application</li>
<li>Configurer une mise à l'échelle appropriée pour Milvus (en particulier pour les grandes collections de documents)</li>
<li>Mettre en œuvre la surveillance de vos instances Dify et Milvus</li>
<li>L'association de Dify et de Milvus permet le développement rapide d'applications RAG qui peuvent exploiter efficacement les connaissances internes de votre organisation à l'aide de grands modèles de langage (LLM) modernes. Bonne construction !</li>
</ul>
<h2 id="Additional-Resources" class="common-anchor-header">Ressources supplémentaires<button data-href="#Additional-Resources" class="anchor-icon" translate="no">
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
<li><a href="https://docs.dify.ai/">Documentation Dify</a></li>
<li><a href="https://milvus.io/docs">Documentation Milvus</a></li>
<li><a href="https://zilliz.com/learn/vector-database">Principes de base de la base de données vectorielle</a></li>
<li><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Modèles de mise en œuvre RAG</a></li>
</ul>
