---
id: deep-dive-6-oss-qa.md
title: Qualitätssicherung für Open-Source-Software (OSS) - eine Fallstudie von Milvus
author: Wenxing Zhu
date: 2022-04-25T00:00:00.000Z
desc: >-
  Bei der Qualitätssicherung wird festgestellt, ob ein Produkt oder eine
  Dienstleistung bestimmte Anforderungen erfüllt.
cover: assets.zilliz.com/Deep_Dive_6_c2cd44801d.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-6-oss-qa.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deep_Dive_6_c2cd44801d.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Titelbild</span> </span></p>
<blockquote>
<p>Dieser Artikel wurde von <a href="https://github.com/zhuwenxing">Wenxing Zhu</a> geschrieben und von <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a> umgeschrieben.</p>
</blockquote>
<p>Qualitätssicherung (QS) ist ein systematischer Prozess, mit dem festgestellt wird, ob ein Produkt oder eine Dienstleistung bestimmte Anforderungen erfüllt. Ein QS-System ist ein unverzichtbarer Bestandteil des F&amp;E-Prozesses, da es, wie der Name schon sagt, die Qualität des Produkts sicherstellt.</p>
<p>In diesem Beitrag wird der QS-Rahmen vorgestellt, der bei der Entwicklung der Vektordatenbank Milvus angewandt wurde, um Entwicklern und Benutzern einen Leitfaden für die Teilnahme an diesem Prozess zu bieten. Außerdem werden die wichtigsten Testmodule in Milvus sowie Methoden und Werkzeuge vorgestellt, die zur Verbesserung der Effizienz von QA-Tests eingesetzt werden können.</p>
<p><strong>Springen Sie zu:</strong></p>
<ul>
<li><a href="#A-general-introduction-to-the-Milvus-QA-system">Eine allgemeine Einführung in das Milvus QA-System</a></li>
<li><a href="#Test-modules-in-Milvus">Testmodule in Milvus</a></li>
<li><a href="#Tools-and-methods-for-better-QA-efficiency">Werkzeuge und Methoden für eine bessere QA-Effizienz</a></li>
</ul>
<h2 id="A-general-introduction-to-the-Milvus-QA-system" class="common-anchor-header">Eine allgemeine Einführung in das Milvus QA System<button data-href="#A-general-introduction-to-the-Milvus-QA-system" class="anchor-icon" translate="no">
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
    </button></h2><p>Die <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Systemarchitektur</a> ist entscheidend für die Durchführung von QA-Tests. Je besser ein QA-Ingenieur mit dem System vertraut ist, desto eher wird er oder sie einen vernünftigen und effizienten Testplan erstellen.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_architecture_feaccc489d.png" alt="Milvus architecture" class="doc-image" id="milvus-architecture" />
   </span> <span class="img-wrapper"> <span>Milvus-Architektur</span> </span></p>
<p>Milvus 2.0 verwendet eine <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#A-cloud-native-first-approach">cloud-native, verteilte und mehrschichtige Architektur</a>, wobei das SDK der <a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">Haupteingang für den Datenfluss</a> in Milvus ist. Die Milvus-Benutzer nutzen das SDK sehr häufig, daher sind Funktionstests auf der SDK-Seite sehr wichtig. Außerdem können Funktionstests für das SDK dabei helfen, interne Probleme zu erkennen, die innerhalb des Milvus-Systems auftreten könnten. Neben den Funktionstests werden auch andere Arten von Tests für die Vektordatenbank durchgeführt, darunter Unit-Tests, Deployment-Tests, Zuverlässigkeitstests, Stabilitätstests und Leistungstests.</p>
<p>Eine Cloud-native und verteilte Architektur bringt sowohl Vorteile als auch Herausforderungen für QA-Tests mit sich. Im Gegensatz zu Systemen, die lokal bereitgestellt und ausgeführt werden, kann eine Milvus-Instanz, die auf einem Kubernetes-Cluster bereitgestellt und ausgeführt wird, sicherstellen, dass Softwaretests unter den gleichen Bedingungen wie die Softwareentwicklung durchgeführt werden. Der Nachteil ist jedoch, dass die Komplexität der verteilten Architektur mehr Unwägbarkeiten mit sich bringt, die das QA-Testen des Systems noch schwieriger und anstrengender machen können. Milvus 2.0 verwendet zum Beispiel Microservices aus verschiedenen Komponenten, was zu einer größeren Anzahl von <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#A-bare-bones-skeleton-of-the-Milvus-architecture">Diensten und Knoten</a> führt und die Möglichkeit eines Systemfehlers erhöht. Folglich ist ein ausgefeilterer und umfassenderer QA-Plan für eine bessere Testeffizienz erforderlich.</p>
<h3 id="QA-testings-and-issue-management" class="common-anchor-header">QA-Tests und Problemmanagement</h3><p>Die Qualitätssicherung in Milvus umfasst sowohl die Durchführung von Tests als auch die Verwaltung von Problemen, die während der Softwareentwicklung auftreten.</p>
<h4 id="QA-testings" class="common-anchor-header">QA-Prüfungen</h4><p>Milvus führt verschiedene Arten von QA-Tests durch, je nach den Funktionen von Milvus und den Bedürfnissen der Benutzer in der Reihenfolge ihrer Priorität, wie in der folgenden Abbildung dargestellt.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_14_2aff081d41.png" alt="QA testing priority" class="doc-image" id="qa-testing-priority" />
   </span> <span class="img-wrapper"> <span>Priorität der QA-Tests</span> </span></p>
<p>QA-Tests werden in Milvus zu den folgenden Aspekten mit der folgenden Priorität durchgeführt:</p>
<ol>
<li><strong>Funktion</strong>: Überprüfen, ob die Funktionen und Merkmale wie ursprünglich geplant funktionieren.</li>
<li><strong>Einsatz</strong>: Prüfen, ob ein Benutzer sowohl die Mivus-Standalone-Version als auch den Milvus-Cluster mit verschiedenen Methoden (Docker Compose, Helm, APT oder YUM usw.) bereitstellen, neu installieren und aktualisieren kann.</li>
<li><strong>Leistung</strong>:  Testen Sie die Leistung von Dateneinfügung, Indexierung, Vektorsuche und Abfrage in Milvus.</li>
<li><strong>Stabilität</strong>: Prüfen Sie, ob Milvus bei normaler Arbeitslast 5-10 Tage lang stabil läuft.</li>
<li><strong>Verlässlichkeit</strong>: Testen Sie, ob Milvus bei bestimmten Systemfehlern noch teilweise funktionieren kann.</li>
<li><strong>Konfiguration</strong>: Überprüfen Sie, ob Milvus unter einer bestimmten Konfiguration wie erwartet funktioniert.</li>
<li><strong>Kompatibilität</strong>: Testen Sie, ob Milvus mit verschiedenen Arten von Hardware oder Software kompatibel ist.</li>
</ol>
<h4 id="Issue-management" class="common-anchor-header">Problembehandlung</h4><p>Während der Softwareentwicklung können viele Probleme auftauchen. Der Autor dieser Probleme kann ein QA-Ingenieur oder ein Milvus-Benutzer aus der Open-Source-Community sein. Das QA-Team ist für die Behebung der Probleme verantwortlich.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Issue_management_workflow_12c726efa1.png" alt="Issue management workflow" class="doc-image" id="issue-management-workflow" />
   </span> <span class="img-wrapper"> <span>Arbeitsablauf der Problemverwaltung</span> </span></p>
<p>Wenn ein <a href="https://github.com/milvus-io/milvus/issues">Issue</a> erstellt wird, durchläuft es zunächst die Triage. Während der Triage werden neue Probleme untersucht, um sicherzustellen, dass ausreichende Details zu den Problemen bereitgestellt werden. Wenn das Problem bestätigt wird, wird es von den Entwicklern akzeptiert, die dann versuchen, das Problem zu beheben. Sobald die Entwicklung abgeschlossen ist, muss der Problemautor überprüfen, ob das Problem behoben ist. Wenn ja, wird das Problem endgültig geschlossen.</p>
<h3 id="When-is-QA-needed" class="common-anchor-header">Wann wird QA benötigt?</h3><p>Ein weit verbreiteter Irrglaube ist, dass QA und Entwicklung unabhängig voneinander sind. Die Wahrheit ist jedoch, dass die Qualität des Systems nur dann gewährleistet werden kann, wenn sowohl die Entwickler als auch die QA-Ingenieure daran mitarbeiten. Daher muss die Qualitätssicherung während des gesamten Lebenszyklus einbezogen werden.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/QA_lifecycle_375f4fd8a8.png" alt="QA lifecycle" class="doc-image" id="qa-lifecycle" />
   </span> <span class="img-wrapper"> <span>QA-Lebenszyklus</span> </span></p>
<p>Wie in der obigen Abbildung dargestellt, umfasst ein vollständiger Software-F&amp;E-Lebenszyklus drei Phasen.</p>
<p>In der Anfangsphase veröffentlichen die Entwickler die Entwurfsdokumentation, während die QS-Ingenieure Testpläne ausarbeiten, Freigabekriterien festlegen und QS-Aufgaben zuweisen. Entwickler und QS-Ingenieure müssen sowohl mit der Entwurfsdokumentation als auch mit dem Testplan vertraut sein, damit beide Teams ein gemeinsames Verständnis vom Ziel der Veröffentlichung (in Bezug auf Funktionen, Leistung, Stabilität, Fehlerkonvergenz usw.) haben.</p>
<p>Während der Forschungs- und Entwicklungsphase arbeiten Entwicklung und Qualitätssicherung häufig zusammen, um Funktionen und Merkmale zu entwickeln und zu überprüfen sowie Fehler und Probleme zu beheben, die von der <a href="https://slack.milvus.io/">Open-Source-Gemeinschaft</a> gemeldet werden.</p>
<p>In der letzten Phase wird, wenn die Freigabekriterien erfüllt sind, ein neues Docker-Image der neuen Milvus-Version freigegeben. Für die offizielle Freigabe sind eine Release-Note mit den neuen Funktionen und behobenen Fehlern sowie ein Release-Tag erforderlich. Dann wird das QA-Team auch einen Testbericht zu dieser Version veröffentlichen.</p>
<h2 id="Test-modules-in-Milvus" class="common-anchor-header">Testmodule in Milvus<button data-href="#Test-modules-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Es gibt mehrere Testmodule in Milvus und dieser Abschnitt wird jedes Modul im Detail erklären.</p>
<h3 id="Unit-test" class="common-anchor-header">Einzeltest</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Unit_test_7d3d422345.png" alt="Unit test" class="doc-image" id="unit-test" />
   </span> <span class="img-wrapper"> <span>Einzeltest</span> </span></p>
<p>Unit-Tests können dabei helfen, Softwarefehler in einem frühen Stadium zu identifizieren und ein Prüfkriterium für die Umstrukturierung des Codes zu liefern. Gemäß den Milvus-Pull-Request (PR)-Akzeptanzkriterien sollte der <a href="https://app.codecov.io/gh/milvus-io/milvus/">Abdeckungsgrad</a> von Code-Unit-Tests 80% betragen.</p>
<h3 id="Function-test" class="common-anchor-header">Funktionstest</h3><p>Funktionstests in Milvus sind hauptsächlich um <a href="https://github.com/milvus-io/pymilvus">PyMilvus</a> und SDKs herum organisiert. Der Hauptzweck von Funktionstests besteht darin, zu überprüfen, ob die Schnittstellen wie vorgesehen funktionieren. Funktionstests haben zwei Facetten:</p>
<ul>
<li>Testen, ob SDKs die erwarteten Ergebnisse zurückgeben können, wenn die richtigen Parameter übergeben werden.</li>
<li>Testen, ob SDKs mit Fehlern umgehen können und angemessene Fehlermeldungen zurückgeben, wenn falsche Parameter übergeben werden.</li>
</ul>
<p>Die Abbildung unten zeigt das aktuelle Framework für Funktionstests, das auf dem Mainstream-Framework <a href="https://pytest.org/">pytest</a> basiert. Dieses Framework fügt einen Wrapper zu PyMilvus hinzu und ermöglicht das Testen mit einer automatisierten Testschnittstelle.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Function_test_41f837d3e7.png" alt="Function test" class="doc-image" id="function-test" />
   </span> <span class="img-wrapper"> <span>Funktionstest</span> </span></p>
<p>In Anbetracht der Tatsache, dass eine gemeinsame Testmethode benötigt wird und einige Funktionen wiederverwendet werden müssen, wird das obige Test-Framework übernommen, anstatt die PyMilvus-Schnittstelle direkt zu verwenden. Ein "Check"-Modul ist ebenfalls in das Framework integriert, um die Überprüfung der erwarteten und tatsächlichen Werte zu erleichtern.</p>
<p>Im Verzeichnis <code translate="no">tests/python_client/testcases</code> sind 2.700 Funktionstests enthalten, die fast alle PyMilvus-Schnittstellen vollständig abdecken. Diese Funktionstests überwachen streng die Qualität jedes PR.</p>
<h3 id="Deployment-test" class="common-anchor-header">Einsatztest</h3><p>Milvus gibt es in zwei Modi: <a href="https://milvus.io/docs/v2.0.x/install_standalone-docker.md">Standalone</a> und <a href="https://milvus.io/docs/v2.0.x/install_cluster-docker.md">Cluster</a>. Und es gibt zwei Hauptwege, Milvus einzusetzen: mit Docker Compose oder Helm. Nach der Bereitstellung von Milvus können Benutzer den Milvus-Dienst auch neu starten oder aktualisieren. Es gibt zwei Hauptkategorien von Bereitstellungstests: Neustarttest und Upgrade-Test.</p>
<p>Der Neustarttest bezieht sich auf den Prozess des Testens der Datenpersistenz, d.h. ob die Daten nach einem Neustart noch verfügbar sind. Der Upgrade-Test bezieht sich auf die Prüfung der Datenkompatibilität, um zu verhindern, dass inkompatible Datenformate in Milvus eingefügt werden. Die beiden Arten von Deployment-Tests haben den gleichen Arbeitsablauf, wie in der folgenden Abbildung dargestellt.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deployment_test_342ab3b3f5.png" alt="Deployment test" class="doc-image" id="deployment-test" />
   </span> <span class="img-wrapper"> <span>Bereitstellungstest</span> </span></p>
<p>Bei einem Neustarttest verwenden die beiden Deployments das gleiche Docker-Image. Bei einem Upgrade-Test hingegen verwendet die erste Bereitstellung ein Docker-Image einer früheren Version, während die zweite Bereitstellung ein Docker-Image einer späteren Version verwendet. Die Testergebnisse und Daten werden in der Datei <code translate="no">Volumes</code> oder im <a href="https://kubernetes.io/docs/concepts/storage/persistent-volumes/">Persistent Volume Claim</a> (PVC) gespeichert.</p>
<p>Bei der Durchführung des ersten Tests werden mehrere Sammlungen erstellt und für jede Sammlung werden unterschiedliche Operationen durchgeführt. Beim zweiten Test wird vor allem geprüft, ob die erstellten Sammlungen noch für CRUD-Operationen zur Verfügung stehen und ob neue Sammlungen erstellt werden können.</p>
<h3 id="Reliability-test" class="common-anchor-header">Zuverlässigkeitsüberprüfung</h3><p>Bei Tests zur Zuverlässigkeit von Cloud-nativen verteilten Systemen wird in der Regel eine Chaos-Engineering-Methode angewandt, die darauf abzielt, Fehler und Systemausfälle im Keim zu ersticken. Mit anderen Worten: Bei einem Chaos-Engineering-Test werden gezielt Systemausfälle erzeugt, um Probleme bei Drucktests zu erkennen und Systemausfälle zu beheben, bevor sie wirklich Schaden anrichten. Bei einem Chaostest in Milvus wählen wir <a href="https://chaos-mesh.org/">Chaos Mesh</a> als Werkzeug, um ein Chaos zu erzeugen. Es gibt verschiedene Arten von Ausfällen, die erstellt werden müssen:</p>
<ul>
<li><strong>Pod-Kill</strong>: eine Simulation des Szenarios, bei dem die Knoten ausfallen.</li>
<li><strong>Pod-Ausfall</strong>: Test, ob bei einem Ausfall eines Arbeiterknoten-Pods das gesamte System noch weiterarbeiten kann.</li>
<li><strong>Speicherstress</strong>: eine Simulation des hohen Verbrauchs von Speicher- und CPU-Ressourcen durch die Arbeitsknoten.</li>
<li><strong>Netzwerk-Partition</strong>: Da Milvus <a href="https://milvus.io/docs/v2.0.x/four_layers.md">die Speicherung von der Datenverarbeitung trennt</a>, hängt das System stark von der Kommunikation zwischen den verschiedenen Komponenten ab. Eine Simulation des Szenarios, bei dem die Kommunikation zwischen verschiedenen Pods partitioniert wird, ist erforderlich, um die Abhängigkeit der verschiedenen Milvus-Komponenten voneinander zu testen.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Reliability_test_a7331b91f4.png" alt="Reliability test" class="doc-image" id="reliability-test" />
   </span> <span class="img-wrapper"> <span>Zuverlässigkeitstest</span> </span></p>
<p>Die obige Abbildung zeigt das Framework für Zuverlässigkeitstests in Milvus, mit dem Chaostests automatisiert werden können. Der Arbeitsablauf eines Zuverlässigkeitstests sieht wie folgt aus:</p>
<ol>
<li>Initialisieren eines Milvus-Clusters durch Einlesen der Deployment-Konfigurationen.</li>
<li>Wenn der Cluster bereit ist, führen Sie <code translate="no">test_e2e.py</code> aus, um zu testen, ob die Milvus-Funktionen verfügbar sind.</li>
<li>Führen Sie <code translate="no">hello_milvus.py</code> aus, um die Datenpersistenz zu testen. Erstellen Sie eine Sammlung mit dem Namen "hello_milvus" für Dateneinfügung, Flush, Indexaufbau, Vektorsuche und Abfrage. Diese Sammlung wird während des Tests nicht freigegeben oder gelöscht.</li>
<li>Erstellen Sie ein Überwachungsobjekt, das sechs Threads startet, die die Operationen create, insert, flush, index, search und query ausführen.</li>
</ol>
<pre><code translate="no">checkers = {
    Op.create: CreateChecker(),
    Op.insert: InsertFlushChecker(),
    Op.flush: InsertFlushChecker(flush=<span class="hljs-literal">True</span>),
    Op.index: IndexChecker(),
    Op.search: SearchChecker(),
    Op.query: QueryChecker()
}
<button class="copy-code-btn"></button></code></pre>
<ol start="5">
<li>Machen Sie die erste Behauptung - alle Operationen sind wie erwartet erfolgreich.</li>
<li>Führen Sie einen Systemfehler in Milvus ein, indem Sie Chaos Mesh verwenden, um die yaml-Datei zu parsen, die den Fehler definiert. Ein Fehler kann z.B. das Beenden des Abfrageknotens alle fünf Sekunden sein.</li>
<li>Machen Sie die zweite Behauptung während der Einführung eines Systemfehlers - Beurteilen Sie, ob die zurückgegebenen Ergebnisse der Operationen in Milvus während eines Systemfehlers den Erwartungen entsprechen.</li>
<li>Beseitigen Sie den Ausfall über Chaos Mesh.</li>
<li>Wenn der Milvus-Dienst wiederhergestellt ist (d.h. alle Pods sind bereit), machen Sie die dritte Behauptung - alle Operationen sind wie erwartet erfolgreich.</li>
<li>Führen Sie <code translate="no">test_e2e.py</code> aus, um zu testen, ob die Milvus-Funktionen verfügbar sind. Einige der Operationen während des Chaos könnten aufgrund der dritten Behauptung blockiert sein. Und selbst nachdem das Chaos beseitigt ist, könnten einige Vorgänge weiterhin blockiert sein, was den erwarteten Erfolg der dritten Behauptung behindert. Dieser Schritt soll die dritte Behauptung erleichtern und dient als Standard für die Überprüfung, ob sich der Milvus-Dienst erholt hat.</li>
<li>Führen Sie <code translate="no">hello_milvus.py</code> aus, laden Sie die erstellte Sammlung und führen Sie CRUP-Operationen mit der Sammlung durch. Prüfen Sie dann, ob die Daten, die vor dem Systemausfall vorhanden waren, nach der Wiederherstellung noch verfügbar sind.</li>
<li>Sammeln Sie Protokolle.</li>
</ol>
<h3 id="Stability-and-performance-test" class="common-anchor-header">Stabilitäts- und Leistungstest</h3><p>Die folgende Abbildung beschreibt den Zweck, die Testszenarien und die Metriken des Stabilitäts- und Leistungstests.</p>
<table>
<thead>
<tr><th></th><th>Stabilitätsprüfung</th><th>Leistungstest</th></tr>
</thead>
<tbody>
<tr><td>Zielsetzung</td><td>- Sicherstellen, dass Milvus über einen bestimmten Zeitraum unter normaler Arbeitslast reibungslos funktioniert. <br> - Sicherstellen, dass die Ressourcen beim Starten des Milvus-Dienstes stabil verbraucht werden.</td><td>- Testen Sie die Leistung aller Milvus-Schnittstellen. <br> - Finden Sie die optimale Konfiguration mit Hilfe von Leistungstests.  <br> - Dienen Sie als Benchmark für zukünftige Versionen. <br> - Finden Sie den Engpass, der eine bessere Leistung behindert.</td></tr>
<tr><td>Szenarien</td><td>- Offline-leseintensives Szenario, bei dem die Daten nach dem Einfügen kaum aktualisiert werden und der Prozentsatz der Verarbeitung jeder Anfrageart wie folgt ist: Suchanfrage 90 %, Einfügeanfrage 5 %, andere 5 %. <br> - Online-Szenario mit hoher Schreibintensität, bei dem Daten gleichzeitig eingefügt und gesucht werden und der Prozentsatz der Verarbeitung jeder Anfrageart wie folgt ist: Einfügeanfrage 50%, Suchanfrage 40%, andere 10%.</td><td>- Einfügen von Daten <br> - Indexaufbau <br> - Vektorsuche</td></tr>
<tr><td>Metriken</td><td>- Speicherverbrauch <br> - CPU-Verbrauch <br> - IO-Latenz <br> - Der Status der Milvus-Pods <br> - Antwortzeit des Milvus-Dienstes <br> usw.</td><td>- Datendurchsatz beim Einfügen von Daten <br> - Die Zeit, die für den Aufbau eines Index benötigt wird <br> - Antwortzeit während einer Vektorsuche <br> - Abfrage pro Sekunde (QPS) <br> - Abfrage pro Sekunde  <br> - Abrufrate <br> usw.</td></tr>
</tbody>
</table>
<p>Für Stabilitäts- und Leistungstests gelten die gleichen Arbeitsabläufe:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Stability_and_performance_test_6ed8532697.png" alt="Stability and performance test" class="doc-image" id="stability-and-performance-test" />
   </span> <span class="img-wrapper"> <span>Stabilitäts- und Leistungstest</span> </span></p>
<ol>
<li>Parsen und Aktualisieren von Konfigurationen und Definieren von Metriken. <code translate="no">server-configmap</code> entspricht der Konfiguration von Milvus standalone oder cluster, während <code translate="no">client-configmap</code> den Konfigurationen der Testfälle entspricht.</li>
<li>Konfigurieren Sie den Server und den Client.</li>
<li>Vorbereitung der Daten</li>
<li>Interaktion zwischen dem Server und dem Client anfordern.</li>
<li>Bericht und Anzeige von Metriken.</li>
</ol>
<h2 id="Tools-and-methods-for-better-QA-efficiency" class="common-anchor-header">Werkzeuge und Methoden für eine bessere QA-Effizienz<button data-href="#Tools-and-methods-for-better-QA-efficiency" class="anchor-icon" translate="no">
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
    </button></h2><p>Aus dem Abschnitt über Modultests geht hervor, dass das Verfahren für die meisten Tests nahezu identisch ist und hauptsächlich die Änderung der Milvus-Server- und Client-Konfigurationen sowie die Übergabe von API-Parametern umfasst. Wenn es mehrere Konfigurationen gibt, können diese Experimente und Tests umso mehr Testszenarien abdecken, je vielfältiger die Kombination der verschiedenen Konfigurationen ist. Folglich ist die Wiederverwendung von Codes und Prozeduren umso wichtiger, um die Testeffizienz zu steigern.</p>
<h3 id="SDK-test-framework" class="common-anchor-header">SDK-Test-Framework</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/SDK_test_framework_8219e28f4c.png" alt="SDK test framework" class="doc-image" id="sdk-test-framework" />
   </span> <span class="img-wrapper"> <span>SDK-Test-Framework</span> </span></p>
<p>Um den Testprozess zu beschleunigen, können wir dem ursprünglichen Test-Framework einen <code translate="no">API_request</code> Wrapper hinzufügen und ihn als etwas Ähnliches wie das API-Gateway einrichten. Dieses API-Gateway ist für das Sammeln aller API-Anfragen zuständig und leitet sie dann an Milvus weiter, um Antworten zu erhalten. Diese Antworten werden anschließend an den Client zurückgegeben. Ein solches Design macht das Erfassen bestimmter Protokollinformationen wie Parameter und zurückgegebene Ergebnisse viel einfacher. Darüber hinaus kann die Prüfkomponente im SDK-Testframework die Ergebnisse von Milvus verifizieren und untersuchen. Und alle Prüfmethoden können innerhalb dieser Prüfkomponente definiert werden.</p>
<p>Mit dem SDK-Testframework können einige wichtige Initialisierungsprozesse in eine einzige Funktion verpackt werden. Auf diese Weise können große Teile des mühsamen Codes eliminiert werden.</p>
<p>Bemerkenswert ist auch, dass jeder einzelne Testfall mit einer eigenen Sammlung verknüpft ist, um die Datenisolierung zu gewährleisten.</p>
<p>Bei der Ausführung von Testfällen kann die pytest-Erweiterung<code translate="no">pytest-xdist</code> genutzt werden, um alle einzelnen Testfälle parallel auszuführen, was die Effizienz erheblich steigert.</p>
<h3 id="GitHub-action" class="common-anchor-header">GitHub-Aktion</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Git_Hub_action_c3c1bed591.png" alt="GitHub action" class="doc-image" id="github-action" />
   </span> <span class="img-wrapper"> <span>GitHub-Aktion</span> </span></p>
<p><a href="https://docs.github.com/en/actions">GitHub Action</a> wird ebenfalls zur Verbesserung der QA-Effizienz eingesetzt, und zwar aufgrund seiner folgenden Eigenschaften:</p>
<ul>
<li>Es ist ein natives CI/CD-Tool, das tief mit GitHub integriert ist.</li>
<li>Es verfügt über eine einheitlich konfigurierte Maschinenumgebung und vorinstallierte gängige Softwareentwicklungswerkzeuge wie Docker, Docker Compose usw.</li>
<li>Es unterstützt mehrere Betriebssysteme und Versionen, darunter Ubuntu, MacOs, Windows-Server usw.</li>
<li>Es verfügt über einen Marktplatz, der umfangreiche Erweiterungen und Out-of-Box-Funktionen bietet.</li>
<li>Seine Matrix unterstützt gleichzeitige Aufträge und die Wiederverwendung desselben Testablaufs zur Steigerung der Effizienz.</li>
</ul>
<p>Abgesehen von den oben genannten Eigenschaften ist ein weiterer Grund für den Einsatz von GitHub Action, dass Deployment-Tests und Zuverlässigkeitstests eine unabhängige und isolierte Umgebung erfordern. Und GitHub Action ist ideal für tägliche Inspektionstests auf kleinen Datensätzen.</p>
<h3 id="Tools-for-benchmark-tests" class="common-anchor-header">Tools für Benchmark-Tests</h3><p>Um QA-Tests effizienter zu gestalten, wird eine Reihe von Tools eingesetzt.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_13_fbc71dfe4f.png" alt="QA tools" class="doc-image" id="qa-tools" />
   </span> <span class="img-wrapper"> <span>QA-Werkzeuge</span> </span></p>
<ul>
<li><a href="https://argoproj.github.io/">Argo</a>: eine Reihe von Open-Source-Tools für Kubernetes zur Ausführung von Workflows und zur Verwaltung von Clustern durch die Planung von Aufgaben. Es kann auch die parallele Ausführung mehrerer Aufgaben ermöglichen.</li>
<li><a href="https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/">Kubernetes-Dashboard</a>: eine webbasierte Kubernetes-Benutzeroberfläche zur Visualisierung von <code translate="no">server-configmap</code> und <code translate="no">client-configmap</code>.</li>
<li><a href="https://en.wikipedia.org/wiki/Network-attached_storage">NAS</a>: Network Attached Storage (NAS) ist ein Computer-Datenspeicher auf Dateiebene zur Aufbewahrung gängiger ANN-Benchmark-Datensätze.</li>
<li><a href="https://www.influxdata.com/">InfluxDB</a> und <a href="https://www.mongodb.com/">MongoDB</a>: Datenbanken zur Speicherung der Ergebnisse von Benchmark-Tests.</li>
<li><a href="https://grafana.com/">Grafana</a>: Eine Open-Source-Analyse- und Überwachungslösung zur Überwachung von Server-Ressourcenmetriken und Client-Leistungsmetriken.</li>
<li><a href="https://redash.io/">Redash</a>: Ein Dienst, der bei der Visualisierung Ihrer Daten und der Erstellung von Diagrammen für Benchmark-Tests hilft.</li>
</ul>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">Über die Deep Dive-Serie<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>Mit der <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">offiziellen Ankündigung der allgemeinen Verfügbarkeit</a> von Milvus 2.0 haben wir diese Milvus-Deep-Dive-Blogserie ins Leben gerufen, um eine tiefgehende Interpretation der Milvus-Architektur und des Quellcodes zu bieten. Die Themen dieser Blogserie umfassen:</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Überblick über die Milvus-Architektur</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">APIs und Python-SDKs</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Datenverarbeitung</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Datenverwaltung</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">Abfrage in Echtzeit</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">Skalare Ausführungsmaschine</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">QA-System</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">Vektorielles Ausführungssystem</a></li>
</ul>
