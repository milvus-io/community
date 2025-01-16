---
id: milmil-a-milvus-powered-faq-chatbot-that-answers-questions-about-milvus.md
title: MilMil Un chatbot FAQ alimenté par Milvus qui répond aux questions sur Milvus
author: milvus
date: 2021-07-20T07:21:43.897Z
desc: >-
  Utilisation d'outils de recherche vectorielle à source ouverte pour créer un
  service de réponse aux questions.
cover: assets.zilliz.com/milmil_4600f33f1c.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/milmil-a-milvus-powered-faq-chatbot-that-answers-questions-about-milvus
---
<custom-h1>MilMil : Un chatbot FAQ alimenté par Milvus qui répond aux questions sur Milvus</custom-h1><p>La communauté open-source a récemment créé MilMil, un chatbot FAQ Milvus conçu par et pour les utilisateurs de Milvus. MilMil est disponible 24 heures sur 24 et 7 jours sur 7 sur <a href="https://milvus.io/">Milvus.io</a> pour répondre aux questions les plus courantes sur Milvus, la base de données vectorielles open-source la plus avancée au monde.</p>
<p>Ce système de réponse aux questions permet non seulement de résoudre plus rapidement les problèmes courants rencontrés par les utilisateurs de Milvus, mais aussi d'identifier de nouveaux problèmes sur la base des soumissions des utilisateurs. La base de données MilMil comprend les questions que les utilisateurs ont posées depuis que le projet a été publié pour la première fois sous une licence open-source en 2019. Les questions sont stockées dans deux collections, l'une pour Milvus 1.x et les versions antérieures et l'autre pour Milvus 2.0.</p>
<p>MilMil n'est actuellement disponible qu'en anglais.</p>
<h2 id="How-does-MilMil-work" class="common-anchor-header">Comment fonctionne MilMil ?<button data-href="#How-does-MilMil-work" class="anchor-icon" translate="no">
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
    </button></h2><p>MilMil s'appuie sur le modèle <em>sentence-transformers/paraphrase-mpnet-base-v2</em> pour obtenir des représentations vectorielles de la base de données FAQ, puis Milvus est utilisé pour la recherche par similarité vectorielle afin de renvoyer des questions sémantiquement similaires.</p>
<p>Tout d'abord, les données de la FAQ sont converties en vecteurs sémantiques à l'aide de BERT, un modèle de traitement du langage naturel (NLP). Les vecteurs sémantiques sont ensuite insérés dans Milvus et un identifiant unique est attribué à chacun d'entre eux. Enfin, les questions et les réponses sont insérées dans PostgreSQL, une base de données relationnelle, avec leurs vecteurs ID.</p>
<p>Lorsque les utilisateurs soumettent une question, le système la convertit en un vecteur de caractéristiques à l'aide de BERT. Ensuite, il recherche dans Milvus les cinq vecteurs les plus similaires au vecteur de la question et récupère leurs identifiants. Enfin, les questions et les réponses correspondant aux vecteurs identifiés sont renvoyées à l'utilisateur.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/system_process_dca67a80a6.png" alt="system-process.png" class="doc-image" id="system-process.png" />
   </span> <span class="img-wrapper"> <span>processus-systeme.png</span> </span></p>
<p>Consultez le projet de <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/question_answering_system">système de réponse aux questions</a> dans le Milvus bootcamp pour explorer le code utilisé pour construire des chatbots d'IA.</p>
<h2 id="Ask-MilMil-about-Milvus" class="common-anchor-header">Poser des questions à MilMil sur Milvus<button data-href="#Ask-MilMil-about-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Pour discuter avec MilMil, naviguez vers n'importe quelle page de <a href="https://milvus.io/">Milvus.io</a> et cliquez sur l'icône de l'oiseau dans le coin inférieur droit. Tapez votre question dans la zone de saisie de texte et cliquez sur Envoyer. MilMil vous répondra en quelques millisecondes ! En outre, la liste déroulante dans le coin supérieur gauche peut être utilisée pour basculer entre la documentation technique des différentes versions de Milvus.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_chatbot_icon_f3c25708ca.png" alt="milvus-chatbot-icon.png" class="doc-image" id="milvus-chatbot-icon.png" />
   </span> <span class="img-wrapper"> <span>milvus-chatbot-icon.png</span> </span></p>
<p>Après avoir soumis une question, le robot renvoie immédiatement trois questions qui sont sémantiquement similaires à la question posée. Vous pouvez cliquer sur "Voir la réponse" pour parcourir les réponses potentielles à votre question, ou cliquer sur "Voir plus" pour afficher d'autres questions liées à votre recherche. Si aucune réponse appropriée n'est disponible, cliquez sur "Donnez votre avis ici" pour poser votre question en indiquant une adresse électronique. L'aide de la communauté Milvus ne tardera pas à arriver !</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/chatbot_UI_0f4a7655d4.png" alt="chatbot_UI.png" class="doc-image" id="chatbot_ui.png" />
   </span> <span class="img-wrapper"> <span>chatbot_UI.png</span> </span></p>
<p>Essayez MilMil et dites-nous ce que vous en pensez. Toutes les questions, tous les commentaires et toutes les formes de réactions sont les bienvenus.</p>
<h2 id="Dont-be-a-stranger" class="common-anchor-header">Ne soyez pas un étranger<button data-href="#Dont-be-a-stranger" class="anchor-icon" translate="no">
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
<li>Trouvez ou contribuez à Milvus sur <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>Interagissez avec la communauté via <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Connectez-vous avec nous sur <a href="https://twitter.com/milvusio">Twitter</a>.</li>
</ul>
