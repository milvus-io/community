---
id: deploying-milvus-on-kubernetes-just-got-easier-with-the-milvus-operator.md
title: >-
  Die Bereitstellung von Milvus auf Kubernetes ist mit dem Milvus Operator jetzt
  noch einfacher geworden
author: Min Yin
date: 2025-08-04T00:00:00.000Z
desc: >-
  Milvus Operator ist ein Kubernetes-natives Verwaltungstool, das den gesamten
  Lebenszyklus von Milvus-Vektor-Datenbankimplementierungen automatisiert.
cover: >-
  https://assets.zilliz.com/Deploying_Milvus_on_Kubernetes_Just_Got_Easier_with_the_Milvus_Operator_1f6f48e55c.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus Operator, Kubernetes, How to deploy Milvus on Kubernetes'
meta_title: |
  Deploy Milvus on K8s Just Got Easier with the Milvus Operator 
origin: >-
  https://milvus.io/blog/deploying-milvus-on-kubernetes-just-got-easier-with-the-milvus-operator.md
---
<p>Das Einrichten eines produktionsbereiten Milvus-Clusters sollte sich nicht wie das Entschärfen einer Bombe anfühlen. Doch jeder, der Kubernetes-Bereitstellungen für Vektordatenbanken manuell konfiguriert hat, kennt das Problem: Dutzende von YAML-Dateien, kompliziertes Abhängigkeitsmanagement und das mulmige Gefühl, wenn nachts um 2 Uhr etwas nicht funktioniert und man nicht sicher ist, welche der 47 Konfigurationsdateien der Übeltäter ist.</p>
<p>Der traditionelle Ansatz für die Bereitstellung von Milvus beinhaltet die Orchestrierung mehrerer Dienste - etcd für die Speicherung von Metadaten, Pulsar für die Nachrichtenwarteschlange, MinIO für die Objektspeicherung und die verschiedenen Milvus-Komponenten selbst. Jeder Dienst erfordert eine sorgfältige Konfiguration, eine angemessene Startreihenfolge und eine kontinuierliche Wartung. Skaliert man dies auf mehrere Umgebungen oder Cluster, so wird die betriebliche Komplexität überwältigend.</p>
<p>An dieser Stelle ändert <a href="https://github.com/zilliztech/milvus-operator"><strong>Milvus Operator</strong></a> das Spiel grundlegend. Anstatt die Infrastruktur manuell zu verwalten, beschreiben Sie, was Sie wollen, und der Operator kümmert sich um das Wie.</p>
<h2 id="What-is-the-Milvus-Operator" class="common-anchor-header">Was ist der Milvus Operator?<button data-href="#What-is-the-Milvus-Operator" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/install_cluster-milvusoperator.md"><strong>Milvus Operator</strong></a> ist ein Kubernetes-natives Management-Tool, das den gesamten Lebenszyklus von Milvus-Vektordatenbank-Implementierungen automatisiert. Es basiert auf dem Kubernetes Operator-Muster und bündelt jahrelanges operatives Wissen über den Betrieb von Milvus in der Produktion und kodifiziert dieses Wissen in einer Software, die neben Ihrem Cluster läuft.</p>
<p>Stellen Sie sich einen erfahrenen Milvus-Administrator vor, der niemals schläft, keine Tippfehler macht und sich jedes Konfigurationsdetail perfekt merken kann. Der Operator überwacht kontinuierlich den Zustand Ihres Clusters, trifft automatisch Skalierungsentscheidungen, verwaltet Upgrades ohne Ausfallzeiten und erholt sich von Ausfällen schneller als jeder menschliche Operator es könnte.</p>
<p>Im Kern bietet der Operator vier wesentliche Funktionen.</p>
<ul>
<li><p><strong>Automatisierte Bereitstellung</strong>: Richten Sie einen voll funktionsfähigen Milvus-Cluster mit einem einzigen Manifest ein.</p></li>
<li><p><strong>Lebenszyklus-Management</strong>: Automatisieren Sie Upgrades, horizontale Skalierung und Ressourcenabbau in einer definierten, sicheren Reihenfolge.</p></li>
<li><p><strong>Integrierte Überwachung und Zustandsüberprüfung</strong>: Kontinuierliche Überwachung des Zustands der Milvus-Komponenten und ihrer Abhängigkeiten, einschließlich etcd, Pulsar und MinIO.</p></li>
<li><p><strong>Betriebliche Best Practices als Standard</strong>: Wenden Sie Kubernetes-eigene Muster an, die Zuverlässigkeit gewährleisten, ohne dass tiefgreifende Kenntnisse der Plattform erforderlich sind.</p></li>
</ul>
<h3 id="Understanding-the-Kubernetes-Operator-Pattern" class="common-anchor-header">Das Kubernetes-Operator-Muster verstehen</h3><p>Bevor wir uns mit den Vorteilen des Milvus Operator beschäftigen, sollten wir zunächst die Grundlage verstehen, auf der er aufbaut: das <strong>Kubernetes Operator-Muster.</strong></p>
<p>Das Kubernetes-Operator-Muster hilft bei der Verwaltung komplexer Anwendungen, die mehr als nur grundlegende Kubernetes-Funktionen benötigen. Ein Operator besteht aus drei Hauptbestandteilen:</p>
<ul>
<li><p>Mithilfe<strong>von benutzerdefinierten Ressourcendefinitionen</strong> können Sie Ihre Anwendung mit Konfigurationsdateien im Kubernetes-Stil beschreiben.</p></li>
<li><p><strong>Ein Controller</strong> überwacht diese Konfigurationen und nimmt die erforderlichen Änderungen an Ihrem Cluster vor.</p></li>
<li><p><strong>Die Zustandsverwaltung</strong> stellt sicher, dass Ihr Cluster mit dem übereinstimmt, was Sie angefordert haben, und behebt etwaige Abweichungen.</p></li>
</ul>
<p>Das bedeutet, dass Sie Ihre Milvus-Bereitstellung auf eine vertraute Art und Weise beschreiben können und der Operator die gesamte Detailarbeit der Erstellung von Pods, der Einrichtung von Netzwerken und der Verwaltung des Lebenszyklus übernimmt...</p>
<h2 id="How-the-Milvus-Operator-Works" class="common-anchor-header">Wie der Milvus Operator funktioniert<button data-href="#How-the-Milvus-Operator-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Der Milvus Operator folgt einem geradlinigen Prozess, der die Datenbankverwaltung wesentlich vereinfacht. Schauen wir uns das zentrale Betriebsmodell von Milvus Operator an:</p>
<ol>
<li><p><strong>Benutzerdefinierte Ressource (CR):</strong> Die Benutzer definieren eine Milvus-Bereitstellung mithilfe einer CR (z. B. Art: <code translate="no">Milvus</code>). Diese Datei enthält Konfigurationen wie Clustermodus, Image-Version, Ressourcenanforderungen und Abhängigkeiten.</p></li>
<li><p><strong>Controller-Logik:</strong> Der Controller des Operators sucht nach neuen oder aktualisierten CRs. Sobald er eine Änderung feststellt, orchestriert er die Erstellung der erforderlichen Komponenten - Milvus-Dienste und Abhängigkeiten wie etcd, Pulsar und MinIO.</p></li>
<li><p><strong>Automatisiertes Lebenszyklus-Management:</strong> Bei Änderungen, wie z. B. der Aktualisierung der Version oder der Änderung des Speichers, führt der Operator rollierende Aktualisierungen durch oder konfiguriert Komponenten neu, ohne den Cluster zu unterbrechen.</p></li>
<li><p><strong>Selbstheilung:</strong> Der Controller überprüft kontinuierlich den Zustand der einzelnen Komponenten. Wenn etwas ausfällt, ersetzt er automatisch den Pod oder stellt den Dienststatus wieder her, um die Betriebszeit zu gewährleisten.</p></li>
</ol>
<p>Dieser Ansatz ist viel leistungsfähiger als herkömmliche YAML- oder Helm-Bereitstellungen, da er eine kontinuierliche Verwaltung und nicht nur die Ersteinrichtung ermöglicht.</p>
<h2 id="Why-Use-Milvus-Operator-Instead-of-Helm-or-YAML" class="common-anchor-header">Warum Milvus Operator anstelle von Helm oder YAML verwenden?<button data-href="#Why-Use-Milvus-Operator-Instead-of-Helm-or-YAML" class="anchor-icon" translate="no">
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
    </button></h2><p>Bei der Bereitstellung von Milvus haben Sie die Wahl zwischen manuellen YAML-Dateien, Helm-Diagrammen oder dem Milvus Operator. Jedes hat seine Berechtigung, aber der Operator bietet erhebliche Vorteile für den laufenden Betrieb.</p>
<h3 id="Operation-Automation" class="common-anchor-header">Automatisierung des Betriebs</h3><p>Traditionelle Methoden erfordern manuelle Arbeit für Routineaufgaben. Skalierung bedeutet, dass mehrere Konfigurationsdateien aktualisiert und die Änderungen koordiniert werden müssen. Upgrades müssen sorgfältig geplant werden, um Serviceunterbrechungen zu vermeiden. Der Operator erledigt diese Aufgaben automatisch. Er kann erkennen, wann eine Skalierung erforderlich ist, und die Änderungen sicher durchführen. Upgrades werden zu einfachen Konfigurationsaktualisierungen, die der Operator in der richtigen Reihenfolge und bei Bedarf mit Rollback-Funktionen ausführt.</p>
<h3 id="Better-State-Visibility" class="common-anchor-header">Bessere Statustransparenz</h3><p>YAML-Dateien sagen Kubernetes, was Sie wollen, aber sie zeigen Ihnen nicht den aktuellen Zustand Ihres Systems. Helm hilft bei der Konfigurationsverwaltung, überwacht aber nicht den Laufzeitzustand Ihrer Anwendung. Der Operator überwacht kontinuierlich Ihren gesamten Cluster. Er kann Probleme wie Ressourcenprobleme oder langsame Antworten erkennen und Maßnahmen ergreifen, bevor sie zu ernsthaften Problemen werden. Diese proaktive Überwachung verbessert die Zuverlässigkeit erheblich.</p>
<h3 id="Easier-Long-term-Management" class="common-anchor-header">Leichtere langfristige Verwaltung</h3><p>Die Verwaltung mehrerer Umgebungen mit YAML-Dateien bedeutet, dass viele Konfigurationsdateien synchronisiert werden müssen. Selbst mit Helm-Vorlagen erfordern komplexe Vorgänge immer noch einen erheblichen manuellen Koordinierungsaufwand.</p>
<p>Der Operator kapselt das Milvus-Verwaltungswissen in seinem Code. Das bedeutet, dass Teams Cluster effektiv verwalten können, ohne Experten für jede Komponente zu werden. Die Betriebsschnittstelle bleibt bei der Skalierung Ihrer Infrastruktur konsistent.</p>
<p>Die Verwendung des Operators bedeutet, dass Sie sich für einen stärker automatisierten Ansatz für die Milvus-Verwaltung entscheiden. Er reduziert die manuelle Arbeit und verbessert gleichzeitig die Zuverlässigkeit durch eingebautes Fachwissen - ein unschätzbarer Vorteil, da Vektordatenbanken für Anwendungen immer wichtiger werden.</p>
<h3 id="The-Architecture-of-Milvus-Operation" class="common-anchor-header">Die Architektur von Milvus Operation</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_operator_deployment_architecture_3ff8570480.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Das Diagramm stellt die Bereitstellungsstruktur von Milvus Operator innerhalb eines Kubernetes-Clusters übersichtlich dar:</p>
<ul>
<li><p>Links (blauer Bereich): Kernkomponenten des Operators, einschließlich des Controllers und der Milvus-CRD.</p></li>
<li><p>Rechts (grüner Bereich): Verschiedene Komponenten des Milvus-Clusters, wie der Proxy, Coordinator und Node.</p></li>
<li><p>Mitte (Pfeile - "Erstellen/Verwalten"): Der Ablauf der Operationen zeigt, wie der Operator den Milvus-Cluster verwaltet.</p></li>
<li><p>Unten (Oranger Bereich): Abhängige Dienste wie etcd und MinIO/S3/MQ.</p></li>
</ul>
<p>Diese visuelle Struktur mit deutlich farbigen Blöcken und Richtungspfeilen verdeutlicht effektiv die Interaktionen und den Datenfluss zwischen den verschiedenen Komponenten.</p>
<h2 id="Getting-Started-with-Milvus-Operator" class="common-anchor-header">Erste Schritte mit Milvus Operator<button data-href="#Getting-Started-with-Milvus-Operator" class="anchor-icon" translate="no">
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
    </button></h2><p>Diese Anleitung zeigt Ihnen, wie Sie Milvus mit dem Operator einsetzen können. In dieser Anleitung werden wir diese Versionen verwenden.</p>
<ul>
<li><p><strong>Betriebssystem</strong>: openEuler 22.03 LTS SP3 x86_64</p></li>
<li><p><strong>Kubernetes</strong>: v1.28.8</p></li>
<li><p><strong>Milvus</strong>: v2.5.4</p></li>
</ul>
<h3 id="1-Prerequisites" class="common-anchor-header">(1) Voraussetzungen</h3><p>Ihr Kubernetes-Cluster benötigt mindestens eine konfigurierte StorageClass. Sie können überprüfen, welche verfügbar ist:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> sc
<button class="copy-code-btn"></button></code></pre>
<p>In unserem Beispiel haben wir zwei Optionen:</p>
<ul>
<li><p><code translate="no">local</code> (Standard) - verwendet lokale Festplatten</p></li>
<li><p><code translate="no">nfs-sc</code>- verwendet NFS-Speicher (gut für Tests, aber in der Produktion zu vermeiden)</p></li>
</ul>
<pre><code translate="no">RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
<span class="hljs-built_in">local</span> (default)   openebs.io/local      Delete    WaitForFirstConsumer   <span class="hljs-literal">false</span>    284d
nfs-sc            k8s-sigs.io/nfs-...   Delete    Immediate              <span class="hljs-literal">false</span>    230d
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Installing-Milvus-Operator" class="common-anchor-header">(2) Installation von Milvus Operator</h3><p>Sie können den Operator mit <a href="https://milvus.io/docs/install_cluster-milvusoperator.md#Install-with-Helm">Helm</a> oder <a href="https://milvus.io/docs/install_cluster-milvusoperator.md#Install-with-kubectl">kubectl</a> installieren. Wir werden kubectl verwenden, da es einfacher ist.</p>
<p>Laden Sie das Bereitstellungsmanifest von Operator herunter:</p>
<pre><code translate="no">wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/zilliztech/milvus-operator/main/deploy/manifests/deployment.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>Ersetzen Sie die Adresse des Images (optional):</p>
<p><strong>Optional: Verwenden Sie eine andere Image-Registry</strong>, wenn Sie keinen Zugang zu DockerHub haben oder Ihre eigene Registry bevorzugen:</p>
<p><em>Hinweis: Die hier angegebene Adresse des Image-Repository dient nur zu Testzwecken. Ersetzen Sie sie bei Bedarf durch Ihre tatsächliche Repository-Adresse.</em></p>
<pre><code translate="no">sed -i <span class="hljs-string">&#x27;s#milvusdb/milvus-operator:v1.2.1#registry.milvus-mirror.cn/&amp;#g&#x27;</span> deployment.<span class="hljs-property">yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>Installieren Sie Milvus Operator:</p>
<pre><code translate="no">kubectl apply -f deployment.yaml
<button class="copy-code-btn"></button></code></pre>
<p>Nach der Installation sollten Sie eine Ausgabe ähnlich der folgenden sehen:</p>
<pre><code translate="no">namespace/milvus-operator created
serviceaccount/milvus-operator created
customresourcedefinition.apiextensions.k8s.io/milvusclusters.milvus.io created
customresourcedefinition.apiextensions.k8s.io/milvuses.milvus.io created
customresourcedefinition.apiextensions.k8s.io/milvusupgrades.milvus.io created
clusterrole.rbac.authorization.k8s.io/milvus-operator-manager-role created
clusterrolebinding.rbac.authorization.k8s.io/milvus-operator-manager-rolebinding created
role.rbac.authorization.k8s.io/milvus-operator-leader-election-role created
rolebinding.rbac.authorization.k8s.io/milvus-operator-leader-election-rolebinding created
service/milvus-operator-metrics-service created
service/milvus-operator-webhook-service created
deployment.apps/milvus-operator created
<button class="copy-code-btn"></button></code></pre>
<p>Überprüfen Sie den Einsatz von Milvus Operator und die Pod-Ressourcen:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> deployment,pod -n milvus-<span class="hljs-keyword">operator</span>
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">NAME                              READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/milvus-operator   1/1     1            1           10m
NAME                                   READY   STATUS        RESTARTS   AGE
pod/milvus-operator-54d4fb854b-7hprh   1/1     Running       0          97s
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Deploying-the-Milvus-Cluster" class="common-anchor-header">(3) Bereitstellen des Milvus-Clusters</h3><p>Sobald der Milvus Operator-Pod läuft, können Sie den Milvus-Cluster mit den folgenden Schritten bereitstellen.</p>
<p>Laden Sie das Milvus-Cluster-Bereitstellungsmanifest herunter:</p>
<pre><code translate="no">wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/zilliztech/milvus-operator/main/config/samples/milvus_cluster_default.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>Die Standardkonfiguration ist minimal:</p>
<pre><code translate="no"><span class="hljs-comment"># This is a sample to deploy a milvus cluster in milvus-operator&#x27;s default configurations.</span>
apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: my-release
  labels:
    app: milvus
spec:
  mode: cluster
  dependencies: {}
  components: {}
  config: {}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Für einen echten Einsatz müssen Sie sie anpassen:</strong></p>
<ul>
<li><p>Benutzerdefinierter Cluster-Name: <code translate="no">milvus-release-v25</code></p></li>
<li><p>Custom Image: (um ein anderes Online-Image oder ein lokales Offline-Image zu verwenden) <code translate="no">registry.milvus-mirror.cn/milvusdb/milvus:v2.5.4</code></p></li>
<li><p>Benutzerdefinierter StorageClass-Name: In Umgebungen mit mehreren Speicherklassen müssen Sie möglicherweise die Speicherklasse für persistente Komponenten wie MinIO und etcd angeben. In diesem Beispiel wird <code translate="no">nfs-sc</code> verwendet.</p></li>
<li><p>Benutzerdefinierte Ressourcen: Legen Sie CPU- und Speichergrenzen für Milvus-Komponenten fest. Standardmäßig werden keine Grenzen festgelegt, was zu einer Überlastung Ihrer Kubernetes-Knoten führen kann.</p></li>
<li><p>Automatisches Löschen von verwandten Ressourcen: Wenn der Milvus-Cluster gelöscht wird, werden die zugehörigen Ressourcen standardmäßig beibehalten.</p></li>
</ul>
<p>Für zusätzliche Parameterkonfiguration, siehe:</p>
<ul>
<li><p><a href="https://github.com/zilliztech/milvus-operator/blob/main/docs/CRD/milvus.md">Milvus Benutzerdefinierte Ressourcendefinition</a></p></li>
<li><p><a href="https://artifacthub.io/packages/helm/apache/pulsar/3.3.0?modal=values">Pulsar-Werte</a></p></li>
</ul>
<p>Das geänderte Manifest lautet:</p>
<pre><code translate="no">apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: milvus-release-v25
  labels:
    app: milvus
spec:
  mode: cluster
  config: {}
  components:
    image: registry.milvus-mirror.cn/milvusdb/milvus:v2.5.4
    resources:
      limits:
        cpu: 2
        memory: 8Gi
  dependencies:
    etcd:
      inCluster:
        deletionPolicy: Delete
        pvcDeletion: <span class="hljs-literal">true</span>
        values:
          global:
            imageRegistry: registry.milvus-mirror.cn
            storageClass: nfs-sc
    storage:
      inCluster:
        deletionPolicy: Delete
        pvcDeletion: <span class="hljs-literal">true</span>
        values:
          resources:
            limits:
              cpu: 2
              memory: 8Gi
          image:
            repository: registry.milvus-mirror.cn/milvusdb/minio
            tag: RELEASE.2023-03-20T20-16-18Z
          persistence:
            storageClass: nfs-sc
            accessMode: ReadWriteOnce
            size: 10Gi
    pulsar:
      inCluster:
        chartVersion: pulsar-v3
        deletionPolicy: Delete
        pvcDeletion: <span class="hljs-literal">true</span>
        values:
          existingStorageClassName: nfs-sc
          pulsar_metadata:
            image:
              repository: registry.milvus-mirror.cn/apachepulsar/pulsar
              tag: 3.0.7
          zookeeper:
            replicaCount: 3
            volumes:
              data:
                size: 5Gi
                storageClassName: nfs-sc
          bookkeeper:
            volumes:
              journal:
                size: 5Gi
                storageClassName: nfs-sc
              ledgers:
                size: 5Gi
                storageClassName: nfs-sc
          images:
            zookeeper:
              repository: registry.milvus-mirror.cn/apachepulsar/pulsar
              tag: 3.0.7
            proxy:
              repository: registry.milvus-mirror.cn/apachepulsar/pulsar
              tag: 3.0.7
            broker:
              repository: registry.milvus-mirror.cn/apachepulsar/pulsar
              tag: 3.0.7
            bookie:
              repository: registry.milvus-mirror.cn/apachepulsar/pulsar
              tag: 3.0.7
            autorecovery:
              repository: registry.milvus-mirror.cn/apachepulsar/pulsar
              tag: 3.0.7
<button class="copy-code-btn"></button></code></pre>
<p>Setzen Sie den Milvus-Cluster ein:</p>
<pre><code translate="no">kubectl apply -f milvus_cluster_default.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Verifying-Milvus-Cluster-Status" class="common-anchor-header">Überprüfen des Milvus-Cluster-Status</h4><p>Milvus Operator richtet zunächst die Middleware-Abhängigkeiten für Milvus ein, wie z. B. etcd, Zookeeper, Pulsar und MinIO, bevor die Milvus-Komponenten (z. B. Proxy, Coordinator und Knoten) bereitgestellt werden.</p>
<p>Einsätze ansehen:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> deployment
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">NAME                                    READY   UP-TO-DATE   AVAILABLE   AGE
milvus-release-v25-milvus-datanode      1/1     1            1           52m
milvus-release-v25-milvus-indexnode     1/1     1            1           52m
milvus-release-v25-milvus-mixcoord      1/1     1            1           52m
milvus-release-v25-milvus-proxy         1/1     1            1           52m
milvus-release-v25-milvus-querynode-0   1/1     1            1           52m
milvus-release-v25-milvus-querynode-1   0/0     0            0           52m
milvus-release-v25-milvus-standalone    0/0     0            0           52m
<button class="copy-code-btn"></button></code></pre>
<p>Besonderer Hinweis:</p>
<p>Sie werden feststellen, dass der Milvus Operator einen <code translate="no">standalone</code> und einen <code translate="no">querynode-1</code> Einsatz mit 0 Replikaten erstellt.</p>
<p>Dies ist beabsichtigt. Wir haben eine Anfrage an das Milvus Operator Repository gestellt, die offizielle Antwort ist:</p>
<ul>
<li><p>a. Die Bereitstellungen funktionieren wie erwartet. Die Standalone-Version wird beibehalten, um einen nahtlosen Übergang von einer Cluster- zu einer Standalone-Installation ohne Dienstunterbrechung zu ermöglichen.</p></li>
<li><p>b. Sowohl <code translate="no">querynode-0</code> als auch <code translate="no">querynode-1</code> sind bei Rolling Upgrades nützlich. Am Ende wird nur eine der beiden Versionen aktiv sein.</p></li>
</ul>
<h4 id="Verifying-That-All-Pods-Are-Running-Correctly" class="common-anchor-header">Überprüfen, ob alle Pods ordnungsgemäß ausgeführt werden</h4><p>Sobald Ihr Milvus-Cluster bereit ist, überprüfen Sie, ob alle Pods wie erwartet laufen:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> pods
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">NAME                                                    READY   STATUS      RESTARTS        AGE
milvus-release-v25-etcd<span class="hljs-number">-0</span>                               <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m15s
milvus-release-v25-etcd<span class="hljs-number">-1</span>                               <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m15s
milvus-release-v25-etcd<span class="hljs-number">-2</span>                               <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m15s
milvus-release-v25-milvus-datanode<span class="hljs-number">-65b</span>ff7b4d9<span class="hljs-number">-9</span>h2xv     <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">4</span>m35s
milvus-release-v25-milvus-indexnode<span class="hljs-number">-5b</span>5cbb4cdc-cxvwj    <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">4</span>m35s
milvus-release-v25-milvus-mixcoord<span class="hljs-number">-64488898b</span>5-r76rw     <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">4</span>m35s
milvus-release-v25-milvus-proxy<span class="hljs-number">-5</span>c7fbcb69-cqmq4         <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">4</span>m35s
milvus-release-v25-milvus-querynode<span class="hljs-number">-0</span>-bc6f57d64-k2wnt   <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">4</span>m35s
milvus-release-v25-minio<span class="hljs-number">-0</span>                              <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m14s
milvus-release-v25-minio<span class="hljs-number">-1</span>                              <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m14s
milvus-release-v25-minio<span class="hljs-number">-2</span>                              <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m14s
milvus-release-v25-minio<span class="hljs-number">-3</span>                              <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m14s
milvus-release-v25-pulsar-bookie<span class="hljs-number">-0</span>                      <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-bookie<span class="hljs-number">-1</span>                      <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-bookie<span class="hljs-number">-2</span>                      <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-bookie-<span class="hljs-keyword">init</span><span class="hljs-number">-5</span>zf2z             <span class="hljs-number">0</span>/<span class="hljs-number">1</span>     Completed   <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-broker<span class="hljs-number">-0</span>                      <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-broker<span class="hljs-number">-1</span>                      <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-proxy<span class="hljs-number">-0</span>                       <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-proxy<span class="hljs-number">-1</span>                       <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-pulsar-<span class="hljs-keyword">init</span>-twznd             <span class="hljs-number">0</span>/<span class="hljs-number">1</span>     Completed   <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-recovery<span class="hljs-number">-0</span>                    <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">1</span> (<span class="hljs-number">6</span>m25s ago)   <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-zookeeper<span class="hljs-number">-0</span>                   <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-zookeeper<span class="hljs-number">-1</span>                   <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-zookeeper<span class="hljs-number">-2</span>                   <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
<button class="copy-code-btn"></button></code></pre>
<h4 id="Verifying-the-StorageClass" class="common-anchor-header">Überprüfen der StorageClass</h4><p>Stellen Sie sicher, dass Ihre benutzerdefinierte StorageClass (<code translate="no">nfs-sc</code>) und die angegebenen Speicherkapazitäten korrekt angewendet wurden:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> pvc
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-variable constant_">NAME</span>                                                                             <span class="hljs-variable constant_">STATUS</span>   <span class="hljs-variable constant_">VOLUME</span>                                     <span class="hljs-variable constant_">CAPACITY</span>   <span class="hljs-variable constant_">ACCESS</span> <span class="hljs-variable constant_">MODES</span>   <span class="hljs-variable constant_">STORAGECLASS</span>   <span class="hljs-variable constant_">AGE</span>
data-milvus-release-v25-etcd-<span class="hljs-number">0</span>                                                   <span class="hljs-title class_">Bound</span>    pvc-3273f9ec-819f-<span class="hljs-number">4e84</span>-bdbe-3cd9df697a5f   10Gi       <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
data-milvus-release-v25-etcd-<span class="hljs-number">1</span>                                                   <span class="hljs-title class_">Bound</span>    pvc-01743e13-a989-4aea-8fd0-632ea8b13f98   10Gi       <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
data-milvus-release-v25-etcd-<span class="hljs-number">2</span>                                                   <span class="hljs-title class_">Bound</span>    pvc-594f1a63-efba-<span class="hljs-number">4993</span>-<span class="hljs-number">89e6</span>-3ee5e333073d   10Gi       <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
<span class="hljs-keyword">export</span>-milvus-release-v25-minio-<span class="hljs-number">0</span>                                                <span class="hljs-title class_">Bound</span>    pvc-477d4e3b-69d7-4bbe-80f7-b747dc4c79f7   10Gi       <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
<span class="hljs-keyword">export</span>-milvus-release-v25-minio-<span class="hljs-number">1</span>                                                <span class="hljs-title class_">Bound</span>    pvc-b12e46fa-8d29-48fb-9ac1-98f80d67b543   10Gi       <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
<span class="hljs-keyword">export</span>-milvus-release-v25-minio-<span class="hljs-number">2</span>                                                <span class="hljs-title class_">Bound</span>    pvc-2e67893e-<span class="hljs-number">9611</span>-43dd-<span class="hljs-number">9550</span>-b3a7705699ae   10Gi       <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
<span class="hljs-keyword">export</span>-milvus-release-v25-minio-<span class="hljs-number">3</span>                                                <span class="hljs-title class_">Bound</span>    pvc-572c4565-bc38-<span class="hljs-number">4215</span>-a13c-061d9199fdea   10Gi       <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-bookie-journal-milvus-release-v25-pulsar-bookie-<span class="hljs-number">0</span>      <span class="hljs-title class_">Bound</span>    pvc-183eff99-7a87-406d-9f17-b0fb30c7c0b3   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-bookie-journal-milvus-release-v25-pulsar-bookie-<span class="hljs-number">1</span>      <span class="hljs-title class_">Bound</span>    pvc-ebe32304-7d92-44d1-b6fb-4cbaf3207d25   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-bookie-journal-milvus-release-v25-pulsar-bookie-<span class="hljs-number">2</span>      <span class="hljs-title class_">Bound</span>    pvc-2ead9186-3d44-4faa-9ae7-784be7ecf6d2   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-bookie-ledgers-milvus-release-v25-pulsar-bookie-<span class="hljs-number">0</span>      <span class="hljs-title class_">Bound</span>    pvc-ff1b632d-0a66-4c13-a3bb-2550f9307614   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-bookie-ledgers-milvus-release-v25-pulsar-bookie-<span class="hljs-number">1</span>      <span class="hljs-title class_">Bound</span>    pvc-<span class="hljs-number">57159e85</span>-bb48-48a9-<span class="hljs-number">9706</span>-7a95af8da157   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-bookie-ledgers-milvus-release-v25-pulsar-bookie-<span class="hljs-number">2</span>      <span class="hljs-title class_">Bound</span>    pvc-eb235f29-afbd-4a40-9a7d-0340a9686053   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-zookeeper-data-milvus-release-v25-pulsar-zookeeper-<span class="hljs-number">0</span>   <span class="hljs-title class_">Bound</span>    pvc-<span class="hljs-number">40e02974</span>-3b7d-4f42-bfa7-3252b7615a36   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-zookeeper-data-milvus-release-v25-pulsar-zookeeper-<span class="hljs-number">1</span>   <span class="hljs-title class_">Bound</span>    pvc-<span class="hljs-number">75904229</span>-3bbf-458e-b0e3-3982e430621b   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-zookeeper-data-milvus-release-v25-pulsar-zookeeper-<span class="hljs-number">2</span>   <span class="hljs-title class_">Bound</span>    pvc-2e068b79-75ac-4aa9-<span class="hljs-number">9e90</span>-423ff399bad0   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
<button class="copy-code-btn"></button></code></pre>
<h4 id="Verifying-Milvus-Resource-Limits" class="common-anchor-header">Überprüfen der Milvus-Ressourcenlimits</h4><p>Um beispielsweise zu überprüfen, ob die Ressourcenlimits für die Komponente <code translate="no">mixcoord</code> korrekt angewandt wurden, führen Sie aus:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> deployment milvus-release-v25-milvus-mixcoord -o jsonpath=<span class="hljs-string">&#x27;{.spec.template.spec.containers[*].resources.limits}&#x27;</span> | jq
{
  <span class="hljs-string">&quot;cpu&quot;</span>: <span class="hljs-string">&quot;2&quot;</span>,
  <span class="hljs-string">&quot;memory&quot;</span>: <span class="hljs-string">&quot;8Gi&quot;</span>
}
<button class="copy-code-btn"></button></code></pre>
<h4 id="Verifying-the-Custom-Image" class="common-anchor-header">Überprüfen des benutzerdefinierten Images</h4><p>Bestätigen Sie, dass das richtige benutzerdefinierte Image verwendet wird:</p>
<pre><code translate="no">kubectl get deployment milvus-release-v25-milvus-mixcoord -o jsonpath=<span class="hljs-string">&#x27;{.spec.template.spec.containers[0].image}&#x27;</span>
registry.milvus-mirror.cn/milvusdb/milvus:v2.5.4
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Accessing-Your-Cluster-from-Outside" class="common-anchor-header">(4) Zugriff auf Ihren Cluster von außerhalb</h3><p>Eine häufige Frage ist: Wie können Sie von außerhalb Ihres Kubernetes-Clusters auf Milvus-Dienste zugreifen?</p>
<p>Standardmäßig ist der vom Operator bereitgestellte Milvus-Dienst vom Typ <code translate="no">ClusterIP</code>, d. h. er ist nur innerhalb des Clusters zugänglich. Um ihn extern zugänglich zu machen, müssen Sie eine externe Zugriffsmethode definieren. Diese Anleitung wählt den einfachsten Ansatz: die Verwendung eines NodePort.</p>
<p>Erstellen und bearbeiten Sie das Dienstmanifest für den externen Zugriff:</p>
<pre><code translate="no">vi milvus-external-svc.yaml
<button class="copy-code-btn"></button></code></pre>
<p>Fügen Sie den folgenden Inhalt ein:</p>
<pre><code translate="no">kind: Service
apiVersion: v1
metadata:
  name: milvus-release-v25-external-svc
  namespace: default
  labels:
    app: dmilvus-release-v25-external-svc
spec:
  ports:
    - name: milvus
      protocol: TCP
      port: 19530
      targetPort: 19530
      nodePort: 31530
    - name: milvus-web
      protocol: TCP
      port: 9091
      targetPort: 9091
      nodePort: 31531
  selector:
    app.kubernetes.io/component: proxy
    app.kubernetes.io/instance: milvus-release-v25
    app.kubernetes.io/name: milvus
  clusterIP:
  <span class="hljs-built_in">type</span>: NodePort
<button class="copy-code-btn"></button></code></pre>
<ol>
<li>Wenden Sie das Manifest des externen Dienstes an:</li>
</ol>
<pre><code translate="no">kubectl apply -f milvus-external-svc.yaml
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>Überprüfen Sie den Status des externen Dienstes:</li>
</ol>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> svc
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">NAME                                  TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)                                                       AGE
milvus-release-v25-external-svc       NodePort    <span class="hljs-number">10.233</span><span class="hljs-number">.8</span><span class="hljs-number">.166</span>    &lt;none&gt;        <span class="hljs-number">19530</span>:<span class="hljs-number">31530</span>/TCP,<span class="hljs-number">9091</span>:<span class="hljs-number">31531</span>/TCP                                43s
milvus-release-v25-etcd               ClusterIP   <span class="hljs-number">10.233</span><span class="hljs-number">.27</span><span class="hljs-number">.134</span>   &lt;none&gt;        <span class="hljs-number">2379</span>/TCP,<span class="hljs-number">2380</span>/TCP                                             16m
milvus-release-v25-etcd-headless      ClusterIP   <span class="hljs-literal">None</span>            &lt;none&gt;        <span class="hljs-number">2379</span>/TCP,<span class="hljs-number">2380</span>/TCP                                             16m
milvus-release-v25-milvus             ClusterIP   <span class="hljs-number">10.233</span><span class="hljs-number">.55</span><span class="hljs-number">.194</span>   &lt;none&gt;        <span class="hljs-number">19530</span>/TCP,<span class="hljs-number">9091</span>/TCP                                            13m
milvus-release-v25-minio              ClusterIP   <span class="hljs-number">10.233</span><span class="hljs-number">.1</span><span class="hljs-number">.56</span>     &lt;none&gt;        <span class="hljs-number">9000</span>/TCP                                                      16m
milvus-release-v25-minio-svc          ClusterIP   <span class="hljs-literal">None</span>            &lt;none&gt;        <span class="hljs-number">9000</span>/TCP                                                      16m
milvus-release-v25-pulsar-bookie      ClusterIP   <span class="hljs-literal">None</span>            &lt;none&gt;        <span class="hljs-number">3181</span>/TCP,<span class="hljs-number">8000</span>/TCP                                             16m
milvus-release-v25-pulsar-broker      ClusterIP   <span class="hljs-literal">None</span>            &lt;none&gt;        <span class="hljs-number">8080</span>/TCP,<span class="hljs-number">6650</span>/TCP                                             16m
milvus-release-v25-pulsar-proxy       ClusterIP   <span class="hljs-number">10.233</span><span class="hljs-number">.30</span><span class="hljs-number">.132</span>   &lt;none&gt;        <span class="hljs-number">80</span>/TCP,<span class="hljs-number">6650</span>/TCP                                               16m
milvus-release-v25-pulsar-recovery    ClusterIP   <span class="hljs-literal">None</span>            &lt;none&gt;        <span class="hljs-number">8000</span>/TCP                                                      16m
milvus-release-v25-pulsar-zookeeper   ClusterIP   <span class="hljs-literal">None</span>            &lt;none&gt;        <span class="hljs-number">8000</span>/TCP,<span class="hljs-number">2888</span>/TCP,<span class="hljs-number">3888</span>/TCP,<span class="hljs-number">2181</span>/TCP                           16m
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li>Zugriff auf Milvus WebUI</li>
</ol>
<p>Milvus bietet ein eingebautes GUI - das Milvus WebUI - das die Beobachtbarkeit mit einer intuitiven Schnittstelle verbessert. Verwenden Sie es, um Metriken für Milvus-Komponenten und ihre Abhängigkeiten zu überwachen, detaillierte Informationen über Datenbanken und Sammlungen zu prüfen und vollständige Konfigurationsdetails zu untersuchen. Weitere Einzelheiten finden Sie in der <a href="https://milvus.io/docs/milvus-webui.md">offiziellen Milvus WebUI-Dokumentation</a>.</p>
<p>Öffnen Sie nach der Bereitstellung die folgende URL in Ihrem Browser (ersetzen Sie <code translate="no">&lt;any_k8s_node_IP&gt;</code> durch die IP-Adresse eines beliebigen Kubernetes-Knotens):</p>
<p><code translate="no">http://&lt;any_k8s_node_IP&gt;:31531/webui/</code></p>
<p>Dadurch wird die WebUI-Oberfläche gestartet.</p>
<h2 id="Conclusion" class="common-anchor-header">Schlussfolgerung<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Milvus Operator</strong> ist mehr als nur ein Bereitstellungstool - es ist eine strategische Investition in die operative Exzellenz der Vector-Datenbankinfrastruktur. Durch die Automatisierung von Routineaufgaben und die Einbettung von Best Practices in Ihre Kubernetes-Umgebung können sich die Teams auf das Wesentliche konzentrieren: die Entwicklung und Verbesserung von KI-gesteuerten Anwendungen.</p>
<p>Die Einführung des Operator-basierten Managements erfordert einige Vorleistungen, einschließlich Änderungen an Workflows und Teamprozessen. Aber für Unternehmen, die in großem Maßstab arbeiten oder dies planen, sind die langfristigen Vorteile beträchtlich: höhere Zuverlässigkeit, geringerer betrieblicher Aufwand und schnellere, konsistentere Bereitstellungszyklen.</p>
<p>Da KI zum Kernstück moderner Geschäftsabläufe wird, steigt der Bedarf an einer robusten, skalierbaren Vektordatenbankinfrastruktur. Der Milvus Operator unterstützt diese Entwicklung, indem er einen ausgereiften, automatisierungsorientierten Ansatz bietet, der mit Ihrer Arbeitslast skaliert und sich an Ihre spezifischen Anforderungen anpasst.</p>
<p>Wenn Ihr Team mit betrieblicher Komplexität konfrontiert ist, mit Wachstum rechnet oder einfach die manuelle Verwaltung der Infrastruktur reduzieren möchte, kann die frühzeitige Einführung des Milvus Operator dazu beitragen, zukünftige technische Schulden zu vermeiden und die allgemeine Systemstabilität zu verbessern.</p>
<p>Die Zukunft der Infrastruktur ist intelligent, automatisiert und entwicklerfreundlich. <strong>Milvus Operator bringt diese Zukunft in Ihre Datenbankschicht - und das schon heute.</strong></p>
<hr>
