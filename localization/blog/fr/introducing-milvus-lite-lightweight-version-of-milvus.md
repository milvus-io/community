---
id: introducing-milvus-lite-lightweight-version-of-milvus.md
title: 'Présentation de Milvus Lite : la version allégée de Milvus'
author: Fendy Feng
date: 2023-05-23T00:00:00.000Z
desc: >-
  Découvrez la vitesse et l'efficacité de Milvus Lite, la variante légère de la
  célèbre base de données vectorielles Milvus pour une recherche de similarités
  ultra-rapide.
cover: assets.zilliz.com/introducing_Milvus_Lite_7c0d0a1174.jpeg
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/introducing-milvus-lite-lightweight-version-of-milvus.md
---
<p><strong><em>Note importante</em></strong></p>
<p><em>Nous avons mis à niveau Milvus Lite en juin 2024, ce qui permet aux développeurs d'IA de créer des applications plus rapidement tout en garantissant une expérience cohérente dans diverses options de déploiement, notamment Milvus on Kurbernetes, Docker et les services de cloud gérés. Milvus Lite s'intègre également à divers frameworks et technologies d'IA, rationalisant le développement d'applications d'IA avec des capacités de recherche vectorielle. Pour plus d'informations, voir les références suivantes :</em></p>
<ul>
<li><p><em>Blog de lancement de Milvus Lite : h<a href="https://milvus.io/blog/introducing-milvus-lite.md">ttps://</a>milvus.io/blog/introducing-milvus-lite.md</em></p></li>
<li><p><em>Documentation Milvus Lite <a href="https://milvus.io/docs/quickstart.md">: https://milvus.io/docs/quickstart.md</a></em></p></li>
<li><p><em>Dépôt GitHub Milvus Lite <a href="https://github.com/milvus-io/milvus-lite">: https://github.com/milvus-io/milvus-lite</a></em></p></li>
</ul>
<p><br></p>
<p><a href="https://github.com/milvus-io/milvus">Milvus</a> est une base de données vectorielle open-source conçue pour indexer, stocker et interroger les vecteurs d'intégration générés par des réseaux neuronaux profonds et d'autres modèles d'apprentissage automatique à des milliards d'échelles. Elle est devenue un choix populaire pour de nombreuses entreprises, chercheurs et développeurs qui doivent effectuer des recherches de similarité sur des ensembles de données à grande échelle.</p>
<p>Cependant, certains utilisateurs peuvent trouver la version complète de Milvus trop lourde ou trop complexe. Pour résoudre ce problème, <a href="https://github.com/matrixji">Bin Ji</a>, l'un des contributeurs les plus actifs de la communauté Milvus, a créé <a href="https://github.com/milvus-io/milvus-lite">Milvus Lite</a>, une version allégée de Milvus.</p>
<h2 id="What-is-Milvus-Lite" class="common-anchor-header">Qu'est-ce que Milvus Lite ?<button data-href="#What-is-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>Comme indiqué précédemment, <a href="https://github.com/milvus-io/milvus-lite">Milvus Lite</a> est une alternative simplifiée à Milvus qui offre de nombreux avantages et bénéfices.</p>
<ul>
<li>Vous pouvez l'intégrer dans votre application Python sans ajouter de poids supplémentaire.</li>
<li>Il est autonome et ne nécessite pas d'autres dépendances, grâce à la capacité de Milvus autonome à travailler avec des Etcd intégrés et un stockage local.</li>
<li>Vous pouvez l'importer en tant que bibliothèque Python et l'utiliser comme un serveur autonome basé sur une interface de ligne de commande (CLI).</li>
<li>Il fonctionne sans problème avec Google Colab et Jupyter Notebook.</li>
<li>Vous pouvez migrer votre travail et écrire du code en toute sécurité vers d'autres instances Milvus (versions autonomes, en grappe et entièrement gérées) sans risque de perte de données.</li>
</ul>
<h2 id="When-should-you-use-Milvus-Lite" class="common-anchor-header">Quand utiliser Milvus Lite ?<button data-href="#When-should-you-use-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>Plus précisément, Milvus Lite est particulièrement utile dans les situations suivantes :</p>
<ul>
<li>Lorsque vous préférez utiliser Milvus sans les techniques et outils de conteneurs tels que <a href="https://milvus.io/docs/install_standalone-operator.md">Milvus Operator</a>, <a href="https://milvus.io/docs/install_standalone-helm.md">Helm</a> ou <a href="https://milvus.io/docs/install_standalone-docker.md">Docker Compose</a>.</li>
<li>Lorsque vous n'avez pas besoin de machines virtuelles ou de conteneurs pour utiliser Milvus.</li>
<li>Lorsque vous souhaitez incorporer les fonctionnalités de Milvus dans vos applications Python.</li>
<li>Lorsque vous souhaitez démarrer une instance Milvus dans Colab ou Notebook pour une expérience rapide.</li>
</ul>
<p><strong>Remarque</strong>: nous ne recommandons pas l'utilisation de Milvus Lite dans un environnement de production ou si vous avez besoin de hautes performances, d'une forte disponibilité ou d'une grande évolutivité. Envisagez plutôt d'utiliser les <a href="https://github.com/milvus-io/milvus">clusters Milvus</a> ou <a href="https://zilliz.com/cloud">Milvus entièrement géré sur Zilliz Cloud</a> pour la production.</p>
<h2 id="How-to-get-started-with-Milvus-Lite" class="common-anchor-header">Comment démarrer avec Milvus Lite ?<button data-href="#How-to-get-started-with-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>Voyons maintenant comment installer, configurer et utiliser Milvus Lite.</p>
<h3 id="Prerequisites" class="common-anchor-header">Conditions préalables</h3><p>Pour utiliser Milvus Lite, assurez-vous d'avoir rempli les conditions suivantes :</p>
<ul>
<li>Installation de Python 3.7 ou d'une version ultérieure.</li>
<li>Utilisation de l'un des systèmes d'exploitation vérifiés répertoriés ci-dessous :<ul>
<li>Ubuntu &gt;= 18.04 (x86_64)</li>
<li>CentOS &gt;= 7.0 (x86_64)</li>
<li>MacOS &gt;= 11.0 (Apple Silicon)</li>
</ul></li>
</ul>
<p><strong>Notes</strong>:</p>
<ol>
<li>Milvus Lite utilise <code translate="no">manylinux2014</code> comme image de base, ce qui la rend compatible avec la plupart des distributions Linux pour les utilisateurs de Linux.</li>
<li>L'exécution de Milvus Lite sous Windows est également possible, bien que cela n'ait pas encore été entièrement vérifié.</li>
</ol>
<h3 id="Install-Milvus-Lite" class="common-anchor-header">Installer Milvus Lite</h3><p>Milvus Lite est disponible sur PyPI, vous pouvez donc l'installer via <code translate="no">pip</code>.</p>
<pre><code translate="no">$ python3 -m pip install milvus
<button class="copy-code-btn"></button></code></pre>
<p>Vous pouvez également l'installer avec PyMilvus comme suit :</p>
<pre><code translate="no">$ python3 -m pip install milvus[client]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Use-and-start-Milvus-Lite" class="common-anchor-header">Utiliser et démarrer Milvus Lite</h3><p>Téléchargez le <a href="https://github.com/milvus-io/milvus-lite/tree/main/examples">cahier d'exemples</a> à partir du dossier exemple de notre référentiel de projet. Vous avez deux options pour utiliser Milvus Lite : soit l'importer en tant que bibliothèque Python, soit l'exécuter en tant que serveur autonome sur votre machine à l'aide de la CLI.</p>
<ul>
<li>Pour démarrer Milvus Lite en tant que module Python, exécutez les commandes suivantes :</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> default_server
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, utility

<span class="hljs-comment"># Start your milvus server</span>
default_server.start()

<span class="hljs-comment"># Now you can connect with localhost and the given port</span>
<span class="hljs-comment"># Port is defined by default_server.listen_port</span>
connections.connect(host=<span class="hljs-string">&#x27;127.0.0.1&#x27;</span>, port=default_server.listen_port)

<span class="hljs-comment"># Check if the server is ready.</span>
<span class="hljs-built_in">print</span>(utility.get_server_version())

<span class="hljs-comment"># Stop your milvus server</span>
default_server.stop()
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Pour suspendre ou arrêter Milvus Lite, utilisez l'instruction <code translate="no">with</code>.</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> default_server

<span class="hljs-keyword">with</span> default_server:
  <span class="hljs-comment"># Milvus Lite has already started, use default_server here.</span>
  connections.connect(host=<span class="hljs-string">&#x27;127.0.0.1&#x27;</span>, port=default_server.listen_port)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Pour démarrer Milvus Lite en tant que serveur autonome basé sur l'interface de programmation, exécutez la commande suivante :</li>
</ul>
<pre><code translate="no">milvus-server
<button class="copy-code-btn"></button></code></pre>
<p>Après avoir démarré Milvus Lite, vous pouvez utiliser PyMilvus ou d'autres outils de votre choix pour vous connecter au serveur autonome.</p>
<h3 id="Start-Milvus-Lite-in-a-debug-mode" class="common-anchor-header">Démarrer Milvus Lite en mode débogage</h3><ul>
<li>Pour exécuter Milvus Lite en mode débogage en tant que module Python, exécutez les commandes suivantes :</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> debug_server, MilvusServer

debug_server.run()

<span class="hljs-comment"># Or you can create a MilvusServer by yourself</span>
<span class="hljs-comment"># server = MilvusServer(debug=True)</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Pour exécuter le serveur autonome en mode débogage, exécutez la commande suivante :</li>
</ul>
<pre><code translate="no">milvus-server --debug
<button class="copy-code-btn"></button></code></pre>
<h3 id="Persist-data-and-logs" class="common-anchor-header">Persistance des données et des journaux</h3><ul>
<li>Pour créer un répertoire local pour Milvus Lite qui contiendra toutes les données et tous les journaux pertinents, exécutez les commandes suivantes :</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> default_server

<span class="hljs-keyword">with</span> <span class="hljs-attr">default_server</span>:
  default_server.<span class="hljs-title function_">set_base_dir</span>(<span class="hljs-string">&#x27;milvus_data&#x27;</span>)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Pour conserver toutes les données et tous les journaux générés par le serveur autonome sur votre disque local, exécutez la commande suivante :</li>
</ul>
<pre><code translate="no">$ milvus-server --data milvus_data
<button class="copy-code-btn"></button></code></pre>
<h3 id="Configure-Milvus-Lite" class="common-anchor-header">Configurer Milvus Lite</h3><p>La configuration de Milvus Lite est similaire à la configuration des instances Milvus à l'aide des API Python ou de la CLI.</p>
<ul>
<li>Pour configurer la Milvus Lite à l'aide des API Python, utilisez l'API <code translate="no">config.set</code> d'une instance <code translate="no">MilvusServer</code> pour les paramètres de base et supplémentaires :</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> default_server

<span class="hljs-keyword">with</span> default_server:
  default_server.config.<span class="hljs-built_in">set</span>(<span class="hljs-string">&#x27;system_Log_level&#x27;</span>, <span class="hljs-string">&#x27;info&#x27;</span>)
  default_server.config.<span class="hljs-built_in">set</span>(<span class="hljs-string">&#x27;proxy_port&#x27;</span>, <span class="hljs-number">19531</span>)
  default_server.config.<span class="hljs-built_in">set</span>(<span class="hljs-string">&#x27;dataCoord.segment.maxSize&#x27;</span>, <span class="hljs-number">1024</span>)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Pour configurer Milvus Lite à l'aide de l'interface de programmation, exécutez la commande suivante pour les paramètres de base :</li>
</ul>
<pre><code translate="no">$ milvus-server --system-log-level info
$ milvus-server --proxy-port 19531
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Ou exécutez la commande suivante pour les configurations supplémentaires.</li>
</ul>
<pre><code translate="no">$ milvus-server --extra-config dataCoord.segment.maxSize=1024
<button class="copy-code-btn"></button></code></pre>
<p>Tous les éléments configurables se trouvent dans le modèle <code translate="no">config.yaml</code> livré avec le paquet Milvus.</p>
<p>Pour plus de détails techniques sur l'installation et la configuration de Milvus Lite, voir notre <a href="https://milvus.io/docs/milvus_lite.md#Prerequisites">documentation</a>.</p>
<h2 id="Summary" class="common-anchor-header">Résumé<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Lite est un excellent choix pour ceux qui recherchent les capacités de Milvus dans un format compact. Que vous soyez chercheur, développeur ou data scientist, cette option mérite d'être explorée.</p>
<p>Milvus Lite est également une belle addition à la communauté open-source, mettant en valeur le travail extraordinaire de ses contributeurs. Grâce aux efforts de Bin Ji, Milvus est désormais accessible à un plus grand nombre d'utilisateurs. Nous sommes impatients de voir les idées novatrices que Bin Ji et d'autres membres de la communauté Milvus apporteront à l'avenir.</p>
<h2 id="Let’s-keep-in-touch" class="common-anchor-header">Restons en contact !<button data-href="#Let’s-keep-in-touch" class="anchor-icon" translate="no">
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
    </button></h2><p>Si vous rencontrez des problèmes lors de l'installation ou de l'utilisation de Milvus Lite, vous pouvez <a href="https://github.com/milvus-io/milvus-lite/issues/new">déposer un problème ici</a> ou nous contacter via <a href="https://twitter.com/milvusio">Twitter</a> ou <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a>. Vous pouvez également rejoindre notre <a href="https://milvus.io/slack/">canal Slack</a> pour discuter avec nos ingénieurs et l'ensemble de la communauté, ou vous rendre à <a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">nos heures de bureau du mardi</a>!</p>
