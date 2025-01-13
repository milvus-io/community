---
id: >-
  2021-12-10-image-based-trademark-similarity-search-system-a-smarter-solution-to-ip-protection.md
title: >-
  Milvus dans la protection de la propriété intellectuelle：Construction d'un
  système de recherche de similitudes de marques avec Milvus
author: Zilliz
date: 2021-12-10T00:00:00.000Z
desc: >-
  Apprenez à appliquer la recherche de similarités vectorielles dans le secteur
  de la protection de la propriété intellectuelle.
cover: assets.zilliz.com/IP_protection_0a33547579.png
tag: Scenarios
---
<p>Ces dernières années, la question de la protection de la propriété intellectuelle s'est retrouvée sous les feux de la rampe, les gens étant de plus en plus conscients des atteintes à la propriété intellectuelle. En particulier, le géant multinational de la technologie Apple Inc. a activement <a href="https://en.wikipedia.org/wiki/Apple_Inc._litigation">intenté des actions en justice contre diverses entreprises pour atteinte à la propriété intellectuelle</a>, notamment en matière de marques, de brevets et de dessins et modèles. Outre ces affaires les plus célèbres, Apple Inc. a également <a href="https://www.smh.com.au/business/apple-bites-over-woolworths-logo-20091005-ghzr.html">contesté</a> en 2009 <a href="https://www.smh.com.au/business/apple-bites-over-woolworths-logo-20091005-ghzr.html">une demande d'enregistrement de marque déposée par Woolworths Limited</a>, une chaîne de supermarchés australienne, au motif d'une contrefaçon de marque.  Apple. Inc. a fait valoir que le logo de la marque australienne, un &quot;w&quot; stylisé, ressemblait à son propre logo représentant une pomme. Apple Inc. s'est donc opposée à la gamme de produits, y compris les appareils électroniques, que Woolworths a demandé à vendre avec le logo. L'histoire se termine par la modification du logo de Woolworths et le retrait de l'opposition d'Apple.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Logo_of_Woolworths_b04ece5b20.png" alt="Logo of Woolworths.png" class="doc-image" id="logo-of-woolworths.png" />
   </span> <span class="img-wrapper"> <span>Logo de Woolworths.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Logo_of_Apple_Inc_181e5bd5f8.png" alt="Logo of Apple Inc.png" class="doc-image" id="logo-of-apple-inc.png" />
   </span> <span class="img-wrapper"> <span>Logo d'Apple Inc.png</span> </span></p>
<p>Avec la prise de conscience croissante de la culture de marque, les entreprises surveillent de plus près toute menace susceptible de porter atteinte à leurs droits de propriété intellectuelle (PI). Les atteintes à la propriété intellectuelle comprennent</p>
<ul>
<li>la violation des droits d'auteur</li>
<li>la contrefaçon de brevet</li>
<li>la contrefaçon de marque</li>
<li>la contrefaçon de dessins et modèles</li>
<li>le cybersquattage.</li>
</ul>
<p>Le litige susmentionné entre Apple et Woolworths porte principalement sur la contrefaçon de marque, et plus précisément sur la similitude entre les images des marques des deux entités. Pour éviter de devenir un autre Woolworths, une recherche exhaustive de similitudes entre les marques est une étape cruciale pour les déposants, tant avant le dépôt que pendant l'examen des demandes d'enregistrement de marques. Le recours le plus courant consiste à effectuer une recherche dans la <a href="https://tmsearch.uspto.gov/search/search-information">base de données de l'Office américain des brevets et des marques (USPTO</a> ), qui contient tous les enregistrements et demandes de marques actifs et inactifs. En dépit d'une interface utilisateur peu charmante, ce processus de recherche est également profondément défectueux en raison de sa nature textuelle, car il repose sur des mots et des codes de dessins ou modèles de marques (qui sont des étiquettes annotées à la main de caractéristiques de dessins ou modèles) pour la recherche d'images.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_8_b2fff6ca11.png" alt="8.png" class="doc-image" id="8.png" />
   </span> <span class="img-wrapper"> <span>8.png</span> </span></p>
<p>Cet article vise donc à montrer comment construire un système efficace de recherche de similitudes entre marques basé sur des images en utilisant <a href="https://milvus.io">Milvus</a>, une base de données vectorielles à source ouverte.</p>
<h2 id="A-vector-similarity-search-system-for-trademarks" class="common-anchor-header">Un système de recherche de similitudes vectorielles pour les marques<button data-href="#A-vector-similarity-search-system-for-trademarks" class="anchor-icon" translate="no">
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
    </button></h2><p>Pour construire un système de recherche de similitudes vectorielles pour les marques, vous devez suivre les étapes suivantes :</p>
<ol>
<li>Préparer un vaste ensemble de données de logos. Il est probable que le système puisse utiliser un tel ensemble de données (voir <a href="https://developer.uspto.gov/product/trademark-24-hour-box-and-supplemental">ci-dessous</a>).</li>
<li>Entraîner un modèle d'extraction de caractéristiques d'image à l'aide de l'ensemble de données et de modèles pilotés par les données ou d'algorithmes d'intelligence artificielle.</li>
<li>Convertir les logos en vecteurs à l'aide du modèle ou de l'algorithme formé à l'étape 2.</li>
<li>Stocker les vecteurs et effectuer des recherches de similarité vectorielle dans Milvus, la base de données vectorielle open-source.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/trademark_system_e9700df555.png" alt="Nike.png" class="doc-image" id="nike.png" />
   </span> <span class="img-wrapper"> <span>Nike.png</span> </span></p>
<p>Dans les sections suivantes, nous allons examiner de plus près les deux principales étapes de la construction d'un système de recherche de similitudes vectorielles pour les marques : l'utilisation de modèles d'intelligence artificielle pour l'extraction des caractéristiques des images et l'utilisation de Milvus pour la recherche de similitudes vectorielles. Dans notre cas, nous avons utilisé VGG16, un réseau neuronal convolutionnel (CNN), pour extraire les caractéristiques des images et les convertir en vecteurs d'intégration.</p>
<h3 id="Using-VGG16-for-image-feature-extraction" class="common-anchor-header">Utilisation du VGG16 pour l'extraction des caractéristiques des images</h3><p><a href="https://medium.com/@mygreatlearning/what-is-vgg16-introduction-to-vgg16-f2d63849f615">VGG16</a> est un CNN conçu pour la reconnaissance d'images à grande échelle. Le modèle est rapide et précis dans la reconnaissance d'images et peut être appliqué à des images de toutes tailles. Voici deux illustrations de l'architecture du VGG16.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vgg16_layers_9e621f62cc.png" alt="9.png" class="doc-image" id="9.png" />
   </span> <span class="img-wrapper"> <span>9.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vgg16_architecture_992614e882.png" alt="10.png" class="doc-image" id="10.png" />
   </span> <span class="img-wrapper"> <span>10.png</span> </span></p>
<p>Le modèle VGG16, comme son nom l'indique, est un CNN à 16 couches. Tous les modèles VGG, y compris le VGG16 et le VGG19, contiennent 5 blocs VGG, avec une ou plusieurs couches convolutives dans chaque bloc VGG. À la fin de chaque bloc, une couche de regroupement maximal est connectée pour réduire la taille de l'image d'entrée. Le nombre de noyaux est équivalent dans chaque couche convolutive mais double dans chaque bloc VGG. Par conséquent, le nombre de noyaux dans le modèle passe de 64 dans le premier bloc à 512 dans les quatrième et cinquième blocs. Tous les noyaux convolutifs sont de<em>taille 33, tandis que les noyaux de mise en commun sont tous de taille 22</em>. Cela permet de préserver davantage d'informations sur l'image d'entrée.</p>
<p>Par conséquent, VGG16 est un modèle approprié pour la reconnaissance d'images d'ensembles de données massives dans ce cas. Vous pouvez utiliser Python, Tensorflow et Keras pour entraîner un modèle d'extraction de caractéristiques d'image sur la base du VGG16.</p>
<h3 id="Using-Milvus-for-vector-similarity-search" class="common-anchor-header">Utilisation de Milvus pour la recherche de similarités vectorielles</h3><p>Après avoir utilisé le modèle VGG16 pour extraire des caractéristiques d'image et convertir des images de logo en vecteurs d'intégration, vous devez rechercher des vecteurs similaires à partir d'un vaste ensemble de données.</p>
<p>Milvus est une base de données "cloud-native" qui se caractérise par une grande évolutivité et une grande élasticité. En outre, en tant que base de données, elle peut garantir la cohérence des données. Pour un système de recherche de similitudes de marques comme celui-ci, de nouvelles données, telles que les derniers enregistrements de marques, sont téléchargées dans le système en temps réel. Ces données nouvellement téléchargées doivent être disponibles immédiatement pour la recherche. C'est pourquoi cet article adopte Milvus, la base de données vectorielles à code source ouvert, pour effectuer la recherche de similitudes vectorielles.</p>
<p>Lors de l'insertion des vecteurs de logos, vous pouvez créer des collections dans Milvus pour différents types de vecteurs de logos selon la <a href="https://en.wikipedia.org/wiki/International_(Nice)_Classification_of_Goods_and_Services">classification internationale (Nice) des produits et des services</a>, un système de classification des produits et des services pour l'enregistrement des marques. Par exemple, vous pouvez insérer un groupe de vecteurs de logos de marques de vêtements dans une collection appelée &quot;vêtements&quot; dans Milvus et insérer un autre groupe de vecteurs de logos de marques technologiques dans une autre collection appelée &quot;technologie&quot;. Ce faisant, vous pouvez augmenter considérablement l'efficacité et la vitesse de votre recherche de similarité vectorielle.</p>
<p>Milvus prend non seulement en charge plusieurs index pour la recherche de similarité vectorielle, mais fournit également des API et des outils riches pour faciliter le DevOps. Le diagramme suivant illustre l'<a href="https://milvus.io/docs/v2.0.x/architecture_overview.md">architecture de Milvus</a>. Vous pouvez en savoir plus sur Milvus en lisant son <a href="https://milvus.io/docs/v2.0.x/overview.md">introduction</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_architecture_ea45a5ab53.png" alt="11.png" class="doc-image" id="11.png" />
   </span> <span class="img-wrapper"> <span>11.png</span> </span></p>
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
<li><p>Créez d'autres systèmes de recherche de similarités vectorielles pour d'autres scénarios d'application avec Milvus :</p>
<ul>
<li><a href="https://milvus.io/blog/dna-sequence-classification-based-on-milvus.md">Classification des séquences ADN basée sur Milvus</a></li>
<li><a href="https://milvus.io/blog/audio-retrieval-based-on-milvus.md">Recherche audio basée sur Milvus</a></li>
<li><a href="https://milvus.io/blog/building-video-search-system-with-milvus.md">4 étapes pour construire un système de recherche vidéo</a></li>
<li><a href="https://milvus.io/blog/building-intelligent-chatbot-with-nlp-and-milvus.md">Construction d'un système d'assurance qualité intelligent avec NLP et Milvus</a></li>
<li><a href="https://milvus.io/blog/molecular-structure-similarity-with-milvus.md">Accélérer la découverte de nouveaux médicaments</a></li>
</ul></li>
<li><p>Participez à notre communauté open-source :</p>
<ul>
<li>Trouvez ou contribuez à Milvus sur <a href="https://bit.ly/307b7jC">GitHub</a>.</li>
<li>Interagissez avec la communauté via le <a href="https://bit.ly/3qiyTEk">Forum</a>.</li>
<li>Connectez-vous avec nous sur <a href="https://bit.ly/3ob7kd8">Twitter</a>.</li>
</ul></li>
</ul>
