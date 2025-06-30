---
id: journey-to-35k-github-stars-story-of-building-milvus-from-scratch.md
title: >-
  Nossa jornada para mais de 35 mil estrelas no GitHub: A história real da
  construção de Milvus a partir do zero
author: Zilliz
date: 2025-06-27T00:00:00.000Z
cover: assets.zilliz.com/Github_star_30_K_2_f329467096.png
tag: Announcements
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus, vector database, vector search, AI search, Zilliz Cloud'
meta_title: |
  Our Journey to 35K+ GitHub Stars: Building Milvus from Scratch
desc: >-
  Junte-se a nós na celebração do Milvus, a base de dados de vectores que
  atingiu 35,5 mil estrelas no GitHub. Descubra a nossa história e como estamos
  a tornar as soluções de IA mais fáceis para os programadores.
origin: >-
  https://milvus.io/blog/journey-to-35k-github-stars-story-of-building-milvus-from-scratch.md
---
<p>Nos últimos anos, temos estado concentrados numa coisa: construir uma base de dados vetorial pronta para as empresas para a era da IA. A parte difícil não é criar <em>uma</em> base de dados - é criar uma que seja escalável, fácil de utilizar e que resolva efetivamente problemas reais na produção.</p>
<p>Em junho deste ano, atingimos um novo marco: Milvus atingiu <a href="https://github.com/milvus-io/milvus">35.000 estrelas no GitHub</a> (agora tem mais de 35.5K estrelas no momento em que escrevo). Não vamos fingir que este é apenas mais um número - significa muito para nós.</p>
<p>Cada estrela representa um programador que dedicou algum tempo a olhar para o que construímos, achou-o suficientemente útil para o marcar e, em muitos casos, decidiu utilizá-lo. Alguns de vós foram mais longe: apresentaram problemas, contribuíram com código, responderam a perguntas nos nossos fóruns e ajudaram outros programadores quando tiveram problemas.</p>
<p>Queríamos tirar um momento para partilhar a nossa história - a verdadeira, com todas as partes confusas incluídas.</p>
<h2 id="We-Started-Building-Milvus-Because-Nothing-Else-Worked" class="common-anchor-header">Começamos a construir o Milvus porque nada mais funcionava<button data-href="#We-Started-Building-Milvus-Because-Nothing-Else-Worked" class="anchor-icon" translate="no">
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
    </button></h2><p>Em 2017, começamos com uma pergunta simples: À medida que os aplicativos de IA estavam começando a surgir e os dados não estruturados estavam explodindo, como você armazena e pesquisa com eficiência as incorporações vetoriais que alimentam a compreensão semântica?</p>
<p>Os bancos de dados tradicionais não foram criados para isso. São optimizadas para linhas e colunas, não para vectores de elevada dimensão. As tecnologias e ferramentas existentes eram impossíveis ou dolorosamente lentas para o que precisávamos.</p>
<p>Tentámos tudo o que estava disponível. Criámos soluções com o Elasticsearch. Criámos índices personalizados em cima do MySQL. Até experimentámos o FAISS, mas foi concebido como uma biblioteca de investigação e não como uma infraestrutura de base de dados de produção. Nada fornecia a solução completa que imaginávamos para cargas de trabalho de IA corporativas.</p>
<p><strong>Então começámos a construir a nossa própria.</strong> Não porque pensássemos que seria fácil - as bases de dados são notoriamente difíceis de acertar - mas porque conseguíamos ver para onde a IA estava a ir e sabíamos que precisava de uma infraestrutura criada especificamente para lá chegar.</p>
<p>Em 2018, estávamos a desenvolver profundamente o que viria a ser <a href="https://milvus.io/">o Milvus</a>. O termo &quot;<strong>base de dados vetorial</strong>&quot; ainda nem sequer existia. Estávamos essencialmente a criar uma nova categoria de software de infraestruturas, o que era simultaneamente excitante e assustador.</p>
<h2 id="Open-Sourcing-Milvus-Building-in-Public" class="common-anchor-header">Open-Sourcing Milvus: construindo em público<button data-href="#Open-Sourcing-Milvus-Building-in-Public" class="anchor-icon" translate="no">
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
    </button></h2><p>Em novembro de 2019, decidimos abrir o código aberto da versão 0.10 do Milvus.</p>
<p>Open-sourcing significa expor todas as suas falhas ao mundo. Cada hack, cada comentário TODO, cada decisão de design sobre a qual não temos a certeza absoluta. Mas acreditávamos que, se as bases de dados vectoriais se iam tornar infra-estruturas críticas para a IA, tinham de ser abertas e acessíveis a todos.</p>
<p>A resposta foi esmagadora. Os programadores não se limitaram a utilizar o Milvus - melhoraram-no. Encontraram bugs que nos tinham escapado, sugeriram funcionalidades que não tínhamos considerado e fizeram perguntas que nos fizeram pensar melhor sobre as nossas escolhas de design.</p>
<p>Em 2020, juntámo-nos à <a href="https://lfaidata.foundation/">Fundação LF AI &amp; Data</a>. Isto não foi apenas por credibilidade - ensinou-nos como manter um projeto open-source sustentável. Como lidar com governança, compatibilidade com versões anteriores e construção de software que dura anos, não meses.</p>
<p>Em 2021, lançámos o Milvus 1.0 e graduámo-nos <a href="https://lfaidata.foundation/projects/milvus/">na LF AI &amp; Data Foundation</a>. Nesse mesmo ano, vencemos o <a href="https://big-ann-benchmarks.com/neurips21.html">desafio global BigANN</a> para pesquisa de vetores em escala de bilhões. Essa vitória foi boa, mas, mais importante, validou que estávamos resolvendo problemas reais da maneira certa.</p>
<h2 id="The-Hardest-Decision-Starting-Over" class="common-anchor-header">A decisão mais difícil: Começar de novo<button data-href="#The-Hardest-Decision-Starting-Over" class="anchor-icon" translate="no">
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
    </button></h2><p>É aqui que as coisas ficam complicadas. Em 2021, o Milvus 1.0 estava funcionando bem para muitos casos de uso, mas os clientes corporativos continuavam pedindo as mesmas coisas: melhor arquitetura nativa da nuvem, escalonamento horizontal mais fácil, mais simplicidade operacional.</p>
<p>Tínhamos uma escolha: remendar o nosso caminho ou reconstruir a partir do zero. Optámos por reconstruir.</p>
<p>O Milvus 2.0 foi essencialmente uma reescrita completa. Introduzimos uma arquitetura de armazenamento-computação totalmente desacoplada com escalabilidade dinâmica. Demorámos dois anos e foi, honestamente, um dos períodos mais stressantes da história da nossa empresa. Estávamos a deitar fora um sistema funcional que milhares de pessoas estavam a utilizar para construir algo não comprovado.</p>
<p><strong>Mas quando lançámos o Milvus 2.0 em 2022, este transformou o Milvus de uma poderosa base de dados vetorial numa infraestrutura pronta para produção que podia ser dimensionada para cargas de trabalho empresariais.</strong> Nesse mesmo ano, também concluímos uma <a href="https://zilliz.com/news/vector-database-company-zilliz-series-b-extension">rodada de financiamento da Série B + - não</a>para queimar dinheiro, mas para dobrar a qualidade do produto e o suporte para clientes globais. Sabíamos que esse caminho levaria tempo, mas cada passo tinha que ser construído sobre uma base sólida.</p>
<h2 id="When-Everything-Accelerated-with-AI" class="common-anchor-header">Quando tudo se acelerou com a IA<button data-href="#When-Everything-Accelerated-with-AI" class="anchor-icon" translate="no">
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
    </button></h2><p>2023 foi o ano da <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> (retrieval-augmented generation). De repente, a pesquisa semântica passou de uma técnica de IA interessante para uma infraestrutura essencial para chatbots, sistemas de perguntas e respostas sobre documentos e agentes de IA.</p>
<p>As estrelas do Milvus no GitHub dispararam. Os pedidos de apoio multiplicaram-se. Os programadores que nunca tinham ouvido falar de bases de dados vectoriais começaram subitamente a fazer perguntas sofisticadas sobre estratégias de indexação e otimização de consultas.</p>
<p>Esse crescimento foi empolgante, mas também avassalador. Percebemos que precisávamos escalar não apenas nossa tecnologia, mas toda a nossa abordagem de suporte à comunidade. Contratámos mais defensores dos programadores, reescrevemos completamente a nossa documentação e começámos a criar conteúdos educativos para programadores novos em bases de dados vectoriais.</p>
<p>Também lançámos <a href="https://zilliz.com/cloud">o Zilliz Cloud - a nossa</a>versão totalmente gerida do Milvus. Algumas pessoas perguntaram porque estávamos a "comercializar" o nosso projeto open-source. A resposta honesta é que manter uma infraestrutura de nível empresarial é caro e complexo. O Zilliz Cloud permite-nos sustentar e acelerar o desenvolvimento do Milvus, mantendo o núcleo do projeto completamente open-source.</p>
<p>Depois veio 2024. <a href="https://zilliz.com/blog/zilliz-named-a-leader-in-the-forrester-wave-vector-database-report"><strong>A Forrester nomeou-nos líderes</strong></a> <strong>na categoria de bases de dados vectoriais.</strong> O Milvus ultrapassou as 30.000 estrelas no GitHub. <strong>E apercebemo-nos: a estrada que andávamos a pavimentar há sete anos tinha-se finalmente transformado numa autoestrada.</strong> À medida que mais empresas adoptaram as bases de dados vectoriais como infraestrutura crítica, o crescimento do nosso negócio acelerou rapidamente - validando que a base que tínhamos construído podia escalar tanto técnica como comercialmente.</p>
<h2 id="The-Team-Behind-Milvus-Zilliz" class="common-anchor-header">A equipa por detrás de Milvus: Zilliz<button data-href="#The-Team-Behind-Milvus-Zilliz" class="anchor-icon" translate="no">
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
    </button></h2><p>Eis algo interessante: muitas pessoas conhecem o Milvus, mas não o Zilliz. Na verdade, não nos importamos com isso. <a href="https://zilliz.com/"><strong>A Zilliz</strong></a> <strong>é a equipa por detrás do Milvus - nós construímo-lo, mantemo-lo e damos-lhe suporte.</strong></p>
<p>O que mais nos interessa são as coisas sem glamour que fazem a diferença entre uma demo fixe e uma infraestrutura pronta para produção: optimizações de performance, patches de segurança, documentação que realmente ajuda os principiantes, e responder atenciosamente às questões do GitHub.</p>
<p>Criámos uma equipa de suporte global 24 horas por dia, 7 dias por semana, nos EUA, na Europa e na Ásia, porque os programadores precisam de ajuda nos seus fusos horários, não nos nossos. Temos colaboradores da comunidade a quem chamamos &quot;<a href="https://docs.google.com/forms/d/e/1FAIpQLSfkVTYObayOaND8M1ci9eF_YWvoKDb-xQjLJYZ-LhbCdLAt2Q/viewform">Embaixadores Milvus</a>&quot; que organizam eventos, respondem a questões de fóruns e, muitas vezes, explicam conceitos melhor do que nós.</p>
<p>Também aceitamos integrações com AWS, GCP e outros provedores de nuvem - mesmo quando eles oferecem suas próprias versões gerenciadas do Milvus. Mais opções de implementação são boas para os utilizadores. Embora tenhamos notado que quando as equipas enfrentam desafios técnicos complexos, muitas vezes acabam por nos contactar diretamente porque compreendemos o sistema a um nível mais profundo.</p>
<p>Muitas pessoas pensam que o código aberto é apenas uma &quot;caixa de ferramentas&quot;, mas na verdade é um &quot;processo evolutivo&quot; - um esforço coletivo de inúmeras pessoas que o amam e acreditam nele. Apenas aqueles que compreendem verdadeiramente a arquitetura podem fornecer o "porquê" por detrás das correcções de erros, da análise dos estrangulamentos de desempenho, da integração do sistema de dados e dos ajustes arquitectónicos.</p>
<p><strong>Por isso, se estiver a utilizar o Milvus de código aberto ou a considerar as bases de dados vectoriais como um componente central do seu sistema de IA, encorajamo-lo a contactar-nos diretamente para obter o apoio mais profissional e atempado.</strong></p>
<h2 id="Real-Impact-in-Production-The-Trust-from-Users" class="common-anchor-header">Impacto real na produção: A confiança dos utilizadores<button data-href="#Real-Impact-in-Production-The-Trust-from-Users" class="anchor-icon" translate="no">
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
    </button></h2><p>Os casos de utilização do Milvus cresceram para além do que tínhamos imaginado inicialmente. Estamos a alimentar a infraestrutura de IA de algumas das empresas mais exigentes do mundo em todos os sectores.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/zilliz_customers_e7340d5dd4.png" alt="zilliz customers.png" class="doc-image" id="zilliz-customers.png" />
   </span> <span class="img-wrapper"> <span>clientes zilliz.png</span> </span></p>
<p><a href="https://zilliz.com/customers/bosch"><strong>A Bosch</strong></a>, líder mundial em tecnologia automóvel e pioneira na condução autónoma, revolucionou a sua análise de dados com a Milvus, conseguindo uma redução de 80% nos custos de recolha de dados e uma poupança anual de 1,4 milhões de dólares, enquanto procurava milhares de milhões de cenários de condução em milissegundos para casos críticos.</p>
<p>A<a href="https://zilliz.com/customers/read-ai"><strong>Read AI</strong></a>, uma das empresas de IA de produtividade de crescimento mais rápido que serve milhões de utilizadores activos mensais, utiliza a Milvus para obter uma latência de recuperação inferior a 20-50ms em milhares de milhões de registos e uma aceleração de 5× na pesquisa agêntica. O seu CTO afirma: "A Milvus serve como repositório central e potencia a nossa recuperação de informações entre milhares de milhões de registos."</p>
<p><a href="https://zilliz.com/customers/global-fintech-leader"><strong>Um líder global de fintech</strong></a>, uma das maiores plataformas de pagamento digital do mundo, que processa dezenas de milhares de milhões de transacções em mais de 200 países e mais de 25 moedas, escolheu a Milvus para uma ingestão de lotes 5-10× mais rápida do que os concorrentes, completando trabalhos em menos de 1 hora que outros demoravam mais de 8 horas.</p>
<p>A<a href="https://zilliz.com/customers/filevine"><strong>Filevine</strong></a>, a principal plataforma de trabalho jurídico em que confiam milhares de escritórios de advogados nos Estados Unidos, gere 3 mil milhões de vectores em milhões de documentos jurídicos, poupando aos advogados 60-80% do tempo de análise de documentos e alcançando uma "verdadeira consciência dos dados" para a gestão de processos jurídicos.</p>
<p>Também estamos a apoiar a <strong>NVIDIA, a OpenAI, a Microsoft, a Salesforce, a Walmart</strong> e muitas outras empresas de quase todos os sectores. Mais de 10.000 organizações fizeram do Milvus ou do Zilliz Cloud a sua base de dados vetorial de eleição.</p>
<p>Estas não são apenas histórias de sucesso técnico - são exemplos de como as bases de dados vectoriais estão a tornar-se discretamente infra-estruturas críticas que alimentam as aplicações de IA que as pessoas utilizam todos os dias.</p>
<h2 id="Why-We-Built-Zilliz-Cloud-Enterprise-Grade-Vector-Database-as-a-Service" class="common-anchor-header">Por que criamos o Zilliz Cloud: Base de dados vetorial de nível empresarial como um serviço<button data-href="#Why-We-Built-Zilliz-Cloud-Enterprise-Grade-Vector-Database-as-a-Service" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus é open-source e de utilização gratuita. Mas o bom funcionamento do Milvus à escala empresarial requer um profundo conhecimento e recursos significativos. Seleção de índices, gestão de memória, estratégias de escalabilidade, configurações de segurança - estas não são decisões triviais. Muitas equipas querem o poder do Milvus sem a complexidade operacional e com suporte empresarial, garantias de SLA, etc.</p>
<p>É por isso que criámos <a href="https://zilliz.com/cloud">o Zilliz Cloud - uma</a>versão totalmente gerida do Milvus implementada em 25 regiões globais e 5 nuvens principais, incluindo AWS, GCP e Azure, concebida especificamente para cargas de trabalho de IA à escala empresarial que exigem desempenho, segurança e fiabilidade.</p>
<p>Aqui está o que torna o Zilliz Cloud diferente:</p>
<ul>
<li><p><strong>Escala massiva com alto desempenho:</strong> O nosso motor AutoIndex, alimentado por IA, proporciona velocidades de consulta 3-5× mais rápidas do que o Milvus de código aberto, sem necessidade de afinação de índices. A arquitetura nativa da nuvem suporta bilhões de vetores e dezenas de milhares de consultas simultâneas, mantendo tempos de resposta inferiores a um segundo.</p></li>
<li><p><a href="https://zilliz.com/trust-center"><strong>Segurança e conformidade incorporadas</strong></a><strong>:</strong> Criptografia em repouso e em trânsito, RBAC refinado, registro de auditoria abrangente, integração SAML/OAuth2.0 e implantações <a href="https://zilliz.com/bring-your-own-cloud">BYOC</a> (traga sua própria nuvem). Estamos em conformidade com o GDPR, HIPAA e outros padrões globais que as empresas realmente precisam.</p></li>
<li><p><strong>Otimizado para eficiência de custos:</strong> O armazenamento de dados quente/frio em camadas, o dimensionamento elástico que responde a cargas de trabalho reais e o preço de pagamento conforme o uso podem reduzir o custo total de propriedade em 50% ou mais em comparação com implantações autogerenciadas.</p></li>
<li><p><strong>Verdadeiramente independente da nuvem, sem dependência de fornecedor:</strong> Implante no AWS, Azure, GCP, Alibaba Cloud ou Tencent Cloud sem dependência de fornecedor. Garantimos a consistência e a escalabilidade globais, independentemente de onde você executa.</p></li>
</ul>
<p>Esses recursos podem não parecer chamativos, mas resolvem problemas reais e diários que as equipes corporativas enfrentam ao criar aplicativos de IA em escala. E o mais importante: ainda é Milvus por baixo do capô, então não há problemas de compatibilidade ou bloqueio de propriedade.</p>
<h2 id="Whats-Next-Vector-Data-Lake" class="common-anchor-header">O que vem a seguir: Lago de dados vetoriais<button data-href="#Whats-Next-Vector-Data-Lake" class="anchor-icon" translate="no">
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
    </button></h2><p>Criamos o termo &quot;<a href="https://zilliz.com/learn/what-is-vector-database">banco de dados vetorial</a>&quot; e fomos os primeiros a construir um, mas não paramos por aí. Estamos agora a construir a próxima evolução: <strong>Vetor Data Lake.</strong></p>
<p><strong>Eis o problema que estamos a resolver: nem todas as pesquisas vectoriais necessitam de uma latência de milissegundos.</strong> Muitas empresas têm conjuntos de dados enormes que são consultados ocasionalmente, incluindo análise de documentos históricos, cálculos de similaridade em lote e análise de tendências de longo prazo. Para esses casos de uso, um banco de dados vetorial tradicional em tempo real é excessivo e caro.</p>
<p>O Vetor Data Lake usa uma arquitetura separada de armazenamento e computação especificamente otimizada para vetores em grande escala e acessados com pouca frequência, mantendo os custos drasticamente mais baixos do que os sistemas em tempo real.</p>
<p><strong>Os principais recursos incluem:</strong></p>
<ul>
<li><p><strong>Pilha de dados unificada:</strong> Conecta perfeitamente camadas de dados online e offline com formatos consistentes e armazenamento eficiente, para que seja possível mover dados entre camadas quentes e frias sem reformatação ou migrações complexas.</p></li>
<li><p><strong>Ecossistema de computação compatível:</strong> Funciona nativamente com estruturas como Spark e Ray, suportando tudo, desde pesquisa vetorial até ETL e análise tradicionais. Isto significa que as suas equipas de dados existentes podem trabalhar com dados vectoriais utilizando ferramentas que já conhecem.</p></li>
<li><p><strong>Arquitetura com custo otimizado:</strong> Os dados quentes permanecem no SSD ou NVMe para acesso rápido; os dados frios são movidos automaticamente para o armazenamento de objetos, como o S3. A indexação inteligente e as estratégias de armazenamento mantêm a E/S rápida quando é necessária, tornando os custos de armazenamento previsíveis e acessíveis.</p></li>
</ul>
<p>Não se trata de substituir os bancos de dados vetoriais - trata-se de oferecer às empresas a ferramenta certa para cada carga de trabalho. Pesquisa em tempo real para aplicações orientadas para o utilizador, lagos de dados vectoriais rentáveis para análise e processamento de histórico.</p>
<p>Continuamos a acreditar na lógica subjacente à Lei de Moore e ao Paradoxo de Jevons: à medida que o custo unitário da computação diminui, a adoção aumenta. O mesmo se aplica à infraestrutura vetorial.</p>
<p>Ao melhorar os índices, as estruturas de armazenamento, o armazenamento em cache e os modelos de implementação - dia após dia - esperamos tornar a infraestrutura de IA mais acessível e económica para todos e ajudar a trazer os dados não estruturados para o futuro nativo da IA.</p>
<h2 id="A-Big-Thanks-to-You-All" class="common-anchor-header">Um grande obrigado a todos vós!<button data-href="#A-Big-Thanks-to-You-All" class="anchor-icon" translate="no">
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
    </button></h2><p>Estas mais de 35K estrelas representam algo de que estamos genuinamente orgulhosos: uma comunidade de programadores que consideram o Milvus suficientemente útil para recomendar e contribuir.</p>
<p>Mas nós ainda não terminamos. O Milvus tem bugs para corrigir, melhorias de performance para fazer, e funcionalidades que a nossa comunidade tem vindo a pedir. O nosso roteiro é público, e queremos genuinamente a sua opinião sobre o que deve ser priorizado.</p>
<p>O número em si não é o que importa - é a confiança que essas estrelas representam. Confiança de que continuaremos a construir abertamente, continuaremos a ouvir o feedback e continuaremos a tornar o Milvus melhor.</p>
<ul>
<li><p><strong>Para os nossos contribuidores:</strong> os vossos PRs, relatórios de bugs, e melhorias na documentação tornam o Milvus melhor todos os dias. Muito obrigado.</p></li>
<li><p><strong>Aos nossos utilizadores:</strong> obrigado por confiarem em nós as suas cargas de trabalho de produção e pelo feedback que nos mantém honestos.</p></li>
<li><p><strong>À nossa comunidade:</strong> obrigado por responder a perguntas, organizar eventos e ajudar os recém-chegados a começar.</p></li>
</ul>
<p>Se é novo nas bases de dados vectoriais, gostaríamos de o ajudar a começar. Se já está a utilizar o Milvus ou o Zilliz Cloud, gostaríamos de <a href="https://zilliz.com/share-your-story">conhecer a sua experiência</a>. E se estiver apenas curioso sobre o que estamos a construir, os nossos canais da comunidade estão sempre abertos.</p>
<p>Vamos continuar a construir a infraestrutura que torna as aplicações de IA possíveis - juntos.</p>
<hr>
<p>Encontre-nos aqui: <a href="https://github.com/milvus-io/milvus">Milvus no GitHub</a> |<a href="https://zilliz.com/"> Zilliz Cloud</a> |<a href="https://discuss.milvus.io/"> Discord</a> | <a href="https://www.linkedin.com/company/the-milvus-project/">LinkedIn</a> | <a href="https://x.com/zilliz_universe">X</a> | <a href="https://www.youtube.com/@MilvusVectorDatabase/featured">YouTube</a></p>
<p><a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour?__hstc=175614333.dc4bcf53f6c7d650ea8978dcdb9e7009.1727350436713.1751017913702.1751029841530.667&amp;__hssc=175614333.3.1751029841530&amp;__hsfp=3554976067">
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/office_hour_4fb9130a9b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</a></p>
