---
id: how-to-choose-the-right-embedding-model.md
title: Comment choisir le bon modèle d'intégration ?
author: Lumina Wang
date: 2025-04-09T00:00:00.000Z
desc: >-
  Découvrez les facteurs essentiels et les meilleures pratiques pour choisir le
  bon modèle d'intégration en vue d'une représentation efficace des données et
  d'une amélioration des performances.
cover: assets.zilliz.com/Complete_Workflow_31b4ac825c.gif
tag: Engineering
tags: >-
  Embedding Model, RAG, Model Selection, Machine Learning, Performance
  Optimization
canonicalUrl: 'https://milvus.io/blog/how-to-choose-the-right-embedding-model.md'
---
<p>Le choix du bon <a href="https://zilliz.com/ai-models">modèle d'intégration</a> est une décision cruciale lors de la construction de systèmes qui comprennent et travaillent avec des <a href="https://zilliz.com/learn/introduction-to-unstructured-data">données non structurées</a> telles que le texte, les images ou l'audio. Ces modèles transforment les données brutes en vecteurs de taille fixe et de haute dimension qui capturent le sens sémantique, permettant des applications puissantes dans la recherche de similarité, les recommandations, la classification, etc.</p>
<p>Mais tous les modèles d'intégration ne se valent pas. Avec autant d'options disponibles, comment choisir le bon ? Un mauvais choix peut conduire à une précision sous-optimale, à des goulets d'étranglement au niveau des performances ou à des coûts inutiles. Ce guide fournit un cadre pratique pour vous aider à évaluer et à sélectionner le meilleur modèle d'intégration pour vos besoins spécifiques.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Complete_Workflow_31b4ac825c.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="1-Define-Your-Task-and-Business-Requirements" class="common-anchor-header">1. Définir votre tâche et vos exigences commerciales<button data-href="#1-Define-Your-Task-and-Business-Requirements" class="anchor-icon" translate="no">
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
    </button></h2><p>Avant de choisir un modèle d'intégration, commencez par clarifier vos principaux objectifs :</p>
<ul>
<li><strong>Type de tâche :</strong> Commencez par identifier l'application principale que vous construisez - recherche sémantique, système de recommandation, pipeline de classification ou autre. Chaque cas d'utilisation a des exigences différentes quant à la manière dont les embeddings doivent représenter et organiser l'information. Par exemple, si vous construisez un moteur de recherche sémantique, vous avez besoin de modèles tels que Sentence-BERT qui capturent la signification sémantique nuancée entre les requêtes et les documents, en veillant à ce que les concepts similaires soient proches dans l'espace vectoriel. Pour les tâches de classification, les encastrements doivent refléter la structure spécifique à la catégorie, de sorte que les entrées de la même classe soient placées à proximité les unes des autres dans l'espace vectoriel. Il est ainsi plus facile pour les classificateurs en aval de faire la distinction entre les classes. Des modèles tels que DistilBERT et RoBERTa sont couramment utilisés. Dans les systèmes de recommandation, l'objectif est de trouver des encastrements qui reflètent les relations ou les préférences entre l'utilisateur et l'article. Pour cela, vous pouvez utiliser des modèles spécifiquement entraînés sur des données de feedback implicites, comme le filtrage collaboratif neuronal (NCF).</li>
<li><strong>Évaluation du retour sur investissement :</strong> Comparez les performances et les coûts en fonction du contexte spécifique de votre entreprise. Les applications critiques (comme les diagnostics médicaux) peuvent justifier des modèles de qualité supérieure avec une plus grande précision car il peut s'agir d'une question de vie ou de mort, tandis que les applications sensibles aux coûts avec un volume élevé nécessitent une analyse coûts-avantages minutieuse. L'essentiel est de déterminer si une amélioration de 2 à 3 % des performances justifie des augmentations de coûts potentiellement importantes dans votre cas particulier.</li>
<li><strong>Autres contraintes :</strong> Tenez compte de vos exigences techniques lorsque vous réduisez le nombre d'options. Si vous avez besoin d'une assistance multilingue, de nombreux modèles généraux ont du mal à traiter les contenus autres que l'anglais ; des modèles multilingues spécialisés peuvent donc s'avérer nécessaires. Si vous travaillez dans des domaines spécialisés (médical/juridique), les modèles d'intégration généraux passent souvent à côté du jargon spécifique au domaine. Par exemple, ils peuvent ne pas comprendre que <em>"stat"</em> dans un contexte médical signifie <em>"immédiatement",</em> ou que <em>"consideration"</em> dans des documents juridiques se réfère à un élément de valeur échangé dans un contrat. De même, les limitations matérielles et les exigences en matière de latence auront un impact direct sur les modèles qui peuvent être utilisés dans votre environnement de déploiement.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/clarify_task_and_business_requirement_b1bce2ccc0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="2-Evaluate-Your-Data" class="common-anchor-header">2. Évaluer vos données<button data-href="#2-Evaluate-Your-Data" class="anchor-icon" translate="no">
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
    </button></h2><p>La nature de vos données influence considérablement le choix du modèle d'intégration. Les éléments clés à prendre en compte sont les suivants</p>
<ul>
<li><strong>La modalité des données :</strong> Vos données sont-elles textuelles, visuelles ou multimodales ? Adaptez votre modèle à votre type de données. Utilisez des modèles basés sur des transformateurs comme <a href="https://zilliz.com/learn/what-is-bert">BERT</a> ou <a href="https://zilliz.com/learn/Sentence-Transformers-for-Long-Form-Text">Sentence-BERT</a> pour le texte, des <a href="https://zilliz.com/glossary/convolutional-neural-network">architectures CNN</a> ou Vision Transformers<a href="https://zilliz.com/learn/understanding-vision-transformers-vit">(ViT)</a> pour les images, des modèles spécialisés pour l'audio et des modèles multimodaux comme <a href="https://zilliz.com/learn/exploring-openai-clip-the-future-of-multimodal-ai-learning">CLIP</a> et MagicLens pour les applications multimodales.</li>
<li><strong>Spécificité du domaine :</strong> Demandez-vous si les modèles généraux sont suffisants ou si vous avez besoin de modèles spécifiques à un domaine qui comprennent des connaissances spécialisées. Les modèles généraux formés sur divers ensembles de données (comme les <a href="https://zilliz.com/ai-models/text-embedding-3-large">modèles d'intégration de texte de l'OpenAI</a>) fonctionnent bien pour les sujets courants, mais passent souvent à côté de distinctions subtiles dans des domaines spécialisés. Toutefois, dans des domaines tels que les soins de santé ou les services juridiques, ils manquent souvent de distinctions subtiles. Des modèles d'incorporation spécifiques à un domaine, tels que <a href="https://arxiv.org/abs/1901.08746">BioBERT</a> ou <a href="https://arxiv.org/abs/2010.02559">LegalBERT</a>, peuvent donc s'avérer plus appropriés.</li>
<li><strong>Type d'intégration :</strong> Les <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">incorporations éparses</a> excellent dans la recherche de mots-clés, ce qui les rend idéales pour les catalogues de produits ou la documentation technique. Les incorporations denses capturent mieux les relations sémantiques, ce qui les rend adaptées aux requêtes en langage naturel et à la compréhension de l'intention. De nombreux systèmes de production, tels que les systèmes de recommandation du commerce électronique, bénéficient d'une approche hybride qui exploite les deux types de données - par exemple, en utilisant <a href="https://zilliz.com/learn/mastering-bm25-a-deep-dive-into-the-algorithm-and-application-in-milvus">BM25</a> (clairsemé) pour la correspondance des mots clés et en ajoutant BERT (encastrements denses) pour capturer la similarité sémantique.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/evaluate_your_data_6caeeb813e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="3-Research-Available-Models" class="common-anchor-header">3. Recherche des modèles disponibles<button data-href="#3-Research-Available-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>Après avoir compris votre tâche et vos données, il est temps de rechercher les modèles d'intégration disponibles. Voici comment vous pouvez procéder :</p>
<ul>
<li><p><strong>Popularité :</strong> Donnez la priorité aux modèles dont les communautés sont actives et l'adoption répandue. Ces modèles bénéficient généralement d'une meilleure documentation, d'un soutien plus large de la communauté et de mises à jour régulières. Cela peut réduire considérablement les difficultés de mise en œuvre. Familiarisez-vous avec les principaux modèles de votre domaine. Par exemple, pour le texte : pensez à l'intégration de l'OpenAI dans la base de données :</p>
<ul>
<li>Pour le texte : considérez les embeddings d'OpenAI, les variantes de Sentence-BERT ou les modèles E5/BGE.</li>
<li>Pour les images : examinez ViT et ResNet, ou CLIP et SigLIP pour l'alignement texte-image.</li>
<li>Pour l'audio : vérifiez les PNN, CLAP ou d'<a href="https://zilliz.com/learn/top-10-most-used-embedding-models-for-audio-data">autres modèles populaires</a>.</li>
</ul></li>
<li><p><strong>Droits d'auteur et licences</strong>: Évaluez soigneusement les implications en matière de licences, car elles ont une incidence directe sur les coûts à court et à long terme. Les modèles à code source ouvert (comme MIT, Apache 2.0 ou des licences similaires) offrent une certaine souplesse pour la modification et l'utilisation commerciale, ce qui vous donne un contrôle total sur le déploiement, mais nécessite une expertise en matière d'infrastructure. Les modèles propriétaires accessibles via des API offrent commodité et simplicité, mais s'accompagnent de coûts permanents et de problèmes potentiels de confidentialité des données. Cette décision est particulièrement cruciale pour les applications dans les secteurs réglementés où la souveraineté des données ou les exigences de conformité peuvent rendre l'auto-hébergement nécessaire malgré l'investissement initial plus élevé.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/model_research2_b0df75cb55.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="4-Evaluate-Candidate-Models" class="common-anchor-header">4. Évaluer les modèles candidats<button data-href="#4-Evaluate-Candidate-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>Une fois que vous avez sélectionné quelques modèles, il est temps de les tester avec votre échantillon de données. Voici les facteurs clés à prendre en compte :</p>
<ul>
<li><strong>L'évaluation :</strong> Lors de l'évaluation de la qualité de l'intégration, en particulier dans la génération augmentée de recherche (RAG) ou l'application de recherche, il est important de mesurer le <em>degré de précision, de pertinence et d'exhaustivité des</em> résultats renvoyés. Les mesures clés comprennent la fidélité, la pertinence de la réponse, la précision du contexte et le rappel. Des cadres tels que Ragas, DeepEval, Phoenix et TruLens-Eval rationalisent ce processus d'évaluation en fournissant des méthodologies structurées pour évaluer les différents aspects de la qualité de l'intégration. Les ensembles de données sont tout aussi importants pour une évaluation pertinente. Ils peuvent être créés à la main pour représenter des cas d'utilisation réels, générés synthétiquement par des LLM pour tester des capacités spécifiques, ou créés à l'aide d'outils tels que Ragas et FiddleCube pour cibler des aspects de test particuliers. La bonne combinaison de jeu de données et de cadre dépend de votre application spécifique et du niveau de granularité de l'évaluation dont vous avez besoin pour prendre des décisions en toute confiance.</li>
<li><strong>Benchmark des performances :</strong> Évaluez les modèles sur des critères de référence spécifiques à une tâche (par exemple, MTEB pour la recherche). N'oubliez pas que les classements varient considérablement en fonction du scénario (recherche ou classification), des ensembles de données (généraux ou spécifiques à un domaine comme BioASQ) et des mesures (précision, vitesse). Bien que les performances de référence fournissent des informations précieuses, elles ne se traduisent pas toujours parfaitement dans les applications du monde réel. Recoupez les modèles les plus performants qui correspondent à votre type de données et à vos objectifs, mais validez toujours avec vos propres cas de test personnalisés afin d'identifier les modèles qui pourraient être trop performants par rapport aux benchmarks, mais moins performants dans des conditions réelles avec vos modèles de données spécifiques.</li>
<li><strong>Test de charge :</strong> Pour les modèles auto-hébergés, simulez des charges de production réalistes afin d'évaluer les performances dans des conditions réelles. Mesurez le débit ainsi que l'utilisation du GPU et la consommation de mémoire pendant l'inférence afin d'identifier les goulets d'étranglement potentiels. Un modèle qui fonctionne bien de manière isolée peut devenir problématique lorsqu'il traite des requêtes simultanées ou des entrées complexes. Si le modèle est trop gourmand en ressources, il risque de ne pas convenir aux applications à grande échelle ou en temps réel, quelle que soit sa précision sur les mesures de référence.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/evaluate_candidate_models_3a7edd9cd7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="5-Model-Integration" class="common-anchor-header">5. Intégration du modèle<button data-href="#5-Model-Integration" class="anchor-icon" translate="no">
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
    </button></h2><p>Après avoir sélectionné un modèle, il est temps de planifier votre approche d'intégration.</p>
<ul>
<li><strong>Sélection des poids :</strong> Choisissez entre l'utilisation de poids pré-entraînés pour un déploiement rapide ou un réglage fin sur des données spécifiques au domaine pour améliorer les performances. N'oubliez pas que le réglage fin peut améliorer les performances, mais qu'il est gourmand en ressources. Il convient de déterminer si les gains de performance justifient la complexité supplémentaire.</li>
<li><strong>Service d'inférence autonome ou service d'inférence tiers :</strong> Choisissez votre approche de déploiement en fonction des capacités et des besoins de votre infrastructure. L'auto-hébergement vous permet de contrôler entièrement le modèle et le flux de données, ce qui peut réduire les coûts par demande à grande échelle et garantir la confidentialité des données. Cependant, il nécessite une expertise en matière d'infrastructure et une maintenance continue. Les services d'inférence tiers permettent un déploiement rapide avec une configuration minimale, mais introduisent une latence du réseau, des plafonds d'utilisation potentiels et des coûts continus qui peuvent devenir importants à l'échelle.</li>
<li><strong>Conception de l'intégration :</strong> Planifiez la conception de votre API, les stratégies de mise en cache, l'approche du traitement par lots et la sélection de la <a href="https://milvus.io/blog/what-is-a-vector-database.md">base de données vectorielle</a> pour stocker et interroger efficacement les données intégrées.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/model_integration_8c8f0410c7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="6-End-to-End-Testing" class="common-anchor-header">6. Test de bout en bout<button data-href="#6-End-to-End-Testing" class="anchor-icon" translate="no">
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
    </button></h2><p>Avant le déploiement complet, effectuez des tests de bout en bout pour vous assurer que le modèle fonctionne comme prévu :</p>
<ul>
<li><strong>Performance</strong>: Évaluez toujours le modèle sur votre propre ensemble de données pour vous assurer qu'il fonctionne bien dans votre cas d'utilisation spécifique. Prenez en compte des mesures telles que MRR, MAP et NDCG pour la qualité de la recherche, la précision, le rappel et F1 pour l'exactitude, et les percentiles de débit et de latence pour les performances opérationnelles.</li>
<li><strong>Robustesse</strong>: Testez le modèle dans différentes conditions, y compris des cas limites et diverses entrées de données, pour vérifier qu'il fonctionne de manière cohérente et précise.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/end_to_end_testing_7ae244a73b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Summary" class="common-anchor-header">Résumé<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Comme nous l'avons vu tout au long de ce guide, pour sélectionner le bon modèle d'intégration, il faut suivre ces six étapes essentielles :</p>
<ol>
<li>Définir les besoins de l'entreprise et le type de tâche</li>
<li>Analyser les caractéristiques de vos données et la spécificité de votre domaine</li>
<li>Recherchez les modèles disponibles et leurs conditions de licence</li>
<li>Évaluer rigoureusement les candidats par rapport à des repères pertinents et à des ensembles de données de test</li>
<li>Planifier votre approche d'intégration en tenant compte des options de déploiement</li>
<li>Effectuer des tests complets de bout en bout avant le déploiement de la production.</li>
</ol>
<p>En suivant ce cadre, vous pouvez prendre une décision éclairée qui équilibre les performances, le coût et les contraintes techniques pour votre cas d'utilisation spécifique. N'oubliez pas que le "meilleur" modèle n'est pas nécessairement celui qui obtient les meilleurs résultats - c'est celui qui répond le mieux à vos besoins particuliers dans le cadre de vos contraintes opérationnelles.</p>
<p>Les modèles d'intégration évoluant rapidement, il est également utile de réévaluer périodiquement votre choix à mesure que de nouvelles options apparaissent, susceptibles d'apporter des améliorations significatives à votre application.</p>
