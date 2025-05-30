---
id: >-
  no-python-no-problem-model-inference-with-onnx-in-java-or-any-other-language.md
title: >-
  Sem Python, sem problemas: Inferência de modelos com ONNX em Java ou qualquer
  outra linguagem
author: Stefan Webb
date: 2025-05-30T00:00:00.000Z
desc: >-
  O ONNX (Open Neural Network Exchange) é um ecossistema de ferramentas
  independente de plataforma para a inferência de modelos de redes neurais.
cover: assets.zilliz.com/No_Python_No_Problem_7fe97dad46.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: >-
  build AI apps with Python, ONNX (Open Neural Network Exchange), Model
  inference, vector databases, Milvus
meta_title: >
  No Python, No Problem: Model Inference with ONNX in Java, or Any Other
  Language
origin: >-
  https://milvus.io/blog/no-python-no-problem-model-inference-with-onnx-in-java-or-any-other-language.md
---
<p>Nunca foi tão fácil criar aplicações de IA generativa. Um rico ecossistema de ferramentas, modelos de IA e conjuntos de dados permite que até mesmo engenheiros de software não especializados criem chatbots impressionantes, geradores de imagens e muito mais. Essas ferramentas, em sua maioria, são feitas para Python e são construídas sobre o PyTorch. Mas e quando você não tem acesso ao Python em produção e precisa usar Java, Golang, Rust, C++ ou outra linguagem?</p>
<p>Vamos nos restringir à inferência de modelos, incluindo modelos de incorporação e modelos de fundação; outras tarefas, como treinamento e ajuste fino de modelos, normalmente não são concluídas no momento da implantação. Quais são as nossas opções para a inferência de modelos sem Python? A solução mais óbvia é utilizar um serviço online de fornecedores como Anthropic ou Mistral. Normalmente, eles fornecem um SDK para outras linguagens além do Python e, se não o fizessem, seriam necessárias apenas chamadas simples à API REST. Mas e se a nossa solução tiver de ser totalmente local devido, por exemplo, a questões de conformidade ou privacidade?</p>
<p>Outra solução é executar um servidor Python localmente. O problema original foi colocado como sendo incapaz de executar Python em produção, o que exclui a utilização de um servidor Python local. As soluções locais relacionadas sofrerão provavelmente restrições legais, de segurança ou técnicas semelhantes. <em>Precisamos de uma solução totalmente contida que nos permita chamar o modelo diretamente de Java ou de outra linguagem não-Python.</em></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/A_Python_metamorphoses_into_an_Onyx_butterfly_a65c340c47.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 1: Um Python metamorfoseia-se numa borboleta Onyx.</em></p>
<h2 id="What-is-ONNX-Open-Neural-Network-Exchange" class="common-anchor-header">O que é o ONNX (Open Neural Network Exchange)?<button data-href="#What-is-ONNX-Open-Neural-Network-Exchange" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/onnx/onnx">O ONNX</a> (Open Neural Network Exchange) é um ecossistema de ferramentas independente de plataforma para realizar a inferência de modelos de redes neurais. Foi inicialmente desenvolvido pela equipa PyTorch da Meta (então Facebook), com contribuições adicionais da Microsoft, IBM, Huawei, Intel, AMD, Arm e Qualcomm. Atualmente, é um projeto de código aberto propriedade da Linux Foundation for AI and Data. O ONNX é o método de facto para distribuir modelos de redes neurais independentes de plataforma.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/A_partial_ONNX_computational_graph_for_a_NN_transformer_11deebefe0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 2: Um gráfico computacional ONNX (parcial) para um transformador NN</em></p>
<p><strong>Normalmente, utilizamos "ONNX" num sentido mais restrito para nos referirmos ao seu formato de ficheiro.</strong> Um ficheiro de modelo ONNX representa um gráfico computacional, incluindo frequentemente os valores dos pesos de uma função matemática, e a norma define operações comuns para redes neuronais. Pode pensar-se nele de forma semelhante ao gráfico computacional criado quando se utiliza o autodiff com o PyTorch. De outra perspetiva, o formato de arquivo ONNX serve como uma <em>representação intermediária</em> (IR) para redes neurais, assim como a compilação de código nativo, que também envolve uma etapa de IR. Veja a ilustração acima, que visualiza um gráfico computacional ONNX.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/An_IR_allows_many_combinations_of_front_ends_and_back_ends_a05e259849.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 3: Uma IR permite muitas combinações de front-ends e back-ends</em></p>
<p>O formato de ficheiro ONNX é apenas uma parte do ecossistema ONNX, que também inclui bibliotecas para manipular gráficos computacionais e bibliotecas para carregar e executar ficheiros de modelos ONNX. Estas bibliotecas abrangem várias linguagens e plataformas. Uma vez que o ONNX é apenas uma IR (Intermediate Representation Language), podem ser aplicadas optimizações específicas a uma determinada plataforma de hardware antes de o executar com código nativo. Veja a figura acima que ilustra as combinações de front-ends e back-ends.</p>
<h2 id="ONNX-Workflow" class="common-anchor-header">Fluxo de trabalho ONNX<button data-href="#ONNX-Workflow" class="anchor-icon" translate="no">
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
    </button></h2><p>Para fins de discussão, vamos investigar a chamada de um modelo de incorporação de texto a partir de Java, por exemplo, em preparação para a ingestão de dados na base de dados vetorial de código aberto <a href="https://milvus.io/">Milvus</a>. Assim, se quisermos chamar o nosso modelo de incorporação ou de fundação a partir de Java, é tão simples como utilizar a biblioteca ONNX no ficheiro de modelo correspondente? Sim, mas teremos de obter ficheiros para o modelo e para o codificador do tokenizador (e descodificador para os modelos de base). Podemos produzi-los nós próprios utilizando Python offline, ou seja, antes da produção, que passamos a explicar.</p>
<h2 id="Exporting-NN-Models-from-Python" class="common-anchor-header">Exportação de modelos NN a partir de Python<button data-href="#Exporting-NN-Models-from-Python" class="anchor-icon" translate="no">
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
    </button></h2><p>Vamos abrir um modelo comum de incorporação de texto, <code translate="no">all-MiniLM-L6-v2</code>, a partir de Python, utilizando a biblioteca de transformadores de frases da HuggingFace. Utilizaremos a biblioteca HF indiretamente através da biblioteca util .txtai, uma vez que precisamos de um invólucro em torno dos transformadores de frases que também exporta as camadas de agrupamento e normalização após a função de transformação. (Estas camadas pegam nos token embeddings dependentes do contexto, ou seja, o resultado do transformador, e transformam-no num único texto embedding).</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> txtai.pipeline <span class="hljs-keyword">import</span> HFOnnx

path = <span class="hljs-string">&quot;sentence-transformers/all-MiniLM-L6-v2&quot;</span>
onnx_model = HFOnnx()
model = onnx_model(path, <span class="hljs-string">&quot;pooling&quot;</span>, <span class="hljs-string">&quot;model.onnx&quot;</span>, <span class="hljs-literal">True</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Damos instruções à biblioteca para exportar <code translate="no">sentence-transformers/all-MiniLM-L6-v2</code> a partir do hub do modelo HuggingFace como ONNX, especificando a tarefa como incorporação de texto e activando a quantização do modelo. Ao chamar <code translate="no">onnx_model()</code>, o modelo será descarregado do hub de modelos se ainda não existir localmente, as três camadas serão convertidas em ONNX e os seus gráficos computacionais serão combinados.</p>
<p>Agora estamos prontos para realizar a inferência em Java? Não é assim tão rápido. O modelo introduz uma lista de tokens (ou uma lista de listas para mais do que uma amostra) correspondente à tokenização do texto que pretendemos incorporar. Portanto, a menos que possamos realizar toda a tokenização antes do tempo de produção, precisaremos executar o tokenizador a partir do Java.</p>
<p>Há algumas opções para isso. Uma delas envolve implementar ou encontrar uma implementação do tokenizador para o modelo em questão em Java ou em outra linguagem, e chamá-lo a partir do Java como uma biblioteca estática ou dinamicamente vinculada. Uma solução mais fácil é converter o tokenizador num ficheiro ONNX e utilizá-lo a partir de Java, tal como utilizamos o ficheiro ONNX do modelo.</p>
<p>O ONNX simples, no entanto, não contém as operações necessárias para implementar o gráfico computacional de um tokenizador. Por esse motivo, a Microsoft criou uma biblioteca para aumentar o ONNX chamada ONNXRuntime-Extensions. Ela define operações úteis para todos os tipos de pré e pós-processamento de dados, não apenas para tokenizadores de texto.</p>
<p>Eis como exportamos o nosso tokenizador como um ficheiro ONNX:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> onnxruntime_extensions <span class="hljs-keyword">import</span> gen_processing_models
<span class="hljs-keyword">from</span> sentence_transformers <span class="hljs-keyword">import</span> SentenceTransformer

embedding_model = SentenceTransformer(<span class="hljs-string">&#x27;all-MiniLM-L6-v2&#x27;</span>)
tok_encode, _ = gen_processing_models(embedding_model.tokenizer, pre_kwargs={})

onnx_tokenizer_path = <span class="hljs-string">&quot;tokenizer.onnx&quot;</span>
<span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(tokenizer_path, <span class="hljs-string">&quot;wb&quot;</span>) <span class="hljs-keyword">as</span> f:
  f.write(tok_encode.SerializeToString())
<button class="copy-code-btn"></button></code></pre>
<p>Descartámos o descodificador do tokenizador, uma vez que a incorporação de frases não o exige. Agora, temos dois arquivos: <code translate="no">tokenizer.onnx</code> para tokenizar texto e <code translate="no">model.onnx</code> para incorporar cadeias de tokens.</p>
<h2 id="Model-Inference-in-Java" class="common-anchor-header">Inferência de modelo em Java<button data-href="#Model-Inference-in-Java" class="anchor-icon" translate="no">
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
    </button></h2><p>Executar nosso modelo a partir de Java agora é trivial. Aqui estão algumas das linhas de código importantes do exemplo completo:</p>
<pre><code translate="no" class="language-java"><span class="hljs-comment">// Imports required for Java/ONNX integration</span>
<span class="hljs-keyword">import</span> ai.onnxruntime.*;
<span class="hljs-keyword">import</span> ai.onnxruntime.extensions.*;

…

<span class="hljs-comment">// Set up inference sessions for tokenizer and model</span>
<span class="hljs-type">var</span> <span class="hljs-variable">env</span> <span class="hljs-operator">=</span> OrtEnvironment.getEnvironment();

<span class="hljs-type">var</span> <span class="hljs-variable">sess_opt</span> <span class="hljs-operator">=</span> <span class="hljs-keyword">new</span> <span class="hljs-title class_">OrtSession</span>.SessionOptions();
sess_opt.registerCustomOpLibrary(OrtxPackage.getLibraryPath());

<span class="hljs-type">var</span> <span class="hljs-variable">tokenizer</span> <span class="hljs-operator">=</span> env.createSession(<span class="hljs-string">&quot;app/tokenizer.onnx&quot;</span>, sess_opt);
<span class="hljs-type">var</span> <span class="hljs-variable">model</span> <span class="hljs-operator">=</span> env.createSession(<span class="hljs-string">&quot;app/model.onnx&quot;</span>, sess_opt);

…

<span class="hljs-comment">// Perform inference and extract text embeddings into native Java</span>
<span class="hljs-type">var</span> <span class="hljs-variable">results</span> <span class="hljs-operator">=</span> session.run(inputs).get(<span class="hljs-string">&quot;embeddings&quot;</span>);
<span class="hljs-type">float</span>[][] embeddings = (<span class="hljs-type">float</span>[][]) results.get().getValue();
<button class="copy-code-btn"></button></code></pre>
<p>Um exemplo de trabalho completo pode ser encontrado na secção de recursos.</p>
<h2 id="Summary" class="common-anchor-header">Resumo<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Nós vimos neste post como é possível exportar modelos de código aberto do hub de modelos do HuggingFace e usá-los diretamente de outras linguagens além do Python. Observamos, no entanto, algumas ressalvas:</p>
<p>Primeiro, as bibliotecas ONNX e as extensões de tempo de execução têm níveis variados de suporte de recursos. Poderá não ser possível utilizar todos os modelos em todas as linguagens até que seja lançada uma futura atualização do SDK. As bibliotecas de tempo de execução ONNX para Python, C++, Java e JavaScript são as mais abrangentes.</p>
<p>Em segundo lugar, o hub HuggingFace contém ONNX pré-exportado, mas esses modelos não incluem as camadas finais de agrupamento e normalização. Deve estar ciente de como funciona o <code translate="no">sentence-transformers</code> se pretender utilizar diretamente o <code translate="no">torch.onnx</code>.</p>
<p>No entanto, o ONNX tem o apoio dos principais líderes da indústria e está numa trajetória para se tornar um meio sem fricção de IA generativa multiplataforma.</p>
<h2 id="Resources" class="common-anchor-header">Recursos<button data-href="#Resources" class="anchor-icon" translate="no">
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
<li><p><a href="https://github.com/milvus-io/bootcamp/tree/master/tutorials/quickstart/onnx_example">Exemplo de código onnx em Python e Java</a></p></li>
<li><p><a href="https://onnx.ai/">https://onnx.ai/</a></p></li>
<li><p><a href="https://onnxruntime.ai/">https://onnxruntime.ai/</a></p></li>
<li><p><a href="https://onnxruntime.ai/docs/extensions/">https://onnxruntime.ai/docs/extensions/</a></p></li>
<li><p><a href="https://milvus.io/blog">https://milvus.io/blog</a></p></li>
<li><p><a href="https://github.com/milvus-io/bootcamp/tree/master">https://github.com/milvus-io/bootcamp/tree/master</a></p></li>
</ul>
