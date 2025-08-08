---
id: >-
  gpt-oss-vs-o4-mini-edge-ready-on-par-performance-dependable-not-mind-blowing.md
title: >-
  GPT-oss vs o4-mini: Pronto para a borda, desempenho no mesmo nível -
  Confiável, mas não alucinante
author: Lumina Wang
date: 2025-08-07T00:00:00.000Z
desc: >-
  A OpenAI rouba as atenções ao disponibilizar dois modelos de raciocínio:
  gpt-oss-120b e gpt-oss-20b, licenciados de forma permissiva ao abrigo do
  Apache 2.0.
cover: >-
  assets.zilliz.com/gpt_oss_vs_o4_mini_edge_ready_on_par_performance_dependable_not_mind_blowing_2bd27838c1.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'gpt-oss, OpenAI open source models, o4-mini, vector databases, deepseek'
meta_title: |
  GPT-oss vs o4-mini: Edge-Ready, Solid, But Not Disruptive
origin: >-
  https://milvus.io/blog/gpt-oss-vs-o4-mini-edge-ready-on-par-performance-dependable-not-mind-blowing.md
---
<p>O mundo da IA tem estado ao rubro. Em apenas algumas semanas, a Anthropic lançou o Claude 4.1 Opus, a DeepMind surpreendeu toda a gente com o simulador mundial Genie 3 - e agora, a OpenAI rouba as atenções ao abrir dois modelos de raciocínio: <a href="https://huggingface.co/openai/gpt-oss-120b">gpt-oss-120b</a> e <a href="https://huggingface.co/openai/gpt-oss-20b">gpt-oss-20b</a>, licenciados permissivamente sob Apache 2.0.</p>
<p>Após o lançamento, estes modelos atingiram instantaneamente o primeiro lugar das tendências no Hugging Face - e por boas razões. Esta é a primeira vez desde 2019 que a OpenAI lançou modelos de peso aberto que estão realmente prontos para produção. A mudança não é acidental - depois de anos promovendo o acesso apenas à API, a OpenAI está claramente respondendo à pressão de líderes de código aberto como DeepSeek, LLaMA da Meta e Qwen, que têm dominado os benchmarks e os fluxos de trabalho do desenvolvedor.</p>
<p>Neste post, exploraremos o que torna o GPT-oss diferente, como ele se compara aos principais modelos abertos, como DeepSeek R1 e Qwen 3, e por que os desenvolvedores devem se preocupar. Também vamos construir um sistema RAG com capacidade de raciocínio usando GPT-oss e Milvus, o banco de dados vetorial de código aberto mais popular.</p>
<h2 id="What-Makes-GPT-oss-Special-and-Why-You-Should-Care" class="common-anchor-header">O que torna o GPT-oss especial e por que você deve se importar?<button data-href="#What-Makes-GPT-oss-Special-and-Why-You-Should-Care" class="anchor-icon" translate="no">
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
    </button></h2><p>O GPT-oss não é apenas mais uma queda de peso. Ele oferece cinco áreas-chave que são importantes para os desenvolvedores:</p>
<h3 id="1-Built-for-Edge-Deployment" class="common-anchor-header">1: Criado para implantação na borda</h3><p>O GPT-oss vem em duas variantes de tamanho estratégico:</p>
<ul>
<li><p>gpt-oss-120b: 117B total, 5.1B ativo por token</p></li>
<li><p>gpt-oss-20b: 21B total, 3.6B ativo por token</p></li>
</ul>
<p>Utilizando a arquitetura Mixture-of-Experts (MoE), apenas um subconjunto de parâmetros está ativo durante a inferência. Isto faz com que ambos os modelos sejam leves de executar relativamente ao seu tamanho:</p>
<ul>
<li><p>O gpt-oss-120b funciona num único GPU de 80 GB (H100)</p></li>
<li><p>o gpt-oss-20b cabe em apenas 16 GB de VRAM, o que significa que funciona em computadores portáteis topo de gama ou dispositivos de ponta</p></li>
</ul>
<p>De acordo com os testes da OpenAI, o gpt-oss-20b é o modelo OpenAI mais rápido para inferência - ideal para implementações de baixa latência ou agentes de raciocínio offline.</p>
<h3 id="2-Strong-Benchmark-Performance" class="common-anchor-header">2: Forte desempenho de benchmark</h3><p>De acordo com as avaliações do OpenAI:</p>
<ul>
<li><p><strong>O gpt-oss-120b</strong> tem um desempenho quase igual ao do o4-mini em raciocínio, uso de ferramentas e codificação de competição (Codeforces, MMLU, TauBench)</p></li>
<li><p><strong>o gpt-oss-20b</strong> compete com o o3-mini e até o supera em raciocínio matemático e de saúde</p></li>
</ul>
<h3 id="3-Cost-Efficient-Training" class="common-anchor-header">3: Formação económica</h3><p>A OpenAI afirma ter um desempenho equivalente ao do o3-mini e do o4-mini, mas com custos de formação muito mais baixos:</p>
<ul>
<li><p><strong>gpt-oss-120b</strong>: 2,1 milhões de horas H100 → ~$10M</p></li>
<li><p><strong>gpt-oss-20b</strong>: 210K H100-horas → ~$1M</p></li>
</ul>
<p>Compare-se isto com os orçamentos de várias centenas de milhões de dólares por detrás de modelos como o GPT-4. O GPT-oss prova que as escolhas eficientes de escalonamento e arquitetura podem proporcionar um desempenho competitivo sem uma enorme pegada de carbono.</p>
<h3 id="4-True-Open-Source-Freedom" class="common-anchor-header">4: Verdadeira liberdade de código aberto</h3><p>O GPT-oss usa a licença Apache 2.0, o que significa:</p>
<ul>
<li><p>Uso comercial permitido</p></li>
<li><p>Direitos totais de modificação e redistribuição</p></li>
<li><p>Sem restrições de uso ou cláusulas de copyleft</p></li>
</ul>
<p>Este é realmente um código aberto, não uma versão apenas para pesquisa. Pode ajustá-lo para uma utilização específica de um domínio, implementá-lo em produção com controlo total e criar produtos comerciais à sua volta. As principais caraterísticas incluem profundidade de raciocínio configurável (baixa/média/alta), visibilidade total da cadeia de pensamento e chamada de ferramenta nativa com suporte de saída estruturada.</p>
<h3 id="5-Potential-GPT-5-Preview" class="common-anchor-header">5: Pré-visualização potencial do GPT-5</h3><p>A OpenAI não revelou tudo - mas os detalhes da arquitetura sugerem que isto pode ser uma antevisão da direção do <strong>GPT-5</strong>:</p>
<ul>
<li><p>Usa MoE com 4 especialistas por entrada</p></li>
<li><p>Segue a alternância de atenção densa + atenção local esparsa (padrão GPT-3)</p></li>
<li><p>Apresenta mais cabeças de atenção</p></li>
<li><p>Curiosamente, as unidades de polarização do GPT-2 voltaram a aparecer</p></li>
</ul>
<p>Se está à espera de sinais sobre o que vem a seguir, o GPT-oss pode ser a dica pública mais clara até agora.</p>
<h3 id="Core-Specifications" class="common-anchor-header">Especificações do núcleo</h3><table>
<thead>
<tr><th></th><th></th><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>Modelo</strong></td><td><strong>Parâmetros totais</strong></td><td><strong>Parâmetros activos</strong></td><td><strong>Especialistas</strong></td><td><strong>Comprimento do contexto</strong></td><td><strong>Requerimento de VRAM</strong></td></tr>
<tr><td>gpt-oss-120b</td><td>117B</td><td>5.1B</td><td>128</td><td>128k</td><td>80GB</td></tr>
<tr><td>gpt-oss-20b</td><td>21B</td><td>3.6B</td><td>32</td><td>128k</td><td>16GB</td></tr>
</tbody>
</table>
<p>Ambos os modelos utilizam o tokenizador o200k_harmony e suportam um comprimento de contexto de 128.000 tokens (cerca de 96.000-100.000 palavras).</p>
<h2 id="GPT-oss-vs-Other-Reasoning-Models" class="common-anchor-header">GPT-oss vs. Outros Modelos de Raciocínio<button data-href="#GPT-oss-vs-Other-Reasoning-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>Aqui está como o GPT-oss se compara aos modelos internos da OpenAI e aos principais concorrentes de código aberto:</p>
<table>
<thead>
<tr><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>Modelo</strong></td><td><strong>Parâmetros (Ativo)</strong></td><td><strong>Memória</strong></td><td><strong>Pontos fortes</strong></td></tr>
<tr><td><strong>gpt-oss-120b</strong></td><td>117B (5,1B activos)</td><td>80GB</td><td>GPU única, raciocínio aberto</td></tr>
<tr><td><strong>gpt-oss-20b</strong></td><td>21B (3,6B activos)</td><td>16 GB</td><td>Implantação de borda, inferência rápida</td></tr>
<tr><td><strong>DeepSeek R1</strong></td><td>671B (~37B activos)</td><td>Distribuído</td><td>Líder em benchmark, desempenho comprovado</td></tr>
<tr><td><strong>o4-mini (API)</strong></td><td>Proprietário</td><td>Apenas API</td><td>Raciocínio forte (fechado)</td></tr>
<tr><td><strong>o3-mini (API)</strong></td><td>Proprietário</td><td>Apenas API</td><td>Raciocínio leve (fechado)</td></tr>
</tbody>
</table>
<p>Com base em vários modelos de avaliação comparativa, eis o que descobrimos:</p>
<ul>
<li><p><strong>GPT-oss vs. Modelos Próprios da OpenAI:</strong> O gpt-oss-120b corresponde ao o4-mini em matemática de competição (AIME), codificação (Codeforces) e uso de ferramentas (TauBench). O modelo 20b tem desempenho semelhante ao do o3-mini, apesar de ser muito menor.</p></li>
<li><p><strong>GPT-oss vs. DeepSeek R1:</strong> O DeepSeek R1 domina em termos de desempenho puro, mas requer uma infraestrutura distribuída. O GPT-oss oferece uma implantação mais simples - nenhuma configuração distribuída é necessária para o modelo 120b.</p></li>
</ul>
<p>Em resumo, o GPT-oss oferece a melhor combinação de desempenho, acesso aberto e capacidade de implantação. O DeepSeek R1 vence em desempenho puro, mas o GPT-oss atinge o equilíbrio ideal para a maioria dos desenvolvedores.</p>
<h2 id="Hands-on-Building-with-GPT-oss-+-Milvus" class="common-anchor-header">Prático: Construindo com GPT-oss + Milvus<button data-href="#Hands-on-Building-with-GPT-oss-+-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Agora que vimos o que o GPT-oss traz para a mesa, é hora de colocá-lo em uso.</p>
<p>Nas secções seguintes, vamos percorrer um tutorial prático para construir um sistema RAG com capacidade de raciocínio usando gpt-oss-20b e Milvus, tudo a correr localmente, sem necessidade de chave API.</p>
<h3 id="Environment-Setup" class="common-anchor-header">Configuração do ambiente</h3><pre><code translate="no">! pip install --upgrade <span class="hljs-string">&quot;pymilvus[model]&quot;</span> openai requests tqdm
<button class="copy-code-btn"></button></code></pre>
<h3 id="Dataset-Preparation" class="common-anchor-header">Preparação do conjunto de dados</h3><p>Usaremos a documentação do Milvus como nossa base de conhecimento:</p>
<pre><code translate="no"><span class="hljs-comment"># Download and prepare Milvus docs</span>
! wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
! unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs

<span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob
text_lines = []
<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()
    text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Model-Setup" class="common-anchor-header">Configuração do modelo</h3><p>Aceder ao GPT-oss através do <a href="https://openrouter.ai/openai/gpt-oss-20b:free">OpenRouter</a> (ou executar localmente). <a href="https://openrouter.ai/openai/gpt-oss-20b:free"><strong>O OpenRouter</strong></a> é uma plataforma que permite aos desenvolvedores acessar e alternar entre vários modelos de IA (como GPT-4, Claude, Mistral) por meio de uma API única e unificada. É útil para comparar modelos ou criar aplicações que funcionem com diferentes fornecedores de IA. Agora, a série GPT-oss está disponível no OpenRouter.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_46b575811f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI

<span class="hljs-comment"># Using OpenRouter for cloud access</span>
openai_client = OpenAI(
    api_key=<span class="hljs-string">&quot;&lt;OPENROUTER_API_KEY&gt;&quot;</span>,
    base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>,
)

<span class="hljs-comment"># Set up embedding model</span>
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model <span class="hljs-keyword">as</span> milvus_model
embedding_model = milvus_model.DefaultEmbeddingFunction()

<span class="hljs-comment"># Test embedding dimensions</span>
test_embedding = embedding_model.encode_queries([<span class="hljs-string">&quot;This is a test&quot;</span>])[<span class="hljs-number">0</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embedding)
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embedding[:<span class="hljs-number">10</span>])
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">768
[-0.04836066  0.07163023 -0.01130064 -0.03789345 -0.03320649 -0.01318448
 -0.03041712 -0.02269499 -0.02317863 -0.00426028]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Set-up-Milvus-vector-database" class="common-anchor-header">Configurar a base de dados vetorial Milvus</h3><pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

<span class="hljs-comment"># Initialize Milvus client</span>
milvus_client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>, token=<span class="hljs-string">&quot;root:Milvus&quot;</span>)
collection_name = <span class="hljs-string">&quot;gpt_oss_rag_collection&quot;</span>

<span class="hljs-comment"># Clean up existing collection</span>
<span class="hljs-keyword">if</span> milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)

<span class="hljs-comment"># Create new collection</span>
milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;IP&quot;</span>,  <span class="hljs-comment"># Inner product distance</span>
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>Sobre as definições dos parâmetros do MilvusClient:</p>
<ul>
<li><p>Definir o URI para um ficheiro local (por exemplo, <code translate="no">./milvus.db</code>) é o método mais conveniente, uma vez que utiliza automaticamente o Milvus Lite para armazenar todos os dados nesse ficheiro.</p></li>
<li><p>Para dados em grande escala, pode configurar um servidor Milvus mais poderoso no Docker ou Kubernetes. Nesse caso, use o URI do servidor (por exemplo, <code translate="no">http://localhost:19530</code>) como seu URI.</p></li>
<li><p>Se pretender utilizar <a href="https://zilliz.com/cloud">o Zilliz Cloud </a>(o serviço gerido do Milvus), ajuste o URI e o token, que correspondem ao Ponto de extremidade público e à chave da API no Zilliz Cloud.</p></li>
</ul>
<h3 id="Adding-Documents-to-the-Collection" class="common-anchor-header">Adicionar documentos à coleção</h3><p>Agora vamos criar embeddings para os nossos pedaços de texto e adicioná-los ao Milvus:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm

data = []
doc_embeddings = embedding_model.encode_documents(text_lines)

<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})

milvus_client.insert(collection_name=collection_name, data=data)
<button class="copy-code-btn"></button></code></pre>
<p>Output:</p>
<pre><code translate="no">Creating embeddings: 100%|█████████████████████████████████████████████████████████████████████████████████████████████████████████████████| 72/72 [00:00&lt;00:00, 1222631.13it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="RAG-Query-Pipeline" class="common-anchor-header">Pipeline de consulta RAG</h3><p>Agora a parte emocionante - vamos configurar o nosso sistema RAG para responder a perguntas.</p>
<p>Vamos especificar uma pergunta comum sobre o Milvus:</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Procurar esta pergunta na coleção e obter os 3 principais resultados semanticamente correspondentes:</p>
<pre><code translate="no">search_res = milvus_client.search(
    collection_name=collection_name,
    data=embedding_model.encode_queries(
        [question]
    ),  <span class="hljs-comment"># Convert the question to an embedding vector</span>
    limit=<span class="hljs-number">3</span>,  <span class="hljs-comment"># Return top 3 results</span>
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},  <span class="hljs-comment"># Inner product distance</span>
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],  <span class="hljs-comment"># Return the text field</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Vamos ver os resultados da pesquisa para esta pergunta:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json

retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including [MinIO](https://min.io/), [AWS S3](https://aws.amazon.com/s3/?nc1=h_ls), [Google Cloud Storage](https://cloud.google.com/storage?hl=en#object-storage-for-companies-of-all-sizes) (GCS), [Azure Blob Storage](https://azure.microsoft.com/en-us/products/storage/blobs), [Alibaba Cloud OSS](https://www.alibabacloud.com/product/object-storage-service), and [Tencent Cloud Object Storage](https://www.tencentcloud.com/products/cos) (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        <span class="hljs-number">0.6572664976119995</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus flush data?\n\nMilvus returns success when inserted data are loaded to the message queue. However, the data are not yet flushed to the disk. Then Milvus&#x27; data node writes the data in the message queue to persistent storage as incremental logs. If `flush()` is called, the data node is forced to write all data in the message queue to persistent storage immediately.\n\n###&quot;</span>,
        <span class="hljs-number">0.6312144994735718</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus handle vector data types and precision?\n\nMilvus supports Binary, Float32, Float16, and BFloat16 vector types.\n\n- Binary vectors: Store binary data as sequences of 0s and 1s, used in image processing and information retrieval.\n- Float32 vectors: Default storage with a precision of about 7 decimal digits. Even Float64 values are stored with Float32 precision, leading to potential precision loss upon retrieval.\n- Float16 and BFloat16 vectors: Offer reduced precision and memory usage. Float16 is suitable for applications with limited bandwidth and storage, while BFloat16 balances range and efficiency, commonly used in deep learning to reduce computational requirements without significantly impacting accuracy.\n\n###&quot;</span>,
        <span class="hljs-number">0.6115782856941223</span>
    ]
]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Using-the-GPT-oss-to-Build-a-RAG-Response" class="common-anchor-header">Utilizar o GPT-oss para criar uma resposta RAG</h3><p>Converta os documentos recuperados para o formato de cadeia de caracteres:</p>
<pre><code translate="no">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>Fornecer prompt do sistema e prompt do utilizador para o modelo de linguagem grande:</p>
<pre><code translate="no">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
Human: You are an AI assistant. You are able to find answers to the questions from the contextual passage snippets provided.
&quot;&quot;&quot;</span>
USER_PROMPT = <span class="hljs-string">f&quot;&quot;&quot;
Use the following pieces of information enclosed in &lt;context&gt; tags to provide an answer to the question enclosed in &lt;question&gt; tags.
&lt;context&gt;
<span class="hljs-subst">{context}</span>
&lt;/context&gt;
&lt;question&gt;
<span class="hljs-subst">{question}</span>
&lt;/question&gt;
&quot;&quot;&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Usar o modelo mais recente do gpt-oss para gerar uma resposta com base no prompt:</p>
<pre><code translate="no">response = openai_client.chat.completions.create(
    model=<span class="hljs-string">&quot;openai/gpt-oss-120b&quot;</span>,
    messages=[
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT},
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT},
    ],
)
<span class="hljs-built_in">print</span>(response.choices[<span class="hljs-number">0</span>].message.content)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">Milvus stores its data <span class="hljs-keyword">in</span> two distinct layers:

| Type of data | Where it <span class="hljs-keyword">is</span> stored | How it <span class="hljs-keyword">is</span> stored |
|-------------|-------------------|-----------------|
| **Inserted data** (vector data, scalar fields, collection‑specific schema) | In the **persistent <span class="hljs-built_in">object</span> storage** configured <span class="hljs-keyword">for</span> the cluster. The data are written <span class="hljs-keyword">as</span> **incremental logs** (append‑only logs) that are persisted <span class="hljs-keyword">by</span> the DataNode. | The DataNode reads <span class="hljs-keyword">from</span> the message‑<span class="hljs-function">queue <span class="hljs-keyword">and</span> writes the incoming data <span class="hljs-keyword">into</span> the storage <span class="hljs-title">backend</span> (<span class="hljs-params">MinIO, AWS S3, GCS, Azure Blob, Alibaba OSS, Tencent COS, etc.</span>). When a `<span class="hljs-title">flush</span>()` call <span class="hljs-keyword">is</span> issued, the DataNode forces all queued data to be written to the persistent storage immediately. |
| **Metadata** (<span class="hljs-params">information about collections, partitions, indexes, etc.</span>) | In **etcd**. Each Milvus <span class="hljs-title">module</span> (<span class="hljs-params">catalog, index, etc.</span>) keeps its own metadata. | The metadata <span class="hljs-keyword">is</span> generated <span class="hljs-keyword">and</span> managed <span class="hljs-keyword">by</span> Milvus <span class="hljs-keyword">and</span> persisted <span class="hljs-keyword">in</span> the distributed key‑<span class="hljs-keyword">value</span> store **etcd**. |

**Summary:**  
- **Inserted data**</span> = incremental logs stored <span class="hljs-keyword">in</span> the chosen <span class="hljs-built_in">object</span>‑storage backend.  
- **Metadata** = stored <span class="hljs-keyword">in</span> the distributed configuration store **etcd**.  


Together, <span class="hljs-function">these two storage <span class="hljs-title">mechanisms</span> (<span class="hljs-params"><span class="hljs-built_in">object</span> storage <span class="hljs-keyword">for</span> the actual data <span class="hljs-keyword">and</span> etcd <span class="hljs-keyword">for</span> metadata</span>) make up Milvus’s data‑storage architecture.
</span><button class="copy-code-btn"></button></code></pre>
<h2 id="Final-Thoughts-on-GPT-oss" class="common-anchor-header">Considerações finais sobre o GPT-oss<button data-href="#Final-Thoughts-on-GPT-oss" class="anchor-icon" translate="no">
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
    </button></h2><p>O GPT-oss é a admissão silenciosa da OpenAI de que o código aberto não pode mais ser ignorado. Ele não supera o DeepSeek R1 ou o Qwen 3 ou muitos outros modelos, mas traz algo que eles não trazem: O pipeline de treino da OpenAI, aplicado a um modelo que pode ser inspeccionado e executado localmente.</p>
<p><strong>Desempenho? Sólido. Não é alucinante, mas é fiável.</strong> O modelo 20B a funcionar em hardware de consumo - ou mesmo em dispositivos móveis com o LM Studio - é o tipo de vantagem prática que realmente interessa aos programadores. É mais "isto funciona" do que "uau, isto muda tudo". E, honestamente, isso é ótimo.</p>
<p><strong>O que fica aquém é o suporte multilingue.</strong> Se estiver a trabalhar em qualquer outra língua que não o inglês, irá deparar-se com frases estranhas, problemas de ortografia e confusão geral. O modelo foi claramente treinado com uma lente que dá prioridade ao inglês. Se a cobertura global for importante, é provável que tenha de o afinar com um conjunto de dados multilingue.</p>
<p>O mais interessante, no entanto, é o timing. O teaser da OpenAI no X - com um "5" na palavra "LIVESTREAM" - parece uma armadilha. O GPT-oss pode não ser o ato principal, mas pode ser uma antevisão do que está para vir no GPT-5. Mesmos ingredientes, escala diferente. Vamos esperar.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_0fed950b8e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>A verdadeira vitória é ter mais opções de alta qualidade.</strong> A concorrência impulsiona a inovação, e a reentrada da OpenAI no desenvolvimento de código aberto beneficia toda a gente. Teste o GPT-oss em relação aos seus requisitos específicos, mas escolha com base no que realmente funciona para o seu caso de uso, não no reconhecimento da marca.</p>
