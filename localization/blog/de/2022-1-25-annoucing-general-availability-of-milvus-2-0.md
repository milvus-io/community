---
id: 2022-1-25-annoucing-general-availability-of-milvus-2-0.md
title: Ankündigung der allgemeinen Verfügbarkeit von Milvus 2.0
author: Xiaofan Luan
date: 2022-01-25T00:00:00.000Z
desc: Ein einfacher Weg zur Verarbeitung umfangreicher hochdimensionaler Daten
cover: assets.zilliz.com/Milvus_2_0_GA_4308a0f552.png
tag: News
---
<p>Liebe Mitglieder und Freunde der Milvus Community:</p>
<p>Heute, sechs Monate nachdem der erste Release Candidate (RC) veröffentlicht wurde, freuen wir uns, Ihnen mitteilen zu können, dass Milvus 2.0 <a href="https://milvus.io/docs/v2.0.x/release_notes.md#v200">allgemein verfügbar (GA)</a> und produktionsreif ist! Es war ein langer Weg, und wir danken allen, die uns auf diesem Weg geholfen haben - Community-Mitarbeitern, Nutzern und der LF AI &amp; Data Foundation.</p>
<p>Die Fähigkeit, Milliarden von hochdimensionalen Daten zu verarbeiten, ist für KI-Systeme heutzutage von großer Bedeutung - und das aus gutem Grund:</p>
<ol>
<li>Unstrukturierte Daten nehmen im Vergleich zu traditionellen strukturierten Daten ein dominantes Volumen ein.</li>
<li>Die Aktualität der Daten war noch nie so wichtig wie heute. Datenwissenschaftler sind an zeitnahen Datenlösungen interessiert und nicht an dem traditionellen T+1-Kompromiss.</li>
<li>Kosten und Leistung sind noch kritischer geworden, und dennoch klafft immer noch eine große Lücke zwischen aktuellen Lösungen und realen Anwendungsfällen. Daher Milvus 2.0. Milvus ist eine Datenbank, die den Umgang mit hochdimensionalen Daten in großem Umfang ermöglicht. Sie ist für die Cloud konzipiert und kann überall eingesetzt werden. Wenn Sie unsere RC-Releases verfolgt haben, wissen Sie, dass wir große Anstrengungen unternommen haben, um Milvus stabiler und einfacher zu implementieren und zu warten zu machen.</li>
</ol>
<h2 id="Milvus-20-GA-now-offers" class="common-anchor-header">Milvus 2.0 GA bietet jetzt<button data-href="#Milvus-20-GA-now-offers" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Löschung von Entitäten</strong></p>
<p>Als Datenbank unterstützt Milvus jetzt das <a href="https://milvus.io/docs/v2.0.x/delete_data.md">Löschen von Entitäten nach Primärschlüssel</a> und wird später das Löschen von Entitäten nach Ausdruck unterstützen.</p>
<p><strong>Automatischer Lastausgleich</strong></p>
<p>Milvus unterstützt jetzt die Plugin-Lastausgleichspolitik, um die Last der einzelnen Abfrage- und Datenknoten auszugleichen. Dank der Disaggregation von Berechnung und Speicherung wird der Ausgleich in nur wenigen Minuten erledigt sein.</p>
<p><strong>Weiterleitung</strong></p>
<p>Sobald wachsende Segmente durch Flush versiegelt sind, ersetzen Handoff-Aufgaben wachsende Segmente durch indizierte historische Segmente, um die Suchleistung zu verbessern.</p>
<p><strong>Datenverdichtung</strong></p>
<p>Bei der Datenverdichtung handelt es sich um eine Hintergrundaufgabe, die kleine Segmente zu großen Segmenten zusammenführt und logisch gelöschte Daten bereinigt.</p>
<p><strong>Unterstützung von eingebettetem etcd und lokalem Datenspeicher</strong></p>
<p>Im Standalone-Modus von Milvus können wir die Abhängigkeit von etcd/MinIO mit nur wenigen Konfigurationen entfernen. Der lokale Datenspeicher kann auch als lokaler Cache verwendet werden, um das Laden aller Daten in den Hauptspeicher zu vermeiden.</p>
<p><strong>Mehrsprachige SDKs</strong></p>
<p>Zusätzlich zu <a href="https://github.com/milvus-io/pymilvus">PyMilvus</a> sind jetzt auch <a href="https://github.com/milvus-io/milvus-sdk-node">Node.js</a>, <a href="https://github.com/milvus-io/milvus-sdk-java">Java</a> und <a href="https://github.com/milvus-io/milvus-sdk-go">Go</a> SDKs einsatzbereit.</p>
<p><strong>Milvus K8s Operator</strong></p>
<p><a href="https://milvus.io/docs/v2.0.x/install_cluster-milvusoperator.md">Milvus Operator</a> bietet eine einfache Lösung für die Bereitstellung und Verwaltung eines vollständigen Milvus-Service-Stacks, der sowohl Milvus-Komponenten als auch deren relevante Abhängigkeiten (z. B. etcd, Pulsar und MinIO) umfasst, in den <a href="https://kubernetes.io/">Ziel-Kubernetes-Clustern</a> auf skalierbare und hochverfügbare Weise.</p>
<p><strong>Tools, die bei der Verwaltung von Milvus helfen</strong></p>
<p>Wir haben <a href="https://zilliz.com/">Zilliz</a> für den fantastischen Beitrag von Management-Tools zu danken. Wir haben jetzt <a href="https://milvus.io/docs/v2.0.x/attu.md">Attu</a>, das uns die Interaktion mit Milvus über eine intuitive GUI ermöglicht, und <a href="https://milvus.io/docs/v2.0.x/cli_overview.md">Milvus_CLI</a>, ein Kommandozeilen-Tool für die Verwaltung von Milvus.</p>
<p>Dank aller 212 Mitwirkenden hat die Community in den letzten 6 Monaten 6718 Commits fertiggestellt, und eine Menge Stabilitäts- und Leistungsprobleme wurden geschlossen. Wir werden unseren Stabilitäts- und Leistungs-Benchmark-Bericht bald nach der Veröffentlichung von 2.0 GA veröffentlichen.</p>
<h2 id="Whats-next" class="common-anchor-header">Was kommt als Nächstes?<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Funktionalität</strong></p>
<p>Die Unterstützung von String-Typen wird das nächste Killer-Feature für Milvus 2.1 sein. Wir werden auch einen Time-to-Live-Mechanismus (TTL) und eine grundlegende ACL-Verwaltung einführen, um die Bedürfnisse der Benutzer besser zu erfüllen.</p>
<p><strong>Verfügbarkeit</strong></p>
<p>Wir arbeiten an der Überarbeitung des Abfragekoordinaten-Scheduling-Mechanismus, um mehrere Speicherreplikate für jedes Segment zu unterstützen. Mit mehreren aktiven Replikaten kann Milvus eine schnellere Ausfallsicherung und spekulative Ausführung unterstützen, um die Ausfallzeit auf wenige Sekunden zu verkürzen.</p>
<p><strong>Leistung</strong></p>
<p>Die Ergebnisse von Leistungsvergleichen werden demnächst auf unseren Websites veröffentlicht. Die folgenden Versionen werden voraussichtlich eine beeindruckende Leistungsverbesserung aufweisen. Unser Ziel ist die Halbierung der Suchlatenz bei kleineren Datenmengen und die Verdoppelung des Systemdurchsatzes.</p>
<p><strong>Benutzerfreundlichkeit</strong></p>
<p>Milvus ist so konzipiert, dass es überall läuft. Wir werden Milvus auf MacOS (sowohl M1 als auch X86) und auf ARM-Servern in den nächsten kleinen Versionen unterstützen. Wir werden auch eingebettetes PyMilvus anbieten, so dass Sie einfach <code translate="no">pip install</code> Milvus ohne komplexe Umgebungseinrichtung verwenden können.</p>
<p><strong>Verwaltung der Gemeinschaft</strong></p>
<p>Wir werden die Regeln für die Mitgliedschaft verfeinern und die Anforderungen und Verantwortlichkeiten der Mitwirkendenrollen klären. Ein Mentorenprogramm ist ebenfalls in der Entwicklung; jeder, der sich für Cloud-native Datenbanken, Vektorsuche und/oder Community Governance interessiert, kann sich gerne an uns wenden.</p>
<p>Wir freuen uns sehr über die neueste Version von Milvus GA! Wie immer freuen wir uns über Ihr Feedback. Sollten Sie auf Probleme stoßen, zögern Sie nicht, uns auf <a href="https://github.com/milvus-io/milvus">GitHub</a> oder über <a href="http://milvusio.slack.com/">Slack</a> zu kontaktieren.</p>
<p><br/></p>
<p>Mit freundlichen Grüßen,</p>
<p>Xiaofan Luan</p>
<p>Milvus-Projektbetreuerin</p>
<p><br/></p>
<blockquote>
<p><em>Bearbeitet von <a href="https://github.com/claireyuw">Claire Yu</a>.</em></p>
</blockquote>
