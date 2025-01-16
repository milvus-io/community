---
id: milmil-a-milvus-powered-faq-chatbot-that-answers-questions-about-milvus.md
title: >-
  MilMil Ein von Milvus betriebener FAQ-Chatbot, der Fragen über Milvus
  beantwortet
author: milvus
date: 2021-07-20T07:21:43.897Z
desc: >-
  Verwendung von Open-Source-Vektorsuchwerkzeugen zum Aufbau eines
  Fragebeantwortungsdienstes.
cover: assets.zilliz.com/milmil_4600f33f1c.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/milmil-a-milvus-powered-faq-chatbot-that-answers-questions-about-milvus
---
<custom-h1>MilMil: Ein von Milvus betriebener FAQ-Chatbot, der Fragen über Milvus beantwortet</custom-h1><p>Die Open-Source-Community hat vor kurzem MilMil ins Leben gerufen - einen Milvus-FAQ-Chatbot, der von und für Milvus-Nutzer entwickelt wurde. MilMil ist rund um die Uhr unter <a href="https://milvus.io/">Milvus.io</a> verfügbar, um allgemeine Fragen zu Milvus, der weltweit fortschrittlichsten Open-Source-Vektordatenbank, zu beantworten.</p>
<p>Dieses System zur Beantwortung von Fragen hilft nicht nur dabei, häufige Probleme, auf die Milvus-Benutzer stoßen, schneller zu lösen, sondern identifiziert auch neue Probleme auf der Grundlage von Benutzereingaben. Die Datenbank von MilMil enthält Fragen, die Nutzer gestellt haben, seit das Projekt 2019 erstmals unter einer Open-Source-Lizenz veröffentlicht wurde. Die Fragen werden in zwei Sammlungen gespeichert, eine für Milvus 1.x und früher und eine für Milvus 2.0.</p>
<p>MilMil ist derzeit nur in englischer Sprache verfügbar.</p>
<h2 id="How-does-MilMil-work" class="common-anchor-header">Wie funktioniert MilMil?<button data-href="#How-does-MilMil-work" class="anchor-icon" translate="no">
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
    </button></h2><p>MilMil stützt sich auf das <em>sentence-transformers/paraphrase-mpnet-base-v2-Modell</em>, um Vektordarstellungen der FAQ-Datenbank zu erhalten. Anschließend wird Milvus für die Suche nach Vektorähnlichkeit verwendet, um semantisch ähnliche Fragen zu finden.</p>
<p>Zunächst werden die FAQ-Daten mit BERT, einem Modell zur Verarbeitung natürlicher Sprache (NLP), in semantische Vektoren umgewandelt. Die Einbettungen werden dann in Milvus eingefügt und jeder Frage wird eine eindeutige ID zugewiesen. Schließlich werden die Fragen und Antworten zusammen mit ihren Vektor-IDs in PostgreSQL, eine relationale Datenbank, eingefügt.</p>
<p>Wenn die Benutzer eine Frage einreichen, wandelt das System sie mithilfe von BERT in einen Merkmalsvektor um. Anschließend sucht es in Milvus nach fünf Vektoren, die dem Abfragevektor am ähnlichsten sind, und ruft deren IDs ab. Schließlich werden die Fragen und Antworten, die mit den abgerufenen Vektor-IDs übereinstimmen, an den Benutzer zurückgegeben.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/system_process_dca67a80a6.png" alt="system-process.png" class="doc-image" id="system-process.png" />
   </span> <span class="img-wrapper"> <span>system-process.png</span> </span></p>
<p>Sehen Sie sich das Projekt des <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/question_answering_system">Fragebeantwortungssystems</a> im Milvus-Bootcamp an, um den Code für die Erstellung von KI-Chatbots zu erkunden.</p>
<h2 id="Ask-MilMil-about-Milvus" class="common-anchor-header">Fragen Sie MilMil über Milvus<button data-href="#Ask-MilMil-about-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Um mit MilMil zu chatten, navigieren Sie zu einer beliebigen Seite auf <a href="https://milvus.io/">Milvus.io</a> und klicken Sie auf das Vogel-Symbol in der unteren rechten Ecke. Geben Sie Ihre Frage in das Texteingabefeld ein und klicken Sie auf Senden. MilMil wird Ihnen innerhalb von Millisekunden antworten! Zusätzlich kann die Dropdown-Liste in der oberen linken Ecke verwendet werden, um zwischen der technischen Dokumentation für verschiedene Versionen von Milvus zu wechseln.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_chatbot_icon_f3c25708ca.png" alt="milvus-chatbot-icon.png" class="doc-image" id="milvus-chatbot-icon.png" />
   </span> <span class="img-wrapper"> <span>milvus-chatbot-icon.png</span> </span></p>
<p>Nach dem Absenden einer Frage gibt der Bot sofort drei Fragen zurück, die der Frage semantisch ähnlich sind. Sie können auf "Antwort anzeigen" klicken, um mögliche Antworten auf Ihre Frage zu sehen, oder auf "Mehr anzeigen", um weitere Fragen zu Ihrer Suche anzuzeigen. Wenn keine passende Antwort verfügbar ist, klicken Sie auf "Geben Sie hier Ihr Feedback ein", um Ihre Frage zusammen mit einer E-Mail-Adresse zu stellen. Die Hilfe der Milvus-Community wird in Kürze eintreffen!</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/chatbot_UI_0f4a7655d4.png" alt="chatbot_UI.png" class="doc-image" id="chatbot_ui.png" />
   </span> <span class="img-wrapper"> <span>chatbot_UI.png</span> </span></p>
<p>Probieren Sie MilMil aus und lassen Sie uns wissen, was Sie davon halten. Alle Fragen, Kommentare und jede Form von Feedback sind willkommen.</p>
<h2 id="Dont-be-a-stranger" class="common-anchor-header">Seien Sie kein Fremder<button data-href="#Dont-be-a-stranger" class="anchor-icon" translate="no">
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
<li>Finden Sie Milvus auf <a href="https://github.com/milvus-io/milvus/">GitHub</a> oder tragen Sie dazu bei.</li>
<li>Interagieren Sie mit der Community über <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Verbinden Sie sich mit uns auf <a href="https://twitter.com/milvusio">Twitter</a>.</li>
</ul>
