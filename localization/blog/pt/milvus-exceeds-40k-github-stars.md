---
id: milvus-exceeds-40k-github-stars.md
title: >-
  7 anos, 2 grandes reconstruções, mais de 40 mil estrelas no GitHub: A ascensão
  do Milvus como a principal base de dados vetorial de código aberto
author: Fendy Feng
date: 2025-12-02T00:00:00.000Z
cover: assets.zilliz.com/star_history_3dfceda40f.png
tag: announcements
recommend: true
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, vector database'
meta_title: >
  7 Years, 2 Major Rebuilds, 40K+ GitHub Stars: The Rise of Milvus as the
  Leading Open-Source Vector Database
desc: >-
  Comemorando a jornada de 7 anos da Milvus para se tornar a principal base de
  dados vetorial de código aberto do mundo
origin: 'https://milvus.io/blog/milvus-exceeds-40k-github-stars.md'
---
<p>Em junho de 2025, o Milvus atingiu 35.000 estrelas no GitHub. Alguns meses depois, já ultrapassámos <a href="https://github.com/milvus-io/milvus">as 40.000, o que prova</a>não só a dinâmica, mas também uma comunidade global que continua a impulsionar o futuro da pesquisa vetorial e multimodal.</p>
<p>Estamos profundamente gratos. A todos os que fizeram estrelas, bifurcaram, apresentaram problemas, discutiram sobre uma API, partilharam um benchmark, ou construíram algo incrível com o Milvus: <strong>Obrigado, e vocês são a razão pela qual este projeto se move tão rapidamente como o faz</strong>. Cada estrela representa mais do que um botão premido - reflecte alguém que escolheu o Milvus para impulsionar o seu trabalho, alguém que acredita no que estamos a construir, alguém que partilha a nossa visão de uma infraestrutura de IA aberta, acessível e de alto desempenho.</p>
<p>Por isso, enquanto celebramos, também estamos a olhar para o futuro - para as funcionalidades que pedem, para as arquitecturas que a IA exige agora e para um mundo onde a compreensão multimodal e semântica é o padrão em todas as aplicações.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/star_history_3dfceda40f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="The-Journey-From-Zero-to-40000+-Stars" class="common-anchor-header">A viagem: De zero a mais de 40.000 estrelas<button data-href="#The-Journey-From-Zero-to-40000+-Stars" class="anchor-icon" translate="no">
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
    </button></h2><p>Quando começámos a construir a Milvus em 2017, o termo <em>base de dados vetorial</em> nem sequer existia. Éramos apenas uma pequena equipa de engenheiros convencidos de que as aplicações de IA precisariam em breve de um novo tipo de infraestrutura de dados - uma infraestrutura criada não para linhas e colunas, mas para dados multidimensionais, não estruturados e multimodais. As bases de dados tradicionais não foram criadas para esse mundo e sabíamos que alguém tinha de reimaginar como seria o armazenamento e a recuperação.</p>
<p>Os primeiros tempos estavam longe de ser glamorosos. Construir uma infraestrutura de nível empresarial é um trabalho lento e teimoso - semanas passadas a traçar perfis de caminhos de código, a reescrever componentes e a questionar as escolhas de design às 2 da manhã. Mas mantivemos uma missão simples: <strong>tornar a pesquisa vetorial acessível, escalável e fiável para todos os programadores que criam aplicações de IA</strong>. Essa missão levou-nos às primeiras descobertas e aos inevitáveis contratempos.</p>
<p>E, ao longo do caminho, alguns pontos de viragem mudaram tudo:</p>
<ul>
<li><p><strong>2019:</strong> Abrimos o código aberto do Milvus 0.10. Isso significava expor todas as nossas arestas - os hacks, os TODOs, as peças das quais ainda não estávamos orgulhosos. Mas a comunidade apareceu. Os desenvolvedores apresentaram problemas que nunca teríamos encontrado, propuseram recursos que não havíamos imaginado e desafiaram suposições que acabaram por tornar o Milvus mais forte.</p></li>
<li><p><strong>2020-2021:</strong> Entramos para a LF <a href="https://lfaidata.foundation/projects/milvus/">AI &amp; Data Foundation</a>, enviamos o Milvus 1.0, nos formamos na LF AI &amp; Data e vencemos o desafio de pesquisa vetorial em escala de bilhões <a href="https://big-ann-benchmarks.com/neurips21.html">da BigANN</a> - uma prova precoce de que nossa arquitetura poderia lidar com a escala do mundo real.</p></li>
<li><p><strong>2022:</strong> Os utilizadores empresariais precisavam de escalabilidade nativa do Kubernetes, elasticidade e separação real de armazenamento e computação. Enfrentamos uma decisão difícil: corrigir o sistema antigo ou reconstruir tudo. Escolhemos o caminho mais difícil. <strong>O Milvus 2.0 foi uma reinvenção completa</strong>, introduzindo uma arquitetura nativa da nuvem totalmente desacoplada que transformou o Milvus em uma plataforma de nível de produção para cargas de trabalho de IA de missão crítica.</p></li>
<li><p><strong>2024-2025:</strong> <a href="https://zilliz.com/">A Zilliz</a> (a equipa por detrás do Milvus) foi nomeada <a href="https://zilliz.com/resources/analyst-report/zilliz-forrester-wave-vector-database-report">líder pela Forrester</a>, ultrapassou as 30.000 estrelas e está agora acima das 40.000. Tornou-se a espinha dorsal da pesquisa multimodal, dos sistemas RAG, dos fluxos de trabalho agênticos e da recuperação à escala de milhares de milhões em todos os sectores - educação, finanças, produção criativa, investigação científica e muito mais.</p></li>
</ul>
<p>Este marco não foi conquistado através de propaganda, mas através de programadores que escolheram o Milvus para cargas de trabalho de produção reais e que nos incentivaram a melhorar a cada passo do caminho.</p>
<h2 id="2025-Two-Major-Releases-Massive-Performance-Gains" class="common-anchor-header">2025: Dois lançamentos principais, ganhos maciços de desempenho<button data-href="#2025-Two-Major-Releases-Massive-Performance-Gains" class="anchor-icon" translate="no">
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
    </button></h2><p>2025 foi o ano em que o Milvus entrou numa nova liga. Embora a pesquisa vetorial se destaque na compreensão semântica, a realidade na produção é simples: <strong>os desenvolvedores ainda precisam de correspondência precisa de palavras-chave</strong> para IDs de produtos, números de série, frases exatas, termos legais e muito mais. Sem a pesquisa de texto completo nativa, as equipas eram forçadas a manter clusters Elasticsearch/OpenSearch ou a juntar as suas próprias soluções personalizadas - duplicando a sobrecarga operacional e a fragmentação.</p>
<p><a href="https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md"><strong>O Milvus 2.5</strong></a> <strong>mudou isso</strong>. Ele introduziu <strong>a pesquisa híbrida verdadeiramente nativa</strong>, combinando a recuperação de texto completo e a pesquisa vetorial em um único mecanismo. Pela primeira vez, os programadores puderam executar consultas lexicais, consultas semânticas e filtros de metadados em conjunto, sem terem de fazer malabarismos com sistemas adicionais ou sincronizar condutas. Também actualizámos a filtragem de metadados, a análise de expressões e a eficiência de execução, para que as consultas híbridas parecessem naturais - e rápidas - sob cargas de produção reais.</p>
<p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><strong>O Milvus 2.6</strong></a> <strong>impulsionou ainda mais essa dinâmica</strong>, visando os dois desafios que ouvimos com mais frequência dos usuários que executam em escala: <strong><em>custo</em> e <em>desempenho</em>.</strong> Esta versão proporcionou melhorias profundas na arquitetura - caminhos de consulta mais previsíveis, indexação mais rápida, utilização de memória drasticamente inferior e armazenamento significativamente mais eficiente. Muitas equipas relataram ganhos imediatos sem alterar uma única linha de código da aplicação.</p>
<p>Aqui estão apenas alguns destaques do Milvus 2.6:</p>
<ul>
<li><p><a href="https://milvus.io/docs/tiered-storage-overview.md"><strong>Armazenamento em camadas</strong></a> que permite às equipas equilibrar o custo e o desempenho de forma mais inteligente, reduzindo os custos de armazenamento até 50%.</p></li>
<li><p><strong>Enorme economia de memória</strong> por meio da <a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">quantização de 1 bit RaBitQ</a> - reduzindo o uso de memória em até 72% e ainda fornecendo consultas mais rápidas.</p></li>
<li><p><a href="https://milvus.io/docs/full-text-search.md"><strong>Um mecanismo de texto completo redesenhado</strong></a> com uma implementação BM25 significativamente mais rápida - até 4 vezes mais rápido que o Elasticsearch em nossos benchmarks.</p></li>
<li><p><strong>Um novo Path Index</strong> para <a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">metadados estruturados em JSON</a>, desbloqueando uma filtragem até 100 vezes mais rápida em documentos complexos.</p></li>
<li><p><a href="https://milvus.io/docs/aisaq.md"><strong>AiSAQ</strong>:</a> compactação em escala de bilhões com redução de armazenamento de 3200× e forte recall</p></li>
<li><p><a href="https://milvus.io/docs/geometry-operators.md"><strong>Pesquisa</strong></a><strong>semântica +</strong> <a href="https://milvus.io/docs/geometry-operators.md"><strong>geoespacial</strong></a> <strong>com R-Tree:</strong> Combinando <em>onde as coisas estão</em> com o <em>que significam</em> para obter resultados mais relevantes</p></li>
<li><p><a href="https://zilliz.com/blog/Milvus-introduces-GPU-index-CAGRA"><strong>CAGRA + Vamana</strong></a><strong>:</strong> Reduz o custo de implementação com um modo CAGRA híbrido que se baseia na GPU mas consulta na CPU</p></li>
<li><p><strong>Um</strong><strong>fluxo de trabalho</strong><strong>"</strong><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md"><strong>data in, data out</strong></a><strong>"</strong> que simplifica a ingestão e a recuperação de incorporação, especialmente para pipelines multimodais.</p></li>
<li><p><strong>Suporte para até 100 mil coleções</strong> em um único cluster - um grande passo em direção ao verdadeiro multi-tenancy em escala.</p></li>
</ul>
<p>Para uma análise mais aprofundada do Milvus 2.6, consulte <a href="https://milvus.io/docs/release_notes.md">as notas de lançamento completas</a>.</p>
<h2 id="Beyond-Milvus-Open-Source-Tools-for-AI-Developers" class="common-anchor-header">Além do Milvus: ferramentas de código aberto para desenvolvedores de IA<button data-href="#Beyond-Milvus-Open-Source-Tools-for-AI-Developers" class="anchor-icon" translate="no">
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
    </button></h2><p>Em 2025, não nos limitámos a melhorar o Milvus - criámos ferramentas que reforçam todo o ecossistema de programadores de IA. Nosso objetivo não era perseguir tendências, mas dar aos construtores o tipo de ferramentas abertas, poderosas e transparentes que sempre desejamos que existissem.</p>
<h3 id="DeepSearcher-Research-Without-Cloud-Lock-In" class="common-anchor-header">DeepSearcher: Pesquisa sem bloqueio de nuvem</h3><p>O Deep Researcher da OpenAI provou o que os agentes de raciocínio profundo podem fazer. Mas ele é fechado, caro e bloqueado por APIs em nuvem. <a href="https://github.com/zilliztech/deep-searcher"><strong>O DeepSearcher</strong></a> <strong>é a nossa resposta.</strong> É um mecanismo de pesquisa profunda local e de código aberto projetado para qualquer pessoa que queira investigações estruturadas sem sacrificar o controle ou a privacidade.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepsearcher_5cf6a4f0dc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>O DeepSearcher é executado inteiramente em sua máquina, reunindo informações de várias fontes, sintetizando insights e fornecendo citações, etapas de raciocínio e rastreabilidade - recursos essenciais para pesquisas reais, não apenas resumos de nível superficial. Sem caixas negras. Sem dependência de fornecedores. Apenas análises transparentes e reproduzíveis em que os programadores e investigadores podem confiar.</p>
<h3 id="Claude-Context-Coding-Assistants-That-Actually-Understand-Your-Code" class="common-anchor-header">Contexto de Claude: Assistentes de codificação que realmente entendem seu código</h3><p>A maioria das ferramentas de codificação de IA ainda se comporta como pipelines grep sofisticados - rápidos, superficiais, com queima de tokens e alheios à estrutura real do projeto. <a href="https://github.com/zilliztech/claude-context"><strong>Claude Context</strong></a> **** muda isso. Construído como um plugin MCP, ele finalmente dá aos assistentes de codificação o que eles têm perdido: compreensão semântica genuína de sua base de código.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_context_7f608a153d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>O Claude Context constrói um índice semântico vetorial em todo o seu projeto, permitindo que os agentes encontrem os módulos certos, sigam as relações entre os arquivos, entendam a intenção no nível da arquitetura e respondam às perguntas com relevância em vez de adivinhação. Reduz o desperdício de tokens, aumenta a precisão e, o mais importante, permite que os assistentes de codificação se comportem como se compreendessem verdadeiramente o seu software, em vez de o fingirem.</p>
<p>Ambas as ferramentas são totalmente de código aberto. Porque a infraestrutura de IA deve pertencer a todos - e porque o futuro da IA não deve ficar trancado atrás de paredes proprietárias.</p>
<h2 id="Trusted-by-10000+-Teams-in-Production" class="common-anchor-header">Com a confiança de mais de 10.000 equipas em produção<button data-href="#Trusted-by-10000+-Teams-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Atualmente, mais de 10.000 equipas empresariais utilizam o Milvus na produção - desde startups em rápido crescimento a algumas das empresas tecnológicas mais estabelecidas do mundo e empresas da Fortune 500. As equipas da NVIDIA, Salesforce, eBay, Airbnb, IBM, AT&amp;T, LINE, Shopee, Roblox, Bosch e da Microsoft confiam no Milvus para alimentar sistemas de IA que funcionam a cada minuto de cada dia. As suas cargas de trabalho abrangem pesquisa, recomendações, pipelines agênticos, recuperação multimodal e outras aplicações que levam a infraestrutura de vectores aos seus limites.</p>
<p><a href="https://assets.zilliz.com/logos_eb0d3ad4af.png"></a></p>
<p>Mas o mais importante não é apenas <em>quem</em> usa o Milvus - é <em>o que eles estão construindo com ele</em>. Em todos os sectores, o Milvus está por detrás de sistemas que moldam a forma como as empresas operam, inovam e competem:</p>
<ul>
<li><p><strong>Co-pilotos de IA e assistentes empresariais</strong> que melhoram o apoio ao cliente, os fluxos de trabalho de vendas e a tomada de decisões internas com acesso instantâneo a milhares de milhões de incorporados.</p></li>
<li><p><strong>Pesquisa semântica e visual no comércio eletrónico, nos meios de comunicação social e na publicidade</strong>, que conduz a uma maior conversão, a uma melhor descoberta e a uma produção criativa mais rápida.</p></li>
<li><p><strong>Plataformas de inteligência jurídica, financeira e científica</strong> em que a precisão, a auditabilidade e a conformidade se traduzem em ganhos operacionais reais.</p></li>
<li><p><strong>Mecanismos de deteção de fraude e risco</strong> em fintech e banca que dependem da correspondência semântica rápida para evitar perdas em tempo real.</p></li>
<li><p><strong>RAG em grande escala e sistemas agênticos</strong> que dão às equipas um comportamento de IA profundamente contextual e sensível ao domínio.</p></li>
<li><p><strong>Camadas de conhecimento empresarial</strong> que unificam texto, código, imagens e metadados num tecido semântico coerente.</p></li>
</ul>
<p>E estes não são benchmarks de laboratório - são algumas das implementações de produção mais exigentes do mundo. O Milvus cumpre rotineiramente:</p>
<ul>
<li><p>Recuperação abaixo de 50 ms em bilhões de vetores</p></li>
<li><p>Biliões de documentos e eventos geridos num único sistema</p></li>
<li><p>Fluxos de trabalho 5-10× mais rápidos do que as soluções alternativas</p></li>
<li><p>Arquitecturas multi-tenant que suportam centenas de milhares de colecções</p></li>
</ul>
<p>As equipas escolhem a Milvus por uma razão simples: a Milvus <strong>fornece resultados onde é importante - velocidade, fiabilidade, eficiência de custos e a capacidade de escalar para milhares de milhões sem ter de desmontar a sua arquitetura de tempos a tempos.</strong> A confiança que estas equipas depositam em nós é a razão pela qual continuamos a reforçar o Milvus para a década de IA que se avizinha.</p>
<p><a href="https://zilliz.com/share-your-story">
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/share_your_story_3c44c533ed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</a></p>
<h2 id="When-You-Need-Milvus-Without-the-Ops-Zilliz-Cloud" class="common-anchor-header">Quando precisa do Milvus sem as operações: Zilliz Cloud<button data-href="#When-You-Need-Milvus-Without-the-Ops-Zilliz-Cloud" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus é gratuito, poderoso e testado em combate. Mas também é um sistema distribuído - e executar bem sistemas distribuídos é um verdadeiro trabalho de engenharia. Ajuste de índices, gestão de memória, estabilidade do cluster, escalonamento, observabilidade... estas tarefas requerem tempo e experiência que muitas equipas simplesmente não têm para dispensar. Os programadores queriam o poder do Milvus, mas sem o peso operacional que inevitavelmente advém da sua gestão à escala.</p>
<p>Esta realidade levou-nos a uma conclusão simples: se o Milvus se ia tornar a infraestrutura central das aplicações de IA, precisávamos de o tornar fácil de operar. Foi por isso que criámos <a href="https://zilliz.com/cloud"><strong>o Zilliz Cloud</strong></a>, o serviço Milvus totalmente gerido, criado e mantido pela mesma equipa por detrás do projeto de código aberto.</p>
<p>O Zilliz Cloud dá aos programadores o Milvus que já conhecem e em que confiam - mas sem provisionar clusters, combater problemas de desempenho, planear actualizações ou preocupar-se com o armazenamento e a afinação da computação. E como inclui optimizações impossíveis de executar em ambientes auto-geridos, é ainda mais rápido e fiável. O <a href="https://zilliz.com/blog/cardinal-most-performant-vector-search-engine">Cardinal</a>, o nosso motor vetorial de otimização automática de nível comercial, oferece 10× o desempenho do <strong>Milvus de código aberto</strong>.</p>
<p><strong>O que distingue o Zilliz Cloud</strong></p>
<ul>
<li><strong>Desempenho auto-otimizado:</strong> O AutoIndex ajusta automaticamente o HNSW, o IVF e o DiskANN, proporcionando uma recuperação de mais de 96% com nenhuma configuração manual.</li>
</ul>
<ul>
<li><p><strong>Elástico e económico:</strong> O preço pago conforme o uso, o dimensionamento automático sem servidor e o gerenciamento inteligente de recursos geralmente reduzem os custos em 50% ou mais em comparação com implantações autogerenciadas.</p></li>
<li><p><strong>Confiabilidade de nível empresarial:</strong> SLA de 99,95% de tempo de atividade, redundância multi-AZ, conformidade com SOC 2 Tipo II, ISO 27001 e GDPR. Suporte completo para RBAC, BYOC, registos de auditoria e encriptação.</p></li>
<li><p><strong>Implantação independente de nuvem:</strong> Execute no AWS, Azure, GCP, Alibaba Cloud ou Tencent Cloud - sem dependência de fornecedor, desempenho consistente em qualquer lugar.</p></li>
<li><p><strong>Consultas em linguagem natural:</strong> O suporte integrado ao servidor MCP permite consultar dados de forma conversacional em vez de criar manualmente chamadas de API.</p></li>
<li><p><strong>Migração sem esforço</strong>: Migre do Milvus, Pinecone, Qdrant, Weaviate, Elasticsearch ou PostgreSQL usando ferramentas de migração integradas - sem necessidade de reescrita de esquemas ou tempo de inatividade.</p></li>
<li><p><strong>100% compatível com o Milvus de código aberto.</strong> Sem bifurcações proprietárias. Sem bloqueio. Apenas Milvus, tornado mais fácil.</p></li>
</ul>
<p><strong>O Milvus permanecerá sempre de código aberto e de utilização gratuita.</strong> Mas a sua execução e operação fiável à escala empresarial requerem conhecimentos e recursos significativos. <strong>Zilliz Cloud é a nossa resposta a essa lacuna</strong>. Implementado em 29 regiões e em cinco grandes clouds, o Zilliz Cloud oferece desempenho, segurança e eficiência de custos de nível empresarial, mantendo-o completamente alinhado com o Milvus que já conhece.</p>
<p><a href="https://cloud.zilliz.com/signup"><strong>Iniciar teste gratuito →</strong></a></p>
<h2 id="Whats-Next-Milvus-Lake" class="common-anchor-header">O que vem a seguir: Milvus Lake<button data-href="#Whats-Next-Milvus-Lake" class="anchor-icon" translate="no">
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
    </button></h2><p>Como a equipa que introduziu a base de dados vetorial, tivemos um lugar na primeira fila para ver como os dados empresariais estão a mudar. O que antes se encaixava perfeitamente em terabytes de tabelas estruturadas está rapidamente a transformar-se em petabytes - e em breve triliões - de objectos multimodais. Texto, imagens, áudio, vídeo, fluxos de séries temporais, registos de vários sensores... estes definem agora os conjuntos de dados em que os sistemas de IA modernos se baseiam.</p>
<p>As bases de dados vectoriais são concebidas especificamente para dados não estruturados e multimodais, mas nem sempre são a escolha mais económica ou arquitetonicamente sólida - especialmente quando a grande maioria dos dados é fria. Os corpora de treino para grandes modelos, os registos de perceção de condução autónoma e os conjuntos de dados de robótica normalmente não requerem latência ao nível dos milissegundos ou elevada concorrência. A execução deste volume de dados através de uma base de dados vetorial em tempo real torna-se dispendiosa, operacionalmente pesada e excessivamente complexa para pipelines que não requerem esse nível de desempenho.</p>
<p>Essa realidade nos levou à nossa próxima grande iniciativa: <strong>Milvus Lake - um</strong>lakehouse multimodal orientado por semântica e que prioriza o índice, projetado para dados em escala de IA. O Milvus Lake unifica sinais semânticos em todas as modalidades - vetores, metadados, rótulos, descrições geradas pelo LLM e campos estruturados - e os organiza em <strong>Semantic Wide Tables</strong> ancoradas em entidades comerciais reais. Os dados que anteriormente viviam como ficheiros brutos e dispersos no armazenamento de objectos, lakehouses e pipelines de modelos tornam-se uma camada semântica unificada e consultável. Corpora multimodais maciços transformam-se em activos geríveis, recuperáveis e reutilizáveis com um significado consistente em toda a empresa.</p>
<p>O Milvus Lake é construído com base numa arquitetura limpa de <strong>manifesto + dados + índice</strong> que trata a indexação como fundamental e não como uma reflexão posterior. Isso desbloqueia um fluxo de trabalho "recuperar primeiro, processar depois" otimizado para dados frios em escala trilionária - oferecendo latência previsível, custos de armazenamento drasticamente menores e estabilidade operacional muito maior. Uma abordagem de armazenamento em camadas - NVMe/SSD para caminhos quentes e armazenamento de objectos para arquivos profundos - combinada com uma compressão eficiente e índices de carga lenta preserva a fidelidade semântica, mantendo a sobrecarga da infraestrutura firmemente sob controlo.</p>
<p>O Milvus Lake também se conecta perfeitamente ao ecossistema de dados modernos, integrando-se com Paimon, Iceberg, Hudi, Spark, Ray e outros mecanismos e formatos de big data. As equipas podem executar o processamento em lote, pipelines quase em tempo real, recuperação semântica, engenharia de caraterísticas e preparação de dados de formação, tudo num único local - sem reformular os fluxos de trabalho existentes. Quer esteja a construir corpora de modelos de base, a gerir bibliotecas de simulações de condução autónoma, a treinar agentes de robótica ou a alimentar sistemas de recuperação em grande escala, o Milvus Lake fornece um lago semântico extensível e económico para a era da IA.</p>
<p><strong>O Milvus Lake está em desenvolvimento ativo.</strong> Interessado no acesso antecipado ou quer saber mais?<a href="https://zilliz.com/contact"> </a></p>
<p><a href="https://zilliz.com/contact-sales"><strong>Contacte-nos →</strong></a></p>
<h2 id="Built-by-the-Community-For-the-Community" class="common-anchor-header">Construído pela comunidade, para a comunidade<button data-href="#Built-by-the-Community-For-the-Community" class="anchor-icon" translate="no">
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
    </button></h2><p>O que torna Milvus especial não é apenas a tecnologia - são as pessoas por trás dela. A nossa base de colaboradores abrange todo o mundo, reunindo especialistas em computação de alto desempenho, sistemas distribuídos e infra-estruturas de IA. Engenheiros e investigadores da ARM, NVIDIA, AMD, Intel, Meta, IBM, Salesforce, Alibaba, Microsoft e muitos outros contribuíram com os seus conhecimentos para transformar o Milvus naquilo que é hoje.</p>
<p>Cada pull request, cada relatório de bug, cada pergunta respondida em nossos fóruns, cada tutorial criado - essas contribuições tornam o Milvus melhor para todos.</p>
<p>Este marco pertence a todos vós:</p>
<ul>
<li><p><strong>Aos nossos contribuidores</strong>: Obrigado pelo vosso código, pelas vossas ideias e pelo vosso tempo. Vocês tornam o Milvus melhor todos os dias.</p></li>
<li><p><strong>Aos nossos utilizadores</strong>: Obrigado por confiarem ao Milvus as vossas cargas de trabalho de produção e por partilharem as vossas experiências, tanto as boas como as difíceis. Os vossos comentários orientam o nosso roteiro.</p></li>
<li><p><strong>Aos apoiantes da nossa comunidade</strong>: Obrigado por responderem a perguntas, escreverem tutoriais, criarem conteúdos e ajudarem os recém-chegados a começar. Vocês tornam a nossa comunidade acolhedora e inclusiva.</p></li>
<li><p><strong>Aos nossos parceiros e integradores</strong>: Obrigado por construírem connosco e fazerem do Milvus um cidadão de primeira classe no ecossistema de desenvolvimento de IA.</p></li>
<li><p><strong>À equipa Zilliz</strong>: Obrigado pelo vosso empenho inabalável no projeto open-source e no sucesso dos nossos utilizadores.</p></li>
</ul>
<p>O Milvus cresceu porque milhares de pessoas decidiram construir algo em conjunto - de forma aberta, generosa e com a convicção de que a infraestrutura fundamental de IA deve ser acessível a todos.</p>
<h2 id="Join-Us-on-This-Journey" class="common-anchor-header">Junte-se a nós nesta jornada<button data-href="#Join-Us-on-This-Journey" class="anchor-icon" translate="no">
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
    </button></h2><p>Quer esteja a construir a sua primeira aplicação de pesquisa vetorial ou a escalar para milhares de milhões de vectores, gostaríamos de o ter como parte da comunidade Milvus.</p>
<p><strong>Começar</strong>:</p>
<ul>
<li><p><strong>⭐ Inscreva-nos no GitHub</strong>:<a href="https://github.com/milvus-io/milvus"> github.com/milvus-io/milvus</a></p></li>
<li><p>☁️ <strong>Experimente o Zilliz Cloud gratuitamente</strong>:<a href="https://zilliz.com/"> zilliz.com/cloud</a></p></li>
<li><p><strong>Junta-te ao nosso</strong> <a href="https://discord.com/invite/8uyFbECzPX"><strong>Discord</strong></a> para te ligares a programadores de todo o mundo</p></li>
<li><p><strong>Explore os nossos documentos</strong>: <a href="https://milvus.io/docs">Documentação do Milvus</a></p></li>
<li><p><strong>Reserve uma</strong> <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"><strong>sessão individual de 20 minutos</strong></a> para obter informações, orientações e respostas às suas perguntas.</p></li>
</ul>
<p>O caminho que temos pela frente é empolgante. À medida que a IA remodela os setores e abre novas possibilidades, os bancos de dados vetoriais estarão no centro dessa transformação. Juntos, estamos a construir a base semântica da qual dependem as aplicações de IA modernas - e estamos apenas a começar.</p>
<p>Um brinde às próximas 40.000 estrelas e à construção <strong>conjunta</strong> do futuro da infraestrutura de IA. 🎉</p>
