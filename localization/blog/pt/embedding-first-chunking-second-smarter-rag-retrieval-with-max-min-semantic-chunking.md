---
id: >-
  embedding-first-chunking-second-smarter-rag-retrieval-with-max-min-semantic-chunking.md
title: >-
  Incorporação em primeiro lugar, fragmentação em segundo: recuperação mais
  inteligente de RAG com fragmentação semântica máxima-mínima
author: Rachel Liu
date: 2025-12-24T00:00:00.000Z
cover: assets.zilliz.com/maxmin_cover_8be0b87409.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Max–Min Semantic Chunking, Milvus, RAG, chunking strategies'
meta_title: |
  Max–Min Semantic Chunking: Top Chunking Strategy to Improve RAG Performance
desc: >-
  Saiba como o Max-Min Semantic Chunking aumenta a precisão do RAG utilizando
  uma abordagem de incorporação em primeiro lugar que cria pedaços mais
  inteligentes, melhora a qualidade do contexto e proporciona um melhor
  desempenho de recuperação.
origin: >-
  https://milvus.io/blog/embedding-first-chunking-second-smarter-rag-retrieval-with-max-min-semantic-chunking.md
---
<p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">A Geração Aumentada de Recuperação (RAG)</a> tornou-se a abordagem padrão para fornecer contexto e memória para aplicações de IA - agentes de IA, assistentes de apoio ao cliente, bases de conhecimento e sistemas de pesquisa dependem todos dela.</p>
<p>Em quase todos os pipelines RAG, o processo padrão é o mesmo: pegar nos documentos, dividi-los em partes e, em seguida, incorporar essas partes para recuperação por semelhança numa base de dados vetorial como o <a href="https://milvus.io/">Milvus</a>. Uma vez que <strong>a divisão em blocos</strong> é feita à partida, a qualidade desses blocos afecta diretamente a eficácia do sistema na recuperação de informações e a precisão das respostas finais.</p>
<p>O problema é que as estratégias tradicionais de fragmentação normalmente dividem o texto sem qualquer compreensão semântica. Os cortes de chunking de comprimento fixo baseiam-se na contagem de tokens e o chunking recursivo utiliza uma estrutura de nível superficial, mas ambos ignoram o significado real do texto. Como resultado, as ideias relacionadas são frequentemente separadas, as linhas não relacionadas são agrupadas e o contexto importante é fragmentado.</p>
<p><a href="https://link.springer.com/article/10.1007/s10791-025-09638-7"><strong>O Max-Min Semantic Chunking</strong></a> aborda o problema de forma diferente. Em vez de fragmentar primeiro, incorpora o texto antecipadamente e utiliza a semelhança semântica para decidir onde os limites devem ser formados. Ao incorporar antes de cortar, o pipeline pode seguir as mudanças naturais de significado em vez de se basear em limites de comprimento arbitrários.</p>
<p>No nosso blogue anterior, falámos de métodos como o <a href="https://milvus.io/blog/smarter-retrieval-for-rag-late-chunking-with-jina-embeddings-v2-and-milvus.md"><strong>Late Chunking</strong></a> da Jina AI, que ajudou a popularizar a ideia de "incorporar primeiro" e mostrou que pode funcionar na prática. <strong>O Max-Min Semantic Chunking</strong> baseia-se no mesmo conceito com uma regra simples que identifica quando o significado muda o suficiente para justificar um novo pedaço. Neste post, veremos como o Max-Min funciona e examinaremos seus pontos fortes e limitações para cargas de trabalho reais do RAG.</p>
<h2 id="How-a-Typical-RAG-Pipeline-Works" class="common-anchor-header">Como funciona um pipeline RAG típico<button data-href="#How-a-Typical-RAG-Pipeline-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>A maioria dos pipelines RAG, independentemente da estrutura, segue a mesma linha de montagem de quatro estágios. Provavelmente, você mesmo já escreveu alguma versão disso:</p>
<h3 id="1-Data-Cleaning-and-Chunking" class="common-anchor-header">1. Limpeza e fragmentação de dados</h3><p>O pipeline começa por limpar os documentos em bruto: removendo cabeçalhos, rodapés, texto de navegação e tudo o que não seja conteúdo real. Uma vez eliminado o ruído, o texto é dividido em partes mais pequenas. A maioria das equipas usa pedaços de tamanho fixo - normalmente 300-800 tokens - porque isso mantém o modelo de incorporação gerível. A desvantagem é que as divisões são baseadas no comprimento e não no significado, pelo que os limites podem ser arbitrários.</p>
<h3 id="2-Embedding-and-Storage" class="common-anchor-header">2. Incorporação e armazenamento</h3><p>Cada pedaço é então incorporado usando um modelo de incorporação como o do OpenAI <a href="https://zilliz.com/ai-models/text-embedding-3-small"><code translate="no">text-embedding-3-small</code></a> ou o codificador do BAAI. Os vectores resultantes são armazenados numa base de dados vetorial, como a <a href="https://milvus.io/">Milvus</a> ou a <a href="https://zilliz.com/cloud">Zilliz Cloud</a>. A base de dados trata da indexação e da pesquisa de semelhanças para que possa comparar rapidamente novas consultas com todos os pedaços armazenados.</p>
<h3 id="3-Querying" class="common-anchor-header">3. Consulta</h3><p>Quando um utilizador faz uma pergunta - por exemplo, <em>"Como é que o RAG reduz as alucinações?"</em> - o sistema incorpora a consulta e envia-a para a base de dados. A base de dados devolve os K pedaços superiores cujos vectores estão mais próximos da pergunta. Estes são os pedaços de texto em que o modelo se baseará para responder à pergunta.</p>
<h3 id="4-Answer-Generation" class="common-anchor-header">4. Geração de respostas</h3><p>Os fragmentos recuperados são agrupados com a consulta do utilizador e introduzidos num LLM. O modelo gera uma resposta utilizando o contexto fornecido como base.</p>
<p><strong>A fragmentação está no início de todo este processo, mas tem um impacto enorme</strong>. Se os pedaços estiverem alinhados com o significado natural do texto, a recuperação parece exacta e consistente. Se os pedaços foram cortados em locais estranhos, o sistema tem mais dificuldade em encontrar a informação correta, mesmo com uma forte incorporação e uma base de dados vetorial rápida.</p>
<h3 id="The-Challenges-of-Getting-Chunking-Right" class="common-anchor-header">Os desafios de fazer o Chunking correto</h3><p>Atualmente, a maioria dos sistemas RAG utiliza um de dois métodos básicos de fragmentação, ambos com limitações.</p>
<p><strong>1. Chunking de tamanho fixo</strong></p>
<p>Esta é a abordagem mais simples: dividir o texto por uma contagem fixa de tokens ou caracteres. É rápido e previsível, mas não tem em conta a gramática, os tópicos ou as transições. As frases podem ser cortadas a meio. Por vezes, até palavras. Os embeddings obtidos a partir destes pedaços tendem a ser ruidosos porque os limites não reflectem a forma como o texto está realmente estruturado.</p>
<p><strong>2. Divisão recursiva de caracteres</strong></p>
<p>Este método é um pouco mais inteligente. Divide o texto hierarquicamente com base em pistas como parágrafos, quebras de linha ou frases. Se uma secção for demasiado longa, divide-a recursivamente. O resultado é geralmente mais coerente, mas continua a ser inconsistente. Alguns documentos não têm uma estrutura clara ou têm secções de comprimento desigual, o que prejudica a precisão da recuperação. E, nalguns casos, esta abordagem ainda produz partes que excedem a janela de contexto do modelo.</p>
<p>Ambos os métodos enfrentam o mesmo compromisso: precisão vs. contexto. Os blocos mais pequenos melhoram a precisão da recuperação, mas perdem o contexto envolvente; os blocos maiores preservam o significado, mas correm o risco de acrescentar ruído irrelevante. Encontrar o equilíbrio correto é o que torna a fragmentação fundamental - e frustrante - na conceção de sistemas RAG.</p>
<h2 id="Max–Min-Semantic-Chunking-Embed-First-Chunk-Second" class="common-anchor-header">Fragmentação semântica Max-Min: Incorporar primeiro, fragmentar depois<button data-href="#Max–Min-Semantic-Chunking-Embed-First-Chunk-Second" class="anchor-icon" translate="no">
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
    </button></h2><p>Em 2025, S.R. Bhat et al. publicaram <a href="https://arxiv.org/abs/2505.21700"><em>Rethinking Chunk Size for Long-Document Retrieval: A Multi-Dataset Analysis</em></a>. Uma das suas principais conclusões foi que não existe um único <strong>"melhor"</strong> tamanho de bloco para RAG. Os blocos pequenos (64-128 tokens) tendem a funcionar melhor para questões factuais ou de pesquisa, enquanto os blocos maiores (512-1024 tokens) ajudam em tarefas narrativas ou de raciocínio de alto nível. Por outras palavras, a fragmentação de tamanho fixo é sempre um compromisso.</p>
<p>Isto levanta uma questão natural: em vez de escolhermos um comprimento e esperarmos que seja o melhor, será que podemos dividir por significado e não por tamanho? <a href="https://link.springer.com/article/10.1007/s10791-025-09638-7"><strong>O Max-Min Semantic Chunking</strong></a> é uma abordagem que encontrei que tenta fazer exatamente isso.</p>
<p>A ideia é simples: <strong>primeiro, inserir, depois, separar</strong>. Em vez de dividir o texto e depois incorporar os pedaços que caem, o algoritmo incorpora <em>todas as frases</em> à partida. Depois, utiliza as relações semânticas entre essas frases incorporadas para decidir para onde devem ir os limites.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/embed_first_chunk_second_94f69c664c.png" alt="Diagram showing embed-first chunk-second workflow in Max-Min Semantic Chunking" class="doc-image" id="diagram-showing-embed-first-chunk-second-workflow-in-max-min-semantic-chunking" />
   </span> <span class="img-wrapper"> <span>Diagrama que mostra o fluxo de trabalho incorporar-primeiro-fragmento-segundo no Max-Min Semantic Chunking</span> </span></p>
<p>Conceptualmente, o método trata o chunking como um problema de agrupamento limitado no espaço de incorporação. Percorre-se o documento por ordem, uma frase de cada vez. Para cada frase, o algoritmo compara a sua incorporação com as do bloco atual. Se a nova frase for semanticamente suficientemente próxima, junta-se ao bloco. Se estiver demasiado longe, o algoritmo inicia um novo bloco. A principal restrição é que os pedaços devem seguir a ordem original das frases - sem reordenação, sem agrupamento global.</p>
<p>O resultado é um conjunto de pedaços de comprimento variável que reflectem onde o significado do documento realmente muda, em vez de onde um contador de caracteres chega a zero.</p>
<h2 id="How-the-Max–Min-Semantic-Chunking-Strategy-Works" class="common-anchor-header">Como funciona a estratégia de fragmentação semântica Max-Min<button data-href="#How-the-Max–Min-Semantic-Chunking-Strategy-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>O Max-Min Semantic Chunking determina os limites dos blocos comparando a forma como as frases se relacionam umas com as outras no espaço vetorial de alta dimensão. Em vez de se basear em comprimentos fixos, analisa a forma como o significado se altera ao longo do documento. O processo pode ser dividido em seis etapas:</p>
<h3 id="1-Embed-all-sentences-and-start-a-chunk" class="common-anchor-header">1. Incorporar todas as frases e iniciar um pedaço</h3><p>O modelo de incorporação converte cada frase do documento numa incorporação vetorial. Processa as frases por ordem. Se as primeiras <em>n-k</em> frases formarem o atual bloco C, a frase seguinte (sₙ₋ₖ₊₁) tem de ser avaliada: deve juntar-se a C ou iniciar um novo bloco?</p>
<h3 id="2-Measure-how-consistent-the-current-chunk-is" class="common-anchor-header">2. Medir a consistência do pedaço atual</h3><p>Dentro do pedaço C, calcular a semelhança mínima de cosseno entre todos os encaixes de frases. Este valor reflecte a proximidade entre as frases dentro do bloco. Uma semelhança mínima mais baixa indica que as frases estão menos relacionadas, sugerindo que o bloco pode precisar de ser dividido.</p>
<h3 id="3-Compare-the-new-sentence-to-the-chunk" class="common-anchor-header">3. Comparar a nova frase com o bloco</h3><p>Em seguida, calcular a semelhança máxima de cosseno entre a nova frase e qualquer frase já existente em C. Este valor reflecte o grau de alinhamento semântico da nova frase com o bloco existente.</p>
<h3 id="4-Decide-whether-to-extend-the-chunk-or-start-a-new-one" class="common-anchor-header">4. Decidir se se deve alargar o bloco ou iniciar um novo</h3><p>Esta é a regra principal:</p>
<ul>
<li><p>Se a <strong>semelhança máxima da nova frase</strong> com o bloco <strong>C</strong> for <strong>maior ou igual à</strong> <strong>semelhança mínima dentro de C</strong>, → A nova frase encaixa e permanece no bloco.</p></li>
<li><p>Caso contrário, → inicia-se um novo bloco.</p></li>
</ul>
<p>Isto garante que cada bloco mantém a sua consistência semântica interna.</p>
<h3 id="5-Adjust-thresholds-as-the-document-changes" class="common-anchor-header">5. Ajustar os limiares à medida que o documento muda</h3><p>Para otimizar a qualidade dos blocos, parâmetros como o tamanho dos blocos e os limiares de semelhança podem ser ajustados dinamicamente. Isto permite que o algoritmo se adapte a estruturas de documentos e densidades semânticas variáveis.</p>
<h3 id="6-Handle-the-first-few-sentences" class="common-anchor-header">6. Tratar as primeiras frases</h3><p>Quando um bloco contém apenas uma frase, o algoritmo trata a primeira comparação utilizando um limiar de semelhança fixo. Se a semelhança entre a frase 1 e a frase 2 for superior a esse limiar, estas formam um bloco. Caso contrário, dividem-se imediatamente.</p>
<h2 id="Strengths-and-Limitations-of-Max–Min-Semantic-Chunking" class="common-anchor-header">Pontos fortes e limitações do Max-Min Semantic Chunking<button data-href="#Strengths-and-Limitations-of-Max–Min-Semantic-Chunking" class="anchor-icon" translate="no">
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
    </button></h2><p>O Max-Min Semantic Chunking melhora a forma como os sistemas RAG dividem o texto, utilizando o significado em vez do comprimento, mas não é uma solução milagrosa. Aqui está um olhar prático sobre o que ele faz bem e onde ele ainda fica aquém.</p>
<h3 id="What-It-Does-Well" class="common-anchor-header">O que faz bem</h3><p>O Max-Min Semantic Chunking melhora o chunking tradicional de três maneiras importantes:</p>
<h4 id="1-Dynamic-meaning-driven-chunk-boundaries" class="common-anchor-header"><strong>1. Limites de chunk dinâmicos e orientados para o significado</strong></h4><p>Ao contrário das abordagens de tamanho fixo ou baseadas em estrutura, este método baseia-se na semelhança semântica para orientar a fragmentação. Compara a semelhança mínima dentro do pedaço atual (quão coeso é) com a semelhança máxima entre a nova frase e esse pedaço (quão bem se encaixa). Se esta última for superior, a frase junta-se ao bloco; caso contrário, inicia-se um novo bloco.</p>
<h4 id="2-Simple-practical-parameter-tuning" class="common-anchor-header"><strong>2. Afinação simples e prática dos parâmetros</strong></h4><p>O algoritmo depende apenas de três hiperparâmetros principais:</p>
<ul>
<li><p>o <strong>tamanho máximo do bloco</strong>,</p></li>
<li><p>a <strong>semelhança mínima</strong> entre as duas primeiras frases, e</p></li>
<li><p>o <strong>limiar de semelhança</strong> para adicionar novas frases.</p></li>
</ul>
<p>Estes parâmetros ajustam-se automaticamente ao contexto - pedaços maiores requerem limiares de semelhança mais rigorosos para manter a coerência.</p>
<h4 id="3-Low-processing-overhead" class="common-anchor-header"><strong>3. Baixo custo de processamento</strong></h4><p>Uma vez que o pipeline RAG já calcula os embeddings de frases, o Max-Min Semantic Chunking não acrescenta um cálculo pesado. Tudo o que precisa é de um conjunto de verificações de semelhança de cosseno enquanto percorre as frases. Isto torna-o mais barato do que muitas técnicas de fragmentação semântica que requerem modelos extra ou agrupamento em várias fases.</p>
<h3 id="What-It-Still-Can’t-Solve" class="common-anchor-header">O que ainda não consegue resolver</h3><p>O Max-Min Semantic Chunking melhora os limites dos pedaços, mas não elimina todos os desafios da segmentação de documentos. Uma vez que o algoritmo processa as frases por ordem e apenas agrupa localmente, pode ainda falhar relações de longo alcance em documentos mais longos ou mais complexos.</p>
<p>Um problema comum é a <strong>fragmentação do contexto</strong>. Quando a informação importante está espalhada por diferentes partes de um documento, o algoritmo pode colocar essas partes em pedaços separados. Cada fragmento contém então apenas parte do significado.</p>
<p>Por exemplo, nas notas de lançamento do Milvus 2.4.13, como mostrado abaixo, um pedaço pode conter o identificador de versão enquanto outro contém a lista de recursos. Uma consulta como <em>"Que novas funcionalidades foram introduzidas no Milvus 2.4.13?"</em> depende de ambos. Se esses pormenores estiverem divididos em diferentes partes, o modelo de incorporação pode não os ligar, o que resulta numa recuperação mais fraca.</p>
<ul>
<li>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/v2413_a98e1b1f99.png" alt="Example showing context fragmentation in Milvus 2.4.13 Release Notes with version identifier and feature list in separate chunks" class="doc-image" id="example-showing-context-fragmentation-in-milvus-2.4.13-release-notes-with-version-identifier-and-feature-list-in-separate-chunks" />
   </span> <span class="img-wrapper"> <span>Exemplo que mostra a fragmentação do contexto nas Notas de Lançamento do Milvus 2.4.13, com o identificador da versão e a lista de funcionalidades em partes separadas</span> </span></li>
</ul>
<p>Esta fragmentação também afecta a fase de geração da LLM. Se a referência à versão estiver num pedaço e as descrições das caraterísticas estiverem noutro, o modelo recebe um contexto incompleto e não pode raciocinar de forma clara sobre a relação entre os dois.</p>
<p>Para atenuar estes casos, os sistemas utilizam frequentemente técnicas como janelas deslizantes, limites de blocos sobrepostos ou varrimentos multi-passos. Estas abordagens reintroduzem parte do contexto em falta, reduzem a fragmentação e ajudam a etapa de recuperação a reter informações relacionadas.</p>
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
    </button></h2><p>O Max-Min Semantic Chunking não é uma solução mágica para todos os problemas de RAG, mas dá-nos uma forma mais sensata de pensar sobre os limites dos blocos. Em vez de deixar que os limites de tokens decidam onde as ideias são cortadas, ele usa embeddings para detetar onde o significado realmente muda. Para muitos documentos do mundo real - APIs, especificações, logs, notas de lançamento, guias de solução de problemas - isso por si só pode elevar a qualidade da recuperação de forma notável.</p>
<p>O que eu gosto nessa abordagem é que ela se encaixa naturalmente nos pipelines RAG existentes. Se já incorporar frases ou parágrafos, o custo adicional é basicamente algumas verificações de semelhança de cosseno. Não são necessários modelos adicionais, agrupamentos complexos ou pré-processamento pesado. E quando funciona, os blocos que produz parecem mais "humanos" - mais próximos da forma como agrupamos mentalmente a informação quando lemos.</p>
<p>Mas o método continua a ter pontos cegos. Só vê o significado localmente e não consegue voltar a ligar a informação que está intencionalmente separada. Continuam a ser necessárias janelas sobrepostas, digitalizações de várias passagens e outros truques de preservação do contexto, especialmente para documentos em que as referências e explicações se encontram distantes umas das outras.</p>
<p>Ainda assim, o Max-Min Semantic Chunking leva-nos na direção certa: longe do corte arbitrário de texto e em direção a condutas de recuperação que respeitam realmente a semântica. Se estiver a explorar formas de tornar o RAG mais fiável, vale a pena experimentar.</p>
<p>Tem dúvidas ou quer se aprofundar na melhoria do desempenho do RAG? Junte-se ao nosso <a href="https://discord.com/invite/8uyFbECzPX">Discord</a> e conecte-se com engenheiros que estão criando e ajustando sistemas de recuperação reais todos os dias.</p>
