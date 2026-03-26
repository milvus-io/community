---
id: milvus-access-control-rbac-guide.md
title: >-
  Milvus Handbuch zur Zugriffskontrolle: Wie man RBAC für die Produktion
  konfiguriert
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
  Schritt-für-Schritt-Anleitung zur Einrichtung von Milvus RBAC in der
  Produktion - Benutzer, Rollen, Berechtigungsgruppen, Zugriff auf
  Sammlungsebene und ein vollständiges RAG-Systembeispiel.
origin: 'https://milvus.io/blog/milvus-access-control-rbac-guide.md'
---
<p>Hier eine Geschichte, die häufiger vorkommt, als sie sein sollte: Ein QA-Ingenieur führt ein Bereinigungsskript gegen eine Umgebung aus, die er für die Staging-Umgebung hält. Die Verbindungszeichenfolge zeigt jedoch auf die Produktionsumgebung. Wenige Sekunden später sind die zentralen Vektorsammlungen verschwunden - die Merkmalsdaten sind verloren, die <a href="https://zilliz.com/glossary/similarity-search">Ähnlichkeitssuche</a> liefert leere Ergebnisse, die Dienste sind in allen Bereichen beeinträchtigt. Der Postmortem findet die gleiche Ursache wie immer: Alle waren als <code translate="no">root</code> verbunden, es gab keine Zugriffsgrenzen und nichts hielt ein Testkonto davon ab, Produktionsdaten zu verlieren.</p>
<p>Dies ist kein Einzelfall. Teams, die auf <a href="https://milvus.io/">Milvus</a> - und <a href="https://zilliz.com/learn/what-is-a-vector-database">Vektordatenbanken</a> im Allgemeinen - aufbauen, neigen dazu, sich auf die <a href="https://zilliz.com/learn/vector-index">Indexleistung</a>, den Durchsatz und die Skalierung der Daten zu konzentrieren und die Zugriffskontrolle als etwas zu betrachten, mit dem man sich später befasst. Aber "später" kommt meist in Form eines Zwischenfalls. Da sich Milvus vom Prototyp zum Rückgrat von <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG-Pipelines</a>, Empfehlungsmaschinen und <a href="https://zilliz.com/learn/what-is-vector-search">Echtzeit-Vektorsuche</a> entwickelt, wird die Frage unvermeidlich: Wer kann auf Ihren Milvus-Cluster zugreifen und was genau dürfen sie tun?</p>
<p>Milvus enthält ein eingebautes RBAC-System, um diese Frage zu beantworten. Dieser Leitfaden beschreibt, was RBAC ist, wie Milvus es implementiert und wie man ein Zugriffskontrollmodell entwirft, das die Produktion sicher macht - komplett mit Codebeispielen und einem vollständigen RAG-System-Walkthrough.</p>
<h2 id="What-Is-RBAC-Role-Based-Access-Control" class="common-anchor-header">Was ist RBAC (rollenbasierte Zugriffskontrolle)?<button data-href="#What-Is-RBAC-Role-Based-Access-Control" class="anchor-icon" translate="no">
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
    </button></h2><p>Bei der<strong>rollenbasierten Zugriffskontrolle (RBAC)</strong> handelt es sich um ein Sicherheitsmodell, bei dem Berechtigungen nicht direkt an einzelne Benutzer vergeben werden. Stattdessen werden die Berechtigungen in Rollen gruppiert, und den Benutzern werden eine oder mehrere Rollen zugewiesen. Der effektive Zugriff eines Benutzers ist die Summe aller Berechtigungen der ihm zugewiesenen Rollen. RBAC ist das Standardmodell für die Zugriffskontrolle in produktiven Datenbanksystemen - PostgreSQL, MySQL, MongoDB und die meisten Cloud-Dienste verwenden es.</p>
<p>RBAC löst ein grundlegendes Skalierungsproblem: Wenn Sie Dutzende von Benutzern und Diensten haben, ist die Verwaltung von Berechtigungen pro Benutzer nicht mehr zu bewältigen. Mit RBAC definieren Sie eine Rolle einmalig (z. B. "nur Lesezugriff auf Sammlung X"), weisen sie zehn Diensten zu und aktualisieren sie an einer Stelle, wenn sich die Anforderungen ändern.</p>
<h2 id="How-Does-Milvus-Implement-RBAC" class="common-anchor-header">Wie implementiert Milvus RBAC?<button data-href="#How-Does-Milvus-Implement-RBAC" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus RBAC ist auf vier Konzepten aufgebaut:</p>
<table>
<thead>
<tr><th>Konzept</th><th>Was es ist</th><th>Beispiel</th></tr>
</thead>
<tbody>
<tr><td><strong>Ressource</strong></td><td>Die Sache, auf die zugegriffen wird</td><td>Eine <a href="https://milvus.io/docs/architecture_overview.md">Milvus-Instanz</a>, eine <a href="https://milvus.io/docs/manage-databases.md">Datenbank</a> oder eine bestimmte Sammlung</td></tr>
<tr><td><strong>Privileg / Privileggruppe</strong></td><td>Die Aktion, die durchgeführt wird</td><td><code translate="no">Search</code> <code translate="no">Insert</code>, , oder eine Gruppe wie (Sammlung schreibgeschützt) <code translate="no">DropCollection</code> <code translate="no">COLL_RO</code> </td></tr>
<tr><td><strong>Rolle</strong></td><td>Eine benannte Gruppe von Rechten, die auf Ressourcen beschränkt sind</td><td><code translate="no">role_read_only</code>Rolle: kann alle Sammlungen in der Datenbank <code translate="no">default</code> durchsuchen und abfragen</td></tr>
<tr><td><strong>Benutzer</strong></td><td>Ein Milvus-Konto (Mensch oder Dienst)</td><td><code translate="no">rag_writer</code>Benutzer: das von der Ingestion-Pipeline verwendete Dienstkonto</td></tr>
</tbody>
</table>
<p>Der Zugriff wird den Benutzern nie direkt zugewiesen. Benutzer erhalten Rollen, Rollen enthalten Privilegien, und Privilegien sind auf Ressourcen beschränkt. Dies ist das gleiche <a href="https://zilliz.com/blog/milvus-2-5-rbac-enhancements">RBAC-Modell</a>, das in den meisten Produktionsdatenbanksystemen verwendet wird. Wenn zehn Benutzer die gleiche Rolle haben, aktualisieren Sie die Rolle einmal und die Änderung gilt für alle.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_access_control_rbac_guide_1_c872ea8932.png" alt="Milvus RBAC model showing how Users are assigned to Roles, and Roles contain Privileges and Privilege Groups that apply to Resources" class="doc-image" id="milvus-rbac-model-showing-how-users-are-assigned-to-roles,-and-roles-contain-privileges-and-privilege-groups-that-apply-to-resources" />
   </span> <span class="img-wrapper"> <span>Das RBAC-Modell von Milvus zeigt, wie Benutzer Rollen zugewiesen werden, und Rollen enthalten Privilegien und Privilegiengruppen, die für Ressourcen gelten</span> </span></p>
<p>Wenn eine Anfrage Milvus erreicht, durchläuft sie drei Prüfungen:</p>
<ol>
<li><strong>Authentifizierung</strong> - ist dies ein gültiger Benutzer mit korrekten Anmeldedaten?</li>
<li><strong>Rollenprüfung</strong> - hat dieser Benutzer mindestens eine zugewiesene Rolle?</li>
<li><strong>Berechtigungsprüfung</strong> - gewährt eine der Rollen des Benutzers die gewünschte Aktion für die angeforderte Ressource?</li>
</ol>
<p>Wenn eine Prüfung fehlschlägt, wird die Anfrage abgelehnt.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/milvus_access_control_rbac_guide_2_2275b37ea6.png" alt="Milvus authentication and authorization flow: Client Request goes through Authentication, Role Check, and Privilege Check — rejected at any failed step, executed only if all pass" class="doc-image" id="milvus-authentication-and-authorization-flow:-client-request-goes-through-authentication,-role-check,-and-privilege-check-—-rejected-at-any-failed-step,-executed-only-if-all-pass" />
   <span>Milvus-Authentifizierungs- und Autorisierungsablauf: Client-Anfrage durchläuft Authentifizierung, Rollenprüfung und Berechtigungsprüfung - Ablehnung bei jedem fehlgeschlagenen Schritt, Ausführung nur, wenn alle bestanden wurden</span> </span></p>
<h2 id="How-to-Enable-Authentication-in-Milvus" class="common-anchor-header">Wie wird die Authentifizierung in Milvus aktiviert?<button data-href="#How-to-Enable-Authentication-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Standardmäßig läuft Milvus mit deaktivierter Authentifizierung - jede Verbindung hat vollen Zugriff. Der erste Schritt besteht darin, sie zu aktivieren.</p>
<h3 id="Docker-Compose" class="common-anchor-header">Docker Compose</h3><p>Bearbeiten Sie <code translate="no">milvus.yaml</code> und setzen Sie <code translate="no">authorizationEnabled</code> auf <code translate="no">true</code>:</p>
<pre><code translate="no"><span class="hljs-attr">common</span>:
  <span class="hljs-attr">security</span>:
    <span class="hljs-attr">authorizationEnabled</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Helm-Charts" class="common-anchor-header">Helm-Diagramme</h3><p>Bearbeiten Sie <code translate="no">values.yaml</code> und fügen Sie die Einstellung unter <code translate="no">extraConfigFiles</code> hinzu:</p>
<pre><code translate="no"><span class="hljs-attr">extraConfigFiles</span>:
  user.<span class="hljs-property">yaml</span>: |+
    <span class="hljs-attr">common</span>:
      <span class="hljs-attr">security</span>:
        <span class="hljs-attr">authorizationEnabled</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<p>Für <a href="https://milvus.io/docs/install_cluster-milvusoperator.md">Milvus Operator-Einsätze</a> auf <a href="https://milvus.io/docs/prerequisite-helm.md">Kubernetes</a> wird dieselbe Konfiguration im Abschnitt <code translate="no">spec.config</code> der Milvus CR vorgenommen.</p>
<p>Sobald die Authentifizierung aktiviert ist und Milvus neu startet, muss jede Verbindung Anmeldeinformationen bereitstellen. Milvus erstellt einen Standardbenutzer <code translate="no">root</code> mit dem Passwort <code translate="no">Milvus</code> - ändern Sie dieses sofort.</p>
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
<h2 id="How-to-Configure-Users-Roles-and-Privileges" class="common-anchor-header">Konfigurieren von Benutzern, Rollen und Berechtigungen<button data-href="#How-to-Configure-Users-Roles-and-Privileges" class="anchor-icon" translate="no">
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
    </button></h2><p>Wenn die Authentifizierung aktiviert ist, sieht der typische Einrichtungsablauf wie folgt aus.</p>
<h3 id="Step-1-Create-Users" class="common-anchor-header">Schritt 1: Benutzer erstellen</h3><p>Lassen Sie Dienste oder Teammitglieder nicht <code translate="no">root</code> verwenden. Erstellen Sie dedizierte Konten für jeden Benutzer oder Dienst.</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>, password=<span class="hljs-string">&quot;P@ssw0rd&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Create-Roles" class="common-anchor-header">Schritt 2: Rollen erstellen</h3><p>Milvus hat eine eingebaute <code translate="no">admin</code> Rolle, aber in der Praxis werden Sie benutzerdefinierte Rollen benötigen, die Ihren tatsächlichen Zugriffsmustern entsprechen.</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Create-Privilege-Groups" class="common-anchor-header">Schritt 3: Erstellen Sie Privilegiengruppen</h3><p>Eine Berechtigungsgruppe bündelt mehrere Berechtigungen unter einem Namen, was die Verwaltung des Zugriffs in großem Umfang erleichtert. Milvus bietet 9 integrierte Berechtigungsgruppen:</p>
<table>
<thead>
<tr><th>Eingebaute Gruppe</th><th>Bereich</th><th>Was sie erlaubt</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">COLL_RO</code></td><td>Sammlung</td><td>Nur-Lese-Operationen (Abfrage, Suche, etc.)</td></tr>
<tr><td><code translate="no">COLL_RW</code></td><td>Sammlung</td><td>Lese- und Schreiboperationen</td></tr>
<tr><td><code translate="no">COLL_Admin</code></td><td>Sammlung</td><td>Vollständige Verwaltung von Sammlungen</td></tr>
<tr><td><code translate="no">DB_RO</code></td><td>Datenbank</td><td>Datenbankoperationen mit Lesezugriff</td></tr>
<tr><td><code translate="no">DB_RW</code></td><td>Datenbank</td><td>Lese- und Schreiboperationen in der Datenbank</td></tr>
<tr><td><code translate="no">DB_Admin</code></td><td>Datenbank</td><td>Vollständige Datenbankverwaltung</td></tr>
<tr><td><code translate="no">Cluster_RO</code></td><td>Cluster</td><td>Clusteroperationen mit Lesezugriff</td></tr>
<tr><td><code translate="no">Cluster_RW</code></td><td>Cluster</td><td>Lese- und Schreiboperationen in Clustern</td></tr>
<tr><td><code translate="no">Cluster_Admin</code></td><td>Cluster</td><td>Vollständige Cluster-Verwaltung</td></tr>
</tbody>
</table>
<p>Sie können auch benutzerdefinierte Berechtigungsgruppen erstellen, wenn die integrierten Gruppen nicht passen:</p>
<pre><code translate="no"><span class="hljs-comment"># Create a privilege group</span>
client.create_privilege_group(group_name=<span class="hljs-string">&#x27;privilege_group_1&#x27;</span>)

<span class="hljs-comment"># Add privileges to the group</span>
client.add_privileges_to_group(
    group_name=<span class="hljs-string">&#x27;privilege_group_1&#x27;</span>,
    privileges=[<span class="hljs-string">&#x27;Query&#x27;</span>, <span class="hljs-string">&#x27;Search&#x27;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Grant-Privileges-to-a-Role" class="common-anchor-header">Schritt 4: Erteilen von Berechtigungen an eine Rolle</h3><p>Gewähren Sie einer Rolle einzelne Berechtigungen oder Berechtigungsgruppen, die auf bestimmte Ressourcen beschränkt sind. Die Parameter <code translate="no">collection_name</code> und <code translate="no">db_name</code> steuern den Bereich - verwenden Sie <code translate="no">*</code> für alle.</p>
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
<h3 id="Step-5-Assign-Roles-to-Users" class="common-anchor-header">Schritt 5: Zuweisung von Rollen an Benutzer</h3><p>Ein Benutzer kann mehrere Rollen innehaben. Seine effektiven Berechtigungen sind die Summe aller zugewiesenen Rollen.</p>
<pre><code translate="no">client.<span class="hljs-title function_">grant_role</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>, role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h2 id="How-to-Audit-and-Revoke-Access" class="common-anchor-header">Zugriff prüfen und entziehen<button data-href="#How-to-Audit-and-Revoke-Access" class="anchor-icon" translate="no">
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
    </button></h2><p>Zu wissen, welche Zugriffsrechte bestehen, ist ebenso wichtig wie deren Gewährung. Veraltete Berechtigungen - von ehemaligen Teammitgliedern, ausgemusterten Diensten oder einmaligen Debugging-Sitzungen - sammeln sich unbemerkt an und vergrößern die Angriffsfläche.</p>
<h3 id="Check-Current-Permissions" class="common-anchor-header">Aktuelle Berechtigungen prüfen</h3><p>Anzeigen der zugewiesenen Rollen eines Benutzers:</p>
<pre><code translate="no">client.<span class="hljs-title function_">describe_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Anzeigen der gewährten Berechtigungen einer Rolle:</p>
<pre><code translate="no">client.<span class="hljs-title function_">describe_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Revoke-Privileges-from-a-Role" class="common-anchor-header">Entziehen von Privilegien für eine Rolle</h3><pre><code translate="no"><span class="hljs-comment"># Remove a single privilege</span>
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
<h3 id="Unassign-a-Role-from-a-User" class="common-anchor-header">Aufheben der Rollenzuweisung für einen Benutzer</h3><pre><code translate="no">client.<span class="hljs-title function_">revoke_role</span>(
    user_name=<span class="hljs-string">&#x27;user_1&#x27;</span>,
    role_name=<span class="hljs-string">&#x27;role_a&#x27;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Delete-Users-or-Roles" class="common-anchor-header">Benutzer oder Rollen löschen</h3><p>Entfernen Sie alle Rollenzuweisungen, bevor Sie einen Benutzer löschen, und entziehen Sie alle Privilegien, bevor Sie eine Rolle aufgeben:</p>
<pre><code translate="no">client.<span class="hljs-title function_">drop_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>)
client.<span class="hljs-title function_">drop_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Example-How-to-Design-RBAC-for-a-Production-RAG-System" class="common-anchor-header">Beispiel: Wie man RBAC für ein produktives RAG-System entwirft<button data-href="#Example-How-to-Design-RBAC-for-a-Production-RAG-System" class="anchor-icon" translate="no">
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
    </button></h2><p>Abstrakte Konzepte erschließen sich schneller anhand eines konkreten Beispiels. Betrachten Sie ein <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG-System</a>, das auf Milvus mit drei verschiedenen Diensten aufgebaut ist:</p>
<table>
<thead>
<tr><th>Dienst</th><th>Zuständigkeit</th><th>Erforderlicher Zugriff</th></tr>
</thead>
<tbody>
<tr><td><strong>Plattform-Verwaltung</strong></td><td>Verwaltet den Milvus-Cluster - erstellt Sammlungen, überwacht den Zustand, führt Upgrades durch</td><td>Vollständiger Cluster-Administrator</td></tr>
<tr><td><strong>Ingestion-Dienst</strong></td><td>Erzeugt <a href="https://zilliz.com/glossary/vector-embeddings">Vektoreinbettungen</a> aus Dokumenten und schreibt sie in Sammlungen</td><td>Lesen und Schreiben in Sammlungen</td></tr>
<tr><td><strong>Suchdienst</strong></td><td>Verarbeitet <a href="https://zilliz.com/learn/what-is-vector-search">Vektorsuchanfragen</a> von Endnutzern</td><td>Nur Lesezugriff auf Sammlungen</td></tr>
</tbody>
</table>
<p>Hier ist eine vollständige Einrichtung mit <a href="https://milvus.io/docs/install-pymilvus.md">PyMilvus</a>:</p>
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
<p>Jeder Dienst erhält genau den Zugriff, den er benötigt. Der Suchdienst kann nicht versehentlich Daten löschen. Der Ingestion-Dienst kann die Cluster-Einstellungen nicht ändern. Und wenn die Anmeldedaten des Suchdienstes durchsickern, kann der Angreifer die <a href="https://zilliz.com/glossary/vector-embeddings">Einbettungsvektoren</a> lesen - aber nicht schreiben, löschen oder zum Administrator aufsteigen.</p>
<p>Für Teams, die den Zugriff über mehrere Milvus-Implementierungen hinweg verwalten, bietet <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (verwaltetes Milvus) integriertes RBAC mit einer Webkonsole zur Verwaltung von Benutzern, Rollen und Berechtigungen - ohne Skripting. Nützlich, wenn Sie den Zugriff lieber über eine Benutzeroberfläche verwalten möchten, als Einrichtungsskripte für verschiedene Umgebungen zu pflegen.</p>
<h2 id="Access-Control-Best-Practices-for-Production" class="common-anchor-header">Best Practices für die Zugriffskontrolle in der Produktion<button data-href="#Access-Control-Best-Practices-for-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Die obigen Einrichtungsschritte sind die Mechanismen. Im Folgenden finden Sie die Designprinzipien, die dafür sorgen, dass die Zugriffskontrolle auch im Laufe der Zeit effektiv bleibt.</p>
<h3 id="Lock-Down-the-Root-Account" class="common-anchor-header">Sperren Sie das Root-Konto</h3><p>Ändern Sie vor allem das Standardpasswort <code translate="no">root</code>. In der Produktion sollte das Root-Konto nur für Notfälle verwendet und in einem Secrets Manager gespeichert werden - nicht fest in den Anwendungskonfigurationen kodiert oder über Slack weitergegeben.</p>
<h3 id="Separate-Environments-Completely" class="common-anchor-header">Vollständig getrennte Umgebungen</h3><p>Verwenden Sie verschiedene <a href="https://milvus.io/docs/architecture_overview.md">Milvus-Instanzen</a> für Entwicklung, Staging und Produktion. Die Trennung von Umgebungen durch RBAC allein ist fragil - ein falsch konfigurierter Verbindungsstring und ein Entwicklungsdienst schreibt auf Produktionsdaten. Eine physische Trennung (verschiedene Cluster, verschiedene Anmeldeinformationen) schließt diese Art von Vorfällen vollständig aus.</p>
<h3 id="Apply-Least-Privilege" class="common-anchor-header">Least Privilege anwenden</h3><p>Geben Sie jedem Benutzer und jedem Dienst den Mindestzugriff, den er für seine Arbeit benötigt. Beginnen Sie eng und erweitern Sie die Rechte nur, wenn ein spezifischer, dokumentierter Bedarf besteht. In Entwicklungsumgebungen können Sie lockerer vorgehen, aber der Produktionszugang sollte streng sein und regelmäßig überprüft werden.</p>
<h3 id="Clean-Up-Stale-Access" class="common-anchor-header">Bereinigen Sie veraltete Zugriffsrechte</h3><p>Wenn eine Person das Team verlässt oder ein Dienst außer Betrieb genommen wird, sollten Sie deren Rollen widerrufen und ihre Konten sofort löschen. Ungenutzte Konten mit aktiven Berechtigungen sind das häufigste Einfallstor für unbefugten Zugriff - es handelt sich um gültige Anmeldedaten, die niemand überwacht.</p>
<h3 id="Scope-Privileges-to-Specific-Collections" class="common-anchor-header">Berechtigungen auf bestimmte Sammlungen beschränken</h3><p>Vermeiden Sie die Gewährung von <code translate="no">collection_name='*'</code>, es sei denn, die Rolle benötigt wirklich Zugriff auf alle Sammlungen. In mandantenfähigen Systemen oder Systemen mit mehreren Datenpipelines sollten Sie jeder Rolle nur Zugriff auf die <a href="https://milvus.io/docs/manage-collections.md">Sammlungen</a> gewähren, mit denen sie arbeitet. Dadurch wird der Aktionsradius bei einer Kompromittierung der Anmeldeinformationen eingeschränkt.</p>
<hr>
<p>Wenn Sie <a href="https://milvus.io/">Milvus</a> in der Produktion einsetzen und sich mit Zugriffskontrolle, Sicherheit oder mandantenfähigem Design beschäftigen, helfen wir Ihnen gerne:</p>
<ul>
<li>Treten Sie der <a href="https://slack.milvus.io/">Milvus-Slack-Community</a> bei und diskutieren Sie mit anderen Ingenieuren, die Milvus in großem Maßstab einsetzen, über reale Bereitstellungspraktiken.</li>
<li><a href="https://milvus.io/office-hours">Buchen Sie eine kostenlose 20-minütige Milvus-Sprechstunde</a>, um Ihr RBAC-Design durchzugehen - sei es die Rollenstruktur, das Scoping auf Sammlungsebene oder die Sicherheit in mehreren Umgebungen.</li>
<li>Wenn Sie die Einrichtung der Infrastruktur lieber überspringen und die Zugriffskontrolle über eine Benutzeroberfläche verwalten möchten, enthält <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (verwaltet von Milvus) integriertes RBAC mit einer Webkonsole - plus <a href="https://zilliz.com/cloud-security">Verschlüsselung</a>, Netzwerkisolierung und SOC 2-Konformität, und zwar sofort nach der Installation.</li>
</ul>
<hr>
<p>Ein paar Fragen, die auftauchen, wenn Teams mit der Konfiguration der Zugriffskontrolle in Milvus beginnen:</p>
<p><strong>F: Kann ich einen Benutzer nur auf bestimmte Sammlungen beschränken, nicht auf alle Sammlungen?</strong></p>
<p>Ja. Wenn Sie <a href="https://milvus.io/docs/grant_privilege.md"><code translate="no">grant_privilege_v2</code></a>aufrufen, setzen Sie <code translate="no">collection_name</code> auf die spezifische Sammlung und nicht <code translate="no">*</code>. Die Rolle des Benutzers hat dann nur Zugriff auf diese Sammlung. Sie können der gleichen Rolle Berechtigungen für mehrere Sammlungen gewähren, indem Sie die Funktion einmal pro Sammlung aufrufen.</p>
<p><strong>F: Was ist der Unterschied zwischen einer Berechtigung und einer Berechtigungsgruppe in Milvus?</strong></p>
<p>Ein Zugriffsrecht ist eine einzelne Aktion wie <code translate="no">Search</code>, <code translate="no">Insert</code> oder <code translate="no">DropCollection</code>. Eine <a href="https://milvus.io/docs/privilege_group.md">Berechtigungsgruppe</a> bündelt mehrere Zugriffsrechte unter einem Namen - zum Beispiel umfasst <code translate="no">COLL_RO</code> alle schreibgeschützten Sammlungsoperationen. Die Gewährung einer Berechtigungsgruppe ist funktional dasselbe wie die Gewährung der einzelnen Berechtigungen, die sie bilden, aber einfacher zu verwalten.</p>
<p><strong>F: Wirkt sich die Aktivierung der Authentifizierung auf die Leistung der Milvus-Abfrage aus?</strong></p>
<p>Der Overhead ist vernachlässigbar. Milvus validiert die Anmeldeinformationen und prüft die Rollenberechtigungen bei jeder Abfrage, aber dies ist eine speicherinterne Suche - sie dauert nur Mikrosekunden, nicht Millisekunden. Es gibt keine messbaren Auswirkungen auf die <a href="https://milvus.io/docs/single-vector-search.md">Such-</a> oder <a href="https://milvus.io/docs/insert-update-delete.md">Einfüge-Latenzzeit</a>.</p>
<p><strong>F: Kann ich Milvus RBAC in einer mandantenfähigen Einrichtung verwenden?</strong></p>
<p>Ja. Erstellen Sie separate Rollen pro Mandant, verteilen Sie die Privilegien jeder Rolle auf die Sammlungen des jeweiligen Mandanten und weisen Sie die entsprechende Rolle dem Servicekonto jedes Mandanten zu. So erhalten Sie eine Isolierung auf Sammlungsebene, ohne dass Sie separate Milvus-Instanzen benötigen. Für eine umfangreichere Mandantenfähigkeit lesen Sie bitte den <a href="https://milvus.io/docs/multi_tenancy.md">Milvus-Leitfaden zur Mandantenfähigkeit</a>.</p>
