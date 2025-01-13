---
id: mishards-distributed-vector-search-milvus.md
title: Überblick über die verteilte Architektur
author: milvus
date: 2020-03-17T21:36:16.974Z
desc: Verkleinern
cover: assets.zilliz.com/tim_j_ots0_EO_Yu_Gt_U_unsplash_14f939b344.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/mishards-distributed-vector-search-milvus'
---
<custom-h1>Mishards - Verteilte Vektorsuche in Milvus</custom-h1><p>Milvus zielt darauf ab, eine effiziente Ähnlichkeitssuche und -analyse für Vektoren in großem Maßstab zu erreichen. Eine eigenständige Milvus-Instanz kann die Vektorsuche für Vektoren in Milliardengröße problemlos bewältigen. Für 10 Milliarden, 100 Milliarden oder noch größere Datensätze wird jedoch ein Milvus-Cluster benötigt. Der Cluster kann als eigenständige Instanz für Anwendungen auf höherer Ebene verwendet werden und erfüllt die geschäftlichen Anforderungen an niedrige Latenzzeiten und hohe Gleichzeitigkeit bei Massendaten. Ein Milvus-Cluster kann Anfragen weiterleiten, Lese- und Schreibvorgänge trennen, horizontal skalieren und dynamisch expandieren, so dass eine unbegrenzt erweiterbare Milvus-Instanz entsteht. Mishards ist eine verteilte Lösung für Milvus.</p>
<p>In diesem Artikel werden die Komponenten der Mishards-Architektur kurz vorgestellt. Ausführlichere Informationen werden in den folgenden Artikeln vorgestellt.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_milvus_cluster_mishards_daf78a0a91.png" alt="1-milvus-cluster-mishards.png" class="doc-image" id="1-milvus-cluster-mishards.png" />
   </span> <span class="img-wrapper"> <span>1-milvus-cluster-mishards.png</span> </span></p>
<h2 id="Distributed-architecture-overview" class="common-anchor-header">Überblick über die verteilte Architektur<button data-href="#Distributed-architecture-overview" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_distributed_architecture_overview_f059fe8c90.png" alt="2-distributed-architecture-overview.png" class="doc-image" id="2-distributed-architecture-overview.png" />
   </span> <span class="img-wrapper"> <span>2-verteilte-architektur-uebersicht.png</span> </span></p>
<h2 id="Service-tracing" class="common-anchor-header">Dienstverfolgung<button data-href="#Service-tracing" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_service_tracing_milvus_38559f7fd7.png" alt="3-service-tracing-milvus.png" class="doc-image" id="3-service-tracing-milvus.png" />
   </span> <span class="img-wrapper"> <span>3-dienst-verfolgung-milvus.png</span> </span></p>
<h2 id="Primary-service-components" class="common-anchor-header">Primäre Dienstkomponenten<button data-href="#Primary-service-components" class="anchor-icon" translate="no">
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
<li>Rahmenwerk zur Diensterkennung, wie ZooKeeper, etcd und Consul.</li>
<li>Lastausgleicher, wie Nginx, HAProxy, Ingress Controller.</li>
<li>Mishards-Knoten: zustandslos, skalierbar.</li>
<li>Schreibgeschützter Milvus-Knoten: Einzelner Knoten und nicht skalierbar. Sie müssen Hochverfügbarkeitslösungen für diesen Knoten verwenden, um einen Single-Point-of-Failure zu vermeiden.</li>
<li>Nur-lesender Milvus-Knoten: Stateful-Knoten und skalierbar.</li>
<li>Gemeinsamer Speicherdienst: Alle Milvus-Knoten verwenden einen gemeinsamen Speicherdienst zur gemeinsamen Nutzung von Daten, z. B. NAS oder NFS.</li>
<li>Metadaten-Dienst: Alle Milvus-Knoten nutzen diesen Dienst, um Metadaten gemeinsam zu nutzen. Derzeit wird nur MySQL unterstützt. Dieser Dienst erfordert eine Hochverfügbarkeitslösung für MySQL.</li>
</ul>
<h2 id="Scalable-components" class="common-anchor-header">Skalierbare Komponenten<button data-href="#Scalable-components" class="anchor-icon" translate="no">
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
<li>Mishards</li>
<li>Nur-Lese-Milvus-Knoten</li>
</ul>
<h2 id="Components-introduction" class="common-anchor-header">Einführung der Komponenten<button data-href="#Components-introduction" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Mishards-Knoten</strong></p>
<p>Mishards ist für die Aufteilung von Upstream-Anfragen und die Weiterleitung von Sub-Anfragen an Sub-Dienste zuständig. Die Ergebnisse werden zusammengefasst und an den Upstream zurückgegeben.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_mishards_nodes_3fbe7d255d.jpg" alt="4-mishards-nodes.jpg" class="doc-image" id="4-mishards-nodes.jpg" />
   </span> <span class="img-wrapper"> <span>4-mishards-nodes.jpg</span> </span></p>
<p>Wie aus dem obigen Diagramm hervorgeht, zerlegt Mishards nach der Annahme einer TopK-Suchanfrage die Anfrage zunächst in Teilanfragen und sendet die Teilanfragen an den nachgelagerten Dienst. Wenn alle Teilantworten gesammelt sind, werden die Teilantworten zusammengeführt und an den vorgelagerten Dienst zurückgeschickt.</p>
<p>Da es sich bei Mishards um einen zustandslosen Dienst handelt, speichert er keine Daten und führt keine komplexen Berechnungen durch. Daher haben die Knoten keine hohen Konfigurationsanforderungen, und die Rechenleistung wird hauptsächlich für die Zusammenführung von Teilergebnissen verwendet. Es ist also möglich, die Anzahl der Mishards-Knoten für eine hohe Gleichzeitigkeit zu erhöhen.</p>
<h2 id="Milvus-nodes" class="common-anchor-header">Milvus-Knoten<button data-href="#Milvus-nodes" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus-Knoten sind für CRUD-bezogene Kernoperationen zuständig und haben daher relativ hohe Konfigurationsanforderungen. Erstens sollte die Speichergröße groß genug sein, um zu viele Festplatten-IO-Operationen zu vermeiden. Zweitens können sich auch die CPU-Konfigurationen auf die Leistung auswirken. Je größer der Cluster ist, desto mehr Milvus-Knoten sind erforderlich, um den Systemdurchsatz zu erhöhen.</p>
<h3 id="Read-only-nodes-and-writable-nodes" class="common-anchor-header">Nur-Lese-Knoten und beschreibbare Knoten</h3><ul>
<li>Die Kernoperationen von Milvus sind das Einfügen von Vektoren und die Suche. Die Suche stellt extrem hohe Anforderungen an CPU- und GPU-Konfigurationen, während die Einfügung oder andere Operationen relativ geringe Anforderungen haben. Die Trennung des Knotens, der die Suche ausführt, von dem Knoten, der andere Operationen ausführt, führt zu einer wirtschaftlicheren Bereitstellung.</li>
<li>Im Hinblick auf die Dienstqualität ist die zugehörige Hardware bei der Durchführung von Suchvorgängen voll ausgelastet und kann die Dienstqualität anderer Vorgänge nicht gewährleisten. Daher werden zwei Knotentypen verwendet. Suchanfragen werden von Nur-Lese-Knoten und andere Anfragen von beschreibbaren Knoten bearbeitet.</li>
</ul>
<h3 id="Only-one-writable-node-is-allowed" class="common-anchor-header">Nur ein beschreibbarer Knoten ist erlaubt</h3><ul>
<li><p>Derzeit unterstützt Milvus nicht die gemeinsame Nutzung von Daten für mehrere beschreibbare Instanzen.</p></li>
<li><p>Bei der Bereitstellung muss ein Single-Point-of-Failure von beschreibbaren Knoten berücksichtigt werden. Hochverfügbarkeitslösungen müssen für beschreibbare Knoten vorbereitet werden.</p></li>
</ul>
<h3 id="Read-only-node-scalability" class="common-anchor-header">Skalierbarkeit von Nur-Lese-Knoten</h3><p>Bei extrem großen Datenmengen oder extrem hohen Latenzanforderungen können Sie Nur-Lese-Knoten als Stateful-Knoten horizontal skalieren. Angenommen, es gibt 4 Hosts und jeder hat die folgende Konfiguration: CPU-Kerne: 16, GPU: 1, Speicher: 64 GB. Das folgende Diagramm zeigt den Cluster bei horizontaler Skalierung von Stateful-Knoten. Sowohl die Rechenleistung als auch der Speicher skalieren linear. Die Daten werden in 8 Shards aufgeteilt, wobei jeder Knoten Anfragen von 2 Shards verarbeitet.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_read_only_node_scalability_milvus_be3ee6e0a7.png" alt="5-read-only-node-scalability-milvus.png" class="doc-image" id="5-read-only-node-scalability-milvus.png" />
   </span> <span class="img-wrapper"> <span>5-read-only-node-scalability-milvus.png</span> </span></p>
<p>Wenn die Anzahl der Anfragen für einige Shards groß ist, können zustandslose Nur-Lese-Knoten für diese Shards eingesetzt werden, um den Durchsatz zu erhöhen. Nehmen Sie die oben genannten Hosts als Beispiel. Wenn die Hosts zu einem serverlosen Cluster kombiniert werden, steigt die Rechenleistung linear an. Da die zu verarbeitenden Daten nicht zunehmen, steigt auch die Verarbeitungsleistung für denselben Daten-Shard linear an.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_read_only_node_scalability_milvus_2_2cb98b9aa8.png" alt="6-read-only-node-scalability-milvus-2.png" class="doc-image" id="6-read-only-node-scalability-milvus-2.png" />
   </span> <span class="img-wrapper"> <span>6-read-only-node-scalability-milvus-2.png</span> </span></p>
<h3 id="Metadata-service" class="common-anchor-header">Metadaten-Dienst</h3><p>Schlüsselwörter: MySQL</p>
<p>Weitere Informationen zu den Milvus-Metadaten finden Sie unter Wie man Metadaten anzeigt. In einem verteilten System sind die beschreibbaren Milvus-Knoten die einzigen Produzenten von Metadaten. Mishards-Knoten, beschreibbare Milvus-Knoten und schreibgeschützte Milvus-Knoten sind alle Konsumenten von Metadaten. Derzeit unterstützt Milvus nur MySQL und SQLite als Speicher-Backend für Metadaten. In einem verteilten System kann der Dienst nur als hochverfügbares MySQL bereitgestellt werden.</p>
<h3 id="Service-discovery" class="common-anchor-header">Entdeckung des Dienstes</h3><p>Schlüsselwörter: Apache Zookeeper, etcd, Consul, Kubernetes</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_service_discovery_054a977c6e.png" alt="7-service-discovery.png" class="doc-image" id="7-service-discovery.png" />
   </span> <span class="img-wrapper"> <span>7-dienst-entdeckung.png</span> </span></p>
<p>Service Discovery liefert Informationen über alle Milvus-Knoten. Milvus-Knoten registrieren ihre Informationen, wenn sie online gehen und melden sich ab, wenn sie offline gehen. Milvus-Knoten können auch abnormale Knoten erkennen, indem sie regelmäßig den Gesundheitszustand von Diensten überprüfen.</p>
<p>Die Erkennung von Diensten umfasst eine Vielzahl von Frameworks, darunter etcd, Consul, ZooKeeper, usw. Mishards definiert die Schnittstellen zur Diensterkennung und bietet Möglichkeiten zur Skalierung durch Plugins. Derzeit bietet Mishards zwei Arten von Plugins, die Kubernetes-Clustern und statischen Konfigurationen entsprechen. Sie können Ihre eigene Service-Erkennung anpassen, indem Sie der Implementierung dieser Plugins folgen. Die Schnittstellen sind vorläufig und müssen neu gestaltet werden. Weitere Informationen zum Schreiben eines eigenen Plugins werden in den kommenden Artikeln behandelt.</p>
<h3 id="Load-balancing-and-service-sharding" class="common-anchor-header">Lastverteilung und Service Sharding</h3><p>Schlüsselwörter: Nginx, HAProxy, Kubernetes</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_load_balancing_and_service_sharding_f91891c6c1.png" alt="7-load-balancing-and-service-sharding.png" class="doc-image" id="7-load-balancing-and-service-sharding.png" />
   </span> <span class="img-wrapper"> <span>7-lastverteilung-und-dienstesplitting.png</span> </span></p>
<p>Service Discovery und Load Balancing werden zusammen verwendet. Der Lastausgleich kann als Polling, Hashing oder konsistentes Hashing konfiguriert werden.</p>
<p>Der Load Balancer ist für die Weiterleitung von Benutzeranfragen an den Mishards-Knoten verantwortlich.</p>
<p>Jeder Mishards-Knoten erhält die Informationen aller nachgelagerten Milvus-Knoten über das Service Discovery Center. Alle zugehörigen Metadaten können über den Metadatendienst abgerufen werden. Mishards implementiert Sharding, indem es diese Ressourcen verbraucht. Mishards definiert die Schnittstellen für die Routing-Strategien und bietet Erweiterungen über Plugins. Derzeit bietet Mishards eine konsistente Hashing-Strategie, die auf der untersten Segmentebene basiert. Wie in der Grafik dargestellt, gibt es 10 Segmente, s1 bis s10. Gemäß der segmentbasierten konsistenten Hashing-Strategie leitet Mishards Anfragen, die s1, 24, s6 und s9 betreffen, an den Milvus-1-Knoten, s2, s3, s5 an den Milvus-2-Knoten und s7, s8, s10 an den Milvus-3-Knoten.</p>
<p>Basierend auf Ihren geschäftlichen Anforderungen können Sie das Routing anpassen, indem Sie dem Standard-Routing-Plugin für konsistentes Hashing folgen.</p>
<h3 id="Tracing" class="common-anchor-header">Nachverfolgung</h3><p>Schlüsselwörter: OpenTracing, Jaeger, Zipkin</p>
<p>Angesichts der Komplexität eines verteilten Systems werden Anfragen an mehrere interne Dienstaufrufe gesendet. Um Probleme zu lokalisieren, müssen wir die Kette der internen Dienstaufrufe verfolgen. Da die Komplexität zunimmt, sind die Vorteile eines verfügbaren Tracing-Systems selbsterklärend. Wir haben uns für den CNCF OpenTracing-Standard entschieden. OpenTracing bietet plattform- und herstellerunabhängige APIs für Entwickler, um ein Tracing-System einfach zu implementieren.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_tracing_demo_milvus_fd385f0aba.png" alt="8-tracing-demo-milvus.png" class="doc-image" id="8-tracing-demo-milvus.png" />
   </span> <span class="img-wrapper"> <span>8-tracing-demo-milvus.png</span> </span></p>
<p>Das vorherige Diagramm ist ein Beispiel für das Tracing während eines Suchaufrufs. Die Suche ruft <code translate="no">get_routing</code>, <code translate="no">do_search</code> und <code translate="no">do_merge</code> nacheinander auf. <code translate="no">do_search</code> ruft auch <code translate="no">search_127.0.0.1</code> auf.</p>
<p>Der gesamte Trace-Datensatz bildet den folgenden Baum:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_search_traceid_milvus_35040d75bc.png" alt="8-search-traceid-milvus.png" class="doc-image" id="8-search-traceid-milvus.png" />
   </span> <span class="img-wrapper"> <span>8-search-traceid-milvus.png</span> </span></p>
<p>Die folgende Tabelle zeigt Beispiele für Anfrage-/Antwort-Informationen und Tags der einzelnen Knoten:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/request_response_info_tags_node_milvus_e169a31cb1.png" alt="request-response-info-tags-node-milvus.png" class="doc-image" id="request-response-info-tags-node-milvus.png" />
   </span> <span class="img-wrapper"> <span>request-response-info-tags-node-milvus.png</span> </span></p>
<p>OpenTracing wurde in Milvus integriert. Weitere Informationen werden in den kommenden Artikeln behandelt.</p>
<h3 id="Monitoring-and-alerting" class="common-anchor-header">Überwachung und Alarmierung</h3><p>Stichworte: Prometheus, Grafana</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/10_monitor_alert_milvus_3ae8910af6.jpg" alt="10-monitor-alert-milvus.jpg" class="doc-image" id="10-monitor-alert-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>10-überwachen-warnen-milvus.jpg</span> </span></p>
<h2 id="Summary" class="common-anchor-header">Zusammenfassung<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Als Service-Middleware integriert Mishards Service Discovery, Routing Request, Result Merging und Tracing. Eine Plugin-basierte Erweiterung ist ebenfalls vorgesehen. Derzeit haben verteilte Lösungen, die auf Mishards basieren, noch die folgenden Nachteile:</p>
<ul>
<li>Mishards verwendet einen Proxy als mittlere Schicht und hat Latenzkosten.</li>
<li>Die beschreibbaren Knoten von Milvus sind Ein-Punkt-Dienste.</li>
<li>Die Bereitstellung ist kompliziert, wenn es mehrere Shards gibt und ein einzelner Shard mehrere Kopien hat.</li>
<li>Es fehlt eine Cache-Schicht, z. B. für den Zugriff auf Metadaten.</li>
</ul>
<p>Wir werden diese bekannten Probleme in den kommenden Versionen beheben, so dass Mishards bequemer in der Produktionsumgebung eingesetzt werden können.</p>
