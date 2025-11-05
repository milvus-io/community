---
id: drag-drop-and-deploy-how-to-build-rag-workflows-with-langflow-and-milvus.md
title: >-
  Trascina, rilascia e distribuisci: Come costruire flussi di lavoro RAG con
  Langflow e Milvus
author: Min Yin
date: 2025-10-30T00:00:00.000Z
cover: assets.zilliz.com/langflow_milvus_cover_9f75a11f90.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Langflow, Milvus, RAG, AI workflow'
meta_title: 'Drag, Drop, and Deploy RAG Workflows with Langflow & Milvus'
desc: >-
  Imparate a costruire flussi di lavoro RAG visivi utilizzando Langflow e
  Milvus. Trascinate, rilasciate e distribuite in pochi minuti le applicazioni
  di intelligenza artificiale consapevoli del contesto, senza bisogno di
  codifica.
origin: >-
  https://milvus.io/blog/drag-drop-and-deploy-how-to-build-rag-workflows-with-langflow-and-milvus.md
---
<p>Costruire un flusso di lavoro di intelligenza artificiale spesso sembra più difficile del dovuto. Tra la scrittura del codice glue, il debug delle chiamate API e la gestione delle pipeline di dati, il processo può consumare ore prima di vedere i risultati. <a href="https://www.langflow.org/"><strong>Langflow</strong></a> e <a href="https://milvus.io/"><strong>Milvus</strong></a> semplificano drasticamente questo aspetto, offrendo un modo leggero per progettare, testare e distribuire flussi di lavoro con generazione aumentata dal reperimento (RAG) in pochi minuti, non in giorni.</p>
<p><strong>Langflow</strong> offre un'interfaccia pulita e drag-and-drop che sembra più simile a uno schizzo di idee su una lavagna che alla codifica. È possibile collegare visivamente modelli linguistici, fonti di dati e strumenti esterni per definire la logica del flusso di lavoro, il tutto senza toccare una sola riga di codice.</p>
<p>Abbinato a <strong>Milvus</strong>, il database vettoriale open-source che fornisce agli LLM memoria a lungo termine e comprensione del contesto, i due formano un ambiente completo per RAG di livello produttivo. Milvus memorizza e recupera in modo efficiente gli embeddings dai dati aziendali o specifici del dominio, consentendo ai LLM di generare risposte fondate, accurate e consapevoli del contesto.</p>
<p>In questa guida spiegheremo come combinare Langflow e Milvus per creare un flusso di lavoro RAG avanzato, il tutto con pochi trascinamenti e clic.</p>
<h2 id="What-is-Langflow" class="common-anchor-header">Che cos'è Langflow?<button data-href="#What-is-Langflow" class="anchor-icon" translate="no">
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
    </button></h2><p>Prima di passare alla dimostrazione di RAG, impariamo cos'è Langflow e cosa può fare.</p>
<p>Langflow è un framework open-source basato su Python che facilita la creazione e la sperimentazione di applicazioni di IA. Supporta le principali funzionalità di IA, come gli agenti e il Model Context Protocol (MCP), offrendo a sviluppatori e non sviluppatori una base flessibile per la creazione di sistemi intelligenti.</p>
<p>Il cuore di Langflow è un editor visivo. È possibile trascinare, rilasciare e collegare diverse risorse per progettare applicazioni complete che combinano modelli, strumenti e fonti di dati. Quando si esporta un flusso di lavoro, Langflow genera automaticamente un file chiamato <code translate="no">FLOW_NAME.json</code> sul computer locale. Questo file registra tutti i nodi, i bordi e i metadati che descrivono il flusso, consentendo di controllare la versione, condividere e riprodurre facilmente i progetti tra i vari team.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Langflow_s_visual_editor_cd553ad4ad.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Dietro le quinte, un motore di runtime basato su Python esegue il flusso. Esso orchestra gli LLM, gli strumenti, i moduli di recupero e la logica di routing, gestendo il flusso dei dati, lo stato e la gestione degli errori per assicurare un'esecuzione fluida dall'inizio alla fine.</p>
<p>Langflow include anche una ricca libreria di componenti con adattatori precostituiti per i più diffusi LLM e database vettoriali, compreso <a href="https://milvus.io/">Milvus</a>. È possibile estendere ulteriormente questa libreria creando componenti Python personalizzati per casi d'uso particolari. Per i test e l'ottimizzazione, Langflow offre un'esecuzione passo-passo, un Playground per test rapidi e integrazioni con LangSmith e Langfuse per il monitoraggio, il debug e la riproduzione dei flussi di lavoro end-to-end.</p>
<h2 id="Hands-on-Demo-How-to-Build-a-RAG-Workflow-with-Langflow-and-Milvus" class="common-anchor-header">Dimostrazione pratica: Come costruire un flusso di lavoro RAG con Langflow e Milvus<button data-href="#Hands-on-Demo-How-to-Build-a-RAG-Workflow-with-Langflow-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Basandosi sull'architettura di Langflow, Milvus può fungere da database vettoriale che gestisce gli embeddings e recupera dati aziendali privati o conoscenze specifiche del dominio.</p>
<p>In questa demo, utilizzeremo il modello RAG Vector Store di Langflow per dimostrare come integrare Milvus e costruire un indice vettoriale dai dati locali, consentendo una risposta efficiente e contestualizzata alle domande.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_processing_flow_289a9376c9.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Prerequisites" class="common-anchor-header">Prerequisiti: 1.Python 3.11</h3><p>1.Python 3.11 (o Conda)</p>
<p>2.uv</p>
<p>3.Docker e Docker Compose</p>
<p>4.Chiave OpenAI</p>
<h3 id="Step-1-Deploy-Milvus-Vector-Database" class="common-anchor-header">Passo 1. Distribuzione del database vettoriale Milvus</h3><p>Scaricare i file di distribuzione.</p>
<pre><code translate="no">wget &lt;https://github.com/Milvus-io/Milvus/releases/download/v2.5.12/Milvus-standalone-docker-compose.yml&gt; -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<p>Avviare il servizio Milvus.</p>
<pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/start_milvus_service_860353ed55.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Create-a-Python-Virtual-Environment" class="common-anchor-header">Passo 2. Creare un ambiente virtuale Python</h3><pre><code translate="no">conda create -n langflow
<span class="hljs-comment"># activate langflow and launch it</span>
conda activate langflow
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Install-the-Latest-Packages" class="common-anchor-header">Passo 3. Installare i pacchetti più recenti</h3><pre><code translate="no">pip install langflow -U
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Launch-Langflow" class="common-anchor-header">Passo 4. Avviare Langflow</h3><pre><code translate="no">uv run langflow run
<button class="copy-code-btn"></button></code></pre>
<p>Visitate Langflow.</p>
<pre><code translate="no">&lt;<span class="hljs-attr">http</span>:<span class="hljs-comment">//127.0.0.1:7860&gt;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-5-Configure-the-RAG-Template" class="common-anchor-header">Passo 5. Configurare il modello RAG</h3><p>Selezionate il modello RAG Vector Store in Langflow.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/rag1_fcb0d1c3c5.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/rag2_f750e10a41.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Scegliere Milvus come database vettoriale predefinito.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb_milvus_925c6ce846.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Nel pannello di sinistra, cercare "Milvus" e aggiungerlo al flusso.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/add_milvus1_862d14d0d0.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/add_milvus2_4e3d6aacda.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Configurare i dettagli di connessione di Milvus. Lasciare le altre opzioni come predefinite per ora.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/connect1_a27d3e4f43.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/connect2_d8421c1525.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Aggiungere la chiave API OpenAI al nodo corrispondente.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/openai_key_7a6596868c.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/openai_key2_4753bfb4d0.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-6-Prepare-Test-Data" class="common-anchor-header">Passo 6. Preparare i dati di prova</h3><p>Nota: utilizzare le FAQ ufficiali di Milvus 2.6 come dati di prova.</p>
<pre><code translate="no">https://github.com/milvus-io/milvus-docs/blob/v2.6.x/site/en/faq/product_faq.md
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-7-Phase-One-Testing" class="common-anchor-header">Passo 7. Fase uno di test</h3><p>Caricare il set di dati e inserirlo in Milvus. Nota: Langflow converte il testo in rappresentazioni vettoriali. È necessario caricare almeno due set di dati, altrimenti il processo di incorporazione fallirà. Si tratta di un bug noto nell'attuale implementazione dei nodi di Langflow.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ingest_7b804d870a.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ingest2_fc7f1e4d9a.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Controllate lo stato dei vostri nodi.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test_48e02d48ca.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-8-Phase-Two-Testing" class="common-anchor-header">Fase 8. Fase due di test</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ingest_7b804d870a.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-9-Run-the-Full-RAG-Workflow" class="common-anchor-header">Fase 9. Eseguire il flusso di lavoro RAG completo</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/full_flow1_5b4f4962f5.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/full_flow2_535c722a3d.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>Costruire flussi di lavoro AI non deve essere complicato. Langflow + Milvus lo rende veloce, visuale e leggero dal punto di vista del codice: un modo semplice per potenziare RAG senza un pesante sforzo ingegneristico.</p>
<p>L'interfaccia drag-and-drop di Langflow lo rende una scelta adatta per l'insegnamento, i workshop o le dimostrazioni dal vivo, quando è necessario dimostrare il funzionamento dei sistemi di IA in modo chiaro e interattivo. Per i team che desiderano integrare la progettazione di un flusso di lavoro intuitivo con il reperimento di vettori di livello aziendale, la combinazione della semplicità di Langflow con la ricerca ad alte prestazioni di Milvus offre flessibilità e potenza.</p>
<p>👉 Iniziate a creare flussi di lavoro RAG più intelligenti con <a href="https://milvus.io/">Milvus</a> oggi stesso.</p>
<p>Avete domande o volete un approfondimento su una qualsiasi funzione? Unitevi al nostro<a href="https://discord.com/invite/8uyFbECzPX"> canale Discord</a> o inviate problemi su<a href="https://github.com/milvus-io/milvus"> GitHub</a>. È anche possibile prenotare una sessione individuale di 20 minuti per ottenere approfondimenti, indicazioni e risposte alle vostre domande tramite<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
