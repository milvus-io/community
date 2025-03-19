---
id: why-manual-sharding-is-a-bad-idea-for-vector-databases-and-how-to-fix-it.md
title: >-
  Warum manuelles Sharding eine schlechte Idee für Vektordatenbanken ist und wie
  man es beheben kann
author: James Luan
date: 2025-03-18T00:00:00.000Z
desc: >-
  Erfahren Sie, warum das manuelle Sharding von Vektordatenbanken zu Engpässen
  führt und wie die automatische Skalierung von Milvus den technischen Overhead
  für ein nahtloses Wachstum eliminiert.
cover: >-
  assets.zilliz.com/Why_Manual_Sharding_is_a_Bad_Idea_for_Vector_Database_And_How_to_Fix_It_300b84a4d9.png
tag: Engineering
tags: 'Milvus, Vector Database, Milvus, AI Infrastructure, Automated Sharding'
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/why-manual-sharding-is-a-bad-idea-for-vector-databases-and-how-to-fix-it.md
---
<p>"<em>Wir haben unsere semantische Suche zunächst auf pgvector statt auf Milvus aufgebaut, weil alle unsere relationalen Daten bereits in PostgreSQL waren",</em> erinnert sich Alex, CTO eines SaaS-Startups für Unternehmens-KI. <em>"Aber sobald wir den Product-Market-Fit erreicht hatten, stieß unser Wachstum auf ernsthafte Hürden auf der technischen Seite. Es wurde schnell klar, dass pgvector nicht für Skalierbarkeit ausgelegt war. Einfache Aufgaben wie das Ausrollen von Schema-Updates über mehrere Shards hinweg wurden zu langwierigen, fehleranfälligen Prozessen, die tagelange Entwicklungsarbeit erforderten. Als wir 100 Millionen Vektoreinbettungen erreichten, stieg die Abfragelatenz auf über eine Sekunde an, was weit über das hinausging, was unsere Kunden tolerieren würden. Nach der Umstellung auf Milvus fühlte sich das manuelle Sharding wie ein Schritt in die Steinzeit an. Es macht keinen Spaß, mit Shard-Servern zu jonglieren, als wären sie zerbrechliche Artefakte. Kein Unternehmen sollte das ertragen müssen."</em></p>
<h2 id="A-Common-Challenge-for-AI-Companies" class="common-anchor-header">Eine häufige Herausforderung für KI-Unternehmen<button data-href="#A-Common-Challenge-for-AI-Companies" class="anchor-icon" translate="no">
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
    </button></h2><p>Alex' Erfahrung ist kein Einzelfall für pgvector-Nutzer. Unabhängig davon, ob Sie pgvector, Qdrant, Weaviate oder eine andere Vektordatenbank verwenden, die auf manuellem Sharding beruht, bleiben die Herausforderungen bei der Skalierung dieselben. Was als überschaubare Lösung beginnt, wird mit wachsendem Datenvolumen schnell zu einer technischen Schuld.</p>
<p>Für Startups <strong>ist Skalierbarkeit</strong> heute <strong>nicht</strong> mehr <strong>optional, sondern geschäftskritisch</strong>. Dies gilt insbesondere für KI-Produkte, die auf Large Language Models (LLM) und Vektordatenbanken basieren, bei denen der Sprung von der frühen Akzeptanz zum exponentiellen Wachstum über Nacht erfolgen kann. Die Anpassung des Produkts an den Markt führt oft zu einem sprunghaften Anstieg der Nutzerzahlen, einem überwältigenden Datenaufkommen und einem sprunghaften Anstieg der Abfrageanforderungen. Wenn jedoch die Datenbankinfrastruktur nicht mithalten kann, können langsame Abfragen und betriebliche Ineffizienzen den Schwung bremsen und den Geschäftserfolg behindern.</p>
<p>Eine kurzfristige technische Entscheidung kann zu einem langfristigen Engpass führen und die Technikteams dazu zwingen, sich ständig mit dringenden Leistungsproblemen, Datenbankabstürzen und Systemausfällen zu befassen, anstatt sich auf Innovationen zu konzentrieren. Das Worst-Case-Szenario? Eine kostspielige, zeitaufwändige Neuarchitektur der Datenbank - genau dann, wenn ein Unternehmen skalieren sollte.</p>
<h2 id="Isn’t-Sharding-a-Natural-Solution-to-Scalability" class="common-anchor-header">Ist Sharding nicht eine natürliche Lösung für die Skalierbarkeit?<button data-href="#Isn’t-Sharding-a-Natural-Solution-to-Scalability" class="anchor-icon" translate="no">
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
    </button></h2><p>Skalierbarkeit kann auf verschiedene Weise angegangen werden. Der einfachste Ansatz, <strong>Scaling Up</strong>, besteht darin, die Ressourcen eines einzelnen Rechners durch Hinzufügen von mehr CPU, Arbeitsspeicher oder Speicherplatz zu erweitern, um das wachsende Datenvolumen zu bewältigen. Diese Methode ist zwar einfach, hat aber klare Grenzen. In einer Kubernetes-Umgebung sind beispielsweise große Pods ineffizient, und die Abhängigkeit von einem einzelnen Knoten erhöht das Ausfallrisiko, was zu erheblichen Ausfallzeiten führen kann.</p>
<p>Wenn Scaling Up nicht mehr praktikabel ist, wenden sich Unternehmen natürlich <strong>Scaling Out</strong> zu, also der Verteilung von Daten auf mehrere Server. Auf den ersten Blick scheint <strong>Sharding</strong> eine einfache Lösung zu sein - die Aufteilung einer Datenbank in kleinere, unabhängige Datenbanken, um die Kapazität zu erhöhen und mehrere beschreibbare Primärknoten zu ermöglichen.</p>
<p>Doch obwohl das Konzept einfach ist, wird Sharding in der Praxis schnell zu einer komplexen Herausforderung. Die meisten Anwendungen sind ursprünglich für die Arbeit mit einer einzigen, einheitlichen Datenbank konzipiert. In dem Moment, in dem eine Vektordatenbank in mehrere Shards aufgeteilt wird, muss jeder Teil der Anwendung, der mit den Daten interagiert, geändert oder komplett neu geschrieben werden, was einen erheblichen Entwicklungsaufwand bedeutet. Die Entwicklung einer effektiven Sharding-Strategie ist von entscheidender Bedeutung, ebenso wie die Implementierung einer Routing-Logik, die sicherstellt, dass die Daten zum richtigen Shard geleitet werden. Die Verwaltung atomarer Transaktionen über mehrere Shards hinweg erfordert häufig eine Umstrukturierung der Anwendungen, um Shard-übergreifende Operationen zu vermeiden. Darüber hinaus müssen Ausfallszenarien elegant gehandhabt werden, um Unterbrechungen zu vermeiden, wenn bestimmte Shards nicht mehr verfügbar sind.</p>
<h2 id="Why-Manual-Sharding-Becomes-a-Burden" class="common-anchor-header">Warum manuelles Sharding zu einer Belastung wird<button data-href="#Why-Manual-Sharding-Becomes-a-Burden" class="anchor-icon" translate="no">
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
    </button></h2><p>&quot;<em>Ursprünglich schätzten wir, dass die Implementierung von manuellem Sharding für unsere pgvector-Datenbank zwei Techniker etwa sechs Monate in Anspruch nehmen würde&quot;,</em> erinnert sich Alex, <em>&quot;was wir nicht wussten, war, dass diese Techniker</em> <strong><em>immer</em></strong> <em>gebraucht werden</em> <em> würden</em> <em>. Jede Schemaänderung, jeder Datenabgleich und jede Skalierungsentscheidung erforderte ihr Fachwissen. Im Grunde genommen verpflichteten wir uns zu einem ständigen 'Sharding-Team', nur um unsere Datenbank am Laufen zu halten.&quot;</em></p>
<p>Zu den realen Herausforderungen bei Sharded-Vektor-Datenbanken gehören:</p>
<ol>
<li><p><strong>Unausgewogene Datenverteilung (Hotspots)</strong>: In Anwendungsfällen mit mehreren Mandanten kann die Datenverteilung von Hunderten bis Milliarden von Vektoren pro Mandant reichen. Dieses Ungleichgewicht führt zu Hotspots, in denen bestimmte Shards überlastet werden, während andere untätig bleiben.</p></li>
<li><p><strong>Das Resharding bereitet Kopfschmerzen</strong>: Die Wahl der richtigen Anzahl von Shards ist nahezu unmöglich. Zu wenige führen zu häufigen und kostspieligen Resharding-Vorgängen. Eine zu hohe Anzahl führt zu unnötigem Overhead bei den Metadaten, was die Komplexität erhöht und die Leistung verringert.</p></li>
<li><p><strong>Komplexität von Schemaänderungen</strong>: Viele Vektordatenbanken implementieren Sharding durch die Verwaltung mehrerer zugrunde liegender Datenbanken. Dies macht die Synchronisierung von Schemaänderungen zwischen den Shards umständlich und fehleranfällig und verlangsamt die Entwicklungszyklen.</p></li>
<li><p><strong>Ressourcenverschwendung</strong>: Bei Datenbanken mit gekoppeltem Speicher und Rechenleistung müssen Sie die Ressourcen auf jedem Knoten sorgfältig zuweisen und gleichzeitig zukünftiges Wachstum vorhersehen. Wenn die Ressourcenauslastung 60-70 % erreicht, müssen Sie in der Regel mit der Planung für ein Resharding beginnen.</p></li>
</ol>
<p>Einfach ausgedrückt, <strong>ist die manuelle Verwaltung von Shards schlecht für Ihr Unternehmen</strong>. Anstatt Ihr technisches Team an die ständige Verwaltung von Shards zu binden, sollten Sie in eine Vektordatenbank investieren, die für eine automatische Skalierung ausgelegt ist, ohne dass der Betrieb darunter leidet.</p>
<h2 id="How-Milvus-Solves-the-Scalability-Problem" class="common-anchor-header">Wie Milvus das Problem der Skalierbarkeit löst<button data-href="#How-Milvus-Solves-the-Scalability-Problem" class="anchor-icon" translate="no">
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
    </button></h2><p>Viele Entwickler - von Startups bis hin zu Unternehmen - haben den erheblichen Aufwand erkannt, der mit dem manuellen Sharding von Datenbanken verbunden ist. Milvus verfolgt einen grundlegend anderen Ansatz und ermöglicht eine nahtlose Skalierung von Millionen bis Milliarden von Vektoren, ohne die Komplexität.</p>
<h3 id="Automated-Scaling-Without-the-Engineering-Tax" class="common-anchor-header">Automatisierte Skalierung ohne Engineering-Aufwand</h3><p>Milvus nutzt Kubernetes und eine disaggregierte Storage-Compute-Architektur zur Unterstützung einer nahtlosen Erweiterung. Dieses Design ermöglicht:</p>
<ul>
<li><p>Schnelle Skalierung als Reaktion auf wechselnde Anforderungen</p></li>
<li><p>Automatischer Lastausgleich über alle verfügbaren Knoten</p></li>
<li><p>Unabhängige Ressourcenzuweisung, sodass Sie Rechenleistung, Arbeitsspeicher und Speicher separat anpassen können</p></li>
<li><p>Gleichbleibend hohe Leistung, auch in Phasen schnellen Wachstums</p></li>
</ul>
<h3 id="How-Milvus-Scales-The-Technical-Foundation" class="common-anchor-header">Wie Milvus skaliert: Die technische Grundlage</h3><p>Milvus erreicht seine Skalierungsfähigkeiten durch zwei Schlüsselinnovationen:</p>
<p><strong>Segment-basierte Architektur:</strong> Im Kern organisiert Milvus die Daten in &quot;Segmenten&quot; - den kleinsten Einheiten der Datenverwaltung:</p>
<ul>
<li><p>Wachsende Segmente befinden sich auf StreamNodes, wodurch die Datenfrische für Echtzeitabfragen optimiert wird.</p></li>
<li><p>Versiegelte Segmente werden von QueryNodes verwaltet, die leistungsstarke Indizes zur Beschleunigung der Suche nutzen.</p></li>
<li><p>Diese Segmente werden gleichmäßig auf die Knoten verteilt, um die parallele Verarbeitung zu optimieren.</p></li>
</ul>
<p><strong>Zwei-Schicht-Routing</strong>: Im Gegensatz zu herkömmlichen Datenbanken, bei denen jeder Shard auf einem einzigen Rechner liegt, verteilt Milvus die Daten in einem Shard dynamisch auf mehrere Knoten:</p>
<ul>
<li><p>Jeder Shard kann über 1 Milliarde Datenpunkte speichern</p></li>
<li><p>Segmente innerhalb jedes Shards werden automatisch auf die verschiedenen Rechner verteilt</p></li>
<li><p>Das Erweitern von Sammlungen ist so einfach wie das Erhöhen der Anzahl der Shards</p></li>
<li><p>Das kommende Milvus 3.0 wird eine dynamische Aufteilung von Shards einführen, wodurch selbst dieser minimale manuelle Schritt entfällt.</p></li>
</ul>
<h3 id="Query-Processing-at-Scale" class="common-anchor-header">Anfragebearbeitung in großem Maßstab</h3><p>Bei der Ausführung einer Abfrage folgt Milvus einem effizienten Prozess:</p>
<ol>
<li><p>Der Proxy identifiziert relevante Shards für die angeforderte Sammlung</p></li>
<li><p>Der Proxy sammelt Daten sowohl von StreamNodes als auch von QueryNodes</p></li>
<li><p>StreamNodes verarbeiten Echtzeitdaten, während QueryNodes gleichzeitig historische Daten verarbeiten</p></li>
<li><p>Die Ergebnisse werden aggregiert und an den Benutzer zurückgegeben</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Query_Processing_at_Scale_5792dc9e37.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="A-Different-Engineering-Experience" class="common-anchor-header">Eine andere technische Erfahrung<button data-href="#A-Different-Engineering-Experience" class="anchor-icon" translate="no">
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
    </button></h2><p>"<em>Wenn die Skalierbarkeit in die Datenbank selbst eingebaut ist, verschwinden all diese Kopfschmerzen einfach",</em> sagt Alex über den Wechsel seines Teams zu Milvus. <em>"Meine Ingenieure sind wieder damit beschäftigt, Funktionen zu entwickeln, die die Kunden lieben, anstatt sich um Datenbank-Splitter zu kümmern."</em></p>
<p>Wenn Sie mit der technischen Belastung durch manuelles Sharding, mit Leistungsengpässen bei der Skalierung oder mit der entmutigenden Aussicht auf Datenbankmigrationen zu kämpfen haben, ist es an der Zeit, Ihren Ansatz zu überdenken. Besuchen Sie unsere <a href="https://milvus.io/docs/overview.md#What-Makes-Milvus-so-Scalable">Dokumentseite</a>, um mehr über die Milvus-Architektur zu erfahren, oder erleben Sie mühelose Skalierbarkeit aus erster Hand mit vollständig verwaltetem Milvus unter <a href="https://zilliz.com/cloud">zilliz.com/cloud</a>.</p>
<p>Mit der richtigen Vektordatenbank als Grundlage sind Ihrer Innovation keine Grenzen gesetzt.</p>
