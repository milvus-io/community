---
id: why-ai-agents-like-openclaw-burn-through-tokens-and-how-to-cut-costs.md
title: >-
  Por que agentes de IA como o OpenClaw queimam através de tokens e como cortar
  custos
author: Min Yin
date: 2026-2-28
cover: assets.zilliz.com/Blog_Open_Claw_Burning_Through_Tokens_1_39b7ee4fdf.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'OpenClaw, Token Optimization, Vector Search, AI Agents, Milvus'
meta_keywords: >-
  OpenClaw token costs, OpenClaw token optimization, reduce OpenClaw API costs,
  hybrid search BM25 vector, AI agent memory, memsearch, Milvus
meta_title: |
  Why AI Agents like OpenClaw Burn Through Tokens and How to Cut Costs
desc: >-
  Porque é que as contas de tokens do OpenClaw e de outros agentes de IA
  aumentam e como corrigi-las com BM25 + recuperação de vectores (index1, QMD,
  Milvus) e memória Markdown-first (memsearch).
origin: >-
  https://milvus.io/blog/why-ai-agents-like-openclaw-burn-through-tokens-and-how-to-cut-costs.md
---
<custom-h1>Por que agentes de IA como o OpenClaw queimam tokens e como reduzir custos</custom-h1><p>Se você já passou algum tempo com o <a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw</a> (anteriormente Clawdbot e Moltbot), você já sabe o quão bom é esse AI Agent. Ele é rápido, local, flexível e capaz de realizar fluxos de trabalho surpreendentemente complexos no Slack, no Discord, na sua base de código e em praticamente qualquer outra coisa que você o conecte. Mas quando você começa a usá-lo seriamente, um padrão emerge rapidamente: <strong>seu uso de token começa a subir.</strong></p>
<p>Isso não é culpa do OpenClaw especificamente - é como a maioria dos agentes de IA se comporta hoje. Eles accionam uma chamada LLM para quase tudo: procurar um ficheiro, planear uma tarefa, escrever uma nota, executar uma ferramenta ou fazer uma pergunta de seguimento. E como os tokens são a moeda universal destas chamadas, cada ação tem um custo.</p>
<p>Para perceber de onde vem esse custo, temos de olhar para dois grandes contribuidores:</p>
<ul>
<li><strong>A pesquisa:</strong> Pesquisas mal construídas puxam cargas de contexto extensas - ficheiros inteiros, registos, mensagens e regiões de código de que o modelo não precisava realmente.</li>
<li><strong>Memória:</strong> O armazenamento de informações sem importância obriga o agente a reler e reprocessar essas informações em chamadas futuras, aumentando o uso de tokens ao longo do tempo.</li>
</ul>
<p>Ambos os problemas aumentam silenciosamente os custos operacionais sem melhorar a capacidade.</p>
<h2 id="How-AI-Agents-Like-OpenClaw-Actually-Perform-Searches--and-Why-That-Burns-Tokens" class="common-anchor-header">Como os agentes de IA como o OpenClaw realmente realizam pesquisas - e por que isso queima tokens<button data-href="#How-AI-Agents-Like-OpenClaw-Actually-Perform-Searches--and-Why-That-Burns-Tokens" class="anchor-icon" translate="no">
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
    </button></h2><p>Quando um agente precisa de informações da sua base de código ou biblioteca de documentos, ele normalmente faz o equivalente a um <strong>Ctrl+F</strong> em todo o projeto. Cada linha correspondente é retornada - não classificada, não filtrada e não priorizada. O Claude Code implementa isso através de uma ferramenta Grep dedicada construída sobre o ripgrep. O OpenClaw não tem uma ferramenta de pesquisa de base de código incorporada, mas a sua ferramenta exec permite que o modelo subjacente execute qualquer comando, e as competências carregadas podem orientar o agente a utilizar ferramentas como o rg. Em ambos os casos, a pesquisa na base de código retorna correspondências de palavras-chave não classificadas e não filtradas.</p>
<p>Esta abordagem de força bruta funciona bem em pequenos projectos. Mas à medida que os repositórios crescem, o preço também aumenta. As correspondências irrelevantes se acumulam na janela de contexto do LLM, forçando o modelo a ler e processar milhares de tokens que não eram realmente necessários. Uma única pesquisa sem escopo pode arrastar arquivos completos, grandes blocos de comentários ou logs que compartilham uma palavra-chave, mas não a intenção subjacente. Repita esse padrão em uma longa sessão de depuração ou pesquisa, e o inchaço aumenta rapidamente.</p>
<p>Tanto o OpenClaw quanto o Claude Code tentam gerenciar esse crescimento. O OpenClaw elimina as saídas de ferramentas de grandes dimensões e compacta longos históricos de conversação, enquanto o Claude Code limita a saída de leitura de ficheiros e suporta a compactação de contexto. Essas atenuações funcionam - mas somente depois que a consulta inchada já foi executada. Os resultados de pesquisa não classificados continuam a consumir tokens, e o utilizador continua a pagar por eles. A gestão do contexto ajuda as voltas futuras, não a chamada original que gerou o desperdício.</p>
<h2 id="How-AI-Agent-Memory-Works-and-Why-It-Also-Costs-Tokens" class="common-anchor-header">Como funciona a memória do agente de IA e porque é que também custa tokens<button data-href="#How-AI-Agent-Memory-Works-and-Why-It-Also-Costs-Tokens" class="anchor-icon" translate="no">
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
    </button></h2><p>A pesquisa não é a única fonte de sobrecarga de tokens. Cada pedaço de contexto que um agente recupera da memória também deve ser carregado na janela de contexto do LLM, e isso também custa tokens.</p>
<p>As APIs LLM nas quais a maioria dos agentes confia atualmente são stateless: A API Messages do Anthropic requer o histórico completo da conversa em cada pedido, e a API Chat Completions do OpenAI funciona da mesma forma. Até mesmo a API de respostas com estado mais recente da OpenAI, que gerencia o estado da conversa no lado do servidor, ainda cobra pela janela de contexto completa em cada chamada. A memória carregada no contexto custa tokens, independentemente de como ela chega lá.</p>
<p>Para contornar esta situação, as estruturas de agentes escrevem notas em ficheiros no disco e carregam as notas relevantes de volta para a janela de contexto quando o agente precisa delas. Por exemplo, o OpenClaw armazena notas curadas em MEMORY.md e anexa registos diários a ficheiros Markdown com carimbo de data/hora e, em seguida, indexa-os com BM25 híbrido e pesquisa vetorial para que o agente possa recuperar o contexto relevante a pedido.</p>
<p>O design de memória do OpenClaw funciona bem, mas requer todo o ecossistema do OpenClaw: o processo do Gateway, as conexões da plataforma de mensagens e o restante da pilha. O mesmo acontece com a memória do Claude Code, que está vinculada à sua CLI. Se estiver a construir um agente personalizado fora destas plataformas, precisa de uma solução autónoma. A próxima secção cobre as ferramentas disponíveis para ambos os problemas.</p>
<h2 id="How-to-Stop-OpenClaw-From-Burning-Through-Tokens" class="common-anchor-header">Como impedir que o OpenClaw queime tokens<button data-href="#How-to-Stop-OpenClaw-From-Burning-Through-Tokens" class="anchor-icon" translate="no">
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
    </button></h2><p>Se você quiser reduzir a quantidade de tokens que o OpenClaw consome, há duas alavancas que você pode usar.</p>
<ul>
<li>A primeira é <strong>melhorar a recuperação</strong> - substituindo os despejos de palavras-chave no estilo grep por ferramentas de pesquisa classificadas e orientadas por relevância, para que o modelo veja apenas as informações que realmente importam.</li>
<li>A segunda é <strong>uma melhor memória</strong> - passando de um armazenamento opaco e dependente da estrutura para algo que possa ser entendido, inspeccionado e controlado.</li>
</ul>
<h3 id="Replacing-grep-with-Better-Retrieval-index1-QMD-and-Milvus" class="common-anchor-header">Substituir o grep por uma melhor recuperação: index1, QMD e Milvus</h3><p>Muitos agentes de codificação de IA pesquisam bases de código com grep ou ripgrep. O Claude Code tem uma ferramenta Grep dedicada, baseada no ripgrep. O OpenClaw não tem uma ferramenta de pesquisa de bases de código incorporada, mas a sua ferramenta exec permite que o modelo subjacente execute qualquer comando, e competências como ripgrep ou QMD podem ser carregadas para orientar a forma como o agente pesquisa. Sem uma habilidade focada na recuperação, o agente recorre a qualquer abordagem escolhida pelo modelo subjacente. O problema central é o mesmo em todos os agentes: sem a recuperação classificada, as correspondências de palavras-chave entram na janela de contexto sem serem filtradas.</p>
<p>Isto funciona quando um projeto é suficientemente pequeno para que todas as correspondências caibam confortavelmente na janela de contexto. O problema começa quando uma base de código ou biblioteca de documentos cresce até o ponto em que uma palavra-chave retorna dezenas ou centenas de resultados e o agente tem que carregar todos eles no prompt. A essa escala, são necessários resultados classificados por relevância e não apenas filtrados por correspondência.</p>
<p>A solução padrão é a pesquisa híbrida, que combina dois métodos de classificação complementares:</p>
<ul>
<li>O BM25 classifica cada resultado de acordo com a frequência e a singularidade com que um termo aparece num determinado documento. Um ficheiro focado que menciona "autenticação" 15 vezes tem uma classificação mais elevada do que um ficheiro extenso que o menciona uma vez.</li>
<li>A pesquisa vetorial converte o texto em representações numéricas do significado, pelo que "autenticação" pode corresponder a "fluxo de início de sessão" ou "gestão de sessões", mesmo que não partilhem palavras-chave.</li>
</ul>
<p>Nenhum dos métodos é suficiente: O BM25 não detecta termos parafraseados e a pesquisa vetorial não detecta termos exactos como códigos de erro. A combinação de ambos e a fusão das listas classificadas através de um algoritmo de fusão cobrem ambas as lacunas.</p>
<p>As ferramentas abaixo implementam este padrão em diferentes escalas. O Grep é a linha de base com que todos começam. O index1, o QMD e o Milvus adicionam cada um a pesquisa híbrida com capacidade crescente.</p>
<h4 id="index1-fast-hybrid-search-on-a-single-machine" class="common-anchor-header">index1: busca híbrida rápida em uma única máquina</h4><p><a href="https://github.com/gladego/index1">index1</a> é uma ferramenta CLI que empacota a pesquisa híbrida em um único arquivo de banco de dados SQLite. O FTS5 lida com o BM25, o sqlite-vec lida com a similaridade vetorial e o RRF funde as listas classificadas. Os embeddings são gerados localmente pelo Ollama, portanto nada sai da sua máquina.</p>
<p>index1 divide o código por estrutura, não por contagem de linhas: Arquivos Markdown divididos por cabeçalhos, arquivos Python por AST, JavaScript e TypeScript por padrões regex. Isso significa que os resultados da pesquisa retornam unidades coerentes, como uma função completa ou uma seção de documentação completa, e não intervalos de linhas arbitrários que cortam o meio do bloco. O tempo de resposta é de 40 a 180 ms para consultas híbridas. Sem o Ollama, ele volta para o BM25-only, que ainda classifica os resultados em vez de despejar cada correspondência na janela de contexto.</p>
<p>O index1 também inclui um módulo de memória episódica para armazenar lições aprendidas, causas de erros e decisões de arquitetura. Estas memórias vivem dentro da mesma base de dados SQLite que o índice de código em vez de como ficheiros independentes.</p>
<p>Nota: index1 é um projeto em fase inicial (0 estrelas, 4 commits em fevereiro de 2026). Avalie-o em relação à sua própria base de código antes de fazer o commit.</p>
<ul>
<li><strong>Melhor para</strong>: desenvolvedores individuais ou pequenas equipes com uma base de código que cabe em uma máquina, procurando por uma melhoria rápida em relação ao grep.</li>
<li><strong>Supere-o quando</strong>: precisar de acesso multi-utilizador ao mesmo índice, ou os seus dados excederem o que um único ficheiro SQLite lida confortavelmente.</li>
</ul>
<h4 id="QMD-higher-accuracy-through-local-LLM-re-ranking" class="common-anchor-header">QMD: maior precisão através da reclassificação LLM local</h4><p><a href="https://github.com/tobi/qmd">O QMD</a> (Query Markup Documents), criado pelo fundador da Shopify, Tobi Lütke, adiciona uma terceira etapa: a reclassificação LLM. Depois de o BM25 e a pesquisa vetorial devolverem candidatos, um modelo linguístico local relê os principais resultados e reordena-os de acordo com a relevância real para a sua consulta. Isto permite detetar os casos em que tanto as correspondências de palavras-chave como as correspondências semânticas apresentam resultados plausíveis mas errados.</p>
<p>O QMD corre inteiramente na sua máquina utilizando três modelos GGUF que totalizam cerca de 2 GB: um modelo de incorporação (embeddinggemma-300M), um reranker de codificação cruzada (Qwen3-Reranker-0.6B) e um modelo de expansão de consultas (qmd-query-expansion-1.7B). Todos os três são descarregados automaticamente na primeira execução. Sem chamadas de API na nuvem, sem chaves de API.</p>
<p>A desvantagem é o tempo de cold-start: carregar três modelos do disco leva cerca de 15 a 16 segundos. O QMD suporta um modo de servidor persistente (qmd mcp) que mantém os modelos na memória entre as solicitações, eliminando a penalidade de cold-start para consultas repetidas.</p>
<ul>
<li><strong>Ideal para:</strong> ambientes críticos em termos de privacidade, onde nenhum dado pode sair da máquina e onde a precisão da recuperação é mais importante do que o tempo de resposta.</li>
<li><strong>Supere-o quando:</strong> precisar de respostas em menos de um segundo, acesso partilhado da equipa ou o seu conjunto de dados exceder a capacidade de uma única máquina.</li>
</ul>
<h4 id="Milvus-hybrid-search-at-team-and-enterprise-scale" class="common-anchor-header">Milvus: pesquisa híbrida à escala da equipa e da empresa</h4><p>As ferramentas de máquina única acima funcionam bem para desenvolvedores individuais, mas atingem limites quando várias pessoas ou agentes precisam acessar a mesma base de conhecimento. <a href="https://github.com/milvus-io/milvus"></a></p>
<p><a href="https://github.com/milvus-io/milvus">O Milvus</a> é uma base de dados vetorial de código aberto criada para essa fase seguinte: distribuída, multi-utilizador e capaz de lidar com milhares de milhões de vectores.</p>
<p>A sua principal caraterística para este caso de utilização é o Sparse-BM25 incorporado, disponível desde o Milvus 2.5 e significativamente mais rápido no 2.6. O usuário fornece o texto bruto e o Milvus o tokeniza internamente usando um analisador construído em tantivy, depois converte o resultado em vetores esparsos que são pré-computados e armazenados no momento do índice.</p>
<p>Como a representação BM25 já está armazenada, a recuperação não precisa de recalcular as pontuações em tempo real. Estes vectores esparsos coexistem com os vectores densos (embeddings semânticos) na mesma coleção. Na altura da consulta, funde ambos os sinais com um classificador como o RRFRanker, que o Milvus fornece de imediato. O mesmo padrão de pesquisa híbrida que o index1 e o QMD, mas executado numa infraestrutura que pode ser escalada horizontalmente.</p>
<p>O Milvus também fornece capacidades que as ferramentas de máquina única não conseguem: isolamento multi-tenant (bases de dados ou colecções separadas por equipa), replicação de dados com failover automático e camadas de dados quentes/frias para um armazenamento económico. Para os agentes, isto significa que vários programadores ou várias instâncias de agentes podem consultar a mesma base de conhecimentos em simultâneo sem pisar os dados uns dos outros.</p>
<ul>
<li><strong>Ideal para</strong>: vários programadores ou agentes que partilham uma base de conhecimentos, conjuntos de documentos grandes ou de crescimento rápido ou ambientes de produção que necessitam de replicação, ativação pós-falha e controlo de acesso.</li>
</ul>
<p>Em resumo:</p>
<table>
<thead>
<tr><th>Ferramenta</th><th>Estágio</th><th>Implantação</th><th>Sinal de migração</th></tr>
</thead>
<tbody>
<tr><td>Grep nativo do Claude</td><td>Prototipagem</td><td>Integrado, configuração zero</td><td>As facturas aumentam ou as consultas abrandam</td></tr>
<tr><td>índice1</td><td>Máquina única (velocidade)</td><td>SQLite local + Ollama</td><td>Necessidade de acesso multi-utilizador ou os dados ultrapassam o tamanho de uma máquina</td></tr>
<tr><td>QMD</td><td>Máquina única (exatidão)</td><td>Três modelos GGUF locais</td><td>Necessidade de índices partilhados pela equipa</td></tr>
<tr><td>Milvus</td><td>Equipa ou produção</td><td>Cluster distribuído</td><td>Grandes conjuntos de documentos ou requisitos de vários inquilinos</td></tr>
</tbody>
</table>
<h3 id="Reducing-AI-Agent-Token-Costs-by-Giving-Them-Persistent-Editable-Memory-with-memsearch" class="common-anchor-header">Reduzir os custos de tokens de agentes de IA dando-lhes memória persistente e editável com memsearch</h3><p>A otimização da pesquisa reduz o desperdício de tokens por consulta, mas não ajuda com o que o agente retém entre as sessões.</p>
<p>Cada pedaço de contexto que um agente recupera da memória tem que ser carregado no prompt, e isso também custa tokens. A questão não é se a memória deve ser armazenada, mas como. O método de armazenamento determina se é possível ver o que o agente se lembra, corrigi-lo quando está errado e levá-lo consigo se mudar de ferramenta.</p>
<p>A maioria dos frameworks falha em todos os três aspectos. Mem0 e Zep armazenam tudo em um banco de dados vetorial, que funciona para recuperação, mas torna a memória:</p>
<ul>
<li><strong>Opaca.</strong> Não é possível ver o que o agente se lembra sem consultar uma API.</li>
<li><strong>Difícil de editar.</strong> A correção ou remoção de uma memória implica chamadas à API e não a abertura de um ficheiro.</li>
<li><strong>Bloqueada.</strong> Mudar de estrutura significa exportar, converter e reimportar seus dados.</li>
</ul>
<p>O OpenClaw tem uma abordagem diferente. Toda a memória reside em ficheiros Markdown simples no disco. O agente escreve logs diários automaticamente, e os humanos podem abrir e editar qualquer arquivo de memória diretamente. Isso resolve os três problemas: a memória é legível, editável e portátil por design.</p>
<p>A desvantagem é a sobrecarga de implantação. Executar a memória do OpenClaw significa executar todo o ecossistema do OpenClaw: o processo do Gateway, as conexões da plataforma de mensagens e o restante da pilha. Para as equipas que já utilizam o OpenClaw, não há problema. Para todos os outros, a barreira é muito alta. <strong>memsearch</strong> foi construído para fechar essa lacuna: ele extrai o padrão de memória Markdown-first do OpenClaw em uma biblioteca independente que funciona com qualquer agente.</p>
<p><strong><a href="https://github.com/zilliztech/memsearch">O memsearch</a></strong>, construído pela Zilliz (a equipa por detrás do Milvus), trata os ficheiros Markdown como a única fonte de verdade. Um MEMORY.md contém factos e decisões a longo prazo que escreve à mão. Os registos diários (2026-02-26.md) são gerados automaticamente a partir dos resumos das sessões. O índice vetorial, armazenado em Milvus, é uma camada derivada que pode ser reconstruída a partir do Markdown em qualquer altura.</p>
<p>Na prática, isto significa que pode abrir qualquer ficheiro de memória num editor de texto, ler exatamente o que o agente sabe e alterá-lo. Salve o arquivo, e o observador de arquivos do memsearch detecta a alteração e reindexa automaticamente. Pode gerir memórias com o Git, rever memórias geradas por IA através de pedidos pull, ou mover para uma nova máquina copiando uma pasta. Se o índice Milvus se perder, pode reconstruí-lo a partir dos ficheiros. Os ficheiros nunca estão em risco.</p>
<p>Nos bastidores, o memsearch usa o mesmo padrão de pesquisa híbrido descrito acima: pedaços divididos por estrutura de títulos e limites de parágrafos, recuperação de BM25 + vetor e um comando compacto alimentado por LLM que resume memórias antigas quando os registos se tornam grandes.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Open_Claw_Burning_Through_Tokens_3_d9df026b47.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ideal para: equipas que pretendem visibilidade total sobre o que o agente recorda, que necessitam de controlo de versão sobre a memória ou que pretendem um sistema de memória que não esteja preso a uma única estrutura de agente.</p>
<p>Resumindo:</p>
<table>
<thead>
<tr><th>Capacidade</th><th>Mem0 / Zep</th><th>pesquisa de memória</th></tr>
</thead>
<tbody>
<tr><td>Fonte de verdade</td><td>Base de dados vetorial (única fonte de dados)</td><td>Ficheiros Markdown (primário) + Milvus (índice)</td></tr>
<tr><td>Transparência</td><td>Caixa negra, requer API para inspecionar</td><td>Abrir qualquer ficheiro .md para ler</td></tr>
<tr><td>Capacidade de edição</td><td>Modificar através de chamadas API</td><td>Editar diretamente em qualquer editor de texto, re-indexado automaticamente</td></tr>
<tr><td>Controlo de versões</td><td>Requer registo de auditoria separado</td><td>O Git funciona nativamente</td></tr>
<tr><td>Custo de migração</td><td>Exportar → converter formato → reimportar</td><td>Copiar a pasta Markdown</td></tr>
<tr><td>Colaboração entre humanos e IA</td><td>A IA escreve, os humanos observam</td><td>Os humanos podem editar, complementar e rever</td></tr>
</tbody>
</table>
<h2 id="Which-setup-fits-your-scale" class="common-anchor-header">Que configuração se adequa à sua escala<button data-href="#Which-setup-fits-your-scale" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th>Cenário</th><th>Pesquisa</th><th>Memória</th><th>Quando avançar</th></tr>
</thead>
<tbody>
<tr><td>Protótipo inicial</td><td>Grep (incorporado)</td><td>-</td><td>As facturas sobem ou as consultas abrandam</td></tr>
<tr><td>Um único programador, apenas pesquisa</td><td><a href="https://github.com/gladego/index1">index1</a> (velocidade) ou <a href="https://github.com/tobi/qmd">QMD</a> (exatidão)</td><td>-</td><td>Necessidade de acesso multi-utilizador ou os dados ultrapassam o tamanho de uma máquina</td></tr>
<tr><td>Um único programador, ambos</td><td><a href="https://github.com/gladego/index1">index1</a></td><td><a href="https://github.com/zilliztech/memsearch">pesquisa de memória</a></td><td>Necessidade de acesso multi-utilizador ou os dados ultrapassam o limite de uma máquina</td></tr>
<tr><td>Equipa ou produção, ambos</td><td><a href="https://github.com/milvus-io/milvus">Milvus</a></td><td><a href="https://github.com/zilliztech/memsearch">pesquisa</a></td><td>-</td></tr>
<tr><td>Integração rápida, apenas memória</td><td>-</td><td>Mem0 ou Zep</td><td>Necessidade de inspecionar, editar ou migrar memórias</td></tr>
</tbody>
</table>
<h2 id="Conclusion" class="common-anchor-header">Conclusão<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Os custos de token que vêm com agentes de IA sempre ativos não são inevitáveis. Este guia cobriu duas áreas onde melhores ferramentas podem cortar o desperdício: busca e memória.</p>
<p>O Grep funciona em pequena escala, mas à medida que as bases de código crescem, as correspondências de palavras-chave não classificadas inundam a janela de contexto com conteúdo que o modelo nunca precisou. <a href="https://github.com/gladego/index1"></a><a href="https://github.com/gladego/index1">index1</a> e <a href="https://github.com/tobi/qmd"></a> QMD resolvem isso em uma única máquina, combinando a pontuação de palavras-chave BM25 com a pesquisa vetorial e retornando apenas os resultados mais relevantes. Para equipas, configurações multi-agente ou cargas de trabalho de produção,<a href="https://milvus.io">o</a> <a href="https://milvus.io"></a><a href="https://milvus.io">Milvus</a> fornece o mesmo padrão de pesquisa híbrida em infra-estruturas que escalam horizontalmente.</p>
<p>Para a memória, a maioria dos frameworks armazena tudo em um banco de dados vetorial: opaco, difícil de editar manualmente e bloqueado para o framework que o criou. <a href="https://github.com/zilliztech/memsearch">memsearch</a> tem uma abordagem diferente. A memória vive em arquivos Markdown simples que você pode ler, editar e controlar a versão com o Git. O Milvus serve como um índice derivado que pode ser reconstruído a partir desses ficheiros em qualquer altura. O utilizador mantém o controlo sobre o que o agente sabe.</p>
<p>Tanto<a href="https://github.com/zilliztech/memsearch">o</a> <a href="https://github.com/zilliztech/memsearch"></a><a href="https://github.com/zilliztech/memsearch">memsearch</a> quanto<a href="https://github.com/milvus-io/milvus">o</a> <a href="https://github.com/milvus-io/milvus"></a><a href="https://github.com/milvus-io/milvus">Milvus</a> são de código aberto. Estamos a desenvolver ativamente o memsearch e gostaríamos de receber feedback de qualquer pessoa que o utilize em produção. Abra uma issue, submeta um PR, ou apenas diga-nos o que está a funcionar e o que não está.</p>
<p>Projetos mencionados neste guia:</p>
<ul>
<li><a href="https://github.com/zilliztech/memsearch">memsearch</a>: Memória Markdown-first para agentes de IA, apoiada por Milvus.</li>
<li><a href="https://github.com/milvus-io/milvus">Milvus</a>: Base de dados vetorial de código aberto para pesquisa híbrida escalável.</li>
<li><a href="https://github.com/gladego/index1">index1</a>: Pesquisa híbrida BM25 + vetorial para agentes de codificação de IA.</li>
<li><a href="https://github.com/tobi/qmd">QMD</a>: Pesquisa híbrida local com reordenação LLM.</li>
</ul>
<h2 id="Keep-Reading" class="common-anchor-header">Continuar a ler<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">Extraímos o sistema de memória do OpenClaw e abrimo-lo (memsearch)</a></li>
<li><a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">Memória persistente para o código Claude: memsearch ccplugin</a></li>
<li><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">O que é o OpenClaw? Guia completo para o agente de IA de código aberto</a></li>
<li><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Tutorial do OpenClaw: Conecte-se ao Slack para obter um assistente de IA local</a></li>
</ul>
