---
id: >-
  2021-11-26-accelerating-candidate-generation-in-recommender-systems-using-milvus-paired-with-paddlepaddle.md
title: >-
  Aceleração da geração de candidatos em sistemas de recomendação usando Milvus
  emparelhado com PaddlePaddle
author: Yunmei
date: 2021-11-26T00:00:00.000Z
desc: o fluxo de trabalho mínimo de um sistema de recomendação
cover: assets.zilliz.com/Candidate_generation_9baf7beb86.png
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/accelerating-candidate-generation-in-recommender-systems-using-milvus-paired-with-paddlepaddle
---
<p>Se tem experiência no desenvolvimento de um sistema de recomendação, é provável que tenha sido vítima de pelo menos uma das seguintes situações:</p>
<ul>
<li>O sistema é extremamente lento no retorno dos resultados devido à enorme quantidade de conjuntos de dados.</li>
<li>Os dados recentemente inseridos não podem ser processados em tempo real para pesquisa ou consulta.</li>
<li>A implementação do sistema de recomendação é assustadora.</li>
</ul>
<p>Este artigo tem como objetivo abordar as questões acima mencionadas e fornecer algumas ideias, apresentando um projeto de sistema de recomendação de produtos que utiliza o Milvus, uma base de dados vetorial de código aberto, emparelhada com o PaddlePaddle, uma plataforma de aprendizagem profunda.</p>
<p>Este artigo tem como objetivo descrever brevemente o fluxo de trabalho mínimo de um sistema de recomendação. Em seguida, apresenta os principais componentes e os detalhes de implementação deste projeto.</p>
<h2 id="The-basic-workflow-of-a-recommender-system" class="common-anchor-header">O fluxo de trabalho básico de um sistema de recomendação<button data-href="#The-basic-workflow-of-a-recommender-system" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de nos debruçarmos sobre o projeto propriamente dito, vamos primeiro analisar o fluxo de trabalho básico de um sistema de recomendação. Um sistema de recomendação pode apresentar resultados personalizados de acordo com os interesses e as necessidades únicas do utilizador. Para fazer essas recomendações personalizadas, o sistema passa por duas fases, a geração de candidatos e a classificação.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_29e27eb9b1.png" alt="2.png" class="doc-image" id="2.png" />
   </span> <span class="img-wrapper"> <span>2.png</span> </span></p>
<p>A primeira fase é a geração de candidatos, que devolve os dados mais relevantes ou semelhantes, como um produto ou um vídeo que corresponda ao perfil do utilizador. Durante a geração de candidatos, o sistema compara as caraterísticas do utilizador com os dados armazenados na sua base de dados e recupera os dados semelhantes. Em seguida, durante a classificação, o sistema pontua e reordena os dados recuperados. Finalmente, os resultados no topo da lista são mostrados aos utilizadores.</p>
<p>No nosso caso de um sistema de recomendação de produtos, o sistema começa por comparar o perfil do utilizador com as caraterísticas dos produtos em stock para filtrar uma lista de produtos que satisfaçam as necessidades do utilizador. Em seguida, o sistema pontua os produtos com base na sua semelhança com o perfil do utilizador, classifica-os e, finalmente, devolve os 10 melhores produtos ao utilizador.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_5850ba2c46.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span></p>
<h2 id="System-architecture" class="common-anchor-header">Arquitetura do sistema<button data-href="#System-architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>O sistema de recomendação de produtos deste projeto utiliza três componentes: MIND, PaddleRec e Milvus.</p>
<h3 id="MIND" class="common-anchor-header">MIND</h3><p>O<a href="https://arxiv.org/pdf/1904.08030">MIND</a>, abreviatura de &quot;Multi-Interest Network with Dynamic Routing for Recommendation at Tmall&quot; (rede de interesses múltiplos com encaminhamento dinâmico para recomendação no Tmall), é um algoritmo desenvolvido pelo Alibaba Group. Antes de o MIND ser proposto, a maioria dos modelos de IA predominantes para recomendação utilizavam um único vetor para representar os interesses variados de um utilizador. No entanto, um único vetor está longe de ser suficiente para representar os interesses exactos de um utilizador. Por conseguinte, o algoritmo MIND foi proposto para transformar os múltiplos interesses de um utilizador em vários vectores.</p>
<p>Especificamente, o MIND adopta uma <a href="https://arxiv.org/pdf/2005.09347">rede de interesses múltiplos</a> com encaminhamento dinâmico para processar os interesses múltiplos de um utilizador durante a fase de geração de candidatos. A rede de interesses múltiplos é uma camada de extrator de interesses múltiplos baseada no mecanismo de encaminhamento de cápsulas. Pode ser utilizada para combinar os comportamentos anteriores de um utilizador com os seus múltiplos interesses, de modo a obter um perfil de utilizador preciso.</p>
<p>O diagrama seguinte ilustra a estrutura de rede do MIND.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_9e6f284ea2.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<p>Para representar as caraterísticas dos utilizadores, o MIND utiliza os comportamentos e os interesses dos utilizadores como entradas e, em seguida, alimenta-os na camada de incorporação para gerar vectores de utilizadores, incluindo vectores de interesses e vectores de comportamento dos utilizadores. Em seguida, os vectores de comportamento dos utilizadores são introduzidos na camada de extração de interesses múltiplos para gerar cápsulas de interesses dos utilizadores. Depois de concatenar as cápsulas de interesse do utilizador com os embeddings do comportamento do utilizador e utilizar várias camadas ReLU para os transformar, o MIND produz vários vectores de representação do utilizador. Este projeto definiu que o MIND produzirá, em última análise, quatro vectores de representação do utilizador.</p>
<p>Por outro lado, as caraterísticas dos produtos passam pela camada de incorporação e são convertidas em vectores de itens esparsos. Em seguida, cada vetor de item passa por uma camada de agrupamento para se tornar um vetor denso.</p>
<p>Quando todos os dados são convertidos em vectores, é introduzida uma camada de atenção adicional sensível às etiquetas para orientar o processo de formação.</p>
<h3 id="PaddleRec" class="common-anchor-header">PaddleRec</h3><p><a href="https://github.com/PaddlePaddle/PaddleRec/blob/release/2.2.0/README_EN.md">A PaddleRec</a> é uma biblioteca de modelos de pesquisa em grande escala para recomendação. Faz parte do ecossistema Baidu <a href="https://github.com/PaddlePaddle/Paddle">PaddlePaddle</a>. O objetivo do PaddleRec é fornecer aos programadores uma solução integrada para criar um sistema de recomendação de forma fácil e rápida.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_35f7526ea7.png" alt="5.png" class="doc-image" id="5.png" />
   </span> <span class="img-wrapper"> <span>5.png</span> </span></p>
<p>Como mencionado no parágrafo inicial, os engenheiros que desenvolvem sistemas de recomendação têm frequentemente de enfrentar os desafios de uma fraca usabilidade e de uma implantação complicada do sistema. No entanto, o PaddleRec pode ajudar os programadores nos seguintes aspectos:</p>
<ul>
<li><p>Facilidade de uso: PaddleRec é uma biblioteca de código aberto que encapsula vários modelos populares na indústria, incluindo modelos para geração de candidatos, classificação, reranking, multitarefa e muito mais. Com o PaddleRec, pode testar instantaneamente a eficácia do modelo e melhorar a sua eficiência através da iteração. O PaddleRec oferece uma maneira fácil de treinar modelos para sistemas distribuídos com excelente desempenho. Ele é otimizado para o processamento de dados em larga escala de vetores esparsos. Pode facilmente escalar o PaddleRec horizontalmente e acelerar a sua velocidade de computação. Portanto, você pode criar rapidamente ambientes de treinamento no Kubernetes usando o PaddleRec.</p></li>
<li><p>Suporte para implantação: O PaddleRec fornece soluções de implantação online para seus modelos. Os modelos estão imediatamente prontos para utilização após a formação, apresentando flexibilidade e elevada disponibilidade.</p></li>
</ul>
<h3 id="Milvus" class="common-anchor-header">Milvus</h3><p><a href="https://milvus.io/docs/v2.0.x/overview.md">Milvus</a> é um banco de dados vetorial com uma arquitetura nativa da nuvem. É de código aberto no <a href="https://github.com/milvus-io">GitHub</a> e pode ser utilizada para armazenar, indexar e gerir vectores de incorporação maciços gerados por redes neurais profundas e outros modelos de aprendizagem automática (ML). O Milvus encapsula várias bibliotecas de pesquisa de vizinho mais próximo (ANN) aproximado de primeira classe, incluindo Faiss, NMSLIB e Annoy. Também pode escalar o Milvus de acordo com as suas necessidades. O serviço Milvus é altamente disponível e suporta processamento unificado em lote e fluxo. O Milvus está empenhado em simplificar o processo de gestão de dados não estruturados e em proporcionar uma experiência de utilizador consistente em diferentes ambientes de implementação. Possui as seguintes caraterísticas:</p>
<ul>
<li><p>Elevado desempenho na realização de pesquisas vectoriais em conjuntos de dados maciços.</p></li>
<li><p>Uma comunidade de programadores que dá prioridade ao suporte multilingue e à cadeia de ferramentas.</p></li>
<li><p>Escalabilidade na nuvem e elevada fiabilidade, mesmo em caso de interrupção.</p></li>
<li><p>Pesquisa híbrida conseguida através do emparelhamento da filtragem escalar com a pesquisa de semelhanças vectoriais.</p></li>
</ul>
<p>O Milvus é utilizado para a pesquisa por semelhança de vectores e para a gestão de vectores neste projeto porque pode resolver o problema das actualizações frequentes de dados, mantendo a estabilidade do sistema.</p>
<h2 id="System-implementation" class="common-anchor-header">Implementação do sistema<button data-href="#System-implementation" class="anchor-icon" translate="no">
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
    </button></h2><p>Para construir o sistema de recomendação de produtos deste projeto, é necessário seguir as seguintes etapas:</p>
<ol>
<li>Processamento de dados</li>
<li>Treino do modelo</li>
<li>Teste do modelo</li>
<li>Geração de candidatos a itens de produtos<ol>
<li>Armazenamento de dados: os vectores de itens são obtidos através do modelo treinado e armazenados no Milvus.</li>
<li>Pesquisa de dados: quatro vectores de utilizadores gerados pelo MIND são introduzidos no Milvus para pesquisa de semelhança de vectores.</li>
<li>Classificação dos dados: cada um dos quatro vectores tem os seus próprios <code translate="no">top_k</code> vectores de itens semelhantes, e os quatro conjuntos de <code translate="no">top_k</code> vectores são classificados para obter uma lista final de <code translate="no">top_k</code> vectores mais semelhantes.</li>
</ol></li>
</ol>
<p>O código-fonte deste projeto está alojado na plataforma <a href="https://aistudio.baidu.com/aistudio/projectdetail/2250360?contributionType=1&amp;shared=1">Baidu AI Studio</a>. A secção seguinte apresenta uma explicação detalhada do código-fonte deste projeto.</p>
<h3 id="Step-1-Data-processing" class="common-anchor-header">Passo 1. Processamento de dados</h3><p>O conjunto de dados original provém do conjunto de dados de livros da Amazon fornecido pela <a href="https://github.com/THUDM/ComiRec">ComiRec</a>. No entanto, este projeto utiliza os dados que são descarregados e processados pelo PaddleRec. Consulte o <a href="https://github.com/PaddlePaddle/PaddleRec/tree/release/2.1.0/datasets/AmazonBook">conjunto de dados AmazonBook</a> no projeto PaddleRec para mais informações.</p>
<p>Espera-se que o conjunto de dados para treino apareça no seguinte formato, com cada coluna a representar:</p>
<ul>
<li><code translate="no">Uid</code>: ID do utilizador.</li>
<li><code translate="no">item_id</code>: ID do item do produto que foi clicado pelo utilizador.</li>
<li><code translate="no">Time</code>: O carimbo de data/hora ou a ordem do clique.</li>
</ul>
<p>Espera-se que o conjunto de dados para teste apareça no seguinte formato, com cada coluna representando:</p>
<ul>
<li><p><code translate="no">Uid</code>: ID do utilizador.</p></li>
<li><p><code translate="no">hist_item</code>: ID do item de produto no comportamento histórico de cliques do utilizador. Quando há vários <code translate="no">hist_item</code>, eles são ordenados de acordo com o carimbo de data/hora.</p></li>
<li><p><code translate="no">eval_item</code>: A sequência real em que o utilizador clica nos produtos.</p></li>
</ul>
<h3 id="Step-2-Model-training" class="common-anchor-header">Passo 2. Treino do modelo</h3><p>O treino do modelo utiliza os dados processados na etapa anterior e adopta o modelo de geração de candidatos, MIND, baseado no PaddleRec.</p>
<h4 id="1-Model-input" class="common-anchor-header">1. <strong>Entrada</strong> <strong>do modelo</strong> </h4><p>Em <code translate="no">dygraph_model.py</code>, execute o seguinte código para processar os dados e transformá-los em entrada de modelo. Este processo ordena os itens clicados pelo mesmo utilizador nos dados originais de acordo com o carimbo de data/hora e combina-os para formar uma sequência. Em seguida, seleciona aleatoriamente um <code translate="no">item``_``id</code> da sequência como <code translate="no">target_item</code> e extrai os 10 itens anteriores a <code translate="no">target_item</code> como <code translate="no">hist_item</code> para a entrada do modelo. Se a sequência não for suficientemente longa, pode ser definida como 0. <code translate="no">seq_len</code> deve ser o comprimento real da sequência <code translate="no">hist_item</code>.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">create_feeds_train</span>(<span class="hljs-params">self, batch_data</span>):
    hist_item = paddle.to_tensor(batch_data[<span class="hljs-number">0</span>], dtype=<span class="hljs-string">&quot;int64&quot;</span>)
    target_item = paddle.to_tensor(batch_data[<span class="hljs-number">1</span>], dtype=<span class="hljs-string">&quot;int64&quot;</span>)
    seq_len = paddle.to_tensor(batch_data[<span class="hljs-number">2</span>], dtype=<span class="hljs-string">&quot;int64&quot;</span>)
    <span class="hljs-keyword">return</span> [hist_item, target_item, seq_len]
<button class="copy-code-btn"></button></code></pre>
<p>Consulte o script <code translate="no">/home/aistudio/recommend/model/mind/mind_reader.py</code> para obter o código de leitura do conjunto de dados original.</p>
<h4 id="2-Model-networking" class="common-anchor-header">2. <strong>Modelo de rede</strong></h4><p>O código seguinte é um extrato de <code translate="no">net.py</code>. <code translate="no">class Mind_Capsual_Layer</code> define a camada de extração de múltiplos interesses baseada no mecanismo de encaminhamento de cápsulas de interesse. A função <code translate="no">label_aware_attention()</code> implementa a técnica de atenção com reconhecimento de etiquetas no algoritmo MIND. A função <code translate="no">forward()</code> em <code translate="no">class MindLayer</code> modela as caraterísticas do utilizador e gera os vectores de peso correspondentes.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">class</span> <span class="hljs-title class_">Mind_Capsual_Layer</span>(nn.Layer):
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self</span>):
        <span class="hljs-built_in">super</span>(Mind_Capsual_Layer, <span class="hljs-variable language_">self</span>).__init__()
        <span class="hljs-variable language_">self</span>.iters = iters
        <span class="hljs-variable language_">self</span>.input_units = input_units
        <span class="hljs-variable language_">self</span>.output_units = output_units
        <span class="hljs-variable language_">self</span>.maxlen = maxlen
        <span class="hljs-variable language_">self</span>.init_std = init_std
        <span class="hljs-variable language_">self</span>.k_max = k_max
        <span class="hljs-variable language_">self</span>.batch_size = batch_size
        <span class="hljs-comment"># B2I routing</span>
        <span class="hljs-variable language_">self</span>.routing_logits = <span class="hljs-variable language_">self</span>.create_parameter(
            shape=[<span class="hljs-number">1</span>, <span class="hljs-variable language_">self</span>.k_max, <span class="hljs-variable language_">self</span>.maxlen],
            attr=paddle.ParamAttr(
                name=<span class="hljs-string">&quot;routing_logits&quot;</span>, trainable=<span class="hljs-literal">False</span>),
            default_initializer=nn.initializer.Normal(
                mean=<span class="hljs-number">0.0</span>, std=<span class="hljs-variable language_">self</span>.init_std))
        <span class="hljs-comment"># bilinear mapping</span>
        <span class="hljs-variable language_">self</span>.bilinear_mapping_matrix = <span class="hljs-variable language_">self</span>.create_parameter(
            shape=[<span class="hljs-variable language_">self</span>.input_units, <span class="hljs-variable language_">self</span>.output_units],
            attr=paddle.ParamAttr(
                name=<span class="hljs-string">&quot;bilinear_mapping_matrix&quot;</span>, trainable=<span class="hljs-literal">True</span>),
            default_initializer=nn.initializer.Normal(
                mean=<span class="hljs-number">0.0</span>, std=<span class="hljs-variable language_">self</span>.init_std))
                
<span class="hljs-keyword">class</span> <span class="hljs-title class_">MindLayer</span>(nn.Layer):

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">label_aware_attention</span>(<span class="hljs-params">self, keys, query</span>):
        weight = paddle.<span class="hljs-built_in">sum</span>(keys * query, axis=-<span class="hljs-number">1</span>, keepdim=<span class="hljs-literal">True</span>)
        weight = paddle.<span class="hljs-built_in">pow</span>(weight, <span class="hljs-variable language_">self</span>.pow_p)  <span class="hljs-comment"># [x,k_max,1]</span>
        weight = F.softmax(weight, axis=<span class="hljs-number">1</span>)
        output = paddle.<span class="hljs-built_in">sum</span>(keys * weight, axis=<span class="hljs-number">1</span>)
        <span class="hljs-keyword">return</span> output, weight

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">forward</span>(<span class="hljs-params">self, hist_item, seqlen, labels=<span class="hljs-literal">None</span></span>):
        hit_item_emb = <span class="hljs-variable language_">self</span>.item_emb(hist_item)  <span class="hljs-comment"># [B, seqlen, embed_dim]</span>
        user_cap, cap_weights, cap_mask = <span class="hljs-variable language_">self</span>.capsual_layer(hit_item_emb, seqlen)
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> <span class="hljs-variable language_">self</span>.training:
            <span class="hljs-keyword">return</span> user_cap, cap_weights
        target_emb = <span class="hljs-variable language_">self</span>.item_emb(labels)
        user_emb, W = <span class="hljs-variable language_">self</span>.label_aware_attention(user_cap, target_emb)

        <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.sampled_softmax(
            user_emb, labels, <span class="hljs-variable language_">self</span>.item_emb.weight,
            <span class="hljs-variable language_">self</span>.embedding_bias), W, user_cap, cap_weights, cap_mask
<button class="copy-code-btn"></button></code></pre>
<p>Consultar o guião <code translate="no">/home/aistudio/recommend/model/mind/net.py</code> para conhecer a estrutura específica da rede MIND.</p>
<h4 id="3-Model-optimization" class="common-anchor-header">3. <strong>Otimização do modelo</strong></h4><p>Este projeto utiliza <a href="https://arxiv.org/pdf/1412.6980">o algoritmo Adam</a> como optimizador do modelo.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">create_optimizer</span>(<span class="hljs-params">self, dy_model, config</span>):
    lr = config.get(<span class="hljs-string">&quot;hyper_parameters.optimizer.learning_rate&quot;</span>, <span class="hljs-number">0.001</span>)
    optimizer = paddle.optimizer.Adam(
        learning_rate=lr, parameters=dy_model.parameters())
    <span class="hljs-keyword">return</span> optimizer
<button class="copy-code-btn"></button></code></pre>
<p>Além disso, o PaddleRec escreve hiperparâmetros em <code translate="no">config.yaml</code>, pelo que basta modificar este ficheiro para ver uma comparação clara entre a eficácia dos dois modelos e melhorar a eficiência do modelo. Ao treinar o modelo, o mau efeito do modelo pode resultar do subajuste ou sobreajuste do modelo. Por conseguinte, é possível melhorá-lo modificando o número de rondas de treino. Neste projeto, basta alterar o parâmetro epochs em <code translate="no">config.yaml</code> para encontrar o número ideal de rondas de formação. Além disso, pode também alterar o optimizador do modelo, <code translate="no">optimizer.class</code>, ou <code translate="no">learning_rate</code> para depuração. O seguinte mostra parte dos parâmetros em <code translate="no">config.yaml</code>.</p>
<pre><code translate="no" class="language-YAML">runner:
  use_gpu: <span class="hljs-literal">True</span>
  use_auc: <span class="hljs-literal">False</span>
  train_batch_size: <span class="hljs-number">128</span>
  epochs: <span class="hljs-number">20</span>
  print_interval: <span class="hljs-number">10</span>
  model_save_path: <span class="hljs-string">&quot;output_model_mind&quot;</span>

<span class="hljs-comment"># hyper parameters of user-defined network</span>
hyper_parameters:
  <span class="hljs-comment"># optimizer config</span>
  optimizer:
    <span class="hljs-keyword">class</span>: Adam
    learning_rate: <span class="hljs-number">0.005</span>
<button class="copy-code-btn"></button></code></pre>
<p>Consulte o guião <code translate="no">/home/aistudio/recommend/model/mind/dygraph_model.py</code> para uma implementação detalhada.</p>
<h4 id="4-Model-training" class="common-anchor-header">4. <strong>Treino do modelo</strong></h4><p>Execute o seguinte comando para iniciar o treino do modelo.</p>
<pre><code translate="no" class="language-Bash">python -u trainer.py -m mind/config.yaml
<button class="copy-code-btn"></button></code></pre>
<p>Consulte <code translate="no">/home/aistudio/recommend/model/trainer.py</code> para obter o projeto de treino do modelo.</p>
<h3 id="Step-3-Model-testing" class="common-anchor-header">Passo 3. Teste do modelo</h3><p>Esta etapa utiliza o conjunto de dados de teste para verificar o desempenho, como a taxa de recuperação do modelo treinado.</p>
<p>Durante o teste do modelo, todos os vectores de itens são carregados a partir do modelo e, em seguida, importados para Milvus, a base de dados de vectores de código aberto. Leia o conjunto de dados de teste através do script <code translate="no">/home/aistudio/recommend/model/mind/mind_infer_reader.py</code>. Carregue o modelo na etapa anterior e introduza o conjunto de dados de teste no modelo para obter quatro vectores de interesse do utilizador. Procurar os 50 vectores de itens mais semelhantes aos quatro vectores de interesse em Milvus. Pode recomendar os resultados devolvidos aos utilizadores.</p>
<p>Execute o seguinte comando para testar o modelo.</p>
<pre><code translate="no" class="language-Bash">python -u infer.py -m mind/config.yaml -top_n 50
<button class="copy-code-btn"></button></code></pre>
<p>Durante o teste do modelo, o sistema fornece vários indicadores para avaliar a eficácia do modelo, tais como Recall@50, NDCG@50 e HitRate@50. Este artigo apenas apresenta a modificação de um parâmetro. No entanto, no seu próprio cenário de aplicação, é necessário treinar mais épocas para obter um melhor efeito do modelo.  Também é possível melhorar a eficácia do modelo utilizando diferentes optimizadores, definindo diferentes taxas de aprendizagem e aumentando o número de rondas de teste. Recomenda-se que guarde vários modelos com efeitos diferentes e, em seguida, escolha o que tem o melhor desempenho e se adequa melhor à sua aplicação.</p>
<h3 id="Step-4-Generating-product-item-candidates" class="common-anchor-header">Passo 4. Geração de candidatos a itens de produtos</h3><p>Para construir o serviço de geração de candidatos a produtos, este projeto utiliza o modelo treinado nos passos anteriores, emparelhado com o Milvus. Durante a geração de candidatos, o FASTAPI é utilizado para fornecer a interface. Quando o serviço é iniciado, é possível executar comandos diretamente no terminal através de <code translate="no">curl</code>.</p>
<p>Execute o seguinte comando para gerar candidatos preliminares.</p>
<pre><code translate="no" class="language-Bash">uvicorn main:app
<button class="copy-code-btn"></button></code></pre>
<p>O serviço fornece quatro tipos de interfaces:</p>
<ul>
<li><strong>Inserir</strong>: Execute o seguinte comando para ler os vectores de itens do seu modelo e inseri-los numa coleção em Milvus.</li>
</ul>
<pre><code translate="no" class="language-Nginx">curl -X <span class="hljs-string">&#x27;POST&#x27;</span> \
  <span class="hljs-string">&#x27;http://127.0.0.1:8000/rec/insert_data&#x27;</span> \
  -H <span class="hljs-string">&#x27;accept: application/json&#x27;</span> \
  -d <span class="hljs-string">&#x27;&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Gerar candidatos preliminares</strong>: Introduza a sequência em que os produtos são clicados pelo utilizador e descubra o próximo produto em que o utilizador pode clicar. Também pode gerar candidatos a itens de produtos em lotes para vários utilizadores de uma só vez. <code translate="no">hist_item</code> no comando seguinte é um vetor bidimensional e cada linha representa uma sequência de produtos em que o utilizador clicou no passado. É possível definir o comprimento da sequência. Os resultados devolvidos são também conjuntos de vectores bidimensionais, cada linha representando os <code translate="no">item id</code>s devolvidos para os utilizadores.</li>
</ul>
<pre><code translate="no" class="language-Ada">curl -X <span class="hljs-string">&#x27;POST&#x27;</span> \
  <span class="hljs-string">&#x27;http://127.0.0.1:8000/rec/recall&#x27;</span> \
  -H <span class="hljs-string">&#x27;accept: application/json&#x27;</span> \
  -H <span class="hljs-string">&#x27;Content-Type: application/json&#x27;</span> \
  -d <span class="hljs-string">&#x27;{
  &quot;top_k&quot;: 50,
  &quot;hist_item&quot;: [[43,23,65,675,3456,8654,123454,54367,234561],[675,3456,8654,123454,76543,1234,9769,5670,65443,123098,34219,234098]]
}&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Consultar o número total de</strong> <strong>itens do produto</strong>: Execute o seguinte comando para retornar o número total de vetores de itens armazenados no banco de dados Milvus.</li>
</ul>
<pre><code translate="no" class="language-Nginx">curl -X <span class="hljs-string">&#x27;POST&#x27;</span> \
  <span class="hljs-string">&#x27;http://127.0.0.1:8000/rec/count&#x27;</span> \
  -H <span class="hljs-string">&#x27;accept: application/json&#x27;</span> \
  -d <span class="hljs-string">&#x27;&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Eliminar</strong>: Execute o seguinte comando para eliminar todos os dados armazenados na base de dados Milvus.</li>
</ul>
<pre><code translate="no" class="language-Nginx">curl -X <span class="hljs-string">&#x27;POST&#x27;</span> \
  <span class="hljs-string">&#x27;http://127.0.0.1:8000/qa/drop&#x27;</span> \
  -H <span class="hljs-string">&#x27;accept: application/json&#x27;</span> \
  -d <span class="hljs-string">&#x27;&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Se executar o serviço de geração de candidatos no seu servidor local, pode também aceder às interfaces acima referidas em <code translate="no">127.0.0.1:8000/docs</code>. Pode experimentar clicando nas quatro interfaces e introduzindo os valores dos parâmetros. Em seguida, clique em "Try it out" para obter o resultado da recomendação.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_43e41086f8.png" alt="6.png" class="doc-image" id="6.png" />
   </span> <span class="img-wrapper"> <span>6.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_f016a3221d.png" alt="7.png" class="doc-image" id="7.png" />
   </span> <span class="img-wrapper"> <span>7.png</span> </span></p>
<h2 id="Recap" class="common-anchor-header">Recapitulação<button data-href="#Recap" class="anchor-icon" translate="no">
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
    </button></h2><p>Este artigo centra-se principalmente na primeira fase da geração de candidatos na construção de um sistema de recomendação. Também fornece uma solução para acelerar este processo, combinando o Milvus com o algoritmo MIND e o PaddleRec e, por conseguinte, abordou a questão proposta no parágrafo inicial.</p>
<p>E se o sistema for extremamente lento a devolver resultados devido à enorme quantidade de conjuntos de dados? Milvus, a base de dados vetorial de código aberto, foi concebida para uma pesquisa de semelhanças extremamente rápida em conjuntos de dados vectoriais densos que contêm milhões, milhares de milhões ou mesmo triliões de vectores.</p>
<p>E se os dados recentemente inseridos não puderem ser processados em tempo real para pesquisa ou consulta? Pode utilizar o Milvus, uma vez que este suporta o processamento unificado de fluxos e lotes e permite-lhe pesquisar e consultar dados recentemente inseridos em tempo real. Além disso, o modelo MIND é capaz de converter o novo comportamento do utilizador em tempo real e inserir os vectores do utilizador no Milvus instantaneamente.</p>
<p>E se a implementação complicada for demasiado intimidante? PaddleRec, uma biblioteca poderosa que pertence ao ecossistema PaddlePaddle, pode fornecer-lhe uma solução integrada para implementar o seu sistema de recomendação ou outras aplicações de uma forma fácil e rápida.</p>
<h2 id="About-the-author" class="common-anchor-header">Sobre o autor<button data-href="#About-the-author" class="anchor-icon" translate="no">
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
    </button></h2><p>Yunmei Li, engenheira de dados da Zilliz, licenciou-se em ciências informáticas na Universidade de Ciência e Tecnologia de Huazhong. Desde que se juntou à Zilliz, tem trabalhado na exploração de soluções para o projeto de código aberto Milvus e tem ajudado os utilizadores a aplicar o Milvus em cenários do mundo real. O seu foco principal é a PNL e os sistemas de recomendação, e gostaria de aprofundar ainda mais o seu foco nestas duas áreas. Gosta de passar tempo sozinha e de ler.</p>
<h2 id="Looking-for-more-resources" class="common-anchor-header">Está à procura de mais recursos?<button data-href="#Looking-for-more-resources" class="anchor-icon" translate="no">
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
<li>Mais casos de utilizador sobre a criação de um sistema de recomendação:<ul>
<li><a href="https://milvus.io/blog/building-a-personalized-product-recommender-system-with-vipshop-and-milvus.md">Criação de um sistema de recomendação de produtos personalizados com a Vipshop com Milvus</a></li>
<li><a href="https://milvus.io/blog/building-a-wardrobe-and-outfit-planning-app-with-milvus.md">Criar uma aplicação de planeamento de guarda-roupa e roupa com Milvus</a></li>
<li><a href="https://milvus.io/blog/building-an-intelligent-news-recommendation-system-inside-sohu-news-app.md">Criação de um sistema inteligente de recomendação de notícias dentro da aplicação Sohu News</a></li>
<li><a href="https://milvus.io/blog/music-recommender-system-item-based-collaborative-filtering-milvus.md">Filtragem colaborativa baseada em itens para um sistema de recomendação de música</a></li>
<li><a href="https://milvus.io/blog/Making-with-Milvus-AI-Powered-News-Recommendation-Inside-Xiaomi-Mobile-Browser.md">Criar com a Milvus: Recomendação de notícias com recurso a IA no navegador móvel da Xiaomi</a></li>
</ul></li>
<li>Mais projectos Milvus em colaboração com outras comunidades:<ul>
<li><a href="https://milvus.io/blog/2021-09-26-onnx.md">Combinar modelos de IA para pesquisa de imagens utilizando ONNX e Milvus</a></li>
<li><a href="https://milvus.io/blog/graph-based-recommendation-system-with-milvus.md">Criação de um sistema de recomendação baseado em gráficos com os conjuntos de dados Milvus, PinSage, DGL e Movielens</a></li>
<li><a href="https://milvus.io/blog/building-a-milvus-cluster-based-on-juicefs.md">Construir um cluster Milvus baseado em JuiceFS</a></li>
</ul></li>
<li>Envolva-se com a nossa comunidade de código aberto:<ul>
<li>Encontre ou contribua para o Milvus no <a href="https://bit.ly/307b7jC">GitHub</a></li>
<li>Interagir com a comunidade através do <a href="https://bit.ly/3qiyTEk">Fórum</a></li>
<li>Conecte-se conosco no <a href="https://bit.ly/3ob7kd8">Twitter</a></li>
</ul></li>
</ul>
