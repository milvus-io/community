---
id: 2022-06-20-Zhentu-the-Photo-Fraud-Detector-Based-on-Milvus.md
title: Zhentu - le détecteur de fraude photographique basé sur Milvus
author: 'Yan Shi, Minwei Tang'
date: 2022-06-20T00:00:00.000Z
desc: >-
  Comment le système de détection de Zhentu est-il construit avec Milvus comme
  moteur de recherche de vecteurs ?
cover: assets.zilliz.com/zhentu_0ae11c98ee.png
tag: Scenarios
tags: Use Cases of Milvus
canonicalUrl: >-
  https://milvus.io/blog/2022-06-20-Zhentu-the-Photo-Fraud-Detector-Based-on-Milvus.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/zhentu_0ae11c98ee.png" alt="cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Image de couverture</span> </span></p>
<blockquote>
<p>Cet article a été rédigé par Yan Shi et Minwei Tang, ingénieurs algorithmes seniors chez BestPay, et traduit par <a href="https://www.linkedin.cn/incareer/in/rosie-zhang-694528149">Rosie Zhang</a>.</p>
</blockquote>
<p>Ces dernières années, alors que le commerce électronique et les transactions en ligne sont devenus monnaie courante dans le monde entier, la fraude au commerce électronique s'est également développée. En utilisant des photos générées par ordinateur au lieu de vraies pour passer la vérification d'identité sur les plateformes commerciales en ligne, les fraudeurs créent de faux comptes en masse et profitent des offres spéciales des entreprises (par exemple, cadeaux d'adhésion, coupons, jetons), ce qui entraîne des pertes irrémédiables pour les consommateurs et les entreprises.</p>
<p>Les méthodes traditionnelles de contrôle des risques ne sont plus efficaces face à une quantité importante de données. Pour résoudre le problème, <a href="https://www.bestpay.com.cn">BestPay</a> a créé un détecteur de fraude photographique, à savoir Zhentu (qui signifie détecter les images en chinois), basé sur les technologies d'apprentissage profond (DL) et de traitement des images numériques (DIP). Zhentu est applicable à divers scénarios impliquant la reconnaissance d'images, dont l'un des débouchés importants est l'identification de fausses licences d'exploitation. Si la photo d'un permis d'exploitation soumise par un utilisateur est très similaire à une autre photo existant déjà dans la photothèque d'une plateforme, il est probable que l'utilisateur ait volé la photo quelque part ou qu'il ait falsifié un permis à des fins frauduleuses.</p>
<p>Les algorithmes traditionnels de mesure de la similarité des images, tels que <a href="https://en.wikipedia.org/wiki/Peak_signal-to-noise_ratio">PSNR</a> et ORB, sont lents et imprécis, et ne s'appliquent qu'aux tâches hors ligne. L'apprentissage profond, en revanche, est capable de traiter des données d'image à grande échelle en temps réel et constitue la méthode ultime pour faire correspondre des images similaires. Grâce aux efforts conjoints de l'équipe R&amp;D de BestPay et de la <a href="https://milvus.io/">communauté Milvus</a>, un système de détection des fraudes photographiques est développé dans le cadre de Zhentu. Il fonctionne en convertissant des quantités massives de données d'images en vecteurs de caractéristiques grâce à des modèles d'apprentissage profond et en les insérant dans <a href="https://milvus.io/">Milvus</a>, un moteur de recherche vectoriel. Grâce à Milvus, le système de détection est capable d'indexer des trillions de vecteurs et de retrouver efficacement des photos similaires parmi des dizaines de millions d'images.</p>
<p><strong>Aller à :</strong></p>
<ul>
<li><a href="#an-overview-of-zhentu">Vue d'ensemble de Zhentu</a></li>
<li><a href="#system-structure">Structure du système</a></li>
<li><a href="#deployment"><strong>Déploiement</strong></a></li>
<li><a href="#real-world-performance"><strong>Performances en conditions réelles</strong></a></li>
<li><a href="#reference"><strong>Référence</strong></a></li>
<li><a href="#about-bestpay"><strong>A propos de BestPay</strong></a></li>
</ul>
<h2 id="An-overview-of-Zhentu" class="common-anchor-header">Une vue d'ensemble de Zhentu<button data-href="#An-overview-of-Zhentu" class="anchor-icon" translate="no">
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
    </button></h2><p>Zhentu est un produit multimédia de contrôle visuel des risques conçu par BestPay et profondément intégré aux technologies d'apprentissage automatique (ML) et de reconnaissance d'images par réseau neuronal. Son algorithme intégré peut identifier avec précision les fraudeurs lors de l'authentification de l'utilisateur et réagir au niveau de la milliseconde. Grâce à sa technologie de pointe et à sa solution innovante, Zhentu a obtenu cinq brevets et deux droits d'auteur sur des logiciels. Il est actuellement utilisé par un certain nombre de banques et d'institutions financières pour aider à identifier les risques potentiels à l'avance.</p>
<h2 id="System-structure" class="common-anchor-header">Structure du système<button data-href="#System-structure" class="anchor-icon" translate="no">
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
    </button></h2><p>BestPay possède actuellement plus de 10 millions de photos de licences d'entreprise, et le volume actuel continue de croître de manière exponentielle au fur et à mesure que l'entreprise se développe. Afin d'extraire rapidement des photos similaires d'une base de données aussi importante, Zhentu a choisi Milvus comme moteur de calcul de la similarité des vecteurs de caractéristiques. La structure générale du système de détection de la fraude photographique est illustrée dans le diagramme ci-dessous.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Structure_of_the_photo_fraud_detection_system_cf5d20d431.png" alt="img" class="doc-image" id="img" />
   </span> <span class="img-wrapper"> <span>img</span> </span></p>
<p>La procédure peut être divisée en quatre étapes :</p>
<ol>
<li><p>Prétraitement de l'image. Le prétraitement, qui comprend la réduction du bruit, l'élimination du bruit et l'amélioration du contraste, garantit à la fois l'intégrité de l'information originale et l'élimination de l'information inutile du signal de l'image.</p></li>
<li><p>Extraction du vecteur de caractéristiques. Un modèle d'apprentissage profond spécialement entraîné est utilisé pour extraire les vecteurs de caractéristiques de l'image. La conversion des images en vecteurs en vue d'une recherche de similarité ultérieure est une opération de routine.</p></li>
<li><p>Normalisation. La normalisation des vecteurs de caractéristiques extraits permet d'améliorer l'efficacité du traitement ultérieur.</p></li>
<li><p>Recherche vectorielle avec Milvus. Insertion des vecteurs caractéristiques normalisés dans la base de données Milvus pour la recherche de similitudes vectorielles.</p></li>
</ol>
<h2 id="Deployment" class="common-anchor-header"><strong>Déploiement</strong><button data-href="#Deployment" class="anchor-icon" translate="no">
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
    </button></h2><p>Voici une brève description du déploiement du système de détection de la fraude photographique de Zhentu.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_architecture_ea45a5ab53.png" alt="Milvus system architecture" class="doc-image" id="milvus-system-architecture" />
   </span> <span class="img-wrapper"> <span>Architecture du système Milvus</span> </span></p>
<p>Nous avons déployé notre <a href="https://milvus.io/docs/v2.0.x/install_cluster-helm.md">cluster Milvus sur Kubernetes</a> pour assurer la haute disponibilité et la synchronisation en temps réel des services cloud. Les étapes générales sont les suivantes :</p>
<ol>
<li><p>Afficher les ressources disponibles. Exécutez la commande <code translate="no">kubectl describe nodes</code> pour voir les ressources que le cluster Kubernetes peut allouer aux cas créés.</p></li>
<li><p>Allouer des ressources. Exécutez la commande <code translate="no">kubect`` -- apply xxx.yaml</code> pour allouer des ressources de mémoire et de CPU aux composants du cluster Milvus à l'aide de Helm.</p></li>
<li><p>Appliquer la nouvelle configuration. Exécuter la commande <code translate="no">helm upgrade my-release milvus/milvus --reuse-values -fresources.yaml</code>.</p></li>
<li><p>Appliquer la nouvelle configuration au cluster Milvus. Le cluster déployé de cette manière nous permet non seulement d'ajuster la capacité du système en fonction des différents besoins de l'entreprise, mais aussi de mieux répondre aux exigences de haute performance pour la recherche massive de données vectorielles.</p></li>
</ol>
<p>Vous pouvez <a href="https://milvus.io/docs/v2.0.x/configure-docker.md">configurer Milvus</a> pour optimiser les performances de recherche pour différents types de données provenant de différents scénarios commerciaux, comme le montrent les deux exemples suivants.</p>
<p>Lors de la <a href="https://milvus.io/docs/v2.0.x/build_index.md">construction de l'index vectoriel</a>, nous paramétrons l'index en fonction du scénario réel du système comme suit :</p>
<pre><code translate="no" class="language-Python">index = {<span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;IVF_PQ&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">2048</span>}, <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>}
<button class="copy-code-btn"></button></code></pre>
<p><a href="https://milvus.io/docs/v2.0.x/index.md#IVF_PQ">IVF_PQ</a> effectue le regroupement de l'index IVF avant de quantifier le produit des vecteurs. Il se caractérise par une grande vitesse d'interrogation des disques et une très faible consommation de mémoire, ce qui répond aux besoins de l'application réelle de Zhentu.</p>
<p>En outre, nous définissons les paramètres de recherche optimaux comme suit :</p>
<pre><code translate="no" class="language-Python">search_params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">32</span>}}
<button class="copy-code-btn"></button></code></pre>
<p>Comme les vecteurs sont déjà normalisés avant d'être introduits dans Milvus, le produit intérieur (PI) est choisi pour calculer la distance entre deux vecteurs. Les expériences ont prouvé que le taux de rappel augmente d'environ 15 % en utilisant le produit intérieur par rapport à la distance euclidienne (L2).</p>
<p>Les exemples ci-dessus montrent que nous pouvons tester et définir les paramètres de Milvus en fonction de différents scénarios commerciaux et exigences de performance.</p>
<p>En outre, Milvus intègre non seulement différentes bibliothèques d'index, mais prend également en charge différents types d'index et méthodes de calcul de la similarité. Milvus fournit également des SDK officiels dans plusieurs langues et des API riches pour l'insertion, l'interrogation, etc., ce qui permet à nos groupes commerciaux frontaux d'utiliser les SDK pour faire appel au centre de contrôle des risques.</p>
<h2 id="Real-world-performance" class="common-anchor-header"><strong>Performances en situation réelle</strong><button data-href="#Real-world-performance" class="anchor-icon" translate="no">
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
    </button></h2><p>Jusqu'à présent, le système de détection des fraudes photographiques a fonctionné régulièrement, aidant les entreprises à identifier les fraudeurs potentiels. En 2021, il a détecté plus de 20 000 faux permis tout au long de l'année. En termes de vitesse d'interrogation, une requête sur un seul vecteur parmi des dizaines de millions de vecteurs prend moins d'une seconde, et le temps moyen d'une requête par lot est inférieur à 0,08 seconde. La recherche haute performance de Milvus répond aux besoins des entreprises en termes de précision et de simultanéité.</p>
<h2 id="Reference" class="common-anchor-header"><strong>Référence</strong><button data-href="#Reference" class="anchor-icon" translate="no">
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
    </button></h2><p>Aglave P, Kolkure V S. Implementation of High Performance Feature Extraction Method Using Oriented Fast and Rotated Brief Algorithm [J]. Int. J. Res. Eng. Technol, 2015, 4 : 394-397.</p>
<h2 id="About-BestPay" class="common-anchor-header"><strong>À propos de BestPay</strong><button data-href="#About-BestPay" class="anchor-icon" translate="no">
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
    </button></h2><p>China Telecom BestPay Co., Ltd est une filiale à 100 % de China Telecom. Elle exerce des activités de paiement et de financement. BestPay s'engage à utiliser des technologies de pointe telles que le big data, l'intelligence artificielle et l'informatique en nuage pour favoriser l'innovation commerciale, en fournissant des produits intelligents, des solutions de contrôle des risques et d'autres services. Jusqu'en janvier 2016, l'application appelée BestPay a attiré plus de 200 millions d'utilisateurs et est devenue le troisième plus grand opérateur de plateforme de paiement en Chine, suivant de près Alipay et WeChat Payment.</p>
