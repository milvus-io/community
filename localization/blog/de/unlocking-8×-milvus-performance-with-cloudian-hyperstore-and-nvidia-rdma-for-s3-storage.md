---
id: >-
  unlocking-8×-milvus-performance-with-cloudian-hyperstore-and-nvidia-rdma-for-s3-storage.md
title: >-
  8-fache Milvus-Leistung mit Cloudian HyperStore und NVIDIA RDMA für
  S3-Speicher freisetzen
author: Jon Toor
date: 2025-11-17T00:00:00.000Z
cover: assets.zilliz.com/cloudian_b7531febff.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Cloudian, NVIDIA, RDMA for S3-compatible storage, Milvus'
meta_title: 8× Milvus Boost with Cloudian HyperStore and NVIDIA RDMA
desc: >-
  Cloudian und NVIDIA führen RDMA für S3-kompatiblen Speicher ein, beschleunigen
  KI-Workloads mit geringer Latenz und ermöglichen eine 8-fache
  Leistungssteigerung in Milvus.
origin: >-
  https://cloudian.com/blog/cloudian-deploys-new-nvidia-rdma-for-s3-compatible-storage-a-game-changer-for-ai-storage-performance/
---
<p><em>Dieser Beitrag wurde ursprünglich auf <a href="https://cloudian.com/blog/cloudian-deploys-new-nvidia-rdma-for-s3-compatible-storage-a-game-changer-for-ai-storage-performance/">Cloudian</a> veröffentlicht und wird hier mit Genehmigung wiederveröffentlicht.</em></p>
<p>Cloudian hat mit NVIDIA zusammengearbeitet, um seiner HyperStore®-Lösung Unterstützung für RDMA für S3-kompatiblen Speicher hinzuzufügen und dabei seine mehr als 13-jährige Erfahrung in der S3-API-Implementierung zu nutzen. Als S3-API-basierte Plattform mit paralleler Verarbeitungsarchitektur ist Cloudian in einzigartiger Weise geeignet, zur Entwicklung dieser Technologie beizutragen und davon zu profitieren. Diese Zusammenarbeit nutzt Cloudians fundiertes Fachwissen im Bereich der Objektspeicherprotokolle und NVIDIAs führende Rolle bei der Rechen- und Netzwerkbeschleunigung, um eine Lösung zu schaffen, die High-Performance-Computing nahtlos mit Speicherlösungen für Unternehmen verbindet.</p>
<p>NVIDIA hat die bevorstehende allgemeine Verfügbarkeit der RDMA-Technologie für S3-kompatible Speicher (Remote Direct Memory Access) angekündigt und damit einen wichtigen Meilenstein in der Entwicklung der KI-Infrastruktur gesetzt. Diese bahnbrechende Technologie verspricht, die Art und Weise zu verändern, wie Unternehmen die massiven Datenanforderungen moderner KI-Workloads bewältigen. Sie bietet beispiellose Leistungsverbesserungen bei gleichzeitiger Beibehaltung der Skalierbarkeit und Einfachheit, die S3-kompatiblen Objektspeicher zur Grundlage des Cloud Computing gemacht haben.</p>
<h2 id="What-is-RDMA-for-S3-compatible-storage" class="common-anchor-header">Was ist RDMA für S3-kompatiblen Speicher?<button data-href="#What-is-RDMA-for-S3-compatible-storage" class="anchor-icon" translate="no">
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
    </button></h2><p>Diese Einführung stellt einen grundlegenden Fortschritt in der Art und Weise dar, wie Speichersysteme mit KI-Beschleunigern kommunizieren. Die Technologie ermöglicht direkte Datenübertragungen zwischen S3-API-kompatiblem Objektspeicher und GPU-Speicher, wobei herkömmliche, von der CPU vermittelte Datenpfade vollständig umgangen werden. Im Gegensatz zu konventionellen Speicherarchitekturen, die alle Datenübertragungen über die CPU und den Systemspeicher leiten, was zu Engpässen und Latenzzeiten führt, stellt DDMA für S3-kompatible Speicher eine direkte Datenautobahn vom Speicher zur GPU her.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/RDMA_for_S3_compatible_storage_18fdd69d02.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Im Kern eliminiert diese Technologie Zwischenschritte mit einem direkten Pfad, der die Latenzzeit reduziert, die CPU-Verarbeitungsanforderungen drastisch senkt und den Stromverbrauch erheblich verringert. Das Ergebnis sind Speichersysteme, die Daten mit der Geschwindigkeit liefern können, die moderne GPUs für anspruchsvolle KI-Anwendungen benötigen.</p>
<p>Die Technologie behält die Kompatibilität mit den allgegenwärtigen S3-APIs bei und fügt gleichzeitig diesen Hochleistungsdatenpfad hinzu. Befehle werden nach wie vor über standardmäßige S3-API-basierte Speicherprotokolle erteilt, aber die eigentliche Datenübertragung erfolgt über RDMA direkt an den GPU-Speicher, wodurch die CPU vollständig umgangen wird und der Overhead der TCP-Protokollverarbeitung entfällt.</p>
<h2 id="Breakthrough-Performance-Results" class="common-anchor-header">Bahnbrechende Leistungsergebnisse<button data-href="#Breakthrough-Performance-Results" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Leistungsverbesserungen, die RDMA für S3-kompatible Speicher liefert, sind geradezu revolutionär. Praxistests haben gezeigt, dass die Technologie in der Lage ist, E/A-Engpässe im Speicher zu beseitigen, die KI-Workloads behindern.</p>
<h3 id="Dramatic-Speed-Improvements" class="common-anchor-header">Dramatische Geschwindigkeitsverbesserungen:</h3><ul>
<li><p><strong>35 GB/s pro Knoten</strong> gemessener<strong>Durchsatz</strong> (Lesen), mit linearer Skalierbarkeit über Cluster hinweg</p></li>
<li><p><strong>Skalierbarkeit auf TB/s</strong> mit der parallelen Verarbeitungsarchitektur von Cloudian</p></li>
<li><p><strong>3-5-fache Durchsatzverbesserung</strong> im Vergleich zu herkömmlicher TCP-basierter Objektspeicherung</p></li>
</ul>
<h3 id="Resource-Efficiency-Gains" class="common-anchor-header">Gewonnene Ressourceneffizienz:</h3><ul>
<li><p><strong>90%ige Reduzierung der CPU-Auslastung</strong> durch Einrichtung direkter Datenpfade zu GPUs</p></li>
<li><p><strong>Höhere GPU-Auslastung</strong> durch Beseitigung von Engpässen</p></li>
<li><p>Drastische Reduzierung des Stromverbrauchs durch geringeren Verarbeitungs-Overhead</p></li>
<li><p>Kostensenkungen für KI-Speicher</p></li>
</ul>
<h3 id="8X-Performance-Boost-on-Milvus-by-Zilliz-Vector-DB" class="common-anchor-header">8-fache Leistungssteigerung auf Milvus durch Zilliz Vector DB</h3><p>Diese Leistungsverbesserungen werden besonders bei Vektordatenbankoperationen deutlich, wo die Zusammenarbeit zwischen Cloudian und Zilliz unter Verwendung von <a href="https://developer.nvidia.com/cuvs">NVIDIA cuVS</a> und <a href="https://www.nvidia.com/en-us/data-center/l40s/">NVIDIA L40S GPUs</a> eine <strong>8-fache Leistungssteigerung bei Milvus-Operationen</strong> im Vergleich zu CPU-basierten Systemen und TCP-basierter Datenübertragung zeigte. Dies stellt einen grundlegenden Wandel dar, weg vom Speicher als Hindernis hin zum Speicher, der es KI-Anwendungen ermöglicht, ihr volles Potenzial auszuschöpfen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_indexing_time_354bdd4b46.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Why-S3-API-based-Object-Storage-for-AI-Workloads" class="common-anchor-header">Warum S3 API-basierter Objektspeicher für KI-Workloads<button data-href="#Why-S3-API-based-Object-Storage-for-AI-Workloads" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Konvergenz von RDMA-Technologie und Objektspeicherarchitektur schafft die ideale Grundlage für KI-Infrastrukturen und löst mehrere Herausforderungen, die herkömmliche Speicheransätze einschränken.</p>
<p><strong>Skalierbarkeit im Exabyte-Bereich für die Datenexplosion bei KI:</strong> KI-Workloads, insbesondere solche mit synthetischen und multimodalen Daten, treiben die Speicheranforderungen in den 100-Petabyte-Bereich und darüber hinaus. Der flache Adressraum des Objektspeichers lässt sich nahtlos von Petabyte bis Exabyte skalieren und trägt so dem exponentiellen Wachstum der KI-Trainingsdaten Rechnung, ohne die hierarchischen Beschränkungen, die dateibasierte Systeme einschränken.</p>
<p><strong>Einheitliche Plattform für vollständige KI-Workflows:</strong> Moderne KI-Abläufe umfassen Dateneingabe, Bereinigung, Training, Checkpointing und Inferenz - jeder mit eigenen Leistungs- und Kapazitätsanforderungen. S3-kompatibler Objektspeicher unterstützt dieses gesamte Spektrum durch konsistenten API-Zugriff, wodurch die Komplexität und die Kosten für die Verwaltung mehrerer Speicherebenen entfallen. Trainingsdaten, Modelle, Checkpoint-Dateien und Inferenzdatensätze können alle in einem einzigen, leistungsstarken Data Lake gespeichert werden.</p>
<p><strong>Umfangreiche Metadaten für KI-Operationen:</strong> Kritische KI-Vorgänge wie Suche und Aufzählung sind grundsätzlich metadatengesteuert. Die umfangreichen, anpassbaren Metadatenfunktionen des Objektspeichers ermöglichen eine effiziente Kennzeichnung, Suche und Verwaltung von Daten, die für die Organisation und den Abruf von Daten in komplexen KI-Modellschulungs- und Inferenz-Workflows unerlässlich sind.</p>
<p><strong>Wirtschaftliche und betriebliche Vorteile:</strong> S3-kompatibler Objektspeicher bietet bis zu 80 % niedrigere Gesamtbetriebskosten im Vergleich zu alternativen Dateispeichern, indem er branchenübliche Hardware und eine unabhängige Skalierung von Kapazität und Leistung nutzt. Diese wirtschaftliche Effizienz ist von entscheidender Bedeutung, wenn KI-Datensätze Unternehmensgröße erreichen.</p>
<p><strong>Unternehmenssicherheit und Governance:</strong> Im Gegensatz zu GPUDirect-Implementierungen, die Änderungen auf Kernel-Ebene erfordern, sind bei RDMA für S3-kompatiblen Speicher keine herstellerspezifischen Kernel-Änderungen erforderlich, wodurch die Systemsicherheit und die Einhaltung gesetzlicher Vorschriften gewährleistet werden. Dieser Ansatz ist besonders wertvoll in Sektoren wie dem Gesundheitswesen und dem Finanzwesen, wo Datensicherheit und die Einhaltung gesetzlicher Vorschriften von größter Bedeutung sind.</p>
<h2 id="The-Road-Ahead" class="common-anchor-header">Der Weg in die Zukunft<button data-href="#The-Road-Ahead" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Ankündigung von NVIDIA, dass RDMA für S3-kompatiblen Speicher allgemein verfügbar ist, stellt mehr als nur einen technologischen Meilenstein dar - sie ist ein Zeichen für die Reifung der KI-Infrastrukturarchitektur. Durch die Kombination der unbegrenzten Skalierbarkeit von Objektspeicher mit der bahnbrechenden Leistung des direkten GPU-Zugriffs können Unternehmen endlich KI-Infrastrukturen aufbauen, die mit ihren Ambitionen mitwachsen.</p>
<p>Da die KI-Workloads immer komplexer und umfangreicher werden, bietet RDMA für S3-kompatiblen Speicher die Speichergrundlage, die es Unternehmen ermöglicht, ihre KI-Investitionen zu maximieren und gleichzeitig die Datenhoheit und die betriebliche Einfachheit zu wahren. Die Technologie verwandelt Speicher von einem Engpass in einen Enabler, so dass KI-Anwendungen ihr volles Potenzial im Unternehmensmaßstab ausschöpfen können.</p>
<p>Für Unternehmen, die ihre KI-Infrastruktur-Roadmap planen, markiert die allgemeine Verfügbarkeit von RDMA für S3-kompatiblen Speicher den Beginn einer neuen Ära, in der die Speicherleistung wirklich den Anforderungen moderner KI-Workloads entspricht.</p>
<h2 id="Industry-Perspectives" class="common-anchor-header">Branchenperspektiven<button data-href="#Industry-Perspectives" class="anchor-icon" translate="no">
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
    </button></h2><p>Da KI in der Gesundheitsversorgung zunehmend an Bedeutung gewinnt, sind wir ständig bestrebt, die Leistung und Effizienz unserer Infrastruktur zu steigern. Das neue RDMA für S3-kompatiblen Speicher von NVIDIA und Cloudian wird für unsere medizinischen Bildgebungsanalysen und KI-Diagnoseanwendungen von entscheidender Bedeutung sein, denn die schnelle Verarbeitung großer Datensätze kann sich direkt auf die Patientenversorgung auswirken und gleichzeitig die Kosten für die Übertragung von Daten zwischen S3-API-basierten Speichergeräten und SSD-basierten NAS-Speichern senken.  - <em>Dr. Swapnil Rane MD, DNB, PDCC (Nephropath), Mres (TCM), Fellowship in Oncopath, FRCPath Professor (F) für Pathologie, PI, AI/Computational Pathology And Imaging Lab OIC- Abteilung für digitale und computergestützte Onkologie, Tata Memorial Centre</em></p>
<p>"Die Ankündigung von NVIDIA, RDMA für S3-kompatibel zu machen, bestätigt den Wert unserer Cloud-basierten KI-Infrastrukturstrategie. Wir ermöglichen es Unternehmen, hochleistungsfähige KI im großen Maßstab auszuführen und gleichzeitig die S3-API-Kompatibilität zu erhalten, die die Migration einfach und die Kosten für die Anwendungsentwicklung niedrig hält." - <em>Sunil Gupta, Mitbegründer, Managing Director &amp; Chief Executive Officer (CEO), Yotta Data Services</em></p>
<p>"Während wir unsere On-Premises-Fähigkeiten zur Bereitstellung von souveräner KI ausbauen, bieten uns NVIDIAs RDMA für S3-kompatible Speichertechnologie und Cloudians hochleistungsfähiger Objektspeicher die Leistung, die wir benötigen, ohne die Datenresidenz zu beeinträchtigen und ohne dass Änderungen auf Kernel-Ebene erforderlich sind. Mit der HyperStore-Plattform von Cloudian können wir auf Exabytes skalieren und gleichzeitig unsere sensiblen KI-Daten vollständig unter unserer Kontrolle behalten." - <em>Logan Lee, EVP &amp; Head of Cloud, Kakao</em></p>
<p>"Wir freuen uns über NVIDIAs Ankündigung der kommenden RDMA for S3-kompatiblen Speicher-GA-Version. Unsere Tests mit Cloudian haben eine bis zu 8-fache Leistungsverbesserung für Vektordatenbankoperationen ergeben, die es unseren Milvus by Zilliz-Nutzern ermöglichen wird, Cloud-Scale-Performance für anspruchsvolle KI-Workloads zu erreichen und gleichzeitig die vollständige Datenhoheit zu behalten." - <em>Charles Xie, Gründer und CEO von Zilliz</em></p>
