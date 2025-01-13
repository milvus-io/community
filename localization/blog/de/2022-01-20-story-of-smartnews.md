---
id: 2022-01-20-story-of-smartnews.md
title: >-
  Die Geschichte von SmartNews - von einem Milvus-Benutzer zu einem aktiven
  Mitwirkenden
author: Milvus
date: 2022-01-20T00:00:00.000Z
desc: >-
  Erfahren Sie mehr über die Geschichte von SmartNews, einem Milvus-Benutzer und
  -Beitragszahler.
cover: assets.zilliz.com/Smartnews_user_to_contributor_f219e6e008.png
tag: Scenarios
---
<p>Dieser Artikel wurde von <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a> übersetzt.</p>
<p>Informationen sind in unserem Leben allgegenwärtig. Meta (früher bekannt als Facebook), Instagram, Twitter und andere Social-Media-Plattformen machen Informationsströme noch allgegenwärtiger. Daher sind Engines, die mit solchen Informationsströmen umgehen können, ein Muss in den meisten Systemarchitekturen geworden. Als Nutzer von Social-Media-Plattformen und entsprechenden Anwendungen haben Sie sich jedoch bestimmt schon einmal über doppelte Artikel, Nachrichten, Memes und mehr geärgert. Doppelte Inhalte erschweren den Prozess der Informationsgewinnung und führen zu einer schlechten Benutzererfahrung.</p>
<p>Für ein Produkt, das sich mit Informationsströmen befasst, ist es für die Entwickler von hoher Priorität, einen flexiblen Datenprozessor zu finden, der sich nahtlos in die Systemarchitektur integrieren lässt, um identische Nachrichten oder Anzeigen zu deduplizieren.</p>
<p><a href="https://www.smartnews.com/en/">SmartNews</a>, das mit <a href="https://techcrunch.com/2021/09/15/news-aggregator-smartnews-raises-230-million-valuing-its-business-at-2-billion/">2 Milliarden US-Dollar</a> bewertet wird, ist das am höchsten bewertete Nachrichten-App-Unternehmen in den USA. Bemerkenswert ist, dass das Unternehmen früher Nutzer von Milvus, einer Open-Source-Vektordatenbank, war, später aber zu einem aktiven Mitwirkenden am Milvus-Projekt wurde.</p>
<p>Dieser Artikel erzählt die Geschichte von SmartNews und erklärt, warum das Unternehmen beschlossen hat, Beiträge zum Milvus-Projekt zu leisten.</p>
<h2 id="An-overview-of-SmartNews" class="common-anchor-header">Ein Überblick über SmartNews<button data-href="#An-overview-of-SmartNews" class="anchor-icon" translate="no">
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
    </button></h2><p>SmartNews wurde 2012 gegründet und hat seinen Hauptsitz in Tokio, Japan. Die von SmartNews entwickelte Nachrichten-App hat auf dem japanischen Markt stets die <a href="https://www.businessinsider.com/guides/smartnews-free-news-app-2018-9">besten Bewertungen</a> erhalten. SmartNews ist die <a href="https://about.smartnews.com/en/2019/06/12/smartnews-builds-global-momentum-with-over-500-us-growth-new-executives-and-three-new-offices/">am schnellsten wachsende</a> Nachrichten-App und weist auch auf dem US-Markt eine <a href="https://about.smartnews.com/en/2018/07/21/smartnews-reaches-more-than-10-million-monthly-active-users-in-the-united-states-and-japan/">hohe Nutzerviskosität</a> auf. Laut den Statistiken von <a href="https://www.appannie.com/en/">APP Annie</a> lag die durchschnittliche monatliche Sitzungsdauer von SmartNews Ende Juli 2021 an erster Stelle aller Nachrichten-Apps und übertraf die kumulierte Sitzungsdauer von AppleNews und Google News.</p>
<p>Mit dem schnellen Wachstum der Nutzerbasis und der Viskosität muss sich SmartNews weiteren Herausforderungen in Bezug auf den Empfehlungsmechanismus und den KI-Algorithmus stellen. Zu diesen Herausforderungen gehören die Nutzung massiver diskreter Merkmale im groß angelegten maschinellen Lernen (ML), die Beschleunigung unstrukturierter Datenabfragen mit vektorieller Ähnlichkeitssuche und vieles mehr.</p>
<p>Anfang 2021 wandte sich das Team für dynamische Anzeigenalgorithmen bei SmartNews an das KI-Infrastrukturteam mit der Bitte, die Funktionen zum Abrufen und Abfragen von Anzeigen zu optimieren. Nach zweimonatiger Recherche entschied sich der KI-Infrastrukturingenieur Shu für Milvus, eine Open-Source-Vektordatenbank, die mehrere Indizes und Ähnlichkeitsmetriken sowie Online-Datenaktualisierungen unterstützt. Mehr als tausend Organisationen weltweit vertrauen auf Milvus.</p>
<h2 id="Advertisement-recommendation-powered-by-vector-similarity-search" class="common-anchor-header">Anzeigenempfehlung durch Vektorähnlichkeitssuche<button data-href="#Advertisement-recommendation-powered-by-vector-similarity-search" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Open-Source-Vektordatenbank Milvus wird im SmartNews-Anzeigensystem eingesetzt, um dynamische Anzeigen aus einem 10-Millionen-Datensatz abzugleichen und den Nutzern zu empfehlen. Auf diese Weise kann SmartNews eine Mapping-Beziehung zwischen zwei bisher nicht zueinander passenden Datensätzen - Nutzerdaten und Anzeigendaten - herstellen. Im zweiten Quartal 2021 gelang es Shu, Milvus 1.0 auf Kubernetes bereitzustellen. Erfahren Sie mehr darüber, wie Sie <a href="https://milvus.io/docs">Milvus bereitstellen</a> können.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image1_2a88ed162f.png" alt="img" class="doc-image" id="img" />
   </span> <span class="img-wrapper"> <span>img</span> </span></p>
<p>Nach der erfolgreichen Bereitstellung von Milvus 1.0 war das erste Projekt, bei dem Milvus zum Einsatz kam, das vom Ad-Team bei SmartNews initiierte Anzeigenrückrufprojekt. In der Anfangsphase war der Anzeigendatensatz eine Million groß. Gleichzeitig wurde die P99-Latenzzeit auf weniger als 10 Millisekunden genau kontrolliert.</p>
<p>Im Juni 2021 wandten Shu und seine Kollegen im Algorithmusteam Milvus auf weitere Geschäftsszenarien an und versuchten, Daten zu aggregieren und Online-Daten/Indizes in Echtzeit zu aktualisieren.</p>
<p>Inzwischen wurde Milvus, die Open-Source-Vektordatenbank, in verschiedenen Geschäftsszenarien bei SmartNews eingesetzt, darunter auch bei der Anzeigenempfehlung.</p>
<h2 id="From-a-user-to-an-active-contributor" class="common-anchor-header"><strong>Vom Nutzer zum aktiven Mitgestalter</strong><button data-href="#From-a-user-to-an-active-contributor" class="anchor-icon" translate="no">
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
    </button></h2><p>Während der Integration von Milvus in die Smartnews-Produktarchitektur kamen Shu und andere Entwickler mit Anfragen zu Funktionen wie Hot Reload, Artikel-TTL (Time-to-Live), Artikel-Update/Ersatz und mehr. Dies sind auch Funktionen, die von vielen Benutzern in der Milvus-Community gewünscht werden. Daher beschloss Dennis Zhao, Leiter des KI-Infrastrukturteams bei SmartNews, die Hot-Reload-Funktion zu entwickeln und der Community zur Verfügung zu stellen. Dennis meinte: "Das SmartNews-Team hat von der Milvus-Community profitiert, daher sind wir mehr als bereit, einen Beitrag zu leisten, wenn wir etwas mit der Community zu teilen haben."</p>
<p>Data Reload unterstützt die Code-Bearbeitung während der Ausführung des Codes. Mit Hilfe von Data Reload müssen Entwickler nicht mehr an einem Haltepunkt anhalten oder die Anwendung neu starten. Stattdessen können sie den Code direkt bearbeiten und das Ergebnis in Echtzeit sehen.</p>
<p>Ende Juli schlug Yusup, Ingenieur bei SmartNews, eine Idee zur Verwendung von <a href="https://milvus.io/docs/v2.0.x/collection_alias.md#Collection-Alias">Collection Alias</a> vor, um Hot Reload zu erreichen.</p>
<p>Das Erstellen von Sammlungsalias bezieht sich auf die Angabe von Aliasnamen für eine Sammlung. Eine Sammlung kann mehrere Aliasnamen haben. Ein Alias entspricht jedoch maximal einer Sammlung. Ziehen Sie einfach eine Analogie zwischen einer Sammlung und einem Schließfach. Ein Schließfach hat wie eine Sammlung seine eigene Nummer und Position, die immer unverändert bleibt. Sie können jedoch immer verschiedene Dinge in das Schließfach legen und aus ihm entnehmen. Ähnlich ist der Name der Sammlung fest, aber die Daten in der Sammlung sind dynamisch. Sie können jederzeit Vektoren in eine Sammlung einfügen oder löschen, da das Löschen von Daten in der <a href="https://milvus.io/docs/v2.0.x/release_notes.md#v200-PreGA">Milvus-Vorversion</a> unterstützt wird.</p>
<p>Im Falle des SmartNews-Anzeigengeschäfts werden fast 100 Millionen Vektoren eingefügt oder aktualisiert, wenn neue dynamische Anzeigenvektoren erzeugt werden. Hierfür gibt es mehrere Lösungen:</p>
<ul>
<li>Lösung 1: Löschen Sie zuerst die alten Daten und fügen Sie dann die neuen ein.</li>
<li>Lösung 2: Erstellen Sie eine neue Sammlung für neue Daten.</li>
<li>Lösung 3: Sammlungs-Alias verwenden.</li>
</ul>
<p>Bei Lösung 1 besteht einer der größten Nachteile darin, dass sie extrem zeitaufwändig ist, vor allem, wenn der zu aktualisierende Datenbestand riesig ist. In der Regel dauert es Stunden, einen Datensatz mit einer Größe von 100 Millionen zu aktualisieren.</p>
<p>Bei Lösung 2 besteht das Problem darin, dass die neue Sammlung nicht sofort für die Suche verfügbar ist. Das heißt, dass eine Sammlung während des Ladens nicht durchsuchbar ist. Außerdem erlaubt Milvus nicht, dass zwei Sammlungen denselben Sammlungsnamen verwenden. Der Wechsel zu einer neuen Sammlung würde immer eine manuelle Änderung des clientseitigen Codes erfordern. Das heißt, dass die Benutzer den Wert des Parameters <code translate="no">collection_name</code> jedes Mal ändern müssen, wenn sie zwischen Sammlungen wechseln wollen.</p>
<p>Lösung 3 wäre die Lösung schlechthin. Sie müssen lediglich die neuen Daten in eine neue Sammlung einfügen und einen Sammlungsalias verwenden. Auf diese Weise müssen Sie nur den Auflistungsalias jedes Mal austauschen, wenn Sie die Auflistung wechseln müssen, um die Suche durchzuführen. Sie brauchen den Code nicht extra zu überarbeiten. Diese Lösung erspart Ihnen die in den beiden vorhergehenden Lösungen erwähnten Probleme.</p>
<p>Yusup ging von dieser Anfrage aus und half dem gesamten SmartNews-Team, die Milvus-Architektur zu verstehen. Nach eineinhalb Monaten erhielt das Milvus-Projekt von Yusup eine PR über Hot Reload. Später wurde diese Funktion zusammen mit der Veröffentlichung von Milvus 2.0.0-RC7 offiziell verfügbar.</p>
<p>Derzeit übernimmt das AI-Infrastrukturteam die Führung bei der Bereitstellung von Milvus 2.0 und der schrittweisen Migration aller Daten von Milvus 1.0 auf 2.0.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image2_96c064a627.png" alt="img_collection alias" class="doc-image" id="img_collection-alias" />
   </span> <span class="img-wrapper"> <span>img_collection alias</span> </span></p>
<p>Die Unterstützung von Sammlungsalias kann die Nutzererfahrung erheblich verbessern, insbesondere für große Internetunternehmen mit einer großen Anzahl von Nutzeranfragen. Chenglong Li, Dateningenieur aus der Milvus-Gemeinschaft, der die Brücke zwischen Milvus und Smartnews geschlagen hat, sagte: "Die Funktion der Sammelalias ist aus einer echten Geschäftsanfrage von SmartNews, einem Milvus-Benutzer, entstanden. Und SmartNews hat der Milvus-Gemeinschaft den Code zur Verfügung gestellt. Dieser Akt der Gegenseitigkeit ist ein großartiges Beispiel für den Open-Source-Geist: von der Gemeinschaft und für die Gemeinschaft. Wir hoffen, dass wir noch mehr Mitwirkende wie SmartNews finden und gemeinsam eine florierende Milvus-Community aufbauen können."</p>
<p>"Derzeit setzt ein Teil des Anzeigengeschäfts Milvus als Offline-Vektordatenbank ein. Die offizielle Veröffentlichung von Mivus 2.0 rückt näher, und wir hoffen, dass wir Milvus nutzen können, um zuverlässigere Systeme zu bauen und Echtzeitdienste für mehr Geschäftsszenarien anzubieten", so Dennis.</p>
<blockquote>
<p>Update: Milvus 2.0 ist jetzt allgemein verfügbar! <a href="/blog/de/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">Erfahren Sie mehr</a></p>
</blockquote>
