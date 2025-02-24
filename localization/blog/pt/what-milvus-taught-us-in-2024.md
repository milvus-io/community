---
id: what-milvus-taught-us-in-2024.md
title: O que os utilizadores do Milvus nos ensinaram em 2024
author: Stefan Webb
date: 2025-02-18T00:00:00.000Z
desc: Vê as perguntas mais frequentes sobre Milvus no nosso Discord.
cover: assets.zilliz.com/What_Milvus_Users_Taught_Us_in_2024_db63863725.png
tag: Engineering
tags: null
recommend: true
canonicalUrl: 'https://milvus.io/blog/what-milvus-taught-us-in-2024.md'
---
<h2 id="Overview" class="common-anchor-header">Visão geral<button data-href="#Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>À medida que o Milvus florescia em 2024 com grandes lançamentos e um ecossistema de código aberto próspero, um tesouro escondido de ideias dos utilizadores estava a formar-se discretamente na nossa comunidade no <a href="https://discord.gg/xwqmFDURcz">Discord</a>. Esta compilação de discussões da comunidade representou uma oportunidade única para compreender os desafios dos nossos utilizadores em primeira mão. Intrigado com este recurso inexplorado, iniciei uma análise exaustiva de todos os tópicos de discussão do ano, procurando padrões que nos pudessem ajudar a compilar um recurso de perguntas frequentes para os utilizadores do Milvus.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/top_image_6bbdbe8caa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>A minha análise revelou três áreas principais onde os utilizadores procuravam consistentemente orientação: <strong>Otimização do desempenho</strong>, <strong>estratégias de implementação</strong> e <strong>gestão de dados</strong>. Os utilizadores discutiam frequentemente como afinar o Milvus para ambientes de produção e acompanhar eficazmente as métricas de desempenho. Quando se tratava de implantação, a comunidade lutava para selecionar implantações apropriadas, escolher índices de pesquisa ideais e resolver problemas em configurações distribuídas. As conversas sobre gestão de dados centraram-se em estratégias de migração de dados de serviço para serviço e na seleção de modelos de incorporação.</p>
<p>Vamos examinar cada uma dessas áreas com mais detalhes.</p>
<h2 id="Deployment" class="common-anchor-header">Implantação<button data-href="#Deployment" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deployment_c951c46339.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus oferece modos de implantação flexíveis para atender a vários casos de uso. No entanto, alguns utilizadores têm dificuldade em encontrar a escolha certa e querem ter a certeza de que o estão a fazer "corretamente".</p>
<h3 id="Which-deployment-type-should-I-choose" class="common-anchor-header">Que tipo de implementação devo escolher?</h3><p>Uma pergunta muito frequente é qual a implementação a escolher entre Milvus <a href="https://milvus.io/docs/milvus_lite.md">Lite</a>, <a href="https://milvus.io/docs/prerequisite-docker.md">Standalone</a> e <a href="https://milvus.io/docs/prerequisite-helm.md">Distributed</a>. A resposta depende principalmente do tamanho da sua base de dados vetorial e da quantidade de tráfego que irá servir:</p>
<h4 id="Milvus-Lite" class="common-anchor-header">Milvus Lite</h4><p>Ao criar protótipos no seu sistema local com até alguns milhões de vectores, ou ao procurar uma base de dados de vectores incorporada para testes unitários e CI/CD, pode utilizar o Milvus Lite. Note que algumas funcionalidades mais avançadas, como a pesquisa de texto completo, ainda não estão disponíveis no Milvus Lite, mas estarão disponíveis em breve.</p>
<h4 id="Milvus-Standalone" class="common-anchor-header">Milvus Autónomo</h4><p>Se o seu sistema precisa de servir o tráfego de produção e/ou precisa de armazenar entre alguns milhões e uma centena de milhões de vectores, deve usar o Milvus Standalone, que empacota todos os componentes do Milvus numa única imagem Docker. Existe uma variação que apenas retira suas dependências de armazenamento persistente (minio) e armazenamento de metadados (etcd) como imagens separadas.</p>
<h4 id="Milvus-Distributed" class="common-anchor-header">Milvus Distribuído</h4><p>Para qualquer implantação em grande escala que sirva tráfego de produção, como servir bilhões de vetores a milhares de QPS, você deve usar o Milvus Distributed. Alguns utilizadores podem querer realizar processamento offline em lote em escala, por exemplo, para desduplicação de dados ou ligação de registos, e a futura versão do Milvus 3.0 fornecerá uma forma mais eficiente de o fazer através do que chamamos de lago de vectores.</p>
<h4 id="Fully-Managed-Service" class="common-anchor-header">Serviço totalmente gerido</h4><p>Para os programadores que pretendem concentrar-se no desenvolvimento da aplicação sem se preocuparem com o DevOps, <a href="https://cloud.zilliz.com/signup">o Zilliz Cloud</a> é o Milvus totalmente gerido que oferece um nível gratuito.</p>
<p>Consulte <a href="https://milvus.io/docs/install-overview.md#Choose-the-Right-Deployment-for-Your-Use-Case">"Visão geral das implementações do Milvus"</a> para obter mais informações.</p>
<h3 id="How-much-memory-storage-and-compute-will-I-require" class="common-anchor-header">De quanta memória, armazenamento e computação vou precisar?</h3><p>Esta questão surge com frequência, não só para os actuais utilizadores do Milvus, mas também para aqueles que estão a considerar se o Milvus é adequado para a sua aplicação. A combinação exacta da quantidade de memória, armazenamento e computação que uma implementação irá necessitar depende de uma interação complexa de factores.</p>
<p>Os embeddings vectoriais diferem em dimensionalidade devido ao modelo utilizado. E alguns índices de pesquisa vetorial são armazenados inteiramente na memória, enquanto outros armazenam dados no disco. Além disso, muitos índices de pesquisa são capazes de armazenar uma cópia comprimida (quantizada) dos embeddings e requerem memória adicional para estruturas de dados de grafos. Estes são apenas alguns dos factores que afectam a memória e o armazenamento.</p>
<h4 id="Milvus-Resource-Sizing-Tool" class="common-anchor-header">Ferramenta de dimensionamento de recursos Milvus</h4><p>Felizmente, Zilliz (a equipa que mantém o Milvus) construiu <a href="https://milvus.io/tools/sizing">uma ferramenta de dimensionamento de recursos</a> que faz um trabalho fantástico ao responder a esta questão. Introduza a dimensionalidade do vetor, o tipo de índice, as opções de implementação, etc. e a ferramenta estima a CPU, a memória e o armazenamento necessários para os vários tipos de nós Milvus e as suas dependências. A sua quilometragem pode variar, pelo que um teste de carga real com os seus dados e amostras de tráfego é sempre uma boa ideia.</p>
<h3 id="Which-vector-index-or-distance-metric-should-I-choose" class="common-anchor-header">Que índice vetorial ou métrica de distância devo escolher?</h3><p>Muitos utilizadores não sabem ao certo qual o índice que devem escolher e como definir os hiperparâmetros. Em primeiro lugar, é sempre possível adiar a escolha do tipo de índice para o Milvus, selecionando AUTOINDEX. No entanto, se pretender selecionar um tipo de índice específico, algumas regras de ouro fornecem um ponto de partida.</p>
<h4 id="In-Memory-Indexes" class="common-anchor-header">Índices na memória</h4><p>Gostaria de pagar o custo para colocar o seu índice inteiramente na memória? Um índice na memória é normalmente o mais rápido, mas também é caro. Veja <a href="https://milvus.io/docs/index.md?tab=floating">"Índices na memória"</a> para uma lista dos que são suportados pelo Milvus e as compensações que eles fazem em termos de latência, memória e recuperação.</p>
<p>Tenha em mente que o tamanho do seu índice não é simplesmente o número de vectores vezes a sua dimensionalidade e tamanho em ponto flutuante. A maioria dos índices quantiza os vectores para reduzir a utilização de memória, mas requer memória para estruturas de dados adicionais. Outros dados não vectoriais (escalares) e o respetivo índice também ocupam espaço de memória.</p>
<h4 id="On-Disk-Indexes" class="common-anchor-header">Índices no disco</h4><p>Quando o seu índice não cabe na memória, pode utilizar um dos <a href="https://milvus.io/docs/disk_index.md">"On-disk indexes"</a> fornecidos pelo Milvus. Duas opções com diferentes relações entre latência e recursos são <a href="https://milvus.io/docs/disk_index.md">DiskANN</a> e <a href="https://milvus.io/docs/mmap.md#MMap-enabled-Data-Storage">MMap</a>.</p>
<p>O DiskANN armazena uma cópia altamente comprimida dos vectores em memória, e os vectores não comprimidos e as estruturas de pesquisa de grafos no disco. Ele usa algumas ideias inteligentes para pesquisar o espaço vetorial, minimizando as leituras em disco e aproveitando a velocidade de acesso aleatório dos SSDs. Para obter uma latência mínima, o SSD deve ser conectado via NVMe em vez de SATA para obter o melhor desempenho de E/S.</p>
<p>Tecnicamente falando, MMap não é um tipo de índice, mas refere-se ao uso de memória virtual com um índice na memória. Com a memória virtual, as páginas podem ser trocadas entre o disco e a RAM conforme necessário, o que permite que um índice muito maior seja usado com eficiência se os padrões de acesso forem tais que apenas uma pequena parte dos dados seja usada de cada vez.</p>
<p>O DiskANN tem uma latência excelente e consistente. O MMap tem uma latência ainda melhor quando está a aceder a uma página na memória, mas a troca frequente de páginas causará picos de latência. Assim, o MMap pode ter uma maior variabilidade na latência, dependendo dos padrões de acesso à memória.</p>
<h4 id="GPU-Indexes" class="common-anchor-header">Índices GPU</h4><p>Uma terceira opção é construir <a href="https://milvus.io/docs/gpu_index.md">um índice usando memória GPU e computação</a>. O suporte GPU do Milvus é contribuído pela equipa Nvidia <a href="https://rapids.ai/">RAPIDS</a>. A pesquisa vetorial em GPU pode ter uma latência mais baixa do que uma pesquisa correspondente em CPU, embora normalmente sejam necessárias centenas ou milhares de QPS de pesquisa para explorar totalmente o paralelismo da GPU. Além disso, as GPUs têm normalmente menos memória do que a RAM da CPU e a sua execução é mais dispendiosa.</p>
<h4 id="Distance-Metrics" class="common-anchor-header">Métricas de distância</h4><p>Uma pergunta mais fácil de responder é qual a métrica de distância que deve ser escolhida para medir a semelhança entre vectores. Recomenda-se escolher a mesma métrica de distância com a qual o modelo de incorporação foi treinado, que normalmente é COSINE (ou IP quando as entradas são normalizadas). A fonte do seu modelo (por exemplo, a página do modelo no HuggingFace) fornecerá esclarecimentos sobre qual métrica de distância foi usada. O Zilliz também elaborou uma <a href="https://zilliz.com/ai-models">tabela</a> conveniente para procurar isso.</p>
<p>Para resumir, acho que grande parte da incerteza em torno da escolha do índice gira em torno da incerteza sobre como essas escolhas afetam a troca de latência/uso de recursos/recall da sua implantação. Recomendo usar as regras de ouro acima para decidir entre índices na memória, no disco ou na GPU e, em seguida, usar as diretrizes de troca fornecidas na documentação do Milvus para escolher um índice específico.</p>
<h3 id="Can-you-fix-my-broken-Milvus-Distributed-deployment" class="common-anchor-header">Podem reparar a minha implementação Milvus Distributed avariada?</h3><p>Muitas perguntas giram em torno de problemas para colocar uma implantação do Milvus Distributed em funcionamento, com questões relacionadas à configuração, ferramentas e logs de depuração. É difícil dar uma única solução, uma vez que cada questão parece diferente da anterior, embora felizmente o Milvus tenha <a href="https://milvus.io/discord">um Discord vibrante</a> onde pode procurar ajuda, e também oferecemos <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">horas de expediente 1-on-1 com um especialista</a>.</p>
<h3 id="How-do-I-deploy-Milvus-on-Windows" class="common-anchor-header">Como faço para implantar o Milvus no Windows?</h3><p>Uma questão que tem surgido várias vezes é como implementar o Milvus em máquinas Windows. Com base no seu feedback, reescrevemos a documentação para isso: veja <a href="https://milvus.io/docs/install_standalone-windows.md">Executar Milvus no Docker (Windows)</a> para saber como fazer isso, usando o <a href="https://learn.microsoft.com/en-us/windows/wsl/about#what-is-wsl-2">Windows Subsystem for Linux 2 (WSL2)</a>.</p>
<h2 id="Performance-and-Profiling" class="common-anchor-header">Desempenho e análise de perfil<button data-href="#Performance-and-Profiling" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Performance_and_Profiling_481975ea1d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Depois de escolher um tipo de implantação e colocá-lo em execução, os usuários querem se sentir confortáveis de que tomaram as melhores decisões e gostariam de criar um perfil do desempenho e do estado de sua implantação. Muitas perguntas estão relacionadas a como traçar o perfil de desempenho, observar o estado e obter uma visão do que e por quê.</p>
<h3 id="How-do-I-measure-performance" class="common-anchor-header">Como é que meço o desempenho?</h3><p>Os utilizadores pretendem verificar as métricas relacionadas com o desempenho da sua implementação para que possam compreender e solucionar os estrangulamentos. As métricas mencionadas incluem a latência média das consultas, a distribuição das latências, o volume das consultas, a utilização da memória, o armazenamento em disco, etc. Embora a obtenção destas métricas com o <a href="https://milvus.io/docs/monitor_overview.md">sistema de monitorização antigo</a> tenha sido um desafio, o Milvus 2.5 introduz um novo sistema chamado <a href="https://milvus.io/docs/milvus-webui.md#Milvus-WebUI">WebUI</a> (feedback bem-vindo!), que lhe permite aceder a toda esta informação a partir de uma interface Web de fácil utilização.</p>
<h3 id="What’s-happening-inside-Milvus-right-now-ie-observe-state" class="common-anchor-header">O que está a acontecer no Milvus neste momento (ou seja, observar o estado)?</h3><p>De forma semelhante, os utilizadores querem observar o estado interno da sua implementação. As questões levantadas incluem compreender porque é que um índice de pesquisa está a demorar tanto tempo a ser construído, como determinar se o cluster está saudável e compreender como é que uma consulta é executada nos nós. Muitas destas questões podem ser respondidas com a nova <a href="https://milvus.io/docs/milvus-webui.md#Milvus-WebUI">WebUI</a> que dá transparência ao que o sistema está a fazer internamente.</p>
<h3 id="How-does-some-complex-aspect-of-the-internals-work" class="common-anchor-header">Como funciona algum aspeto (complexo) da parte interna?</h3><p>Os utilizadores avançados querem muitas vezes ter alguma compreensão dos aspectos internos do Milvus, por exemplo, ter uma compreensão da selagem de segmentos ou da gestão de memória. O objetivo subjacente é tipicamente melhorar o desempenho e por vezes depurar problemas. A documentação, particularmente nas secções &quot;Conceitos&quot; e &quot;Guia de Administração&quot; é útil neste caso, por exemplo, veja as páginas <a href="https://milvus.io/docs/architecture_overview.md">&quot;Visão Geral da Arquitetura Milvus&quot;</a> e <a href="https://milvus.io/docs/clustering-compaction.md">&quot;Compactação de Clusters&quot;.</a> Continuaremos a melhorar a documentação sobre a parte interna do Milvus, tornando-a mais fácil de compreender, e agradecemos qualquer feedback ou pedido através do <a href="https://milvus.io/discord">Discord</a>.</p>
<h3 id="Which-embedding-model-should-I-choose" class="common-anchor-header">Que modelo de incorporação devo escolher?</h3><p>Uma questão relacionada com o desempenho que tem surgido várias vezes em encontros, horas de expediente e no Discord é como escolher um modelo de incorporação. Esta é uma pergunta difícil de dar uma resposta definitiva, embora recomendemos começar com modelos padrão como <a href="https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2">all-MiniLM-L6-v2</a>.</p>
<p>Semelhante à escolha do índice de pesquisa, existem compensações entre computação, armazenamento e recuperação. Um modelo de incorporação com uma dimensão de saída maior exigirá mais armazenamento, se tudo o resto se mantiver igual, embora provavelmente resulte numa maior recuperação de itens relevantes. Os modelos de incorporação maiores, para uma dimensão fixa, normalmente superam os modelos mais pequenos em termos de recuperação, embora à custa de mais computação e tempo. As tabelas de classificação que classificam o desempenho do modelo de incorporação, como o <a href="https://huggingface.co/spaces/mteb/leaderboard">MTEB</a>, baseiam-se em parâmetros de referência que podem não estar alinhados com os seus dados e tarefas específicos.</p>
<p>Por isso, não faz sentido pensar num "melhor" modelo de incorporação. Comece com um que tenha uma recuperação aceitável e que corresponda ao seu orçamento de computação e tempo para calcular as incorporações. Outras optimizações, como o ajuste fino dos seus dados ou a exploração empírica da relação computação/recuperação, podem ser adiadas para depois de ter um sistema funcional em produção.</p>
<h2 id="Data-Management" class="common-anchor-header">Gestão de dados<button data-href="#Data-Management" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Data_Management_aa2d1159bd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Como mover dados para dentro e para fora de uma implantação Milvus é outro tema principal nas discussões do Discord, o que não é nenhuma surpresa, dado o quão central esta tarefa é para colocar uma aplicação em produção.</p>
<h3 id="How-do-I-migrate-data-from-X-to-Milvus-How-do-I-migrate-data-from-Standalone-to-Distributed-How-do-I-migrate-from-24x-to-25x" class="common-anchor-header">Como é que eu migro dados do X para o Milvus? Como é que migro dados de Standalone para Distributed? Como é que migro da versão 2.4.x para a 2.5.x?</h3><p>Um novo utilizador pretende normalmente transferir dados existentes para o Milvus a partir de outra plataforma, incluindo motores de busca tradicionais como o <a href="https://docs.zilliz.com/docs/migrate-from-elasticsearch">Elasticsearch</a> e outras bases de dados vectoriais como o <a href="https://docs.zilliz.com/docs/migrate-from-pinecone">Pinecone</a> ou <a href="https://docs.zilliz.com/docs/migrate-from-qdrant">o Qdrant</a>. Os utilizadores existentes também podem querer migrar os seus dados de uma implementação do Milvus para outra, ou <a href="https://docs.zilliz.com/docs/migrate-from-milvus">do Milvus auto-hospedado para o Zilliz Cloud totalmente gerido</a>.</p>
<p>O <a href="https://github.com/zilliztech/vts">Vetor Transport Service (VTS)</a> e o serviço de <a href="https://docs.zilliz.com/docs/migrations">Migração</a> gerido no Zilliz Cloud foram concebidos para este fim.</p>
<h3 id="How-do-I-save-and-load-data-backups-How-do-I-export-data-from-Milvus" class="common-anchor-header">Como é que guardo e carrego cópias de segurança de dados? Como é que exporto dados do Milvus?</h3><p>O Milvus tem uma ferramenta dedicada, <a href="https://github.com/zilliztech/milvus-backup">milvus-backup</a>, para tirar instantâneos em armazenamento permanente e restaurá-los.</p>
<h2 id="Next-Steps" class="common-anchor-header">Próximos passos<button data-href="#Next-Steps" class="anchor-icon" translate="no">
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
    </button></h2><p>Espero que isto lhe tenha dado algumas indicações sobre como enfrentar os desafios comuns que se colocam quando se constrói com uma base de dados vetorial. Isso definitivamente nos ajudou a olhar novamente para a nossa documentação e roteiro de recursos para continuar trabalhando em coisas que podem ajudar a nossa comunidade a ter sucesso com o Milvus. Uma conclusão importante que eu gostaria de enfatizar é que as suas escolhas o colocam em diferentes pontos de um espaço de troca entre computação, armazenamento, latência e recuperação. <em>Não é possível maximizar todos estes critérios de desempenho em simultâneo - não existe uma implementação "óptima". No entanto, ao compreender melhor o funcionamento da pesquisa vetorial e dos sistemas de bases de dados distribuídas, pode tomar uma decisão informada.</em></p>
<p>Depois de percorrer o grande número de publicações de 2024, fiquei a pensar: porque é que um humano deveria fazer isto? A IA generativa não prometeu resolver esta tarefa de analisar grandes quantidades de texto e extrair informações? Junte-se a mim na segunda parte desta publicação do blogue (em breve), onde investigarei a conceção e a implementação de <em>um sistema multiagente para extrair informações de fóruns de discussão.</em></p>
<p>Mais uma vez, obrigado e espero vê-lo no <a href="https://milvus.io/discord">Discord</a> da comunidade e nos nossos próximos encontros de <a href="https://lu.ma/unstructured-data-meetup">dados não estruturados</a>. Para uma assistência mais prática, convidamo-lo a marcar uma <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">hora de trabalho individual</a>. <em>O seu feedback é essencial para melhorar o Milvus!</em></p>
