---
id: >-
  2021-11-26-accelerating-candidate-generation-in-recommender-systems-using-milvus-paired-with-paddlepaddle.md
title: >-
  Beschleunigte Kandidatengenerierung in Empfehlungssystemen mit Milvus in
  Verbindung mit PaddlePaddle
author: Yunmei
date: 2021-11-26T00:00:00.000Z
desc: der minimale Arbeitsablauf eines Empfehlungssystems
cover: assets.zilliz.com/Candidate_generation_9baf7beb86.png
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/accelerating-candidate-generation-in-recommender-systems-using-milvus-paired-with-paddlepaddle
---
<p>Wenn Sie Erfahrung mit der Entwicklung eines Empfehlungssystems haben, sind Sie wahrscheinlich schon mindestens einem der folgenden Probleme zum Opfer gefallen:</p>
<ul>
<li>Das System ist extrem langsam bei der Rückgabe von Ergebnissen aufgrund der enormen Menge an Datensätzen.</li>
<li>Neu eingegebene Daten können nicht in Echtzeit für die Suche oder Abfrage verarbeitet werden.</li>
<li>Der Einsatz des Empfehlungssystems ist entmutigend.</li>
</ul>
<p>Dieser Artikel zielt darauf ab, die oben genannten Probleme anzugehen und Ihnen einige Einblicke zu geben, indem er ein Projekt für ein Produktempfehlungssystem vorstellt, das Milvus, eine Open-Source-Vektordatenbank, zusammen mit PaddlePaddle, einer Deep-Learning-Plattform, verwendet.</p>
<p>In diesem Artikel wird zunächst der minimale Arbeitsablauf eines Empfehlungssystems kurz beschrieben. Anschließend werden die Hauptkomponenten und die Implementierungsdetails dieses Projekts vorgestellt.</p>
<h2 id="The-basic-workflow-of-a-recommender-system" class="common-anchor-header">Der grundlegende Arbeitsablauf eines Empfehlungssystems<button data-href="#The-basic-workflow-of-a-recommender-system" class="anchor-icon" translate="no">
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
    </button></h2><p>Bevor wir uns mit dem Projekt selbst befassen, werfen wir zunächst einen Blick auf den grundlegenden Arbeitsablauf eines Empfehlungssystems. Ein Empfehlungssystem kann personalisierte Ergebnisse entsprechend den individuellen Interessen und Bedürfnissen des Benutzers liefern. Um solche personalisierten Empfehlungen auszusprechen, durchläuft das System zwei Phasen: die Generierung von Kandidaten und das Ranking.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_29e27eb9b1.png" alt="2.png" class="doc-image" id="2.png" />
   </span> <span class="img-wrapper"> <span>2.png</span> </span></p>
<p>In der ersten Phase, der Kandidatengenerierung, werden die relevantesten oder ähnlichsten Daten ermittelt, wie z. B. ein Produkt oder ein Video, das dem Benutzerprofil entspricht. Während der Kandidatengenerierung vergleicht das System die Benutzereigenschaft mit den in seiner Datenbank gespeicherten Daten und ruft die ähnlichen Daten ab. Beim Ranking bewertet das System die abgerufenen Daten und ordnet sie neu an. Schließlich werden die Ergebnisse, die ganz oben auf der Liste stehen, den Benutzern angezeigt.</p>
<p>In unserem Fall eines Produktempfehlungssystems vergleicht es zunächst das Benutzerprofil mit den Merkmalen der Produkte im Bestand, um eine Liste von Produkten herauszufiltern, die den Bedürfnissen des Benutzers entsprechen. Dann bewertet das System die Produkte auf der Grundlage ihrer Ähnlichkeit mit dem Benutzerprofil, erstellt eine Rangliste und gibt dem Benutzer schließlich die 10 besten Produkte zurück.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_5850ba2c46.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span></p>
<h2 id="System-architecture" class="common-anchor-header">Aufbau des Systems<button data-href="#System-architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>Das Produktempfehlungssystem in diesem Projekt verwendet drei Komponenten: MIND, PaddleRec und Milvus.</p>
<h3 id="MIND" class="common-anchor-header">MIND</h3><p><a href="https://arxiv.org/pdf/1904.08030">MIND</a>, kurz für &quot;Multi-Interest Network with Dynamic Routing for Recommendation at Tmall&quot;, ist ein von der Alibaba Group entwickelter Algorithmus. Bevor MIND vorgeschlagen wurde, verwendeten die meisten der gängigen KI-Modelle für Empfehlungen einen einzigen Vektor, um die verschiedenen Interessen eines Nutzers darzustellen. Ein einzelner Vektor reicht jedoch bei weitem nicht aus, um die genauen Interessen eines Nutzers darzustellen. Daher wurde der MIND-Algorithmus vorgeschlagen, um die vielfältigen Interessen eines Nutzers in mehrere Vektoren umzuwandeln.</p>
<p>MIND verwendet ein <a href="https://arxiv.org/pdf/2005.09347">Multi-Interest-Netzwerk</a> mit dynamischem Routing, um die verschiedenen Interessen eines Nutzers in der Phase der Kandidatengenerierung zu verarbeiten. Das Multi-Interest-Netzwerk ist eine Schicht des Multi-Interest-Extraktors, die auf einem Kapsel-Routing-Mechanismus basiert. Es kann dazu verwendet werden, das frühere Verhalten eines Benutzers mit seinen verschiedenen Interessen zu kombinieren, um ein genaues Benutzerprofil zu erstellen.</p>
<p>Das folgende Diagramm veranschaulicht die Netzwerkstruktur von MIND.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_9e6f284ea2.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<p>Um die Eigenschaften von Nutzern darzustellen, nimmt MIND das Nutzerverhalten und die Nutzerinteressen als Eingaben und speist sie dann in die Einbettungsschicht ein, um Nutzervektoren zu erzeugen, einschließlich Vektoren der Nutzerinteressen und des Nutzerverhaltens. Anschließend werden die Vektoren des Nutzerverhaltens in die Multi-Interest-Extraktionsschicht eingespeist, um Nutzerinteressen-Kapseln zu erzeugen. Nach der Verkettung der Nutzerinteressen-Kapseln mit den Einbettungen des Nutzerverhaltens und der Verwendung mehrerer ReLU-Schichten zu deren Transformation gibt MIND mehrere Vektoren zur Nutzerrepräsentation aus. In diesem Projekt wurde festgelegt, dass MIND letztendlich vier Vektoren zur Nutzerrepräsentation ausgeben wird.</p>
<p>Auf der anderen Seite durchlaufen die Produkteigenschaften die Einbettungsschicht und werden in spärliche Item-Vektoren umgewandelt. Dann durchläuft jeder Item-Vektor eine Pooling-Schicht, um zu einem dichten Vektor zu werden.</p>
<p>Wenn alle Daten in Vektoren umgewandelt sind, wird eine zusätzliche markierungsbewusste Aufmerksamkeitsschicht eingeführt, um den Trainingsprozess zu steuern.</p>
<h3 id="PaddleRec" class="common-anchor-header">PaddleRec</h3><p><a href="https://github.com/PaddlePaddle/PaddleRec/blob/release/2.2.0/README_EN.md">PaddleRec</a> ist eine groß angelegte Suchmodellbibliothek für Empfehlungen. Sie ist Teil des Baidu <a href="https://github.com/PaddlePaddle/Paddle">PaddlePaddle-Ökosystems</a>. PaddleRec zielt darauf ab, Entwicklern eine integrierte Lösung zur Verfügung zu stellen, um ein Empfehlungssystem auf einfache und schnelle Weise zu erstellen.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_35f7526ea7.png" alt="5.png" class="doc-image" id="5.png" />
   </span> <span class="img-wrapper"> <span>5.png</span> </span></p>
<p>Wie im ersten Absatz erwähnt, sehen sich Ingenieure, die Empfehlungssysteme entwickeln, oft mit den Herausforderungen einer schlechten Benutzerfreundlichkeit und einer komplizierten Bereitstellung des Systems konfrontiert. PaddleRec kann den Entwicklern jedoch in den folgenden Punkten helfen:</p>
<ul>
<li><p>Benutzerfreundlichkeit: PaddleRec ist eine Open-Source-Bibliothek, die verschiedene in der Branche gängige Modelle kapselt, darunter Modelle für Kandidatengenerierung, Ranking, Reranking, Multitasking und mehr. Mit PaddleRec können Sie die Wirksamkeit des Modells sofort testen und seine Effizienz durch Iteration verbessern. PaddleRec bietet Ihnen eine einfache Möglichkeit, Modelle für verteilte Systeme mit hervorragender Leistung zu trainieren. Es ist für die Verarbeitung großer Datenmengen mit spärlichen Vektoren optimiert. Sie können PaddleRec problemlos horizontal skalieren und seine Rechengeschwindigkeit beschleunigen. Daher können Sie mit PaddleRec schnell Trainingsumgebungen auf Kubernetes aufbauen.</p></li>
<li><p>Unterstützung für die Bereitstellung: PaddleRec bietet Online-Bereitstellungslösungen für seine Modelle. Die Modelle sind nach dem Training sofort einsatzbereit und zeichnen sich durch Flexibilität und hohe Verfügbarkeit aus.</p></li>
</ul>
<h3 id="Milvus" class="common-anchor-header">Milvus</h3><p><a href="https://milvus.io/docs/v2.0.x/overview.md">Milvus</a> ist eine Vektordatenbank mit einer Cloud-nativen Architektur. Sie steht auf <a href="https://github.com/milvus-io">GitHub</a> als Open Source zur Verfügung und kann zum Speichern, Indizieren und Verwalten umfangreicher Einbettungsvektoren verwendet werden, die von tiefen neuronalen Netzen und anderen Modellen des maschinellen Lernens (ML) erzeugt werden. Milvus kapselt mehrere erstklassige ANN-Suchbibliotheken (Approximate Nearest Neighbour), darunter Faiss, NMSLIB und Annoy. Sie können Milvus auch je nach Bedarf skalieren. Der Milvus-Dienst ist hochverfügbar und unterstützt eine einheitliche Batch- und Stream-Verarbeitung. Milvus hat sich zum Ziel gesetzt, den Prozess der Verwaltung unstrukturierter Daten zu vereinfachen und eine konsistente Benutzererfahrung in verschiedenen Einsatzumgebungen zu bieten. Milvus verfügt über die folgenden Merkmale:</p>
<ul>
<li><p>Hohe Leistung bei der Durchführung von Vektorsuchen in großen Datensätzen.</p></li>
<li><p>Eine auf Entwickler ausgerichtete Community, die mehrsprachige Unterstützung und Toolchain bietet.</p></li>
<li><p>Skalierbarkeit in der Cloud und hohe Zuverlässigkeit auch im Falle einer Störung.</p></li>
<li><p>Hybride Suche durch Kombination von skalarer Filterung und vektorieller Ähnlichkeitssuche.</p></li>
</ul>
<p>Milvus wird in diesem Projekt für die Vektorähnlichkeitssuche und das Vektormanagement verwendet, da es das Problem der häufigen Datenaktualisierungen lösen kann und gleichzeitig die Systemstabilität aufrechterhält.</p>
<h2 id="System-implementation" class="common-anchor-header">Implementierung des Systems<button data-href="#System-implementation" class="anchor-icon" translate="no">
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
    </button></h2><p>Um das Produktempfehlungssystem in diesem Projekt aufzubauen, müssen Sie die folgenden Schritte durchlaufen:</p>
<ol>
<li>Datenverarbeitung</li>
<li>Modell-Training</li>
<li>Testen des Modells</li>
<li>Generierung von Produktkandidaten<ol>
<li>Datenspeicherung: Artikelvektoren werden durch das trainierte Modell gewonnen und in Milvus gespeichert.</li>
<li>Datensuche: Vier von MIND generierte Nutzervektoren werden in Milvus für die Vektorähnlichkeitssuche eingegeben.</li>
<li>Daten-Ranking: Jeder der vier Vektoren hat seine eigenen <code translate="no">top_k</code> ähnlichen Elementvektoren, und vier Sätze von <code translate="no">top_k</code> Vektoren werden in eine Rangfolge gebracht, um eine endgültige Liste der <code translate="no">top_k</code> ähnlichsten Vektoren zu erhalten.</li>
</ol></li>
</ol>
<p>Der Quellcode dieses Projekts wird auf der <a href="https://aistudio.baidu.com/aistudio/projectdetail/2250360?contributionType=1&amp;shared=1">Baidu AI Studio</a> Plattform gehostet. Im folgenden Abschnitt wird der Quellcode für dieses Projekt ausführlich erläutert.</p>
<h3 id="Step-1-Data-processing" class="common-anchor-header">Schritt 1. Verarbeitung der Daten</h3><p>Der Originaldatensatz stammt aus dem Amazon-Buchdatensatz, der von <a href="https://github.com/THUDM/ComiRec">ComiRec</a> zur Verfügung gestellt wurde. Dieses Projekt verwendet jedoch die Daten, die von PaddleRec heruntergeladen und verarbeitet wurden. Weitere Informationen finden Sie unter dem <a href="https://github.com/PaddlePaddle/PaddleRec/tree/release/2.1.0/datasets/AmazonBook">AmazonBook-Datensatz</a> im PaddleRec-Projekt.</p>
<p>Es wird erwartet, dass der Datensatz für das Training das folgende Format hat, wobei jede Spalte Folgendes darstellt:</p>
<ul>
<li><code translate="no">Uid</code>: Benutzer-ID.</li>
<li><code translate="no">item_id</code>: ID des Produktartikels, auf den der Benutzer geklickt hat.</li>
<li><code translate="no">Time</code>: Der Zeitstempel oder die Reihenfolge des Klicks.</li>
</ul>
<p>Der Datensatz für die Tests sollte das folgende Format haben, wobei jede Spalte Folgendes darstellt:</p>
<ul>
<li><p><code translate="no">Uid</code>: Benutzer-ID.</p></li>
<li><p><code translate="no">hist_item</code>: ID des Produktartikels im historischen Klickverhalten des Benutzers. Wenn es mehrere <code translate="no">hist_item</code> gibt, werden sie nach dem Zeitstempel sortiert.</p></li>
<li><p><code translate="no">eval_item</code>: Die tatsächliche Reihenfolge, in der der Benutzer die Produkte anklickt.</p></li>
</ul>
<h3 id="Step-2-Model-training" class="common-anchor-header">Schritt 2. Modell-Training</h3><p>Für das Modelltraining werden die im vorherigen Schritt verarbeiteten Daten verwendet und das auf PaddleRec aufbauende Kandidatengenerierungsmodell MIND eingesetzt.</p>
<h4 id="1-Model-input" class="common-anchor-header">1. <strong>Modell-Eingabe</strong></h4><p>Führen Sie in <code translate="no">dygraph_model.py</code> den folgenden Code aus, um die Daten zu verarbeiten und sie in Modelleingaben umzuwandeln. Dieser Prozess sortiert die Elemente, die von demselben Benutzer in den Originaldaten angeklickt wurden, nach dem Zeitstempel und kombiniert sie zu einer Sequenz. Dann wird zufällig ein <code translate="no">item``_``id</code> aus der Sequenz als <code translate="no">target_item</code> ausgewählt, und die 10 Elemente vor <code translate="no">target_item</code> werden als <code translate="no">hist_item</code> für die Modelleingabe extrahiert. Wenn die Sequenz nicht lang genug ist, kann sie auf 0 gesetzt werden. <code translate="no">seq_len</code> sollte die tatsächliche Länge der Sequenz <code translate="no">hist_item</code> sein.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">create_feeds_train</span>(<span class="hljs-params">self, batch_data</span>):
    hist_item = paddle.to_tensor(batch_data[<span class="hljs-number">0</span>], dtype=<span class="hljs-string">&quot;int64&quot;</span>)
    target_item = paddle.to_tensor(batch_data[<span class="hljs-number">1</span>], dtype=<span class="hljs-string">&quot;int64&quot;</span>)
    seq_len = paddle.to_tensor(batch_data[<span class="hljs-number">2</span>], dtype=<span class="hljs-string">&quot;int64&quot;</span>)
    <span class="hljs-keyword">return</span> [hist_item, target_item, seq_len]
<button class="copy-code-btn"></button></code></pre>
<p>Den Code zum Lesen des Originaldatensatzes finden Sie im Skript <code translate="no">/home/aistudio/recommend/model/mind/mind_reader.py</code>.</p>
<h4 id="2-Model-networking" class="common-anchor-header">2. <strong>Modellvernetzung</strong></h4><p>Der folgende Code ist ein Auszug aus <code translate="no">net.py</code>. <code translate="no">class Mind_Capsual_Layer</code> definiert die Multi-Interest-Extraktionsschicht, die auf dem Zinskapsel-Routing-Mechanismus aufbaut. Die Funktion <code translate="no">label_aware_attention()</code> implementiert die label-aware attention-Technik im MIND-Algorithmus. Die Funktion <code translate="no">forward()</code> in <code translate="no">class MindLayer</code> modelliert die Benutzereigenschaften und erzeugt entsprechende Gewichtsvektoren.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">class</span> <span class="hljs-title class_">Mind_Capsual_Layer</span>(nn.Layer):
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self</span>):
        <span class="hljs-built_in">super</span>(Mind_Capsual_Layer, <span class="hljs-variable language_">self</span>).__init__()
        <span class="hljs-variable language_">self</span>.iters = iters
        <span class="hljs-variable language_">self</span>.input_units = input_units
        <span class="hljs-variable language_">self</span>.output_units = output_units
        <span class="hljs-variable language_">self</span>.maxlen = maxlen
        <span class="hljs-variable language_">self</span>.init_std = init_std
        <span class="hljs-variable language_">self</span>.k_max = k_max
        <span class="hljs-variable language_">self</span>.batch_size = batch_size
        <span class="hljs-comment"># B2I routing</span>
        <span class="hljs-variable language_">self</span>.routing_logits = <span class="hljs-variable language_">self</span>.create_parameter(
            shape=[<span class="hljs-number">1</span>, <span class="hljs-variable language_">self</span>.k_max, <span class="hljs-variable language_">self</span>.maxlen],
            attr=paddle.ParamAttr(
                name=<span class="hljs-string">&quot;routing_logits&quot;</span>, trainable=<span class="hljs-literal">False</span>),
            default_initializer=nn.initializer.Normal(
                mean=<span class="hljs-number">0.0</span>, std=<span class="hljs-variable language_">self</span>.init_std))
        <span class="hljs-comment"># bilinear mapping</span>
        <span class="hljs-variable language_">self</span>.bilinear_mapping_matrix = <span class="hljs-variable language_">self</span>.create_parameter(
            shape=[<span class="hljs-variable language_">self</span>.input_units, <span class="hljs-variable language_">self</span>.output_units],
            attr=paddle.ParamAttr(
                name=<span class="hljs-string">&quot;bilinear_mapping_matrix&quot;</span>, trainable=<span class="hljs-literal">True</span>),
            default_initializer=nn.initializer.Normal(
                mean=<span class="hljs-number">0.0</span>, std=<span class="hljs-variable language_">self</span>.init_std))
                
<span class="hljs-keyword">class</span> <span class="hljs-title class_">MindLayer</span>(nn.Layer):

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">label_aware_attention</span>(<span class="hljs-params">self, keys, query</span>):
        weight = paddle.<span class="hljs-built_in">sum</span>(keys * query, axis=-<span class="hljs-number">1</span>, keepdim=<span class="hljs-literal">True</span>)
        weight = paddle.<span class="hljs-built_in">pow</span>(weight, <span class="hljs-variable language_">self</span>.pow_p)  <span class="hljs-comment"># [x,k_max,1]</span>
        weight = F.softmax(weight, axis=<span class="hljs-number">1</span>)
        output = paddle.<span class="hljs-built_in">sum</span>(keys * weight, axis=<span class="hljs-number">1</span>)
        <span class="hljs-keyword">return</span> output, weight

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">forward</span>(<span class="hljs-params">self, hist_item, seqlen, labels=<span class="hljs-literal">None</span></span>):
        hit_item_emb = <span class="hljs-variable language_">self</span>.item_emb(hist_item)  <span class="hljs-comment"># [B, seqlen, embed_dim]</span>
        user_cap, cap_weights, cap_mask = <span class="hljs-variable language_">self</span>.capsual_layer(hit_item_emb, seqlen)
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> <span class="hljs-variable language_">self</span>.training:
            <span class="hljs-keyword">return</span> user_cap, cap_weights
        target_emb = <span class="hljs-variable language_">self</span>.item_emb(labels)
        user_emb, W = <span class="hljs-variable language_">self</span>.label_aware_attention(user_cap, target_emb)

        <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.sampled_softmax(
            user_emb, labels, <span class="hljs-variable language_">self</span>.item_emb.weight,
            <span class="hljs-variable language_">self</span>.embedding_bias), W, user_cap, cap_weights, cap_mask
<button class="copy-code-btn"></button></code></pre>
<p>Die spezifische Netzwerkstruktur von MIND finden Sie im Skript <code translate="no">/home/aistudio/recommend/model/mind/net.py</code>.</p>
<h4 id="3-Model-optimization" class="common-anchor-header">3. <strong>Optimierung des Modells</strong></h4><p>Dieses Projekt verwendet den <a href="https://arxiv.org/pdf/1412.6980">Adam-Algorithmus</a> als Modelloptimierer.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">create_optimizer</span>(<span class="hljs-params">self, dy_model, config</span>):
    lr = config.get(<span class="hljs-string">&quot;hyper_parameters.optimizer.learning_rate&quot;</span>, <span class="hljs-number">0.001</span>)
    optimizer = paddle.optimizer.Adam(
        learning_rate=lr, parameters=dy_model.parameters())
    <span class="hljs-keyword">return</span> optimizer
<button class="copy-code-btn"></button></code></pre>
<p>Darüber hinaus schreibt PaddleRec Hyperparameter in <code translate="no">config.yaml</code>, so dass Sie nur diese Datei ändern müssen, um einen klaren Vergleich zwischen der Effektivität der beiden Modelle zu sehen und die Modelleffizienz zu verbessern. Beim Training des Modells kann die schlechte Modellwirkung auf eine Unter- oder Überanpassung des Modells zurückzuführen sein. Sie können dies daher verbessern, indem Sie die Anzahl der Trainingsrunden ändern. In diesem Projekt müssen Sie nur den Parameter Epochen in <code translate="no">config.yaml</code> ändern, um die perfekte Anzahl von Trainingsrunden zu finden. Darüber hinaus können Sie auch den Modell-Optimierer, <code translate="no">optimizer.class</code>, oder <code translate="no">learning_rate</code> zur Fehlersuche ändern. Im Folgenden wird ein Teil der Parameter in <code translate="no">config.yaml</code> gezeigt.</p>
<pre><code translate="no" class="language-YAML">runner:
  use_gpu: <span class="hljs-literal">True</span>
  use_auc: <span class="hljs-literal">False</span>
  train_batch_size: <span class="hljs-number">128</span>
  epochs: <span class="hljs-number">20</span>
  print_interval: <span class="hljs-number">10</span>
  model_save_path: <span class="hljs-string">&quot;output_model_mind&quot;</span>

<span class="hljs-comment"># hyper parameters of user-defined network</span>
hyper_parameters:
  <span class="hljs-comment"># optimizer config</span>
  optimizer:
    <span class="hljs-keyword">class</span>: Adam
    learning_rate: <span class="hljs-number">0.005</span>
<button class="copy-code-btn"></button></code></pre>
<p>Die detaillierte Implementierung finden Sie in dem Skript <code translate="no">/home/aistudio/recommend/model/mind/dygraph_model.py</code>.</p>
<h4 id="4-Model-training" class="common-anchor-header">4. <strong>Modell-Training</strong></h4><p>Führen Sie den folgenden Befehl aus, um das Modelltraining zu starten.</p>
<pre><code translate="no" class="language-Bash">python -u trainer.py -m mind/config.yaml
<button class="copy-code-btn"></button></code></pre>
<p>Siehe <code translate="no">/home/aistudio/recommend/model/trainer.py</code> für das Modelltrainingsprojekt.</p>
<h3 id="Step-3-Model-testing" class="common-anchor-header">Schritt 3. Testen des Modells</h3><p>In diesem Schritt wird ein Testdatensatz verwendet, um die Leistung, z. B. die Wiedererkennungsrate des trainierten Modells, zu überprüfen.</p>
<p>Während des Modelltests werden alle Elementvektoren aus dem Modell geladen und dann in Milvus, die Open-Source-Vektordatenbank, importiert. Lesen Sie den Testdatensatz über das Skript <code translate="no">/home/aistudio/recommend/model/mind/mind_infer_reader.py</code>. Laden Sie das Modell im vorherigen Schritt und füttern Sie den Testdatensatz in das Modell, um vier Interessenvektoren des Nutzers zu erhalten. Suchen Sie in Milvus nach den 50 Item-Vektoren, die den vier Interessenvektoren am ähnlichsten sind. Sie können die zurückgegebenen Ergebnisse den Benutzern empfehlen.</p>
<p>Führen Sie den folgenden Befehl aus, um das Modell zu testen.</p>
<pre><code translate="no" class="language-Bash">python -u infer.py -m mind/config.yaml -top_n 50
<button class="copy-code-btn"></button></code></pre>
<p>Während des Modelltests stellt das System mehrere Indikatoren zur Bewertung der Modelleffektivität bereit, z. B. Recall@50, NDCG@50 und HitRate@50. In diesem Artikel wird nur das Ändern eines Parameters vorgestellt. In Ihrem eigenen Anwendungsszenario müssen Sie jedoch mehr Epochen trainieren, um eine bessere Modellwirkung zu erzielen.  Sie können die Modelleffektivität auch verbessern, indem Sie verschiedene Optimierer verwenden, unterschiedliche Lernraten einstellen und die Anzahl der Testrunden erhöhen. Es wird empfohlen, mehrere Modelle mit unterschiedlichen Effekten zu speichern und dann dasjenige mit der besten Leistung auszuwählen, das am besten zu Ihrer Anwendung passt.</p>
<h3 id="Step-4-Generating-product-item-candidates" class="common-anchor-header">Schritt 4. Generierung von Kandidaten für Produktartikel</h3><p>Um den Dienst zur Generierung von Produktkandidaten zu erstellen, verwendet dieses Projekt das in den vorherigen Schritten trainierte Modell, gepaart mit Milvus. Während der Kandidatengenerierung wird FASTAPI als Schnittstelle verwendet. Wenn der Dienst startet, können Sie über <code translate="no">curl</code> direkt Befehle im Terminal ausführen.</p>
<p>Führen Sie den folgenden Befehl aus, um vorläufige Kandidaten zu generieren.</p>
<pre><code translate="no" class="language-Bash">uvicorn main:app
<button class="copy-code-btn"></button></code></pre>
<p>Der Dienst bietet vier Arten von Schnittstellen:</p>
<ul>
<li><strong>Einfügen</strong>: Führen Sie den folgenden Befehl aus, um die Elementvektoren aus Ihrem Modell zu lesen und sie in eine Sammlung in Milvus einzufügen.</li>
</ul>
<pre><code translate="no" class="language-Nginx">curl -X <span class="hljs-string">&#x27;POST&#x27;</span> \
  <span class="hljs-string">&#x27;http://127.0.0.1:8000/rec/insert_data&#x27;</span> \
  -H <span class="hljs-string">&#x27;accept: application/json&#x27;</span> \
  -d <span class="hljs-string">&#x27;&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Vorläufige Kandidaten generieren</strong>: Geben Sie die Reihenfolge ein, in der Produkte vom Benutzer angeklickt werden, und ermitteln Sie das nächste Produkt, das der Benutzer anklicken könnte. Sie können auch Produktkandidaten in Stapeln für mehrere Benutzer auf einmal generieren. <code translate="no">hist_item</code> im folgenden Befehl ist ein zweidimensionaler Vektor, und jede Zeile stellt eine Sequenz von Produkten dar, die der Benutzer in der Vergangenheit angeklickt hat. Sie können die Länge der Sequenz festlegen. Die zurückgegebenen Ergebnisse sind ebenfalls Sätze von zweidimensionalen Vektoren, wobei jede Zeile die zurückgegebenen <code translate="no">item id</code>s für Benutzer darstellt.</li>
</ul>
<pre><code translate="no" class="language-Ada">curl -X <span class="hljs-string">&#x27;POST&#x27;</span> \
  <span class="hljs-string">&#x27;http://127.0.0.1:8000/rec/recall&#x27;</span> \
  -H <span class="hljs-string">&#x27;accept: application/json&#x27;</span> \
  -H <span class="hljs-string">&#x27;Content-Type: application/json&#x27;</span> \
  -d <span class="hljs-string">&#x27;{
  &quot;top_k&quot;: 50,
  &quot;hist_item&quot;: [[43,23,65,675,3456,8654,123454,54367,234561],[675,3456,8654,123454,76543,1234,9769,5670,65443,123098,34219,234098]]
}&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Abfrage der Gesamtzahl der</strong> <strong>Produktartikel</strong>: Führen Sie den folgenden Befehl aus, um die Gesamtzahl der in der Milvus-Datenbank gespeicherten Artikelvektoren zu ermitteln.</li>
</ul>
<pre><code translate="no" class="language-Nginx">curl -X <span class="hljs-string">&#x27;POST&#x27;</span> \
  <span class="hljs-string">&#x27;http://127.0.0.1:8000/rec/count&#x27;</span> \
  -H <span class="hljs-string">&#x27;accept: application/json&#x27;</span> \
  -d <span class="hljs-string">&#x27;&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Löschen</strong>: Führen Sie den folgenden Befehl aus, um alle in der Milvus-Datenbank gespeicherten Daten zu löschen.</li>
</ul>
<pre><code translate="no" class="language-Nginx">curl -X <span class="hljs-string">&#x27;POST&#x27;</span> \
  <span class="hljs-string">&#x27;http://127.0.0.1:8000/qa/drop&#x27;</span> \
  -H <span class="hljs-string">&#x27;accept: application/json&#x27;</span> \
  -d <span class="hljs-string">&#x27;&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Wenn Sie den Kandidatengenerierungsdienst auf Ihrem lokalen Server ausführen, können Sie die oben genannten Schnittstellen auch unter <code translate="no">127.0.0.1:8000/docs</code> aufrufen. Klicken Sie auf die vier Schnittstellen und geben Sie die Werte für die Parameter ein, um sie auszuprobieren. Klicken Sie dann auf "Ausprobieren", um das Ergebnis der Empfehlung zu erhalten.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_43e41086f8.png" alt="6.png" class="doc-image" id="6.png" />
   </span> <span class="img-wrapper"> <span>6.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_f016a3221d.png" alt="7.png" class="doc-image" id="7.png" />
   </span> <span class="img-wrapper"> <span>7.png</span> </span></p>
<h2 id="Recap" class="common-anchor-header">Rekapitulation<button data-href="#Recap" class="anchor-icon" translate="no">
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
    </button></h2><p>Dieser Artikel konzentriert sich hauptsächlich auf die erste Phase der Kandidatengenerierung beim Aufbau eines Empfehlungssystems. Er bietet auch eine Lösung zur Beschleunigung dieses Prozesses durch die Kombination von Milvus mit dem MIND-Algorithmus und PaddleRec und hat damit das im ersten Absatz angesprochene Problem gelöst.</p>
<p>Was ist, wenn das System aufgrund der enormen Menge an Datensätzen extrem langsam ist, wenn es Ergebnisse liefert? Milvus, die Open-Source-Vektordatenbank, ist für eine blitzschnelle Ähnlichkeitssuche in dichten Vektordatensätzen mit Millionen, Milliarden oder sogar Billionen von Vektoren konzipiert.</p>
<p>Was ist, wenn neu eingefügte Daten nicht in Echtzeit für die Suche oder Abfrage verarbeitet werden können? Sie können Milvus verwenden, da es eine einheitliche Batch- und Stream-Verarbeitung unterstützt und es Ihnen ermöglicht, neu eingefügte Daten in Echtzeit zu suchen und abzufragen. Außerdem ist das MIND-Modell in der Lage, neues Benutzerverhalten in Echtzeit zu konvertieren und die Benutzervektoren sofort in Milvus einzufügen.</p>
<p>Was tun, wenn die komplizierte Bereitstellung zu einschüchternd ist? PaddleRec, eine leistungsstarke Bibliothek, die zum PaddlePaddle-Ökosystem gehört, kann Ihnen eine integrierte Lösung bieten, mit der Sie Ihr Empfehlungssystem oder andere Anwendungen auf einfache und schnelle Weise einsetzen können.</p>
<h2 id="About-the-author" class="common-anchor-header">Über den Autor<button data-href="#About-the-author" class="anchor-icon" translate="no">
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
    </button></h2><p>Yunmei Li, Zilliz Data Engineer, hat einen Abschluss in Informatik von der Huazhong University of Science and Technology. Seit sie zu Zilliz gekommen ist, arbeitet sie an der Erforschung von Lösungen für das Open-Source-Projekt Milvus und hilft Benutzern, Milvus in realen Szenarien anzuwenden. Ihr Hauptaugenmerk liegt auf NLP und Empfehlungssystemen, und sie möchte ihren Fokus auf diese beiden Bereiche weiter vertiefen. Sie verbringt gerne Zeit alleine und liest.</p>
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
<li>Weitere Anwendungsfälle für den Aufbau eines Empfehlungssystems:<ul>
<li><a href="https://milvus.io/blog/building-a-personalized-product-recommender-system-with-vipshop-and-milvus.md">Aufbau eines personalisierten Produktempfehlungssystems mit Vipshop mit Milvus</a></li>
<li><a href="https://milvus.io/blog/building-a-wardrobe-and-outfit-planning-app-with-milvus.md">Erstellung einer App zur Kleiderschrank- und Outfitplanung mit Milvus</a></li>
<li><a href="https://milvus.io/blog/building-an-intelligent-news-recommendation-system-inside-sohu-news-app.md">Aufbau eines intelligenten Nachrichtenempfehlungssystems innerhalb der Sohu News App</a></li>
<li><a href="https://milvus.io/blog/music-recommender-system-item-based-collaborative-filtering-milvus.md">Item-basiertes kollaboratives Filtern für ein Musik-Empfehlungssystem</a></li>
<li><a href="https://milvus.io/blog/Making-with-Milvus-AI-Powered-News-Recommendation-Inside-Xiaomi-Mobile-Browser.md">Making with Milvus: KI-gestützte Nachrichtenempfehlung im mobilen Browser von Xiaomi</a></li>
</ul></li>
<li>Weitere Milvus-Projekte in Zusammenarbeit mit anderen Communities:<ul>
<li><a href="https://milvus.io/blog/2021-09-26-onnx.md">Kombinieren von KI-Modellen für die Bildsuche mit ONNX und Milvus</a></li>
<li><a href="https://milvus.io/blog/graph-based-recommendation-system-with-milvus.md">Aufbau eines graphenbasierten Empfehlungssystems mit Milvus, PinSage, DGL und Movielens-Datensätzen</a></li>
<li><a href="https://milvus.io/blog/building-a-milvus-cluster-based-on-juicefs.md">Aufbau eines Milvus-Clusters auf Basis von JuiceFS</a></li>
</ul></li>
<li>Beteiligen Sie sich an unserer Open-Source-Community:<ul>
<li>Finden Sie Milvus auf <a href="https://bit.ly/307b7jC">GitHub</a> oder tragen Sie dazu bei</li>
<li>Interagieren Sie mit der Community über das <a href="https://bit.ly/3qiyTEk">Forum</a></li>
<li>Verbinden Sie sich mit uns auf <a href="https://bit.ly/3ob7kd8">Twitter</a></li>
</ul></li>
</ul>
