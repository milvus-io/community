---
id: 2022-1-25-annoucing-general-availability-of-milvus-2-0.md
title: Anúncio da disponibilidade geral do Milvus 2.0
author: Xiaofan Luan
date: 2022-01-25T00:00:00.000Z
desc: Uma forma fácil de lidar com dados massivos de elevada dimensão
cover: assets.zilliz.com/Milvus_2_0_GA_4308a0f552.png
tag: News
---
<p>Caros membros e amigos da comunidade Milvus:</p>
<p>Hoje, seis meses após a primeira Release Candidate (RC) ter sido tornada pública, temos o prazer de anunciar que o Milvus 2.0 está <a href="https://milvus.io/docs/v2.0.x/release_notes.md#v200">General Available (GA)</a> e pronto para produção! Tem sido uma longa jornada e agradecemos a todos - colaboradores da comunidade, utilizadores e a LF AI &amp; Data Foundation - que nos ajudaram a tornar isto possível.</p>
<p>A capacidade de lidar com biliões de dados de alta dimensão é um grande negócio para os sistemas de IA hoje em dia, e por boas razões:</p>
<ol>
<li>Os dados não estruturados ocupam volumes dominantes em comparação com os dados estruturados tradicionais.</li>
<li>A atualidade dos dados nunca foi tão importante. Os cientistas de dados estão ansiosos por soluções de dados atempadas em vez do tradicional compromisso T+1.</li>
<li>O custo e o desempenho tornaram-se ainda mais críticos e, no entanto, ainda existe uma grande lacuna entre as soluções actuais e os casos de utilização no mundo real. Daí o Milvus 2.0. O Milvus é um banco de dados que ajuda a lidar com dados de alta dimensão em escala. Ele foi projetado para a nuvem com a capacidade de ser executado em qualquer lugar. Se tem seguido os nossos lançamentos RC, sabe que temos feito um grande esforço para tornar o Milvus mais estável e mais fácil de implementar e manter.</li>
</ol>
<h2 id="Milvus-20-GA-now-offers" class="common-anchor-header">Milvus 2.0 GA agora oferece<button data-href="#Milvus-20-GA-now-offers" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Eliminação de entidades</strong></p>
<p>Como base de dados, o Milvus suporta agora a <a href="https://milvus.io/docs/v2.0.x/delete_data.md">eliminação de entidades por chave primária</a> e irá suportar a eliminação de entidades por expressão mais tarde.</p>
<p><strong>Equilíbrio de carga automático</strong></p>
<p>Milvus agora suporta a política de equilíbrio de carga de plugins para equilibrar a carga de cada nó de consulta e nó de dados. Graças à desagregação da computação e do armazenamento, o equilíbrio será efectuado em apenas alguns minutos.</p>
<p><strong>Transferência</strong></p>
<p>Uma vez que os segmentos em crescimento são selados através de flush, as tarefas de handoff substituem os segmentos em crescimento por segmentos históricos indexados para melhorar o desempenho da pesquisa.</p>
<p><strong>Compactação de dados</strong></p>
<p>A compactação de dados é uma tarefa em segundo plano para mesclar segmentos pequenos em segmentos grandes e limpar dados lógicos excluídos.</p>
<p><strong>Suporte a etcd incorporado e armazenamento de dados local</strong></p>
<p>No modo autónomo do Milvus, podemos remover a dependência do etcd/MinIO com apenas algumas configurações. O armazenamento local de dados também pode ser usado como cache local para evitar carregar todos os dados na memória principal.</p>
<p><strong>SDKs multi-linguagem</strong></p>
<p>Para além do <a href="https://github.com/milvus-io/pymilvus">PyMilvus</a>, os SDKs <a href="https://github.com/milvus-io/milvus-sdk-node">Node.js</a>, <a href="https://github.com/milvus-io/milvus-sdk-java">Java</a> e <a href="https://github.com/milvus-io/milvus-sdk-go">Go</a> estão agora prontos a usar.</p>
<p><strong>Milvus K8s Operator</strong></p>
<p><a href="https://milvus.io/docs/v2.0.x/install_cluster-milvusoperator.md">O Milvus Operator</a> fornece uma solução fácil para implantar e gerenciar uma pilha completa de serviços Milvus, incluindo os componentes Milvus e suas dependências relevantes (por exemplo, etcd, Pulsar e MinIO), para os clusters <a href="https://kubernetes.io/">Kubernetes</a> de destino de maneira escalável e altamente disponível.</p>
<p><strong>Ferramentas que ajudam a gerir o Milvus</strong></p>
<p>Temos de agradecer ao <a href="https://zilliz.com/">Zilliz</a> pela fantástica contribuição das ferramentas de gestão. Agora temos <a href="https://milvus.io/docs/v2.0.x/attu.md">o Attu</a>, que nos permite interagir com o Milvus através de uma GUI intuitiva, e <a href="https://milvus.io/docs/v2.0.x/cli_overview.md">o Milvus_CLI</a>, uma ferramenta de linha de comando para gerir o Milvus.</p>
<p>Graças a todos os 212 contribuidores, a comunidade terminou 6718 commits durante os últimos 6 meses, e toneladas de problemas de estabilidade e desempenho foram fechados. Abriremos o nosso relatório de estabilidade e desempenho logo após o lançamento da versão 2.0 GA.</p>
<h2 id="Whats-next" class="common-anchor-header">O que vem a seguir?<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Funcionalidade</strong></p>
<p>O suporte a tipos de strings será a próxima funcionalidade do Milvus 2.1. Iremos também introduzir o mecanismo de tempo de vida (TTL) e a gestão básica de ACL para melhor satisfazer as necessidades dos utilizadores.</p>
<p><strong>Disponibilidade</strong></p>
<p>Estamos a trabalhar na refatoração do mecanismo de agendamento de coordenadas de consulta para suportar réplicas de memória múltipla para cada segmento. Com múltiplas réplicas activas, Milvus pode suportar failover mais rápido e execução especulativa para encurtar o tempo de inatividade para um par de segundos.</p>
<p><strong>Desempenho</strong></p>
<p>Os resultados de benchmark de desempenho serão disponibilizados em breve nos nossos sítios Web. Prevê-se que as versões seguintes registem uma melhoria impressionante do desempenho. O nosso objetivo é reduzir para metade a latência da pesquisa em conjuntos de dados mais pequenos e duplicar o rendimento do sistema.</p>
<p><strong>Facilidade de utilização</strong></p>
<p>O Milvus foi concebido para funcionar em qualquer lugar. Iremos suportar o Milvus em MacOS (M1 e X86) e em servidores ARM nas próximas pequenas versões. Também ofereceremos PyMilvus embutido para que possa simplesmente <code translate="no">pip install</code> Milvus sem uma configuração complexa do ambiente.</p>
<p><strong>Governação da comunidade</strong></p>
<p>Iremos aperfeiçoar as regras de adesão e clarificar os requisitos e responsabilidades das funções de contribuidor. Um programa de mentoria também está em desenvolvimento; para qualquer pessoa que esteja interessada em banco de dados nativo da nuvem, pesquisa vetorial e / ou governança da comunidade, sinta-se à vontade para nos contactar.</p>
<p>Estamos muito entusiasmados com a última versão do Milvus GA! Como sempre, gostamos de ouvir os vossos comentários. Se encontrar algum problema, não hesite em contactar-nos no <a href="https://github.com/milvus-io/milvus">GitHub</a> ou via <a href="http://milvusio.slack.com/">Slack</a>.</p>
<p><br/></p>
<p>Com os melhores cumprimentos,</p>
<p>Xiaofan Luan</p>
<p>Mantenedor do Projeto Milvus</p>
<p><br/></p>
<blockquote>
<p><em>Editado por <a href="https://github.com/claireyuw">Claire Yu</a>.</em></p>
</blockquote>
