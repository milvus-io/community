---
id: semantic-highlighting-model-for-rag-context-pruning-and-token-saving.md
title: >-
  Como criámos um modelo de realce semântico para a poda de contexto RAG e a
  gravação de tokens
author: 'Cheney Zhang, Jiang Chen'
date: 2026-1-19
cover: 'https://assets.zilliz.com/semantic_highlight2_cover_1406d8b11e.png'
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  semantic highlighting, RAG, context pruning, RAG noise filtering, context
  engineering
meta_title: |
  Semantic Highlighting for RAG Context Pruning and Token Saving
desc: >-
  Saiba como Zilliz construiu um modelo de realce semântico para a filtragem de
  ruído RAG, a redução do contexto e a poupança de tokens utilizando
  arquitecturas apenas de codificador, raciocínio LLM e dados de formação
  bilingues em grande escala.
origin: >-
  https://milvus.io/blog/semantic-highlighting-model-for-rag-context-pruning-and-token-saving.md
---
<h2 id="The-Problem-RAG-Noise-and-Token-Waste" class="common-anchor-header">O problema: Ruído RAG e desperdício de tokens<button data-href="#The-Problem-RAG-Noise-and-Token-Waste" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>A pesquisa vetorial</strong> é uma base sólida para os sistemas RAG - assistentes empresariais, agentes de IA, bots de apoio ao cliente e muito mais. Ela encontra de forma confiável os documentos que importam. Mas a recuperação por si só não resolve o problema do contexto. Mesmo os índices bem ajustados devolvem pedaços que são amplamente relevantes, enquanto apenas uma pequena fração das frases dentro desses pedaços responde realmente à consulta.</p>
<p>Nos sistemas de produção, esta lacuna aparece imediatamente. Uma única consulta pode obter dezenas de documentos, cada um com milhares de tokens. Apenas um punhado de frases contém o sinal real; o resto é contexto que incha o uso de tokens, atrasa a inferência e muitas vezes distrai o LLM. O problema torna-se ainda mais óbvio nos fluxos de trabalho dos agentes, em que as próprias consultas são o resultado de um raciocínio em várias etapas e correspondem apenas a pequenas partes do texto recuperado.</p>
<p>Isto cria uma necessidade clara de um modelo que possa <em><strong>identificar e realçar</strong></em> <em>as frases úteis e ignorar o resto - essencialmente</em>, filtragem de relevância ao nível da frase, ou aquilo a que muitas equipas se referem como <a href="https://milvus.io/blog/llm-context-pruning-a-developers-guide-to-better-rag-and-agentic-ai-results.md"><strong>poda de contexto</strong></a>. O objetivo é simples: manter as partes que interessam e eliminar o ruído antes que este chegue ao LLM.</p>
<p>O realce tradicional baseado em palavras-chave não consegue resolver este problema. Por exemplo, se um utilizador perguntar "Como posso melhorar a eficiência de execução do código Python?", um destacador de palavras-chave irá selecionar "Python" e "eficiência", mas não irá detetar a frase que realmente responde à pergunta - "Usar operações vectorizadas NumPy em vez de loops" - porque não partilha palavras-chave com a consulta. Em vez disso, o que precisamos é de compreensão semântica, e não de correspondência de strings.</p>
<h2 id="A-Semantic-Highlighting-Model-for-RAG-Noise-Filtering-and-Context-Pruning" class="common-anchor-header">Um modelo de realce semântico para filtragem de ruído RAG e poda de contexto<button data-href="#A-Semantic-Highlighting-Model-for-RAG-Noise-Filtering-and-Context-Pruning" class="anchor-icon" translate="no">
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
    </button></h2><p>Para facilitar esta tarefa aos criadores de RAG, treinámos e disponibilizámos um <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1"><strong>modelo de Realce Semântico</strong></a> que identifica e realça as frases dos documentos recuperados que estão mais alinhadas semanticamente com a consulta. Atualmente, o modelo apresenta o desempenho mais avançado em inglês e chinês e foi concebido para se integrar diretamente nos pipelines RAG existentes.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/context_pruning_80f7b16280.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Detalhes do modelo</strong></p>
<ul>
<li><p><strong>HuggingFace:</strong> <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a></p></li>
<li><p><strong>Licença:</strong> MIT (comercialmente amigável)</p></li>
<li><p><strong>Arquitetura:</strong> 0.6B modelo só de codificador baseado no BGE-M3 Reranker v2</p></li>
<li><p><strong>Janela de contexto:</strong> 8192 tokens</p></li>
<li><p><strong>Idiomas suportados:</strong> Inglês e chinês</p></li>
</ul>
<p>O Semantic Highlighting fornece os sinais de relevância necessários para selecionar apenas as partes úteis de documentos longos recuperados. Na prática, este modelo permite:</p>
<ul>
<li><p><strong>Melhor interpretabilidade</strong>, mostrando que partes de um documento são realmente importantes</p></li>
<li><p><strong>Redução de 70-80% no custo dos tokens</strong>, enviando apenas as frases destacadas para o LLM</p></li>
<li><p><strong>Melhor qualidade de resposta</strong>, uma vez que o modelo vê menos contexto irrelevante</p></li>
<li><p><strong>Maior facilidade de depuração</strong>, porque os engenheiros podem inspecionar diretamente as correspondências ao nível da frase</p></li>
</ul>
<h3 id="Evaluation-Results-Achieving-SOTA-Performance" class="common-anchor-header">Resultados da avaliação: Alcançando o desempenho do SOTA</h3><p>Avaliámos o nosso modelo de Realce Semântico em vários conjuntos de dados em inglês e chinês, em condições dentro e fora do domínio.</p>
<p>Os conjuntos de referência incluem:</p>
<ul>
<li><p><strong>QA multi-span inglês:</strong> multispanqa</p></li>
<li><p><strong>Wikipedia fora do domínio inglês:</strong> wikitext2</p></li>
<li><p><strong>GQ multi</strong> -span<strong>chinês:</strong> multispanqa_zh</p></li>
<li><p>Wikipédia<strong>chinesa fora do domínio:</strong> wikitext2_zh</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmarking_results_25545c952f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Os modelos avaliados incluem:</p>
<ul>
<li><p>Série Open Provence</p></li>
<li><p>Série Provence/XProvence da Naver</p></li>
<li><p>Marcador semântico do OpenSearch</p></li>
<li><p>O nosso modelo bilingue treinado: <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a></p></li>
</ul>
<p>Em todos os quatro conjuntos de dados, o nosso modelo alcança a melhor classificação. Mais importante ainda, é o <em>único</em> modelo que tem um desempenho consistentemente bom tanto em inglês como em chinês. Os modelos concorrentes ou se concentram exclusivamente no inglês ou mostram claras quedas de desempenho no texto chinês.</p>
<h2 id="How-We-Built-This-Semantic-Highlighting-Model" class="common-anchor-header">Como criámos este modelo de realce semântico<button data-href="#How-We-Built-This-Semantic-Highlighting-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>Treinar um modelo para esta tarefa não é a parte mais difícil; treinar um <em>bom</em> modelo que lide com os problemas anteriores e ofereça um desempenho próximo do SOTA é onde o verdadeiro trabalho acontece. A nossa abordagem centrou-se em duas coisas:</p>
<ul>
<li><p><strong>Arquitetura do modelo:</strong> utilizar um design apenas de codificador para uma inferência rápida.</p></li>
<li><p><strong>Dados de treino:</strong> gerar rótulos de relevância de alta qualidade utilizando LLMs com capacidade de raciocínio e escalar a geração de dados com estruturas de inferência local.</p></li>
</ul>
<h3 id="Model-Architecture" class="common-anchor-header">Arquitetura do modelo</h3><p>Construímos o modelo como uma rede leve <strong>apenas</strong> de <strong>codificador</strong> que trata a poda de contexto como uma <strong>tarefa de pontuação de relevância ao nível do token</strong>. Este design é inspirado por <a href="https://arxiv.org/html/2501.16214v1">Provence</a>, uma abordagem de poda de contexto introduzida por Naver no ICLR 2025, que reformula a poda de "escolher o pedaço certo" para "pontuar cada token". Esse enquadramento alinha-se naturalmente com o realce semântico, em que os sinais finos são essenciais.</p>
<p>Os modelos apenas de codificador não são a arquitetura mais recente, mas continuam a ser extremamente práticos neste caso: são rápidos, fáceis de escalar e podem produzir pontuações de relevância para todas as posições de token em paralelo. Para um sistema RAG de produção, essa vantagem de velocidade é muito mais importante do que usar um modelo de descodificador maior.</p>
<p>Depois de calcularmos as pontuações de relevância ao nível dos tokens, agregamo-las em pontuações <strong>ao nível das frases</strong>. Este passo transforma sinais de tokens ruidosos numa métrica de relevância estável e interpretável. As frases acima de um limiar configurável são destacadas; tudo o resto é filtrado. Isto produz um mecanismo simples e fiável para selecionar as frases que realmente interessam à consulta.</p>
<h3 id="Inference-Process" class="common-anchor-header">Processo de inferência</h3><p>Em tempo de execução, o nosso modelo de realce semântico segue um processo simples:</p>
<ol>
<li><p><strong>Entrada -</strong> O processo começa com uma consulta do utilizador. Os documentos recuperados são tratados como contexto candidato para avaliação da relevância.</p></li>
<li><p><strong>Processamento do modelo -</strong> A consulta e o contexto são concatenados numa única sequência: [BOS] + Consulta + Contexto</p></li>
<li><p><strong>Pontuação de tokens -</strong> A cada token no contexto é atribuída uma pontuação de relevância entre 0 e 1, reflectindo a sua forte relação com a consulta.</p></li>
<li><p><strong>Agregação de frases -</strong> As pontuações dos tokens são agregadas ao nível da frase, normalmente através de uma média, para produzir uma pontuação de relevância para cada frase.</p></li>
<li><p><strong>Filtragem de limiar -</strong> As frases com pontuações acima de um limiar configurável são destacadas e retidas, enquanto as frases com pontuações baixas são filtradas antes de serem passadas para o LLM a jusante.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/semantic_highlighting_workflows_db3d12a666.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Base-Model-BGE-M3-Reranker-v2" class="common-anchor-header">Modelo de base: BGE-M3 Reranker v2</h3><p>Selecionámos o BGE-M3 Reranker v2 como modelo de base por várias razões:</p>
<ol>
<li><p>Utiliza uma arquitetura de codificador adequada para a pontuação de tokens e frases</p></li>
<li><p>Suporta vários idiomas com otimização para inglês e chinês</p></li>
<li><p>Fornece uma janela de contexto de 8192 tokens apropriada para documentos RAG mais longos</p></li>
<li><p>Mantém parâmetros de 0,6B - suficientemente fortes sem serem computacionalmente pesados</p></li>
<li><p>Assegura um conhecimento do mundo suficiente no modelo de base</p></li>
<li><p>Treinado para a reclassificação, que se aproxima das tarefas de avaliação da relevância</p></li>
</ol>
<h2 id="Training-Data-LLM-Annotation-with-Reasoning" class="common-anchor-header">Dados de treino: Anotação LLM com raciocínio<button data-href="#Training-Data-LLM-Annotation-with-Reasoning" class="anchor-icon" translate="no">
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
    </button></h2><p>Uma vez finalizada a arquitetura do modelo, o desafio seguinte foi construir um conjunto de dados que permitisse treinar um modelo fiável. Começámos por ver como a Open Provence lida com isto. A sua abordagem utiliza conjuntos de dados públicos de QA e um pequeno LLM para identificar as frases que são relevantes. É bem dimensionada e fácil de automatizar, o que a tornou uma boa base para nós.</p>
<p>Mas rapidamente nos deparámos com o mesmo problema que eles descrevem: se pedirmos a um LLM para produzir diretamente etiquetas ao nível das frases, os resultados nem sempre são estáveis. Algumas etiquetas estão corretas, outras são questionáveis, e é difícil limpar as coisas depois. A anotação totalmente manual também não era uma opção - precisávamos de muito mais dados do que poderíamos rotular à mão.</p>
<p>Para melhorar a estabilidade sem sacrificar a escalabilidade, fizemos uma alteração: o LLM deve fornecer um pequeno trecho de raciocínio para cada rótulo que produz. Cada exemplo de treino inclui a consulta, o documento, os intervalos de frases e uma breve explicação do motivo pelo qual uma frase é relevante ou irrelevante. Este pequeno ajuste tornou as anotações muito mais consistentes e deu-nos algo concreto para referenciar quando validamos ou depuramos o conjunto de dados.</p>
<p>A inclusão do raciocínio revelou-se surpreendentemente valiosa:</p>
<ul>
<li><p><strong>Maior qualidade das anotações:</strong> Escrever o raciocínio funciona como uma auto-verificação, o que reduz as etiquetas aleatórias ou inconsistentes.</p></li>
<li><p><strong>Melhor observabilidade:</strong> Podemos ver <em>porque é que</em> uma frase foi selecionada em vez de tratar a etiqueta como uma caixa negra.</p></li>
<li><p><strong>Depuração mais fácil:</strong> Quando algo parece estar errado, o raciocínio torna mais fácil identificar se o problema é o pedido, o domínio ou a lógica de anotação.</p></li>
<li><p><strong>Dados reutilizáveis:</strong> Mesmo que mudemos para um modelo de etiquetagem diferente no futuro, os traços de raciocínio continuam a ser úteis para uma nova etiquetagem ou auditoria.</p></li>
</ul>
<p>O fluxo de trabalho de anotação tem o seguinte aspeto:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/annotation_data_generation_ff93eb18f4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Qwen3-8B-for-Annotation" class="common-anchor-header">Qwen3 8B para anotação</h3><p>Para a anotação, escolhemos o Qwen3 8B porque suporta nativamente um "modo de pensamento" através de saídas, tornando muito mais fácil extrair traços de raciocínio consistentes. Modelos menores não nos davam rótulos estáveis, e modelos maiores eram mais lentos e desnecessariamente caros para este tipo de pipeline. O Qwen3 8B atingiu o equilíbrio certo entre qualidade, velocidade e custo.</p>
<p>Executamos todas as anotações usando um <strong>serviço vLLM local</strong> em vez de APIs na nuvem. Isso nos deu alta taxa de transferência, desempenho previsível e custo muito menor - essencialmente trocando tempo de GPU por taxas de token de API, que é o melhor negócio ao gerar milhões de amostras.</p>
<h3 id="Dataset-Scale" class="common-anchor-header">Escala do conjunto de dados</h3><p>No total, criámos <strong>mais de 5 milhões de amostras de formação bilingues</strong>, divididas aproximadamente de forma igual entre inglês e chinês.</p>
<ul>
<li><p><strong>Fontes em inglês:</strong> MS MARCO, Natural Questions, GooAQ</p></li>
<li><p><strong>Fontes chinesas:</strong> DuReader, Wikipédia chinesa, mmarco_chinese</p></li>
</ul>
<p>Parte do conjunto de dados provém da reanotação de dados existentes utilizados por projectos como o Open Provence. O resto foi gerado a partir de corpora em bruto, criando primeiro pares consulta-contexto e depois rotulando-os com o nosso pipeline baseado no raciocínio.</p>
<p>Todos os dados de treino anotados estão também disponíveis no HuggingFace para desenvolvimento da comunidade e referência de treino: <a href="https://huggingface.co/zilliz/datasets">Conjuntos de dados Zilliz</a></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/zilliz_datasets_dd91330d4d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Training-Method" class="common-anchor-header">Método de treino</h3><p>Quando a arquitetura do modelo e o conjunto de dados estavam prontos, treinámos o modelo em <strong>8× GPUs A100</strong> para três épocas, o que demorou cerca de <strong>9 horas</strong> de ponta a ponta.</p>
<p><strong>Nota:</strong> O treino visou apenas a <strong>Cabeça de Poda</strong>, que é responsável pela tarefa de realce semântico. Não treinámos a <strong>Cabeça de Rerank</strong>, uma vez que a concentração apenas no objetivo de poda produziu melhores resultados para a pontuação de relevância ao nível da frase.</p>
<h2 id="Real-World-Case-Study" class="common-anchor-header">Estudo de caso do mundo real<button data-href="#Real-World-Case-Study" class="anchor-icon" translate="no">
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
    </button></h2><p>Os benchmarks só contam parte da história, por isso aqui está um exemplo real que mostra como o modelo se comporta num caso comum: quando o texto recuperado contém tanto a resposta correta como um distrativo muito tentador.</p>
<p><strong>Consulta:</strong> <em>Quem escreveu The Killing of a Sacred Deer?</em></p>
<p><strong>Contexto (5 frases):</strong></p>
<pre><code translate="no">1\. The Killing of a Sacred Deer is a 2017 psychological horror film directed by Yorgos Lanthimos,

   with a screenplay by Lanthimos and Efthymis Filippou.

2\. The film stars Colin Farrell, Nicole Kidman, Barry Keoghan, Raffey Cassidy,

   Sunny Suljic, Alicia Silverstone, and Bill Camp.

3\. The story is based on the ancient Greek playwright Euripides&#x27; play Iphigenia in Aulis.

4\. The film tells the story of a cardiac surgeon (Farrell) who secretly

   befriends a teenager (Keoghan) connected to his past.

5\. He introduces the boy to his family, who then mysteriously fall ill.
<button class="copy-code-btn"></button></code></pre>
<p>Resposta correta: Frase 1 (diz explicitamente "argumento de Lanthimos e Efthymis Filippou")</p>
<p>Este exemplo tem uma armadilha: a frase 3 menciona que "Eurípedes" escreveu a peça original. Mas a pergunta é "quem escreveu o filme The Killing of a Sacred Deer", e a resposta deveria ser os argumentistas do filme, não o dramaturgo grego de há milhares de anos.</p>
<h3 id="Model-results" class="common-anchor-header">Resultados do modelo</h3><table>
<thead>
<tr><th>Modelo</th><th>Encontra a resposta correta?</th><th>Previsão</th></tr>
</thead>
<tbody>
<tr><td>O nosso modelo</td><td>✓</td><td>Frases selecionadas 1 (correta) e 3</td></tr>
<tr><td>XProvence v1</td><td>✗</td><td>Selecionou apenas a frase 3, falhou a resposta correta</td></tr>
<tr><td>XProvence v2</td><td>✗</td><td>Apenas selecionou a frase 3, falhou a resposta correta</td></tr>
</tbody>
</table>
<p><strong>Comparação da pontuação da frase-chave:</strong></p>
<table>
<thead>
<tr><th>Frase</th><th>O nosso modelo</th><th>XProvence v1</th><th>XProvence v2</th></tr>
</thead>
<tbody>
<tr><td>Frase 1 (argumento de filme, resposta correta)</td><td>0.915</td><td>0.133</td><td>0.081</td></tr>
<tr><td>Frase 3 (peça de teatro original, distração)</td><td>0.719</td><td>0.947</td><td>0.802</td></tr>
</tbody>
</table>
<p>Modelos XProvence:</p>
<ul>
<li><p>Atraído fortemente por "Eurípides" e "peça", atribuindo à frase 3 pontuações quase perfeitas (0,947 e 0,802)</p></li>
<li><p>Ignora completamente a resposta atual (frase 1), atribuindo pontuações extremamente baixas (0,133 e 0,081)</p></li>
<li><p>Mesmo baixando o limiar de 0,5 para 0,2, continua a não conseguir encontrar a resposta correta</p></li>
</ul>
<p>O nosso modelo:</p>
<ul>
<li><p>Atribui corretamente à frase 1 a pontuação mais elevada (0,915)</p></li>
<li><p>Continua a atribuir à frase 3 alguma relevância (0,719) porque está relacionada com o fundo</p></li>
<li><p>Separa claramente as duas com uma margem de ~0,2</p></li>
</ul>
<p>Este exemplo mostra a força principal do modelo: compreender <strong>a intenção da consulta</strong> em vez de corresponder apenas a palavras-chave de nível superficial. Neste contexto, "Quem escreveu <em>The Killing of a Sacred Deer</em>" refere-se ao filme, não à peça grega antiga. O nosso modelo detecta esse facto, enquanto outros se distraem com pistas lexicais fortes.</p>
<h2 id="Try-It-Out-and-Tell-Us-What-You-Think" class="common-anchor-header">Experimente e diga-nos o que pensa<button data-href="#Try-It-Out-and-Tell-Us-What-You-Think" class="anchor-icon" translate="no">
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
    </button></h2><p>O nosso modelo <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a> tem agora o código aberto sob a licença MIT e está pronto para ser utilizado na produção. Pode ligá-lo ao seu pipeline RAG, ajustá-lo ao seu próprio domínio ou construir novas ferramentas em cima dele. Também agradecemos contribuições e feedback da comunidade.</p>
<ul>
<li><p><strong>Descarregar do HuggingFace</strong>: <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a></p></li>
<li><p><strong>Todos os dados de treino anotados:</strong> <a href="https://huggingface.co/zilliz/datasets">https://huggingface.co/zilliz/datasets</a></p></li>
</ul>
<h3 id="Semantic-Highlighting-Available-in-Milvus-and-Zilliz-Cloud" class="common-anchor-header">Realce semântico disponível em Milvus e Zilliz Cloud</h3><p>O realce semântico também está integrado diretamente no <a href="https://milvus.io/">Milvus</a> e no <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (o Milvus totalmente gerido), dando aos utilizadores uma visão clara da <em>razão pela qual</em> cada documento foi recuperado. Em vez de analisar blocos inteiros, vê imediatamente as frases específicas relacionadas com a sua consulta, mesmo quando o texto não corresponde exatamente. Isto torna a recuperação mais fácil de compreender e muito mais rápida de depurar. Para os pipelines RAG, também clarifica aquilo em que se espera que o LLM a jusante se concentre, o que ajuda na conceção rápida e nas verificações de qualidade.</p>
<p><a href="https://cloud.zilliz.com/signup?utm_source=milvusio&amp;utm_page=semantic-highlighting-blog"><strong>Experimente gratuitamente o Semantic Highlighting num Zilliz Cloud totalmente gerido</strong></a></p>
<p>Gostaríamos de saber como funciona para si - relatórios de erros, ideias de melhoria ou qualquer coisa que descubra ao integrá-lo no seu fluxo de trabalho.</p>
<p>Se quiser falar sobre qualquer assunto com mais pormenor, junte-se ao nosso <a href="https://discord.com/invite/8uyFbECzPX">canal Discord</a> ou marque uma sessão de 20 minutos <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">no Milvus Office Hours</a>. Temos sempre todo o gosto em conversar com outros construtores e trocar notas.</p>
<h2 id="Acknowledgements" class="common-anchor-header">Agradecimentos<button data-href="#Acknowledgements" class="anchor-icon" translate="no">
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
    </button></h2><p>Este trabalho baseia-se em muitas ideias fantásticas e contribuições de código aberto, e queremos destacar os projectos que tornaram este modelo possível.</p>
<ul>
<li><p><strong>O Provence</strong> introduziu um enquadramento limpo e prático para a poda de contexto utilizando modelos de codificadores leves.</p></li>
<li><p><strong>O Open Provence</strong> forneceu uma base de código sólida e bem concebida - pipelines de formação, processamento de dados e cabeças de modelo - sob uma licença permissiva. Deu-nos um ponto de partida sólido para a experimentação.</p></li>
</ul>
<p>Para além dessa base, adicionámos várias contribuições próprias:</p>
<ul>
<li><p>Utilizar <strong>o raciocínio LLM</strong> para gerar etiquetas de relevância de maior qualidade</p></li>
<li><p>Criação de <strong>quase 5 milhões de</strong> amostras de treino bilingue alinhadas com cargas de trabalho reais do RAG</p></li>
<li><p>Seleção de um modelo de base mais adequado à pontuação de relevância de contexto longo<strong>(BGE-M3 Reranker v2</strong>)</p></li>
<li><p>Treinar apenas o <strong>Pruning Head</strong> para especializar o modelo para o realce semântico</p></li>
</ul>
<p>Estamos gratos às equipas Provence e Open Provence por publicarem o seu trabalho abertamente. As suas contribuições aceleraram significativamente o nosso desenvolvimento e tornaram este projeto possível.</p>
