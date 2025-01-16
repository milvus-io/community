---
id: ai-in-.md
title: >-
  Accélérer l'IA dans la finance avec Milvus, une base de données vectorielle
  open-source
author: milvus
date: 2021-05-19T03:41:20.776Z
desc: >-
  Milvus peut être utilisé pour créer des applications d'IA pour le secteur
  financier, notamment des chatbots, des systèmes de recommandation, etc.
cover: assets.zilliz.com/03_1_1e5aaf7dd1.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/ai-in-finance'
---
<custom-h1>Accélérer l'IA dans la finance avec Milvus, une base de données vectorielle open-source</custom-h1><p>Les banques et autres institutions financières sont depuis longtemps des adeptes de la première heure des logiciels libres pour le traitement et l'analyse des données volumineuses (big data). En 2010, Morgan Stanley <a href="https://www.forbes.com/sites/tomgroenfeldt/2012/05/30/morgan-stanley-takes-on-big-data-with-hadoop/?sh=19f4f8cd16db">a commencé à utiliser</a> le framework open-source Apache Hadoop dans le cadre d'une petite expérience. L'entreprise avait du mal à adapter les bases de données traditionnelles aux volumes massifs de données que ses scientifiques voulaient exploiter, et a donc décidé d'explorer d'autres solutions. Hadoop est aujourd'hui un élément essentiel de Morgan Stanley, qui l'aide dans tous les domaines, de la gestion des données de gestion de la relation client à l'analyse de portefeuille. D'autres logiciels de bases de données relationnelles libres, tels que MySQL, MongoDB et PostgreSQL, se sont révélés des outils indispensables pour exploiter les données volumineuses dans le secteur financier.</p>
<p>La technologie est ce qui donne au secteur des services financiers un avantage concurrentiel, et l'intelligence artificielle (IA) devient rapidement l'approche standard pour extraire des informations précieuses des big data et analyser l'activité en temps réel dans les secteurs de la banque, de la gestion d'actifs et de l'assurance. En utilisant des algorithmes d'IA pour convertir des données non structurées telles que des images, du son ou des vidéos en vecteurs, un format de données numériques lisible par une machine, il est possible d'effectuer des recherches de similarité sur des ensembles massifs de données vectorielles de l'ordre du million, du milliard, voire du trillion. Les données vectorielles sont stockées dans un espace à haute dimension et les vecteurs similaires sont trouvés à l'aide d'une recherche de similarité, qui nécessite une infrastructure dédiée appelée base de données vectorielles.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/01_1_cb99f15886.jpg" alt="01 (1).jpg" class="doc-image" id="01-(1).jpg" />
   </span> <span class="img-wrapper"> <span>01 (1).jpg</span> </span></p>
<p><a href="https://github.com/milvus-io/milvus">Milvus</a> est une base de données vectorielles open-source conçue spécifiquement pour gérer les données vectorielles, ce qui signifie que les ingénieurs et les scientifiques des données peuvent se concentrer sur la création d'applications d'IA ou sur la réalisation d'analyses, plutôt que sur l'infrastructure de données sous-jacente. La plateforme a été conçue autour des flux de développement d'applications d'IA et est optimisée pour rationaliser les opérations d'apprentissage automatique (MLOps). Pour plus d'informations sur Milvus et sa technologie sous-jacente, consultez notre <a href="https://zilliz.com/blog/Vector-Similarity-Search-Hides-in-Plain-View">blog</a>.</p>
<p>Les applications courantes de l'IA dans le secteur des services financiers comprennent le trading algorithmique, la composition et l'optimisation de portefeuilles, la validation de modèles, le backtesting, le Robo-advising, les assistants clients virtuels, l'analyse de l'impact sur le marché, la conformité réglementaire et les tests de résistance. Cet article couvre trois domaines spécifiques où les données vectorielles sont exploitées comme l'un des actifs les plus précieux pour les sociétés bancaires et financières :</p>
<ol>
<li>Amélioration de l'expérience client grâce aux chatbots bancaires</li>
<li>Stimuler les ventes de services financiers et plus encore grâce à des systèmes de recommandation</li>
<li>Analyse des rapports de résultats et d'autres données financières non structurées grâce au text mining sémantique</li>
</ol>
<p><br/></p>
<h3 id="Enhancing-customer-experience-with-banking-chatbots" class="common-anchor-header">Améliorer l'expérience client avec les chatbots bancaires</h3><p>Les chatbots bancaires peuvent améliorer l'expérience des clients en les aidant à choisir des investissements, des produits bancaires et des polices d'assurance. Les services numériques gagnent rapidement en popularité, en partie en raison des tendances accélérées par la pandémie de coronavirus. Les chatbots utilisent le traitement du langage naturel (NLP) pour convertir les questions soumises par les utilisateurs en vecteurs sémantiques afin de rechercher les réponses correspondantes. Les chatbots bancaires modernes offrent une expérience naturelle personnalisée aux utilisateurs et parlent sur un ton conversationnel. Milvus fournit un tissu de données bien adapté à la création de chatbots à l'aide d'une recherche de similarité vectorielle en temps réel.</p>
<p>Pour en savoir plus, consultez notre démo sur la création de <a href="https://zilliz.com/blog/building-intelligent-chatbot-with-nlp-and-milvus">chatbots avec Milvus</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/02_1_8c298c45e5.jpg" alt="02 (1).jpg" class="doc-image" id="02-(1).jpg" />
   </span> <span class="img-wrapper"> <span>02 (1).jpg</span> </span></p>
<p><br/></p>
<h4 id="Boosting-financial-services-sales-and-more-with-recommender-systems" class="common-anchor-header">Stimuler les ventes de services financiers et plus encore grâce aux systèmes de recommandation :</h4><p>Le secteur de la banque privée utilise des systèmes de recommandation pour augmenter les ventes de produits financiers grâce à des recommandations personnalisées basées sur les profils des clients. Les systèmes de recommandation peuvent également être utilisés pour la recherche financière, les informations commerciales, la sélection des titres et les systèmes d'aide à la négociation. Grâce aux modèles d'apprentissage profond, chaque utilisateur et chaque article sont décrits comme un vecteur d'intégration. Une base de données vectorielle offre un espace d'intégration où les similitudes entre les utilisateurs et les articles peuvent être calculées.</p>
<p>Pour en savoir plus, consultez notre <a href="https://zilliz.com/blog/graph-based-recommendation-system-with-milvus">démo</a> sur les systèmes de recommandation basés sur les graphes avec Milvus.</p>
<p><br/></p>
<h4 id="Analyzing-earnings-reports-and-other-unstructured-financial-data-with-semantic-text-mining" class="common-anchor-header">Analyse des rapports de résultats et d'autres données financières non structurées à l'aide du text mining sémantique :</h4><p>Les techniques de text mining ont eu un impact substantiel sur l'industrie financière. Avec la croissance exponentielle des données financières, le text mining est devenu un champ de recherche important dans le domaine de la finance.</p>
<p>Des modèles d'apprentissage profond sont actuellement appliqués pour représenter les rapports financiers par des vecteurs de mots capables de capturer de nombreux aspects sémantiques. Une base de données vectorielle comme Milvus est capable de stocker des vecteurs de mots sémantiques massifs provenant de millions de rapports, puis d'effectuer des recherches de similarité sur ces vecteurs en quelques millisecondes.</p>
<p>En savoir plus sur l'<a href="https://medium.com/deepset-ai/semantic-search-with-milvus-knowledge-graph-qa-web-crawlers-and-more-837451eae9fa">utilisation de Haystack deepset avec Milvus</a>.</p>
<p><br/></p>
<h3 id="Don’t-be-a-stranger" class="common-anchor-header">Ne soyez pas un inconnu</h3><ul>
<li>Trouvez ou contribuez à Milvus sur <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>Interagissez avec la communauté via <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Connectez-vous avec nous sur <a href="https://twitter.com/milvusio">Twitter</a>.</li>
</ul>
