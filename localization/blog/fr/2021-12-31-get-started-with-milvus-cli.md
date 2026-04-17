---
id: 2021-12-31-get-started-with-milvus-cli.md
title: Démarrer avec Milvus_CLI
author: Zhuanghong Chen and Zhen Chen
date: 2021-12-31T00:00:00.000Z
desc: Cet article présente Milvus_CLI et vous aide à effectuer des tâches courantes.
cover: assets.zilliz.com/CLI_9a10de4fcc.png
tag: Engineering
recommend: true
canonicalUrl: 'https://zilliz.com/blog/get-started-with-milvus-cli'
---
<p>À l'ère de l'explosion de l'information, nous produisons en permanence des voix, des images, des vidéos et d'autres données non structurées. Comment analyser efficacement cette masse de données ? L'émergence des réseaux neuronaux permet d'intégrer les données non structurées sous forme de vecteurs, et la base de données Milvus est un logiciel de service de données de base qui permet de compléter le stockage, la recherche et l'analyse des données vectorielles.</p>
<p>Mais comment utiliser rapidement la base de données vectorielles Milvus ?</p>
<p>Certains utilisateurs se sont plaints que les API étaient difficiles à mémoriser et ont souhaité qu'il y ait des lignes de commande simples pour utiliser la base de données Milvus.</p>
<p>Nous sommes ravis de présenter Milvus_CLI, un outil de ligne de commande dédié à la base de données vectorielles Milvus.</p>
<p>Milvus_CLI est un CLI pratique pour la base de données Milvus, qui prend en charge la connexion à la base de données, l'importation et l'exportation de données et le calcul de vecteurs à l'aide de commandes interactives dans des shells. La dernière version de Milvus_CLI présente les caractéristiques suivantes.</p>
<ul>
<li><p>Prise en charge de toutes les plates-formes, y compris Windows, Mac et Linux</p></li>
<li><p>Installation en ligne et hors ligne avec pip prise en charge</p></li>
<li><p>Portable, peut être utilisé n'importe où</p></li>
<li><p>Construit sur le SDK Milvus pour Python</p></li>
<li><p>Documentation d'aide incluse</p></li>
<li><p>Prise en charge de l'auto-complétion</p></li>
</ul>
<h2 id="Installation" class="common-anchor-header">Installation de Milvus_CLI<button data-href="#Installation" class="anchor-icon" translate="no">
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
    </button></h2><p>Vous pouvez installer Milvus_CLI en ligne ou hors ligne.</p>
<h3 id="Install-MilvusCLI-online" class="common-anchor-header">Installer Milvus_CLI en ligne</h3><p>Exécutez la commande suivante pour installer Milvus_CLI en ligne avec pip. Python 3.8 ou supérieur est requis.</p>
<pre><code translate="no">pip install milvus-cli
<button class="copy-code-btn"></button></code></pre>
<h3 id="Install-MilvusCLI-offline" class="common-anchor-header">Installer Milvus_CLI hors ligne</h3><p>Pour installer Milvus_CLI hors ligne, <a href="https://github.com/milvus-io/milvus_cli/releases">téléchargez</a> d'abord la dernière version de l'archive à partir de la page de publication.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_af0e832119.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>Une fois l'archive téléchargée, exécutez la commande suivante pour installer Milvus_CLI.</p>
<pre><code translate="no">pip install milvus_cli-&lt;version&gt;.tar.gz
<button class="copy-code-btn"></button></code></pre>
<p>Une fois Milvus_CLI installé, exécutez <code translate="no">milvus_cli</code>. L'invite <code translate="no">milvus_cli &gt;</code> qui apparaît indique que la ligne de commande est prête.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_b50f5d2a5a.png" alt="2.png" class="doc-image" id="2.png" />
   </span> <span class="img-wrapper"> <span>2.png</span> </span></p>
<p>Si vous utilisez un Mac avec la puce M1 ou un PC sans environnement Python, vous pouvez choisir d'utiliser une application portable à la place. Pour ce faire, <a href="https://github.com/milvus-io/milvus_cli/releases">téléchargez</a> un fichier sur la page de publication correspondant à votre système d'exploitation, exécutez <code translate="no">chmod +x</code> sur le fichier pour le rendre exécutable, puis exécutez <code translate="no">./</code> sur le fichier pour l'exécuter.</p>
<h4 id="Example" class="common-anchor-header"><strong>Exemple</strong></h4><p>L'exemple suivant rend <code translate="no">milvus_cli-v0.1.8-fix2-macOS</code> exécutable et l'exécute.</p>
<pre><code translate="no"><span class="hljs-built_in">sudo</span> <span class="hljs-built_in">chmod</span> +x milvus_cli-v0.1.8-fix2-macOS
./milvus_cli-v0.1.8-fix2-macOS
<button class="copy-code-btn"></button></code></pre>
<h2 id="Usage" class="common-anchor-header">Utilisation<button data-href="#Usage" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Connect-to-Milvus" class="common-anchor-header">Connexion à Milvus</h3><p>Avant de vous connecter à Milvus, assurez-vous que Milvus est installé sur votre serveur. Voir <a href="https://milvus.io/docs/v2.0.x/install_standalone-docker.md">Installer Milvus Standalone</a> ou <a href="https://milvus.io/docs/v2.0.x/install_cluster-docker.md">Installer Milvus Cluster</a> pour plus d'informations.</p>
<p>Si Milvus est installé sur votre hôte local avec le port par défaut, exécutez <code translate="no">connect</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_f950d3739a.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span></p>
<p>Sinon, exécuter la commande suivante avec l'adresse IP de votre serveur Milvus. L'exemple suivant utilise <code translate="no">172.16.20.3</code> comme adresse IP et <code translate="no">19530</code> comme numéro de port.</p>
<pre><code translate="no">connect -h 172.16.20.3
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_9ff2db9855.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<h3 id="Create-a-collection" class="common-anchor-header">Créer une collection</h3><p>Cette section explique comment créer une collection.</p>
<p>Une collection se compose d'entités et est similaire à une table dans un SGBDR. Voir le <a href="https://milvus.io/docs/v2.0.x/glossary.md">glossaire</a> pour plus d'informations.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_95a88c1cbf.png" alt="5.png" class="doc-image" id="5.png" />
   </span> <span class="img-wrapper"> <span>5.png</span> </span></p>
<h4 id="Example" class="common-anchor-header">Exemple de création d'une collection</h4><p>L'exemple suivant crée une collection nommée <code translate="no">car</code>. La collection <code translate="no">car</code> comporte quatre champs : <code translate="no">id</code>, <code translate="no">vector</code>, <code translate="no">color</code> et <code translate="no">brand</code>. Le champ de clé primaire est <code translate="no">id</code>. Pour plus d'informations, reportez-vous à la section <a href="https://milvus.io/docs/v2.0.x/cli_commands.md#create-collection">Créer une collection</a>.</p>
<pre><code translate="no">create collection -c car -f <span class="hljs-built_in">id</span>:INT64:primary_field -f vector:FLOAT_VECTOR:<span class="hljs-number">128</span> -f color:INT64:color -f brand:INT64:brand -p <span class="hljs-built_in">id</span> -a -d <span class="hljs-string">&#x27;car_collection&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="List-collections" class="common-anchor-header">Répertorier les collections</h3><p>Exécutez la commande suivante pour répertorier toutes les collections de cette instance Milvus.</p>
<pre><code translate="no">list collections
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_1331f4c8bc.png" alt="6.png" class="doc-image" id="6.png" />
   </span> <span class="img-wrapper"> <span>6.png</span> </span></p>
<p>Exécutez la commande suivante pour vérifier les détails de la collection <code translate="no">car</code>.</p>
<pre><code translate="no">describe collection -c car 
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_1d70beee54.png" alt="7.png" class="doc-image" id="7.png" />
   </span> <span class="img-wrapper"> <span>7.png</span> </span></p>
<h3 id="Calculate-the-distance-between-two-vectors" class="common-anchor-header">Calculer la distance entre deux vecteurs</h3><p>Exécutez la commande suivante pour importer des données dans la collection <code translate="no">car</code>.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> -c car <span class="hljs-string">&#x27;https://raw.githubusercontent.com/zilliztech/milvus_cli/main/examples/import_csv/vectors.csv&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_7609a4359a.png" alt="8.png" class="doc-image" id="8.png" />
   </span> <span class="img-wrapper"> <span>8.png</span> </span></p>
<p>Exécutez la commande <code translate="no">query</code> et saisissez <code translate="no">car</code> comme nom de collection et <code translate="no">id&gt;0</code> comme expression de requête lorsque vous y êtes invité. Les identifiants des entités qui répondent aux critères sont renvoyés comme le montre la figure suivante.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/9_f0755589f6.png" alt="9.png" class="doc-image" id="9.png" />
   </span> <span class="img-wrapper"> <span>9.png</span> </span></p>
<p>Exécutez <code translate="no">calc</code> et entrez les valeurs appropriées lorsque vous y êtes invité pour calculer les distances entre les tableaux de vecteurs.</p>
<h3 id="Delete-a-collection" class="common-anchor-header">Suppression d'une collection</h3><p>Exécutez la commande suivante pour supprimer la collection <code translate="no">car</code>.</p>
<pre><code translate="no"><span class="hljs-keyword">delete</span> collection -c car
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/10_16b2b01935.png" alt="10.png" class="doc-image" id="10.png" />
   </span> <span class="img-wrapper"> <span>10.png</span> </span></p>
<h2 id="More" class="common-anchor-header">Plus d'informations<button data-href="#More" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus_CLI ne se limite pas aux fonctions précédentes. Exécutez <code translate="no">help</code> pour afficher toutes les commandes que Milvus_CLI inclut et leurs descriptions respectives. Exécutez <code translate="no">&lt;command&gt; --help</code> pour afficher les détails d'une commande spécifiée.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/11_5f31ccb1e8.png" alt="11.png" class="doc-image" id="11.png" />
   </span> <span class="img-wrapper"> <span>11.png</span> </span></p>
<p><strong>Voir aussi :</strong></p>
<p><a href="https://milvus.io/docs/v2.0.x/cli_commands.md">Référence des commandes Milvus_CLI</a> sous Milvus Docs</p>
<p>Nous espérons que Milvus_CLI vous aidera à utiliser facilement la base de données vectorielles Milvus. Nous continuerons à optimiser Milvus_CLI et vos contributions sont les bienvenues.</p>
<p>Si vous avez des questions, n'hésitez pas à <a href="https://github.com/zilliztech/milvus_cli/issues">déposer un problème</a> sur GitHub.</p>
