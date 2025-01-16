---
id: how-to-deploy-open-source-milvus-vector-database-on-amazon-eks.md
title: So stellen Sie die Open-Source-Datenbank Milvus Vector auf Amazon EKS bereit
author: AWS
date: 2024-08-09T00:00:00.000Z
desc: >-
  Eine schrittweise Anleitung zur Bereitstellung der Milvus-Vektordatenbank auf
  AWS unter Verwendung von verwalteten Services wie Amazon EKS, S3, MSK und ELB.
cover: assets.zilliz.com/Getting_started_with_Milvus_cluster_and_K8s_1_34b2c81802.png
tag: Engineering
tags: 'Milvus, Vector Database, Amazon EKS, RAG'
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/how-to-deploy-open-source-milvus-vector-database-on-amazon-eks.md
---
<p><em>Dieser Beitrag wurde ursprünglich auf der <a href="https://aws.amazon.com/cn/blogs/china/build-open-source-vector-database-milvus-based-on-amazon-eks/"><em>AWS-Website</em></a> veröffentlicht und wird hier mit Genehmigung übersetzt, bearbeitet und erneut veröffentlicht.</em></p>
<h2 id="An-Overview-of-Vector-Embeddings-and-Vector-Databases" class="common-anchor-header">Ein Überblick über Vektor-Embeddings und Vektordatenbanken<button data-href="#An-Overview-of-Vector-Embeddings-and-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>Der Aufstieg der <a href="https://zilliz.com/learn/generative-ai">generativen KI (GenAI)</a>, insbesondere großer Sprachmodelle<a href="https://zilliz.com/glossary/large-language-models-(llms)">(LLMs</a>), hat das Interesse an <a href="https://zilliz.com/learn/what-is-vector-database">Vektordatenbanken</a> erheblich gesteigert und sie als wesentliche Komponente innerhalb des GenAI-Ökosystems etabliert. Infolgedessen werden Vektordatenbanken in immer mehr <a href="https://milvus.io/use-cases">Anwendungsfällen</a> eingesetzt.</p>
<p>Ein <a href="https://venturebeat.com/data-infrastructure/report-80-of-global-datasphere-will-be-unstructured-by-2025/">IDC-Bericht</a> sagt voraus, dass bis 2025 über 80 % der Geschäftsdaten unstrukturiert sein werden und in Formaten wie Text, Bildern, Audio und Videos vorliegen. Das Verstehen, Verarbeiten, Speichern und Abfragen dieser riesigen Menge an <a href="https://zilliz.com/learn/introduction-to-unstructured-data">unstrukturierten Daten</a> in großem Umfang stellt eine große Herausforderung dar. Die gängige Praxis in GenAI und Deep Learning besteht darin, unstrukturierte Daten in Vektoreinbettungen umzuwandeln, zu speichern und in einer Vektordatenbank wie <a href="https://milvus.io/intro">Milvus</a> oder <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (das vollständig verwaltete Milvus) für <a href="https://zilliz.com/learn/vector-similarity-search">Vektorähnlichkeits-</a> oder semantische Ähnlichkeitssuchen zu indizieren.</p>
<p>Aber was genau sind <a href="https://zilliz.com/glossary/vector-embeddings">Vektoreinbettungen</a>? Einfach ausgedrückt handelt es sich um numerische Darstellungen von Gleitkommazahlen in einem hochdimensionalen Raum. Der <a href="https://zilliz.com/blog/similarity-metrics-for-vector-search">Abstand zwischen zwei Vektoren</a> gibt deren Relevanz an: Je näher sie beieinander liegen, desto relevanter sind sie füreinander und umgekehrt. Dies bedeutet, dass ähnliche Vektoren ähnlichen Originaldaten entsprechen, was sich von der herkömmlichen Suche nach Schlüsselwörtern oder exakten Suchbegriffen unterscheidet.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_2_How_to_perform_a_vector_search_f38e8533a2.png" alt="How to perform a vector similarity search" class="doc-image" id="how-to-perform-a-vector-similarity-search" />
   </span> <span class="img-wrapper"> <span>So führen Sie eine vektorielle Ähnlichkeitssuche durch</span> </span></p>
<p><em>Abbildung 1: So führen Sie eine Vektorähnlichkeitssuche durch</em></p>
<p>Die Fähigkeit, Vektoreinbettungen zu speichern, zu indizieren und zu durchsuchen, ist die Kernfunktionalität von Vektordatenbanken. Gegenwärtig lassen sich die gängigen Vektordatenbanken in zwei Kategorien einteilen. Die erste Kategorie erweitert bestehende relationale Datenbankprodukte, wie Amazon OpenSearch Service mit dem <a href="https://zilliz.com/blog/k-nearest-neighbor-algorithm-for-machine-learning">KNN-Plugin</a> und Amazon RDS für <a href="https://zilliz.com/comparison/milvus-vs-pgvector">PostgreSQL</a> mit der pgvector-Erweiterung. Die zweite Kategorie umfasst spezialisierte Vektordatenbankprodukte, darunter bekannte Beispiele wie Milvus, Zilliz Cloud (das vollständig verwaltete Milvus), <a href="https://zilliz.com/comparison/pinecone-vs-zilliz-vs-milvus">Pinecone</a>, <a href="https://zilliz.com/comparison/milvus-vs-weaviate">Weaviate</a>, <a href="https://zilliz.com/comparison/milvus-vs-qdrant">Qdrant</a> und <a href="https://zilliz.com/blog/milvus-vs-chroma">Chroma</a>.</p>
<p>Einbettungstechniken und Vektordatenbanken finden breite Anwendung in verschiedenen <a href="https://zilliz.com/vector-database-use-cases">KI-gesteuerten Anwendungsfällen</a>, darunter Bildähnlichkeitssuche, Videodeduplizierung und -analyse, Verarbeitung natürlicher Sprache, Empfehlungssysteme, gezielte Werbung, personalisierte Suche, intelligenter Kundenservice und Betrugserkennung.</p>
<p><a href="https://milvus.io/docs/quickstart.md">Milvus</a> ist eine der beliebtesten Open-Source-Optionen unter den zahlreichen Vektordatenbanken. In diesem Beitrag wird Milvus vorgestellt und die Praxis der Bereitstellung von Milvus auf AWS EKS untersucht.</p>
<h2 id="What-is-Milvus" class="common-anchor-header">Was ist Milvus?<button data-href="#What-is-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/intro">Milvus</a> ist eine hochflexible, zuverlässige und blitzschnelle Cloud-native Open-Source-Vektordatenbank. Sie ermöglicht die Suche nach Vektorähnlichkeit und KI-Anwendungen und soll Vektordatenbanken für jedes Unternehmen zugänglich machen. Milvus kann mehr als eine Milliarde Vektoreinbettungen speichern, indizieren und verwalten, die von tiefen neuronalen Netzen und anderen Modellen des maschinellen Lernens (ML) erzeugt wurden.</p>
<p>Milvus wurde im Oktober 2019 unter der <a href="https://github.com/milvus-io/milvus/blob/master/LICENSE">Open-Source-Lizenz Apache 2.0</a> veröffentlicht. Es ist derzeit ein Graduiertenprojekt der <a href="https://lfaidata.foundation/">LF AI &amp; Data Foundation</a>. Zum Zeitpunkt der Erstellung dieses Blogs hatte Milvus mehr als <a href="https://hub.docker.com/r/milvusdb/milvus">50 Millionen Docker-Pull-Downloads</a> erreicht und wurde von <a href="https://milvus.io/">vielen Kunden</a> wie NVIDIA, AT&amp;T, IBM, eBay, Shopee und Walmart verwendet.</p>
<h3 id="Milvus-Key-Features" class="common-anchor-header">Milvus Hauptmerkmale</h3><p>Als Cloud-native Vektordatenbank zeichnet sich Milvus durch die folgenden Hauptmerkmale aus:</p>
<ul>
<li><p>Hohe Leistung und Millisekunden-Suche auf Vektordatensätzen im Milliardenbereich.</p></li>
<li><p>Mehrsprachige Unterstützung und Toolchain.</p></li>
<li><p>Horizontale Skalierbarkeit und hohe Zuverlässigkeit auch im Falle einer Störung.</p></li>
<li><p><a href="https://zilliz.com/blog/a-review-of-hybrid-search-in-milvus">Hybride Suche</a>, die durch die Kombination von skalarer Filterung und vektorieller Ähnlichkeitssuche erreicht wird.</p></li>
</ul>
<h3 id="Milvus-Architecture" class="common-anchor-header">Milvus-Architektur</h3><p>Milvus folgt dem Prinzip der Trennung von Datenfluss und Kontrollfluss. Das System gliedert sich in vier Ebenen, wie in der Abbildung dargestellt:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_Architecture_Overview_fd10aeffb8.png" alt="Milvus Architecture" class="doc-image" id="milvus-architecture" />
   </span> <span class="img-wrapper"> <span>Milvus-Architektur</span> </span></p>
<p><em>Abbildung 2 Milvus-Architektur</em></p>
<ul>
<li><p><strong>Zugriffsschicht:</strong> Die Zugriffsschicht besteht aus einer Gruppe von zustandslosen Proxys und dient als Frontschicht des Systems und Endpunkt für die Benutzer.</p></li>
<li><p><strong>Koordinator-Dienst:</strong> Der Koordinationsdienst weist den Arbeiterknoten Aufgaben zu.</p></li>
<li><p><strong>Arbeiterknoten:</strong> Die Arbeitsknoten sind stumme Ausführer, die den Anweisungen des Koordinationsdienstes folgen und vom Benutzer ausgelöste DML/DDL-Befehle ausführen.</p></li>
<li><p><strong>Speicherung:</strong> Der Speicher ist für die Datenpersistenz zuständig. Er umfasst einen Metaspeicher, einen Log-Broker und einen Objektspeicher.</p></li>
</ul>
<h3 id="Milvus-Deployment-Options" class="common-anchor-header">Milvus-Bereitstellungsoptionen</h3><p>Milvus unterstützt drei Betriebsmodi: <a href="https://milvus.io/docs/install-overview.md">Milvus Lite, Standalone und Verteilt</a>.</p>
<ul>
<li><p><strong>Milvus Lite</strong> ist eine Python-Bibliothek, die in lokale Anwendungen importiert werden kann. Als leichtgewichtige Version von Milvus ist sie ideal für schnelles Prototyping in Jupyter Notebooks oder für den Betrieb auf Smart Devices mit begrenzten Ressourcen.</p></li>
<li><p><strong>Milvus Standalone ist</strong>eine Serverlösung für eine einzelne Maschine. Wenn Sie eine produktive Arbeitslast haben, aber nicht Kubernetes verwenden möchten, ist die Ausführung von Milvus Standalone auf einem einzelnen Rechner mit ausreichend Speicher eine gute Option.</p></li>
<li><p><strong>Milvus Distributed</strong> kann auf Kubernetes-Clustern bereitgestellt werden. Es unterstützt größere Datensätze, höhere Verfügbarkeit und Skalierbarkeit und ist besser für Produktionsumgebungen geeignet.</p></li>
</ul>
<p>Milvus wurde von Anfang an für die Unterstützung von Kubernetes entwickelt und kann problemlos auf AWS bereitgestellt werden. Wir können Amazon Elastic Kubernetes Service (Amazon EKS) als verwaltetes Kubernetes, Amazon S3 als Objektspeicher, Amazon Managed Streaming for Apache Kafka (Amazon MSK) als Nachrichtenspeicher und Amazon Elastic Load Balancing (Amazon ELB) als Load Balancer verwenden, um einen zuverlässigen, elastischen Milvus-Datenbank-Cluster aufzubauen.</p>
<p>Im Folgenden finden Sie eine schrittweise Anleitung für die Bereitstellung eines Milvus-Clusters mit EKS und anderen Services.</p>
<h2 id="Deploying-Milvus-on-AWS-EKS" class="common-anchor-header">Bereitstellen von Milvus auf AWS EKS<button data-href="#Deploying-Milvus-on-AWS-EKS" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Prerequisites" class="common-anchor-header">Voraussetzungen</h3><p>Wir werden AWS CLI verwenden, um einen EKS-Cluster zu erstellen und eine Milvus-Datenbank bereitzustellen. Die folgenden Voraussetzungen sind erforderlich:</p>
<ul>
<li><p>Ein PC/Mac oder eine Amazon EC2-Instanz, auf der<a href="https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"> AWS CLI</a> installiert und mit den entsprechenden Berechtigungen konfiguriert ist. Die AWS CLI-Tools sind standardmäßig installiert, wenn Sie Amazon Linux 2 oder Amazon Linux 2023 verwenden.</p></li>
<li><p><a href="https://docs.aws.amazon.com/eks/latest/userguide/getting-started.html">Installierte EKS-Tools</a>, einschließlich Helm, Kubectl, eksctl, usw.</p></li>
<li><p>Ein Amazon S3-Bucket.</p></li>
<li><p>Eine Amazon MSK-Instanz.</p></li>
</ul>
<h3 id="Considerations-when-creating-MSK" class="common-anchor-header">Überlegungen bei der Erstellung von MSK</h3><ul>
<li>Die letzte stabile Version von Milvus (v2.3.13) hängt von der <code translate="no">autoCreateTopics</code> -Funktion von Kafka ab. Daher müssen wir bei der Erstellung von MSK eine benutzerdefinierte Konfiguration verwenden und die Eigenschaft <code translate="no">auto.create.topics.enable</code> von der Standardeinstellung <code translate="no">false</code> auf <code translate="no">true</code> ändern. Um den Nachrichtendurchsatz von MSK zu erhöhen, wird außerdem empfohlen, die Werte von <code translate="no">message.max.bytes</code> und <code translate="no">replica.fetch.max.bytes</code> zu erhöhen. Siehe <a href="https://docs.aws.amazon.com/msk/latest/developerguide/msk-configuration-properties.html">Benutzerdefinierte MSK-Konfigurationen</a> für weitere Details.</li>
</ul>
<pre><code translate="no">auto.create.topics.enable=true
message.<span class="hljs-built_in">max</span>.<span class="hljs-built_in">bytes</span>=<span class="hljs-number">10485880</span>
replica.fetch.<span class="hljs-built_in">max</span>.<span class="hljs-built_in">bytes</span>=<span class="hljs-number">20971760</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Milvus unterstützt nicht die rollenbasierte IAM-Authentifizierung von MSK. Aktivieren Sie daher bei der Erstellung von MSK die Option <code translate="no">SASL/SCRAM authentication</code> in der Sicherheitskonfiguration und konfigurieren Sie <code translate="no">username</code> und <code translate="no">password</code> im AWS Secrets Manager. Weitere Informationen finden Sie unter <a href="https://docs.aws.amazon.com/msk/latest/developerguide/msk-password.html">Authentifizierung mit Anmeldeinformationen mit AWS Secrets Manager</a>.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_3_Security_settings_enable_SASL_SCRAM_authentication_9cf7cdde00.png" alt="Figure 3 Security settings enable SASL SCRAM authentication.png" class="doc-image" id="figure-3-security-settings-enable-sasl-scram-authentication.png" />
   </span> <span class="img-wrapper"> <span>Abbildung 3 Sicherheitseinstellungen: SASL SCRAM-Authentifizierung aktivieren.png</span> </span></p>
<p><em>Abbildung 3: Sicherheitseinstellungen: SASL/SCRAM-Authentifizierung aktivieren</em></p>
<ul>
<li>Wir müssen den Zugriff auf die MSK-Sicherheitsgruppe von der Sicherheitsgruppe oder dem IP-Adressbereich des EKS-Clusters aus aktivieren.</li>
</ul>
<h3 id="Creating-an-EKS-Cluster" class="common-anchor-header">Erstellen eines EKS Clusters</h3><p>Es gibt viele Möglichkeiten, einen EKS-Cluster zu erstellen, z.B. über die Konsole, CloudFormation, eksctl, etc. In diesem Beitrag wird gezeigt, wie man einen EKS-Cluster mit eksctl erstellt.</p>
<p><code translate="no">eksctl</code> eksctl ist ein einfaches Befehlszeilen-Tool zur Erstellung und Verwaltung von Kubernetes-Clustern auf Amazon EKS. Es bietet die schnellste und einfachste Möglichkeit, einen neuen Cluster mit Knoten für Amazon EKS zu erstellen. Weitere Informationen finden Sie auf der <a href="https://eksctl.io/">Website</a> von eksctl.</p>
<ol>
<li>Erstellen Sie zunächst eine <code translate="no">eks_cluster.yaml</code> Datei mit dem folgenden Code-Schnipsel. Ersetzen Sie <code translate="no">cluster-name</code> durch Ihren Clusternamen, <code translate="no">region-code</code> durch die AWS-Region, in der Sie den Cluster erstellen möchten, und <code translate="no">private-subnet-idx</code> durch Ihre privaten Subnetze. Hinweis: Diese Konfigurationsdatei erstellt einen EKS-Cluster in einer bestehenden VPC, indem private Subnetze angegeben werden. Wenn Sie eine neue VPC erstellen möchten, entfernen Sie die Konfiguration der VPC und der Subnetze, dann wird <code translate="no">eksctl</code> automatisch eine neue VPC erstellen.</li>
</ol>
<pre><code translate="no">apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig

metadata:
 name: &lt;cluster-name&gt;
 region: &lt;region-code&gt;
 version: <span class="hljs-string">&quot;1.26&quot;</span>

iam:
 withOIDC: true

 serviceAccounts:
 - metadata:
     name: aws-load-balancer-controller
     namespace: kube-system
   wellKnownPolicies:
     awsLoadBalancerController: true
 - metadata:
     name: milvus-s3-access-sa
     <span class="hljs-comment"># if no namespace is set, &quot;default&quot; will be used;</span>
     <span class="hljs-comment"># the namespace will be created if it doesn&#x27;t exist already</span>
     namespace: milvus
     labels: {aws-usage: <span class="hljs-string">&quot;milvus&quot;</span>}
   attachPolicyARNs:
   - <span class="hljs-string">&quot;arn:aws:iam::aws:policy/AmazonS3FullAccess&quot;</span>

<span class="hljs-comment"># Use existed VPC to create EKS.</span>
<span class="hljs-comment"># If you don&#x27;t config vpc subnets, eksctl will automatically create a brand new VPC</span>
vpc:
 subnets:
   private:
     us-west-2a: { <span class="hljs-built_in">id</span>: &lt;private-subnet-id1&gt; }
     us-west-2b: { <span class="hljs-built_in">id</span>: &lt;private-subnet-id2&gt; }
     us-west-2c: { <span class="hljs-built_in">id</span>: &lt;private-subnet-id3&gt; }

managedNodeGroups:
 - name: ng-<span class="hljs-number">1</span>-milvus
   labels: { role: milvus }
   instanceType: m6i<span class="hljs-number">.2</span>xlarge
   desiredCapacity: <span class="hljs-number">3</span>
   privateNetworking: true
  
addons:
- name: vpc-cni <span class="hljs-comment"># no version is specified so it deploys the default version</span>
 attachPolicyARNs:
   - arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy
- name: coredns
 version: latest <span class="hljs-comment"># auto discovers the latest available</span>
- name: kube-proxy
 version: latest
- name: aws-ebs-csi-driver
 wellKnownPolicies:      <span class="hljs-comment"># add IAM and service account</span>
   ebsCSIController: true
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>Führen Sie dann den Befehl <code translate="no">eksctl</code> aus, um den EKS-Cluster zu erstellen.</li>
</ol>
<pre><code translate="no">eksctl create cluster -f eks_cluster.yaml
<button class="copy-code-btn"></button></code></pre>
<p>Mit diesem Befehl werden die folgenden Ressourcen erstellt:</p>
<ul>
<li><p>Ein EKS-Cluster mit der angegebenen Version.</p></li>
<li><p>Eine verwaltete Knotengruppe mit drei m6i.2xlarge EC2-Instanzen.</p></li>
<li><p>Ein <a href="https://docs.aws.amazon.com/en_us/eks/latest/userguide/enable-iam-roles-for-service-accounts.html">IAM OIDC Identity Provider</a> und ein ServiceAccount namens <code translate="no">aws-load-balancer-controller</code>, den wir später bei der Installation des <strong>AWS Load Balancer Controllers</strong> verwenden werden.</p></li>
<li><p>Ein Namespace <code translate="no">milvus</code> und ein ServiceAccount <code translate="no">milvus-s3-access-sa</code> innerhalb dieses Namespaces. Dieser Namespace wird später bei der Konfiguration von S3 als Objektspeicher für Milvus verwendet.</p>
<p>Hinweis: Der Einfachheit halber wird <code translate="no">milvus-s3-access-sa</code> hier mit vollen S3-Zugriffsrechten ausgestattet. In Produktionsumgebungen wird empfohlen, das Prinzip der geringsten Rechte zu befolgen und nur Zugriff auf den spezifischen S3-Bucket zu gewähren, der für Milvus verwendet wird.</p></li>
<li><p>Mehrere Add-ons, wobei <code translate="no">vpc-cni</code>, <code translate="no">coredns</code>, <code translate="no">kube-proxy</code> Kern-Add-ons sind, die von EKS benötigt werden. <code translate="no">aws-ebs-csi-driver</code> ist der AWS EBS CSI-Treiber, der es EKS-Clustern ermöglicht, den Lebenszyklus von Amazon EBS-Volumes zu verwalten.</p></li>
</ul>
<p>Jetzt müssen wir nur noch auf den Abschluss der Cluster-Erstellung warten.</p>
<p>Warten Sie auf den Abschluss der Cluster-Erstellung. Während der Erstellung des Clusters wird die Datei <code translate="no">kubeconfig</code> automatisch erstellt oder aktualisiert. Sie können sie auch manuell aktualisieren, indem Sie den folgenden Befehl ausführen. Achten Sie darauf, <code translate="no">region-code</code> durch die AWS-Region zu ersetzen, in der Ihr Cluster erstellt wird, und <code translate="no">cluster-name</code> durch den Namen Ihres Clusters.</p>
<pre><code translate="no">aws eks update-kubeconfig --region &lt;region-code&gt; --name &lt;cluster-name&gt;
<button class="copy-code-btn"></button></code></pre>
<p>Sobald der Cluster erstellt ist, können Sie die Knoten anzeigen, indem Sie diesen Befehl ausführen:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> nodes -A -o wide
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li>Erstellen Sie eine <code translate="no">ebs-sc</code> StorageClass, die mit GP3 als Speichertyp konfiguriert ist, und legen Sie sie als Standard StorageClass fest. Milvus verwendet etcd als Metaspeicher und benötigt diese StorageClass, um PVCs zu erstellen und zu verwalten.</li>
</ol>
<pre><code translate="no">cat &lt;&lt;EOF | kubectl apply -f -
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
 name: ebs-sc
 annotations:
   storageclass.kubernetes.io/<span class="hljs-keyword">is</span>-default-<span class="hljs-keyword">class</span>: <span class="hljs-string">&quot;true&quot;</span>
provisioner: ebs.csi.aws.com
volumeBindingMode: WaitForFirstConsumer
parameters:
 <span class="hljs-built_in">type</span>: gp3
EOF
<button class="copy-code-btn"></button></code></pre>
<p>Setzen Sie dann die ursprüngliche StorageClass <code translate="no">gp2</code> auf nicht standardmäßig:</p>
<pre><code translate="no">kubectl patch storage<span class="hljs-keyword">class</span> <span class="hljs-title class_">gp2</span> -p <span class="hljs-string">&#x27;{&quot;metadata&quot;: {&quot;annotations&quot;:{&quot;storageclass.kubernetes.io/is-default-class&quot;:&quot;false&quot;}}}&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<ol start="4">
<li>Installieren Sie den AWS Load Balancer Controller. Wir werden diesen Controller später für den Milvus Service und Attu Ingress verwenden, daher sollten wir ihn vorher installieren.</li>
</ol>
<ul>
<li>Fügen Sie zunächst das <code translate="no">eks-charts</code> Repo hinzu und aktualisieren Sie es.</li>
</ul>
<pre><code translate="no">helm repo <span class="hljs-keyword">add</span> eks https:<span class="hljs-comment">//aws.github.io/eks-charts</span>
helm repo update
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Als nächstes installieren Sie den AWS Load Balancer Controller. Ersetzen Sie <code translate="no">cluster-name</code> durch Ihren Clusternamen. Der ServiceAccount mit dem Namen <code translate="no">aws-load-balancer-controller</code> wurde bereits beim Erstellen des EKS-Clusters in den vorherigen Schritten erstellt.</li>
</ul>
<pre><code translate="no">helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
 -n kube-system \
 --<span class="hljs-built_in">set</span> clusterName=&lt;cluster-name&gt; \
 --<span class="hljs-built_in">set</span> serviceAccount.create=<span class="hljs-literal">false</span> \
 --<span class="hljs-built_in">set</span> serviceAccount.name=aws-load-balancer-controller
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Überprüfen Sie, ob der Controller erfolgreich installiert wurde.</li>
</ul>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> deployment -n kube-system aws-load-balancer-controller
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Die Ausgabe sollte wie folgt aussehen:</li>
</ul>
<pre><code translate="no">NAME                           READY   UP-TO-DATE   AVAILABLE   AGE
aws-load-balancer-controller   2/2     2            2           12m
<button class="copy-code-btn"></button></code></pre>
<h3 id="Deploying-a-Milvus-Cluster" class="common-anchor-header">Bereitstellen eines Milvus-Clusters</h3><p>Milvus unterstützt mehrere Bereitstellungsmethoden, wie Operator und Helm. Operator ist einfacher, aber Helm ist direkter und flexibler. In diesem Beispiel verwenden wir Helm für die Bereitstellung von Milvus.</p>
<p>Wenn Sie Milvus mit Helm bereitstellen, können Sie die Konfiguration über die Datei <code translate="no">values.yaml</code> anpassen. Klicken Sie auf <a href="https://raw.githubusercontent.com/milvus-io/milvus-helm/master/charts/milvus/values.yaml">values.yaml</a>, um alle Optionen anzuzeigen. Standardmäßig erstellt Milvus im Cluster minio und pulsar als Objektspeicher bzw. Nachrichtenspeicher. Wir werden einige Konfigurationsänderungen vornehmen, um sie für die Produktion besser geeignet zu machen.</p>
<ol>
<li>Fügen Sie zunächst das Milvus Helm Repo hinzu und aktualisieren Sie es.</li>
</ol>
<pre><code translate="no">helm repo <span class="hljs-keyword">add</span> milvus https:<span class="hljs-comment">//zilliztech.github.io/milvus-helm/</span>
helm repo update
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>Erstellen Sie eine Datei <code translate="no">milvus_cluster.yaml</code> mit dem folgenden Codeschnipsel. Dieser Codeausschnitt passt die Konfiguration von Milvus an, z. B. die Konfiguration von Amazon S3 als Objektspeicher und Amazon MSK als Nachrichtenwarteschlange. Detaillierte Erklärungen und Anleitungen zur Konfiguration werden später gegeben.</li>
</ol>
<pre><code translate="no"><span class="hljs-comment">#####################################</span>
<span class="hljs-comment"># Section 1</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># Configure S3 as the Object Storage</span>
<span class="hljs-comment">#####################################</span>

<span class="hljs-comment"># Service account</span>
<span class="hljs-comment"># - this service account are used by External S3 access</span>
serviceAccount:
  create: false
  name: milvus-s3-access-sa

<span class="hljs-comment"># Close in-cluster minio</span>
minio:
  enabled: false

<span class="hljs-comment"># External S3</span>
<span class="hljs-comment"># - these configs are only used when `externalS3.enabled` is true</span>
externalS3:
  enabled: true
  host: <span class="hljs-string">&quot;s3.&lt;region-code&gt;.amazonaws.com&quot;</span>
  port: <span class="hljs-string">&quot;443&quot;</span>
  useSSL: true
  bucketName: <span class="hljs-string">&quot;&lt;bucket-name&gt;&quot;</span>
  rootPath: <span class="hljs-string">&quot;&lt;root-path&gt;&quot;</span>
  useIAM: true
  cloudProvider: <span class="hljs-string">&quot;aws&quot;</span>
  iamEndpoint: <span class="hljs-string">&quot;&quot;</span>

<span class="hljs-comment">#####################################</span>
<span class="hljs-comment"># Section 2</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># Configure MSK as the Message Storage</span>
<span class="hljs-comment">#####################################</span>

<span class="hljs-comment"># Close in-cluster pulsar</span>
pulsar:
  enabled: false

<span class="hljs-comment"># External kafka</span>
<span class="hljs-comment"># - these configs are only used when `externalKafka.enabled` is true</span>
externalKafka:
  enabled: true
  brokerList: <span class="hljs-string">&quot;&lt;broker-list&gt;&quot;</span>
  securityProtocol: SASL_SSL
  sasl:
    mechanisms: SCRAM-SHA-<span class="hljs-number">512</span>
    username: <span class="hljs-string">&quot;&lt;username&gt;&quot;</span>
    password: <span class="hljs-string">&quot;&lt;password&gt;&quot;</span>
    
<span class="hljs-comment">#####################################</span>
<span class="hljs-comment"># Section 3</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># Expose the Milvus service to be accessed from outside the cluster (LoadBalancer service).</span>
<span class="hljs-comment"># or access it from within the cluster (ClusterIP service). Set the service type and the port to serve it.</span>
<span class="hljs-comment">#####################################</span>
service:
  <span class="hljs-built_in">type</span>: LoadBalancer
  port: <span class="hljs-number">19530</span>
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-<span class="hljs-built_in">type</span>: external <span class="hljs-comment">#AWS Load Balancer Controller fulfills services that has this annotation</span>
    service.beta.kubernetes.io/aws-load-balancer-name : milvus-service <span class="hljs-comment">#User defined name given to AWS Network Load Balancer</span>
    service.beta.kubernetes.io/aws-load-balancer-scheme: internal <span class="hljs-comment"># internal or internet-facing, later allowing for public access via internet</span>
    service.beta.kubernetes.io/aws-load-balancer-nlb-target-<span class="hljs-built_in">type</span>: ip <span class="hljs-comment">#The Pod IPs should be used as the target IPs (rather than the node IPs)</span>
    
<span class="hljs-comment">#####################################</span>
<span class="hljs-comment"># Section 4</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># Installing Attu the Milvus management GUI</span>
<span class="hljs-comment">#####################################</span>
attu:
  enabled: true
  name: attu
  ingress:
    enabled: true
    annotations:
      kubernetes.io/ingress.<span class="hljs-keyword">class</span>: alb <span class="hljs-comment"># Annotation: set ALB ingress type</span>
      alb.ingress.kubernetes.io/scheme: internet-facing <span class="hljs-comment">#Places the load balancer on public subnets</span>
      alb.ingress.kubernetes.io/target-<span class="hljs-built_in">type</span>: ip <span class="hljs-comment">#The Pod IPs should be used as the target IPs (rather than the node IPs)</span>
      alb.ingress.kubernetes.io/group.name: attu <span class="hljs-comment"># Groups multiple Ingress resources</span>
    hosts:
      -
      
<span class="hljs-comment">#####################################</span>
<span class="hljs-comment"># Section 5</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># HA deployment of Milvus Core Components</span>
<span class="hljs-comment">#####################################</span>
rootCoordinator:
  replicas: <span class="hljs-number">2</span>
  activeStandby:
    enabled: true  <span class="hljs-comment"># Enable active-standby when you set multiple replicas for root coordinator</span>
  resources:
    limits:
      cpu: <span class="hljs-number">1</span>
      memory: 2Gi
indexCoordinator:
  replicas: <span class="hljs-number">2</span>
  activeStandby:
    enabled: true  <span class="hljs-comment"># Enable active-standby when you set multiple replicas for index coordinator</span>
  resources:
    limits:
      cpu: <span class="hljs-string">&quot;0.5&quot;</span>
      memory: <span class="hljs-number">0.5</span>Gi
queryCoordinator:
  replicas: <span class="hljs-number">2</span>
  activeStandby:
    enabled: true  <span class="hljs-comment"># Enable active-standby when you set multiple replicas for query coordinator</span>
  resources:
    limits:
      cpu: <span class="hljs-string">&quot;0.5&quot;</span>
      memory: <span class="hljs-number">0.5</span>Gi
dataCoordinator:
  replicas: <span class="hljs-number">2</span>
  activeStandby:
    enabled: true  <span class="hljs-comment"># Enable active-standby when you set multiple replicas for data coordinator</span>
  resources:
    limits:
      cpu: <span class="hljs-string">&quot;0.5&quot;</span>
      memory: <span class="hljs-number">0.5</span>Gi
proxy:
  replicas: <span class="hljs-number">2</span>
  resources:
    limits:
      cpu: <span class="hljs-number">1</span>
      memory: 4Gi

<span class="hljs-comment">#####################################</span>
<span class="hljs-comment"># Section 6</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># Milvus Resource Allocation</span>
<span class="hljs-comment">#####################################</span>
queryNode:
  replicas: <span class="hljs-number">1</span>
  resources:
    limits:
      cpu: <span class="hljs-number">2</span>
      memory: 8Gi
dataNode:
  replicas: <span class="hljs-number">1</span>
  resources:
    limits:
      cpu: <span class="hljs-number">1</span>
      memory: 4Gi
indexNode:
  replicas: <span class="hljs-number">1</span>
  resources:
    limits:
      cpu: <span class="hljs-number">4</span>
      memory: 8Gi
<button class="copy-code-btn"></button></code></pre>
<p>Der Code besteht aus sechs Abschnitten. Folgen Sie den folgenden Anweisungen, um die entsprechenden Konfigurationen zu ändern.</p>
<p><strong>Abschnitt 1</strong>: Konfigurieren Sie S3 als Objektspeicher. Der serviceAccount gewährt Milvus den Zugriff auf S3 (in diesem Fall ist es <code translate="no">milvus-s3-access-sa</code>, das bei der Erstellung des EKS-Clusters angelegt wurde). Stellen Sie sicher, dass Sie <code translate="no">&lt;region-code&gt;</code> durch die AWS-Region ersetzen, in der sich Ihr Cluster befindet. Ersetzen Sie <code translate="no">&lt;bucket-name&gt;</code> durch den Namen Ihres S3-Buckets und <code translate="no">&lt;root-path&gt;</code> durch das Präfix für das S3-Bucket (dieses Feld kann leer bleiben).</p>
<p><strong>Abschnitt 2</strong>: Konfigurieren Sie MSK als Nachrichtenspeicher. Ersetzen Sie <code translate="no">&lt;broker-list&gt;</code> durch die Endpunktadressen, die dem SASL/SCRAM-Authentifizierungstyp von MSK entsprechen. Ersetzen Sie <code translate="no">&lt;username&gt;</code> und <code translate="no">&lt;password&gt;</code> durch den Benutzernamen und das Passwort des MSK-Kontos. Die Adresse <code translate="no">&lt;broker-list&gt;</code> können Sie den MSK-Clientinformationen entnehmen, wie in der folgenden Abbildung dargestellt.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_4_Configure_MSK_as_the_Message_Storage_of_Milvus_a9e602e0b9.png" alt="Figure 4 Configure MSK as the Message Storage of Milvus.png" class="doc-image" id="figure-4-configure-msk-as-the-message-storage-of-milvus.png" />
   </span> <span class="img-wrapper"> <span>Abbildung 4: MSK als Nachrichtenspeicher von Milvus konfigurieren.png</span> </span></p>
<p><em>Abbildung 4: MSK als Nachrichtenspeicher für Milvus konfigurieren</em></p>
<p><strong>Abschnitt 3:</strong> Expose Milvus service and enable access from outside the cluster. Der Milvus-Endpunkt verwendet standardmäßig einen Dienst vom Typ ClusterIP, der nur innerhalb des EKS-Clusters zugänglich ist. Bei Bedarf können Sie ihn auf den Typ LoadBalancer ändern, um den Zugriff von außerhalb des EKS-Clusters zu ermöglichen. Der Service vom Typ LoadBalancer verwendet Amazon NLB als Load Balancer. Gemäß den bewährten Sicherheitspraktiken ist <code translate="no">aws-load-balancer-scheme</code> hier standardmäßig als interner Modus konfiguriert, was bedeutet, dass nur der Intranetzugriff auf Milvus erlaubt ist. Klicken Sie hier, um <a href="https://docs.aws.amazon.com/eks/latest/userguide/network-load-balancing.html">die NLB-Konfigurationsanweisungen anzuzeigen</a>.</p>
<p><strong>Abschnitt 4:</strong> Installieren und konfigurieren <a href="https://github.com/zilliztech/attu">Sie Attu</a>, ein Open-Source-Verwaltungstool für Milvus. Es verfügt über eine intuitive grafische Benutzeroberfläche, mit der Sie leicht mit Milvus interagieren können. Wir aktivieren Attu, konfigurieren den Ingress mit AWS ALB und stellen es auf den Typ <code translate="no">internet-facing</code> ein, damit Attu über das Internet zugänglich ist. Klicken Sie auf <a href="https://docs.aws.amazon.com/eks/latest/userguide/alb-ingress.html">dieses Dokument</a> für die Anleitung zur ALB-Konfiguration.</p>
<p><strong>Abschnitt 5:</strong> Aktivieren Sie die HA-Bereitstellung der Milvus-Kernkomponenten. Milvus enthält mehrere unabhängige und entkoppelte Komponenten. Der Coordinator Service fungiert beispielsweise als Kontrollschicht und übernimmt die Koordination der Komponenten Root, Query, Data und Index. Der Proxy in der Zugriffsschicht dient als Endpunkt für den Datenbankzugriff. Diese Komponenten haben standardmäßig nur 1 Pod-Replikat. Die Bereitstellung mehrerer Replikate dieser Dienstkomponenten ist insbesondere zur Verbesserung der Verfügbarkeit von Milvus erforderlich.</p>
<p><strong>Hinweis:</strong> Für die Bereitstellung mehrerer Replikate der Root-, Abfrage-, Daten- und Indexkoordinator-Komponenten muss die Option <code translate="no">activeStandby</code> aktiviert sein.</p>
<p><strong>Abschnitt 6:</strong> Passen Sie die Ressourcenzuweisung für Milvus-Komponenten an die Anforderungen Ihrer Workloads an. Die Milvus-Website bietet auch ein <a href="https://milvus.io/tools/sizing/">Sizing-Tool</a> zur Generierung von Konfigurationsvorschlägen auf der Grundlage von Datenvolumen, Vektordimensionen, Indextypen usw. Es kann auch eine Helm-Konfigurationsdatei mit nur einem Klick erzeugen. Die folgende Konfiguration ist der Vorschlag, den das Tool für 1 Million Vektoren mit 1024 Dimensionen und den Index-Typ HNSW macht.</p>
<ol>
<li>Verwenden Sie Helm, um Milvus zu erstellen (bereitgestellt im Namespace <code translate="no">milvus</code>). Hinweis: Sie können <code translate="no">&lt;demo&gt;</code> durch einen eigenen Namen ersetzen.</li>
</ol>
<pre><code translate="no">helm install &lt;demo&gt; milvus/milvus -n milvus -f milvus_cluster.yaml
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>Führen Sie den folgenden Befehl aus, um den Bereitstellungsstatus zu überprüfen.</li>
</ol>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> deployment -n milvus
<button class="copy-code-btn"></button></code></pre>
<p>Die folgende Ausgabe zeigt, dass alle Milvus-Komponenten AVAILABLE sind und dass für die Koordinierungskomponenten mehrere Replikate aktiviert sind.</p>
<pre><code translate="no">NAME                     READY   UP-TO-DATE   AVAILABLE   AGE
demo-milvus-attu         1/1     1            1           5m27s
demo-milvus-datacoord    2/2     2            2           5m27s
demo-milvus-datanode     1/1     1            1           5m27s
demo-milvus-indexcoord   2/2     2            2           5m27s
demo-milvus-indexnode    1/1     1            1           5m27s
demo-milvus-proxy        2/2     2            2           5m27s
demo-milvus-querycoord   2/2     2            2           5m27s
demo-milvus-querynode    1/1     1            1           5m27s
demo-milvus-rootcoord    2/2     2            2           5m27s
<button class="copy-code-btn"></button></code></pre>
<h3 id="Accessing-and-Managing-Milvus" class="common-anchor-header">Zugriff auf und Verwaltung von Milvus</h3><p>Bis jetzt haben wir die Milvus-Vektor-Datenbank erfolgreich bereitgestellt. Nun können wir über Endpunkte auf Milvus zugreifen. Milvus stellt Endpunkte über Kubernetes-Dienste bereit. Attu stellt Endpunkte über Kubernetes Ingress zur Verfügung.</p>
<h4 id="Accessing-Milvus-endpoints" class="common-anchor-header"><strong>Zugriff auf Milvus-Endpunkte</strong></h4><p>Führen Sie den folgenden Befehl aus, um Service-Endpunkte abzurufen:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> svc -n milvus
<button class="copy-code-btn"></button></code></pre>
<p>Sie können verschiedene Dienste anzeigen. Milvus unterstützt zwei Ports, Port <code translate="no">19530</code> und Port <code translate="no">9091</code>:</p>
<ul>
<li>Port <code translate="no">19530</code> ist für gRPC und RESTful API. Es ist der Standardport, wenn Sie sich mit verschiedenen Milvus-SDKs oder HTTP-Clients mit einem Milvus-Server verbinden.</li>
<li>Port <code translate="no">9091</code> ist ein Verwaltungsport für die Sammlung von Metriken, pprof profiling und Health Probes innerhalb von Kubernetes.</li>
</ul>
<p>Der Dienst <code translate="no">demo-milvus</code> bietet einen Endpunkt für den Datenbankzugriff, über den Clients eine Verbindung herstellen können. Er verwendet NLB als Dienst-Load-Balancer. Sie können den Endpunkt des Dienstes in der Spalte <code translate="no">EXTERNAL-IP</code> abrufen.</p>
<pre><code translate="no">NAME                     TYPE           CLUSTER-IP       EXTERNAL-IP                                               PORT(S)                          AGE
demo-etcd                ClusterIP      <span class="hljs-number">172.20</span><span class="hljs-number">.103</span><span class="hljs-number">.138</span>   &lt;none&gt;                                                    <span class="hljs-number">2379</span>/TCP,<span class="hljs-number">2380</span>/TCP                62m
demo-etcd-headless       ClusterIP      <span class="hljs-literal">None</span>             &lt;none&gt;                                                    <span class="hljs-number">2379</span>/TCP,<span class="hljs-number">2380</span>/TCP                62m
demo-milvus              LoadBalancer   <span class="hljs-number">172.20</span><span class="hljs-number">.219</span><span class="hljs-number">.33</span>    milvus-nlb-xxxx.elb.us-west-<span class="hljs-number">2.</span>amazonaws.com               <span class="hljs-number">19530</span>:<span class="hljs-number">31201</span>/TCP,<span class="hljs-number">9091</span>:<span class="hljs-number">31088</span>/TCP   62m
demo-milvus-datacoord    ClusterIP      <span class="hljs-number">172.20</span><span class="hljs-number">.214</span><span class="hljs-number">.106</span>   &lt;none&gt;                                                    <span class="hljs-number">13333</span>/TCP,<span class="hljs-number">9091</span>/TCP               62m
demo-milvus-datanode     ClusterIP      <span class="hljs-literal">None</span>             &lt;none&gt;                                                    <span class="hljs-number">9091</span>/TCP                         62m
demo-milvus-indexcoord   ClusterIP      <span class="hljs-number">172.20</span><span class="hljs-number">.106</span><span class="hljs-number">.51</span>    &lt;none&gt;                                                    <span class="hljs-number">31000</span>/TCP,<span class="hljs-number">9091</span>/TCP               62m
demo-milvus-indexnode    ClusterIP      <span class="hljs-literal">None</span>             &lt;none&gt;                                                    <span class="hljs-number">9091</span>/TCP                         62m
demo-milvus-querycoord   ClusterIP      <span class="hljs-number">172.20</span><span class="hljs-number">.136</span><span class="hljs-number">.213</span>   &lt;none&gt;                                                    <span class="hljs-number">19531</span>/TCP,<span class="hljs-number">9091</span>/TCP               62m
demo-milvus-querynode    ClusterIP      <span class="hljs-literal">None</span>             &lt;none&gt;                                                    <span class="hljs-number">9091</span>/TCP                         62m
demo-milvus-rootcoord    ClusterIP      <span class="hljs-number">172.20</span><span class="hljs-number">.173</span><span class="hljs-number">.98</span>    &lt;none&gt;                                                    <span class="hljs-number">53100</span>/TCP,<span class="hljs-number">9091</span>/TCP               62m
<button class="copy-code-btn"></button></code></pre>
<h4 id="Managing-Milvus-using-Attu" class="common-anchor-header"><strong>Verwaltung von Milvus mit Attu</strong></h4><p>Wie bereits beschrieben, haben wir Attu installiert, um Milvus zu verwalten. Führen Sie den folgenden Befehl aus, um den Endpunkt abzurufen:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> ingress -n milvus
<button class="copy-code-btn"></button></code></pre>
<p>Sie können einen Ingress mit dem Namen <code translate="no">demo-milvus-attu</code> sehen, wobei die Spalte <code translate="no">ADDRESS</code> die Zugriffs-URL ist.</p>
<pre><code translate="no">NAME            CLASS   HOSTS   ADDRESS                                     PORTS   AGE
demo-milvus-attu   &lt;none&gt;   *       k8s-attu-xxxx.us-west-2.elb.amazonaws.com   80      27s
<button class="copy-code-btn"></button></code></pre>
<p>Öffnen Sie die Ingress-Adresse in einem Browser und sehen Sie die folgende Seite. Klicken Sie auf <strong>Verbinden</strong>, um sich anzumelden.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_5_Log_in_to_your_Attu_account_bde25a6da5.png" alt="Figure 5 Log in to your Attu account.png" class="doc-image" id="figure-5-log-in-to-your-attu-account.png" />
   </span> <span class="img-wrapper"> <span>Abbildung 5 Anmelden bei Ihrem Attu-Konto.png</span> </span></p>
<p><em>Abbildung 5: Einloggen in Ihr Attu-Konto</em></p>
<p>Nachdem Sie sich angemeldet haben, können Sie Milvus-Datenbanken über Attu verwalten.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_6_The_Attu_interface_3e818e6833.png" alt="Figure 6 The Attu interface.png" class="doc-image" id="figure-6-the-attu-interface.png" />
   </span> <span class="img-wrapper"> <span>Abbildung 6: Die Attu-Benutzeroberfläche.png</span> </span></p>
<p>Abbildung 6: Die Attu-Benutzeroberfläche</p>
<h2 id="Testing-the-Milvus-vector-database" class="common-anchor-header">Testen der Milvus-Vektordatenbank<button data-href="#Testing-the-Milvus-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>Wir werden den <a href="https://milvus.io/docs/example_code.md">Milvus-Beispielcode</a> verwenden, um zu testen, ob die Milvus-Datenbank richtig funktioniert. Laden Sie zunächst den Beispielcode <code translate="no">hello_milvus.py</code> mit dem folgenden Befehl herunter:</p>
<pre><code translate="no">wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/pymilvus/master/examples/hello_milvus.py</span>
<button class="copy-code-btn"></button></code></pre>
<p>Ändern Sie den Host im Beispielcode auf den Endpunkt des Milvus-Dienstes.</p>
<pre><code translate="no"><span class="hljs-built_in">print</span>(fmt.<span class="hljs-built_in">format</span>(<span class="hljs-string">&quot;start connecting to Milvus&quot;</span>))
connections.connect(<span class="hljs-string">&quot;default&quot;</span>, host=<span class="hljs-string">&quot;milvus-nlb-xxx.elb.us-west-2.amazonaws.com&quot;</span>, port=<span class="hljs-string">&quot;19530&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Führen Sie den Code aus:</p>
<pre><code translate="no">python3 hello_milvus.py
<button class="copy-code-btn"></button></code></pre>
<p>Wenn das System das folgende Ergebnis zurückgibt, bedeutet dies, dass Milvus normal läuft.</p>
<pre><code translate="no">=== start connecting to <span class="hljs-title class_">Milvus</span>     ===
<span class="hljs-title class_">Does</span> collection hello_milvus exist <span class="hljs-keyword">in</span> <span class="hljs-title class_">Milvus</span>: <span class="hljs-title class_">False</span>
=== <span class="hljs-title class_">Create</span> collection <span class="hljs-string">`hello_milvus`</span> ===
=== <span class="hljs-title class_">Start</span> inserting entities       ===
<span class="hljs-title class_">Number</span> <span class="hljs-keyword">of</span> entities <span class="hljs-keyword">in</span> <span class="hljs-title class_">Milvus</span>: <span class="hljs-number">3000</span>
=== <span class="hljs-title class_">Start</span> <span class="hljs-title class_">Creating</span> index <span class="hljs-variable constant_">IVF_FLAT</span>  ===
=== <span class="hljs-title class_">Start</span> loading                  ===
<button class="copy-code-btn"></button></code></pre>
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
    </button></h2><p>Dieser Beitrag stellt <a href="https://milvus.io/intro">Milvus</a> vor, eine der beliebtesten Open-Source-Vektordatenbanken, und bietet eine Anleitung für die Bereitstellung von Milvus auf AWS unter Verwendung von verwalteten Services wie Amazon EKS, S3, MSK und ELB, um eine größere Elastizität und Zuverlässigkeit zu erreichen.</p>
<p>Als Kernkomponente verschiedener GenAI-Systeme, insbesondere Retrieval Augmented Generation (RAG), unterstützt und integriert Milvus eine Vielzahl von Mainstream-GenAI-Modellen und -Frameworks, darunter Amazon Sagemaker, PyTorch, HuggingFace, LlamaIndex und LangChain. Beginnen Sie Ihre GenAI-Innovationsreise mit Milvus noch heute!</p>
<h2 id="References" class="common-anchor-header">Referenzen<button data-href="#References" class="anchor-icon" translate="no">
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
<li><a href="https://docs.aws.amazon.com/eks/latest/userguide/getting-started.html">Amazon EKS Benutzerhandbuch</a></li>
<li><a href="https://milvus.io/">Offizielle Milvus Website</a></li>
<li><a href="https://github.com/milvus-io/milvus">Milvus GitHub Repository</a></li>
<li><a href="https://eksctl.io/">eksctl Offizielle Website</a></li>
</ul>
