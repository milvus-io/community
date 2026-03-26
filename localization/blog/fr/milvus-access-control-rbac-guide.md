---
id: milvus-access-control-rbac-guide.md
title: 'Guide du contrôle d''accès Milvus : Comment configurer RBAC pour la production'
author: Jack Li and Juan Xu
date: 2026-3-26
cover: assets.zilliz.com/cover_access_control_2_3e211dd48b.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus access control, Milvus RBAC, vector database security, Milvus privilege
  groups, Milvus production setup
meta_title: |
  Milvus Access Control: Configure RBAC for Production
desc: >-
  Guide étape par étape pour la mise en place de Milvus RBAC en production -
  utilisateurs, rôles, groupes de privilèges, accès au niveau de la collection,
  et un exemple complet de système RAG.
origin: 'https://milvus.io/blog/milvus-access-control-rbac-guide.md'
---
<p>Voici une histoire qui est plus fréquente qu'elle ne devrait l'être : un ingénieur de l'assurance qualité exécute un script de nettoyage sur ce qu'il pense être l'environnement de mise à disposition. Sauf que la chaîne de connexion pointe vers la production. Quelques secondes plus tard, les collections de vecteurs de base ont disparu - données de caractéristiques perdues, <a href="https://zilliz.com/glossary/similarity-search">recherche de similarité</a> renvoyant des résultats vides, services se dégradant dans tous les domaines. L'autopsie révèle la même cause première que d'habitude : tout le monde se connectait en tant que <code translate="no">root</code>, il n'y avait pas de limites d'accès et rien n'empêchait un compte de test de laisser tomber des données de production.</p>
<p>Il ne s'agit pas d'un cas unique. Les équipes qui travaillent sur <a href="https://milvus.io/">Milvus</a> - et les <a href="https://zilliz.com/learn/what-is-a-vector-database">bases de données vectorielles</a> en général - ont tendance à se concentrer sur les <a href="https://zilliz.com/learn/vector-index">performances de l'index</a>, le débit et l'échelle des données, tout en considérant le contrôle d'accès comme une question à régler plus tard. Mais "plus tard" arrive généralement sous la forme d'un incident. Alors que Milvus passe du stade de prototype à celui d'épine dorsale des <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">pipelines RAG de</a> production, des moteurs de recommandation et de la <a href="https://zilliz.com/learn/what-is-vector-search">recherche vectorielle</a> en temps réel, la question devient inévitable : qui peut accéder à votre cluster Milvus et qu'est-ce qu'il est autorisé à faire exactement ?</p>
<p>Milvus comprend un système RBAC intégré pour répondre à cette question. Ce guide explique ce qu'est le système RBAC, comment Milvus le met en œuvre et comment concevoir un modèle de contrôle d'accès qui assure la sécurité de la production - avec des exemples de code et une présentation complète du système RAG.</p>
<h2 id="What-Is-RBAC-Role-Based-Access-Control" class="common-anchor-header">Qu'est-ce que le RBAC (Role-Based Access Control) ?<button data-href="#What-Is-RBAC-Role-Based-Access-Control" class="anchor-icon" translate="no">
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
    </button></h2><p>Le<strong>contrôle d'accès basé sur les rôles (RBAC)</strong> est un modèle de sécurité dans lequel les autorisations ne sont pas attribuées directement aux utilisateurs individuels. Au lieu de cela, les autorisations sont regroupées en rôles et les utilisateurs se voient attribuer un ou plusieurs rôles. L'accès effectif d'un utilisateur est l'union de toutes les autorisations des rôles qui lui ont été attribués. Le RBAC est le modèle de contrôle d'accès standard dans les systèmes de base de données de production - PostgreSQL, MySQL, MongoDB et la plupart des services en nuage l'utilisent.</p>
<p>Le RBAC résout un problème fondamental de mise à l'échelle : lorsque vous avez des dizaines d'utilisateurs et de services, la gestion des autorisations par utilisateur devient impossible à maintenir. Avec RBAC, vous définissez un rôle une seule fois (par exemple, "lecture seule sur la collection X"), vous l'affectez à dix services et vous le mettez à jour en un seul endroit lorsque les besoins changent.</p>
<h2 id="How-Does-Milvus-Implement-RBAC" class="common-anchor-header">Comment Milvus met-il en œuvre le RBAC ?<button data-href="#How-Does-Milvus-Implement-RBAC" class="anchor-icon" translate="no">
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
    </button></h2><p>Le système RBAC de Milvus repose sur quatre concepts :</p>
<table>
<thead>
<tr><th>Concept</th><th>Ce que c'est</th><th>Exemple</th></tr>
</thead>
<tbody>
<tr><td><strong>Ressource</strong></td><td>Ce à quoi on accède</td><td>Une <a href="https://milvus.io/docs/architecture_overview.md">instance Milvus</a>, une <a href="https://milvus.io/docs/manage-databases.md">base de données</a> ou une collection spécifique.</td></tr>
<tr><td><strong>Privilège / Groupe de privilèges</strong></td><td>L'action effectuée</td><td><code translate="no">Search</code>Un groupe de privilèges, <code translate="no">Insert</code>, <code translate="no">DropCollection</code>, ou un groupe comme <code translate="no">COLL_RO</code> (collection en lecture seule)</td></tr>
<tr><td><strong>Rôle</strong></td><td>Un ensemble nommé de privilèges liés à des ressources.</td><td><code translate="no">role_read_only</code>Rôle : peut rechercher et interroger toutes les collections de la base de données <code translate="no">default</code> </td></tr>
<tr><td><strong>Utilisateur</strong></td><td>Un compte Milvus (humain ou service)</td><td><code translate="no">rag_writer</code>Compte de service utilisé par le pipeline d'ingestion</td></tr>
</tbody>
</table>
<p>L'accès n'est jamais attribué directement aux utilisateurs. Les utilisateurs obtiennent des rôles, les rôles contiennent des privilèges et les privilèges sont liés aux ressources. Il s'agit du même <a href="https://zilliz.com/blog/milvus-2-5-rbac-enhancements">modèle RBAC</a> que celui utilisé dans la plupart des systèmes de base de données de production. Si dix utilisateurs partagent le même rôle, vous mettez à jour le rôle une seule fois et la modification s'applique à tous.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_access_control_rbac_guide_1_c872ea8932.png" alt="Milvus RBAC model showing how Users are assigned to Roles, and Roles contain Privileges and Privilege Groups that apply to Resources" class="doc-image" id="milvus-rbac-model-showing-how-users-are-assigned-to-roles,-and-roles-contain-privileges-and-privilege-groups-that-apply-to-resources" />
   </span> <span class="img-wrapper"> <span>Modèle RBAC de Milvus montrant comment les utilisateurs sont affectés à des rôles, et les rôles contiennent des privilèges et des groupes de privilèges qui s'appliquent aux ressources.</span> </span></p>
<p>Lorsqu'une demande parvient à Milvus, elle est soumise à trois contrôles :</p>
<ol>
<li><strong>Authentification</strong> - s'agit-il d'un utilisateur valide avec des informations d'identification correctes ?</li>
<li><strong>Vérification du rôle</strong> - cet utilisateur a-t-il au moins un rôle attribué ?</li>
<li><strong>Vérification des privilèges</strong> - l'un des rôles de l'utilisateur permet-il d'effectuer l'action demandée sur la ressource demandée ?</li>
</ol>
<p>Si l'une des vérifications échoue, la demande est rejetée.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/milvus_access_control_rbac_guide_2_2275b37ea6.png" alt="Milvus authentication and authorization flow: Client Request goes through Authentication, Role Check, and Privilege Check — rejected at any failed step, executed only if all pass" class="doc-image" id="milvus-authentication-and-authorization-flow:-client-request-goes-through-authentication,-role-check,-and-privilege-check-—-rejected-at-any-failed-step,-executed-only-if-all-pass" />
   <span>Flux d'authentification et d'autorisation Milvus : La demande du client passe par l'authentification, la vérification du rôle et la vérification des privilèges - rejetée à chaque étape échouée, exécutée uniquement si toutes les étapes sont réussies.</span> </span></p>
<h2 id="How-to-Enable-Authentication-in-Milvus" class="common-anchor-header">Comment activer l'authentification dans Milvus ?<button data-href="#How-to-Enable-Authentication-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Par défaut, Milvus fonctionne avec l'authentification désactivée - chaque connexion a un accès complet. La première étape consiste à l'activer.</p>
<h3 id="Docker-Compose" class="common-anchor-header">Docker Compose</h3><p>Modifiez <code translate="no">milvus.yaml</code> et définissez <code translate="no">authorizationEnabled</code> à <code translate="no">true</code>:</p>
<pre><code translate="no"><span class="hljs-attr">common</span>:
  <span class="hljs-attr">security</span>:
    <span class="hljs-attr">authorizationEnabled</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Helm-Charts" class="common-anchor-header">Cartes Helm</h3><p>Modifiez <code translate="no">values.yaml</code> et ajoutez le paramètre sous <code translate="no">extraConfigFiles</code>:</p>
<pre><code translate="no"><span class="hljs-attr">extraConfigFiles</span>:
  user.<span class="hljs-property">yaml</span>: |+
    <span class="hljs-attr">common</span>:
      <span class="hljs-attr">security</span>:
        <span class="hljs-attr">authorizationEnabled</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<p>Pour les déploiements de <a href="https://milvus.io/docs/install_cluster-milvusoperator.md">Milvus Operator</a> sur <a href="https://milvus.io/docs/prerequisite-helm.md">Kubernetes</a>, la même configuration va dans la section <code translate="no">spec.config</code> du Milvus CR.</p>
<p>Une fois l'authentification activée et Milvus redémarré, chaque connexion doit fournir des informations d'identification. Milvus crée un utilisateur par défaut <code translate="no">root</code> avec le mot de passe <code translate="no">Milvus</code> - modifiez-le immédiatement.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

<span class="hljs-comment"># Connect with the default root account</span>
client = MilvusClient(
    uri=<span class="hljs-string">&#x27;http://localhost:19530&#x27;</span>,
    token=<span class="hljs-string">&quot;root:Milvus&quot;</span>
)

<span class="hljs-comment"># Change the password</span>
client.update_password(
    user_name=<span class="hljs-string">&quot;root&quot;</span>,
    old_password=<span class="hljs-string">&quot;Milvus&quot;</span>,
    new_password=<span class="hljs-string">&quot;xgOoLudt3Kc#Pq68&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="How-to-Configure-Users-Roles-and-Privileges" class="common-anchor-header">Configuration des utilisateurs, des rôles et des privilèges<button data-href="#How-to-Configure-Users-Roles-and-Privileges" class="anchor-icon" translate="no">
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
    </button></h2><p>Lorsque l'authentification est activée, voici le processus d'installation typique.</p>
<h3 id="Step-1-Create-Users" class="common-anchor-header">Étape 1 : Créer des utilisateurs</h3><p>Ne laissez pas les services ou les membres de l'équipe utiliser <code translate="no">root</code>. Créez des comptes dédiés à chaque utilisateur ou service.</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>, password=<span class="hljs-string">&quot;P@ssw0rd&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Create-Roles" class="common-anchor-header">Etape 2 : Créer des rôles</h3><p>Milvus dispose d'un rôle <code translate="no">admin</code> intégré, mais dans la pratique, vous voudrez des rôles personnalisés qui correspondent à vos schémas d'accès réels.</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Create-Privilege-Groups" class="common-anchor-header">Étape 3 : Créer des groupes de privilèges</h3><p>Un groupe de privilèges regroupe plusieurs privilèges sous un même nom, ce qui facilite la gestion de l'accès à grande échelle. Milvus fournit 9 groupes de privilèges intégrés :</p>
<table>
<thead>
<tr><th>Groupe intégré</th><th>Champ d'application</th><th>Ce qu'il permet</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">COLL_RO</code></td><td>Collection</td><td>Opérations en lecture seule (requête, recherche, etc.)</td></tr>
<tr><td><code translate="no">COLL_RW</code></td><td>Collection</td><td>Opérations de lecture et d'écriture</td></tr>
<tr><td><code translate="no">COLL_Admin</code></td><td>Collection</td><td>Gestion complète de la collection</td></tr>
<tr><td><code translate="no">DB_RO</code></td><td>Base de données</td><td>Opérations en lecture seule sur la base de données</td></tr>
<tr><td><code translate="no">DB_RW</code></td><td>Base de données</td><td>Opérations de lecture et d'écriture sur la base de données</td></tr>
<tr><td><code translate="no">DB_Admin</code></td><td>Base de données</td><td>Gestion complète de la base de données</td></tr>
<tr><td><code translate="no">Cluster_RO</code></td><td>Cluster</td><td>Opérations en lecture seule sur le cluster</td></tr>
<tr><td><code translate="no">Cluster_RW</code></td><td>Cluster</td><td>Opérations de lecture et d'écriture sur le cluster</td></tr>
<tr><td><code translate="no">Cluster_Admin</code></td><td>Cluster</td><td>Gestion complète de la grappe</td></tr>
</tbody>
</table>
<p>Vous pouvez également créer des groupes de privilèges personnalisés lorsque les groupes intégrés ne conviennent pas :</p>
<pre><code translate="no"><span class="hljs-comment"># Create a privilege group</span>
client.create_privilege_group(group_name=<span class="hljs-string">&#x27;privilege_group_1&#x27;</span>)

<span class="hljs-comment"># Add privileges to the group</span>
client.add_privileges_to_group(
    group_name=<span class="hljs-string">&#x27;privilege_group_1&#x27;</span>,
    privileges=[<span class="hljs-string">&#x27;Query&#x27;</span>, <span class="hljs-string">&#x27;Search&#x27;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Grant-Privileges-to-a-Role" class="common-anchor-header">Étape 4 : Octroi de privilèges à un rôle</h3><p>Accordez des privilèges individuels ou des groupes de privilèges à un rôle, en fonction de ressources spécifiques. Les paramètres <code translate="no">collection_name</code> et <code translate="no">db_name</code> contrôlent l'étendue des privilèges - utilisez <code translate="no">*</code> pour tous.</p>
<pre><code translate="no"><span class="hljs-comment"># Grant a single privilege</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;Search&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)

<span class="hljs-comment"># Grant a privilege group</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;privilege_group_1&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)

<span class="hljs-comment"># Grant a cluster-level privilege (* means all resources)</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;ClusterReadOnly&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;*&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-5-Assign-Roles-to-Users" class="common-anchor-header">Étape 5 : Attribuer des rôles aux utilisateurs</h3><p>Un utilisateur peut avoir plusieurs rôles. Ses autorisations effectives sont la somme de tous les rôles qui lui ont été attribués.</p>
<pre><code translate="no">client.<span class="hljs-title function_">grant_role</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>, role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h2 id="How-to-Audit-and-Revoke-Access" class="common-anchor-header">Comment auditer et révoquer l'accès<button data-href="#How-to-Audit-and-Revoke-Access" class="anchor-icon" translate="no">
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
    </button></h2><p>Il est tout aussi important de connaître les accès existants que de les accorder. Les autorisations périmées - provenant d'anciens membres de l'équipe, de services retirés ou de sessions de débogage ponctuelles - s'accumulent silencieusement et élargissent la surface d'attaque.</p>
<h3 id="Check-Current-Permissions" class="common-anchor-header">Vérifier les autorisations actuelles</h3><p>Affichez les rôles attribués à un utilisateur :</p>
<pre><code translate="no">client.<span class="hljs-title function_">describe_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Afficher les privilèges accordés à un rôle :</p>
<pre><code translate="no">client.<span class="hljs-title function_">describe_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Revoke-Privileges-from-a-Role" class="common-anchor-header">Révoquer les privilèges d'un rôle</h3><pre><code translate="no"><span class="hljs-comment"># Remove a single privilege</span>
client.revoke_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;Search&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)

<span class="hljs-comment"># Remove a privilege group</span>
client.revoke_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;privilege_group_1&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Unassign-a-Role-from-a-User" class="common-anchor-header">Annuler l'attribution d'un rôle à un utilisateur</h3><pre><code translate="no">client.<span class="hljs-title function_">revoke_role</span>(
    user_name=<span class="hljs-string">&#x27;user_1&#x27;</span>,
    role_name=<span class="hljs-string">&#x27;role_a&#x27;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Delete-Users-or-Roles" class="common-anchor-header">Supprimer des utilisateurs ou des rôles</h3><p>Supprimez toutes les attributions de rôle avant de supprimer un utilisateur, et révoquez tous les privilèges avant de supprimer un rôle :</p>
<pre><code translate="no">client.<span class="hljs-title function_">drop_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>)
client.<span class="hljs-title function_">drop_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Example-How-to-Design-RBAC-for-a-Production-RAG-System" class="common-anchor-header">Exemple : Comment concevoir un système RBAC pour un système RAG de production<button data-href="#Example-How-to-Design-RBAC-for-a-Production-RAG-System" class="anchor-icon" translate="no">
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
    </button></h2><p>Les concepts abstraits s'expliquent plus rapidement à l'aide d'un exemple concret. Considérons un système <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> construit sur Milvus avec trois services distincts :</p>
<table>
<thead>
<tr><th>Service</th><th>Responsabilité</th><th>Accès requis</th></tr>
</thead>
<tbody>
<tr><td><strong>Administrateur de la plate-forme</strong></td><td>Gère le cluster Milvus - crée des collections, surveille l'état de santé, gère les mises à niveau.</td><td>Administrateur complet du cluster</td></tr>
<tr><td><strong>Service d'ingestion</strong></td><td>Génère des <a href="https://zilliz.com/glossary/vector-embeddings">encastrements vectoriels</a> à partir de documents et les écrit dans des collections.</td><td>Lecture et écriture sur les collections</td></tr>
<tr><td><strong>Service de recherche</strong></td><td>Traite les requêtes de <a href="https://zilliz.com/learn/what-is-vector-search">recherche vectorielle</a> des utilisateurs finaux</td><td>Lecture seule sur les collections</td></tr>
</tbody>
</table>
<p>Voici une configuration complète utilisant <a href="https://milvus.io/docs/install-pymilvus.md">PyMilvus</a>:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

client = MilvusClient(
    uri=<span class="hljs-string">&#x27;http://localhost:19530&#x27;</span>,
    token=<span class="hljs-string">&quot;root:xxx&quot;</span>  <span class="hljs-comment"># Replace with your updated root password</span>
)

<span class="hljs-comment"># 1. Create users</span>
client.create_user(user_name=<span class="hljs-string">&quot;rag_admin&quot;</span>, password=<span class="hljs-string">&quot;xxx&quot;</span>)
client.create_user(user_name=<span class="hljs-string">&quot;rag_reader&quot;</span>, password=<span class="hljs-string">&quot;xxx&quot;</span>)
client.create_user(user_name=<span class="hljs-string">&quot;rag_writer&quot;</span>, password=<span class="hljs-string">&quot;xxx&quot;</span>)

<span class="hljs-comment"># 2. Create roles</span>
client.create_role(role_name=<span class="hljs-string">&quot;role_admin&quot;</span>)
client.create_role(role_name=<span class="hljs-string">&quot;role_read_only&quot;</span>)
client.create_role(role_name=<span class="hljs-string">&quot;role_read_write&quot;</span>)

<span class="hljs-comment"># 3. Grant access to roles</span>

<span class="hljs-comment"># Admin role: cluster-level admin access</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_admin&quot;</span>,
    privilege=<span class="hljs-string">&quot;Cluster_Admin&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;*&#x27;</span>,
)

<span class="hljs-comment"># Read-only role: collection-level read-only access</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_read_only&quot;</span>,
    privilege=<span class="hljs-string">&quot;COLL_RO&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)

<span class="hljs-comment"># Read-write role: collection-level read and write access</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_read_write&quot;</span>,
    privilege=<span class="hljs-string">&quot;COLL_RW&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)

<span class="hljs-comment"># 4. Assign roles to users</span>
client.grant_role(user_name=<span class="hljs-string">&quot;rag_admin&quot;</span>, role_name=<span class="hljs-string">&quot;role_admin&quot;</span>)
client.grant_role(user_name=<span class="hljs-string">&quot;rag_reader&quot;</span>, role_name=<span class="hljs-string">&quot;role_read_only&quot;</span>)
client.grant_role(user_name=<span class="hljs-string">&quot;rag_writer&quot;</span>, role_name=<span class="hljs-string">&quot;role_read_write&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Chaque service obtient exactement l'accès dont il a besoin. Le service de recherche ne peut pas supprimer accidentellement des données. Le service d'ingestion ne peut pas modifier les paramètres du cluster. Et si les informations d'identification du service de recherche fuient, l'attaquant peut lire les <a href="https://zilliz.com/glossary/vector-embeddings">vecteurs d'intégration</a>, mais ne peut pas écrire, supprimer ou accéder au poste d'administrateur.</p>
<p>Pour les équipes qui gèrent l'accès sur plusieurs déploiements Milvus, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (Milvus géré) fournit un RBAC intégré avec une console web pour gérer les utilisateurs, les rôles et les autorisations - aucun script n'est nécessaire. Utile lorsque vous préférez gérer l'accès par le biais d'une interface utilisateur plutôt que de maintenir des scripts de configuration dans les différents environnements.</p>
<h2 id="Access-Control-Best-Practices-for-Production" class="common-anchor-header">Meilleures pratiques de contrôle d'accès pour la production<button data-href="#Access-Control-Best-Practices-for-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Les étapes d'installation ci-dessus sont les mécanismes. Voici les principes de conception qui garantissent l'efficacité du contrôle d'accès au fil du temps.</p>
<h3 id="Lock-Down-the-Root-Account" class="common-anchor-header">Verrouiller le compte racine</h3><p>Modifiez d'abord le mot de passe par défaut de <code translate="no">root</code>. En production, le compte root ne doit être utilisé que pour les opérations d'urgence et stocké dans un gestionnaire de secrets - et non codé en dur dans les configurations d'application ou partagé sur Slack.</p>
<h3 id="Separate-Environments-Completely" class="common-anchor-header">Séparer complètement les environnements</h3><p>Utiliser des <a href="https://milvus.io/docs/architecture_overview.md">instances Milvus</a> différentes pour le développement, la mise en scène et la production. La séparation des environnements par le seul RBAC est fragile - une chaîne de connexion mal configurée et un service de développement écrit sur des données de production. La séparation physique (clusters différents, identifiants différents) élimine totalement ce type d'incident.</p>
<h3 id="Apply-Least-Privilege" class="common-anchor-header">Appliquer le principe du moindre privilège</h3><p>Donnez à chaque utilisateur et à chaque service l'accès minimum nécessaire pour faire son travail. Commencez par un accès restreint et n'élargissez l'accès qu'en cas de besoin spécifique et documenté. Dans les environnements de développement, vous pouvez être plus détendu, mais l'accès à la production doit être strict et revu régulièrement.</p>
<h3 id="Clean-Up-Stale-Access" class="common-anchor-header">Nettoyer les accès périmés</h3><p>Lorsque quelqu'un quitte l'équipe ou qu'un service est mis hors service, révoquez ses rôles et supprimez ses comptes immédiatement. Les comptes inutilisés avec des permissions actives sont le vecteur le plus courant d'accès non autorisé - il s'agit d'informations d'identification valides que personne ne surveille.</p>
<h3 id="Scope-Privileges-to-Specific-Collections" class="common-anchor-header">Étendre les privilèges à des collections spécifiques</h3><p>Évitez d'accorder <code translate="no">collection_name='*'</code> à moins que le rôle n'ait réellement besoin d'accéder à toutes les collections. Dans les configurations multi-locataires ou les systèmes avec plusieurs pipelines de données, limitez chaque rôle aux seules <a href="https://milvus.io/docs/manage-collections.md">collections</a> sur lesquelles il opère. Cela limite le rayon d'action en cas de compromission des informations d'identification.</p>
<hr>
<p>Si vous déployez <a href="https://milvus.io/">Milvus</a> en production et que vous travaillez sur le contrôle d'accès, la sécurité ou la conception multi-locataire, nous serions ravis de vous aider :</p>
<ul>
<li>Rejoignez la <a href="https://slack.milvus.io/">communauté Slack Milvus</a> pour discuter des pratiques de déploiement réelles avec d'autres ingénieurs qui utilisent Milvus à grande échelle.</li>
<li><a href="https://milvus.io/office-hours">Réservez une session gratuite de 20 minutes de Milvus Office Hours</a> pour examiner votre conception RBAC, qu'il s'agisse de la structure des rôles, du cadrage au niveau de la collection ou de la sécurité multi-environnement.</li>
<li>Si vous préférez ignorer la configuration de l'infrastructure et gérer le contrôle d'accès via une interface utilisateur, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (géré par Milvus) comprend un système RBAC intégré avec une console Web, ainsi que le <a href="https://zilliz.com/cloud-security">cryptage</a>, l'isolation du réseau et la conformité SOC 2 dès le départ.</li>
</ul>
<hr>
<p>Voici quelques questions qui se posent lorsque les équipes commencent à configurer le contrôle d'accès dans Milvus :</p>
<p><strong>Q : Puis-je restreindre un utilisateur à des collections spécifiques, et non à l'ensemble des collections ?</strong></p>
<p>Oui. Lorsque vous appelez <a href="https://milvus.io/docs/grant_privilege.md"><code translate="no">grant_privilege_v2</code></a>l'utilisateur peut définir <code translate="no">collection_name</code> comme étant la collection spécifique plutôt que <code translate="no">*</code>. Le rôle de l'utilisateur n'aura accès qu'à cette collection. Vous pouvez accorder au même rôle des privilèges sur plusieurs collections en appelant la fonction une fois par collection.</p>
<p><strong>Q : Quelle est la différence entre un privilège et un groupe de privilèges dans Milvus ?</strong></p>
<p>Un privilège est une action unique telle que <code translate="no">Search</code>, <code translate="no">Insert</code> ou <code translate="no">DropCollection</code>. Un <a href="https://milvus.io/docs/privilege_group.md">groupe de privilèges</a> regroupe plusieurs privilèges sous un même nom - par exemple, <code translate="no">COLL_RO</code> comprend toutes les opérations de collection en lecture seule. L'octroi d'un groupe de privilèges est fonctionnellement identique à l'octroi individuel de chacun des privilèges qui le composent, mais il est plus facile à gérer.</p>
<p><strong>Q : L'activation de l'authentification affecte-t-elle les performances des requêtes Milvus ?</strong></p>
<p>La surcharge est négligeable. Milvus valide les informations d'identification et vérifie les autorisations de rôle à chaque demande, mais il s'agit d'une recherche en mémoire, ce qui ajoute des microsecondes et non des millisecondes. Il n'y a pas d'impact mesurable sur la latence de <a href="https://milvus.io/docs/single-vector-search.md">recherche</a> ou d'<a href="https://milvus.io/docs/insert-update-delete.md">insertion</a>.</p>
<p><strong>Q : Puis-je utiliser Milvus RBAC dans une configuration multi-locataires ?</strong></p>
<p>Oui. Créez des rôles distincts par locataire, étendez les privilèges de chaque rôle aux collections de ce locataire et affectez le rôle correspondant au compte de service de chaque locataire. Vous obtenez ainsi une isolation au niveau de la collection sans avoir besoin d'instances Milvus distinctes. Pour une multi-location à plus grande échelle, voir le <a href="https://milvus.io/docs/multi_tenancy.md">guide Milvus multi-tenancy</a>.</p>
