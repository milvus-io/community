---
id: >-
  2021-11-26-accelerating-candidate-generation-in-recommender-systems-using-milvus-paired-with-paddlepaddle.md
title: >-
  Accelerare la generazione di candidati nei sistemi di raccomandazione usando
  Milvus e PaddlePaddle
author: Yunmei
date: 2021-11-26T00:00:00.000Z
desc: il flusso di lavoro minimo di un sistema di raccomandazione
cover: assets.zilliz.com/Candidate_generation_9baf7beb86.png
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/accelerating-candidate-generation-in-recommender-systems-using-milvus-paired-with-paddlepaddle
---
<p>Se avete esperienza nello sviluppo di un sistema di raccomandazione, è probabile che siate stati vittime di almeno uno dei seguenti problemi:</p>
<ul>
<li>Il sistema è estremamente lento nel restituire i risultati a causa dell'enorme quantità di set di dati.</li>
<li>I nuovi dati inseriti non possono essere elaborati in tempo reale per la ricerca o l'interrogazione.</li>
<li>L'implementazione del sistema di raccomandazione è scoraggiante.</li>
</ul>
<p>Questo articolo si propone di affrontare i problemi sopra menzionati e di fornire alcuni spunti di riflessione introducendo un progetto di sistema di raccomandazione di prodotti che utilizza Milvus, un database vettoriale open-source, abbinato a PaddlePaddle, una piattaforma di deep learning.</p>
<p>Questo articolo si propone di descrivere brevemente il flusso di lavoro minimo di un sistema di raccomandazione. Poi passa a presentare i componenti principali e i dettagli di implementazione di questo progetto.</p>
<h2 id="The-basic-workflow-of-a-recommender-system" class="common-anchor-header">Il flusso di lavoro di base di un sistema di raccomandazione<button data-href="#The-basic-workflow-of-a-recommender-system" class="anchor-icon" translate="no">
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
    </button></h2><p>Prima di addentrarci nel progetto stesso, diamo prima un'occhiata al flusso di lavoro di base di un sistema di raccomandazione. Un sistema di raccomandazione può restituire risultati personalizzati in base agli interessi e alle esigenze dell'utente. Per creare tali raccomandazioni personalizzate, il sistema passa attraverso due fasi, la generazione dei candidati e la classificazione.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_29e27eb9b1.png" alt="2.png" class="doc-image" id="2.png" />
   </span> <span class="img-wrapper"> <span>2.png</span> </span></p>
<p>La prima fase è la generazione dei candidati, che restituisce i dati più rilevanti o simili, come un prodotto o un video che corrisponde al profilo dell'utente. Durante la generazione dei candidati, il sistema confronta le caratteristiche dell'utente con i dati memorizzati nel suo database e recupera quelli simili. Poi, durante la classificazione, il sistema assegna un punteggio e riordina i dati recuperati. Infine, i risultati in cima alla lista vengono mostrati agli utenti.</p>
<p>Nel nostro caso di un sistema di raccomandazione di prodotti, il sistema confronta innanzitutto il profilo dell'utente con le caratteristiche dei prodotti in inventario per filtrare un elenco di prodotti che rispondono alle esigenze dell'utente. Quindi il sistema assegna un punteggio ai prodotti in base alla loro somiglianza con il profilo dell'utente, li classifica e infine restituisce all'utente i 10 prodotti migliori.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_5850ba2c46.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span></p>
<h2 id="System-architecture" class="common-anchor-header">Architettura del sistema<button data-href="#System-architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>Il sistema di raccomandazione dei prodotti di questo progetto utilizza tre componenti: MIND, PaddleRec e Milvus.</p>
<h3 id="MIND" class="common-anchor-header">MIND</h3><p><a href="https://arxiv.org/pdf/1904.08030">MIND</a>, acronimo di &quot;Multi-Interest Network with Dynamic Routing for Recommendation at Tmall&quot;, è un algoritmo sviluppato da Alibaba Group. Prima della proposta di MIND, la maggior parte dei modelli di AI prevalenti per la raccomandazione utilizzava un singolo vettore per rappresentare i vari interessi di un utente. Tuttavia, un singolo vettore non è sufficiente a rappresentare esattamente gli interessi di un utente. Pertanto, è stato proposto l'algoritmo MIND per trasformare gli interessi multipli di un utente in diversi vettori.</p>
<p>In particolare, MIND adotta una <a href="https://arxiv.org/pdf/2005.09347">rete multi-interesse</a> con routing dinamico per elaborare gli interessi multipli di un utente durante la fase di generazione dei candidati. La rete multi-interesse è un livello di estrattore multi-interesse costruito su un meccanismo di instradamento a capsula. Può essere utilizzata per combinare i comportamenti passati di un utente con i suoi interessi multipli, per fornire un profilo utente accurato.</p>
<p>Il diagramma seguente illustra la struttura della rete di MIND.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_9e6f284ea2.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<p>Per rappresentare le caratteristiche degli utenti, MIND prende in input i comportamenti e gli interessi degli utenti e li inserisce nel livello di embedding per generare vettori di utenti, tra cui vettori di interessi e vettori di comportamenti degli utenti. I vettori di comportamento dell'utente vengono poi inseriti nel livello di estrazione multi-interesse per generare capsule di interessi degli utenti. Dopo aver concatenato le capsule di interesse dell'utente con gli embedding del comportamento dell'utente e aver utilizzato diversi livelli ReLU per trasformarli, MIND produce diversi vettori di rappresentazione dell'utente. Questo progetto ha definito che MIND produrrà quattro vettori di rappresentazione dell'utente.</p>
<p>D'altra parte, i tratti dei prodotti passano attraverso il livello di embedding e vengono convertiti in vettori di elementi sparsi. Quindi ogni vettore di elementi passa attraverso un livello di pooling per diventare un vettore denso.</p>
<p>Quando tutti i dati sono convertiti in vettori, viene introdotto un ulteriore livello di attenzione label-aware per guidare il processo di addestramento.</p>
<h3 id="PaddleRec" class="common-anchor-header">PaddleRec</h3><p><a href="https://github.com/PaddlePaddle/PaddleRec/blob/release/2.2.0/README_EN.md">PaddleRec</a> è una libreria di modelli di ricerca su larga scala per la raccomandazione. Fa parte dell'ecosistema Baidu <a href="https://github.com/PaddlePaddle/Paddle">PaddlePaddle</a>. PaddleRec mira a fornire agli sviluppatori una soluzione integrata per costruire un sistema di raccomandazione in modo semplice e rapido.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_35f7526ea7.png" alt="5.png" class="doc-image" id="5.png" />
   </span> <span class="img-wrapper"> <span>5.png</span> </span></p>
<p>Come accennato nel paragrafo iniziale, gli ingegneri che sviluppano sistemi di raccomandazione devono spesso affrontare le sfide della scarsa usabilità e della complicata implementazione del sistema. Tuttavia, PaddleRec può aiutare gli sviluppatori nei seguenti aspetti:</p>
<ul>
<li><p>Facilità d'uso: PaddleRec è una libreria open-source che racchiude diversi modelli popolari nel settore, tra cui quelli per la generazione di candidati, il ranking, il reranking, il multitasking e altri ancora. Con PaddleRec è possibile testare immediatamente l'efficacia del modello e migliorarne l'efficienza attraverso l'iterazione. PaddleRec offre un modo semplice per addestrare modelli per sistemi distribuiti con prestazioni eccellenti. È ottimizzato per l'elaborazione di dati su larga scala di vettori sparsi. È possibile scalare facilmente PaddleRec in orizzontale e accelerare la sua velocità di calcolo. Pertanto, è possibile creare rapidamente ambienti di addestramento su Kubernetes utilizzando PaddleRec.</p></li>
<li><p>Supporto per la distribuzione: PaddleRec offre soluzioni di distribuzione online per i suoi modelli. I modelli sono immediatamente pronti per l'uso dopo la formazione, con flessibilità e alta disponibilità.</p></li>
</ul>
<h3 id="Milvus" class="common-anchor-header">Milvus</h3><p><a href="https://milvus.io/docs/v2.0.x/overview.md">Milvus</a> è un database vettoriale con un'architettura cloud-native. È open source su <a href="https://github.com/milvus-io">GitHub</a> e può essere utilizzato per memorizzare, indicizzare e gestire vettori di incorporamento massivi generati da reti neurali profonde e altri modelli di apprendimento automatico (ML). Milvus incapsula diverse librerie di prima classe per la ricerca approssimata dei vicini (ANN), tra cui Faiss, NMSLIB e Annoy. È inoltre possibile scalare Milvus in base alle proprie esigenze. Il servizio Milvus è altamente disponibile e supporta l'elaborazione batch e stream unificata. Milvus si impegna a semplificare il processo di gestione dei dati non strutturati e a fornire un'esperienza utente coerente in diversi ambienti di distribuzione. Ha le seguenti caratteristiche:</p>
<ul>
<li><p>Elevate prestazioni quando si effettuano ricerche vettoriali su enormi insiemi di dati.</p></li>
<li><p>Una comunità di sviluppatori che offre supporto multilingue e toolchain.</p></li>
<li><p>Scalabilità nel cloud ed elevata affidabilità anche in caso di interruzioni.</p></li>
<li><p>Ricerca ibrida ottenuta accoppiando il filtraggio scalare con la ricerca di similarità vettoriale.</p></li>
</ul>
<p>In questo progetto viene utilizzato Milvus per la ricerca di similarità vettoriale e la gestione dei vettori, perché è in grado di risolvere il problema dei frequenti aggiornamenti dei dati mantenendo la stabilità del sistema.</p>
<h2 id="System-implementation" class="common-anchor-header">Implementazione del sistema<button data-href="#System-implementation" class="anchor-icon" translate="no">
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
    </button></h2><p>Per realizzare il sistema di raccomandazione dei prodotti in questo progetto, è necessario seguire le seguenti fasi:</p>
<ol>
<li>Elaborazione dei dati</li>
<li>Formazione del modello</li>
<li>Test del modello</li>
<li>Generazione di candidati di articoli di prodotto<ol>
<li>Memorizzazione dei dati: i vettori degli articoli sono ottenuti attraverso il modello addestrato e sono memorizzati in Milvus.</li>
<li>Ricerca dei dati: quattro vettori utente generati da MIND vengono inseriti in Milvus per la ricerca di similarità vettoriale.</li>
<li>Classificazione dei dati: ognuno dei quattro vettori ha i propri <code translate="no">top_k</code> vettori di elementi simili, e quattro gruppi di vettori <code translate="no">top_k</code> vengono classificati per restituire un elenco finale di <code translate="no">top_k</code> vettori più simili.</li>
</ol></li>
</ol>
<p>Il codice sorgente di questo progetto è ospitato sulla piattaforma <a href="https://aistudio.baidu.com/aistudio/projectdetail/2250360?contributionType=1&amp;shared=1">Baidu AI Studio</a>. La sezione seguente illustra in dettaglio il codice sorgente di questo progetto.</p>
<h3 id="Step-1-Data-processing" class="common-anchor-header">Fase 1. Elaborazione dei dati</h3><p>Il dataset originale proviene dal dataset di libri Amazon fornito da <a href="https://github.com/THUDM/ComiRec">ComiRec</a>. Tuttavia, questo progetto utilizza i dati scaricati ed elaborati da PaddleRec. Per ulteriori informazioni, consultare il <a href="https://github.com/PaddlePaddle/PaddleRec/tree/release/2.1.0/datasets/AmazonBook">dataset AmazonBook</a> nel progetto PaddleRec.</p>
<p>Il dataset per l'addestramento dovrebbe apparire nel seguente formato, con ogni colonna che rappresenta:</p>
<ul>
<li><code translate="no">Uid</code>: ID utente.</li>
<li><code translate="no">item_id</code>: ID del prodotto cliccato dall'utente.</li>
<li><code translate="no">Time</code>: Il timestamp o l'ordine di clic.</li>
</ul>
<p>Il set di dati per il test dovrebbe apparire nel seguente formato, con ogni colonna che rappresenta:</p>
<ul>
<li><p><code translate="no">Uid</code>: ID utente.</p></li>
<li><p><code translate="no">hist_item</code>: ID dell'articolo del prodotto nel comportamento storico di clic dell'utente. Quando ci sono più <code translate="no">hist_item</code>, sono ordinati in base al timestamp.</p></li>
<li><p><code translate="no">eval_item</code>: La sequenza effettiva in cui l'utente fa clic sui prodotti.</p></li>
</ul>
<h3 id="Step-2-Model-training" class="common-anchor-header">Fase 2. Formazione del modello</h3><p>L'addestramento del modello utilizza i dati elaborati nella fase precedente e adotta il modello di generazione dei candidati, MIND, costruito su PaddleRec.</p>
<h4 id="1-Model-input" class="common-anchor-header">1. <strong>Input</strong> <strong>del modello</strong> </h4><p>In <code translate="no">dygraph_model.py</code>, eseguire il seguente codice per elaborare i dati e trasformarli in input del modello. Questo processo ordina gli elementi cliccati dallo stesso utente nei dati originali in base al timestamp e li combina per formare una sequenza. Quindi, seleziona casualmente un <code translate="no">item``_``id</code> dalla sequenza come <code translate="no">target_item</code>, ed estrae i 10 elementi precedenti a <code translate="no">target_item</code> come <code translate="no">hist_item</code> per l'input del modello. Se la sequenza non è sufficientemente lunga, può essere impostata a 0. <code translate="no">seq_len</code> dovrebbe essere la lunghezza effettiva della sequenza <code translate="no">hist_item</code>.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">create_feeds_train</span>(<span class="hljs-params">self, batch_data</span>):
    hist_item = paddle.to_tensor(batch_data[<span class="hljs-number">0</span>], dtype=<span class="hljs-string">&quot;int64&quot;</span>)
    target_item = paddle.to_tensor(batch_data[<span class="hljs-number">1</span>], dtype=<span class="hljs-string">&quot;int64&quot;</span>)
    seq_len = paddle.to_tensor(batch_data[<span class="hljs-number">2</span>], dtype=<span class="hljs-string">&quot;int64&quot;</span>)
    <span class="hljs-keyword">return</span> [hist_item, target_item, seq_len]
<button class="copy-code-btn"></button></code></pre>
<p>Fare riferimento allo script <code translate="no">/home/aistudio/recommend/model/mind/mind_reader.py</code> per il codice di lettura del dataset originale.</p>
<h4 id="2-Model-networking" class="common-anchor-header">2. <strong>Collegamento in rete del modello</strong></h4><p>Il codice seguente è un estratto di <code translate="no">net.py</code>. <code translate="no">class Mind_Capsual_Layer</code> definisce il livello di estrazione multi-interesse costruito sul meccanismo di instradamento delle capsule di interesse. La funzione <code translate="no">label_aware_attention()</code> implementa la tecnica di attenzione label-aware dell'algoritmo MIND. La funzione <code translate="no">forward()</code> in <code translate="no">class MindLayer</code> modella le caratteristiche dell'utente e genera i vettori di peso corrispondenti.</p>
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
<p>Per la struttura specifica della rete MIND si rimanda allo script <code translate="no">/home/aistudio/recommend/model/mind/net.py</code>.</p>
<h4 id="3-Model-optimization" class="common-anchor-header">3. <strong>Ottimizzazione del modello</strong></h4><p>Questo progetto utilizza l'<a href="https://arxiv.org/pdf/1412.6980">algoritmo Adam</a> come ottimizzatore del modello.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">create_optimizer</span>(<span class="hljs-params">self, dy_model, config</span>):
    lr = config.get(<span class="hljs-string">&quot;hyper_parameters.optimizer.learning_rate&quot;</span>, <span class="hljs-number">0.001</span>)
    optimizer = paddle.optimizer.Adam(
        learning_rate=lr, parameters=dy_model.parameters())
    <span class="hljs-keyword">return</span> optimizer
<button class="copy-code-btn"></button></code></pre>
<p>Inoltre, PaddleRec scrive gli iperparametri in <code translate="no">config.yaml</code>, quindi è sufficiente modificare questo file per vedere un chiaro confronto tra l'efficacia dei due modelli e migliorare l'efficienza del modello. Durante l'addestramento del modello, lo scarso effetto del modello può derivare dall'underfitting o dall'overfitting del modello. È quindi possibile migliorarlo modificando il numero di cicli di addestramento. In questo progetto, è sufficiente modificare il parametro epochs in <code translate="no">config.yaml</code> per trovare il numero perfetto di cicli di addestramento. Inoltre, è possibile modificare anche l'ottimizzatore del modello, <code translate="no">optimizer.class</code> o <code translate="no">learning_rate</code> per il debug. Di seguito sono riportati alcuni dei parametri di <code translate="no">config.yaml</code>.</p>
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
<p>Per un'implementazione dettagliata si rimanda allo script <code translate="no">/home/aistudio/recommend/model/mind/dygraph_model.py</code>.</p>
<h4 id="4-Model-training" class="common-anchor-header">4. <strong>Formazione del modello</strong></h4><p>Eseguire il seguente comando per avviare l'addestramento del modello.</p>
<pre><code translate="no" class="language-Bash">python -u trainer.py -m mind/config.yaml
<button class="copy-code-btn"></button></code></pre>
<p>Fare riferimento a <code translate="no">/home/aistudio/recommend/model/trainer.py</code> per il progetto di formazione del modello.</p>
<h3 id="Step-3-Model-testing" class="common-anchor-header">Passo 3. Test del modello</h3><p>Questa fase utilizza un set di dati di prova per verificare le prestazioni, come il tasso di richiamo del modello addestrato.</p>
<p>Durante il test del modello, tutti i vettori degli item vengono caricati dal modello e poi importati in Milvus, il database vettoriale open source. Leggere il dataset di test attraverso lo script <code translate="no">/home/aistudio/recommend/model/mind/mind_infer_reader.py</code>. Caricare il modello nella fase precedente e inserire il dataset di prova nel modello per ottenere quattro vettori di interesse dell'utente. Cercare i 50 vettori di elementi più simili ai quattro vettori di interesse in Milvus. È possibile consigliare agli utenti i risultati restituiti.</p>
<p>Eseguire il seguente comando per testare il modello.</p>
<pre><code translate="no" class="language-Bash">python -u infer.py -m mind/config.yaml -top_n 50
<button class="copy-code-btn"></button></code></pre>
<p>Durante il test del modello, il sistema fornisce diversi indicatori per valutarne l'efficacia, come Recall@50, NDCG@50 e HitRate@50. Questo articolo introduce la modifica di un solo parametro. Tuttavia, nel proprio scenario applicativo, è necessario addestrare più epoche per migliorare l'efficacia del modello.  È possibile migliorare l'efficacia del modello anche utilizzando ottimizzatori diversi, impostando tassi di apprendimento diversi e aumentando il numero di cicli di test. Si consiglia di salvare più modelli con effetti diversi e di scegliere quello con le prestazioni migliori e più adatto alla propria applicazione.</p>
<h3 id="Step-4-Generating-product-item-candidates" class="common-anchor-header">Fase 4. Generazione di candidati di articoli di prodotto</h3><p>Per creare il servizio di generazione di candidati di prodotto, questo progetto utilizza il modello addestrato nelle fasi precedenti, abbinato a Milvus. Durante la generazione dei candidati, si utilizza FASTAPI per fornire l'interfaccia. Quando il servizio si avvia, è possibile eseguire direttamente i comandi nel terminale tramite <code translate="no">curl</code>.</p>
<p>Eseguire il seguente comando per generare candidati preliminari.</p>
<pre><code translate="no" class="language-Bash">uvicorn main:app
<button class="copy-code-btn"></button></code></pre>
<p>Il servizio fornisce quattro tipi di interfacce:</p>
<ul>
<li><strong>Inserisci</strong>: Eseguire il seguente comando per leggere i vettori di elementi dal modello e inserirli in una collezione in Milvus.</li>
</ul>
<pre><code translate="no" class="language-Nginx">curl -X <span class="hljs-string">&#x27;POST&#x27;</span> \
  <span class="hljs-string">&#x27;http://127.0.0.1:8000/rec/insert_data&#x27;</span> \
  -H <span class="hljs-string">&#x27;accept: application/json&#x27;</span> \
  -d <span class="hljs-string">&#x27;&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Genera candidati preliminari</strong>: Inserisce la sequenza in cui i prodotti vengono cliccati dall'utente e scopre il prodotto successivo che l'utente può cliccare. È anche possibile generare candidati di prodotti in lotti per diversi utenti in una sola volta. <code translate="no">hist_item</code> nel comando seguente è un vettore bidimensionale, e ogni riga rappresenta una sequenza di prodotti che l'utente ha cliccato in passato. È possibile definire la lunghezza della sequenza. Anche i risultati restituiti sono insiemi di vettori bidimensionali, ogni riga rappresenta i prodotti <code translate="no">item id</code>restituiti dagli utenti.</li>
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
<li><strong>Interrogare il numero totale di</strong> <strong>articoli del prodotto</strong>: Eseguire il seguente comando per ottenere il numero totale di vettori di articoli memorizzati nel database Milvus.</li>
</ul>
<pre><code translate="no" class="language-Nginx">curl -X <span class="hljs-string">&#x27;POST&#x27;</span> \
  <span class="hljs-string">&#x27;http://127.0.0.1:8000/rec/count&#x27;</span> \
  -H <span class="hljs-string">&#x27;accept: application/json&#x27;</span> \
  -d <span class="hljs-string">&#x27;&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Cancellare</strong>: Eseguire il seguente comando per cancellare tutti i dati memorizzati nel database Milvus.</li>
</ul>
<pre><code translate="no" class="language-Nginx">curl -X <span class="hljs-string">&#x27;POST&#x27;</span> \
  <span class="hljs-string">&#x27;http://127.0.0.1:8000/qa/drop&#x27;</span> \
  -H <span class="hljs-string">&#x27;accept: application/json&#x27;</span> \
  -d <span class="hljs-string">&#x27;&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Se si esegue il servizio di generazione dei candidati sul proprio server locale, è possibile accedere alle interfacce di cui sopra anche all'indirizzo <code translate="no">127.0.0.1:8000/docs</code>. Si può giocare facendo clic sulle quattro interfacce e inserendo i valori dei parametri. Quindi fare clic su "Prova" per ottenere il risultato della raccomandazione.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_43e41086f8.png" alt="6.png" class="doc-image" id="6.png" />
   </span> <span class="img-wrapper"> <span>6.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_f016a3221d.png" alt="7.png" class="doc-image" id="7.png" />
   </span> <span class="img-wrapper"> <span>7.png</span> </span></p>
<h2 id="Recap" class="common-anchor-header">Ricapitolazione<button data-href="#Recap" class="anchor-icon" translate="no">
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
    </button></h2><p>Questo articolo si concentra principalmente sulla prima fase della generazione dei candidati nella costruzione di un sistema di raccomandazione. Fornisce anche una soluzione per accelerare questo processo combinando Milvus con l'algoritmo MIND e PaddleRec e quindi ha affrontato il problema proposto nel paragrafo iniziale.</p>
<p>Cosa succede se il sistema è estremamente lento nel restituire i risultati a causa dell'enorme quantità di set di dati? Milvus, il database vettoriale open-source, è stato progettato per una ricerca di similarità rapidissima su dataset vettoriali densi, contenenti milioni, miliardi o addirittura trilioni di vettori.</p>
<p>E se i nuovi dati inseriti non possono essere elaborati in tempo reale per la ricerca o l'interrogazione? È possibile utilizzare Milvus in quanto supporta l'elaborazione batch e stream unificata e consente di cercare e interrogare i dati appena inseriti in tempo reale. Inoltre, il modello MIND è in grado di convertire in tempo reale i nuovi comportamenti degli utenti e di inserire istantaneamente i vettori utente in Milvus.</p>
<p>E se l'implementazione complicata è troppo intimidatoria? PaddleRec, una potente libreria appartenente all'ecosistema PaddlePaddle, può fornirvi una soluzione integrata per implementare il vostro sistema di raccomandazione o altre applicazioni in modo semplice e rapido.</p>
<h2 id="About-the-author" class="common-anchor-header">L'autore<button data-href="#About-the-author" class="anchor-icon" translate="no">
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
    </button></h2><p>Yunmei Li, Data Engineer di Zilliz, si è laureata in informatica presso la Huazhong University of Science and Technology. Da quando è entrata a far parte di Zilliz, ha lavorato all'esplorazione di soluzioni per il progetto open source Milvus e ha aiutato gli utenti ad applicare Milvus in scenari reali. La sua attenzione principale è rivolta all'NLP e ai sistemi di raccomandazione e vorrebbe approfondire ulteriormente queste due aree. Le piace passare il tempo da sola e leggere.</p>
<h2 id="Looking-for-more-resources" class="common-anchor-header">Cercate altre risorse?<button data-href="#Looking-for-more-resources" class="anchor-icon" translate="no">
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
<li>Altri casi d'uso sulla costruzione di un sistema di raccomandazione:<ul>
<li><a href="https://milvus.io/blog/building-a-personalized-product-recommender-system-with-vipshop-and-milvus.md">Costruire un sistema di raccomandazione di prodotti personalizzati con Vipshop con Milvus</a></li>
<li><a href="https://milvus.io/blog/building-a-wardrobe-and-outfit-planning-app-with-milvus.md">Creazione di un'app per la pianificazione del guardaroba e dell'abbigliamento con Milvus</a></li>
<li><a href="https://milvus.io/blog/building-an-intelligent-news-recommendation-system-inside-sohu-news-app.md">Creazione di un sistema intelligente di raccomandazione di notizie all'interno dell'app Sohu News</a></li>
<li><a href="https://milvus.io/blog/music-recommender-system-item-based-collaborative-filtering-milvus.md">Filtro collaborativo basato sugli elementi per un sistema di raccomandazione musicale</a></li>
<li><a href="https://milvus.io/blog/Making-with-Milvus-AI-Powered-News-Recommendation-Inside-Xiaomi-Mobile-Browser.md">Realizzazione con Milvus: raccomandazione di notizie alimentata dall'intelligenza artificiale all'interno del browser mobile di Xiaomi</a></li>
</ul></li>
<li>Altri progetti Milvus in collaborazione con altre comunità:<ul>
<li><a href="https://milvus.io/blog/2021-09-26-onnx.md">Combinare modelli di intelligenza artificiale per la ricerca di immagini utilizzando ONNX e Milvus</a></li>
<li><a href="https://milvus.io/blog/graph-based-recommendation-system-with-milvus.md">Creazione di un sistema di raccomandazione basato su grafici con i dataset Milvus, PinSage, DGL e Movielens</a></li>
<li><a href="https://milvus.io/blog/building-a-milvus-cluster-based-on-juicefs.md">Costruire un cluster Milvus basato su JuiceFS</a></li>
</ul></li>
<li>Impegnatevi con la nostra comunità open-source:<ul>
<li>Trova o contribuisci a Milvus su <a href="https://bit.ly/307b7jC">GitHub</a></li>
<li>Interagire con la comunità tramite il <a href="https://bit.ly/3qiyTEk">Forum</a></li>
<li>Connettersi con noi su <a href="https://bit.ly/3ob7kd8">Twitter</a></li>
</ul></li>
</ul>
