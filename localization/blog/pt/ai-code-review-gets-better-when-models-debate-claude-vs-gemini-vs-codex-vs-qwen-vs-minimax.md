---
id: >-
  ai-code-review-gets-better-when-models-debate-claude-vs-gemini-vs-codex-vs-qwen-vs-minimax.md
title: >-
  A revisão do código de IA torna-se melhor quando os modelos debatem: Claude vs
  Gemini vs Codex vs Qwen vs MiniMax
author: Li Liu
date: 2026-02-26T00:00:00.000Z
cover: >-
  assets.zilliz.com/Code_Review_Benchmark_Cover_Fixed_Icons_2048x1143_11zon_1_04796f1364.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'AI Code Review, Qwen, Claude, Gemini, Codex'
meta_keywords: >-
  AI code review, LLM code review benchmark, Claude vs Gemini vs Codex, AI code
  review benchmark, multi-model AI debate
meta_title: |
  Claude vs Gemini vs Codex vs Qwen vs MiniMax Code Review
desc: >-
  Testámos o Claude, o Gemini, o Codex, o Qwen e o MiniMax na deteção real de
  erros. O melhor modelo atingiu 53%. Após um debate contraditório, a deteção
  subiu para 80%.
origin: 'https://milvus.io/blog/ai-code-review-benchmark-multi-model-debate.md'
---
<p>Recentemente, utilizei modelos de IA para analisar um pedido pull e os resultados foram contraditórios: O Claude assinalou uma corrida de dados, enquanto o Gemini disse que o código estava limpo. Isso me deixou curioso sobre como outros modelos de IA se comportariam, então eu executei os modelos mais recentes do Claude, Gemini, Codex, Qwen e MiniMax através de um benchmark estruturado de revisão de código. Os resultados? O modelo com melhor desempenho detectou apenas 53% dos bugs conhecidos.</p>
<p>No entanto, a minha curiosidade não se ficou por aqui: e se estes modelos de IA trabalhassem em conjunto? Experimentei pô-los a debater entre si e, após cinco rondas de debate contraditório, a deteção de erros aumentou para 80%. Os bugs mais difíceis, aqueles que requerem compreensão ao nível do sistema, atingiram 100% de deteção no modo de debate.</p>
<p>Este post mostra o design do experimento, os resultados por modelo e o que o mecanismo de debate revela sobre como realmente usar IA para revisão de código.</p>
<h2 id="Benchmarking-Claude-Gemini-Codex-Qwen-and-MiniMax-for-code-review" class="common-anchor-header">Benchmarking Claude, Gemini, Codex, Qwen e MiniMax para revisão de código<button data-href="#Benchmarking-Claude-Gemini-Codex-Qwen-and-MiniMax-for-code-review" class="anchor-icon" translate="no">
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
    </button></h2><p>Se você tem usado modelos para revisão de código, você provavelmente notou que eles não diferem apenas em precisão; eles diferem em como eles lêem o código. Por exemplo:</p>
<p>O Claude geralmente percorre a cadeia de chamadas de cima para baixo e gasta tempo em caminhos "chatos" (tratamento de erros, novas tentativas, limpeza). Muitas vezes é aí que se escondem os verdadeiros erros, por isso não detesto a minúcia.</p>
<p>Os gémeos tendem a começar com um veredito forte ("isto é mau" / "parece bem") e depois trabalham de trás para a frente para o justificar do ponto de vista do design/estrutura. Por vezes, isso é útil. Por vezes, parece que passou os olhos por cima e depois comprometeu-se com uma tomada de posição.</p>
<p>O Codex é mais silencioso. Mas quando assinala algo, é frequentemente concreto e acionável - menos comentários, mais "esta linha está errada porque X".</p>
<p>No entanto, estas são impressões, não medições. Para obter números reais, estabeleci uma referência.</p>
<h3 id="Setup" class="common-anchor-header">Configuração</h3><p><strong>Foram testados cinco modelos emblemáticos:</strong></p>
<ul>
<li><p>Claude Opus 4.6</p></li>
<li><p>Gemini 3 Pro</p></li>
<li><p>GPT-5.2-Codex</p></li>
<li><p>Qwen-3.5-Plus</p></li>
<li><p>MiniMax-M2.5</p></li>
</ul>
<p><strong>Ferramentas (Magpie)</strong></p>
<p>Eu usei <a href="https://github.com/liliu-z/magpie">o Magpie</a>, uma ferramenta de benchmarking de código aberto que eu construí. O seu trabalho é fazer a "preparação da revisão de código" que normalmente faria manualmente: puxar o contexto circundante (cadeias de chamadas, módulos relacionados e código adjacente relevante) e alimentá-lo ao modelo <em>antes de</em> rever o PR.</p>
<p><strong>Casos de teste (PRs do Milvus com bugs conhecidos)</strong></p>
<p>O conjunto de dados consiste em 15 pull requests do <a href="https://github.com/milvus-io/milvus">Milvus</a> (uma base de dados vetorial open-source criada e mantida por <a href="https://zilliz.com/">Zilliz</a>). Estes PRs são úteis como referência porque cada um foi fundido, apenas para mais tarde requerer uma reversão ou correção após um bug ter surgido em produção. Assim, cada caso tem um bug conhecido contra o qual podemos pontuar.</p>
<p><strong>Níveis de dificuldade dos bugs</strong></p>
<p>No entanto, nem todos esses bugs são igualmente difíceis de encontrar, então eu os categorizei em três níveis de dificuldade:</p>
<ul>
<li><p><strong>L1:</strong> Visível apenas pelo diff (use-after-free, off-by-one).</p></li>
<li><p><strong>L2 (10 casos):</strong> Requer compreensão do código ao redor para detetar coisas como mudanças na semântica da interface ou corridas de concorrência. Estes representam os erros mais comuns na revisão diária do código.</p></li>
<li><p><strong>L3 (5 casos):</strong> Requer compreensão a nível do sistema para detetar problemas como inconsistências de estado entre módulos ou problemas de compatibilidade de atualização. Estes são os testes mais difíceis de quão profundamente um modelo pode raciocinar sobre uma base de código.</p></li>
</ul>
<p><em>Nota: Todos os modelos apanharam todos os erros L1, por isso excluí-os da pontuação.</em></p>
<p><strong>Dois modos de avaliação</strong></p>
<p>Cada modelo foi executado em dois modos:</p>
<ul>
<li><p><strong>Raw:</strong> o modelo vê apenas o PR (diff + o que quer que esteja no conteúdo do PR).</p></li>
<li><p><strong>R1:</strong> O Magpie puxa o contexto circundante (arquivos relevantes / sites de chamada / código relacionado) <em>antes das</em> revisões do modelo. Isto simula um fluxo de trabalho em que se prepara o contexto à partida em vez de pedir ao modelo para adivinhar o que precisa.</p></li>
</ul>
<h3 id="Results-L2-+-L3-only" class="common-anchor-header">Resultados (apenas L2 + L3)</h3><table>
<thead>
<tr><th>Modo</th><th>Cláudio</th><th>Gémeos</th><th>Codex</th><th>MiniMax</th><th>Qwen</th></tr>
</thead>
<tbody>
<tr><td>Bruto</td><td>53% (1º)</td><td>13% (último)</td><td>33%</td><td>27%</td><td>33%</td></tr>
<tr><td>R1 (com contexto por Magpie)</td><td>47% ⬇️</td><td>33%⬆️</td><td>27%</td><td>33%</td><td>40%⬆️</td></tr>
</tbody>
</table>
<p>Quatro conclusões:</p>
<p><strong>1. O Claude domina a análise bruta.</strong> Obteve 53% de deteção geral e um perfeito 5/5 em erros L3, sem qualquer assistência de contexto. Se estiver a utilizar um único modelo e não quiser perder tempo a preparar o contexto, o Claude é a melhor escolha.</p>
<p><strong>2. O Gemini precisa que o contexto lhe seja entregue.</strong> A sua pontuação bruta de 13% foi a mais baixa do grupo, mas com o Magpie a fornecer o código envolvente, saltou para 33%. O Gemini não reúne bem o seu próprio contexto, mas tem um desempenho respeitável quando se faz esse trabalho antecipadamente.</p>
<p><strong>3. O Qwen é o que tem o melhor desempenho com assistência ao contexto.</strong> Obteve uma pontuação de 40% no modo R1, com 5/10 nos erros L2, que foi a pontuação mais elevada nesse nível de dificuldade. Para revisões diárias de rotina em que está disposto a preparar o contexto, o Qwen é uma escolha prática.</p>
<p><strong>4. Mais contexto nem sempre ajuda.</strong> Aumentou o Gemini (13% → 33%) e o MiniMax (27% → 33%), mas na verdade prejudicou o Claude (53% → 47%). O Claude já é excelente a organizar o contexto por si só, pelo que a informação adicional provavelmente introduziu ruído em vez de clareza. A lição: combinar o fluxo de trabalho com o modelo, em vez de assumir que mais contexto é universalmente melhor.</p>
<p>Estes resultados estão de acordo com a minha experiência quotidiana. O Claude no topo não é surpreendente. O Gemini com uma pontuação mais baixa do que eu esperava faz sentido em retrospetiva: normalmente uso o Gemini em conversas com várias voltas, em que estou a iterar num design ou a procurar um problema em conjunto, e tem um bom desempenho nesse cenário interativo. Este parâmetro de comparação é um pipeline fixo de passagem única, que é exatamente o formato em que o Gemini é mais fraco. A secção de debate mais adiante mostrará que, quando se dá ao Gemini um formato contraditório de várias rondas, o seu desempenho melhora visivelmente.</p>
<h2 id="Let-AI-Models-Debate-with-Each-Other" class="common-anchor-header">Deixar os modelos de IA debaterem entre si<button data-href="#Let-AI-Models-Debate-with-Each-Other" class="anchor-icon" translate="no">
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
    </button></h2><p>Cada modelo mostrou diferentes pontos fortes e pontos cegos nos testes de referência individuais. Por isso, quis testar: o que acontece se os modelos analisarem o trabalho uns dos outros em vez de apenas o código?</p>
<p>Por isso, adicionei uma camada de debate em cima do mesmo parâmetro de referência. Os cinco modelos participam em cinco rondas:</p>
<ul>
<li><p>Na ronda 1, cada modelo analisa o mesmo PR de forma independente.</p></li>
<li><p>Depois disso, transmito as cinco análises a todos os participantes.</p></li>
<li><p>Na ronda 2, cada modelo actualiza a sua posição com base nas outras quatro.</p></li>
<li><p>Repetir até à ronda 5.</p></li>
</ul>
<p>No final, cada modelo não está apenas a reagir ao código - está a reagir a argumentos que já foram criticados e revistos várias vezes.</p>
<p>Para evitar que isto se transforme em "LLMs a concordar em voz alta", impus uma regra rígida: <strong>cada afirmação tem de apontar para um código específico como prova</strong>, e um modelo não pode apenas dizer "bem visto" - tem de explicar porque mudou de ideias.</p>
<h3 id="Results-Best-Solo-vs-Debate-Mode" class="common-anchor-header">Resultados: Melhor Solo vs Modo de Debate</h3><table>
<thead>
<tr><th>Modo</th><th>L2 (10 casos)</th><th>L3 (5 casos)</th><th>Deteção total</th></tr>
</thead>
<tbody>
<tr><td>Melhor individual (Claude Bruto)</td><td>3/10</td><td>5/5</td><td>53%</td></tr>
<tr><td>Debate (os cinco modelos)</td><td>7/10 (dobrado)</td><td>5/5 (todos apanhados)</td><td>80%</td></tr>
</tbody>
</table>
<h3 id="What-stands-out" class="common-anchor-header">O que se destaca</h3><p><strong>1. A deteção de L2 duplicou.</strong> Os erros de rotina, de dificuldade média, saltaram de 3/10 para 7/10. Estes são os erros que aparecem mais frequentemente em bases de código reais e são exatamente a categoria em que os modelos individuais falham de forma inconsistente. A maior contribuição do mecanismo de debate é colmatar estas lacunas quotidianas.</p>
<p><strong>2. Erros L3: zero erros.</strong> Nas execuções de modelo único, apenas Claude detectou todos os cinco bugs de nível de sistema L3. No modo de debate, o grupo igualou esse resultado, o que significa que já não é necessário apostar no modelo correto para obter uma cobertura L3 completa.</p>
<p><strong>3. O debate preenche os pontos cegos em vez de aumentar o teto.</strong> Os erros ao nível do sistema não eram a parte mais difícil para o indivíduo mais forte. O Claude já os tinha. A principal contribuição do mecanismo de debate é corrigir a fraqueza do Claude nos erros de rotina L2, em que o Claude, individualmente, só apanhou 3 em 10, mas o grupo de debate apanhou 7. É daí que vem o salto de 53% → 80%.</p>
<h3 id="What-debate-actually-looks-like-in-practice" class="common-anchor-header">Como é o debate na prática</h3><p>Os números acima mostram que o debate funciona, mas um exemplo concreto mostra <em>porque é que</em> funciona. Aqui está um passo a passo condensado de como os cinco modelos lidaram com <strong>o PR #44474</strong>, que introduziu o carregamento lento de chaves primárias durante a pesquisa.</p>
<p><a href="https://github.com/milvus-io/milvus/pull/44474"><strong>PR #44474:</strong></a> Uma otimização de carregamento preguiçoso que mudou a pesquisa para buscar chaves primárias sob demanda em vez de carregá-las todas antecipadamente.</p>
<p><strong>Primeira rodada</strong></p>
<p>A Gemini começou de forma agressiva:</p>
<p>"Este PR é um campo minado de más práticas, potenciais comportamentos indefinidos e regressões de desempenho disfarçadas de 'otimização'."</p>
<p>Claude e Qwen focaram no comportamento indefinido e no desempenho, convergindo para a mesma preocupação:</p>
<p>"O modelo de memória C++ não garante a segurança de gravações simultâneas em diferentes índices do mesmo vetor sem a sincronização adequada."</p>
<p>Os três encontraram problemas reais, mas nenhum deles detectou o erro mais profundo. Então o Codex, que mal havia falado, sinalizou algo que os outros não perceberam: o vetor <code translate="no">primary_keys_</code> é redimensionado, mas apenas as posições que passam pela fase de redução são realmente preenchidas. Todas as outras posições são deixadas como um valor zero.</p>
<p><strong>Segunda ronda</strong></p>
<p>O Cláudio pegou na descoberta do Codex e seguiu as consequências a jusante:</p>
<p>"Encontrei: <code translate="no">SortEqualScoresByPks</code> é executado antes de <code translate="no">ReduceResultData</code>. Por isso, quando <code translate="no">SortEqualScoresByPks</code> é executado, zero PKs já foram buscados preguiçosamente. Todo o vetor <code translate="no">primary_keys_</code> está cheio de valores PkType construídos por defeito".</p>
<p>Em termos simples, a função de ordenação é executada antes de as chaves terem sido carregadas, por isso está a ordenar zeros. Claude reconheceu a falha abertamente:</p>
<p>"O codex-cli identificou um erro de correção crítico genuíno. Falhei isto na minha primeira ronda".</p>
<h2 id="Which-Combination-of-Models-Can-Find-the-Most-Bugs" class="common-anchor-header">Que combinação de modelos consegue encontrar mais erros?<button data-href="#Which-Combination-of-Models-Can-Find-the-Most-Bugs" class="anchor-icon" translate="no">
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
    </button></h2><p>O salto de 53% para 80% aconteceu porque cinco modelos cobriram os pontos cegos uns dos outros. Mas nem toda a gente se pode dar ao luxo de configurar e executar cinco modelos através de cinco rondas de debate para cada revisão de código.</p>
<p><strong>Por isso, testei a versão mais simples: se só se pode utilizar dois modelos, qual é o par que mais se aproxima do teto multi-modelo?</strong></p>
<p>Utilizei as execuções <strong>assistidas por contexto (R1)</strong> e contei quantos dos 15 erros conhecidos cada modelo encontrou:</p>
<ul>
<li><p><strong>Claude:</strong> 7/15 (47%)</p></li>
<li><p><strong>Qwen:</strong> 6/15 (40%)</p></li>
<li><p><strong>Gemini:</strong> 5/15 (33%)</p></li>
<li><p><strong>MiniMax:</strong> 5/15 (33%)</p></li>
<li><p><strong>Codex:</strong> 4/15 (27%)</p></li>
</ul>
<p>O que importa, então, não é apenas quantos bugs cada modelo encontra, mas <em>quais</em> bugs ele deixa passar. Dos 8 erros que Claude não encontrou, Gemini encontrou 3: uma condição de corrida de concorrência, um problema de compatibilidade de API de armazenamento em nuvem e uma verificação de permissão ausente. Indo na outra direção, o Gemini perdeu a maioria das estruturas de dados e bugs de lógica profunda, e o Claude pegou quase todos eles. Seus pontos fracos quase não se sobrepõem, o que os torna um par forte.</p>
<table>
<thead>
<tr><th>Emparelhamento de dois modelos</th><th>Cobertura combinada</th></tr>
</thead>
<tbody>
<tr><td>Claude + Gemini</td><td>10/15</td></tr>
<tr><td>Cláudio + Qwen</td><td>9/15</td></tr>
<tr><td>Claude + Codex</td><td>8/15</td></tr>
<tr><td>Cláudio + MiniMax</td><td>8/15</td></tr>
</tbody>
</table>
<p>Os cinco modelos juntos cobriram 11 dos 15 erros, deixando 4 erros que cada modelo falhou.</p>
<p><strong>O Claude + Gemini,</strong> como um par de dois modelos, já atinge 91% do teto de cinco modelos. Para este parâmetro de referência, é a combinação mais eficiente.</p>
<p>Dito isto, Claude + Gemini não é a melhor combinação para todos os tipos de erros. Quando dividi os resultados por categoria de erro, surgiu uma imagem mais matizada:</p>
<table>
<thead>
<tr><th>Tipo de bug</th><th>Total</th><th>Cláudio</th><th>Gémeos</th><th>Codex</th><th>MiniMax</th><th>Qwen</th></tr>
</thead>
<tbody>
<tr><td>Lacunas de validação</td><td>4</td><td>3</td><td>2</td><td>1</td><td>1</td><td>3</td></tr>
<tr><td>Ciclo de vida da estrutura de dados</td><td>4</td><td>3</td><td>1</td><td>1</td><td>3</td><td>1</td></tr>
<tr><td>Corridas de simultaneidade</td><td>2</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>Compatibilidade</td><td>2</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td></tr>
<tr><td>Lógica profunda</td><td>3</td><td>1</td><td>0</td><td>1</td><td>1</td><td>1</td></tr>
<tr><td>Total</td><td>15</td><td>7</td><td>5</td><td>4</td><td>5</td><td>6</td></tr>
</tbody>
</table>
<p>A divisão por tipo de bug revela porque nenhum emparelhamento é universalmente melhor.</p>
<ul>
<li><p>Para bugs no ciclo de vida da estrutura de dados, Claude e MiniMax empataram em 3/4.</p></li>
<li><p>Para falhas de validação, Claude e Qwen empataram em 3/4.</p></li>
<li><p>Para problemas de concorrência e compatibilidade, o Claude obteve zero em ambos, e o Gemini é o que preenche essas lacunas.</p></li>
<li><p>Nenhum modelo cobre tudo, mas o Claude cobre a maior variedade e está mais próximo de ser um generalista.</p></li>
</ul>
<p>Quatro erros não foram detectados por todos os modelos. Um envolvia a prioridade da regra gramatical ANTLR. Um era uma incompatibilidade semântica de bloqueio de leitura/escrita entre funções. Um exigia a compreensão das diferenças de lógica de negócios entre os tipos de compactação. E uma era um erro de comparação silencioso em que uma variável usava megabytes e outra usava bytes.</p>
<p>O que estes quatro erros têm em comum é o facto de o código estar sintaticamente correto. Os erros residem em suposições que o programador tinha na cabeça, não na comparação e nem sequer no código circundante. É mais ou menos aqui que a revisão de código com IA atinge seu teto hoje.</p>
<h2 id="After-Finding-Bugs-Which-Model-is-the-Best-at-Fixing-Them" class="common-anchor-header">Depois de encontrar bugs, qual modelo é o melhor para corrigi-los?<button data-href="#After-Finding-Bugs-Which-Model-is-the-Best-at-Fixing-Them" class="anchor-icon" translate="no">
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
    </button></h2><p>Na revisão de código, encontrar bugs é metade do trabalho. A outra metade é corrigi-los. Por isso, após as rondas de debate, adicionei uma avaliação por pares para medir a utilidade das sugestões de correção de cada modelo.</p>
<p>Para medir isto, adicionei uma ronda de avaliação pelos pares após o debate. Cada modelo abriu uma nova sessão e agiu como um juiz anónimo, pontuando as avaliações dos outros modelos. Os cinco modelos foram mapeados aleatoriamente para o avaliador A/B/C/D/E, de modo que nenhum juiz sabia qual modelo produziu qual avaliação. Cada juiz pontuou em quatro dimensões, classificadas de 1 a 10: exatidão, capacidade de ação, profundidade e clareza.</p>
<table>
<thead>
<tr><th>Modelo</th><th>Precisão</th><th>Facilidade de ação</th><th>Profundidade</th><th>Clareza</th><th>Geral</th></tr>
</thead>
<tbody>
<tr><td>Qwen</td><td>8.6</td><td>8.6</td><td>8.5</td><td>8.7</td><td>8,6 (empatado em 1.º)</td></tr>
<tr><td>Claude</td><td>8.4</td><td>8.2</td><td>8.8</td><td>8.8</td><td>8,6 (empatado em 1º)</td></tr>
<tr><td>Códice</td><td>7.7</td><td>7.6</td><td>7.1</td><td>7.8</td><td>7.5</td></tr>
<tr><td>Gémeos</td><td>7.4</td><td>7.2</td><td>6.7</td><td>7.6</td><td>7.2</td></tr>
<tr><td>MiniMax</td><td>7.1</td><td>6.7</td><td>6.9</td><td>7.4</td><td>7.0</td></tr>
</tbody>
</table>
<p>Qwen e Claude empataram em primeiro lugar por uma margem clara. Ambos pontuaram consistentemente alto em todas as quatro dimensões, enquanto Codex, Gemini e MiniMax ficaram um ponto ou mais abaixo. Notavelmente, o Gemini, que provou ser um parceiro valioso na busca de bugs para o Claude na análise de emparelhamento, está perto do fundo do poço em qualidade de revisão. Ser bom a detetar problemas e ser bom a explicar como corrigi-los são evidentemente competências diferentes.</p>
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
    </button></h2><p><strong>O Claude</strong> é aquele a quem confiamos as revisões mais difíceis. Trabalha através de cadeias de chamadas inteiras, segue caminhos lógicos profundos e puxa o seu próprio contexto sem que seja necessário dar-lhe uma colher de chá. Nos bugs de nível de sistema L3, nada mais se aproxima. Por vezes, fica demasiado confiante com a matemática, mas quando outro modelo prova que está errado, assume-o e explica onde o seu raciocínio falhou. Utilize-o para o código principal e para os erros que não se pode dar ao luxo de perder.</p>
<p><strong>Gémeos</strong> vem em força. Tem opiniões fortes sobre o estilo de código e padrões de engenharia, e é rápido a enquadrar os problemas estruturalmente. A desvantagem é que muitas vezes fica na superfície e não se aprofunda o suficiente, e é por isso que teve uma pontuação baixa na avaliação dos colegas. Onde Gemini realmente ganha o seu lugar é como um desafiador: o seu empurrão obriga os outros modelos a verificar o seu trabalho. Emparelhe-o com o Claude para obter a perspetiva estrutural que Claude por vezes ignora.</p>
<p><strong>O Codex</strong> quase não diz uma palavra. Mas quando o faz, é importante. A sua taxa de acerto em bugs reais é elevada, e tem o dom de apanhar a única coisa que todos os outros ignoraram. No exemplo do PR #44474, o Codex foi o modelo que detectou o problema das chaves primárias de valor zero que deu início a toda a cadeia. Pense nele como o revisor suplementar que detecta o que o seu modelo principal não detectou.</p>
<p><strong>Qwen</strong> é o mais completo dos cinco. A sua qualidade de revisão é igual à do Claude, e é especialmente bom a juntar diferentes perspectivas em sugestões de correção que podem ser seguidas. Ele também teve a maior taxa de deteção de L2 no modo assistido por contexto, o que o torna um padrão sólido para revisões diárias de RP. O único ponto fraco: em debates longos e com várias rodadas, ele às vezes perde o controle do contexto anterior e começa a dar respostas inconsistentes em rodadas posteriores.</p>
<p><strong>O MiniMax</strong> foi o mais fraco a encontrar erros por si próprio. É melhor usado para preencher um grupo de vários modelos do que como um revisor autónomo.</p>
<h2 id="Limitations-of-This-Experiment" class="common-anchor-header">Limitações desta experiência<button data-href="#Limitations-of-This-Experiment" class="anchor-icon" translate="no">
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
    </button></h2><p>Algumas advertências para manter esta experiência em perspetiva:</p>
<p><strong>O tamanho da amostra é pequeno.</strong> Há apenas 15 PRs, todos do mesmo projeto Go/C++ (Milvus). Estes resultados não são generalizáveis para todas as linguagens ou bases de código. Trate-os como direcionais, não definitivos.</p>
<p><strong>Os modelos são inerentemente aleatórios.</strong> Executar o mesmo prompt duas vezes pode produzir resultados diferentes. Os números neste post são um único instantâneo, não um valor esperado estável. As classificações individuais dos modelos não devem ser levadas em consideração, embora as tendências mais amplas (o debate supera os indivíduos, modelos diferentes se destacam em diferentes tipos de erros) sejam consistentes.</p>
<p><strong>A ordem das intervenções foi corrigida.</strong> O debate usou a mesma ordem em todas as rondas, o que pode ter influenciado a forma como os modelos que falaram mais tarde responderam. Uma experiência futura poderia aleatorizar a ordem por ronda para controlar este facto.</p>
<h2 id="Try-it-yourself" class="common-anchor-header">Experimente você mesmo<button data-href="#Try-it-yourself" class="anchor-icon" translate="no">
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
    </button></h2><p>Todas as ferramentas e dados desta experiência são de código aberto:</p>
<ul>
<li><p><a href="https://github.com/liliu-z/magpie"><strong>Magpie</strong></a>: Uma ferramenta de código aberto que reúne o contexto do código (cadeias de chamadas, PRs relacionados, módulos afectados) e orquestra um debate contraditório multi-modelo para revisão do código.</p></li>
<li><p><a href="https://github.com/liliu-z/ai-code-review-arena"><strong>AI-CodeReview-Arena</strong></a>: O pipeline de avaliação completo, as configurações e os scripts.</p></li>
<li><p><a href="https://github.com/liliu-z/ai-code-review-arena/blob/main/prs/manifest.yaml"><strong>Casos de teste</strong></a>: Todos os 15 PRs com bugs conhecidos anotados.</p></li>
</ul>
<p>Os bugs neste experimento vieram todos de pull requests reais no <a href="https://github.com/milvus-io/milvus">Milvus</a>, um banco de dados vetorial de código aberto construído para aplicações de IA. Temos uma comunidade bastante ativa no <a href="https://discord.com/invite/8uyFbECzPX">Discord</a> e no <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack</a>, e gostaríamos de ter mais pessoas mexendo no código. E se acabar por executar este benchmark na sua própria base de código, por favor partilhe os resultados! Estou muito curioso para saber se as tendências se mantêm em diferentes linguagens e projectos.</p>
<h2 id="Keep-Reading" class="common-anchor-header">Continue lendo<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/glm5-vs-minimax-m25-vs-gemini-3-deep-think.md">GLM-5 vs. MiniMax M2.5 vs. Gemini 3 Pensamento profundo: Qual modelo se encaixa na sua pilha de agentes de IA?</a></p></li>
<li><p><a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">Adicionando memória persistente ao código Claude com o plug-in leve memsearch</a></p></li>
<li><p><a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">Extraímos o sistema de memória do OpenClaw e abrimos o seu código fonte (memsearch)</a></p></li>
</ul>
