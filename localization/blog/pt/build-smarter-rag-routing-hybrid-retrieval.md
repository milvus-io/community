---
id: build-smarter-rag-routing-hybrid-retrieval.md
title: >-
  Para além da RAG ingénua: construir sistemas mais inteligentes com
  encaminhamento de consultas e recuperação híbrida
author: Min Yin
date: 2026-3-25
cover: assets.zilliz.com/cover_beyond_naive_rag_7db83a08f9.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  RAG architecture, hybrid retrieval, query routing, vector search BM25, RAG
  evaluation
meta_title: |
  Build Smarter RAG with Routing and Hybrid Retrieval
desc: >-
  Saiba como os sistemas RAG modernos utilizam o encaminhamento de consultas, a
  recuperação híbrida e a avaliação faseada para fornecer melhores respostas a
  um custo mais baixo.
origin: 'https://milvus.io/blog/build-smarter-rag-routing-hybrid-retrieval.md'
---
<p>O seu pipeline <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> recupera documentos para cada consulta, independentemente de a recuperação ser necessária. Executa a mesma pesquisa de similaridade em código, linguagem natural e relatórios financeiros. E quando os resultados são maus, não tem forma de saber qual a fase que falhou.</p>
<p>Estes são sintomas de um RAG ingénuo - um pipeline fixo que trata todas as consultas da mesma forma. Os sistemas RAG modernos funcionam de forma diferente. Eles encaminham as consultas para o manipulador correto, combinam vários métodos de recuperação e avaliam cada estágio de forma independente.</p>
<p>Este artigo apresenta uma arquitetura de quatro nós para criar sistemas RAG mais inteligentes, explica como implementar <a href="https://zilliz.com/learn/hybrid-search-a-practical-guide">a recuperação híbrida</a> sem manter índices separados e mostra como avaliar cada estágio do pipeline para que você possa depurar problemas mais rapidamente.</p>
<h2 id="Why-Long-Context-Doesnt-Replace-RAG" class="common-anchor-header">Por que o contexto longo não substitui o RAG<button data-href="#Why-Long-Context-Doesnt-Replace-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>"Basta colocar tudo no prompt" é uma sugestão comum agora que os modelos suportam janelas de token de 128K+. Ela não se sustenta em produção por dois motivos.</p>
<p><strong>O custo é dimensionado com a sua base de conhecimento, não com a sua consulta.</strong> Cada solicitação envia a base de conhecimento completa através do modelo. Para um corpus de 100 mil tokens, são 100 mil tokens de entrada por solicitação - independentemente de a resposta exigir um parágrafo ou dez. Os custos mensais de inferência crescem linearmente com o tamanho do corpus.</p>
<p><strong>A atenção degrada-se com o comprimento do contexto.</strong> Os modelos têm dificuldade em concentrar-se em informação relevante enterrada em contextos longos. A investigação sobre o efeito "lost in the middle" (Liu et al., 2023) mostra que os modelos têm maior probabilidade de perder informação colocada no meio de entradas longas. Janelas de contexto maiores não resolveram este problema - a qualidade da atenção não acompanhou o tamanho da janela.</p>
<p>O RAG evita ambos os problemas, recuperando apenas as passagens relevantes antes da geração. A questão não é se o RAG é necessário - é como construir um RAG que realmente funcione.</p>
<h2 id="Whats-Wrong-with-Traditional-RAG" class="common-anchor-header">O que há de errado com o RAG tradicional?<button data-href="#Whats-Wrong-with-Traditional-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>O RAG tradicional segue um processo fixo: incorporar a consulta, executar <a href="https://zilliz.com/learn/what-is-vector-search">a pesquisa de semelhança vetorial</a>, obter os K resultados principais, gerar uma resposta. Todas as consultas seguem o mesmo caminho.</p>
<p>Isso cria dois problemas:</p>
<ol>
<li><p><strong>Desperdício de computação em consultas triviais.</strong> "O que é 2 + 2?" não precisa de ser recuperado, mas o sistema executa-o na mesma - acrescentando latência e custos sem qualquer benefício.</p></li>
<li><p><strong>Recuperação frágil em consultas complexas.</strong> Frases ambíguas, sinónimos ou consultas em idiomas mistos muitas vezes derrotam a semelhança vetorial pura. Quando a recuperação não atinge documentos relevantes, a qualidade da geração cai sem qualquer alternativa.</p></li>
</ol>
<p>A solução: adicionar a tomada de decisões antes da recuperação. Um sistema RAG moderno decide <em>se</em> deve recuperar, <em>o que</em> procurar e <em>como</em> procurar - em vez de executar cegamente o mesmo pipeline todas as vezes.</p>
<h2 id="How-Modern-RAG-Systems-Work-A-Four-Node-Architecture" class="common-anchor-header">Como funcionam os sistemas RAG modernos: Uma arquitetura de quatro nós<button data-href="#How-Modern-RAG-Systems-Work-A-Four-Node-Architecture" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/build_smarter_rag_routing_hybrid_retrieval_1_058ab7eb6b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Em vez de um pipeline fixo, um sistema RAG moderno encaminha cada consulta através de quatro nós de decisão. Cada nó responde a uma pergunta sobre como lidar com a consulta atual.</p>
<h3 id="Node-1-Query-Routing--Does-This-Query-Need-Retrieval" class="common-anchor-header">Nó 1: Encaminhamento da consulta - Esta consulta precisa de ser recuperada?</h3><p>O encaminhamento da consulta é a primeira decisão no pipeline. Ele classifica a consulta recebida e a envia pelo caminho apropriado:</p>
<table>
<thead>
<tr><th>Tipo de consulta</th><th>Exemplo de consulta</th><th>Ação</th></tr>
</thead>
<tbody>
<tr><td>Senso comum / conhecimento geral</td><td>"O que é 2 + 2?"</td><td>Resposta direta com a recuperação LLM-skip</td></tr>
<tr><td>Pergunta da base de conhecimentos</td><td>"Quais são as especificações do Modelo X?"</td><td>Encaminhar para o pipeline de recuperação</td></tr>
<tr><td>Informação em tempo real</td><td>"Tempo em Paris este fim de semana"</td><td>Chamar uma API externa</td></tr>
</tbody>
</table>
<p>O encaminhamento antecipado evita a recuperação desnecessária para consultas que não precisam dela. Em sistemas onde uma grande parte das consultas são simples ou de conhecimento geral, este facto pode reduzir significativamente os custos de computação.</p>
<h3 id="Node-2-Query-Rewriting--What-Should-the-System-Search-For" class="common-anchor-header">Nó 2: Reescrita de consultas - O que é que o sistema deve procurar?</h3><p>As consultas dos utilizadores são muitas vezes vagas. Uma pergunta como "os principais números do relatório do terceiro trimestre da LightOn" não se traduz bem numa consulta de pesquisa.</p>
<p>A reescrita de consultas transforma a pergunta original em condições de pesquisa estruturadas:</p>
<ul>
<li><strong>Intervalo de tempo:</strong> 1 de julho - 30 de setembro de 2025 (Q3)</li>
<li><strong>Tipo de documento:</strong> Relatório financeiro</li>
<li><strong>Entidade:</strong> LightOn, Departamento Financeiro</li>
</ul>
<p>Esta etapa preenche a lacuna entre a forma como os utilizadores fazem perguntas e como os sistemas de recuperação indexam os documentos. Melhores consultas significam menos resultados irrelevantes.</p>
<h3 id="Node-3-Retrieval-Strategy-Selection--How-Should-the-System-Search" class="common-anchor-header">Nó 3: Seleção da estratégia de pesquisa - Como deve o sistema pesquisar?</h3><p>Diferentes tipos de conteúdo necessitam de diferentes estratégias de pesquisa. Um único método não pode abranger tudo:</p>
<table>
<thead>
<tr><th>Tipo de conteúdo</th><th>Melhor método de pesquisa</th><th>Porquê?</th></tr>
</thead>
<tbody>
<tr><td>Código (nomes de variáveis, assinaturas de funções)</td><td>Pesquisa lexical<a href="https://zilliz.com/learn/mastering-bm25-a-deep-dive-into-the-algorithm-and-application-in-milvus">(BM25</a>)</td><td>A correspondência exacta de palavras-chave funciona bem em tokens estruturados</td></tr>
<tr><td>Linguagem natural (documentos, artigos)</td><td>Pesquisa semântica (vectores densos)</td><td>Lida com sinónimos, paráfrases e intenção</td></tr>
<tr><td>Multimodal (gráficos, diagramas, desenhos)</td><td>Recuperação multimodal</td><td>Captura a estrutura visual que a extração de texto não capta</td></tr>
</tbody>
</table>
<p>Os documentos são etiquetados com metadados aquando da indexação. No momento da consulta, estas etiquetas orientam os documentos a pesquisar e o método de recuperação a utilizar.</p>
<h3 id="Node-4-Minimal-Context-Generation--How-Much-Context-Does-the-Model-Need" class="common-anchor-header">Nó 4: Geração de contexto mínimo - De quanto contexto precisa o modelo?</h3><p>Após a recuperação e <a href="https://zilliz.com/learn/optimize-rag-with-rerankers-the-role-and-tradeoffs">a reclassificação</a>, o sistema envia apenas as passagens mais relevantes para o modelo - não documentos inteiros.</p>
<p>Isto é mais importante do que parece. Em comparação com o carregamento de documentos completos, passar apenas as passagens relevantes pode reduzir a utilização de tokens em mais de 90%. Menores contagens de tokens significam respostas mais rápidas e custos mais baixos, mesmo quando o cache está em jogo.</p>
<h2 id="Why-Hybrid-Retrieval-Matters-for-Enterprise-RAG" class="common-anchor-header">Porque é que a recuperação híbrida é importante para o RAG empresarial<button data-href="#Why-Hybrid-Retrieval-Matters-for-Enterprise-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>Na prática, a seleção da estratégia de recuperação (Nó 3) é onde a maioria das equipas fica bloqueada. Nenhum método de recuperação único abrange todos os tipos de documentos da empresa.</p>
<p>Alguns argumentam que a pesquisa por palavras-chave é suficiente - afinal, a pesquisa de código baseada em grep do Claude Code funciona bem. Mas o código é altamente estruturado, com convenções de nomenclatura consistentes. Os documentos empresariais são uma história diferente.</p>
<h3 id="Enterprise-Documents-Are-Messy" class="common-anchor-header">Os documentos empresariais são confusos</h3><p><strong>Sinónimos e frases variadas.</strong> "Otimizar a utilização da memória" e "reduzir a pegada de memória" significam a mesma coisa mas utilizam palavras diferentes. A pesquisa por palavra-chave corresponde a uma e não encontra a outra. Em ambientes multilingues - chinês com segmentação de palavras, japonês com escrita mista, alemão com palavras compostas - o problema multiplica-se.</p>
<p><strong>A estrutura visual é importante.</strong> Os desenhos de engenharia dependem da disposição. Os relatórios financeiros dependem de tabelas. As imagens médicas dependem de relações espaciais. O OCR extrai texto mas perde a estrutura. A recuperação apenas de texto não consegue tratar estes documentos de forma fiável.</p>
<h3 id="How-to-Implement-Hybrid-Retrieval" class="common-anchor-header">Como implementar a recuperação híbrida</h3><p>A recuperação híbrida combina vários métodos de pesquisa - normalmente <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">BM25 para correspondência de palavras-chave e vectores densos para pesquisa semântica - para</a>cobrir o que nenhum dos métodos consegue fazer sozinho.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/build_smarter_rag_routing_hybrid_retrieval_2_7f305f024e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>A abordagem tradicional executa dois sistemas separados: um para o BM25 e outro para a pesquisa vetorial. Cada consulta chega a ambos, e os resultados são fundidos posteriormente. Funciona, mas tem um custo real:</p>
<table>
<thead>
<tr><th></th><th>Tradicional (sistemas separados)</th><th>Unificado (coleção única)</th></tr>
</thead>
<tbody>
<tr><td>Armazenamento</td><td>Dois índices separados</td><td>Uma coleção, ambos os tipos de vetor</td></tr>
<tr><td>Sincronização de dados</td><td>Deve manter dois sistemas em sincronia</td><td>Caminho de escrita único</td></tr>
<tr><td>Caminho de consulta</td><td>Duas consultas + fusão de resultados</td><td>Uma chamada à API, fusão automática</td></tr>
<tr><td>Ajustamento</td><td>Ajustar os pesos de fusão entre sistemas</td><td>Alterar o peso denso/esparso numa consulta</td></tr>
<tr><td>Complexidade operacional</td><td>Elevada</td><td>Baixa</td></tr>
</tbody>
</table>
<p><a href="https://milvus.io/">O Milvus</a> 2.6 suporta tanto vectores densos (para pesquisa semântica) como vectores esparsos (para pesquisa de palavras-chave ao estilo BM25) na mesma coleção. Uma única chamada à API devolve resultados fundidos, com o comportamento de recuperação ajustável alterando o peso entre os tipos de vectores. Sem índices separados, sem problemas de sincronização, sem latência de fusão.</p>
<h2 id="How-to-Evaluate-a-RAG-Pipeline-Stage-by-Stage" class="common-anchor-header">Como avaliar um pipeline RAG etapa por etapa<button data-href="#How-to-Evaluate-a-RAG-Pipeline-Stage-by-Stage" class="anchor-icon" translate="no">
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
    </button></h2><p>Verificar apenas a resposta final não é suficiente. O RAG é um pipeline de vários estágios, e uma falha em qualquer estágio se propaga a jusante. Se medirmos apenas a qualidade da resposta, não podemos dizer se o problema está no encaminhamento, na reescrita, na recuperação, na reranking ou na geração.</p>
<p>Quando os utilizadores comunicam "resultados imprecisos", a causa principal pode estar em qualquer lado: o encaminhamento pode saltar a recuperação quando não o deveria fazer; a reescrita da consulta pode omitir entidades-chave; a recuperação pode não incluir documentos relevantes; a reclassificação pode enterrar bons resultados; ou o modelo pode ignorar completamente o contexto recuperado.</p>
<p>Avalie cada fase com as suas próprias métricas:</p>
<table>
<thead>
<tr><th>Etapa</th><th>Métrica</th><th>O que apanha</th></tr>
</thead>
<tbody>
<tr><td>Encaminhamento</td><td>Pontuação F1</td><td>Taxa elevada de falsos negativos = as consultas que necessitam de recuperação são ignoradas</td></tr>
<tr><td>Reescrita de consultas</td><td>Precisão da extração de entidades, cobertura de sinónimos</td><td>A consulta reescrita elimina termos importantes ou altera a intenção</td></tr>
<tr><td>Recuperação</td><td>Recall@K, NDCG@10</td><td>Os documentos relevantes não são recuperados ou têm uma classificação demasiado baixa</td></tr>
<tr><td>Reavaliação</td><td>Precisão@3</td><td>Os melhores resultados não são efetivamente relevantes</td></tr>
<tr><td>Geração</td><td>Fidelidade, exaustividade das respostas</td><td>O modelo ignora o contexto recuperado ou dá respostas parciais</td></tr>
</tbody>
</table>
<p><strong>Configurar a monitorização em camadas.</strong> Use conjuntos de testes offline para definir intervalos de métricas de linha de base para cada estágio. Na produção, accione alertas quando qualquer fase descer abaixo da sua linha de base. Isso permite detetar regressões antecipadamente e rastreá-las até um estágio específico - em vez de adivinhar.</p>
<h2 id="What-to-Build-First" class="common-anchor-header">O que construir primeiro<button data-href="#What-to-Build-First" class="anchor-icon" translate="no">
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
    </button></h2><p>Três prioridades se destacam nas implantações reais do RAG:</p>
<ol>
<li><p><strong>Adicionar roteamento antecipadamente.</strong> Muitas consultas não precisam de recuperação. Filtrá-las antecipadamente reduz a carga e melhora o tempo de resposta com um esforço mínimo de engenharia.</p></li>
<li><p><strong>Utilizar a recuperação híbrida unificada.</strong> A manutenção de sistemas de pesquisa BM25 e vetorial separados duplica os custos de armazenamento, cria complexidade de sincronização e adiciona latência de fusão. Um sistema unificado como o Milvus 2.6 - onde os vectores densos e esparsos vivem na mesma coleção - elimina estes problemas.</p></li>
<li><p><strong>Avalie cada estágio independentemente.</strong> A qualidade da resposta de ponta a ponta por si só não é um sinal útil. As métricas por fase (F1 para encaminhamento, Recall@K e NDCG para recuperação) permitem-lhe depurar mais rapidamente e evitar quebrar uma fase enquanto afina outra.</p></li>
</ol>
<p>O verdadeiro valor de um sistema RAG moderno não é apenas a recuperação - é saber <em>quando</em> recuperar e <em>como</em> recuperar. Comece com o encaminhamento e a pesquisa híbrida unificada e terá uma base escalável.</p>
<hr>
<p>Se estiver a criar ou a atualizar um sistema RAG e se deparar com problemas de qualidade de recuperação, gostaríamos de o ajudar:</p>
<ul>
<li>Junte-se à <a href="https://slack.milvus.io/">comunidade Milvus Slack</a> para fazer perguntas, partilhar a sua arquitetura e aprender com outros programadores que trabalham em problemas semelhantes.</li>
<li><a href="https://milvus.io/office-hours">Marque uma sessão gratuita de 20 minutos do Milvus Office Hours</a> para analisar o seu caso de utilização - quer se trate de um design de encaminhamento, de uma configuração de recuperação híbrida ou de uma avaliação em várias fases.</li>
<li>Se preferir evitar a configuração da infraestrutura, <a href="https://cloud.zilliz.com/signup">o Zilliz Cloud</a> (Milvus gerido) oferece um nível gratuito para começar.</li>
</ul>
<hr>
<p>Algumas perguntas que surgem frequentemente quando as equipas começam a criar sistemas RAG mais inteligentes:</p>
<p><strong>P: O RAG ainda é necessário agora que os modelos suportam janelas de contexto de 128K+?</strong></p>
<p>Sim. As janelas de contexto longas ajudam quando é necessário processar um único documento de grandes dimensões, mas não substituem a recuperação para consultas de bases de dados de conhecimento. Enviar todo o corpus em cada pedido aumenta linearmente os custos e os modelos perdem o foco na informação relevante em contextos longos - um problema bem documentado conhecido como o efeito "perdido no meio" (Liu et al., 2023). O RAG recupera apenas o que é relevante, mantendo os custos e a latência previsíveis.</p>
<p><strong>P: Como posso combinar a BM25 e a pesquisa vetorial sem executar dois sistemas separados?</strong></p>
<p>Utilize uma base de dados vetorial que suporte vectores densos e esparsos na mesma coleção. O Milvus 2.6 armazena ambos os tipos de vectores por documento e devolve resultados fundidos a partir de uma única consulta. Ajusta-se o equilíbrio entre a palavra-chave e a correspondência semântica alterando um parâmetro de peso - sem índices separados, sem fusão de resultados, sem dores de cabeça de sincronização.</p>
<p><strong>P: Qual é a primeira coisa que devo acrescentar para melhorar o meu atual pipeline RAG?</strong></p>
<p>O encaminhamento de consultas. É a melhoria de maior impacto e menor esforço. A maioria dos sistemas de produção vê uma parte significativa de consultas que não precisam de ser recuperadas de todo - perguntas de senso comum, cálculos simples, conhecimentos gerais. Encaminhá-las diretamente para o LLM reduz as chamadas de recuperação desnecessárias e melhora imediatamente o tempo de resposta.</p>
<p><strong>P: Como posso descobrir qual a fase do meu pipeline RAG que está a causar maus resultados?</strong></p>
<p>Avalie cada fase de forma independente. Utilize a pontuação F1 para a exatidão do encaminhamento, Recall@K e NDCG@10 para a qualidade da recuperação, Precision@3 para a reclassificação e métricas de fidelidade para a geração. Defina linhas de base a partir de dados de teste offline e monitorize cada fase na produção. Quando a qualidade da resposta cai, é possível rastrear a fase específica que regrediu em vez de adivinhar.</p>
