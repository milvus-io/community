---
id: molecular-structure-similarity-with-milvus.md
title: Introduzione
author: Shiyu Chen
date: 2020-02-06T19:08:18.815Z
desc: Come eseguire l'analisi di similarità della struttura molecolare in Milvus
cover: assets.zilliz.com/header_44d6b6aacd.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/molecular-structure-similarity-with-milvus'
---
<custom-h1>Accelerare la scoperta di nuovi farmaci</custom-h1><h2 id="Introduction" class="common-anchor-header">Introduzione<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>La scoperta di farmaci, in quanto fonte di innovazione medica, è una parte importante della ricerca e dello sviluppo di nuovi farmaci. La scoperta dei farmaci avviene attraverso la selezione e la conferma dei bersagli. Quando vengono scoperti frammenti o composti guida, i composti simili vengono solitamente ricercati in biblioteche di composti interne o commerciali per scoprire la relazione struttura-attività (SAR), la disponibilità dei composti, valutando così il potenziale dei composti guida da ottimizzare in composti candidati.</p>
<p>Per scoprire i composti disponibili nello spazio dei frammenti da librerie di composti su scala miliardaria, l'impronta digitale chimica viene solitamente recuperata per la ricerca di sottostrutture e la ricerca di similarità. Tuttavia, la soluzione tradizionale richiede molto tempo ed è soggetta a errori quando si tratta di impronte chimiche ad alta dimensionalità su scala miliardaria. Inoltre, alcuni composti potenziali possono andare persi nel processo. In questo articolo si parla dell'utilizzo di Milvus, un motore di ricerca di similarità per vettori su scala massiva, con RDKit per costruire un sistema di ricerca di similarità della struttura chimica ad alte prestazioni.</p>
<p>Rispetto ai metodi tradizionali, Milvus ha una velocità di ricerca maggiore e una copertura più ampia. Elaborando le impronte digitali chimiche, Milvus è in grado di eseguire la ricerca di sottostrutture, la ricerca di similarità e la ricerca esatta nelle librerie di strutture chimiche per scoprire farmaci potenzialmente disponibili.</p>
<h2 id="System-overview" class="common-anchor-header">Panoramica del sistema<button data-href="#System-overview" class="anchor-icon" translate="no">
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
    </button></h2><p>Il sistema utilizza RDKit per generare le impronte chimiche e Milvus per eseguire la ricerca di similarità delle strutture chimiche. Per saperne di più sul sistema, consultare il sito https://github.com/milvus-io/bootcamp/tree/master/solutions/molecular_similarity_search.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_system_overview_4b7c2de377.png" alt="1-system-overview.png" class="doc-image" id="1-system-overview.png" />
   </span> <span class="img-wrapper"> <span>1-sistema-overview.png</span> </span></p>
<h2 id="1-Generating-chemical-fingerprints" class="common-anchor-header">1. Generazione delle impronte digitali chimiche<button data-href="#1-Generating-chemical-fingerprints" class="anchor-icon" translate="no">
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
    </button></h2><p>Le impronte digitali chimiche sono solitamente utilizzate per la ricerca di sottostrutture e per la ricerca di similarità. L'immagine seguente mostra un elenco sequenziale rappresentato da bit. Ogni cifra rappresenta un elemento, una coppia di atomi o un gruppo funzionale. La struttura chimica è <code translate="no">C1C(=O)NCO1</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_identifying_patterns_molecules_2aeef349c8.png" alt="2-identifying-patterns-molecules.png" class="doc-image" id="2-identifying-patterns-molecules.png" />
   </span> <span class="img-wrapper"> <span>2-identificare-modelli-molecole.png</span> </span></p>
<p>Possiamo usare RDKit per generare le impronte digitali di Morgan, che definisce un raggio da un atomo specifico e calcola il numero di strutture chimiche nell'intervallo del raggio per generare un'impronta chimica. Specificare valori diversi per il raggio e i bit per acquisire le impronte chimiche di diverse strutture chimiche. Le strutture chimiche sono rappresentate in formato SMILES.</p>
<pre><code translate="no">from rdkit import Chem
mols = Chem.MolFromSmiles(smiles)
mbfp = AllChem.GetMorganFingerprintAsBitVect(mols, radius=2, bits=512)
mvec = DataStructs.BitVectToFPSText(mbfp)
</code></pre>
<h2 id="2-Searching-chemical-structures" class="common-anchor-header">2. Ricerca delle strutture chimiche<button data-href="#2-Searching-chemical-structures" class="anchor-icon" translate="no">
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
    </button></h2><p>Possiamo quindi importare le impronte digitali di Morgan in Milvus per costruire un database di strutture chimiche. Con le diverse impronte chimiche, Milvus può eseguire la ricerca per sottostruttura, la ricerca per similarità e la ricerca esatta.</p>
<pre><code translate="no">from milvus import Milvus
Milvus.add_vectors(table_name=MILVUS_TABLE, records=mvecs)
Milvus.search_vectors(table_name=MILVUS_TABLE, query_records=query_mvec, top_k=topk)
</code></pre>
<h3 id="Substructure-search" class="common-anchor-header">Ricerca per sottostruttura</h3><p>Verifica se una struttura chimica contiene un'altra struttura chimica.</p>
<h3 id="Similarity-search" class="common-anchor-header">Ricerca per somiglianza</h3><p>Cerca strutture chimiche simili. Per impostazione predefinita, viene utilizzata la distanza di Tanimoto come metrica.</p>
<h3 id="Exact-search" class="common-anchor-header">Ricerca esatta</h3><p>Verifica l'esistenza di una struttura chimica specificata. Questo tipo di ricerca richiede una corrispondenza esatta.</p>
<h2 id="Computing-chemical-fingerprints" class="common-anchor-header">Calcolo delle impronte chimiche<button data-href="#Computing-chemical-fingerprints" class="anchor-icon" translate="no">
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
    </button></h2><p>La distanza di Tanimoto è spesso utilizzata come metrica per le impronte chimiche. In Milvus, la distanza di Jaccard corrisponde alla distanza di Tanimoto.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_computing_chem_fingerprings_table_1_3814744fce.png" alt="3-computing-chem-fingerprings-table-1.png" class="doc-image" id="3-computing-chem-fingerprings-table-1.png" />
   </span> <span class="img-wrapper"> <span>3-computing-chem-fingerprings-table-1.png</span> </span></p>
<p>Sulla base dei parametri precedenti, il calcolo delle impronte chimiche può essere descritto come segue:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_computing_chem_fingerprings_table_2_7d16075836.png" alt="4-computing-chem-fingerprings-table-2.png" class="doc-image" id="4-computing-chem-fingerprings-table-2.png" />
   </span> <span class="img-wrapper"> <span>4-computing-chem-fingerprings-table-2.png</span> </span></p>
<p>Possiamo vedere che <code translate="no">1- Jaccard = Tanimoto</code>. Qui utilizziamo Jaccard in Milvus per calcolare l'impronta chimica, che in realtà è coerente con la distanza di Tanimoto.</p>
<h2 id="System-demo" class="common-anchor-header">Dimostrazione del sistema<button data-href="#System-demo" class="anchor-icon" translate="no">
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
    </button></h2><p>Per dimostrare meglio il funzionamento del sistema, abbiamo realizzato una demo che utilizza Milvus per cercare più di 90 milioni di impronte chimiche. I dati utilizzati provengono da ftp://ftp.ncbi.nlm.nih.gov/pubchem/Compound/CURRENT-Full/SDF. L'interfaccia iniziale si presenta come segue:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_system_demo_1_46c6e6cd96.jpg" alt="5-system-demo-1.jpg" class="doc-image" id="5-system-demo-1.jpg" />
   </span> <span class="img-wrapper"> <span>5-sistema-demo-1.jpg</span> </span></p>
<p>È possibile cercare strutture chimiche specificate nel sistema e restituire strutture chimiche simili:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_system_demo_2_19d6cd8f92.gif" alt="6-system-demo-2.gif" class="doc-image" id="6-system-demo-2.gif" />
   </span> <span class="img-wrapper"> <span>6-sistema-demo-2.gif</span> </span></p>
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
    </button></h2><p>La ricerca per similarità è indispensabile in diversi campi, come le immagini e i video. Per la scoperta di farmaci, la ricerca per similarità può essere applicata ai database delle strutture chimiche per scoprire composti potenzialmente disponibili, che vengono poi convertiti in semi per la sintesi pratica e i test point-of-care. Milvus, come motore di ricerca di similarità open-source per vettori di caratteristiche su scala massiccia, è costruito con un'architettura di calcolo eterogenea per la migliore efficienza dei costi. Le ricerche su vettori di dimensioni miliardarie richiedono solo millisecondi con risorse di calcolo minime. Milvus può quindi contribuire a implementare una ricerca accurata e veloce di strutture chimiche in campi come la biologia e la chimica.</p>
<p>È possibile accedere alla demo visitando il sito http://40.117.75.127:8002/, e non dimenticate di visitare anche il nostro sito GitHub https://github.com/milvus-io/milvus per saperne di più!</p>
