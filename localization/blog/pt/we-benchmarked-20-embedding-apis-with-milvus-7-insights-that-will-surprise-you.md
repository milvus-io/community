---
id: >-
  we-benchmarked-20-embedding-apis-with-milvus-7-insights-that-will-surprise-you.md
title: >-
  Avaliámos mais de 20 APIs de incorporação com o Milvus: 7 informações que o
  vão surpreender
author: Jeremy Zhu
date: 2025-05-23T00:00:00.000Z
desc: >-
  As APIs de incorporação mais populares não são as mais rápidas. A geografia é
  mais importante do que a arquitetura do modelo. E, por vezes, uma CPU de 20
  dólares por mês é melhor do que uma chamada de API de 200 dólares por mês.
cover: >-
  assets.zilliz.com/We_Benchmarked_20_Embedding_AP_Is_with_Milvus_7_Insights_That_Will_Surprise_You_12268622f0.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus, Embedding API, RAG, latency, vector search'
meta_title: >
  We Benchmarked 20+ Embedding APIs with Milvus: 7 Insights That Will Surprise
  You
origin: >-
  https://milvus.io/blog/we-benchmarked-20-embedding-apis-with-milvus-7-insights-that-will-surprise-you.md
---
<p><strong>Provavelmente, todos os programadores de IA criaram um sistema RAG que funciona na perfeição... no seu ambiente local.</strong></p>
<p>Conseguiu obter a precisão da recuperação, optimizou a sua base de dados de vectores e a sua demonstração funciona na perfeição. Depois, implementa-o na produção e, de repente:</p>
<ul>
<li><p>As suas consultas locais de 200 ms demoram 3 segundos para os utilizadores reais</p></li>
<li><p>Colegas em diferentes regiões relatam um desempenho completamente diferente</p></li>
<li><p>O fornecedor de incorporação que escolheu para obter a "melhor precisão" torna-se o seu maior obstáculo</p></li>
</ul>
<p>O que é que aconteceu? Aqui está o assassino de desempenho que ninguém avalia: <strong>latência da API de incorporação</strong>.</p>
<p>Enquanto as classificações MTEB estão obcecadas com as pontuações de recordação e os tamanhos dos modelos, ignoram a métrica que os seus utilizadores sentem - o tempo que esperam antes de verem qualquer resposta. Testámos todos os principais fornecedores de incorporação em condições reais e descobrimos diferenças extremas de latência que o farão questionar toda a sua estratégia de seleção de fornecedores.</p>
<p><strong><em>Spoiler: As APIs de incorporação mais populares não são as mais rápidas. A geografia é mais importante do que a arquitetura do modelo. E, às vezes, uma <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>CPU de</mn><mi>20/mês</mi></mrow><annotation encoding="application/x-tex">bate uma CPU</annotation><mrow><mn>de 20/mês</mn></mrow><annotation encoding="application/x-tex">e uma</annotation></semantics></math></span></span>chamada de API de</em></strong><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><strong><em> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">20/mês bate uma</span></span></span></span>API de <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord mathnormal">200/mês</span></span></span></span>.</em></strong></p>
<h2 id="Why-Embedding-API-Latency-Is-the-Hidden-Bottleneck-in-RAG" class="common-anchor-header">Por que incorporar a latência da API é o gargalo oculto do RAG<button data-href="#Why-Embedding-API-Latency-Is-the-Hidden-Bottleneck-in-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>Ao criar sistemas RAG, pesquisa de comércio eletrónico ou motores de recomendação, os modelos de incorporação são o componente central que transforma o texto em vectores, permitindo que as máquinas compreendam a semântica e efectuem pesquisas de semelhança eficientes. Embora normalmente pré-computemos os embeddings para bibliotecas de documentos, as consultas dos utilizadores continuam a exigir chamadas à API de embedding em tempo real para converter perguntas em vectores antes da recuperação, e esta latência em tempo real torna-se frequentemente o estrangulamento de desempenho em toda a cadeia de aplicações.</p>
<p>Os benchmarks de incorporação populares, como o MTEB, concentram-se na precisão da recuperação ou no tamanho do modelo, muitas vezes negligenciando a métrica de desempenho crucial - a latência da API. Utilizando a função <code translate="no">TextEmbedding</code> da Milvus, realizámos testes abrangentes no mundo real com os principais fornecedores de serviços de incorporação na América do Norte e na Ásia.</p>
<p>A latência de incorporação manifesta-se em duas fases críticas:</p>
<h3 id="Query-Time-Impact" class="common-anchor-header">Impacto no tempo de consulta</h3><p>Num fluxo de trabalho RAG típico, quando um utilizador faz uma pergunta, o sistema tem de:</p>
<ul>
<li><p>Converter a consulta num vetor através de uma chamada à API de incorporação</p></li>
<li><p>Procurar vectores semelhantes no Milvus</p></li>
<li><p>Enviar os resultados e a pergunta original para um LLM</p></li>
<li><p>Gerar e devolver a resposta</p></li>
</ul>
<p>Muitos programadores assumem que a geração de respostas do LLM é a parte mais lenta. No entanto, a capacidade de saída de streaming de muitos LLMs cria uma ilusão de velocidade - você vê o primeiro token rapidamente. Na realidade, se a sua chamada à API de incorporação demorar centenas de milissegundos ou mesmo segundos, ela se tornará o primeiro - e mais percetível - gargalo na sua cadeia de resposta.</p>
<h3 id="Data-Ingestion-Impact" class="common-anchor-header">Impacto da ingestão de dados</h3><p>Seja criando um índice do zero ou realizando atualizações de rotina, a ingestão em massa requer a vetorização de milhares ou milhões de pedaços de texto. Se cada chamada de incorporação sofrer alta latência, todo o pipeline de dados ficará muito lento, atrasando o lançamento de produtos e as atualizações da base de conhecimento.</p>
<p>Ambas as situações tornam a latência da API de incorporação uma métrica de desempenho não negociável para sistemas RAG de produção.</p>
<h2 id="Measuring-Real-World-Embedding-API-Latency-with-Milvus" class="common-anchor-header">Medindo a latência da API de incorporação no mundo real com o Milvus<button data-href="#Measuring-Real-World-Embedding-API-Latency-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus é um banco de dados vetorial de alto desempenho e código aberto que oferece uma nova interface <code translate="no">TextEmbedding</code> Function. Esse recurso integra diretamente modelos de incorporação populares do OpenAI, Cohere, AWS Bedrock, Google Vertex AI, Voyage AI e muitos outros provedores em seu pipeline de dados, simplificando seu pipeline de pesquisa vetorial com uma única chamada.</p>
<p>Usando essa nova interface de função, testamos e comparamos APIs de incorporação populares de provedores conhecidos como OpenAI e Cohere, bem como outros como AliCloud e SiliconFlow, medindo sua latência de ponta a ponta em cenários de implantação realistas.</p>
<p>Nosso abrangente conjunto de testes abrangeu várias configurações de modelo:</p>
<table>
<thead>
<tr><th><strong>Fornecedor</strong></th><th><strong>Modelo</strong></th><th><strong>Dimensões</strong></th></tr>
</thead>
<tbody>
<tr><td>OpenAI</td><td>incorporação de texto-ada-002</td><td>1536</td></tr>
<tr><td>OpenAI</td><td>incorporação de texto-3-pequeno</td><td>1536</td></tr>
<tr><td>OpenAI</td><td>texto-embedding-3-grande</td><td>3072</td></tr>
<tr><td>AWS Bedrock</td><td>amazon.titan-embed-text-v2:0</td><td>1024</td></tr>
<tr><td>IA do Google Vertex</td><td>incorporação de texto-005</td><td>768</td></tr>
<tr><td>Google Vertex AI</td><td>texto-multilingue-embedding-002</td><td>768</td></tr>
<tr><td>VoyageAI</td><td>voyage-3-grande</td><td>1024</td></tr>
<tr><td>VoyageAI</td><td>voyage-3</td><td>1024</td></tr>
<tr><td>VoyageAI</td><td>voyage-3-lite</td><td>512</td></tr>
<tr><td>VoyageAI</td><td>voyage-code-3</td><td>1024</td></tr>
<tr><td>Coesão</td><td>embed-english-v3.0</td><td>1024</td></tr>
<tr><td>Coesão</td><td>embed-multilingual-v3.0</td><td>1024</td></tr>
<tr><td>Coesão</td><td>embed-english-light-v3.0</td><td>384</td></tr>
<tr><td>Coesão</td><td>incorporar-multilingue-light-v3.0</td><td>384</td></tr>
<tr><td>Aliyun Dashscope</td><td>incorporação de texto-v1</td><td>1536</td></tr>
<tr><td>Dashscope de Aliyun</td><td>texto-embedding-v2</td><td>1536</td></tr>
<tr><td>Dashscope de Aliyun</td><td>texto-embedding-v3</td><td>1024</td></tr>
<tr><td>Siliconflow</td><td>BAAI/bge-large-zh-v1.5</td><td>1024</td></tr>
<tr><td>Fluxo de silício</td><td>BAAI/bge-large-en-v1.5</td><td>1024</td></tr>
<tr><td>Fluxo de silício</td><td>netease-youdao/bce-embedding-base_v1</td><td>768</td></tr>
<tr><td>Fluxo de silício</td><td>BAAI/bge-m3</td><td>1024</td></tr>
<tr><td>Fluxo de silício</td><td>Pro/BAAI/bge-m3</td><td>1024</td></tr>
<tr><td>TEI</td><td>BAAI/bge-base-en-v1.5</td><td>768</td></tr>
</tbody>
</table>
<h2 id="7-Key-Findings-from-Our-Benchmarking-Results" class="common-anchor-header">7 Principais conclusões dos nossos resultados de avaliação comparativa<button data-href="#7-Key-Findings-from-Our-Benchmarking-Results" class="anchor-icon" translate="no">
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
    </button></h2><p>Testámos os principais modelos de incorporação em diferentes tamanhos de lote, comprimentos de token e condições de rede, medindo a latência média em todos os cenários. Os resultados revelam informações importantes que podem reformular a forma como escolhe e optimiza as APIs de incorporação. Vamos dar uma olhada.</p>
<h3 id="1-Global-Network-Effects-Are-More-Significant-Than-You-Think" class="common-anchor-header">1. Os efeitos da rede global são mais significativos do que se pensa</h3><p>O ambiente de rede é talvez o fator mais crítico que afeta o desempenho da API de incorporação. O mesmo provedor de serviços de API de incorporação pode ter um desempenho muito diferente em diferentes ambientes de rede.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/latency_in_Asia_vs_in_US_cb4b5a425a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Quando seu aplicativo é implantado na Ásia e acessa serviços como OpenAI, Cohere ou VoyageAI implantados na América do Norte, a latência da rede aumenta significativamente. Nossos testes reais mostram que a latência da chamada de API aumentou universalmente de <strong>3 a 4 vezes</strong>!</p>
<p>Por outro lado, quando seu aplicativo é implantado na América do Norte e acessa serviços asiáticos como o AliCloud Dashscope ou o SiliconFlow, a degradação do desempenho é ainda mais grave. O SiliconFlow, em particular, apresentou aumentos de latência de <strong>quase 100 vezes</strong> em cenários inter-regionais!</p>
<p>Isto significa que deve selecionar sempre os fornecedores de incorporação com base na localização da sua implementação e na geografia do utilizador - as afirmações de desempenho sem contexto de rede não fazem sentido.</p>
<h3 id="2-Model-Performance-Rankings-Reveal-Surprising-Results" class="common-anchor-header">2. As classificações de desempenho do modelo revelam resultados surpreendentes</h3><p>Nossos testes abrangentes de latência revelaram hierarquias claras de desempenho:</p>
<ul>
<li><p><strong>Modelos baseados na América do Norte (latência média)</strong>: Cohere &gt; Google Vertex AI &gt; VoyageAI &gt; OpenAI &gt; AWS Bedrock</p></li>
<li><p><strong>Modelos baseados na Ásia (latência média)</strong>: SiliconFlow &gt; AliCloud Dashscope</p></li>
</ul>
<p>Estas classificações desafiam a sabedoria convencional sobre a seleção de fornecedores.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/median_latency_with_batch_size_1_ef83bec9c8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/median_latency_with_batch_size_10_0d4e52566f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/all_model_latency_vs_token_length_when_batch_size_is_10_537516cc1c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/all_model_latency_vstoken_lengthwhen_batch_size_is_10_4dcf0d549a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Nota: Devido ao impacto significativo do ambiente de rede e das regiões geográficas do servidor na latência da API de incorporação em tempo real, comparamos as latências dos modelos baseados na América do Norte e na Ásia separadamente.</p>
<h3 id="3-Model-Size-Impact-Varies-Dramatically-by-Provider" class="common-anchor-header">3. O impacto do tamanho do modelo varia drasticamente de acordo com o provedor</h3><p>Observamos uma tendência geral em que os modelos maiores têm maior latência do que os modelos padrão, que têm maior latência do que os modelos menores/lite. No entanto, esse padrão não era universal e revelou informações importantes sobre a arquitetura de back-end. Por exemplo:</p>
<ul>
<li><p><strong>O Cohere e o OpenAI</strong> apresentaram diferenças mínimas de desempenho entre os tamanhos dos modelos</p></li>
<li><p><strong>O VoyageAI</strong> apresentou diferenças claras de desempenho com base no tamanho do modelo</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Model_Size_Impact_Varies_Dramatically_by_Provider_1_f9eaf2be26.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Model_Size_Impact_Varies_Dramatically_by_Provider_2_cf4d72d1ad.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Model_Size_Impact_Varies_Dramatically_by_Provider_3_5e0c8d890b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Isso indica que o tempo de resposta da API depende de vários fatores além da arquitetura do modelo, incluindo estratégias de backend em lote, otimização do tratamento de solicitações e infraestrutura específica do provedor. A lição é clara: <em>não confie no tamanho do modelo ou na data de lançamento como indicadores de desempenho fiáveis - teste sempre no seu próprio ambiente de implementação.</em></p>
<h3 id="4-Token-Length-and-Batch-Size-Create-Complex-Trade-offs" class="common-anchor-header">4. O comprimento do token e o tamanho do lote criam compensações complexas</h3><p>Dependendo da sua implementação de back-end, especialmente da sua estratégia de lote. O comprimento do token pode ter pouco impacto na latência até que o tamanho dos lotes aumente. Nossos testes revelaram alguns padrões claros:</p>
<ul>
<li><p><strong>A latência do OpenAI</strong> permaneceu razoavelmente consistente entre lotes pequenos e grandes, sugerindo recursos generosos de loteamento de backend</p></li>
<li><p><strong>O VoyageAI</strong> mostrou efeitos claros no comprimento dos tokens, o que implica uma otimização mínima do backend para a criação de lotes</p></li>
</ul>
<p>Tamanhos de lote maiores aumentam a latência absoluta, mas melhoram a taxa de transferência geral. Em nossos testes, passar de batch=1 para batch=10 aumentou a latência em 2×-5×, enquanto aumentou substancialmente o throughput total. Isso representa uma oportunidade crítica de otimização para fluxos de trabalho de processamento em massa, em que é possível trocar a latência de solicitações individuais por uma taxa de transferência geral do sistema drasticamente aprimorada.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Going_from_batch_1_to_10_latency_increased_2_5_9811536a3c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Indo de batch=1 para 10, a latência aumentou 2×-5×</p>
<h3 id="5-API-Reliability-Introduces-Production-Risk" class="common-anchor-header">5. Confiabilidade da API introduz risco de produção</h3><p>Observamos uma variabilidade significativa na latência, particularmente com OpenAI e VoyageAI, introduzindo imprevisibilidade nos sistemas de produção.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Latency_variance_when_batch_1_d9cd88fb73.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Variação de latência quando lote=1</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Latency_variance_when_batch_10_5efc33bf4e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Variação de latência quando lote=10</p>
<p>Embora nossos testes tenham se concentrado principalmente na latência, confiar em qualquer API externa introduz riscos de falha inerentes, incluindo flutuações de rede, limitação de taxa do provedor e interrupções de serviço. Sem SLAs claros dos fornecedores, os programadores devem implementar estratégias robustas de tratamento de erros, incluindo novas tentativas, tempos limite e disjuntores para manter a fiabilidade do sistema em ambientes de produção.</p>
<h3 id="6-Local-Inference-Can-Be-Surprisingly-Competitive" class="common-anchor-header">6. A inferência local pode ser surpreendentemente competitiva</h3><p>Os nossos testes também revelaram que a implementação local de modelos de incorporação de tamanho médio pode oferecer um desempenho comparável ao das APIs na nuvem - uma descoberta crucial para aplicações sensíveis ao orçamento ou à latência.</p>
<p>Por exemplo, a implantação do código aberto <code translate="no">bge-base-en-v1.5</code> via TEI (Text Embeddings Inference) em uma modesta CPU de 4c8g correspondeu ao desempenho de latência do SiliconFlow, fornecendo uma alternativa acessível de inferência local. Esta descoberta é particularmente significativa para programadores individuais e pequenas equipas que podem não ter recursos de GPU de nível empresarial, mas que ainda precisam de capacidades de incorporação de alto desempenho.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/TEI_Latency_2f09be1ef0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Latência TEI</p>
<h3 id="7-Milvus-Overhead-Is-Negligible" class="common-anchor-header">7. A sobrecarga do Milvus é insignificante</h3><p>Como usamos o Milvus para testar a latência da API de incorporação, validamos que a sobrecarga adicional introduzida pela função TextEmbedding do Milvus é mínima e praticamente insignificante. As nossas medições mostram que as operações do Milvus acrescentam apenas 20-40ms no total, enquanto as chamadas à API de incorporação demoram centenas de milissegundos a vários segundos, o que significa que o Milvus acrescenta menos de 5% de sobrecarga ao tempo total da operação. O gargalo de desempenho está principalmente na transmissão da rede e nas capacidades de processamento dos provedores de serviços da API de incorporação, e não na camada do servidor Milvus.</p>
<h2 id="Tips-How-to-Optimize-Your-RAG-Embedding-Performance" class="common-anchor-header">Dicas: Como otimizar o desempenho da incorporação de RAG<button data-href="#Tips-How-to-Optimize-Your-RAG-Embedding-Performance" class="anchor-icon" translate="no">
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
    </button></h2><p>Com base nos nossos parâmetros de referência, recomendamos as seguintes estratégias para otimizar o desempenho de incorporação do seu sistema RAG:</p>
<h3 id="1-Always-Localize-Your-Testing" class="common-anchor-header">1. Localize sempre os seus testes</h3><p>Não confie em nenhum relatório de benchmark genérico (incluindo este!). Deve testar sempre os modelos no seu ambiente de implementação real, em vez de se basear apenas em referências publicadas. As condições de rede, a proximidade geográfica e as diferenças de infraestrutura podem afetar drasticamente o desempenho no mundo real.</p>
<h3 id="2-Geo-Match-Your-Providers-Strategically" class="common-anchor-header">2. Combine estrategicamente seus provedores geograficamente</h3><ul>
<li><p><strong>Para implantações na América do Norte</strong>: Considere Cohere, VoyageAI, OpenAI/Azure ou GCP Vertex AI - e faça sempre a sua própria validação de desempenho</p></li>
<li><p><strong>Para implantações na Ásia</strong>: Considere seriamente os fornecedores de modelos asiáticos, como o AliCloud Dashscope ou o SiliconFlow, que oferecem melhor desempenho regional</p></li>
<li><p><strong>Para públicos globais</strong>: Implemente o roteamento de várias regiões ou selecione provedores com infraestrutura distribuída globalmente para minimizar as penalidades de latência entre regiões</p></li>
</ul>
<h3 id="3-Question-Default-Provider-Choices" class="common-anchor-header">3. Questionar as escolhas do fornecedor predefinido</h3><p>Os modelos de incorporação da OpenAI são tão populares que muitas empresas e programadores os escolhem como opções predefinidas. No entanto, os nossos testes revelaram que a latência e a estabilidade da OpenAI eram, na melhor das hipóteses, médias, apesar da sua popularidade no mercado. Questione as suposições sobre os "melhores" fornecedores com as suas próprias referências rigorosas - a popularidade nem sempre se correlaciona com o desempenho ideal para o seu caso de utilização específico.</p>
<h3 id="4-Optimize-Batch-and-Chunk-Configurations" class="common-anchor-header">4. Otimize as configurações de lotes e pedaços</h3><p>Uma configuração não se adapta a todos os modelos ou casos de uso. O tamanho ideal do lote e o comprimento do bloco variam significativamente entre os provedores devido a diferentes arquiteturas de back-end e estratégias de lote. Experimente sistematicamente com diferentes configurações para encontrar o ponto de desempenho ideal, considerando as compensações de taxa de transferência versus latência para os requisitos específicos da sua aplicação.</p>
<h3 id="5-Implement-Strategic-Caching" class="common-anchor-header">5. Implemente o armazenamento em cache estratégico</h3><p>Para consultas de alta frequência, armazene em cache o texto da consulta e as suas incorporações geradas (utilizando soluções como o Redis). As consultas idênticas subsequentes podem ir diretamente para a cache, reduzindo a latência para milissegundos. Esta é uma das técnicas de otimização da latência das consultas mais rentáveis e com maior impacto.</p>
<h3 id="6-Consider-Local-Inference-Deployment" class="common-anchor-header">6. Considere a implantação de inferência local</h3><p>Se os requisitos de latência de ingestão de dados, latência de consulta e privacidade de dados forem extremamente altos, ou se os custos de chamadas de API forem proibitivos, considere implantar modelos de incorporação localmente para inferência. Os planos de API padrão geralmente vêm com limitações de QPS, latência instável e falta de garantias de SLA - restrições que podem ser problemáticas para ambientes de produção.</p>
<p>Para muitos desenvolvedores individuais ou pequenas equipes, a falta de GPUs de nível empresarial é uma barreira para a implantação local de modelos de incorporação de alto desempenho. No entanto, isso não significa abandonar totalmente a inferência local. Com mecanismos de inferência de alto desempenho como o <a href="https://github.com/huggingface/text-embeddings-inference">text-embeddings-inference da Hugging Face</a>, até mesmo a execução de modelos de incorporação de pequeno a médio porte em uma CPU pode alcançar um desempenho decente que pode superar as chamadas de API de alta latência, especialmente para a geração de incorporação offline em grande escala.</p>
<p>Esta abordagem requer uma consideração cuidadosa dos compromissos entre custo, desempenho e complexidade de manutenção.</p>
<h2 id="How-Milvus-Simplifies-Your-Embedding-Workflow" class="common-anchor-header">Como o Milvus simplifica o seu fluxo de trabalho de incorporação<button data-href="#How-Milvus-Simplifies-Your-Embedding-Workflow" class="anchor-icon" translate="no">
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
    </button></h2><p>Como mencionado, Milvus não é apenas uma base de dados vetorial de alto desempenho - também oferece uma interface de função de incorporação conveniente que se integra perfeitamente com modelos de incorporação populares de vários fornecedores, tais como OpenAI, Cohere, AWS Bedrock, Google Vertex AI, Voyage AI, e mais em todo o mundo no seu pipeline de pesquisa vetorial.</p>
<p>O Milvus vai além do armazenamento e da recuperação de vetores com recursos que simplificam a integração de incorporação:</p>
<ul>
<li><p><strong>Gerenciamento eficiente de vetores</strong>: Como uma base de dados de alto desempenho criada para colecções de vectores maciças, o Milvus oferece armazenamento fiável, opções de indexação flexíveis (HNSW, IVF, RaBitQ, DiskANN, entre outras) e capacidades de recuperação rápidas e precisas.</p></li>
<li><p><strong>Troca simplificada de provedores</strong>: Milvus oferece uma interface <code translate="no">TextEmbedding</code> Function, permitindo configurar a função com suas chaves de API, trocar de provedores ou modelos instantaneamente e medir o desempenho no mundo real sem integração complexa de SDK.</p></li>
<li><p><strong>Pipelines de dados de ponta a ponta</strong>: Ligue para <code translate="no">insert()</code> com texto bruto, e o Milvus incorpora e armazena automaticamente os vectores numa única operação, simplificando drasticamente o código do seu pipeline de dados.</p></li>
<li><p><strong>Texto para resultados em uma chamada</strong>: Ligue para <code translate="no">search()</code> com consultas de texto, e o Milvus lida com a incorporação, pesquisa e retorno de resultados - tudo em uma única chamada de API.</p></li>
<li><p><strong>Integração independente do provedor</strong>: Milvus abstrai os detalhes de implementação do provedor; basta configurar sua função e chave de API uma vez, e você está pronto para começar.</p></li>
<li><p><strong>Compatibilidade com ecossistemas de código aberto</strong>: Quer gere embeddings através da nossa função incorporada <code translate="no">TextEmbedding</code>, inferência local ou outro método, Milvus fornece armazenamento unificado e capacidades de recuperação.</p></li>
</ul>
<p>Isto cria uma experiência simplificada de "Data-In, Insight-Out", em que o Milvus trata internamente da geração de vectores, tornando o código da sua aplicação mais simples e fácil de manter.</p>
<h2 id="Conclusion-The-Performance-Truth-Your-RAG-System-Needs" class="common-anchor-header">Conclusão: A verdade sobre o desempenho de que seu sistema RAG precisa<button data-href="#Conclusion-The-Performance-Truth-Your-RAG-System-Needs" class="anchor-icon" translate="no">
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
    </button></h2><p>O assassino silencioso do desempenho do RAG não está onde a maioria dos desenvolvedores está procurando. Enquanto as equipas gastam recursos em engenharia de prontidão e otimização LLM, a latência da API incorporada sabota silenciosamente a experiência do utilizador com atrasos que podem ser 100 vezes piores do que o esperado. Nossos benchmarks abrangentes expõem a dura realidade: popular não significa performático, a geografia importa mais do que a escolha do algoritmo em muitos casos, e a inferência local às vezes supera APIs de nuvem caras.</p>
<p>Essas descobertas destacam um ponto cego crucial na otimização de RAG. Penalidades de latência entre regiões, classificações inesperadas de desempenho de provedores e a surpreendente competitividade da inferência local não são casos extremos - são realidades de produção que afetam aplicativos reais. Compreender e medir o desempenho da API de incorporação é essencial para proporcionar experiências de utilizador com capacidade de resposta.</p>
<p>A escolha do provedor de incorporação é uma peça crítica do quebra-cabeça do desempenho da RAG. Ao testar no seu ambiente de implantação real, selecionar provedores geograficamente apropriados e considerar alternativas como inferência local, você pode eliminar uma grande fonte de atrasos voltados para o usuário e criar aplicativos de IA realmente responsivos.</p>
<p>Para obter mais detalhes sobre como fizemos esse benchmarking, consulte <a href="https://github.com/zhuwenxing/text-embedding-bench">este notebook</a>.</p>
