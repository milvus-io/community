---
id: >-
  hands-on-with-vdbbench-benchmarking-vector-databases-for-pocs-that-match-production.md
title: >-
  Prática com o VDBBench: Benchmarking de bancos de dados vetoriais para POCs
  que correspondem à produção
author: Yifan Cai
date: 2025-08-15T00:00:00.000Z
desc: >-
  Saiba como testar bases de dados vectoriais com dados de produção reais
  utilizando o VDBBench. Guia passo a passo para POCs de conjuntos de dados
  personalizados que prevêem o desempenho real.
cover: assets.zilliz.com/vdbbench_cover_min_2f86466839.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: >-
  VectorDBBench, POC, vector database, VDBBench, benchmarking vector database,
  how to choose a vector database
meta_title: |
  Tutorial | How to Evaluate VectorDBs that Match Production via VDBBench
origin: >-
  https://milvus.io/blog/hands-on-with-vdbbench-benchmarking-vector-databases-for-pocs-that-match-production.md
---
<p>As bases de dados vectoriais são agora uma parte essencial da infraestrutura de IA, alimentando várias aplicações alimentadas por LLM para serviço ao cliente, geração de conteúdos, pesquisa, recomendações e muito mais.</p>
<p>Com tantas opções no mercado, desde bancos de dados vetoriais criados para fins específicos, como Milvus e Zilliz Cloud, até bancos de dados tradicionais com pesquisa vetorial como complemento, <strong>escolher o certo não é tão simples quanto ler gráficos de referência.</strong></p>
<p>A maioria das equipas faz uma Prova de Conceito (POC) antes de se comprometer, o que é inteligente em teoria - mas, na prática, muitos benchmarks de fornecedores que parecem impressionantes no papel caem por terra em condições reais.</p>
<p>Um dos principais motivos é que a maioria das declarações de desempenho se baseia em conjuntos de dados desatualizados de 2006-2012 (SIFT, GloVe, LAION) que se comportam de forma muito diferente dos embeddings modernos. Por exemplo, o SIFT utiliza vectores de 128 dimensões, enquanto os modelos de IA actuais produzem dimensões muito superiores - 3 072 para o mais recente da OpenAI, 1 024 para o da Cohere - uma grande mudança que afecta o desempenho, o custo e a escalabilidade.</p>
<h2 id="The-Fix-Test-with-Your-Data-Not-Canned-Benchmarks" class="common-anchor-header">A solução: teste com seus dados, não com benchmarks prontos<button data-href="#The-Fix-Test-with-Your-Data-Not-Canned-Benchmarks" class="anchor-icon" translate="no">
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
    </button></h2><p>A solução mais simples e eficaz é executar a avaliação de POC com os vetores que seu aplicativo realmente gera. Isso significa usar seus modelos de incorporação, suas consultas reais e sua distribuição de dados real.</p>
<p>É exatamente para isso que <a href="https://milvus.io/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md"><strong>o VDBBench</strong></a> - uma ferramenta de benchmarking de banco de dados vetorial de código aberto - foi criado. Ele suporta a avaliação e comparação de qualquer banco de dados vetorial, incluindo Milvus, Elasticsearch, pgvector, e mais, e simula cargas de trabalho de produção real.</p>
<p><a href="https://github.com/zilliztech/VectorDBBench">Download VDBBench 1.0 →</a> |<a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch&amp;__hstc=175614333.dc4bcf53f6c7d650ea8978dcdb9e7009.1727350436713.1755165753372.1755169827021.775&amp;__hssc=175614333.3.1755169827021&amp;__hsfp=1940526538"> Ver tabela de classificação →</a> | <a href="https://milvus.io/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md">O que é o VDBBench</a></p>
<p>O VDBbench permite-lhe:</p>
<ul>
<li><p><strong>Testar com os seus próprios dados</strong> dos seus modelos de incorporação</p></li>
<li><p>Simular <strong>inserções simultâneas, consultas e ingestão de streaming</strong></p></li>
<li><p>Medir <strong>a latência P95/P99, a taxa de transferência sustentada e a precisão da recuperação</strong></p></li>
<li><p>Realizar benchmark em vários bancos de dados sob condições idênticas</p></li>
<li><p>Permite <strong>testar conjuntos de dados personalizados</strong> para que os resultados correspondam efetivamente à produção</p></li>
</ul>
<p>A seguir, mostraremos como executar um POC de nível de produção com o VDBBench e seus dados reais - para que você possa fazer uma escolha confiante e preparada para o futuro.</p>
<h2 id="How-to-Evaluate-VectorDBs-with-Your-Custom-Datasets-with-VDBBench" class="common-anchor-header">Como avaliar VectorDBs com seus conjuntos de dados personalizados com o VDBBench<button data-href="#How-to-Evaluate-VectorDBs-with-Your-Custom-Datasets-with-VDBBench" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de começar, verifique se você tem o Python 3.11 ou superior instalado. Você precisará de dados vetoriais no formato CSV ou NPY, aproximadamente 2 a 3 horas para a configuração e o teste completos e conhecimento intermediário de Python para solucionar problemas, se necessário.</p>
<h3 id="Installation-and-Configuration" class="common-anchor-header">Instalação e configuração</h3><p>Se estiver a avaliar uma base de dados, execute este comando:</p>
<pre><code translate="no">pip install vectordb-bench
<button class="copy-code-btn"></button></code></pre>
<p>Se quiser comparar todas as bases de dados suportadas, execute o comando:</p>
<pre><code translate="no">pip install vectordb-bench[<span class="hljs-built_in">all</span>]
<button class="copy-code-btn"></button></code></pre>
<p>Para clientes de banco de dados específicos (por exemplo: Elasticsearch):</p>
<pre><code translate="no">pip install vectordb-bench[elastic]
<button class="copy-code-btn"></button></code></pre>
<p>Verifique esta <a href="https://github.com/zilliztech/VectorDBBench">página do GitHub</a> para todos os bancos de dados compatíveis e seus comandos de instalação.</p>
<h3 id="Launching-VDBBench" class="common-anchor-header">Iniciando o VDBBench</h3><p>Inicie <strong>o VDBBench</strong> com:</p>
<pre><code translate="no">init_bench
<button class="copy-code-btn"></button></code></pre>
<p>Saída esperada do console: 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_expected_console_output_66e1a218b7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>A interface Web estará disponível localmente:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_2e4dd7ea69.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Data-Preparation-and-Format-Conversion" class="common-anchor-header">Preparação de dados e conversão de formato</h3><p>O VDBBench requer arquivos Parquet estruturados com esquemas específicos para garantir testes consistentes em diferentes bancos de dados e conjuntos de dados.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Nome do ficheiro</strong></th><th style="text-align:center"><strong>Objetivo</strong></th><th style="text-align:center"><strong>Necessário</strong></th><th style="text-align:center"><strong>Conteúdo Exemplo</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">train.parquet</td><td style="text-align:center">Coleção de vectores para inserção na base de dados</td><td style="text-align:center">✅</td><td style="text-align:center">ID do vetor + dados do vetor (lista[float])</td></tr>
<tr><td style="text-align:center">test.parquet</td><td style="text-align:center">Coleção de vectores para consultas</td><td style="text-align:center">✅</td><td style="text-align:center">ID do vetor + dados do vetor (lista[float])</td></tr>
<tr><td style="text-align:center">neighbors.parquet</td><td style="text-align:center">Verdade fundamental para os vectores de consulta (lista de ID do vizinho mais próximo real)</td><td style="text-align:center">✅</td><td style="text-align:center">query_id -&gt; [lista de IDs semelhantes ao top_k]</td></tr>
<tr><td style="text-align:center">scalar_labels.parquet</td><td style="text-align:center">Etiquetas (metadados que descrevem entidades que não os vectores)</td><td style="text-align:center">❌</td><td style="text-align:center">id -&gt; etiqueta</td></tr>
</tbody>
</table>
<p>Especificações de ficheiros necessárias:</p>
<ul>
<li><p><strong>O ficheiro do vetor de treino (train.parquet)</strong> tem de conter uma coluna de ID com inteiros incrementais e uma coluna de vetor com matrizes float32. Os nomes das colunas são configuráveis, mas a coluna ID deve usar tipos inteiros para indexação adequada.</p></li>
<li><p><strong>O arquivo de vetor de teste (test.parquet)</strong> segue a mesma estrutura dos dados de treinamento. O nome da coluna ID deve ser "id", enquanto os nomes das colunas do vetor podem ser personalizados para corresponder ao seu esquema de dados.</p></li>
<li><p>O<strong>ficheiro Ground Truth (neighbors.parquet)</strong> contém os vizinhos mais próximos de referência para cada consulta de teste. Ele requer uma coluna ID correspondente aos IDs do vetor de teste e uma coluna de matriz de vizinhos contendo os IDs corretos dos vizinhos mais próximos do conjunto de treinamento.</p></li>
<li><p><strong>O ficheiro Scalar Labels (scalar_labels.parquet)</strong> é opcional e contém rótulos de metadados associados aos vectores de treino, úteis para testes de pesquisa filtrada.</p></li>
</ul>
<h3 id="Data-Format-Challenges" class="common-anchor-header">Desafios do formato de dados</h3><p>A maioria dos dados vetoriais de produção existe em formatos que não correspondem diretamente aos requisitos do VDBBench. Os arquivos CSV geralmente armazenam embeddings como representações de strings de matrizes, os arquivos NPY contêm matrizes numéricas brutas sem metadados e as exportações de banco de dados geralmente usam JSON ou outros formatos estruturados.</p>
<p>A conversão manual destes formatos envolve vários passos complexos: analisar representações de cadeia de caracteres em matrizes numéricas, calcular os vizinhos mais próximos exactos utilizando bibliotecas como a FAISS, dividir corretamente os conjuntos de dados mantendo a consistência das ID e garantir que todos os tipos de dados correspondem às especificações do Parquet.</p>
<h3 id="Automated-Format-Conversion" class="common-anchor-header">Conversão automatizada de formatos</h3><p>Para simplificar o processo de conversão, desenvolvemos um script Python que lida automaticamente com a conversão de formatos, o cálculo da verdade fundamental e a estruturação adequada dos dados.</p>
<p><strong>Formato de entrada CSV:</strong></p>
<pre><code translate="no"><span class="hljs-built_in">id</span>,emb,label
<span class="hljs-number">1</span>,<span class="hljs-string">&quot;[0.12,0.56,0.89,...]&quot;</span>,A
<span class="hljs-number">2</span>,<span class="hljs-string">&quot;[0.33,0.48,0.90,...]&quot;</span>,B
<button class="copy-code-btn"></button></code></pre>
<p><strong>Formato de entrada NPY:</strong></p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
vectors = np.<span class="hljs-property">random</span>.<span class="hljs-title function_">rand</span>(<span class="hljs-number">10000</span>, <span class="hljs-number">768</span>).<span class="hljs-title function_">astype</span>(<span class="hljs-string">&#x27;float32&#x27;</span>)
np.<span class="hljs-title function_">save</span>(<span class="hljs-string">&quot;vectors.npy&quot;</span>, vectors)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Conversion-Script-Implementation" class="common-anchor-header">Implementação do script de conversão</h3><p><strong>Instalar as dependências necessárias:</strong></p>
<pre><code translate="no">pip install numpy pandas faiss-cpu
<button class="copy-code-btn"></button></code></pre>
<p><strong>Executar a conversão:</strong></p>
<pre><code translate="no">python convert_to_vdb_format.py \
  --train data/train.csv \
  --<span class="hljs-built_in">test</span> data/test.csv \
  --out datasets/custom \
  --topk 10
<button class="copy-code-btn"></button></code></pre>
<p><strong>Referência do parâmetro:</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Nome do parâmetro</strong></th><th style="text-align:center"><strong>Necessário</strong></th><th style="text-align:center"><strong>Tipo de parâmetro</strong></th><th style="text-align:center"><strong>Descrição do parâmetro</strong></th><th style="text-align:center"><strong>Valor por defeito</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><code translate="no">--train</code></td><td style="text-align:center">Sim</td><td style="text-align:center">Cadeia de caracteres</td><td style="text-align:center">Caminho dos dados de treino, suporta o formato CSV ou NPY. O CSV deve conter a coluna emb, se não houver coluna de id será gerado automaticamente</td><td style="text-align:center">Nenhum</td></tr>
<tr><td style="text-align:center"><code translate="no">--test</code></td><td style="text-align:center">Sim</td><td style="text-align:center">Cadeia de caracteres</td><td style="text-align:center">Caminho de dados de consulta, compatível com o formato CSV ou NPY. Formato igual ao dos dados de treino</td><td style="text-align:center">Nenhum</td></tr>
<tr><td style="text-align:center"><code translate="no">--out</code></td><td style="text-align:center">Sim</td><td style="text-align:center">Cadeia de caracteres</td><td style="text-align:center">Caminho do diretório de saída, guarda ficheiros de parquet convertidos e ficheiros de índice de vizinhança</td><td style="text-align:center">Nenhum</td></tr>
<tr><td style="text-align:center"><code translate="no">--labels</code></td><td style="text-align:center">Não</td><td style="text-align:center">Cadeia de caracteres</td><td style="text-align:center">Caminho do CSV de etiquetas, tem de conter a coluna de etiquetas (formatada como uma matriz de cadeias de caracteres), utilizada para guardar etiquetas</td><td style="text-align:center">Nenhum</td></tr>
<tr><td style="text-align:center"><code translate="no">--topk</code></td><td style="text-align:center">Não</td><td style="text-align:center">Inteiro</td><td style="text-align:center">Número de vizinhos mais próximos a devolver durante o cálculo</td><td style="text-align:center">10</td></tr>
</tbody>
</table>
<p><strong>Estrutura do diretório de saída:</strong></p>
<pre><code translate="no">datasets/custom/
├── train.parquet        <span class="hljs-comment"># Training vectors</span>
├── test.parquet         <span class="hljs-comment"># Query vectors  </span>
├── neighbors.parquet    <span class="hljs-comment"># Ground Truth</span>
└── scalar_labels.parquet <span class="hljs-comment"># Optional scalar labels</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Complete-Conversion-Script" class="common-anchor-header">Script de conversão completo</h3><pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> argparse
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">import</span> pandas <span class="hljs-keyword">as</span> pd
<span class="hljs-keyword">import</span> faiss
<span class="hljs-keyword">from</span> ast <span class="hljs-keyword">import</span> literal_eval
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">Optional</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">load_csv</span>(<span class="hljs-params">path: <span class="hljs-built_in">str</span></span>):
    df = pd.read_csv(path)
    <span class="hljs-keyword">if</span> <span class="hljs-string">&#x27;emb&#x27;</span> <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> df.columns:
        <span class="hljs-keyword">raise</span> ValueError(<span class="hljs-string">f&quot;CSV file missing &#x27;emb&#x27; column: <span class="hljs-subst">{path}</span>&quot;</span>)
   df[<span class="hljs-string">&#x27;emb&#x27;</span>] = df[<span class="hljs-string">&#x27;emb&#x27;</span>].apply(literal_eval)
    <span class="hljs-keyword">if</span> <span class="hljs-string">&#x27;id&#x27;</span> <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> df.columns:
        df.insert(<span class="hljs-number">0</span>, <span class="hljs-string">&#x27;id&#x27;</span>, <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(df)))
    <span class="hljs-keyword">return</span> df
<span class="hljs-keyword">def</span> <span class="hljs-title function_">load_npy</span>(<span class="hljs-params">path: <span class="hljs-built_in">str</span></span>):
    arr = np.load(path)
    df = pd.DataFrame({
        <span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-built_in">range</span>(arr.shape[<span class="hljs-number">0</span>]),
        <span class="hljs-string">&#x27;emb&#x27;</span>: arr.tolist()
    })
    <span class="hljs-keyword">return</span> df
<span class="hljs-keyword">def</span> <span class="hljs-title function_">load_vectors</span>(<span class="hljs-params">path: <span class="hljs-built_in">str</span></span>) -&gt; pd.DataFrame:
    <span class="hljs-keyword">if</span> path.endswith(<span class="hljs-string">&#x27;.csv&#x27;</span>):
        <span class="hljs-keyword">return</span> load_csv(path)
    <span class="hljs-keyword">elif</span> path.endswith(<span class="hljs-string">&#x27;.npy&#x27;</span>):
        <span class="hljs-keyword">return</span> load_npy(path)
    <span class="hljs-keyword">else</span>:
        <span class="hljs-keyword">raise</span> ValueError(<span class="hljs-string">f&quot;Unsupported file format: <span class="hljs-subst">{path}</span>&quot;</span>)
<span class="hljs-keyword">def</span> <span class="hljs-title function_">compute_ground_truth</span>(<span class="hljs-params">train_vectors: np.ndarray, test_vectors: np.ndarray, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">10</span></span>):
    dim = train_vectors.shape[<span class="hljs-number">1</span>]
    index = faiss.IndexFlatL2(dim)
    index.add(train_vectors)
    _, indices = index.search(test_vectors, top_k)
    <span class="hljs-keyword">return</span> indices
<span class="hljs-keyword">def</span> <span class="hljs-title function_">save_ground_truth</span>(<span class="hljs-params">df_path: <span class="hljs-built_in">str</span>, indices: np.ndarray</span>):
    df = pd.DataFrame({
        <span class="hljs-string">&quot;id&quot;</span>: np.arange(indices.shape[<span class="hljs-number">0</span>]),
        <span class="hljs-string">&quot;neighbors_id&quot;</span>: indices.tolist()
    })
    df.to_parquet(df_path, index=<span class="hljs-literal">False</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;✅ Ground truth saved successfully: <span class="hljs-subst">{df_path}</span>&quot;</span>)
<span class="hljs-keyword">def</span> <span class="hljs-title function_">main</span>(<span class="hljs-params">train_path: <span class="hljs-built_in">str</span>, test_path: <span class="hljs-built_in">str</span>, output_dir: <span class="hljs-built_in">str</span>,
         label_path: <span class="hljs-type">Optional</span>[<span class="hljs-built_in">str</span>] = <span class="hljs-literal">None</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">10</span></span>):
    os.makedirs(output_dir, exist_ok=<span class="hljs-literal">True</span>)
    <span class="hljs-comment"># Load training and query data</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;📥 Loading training data...&quot;</span>)
    train_df = load_vectors(train_path)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;📥 Loading query data...&quot;</span>)
    test_df = load_vectors(test_path)
    <span class="hljs-comment"># Extract vectors and convert to numpy</span>
    train_vectors = np.array(train_df[<span class="hljs-string">&#x27;emb&#x27;</span>].to_list(), dtype=<span class="hljs-string">&#x27;float32&#x27;</span>)
    test_vectors = np.array(test_df[<span class="hljs-string">&#x27;emb&#x27;</span>].to_list(), dtype=<span class="hljs-string">&#x27;float32&#x27;</span>)
    <span class="hljs-comment"># Save parquet files retaining all fields</span>
    train_df.to_parquet(os.path.join(output_dir, <span class="hljs-string">&#x27;train.parquet&#x27;</span>), index=<span class="hljs-literal">False</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;✅ train.parquet saved successfully, <span class="hljs-subst">{<span class="hljs-built_in">len</span>(train_df)}</span> records total&quot;</span>)
    test_df.to_parquet(os.path.join(output_dir, <span class="hljs-string">&#x27;test.parquet&#x27;</span>), index=<span class="hljs-literal">False</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;✅ test.parquet saved successfully, <span class="hljs-subst">{<span class="hljs-built_in">len</span>(test_df)}</span> records total&quot;</span>)
    <span class="hljs-comment"># Compute ground truth</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;🔍 Computing Ground Truth (nearest neighbors)...&quot;</span>)
    gt_indices = compute_ground_truth(train_vectors, test_vectors, top_k=top_k)
    save_ground_truth(os.path.join(output_dir, <span class="hljs-string">&#x27;neighbors.parquet&#x27;</span>), gt_indices)
    <span class="hljs-comment"># Load and save label file (if provided)</span>
    <span class="hljs-keyword">if</span> label_path:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;📥 Loading label file...&quot;</span>)
        label_df = pd.read_csv(label_path)
        <span class="hljs-keyword">if</span> <span class="hljs-string">&#x27;labels&#x27;</span> <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> label_df.columns:
            <span class="hljs-keyword">raise</span> ValueError(<span class="hljs-string">&quot;Label file must contain &#x27;labels&#x27; column&quot;</span>)
        label_df[<span class="hljs-string">&#x27;labels&#x27;</span>] = label_df[<span class="hljs-string">&#x27;labels&#x27;</span>].apply(literal_eval)
        label_df.to_parquet(os.path.join(output_dir, <span class="hljs-string">&#x27;scalar_labels.parquet&#x27;</span>), index=<span class="hljs-literal">False</span>)
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;✅ Label file saved as scalar_labels.parquet&quot;</span>)

<span class="hljs-keyword">if</span> 
name
 == <span class="hljs-string">&quot;__main__&quot;</span>:
    parser = argparse.ArgumentParser(description=<span class="hljs-string">&quot;Convert CSV/NPY vectors to VectorDBBench data format (retaining all columns)&quot;</span>)
    parser.add_argument(<span class="hljs-string">&quot;--train&quot;</span>, required=<span class="hljs-literal">True</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Training data path (CSV or NPY)&quot;</span>)
    parser.add_argument(<span class="hljs-string">&quot;--test&quot;</span>, required=<span class="hljs-literal">True</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Query data path (CSV or NPY)&quot;</span>)
    parser.add_argument(<span class="hljs-string">&quot;--out&quot;</span>, required=<span class="hljs-literal">True</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Output directory&quot;</span>)
    parser.add_argument(<span class="hljs-string">&quot;--labels&quot;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Label CSV path (optional)&quot;</span>)
    parser.add_argument(<span class="hljs-string">&quot;--topk&quot;</span>, <span class="hljs-built_in">type</span>=<span class="hljs-built_in">int</span>, default=<span class="hljs-number">10</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Ground truth&quot;</span>)
    args = parser.parse_args()
    main(args.train, args.test, args.out, args.labels, args.topk)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Saída do processo de conversão:</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_conversion_process_output_0827ba75c9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Ficheiros Gerados Verificação:</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_f02cd2964e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Custom-Dataset-Configuration" class="common-anchor-header">Configuração do conjunto de dados personalizado</h3><p>Navegue até à secção de configuração do conjunto de dados personalizado na interface Web:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/5_aa14b75b5d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>A interface de configuração fornece campos para metadados do conjunto de dados e especificação do caminho do ficheiro:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/6_1b64832990.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Parâmetros de configuração:</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Nome do parâmetro</strong></th><th style="text-align:center"><strong>Significado</strong></th><th style="text-align:center"><strong>Sugestões de configuração</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Nome do conjunto de dados</td><td style="text-align:center">Nome do conjunto de dados (identificador único)</td><td style="text-align:center">Qualquer nome, por exemplo, <code translate="no">my_custom_dataset</code></td></tr>
<tr><td style="text-align:center">Caminho da pasta</td><td style="text-align:center">Caminho do diretório do ficheiro do conjunto de dados</td><td style="text-align:center">por exemplo, <code translate="no">/data/datasets/custom</code></td></tr>
<tr><td style="text-align:center">dim</td><td style="text-align:center">Dimensões do vetor</td><td style="text-align:center">Deve corresponder aos ficheiros de dados, por exemplo, 768</td></tr>
<tr><td style="text-align:center">tamanho</td><td style="text-align:center">Contagem de vectores (opcional)</td><td style="text-align:center">Pode ser deixado vazio, o sistema detecta automaticamente</td></tr>
<tr><td style="text-align:center">Tipo de métrica</td><td style="text-align:center">Método de medição da similaridade</td><td style="text-align:center">Utiliza habitualmente L2 (distância euclidiana) ou IP (produto interno)</td></tr>
<tr><td style="text-align:center">nome do ficheiro de treino</td><td style="text-align:center">Nome do ficheiro do conjunto de treino (sem extensão .parquet)</td><td style="text-align:center">Se <code translate="no">train.parquet</code>, preencha <code translate="no">train</code>. Para ficheiros múltiplos, utilize a separação por vírgula, por exemplo, <code translate="no">train1,train2</code></td></tr>
<tr><td style="text-align:center">nome do ficheiro de teste</td><td style="text-align:center">Nome do ficheiro do conjunto de consulta (sem a extensão .parquet)</td><td style="text-align:center">Se <code translate="no">test.parquet</code>, preencha <code translate="no">test</code></td></tr>
<tr><td style="text-align:center">nome do ficheiro da verdade em terra</td><td style="text-align:center">Nome do ficheiro do conjunto de consultas (sem extensão .parquet)</td><td style="text-align:center">Se <code translate="no">neighbors.parquet</code>, preencha <code translate="no">neighbors</code></td></tr>
<tr><td style="text-align:center">nome do id do treino</td><td style="text-align:center">Nome da coluna ID dos dados de treino</td><td style="text-align:center">Normalmente <code translate="no">id</code></td></tr>
<tr><td style="text-align:center">nome do vetor do comboio</td><td style="text-align:center">Nome da coluna do vetor de dados de treino</td><td style="text-align:center">Se o nome da coluna gerado pelo script for <code translate="no">emb</code>, preencher <code translate="no">emb</code></td></tr>
<tr><td style="text-align:center">nome da coluna test emb</td><td style="text-align:center">Nome da coluna do vetor de dados de teste</td><td style="text-align:center">Normalmente igual ao nome da emb de treino, por exemplo, <code translate="no">emb</code></td></tr>
<tr><td style="text-align:center">nome emb da verdade terrestre</td><td style="text-align:center">Nome da coluna do vizinho mais próximo em Ground Truth</td><td style="text-align:center">Se o nome da coluna for <code translate="no">neighbors_id</code>, preencher <code translate="no">neighbors_id</code></td></tr>
<tr><td style="text-align:center">nome do ficheiro de etiquetas escalares</td><td style="text-align:center">(Opcional) Nome do ficheiro de etiquetas (sem extensão .parquet)</td><td style="text-align:center">Se <code translate="no">scalar_labels.parquet</code> foi gerado, preencher <code translate="no">scalar_labels</code>, caso contrário, deixar em branco</td></tr>
<tr><td style="text-align:center">percentagens de etiquetas</td><td style="text-align:center">(Opcional) Rácio do filtro de etiquetas</td><td style="text-align:center">por exemplo, <code translate="no">0.001</code>,<code translate="no">0.02</code>,<code translate="no">0.5</code>, deixar em branco se não for necessária qualquer filtragem de etiquetas</td></tr>
<tr><td style="text-align:center">descrição</td><td style="text-align:center">Descrição do conjunto de dados</td><td style="text-align:center">Não é possível anotar o contexto comercial ou o método de geração</td></tr>
</tbody>
</table>
<p>Guarde a configuração para prosseguir com a configuração do teste.</p>
<h3 id="Test-Execution-and-Database-Configuration" class="common-anchor-header">Execução do teste e configuração da base de dados</h3><p>Aceder à interface de configuração do teste:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/7_3ecdcb1034.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Seleção e configuração da base de dados (Milvus como exemplo):</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/8_356a2d8c39.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Atribuição de conjunto de dados:</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/9_dataset_assignment_85ba7b24ca.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Metadados de teste e rotulagem:</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/10_test_metadata_and_labeling_293f6f2b99.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Execução de testes:</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/11_test_execution_76acb42c98.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Results-Analysis-and-Performance-Evaluation" class="common-anchor-header">Análise de resultados e avaliação de desempenho<button data-href="#Results-Analysis-and-Performance-Evaluation" class="anchor-icon" translate="no">
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
    </button></h2><p>A interface de resultados fornece uma análise de desempenho abrangente:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/12_993c536c20.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Test-Configuration-Summary" class="common-anchor-header">Resumo da configuração do teste</h3><p>A avaliação testou níveis de simultaneidade de 1, 5 e 10 operações simultâneas (limitadas pelos recursos de hardware disponíveis), dimensões vetoriais de 768, tamanho do conjunto de dados de 3.000 vetores de treinamento e 3.000 consultas de teste, com a filtragem de rótulo escalar desativada para esta execução de teste.</p>
<h3 id="Critical-Implementation-Considerations" class="common-anchor-header">Considerações críticas sobre a implementação</h3><ul>
<li><p><strong>Consistência dimensional:</strong> As incompatibilidades de dimensão do vetor entre os conjuntos de dados de treinamento e teste causarão falhas imediatas no teste. Verifique o alinhamento dimensional durante a preparação dos dados para evitar erros de tempo de execução.</p></li>
<li><p><strong>Precisão da verdade básica:</strong> Cálculos incorretos da verdade básica invalidam as medições da taxa de recuperação. O script de conversão fornecido utiliza FAISS com distância L2 para o cálculo exato do vizinho mais próximo, garantindo resultados de referência precisos.</p></li>
<li><p><strong>Requisitos de escala do conjunto de dados:</strong> Conjuntos de dados pequenos (abaixo de 10.000 vetores) podem produzir medições de QPS inconsistentes devido à geração de carga insuficiente. Considere dimensionar o tamanho do conjunto de dados para obter um teste de taxa de transferência mais confiável.</p></li>
<li><p><strong>Alocação de recursos:</strong> As restrições de memória e CPU do contêiner do Docker podem limitar artificialmente o desempenho do banco de dados durante o teste. Monitore a utilização de recursos e ajuste os limites do contêiner conforme necessário para uma medição precisa do desempenho.</p></li>
<li><p><strong>Monitoramento de erros:</strong> <strong>O VDBBench</strong> pode registrar erros na saída do console que não aparecem na interface da Web. Monitore os logs do terminal durante a execução do teste para obter informações completas de diagnóstico.</p></li>
</ul>
<h2 id="Supplemental-Tools-Test-Data-Generation" class="common-anchor-header">Ferramentas suplementares: Geração de dados de teste<button data-href="#Supplemental-Tools-Test-Data-Generation" class="anchor-icon" translate="no">
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
    </button></h2><p>Para cenários de desenvolvimento e testes padronizados, é possível gerar conjuntos de dados sintéticos com caraterísticas controladas:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> pandas <span class="hljs-keyword">as</span> pd
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">def</span> <span class="hljs-title function_">generate_csv</span>(<span class="hljs-params">num_records: <span class="hljs-built_in">int</span>, dim: <span class="hljs-built_in">int</span>, filename: <span class="hljs-built_in">str</span></span>):
    ids = <span class="hljs-built_in">range</span>(num_records)
    vectors = np.random.rand(num_records, dim).<span class="hljs-built_in">round</span>(<span class="hljs-number">6</span>) 
    emb_str = [<span class="hljs-built_in">str</span>(<span class="hljs-built_in">list</span>(vec)) <span class="hljs-keyword">for</span> vec <span class="hljs-keyword">in</span> vectors]
    df = pd.DataFrame({
        <span class="hljs-string">&#x27;id&#x27;</span>: ids,
        <span class="hljs-string">&#x27;emb&#x27;</span>: emb_str
    })
    df.to_csv(filename, index=<span class="hljs-literal">False</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Generated file <span class="hljs-subst">{filename}</span>, <span class="hljs-subst">{num_records}</span> records total, vector dimension <span class="hljs-subst">{dim}</span>&quot;</span>)
<span class="hljs-keyword">if</span>
name
 == <span class="hljs-string">&quot;__main__&quot;</span>:
    num_records = <span class="hljs-number">3000</span>  <span class="hljs-comment"># Number of records to generate</span>
    dim = <span class="hljs-number">768</span>  <span class="hljs-comment"># Vector dimension</span>

    generate_csv(num_records, dim, <span class="hljs-string">&quot;train.csv&quot;</span>)
    generate_csv(num_records, dim, <span class="hljs-string">&quot;test.csv&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Este utilitário gera conjuntos de dados com dimensões especificadas e contagens de registos para prototipagem e cenários de teste de linha de base.</p>
<h2 id="Conclusion" class="common-anchor-header">Conclusão<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Você acabou de aprender como se libertar do "teatro de benchmark" que enganou inúmeras decisões de banco de dados vetorial. Com o VDBBench e seu próprio conjunto de dados, você pode gerar métricas de QPS, latência e recall de nível de produção - sem mais suposições de dados acadêmicos de décadas atrás.</p>
<p>Pare de confiar em benchmarks prontos que não têm nada a ver com suas cargas de trabalho reais. Em apenas algumas horas - não semanas - verá com precisão o desempenho de uma base de dados com os <em>seus</em> vectores, as <em>suas</em> consultas e <em>as suas</em> restrições. Isso significa que você pode tomar a decisão com confiança, evitar reescritas dolorosas mais tarde e enviar sistemas que realmente funcionam em produção.</p>
<ul>
<li><p>Experimente o VDBBench com suas cargas de trabalho: <a href="https://github.com/zilliztech/VectorDBBench">https://github.com/zilliztech/VectorDBBench</a></p></li>
<li><p>Veja os resultados dos testes dos principais bancos de dados vetoriais: <a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch&amp;__hstc=175614333.dc4bcf53f6c7d650ea8978dcdb9e7009.1727350436713.1755165753372.1755169827021.775&amp;__hssc=175614333.3.1755169827021&amp;__hsfp=1940526538">Tabela de classificação do VDBBench</a></p></li>
</ul>
<p>Tem dúvidas ou deseja compartilhar seus resultados? Participe da conversa no<a href="https://github.com/zilliztech/VectorDBBench"> GitHub</a> ou conecte-se com nossa comunidade no <a href="https://discord.com/invite/FG6hMJStWu">Discord</a>.</p>
<hr>
<p><em>Esta é a primeira postagem da nossa série Guia de POC do VectorDB - métodos práticos e testados pelo desenvolvedor para criar uma infraestrutura de IA que funciona sob pressão do mundo real. Fique ligado para mais!</em></p>
