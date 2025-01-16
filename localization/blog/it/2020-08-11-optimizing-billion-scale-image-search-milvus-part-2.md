---
id: optimizing-billion-scale-image-search-milvus-part-2.md
title: Il sistema di ricerca per immagini di seconda generazione
author: Rife Wang
date: 2020-08-11T22:20:27.855Z
desc: >-
  Un caso d'uso di Milvus per costruire un sistema di ricerca per similarità di
  immagini per il mondo reale.
cover: assets.zilliz.com/header_c73631b1e7.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/optimizing-billion-scale-image-search-milvus-part-2'
---
<custom-h1>Il viaggio verso l'ottimizzazione della ricerca di immagini su scala miliardaria (2/2)</custom-h1><p>Questo articolo è la seconda parte di <strong>The Journey to Optimizing Billion-scale Image Search di UPYUN</strong>. Se vi siete persi la prima, fate <a href="https://zilliz.com/blog/optimizing-billion-scale-image-search-milvus-part-1">clic qui</a>.</p>
<h2 id="The-second-generation-search-by-image-system" class="common-anchor-header">Il sistema di ricerca per immagini di seconda generazione<button data-href="#The-second-generation-search-by-image-system" class="anchor-icon" translate="no">
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
    </button></h2><p>Il sistema di ricerca per immagini di seconda generazione sceglie tecnicamente la soluzione CNN + Milvus. Il sistema si basa su vettori di caratteristiche e fornisce un supporto tecnico migliore.</p>
<h2 id="Feature-extraction" class="common-anchor-header">Estrazione delle caratteristiche<button data-href="#Feature-extraction" class="anchor-icon" translate="no">
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
    </button></h2><p>Nel campo della computer vision, l'uso dell'intelligenza artificiale è diventato mainstream. Allo stesso modo, l'estrazione delle caratteristiche del sistema di ricerca per immagini di seconda generazione utilizza la rete neurale convoluzionale (CNN) come tecnologia di base.</p>
<p>Il termine CNN è difficile da capire. Qui ci concentriamo sulla risposta a due domande:</p>
<ul>
<li>Cosa può fare la CNN?</li>
<li>Perché è possibile utilizzare la CNN per la ricerca di immagini?</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_meme_649be6dfe8.jpg" alt="1-meme.jpg" class="doc-image" id="1-meme.jpg" />
   </span> <span class="img-wrapper"> <span>1-meme.jpg</span> </span></p>
<p>Ci sono molte competizioni nel campo dell'intelligenza artificiale e la classificazione delle immagini è una delle più importanti. Il compito della classificazione delle immagini è determinare se il contenuto dell'immagine riguarda un gatto, un cane, una mela, una pera o altri tipi di oggetti.</p>
<p>Cosa può fare la CNN? Può estrarre caratteristiche e riconoscere oggetti. Estrae le caratteristiche da più dimensioni e misura quanto le caratteristiche di un'immagine siano vicine a quelle di un gatto o di un cane. Possiamo scegliere quelle più vicine come risultato dell'identificazione, che indica se il contenuto di un'immagine specifica riguarda un gatto, un cane o qualcos'altro.</p>
<p>Qual è il legame tra la funzione di identificazione degli oggetti della CNN e la ricerca per immagini? Quello che vogliamo non è il risultato finale dell'identificazione, ma il vettore di caratteristiche estratto da più dimensioni. I vettori di caratteristiche di due immagini con contenuti simili devono essere vicini.</p>
<h3 id="Which-CNN-model-should-I-use" class="common-anchor-header">Quale modello CNN utilizzare?</h3><p>La risposta è VGG16. Perché sceglierlo? Innanzitutto, VGG16 ha una buona capacità di generalizzazione, cioè è molto versatile. In secondo luogo, i vettori di caratteristiche estratti da VGG16 hanno 512 dimensioni. Se le dimensioni sono poche, l'accuratezza potrebbe risentirne. Se le dimensioni sono troppe, il costo della memorizzazione e del calcolo di questi vettori di caratteristiche è relativamente alto.</p>
<p>L'utilizzo di CNN per estrarre le caratteristiche dell'immagine è una soluzione tradizionale. Possiamo utilizzare VGG16 come modello e Keras + TensorFlow per l'implementazione tecnica. Ecco l'esempio ufficiale di Keras:</p>
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
<p>Le caratteristiche estratte sono vettori di caratteristiche.</p>
<h3 id="1-Normalization" class="common-anchor-header">1. Normalizzazione</h3><p>Per facilitare le operazioni successive, spesso normalizziamo le caratteristiche:</p>
<p>Ciò che viene utilizzato successivamente è anche il vettori normalizzati <code translate="no">norm_feat</code>.</p>
<h3 id="2-Image-description" class="common-anchor-header">2. Descrizione dell'immagine</h3><p>L'immagine viene caricata utilizzando il metodo <code translate="no">image.load_img</code> di <code translate="no">keras.preprocessing</code>:</p>
<pre><code translate="no">from keras.preprocessing import image
img_path = 'elephant.jpg'
img = image.load_img(img_path, target_size=(224, 224))
</code></pre>
<p>In realtà, si tratta del metodo TensorFlow chiamato da Keras. Per i dettagli, vedere la documentazione di TensorFlow. L'oggetto immagine finale è in realtà un'istanza di PIL Image (il PIL utilizzato da TensorFlow).</p>
<h3 id="3-Bytes-conversion" class="common-anchor-header">3. Conversione dei byte</h3><p>In pratica, il contenuto delle immagini viene spesso trasmesso attraverso la rete. Pertanto, invece di caricare le immagini dal percorso, si preferisce convertire i dati dei byte direttamente in oggetti immagine, cioè in immagini PIL:</p>
<pre><code translate="no">import io
from PIL import Image

# img_bytes: 图片内容 bytes
img = Image.open(io.BytesIO(img_bytes))
img = img.convert('RGB')

img = img.resize((224, 224), Image.NEAREST)
</code></pre>
<p>L'immagine qui sopra è uguale al risultato ottenuto con il metodo image.load_img. Ci sono due cose a cui prestare attenzione:</p>
<ul>
<li>È necessario eseguire la conversione RGB.</li>
<li>È necessario ridimensionare (resize è il secondo parametro di <code translate="no">load_img method</code>).</li>
</ul>
<h3 id="4-Black-border-processing" class="common-anchor-header">4. Elaborazione del bordo nero</h3><p>Le immagini, come le schermate, possono occasionalmente avere dei bordi neri. Questi bordi neri non hanno alcun valore pratico e causano molte interferenze. Per questo motivo, la rimozione dei bordi neri è una pratica comune.</p>
<p>Un bordo nero è essenzialmente una riga o colonna di pixel in cui tutti i pixel sono (0, 0, 0) (immagine RGB). Per rimuovere il bordo nero è necessario trovare queste righe o colonne ed eliminarle. Si tratta in realtà di una moltiplicazione matriciale 3D in NumPy.</p>
<p>Un esempio di rimozione dei bordi neri orizzontali:</p>
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
<p>Questo è più o meno ciò che voglio dire sull'uso della CNN per estrarre le caratteristiche dell'immagine e implementare altre elaborazioni dell'immagine. Ora diamo un'occhiata ai motori di ricerca vettoriali.</p>
<h2 id="Vector-search-engine" class="common-anchor-header">Motore di ricerca vettoriale<button data-href="#Vector-search-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>Il problema dell'estrazione dei vettori di caratteristiche dalle immagini è stato risolto. I problemi rimanenti sono:</p>
<ul>
<li>Come memorizzare i vettori di caratteristiche?</li>
<li>Come calcolare la somiglianza dei vettori di caratteristiche, cioè come effettuare una ricerca? Il motore di ricerca vettoriale open-source Milvus può risolvere questi due problemi. Finora ha funzionato bene nel nostro ambiente di produzione.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_milvus_logo_3a7411f2c8.png" alt="3-milvus-logo.png" class="doc-image" id="3-milvus-logo.png" />
   </span> <span class="img-wrapper"> <span>3-milvus-logo.png</span> </span></p>
<h2 id="Milvus-the-vector-search-engine" class="common-anchor-header">Milvus, il motore di ricerca vettoriale<button data-href="#Milvus-the-vector-search-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>L'estrazione di vettori di caratteristiche da un'immagine non è sufficiente. Dobbiamo anche gestire dinamicamente questi vettori di caratteristiche (aggiunta, eliminazione e aggiornamento), calcolare la somiglianza dei vettori e restituire i dati vettoriali nell'intervallo di prossimità. Il motore di ricerca vettoriale open-source Milvus svolge questi compiti abbastanza bene.</p>
<p>Nel resto dell'articolo verranno descritte le pratiche specifiche e i punti da tenere in considerazione.</p>
<h3 id="1-Requirements-for-CPU" class="common-anchor-header">1. Requisiti della CPU</h3><p>Per utilizzare Milvus, la CPU deve supportare il set di istruzioni avx2. Per i sistemi Linux, utilizzare il seguente comando per verificare quali set di istruzioni supporta la propria CPU:</p>
<p><code translate="no">cat /proc/cpuinfo | grep flags</code></p>
<p>Si ottiene qualcosa di simile:</p>
<pre><code translate="no">flags           : fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb         rdtscp lm constant_tsc arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2     ssse3 sdbg fma cx16 xtpr pdcm pcid dca sse4_1 sse4_2 x2apic movbe popcnt aes xsave avx f16c rdrand lahf_lm abm cpuid_fault epb invpcid_single pti intel_ppin tpr_shadow vnmi flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid cqm xsaveopt cqm_llc cqm_occup_llc dtherm ida arat pln pts
</code></pre>
<p>Quello che segue i flag è il set di istruzioni supportato dalla vostra CPU. Naturalmente, questi sono molti di più di quelli di cui ho bisogno. Voglio solo vedere se uno specifico set di istruzioni, come avx2, è supportato. Basta aggiungere un grep per filtrarlo:</p>
<pre><code translate="no">cat /proc/cpuinfo | grep flags | grep avx2
</code></pre>
<p>Se non viene restituito alcun risultato, significa che questo specifico set di istruzioni non è supportato. È quindi necessario cambiare macchina.</p>
<h3 id="2-Capacity-planning" class="common-anchor-header">2. Pianificazione della capacità</h3><p>La pianificazione della capacità è la nostra prima considerazione quando progettiamo un sistema. Quanti dati dobbiamo memorizzare? Di quanta memoria e di quanto spazio su disco necessitano i dati?</p>
<p>Facciamo qualche rapido calcolo. Ogni dimensione di un vettore è un float32. Un tipo float32 occupa 4 byte. Quindi un vettore di 512 dimensioni richiede 2 KB di memoria. Allo stesso modo:</p>
<ul>
<li>Mille vettori di 512 dimensioni richiedono 2 MB di memoria.</li>
<li>Un milione di vettori a 512 dimensioni richiede 2 GB di memoria.</li>
<li>10 milioni di vettori a 512 dimensioni richiedono 20 GB di memoria.</li>
<li>100 milioni di vettori a 512 dimensioni richiedono 200 GB di memoria.</li>
<li>Un miliardo di vettori a 512 dimensioni richiede 2 TB di memoria.</li>
</ul>
<p>Se si desidera memorizzare tutti i dati nella memoria, il sistema deve avere almeno la capacità di memoria corrispondente.</p>
<p>Si consiglia di utilizzare lo strumento ufficiale di calcolo delle dimensioni: Milvus sizing tool.</p>
<p>In realtà la nostra memoria potrebbe non essere così grande (non importa se non si ha abbastanza memoria. Milvus scarica automaticamente i dati sul disco). Oltre ai dati vettoriali originali, dobbiamo anche considerare la memorizzazione di altri dati, come i log.</p>
<h3 id="3-System-configuration" class="common-anchor-header">3. Configurazione del sistema</h3><p>Per ulteriori informazioni sulla configurazione del sistema, consultare la documentazione di Milvus:</p>
<ul>
<li>Configurazione del server Milvus: https://milvus.io/docs/v0.10.1/milvus_config.md</li>
</ul>
<h3 id="4-Database-design" class="common-anchor-header">4. Progettazione del database</h3><p><strong>Raccolta e partizione</strong></p>
<ul>
<li>La collezione è nota anche come tabella.</li>
<li>La partizione si riferisce alle partizioni all'interno di una collezione.</li>
</ul>
<p>L'implementazione di base della partizione è in realtà identica a quella della collezione, tranne che per il fatto che una partizione si trova sotto una collezione. Ma con le partizioni, l'organizzazione dei dati diventa più flessibile. È anche possibile interrogare una partizione specifica in una collezione per ottenere risultati migliori.</p>
<p>Quante collezioni e partizioni si possono avere? Le informazioni di base sulle raccolte e sulle partizioni si trovano nei Metadati. Milvus utilizza SQLite (integrazione interna a Milvus) o MySQL (richiede una connessione esterna) per la gestione dei metadati interni. Se si usa SQLite per default per gestire i metadati, si avrà una grave perdita di prestazioni quando il numero di raccolte e partizioni è troppo grande. Pertanto, il numero totale di raccolte e partizioni non dovrebbe superare i 50.000 (Milvus 0.8.0 limita questo numero a 4.096). Se è necessario impostare un numero maggiore, si consiglia di utilizzare MySQL tramite una connessione esterna.</p>
<p>La struttura dei dati supportata dalla collezione e dalla partizione di Milvus è molto semplice, cioè <code translate="no">ID + vector</code>. In altre parole, ci sono solo due colonne nella tabella: ID e dati vettoriali.</p>
<p><strong>Nota:</strong></p>
<ul>
<li>L'ID deve essere un numero intero.</li>
<li>È necessario assicurarsi che l'ID sia unico all'interno di una collezione anziché di una partizione.</li>
</ul>
<p><strong>Filtraggio condizionale</strong></p>
<p>Quando utilizziamo i database tradizionali, possiamo specificare i valori dei campi come condizioni di filtraggio. Sebbene Milvus non filtri esattamente nello stesso modo, possiamo implementare un semplice filtraggio condizionale utilizzando collezioni e partizioni. Ad esempio, abbiamo una grande quantità di dati di immagini e i dati appartengono a utenti specifici. Allora possiamo dividere i dati in partizioni per utente. Pertanto, utilizzare l'utente come condizione di filtro significa specificare la partizione.</p>
<p><strong>Dati strutturati e mappatura vettoriale</strong></p>
<p>Milvus supporta solo la struttura dei dati ID + vettoriale. Ma negli scenari aziendali, ciò di cui abbiamo bisogno sono dati strutturati che abbiano un significato commerciale. In altre parole, dobbiamo trovare i dati strutturati attraverso i vettori. Di conseguenza, è necessario mantenere le relazioni di mappatura tra dati strutturati e vettori attraverso l'ID.</p>
<pre><code translate="no">structured data ID &lt;--&gt; mapping table &lt;--&gt; Milvus ID
</code></pre>
<p><strong>Selezione dell'indice</strong></p>
<p>È possibile fare riferimento ai seguenti articoli:</p>
<ul>
<li>Tipi di indice: https://www.milvus.io/docs/v0.10.1/index.md</li>
<li>Come selezionare un indice: https://medium.com/@milvusio/how-to-choose-an-index-in-milvus-4f3d15259212</li>
</ul>
<h3 id="5-Processing-search-results" class="common-anchor-header">5. Elaborazione dei risultati della ricerca</h3><p>I risultati della ricerca di Milvus sono una raccolta di ID + distanza:</p>
<ul>
<li>ID: l'ID in una raccolta.</li>
<li>Distanza: un valore di distanza compreso tra 0 e 1 indica il livello di somiglianza; più piccolo è il valore, più simili sono i due vettori.</li>
</ul>
<p><strong>Filtrare i dati il cui ID è -1</strong></p>
<p>Quando il numero di raccolte è troppo piccolo, i risultati della ricerca possono contenere dati il cui ID è -1. È necessario filtrarli da soli. È necessario filtrarli da soli.</p>
<p><strong>Paginazione</strong></p>
<p>La ricerca di vettori è molto diversa. I risultati dell'interrogazione sono ordinati in ordine decrescente di somiglianza e vengono selezionati i risultati più simili (topK) (topK è specificato dall'utente al momento dell'interrogazione).</p>
<p>Milvus non supporta la paginazione. Se ne abbiamo bisogno per lavoro, dobbiamo implementare la funzione di paginazione da soli. Ad esempio, se abbiamo dieci risultati in ogni pagina e vogliamo visualizzare solo la terza pagina, dobbiamo specificare che topK = 30 e restituire solo gli ultimi dieci risultati.</p>
<p><strong>Soglia di somiglianza per il business</strong></p>
<p>La distanza tra i vettori di due immagini è compresa tra 0 e 1. Se vogliamo decidere se due immagini sono simili in uno specifico scenario aziendale, dobbiamo specificare una soglia all'interno di questo intervallo. Le due immagini sono simili se la distanza è minore della soglia, oppure sono molto diverse tra loro se la distanza è maggiore della soglia. È necessario regolare la soglia per soddisfare le proprie esigenze aziendali.</p>
<blockquote>
<p>Questo articolo è stato scritto da rifewang, utente di Milvus e ingegnere informatico di UPYUN. Se vi piace questo articolo, venite a salutarci su https://github.com/rifewang.</p>
</blockquote>
