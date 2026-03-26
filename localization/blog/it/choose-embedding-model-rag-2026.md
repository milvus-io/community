---
id: choose-embedding-model-rag-2026.md
title: >-
  Come scegliere il miglior modello di incorporazione per il RAG nel 2026: 10
  modelli a confronto
author: Cheney Zhang
date: 2026-3-26
cover: assets.zilliz.com/embedding_model_cover_ab72ccd651.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, Gemini Embedding 2, Embedding Model, RAG'
meta_keywords: >-
  best embedding model for RAG, embedding model comparison, multimodal embedding
  benchmark, MRL dimension compression, Gemini Embedding 2
meta_title: |
  Best Embedding Model for RAG 2026: 10 Models Compared
desc: >-
  Abbiamo confrontato 10 modelli di incorporazione su compiti di compressione
  cross-modale, cross-lingua, di documenti lunghi e di dimensioni. Scoprite
  quale si adatta alla vostra pipeline RAG.
origin: 'https://milvus.io/blog/choose-embedding-model-rag-2026.md'
---
<p><strong>TL;DR:</strong> Abbiamo testato 10 <a href="https://zilliz.com/ai-models">modelli di incorporazione</a> in quattro scenari di produzione che mancano ai benchmark pubblici: recupero cross-modale, recupero cross-linguistico, recupero di informazioni chiave e compressione dimensionale. Nessun modello vince su tutto. Gemini Embedding 2 è il migliore in assoluto. L'open-source Qwen3-VL-2B batte le API closed-source nei compiti cross-modali. Se avete bisogno di comprimere le dimensioni per risparmiare spazio, scegliete Voyage Multimodal 3.5 o Jina Embeddings v4.</p>
<h2 id="Why-MTEB-Isnt-Enough-for-Choosing-an-Embedding-Model" class="common-anchor-header">Perché MTEB non è sufficiente per scegliere un modello di embedding<button data-href="#Why-MTEB-Isnt-Enough-for-Choosing-an-Embedding-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>La maggior parte dei prototipi <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> inizia con il text-embedding-3-small di OpenAI. È economico, facile da integrare e per il recupero di testi in inglese funziona abbastanza bene. Ma il RAG di produzione lo supera rapidamente. La vostra pipeline raccoglie immagini, PDF, documenti multilingue e un <a href="https://zilliz.com/ai-models">modello di incorporazione di</a> solo testo non è più sufficiente.</p>
<p>La <a href="https://huggingface.co/spaces/mteb/leaderboard">classifica MTEB</a> indica che ci sono opzioni migliori. Il problema? MTEB testa solo il recupero di testo in una sola lingua. Non si occupa del reperimento cross-modale (query di testo rispetto a raccolte di immagini), della ricerca cross-lingue (una query in cinese che trova un documento in inglese), dell'accuratezza dei documenti lunghi o di quanta qualità si perde quando si troncano le <a href="https://zilliz.com/glossary/dimension">dimensioni dell'incorporamento</a> per risparmiare spazio nel <a href="https://zilliz.com/learn/what-is-a-vector-database">database vettoriale</a>.</p>
<p>Quale modello di incorporazione utilizzare? Dipende dai tipi di dati, dalle lingue, dalla lunghezza dei documenti e dall'eventuale necessità di compressione delle dimensioni. Abbiamo creato un benchmark chiamato <strong>CCKM</strong> e abbiamo testato 10 modelli rilasciati tra il 2025 e il 2026 proprio su queste dimensioni.</p>
<h2 id="What-Is-the-CCKM-Benchmark" class="common-anchor-header">Cos'è il benchmark CCKM?<button data-href="#What-Is-the-CCKM-Benchmark" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>CCKM</strong> (Cross-modal, Cross-lingual, Key information, MRL) mette alla prova quattro capacità che i benchmark standard non riescono a cogliere:</p>
<table>
<thead>
<tr><th>Dimensione</th><th>Cosa verifica</th><th>Perché è importante</th></tr>
</thead>
<tbody>
<tr><td><strong>Recupero cross-modale</strong></td><td>Abbinare le descrizioni testuali all'immagine corretta in presenza di distrattori quasi identici</td><td>Le pipeline<a href="https://zilliz.com/learn/multimodal-rag">RAG multimodali</a> necessitano di incorporazioni di testo e immagini nello stesso spazio vettoriale</td></tr>
<tr><td><strong>Recupero interlinguistico</strong></td><td>Trovare il documento inglese corretto da una query in cinese e viceversa</td><td>Le basi di conoscenza di produzione sono spesso multilingue</td></tr>
<tr><td><strong>Recupero di informazioni chiave</strong></td><td>Individuare un fatto specifico sepolto in un documento di 4K-32K caratteri (ago in un pagliaio)</td><td>I sistemi RAG elaborano spesso documenti lunghi come contratti e documenti di ricerca.</td></tr>
<tr><td><strong>Compressione dimensionale MRL</strong></td><td>Misura di quanta qualità perde il modello quando si troncano le incorporazioni a 256 dimensioni.</td><td>Meno dimensioni = minor costo di archiviazione nel database vettoriale, ma a quale costo qualitativo?</td></tr>
</tbody>
</table>
<p>MTEB non copre nessuno di questi aspetti. MMEB aggiunge il multimodale ma salta gli hard negative, quindi i modelli ottengono un punteggio elevato senza dimostrare di saper gestire le distinzioni più sottili. CCKM è progettato per coprire ciò che manca a questi modelli.</p>
<h2 id="Which-Embedding-Models-Did-We-Test-Gemini-Embedding-2-Jina-Embeddings-v4-and-More" class="common-anchor-header">Quali modelli di incorporazione abbiamo testato? Gemini Embedding 2, Jina Embeddings v4 e altri ancora<button data-href="#Which-Embedding-Models-Did-We-Test-Gemini-Embedding-2-Jina-Embeddings-v4-and-More" class="anchor-icon" translate="no">
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
    </button></h2><p>Abbiamo testato 10 modelli che coprono sia i servizi API che le opzioni open-source, oltre a CLIP ViT-L-14 come riferimento per il 2021.</p>
<table>
<thead>
<tr><th>Modello</th><th>Fonte</th><th>Parametri</th><th>Dimensioni</th><th>Modalità</th><th>Tratto chiave</th></tr>
</thead>
<tbody>
<tr><td>Incorporazione Gemini 2</td><td>Google</td><td>Non divulgato</td><td>3072</td><td>Testo / immagine / video / audio / PDF</td><td>All-modality, la più ampia copertura</td></tr>
<tr><td>Jina Embeddings v4</td><td>Jina AI</td><td>3.8B</td><td>2048</td><td>Testo / immagine / PDF</td><td>Adattatori MRL + LoRA</td></tr>
<tr><td>Voyage Multimodal 3.5</td><td>Voyage AI (MongoDB)</td><td>Non divulgato</td><td>1024</td><td>Testo / immagine / video</td><td>Bilanciato tra i compiti</td></tr>
<tr><td>Qwen3-VL-Embedding-2B</td><td>Alibaba Qwen</td><td>2B</td><td>2048</td><td>Testo / immagine / video</td><td>Open-source, multimodale leggero</td></tr>
<tr><td>Jina CLIP v2</td><td>Jina AI</td><td>~1B</td><td>1024</td><td>Testo / immagine</td><td>Architettura CLIP modernizzata</td></tr>
<tr><td>Cohere Embed v4</td><td>Cohere</td><td>Non divulgato</td><td>Fissato</td><td>Testo</td><td>Recupero aziendale</td></tr>
<tr><td>OpenAI text-embedding-3-large</td><td>OpenAI</td><td>Non divulgato</td><td>3072</td><td>Testo</td><td>Il più utilizzato</td></tr>
<tr><td><a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings">BGE-M3</a></td><td>BAAI</td><td>568M</td><td>1024</td><td>Testo</td><td>Open-source, oltre 100 lingue</td></tr>
<tr><td>mxbai-embed-large</td><td>Pane misto AI</td><td>335M</td><td>1024</td><td>Testo</td><td>Leggero, incentrato sull'inglese</td></tr>
<tr><td>nomic-embed-text</td><td>AI nomica</td><td>137M</td><td>768</td><td>Testo</td><td>Ultra-leggero</td></tr>
<tr><td>CLIP ViT-L-14</td><td>OpenAI (2021)</td><td>428M</td><td>768</td><td>Testo / immagine</td><td>Linea di base</td></tr>
</tbody>
</table>
<h2 id="Cross-Modal-Retrieval-Which-Models-Handle-Text-to-Image-Search" class="common-anchor-header">Recupero cross-modale: Quali modelli gestiscono la ricerca da testo a immagine?<button data-href="#Cross-Modal-Retrieval-Which-Models-Handle-Text-to-Image-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Se la pipeline RAG gestisce le immagini insieme al testo, il modello di incorporazione deve collocare entrambe le modalità nello stesso <a href="https://zilliz.com/glossary/vector-embeddings">spazio vettoriale</a>. Si pensi alla ricerca di immagini nell'e-commerce, alle basi di conoscenza miste immagine-testo o a qualsiasi sistema in cui una query testuale deve trovare l'immagine giusta.</p>
<h3 id="Method" class="common-anchor-header">Il metodo</h3><p>Abbiamo preso 200 coppie immagine-testo da COCO val2017. Per ogni immagine, GPT-4o-mini ha generato una descrizione dettagliata. Poi abbiamo scritto 3 hard negatives per ogni immagine - descrizioni che differiscono da quella corretta solo per uno o due dettagli. Il modello deve trovare la giusta corrispondenza in un insieme di 200 immagini e 600 distrattori.</p>
<p>Un esempio dal set di dati:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_9_3965746e33.png" alt="Vintage brown leather suitcases with travel stickers including California and Cuba, placed on a metal luggage rack against a blue sky — used as a test image in the cross-modal retrieval benchmark" class="doc-image" id="vintage-brown-leather-suitcases-with-travel-stickers-including-california-and-cuba,-placed-on-a-metal-luggage-rack-against-a-blue-sky-—-used-as-a-test-image-in-the-cross-modal-retrieval-benchmark" />
   </span> <span class="img-wrapper"> <span>Valigie vintage in pelle marrone con adesivi di viaggio che includono California e Cuba, collocate su un portabagagli di metallo in un cielo blu - utilizzata come immagine di prova nel benchmark di recupero cross-modale.</span> </span></p>
<blockquote>
<p><strong>Descrizione corretta:</strong> "L'immagine presenta valigie vintage in pelle marrone con vari adesivi di viaggio, tra cui 'California', 'Cuba' e 'New York', collocate su un portabagagli di metallo contro un cielo azzurro".</p>
<p><strong>Negativo:</strong> Stessa frase, ma "California" diventa "Florida" e "cielo azzurro" diventa "cielo coperto". Il modello deve comprendere i dettagli dell'immagine per distinguerli.</p>
</blockquote>
<p><strong>Punteggio:</strong></p>
<ul>
<li>Generare <a href="https://zilliz.com/glossary/vector-embeddings">embeddings</a> per tutte le immagini e tutti i testi (200 descrizioni corrette + 600 negative).</li>
<li><strong>Testo-immagine (t2i):</strong> Ogni descrizione cerca in 200 immagini la corrispondenza più vicina. Si assegna un punto se il primo risultato è corretto.</li>
<li><strong>Immagine-testo (i2t):</strong> Ogni immagine cerca in tutti gli 800 testi la corrispondenza più vicina. Si ottiene un punto solo se il risultato principale è la descrizione corretta e non un risultato negativo.</li>
<li><strong>Punteggio finale:</strong> hard_avg_R@1 = (precisione t2i + precisione i2t) / 2</li>
</ul>
<h3 id="Results" class="common-anchor-header">Risultati</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_1_6f1fddae56.png" alt="Horizontal bar chart showing Cross-Modal Retrieval Ranking: Qwen3-VL-2B leads at 0.945, followed by Gemini Embed 2 at 0.928, Voyage MM-3.5 at 0.900, Jina CLIP v2 at 0.873, and CLIP ViT-L-14 at 0.768" class="doc-image" id="horizontal-bar-chart-showing-cross-modal-retrieval-ranking:-qwen3-vl-2b-leads-at-0.945,-followed-by-gemini-embed-2-at-0.928,-voyage-mm-3.5-at-0.900,-jina-clip-v2-at-0.873,-and-clip-vit-l-14-at-0.768" />
   <span>Grafico a barre orizzontali che mostra la classifica di recupero cross-modale: Qwen3-VL-2B è in testa con 0,945, seguito da Gemini Embed 2 con 0,928, Voyage MM-3.5 con 0,900, Jina CLIP v2 con 0,873 e CLIP ViT-L-14 con 0,768</span> </span>.</p>
<p>Qwen3-VL-2B, un modello di parametri 2B open-source del team Qwen di Alibaba, si è piazzato al primo posto, davanti a tutte le API closed-source.</p>
<p><strong>Il divario di modalità</strong> spiega la maggior parte della differenza. I modelli di embedding mappano testo e immagini nello stesso spazio vettoriale, ma in pratica le due modalità tendono a raggrupparsi in regioni diverse. Il modality gap misura la distanza L2 tra questi due cluster. Un gap minore significa una maggiore facilità di recupero cross-modale.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_8_c5067a3434.png" alt="Visualization comparing large modality gap (0.73, text and image embedding clusters far apart) versus small modality gap (0.25, clusters overlapping) — smaller gap makes cross-modal matching easier" class="doc-image" id="visualization-comparing-large-modality-gap-(0.73,-text-and-image-embedding-clusters-far-apart)-versus-small-modality-gap-(0.25,-clusters-overlapping)-—-smaller-gap-makes-cross-modal-matching-easier" />
   </span> <span class="img-wrapper"> <span>Visualizzazione di un confronto tra un grande divario di modalità (0,73, cluster di testo e immagine distanti tra loro) e un piccolo divario di modalità (0,25, cluster sovrapposti): un divario minore facilita la corrispondenza intermodale.</span> </span></p>
<table>
<thead>
<tr><th>Modello</th><th>Punteggio (R@1)</th><th>Gap di modalità</th><th>Parametri</th></tr>
</thead>
<tbody>
<tr><td>Qwen3-VL-2B</td><td>0.945</td><td>0.25</td><td>2B (open-source)</td></tr>
<tr><td>Incorporazione Gemini 2</td><td>0.928</td><td>0.73</td><td>Sconosciuto (chiuso)</td></tr>
<tr><td>Voyage Multimodal 3.5</td><td>0.900</td><td>0.59</td><td>Sconosciuto (chiuso)</td></tr>
<tr><td>Jina CLIP v2</td><td>0.873</td><td>0.87</td><td>~1B</td></tr>
<tr><td>CLIP ViT-L-14</td><td>0.768</td><td>0.83</td><td>428M</td></tr>
</tbody>
</table>
<p>Il modality gap di Qwen è di 0,25, circa un terzo dello 0,73 di Gemini. In un <a href="https://zilliz.com/learn/what-is-a-vector-database">database vettoriale</a> come <a href="https://milvus.io/">Milvus</a>, un piccolo divario di modalità significa che è possibile memorizzare le incorporazioni di testo e di immagine nella stessa <a href="https://milvus.io/docs/manage-collections.md">raccolta</a> e <a href="https://milvus.io/docs/single-vector-search.md">cercare</a> direttamente in entrambe. Un divario elevato può rendere meno affidabile <a href="https://zilliz.com/glossary/similarity-search">la ricerca di similarità</a> cross-modale e potrebbe essere necessario un passaggio di ri-classificazione per compensare.</p>
<h2 id="Cross-Lingual-Retrieval-Which-Models-Align-Meaning-Across-Languages" class="common-anchor-header">Recupero interlinguistico: Quali modelli allineano il significato tra le varie lingue?<button data-href="#Cross-Lingual-Retrieval-Which-Models-Align-Meaning-Across-Languages" class="anchor-icon" translate="no">
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
    </button></h2><p>Le basi di conoscenza multilingue sono comuni nella produzione. Un utente pone una domanda in cinese, ma la risposta si trova in un documento inglese, o viceversa. Il modello di incorporazione deve allineare il significato tra le varie lingue, non solo all'interno di una di esse.</p>
<h3 id="Method" class="common-anchor-header">Il metodo</h3><p>Abbiamo costruito 166 coppie di frasi parallele in cinese e in inglese su tre livelli di difficoltà:</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_6_75caab66a7.png" alt="Cross-lingual difficulty tiers: Easy tier maps literal translations like 我爱你 to I love you; Medium tier maps paraphrased sentences like 这道菜太咸了 to This dish is too salty with hard negatives; Hard tier maps Chinese idioms like 画蛇添足 to gilding the lily with semantically different hard negatives" class="doc-image" id="cross-lingual-difficulty-tiers:-easy-tier-maps-literal-translations-like-我爱你-to-i-love-you;-medium-tier-maps-paraphrased-sentences-like-这道菜太咸了-to-this-dish-is-too-salty-with-hard-negatives;-hard-tier-maps-chinese-idioms-like-画蛇添足-to-gilding-the-lily-with-semantically-different-hard-negatives" />
   <span>Livelli di difficoltà interlinguistici: Il livello facile mappa traduzioni letterali come 我爱你 a I love you; il livello medio mappa frasi parafrasate come 这道菜太咸了 a This dish is too salty con negativi duri; il livello duro mappa idiomi cinesi come 画蛇添足 a gilda con negativi duri semanticamente diversi.</span> </span></p>
<p>Ogni lingua riceve anche 152 distrattori negativi duri.</p>
<p><strong>Punteggio:</strong></p>
<ul>
<li>Generare embeddings per tutto il testo cinese (166 corretti + 152 distrattori) e per tutto il testo inglese (166 corretti + 152 distrattori).</li>
<li><strong>Cinese → Inglese:</strong> Ogni frase cinese cerca la sua traduzione corretta in 318 testi inglesi.</li>
<li><strong>Inglese → Cinese:</strong> Stessa cosa al contrario.</li>
<li><strong>Punteggio finale:</strong> hard_avg_R@1 = (accuratezza zh→en + accuratezza en→zh) / 2</li>
</ul>
<h3 id="Results" class="common-anchor-header">Risultati</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_2_d1c3500423.png" alt="Horizontal bar chart showing Cross-Lingual Retrieval Ranking: Gemini Embed 2 leads at 0.997, followed by Qwen3-VL-2B at 0.988, Jina v4 at 0.985, Voyage MM-3.5 at 0.982, down to mxbai at 0.120" class="doc-image" id="horizontal-bar-chart-showing-cross-lingual-retrieval-ranking:-gemini-embed-2-leads-at-0.997,-followed-by-qwen3-vl-2b-at-0.988,-jina-v4-at-0.985,-voyage-mm-3.5-at-0.982,-down-to-mxbai-at-0.120" />
   <span>Grafico a barre orizzontali che mostra la classifica di recupero cross-lingue: Gemini Embed 2 è in testa con 0,997, seguito da Qwen3-VL-2B a 0,988, Jina v4 a 0,985, Voyage MM-3.5 a 0,982, fino a mxbai a 0,120</span> </span>.</p>
<p>Gemini Embedding 2 ha ottenuto un punteggio di 0,997, il più alto di tutti i modelli testati. È stato l'unico modello a ottenere un punteggio perfetto di 1,000 nel livello Hard, dove coppie come "画蛇添足" → "gildare il giglio" richiedono una vera comprensione <a href="https://zilliz.com/glossary/semantic-search">semantica</a> tra le lingue, non una corrispondenza di modelli.</p>
<table>
<thead>
<tr><th>Modello</th><th>Punteggio (R@1)</th><th>Facile</th><th>Medio</th><th>Difficile (idiomi)</th></tr>
</thead>
<tbody>
<tr><td>Incorporazione Gemini 2</td><td>0.997</td><td>1.000</td><td>1.000</td><td>1.000</td></tr>
<tr><td>Qwen3-VL-2B</td><td>0.988</td><td>1.000</td><td>1.000</td><td>0.969</td></tr>
<tr><td>Jina Embeddings v4</td><td>0.985</td><td>1.000</td><td>1.000</td><td>0.969</td></tr>
<tr><td>Voyage Multimodal 3.5</td><td>0.982</td><td>1.000</td><td>1.000</td><td>0.938</td></tr>
<tr><td>OpenAI 3-grande</td><td>0.967</td><td>1.000</td><td>1.000</td><td>0.906</td></tr>
<tr><td>Cohere Embed v4</td><td>0.955</td><td>1.000</td><td>0.980</td><td>0.875</td></tr>
<tr><td>BGE-M3 (568M)</td><td>0.940</td><td>1.000</td><td>0.960</td><td>0.844</td></tr>
<tr><td>testo incorporato nomico (137M)</td><td>0.154</td><td>0.300</td><td>0.120</td><td>0.031</td></tr>
<tr><td>mxbai-embed-grande (335M)</td><td>0.120</td><td>0.220</td><td>0.080</td><td>0.031</td></tr>
</tbody>
</table>
<p>I primi 7 modelli hanno tutti un punteggio complessivo di 0,93 - la vera differenziazione avviene nel livello Hard (idiomi cinesi). nomic-embed-text e mxbai-embed-large, entrambi modelli leggeri incentrati sull'inglese, ottengono un punteggio vicino allo zero nei compiti cross-lingue.</p>
<h2 id="Key-Information-Retrieval-Can-Models-Find-a-Needle-in-a-32K-Token-Document" class="common-anchor-header">Recupero di informazioni chiave: I modelli possono trovare un ago in un documento di 32K parole?<button data-href="#Key-Information-Retrieval-Can-Models-Find-a-Needle-in-a-32K-Token-Document" class="anchor-icon" translate="no">
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
    </button></h2><p>I sistemi RAG spesso elaborano documenti lunghi - contratti legali, documenti di ricerca, rapporti interni contenenti <a href="https://zilliz.com/learn/introduction-to-unstructured-data">dati non strutturati</a>. La domanda è se un modello di embedding può ancora trovare un fatto specifico sepolto in migliaia di caratteri di testo circostante.</p>
<h3 id="Method" class="common-anchor-header">Il metodo</h3><p>Abbiamo preso come pagliaio articoli di Wikipedia di lunghezza variabile (da 4K a 32K caratteri) e abbiamo inserito un singolo fatto inventato - l'ago - in diverse posizioni: inizio, 25%, 50%, 75% e fine. Il modello deve determinare, sulla base di una query embedding, quale versione del documento contiene l'ago.</p>
<p><strong>Esempio:</strong></p>
<ul>
<li><strong>Ago:</strong> "La Meridian Corporation ha registrato un fatturato trimestrale di 847,3 milioni di dollari nel terzo trimestre del 2025".</li>
<li><strong>Interrogazione:</strong> "Qual è stato il fatturato trimestrale della Meridian Corporation?".</li>
<li><strong>Covone:</strong> Un articolo di Wikipedia di 32.000 caratteri sulla fotosintesi, con l'ago nascosto da qualche parte.</li>
</ul>
<p><strong>Punteggio:</strong></p>
<ul>
<li>Generare embeddings per la query, il documento con l'ago e il documento senza.</li>
<li>Se la query è più simile al documento contenente l'ago, lo si considera un risultato positivo.</li>
<li>Accuratezza media per tutte le lunghezze dei documenti e le posizioni degli aghi.</li>
<li><strong>Metriche finali:</strong> overall_accuracy e degradation_rate (quanto cala l'accuratezza dal documento più corto a quello più lungo).</li>
</ul>
<h3 id="Results" class="common-anchor-header">Risultati</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_5_2bdc89516a.png" alt="Heatmap showing Needle-in-a-Haystack accuracy by document length: Gemini Embed 2 scores 1.000 across all lengths up to 32K; top 7 models score perfectly within their context windows; mxbai and nomic degrade sharply at 4K+" class="doc-image" id="heatmap-showing-needle-in-a-haystack-accuracy-by-document-length:-gemini-embed-2-scores-1.000-across-all-lengths-up-to-32k;-top-7-models-score-perfectly-within-their-context-windows;-mxbai-and-nomic-degrade-sharply-at-4k+" />
   <span>Mappa di calore che mostra l'accuratezza di Needle-in-a-Haystack in base alla lunghezza del documento: Gemini Embed 2 ottiene un punteggio di 1.000 in tutte le lunghezze fino a 32K; i primi 7 modelli ottengono un punteggio perfetto all'interno delle loro finestre di contesto; mxbai e nomic degradano bruscamente a 4K+</span> </span>.</p>
<p>Gemini Embedding 2 è l'unico modello testato sull'intera gamma 4K-32K e ha ottenuto un punteggio perfetto per ogni lunghezza. Nessun altro modello in questo test ha una finestra di contesto che raggiunge i 32K.</p>
<table>
<thead>
<tr><th>Modello</th><th>1K</th><th>4K</th><th>8K</th><th>16K</th><th>32K</th><th>Complessivamente</th><th>Degradazione</th></tr>
</thead>
<tbody>
<tr><td>Incorporazione Gemini 2</td><td>1.000</td><td>1.000</td><td>1.000</td><td>1.000</td><td>1.000</td><td>1.000</td><td>0%</td></tr>
<tr><td>OpenAI 3-grande</td><td>1.000</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>Jina Embeddings v4</td><td>1.000</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>Cohere Embed v4</td><td>1.000</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>Qwen3-VL-2B</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>Voyage Multimodale 3,5</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>Jina CLIP v2</td><td>1.000</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>BGE-M3 (568M)</td><td>1.000</td><td>1.000</td><td>0.920</td><td>—</td><td>-</td><td>0.973</td><td>8%</td></tr>
<tr><td>mxbai-embed-grande (335M)</td><td>0.980</td><td>0.600</td><td>0.400</td><td>-</td><td>-</td><td>0.660</td><td>58%</td></tr>
<tr><td>testo incorporato (137M)</td><td>1.000</td><td>0.460</td><td>0.440</td><td>-</td><td>-</td><td>0.633</td><td>56%</td></tr>
</tbody>
</table>
<p>"-" significa che la lunghezza del documento supera la finestra contestuale del modello.</p>
<p>I primi 7 modelli ottengono punteggi perfettamente all'interno delle loro finestre di contesto. BGE-M3 inizia a perdere terreno a 8K (0,920). I modelli leggeri (mxbai e nomic) scendono a 0,4-0,6 a soli 4K caratteri - circa 1.000 token. Per mxbai, questo calo riflette in parte la finestra contestuale di 512 token che tronca la maggior parte del documento.</p>
<h2 id="MRL-Dimension-Compression-How-Much-Quality-Do-You-Lose-at-256-Dimensions" class="common-anchor-header">Compressione della dimensione MRL: Quanta qualità si perde con 256 dimensioni?<button data-href="#MRL-Dimension-Compression-How-Much-Quality-Do-You-Lose-at-256-Dimensions" class="anchor-icon" translate="no">
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
    </button></h2><p>La<strong>Matryoshka Representation Learning (MRL)</strong> è una tecnica di addestramento che rende le prime N dimensioni di un vettore significative da sole. Prendiamo un vettore di 3072 dimensioni, lo tronchiamo a 256 e conserva ancora la maggior parte della sua qualità semantica. Un minor numero di dimensioni significa minori costi di archiviazione e di memoria nel <a href="https://zilliz.com/learn/what-is-a-vector-database">database vettoriale</a>: passare da 3072 a 256 dimensioni significa ridurre di 12 volte lo spazio di archiviazione.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_10_aef8755877.png" alt="Illustration showing MRL dimension truncation: 3072 dimensions at full quality, 1024 at 95%, 512 at 90%, 256 at 85% — with 12x storage savings at 256 dimensions" class="doc-image" id="illustration-showing-mrl-dimension-truncation:-3072-dimensions-at-full-quality,-1024-at-95%,-512-at-90%,-256-at-85%-—-with-12x-storage-savings-at-256-dimensions" />
   <span>Illustrazione che mostra il troncamento delle dimensioni di MRL: 3072 dimensioni a qualità piena, 1024 al 95%, 512 al 90%, 256 all'85% - con un risparmio di memoria di 12 volte a 256 dimensioni.</span> </span></p>
<h3 id="Method" class="common-anchor-header">Metodo</h3><p>Abbiamo utilizzato 150 coppie di frasi del benchmark STS-B, ciascuna con un punteggio di somiglianza annotato dall'uomo (0-5). Per ogni modello, abbiamo generato embeddings a dimensioni piene, poi troncate a 1024, 512 e 256.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_4_44266e5456.png" alt="STS-B data examples showing sentence pairs with human similarity scores: A girl is styling her hair vs A girl is brushing her hair scores 2.5; A group of men play soccer on the beach vs A group of boys are playing soccer on the beach scores 3.6" class="doc-image" id="sts-b-data-examples-showing-sentence-pairs-with-human-similarity-scores:-a-girl-is-styling-her-hair-vs-a-girl-is-brushing-her-hair-scores-2.5;-a-group-of-men-play-soccer-on-the-beach-vs-a-group-of-boys-are-playing-soccer-on-the-beach-scores-3.6" />
   <span>Esempi di dati STS-B che mostrano coppie di frasi con punteggi di somiglianza umani: Una ragazza si sta acconciando i capelli vs Una ragazza si sta spazzolando i capelli ha un punteggio di 2,5; Un gruppo di uomini gioca a calcio sulla spiaggia vs Un gruppo di ragazzi sta giocando a calcio sulla spiaggia ha un punteggio di 3,6</span> </span>.</p>
<p><strong>Punteggio:</strong></p>
<ul>
<li>A ogni livello di dimensione, calcolare la <a href="https://zilliz.com/glossary/cosine-similarity">somiglianza del coseno</a> tra le incorporazioni di ogni coppia di frasi.</li>
<li>Confrontare la classifica di somiglianza del modello con quella umana utilizzando il <strong>ρ di Spearman</strong> (correlazione di rango).</li>
</ul>
<blockquote>
<p><strong>Che cos'è il ρ di Spearman?</strong> Misura il grado di concordanza tra due classifiche. Se gli esseri umani classificano la coppia A come la più simile, B come la seconda, C come la meno simile, e le somiglianze del coseno del modello producono lo stesso ordine A &gt; B &gt; C, allora ρ si avvicina a 1,0. Un ρ pari a 1,0 significa un accordo perfetto. Un ρ pari a 0 significa assenza di correlazione.</p>
</blockquote>
<p><strong>Metriche finali:</strong> spearman_rho (più alto è meglio) e min_viable_dim (la dimensione più piccola in cui la qualità rimane entro il 5% delle prestazioni della dimensione completa).</p>
<h3 id="Results" class="common-anchor-header">Risultati</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_3_7192725ed6.png" alt="Dot plot showing MRL Full Dimension vs 256 Dimension Quality: Voyage MM-3.5 leads with +0.6% change, Jina v4 +0.5%, while Gemini Embed 2 shows -0.6% at the bottom" class="doc-image" id="dot-plot-showing-mrl-full-dimension-vs-256-dimension-quality:-voyage-mm-3.5-leads-with-+0.6%-change,-jina-v4-+0.5%,-while-gemini-embed-2-shows--0.6%-at-the-bottom" />
   <span>Grafico a punti che mostra MRL Full Dimension vs 256 Dimension Quality: Voyage MM-3.5 è in testa con una variazione di +0,6%, Jina v4 +0,5%, mentre Gemini Embed 2 mostra un -0,6% nella parte inferiore</span> </span>.</p>
<p>Se si intende ridurre i costi di archiviazione in <a href="https://milvus.io/">Milvus</a> o in un altro database vettoriale troncando le dimensioni, questo risultato è importante.</p>
<table>
<thead>
<tr><th>Modello</th><th>ρ (dimensione piena)</th><th>ρ (256 dimensioni)</th><th>Decadimento</th></tr>
</thead>
<tbody>
<tr><td>Voyage Multimodal 3,5</td><td>0.880</td><td>0.874</td><td>0.7%</td></tr>
<tr><td>Jina Embeddings v4</td><td>0.833</td><td>0.828</td><td>0.6%</td></tr>
<tr><td>mxbai-embed-large (335M)</td><td>0.815</td><td>0.795</td><td>2.5%</td></tr>
<tr><td>nomic-embed-testo (137M)</td><td>0.781</td><td>0.774</td><td>0.8%</td></tr>
<tr><td>OpenAI 3-grande</td><td>0.767</td><td>0.762</td><td>0.6%</td></tr>
<tr><td>Gemini Embedding 2</td><td>0.683</td><td>0.689</td><td>-0.8%</td></tr>
</tbody>
</table>
<p>Voyage e Jina v4 sono in testa perché entrambi sono stati addestrati esplicitamente con MRL come obiettivo. La compressione delle dimensioni ha poco a che fare con le dimensioni del modello: ciò che conta è che il modello sia stato addestrato per questo.</p>
<p>Una nota sul punteggio di Gemini: la classifica MRL riflette la capacità di un modello di preservare la qualità dopo il troncamento, non la qualità del suo recupero a dimensione piena. Il reperimento di Gemini in tutte le dimensioni è forte - i risultati linguistici e delle informazioni chiave lo hanno già dimostrato. Solo che non è stato ottimizzato per la riduzione. Se non avete bisogno di una compressione delle dimensioni, questo parametro non fa al caso vostro.</p>
<h2 id="Which-Embedding-Model-Should-You-Use" class="common-anchor-header">Quale modello di incorporamento utilizzare?<button data-href="#Which-Embedding-Model-Should-You-Use" class="anchor-icon" translate="no">
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
    </button></h2><p>Nessun modello vince su tutto. Ecco la classifica completa:</p>
<table>
<thead>
<tr><th>Modello</th><th>Pareri</th><th>Intermodale</th><th>Interlingua</th><th>Informazioni chiave</th><th>MRL ρ</th></tr>
</thead>
<tbody>
<tr><td>Incorporamento Gemini 2</td><td>Non divulgato</td><td>0.928</td><td>0.997</td><td>1.000</td><td>0.668</td></tr>
<tr><td>Voyage Multimodale 3,5</td><td>Non divulgato</td><td>0.900</td><td>0.982</td><td>1.000</td><td>0.880</td></tr>
<tr><td>Jina Embeddings v4</td><td>3.8B</td><td>-</td><td>0.985</td><td>1.000</td><td>0.833</td></tr>
<tr><td>Qwen3-VL-2B</td><td>2B</td><td>0.945</td><td>0.988</td><td>1.000</td><td>0.774</td></tr>
<tr><td>OpenAI 3-grande</td><td>Non divulgato</td><td>-</td><td>0.967</td><td>1.000</td><td>0.760</td></tr>
<tr><td>Cohere Embed v4</td><td>Non divulgato</td><td>-</td><td>0.955</td><td>1.000</td><td>-</td></tr>
<tr><td>Jina CLIP v2</td><td>~1B</td><td>0.873</td><td>0.934</td><td>1.000</td><td>-</td></tr>
<tr><td>BGE-M3</td><td>568M</td><td>-</td><td>0.940</td><td>0.973</td><td>0.744</td></tr>
<tr><td>mxbai-embed-grande</td><td>335M</td><td>-</td><td>0.120</td><td>0.660</td><td>0.815</td></tr>
<tr><td>testo incorporato nomico</td><td>137M</td><td>-</td><td>0.154</td><td>0.633</td><td>0.780</td></tr>
<tr><td>CLIP ViT-L-14</td><td>428M</td><td>0.768</td><td>0.030</td><td>-</td><td>-</td></tr>
</tbody>
</table>
<p>"-" significa che il modello non supporta quella modalità o capacità. CLIP è una base di riferimento per il 2021.</p>
<p>Ecco cosa emerge:</p>
<ul>
<li><strong>Modale trasversale:</strong> Qwen3-VL-2B (0,945) primo, Gemini (0,928) secondo, Voyage (0,900) terzo. Un modello 2B open-source ha battuto ogni API closed-source. Il fattore decisivo è stato il divario tra le modalità, non il numero di parametri.</li>
<li><strong>Cross-lingual:</strong> Gemini (0,997) è in testa - l'unico modello a ottenere un punteggio perfetto sull'allineamento a livello di idioma. I primi 8 modelli hanno tutti un punteggio di 0,93. I modelli leggeri solo in inglese ottengono un punteggio vicino allo zero.</li>
<li><strong>Informazioni chiave:</strong> I modelli API e open-source di grandi dimensioni ottengono un punteggio perfetto fino a 8K. I modelli sotto i 335M iniziano a degradare a 4K. Gemini è l'unico modello che gestisce 32K con un punteggio perfetto.</li>
<li><strong>Compressione delle dimensioni MRL:</strong> Voyage (0,880) e Jina v4 (0,833) sono in testa, perdendo meno dell'1% a 256 dimensioni. Gemini (0,668) arriva ultimo - forte a dimensione piena, non ottimizzato per il troncamento.</li>
</ul>
<h3 id="How-to-Pick-A-Decision-Flowchart" class="common-anchor-header">Come scegliere: un diagramma di flusso decisionale</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_7_b2bd48bdcc.png" alt="Embedding model selection flowchart: Start → Need images or video? → Yes: Need to self-host? → Yes: Qwen3-VL-2B, No: Gemini Embedding 2. No images → Need to save storage? → Yes: Jina v4 or Voyage, No: Need multilingual? → Yes: Gemini Embedding 2, No: OpenAI 3-large" class="doc-image" id="embedding-model-selection-flowchart:-start-→-need-images-or-video?-→-yes:-need-to-self-host?-→-yes:-qwen3-vl-2b,-no:-gemini-embedding-2.-no-images-→-need-to-save-storage?-→-yes:-jina-v4-or-voyage,-no:-need-multilingual?-→-yes:-gemini-embedding-2,-no:-openai-3-large" />
   <span>Diagramma di flusso per la selezione del modello di embedding: Inizio → Avete bisogno di immagini o video? → Sì: è necessario un self-hosting? → Sì: Qwen3-VL-2B, no: Gemini Embedding 2. Nessuna immagine → Necessità di risparmiare spazio di archiviazione? → Sì: Jina v4 o Voyage, No: Serve il multilingua? → Sì: Gemini Embedding 2, No: OpenAI 3-large</span> </span></p>
<h3 id="The-Best-All-Rounder-Gemini-Embedding-2" class="common-anchor-header">Il migliore tuttofare: Gemini Embedding 2</h3><p>Nel complesso, Gemini Embedding 2 è il modello più forte in questo benchmark.</p>
<p><strong>Punti di forza:</strong> Primo in cross-lingue (0,997) e nel recupero di informazioni chiave (1,000 su tutte le lunghezze fino a 32K). Secondo in cross-modale (0,928). Copertura della modalità più ampia: cinque modalità (testo, immagine, video, audio, PDF), mentre la maggior parte dei modelli si ferma a tre.</p>
<p><strong>Punti deboli:</strong> Ultimo nella compressione MRL (ρ = 0,668). Battuto nel cross-modal dal modello open-source Qwen3-VL-2B.</p>
<p>Se non si ha bisogno di compressione dimensionale, Gemini non ha un vero concorrente per quanto riguarda la combinazione cross-lingual + long-document retrieval. Ma per la precisione cross-modale o l'ottimizzazione dello storage, i modelli specializzati fanno meglio.</p>
<h2 id="Limitations" class="common-anchor-header">Limitazioni<button data-href="#Limitations" class="anchor-icon" translate="no">
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
<li>Non abbiamo incluso tutti i modelli che valevano la pena di prendere in considerazione: NV-Embed-v2 di NVIDIA e v5-text di Jina erano nell'elenco, ma non sono stati presi in considerazione.</li>
<li>Ci siamo concentrati sulle modalità di testo e immagine; video, audio e PDF embedding (nonostante alcuni modelli dichiarino di supportarli) non sono stati presi in considerazione.</li>
<li>Il reperimento del codice e altri scenari specifici del dominio sono stati esclusi.</li>
<li>Le dimensioni del campione erano relativamente piccole, quindi le differenze di classifica tra i modelli possono rientrare nel rumore statistico.</li>
</ul>
<p>I risultati di questo articolo saranno obsoleti entro un anno. I nuovi modelli vengono lanciati continuamente e la classifica si rimescola a ogni rilascio. L'investimento più duraturo consiste nel costruire la propria pipeline di valutazione: definire i tipi di dati, i modelli di query, le lunghezze dei documenti e sottoporre i nuovi modelli ai propri test quando vengono rilasciati. I benchmark pubblici come MTEB, MMTEB e MMEB meritano di essere monitorati, ma la decisione finale dovrebbe sempre venire dai vostri dati.</p>
<p><a href="https://github.com/zc277584121/mm-embedding-bench">Il nostro codice di benchmark è open-source su GitHub</a>: modificatelo e adattatelo al vostro caso d'uso.</p>
<hr>
<p>Una volta scelto il modello di incorporazione, è necessario un luogo in cui memorizzare e cercare i vettori su scala. <a href="https://milvus.io/">Milvus</a> è il database vettoriale open-source più diffuso al mondo, con <a href="https://github.com/milvus-io/milvus">oltre 43.000 stelle su GitHub</a>, costruito proprio per questo: supporta le dimensioni troncate da MRL, le collezioni multimodali miste, la ricerca ibrida che combina vettori densi e radi e <a href="https://milvus.io/docs/architecture_overview.md">va da un laptop a miliardi di vettori</a>.</p>
<ul>
<li>Iniziate con la <a href="https://milvus.io/docs/quickstart.md">guida Milvus Quickstart</a> o installate con <code translate="no">pip install pymilvus</code>.</li>
<li>Unitevi a <a href="https://milvusio.slack.com/">Milvus Slack</a> o <a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord</a> per porre domande sull'integrazione dei modelli di embedding, sulle strategie di indicizzazione vettoriale o sulla scalabilità della produzione.</li>
<li><a href="https://milvus.io/office-hours">Prenotate una sessione gratuita di Milvus Office Hours</a> per esaminare la vostra architettura RAG: possiamo aiutarvi con la selezione dei modelli, la progettazione degli schemi di raccolta e la messa a punto delle prestazioni.</li>
<li>Se preferite evitare il lavoro di infrastruttura, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (gestito da Milvus) offre un livello gratuito per iniziare.</li>
</ul>
<hr>
<p>Alcune domande che sorgono quando gli ingegneri scelgono un modello di incorporazione per la produzione di RAG:</p>
<p><strong>D: Devo usare un modello di incorporazione multimodale anche se al momento ho solo dati di testo?</strong></p>
<p>Dipende dalla vostra roadmap. Se è probabile che la vostra pipeline aggiunga immagini, PDF o altre modalità nei prossimi 6-12 mesi, iniziare con un modello multimodale come Gemini Embedding 2 o Voyage Multimodal 3.5 evita una migrazione dolorosa in un secondo momento: non sarà necessario incorporare nuovamente l'intero set di dati. Se siete sicuri che il futuro sarà solo testuale, un modello focalizzato sul testo come OpenAI 3-large o Cohere Embed v4 vi offrirà un miglior rapporto prezzo/prestazioni.</p>
<p><strong>D: Quanto spazio di archiviazione risparmia la compressione dimensionale MRL in un database vettoriale?</strong></p>
<p>Passare da 3072 a 256 dimensioni significa ridurre di 12 volte lo spazio di archiviazione per vettore. Per una collezione <a href="https://milvus.io/">Milvus</a> con 100 milioni di vettori a float32, si tratta di circa 1,14 TB → 95 GB. Il punto è che non tutti i modelli gestiscono bene il troncamento: Voyage Multimodal 3.5 e Jina Embeddings v4 perdono meno dell'1% di qualità a 256 dimensioni, mentre altri si degradano notevolmente.</p>
<p><strong>D: Qwen3-VL-2B è davvero migliore di Gemini Embedding 2 per la ricerca cross-modale?</strong></p>
<p>Nel nostro benchmark, sì: Qwen3-VL-2B ha ottenuto un punteggio di 0,945 contro lo 0,928 di Gemini nella ricerca cross-modale con distrattori quasi identici. La ragione principale è il divario modale molto più ridotto di Qwen (0,25 contro 0,73), il che significa che <a href="https://zilliz.com/glossary/vector-embeddings">le incorporazioni di</a> testo e immagine si raggruppano più vicine nello spazio vettoriale. Detto questo, Gemini copre cinque modalità mentre Qwen ne copre tre, quindi se avete bisogno di incorporazioni audio o PDF, Gemini è l'unica opzione.</p>
<p><strong>D: Posso usare questi modelli di incorporamento direttamente con Milvus?</strong></p>
<p>Si. Tutti questi modelli producono vettori float standard, che possono essere <a href="https://milvus.io/docs/insert-update-delete.md">inseriti in Milvus</a> e ricercati con la <a href="https://zilliz.com/glossary/cosine-similarity">similarità del coseno</a>, la distanza L2 o il prodotto interno. <a href="https://milvus.io/docs/install-pymilvus.md">PyMilvus</a> funziona con qualsiasi modello di incorporamento: generate i vostri vettori con l'SDK del modello, quindi memorizzateli e cercateli in Milvus. Per i vettori MRL troncati, è sufficiente impostare la dimensione della collezione al valore desiderato (ad esempio, 256) al momento della <a href="https://milvus.io/docs/manage-collections.md">creazione della collezione</a>.</p>
