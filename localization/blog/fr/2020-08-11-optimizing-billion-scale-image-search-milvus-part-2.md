---
id: optimizing-billion-scale-image-search-milvus-part-2.md
title: Le système de recherche par image de deuxième génération
author: Rife Wang
date: 2020-08-11T22:20:27.855Z
desc: >-
  Un cas d'utilisation de Milvus pour construire un système de recherche par
  similarité d'images pour les entreprises du monde réel.
cover: assets.zilliz.com/header_c73631b1e7.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/optimizing-billion-scale-image-search-milvus-part-2'
---
<custom-h1>Le voyage vers l'optimisation de la recherche d'images à l'échelle du milliard (2/2)</custom-h1><p>Cet article est la deuxième partie de <strong>The Journey to Optimizing Billion-scale Image Search par UPYUN</strong>. Si vous avez manqué la première partie, cliquez <a href="https://zilliz.com/blog/optimizing-billion-scale-image-search-milvus-part-1">ici</a>.</p>
<h2 id="The-second-generation-search-by-image-system" class="common-anchor-header">Le système de recherche par image de deuxième génération<button data-href="#The-second-generation-search-by-image-system" class="anchor-icon" translate="no">
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
    </button></h2><p>Le système de recherche par image de deuxième génération choisit techniquement la solution CNN + Milvus. Le système est basé sur les vecteurs de caractéristiques et fournit un meilleur support technique.</p>
<h2 id="Feature-extraction" class="common-anchor-header">Extraction de caractéristiques<button data-href="#Feature-extraction" class="anchor-icon" translate="no">
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
    </button></h2><p>Dans le domaine de la vision par ordinateur, l'utilisation de l'intelligence artificielle est devenue courante. De même, l'extraction des caractéristiques du système de recherche par image de deuxième génération utilise le réseau neuronal convolutif (CNN) comme technologie sous-jacente</p>
<p>Le terme CNN est difficile à comprendre. Nous nous attacherons ici à répondre à deux questions :</p>
<ul>
<li>Que peut faire le CNN ?</li>
<li>Pourquoi utiliser le CNN pour une recherche d'images ?</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_meme_649be6dfe8.jpg" alt="1-meme.jpg" class="doc-image" id="1-meme.jpg" />
   </span> <span class="img-wrapper"> <span>1-meme.jpg</span> </span></p>
<p>Il existe de nombreux concours dans le domaine de l'IA et la classification d'images est l'un des plus importants. La classification d'images consiste à déterminer si le contenu de l'image concerne un chat, un chien, une pomme, une poire ou d'autres types d'objets.</p>
<p>Que peut faire le CNN ? Il peut extraire des caractéristiques et reconnaître des objets. Il extrait des caractéristiques de plusieurs dimensions et mesure à quel point les caractéristiques d'une image sont proches de celles d'un chat ou d'un chien. Nous pouvons choisir les plus proches comme résultat d'identification, ce qui indique si le contenu d'une image spécifique concerne un chat, un chien ou autre chose.</p>
<p>Quel est le lien entre la fonction d'identification d'objets du CNN et la recherche par image ? Ce que nous voulons, ce n'est pas le résultat final de l'identification, mais le vecteur de caractéristiques extrait de plusieurs dimensions. Les vecteurs de caractéristiques de deux images au contenu similaire doivent être proches.</p>
<h3 id="Which-CNN-model-should-I-use" class="common-anchor-header">Quel modèle CNN dois-je utiliser ?</h3><p>La réponse est VGG16. Pourquoi le choisir ? Tout d'abord, le VGG16 a une bonne capacité de généralisation, c'est-à-dire qu'il est très polyvalent. Deuxièmement, les vecteurs de caractéristiques extraits par VGG16 ont 512 dimensions. S'il y a très peu de dimensions, la précision peut être affectée. S'il y a trop de dimensions, le coût du stockage et du calcul de ces vecteurs de caractéristiques est relativement élevé.</p>
<p>L'utilisation de CNN pour extraire les caractéristiques des images est une solution courante. Nous pouvons utiliser VGG16 comme modèle et Keras + TensorFlow pour l'implémentation technique. Voici l'exemple officiel de Keras :</p>
<pre><code translate="no">from keras.applications.vgg16 import VGG16
from keras.preprocessing import image
from keras.applications.vgg16 import preprocess_input
import numpy as np
model = VGG16(weights=’imagenet’, include_top=False)
img_path = ‘elephant.jpg’
img = image.load_img(img_path, target_size=(224, 224))
x = image.img_to_array(img)
x = np.expand_dims(x, axis=0)
x = preprocess_input(x)
features = model.predict(x)
</code></pre>
<p>Les caractéristiques extraites ici sont des vecteurs de caractéristiques.</p>
<h3 id="1-Normalization" class="common-anchor-header">1. Normalisation</h3><p>Pour faciliter les opérations ultérieures, on normalise souvent les features :</p>
<p>Ce qui est utilisé par la suite est également le vecteur normalisé <code translate="no">norm_feat</code>.</p>
<h3 id="2-Image-description" class="common-anchor-header">2. Description de l'image</h3><p>L'image est chargée à l'aide de la méthode <code translate="no">image.load_img</code> de <code translate="no">keras.preprocessing</code>:</p>
<pre><code translate="no">from keras.preprocessing import image
img_path = 'elephant.jpg'
img = image.load_img(img_path, target_size=(224, 224))
</code></pre>
<p>En fait, il s'agit de la méthode TensorFlow appelée par Keras. Pour plus de détails, voir la documentation TensorFlow. L'objet image final est en fait une instance de PIL Image (le PIL utilisé par TensorFlow).</p>
<h3 id="3-Bytes-conversion" class="common-anchor-header">3. Conversion en octets</h3><p>Dans la pratique, le contenu des images est souvent transmis par le réseau. Par conséquent, au lieu de charger des images à partir d'un chemin, nous préférons convertir les données en octets directement en objets image, c'est-à-dire en PIL Images :</p>
<pre><code translate="no">import io
from PIL import Image

# img_bytes: 图片内容 bytes
img = Image.open(io.BytesIO(img_bytes))
img = img.convert('RGB')

img = img.resize((224, 224), Image.NEAREST)
</code></pre>
<p>L'image ci-dessus est identique au résultat obtenu par la méthode image.load_img. Il y a deux choses auxquelles il faut faire attention :</p>
<ul>
<li>Vous devez effectuer une conversion RVB.</li>
<li>Vous devez redimensionner (resize est le deuxième paramètre de <code translate="no">load_img method</code>).</li>
</ul>
<h3 id="4-Black-border-processing" class="common-anchor-header">4. Traitement des bordures noires</h3><p>Les images, telles que les captures d'écran, peuvent parfois présenter de nombreuses bordures noires. Ces bordures noires n'ont aucune valeur pratique et causent beaucoup d'interférences. C'est pourquoi la suppression des bordures noires est également une pratique courante.</p>
<p>Une bordure noire est essentiellement une ligne ou une colonne de pixels où tous les pixels sont (0, 0, 0) (image RVB). Pour supprimer la bordure noire, il faut trouver ces lignes ou colonnes et les supprimer. Il s'agit en fait d'une multiplication matricielle 3D dans NumPy.</p>
<p>Exemple de suppression de bordures noires horizontales :</p>
<pre><code translate="no"># -*- coding: utf-8 -*-
import numpy as np
from keras.preprocessing import image
def RemoveBlackEdge(img):
Args:
       img: PIL image instance
Returns:
       PIL image instance
&quot;&quot;&quot;
   width = img.width
   img = image.img_to_array(img)
   img_without_black = img[~np.all(img == np.zeros((1, width, 3), np.uint8), axis=(1, 2))]
   img = image.array_to_img(img_without_black)
return img
</code></pre>
<p>C'est à peu près de cela que je veux parler en utilisant CNN pour extraire des caractéristiques d'image et mettre en œuvre d'autres traitements d'image. Jetons maintenant un coup d'œil aux moteurs de recherche vectorielle.</p>
<h2 id="Vector-search-engine" class="common-anchor-header">Moteur de recherche vectoriel<button data-href="#Vector-search-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>Le problème de l'extraction des vecteurs de caractéristiques des images a été résolu. Les problèmes restants sont les suivants :</p>
<ul>
<li>Comment stocker les vecteurs caractéristiques ?</li>
<li>Comment calculer la similarité des vecteurs caractéristiques, c'est-à-dire comment effectuer une recherche ? Le moteur de recherche vectorielle open-source Milvus peut résoudre ces deux problèmes. Jusqu'à présent, il fonctionne bien dans notre environnement de production.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_milvus_logo_3a7411f2c8.png" alt="3-milvus-logo.png" class="doc-image" id="3-milvus-logo.png" />
   </span> <span class="img-wrapper"> <span>3-milvus-logo.png</span> </span></p>
<h2 id="Milvus-the-vector-search-engine" class="common-anchor-header">Milvus, le moteur de recherche vectorielle<button data-href="#Milvus-the-vector-search-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>Extraire des vecteurs de caractéristiques d'une image est loin d'être suffisant. Nous devons également gérer dynamiquement ces vecteurs de caractéristiques (ajout, suppression et mise à jour), calculer la similarité des vecteurs et renvoyer les données vectorielles dans l'intervalle de voisinage le plus proche. Le moteur de recherche vectorielle open-source Milvus exécute ces tâches de manière satisfaisante.</p>
<p>Le reste de cet article décrit les pratiques spécifiques et les points à noter.</p>
<h3 id="1-Requirements-for-CPU" class="common-anchor-header">1. Exigences pour l'unité centrale</h3><p>Pour utiliser Milvus, votre processeur doit supporter le jeu d'instructions avx2. Pour les systèmes Linux, utilisez la commande suivante pour vérifier quels jeux d'instructions votre processeur prend en charge :</p>
<p><code translate="no">cat /proc/cpuinfo | grep flags</code></p>
<p>Vous obtiendrez alors quelque chose comme :</p>
<pre><code translate="no">flags           : fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb         rdtscp lm constant_tsc arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2     ssse3 sdbg fma cx16 xtpr pdcm pcid dca sse4_1 sse4_2 x2apic movbe popcnt aes xsave avx f16c rdrand lahf_lm abm cpuid_fault epb invpcid_single pti intel_ppin tpr_shadow vnmi flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid cqm xsaveopt cqm_llc cqm_occup_llc dtherm ida arat pln pts
</code></pre>
<p>Ce qui suit les drapeaux est le jeu d'instructions pris en charge par votre unité centrale. Bien entendu, ces informations sont beaucoup plus nombreuses que celles dont j'ai besoin. Je veux juste voir si un jeu d'instructions spécifique, comme avx2, est supporté. Il suffit d'ajouter un grep pour le filtrer :</p>
<pre><code translate="no">cat /proc/cpuinfo | grep flags | grep avx2
</code></pre>
<p>Si aucun résultat n'est retourné, cela signifie que ce jeu d'instructions spécifique n'est pas supporté. Vous devez alors changer de machine.</p>
<h3 id="2-Capacity-planning" class="common-anchor-header">2. Planification de la capacité</h3><p>La planification de la capacité est notre première préoccupation lorsque nous concevons un système. Quelle quantité de données devons-nous stocker ? De quelle quantité de mémoire et d'espace disque ces données ont-elles besoin ?</p>
<p>Faisons quelques calculs rapides. Chaque dimension d'un vecteur est un float32. Un type float32 occupe 4 octets. Un vecteur de 512 dimensions nécessite donc 2 Ko d'espace de stockage. De même :</p>
<ul>
<li>Mille vecteurs à 512 dimensions nécessitent 2 Mo de stockage.</li>
<li>Un million de vecteurs à 512 dimensions nécessitent 2 Go de stockage.</li>
<li>10 millions de vecteurs à 512 dimensions nécessitent 20 Go de stockage.</li>
<li>100 millions de vecteurs à 512 dimensions nécessitent 200 Go de stockage.</li>
<li>Un milliard de vecteurs à 512 dimensions nécessite 2 To de stockage.</li>
</ul>
<p>Si nous voulons stocker toutes les données dans la mémoire, le système a besoin d'au moins la capacité de mémoire correspondante.</p>
<p>Il est recommandé d'utiliser l'outil officiel de calcul de la taille : Milvus sizing tool.</p>
<p>En fait, notre mémoire n'est peut-être pas si grande que cela (cela n'a pas vraiment d'importance si vous n'avez pas assez de mémoire). Milvus efface automatiquement les données sur le disque). Outre les données vectorielles d'origine, nous devons également prendre en compte le stockage d'autres données telles que les journaux.</p>
<h3 id="3-System-configuration" class="common-anchor-header">3. Configuration du système</h3><p>Pour plus d'informations sur la configuration du système, voir la documentation Milvus :</p>
<ul>
<li>Configuration du serveur Milvus : https://milvus.io/docs/v0.10.1/milvus_config.md</li>
</ul>
<h3 id="4-Database-design" class="common-anchor-header">4. Conception de la base de données</h3><p><strong>Collection et partition</strong></p>
<ul>
<li>La collection est également connue sous le nom de table.</li>
<li>La partition fait référence aux partitions à l'intérieur d'une collection.</li>
</ul>
<p>L'implémentation sous-jacente de la partition est en fait la même que celle de la collection, sauf qu'une partition se trouve sous une collection. Mais avec les partitions, l'organisation des données devient plus flexible. Nous pouvons également interroger une partition spécifique dans une collection afin d'obtenir de meilleurs résultats.</p>
<p>Combien de collections et de partitions pouvons-nous avoir ? Les informations de base sur les collections et les partitions se trouvent dans les métadonnées. Milvus utilise SQLite (intégration interne de Milvus) ou MySQL (nécessite une connexion externe) pour la gestion interne des métadonnées. Si vous utilisez SQLite par défaut pour gérer les métadonnées, vous subirez de graves pertes de performances lorsque le nombre de collections et de partitions est trop important. Par conséquent, le nombre total de collections et de partitions ne doit pas dépasser 50 000 (Milvus 0.8.0 limite ce nombre à 4 096). Si vous devez définir un nombre plus important, il est recommandé d'utiliser MySQL via une connexion externe.</p>
<p>La structure de données prise en charge par la collecte et la partition de Milvus est très simple, à savoir <code translate="no">ID + vector</code>. En d'autres termes, la table ne comporte que deux colonnes : ID et données vectorielles.</p>
<p><strong>Remarque :</strong></p>
<ul>
<li>Les ID doivent être des nombres entiers.</li>
<li>Nous devons nous assurer que l'ID est unique au sein d'une collection plutôt qu'au sein d'une partition.</li>
</ul>
<p><strong>Filtrage conditionnel</strong></p>
<p>Lorsque nous utilisons des bases de données traditionnelles, nous pouvons spécifier des valeurs de champ comme conditions de filtrage. Bien que Milvus ne filtre pas exactement de la même manière, nous pouvons mettre en œuvre un filtrage conditionnel simple à l'aide de collections et de partitions. Par exemple, nous disposons d'une grande quantité de données d'images et les données appartiennent à des utilisateurs spécifiques. Nous pouvons alors diviser les données en partitions par utilisateur. Par conséquent, utiliser l'utilisateur comme condition de filtrage revient en fait à spécifier la partition.</p>
<p><strong>Données structurées et cartographie vectorielle</strong></p>
<p>Milvus ne prend en charge que la structure de données ID + vecteur. Mais dans les scénarios d'entreprise, ce dont nous avons besoin, c'est de données structurées porteuses de sens pour l'entreprise. En d'autres termes, nous devons trouver des données structurées par le biais de vecteurs. Par conséquent, nous devons gérer les relations de mappage entre les données structurées et les vecteurs par le biais de l'ID.</p>
<pre><code translate="no">structured data ID &lt;--&gt; mapping table &lt;--&gt; Milvus ID
</code></pre>
<p><strong>Sélection de l'index</strong></p>
<p>Vous pouvez consulter les articles suivants :</p>
<ul>
<li>Types d'index : https://www.milvus.io/docs/v0.10.1/index.md</li>
<li>Comment sélectionner un index : https://medium.com/@milvusio/how-to-choose-an-index-in-milvus-4f3d15259212</li>
</ul>
<h3 id="5-Processing-search-results" class="common-anchor-header">5. Traitement des résultats de la recherche</h3><p>Les résultats de recherche de Milvus sont une collection d'ID + distance :</p>
<ul>
<li>ID : l'ID dans une collection.</li>
<li>Distance : une valeur de distance de 0 ~ 1 indique le niveau de similarité ; plus la valeur est petite, plus les deux vecteurs sont similaires.</li>
</ul>
<p><strong>Filtrer les données dont l'ID est -1</strong></p>
<p>Lorsque le nombre de collections est trop faible, les résultats de la recherche peuvent contenir des données dont l'ID est -1. Nous devons les filtrer nous-mêmes.</p>
<p><strong>Pagination</strong></p>
<p>La recherche de vecteurs est très différente. Les résultats de la requête sont triés par ordre décroissant de similarité, et les résultats les plus similaires (topK) sont sélectionnés (topK est spécifié par l'utilisateur au moment de la requête).</p>
<p>Milvus ne prend pas en charge la pagination. Nous devons mettre en œuvre la fonction de pagination nous-mêmes si nous en avons besoin dans le cadre de notre activité. Par exemple, si nous avons dix résultats sur chaque page et que nous ne voulons afficher que la troisième page, nous devons spécifier que topK = 30 et ne renvoyer que les dix derniers résultats.</p>
<p><strong>Seuil de similarité pour les entreprises</strong></p>
<p>La distance entre les vecteurs de deux images est comprise entre 0 et 1. Si nous voulons décider si deux images sont similaires dans un scénario commercial spécifique, nous devons spécifier un seuil dans cette fourchette. Les deux images sont similaires si la distance est inférieure au seuil, ou elles sont très différentes l'une de l'autre si la distance est supérieure au seuil. Vous devez ajuster le seuil en fonction de vos besoins professionnels.</p>
<blockquote>
<p>Cet article a été rédigé par rifewang, utilisateur de Milvus et ingénieur logiciel d'UPYUN. Si vous aimez cet article, n'hésitez pas à venir lui dire bonjour @ https://github.com/rifewang.</p>
</blockquote>
