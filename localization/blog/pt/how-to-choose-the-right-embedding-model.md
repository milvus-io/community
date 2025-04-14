---
id: how-to-choose-the-right-embedding-model.md
title: Como escolher o modelo de incorporação correto?
author: Lumina Wang
date: 2025-04-09T00:00:00.000Z
desc: >-
  Explore os factores essenciais e as melhores práticas para escolher o modelo
  de incorporação correto para uma representação de dados eficaz e um melhor
  desempenho.
cover: assets.zilliz.com/Complete_Workflow_31b4ac825c.gif
tag: Engineering
tags: >-
  Embedding Model, RAG, Model Selection, Machine Learning, Performance
  Optimization
canonicalUrl: 'https://milvus.io/blog/how-to-choose-the-right-embedding-model.md'
---
<p>Selecionar o <a href="https://zilliz.com/ai-models">modelo de incorporação</a> correto é uma decisão crítica quando se constroem sistemas que compreendem e trabalham com <a href="https://zilliz.com/learn/introduction-to-unstructured-data">dados não estruturados</a>, como texto, imagens ou áudio. Estes modelos transformam a entrada bruta em vectores de tamanho fixo e de elevada dimensão que captam o significado semântico, permitindo aplicações poderosas na pesquisa de semelhanças, recomendações, classificação e muito mais.</p>
<p>Mas nem todos os modelos de incorporação são iguais. Com tantas opções disponíveis, como escolher o modelo certo? A escolha errada pode levar a uma precisão abaixo do ideal, estrangulamentos de desempenho ou custos desnecessários. Este guia fornece uma estrutura prática para o ajudar a avaliar e selecionar o melhor modelo de incorporação para os seus requisitos específicos.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Complete_Workflow_31b4ac825c.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="1-Define-Your-Task-and-Business-Requirements" class="common-anchor-header">1. Definir a tarefa e os requisitos comerciais<button data-href="#1-Define-Your-Task-and-Business-Requirements" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de escolher um modelo de incorporação, comece por clarificar os seus principais objectivos:</p>
<ul>
<li><strong>Tipo de tarefa:</strong> Comece por identificar a aplicação principal que está a criar - pesquisa semântica, um sistema de recomendação, um pipeline de classificação ou algo completamente diferente. Cada caso de utilização tem requisitos diferentes relativamente à forma como os embeddings devem representar e organizar a informação. Por exemplo, se estiver a construir um motor de pesquisa semântico, precisa de modelos como o Sentence-BERT que captem o significado semântico diferenciado entre consultas e documentos, assegurando que conceitos semelhantes estão próximos no espaço vetorial. Para tarefas de classificação, os embeddings devem refletir a estrutura específica da categoria, de modo a que as entradas da mesma classe sejam colocadas próximas umas das outras no espaço vetorial. Isto facilita aos classificadores a jusante a distinção entre classes. Modelos como o DistilBERT e o RoBERTa são normalmente utilizados. Nos sistemas de recomendação, o objetivo é encontrar embeddings que reflictam as relações ou preferências entre o utilizador e o item. Para tal, pode utilizar modelos especificamente treinados em dados de feedback implícito, como o Neural Collaborative Filtering (NCF).</li>
<li><strong>Avaliação do ROI:</strong> Equilibre o desempenho e os custos com base no seu contexto empresarial específico. As aplicações de missão crítica (como os diagnósticos de cuidados de saúde) podem justificar modelos de qualidade superior com maior precisão, uma vez que pode ser uma questão de sorte ou morte, enquanto as aplicações sensíveis aos custos e com elevado volume necessitam de uma análise cuidadosa da relação custo-benefício. A chave é determinar se uma mera melhoria de desempenho de 2-3% justifica aumentos de custos potencialmente significativos no seu cenário específico.</li>
<li><strong>Outras restrições:</strong> Considere os seus requisitos técnicos ao restringir as opções. Se precisar de suporte multilingue, muitos modelos gerais têm dificuldade em lidar com conteúdos que não sejam em inglês, pelo que poderão ser necessários modelos multilingues especializados. Se estiver a trabalhar em domínios especializados (médico/jurídico), as incorporações de uso geral muitas vezes não compreendem o jargão específico do domínio - por exemplo, podem não compreender que <em>"stat"</em> num contexto médico significa <em>"imediatamente",</em> ou que <em>"consideration"</em> em documentos jurídicos se refere a algo de valor trocado num contrato. Do mesmo modo, as limitações de hardware e os requisitos de latência terão um impacto direto nos modelos que são viáveis para o seu ambiente de implementação.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/clarify_task_and_business_requirement_b1bce2ccc0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="2-Evaluate-Your-Data" class="common-anchor-header">2. Avalie os seus dados<button data-href="#2-Evaluate-Your-Data" class="anchor-icon" translate="no">
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
    </button></h2><p>A natureza dos seus dados influencia significativamente a escolha do modelo de incorporação. As principais considerações incluem:</p>
<ul>
<li><strong>Modalidade dos dados:</strong> Os seus dados são de natureza textual, visual ou multimodal? Faça corresponder o seu modelo ao tipo de dados. Utilize modelos baseados em transformadores como o <a href="https://zilliz.com/learn/what-is-bert">BERT</a> ou o <a href="https://zilliz.com/learn/Sentence-Transformers-for-Long-Form-Text">Sentence-BERT</a> para texto, <a href="https://zilliz.com/glossary/convolutional-neural-network">arquitecturas CNN</a> ou Vision Transformers<a href="https://zilliz.com/learn/understanding-vision-transformers-vit">(ViT</a>) para imagens, modelos especializados para áudio e modelos multimodais como o <a href="https://zilliz.com/learn/exploring-openai-clip-the-future-of-multimodal-ai-learning">CLIP</a> e o MagicLens para aplicações multimodais.</li>
<li><strong>Especificidade do domínio:</strong> Pense se os modelos gerais são suficientes ou se precisa de modelos específicos do domínio que compreendam conhecimentos especializados. Os modelos gerais treinados em diversos conjuntos de dados (como <a href="https://zilliz.com/ai-models/text-embedding-3-large">os modelos de incorporação de texto da OpenAI</a>) funcionam bem para tópicos comuns, mas muitas vezes não conseguem distinguir subtilezas em campos especializados. No entanto, em áreas como os cuidados de saúde ou os serviços jurídicos, muitas vezes não conseguem ver distinções subtis, pelo que as incorporações específicas do domínio, como <a href="https://arxiv.org/abs/1901.08746">BioBERT</a> ou <a href="https://arxiv.org/abs/2010.02559">LegalBERT</a>, podem ser mais adequadas.</li>
<li><strong>Tipo de incorporação:</strong> <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">As incorporações esparsas</a> são excelentes na correspondência de palavras-chave, o que as torna ideais para catálogos de produtos ou documentação técnica. As incorporações densas captam melhor as relações semânticas, o que as torna adequadas para consultas de linguagem natural e compreensão de intenções. Muitos sistemas de produção, como os sistemas de recomendação de comércio eletrónico, beneficiam de uma abordagem híbrida que aproveita ambos os tipos - por exemplo, utilizando <a href="https://zilliz.com/learn/mastering-bm25-a-deep-dive-into-the-algorithm-and-application-in-milvus">BM25</a> (esparso) para correspondência de palavras-chave e adicionando BERT (embeddings densos) para capturar a semelhança semântica.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/evaluate_your_data_6caeeb813e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="3-Research-Available-Models" class="common-anchor-header">3. Pesquisar modelos disponíveis<button data-href="#3-Research-Available-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>Depois de compreender a sua tarefa e os dados, é altura de pesquisar os modelos de incorporação disponíveis. Eis como pode abordar este assunto:</p>
<ul>
<li><p><strong>Popularidade:</strong> Dê prioridade a modelos com comunidades activas e adoção generalizada. Estes modelos beneficiam normalmente de uma melhor documentação, de um maior apoio da comunidade e de actualizações regulares. Isto pode reduzir significativamente as dificuldades de implementação. Familiarize-se com os principais modelos no seu domínio. Por exemplo:</p>
<ul>
<li>Para texto: considere os embeddings OpenAI, as variantes Sentence-BERT ou os modelos E5/BGE.</li>
<li>Para imagem: veja ViT e ResNet, ou CLIP e SigLIP para alinhamento texto-imagem.</li>
<li>Para áudio: verifique PNNs, CLAP ou <a href="https://zilliz.com/learn/top-10-most-used-embedding-models-for-audio-data">outros modelos populares</a>.</li>
</ul></li>
<li><p><strong>Direitos de autor e licenças</strong>: Avalie cuidadosamente as implicações do licenciamento, uma vez que estas afectam diretamente os custos a curto e a longo prazo. Os modelos de código aberto (como MIT, Apache 2.0 ou licenças semelhantes) oferecem flexibilidade para modificação e utilização comercial, dando-lhe controlo total sobre a implementação, mas exigindo conhecimentos de infraestrutura. Os modelos proprietários acedidos através de APIs oferecem comodidade e simplicidade, mas implicam custos contínuos e potenciais preocupações com a privacidade dos dados. Esta decisão é especialmente importante para aplicações em sectores regulamentados, em que a soberania dos dados ou os requisitos de conformidade podem tornar necessária a auto-hospedagem, apesar do investimento inicial mais elevado.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/model_research2_b0df75cb55.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="4-Evaluate-Candidate-Models" class="common-anchor-header">4. Avalie os modelos candidatos<button data-href="#4-Evaluate-Candidate-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>Depois de ter selecionado alguns modelos, é altura de os testar com os seus dados de amostra. Eis os principais factores que deve considerar:</p>
<ul>
<li><strong>Avaliação:</strong> Ao avaliar a qualidade da incorporação - especialmente na geração aumentada de recuperação (RAG) ou na aplicação de pesquisa - é importante medir <em>a exatidão, a relevância e a integridade</em> dos resultados devolvidos. As principais métricas incluem fidelidade, relevância da resposta, precisão do contexto e recuperação. Estruturas como Ragas, DeepEval, Phoenix e TruLens-Eval simplificam este processo de avaliação, fornecendo metodologias estruturadas para avaliar diferentes aspectos da qualidade da incorporação. Os conjuntos de dados são igualmente importantes para uma avaliação significativa. Podem ser criados à mão para representar casos de utilização reais, gerados sinteticamente por LLMs para testar capacidades específicas, ou criados utilizando ferramentas como o Ragas e o FiddleCube para visar aspectos de teste específicos. A combinação correta de conjunto de dados e estrutura depende da sua aplicação específica e do nível de granularidade de avaliação de que necessita para tomar decisões seguras.</li>
<li><strong>Desempenho de benchmark:</strong> Avalie modelos em benchmarks específicos de tarefas (por exemplo, MTEB para recuperação). Lembre-se de que as classificações variam significativamente consoante o cenário (pesquisa vs. classificação), os conjuntos de dados (gerais vs. específicos do domínio, como o BioASQ) e as métricas (precisão, velocidade). Embora o desempenho de referência forneça informações valiosas, nem sempre se traduz perfeitamente em aplicações do mundo real. Faça uma verificação cruzada dos melhores desempenhos que se alinham com o seu tipo de dados e objectivos, mas valide sempre com os seus próprios casos de teste personalizados para identificar modelos que possam ter um desempenho superior aos benchmarks, mas inferior em condições reais com os seus padrões de dados específicos.</li>
<li><strong>Teste de carga:</strong> Para modelos auto-hospedados, simule cargas de produção realistas para avaliar o desempenho em condições do mundo real. Meça o rendimento, bem como a utilização da GPU e o consumo de memória durante a inferência para identificar potenciais estrangulamentos. Um modelo com bom desempenho isolado pode tornar-se problemático ao lidar com pedidos simultâneos ou entradas complexas. Se o modelo consumir demasiados recursos, pode não ser adequado para aplicações em grande escala ou em tempo real, independentemente da sua precisão nas métricas de referência.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/evaluate_candidate_models_3a7edd9cd7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="5-Model-Integration" class="common-anchor-header">5. Integração do modelo<button data-href="#5-Model-Integration" class="anchor-icon" translate="no">
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
    </button></h2><p>Depois de selecionar um modelo, é agora altura de planear a sua abordagem de integração.</p>
<ul>
<li><strong>Seleção de pesos:</strong> Decida entre a utilização de pesos pré-treinados para uma implementação rápida ou o ajuste fino em dados específicos do domínio para um melhor desempenho. Lembre-se de que o ajuste fino pode melhorar o desempenho, mas consome muitos recursos. Considere se os ganhos de desempenho justificam a complexidade adicional.</li>
<li><strong>Auto-hospedagem vs. Serviço de inferência de terceiros:</strong> Escolha a sua abordagem de implementação com base nas suas capacidades e requisitos de infraestrutura. A auto-hospedagem dá-lhe controlo total sobre o modelo e o fluxo de dados, reduzindo potencialmente os custos por pedido à escala e garantindo a privacidade dos dados. No entanto, requer conhecimentos de infraestrutura e manutenção contínua. Os serviços de inferência de terceiros oferecem uma implementação rápida com uma configuração mínima, mas introduzem latência de rede, potenciais limites de utilização e custos contínuos que podem tornar-se significativos à escala.</li>
<li><strong>Design de integração:</strong> Planeie a conceção da API, as estratégias de armazenamento em cache, a abordagem de processamento em lote e a seleção da <a href="https://milvus.io/blog/what-is-a-vector-database.md">base de dados vetorial</a> para armazenar e consultar os embeddings de forma eficiente.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/model_integration_8c8f0410c7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="6-End-to-End-Testing" class="common-anchor-header">6. Testes de ponta a ponta<button data-href="#6-End-to-End-Testing" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes da implantação completa, execute testes de ponta a ponta para garantir que o modelo funcione conforme o esperado:</p>
<ul>
<li><strong>Desempenho</strong>: Avalie sempre o modelo no seu próprio conjunto de dados para garantir um bom desempenho no seu caso de utilização específico. Considere métricas como MRR, MAP e NDCG para a qualidade da recuperação, precisão, recordação e F1 para a exatidão, e percentis de rendimento e latência para o desempenho operacional.</li>
<li><strong>Robustez</strong>: Teste o modelo em diferentes condições, incluindo casos extremos e diversas entradas de dados, para verificar se o seu desempenho é consistente e exato.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/end_to_end_testing_7ae244a73b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>Como vimos ao longo deste guia, a seleção do modelo de incorporação correto requer o cumprimento destes seis passos essenciais:</p>
<ol>
<li>Definir os requisitos comerciais e o tipo de tarefa</li>
<li>Analisar as caraterísticas dos dados e a especificidade do domínio</li>
<li>Pesquisar os modelos disponíveis e os respectivos termos de licenciamento</li>
<li>Avaliar rigorosamente os candidatos em relação a referências relevantes e conjuntos de dados de teste</li>
<li>Planear a sua abordagem de integração tendo em conta as opções de implementação</li>
<li>Efetuar testes completos de ponta a ponta antes da implementação na produção</li>
</ol>
<p>Seguindo este quadro, pode tomar uma decisão informada que equilibre o desempenho, o custo e as restrições técnicas para o seu caso de utilização específico. Lembre-se de que o "melhor" modelo não é necessariamente aquele com as pontuações de referência mais elevadas - é aquele que melhor satisfaz os seus requisitos específicos dentro das suas restrições operacionais.</p>
<p>Com os modelos de incorporação a evoluir rapidamente, também vale a pena reavaliar periodicamente a sua escolha à medida que surgem novas opções que podem oferecer melhorias significativas para a sua aplicação.</p>
