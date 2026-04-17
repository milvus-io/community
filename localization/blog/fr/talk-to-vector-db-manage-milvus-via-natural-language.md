---
id: talk-to-your-vector-database-managing-milvus-via-natural-language.md
title: 'Parlez à votre base de données vectorielle : Gérer Milvus en langage naturel'
author: Lawrence Luo
date: 2025-08-01T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Aug_2_2025_01_17_45_PM_9c50d607bb.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'vector database, mcp, LLM, claude, gemini'
meta_keywords: 'Cursor, Claude Code, Gemini CLI, Code search, MCP'
meta_title: |
  Talk to Your Vector Database: Managing Milvus via Natural Language
desc: >-
  Milvus MCP Server connecte directement Milvus aux assistants de codage IA tels
  que Claude Code et Cursor par l'intermédiaire de MCP. Vous pouvez gérer Milvus
  en langage naturel.
origin: >-
  https://milvus.io/blog/talk-to-your-vector-database-managing-milvus-via-natural-language.md
---
<p>Avez-vous déjà souhaité pouvoir dire à votre assistant IA <em>"Montrez-moi toutes les collections de ma base de données vectorielles"</em> ou <em>"Trouvez les documents similaires à ce texte"</em> et le faire fonctionner ?</p>
<p>Le <a href="http://github.com/zilliztech/mcp-server-milvus"><strong>serveur MCP Milvus</strong></a> rend cela possible en connectant votre base de données vectorielles Milvus directement aux assistants de codage IA tels que Claude Desktop et Cursor IDE par le biais du Model Context Protocol (MCP). Au lieu d'écrire le code <code translate="no">pymilvus</code>, vous pouvez gérer l'ensemble de votre Milvus par le biais de conversations en langage naturel.</p>
<ul>
<li><p>Sans Milvus MCP Server : Écriture de scripts Python avec le SDK pymilvus pour rechercher des vecteurs</p></li>
<li><p>Avec Milvus MCP Server : "Trouver des documents similaires à ce texte dans ma collection".</p></li>
</ul>
<p>👉 <strong>Dépôt GitHub :</strong><a href="https://github.com/zilliztech/mcp-server-milvus"> github.com/zilliztech/mcp-server-milvus</a></p>
<p>Et si vous utilisez <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (géré par Milvus), nous vous couvrons également. À la fin de ce blog, nous présenterons également le <strong>serveur Zilliz MCP</strong>, une option gérée qui fonctionne de manière transparente avec Zilliz Cloud. Plongeons dans le vif du sujet.</p>
<h2 id="What-Youll-Get-with-Milvus-MCP-Server" class="common-anchor-header">Ce que vous obtiendrez avec Milvus MCP Server<button data-href="#What-Youll-Get-with-Milvus-MCP-Server" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus MCP Server offre à votre assistant d'intelligence artificielle les fonctionnalités suivantes :</p>
<ul>
<li><p><strong>Répertorier et explorer des</strong> collections de vecteurs</p></li>
<li><p><strong>Rechercher des vecteurs</strong> à l'aide de la similarité sémantique</p></li>
<li><p><strong>Créer de nouvelles collections</strong> avec des schémas personnalisés</p></li>
<li><p><strong>Insérer et gérer des</strong> données vectorielles</p></li>
<li><p><strong>Exécuter des requêtes complexes</strong> sans écrire de code</p></li>
<li><p>Et bien d'autres choses encore</p></li>
</ul>
<p>Le tout par le biais d'une conversation naturelle, comme si vous parliez à un expert en bases de données. Consultez <a href="https://github.com/zilliztech/mcp-server-milvus?tab=readme-ov-file#available-tools">ce repo</a> pour obtenir la liste complète des fonctionnalités.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/demo_adedb25430.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Quick-Start-Guide" class="common-anchor-header">Guide de démarrage rapide<button data-href="#Quick-Start-Guide" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Prerequisites" class="common-anchor-header">Prérequis</h3><p><strong>Nécessaire :</strong></p>
<ul>
<li><p>Python 3.10 ou supérieur</p></li>
<li><p>Une instance Milvus en cours d'exécution (locale ou distante)</p></li>
<li><p><a href="https://github.com/astral-sh/uv">Gestionnaire de paquets uv</a> (recommandé)</p></li>
</ul>
<p><strong>Applications IA prises en charge :</strong></p>
<ul>
<li><p>Claude Desktop</p></li>
<li><p>IDE Cursor</p></li>
<li><p>Toute application compatible MCP</p></li>
</ul>
<h3 id="Tech-Stack-We’ll-Use" class="common-anchor-header">Pile technologique utilisée</h3><p>Dans ce tutoriel, nous utiliserons la pile technologique suivante :</p>
<ul>
<li><p><strong>Langage Runtime :</strong> <a href="https://www.python.org/">Python 3.11</a></p></li>
<li><p><strong>Gestionnaire de paquets :</strong> UV</p></li>
<li><p><strong>IDE :</strong> Cursor</p></li>
<li><p><strong>Serveur MCP :</strong> mcp-server-milvus</p></li>
<li><p><strong>LLM :</strong> Claude 3.7</p></li>
<li><p><strong>Base de données vectorielles :</strong> Milvus</p></li>
</ul>
<h3 id="Step-1-Install-Dependencies" class="common-anchor-header">Étape 1 : Installation des dépendances</h3><p>Tout d'abord, installez le gestionnaire de paquets uv :</p>
<pre><code translate="no">curl -<span class="hljs-title class_">LsSf</span> <span class="hljs-attr">https</span>:<span class="hljs-comment">//astral.sh/uv/install.sh | sh</span>
<button class="copy-code-btn"></button></code></pre>
<p>Ou :</p>
<pre><code translate="no">pip3 install uv -i <span class="hljs-attr">https</span>:<span class="hljs-comment">//mirrors.aliyun.com/pypi/simple</span>
<button class="copy-code-btn"></button></code></pre>
<p>Vérifier l'installation :</p>
<pre><code translate="no">uv --version
uvx --version
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Step_1_Install_Dependencies_3e452c55e3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Set-Up-Milvus" class="common-anchor-header">Étape 2 : Configurer Milvus</h3><p><a href="https://milvus.io/">Milvus</a> est une base de données vectorielle open-source native pour les charges de travail d'IA, créée par <a href="https://zilliz.com/">Zilliz</a>. Conçue pour gérer des millions à des milliards d'enregistrements vectoriels, elle a obtenu plus de 36 000 étoiles sur GitHub. En s'appuyant sur cette base, Zilliz propose également <a href="https://zilliz.com/cloud">Zilliz Cloud, un</a>service entièrement géré de Milvus conçu pour la convivialité, la rentabilité et la sécurité avec une architecture cloud-native.</p>
<p>Pour connaître les exigences de déploiement de Milvus, consultez <a href="https://milvus.io/docs/prerequisite-docker.md">ce guide sur le site doc.</a></p>
<p><strong>Configuration minimale requise :</strong></p>
<ul>
<li><p><strong>Logiciel :</strong> Docker, Docker Compose</p></li>
<li><p><strong>RAM :</strong> 16 GO OU PLUS</p></li>
<li><p><strong>Disque :</strong> 100GB+</p></li>
</ul>
<p>Télécharger le fichier YAML de déploiement :</p>
<pre><code translate="no">[root@Milvus ~]# wget https://github.com/milvus-io/milvus/releases/download/v2.5.4/milvus-standalone-docker-compose.yml -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<p>Démarrer Milvus :</p>
<pre><code translate="no">[<span class="hljs-meta">root@Milvus ~</span>]<span class="hljs-meta"># docker-compose up -d</span>
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">[<span class="hljs-meta">root@Milvus ~</span>]<span class="hljs-meta"># docker ps -a</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Step_2_Set_Up_Milvus_4826468767.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Votre instance Milvus sera disponible à l'adresse <code translate="no">http://localhost:19530</code>.</p>
<h3 id="Step-3-Install-the-MCP-Server" class="common-anchor-header">Étape 3 : Installer le serveur MCP</h3><p>Cloner et tester le serveur MCP :</p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/zilliztech/mcp-server-milvus.git
<span class="hljs-built_in">cd</span> mcp-server-milvus

<span class="hljs-comment"># Test the server locally</span>
uv run src/mcp_server_milvus/server.py --milvus-uri http://localhost:19530
<button class="copy-code-btn"></button></code></pre>
<p>Nous recommandons d'installer les dépendances et de les vérifier localement avant d'enregistrer le serveur dans Cursor :</p>
<pre><code translate="no">uv run src/mcp_server_milvus/server.<span class="hljs-property">py</span> --milvus-uri <span class="hljs-attr">http</span>:<span class="hljs-comment">//192.168.4.48:19530</span>
<button class="copy-code-btn"></button></code></pre>
<p>Si le serveur démarre avec succès, vous êtes prêt à configurer votre outil d'IA.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Step_3_Install_the_MCP_Server_9ce01351e6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Configure-Your-AI-Assistant" class="common-anchor-header">Étape 4 : Configurer votre assistant IA</h3><p><strong>Option A : Claude Desktop</strong></p>
<ol>
<li><h4 id="Install-Claude-Desktop-from-claudeaidownloadhttpclaudeaidownload" class="common-anchor-header">Installez Claude Desktop à partir de <code translate="no">[claude.ai/download](http://claude.ai/download)</code>.</h4></li>
<li><p>Ouvrez le fichier de configuration :</p></li>
</ol>
<ul>
<li>macOS : <code translate="no">~/Library/Application Support/Claude/claude_desktop_config.json</code></li>
<li>Windows : <code translate="no">%APPDATA%\Claude\claude_desktop_config.json</code></li>
</ul>
<p>Ajoutez cette configuration :</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;milvus&quot;</span>: {
      <span class="hljs-string">&quot;command&quot;</span>: <span class="hljs-string">&quot;/path/to/uv&quot;</span>,
      <span class="hljs-string">&quot;args&quot;</span>: [
        <span class="hljs-string">&quot;--directory&quot;</span>,
        <span class="hljs-string">&quot;/path/to/mcp-server-milvus&quot;</span>,
        <span class="hljs-string">&quot;run&quot;</span>,
        <span class="hljs-string">&quot;src/mcp_server_milvus/server.py&quot;</span>,
        <span class="hljs-string">&quot;--milvus-uri&quot;</span>,
        <span class="hljs-string">&quot;http://localhost:19530&quot;</span>
      ]
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<ol start="4">
<li>Redémarrer Claude Desktop</li>
</ol>
<p><strong>Option B : IDE du curseur</strong></p>
<ol>
<li><p>Ouvrir Cursor Settings → Features → MCP</p></li>
<li><p>Ajouter un nouveau serveur MCP global (ceci crée <code translate="no">.cursor/mcp.json</code>)</p></li>
<li><p>Ajouter cette configuration :</p></li>
</ol>
<p>Note : Ajustez les chemins d'accès à votre structure de fichiers réelle.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;milvus&quot;</span>: {
      <span class="hljs-string">&quot;command&quot;</span>: <span class="hljs-string">&quot;/PATH/TO/uv&quot;</span>,
      <span class="hljs-string">&quot;args&quot;</span>: [
        <span class="hljs-string">&quot;--directory&quot;</span>,
        <span class="hljs-string">&quot;/path/to/mcp-server-milvus/src/mcp_server_milvus&quot;</span>,
        <span class="hljs-string">&quot;run&quot;</span>,
        <span class="hljs-string">&quot;server.py&quot;</span>,
        <span class="hljs-string">&quot;--milvus-uri&quot;</span>,
        <span class="hljs-string">&quot;http://127.0.0.1:19530&quot;</span>
      ]
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Option_B_Cursor_IDE_cd1321ea25.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Paramètres :</strong></p>
<ul>
<li><code translate="no">/PATH/TO/uv</code> est le chemin vers l'exécutable uv</li>
<li><code translate="no">--directory</code> est le chemin vers le projet cloné</li>
<li><code translate="no">--milvus-uri</code> est le point d'arrivée de votre serveur Milvus</li>
</ul>
<ol start="4">
<li>Redémarrer le curseur ou recharger la fenêtre</li>
</ol>
<p><strong>Astuce :</strong> trouvez votre chemin <code translate="no">uv</code> avec <code translate="no">which uv</code> sur macOS/Linux ou <code translate="no">where uv</code> sur Windows.</p>
<h3 id="Step-5-See-It-in-Action" class="common-anchor-header">Étape 5 : voir en action</h3><p>Une fois configuré, essayez ces commandes en langage naturel :</p>
<ul>
<li><p><strong>Explorez votre base de données :</strong> "Quelles collections ai-je dans ma base de données Milvus ?</p></li>
<li><p><strong>Créer une nouvelle collection :</strong> "Créer une collection appelée 'articles' avec des champs pour le titre (chaîne), le contenu (chaîne) et un champ vectoriel de 768 dimensions pour les incrustations.</p></li>
<li><p><strong>Rechercher des contenus similaires :</strong> Trouver les cinq articles les plus similaires à "applications d'apprentissage automatique" dans ma collection d'articles.</p></li>
<li><p><strong>Insérer des données :</strong> Ajouter un nouvel article avec le titre "AI Trends 2024" et le contenu "Artificial intelligence continues to evolve..." à la collection d'articles.</p></li>
</ul>
<p><strong>Ce qui nécessitait auparavant plus de 30 minutes de codage ne prend plus que quelques secondes de conversation.</strong></p>
<p>Vous bénéficiez d'un contrôle en temps réel et d'un accès en langage naturel à Milvus, sans avoir à rédiger de modèle standard ou à apprendre l'API.</p>
<h2 id="Troubleshooting" class="common-anchor-header">Dépannage<button data-href="#Troubleshooting" class="anchor-icon" translate="no">
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
    </button></h2><p>Si les outils MCP n'apparaissent pas, redémarrez complètement votre application AI, vérifiez le chemin UV avec <code translate="no">which uv</code>, et testez le serveur manuellement avec <code translate="no">uv run src/mcp_server_milvus/server.py --milvus-uri http://localhost:19530</code>.</p>
<p>Pour les erreurs de connexion, vérifiez que Milvus fonctionne avec <code translate="no">docker ps | grep milvus</code>, essayez d'utiliser <code translate="no">127.0.0.1</code> au lieu de <code translate="no">localhost</code>, et vérifiez que le port 19530 est accessible.</p>
<p>Si vous rencontrez des problèmes d'authentification, définissez la variable d'environnement <code translate="no">MILVUS_TOKEN</code> si votre Milvus nécessite une authentification et vérifiez vos autorisations pour les opérations que vous tentez.</p>
<h2 id="Managed-Alternative-Zilliz-MCP-Server" class="common-anchor-header">Alternative gérée : Serveur MCP Zilliz<button data-href="#Managed-Alternative-Zilliz-MCP-Server" class="anchor-icon" translate="no">
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
    </button></h2><p>Le <strong>serveur MCP Milvus</strong> open-source est une excellente solution pour les déploiements locaux ou auto-hébergés de Milvus. Mais si vous utilisez <a href="https://zilliz.com/cloud">Zilliz Cloud, le</a>service d'entreprise entièrement géré créé par les créateurs de Milvus, il existe une alternative spécialement conçue : <a href="https://zilliz.com/blog/introducing-zilliz-mcp-server"><strong>Zilliz MCP Server</strong></a>.</p>
<p><a href="https://zilliz.com/cloud">Zilliz Cloud</a> élimine les frais généraux liés à la gestion de votre propre instance Milvus en offrant une base de données vectorielle évolutive, performante et sécurisée. Le <strong>serveur Zilliz MCP</strong> s'intègre directement à Zilliz Cloud et expose ses capacités en tant qu'outils compatibles MCP. Cela signifie que votre assistant IA - qu'il soit dans Claude, Cursor ou un autre environnement compatible MCP - peut désormais interroger, gérer et orchestrer votre espace de travail Zilliz Cloud en utilisant le langage naturel.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/zilliz_mcp_abe1ca1271.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Pas de code standard. Pas de changement d'onglet. Pas de rédaction manuelle d'appels REST ou SDK. Dites simplement votre demande et laissez votre assistant s'occuper du reste.</p>
<h3 id="🚀-Getting-Started-with-Zilliz-MCP-Server" class="common-anchor-header">🚀 Démarrer avec Zilliz MCP Server</h3><p>Si vous êtes prêt pour une infrastructure vectorielle prête pour la production avec la facilité du langage naturel, démarrer ne prend que quelques étapes :</p>
<ol>
<li><p><a href="https://cloud.zilliz.com/signup"><strong>S'inscrire à Zilliz Cloud</strong></a> - niveau gratuit disponible.</p></li>
<li><p><a href="http://github.com/zilliztech/zilliz-mcp-server"><strong>Installez le serveur MCP de Zilliz</strong> à partir du </a>dépôt GitHub.</p></li>
<li><p><strong>Configurez votre assistant compatible MCP</strong> (Claude, Cursor, etc.) pour qu'il se connecte à votre instance Zilliz Cloud.</p></li>
</ol>
<p>Vous obtenez ainsi le meilleur des deux mondes : une recherche vectorielle puissante avec une infrastructure de niveau production, désormais accessible en anglais simple.</p>
<h2 id="Wrapping-Up" class="common-anchor-header">Récapitulatif<button data-href="#Wrapping-Up" class="anchor-icon" translate="no">
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
    </button></h2><p>Et voilà, vous venez d'apprendre comment transformer Milvus en une base de données vectorielles conviviale en langage naturel à laquelle vous pouvez littéralement vous <em>adresser</em>. Plus besoin de fouiller dans la documentation du SDK ou d'écrire du code source juste pour créer une collection ou exécuter une recherche.</p>
<p>Que vous exécutiez Milvus localement ou que vous utilisiez Zilliz Cloud, le serveur MCP offre à votre assistant IA une boîte à outils pour gérer vos données vectorielles comme un professionnel. Tapez simplement ce que vous voulez faire et laissez Claude ou Cursor s'occuper du reste.</p>
<p>Allez-y, lancez votre outil de développement d'IA, demandez "quelles collections ai-je ?" et voyez-le en action. Vous ne voudrez plus jamais revenir à l'écriture manuelle de requêtes vectorielles.</p>
<ul>
<li><p>Installation locale ? Utilisez le<a href="https://github.com/zilliztech/mcp-server-milvus"> serveur</a> open-source<a href="https://github.com/zilliztech/mcp-server-milvus"> Milvus MCP</a>.</p></li>
<li><p>Vous préférez un service géré ? Inscrivez-vous à Zilliz Cloud et utilisez le<a href="https://github.com/zilliztech/zilliz-mcp-server"> serveur Zilliz MCP</a>.</p></li>
</ul>
<p>Vous avez les outils. Laissez maintenant votre IA faire la saisie.</p>
