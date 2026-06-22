---
id: when-ai-agents-do-the-work-what-do-we-lose.md
title: |
  Quando são os agentes de IA a fazer o trabalho, o que é que perdemos?
author: Bill Chen
date: 2026-06-18T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Jun_21_2026_10_34_48_PM_d223e44fc5.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'AI agents, agentic AI, AI coding agents, agent memory, LLM agents'
meta_title: |
  When AI Agents Do the Work, What Do We Lose?
desc: >
  Os agentes de IA estão a melhorar em termos de execução, memória e padrões.
  Mas, se eliminarem o ciclo de aprendizagem subjacente ao trabalho, o
  discernimento humano poderá deixar de evoluir.
origin: 'https://milvus.io/blog/when-ai-agents-do-the-work-what-do-we-lose.md'
---
<p>Os produtos de agentes estão a tornar-se cada vez mais eficientes no desempenho das tarefas.</p>
<p>O Claude Code consegue escrever e refatorar grandes blocos de código. O Cursor ajuda os programadores a percorrerem as bases de código mais rapidamente. O Devin e outros agentes orientados para tarefas tentam assumir fluxos de trabalho mais longos. Para além da programação, os agentes redigem e-mails, processam documentos, resumem dados, atualizam tickets e automatizam tarefas repetitivas que antes exigiam intervenção humana direta.</p>
<p>A maioria destes produtos faz a mesma promessa: forneça ao agente contexto suficiente e ele tratará de uma maior parte da execução por si. Essa promessa é útil, mas também levanta uma questão à qual os produtos de agentes ainda não responderam de forma completa: <strong>quando o agente faz mais parte do trabalho, o que é que perdemos?</strong></p>
<p>A resposta não é simplesmente «esforço manual». A tarefa pode estar concluída, mas o ser humano pode ter ignorado parte do processo que costumava desenvolver o discernimento: ler, rastrear, depurar, comparar opções, cometer erros e aprender por que razão uma solução é melhor do que outra.</p>
<p>Isto não significa que os agentes sejam maus para a aprendizagem. Significa que os produtos baseados em agentes precisam de ser concebidos tendo a aprendizagem em mente. Se se limitarem a otimizar apenas o resultado, podem retirar precisamente a experiência que ajuda os humanos a melhorar os padrões dos quais os agentes dependem.</p>
<p>Uma forma útil de pensar sobre este problema é recorrer à «escada da autonomia» dos sistemas de condução autónoma. A analogia não é perfeita, mas ajuda a distinguir diferentes tipos de progresso nos produtos baseados em agentes:</p>
<ul>
<li><strong>Os agentes de nível 1 executam tarefas.</strong> O ser humano dá instruções e o agente executa-as.</li>
<li><strong>Os agentes de nível L2 memorizam.</strong> Aprendem ao longo das sessões, armazenando preferências, correções e o contexto do projeto.</li>
<li><strong>Os agentes de nível 3 aplicam padrões.</strong> O ser humano define regras, restrições e critérios de decisão, em vez de orientar cada passo.</li>
<li><strong>Os agentes de nível 4 melhoram o ser humano.</strong> O agente não se limita a fazer o trabalho. Ajuda o ser humano a preservar e a aprofundar o seu discernimento.</li>
</ul>
<p>A maior parte do setor continua focada nos três primeiros níveis. Isso faz sentido. A execução, a memória e os padrões são problemas imediatos do produto. Mas é no nível L4 que surge o risco a longo prazo. Se os humanos deixarem de melhorar, os padrões que orientam os agentes também deixarão de melhorar.</p>
<h2 id="L1-Agents-execute" class="common-anchor-header">Nível 1: Os agentes executam<button data-href="#L1-Agents-execute" class="anchor-icon" translate="no">
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
    </button></h2><p>O desenvolvimento de aplicações de IA passou por várias camadas de abstração:</p>
<ul>
<li>No início, os programadores invocavam um modelo através de uma API: enviam texto, recebem texto de volta.</li>
<li>Depois surgiu <strong>a engenharia de prompts</strong>, em que a principal competência era aprender a fazer melhores perguntas.</li>
<li>Depois disso, surgiu <strong>a engenharia de contexto</strong>, em que a tarefa passou a ser fornecer ao modelo exemplos, restrições e antecedentes suficientes para que se comportasse de forma útil numa situação específica.</li>
<li>Depois surgiu <strong>a engenharia de harness</strong>: ligar modelos a ferramentas, fluxos de trabalho, ficheiros, bases de dados, navegadores, terminais e sistemas de produção.</li>
<li><strong>A engenharia de agentes</strong> baseia-se nisso. Em vez de pedir ao modelo para responder a um prompt, pedimos-lhe para planear passos, escolher ferramentas, inspecionar resultados, recuperar de erros e concluir tarefas de várias etapas com menos supervisão.</li>
</ul>
<p>A superfície técnica está em constante mudança, mas a relação básica no Nível 1 permanece a mesma: <strong>o ser humano define a tarefa e o agente executa-a.</strong> Cada interação continua a ser, na sua maioria, autónoma. A tarefa é concluída, a sessão termina e a tarefa seguinte começa do zero.</p>
<p>Este nível já funciona suficientemente bem para alterar o comportamento. Os agentes conseguem lidar com mais tarefas com menos esforço manual. À medida que se tornam mais baratos, mais rápidos e mais fiáveis, a produção aumenta enquanto os custos diminuem.</p>
<p>Mas uma execução mais fácil cria um novo estrangulamento. Cada sessão paralela continua a necessitar de um ser humano para explicar a tarefa, fornecer contexto, rever o resultado, avaliar a qualidade e decidir o que fazer a seguir. O agente pode estar a fazer o trabalho, mas o ser humano continua a ser responsável por determinar se o trabalho está bem feito.</p>
<p><strong>A execução torna-se mais económica. O julgamento torna-se mais importante.</strong></p>
<h2 id="L2-Agents-remember" class="common-anchor-header">Nível 2: Os agentes memorizam<button data-href="#L2-Agents-remember" class="anchor-icon" translate="no">
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
    </button></h2><p>O L1 resolve a tarefa que tem diante de si. O L2 coloca uma questão diferente: <strong>será que o agente consegue aprender com esta interação para que a próxima corra melhor?</strong></p>
<p>Um agente L1 puro não mantém estado. Assim que a sessão termina, o contexto desaparece. A tarefa seguinte começa do zero. Os agentes L2 quebram esse padrão ao acumular experiência ao longo das sessões. Eles lembram-se das preferências do utilizador, das convenções do projeto, do feedback recorrente, das decisões anteriores e dos padrões de trabalho do utilizador. <strong>O objetivo é transformar a experiência gerada através da interação entre humanos e agentes num recurso reutilizável.</strong></p>
<p>É também por isso que a memória do agente não deve ser tratada como um prompt mais longo ou uma pasta de transcrições guardadas. Uma memória útil requer infraestrutura: armazenamento duradouro, recuperação semântica, deduplicação, atualizações e uma forma de separar o contexto obsoleto do conhecimento ainda útil. É aqui que o nosso trabalho na <a href="https://zilliz.com/">Zilliz</a> se relaciona com o problema. <a href="https://milvus.io/">O Milvus</a> e os seus serviços geridos, o Zilliz Cloud, construídos em torno dele, são frequentemente utilizados como camada de recuperação para a memória do agente, porque tornam o contexto passado pesquisável, em vez de meramente arquivado.</p>
<p><strong>Mas a memória de nível 2 tem um limite estrutural.</strong> A maior parte do que os agentes aprendem nesta fase provém do comportamento observável: o que o utilizador disse, alterou, aceitou, rejeitou ou corrigiu. Um agente pode lembrar-se de que reescreveste um parágrafo, rejeitaste uma implementação ou alteraste a assinatura de uma função. Pode não compreender o porquê.</p>
<p>A questão foi a precisão, o tom, a facilidade de manutenção, o risco de segurança, o desempenho, o posicionamento do produto ou outra coisa qualquer? O comportamento é a superfície visível do julgamento. O raciocínio subjacente permanece frequentemente oculto.</p>
<p>Isso torna o Nível 2 mais eficaz a captar conhecimento explícito do que conhecimento tácito. Consegue lembrar-se das regras que definiu diretamente e armazenar exemplos de decisões passadas. Mas os exemplos não se tornam automaticamente princípios. O agente pode lembrar-se do que aconteceu sem compreender o padrão subjacente.</p>
<p>Essa lacuna conduz ao L3.</p>
<h2 id="L3-Agents-apply-standards" class="common-anchor-header">L3: Os agentes aplicam padrões<button data-href="#L3-Agents-apply-standards" class="anchor-icon" translate="no">
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
    </button></h2><p>Assim que o L1 e o L2 começam a funcionar, o próximo passo óbvio é o paralelismo.</p>
<p>Se um agente consegue concluir uma tarefa, por que não executar dez? Se um agente consegue aprender com uma sessão, por que não abrir várias sessões e deixar que todas produzam trabalho ao mesmo tempo? Esta é a lógica do «engenheiro 10x» ou «engenheiro 100x»: usar agentes para multiplicar a produção.</p>
<p>Na prática, o paralelismo gera os seus próprios custos. Cada sessão continua a exigir que o ser humano mude de contexto, compreenda o problema, reveja o trabalho, dê feedback e decida se o resultado é suficientemente bom. A partir de um certo ponto, ter mais agentes deixa de parecer uma vantagem e passa a parecer um encargo.</p>
<p>Isto não é apenas um problema de fluxo de trabalho. É uma barreira cognitiva. Os seres humanos não lidam com tarefas paralelas da mesma forma que as máquinas. A alternância entre tarefas esgota a atenção. A memória de trabalho é limitada. Cada mudança aumenta a probabilidade de deixar escapar detalhes, aplicar o padrão errado ou aprovar o trabalho demasiado depressa.</p>
<p><strong>Um bom produto não deve lutar contra este limite. Deve ser concebido à sua volta.</strong></p>
<p>No Nível 3, a orientação passa de «resolva este problema específico desta forma específica» para «eis os padrões que deve aplicar». O ser humano deixa de ser o operador que orienta cada passo e torna-se a pessoa que define regras, restrições, preferências, padrões de qualidade e critérios de decisão.</p>
<p>Um utilizador pode continuar a orientar um agente numa tarefa específica, mas o valor dessa orientação não deve desaparecer com o fim da sessão. A interação deve deixar para trás um padrão reutilizável, não apenas um registo. Da próxima vez que surgir uma tarefa semelhante, o agente deve aplicar o padrão sem pedir ao ser humano que reconstrua todo o contexto e volte a tomar a mesma decisão.</p>
<p>O setor já está a avançar nessa direção. Muitos produtos de agentes permitem que os utilizadores definam regras, instruções, memórias, convenções de projeto e preferências de comportamento. A direção está correta, mas a maioria das implementações ainda se encontra numa fase inicial. As regras são frequentemente texto estático: atualizadas manualmente, fragmentadas e apenas vagamente ligadas ao raciocínio subjacente às decisões de um utilizador.</p>
<p>O padrão mais sólido é um modelo de cognição pessoal continuamente atualizado: uma representação legível por máquinas de como uma pessoa avalia, decide e faz compromissos. Deve codificar preferências, valores, restrições, exceções, normas e estilo de decisão como contexto que os agentes possam recuperar e aplicar.</p>
<p>Em vez de se limitar a armazenar conversas passadas, deve tornar o raciocínio do utilizador legível para as máquinas.</p>
<p>A função do utilizador muda em conformidade. Em vez de explicar cada tarefa a partir do zero, o utilizador mantém o modelo, aperfeiçoando padrões, atualizando preferências, corrigindo pressupostos e tornando explícito o julgamento implícito. Num certo sentido, o utilizador está continuamente a tokenizar-se a si próprio: a converter cada vez mais o seu raciocínio numa forma que os agentes possam utilizar.</p>
<p>Quando a execução é económica, o ser humano não precisa de decidir todos os pormenores de implementação antes do início de uma tarefa. O ser humano precisa de definir o que é considerado bom, o que é inaceitável e como as compensações devem ser geridas.</p>
<h2 id="L4-Agents-preserve-human-learning" class="common-anchor-header">Nível 4: Os agentes preservam a aprendizagem humana<button data-href="#L4-Agents-preserve-human-learning" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Os três primeiros níveis centram-se em fazer com que os agentes sirvam melhor os humanos. O Nível 4 inverte a questão: como podem os agentes ajudar os humanos a melhorarem?</strong></p>
<p>Esta é a parte que a maioria dos produtos de agentes ainda não abordou de forma completa. Quando os agentes fazem mais trabalho por nós, o que é que desaparece exatamente do lado humano do ciclo?</p>
<p>À primeira vista, perdemos o esforço manual. Esse é o benefício óbvio. Mas também podemos perder três aspetos menos visíveis: a memória contextual do trabalho, a prática na tomada de compromissos e o reconhecimento de padrões que advém da exposição repetida a detalhes complexos.</p>
<p><strong>Senti isto diretamente na programação.</strong> Quando escrevia código sozinho, lembrava-me de onde cada linha se situava e de como o sistema funcionava, porque tinha passado tempo a ler, a depurar, a rastrear e a corrigi-lo manualmente. Esse processo não se limitou a produzir código. Treinou o meu cérebro para reconhecer a estrutura.</p>
<p>Com o Claude Code, o código continua a ser produzido, muitas vezes mais rapidamente. Mas, passado algum tempo, a minha memória do sistema não é tão profunda. Posso saber o que o sistema faz, mas nem sempre me lembro de como cada parte se encaixava. A experiência de construção fica comprimida e parte da aprendizagem desaparece com ela.</p>
<p>Isso não é um argumento contra os agentes de programação. É um argumento de que os produtos criados por agentes precisam de preservar as partes do trabalho que desenvolvem o discernimento humano.</p>
<p>O mesmo padrão repete-se fora da programação. Se um agente redigir todos os memorandos estratégicos, o ser humano pode perder a prática de estruturar um argumento. Se um agente resumir todos os artigos, o ser humano pode perder o hábito de perceber o que o resumo omitiu. Se um agente tratar de todas as decisões operacionais, o ser humano pode deixar de desenvolver a intuição que advém de lidar com exceções complexas.</p>
<p>O trabalho desaparece. O resultado permanece. Mas o ciclo de aprendizagem pode enfraquecer.</p>
<p>Esse é o problema do Nível 4.</p>
<h2 id="Human-judgment-is-the-ceiling" class="common-anchor-header">O julgamento humano é o limite<button data-href="#Human-judgment-is-the-ceiling" class="anchor-icon" translate="no">
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
    </button></h2><p>Esta perda é importante porque os agentes não operam no vácuo. Um agente é um multiplicador, não um substituto. A mesma ferramenta produz resultados muito diferentes nas mãos de um especialista e de um principiante. Um engenheiro sénior com um agente pode tornar-se drasticamente mais eficaz. Um principiante pode simplesmente produzir mais resultados sem desenvolver um melhor discernimento.</p>
<p>Os agentes amplificam o nível cognitivo existente do utilizador.</p>
<p>Isso é importante porque o L3 depende de que os humanos definam as normas que os agentes devem seguir. Mas a qualidade dessas normas depende da qualidade do julgamento humano. Se o humano deixar de melhorar, as normas acabam por ficar desatualizadas. Tornam-se incompletas, superficiais ou desalinhadas com a realidade atual do trabalho.</p>
<p>O sistema funciona melhor como um ciclo:</p>
<ul>
<li>O discernimento humano define as normas.</li>
<li>Os agentes executam de acordo com esses padrões.</li>
<li>Os resultados da execução alimentam a aprendizagem humana.</li>
<li>A aprendizagem humana melhora os padrões.</li>
</ul>
<p>Se o ciclo funcionar, ambas as partes melhoram. O agente executa de forma mais eficaz e o ser humano torna-se mais competente a definir o que significa «eficaz». Se o ciclo se quebrar, o sistema degrada-se. O julgamento humano estagna. Os padrões tornam-se desatualizados. Os agentes continuam a otimizar, mas fazem-no dentro de um quadro que está lentamente a ficar para trás.</p>
<p>É por isso que o julgamento humano representa o limite máximo. Agentes mais fortes não eliminam a necessidade de humanos mais fortes. Tornam a qualidade do julgamento humano ainda mais importante, porque esse julgamento passa a ser o quadro dentro do qual o agente opera.</p>
<h2 id="Why-agents-cannot-solve-the-whole-problem-alone" class="common-anchor-header">Por que razão os agentes não conseguem resolver o problema na totalidade sozinhos<button data-href="#Why-agents-cannot-solve-the-whole-problem-alone" class="anchor-icon" translate="no">
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
    </button></h2><p>Uma resposta é óbvia: os agentes continuarão a tornar-se mais fortes, pelo que talvez acabem por gerar, por si próprios, melhor conhecimento, melhores regras e melhores padrões.</p>
<p>Há alguma verdade nisso. Os agentes já são bons a combinar ideias, a explorar espaços de soluções e a revelar caminhos que os humanos podem não ter considerado. Um modelo pode produzir frases, designs e soluções que nunca apareceram nos seus dados de treino. Pode recombinar padrões entre domínios e gerar alternativas úteis.</p>
<p>Esse é o verdadeiro valor. Mas o Nível 4 (L4) diz respeito a um tipo diferente de criação. A questão não é apenas quem consegue encontrar uma resposta melhor. É quem consegue fazer uma nova pergunta, reescrever o padrão ou expandir o espaço do problema.</p>
<p>Os agentes são bons a generalizar, combinar e pesquisar dentro de uma distribuição existente. Conseguem encontrar melhores caminhos em terreno conhecido, por vezes caminhos que os humanos ainda não experimentaram. Mas decidir se o próprio terreno deve ser redesenhado é outra coisa.</p>
<p>Esse tipo de decisão provém frequentemente do contexto humano: restrições vividas, interesses pessoais, curiosidade, insatisfação e o custo de estar errado. Uma pessoa pode formular uma hipótese que viole o quadro atual e testá-la contra a realidade. Mais importante ainda, uma pessoa pode ter uma razão para continuar a testar quando a ideia parece errada, arriscada ou inútil à primeira vista.</p>
<p>A geometria não euclidiana é um exemplo útil. O passo importante não foi simplesmente perguntar: «E se as linhas paralelas se cruzassem?» Um agente poderia gerar essa frase. O passo importante foi tratar essa suposição estranha como algo que valia a pena investigar e, em seguida, seguir as suas consequências até que se tornasse um novo espaço teórico. Isso exigiu persistência, interesses em jogo e uma razão para se preocupar com o resultado.</p>
<p>O quadro de referência da criatividade de Margaret Boden é útil neste contexto. Ela distingue três tipos de criatividade:</p>
<ul>
<li><strong>Criatividade combinatória:</strong> combinar ideias familiares de novas formas.</li>
<li><strong>Criatividade exploratória:</strong> pesquisar dentro de um espaço conceptual existente.</li>
<li><strong>Criatividade transformacional:</strong> alterar as regras do próprio espaço conceptual.</li>
</ul>
<p>Os agentes já são fortes nos dois primeiros modos. Combinam ideias existentes e exploram dentro de espaços conceptuais existentes. O terceiro modo é mais difícil. A criatividade transformacional depende de mais do que uma pesquisa mais rápida. Depende da razão pela qual alguém opta por rejeitar uma regra antiga, aceitar o custo do fracasso e continuar a testar uma ideia que ainda não se encaixa.</p>
<p><strong>A afirmação mais precisa é esta: os agentes são mais fortes a combinar e a explorar dentro de espaços existentes. Novos conhecimentos fundamentais, novos espaços de problemas e novos quadros de valores continuam a depender fortemente dos seres humanos.</strong></p>
<h2 id="Design-for-the-loop-not-just-the-output" class="common-anchor-header">Conceba para o ciclo, não apenas para o resultado<button data-href="#Design-for-the-loop-not-just-the-output" class="anchor-icon" translate="no">
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
    </button></h2><p>Nem todos os produtos de agentes precisam de resolver o Nível 4. Alguns produtos precisam apenas de ajudar os utilizadores a realizar tarefas mais rapidamente. Isso é aceitável. Outros precisam de memória, normas e uma melhor integração do fluxo de trabalho.</p>
<p>Mas, ao nível do ecossistema, alguns produtos precisam de preservar o ciclo de aprendizagem. Se todos os produtos de agentes ajudarem as pessoas a fazer menos trabalho e nenhum as ajudar a continuar a aprender depois de deixarem de realizar o trabalho diretamente, a capacidade humana enfraquece com o tempo. O espaço de otimização para os agentes deixa de se expandir. Todo o sistema permanece limitado pelo nível atual de julgamento humano.</p>
<p>É aqui que o design do produto se torna importante. O Nível 4 não se resume a pedir ao agente que resuma o que fez. Um produto útil de Nível 4 preserva as partes do trabalho que desenvolvem o julgamento humano, mesmo quando o agente se encarrega da maior parte da execução.</p>
<p>Existem alguns padrões de produto que são importantes neste contexto:</p>
<ul>
<li><strong>Preservar pontos-chave de julgamento.</strong> Algumas decisões devem permanecer visíveis para o ser humano, não porque o agente não as consiga tomar, mas porque essas decisões treinam o julgamento. O produto deve identificar quais os momentos que importam e mantê-los deliberados.</li>
<li><strong>Reconstruir o processo, não apenas o resultado.</strong> Um produto finalizado não é suficiente. O sistema deve revelar os principais ramos de decisão, as compensações, os caminhos alternativos e as tentativas falhadas. Um utilizador que apenas vê o resultado pode aprová-lo ou rejeitá-lo. Um utilizador que vê o raciocínio por trás do resultado pode atualizar o seu modelo mental.</li>
<li><strong>Apoiar a exploração colaborativa.</strong> Quando o utilizador está incerto, o agente não deve avançar diretamente para uma resposta. Deve ajudar a expandir o espaço do problema: que dimensões são importantes, que pressupostos faltam, que informação ainda é necessária e que custos cada opção acarreta.</li>
<li><strong>Desafiar as suposições humanas.</strong> Isto não significa contestar apenas pelo prazer de discordar. Significa reconhecer lacunas ou tensões no raciocínio do utilizador e fazer perguntas específicas que tornem essas tensões visíveis.</li>
</ul>
<p>O objetivo não é forçar os humanos a voltar a realizar cada passo manualmente. Isso iria contra o propósito dos agentes. O objetivo é preservar as partes do trabalho que transformam a experiência em julgamento.</p>
<p>Os produtos baseados em agentes não devem otimizar apenas a produção. Devem otimizar o ciclo de feedback: melhor julgamento humano, melhores padrões, melhor execução por parte dos agentes e melhor aprendizagem humana a partir dos resultados.</p>
<p><strong>Quando os agentes de IA realizam o trabalho, não devemos perder o ciclo que, em primeiro lugar, tornou os humanos melhores nesse trabalho.</strong></p>
<h2 id="We’d-love-to-hear-your-thoughts" class="common-anchor-header">Adoraríamos ouvir a sua opinião<button data-href="#We’d-love-to-hear-your-thoughts" class="anchor-icon" translate="no">
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
    </button></h2><p>Se está a desenvolver agentes, adoraria saber a sua opinião sobre isto: que partes do trabalho devem ser totalmente assumidas pelos agentes e que partes devem permanecer visíveis, uma vez que ajudam os humanos a continuarem a melhorar?</p>
