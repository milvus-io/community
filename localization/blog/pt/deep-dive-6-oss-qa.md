---
id: deep-dive-6-oss-qa.md
title: >-
  Garantia de qualidade do software de código aberto (OSS) - Um estudo de caso
  da Milvus
author: Wenxing Zhu
date: 2022-04-25T00:00:00.000Z
desc: >-
  A garantia de qualidade é um processo que permite determinar se um produto ou
  serviço cumpre determinados requisitos.
cover: assets.zilliz.com/Deep_Dive_6_c2cd44801d.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-6-oss-qa.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deep_Dive_6_c2cd44801d.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Imagem da capa</span> </span></p>
<blockquote>
<p>Este artigo foi escrito por <a href="https://github.com/zhuwenxing">Wenxing Zhu</a> e transcrito por <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>A garantia de qualidade (GQ) é um processo sistemático de determinar se um produto ou serviço cumpre determinados requisitos. Um sistema de GQ é uma parte indispensável do processo de I&amp;D porque, como o nome sugere, assegura a qualidade do produto.</p>
<p>Esta publicação apresenta o quadro de GQ adotado no desenvolvimento da base de dados vetorial Milvus, com o objetivo de fornecer uma orientação para os programadores e utilizadores que contribuem para o processo. Também abordará os principais módulos de teste do Milvus, bem como métodos e ferramentas que podem ser utilizados para melhorar a eficiência dos testes de GQ.</p>
<p><strong>Saltar para:</strong></p>
<ul>
<li><a href="#A-general-introduction-to-the-Milvus-QA-system">Introdução geral ao sistema de GQ do Milvus</a></li>
<li><a href="#Test-modules-in-Milvus">Módulos de teste em Milvus</a></li>
<li><a href="#Tools-and-methods-for-better-QA-efficiency">Ferramentas e métodos para melhorar a eficiência dos testes de GQ</a></li>
</ul>
<h2 id="A-general-introduction-to-the-Milvus-QA-system" class="common-anchor-header">Uma introdução geral ao sistema Milvus QA<button data-href="#A-general-introduction-to-the-Milvus-QA-system" class="anchor-icon" translate="no">
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
    </button></h2><p>A <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">arquitetura do sistema</a> é fundamental para a realização de testes de GQ. Quanto mais um engenheiro de GQ estiver familiarizado com o sistema, maior será a probabilidade de elaborar um plano de testes razoável e eficiente.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_architecture_feaccc489d.png" alt="Milvus architecture" class="doc-image" id="milvus-architecture" />
   </span> <span class="img-wrapper"> <span>Arquitetura do Milvus</span> </span></p>
<p>O Milvus 2.0 adopta uma <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#A-cloud-native-first-approach">arquitetura nativa da nuvem, distribuída e em camadas</a>, sendo o SDK a <a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">principal entrada para o</a> fluxo de <a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">dados</a> no Milvus. Os utilizadores do Milvus utilizam o SDK com muita frequência, pelo que os testes funcionais do SDK são muito necessários. Além disso, os testes de funcionamento do SDK podem ajudar a detetar os problemas internos que possam existir no sistema Milvus. Para além dos testes de funcionamento, serão também realizados outros tipos de testes na base de dados vetorial, incluindo testes unitários, testes de implantação, testes de fiabilidade, testes de estabilidade e testes de desempenho.</p>
<p>Uma arquitetura distribuída e nativa da nuvem traz conveniência e desafios aos testes de garantia de qualidade. Ao contrário dos sistemas que são implantados e executados localmente, uma instância do Milvus implantada e executada em um cluster Kubernetes pode garantir que o teste de software seja realizado nas mesmas circunstâncias que o desenvolvimento de software. No entanto, a desvantagem é que a complexidade da arquitetura distribuída traz mais incertezas que podem tornar o teste de QA do sistema ainda mais difícil e extenuante. Por exemplo, o Milvus 2.0 utiliza microsserviços de diferentes componentes, o que leva a um aumento do número de <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#A-bare-bones-skeleton-of-the-Milvus-architecture">serviços e nós</a> e a uma maior possibilidade de erro do sistema. Consequentemente, é necessário um plano de garantia de qualidade mais sofisticado e abrangente para melhorar a eficiência dos testes.</p>
<h3 id="QA-testings-and-issue-management" class="common-anchor-header">Testes de GQ e gestão de problemas</h3><p>A GQ no Milvus envolve tanto a realização de testes como a gestão de problemas que surgem durante o desenvolvimento do software.</p>
<h4 id="QA-testings" class="common-anchor-header">Testes de GQ</h4><p>A Milvus realiza diferentes tipos de testes de GQ de acordo com as caraterísticas do Milvus e as necessidades dos utilizadores, por ordem de prioridade, como mostra a imagem abaixo.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_14_2aff081d41.png" alt="QA testing priority" class="doc-image" id="qa-testing-priority" />
   </span> <span class="img-wrapper"> <span>Prioridade dos testes de GQ</span> </span></p>
<p>No Milvus, os testes de GQ são efectuados nos seguintes aspectos e com a seguinte prioridade</p>
<ol>
<li><strong>Função</strong>: Verificar se as funções e as caraterísticas funcionam como inicialmente concebidas.</li>
<li><strong>Implementação</strong>: Verificar se um utilizador pode implementar, reinstalar e atualizar tanto a versão autónoma do Mivus como o cluster do Milvus com diferentes métodos (Docker Compose, Helm, APT ou YUM, etc.).</li>
<li><strong>Desempenho</strong>:  Testar o desempenho da inserção de dados, indexação, pesquisa vetorial e consulta em Milvus.</li>
<li><strong>Estabilidade</strong>: Verificar se o Milvus pode funcionar de forma estável durante 5-10 dias com um nível normal de carga de trabalho.</li>
<li><strong>Fiabilidade</strong>: Testar se o Milvus ainda pode funcionar parcialmente se ocorrer um determinado erro do sistema.</li>
<li><strong>Configuração</strong>: Verificar se o Milvus funciona como esperado numa determinada configuração.</li>
<li><strong>Compatibilidade</strong>: Testar se o Milvus é compatível com diferentes tipos de hardware ou software.</li>
</ol>
<h4 id="Issue-management" class="common-anchor-header">Gestão de problemas</h4><p>Podem surgir muitos problemas durante o desenvolvimento do software. Os autores dos problemas podem ser os próprios engenheiros de QA ou utilizadores do Milvus da comunidade open-source. A equipa de QA é responsável por resolver os problemas.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Issue_management_workflow_12c726efa1.png" alt="Issue management workflow" class="doc-image" id="issue-management-workflow" />
   </span> <span class="img-wrapper"> <span>Fluxo de trabalho da gestão de problemas</span> </span></p>
<p>Quando um <a href="https://github.com/milvus-io/milvus/issues">problema</a> é criado, passa primeiro pela triagem. Durante a triagem, as novas questões serão examinadas para garantir que são fornecidos detalhes suficientes sobre as questões. Se o problema for confirmado, será aceite pelos programadores e estes tentarão resolver os problemas. Uma vez terminado o desenvolvimento, o autor do problema tem de verificar se este foi corrigido. Em caso afirmativo, o problema será encerrado.</p>
<h3 id="When-is-QA-needed" class="common-anchor-header">Quando é que a garantia de qualidade é necessária?</h3><p>Um equívoco comum é que a garantia de qualidade e o desenvolvimento são independentes um do outro. No entanto, a verdade é que, para garantir a qualidade do sistema, são necessários esforços tanto dos programadores como dos engenheiros de GQ. Por conseguinte, a GQ deve estar envolvida em todo o ciclo de vida.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/QA_lifecycle_375f4fd8a8.png" alt="QA lifecycle" class="doc-image" id="qa-lifecycle" />
   </span> <span class="img-wrapper"> <span>Ciclo de vida da GQ</span> </span></p>
<p>Como mostra a figura acima, um ciclo de vida completo de I&amp;D de software inclui três fases.</p>
<p>Durante a fase inicial, os programadores publicam a documentação de conceção, enquanto os engenheiros de garantia de qualidade elaboram planos de teste, definem critérios de lançamento e atribuem tarefas de garantia de qualidade. Os programadores e os engenheiros de garantia de qualidade têm de estar familiarizados com a documentação de conceção e com o plano de testes, para que haja uma compreensão mútua do objetivo do lançamento (em termos de funcionalidades, desempenho, estabilidade, convergência de erros, etc.) entre as duas equipas.</p>
<p>Durante a I&amp;D, os testes de desenvolvimento e de garantia de qualidade interagem frequentemente para desenvolver e verificar caraterísticas e funções, bem como para corrigir erros e problemas comunicados pela <a href="https://slack.milvus.io/">comunidade</a> de código aberto.</p>
<p>Durante a fase final, se os critérios de lançamento forem cumpridos, será lançada uma nova imagem Docker da nova versão do Milvus. Para o lançamento oficial, é necessária uma nota de lançamento centrada nas novas funcionalidades e nos erros corrigidos, bem como uma etiqueta de lançamento. Em seguida, a equipa de garantia de qualidade publicará também um relatório de testes sobre esta versão.</p>
<h2 id="Test-modules-in-Milvus" class="common-anchor-header">Módulos de teste no Milvus<button data-href="#Test-modules-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Existem vários módulos de teste no Milvus e esta secção explica cada módulo em pormenor.</p>
<h3 id="Unit-test" class="common-anchor-header">Teste unitário</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Unit_test_7d3d422345.png" alt="Unit test" class="doc-image" id="unit-test" />
   </span> <span class="img-wrapper"> <span>Teste unitário</span> </span></p>
<p>Os testes unitários podem ajudar a identificar erros de software numa fase inicial e fornecer um critério de verificação para a reestruturação do código. De acordo com os critérios de aceitação dos pull requests (PR) do Milvus, a <a href="https://app.codecov.io/gh/milvus-io/milvus/">cobertura</a> dos testes unitários do código deve ser de 80%.</p>
<h3 id="Function-test" class="common-anchor-header">Testes de função</h3><p>Os testes de função em Milvus são organizados principalmente em torno do <a href="https://github.com/milvus-io/pymilvus">PyMilvus</a> e dos SDKs. O principal objetivo dos testes de função é verificar se as interfaces podem funcionar como concebidas. Os testes de função têm duas facetas:</p>
<ul>
<li>Testar se os SDKs podem retornar os resultados esperados quando os parâmetros corretos são passados.</li>
<li>Testar se os SDK podem tratar erros e devolver mensagens de erro razoáveis quando são passados parâmetros incorrectos.</li>
</ul>
<p>A figura abaixo mostra a estrutura atual para testes de funções, que se baseia na estrutura principal <a href="https://pytest.org/">pytest</a>. Esta estrutura adiciona um invólucro ao PyMilvus e permite efetuar testes com uma interface de testes automatizada.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Function_test_41f837d3e7.png" alt="Function test" class="doc-image" id="function-test" />
   </span> <span class="img-wrapper"> <span>Teste de funções</span> </span></p>
<p>Considerando que é necessário um método de teste partilhado e que algumas funções têm de ser reutilizadas, é adoptada a estrutura de teste acima referida, em vez de utilizar diretamente a interface PyMilvus. Um módulo de "verificação" é também incluído na estrutura para facilitar a verificação dos valores esperados e reais.</p>
<p>No diretório <code translate="no">tests/python_client/testcases</code> estão incorporados 2.700 casos de teste de funções, cobrindo na totalidade quase todas as interfaces do PyMilvus. Estes testes de função supervisionam rigorosamente a qualidade de cada PR.</p>
<h3 id="Deployment-test" class="common-anchor-header">Teste de implementação</h3><p>O Milvus está disponível em dois modos: <a href="https://milvus.io/docs/v2.0.x/install_standalone-docker.md">autónomo</a> e <a href="https://milvus.io/docs/v2.0.x/install_cluster-docker.md">em cluster</a>. E há duas formas principais de implementar o Milvus: usando o Docker Compose ou o Helm. E depois de implementar o Milvus, os utilizadores podem também reiniciar ou atualizar o serviço Milvus. Existem duas categorias principais de teste de implantação: teste de reinicialização e teste de atualização.</p>
<p>O teste de reinício refere-se ao processo de testar a persistência dos dados, ou seja, se os dados continuam disponíveis após um reinício. O teste de atualização refere-se ao processo de testar a compatibilidade dos dados para evitar situações em que formatos incompatíveis de dados são inseridos no Milvus. Ambos os tipos de testes de implementação partilham o mesmo fluxo de trabalho, como ilustrado na imagem abaixo.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deployment_test_342ab3b3f5.png" alt="Deployment test" class="doc-image" id="deployment-test" />
   </span> <span class="img-wrapper"> <span>Teste de implementação</span> </span></p>
<p>Num teste de reinício, as duas implementações utilizam a mesma imagem docker. No entanto, num teste de atualização, a primeira implantação utiliza uma imagem de doca de uma versão anterior, enquanto a segunda implantação utiliza uma imagem de doca de uma versão posterior. Os resultados e dados do teste são salvos no arquivo <code translate="no">Volumes</code> ou na <a href="https://kubernetes.io/docs/concepts/storage/persistent-volumes/">declaração de volume persistente</a> (PVC).</p>
<p>Ao executar o primeiro teste, são criadas várias colecções e são efectuadas operações diferentes em cada uma das colecções. Ao executar o segundo teste, o foco principal será verificar se as colecções criadas ainda estão disponíveis para operações CRUD e se podem ser criadas novas colecções.</p>
<h3 id="Reliability-test" class="common-anchor-header">Teste de fiabilidade</h3><p>Os testes sobre a fiabilidade do sistema distribuído nativo da nuvem adoptam geralmente um método de engenharia do caos cujo objetivo é eliminar os erros e as falhas do sistema pela raiz. Por outras palavras, num teste de engenharia do caos, criamos propositadamente falhas no sistema para identificar problemas em testes de pressão e corrigimos as falhas do sistema antes que comecem realmente a causar danos. Durante um teste de caos em Milvus, escolhemos a <a href="https://chaos-mesh.org/">Chaos Mesh</a> como a ferramenta para criar o caos. Há vários tipos de falhas que precisam de ser criadas:</p>
<ul>
<li><strong>Pod kill</strong>: uma simulação do cenário em que os nós estão em baixo.</li>
<li><strong>Pod failure</strong>: Teste se um dos pods do nó de trabalho falhar, se todo o sistema ainda pode continuar a funcionar.</li>
<li><strong>Estresse de memória</strong>: uma simulação de consumo intenso de memória e recursos de CPU dos nós de trabalho.</li>
<li><strong>Partição de rede</strong>: Uma vez que o Milvus <a href="https://milvus.io/docs/v2.0.x/four_layers.md">separa o armazenamento da computação</a>, o sistema depende fortemente da comunicação entre os vários componentes. É necessária uma simulação do cenário em que a comunicação entre diferentes pods é particionada para testar a interdependência dos diferentes componentes do Milvus.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Reliability_test_a7331b91f4.png" alt="Reliability test" class="doc-image" id="reliability-test" />
   </span> <span class="img-wrapper"> <span>Teste de fiabilidade</span> </span></p>
<p>A figura acima demonstra a estrutura de teste de fiabilidade do Milvus que pode automatizar os testes de caos. O fluxo de trabalho de um teste de fiabilidade é o seguinte:</p>
<ol>
<li>Inicializar um cluster Milvus através da leitura das configurações de implementação.</li>
<li>Quando o cluster estiver pronto, execute <code translate="no">test_e2e.py</code> para testar se os recursos do Milvus estão disponíveis.</li>
<li>Executar <code translate="no">hello_milvus.py</code> para testar a persistência dos dados. Crie uma coleção com o nome "hello_milvus" para inserção de dados, descarga, criação de índices, pesquisa vetorial e consulta. Essa coleção não será liberada ou descartada durante o teste.</li>
<li>Crie um objeto de monitorização que iniciará seis threads que executam as operações de criação, inserção, descarga, índice, pesquisa e consulta.</li>
</ol>
<pre><code translate="no">checkers = {
    Op.create: CreateChecker(),
    Op.insert: InsertFlushChecker(),
    Op.flush: InsertFlushChecker(flush=<span class="hljs-literal">True</span>),
    Op.index: IndexChecker(),
    Op.search: SearchChecker(),
    Op.query: QueryChecker()
}
<button class="copy-code-btn"></button></code></pre>
<ol start="5">
<li>Faça a primeira afirmação - todas as operações são bem sucedidas como esperado.</li>
<li>Introduza uma falha de sistema no Milvus usando o Chaos Mesh para analisar o arquivo yaml que define a falha. Uma falha pode ser matar o nó de consulta a cada cinco segundos, por exemplo.</li>
<li>Fazer a segunda afirmação ao introduzir uma falha no sistema - Julgar se os resultados retornados das operações em Milvus durante uma falha no sistema correspondem à expetativa.</li>
<li>Eliminar a falha através do Chaos Mesh.</li>
<li>Quando o serviço Milvus é recuperado (o que significa que todos os pods estão prontos), faça a terceira afirmação - todas as operações são bem sucedidas como esperado.</li>
<li>Execute <code translate="no">test_e2e.py</code> para testar se os recursos do Milvus estão disponíveis. Algumas das operações durante o caos podem estar bloqueadas devido à terceira asserção. E mesmo depois de o caos ter sido eliminado, algumas operações podem continuar bloqueadas, impedindo que a terceira afirmação seja bem sucedida como esperado. Este passo tem como objetivo facilitar a terceira asserção e serve de padrão para verificar se o serviço Milvus recuperou.</li>
<li>Execute <code translate="no">hello_milvus.py</code>, carregue a coleção criada e realize operações CRUP na coleção. Em seguida, verifique se os dados existentes antes da falha do sistema ainda estão disponíveis após a recuperação da falha.</li>
<li>Recolha os registos.</li>
</ol>
<h3 id="Stability-and-performance-test" class="common-anchor-header">Teste de estabilidade e desempenho</h3><p>A figura abaixo descreve os objectivos, cenários de teste e métricas do teste de estabilidade e desempenho.</p>
<table>
<thead>
<tr><th></th><th>Teste de estabilidade</th><th>Teste de desempenho</th></tr>
</thead>
<tbody>
<tr><td>Objectivos</td><td>- Assegurar que o Milvus pode funcionar sem problemas durante um período de tempo fixo com uma carga de trabalho normal. <br> - Assegurar que os recursos são consumidos de forma estável quando o serviço Milvus é iniciado.</td><td>- Testar o desempenho de todas as interfaces do Milvus. <br> - Encontrar a configuração ideal com a ajuda dos testes de desempenho.  <br> - Servir de referência para futuras versões. <br> - Encontrar o ponto de estrangulamento que impede um melhor desempenho.</td></tr>
<tr><td>Cenários</td><td>- Cenário de leitura intensiva offline em que os dados são pouco actualizados após a inserção e a percentagem de processamento de cada tipo de pedido é: pedido de pesquisa 90%, pedido de inserção 5%, outros 5%. <br> - Cenário online de escrita intensiva em que os dados são inseridos e pesquisados simultaneamente e a percentagem de processamento de cada tipo de pedido é: pedido de inserção 50%, pedido de pesquisa 40%, outros 10%.</td><td>- Inserção de dados <br> - Construção de índices <br> - Pesquisa vetorial</td></tr>
<tr><td>Métricas</td><td>- Utilização de memória <br> - Consumo de CPU <br> - Latência de IO <br> - O estado dos pods do Milvus <br> - Tempo de resposta do serviço Milvus <br> etc.</td><td>- Taxa de transferência de dados durante a inserção de dados <br> - O tempo necessário para construir um índice <br> - Tempo de resposta durante uma pesquisa vetorial <br> - Consulta por segundo (QPS) <br> - Pedidos por segundo  <br> - Taxa de recuperação <br> etc.</td></tr>
</tbody>
</table>
<p>Tanto o teste de estabilidade como o teste de desempenho partilham o mesmo conjunto de fluxo de trabalho:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Stability_and_performance_test_6ed8532697.png" alt="Stability and performance test" class="doc-image" id="stability-and-performance-test" />
   </span> <span class="img-wrapper"> <span>Teste de estabilidade e de desempenho</span> </span></p>
<ol>
<li>Analisar e atualizar as configurações e definir as métricas. O <code translate="no">server-configmap</code> corresponde à configuração do Milvus autónomo ou do cluster, enquanto o <code translate="no">client-configmap</code> corresponde às configurações dos casos de teste.</li>
<li>Configurar o servidor e o cliente.</li>
<li>Preparação dos dados</li>
<li>Solicitar a interação entre o servidor e o cliente.</li>
<li>Relatório e visualização de métricas.</li>
</ol>
<h2 id="Tools-and-methods-for-better-QA-efficiency" class="common-anchor-header">Ferramentas e métodos para uma melhor eficácia do controlo de qualidade<button data-href="#Tools-and-methods-for-better-QA-efficiency" class="anchor-icon" translate="no">
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
    </button></h2><p>A partir da secção de testes de módulos, podemos ver que o procedimento para a maioria dos testes é de facto quase o mesmo, envolvendo principalmente a modificação das configurações do servidor e do cliente Milvus e a passagem de parâmetros API. Quando existem várias configurações, quanto mais variada for a combinação das diferentes configurações, mais cenários de teste estas experiências e testes podem cobrir. Por conseguinte, a reutilização de códigos e procedimentos é ainda mais crítica para o processo de aumento da eficiência dos testes.</p>
<h3 id="SDK-test-framework" class="common-anchor-header">Estrutura de teste do SDK</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/SDK_test_framework_8219e28f4c.png" alt="SDK test framework" class="doc-image" id="sdk-test-framework" />
   </span> <span class="img-wrapper"> <span>Estrutura de teste do SDK</span> </span></p>
<p>Para acelerar o processo de teste, podemos adicionar um wrapper <code translate="no">API_request</code> à estrutura de teste original e configurá-lo como algo semelhante ao gateway de API. Este gateway de API será responsável por recolher todos os pedidos de API e depois passá-los ao Milvus para receber coletivamente as respostas. Essas respostas serão passadas de volta para o cliente depois. Esta conceção facilita muito a captura de certas informações de registo, como parâmetros e resultados devolvidos. Para além disso, o componente de verificação na estrutura de testes do SDK pode verificar e examinar os resultados do Milvus. E todos os métodos de verificação podem ser definidos dentro deste componente de verificação.</p>
<p>Com a estrutura de teste do SDK, alguns processos de inicialização cruciais podem ser agrupados em uma única função. Ao fazer isso, grandes pedaços de códigos tediosos podem ser eliminados.</p>
<p>É também de salientar que cada caso de teste individual está relacionado com a sua coleção única para garantir o isolamento dos dados.</p>
<p>Ao executar casos de teste,<code translate="no">pytest-xdist</code>, a extensão pytest, pode ser aproveitada para executar todos os casos de teste individuais em paralelo, aumentando consideravelmente a eficiência.</p>
<h3 id="GitHub-action" class="common-anchor-header">Ação GitHub</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Git_Hub_action_c3c1bed591.png" alt="GitHub action" class="doc-image" id="github-action" />
   </span> <span class="img-wrapper"> <span>Ação GitHub</span> </span></p>
<p><a href="https://docs.github.com/en/actions">O GitHub Action</a> também é adotado para melhorar a eficiência do controlo de qualidade pelas suas caraterísticas seguintes:</p>
<ul>
<li>É uma ferramenta nativa de CI/CD profundamente integrada ao GitHub.</li>
<li>É fornecido com um ambiente de máquina configurado de forma uniforme e ferramentas de desenvolvimento de software comuns pré-instaladas, incluindo Docker, Docker Compose, etc.</li>
<li>Suporta vários sistemas operativos e versões, incluindo Ubuntu, MacOs, Windows-server, etc.</li>
<li>Possui um mercado que oferece extensões ricas e funções prontas para uso.</li>
<li>A sua matriz suporta trabalhos simultâneos e a reutilização do mesmo fluxo de teste para melhorar a eficiência</li>
</ul>
<p>Além das caraterísticas acima, outra razão para adotar o GitHub action é que testes de implantação e testes de confiabilidade requerem ambiente independente e isolado. E o GitHub Action é ideal para verificações de inspeção diárias em conjuntos de dados de pequena escala.</p>
<h3 id="Tools-for-benchmark-tests" class="common-anchor-header">Ferramentas para testes de referência</h3><p>Para tornar os testes de controlo de qualidade mais eficientes, são utilizadas várias ferramentas.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_13_fbc71dfe4f.png" alt="QA tools" class="doc-image" id="qa-tools" />
   </span> <span class="img-wrapper"> <span>Ferramentas de GQ</span> </span></p>
<ul>
<li><a href="https://argoproj.github.io/">Argo</a>: um conjunto de ferramentas de código aberto para Kubernetes para executar fluxos de trabalho e gerir clusters através do agendamento de tarefas. Também pode permitir a execução de várias tarefas em paralelo.</li>
<li><a href="https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/">Painel de controlo do Kubernetes</a>: uma interface de utilizador do Kubernetes baseada na Web para visualizar <code translate="no">server-configmap</code> e <code translate="no">client-configmap</code>.</li>
<li><a href="https://en.wikipedia.org/wiki/Network-attached_storage">NAS</a>: O armazenamento ligado à rede (NAS) é um servidor de armazenamento de dados informáticos ao nível dos ficheiros para manter conjuntos de dados de referência ANN comuns.</li>
<li><a href="https://www.influxdata.com/">InfluxDB</a> e <a href="https://www.mongodb.com/">MongoDB</a>: bancos de dados para salvar resultados de testes de benchmark.</li>
<li><a href="https://grafana.com/">Grafana</a>: Uma solução de análise e monitoramento de código aberto para monitorar métricas de recursos do servidor e métricas de desempenho do cliente.</li>
<li><a href="https://redash.io/">Redash</a>: Um serviço que ajuda a visualizar seus dados e criar gráficos para testes de benchmark.</li>
</ul>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">Sobre a série Deep Dive<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>Com o <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">anúncio oficial da disponibilidade geral</a> do Milvus 2.0, orquestrámos esta série de blogues Milvus Deep Dive para fornecer uma interpretação aprofundada da arquitetura e do código-fonte do Milvus. Os tópicos abordados nesta série de blogues incluem:</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Visão geral da arquitetura do Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">APIs e SDKs Python</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Processamento de dados</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Gestão de dados</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">Consulta em tempo real</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">Motor de execução escalar</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">Sistema QA</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">Motor de execução vetorial</a></li>
</ul>
