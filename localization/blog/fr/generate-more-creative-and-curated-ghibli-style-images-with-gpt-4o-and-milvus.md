---
id: >-
  generate-more-creative-and-curated-ghibli-style-images-with-gpt-4o-and-milvus.md
title: >-
  Générer des images plus créatives et plus curatives de type Ghibli avec GPT-4o
  et Milvus
author: Lumina Wang
date: 2025-04-01T00:00:00.000Z
desc: >-
  Connecter vos données privées avec GPT-4o Utiliser Milvus pour des sorties
  d'images plus soignées
cover: assets.zilliz.com/GPT_4opagephoto_5e934b89e5.png
tag: Engineering
tags: 'GPT-4o, Database, Milvus, Artificial Intelligence, Image Generation'
canonicalUrl: >-
  https://milvus.io/blog/generate-more-creative-and-curated-ghibli-style-images-with-gpt-4o-and-milvus.md
---
<h2 id="Everyone-Became-an-Artist-Overnight-with-GPT-4o" class="common-anchor-header">Tout le monde est devenu artiste du jour au lendemain grâce à GPT-4o<button data-href="#Everyone-Became-an-Artist-Overnight-with-GPT-4o" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/four_panel_1788f825e3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Croyez-le ou non, l'image que vous venez de voir a été générée par l'IA, plus précisément par la nouvelle version de GPT-4o !</em></p>
<p>Lorsque OpenAI a lancé la fonction native de génération d'images de GPT-4o le 26 mars, personne n'aurait pu prédire le tsunami créatif qui s'en est suivi. Du jour au lendemain, l'Internet a explosé avec des portraits de style Ghibli générés par l'IA - des célébrités, des politiciens, des animaux de compagnie et même des utilisateurs eux-mêmes ont été transformés en charmants personnages du Studio Ghibli avec seulement quelques invites simples. La demande était si forte que Sam Altman lui-même a dû "supplier" les utilisateurs de ralentir, en tweetant que les GPU de l'OpenAI "fondaient".</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Ghibli_32e739c2ac.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Exemple d'images générées par GPT-4o (crédit X@Jason Reid)</p>
<h2 id="Why-GPT-4o-Changes-Everything" class="common-anchor-header">Pourquoi GPT-4o change tout<button data-href="#Why-GPT-4o-Changes-Everything" class="anchor-icon" translate="no">
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
    </button></h2><p>Pour les industries créatives, il s'agit d'un changement de paradigme. Des tâches qui nécessitaient autrefois une journée entière pour toute une équipe de conception peuvent désormais être réalisées en quelques minutes seulement. Ce qui différencie GPT-4o des précédents générateurs d'images, c'est <strong>sa remarquable cohérence visuelle et son interface intuitive</strong>. Il prend en charge les conversations multi-tours qui vous permettent d'affiner les images en ajoutant des éléments, en ajustant les proportions, en modifiant les styles ou même en transformant la 2D en 3D, ce qui revient à mettre un concepteur professionnel dans votre poche.</p>
<p>Le secret des performances supérieures de GPT-4o ? Son architecture autorégressive. Contrairement aux modèles de diffusion (comme la diffusion stable) qui dégradent les images en bruit avant de les reconstruire, GPT-4o génère des images séquentiellement, un jeton à la fois, en conservant la conscience du contexte tout au long du processus. Cette différence architecturale fondamentale explique pourquoi GPT-4o produit des résultats plus cohérents avec des invites plus simples et plus naturelles.</p>
<p>Mais c'est là que les choses deviennent intéressantes pour les développeurs : <strong>De plus en plus de signes indiquent une tendance majeure : les modèles d'intelligence artificielle deviennent eux-mêmes des produits. En d'autres termes, la plupart des produits qui se contentent d'envelopper de grands modèles d'IA autour de données du domaine public risquent d'être laissés pour compte.</strong></p>
<p>La véritable puissance de ces avancées vient de la combinaison de grands modèles à usage général avec des <strong>données privées spécifiques à un domaine</strong>. Cette combinaison pourrait bien être la stratégie de survie optimale pour la plupart des entreprises à l'ère des grands modèles de langage. Alors que les modèles de base continuent d'évoluer, l'avantage concurrentiel durable appartiendra à ceux qui peuvent intégrer efficacement leurs ensembles de données propriétaires à ces puissants systèmes d'IA.</p>
<p>Voyons comment connecter vos données privées à GPT-4o à l'aide de Milvus, une base de données vectorielle open-source et hautement performante.</p>
<h2 id="Connecting-Your-Private-Data-with-GPT-4o-Using-Milvus-for-More-Curated-Image-Outputs" class="common-anchor-header">Connexion de vos données privées à GPT-4o à l'aide de Milvus pour des sorties d'images plus soignées<button data-href="#Connecting-Your-Private-Data-with-GPT-4o-Using-Milvus-for-More-Curated-Image-Outputs" class="anchor-icon" translate="no">
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
    </button></h2><p>Les bases de données vectorielles sont la technologie clé qui permet de relier vos données privées aux modèles d'IA. Elles convertissent votre contenu, qu'il s'agisse d'images, de textes ou de sons, en représentations mathématiques (vecteurs) qui capturent leur signification et leurs caractéristiques. Cela permet une recherche sémantique basée sur la similarité plutôt que sur de simples mots-clés.</p>
<p>Milvus, en tant que base de données vectorielles open-source de premier plan, est particulièrement bien adapté à la connexion avec des outils d'IA générative tels que GPT-4o. Voici comment je l'ai utilisé pour résoudre un problème personnel.</p>
<h3 id="Background" class="common-anchor-header">Contexte</h3><p>Un jour, j'ai eu une idée brillante : transformer toutes les bêtises de mon chien Cola en bande dessinée. Mais il y avait un hic : Comment passer au crible des dizaines de milliers de photos de mon travail, de mes voyages et de mes aventures culinaires pour retrouver les moments d'espièglerie de Cola ?</p>
<p>La solution ? Importer toutes mes photos dans Milvus et effectuer une recherche d'images.</p>
<p>Voyons la mise en œuvre étape par étape.</p>
<h4 id="Dependencies-and-Environment" class="common-anchor-header">Dépendances et environnement</h4><p>Tout d'abord, vous devez préparer votre environnement avec les bons paquets :</p>
<pre><code translate="no">pip install pymilvus --upgrade
pip install torch numpy scikit-learn pillow
<button class="copy-code-btn"></button></code></pre>
<h4 id="Prepare-the-Data" class="common-anchor-header">Préparer les données</h4><p>J'utiliserai ma photothèque, qui contient environ 30 000 photos, comme ensemble de données dans ce guide. Si vous ne disposez d'aucun jeu de données, téléchargez un exemple de jeu de données à partir de Milvus et décompressez-le :</p>
<pre><code translate="no">!wget https://github.com/milvus-io/pymilvus-assets/releases/download/imagedata/reverse_image_search.<span class="hljs-built_in">zip</span>
!unzip -q -o reverse_image_search.<span class="hljs-built_in">zip</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Define-the-Feature-Extractor" class="common-anchor-header">Définir l'extracteur de caractéristiques</h4><p>Nous utiliserons le mode ResNet-50 de la bibliothèque <code translate="no">timm</code> pour extraire les vecteurs d'intégration de nos images. Ce modèle a été entraîné sur des millions d'images et peut extraire des caractéristiques significatives qui représentent le contenu visuel.</p>
<pre><code translate="no">    <span class="hljs-keyword">import</span> torch
    <span class="hljs-keyword">from</span> PIL <span class="hljs-keyword">import</span> Image
    <span class="hljs-keyword">import</span> timm
    <span class="hljs-keyword">from</span> sklearn.preprocessing <span class="hljs-keyword">import</span> normalize
    <span class="hljs-keyword">from</span> timm.data <span class="hljs-keyword">import</span> resolve_data_config
    <span class="hljs-keyword">from</span> timm.data.transforms_factory <span class="hljs-keyword">import</span> create_transform
    <span class="hljs-keyword">class</span> <span class="hljs-title class_">FeatureExtractor</span>:
        <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self, modelname</span>):
            <span class="hljs-comment"># Load the pre-trained model</span>
            <span class="hljs-variable language_">self</span>.model = timm.create_model(
                modelname, pretrained=<span class="hljs-literal">True</span>, num_classes=<span class="hljs-number">0</span>, global_pool=<span class="hljs-string">&quot;avg&quot;</span>
            )
            <span class="hljs-variable language_">self</span>.model.<span class="hljs-built_in">eval</span>()
            <span class="hljs-comment"># Get the input size required by the model</span>
            <span class="hljs-variable language_">self</span>.input_size = <span class="hljs-variable language_">self</span>.model.default_cfg[<span class="hljs-string">&quot;input_size&quot;</span>]
            config = resolve_data_config({}, model=modelname)
            <span class="hljs-comment"># Get the preprocessing function provided by TIMM for the model</span>
            <span class="hljs-variable language_">self</span>.preprocess = create_transform(**config)
        <span class="hljs-keyword">def</span> <span class="hljs-title function_">__call__</span>(<span class="hljs-params">self, imagepath</span>):
            <span class="hljs-comment"># Preprocess the input image</span>
            input_image = Image.<span class="hljs-built_in">open</span>(imagepath).convert(<span class="hljs-string">&quot;RGB&quot;</span>)  <span class="hljs-comment"># Convert to RGB if needed</span>
            input_image = <span class="hljs-variable language_">self</span>.preprocess(input_image)
            <span class="hljs-comment"># Convert the image to a PyTorch tensor and add a batch dimension</span>
            input_tensor = input_image.unsqueeze(<span class="hljs-number">0</span>)
            <span class="hljs-comment"># Perform inference</span>
            <span class="hljs-keyword">with</span> torch.no_grad():
                output = <span class="hljs-variable language_">self</span>.model(input_tensor)
            <span class="hljs-comment"># Extract the feature vector</span>
            feature_vector = output.squeeze().numpy()
            <span class="hljs-keyword">return</span> normalize(feature_vector.reshape(<span class="hljs-number">1</span>, -<span class="hljs-number">1</span>), norm=<span class="hljs-string">&quot;l2&quot;</span>).flatten()
<button class="copy-code-btn"></button></code></pre>
<h4 id="Create-a-Milvus-Collection" class="common-anchor-header">Créer une collection Milvus</h4><p>Ensuite, nous allons créer une collection Milvus pour stocker nos encastrements d'images. Il s'agit d'une base de données spécialisée, explicitement conçue pour la recherche de similarités vectorielles :</p>
<pre><code translate="no">    <span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
    client = MilvusClient(uri=<span class="hljs-string">&quot;example.db&quot;</span>)
    <span class="hljs-keyword">if</span> client.has_collection(collection_name=<span class="hljs-string">&quot;image_embeddings&quot;</span>):
        client.drop_collection(collection_name=<span class="hljs-string">&quot;image_embeddings&quot;</span>)

    client.create_collection(
        collection_name=<span class="hljs-string">&quot;image_embeddings&quot;</span>,
        vector_field_name=<span class="hljs-string">&quot;vector&quot;</span>,
        dimension=<span class="hljs-number">2048</span>,
        auto_id=<span class="hljs-literal">True</span>,
        enable_dynamic_field=<span class="hljs-literal">True</span>,
        metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    )
<button class="copy-code-btn"></button></code></pre>
<p><strong>Notes sur les paramètres de MilvusClient :</strong></p>
<ul>
<li><p><strong>Configuration locale :</strong> L'utilisation d'un fichier local (par exemple, <code translate="no">./milvus.db</code>) est le moyen le plus simple de démarrer - Milvus Lite gérera toutes vos données.</p></li>
<li><p>Mise à<strong>l'échelle :</strong> pour les grands ensembles de données, configurez un serveur Milvus robuste à l'aide de Docker ou de Kubernetes et utilisez son URI (par exemple, <code translate="no">http://localhost:19530</code>).</p></li>
<li><p><strong>Option cloud :</strong> Si vous utilisez Zilliz Cloud (le service entièrement géré de Milvus), ajustez votre URI et votre jeton pour qu'ils correspondent au point de terminaison public et à la clé API.</p></li>
</ul>
<h4 id="Insert-Image-Embeddings-into-Milvus" class="common-anchor-header">Insérer des incorporations d'images dans Milvus</h4><p>Il s'agit maintenant d'analyser chaque image et de stocker sa représentation vectorielle. Cette étape peut prendre un certain temps en fonction de la taille de votre ensemble de données, mais il s'agit d'un processus unique :</p>
<pre><code translate="no">    <span class="hljs-keyword">import</span> os
    <span class="hljs-keyword">from</span> some_module <span class="hljs-keyword">import</span> FeatureExtractor  <span class="hljs-comment"># Replace with your feature extraction module</span>
    extractor = FeatureExtractor(<span class="hljs-string">&quot;resnet50&quot;</span>)
    root = <span class="hljs-string">&quot;./train&quot;</span>  <span class="hljs-comment"># Path to your dataset</span>
    insert = <span class="hljs-literal">True</span>
    <span class="hljs-keyword">if</span> insert:
        <span class="hljs-keyword">for</span> dirpath, _, filenames <span class="hljs-keyword">in</span> os.walk(root):
            <span class="hljs-keyword">for</span> filename <span class="hljs-keyword">in</span> filenames:
                <span class="hljs-keyword">if</span> filename.endswith(<span class="hljs-string">&quot;.jpeg&quot;</span>):
                    filepath = os.path.join(dirpath, filename)
                    image_embedding = extractor(filepath)
                    client.insert(
                        <span class="hljs-string">&quot;image_embeddings&quot;</span>,
                        {<span class="hljs-string">&quot;vector&quot;</span>: image_embedding, <span class="hljs-string">&quot;filename&quot;</span>: filepath},
                    )
<button class="copy-code-btn"></button></code></pre>
<h4 id="Conduct-an-Image-Search" class="common-anchor-header">Effectuer une recherche d'images</h4><p>Notre base de données étant alimentée, nous pouvons maintenant rechercher des images similaires. C'est là que la magie opère : nous pouvons trouver des photos visuellement similaires en utilisant la similarité vectorielle :</p>
<pre><code translate="no">    <span class="hljs-keyword">from</span> IPython.display <span class="hljs-keyword">import</span> display
    <span class="hljs-keyword">from</span> PIL <span class="hljs-keyword">import</span> Image
    query_image = <span class="hljs-string">&quot;./search-image.jpeg&quot;</span>  <span class="hljs-comment"># The image you want to search with</span>
    results = client.search(
        <span class="hljs-string">&quot;image_embeddings&quot;</span>,
        data=[extractor(query_image)],
        output_fields=[<span class="hljs-string">&quot;filename&quot;</span>],
        search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
        limit=<span class="hljs-number">6</span>,  <span class="hljs-comment"># Top-k results</span>
    )
    images = []
    <span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results:
        <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> result[:<span class="hljs-number">10</span>]:
            filename = hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;filename&quot;</span>]
            img = Image.<span class="hljs-built_in">open</span>(filename)
            img = img.resize((<span class="hljs-number">150</span>, <span class="hljs-number">150</span>))
            images.append(img)
    width = <span class="hljs-number">150</span> * <span class="hljs-number">3</span>
    height = <span class="hljs-number">150</span> * <span class="hljs-number">2</span>
    concatenated_image = Image.new(<span class="hljs-string">&quot;RGB&quot;</span>, (width, height))
    <span class="hljs-keyword">for</span> idx, img <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(images):
        x = idx % <span class="hljs-number">5</span>
        y = idx // <span class="hljs-number">5</span>
        concatenated_image.paste(img, (x * <span class="hljs-number">150</span>, y * <span class="hljs-number">150</span>))

    display(<span class="hljs-string">&quot;query&quot;</span>)
    display(Image.<span class="hljs-built_in">open</span>(query_image).resize((<span class="hljs-number">150</span>, <span class="hljs-number">150</span>)))
    display(<span class="hljs-string">&quot;results&quot;</span>)
    display(concatenated_image)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Les images obtenues sont présentées ci-dessous :</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_1_8d4e88c6dd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Combine-Vector-Search-with-GPT-4o-Generating-Ghibli-Style-Images-with-Images-Returned-by-Milvus" class="common-anchor-header">Combiner la recherche vectorielle avec GPT-4o : Génération d'images de style Ghibli à partir d'images renvoyées par Milvus</h3><p>Voici maintenant la partie la plus excitante : utiliser les résultats de notre recherche d'images comme données d'entrée pour GPT-4o afin de générer un contenu créatif. Dans mon cas, je voulais créer des bandes dessinées mettant en scène mon chien Cola à partir de photos que j'avais prises.</p>
<p>Le processus est simple mais puissant :</p>
<ol>
<li><p>Utiliser la recherche vectorielle pour trouver des images pertinentes de Cola dans ma collection.</p></li>
<li><p>Alimenter GPT-4o avec ces images et des invites créatives.</p></li>
<li><p>Générer des bandes dessinées uniques basées sur l'inspiration visuelle</p></li>
</ol>
<p>Voici quelques exemples de ce que cette combinaison peut produire :</p>
<p><strong>Les invites que j'utilise :</strong></p>
<ul>
<li><p><em>"Créez une bande dessinée hilarante de quatre planches en couleur mettant en scène un border collie surpris en train de ronger une souris, avec un moment gênant lorsque le propriétaire s'en aperçoit."<br><em>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Screenshot_2025_04_02_at_11_34_43_1d7141eef3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</em></em></p></li>
<li><p><em>"Dessinez une bande dessinée dans laquelle ce chien porte une jolie tenue."<br><em>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/cutedog_6fdb1e9c79.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</em></em></p></li>
<li><p><em>"En utilisant ce chien comme modèle, créez une bande dessinée dans laquelle il entre à l'école de sorcellerie Poudlard."<br><em>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Screenshot_2025_04_02_at_11_44_00_ce932cd035.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</em></em></p></li>
</ul>
<h3 id="A-Few-Quick-Tips-from-My-Experience-of-Image-Generation" class="common-anchor-header">Quelques conseils rapides tirés de mon expérience de la génération d'images :</h3><ol>
<li><p><strong>Restez simple</strong>: Contrairement à ces modèles de diffusion délicats, le GPT-4o fonctionne mieux avec des messages simples. Je me suis surpris à écrire des questions de plus en plus courtes au fur et à mesure que j'avançais, ce qui m'a permis d'obtenir de meilleurs résultats.</p></li>
<li><p><strong>L'anglais fonctionne mieux</strong>: J'ai essayé de rédiger des messages-guides en chinois pour certaines bandes dessinées, mais les résultats n'étaient pas très bons. J'ai fini par rédiger mes messages-guides en anglais, puis par traduire les bandes dessinées terminées lorsque cela était nécessaire.</p></li>
<li><p><strong>Ce n'est pas bon pour la génération vidéo</strong>: Ne vous faites pas encore trop d'illusions sur Sora : les vidéos générées par l'IA ont encore des progrès à faire en matière de fluidité des mouvements et de cohérence des scénarios.</p></li>
</ol>
<h2 id="Whats-Next-My-Perspective-and-Open-for-Discussion" class="common-anchor-header">Et maintenant ? Mon point de vue et ouvert à la discussion<button data-href="#Whats-Next-My-Perspective-and-Open-for-Discussion" class="anchor-icon" translate="no">
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
    </button></h2><p>Avec les images générées par l'IA en tête, un rapide coup d'œil aux principales publications d'OpenAI au cours des six derniers mois montre un schéma clair : qu'il s'agisse de GPT pour les places de marché d'applications, de DeepResearch pour la génération de rapports, de GPT-4o pour la création d'images conversationnelles ou de Sora pour la magie vidéo, les grands modèles d'IA sortent de l'ombre pour se retrouver sous les feux de la rampe. Ce qui était autrefois une technologie expérimentale est en train de mûrir pour devenir des produits réels et utilisables.</p>
<p>À mesure que le GPT-4o et d'autres modèles similaires sont largement acceptés, la plupart des flux de travail et des agents intelligents basés sur la diffusion stable sont en voie d'obsolescence. Toutefois, la valeur irremplaçable des données privées et des connaissances humaines reste forte. Par exemple, même si l'IA ne remplacera pas complètement les agences de création, l'intégration d'une base de données vectorielles Milvus avec des modèles GPT permet aux agences de générer rapidement des idées nouvelles et créatives inspirées de leurs succès passés. Les plateformes de commerce électronique peuvent concevoir des vêtements personnalisés en fonction des tendances d'achat, et les établissements d'enseignement peuvent créer instantanément des visuels pour les documents de recherche.</p>
<p>L'ère des produits alimentés par des modèles d'IA est arrivée, et la course à l'exploitation de la mine d'or de données ne fait que commencer. Pour les développeurs comme pour les entreprises, le message est clair : combinez vos données uniques avec ces puissants modèles ou risquez d'être laissé pour compte.</p>
