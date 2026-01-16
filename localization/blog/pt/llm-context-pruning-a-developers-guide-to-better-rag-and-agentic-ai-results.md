---
id: llm-context-pruning-a-developers-guide-to-better-rag-and-agentic-ai-results.md
title: >-
  Poda de contexto LLM: Um guia do programador para obter melhores resultados de
  RAG e IA agêntica
author: Cheney Zhang
date: 2026-01-15T00:00:00.000Z
cover: assets.zilliz.com/context_pruning_cover_d1b034ba67.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Context Pruning, RAG, long context LLMs, context engineering'
meta_title: |
  LLM Context Pruning: Improving RAG and Agentic AI Systems
desc: >-
  Saiba como funciona a poda de contexto em sistemas RAG de contexto longo,
  porque é importante e como modelos como o Provence permitem a filtragem
  semântica e funcionam na prática.
origin: >-
  https://milvus.io/blog/llm-context-pruning-a-developers-guide-to-better-rag-and-agentic-ai-results.md
---
<p>As janelas de contexto nos LLMs têm-se tornado enormes ultimamente. Alguns modelos podem pegar um milhão de tokens ou mais em uma única passagem, e cada nova versão parece aumentar esse número. É empolgante, mas se você já construiu algo que usa contexto longo, sabe que há uma lacuna entre o que é <em>possível</em> e o que é <em>útil</em>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/LLM_Leaderboard_7c64e4a18c.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Só porque um modelo <em>consegue</em> ler um livro inteiro numa única mensagem, não significa que lhe deva dar uma. A maioria das entradas longas está cheia de coisas de que o modelo não precisa. Quando se começa a despejar centenas de milhares de tokens num prompt, normalmente obtêm-se respostas mais lentas, custos de computação mais elevados e, por vezes, respostas de menor qualidade, porque o modelo está a tentar prestar atenção a tudo ao mesmo tempo.</p>
<p>Assim, apesar de as janelas de contexto estarem cada vez maiores, a verdadeira questão é: <strong>o que é que devemos realmente colocar lá?</strong> É aí que entra a <strong>poda de contexto</strong>. Basicamente, é o processo de cortar as partes do contexto recuperado ou montado que não ajudam o modelo a responder à pergunta. Feito corretamente, ele mantém seu sistema rápido, estável e muito mais previsível.</p>
<p>Neste artigo, falaremos sobre por que o contexto longo geralmente se comporta de maneira diferente do esperado, como a poda ajuda a manter as coisas sob controle e como as ferramentas de poda, como o <strong>Provence</strong>, se encaixam em pipelines RAG reais sem complicar sua configuração.</p>
<h2 id="Four-Common-Failure-Modes-in-Long-Context-Systems" class="common-anchor-header">Quatro modos de falha comuns em sistemas de contexto longo<button data-href="#Four-Common-Failure-Modes-in-Long-Context-Systems" class="anchor-icon" translate="no">
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
    </button></h2><p>Uma janela de contexto maior não torna o modelo magicamente mais inteligente. Na verdade, quando se começa a colocar uma tonelada de informações no prompt, abre-se um conjunto totalmente novo de maneiras pelas quais as coisas podem dar errado. Aqui estão quatro problemas que se vêem constantemente quando se constroem sistemas de contexto longo ou RAG.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Four_Failure_Modes_e9b9bcb3b2.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="1-Context-Clash" class="common-anchor-header">1. Conflito de contextos</h3><p>O conflito de contextos ocorre quando a informação acumulada em vários turnos se torna internamente contraditória.</p>
<p>Por exemplo, um utilizador pode dizer "gosto de maçãs" no início de uma conversa e mais tarde afirmar "não gosto de fruta". Quando ambas as afirmações permanecem no contexto, o modelo não tem uma forma fiável de resolver o conflito, o que leva a respostas inconsistentes ou hesitantes.</p>
<h3 id="2-Context-Confusion" class="common-anchor-header">2. Confusão de contexto</h3><p>A confusão de contexto surge quando o contexto contém grandes quantidades de informação irrelevante ou pouco relacionada, tornando difícil para o modelo selecionar a ação ou ferramenta correta.</p>
<p>Este problema é especialmente visível em sistemas com ferramentas. Quando o contexto está cheio de pormenores não relacionados, o modelo pode interpretar mal a intenção do utilizador e selecionar a ferramenta ou ação errada - não porque falte a opção correta, mas porque o sinal está escondido no ruído.</p>
<h3 id="3-Context-Distraction" class="common-anchor-header">3. Distração de contexto</h3><p>A distração do contexto ocorre quando o excesso de informação contextual domina a atenção do modelo, reduzindo a sua confiança no conhecimento pré-treinado e no raciocínio geral.</p>
<p>Em vez de se basear em padrões amplamente aprendidos, o modelo dá demasiada importância aos pormenores recentes do contexto, mesmo quando estes são incompletos ou pouco fiáveis. Isto pode levar a um raciocínio superficial ou frágil que espelha demasiado o contexto em vez de aplicar uma compreensão de nível superior.</p>
<h3 id="4-Context-Poisoning" class="common-anchor-header">4. Envenenamento do contexto</h3><p>O envenenamento do contexto ocorre quando uma informação incorrecta entra no contexto e é repetidamente referenciada e reforçada ao longo de vários turnos.</p>
<p>Uma única afirmação falsa introduzida no início da conversa pode tornar-se a base do raciocínio subsequente. À medida que o diálogo prossegue, o modelo baseia-se neste pressuposto errado, agravando o erro e afastando-se ainda mais da resposta correta.</p>
<h2 id="What-Is-Context-Pruning-and-Why-It-Matters" class="common-anchor-header">O que é a poda de contexto e porque é importante<button data-href="#What-Is-Context-Pruning-and-Why-It-Matters" class="anchor-icon" translate="no">
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
    </button></h2><p>Quando se começa a lidar com contextos longos, rapidamente se percebe que é necessário mais do que um truque para manter as coisas sob controlo. Em sistemas reais, as equipas normalmente combinam uma série de tácticas - RAG, carregamento de ferramentas, resumo, quarentena de certas mensagens, descarregamento de histórico antigo, etc. Todas elas ajudam de formas diferentes. Mas <strong>a poda de contexto</strong> é a que decide diretamente <em>o que é realmente introduzido</em> no modelo.</p>
<p>A poda de contexto, em termos simples, é o processo de remoção automática de informações irrelevantes, de baixo valor ou conflituosas antes de entrarem na janela de contexto do modelo. Basicamente, é um filtro que mantém apenas as partes do texto com maior probabilidade de serem importantes para a tarefa atual.</p>
<p>Outras estratégias podem reorganizar o contexto, comprimi-lo ou deixar algumas partes de lado para mais tarde. A poda é mais direta: <strong>responde à pergunta: "Esta informação deve ser incluída no texto?"</strong></p>
<p>É por isso que a poda acaba por ser especialmente importante nos sistemas RAG. A pesquisa vetorial é óptima, mas não é perfeita. Muitas vezes, devolve uma grande quantidade de candidatos - alguns úteis, outros pouco relacionados, outros completamente fora de contexto. Se simplesmente despejar todos eles no prompt, vai atingir os modos de falha que abordámos anteriormente. A poda situa-se entre a recuperação e o modelo, actuando como um guardião que decide quais os pedaços a manter.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/RAG_Pipeline_with_Context_Pruning_01a0d40819.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Quando a poda funciona bem, os benefícios aparecem imediatamente: contexto mais limpo, respostas mais consistentes, menor uso de tokens e menos efeitos colaterais estranhos de texto irrelevante. Mesmo que não mude nada na sua configuração de recuperação, adicionar um passo de poda sólido pode melhorar visivelmente o desempenho geral do sistema.</p>
<p>Na prática, a poda é uma das optimizações mais importantes num pipeline de contexto longo ou RAG - ideia simples, grande impacto.</p>
<h2 id="Provence-A-Practical-Context-Pruning-Model" class="common-anchor-header">Provence: Um modelo prático de poda de contexto<button data-href="#Provence-A-Practical-Context-Pruning-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>Ao explorar abordagens à poda de contexto, deparei-me com dois modelos de código aberto interessantes desenvolvidos nos <strong>Naver Labs Europe</strong>: <a href="https://huggingface.co/naver/provence-reranker-debertav3-v1"><strong>Provence</strong></a> e a sua variante multilingue, <a href="https://huggingface.co/naver/xprovence-reranker-bgem3-v1"><strong>XProvence</strong></a>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/provence1_b9d2c43276.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>O Provence é um método para treinar um modelo leve de poda de contexto para a geração aumentada por recuperação, com um foco particular na resposta a perguntas. Dada uma pergunta do utilizador e uma passagem recuperada, identifica e remove frases irrelevantes, mantendo apenas a informação que contribui para a resposta final.</p>
<p>Ao eliminar o conteúdo de baixo valor antes da geração, o Provence reduz o ruído na entrada do modelo, encurta os avisos e diminui a latência da inferência LLM. Também é "plug-and-play", funcionando com qualquer LLM ou sistema de recuperação sem exigir uma integração rigorosa ou alterações arquitectónicas.</p>
<p>O Provence oferece vários recursos práticos para pipelines RAG do mundo real.</p>
<p><strong>1. Compreensão ao nível do documento</strong></p>
<p>O Provence raciocina sobre documentos como um todo, em vez de pontuar frases isoladamente. Isto é importante porque os documentos do mundo real contêm frequentemente referências como "isto", "isto" ou "o método acima". Isoladamente, estas frases podem ser ambíguas ou mesmo sem sentido. Quando vistas em contexto, a sua relevância torna-se clara. Ao modelar o documento de forma holística, o Provence produz decisões de poda mais exactas e coerentes.</p>
<p><strong>2. Seleção adaptativa de frases</strong></p>
<p>O Provence determina automaticamente quantas frases devem ser mantidas de um documento recuperado. Em vez de se basear em regras fixas como "manter as cinco primeiras frases", adapta-se à pergunta e ao conteúdo.</p>
<p>Algumas perguntas podem ser respondidas com uma única frase, enquanto outras requerem várias declarações de apoio. O Provence lida com esta variação de forma dinâmica, utilizando um limiar de relevância que funciona bem em todos os domínios e pode ser ajustado quando necessário - sem afinação manual na maioria dos casos.</p>
<p><strong>3. Elevada eficiência com reanálise integrada</strong></p>
<p>O Provence foi concebido para ser eficiente. É um modelo compacto e leve, o que o torna significativamente mais rápido e mais barato de executar do que as abordagens de poda baseadas em LLM.</p>
<p>Mais importante ainda, o Provence pode combinar a reordenação e a poda de contexto num único passo. Uma vez que a reordenação já é uma etapa normal nas linhas de processamento RAG modernas, a integração da poda neste ponto torna o custo adicional da poda de contexto próximo de zero, melhorando simultaneamente a qualidade do contexto transmitido ao modelo de linguagem.</p>
<p><strong>4. Suporte multilingue via XProvence</strong></p>
<p>O Provence também tem uma variante chamada XProvence, que utiliza a mesma arquitetura mas é treinada em dados multilingues. Isto permite-lhe avaliar consultas e documentos em vários idiomas - como o chinês, o inglês e o coreano - tornando-o adequado para sistemas RAG multilingues e multilingues.</p>
<h3 id="How-Provence-Is-Trained" class="common-anchor-header">Como Provence é treinado</h3><p>O Provence utiliza um design de formação simples e eficaz baseado numa arquitetura de codificação cruzada. Durante o treino, a consulta e cada passagem recuperada são concatenadas numa única entrada e codificadas em conjunto. Isto permite ao modelo observar o contexto completo da pergunta e da passagem de uma só vez e raciocinar diretamente sobre a sua relevância.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/provence2_80523f7a9e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Esta codificação conjunta permite que o Provence aprenda a partir de sinais de relevância de grão fino. O modelo é ajustado no <a href="https://zilliz.com/ai-faq/what-is-the-difference-between-bert-roberta-and-deberta-for-embeddings"><strong>DeBERTa</strong></a> como um codificador leve e optimizado para realizar duas tarefas em simultâneo:</p>
<ol>
<li><p><strong>Pontuação de relevância ao nível do documento (pontuação rerank):</strong> O modelo prevê uma pontuação de relevância para todo o documento, indicando o grau de correspondência com a consulta. Por exemplo, uma pontuação de 0,8 representa uma forte relevância.</p></li>
<li><p><strong>Marcação da relevância ao nível dos tokens (máscara binária):</strong> Em paralelo, o modelo atribui uma etiqueta binária a cada token, marcando se é relevante (<code translate="no">1</code>) ou irrelevante (<code translate="no">0</code>) para a consulta.</p></li>
</ol>
<p>Como resultado, o modelo treinado pode avaliar a relevância global de um documento e identificar as partes que devem ser mantidas ou removidas.</p>
<p>No momento da inferência, o Provence prevê etiquetas de relevância ao nível dos tokens. Estas previsões são depois agregadas ao nível da frase: uma frase é mantida se contiver mais tokens relevantes do que irrelevantes; caso contrário, é eliminada. Uma vez que o modelo é treinado com supervisão ao nível da frase, as previsões de tokens dentro da mesma frase tendem a ser consistentes, tornando esta estratégia de agregação fiável na prática. O comportamento de poda também pode ser ajustado, ajustando o limiar de agregação para obter uma poda mais conservadora ou mais agressiva.</p>
<p>Crucialmente, o Provence reutiliza o passo de reanálise que a maioria dos pipelines RAG já inclui. Isso significa que a poda de contexto pode ser adicionada com pouca ou nenhuma sobrecarga adicional, tornando o Provence especialmente prático para sistemas RAG do mundo real.</p>
<h2 id="Evaluating-Context-Pruning-Performance-Across-Models" class="common-anchor-header">Avaliação do desempenho da poda de contexto nos modelos<button data-href="#Evaluating-Context-Pruning-Performance-Across-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>Até agora, concentrámo-nos no design e na formação do Provence. O próximo passo é avaliar o seu desempenho na prática: até que ponto ele poda o contexto, como se compara com outras abordagens e como se comporta em condições do mundo real.</p>
<p>Para responder a estas questões, concebemos um conjunto de experiências quantitativas para comparar a qualidade da poda de contexto entre vários modelos em cenários de avaliação realistas.</p>
<p>As experiências centram-se em dois objectivos principais:</p>
<ul>
<li><p><strong>Eficácia da poda:</strong> Medimos a precisão com que cada modelo retém o conteúdo relevante enquanto remove informações irrelevantes, usando métricas padrão como Precisão, Recuperação e pontuação F1.</p></li>
<li><p><strong>Generalização fora do domínio:</strong> Avaliamos o desempenho de cada modelo em distribuições de dados que diferem dos dados de treino, avaliando a robustez em cenários fora do domínio.</p></li>
</ul>
<h3 id="Models-Compared" class="common-anchor-header">Modelos comparados</h3><ul>
<li><p><a href="https://huggingface.co/naver/provence-reranker-debertav3-v1"><strong>Provence</strong></a></p></li>
<li><p><a href="https://huggingface.co/naver/xprovence-reranker-bgem3-v1"><strong>XProvence</strong></a></p></li>
<li><p><a href="https://huggingface.co/opensearch-project/opensearch-semantic-highlighter-v1"><strong>OpenSearch Semantic Highlighter</strong></a> (Um modelo de poda baseado numa arquitetura BERT, concebido especificamente para tarefas de realce semântico)</p></li>
</ul>
<h3 id="Dataset" class="common-anchor-header">Conjunto de dados</h3><p>Utilizamos o WikiText-2 como conjunto de dados de avaliação. O WikiText-2 é derivado de artigos da Wikipédia e contém diversas estruturas de documentos, em que a informação relevante está frequentemente espalhada por várias frases e as relações semânticas podem não ser triviais.</p>
<p>É importante notar que o WikiText-2 difere substancialmente dos dados normalmente utilizados para treinar modelos de poda de contexto, embora continue a assemelhar-se a conteúdos do mundo real com muito conhecimento. Isto torna-o adequado para a avaliação fora do domínio, que é um dos principais objectivos das nossas experiências.</p>
<h3 id="Query-Generation-and-Annotation" class="common-anchor-header">Geração de consultas e anotação</h3><p>Para construir uma tarefa de poda fora do domínio, geramos automaticamente pares pergunta-resposta a partir do corpus WikiText-2 em bruto, utilizando <strong>o GPT-4o-mini</strong>. Cada amostra de avaliação é constituída por três componentes:</p>
<ul>
<li><p><strong>Pergunta:</strong> Uma pergunta em linguagem natural gerada a partir do documento.</p></li>
<li><p><strong>Contexto:</strong> O documento completo, não modificado.</p></li>
<li><p><strong>Verdade fundamental:</strong> anotações ao nível das frases que indicam quais as frases que contêm a resposta (a reter) e quais as que são irrelevantes (a eliminar).</p></li>
</ul>
<p>Esta configuração define naturalmente uma tarefa de eliminação de contexto: dada uma consulta e um documento completo, o modelo deve identificar as frases que realmente interessam. As frases que contêm a resposta são rotuladas como relevantes e devem ser mantidas, enquanto todas as outras frases são tratadas como irrelevantes e devem ser eliminadas. Esta formulação permite medir quantitativamente a qualidade da poda utilizando a precisão, a recuperação e a pontuação F1.</p>
<p>O mais importante é que as perguntas geradas não aparecem nos dados de treino de nenhum modelo avaliado. Como resultado, o desempenho reflecte a verdadeira generalização e não a memorização. No total, geramos 300 amostras, abrangendo perguntas simples baseadas em factos, tarefas de raciocínio multi-hop e pedidos analíticos mais complexos, de modo a refletir melhor os padrões de utilização do mundo real.</p>
<h3 id="Evaluation-Pipeline" class="common-anchor-header">Pipeline de avaliação</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/pipeline_77e52002fc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Otimização de hiperparâmetros: Para cada modelo, efectuamos uma pesquisa em grelha num espaço de hiperparâmetros predefinido e seleccionamos a configuração que maximiza a pontuação F1.</p>
<h3 id="Results-and-Analysis" class="common-anchor-header">Resultados e análise</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/result_0df098152a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Os resultados revelam diferenças claras de desempenho entre os três modelos.</p>
<p><strong>O Provence</strong> obtém o melhor desempenho global, com uma <strong>pontuação F1 de 66,76%</strong>. A sua Precisão<strong>(69,53%</strong>) e Recuperação<strong>(64,19%</strong>) são bem equilibradas, indicando uma generalização robusta fora do domínio. A configuração óptima utiliza um limiar de poda de <strong>0,6</strong> e α <strong>= 0,051</strong>, o que sugere que as pontuações de relevância do modelo estão bem calibradas e que o comportamento de poda é intuitivo e fácil de afinar na prática.</p>
<p><strong>O XProvence</strong> atinge uma <strong>pontuação F1 de 58,97%</strong>, caracterizada por uma <strong>elevada recuperação (75,52%)</strong> e uma <strong>precisão inferior (48,37%)</strong>. Isto reflecte uma estratégia de poda mais conservadora que dá prioridade à retenção de informações potencialmente relevantes em vez de remover agressivamente o ruído. Este comportamento pode ser desejável em domínios em que os falsos negativos são dispendiosos - como aplicações de cuidados de saúde ou jurídicas - mas também aumenta os falsos positivos, o que diminui a precisão. Apesar deste compromisso, a capacidade multilingue do XProvence torna-o uma opção forte para contextos que não sejam em inglês ou multilingues.</p>
<p>Em contrapartida, o <strong>OpenSearch Semantic Highlighter</strong> tem um desempenho substancialmente pior, com uma <strong>pontuação F1 de 46,37%</strong> (Precisão <strong>62,35%</strong>, Recuperação <strong>36,98%</strong>). A diferença em relação ao Provence e ao XProvence aponta para limitações tanto na calibração da pontuação como na generalização fora do domínio, especialmente em condições fora do domínio.</p>
<h2 id="Semantic-Highlighting-Another-Way-to-Find-What-Actually-Matters-in-Text" class="common-anchor-header">Realce semântico: Outra forma de encontrar o que é realmente importante no texto<button data-href="#Semantic-Highlighting-Another-Way-to-Find-What-Actually-Matters-in-Text" class="anchor-icon" translate="no">
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
    </button></h2><p>Agora que já falámos sobre a poda de contexto, vale a pena olhar para uma peça relacionada do puzzle: <a href="https://milvus.io/blog/zilliz-trained-and-open-sourced-bilingual-semantic-highlighting-model-for-production-ai.md"><strong>o realce sem</strong></a>ântico. Tecnicamente, ambas as funcionalidades estão a fazer praticamente o mesmo trabalho subjacente - pontuam partes de texto com base na sua relevância para uma consulta. A diferença é a forma como o resultado é utilizado no pipeline.</p>
<p>A maioria das pessoas ouve "realce" e pensa nos realçadores de palavras-chave clássicos que vê no Elasticsearch ou no Solr. Essas ferramentas basicamente procuram correspondências literais de palavras-chave e as envolvem em algo como <code translate="no">&lt;em&gt;</code>. São baratas e previsíveis, mas só funcionam quando o texto utiliza <em>exatamente</em> as mesmas palavras que a consulta. Se o documento parafrasear, utilizar sinónimos ou formular a ideia de forma diferente, os marcadores tradicionais não a identificam.</p>
<p><strong>O realce semântico segue um caminho diferente.</strong> Em vez de verificar as correspondências exactas das cadeias de caracteres, utiliza um modelo para estimar a semelhança semântica entre a consulta e os diferentes períodos de texto. Isto permite-lhe destacar conteúdo relevante mesmo quando a redação é totalmente diferente. Para pipelines RAG, fluxos de trabalho de agentes ou qualquer sistema de pesquisa de IA em que o significado é mais importante do que os tokens, o realce semântico dá-lhe uma imagem muito mais clara do <em>motivo pelo qual</em> um documento foi recuperado.</p>
<p>O problema é que a maioria das soluções de realce semântico existentes não foi criada para cargas de trabalho de IA de produção. Testámos tudo o que estava disponível e nenhuma delas forneceu o nível de precisão, latência ou fiabilidade multilingue de que precisávamos para sistemas RAG e de agentes reais. Por isso, acabámos por treinar e tornar o nosso próprio modelo open-sourcing: <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a></p>
<p>A um nível elevado, <strong>a poda de contexto e o realce semântico resolvem a mesma tarefa principal</strong>: dada uma consulta e um pedaço de texto, descobrir que partes são realmente importantes. A única diferença é o que acontece a seguir.</p>
<ul>
<li><p><strong>A poda</strong> de<strong>contexto</strong> elimina as partes irrelevantes antes da geração.</p></li>
<li><p><strong>O realce semântico</strong> mantém o texto completo, mas apresenta visualmente os trechos importantes.</p></li>
</ul>
<p>Uma vez que a operação subjacente é tão semelhante, o mesmo modelo pode frequentemente alimentar ambas as funcionalidades. Isto facilita a reutilização de componentes em toda a pilha e mantém o seu sistema RAG mais simples e mais eficiente em geral.</p>
<h3 id="Semantic-Highlighting-in-Milvus-and-Zilliz-Cloud" class="common-anchor-header">Realce semântico no Milvus e no Zilliz Cloud</h3><p>O realce semântico é agora totalmente suportado no <a href="https://milvus.io">Milvus</a> e no <a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a> (o serviço totalmente gerido do Milvus), e já está a revelar-se útil para quem trabalha com RAG ou pesquisa orientada por IA. A funcionalidade resolve um problema muito simples, mas doloroso: quando a pesquisa vetorial devolve uma tonelada de pedaços, como é que se descobre rapidamente <em>que frases dentro desses pedaços são realmente importantes</em>?</p>
<p>Sem o destaque, os utilizadores acabam por ler documentos inteiros só para perceber porque é que algo foi recuperado. Com o destaque semântico incorporado, o Milvus e o Zilliz Cloud marcam automaticamente os intervalos específicos que estão semanticamente relacionados com a sua consulta, mesmo que a redação seja diferente. Acabou-se a procura de correspondências de palavras-chave ou a adivinhação do motivo pelo qual uma parte apareceu.</p>
<p>Isto torna a recuperação muito mais transparente. Em vez de apenas retornar "documentos relevantes", o Milvus mostra <em>onde</em> está a relevância. Para os pipelines RAG, isto é especialmente útil porque se pode ver instantaneamente o que é suposto o modelo atender, tornando a depuração e a construção de alertas muito mais fácil.</p>
<p>Criámos este suporte diretamente no Milvus e no Zilliz Cloud, para que não tenha de adicionar modelos externos ou executar outro serviço apenas para obter uma atribuição utilizável. Tudo é executado dentro do caminho de recuperação: pesquisa vetorial → pontuação de relevância → intervalos destacados. Funciona imediatamente em escala e suporta cargas de trabalho multilingues com o nosso modelo <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a>.</p>
<h2 id="Looking-Ahead" class="common-anchor-header">Olhando para o futuro<button data-href="#Looking-Ahead" class="anchor-icon" translate="no">
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
    </button></h2><p>A engenharia de contexto ainda é muito nova, e ainda há muito a descobrir. Mesmo com a poda e o realce semântico a funcionar bem no <a href="https://milvus.io">Milvus</a> e no <a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a><strong>,</strong> não estamos nem perto do fim da história. Há uma série de áreas que ainda precisam de um verdadeiro trabalho de engenharia - tornar os modelos de poda mais precisos sem tornar as coisas mais lentas, melhorar o tratamento de consultas estranhas ou fora do domínio e ligar todas as peças para que a recuperação → rerank → prune → highlight pareça um pipeline limpo em vez de um conjunto de hacks colados.</p>
<p>Como as janelas de contexto continuam a crescer, estas decisões tornam-se cada vez mais importantes. Uma boa gestão de contexto já não é um "bónus agradável"; está a tornar-se uma parte essencial para que os sistemas de contexto longo e RAG se comportem de forma fiável.</p>
<p>Vamos continuar a experimentar, fazer benchmarking e enviar as peças que realmente fazem a diferença para os programadores. O objetivo é simples: facilitar a criação de sistemas que não quebrem com dados confusos, consultas imprevisíveis ou cargas de trabalho em grande escala.</p>
<p>Se quiser falar sobre tudo isto - ou apenas precisar de ajuda para depurar alguma coisa - pode entrar no nosso <a href="https://discord.com/invite/8uyFbECzPX">canal Discord</a> ou marcar uma sessão individual de 20 minutos para obter informações, orientação e respostas às suas perguntas através do<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
<p>É sempre um prazer conversar e trocar notas com outros construtores.</p>
