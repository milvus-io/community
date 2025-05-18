---
id: >-
  milvus-26-preview-72-memory-reduction-without-compromising-recall-and-4x-faster-than-elasticsearch.md
title: >-
  Prévia do Milvus 2.6: 72% de redução de memória sem comprometer a recuperação
  e 4x mais rápido que o Elasticsearch
author: Ken Zhang
date: 2025-05-17T00:00:00.000Z
cover: >-
  assets.zilliz.com/Milvus_2_6_Preview_72_Memory_Reduction_Without_Compromising_Recall_and_4x_Faster_Than_Elasticsearch_c607b644f1.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus 2.6, vector database, vector search, full text search, AI search'
meta_title: >
  Milvus 2.6 Preview: 72% Memory Reduction Without Compromising Recall and 4x
  Faster Than Elasticsearch
desc: >-
  Veja em exclusivo as inovações do próximo Milvus 2.6 que irão redefinir o
  desempenho e a eficiência da base de dados vetorial.
origin: >-
  https://milvus.io/blog/milvus-26-preview-72-memory-reduction-without-compromising-recall-and-4x-faster-than-elasticsearch.md
---
<p>Ao longo desta semana, partilhámos uma série de inovações interessantes no Milvus que ultrapassam os limites da tecnologia de bases de dados vectoriais:</p>
<ul>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">Pesquisa vetorial no mundo real: como filtrar eficazmente sem prejudicar a recordação </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Leve a compactação vetorial ao extremo: como o Milvus atende a 3× mais consultas com o RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">Os benchmarks mentem - os bancos de dados vetoriais merecem um teste real </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Substituímos o Kafka/Pulsar por um Woodpecker para o Milvus </a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH no Milvus: a arma secreta para combater duplicatas nos dados de treinamento do LLM </a></p></li>
</ul>
<p>Agora, ao encerrarmos nossa série Milvus Week, estou animado para dar uma espiada no que está por vir no Milvus 2.6 - um marco crucial em nosso roteiro de produtos para 2025 que está atualmente em desenvolvimento e como essas melhorias transformarão a pesquisa baseada em IA. Este próximo lançamento reúne todas essas inovações e muito mais em três frentes críticas: <strong>otimização de custo-benefício</strong>, <strong>recursos avançados de pesquisa</strong> e <strong>uma nova arquitetura</strong> que leva a pesquisa vetorial para além da escala de 10 bilhões de vetores.</p>
<p>Vamos mergulhar em algumas das principais melhorias que você pode esperar quando o Milvus 2.6 chegar em junho, começando com o que pode ser o impacto mais imediato: reduções drásticas no uso e no custo da memória e desempenho ultrarrápido.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_2_6_Preview_72_Memory_Reduction_Without_Compromising_Recall_and_4x_Faster_Than_Elasticsearch_c607b644f1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Cost-Reduction-Slash-Memory-Usage-While-Boosting-Performance" class="common-anchor-header">Redução de custos: Reduzir o uso de memória enquanto aumenta o desempenho<button data-href="#Cost-Reduction-Slash-Memory-Usage-While-Boosting-Performance" class="anchor-icon" translate="no">
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
    </button></h2><p>Depender de memória cara é um dos maiores obstáculos para escalar a pesquisa vetorial para bilhões de registros. O Milvus 2.6 introduzirá várias optimizações chave que reduzem drasticamente os custos da sua infraestrutura enquanto melhoram o desempenho.</p>
<h3 id="RaBitQ-1-bit-Quantization-72-Memory-Reduction-with-4×-QPS-and-No-Recall-Loss" class="common-anchor-header">Quantização de 1 bit RaBitQ: 72% de redução de memória com 4× QPS e sem perda de recordação</h3><p>O consumo de memória tem sido o calcanhar de Aquiles dos bancos de dados vetoriais em grande escala. Embora a quantização de vectores não seja nova, a maioria das abordagens existentes sacrifica demasiada qualidade de pesquisa para poupar memória. O Milvus 2.6 enfrentará esse desafio de frente, introduzindo<a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md"> a quantização de 1 bit RaBitQ</a> em ambientes de produção.</p>
<p>O que torna a nossa implementação especial é a capacidade de otimização Refine ajustável que estamos a construir. Ao implementar um índice primário com quantização RaBitQ e opções de refinamento SQ4/SQ6/SQ8, alcançamos um equilíbrio ideal entre o uso de memória e a qualidade da pesquisa (~95% de recuperação).</p>
<p>Os nossos benchmarks preliminares revelam resultados prometedores:</p>
<table>
<thead>
<tr><th><strong>Métrica</strong><strong>de desempenho</strong> </th><th><strong>Tradicional IVF_FLAT</strong></th><th><strong>Apenas RaBitQ (1 bit)</strong></th><th><strong>RaBitQ (1 bit) + SQ8 Refinar</strong></th></tr>
</thead>
<tbody>
<tr><td>Pegada de memória</td><td>100% (linha de base)</td><td>3% (redução de 97%)</td><td>28% (72% de redução)</td></tr>
<tr><td>Qualidade da recordação</td><td>95.2%</td><td>76.3%</td><td>94.9%</td></tr>
<tr><td>Taxa de transferência de consultas (QPS)</td><td>236</td><td>648 (2,7× mais rápido)</td><td>946 (4× mais rápido)</td></tr>
</tbody>
</table>
<p><em>Tabela: Avaliação do VectorDBBench com 1M de vectores de 768 dimensões, testado em AWS m6id.2xlarge</em></p>
<p>O verdadeiro avanço aqui não é apenas a redução de memória, mas conseguir isso ao mesmo tempo em que oferece uma melhoria de rendimento de 4× sem comprometer a precisão. Isto significa que será capaz de servir a mesma carga de trabalho com menos 75% de servidores ou lidar com 4× mais tráfego na sua infraestrutura existente.</p>
<p>Para utilizadores empresariais que utilizam o Milvus totalmente gerido no<a href="https://zilliz.com/cloud"> Zilliz Cloud</a>, estamos a desenvolver perfis de configuração automatizados que ajustam dinamicamente os parâmetros do RaBitQ com base nas caraterísticas específicas da carga de trabalho e nos requisitos de precisão.</p>
<h3 id="400-Faster-Full-text-Search-Than-Elasticsearch" class="common-anchor-header">Pesquisa de texto completo 400% mais rápida do que o Elasticsearch</h3><p>Os recursos<a href="https://milvus.io/blog/full-text-search-in-milvus-what-is-under-the-hood.md">de pesquisa de texto completo</a> em bancos de dados vetoriais se tornaram essenciais para a criação de sistemas de recuperação híbridos. Desde a introdução do BM25 no <a href="https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md">Milvus 2.5</a>, recebemos um feedback entusiasmado - juntamente com pedidos de melhor desempenho em escala.</p>
<p>O Milvus 2.6 proporcionará ganhos substanciais de desempenho no BM25. Nossos testes no conjunto de dados BEIR mostram uma taxa de transferência 3 a 4 vezes maior do que o Elasticsearch com taxas de recuperação equivalentes. Para algumas cargas de trabalho, a melhoria atinge até 7 vezes mais QPS.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Milvus_vs_Elasticsearch_on_throughput_140b7c1b06.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figura: Milvus vs. Elasticsearch em termos de taxa de transferência</p>
<h3 id="JSON-Path-Index-99-Lower-Latency-for-Complex-Filtering" class="common-anchor-header">Índice de caminho JSON: Latência 99% menor para filtragem complexa</h3><p>As aplicações modernas de IA raramente dependem apenas da similaridade vetorial - elas quase sempre combinam busca vetorial com filtragem de metadados. À medida que essas condições de filtragem se tornam mais complexas (especialmente com objetos JSON aninhados), o desempenho da consulta pode se deteriorar rapidamente.</p>
<p>O Milvus 2.6 introduzirá um mecanismo de indexação direcionado para caminhos JSON aninhados que permite criar índices em caminhos específicos (por exemplo, <code translate="no">$meta user_info.location</code>) dentro de campos JSON. Em vez de procurar objectos inteiros, Milvus procurará diretamente valores de índices pré-construídos.</p>
<p>Na nossa avaliação com mais de 100 milhões de registos, o JSON Path Index reduziu a latência do filtro de <strong>140 ms</strong> (P99: 480 ms) para apenas <strong>1,5 ms</strong> (P99: 10 ms) - uma redução de 99% que transformará consultas anteriormente impraticáveis em respostas instantâneas.</p>
<p>Este recurso será particularmente valioso para:</p>
<ul>
<li><p>Sistemas de recomendação com filtragem complexa de atributos do utilizador</p></li>
<li><p>Aplicações RAG que filtram documentos por várias etiquetas</p></li>
</ul>
<h2 id="Next-Generation-Search-From-Basic-Vector-Similarity-to-Production-Grade-Retrieval" class="common-anchor-header">Pesquisa de próxima geração: Da similaridade vetorial básica à recuperação de nível de produção<button data-href="#Next-Generation-Search-From-Basic-Vector-Similarity-to-Production-Grade-Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><p>A pesquisa vetorial, por si só, não é suficiente para as aplicações modernas de IA. Os utilizadores exigem a precisão da recuperação de informação tradicional combinada com a compreensão semântica dos vectores. O Milvus 2.6 apresentará vários recursos avançados de pesquisa que preenchem essa lacuna.</p>
<h3 id="Better-Full-text-Search-with-Multi-language-Analyzer" class="common-anchor-header">Melhor pesquisa de texto completo com analisador multilingue</h3><p>A pesquisa de texto completo é altamente dependente do idioma... Milvus 2.6 introduzirá um pipeline de análise de texto completamente renovado com suporte multilíngue:</p>
<ul>
<li><p><code translate="no">RUN_ANALYZER</code> suporte de sintaxe para observabilidade de configuração de analisador/tokenização</p></li>
<li><p>tokenizador Lindera para idiomas asiáticos como japonês e coreano</p></li>
<li><p>tokenizador ICU para suporte multilingue abrangente</p></li>
<li><p>Configuração granular de idioma para definir regras de tokenização específicas do idioma</p></li>
<li><p>Jieba melhorado com suporte para integração de dicionário personalizado</p></li>
<li><p>Opções de filtro alargadas para um processamento de texto mais preciso</p></li>
</ul>
<p>Para aplicações globais, isto significa uma melhor pesquisa multilingue sem indexação especializada por idioma ou soluções alternativas complexas.</p>
<h3 id="Phrase-Match-Capturing-Semantic-Nuance-in-Word-Order" class="common-anchor-header">Correspondência de frases: Capturando a Nuance Semântica na Ordem das Palavras</h3><p>A ordem das palavras transmite distinções de significado críticas que a pesquisa por palavras-chave muitas vezes não consegue captar. Tente comparar &quot;técnicas de aprendizagem automática&quot; com &quot;técnicas de aprendizagem automática&quot; - as mesmas palavras, com significados totalmente diferentes.</p>
<p>O Milvus 2.6 adicionará o <strong>Phrase Match</strong>, dando aos utilizadores mais controlo sobre a ordem das palavras e a proximidade do que a pesquisa de texto completo ou a correspondência exacta de palavras:</p>
<pre><code translate="no">PHRASE_MATCH(field_name, phrase, slop)
<button class="copy-code-btn"></button></code></pre>
<p>O parâmetro <code translate="no">slop</code> irá fornecer um controlo flexível sobre a proximidade das palavras - 0 requer correspondências consecutivas exactas, enquanto que valores mais altos permitem pequenas variações no fraseado.</p>
<p>Esta funcionalidade será particularmente valiosa para:</p>
<ul>
<li><p>Pesquisa de documentos jurídicos em que o fraseado exato tem significado jurídico</p></li>
<li><p>Recuperação de conteúdos técnicos em que a ordem dos termos distingue diferentes conceitos</p></li>
<li><p>Bases de dados de patentes em que é necessário fazer corresponder com precisão frases técnicas específicas</p></li>
</ul>
<h3 id="Time-Aware-Decay-Functions-Automatically-Prioritize-Fresh-Content" class="common-anchor-header">Funções de decaimento sensíveis ao tempo: Dar automaticamente prioridade a conteúdos recentes</h3><p>O valor da informação diminui frequentemente com o tempo. Os artigos de notícias, os lançamentos de produtos e as publicações nas redes sociais tornam-se menos relevantes à medida que envelhecem, mas os algoritmos de pesquisa tradicionais tratam todos os conteúdos da mesma forma, independentemente da data de registo.</p>
<p>O Milvus 2.6 introduzirá <strong>as Funções de Decaimento</strong> para uma classificação sensível ao tempo que ajusta automaticamente as pontuações de relevância com base na idade do documento.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/decay_function_210e65f9a0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Poderá configurar:</p>
<ul>
<li><p><strong>Tipo de função</strong>: Exponencial (decaimento rápido), Gaussiana (decaimento gradual) ou Linear (decaimento constante)</p></li>
<li><p><strong>Taxa de decaimento</strong>: A rapidez com que a relevância diminui ao longo do tempo</p></li>
<li><p><strong>Ponto de origem</strong>: O carimbo de data/hora de referência para medir as diferenças de tempo</p></li>
</ul>
<p>Esta reclassificação sensível ao tempo garantirá que os resultados mais actualizados e contextualmente relevantes apareçam em primeiro lugar, o que é crucial para os sistemas de recomendação de notícias, plataformas de comércio eletrónico e feeds de redes sociais.</p>
<h3 id="Data-in-Data-Out-From-Raw-Text-to-Vector-Search-in-One-Step" class="common-anchor-header">Entrada de dados, saída de dados: Do texto bruto à pesquisa de vectores num só passo</h3><p>Um dos maiores problemas dos desenvolvedores com bancos de dados vetoriais tem sido a desconexão entre dados brutos e embeddings vetoriais. O Milvus 2.6 simplificará drasticamente este fluxo de trabalho com uma nova interface <strong>Function</strong> que integra modelos de incorporação de terceiros diretamente no seu pipeline de dados. Isto simplifica o seu pipeline de pesquisa vetorial com uma única chamada.</p>
<p>Em vez de pré-computar embeddings, será possível:</p>
<ol>
<li><p><strong>Inserir dados brutos diretamente</strong>: Enviar texto, imagens ou outro conteúdo para o Milvus</p></li>
<li><p><strong>Configurar fornecedores de embeddings para vectorização</strong>: O Milvus pode ligar-se a serviços de modelos de incorporação como o OpenAI, AWS Bedrock, Google Vertex AI e Hugging Face.</p></li>
<li><p><strong>Consultas em linguagem natural</strong>: Pesquisa com consultas de texto e não com incorporação de vectores</p></li>
</ol>
<p>Isto criará uma experiência "Data-In, Data-Out" simplificada em que o Milvus trata internamente da geração de vectores, tornando o código da sua aplicação mais simples.</p>
<h2 id="Architectural-Evolution-Scaling-to-Hundreds-of-Billions-of-Vectors" class="common-anchor-header">Evolução da arquitetura: Escalonamento para centenas de milhares de milhões de vectores<button data-href="#Architectural-Evolution-Scaling-to-Hundreds-of-Billions-of-Vectors" class="anchor-icon" translate="no">
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
    </button></h2><p>Uma boa base de dados não se limita a ter óptimas funcionalidades, tem também de as fornecer em escala, testadas em produção.</p>
<p>O Milvus 2.6 introduzirá uma alteração fundamental na arquitetura que permite uma escalabilidade rentável para centenas de milhares de milhões de vectores. O destaque é uma nova arquitetura de armazenamento em camadas quente-fria que gere de forma inteligente a colocação de dados com base em padrões de acesso, movendo automaticamente os dados quentes para a memória/SSD de elevado desempenho enquanto coloca os dados frios em armazenamento de objectos mais económicos. Esta abordagem pode reduzir drasticamente os custos, mantendo o desempenho da consulta onde é mais importante.</p>
<p>Além disso, um novo <a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md#StreamingService-Built-for-Real-Time-Data-Flow">nó de streaming</a> permitirá o processamento vetorial em tempo real com integração direta em plataformas de streaming como o Kafka e o Pulsar e o recém-criado <a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Woodpecker</a>, tornando os novos dados pesquisáveis imediatamente sem atrasos de lote.</p>
<h2 id="Stay-tuned-for-Milvus-26" class="common-anchor-header">Fique atento ao Milvus 2.6<button data-href="#Stay-tuned-for-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus 2.6 está atualmente em desenvolvimento ativo e estará disponível em junho. Estamos entusiasmados por lhe trazer estas optimizações de desempenho inovadoras, capacidades de pesquisa avançadas e uma nova arquitetura para o ajudar a criar aplicações de IA escaláveis a um custo mais baixo.</p>
<p>Entretanto, agradecemos os seus comentários sobre estas funcionalidades futuras. O que mais o entusiasma? Quais recursos teriam o maior impacto nos seus aplicativos? Junte-se à conversa no nosso<a href="https://discord.com/invite/8uyFbECzPX"> canal Discord</a> ou siga o nosso progresso no<a href="https://github.com/milvus-io/milvus"> GitHub</a>.</p>
<p>Quer ser o primeiro a saber quando o Milvus 2.6 for lançado? Siga-nos no<a href="https://www.linkedin.com/company/zilliz/"> LinkedIn</a> ou no<a href="https://twitter.com/milvusio"> X</a> para obter as últimas actualizações.</p>
