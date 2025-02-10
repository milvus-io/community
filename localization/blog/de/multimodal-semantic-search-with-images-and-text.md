---
id: multimodal-semantic-search-with-images-and-text.md
title: Multimodale semantische Suche mit Bildern und Text
author: Stefan Webb
date: 2025-02-3
desc: >-
  Erfahren Sie, wie Sie mit multimodaler KI eine semantische Suchanwendung
  erstellen, die über den einfachen Abgleich von Schlüsselwörtern hinaus auch
  Text-Bild-Beziehungen versteht.
cover: >-
  assets.zilliz.com/Multimodal_Semantic_Search_with_Images_and_Text_1_3da9b83015.png
tag: Engineering
tags: 'Milvus, Vector Database, Open Source, Semantic Search, Multimodal AI'
recommend: true
canonicalUrl: 'https://milvus.io/blog/multimodal-semantic-search-with-images-and-text.md'
---
<iframe width="100%" height="315" src="https://www.youtube.com/embed/bxE0_QYX_sU?si=PkOHFcZto-rda1Fv" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<p>Als Menschen interpretieren wir die Welt mit unseren Sinnen. Wir hören Geräusche, sehen Bilder, Videos und Texte, die sich oft überlagern. Wir verstehen die Welt durch diese verschiedenen Modalitäten und die Beziehungen zwischen ihnen. Damit künstliche Intelligenz den menschlichen Fähigkeiten wirklich ebenbürtig ist oder sie sogar übertrifft, muss sie die gleiche Fähigkeit entwickeln, die Welt durch mehrere Linsen gleichzeitig zu verstehen.</p>
<p>In diesem Beitrag und dem dazugehörigen Video (oben) und <a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/multimodal_retrieval_amazon_reviews.ipynb">Notebook</a> stellen wir die jüngsten Durchbrüche bei Modellen vor, die sowohl Text als auch Bilder gleichzeitig verarbeiten können. Wir werden dies anhand einer semantischen Suchanwendung demonstrieren, die über den einfachen Abgleich von Schlüsselwörtern hinausgeht - sie versteht die Beziehung zwischen dem, wonach Benutzer fragen, und den visuellen Inhalten, die sie durchsuchen.</p>
<p>Was dieses Projekt besonders aufregend macht, ist die Tatsache, dass es vollständig mit Open-Source-Tools erstellt wurde: die Vektordatenbank Milvus, die Bibliotheken für maschinelles Lernen von HuggingFace und ein Datensatz von Amazon-Kundenrezensionen. Es ist bemerkenswert, wenn man sich vorstellt, dass noch vor einem Jahrzehnt für die Entwicklung eines solchen Projekts erhebliche firmeneigene Ressourcen erforderlich gewesen wären. Heute sind diese leistungsstarken Komponenten frei verfügbar und können von jedem, der neugierig ist, auf innovative Weise kombiniert werden.</p>
<custom-h1>Überblick</custom-h1><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/overview_97a124bc9a.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Unsere multimodale Suchanwendung ist vom Typ <em>Retrieve-and-Rerank.</em> Wenn Sie mit <em>Retrieval-Augmented-Generation</em> (RAG) vertraut sind, ist sie sehr ähnlich, nur dass die endgültige Ausgabe eine Liste von Bildern ist, die durch ein großes Sprach-Vision-Modell (LLVM) neu bewertet wurden. Die Suchanfrage des Benutzers enthält sowohl Text als auch Bild, und das Ziel ist eine Reihe von Bildern, die in einer Vektordatenbank indiziert sind. Die Architektur besteht aus drei Schritten - <em>Indizierung</em>, <em>Abruf</em> und <em>Neueinstufung</em> (ähnlich wie bei der "Generierung") - die wir nacheinander zusammenfassen.</p>
<h2 id="Indexing" class="common-anchor-header">Indizierung<button data-href="#Indexing" class="anchor-icon" translate="no">
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
    </button></h2><p>Unsere Suchanwendung muss etwas zu durchsuchen haben. In unserem Fall verwenden wir eine kleine Teilmenge des "Amazon Reviews 2023"-Datensatzes, der sowohl Text als auch Bilder von Amazon-Kundenrezensionen für alle Arten von Produkten enthält. Sie können sich vorstellen, dass eine semantische Suche wie diese, die wir aufbauen, eine nützliche Ergänzung für eine E-Commerce-Website ist. Wir verwenden 900 Bilder und verwerfen den Text. Beachten Sie jedoch, dass dieses Notebook mit der richtigen Datenbank und dem richtigen Einsatz von Inferenzen auf Produktionsgröße skaliert werden kann.</p>
<p>Das erste "magische" Element in unserer Pipeline ist die Wahl des Einbettungsmodells. Wir verwenden ein kürzlich entwickeltes multimodales Modell namens <a href="https://huggingface.co/BAAI/bge-visualized">Visualized BGE</a>, das in der Lage ist, Text und Bilder gemeinsam oder getrennt in denselben Raum mit einem einzigen Modell einzubetten, in dem nahe beieinander liegende Punkte semantisch ähnlich sind. In jüngster Zeit wurden weitere Modelle dieser Art entwickelt, z. B. <a href="https://github.com/google-deepmind/magiclens">MagicLens</a>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/indexing_1937241be5.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Die obige Abbildung veranschaulicht: Die Einbettung für [ein Bild eines Löwen von der Seite] plus den Text "front view of this" liegt nahe an einer Einbettung für [ein Bild eines Löwen von vorne] ohne Text. Dasselbe Modell wird sowohl für Text- und Bildeingaben als auch für reine Bildeingaben (wie auch für reine Texteingaben) verwendet. <em>Auf diese Weise ist das Modell in der Lage, die Absicht des Benutzers zu verstehen, wie der Suchtext mit dem Suchbild zusammenhängt.</em></p>
<p>Wir betten unsere 900 Produktbilder ohne entsprechenden Text ein und speichern die Einbettungen in einer Vektordatenbank mit <a href="https://milvus.io/docs">Milvus</a>.</p>
<h2 id="Retrieval" class="common-anchor-header">Abruf<button data-href="#Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><p>Nun, da unsere Datenbank aufgebaut ist, können wir eine Benutzerabfrage durchführen. Stellen Sie sich vor, ein Benutzer kommt mit der Anfrage: "eine Handyhülle mit diesem" plus [ein Bild eines Leoparden]. Das heißt, er sucht nach Handytaschen mit Leopardenfellmuster.</p>
<p>Beachten Sie, dass der Text der Benutzeranfrage "dies" und nicht "ein Leopardenfell" lautet. Unser Einbettungsmodell muss in der Lage sein, "dies" mit dem zu verbinden, worauf es sich bezieht, was eine beeindruckende Leistung ist, wenn man bedenkt, dass frühere Modelle nicht in der Lage waren, solche offenen Anweisungen zu verarbeiten. Das <a href="https://arxiv.org/abs/2403.19651">MagicLens-Papier</a> enthält weitere Beispiele.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Retrieval_ad64f48e49.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Wir betten den Abfragetext und das Bild gemeinsam ein und führen eine Ähnlichkeitssuche in unserer Vektordatenbank durch, wobei die neun besten Treffer zurückgegeben werden. Die Ergebnisse sind in der obigen Abbildung zusammen mit dem Suchbild des Leoparden dargestellt. Es zeigt sich, dass der oberste Treffer nicht derjenige ist, der für die Abfrage am relevantesten ist. Das siebte Ergebnis scheint am relevantesten zu sein - es handelt sich um eine Handyhülle mit einem Leopardenfellaufdruck.</p>
<h2 id="Generation" class="common-anchor-header">Generation<button data-href="#Generation" class="anchor-icon" translate="no">
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
    </button></h2><p>Es scheint, dass unsere Suche fehlgeschlagen ist, da das oberste Ergebnis nicht das relevanteste ist. Wir können dies jedoch mit einem Reranking-Schritt beheben. Sie wissen vielleicht, dass das Reranking der abgerufenen Elemente ein wichtiger Schritt in vielen RAG-Pipelines ist. Wir verwenden <a href="https://huggingface.co/microsoft/Phi-3-vision-128k-instruct">Phi-3 Vision</a> als Re-Ranking-Modell.</p>
<p>Zunächst bitten wir eine LLVM, eine Bildunterschrift für das angefragte Bild zu generieren. Der LLVM gibt aus:</p>
<p><em>"Das Bild zeigt eine Nahaufnahme des Gesichts eines Leoparden mit Fokus auf sein geflecktes Fell und seine grünen Augen."</em></p>
<p>Wir füttern dann diese Beschriftung, ein einzelnes Bild mit den neun Ergebnissen und das Abfragebild und erstellen eine Textaufforderung, die das Modell auffordert, die Ergebnisse neu zu ordnen, die Antwort als Liste anzugeben und eine Begründung für die Wahl der besten Übereinstimmung zu liefern.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Generation_b016a6c26a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Das Ergebnis ist in der obigen Abbildung zu sehen - das relevanteste Element ist nun die erste Übereinstimmung - und die Begründung lautet:</p>
<p><em>"Der am besten geeignete Artikel ist der mit dem Leopardenmotiv, der mit der Suchanfrage des Benutzers nach einer Handyhülle mit einem ähnlichen Motiv übereinstimmt."</em></p>
<p>Unser LLVM-Rankingsystem war in der Lage, Bilder und Text zu verstehen und die Relevanz der Suchergebnisse zu verbessern. <em>Ein interessantes Artefakt ist, dass der Re-Ranker nur acht Ergebnisse lieferte und eines verworfen hat, was die Notwendigkeit von Leitplanken und strukturierter Ausgabe unterstreicht.</em></p>
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
    </button></h2><p>In diesem Beitrag und dem dazugehörigen <a href="https://www.youtube.com/watch?v=bxE0_QYX_sU">Video</a> und <a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/multimodal_retrieval_amazon_reviews.ipynb">Notebook</a> haben wir eine Anwendung für die multimodale semantische Suche über Text und Bilder entwickelt. Das Einbettungsmodell war in der Lage, Text und Bilder gemeinsam oder getrennt in denselben Raum einzubetten, und das Basismodell war in der Lage, Text und Bild einzugeben und gleichzeitig Text als Antwort zu generieren. <em>Wichtig ist, dass das Einbettungsmodell in der Lage war, die Absicht des Benutzers einer offenen Anweisung mit dem Abfragebild in Beziehung zu setzen und auf diese Weise zu spezifizieren, wie der Benutzer die Ergebnisse mit dem eingegebenen Bild in Beziehung setzen wollte.</em></p>
<p>Dies ist nur ein Vorgeschmack auf das, was uns in naher Zukunft erwarten wird. Wir werden viele Anwendungen der multimodalen Suche, des multimodalen Verstehens und Schlussfolgerns usw. in verschiedenen Modalitäten sehen: Bilder, Video, Audio, Moleküle, soziale Netzwerke, Tabellendaten, Zeitreihen - das Potenzial ist grenzenlos.</p>
<p>Und das Herzstück dieser Systeme ist eine Vektordatenbank, die das externe "Gedächtnis" des Systems enthält. Milvus ist eine ausgezeichnete Wahl für diesen Zweck. Es ist quelloffen, voll funktionsfähig (siehe <a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">diesen Artikel über die Volltextsuche in Milvus 2.5</a>) und skaliert effizient auf Milliarden von Vektoren mit Datenverkehr im Web und einer Latenzzeit von unter 100 ms. Erfahren Sie mehr in den <a href="https://milvus.io/docs">Milvus-Dokumenten</a>, treten Sie unserer <a href="https://milvus.io/discord">Discord-Community</a> bei, und wir hoffen, Sie bei unserem nächsten <a href="https://lu.ma/unstructured-data-meetup">Unstructured Data Meetup</a> zu sehen. Bis dahin!</p>
<h2 id="Resources" class="common-anchor-header">Ressourcen<button data-href="#Resources" class="anchor-icon" translate="no">
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
<li><p>Notizbuch: <a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/multimodal_retrieval_amazon_reviews.ipynb">"Multimodale Suche mit Amazon-Rezensionen und LLVM-Reranking</a>"</p></li>
<li><p><a href="https://www.youtube.com/watch?v=bxE0_QYX_sU">Youtube AWS-Entwickler-Video</a></p></li>
<li><p><a href="https://milvus.io/docs">Milvus-Dokumentation</a></p></li>
<li><p><a href="https://lu.ma/unstructured-data-meetup">Treffen für unstrukturierte Daten</a></p></li>
<li><p>Modell einbetten: <a href="https://huggingface.co/BAAI/bge-visualized">Visualisierte BGE-Modellkarte</a></p></li>
<li><p>Alt. Einbettungsmodell: <a href="https://github.com/google-deepmind/magiclens">MagicLens-Modell-Repositorium</a></p></li>
<li><p>LLVM: <a href="https://huggingface.co/microsoft/Phi-3-vision-128k-instruct">Phi-3 Vision Modellkarte</a></p></li>
<li><p>Papier: "<a href="https://arxiv.org/abs/2403.19651">MagicLens: Self-Supervised Image Retrieval with Open-Ended Instructions</a>"</p></li>
<li><p>Datensatz: <a href="https://amazon-reviews-2023.github.io/">Amazon Bewertungen 2023</a></p></li>
</ul>
