---
id: >-
  milvus-rbac-explained-secure-your-vector-database-with-role-based-access-control.md
title: >-
  Milvus RBAC Erklärt: Sichern Sie Ihre Vector Datenbank mit rollenbasierter
  Zugriffskontrolle
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
  Erfahren Sie, warum RBAC wichtig ist, wie RBAC in Milvus funktioniert, wie Sie
  die Zugriffskontrolle konfigurieren und wie sie den Zugriff mit den geringsten
  Rechten, eine klare Rollentrennung und einen sicheren Produktionsbetrieb
  ermöglicht.
origin: >-
  https://milvus.io/blog/milvus-rbac-explained-secure-your-vector-database-with-role-based-access-control.md
---
<p>Beim Aufbau eines Datenbanksystems verbringen Ingenieure die meiste Zeit mit der Leistung: Indextypen, Abruf, Latenz, Durchsatz und Skalierung. Aber sobald ein System über den Laptop eines einzelnen Entwicklers hinausgeht, wird eine andere Frage genauso wichtig: <strong>Wer darf was in Ihrem Milvus-Cluster tun</strong>? Mit anderen Worten - Zugangskontrolle.</p>
<p>In der gesamten Branche sind viele betriebliche Vorfälle auf einfache Fehler bei den Zugriffsrechten zurückzuführen. Ein Skript wird in der falschen Umgebung ausgeführt. Ein Dienstkonto hat einen breiteren Zugriff als vorgesehen. Eine gemeinsam genutzte Administratorberechtigung landet in CI. Diese Probleme tauchen in der Regel als sehr praktische Fragen auf:</p>
<ul>
<li><p>Dürfen Entwickler Produktionssammlungen löschen?</p></li>
<li><p>Warum kann ein Testkonto Vektordaten aus der Produktion lesen?</p></li>
<li><p>Warum melden sich mehrere Dienste mit der gleichen Administratorrolle an?</p></li>
<li><p>Können Analyse-Jobs nur Lesezugriff mit null Schreibrechten haben?</p></li>
</ul>
<p><a href="https://milvus.io/">Milvus</a> begegnet diesen Herausforderungen mit <a href="https://milvus.io/docs/rbac.md">rollenbasierter Zugriffskontrolle (RBAC)</a>. Anstatt jedem Benutzer Superadmin-Rechte zu geben oder zu versuchen, Einschränkungen im Anwendungscode durchzusetzen, können Sie mit RBAC genaue Berechtigungen auf Datenbankebene definieren. Jeder Benutzer oder Dienst erhält genau die Fähigkeiten, die er benötigt - und nicht mehr.</p>
<p>Dieser Beitrag erklärt, wie RBAC in Milvus funktioniert, wie man es konfiguriert und wie man es sicher in Produktionsumgebungen anwendet.</p>
<h2 id="Why-Access-Control-Matters-When-Using-Milvus" class="common-anchor-header">Warum Zugriffskontrolle bei der Verwendung von Milvus wichtig ist<button data-href="#Why-Access-Control-Matters-When-Using-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Wenn Teams klein sind und ihre KI-Anwendungen nur eine begrenzte Anzahl von Benutzern bedienen, ist die Infrastruktur in der Regel einfach. Einige wenige Techniker verwalten das System, Milvus wird nur für die Entwicklung oder für Tests verwendet, und die Arbeitsabläufe sind unkompliziert. In dieser frühen Phase erscheint die Zugangskontrolle selten dringend, da das Risiko gering ist und Fehler leicht rückgängig gemacht werden können.</p>
<p>Wenn Milvus in die Produktion übergeht und die Zahl der Benutzer, Dienste und Betreiber wächst, ändert sich das Nutzungsmodell schnell. Häufige Szenarien sind:</p>
<ul>
<li><p>Mehrere Geschäftssysteme nutzen dieselbe Milvus-Instanz</p></li>
<li><p>Mehrere Teams greifen auf dieselben Vektorsammlungen zu</p></li>
<li><p>Test-, Staging- und Produktionsdaten koexistieren in einem einzigen Cluster</p></li>
<li><p>Unterschiedliche Rollen, die unterschiedliche Zugriffsebenen benötigen, von reinen Leseabfragen bis hin zu Schreibzugriffen und Betriebskontrolle</p></li>
</ul>
<p>Ohne klar definierte Zugriffsgrenzen schaffen diese Konfigurationen vorhersehbare Risiken:</p>
<ul>
<li><p>Testworkflows könnten versehentlich Produktionskollektionen löschen</p></li>
<li><p>Entwickler könnten versehentlich Indizes ändern, die von Live-Diensten verwendet werden</p></li>
<li><p>Die weit verbreitete Nutzung des <code translate="no">root</code> Kontos macht es unmöglich, Aktionen nachzuvollziehen oder zu überprüfen.</p></li>
<li><p>Eine kompromittierte Anwendung könnte uneingeschränkten Zugriff auf alle Vektordaten erhalten.</p></li>
</ul>
<p>Mit zunehmender Nutzung ist es nicht mehr tragbar, sich auf informelle Konventionen oder gemeinsame Administratorkonten zu verlassen. Ein konsistentes, durchsetzbares Zugriffsmodell wird unerlässlich - und das ist genau das, was Milvus RBAC bietet.</p>
<h2 id="What-is-RBAC-in-Milvus" class="common-anchor-header">Was ist RBAC in Milvus<button data-href="#What-is-RBAC-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/rbac.md">RBAC (Role-Based Access Control, rollenbasierte Zugriffskontrolle)</a> ist ein Berechtigungsmodell, das den Zugriff auf der Grundlage von <strong>Rollen</strong> und nicht von einzelnen Benutzern steuert. In Milvus können Sie mit RBAC genau definieren, welche Operationen ein Benutzer oder Dienst durchführen darf - und auf welche spezifischen Ressourcen. Es bietet eine strukturierte, skalierbare Methode zur Verwaltung der Sicherheit, wenn Ihr System von einem einzelnen Entwickler zu einer kompletten Produktionsumgebung wächst.</p>
<p>Milvus RBAC ist um die folgenden Kernkomponenten herum aufgebaut:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/users_roles_privileges_030620f913.png" alt="Users Roles Privileges" class="doc-image" id="users-roles-privileges" />
   </span> <span class="img-wrapper"> <span>Benutzer Rollen Privilegien</span> </span></p>
<ul>
<li><p><strong>Ressource</strong>: Die Entität, auf die zugegriffen wird. In Milvus gehören zu den Ressourcen die <strong>Instanz</strong>, die <strong>Datenbank</strong> und die <strong>Sammlung</strong>.</p></li>
<li><p><strong>Privileg</strong>: Eine bestimmte erlaubte Operation auf einer Ressource - zum Beispiel das Erstellen einer Sammlung, das Einfügen von Daten oder das Löschen von Entitäten.</p></li>
<li><p><strong>Privilegiengruppe</strong>: Eine vordefinierte Gruppe von verwandten Privilegien, wie z. B. "nur lesen" oder "schreiben".</p></li>
<li><p><strong>Rolle</strong>: Eine Kombination aus Berechtigungen und den Ressourcen, auf die sie sich beziehen. Eine Rolle bestimmt, <em>welche</em> Operationen durchgeführt werden können und <em>wo</em>.</p></li>
<li><p><strong>Benutzer</strong>: Eine Identität in Milvus. Jeder Benutzer hat eine eindeutige ID und ist einer oder mehreren Rollen zugeordnet.</p></li>
</ul>
<p>Diese Komponenten bilden eine klare Hierarchie:</p>
<ol>
<li><p><strong>Benutzern werden Rollen zugewiesen</strong></p></li>
<li><p><strong>Rollen definieren Privilegien</strong></p></li>
<li><p><strong>Privilegien gelten für bestimmte Ressourcen</strong></p></li>
</ol>
<p>Ein wichtiges Gestaltungsprinzip in Milvus ist, dass <strong>Berechtigungen niemals direkt an Benutzer vergeben werden</strong>. Der gesamte Zugriff erfolgt über Rollen. Diese Umleitung vereinfacht die Verwaltung, reduziert Konfigurationsfehler und macht Änderungen der Berechtigungen vorhersehbar.</p>
<p>Dieses Modell lässt sich in realen Einsätzen problemlos skalieren. Wenn sich mehrere Benutzer eine Rolle teilen, werden bei einer Aktualisierung der Berechtigungen für die Rolle sofort die Berechtigungen für alle Benutzer aktualisiert, ohne dass jeder Benutzer einzeln geändert werden muss. Es handelt sich um einen einzigen Kontrollpunkt, der der Art und Weise entspricht, wie moderne Infrastrukturen den Zugriff verwalten.</p>
<h2 id="How-RBAC-Works-in-Milvus" class="common-anchor-header">Wie RBAC in Milvus funktioniert<button data-href="#How-RBAC-Works-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Wenn ein Client eine Anfrage an Milvus sendet, prüft das System diese durch eine Reihe von Autorisierungsschritten. Jeder Schritt muss bestanden werden, bevor die Operation fortgesetzt werden kann:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_rbac_works_afe48bc717.png" alt="How RBAC Works in Milvus" class="doc-image" id="how-rbac-works-in-milvus" />
   </span> <span class="img-wrapper"> <span>Wie RBAC in Milvus funktioniert</span> </span></p>
<ol>
<li><p><strong>Authentifizierung der Anfrage:</strong> Milvus verifiziert zunächst die Identität des Benutzers. Wenn die Authentifizierung fehlschlägt, wird die Anfrage mit einem Authentifizierungsfehler zurückgewiesen.</p></li>
<li><p><strong>Rollenzuweisung prüfen:</strong> Nach der Authentifizierung prüft Milvus, ob dem Benutzer mindestens eine Rolle zugewiesen ist. Wird keine Rolle gefunden, wird die Anfrage mit dem Fehler "Berechtigung verweigert" abgelehnt.</p></li>
<li><p><strong>Erforderliche Berechtigungen überprüfen:</strong> Milvus prüft dann, ob die Rolle des Benutzers die erforderlichen Berechtigungen für die Zielressource gewährt. Schlägt die Berechtigungsprüfung fehl, wird die Anfrage mit dem Fehler "Berechtigung verweigert" zurückgewiesen.</p></li>
<li><p><strong>Ausführen der Operation:</strong> Wenn alle Prüfungen erfolgreich waren, führt Milvus die angeforderte Operation aus und gibt das Ergebnis zurück.</p></li>
</ol>
<h2 id="How-to-Configure-Access-Control-via-RBAC-in-Milvus" class="common-anchor-header">So konfigurieren Sie die Zugriffskontrolle über RBAC in Milvus<button data-href="#How-to-Configure-Access-Control-via-RBAC-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Prerequisites" class="common-anchor-header">1. Voraussetzungen</h3><p>Bevor RBAC-Regeln ausgewertet und durchgesetzt werden können, muss die Benutzerauthentifizierung aktiviert werden, damit jede Anfrage an Milvus mit einer bestimmten Benutzeridentität verknüpft werden kann.</p>
<p>Hier sind zwei Standard-Bereitstellungsmethoden.</p>
<ul>
<li><strong>Bereitstellen mit Docker Compose</strong></li>
</ul>
<p>Wenn Milvus mit Docker Compose bereitgestellt wird, bearbeiten Sie die Konfigurationsdatei <code translate="no">milvus.yaml</code> und aktivieren Sie die Autorisierung, indem Sie <code translate="no">common.security.authorizationEnabled</code> auf <code translate="no">true</code> setzen:</p>
<pre><code translate="no"><span class="hljs-attr">common</span>:
  <span class="hljs-attr">security</span>:
    <span class="hljs-attr">authorizationEnabled</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Einsatz mit Helm Charts</strong></li>
</ul>
<p>Wenn Milvus mithilfe von Helm Charts bereitgestellt wird, bearbeiten Sie die Datei <code translate="no">values.yaml</code> und fügen Sie die folgende Konfiguration unter <code translate="no">extraConfigFiles.user.yaml</code> hinzu:</p>
<pre><code translate="no"><span class="hljs-attr">extraConfigFiles</span>:
  user.<span class="hljs-property">yaml</span>: |+
    <span class="hljs-attr">common</span>:
      <span class="hljs-attr">security</span>:
        <span class="hljs-attr">authorizationEnabled</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Initialization" class="common-anchor-header">2. Initialisierung</h3><p>Standardmäßig erstellt Milvus beim Start des Systems einen eingebauten Benutzer <code translate="no">root</code>. Das Standardpasswort für diesen Benutzer lautet <code translate="no">Milvus</code>.</p>
<p>Als ersten Sicherheitsschritt sollten Sie den Benutzer <code translate="no">root</code> verwenden, um sich mit Milvus zu verbinden, und das Standardpasswort sofort ändern. Es wird dringend empfohlen, ein komplexes Passwort zu verwenden, um unbefugten Zugriff zu verhindern.</p>
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
<h3 id="3-Core-Operations" class="common-anchor-header">3. Kernfunktionen</h3><p><strong>Benutzer anlegen</strong></p>
<p>Für den täglichen Gebrauch wird empfohlen, eigene Benutzer anzulegen, anstatt das Konto <code translate="no">root</code> zu verwenden.</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>, password=<span class="hljs-string">&quot;P@ssw0rd&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Rollen erstellen</strong></p>
<p>Milvus bietet eine eingebaute <code translate="no">admin</code> Rolle mit vollen administrativen Rechten. Für die meisten Produktionsszenarien wird jedoch empfohlen, benutzerdefinierte Rollen zu erstellen, um eine feiner abgestufte Zugriffskontrolle zu erreichen.</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Privilegiengruppen erstellen</strong></p>
<p>Eine Berechtigungsgruppe ist eine Sammlung von mehreren Berechtigungen. Um die Verwaltung von Berechtigungen zu vereinfachen, können verwandte Berechtigungen gruppiert und gemeinsam gewährt werden.</p>
<p>Milvus enthält die folgenden eingebauten Berechtigungsgruppen:</p>
<ul>
<li><p><code translate="no">COLL_RO</code>, <code translate="no">COLL_RW</code>, <code translate="no">COLL_ADMIN</code></p></li>
<li><p><code translate="no">DB_RO</code>, <code translate="no">DB_RW</code>, <code translate="no">DB_ADMIN</code></p></li>
<li><p><code translate="no">Cluster_RO</code>, <code translate="no">Cluster_RW</code>, <code translate="no">Cluster_ADMIN</code></p></li>
</ul>
<p>Die Verwendung dieser integrierten Berechtigungsgruppen kann die Komplexität des Berechtigungsdesigns erheblich reduzieren und die Konsistenz zwischen den Rollen verbessern.</p>
<p>Sie können entweder die integrierten Berechtigungsgruppen direkt verwenden oder bei Bedarf benutzerdefinierte Berechtigungsgruppen erstellen.</p>
<pre><code translate="no"><span class="hljs-comment"># Create a privilege group</span>
client.create_privilege_group(group_name=<span class="hljs-string">&#x27;privilege_group_1&#x27;</span>）
<span class="hljs-comment"># Add privileges to the privilege group</span>
client.add_privileges_to_group(group_name=<span class="hljs-string">&#x27;privilege_group_1&#x27;</span>, privileges=[<span class="hljs-string">&#x27;Query&#x27;</span>, <span class="hljs-string">&#x27;Search&#x27;</span>])
<button class="copy-code-btn"></button></code></pre>
<p><strong>Erteilen von Berechtigungen oder Berechtigungsgruppen an Rollen</strong></p>
<p>Nachdem eine Rolle erstellt wurde, können der Rolle Berechtigungen oder Berechtigungsgruppen zugewiesen werden. Die Zielressourcen für diese Berechtigungen können auf verschiedenen Ebenen angegeben werden, einschließlich der Instanz, der Datenbank oder einzelner Sammlungen.</p>
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
<p><strong>Erteilen von Rollen an Benutzer</strong></p>
<p>Sobald einem Benutzer Rollen zugewiesen sind, kann er auf Ressourcen zugreifen und die durch diese Rollen definierten Operationen durchführen. Einem einzelnen Benutzer können eine oder mehrere Rollen zugewiesen werden, je nach dem erforderlichen Zugriffsumfang.</p>
<pre><code translate="no">client.<span class="hljs-title function_">grant_role</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>, role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Inspect-and-Revoke-Access" class="common-anchor-header">4. Zugriff prüfen und entziehen</h3><p><strong>Einem Benutzer zugewiesene Rollen inspizieren</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">describe_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Einer Rolle zugewiesene Privilegien prüfen</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">describe_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Privilegien einer Rolle entziehen</strong></p>
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
<p><strong>Rollen eines Benutzers widerrufen</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">revoke_role</span>(
    user_name=<span class="hljs-string">&#x27;user_1&#x27;</span>,
    role_name=<span class="hljs-string">&#x27;role_a&#x27;</span>
)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Benutzer und Rollen löschen</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">drop_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>)
client.<span class="hljs-title function_">drop_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Example-Access-Control-Design-for-a-Milvus-Powered-RAG-System" class="common-anchor-header">Beispiel: Design der Zugriffskontrolle für ein Milvus-gestütztes RAG-System<button data-href="#Example-Access-Control-Design-for-a-Milvus-Powered-RAG-System" class="anchor-icon" translate="no">
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
    </button></h2><p>Betrachten Sie ein Retrieval-Augmented Generation (RAG)-System, das auf Milvus aufbaut.</p>
<p>In diesem System haben verschiedene Komponenten und Benutzer klar getrennte Verantwortlichkeiten, und jeder benötigt eine andere Zugriffsebene.</p>
<table>
<thead>
<tr><th>Akteur</th><th>Verantwortung</th><th>Erforderlicher Zugriff</th></tr>
</thead>
<tbody>
<tr><td>Plattform-Administrator</td><td>Systembetrieb und -konfiguration</td><td>Verwaltung auf Instanzebene</td></tr>
<tr><td>Vektor-Ingestion-Dienst</td><td>Aufnahme und Aktualisierung von Vektordaten</td><td>Lese- und Schreibzugriff</td></tr>
<tr><td>Suchdienst</td><td>Suche und Abruf von Vektordaten</td><td>Nur-Lese-Zugriff</td></tr>
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
<h2 id="Quick-Tips-How-to-Operate-Access-Control-Safely-in-Production" class="common-anchor-header">Schnelle Tipps: Wie Sie die Zugriffskontrolle in der Produktion sicher betreiben<button data-href="#Quick-Tips-How-to-Operate-Access-Control-Safely-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Um sicherzustellen, dass die Zugangskontrolle in langlaufenden Produktionssystemen effektiv und überschaubar bleibt, sollten Sie diese praktischen Richtlinien befolgen.</p>
<p><strong>1. Ändern Sie das</strong> <strong>Standardpasswort</strong> <code translate="no">root</code> <strong>und schränken Sie die Verwendung des</strong> <strong>Kontos</strong> <code translate="no">root</code> <strong>ein</strong>.</p>
<p>Aktualisieren Sie das Standardpasswort <code translate="no">root</code> sofort nach der Initialisierung und beschränken Sie seine Verwendung auf administrative Aufgaben. Vermeiden Sie die Verwendung oder gemeinsame Nutzung des root-Kontos für Routinevorgänge. Erstellen Sie stattdessen dedizierte Benutzer und Rollen für den täglichen Zugriff, um das Risiko zu verringern und die Verantwortlichkeit zu verbessern.</p>
<p><strong>2. Physische Isolierung von Milvus-Instanzen in verschiedenen Umgebungen</strong></p>
<p>Stellen Sie separate Milvus-Instanzen für Entwicklung, Staging und Produktion bereit. Die physische Isolierung bietet eine stärkere Sicherheitsgrenze als die logische Zugriffskontrolle allein und verringert das Risiko von Fehlern in verschiedenen Umgebungen erheblich.</p>
<p><strong>3. Befolgen Sie das Prinzip der geringsten Privilegien</strong></p>
<p>Gewähren Sie nur die für jede Rolle erforderlichen Berechtigungen:</p>
<ul>
<li><p><strong>Entwicklungsumgebungen:</strong> Die Berechtigungen können großzügiger sein, um Iterationen und Tests zu unterstützen.</p></li>
<li><p><strong>Produktionsumgebungen:</strong> Die Berechtigungen sollten streng auf das Notwendige beschränkt werden.</p></li>
<li><p><strong>Regelmäßige Audits:</strong> Regelmäßige Überprüfung der bestehenden Berechtigungen, um sicherzustellen, dass sie noch erforderlich sind.</p></li>
</ul>
<p><strong>4. Aktiver Entzug von Berechtigungen, wenn sie nicht mehr benötigt werden</strong></p>
<p>Zugriffskontrolle ist keine einmalige Einrichtung, sondern erfordert eine kontinuierliche Pflege. Entziehen Sie Rollen und Berechtigungen umgehend, wenn sich Benutzer, Dienste oder Verantwortlichkeiten ändern. Dadurch wird verhindert, dass sich ungenutzte Berechtigungen im Laufe der Zeit ansammeln und zu versteckten Sicherheitsrisiken werden.</p>
<h2 id="Conclusion" class="common-anchor-header">Fazit<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Konfiguration der Zugriffskontrolle in Milvus ist nicht von Natur aus komplex, aber sie ist für den sicheren und zuverlässigen Betrieb des Systems in der Produktion unerlässlich. Mit einem gut durchdachten RBAC-Modell können Sie:</p>
<ul>
<li><p><strong>Risiken reduzieren</strong>, indem Sie versehentliche oder zerstörerische Operationen verhindern</p></li>
<li><p><strong>die Sicherheit verbessern</strong>, indem der Zugriff auf Vektordaten mit den geringsten Rechten erzwungen wird</p></li>
<li><p><strong>Standardisierung der Abläufe</strong> durch eine klare Trennung der Verantwortlichkeiten</p></li>
<li><p><strong>Zuverlässig skalieren</strong> und so die Grundlage für mandantenfähige und groß angelegte Implementierungen schaffen</p></li>
</ul>
<p>Zugriffskontrolle ist keine optionale Funktion oder eine einmalige Aufgabe. Sie ist ein grundlegender Bestandteil des sicheren Betriebs von Milvus auf lange Sicht.</p>
<p>Beginnen Sie mit dem Aufbau einer soliden Sicherheitsgrundlage mit <a href="https://milvus.io/docs/rbac.md">RBAC</a> für Ihren Milvus-Einsatz.</p>
<p>Haben Sie Fragen oder möchten Sie eine Funktion des neuesten Milvus genauer kennenlernen? Treten Sie unserem<a href="https://discord.com/invite/8uyFbECzPX"> Discord-Kanal</a> bei oder stellen Sie Fragen auf<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Sie können auch eine 20-minütige Einzelsitzung buchen, um Einblicke, Anleitungen und Antworten auf Ihre Fragen über die<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus-Sprechstunde</a> zu erhalten.</p>
