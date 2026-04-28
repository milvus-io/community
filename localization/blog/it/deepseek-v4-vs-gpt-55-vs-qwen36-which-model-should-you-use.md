---
id: deepseek-v4-vs-gpt-55-vs-qwen36-which-model-should-you-use.md
title: 'DeepSeek V4 vs GPT-5.5 vs Qwen3.6: Quale modello utilizzare?'
author: Lumina Wang
date: 2026-4-28
cover: assets.zilliz.com/blog_cover_narrow_1152x720_87d33982dd.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'DeepSeek V4, GPT-5.5 benchmark, Milvus RAG, Qwen3.6, vector database'
meta_title: |
  DeepSeek V4 RAG Benchmark with Milvus vs GPT-5.5 and Qwen
desc: >-
  Confrontate DeepSeek V4, GPT-5.5 e Qwen3.6 nei test di recupero, debug e
  long-context, quindi costruite una pipeline Milvus RAG con DeepSeek V4.
origin: >-
  https://milvus.io/blog/deepseek-v4-vs-gpt-55-vs-qwen36-which-model-should-you-use.md
---
<p>I nuovi modelli vengono rilasciati più velocemente di quanto i team di produzione possano valutarli. DeepSeek V4, GPT-5.5 e Qwen3.6-35B-A3B sembrano tutti forti sulla carta, ma la domanda più difficile per gli sviluppatori di applicazioni di intelligenza artificiale è quella pratica: quale modello utilizzare per i sistemi ad alto tasso di recupero, per le attività di codifica, per l'analisi di contesti lunghi e per le <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">pipeline RAG</a>?</p>
<p><strong>Questo articolo confronta i tre modelli in test pratici:</strong> recupero di informazioni dal vivo, debugging con concurrency-bug e recupero di marcatori in un contesto lungo. Poi mostra come collegare DeepSeek V4 al <a href="https://zilliz.com/learn/what-is-vector-database">database vettoriale Milvus</a>, in modo che il contesto recuperato provenga da una base di conoscenza ricercabile invece che dai soli parametri del modello.</p>
<h2 id="What-Are-DeepSeek-V4-GPT-55-and-Qwen36-35B-A3B" class="common-anchor-header">Cosa sono DeepSeek V4, GPT-5.5 e Qwen3.6-35B-A3B?<button data-href="#What-Are-DeepSeek-V4-GPT-55-and-Qwen36-35B-A3B" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>DeepSeek V4, GPT-5.5 e Qwen3.6-35B-A3B sono modelli di intelligenza artificiale diversi che si rivolgono a parti diverse dello stack di modelli.</strong> DeepSeek V4 si concentra sull'inferenza open-weight a contesto lungo. GPT-5.5 si concentra sulle prestazioni di frontiera, sulla codifica, sulla ricerca online e sui compiti pesanti per gli strumenti. Qwen3.6-35B-A3B si concentra sulla distribuzione multimodale a peso aperto con un'impronta di parametri attivi molto più piccola.</p>
<p>Il confronto è importante perché un sistema <a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">di ricerca vettoriale di produzione</a> raramente dipende solo dal modello. La capacità del modello, la lunghezza del contesto, il controllo dell'implementazione, la qualità del recupero e il costo del servizio influiscono sull'esperienza finale dell'utente.</p>
<h3 id="DeepSeek-V4-An-Open-Weight-MoE-Model-for-Long-Context-Cost-Control" class="common-anchor-header">DeepSeek V4: un modello MoE a peso aperto per il controllo dei costi dei contesti lunghi</h3><p><a href="https://api-docs.deepseek.com/news/news260424"><strong>DeepSeek V4</strong></a> <strong>è una famiglia di modelli MoE a peso aperto rilasciata da DeepSeek il 24 aprile 2026.</strong> Il comunicato ufficiale elenca due varianti: DeepSeek V4-Pro e DeepSeek V4-Flash. V4-Pro ha 1,6T di parametri totali con 49B attivati per token, mentre V4-Flash ha 284B parametri totali con 13B attivati per token. Entrambi supportano una finestra di contesto da 1M di token.</p>
<p>La <a href="https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro">scheda del modello DeepSeek V4-Pro</a> riporta anche la licenza MIT del modello, disponibile attraverso Hugging Face e ModelScope. Per i team che costruiscono flussi di lavoro di documenti con contesti lunghi, l'attrattiva principale è il controllo dei costi e la flessibilità di distribuzione rispetto alle API di frontiera completamente chiuse.</p>
<h3 id="GPT-55-A-Hosted-Frontier-Model-for-Coding-Research-and-Tool-Use" class="common-anchor-header">GPT-5.5: un modello di frontiera ospitato per la codifica, la ricerca e l'uso degli strumenti</h3><p><a href="https://openai.com/index/introducing-gpt-5-5/"><strong>GPT-5.5</strong></a> <strong>è un modello di frontiera chiuso rilasciato da OpenAI il 23 aprile 2026.</strong> OpenAI lo posiziona per la codifica, la ricerca online, l'analisi dei dati, il lavoro sui documenti, i fogli di calcolo, il funzionamento del software e le attività basate sugli strumenti. I documenti ufficiali del modello elencano <code translate="no">gpt-5.5</code> con una finestra contestuale API da 1 milione di token, mentre i limiti dei prodotti Codex e ChatGPT possono differire.</p>
<p>OpenAI ha ottenuto ottimi risultati nei benchmark di codifica: 82,7% su Terminal-Bench 2.0, 73,1% su Expert-SWE e 58,6% su SWE-Bench Pro. La contropartita è il prezzo: i prezzi ufficiali dell'API indicano GPT-5.5 a 5 dollari per 1 milione di token di input e 30 dollari per 1 milione di token di output, prima di qualsiasi dettaglio sui prezzi specifici del prodotto o del contesto lungo.</p>
<h3 id="Qwen36-35B-A3B-A-Smaller-Active-Parameter-Model-for-Local-and-Multimodal-Workloads" class="common-anchor-header">Qwen3.6-35B-A3B: un modello a parametri attivi più piccolo per carichi di lavoro locali e multimodali</h3><p><a href="https://huggingface.co/Qwen/Qwen3.6-35B-A3B"><strong>Qwen3.6-35B-A3B</strong></a> <strong>è un modello MoE di peso aperto del team Qwen di Alibaba.</strong> La sua scheda modello elenca 35B parametri totali, 3B parametri attivati, un codificatore di visione e licenze Apache-2.0. Supporta una finestra di contesto nativa da 262.144 token e può estendersi fino a circa 1.010.000 token con lo scaling YaRN.</p>
<p>Questo rende Qwen3.6-35B-A3B interessante quando la distribuzione locale, il servizio privato, l'input di immagini e testi o i carichi di lavoro in lingua cinese sono più importanti della convenienza del modello di frontiera gestito.</p>
<h3 id="DeepSeek-V4-vs-GPT-55-vs-Qwen36-Model-Specs-Compared" class="common-anchor-header">DeepSeek V4 vs GPT-5.5 vs Qwen3.6: Specifiche dei modelli a confronto</h3><table>
<thead>
<tr><th>Modello</th><th>Modello di distribuzione</th><th>Informazioni pubbliche sui parametri</th><th>Finestra di contesto</th><th>Adattamento più forte</th></tr>
</thead>
<tbody>
<tr><td>DeepSeek V4-Pro</td><td>MoE a peso aperto; API disponibile</td><td>1,6T totali / 49B attivi</td><td>1M di gettoni</td><td>Implementazioni ingegneristiche a lungo termine e sensibili ai costi</td></tr>
<tr><td>GPT-5.5</td><td>Modello chiuso in hosting</td><td>Non divulgato</td><td>1 milione di gettoni nell'API</td><td>Codifica, ricerca dal vivo, utilizzo di strumenti e massima capacità complessiva</td></tr>
<tr><td>Qwen3.6-35B-A3B</td><td>MoE multimodale a peso aperto</td><td>35B totale / 3B attivo</td><td>262K nativi; ~1M con YaRN</td><td>Distribuzione locale/privata, input multimodale e scenari in lingua cinese</td></tr>
</tbody>
</table>
<h2 id="How-We-Tested-DeepSeek-V4-GPT-55-and-Qwen36" class="common-anchor-header">Come abbiamo testato DeepSeek V4, GPT-5.5 e Qwen3.6<button data-href="#How-We-Tested-DeepSeek-V4-GPT-55-and-Qwen36" class="anchor-icon" translate="no">
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
    </button></h2><p>Questi test non sostituiscono le suite di benchmark complete. Si tratta di verifiche pratiche che rispecchiano le domande comuni degli sviluppatori: il modello è in grado di recuperare informazioni attuali, di ragionare su sottili bug del codice e di individuare i fatti all'interno di un documento molto lungo?</p>
<h3 id="Which-Model-Handles-Real-Time-Information-Retrieval-Best" class="common-anchor-header">Quale modello gestisce meglio il recupero di informazioni in tempo reale?</h3><p>Abbiamo posto a ciascun modello tre domande sensibili al tempo, utilizzando la ricerca sul Web, se disponibile. Le istruzioni erano semplici: restituire solo la risposta e includere l'URL di origine.</p>
<table>
<thead>
<tr><th>Domanda</th><th>Risposta attesa al momento del test</th><th>Fonte</th></tr>
</thead>
<tbody>
<tr><td>Quanto costa generare un'immagine di media qualità 1024×1024 con <code translate="no">gpt-image-2</code> attraverso l'API OpenAI?</td><td><code translate="no">\$0.053</code></td><td><a href="https://developers.openai.com/api/docs/guides/image-generation">Prezzi della generazione di immagini OpenAI</a></td></tr>
<tr><td>Qual è la canzone numero 1 della Billboard Hot 100 di questa settimana e chi è l'artista?</td><td><code translate="no">Choosin' Texas</code> da Ella Langley</td><td><a href="https://www.billboard.com/charts/hot-100/">Classifica Billboard Hot 100</a></td></tr>
<tr><td>Chi è attualmente in testa alla classifica piloti della F1 2026?</td><td>Kimi Antonelli</td><td><a href="https://www.formula1.com/en/results/2026/drivers">Classifica piloti di Formula 1</a></td></tr>
</tbody>
</table>
<table>
<thead>
<tr><th>Nota: queste sono domande sensibili al tempo. Le risposte previste riflettono i risultati al momento in cui abbiamo eseguito il test.</th></tr>
</thead>
<tbody>
</tbody>
</table>
<p>La pagina dei prezzi delle immagini di OpenAI utilizza l'etichetta "medium" anziché "standard" per le immagini di <br>

  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/blog_cover_narrow_1152x720_87d33982dd.jpg" alt="blog cover narrow 1152x720" class="doc-image" id="blog-cover-narrow-1152x720" />
   </span> <span class="img-wrapper"> <span>copertina del blog stretta 1152x720</span>$0 </span>,053 1024×1024, quindi la domanda è normalizzata qui per corrispondere all'attuale formulazione dell'API.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_2_408d990bb6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_3_082d496650.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_4_7fd44e596b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Real-Time-Retrieval-Results-GPT-55-Had-the-Clearest-Advantage" class="common-anchor-header">Risultati del recupero in tempo reale: GPT-5.5 ha avuto il vantaggio più evidente</h3><h4 id="DeepSeek-V4-Pro" class="common-anchor-header">DeepSeek V4-Pro</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_5_1e9d7c4c06.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>DeepSeek V4-Pro ha risposto in modo errato alla prima domanda. Non è stato in grado di rispondere alla seconda e alla terza domanda attraverso la ricerca web in tempo reale in questa configurazione.</p>
<p>La seconda risposta includeva l'URL corretto di Billboard, ma non recuperava la canzone numero 1 del momento. La terza risposta ha utilizzato una fonte sbagliata, quindi è stata considerata errata.</p>
<h4 id="GPT-55" class="common-anchor-header">GPT-5.5</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_6_b146956865.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>GPT-5.5 ha gestito questo test molto meglio. Le sue risposte sono state brevi, precise, circostanziate e veloci. Quando un compito dipende da informazioni attuali e il modello ha a disposizione il recupero in tempo reale, GPT-5.5 è in netto vantaggio in questa configurazione.</p>
<h4 id="Qwen36-35B-A3B" class="common-anchor-header">Qwen3.6-35B-A3B</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_7_91686c177e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qwen3.6-35B-A3B ha prodotto un risultato simile a quello di DeepSeek V4-Pro. In questa configurazione non aveva accesso al web in tempo reale, quindi non ha potuto completare il compito di recupero in tempo reale.</p>
<h2 id="Which-Model-Is-Better-at-Debugging-Concurrency-Bugs" class="common-anchor-header">Quale modello è migliore per il debug dei bug di concorrenza?<button data-href="#Which-Model-Is-Better-at-Debugging-Concurrency-Bugs" class="anchor-icon" translate="no">
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
    </button></h2><p>Il secondo test ha utilizzato un esempio di trasferimento bancario in Python con tre livelli di problemi di concorrenza. Il compito non era solo quello di trovare l'ovvia condizione di gara, ma anche di spiegare perché il bilancio totale si interrompe e di fornire il codice corretto.</p>
<table>
<thead>
<tr><th>Strato</th><th>Problema</th><th>Cosa va storto</th></tr>
</thead>
<tbody>
<tr><td>Base</td><td>Condizione di gara</td><td><code translate="no">if self.balance &gt;= amount</code> e <code translate="no">self.balance -= amount</code> non sono atomici. Due thread possono superare la verifica del saldo contemporaneamente, quindi entrambi sottraggono denaro.</td></tr>
<tr><td>Medio</td><td>Rischio di deadlock</td><td>Un blocco ingenuo per conto può bloccarsi quando il trasferimento A→B blocca A per primo mentre il trasferimento B→A blocca B per primo. Questo è il classico deadlock ABBA.</td></tr>
<tr><td>Avanzato</td><td>Ambito di blocco non corretto</td><td>Proteggere solo <code translate="no">self.balance</code> non protegge <code translate="no">target.balance</code>. Una soluzione corretta deve bloccare entrambi gli account in un ordine stabile, di solito in base all'ID dell'account, oppure utilizzare un blocco globale con una concurrency inferiore.</td></tr>
</tbody>
</table>
<p>Il prompt e il codice sono mostrati di seguito:</p>
<pre><code translate="no" class="language-cpp">The following Python code simulates two bank accounts transferring
  money to each other. The total balance should always equal 2000,                                              
  but it often doesn&#x27;t after running.                                                                           
                                                                                                                
  Please:                                                                                                       
  1. Find ALL concurrency bugs in this code (not just the obvious one)                                          
  2. Explain why Total ≠ 2000 with a concrete thread execution example                                          
  3. Provide the corrected code                                                                                 
                                                                                                                
  import threading                                                                                              
                                                                  
  class BankAccount:
      def __init__(self, balance):
          self.balance = balance                                                                                
   
      def transfer(self, target, amount):                                                                       
          if self.balance &gt;= amount:                              
              self.balance -= amount
              target.balance += amount
              return True
          return False
                                                                                                                
  def stress_test():
      account_a = BankAccount(1000)                                                                             
      account_b = BankAccount(1000)                               

      def transfer_a_to_b():                                                                                    
          for _ in range(1000):
              account_a.transfer(account_b, 1)                                                                  
                                                                  
      def transfer_b_to_a():
          for _ in range(1000):
              account_b.transfer(account_a, 1)                                                                  
   
      threads = [threading.Thread(target=transfer_a_to_b) for _ in range(10)]                                   
      threads += [threading.Thread(target=transfer_b_to_a) for _ in range(10)]
                                                                                                                
      for t in threads: t.start()
      for t in threads: t.join()                                                                                
                                                                  
      print(f&quot;Total: {account_a.balance + account_b.balance}&quot;)                                                  
      print(f&quot;A: {account_a.balance}, B: {account_b.balance}&quot;)
                                                                                                                
  stress_test()
<button class="copy-code-btn"></button></code></pre>
<h3 id="Code-Debugging-Results-GPT-55-Gave-the-Most-Complete-Answer" class="common-anchor-header">Risultati del debug del codice: GPT-5.5 ha dato la risposta più completa</h3><h4 id="DeepSeek-V4-Pro" class="common-anchor-header">DeepSeek V4-Pro</h4><p>DeepSeek V4-Pro ha fornito un'analisi concisa ed è andato dritto alla soluzione ordered-lock, che è il modo standard per evitare il deadlock ABBA. La sua risposta ha dimostrato la soluzione corretta, ma non ha dedicato molto tempo a spiegare perché la soluzione ingenua basata sui lock potrebbe introdurre una nuova modalità di errore.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_8_e2b4c41c46.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h4 id="GPT-55" class="common-anchor-header">GPT-5.5</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_9_d6b1e62c32.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>GPT-5.5 ha ottenuto le migliori prestazioni in questo test. Ha individuato i problemi principali, ha anticipato il rischio di deadlock, ha spiegato perché il codice originale poteva fallire e ha fornito un'implementazione completa e corretta.</p>
<h4 id="Qwen36-35B-A3B" class="common-anchor-header">Qwen3.6-35B-A3B</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_10_1177f51906.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qwen3.6-35B-A3B ha identificato accuratamente i bug e la sequenza di esecuzione di esempio era chiara. La parte più debole è stata la correzione: ha scelto un blocco globale a livello di classe, che fa sì che ogni account condivida lo stesso blocco. Questo funziona per una piccola simulazione, ma non è un buon compromesso per un sistema bancario reale, perché i trasferimenti di conti non correlati devono comunque attendere lo stesso blocco.</p>
<p><strong>In breve:</strong> GPT-5.5 non solo ha risolto il bug attuale, ma ha anche messo in guardia dal prossimo bug che uno sviluppatore potrebbe introdurre. DeepSeek V4-Pro ha fornito la soluzione non-GPT più pulita. Qwen3.6 ha trovato i problemi e ha prodotto codice funzionante, ma non ha segnalato il compromesso sulla scalabilità.</p>
<h2 id="Which-Model-Handles-Long-Context-Retrieval-Best" class="common-anchor-header">Quale modello gestisce meglio il recupero di un contesto lungo?<button data-href="#Which-Model-Handles-Long-Context-Retrieval-Best" class="anchor-icon" translate="no">
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
    </button></h2><p>Per il test del contesto lungo, abbiamo utilizzato il testo completo di <em>Dream of the Red Chamber</em>, circa 850.000 caratteri cinesi. Abbiamo inserito un marcatore nascosto intorno alla posizione di 500.000 caratteri:</p>
<p><code translate="no">【Milvus test verification code: ZK-7749-ALPHA】</code></p>
<p>Poi abbiamo caricato il file su ciascun modello e gli abbiamo chiesto di trovare sia il contenuto del marcatore sia la sua posizione.</p>
<h3 id="Long-Context-Retrieval-Results-GPT-55-Found-the-Marker-Most-Precisely" class="common-anchor-header">Risultati del recupero del contesto lungo: GPT-5.5 ha trovato il marcatore con la massima precisione</h3><h4 id="DeepSeek-V4-Pro" class="common-anchor-header">DeepSeek V4-Pro</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_11_1f1ee0ec72.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>DeepSeek V4-Pro ha trovato il marcatore nascosto, ma non la posizione corretta del carattere. Inoltre, ha fornito il contesto circostante sbagliato. In questo test, sembra che abbia individuato il marcatore dal punto di vista semantico, ma che abbia perso di vista la posizione esatta durante il ragionamento sul documento.</p>
<h4 id="GPT-55" class="common-anchor-header">GPT-5.5</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_12_5b09068036.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>GPT-5.5 ha individuato correttamente il contenuto del marcatore, la posizione e il contesto circostante. Ha riportato la posizione come 500.002 e ha persino distinto tra conteggio con indice zero e con indice uno. Anche il contesto circostante corrispondeva al testo utilizzato per l'inserimento del marcatore.</p>
<h4 id="Qwen36-35B-A3B" class="common-anchor-header">Qwen3.6-35B-A3B</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_13_ca4223c01d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qwen3.6-35B-A3B ha trovato correttamente il contenuto del marcatore e il contesto circostante, ma la sua stima della posizione era sbagliata.</p>
<h2 id="What-Do-These-Tests-Say-About-Model-Selection" class="common-anchor-header">Cosa dicono questi test sulla selezione del modello?<button data-href="#What-Do-These-Tests-Say-About-Model-Selection" class="anchor-icon" translate="no">
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
    </button></h2><p>I tre test indicano un modello di selezione pratico: <strong>GPT-5.5 è la scelta di capacità, DeepSeek V4-Pro è la scelta di performance di costo a contesto lungo e Qwen3.6-35B-A3B è la scelta di controllo locale.</strong></p>
<table>
<thead>
<tr><th>Modello</th><th>Migliore adattamento</th><th>Cosa è successo nei nostri test</th><th>Principali avvertenze</th></tr>
</thead>
<tbody>
<tr><td>GPT-5.5</td><td>Migliore capacità complessiva</td><td>Ha vinto i test di live retrieval, concurrency-debugging e long-context marker</td><td>Costo più elevato; più forte quando l'accuratezza e l'uso dello strumento giustificano il sovrapprezzo</td></tr>
<tr><td>DeepSeek V4-Pro</td><td>Distribuzione a lungo contesto e a basso costo</td><td>Ha fornito la più forte correzione non GPT per il bug della concorrenza e ha trovato il contenuto del marcatore</td><td>Necessita di strumenti di recupero esterni per le attività web dal vivo; il tracciamento esatto della posizione dei caratteri è stato più debole in questo test.</td></tr>
<tr><td>Qwen3.6-35B-A3B</td><td>Distribuzione locale, pesi aperti, input multimodale, carichi di lavoro in lingua cinese</td><td>Ha ottenuto buoni risultati nell'identificazione dei bug e nella comprensione dei contesti lunghi.</td><td>La qualità delle correzioni è stata meno scalabile; l'accesso al web dal vivo non era disponibile in questa configurazione.</td></tr>
</tbody>
</table>
<p>Usate GPT-5.5 quando avete bisogno del risultato più forte e il costo è secondario. Usare DeepSeek V4-Pro quando si ha bisogno di un contesto lungo, di un costo di servizio inferiore e di una distribuzione API-friendly. Usate Qwen3.6-35B-A3B quando sono importanti i pesi aperti, la distribuzione privata, il supporto multimodale o il controllo dello stack di servizio.</p>
<p>Per le applicazioni che richiedono un elevato numero di risorse, tuttavia, la scelta del modello è solo una parte della storia. Anche un modello forte a contesto lungo ha prestazioni migliori quando il contesto viene recuperato, filtrato e messo a terra da un <a href="https://zilliz.com/learn/generative-ai">sistema di ricerca semantica</a> dedicato.</p>
<h2 id="Why-RAG-Still-Matters-for-Long-Context-Models" class="common-anchor-header">Perché la RAG è ancora importante per i modelli a contesto lungo<button data-href="#Why-RAG-Still-Matters-for-Long-Context-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>Una finestra di contesto lunga non elimina la necessità di recupero. Cambia la strategia di recupero.</p>
<p>In un'applicazione RAG, il modello non deve analizzare ogni documento per ogni richiesta. Un'<a href="https://zilliz.com/learn/introduction-to-unstructured-data">architettura di database vettoriale</a> memorizza le incorporazioni, cerca i pezzi semanticamente rilevanti, applica filtri ai metadati e restituisce al modello un insieme di contesti compatto. In questo modo il modello ottiene un input migliore, riducendo al contempo i costi e la latenza.</p>
<p>Milvus è adatto a questo ruolo perché gestisce gli <a href="https://milvus.io/docs/schema.md">schemi di raccolta</a>, l'indicizzazione vettoriale, i metadati scalari e le operazioni di recupero in un unico sistema. È possibile iniziare localmente con <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>, passare a un <a href="https://milvus.io/docs/quickstart.md">quickstart Milvus</a> autonomo, distribuire con l'<a href="https://milvus.io/docs/install_standalone-docker.md">installazione di Docker</a> o il <a href="https://milvus.io/docs/install_standalone-docker-compose.md">deployment di Docker Compose</a> e scalare ulteriormente con il <a href="https://milvus.io/docs/install_cluster-milvusoperator.md">deployment di Kubernetes</a> quando il carico di lavoro cresce.</p>
<h2 id="How-to-Build-a-RAG-Pipeline-with-Milvus-and-DeepSeek-V4" class="common-anchor-header">Come costruire una pipeline RAG con Milvus e DeepSeek V4<button data-href="#How-to-Build-a-RAG-Pipeline-with-Milvus-and-DeepSeek-V4" class="anchor-icon" translate="no">
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
    </button></h2><p>La seguente guida costruisce una piccola pipeline RAG utilizzando DeepSeek V4-Pro per la generazione e Milvus per il recupero. La stessa struttura si applica ad altri LLM: creare embeddings, memorizzarli in una collezione, cercare il contesto pertinente e passare tale contesto nel modello.</p>
<p>Per una descrizione più ampia, si veda il <a href="https://milvus.io/docs/build-rag-with-milvus.md">tutorial</a> ufficiale <a href="https://milvus.io/docs/build-rag-with-milvus.md">di Milvus RAG</a>. Questo esempio mantiene la pipeline piccola, in modo che il flusso di recupero sia facile da ispezionare.</p>
<h2 id="Prepare-the-Environment" class="common-anchor-header">Preparare l'ambiente<button data-href="#Prepare-the-Environment" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Install-the-Dependencies" class="common-anchor-header">Installare le dipendenze</h3><pre><code translate="no" class="language-python">! pip install --upgrade <span class="hljs-string">&quot;pymilvus[model]&quot;</span> openai requests tqdm
<button class="copy-code-btn"></button></code></pre>
<p>Se si utilizza Google Colab, potrebbe essere necessario riavviare il runtime dopo aver installato le dipendenze. Fare clic sul menu <strong>Runtime</strong>, quindi selezionare <strong>Riavvia sessione</strong>.</p>
<p>DeepSeek V4-Pro supporta un'API di tipo OpenAI. Accedere al sito ufficiale di DeepSeek e impostare <code translate="no">DEEPSEEK_API_KEY</code> come variabile d'ambiente.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os

os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;DEEPSEEK_API_KEY&quot;</span>] = <span class="hljs-string">&quot;sk-*****************&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Prepare-the-Milvus-Documentation-Dataset" class="common-anchor-header">Preparare il set di dati della documentazione Milvus</h3><p>Come fonte di conoscenza privata utilizziamo le pagine FAQ dell'<a href="https://github.com/milvus-io/milvus-docs/releases/download/v2.4.6-preview/milvus_docs_2.4.x_en.zip">archivio della documentazione di Milvus 2.4.x</a>. Si tratta di un semplice set di dati di partenza per una piccola demo RAG.</p>
<p>Per prima cosa, scaricare il file ZIP ed estrarre la documentazione nella cartella <code translate="no">milvus_docs</code>.</p>
<pre><code translate="no" class="language-python">! wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
! unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs
<button class="copy-code-btn"></button></code></pre>
<p>Carichiamo tutti i file Markdown dalla cartella <code translate="no">milvus_docs/en/faq</code>. Per ogni documento, dividiamo il contenuto del file in base a <code translate="no">#</code>, che separa approssimativamente le principali sezioni Markdown.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob

text_lines = []

<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()

    text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Set-Up-DeepSeek-V4-and-the-Embedding-Model" class="common-anchor-header">Configurazione di DeepSeek V4 e del modello di incorporamento</h3><pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAI</span>

deepseek_client = <span class="hljs-title class_">OpenAI</span>(
    api_key=os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;DEEPSEEK_API_KEY&quot;</span>],
    base_url=<span class="hljs-string">&quot;https://api.deepseek.com&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>Successivamente, si sceglie un modello di incorporamento. Questo esempio utilizza <code translate="no">DefaultEmbeddingFunction</code> dal modulo del modello PyMilvus. Per ulteriori informazioni sulle <a href="https://milvus.io/docs/embeddings.md">funzioni di incorporamento</a>, consultare i documenti di Milvus.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model <span class="hljs-keyword">as</span> milvus_model

embedding_model = milvus_model.<span class="hljs-title class_">DefaultEmbeddingFunction</span>()
<button class="copy-code-btn"></button></code></pre>
<p>Generare un vettore di prova, quindi stampare la dimensione del vettore e i primi elementi. La dimensione restituita viene utilizzata per la creazione della collezione Milvus.</p>
<pre><code translate="no">test_embedding = embedding_model.encode_queries([<span class="hljs-string">&quot;This is a test&quot;</span>])[<span class="hljs-number">0</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embedding)
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embedding[:<span class="hljs-number">10</span>])
<span class="hljs-number">768</span>
[-<span class="hljs-number">0.04836066</span>  <span class="hljs-number">0.07163023</span> -<span class="hljs-number">0.01130064</span> -<span class="hljs-number">0.03789345</span> -<span class="hljs-number">0.03320649</span> -<span class="hljs-number">0.01318448</span>
 -<span class="hljs-number">0.03041712</span> -<span class="hljs-number">0.02269499</span> -<span class="hljs-number">0.02317863</span> -<span class="hljs-number">0.00426028</span>]
<button class="copy-code-btn"></button></code></pre>
<h2 id="Load-Data-into-Milvus" class="common-anchor-header">Caricare i dati in Milvus<button data-href="#Load-Data-into-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Create-a-Milvus-Collection" class="common-anchor-header">Creare una collezione Milvus</h3><p>Una collezione Milvus memorizza campi vettoriali, campi scalari e metadati dinamici opzionali. La configurazione rapida che segue utilizza l'API di alto livello <code translate="no">MilvusClient</code>; per gli schemi di produzione, consultare i documenti sulla <a href="https://milvus.io/docs/manage-collections.md">gestione delle collezioni</a> e sulla <a href="https://milvus.io/docs/create-collection.md">creazione di collezioni</a>.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>

milvus_client = <span class="hljs-title class_">MilvusClient</span>(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)

collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Alcune note su <code translate="no">MilvusClient</code>:</p>
<ul>
<li>L'impostazione di <code translate="no">uri</code> su un file locale, come <code translate="no">./milvus.db</code>, è l'opzione più semplice perché utilizza automaticamente <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a> e memorizza tutti i dati in quel file.</li>
<li>Se si dispone di un set di dati di grandi dimensioni, è possibile impostare un server Milvus più performante su <a href="https://milvus.io/docs/quickstart.md">Docker o Kubernetes</a>. In questa configurazione, utilizzare l'URI del server, ad esempio <code translate="no">http://localhost:19530</code>, come <code translate="no">uri</code>.</li>
<li>Se si desidera utilizzare <a href="https://docs.zilliz.com/">Zilliz Cloud</a>, il servizio cloud completamente gestito per Milvus, impostare <code translate="no">uri</code> e <code translate="no">token</code> con l'<a href="https://docs.zilliz.com/docs/connect-to-cluster">endpoint pubblico e la chiave API</a> di Zilliz Cloud.</li>
</ul>
<p>Controllare se la raccolta esiste già. In caso affermativo, eliminarla.</p>
<pre><code translate="no" class="language-python">if milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)
<button class="copy-code-btn"></button></code></pre>
<p>Creare una nuova raccolta con i parametri specificati. Se non si specificano le informazioni sul campo, Milvus crea automaticamente un campo <code translate="no">id</code> predefinito come chiave primaria e un campo vettoriale per memorizzare i dati vettoriali. Un campo JSON riservato memorizza dati scalari non definiti nello schema.</p>
<pre><code translate="no" class="language-python">milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;IP&quot;</span>,  <span class="hljs-comment"># Inner product distance</span>
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,  <span class="hljs-comment"># Strong consistency level</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>La metrica <code translate="no">IP</code> indica la somiglianza del prodotto interno. Milvus supporta anche altri tipi di metriche e indici a seconda del tipo di vettore e del carico di lavoro; si vedano le guide sui <a href="https://milvus.io/docs/id/metric.md">tipi di metriche</a> e sulla <a href="https://milvus.io/docs/index_selection.md">selezione degli indici</a>. L'impostazione <code translate="no">Strong</code> è uno dei <a href="https://milvus.io/docs/consistency.md">livelli di coerenza</a> disponibili.</p>
<h3 id="Insert-the-Embedded-Documents" class="common-anchor-header">Inserire i documenti incorporati</h3><p>Intervistiamo i dati di testo, creiamo le incorporazioni e inseriamo i dati in Milvus. Qui aggiungiamo un nuovo campo chiamato <code translate="no">text</code>. Poiché non è definito esplicitamente nello schema della raccolta, viene aggiunto automaticamente al campo JSON dinamico riservato. Per i metadati di produzione, consultare il <a href="https://milvus.io/docs/enable-dynamic-field.md">supporto dei campi dinamici</a> e la <a href="https://milvus.io/docs/json-field-overview.md">panoramica dei campi JSON</a>.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm

data = []

doc_embeddings = embedding_model.encode_documents(text_lines)

<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})

milvus_client.insert(collection_name=collection_name, data=data)
Creating embeddings: <span class="hljs-number">100</span>%|█████████████████████████████████████████████████████████████████████████████████████████████████████████████████| <span class="hljs-number">72</span>/<span class="hljs-number">72</span> [<span class="hljs-number">00</span>:<span class="hljs-number">00</span>&lt;<span class="hljs-number">00</span>:<span class="hljs-number">00</span>, <span class="hljs-number">1222631.13</span>it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: <span class="hljs-number">72</span>, <span class="hljs-string">&#x27;ids&#x27;</span>: [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">3</span>, <span class="hljs-number">4</span>, <span class="hljs-number">5</span>, <span class="hljs-number">6</span>, <span class="hljs-number">7</span>, <span class="hljs-number">8</span>, <span class="hljs-number">9</span>, <span class="hljs-number">10</span>, <span class="hljs-number">11</span>, <span class="hljs-number">12</span>, <span class="hljs-number">13</span>, <span class="hljs-number">14</span>, <span class="hljs-number">15</span>, <span class="hljs-number">16</span>, <span class="hljs-number">17</span>, <span class="hljs-number">18</span>, <span class="hljs-number">19</span>, <span class="hljs-number">20</span>, <span class="hljs-number">21</span>, <span class="hljs-number">22</span>, <span class="hljs-number">23</span>, <span class="hljs-number">24</span>, <span class="hljs-number">25</span>, <span class="hljs-number">26</span>, <span class="hljs-number">27</span>, <span class="hljs-number">28</span>, <span class="hljs-number">29</span>, <span class="hljs-number">30</span>, <span class="hljs-number">31</span>, <span class="hljs-number">32</span>, <span class="hljs-number">33</span>, <span class="hljs-number">34</span>, <span class="hljs-number">35</span>, <span class="hljs-number">36</span>, <span class="hljs-number">37</span>, <span class="hljs-number">38</span>, <span class="hljs-number">39</span>, <span class="hljs-number">40</span>, <span class="hljs-number">41</span>, <span class="hljs-number">42</span>, <span class="hljs-number">43</span>, <span class="hljs-number">44</span>, <span class="hljs-number">45</span>, <span class="hljs-number">46</span>, <span class="hljs-number">47</span>, <span class="hljs-number">48</span>, <span class="hljs-number">49</span>, <span class="hljs-number">50</span>, <span class="hljs-number">51</span>, <span class="hljs-number">52</span>, <span class="hljs-number">53</span>, <span class="hljs-number">54</span>, <span class="hljs-number">55</span>, <span class="hljs-number">56</span>, <span class="hljs-number">57</span>, <span class="hljs-number">58</span>, <span class="hljs-number">59</span>, <span class="hljs-number">60</span>, <span class="hljs-number">61</span>, <span class="hljs-number">62</span>, <span class="hljs-number">63</span>, <span class="hljs-number">64</span>, <span class="hljs-number">65</span>, <span class="hljs-number">66</span>, <span class="hljs-number">67</span>, <span class="hljs-number">68</span>, <span class="hljs-number">69</span>, <span class="hljs-number">70</span>, <span class="hljs-number">71</span>], <span class="hljs-string">&#x27;cost&#x27;</span>: <span class="hljs-number">0</span>}
<button class="copy-code-btn"></button></code></pre>
<p>Per gli insiemi di dati più grandi, lo stesso schema può essere esteso con una progettazione esplicita dello schema, <a href="https://milvus.io/docs/index-vector-fields.md">indici di campi vettoriali</a>, indici scalari e operazioni del ciclo di vita dei dati come <a href="https://milvus.io/docs/insert-update-delete.md">inserimento, upsert e cancellazione</a>.</p>
<h2 id="Build-the-RAG-Retrieval-Flow" class="common-anchor-header">Costruire il flusso di recupero RAG<button data-href="#Build-the-RAG-Retrieval-Flow" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Search-Milvus-for-Relevant-Context" class="common-anchor-header">Ricerca del contesto pertinente in Milvus</h3><p>Definiamo una domanda comune su Milvus.</p>
<pre><code translate="no" class="language-python">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Cerchiamo la domanda nella collezione e recuperiamo le prime tre corrispondenze semantiche. Questa è una <a href="https://milvus.io/docs/single-vector-search.md">ricerca</a> di base <a href="https://milvus.io/docs/single-vector-search.md">a vettore singolo</a>. In produzione, è possibile combinarla con la <a href="https://milvus.io/docs/filtered-search.md">ricerca filtrata</a>, la <a href="https://milvus.io/docs/full-text-search.md">ricerca full-text</a>, la <a href="https://milvus.io/docs/multi-vector-search.md">ricerca ibrida multivettore</a> e le <a href="https://milvus.io/docs/reranking.md">strategie di reranking</a> per migliorare la pertinenza.</p>
<pre><code translate="no" class="language-python">search_res = milvus_client.search(
    collection_name=collection_name,
    data=embedding_model.encode_queries(
        [question]
    ),  <span class="hljs-comment"># Convert the question to an embedding vector</span>
    limit=<span class="hljs-number">3</span>,  <span class="hljs-comment"># Return top 3 results</span>
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},  <span class="hljs-comment"># Inner product distance</span>
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],  <span class="hljs-comment"># Return the text field</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Ora diamo un'occhiata ai risultati della ricerca per la query.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json

retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))

[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including [MinIO](https://min.io/), [AWS S3](https://aws.amazon.com/s3/?nc1=h_ls), [Google Cloud Storage](https://cloud.google.com/storage?hl=en#object-storage-for-companies-of-all-sizes) (GCS), [Azure Blob Storage](https://azure.microsoft.com/en-us/products/storage/blobs), [Alibaba Cloud OSS](https://www.alibabacloud.com/product/object-storage-service), and [Tencent Cloud Object Storage](https://www.tencentcloud.com/products/cos) (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        <span class="hljs-number">0.6572665572166443</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus flush data?\n\nMilvus returns success when inserted data are loaded to the message queue. However, the data are not yet flushed to the disk. Then Milvus&#x27; data node writes the data in the message queue to persistent storage as incremental logs. If `flush()` is called, the data node is forced to write all data in the message queue to persistent storage immediately.\n\n###&quot;</span>,
        <span class="hljs-number">0.6312146186828613</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus handle vector data types and precision?\n\nMilvus supports Binary, Float32, Float16, and BFloat16 vector types.\n\n- Binary vectors: Store binary data as sequences of 0s and 1s, used in image processing and information retrieval.\n- Float32 vectors: Default storage with a precision of about 7 decimal digits. Even Float64 values are stored with Float32 precision, leading to potential precision loss upon retrieval.\n- Float16 and BFloat16 vectors: Offer reduced precision and memory usage. Float16 is suitable for applications with limited bandwidth and storage, while BFloat16 balances range and efficiency, commonly used in deep learning to reduce computational requirements without significantly impacting accuracy.\n\n###&quot;</span>,
        <span class="hljs-number">0.6115777492523193</span>
    ]
]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Generate-a-RAG-Answer-with-DeepSeek-V4" class="common-anchor-header">Generare una risposta RAG con DeepSeek V4</h3><p>Convertire i documenti recuperati in formato stringa.</p>
<pre><code translate="no" class="language-python">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>Definire le richieste del sistema e dell'utente per il LLM. Questo prompt viene assemblato a partire dai documenti recuperati da Milvus.</p>
<pre><code translate="no" class="language-python">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
Human: You are an AI assistant. You are able to find answers to the questions from the contextual passage snippets provided.
&quot;&quot;&quot;</span>
USER_PROMPT = <span class="hljs-string">f&quot;&quot;&quot;
Use the following pieces of information enclosed in &lt;context&gt; tags to provide an answer to the question enclosed in &lt;question&gt; tags.
&lt;context&gt;
<span class="hljs-subst">{context}</span>
&lt;/context&gt;
&lt;question&gt;
<span class="hljs-subst">{question}</span>
&lt;/question&gt;
&quot;&quot;&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Utilizzare il modello fornito da DeepSeek V4-Pro per generare una risposta basata sul prompt.</p>
<pre><code translate="no">response = deepseek_client.chat.completions.create(
    model=<span class="hljs-string">&quot;deepseek-v4-pro&quot;</span>,
    messages=[
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT},
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT},
    ],
)
print(response.choices[<span class="hljs-number">0</span>].message.content)
Milvus stores data <span class="hljs-keyword">in</span> two distinct ways depending <span class="hljs-keyword">on</span> the type:
- **Inserted data** (vector data, scalar data, <span class="hljs-keyword">and</span> collection-specific schema) are stored <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> incremental logs. Milvus supports multiple <span class="hljs-built_in">object</span> storage backends, such <span class="hljs-keyword">as</span> MinIO, AWS S3, Google Cloud Storage, Azure Blob Storage, Alibaba Cloud OSS, <span class="hljs-keyword">and</span> Tencent Cloud Object Storage. Before reaching persistent storage, the data <span class="hljs-keyword">is</span> initially loaded <span class="hljs-keyword">into</span> a message queue; a data node then writes it to disk, <span class="hljs-keyword">and</span> calling `flush()` forces an immediate write.
- **Metadata**, generated <span class="hljs-keyword">by</span> each Milvus module, <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> **etcd**.
<button class="copy-code-btn"></button></code></pre>
<p>A questo punto, la pipeline ha completato il ciclo RAG principale: incorporare i documenti, memorizzare i vettori in Milvus, cercare il contesto pertinente e generare una risposta con DeepSeek V4-Pro.</p>
<h2 id="What-Should-You-Improve-Before-Production" class="common-anchor-header">Cosa migliorare prima della produzione?<button data-href="#What-Should-You-Improve-Before-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>La demo utilizza una semplice suddivisione delle sezioni e il recupero top-k. Questo è sufficiente per mostrare il meccanismo, ma il RAG di produzione di solito ha bisogno di un maggiore controllo del reperimento.</p>
<table>
<thead>
<tr><th>La produzione ha bisogno di</th><th>Funzione Milvus da considerare</th><th>Perché è utile</th></tr>
</thead>
<tbody>
<tr><td>Mescolare segnali semantici e parole chiave</td><td><a href="https://milvus.io/docs/hybrid_search_with_milvus.md">Ricerca ibrida con Milvus</a></td><td>Combina la ricerca vettoriale densa con segnali scarsi o full-text</td></tr>
<tr><td>Unisce i risultati di più retriever</td><td><a href="https://milvus.io/docs/milvus_hybrid_search_retriever.md">Ricerca ibrida Milvus</a></td><td>Permette ai flussi di lavoro LangChain di utilizzare un ranking ponderato o in stile RRF</td></tr>
<tr><td>Restringere i risultati per tenant, timestamp o tipo di documento</td><td>Filtri per metadati e scalari</td><td>Consente di recuperare i risultati in base alla giusta fetta di dati.</td></tr>
<tr><td>Passaggio da Milvus autogestito a un servizio gestito</td><td><a href="https://docs.zilliz.com/docs/migrate-from-milvus">Migrazione da Milvus a Zilliz</a></td><td>Riduce il lavoro dell'infrastruttura, mantenendo la compatibilità con Milvus.</td></tr>
<tr><td>Collegare le applicazioni ospitate in modo sicuro</td><td><a href="https://docs.zilliz.com/docs/manage-api-keys">Chiavi API Zilliz Cloud</a></td><td>Fornisce un controllo di accesso basato su token per i client delle applicazioni</td></tr>
</tbody>
</table>
<p>L'abitudine di produzione più importante è quella di valutare il recupero separatamente dalla generazione. Se il contesto recuperato è debole, lo scambio di LLM spesso nasconde il problema invece di risolverlo.</p>
<h2 id="Get-Started-with-Milvus-and-DeepSeek-RAG" class="common-anchor-header">Iniziare con Milvus e DeepSeek RAG<button data-href="#Get-Started-with-Milvus-and-DeepSeek-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>Se volete riprodurre l'esercitazione, iniziate dalla <a href="https://milvus.io/docs">documentazione</a> ufficiale <a href="https://milvus.io/docs">di Milvus</a> e dalla <a href="https://milvus.io/docs/build-rag-with-milvus.md">guida Build RAG with Milvus</a>. Per una configurazione gestita, <a href="https://docs.zilliz.com/docs/connect-to-cluster">connettetevi a Zilliz Cloud</a> con l'endpoint del cluster e la chiave API invece di eseguire Milvus localmente.</p>
<p>Se volete un aiuto per la messa a punto di chunking, indicizzazione, filtri o recupero ibrido, unitevi alla <a href="https://slack.milvus.io/">comunità Slack di Milvus</a> o prenotate una <a href="https://milvus.io/office-hours">sessione</a> gratuita <a href="https://milvus.io/office-hours">di Milvus Office Hours</a>. Se preferite evitare la configurazione dell'infrastruttura, utilizzate il <a href="https://cloud.zilliz.com/login">login Zilliz Cloud</a> o create un <a href="https://cloud.zilliz.com/signup">account Zilliz Cloud</a> per eseguire Milvus gestito.</p>
<h2 id="Questions-Developers-Ask-About-DeepSeek-V4-Milvus-and-RAG" class="common-anchor-header">Domande degli sviluppatori su DeepSeek V4, Milvus e RAG<button data-href="#Questions-Developers-Ask-About-DeepSeek-V4-Milvus-and-RAG" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Is-DeepSeek-V4-good-for-RAG" class="common-anchor-header">DeepSeek V4 va bene per RAG?</h3><p>DeepSeek V4-Pro si adatta bene a RAG quando si ha bisogno di un'elaborazione a lungo termine e di un costo di servizio inferiore rispetto ai modelli chiusi premium. È comunque necessario un livello di recupero come Milvus per selezionare i pezzi rilevanti, applicare filtri ai metadati e mantenere il prompt focalizzato.</p>
<h3 id="Should-I-use-GPT-55-or-DeepSeek-V4-for-a-RAG-pipeline" class="common-anchor-header">Dovrei usare GPT-5.5 o DeepSeek V4 per una pipeline RAG?</h3><p>Utilizzate GPT-5.5 quando la qualità delle risposte, l'uso dello strumento e la ricerca dal vivo sono più importanti del costo. Utilizzate DeepSeek V4-Pro quando l'elaborazione di contesti lunghi e il controllo dei costi sono più importanti, soprattutto se il vostro livello di recupero fornisce già un contesto di base di alta qualità.</p>
<h3 id="Can-I-run-Qwen36-35B-A3B-locally-for-private-RAG" class="common-anchor-header">Posso eseguire Qwen3.6-35B-A3B localmente per una RAG privata?</h3><p>Sì, Qwen3.6-35B-A3B ha un peso aperto ed è progettato per una distribuzione più controllabile. È un buon candidato quando la privacy, il servizio locale, l'input multimodale o le prestazioni in lingua cinese sono importanti, ma è comunque necessario convalidare la latenza, la memoria e la qualità del recupero per il proprio hardware.</p>
<h3 id="Do-long-context-models-make-vector-databases-unnecessary" class="common-anchor-header">I modelli a contesto lungo rendono superflui i database vettoriali?</h3><p>No. I modelli a contesto lungo possono leggere più testo, ma beneficiano comunque del recupero. Un database vettoriale restringe l'input a parti rilevanti, supporta il filtraggio dei metadati, riduce il costo dei token e facilita l'aggiornamento dell'applicazione in caso di modifica dei documenti.</p>
