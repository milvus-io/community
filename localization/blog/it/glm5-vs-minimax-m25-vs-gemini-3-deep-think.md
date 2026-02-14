---
id: glm5-vs-minimax-m25-vs-gemini-3-deep-think.md
title: >-
  GLM-5 vs. MiniMax M2.5 vs. Gemini 3 Riflessione approfondita: quale modello si
  adatta al vostro stack di agenti AI?
author: 'Lumina Wang, Julie Xie'
date: 2026-02-14T00:00:00.000Z
cover: assets.zilliz.com/gemini_vs_minimax_vs_glm5_cover_1bc6d20c39.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Gemini, GLM, Minimax, ChatGPT'
meta_keywords: 'Gemini 3, GLM5, Minimax m2.5, ChatGPT'
meta_title: |
  GLM-5 vs MiniMax M2.5 vs Gemini 3 Deep Think Compared
desc: >-
  Confronto pratico tra GLM-5, MiniMax M2.5 e Gemini 3 Deep Think per la
  codifica, il ragionamento e gli agenti AI. Include un tutorial su RAG con
  Milvus.
origin: 'https://milvus.io/blog/glm5-vs-minimax-m25-vs-gemini-3-deep-think.md'
---
<p>In poco più di due giorni sono stati rilasciati tre modelli importanti uno dietro l'altro: GLM-5, MiniMax M2.5 e Gemini 3 Deep Think. Tutti e tre hanno le stesse capacità: <strong>codifica, ragionamento profondo e flussi di lavoro agici.</strong> Tutti e tre dichiarano risultati all'avanguardia. Se si osservano le schede tecniche, si potrebbe quasi giocare a un gioco di abbinamento ed eliminare gli stessi punti chiave di tutte e tre le soluzioni.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/comparsion_minimax_vs_glm5_vs_gemini3_d05715d4c2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Il pensiero più spaventoso? Probabilmente il vostro capo ha già visto gli annunci e non vede l'ora che voi creiate nove applicazioni interne utilizzando i tre modelli prima ancora che la settimana sia finita.</p>
<p>Cosa distingue effettivamente questi modelli? Come scegliere tra loro? E (come sempre) come collegarli a <a href="https://milvus.io/">Milvus</a> per creare una base di conoscenza interna? Segnatevi questa pagina. C'è tutto quello che vi serve.</p>
<h2 id="GLM-5-MiniMax-M25-and-Gemini-3-Deep-Think-at-a-Glance" class="common-anchor-header">GLM-5, MiniMax M2.5 e Gemini 3 Deep Think in sintesi<button data-href="#GLM-5-MiniMax-M25-and-Gemini-3-Deep-Think-at-a-Glance" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="GLM-5-leads-in-complex-system-engineering-and-long-horizon-agent-tasks" class="common-anchor-header">GLM-5 è leader nell'ingegneria di sistemi complessi e nei compiti di agente con orizzonte lungo</h3><p>Il 12 febbraio Zhipu ha lanciato ufficialmente GLM-5, che eccelle nell'ingegneria di sistema complessa e nei flussi di lavoro degli agenti a lungo termine.</p>
<p>Il modello ha 355B-744B parametri (40B attivi), addestrati su 28,5T token. Integra meccanismi di attenzione rada con un framework di apprendimento per rinforzo asincrono chiamato Slime, che gli consente di gestire contesti lunghissimi senza perdita di qualità e mantenendo bassi i costi di implementazione.</p>
<p>GLM-5 ha guidato il gruppo open-source nei principali benchmark, posizionandosi al primo posto su SWE-bench Verified (77,8) e al primo posto su Terminal Bench 2.0 (56,2), davanti a MiniMax 2.5 e Gemini 3 Deep Think. Detto questo, i suoi punteggi principali sono ancora inferiori a quelli dei migliori modelli closed-source come Claude Opus 4.5 e GPT-5.2. In Vending Bench 2, una valutazione di simulazione aziendale, GLM-5 ha generato 4.432 dollari di profitto annuo simulato, collocandosi più o meno nella stessa fascia dei sistemi closed-source.</p>
<p>GLM-5 ha anche apportato significativi aggiornamenti alle sue capacità di ingegneria di sistema e di agente a lungo termine. Ora è in grado di convertire testi o materiali grezzi direttamente in file .docx, .pdf e .xlsx e di generare prodotti specifici come documenti sui requisiti del prodotto, piani di lezione, esami, fogli di calcolo, rapporti finanziari, diagrammi di flusso e menu.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmark_1_aa8211e962.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmark_2_151ec06a6f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Gemini-3-Deep-Think-sets-a-new-bar-for-scientific-reasoning" class="common-anchor-header">Gemini 3 Deep Think stabilisce un nuovo limite per il ragionamento scientifico</h3><p>Nelle prime ore del 13 febbraio 2026, Google ha rilasciato ufficialmente Gemini 3 Deep Think, un aggiornamento importante che definirò (provvisoriamente) il modello di ricerca e ragionamento più forte del pianeta. Dopo tutto, Gemini è stato l'unico modello a superare il test dell'autolavaggio: "<em>Voglio lavare la mia auto e l'autolavaggio è a soli 50 metri di distanza. Devo accendere l'auto e guidare fino a lì o andare a piedi</em>?".</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/car_wash_test_gemini_859ee40db8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/car_wash_test_gpt_0ec0dffd4b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Il suo punto di forza è il ragionamento di alto livello e le prestazioni nelle competizioni: ha raggiunto 3455 Elo su Codeforces, pari all'ottavo miglior programmatore competitivo del mondo. Ha raggiunto la medaglia d'oro nelle parti scritte delle Olimpiadi Internazionali di Fisica, Chimica e Matematica del 2025. L'efficienza dei costi è un altro punto di forza. ARC-AGI-1 costa solo 7,17 dollari per task, una riduzione da 280 a 420 volte rispetto a o3-preview di OpenAI di 14 mesi prima. Dal punto di vista applicativo, i maggiori vantaggi di Deep Think riguardano la ricerca scientifica. Gli esperti lo stanno già utilizzando per la revisione paritaria di documenti matematici professionali e per l'ottimizzazione di complessi flussi di lavoro per la preparazione della crescita dei cristalli.</p>
<h3 id="MiniMax-M25-competes-on-cost-and-speed-for-production-workloads" class="common-anchor-header">MiniMax M2.5 compete su costi e velocità per i carichi di lavoro di produzione</h3><p>Lo stesso giorno, MiniMax ha rilasciato M2.5, posizionandosi come campione di costo ed efficienza per i casi di utilizzo in produzione.</p>
<p>Essendo una delle famiglie di modelli più veloci del settore, M2.5 stabilisce nuovi risultati SOTA per quanto riguarda la codifica, la chiamata agli strumenti, la ricerca e la produttività d'ufficio. Il costo è il suo principale punto di forza: la versione veloce funziona a circa 100 TPS, con l'input al prezzo di <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0,</mn><mi>30permilliontokens</mi><mn>e l'output a 0</mn></mrow><annotation encoding="application/x-tex">,30 per milione di tokens e l'output a</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span></span></span></span>0 <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">,</span><span class="mord mathnormal">30permilliontokens</span><span class="mord">e l'output a 2</span></span></span></span>,40 per milione di tokens. La versione a 50 TPS riduce il costo di produzione di un'altra metà. La velocità è migliorata del 37% rispetto al precedente M2.1 e completa i task SWE-bench Verified in una media di 22,8 minuti, più o meno come Claude Opus 4.6. Per quanto riguarda le funzionalità, M2.5 supporta lo sviluppo full-stack in oltre 10 linguaggi, tra cui Go, Rust e Kotlin, coprendo tutto, dalla progettazione di sistemi zero-to-one alla revisione completa del codice. Per i flussi di lavoro in ufficio, la funzione Office Skills si integra profondamente con Word, PPT ed Excel. Se combinata con le conoscenze di dominio in ambito finanziario e legale, può generare rapporti di ricerca e modelli finanziari pronti per l'uso diretto.</p>
<p>Questa è la panoramica di alto livello. Vediamo ora come si comportano effettivamente nei test pratici.</p>
<h2 id="Hands-On-Comparisons" class="common-anchor-header">Confronti pratici<button data-href="#Hands-On-Comparisons" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="3D-scene-rendering-Gemini-3-Deep-Think-produces-the-most-realistic-results" class="common-anchor-header">Rendering di scene 3D: Gemini 3 Deep Think produce i risultati più realistici</h3><p>Abbiamo preso una richiesta che gli utenti avevano già testato su Gemini 3 Deep Think e l'abbiamo fatta passare attraverso GLM-5 e MiniMax M2.5 per un confronto diretto. La richiesta: costruire una scena Three.js completa in un unico file HTML che renderizzi una stanza interna completamente in 3D, indistinguibile da un classico dipinto a olio in un museo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/emily_instgram_0af85c65fb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Gemini 3 Pensare in profondità</p>
<iframe width="352" height="625" src="https://www.youtube.com/embed/Lhg-XsIM_CQ" title="gemini3 deep think test: 3D redering" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<p>GLM-5</p>
<iframe width="707" height="561" src="https://www.youtube.com/embed/tTuW7qQBO1Y" title="GLM 5 test: 3D scene rendering" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<p>MiniMax M2.5</p>
<iframe width="594" height="561" src="https://www.youtube.com/embed/KJMhnXqa4Uc" title="minimax m2.5 test: 3D scene rendering" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<p><strong>Gemini 3 Deep Think</strong> ha fornito il risultato migliore. Ha interpretato accuratamente la richiesta e ha generato una scena 3D di alta qualità. L'illuminazione è stata il fiore all'occhiello: la direzione e la caduta delle ombre sono risultate naturali, trasmettendo chiaramente la relazione spaziale della luce naturale che entra da una finestra. Anche i dettagli sono stati notevoli, come la consistenza semi-fusa delle candele e la qualità dei materiali dei sigilli di cera rossi. La fedeltà visiva complessiva è stata elevata.</p>
<p><strong>GLM-5</strong> ha prodotto una modellazione dettagliata degli oggetti e un lavoro sulle texture, ma il suo sistema di illuminazione presentava problemi evidenti. Le ombre dei tavoli venivano rappresentate come blocchi neri puri e duri, senza transizioni morbide. Il sigillo di cera sembrava fluttuare sopra la superficie del tavolo, non riuscendo a gestire correttamente la relazione di contatto tra gli oggetti e il piano del tavolo. Questi artefatti indicano la necessità di migliorare l'illuminazione globale e il ragionamento spaziale.</p>
<p><strong>MiniMax M2.5</strong> non è riuscito ad analizzare efficacemente la complessa descrizione della scena. L'output è stato solo il movimento disordinato delle particelle, indicando limiti significativi sia nella comprensione che nella generazione quando si gestiscono istruzioni semantiche a più livelli con requisiti visivi precisi.</p>
<h3 id="SVG-generation-all-three-models-handle-it-differently" class="common-anchor-header">Generazione SVG: tutti e tre i modelli la gestiscono in modo diverso</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/simon_twitter_screenshot_fef1c01cbf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Prompt:</strong> Generare un SVG di un pellicano marrone della California che va in bicicletta. La bicicletta deve avere i raggi e un telaio di forma corretta. Il pellicano deve avere il suo caratteristico marsupio di grandi dimensioni e deve avere una chiara indicazione delle piume. Il pellicano deve chiaramente pedalare sulla bicicletta. L'immagine deve mostrare il piumaggio riproduttivo completo del pellicano bruno della California.</p>
<p><strong>Gemelli 3 Pensiero profondo</strong></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/gemini_3_generated_image_182aaefe26.png" alt="Gemini 3 Deep Think" class="doc-image" id="gemini-3-deep-think" />
   </span> <span class="img-wrapper"> <span>Gemelli 3 Pensiero profondo</span> </span></p>
<p><strong>GLM-5</strong></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/GLM_5_generated_image_e84302d987.png" alt="GLM-5" class="doc-image" id="glm-5" />
   </span> <span class="img-wrapper"> <span>GLM-5</span> </span></p>
<p><strong>MiniMax M2.5</strong></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/minimax_m2_5_generated_image_06d50f8fa7.png" alt="MiniMax M2.5" class="doc-image" id="minimax-m2.5" />
   </span> <span class="img-wrapper"> <span>MiniMax M2.5</span> </span></p>
<p><strong>Gemini 3 Deep Think</strong> ha prodotto l'SVG più completo in assoluto. La postura del pellicano è accurata: il suo centro di gravità si trova naturalmente sul sedile e i suoi piedi poggiano sui pedali in una posa dinamica da ciclista. La texture delle piume è dettagliata e stratificata. L'unico punto debole è che il marsupio del pellicano è disegnato troppo grande, il che altera leggermente le proporzioni complessive.</p>
<p><strong>GLM-5</strong> presenta notevoli problemi di postura. I piedi sono posizionati correttamente sui pedali, ma la posizione generale di seduta si allontana da una postura di guida naturale e il rapporto corpo-sedile sembra sbagliato. Detto questo, il lavoro sui dettagli è solido: il marsupio è ben proporzionato e la qualità delle texture delle piume è rispettabile.</p>
<p><strong>MiniMax M2.5</strong> ha scelto uno stile minimalista, saltando completamente gli elementi di sfondo. La posizione del pellicano sulla bicicletta è approssimativamente corretta, ma il lavoro di dettaglio non è all'altezza. Il manubrio ha la forma sbagliata, la texture della piuma è quasi inesistente, il collo è troppo spesso e nell'immagine sono presenti artefatti ovali bianchi che non dovrebbero esserci.</p>
<h2 id="How-to-Choose-Between-GLM-5-MiniMax-M25-and-Gemin-3-Deep-Think" class="common-anchor-header">Come scegliere tra GLM-5, MiniMax M2.5 e Gemin 3 Deep Think<button data-href="#How-to-Choose-Between-GLM-5-MiniMax-M25-and-Gemin-3-Deep-Think" class="anchor-icon" translate="no">
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
    </button></h2><p>In tutti i nostri test, MiniMax M2.5 è stato il più lento a generare l'output, richiedendo il tempo più lungo per pensare e ragionare. GLM-5 si è comportato in modo coerente ed è stato all'incirca alla pari con Gemini 3 Deep Think in termini di velocità.</p>
<p>Ecco una rapida guida alla selezione che abbiamo messo insieme:</p>
<table>
<thead>
<tr><th>Caso d'uso principale</th><th>Modello consigliato</th><th>Punti di forza</th></tr>
</thead>
<tbody>
<tr><td>Ricerca scientifica, ragionamento avanzato (fisica, chimica, matematica, progettazione di algoritmi complessi)</td><td>Gemelli 3 Pensiero profondo</td><td>Prestazioni da medaglia d'oro nelle competizioni accademiche. Verifica dei dati scientifici di alto livello. Programmazione competitiva di livello mondiale su Codeforces. Applicazioni di ricerca comprovate, tra cui l'identificazione di difetti logici in documenti professionali. (Attualmente limitato agli abbonati a Google AI Ultra e a utenti aziendali selezionati; il costo per attività è relativamente alto).</td></tr>
<tr><td>Distribuzione open-source, personalizzazione di intranet aziendali, sviluppo full-stack, integrazione delle competenze di Office.</td><td>Zhipu GLM-5</td><td>Modello open-source di prim'ordine. Forti capacità di progettazione a livello di sistema. Supporta la distribuzione locale con costi gestibili.</td></tr>
<tr><td>Carichi di lavoro sensibili ai costi, programmazione multilingue, sviluppo multipiattaforma (Web/Android/iOS/Windows), compatibilità con l'ufficio.</td><td>MiniMax M2.5</td><td>A 100 TPS: <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0,30 per milione di</mn><mi>inputkens</mi><mo separator="true">,</mo></mrow><annotation encoding="application/x-tex">0,30 per milione di input tokens,</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span></span></span></span>0 <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">,30 per milione di</span><span class="mord mathnormal">inputkens</span><span class="mpunct">,</span></span></span></span>2,40 per milione di output tokens. SOTA nei benchmark di ufficio, codifica e chiamata di strumenti. Primo posto nel Multi-SWE-Bench. Forte generalizzazione. I tassi di superamento su Droid/OpenCode superano Claude Opus 4.6.</td></tr>
</tbody>
</table>
<h2 id="RAG-Tutorial-Wire-Up-GLM-5-with-Milvus-for-a-Knowledge-Base" class="common-anchor-header">Esercitazione RAG: Collegare GLM-5 con Milvus per una base di conoscenza<button data-href="#RAG-Tutorial-Wire-Up-GLM-5-with-Milvus-for-a-Knowledge-Base" class="anchor-icon" translate="no">
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
    </button></h2><p>Sia GLM-5 che MiniMax M2.5 sono disponibili tramite <a href="https://openrouter.ai/">OpenRouter</a>. Registratevi e create un <code translate="no">OPENROUTER_API_KEY</code> per iniziare.</p>
<p>Questa esercitazione utilizza GLM-5 di Zhipu come esempio di LLM. Per utilizzare MiniMax, è sufficiente cambiare il nome del modello in <code translate="no">minimax/minimax-m2.5</code>.</p>
<h3 id="Dependencies-and-environment-setup" class="common-anchor-header">Dipendenze e configurazione dell'ambiente</h3><p>Installare o aggiornare pymilvus, openai, requests e tqdm alle loro ultime versioni:</p>
<pre><code translate="no">pip install --upgrade pymilvus openai requests tqdm 
<button class="copy-code-btn"></button></code></pre>
<p>Questo tutorial utilizza GLM-5 come LLM e text-embedding-3-small di OpenAI come modello di embedding.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;OPENROUTER_API_KEY&quot;</span>] = <span class="hljs-string">&quot;**********&quot;</span> 
<button class="copy-code-btn"></button></code></pre>
<h3 id="Data-preparation" class="common-anchor-header">Preparazione dei dati</h3><p>Utilizzeremo le pagine FAQ della documentazione di Milvus 2.4.x come base di conoscenza privata.</p>
<p>Scaricare il file zip ed estrarre i documenti in una cartella <code translate="no">milvus_docs</code>:</p>
<pre><code translate="no">wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs
<button class="copy-code-btn"></button></code></pre>
<p>Caricare tutti i file Markdown da <code translate="no">milvus_docs/en/faq</code>. Dividiamo ogni file in <code translate="no">&quot;# &quot;</code> per separare approssimativamente il contenuto per sezioni principali:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob
text_lines = []
<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()
    text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="LLM-and-embedding-model-setup" class="common-anchor-header">Impostazione del modello LLM e di incorporazione</h3><p>Useremo GLM-5 come LLM e text-embedding-3-small come modello di embedding:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAI</span>
glm_client = <span class="hljs-title class_">OpenAI</span>(
    api_key=os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;OPENROUTER_API_KEY&quot;</span>],
    base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>Generare un embedding di prova e stamparne le dimensioni e i primi elementi:</p>
<pre><code translate="no">EMBEDDING_MODEL = <span class="hljs-string">&quot;openai/text-embedding-3-small&quot;</span>  <span class="hljs-comment"># OpenRouter embedding model</span>
resp = glm_client.embeddings.create(
    model=EMBEDDING_MODEL,
    <span class="hljs-built_in">input</span>=[<span class="hljs-string">&quot;This is a test1&quot;</span>, <span class="hljs-string">&quot;This is a test2&quot;</span>],
)
test_embeddings = [d.embedding <span class="hljs-keyword">for</span> d <span class="hljs-keyword">in</span> resp.data]
embedding_dim = <span class="hljs-built_in">len</span>(test_embeddings[<span class="hljs-number">0</span>])
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embeddings[<span class="hljs-number">0</span>][:<span class="hljs-number">10</span>])
<button class="copy-code-btn"></button></code></pre>
<p>Output:</p>
<pre><code translate="no"><span class="hljs-number">1536</span>
[<span class="hljs-meta">0.010637564584612846, -0.017222722992300987, 0.05409347265958786, -0.04377825930714607, -0.017545074224472046, -0.04196695610880852, -0.0011963422875851393, 0.03837504982948303, 0.0008855042979121208, 0.015181170776486397</span>]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Load-data-into-Milvus" class="common-anchor-header">Caricare i dati in Milvus</h3><p><strong>Creare una collezione:</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>
milvus_client = <span class="hljs-title class_">MilvusClient</span>(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)
collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Una nota sulla configurazione di MilvusClient:</p>
<ul>
<li><p>L'impostazione dell'URI a un file locale (ad esempio, <code translate="no">./milvus.db</code>) è l'opzione più semplice. Utilizza automaticamente Milvus Lite per memorizzare tutti i dati in quel file.</p></li>
<li><p>Per i dati su larga scala, è possibile distribuire un server Milvus più performante su Docker o Kubernetes. In questo caso, utilizzare l'URI del server (ad esempio, <code translate="no">http://localhost:19530</code>).</p></li>
<li><p>Per utilizzare Zilliz Cloud (la versione cloud completamente gestita di Milvus), impostare l'URI e il token sull'Endpoint pubblico e sulla chiave API dalla console di Zilliz Cloud.</p></li>
</ul>
<p>Verificare se la raccolta esiste già e, in caso affermativo, eliminarla:</p>
<pre><code translate="no">if milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)
<button class="copy-code-btn"></button></code></pre>
<p>Creare una nuova raccolta con i parametri specificati. Se non si forniscono definizioni di campi, Milvus crea automaticamente un campo <code translate="no">id</code> predefinito come chiave primaria e un campo <code translate="no">vector</code> per i dati vettoriali. Un campo JSON riservato memorizza i campi e i valori non definiti nello schema:</p>
<pre><code translate="no">milvus_client.<span class="hljs-title function_">create_collection</span>(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Insert-data" class="common-anchor-header">Inserire i dati</h3><p>Interagire con le righe di testo, generare le incorporazioni e inserire i dati in Milvus. Il campo <code translate="no">text</code> non è definito nello schema. Viene aggiunto automaticamente come campo dinamico supportato dal campo JSON riservato di Milvus:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm
data = []
resp = glm_client.embeddings.create(model=EMBEDDING_MODEL, <span class="hljs-built_in">input</span>=text_lines)
doc_embeddings = [d.embedding <span class="hljs-keyword">for</span> d <span class="hljs-keyword">in</span> resp.data]
<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})
milvus_client.insert(collection_name=collection_name, data=data)
<button class="copy-code-btn"></button></code></pre>
<p>Output:</p>
<pre><code translate="no">Creating embeddings: 100%|██████████████████████████| 72/72 [00:00&lt;00:00, 125203.10it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, ..., 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Build-the-RAG-pipeline" class="common-anchor-header">Costruire la pipeline RAG</h3><p><strong>Recuperare i documenti rilevanti:</strong></p>
<p>Poniamo una domanda comune su Milvus:</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Cercare nella raccolta i 3 risultati più rilevanti:</p>
<pre><code translate="no">resp = glm_client.embeddings.create(model=EMBEDDING_MODEL, <span class="hljs-built_in">input</span>=[question])
question_embedding = resp.data[<span class="hljs-number">0</span>].embedding
search_res = milvus_client.search(
    collection_name=collection_name,
    data=[question_embedding],
    limit=<span class="hljs-number">3</span>,
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>I risultati sono ordinati per distanza, il più vicino per primo:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json

retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))

[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including MinIO, AWS S3, Google Cloud Storage (GCS), Azure Blob Storage, Alibaba Cloud OSS, and Tencent Cloud Object Storage (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        <span class="hljs-number">0.7826977372169495</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus handle vector data types and precision?\n\nMilvus supports Binary, Float32, Float16, and BFloat16 vector types.\n\n- Binary vectors: Store binary data as sequences of 0s and 1s, used in image processing and information retrieval.\n- Float32 vectors: Default storage with a precision of about 7 decimal digits. Even Float64 values are stored with Float32 precision, leading to potential precision loss upon retrieval.\n- Float16 and BFloat16 vectors: Offer reduced precision and memory usage. Float16 is suitable for applications with limited bandwidth and storage, while BFloat16 balances range and efficiency, commonly used in deep learning to reduce computational requirements without significantly impacting accuracy.\n\n###&quot;</span>,
        <span class="hljs-number">0.6772387027740479</span>
    ],
    [
        <span class="hljs-string">&quot;How much does Milvus cost?\n\nMilvus is a 100% free open-source project.\n\nPlease adhere to Apache License 2.0 when using Milvus for production or distribution purposes.\n\nZilliz, the company behind Milvus, also offers a fully managed cloud version of the platform for those that don&#x27;t want to build and maintain their own distributed instance. Zilliz Cloud automatically maintains data reliability and allows users to pay only for what they use.\n\n###&quot;</span>,
        <span class="hljs-number">0.6467022895812988</span>
    ]
]
<button class="copy-code-btn"></button></code></pre>
<p><strong>Generare una risposta con il LLM:</strong></p>
<p>Combinare i documenti recuperati in una stringa di contesto:</p>
<pre><code translate="no">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>Impostare i prompt del sistema e dell'utente. Il prompt dell'utente viene costruito a partire dai documenti recuperati da Milvus:</p>
<pre><code translate="no">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
Human: You are an AI assistant. You can find answers to the questions in the contextual passage snippets provided.
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
<p>Chiamare GLM-5 per generare la risposta finale:</p>
<pre><code translate="no">response = glm_client.chat.completions.create(
    model=<span class="hljs-string">&quot;z-ai/glm-5&quot;</span>,
    messages=[
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT},
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT},
    ],
)
<span class="hljs-built_in">print</span>(response.choices[<span class="hljs-number">0</span>].message.content)
<button class="copy-code-btn"></button></code></pre>
<p>GLM-5 restituisce una risposta ben strutturata:</p>
<pre><code translate="no">Based <span class="hljs-keyword">on</span> the provided context, Milvus stores data <span class="hljs-keyword">in</span> two main ways, depending <span class="hljs-keyword">on</span> the data type:

<span class="hljs-number">1.</span> Inserted Data
   - What it includes: vector data, scalar data, <span class="hljs-keyword">and</span> collection-specific schema.
   - How it <span class="hljs-keyword">is</span> stored: <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> an incremental log.
   - Storage Backends: Milvus supports multiple <span class="hljs-built_in">object</span> storage backends, including MinIO, AWS S3, <span class="hljs-function">Google Cloud <span class="hljs-title">Storage</span> (<span class="hljs-params">GCS</span>), Azure Blob Storage, Alibaba Cloud OSS, <span class="hljs-keyword">and</span> Tencent Cloud Object <span class="hljs-title">Storage</span> (<span class="hljs-params">COS</span>).
   - Vector Specifics: vector data can be stored <span class="hljs-keyword">as</span> Binary <span class="hljs-title">vectors</span> (<span class="hljs-params">sequences of <span class="hljs-number">0</span>s <span class="hljs-keyword">and</span> <span class="hljs-number">1</span>s</span>), Float32 <span class="hljs-title">vectors</span> (<span class="hljs-params"><span class="hljs-literal">default</span> storage</span>), <span class="hljs-keyword">or</span> Float16 <span class="hljs-keyword">and</span> BFloat16 <span class="hljs-title">vectors</span> (<span class="hljs-params">offering reduced precision <span class="hljs-keyword">and</span> memory usage</span>).

2. Metadata
   - What it includes: data generated within Milvus modules.
   - How it <span class="hljs-keyword">is</span> stored: <span class="hljs-keyword">in</span> etcd.
</span><button class="copy-code-btn"></button></code></pre>
<h2 id="Conclusion-Pick-the-Model-Then-Build-the-Pipeline" class="common-anchor-header">Conclusione: Scegliere il modello, poi costruire la pipeline<button data-href="#Conclusion-Pick-the-Model-Then-Build-the-Pipeline" class="anchor-icon" translate="no">
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
    </button></h2><p>Tutti e tre i modelli sono forti, ma in modo diverso. Gemini 3 Deep Think è il modello da scegliere quando la profondità del ragionamento è più importante del costo. GLM-5 è la migliore opzione open-source per i team che hanno bisogno di implementazione locale e di ingegneria a livello di sistema. MiniMax M2.5 ha senso quando si tratta di ottimizzare il throughput e il budget per i carichi di lavoro di produzione.</p>
<p>Il modello scelto è solo metà dell'equazione. Per trasformare uno di questi modelli in un'applicazione utile, è necessario un livello di recupero in grado di scalare con i dati. È qui che entra in gioco Milvus. L'esercitazione RAG di cui sopra funziona con qualsiasi modello compatibile con OpenAI, quindi per passare da GLM-5 a MiniMax M2.5 o a qualsiasi altra versione futura basta cambiare una sola riga.</p>
<p>Se state progettando agenti AI locali o on-premise e volete discutere più dettagliatamente dell'architettura di archiviazione, del design delle sessioni o del rollback sicuro, non esitate a unirvi al nostro <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">canale Slack</a>. Potete anche prenotare un incontro individuale di 20 minuti tramite <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a> per una guida personalizzata.</p>
<p>Se volete approfondire la costruzione di agenti AI, ecco altre risorse per aiutarvi a iniziare.</p>
<ul>
<li><p><a href="https://milvus.io/blog/how-to-build-productionready-multiagent-systems-with-agno-and-milvus.md">Come costruire sistemi multi-agente pronti per la produzione con Agno e Milvus</a></p></li>
<li><p><a href="https://zilliz.com/learn">Scegliere il giusto modello di embedding per la vostra pipeline RAG</a></p></li>
<li><p><a href="https://zilliz.com/learn">Come costruire un agente AI con Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">Cos'è OpenClaw? Guida completa all'agente AI open source</a></p></li>
<li><p><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Esercitazione su OpenClaw: Connettersi a Slack per un assistente AI locale</a></p></li>
<li><p><a href="https://milvus.io/blog/clawdbot-long-running-ai-agents-langgraph-milvus.md">Costruire agenti di intelligenza artificiale in stile Clawdbot con LangGraph e Milvus</a></p></li>
</ul>
