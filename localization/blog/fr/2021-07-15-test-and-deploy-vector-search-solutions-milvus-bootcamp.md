---
id: test-and-deploy-vector-search-solutions-milvus-bootcamp.md
title: >-
  Tester et déployer rapidement des solutions de recherche vectorielle avec le
  Bootcamp Milvus 2.0
author: milvus
date: 2021-07-15T03:05:45.742Z
desc: >-
  Créez, testez et personnalisez des solutions de recherche de similarités
  vectorielles avec Milvus, une base de données vectorielles open-source.
cover: assets.zilliz.com/cover_80db9ee49c.png
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/test-and-deploy-vector-search-solutions-milvus-bootcamp
---
<custom-h1>Tester et déployer rapidement des solutions de recherche vectorielle avec le camp d'entraînement Milvus 2.0</custom-h1><p>Avec la sortie de Milvus 2.0, l'équipe a réorganisé le <a href="https://github.com/milvus-io/bootcamp">camp d'entraînement</a> Milvus. Le nouveau bootcamp amélioré propose des guides mis à jour et des exemples de code plus faciles à suivre pour une variété de cas d'utilisation et de déploiements. En outre, cette nouvelle version est mise à jour pour <a href="https://milvus.io/blog/milvus2.0-redefining-vector-database.md">Milvus 2.0</a>, une version réimaginée de la base de données vectorielles la plus avancée au monde.</p>
<h3 id="Stress-test-your-system-against-1M-and-100M-dataset-benchmarks" class="common-anchor-header">Testez votre système contre des ensembles de données de référence de 1M et 100M</h3><p>Le <a href="https://github.com/milvus-io/bootcamp/tree/master/benchmark_test">répertoire de référence</a> contient des tests de référence de 1 million et 100 millions de vecteurs qui indiquent comment votre système réagira à des ensembles de données de tailles différentes.</p>
<p><br/></p>
<h3 id="Explore-and-build-popular-vector-similarity-search-solutions" class="common-anchor-header">Explorer et construire des solutions populaires de recherche de similarités vectorielles</h3><p>Le <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions">répertoire des solutions</a> comprend les cas d'utilisation les plus populaires en matière de recherche de similarités vectorielles. Chaque cas d'utilisation contient une solution notebook et une solution déployable sur docker. Les cas d'utilisation incluent :</p>
<ul>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/reverse_image_search">Recherche de similarité d'images</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/video_similarity_search">Recherche de similarité vidéo</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/audio_similarity_search">Recherche de similarité audio</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/recommendation_system">Système de recommandation</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/molecular_similarity_search">Recherche moléculaire</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/question_answering_system">Système de réponse aux questions</a></li>
</ul>
<p><br/></p>
<h3 id="Quickly-deploy-a-fully-built-application-on-any-system" class="common-anchor-header">Déployer rapidement une application complète sur n'importe quel système</h3><p>Les solutions de déploiement rapide sont des solutions dockerisées qui permettent aux utilisateurs de déployer des applications entièrement construites sur n'importe quel système. Ces solutions sont idéales pour de brèves démonstrations, mais nécessitent un travail supplémentaire de personnalisation et de compréhension par rapport aux notebooks.</p>
<p><br/></p>
<h3 id="Use-scenario-specific-notebooks-to-easily-deploy-pre-configured-applications" class="common-anchor-header">Utiliser des notebooks spécifiques à un scénario pour déployer facilement des applications préconfigurées</h3><p>Les carnets contiennent un exemple simple de déploiement de Milvus pour résoudre le problème dans un cas d'utilisation donné. Chacun des exemples peut être exécuté du début à la fin sans qu'il soit nécessaire de gérer des fichiers ou des configurations. Chaque notebook est également facile à suivre et modifiable, ce qui en fait des fichiers de base idéaux pour d'autres projets.</p>
<p><br/></p>
<h3 id="Image-similarity-search-notebook-example" class="common-anchor-header">Exemple de cahier de recherche de similarités d'images</h3><p>La recherche de similitudes d'images est l'une des idées fondamentales qui sous-tendent de nombreuses technologies, notamment la reconnaissance d'objets par les voitures autonomes. Cet exemple explique comment construire facilement des programmes de vision artificielle avec Milvus.</p>
<p>Ce bloc-notes s'articule autour de trois éléments :</p>
<ul>
<li>le serveur Milvus</li>
<li>Serveur Redis (pour le stockage des métadonnées)</li>
<li>Le modèle Resnet-18 pré-entraîné.</li>
</ul>
<h4 id="Step-1-Download-required-packages" class="common-anchor-header">Étape 1 : Télécharger les paquets nécessaires</h4><p>Commencez par télécharger tous les paquets nécessaires à ce projet. Ce carnet comprend un tableau listant les paquets à utiliser.</p>
<pre><code translate="no">pip install -r requirements.txt
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-2-Server-startup" class="common-anchor-header">Étape 2 : Démarrage du serveur</h4><p>Une fois les paquets installés, démarrez les serveurs et assurez-vous qu'ils fonctionnent correctement. Veillez à suivre les instructions correctes pour le démarrage des serveurs <a href="https://milvus.io/docs/v2.0.x/install_standalone-docker.md">Milvus</a> et <a href="https://hub.docker.com/_/redis">Redis</a>.</p>
<h4 id="Step-3-Download-project-data" class="common-anchor-header">Étape 3 : Téléchargement des données du projet</h4><p>Par défaut, ce bloc-notes extrait un extrait des données VOCImage pour l'utiliser comme exemple, mais n'importe quel répertoire contenant des images devrait fonctionner tant qu'il suit la structure de fichier visible en haut du bloc-notes.</p>
<pre><code translate="no">! gdown <span class="hljs-string">&quot;https://drive.google.com/u/1/uc?id=1jdudBiUu41kL-U5lhH3ari_WBRXyedWo&amp;export=download&quot;</span>
! tar -xf <span class="hljs-string">&#x27;VOCdevkit.zip&#x27;</span>
! <span class="hljs-built_in">rm</span> <span class="hljs-string">&#x27;VOCdevkit.zip&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-4-Connect-to-the-servers" class="common-anchor-header">Étape 4 : Connexion aux serveurs</h4><p>Dans cet exemple, les serveurs fonctionnent sur les ports par défaut de l'hôte local.</p>
<pre><code translate="no">connections.<span class="hljs-title function_">connect</span>(host=<span class="hljs-string">&quot;127.0.0.1&quot;</span>, port=<span class="hljs-number">19537</span>)
red = redis.<span class="hljs-title class_">Redis</span>(host = <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>, port=<span class="hljs-number">6379</span>, db=<span class="hljs-number">0</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-5-Create-a-collection" class="common-anchor-header">Étape 5 : Créer une collection</h4><p>Après avoir démarré les serveurs, créez une collection dans Milvus pour stocker tous les vecteurs. Dans cet exemple, la taille des dimensions est fixée à 512, soit la taille de la sortie resnet-18, et la métrique de similarité est fixée à la distance euclidienne (L2). Milvus prend en charge un grand nombre de <a href="https://milvus.io/docs/v2.0.x/metric.md">métriques de similarité</a> différentes.</p>
<pre><code translate="no">collection_name = <span class="hljs-string">&quot;image_similarity_search&quot;</span>
dim = <span class="hljs-number">512</span>
default_fields = [
    schema.FieldSchema(name=<span class="hljs-string">&quot;id&quot;</span>, dtype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">True</span>),
    schema.FieldSchema(name=<span class="hljs-string">&quot;vector&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=dim)
]
default_schema = schema.CollectionSchema(fields=default_fields, description=<span class="hljs-string">&quot;Image test collection&quot;</span>)
collection = Collection(name=collection_name, schema=default_schema)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-6-Build-an-index-for-the-collection" class="common-anchor-header">Étape 6 : Création d'un index pour la collection</h4><p>Une fois la collection constituée, créez un index pour celle-ci. Dans ce cas, l'index IVF_SQ8 est utilisé. Cet index nécessite le paramètre 'nlist', qui indique à Milvus le nombre de clusters à créer dans chaque fichier de données (segment). Différents <a href="https://milvus.io/docs/v2.0.x/index.md">indices</a> nécessitent différents paramètres.</p>
<pre><code translate="no">default_index = {<span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;IVF_SQ8&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">2048</span>}, <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>}
collection.<span class="hljs-title function_">create_index</span>(field_name=<span class="hljs-string">&quot;vector&quot;</span>, index_params=default_index)
collection.<span class="hljs-title function_">load</span>()
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-7-Set-up-model-and-data-loader" class="common-anchor-header">Étape 7 : configuration du modèle et du chargeur de données</h4><p>Une fois l'indice IVF_SQ8 construit, configurez le réseau neuronal et le chargeur de données. Le réseau neuronal pytorch resnet-18 pré-entraîné utilisé dans cet exemple est dépourvu de sa dernière couche, qui compresse les vecteurs pour la classification et peut perdre des informations précieuses.</p>
<pre><code translate="no">model = torch.hub.load(<span class="hljs-string">&#x27;pytorch/vision:v0.9.0&#x27;</span>, <span class="hljs-string">&#x27;resnet18&#x27;</span>, pretrained=<span class="hljs-literal">True</span>)
encoder = torch.nn.Sequential(*(<span class="hljs-built_in">list</span>(model.children())[:-<span class="hljs-number">1</span>]))
<button class="copy-code-btn"></button></code></pre>
<p>L'ensemble de données et le chargeur de données doivent être modifiés de manière à pouvoir prétraiter et mettre en lots les images tout en fournissant les chemins d'accès aux fichiers des images. Cela peut être fait avec un chargeur de données torchvision légèrement modifié. Pour le prétraitement, les images doivent être recadrées et normalisées car le modèle resnet-18 a été entraîné sur une taille et une plage de valeurs spécifiques.</p>
<pre><code translate="no">dataset = ImageFolderWithPaths(data_dir, transform=transforms.Compose([
                                                transforms.Resize(256),
                                                transforms.CenterCrop(224),
                                                transforms.ToTensor(),
                                                transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])]))

dataloader = torch.utils.data.DataLoader(dataset, num_workers=0, batch_si
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-8-Insert-vectors-into-the-collection" class="common-anchor-header">Étape 8 : Insérer des vecteurs dans la collection</h4><p>Une fois la collection configurée, les images peuvent être traitées et chargées dans la collection créée. Les images sont d'abord extraites par le dataloader et traitées par le modèle resnet-18. Les encastrements vectoriels résultants sont ensuite insérés dans Milvus, qui renvoie un identifiant unique pour chaque vecteur. Les ID des vecteurs et les chemins d'accès aux fichiers d'images sont ensuite insérés sous forme de paires clé-valeur dans le serveur Redis.</p>
<pre><code translate="no">steps = <span class="hljs-built_in">len</span>(dataloader)
step = <span class="hljs-number">0</span>
<span class="hljs-keyword">for</span> inputs, labels, paths <span class="hljs-keyword">in</span> dataloader:
    <span class="hljs-keyword">with</span> torch.no_grad():
        output = encoder(inputs).squeeze()
        output = output.numpy()

    mr = collection.insert([output.tolist()])
    ids = mr.primary_keys
    <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(ids)):
        red.<span class="hljs-built_in">set</span>(<span class="hljs-built_in">str</span>(ids[x]), paths[x])
    <span class="hljs-keyword">if</span> step%<span class="hljs-number">5</span> == <span class="hljs-number">0</span>:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Insert Step: &quot;</span> + <span class="hljs-built_in">str</span>(step) + <span class="hljs-string">&quot;/&quot;</span> + <span class="hljs-built_in">str</span>(steps))
    step += <span class="hljs-number">1</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-9-Conduct-a-vector-similarity-search" class="common-anchor-header">Étape 9 : Effectuer une recherche de similarité entre les vecteurs</h4><p>Une fois toutes les données insérées dans Milvus et Redis, la recherche de similarité vectorielle proprement dite peut être effectuée. Pour cet exemple, trois images sélectionnées au hasard sont extraites du serveur Redis pour une recherche de similarité vectorielle.</p>
<pre><code translate="no">random_ids = [<span class="hljs-built_in">int</span>(red.randomkey()) <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">3</span>)]
search_images = [x.decode(<span class="hljs-string">&quot;utf-8&quot;</span>) <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> red.mget(random_ids)]
<button class="copy-code-btn"></button></code></pre>
<p>Ces images subissent d'abord le même prétraitement qu'à l'étape 7 et sont ensuite passées par le modèle resnet-18.</p>
<pre><code translate="no">transform_ops = transforms.Compose([
                transforms.Resize(<span class="hljs-number">256</span>),
                transforms.CenterCrop(<span class="hljs-number">224</span>),
                transforms.ToTensor(),
                transforms.Normalize(mean=[<span class="hljs-number">0.485</span>, <span class="hljs-number">0.456</span>, <span class="hljs-number">0.406</span>], std=[<span class="hljs-number">0.229</span>, <span class="hljs-number">0.224</span>, <span class="hljs-number">0.225</span>])])

embeddings = [transform_ops(Image.<span class="hljs-built_in">open</span>(x)) <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> search_images]
embeddings = torch.stack(embeddings, dim=<span class="hljs-number">0</span>)

<span class="hljs-keyword">with</span> torch.no_grad():
    embeddings = encoder(embeddings).squeeze().numpy()
<button class="copy-code-btn"></button></code></pre>
<p>Les vecteurs intégrés qui en résultent sont ensuite utilisés pour effectuer une recherche. Tout d'abord, définissez les paramètres de recherche, y compris le nom de la collection à rechercher, nprobe (le nombre de grappes à rechercher) et top_k (le nombre de vecteurs renvoyés). Dans cet exemple, la recherche devrait être très rapide.</p>
<pre><code translate="no">search_params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: 32}}
start = time.time()
results = collection.search(embeddings, <span class="hljs-string">&quot;vector&quot;</span>, param=search_params, <span class="hljs-built_in">limit</span>=3, <span class="hljs-built_in">expr</span>=None)
end = time.time() - start
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-10-Image-search-results" class="common-anchor-header">Étape 10 : Résultats de la recherche d'images</h4><p>Les ID des vecteurs renvoyés par les requêtes sont utilisés pour trouver les images correspondantes. Matplotlib est ensuite utilisé pour afficher les résultats de la recherche d'images.<br/></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/pic1_c8652c7fae.png" alt="pic1.png" class="doc-image" id="pic1.png" />
   </span> <span class="img-wrapper"> <span>pic1.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/pic2_355b054161.png" alt="pic2.png" class="doc-image" id="pic2.png" /><span>pic2.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/pic3_01780c6aac.png" alt="pic3.png" class="doc-image" id="pic3.png" /><span>pic3.png</span> </span></p>
<p><br/></p>
<h3 id="Learn-how-to-deploy-Milvus-in-different-enviroments" class="common-anchor-header">Apprendre à déployer Milvus dans différents environnements</h3><p>La <a href="https://github.com/milvus-io/bootcamp/tree/master/deployments">section sur les déploiements</a> du nouveau bootcamp contient toutes les informations nécessaires à l'utilisation de Milvus dans différents environnements et configurations. Elle inclut le déploiement de Mishards, l'utilisation de Kubernetes avec Milvus, l'équilibrage de charge, et plus encore. Chaque environnement est accompagné d'un guide détaillé, étape par étape, expliquant comment faire fonctionner Milvus.</p>
<p><br/></p>
<h3 id="Dont-be-a-stranger" class="common-anchor-header">Ne soyez pas un étranger</h3><ul>
<li>Lisez notre <a href="https://zilliz.com/blog">blog</a>.</li>
<li>Interagissez avec notre communauté open-source sur <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Utilisez ou contribuez à Milvus, la base de données vectorielle la plus populaire au monde, sur <a href="https://github.com/milvus-io/milvus">Github</a>.</li>
</ul>
