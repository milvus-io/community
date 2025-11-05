---
id: drag-drop-and-deploy-how-to-build-rag-workflows-with-langflow-and-milvus.md
title: >-
  Glisser, déposer et déployer : Comment créer des flux de travail RAG avec
  Langflow et Milvus
author: Min Yin
date: 2025-10-30T00:00:00.000Z
cover: assets.zilliz.com/langflow_milvus_cover_9f75a11f90.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Langflow, Milvus, RAG, AI workflow'
meta_title: 'Drag, Drop, and Deploy RAG Workflows with Langflow & Milvus'
desc: >-
  Apprenez à créer des flux de travail RAG visuels à l'aide de Langflow et
  Milvus. Glissez, déposez et déployez des applications d'IA contextuelles en
  quelques minutes, sans codage.
origin: >-
  https://milvus.io/blog/drag-drop-and-deploy-how-to-build-rag-workflows-with-langflow-and-milvus.md
---
<p>L'élaboration d'un flux de travail d'IA semble souvent plus difficile qu'elle ne devrait l'être. Entre l'écriture du code glue, le débogage des appels API et la gestion des pipelines de données, le processus peut prendre des heures avant même que vous ne voyiez des résultats. <a href="https://www.langflow.org/"><strong>Langflow</strong></a> et <a href="https://milvus.io/"><strong>Milvus</strong></a> simplifient considérablement ce processus en vous permettant de concevoir, de tester et de déployer des workflows de génération augmentée par récupération (RAG) en quelques minutes et non en quelques jours.</p>
<p><strong>Langflow</strong> offre une interface propre, basée sur le principe du glisser-déposer, qui ressemble plus à un croquis sur un tableau blanc qu'à du codage. Vous pouvez connecter visuellement des modèles linguistiques, des sources de données et des outils externes pour définir la logique de votre flux de travail, le tout sans toucher à une ligne de code standard.</p>
<p>Associés à <strong>Milvus</strong>, la base de données vectorielle open-source qui confère aux LLM une mémoire à long terme et une compréhension contextuelle, les deux éléments forment un environnement complet pour un RAG de niveau production. Milvus stocke et récupère efficacement les embeddings à partir de votre entreprise ou de données spécifiques à un domaine, ce qui permet aux LLM de générer des réponses fondées, précises et contextuelles.</p>
<p>Dans ce guide, nous allons voir comment combiner Langflow et Milvus pour construire un flux de travail RAG avancé, le tout en quelques glisser-déposer et clics.</p>
<h2 id="What-is-Langflow" class="common-anchor-header">Qu'est-ce que Langflow ?<button data-href="#What-is-Langflow" class="anchor-icon" translate="no">
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
    </button></h2><p>Avant de passer à la démo RAG, apprenons ce qu'est Langflow et ce qu'il peut faire.</p>
<p>Langflow est un framework open-source basé sur Python qui facilite la création et l'expérimentation d'applications d'IA. Il prend en charge des fonctionnalités clés de l'IA telles que les agents et le protocole MCP (Model Context Protocol), offrant ainsi aux développeurs et aux non-développeurs une base flexible pour la création de systèmes intelligents.</p>
<p>Langflow est un éditeur visuel. Vous pouvez glisser, déposer et connecter différentes ressources pour concevoir des applications complètes qui combinent des modèles, des outils et des sources de données. Lorsque vous exportez un workflow, Langflow génère automatiquement un fichier nommé <code translate="no">FLOW_NAME.json</code> sur votre machine locale. Ce fichier enregistre tous les nœuds, les arêtes et les métadonnées qui décrivent votre flux, ce qui vous permet de contrôler les versions, de partager et de reproduire facilement les projets au sein des équipes.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Langflow_s_visual_editor_cd553ad4ad.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>En coulisses, un moteur d'exécution basé sur Python exécute le flux. Il orchestre les LLM, les outils, les modules de récupération et la logique de routage - en gérant le flux de données, l'état et la gestion des erreurs pour assurer une exécution fluide du début à la fin.</p>
<p>Langflow comprend également une riche bibliothèque de composants avec des adaptateurs préconstruits pour les LLM et les bases de données vectorielles les plus répandus, y compris <a href="https://milvus.io/">Milvus</a>. Vous pouvez étendre cette bibliothèque en créant des composants Python personnalisés pour des cas d'utilisation spécifiques. Pour les tests et l'optimisation, Langflow offre une exécution étape par étape, un terrain de jeu pour des tests rapides, et des intégrations avec LangSmith et Langfuse pour la surveillance, le débogage et la relecture des flux de travail de bout en bout.</p>
<h2 id="Hands-on-Demo-How-to-Build-a-RAG-Workflow-with-Langflow-and-Milvus" class="common-anchor-header">Démonstration pratique : Comment construire un workflow RAG avec Langflow et Milvus<button data-href="#Hands-on-Demo-How-to-Build-a-RAG-Workflow-with-Langflow-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>En s'appuyant sur l'architecture de Langflow, Milvus peut servir de base de données vectorielle qui gère les embeddings et récupère les données privées de l'entreprise ou les connaissances spécifiques au domaine.</p>
<p>Dans cette démo, nous utiliserons le modèle RAG Vector Store de Langflow pour montrer comment intégrer Milvus et construire un index vectoriel à partir de données locales, permettant une réponse aux questions efficace et contextuelle.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_processing_flow_289a9376c9.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Prerequisites" class="common-anchor-header">Prérequis：</h3><p>1. Python 3.11 (ou Conda)</p>
<p>2.uv</p>
<p>3. Docker et Docker Compose</p>
<p>4.Clé OpenAI</p>
<h3 id="Step-1-Deploy-Milvus-Vector-Database" class="common-anchor-header">Étape 1. Déployer la base de données vectorielle Milvus</h3><p>Télécharger les fichiers de déploiement.</p>
<pre><code translate="no">wget &lt;https://github.com/Milvus-io/Milvus/releases/download/v2.5.12/Milvus-standalone-docker-compose.yml&gt; -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<p>Démarrer le service Milvus.</p>
<pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/start_milvus_service_860353ed55.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Create-a-Python-Virtual-Environment" class="common-anchor-header">Etape 2. Créer un environnement virtuel Python</h3><pre><code translate="no">conda create -n langflow
<span class="hljs-comment"># activate langflow and launch it</span>
conda activate langflow
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Install-the-Latest-Packages" class="common-anchor-header">Etape 3. Installer les derniers paquets</h3><pre><code translate="no">pip install langflow -U
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Launch-Langflow" class="common-anchor-header">Etape 4. Lancer Langflow</h3><pre><code translate="no">uv run langflow run
<button class="copy-code-btn"></button></code></pre>
<p>Visitez le site de Langflow.</p>
<pre><code translate="no">&lt;<span class="hljs-attr">http</span>:<span class="hljs-comment">//127.0.0.1:7860&gt;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-5-Configure-the-RAG-Template" class="common-anchor-header">Étape 5. Configurer le modèle RAG</h3><p>Sélectionnez le modèle RAG Vector Store dans Langflow.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/rag1_fcb0d1c3c5.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/rag2_f750e10a41.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Choisissez Milvus comme base de données vectorielle par défaut.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb_milvus_925c6ce846.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Dans le panneau de gauche, recherchez "Milvus" et ajoutez-le à votre flux.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/add_milvus1_862d14d0d0.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/add_milvus2_4e3d6aacda.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Configurez les détails de la connexion Milvus. Laissez les autres options par défaut pour l'instant.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/connect1_a27d3e4f43.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/connect2_d8421c1525.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ajoutez votre clé API OpenAI au nœud correspondant.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/openai_key_7a6596868c.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/openai_key2_4753bfb4d0.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-6-Prepare-Test-Data" class="common-anchor-header">Étape 6. Préparer les données de test</h3><p>Note : Utilisez la FAQ officielle pour Milvus 2.6 comme données de test.</p>
<pre><code translate="no">https://github.com/milvus-io/milvus-docs/blob/v2.6.x/site/en/faq/product_faq.md
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-7-Phase-One-Testing" class="common-anchor-header">Étape 7. Test de la phase 1</h3><p>Téléchargez votre jeu de données et ingérez-le dans Milvus. Remarque : Langflow convertit ensuite votre texte en représentations vectorielles. Vous devez télécharger au moins deux ensembles de données, sinon le processus d'intégration échouera. Il s'agit d'un bogue connu dans l'implémentation actuelle des nœuds de Langflow.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ingest_7b804d870a.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ingest2_fc7f1e4d9a.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Vérifiez l'état de vos nœuds.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test_48e02d48ca.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-8-Phase-Two-Testing" class="common-anchor-header">Étape 8. Test de la phase deux</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ingest_7b804d870a.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-9-Run-the-Full-RAG-Workflow" class="common-anchor-header">Étape 9. Exécuter le flux de travail RAG complet</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/full_flow1_5b4f4962f5.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/full_flow2_535c722a3d.webp" alt="" class="doc-image" id="" />
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
    </button></h2><p>Construire des workflows d'IA n'a pas besoin d'être compliqué. Langflow + Milvus le rend rapide, visuel et léger en code - un moyen simple d'améliorer RAG sans gros effort d'ingénierie.</p>
<p>L'interface drag-and-drop de Langflow en fait un choix approprié pour l'enseignement, les ateliers ou les démonstrations en direct, lorsque vous avez besoin de démontrer comment les systèmes d'IA fonctionnent d'une manière claire et interactive. Pour les équipes cherchant à intégrer la conception intuitive de flux de travail à la recherche vectorielle de niveau entreprise, la combinaison de la simplicité de Langflow avec la recherche haute performance de Milvus offre à la fois flexibilité et puissance.</p>
<p>👉 Commencez à créer des flux de travail RAG plus intelligents avec <a href="https://milvus.io/">Milvus</a> dès aujourd'hui.</p>
<p>Vous avez des questions ou souhaitez approfondir une fonctionnalité ? Rejoignez notre<a href="https://discord.com/invite/8uyFbECzPX"> canal Discord</a> ou déposez des problèmes sur<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Vous pouvez également réserver une session individuelle de 20 minutes pour obtenir des aperçus, des conseils et des réponses à vos questions par le biais des<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
