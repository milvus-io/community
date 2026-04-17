---
id: how-to-contribute-to-milvus-a-quick-start-for-developers.md
title: 'Comment contribuer à Milvus : une introduction rapide pour les développeurs'
author: Shaoting Huang
date: 2024-12-01T00:00:00.000Z
cover: assets.zilliz.com/How_to_Contribute_to_Milvus_91e1432163.png
tag: Engineering
tags: >-
  Milvus, contribute to open-source projects, vector databases, Contribute to
  Milvus
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/how-to-contribute-to-milvus-a-quick-start-for-developers.md
---
<p><a href="https://github.com/milvus-io/milvus"><strong>Milvus</strong></a> est une <a href="https://zilliz.com/learn/what-is-vector-database">base de données vectorielles</a> open-source conçue pour gérer des données vectorielles de haute dimension. Que vous construisiez des moteurs de recherche intelligents, des systèmes de recommandation ou des solutions d'IA de nouvelle génération telles que la génération augmentée de recherche<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">(RAG)</a>, Milvus est un outil puissant à portée de main.</p>
<p>Mais ce qui fait vraiment avancer Milvus, ce n'est pas seulement sa technologie avancée, c'est la <a href="https://zilliz.com/community">communauté de développeurs</a> dynamique et passionnée qui la soutient. En tant que projet open-source, Milvus prospère et évolue grâce aux contributions de développeurs tels que vous. Chaque correction de bogue, ajout de fonctionnalité et amélioration des performances provenant de la communauté rend Milvus plus rapide, plus évolutif et plus fiable.</p>
<p>Que vous soyez passionné par les logiciels libres, désireux d'apprendre ou que vous souhaitiez avoir un impact durable sur l'IA, Milvus est l'endroit idéal pour apporter votre contribution. Ce guide vous guidera tout au long du processus, de la configuration de votre environnement de développement à la soumission de votre première demande d'extraction. Nous mettrons également l'accent sur les défis courants auxquels vous pourriez être confronté et fournirons des solutions pour les surmonter.</p>
<p>Prêt à vous lancer ? Ensemble, améliorons Milvus !</p>
<h2 id="Setting-Up-Your-Milvus-Development-Environment" class="common-anchor-header">Configuration de votre environnement de développement Milvus<button data-href="#Setting-Up-Your-Milvus-Development-Environment" class="anchor-icon" translate="no">
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
    </button></h2><p>La première chose à faire est de configurer votre environnement de développement. Vous pouvez installer Milvus sur votre machine locale ou utiliser Docker. Les deux méthodes sont simples, mais vous devrez également installer quelques dépendances tierces pour que tout fonctionne.</p>
<h3 id="Building-Milvus-Locally" class="common-anchor-header">Construire Milvus localement</h3><p>Si vous aimez construire des choses à partir de zéro, construire Milvus sur votre machine locale est un jeu d'enfant. Milvus facilite les choses en regroupant toutes les dépendances dans le script <code translate="no">install_deps.sh</code>. Voici l'installation rapide :</p>
<pre><code translate="no"><span class="hljs-comment"># Install third-party dependencies.</span>
$ <span class="hljs-built_in">cd</span> milvus/
$ ./scripts/install_deps.sh

<span class="hljs-comment"># Compile Milvus.</span>
$ make
<button class="copy-code-btn"></button></code></pre>
<h3 id="Building-Milvus-with-Docker" class="common-anchor-header">Construire Milvus avec Docker</h3><p>Si vous préférez Docker, il y a deux façons de procéder : vous pouvez soit exécuter des commandes dans un conteneur préconstruit, soit créer un conteneur de développement pour une approche plus pratique.</p>
<pre><code translate="no"><span class="hljs-comment"># Option 1: Run commands in a pre-built Docker container  </span>
build/builder.sh make  

<span class="hljs-comment"># Option 2: Spin up a dev container  </span>
./scripts/devcontainer.sh up  
docker-compose -f docker-compose-devcontainer.yml ps  
docker <span class="hljs-built_in">exec</span> -ti milvus-builder-<span class="hljs-number">1</span> bash  
make milvus  
<button class="copy-code-btn"></button></code></pre>
<p><strong>Notes sur la plateforme :</strong> Si vous êtes sous Linux, vous pouvez y aller - les problèmes de compilation sont plutôt rares. Cependant, les utilisateurs de Mac, en particulier avec les puces M1, peuvent rencontrer quelques problèmes en cours de route. Nous avons un guide pour vous aider à résoudre les problèmes les plus courants.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_OS_configuration_52092fb1b7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure : Configuration du système d'exploitation</em></p>
<p>Pour obtenir le guide d'installation complet, consultez le <a href="https://github.com/milvus-io/milvus/blob/master/DEVELOPMENT.md">Guide de développement Milvus</a> officiel.</p>
<h3 id="Common-Issues-and-How-to-Fix-Them" class="common-anchor-header">Problèmes courants et comment les résoudre</h3><p>Parfois, la configuration de votre environnement de développement Milvus ne se déroule pas aussi bien que prévu. Ne vous inquiétez pas, voici un aperçu des problèmes courants que vous pouvez rencontrer et comment les résoudre rapidement.</p>
<h4 id="Homebrew-Unexpected-Disconnect-While-Reading-Sideband-Packet" class="common-anchor-header">Homebrew : Déconnexion inattendue lors de la lecture d'un paquet Sideband</h4><p>Si vous utilisez Homebrew et que vous voyez une erreur comme celle-ci :</p>
<pre><code translate="no">==&gt; Tapping homebrew/core
remote: Enumerating objects: 1107077, <span class="hljs-keyword">done</span>.
remote: Counting objects: 100% (228/228), <span class="hljs-keyword">done</span>.
remote: Compressing objects: 100% (157/157), <span class="hljs-keyword">done</span>.
error: 545 bytes of body are still expected.44 MiB | 341.00 KiB/s
fetch-pack: unexpected disconnect <span class="hljs-keyword">while</span> reading sideband packet
fatal: early EOF
fatal: index-pack failed
Failed during: git fetch --force origin refs/heads/master:refs/remotes/origin/master
myuser~ %
<button class="copy-code-btn"></button></code></pre>
<p><strong>Correction :</strong> Augmentez la taille de <code translate="no">http.postBuffer</code>:</p>
<pre><code translate="no">git config --<span class="hljs-variable language_">global</span> http.<span class="hljs-property">postBuffer</span> 1M
<button class="copy-code-btn"></button></code></pre>
<p>Si vous rencontrez également <code translate="no">Brew: command not found</code> après avoir installé Homebrew, il se peut que vous deviez configurer votre utilisateur Git :</p>
<pre><code translate="no">git config --<span class="hljs-variable language_">global</span> user.<span class="hljs-property">email</span> xxxgit config --<span class="hljs-variable language_">global</span> user.<span class="hljs-property">name</span> xxx
<button class="copy-code-btn"></button></code></pre>
<h4 id="Docker-Error-Getting-Credentials" class="common-anchor-header">Docker : Erreur lors de l'obtention des informations d'identification</h4><p>Lorsque vous travaillez avec Docker, vous pouvez voir ceci :</p>
<pre><code translate="no"><span class="hljs-type">error</span> getting credentials - err: exit status <span class="hljs-number">1</span>, out: <span class="hljs-string">``</span>  
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Docker_Error_Getting_Credentials_797f3043fb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Correction :</strong> Ouvrez<code translate="no">~/.docker/config.json</code> et supprimez le champ <code translate="no">credsStore</code>.</p>
<h4 id="Python-No-Module-Named-imp" class="common-anchor-header">Python : No Module Named 'imp'</h4><p>Si Python envoie cette erreur, c'est parce que Python 3.12 a supprimé le module <code translate="no">imp</code>, que certaines anciennes dépendances utilisent encore.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Python_No_Module_Named_imp_65eb2c5c66.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Corrigez cette erreur :</strong> Rétrogradez vers Python 3.11 :</p>
<pre><code translate="no">brew install python@3.11  
<button class="copy-code-btn"></button></code></pre>
<h4 id="Conan-Unrecognized-Arguments-or-Command-Not-Found" class="common-anchor-header">Conan : Arguments non reconnus ou commande introuvable</h4><p><strong>Problème :</strong> Si vous voyez <code translate="no">Unrecognized arguments: --install-folder conan</code>, vous utilisez probablement une version incompatible de Conan.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conan_Unrecognized_Arguments_or_Command_Not_Found_8f2029db72.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Correction :</strong> Passez à Conan 1.61 :</p>
<pre><code translate="no">pip install conan==1.61  
<button class="copy-code-btn"></button></code></pre>
<p><strong>Problème :</strong> Si vous voyez <code translate="no">Conan command not found</code>, cela signifie que votre environnement Python n'est pas correctement configuré.</p>
<p><strong>Correction :</strong> Ajoutez le répertoire bin de Python à votre <code translate="no">PATH</code>:</p>
<pre><code translate="no"><span class="hljs-built_in">export</span> PATH=<span class="hljs-string">&quot;/path/to/python/bin:<span class="hljs-variable">$PATH</span>&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="LLVM-Use-of-Undeclared-Identifier-kSecFormatOpenSSL" class="common-anchor-header">LLVM : Utilisation d'un identifiant non déclaré 'kSecFormatOpenSSL'</h4><p>Cette erreur signifie généralement que vos dépendances LLVM sont obsolètes.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/LLVM_Use_of_Undeclared_Identifier_k_Sec_Format_Open_SSL_f0ca6f0166.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Corrigez l'erreur :</strong> Réinstallez LLVM 15 et mettez à jour vos variables d'environnement :</p>
<pre><code translate="no">brew reinstall llvm@<span class="hljs-number">15</span>
<span class="hljs-keyword">export</span> <span class="hljs-variable constant_">LDFLAGS</span>=<span class="hljs-string">&quot;-L/opt/homebrew/opt/llvm@15/lib&quot;</span>
<span class="hljs-keyword">export</span> <span class="hljs-variable constant_">CPPFLAGS</span>=<span class="hljs-string">&quot;-I/opt/homebrew/opt/llvm@15/include&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Conseils de pro</strong></p>
<ul>
<li><p>Vérifiez toujours les versions et les dépendances de vos outils.</p></li>
<li><p>Si quelque chose ne fonctionne toujours pas, la<a href="https://github.com/milvus-io/milvus/issues"> page Milvus GitHub Issues</a> est un endroit idéal pour trouver des réponses ou demander de l'aide.</p></li>
</ul>
<h3 id="Configuring-VS-Code-for-C++-and-Go-Integration" class="common-anchor-header">Configuration de VS Code pour l'intégration de C++ et Go</h3><p>Faire fonctionner ensemble C++ et Go dans VS Code est plus facile qu'il n'y paraît. Avec la bonne configuration, vous pouvez rationaliser votre processus de développement pour Milvus. Il suffit de modifier votre fichier <code translate="no">user.settings</code> avec la configuration ci-dessous :</p>
<pre><code translate="no">{
   <span class="hljs-string">&quot;go.toolsEnvVars&quot;</span>: {
       <span class="hljs-string">&quot;PKG_CONFIG_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/milvus/internal/core/output/lib/pkgconfig:/Users/zilliz/workspace/milvus/internal/core/output/lib64/pkgconfig&quot;</span>,
       <span class="hljs-string">&quot;LD_LIBRARY_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>,
       <span class="hljs-string">&quot;RPATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>
   },
   <span class="hljs-string">&quot;go.testEnvVars&quot;</span>: {
       <span class="hljs-string">&quot;PKG_CONFIG_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib/pkgconfig:/Users/zilliz/workspace/milvus/internal/core/output/lib64/pkgconfig&quot;</span>,
       <span class="hljs-string">&quot;LD_LIBRARY_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>,
       <span class="hljs-string">&quot;RPATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>
   },
   <span class="hljs-string">&quot;go.buildFlags&quot;</span>: [
       <span class="hljs-string">&quot;-ldflags=-r /Users/zilliz/workspace/milvus/internal/core/output/lib&quot;</span>
   ],
   <span class="hljs-string">&quot;terminal.integrated.env.linux&quot;</span>: {
       <span class="hljs-string">&quot;PKG_CONFIG_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib/pkgconfig:/Users/zilliz/workspace/milvus/internal/core/output/lib64/pkgconfig&quot;</span>,
       <span class="hljs-string">&quot;LD_LIBRARY_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>,
       <span class="hljs-string">&quot;RPATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>
   },
   <span class="hljs-string">&quot;go.useLanguageServer&quot;</span>: <span class="hljs-literal">true</span>,
   <span class="hljs-string">&quot;gopls&quot;</span>: {
       <span class="hljs-string">&quot;formatting.gofumpt&quot;</span>: <span class="hljs-literal">true</span>
   },
   <span class="hljs-string">&quot;go.formatTool&quot;</span>: <span class="hljs-string">&quot;gofumpt&quot;</span>,
   <span class="hljs-string">&quot;go.lintTool&quot;</span>: <span class="hljs-string">&quot;golangci-lint&quot;</span>,
   <span class="hljs-string">&quot;go.testTags&quot;</span>: <span class="hljs-string">&quot;dynamic&quot;</span>,
   <span class="hljs-string">&quot;go.testTimeout&quot;</span>: <span class="hljs-string">&quot;10m&quot;</span>
}
<button class="copy-code-btn"></button></code></pre>
<p>Voici ce que fait cette configuration :</p>
<ul>
<li><p><strong>Variables d'environnement :</strong> Définit les chemins d'accès pour <code translate="no">PKG_CONFIG_PATH</code>, <code translate="no">LD_LIBRARY_PATH</code>, et <code translate="no">RPATH</code>, qui sont essentiels pour localiser les bibliothèques pendant les constructions et les tests.</p></li>
<li><p><strong>Intégration des outils Go :</strong> Active le serveur de langue de Go (<code translate="no">gopls</code>) et configure des outils tels que <code translate="no">gofumpt</code> pour le formatage et <code translate="no">golangci-lint</code> pour le linting.</p></li>
<li><p><strong>Configuration des tests :</strong> Ajoute <code translate="no">testTags</code> et augmente le délai d'exécution des tests à 10 minutes.</p></li>
</ul>
<p>Une fois ajoutée, cette configuration assure une intégration transparente entre les flux de travail C++ et Go. Elle est parfaite pour construire et tester Milvus sans avoir à modifier constamment l'environnement.</p>
<p><strong>Conseil de pro</strong></p>
<p>Après avoir mis en place cette configuration, exécutez un test de construction rapide pour confirmer que tout fonctionne. Si quelque chose ne semble pas fonctionner, vérifiez les chemins et la version de l'extension Go de VS Code.</p>
<h2 id="Deploying-Milvus" class="common-anchor-header">Déploiement de Milvus<button data-href="#Deploying-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus prend en charge <a href="https://milvus.io/docs/install-overview.md">trois modes de déploiement : Lite</a><strong>, Standalone</strong> et <strong>Distributed.</strong></p>
<ul>
<li><p><a href="https://milvus.io/blog/introducing-milvus-lite.md"><strong>Milvus Lite</strong></a> est une bibliothèque Python et une version ultra-légère de Milvus. Il est parfait pour le prototypage rapide dans des environnements Python ou des ordinateurs portables et pour des expériences locales à petite échelle.</p></li>
<li><p><strong>Milvus Standalone</strong> est l'option de déploiement à nœud unique de Milvus, qui utilise un modèle client-serveur. C'est l'équivalent de MySQL pour Milvus, tandis que Milvus Lite ressemble à SQLite.</p></li>
<li><p><strong>Milvus Distributed</strong> est le mode distribué de Milvus, idéal pour les entreprises qui construisent des systèmes de bases de données vectorielles à grande échelle ou des plates-formes de données vectorielles.</p></li>
</ul>
<p>Tous ces déploiements reposent sur trois composants de base :</p>
<ul>
<li><p><strong>Milvus :</strong> le moteur de base de données vectorielles qui pilote toutes les opérations.</p></li>
<li><p><strong>Etcd :</strong> Le moteur de métadonnées qui gère les métadonnées internes de Milvus.</p></li>
<li><p><strong>MinIO :</strong> le moteur de stockage qui assure la persistance des données.</p></li>
</ul>
<p>Lorsqu'il est exécuté en mode <strong>distribué</strong>, Milvus intègre également <strong>Pulsar</strong> pour le traitement des messages distribués à l'aide d'un mécanisme Pub/Sub, ce qui le rend évolutif pour les environnements à haut débit.</p>
<h3 id="Milvus-Standalone" class="common-anchor-header">Milvus autonome</h3><p>Le mode autonome est conçu pour les configurations à instance unique, ce qui le rend parfait pour les tests et les applications à petite échelle. Voici comment commencer :</p>
<pre><code translate="no"><span class="hljs-comment"># Deploy Milvus Standalone  </span>
<span class="hljs-built_in">sudo</span> docker-compose -f deployments/docker/dev/docker-compose.yml up -d
<span class="hljs-comment"># Start the standalone service  </span>
bash ./scripts/start_standalone.sh
<button class="copy-code-btn"></button></code></pre>
<h3 id="Milvus-Distributed-previously-known-as-Milvus-Cluster" class="common-anchor-header">Milvus Distribué (précédemment connu sous le nom de Milvus Cluster)</h3><p>Pour les ensembles de données plus importants et un trafic plus élevé, le mode Distribué offre une évolutivité horizontale. Il combine plusieurs instances Milvus en un seul système cohésif. Le déploiement est facilité par l'<strong>opérateur Milvus</strong>, qui s'exécute sur Kubernetes et gère l'ensemble de la pile Milvus pour vous.</p>
<p>Vous souhaitez obtenir des conseils étape par étape ? Consultez le <a href="https://milvus.io/docs/install_cluster-milvusoperator.md">Guide d'installation de Milvus</a>.</p>
<h2 id="Running-End-to-End-E2E-Tests" class="common-anchor-header">Exécution de tests de bout en bout (E2E)<button data-href="#Running-End-to-End-E2E-Tests" class="anchor-icon" translate="no">
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
    </button></h2><p>Une fois que votre déploiement Milvus est opérationnel, tester sa fonctionnalité est un jeu d'enfant grâce aux tests E2E. Ces tests couvrent chaque partie de votre installation pour s'assurer que tout fonctionne comme prévu. Voici comment les exécuter :</p>
<pre><code translate="no"><span class="hljs-comment"># Navigate to the test directory  </span>
<span class="hljs-built_in">cd</span> tests/python_client  

<span class="hljs-comment"># Install dependencies  </span>
pip install -r requirements.txt  

<span class="hljs-comment"># Run E2E tests  </span>
pytest --tags=L0 -n auto  
<button class="copy-code-btn"></button></code></pre>
<p>Pour des instructions détaillées et des conseils de dépannage, reportez-vous au <a href="https://github.com/milvus-io/milvus/blob/master/DEVELOPMENT.md#e2e-tests">Guide de développement Milvus</a>.</p>
<p><strong>Conseil de pro</strong></p>
<p>Si vous ne connaissez pas Milvus, commencez par Milvus Lite ou le mode autonome pour vous familiariser avec ses capacités avant de passer au mode distribué pour les charges de travail de niveau production.</p>
<h2 id="Submitting-Your-Code" class="common-anchor-header">Soumettre votre code<button data-href="#Submitting-Your-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>Félicitations ! Vous avez passé tous les tests unitaires et E2E (ou débogué et recompilé si nécessaire). Si la première compilation peut prendre un certain temps, les suivantes seront beaucoup plus rapides, il n'y a donc pas lieu de s'inquiéter. Une fois que tout a été validé, vous êtes prêt à soumettre vos modifications et à contribuer à Milvus !</p>
<h3 id="Link-Your-Pull-Request-PR-to-an-Issue" class="common-anchor-header">Lier votre demande de retrait (PR) à un problème</h3><p>Chaque PR pour Milvus doit être lié à un problème pertinent. Voici comment procéder :</p>
<ul>
<li><p><strong>Vérifier les problèmes existants :</strong> Consultez l'<a href="https://github.com/milvus-io/milvus/issues"> issue tracker de Milvus</a> pour voir s'il existe déjà un problème lié à vos modifications.</p></li>
<li><p><strong>Créer un nouveau problème :</strong> S'il n'existe pas de problème pertinent, ouvrez-en un nouveau et expliquez le problème que vous résolvez ou la fonctionnalité que vous ajoutez.</p></li>
</ul>
<h3 id="Submitting-Your-Code" class="common-anchor-header">Soumettre votre code</h3><ol>
<li><p><strong>Forger le référentiel :</strong> Commencez par forker le<a href="https://github.com/milvus-io/milvus"> repo Milvus</a> sur votre compte GitHub.</p></li>
<li><p><strong>Créez une branche :</strong> Clonez votre fork localement et créez une nouvelle branche pour vos modifications.</p></li>
<li><p><strong>Commiter avec la signature Signed-off-by :</strong> Veillez à ce que vos modifications comprennent une signature <code translate="no">Signed-off-by</code> afin de respecter la licence open-source :</p></li>
</ol>
<pre><code translate="no">git commit -m <span class="hljs-string">&quot;Commit of your change&quot;</span> -s
<button class="copy-code-btn"></button></code></pre>
<p>Cette étape certifie que votre contribution est conforme au certificat d'origine du développeur (DCO).</p>
<h4 id="Helpful-Resources" class="common-anchor-header"><strong>Ressources utiles</strong></h4><p>Pour connaître les étapes détaillées et les meilleures pratiques, consultez le<a href="https://github.com/milvus-io/milvus/blob/master/CONTRIBUTING.md"> Guide de contribution Milvus</a>.</p>
<h2 id="Opportunities-to-Contribute" class="common-anchor-header">Possibilités de contribution<button data-href="#Opportunities-to-Contribute" class="anchor-icon" translate="no">
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
    </button></h2><p>Félicitations : Milvus est désormais opérationnel ! Vous avez exploré ses modes de déploiement, exécuté vos tests et peut-être même creusé dans le code. Il est maintenant temps de passer à la vitesse supérieure : contribuez à <a href="https://github.com/milvus-io/milvus">Milvus</a> et aidez à façonner l'avenir de l'IA et des <a href="https://zilliz.com/learn/introduction-to-unstructured-data">données non structurées</a>.</p>
<p>Quelles que soient vos compétences, il y a une place pour vous dans la communauté Milvus ! Que vous soyez un développeur qui aime résoudre des défis complexes, un rédacteur technique qui aime écrire une documentation propre ou des blogs d'ingénierie, ou un passionné de Kubernetes qui cherche à améliorer les déploiements, il y a un moyen pour vous d'avoir un impact.</p>
<p>Jetez un coup d'œil aux opportunités ci-dessous et trouvez votre bonheur. Chaque contribution permet à Milvus d'aller de l'avant, et qui sait ? Votre prochaine demande d'extraction pourrait bien être à l'origine de la prochaine vague d'innovation. Alors, qu'attendez-vous ? Commençons ! 🚀</p>
<table>
<thead>
<tr><th>Projets</th><th>Adapté à</th><th>Lignes directrices</th></tr>
</thead>
<tbody>
<tr><td><a href="https://github.com/milvus-io/milvus">milvus</a>, <a href="https://github.com/milvus-io/milvus-sdk-go">milvus-sdk-go</a></td><td>Développeurs Go</td><td>/</td></tr>
<tr><td><a href="https://github.com/milvus-io/milvus">milvus</a>, <a href="https://github.com/milvus-io/knowhere">knowhere</a></td><td>Développeurs CPP</td><td>/</td></tr>
<tr><td><a href="https://github.com/milvus-io/pymilvus">pymilvus</a>, <a href="https://github.com/milvus-io/milvus-sdk-node">milvus-sdk-node</a>, <a href="https://github.com/milvus-io/milvus-sdk-java">milvus-sdk-java</a></td><td>Développeurs intéressés par d'autres langages</td><td><a href="https://github.com/milvus-io/pymilvus/blob/master/CONTRIBUTING.md">Contribuer à PyMilvus</a></td></tr>
<tr><td><a href="https://github.com/milvus-io/milvus-helm">milvus-helm</a></td><td>Passionnés de Kubernetes</td><td>/</td></tr>
<tr><td><a href="https://github.com/milvus-io/milvus-docs">Milvus-docs</a>, <a href="https://github.com/milvus-io/community">milvus-io/community/blog</a></td><td>Rédacteurs techniques</td><td><a href="https://github.com/milvus-io/milvus-docs/blob/v2.0.0/CONTRIBUTING.md">Contribuer à la documentation de milvus</a></td></tr>
<tr><td><a href="https://github.com/zilliztech/milvus-insight">milvus-insight</a></td><td>Développeurs web</td><td>/</td></tr>
</tbody>
</table>
<h2 id="A-Final-Word" class="common-anchor-header">Un dernier mot<button data-href="#A-Final-Word" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus propose différents <a href="https://milvus.io/docs/install-pymilvus.md">SDK</a> - Python (PyMilvus), <a href="https://milvus.io/docs/install-java.md">Java</a>, <a href="https://milvus.io/docs/install-go.md">Go</a> et <a href="https://milvus.io/docs/install-node.md">Node.js - qui</a>permettent de commencer à construire en toute simplicité. Contribuer à Milvus n'est pas seulement une question de code, c'est aussi rejoindre une communauté dynamique et innovante.</p>
<p>Bienvenue dans la communauté des développeurs Milvus et bon codage ! Nous sommes impatients de voir ce que vous allez créer.</p>
<h2 id="Further-Reading" class="common-anchor-header">Pour en savoir plus<button data-href="#Further-Reading" class="anchor-icon" translate="no">
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
<li><p><a href="https://zilliz.com/community">Rejoindre la communauté des développeurs d'IA de Milvus</a></p></li>
<li><p><a href="https://zilliz.com/learn/what-is-vector-database">Que sont les bases de données vectorielles et comment fonctionnent-elles ?</a></p></li>
<li><p><a href="https://zilliz.com/blog/choose-the-right-milvus-deployment-mode-ai-applications">Milvus Lite vs. Standalone vs. Distributed : Quel mode vous convient le mieux ? </a></p></li>
<li><p><a href="https://zilliz.com/learn/milvus-notebooks">Créer des applications d'IA avec Milvus : Tutoriels et carnets de notes</a></p></li>
<li><p><a href="https://zilliz.com/ai-models">Modèles d'IA les plus performants pour vos applications GenAI | Zilliz</a></p></li>
<li><p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Qu'est-ce que RAG ?</a></p></li>
<li><p><a href="https://zilliz.com/learn/generative-ai">Centre de ressources pour l'IA générative | Zilliz</a></p></li>
</ul>
