---
id: audio-retrieval-based-on-milvus.md
title: Technologies de traitement
author: Shiyu Chen
date: 2021-07-27T03:05:57.524Z
desc: >-
  L'extraction audio avec Milvus permet de classer et d'analyser les données
  sonores en temps réel.
cover: assets.zilliz.com/blog_audio_search_56b990cee5.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/audio-retrieval-based-on-milvus'
---
<custom-h1>Extraction audio basée sur Milvus</custom-h1><p>Le son est un type de données dense en informations. Bien qu'il puisse sembler désuet à l'ère du contenu vidéo, l'audio reste une source d'information primaire pour de nombreuses personnes. Malgré un déclin à long terme du nombre d'auditeurs, 83 % des Américains âgés de 12 ans ou plus ont écouté la radio terrestre (AM/FM) au cours d'une semaine donnée en 2020 (contre 89 % en 2019). À l'inverse, l'audio en ligne a connu une augmentation constante du nombre d'auditeurs au cours des deux dernières décennies, 62 % des Américains déclarant en écouter une forme ou une autre sur une base hebdomadaire, selon la même <a href="https://www.journalism.org/fact-sheet/audio-and-podcasting/">étude du Pew Research Center</a>.</p>
<p>En tant qu'onde, le son comprend quatre propriétés : la fréquence, l'amplitude, la forme de l'onde et la durée. Dans la terminologie musicale, ces propriétés sont appelées hauteur, dynamique, ton et durée. Les sons aident également les humains et les autres animaux à percevoir et à comprendre notre environnement, en fournissant des indices contextuels sur l'emplacement et le mouvement des objets qui nous entourent.</p>
<p>En tant que vecteur d'information, le son peut être classé en trois catégories :</p>
<ol>
<li><strong>La parole :</strong> Un moyen de communication composé de mots et de grammaire. Les algorithmes de reconnaissance vocale permettent de convertir la parole en texte.</li>
<li><strong>La musique :</strong> Sons vocaux et/ou instrumentaux combinés pour produire une composition composée de mélodie, d'harmonie, de rythme et de timbre. La musique peut être représentée par une partition.</li>
<li><strong>Forme d'onde :</strong> Signal audio numérique obtenu par numérisation de sons analogiques. Les formes d'onde peuvent représenter la parole, la musique et les sons naturels ou synthétisés.</li>
</ol>
<p>La recherche audio peut être utilisée pour rechercher et surveiller les médias en ligne en temps réel afin de réprimer les violations des droits de propriété intellectuelle. Elle joue également un rôle important dans la classification et l'analyse statistique des données audio.</p>
<h2 id="Processing-Technologies" class="common-anchor-header">Technologies de traitement<button data-href="#Processing-Technologies" class="anchor-icon" translate="no">
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
    </button></h2><p>La parole, la musique et les autres sons génériques ont chacun des caractéristiques uniques et nécessitent des méthodes de traitement différentes. En règle générale, les données audio sont séparées en groupes contenant de la parole et en groupes n'en contenant pas :</p>
<ul>
<li>Les sons vocaux sont traités par la reconnaissance automatique de la parole.</li>
<li>Les sons non vocaux, y compris les sons musicaux, les effets sonores et les signaux vocaux numérisés, sont traités à l'aide de systèmes de recherche audio.</li>
</ul>
<p>Cet article explique comment utiliser un système de recherche audio pour traiter des données audio non vocales. La reconnaissance vocale n'est pas abordée dans cet article</p>
<h3 id="Audio-feature-extraction" class="common-anchor-header">Extraction de caractéristiques audio</h3><p>L'extraction de caractéristiques est la technologie la plus importante dans les systèmes de recherche audio, car elle permet la recherche de similarités audio. Les méthodes d'extraction des caractéristiques audio sont divisées en deux catégories :</p>
<ul>
<li>Les modèles traditionnels d'extraction de caractéristiques audio tels que les modèles de mélange gaussien (GMM) et les modèles de Markov cachés (HMM) ;</li>
<li>Les modèles d'extraction de caractéristiques audio basés sur l'apprentissage profond, tels que les réseaux neuronaux récurrents (RNN), les réseaux de mémoire à long terme (LSTM), les cadres d'encodage-décodage, les mécanismes d'attention, etc.</li>
</ul>
<p>Les modèles basés sur l'apprentissage profond ont un taux d'erreur inférieur d'un ordre de grandeur à celui des modèles traditionnels, et gagnent donc en importance en tant que technologie de base dans le domaine du traitement des signaux audio.</p>
<p>Les données audio sont généralement représentées par les caractéristiques audio extraites. Le processus d'extraction recherche et compare ces caractéristiques et attributs plutôt que les données audio elles-mêmes. Par conséquent, l'efficacité de la recherche de similarités audio dépend largement de la qualité de l'extraction des caractéristiques.</p>
<p>Dans cet article, les <a href="https://github.com/qiuqiangkong/audioset_tagging_cnn">réseaux neuronaux audio pré-entraînés à grande échelle pour la reconnaissance des formes audio (PANN)</a> sont utilisés pour extraire les vecteurs de caractéristiques pour sa précision moyenne (mAP) de 0,439 (Hershey et al., 2017).</p>
<p>Après avoir extrait les vecteurs de caractéristiques des données audio, nous pouvons mettre en œuvre une analyse de vecteurs de caractéristiques haute performance à l'aide de Milvus.</p>
<h3 id="Vector-similarity-search" class="common-anchor-header">Recherche de similarité vectorielle</h3><p><a href="https://milvus.io/">Milvus</a> est une base de données vectorielles open-source native dans le cloud, construite pour gérer les vecteurs d'intégration générés par des modèles d'apprentissage automatique et des réseaux neuronaux. Elle est largement utilisée dans des scénarios tels que la vision artificielle, le traitement du langage naturel, la chimie informatique, les systèmes de recommandation personnalisés, etc.</p>
<p>Le diagramme suivant illustre le processus général de recherche de similarités à l'aide de Milvus : <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_does_milvus_work_6926180543.png" alt="how-does-milvus-work.png" class="doc-image" id="how-does-milvus-work.png" /><span>how-does-milvus-work.png</span> </span></p>
<ol>
<li>Les données non structurées sont converties en vecteurs de caractéristiques par des modèles d'apprentissage profond et insérées dans Milvus.</li>
<li>Milvus stocke et indexe ces vecteurs de caractéristiques.</li>
<li>Sur demande, Milvus recherche et renvoie les vecteurs les plus similaires au vecteur de la requête.</li>
</ol>
<h2 id="System-overview" class="common-anchor-header">Vue d'ensemble du système<button data-href="#System-overview" class="anchor-icon" translate="no">
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
    </button></h2><p>Le système de recherche audio se compose principalement de deux parties : l'insertion (ligne noire) et la recherche (ligne rouge).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/audio_retrieval_system_663a911c95.png" alt="audio-retrieval-system.png" class="doc-image" id="audio-retrieval-system.png" />
   </span> <span class="img-wrapper"> <span>audio-retrieval-system.png</span> </span></p>
<p>L'échantillon de données utilisé dans ce projet contient des sons de jeux open-source, et le code est détaillé dans le <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/audio_similarity_search">bootcamp Milvus</a>.</p>
<h3 id="Step-1-Insert-data" class="common-anchor-header">Étape 1 : Insérer des données</h3><p>Vous trouverez ci-dessous un exemple de code permettant de générer des embeddings audio à l'aide du modèle d'inférence PANNs pré-entraîné et de les insérer dans Milvus, qui attribue un ID unique à chaque embedding vectoriel.</p>
<pre><code translate="no"><span class="hljs-number">1</span> wav_name, vectors_audio = get_audio_embedding(audio_path)  
<span class="hljs-number">2</span> <span class="hljs-keyword">if</span> vectors_audio:    
<span class="hljs-number">3</span>     embeddings.<span class="hljs-built_in">append</span>(vectors_audio)  
<span class="hljs-number">4</span>     wav_names.<span class="hljs-built_in">append</span>(wav_name)  
<span class="hljs-number">5</span> ids_milvus = insert_vectors(milvus_client, table_name, embeddings)  
<span class="hljs-number">6</span> 
<button class="copy-code-btn"></button></code></pre>
<p>Les <strong>ids_milvus</strong> renvoyés sont ensuite stockés avec d'autres informations pertinentes (par exemple, <strong>wav_name</strong>) pour les données audio conservées dans une base de données MySQL en vue d'un traitement ultérieur.</p>
<pre><code translate="no">1 get_ids_correlation(ids_milvus, wav_name)  
2 load_data_to_mysql(conn, cursor, table_name)    
3  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Audio-search" class="common-anchor-header">Étape 2 : Recherche audio</h3><p>Milvus calcule la distance du produit intérieur entre les vecteurs de caractéristiques préenregistrés et les vecteurs de caractéristiques d'entrée, extraits des données audio de la requête à l'aide du modèle d'inférence PANNs, et renvoie les <strong>ids_milvus</strong> des vecteurs de caractéristiques similaires, qui correspondent aux données audio recherchées.</p>
<pre><code translate="no"><span class="hljs-number">1</span> _, vectors_audio = get_audio_embedding(audio_filename)    
<span class="hljs-number">2</span> results = search_vectors(milvus_client, table_name, [vectors_audio], METRIC_TYPE, TOP_K)  
<span class="hljs-number">3</span> ids_milvus = [x.<span class="hljs-built_in">id</span> <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]]  
<span class="hljs-number">4</span> audio_name = search_by_milvus_ids(conn, cursor, ids_milvus, table_name)    
<span class="hljs-number">5</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="API-reference-and-demo" class="common-anchor-header">Référence API et démo<button data-href="#API-reference-and-demo" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="API" class="common-anchor-header">API</h3><p>Ce système de recherche audio est construit à partir d'un code source ouvert. Ses principales fonctionnalités sont l'insertion et la suppression de données audio. Toutes les API peuvent être consultées en tapant <strong>127.0.0.1 :<port></strong> /docs dans le navigateur.</p>
<h3 id="Demo" class="common-anchor-header">Démonstration</h3><p>Nous hébergeons une <a href="https://zilliz.com/solutions">démo en</a> ligne du système de recherche audio basé sur Milvus que vous pouvez essayer avec vos propres données audio.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/audio_search_demo_cae60625db.png" alt="audio-search-demo.png" class="doc-image" id="audio-search-demo.png" />
   </span> <span class="img-wrapper"> <span>audio-search-demo.png</span> </span></p>
<h2 id="Conclusion" class="common-anchor-header">Conclusion<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>À l'ère du big data, les gens découvrent que leur vie regorge de toutes sortes d'informations. Pour en tirer le meilleur parti, la recherche de texte traditionnelle ne suffit plus. Aujourd'hui, la technologie de recherche d'informations a un besoin urgent de récupérer différents types de données non structurées, telles que les vidéos, les images et les sons.</p>
<p>Les données non structurées, difficiles à traiter par les ordinateurs, peuvent être converties en vecteurs de caractéristiques à l'aide de modèles d'apprentissage profond. Ces données converties peuvent facilement être traitées par des machines, ce qui nous permet d'analyser des données non structurées comme nos prédécesseurs n'ont jamais pu le faire. Milvus, une base de données vectorielle open-source, peut traiter efficacement les vecteurs caractéristiques extraits par les modèles d'IA et fournit une variété de calculs de similarité vectorielle courants.</p>
<h2 id="References" class="common-anchor-header">Références<button data-href="#References" class="anchor-icon" translate="no">
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
    </button></h2><p>Hershey, S., Chaudhuri, S., Ellis, D.P., Gemmeke, J.F., Jansen, A., Moore, R.C., Plakal, M., Platt, D., Saurous, R.A., Seybold, B. et Slaney, M., 2017, mars. CNN architectures for large-scale audio classification. In 2017 IEEE International Conference on Acoustics, Speech and Signal Processing (ICASSP), pp. 131-135, 2017</p>
<h2 id="Dont-be-a-stranger" class="common-anchor-header">Ne soyez pas un inconnu<button data-href="#Dont-be-a-stranger" class="anchor-icon" translate="no">
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
<li><p>Trouvez ou contribuez à Milvus sur <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</p></li>
<li><p>Interagissez avec la communauté via <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</p></li>
<li><p>Connectez-vous avec nous sur <a href="https://twitter.com/milvusio">Twitter</a>.</p></li>
</ul>
