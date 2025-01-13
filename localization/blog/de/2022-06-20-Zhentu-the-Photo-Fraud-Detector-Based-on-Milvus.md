---
id: 2022-06-20-Zhentu-the-Photo-Fraud-Detector-Based-on-Milvus.md
title: Zhentu - der auf Milvus basierende Fotobetrugsdetektor
author: 'Yan Shi, Minwei Tang'
date: 2022-06-20T00:00:00.000Z
desc: >-
  Wie ist das Erkennungssystem von Zhentu mit Milvus als Vektorsuchmaschine
  aufgebaut?
cover: assets.zilliz.com/zhentu_0ae11c98ee.png
tag: Scenarios
tags: Use Cases of Milvus
canonicalUrl: >-
  https://milvus.io/blog/2022-06-20-Zhentu-the-Photo-Fraud-Detector-Based-on-Milvus.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/zhentu_0ae11c98ee.png" alt="cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Titelbild</span> </span></p>
<blockquote>
<p>Dieser Artikel wurde von Yan Shi und Minwei Tang, Senior Algorithm Engineers bei BestPay, geschrieben und von <a href="https://www.linkedin.cn/incareer/in/rosie-zhang-694528149">Rosie Zhang</a> übersetzt.</p>
</blockquote>
<p>In den letzten Jahren, als E-Commerce und Online-Transaktionen in der ganzen Welt alltäglich wurden, florierte auch der E-Commerce-Betrug. Durch die Verwendung von computergenerierten Fotos anstelle echter Fotos zur Identitätsprüfung auf Online-Geschäftsplattformen erstellen Betrüger massenhaft gefälschte Konten und profitieren von den Sonderangeboten der Unternehmen (z. B. Mitgliedsgeschenke, Gutscheine, Token), was sowohl den Verbrauchern als auch den Unternehmen unwiederbringliche Verluste beschert.</p>
<p>Herkömmliche Methoden der Risikokontrolle sind angesichts der großen Datenmengen nicht mehr wirksam. Um das Problem zu lösen, hat <a href="https://www.bestpay.com.cn">BestPay</a> einen Fotobetrugsdetektor namens Zhentu (was auf Chinesisch "Bilder erkennen" bedeutet) entwickelt, der auf Deep Learning (DL) und digitalen Bildverarbeitungstechnologien (DIP) basiert. Zhentu kann in verschiedenen Szenarien der Bilderkennung eingesetzt werden, wobei ein wichtiger Nebeneffekt die Identifizierung von gefälschten Geschäftslizenzen ist. Wenn das von einem Nutzer eingereichte Foto einer Geschäftslizenz einem anderen, bereits in der Fotobibliothek einer Plattform vorhandenen Foto sehr ähnlich ist, ist es wahrscheinlich, dass der Nutzer das Foto irgendwo gestohlen oder eine Lizenz zu betrügerischen Zwecken gefälscht hat.</p>
<p>Herkömmliche Algorithmen zur Messung der Bildähnlichkeit, wie <a href="https://en.wikipedia.org/wiki/Peak_signal-to-noise_ratio">PSNR</a> und ORB, sind langsam und ungenau und nur für Offline-Aufgaben geeignet. Deep Learning hingegen ist in der Lage, große Bilddatenmengen in Echtzeit zu verarbeiten und ist die ultimative Methode für den Abgleich ähnlicher Bilder. Mit den gemeinsamen Bemühungen des Forschungs- und Entwicklungsteams von BestPay und <a href="https://milvus.io/">der Milvus-Community</a> wurde als Teil von Zhentu ein System zur Erkennung von Fotobetrug entwickelt. Es funktioniert, indem es riesige Mengen von Bilddaten mit Hilfe von Deep-Learning-Modellen in Merkmalsvektoren umwandelt und diese in <a href="https://milvus.io/">Milvus</a>, eine Vektorsuchmaschine, einfügt. Mit Milvus ist das Erkennungssystem in der Lage, Billionen von Vektoren zu indizieren und ähnliche Fotos unter mehreren Millionen Bildern effizient zu finden.</p>
<p><strong>Springe zu:</strong></p>
<ul>
<li><a href="#an-overview-of-zhentu">Ein Überblick über Zhentu</a></li>
<li><a href="#system-structure">Aufbau des Systems</a></li>
<li><a href="#deployment"><strong>Einsatz</strong></a></li>
<li><a href="#real-world-performance"><strong>Leistung in der realen Welt</strong></a></li>
<li><a href="#reference"><strong>Referenz</strong></a></li>
<li><a href="#about-bestpay"><strong>Über BestPay</strong></a></li>
</ul>
<h2 id="An-overview-of-Zhentu" class="common-anchor-header">Ein Überblick über Zhentu<button data-href="#An-overview-of-Zhentu" class="anchor-icon" translate="no">
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
    </button></h2><p>Zhentu ist ein von BestPay selbst entwickeltes multimediales Produkt zur visuellen Risikokontrolle, das tief in Technologien für maschinelles Lernen (ML) und neuronale Netze zur Bilderkennung integriert ist. Sein integrierter Algorithmus kann Betrüger während der Benutzerauthentifizierung genau identifizieren und auf Millisekunden-Ebene reagieren. Mit seiner branchenführenden Technologie und innovativen Lösung hat Zhentu fünf Patente und zwei Software-Urheberrechte erhalten. Es wird jetzt in einer Reihe von Banken und Finanzinstituten eingesetzt, um potenzielle Risiken im Voraus zu erkennen.</p>
<h2 id="System-structure" class="common-anchor-header">Aufbau des Systems<button data-href="#System-structure" class="anchor-icon" translate="no">
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
    </button></h2><p>BestPay verfügt derzeit über mehr als 10 Millionen Fotos von Geschäftslizenzen, und das tatsächliche Volumen wächst mit dem Wachstum des Unternehmens weiter exponentiell an. Um schnell ähnliche Fotos aus einer so großen Datenbank abrufen zu können, hat Zhentu Milvus als Engine zur Berechnung der Ähnlichkeit von Merkmalsvektoren gewählt. Die allgemeine Struktur des Systems zur Erkennung von Fotofälschungen ist im folgenden Diagramm dargestellt.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Structure_of_the_photo_fraud_detection_system_cf5d20d431.png" alt="img" class="doc-image" id="img" />
   </span> <span class="img-wrapper"> <span>img</span> </span></p>
<p>Das Verfahren kann in vier Schritte unterteilt werden:</p>
<ol>
<li><p>Vorverarbeitung des Bildes. Die Vorverarbeitung, einschließlich Rauschunterdrückung, Rauschentfernung und Kontrastverbesserung, gewährleistet sowohl die Integrität der ursprünglichen Informationen als auch die Entfernung von unbrauchbaren Informationen aus dem Bildsignal.</p></li>
<li><p>Extraktion von Merkmalsvektoren. Ein speziell trainiertes Deep-Learning-Modell wird verwendet, um die Merkmalsvektoren des Bildes zu extrahieren. Die Umwandlung von Bildern in Vektoren für die weitere Ähnlichkeitssuche ist ein Routinevorgang.</p></li>
<li><p>Normalisierung. Die Normalisierung der extrahierten Merkmalsvektoren trägt zur Verbesserung der Effizienz der nachfolgenden Verarbeitung bei.</p></li>
<li><p>Vektorsuche mit Milvus. Einfügen der normalisierten Merkmalsvektoren in die Milvus-Datenbank für die vektorielle Ähnlichkeitssuche.</p></li>
</ol>
<h2 id="Deployment" class="common-anchor-header"><strong>Einsatz</strong><button data-href="#Deployment" class="anchor-icon" translate="no">
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
    </button></h2><p>Im Folgenden wird kurz beschrieben, wie das Zhentu-System zur Erkennung von Fotobetrug eingesetzt wird.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_architecture_ea45a5ab53.png" alt="Milvus system architecture" class="doc-image" id="milvus-system-architecture" />
   </span> <span class="img-wrapper"> <span>Milvus-Systemarchitektur</span> </span></p>
<p>Wir haben unseren <a href="https://milvus.io/docs/v2.0.x/install_cluster-helm.md">Milvus-Cluster auf Kubernetes</a> implementiert, um eine hohe Verfügbarkeit und Echtzeitsynchronisation der Cloud-Dienste zu gewährleisten. Die allgemeinen Schritte sind wie folgt:</p>
<ol>
<li><p>Verfügbare Ressourcen anzeigen. Führen Sie den Befehl <code translate="no">kubectl describe nodes</code> aus, um die Ressourcen zu sehen, die der Kubernetes-Cluster den erstellten Fällen zuweisen kann.</p></li>
<li><p>Zuweisen von Ressourcen. Führen Sie den Befehl <code translate="no">kubect`` -- apply xxx.yaml</code> aus, um Speicher- und CPU-Ressourcen für Milvus-Cluster-Komponenten mit Helm zuzuweisen.</p></li>
<li><p>Wenden Sie die neue Konfiguration an. Führen Sie den Befehl <code translate="no">helm upgrade my-release milvus/milvus --reuse-values -fresources.yaml</code> aus.</p></li>
<li><p>Wenden Sie die neue Konfiguration auf den Milvus-Cluster an. Der auf diese Weise bereitgestellte Cluster ermöglicht nicht nur die Anpassung der Systemkapazität an unterschiedliche Geschäftsanforderungen, sondern erfüllt auch besser die Hochleistungsanforderungen für die Abfrage massiver Vektordaten.</p></li>
</ol>
<p>Sie können <a href="https://milvus.io/docs/v2.0.x/configure-docker.md">Milvus</a> so <a href="https://milvus.io/docs/v2.0.x/configure-docker.md">konfigurieren</a>, dass die Suchleistung für verschiedene Datentypen aus unterschiedlichen Geschäftsszenarien optimiert wird, wie die beiden folgenden Beispiele zeigen.</p>
<p>Beim <a href="https://milvus.io/docs/v2.0.x/build_index.md">Aufbau des Vektorindexes</a> parametrisieren wir den Index entsprechend dem tatsächlichen Szenario des Systems wie folgt:</p>
<pre><code translate="no" class="language-Python">index = {<span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;IVF_PQ&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">2048</span>}, <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>}
<button class="copy-code-btn"></button></code></pre>
<p><a href="https://milvus.io/docs/v2.0.x/index.md#IVF_PQ">IVF_PQ</a> führt ein IVF-Indexclustering durch, bevor das Produkt der Vektoren quantisiert wird. Er zeichnet sich durch eine schnelle Plattenabfrage und einen sehr geringen Speicherverbrauch aus, was den Anforderungen der realen Anwendung von Zhentu entspricht.</p>
<p>Außerdem legen wir die optimalen Suchparameter wie folgt fest:</p>
<pre><code translate="no" class="language-Python">search_params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">32</span>}}
<button class="copy-code-btn"></button></code></pre>
<p>Da die Vektoren bereits vor der Eingabe in Milvus normalisiert werden, wird das innere Produkt (IP) gewählt, um den Abstand zwischen zwei Vektoren zu berechnen. Experimente haben gezeigt, dass die Wiederfindungsrate mit IP um etwa 15% höher ist als mit dem euklidischen Abstand (L2).</p>
<p>Die obigen Beispiele zeigen, dass wir die Parameter von Milvus entsprechend den verschiedenen Geschäftsszenarien und Leistungsanforderungen testen und einstellen können.</p>
<p>Darüber hinaus integriert Milvus nicht nur verschiedene Indexbibliotheken, sondern unterstützt auch verschiedene Indextypen und Ähnlichkeitsberechnungsmethoden. Milvus bietet auch offizielle SDKs in mehreren Sprachen und umfangreiche APIs für das Einfügen, Abfragen usw., so dass unsere Front-End-Geschäftsgruppen die SDKs nutzen können, um das Risikokontrollzentrum aufzurufen.</p>
<h2 id="Real-world-performance" class="common-anchor-header"><strong>Leistung in der realen Welt</strong><button data-href="#Real-world-performance" class="anchor-icon" translate="no">
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
    </button></h2><p>Bislang läuft das System zur Erkennung von Fotobetrug stabil und hilft Unternehmen, potenzielle Betrüger zu identifizieren. Im Jahr 2021 wurden über 20 000 gefälschte Führerscheine entdeckt. Was die Abfragegeschwindigkeit angeht, so dauert eine einzelne Vektorabfrage unter mehreren Millionen Vektoren weniger als 1 Sekunde, und die durchschnittliche Zeit für eine Batch-Abfrage beträgt weniger als 0,08 Sekunden. Die Hochleistungssuche von Milvus erfüllt die Anforderungen von Unternehmen an Genauigkeit und Gleichzeitigkeit gleichermaßen.</p>
<h2 id="Reference" class="common-anchor-header"><strong>Referenz</strong><button data-href="#Reference" class="anchor-icon" translate="no">
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
    </button></h2><p>Aglave P, Kolkure V S. Implementation of High Performance Feature Extraction Method Using Oriented Fast and Rotated Brief Algorithm[J]. Int. J. Res. Eng. Technol, 2015, 4: 394-397.</p>
<h2 id="About-BestPay" class="common-anchor-header"><strong>Über BestPay</strong><button data-href="#About-BestPay" class="anchor-icon" translate="no">
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
    </button></h2><p>China Telecom BestPay Co. Ltd. ist eine hundertprozentige Tochtergesellschaft von China Telecom. Sie betreibt das Zahlungs- und Finanzgeschäft. BestPay ist bestrebt, Spitzentechnologien wie Big Data, künstliche Intelligenz und Cloud Computing zu nutzen, um Geschäftsinnovationen zu fördern und intelligente Produkte, Lösungen zur Risikokontrolle und andere Dienstleistungen anzubieten. Bis Januar 2016 hat die App namens BestPay über 200 Millionen Nutzer angezogen und ist zum drittgrößten Zahlungsplattformbetreiber in China geworden, dicht nach Alipay und WeChat Payment.</p>
