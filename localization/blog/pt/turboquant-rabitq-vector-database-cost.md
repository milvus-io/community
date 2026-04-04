---
id: turboquant-rabitq-vector-database-cost.md
title: >-
  Para além do debate TurboQuant-RaBitQ: porque é que a quantização vetorial é
  importante para os custos da infraestrutura de IA
author: Li Liu
date: 2026-4-2
cover: assets.zilliz.com/vectorquantization_0bea9e6bec.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  TurboQuant, RaBitQ, vector quantization, TurboQuant vs RaBitQ, vector database
  memory optimization
meta_title: |
  Vector Quantization: Beyond the TurboQuant-RaBitQ Debate
desc: >-
  O debate TurboQuant-RaBitQ fez da quantização vetorial notícia de primeira
  página. Como funciona a compressão de 1 bit RaBitQ e como a Milvus envia o
  IVF_RABITQ para economizar 97% de memória.
origin: 'https://milvus.io/blog/turboquant-rabitq-vector-database-cost.md'
---
<p>O documento TurboQuant da Google (ICLR 2026) relatou uma compressão de 6x da cache KV com uma perda de precisão quase nula - resultados suficientemente impressionantes para eliminar <a href="https://www.cnbc.com/2026/03/26/google-ai-turboquant-memory-chip-stocks-samsung-micron.html"> 90 mil milhões de dólares das acções de chips de memória</a> num único dia. A SK Hynix caiu 12%. A Samsung caiu 7%.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Beyond_the_Turbo_Quant_Ra_Bit_Q_Debate_How_Vector_Quantization_Is_Reshaping_AI_Infrastructure_from_Paper_to_Production_1_825845eccb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>O artigo foi rapidamente objeto de análise. <a href="https://gaoj0017.github.io/">Jianyang Gao</a>, primeiro autor do <a href="https://dl.acm.org/doi/10.1145/3654970">RaBitQ</a> (SIGMOD 2024), <a href="https://medium.com/@gaojianyang0017/turboquant-and-rabitq-what-the-public-story-gets-wrong-23df83209c22">levantou questões</a> sobre a relação entre a metodologia do TurboQuant e o seu trabalho anterior sobre quantização vetorial. (Iremos publicar uma conversa com o Dr. Gao em breve - siga-nos se estiver interessado).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Beyond_the_Turbo_Quant_Ra_Bit_Q_Debate_How_Vector_Quantization_Is_Reshaping_AI_Infrastructure_from_Paper_to_Production_2_0860406cae.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Este artigo não é sobre tomar partido nessa discussão. O que nos chamou a atenção foi algo maior: o facto de um único artigo sobre <a href="https://milvus.io/docs/index-explained.md">quantização</a> de vectores poder movimentar 90 mil milhões de dólares em valor de mercado diz-nos quão crítica esta tecnologia se tornou para a infraestrutura de IA. Quer se trate de comprimir a cache KV em motores de inferência ou de comprimir índices em <a href="https://zilliz.com/learn/what-is-vector-database">bases de dados vectoriais</a>, a capacidade de reduzir dados de elevada dimensão preservando a qualidade tem enormes implicações em termos de custos - e é um problema em que temos estado a trabalhar, integrando o RaBitQ na base de dados vetorial <a href="https://milvus.io/">Milvus</a> e transformando-o em infraestrutura de produção.</p>
<p>Vamos falar sobre: por que a quantização de vetores é tão importante agora, como o TurboQuant e o RaBitQ se comparam, o que é o RaBitQ e como ele funciona, o trabalho de engenharia por trás do envio dele para o Milvus e como é o cenário mais amplo de otimização de memória para a infraestrutura de IA.</p>
<h2 id="Why-Does-Vector-Quantization-Matter-for-Infrastructure-Costs" class="common-anchor-header">Por que a quantização vetorial é importante para os custos de infraestrutura?<button data-href="#Why-Does-Vector-Quantization-Matter-for-Infrastructure-Costs" class="anchor-icon" translate="no">
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
    </button></h2><p>A quantização vetorial não é nova. O que é novo é a urgência com que a indústria precisa dela. Nos últimos dois anos, os parâmetros LLM aumentaram, as janelas de contexto passaram de 4K para 128K+ tokens e os dados não estruturados - texto, imagens, áudio, vídeo - tornaram-se uma entrada de primeira classe para os sistemas de IA. Cada uma destas tendências cria mais vectores de alta dimensão que precisam de ser armazenados, indexados e pesquisados. Mais vectores, mais memória, mais custos.</p>
<p>Se estiver a executar a pesquisa de vectores em escala - <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">pipelines RAG</a>, motores de recomendação, recuperação multimodal - o custo da memória é provavelmente uma das suas maiores dores de cabeça em termos de infraestrutura.</p>
<p>Durante a implantação do modelo, todas as principais pilhas de inferência LLM dependem do <a href="https://zilliz.com/glossary/kv-cache">cache KV</a> - armazenando pares de valores-chave computados anteriormente para que o mecanismo de atenção não os recompute para cada novo token. É o que torna possível a inferência O(n) em vez de O(n²). Todos os frameworks, do <a href="https://github.com/vllm-project/vllm">vLLM</a> ao <a href="https://github.com/NVIDIA/TensorRT-LLM">TensorRT-LLM</a>, dependem dele. Mas o cache KV pode consumir mais memória da GPU do que os próprios pesos do modelo. Contextos mais longos, mais utilizadores em simultâneo, e a situação aumenta rapidamente.</p>
<p>A mesma pressão atinge as bases de dados vectoriais - milhares de milhões de vectores de alta dimensão na memória, cada um com um float de 32 bits por dimensão. A quantização de vectores comprime estes vectores de floats de 32 bits para representações de 4 bits, 2 bits ou mesmo 1 bit - reduzindo a memória em 90% ou mais. Quer se trate da cache KV no seu motor de inferência ou de índices na sua base de dados vetorial, a matemática subjacente é a mesma e as poupanças de custos são reais. É por isso que um único artigo que relata um avanço neste espaço movimentou 90 mil milhões de dólares em valor de mercado de acções.</p>
<h2 id="TurboQuant-vs-RaBitQ-Whats-the-Difference" class="common-anchor-header">TurboQuant vs RaBitQ: Qual é a diferença?<button data-href="#TurboQuant-vs-RaBitQ-Whats-the-Difference" class="anchor-icon" translate="no">
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
    </button></h2><p>Tanto o TurboQuant como o RaBitQ baseiam-se na mesma técnica fundamental: aplicar uma rotação aleatória<a href="https://arxiv.org/abs/2406.03482">(transformada de Johnson-Lindenstrauss</a>) aos vectores de entrada antes da quantização. Essa rotação transforma dados distribuídos irregularmente em uma distribuição uniforme previsível, facilitando a quantização com baixo erro.</p>
<p>Para além desta base partilhada, os dois visam problemas diferentes e adoptam abordagens diferentes:</p>
<table>
<thead>
<tr><th></th><th>TurboQuant</th><th>RaBitQ</th></tr>
</thead>
<tbody>
<tr><td><strong>Objetivo</strong></td><td>Cache KV na inferência LLM (dados efémeros, por pedido)</td><td>Índices vectoriais persistentes em bases de dados (dados armazenados)</td></tr>
<tr><td><strong>Abordagem</strong></td><td>Duas fases: PolarQuant (quantificador escalar Lloyd-Max por coordenada) + <a href="https://arxiv.org/abs/2406.03482">QJL</a> (correção residual de 1 bit)</td><td>Fase única: projeção hipercubo + estimador de distância não enviesado</td></tr>
<tr><td><strong>Largura dos bits</strong></td><td>Chaves de 3 bits, valores de 2 bits (precisão mista)</td><td>1 bit por dimensão (com variantes multi-bit disponíveis)</td></tr>
<tr><td><strong>Alegação teórica</strong></td><td>Taxa de distorção MSE quase óptima</td><td>Erro de estimativa do produto interno assimptoticamente ótimo (correspondendo aos limites inferiores de Alon-Klartag)</td></tr>
<tr><td><strong>Estado de produção</strong></td><td>Implementações comunitárias; sem lançamento oficial da Google</td><td>Lançado no <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6</a>, adotado por Faiss, VSAG, Elasticsearch</td></tr>
</tbody>
</table>
<p>A principal diferença para os profissionais: O TurboQuant optimiza a cache KV transitória dentro de um motor de inferência, enquanto o RaBitQ visa os índices persistentes que uma base de dados vetorial constrói, fragmenta e consulta em milhares de milhões de vectores. No restante deste artigo, vamos nos concentrar no RaBitQ - o algoritmo que integramos e colocamos em produção no Milvus.</p>
<h2 id="What-Is-RaBitQ-and-What-Does-It-Deliver" class="common-anchor-header">O que é o RaBitQ e o que ele oferece?<button data-href="#What-Is-RaBitQ-and-What-Does-It-Deliver" class="anchor-icon" translate="no">
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
    </button></h2><p>Em primeiro lugar, o resultado final: num conjunto de dados de 10 milhões de vectores com 768 dimensões, o RaBitQ comprime cada vetor para 1/32 do seu tamanho original, mantendo a recuperação acima dos 94%. Em Milvus, isso traduz-se num rendimento de consulta 3,6 vezes superior ao de um índice de precisão total. Esta não é uma projeção teórica - é um resultado de referência do Milvus 2.6.</p>
<p>Agora, como se chega lá.</p>
<p>A quantização binária tradicional comprime os vectores FP32 para 1 bit por dimensão - 32x de compressão. A desvantagem: a recordação cai porque se deita fora demasiada informação. <a href="https://arxiv.org/abs/2405.12497">O RaBitQ</a> (Gao &amp; Long, SIGMOD 2024) mantém a mesma compressão de 32x, mas preserva a informação que realmente importa para a pesquisa. Uma <a href="https://arxiv.org/abs/2409.09913">versão alargada</a> (Gao &amp; Long, SIGMOD 2025) prova que isto é assintoticamente ótimo, correspondendo aos limites inferiores teóricos estabelecidos por Alon &amp; Klartag (FOCS 2017).</p>
<h3 id="Why-Do-Angles-Matter-More-Than-Coordinates-in-High-Dimensions" class="common-anchor-header">Porque é que os ângulos são mais importantes do que as coordenadas em dimensões elevadas?</h3><p>A principal conclusão: <strong>em dimensões elevadas, os ângulos entre vectores são mais estáveis e informativos do que os valores de coordenadas individuais.</strong> Esta é uma consequência da concentração de medidas - o mesmo fenómeno que faz com que as projecções aleatórias de Johnson-Lindenstrauss funcionem.</p>
<p>O que isto significa na prática: é possível descartar os valores exactos das coordenadas de um vetor de elevada dimensão e manter apenas a sua direção em relação ao conjunto de dados. As relações angulares - que é do que <a href="https://zilliz.com/glossary/anns">a pesquisa do vizinho mais próximo</a> realmente depende - sobrevivem à compressão.</p>
<h3 id="How-Does-RaBitQ-Work" class="common-anchor-header">Como é que o RaBitQ funciona?</h3><p>O RaBitQ transforma essa visão geométrica em três etapas:</p>
<p><strong>Etapa 1: Normalizar.</strong> Centralize cada vetor em relação ao centroide do conjunto de dados e dimensione para o comprimento da unidade. Isso converte o problema em estimativa de produto interno entre vetores unitários - mais fácil de analisar e limitar.</p>
<p><strong>Passo 2: Rotação aleatória + projeção hipercubo.</strong> Aplique uma matriz ortogonal aleatória (uma rotação do tipo Johnson-Lindenstrauss) para remover a tendência para qualquer eixo. Projetar cada vetor rodado no vértice mais próximo de um hipercubo {±1/√D}^D. Cada dimensão reduz-se a um único bit. O resultado: um código binário de D bits por vetor.</p>
<p><strong>Passo 3: Estimativa de distância não enviesada.</strong> Construa um estimador para o produto interno entre uma consulta e o vetor original (não quantizado). O estimador é comprovadamente imparcial com erro limitado por O(1/√D). Para vectores de 768 dimensões, isto mantém a recordação acima de 94%.</p>
<p>O cálculo da distância entre vectores binários reduz-se a AND + popcount bit a bit - operações que as CPUs modernas executam num único ciclo. Isto é o que torna o RaBitQ rápido, não apenas pequeno.</p>
<h3 id="Why-Is-RaBitQ-Practical-Not-Just-Theoretical" class="common-anchor-header">Porque é que o RaBitQ é prático e não apenas teórico?</h3><ul>
<li><strong>Não é necessária formação.</strong> Aplique a rotação, verifique os sinais. Sem otimização iterativa, sem aprendizagem de livro de códigos. O tempo de indexação é comparável à <a href="https://milvus.io/docs/ivf-pq.md">quantização do produto</a>.</li>
<li><strong>Compatível com o hardware.</strong> O cálculo da distância é bit a bit AND + popcount. As CPUs modernas (Intel IceLake+, AMD Zen 4+) têm instruções AVX512VPOPCNTDQ dedicadas. A estimativa de um único vetor é 3 vezes mais rápida do que as tabelas de pesquisa PQ.</li>
<li><strong>Flexibilidade multi-bit.</strong> A <a href="https://vectordb-ntu.github.io/RaBitQ-Library/">biblioteca RaBitQ</a> suporta variantes para além de 1 bit: 4 bits alcança ~90% de recuperação, 5 bits ~95%, 7 bits ~99% - tudo sem reranking.</li>
<li><strong>Compossível.</strong> Conecta-se a estruturas de índice existentes, como <a href="https://milvus.io/docs/ivf-flat.md">índices IVF</a> e <a href="https://milvus.io/docs/hnsw.md">gráficos HNSW</a>, e trabalha com o FastScan para computação de distância em lote.</li>
</ul>
<h2 id="From-Paper-to-Production-What-We-Built-to-Ship-RaBitQ-in-Milvus" class="common-anchor-header">Do papel à produção: O que construímos para enviar o RaBitQ em Milvus<button data-href="#From-Paper-to-Production-What-We-Built-to-Ship-RaBitQ-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>O código original do RaBitQ é um protótipo de pesquisa de uma única máquina. Para fazê-lo funcionar em um <a href="https://milvus.io/docs/architecture_overview.md">cluster distribuído</a> com sharding, failover e ingestão em tempo real, foi necessário resolver quatro problemas de engenharia. Na <a href="https://zilliz.com/">Zilliz</a>, fomos além da simples implementação do algoritmo - o trabalho abrangeu a integração do motor, a aceleração do hardware, a otimização do índice e o ajuste do tempo de execução para transformar o RaBitQ numa capacidade de nível industrial dentro do Milvus. Você pode encontrar mais detalhes neste blog também: <a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Leve a compactação vetorial ao extremo: como o Milvus atende a 3× mais consultas com o RaBitQ</a></p>
<h3 id="Making-RaBitQ-Distributed-Ready" class="common-anchor-header">Tornando o RaBitQ pronto para distribuição</h3><p>Integramos o RaBitQ diretamente no <a href="https://github.com/milvus-io/knowhere">Knowhere</a>, o principal mecanismo de pesquisa do Milvus - não como um plug-in, mas como um tipo de índice nativo com interfaces unificadas. Ele funciona com toda a arquitetura distribuída do Milvus: sharding, particionamento, escalonamento dinâmico e <a href="https://milvus.io/docs/manage-collections.md">gerenciamento de coleções</a>.</p>
<p>O principal desafio: tornar o livro de códigos de quantização (matriz de rotação, vectores centróides, parâmetros de escala) sensível ao segmento, de modo a que cada fragmento construa e armazene o seu próprio estado de quantização. Construções de índices, compactações e balanceamento de carga entendem o novo tipo de índice nativamente.</p>
<h3 id="Squeezing-Every-Cycle-Out-of-Popcount" class="common-anchor-header">Espremendo cada ciclo do Popcount</h3><p>A velocidade do RaBitQ vem do popcount - contando conjuntos de bits em vetores binários. O algoritmo é inerentemente rápido, mas o rendimento obtido depende de quão bem se usa o hardware. Criámos caminhos de código SIMD dedicados para as duas arquitecturas de servidor dominantes:</p>
<ul>
<li><strong>x86 (Intel IceLake+ / AMD Zen 4+):</strong> A instrução VPOPCNTDQ do AVX-512 calcula o popcount em vários registos de 512 bits em paralelo. Os loops internos do Knowhere são reestruturados para agrupar os cálculos de distância binária em pedaços de largura SIMD, maximizando o rendimento.</li>
<li><strong>ARM (Graviton, Ampere):</strong> Instruções SVE (Scalable Vetor Extension) para o mesmo padrão de popcount paralelo - essencial, pois as instâncias ARM são cada vez mais comuns em implantações de nuvem com custo otimizado.</li>
</ul>
<h3 id="Eliminating-Runtime-Overhead" class="common-anchor-header">Eliminando a sobrecarga de tempo de execução</h3><p>O RaBitQ precisa de parâmetros auxiliares de ponto flutuante no momento da consulta: o centroide do conjunto de dados, as normas por vetor e o produto interno entre cada vetor quantizado e seu original (usado pelo estimador de distância). O cálculo destes parâmetros por consulta aumenta a latência. O armazenamento dos vectores originais completos anula o objetivo da compressão.</p>
<p>A nossa solução: pré-computar e manter estes parâmetros durante a construção do índice, armazenando-os em cache juntamente com os códigos binários. A sobrecarga de memória é pequena (alguns floats por vetor), mas elimina a computação por consulta e mantém a latência estável sob elevada concorrência.</p>
<h3 id="IVFRABITQ-The-Index-You-Actually-Deploy" class="common-anchor-header">IVF_RABITQ: O índice que você realmente implementa</h3><p>A partir do <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6</a>, enviamos <a href="https://milvus.io/docs/ivf-rabitq.md">o IVF_RABITQ</a> - <a href="https://milvus.io/docs/ivf-flat.md">Inverted File Index</a> + RaBitQ quantization. A pesquisa funciona em duas etapas:</p>
<ol>
<li><strong>Pesquisa grosseira (IVF).</strong> O K-means divide o espaço vetorial em clusters. No momento da consulta, apenas os nprobe clusters mais próximos são pesquisados.</li>
<li><strong>Pontuação fina (RaBitQ).</strong> Dentro de cada agrupamento, as distâncias são estimadas utilizando códigos de 1 bit e o estimador não enviesado. O Popcount faz o trabalho pesado.</li>
</ol>
<p>Os resultados num conjunto de dados de 768 dimensões e 10 milhões de vectores:</p>
<table>
<thead>
<tr><th>Métrica</th><th>IVF_FLAT (linha de base)</th><th>IVF_RABITQ</th><th>IVF_RABITQ + SQ8 refinar</th></tr>
</thead>
<tbody>
<tr><td>Recuperação</td><td>95.2%</td><td>94.7%</td><td>~95%</td></tr>
<tr><td>QPS</td><td>236</td><td>864</td><td>-</td></tr>
<tr><td>Espaço de memória</td><td>32 bits/dim</td><td>1 bit/dim (~3% do original)</td><td>~25% do original</td></tr>
</tbody>
</table>
<p>Para cargas de trabalho que não toleram nem mesmo uma diferença de 0,5% na recuperação, o parâmetro refine_type adiciona uma segunda passagem de pontuação: SQ6, SQ8, FP16, BF16 ou FP32. SQ8 é a escolha comum - ele restaura a recordação para os níveis IVF_FLAT em aproximadamente 1/4 da memória original. Também é possível aplicar <a href="https://milvus.io/docs/ivf-sq8.md">a quantização escalar</a> ao lado da consulta (SQ1-SQ8) de forma independente, o que lhe dá dois botões para ajustar a troca entre latência e custo de recuperação por carga de trabalho.</p>
<h2 id="How-Milvus-Optimizes-Memory-Beyond-Quantization" class="common-anchor-header">Como o Milvus otimiza a memória além da quantização<button data-href="#How-Milvus-Optimizes-Memory-Beyond-Quantization" class="anchor-icon" translate="no">
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
    </button></h2><p>O RaBitQ é a alavanca de compressão mais dramática, mas é uma camada em uma pilha de <a href="https://milvus.io/blog/milvus-26-preview-72-memory-reduction-without-compromising-recall-and-4x-faster-than-elasticsearch.md">otimização de memória</a> mais ampla:</p>
<table>
<thead>
<tr><th>Estratégia</th><th>O que ele faz</th><th>Impacto</th></tr>
</thead>
<tbody>
<tr><td><strong>Quantização de pilha completa</strong></td><td>SQ8, PQ, RaBitQ em diferentes compromissos de precisão-custo</td><td>Redução de memória de 4x a 32x</td></tr>
<tr><td><strong>Otimização da estrutura de índices</strong></td><td>Compactação de gráficos HNSW, descarregamento de SSD DiskANN, compilações de índices à prova de OOM</td><td>Menos DRAM por índice, conjuntos de dados maiores por nó</td></tr>
<tr><td><strong>E/S mapeada na memória (mmap)</strong></td><td>Mapeia ficheiros vectoriais para o disco, carrega páginas a pedido através da cache de páginas do SO</td><td>Conjuntos de dados em escala TB sem carregar tudo na RAM</td></tr>
<tr><td><strong>Armazenamento em camadas</strong></td><td>Separação de dados quentes/quentes/frios com agendamento automático</td><td>Pagar preços de memória apenas para dados frequentemente acedidos</td></tr>
<tr><td><strong>Escalonamento nativo da nuvem</strong><a href="https://zilliz.com/cloud">(Zilliz Cloud</a>, Milvus gerido)</td><td>Atribuição elástica de memória, libertação automática de recursos ociosos</td><td>Pague apenas pelo que utiliza</td></tr>
</tbody>
</table>
<h3 id="Full-Stack-Quantization" class="common-anchor-header">Quantização de pilha completa</h3><p>A compressão extrema de 1 bit do RaBitQ não é a mais adequada para todas as cargas de trabalho. O Milvus oferece uma matriz de quantização completa: <a href="https://milvus.io/docs/ivf-sq8.md">SQ8</a> e <a href="https://milvus.io/docs/ivf-pq.md">quantização de produto (PQ)</a> para cargas de trabalho que precisam de uma troca equilibrada entre precisão e custo, RaBitQ para compressão máxima em conjuntos de dados ultragrandes e configurações híbridas que combinam vários métodos para um controlo refinado.</p>
<h3 id="Index-Structure-Optimization" class="common-anchor-header">Otimização da estrutura do índice</h3><p>Para além da quantização, o Milvus optimiza continuamente a sobrecarga de memória nas suas estruturas de índice principais. Para o <a href="https://milvus.io/docs/hnsw.md">HNSW</a>, reduzimos a redundância da lista de adjacência para diminuir o uso de memória por gráfico. <a href="https://milvus.io/docs/diskann.md">O DiskANN</a> empurra os dados vetoriais e as estruturas de índice para SSD, reduzindo drasticamente a dependência de DRAM para grandes conjuntos de dados. Também otimizamos a alocação de memória intermediária durante a criação de índices para evitar falhas OOM ao criar índices sobre conjuntos de dados que se aproximam dos limites de memória do nó.</p>
<h3 id="Smart-Memory-Loading" class="common-anchor-header">Carregamento inteligente de memória</h3><p>O suporte a <a href="https://milvus.io/docs/mmap.md">mmap</a> (memory-mapped I/O) do Milvus mapeia dados vetoriais para arquivos de disco, contando com o cache de páginas do sistema operacional para carregamento sob demanda - não é necessário carregar todos os dados na memória na inicialização. Combinado com estratégias de carregamento preguiçoso e segmentado que evitam picos de memória repentinos, isto permite um funcionamento suave com conjuntos de dados vectoriais à escala de TB por uma fração do custo da memória.</p>
<h3 id="Tiered-Storage" class="common-anchor-header">Armazenamento em camadas</h3><p>A <a href="https://milvus.io/docs/tiered-storage-overview.md">arquitetura de armazenamento em três camadas</a> do Milvus abrange memória, SSD e armazenamento de objetos: os dados quentes permanecem na memória para baixa latência, os dados quentes são armazenados em cache no SSD para um equilíbrio entre desempenho e custo, e os dados frios são transferidos para o armazenamento de objetos para minimizar a sobrecarga. O sistema lida com o agendamento de dados automaticamente - não são necessárias alterações na camada de aplicativos.</p>
<h3 id="Cloud-Native-Scaling" class="common-anchor-header">Escalonamento nativo da nuvem</h3><p>Sob a <a href="https://milvus.io/docs/architecture_overview.md">arquitetura distribuída</a> do Milvus, a fragmentação de dados e o balanceamento de carga evitam a sobrecarga de memória de um único nó. O pooling de memória reduz a fragmentação e melhora a utilização. <a href="https://zilliz.com/cloud">O Zilliz Cloud</a> (Milvus totalmente gerido) leva isto mais longe com agendamento elástico para escalonamento de memória a pedido - no modo sem servidor, os recursos ociosos são automaticamente libertados, reduzindo ainda mais o custo total de propriedade.</p>
<h3 id="How-These-Layers-Compound" class="common-anchor-header">Como essas camadas se compõem</h3><p>Essas otimizações não são alternativas - elas se acumulam. O RaBitQ encolhe os vetores. O DiskANN mantém o índice no SSD. O Mmap evita o carregamento de dados frios na memória. <a href="https://milvus.io/blog/milvus-tiered-storage-80-less-vector-search-cost-with-on-demand-hot–cold-data-loading.md">O armazenamento em camadas</a> empurra os dados de arquivo para o armazenamento de objetos. O resultado: uma implementação que serve milhares de milhões de vectores não precisa de milhares de milhões de vectores de RAM.</p>
<h2 id="Get-Started" class="common-anchor-header">Comece a usar<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p>À medida que os volumes de dados de IA continuam a crescer, a eficiência e o custo do banco de dados de vetores determinarão diretamente até que ponto os aplicativos de IA podem ser dimensionados. Continuaremos a investir em infra-estruturas vectoriais de alto desempenho e baixo custo - para que mais aplicações de IA possam passar do protótipo à produção.</p>
<p><a href="https://github.com/milvus-io/milvus">O Milvus</a> é de código aberto. Para experimentar o IVF_RABITQ:</p>
<ul>
<li>Consulte a <a href="https://milvus.io/docs/ivf-rabitq.md">documentação do IVF_RABITQ</a> para obter orientações de configuração e ajuste.</li>
<li>Leia a <a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3×-more-queries-with-rabitq.md">publicação</a> completa <a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3×-more-queries-with-rabitq.md">do blogue de integração do RaBitQ</a> para obter referências mais aprofundadas e detalhes de implementação.</li>
<li>Junte-se à <a href="https://slack.milvus.io/">comunidade Milvus Slack</a> para fazer perguntas e aprender com outros desenvolvedores.</li>
<li><a href="https://milvus.io/office-hours">Agende uma sessão gratuita do Milvus Office Hours</a> para analisar seu caso de uso.</li>
</ul>
<p>Se preferir ignorar a configuração da infraestrutura, <a href="https://cloud.zilliz.com/signup">o Zilliz Cloud</a> (Milvus totalmente gerido) oferece um nível gratuito com suporte IVF_RABITQ.</p>
<p>Estamos a realizar uma entrevista com o Professor <a href="https://personal.ntu.edu.sg/c.long/">Cheng Long</a> (NTU, VectorDB@NTU) e <a href="https://gaoj0017.github.io/">o Dr. Jianyang Gao</a> (ETH Zurich), o primeiro autor do RaBitQ, onde iremos aprofundar a teoria da quantização vetorial e o que se segue. Deixe as suas perguntas nos comentários.</p>
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
    </button></h2><h3 id="What-are-TurboQuant-and-RaBitQ" class="common-anchor-header">O que são o TurboQuant e o RaBitQ?</h3><p>TurboQuant (Google, ICLR 2026) e RaBitQ (Gao &amp; Long, SIGMOD 2024) são ambos métodos de quantização vetorial que usam rotação aleatória para comprimir vetores de alta dimensão. O TurboQuant visa a compressão da cache KV na inferência LLM, enquanto o RaBitQ visa índices vectoriais persistentes em bases de dados. Ambos contribuíram para a atual onda de interesse na quantização de vectores, embora resolvam problemas diferentes para sistemas diferentes.</p>
<h3 id="How-does-RaBitQ-achieve-1-bit-quantization-without-destroying-recall" class="common-anchor-header">Como é que o RaBitQ consegue a quantização de 1 bit sem destruir a recordação?</h3><p>O RaBitQ explora a concentração de medidas em espaços de elevada dimensão: os ângulos entre vectores são mais estáveis do que os valores de coordenadas individuais à medida que a dimensionalidade aumenta. Normaliza os vectores em relação ao centroide do conjunto de dados e, em seguida, projecta cada um deles no vértice mais próximo de um hipercubo (reduzindo cada dimensão a um único bit). Um estimador de distância imparcial com um limite de erro comprovável mantém a pesquisa precisa apesar da compressão.</p>
<h3 id="What-is-IVFRABITQ-and-when-should-I-use-it" class="common-anchor-header">O que é IVF_RABITQ e quando devo usá-lo?</h3><p>IVF_RABITQ é um tipo de índice vetorial em Milvus (disponível desde a versão 2.6) que combina o agrupamento invertido de ficheiros com a quantização de 1 bit RaBitQ. Atinge 94,7% de recuperação com 3,6x a taxa de transferência do IVF_FLAT, com uso de memória em cerca de 1/32 dos vetores originais. Utilize-o quando precisar de servir uma pesquisa de vectores em grande escala (milhões a milhares de milhões de vectores) e o custo da memória for uma preocupação principal - comum em cargas de trabalho de pesquisa RAG, de recomendação e multimodais.</p>
<h3 id="How-does-vector-quantization-relate-to-KV-cache-compression-in-LLMs" class="common-anchor-header">Como a quantização de vetores se relaciona com a compactação de cache KV em LLMs?</h3><p>Ambos os problemas envolvem a compressão de vectores de vírgula flutuante de alta dimensão. A cache KV armazena pares de valores-chave do mecanismo de atenção do Transformer; em contextos longos, ela pode exceder os pesos do modelo no uso da memória. As técnicas de quantização de vectores como o RaBitQ reduzem estes vectores a representações de bits inferiores. Os mesmos princípios matemáticos - concentração de medidas, rotação aleatória, estimativa de distância imparcial - aplicam-se quer esteja a comprimir vectores num índice de base de dados ou na cache KV de um motor de inferência.</p>
