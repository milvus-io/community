---
id: hermes-agent-learning-loop-milvus-hybrid-search.md
title: >-
  Como corrigir o ciclo de aprendizagem do agente Hermes com o Milvus 2.6 Hybrid
  Search
author: Min Yin
date: 2026-4-24
cover: >-
  assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_2_e0b44ee562.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Hermes Agent, Milvus 2.6, hybrid search, agent memory, skill learning loop'
meta_title: |
  How to Fix Hermes Agent's Learning Loop with Milvus 2.6 Hybrid Search
desc: >-
  O Loop de Aprendizagem do Agente Hermes escreve Skills a partir da utilização,
  mas o seu recuperador FTS5 não detecta consultas reformuladas. A pesquisa
  híbrida do Milvus 2.6 corrige a recuperação entre sessões.
origin: 'https://milvus.io/blog/hermes-agent-learning-loop-milvus-hybrid-search.md'
---
<p><a href="https://github.com/NousResearch/hermes-agent"><strong>O agente Hermes</strong></a> <strong>tem estado em todo o lado ultimamente.</strong> Criado pela Nous Research, o Hermes é um agente de IA pessoal auto-hospedado que funciona no seu próprio hardware (um VPS de 5 dólares funciona) e fala consigo através de canais de chat existentes, como o Telegram.</p>
<p><strong>Seu maior destaque é um loop de aprendizado embutido:</strong> o loop cria habilidades a partir da experiência, melhora-as durante o uso e pesquisa conversas anteriores para encontrar padrões reutilizáveis. Outros frameworks de agentes codificam manualmente as habilidades antes da implantação. As competências do Hermes crescem com a utilização e os fluxos de trabalho repetidos tornam-se reutilizáveis com zero alterações de código.</p>
<p><strong>O problema é que a recuperação do Hermes é apenas por palavra-chave.</strong> Corresponde a palavras exactas, mas não ao significado que os utilizadores procuram. Quando os utilizadores utilizam palavras diferentes em sessões diferentes, o ciclo não as consegue ligar e não é escrita nenhuma nova competência. Quando há apenas algumas centenas de documentos, a lacuna é tolerável. <strong>Depois disso, o ciclo deixa de aprender porque não consegue encontrar o seu próprio historial.</strong></p>
<p><strong>A solução é o Milvus 2.6.</strong> A sua <a href="https://milvus.io/docs/multi-vector-search.md">pesquisa híbrida</a> abrange tanto o significado como as palavras-chave exactas numa única consulta, pelo que o ciclo pode finalmente ligar informações reformuladas entre sessões. É suficientemente leve para caber num pequeno servidor na nuvem (um VPS de 5 dólares por mês executa-o). Para o trocar não é necessário alterar o Hermes - o Milvus fica atrás da camada de recuperação, por isso o Learning Loop mantém-se intacto. O Hermes continua a escolher qual a Skill a correr, e o Milvus trata do que deve ser recuperado.</p>
<p>Mas a recompensa mais profunda vai para além de uma melhor memorização: quando a recuperação funciona, o circuito de aprendizagem pode armazenar a própria estratégia de recuperação como uma competência - e não apenas o conteúdo que recupera. É assim que o trabalho de conhecimento do agente se combina em todas as sessões.</p>
<h2 id="Hermes-Agent-Architecture-How-Four-Layer-Memory-Powers-the-Skill-Learning-Loop" class="common-anchor-header">Arquitetura do Agente Hermes: Como a Memória de Quatro Camadas Potencia o Ciclo de Aprendizagem de Competências<button data-href="#Hermes-Agent-Architecture-How-Four-Layer-Memory-Powers-the-Skill-Learning-Loop" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/NousResearch/hermes-agent"><strong>O Hermes</strong></a> <strong>tem quatro camadas de memória, e a L4 Skills é a que o distingue.</strong></p>
<ul>
<li><strong>L1</strong> - contexto da sessão, apagado quando a sessão é encerrada</li>
<li><strong>L2</strong> - factos persistentes: pilha de projectos, convenções da equipa, decisões resolvidas</li>
<li><strong>L3</strong> - pesquisa de palavras-chave SQLite FTS5 em ficheiros locais</li>
<li><strong>L4</strong> - armazena fluxos de trabalho como ficheiros Markdown. Ao contrário das ferramentas LangChain ou dos plug-ins AutoGPT, que os programadores criam em código antes da implementação, as competências L4 são auto-escritas: crescem a partir do que o agente realmente executa, sem qualquer autoria do programador.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_3_3653368e99.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Why-Hermess-FTS5-Keyword-Retrieval-Breaks-the-Learning-Loop" class="common-anchor-header">Porque é que a recuperação de palavras-chave do FTS5 do Hermes quebra o ciclo de aprendizagem<button data-href="#Why-Hermess-FTS5-Keyword-Retrieval-Breaks-the-Learning-Loop" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>O Hermes precisa da recuperação para acionar fluxos de trabalho entre sessões em primeiro lugar.</strong> Mas sua camada L3 embutida usa SQLite FTS5, que só corresponde a tokens literais, não ao significado.</p>
<p><strong>Quando os utilizadores expressam a mesma intenção de forma diferente nas várias sessões, o FTS5 não faz a correspondência.</strong> O Ciclo de Aprendizagem não é ativado. Não é escrita nenhuma nova competência e, da próxima vez que a intenção surgir, o utilizador volta a fazer o encaminhamento à mão.</p>
<p>Exemplo: a base de conhecimento armazena "loop de eventos asyncio, agendamento de tarefas async, E/S sem bloqueio". Um utilizador pesquisa "Python concurrency". FTS5 retorna zero resultados - nenhuma palavra literal se sobrepõe, e FTS5 não tem como ver que são a mesma pergunta.</p>
<p>Abaixo de algumas centenas de documentos, a diferença é tolerável. Depois disso, a documentação usa um vocabulário e os utilizadores perguntam noutro, e o FTS5 não tem qualquer ponte entre eles. <strong>O conteúdo irrecuperável pode muito bem não estar na base de conhecimento, e o Learning Loop não tem nada com que aprender.</strong></p>
<h2 id="How-Milvus-26-Fixes-the-Retrieval-Gap-with-Hybrid-Search-and-Tiered-Storage" class="common-anchor-header">Como o Milvus 2.6 corrige a lacuna de recuperação com pesquisa híbrida e armazenamento em camadas<button data-href="#How-Milvus-26-Fixes-the-Retrieval-Gap-with-Hybrid-Search-and-Tiered-Storage" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>O Milvus 2.6 traz duas atualizações que se encaixam nos pontos de falha do Hermes.</strong> <strong>A pesquisa híbrida</strong> desbloqueia o Learning Loop, cobrindo a recuperação semântica e por palavra-chave numa única chamada. <strong>O armazenamento em camadas</strong> mantém todo o backend de recuperação pequeno o suficiente para rodar no mesmo VPS de $5/mês para o qual o Hermes foi construído.</p>
<h3 id="What-Hybrid-Search-Solves-Finding-Relevant-Information" class="common-anchor-header">O que o Hybrid Search resolve: Encontrar informações relevantes</h3><p>O Milvus 2.6 suporta a execução de ambas as recuperações vectoriais (semântica) e <a href="https://milvus.io/docs/full-text-search.md">a pesquisa de texto completo BM25</a> (palavra-chave) numa única consulta, e depois junta as duas listas de classificação com <a href="https://milvus.io/docs/multi-vector-search.md">Reciprocal Rank Fusion (RRF)</a>.</p>
<p>Por exemplo: pergunte &quot;qual é o princípio do asyncio&quot;, e a recuperação vetorial atinge conteúdos semanticamente relacionados. Pergunte &quot;onde está definida a função <code translate="no">find_similar_task</code> &quot;, e o BM25 corresponde exatamente ao nome da função no código. Para perguntas que envolvem uma função dentro de um determinado tipo de tarefa, a pesquisa híbrida devolve o resultado correto numa única chamada, sem lógica de encaminhamento escrita à mão.</p>
<p>Para o Hermes, é isto que desbloqueia o ciclo de aprendizagem. Quando uma segunda sessão reformula a intenção, a recuperação de vectores capta a correspondência semântica que o FTS5 perdeu. O loop dispara e uma nova habilidade é escrita.</p>
<h3 id="What-Tiered-Storage-Solves-Cost" class="common-anchor-header">O que o armazenamento em camadas resolve: Custo</h3><p>Uma base de dados vetorial ingénua quereria o índice de incorporação completo na RAM, o que empurra as implementações pessoais para infra-estruturas maiores e mais caras. Milvus 2.6 evita isso com armazenamento em três camadas, movendo entradas entre camadas baseado na frequência de acesso:</p>
<ul>
<li><strong>Quente</strong> - na memória</li>
<li><strong>Quente</strong> - em SSD</li>
<li><strong>Frio</strong> - no armazenamento de objectos</li>
</ul>
<p>Apenas os dados quentes permanecem residentes. Uma base de conhecimento de 500 documentos cabe em 2 GB de RAM. Toda a pilha de recuperação funciona no mesmo VPS de $5/mês que o Hermes visa, sem necessidade de atualização da infraestrutura.</p>
<h2 id="Hermes-+-Milvus-System-Architecture" class="common-anchor-header">Hermes + Milvus: Arquitetura do Sistema<button data-href="#Hermes-+-Milvus-System-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>O Hermes escolhe a habilidade a ser executada. O Milvus trata do que deve ser recuperado.</strong> Os dois sistemas permanecem separados, e a interface do Hermes não muda.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_4_1794304940.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>O fluxo:</strong></p>
<ol>
<li>O Hermes identifica a intenção do utilizador e encaminha para uma competência.</li>
<li>A competência chama um script de recuperação através da ferramenta de terminal.</li>
<li>O script acede ao Milvus, executa uma pesquisa híbrida e devolve partes classificadas com metadados de origem.</li>
<li>O Hermes compõe a resposta. A memória regista o fluxo de trabalho.</li>
<li>Quando o mesmo padrão se repete nas sessões, o Learning Loop escreve uma nova Skill.</li>
</ol>
<h2 id="How-to-Install-Hermes-and-Milvus-26" class="common-anchor-header">Como instalar o Hermes e o Milvus 2.6<button data-href="#How-to-Install-Hermes-and-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Instale o Hermes e</strong> <a href="https://milvus.io/docs/install_standalone-docker.md"><strong>o Milvus 2.6 Standalone</strong></a><strong>, depois crie uma coleção com campos densos e BM25.</strong> Essa é a configuração completa antes que o Loop de Aprendizagem possa disparar.</p>
<h3 id="Install-Hermes" class="common-anchor-header">Instalar o Hermes</h3><pre><code translate="no" class="language-bash">curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
<button class="copy-code-btn"></button></code></pre>
<p>Execute <code translate="no">hermes</code> para entrar no assistente de inicialização interativo:</p>
<ul>
<li><strong>Provedor LLM</strong> - OpenAI, Anthropic, OpenRouter (OpenRouter tem modelos gratuitos)</li>
<li><strong>Canal</strong> - este passo a passo usa um bot FLark</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_5_dceeae1519.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Run-Milvus-26-Standalone" class="common-anchor-header">Executar o Milvus 2.6 autónomo</h3><p>Um nó único autónomo é suficiente para um agente pessoal:</p>
<pre><code translate="no" class="language-bash">curl -sfL https://raw.githubusercontent.com/milvus-io/milvus/master/scripts/standalone_embed.sh \
-o standalone_embed.sh
bash standalone_embed.sh start
<span class="hljs-comment"># Verify service status</span>
docker ps | grep milvus
<button class="copy-code-btn"></button></code></pre>
<h3 id="Create-the-Collection" class="common-anchor-header">Criar a coleção</h3><p>O design do esquema limita o que a recuperação pode fazer. Este esquema executa vectores densos e vectores esparsos BM25 lado a lado:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType, Function, FunctionType
client = MilvusClient(
    uri=<span class="hljs-string">&quot;http://192.168.x.x:19530&quot;</span>,
)
schema = client.create_schema(auto_id=<span class="hljs-literal">True</span>, enable_dynamic_field=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
<span class="hljs-comment"># Raw text (for BM25 full-text search)</span>
schema.add_field(
    <span class="hljs-string">&quot;text&quot;</span>,
    DataType.VARCHAR,
    max_length=<span class="hljs-number">8192</span>,
    enable_analyzer=<span class="hljs-literal">True</span>,
    enable_match=<span class="hljs-literal">True</span>
)
<span class="hljs-comment"># Dense vector (semantic search)</span>
schema.add_field(<span class="hljs-string">&quot;dense_vector&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">1536</span>)
<span class="hljs-comment"># Sparse vector (BM25 auto-generated, Milvus 2.6 feature)</span>
schema.add_field(<span class="hljs-string">&quot;sparse_vector&quot;</span>, DataType.SPARSE_FLOAT_VECTOR)
schema.add_field(<span class="hljs-string">&quot;source&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">512</span>)
schema.add_field(<span class="hljs-string">&quot;chunk_index&quot;</span>, DataType.INT32)
<span class="hljs-comment"># Tell Milvus to auto-convert text to sparse_vector via BM25</span>
bm25_function = Function(
    name=<span class="hljs-string">&quot;text_bm25&quot;</span>,
    function_type=FunctionType.BM25,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;sparse_vector&quot;</span>],
)
schema.add_function(bm25_function)
index_params = client.prepare_index_params()
<span class="hljs-comment"># HNSW graph index (dense vector)</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;dense_vector&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    params={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">256</span>}
)
<span class="hljs-comment"># BM25 inverted index (sparse vector)</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;sparse_vector&quot;</span>,
    index_type=<span class="hljs-string">&quot;SPARSE_INVERTED_INDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span>
)
client.create_collection(
    collection_name=<span class="hljs-string">&quot;hermes_milvus&quot;</span>,
    schema=schema,
    index_params=index_params
)
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_6_0646f46d36.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Hybrid-Search-Script" class="common-anchor-header">Script de pesquisa híbrida</h3><pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> sys, json
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, AnnSearchRequest, RRFRanker

client = MilvusClient(<span class="hljs-string">&quot;http://192.168.x.x:19530&quot;</span>)
oai    = OpenAI()
COLLECTION = <span class="hljs-string">&quot;hermes_milvus&quot;</span>

<span class="hljs-keyword">def</span> <span class="hljs-title function_">hybrid_search</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">dict</span>]:
    <span class="hljs-comment"># 1. Vectorize query</span>
    dense_vec = oai.embeddings.create(
        model=<span class="hljs-string">&quot;text-embedding-3-small&quot;</span>,
        <span class="hljs-built_in">input</span>=query
    ).data[<span class="hljs-number">0</span>].embedding

    <span class="hljs-comment"># 2. Dense vector retrieval (semantic relevance)</span>
    dense_req = AnnSearchRequest(
        data=[dense_vec],
        anns_field=<span class="hljs-string">&quot;dense_vector&quot;</span>,
        param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;ef&quot;</span>: <span class="hljs-number">128</span>}},
        limit=top_k * <span class="hljs-number">2</span>       <span class="hljs-comment"># Widen candidate set, let RRF do final ranking</span>
    )

    <span class="hljs-comment"># 3. BM25 sparse vector retrieval (exact term matching)</span>
    bm25_req = AnnSearchRequest(
        data=[query],
        anns_field=<span class="hljs-string">&quot;sparse_vector&quot;</span>,
        param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>},
        limit=top_k * <span class="hljs-number">2</span>
    )

    <span class="hljs-comment"># 4. RRF fusion ranking</span>
    results = client.hybrid_search(
        collection_name=COLLECTION,
        reqs=[dense_req, bm25_req],
        ranker=RRFRanker(k=<span class="hljs-number">60</span>),
        limit=top_k,
        output_fields=[<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;source&quot;</span>, <span class="hljs-string">&quot;doc_type&quot;</span>]
    )

    <span class="hljs-keyword">return</span> [
        {
            <span class="hljs-string">&quot;text&quot;</span>:     r.entity.get(<span class="hljs-string">&quot;text&quot;</span>),
            <span class="hljs-string">&quot;source&quot;</span>:   r.entity.get(<span class="hljs-string">&quot;source&quot;</span>),
            <span class="hljs-string">&quot;doc_type&quot;</span>: r.entity.get(<span class="hljs-string">&quot;doc_type&quot;</span>),
            <span class="hljs-string">&quot;score&quot;</span>:    <span class="hljs-built_in">round</span>(r.distance, <span class="hljs-number">4</span>)
        }
        <span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]
    ]

<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    query= sys.argv[<span class="hljs-number">1</span>] <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(sys.argv) &gt; <span class="hljs-number">1</span> <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;&quot;</span>
    top_k  = <span class="hljs-built_in">int</span>(sys.argv[<span class="hljs-number">2</span>]) <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(sys.argv) &gt; <span class="hljs-number">2</span> <span class="hljs-keyword">else</span> <span class="hljs-number">5</span>
    output = hybrid_search(query, top_k)
    <span class="hljs-built_in">print</span>(json.dumps(output, ensure_ascii=<span class="hljs-literal">False</span>, indent=<span class="hljs-number">2</span>))
<button class="copy-code-btn"></button></code></pre>
<p><strong>O pedido denso alarga o conjunto de candidatos em 2× para que a RRF tenha o suficiente para classificar.</strong> <code translate="no">text-embedding-3-small</code> é a incorporação OpenAI mais barata que ainda mantém a qualidade de recuperação; troque por <code translate="no">text-embedding-3-large</code> se o orçamento o permitir.</p>
<p>Com o ambiente e a base de conhecimentos prontos, a próxima secção põe à prova o circuito de aprendizagem.</p>
<h2 id="Hermes-Skill-Auto-Generation-in-Practice" class="common-anchor-header">Geração automática de habilidades Hermes na prática<button data-href="#Hermes-Skill-Auto-Generation-in-Practice" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Duas sessões mostram o circuito de aprendizagem em ação.</strong> Na primeira, o utilizador nomeia o script à mão. Na segunda, uma nova sessão faz a mesma pergunta sem nomear o script. O Hermes pega no padrão e escreve três Competências.</p>
<h3 id="Session-1-Call-the-Script-by-Hand" class="common-anchor-header">Sessão 1: Chamar o guião à mão</h3><p>Abre o Hermes no Lark. Dá-lhe o caminho do guião e o alvo de recuperação. O Hermes invoca a ferramenta de terminal, corre o guião e devolve a resposta com a atribuição da fonte. <strong>Ainda não existe nenhuma habilidade. Esta é uma simples chamada de ferramenta.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_7_1c2d9261f4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Session-2-Ask-Without-Naming-the-Script" class="common-anchor-header">Sessão 2: Perguntar sem nomear o guião</h3><p>Limpe a conversa. Começar de novo. Faça a mesma categoria de perguntas sem mencionar o guião ou o caminho.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_8_27253eda82.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Memory-Writes-First-Skill-Follows" class="common-anchor-header">A memória escreve primeiro, a habilidade segue</h3><p><strong>O Ciclo de Aprendizagem regista o fluxo de trabalho (guião, argumentos, forma de retorno) e devolve a resposta.</strong> A memória guarda o rasto; ainda não existe nenhuma competência.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_9_a0768f84bd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>A correspondência da segunda sessão diz ao laço que vale a pena manter o padrão.</strong> Quando ele dispara, três habilidades são escritas:</p>
<table>
<thead>
<tr><th>Competência</th><th>Função</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">hybrid-search-doc-qa</code></td><td>Executar pesquisa híbrida semântica + palavra-chave na Memória e compor a resposta</td></tr>
<tr><td><code translate="no">milvus-docs-ingest-verification</code></td><td>Verificar se os documentos foram ingeridos na base de conhecimento</td></tr>
<tr><td><code translate="no">terminal</code></td><td>Executar comandos shell: scripts, configuração do ambiente, inspeção</td></tr>
</tbody>
</table>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_10_b68e35bc46.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>A partir deste ponto, <strong>os utilizadores deixam de nomear as competências.</strong> O Hermes infere a intenção, encaminha para a competência, extrai as partes relevantes da memória e escreve a resposta. Não existe um seletor de competências no prompt.</p>
<p>A maioria dos sistemas RAG (retrieval-augmented generation) resolve o problema do armazenamento e da pesquisa, mas a lógica de pesquisa propriamente dita está codificada no código da aplicação. Se perguntar de uma forma diferente ou num novo cenário, a recuperação é interrompida. O Hermes armazena a estratégia de pesquisa como uma habilidade, o que significa que <strong>o caminho de pesquisa se torna um documento que pode ser lido, editado e versionado.</strong> A linha <code translate="no">💾 Memory updated · Skill 'hybrid-search-doc-qa' created</code> não é um marcador de configuração concluída. É <strong>o Agente que está a gravar um padrão de comportamento na memória de longo prazo.</strong></p>
<h2 id="Hermes-vs-OpenClaw-Accumulation-vs-Orchestration" class="common-anchor-header">Hermes vs. OpenClaw: Acumulação vs. Orquestração<button data-href="#Hermes-vs-OpenClaw-Accumulation-vs-Orchestration" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>O Hermes e o OpenClaw respondem a problemas diferentes.</strong> O Hermes foi criado para um único agente que acumula memória e competências ao longo das sessões. O OpenClaw foi criado para dividir uma tarefa complexa em partes e entregar cada parte a um agente especializado.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_11_afcb575d50.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>O ponto forte do OpenClaw é a orquestração. Optimiza a parte de uma tarefa que é feita automaticamente. O ponto forte do Hermes é a acumulação: um único agente que se lembra de todas as sessões, com competências que crescem com a utilização. O Hermes optimiza o contexto a longo prazo e a experiência no domínio.</p>
<p><strong>Os dois frameworks são empilhados.</strong> O Hermes oferece um caminho de migração de uma etapa que puxa a memória e as habilidades do <code translate="no">~/.openclaw</code> para as camadas de memória do Hermes. Uma pilha de orquestração pode ficar por cima, com um agente de acumulação por baixo.</p>
<p>Para o lado OpenClaw da divisão, consulte <a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">O que é OpenClaw? Guia completo para o agente de IA de código aberto</a> no blogue Milvus.</p>
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
    </button></h2><p>O Learning Loop do Hermes transforma fluxos de trabalho repetidos em Skills reutilizáveis, mas apenas se a recuperação os puder ligar entre sessões. A pesquisa por palavra-chave do FTS5 não consegue. <a href="https://milvus.io/docs/multi-vector-search.md"><strong>A pesquisa híbrida do Milvus 2.6</strong></a> consegue: os vectores densos tratam do significado, o BM25 trata das palavras-chave exactas, o RRF funde ambos e <a href="https://milvus.io/docs/tiered-storage-overview.md">o armazenamento em camadas</a> mantém toda a pilha num VPS de 5 dólares por mês.</p>
<p>O ponto principal: quando a recuperação funciona, o agente não armazena apenas melhores respostas: armazena melhores estratégias de recuperação como Skills. O caminho de busca torna-se um documento versionável que melhora com o uso. É isso que separa um agente que acumula conhecimentos de domínio de um que começa do zero a cada sessão. Para uma comparação de como outros agentes lidam (ou não lidam) com esse problema, consulte <a href="https://milvus.io/blog/claude-code-memory-memsearch.md">Sistema de memória do Claude Code explicado.</a></p>
<h2 id="Get-Started" class="common-anchor-header">Começar a utilizar<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Experimente as ferramentas deste artigo:</strong></p>
<ul>
<li><a href="https://github.com/NousResearch/hermes-agent">Agente Hermes no GitHub</a> - script de instalação, configuração do provedor e configuração do canal usados acima.</li>
<li><a href="https://milvus.io/docs/install_standalone-docker.md">Milvus 2.6 Standalone Quickstart</a> - implantação Docker de nó único para o backend da base de conhecimento.</li>
<li><a href="https://milvus.io/docs/multi-vector-search.md">Tutorial de pesquisa híbrida do Milvus</a> - exemplo completo denso + BM25 + RRF correspondente ao script neste post.</li>
</ul>
<p><strong>Tem perguntas sobre a busca híbrida Hermes + Milvus?</strong></p>
<ul>
<li>Junte-se ao <a href="https://discord.gg/milvus">Milvus Discord</a> para perguntar sobre pesquisa híbrida, armazenamento em camadas ou padrões de encaminhamento de habilidades - outros desenvolvedores estão construindo pilhas semelhantes.</li>
<li><a href="https://milvus.io/community#office-hours">Marque uma sessão do Milvus Office Hours</a> para analisar o seu próprio agente + configuração da base de conhecimentos com a equipa do Milvus.</li>
</ul>
<p><strong>Quer ignorar o auto-hospedagem?</strong></p>
<ul>
<li><a href="https://cloud.zilliz.com/signup">Registe-se</a> ou <a href="https://cloud.zilliz.com/login">inicie sessão</a> no Zilliz Cloud - Milvus gerido com pesquisa híbrida e armazenamento em camadas pronto a usar. As novas contas de e-mail de trabalho recebem <strong> 100 dólares em créditos gratuitos</strong>.</li>
</ul>
<h2 id="Further-Reading" class="common-anchor-header">Leitura adicional<button data-href="#Further-Reading" class="anchor-icon" translate="no">
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
<li><a href="https://milvus.io/docs/release_notes.md">Notas de lançamento do Milvus 2.6</a> - armazenamento em camadas, pesquisa híbrida, alterações de esquema</li>
<li><a href="https://zilliz.com/blog">Zilliz Cloud &amp; Milvus CLI + Official Skills</a> - ferramentas operacionais para agentes nativos do Milvus</li>
<li><a href="https://zilliz.com/blog">Porque é que a Gestão de Conhecimento ao estilo RAG é um fracasso para os Agentes</a> - o caso do design de memória específico do agente</li>
<li><a href="https://zilliz.com/blog">O sistema de memória do Claude Code é mais primitivo do que seria de esperar</a> - artigo de comparação sobre a pilha de memória de outro agente</li>
</ul>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">Perguntas frequentes<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="How-does-Hermes-Agents-Skill-Learning-Loop-actually-work" class="common-anchor-header">Como é que o ciclo de aprendizagem de competências do agente Hermes funciona realmente?</h3><p>O Hermes regista todos os fluxos de trabalho que executa - o script chamado, os argumentos passados e a forma de retorno - como um traço de memória. Quando o mesmo padrão aparece em duas ou mais sessões, o Learning Loop dispara e escreve uma Skill reutilizável: um arquivo Markdown que captura o fluxo de trabalho como um procedimento repetível. A partir desse momento, o Hermes dirige-se à Competência apenas pela intenção, sem que o utilizador a nomeie. A dependência crítica é a recuperação - o loop só dispara se conseguir encontrar o traço da sessão anterior, e é por isso que a pesquisa apenas por palavra-chave se torna um estrangulamento à escala.</p>
<h3 id="Whats-the-difference-between-hybrid-search-and-vector-only-search-for-agent-memory" class="common-anchor-header">Qual é a diferença entre a pesquisa híbrida e a pesquisa apenas vetorial para a memória do agente?</h3><p>A pesquisa somente de vetor lida bem com o significado, mas perde as correspondências exatas. Se um desenvolvedor colar uma cadeia de caracteres de erro como ConnectionResetError ou um nome de função como find_similar_task, uma pesquisa vetorial pura pode retornar resultados semanticamente relacionados, mas errados. A pesquisa híbrida combina vectores densos (semântica) com BM25 (palavra-chave) e funde os dois conjuntos de resultados com a Fusão de Classificação Recíproca. Para a memória do agente - em que as consultas vão desde uma intenção vaga ("Python concurrency") a símbolos exactos - a pesquisa híbrida cobre ambas as extremidades numa única chamada sem lógica de encaminhamento na sua camada de aplicação.</p>
<h3 id="Can-I-use-Milvus-hybrid-search-with-AI-agents-other-than-Hermes" class="common-anchor-header">Posso utilizar a pesquisa híbrida Milvus com outros agentes de IA para além do Hermes?</h3><p>Sim. O padrão de integração é genérico: o agente chama um script de recuperação, o script consulta o Milvus e os resultados são devolvidos como partes classificadas com metadados de origem. Qualquer estrutura de agente que suporte chamadas de ferramentas ou execução de shell pode usar a mesma abordagem. O Hermes é uma boa opção porque o seu Learning Loop depende especificamente da recuperação entre sessões para disparar, mas o lado do Milvus é independente do agente - não sabe nem quer saber que agente o está a chamar.</p>
<h3 id="How-much-does-a-self-hosted-Milvus-+-Hermes-setup-cost-per-month" class="common-anchor-header">Quanto custa por mês uma configuração auto-hospedada do Milvus + Hermes?</h3><p>Um nó único Milvus 2.6 Standalone em um VPS de 2 núcleos / 4 GB com armazenamento em camadas <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>custa</mi></mrow></semantics></math></span></span>cerca de <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>5/mês</mi><mi mathvariant="normal">.</mi><mi>OpenAItext-embedding-3-smallcusta5/mês</mi></mrow><annotation encoding="application/x-tex">.</annotation><annotation encoding="application/x-tex">OpenAI text-embedding-3-small custa</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal">5/mês</span><span class="mord">.</span><span class="mord mathnormal">OpenAItext</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">-</span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span><span class="mord mathnormal" style="margin-right:0.03588em;">embedding</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">-</span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span> 3</span></span></span> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">-</span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6944em;"></span><span class="mord mathnormal">smallcusta0</span></span></span></span>.02 por 1M tokens - alguns cêntimos por mês para uma base de conhecimento pessoal. A inferência LLM domina o custo total e escala com o uso, não com a pilha de recuperação.</p>
