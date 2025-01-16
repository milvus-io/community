---
id: >-
  2021-12-10-image-based-trademark-similarity-search-system-a-smarter-solution-to-ip-protection.md
title: >-
  Milvus in IP Protection：Building a Trademark Similarity Search System with
  Milvus
author: Zilliz
date: 2021-12-10T00:00:00.000Z
desc: >-
  Erfahren Sie, wie Sie die Vektorähnlichkeitssuche in der Branche des
  gewerblichen Rechtsschutzes anwenden können.
cover: assets.zilliz.com/IP_protection_0a33547579.png
tag: Scenarios
---
<p>In den letzten Jahren ist die Frage des Schutzes von geistigem Eigentum ins Rampenlicht gerückt, da das Bewusstsein der Menschen für die Verletzung von geistigem Eigentum immer größer wird. Vor allem der multinationale Technologieriese Apple Inc. hat aktiv <a href="https://en.wikipedia.org/wiki/Apple_Inc._litigation">Klagen gegen verschiedene Unternehmen wegen der Verletzung von geistigem Eigentum eingereicht</a>, darunter Marken-, Patent- und Geschmacksmusterverletzungen. Abgesehen von diesen berüchtigten Fällen hat Apple Inc. im Jahr 2009 auch <a href="https://www.smh.com.au/business/apple-bites-over-woolworths-logo-20091005-ghzr.html">eine Markenanmeldung der</a> australischen Supermarktkette <a href="https://www.smh.com.au/business/apple-bites-over-woolworths-logo-20091005-ghzr.html">Woolworths Limited</a> wegen Markenrechtsverletzung <a href="https://www.smh.com.au/business/apple-bites-over-woolworths-logo-20091005-ghzr.html">angefochten</a>.  Apple. Inc. argumentierte, dass das Logo der australischen Marke, ein stilisiertes &quot;w&quot;, dem eigenen Logo, einem Apfel, ähnelt. Daher erhob Apple Inc. Einspruch gegen die Produktpalette, einschließlich elektronischer Geräte, die Woolworths mit diesem Logo verkaufen wollte. Die Geschichte endet damit, dass Woolworths sein Logo abändert und Apple seinen Einspruch zurückzieht.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Logo_of_Woolworths_b04ece5b20.png" alt="Logo of Woolworths.png" class="doc-image" id="logo-of-woolworths.png" />
   </span> <span class="img-wrapper"> <span>Logo von Woolworths.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Logo_of_Apple_Inc_181e5bd5f8.png" alt="Logo of Apple Inc.png" class="doc-image" id="logo-of-apple-inc.png" />
   </span> <span class="img-wrapper"> <span>Logo von Apple Inc.png</span> </span></p>
<p>Mit dem zunehmenden Bewusstsein für Markenkultur achten die Unternehmen immer genauer auf alle Bedrohungen, die ihre Rechte an geistigem Eigentum (IP) verletzen könnten. Die Verletzung geistigen Eigentums umfasst:</p>
<ul>
<li>Verletzung des Urheberrechts</li>
<li>Patentverletzungen</li>
<li>Verletzung von Markenrechten</li>
<li>Verletzung von Geschmacksmustern</li>
<li>Cybersquatting</li>
</ul>
<p>Bei dem oben erwähnten Streit zwischen Apple und Woolworths geht es hauptsächlich um Markenrechtsverletzungen, genauer gesagt um die Ähnlichkeit der Markenbilder der beiden Unternehmen. Um nicht zu einem weiteren Woolworths zu werden, ist eine umfassende Markenähnlichkeitsrecherche ein entscheidender Schritt für Anmelder sowohl vor der Einreichung als auch während der Prüfung von Markenanmeldungen. Die gängigste Methode ist eine Suche in der <a href="https://tmsearch.uspto.gov/search/search-information">Datenbank des United States Patent and Trademark Office (USPTO</a> ), die alle aktiven und inaktiven Markeneintragungen und -anmeldungen enthält. Trotz der nicht sehr ansprechenden Benutzeroberfläche ist auch dieser Suchprozess aufgrund seiner textbasierten Natur mit großen Mängeln behaftet, da er sich bei der Suche nach Bildern auf Wörter und Markendesign-Codes (handbeschriftete Etiketten für Designmerkmale) stützt.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_8_b2fff6ca11.png" alt="8.png" class="doc-image" id="8.png" />
   </span> <span class="img-wrapper"> <span>8.png</span> </span></p>
<p>In diesem Artikel soll daher gezeigt werden, wie ein effizientes bildbasiertes Markenähnlichkeits-Suchsystem unter Verwendung von <a href="https://milvus.io">Milvus</a>, einer Open-Source-Vektordatenbank, aufgebaut werden kann.</p>
<h2 id="A-vector-similarity-search-system-for-trademarks" class="common-anchor-header">Ein vektorielles Ähnlichkeitssuchsystem für Marken<button data-href="#A-vector-similarity-search-system-for-trademarks" class="anchor-icon" translate="no">
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
    </button></h2><p>Um ein vektorbasiertes Ähnlichkeitssuchsystem für Marken zu erstellen, müssen Sie die folgenden Schritte durchlaufen:</p>
<ol>
<li>Bereiten Sie einen umfangreichen Datensatz von Logos vor. Wahrscheinlich kann das System einen Datensatz wie <a href="https://developer.uspto.gov/product/trademark-24-hour-box-and-supplemental">diesen</a> verwenden).</li>
<li>Trainieren Sie ein Modell zur Extraktion von Bildmerkmalen unter Verwendung des Datensatzes und datengesteuerter Modelle oder KI-Algorithmen.</li>
<li>Umwandlung der Logos in Vektoren unter Verwendung des in Schritt 2 trainierten Modells oder Algorithmus.</li>
<li>Speichern Sie die Vektoren und führen Sie Vektorähnlichkeitssuchen in Milvus, der Open-Source-Vektordatenbank, durch.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/trademark_system_e9700df555.png" alt="Nike.png" class="doc-image" id="nike.png" />
   </span> <span class="img-wrapper"> <span>Nike.png</span> </span></p>
<p>In den folgenden Abschnitten wollen wir uns die beiden Hauptschritte beim Aufbau eines Vektorähnlichkeitssuchsystems für Marken genauer ansehen: die Verwendung von KI-Modellen für die Extraktion von Bildmerkmalen und die Verwendung von Milvus für die Vektorähnlichkeitssuche. In unserem Fall verwendeten wir VGG16, ein Faltungsneuronales Netzwerk (CNN), um Bildmerkmale zu extrahieren und sie in Einbettungsvektoren umzuwandeln.</p>
<h3 id="Using-VGG16-for-image-feature-extraction" class="common-anchor-header">Verwendung von VGG16 für die Extraktion von Bildmerkmalen</h3><p><a href="https://medium.com/@mygreatlearning/what-is-vgg16-introduction-to-vgg16-f2d63849f615">VGG16</a> ist ein CNN, das für die Bilderkennung in großem Maßstab entwickelt wurde. Das Modell ist schnell und genau in der Bilderkennung und kann auf Bilder aller Größen angewendet werden. Im Folgenden finden Sie zwei Abbildungen der VGG16-Architektur.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vgg16_layers_9e621f62cc.png" alt="9.png" class="doc-image" id="9.png" />
   </span> <span class="img-wrapper"> <span>9.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vgg16_architecture_992614e882.png" alt="10.png" class="doc-image" id="10.png" />
   </span> <span class="img-wrapper"> <span>10.png</span> </span></p>
<p>Das VGG16-Modell ist, wie der Name schon sagt, ein CNN mit 16 Schichten. Alle VGG-Modelle, einschließlich VGG16 und VGG19, enthalten 5 VGG-Blöcke mit einer oder mehreren Faltungsschichten in jedem VGG-Block. Und am Ende jedes Blocks ist eine Max-Pooling-Schicht angeschlossen, um die Größe des Eingangsbildes zu reduzieren. Die Anzahl der Kernel ist in jeder Faltungsschicht gleich, verdoppelt sich aber in jedem VGG-Block. Daher wächst die Anzahl der Kerne im Modell von 64 im ersten Block auf 512 im vierten und fünften Block. Alle Faltungskerne haben<em>die Größe 33, während die Pooling-Kerne alle die Größe 22 haben</em>. Dies trägt dazu bei, dass mehr Informationen über das Eingangsbild erhalten bleiben.</p>
<p>Daher ist VGG16 in diesem Fall ein geeignetes Modell für die Bilderkennung von großen Datensätzen. Sie können Python, Tensorflow und Keras verwenden, um ein Modell zur Extraktion von Bildmerkmalen auf der Grundlage von VGG16 zu trainieren.</p>
<h3 id="Using-Milvus-for-vector-similarity-search" class="common-anchor-header">Verwendung von Milvus für die Vektorähnlichkeitssuche</h3><p>Nach der Verwendung des VGG16-Modells zur Extraktion von Bildmerkmalen und der Umwandlung von Logobildern in Einbettungsvektoren müssen Sie in einem großen Datensatz nach ähnlichen Vektoren suchen.</p>
<p>Milvus ist eine Cloud-native Datenbank, die sich durch hohe Skalierbarkeit und Elastizität auszeichnet. Als Datenbank kann sie außerdem die Datenkonsistenz sicherstellen. Bei einem System zur Suche nach Markenähnlichkeit wie diesem werden neue Daten wie die neuesten Markenregistrierungen in Echtzeit in das System hochgeladen. Und diese neu hochgeladenen Daten müssen sofort für die Suche verfügbar sein. Daher wird in diesem Artikel die Open-Source-Vektordatenbank Milvus für die Vektorähnlichkeitssuche verwendet.</p>
<p>Beim Einfügen der Logovektoren können Sie in Milvus Sammlungen für verschiedene Arten von Logovektoren gemäß der <a href="https://en.wikipedia.org/wiki/International_(Nice)_Classification_of_Goods_and_Services">Internationalen Klassifikation von Waren und Dienstleistungen (Nizza)</a> erstellen, einem System zur Klassifizierung von Waren und Dienstleistungen für die Eintragung von Marken. Sie können zum Beispiel eine Gruppe von Vektoren von Bekleidungsmarkenlogos in eine Sammlung mit dem Namen &quot;Bekleidung&quot; in Milvus einfügen und eine andere Gruppe von Vektoren von technologischen Markenlogos in eine andere Sammlung mit dem Namen &quot;Technologie&quot;. Auf diese Weise können Sie die Effizienz und Geschwindigkeit Ihrer Vektorähnlichkeitssuche erheblich steigern.</p>
<p>Milvus unterstützt nicht nur mehrere Indizes für die Vektorähnlichkeitssuche, sondern bietet auch umfangreiche APIs und Tools zur Erleichterung von DevOps. Das folgende Diagramm veranschaulicht die <a href="https://milvus.io/docs/v2.0.x/architecture_overview.md">Milvus-Architektur</a>. Sie können mehr über Milvus erfahren, indem Sie die <a href="https://milvus.io/docs/v2.0.x/overview.md">Einführung</a> lesen.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_architecture_ea45a5ab53.png" alt="11.png" class="doc-image" id="11.png" />
   </span> <span class="img-wrapper"> <span>11.png</span> </span></p>
<h2 id="Looking-for-more-resources" class="common-anchor-header">Suchen Sie nach weiteren Ressourcen?<button data-href="#Looking-for-more-resources" class="anchor-icon" translate="no">
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
<li><p>Bauen Sie mit Milvus weitere Systeme zur Suche nach Vektorähnlichkeit für andere Anwendungsszenarien:</p>
<ul>
<li><a href="https://milvus.io/blog/dna-sequence-classification-based-on-milvus.md">DNA-Sequenz-Klassifizierung auf der Grundlage von Milvus</a></li>
<li><a href="https://milvus.io/blog/audio-retrieval-based-on-milvus.md">Audio-Suche basierend auf Milvus</a></li>
<li><a href="https://milvus.io/blog/building-video-search-system-with-milvus.md">4 Schritte zum Aufbau eines Video-Suchsystems</a></li>
<li><a href="https://milvus.io/blog/building-intelligent-chatbot-with-nlp-and-milvus.md">Aufbau eines intelligenten QA-Systems mit NLP und Milvus</a></li>
<li><a href="https://milvus.io/blog/molecular-structure-similarity-with-milvus.md">Beschleunigung der Entdeckung neuer Medikamente</a></li>
</ul></li>
<li><p>Beteiligen Sie sich an unserer Open-Source-Community:</p>
<ul>
<li>Finden Sie Milvus auf <a href="https://bit.ly/307b7jC">GitHub</a> oder tragen Sie dazu bei.</li>
<li>Interagieren Sie mit der Community über das <a href="https://bit.ly/3qiyTEk">Forum</a>.</li>
<li>Verbinden Sie sich mit uns auf <a href="https://bit.ly/3ob7kd8">Twitter</a>.</li>
</ul></li>
</ul>
