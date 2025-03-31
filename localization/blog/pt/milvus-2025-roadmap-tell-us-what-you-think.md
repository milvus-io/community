---
id: milvus-2025-roadmap-tell-us-what-you-think.md
title: Milvus 2025 Roadmap - Diga-nos o que pensa
author: 'Fendy Feng, Field Zhang'
date: 2025-03-27T00:00:00.000Z
desc: >-
  Em 2025, estamos a lançar duas versões principais, Milvus 2.6 e Milvus 3.0, e
  muitas outras caraterísticas técnicas. Convidamo-lo a partilhar as suas ideias
  connosco.
cover: assets.zilliz.com/2025_roadmap_04e6c5d1c3.png
tag: Announcements
recommend: true
canonicalUrl: 'https://milvus.io/blog/milvus-2025-roadmap-tell-us-what-you-think.md'
---
<p>Olá, utilizadores e colaboradores do Milvus!</p>
<p>Estamos entusiasmados por partilhar convosco o nosso <a href="https://milvus.io/docs/roadmap.md"><strong>roteiro Milvus 2025</strong></a>. Este plano técnico destaca as principais funcionalidades e melhorias que estamos a desenvolver para tornar o Milvus ainda mais poderoso para as suas necessidades de pesquisa vetorial.</p>
<p>Mas isto é apenas o começo - queremos as suas ideias! O seu feedback ajuda a moldar o Milvus, garantindo que ele evolua para atender aos desafios do mundo real. Diga-nos o que pensa e ajude-nos a aperfeiçoar o roteiro à medida que avançamos.</p>
<h2 id="The-Current-Landscape" class="common-anchor-header">O cenário atual<button data-href="#The-Current-Landscape" class="anchor-icon" translate="no">
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
    </button></h2><p>Ao longo do último ano, vimos muitos de vós criarem aplicações RAG e de agentes impressionantes com o Milvus, tirando partido de muitas das nossas funcionalidades populares, como a integração de modelos, a pesquisa de texto integral e a pesquisa híbrida. As suas implementações forneceram informações valiosas sobre os requisitos de pesquisa vetorial do mundo real.</p>
<p>À medida que as tecnologias de IA evoluem, os seus casos de utilização estão a tornar-se mais sofisticados - desde a pesquisa vetorial básica a aplicações multimodais complexas que abrangem agentes inteligentes, sistemas autónomos e IA incorporada. Estes desafios técnicos estão a informar o nosso roteiro à medida que continuamos a desenvolver o Milvus para satisfazer as suas necessidades.</p>
<h2 id="Two-Major-Releases-in-2025-Milvus-26-and-Milvus-30" class="common-anchor-header">Dois grandes lançamentos em 2025: Milvus 2.6 e Milvus 3.0<button data-href="#Two-Major-Releases-in-2025-Milvus-26-and-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>Em 2025, estamos a lançar duas versões principais: Milvus 2.6 (meados de CY25) e Milvus 3.0 (final de 2025).</p>
<p><strong>O Milvus 2.6</strong> centra-se nas principais melhorias de arquitetura que tem vindo a solicitar:</p>
<ul>
<li><p>Implantação mais simples com menos dependências (adeus, dores de cabeça na implantação!)</p></li>
<li><p>Pipelines de ingestão de dados mais rápidos</p></li>
<li><p>Custos de armazenamento mais baixos (ouvimos as suas preocupações com os custos de produção)</p></li>
<li><p>Melhor tratamento de operações de dados em grande escala (excluir/modificar)</p></li>
<li><p>Pesquisa escalar e de texto completo mais eficiente</p></li>
<li><p>Suporte para os modelos de incorporação mais recentes com que está a trabalhar</p></li>
</ul>
<p><strong>O Milvus 3.0</strong> é a nossa maior evolução arquitetónica, introduzindo um sistema de data lake vetorial para:</p>
<ul>
<li><p>Integração perfeita de serviços de IA</p></li>
<li><p>Capacidades de pesquisa de nível superior</p></li>
<li><p>Gestão de dados mais robusta</p></li>
<li><p>Melhor tratamento dos enormes conjuntos de dados offline com que está a trabalhar</p></li>
</ul>
<h2 id="Technical-Features-Were-Planning---We-Need-Your-Feedback" class="common-anchor-header">Caraterísticas técnicas que estamos a planear - precisamos da sua opinião<button data-href="#Technical-Features-Were-Planning---We-Need-Your-Feedback" class="anchor-icon" translate="no">
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
    </button></h2><p>Abaixo estão as principais caraterísticas técnicas que estamos a planear adicionar ao Milvus.</p>
<table>
<thead>
<tr><th><strong>Área de Caraterísticas Chave</strong></th><th><strong>Caraterísticas Técnicas</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Processamento de dados não estruturados orientado por IA</strong></td><td>- Entrada e saída de dados: Integração nativa com os principais serviços de modelo para ingestão de texto em bruto<br>- Tratamento de dados originais: Suporte de referência de texto/URL para processamento de dados brutos<br>- Suporte a Tensor: Implementação de lista de vetores (para cenários ColBERT/CoPali/Video)<br>- Tipos de dados alargados: DateTime, Mapa, suporte GIS baseado em requisitos<br>- Pesquisa iterativa: Refinamento do vetor de consulta através do feedback do utilizador</td></tr>
<tr><td><strong>Melhorias na qualidade e no desempenho da pesquisa</strong></td><td>- Correspondência avançada: capacidades phrase_match e multi_match<br>- Atualização do Analyzer: Melhoria do Analyzer com suporte alargado para tokenizadores e observabilidade melhorada<br>- Otimização JSON: Filtragem mais rápida através de indexação melhorada<br>- Ordenação da execução: Ordenação de resultados baseada em campos escalares<br>- Reranker avançado: Reranking baseado em modelo e funções de pontuação personalizadas<br>- Pesquisa iterativa: Refinamento do vetor de consulta através do feedback do utilizador</td></tr>
<tr><td><strong>Flexibilidade de gestão de dados</strong></td><td>- Alteração do esquema: Adicionar/eliminar campo, modificar comprimento de varchar<br>- Agregações escalares: operações de contagem/distinção/min/max<br>- Suporte UDF: Suporte de funções definidas pelo utilizador<br>- Controlo de versões de dados: Sistema de reversão baseado em instantâneos<br>- Clustering de dados: Co-localização através de configuração<br>- Amostragem de dados: Obtenção rápida de resultados com base em dados de amostragem</td></tr>
<tr><td><strong>Melhorias arquitectónicas</strong></td><td>- Nó de fluxo: Ingestão de dados incremental simplificada<br>- MixCoord: Arquitetura de coordenação unificada<br>- Independência da Logstore: Redução de dependências externas como o pulsar<br>- Deduplicação de PK: Desduplicação global de chaves primárias</td></tr>
<tr><td><strong>Eficiência de custos e melhorias na arquitetura</strong></td><td>- Armazenamento em camadas: Separação de dados quentes/frios para reduzir o custo de armazenamento<br>- Política de eliminação de dados: Os utilizadores podem definir a sua própria política de eliminação de dados<br>- Actualizações em massa: Suporta modificações de valores específicos de campo, ETL, etc.<br>- Large TopK: Devolve conjuntos de dados maciços<br>- VTS GA: Ligação a diferentes fontes de dados<br>- Quantização avançada: Otimizar o consumo de memória e o desempenho com base em técnicas de quantização<br>- Elasticidade de recursos: Dimensione dinamicamente os recursos para acomodar cargas de gravação, cargas de leitura e cargas de tarefas em segundo plano variáveis</td></tr>
</tbody>
</table>
<p>À medida que implementamos este roteiro, gostaríamos de receber as suas opiniões e comentários sobre o seguinte:</p>
<ol>
<li><p><strong>Prioridades de recursos:</strong> Quais recursos do nosso roteiro teriam o maior impacto no seu trabalho?</p></li>
<li><p><strong>Ideias de implementação:</strong> Alguma abordagem específica que você acha que funcionaria bem para esses recursos?</p></li>
<li><p><strong>Alinhamento de casos de utilização:</strong> Como é que estas funcionalidades planeadas se alinham com os seus casos de utilização actuais e futuros?</p></li>
<li><p><strong>Considerações sobre o desempenho:</strong> Quaisquer aspectos de desempenho em que nos devamos concentrar para as suas necessidades específicas?</p></li>
</ol>
<p><strong>As suas ideias ajudam-nos a tornar o Milvus melhor para todos. Sinta-se à vontade para partilhar as suas ideias no nosso<a href="https://github.com/milvus-io/milvus/discussions/40263"> Fórum de Discussão do Milvus</a> ou no nosso <a href="https://discord.com/invite/8uyFbECzPX">Canal Discord</a>.</strong></p>
<h2 id="Welcome-to-Contribute-to-Milvus" class="common-anchor-header">Bem-vindo a contribuir para o Milvus<button data-href="#Welcome-to-Contribute-to-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Sendo um projeto de código aberto, Milvus agradece sempre as suas contribuições:</p>
<ul>
<li><p><strong>Partilhe o seu feedback:</strong> Reportar problemas ou sugerir funcionalidades através da nossa <a href="https://github.com/milvus-io/milvus/issues">página de problemas no GitHub</a></p></li>
<li><p><strong>Contribuições de código:</strong> Submeter pull requests (ver o nosso <a href="https://github.com/milvus-io/milvus/blob/82915a9630ab0ff40d7891b97c367ede5726ff7c/CONTRIBUTING.md">Guia do Contribuinte</a>)</p></li>
<li><p><strong>Espalhe a palavra:</strong> Partilhe as suas experiências com o Milvus e apareça <a href="https://github.com/milvus-io/milvus">no nosso repositório GitHub</a></p></li>
</ul>
<p>Estamos entusiasmados por construir este próximo capítulo do Milvus consigo. O seu código, ideias e feedback fazem avançar este projeto!</p>
<p>- A equipa do Milvus</p>
