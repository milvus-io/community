---
id: deploy-milvus-on-kubernetes-step-by-step-guide-for-k8s-users.md
title: >-
  Einsatz von Milvus auf Kubernetes: Eine Schritt-für-Schritt-Anleitung für
  Kubernetes-Benutzer
author: Gael Gu
date: 2024-09-26T00:00:00.000Z
desc: >-
  Dieser Leitfaden bietet eine klare, schrittweise Anleitung für die Einrichtung
  von Milvus auf Kubernetes unter Verwendung des Milvus Operators.
cover: >-
  assets.zilliz.com/Deploying_Milvus_on_Kubernetes_A_Step_by_Step_Guide_for_Kubernetes_Users_4193487867.png
tag: Engineering
tags: 'Vector Databases, Milvus, RAG, LLM, K8s Deployment'
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/deploy-milvus-on-kubernetes-step-by-step-guide-for-k8s-users.md
---
<p><a href="https://zilliz.com/what-is-milvus"><strong>Milvus</strong></a> ist eine <a href="https://zilliz.com/learn/what-is-vector-database">Open-Source-Vektordatenbank</a>, die zum Speichern, Indizieren und Durchsuchen riesiger Mengen <a href="https://zilliz.com/learn/introduction-to-unstructured-data">unstrukturierter Daten</a> durch Vektordarstellungen entwickelt wurde. Damit eignet sie sich perfekt für KI-gesteuerte Anwendungen wie Ähnlichkeitssuche, <a href="https://zilliz.com/glossary/semantic-search">semantische Suche</a>, Retrieval Augmented Generation<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">(RAG</a>), Empfehlungsmaschinen und andere maschinelle Lernaufgaben.</p>
<p>Was Milvus jedoch noch leistungsfähiger macht, ist seine nahtlose Integration in Kubernetes. Wenn Sie ein Kubernetes-Kenner sind, wissen Sie, dass die Plattform perfekt für die Orchestrierung skalierbarer, verteilter Systeme ist. Milvus nutzt die Möglichkeiten von Kubernetes in vollem Umfang und ermöglicht Ihnen die einfache Bereitstellung, Skalierung und Verwaltung verteilter Milvus-Cluster. Dieser Leitfaden bietet eine klare, schrittweise Anleitung für die Einrichtung von Milvus auf Kubernetes unter Verwendung des Milvus Operators.</p>
<h2 id="Prerequisites" class="common-anchor-header">Voraussetzungen<button data-href="#Prerequisites" class="anchor-icon" translate="no">
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
    </button></h2><p>Bevor wir beginnen, sollten Sie sicherstellen, dass die folgenden Voraussetzungen erfüllt sind:</p>
<ul>
<li><p>Ein Kubernetes-Cluster ist eingerichtet und läuft. Wenn Sie lokal testen, ist <code translate="no">minikube</code> eine gute Wahl.</p></li>
<li><p><code translate="no">kubectl</code> Die Kubernetes-Software ist installiert und so konfiguriert, dass sie mit Ihrem Kubernetes-Cluster interagiert.</p></li>
<li><p>Vertrautheit mit grundlegenden Kubernetes-Konzepten wie Pods, Services und Deployments.</p></li>
</ul>
<h2 id="Step-1-Installing-Minikube-For-Local-Testing" class="common-anchor-header">Schritt 1: Installieren von Minikube (für lokale Tests)<button data-href="#Step-1-Installing-Minikube-For-Local-Testing" class="anchor-icon" translate="no">
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
    </button></h2><p>Wenn Sie eine lokale Kubernetes-Umgebung einrichten müssen, ist <code translate="no">minikube</code> das richtige Tool für Sie. Offizielle Installationsanweisungen finden Sie auf der <a href="https://minikube.sigs.k8s.io/docs/start/">Seite minikube getting started</a>.</p>
<h3 id="1-Install-Minikube" class="common-anchor-header">1. Minikube installieren</h3><p>Besuchen Sie die<a href="https://github.com/kubernetes/minikube/releases"> minikube releases Seite</a> und laden Sie die passende Version für Ihr Betriebssystem herunter. Für macOS/Linux können Sie den folgenden Befehl verwenden:</p>
<pre><code translate="no">$ curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
$ <span class="hljs-built_in">sudo</span> install minikube-linux-amd64 /usr/local/bin/minikube &amp;&amp; <span class="hljs-built_in">rm</span> minikube-linux-amd64
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Start-Minikube" class="common-anchor-header">2. Starten Sie Minikube</h3><pre><code translate="no">$ minikube start
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Interact-with-Cluster" class="common-anchor-header">3. Mit Cluster interagieren</h3><p>Nun können Sie mit kubectl innerhalb von minikube mit Ihren Clustern interagieren. Wenn Sie kubectl nicht installiert haben, wird minikube die entsprechende Version standardmäßig herunterladen.</p>
<pre><code translate="no">$ minikube kubectl cluster-info
<button class="copy-code-btn"></button></code></pre>
<p>Alternativ können Sie einen symbolischen Link zu minikube's Binary mit dem Namen <code translate="no">kubectl</code> erstellen, um die Benutzung zu erleichtern.</p>
<pre><code translate="no">$ <span class="hljs-built_in">sudo</span> <span class="hljs-built_in">ln</span> -s $(<span class="hljs-built_in">which</span> minikube) /usr/local/bin/kubectl
$ kubectl cluster-info
<button class="copy-code-btn"></button></code></pre>
<h2 id="Step-2-Configuring-the-StorageClass" class="common-anchor-header">Schritt 2: Konfigurieren der StorageClass<button data-href="#Step-2-Configuring-the-StorageClass" class="anchor-icon" translate="no">
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
    </button></h2><p>In Kubernetes definiert eine <strong>StorageClass</strong> die für Ihre Workloads verfügbaren Speichertypen und bietet so Flexibilität bei der Verwaltung verschiedener Speicherkonfigurationen. Bevor Sie fortfahren, müssen Sie sicherstellen, dass eine Standard-StorageClass in Ihrem Cluster verfügbar ist. Im Folgenden erfahren Sie, wie Sie eine solche überprüfen und gegebenenfalls konfigurieren.</p>
<h3 id="1-Check-Installed-StorageClasses" class="common-anchor-header">1. Überprüfen der installierten StorageClasses</h3><p>Um die verfügbaren StorageClasses in Ihrem Kubernetes-Cluster zu sehen, führen Sie den folgenden Befehl aus:</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> sc
<button class="copy-code-btn"></button></code></pre>
<p>Dadurch wird die Liste der in Ihrem Cluster installierten Speicherklassen angezeigt. Wenn bereits eine Standard-StorageClass konfiguriert ist, wird sie mit <code translate="no">(default)</code> markiert.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/storage_classes_installed_in_your_cluster_21d36d6ac8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Configure-a-Default-StorageClass-if-necessary" class="common-anchor-header">2. Konfigurieren Sie eine Standard-StorageClass (falls erforderlich)</h3><p>Ist keine Standard-StorageClass eingestellt, können Sie eine solche in einer YAML-Datei definieren. Verwenden Sie das folgende Beispiel, um eine Standard-StorageClass zu erstellen:</p>
<pre><code translate="no"><span class="hljs-attr">apiVersion</span>: storage.<span class="hljs-property">k8s</span>.<span class="hljs-property">io</span>/v1
<span class="hljs-attr">kind</span>: <span class="hljs-title class_">StorageClass</span>
<span class="hljs-attr">metadata</span>:
 <span class="hljs-attr">name</span>: <span class="hljs-keyword">default</span>-storage<span class="hljs-keyword">class</span>
<span class="hljs-title class_">provisioner</span>: k8s.<span class="hljs-property">io</span>/minikube-hostpath
<button class="copy-code-btn"></button></code></pre>
<p>Diese YAML-Konfiguration definiert eine <code translate="no">StorageClass</code> mit dem Namen <code translate="no">default-storageclass</code>, die den in lokalen Entwicklungsumgebungen häufig verwendeten Provisioner <code translate="no">minikube-hostpath</code> verwendet.</p>
<h3 id="3-Apply-the-StorageClass" class="common-anchor-header">3. Anwenden der StorageClass</h3><p>Sobald die Datei <code translate="no">default-storageclass.yaml</code> erstellt ist, wenden Sie sie mit dem folgenden Befehl auf Ihren Cluster an:</p>
<pre><code translate="no">$ kubectl apply -f <span class="hljs-keyword">default</span>-storageclass.<span class="hljs-property">yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>Dadurch wird die Standard-StorageClass für Ihren Cluster eingerichtet und sichergestellt, dass Ihre Speicheranforderungen in Zukunft ordnungsgemäß verwaltet werden.</p>
<h2 id="Step-3-Installing-Milvus-Using-the-Milvus-Operator" class="common-anchor-header">Schritt 3: Installieren von Milvus mit dem Milvus Operator<button data-href="#Step-3-Installing-Milvus-Using-the-Milvus-Operator" class="anchor-icon" translate="no">
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
    </button></h2><p>Der Milvus Operator vereinfacht die Bereitstellung von Milvus auf Kubernetes und verwaltet die Bereitstellung, Skalierung und Updates. Bevor Sie den Milvus Operator installieren, müssen Sie den <strong>cert-manager</strong> installieren, der Zertifikate für den Webhook-Server bereitstellt, der vom Milvus Operator verwendet wird.</p>
<h3 id="1-Install-cert-manager" class="common-anchor-header">1. cert-manager installieren</h3><p>Milvus Operator benötigt einen <a href="https://cert-manager.io/docs/installation/supported-releases/">cert-manager</a>, um Zertifikate für die sichere Kommunikation zu verwalten. Stellen Sie sicher, dass Sie <strong>cert-manager Version 1.1.3</strong> oder höher installieren. Führen Sie den folgenden Befehl aus, um ihn zu installieren:</p>
<pre><code translate="no">$ kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.5.3/cert-manager.yaml
<button class="copy-code-btn"></button></code></pre>
<p>Überprüfen Sie nach der Installation, ob die cert-manager-Pods ausgeführt werden, indem Sie diesen Befehl ausführen:</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> pods -n cert-manager
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/verify_that_the_cert_manager_pods_are_running_bb44c2b6d5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Install-the-Milvus-Operator" class="common-anchor-header">2. Installieren Sie den Milvus Operator</h3><p>Sobald der cert-manager läuft, können Sie den Milvus Operator installieren. Führen Sie den folgenden Befehl aus, um ihn mit <code translate="no">kubectl</code> zu installieren:</p>
<pre><code translate="no">$ kubectl apply -f <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/zilliztech/milvus-operator/main/deploy/manifests/deployment.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>Mit dem folgenden Befehl können Sie überprüfen, ob der Milvus Operator-Pod ausgeführt wird:</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> pods -n milvus-<span class="hljs-keyword">operator</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/check_if_the_Milvus_Operator_pod_is_running_6e7ac41ebf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="3-Deploy-Milvus-Cluster" class="common-anchor-header">3. Milvus Cluster bereitstellen</h3><p>Sobald der Milvus Operator-Pod läuft, können Sie einen Milvus-Cluster mit dem Operator bereitstellen. Mit dem folgenden Befehl wird ein Milvus-Cluster mit seinen Komponenten und Abhängigkeiten in separaten Pods mit Standardkonfigurationen bereitgestellt:</p>
<pre><code translate="no">$ kubectl apply -f <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/zilliztech/milvus-operator/main/config/samples/milvus_cluster_default.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Deploy_Milvus_Cluster_8b5d5343af.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Um die Milvus-Einstellungen anzupassen, müssen Sie die YAML-Datei durch Ihre eigene Konfigurations-YAML-Datei ersetzen. Neben der manuellen Bearbeitung oder Erstellung der Datei können Sie auch das Milvus Sizing Tool verwenden, um die Konfigurationen anzupassen und anschließend die entsprechende YAML-Datei herunterzuladen.</p>
<p>Alternativ können Sie auch das <a href="https://milvus.io/tools/sizing"><strong>Milvus Sizing Tool</strong></a> verwenden, um den Vorgang zu beschleunigen. Mit diesem Tool können Sie verschiedene Einstellungen, wie z.B. Ressourcenzuweisung und Speicheroptionen, anpassen und anschließend die entsprechende YAML-Datei mit Ihren gewünschten Konfigurationen herunterladen. Dadurch wird sichergestellt, dass Ihre Milvus-Bereitstellung für Ihren spezifischen Anwendungsfall optimiert ist.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Milvus_sizing_tool_024693df9d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Abbildung: Milvus-Sizing-Tool</p>
<p>Es kann einige Zeit dauern, bis die Bereitstellung abgeschlossen ist. Sie können den Status Ihres Milvus-Clusters über den Befehl überprüfen:</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> milvus my-release
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/check_the_status_of_your_Milvus_cluster_bcbd85fd70.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Sobald Ihr Milvus-Cluster bereit ist, sollten alle Pods im Milvus-Cluster laufen oder abgeschlossen sein:</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> pods
<button class="copy-code-btn"></button></code></pre>
<h2 id="Step-4-Accessing-Your-Milvus-Cluster" class="common-anchor-header">Schritt 4: Zugriff auf Ihren Milvus-Cluster<button data-href="#Step-4-Accessing-Your-Milvus-Cluster" class="anchor-icon" translate="no">
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
    </button></h2><p>Sobald Ihr Milvus-Cluster bereitgestellt ist, müssen Sie auf ihn zugreifen, indem Sie einen lokalen Port an den Milvus-Service-Port weiterleiten. Führen Sie die folgenden Schritte aus, um den Service-Port abzurufen und die Portweiterleitung einzurichten.</p>
<h4 id="1-Get-the-Service-Port" class="common-anchor-header"><strong>1. Abrufen des Service-Ports</strong></h4><p>Ermitteln Sie zunächst den Service-Port mit dem folgenden Befehl. Ersetzen Sie <code translate="no">&lt;YOUR_MILVUS_PROXY_POD&gt;</code> durch den Namen Ihres Milvus-Proxy-Pods, der normalerweise mit <code translate="no">my-release-milvus-proxy-</code> beginnt:</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> pod &lt;YOUR_MILVUS_PROXY_POD&gt; --template =<span class="hljs-string">&#x27;{{(index (index .spec.containers 0).ports 0).containerPort}}{{&quot;\n&quot;}}&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Dieser Befehl gibt die Portnummer zurück, die Ihr Milvus-Dienst verwendet.</p>
<h4 id="2-Forward-the-Port" class="common-anchor-header"><strong>2. Weiterleitung des Ports</strong></h4><p>Um lokal auf Ihren Milvus-Cluster zuzugreifen, leiten Sie mit dem folgenden Befehl einen lokalen Port an den Port des Dienstes weiter. Ersetzen Sie <code translate="no">&lt;YOUR_LOCAL_PORT&gt;</code> durch den lokalen Port, den Sie verwenden möchten, und <code translate="no">&lt;YOUR_SERVICE_PORT&gt;</code> durch den im vorherigen Schritt abgerufenen Service-Port:</p>
<pre><code translate="no">$ kubectl port-forward --address 0.0.0.0 service/my-release-milvus &lt;YOUR_LOCAL_PORT&gt;:&lt;YOUR_SERVICE_PORT&gt;
<button class="copy-code-btn"></button></code></pre>
<p>Mit diesem Befehl kann die Port-Weiterleitung alle IP-Adressen des Host-Rechners abhören. Wenn der Dienst nur <code translate="no">localhost</code> abhören soll, können Sie die Option <code translate="no">--address 0.0.0.0</code> weglassen.</p>
<p>Sobald die Port-Weiterleitung eingerichtet ist, können Sie für weitere Operationen oder Integrationen über den angegebenen lokalen Port auf Ihren Milvus-Cluster zugreifen.</p>
<h2 id="Step-5-Connecting-to-Milvus-Using-Python-SDK" class="common-anchor-header">Schritt 5: Verbindung zu Milvus mit Python SDK<button data-href="#Step-5-Connecting-to-Milvus-Using-Python-SDK" class="anchor-icon" translate="no">
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
    </button></h2><p>Nachdem Ihr Milvus-Cluster eingerichtet und in Betrieb ist, können Sie nun mit Hilfe eines beliebigen Milvus-SDKs mit ihm interagieren. In diesem Beispiel verwenden wir <a href="https://zilliz.com/blog/what-is-pymilvus">PyMilvus</a>, das <strong>Python-SDK</strong> von Milvus <strong>,</strong> um uns mit dem Cluster zu verbinden und grundlegende Operationen durchzuführen.</p>
<h3 id="1-Install-PyMilvus" class="common-anchor-header">1. PyMilvus installieren</h3><p>Um mit Milvus über Python zu interagieren, müssen Sie das Paket <code translate="no">pymilvus</code> installieren:</p>
<pre><code translate="no">$ pip install pymilvus
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Connect-to-Milvus" class="common-anchor-header">2. Verbindung zu Milvus herstellen</h3><p>Im Folgenden finden Sie ein Beispiel für ein Python-Skript, das eine Verbindung zu Ihrem Milvus-Cluster herstellt und die Durchführung grundlegender Operationen wie das Erstellen einer Sammlung demonstriert.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-comment"># Connect to the Milvus server</span>
client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:&lt;YOUR_LOCAL_PORT&gt;&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-comment"># Create a collection</span>
collection_name = <span class="hljs-string">&quot;example_collection&quot;</span>
<span class="hljs-keyword">if</span> client.has_collection(collection_name):
   client.drop_collection(collection_name)
client.create_collection(
   collection_name=collection_name,
   dimension=<span class="hljs-number">768</span>,  <span class="hljs-comment"># The vectors we will use in this demo has 768 dimensions</span>
)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Explanation" class="common-anchor-header">Erläuterung:</h4><ul>
<li><p>Verbindung zu Milvus herstellen: Das Skript stellt eine Verbindung zum Milvus-Server her, der auf <code translate="no">localhost</code> läuft, wobei der lokale Port verwendet wird, den Sie in Schritt 4 eingerichtet haben.</p></li>
<li><p>Erstellen Sie eine Sammlung: Es prüft, ob eine Sammlung mit dem Namen <code translate="no">example_collection</code> bereits existiert, löscht sie, wenn dies der Fall ist, und erstellt dann eine neue Sammlung mit Vektoren der Dimension 768.</p></li>
</ul>
<p>Dieses Skript stellt eine Verbindung zum Milvus-Cluster her und erstellt eine Sammlung, die als Ausgangspunkt für komplexere Operationen wie das Einfügen von Vektoren und die Durchführung von Ähnlichkeitssuchen dient.</p>
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
    </button></h2><p>Der Einsatz von Milvus in einem verteilten Setup auf Kubernetes erschließt leistungsstarke Funktionen für die Verwaltung umfangreicher Vektordaten und ermöglicht nahtlose Skalierbarkeit und leistungsstarke KI-gesteuerte Anwendungen. In diesem Leitfaden haben Sie gelernt, wie Sie Milvus mit dem Milvus Operator einrichten und so den Prozess rationalisieren und effizient gestalten können.</p>
<p>Wenn Sie Milvus weiter erkunden, sollten Sie in Erwägung ziehen, Ihren Cluster zu skalieren, um wachsenden Anforderungen gerecht zu werden, oder ihn auf Cloud-Plattformen wie Amazon EKS, Google Cloud oder Microsoft Azure bereitzustellen. Für eine verbesserte Verwaltung und Überwachung bieten Tools wie <a href="https://milvus.io/docs/milvus_backup_overview.md"><strong>Milvus Backup</strong></a>, <a href="https://milvus.io/docs/birdwatcher_overview.md"><strong>Birdwatcher</strong></a> und <a href="https://github.com/zilliztech/attu"><strong>Attu</strong></a> wertvolle Unterstützung bei der Aufrechterhaltung des Zustands und der Leistung Ihrer Bereitstellungen.</p>
<p>Sie sind nun bereit, das volle Potenzial von Milvus auf Kubernetes zu nutzen - viel Spaß beim Deployment! 🚀</p>
<h2 id="Further-Resources" class="common-anchor-header">Weitere Ressourcen<button data-href="#Further-Resources" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><p><a href="https://milvus.io/docs/overview.md">Milvus-Dokumentation</a></p></li>
<li><p><a href="https://zilliz.com/blog/choose-the-right-milvus-deployment-mode-ai-applications">Milvus Lite vs. Standalone vs. Verteilt: Welcher Modus ist der richtige für Sie? </a></p></li>
<li><p><a href="https://zilliz.com/blog/milvus-on-gpu-with-nvidia-rapids-cuvs">Überlegene Vektorsuche: Milvus auf GPUs mit NVIDIA RAPIDS cuVS</a></p></li>
<li><p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Was ist RAG? </a></p></li>
<li><p><a href="https://zilliz.com/learn/generative-ai">Ressourcenzentrum für generative KI | Zilliz</a></p></li>
<li><p><a href="https://zilliz.com/ai-models">Die leistungsfähigsten KI-Modelle für Ihre GenAI-Apps | Zilliz</a></p></li>
</ul>
