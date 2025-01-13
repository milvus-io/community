---
id: 2021-10-10-milvus-helps-analyze-videos.md
title: Détection d'objets
author: Shiyu Chen
date: 2021-10-11T00:00:00.000Z
desc: Découvrez comment Milvus permet l'analyse des contenus vidéo par l'IA.
cover: assets.zilliz.com/Who_is_it_e9d4510ace.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/milvus-helps-analyze-videos-intelligently'
---
<custom-h1>Construction d'un système d'analyse vidéo avec la base de données vectorielle Milvus</custom-h1><p><em>Shiyu Chen, ingénieur en données chez Zilliz, est diplômée en informatique de l'université de Xidian. Depuis qu'elle a rejoint Zilliz, elle a exploré des solutions pour Milvus dans divers domaines, tels que l'analyse audio et vidéo, la recherche de formules moléculaires, etc., ce qui a considérablement enrichi les scénarios d'application de la communauté. Elle explore actuellement d'autres solutions intéressantes. Pendant son temps libre, elle aime le sport et la lecture.</em></p>
<p>En regardant <em>Free Guy</em> le week-end dernier, j'ai eu l'impression d'avoir déjà vu l'acteur qui joue Buddy, l'agent de sécurité, quelque part, mais je ne me souvenais d'aucune de ses œuvres. J'avais la tête pleine de "qui est ce type ?". J'étais sûr d'avoir vu ce visage et j'essayais tant bien que mal de me souvenir de son nom. De même, j'ai vu une fois l'acteur principal d'une vidéo boire une boisson que j'aimais beaucoup, mais je n'ai pas réussi à me souvenir du nom de la marque.</p>
<p>La réponse était sur le bout de ma langue, mais mon cerveau était complètement bloqué.</p>
<p>Le phénomène du bout de la langue (TOT) me rend fou lorsque je regarde des films. Si seulement il existait un moteur de recherche d'images inversées pour les vidéos qui me permette de trouver des vidéos et d'analyser leur contenu. Auparavant, j'avais construit un <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/reverse_image_search/quick_deploy">moteur de recherche d'images inversées à l'aide de Milvus</a>. Étant donné que l'analyse de contenu vidéo ressemble quelque peu à l'analyse d'images, j'ai décidé de construire un moteur d'analyse de contenu vidéo basé sur Milvus.</p>
<h2 id="Object-detection" class="common-anchor-header">Détection d'objets<button data-href="#Object-detection" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Overview" class="common-anchor-header">Vue d'ensemble</h3><p>Avant d'être analysés, les objets d'une vidéo doivent d'abord être détectés. La détection efficace et précise d'objets dans une vidéo est le principal défi de la tâche. Il s'agit également d'une tâche importante pour des applications telles que le pilotage automatique, les dispositifs portables et l'IdO.</p>
<p>Développés à partir d'algorithmes de traitement d'image traditionnels vers des réseaux neuronaux profonds (DNN), les modèles courants actuels pour la détection d'objets incluent R-CNN, FRCNN, SSD et YOLO. Le système d'analyse vidéo par apprentissage profond basé sur Milvus présenté dans ce sujet peut détecter des objets de manière intelligente et rapide.</p>
<h3 id="Implementation" class="common-anchor-header">Mise en œuvre</h3><p>Pour détecter et reconnaître des objets dans une vidéo, le système doit d'abord extraire des images d'une vidéo et détecter des objets dans les images à l'aide de la détection d'objets, puis extraire des vecteurs de caractéristiques des objets détectés et, enfin, analyser l'objet en fonction des vecteurs de caractéristiques.</p>
<ul>
<li>Extraction d'images</li>
</ul>
<p>L'analyse vidéo est convertie en analyse d'images grâce à l'extraction de trames. Actuellement, la technologie d'extraction d'images est très mature. Des programmes tels que FFmpeg et OpenCV permettent d'extraire des images à des intervalles spécifiques. Cet article explique comment extraire des images d'une vidéo toutes les secondes à l'aide d'OpenCV.</p>
<ul>
<li>Détection d'objets</li>
</ul>
<p>La détection d'objets consiste à trouver des objets dans les images extraites et à extraire des captures d'écran des objets en fonction de leur position. Comme le montrent les figures suivantes, un vélo, un chien et une voiture ont été détectés. Cette rubrique explique comment détecter des objets à l'aide de YOLOv3, qui est couramment utilisé pour la détection d'objets.</p>
<ul>
<li>Extraction de caractéristiques</li>
</ul>
<p>L'extraction de caractéristiques consiste à convertir des données non structurées, difficiles à reconnaître par les machines, en vecteurs de caractéristiques. Par exemple, les images peuvent être converties en vecteurs de caractéristiques multidimensionnelles à l'aide de modèles d'apprentissage profond. Actuellement, les modèles d'IA de reconnaissance d'images les plus populaires comprennent VGG, GNN et ResNet. Cette rubrique explique comment extraire les caractéristiques des objets détectés à l'aide de ResNet-50.</p>
<ul>
<li>Analyse des vecteurs</li>
</ul>
<p>Les vecteurs de caractéristiques extraits sont comparés aux vecteurs de la bibliothèque et les informations correspondant aux vecteurs les plus similaires sont renvoyées. Pour les ensembles de données de vecteurs de caractéristiques à grande échelle, le calcul est un énorme défi. Cette rubrique explique comment analyser les vecteurs de caractéristiques à l'aide de Milvus.</p>
<h2 id="Key-technologies" class="common-anchor-header">Technologies clés<button data-href="#Key-technologies" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="OpenCV" class="common-anchor-header">OpenCV</h3><p>Open Source Computer Vision Library (OpenCV) est une bibliothèque de vision par ordinateur multiplateforme qui fournit de nombreux algorithmes universels pour le traitement d'images et la vision par ordinateur. OpenCV est couramment utilisé dans le domaine de la vision par ordinateur.</p>
<p>L'exemple suivant montre comment capturer des images vidéo à des intervalles spécifiés et les enregistrer en tant qu'images à l'aide d'OpenCV et de Python.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> cv2 
<span class="hljs-built_in">cap</span> = cv2.VideoCapture(file_path)   
framerate = <span class="hljs-built_in">cap</span>.get(cv2.CAP_PROP_FPS)   
allframes = <span class="hljs-type">int</span>(cv2.VideoCapture.get(<span class="hljs-built_in">cap</span>, <span class="hljs-type">int</span>(cv2.CAP_PROP_FRAME_COUNT)))  
success, image = <span class="hljs-built_in">cap</span>.read() 
cv2.imwrite(file_name, image)
<button class="copy-code-btn"></button></code></pre>
<h3 id="YOLOv3" class="common-anchor-header">YOLOv3</h3><p>You Only Look Once, Version 3 (YOLOv3 [5]) est un algorithme de détection d'objets en une seule étape proposé ces dernières années. Comparé aux algorithmes traditionnels de détection d'objets avec la même précision, YOLOv3 est deux fois plus rapide. YOLOv3 mentionné dans ce sujet est la version améliorée de PaddlePaddle [6]. Il utilise plusieurs méthodes d'optimisation avec une vitesse d'inférence plus élevée.</p>
<h3 id="ResNet-50" class="common-anchor-header">ResNet-50</h3><p>ResNet [7] est le vainqueur de l'ILSVRC 2015 en classification d'images en raison de sa simplicité et de sa praticité. À la base de nombreuses méthodes d'analyse d'images, ResNet s'avère être un modèle populaire spécialisé dans la détection, la segmentation et la reconnaissance d'images.</p>
<h3 id="Milvus" class="common-anchor-header">Milvus</h3><p><a href="https://milvus.io/">Milvus</a> est une base de données vectorielles open-source et native pour le cloud, conçue pour gérer les vecteurs d'intégration générés par les modèles d'apprentissage automatique et les réseaux neuronaux. Elle est largement utilisée dans des scénarios tels que la vision artificielle, le traitement du langage naturel, la chimie informatique, les systèmes de recommandation personnalisés, etc.</p>
<p>Les procédures suivantes décrivent le fonctionnement de Milvus.</p>
<ol>
<li>Les données non structurées sont converties en vecteurs de caractéristiques à l'aide de modèles d'apprentissage profond et sont importées dans Milvus.</li>
<li>Milvus stocke et indexe les vecteurs de caractéristiques.</li>
<li>Milvus renvoie les vecteurs les plus similaires au vecteur interrogé par les utilisateurs.</li>
</ol>
<h2 id="Deployment" class="common-anchor-header">Déploiement<button data-href="#Deployment" class="anchor-icon" translate="no">
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
    </button></h2><p>Vous avez maintenant une certaine compréhension des systèmes d'analyse vidéo basés sur Milvus. Le système se compose principalement de deux parties, comme le montre la figure suivante.</p>
<ul>
<li><p>Les flèches rouges indiquent le processus d'importation des données. Utilisez ResNet-50 pour extraire les vecteurs de caractéristiques de l'ensemble de données d'images et importez les vecteurs de caractéristiques dans Milvus.</p></li>
<li><p>Les flèches noires indiquent le processus d'analyse vidéo. Premièrement, extraire les images d'une vidéo et les enregistrer en tant qu'images. Ensuite, détecter et extraire les objets dans les images à l'aide de YOLOv3. Ensuite, nous utilisons ResNet-50 pour extraire les vecteurs de caractéristiques des images. Enfin, Milvus recherche et renvoie les informations sur les objets avec les vecteurs de caractéristiques correspondants.</p></li>
</ul>
<p>Pour plus d'informations, voir <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/video_similarity_search/object_detection">Milvus Bootcamp : Système de détection d'objets vidéo</a>.</p>
<p><strong>Importation de données</strong></p>
<p>Le processus d'importation des données est simple. Convertissez les données en vecteurs à 2 048 dimensions et importez les vecteurs dans Milvus.</p>
<pre><code translate="no" class="language-python">vector = image_encoder.execute(filename)
entities = [vector]
collection.insert(data=entities)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Analyse vidéo</strong></p>
<p>Comme indiqué ci-dessus, le processus d'analyse vidéo comprend la capture d'images vidéo, la détection d'objets dans chaque image, l'extraction de vecteurs à partir des objets, le calcul de la similarité des vecteurs à l'aide de la distance euclidienne (L2) et la recherche de résultats à l'aide de Milvus.</p>
<pre><code translate="no" class="language-python">images = extract_frame(filename, 1, prefix)   
detector = Detector()   
run(detector, DATA_PATH)       
vectors = get_object_vector(image_encoder, DATA_PATH)
search_params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: 10}}
results = collection.search(vectors, param=search_params, <span class="hljs-built_in">limit</span>=10)
<button class="copy-code-btn"></button></code></pre>
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
    </button></h2><p>Actuellement, plus de 80 % des données sont non structurées. Avec le développement rapide de l'IA, un nombre croissant de modèles d'apprentissage profond ont été développés pour analyser les données non structurées. Des technologies telles que la détection d'objets et le traitement d'images ont réalisé de grandes percées tant dans le monde universitaire que dans l'industrie. Grâce à ces technologies, de plus en plus de plateformes d'IA répondent à des besoins pratiques.</p>
<p>Le système d'analyse vidéo dont il est question dans ce sujet est construit avec Milvus, qui peut analyser rapidement le contenu vidéo.</p>
<p>En tant que base de données vectorielles open-source, Milvus prend en charge les vecteurs de caractéristiques extraits à l'aide de divers modèles d'apprentissage profond. Intégré à des bibliothèques telles que Faiss, NMSLIB et Annoy, Milvus fournit un ensemble d'API intuitives, prenant en charge la commutation des types d'index en fonction des scénarios. En outre, Milvus prend en charge le filtrage scalaire, qui augmente le taux de rappel et la flexibilité de la recherche. Milvus a été appliqué à de nombreux domaines tels que le traitement d'images, la vision par ordinateur, le traitement du langage naturel, la reconnaissance vocale, les systèmes de recommandation et la découverte de nouveaux médicaments.</p>
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
    </button></h2><p>[1] A. D. Bagdanov, L. Ballan, M. Bertini, A. Del Bimbo. "Trademark matching and retrieval in sports video databases". Proceedings of the international workshop on Workshop on multimedia information retrieval, ACM, 2007. https://www.researchgate.net/publication/210113141_Trademark_matching_and_retrieval_in_sports_video_databases</p>
<p>[2] J. Kleban, X. Xie, W.-Y. Ma. "Spatial pyramid mining for logo detection in natural scenes". IEEE International Conference, 2008. https://ieeexplore.ieee.org/document/4607625</p>
<p>[3] R. Boia, C. Florea, L. Florea, R. Dogaru. "Localisation et reconnaissance de logos dans des images naturelles à l'aide de graphes de classes homographiques". Machine Vision and Applications 27 (2), 2016. https://link.springer.com/article/10.1007/s00138-015-0741-7</p>
<p>[4] R. Boia, C. Florea, L. Florea. "Elliptical asift agglomeration in class prototype for logo detection". BMVC, 2015. http://citeseerx.ist.psu.edu/viewdoc/download;jsessionid=5C87F52DE38AB0C90F8340DFEBB841F7?doi=10.1.1.707.9371&amp;rep=rep1&amp;type=pdf</p>
<p>[5] https://arxiv.org/abs/1804.02767</p>
<p>[6] https://paddlepaddle.org.cn/modelbasedetail/yolov3</p>
<p>[7] https://arxiv.org/abs/1512.03385</p>
