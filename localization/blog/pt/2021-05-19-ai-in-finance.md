---
id: ai-in-.md
title: >-
  Acelerar a IA nas finanças com Milvus, uma base de dados vetorial de código
  aberto
author: milvus
date: 2021-05-19T03:41:20.776Z
desc: >-
  O Milvus pode ser utilizado para criar aplicações de IA para o sector
  financeiro, incluindo chatbots, sistemas de recomendação e muito mais.
cover: assets.zilliz.com/03_1_1e5aaf7dd1.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/ai-in-finance'
---
<custom-h1>Acelerar a IA nas finanças com Milvus, uma base de dados vetorial de código aberto</custom-h1><p>Há muito que os bancos e outras instituições financeiras são os primeiros a adotar software de código aberto para processamento e análise de grandes volumes de dados. Em 2010, o Morgan Stanley <a href="https://www.forbes.com/sites/tomgroenfeldt/2012/05/30/morgan-stanley-takes-on-big-data-with-hadoop/?sh=19f4f8cd16db">começou a utilizar</a> a estrutura de código aberto Apache Hadoop como parte de uma pequena experiência. A empresa estava a ter dificuldades em dimensionar com êxito as bases de dados tradicionais para os volumes maciços de dados que os seus cientistas queriam aproveitar, pelo que decidiu explorar soluções alternativas. Atualmente, o Hadoop é um elemento básico na Morgan Stanley, ajudando em tudo, desde a gestão de dados de CRM à análise de carteiras. Outros softwares de bases de dados relacionais de código aberto, como o MySQL, o MongoDB e o PostgreSQL, têm sido ferramentas indispensáveis para dar sentido aos grandes volumes de dados no sector financeiro.</p>
<p>A tecnologia é o que dá ao sector dos serviços financeiros uma vantagem competitiva e a inteligência artificial (IA) está a tornar-se rapidamente a abordagem padrão para extrair informações valiosas de grandes volumes de dados e analisar a atividade em tempo real nos sectores bancário, de gestão de activos e de seguros. Ao utilizar algoritmos de IA para converter dados não estruturados, como imagens, áudio ou vídeo, em vectores, um formato de dados numéricos legível por máquina, é possível efetuar pesquisas de semelhança em conjuntos de dados vectoriais maciços de milhões, mil milhões ou mesmo triliões. Os dados vectoriais são armazenados num espaço de elevada dimensão e os vectores semelhantes são encontrados utilizando a pesquisa por semelhança, que requer uma infraestrutura dedicada denominada base de dados vetorial.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/01_1_cb99f15886.jpg" alt="01 (1).jpg" class="doc-image" id="01-(1).jpg" />
   </span> <span class="img-wrapper"> <span>01 (1).jpg</span> </span></p>
<p><a href="https://github.com/milvus-io/milvus">A Milvus</a> é uma base de dados vetorial de código aberto criada especificamente para gerir dados vectoriais, o que significa que os engenheiros e cientistas de dados podem concentrar-se na criação de aplicações de IA ou na realização de análises, em vez de se preocuparem com a infraestrutura de dados subjacente. A plataforma foi criada em torno de fluxos de trabalho de desenvolvimento de aplicações de IA e está optimizada para simplificar as operações de aprendizagem automática (MLOps). Para obter mais informações sobre o Milvus e a sua tecnologia subjacente, consulte o nosso <a href="https://zilliz.com/blog/Vector-Similarity-Search-Hides-in-Plain-View">blogue</a>.</p>
<p>As aplicações comuns de IA no sector dos serviços financeiros incluem negociação algorítmica, composição e otimização de carteiras, validação de modelos, backtesting, aconselhamento robótico, assistentes virtuais de clientes, análise do impacto no mercado, conformidade regulamentar e testes de stress. Este artigo aborda três áreas específicas em que os dados vectoriais são aproveitados como um dos activos mais valiosos para as empresas bancárias e financeiras:</p>
<ol>
<li>Melhorar a experiência do cliente com chatbots bancários</li>
<li>Aumentar as vendas de serviços financeiros e muito mais com sistemas de recomendação</li>
<li>Analisar relatórios de ganhos e outros dados financeiros não estruturados com extração de texto semântico</li>
</ol>
<p><br/></p>
<h3 id="Enhancing-customer-experience-with-banking-chatbots" class="common-anchor-header">Melhorar a experiência do cliente com chatbots bancários</h3><p>Os chatbots bancários podem melhorar a experiência dos clientes, ajudando-os a selecionar investimentos, produtos bancários e apólices de seguro. A popularidade dos serviços digitais está a aumentar rapidamente, em parte devido às tendências aceleradas pela pandemia do coronavírus. Os chatbots funcionam utilizando o processamento de linguagem natural (PNL) para converter as perguntas enviadas pelos utilizadores em vectores semânticos para procurar respostas correspondentes. Os chatbots bancários modernos oferecem uma experiência natural personalizada aos utilizadores e falam num tom de conversa. O Milvus fornece um tecido de dados adequado para a criação de chatbots utilizando a pesquisa de semelhança de vectores em tempo real.</p>
<p>Saiba mais na nossa demonstração que aborda a criação de <a href="https://zilliz.com/blog/building-intelligent-chatbot-with-nlp-and-milvus">chatbots com Milvus</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/02_1_8c298c45e5.jpg" alt="02 (1).jpg" class="doc-image" id="02-(1).jpg" />
   </span> <span class="img-wrapper"> <span>02 (1).jpg</span> </span></p>
<p><br/></p>
<h4 id="Boosting-financial-services-sales-and-more-with-recommender-systems" class="common-anchor-header">Aumentar as vendas de serviços financeiros e muito mais com sistemas de recomendação:</h4><p>O sector da banca privada utiliza sistemas de recomendação para aumentar as vendas de produtos financeiros através de recomendações personalizadas baseadas nos perfis dos clientes. Os sistemas de recomendação podem também ser utilizados em investigação financeira, notícias de negócios, seleção de acções e sistemas de apoio à negociação. Graças aos modelos de aprendizagem profunda, cada utilizador e item é descrito como um vetor de incorporação. Uma base de dados vetorial oferece um espaço de incorporação onde as semelhanças entre utilizadores e itens podem ser calculadas.</p>
<p>Saiba mais na nossa <a href="https://zilliz.com/blog/graph-based-recommendation-system-with-milvus">demonstração</a> sobre sistemas de recomendação baseados em gráficos com o Milvus.</p>
<p><br/></p>
<h4 id="Analyzing-earnings-reports-and-other-unstructured-financial-data-with-semantic-text-mining" class="common-anchor-header">Analisar relatórios de ganhos e outros dados financeiros não estruturados com extração de texto semântico:</h4><p>As técnicas de extração de texto tiveram um impacto substancial no sector financeiro. À medida que os dados financeiros crescem exponencialmente, a extração de texto surgiu como um importante campo de investigação no domínio das finanças.</p>
<p>Os modelos de aprendizagem profunda são atualmente aplicados para representar relatórios financeiros através de vectores de palavras capazes de captar numerosos aspectos semânticos. Uma base de dados de vectores como a Milvus é capaz de armazenar vectores de palavras semânticas maciças de milhões de relatórios e, em seguida, efetuar pesquisas de semelhança em milissegundos.</p>
<p>Saiba mais sobre como <a href="https://medium.com/deepset-ai/semantic-search-with-milvus-knowledge-graph-qa-web-crawlers-and-more-837451eae9fa">utilizar o Haystack da deepset com o Milvus</a>.</p>
<p><br/></p>
<h3 id="Don’t-be-a-stranger" class="common-anchor-header">Não seja um estranho</h3><ul>
<li>Encontre ou contribua para o Milvus no <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>Interaja com a comunidade através do <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Conecte-se conosco no <a href="https://twitter.com/milvusio">Twitter</a>.</li>
</ul>
