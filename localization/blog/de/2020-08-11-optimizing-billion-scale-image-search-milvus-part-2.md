---
id: optimizing-billion-scale-image-search-milvus-part-2.md
title: Das Bild-für-Bild-Suchsystem der zweiten Generation
author: Rife Wang
date: 2020-08-11T22:20:27.855Z
desc: >-
  Ein Anwenderbeispiel für die Nutzung von Milvus zum Aufbau eines
  Bildähnlichkeitssuchsystems für die reale Geschäftswelt.
cover: assets.zilliz.com/header_c73631b1e7.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/optimizing-billion-scale-image-search-milvus-part-2'
---
<custom-h1>Die Reise zur Optimierung der milliardenfachen Bildersuche (2/2)</custom-h1><p>Dieser Artikel ist der zweite Teil von <strong>The Journey to Optimizing Billion-scale Image Search von UPYUN</strong>. Wenn Sie den ersten Teil verpasst haben, klicken Sie <a href="https://zilliz.com/blog/optimizing-billion-scale-image-search-milvus-part-1">hier</a>.</p>
<h2 id="The-second-generation-search-by-image-system" class="common-anchor-header">Das Bild-für-Bild-Suchsystem der zweiten Generation<button data-href="#The-second-generation-search-by-image-system" class="anchor-icon" translate="no">
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
    </button></h2><p>Das Search-by-Image-System der zweiten Generation setzt technisch auf die CNN + Milvus-Lösung. Das System basiert auf Feature-Vektoren und bietet eine bessere technische Unterstützung.</p>
<h2 id="Feature-extraction" class="common-anchor-header">Merkmalsextraktion<button data-href="#Feature-extraction" class="anchor-icon" translate="no">
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
    </button></h2><p>Im Bereich der Computer Vision hat sich der Einsatz von künstlicher Intelligenz zum Mainstream entwickelt. Auch die Merkmalsextraktion des Bildsuchsystems der zweiten Generation verwendet ein Faltungsneuronales Netz (CNN) als zugrunde liegende Technologie</p>
<p>Der Begriff CNN ist schwer zu verstehen. Hier konzentrieren wir uns auf die Beantwortung von zwei Fragen:</p>
<ul>
<li>Was kann CNN leisten?</li>
<li>Warum kann ich CNN für eine Bildsuche verwenden?</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_meme_649be6dfe8.jpg" alt="1-meme.jpg" class="doc-image" id="1-meme.jpg" />
   </span> <span class="img-wrapper"> <span>1-meme.jpg</span> </span></p>
<p>Im Bereich der künstlichen Intelligenz gibt es viele Wettbewerbe, und die Bildklassifizierung ist einer der wichtigsten. Die Aufgabe der Bildklassifizierung besteht darin, festzustellen, ob es sich bei dem Inhalt des Bildes um eine Katze, einen Hund, einen Apfel, eine Birne oder um andere Arten von Objekten handelt.</p>
<p>Was kann CNN tun? Es kann Merkmale extrahieren und Objekte erkennen. Es extrahiert Merkmale aus mehreren Dimensionen und misst, wie nahe die Merkmale eines Bildes den Merkmalen von Katzen oder Hunden sind. Wir können die Merkmale, die den Merkmalen am nächsten kommen, als Identifizierungsergebnis auswählen, das uns anzeigt, ob es sich bei dem Inhalt eines bestimmten Bildes um eine Katze, einen Hund oder etwas anderes handelt.</p>
<p>Welcher Zusammenhang besteht zwischen der Objektidentifizierungsfunktion von CNN und der Suche nach Bildern? Was wir wollen, ist nicht das endgültige Identifikationsergebnis, sondern der aus mehreren Dimensionen extrahierte Merkmalsvektor. Die Merkmalsvektoren von zwei Bildern mit ähnlichem Inhalt müssen nahe beieinander liegen.</p>
<h3 id="Which-CNN-model-should-I-use" class="common-anchor-header">Welches CNN-Modell soll ich verwenden?</h3><p>Die Antwort lautet VGG16. Warum sollte man es wählen? Erstens hat VGG16 eine gute Generalisierungsfähigkeit, das heißt, es ist sehr vielseitig. Zweitens haben die von VGG16 extrahierten Merkmalsvektoren 512 Dimensionen. Wenn es nur wenige Dimensionen gibt, kann die Genauigkeit beeinträchtigt werden. Wenn es zu viele Dimensionen gibt, sind die Kosten für die Speicherung und Berechnung dieser Merkmalsvektoren relativ hoch.</p>
<p>Die Verwendung von CNN zur Extraktion von Bildmerkmalen ist eine gängige Lösung. Wir können VGG16 als Modell und Keras + TensorFlow für die technische Implementierung verwenden. Hier ist das offizielle Beispiel von Keras:</p>
<pre><code translate="no">from keras.applications.vgg16 import VGG16
from keras.preprocessing import image
from keras.applications.vgg16 import preprocess_input
import numpy as np
model = VGG16(weights=’imagenet’, include_top=False)
img_path = ‘elephant.jpg’
img = image.load_img(img_path, target_size=(224, 224))
x = image.img_to_array(img)
x = np.expand_dims(x, axis=0)
x = preprocess_input(x)
features = model.predict(x)
</code></pre>
<p>Die hier extrahierten Merkmale sind Merkmalsvektoren.</p>
<h3 id="1-Normalization" class="common-anchor-header">1. Normalisierung</h3><p>Um nachfolgende Operationen zu erleichtern, normalisieren wir oft die Features:</p>
<p>Was anschließend verwendet wird, ist auch das normalisierte <code translate="no">norm_feat</code>.</p>
<h3 id="2-Image-description" class="common-anchor-header">2. Beschreibung des Bildes</h3><p>Das Bild wird mit der Methode <code translate="no">image.load_img</code> von <code translate="no">keras.preprocessing</code> geladen:</p>
<pre><code translate="no">from keras.preprocessing import image
img_path = 'elephant.jpg'
img = image.load_img(img_path, target_size=(224, 224))
</code></pre>
<p>Es handelt sich dabei um die TensorFlow-Methode, die von Keras aufgerufen wird. Für Details siehe die TensorFlow-Dokumentation. Das endgültige Bildobjekt ist eigentlich eine PIL Image Instanz (die von TensorFlow verwendete PIL).</p>
<h3 id="3-Bytes-conversion" class="common-anchor-header">3. Konvertierung von Bytes</h3><p>In der Praxis wird der Bildinhalt oft über das Netzwerk übertragen. Daher ziehen wir es vor, statt Bilder aus dem Pfad zu laden, Bytes-Daten direkt in Bildobjekte, d.h. PIL Images, zu konvertieren:</p>
<pre><code translate="no">import io
from PIL import Image

# img_bytes: 图片内容 bytes
img = Image.open(io.BytesIO(img_bytes))
img = img.convert('RGB')

img = img.resize((224, 224), Image.NEAREST)
</code></pre>
<p>Das obige img ist dasselbe wie das Ergebnis der Methode image.load_img. Es gibt zwei Dinge zu beachten:</p>
<ul>
<li>Sie müssen eine RGB-Konvertierung durchführen.</li>
<li>Sie müssen die Größe ändern (resize ist der zweite Parameter von <code translate="no">load_img method</code>).</li>
</ul>
<h3 id="4-Black-border-processing" class="common-anchor-header">4. Verarbeitung des schwarzen Randes</h3><p>Bilder, wie z. B. Screenshots, können gelegentlich ziemlich viele schwarze Ränder haben. Diese schwarzen Ränder haben keinen praktischen Wert und sind sehr störend. Aus diesem Grund ist das Entfernen von schwarzen Rändern ebenfalls eine gängige Praxis.</p>
<p>Ein schwarzer Rand ist im Wesentlichen eine Reihe oder Spalte von Pixeln, in der alle Pixel (0, 0, 0) sind (RGB-Bild). Um den schwarzen Rand zu entfernen, muss man diese Zeilen oder Spalten finden und löschen. Dies ist eigentlich eine 3-D-Matrix-Multiplikation in NumPy.</p>
<p>Ein Beispiel für das Entfernen horizontaler schwarzer Ränder:</p>
<pre><code translate="no"># -*- coding: utf-8 -*-
import numpy as np
from keras.preprocessing import image
def RemoveBlackEdge(img):
Args:
       img: PIL image instance
Returns:
       PIL image instance
&quot;&quot;&quot;
   width = img.width
   img = image.img_to_array(img)
   img_without_black = img[~np.all(img == np.zeros((1, width, 3), np.uint8), axis=(1, 2))]
   img = image.array_to_img(img_without_black)
return img
</code></pre>
<p>Das ist ziemlich genau das, was ich über die Verwendung von CNN zur Extraktion von Bildmerkmalen und zur Implementierung anderer Bildverarbeitungsfunktionen sagen möchte. Werfen wir nun einen Blick auf Vektorsuchmaschinen.</p>
<h2 id="Vector-search-engine" class="common-anchor-header">Vektorielle Suchmaschine<button data-href="#Vector-search-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>Das Problem der Extraktion von Merkmalsvektoren aus Bildern ist gelöst. Die verbleibenden Probleme sind:</p>
<ul>
<li>Wie speichert man Merkmalsvektoren?</li>
<li>Wie berechnet man die Ähnlichkeit von Merkmalsvektoren, d. h. wie sucht man? Die Open-Source-Vektorsuchmaschine Milvus kann diese beiden Probleme lösen. Bislang hat sie sich in unserer Produktionsumgebung gut bewährt.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_milvus_logo_3a7411f2c8.png" alt="3-milvus-logo.png" class="doc-image" id="3-milvus-logo.png" />
   </span> <span class="img-wrapper"> <span>3-milvus-logo.png</span> </span></p>
<h2 id="Milvus-the-vector-search-engine" class="common-anchor-header">Milvus, die Vektorsuchmaschine<button data-href="#Milvus-the-vector-search-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Extraktion von Merkmalsvektoren aus einem Bild reicht bei weitem nicht aus. Wir müssen diese Merkmalsvektoren auch dynamisch verwalten (Hinzufügen, Löschen und Aktualisieren), die Ähnlichkeit der Vektoren berechnen und die Vektordaten im Bereich der nächsten Nachbarn zurückgeben. Die Open-Source-Vektorsuchmaschine Milvus erfüllt diese Aufgaben recht gut.</p>
<p>Im weiteren Verlauf dieses Artikels werden spezifische Praktiken und zu beachtende Punkte beschrieben.</p>
<h3 id="1-Requirements-for-CPU" class="common-anchor-header">1. Anforderungen an die CPU</h3><p>Um Milvus zu verwenden, muss Ihre CPU den Befehlssatz avx2 unterstützen. Bei Linux-Systemen können Sie mit dem folgenden Befehl überprüfen, welche Befehlssätze Ihre CPU unterstützt:</p>
<p><code translate="no">cat /proc/cpuinfo | grep flags</code></p>
<p>Sie erhalten dann eine Meldung wie diese:</p>
<pre><code translate="no">flags           : fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb         rdtscp lm constant_tsc arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2     ssse3 sdbg fma cx16 xtpr pdcm pcid dca sse4_1 sse4_2 x2apic movbe popcnt aes xsave avx f16c rdrand lahf_lm abm cpuid_fault epb invpcid_single pti intel_ppin tpr_shadow vnmi flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid cqm xsaveopt cqm_llc cqm_occup_llc dtherm ida arat pln pts
</code></pre>
<p>Was auf die Flags folgt, sind die Befehlssätze, die Ihre CPU unterstützt. Natürlich sind das viel mehr, als ich brauche. Ich möchte nur sehen, ob ein bestimmter Befehlssatz, wie z.B. avx2, unterstützt wird. Fügen Sie einfach ein grep hinzu, um es zu filtern:</p>
<pre><code translate="no">cat /proc/cpuinfo | grep flags | grep avx2
</code></pre>
<p>Wenn kein Ergebnis zurückgegeben wird, bedeutet das, dass dieser spezifische Befehlssatz nicht unterstützt wird. Sie müssen dann Ihren Rechner wechseln.</p>
<h3 id="2-Capacity-planning" class="common-anchor-header">2. Kapazitätsplanung</h3><p>Die Kapazitätsplanung ist unsere erste Überlegung beim Entwurf eines Systems. Wie viele Daten müssen wir speichern? Wie viel Speicherplatz und Festplattenplatz benötigen die Daten?</p>
<p>Machen wir ein paar kurze Berechnungen. Jede Dimension eines Vektors ist float32. Ein Float32-Typ benötigt 4 Bytes. Ein Vektor mit 512 Dimensionen benötigt also 2 KB Speicherplatz. Umgekehrt gilt das Gleiche:</p>
<ul>
<li>Tausend 512-dimensionale Vektoren benötigen 2 MB Speicherplatz.</li>
<li>Eine Million 512-dimensionale Vektoren erfordern 2 GB Speicherplatz.</li>
<li>10 Millionen 512-dimensionale Vektoren erfordern 20 GB Speicherplatz.</li>
<li>100 Millionen 512-dimensionale Vektoren erfordern 200 GB Speicherplatz.</li>
<li>Eine Milliarde 512-dimensionaler Vektoren erfordern 2 TB Speicherplatz.</li>
</ul>
<p>Wenn wir alle Daten im Speicher ablegen wollen, benötigt das System mindestens die entsprechende Speicherkapazität.</p>
<p>Es wird empfohlen, das offizielle Tool zur Größenberechnung zu verwenden: Milvus-Größenberechnungstool.</p>
<p>In Wirklichkeit ist unser Speicher vielleicht gar nicht so groß. (Es macht nichts, wenn Sie nicht genug Speicher haben. Milvus spült die Daten automatisch auf die Festplatte.) Zusätzlich zu den ursprünglichen Vektordaten müssen wir auch die Speicherung anderer Daten wie z. B. Protokolle berücksichtigen.</p>
<h3 id="3-System-configuration" class="common-anchor-header">3. Systemkonfiguration</h3><p>Weitere Informationen über die Systemkonfiguration finden Sie in der Milvus-Dokumentation:</p>
<ul>
<li>Milvus-Server-Konfiguration: https://milvus.io/docs/v0.10.1/milvus_config.md</li>
</ul>
<h3 id="4-Database-design" class="common-anchor-header">4. Datenbank-Design</h3><p><strong>Sammlung und Partition</strong></p>
<ul>
<li>Sammlung ist auch als Tabelle bekannt.</li>
<li>Partition bezieht sich auf die Unterteilungen innerhalb einer Sammlung.</li>
</ul>
<p>Die zugrundeliegende Implementierung von Partitionen ist eigentlich die gleiche wie die von Sammlungen, nur dass eine Partition unter einer Sammlung liegt. Aber mit Partitionen wird die Organisation der Daten flexibler. Wir können auch eine bestimmte Partition in einer Sammlung abfragen, um bessere Abfrageergebnisse zu erzielen.</p>
<p>Wie viele Sammlungen und Partitionen können wir haben? Die grundlegenden Informationen über Sammlungen und Partitionen befinden sich in den Metadaten. Milvus verwendet entweder SQLite (Milvus-interne Integration) oder MySQL (externe Verbindung erforderlich) für die interne Metadatenverwaltung. Wenn Sie für die Verwaltung der Metadaten standardmäßig SQLite verwenden, werden Sie bei einer zu großen Anzahl von Sammlungen und Partitionen erhebliche Leistungseinbußen erleiden. Daher sollte die Gesamtzahl der Sammlungen und Partitionen 50.000 nicht überschreiten (Milvus 0.8.0 begrenzt diese Zahl auf 4.096). Wenn Sie eine größere Anzahl einstellen müssen, empfiehlt es sich, MySQL über eine externe Verbindung zu verwenden.</p>
<p>Die von Milvus' Sammlung und Partition unterstützte Datenstruktur ist sehr einfach, nämlich <code translate="no">ID + vector</code>. Mit anderen Worten, es gibt nur zwei Spalten in der Tabelle: ID und Vektordaten.</p>
<p><strong>Anmerkung:</strong></p>
<ul>
<li>Die ID sollte eine ganze Zahl sein.</li>
<li>Wir müssen sicherstellen, dass die ID innerhalb einer Sammlung und nicht innerhalb einer Partition eindeutig ist.</li>
</ul>
<p><strong>Bedingte Filterung</strong></p>
<p>Bei der Verwendung herkömmlicher Datenbanken können wir Feldwerte als Filterbedingungen angeben. Milvus filtert zwar nicht genau auf die gleiche Weise, aber wir können einfache bedingte Filterung mit Hilfe von Sammlungen und Partitionen implementieren. Ein Beispiel: Wir haben eine große Menge an Bilddaten und die Daten gehören zu bestimmten Benutzern. Dann können wir die Daten in Partitionen nach Benutzer unterteilen. Die Verwendung des Benutzers als Filterbedingung bedeutet also eigentlich die Angabe der Partition.</p>
<p><strong>Strukturierte Daten und Vektor-Mapping</strong></p>
<p>Milvus unterstützt nur die Datenstruktur ID + Vektor. In Geschäftsszenarien benötigen wir jedoch strukturierte Daten, die eine geschäftliche Bedeutung haben. Mit anderen Worten: Wir müssen strukturierte Daten über Vektoren finden. Dementsprechend müssen wir die Mapping-Beziehungen zwischen strukturierten Daten und Vektoren über die ID pflegen.</p>
<pre><code translate="no">structured data ID &lt;--&gt; mapping table &lt;--&gt; Milvus ID
</code></pre>
<p><strong>Auswahl des Index</strong></p>
<p>Sie können sich auf die folgenden Artikel beziehen:</p>
<ul>
<li>Arten von Indizes: https://www.milvus.io/docs/v0.10.1/index.md</li>
<li>Wie man einen Index auswählt: https://medium.com/@milvusio/how-to-choose-an-index-in-milvus-4f3d15259212</li>
</ul>
<h3 id="5-Processing-search-results" class="common-anchor-header">5. Verarbeitung der Suchergebnisse</h3><p>Die Suchergebnisse von Milvus sind eine Sammlung von ID + Entfernung:</p>
<ul>
<li>ID: die ID in einer Sammlung.</li>
<li>Abstand: ein Abstandswert von 0 ~ 1 gibt den Grad der Ähnlichkeit an; je kleiner der Wert, desto ähnlicher sind die beiden Vektoren.</li>
</ul>
<p><strong>Filtern von Daten, deren ID -1 ist</strong></p>
<p>Wenn die Anzahl der Sammlungen zu klein ist, können die Suchergebnisse Daten enthalten, deren ID -1 ist. Diese müssen wir selbst herausfiltern.</p>
<p><strong>Paginierung</strong></p>
<p>Die Suche nach Vektoren ist ganz anders. Die Abfrageergebnisse werden in absteigender Reihenfolge der Ähnlichkeit sortiert, und die ähnlichsten (topK) Ergebnisse werden ausgewählt (topK wird vom Benutzer zum Zeitpunkt der Abfrage angegeben).</p>
<p>Milvus unterstützt keine Paginierung. Wir müssen die Paginierungsfunktion selbst implementieren, wenn wir sie für unsere Arbeit benötigen. Wenn wir zum Beispiel zehn Ergebnisse auf jeder Seite haben und nur die dritte Seite anzeigen wollen, müssen wir angeben, dass topK = 30 ist und nur die letzten zehn Ergebnisse zurückgegeben werden.</p>
<p><strong>Ähnlichkeitsschwelle für Unternehmen</strong></p>
<p>Der Abstand zwischen den Vektoren zweier Bilder liegt zwischen 0 und 1. Wenn wir entscheiden wollen, ob zwei Bilder in einem bestimmten Geschäftsszenario ähnlich sind, müssen wir einen Schwellenwert innerhalb dieses Bereichs angeben. Die beiden Bilder sind ähnlich, wenn der Abstand kleiner als der Schwellenwert ist, oder sie sind sehr unterschiedlich, wenn der Abstand größer als der Schwellenwert ist. Sie müssen den Schwellenwert an Ihre eigenen geschäftlichen Anforderungen anpassen.</p>
<blockquote>
<p>Dieser Artikel wurde von rifewang, Milvus-Benutzer und Softwareentwickler bei UPYUN, geschrieben. Wenn Ihnen dieser Artikel gefällt, können Sie ihn gerne auf https://github.com/rifewang lesen.</p>
</blockquote>
