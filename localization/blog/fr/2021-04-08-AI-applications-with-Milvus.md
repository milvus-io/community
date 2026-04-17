---
id: AI-applications-with-Milvus.md
title: Comment créer 4 applications d'IA populaires avec Milvus
author: milvus
date: 2021-04-08T04:14:03.700Z
desc: >-
  Milvus accélère le développement d'applications d'apprentissage automatique et
  les opérations d'apprentissage automatique (MLOps). Avec Milvus, vous pouvez
  développer rapidement un produit minimum viable (MVP) tout en maintenant les
  coûts à des limites inférieures.
cover: assets.zilliz.com/blog_cover_4a9807b9e0.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/AI-applications-with-Milvus'
---
<custom-h1>Comment créer 4 applications d'IA populaires avec Milvus</custom-h1><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/blog_cover_4a9807b9e0.png" alt="blog cover.png" class="doc-image" id="blog-cover.png" />
   </span> <span class="img-wrapper"> <span>blog cover.png</span> </span></p>
<p><a href="https://milvus.io/">Milvus</a> est une base de données vectorielles open-source. Il prend en charge l'ajout, la suppression, la mise à jour et la recherche en temps quasi réel d'ensembles de données vectorielles massifs créés en extrayant des vecteurs de caractéristiques à partir de données non structurées à l'aide de modèles d'IA. Grâce à un ensemble complet d'API intuitives et à la prise en charge de plusieurs bibliothèques d'index largement adoptées (par exemple, Faiss, NMSLIB et Annoy), Milvus accélère le développement d'applications d'apprentissage automatique et les opérations d'apprentissage automatique (MLOps). Avec Milvus, vous pouvez développer rapidement un produit minimum viable (MVP) tout en maintenant les coûts à des limites inférieures.</p>
<p>La question &quot;Quelles sont les ressources disponibles pour développer une application d'IA avec Milvus ?&quot; est fréquemment posée dans la communauté Milvus. Zilliz, la <a href="https://zilliz.com/">société</a> à l'origine de Milvus, a développé un certain nombre de démonstrations qui s'appuient sur Milvus pour effectuer des recherches de similitudes à la vitesse de l'éclair qui alimentent des applications intelligentes. Le code source des solutions Milvus est disponible sur <a href="https://github.com/zilliz-bootcamp">zilliz-bootcamp</a>. Les scénarios interactifs suivants démontrent le traitement du langage naturel (NLP), la recherche d'images inversées, la recherche audio et la vision par ordinateur.</p>
<p>N'hésitez pas à essayer les solutions pour acquérir une expérience pratique avec des scénarios spécifiques ! Partagez vos propres scénarios d'application via :</p>
<ul>
<li><a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a></li>
<li><a href="https://github.com/milvus-io/milvus/discussions">GitHub</a></li>
</ul>
<p><br/></p>
<p><strong>Aller à :</strong></p>
<ul>
<li><a href="#natural-language-processing-chatbots">Traitement du langage naturel (chatbots)</a></li>
<li><a href="#reverse-image-search-systems">Recherche inversée d'images</a></li>
<li><a href="#audio-search-systems">Recherche audio</a></li>
<li><a href="#video-object-detection-computer-vision">Détection d'objets vidéo (vision par ordinateur)</a></li>
</ul>
<p><br/></p>
<h3 id="Natural-language-processing-chatbots" class="common-anchor-header">Traitement du langage naturel (chatbots)</h3><p>Milvus peut être utilisé pour créer des chatbots qui utilisent le traitement du langage naturel pour simuler un opérateur en direct, répondre aux questions, diriger les utilisateurs vers des informations pertinentes et réduire les coûts de main-d'œuvre. Pour démontrer ce scénario d'application, Zilliz a construit un chatbot alimenté par l'IA qui comprend le langage sémantique en combinant Milvus avec <a href="https://en.wikipedia.org/wiki/BERT_(language_model)">BERT</a>, un modèle d'apprentissage automatique (ML) développé pour le pré-entraînement NLP.</p>
<p>👉Source <a href="https://github.com/zilliz-bootcamp/intelligent_question_answering_v2">code：zilliz-bootcamp/intelligent_question_answering_v2</a></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_c301a9e4bd.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<h4 id="How-to-use" class="common-anchor-header">Comment l'utiliser</h4><ol>
<li><p>Téléchargez un jeu de données qui comprend des paires question-réponse. Formatez les questions et les réponses dans deux colonnes distinctes. Un <a href="https://zilliz.com/solutions/qa">échantillon de données</a> peut également être téléchargé.</p></li>
<li><p>Après avoir saisi votre question, une liste de questions similaires sera extraite de l'ensemble de données téléchargé.</p></li>
<li><p>Dévoilez la réponse en sélectionnant la question la plus similaire à la vôtre.</p></li>
</ol>
<p>👉Video<a href="https://www.youtube.com/watch?v=ANgoyvgAxgU">：[Demo] QA System Powered by Milvus</a></p>
<h4 id="How-it-works" class="common-anchor-header">Comment cela fonctionne-t-il ?</h4><p>Les questions sont converties en vecteurs de caractéristiques à l'aide du modèle BERT de Google, puis Milvus est utilisé pour gérer et interroger l'ensemble de données.</p>
<p><strong>Traitement des données :</strong></p>
<ol>
<li>BERT est utilisé pour convertir les paires question-réponse téléchargées en vecteurs de caractéristiques à 768 dimensions. Les vecteurs sont ensuite importés dans Milvus et des identifiants individuels leur sont attribués.</li>
<li>Les vecteurs d'identification des questions et des réponses correspondantes sont stockés dans PostgreSQL.</li>
</ol>
<p><strong>Recherche de questions similaires :</strong></p>
<ol>
<li>BERT est utilisé pour extraire les vecteurs de caractéristiques de la question d'entrée d'un utilisateur.</li>
<li>Milvus récupère les ID des vecteurs pour les questions les plus similaires à la question d'entrée.</li>
<li>Le système recherche les réponses correspondantes dans PostgreSQL.</li>
</ol>
<p><br/></p>
<h3 id="Reverse-image-search-systems" class="common-anchor-header">Systèmes de recherche d'images inversées</h3><p>La recherche d'images inversées transforme le commerce électronique grâce à des recommandations de produits personnalisées et à des outils de recherche de produits similaires qui peuvent stimuler les ventes. Dans ce scénario d'application, Zilliz a construit un système de recherche d'images inversées en combinant Milvus avec <a href="https://towardsdatascience.com/how-to-use-a-pre-trained-model-vgg-for-image-classification-8dd7c4a4a517">VGG</a>, un modèle ML qui peut extraire des caractéristiques d'image.</p>
<p>👉Source <a href="https://github.com/zilliz-bootcamp/image_search">code：zilliz-bootcamp/image_search</a></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_09000e2e2e.jpeg" alt="2.jpeg" class="doc-image" id="2.jpeg" />
   </span> <span class="img-wrapper"> <span>2.jpeg</span> </span></p>
<h4 id="How-to-use" class="common-anchor-header">Comment l'utiliser</h4><ol>
<li>Téléchargez un ensemble de données d'images zippé composé uniquement d'images .jpg (les autres types de fichiers d'images ne sont pas acceptés). Vous pouvez également télécharger un <a href="https://zilliz.com/solutions/image-search">exemple d'ensemble de données</a>.</li>
<li>Téléchargez une image à utiliser comme entrée de recherche pour trouver des images similaires.</li>
</ol>
<p>👉Vidéo : <a href="https://www.youtube.com/watch?v=mTO8YdQObKY">[Démo] Recherche d'images par Milvus</a></p>
<h4 id="How-it-works" class="common-anchor-header">Fonctionnement</h4><p>Les images sont converties en vecteurs de caractéristiques à 512 dimensions à l'aide du modèle VGG, puis Milvus est utilisé pour gérer et interroger l'ensemble de données.</p>
<p><strong>Traitement des données :</strong></p>
<ol>
<li>Le modèle VGG est utilisé pour convertir l'ensemble de données d'images téléchargées en vecteurs de caractéristiques. Les vecteurs sont ensuite importés dans Milvus et des identifiants individuels leur sont attribués.</li>
<li>Les vecteurs de caractéristiques d'images et les chemins d'accès aux fichiers d'images correspondants sont stockés dans CacheDB.</li>
</ol>
<p><strong>Recherche d'images similaires :</strong></p>
<ol>
<li>VGG est utilisé pour convertir l'image téléchargée par un utilisateur en vecteurs de caractéristiques.</li>
<li>Les ID des vecteurs des images les plus similaires à l'image d'entrée sont extraits de Milvus.</li>
<li>Le système recherche les chemins d'accès aux fichiers d'images correspondants dans CacheDB.</li>
</ol>
<p><br/></p>
<h3 id="Audio-search-systems" class="common-anchor-header">Systèmes de recherche audio</h3><p>La recherche de parole, de musique, d'effets sonores et d'autres types de recherche audio permet d'interroger rapidement des volumes massifs de données audio et de retrouver des sons similaires. Les applications comprennent l'identification d'effets sonores similaires, la réduction des atteintes à la propriété intellectuelle, etc. Pour démontrer ce scénario d'application, Zilliz a construit un système de recherche de similarité audio très efficace en combinant Milvus avec <a href="https://arxiv.org/abs/1912.10211">PANNs, un</a>réseau neuronal audio préentraîné à grande échelle construit pour la reconnaissance des formes audio.</p>
<p>👉Source <a href="https://github.com/zilliz-bootcamp/audio_search">code：zilliz-bootcamp/audio_search</a> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_419bac3dd2.png" alt="3.png" class="doc-image" id="3.png" /><span>3.png</span> </span></p>
<h4 id="How-to-use" class="common-anchor-header">Comment l'utiliser</h4><ol>
<li>Téléchargez un ensemble de données audio zippé composé uniquement de fichiers .wav (les autres types de fichiers audio ne sont pas acceptés). Vous pouvez également télécharger un <a href="https://zilliz.com/solutions/audio-search">échantillon de données</a>.</li>
<li>Téléchargez un fichier .wav à utiliser comme entrée de recherche pour trouver des fichiers audio similaires.</li>
</ol>
<p>👉Vidéo : <a href="https://www.youtube.com/watch?v=0eQHeqriCXw">[Démo] Recherche audio optimisée par Milvus</a></p>
<h4 id="How-it-works" class="common-anchor-header">Fonctionnement</h4><p>L'audio est converti en vecteurs de caractéristiques à l'aide de PANN, des réseaux neuronaux audio pré-entraînés à grande échelle conçus pour la reconnaissance des formes audio. Milvus est ensuite utilisé pour gérer et interroger l'ensemble de données.</p>
<p><strong>Traitement des données :</strong></p>
<ol>
<li>PANNs convertit l'audio de l'ensemble de données téléchargé en vecteurs de caractéristiques. Les vecteurs sont ensuite importés dans Milvus et des identifiants individuels leur sont attribués.</li>
<li>Les ID des vecteurs de caractéristiques audio et les chemins d'accès aux fichiers .wav correspondants sont stockés dans PostgreSQL.</li>
</ol>
<p><strong>Recherche de fichiers audio similaires :</strong></p>
<ol>
<li>PANNs est utilisé pour convertir le fichier audio téléchargé par un utilisateur en vecteurs de caractéristiques.</li>
<li>Les ID des vecteurs audio les plus similaires au fichier téléchargé sont récupérés dans Milvus en calculant la distance du produit intérieur (PI).</li>
<li>Le système recherche les chemins d'accès aux fichiers audio correspondants dans MySQL.</li>
</ol>
<p><br/></p>
<h3 id="Video-object-detection-computer-vision" class="common-anchor-header">Détection d'objets vidéo (vision par ordinateur)</h3><p>La détection d'objets vidéo a des applications dans le domaine de la vision artificielle, de la recherche d'images, de la conduite autonome, etc. Pour démontrer ce scénario d'application, Zilliz a construit un système de détection d'objets vidéo en combinant Milvus avec des technologies et des algorithmes, notamment <a href="https://en.wikipedia.org/wiki/OpenCV">OpenCV</a>, <a href="https://towardsdatascience.com/yolo-v3-object-detection-53fb7d3bfe6b">YOLOv3</a> et <a href="https://www.mathworks.com/help/deeplearning/ref/resnet50.html">ResNet50</a>.</p>
<p>👉Code source : <a href="https://github.com/zilliz-bootcamp/video_analysis">zilliz-bootcamp/video_analysis</a></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_54b4ceb2ad.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<h4 id="How-to-use" class="common-anchor-header">Mode d'emploi</h4><ol>
<li>Téléchargez un ensemble de données d'images zippé composé uniquement de fichiers .jpg (les autres types de fichiers d'images ne sont pas acceptés). Veillez à ce que chaque fichier image soit nommé par l'objet qu'il représente. Un <a href="https://zilliz.com/solutions/video-obj-analysis">échantillon de données</a> peut également être téléchargé.</li>
<li>Téléchargez une vidéo à utiliser pour l'analyse.</li>
<li>Cliquez sur le bouton de lecture pour visionner la vidéo téléchargée avec les résultats de la détection d'objets affichés en temps réel.</li>
</ol>
<p>👉Vidéo : <a href="https://www.youtube.com/watch?v=m9rosLClByc">[Démo] Système de détection d'objets vidéo développé par Milvus</a></p>
<h4 id="How-it-works" class="common-anchor-header">Fonctionnement</h4><p>Les images d'objets sont converties en vecteurs de caractéristiques à 2048 dimensions à l'aide de ResNet50. Milvus est ensuite utilisé pour gérer et interroger l'ensemble de données.</p>
<p><strong>Traitement des données :</strong></p>
<ol>
<li>ResNet50 convertit les images d'objets en vecteurs de caractéristiques à 2048 dimensions. Les vecteurs sont ensuite importés dans Milvus et des identifiants individuels leur sont attribués.</li>
<li>Les ID des vecteurs de caractéristiques audio et les chemins d'accès aux fichiers d'images correspondants sont stockés dans MySQL.</li>
</ol>
<p><strong>Détection d'objets dans la vidéo :</strong></p>
<ol>
<li>OpenCV est utilisé pour découper la vidéo.</li>
<li>YOLOv3 est utilisé pour détecter les objets dans la vidéo.</li>
<li>ResNet50 convertit les images d'objets détectés en vecteurs de caractéristiques à 2048 dimensions.</li>
</ol>
<p>Milvus recherche les images d'objets les plus similaires dans l'ensemble de données téléchargé. Les noms d'objets correspondants et les chemins d'accès aux fichiers d'images sont extraits de MySQL.</p>
