---
id: building-intelligent-chatbot-with-nlp-and-milvus.md
title: Architecture générale
author: milvus
date: 2020-05-12T22:33:34.726Z
desc: La nouvelle génération de robots d'assurance qualité est là
cover: assets.zilliz.com/header_ce3a0e103d.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/building-intelligent-chatbot-with-nlp-and-milvus'
---
<custom-h1>Construire un système d'assurance qualité intelligent avec NLP et Milvus</custom-h1><p>Projet Milvus：github.com/milvus-io/milvus</p>
<p>Le système de réponse aux questions est couramment utilisé dans le domaine du traitement du langage naturel. Il est utilisé pour répondre à des questions en langage naturel et a un large éventail d'applications. Les applications typiques comprennent : l'interaction vocale intelligente, le service clientèle en ligne, l'acquisition de connaissances, le chat émotionnel personnalisé, etc. La plupart des systèmes de réponse aux questions peuvent être classés comme suit : systèmes de réponse aux questions génératifs et de recherche, systèmes de réponse aux questions à un seul tour et systèmes de réponse aux questions à plusieurs tours, systèmes de réponse aux questions ouvertes et systèmes de réponse aux questions spécifiques.</p>
<p>Cet article traite principalement d'un système d'assurance qualité conçu pour un domaine spécifique, généralement appelé robot intelligent de service à la clientèle. Dans le passé, la construction d'un robot de service à la clientèle nécessitait généralement la conversion des connaissances du domaine en une série de règles et de graphes de connaissances. Le processus de construction repose en grande partie sur l'intelligence "humaine". Avec l'application de l'apprentissage profond au traitement du langage naturel (NLP), la lecture automatique peut trouver automatiquement les réponses aux questions correspondantes directement à partir des documents. Le modèle linguistique d'apprentissage profond convertit les questions et les documents en vecteurs sémantiques pour trouver la réponse correspondante.</p>
<p>Cet article utilise le modèle BERT open source de Google et Milvus, un moteur de recherche vectoriel open source, pour construire rapidement un robot de questions-réponses basé sur la compréhension sémantique.</p>
<h2 id="Overall-Architecture" class="common-anchor-header">Architecture générale<button data-href="#Overall-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>Cet article met en œuvre un système de réponse aux questions par le biais de l'appariement des similarités sémantiques. Le processus général de construction est le suivant :</p>
<ol>
<li>Obtenir un grand nombre de questions avec des réponses dans un domaine spécifique (un ensemble de questions standard).</li>
<li>Utiliser le modèle BERT pour convertir ces questions en vecteurs de caractéristiques et les stocker dans Milvus. Milvus attribue en même temps un ID de vecteur à chaque vecteur de caractéristiques.</li>
<li>Stocker ces ID de questions représentatives et leurs réponses correspondantes dans PostgreSQL.</li>
</ol>
<p>Lorsqu'un utilisateur pose une question :</p>
<ol>
<li>Le modèle BERT la convertit en un vecteur de caractéristiques.</li>
<li>Milvus effectue une recherche de similarité et récupère l'ID le plus similaire à la question.</li>
<li>PostgreSQL renvoie la réponse correspondante.</li>
</ol>
<p>Le diagramme de l'architecture du système est le suivant (les lignes bleues représentent le processus d'importation et les lignes jaunes le processus d'interrogation) :</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_system_architecture_milvus_bert_postgresql_63de466754.png" alt="1-system-architecture-milvus-bert-postgresql.png" class="doc-image" id="1-system-architecture-milvus-bert-postgresql.png" />
   </span> <span class="img-wrapper"> <span>1-system-architecture-milvus-bert-postgresql.png</span> </span></p>
<p>Nous allons maintenant vous montrer comment créer un système de questions-réponses en ligne, étape par étape.</p>
<h2 id="Steps-to-Build-the-QA-System" class="common-anchor-header">Étapes de la création d'un système de questions-réponses<button data-href="#Steps-to-Build-the-QA-System" class="anchor-icon" translate="no">
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
    </button></h2><p>Avant de commencer, vous devez installer Milvus et PostgreSQL. Pour les étapes d'installation spécifiques, voir le site officiel de Milvus.</p>
<h3 id="1-Data-preparation" class="common-anchor-header">1. Préparation des données</h3><p>Les données expérimentales de cet article proviennent de : https://github.com/chatopera/insuranceqa-corpus-zh</p>
<p>L'ensemble de données contient des paires de questions et de réponses relatives au secteur de l'assurance. Dans cet article, nous en extrayons 20 000 paires de questions et de réponses. Grâce à cet ensemble de données de questions et de réponses, vous pouvez rapidement construire un robot de service client pour le secteur de l'assurance.</p>
<h3 id="2-Generate-feature-vectors" class="common-anchor-header">2. Générer des vecteurs de caractéristiques</h3><p>Ce système utilise un modèle pré-entraîné par BERT. Téléchargez-le à partir du lien ci-dessous avant de commencer un service : https://storage.googleapis.com/bert_models/2018_10_18/cased_L-24_H-1024_A-16.zip</p>
<p>Utilisez ce modèle pour convertir la base de données de questions en vecteurs de caractéristiques pour une future recherche de similitudes. Pour plus d'informations sur le service BERT, voir https://github.com/hanxiao/bert-as-service.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_code_block_e1b2021a91.png" alt="2-code-block.png" class="doc-image" id="2-code-block.png" />
   </span> <span class="img-wrapper"> <span>2-bloc-code.png</span> </span></p>
<h3 id="3-Import-to-Milvus-and-PostgreSQL" class="common-anchor-header">3. Importation dans Milvus et PostgreSQL</h3><p>Normaliser et importer les vecteurs de caractéristiques générés dans Milvus, puis importer les ID renvoyés par Milvus et les réponses correspondantes dans PostgreSQL. Le tableau suivant montre la structure de la table dans PostgreSQL :</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_import_milvus_postgresql_bb2a258c61.png" alt="3-import-milvus-postgresql.png" class="doc-image" id="3-import-milvus-postgresql.png" />
   </span> <span class="img-wrapper"> <span>3-import-milvus-postgresql.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_import_milvus_postgresql_2abc29a4c4.png" alt="4-import-milvus-postgresql.png" class="doc-image" id="4-import-milvus-postgresql.png" />
   </span> <span class="img-wrapper"> <span>4-import-milvus-postgresql.png</span> </span></p>
<h3 id="4-Retrieve-Answers" class="common-anchor-header">4. Récupérer les réponses</h3><p>L'utilisateur saisit une question et, après avoir généré le vecteur de caractéristiques via BERT, il peut trouver la question la plus similaire dans la bibliothèque Milvus. Cet article utilise la distance cosinus pour représenter la similarité entre deux phrases. Tous les vecteurs étant normalisés, plus la distance cosinus des deux vecteurs de caractéristiques est proche de 1, plus la similarité est élevée.</p>
<p>Dans la pratique, il se peut que votre système ne dispose pas de questions parfaitement correspondantes dans la bibliothèque. Vous pouvez alors fixer un seuil de 0,9. Si la plus grande distance de similarité retrouvée est inférieure à ce seuil, le système indiquera qu'il n'inclut pas de questions apparentées.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_retrieve_answers_6424db1032.png" alt="4-retrieve-answers.png" class="doc-image" id="4-retrieve-answers.png" />
   </span> <span class="img-wrapper"> <span>4-retrieve-answers.png</span> </span></p>
<h2 id="System-Demonstration" class="common-anchor-header">Démonstration du système<button data-href="#System-Demonstration" class="anchor-icon" translate="no">
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
    </button></h2><p>L'illustration suivante montre un exemple d'interface du système :</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_milvus_QA_system_application_e5860cee42.png" alt="5-milvus-QA-system-application.png" class="doc-image" id="5-milvus-qa-system-application.png" />
   </span> <span class="img-wrapper"> <span>5-milvus-QA-system-application.png</span> </span></p>
<p>Saisissez votre question dans la boîte de dialogue et vous recevrez une réponse correspondante :</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_milvus_QA_system_application_2_8064237e2a.png" alt="5-milvus-QA-system-application-2.png" class="doc-image" id="5-milvus-qa-system-application-2.png" />
   </span> <span class="img-wrapper"> <span>5-milvus-QA-system-application-2.png</span> </span></p>
<h2 id="Summary" class="common-anchor-header">Résumé de l'article<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Après avoir lu cet article, nous espérons que vous trouverez facile de construire votre propre système de questions et réponses.</p>
<p>Avec le modèle BERT, vous n'avez plus besoin de trier et d'organiser les corpus de texte au préalable. En même temps, grâce à la haute performance et à l'extensibilité du moteur de recherche vectoriel open source Milvus, votre système d'assurance qualité peut prendre en charge un corpus de plusieurs centaines de millions de textes.</p>
<p>Milvus a officiellement rejoint la Fondation Linux AI (LF AI) pour l'incubation. Vous êtes invités à rejoindre la communauté Milvus et à travailler avec nous pour accélérer l'application des technologies de l'IA !</p>
<p>=&gt; Essayez notre démo en ligne ici : https://www.milvus.io/scenarios</p>
