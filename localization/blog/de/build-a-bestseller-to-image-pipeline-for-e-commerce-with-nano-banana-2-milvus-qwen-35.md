---
id: >-
  build-a-bestseller-to-image-pipeline-for-e-commerce-with-nano-banana-2-milvus-qwen-35.md
title: >-
  Aufbau einer Bestseller-to-Image Pipeline für E-Commerce mit Nano Banana 2 +
  Milvus + Qwen 3.5
author: Lumina Wang
date: 2026-3-3
cover: assets.zilliz.com/blog-images/20260303-100432.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: >-
  Nano Banana 2, Milvus, e-commerce AI image generation, AI product photography,
  vector search
meta_keywords: >-
  Nano Banana 2, Milvus, e-commerce AI image generation, AI product photography,
  vector search
meta_title: |
  Nano Banana 2 + Milvus: E-Commerce AI Image Generation Tutorial
desc: >-
  Schritt-für-Schritt-Anleitung: Verwenden Sie Nano Banana 2, die
  Milvus-Hybridsuche und Qwen 3.5, um E-Commerce-Produktfotos aus Flatlays zu
  1/3 der Kosten zu erstellen.
origin: >-
  https://milvus.io/blog/build-a-bestseller-to-image-pipeline-for-e-commerce-with-nano-banana-2-milvus-qwen-35.md
---
<p>Wenn Sie KI-Werkzeuge für E-Commerce-Verkäufer entwickeln, haben Sie diese Anfrage wahrscheinlich schon tausendmal gehört: "Ich habe ein neues Produkt. Geben Sie mir ein Werbebild, das aussieht, als gehöre es in eine Bestsellerliste. Kein Fotograf, kein Studio, und es soll billig sein."</p>
<p>Das ist das Problem in einem Satz. Verkäufer haben flache Fotos und einen Katalog von Bestsellern, die bereits konvertieren. Sie wollen beides mit KI verbinden, und zwar schnell und in großem Umfang.</p>
<p>Als Google am 26. Februar 2026 Nano Banana 2 (Gemini 3.1 Flash Image) veröffentlichte, testeten wir es noch am selben Tag und integrierten es in unsere bestehende Milvus-basierte Retrieval-Pipeline. Das Ergebnis: Die Gesamtkosten für die Bilderzeugung sanken auf etwa ein Drittel der früheren Ausgaben, und der Durchsatz verdoppelte sich. Die Preissenkung pro Bild (etwa 50 % billiger als Nano Banana Pro) trägt einen Teil dazu bei, aber die größeren Einsparungen ergeben sich aus der völligen Eliminierung von Nachbearbeitungszyklen.</p>
<p>In diesem Artikel erfahren Sie, was Nano Banana 2 für den E-Commerce leistet, wo es noch Defizite aufweist und wie Sie die komplette Pipeline in einem praktischen Tutorial erlernen können: <strong>Milvus-Hybridsuche</strong>, um visuell ähnliche Bestseller zu finden, <strong>Qwen</strong> 3.5 für die Stilanalyse und <strong>Nano Banana 2</strong> für die finale Generierung.</p>
<h2 id="What’s-New-with-Nano-Banana-2" class="common-anchor-header">Was ist neu bei Nano Banana 2?<button data-href="#What’s-New-with-Nano-Banana-2" class="anchor-icon" translate="no">
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
    </button></h2><p>Nano Banana 2 (Gemini 3.1 Flash Image) wurde am 26. Februar 2026 eingeführt. Es bringt die meisten Funktionen von Nano Banana Pro auf die Flash-Architektur, was eine schnellere Generierung zu einem niedrigeren Preis bedeutet. Hier sind die wichtigsten Neuerungen:</p>
<ul>
<li><strong>Profi-Qualität in Flash-Geschwindigkeit.</strong> Nano Banana 2 bietet erstklassiges Wissen, logisches Denken und visuelle Wiedergabetreue, die bisher nur Pro vorbehalten waren, aber mit der Latenzzeit und dem Durchsatz von Flash.</li>
<li><strong>512px bis 4K Ausgabe.</strong> Vier Auflösungsebenen (512px, 1K, 2K, 4K) mit nativer Unterstützung. Die 512px-Ebene ist neu und einzigartig für Nano Banana 2.</li>
<li><strong>14 Seitenverhältnisse.</strong> Fügt 4:1, 1:4, 8:1 und 1:8 zu den bestehenden Verhältnissen hinzu (1:1, 2:3, 3:2, 3:4, 4:3, 4:5, 5:4, 9:16, 16:9, 21:9).</li>
<li><strong>Bis zu 14 Referenzbilder.</strong> Behält die Zeichenähnlichkeit für bis zu 5 Zeichen und die Objekttreue für bis zu 14 Objekte in einem einzigen Arbeitsablauf bei.</li>
<li><strong>Verbesserte Textwiedergabe.</strong> Generiert lesbaren, präzisen Text im Bild in mehreren Sprachen, mit Unterstützung für Übersetzung und Lokalisierung innerhalb einer einzigen Generierung.</li>
<li><strong>Bildsuche als Grundlage.</strong> Greift auf Echtzeit-Webdaten und Bilder aus der Google-Suche zurück, um genauere Darstellungen von realen Themen zu generieren.</li>
<li><strong>~50% billiger pro Bild.</strong> Bei 1K Auflösung: <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0,</mn><mi>067versusPro′s0</mi></mrow><annotation encoding="application/x-tex">,067 versus Pro's</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7519em;"></span></span></span></span>0 <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">,</span><span class="mord"><span class="mord mathnormal">067versusPro</span></span></span></span></span><span class="pstrut" style="height:2.7em;"></span> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord mathnormal">′s0</span></span></span></span>,134.</li>
</ul>
<p><strong>Ein lustiger Anwendungsfall von Nano Banano 2: Erzeugen eines ortsbezogenen Panoramas auf der Grundlage eines einfachen Google Maps-Screenshots</strong></p>
<p>Anhand eines Google Maps-Screenshots und einer Eingabeaufforderung erkennt das Modell den geografischen Kontext und erzeugt ein Panorama, das die richtigen räumlichen Beziehungen beibehält. Nützlich für die Erstellung von Werbemitteln, die auf eine bestimmte Region zugeschnitten sind (Hintergrund eines Pariser Cafés, Straßenbild in Tokio), ohne dass man sich mit Stockfotografie eindecken muss.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Den vollständigen Funktionsumfang finden Sie in <a href="https://blog.google/innovation-and-ai/technology/ai/nano-banana-2/">Googles Ankündigungsblog</a> und in der <a href="https://ai.google.dev/gemini-api/docs/image-generation">Entwicklerdokumentation</a>.</p>
<h2 id="What-Does-This-Nano-Banana-Update-Mean-For-E-Commerce" class="common-anchor-header">Was bedeutet dieses Nano Banana-Update für den E-Commerce?<button data-href="#What-Does-This-Nano-Banana-Update-Mean-For-E-Commerce" class="anchor-icon" translate="no">
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
    </button></h2><p>Der elektronische Handel ist eine der bildintensivsten Branchen. Produktlisten, Marktplatz-Anzeigen, Social-Creatives, Bannerkampagnen, lokalisierte Schaufenster: Jeder Kanal erfordert einen konstanten Strom visueller Assets, jeder mit seinen eigenen Spezifikationen.</p>
<p>Die wichtigsten Anforderungen an die KI-Bilderstellung im E-Commerce lauten:</p>
<ul>
<li><strong>Niedrige Kosten</strong> - die Kosten pro Bild müssen in Kataloggröße funktionieren.</li>
<li><strong>Anpassung an das Aussehen bewährter Bestseller</strong> - neue Bilder sollten dem visuellen Stil von Angeboten entsprechen, die bereits erfolgreich sind.</li>
<li><strong>Vermeiden Sie Rechtsverletzungen</strong> - kopieren Sie keine Motive von Konkurrenten oder verwenden Sie keine geschützten Inhalte wieder.</li>
</ul>
<p>Darüber hinaus benötigen grenzüberschreitende Verkäufer:</p>
<ul>
<li><strong>Unterstützung von Multiplattform-Formaten</strong> - unterschiedliche Seitenverhältnisse und Spezifikationen für Marktplätze, Anzeigen und Schaufenster.</li>
<li><strong>Mehrsprachiges Text-Rendering</strong> - sauberer, akkurater In-Image-Text in mehreren Sprachen.</li>
</ul>
<p>Nano Banana 2 erfüllt nahezu alle Kriterien. In den folgenden Abschnitten wird aufgeschlüsselt, was die einzelnen Verbesserungen in der Praxis bedeuten: wo sie direkt ein Problem des E-Commerce lösen, wo sie nicht ausreichen und wie die tatsächlichen Kostenauswirkungen aussehen.</p>
<h3 id="Cut-Output-Generation-Costs-by-Up-to-60" class="common-anchor-header">Bis zu 60 % geringere Output-Erzeugungskosten</h3><p>Bei einer Auflösung von 1K kostet Nano Banana 2 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0,067 pro</mn><mi>BildversusPro′s0</mi></mrow><annotation encoding="application/x-tex">,067 pro Bild im Vergleich zu Pro</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.9463em;vertical-align:-0.1944em;"></span></span></span></span>0 <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">,067 pro</span><span class="mord"><span class="mord mathnormal">BildversusPro</span></span></span></span></span><span class="pstrut" style="height:2.7em;"></span> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord mathnormal">′s0</span></span></span></span>,134, was einer direkten Senkung um 50% entspricht. Aber der Preis pro Bild ist nur die Hälfte der Geschichte. Was früher die Budgets der Nutzer vernichtete, war die Nachbearbeitung. Jeder Marktplatz erzwingt seine eigenen Bildspezifikationen (1:1 für Amazon, 3:4 für Shopify-Storefronts, ultrawide für Bannerwerbung), und die Produktion jeder Variante bedeutete einen separaten Generierungsdurchlauf mit eigenen Fehlermöglichkeiten.</p>
<p>Nano Banana 2 fasst diese zusätzlichen Durchgänge in einem zusammen.</p>
<ul>
<li><p><strong>Vier native Auflösungsebenen.</strong></p></li>
<li><p>512px ($0.045)</p></li>
<li><p>1K ($0.067)</p></li>
<li><p>2K ($0.101)</p></li>
<li><p>4K ($0.151).</p></li>
</ul>
<p>Die 512px Stufe ist neu und einzigartig in Nano Banana 2. Benutzer können jetzt kostengünstige 512px-Entwürfe für die Iteration erstellen und das endgültige Asset in 2K oder 4K ohne einen separaten Upscaling-Schritt ausgeben.</p>
<ul>
<li><p>Insgesamt<strong>werden 14 Seitenverhältnisse unterstützt</strong>. Hier sind einige Beispiele:</p></li>
<li><p>4:1</p></li>
<li><p>1:4</p></li>
<li><p>8:1</p></li>
<li><p>1:8</p></li>
</ul>
<p>Diese neuen ultra-breiten und ultra-hohen Verhältnisse ergänzen die bestehenden. Mit einer Generierungssitzung können verschiedene Formate erzeugt werden, wie z. B.: <strong>Amazon-Hauptbild</strong> (1:1), <strong>Schaufensterheld</strong> (3:4) und <strong>Werbebanner</strong> (ultrabreit oder andere Verhältnisse).</p>
<p>Für diese 4 Formate ist kein Zuschneiden, kein Auffüllen und kein erneutes Aufrufen erforderlich. Die übrigen 10 Seitenverhältnisse sind im vollständigen Satz enthalten, was den Prozess auf verschiedenen Plattformen flexibler macht.</p>
<p>Allein die Einsparungen von ca. 50 % pro Bild würden die Rechnung halbieren. Durch die Eliminierung von Nacharbeiten bei verschiedenen Auflösungen und Seitenverhältnissen sind die Gesamtkosten auf etwa ein Drittel der früheren Ausgaben gesunken.</p>
<h3 id="Support-Up-to-14-Reference-Images-with-Bestseller-Style" class="common-anchor-header">Unterstützung von bis zu 14 Referenzbildern mit Bestseller-Stil</h3><p>Von allen Aktualisierungen von Nano Banana 2 hat das Multireferenz-Blending die größten Auswirkungen auf unsere Milvus-Pipeline. Nano Banana 2 akzeptiert bis zu 14 Referenzbilder in einer einzigen Anfrage und behält diese bei:</p>
<ul>
<li>Zeichenähnlichkeit für bis zu <strong>5 Zeichen</strong></li>
<li>Objekttreue für bis zu <strong>14 Objekte</strong></li>
</ul>
<p>In der Praxis haben wir mehrere Bestseller-Bilder von Milvus abgerufen, sie als Referenzen übergeben und das generierte Bild hat deren Szenenkomposition, Beleuchtung, Posing und Requisitenplatzierung übernommen. Es war kein promptes Engineering erforderlich, um diese Muster von Hand zu rekonstruieren.</p>
<p>Frühere Modelle unterstützten nur ein oder zwei Referenzen, so dass die Benutzer gezwungen waren, einen einzigen Bestseller zur Nachahmung auszuwählen. Mit 14 Referenzplätzen konnten wir Merkmale aus mehreren Top-Listen mischen und das Modell einen zusammengesetzten Stil synthetisieren lassen. Dies ist die Fähigkeit, die die Retrieval-basierte Pipeline in der folgenden Anleitung möglich macht.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image15.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Produce-Premium-Commercial-Ready-Visuals-Without-Traditional-Production-Cost-or-Logistics" class="common-anchor-header">Produzieren Sie hochwertiges, werbefähiges Bildmaterial ohne herkömmliche Produktionskosten oder Logistik</h3><p>Um eine konsistente und zuverlässige Bilderzeugung zu gewährleisten, sollten Sie nicht alle Ihre Anforderungen in eine einzige Eingabeaufforderung packen. Ein zuverlässigerer Ansatz besteht darin, schrittweise vorzugehen: Generieren Sie zuerst den Hintergrund, dann das Modell separat und fügen Sie beide schließlich zusammen.</p>
<p>Wir haben die Hintergrundgenerierung für alle drei Nano Banana-Modelle mit derselben Eingabeaufforderung getestet: eine 4:1-Ultrawide-Skyline von Shanghai an einem verregneten Tag, die durch ein Fenster betrachtet wird, wobei der Oriental Pearl Tower sichtbar ist. Mit dieser Aufforderung werden die Komposition, die architektonischen Details und der Fotorealismus in einem einzigen Durchgang getestet.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h4 id="Original-Nano-Banana-vs-Nano-Banana-Pro-vs-Nano-Banana-2" class="common-anchor-header">Original Nano Banana vs. Nano Banana Pro vs. Nano Banana 2</h4><ul>
<li><strong>Original Nano Banana.</strong> Natürliche Regentextur mit glaubwürdiger Tröpfchenverteilung, aber zu stark geglättete Gebäudedetails. Der Oriental Pearl Tower war kaum zu erkennen, und die Auflösung entsprach nicht den Produktionsanforderungen.</li>
<li><strong>Nano Banana Pro.</strong> Filmische Atmosphäre: Die warme Innenbeleuchtung spielte überzeugend mit dem kalten Regen. Allerdings wurde der Fensterrahmen komplett weggelassen, was die Tiefenwirkung des Bildes verringerte. Brauchbar als unterstützendes Bild, nicht als Held.</li>
<li><strong>Nano-Banane 2.</strong> Renderte die gesamte Szene. Der Fensterrahmen im Vordergrund erzeugte Tiefe. Der Oriental Pearl Tower war deutlich detailliert. Schiffe erschienen auf dem Huangpu-Fluss. Die schichtweise Beleuchtung unterschied die Wärme des Innenraums von der Bewölkung des Außenbereichs. Regen- und Wasserfleckentexturen wirkten nahezu fotorealistisch, und das 4:1-Ultraweitbildverhältnis sorgte für die richtige Perspektive mit nur geringer Verzerrung am linken Fensterrand.</li>
</ul>
<p>Für die meisten Aufgaben der Hintergrundgestaltung in der Produktfotografie fanden wir die Ausgabe der Nano Banana 2 ohne Nachbearbeitung brauchbar.</p>
<h3 id="Render-In-Image-Text-Cleanly-Across-Languages" class="common-anchor-header">Sauberes Rendern von Text im Bild in verschiedenen Sprachen</h3><p>Preisschilder, Werbebanner und mehrsprachige Texte sind in E-Commerce-Bildern unvermeidlich und waren in der Vergangenheit ein Knackpunkt für die KI-Generierung. Nano Banana 2 kommt damit wesentlich besser zurecht und unterstützt das Rendering von Text im Bild in mehreren Sprachen mit Übersetzung und Lokalisierung in einer einzigen Generation.</p>
<p><strong>Standard Textwiedergabe.</strong> In unseren Tests war die Textausgabe in jedem von uns getesteten E-Commerce-Format fehlerfrei: Preisetiketten, kurze Marketing-Taglines und zweisprachige Produktbeschreibungen.</p>
<p><strong>Handschriftliche Fortführung.</strong> Da im E-Commerce häufig handschriftliche Elemente wie Preisschilder und personalisierte Karten erforderlich sind, haben wir getestet, ob die Modelle einen vorhandenen handschriftlichen Stil übernehmen und erweitern können - insbesondere eine handschriftliche Aufgabenliste und das Hinzufügen von 5 neuen Elementen im gleichen Stil. Ergebnisse für drei Modelle:</p>
<ul>
<li><strong>Original Nano-Banane.</strong> Wiederholte Sequenznummern, missverstandene Struktur.</li>
<li><strong>Nano Banana Pro.</strong> Korrektes Layout, aber schlechte Wiedergabe des Schriftstils.</li>
<li><strong>Nano Banana 2.</strong> Null Fehler. Strichstärke und Schriftart sind so gut angepasst, dass sie von der Vorlage nicht zu unterscheiden sind.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image12.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>In der Google-Dokumentation wird<strong>jedoch</strong> darauf hingewiesen, dass Nano Banana 2 "noch Probleme mit der korrekten Rechtschreibung und feinen Details in Bildern haben kann". Unsere Ergebnisse waren in allen getesteten Formaten einwandfrei, aber jeder Produktionsworkflow sollte vor der Veröffentlichung eine Textüberprüfung beinhalten.</p>
<h2 id="Step-by-Step-Tutorial-Build-a-Bestseller-to-Image-Pipeline-with-Milvus-Qwen-35-and-Nano-Banana-2" class="common-anchor-header">Schritt-für-Schritt-Anleitung: Aufbau einer Pipeline für Bestseller und Bilder mit Milvus, Qwen 3.5 und Nano Banana 2<button data-href="#Step-by-Step-Tutorial-Build-a-Bestseller-to-Image-Pipeline-with-Milvus-Qwen-35-and-Nano-Banana-2" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Before-we-begin-Architecture-and-Model-Setup" class="common-anchor-header">Bevor wir beginnen: Architektur und Modellaufbau</h3><p>Um die Zufälligkeit der Single-Prompt-Generierung zu vermeiden, unterteilen wir den Prozess in drei kontrollierbare Stufen: Abrufen, was bereits mit der <strong>Milvus-Hybridsuche</strong> funktioniert, Analysieren, warum es mit <strong>Qwen 3.5</strong> funktioniert, und dann Generieren des endgültigen Bildes mit diesen Einschränkungen, die mit <strong>Nano Banana 2</strong> eingebaut werden.</p>
<p>Eine kurze Einführung in jedes Tool, falls Sie noch nicht mit ihnen gearbeitet haben:</p>
<ul>
<li><strong><a href="https://milvus.io/">Milvus</a></strong><a href="https://milvus.io/">:</a> die am weitesten verbreitete Open-Source-Vektordatenbank. Speichert Ihren Produktkatalog als Vektoren und führt eine hybride Suche (dichte + spärliche + skalare Filter) durch, um Bilder von Bestsellern zu finden, die einem neuen Produkt am ähnlichsten sind.</li>
<li><strong>Qwen 3.5</strong>: ein beliebter multimodaler LLM. Nimmt die abgerufenen Bilder von Bestsellern und extrahiert die visuellen Muster dahinter (Szenenaufbau, Beleuchtung, Pose, Stimmung) in eine strukturierte Stil-Eingabeaufforderung.</li>
<li><strong>Nano Banana 2</strong>: Bilderzeugungsmodell von Google (Gemini 3.1 Flash Image). Nimmt drei Eingaben entgegen: das neue Produkt-Flat-Lay, eine Bestseller-Referenz und die Stil-Eingabeaufforderung von Qwen 3.5. Gibt das endgültige Werbefoto aus.</li>
</ul>
<p>Die Logik hinter dieser Architektur beginnt mit einer Beobachtung: Das wertvollste visuelle Gut in jedem E-Commerce-Katalog ist die Bibliothek der Bestseller-Bilder, die bereits konvertiert wurden. Die Posen, Kompositionen und Beleuchtungen auf diesen Fotos wurden durch echte Werbeausgaben verfeinert. Diese Muster direkt abzurufen, ist um Größenordnungen schneller, als sie durch das Schreiben von Eingabeaufforderungen zurückzuentwickeln, und genau dieser Abrufschritt wird von einer Vektordatenbank übernommen.</p>
<p>Hier ist der vollständige Ablauf. Wir rufen jedes Modell über die OpenRouter-API auf, so dass keine lokale GPU erforderlich ist und keine Modellgewichte heruntergeladen werden müssen.</p>
<pre><code translate="no">New product flat-lay
│
│── Embed → Llama Nemotron Embed VL 1B v2
│
│── Search → Milvus hybrid search
│   ├── Dense <span class="hljs-title function_">vectors</span> <span class="hljs-params">(visual similarity)</span>
│   ├── Sparse <span class="hljs-title function_">vectors</span> <span class="hljs-params">(keyword matching)</span>
│   └── Scalar <span class="hljs-title function_">filters</span> <span class="hljs-params">(category + sales volume)</span>
│
│── Analyze → Qwen <span class="hljs-number">3.5</span> extracts style from retrieved bestsellers
│   └── scene, lighting, pose, mood → style prompt
│
└── Generate → Nano Banana <span class="hljs-number">2</span>
    ├── Inputs: <span class="hljs-keyword">new</span> <span class="hljs-title class_">product</span> + bestseller reference + style prompt
    └── Output: promotional photo
<button class="copy-code-btn"></button></code></pre>
<p>Wir stützen uns auf drei Milvus-Fähigkeiten, um die Abrufphase zu ermöglichen:</p>
<ol>
<li><strong>Dense + Sparse Hybrid Search.</strong> Wir führen Bildeinbettungen und Text-TF-IDF-Vektoren als parallele Abfragen durch und führen dann die beiden Ergebnismengen mit RRF (Reciprocal Rank Fusion) Reranking zusammen.</li>
<li><strong>Skalare Feldfilterung.</strong> Wir filtern vor dem Vektorvergleich nach Metadatenfeldern wie Kategorie und Verkaufszahl, sodass die Ergebnisse nur relevante, leistungsstarke Produkte enthalten.</li>
<li><strong>Schema mit mehreren Feldern.</strong> Wir speichern dichte Vektoren, spärliche Vektoren und skalare Metadaten in einer einzigen Milvus-Sammlung, so dass die gesamte Abfragelogik in einer einzigen Abfrage enthalten ist und nicht über mehrere Systeme verstreut.</li>
</ol>
<h3 id="Data-Preparation" class="common-anchor-header">Datenaufbereitung</h3><p><strong>Historischer Produktkatalog</strong></p>
<p>Wir beginnen mit zwei Assets: einem images/-Ordner mit bestehenden Produktfotos und einer products.csv-Datei mit den Metadaten.</p>
<pre><code translate="no">images/
├── SKU001.jpg
├── SKU002.jpg
├── ...
└── SKU040.jpg

products.csv fields:
product_id, image_path, category, color, style, season, sales_count, description, price
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Neue Produktdaten</strong></p>
<p>Für die Produkte, für die wir Werbebilder erstellen möchten, bereiten wir eine parallele Struktur vor: einen Ordner new_products/ und eine Datei new_products.csv.</p>
<pre><code translate="no">new_products/
├── NEW001.jpg    <span class="hljs-comment"># Blue knit cardigan + grey tulle skirt set</span>
├── NEW002.jpg    <span class="hljs-comment"># Light green floral ruffle maxi dress</span>
├── NEW003.jpg    <span class="hljs-comment"># Camel turtleneck knit dress</span>
└── NEW004.jpg    <span class="hljs-comment"># Dark grey ethnic-style cowl neck top dress</span>

new_products.csv fields:
new_id, image_path, category, style, season, prompt_hint
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image11.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image16.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-1-Install-Dependencies" class="common-anchor-header">Schritt 1: Abhängigkeiten installieren</h3><pre><code translate="no">!pip install pymilvus openai requests pillow scikit-learn tqdm
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Import-Modules-and-Configurations" class="common-anchor-header">Schritt 2: Module und Konfigurationen importieren</h3><pre><code translate="no"><span class="hljs-keyword">import</span> os, io, base64, csv, time
<span class="hljs-keyword">import</span> requests <span class="hljs-keyword">as</span> req
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">from</span> <span class="hljs-variable constant_">PIL</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">Image</span>
<span class="hljs-keyword">from</span> tqdm.<span class="hljs-property">notebook</span> <span class="hljs-keyword">import</span> tqdm
<span class="hljs-keyword">from</span> sklearn.<span class="hljs-property">feature_extraction</span>.<span class="hljs-property">text</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">TfidfVectorizer</span>
<span class="hljs-keyword">from</span> <span class="hljs-title class_">IPython</span>.<span class="hljs-property">display</span> <span class="hljs-keyword">import</span> display

<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAI</span>
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>, <span class="hljs-title class_">DataType</span>, <span class="hljs-title class_">AnnSearchRequest</span>, <span class="hljs-title class_">RRFRanker</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Konfigurieren Sie alle Modelle und Pfade:</strong></p>
<pre><code translate="no"><span class="hljs-comment"># -- Config --</span>
OPENROUTER_API_KEY = os.environ.get(
    <span class="hljs-string">&quot;OPENROUTER_API_KEY&quot;</span>,
    <span class="hljs-string">&quot;&lt;YOUR_OPENROUTER_API_KEY&gt;&quot;</span>,
)

<span class="hljs-comment"># Models (all via OpenRouter, no local download needed)</span>
EMBED_MODEL = <span class="hljs-string">&quot;nvidia/llama-nemotron-embed-vl-1b-v2&quot;</span>  <span class="hljs-comment"># free, image+text → 2048d</span>
EMBED_DIM = <span class="hljs-number">2048</span>
LLM_MODEL = <span class="hljs-string">&quot;qwen/qwen3.5-397b-a17b&quot;</span>                 <span class="hljs-comment"># style analysis</span>
IMAGE_GEN_MODEL = <span class="hljs-string">&quot;google/gemini-3.1-flash-image-preview&quot;</span>  <span class="hljs-comment"># Nano Banana 2</span>

<span class="hljs-comment"># Milvus</span>
MILVUS_URI = <span class="hljs-string">&quot;./milvus_fashion.db&quot;</span>
COLLECTION = <span class="hljs-string">&quot;fashion_products&quot;</span>
TOP_K = <span class="hljs-number">3</span>

<span class="hljs-comment"># Paths</span>
IMAGE_DIR = <span class="hljs-string">&quot;./images&quot;</span>
NEW_PRODUCT_DIR = <span class="hljs-string">&quot;./new_products&quot;</span>
PRODUCT_CSV = <span class="hljs-string">&quot;./products.csv&quot;</span>
NEW_PRODUCT_CSV = <span class="hljs-string">&quot;./new_products.csv&quot;</span>

<span class="hljs-comment"># OpenRouter client (shared for LLM + image gen)</span>
llm = OpenAI(api_key=OPENROUTER_API_KEY, base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Config loaded. All models via OpenRouter API.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Hilfsfunktionen</strong></p>
<p>Diese Hilfsfunktionen übernehmen die Bildkodierung, API-Aufrufe und das Parsen von Antworten:</p>
<ul>
<li>image_to_uri(): Konvertiert ein PIL-Bild in einen base64-Daten-URI für den API-Transport.</li>
<li>get_image_embeddings(): Batch-Kodierung von Bildern in 2048-dimensionale Vektoren über die OpenRouter Embedding API.</li>
<li>get_text_embedding(): Kodiert Text in denselben 2048-dimensionalen Vektorraum.</li>
<li>sparse_to_dict(): Konvertiert eine Scipy-Sparse-Matrixzeile in das {index: value}-Format, das Milvus für Sparse-Vektoren erwartet.</li>
<li>extract_images(): Extrahiert generierte Bilder aus der Nano Banana 2 API Antwort.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># -- Utility functions --</span>

<span class="hljs-keyword">def</span> <span class="hljs-title function_">image_to_uri</span>(<span class="hljs-params">img, max_size=<span class="hljs-number">1024</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Convert PIL Image to base64 data URI.&quot;&quot;&quot;</span>
    img = img.copy()
    w, h = img.size
    <span class="hljs-keyword">if</span> <span class="hljs-built_in">max</span>(w, h) &gt; max_size:
        r = max_size / <span class="hljs-built_in">max</span>(w, h)
        img = img.resize((<span class="hljs-built_in">int</span>(w * r), <span class="hljs-built_in">int</span>(h * r)), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, <span class="hljs-built_in">format</span>=<span class="hljs-string">&quot;JPEG&quot;</span>, quality=<span class="hljs-number">85</span>)
    <span class="hljs-keyword">return</span> <span class="hljs-string">f&quot;data:image/jpeg;base64,<span class="hljs-subst">{base64.b64encode(buf.getvalue()).decode()}</span>&quot;</span>

<span class="hljs-keyword">def</span> <span class="hljs-title function_">get_image_embeddings</span>(<span class="hljs-params">images, batch_size=<span class="hljs-number">5</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Encode images via OpenRouter embedding API.&quot;&quot;&quot;</span>
    all_embs = []
    <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> tqdm(<span class="hljs-built_in">range</span>(<span class="hljs-number">0</span>, <span class="hljs-built_in">len</span>(images), batch_size), desc=<span class="hljs-string">&quot;Encoding images&quot;</span>):
        batch = images[i : i + batch_size]
        inputs = [
            {<span class="hljs-string">&quot;content&quot;</span>: [{<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: {<span class="hljs-string">&quot;url&quot;</span>: image_to_uri(img, max_size=<span class="hljs-number">512</span>)}}]}
            <span class="hljs-keyword">for</span> img <span class="hljs-keyword">in</span> batch
        ]
        resp = req.post(
            <span class="hljs-string">&quot;https://openrouter.ai/api/v1/embeddings&quot;</span>,
            headers={<span class="hljs-string">&quot;Authorization&quot;</span>: <span class="hljs-string">f&quot;Bearer <span class="hljs-subst">{OPENROUTER_API_KEY}</span>&quot;</span>},
            json={<span class="hljs-string">&quot;model&quot;</span>: EMBED_MODEL, <span class="hljs-string">&quot;input&quot;</span>: inputs},
            timeout=<span class="hljs-number">120</span>,
        )
        data = resp.json()
        <span class="hljs-keyword">if</span> <span class="hljs-string">&quot;data&quot;</span> <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> data:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;API error: <span class="hljs-subst">{data}</span>&quot;</span>)
            <span class="hljs-keyword">continue</span>
        <span class="hljs-keyword">for</span> item <span class="hljs-keyword">in</span> <span class="hljs-built_in">sorted</span>(data[<span class="hljs-string">&quot;data&quot;</span>], key=<span class="hljs-keyword">lambda</span> x: x[<span class="hljs-string">&quot;index&quot;</span>]):
            all_embs.append(item[<span class="hljs-string">&quot;embedding&quot;</span>])
        time.sleep(<span class="hljs-number">0.5</span>)  <span class="hljs-comment"># rate limit friendly</span>
    <span class="hljs-keyword">return</span> np.array(all_embs, dtype=np.float32)

<span class="hljs-keyword">def</span> <span class="hljs-title function_">get_text_embedding</span>(<span class="hljs-params">text</span>):
    <span class="hljs-string">&quot;&quot;&quot;Encode text via OpenRouter embedding API.&quot;&quot;&quot;</span>
    resp = req.post(
        <span class="hljs-string">&quot;https://openrouter.ai/api/v1/embeddings&quot;</span>,
        headers={<span class="hljs-string">&quot;Authorization&quot;</span>: <span class="hljs-string">f&quot;Bearer <span class="hljs-subst">{OPENROUTER_API_KEY}</span>&quot;</span>},
        json={<span class="hljs-string">&quot;model&quot;</span>: EMBED_MODEL, <span class="hljs-string">&quot;input&quot;</span>: text},
        timeout=<span class="hljs-number">60</span>,
    )
    <span class="hljs-keyword">return</span> np.array(resp.json()[<span class="hljs-string">&quot;data&quot;</span>][<span class="hljs-number">0</span>][<span class="hljs-string">&quot;embedding&quot;</span>], dtype=np.float32)

<span class="hljs-keyword">def</span> <span class="hljs-title function_">sparse_to_dict</span>(<span class="hljs-params">sparse_row</span>):
    <span class="hljs-string">&quot;&quot;&quot;Convert scipy sparse row to Milvus sparse vector format {index: value}.&quot;&quot;&quot;</span>
    coo = sparse_row.tocoo()
    <span class="hljs-keyword">return</span> {<span class="hljs-built_in">int</span>(i): <span class="hljs-built_in">float</span>(v) <span class="hljs-keyword">for</span> i, v <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(coo.col, coo.data)}

<span class="hljs-keyword">def</span> <span class="hljs-title function_">extract_images</span>(<span class="hljs-params">response</span>):
    <span class="hljs-string">&quot;&quot;&quot;Extract generated images from OpenRouter response.&quot;&quot;&quot;</span>
    images = []
    raw = response.model_dump()
    msg = raw[<span class="hljs-string">&quot;choices&quot;</span>][<span class="hljs-number">0</span>][<span class="hljs-string">&quot;message&quot;</span>]
    <span class="hljs-comment"># Method 1: images field (OpenRouter extension)</span>
    <span class="hljs-keyword">if</span> <span class="hljs-string">&quot;images&quot;</span> <span class="hljs-keyword">in</span> msg <span class="hljs-keyword">and</span> msg[<span class="hljs-string">&quot;images&quot;</span>]:
        <span class="hljs-keyword">for</span> img_data <span class="hljs-keyword">in</span> msg[<span class="hljs-string">&quot;images&quot;</span>]:
            url = img_data[<span class="hljs-string">&quot;image_url&quot;</span>][<span class="hljs-string">&quot;url&quot;</span>]
            b64 = url.split(<span class="hljs-string">&quot;,&quot;</span>, <span class="hljs-number">1</span>)[<span class="hljs-number">1</span>]
            images.append(Image.<span class="hljs-built_in">open</span>(io.BytesIO(base64.b64decode(b64))))
    <span class="hljs-comment"># Method 2: inline base64 in content parts</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> images <span class="hljs-keyword">and</span> <span class="hljs-built_in">isinstance</span>(msg.get(<span class="hljs-string">&quot;content&quot;</span>), <span class="hljs-built_in">list</span>):
        <span class="hljs-keyword">for</span> part <span class="hljs-keyword">in</span> msg[<span class="hljs-string">&quot;content&quot;</span>]:
            <span class="hljs-keyword">if</span> <span class="hljs-built_in">isinstance</span>(part, <span class="hljs-built_in">dict</span>) <span class="hljs-keyword">and</span> part.get(<span class="hljs-string">&quot;type&quot;</span>) == <span class="hljs-string">&quot;image_url&quot;</span>:
                url = part[<span class="hljs-string">&quot;image_url&quot;</span>][<span class="hljs-string">&quot;url&quot;</span>]
                <span class="hljs-keyword">if</span> url.startswith(<span class="hljs-string">&quot;data:image&quot;</span>):
                    b64 = url.split(<span class="hljs-string">&quot;,&quot;</span>, <span class="hljs-number">1</span>)[<span class="hljs-number">1</span>]
                    images.append(Image.<span class="hljs-built_in">open</span>(io.BytesIO(base64.b64decode(b64))))
    <span class="hljs-keyword">return</span> images

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Utility functions ready.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Load-the-Product-Catalog" class="common-anchor-header">Schritt 3: Laden des Produktkatalogs</h3><p>Lesen Sie products.csv und laden Sie die entsprechenden Produktbilder:</p>
<pre><code translate="no"><span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(PRODUCT_CSV, newline=<span class="hljs-string">&quot;&quot;</span>, encoding=<span class="hljs-string">&quot;utf-8&quot;</span>) <span class="hljs-keyword">as</span> f:
    products = <span class="hljs-built_in">list</span>(csv.DictReader(f))

product_images = []
<span class="hljs-keyword">for</span> p <span class="hljs-keyword">in</span> products:
    img = Image.<span class="hljs-built_in">open</span>(os.path.join(IMAGE_DIR, p[<span class="hljs-string">&quot;image_path&quot;</span>])).convert(<span class="hljs-string">&quot;RGB&quot;</span>)
    product_images.append(img)

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Loaded <span class="hljs-subst">{<span class="hljs-built_in">len</span>(products)}</span> products.&quot;</span>)
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">3</span>):
    p = products[i]
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{p[<span class="hljs-string">&#x27;product_id&#x27;</span>]}</span> | <span class="hljs-subst">{p[<span class="hljs-string">&#x27;category&#x27;</span>]}</span> | <span class="hljs-subst">{p[<span class="hljs-string">&#x27;color&#x27;</span>]}</span> | <span class="hljs-subst">{p[<span class="hljs-string">&#x27;style&#x27;</span>]}</span> | sales: <span class="hljs-subst">{p[<span class="hljs-string">&#x27;sales_count&#x27;</span>]}</span>&quot;</span>)
    display(product_images[i].resize((<span class="hljs-number">180</span>, <span class="hljs-built_in">int</span>(<span class="hljs-number">180</span> * product_images[i].height / product_images[i].width))))
<button class="copy-code-btn"></button></code></pre>
<p>Beispielhafte Ausgabe:<br>

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image13.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Generate-Embeddings" class="common-anchor-header">Schritt 4: Erzeugen von Einbettungen</h3><p>Die hybride Suche erfordert zwei Arten von Vektoren für jedes Produkt.</p>
<p><strong>4.1 Dichte Vektoren: Bildeinbettungen</strong></p>
<p>Das Modell nvidia/llama-nemotron-embed-vl-1b-v2 kodiert jedes Produktbild in einen 2048-dimensionalen dichten Vektor. Da dieses Modell sowohl Bild- als auch Texteingaben in einem gemeinsamen Vektorraum unterstützt, funktionieren die gleichen Einbettungen für die Bild-zu-Bild- und die Text-zu-Bild-Suche.</p>
<pre><code translate="no"><span class="hljs-comment"># Dense embeddings: image → 2048-dim vector via OpenRouter API</span>
dense_vectors = get_image_embeddings(product_images, batch_size=<span class="hljs-number">5</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Dense vectors: <span class="hljs-subst">{dense_vectors.shape}</span>  (products x <span class="hljs-subst">{EMBED_DIM}</span>d)&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Ausgabe:</p>
<pre><code translate="no">Dense vectors: (40, 2048)  (products x 2048d)
<button class="copy-code-btn"></button></code></pre>
<p><strong>4.2 Dünne Vektoren: TF-IDF Texteinbettungen</strong></p>
<p>Produktbeschreibungen werden mit Hilfe des TF-IDF-Vektorisierers von scikit-learn in spärliche Vektoren kodiert. Diese erfassen Übereinstimmungen auf Schlüsselwortebene, die bei dichten Vektoren fehlen können.</p>
<pre><code translate="no"><span class="hljs-comment"># Sparse embeddings: TF-IDF on product descriptions</span>
descriptions = [p[<span class="hljs-string">&quot;description&quot;</span>] <span class="hljs-keyword">for</span> p <span class="hljs-keyword">in</span> products]
tfidf = TfidfVectorizer(stop_words=<span class="hljs-string">&quot;english&quot;</span>, max_features=<span class="hljs-number">500</span>)
tfidf_matrix = tfidf.fit_transform(descriptions)

sparse_vectors = [sparse_to_dict(tfidf_matrix[i]) <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(products))]
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Sparse vectors: <span class="hljs-subst">{<span class="hljs-built_in">len</span>(sparse_vectors)}</span> products, vocab size: <span class="hljs-subst">{<span class="hljs-built_in">len</span>(tfidf.vocabulary_)}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Sample sparse vector (SKU001): <span class="hljs-subst">{<span class="hljs-built_in">len</span>(sparse_vectors[<span class="hljs-number">0</span>])}</span> non-zero terms&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Ausgabe:</p>
<pre><code translate="no">Sparse vectors: <span class="hljs-number">40</span> products, vocab size: <span class="hljs-number">179</span>
Sample sparse <span class="hljs-title function_">vector</span> <span class="hljs-params">(SKU001)</span>: <span class="hljs-number">11</span> non-zero terms
<button class="copy-code-btn"></button></code></pre>
<p><strong>Warum beide Vektortypen?</strong> Dichte und spärliche Vektoren ergänzen sich gegenseitig. Dichte Vektoren erfassen die visuelle Ähnlichkeit: Farbpalette, Kleidungssilhouette, Gesamtstil. Spärliche Vektoren erfassen die Semantik von Schlüsselwörtern: Begriffe wie "floral", "midi" oder "chiffon", die Produkteigenschaften signalisieren. Die Kombination beider Ansätze führt zu einer deutlich besseren Suchqualität als jeder Ansatz allein.</p>
<h3 id="Step-5-Create-a-Milvus-Collection-with-Hybrid-Schema" class="common-anchor-header">Schritt 5: Erstellen einer Milvus-Sammlung mit Hybridschema</h3><p>In diesem Schritt wird eine einzige Milvus-Sammlung erstellt, die dichte Vektoren, spärliche Vektoren und skalare Metadatenfelder gemeinsam speichert. Dieses vereinheitlichte Schema ermöglicht die hybride Suche in einer einzigen Abfrage.</p>
<table>
<thead>
<tr><th><strong>Feld</strong></th><th><strong>Typ</strong></th><th><strong>Zweck</strong></th></tr>
</thead>
<tbody>
<tr><td>dichter_vektor</td><td>FLOAT_VECTOR (2048d)</td><td>Bildeinbettung, COSINE-Ähnlichkeit</td></tr>
<tr><td>sparse_vector</td><td>SPARSE_FLOAT_VECTOR</td><td>TF-IDF Sparse-Vektor, inneres Produkt</td></tr>
<tr><td>Kategorie</td><td>VARCHAR</td><td>Kategoriebezeichnung für die Filterung</td></tr>
<tr><td>Umsatz_Zahl</td><td>INT64</td><td>Historisches Verkaufsvolumen für die Filterung</td></tr>
<tr><td>Farbe, Stil, Saison</td><td>VARCHAR</td><td>Zusätzliche Metadatenbezeichnungen</td></tr>
<tr><td>Preis</td><td>FLOAT</td><td>Preis des Produkts</td></tr>
</tbody>
</table>
<pre><code translate="no">milvus_client = MilvusClient(uri=MILVUS_URI)

<span class="hljs-keyword">if</span> milvus_client.has_collection(COLLECTION):
    milvus_client.drop_collection(COLLECTION)

schema = milvus_client.create_schema(auto_id=<span class="hljs-literal">True</span>, enable_dynamic_field=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;product_id&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">20</span>)
schema.add_field(<span class="hljs-string">&quot;category&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
schema.add_field(<span class="hljs-string">&quot;color&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
schema.add_field(<span class="hljs-string">&quot;style&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
schema.add_field(<span class="hljs-string">&quot;season&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
schema.add_field(<span class="hljs-string">&quot;sales_count&quot;</span>, DataType.INT64)
schema.add_field(<span class="hljs-string">&quot;description&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">500</span>)
schema.add_field(<span class="hljs-string">&quot;price&quot;</span>, DataType.FLOAT)
schema.add_field(<span class="hljs-string">&quot;dense_vector&quot;</span>, DataType.FLOAT_VECTOR, dim=EMBED_DIM)
schema.add_field(<span class="hljs-string">&quot;sparse_vector&quot;</span>, DataType.SPARSE_FLOAT_VECTOR)

index_params = milvus_client.prepare_index_params()
index_params.add_index(field_name=<span class="hljs-string">&quot;dense_vector&quot;</span>, index_type=<span class="hljs-string">&quot;FLAT&quot;</span>, metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>)
index_params.add_index(field_name=<span class="hljs-string">&quot;sparse_vector&quot;</span>, index_type=<span class="hljs-string">&quot;SPARSE_INVERTED_INDEX&quot;</span>, metric_type=<span class="hljs-string">&quot;IP&quot;</span>)

milvus_client.create_collection(COLLECTION, schema=schema, index_params=index_params)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Milvus collection &#x27;<span class="hljs-subst">{COLLECTION}</span>&#x27; created with hybrid schema.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Fügen Sie die Produktdaten ein:</p>
<pre><code translate="no"><span class="hljs-comment"># Insert all products</span>
rows = []
<span class="hljs-keyword">for</span> i, p <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(products):
    rows.append({
        <span class="hljs-string">&quot;product_id&quot;</span>: p[<span class="hljs-string">&quot;product_id&quot;</span>],
        <span class="hljs-string">&quot;category&quot;</span>: p[<span class="hljs-string">&quot;category&quot;</span>],
        <span class="hljs-string">&quot;color&quot;</span>: p[<span class="hljs-string">&quot;color&quot;</span>],
        <span class="hljs-string">&quot;style&quot;</span>: p[<span class="hljs-string">&quot;style&quot;</span>],
        <span class="hljs-string">&quot;season&quot;</span>: p[<span class="hljs-string">&quot;season&quot;</span>],
        <span class="hljs-string">&quot;sales_count&quot;</span>: <span class="hljs-built_in">int</span>(p[<span class="hljs-string">&quot;sales_count&quot;</span>]),
        <span class="hljs-string">&quot;description&quot;</span>: p[<span class="hljs-string">&quot;description&quot;</span>],
        <span class="hljs-string">&quot;price&quot;</span>: <span class="hljs-built_in">float</span>(p[<span class="hljs-string">&quot;price&quot;</span>]),
        <span class="hljs-string">&quot;dense_vector&quot;</span>: dense_vectors[i].tolist(),
        <span class="hljs-string">&quot;sparse_vector&quot;</span>: sparse_vectors[i],
    })

milvus_client.insert(COLLECTION, rows)
stats = milvus_client.get_collection_stats(COLLECTION)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted <span class="hljs-subst">{stats[<span class="hljs-string">&#x27;row_count&#x27;</span>]}</span> products into Milvus.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Ausgabe:</p>
<pre><code translate="no">Inserted <span class="hljs-number">40</span> products <span class="hljs-keyword">into</span> Milvus.
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-6-Hybrid-Search-to-Find-Similar-Bestsellers" class="common-anchor-header">Schritt 6: Hybride Suche nach ähnlichen Bestsellern</h3><p>Dies ist der wichtigste Schritt der Suche. Für jedes neue Produkt führt die Pipeline drei Operationen gleichzeitig aus:</p>
<ol>
<li><strong>Dichte Suche</strong>: findet Produkte mit visuell ähnlichen Bildeinbettungen.</li>
<li><strong>Sparsame Suche</strong>: Findet Produkte mit übereinstimmenden Text-Schlüsselwörtern über TF-IDF.</li>
<li><strong>Skalare Filterung</strong>: schränkt die Ergebnisse auf dieselbe Kategorie und Produkte mit einer Verkaufszahl &gt; 1500 ein.</li>
<li><strong>RRF-Reranking</strong>: führt die dichten und spärlichen Ergebnislisten mittels Reciprocal Rank Fusion zusammen.</li>
</ol>
<p>Laden Sie das neue Produkt:</p>
<pre><code translate="no"><span class="hljs-comment"># Load new products</span>
<span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(NEW_PRODUCT_CSV, newline=<span class="hljs-string">&quot;&quot;</span>, encoding=<span class="hljs-string">&quot;utf-8&quot;</span>) <span class="hljs-keyword">as</span> f:
    new_products = <span class="hljs-built_in">list</span>(csv.DictReader(f))

<span class="hljs-comment"># Pick the first new product for demo</span>
new_prod = new_products[<span class="hljs-number">0</span>]
new_img = Image.<span class="hljs-built_in">open</span>(os.path.join(NEW_PRODUCT_DIR, new_prod[<span class="hljs-string">&quot;image_path&quot;</span>])).convert(<span class="hljs-string">&quot;RGB&quot;</span>)

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;New product: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;new_id&#x27;</span>]}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Category: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;category&#x27;</span>]}</span> | Style: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;style&#x27;</span>]}</span> | Season: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;season&#x27;</span>]}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Prompt hint: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;prompt_hint&#x27;</span>]}</span>&quot;</span>)
display(new_img.resize((<span class="hljs-number">300</span>, <span class="hljs-built_in">int</span>(<span class="hljs-number">300</span> * new_img.height / new_img.width))))
<button class="copy-code-btn"></button></code></pre>
<p>Ausgabe:  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Codieren Sie das neue Produkt:</p>
<pre><code translate="no"><span class="hljs-comment"># Encode new product</span>
<span class="hljs-comment"># Dense: image embedding via API</span>
query_dense = get_image_embeddings([new_img], batch_size=<span class="hljs-number">1</span>)[<span class="hljs-number">0</span>]

<span class="hljs-comment"># Sparse: TF-IDF from text query</span>
query_text = <span class="hljs-string">f&quot;<span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;category&#x27;</span>]}</span> <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;style&#x27;</span>]}</span> <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;season&#x27;</span>]}</span> <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;prompt_hint&#x27;</span>]}</span>&quot;</span>
query_sparse = sparse_to_dict(tfidf.transform([query_text])[<span class="hljs-number">0</span>])

<span class="hljs-comment"># Scalar filter</span>
filter_expr = <span class="hljs-string">f&#x27;category == &quot;<span class="hljs-subst">{new_prod[<span class="hljs-string">&quot;category&quot;</span>]}</span>&quot; and sales_count &gt; 1500&#x27;</span>

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Dense query: <span class="hljs-subst">{query_dense.shape}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Sparse query: <span class="hljs-subst">{<span class="hljs-built_in">len</span>(query_sparse)}</span> non-zero terms&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Filter: <span class="hljs-subst">{filter_expr}</span>&quot;</span>)

<button class="copy-code-btn"></button></code></pre>
<p>Ausgabe:</p>
<pre><code translate="no"><span class="hljs-title class_">Dense</span> <span class="hljs-attr">query</span>: (<span class="hljs-number">2048</span>,)
<span class="hljs-title class_">Sparse</span> <span class="hljs-attr">query</span>: <span class="hljs-number">6</span> non-zero terms
<span class="hljs-title class_">Filter</span>: category == <span class="hljs-string">&quot;midi_dress&quot;</span> and sales_count &gt; <span class="hljs-number">1500</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Ausführen der hybriden Suche</strong></p>
<p>Die wichtigsten API-Aufrufe hier:</p>
<ul>
<li>AnnSearchRequest erstellt separate Suchanfragen für die dichten und spärlichen Vektorfelder.</li>
<li>expr=filter_expr wendet skalare Filterung innerhalb jeder Suchanfrage an.</li>
<li>RRFRanker(k=60) fusioniert die beiden gerankten Ergebnislisten unter Verwendung des Reciprocal Rank Fusion-Algorithmus.</li>
<li>hybrid_search führt beide Anfragen aus und liefert zusammengeführte, neu bewertete Ergebnisse.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Hybrid search: dense + sparse + scalar filter + RRF reranking</span>
dense_req = AnnSearchRequest(
    data=[query_dense.tolist()],
    anns_field=<span class="hljs-string">&quot;dense_vector&quot;</span>,
    param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
    limit=<span class="hljs-number">20</span>,
    expr=filter_expr,
)
sparse_req = AnnSearchRequest(
    data=[query_sparse],
    anns_field=<span class="hljs-string">&quot;sparse_vector&quot;</span>,
    param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>},
    limit=<span class="hljs-number">20</span>,
    expr=filter_expr,
)

results = milvus_client.hybrid_search(
    collection_name=COLLECTION,
    reqs=[dense_req, sparse_req],
    ranker=RRFRanker(k=<span class="hljs-number">60</span>),
    limit=TOP_K,
    output_fields=[<span class="hljs-string">&quot;product_id&quot;</span>, <span class="hljs-string">&quot;category&quot;</span>, <span class="hljs-string">&quot;color&quot;</span>, <span class="hljs-string">&quot;style&quot;</span>, <span class="hljs-string">&quot;season&quot;</span>,
                   <span class="hljs-string">&quot;sales_count&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>, <span class="hljs-string">&quot;price&quot;</span>],
)

<span class="hljs-comment"># Display retrieved bestsellers</span>
retrieved_products = []
retrieved_images = []
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Top-<span class="hljs-subst">{TOP_K}</span> similar bestsellers:\n&quot;</span>)
<span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
    entity = hit[<span class="hljs-string">&quot;entity&quot;</span>]
    pid = entity[<span class="hljs-string">&quot;product_id&quot;</span>]
    img = Image.<span class="hljs-built_in">open</span>(os.path.join(IMAGE_DIR, <span class="hljs-string">f&quot;<span class="hljs-subst">{pid}</span>.jpg&quot;</span>)).convert(<span class="hljs-string">&quot;RGB&quot;</span>)
    retrieved_products.append(entity)
    retrieved_images.append(img)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{pid}</span> | <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;category&#x27;</span>]}</span> | <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;color&#x27;</span>]}</span> | <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;style&#x27;</span>]}</span> &quot;</span>
          <span class="hljs-string">f&quot;| sales: <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;sales_count&#x27;</span>]}</span> | $<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;price&#x27;</span>]:<span class="hljs-number">.1</span>f}</span> | score: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;description&#x27;</span>]}</span>&quot;</span>)
    display(img.resize((<span class="hljs-number">250</span>, <span class="hljs-built_in">int</span>(<span class="hljs-number">250</span> * img.height / img.width))))
    <span class="hljs-built_in">print</span>()
<button class="copy-code-btn"></button></code></pre>
<p>Ausgabe: die Top 3 der ähnlichsten Bestseller, geordnet nach der verschmolzenen Punktzahl.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-7-Analyze-Bestseller-Style-with-Qwen-35" class="common-anchor-header">Schritt 7: Analysieren des Bestseller-Stils mit Qwen 3.5</h3><p>Wir geben die abgerufenen Bestseller-Bilder in Qwen 3.5 ein und bitten es, ihre gemeinsame visuelle DNA zu extrahieren: Szenenkomposition, Beleuchtungseinstellung, Model-Pose und Gesamtstimmung. Nach dieser Analyse erhalten wir eine Eingabeaufforderung für eine einzige Generation, die wir an Nano Banana 2 weitergeben können.</p>
<pre><code translate="no">content = [
    {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: {<span class="hljs-string">&quot;url&quot;</span>: image_to_uri(img)}}
    <span class="hljs-keyword">for</span> img in retrieved_images
]
content.<span class="hljs-built_in">append</span>({
    <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>,
    <span class="hljs-string">&quot;text&quot;</span>: (
        <span class="hljs-string">&quot;These are our top-selling fashion product photos.\n\n&quot;</span>
        <span class="hljs-string">&quot;Analyze their common visual style in these dimensions:\n&quot;</span>
        <span class="hljs-string">&quot;1. Scene / background setting\n&quot;</span>
        <span class="hljs-string">&quot;2. Lighting and color tone\n&quot;</span>
        <span class="hljs-string">&quot;3. Model pose and framing\n&quot;</span>
        <span class="hljs-string">&quot;4. Overall mood and aesthetic\n\n&quot;</span>
        <span class="hljs-string">&quot;Then, based on this analysis, write ONE concise image generation prompt &quot;</span>
        <span class="hljs-string">&quot;(under 100 words) that captures this style. The prompt should describe &quot;</span>
        <span class="hljs-string">&quot;a scene for a model wearing a new clothing item. &quot;</span>
        <span class="hljs-string">&quot;Output ONLY the prompt, nothing else.&quot;</span>
    ),
})

response = llm.chat.completions.create(
    model=LLM_MODEL,
    messages=[{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: content}],
    max_tokens=<span class="hljs-number">512</span>,
    temperature=<span class="hljs-number">0.7</span>,
)
style_prompt = response.choices[<span class="hljs-number">0</span>].message.content.strip()
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Style prompt from Qwen3.5:\n&quot;</span>)
<span class="hljs-built_in">print</span>(style_prompt)
<button class="copy-code-btn"></button></code></pre>
<p>Beispielhafte Ausgabe:</p>
<pre><code translate="no">Style prompt from Qwen3.5:

Professional full-body fashion photograph of a model wearing a stylish new dress.
Bright, soft high-key lighting that illuminates the subject evenly. Clean,
uncluttered background, either stark white or a softly blurred bright outdoor
setting. The model stands in a relaxed, natural pose to showcase the garment&#x27;s
silhouette and drape. Sharp focus, vibrant colors, fresh and elegant commercial aesthetic.
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-8-Generate-the-Promotional-Image-with-Nano-Banana-2" class="common-anchor-header">Schritt 8: Erzeugen des Werbebildes mit Nano Banana 2</h3><p>Wir geben drei Inputs an Nano Banana 2 weiter: das Flat-Lay-Foto des neuen Produkts, das Bild des bestplatzierten Bestsellers und die im vorherigen Schritt extrahierte Style-Anweisung. Das Modell setzt diese zu einem Werbefoto zusammen, das das neue Kleidungsstück mit einem bewährten visuellen Stil verbindet.</p>
<pre><code translate="no">gen_prompt = (
    <span class="hljs-string">f&quot;I have a new clothing product (Image 1: flat-lay photo) and a reference &quot;</span>
    <span class="hljs-string">f&quot;promotional photo from our bestselling catalog (Image 2).\n\n&quot;</span>
    <span class="hljs-string">f&quot;Generate a professional e-commerce promotional photograph of a female model &quot;</span>
    <span class="hljs-string">f&quot;wearing the clothing from Image 1.\n\n&quot;</span>
    <span class="hljs-string">f&quot;Style guidance: <span class="hljs-subst">{style_prompt}</span>\n\n&quot;</span>
    <span class="hljs-string">f&quot;Scene hint: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;prompt_hint&#x27;</span>]}</span>\n\n&quot;</span>
    <span class="hljs-string">f&quot;Requirements:\n&quot;</span>
    <span class="hljs-string">f&quot;- Full body shot, photorealistic, high quality\n&quot;</span>
    <span class="hljs-string">f&quot;- The clothing should match Image 1 exactly\n&quot;</span>
    <span class="hljs-string">f&quot;- The photo style and mood should match Image 2&quot;</span>
)

gen_content = [
    {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: {<span class="hljs-string">&quot;url&quot;</span>: image_to_uri(new_img)}},
    {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: {<span class="hljs-string">&quot;url&quot;</span>: image_to_uri(retrieved_images[<span class="hljs-number">0</span>])}},
    {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: gen_prompt},
]

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Generating promotional photo with Nano Banana 2...&quot;</span>)
gen_response = llm.chat.completions.create(
    model=IMAGE_GEN_MODEL,
    messages=[{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: gen_content}],
    extra_body={
        <span class="hljs-string">&quot;modalities&quot;</span>: [<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;image&quot;</span>],
        <span class="hljs-string">&quot;image_config&quot;</span>: {<span class="hljs-string">&quot;aspect_ratio&quot;</span>: <span class="hljs-string">&quot;3:4&quot;</span>, <span class="hljs-string">&quot;image_size&quot;</span>: <span class="hljs-string">&quot;2K&quot;</span>},
    },
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Done!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Schlüsselparameter für den Nano Banana 2 API-Aufruf:</p>
<ul>
<li>Modalitäten: [&quot;text&quot;, &quot;image&quot;]: legt fest, dass die Antwort ein Bild enthalten soll.</li>
<li>image_config.aspect_ratio: steuert das Seitenverhältnis der Ausgabe (3:4 eignet sich gut für Porträt-/Modeaufnahmen).</li>
<li>image_config.image_size: legt die Auflösung fest. Nano Banana 2 unterstützt 512px bis 4K.</li>
</ul>
<p>Extrahieren Sie das erzeugte Bild:</p>
<pre><code translate="no">generated_images = extract_images(gen_response)

text_content = gen_response.choices[<span class="hljs-number">0</span>].message.content
<span class="hljs-keyword">if</span> text_content:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Model response: <span class="hljs-subst">{text_content[:<span class="hljs-number">300</span>]}</span>\n&quot;</span>)

<span class="hljs-keyword">if</span> generated_images:
    <span class="hljs-keyword">for</span> i, img <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(generated_images):
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;--- Generated promo photo <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span> ---&quot;</span>)
        display(img)
        img.save(<span class="hljs-string">f&quot;promo_<span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;new_id&#x27;</span>]}</span>_<span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>.png&quot;</span>)
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Saved: promo_<span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;new_id&#x27;</span>]}</span>_<span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>.png&quot;</span>)
<span class="hljs-keyword">else</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;No image generated. Raw response:&quot;</span>)
    <span class="hljs-built_in">print</span>(gen_response.model_dump())
<button class="copy-code-btn"></button></code></pre>
<p>Ausgabe:  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-9-Side-by-Side-Comparison" class="common-anchor-header">Schritt 9: Seite-an-Seite-Vergleich</h3><p>Die Ausgabe trifft den Nagel auf den Kopf: Die Beleuchtung ist weich und gleichmäßig, die Pose des Models sieht natürlich aus, und die Stimmung entspricht der Bestseller-Referenz.</p>
<p>Die Schwachstelle ist die Überblendung der Kleidungsstücke. Die Strickjacke sieht aus, als wäre sie auf das Modell geklebt und nicht getragen worden, und ein weißes Etikett am Halsausschnitt blutet durch. Die Single-Pass-Generierung hat mit dieser Art von feinkörniger Kleidungs-Körper-Integration zu kämpfen, weshalb wir in der Zusammenfassung auf Umgehungsmöglichkeiten eingehen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image10.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-10-Batch-Generation-for-All-New-Products" class="common-anchor-header">Schritt 10: Stapelgenerierung für alle neuen Produkte</h3><p>Wir fassen die gesamte Pipeline in einer einzigen Funktion zusammen und führen sie für die übrigen neuen Produkte aus. Der Batch-Code wird hier der Kürze halber weggelassen; wenden Sie sich an uns, wenn Sie die vollständige Implementierung benötigen.</p>
<p>Bei den Batch-Ergebnissen stechen zwei Dinge hervor. Die Style Prompts, die wir von <strong>Qwen 3.5</strong> erhalten, passen sich je nach Produkt sinnvoll an: Ein Sommerkleid und ein Winterstrickkleid erhalten wirklich unterschiedliche Szenenbeschreibungen, die auf die Jahreszeit, den Anwendungsfall und die Accessoires zugeschnitten sind. Die Bilder, die wir von <strong>Nano Banana 2</strong> erhalten, können sich in Sachen Beleuchtung, Textur und Komposition mit echten Studioaufnahmen messen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Conclusion" class="common-anchor-header">Fazit<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>In diesem Artikel haben wir uns damit beschäftigt, was Nano Banana 2 für die Bilderzeugung im E-Commerce bringt, haben es mit dem originalen Nano Banana und Pro bei realen Produktionsaufgaben verglichen und sind durchgegangen, wie man mit Milvus, Qwen 3.5 und Nano Banana 2 eine Pipeline von Bestsellern zu Bildern erstellt.</p>
<p>Diese Pipeline hat vier praktische Vorteile:</p>
<ul>
<li><strong>Kontrollierte Kosten, vorhersehbare Budgets.</strong> Das Einbettungsmodell (Llama Nemotron Embed VL 1B v2) ist auf OpenRouter kostenlos. Nano Banana 2 kostet pro Bild nur etwa halb so viel wie Pro, und bei der nativen Ausgabe in mehreren Formaten entfallen die Nachbearbeitungszyklen, die früher die effektiven Kosten verdoppelten oder verdreifachten. Für E-Commerce-Teams, die Tausende von Artikeln pro Saison verwalten, bedeutet diese Vorhersehbarkeit, dass die Bildproduktion mit dem Katalog mitwächst, anstatt das Budget zu sprengen.</li>
<li><strong>Durchgängige Automatisierung, kürzere Zeit bis zur Listung.</strong> Der Fluss vom flachen Produktfoto bis zum fertigen Werbebild läuft ohne manuelle Eingriffe ab. Ein neues Produkt kann innerhalb von Minuten statt Tagen vom Lagerfoto zum vermarktungsfähigen Listungsbild übergehen, was vor allem in der Hochsaison wichtig ist, wenn der Katalogumsatz am höchsten ist.</li>
<li><strong>Keine lokale GPU erforderlich, niedrigere Einstiegshürde.</strong> Jedes Modell läuft über die OpenRouter-API. Ein Team ohne ML-Infrastruktur und ohne eigenes technisches Personal kann diese Pipeline von einem Laptop aus betreiben. Es muss nichts bereitgestellt oder gewartet werden, und es gibt keine Vorabinvestitionen in Hardware.</li>
<li><strong>Höhere Abrufpräzision, stärkere Markenkonsistenz.</strong> Milvus kombiniert dichte, spärliche und skalare Filterung in einer einzigen Abfrage und übertrifft damit durchweg Einzelvektoransätze für den Produktabgleich. In der Praxis bedeutet dies, dass die generierten Bilder zuverlässiger die etablierte visuelle Sprache Ihrer Marke übernehmen: die Beleuchtung, die Komposition und das Styling, mit denen Ihre bestehenden Bestseller bereits überzeugen. Das Ergebnis sieht so aus, wie es in Ihren Shop gehört, und nicht wie generische KI-Bilder.</li>
</ul>
<p>Es gibt auch Einschränkungen, über die man sich im Klaren sein sollte:</p>
<ul>
<li><strong>Überblendung von Kleidungsstücken mit dem Körper.</strong> Bei der Erstellung in einem Durchgang kann die Kleidung eher zusammengesetzt als getragen aussehen. Feine Details wie kleine Accessoires verschwimmen manchmal. Abhilfe: Generieren Sie in mehreren Schritten (erst Hintergrund, dann Modellpose, dann Composite). Dieser Multi-Pass-Ansatz gibt jedem Schritt einen engeren Rahmen und verbessert die Qualität der Überblendung erheblich.</li>
<li><strong>Detailtreue in Randbereichen.</strong> Accessoires, Muster und textlastige Layouts können an Schärfe verlieren. Abhilfe: Fügen Sie der Generierungsaufforderung explizite Einschränkungen hinzu ("Kleidung passt natürlich am Körper, keine freiliegenden Etiketten, keine zusätzlichen Elemente, Produktdetails sind scharf"). Wenn die Qualität bei einem bestimmten Produkt immer noch zu wünschen übrig lässt, wechseln Sie für die endgültige Erstellung zu Nano Banana Pro.</li>
</ul>
<p><a href="https://milvus.io/">Milvus</a> ist die Open-Source-Vektordatenbank, die den hybriden Suchschritt antreibt. Wenn Sie ein wenig herumstöbern oder versuchen möchten, Ihre eigenen Produktfotos einzutauschen, dauert der <a href="https://milvus.io/docs"></a><a href="https://milvus.io/docs">Schnellstart</a> etwa zehn Minuten. Wir haben eine ziemlich aktive Community auf <a href="https://discord.gg/milvus"></a><a href="https://discord.gg/milvus">Discord</a> und Slack, und wir würden gerne sehen, was die Leute damit bauen. Und wenn Sie Nano Banana 2 gegen ein anderes Produkt oder einen größeren Katalog einsetzen, teilen Sie uns bitte die Ergebnisse mit! Wir würden uns freuen, von ihnen zu hören.</p>
<h2 id="Keep-Reading" class="common-anchor-header">Lesen Sie weiter<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
<li><a href="https://milvus.io/blog/nano-banana-milvus-turning-hype-into-enterprise-ready-multimodal-rag.md">Nano Banana + Milvus: Aus dem Hype wird ein unternehmenstauglicher multimodaler RAG</a></li>
<li><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">Was ist OpenClaw? Vollständiger Leitfaden für den Open-Source-KI-Agenten</a></li>
<li><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">OpenClaw-Tutorial: Verbindung zu Slack für lokalen KI-Assistenten</a></li>
<li><a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">Wir haben das Speichersystem von OpenClaw extrahiert und als Open-Source bereitgestellt (memsearch)</a></li>
<li><a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">Persistenter Speicher für Claude Code: memsearch ccplugin</a></li>
</ul>
