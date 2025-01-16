---
id: intelligent-wardrobe-customization-system.md
title: >-
  Criação de um sistema inteligente de personalização de guarda-roupa com base
  de dados vectoriais Milvus
author: Yiyun Ni
date: 2022-07-08T00:00:00.000Z
desc: >-
  Utilizar a tecnologia de pesquisa por semelhança para desbloquear o potencial
  de dados não estruturados, até mesmo como roupeiros e os seus componentes!
cover: assets.zilliz.com/Frame_1282_edc1fb7d99.png
tag: Engineering
tags: >-
  Data science, Database, Use Cases of Milvus, Artificial Intelligence, Vector
  Management
canonicalUrl: 'https://milvus.io/blog/intelligent-wardrobe-customization-system.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1282_edc1fb7d99.png" alt="cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>imagem da capa</span> </span></p>
<p>Se está à procura de um roupeiro que se adapte perfeitamente ao seu quarto ou provador, aposto que a maioria das pessoas pensa nos roupeiros feitos à medida. No entanto, nem todos os orçamentos podem ir tão longe. Então, o que fazer com os já prontos? O problema com este tipo de guarda-roupa é que é muito provável que fiquem aquém das suas expectativas, uma vez que não são suficientemente flexíveis para satisfazer as suas necessidades únicas de arrumação. Além disso, quando se faz uma pesquisa online, é bastante difícil resumir o tipo específico de roupeiro que se procura através de palavras-chave. Muito provavelmente, a palavra-chave que escreve na caixa de pesquisa (por exemplo, Um armário com um tabuleiro para jóias) pode ser muito diferente da forma como é definida no motor de busca (por exemplo, Um armário com <a href="https://www.ikea.com/us/en/p/komplement-pull-out-tray-with-insert-black-brown-s79249366/">tabuleiro extraível com encaixe</a>).</p>
<p>Mas graças às tecnologias emergentes, há uma solução! A IKEA, o conglomerado de retalho de mobiliário, disponibiliza uma ferramenta de design popular, <a href="https://www.ikea.com/us/en/rooms/bedroom/how-to/how-to-design-your-perfect-pax-wardrobe-pub8b76dda0">o PAX wardrobe</a>, que permite aos utilizadores escolher entre uma série de roupeiros prontos a usar e personalizar a cor, o tamanho e o design interior dos roupeiros. Quer necessite de espaço para pendurar, de várias prateleiras ou de gavetas interiores, este sistema inteligente de personalização de roupeiros pode sempre satisfazer as suas necessidades.</p>
<p>Para encontrar ou construir o seu roupeiro ideal utilizando este sistema inteligente de design de roupeiros, é necessário:</p>
<ol>
<li>Especificar os requisitos básicos - a forma (normal, em L ou em U), o comprimento e a profundidade do roupeiro.</li>
<li>Especificar as suas necessidades de arrumação e a organização interior do roupeiro (por exemplo, é necessário espaço para pendurar, um suporte para calças extraível, etc.).</li>
<li>Adicione ou retire partes do roupeiro, como gavetas ou prateleiras.</li>
</ol>
<p>Depois, o seu design está concluído. Simples e fácil!</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Pax_system_ff4c3fa182.png" alt="pax system" class="doc-image" id="pax-system" />
   </span> <span class="img-wrapper"> <span>sistema pax</span> </span></p>
<p>Um componente muito importante que torna possível este sistema de conceção de roupeiros é a <a href="https://zilliz.com/learn/what-is-vector-database">base de dados vetorial</a>. Por isso, este artigo tem como objetivo apresentar o fluxo de trabalho e as soluções de pesquisa de semelhanças utilizadas para criar um sistema inteligente de personalização de roupeiros com base na pesquisa de semelhanças vectoriais.</p>
<p>Saltar para:</p>
<ul>
<li><a href="#System-overview">Visão geral do sistema</a></li>
<li><a href="#Data-flow">Fluxo de dados</a></li>
<li><a href="#System-demo">Demonstração do sistema</a></li>
</ul>
<h2 id="System-Overview" class="common-anchor-header">Descrição geral do sistema<button data-href="#System-Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>Para fornecer uma ferramenta de personalização de guarda-roupas tão inteligente, precisamos primeiro de definir a lógica comercial e compreender os atributos dos itens e o percurso do utilizador. Os roupeiros, juntamente com os seus componentes, como gavetas, tabuleiros e prateleiras, são todos dados não estruturados. Por conseguinte, o segundo passo consiste em utilizar algoritmos e regras de IA, conhecimento prévio, descrição de artigos, etc., para converter esses dados não estruturados num tipo de dados que pode ser compreendido pelos computadores - vectores!</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Customization_tool_overview_86d62e1730.png" alt="Customization tool overview" class="doc-image" id="customization-tool-overview" />
   </span> <span class="img-wrapper"> <span>Visão geral da ferramenta de personalização</span> </span></p>
<p>Com os vectores gerados, precisamos de poderosas bases de dados de vectores e motores de pesquisa para os processar.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/tool_architecutre_33fb646954.png" alt="tool architecture" class="doc-image" id="tool-architecture" />
   </span> <span class="img-wrapper"> <span>arquitetura da ferramenta</span> </span></p>
<p>A ferramenta de personalização utiliza alguns dos motores de pesquisa e bases de dados mais populares: Elasticsearch, <a href="https://milvus.io/">Milvus</a> e PostgreSQL.</p>
<h3 id="Why-Milvus" class="common-anchor-header">Porquê o Milvus?</h3><p>Um componente do guarda-roupa contém informações altamente complexas, como a cor, a forma, a organização interior, etc. No entanto, a forma tradicional de manter os dados do guarda-roupa numa base de dados relacional está longe de ser suficiente. Uma forma popular é utilizar técnicas de incorporação para converter os guarda-roupas em vectores. Por conseguinte, temos de procurar um novo tipo de base de dados especificamente concebido para o armazenamento de vectores e a pesquisa de semelhanças. Depois de analisar várias soluções populares, a base de dados de vectores <a href="https://github.com/milvus-io/milvus">Milvus</a> foi selecionada pelo seu excelente desempenho, estabilidade, compatibilidade e facilidade de utilização. O gráfico abaixo é uma comparação de várias soluções populares de pesquisa vetorial.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Solution_comparison_d96b8f1dd5.png" alt="solution comparison" class="doc-image" id="solution-comparison" />
   </span> <span class="img-wrapper"> <span>comparação de soluções</span> </span></p>
<h3 id="System-workflow" class="common-anchor-header">Fluxo de trabalho do sistema</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/System_workflow_250c275ec1.png" alt="System workflow" class="doc-image" id="system-workflow" />
   </span> <span class="img-wrapper"> <span>Fluxo de trabalho do sistema</span> </span></p>
<p>O Elasticsearch é utilizado para uma filtragem grosseira por tamanho do guarda-roupa, cor, etc. Em seguida, os resultados filtrados passam pela base de dados vetorial Milvus para uma pesquisa de semelhanças e os resultados são classificados com base na sua distância/semelhança com o vetor de consulta. Por fim, os resultados são consolidados e aperfeiçoados com base em informações comerciais.</p>
<h2 id="Data-flow" class="common-anchor-header">Fluxo de dados<button data-href="#Data-flow" class="anchor-icon" translate="no">
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
    </button></h2><p>O sistema de personalização de armários é muito semelhante aos motores de pesquisa tradicionais e aos sistemas de recomendação. É composto por três partes:</p>
<ul>
<li>Preparação de dados offline, incluindo definição e geração de dados.</li>
<li>Serviços em linha, incluindo a recuperação e a classificação.</li>
<li>Pós-processamento de dados com base na lógica empresarial.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_flow_d0d9fa0fca.png" alt="Data flow" class="doc-image" id="data-flow" />
   </span> <span class="img-wrapper"> <span>Fluxo de dados</span> </span></p>
<h3 id="Offline-data-flow" class="common-anchor-header">Fluxo de dados offline</h3><ol>
<li>Definir os dados utilizando o conhecimento comercial.</li>
<li>Utilizar conhecimentos prévios para definir como combinar diferentes componentes e formá-los num guarda-roupa.</li>
<li>Reconhecer etiquetas de caraterísticas dos roupeiros e codificar as caraterísticas em dados do Elasticsearch no ficheiro <code translate="no">.json</code>.</li>
<li>Preparar dados de recuperação codificando dados não estruturados em vectores.</li>
<li>Utilizar a base de dados de vectores Milvus para classificar os resultados recuperados obtidos na etapa anterior.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/offline_data_flow_f91ac9cf4c.png" alt="offline data flow" class="doc-image" id="offline-data-flow" />
   </span> <span class="img-wrapper"> <span>fluxo de dados offline</span> </span></p>
<h3 id="Online-data-flow" class="common-anchor-header">Fluxo de dados em linha</h3><ol>
<li>Receber os pedidos de consulta dos utilizadores e recolher os perfis dos utilizadores.</li>
<li>Compreender a consulta do utilizador, identificando os seus requisitos para o guarda-roupa.</li>
<li>Pesquisa grosseira utilizando o Elasticsearch.</li>
<li>Pontuar e classificar os resultados obtidos da pesquisa grosseira com base no cálculo da semelhança dos vectores em Milvus.</li>
<li>Pós-processar e organizar os resultados na plataforma back-end para gerar os resultados finais.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/online_data_flow_1f2af25cc3.png" alt="online data flow" class="doc-image" id="online-data-flow" />
   </span> <span class="img-wrapper"> <span>fluxo de dados em linha</span> </span></p>
<h3 id="Data-post-processing" class="common-anchor-header">Pós-processamento de dados</h3><p>A lógica comercial varia consoante a empresa. Pode dar um toque final aos resultados aplicando a lógica comercial da sua empresa.</p>
<h2 id="System-demo" class="common-anchor-header">Demonstração do sistema<button data-href="#System-demo" class="anchor-icon" translate="no">
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
    </button></h2><p>Vejamos agora como funciona o sistema que criámos.</p>
<p>A interface do utilizador (IU) apresenta a possibilidade de diferentes combinações de componentes do armário.</p>
<p>Cada componente é etiquetado pela sua caraterística (tamanho, cor, etc.) e armazenado no Elasticsearch (ES). Ao armazenar as etiquetas no ES, existem quatro campos de dados principais a preencher: ID, etiquetas, caminho de armazenamento e outros campos de suporte. O ES e os dados rotulados são utilizados para a recolha granular e a filtragem de atributos.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/es_d5b0639610.png" alt="es" class="doc-image" id="es" />
   </span> <span class="img-wrapper"> <span>es</span> </span></p>
<p>Em seguida, são utilizados diferentes algoritmos de IA para codificar um guarda-roupa num conjunto de vectores. Os conjuntos de vectores são armazenados no Milvus para pesquisa de semelhanças e classificação. Este passo permite obter resultados mais refinados e exactos.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_38dd93a439.jpeg" alt="Milvus" class="doc-image" id="milvus" />
   </span> <span class="img-wrapper"> <span>Milvus</span> </span></p>
<p>O Elasticsearch, o Milvus e outros componentes do sistema formam a plataforma de design de personalização como um todo. Durante a recordação, a linguagem específica do domínio (DSL) no Elasticsearch e no Milvus é a seguinte.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/dsl_df60097d23.png" alt="dsl" class="doc-image" id="dsl" />
   </span> <span class="img-wrapper"> <span>dsl</span> </span></p>
<h2 id="Looking-for-more-resources" class="common-anchor-header">Procura mais recursos?<button data-href="#Looking-for-more-resources" class="anchor-icon" translate="no">
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
    </button></h2><p>Saiba como o banco de dados de vetores do Milvus pode potencializar mais aplicativos de IA:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-06-23-How-Short-video-Platform-Likee-Removes-Duplicate-Videos-with-Milvus.md">Como a plataforma de vídeos curtos Likee remove vídeos duplicados com o Milvus</a></li>
<li><a href="https://milvus.io/blog/2022-06-20-Zhentu-the-Photo-Fraud-Detector-Based-on-Milvus.md">Zhentu - O detetor de fraudes fotográficas baseado em Milvus</a></li>
</ul>
