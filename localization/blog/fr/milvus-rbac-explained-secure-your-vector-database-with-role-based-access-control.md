---
id: >-
  milvus-rbac-explained-secure-your-vector-database-with-role-based-access-control.md
title: >-
  Milvus RBAC expliqué : Sécurisez votre base de données Vector avec le contrôle
  d'accès basé sur les rôles
author: Juan Xu
date: 2025-12-31T00:00:00.000Z
cover: assets.zilliz.com/RBAC_in_Milvus_Cover_1fe181b31d.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, RBAC, access control, vector database security'
meta_title: |
  Milvus RBAC Guide: How to Control Access to Your Vector Database
desc: >-
  Découvrez l'importance du RBAC, le fonctionnement du RBAC dans Milvus, la
  configuration du contrôle d'accès et la manière dont il permet un accès avec
  le moins de privilèges possible, une séparation claire des rôles et des
  opérations de production sûres.
origin: >-
  https://milvus.io/blog/milvus-rbac-explained-secure-your-vector-database-with-role-based-access-control.md
---
<p>Lors de la construction d'un système de base de données, les ingénieurs consacrent la majeure partie de leur temps aux performances : types d'index, rappel, latence, débit et mise à l'échelle. Mais dès qu'un système dépasse l'ordinateur portable d'un seul développeur, une autre question devient tout aussi cruciale : <strong>qui peut faire quoi dans votre cluster Milvus</strong>? En d'autres termes, le contrôle d'accès.</p>
<p>Dans l'ensemble du secteur, de nombreux incidents opérationnels découlent de simples erreurs d'autorisation. Un script s'exécute dans le mauvais environnement. Un compte de service dispose d'un accès plus large que prévu. Un identifiant d'administrateur partagé se retrouve dans l'interface utilisateur. Ces problèmes apparaissent généralement sous la forme de questions très pratiques :</p>
<ul>
<li><p>Les développeurs sont-ils autorisés à supprimer des collections de production ?</p></li>
<li><p>Pourquoi un compte de test peut-il lire les données vectorielles de production ?</p></li>
<li><p>Pourquoi plusieurs services se connectent-ils avec le même rôle d'administrateur ?</p></li>
<li><p>Les tâches d'analyse peuvent-elles avoir un accès en lecture seule avec des privilèges d'écriture nuls ?</p></li>
</ul>
<p><a href="https://milvus.io/">Milvus</a> relève ces défis grâce au <a href="https://milvus.io/docs/rbac.md">contrôle d'accès basé sur les rôles (RBAC)</a>. Au lieu de donner à chaque utilisateur des droits de superadministrateur ou d'essayer d'appliquer des restrictions dans le code de l'application, le RBAC vous permet de définir des autorisations précises au niveau de la base de données. Chaque utilisateur ou service obtient exactement les capacités dont il a besoin, rien de plus.</p>
<p>Ce billet explique comment fonctionne le RBAC dans Milvus, comment le configurer et comment l'appliquer en toute sécurité dans les environnements de production.</p>
<h2 id="Why-Access-Control-Matters-When-Using-Milvus" class="common-anchor-header">Pourquoi le contrôle d'accès est important lors de l'utilisation de Milvus<button data-href="#Why-Access-Control-Matters-When-Using-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Lorsque les équipes sont petites et que leurs applications d'IA ne servent qu'un nombre limité d'utilisateurs, l'infrastructure est généralement simple. Quelques ingénieurs gèrent le système, Milvus n'est utilisé que pour le développement ou les tests et les flux de travail opérationnels sont simples. Dans cette phase initiale, le contrôle d'accès semble rarement urgent, car la surface de risque est faible et toute erreur peut être facilement corrigée.</p>
<p>Lorsque Milvus passe en production et que le nombre d'utilisateurs, de services et d'opérateurs augmente, le modèle d'utilisation change rapidement. Les scénarios les plus courants sont les suivants</p>
<ul>
<li><p>Plusieurs systèmes commerciaux partageant la même instance de Milvus</p></li>
<li><p>Plusieurs équipes accédant aux mêmes collections de vecteurs</p></li>
<li><p>Des données de test, de mise en scène et de production coexistant dans un seul cluster</p></li>
<li><p>Différents rôles nécessitant différents niveaux d'accès, depuis les requêtes en lecture seule jusqu'aux écritures et au contrôle opérationnel.</p></li>
</ul>
<p>Sans limites d'accès bien définies, ces configurations créent des risques prévisibles :</p>
<ul>
<li><p>les flux de travail de test peuvent accidentellement supprimer des collections de production</p></li>
<li><p>Les développeurs peuvent modifier involontairement les index utilisés par les services en direct.</p></li>
<li><p>L'utilisation généralisée du compte <code translate="no">root</code> rend les actions impossibles à tracer ou à auditer.</p></li>
<li><p>Une application compromise peut obtenir un accès illimité à toutes les données vectorielles.</p></li>
</ul>
<p>Au fur et à mesure que l'utilisation augmente, il n'est plus possible de s'appuyer sur des conventions informelles ou sur des comptes d'administration partagés. Un modèle d'accès cohérent et applicable devient essentiel, et c'est exactement ce que fournit le système RBAC de Milvus.</p>
<h2 id="What-is-RBAC-in-Milvus" class="common-anchor-header">Qu'est-ce que le RBAC dans Milvus ?<button data-href="#What-is-RBAC-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Le<a href="https://milvus.io/docs/rbac.md">RBAC (Role-Based Access Control)</a> est un modèle de permission qui contrôle l'accès en fonction des <strong>rôles</strong> plutôt que des utilisateurs individuels. Dans Milvus, le RBAC vous permet de définir exactement les opérations qu'un utilisateur ou un service est autorisé à effectuer et sur quelles ressources spécifiques. Il s'agit d'un moyen structuré et évolutif de gérer la sécurité au fur et à mesure que votre système passe d'un simple développeur à un environnement de production complet.</p>
<p>Milvus RBAC s'articule autour des composants de base suivants :</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/users_roles_privileges_030620f913.png" alt="Users Roles Privileges" class="doc-image" id="users-roles-privileges" />
   </span> <span class="img-wrapper"> <span>Utilisateurs Rôles Privilèges</span> </span></p>
<ul>
<li><p><strong>Ressource</strong>: L'entité à laquelle on accède. Dans Milvus, les ressources comprennent l'<strong>instance</strong>, la <strong>base de données</strong> et la <strong>collection</strong>.</p></li>
<li><p><strong>Privilège</strong>: Une opération spécifique autorisée sur une ressource, par exemple la création d'une collection, l'insertion de données ou la suppression d'entités.</p></li>
<li><p><strong>Groupe de privilèges</strong>: Un ensemble prédéfini de privilèges connexes, tels que "lecture seule" ou "écriture".</p></li>
<li><p><strong>Rôle</strong>: Combinaison de privilèges et des ressources auxquelles ils s'appliquent. Un rôle détermine <em>quelles</em> opérations peuvent être effectuées et <em>où</em>.</p></li>
<li><p><strong>Utilisateur</strong>: Identité dans Milvus. Chaque utilisateur a un identifiant unique et se voit attribuer un ou plusieurs rôles.</p></li>
</ul>
<p>Ces éléments forment une hiérarchie claire :</p>
<ol>
<li><p><strong>Les utilisateurs se voient attribuer des rôles</strong></p></li>
<li><p><strong>Les rôles définissent les privilèges</strong></p></li>
<li><p><strong>Les privilèges s'appliquent à des ressources spécifiques.</strong></p></li>
</ol>
<p>L'un des principes clés de la conception de Milvus est que <strong>les autorisations ne sont jamais attribuées directement aux utilisateurs</strong>. Tous les accès passent par des rôles. Cette indirection simplifie l'administration, réduit les erreurs de configuration et rend les changements de permissions prévisibles.</p>
<p>Ce modèle s'adapte parfaitement aux déploiements réels. Lorsque plusieurs utilisateurs partagent un rôle, la mise à jour des privilèges du rôle met instantanément à jour les autorisations pour chacun d'entre eux, sans modifier chaque utilisateur individuellement. Il s'agit d'un point de contrôle unique aligné sur la manière dont l'infrastructure moderne gère l'accès.</p>
<h2 id="How-RBAC-Works-in-Milvus" class="common-anchor-header">Fonctionnement de RBAC dans Milvus<button data-href="#How-RBAC-Works-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Lorsqu'un client envoie une demande à Milvus, le système l'évalue par le biais d'une série d'étapes d'autorisation. Chaque étape doit être réussie avant que l'opération ne soit autorisée :</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_rbac_works_afe48bc717.png" alt="How RBAC Works in Milvus" class="doc-image" id="how-rbac-works-in-milvus" />
   </span> <span class="img-wrapper"> <span>Fonctionnement du système RBAC dans Milvus</span> </span></p>
<ol>
<li><p><strong>Authentifier la demande :</strong> Milvus vérifie d'abord l'identité de l'utilisateur. Si l'authentification échoue, la demande est rejetée avec une erreur d'authentification.</p></li>
<li><p><strong>Vérifier l'attribution des rôles :</strong> Après l'authentification, Milvus vérifie si l'utilisateur a au moins un rôle attribué. Si aucun rôle n'est trouvé, la demande est rejetée avec une erreur d'autorisation refusée.</p></li>
<li><p><strong>Vérifier les privilèges requis :</strong> Milvus évalue ensuite si le rôle de l'utilisateur accorde le privilège requis sur la ressource cible. Si la vérification des privilèges échoue, la demande est rejetée avec une erreur de refus de permission.</p></li>
<li><p><strong>Exécuter l'opération :</strong> Si tous les contrôles sont réussis, Milvus exécute l'opération demandée et renvoie le résultat.</p></li>
</ol>
<h2 id="How-to-Configure-Access-Control-via-RBAC-in-Milvus" class="common-anchor-header">Comment configurer le contrôle d'accès via RBAC dans Milvus ?<button data-href="#How-to-Configure-Access-Control-via-RBAC-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Prerequisites" class="common-anchor-header">1. Conditions préalables</h3><p>Avant que les règles RBAC puissent être évaluées et appliquées, l'authentification utilisateur doit être activée afin que chaque demande adressée à Milvus puisse être associée à une identité utilisateur spécifique.</p>
<p>Voici deux méthodes de déploiement standard.</p>
<ul>
<li><strong>Déploiement avec Docker Compose</strong></li>
</ul>
<p>Si Milvus est déployé à l'aide de Docker Compose, modifiez le fichier de configuration <code translate="no">milvus.yaml</code> et activez l'autorisation en définissant <code translate="no">common.security.authorizationEnabled</code> sur <code translate="no">true</code>:</p>
<pre><code translate="no"><span class="hljs-attr">common</span>:
  <span class="hljs-attr">security</span>:
    <span class="hljs-attr">authorizationEnabled</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Déploiement avec Helm Charts</strong></li>
</ul>
<p>Si Milvus est déployé à l'aide de Helm Charts, modifier le fichier <code translate="no">values.yaml</code> et ajouter la configuration suivante sous <code translate="no">extraConfigFiles.user.yaml</code>:</p>
<pre><code translate="no"><span class="hljs-attr">extraConfigFiles</span>:
  user.<span class="hljs-property">yaml</span>: |+
    <span class="hljs-attr">common</span>:
      <span class="hljs-attr">security</span>:
        <span class="hljs-attr">authorizationEnabled</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Initialization" class="common-anchor-header">2. Initialisation</h3><p>Par défaut, Milvus crée un utilisateur <code translate="no">root</code> au démarrage du système. Le mot de passe par défaut de cet utilisateur est <code translate="no">Milvus</code>.</p>
<p>Comme première mesure de sécurité, utiliser l'utilisateur <code translate="no">root</code> pour se connecter à Milvus et changer immédiatement le mot de passe par défaut. Il est fortement recommandé d'utiliser un mot de passe complexe pour empêcher tout accès non autorisé.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-comment"># Connect to Milvus using the default root user</span>
client = MilvusClient(
    uri=<span class="hljs-string">&#x27;http://localhost:19530&#x27;</span>, 
    token=<span class="hljs-string">&quot;root:Milvus&quot;</span>
)
<span class="hljs-comment"># Update the root password</span>
client.update_password(
    user_name=<span class="hljs-string">&quot;root&quot;</span>,
    old_password=<span class="hljs-string">&quot;Milvus&quot;</span>, 
    new_password=<span class="hljs-string">&quot;xgOoLudt3Kc#Pq68&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Core-Operations" class="common-anchor-header">3. Opérations principales</h3><p><strong>Création d'utilisateurs</strong></p>
<p>Pour une utilisation quotidienne, il est recommandé de créer des utilisateurs dédiés au lieu d'utiliser le compte <code translate="no">root</code>.</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>, password=<span class="hljs-string">&quot;P@ssw0rd&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Créer des rôles</strong></p>
<p>Milvus fournit un rôle <code translate="no">admin</code> intégré avec des privilèges administratifs complets. Cependant, pour la plupart des scénarios de production, il est recommandé de créer des rôles personnalisés afin d'obtenir un contrôle d'accès plus fin.</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Créer des groupes de privilèges</strong></p>
<p>Un groupe de privilèges est un ensemble de privilèges multiples. Pour simplifier la gestion des autorisations, des privilèges connexes peuvent être regroupés et accordés ensemble.</p>
<p>Milvus comprend les groupes de privilèges intégrés suivants :</p>
<ul>
<li><p><code translate="no">COLL_RO</code>, <code translate="no">COLL_RW</code>, <code translate="no">COLL_ADMIN</code></p></li>
<li><p><code translate="no">DB_RO</code>, <code translate="no">DB_RW</code>, <code translate="no">DB_ADMIN</code></p></li>
<li><p><code translate="no">Cluster_RO</code>, <code translate="no">Cluster_RW</code>, <code translate="no">Cluster_ADMIN</code></p></li>
</ul>
<p>L'utilisation de ces groupes de privilèges intégrés peut réduire considérablement la complexité de la conception des autorisations et améliorer la cohérence entre les rôles.</p>
<p>Vous pouvez utiliser directement les groupes de privilèges intégrés ou créer des groupes de privilèges personnalisés selon vos besoins.</p>
<pre><code translate="no"><span class="hljs-comment"># Create a privilege group</span>
client.create_privilege_group(group_name=<span class="hljs-string">&#x27;privilege_group_1&#x27;</span>）
<span class="hljs-comment"># Add privileges to the privilege group</span>
client.add_privileges_to_group(group_name=<span class="hljs-string">&#x27;privilege_group_1&#x27;</span>, privileges=[<span class="hljs-string">&#x27;Query&#x27;</span>, <span class="hljs-string">&#x27;Search&#x27;</span>])
<button class="copy-code-btn"></button></code></pre>
<p><strong>Octroi de privilèges ou de groupes de privilèges aux rôles</strong></p>
<p>Après la création d'un rôle, des privilèges ou des groupes de privilèges peuvent lui être accordés. Les ressources cibles pour ces privilèges peuvent être spécifiées à différents niveaux, y compris l'instance, la base de données ou les collections individuelles.</p>
<pre><code translate="no">client.<span class="hljs-title function_">grant_privilege_v2</span>(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;Search&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
client.<span class="hljs-title function_">grant_privilege_v2</span>(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;privilege_group_1&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
client.<span class="hljs-title function_">grant_privilege_v2</span>(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;ClusterReadOnly&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;*&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Attribution de rôles aux utilisateurs</strong></p>
<p>Une fois que des rôles sont attribués à un utilisateur, celui-ci peut accéder aux ressources et effectuer les opérations définies par ces rôles. Un même utilisateur peut se voir attribuer un ou plusieurs rôles, en fonction de l'étendue de l'accès requis.</p>
<pre><code translate="no">client.<span class="hljs-title function_">grant_role</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>, role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Inspect-and-Revoke-Access" class="common-anchor-header">4. Contrôler et révoquer l'accès</h3><p><strong>Contrôler les rôles attribués à un utilisateur</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">describe_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Inspecter les privilèges attribués à un rôle</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">describe_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Révoquer les privilèges d'un rôle</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">revoke_privilege_v2</span>(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;Search&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
client.<span class="hljs-title function_">revoke_privilege_v2</span>(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;privilege_group_1&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Révoquer les rôles d'un utilisateur</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">revoke_role</span>(
    user_name=<span class="hljs-string">&#x27;user_1&#x27;</span>,
    role_name=<span class="hljs-string">&#x27;role_a&#x27;</span>
)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Supprimer des utilisateurs et des rôles</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">drop_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>)
client.<span class="hljs-title function_">drop_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Example-Access-Control-Design-for-a-Milvus-Powered-RAG-System" class="common-anchor-header">Exemple : Conception du contrôle d'accès pour un système RAG alimenté par Milvus<button data-href="#Example-Access-Control-Design-for-a-Milvus-Powered-RAG-System" class="anchor-icon" translate="no">
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
    </button></h2><p>Considérons un système RAG (Retrieval-Augmented Generation) construit au-dessus de Milvus.</p>
<p>Dans ce système, les différents composants et utilisateurs ont des responsabilités clairement séparées et chacun nécessite un niveau d'accès différent.</p>
<table>
<thead>
<tr><th>Acteur</th><th>Responsabilité</th><th>Accès requis</th></tr>
</thead>
<tbody>
<tr><td>Administrateur de la plate-forme</td><td>Opérations et configuration du système</td><td>Administration au niveau de l'instance</td></tr>
<tr><td>Service d'ingestion de vecteurs</td><td>Ingestion et mise à jour des données vectorielles</td><td>Accès en lecture et en écriture</td></tr>
<tr><td>Service de recherche</td><td>Recherche et récupération de données vectorielles</td><td>Accès en lecture seule</td></tr>
</tbody>
</table>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
client = MilvusClient(
    uri=<span class="hljs-string">&#x27;http://localhost:19530&#x27;</span>,
    token=<span class="hljs-string">&quot;root:xxx&quot;</span>  <span class="hljs-comment"># Replace with the updated root password</span>
)
<span class="hljs-comment"># 1. Create a user (use a strong password)</span>
client.create_user(user_name=<span class="hljs-string">&quot;rag_admin&quot;</span>, password=<span class="hljs-string">&quot;xxx&quot;</span>)
client.create_user(user_name=<span class="hljs-string">&quot;rag_reader&quot;</span>, password=<span class="hljs-string">&quot;xxx&quot;</span>)
client.create_user(user_name=<span class="hljs-string">&quot;rag_writer&quot;</span>, password=<span class="hljs-string">&quot;xxx&quot;</span>)
<span class="hljs-comment"># 2. Create roles</span>
client.create_role(role_name=<span class="hljs-string">&quot;role_admin&quot;</span>)
client.create_role(role_name=<span class="hljs-string">&quot;role_read_only&quot;</span>)
client.create_role(role_name=<span class="hljs-string">&quot;role_read_write&quot;</span>)
<span class="hljs-comment"># 3. Grant privileges to the role</span>
<span class="hljs-comment">## Using built-in Milvus privilege groups</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_admin&quot;</span>,
    privilege=<span class="hljs-string">&quot;Cluster_Admin&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;*&#x27;</span>,
)
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_read_only&quot;</span>,
    privilege=<span class="hljs-string">&quot;COLL_RO&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_read_write&quot;</span>,
    privilege=<span class="hljs-string">&quot;COLL_RW&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
<span class="hljs-comment"># 4. Assign the role to the user</span>
client.grant_role(user_name=<span class="hljs-string">&quot;rag_admin&quot;</span>, role_name=<span class="hljs-string">&quot;role_admin&quot;</span>)
client.grant_role(user_name=<span class="hljs-string">&quot;rag_reader&quot;</span>, role_name=<span class="hljs-string">&quot;role_read_only&quot;</span>)
client.grant_role(user_name=<span class="hljs-string">&quot;rag_writer&quot;</span>, role_name=<span class="hljs-string">&quot;role_read_write&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Quick-Tips-How-to-Operate-Access-Control-Safely-in-Production" class="common-anchor-header">Conseils rapides : Comment utiliser le contrôle d'accès en toute sécurité dans la production<button data-href="#Quick-Tips-How-to-Operate-Access-Control-Safely-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Pour s'assurer que le contrôle d'accès reste efficace et gérable dans les systèmes de production à long terme, il convient de suivre les conseils pratiques suivants.</p>
<p><strong>1. Modifier</strong> <strong>le mot de passe</strong><strong>par défaut</strong> <code translate="no">root</code> <strong>et limiter l'utilisation du</strong> <strong>compte</strong> <code translate="no">root</code>.</p>
<p>Mettez à jour le mot de passe par défaut <code translate="no">root</code> immédiatement après l'initialisation et limitez son utilisation aux seules tâches administratives. Évitez d'utiliser ou de partager le compte root pour les opérations de routine. Au lieu de cela, créez des utilisateurs et des rôles dédiés pour l'accès quotidien afin de réduire les risques et d'améliorer la responsabilité.</p>
<p><strong>2. Isoler physiquement les instances Milvus dans les différents environnements</strong></p>
<p>Déployer des instances Milvus distinctes pour le développement, la mise en scène et la production. L'isolation physique fournit une limite de sécurité plus forte que le contrôle d'accès logique seul et réduit considérablement le risque d'erreurs entre les environnements.</p>
<p><strong>3. Suivre le principe du moindre privilège</strong></p>
<p>N'accordez que les autorisations nécessaires à chaque rôle :</p>
<ul>
<li><p><strong>Environnements de développement :</strong> les autorisations peuvent être plus permissives pour favoriser l'itération et les tests.</p></li>
<li><p><strong>Environnements de production :</strong> les autorisations doivent être strictement limitées à ce qui est nécessaire.</p></li>
<li><p><strong>Audits réguliers :</strong> revoir périodiquement les autorisations existantes pour s'assurer qu'elles sont toujours nécessaires.</p></li>
</ul>
<p><strong>4. Révoquer activement les autorisations lorsqu'elles ne sont plus nécessaires</strong></p>
<p>Le contrôle d'accès n'est pas une opération ponctuelle, il nécessite une maintenance permanente. Révoquez rapidement les rôles et les privilèges lorsque les utilisateurs, les services ou les responsabilités changent. Cela permet d'éviter que les autorisations inutilisées ne s'accumulent au fil du temps et ne deviennent des risques de sécurité cachés.</p>
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
    </button></h2><p>La configuration du contrôle d'accès dans Milvus n'est pas complexe en soi, mais elle est essentielle pour que le système fonctionne de manière sûre et fiable en production. Avec un modèle RBAC bien conçu, vous pouvez :</p>
<ul>
<li><p><strong>réduire les risques</strong> en empêchant les opérations accidentelles ou destructrices</p></li>
<li><p><strong>Améliorer la sécurité</strong> en imposant un accès aux données vectorielles avec le moins de privilèges possible.</p></li>
<li><p><strong>normaliser les opérations</strong> en séparant clairement les responsabilités</p></li>
<li><p><strong>Évoluer en toute confiance</strong>, en jetant les bases de déploiements multi-locataires et à grande échelle.</p></li>
</ul>
<p>Le contrôle d'accès n'est pas une fonction optionnelle ou une tâche ponctuelle. Il s'agit d'un élément fondamental pour exploiter Milvus en toute sécurité sur le long terme.</p>
<p>👉 Commencez à construire une base de sécurité solide avec <a href="https://milvus.io/docs/rbac.md">RBAC</a> pour votre déploiement Milvus.</p>
<p>Vous avez des questions ou souhaitez approfondir l'une des fonctionnalités de la dernière version de Milvus ? Rejoignez notre<a href="https://discord.com/invite/8uyFbECzPX"> canal Discord</a> ou déposez des problèmes sur<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Vous pouvez également réserver une session individuelle de 20 minutes pour obtenir des informations, des conseils et des réponses à vos questions dans le cadre des<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
