---
id: >-
  generate-more-creative-and-curated-ghibli-style-images-with-gpt-4o-and-milvus.md
title: >-
  Geração de imagens mais criativas e selecionadas ao estilo Ghibli com GPT-4o e
  Milvus
author: Lumina Wang
date: 2025-04-01T00:00:00.000Z
desc: >-
  Ligar os seus dados privados ao GPT-4o Utilizar o Milvus para obter mais
  imagens selecionadas
cover: assets.zilliz.com/GPT_4opagephoto_5e934b89e5.png
tag: Engineering
tags: 'GPT-4o, Database, Milvus, Artificial Intelligence, Image Generation'
canonicalUrl: >-
  https://milvus.io/blog/generate-more-creative-and-curated-ghibli-style-images-with-gpt-4o-and-milvus.md
---
<h2 id="Everyone-Became-an-Artist-Overnight-with-GPT-4o" class="common-anchor-header">Toda a gente se tornou um artista da noite para o dia com o GPT-4o<button data-href="#Everyone-Became-an-Artist-Overnight-with-GPT-4o" class="anchor-icon" translate="no">
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
<p><em>Acredites ou não, a imagem que acabaste de ver foi gerada por IA - especificamente, pelo recém-lançado GPT-4o!</em></p>
<p>Quando a OpenAI lançou a funcionalidade de geração de imagem nativa do GPT-4o a 26 de março, ninguém poderia prever o tsunami criativo que se seguiu. De um dia para o outro, a Internet explodiu com retratos ao estilo Ghibli gerados por IA - celebridades, políticos, animais de estimação e até os próprios utilizadores foram transformados em encantadoras personagens do Studio Ghibli com apenas algumas instruções simples. A procura foi tão grande que o próprio Sam Altman teve de "implorar" aos utilizadores para abrandarem o ritmo, tweetando que as "GPUs estão a derreter" da OpenAI.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Ghibli_32e739c2ac.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Exemplo de imagens geradas pelo GPT-4o (crédito X@Jason Reid)</p>
<h2 id="Why-GPT-4o-Changes-Everything" class="common-anchor-header">Por que a GPT-4o muda tudo<button data-href="#Why-GPT-4o-Changes-Everything" class="anchor-icon" translate="no">
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
    </button></h2><p>Para as indústrias criativas, isso representa uma mudança de paradigma. As tarefas que antes exigiam um dia inteiro de uma equipa de design podem agora ser concluídas em meros minutos. O que torna o GPT-4o diferente dos geradores de imagens anteriores é a <strong>sua notável consistência visual e a sua interface intuitiva</strong>. Suporta conversas multi-voltas que lhe permitem refinar imagens adicionando elementos, ajustando proporções, alterando estilos, ou mesmo transformando 2D em 3D - essencialmente colocando um designer profissional no seu bolso.</p>
<p>O segredo por detrás do desempenho superior do GPT-4o? É a sua arquitetura auto-regressiva. Ao contrário dos modelos de difusão (como o Stable Diffusion) que degradam as imagens em ruído antes de as reconstruir, o GPT-4o gera imagens sequencialmente - um token de cada vez - mantendo a consciência contextual durante todo o processo. Esta diferença arquitetónica fundamental explica porque é que o GPT-4o produz resultados mais coerentes com pedidos mais simples e mais naturais.</p>
<p>Mas é aqui que as coisas ficam interessantes para os programadores: <strong>Um número crescente de sinais aponta para uma tendência importante - os próprios modelos de IA estão a tornar-se produtos. Em termos simples, a maioria dos produtos que simplesmente envolvem grandes modelos de IA em torno de dados de domínio público correm o risco de ficar para trás.</strong></p>
<p>O verdadeiro poder destes avanços advém da combinação de grandes modelos de uso geral com <strong>dados privados e específicos de um domínio</strong>. Esta combinação pode muito bem ser a melhor estratégia de sobrevivência para a maioria das empresas na era dos grandes modelos linguísticos. À medida que os modelos de base continuam a evoluir, a vantagem competitiva duradoura pertencerá àqueles que conseguirem integrar eficazmente os seus conjuntos de dados proprietários com estes poderosos sistemas de IA.</p>
<p>Vamos explorar como ligar os seus dados privados ao GPT-4o utilizando o Milvus, uma base de dados vetorial de código aberto e de elevado desempenho.</p>
<h2 id="Connecting-Your-Private-Data-with-GPT-4o-Using-Milvus-for-More-Curated-Image-Outputs" class="common-anchor-header">Ligar os seus dados privados ao GPT-4o utilizando o Milvus para obter resultados de imagem mais curados<button data-href="#Connecting-Your-Private-Data-with-GPT-4o-Using-Milvus-for-More-Curated-Image-Outputs" class="anchor-icon" translate="no">
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
    </button></h2><p>As bases de dados vectoriais são a tecnologia chave que liga os seus dados privados aos modelos de IA. Funcionam convertendo o seu conteúdo - sejam imagens, texto ou áudio - em representações matemáticas (vectores) que captam o seu significado e caraterísticas. Isto permite uma pesquisa semântica baseada na semelhança e não apenas em palavras-chave.</p>
<p>O Milvus, como base de dados de vectores de código aberto líder, é particularmente adequado para ligação a ferramentas de IA generativa como o GPT-4o. Eis como a utilizei para resolver um desafio pessoal.</p>
<h3 id="Background" class="common-anchor-header">Contexto</h3><p>Um dia, tive uma ideia brilhante - transformar todas as travessuras do meu cão Cola numa banda desenhada. Mas havia um senão: Como é que eu podia filtrar dezenas de milhares de fotografias de trabalho, viagens e aventuras gastronómicas para encontrar os momentos de travessura da Cola?</p>
<p>A resposta? Importar todas as minhas fotografias para o Milvus e fazer uma pesquisa de imagens.</p>
<p>Vamos analisar a implementação passo a passo.</p>
<h4 id="Dependencies-and-Environment" class="common-anchor-header">Dependências e ambiente</h4><p>Primeiro, precisa de preparar o seu ambiente com os pacotes certos:</p>
<pre><code translate="no">pip install pymilvus --upgrade
pip install torch numpy scikit-learn pillow
<button class="copy-code-btn"></button></code></pre>
<h4 id="Prepare-the-Data" class="common-anchor-header">Preparar os dados</h4><p>Vou utilizar a minha biblioteca de fotografias, que tem cerca de 30.000 fotografias, como conjunto de dados neste guia. Se não tiver nenhum conjunto de dados à mão, descarregue um conjunto de dados de amostra do Milvus e descompacte-o:</p>
<pre><code translate="no">!wget https://github.com/milvus-io/pymilvus-assets/releases/download/imagedata/reverse_image_search.<span class="hljs-built_in">zip</span>
!unzip -q -o reverse_image_search.<span class="hljs-built_in">zip</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Define-the-Feature-Extractor" class="common-anchor-header">Definir o extrator de caraterísticas</h4><p>Usaremos o modo ResNet-50 da biblioteca <code translate="no">timm</code> para extrair vetores de incorporação de nossas imagens. Este modelo foi treinado em milhões de imagens e pode extrair caraterísticas significativas que representam o conteúdo visual.</p>
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
<h4 id="Create-a-Milvus-Collection" class="common-anchor-header">Criar uma coleção Milvus</h4><p>Em seguida, vamos criar uma coleção Milvus para armazenar os nossos embeddings de imagem. Pense nisto como uma base de dados especializada, explicitamente concebida para a pesquisa de semelhanças vectoriais:</p>
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
<p><strong>Notas sobre o MilvusClient Parâmetros:</strong></p>
<ul>
<li><p><strong>Configuração local:</strong> Usar um ficheiro local (por exemplo, <code translate="no">./milvus.db</code>) é a forma mais fácil de começar - o Milvus Lite tratará de todos os seus dados.</p></li>
<li><p><strong>Aumentar a escala:</strong> Para grandes conjuntos de dados, configure um servidor Milvus robusto usando Docker ou Kubernetes e use seu URI (por exemplo, <code translate="no">http://localhost:19530</code>).</p></li>
<li><p><strong>Opção de nuvem:</strong> Se estiver no Zilliz Cloud (o serviço totalmente gerido do Milvus), ajuste o seu URI e token para corresponder ao ponto de extremidade público e à chave da API.</p></li>
</ul>
<h4 id="Insert-Image-Embeddings-into-Milvus" class="common-anchor-header">Inserir imagens incorporadas no Milvus</h4><p>Agora vem o processo de analisar cada imagem e armazenar a sua representação vetorial. Este passo pode demorar algum tempo, dependendo do tamanho do conjunto de dados, mas é um processo único:</p>
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
<h4 id="Conduct-an-Image-Search" class="common-anchor-header">Efetuar uma pesquisa de imagens</h4><p>Com a nossa base de dados preenchida, podemos agora procurar imagens semelhantes. É aqui que a magia acontece - podemos encontrar fotografias visualmente semelhantes utilizando a semelhança vetorial:</p>
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
<p><strong>As imagens retornadas são mostradas abaixo:</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_1_8d4e88c6dd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Combine-Vector-Search-with-GPT-4o-Generating-Ghibli-Style-Images-with-Images-Returned-by-Milvus" class="common-anchor-header">Combinar a Pesquisa Vetorial com o GPT-4o: Gerando imagens no estilo Ghibli com imagens retornadas pelo Milvus</h3><p>Agora vem a parte emocionante: usar os resultados da pesquisa de imagens como entrada para o GPT-4o para gerar conteúdo criativo. No meu caso, queria criar bandas desenhadas com o meu cão Cola, com base em fotografias que tirei.</p>
<p>O fluxo de trabalho é simples mas poderoso:</p>
<ol>
<li><p>Utilizar a pesquisa vetorial para encontrar imagens relevantes da Cola na minha coleção</p></li>
<li><p>Alimentar o GPT-4o com estas imagens com sugestões criativas</p></li>
<li><p>Gerar banda desenhada única com base na inspiração visual</p></li>
</ol>
<p>Aqui estão alguns exemplos do que esta combinação pode produzir:</p>
<p><strong>As instruções que utilizo:</strong></p>
<ul>
<li><p><em>"Crie uma banda desenhada hilariante de quatro painéis, a cores, com um Border Collie apanhado a roer um rato - com um momento embaraçoso quando o dono descobre."<br><em>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Screenshot_2025_04_02_at_11_34_43_1d7141eef3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</em></em></p></li>
<li><p><em>"Desenhe uma banda desenhada em que este cão usa uma roupa gira."<br><em>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/cutedog_6fdb1e9c79.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</em></em></p></li>
<li><p><em>"Usando este cão como modelo, crie uma banda desenhada com ele a frequentar a Escola de Magia e Bruxaria de Hogwarts."<br><em>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Screenshot_2025_04_02_at_11_44_00_ce932cd035.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</em></em></p></li>
</ul>
<h3 id="A-Few-Quick-Tips-from-My-Experience-of-Image-Generation" class="common-anchor-header">Algumas dicas rápidas da minha experiência de criação de imagens:</h3><ol>
<li><p><strong>Mantenha a simplicidade</strong>: Ao contrário dos modelos de difusão, o GPT-4o funciona melhor com sugestões simples. Dei por mim a escrever propostas cada vez mais curtas à medida que avançava, e a obter melhores resultados.</p></li>
<li><p><strong>O inglês funciona melhor</strong>: Tentei escrever as instruções em chinês para algumas bandas desenhadas, mas os resultados não foram muito bons. Acabei por escrever as minhas sugestões em inglês e depois traduzi as bandas desenhadas acabadas, quando necessário.</p></li>
<li><p><strong>Não é bom para a Video Generation</strong>: Os vídeos gerados por I.A. ainda têm um longo caminho a percorrer no que diz respeito a movimentos fluidos e histórias coerentes.</p></li>
</ol>
<h2 id="Whats-Next-My-Perspective-and-Open-for-Discussion" class="common-anchor-header">O que se segue? A minha perspetiva e aberto a discussão<button data-href="#Whats-Next-My-Perspective-and-Open-for-Discussion" class="anchor-icon" translate="no">
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
    </button></h2><p>Com as imagens geradas por IA a liderar o ataque, um rápido olhar sobre os principais lançamentos da OpenAI nos últimos seis meses mostra um padrão claro: quer sejam GPTs para mercados de aplicações, DeepResearch para geração de relatórios, GPT-4o para criação de imagens conversacionais ou Sora para magia de vídeo - os grandes modelos de IA estão a sair de trás da cortina para a ribalta. O que antes era tecnologia experimental está agora a amadurecer em produtos reais e utilizáveis.</p>
<p>À medida que o GPT-4o e modelos semelhantes se tornam amplamente aceites, a maioria dos fluxos de trabalho e agentes inteligentes baseados na difusão estável estão a caminhar para a obsolescência. No entanto, o valor insubstituível dos dados privados e da perceção humana continua a ser forte. Por exemplo, embora a IA não substitua completamente as agências criativas, a integração de uma base de dados de vectores Milvus com modelos GPT permite às agências gerar rapidamente ideias novas e criativas inspiradas nos seus sucessos passados. As plataformas de comércio eletrónico podem conceber vestuário personalizado com base nas tendências de compra e as instituições académicas podem criar instantaneamente imagens para trabalhos de investigação.</p>
<p>A era dos produtos alimentados por modelos de IA chegou, e a corrida para explorar a mina de ouro de dados está apenas a começar. Tanto para os programadores como para as empresas, a mensagem é clara: combine os seus dados únicos com estes modelos poderosos ou arrisque-se a ficar para trás.</p>
