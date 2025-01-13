---
id: >-
  2021-11-26-accelerating-candidate-generation-in-recommender-systems-using-milvus-paired-with-paddlepaddle.md
title: >-
  Accélérer la génération de candidats dans les systèmes de recommandation en
  utilisant Milvus associé à PaddlePaddle
author: Yunmei
date: 2021-11-26T00:00:00.000Z
desc: le flux de travail minimal d'un système de recommandation
cover: assets.zilliz.com/Candidate_generation_9baf7beb86.png
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/accelerating-candidate-generation-in-recommender-systems-using-milvus-paired-with-paddlepaddle
---
<p>Si vous avez déjà développé un système de recommandation, il est probable que vous ayez été victime d'au moins un des problèmes suivants :</p>
<ul>
<li>Le système est extrêmement lent lorsqu'il renvoie des résultats en raison de l'énorme quantité d'ensembles de données.</li>
<li>Les données nouvellement insérées ne peuvent pas être traitées en temps réel pour la recherche ou l'interrogation.</li>
<li>Le déploiement du système de recommandation est décourageant.</li>
</ul>
<p>Cet article vise à aborder les problèmes mentionnés ci-dessus et à vous donner quelques idées en présentant un projet de système de recommandation de produits qui utilise Milvus, une base de données vectorielles open-source, associée à PaddlePaddle, une plateforme d'apprentissage profond.</p>
<p>Cet article décrit brièvement le flux de travail minimal d'un système de recommandation. Il présente ensuite les principaux composants et les détails de la mise en œuvre de ce projet.</p>
<h2 id="The-basic-workflow-of-a-recommender-system" class="common-anchor-header">Le flux de travail de base d'un système de recommandation<button data-href="#The-basic-workflow-of-a-recommender-system" class="anchor-icon" translate="no">
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
    </button></h2><p>Avant d'entrer dans le vif du sujet, examinons d'abord le processus de base d'un système de recommandation. Un système de recommandation peut renvoyer des résultats personnalisés en fonction des intérêts et des besoins uniques de l'utilisateur. Pour faire de telles recommandations personnalisées, le système passe par deux étapes : la génération de candidats et le classement.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_29e27eb9b1.png" alt="2.png" class="doc-image" id="2.png" />
   </span> <span class="img-wrapper"> <span>2.png</span> </span></p>
<p>La première étape est la génération de candidats, qui renvoie les données les plus pertinentes ou similaires, telles qu'un produit ou une vidéo correspondant au profil de l'utilisateur. Lors de la génération de candidats, le système compare les caractéristiques de l'utilisateur avec les données stockées dans sa base de données et extrait les données similaires. Ensuite, lors du classement, le système note et réorganise les données extraites. Enfin, les résultats situés en haut de la liste sont présentés aux utilisateurs.</p>
<p>Dans le cas d'un système de recommandation de produits, il compare d'abord le profil de l'utilisateur avec les caractéristiques des produits en stock afin de filtrer une liste de produits répondant aux besoins de l'utilisateur. Ensuite, le système évalue les produits en fonction de leur similarité avec le profil de l'utilisateur, les classe et renvoie finalement les 10 meilleurs produits à l'utilisateur.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_5850ba2c46.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span></p>
<h2 id="System-architecture" class="common-anchor-header">Architecture du système<button data-href="#System-architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>Le système de recommandation de produits de ce projet utilise trois composants : MIND, PaddleRec et Milvus.</p>
<h3 id="MIND" class="common-anchor-header">MIND</h3><p><a href="https://arxiv.org/pdf/1904.08030">MIND</a>, abréviation de &quot;Multi-Interest Network with Dynamic Routing for Recommendation at Tmall&quot;, est un algorithme développé par le groupe Alibaba. Avant que MIND ne soit proposé, la plupart des modèles d'IA prédominants pour la recommandation utilisaient un seul vecteur pour représenter les intérêts variés d'un utilisateur. Cependant, un vecteur unique est loin d'être suffisant pour représenter les intérêts exacts d'un utilisateur. C'est pourquoi l'algorithme MIND a été proposé pour transformer les intérêts multiples d'un utilisateur en plusieurs vecteurs.</p>
<p>Plus précisément, MIND adopte un <a href="https://arxiv.org/pdf/2005.09347">réseau multi-intérêts</a> avec routage dynamique pour traiter les intérêts multiples d'un utilisateur au cours de la phase de génération des candidats. Le réseau multi-intérêts est une couche d'extracteur multi-intérêts construite sur le mécanisme de routage des capsules. Il peut être utilisé pour combiner les comportements antérieurs d'un utilisateur avec ses intérêts multiples, afin de fournir un profil d'utilisateur précis.</p>
<p>Le diagramme suivant illustre la structure du réseau MIND.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_9e6f284ea2.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<p>Pour représenter les caractéristiques des utilisateurs, MIND prend en compte les comportements et les intérêts des utilisateurs, puis les introduit dans la couche d'intégration pour générer des vecteurs d'utilisateurs, notamment des vecteurs d'intérêts et des vecteurs de comportements. Les vecteurs de comportement de l'utilisateur sont ensuite introduits dans la couche d'extraction des intérêts multiples pour générer des capsules d'intérêt de l'utilisateur. Après avoir concaténé les capsules d'intérêt de l'utilisateur avec les embeddings de comportement de l'utilisateur et utilisé plusieurs couches ReLU pour les transformer, MIND produit plusieurs vecteurs de représentation de l'utilisateur. Ce projet a défini que MIND produira finalement quatre vecteurs de représentation de l'utilisateur.</p>
<p>D'autre part, les caractéristiques des produits passent par la couche d'intégration et sont converties en vecteurs d'articles épars. Ensuite, chaque vecteur d'élément passe par une couche de mise en commun pour devenir un vecteur dense.</p>
<p>Lorsque toutes les données sont converties en vecteurs, une couche d'attention supplémentaire tenant compte des étiquettes est introduite pour guider le processus de formation.</p>
<h3 id="PaddleRec" class="common-anchor-header">PaddleRec</h3><p><a href="https://github.com/PaddlePaddle/PaddleRec/blob/release/2.2.0/README_EN.md">PaddleRec</a> est une bibliothèque de modèles de recherche à grande échelle pour la recommandation. Elle fait partie de l'écosystème Baidu <a href="https://github.com/PaddlePaddle/Paddle">PaddlePaddle</a>. PaddleRec vise à fournir aux développeurs une solution intégrée pour construire un système de recommandation de manière simple et rapide.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_35f7526ea7.png" alt="5.png" class="doc-image" id="5.png" />
   </span> <span class="img-wrapper"> <span>5.png</span> </span></p>
<p>Comme indiqué dans le premier paragraphe, les ingénieurs qui développent des systèmes de recommandation doivent souvent faire face à des difficultés d'utilisation et à un déploiement compliqué du système. Toutefois, PaddleRec peut aider les développeurs dans les domaines suivants :</p>
<ul>
<li><p>Facilité d'utilisation : PaddleRec est une bibliothèque open-source qui encapsule divers modèles populaires dans l'industrie, y compris des modèles pour la génération de candidats, le classement, le reranking, le multitasking, et plus encore. Avec PaddleRec, vous pouvez instantanément tester l'efficacité du modèle et l'améliorer par itération. PaddleRec vous offre un moyen simple de former des modèles pour les systèmes distribués avec d'excellentes performances. Il est optimisé pour le traitement de données à grande échelle de vecteurs épars. Vous pouvez facilement faire évoluer PaddleRec horizontalement et accélérer sa vitesse de calcul. Par conséquent, vous pouvez rapidement construire des environnements de formation sur Kubernetes à l'aide de PaddleRec.</p></li>
<li><p>Support pour le déploiement : PaddleRec fournit des solutions de déploiement en ligne pour ses modèles. Les modèles sont immédiatement prêts à être utilisés après la formation, se caractérisant par leur flexibilité et leur haute disponibilité.</p></li>
</ul>
<h3 id="Milvus" class="common-anchor-header">Milvus</h3><p><a href="https://milvus.io/docs/v2.0.x/overview.md">Milvus</a> est une base de données vectorielle dotée d'une architecture cloud-native. Elle est open source sur <a href="https://github.com/milvus-io">GitHub</a> et peut être utilisée pour stocker, indexer et gérer des vecteurs d'intégration massifs générés par des réseaux neuronaux profonds et d'autres modèles d'apprentissage machine (ML). Milvus encapsule plusieurs bibliothèques de recherche approximative du plus proche voisin (ANN) de première classe, notamment Faiss, NMSLIB et Annoy. Vous pouvez également faire évoluer Milvus en fonction de vos besoins. Le service Milvus est hautement disponible et prend en charge le traitement unifié par lots et par flux. Milvus s'engage à simplifier le processus de gestion des données non structurées et à fournir une expérience utilisateur cohérente dans différents environnements de déploiement. Il présente les caractéristiques suivantes :</p>
<ul>
<li><p>Des performances élevées lors de la recherche vectorielle sur des ensembles de données massifs.</p></li>
<li><p>Une communauté de développeurs qui offre un support multilingue et une chaîne d'outils.</p></li>
<li><p>Évolutivité dans le nuage et grande fiabilité, même en cas d'interruption.</p></li>
<li><p>Recherche hybride obtenue en associant le filtrage scalaire à la recherche de similarité vectorielle.</p></li>
</ul>
<p>Milvus est utilisé pour la recherche de similarité vectorielle et la gestion des vecteurs dans ce projet parce qu'il peut résoudre le problème des mises à jour fréquentes des données tout en maintenant la stabilité du système.</p>
<h2 id="System-implementation" class="common-anchor-header">Mise en œuvre du système<button data-href="#System-implementation" class="anchor-icon" translate="no">
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
    </button></h2><p>Pour construire le système de recommandation de produits de ce projet, vous devez suivre les étapes suivantes :</p>
<ol>
<li>Traitement des données</li>
<li>Entraînement du modèle</li>
<li>Test du modèle</li>
<li>Génération de candidats à l'achat d'un produit<ol>
<li>Stockage des données : les vecteurs d'articles sont obtenus grâce au modèle entraîné et sont stockés dans Milvus.</li>
<li>Recherche de données : quatre vecteurs d'utilisateurs générés par MIND sont introduits dans Milvus pour la recherche de similitudes vectorielles.</li>
<li>Classement des données : chacun des quatre vecteurs a ses propres vecteurs d'éléments similaires <code translate="no">top_k</code>, et quatre ensembles de vecteurs <code translate="no">top_k</code> sont classés pour produire une liste finale des vecteurs les plus similaires <code translate="no">top_k</code>.</li>
</ol></li>
</ol>
<p>Le code source de ce projet est hébergé sur la plateforme <a href="https://aistudio.baidu.com/aistudio/projectdetail/2250360?contributionType=1&amp;shared=1">Baidu AI Studio</a>. La section suivante explique en détail le code source de ce projet.</p>
<h3 id="Step-1-Data-processing" class="common-anchor-header">Étape 1. Traitement des données</h3><p>L'ensemble de données original provient de l'ensemble de données de livres Amazon fourni par <a href="https://github.com/THUDM/ComiRec">ComiRec</a>. Cependant, ce projet utilise les données téléchargées et traitées par PaddleRec. Pour plus d'informations, reportez-vous au <a href="https://github.com/PaddlePaddle/PaddleRec/tree/release/2.1.0/datasets/AmazonBook">jeu de données AmazonBook</a> dans le projet PaddleRec.</p>
<p>L'ensemble de données pour la formation devrait se présenter sous le format suivant, chaque colonne représentant :</p>
<ul>
<li><code translate="no">Uid</code>: l'identifiant de l'utilisateur.</li>
<li><code translate="no">item_id</code>: ID de l'article sur lequel l'utilisateur a cliqué.</li>
<li><code translate="no">Time</code>: L'horodatage ou l'ordre du clic.</li>
</ul>
<p>L'ensemble de données à tester devrait se présenter sous le format suivant, chaque colonne représentant :</p>
<ul>
<li><p><code translate="no">Uid</code>: l'identifiant de l'utilisateur.</p></li>
<li><p><code translate="no">hist_item</code>: l'ID de l'article dans l'historique des clics de l'utilisateur. Lorsqu'il y a plusieurs <code translate="no">hist_item</code>, ils sont triés en fonction de l'horodatage.</p></li>
<li><p><code translate="no">eval_item</code>: La séquence réelle dans laquelle l'utilisateur clique sur les produits.</p></li>
</ul>
<h3 id="Step-2-Model-training" class="common-anchor-header">Étape 2. Formation du modèle</h3><p>La formation du modèle utilise les données traitées à l'étape précédente et adopte le modèle de génération de candidats, MIND, construit sur PaddleRec.</p>
<h4 id="1-Model-input" class="common-anchor-header">1. <strong>Entrée du</strong> <strong>modèle</strong> </h4><p>Dans <code translate="no">dygraph_model.py</code>, exécutez le code suivant pour traiter les données et les transformer en entrée de modèle. Ce processus trie les éléments cliqués par le même utilisateur dans les données d'origine en fonction de l'horodatage et les combine pour former une séquence. Ensuite, un <code translate="no">item``_``id</code> est sélectionné au hasard dans la séquence ( <code translate="no">target_item</code>) et les 10 éléments précédant <code translate="no">target_item</code> sont extraits ( <code translate="no">hist_item</code> ) pour l'entrée du modèle. Si la séquence n'est pas assez longue, elle peut être fixée à 0. <code translate="no">seq_len</code> doit correspondre à la longueur réelle de la séquence <code translate="no">hist_item</code>.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">create_feeds_train</span>(<span class="hljs-params">self, batch_data</span>):
    hist_item = paddle.to_tensor(batch_data[<span class="hljs-number">0</span>], dtype=<span class="hljs-string">&quot;int64&quot;</span>)
    target_item = paddle.to_tensor(batch_data[<span class="hljs-number">1</span>], dtype=<span class="hljs-string">&quot;int64&quot;</span>)
    seq_len = paddle.to_tensor(batch_data[<span class="hljs-number">2</span>], dtype=<span class="hljs-string">&quot;int64&quot;</span>)
    <span class="hljs-keyword">return</span> [hist_item, target_item, seq_len]
<button class="copy-code-btn"></button></code></pre>
<p>Reportez-vous au script <code translate="no">/home/aistudio/recommend/model/mind/mind_reader.py</code> pour le code de lecture de l'ensemble de données original.</p>
<h4 id="2-Model-networking" class="common-anchor-header">2. <strong>Mise en réseau du modèle</strong></h4><p>Le code suivant est un extrait de <code translate="no">net.py</code>. <code translate="no">class Mind_Capsual_Layer</code> définit la couche de l'extracteur d'intérêts multiples construite sur le mécanisme de routage des capsules d'intérêts. La fonction <code translate="no">label_aware_attention()</code> met en œuvre la technique d'attention consciente des étiquettes dans l'algorithme MIND. La fonction <code translate="no">forward()</code> dans <code translate="no">class MindLayer</code> modélise les caractéristiques de l'utilisateur et génère les vecteurs de poids correspondants.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">class</span> <span class="hljs-title class_">Mind_Capsual_Layer</span>(nn.Layer):
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self</span>):
        <span class="hljs-built_in">super</span>(Mind_Capsual_Layer, <span class="hljs-variable language_">self</span>).__init__()
        <span class="hljs-variable language_">self</span>.iters = iters
        <span class="hljs-variable language_">self</span>.input_units = input_units
        <span class="hljs-variable language_">self</span>.output_units = output_units
        <span class="hljs-variable language_">self</span>.maxlen = maxlen
        <span class="hljs-variable language_">self</span>.init_std = init_std
        <span class="hljs-variable language_">self</span>.k_max = k_max
        <span class="hljs-variable language_">self</span>.batch_size = batch_size
        <span class="hljs-comment"># B2I routing</span>
        <span class="hljs-variable language_">self</span>.routing_logits = <span class="hljs-variable language_">self</span>.create_parameter(
            shape=[<span class="hljs-number">1</span>, <span class="hljs-variable language_">self</span>.k_max, <span class="hljs-variable language_">self</span>.maxlen],
            attr=paddle.ParamAttr(
                name=<span class="hljs-string">&quot;routing_logits&quot;</span>, trainable=<span class="hljs-literal">False</span>),
            default_initializer=nn.initializer.Normal(
                mean=<span class="hljs-number">0.0</span>, std=<span class="hljs-variable language_">self</span>.init_std))
        <span class="hljs-comment"># bilinear mapping</span>
        <span class="hljs-variable language_">self</span>.bilinear_mapping_matrix = <span class="hljs-variable language_">self</span>.create_parameter(
            shape=[<span class="hljs-variable language_">self</span>.input_units, <span class="hljs-variable language_">self</span>.output_units],
            attr=paddle.ParamAttr(
                name=<span class="hljs-string">&quot;bilinear_mapping_matrix&quot;</span>, trainable=<span class="hljs-literal">True</span>),
            default_initializer=nn.initializer.Normal(
                mean=<span class="hljs-number">0.0</span>, std=<span class="hljs-variable language_">self</span>.init_std))
                
<span class="hljs-keyword">class</span> <span class="hljs-title class_">MindLayer</span>(nn.Layer):

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">label_aware_attention</span>(<span class="hljs-params">self, keys, query</span>):
        weight = paddle.<span class="hljs-built_in">sum</span>(keys * query, axis=-<span class="hljs-number">1</span>, keepdim=<span class="hljs-literal">True</span>)
        weight = paddle.<span class="hljs-built_in">pow</span>(weight, <span class="hljs-variable language_">self</span>.pow_p)  <span class="hljs-comment"># [x,k_max,1]</span>
        weight = F.softmax(weight, axis=<span class="hljs-number">1</span>)
        output = paddle.<span class="hljs-built_in">sum</span>(keys * weight, axis=<span class="hljs-number">1</span>)
        <span class="hljs-keyword">return</span> output, weight

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">forward</span>(<span class="hljs-params">self, hist_item, seqlen, labels=<span class="hljs-literal">None</span></span>):
        hit_item_emb = <span class="hljs-variable language_">self</span>.item_emb(hist_item)  <span class="hljs-comment"># [B, seqlen, embed_dim]</span>
        user_cap, cap_weights, cap_mask = <span class="hljs-variable language_">self</span>.capsual_layer(hit_item_emb, seqlen)
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> <span class="hljs-variable language_">self</span>.training:
            <span class="hljs-keyword">return</span> user_cap, cap_weights
        target_emb = <span class="hljs-variable language_">self</span>.item_emb(labels)
        user_emb, W = <span class="hljs-variable language_">self</span>.label_aware_attention(user_cap, target_emb)

        <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.sampled_softmax(
            user_emb, labels, <span class="hljs-variable language_">self</span>.item_emb.weight,
            <span class="hljs-variable language_">self</span>.embedding_bias), W, user_cap, cap_weights, cap_mask
<button class="copy-code-btn"></button></code></pre>
<p>Reportez-vous au script <code translate="no">/home/aistudio/recommend/model/mind/net.py</code> pour connaître la structure spécifique du réseau MIND.</p>
<h4 id="3-Model-optimization" class="common-anchor-header">3. <strong>Optimisation du modèle</strong></h4><p>Ce projet utilise l'<a href="https://arxiv.org/pdf/1412.6980">algorithme Adam</a> comme optimiseur de modèle.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">create_optimizer</span>(<span class="hljs-params">self, dy_model, config</span>):
    lr = config.get(<span class="hljs-string">&quot;hyper_parameters.optimizer.learning_rate&quot;</span>, <span class="hljs-number">0.001</span>)
    optimizer = paddle.optimizer.Adam(
        learning_rate=lr, parameters=dy_model.parameters())
    <span class="hljs-keyword">return</span> optimizer
<button class="copy-code-btn"></button></code></pre>
<p>En outre, PaddleRec écrit les hyperparamètres dans <code translate="no">config.yaml</code>, il vous suffit donc de modifier ce fichier pour voir une comparaison claire entre l'efficacité des deux modèles afin d'améliorer l'efficacité du modèle. Lors de l'entraînement du modèle, l'effet médiocre du modèle peut résulter d'un sous-ajustement ou d'un surajustement du modèle. Vous pouvez donc l'améliorer en modifiant le nombre de cycles d'entraînement. Dans ce projet, il vous suffit de modifier le paramètre epochs dans <code translate="no">config.yaml</code> pour trouver le nombre parfait de cycles d'entraînement. En outre, vous pouvez également modifier l'optimiseur de modèle, <code translate="no">optimizer.class</code>,ou <code translate="no">learning_rate</code> pour le débogage. Ce qui suit montre une partie des paramètres dans <code translate="no">config.yaml</code>.</p>
<pre><code translate="no" class="language-YAML">runner:
  use_gpu: <span class="hljs-literal">True</span>
  use_auc: <span class="hljs-literal">False</span>
  train_batch_size: <span class="hljs-number">128</span>
  epochs: <span class="hljs-number">20</span>
  print_interval: <span class="hljs-number">10</span>
  model_save_path: <span class="hljs-string">&quot;output_model_mind&quot;</span>

<span class="hljs-comment"># hyper parameters of user-defined network</span>
hyper_parameters:
  <span class="hljs-comment"># optimizer config</span>
  optimizer:
    <span class="hljs-keyword">class</span>: Adam
    learning_rate: <span class="hljs-number">0.005</span>
<button class="copy-code-btn"></button></code></pre>
<p>Reportez-vous au script <code translate="no">/home/aistudio/recommend/model/mind/dygraph_model.py</code> pour une mise en œuvre détaillée.</p>
<h4 id="4-Model-training" class="common-anchor-header">4. <strong>Entraînement du modèle</strong></h4><p>Exécutez la commande suivante pour démarrer l'apprentissage du modèle.</p>
<pre><code translate="no" class="language-Bash">python -u trainer.py -m mind/config.yaml
<button class="copy-code-btn"></button></code></pre>
<p>Reportez-vous à <code translate="no">/home/aistudio/recommend/model/trainer.py</code> pour le projet de formation au modèle.</p>
<h3 id="Step-3-Model-testing" class="common-anchor-header">Étape 3. Test du modèle</h3><p>Cette étape utilise un ensemble de données de test pour vérifier les performances, telles que le taux de rappel du modèle formé.</p>
<p>Pendant le test du modèle, tous les vecteurs d'éléments sont chargés à partir du modèle, puis importés dans Milvus, la base de données vectorielle open-source. Lisez l'ensemble de données de test à l'aide du script <code translate="no">/home/aistudio/recommend/model/mind/mind_infer_reader.py</code>. Charger le modèle à l'étape précédente et introduire l'ensemble de données de test dans le modèle pour obtenir quatre vecteurs d'intérêt de l'utilisateur. Recherchez les 50 vecteurs d'éléments les plus similaires aux quatre vecteurs d'intérêt dans Milvus. Vous pouvez recommander les résultats obtenus aux utilisateurs.</p>
<p>Exécutez la commande suivante pour tester le modèle.</p>
<pre><code translate="no" class="language-Bash">python -u infer.py -m mind/config.yaml -top_n 50
<button class="copy-code-btn"></button></code></pre>
<p>Pendant le test du modèle, le système fournit plusieurs indicateurs pour évaluer l'efficacité du modèle, tels que Recall@50, NDCG@50 et HitRate@50. Cet article ne présente que la modification d'un seul paramètre. Cependant, dans votre propre scénario d'application, vous devez former plus d'époques pour améliorer l'effet du modèle.  Vous pouvez également améliorer l'efficacité du modèle en utilisant différents optimiseurs, en définissant différents taux d'apprentissage et en augmentant le nombre de cycles de test. Il est recommandé d'enregistrer plusieurs modèles avec des effets différents, puis de choisir celui qui présente les meilleures performances et qui correspond le mieux à votre application.</p>
<h3 id="Step-4-Generating-product-item-candidates" class="common-anchor-header">Étape 4. Générer des produits candidats</h3><p>Pour construire le service de génération de candidats produits, ce projet utilise le modèle entraîné dans les étapes précédentes, associé à Milvus. Pendant la génération des candidats, FASTAPI est utilisé pour fournir l'interface. Lorsque le service démarre, vous pouvez directement exécuter des commandes dans le terminal via <code translate="no">curl</code>.</p>
<p>Exécutez la commande suivante pour générer des candidats préliminaires.</p>
<pre><code translate="no" class="language-Bash">uvicorn main:app
<button class="copy-code-btn"></button></code></pre>
<p>Le service fournit quatre types d'interfaces :</p>
<ul>
<li><strong>Insérer</strong>: Exécutez la commande suivante pour lire les vecteurs d'éléments de votre modèle et les insérer dans une collection dans Milvus.</li>
</ul>
<pre><code translate="no" class="language-Nginx">curl -X <span class="hljs-string">&#x27;POST&#x27;</span> \
  <span class="hljs-string">&#x27;http://127.0.0.1:8000/rec/insert_data&#x27;</span> \
  -H <span class="hljs-string">&#x27;accept: application/json&#x27;</span> \
  -d <span class="hljs-string">&#x27;&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Générer des candidats préliminaires</strong>: Saisissez l'ordre dans lequel les produits sont cliqués par l'utilisateur et découvrez le produit suivant sur lequel l'utilisateur peut cliquer. Vous pouvez également générer des produits candidats par lots pour plusieurs utilisateurs à la fois. <code translate="no">hist_item</code> dans la commande suivante est un vecteur à deux dimensions, et chaque ligne représente une séquence de produits sur lesquels l'utilisateur a cliqué dans le passé. Vous pouvez définir la longueur de la séquence. Les résultats renvoyés sont également des ensembles de vecteurs bidimensionnels, chaque ligne représentant les <code translate="no">item id</code>s renvoyés pour les utilisateurs.</li>
</ul>
<pre><code translate="no" class="language-Ada">curl -X <span class="hljs-string">&#x27;POST&#x27;</span> \
  <span class="hljs-string">&#x27;http://127.0.0.1:8000/rec/recall&#x27;</span> \
  -H <span class="hljs-string">&#x27;accept: application/json&#x27;</span> \
  -H <span class="hljs-string">&#x27;Content-Type: application/json&#x27;</span> \
  -d <span class="hljs-string">&#x27;{
  &quot;top_k&quot;: 50,
  &quot;hist_item&quot;: [[43,23,65,675,3456,8654,123454,54367,234561],[675,3456,8654,123454,76543,1234,9769,5670,65443,123098,34219,234098]]
}&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Demander le nombre total d'</strong> <strong>articles de produits</strong>: Exécutez la commande suivante pour obtenir le nombre total de vecteurs d'articles stockés dans la base de données Milvus.</li>
</ul>
<pre><code translate="no" class="language-Nginx">curl -X <span class="hljs-string">&#x27;POST&#x27;</span> \
  <span class="hljs-string">&#x27;http://127.0.0.1:8000/rec/count&#x27;</span> \
  -H <span class="hljs-string">&#x27;accept: application/json&#x27;</span> \
  -d <span class="hljs-string">&#x27;&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Supprimer</strong>: Exécutez la commande suivante pour supprimer toutes les données stockées dans la base de données Milvus.</li>
</ul>
<pre><code translate="no" class="language-Nginx">curl -X <span class="hljs-string">&#x27;POST&#x27;</span> \
  <span class="hljs-string">&#x27;http://127.0.0.1:8000/qa/drop&#x27;</span> \
  -H <span class="hljs-string">&#x27;accept: application/json&#x27;</span> \
  -d <span class="hljs-string">&#x27;&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Si vous exécutez le service de génération de candidats sur votre serveur local, vous pouvez également accéder aux interfaces ci-dessus à l'adresse <code translate="no">127.0.0.1:8000/docs</code>. Vous pouvez jouer en cliquant sur les quatre interfaces et en saisissant la valeur des paramètres. Cliquez ensuite sur "Essayer" pour obtenir le résultat de la recommandation.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_43e41086f8.png" alt="6.png" class="doc-image" id="6.png" />
   </span> <span class="img-wrapper"> <span>6.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_f016a3221d.png" alt="7.png" class="doc-image" id="7.png" />
   </span> <span class="img-wrapper"> <span>7.png</span> </span></p>
<h2 id="Recap" class="common-anchor-header">Récapitulatif<button data-href="#Recap" class="anchor-icon" translate="no">
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
    </button></h2><p>Cet article se concentre principalement sur la première étape de la génération de candidats dans la construction d'un système de recommandation. Il fournit également une solution pour accélérer ce processus en combinant Milvus avec l'algorithme MIND et PaddleRec et a donc abordé la question proposée dans le paragraphe d'ouverture.</p>
<p>Que se passe-t-il si le système est extrêmement lent lorsqu'il renvoie des résultats en raison de l'énorme quantité d'ensembles de données ? Milvus, la base de données vectorielles open-source, est conçue pour une recherche de similarités ultra-rapide sur des ensembles de données vectorielles denses contenant des millions, des milliards, voire des trillions de vecteurs.</p>
<p>Que se passe-t-il si les données nouvellement insérées ne peuvent pas être traitées en temps réel pour la recherche ou l'interrogation ? Vous pouvez utiliser Milvus car il prend en charge le traitement unifié par lots et par flux et vous permet de rechercher et d'interroger les données nouvellement insérées en temps réel. En outre, le modèle MIND est capable de convertir le nouveau comportement de l'utilisateur en temps réel et d'insérer les vecteurs de l'utilisateur dans Milvus instantanément.</p>
<p>Et si le déploiement compliqué est trop intimidant ? PaddleRec, une bibliothèque puissante qui appartient à l'écosystème PaddlePaddle, peut vous fournir une solution intégrée pour déployer votre système de recommandation ou d'autres applications de manière simple et rapide.</p>
<h2 id="About-the-author" class="common-anchor-header">A propos de l'auteur<button data-href="#About-the-author" class="anchor-icon" translate="no">
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
    </button></h2><p>Yunmei Li, ingénieur de données chez Zilliz, est diplômée en informatique de l'Université des sciences et technologies de Huazhong. Depuis qu'elle a rejoint Zilliz, elle travaille à l'exploration de solutions pour le projet open source Milvus et aide les utilisateurs à appliquer Milvus dans des scénarios réels. Elle se concentre principalement sur le NLP et les systèmes de recommandation, et elle aimerait approfondir ses connaissances dans ces deux domaines. Elle aime passer du temps seule et lire.</p>
<h2 id="Looking-for-more-resources" class="common-anchor-header">Vous cherchez d'autres ressources ?<button data-href="#Looking-for-more-resources" class="anchor-icon" translate="no">
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
<li>Plus de cas d'utilisation sur la construction d'un système de recommandation :<ul>
<li><a href="https://milvus.io/blog/building-a-personalized-product-recommender-system-with-vipshop-and-milvus.md">Construire un système de recommandation de produits personnalisé avec Vipshop avec Milvus</a></li>
<li><a href="https://milvus.io/blog/building-a-wardrobe-and-outfit-planning-app-with-milvus.md">Création d'une application de planification de garde-robe et de tenues avec Milvus</a></li>
<li><a href="https://milvus.io/blog/building-an-intelligent-news-recommendation-system-inside-sohu-news-app.md">Création d'un système intelligent de recommandation de nouvelles dans l'application Sohu News</a></li>
<li><a href="https://milvus.io/blog/music-recommender-system-item-based-collaborative-filtering-milvus.md">Filtrage collaboratif basé sur les éléments pour un système de recommandation musicale</a></li>
<li><a href="https://milvus.io/blog/Making-with-Milvus-AI-Powered-News-Recommendation-Inside-Xiaomi-Mobile-Browser.md">Réaliser avec Milvus : Recommandation de nouvelles alimentée par l'IA dans le navigateur mobile de Xiaomi</a></li>
</ul></li>
<li>Autres projets Milvus en collaboration avec d'autres communautés :<ul>
<li><a href="https://milvus.io/blog/2021-09-26-onnx.md">Combiner des modèles d'IA pour la recherche d'images en utilisant ONNX et Milvus</a></li>
<li><a href="https://milvus.io/blog/graph-based-recommendation-system-with-milvus.md">Construction d'un système de recommandation basé sur les graphes avec les ensembles de données Milvus, PinSage, DGL et Movielens</a></li>
<li><a href="https://milvus.io/blog/building-a-milvus-cluster-based-on-juicefs.md">Construction d'un cluster Milvus basé sur JuiceFS</a></li>
</ul></li>
<li>Participez à notre communauté open-source :<ul>
<li>Trouvez ou contribuez à Milvus sur <a href="https://bit.ly/307b7jC">GitHub</a></li>
<li>Interagir avec la communauté via le <a href="https://bit.ly/3qiyTEk">Forum</a></li>
<li>Connectez-vous avec nous sur <a href="https://bit.ly/3ob7kd8">Twitter</a></li>
</ul></li>
</ul>
