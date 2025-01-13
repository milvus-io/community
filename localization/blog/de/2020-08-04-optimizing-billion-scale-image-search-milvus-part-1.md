---
id: optimizing-billion-scale-image-search-milvus-part-1.md
title: Überblick
author: Rife Wang
date: 2020-08-04T20:39:09.882Z
desc: >-
  Eine Fallstudie mit UPYUN. Erfahren Sie, wie sich Milvus von herkömmlichen
  Datenbanklösungen abhebt und dabei hilft, ein System zur Suche nach
  Bildähnlichkeiten aufzubauen.
cover: assets.zilliz.com/header_23bbd76c8b.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/optimizing-billion-scale-image-search-milvus-part-1'
---
<custom-h1>Die Reise zur Optimierung der milliardenfachen Bildersuche (1/2)</custom-h1><p>Der Yupoo Picture Manager bedient mehrere Millionen Nutzer und verwaltet mehrere Milliarden Bilder. Da die Benutzergalerie immer größer wird, benötigt Yupoo dringend eine Lösung, die das Bild schnell auffinden kann. Mit anderen Worten: Wenn ein Benutzer ein Bild eingibt, sollte das System das Originalbild und ähnliche Bilder in der Galerie finden. Die Entwicklung des Dienstes "Suche nach Bildern" bietet einen effektiven Ansatz für dieses Problem.</p>
<p>Die Suche nach Bildern hat zwei Entwicklungen durchlaufen:</p>
<ol>
<li>Anfang 2019 begann die erste technische Untersuchung und im März und April 2019 wurde das System der ersten Generation eingeführt;</li>
<li>Anfang 2020 wurde mit der Untersuchung des Aufrüstungsplans begonnen, und im April 2020 wurde die Gesamtaufrüstung zum System der zweiten Generation in Angriff genommen.</li>
</ol>
<p>In diesem Artikel werden die Technologieauswahl und die Grundprinzipien der beiden Generationen des Systems für die Suche nach Bildern auf der Grundlage meiner eigenen Erfahrungen mit diesem Projekt beschrieben.</p>
<h2 id="Overview" class="common-anchor-header">Überblick<button data-href="#Overview" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="What-is-an-image" class="common-anchor-header">Was ist ein Bild?</h3><p>Bevor wir uns mit Bildern beschäftigen, müssen wir wissen, was ein Bild ist.</p>
<p>Die Antwort ist, dass ein Bild eine Sammlung von Pixeln ist.</p>
<p>Der Teil in dem roten Kasten auf diesem Bild zum Beispiel ist praktisch eine Reihe von Pixeln.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_what_is_an_image_021e0280cc.png" alt="1-what-is-an-image.png" class="doc-image" id="1-what-is-an-image.png" />
   </span> <span class="img-wrapper"> <span>1-was-ist-ein-bild.png</span> </span></p>
<p>Angenommen, der Teil im roten Kasten ist ein Bild, dann ist jedes unabhängige kleine Quadrat im Bild ein Pixel, die grundlegende Informationseinheit. Dann ist die Größe des Bildes 11 x 11 px.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_what_is_an_image_602a91b4a0.png" alt="2-what-is-an-image.png" class="doc-image" id="2-what-is-an-image.png" />
   </span> <span class="img-wrapper"> <span>2-was-ist-ein-bild.png</span> </span></p>
<h3 id="Mathematical-representation-of-images" class="common-anchor-header">Mathematische Darstellung von Bildern</h3><p>Jedes Bild kann durch eine Matrix dargestellt werden. Jedes Pixel des Bildes entspricht einem Element in dieser Matrix.</p>
<h3 id="Binary-images" class="common-anchor-header">Binäre Bilder</h3><p>Die Pixel eines binären Bildes sind entweder schwarz oder weiß, d. h. jedes Pixel kann durch 0 oder 1 dargestellt werden. Die Matrixdarstellung eines binären 4*4-Bildes ist zum Beispiel so:</p>
<pre><code translate="no">0 1 0 1
1 0 0 0
1 1 1 0
0 0 1 0
</code></pre>
<h3 id="RGB-images" class="common-anchor-header">RGB-Bilder</h3><p>Die drei Grundfarben (Rot, Grün und Blau) können gemischt werden, um eine beliebige Farbe zu erzeugen. Bei RGB-Bildern verfügt jedes Pixel über die Grundinformationen von drei RGB-Kanälen. Wenn jeder Kanal eine 8-Bit-Zahl (in 256 Stufen) verwendet, um seine Grauskala darzustellen, lautet die mathematische Darstellung eines Pixels wie folgt:</p>
<pre><code translate="no">([0 .. 255], [0 .. 255], [0 .. 255])
</code></pre>
<p>Nehmen wir ein 4 * 4 RGB-Bild als Beispiel:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_4_x_4_rgb_image_136cec77ce.png" alt="3-4-x-4-rgb-image.png" class="doc-image" id="3-4-x-4-rgb-image.png" />
   </span> <span class="img-wrapper"> <span>3-4-x-4-rgb-image.png</span> </span></p>
<p>Das Wesen der Bildverarbeitung besteht darin, diese Pixelmatrizen zu verarbeiten.</p>
<h2 id="The-technical-problem-of-search-by-image" class="common-anchor-header">Das technische Problem der Suche nach einem Bild<button data-href="#The-technical-problem-of-search-by-image" class="anchor-icon" translate="no">
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
    </button></h2><p>Wenn Sie das Originalbild suchen, d. h. ein Bild mit genau denselben Pixeln, können Sie deren MD5-Werte direkt vergleichen. Bilder, die ins Internet hochgeladen werden, sind jedoch oft komprimiert oder mit Wasserzeichen versehen. Schon eine kleine Änderung in einem Bild kann zu einem anderen MD5-Ergebnis führen. Solange es Inkonsistenzen bei den Pixeln gibt, ist es unmöglich, das Originalbild zu finden.</p>
<p>Bei einem System, das nach Bildern sucht, wollen wir nach Bildern mit ähnlichem Inhalt suchen. Dazu müssen wir zwei grundlegende Probleme lösen:</p>
<ul>
<li>Darstellung oder Abstraktion eines Bildes in einem Datenformat, das von einem Computer verarbeitet werden kann.</li>
<li>Die Daten müssen für Berechnungen vergleichbar sein.</li>
</ul>
<p>Genauer gesagt benötigen wir die folgenden Merkmale:</p>
<ul>
<li>Extraktion von Bildmerkmalen.</li>
<li>Merkmalsberechnung (Ähnlichkeitsberechnung).</li>
</ul>
<h2 id="The-first-generation-search-by-image-system" class="common-anchor-header">Das System der ersten Generation für die Suche nach Bildern<button data-href="#The-first-generation-search-by-image-system" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Feature-extraction--image-abstraction" class="common-anchor-header">Merkmalsextraktion - Bildabstraktion</h3><p>Das Bildsuchsystem der ersten Generation verwendet zur Merkmalsextraktion den Wahrnehmungshash- oder pHash-Algorithmus. Was sind die Grundlagen dieses Algorithmus?</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_first_generation_image_search_ffd7088158.png" alt="4-first-generation-image-search.png" class="doc-image" id="4-first-generation-image-search.png" />
   </span> <span class="img-wrapper"> <span>4-erste-generation-bild-suche.png</span> </span></p>
<p>Wie in der Abbildung oben dargestellt, führt der pHash-Algorithmus eine Reihe von Transformationen am Bild durch, um den Hash-Wert zu erhalten. Während des Transformationsprozesses abstrahiert der Algorithmus kontinuierlich Bilder, wodurch sich die Ergebnisse ähnlicher Bilder einander annähern.</p>
<h3 id="Feature-calculation--similarity-calculation" class="common-anchor-header">Merkmalsberechnung - Ähnlichkeitsberechnung</h3><p>Wie berechnet man die Ähnlichkeit zwischen den pHash-Werten zweier Bilder? Die Antwort ist die Verwendung der Hamming-Distanz. Je kleiner der Hamming-Abstand ist, desto ähnlicher ist der Inhalt der Bilder.</p>
<p>Was ist die Hamming-Distanz? Es ist die Anzahl der unterschiedlichen Bits.</p>
<p>Ein Beispiel,</p>
<pre><code translate="no">Value 1： 0 1 0 1 0
Value 2： 0 0 0 1 1
</code></pre>
<p>Die beiden obigen Werte enthalten zwei unterschiedliche Bits, so dass der Hamming-Abstand zwischen ihnen 2 beträgt.</p>
<p>Jetzt kennen wir das Prinzip der Ähnlichkeitsberechnung. Die nächste Frage ist, wie man die Hamming-Distanzen von 100 Millionen Daten aus 100 Millionen Bildern berechnen kann. Kurz gesagt, wie kann man nach ähnlichen Bildern suchen?</p>
<p>In der Anfangsphase des Projekts fand ich kein befriedigendes Werkzeug (oder eine Rechenmaschine), das die Hamming-Distanz schnell berechnen kann. Also habe ich meinen Plan geändert.</p>
<p>Meine Idee ist, dass, wenn der Hamming-Abstand zwischen zwei pHash-Werten klein ist, ich die pHash-Werte schneiden kann und die entsprechenden kleinen Teile wahrscheinlich gleich sind.</p>
<p>Ein Beispiel:</p>
<pre><code translate="no">Value 1： 8 a 0 3 0 3 f 6
Value 2： 8 a 0 3 0 3 d 8
</code></pre>
<p>Wir teilen die beiden obigen Werte in acht Segmente und die Werte von sechs Segmenten sind genau gleich. Daraus lässt sich schließen, dass die Hamming-Distanz nahe beieinander liegt und die beiden Bilder somit ähnlich sind.</p>
<p>Nach der Umwandlung wird aus dem Problem der Berechnung der Hamming-Distanz ein Problem der Gleichwertigkeit. Wenn ich jeden pHash-Wert in acht Segmente unterteile, sind die beiden pHash-Werte ähnlich, solange es mehr als fünf Segmente gibt, die genau die gleichen Werte haben.</p>
<p>Es ist also sehr einfach, die Äquivalenzsuche zu lösen. Wir können die klassische Filterung eines herkömmlichen Datenbanksystems verwenden.</p>
<p>Natürlich verwende ich das Multi-Term-Matching und spezifiziere den Grad der Übereinstimmung mit minimum_should_match in ElasticSearch (dieser Artikel stellt das Prinzip von ES nicht vor, Sie können es selbst lernen).</p>
<p>Warum wählen wir ElasticSearch? Erstens, weil es die oben erwähnte Suchfunktion bietet. Zweitens verwendet das Bildmanager-Projekt selbst ES, um eine Volltextsuchfunktion bereitzustellen, und es ist sehr wirtschaftlich, die vorhandenen Ressourcen zu nutzen.</p>
<h2 id="Summary-of-the-first-generation-system" class="common-anchor-header">Zusammenfassung des Systems der ersten Generation<button data-href="#Summary-of-the-first-generation-system" class="anchor-icon" translate="no">
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
    </button></h2><p>Das System der ersten Generation für die Suche nach Bildern wählt die Lösung pHash + ElasticSearch, die die folgenden Eigenschaften aufweist:</p>
<ul>
<li>Der pHash-Algorithmus ist einfach zu verwenden und kann einem gewissen Grad an Kompression, Wasserzeichen und Rauschen widerstehen.</li>
<li>ElasticSearch nutzt die vorhandenen Ressourcen des Projekts, ohne zusätzliche Kosten für die Suche zu verursachen.</li>
<li>Die Einschränkung dieses Systems ist jedoch offensichtlich: Der pHash-Algorithmus ist eine abstrakte Darstellung des gesamten Bildes. Sobald wir die Integrität des Bildes zerstören, z. B. indem wir dem Originalbild einen schwarzen Rand hinzufügen, ist es fast unmöglich, die Ähnlichkeit zwischen dem Original und den anderen Bildern zu beurteilen.</li>
</ul>
<p>Um solche Beschränkungen zu überwinden, wurde das Bildsuchsystem der zweiten Generation entwickelt, das auf einer völlig anderen Technologie basiert.</p>
<p>Dieser Artikel wurde von rifewang, Milvus-Benutzer und Softwareentwickler bei UPYUN, geschrieben. Wenn Ihnen dieser Artikel gefällt, können Sie gerne vorbeikommen und Hallo sagen! https://github.com/rifewang</p>
