---
id: build-multi-tenancy-rag-with-milvus-best-practices-part-one.md
title: >-
  Conceção de RAG multi-tenancy com Milvus: Melhores práticas para bases de
  conhecimento empresariais escaláveis
author: Robert Guo
date: 2024-12-04T00:00:00.000Z
cover: assets.zilliz.com/Designing_Multi_Tenancy_RAG_with_Milvus_40b3737145.png
tag: Engineering
tags: >-
  Milvus, contribute to open-source projects, vector databases, Contribute to
  Milvus
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/build-multi-tenancy-rag-with-milvus-best-practices-part-one
---
<h2 id="Introduction" class="common-anchor-header">Introdução<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Nos últimos anos, o <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Retrieval-Augmented Generation (RAG)</a> surgiu como uma solução fiável para as grandes organizações melhorarem as suas aplicações <a href="https://zilliz.com/glossary/large-language-models-(llms)">baseadas em LLM</a>, especialmente as que têm diversos utilizadores. À medida que essas aplicações crescem, a implementação de uma estrutura de aluguer múltiplo torna-se essencial. <strong>O multi-tenancy</strong> fornece acesso seguro e isolado aos dados para diferentes grupos de utilizadores, garantindo a confiança dos utilizadores, cumprindo as normas regulamentares e melhorando a eficiência operacional.</p>
<p><a href="https://zilliz.com/what-is-milvus">O Milvus</a> é uma <a href="https://zilliz.com/learn/what-is-vector-database">base de dados vetorial</a> de código aberto criada para tratar <a href="https://zilliz.com/glossary/vector-embeddings">dados vectoriais</a> de elevada dimensão. É um componente de infraestrutura indispensável do RAG, que armazena e recupera informações contextuais de fontes externas para os LLM. O Milvus oferece <a href="https://milvus.io/docs/multi_tenancy.md">estratégias flexíveis de multi-tenancy</a> para várias necessidades, incluindo <strong>multi-tenancy ao nível da base de dados, ao nível da coleção e ao nível da partição</strong>.</p>
<p>Neste post, abordaremos:</p>
<ul>
<li><p>O que é multitenancy e por que é importante</p></li>
<li><p>Estratégias de multilocação no Milvus</p></li>
<li><p>Exemplo: Estratégia de multilocação para uma base de conhecimento empresarial alimentada por RAG</p></li>
</ul>
<h2 id="What-is-Multi-Tenancy-and-Why-It-Matters" class="common-anchor-header">O que é Multi-Tenancy e porque é importante<button data-href="#What-is-Multi-Tenancy-and-Why-It-Matters" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/multi_tenancy.md"><strong>Multi-tenancy</strong></a> é uma arquitetura em que vários clientes ou equipas, conhecidos como &quot;<strong>inquilinos&quot;,</strong> partilham uma única instância de uma aplicação ou sistema. Os dados e as configurações de cada inquilino são isolados logicamente, garantindo a privacidade e a segurança, enquanto todos os inquilinos partilham a mesma infraestrutura subjacente.</p>
<p>Imagine uma plataforma SaaS que fornece soluções baseadas no conhecimento a várias empresas. Cada empresa é um inquilino.</p>
<ul>
<li><p>O inquilino A é uma organização de cuidados de saúde que armazena FAQs viradas para o paciente e documentos de conformidade.</p></li>
<li><p>O inquilino B é uma empresa de tecnologia que gere fluxos de trabalho internos de resolução de problemas de TI.</p></li>
<li><p>O inquilino C é uma empresa de retalho com FAQs de serviço ao cliente para devoluções de produtos.</p></li>
</ul>
<p>Cada inquilino opera num ambiente completamente isolado, garantindo que nenhum dado do inquilino A entra no sistema do inquilino B ou vice-versa. Além disso, a atribuição de recursos, o desempenho das consultas e as decisões de escalonamento são específicos de cada locatário, garantindo um elevado desempenho, independentemente dos picos de carga de trabalho num locatário.</p>
<p>O multi-tenancy também funciona para sistemas que servem diferentes equipas dentro da mesma organização. Imagine uma grande empresa que utiliza uma base de conhecimentos alimentada por RAG para servir os seus departamentos internos, tais como RH, Jurídico e Marketing. Nesta configuração, cada <strong>departamento é um inquilino</strong> com dados e recursos isolados.</p>
<p>O multilocatário oferece vantagens significativas, incluindo <strong>eficiência de custos, escalabilidade e segurança de dados robusta</strong>. Ao partilhar uma única infraestrutura, os fornecedores de serviços podem reduzir os custos gerais e garantir um consumo de recursos mais eficaz. Esta abordagem também pode ser escalada sem esforço - a integração de novos inquilinos requer muito menos recursos do que a criação de instâncias separadas para cada um, como acontece com os modelos de inquilinato único. É importante salientar que o multilocatário mantém uma segurança de dados robusta, assegurando um isolamento rigoroso dos dados para cada locatário, com controlos de acesso e encriptação que protegem as informações sensíveis contra o acesso não autorizado. Além disso, as actualizações, os patches e as novas funcionalidades podem ser implementados em todos os inquilinos em simultâneo, simplificando a manutenção do sistema e reduzindo a carga sobre os administradores, ao mesmo tempo que garante que as normas de segurança e conformidade são consistentemente respeitadas.</p>
<h2 id="Multi-Tenancy-Strategies-in-Milvus" class="common-anchor-header">Estratégias multi-inquilino em Milvus<button data-href="#Multi-Tenancy-Strategies-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Para compreender como o Milvus suporta o multi-tenancy, é importante olhar primeiro para a forma como organiza os dados do utilizador.</p>
<h3 id="How-Milvus-Organizes-User-Data" class="common-anchor-header">Como o Milvus organiza os dados do utilizador</h3><p>O Milvus estrutura os dados em três camadas, indo do mais amplo ao mais granular: <a href="https://milvus.io/docs/manage_databases.md"><strong>Base de dados</strong></a>, <a href="https://milvus.io/docs/manage-collections.md"><strong>coleção</strong></a> e <a href="https://milvus.io/docs/manage-partitions.md"><strong>partição/chave de partição</strong></a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_How_Milvus_organizes_user_data_4521c4b8f9.png" alt="Figure- How Milvus organizes user data .png" class="doc-image" id="figure--how-milvus-organizes-user-data-.png" />
   </span> <span class="img-wrapper"> <span>Figura- Como o Milvus organiza os dados do utilizador .png</span> </span></p>
<p><em>Figura: Como o Milvus organiza os dados do utilizador</em></p>
<ul>
<li><p><strong>Base de dados</strong>: Funciona como um contentor lógico, semelhante a uma base de dados nos sistemas relacionais tradicionais.</p></li>
<li><p><strong>Coleção</strong>: Comparável a uma tabela numa base de dados, uma coleção organiza os dados em grupos geríveis.</p></li>
<li><p><strong>Partição/chave de partição</strong>: Dentro de uma coleção, os dados podem ser ainda mais segmentados por <strong>Partições</strong>. Utilizando uma <strong>Chave de partição</strong>, os dados com a mesma chave são agrupados. Por exemplo, se utilizar um <strong>ID de utilizador</strong> como <strong>chave de partição</strong>, todos os dados de um utilizador específico serão armazenados no mesmo segmento lógico. Isto torna simples a recuperação de dados associados a utilizadores individuais.</p></li>
</ul>
<p>À medida que passa da <strong>Base de dados</strong> para a <strong>Coleção</strong> e para a <strong>Chave de partição</strong>, a granularidade da organização dos dados torna-se progressivamente mais fina.</p>
<p>Para garantir uma maior segurança dos dados e um controlo de acesso adequado, o Milvus também fornece um <a href="https://zilliz.com/blog/enabling-fine-grained-access-control-with-milvus-row-level-rbac"><strong>Controlo de Acesso Baseado em Funções (RBAC)</strong></a> robusto, permitindo aos administradores definir permissões específicas para cada utilizador. Apenas os utilizadores autorizados podem aceder a determinados dados.</p>
<p>Milvus suporta <a href="https://milvus.io/docs/multi_tenancy.md">múltiplas estratégias</a> para implementar multi-tenancy, oferecendo flexibilidade baseada nas necessidades da sua aplicação: <strong>multi-tenancy ao nível da base de dados, ao nível da coleção e ao nível da partição</strong>.</p>
<h3 id="Database-Level-Multi-Tenancy" class="common-anchor-header">Multitenancy ao nível da base de dados</h3><p>Com a abordagem de multi-tenancy ao nível da base de dados, a cada inquilino é atribuída a sua própria base de dados dentro do mesmo cluster Milvus. Esta estratégia fornece um forte isolamento de dados e garante um desempenho de pesquisa ótimo. No entanto, pode levar a uma utilização ineficiente dos recursos se alguns inquilinos permanecerem inactivos.</p>
<h3 id="Collection-Level-Multi-Tenancy" class="common-anchor-header">Multitenancy ao nível da coleção</h3><p>Aqui, no multilocatário ao nível da coleção, podemos organizar os dados para os locatários de duas formas.</p>
<ul>
<li><p><strong>Uma coleção para todos os locatários</strong>: Todos os locatários compartilham uma única coleção, com campos específicos do locatário usados para filtragem. Embora simples de implementar, essa abordagem pode encontrar gargalos de desempenho à medida que o número de locatários aumenta.</p></li>
<li><p><strong>Uma coleção por locatário</strong>: Cada locatário pode ter uma coleção dedicada, melhorando o isolamento e o desempenho, mas exigindo mais recursos. Esta configuração pode enfrentar limitações de escalabilidade se o número de inquilinos exceder a capacidade de recolha do Milvus.</p></li>
</ul>
<h3 id="Partition-Level-Multi-Tenancy" class="common-anchor-header">Multi-Tenancy a nível de partição</h3><p>O Multi-Tenancy ao nível da partição centra-se na organização dos inquilinos dentro de uma única coleção. Aqui, também temos duas maneiras de organizar os dados do locatário.</p>
<ul>
<li><p><strong>Uma partição por locatário</strong>: Os locatários compartilham uma coleção, mas seus dados são armazenados em partições separadas. Podemos isolar os dados atribuindo a cada locatário uma partição dedicada, equilibrando o isolamento e o desempenho da pesquisa. No entanto, esta abordagem é restringida pelo limite máximo de partições do Milvus.</p></li>
<li><p><strong>Multitenancy baseado em chave de partição</strong>: Esta é uma opção mais escalável em que uma única coleção utiliza chaves de partição para distinguir os inquilinos. Este método simplifica a gestão de recursos e suporta uma maior escalabilidade, mas não suporta inserções de dados em massa.</p></li>
</ul>
<p>A tabela abaixo resume as principais diferenças entre as principais abordagens de multilocação.</p>
<table>
<thead>
<tr><th><strong>Granularidade</strong></th><th><strong>Nível de base de dados</strong></th><th><strong>Nível de coleção</strong></th><th><strong>Nível de chave de partição</strong></th></tr>
</thead>
<tbody>
<tr><td>Máximo de inquilinos suportados</td><td>~1,000</td><td>~10,000</td><td>~10,000,000</td></tr>
<tr><td>Flexibilidade de organização de dados</td><td>Alta: Os utilizadores podem definir várias colecções com esquemas personalizados.</td><td>Média: Os utilizadores estão limitados a uma coleção com um esquema personalizado.</td><td>Baixa: Todos os utilizadores partilham uma coleção, o que exige um esquema consistente.</td></tr>
<tr><td>Custo por utilizador</td><td>Alto</td><td>Médio</td><td>Baixo</td></tr>
<tr><td>Isolamento de recursos físicos</td><td>Sim</td><td>Sim</td><td>Não</td></tr>
<tr><td>RBAC</td><td>Sim</td><td>Sim</td><td>Não</td></tr>
<tr><td>Desempenho da pesquisa</td><td>Forte</td><td>Médio</td><td>Forte</td></tr>
</tbody>
</table>
<h2 id="Example-Multi-Tenancy-Strategy-for-a-RAG-Powered-Enterprise-Knowledge-Base" class="common-anchor-header">Exemplo: Estratégia multi-tenancy para uma base de dados de conhecimento empresarial com tecnologia RAG<button data-href="#Example-Multi-Tenancy-Strategy-for-a-RAG-Powered-Enterprise-Knowledge-Base" class="anchor-icon" translate="no">
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
    </button></h2><p>Ao conceber a estratégia multi-tenancy para um sistema RAG, é essencial alinhar a sua abordagem com as necessidades específicas da sua empresa e dos seus inquilinos. A Milvus oferece várias estratégias multi-tenancy, e a escolha da mais adequada depende do número de utilizadores, dos seus requisitos e do nível de isolamento de dados necessário. Aqui está um guia prático para tomar estas decisões, tomando como exemplo uma base de conhecimentos empresarial alimentada por RAG.</p>
<h3 id="Understanding-Tenant-Structure-Before-Choosing-a-Multi-Tenancy-Strategy" class="common-anchor-header">Compreender a estrutura dos inquilinos antes de escolher uma estratégia para vários inquilinos</h3><p>Uma base de conhecimentos empresarial alimentada por RAG serve frequentemente um pequeno número de inquilinos. Esses locatários são geralmente unidades de negócios independentes, como TI, Vendas, Jurídico e Marketing, cada uma exigindo serviços de base de conhecimento distintos. Por exemplo, o departamento de RH gere informações sensíveis dos funcionários, como guias de integração e políticas de benefícios, que devem ser confidenciais e acessíveis apenas ao pessoal de RH.</p>
<p>Neste caso, cada unidade de negócio deve ser tratada como um inquilino separado e uma <strong>estratégia de multi-tenancy ao nível da base de dados</strong> é frequentemente a mais adequada. Ao atribuir bases de dados dedicadas a cada locatário, as organizações podem obter um forte isolamento lógico, simplificando a gestão e melhorando a segurança. Esta configuração proporciona aos locatários uma flexibilidade significativa - podem definir modelos de dados personalizados nas colecções, criar tantas colecções quantas as necessárias e gerir de forma independente o controlo de acesso às suas colecções.</p>
<h3 id="Enhancing-Security-with-Physical-Resource-Isolation" class="common-anchor-header">Melhorar a segurança com isolamento físico de recursos</h3><p>Em situações em que a segurança dos dados é altamente prioritária, o isolamento lógico no nível do banco de dados pode não ser suficiente. Por exemplo, algumas unidades de negócios podem lidar com dados críticos ou altamente sensíveis, exigindo garantias mais fortes contra a interferência de outros locatários. Nestes casos, podemos implementar uma <a href="https://milvus.io/docs/resource_group.md">abordagem de isolamento físico</a> em cima de uma estrutura multi-tenancy ao nível da base de dados.</p>
<p>O Milvus permite-nos mapear componentes lógicos, tais como bases de dados e colecções, para recursos físicos. Este método garante que as actividades de outros inquilinos não têm impacto nas operações críticas. Vamos explorar como esta abordagem funciona na prática.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_How_Milvus_manages_physical_resources_6269b908d7.png" alt="Figure- How Milvus manages physical resources.png" class="doc-image" id="figure--how-milvus-manages-physical-resources.png" />
   </span> <span class="img-wrapper"> <span>Figura - Como o Milvus gere os recursos físicos.png</span> </span></p>
<p>Figura: Como Milvus gere os recursos físicos</p>
<p>Como se pode ver no diagrama acima, existem três camadas de gestão de recursos em Milvus: <strong>Query Node (nó</strong> <strong>de</strong> <strong>consulta</strong>), <strong>Resource Group (grupo de recursos</strong>) e <strong>Database (base de dados)</strong>.</p>
<ul>
<li><p><strong>Nó de consulta</strong>: O componente que processa as tarefas de consulta. Ele é executado em uma máquina física ou contêiner (por exemplo, um pod no Kubernetes).</p></li>
<li><p><strong>Grupo de recursos</strong>: Uma coleção de nós de consulta que atua como uma ponte entre componentes lógicos (bancos de dados e coleções) e recursos físicos. Você pode alocar um ou mais bancos de dados ou coleções a um único Grupo de Recursos.</p></li>
</ul>
<p>No exemplo apresentado no diagrama acima, existem três <strong>bases de dados</strong> lógicas: X, Y e Z.</p>
<ul>
<li><p><strong>Base de dados X</strong>: contém <strong>a coleção A</strong>.</p></li>
<li><p><strong>Base de dados Y</strong>: contém <strong>as colecções B</strong> e <strong>C</strong>.</p></li>
<li><p><strong>Base de dados Z</strong>: Contém <strong>as colecções D</strong> e <strong>E</strong>.</p></li>
</ul>
<p>Digamos que <strong>a Base de Dados X</strong> contém uma base de conhecimentos crítica que não queremos que seja afetada pela carga da <strong>Base de Dados Y</strong> ou da <strong>Base de Dados Z</strong>. Para garantir o isolamento dos dados:</p>
<ul>
<li><p>À base de<strong>dados X</strong> é atribuído o seu próprio <strong>grupo de recursos</strong> para garantir que a sua base de conhecimentos crítica não é afetada pelas cargas de trabalho de outras bases de dados.</p></li>
<li><p><strong>A coleção E</strong> também é atribuída a um <strong>grupo de recursos</strong> separado na sua base de dados principal<strong>(Z</strong>). Isto proporciona isolamento ao nível da coleção para dados críticos específicos dentro de uma base de dados partilhada.</p></li>
</ul>
<p>Entretanto, as restantes colecções das <strong>bases de dados Y</strong> e <strong>Z</strong> partilham os recursos físicos do <strong>Grupo de Recursos 2</strong>.</p>
<p>Ao mapear cuidadosamente os componentes lógicos para os recursos físicos, as organizações podem obter uma arquitetura multi-tenancy flexível, escalável e segura, adaptada às suas necessidades comerciais específicas.</p>
<h3 id="Designing-End-User-Level-Access" class="common-anchor-header">Conceber o acesso ao nível do utilizador final</h3><p>Agora que aprendemos as melhores práticas para escolher uma estratégia de multilocação para um RAG empresarial, vamos explorar como conceber o acesso ao nível do utilizador nesses sistemas.</p>
<p>Nestes sistemas, os utilizadores finais interagem normalmente com a base de conhecimentos em modo só de leitura através de LLMs. No entanto, as organizações continuam a necessitar de controlar esses dados de P&amp;R gerados pelos utilizadores e associá-los a utilizadores específicos para vários fins, tais como melhorar a precisão da base de conhecimentos ou oferecer serviços personalizados.</p>
<p>Tomemos como exemplo o balcão do serviço de consulta inteligente de um hospital. Os pacientes podem fazer perguntas como: "Há alguma consulta disponível com o especialista hoje?" ou "É necessária alguma preparação específica para a minha próxima cirurgia?" Embora estas perguntas não tenham um impacto direto na base de conhecimentos, é importante que o hospital acompanhe estas interações para melhorar os serviços. Estes pares de perguntas e respostas são normalmente armazenados numa base de dados separada (não tem necessariamente de ser uma base de dados vetorial) dedicada ao registo de interações.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_The_multi_tenancy_architecture_for_an_enterprise_RAG_knowledge_base_7c9ad8d4d1.png" alt="Figure- The multi-tenancy architecture for an enterprise RAG knowledge base .png" class="doc-image" id="figure--the-multi-tenancy-architecture-for-an-enterprise-rag-knowledge-base-.png" />
   </span> <span class="img-wrapper"> <span>Figura - A arquitetura multi-tenancy para uma base de conhecimentos RAG empresarial .png</span> </span></p>
<p><em>Figura: A arquitetura multi-tenancy para uma base de conhecimentos RAG empresarial</em></p>
<p>O diagrama acima mostra a arquitetura multi-tenancy de um sistema RAG empresarial.</p>
<ul>
<li><p><strong>Os administradores de sistemas</strong> supervisionam o sistema RAG, gerem a atribuição de recursos, atribuem bases de dados, mapeiam-nas para grupos de recursos e asseguram a escalabilidade. Tratam da infraestrutura física, como se mostra no diagrama, onde cada grupo de recursos (por exemplo, Grupo de Recursos 1, 2 e 3) é mapeado para servidores físicos (nós de consulta).</p></li>
<li><p><strong>Os inquilinos (proprietários e programadores de bases de dados)</strong> gerem a base de conhecimentos, iterando-a com base nos dados de perguntas e respostas gerados pelos utilizadores, como se mostra no diagrama. Diferentes bases de dados (base de dados X, Y, Z) contêm colecções com diferentes conteúdos da base de conhecimentos (coleção A, B, etc.).</p></li>
<li><p><strong>Os utilizadores finais</strong> interagem com o sistema de uma forma só de leitura através do LLM. À medida que consultam o sistema, as suas perguntas são registadas na tabela de registo de P&amp;R (uma base de dados separada), alimentando continuamente o sistema com dados valiosos.</p></li>
</ul>
<p>Esta conceção assegura que cada camada do processo - desde a interação com o utilizador até à administração do sistema - funciona sem problemas, ajudando a organização a construir uma base de conhecimentos robusta e em constante melhoria.</p>
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
    </button></h2><p>Neste blogue, explorámos a forma como as estruturas <a href="https://milvus.io/docs/multi_tenancy.md"><strong>multi-tenancy</strong></a> desempenham um papel fundamental na escalabilidade, segurança e desempenho das bases de dados de conhecimento alimentadas por RAG. Ao isolar dados e recursos para diferentes inquilinos, as empresas podem garantir a privacidade, a conformidade regulamentar e a alocação optimizada de recursos numa infraestrutura partilhada. <a href="https://milvus.io/docs/overview.md">O Milvus</a>, com suas estratégias flexíveis de multilocação, permite que as empresas escolham o nível certo de isolamento de dados - do nível de banco de dados ao nível de partição - dependendo de suas necessidades específicas. A escolha da abordagem multi-tenancy correta garante que as empresas podem fornecer serviços personalizados aos inquilinos, mesmo quando lidam com dados e cargas de trabalho diferentes.</p>
<p>Seguindo as práticas recomendadas aqui descritas, as organizações podem conceber e gerir eficazmente sistemas RAG multi-tenancy que não só proporcionam experiências de utilizador superiores, como também podem ser escalados sem esforço à medida que as necessidades da empresa crescem. A arquitetura do Milvus garante que as empresas possam manter altos níveis de isolamento, segurança e desempenho, tornando-o um componente crucial na criação de bases de conhecimento de nível empresarial, alimentadas por RAG.</p>
<h2 id="Stay-Tuned-for-More-Insights-into-Multi-Tenancy-RAG" class="common-anchor-header">Fique atento a mais informações sobre o RAG multilocatário<button data-href="#Stay-Tuned-for-More-Insights-into-Multi-Tenancy-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>Neste blogue, discutimos como as estratégias de multilocação da Milvus foram concebidas para gerir os inquilinos, mas não os utilizadores finais dentro desses inquilinos. As interações com o utilizador final ocorrem normalmente na camada da aplicação, enquanto a própria base de dados vetorial não tem conhecimento desses utilizadores.</p>
<p>Poderá estar a perguntar-se: <em>Se eu quiser fornecer respostas mais precisas com base no histórico de consultas de cada utilizador final, o Milvus não precisa de manter um contexto de P&amp;R personalizado para cada utilizador?</em></p>
<p>Essa é uma ótima pergunta, e a resposta realmente depende do caso de uso. Por exemplo, num serviço de consulta a pedido, as consultas são aleatórias e o principal objetivo é a qualidade da base de conhecimentos e não o acompanhamento do contexto histórico de um utilizador.</p>
<p>No entanto, noutros casos, os sistemas RAG devem ser sensíveis ao contexto. Quando isto é necessário, o Milvus tem de colaborar com a camada de aplicação para manter uma memória personalizada do contexto de cada utilizador. Este design é especialmente importante para aplicações com utilizadores finais massivos, que iremos explorar em maior detalhe no meu próximo post. Fique atento para mais informações!</p>
