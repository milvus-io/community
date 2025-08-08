---
id: gpt-5-review-accuracy-up-prices-down-code-strong-but-bad-for-creativity.md
title: >-
  Recensione del GPT-5: Precisione in aumento, prezzi in ribasso, codice forte -
  ma cattivo per la creatività
author: Lumina Wang
date: 2025-08-08T00:00:00.000Z
cover: assets.zilliz.com/gpt_5_review_7df71f395a.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, OpenAI, gpt-5'
meta_keywords: 'Milvus, gpt-5, openai, chatgpt'
meta_title: |
  GPT-5 Review: Accuracy Up, Prices Down, Code Strong, Bad Creativity
desc: >-
  Per gli sviluppatori, in particolare per quelli che creano agenti e pipeline
  RAG, questa versione potrebbe essere tranquillamente l'aggiornamento più
  utile.
origin: >-
  https://milvus.io/blog/gpt-5-review-accuracy-up-prices-down-code-strong-but-bad-for-creativity.md
---
<p><strong>Dopo mesi di speculazioni, OpenAI ha finalmente distribuito</strong> <a href="https://openai.com/gpt-5/"><strong>GPT-5</strong></a><strong>.</strong> Il modello non è il colpo di fulmine creativo che è stato GPT-4, ma per gli sviluppatori, in particolare per quelli che costruiscono agenti e pipeline RAG, questa versione potrebbe essere tranquillamente l'aggiornamento più utile.</p>
<p><strong>Per gli sviluppatori:</strong> GPT-5 unifica le architetture, potenzia l'I/O multimodale, riduce i tassi di errore fattuale, estende il contesto a 400k token e rende accessibile l'uso su larga scala. Tuttavia, la creatività e l'estro letterario hanno fatto un notevole passo indietro.</p>
<h2 id="What’s-New-Under-the-Hood" class="common-anchor-header">Cosa c'è di nuovo sotto il cofano?<button data-href="#What’s-New-Under-the-Hood" class="anchor-icon" translate="no">
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
<li><p><strong>Nucleo unificato</strong> - Unisce la serie digitale GPT con i modelli di ragionamento della serie o, offrendo un ragionamento a catena lunga e multimodale in un'unica architettura.</p></li>
<li><p><strong>Multimodalità a tutto campo</strong>: input/output di testo, immagini, audio e video all'interno dello stesso modello.</p></li>
<li><p><strong>Massimi guadagni in termini di accuratezza</strong>:</p>
<ul>
<li><p><code translate="no">gpt-5-main</code>: 44% di errori fattuali in meno rispetto a GPT-4o.</p></li>
<li><p><code translate="no">gpt-5-thinking</code>78% di errori fattuali in meno rispetto a o3.</p></li>
</ul></li>
<li><p><strong>Incremento delle competenze di dominio</strong>: più forte nella generazione di codici, nel ragionamento matematico, nella consulenza sanitaria e nella scrittura strutturata; riduzione significativa delle allucinazioni.</p></li>
</ul>
<p>Oltre al GPT-5, OpenAI ha rilasciato anche <strong>altre tre varianti</strong>, ciascuna ottimizzata per esigenze diverse:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt_5_family_99a9bee18a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<table>
<thead>
<tr><th><strong>Modello</strong></th><th><strong>Descrizione</strong></th><th><strong>Ingresso / $ per 1M di token</strong></th><th><strong>Output / $ per 1M di gettoni</strong></th><th><strong>Aggiornamento della conoscenza</strong></th></tr>
</thead>
<tbody>
<tr><td>gpt-5</td><td>Modello principale, ragionamento a catena lunga + multimodale completo</td><td>$1.25</td><td>$10.00</td><td>2024-10-01</td></tr>
<tr><td>gpt-5-chat</td><td>Equivalente a gpt-5, usato nelle conversazioni ChatGPT</td><td>-</td><td>-</td><td>2024-10-01</td></tr>
<tr><td>gpt-5-mini</td><td>60% più economico, mantiene ~90% delle prestazioni di programmazione</td><td>$0.25</td><td>$2.00</td><td>2024-05-31</td></tr>
<tr><td>gpt-5-nano</td><td>Edge/offline, contesto 32K, latenza &lt;40ms</td><td>$0.05</td><td>$0.40</td><td>2024-05-31</td></tr>
</tbody>
</table>
<p>GPT-5 ha battuto i record di 25 categorie di benchmark, dalla riparazione di codici al ragionamento multimodale, fino alle attività mediche, con miglioramenti costanti della precisione.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmark_1_8ebf1bed4b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmark_2_c43781126f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Why-Developers-Should-Care--Especially-for-RAG--Agents" class="common-anchor-header">Perché gli sviluppatori dovrebbero preoccuparsi, soprattutto per RAG e Agenti<button data-href="#Why-Developers-Should-Care--Especially-for-RAG--Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>I nostri test pratici indicano che questa versione è una rivoluzione silenziosa per la Retrieval-Augmented Generation e i flussi di lavoro guidati dagli agenti.</p>
<ol>
<li><p>La<strong>riduzione dei prezzi</strong> rende fattibile la sperimentazione - Costo di ingresso dell'API: <strong><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>1,25 per milione di</mn><mi>token</mi><mo separator="true">∗∗;</mo><mi>costo di</mi><mi>uscita</mi><mo>:∗∗1</mo></mrow><annotation encoding="application/x-tex">,25 per milione di token**; costo di uscita: **</annotation></semantics></math></span></span></strong><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span> 1 <strong><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">.</span><span class="mord mathnormal">25permilliontokens</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">∗</span></span></span></span></strong><span class="mspace" style="margin-right:0.2222em;"></span> <strong><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8095em;vertical-align:-0.1944em;"></span><span class="mpunct"> ∗;</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal">outputcost</span><span class="mspace" style="margin-right:0.2778em;"></span></span></span></span></strong>: <strong><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.4653em;"></span><span class="mord">∗∗10</span></span></span></span></strong>.</p></li>
<li><p><strong>Una finestra di contesto da 400k</strong> (contro i 128k di o3/4o) consente di mantenere lo stato in flussi di lavoro complessi con agenti in più fasi, senza che il contesto venga tagliato.</p></li>
<li><p><strong>Meno allucinazioni e migliore utilizzo degli strumenti</strong> - Supporta chiamate di strumenti concatenate in più fasi, gestisce compiti complessi non standard e migliora l'affidabilità dell'esecuzione.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt_tool_call_e6a86fc59c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Not-Without-Flaws" class="common-anchor-header">Non senza difetti<button data-href="#Not-Without-Flaws" class="anchor-icon" translate="no">
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
    </button></h2><p>Nonostante i suoi progressi tecnici, GPT-5 mostra ancora dei limiti evidenti.</p>
<p>Al momento del lancio, il keynote di OpenAI presentava una diapositiva che calcolava in modo bizzarro <em>52,8 &gt; 69,1 = 30,8</em>, e nei nostri test il modello ripeteva con sicurezza la spiegazione da manuale, ma sbagliata, dell'"effetto Bernoulli" per il sollevamento di un aereo, ricordandoci che <strong>è ancora un apprendista di modelli, non un vero esperto del settore.</strong></p>
<p><strong>Mentre le prestazioni STEM si sono affinate, la profondità creativa è diminuita.</strong> Molti utenti di lunga data notano un declino dell'estro letterario: la poesia sembra più piatta, le conversazioni filosofiche meno ricche di sfumature e le narrazioni di lunga durata più meccaniche. Il compromesso è chiaro: maggiore accuratezza dei fatti e ragionamenti più solidi in ambiti tecnici, ma a spese del tono artistico ed esplorativo che un tempo faceva sentire GPT quasi umano.</p>
<p>Con queste premesse, vediamo come GPT-5 si comporta nei nostri test pratici.</p>
<h2 id="Coding-Tests" class="common-anchor-header">Codifica dei test<button data-href="#Coding-Tests" class="anchor-icon" translate="no">
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
    </button></h2><p>Ho iniziato con un compito semplice: scrivere uno script HTML che permetta agli utenti di caricare un'immagine e di spostarla con il mouse. GPT-5 si è fermato per circa nove secondi, poi ha prodotto del codice funzionante che gestiva bene l'interazione. Mi è sembrato un buon inizio.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt52_7b04c9b41b.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Il secondo compito era più difficile: implementare il rilevamento delle collisioni tra poligoni e sfere all'interno di un esagono rotante, con velocità di rotazione, elasticità e numero di sfere regolabili. GPT-5 ha generato la prima versione in circa tredici secondi. Il codice includeva tutte le caratteristiche previste, ma presentava dei bug e non funzionava.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_6_3e6a34572a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ho quindi usato l'opzione <strong>Fix bug</strong> dell'editor e GPT-5 ha corretto gli errori in modo che l'esagono venisse visualizzato. Tuttavia, le sfere non sono mai apparse: la logica di spawn era mancante o errata, il che significa che la funzione principale del programma era assente nonostante la configurazione altrimenti completa.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt51_6489df9914.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>In sintesi,</strong> GPT-5 è in grado di produrre codice interattivo pulito e ben strutturato e di recuperare da semplici errori di runtime. Tuttavia, in scenari complessi, rischia di omettere la logica essenziale, per cui è necessaria una revisione umana e un'iterazione prima della distribuzione.</p>
<h2 id="Reasoning-Test" class="common-anchor-header">Test di ragionamento<button data-href="#Reasoning-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>Ho proposto un rompicapo logico in più fasi che coinvolge i colori degli articoli, i prezzi e gli indizi di posizione, qualcosa che richiederebbe alla maggior parte degli esseri umani diversi minuti per essere risolto.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/reasoning_test_7ea15ed25b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Domanda:</strong> <em>Qual è l'articolo blu e qual è il suo prezzo?</em></p>
<p>Il GPT-5 ha fornito la risposta corretta in soli 9 secondi, con una spiegazione chiara e logica. Questo test ha rafforzato la forza del modello nel ragionamento strutturato e nella deduzione rapida.</p>
<h2 id="Writing-Test" class="common-anchor-header">Test di scrittura<button data-href="#Writing-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>Mi rivolgo spesso a ChatGPT per avere aiuto con blog, post sui social media e altri contenuti scritti, quindi la generazione di testo è una delle funzionalità a cui tengo di più. Per questo test, ho chiesto a GPT-5 di creare un post su LinkedIn basato su un blog che parlava dell'analizzatore multilingue di Milvus 2.6. Il risultato è stato ben organizzato e ha colpito nel segno.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Writing_Test_4fe5fef775.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Il risultato è stato ben organizzato e ha toccato tutti i punti chiave del blog originale, ma è sembrato troppo formale e prevedibile, più simile a un comunicato stampa aziendale che a qualcosa destinato a suscitare interesse in un feed sociale. Mancavano il calore, il ritmo e la personalità che rendono un post umano e invitante.</p>
<p>In compenso, le illustrazioni di accompagnamento erano eccellenti: chiare, in linea con il marchio e perfettamente in linea con lo stile tecnologico di Zilliz. L'aspetto visivo è perfetto; la scrittura ha solo bisogno di un po' più di energia creativa per essere all'altezza.</p>
<h2 id="Longer-Context-Window--Death-of-RAG-and-VectorDB" class="common-anchor-header">Finestra contestuale più lunga = morte di RAG e VectorDB?<button data-href="#Longer-Context-Window--Death-of-RAG-and-VectorDB" class="anchor-icon" translate="no">
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
    </button></h2><p>Abbiamo affrontato questo argomento l'anno scorso, quando <a href="https://zilliz.com/blog/will-retrieval-augmented-generation-RAG-be-killed-by-long-context-LLMs">Google ha lanciato <strong>Gemini 1.5 Pro</strong></a> con la sua lunghissima finestra di contesto da 10 milioni di token. All'epoca, alcuni si affrettarono a prevedere la fine di RAG e persino la fine dei database. Oggi, non solo RAG è ancora vivo, ma sta prosperando. In pratica, è diventato <em>più</em> capace e produttivo, insieme a database vettoriali come <a href="https://milvus.io/"><strong>Milvus</strong></a> e <a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a>.</p>
<p>Ora, con l'ampliamento della lunghezza del contesto di GPT-5 e le capacità più avanzate di chiamata degli strumenti, la domanda è tornata a galla: <em>Abbiamo ancora bisogno di database vettoriali per l'ingestione del contesto, o addirittura di pipeline agenti/RAG dedicate?</em></p>
<p><strong>La risposta breve è: assolutamente sì. Ne abbiamo ancora bisogno.</strong></p>
<p>Il contesto più lungo è utile, ma non sostituisce il reperimento strutturato. I sistemi multi-agente sono ancora una tendenza architettonica a lungo termine e questi sistemi hanno spesso bisogno di un contesto virtualmente illimitato. Inoltre, quando si tratta di gestire in modo sicuro dati privati e non strutturati, un database vettoriale sarà sempre il guardiano finale.</p>
<h2 id="Conclusion" class="common-anchor-header">Conclusione<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Dopo aver assistito all'evento di lancio di OpenAI e aver effettuato i miei test pratici, GPT-5 non sembra tanto un salto in avanti quanto piuttosto una miscela raffinata dei punti di forza del passato con alcuni aggiornamenti ben piazzati. Non è una cosa negativa: è un segno dei limiti architettonici e di qualità dei dati che i modelli di grandi dimensioni stanno iniziando a incontrare.</p>
<p>Come si suol dire, le <em>critiche più severe derivano da aspettative elevate</em>. La delusione per il GPT-5 deriva soprattutto dall'altissimo livello che OpenAI si è prefissato. In realtà, una migliore accuratezza, prezzi più bassi e un supporto multimodale integrato sono ancora vantaggi preziosi. Per gli sviluppatori che costruiscono agenti e pipeline RAG, questo potrebbe essere l'aggiornamento più utile finora.</p>
<p>Alcuni amici hanno scherzato sulla creazione di "memoriali online" per GPT-4o, affermando che la personalità del loro vecchio compagno di chat è sparita per sempre. A me non dispiace il cambiamento: GPT-5 potrebbe essere meno caloroso e chiacchierone, ma il suo stile diretto e senza fronzoli è una ventata di freschezza.</p>
<p><strong>E voi?</strong> Condividete i vostri pensieri con noi: unitevi al nostro <a href="https://discord.com/invite/8uyFbECzPX">Discord</a> o partecipate alla conversazione su <a href="https://www.linkedin.com/company/the-milvus-project/">LinkedIn</a> e <a href="https://x.com/milvusio">X</a>.</p>
