---
id: milmil-a-milvus-powered-faq-chatbot-that-answers-questions-about-milvus.md
title: MilMil Un chatbot FAQ alimentato da Milvus che risponde alle domande su Milvus
author: milvus
date: 2021-07-20T07:21:43.897Z
desc: >-
  Utilizzare strumenti di ricerca vettoriale open-source per costruire un
  servizio di risposta alle domande.
cover: assets.zilliz.com/milmil_4600f33f1c.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/milmil-a-milvus-powered-faq-chatbot-that-answers-questions-about-milvus
---
<custom-h1>MilMil: Un chatbot FAQ alimentato da Milvus che risponde alle domande su Milvus</custom-h1><p>La comunità open-source ha recentemente creato MilMil, un chatbot per le domande frequenti su Milvus costruito da e per gli utenti di Milvus. MilMil è disponibile 24 ore su 24, 7 giorni su 7, su <a href="https://milvus.io/">Milvus.io</a>, per rispondere alle domande più comuni su Milvus, il database vettoriale open-source più avanzato al mondo.</p>
<p>Questo sistema di risposta alle domande non solo aiuta a risolvere più rapidamente i problemi comuni che gli utenti di Milvus incontrano, ma identifica anche nuovi problemi basandosi sulle segnalazioni degli utenti. Il database di MilMil comprende le domande che gli utenti hanno posto da quando il progetto è stato rilasciato sotto licenza open-source nel 2019. Le domande sono archiviate in due raccolte, una per Milvus 1.x e precedenti e un'altra per Milvus 2.0.</p>
<p>MilMil è attualmente disponibile solo in inglese.</p>
<h2 id="How-does-MilMil-work" class="common-anchor-header">Come funziona MilMil?<button data-href="#How-does-MilMil-work" class="anchor-icon" translate="no">
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
    </button></h2><p>MilMil si basa sul modello <em>sentence-transformers/paraphrase-mpnet-base-v2</em> per ottenere rappresentazioni vettoriali del database delle FAQ, quindi Milvus viene utilizzato per il recupero della similarità vettoriale per restituire domande semanticamente simili.</p>
<p>Innanzitutto, i dati delle FAQ vengono convertiti in vettori semantici utilizzando BERT, un modello di elaborazione del linguaggio naturale (NLP). Le incorporazioni vengono poi inserite in Milvus e a ciascuna di esse viene assegnato un ID univoco. Infine, le domande e le risposte vengono inserite in PostgreSQL, un database relazionale, insieme ai loro ID vettoriali.</p>
<p>Quando gli utenti inviano una domanda, il sistema la converte in un vettore di caratteristiche utilizzando BERT. Poi cerca in Milvus i cinque vettori più simili al vettore della domanda e ne recupera gli ID. Infine, le domande e le risposte che corrispondono agli ID dei vettori recuperati vengono restituite all'utente.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/system_process_dca67a80a6.png" alt="system-process.png" class="doc-image" id="system-process.png" />
   </span> <span class="img-wrapper"> <span>sistema-processo.png</span> </span></p>
<p>Il progetto del <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/question_answering_system">sistema di risposta alle domande</a> nel bootcamp di Milvus consente di esplorare il codice utilizzato per costruire chatbot AI.</p>
<h2 id="Ask-MilMil-about-Milvus" class="common-anchor-header">Chiedete a MilMil di Milvus<button data-href="#Ask-MilMil-about-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Per chattare con MilMil, visitate una qualsiasi pagina di <a href="https://milvus.io/">Milvus.io</a> e fate clic sull'icona dell'uccellino nell'angolo in basso a destra. Digitate la vostra domanda nella casella di testo e premete invio. MilMil vi risponderà in pochi millisecondi! Inoltre, l'elenco a discesa nell'angolo superiore sinistro può essere utilizzato per passare dalla documentazione tecnica alle diverse versioni di Milvus.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_chatbot_icon_f3c25708ca.png" alt="milvus-chatbot-icon.png" class="doc-image" id="milvus-chatbot-icon.png" />
   </span> <span class="img-wrapper"> <span>milvus-chatbot-icon.png</span> </span></p>
<p>Dopo aver inviato una domanda, il bot restituisce immediatamente tre domande semanticamente simili a quella richiesta. È possibile fare clic su "Vedi risposta" per sfogliare le potenziali risposte alla domanda, oppure su "Vedi altro" per visualizzare altre domande correlate alla ricerca. Se non è disponibile una risposta adeguata, fare clic su "Inserisci qui il tuo feedback" per porre la domanda insieme a un indirizzo e-mail. L'aiuto della comunità Milvus arriverà a breve!</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/chatbot_UI_0f4a7655d4.png" alt="chatbot_UI.png" class="doc-image" id="chatbot_ui.png" />
   </span> <span class="img-wrapper"> <span>chatbot_UI.png</span> </span></p>
<p>Provate MilMil e fateci sapere cosa ne pensate. Tutte le domande, i commenti o qualsiasi forma di feedback sono benvenuti.</p>
<h2 id="Dont-be-a-stranger" class="common-anchor-header">Non essere un estraneo<button data-href="#Dont-be-a-stranger" class="anchor-icon" translate="no">
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
<li>Trovate o contribuite a Milvus su <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>Interagite con la comunità via <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Collegatevi con noi su <a href="https://twitter.com/milvusio">Twitter</a>.</li>
</ul>
