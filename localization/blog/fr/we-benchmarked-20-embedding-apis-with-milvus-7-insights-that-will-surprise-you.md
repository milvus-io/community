---
id: >-
  we-benchmarked-20-embedding-apis-with-milvus-7-insights-that-will-surprise-you.md
title: >-
  Nous avons comparé plus de 20 API d'intégration avec Milvus : 7 idées qui vous
  surprendront
author: Jeremy Zhu
date: 2025-05-23T00:00:00.000Z
desc: >-
  Les API d'intégration les plus populaires ne sont pas les plus rapides. La
  géographie compte plus que l'architecture du modèle. Et parfois, une unité
  centrale à 20 $/mois vaut mieux qu'un appel d'API à 200 $/mois.
cover: >-
  assets.zilliz.com/We_Benchmarked_20_Embedding_AP_Is_with_Milvus_7_Insights_That_Will_Surprise_You_12268622f0.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus, Embedding API, RAG, latency, vector search'
meta_title: >
  We Benchmarked 20+ Embedding APIs with Milvus: 7 Insights That Will Surprise
  You
origin: >-
  https://milvus.io/blog/we-benchmarked-20-embedding-apis-with-milvus-7-insights-that-will-surprise-you.md
---
<p><strong>Tous les développeurs d'IA ont probablement construit un système RAG qui fonctionne parfaitement... dans leur environnement local.</strong></p>
<p>Vous avez obtenu une précision de recherche optimale, optimisé votre base de données vectorielle et votre démo fonctionne comme du beurre. Puis vous déployez votre système en production et soudain, vos requêtes locales de 200 ms prennent 3 ms :</p>
<ul>
<li><p>vos requêtes locales de 200 ms prennent 3 secondes pour les utilisateurs réels</p></li>
<li><p>Des collègues dans différentes régions rapportent des performances complètement différentes</p></li>
<li><p>Le fournisseur de services d'intégration que vous avez choisi pour la "meilleure précision" devient votre principal goulot d'étranglement.</p></li>
</ul>
<p>Qu'est-ce qui s'est passé ? Voici le tueur de performances que personne n'évalue : la <strong>latence de l'API d'intégration</strong>.</p>
<p>Alors que les classements MTEB sont obsédés par les scores de rappel et la taille des modèles, ils ignorent la mesure que ressentent vos utilisateurs - le temps d'attente avant d'obtenir une réponse. Nous avons testé tous les principaux fournisseurs d'intégration dans des conditions réelles et découvert des différences de latence extrêmes qui vous feront remettre en question toute votre stratégie de sélection des fournisseurs.</p>
<p><strong><em>Retour en arrière : Les API d'intégration les plus populaires ne sont pas les plus rapides. La géographie compte plus que l'architecture du modèle. Et parfois, une <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">unité centrale</annotation><mrow><mn>de 20 mois qui bat</mn><mi>20</mi><mn>mois vaut</mn></mrow><annotation encoding="application/x-tex">mieux qu'un</annotation></semantics></math></span></span>appel API de <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">20 mois qui bat</span><span class="mord mathnormal">200</span><span class="mord">mois sur</span><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord">.</span></span></span></span></em></strong></p>
<h2 id="Why-Embedding-API-Latency-Is-the-Hidden-Bottleneck-in-RAG" class="common-anchor-header">Pourquoi l'intégration de la latence de l'API est le goulot d'étranglement caché des systèmes RAG<button data-href="#Why-Embedding-API-Latency-Is-the-Hidden-Bottleneck-in-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>Lors de la construction de systèmes RAG, de moteurs de recherche pour le commerce électronique ou de moteurs de recommandation, les modèles d'intégration sont le composant central qui transforme le texte en vecteurs, permettant aux machines de comprendre la sémantique et d'effectuer des recherches de similarité efficaces. Bien que les bibliothèques de documents soient généralement précalculées, les requêtes des utilisateurs nécessitent toujours des appels API d'intégration en temps réel pour convertir les questions en vecteurs avant la récupération, et cette latence en temps réel devient souvent le goulot d'étranglement des performances dans l'ensemble de la chaîne d'application.</p>
<p>Les repères d'intégration populaires tels que MTEB se concentrent sur la précision du rappel ou la taille du modèle, en négligeant souvent la mesure de performance cruciale, à savoir la latence de l'API. À l'aide de la fonction <code translate="no">TextEmbedding</code> de Milvus, nous avons effectué des tests complets dans le monde réel sur les principaux fournisseurs de services d'intégration en Amérique du Nord et en Asie.</p>
<p>La latence de l'intégration se manifeste à deux stades critiques :</p>
<h3 id="Query-Time-Impact" class="common-anchor-header">Impact sur le temps d'interrogation</h3><p>Dans un flux de travail RAG typique, lorsqu'un utilisateur pose une question, le système doit :</p>
<ul>
<li><p>convertir la requête en vecteur via un appel API d'incorporation</p></li>
<li><p>rechercher des vecteurs similaires dans Milvus</p></li>
<li><p>Transmettre les résultats et la question originale à un LLM</p></li>
<li><p>Générer et renvoyer la réponse</p></li>
</ul>
<p>De nombreux développeurs pensent que la génération de la réponse du LLM est la partie la plus lente. Cependant, la capacité de sortie en continu de nombreux LLM crée une illusion de vitesse : vous voyez rapidement le premier jeton. En réalité, si votre appel d'API d'intégration prend des centaines de millisecondes, voire des secondes, il devient le premier goulot d'étranglement - et le plus visible - de votre chaîne de réponse.</p>
<h3 id="Data-Ingestion-Impact" class="common-anchor-header">Impact de l'ingestion de données</h3><p>Qu'il s'agisse de créer un index à partir de zéro ou d'effectuer des mises à jour de routine, l'ingestion en masse nécessite la vectorisation de milliers ou de millions de morceaux de texte. Si chaque appel d'incorporation présente une latence élevée, l'ensemble de votre pipeline de données ralentit considérablement, ce qui retarde les sorties de produits et les mises à jour de la base de connaissances.</p>
<p>Dans les deux cas, la latence de l'API d'intégration est une mesure de performance non négociable pour les systèmes RAG de production.</p>
<h2 id="Measuring-Real-World-Embedding-API-Latency-with-Milvus" class="common-anchor-header">Mesure de la latence de l'API d'intégration dans le monde réel avec Milvus<button data-href="#Measuring-Real-World-Embedding-API-Latency-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus est une base de données vectorielles haute performance open-source qui offre une nouvelle interface <code translate="no">TextEmbedding</code> Function. Cette fonctionnalité intègre directement les modèles d'intégration populaires d'OpenAI, Cohere, AWS Bedrock, Google Vertex AI, Voyage AI et de nombreux autres fournisseurs dans votre pipeline de données, rationalisant ainsi votre pipeline de recherche vectorielle avec un seul appel.</p>
<p>À l'aide de cette nouvelle interface fonctionnelle, nous avons testé et évalué les API d'intégration les plus populaires de fournisseurs bien connus comme OpenAI et Cohere, ainsi que d'autres comme AliCloud et SiliconFlow, en mesurant leur latence de bout en bout dans des scénarios de déploiement réalistes.</p>
<p>Notre suite de tests complète a couvert différentes configurations de modèles :</p>
<table>
<thead>
<tr><th><strong>Fournisseur</strong></th><th><strong>Modèle</strong></th><th><strong>Dimensions</strong></th></tr>
</thead>
<tbody>
<tr><td>OpenAI</td><td>insertion de texte-ada-002</td><td>1536</td></tr>
<tr><td>OpenAI</td><td>texte-encartage-3-petit</td><td>1536</td></tr>
<tr><td>OpenAI</td><td>texte-encodage-3-grand</td><td>3072</td></tr>
<tr><td>AWS Bedrock</td><td>amazon.titan-embed-text-v2:0</td><td>1024</td></tr>
<tr><td>Google Vertex AI</td><td>texte-embedding-005</td><td>768</td></tr>
<tr><td>Google Vertex AI</td><td>texte-multilingue-embedding-002</td><td>768</td></tr>
<tr><td>VoyageAI</td><td>voyage-3-large</td><td>1024</td></tr>
<tr><td>VoyageAI</td><td>voyage-3</td><td>1024</td></tr>
<tr><td>VoyageAI</td><td>voyage-3-lite</td><td>512</td></tr>
<tr><td>VoyageAI</td><td>voyage-code-3</td><td>1024</td></tr>
<tr><td>Cohere</td><td>embed-english-v3.0</td><td>1024</td></tr>
<tr><td>Cohere</td><td>embed-multilingual-v3.0</td><td>1024</td></tr>
<tr><td>Cohere</td><td>embed-english-light-v3.0</td><td>384</td></tr>
<tr><td>Cohere</td><td>embed-multilingue-léger-v3.0</td><td>384</td></tr>
<tr><td>Aliyun Dashscope</td><td>inclusion de texte-v1</td><td>1536</td></tr>
<tr><td>Dashscope d'Aliyun</td><td>texte-embedding-v2</td><td>1536</td></tr>
<tr><td>Dashscope d'Aliyun</td><td>texte-embedding-v3</td><td>1024</td></tr>
<tr><td>Siliconflow</td><td>BAAI/bge-large-zh-v1.5</td><td>1024</td></tr>
<tr><td>Flux de silicium</td><td>BAAI/bge-large-en-v1.5</td><td>1024</td></tr>
<tr><td>Flux de silicium</td><td>netease-youdao/bce-embedding-base_v1</td><td>768</td></tr>
<tr><td>Flux de silicium</td><td>BAAI/bge-m3</td><td>1024</td></tr>
<tr><td>Flux de silicium</td><td>Pro/BAAI/bge-m3</td><td>1024</td></tr>
<tr><td>TEI</td><td>BAAI/bge-base-fr-v1.5</td><td>768</td></tr>
</tbody>
</table>
<h2 id="7-Key-Findings-from-Our-Benchmarking-Results" class="common-anchor-header">7 Principales conclusions de nos résultats d'analyse comparative<button data-href="#7-Key-Findings-from-Our-Benchmarking-Results" class="anchor-icon" translate="no">
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
    </button></h2><p>Nous avons testé les principaux modèles d'intégration en fonction de la taille des lots, de la longueur des jetons et des conditions du réseau, en mesurant la latence médiane dans tous les scénarios. Les résultats révèlent des informations essentielles qui pourraient modifier la façon dont vous choisissez et optimisez les API d'intégration. Jetons un coup d'œil.</p>
<h3 id="1-Global-Network-Effects-Are-More-Significant-Than-You-Think" class="common-anchor-header">1. Les effets de réseau globaux sont plus importants que vous ne le pensez</h3><p>L'environnement réseau est peut-être le facteur le plus important qui affecte les performances des API d'intégration. Le même fournisseur de services d'intégration d'API peut avoir des performances très différentes d'un environnement de réseau à l'autre.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/latency_in_Asia_vs_in_US_cb4b5a425a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Lorsque votre application est déployée en Asie et accède à des services comme OpenAI, Cohere ou VoyageAI déployés en Amérique du Nord, la latence du réseau augmente considérablement. Nos tests en conditions réelles montrent que la latence des appels d'API est universellement multipliée <strong>par 3 ou 4</strong>!</p>
<p>À l'inverse, lorsque votre application est déployée en Amérique du Nord et qu'elle accède à des services asiatiques comme AliCloud Dashscope ou SiliconFlow, la dégradation des performances est encore plus importante. SiliconFlow, en particulier, a montré des augmentations de latence de <strong>près de 100 fois</strong> dans les scénarios interrégionaux !</p>
<p>Cela signifie que vous devez toujours sélectionner les fournisseurs d'intégration en fonction de l'emplacement de votre déploiement et de la géographie de l'utilisateur - les déclarations de performance sans contexte de réseau n'ont pas de sens.</p>
<h3 id="2-Model-Performance-Rankings-Reveal-Surprising-Results" class="common-anchor-header">2. Les classements de performance des modèles révèlent des résultats surprenants</h3><p>Nos tests de latence complets ont révélé des hiérarchies de performances claires :</p>
<ul>
<li><p><strong>Modèles basés en Amérique du Nord (latence médiane)</strong>: Cohere &gt; Google Vertex AI &gt; VoyageAI &gt; OpenAI &gt; AWS Bedrock</p></li>
<li><p><strong>Modèles basés en Asie (latence médiane</strong>) : SiliconFlow &gt; AliCloud Dashscope</p></li>
</ul>
<p>Ces classements remettent en cause les idées reçues sur la sélection des fournisseurs.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/median_latency_with_batch_size_1_ef83bec9c8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/median_latency_with_batch_size_10_0d4e52566f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/all_model_latency_vs_token_length_when_batch_size_is_10_537516cc1c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/all_model_latency_vstoken_lengthwhen_batch_size_is_10_4dcf0d549a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Remarque : en raison de l'impact significatif de l'environnement réseau et des régions géographiques des serveurs sur la latence de l'API d'intégration en temps réel, nous avons comparé séparément les latences des modèles basés en Amérique du Nord et en Asie.</p>
<h3 id="3-Model-Size-Impact-Varies-Dramatically-by-Provider" class="common-anchor-header">3. L'impact de la taille du modèle varie considérablement selon le fournisseur</h3><p>Nous avons observé une tendance générale selon laquelle les modèles plus grands ont une latence plus élevée que les modèles standard, qui ont une latence plus élevée que les modèles plus petits/légers. Cependant, cette tendance n'est pas universelle et révèle des informations importantes sur l'architecture du backend. Par exemple :</p>
<ul>
<li><p><strong>Cohere et OpenAI</strong> ont montré des écarts de performance minimes entre les tailles de modèles</p></li>
<li><p><strong>VoyageAI</strong> présentait des différences de performances évidentes en fonction de la taille du modèle.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Model_Size_Impact_Varies_Dramatically_by_Provider_1_f9eaf2be26.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Model_Size_Impact_Varies_Dramatically_by_Provider_2_cf4d72d1ad.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Model_Size_Impact_Varies_Dramatically_by_Provider_3_5e0c8d890b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Cela indique que le temps de réponse de l'API dépend de plusieurs facteurs au-delà de l'architecture du modèle, y compris les stratégies de mise en lots du backend, l'optimisation du traitement des requêtes et l'infrastructure spécifique du fournisseur. La leçon est claire : <em>ne vous fiez pas à la taille du modèle ou à la date de publication comme indicateurs de performance fiables - testez toujours dans votre propre environnement de déploiement.</em></p>
<h3 id="4-Token-Length-and-Batch-Size-Create-Complex-Trade-offs" class="common-anchor-header">4. La longueur des jetons et la taille des lots créent des compromis complexes</h3><p>En fonction de l'implémentation de votre backend, et en particulier de votre stratégie de mise en lots, la longueur des jetons peut avoir peu d'impact sur la performance. La longueur du jeton peut avoir peu d'impact sur la latence jusqu'à ce que la taille des lots augmente. Nos tests ont révélé des schémas clairs :</p>
<ul>
<li><p><strong>La latence d'OpenAI</strong> est restée relativement cohérente entre les petits et les grands lots, ce qui suggère des capacités de mise en lot généreuses au niveau du backend</p></li>
<li><p><strong>VoyageAI</strong> a montré des effets clairs sur la longueur des jetons, ce qui implique une optimisation minimale du backend pour la mise en lots.</p></li>
</ul>
<p>Des lots plus importants augmentent la latence absolue mais améliorent le débit global. Dans nos tests, le passage de batch=1 à batch=10 a augmenté la latence de 2×-5×, tout en augmentant considérablement le débit total. Il s'agit d'une opportunité d'optimisation critique pour les flux de traitement en masse, où vous pouvez échanger la latence des requêtes individuelles contre une amélioration spectaculaire du débit global du système.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Going_from_batch_1_to_10_latency_increased_2_5_9811536a3c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>En passant de batch=1 à 10, la latence a augmenté de 2×-5×</p>
<h3 id="5-API-Reliability-Introduces-Production-Risk" class="common-anchor-header">5. La fiabilité de l'API introduit un risque de production</h3><p>Nous avons observé une variabilité significative de la latence, en particulier avec OpenAI et VoyageAI, ce qui introduit de l'imprévisibilité dans les systèmes de production.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Latency_variance_when_batch_1_d9cd88fb73.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Variance de la latence lorsque le lot est égal à 1</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Latency_variance_when_batch_10_5efc33bf4e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Variance de latence lorsque le lot est égal à 10</p>
<p>Bien que nos tests se soient principalement concentrés sur la latence, le fait de s'appuyer sur une API externe introduit des risques de défaillance inhérents, notamment les fluctuations du réseau, la limitation du taux du fournisseur et les pannes de service. En l'absence d'accords de niveau de service clairs de la part des fournisseurs, les développeurs doivent mettre en œuvre des stratégies robustes de gestion des erreurs, y compris des tentatives, des délais et des disjoncteurs pour maintenir la fiabilité du système dans les environnements de production.</p>
<h3 id="6-Local-Inference-Can-Be-Surprisingly-Competitive" class="common-anchor-header">6. L'inférence locale peut être étonnamment compétitive</h3><p>Nos tests ont également révélé que le déploiement local de modèles d'intégration de taille moyenne peut offrir des performances comparables à celles des API en nuage - une découverte cruciale pour les applications sensibles au budget ou à la latence.</p>
<p>Par exemple, le déploiement de la source ouverte <code translate="no">bge-base-en-v1.5</code> via TEI (Text Embeddings Inference) sur un modeste processeur 4c8g a égalé les performances de SiliconFlow en matière de latence, offrant ainsi une alternative abordable en matière d'inférence locale. Cette constatation est particulièrement importante pour les développeurs individuels et les petites équipes qui ne disposent pas de ressources GPU de niveau entreprise mais qui ont néanmoins besoin de capacités d'intégration de haute performance.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/TEI_Latency_2f09be1ef0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Latence TEI</p>
<h3 id="7-Milvus-Overhead-Is-Negligible" class="common-anchor-header">7. La surcharge de Milvus est négligeable</h3><p>Puisque nous avons utilisé Milvus pour tester la latence de l'API d'incorporation, nous avons validé que la surcharge supplémentaire introduite par la fonction TextEmbedding de Milvus est minime et pratiquement négligeable. Nos mesures montrent que les opérations Milvus n'ajoutent que 20 à 40 ms au total, alors que les appels à l'API d'intégration prennent des centaines de millisecondes à plusieurs secondes, ce qui signifie que Milvus ajoute moins de 5 % de surcharge à la durée totale de l'opération. Le goulot d'étranglement des performances réside principalement dans la transmission réseau et les capacités de traitement des fournisseurs de services API d'intégration, et non dans la couche serveur de Milvus.</p>
<h2 id="Tips-How-to-Optimize-Your-RAG-Embedding-Performance" class="common-anchor-header">Conseils : Comment optimiser les performances de votre intégration RAG<button data-href="#Tips-How-to-Optimize-Your-RAG-Embedding-Performance" class="anchor-icon" translate="no">
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
    </button></h2><p>Sur la base de nos analyses comparatives, nous recommandons les stratégies suivantes pour optimiser les performances d'intégration de votre système RAG :</p>
<h3 id="1-Always-Localize-Your-Testing" class="common-anchor-header">1. Localisez toujours vos tests</h3><p>Ne vous fiez pas aux rapports de référence génériques (y compris celui-ci !). Vous devez toujours tester les modèles dans votre environnement de déploiement réel plutôt que de vous fier uniquement aux références publiées. Les conditions du réseau, la proximité géographique et les différences d'infrastructure peuvent avoir un impact considérable sur les performances réelles.</p>
<h3 id="2-Geo-Match-Your-Providers-Strategically" class="common-anchor-header">2. Géolocaliser vos fournisseurs de manière stratégique</h3><ul>
<li><p><strong>Pour les déploiements en Amérique du Nord</strong>: Envisagez Cohere, VoyageAI, OpenAI/Azure ou GCP Vertex AI, et procédez toujours à votre propre validation des performances.</p></li>
<li><p><strong>Pour les déploiements en Asie</strong>: Considérez sérieusement les fournisseurs de modèles asiatiques tels que AliCloud Dashscope ou SiliconFlow, qui offrent de meilleures performances régionales.</p></li>
<li><p><strong>Pour les utilisateurs internationaux</strong>: Mettez en œuvre un routage multirégional ou sélectionnez des fournisseurs dont l'infrastructure est distribuée à l'échelle mondiale afin de minimiser les pénalités de latence entre les régions.</p></li>
</ul>
<h3 id="3-Question-Default-Provider-Choices" class="common-anchor-header">3. Remettre en question les choix de fournisseurs par défaut</h3><p>Les modèles d'intégration d'OpenAI sont si populaires que de nombreuses entreprises et développeurs les choisissent par défaut. Cependant, nos tests ont révélé que la latence et la stabilité d'OpenAI étaient au mieux moyennes, malgré sa popularité sur le marché. Remettez en question les hypothèses sur les "meilleurs" fournisseurs avec vos propres critères rigoureux - la popularité ne correspond pas toujours à une performance optimale pour votre cas d'utilisation spécifique.</p>
<h3 id="4-Optimize-Batch-and-Chunk-Configurations" class="common-anchor-header">4. Optimiser les configurations de lots et de morceaux</h3><p>Une configuration unique ne convient pas à tous les modèles ni à tous les cas d'utilisation. La taille optimale des lots et la longueur des morceaux varient considérablement d'un fournisseur à l'autre en raison des différentes architectures de backend et des stratégies de mise en lot. Expérimentez systématiquement avec différentes configurations pour trouver votre point de performance optimal, en tenant compte des compromis entre débit et latence pour les exigences spécifiques de votre application.</p>
<h3 id="5-Implement-Strategic-Caching" class="common-anchor-header">5. Mettre en œuvre une mise en cache stratégique</h3><p>Pour les requêtes très fréquentes, mettez en cache à la fois le texte de la requête et les éléments générés (à l'aide de solutions telles que Redis). Les requêtes identiques ultérieures peuvent directement accéder au cache, ce qui réduit le temps de latence à quelques millisecondes. Il s'agit de l'une des techniques d'optimisation de la latence des requêtes les plus rentables et les plus efficaces.</p>
<h3 id="6-Consider-Local-Inference-Deployment" class="common-anchor-header">6. Envisager le déploiement de l'inférence locale</h3><p>Si vous avez des exigences extrêmement élevées en matière de latence d'ingestion des données, de latence des requêtes et de confidentialité des données, ou si les coûts des appels API sont prohibitifs, envisagez de déployer localement des modèles d'intégration pour l'inférence. Les plans d'API standard sont souvent assortis de limitations de QPS, d'une latence instable et d'un manque de garanties SLA, autant de contraintes qui peuvent être problématiques pour les environnements de production.</p>
<p>Pour de nombreux développeurs individuels ou de petites équipes, l'absence de GPU de qualité professionnelle est un obstacle au déploiement local de modèles d'intégration haute performance. Cependant, cela ne signifie pas qu'il faille abandonner complètement l'inférence locale. Avec des moteurs d'inférence haute performance comme le <a href="https://github.com/huggingface/text-embeddings-inference">text-embeddings-inference de Hugging Face</a>, même l'exécution de modèles d'intégration de petite ou moyenne taille sur un processeur peut atteindre des performances décentes qui peuvent surpasser les appels d'API à forte latence, en particulier pour la génération d'intégration hors ligne à grande échelle.</p>
<p>Cette approche nécessite un examen minutieux des compromis entre le coût, les performances et la complexité de la maintenance.</p>
<h2 id="How-Milvus-Simplifies-Your-Embedding-Workflow" class="common-anchor-header">Comment Milvus simplifie votre flux de travail d'intégration<button data-href="#How-Milvus-Simplifies-Your-Embedding-Workflow" class="anchor-icon" translate="no">
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
    </button></h2><p>Comme indiqué, Milvus n'est pas seulement une base de données vectorielles hautes performances, il offre également une interface de fonction d'incorporation pratique qui s'intègre de manière transparente dans votre pipeline de recherche vectorielle avec les modèles d'incorporation populaires de divers fournisseurs tels que OpenAI, Cohere, AWS Bedrock, Google Vertex AI, Voyage AI et d'autres encore dans le monde entier.</p>
<p>Milvus va au-delà du stockage et de la récupération de vecteurs grâce à des fonctionnalités qui rationalisent l'intégration de l'incorporation :</p>
<ul>
<li><p><strong>Gestion efficace des vecteurs</strong>: En tant que base de données hautes performances conçue pour les collections de vecteurs massives, Milvus offre un stockage fiable, des options d'indexation flexibles (HNSW, IVF, RaBitQ, DiskANN, etc.) et des capacités de récupération rapides et précises.</p></li>
<li><p><strong>Changement de fournisseur rationalisé</strong>: Milvus offre une interface de fonction <code translate="no">TextEmbedding</code>, qui vous permet de configurer la fonction avec vos clés API, de changer instantanément de fournisseur ou de modèle et de mesurer les performances réelles sans intégration SDK complexe.</p></li>
<li><p><strong>Pipelines de données de bout en bout</strong>: Appelez <code translate="no">insert()</code> avec du texte brut et Milvus intègre et stocke automatiquement les vecteurs en une seule opération, ce qui simplifie considérablement le code de votre pipeline de données.</p></li>
<li><p><strong>Du texte aux résultats en un seul appel</strong>: Appelez <code translate="no">search()</code> avec des requêtes de texte et Milvus gère l'incorporation, la recherche et le renvoi des résultats, le tout en un seul appel API.</p></li>
<li><p><strong>Intégration agnostique des fournisseurs</strong>: Milvus fait abstraction des détails de mise en œuvre des fournisseurs ; il vous suffit de configurer votre fonction et votre clé API une fois, et vous êtes prêt à partir.</p></li>
<li><p><strong>Compatibilité avec l'écosystème Open-Source</strong>: Que vous génériez des embeddings via notre fonction <code translate="no">TextEmbedding</code> intégrée, l'inférence locale ou une autre méthode, Milvus fournit des capacités de stockage et d'extraction unifiées.</p></li>
</ul>
<p>Cela crée une expérience rationalisée "Data-In, Insight-Out" où Milvus gère la génération de vecteurs en interne, ce qui rend le code de votre application plus simple et plus facile à maintenir.</p>
<h2 id="Conclusion-The-Performance-Truth-Your-RAG-System-Needs" class="common-anchor-header">Conclusion : La vérité sur les performances dont votre système RAG a besoin<button data-href="#Conclusion-The-Performance-Truth-Your-RAG-System-Needs" class="anchor-icon" translate="no">
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
    </button></h2><p>Le tueur silencieux des performances RAG ne se trouve pas là où la plupart des développeurs le cherchent. Alors que les équipes consacrent des ressources à l'ingénierie rapide et à l'optimisation LLM, l'intégration de la latence de l'API sabote discrètement l'expérience de l'utilisateur avec des retards qui peuvent être 100 fois plus importants que prévu. Nos benchmarks complets exposent la dure réalité : populaire ne signifie pas performant, la géographie compte plus que le choix de l'algorithme dans de nombreux cas, et l'inférence locale l'emporte parfois sur les API cloud coûteuses.</p>
<p>Ces résultats mettent en évidence un point aveugle crucial dans l'optimisation des RAG. Les pénalités de latence entre régions, les classements inattendus des performances des fournisseurs et la compétitivité surprenante de l'inférence locale ne sont pas des cas marginaux, ce sont des réalités de production qui affectent de vraies applications. Il est essentiel de comprendre et de mesurer les performances de l'API d'intégration pour offrir aux utilisateurs des expériences réactives.</p>
<p>Le choix de votre fournisseur d'intégration est une pièce essentielle du puzzle des performances de votre RAG. En testant votre environnement de déploiement réel, en sélectionnant des fournisseurs géographiquement appropriés et en envisageant des alternatives telles que l'inférence locale, vous pouvez éliminer une source majeure de retards pour les utilisateurs et créer des applications d'IA réellement réactives.</p>
<p>Pour plus de détails sur la manière dont nous avons réalisé cette analyse comparative, consultez <a href="https://github.com/zhuwenxing/text-embedding-bench">ce carnet</a>.</p>
