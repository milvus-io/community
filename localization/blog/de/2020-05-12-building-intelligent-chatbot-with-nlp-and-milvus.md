---
id: building-intelligent-chatbot-with-nlp-and-milvus.md
title: Allgemeine Architektur
author: milvus
date: 2020-05-12T22:33:34.726Z
desc: Der QA-Bot der nächsten Generation ist da
cover: assets.zilliz.com/header_ce3a0e103d.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/building-intelligent-chatbot-with-nlp-and-milvus'
---
<custom-h1>Aufbau eines intelligenten QA-Systems mit NLP und Milvus</custom-h1><p>Milvus-Projekt：github.com/milvus-io/milvus</p>
<p>Das System zur Beantwortung von Fragen wird häufig im Bereich der Verarbeitung natürlicher Sprache eingesetzt. Es wird zur Beantwortung von Fragen in Form von natürlicher Sprache verwendet und hat eine breite Palette von Anwendungen. Typische Anwendungen sind: intelligente Sprachinteraktion, Online-Kundendienst, Wissenserwerb, personalisierter emotionaler Chat und vieles mehr. Die meisten Fragebeantwortungssysteme lassen sich in generative und Retrieval-Fragebeantwortungssysteme, Ein-Runden-Fragebeantwortungssysteme und Mehr-Runden-Fragebeantwortungssysteme, offene Fragebeantwortungssysteme und spezifische Fragebeantwortungssysteme einteilen.</p>
<p>Dieser Artikel befasst sich hauptsächlich mit einem QS-System, das für einen bestimmten Bereich entwickelt wurde, der gewöhnlich als intelligenter Kundendienstroboter bezeichnet wird. In der Vergangenheit erforderte der Aufbau eines Kundendienstroboters in der Regel die Umwandlung des Domänenwissens in eine Reihe von Regeln und Wissensgraphen. Der Konstruktionsprozess stützt sich stark auf "menschliche" Intelligenz. Mit der Anwendung von Deep Learning in der Verarbeitung natürlicher Sprache (NLP) kann maschinelles Lesen automatisch Antworten auf passende Fragen direkt aus Dokumenten finden. Das Deep-Learning-Sprachmodell wandelt die Fragen und Dokumente in semantische Vektoren um, um die passende Antwort zu finden.</p>
<p>Dieser Artikel verwendet das Open-Source-Modell BERT von Google und Milvus, eine Open-Source-Vektorsuchmaschine, um schnell einen auf semantischem Verständnis basierenden Q&amp;A-Bot zu erstellen.</p>
<h2 id="Overall-Architecture" class="common-anchor-header">Allgemeine Architektur<button data-href="#Overall-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>Dieser Artikel implementiert ein System zur Beantwortung von Fragen durch semantischen Ähnlichkeitsabgleich. Der allgemeine Konstruktionsprozess sieht wie folgt aus:</p>
<ol>
<li>Sammeln Sie eine große Anzahl von Fragen mit Antworten in einem bestimmten Bereich (ein Standardfragensatz).</li>
<li>Verwenden Sie das BERT-Modell, um diese Fragen in Merkmalsvektoren umzuwandeln und sie in Milvus zu speichern. Gleichzeitig weist Milvus jedem Merkmalsvektor eine Vektor-ID zu.</li>
<li>Speichern Sie diese repräsentativen Frage-IDs und ihre entsprechenden Antworten in PostgreSQL.</li>
</ol>
<p>Wenn ein Benutzer eine Frage stellt:</p>
<ol>
<li>Das BERT-Modell wandelt sie in einen Merkmalsvektor um.</li>
<li>Milvus führt eine Ähnlichkeitssuche durch und findet die ID, die der Frage am ähnlichsten ist.</li>
<li>PostgreSQL gibt die entsprechende Antwort zurück.</li>
</ol>
<p>Das Diagramm der Systemarchitektur sieht wie folgt aus (die blauen Linien stellen den Importprozess und die gelben Linien den Abfrageprozess dar):</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_system_architecture_milvus_bert_postgresql_63de466754.png" alt="1-system-architecture-milvus-bert-postgresql.png" class="doc-image" id="1-system-architecture-milvus-bert-postgresql.png" />
   </span> <span class="img-wrapper"> <span>1-system-architecture-milvus-bert-postgresql.png</span> </span></p>
<p>Als Nächstes werden wir Ihnen zeigen, wie Sie ein Online-Q&amp;A-System Schritt für Schritt aufbauen können.</p>
<h2 id="Steps-to-Build-the-QA-System" class="common-anchor-header">Schritte zum Aufbau des Q&amp;A-Systems<button data-href="#Steps-to-Build-the-QA-System" class="anchor-icon" translate="no">
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
    </button></h2><p>Bevor Sie beginnen, müssen Sie Milvus und PostgreSQL installieren. Die genauen Installationsschritte finden Sie auf der offiziellen Website von Milvus.</p>
<h3 id="1-Data-preparation" class="common-anchor-header">1. Vorbereitung der Daten</h3><p>Die experimentellen Daten in diesem Artikel stammen von: https://github.com/chatopera/insuranceqa-corpus-zh</p>
<p>Der Datensatz enthält Frage- und Antwortdatenpaare aus der Versicherungsbranche. In diesem Artikel werden 20.000 Frage-Antwort-Paare aus dem Datensatz extrahiert. Mithilfe dieses Frage- und Antwortdatensatzes können Sie schnell einen Kundendienstroboter für die Versicherungsbranche erstellen.</p>
<h3 id="2-Generate-feature-vectors" class="common-anchor-header">2. Erzeugen von Merkmalsvektoren</h3><p>Dieses System verwendet ein Modell, das vom BERT vortrainiert wurde. Laden Sie es unter folgendem Link herunter, bevor Sie einen Dienst starten: https://storage.googleapis.com/bert_models/2018_10_18/cased_L-24_H-1024_A-16.zip</p>
<p>Verwenden Sie dieses Modell, um die Fragendatenbank in Merkmalsvektoren für die zukünftige Ähnlichkeitssuche umzuwandeln. Weitere Informationen über den BERT-Dienst finden Sie unter https://github.com/hanxiao/bert-as-service.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_code_block_e1b2021a91.png" alt="2-code-block.png" class="doc-image" id="2-code-block.png" />
   </span> <span class="img-wrapper"> <span>2-code-block.png</span> </span></p>
<h3 id="3-Import-to-Milvus-and-PostgreSQL" class="common-anchor-header">3. Importieren in Milvus und PostgreSQL</h3><p>Normalisieren und importieren Sie die generierten Feature-Vektoren in Milvus und importieren Sie dann die von Milvus zurückgegebenen IDs und die entsprechenden Antworten in PostgreSQL. Die folgende Abbildung zeigt die Tabellenstruktur in PostgreSQL:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_import_milvus_postgresql_bb2a258c61.png" alt="3-import-milvus-postgresql.png" class="doc-image" id="3-import-milvus-postgresql.png" />
   </span> <span class="img-wrapper"> <span>3-import-milvus-postgresql.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_import_milvus_postgresql_2abc29a4c4.png" alt="4-import-milvus-postgresql.png" class="doc-image" id="4-import-milvus-postgresql.png" />
   </span> <span class="img-wrapper"> <span>4-import-milvus-postgresql.png</span> </span></p>
<h3 id="4-Retrieve-Answers" class="common-anchor-header">4. Abrufen von Antworten</h3><p>Der Benutzer gibt eine Frage ein, und nachdem der Merkmalsvektor durch BERT generiert wurde, kann er die ähnlichste Frage in der Milvus-Bibliothek finden. Dieser Artikel verwendet den Kosinusabstand, um die Ähnlichkeit zwischen zwei Sätzen darzustellen. Da alle Vektoren normalisiert sind, ist die Ähnlichkeit umso größer, je näher der Kosinusabstand der beiden Merkmalsvektoren bei 1 liegt.</p>
<p>In der Praxis kann es vorkommen, dass Ihr System keine perfekt übereinstimmenden Fragen in der Bibliothek hat. Dann können Sie einen Schwellenwert von 0,9 festlegen. Wenn der größte ermittelte Ähnlichkeitsabstand unter diesem Schwellenwert liegt, meldet das System, dass es keine verwandten Fragen enthält.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_retrieve_answers_6424db1032.png" alt="4-retrieve-answers.png" class="doc-image" id="4-retrieve-answers.png" />
   </span> <span class="img-wrapper"> <span>4-abrufen-antworten.png</span> </span></p>
<h2 id="System-Demonstration" class="common-anchor-header">System-Demonstration<button data-href="#System-Demonstration" class="anchor-icon" translate="no">
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
    </button></h2><p>Die folgende Abbildung zeigt eine Beispielschnittstelle des Systems:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_milvus_QA_system_application_e5860cee42.png" alt="5-milvus-QA-system-application.png" class="doc-image" id="5-milvus-qa-system-application.png" />
   </span> <span class="img-wrapper"> <span>5-milvus-QA-system-anwendung.png</span> </span></p>
<p>Geben Sie Ihre Frage in das Dialogfeld ein und Sie erhalten eine entsprechende Antwort:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_milvus_QA_system_application_2_8064237e2a.png" alt="5-milvus-QA-system-application-2.png" class="doc-image" id="5-milvus-qa-system-application-2.png" />
   </span> <span class="img-wrapper"> <span>5-milvus-QA-system-anwendung-2.png</span> </span></p>
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
    </button></h2><p>Wir hoffen, dass es Ihnen nach der Lektüre dieses Artikels leicht fällt, Ihr eigenes Q&amp;A-System aufzubauen.</p>
<p>Mit dem BERT-Modell müssen Sie die Textkorpora nicht mehr vorher sortieren und organisieren. Gleichzeitig kann Ihr QA-System dank der hohen Leistung und der hohen Skalierbarkeit der Open-Source-Vektorsuchmaschine Milvus einen Korpus von bis zu Hunderten von Millionen von Texten unterstützen.</p>
<p>Milvus ist offiziell der Linux AI (LF AI) Foundation zur Inkubation beigetreten. Sie sind herzlich eingeladen, der Milvus-Community beizutreten und mit uns zusammenzuarbeiten, um die Anwendung von KI-Technologien zu beschleunigen!</p>
<p>=&gt; Testen Sie unsere Online-Demo hier: https://www.milvus.io/scenarios</p>
