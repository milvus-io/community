---
id: test-and-deploy-vector-search-solutions-milvus-bootcamp.md
title: Quickly Test and Deploy Vector Search Solutions with the Milvus 2.0 Bootcamp
author: milvus
date: 2021-07-15T03:05:45.742Z
desc: >-
  Build, test, and customize vector similarity search solutions with Milvus, an
  open-source vector database.
cover: assets.zilliz.com/cover_80db9ee49c.png
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/test-and-deploy-vector-search-solutions-milvus-bootcamp
---
<custom-h1>Quickly Test and Deploy Vector Search Solutions with the Milvus 2.0 Bootcamp</custom-h1><p>With the release of Milvus 2.0, the team has revamped the Milvus <a href="https://github.com/milvus-io/bootcamp">bootcamp</a>. The new and improved bootcamp offers updated guides and easier to follow code examples for a variety of use cases and deployments. Additionally, this new version is updated for <a href="https://milvus.io/blog/milvus2.0-redefining-vector-database.md">Milvus 2.0</a>, a reimagined version of the world’s most advanced vector databse.</p>
<h3 id="Stress-test-your-system-against-1M-and-100M-dataset-benchmarks" class="common-anchor-header">Stress test your system against 1M and 100M dataset benchmarks</h3><p>The <a href="https://github.com/milvus-io/bootcamp/tree/master/benchmark_test">benchmark directory</a> contains 1 million and 100 million vector benchmark tests that indicate how your system will react to differently sized datasets.</p>
<p><br/></p>
<h3 id="Explore-and-build-popular-vector-similarity-search-solutions" class="common-anchor-header">Explore and build popular vector similarity search solutions</h3><p>The <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions">solution directory</a> includes the most popular vector similarity search use cases. Each use case contains a notebook solution and a docker deployable solution. Use cases include:</p>
<ul>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/reverse_image_search">Image similarity search</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/video_similarity_search">Video similarity search</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/audio_similarity_search">Audio similarity search</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/recommendation_system">Recommendation system</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/molecular_similarity_search">Molecular search</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/question_answering_system">Question answering system</a></li>
</ul>
<p><br/></p>
<h3 id="Quickly-deploy-a-fully-built-application-on-any-system" class="common-anchor-header">Quickly deploy a fully built application on any system</h3><p>The quick deploy solutions are dockerized solutions that allow users to deploy fully built applications on any system. These solutions are ideal for brief demos, but require additional work to customize and understand compared to notebooks.</p>
<p><br/></p>
<h3 id="Use-scenario-specific-notebooks-to-easily-deploy-pre-configured-applications" class="common-anchor-header">Use scenario specific notebooks to easily deploy pre-configured applications</h3><p>The notebooks contain a simple example of deploying Milvus to solve the problem in a given use case. Each of the examples are able to be run from start to finish without the need to manage files or configurations. Each notebook is also easy to follow and modifiable, making them ideal base files for other projects.</p>
<p><br/></p>
<h3 id="Image-similarity-search-notebook-example" class="common-anchor-header">Image similarity search notebook example</h3><p>Image similarity search is one of the core ideas behind many different technologies, including autonomous cars recognizing objects. This example explains how to easily build computer vision programs with Milvus.</p>
<p>This notebookrevolves around three things:</p>
<ul>
<li>Milvus server</li>
<li>Redis server (for metadata storage)</li>
<li>Pretrained Resnet-18 model.</li>
</ul>
<h4 id="Step-1-Download-required-packages" class="common-anchor-header">Step 1: Download required packages</h4><p>Begin by downloading all the required packages for this project. This notebook includes a table listing the packages to use.</p>
<pre><code translate="no">pip install -r requirements.txt
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-2-Server-startup" class="common-anchor-header">Step 2: Server startup</h4><p>After the packages are installed, start the servers and ensure both are running properly. Be sure to follow the correct instructions for starting the <a href="https://milvus.io/docs/v2.0.x/install_standalone-docker.md">Milvus</a> and <a href="https://hub.docker.com/_/redis">Redis</a> servers.</p>
<h4 id="Step-3-Download-project-data" class="common-anchor-header">Step 3: Download project data</h4><p>By default, this notebook pulls a snippet of the VOCImage data for use as an example, but any directory with images should work as long as it follows the file structure that can be seen at the top of the notebook.</p>
<pre><code translate="no">! gdown <span class="hljs-string">&quot;https://drive.google.com/u/1/uc?id=1jdudBiUu41kL-U5lhH3ari_WBRXyedWo&amp;export=download&quot;</span>
! tar -xf <span class="hljs-string">&#x27;VOCdevkit.zip&#x27;</span>
! <span class="hljs-built_in">rm</span> <span class="hljs-string">&#x27;VOCdevkit.zip&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-4-Connect-to-the-servers" class="common-anchor-header">Step 4: Connect to the servers</h4><p>In this example, the servers are running on the default ports on the localhost.</p>
<pre><code translate="no">connections.<span class="hljs-title function_">connect</span>(host=<span class="hljs-string">&quot;127.0.0.1&quot;</span>, port=<span class="hljs-number">19537</span>)
red = redis.<span class="hljs-title class_">Redis</span>(host = <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>, port=<span class="hljs-number">6379</span>, db=<span class="hljs-number">0</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-5-Create-a-collection" class="common-anchor-header">Step 5: Create a collection</h4><p>After starting the servers, create a collection in Milvus for storing all the vectors. In this example, the dimension size is set to 512, the size of the resnet-18 output, and the similarity metric is set to the Euclidean distance (L2). Milvus supports a variety of different <a href="https://milvus.io/docs/v2.0.x/metric.md">similarity metrics</a>.</p>
<pre><code translate="no">collection_name = <span class="hljs-string">&quot;image_similarity_search&quot;</span>
dim = <span class="hljs-number">512</span>
default_fields = [
    schema.FieldSchema(name=<span class="hljs-string">&quot;id&quot;</span>, dtype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">True</span>),
    schema.FieldSchema(name=<span class="hljs-string">&quot;vector&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=dim)
]
default_schema = schema.CollectionSchema(fields=default_fields, description=<span class="hljs-string">&quot;Image test collection&quot;</span>)
collection = Collection(name=collection_name, schema=default_schema)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-6-Build-an-index-for-the-collection" class="common-anchor-header">Step 6: Build an index for the collection</h4><p>Once the collection is made, build an index for it. In this case, the IVF_SQ8 index is used. This index requires the ‘nlist’ parameter, which tells Milvus how many clusters to make within each datafile (segment). Different <a href="https://milvus.io/docs/v2.0.x/index.md">indices</a> require different parameters.</p>
<pre><code translate="no">default_index = {<span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;IVF_SQ8&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">2048</span>}, <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>}
collection.<span class="hljs-title function_">create_index</span>(field_name=<span class="hljs-string">&quot;vector&quot;</span>, index_params=default_index)
collection.<span class="hljs-title function_">load</span>()
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-7-Set-up-model-and-data-loader" class="common-anchor-header">Step 7: Set up model and data loader</h4><p>After the IVF_SQ8 index is built, set up the neural network and data loader. The pretrained pytorch resnet-18 used in this example is sans its last layer, which compresses vectors for classification and may lose valuable information.</p>
<pre><code translate="no">model = torch.hub.load(<span class="hljs-string">&#x27;pytorch/vision:v0.9.0&#x27;</span>, <span class="hljs-string">&#x27;resnet18&#x27;</span>, pretrained=<span class="hljs-literal">True</span>)
encoder = torch.nn.Sequential(*(<span class="hljs-built_in">list</span>(model.children())[:-<span class="hljs-number">1</span>]))
<button class="copy-code-btn"></button></code></pre>
<p>The dataset and data loader needs to be modified so that they are able to preprocess and batch the images while also providing the file paths of the images. This can be done with a slightly modified torchvision dataloader. For preprocessing, the images need to be cropped and normalized due to the resnet-18 model being trained on a specific size and value range.</p>
<pre><code translate="no">dataset = ImageFolderWithPaths(data_dir, transform=transforms.Compose([
                                                transforms.Resize(256),
                                                transforms.CenterCrop(224),
                                                transforms.ToTensor(),
                                                transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])]))

dataloader = torch.utils.data.DataLoader(dataset, num_workers=0, batch_si
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-8-Insert-vectors-into-the-collection" class="common-anchor-header">Step 8: Insert vectors into the collection</h4><p>With the collection setup, the images can be processed and loaded into the created collection. First the images are pulled by the dataloader and run through the resnet-18 model. The resulting vector embeddings are then inserted into Milvus, which returns a unique ID for each vector. The vector IDs and image file paths are then inserted as key-value pairs into the Redis server.</p>
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
<h4 id="Step-9-Conduct-a-vector-similarity-search" class="common-anchor-header">Step 9: Conduct a vector similarity search</h4><p>Once all of the data is inserted into Milvus and Redis, the actual vector similarity search can be performed. For this example, three randomly selected images are pulled out of the Redis server for a vector similarity search.</p>
<pre><code translate="no">random_ids = [<span class="hljs-built_in">int</span>(red.randomkey()) <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">3</span>)]
search_images = [x.decode(<span class="hljs-string">&quot;utf-8&quot;</span>) <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> red.mget(random_ids)]
<button class="copy-code-btn"></button></code></pre>
<p>These images first go through the same preprocessing that is found in Step 7 and are then pushed through the resnet-18 model.</p>
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
<p>Then the resulting vector embeddings are used to perform a search. First, set the search parameters, including the name of the collection to search, nprobe (the number of the clusters to search), and top_k (the number of returned vectors). In this example, the search should be very quick.</p>
<pre><code translate="no">search_params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: 32}}
start = time.time()
results = collection.search(embeddings, <span class="hljs-string">&quot;vector&quot;</span>, param=search_params, <span class="hljs-built_in">limit</span>=3, <span class="hljs-built_in">expr</span>=None)
end = time.time() - start
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-10-Image-search-results" class="common-anchor-header">Step 10: Image search results</h4><p>The vector IDs returned from the queries are used to find the corresponding images. Matplotlib is then used to display the image search results.
<br/></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/pic1_c8652c7fae.png" alt="pic1.png" class="doc-image" id="pic1.png" />
    <span>pic1.png</span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/pic2_355b054161.png" alt="pic2.png" class="doc-image" id="pic2.png" />
    <span>pic2.png</span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/pic3_01780c6aac.png" alt="pic3.png" class="doc-image" id="pic3.png" />
    <span>pic3.png</span>
  </span>
</p>
<p><br/></p>
<h3 id="Learn-how-to-deploy-Milvus-in-different-enviroments" class="common-anchor-header">Learn how to deploy Milvus in different enviroments</h3><p>The <a href="https://github.com/milvus-io/bootcamp/tree/master/deployments">deployments section</a> of the new bootcamp contains all the information for using Milvus in different environments and setups. It includes deploying Mishards, using Kubernetes with Milvus, load balancing, and more. Each environment has a detailed step by step guide explaining how to get Milvus working in it.</p>
<p><br/></p>
<h3 id="Dont-be-a-stranger" class="common-anchor-header">Don’t be a stranger</h3><ul>
<li>Read our our <a href="https://zilliz.com/blog">blog</a>.</li>
<li>Interact with our open-source community on <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Use or contribute to Milvus, the world’s most popular vector database, on <a href="https://github.com/milvus-io/milvus">Github</a>.</li>
</ul>
