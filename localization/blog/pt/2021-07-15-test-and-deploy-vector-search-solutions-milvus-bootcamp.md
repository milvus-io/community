---
id: test-and-deploy-vector-search-solutions-milvus-bootcamp.md
title: >-
  Teste e Implemente Rapidamente Soluções de Pesquisa Vetorial com o Bootcamp
  Milvus 2.0
author: milvus
date: 2021-07-15T03:05:45.742Z
desc: >-
  Crie, teste e personalize soluções de pesquisa de semelhanças vectoriais com o
  Milvus, uma base de dados vetorial de código aberto.
cover: assets.zilliz.com/cover_80db9ee49c.png
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/test-and-deploy-vector-search-solutions-milvus-bootcamp
---
<custom-h1>Teste e Implemente Rapidamente Soluções de Pesquisa Vetorial com o Bootcamp do Milvus 2.0</custom-h1><p>Com o lançamento do Milvus 2.0, a equipa renovou o <a href="https://github.com/milvus-io/bootcamp">bootcamp</a> do Milvus. O novo e melhorado bootcamp oferece guias actualizados e exemplos de código mais fáceis de seguir para uma variedade de casos de utilização e implementações. Além disso, esta nova versão é actualizada para o <a href="https://milvus.io/blog/milvus2.0-redefining-vector-database.md">Milvus 2.0</a>, uma versão reimaginada do banco de dados vetorial mais avançado do mundo.</p>
<h3 id="Stress-test-your-system-against-1M-and-100M-dataset-benchmarks" class="common-anchor-header">Teste de stress do seu sistema contra benchmarks de conjuntos de dados de 1M e 100M</h3><p>O <a href="https://github.com/milvus-io/bootcamp/tree/master/benchmark_test">diretório</a> de benchmark contém testes de benchmark de 1 milhão e 100 milhões de vetores que indicam como seu sistema reagirá a conjuntos de dados de tamanhos diferentes.</p>
<p><br/></p>
<h3 id="Explore-and-build-popular-vector-similarity-search-solutions" class="common-anchor-header">Explore e crie soluções populares de pesquisa de similaridade de vetores</h3><p>O diretório <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions">de soluções</a> inclui os casos de utilização de pesquisa por semelhança de vectores mais populares. Cada caso de uso contém uma solução de notebook e uma solução implantável no Docker. Os casos de uso incluem:</p>
<ul>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/reverse_image_search">Pesquisa de similaridade de imagens</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/video_similarity_search">Pesquisa de similaridade de vídeo</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/audio_similarity_search">Pesquisa de similaridade de áudio</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/recommendation_system">Sistema de recomendação</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/molecular_similarity_search">Pesquisa molecular</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/question_answering_system">Sistema de resposta a perguntas</a></li>
</ul>
<p><br/></p>
<h3 id="Quickly-deploy-a-fully-built-application-on-any-system" class="common-anchor-header">Implementar rapidamente uma aplicação totalmente criada em qualquer sistema</h3><p>As soluções de implementação rápida são soluções dockerizadas que permitem aos utilizadores implementar aplicações totalmente criadas em qualquer sistema. Essas soluções são ideais para demonstrações breves, mas exigem trabalho adicional para personalizar e entender em comparação com os notebooks.</p>
<p><br/></p>
<h3 id="Use-scenario-specific-notebooks-to-easily-deploy-pre-configured-applications" class="common-anchor-header">Use notebooks específicos do cenário para implantar facilmente aplicativos pré-configurados</h3><p>Os notebooks contêm um exemplo simples de implantação do Milvus para resolver o problema em um determinado caso de uso. Cada um dos exemplos pode ser executado do início ao fim sem a necessidade de gerir ficheiros ou configurações. Cada caderno é também fácil de seguir e modificável, tornando-os ficheiros de base ideais para outros projectos.</p>
<p><br/></p>
<h3 id="Image-similarity-search-notebook-example" class="common-anchor-header">Exemplo de bloco de notas de pesquisa de semelhança de imagens</h3><p>A pesquisa de semelhança de imagens é uma das ideias centrais por detrás de muitas tecnologias diferentes, incluindo carros autónomos que reconhecem objectos. Este exemplo explica como construir facilmente programas de visão computacional com o Milvus.</p>
<p>Este bloco de notas gira em torno de três coisas:</p>
<ul>
<li>Servidor Milvus</li>
<li>Servidor Redis (para armazenamento de metadados)</li>
<li>Modelo Resnet-18 pré-treinado.</li>
</ul>
<h4 id="Step-1-Download-required-packages" class="common-anchor-header">Passo 1: Descarregar os pacotes necessários</h4><p>Comece por descarregar todos os pacotes necessários para este projeto. Este bloco de notas inclui uma tabela que lista os pacotes a utilizar.</p>
<pre><code translate="no">pip install -r requirements.txt
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-2-Server-startup" class="common-anchor-header">Passo 2: Arranque do servidor</h4><p>Depois de os pacotes estarem instalados, inicie os servidores e certifique-se de que ambos estão a funcionar corretamente. Certifique-se de seguir as instruções corretas para iniciar os servidores <a href="https://milvus.io/docs/v2.0.x/install_standalone-docker.md">Milvus</a> e <a href="https://hub.docker.com/_/redis">Redis</a>.</p>
<h4 id="Step-3-Download-project-data" class="common-anchor-header">Passo 3: Descarregar dados do projeto</h4><p>Por predefinição, este bloco de notas extrai um fragmento dos dados VOCImage para utilização como exemplo, mas qualquer diretório com imagens deve funcionar desde que siga a estrutura de ficheiros que pode ser vista no topo do bloco de notas.</p>
<pre><code translate="no">! gdown <span class="hljs-string">&quot;https://drive.google.com/u/1/uc?id=1jdudBiUu41kL-U5lhH3ari_WBRXyedWo&amp;export=download&quot;</span>
! tar -xf <span class="hljs-string">&#x27;VOCdevkit.zip&#x27;</span>
! <span class="hljs-built_in">rm</span> <span class="hljs-string">&#x27;VOCdevkit.zip&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-4-Connect-to-the-servers" class="common-anchor-header">Passo 4: Ligar aos servidores</h4><p>Neste exemplo, os servidores estão a funcionar nas portas predefinidas no localhost.</p>
<pre><code translate="no">connections.<span class="hljs-title function_">connect</span>(host=<span class="hljs-string">&quot;127.0.0.1&quot;</span>, port=<span class="hljs-number">19537</span>)
red = redis.<span class="hljs-title class_">Redis</span>(host = <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>, port=<span class="hljs-number">6379</span>, db=<span class="hljs-number">0</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-5-Create-a-collection" class="common-anchor-header">Passo 5: Criar uma coleção</h4><p>Depois de iniciar os servidores, crie uma coleção no Milvus para armazenar todos os vectores. Neste exemplo, o tamanho da dimensão é definido como 512, o tamanho da saída do resnet-18, e a métrica de similaridade é definida como a distância euclidiana (L2). O Milvus suporta uma variedade de <a href="https://milvus.io/docs/v2.0.x/metric.md">métricas de similaridade</a> diferentes.</p>
<pre><code translate="no">collection_name = <span class="hljs-string">&quot;image_similarity_search&quot;</span>
dim = <span class="hljs-number">512</span>
default_fields = [
    schema.FieldSchema(name=<span class="hljs-string">&quot;id&quot;</span>, dtype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">True</span>),
    schema.FieldSchema(name=<span class="hljs-string">&quot;vector&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=dim)
]
default_schema = schema.CollectionSchema(fields=default_fields, description=<span class="hljs-string">&quot;Image test collection&quot;</span>)
collection = Collection(name=collection_name, schema=default_schema)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-6-Build-an-index-for-the-collection" class="common-anchor-header">Passo 6: Construir um índice para a coleção</h4><p>Uma vez criada a coleção, construa um índice para a mesma. Neste caso, é utilizado o índice IVF_SQ8. Este índice requer o parâmetro 'nlist', que indica ao Milvus quantos clusters devem ser criados em cada ficheiro de dados (segmento). <a href="https://milvus.io/docs/v2.0.x/index.md">Índices</a> diferentes requerem parâmetros diferentes.</p>
<pre><code translate="no">default_index = {<span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;IVF_SQ8&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">2048</span>}, <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>}
collection.<span class="hljs-title function_">create_index</span>(field_name=<span class="hljs-string">&quot;vector&quot;</span>, index_params=default_index)
collection.<span class="hljs-title function_">load</span>()
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-7-Set-up-model-and-data-loader" class="common-anchor-header">Etapa 7: Configurar o modelo e o carregador de dados</h4><p>Após a construção do índice IVF_SQ8, configure a rede neural e o carregador de dados. O pytorch resnet-18 pré-treinado utilizado neste exemplo não tem a última camada, que comprime os vectores para classificação e pode perder informações valiosas.</p>
<pre><code translate="no">model = torch.hub.load(<span class="hljs-string">&#x27;pytorch/vision:v0.9.0&#x27;</span>, <span class="hljs-string">&#x27;resnet18&#x27;</span>, pretrained=<span class="hljs-literal">True</span>)
encoder = torch.nn.Sequential(*(<span class="hljs-built_in">list</span>(model.children())[:-<span class="hljs-number">1</span>]))
<button class="copy-code-btn"></button></code></pre>
<p>O conjunto de dados e o carregador de dados precisam de ser modificados para poderem pré-processar e agrupar as imagens, fornecendo também os caminhos dos ficheiros das imagens. Isto pode ser feito com um carregador de dados torchvision ligeiramente modificado. Para o pré-processamento, as imagens precisam de ser cortadas e normalizadas devido ao facto de o modelo resnet-18 ter sido treinado num tamanho e intervalo de valores específicos.</p>
<pre><code translate="no">dataset = ImageFolderWithPaths(data_dir, transform=transforms.Compose([
                                                transforms.Resize(256),
                                                transforms.CenterCrop(224),
                                                transforms.ToTensor(),
                                                transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])]))

dataloader = torch.utils.data.DataLoader(dataset, num_workers=0, batch_si
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-8-Insert-vectors-into-the-collection" class="common-anchor-header">Passo 8: Inserir vectores na coleção</h4><p>Com a configuração da coleção, as imagens podem ser processadas e carregadas na coleção criada. Primeiro, as imagens são extraídas pelo carregador de dados e executadas através do modelo resnet-18. Os embeddings vectoriais resultantes são depois inseridos no Milvus, que devolve um ID único para cada vetor. Os IDs dos vectores e os caminhos dos ficheiros de imagem são então inseridos como pares chave-valor no servidor Redis.</p>
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
<h4 id="Step-9-Conduct-a-vector-similarity-search" class="common-anchor-header">Etapa 9: realizar uma pesquisa de similaridade de vetor</h4><p>Depois que todos os dados são inseridos no Milvus e no Redis, a pesquisa de similaridade de vetores pode ser realizada. Para este exemplo, três imagens selecionadas aleatoriamente são retiradas do servidor Redis para uma pesquisa de semelhança vetorial.</p>
<pre><code translate="no">random_ids = [<span class="hljs-built_in">int</span>(red.randomkey()) <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">3</span>)]
search_images = [x.decode(<span class="hljs-string">&quot;utf-8&quot;</span>) <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> red.mget(random_ids)]
<button class="copy-code-btn"></button></code></pre>
<p>Estas imagens passam primeiro pelo mesmo pré-processamento que é encontrado no Passo 7 e são depois passadas pelo modelo resnet-18.</p>
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
<p>Em seguida, os embeddings vectoriais resultantes são utilizados para efetuar uma pesquisa. Primeiro, defina os parâmetros de pesquisa, incluindo o nome da coleção a pesquisar, nprobe (o número de clusters a pesquisar) e top_k (o número de vectores devolvidos). Neste exemplo, a pesquisa deve ser muito rápida.</p>
<pre><code translate="no">search_params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: 32}}
start = time.time()
results = collection.search(embeddings, <span class="hljs-string">&quot;vector&quot;</span>, param=search_params, <span class="hljs-built_in">limit</span>=3, <span class="hljs-built_in">expr</span>=None)
end = time.time() - start
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-10-Image-search-results" class="common-anchor-header">Passo 10: Resultados da pesquisa de imagens</h4><p>Os IDs dos vectores devolvidos pelas consultas são utilizados para encontrar as imagens correspondentes. O Matplotlib é então utilizado para apresentar os resultados da pesquisa de imagens.<br/></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/pic1_c8652c7fae.png" alt="pic1.png" class="doc-image" id="pic1.png" />
   </span> <span class="img-wrapper"> <span>pic1.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/pic2_355b054161.png" alt="pic2.png" class="doc-image" id="pic2.png" /><span>pic2.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/pic3_01780c6aac.png" alt="pic3.png" class="doc-image" id="pic3.png" /><span>pic3.png</span> </span></p>
<p><br/></p>
<h3 id="Learn-how-to-deploy-Milvus-in-different-enviroments" class="common-anchor-header">Saiba como implementar o Milvus em diferentes ambientes</h3><p>A <a href="https://github.com/milvus-io/bootcamp/tree/master/deployments">secção de implementações</a> do novo bootcamp contém toda a informação para utilizar o Milvus em diferentes ambientes e configurações. Inclui a implantação de Mishards, usando Kubernetes com Milvus, balanceamento de carga e muito mais. Cada ambiente tem um guia passo a passo detalhado que explica como fazer o Milvus funcionar nele.</p>
<p><br/></p>
<h3 id="Dont-be-a-stranger" class="common-anchor-header">Não seja um estranho</h3><ul>
<li>Leia o nosso <a href="https://zilliz.com/blog">blogue</a>.</li>
<li>Interaja com a nossa comunidade de código aberto no <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Utilize ou contribua para o Milvus, a base de dados vetorial mais popular do mundo, no <a href="https://github.com/milvus-io/milvus">Github</a>.</li>
</ul>
