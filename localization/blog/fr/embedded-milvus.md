---
id: embedded-milvus.md
title: >-
  Utiliser Embedded Milvus pour installer et exécuter instantanément Milvus avec
  Python
author: Alex Gao
date: 2022-08-15T00:00:00.000Z
desc: >-
  Une version de Milvus conviviale pour Python qui rend l'installation plus
  flexible.
cover: assets.zilliz.com/embeddded_milvus_1_8132468cac.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: 'https://milvus.io/blog/embedded-milvus.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/embeddded_milvus_1_8132468cac.png" alt="Cover" class="doc-image" id="cover" />
   </span> <span class="img-wrapper"> <span>Couverture</span> </span></p>
<blockquote>
<p>Cet article est co-écrit par <a href="https://github.com/soothing-rain/">Alex Gao</a> et <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>Milvus est une base de données vectorielle open-source pour les applications d'intelligence artificielle. Elle propose diverses méthodes d'installation, notamment la construction à partir du code source et l'installation de Milvus avec Docker Compose/Helm/APT/YUM/Ansible. Les utilisateurs peuvent choisir l'une des méthodes d'installation en fonction de leur système d'exploitation et de leurs préférences. Cependant, la communauté Milvus compte de nombreux scientifiques des données et ingénieurs en IA qui travaillent avec Python et qui souhaitent une méthode d'installation beaucoup plus simple que les méthodes actuellement disponibles.</p>
<p>C'est pourquoi nous avons publié Milvus embarqué, une version conviviale pour Python, en même temps que Milvus 2.1 afin de permettre à un plus grand nombre de développeurs Python de faire partie de notre communauté. Cet article présente ce qu'est Milvus embarqué et fournit des instructions sur la manière de l'installer et de l'utiliser.</p>
<p><strong>Aller à :</strong></p>
<ul>
<li><a href="#An-overview-of-embedded-Milvus">Vue d'ensemble de Milvus embarqué</a><ul>
<li><a href="#When-to-use-embedded-Milvus">Quand utiliser Milvus embarqué ?</a></li>
<li><a href="#A-comparison-of-different-modes-of-Milvus">Comparaison des différents modes de Milvus</a></li>
</ul></li>
<li><a href="#How-to-install-embedded-Milvus">Comment installer Milvus embarqué</a></li>
<li><a href="#Start-and-stop-embedded-Milvus">Démarrer et arrêter Milvus embarqué</a></li>
</ul>
<h2 id="An-overview-of-embedded-Milvus" class="common-anchor-header">Vue d'ensemble de Milvus embarqué<button data-href="#An-overview-of-embedded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus<a href="https://github.com/milvus-io/embd-milvus">intégré</a> vous permet d'installer et d'utiliser rapidement Milvus avec Python. Il peut rapidement lancer une instance Milvus et vous permet de démarrer et d'arrêter le service Milvus quand vous le souhaitez. Toutes les données et tous les journaux sont conservés même si vous arrêtez Milvus intégré.</p>
<p>Milvus intégré n'a pas de dépendances internes et ne nécessite pas la pré-installation et l'exécution de dépendances tierces telles que etcd, MinIO, Pulsar, etc.</p>
<p>Tout ce que vous faites avec Milvus intégré et chaque morceau de code que vous écrivez pour lui peut être migré en toute sécurité vers d'autres modes Milvus - autonome, cluster, version cloud, etc. Cela reflète l'une des caractéristiques les plus distinctives de Milvus intégré : <strong>"Écrire une fois, exécuter n'importe où".</strong></p>
<h3 id="When-to-use-embedded-Milvus" class="common-anchor-header">Quand utiliser Milvus embarqué ?</h3><p>Milvus intégré et <a href="https://milvus.io/docs/v2.1.x/install-pymilvus.md">PyMilvus</a> sont conçus pour des objectifs différents. Vous pouvez envisager de choisir Milvus intégré dans les scénarios suivants :</p>
<ul>
<li><p>Vous souhaitez utiliser Milvus sans l'installer de l'une des manières proposées <a href="https://milvus.io/docs/v2.1.x/install_standalone-docker.md">ici</a>.</p></li>
<li><p>Vous souhaitez utiliser Milvus sans conserver un processus Milvus de longue durée dans votre machine.</p></li>
<li><p>Vous souhaitez utiliser rapidement Milvus sans démarrer un processus Milvus distinct et d'autres composants requis tels que etcd, MinIO, Pulsar, etc.</p></li>
</ul>
<p>Il est conseillé de <strong>ne PAS</strong> utiliser Milvus intégré :</p>
<ul>
<li><p>dans un environnement de production.<em>(Pour utiliser Milvus pour la production, envisagez un cluster Milvus ou <a href="https://zilliz.com/cloud">Zilliz cloud</a>, un service Milvus entièrement géré</em>).</p></li>
<li><p>Si vous avez une forte demande de performances.<em>(Comparativement, Milvus intégré n'offre peut-être pas les meilleures performances</em>).</p></li>
</ul>
<h3 id="A-comparison-of-different-modes-of-Milvus" class="common-anchor-header">Comparaison des différents modes de Milvus</h3><p>Le tableau ci-dessous compare plusieurs modes de Milvus : autonome, cluster, Milvus intégré et Zilliz Cloud, un service Milvus entièrement géré.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/comparison_ebcd7c5b07.jpeg" alt="comparison" class="doc-image" id="comparison" />
   </span> <span class="img-wrapper"> <span>comparaison</span> </span></p>
<h2 id="How-to-install-embedded-Milvus" class="common-anchor-header">Comment installer Milvus intégré ?<button data-href="#How-to-install-embedded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Avant d'installer Milvus embarqué, vous devez d'abord vous assurer que vous avez installé Python 3.6 ou une version ultérieure. Milvus embarqué prend en charge les systèmes d'exploitation suivants :</p>
<ul>
<li><p>Ubuntu 18.04</p></li>
<li><p>Mac x86_64 &gt;= 10.4</p></li>
<li><p>Mac M1 &gt;= 11.0</p></li>
</ul>
<p>Si les conditions requises sont remplies, vous pouvez exécuter <code translate="no">$ python3 -m pip install milvus</code> pour installer Milvus intégré. Vous pouvez également ajouter la version dans la commande pour installer une version spécifique de Milvus intégré. Par exemple, si vous souhaitez installer la version 2.1.0, exécutez <code translate="no">$ python3 -m pip install milvus==2.1.0</code>. Plus tard, lorsqu'une nouvelle version de Milvus embarqué sera disponible, vous pourrez également exécuter <code translate="no">$ python3 -m pip install --upgrade milvus</code> pour mettre à niveau Milvus embarqué vers la dernière version.</p>
<p>Si vous êtes un ancien utilisateur de Milvus, que vous avez déjà installé PyMilvus et que vous souhaitez installer Milvus intégré, vous pouvez exécuter <code translate="no">$ python3 -m pip install --no-deps milvus</code>.</p>
<p>Après avoir exécuté la commande d'installation, vous devez créer un dossier de données pour Milvus intégré sous <code translate="no">/var/bin/e-milvus</code> en exécutant la commande suivante :</p>
<pre><code translate="no"><span class="hljs-built_in">sudo</span> <span class="hljs-built_in">mkdir</span> -p /var/bin/e-milvus
<span class="hljs-built_in">sudo</span> <span class="hljs-built_in">chmod</span> -R 777 /var/bin/e-milvus
<button class="copy-code-btn"></button></code></pre>
<h2 id="Start-and-stop-embedded-Milvus" class="common-anchor-header">Démarrer et arrêter Milvus intégré<button data-href="#Start-and-stop-embedded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Lorsque l'installation est terminée, vous pouvez démarrer le service.</p>
<p>Si vous exécutez Milvus intégré pour la première fois, vous devez d'abord importer Milvus et configurer Milvus intégré.</p>
<pre><code translate="no">$ python3
Python 3.9.10 (main, Jan 15 2022, 11:40:53)
[Clang 13.0.0 (clang-1300.0.29.3)] on darwin
Type <span class="hljs-string">&quot;help&quot;</span>, <span class="hljs-string">&quot;copyright&quot;</span>, <span class="hljs-string">&quot;credits&quot;</span> or <span class="hljs-string">&quot;license&quot;</span> <span class="hljs-keyword">for</span> more information.
&gt;&gt;&gt; import milvus
&gt;&gt;&gt; milvus.before()
please <span class="hljs-keyword">do</span> the following <span class="hljs-keyword">if</span> you have not already <span class="hljs-keyword">done</span> so:
1. install required dependencies: bash /var/bin/e-milvus/lib/install_deps.sh
2. <span class="hljs-built_in">export</span> LD_PRELOAD=/SOME_PATH/embd-milvus.so
3. <span class="hljs-built_in">export</span> LD_LIBRARY_PATH=<span class="hljs-variable">$LD_LIBRARY_PATH</span>:/usr/lib:/usr/local/lib:/var/bin/e-milvus/lib/
&gt;&gt;&gt;
<button class="copy-code-btn"></button></code></pre>
<p>Si vous avez déjà démarré Milvus intégré avec succès et que vous revenez pour le redémarrer, vous pouvez directement exécuter <code translate="no">milvus.start()</code> après avoir importé Milvus.</p>
<pre><code translate="no">$ python3
Python <span class="hljs-number">3.9</span><span class="hljs-number">.10</span> (main, Jan <span class="hljs-number">15</span> <span class="hljs-number">2022</span>, <span class="hljs-number">11</span>:<span class="hljs-number">40</span>:<span class="hljs-number">53</span>)
[Clang <span class="hljs-number">13.0</span><span class="hljs-number">.0</span> (clang-<span class="hljs-number">1300.0</span><span class="hljs-number">.29</span><span class="hljs-number">.3</span>)] on darwinType <span class="hljs-string">&quot;help&quot;</span>, <span class="hljs-string">&quot;copyright&quot;</span>, <span class="hljs-string">&quot;credits&quot;</span> <span class="hljs-keyword">or</span> <span class="hljs-string">&quot;license&quot;</span> <span class="hljs-keyword">for</span> more information.
<span class="hljs-meta">&gt;&gt;&gt; </span><span class="hljs-keyword">import</span> milvus
<span class="hljs-meta">&gt;&gt;&gt; </span>milvus.start()
&gt;&gt;&gt;
<button class="copy-code-btn"></button></code></pre>
<p>Si vous avez réussi à démarrer le service Milvus intégré, vous obtiendrez le résultat suivant.</p>
<pre><code translate="no">---<span class="hljs-title class_">Milvus</span> <span class="hljs-title class_">Proxy</span> successfully initialized and ready to serve!---
<button class="copy-code-btn"></button></code></pre>
<p>Après le démarrage du service, vous pouvez ouvrir une autre fenêtre de terminal et exécuter le code d'exemple &quot;<a href="https://github.com/milvus-io/embd-milvus/blob/main/milvus/examples/hello_milvus.py">Hello Milvus</a>&quot; pour vous amuser avec Milvus intégré !</p>
<pre><code translate="no"><span class="hljs-comment"># Download hello_milvus script</span>
$ wget https://raw.githubusercontent.com/milvus-io/pymilvus/v2.1.0/examples/hello_milvus.py
<span class="hljs-comment"># Run Hello Milvus </span>
$ python3 hello_milvus.py
<button class="copy-code-btn"></button></code></pre>
<p>Lorsque vous avez fini d'utiliser Milvus intégré, nous vous recommandons de l'arrêter de manière élégante et de nettoyer les variables d'environnement en exécutant la commande suivante ou en appuyant sur Ctrl-D.</p>
<pre><code translate="no">&gt;&gt;&gt; milvus.stop()
<span class="hljs-keyword">if</span> you need to clean up the environment variables, run:
<span class="hljs-built_in">export</span> LD_PRELOAD=
<span class="hljs-built_in">export</span> LD_LIBRARY_PATH=
&gt;&gt;&gt;
&gt;&gt;&gt; <span class="hljs-built_in">exit</span>()
<button class="copy-code-btn"></button></code></pre>
<h2 id="Whats-next" class="common-anchor-header">Prochaines étapes<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Avec la sortie officielle de Milvus 2.1, nous avons préparé une série de blogs présentant les nouvelles fonctionnalités. En savoir plus sur cette série de blogs :</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">Comment utiliser les données de chaînes de caractères pour renforcer vos applications de recherche de similitudes</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">Utilisation de Milvus embarqué pour installer et exécuter instantanément Milvus avec Python</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">Augmenter le débit de lecture de votre base de données vectorielle avec des répliques en mémoire</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">Comprendre le niveau de cohérence dans la base de données vectorielle Milvus</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">Comprendre le niveau de cohérence dans la base de données vectorielle Milvus (partie II)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">Comment la base de données vectorielle Milvus assure-t-elle la sécurité des données ?</a></li>
</ul>
