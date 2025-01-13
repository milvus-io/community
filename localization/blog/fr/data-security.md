---
id: data-security.md
title: >-
  Comment la base de données vectorielles Milvus garantit-elle la sécurité des
  données ?
author: Angela Ni
date: 2022-09-05T00:00:00.000Z
desc: >-
  En savoir plus sur l'authentification de l'utilisateur et le cryptage en
  transit dans Milvus.
cover: assets.zilliz.com/Security_192e35a790.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: 'https://milvus.io/blog/data-security.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Security_192e35a790.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Image de couverture</span> </span></p>
<p>Afin de garantir la sécurité de vos données, l'authentification de l'utilisateur et la connexion TLS (transport layer security) sont désormais officiellement disponibles dans Milvus 2.1. Sans authentification de l'utilisateur, n'importe qui peut accéder à toutes les données de votre base de données vectorielles avec le SDK. Toutefois, à partir de Milvus 2.1, seules les personnes disposant d'un nom d'utilisateur et d'un mot de passe valides peuvent accéder à la base de données vectorielles Milvus. En outre, dans Milvus 2.1, la sécurité des données est renforcée par TLS, qui garantit des communications sécurisées dans un réseau informatique.</p>
<p>Cet article vise à analyser comment la base de données vectorielles Milvus assure la sécurité des données grâce à l'authentification de l'utilisateur et à la connexion TLS, et à expliquer comment vous pouvez utiliser ces deux fonctionnalités en tant qu'utilisateur souhaitant assurer la sécurité des données lors de l'utilisation de la base de données vectorielles.</p>
<p><strong>Aller à :</strong></p>
<ul>
<li><a href="#What-is-database-security-and-why-is-it-important">Qu'est-ce que la sécurité des bases de données et pourquoi est-elle importante ?</a></li>
<li><a href="#How-does-the-Milvus-vector-database-ensure-data-security">Comment la base de données vectorielle Milvus assure-t-elle la sécurité des données ?</a><ul>
<li><a href="#User-authentication">Authentification de l'utilisateur</a></li>
<li><a href="#TLS-connection">Connexion TLS</a></li>
</ul></li>
</ul>
<h2 id="What-is-database-security-and-why-is-it-important" class="common-anchor-header">Qu'est-ce que la sécurité des bases de données et pourquoi est-elle importante ?<button data-href="#What-is-database-security-and-why-is-it-important" class="anchor-icon" translate="no">
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
    </button></h2><p>La sécurité des bases de données fait référence aux mesures prises pour garantir la sécurité et la confidentialité de toutes les données contenues dans la base. Les récentes violations et fuites de données chez <a href="https://firewalltimes.com/recent-data-breaches/">Twitter, Marriott, le département des assurances du Texas, etc.</a> nous rendent d'autant plus vigilants sur la question de la sécurité des données. Tous ces cas nous rappellent constamment que les sociétés et les entreprises peuvent subir de graves pertes si les données ne sont pas bien protégées et si les bases de données qu'elles utilisent ne sont pas sécurisées.</p>
<h2 id="How-does-the-Milvus-vector-database-ensure-data-security" class="common-anchor-header">Comment la base de données vectorielles Milvus assure-t-elle la sécurité des données ?<button data-href="#How-does-the-Milvus-vector-database-ensure-data-security" class="anchor-icon" translate="no">
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
    </button></h2><p>Dans la version actuelle 2.1, la base de données vectorielle Milvus tente d'assurer la sécurité de la base de données via l'authentification et le cryptage. Plus précisément, au niveau de l'accès, Milvus prend en charge l'authentification de base des utilisateurs pour contrôler qui peut accéder à la base de données. Parallèlement, au niveau de la base de données, Milvus adopte le protocole de cryptage TLS (transport layer security) pour protéger la communication des données.</p>
<h3 id="User-authentication" class="common-anchor-header">Authentification de l'utilisateur</h3><p>La fonction d'authentification utilisateur de base de Milvus permet d'accéder à la base de données vectorielle à l'aide d'un nom d'utilisateur et d'un mot de passe pour assurer la sécurité des données. Cela signifie que les clients ne peuvent accéder à l'instance Milvus qu'en fournissant un nom d'utilisateur et un mot de passe authentifiés.</p>
<h4 id="The-authentication-workflow-in-the-Milvus-vector-database" class="common-anchor-header">Le processus d'authentification dans la base de données vectorielle Milvus</h4><p>Toutes les demandes gRPC sont traitées par le proxy Milvus, et l'authentification est donc effectuée par le proxy. Le processus de connexion avec les informations d'identification pour se connecter à l'instance Milvus est le suivant.</p>
<ol>
<li>Créer des informations d'identification pour chaque instance Milvus et les mots de passe cryptés sont stockés dans etcd. Milvus utilise <a href="https://golang.org/x/crypto/bcrypt">bcrypt</a> pour le chiffrement car il met en œuvre l'<a href="http://www.usenix.org/event/usenix99/provos/provos.pdf">algorithme de hachage adaptatif</a> de Provos et Mazières.</li>
<li>Côté client, le SDK envoie un texte chiffré lors de la connexion au service Milvus. Le texte chiffré en base64 (<username>:<password>) est attaché aux métadonnées avec la clé <code translate="no">authorization</code>.</li>
<li>Le proxy Milvus intercepte la demande et vérifie les informations d'identification.</li>
<li>Les informations d'identification sont mises en cache localement dans le proxy.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1280_X1280_021e90e3c8.jpeg" alt="authetication_workflow" class="doc-image" id="authetication_workflow" />
   </span> <span class="img-wrapper"> <span>flux de travail de l'authentification</span> </span></p>
<p>Lorsque les informations d'identification sont mises à jour, le flux de travail du système Milvus est le suivant</p>
<ol>
<li>Le coordinateur racine est chargé des informations d'identification lorsque les API d'insertion, d'interrogation et de suppression sont appelées.</li>
<li>Lorsque vous mettez à jour les informations d'identification parce que vous avez oublié le mot de passe, par exemple, le nouveau mot de passe est conservé dans etcd. Toutes les anciennes informations d'identification présentes dans le cache local du proxy sont alors invalidées.</li>
<li>L'intercepteur d'authentification recherche d'abord les enregistrements dans le cache local. Si les informations d'identification dans le cache ne sont pas correctes, l'appel RPC pour récupérer l'enregistrement le plus récent dans la coordonnée racine sera déclenché. Les informations d'identification dans le cache local sont mises à jour en conséquence.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/update_5af81a4173.jpeg" alt="credential_update_workflow" class="doc-image" id="credential_update_workflow" />
   </span> <span class="img-wrapper"> <span>flux_de_mise_à_jour_des_crédentiels</span> </span></p>
<h4 id="How-to-manage-user-authentication-in-the-Milvus-vector-database" class="common-anchor-header">Comment gérer l'authentification des utilisateurs dans la base de données vectorielle Milvus ?</h4><p>Pour activer l'authentification, vous devez d'abord définir <code translate="no">common.security.authorizationEnabled</code> comme <code translate="no">true</code> lors de la configuration de Milvus dans le fichier <code translate="no">milvus.yaml</code>.</p>
<p>Une fois l'authentification activée, un utilisateur root sera créé pour l'instance Milvus. Cet utilisateur root peut utiliser le mot de passe initial de <code translate="no">Milvus</code> pour se connecter à la base de données vectorielle de Milvus.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections
connections.<span class="hljs-title function_">connect</span>(
    alias=<span class="hljs-string">&#x27;default&#x27;</span>,
    host=<span class="hljs-string">&#x27;localhost&#x27;</span>,
    port=<span class="hljs-string">&#x27;19530&#x27;</span>,
    user=<span class="hljs-string">&#x27;root_user&#x27;</span>,
    password=<span class="hljs-string">&#x27;Milvus&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>Nous recommandons vivement de modifier le mot de passe de l'utilisateur racine lors du premier démarrage de Milvus.</p>
<p>Ensuite, l'utilisateur root peut créer d'autres utilisateurs pour l'accès authentifié en exécutant la commande suivante pour créer de nouveaux utilisateurs.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> utility
utility.<span class="hljs-title function_">create_credential</span>(<span class="hljs-string">&#x27;user&#x27;</span>, <span class="hljs-string">&#x27;password&#x27;</span>, <span class="hljs-keyword">using</span>=<span class="hljs-string">&#x27;default&#x27;</span>) 
<button class="copy-code-btn"></button></code></pre>
<p>Il y a deux choses à retenir lors de la création de nouveaux utilisateurs :</p>
<ol>
<li><p>Le nouveau nom d'utilisateur ne doit pas dépasser 32 caractères et doit commencer par une lettre. Seuls les traits de soulignement, les lettres et les chiffres sont autorisés dans le nom d'utilisateur. Par exemple, le nom d'utilisateur "2abc !" n'est pas accepté.</p></li>
<li><p>Quant au mot de passe, sa longueur doit être comprise entre 6 et 256 caractères.</p></li>
</ol>
<p>Une fois le nouvel identifiant configuré, le nouvel utilisateur peut se connecter à l'instance Milvus avec le nom d'utilisateur et le mot de passe.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections
connections.<span class="hljs-title function_">connect</span>(
    alias=<span class="hljs-string">&#x27;default&#x27;</span>,
    host=<span class="hljs-string">&#x27;localhost&#x27;</span>,
    port=<span class="hljs-string">&#x27;19530&#x27;</span>,
    user=<span class="hljs-string">&#x27;user&#x27;</span>,
    password=<span class="hljs-string">&#x27;password&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>Comme pour tous les processus d'authentification, il n'y a pas lieu de s'inquiéter en cas d'oubli du mot de passe. Le mot de passe d'un utilisateur existant peut être réinitialisé à l'aide de la commande suivante.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> utility
utility.<span class="hljs-title function_">reset_password</span>(<span class="hljs-string">&#x27;user&#x27;</span>, <span class="hljs-string">&#x27;new_password&#x27;</span>, <span class="hljs-keyword">using</span>=<span class="hljs-string">&#x27;default&#x27;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Lisez la <a href="https://milvus.io/docs/v2.1.x/authenticate.md">documentation Milvus</a> pour en savoir plus sur l'authentification des utilisateurs.</p>
<h3 id="TLS-connection" class="common-anchor-header">Connexion TLS</h3><p>Transport layer security (TLS) est un type de protocole d'authentification qui assure la sécurité des communications dans un réseau informatique. TLS utilise des certificats pour fournir des services d'authentification entre deux ou plusieurs parties communicantes.</p>
<h4 id="How-to-enable-TLS-in-the-Milvus-vector-database" class="common-anchor-header">Comment activer TLS dans la base de données vectorielle Milvus ?</h4><p>Pour activer TLS dans Milvus, vous devez d'abord exécuter la commande suivante afin de préparer deux fichiers pour générer le certificat : un fichier de configuration OpenSSL par défaut nommé <code translate="no">openssl.cnf</code> et un fichier nommé <code translate="no">gen.sh</code> utilisé pour générer les certificats pertinents.</p>
<pre><code translate="no"><span class="hljs-built_in">mkdir</span> cert &amp;&amp; <span class="hljs-built_in">cd</span> cert
<span class="hljs-built_in">touch</span> openssl.cnf gen.sh
<button class="copy-code-btn"></button></code></pre>
<p>Ensuite, vous pouvez simplement copier et coller la configuration que nous fournissons <a href="https://milvus.io/docs/v2.1.x/tls.md#Create-files">ici</a> dans les deux fichiers. Vous pouvez également apporter des modifications basées sur notre configuration afin de mieux répondre à votre application.</p>
<p>Lorsque les deux fichiers sont prêts, vous pouvez exécuter le fichier <code translate="no">gen.sh</code> pour créer neuf fichiers de certificats. De même, vous pouvez modifier les configurations des neuf fichiers de certificats en fonction de vos besoins.</p>
<pre><code translate="no"><span class="hljs-built_in">chmod</span> +x gen.sh
./gen.sh
<button class="copy-code-btn"></button></code></pre>
<p>Il reste une dernière étape avant de pouvoir se connecter au service Milvus avec TLS. Vous devez définir <code translate="no">tlsEnabled</code> sur <code translate="no">true</code> et configurer les chemins d'accès aux fichiers <code translate="no">server.pem</code>, <code translate="no">server.key</code> et <code translate="no">ca.pem</code> pour le serveur dans <code translate="no">config/milvus.yaml</code>. Le code ci-dessous est un exemple.</p>
<pre><code translate="no">tls:
  serverPemPath: configs/cert/server.pem
  serverKeyPath: configs/cert/server.key
  caPemPath: configs/cert/ca.pem

common:
  security:
    tlsEnabled: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<p>Vous êtes alors prêt et pouvez vous connecter au service Milvus avec TLS tant que vous spécifiez les chemins d'accès aux fichiers <code translate="no">client.pem</code>, <code translate="no">client.key</code>, et <code translate="no">ca.pem</code> pour le client lorsque vous utilisez le SDK de connexion Milvus. Le code ci-dessous est également un exemple.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections

_HOST = <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>
_PORT = <span class="hljs-string">&#x27;19530&#x27;</span>

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\nCreate connection...&quot;</span>)
connections.connect(host=_HOST, port=_PORT, secure=<span class="hljs-literal">True</span>, client_pem_path=<span class="hljs-string">&quot;cert/client.pem&quot;</span>,
                        client_key_path=<span class="hljs-string">&quot;cert/client.key&quot;</span>,
                        ca_pem_path=<span class="hljs-string">&quot;cert/ca.pem&quot;</span>, server_name=<span class="hljs-string">&quot;localhost&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\nList connections:&quot;</span>)
<span class="hljs-built_in">print</span>(connections.list_connections())
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
