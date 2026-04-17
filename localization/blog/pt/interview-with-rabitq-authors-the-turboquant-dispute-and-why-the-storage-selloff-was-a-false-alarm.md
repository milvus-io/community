---
id: >-
  interview-with-rabitq-authors-the-turboquant-dispute-and-why-the-storage-selloff-was-a-false-alarm.md
title: >-
  Entrevista com os autores do RaBitQ: A disputa TurboQuant e por que a venda de
  armazenamento foi um alarme falso
author: 'Cheng Long, Jianyang Gao, Li Liu'
date: 2026-4-17
cover: assets.zilliz.com/0415_updated_rabitq_interviewdocx_md_1_d5709718fc.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'RaBitQ, TurboQuant, vector quantization, Milvus, IVF_RABITQ'
meta_title: |
  RaBitQ Authors on the TurboQuant Vector Quantization Dispute
desc: >-
  Os autores do RaBitQ respondem ao documento TurboQuant da Google: o
  desequilíbrio de referência, a teoria da atribuição incorrecta e a razão pela
  qual a venda de armazenamento foi um falso alarme.
origin: >-
  https://milvus.io/blog/interview-with-rabitq-authors-the-turboquant-dispute-and-why-the-storage-selloff-was-a-false-alarm.md
---
<p>O documento <a href="https://research.google/blog/turboquant-redefining-ai-efficiency-with-extreme-compression/">TurboQuant</a> da Google afirmava uma <strong>compressão de 6x, um aumento de velocidade de 8x e uma perda de precisão quase nula</strong> para representações vectoriais. Após a sua publicação, as acções de memória e armazenamento caíram drasticamente e os principais meios tecnológicos transformaram-no rapidamente numa notícia de primeira página.</p>
<p>A reação do mercado foi apenas o início. Os investigadores começaram logo a perguntar se as afirmações do artigo eram exageradas e se o trabalho anterior - especialmente <a href="https://dl.acm.org/doi/10.1145/3654970">o RaBitQ</a> - era tratado de forma justa. A disputa colocou <strong>a quantização de v</strong> ectores de novo no centro das atenções, em parte porque as mesmas ideias subjacentes são agora importantes em duas partes críticas da pilha de IA: <a href="https://zilliz.com/learn/vector-similarity-search">sistemas de pesquisa de vectores</a> e compressão de cache KV para modelos grandes.</p>
<p>Para entender o debate técnico e o que ele significa para os sistemas de produção, conversamos com <strong>Cheng Long</strong>, professor associado da NTU Singapore e chefe do VectorDB@NTU; <strong>Jianyang Gao</strong>, primeiro autor do RaBitQ; e <strong>Li Liu</strong>, diretor de engenharia da Zilliz. A conversa abordou a quantização de vectores em si, as questões levantadas em torno do TurboQuant e a razão pela qual isto é importante para sistemas como o <a href="https://milvus.io/">Milvus</a>, as <a href="https://zilliz.com/learn/what-is-vector-database">bases de dados vectoriais</a> de código aberto mais populares, e a recuperação de vectores em grande escala.</p>
<p><strong><em>Leitura relacionada:</em></strong> <em>Se quiser ver o lado da engenharia em vez da entrevista, consulte o nosso artigo complementar sobre</em> <a href="https://milvus.io/blog/turboquant-rabitq-vector-database-cost.md"><em>como a quantização vetorial afecta os custos da infraestrutura de IA</em></a><em>.</em></p>
<h2 id="Why-did-vector-quantization-suddenly-become-such-a-big-topic" class="common-anchor-header">Porque é que a quantização de vectores se tornou subitamente um tema tão importante?<button data-href="#Why-did-vector-quantization-suddenly-become-such-a-big-topic" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Zilliz: Antes de entrarmos na controvérsia, pode começar por explicar o que é a quantização vetorial e porque se tornou tão importante na IA?</strong></p>
<p><strong>Cheng Long:</strong> A quantização vetorial é uma técnica de <strong>compressão de dados</strong> e de <strong>representação aproximada</strong>. Foi originalmente utilizada no processamento de sinais, para a compressão de imagens e áudio. Nos sistemas modernos de IA, o seu papel mudou porque os vectores se tornaram uma das unidades básicas de computação.</p>
<p>Atualmente, a sua importância é mais evidente em dois aspectos.</p>
<p>Um é a <strong>pesquisa em tempo real em colecções com milhares ou mesmo dezenas de milhares de milhões de vectores</strong>. Nos sistemas de recuperação semântica, a tarefa principal é a pesquisa de semelhanças em vectores de elevada dimensão. Mas os vectores brutos são grandes e a computação em vírgula flutuante é dispendiosa. Em escala, isso dificulta a obtenção de uma latência de milissegundos. A quantização de vectores ajuda a comprimir os vectores em representações de poucos bits e a acelerar o cálculo da distância. É por isso que é importante para cargas de trabalho práticas, como a <a href="https://milvus.io/docs/single-vector-search.md">pesquisa monovectorial</a>, <a href="https://milvus.io/docs/multi-vector-search.md">a pesquisa multivectorial</a> e a conceção de índices na <a href="https://milvus.io/docs/index-explained.md">arquitetura de pesquisa Milvus</a>.</p>
<p>A outra é a <strong>compressão da cache KV</strong> para modelos de grandes dimensões. A cache KV reduz a computação redundante durante a geração, mas o custo da memória aumenta rapidamente à medida que o contexto se torna mais longo. Assim, o problema passa a ser como comprimir esses vectores sem prejudicar demasiado a qualidade do resultado. No fundo, este é também um problema de quantização de vectores.</p>
<p><strong>Zilliz: Se a quantização de vectores se tornar mais utilizada - e se os resultados do TurboQuant se mantiverem - isso significa que a procura de armazenamento diminui drasticamente?</strong></p>
<p><strong>Jianyang Gao:</strong> Sob o mesmo modelo e a mesma carga de trabalho, a compressão pode reduzir a demanda de armazenamento. Mas isso não justifica a conclusão mais ampla a que as pessoas chegaram.</p>
<p>Quando o TurboQuant fala em <strong>compressão 6x</strong> e <strong>aumento de velocidade 8x</strong>, ele está comparando com uma <strong>linha de base</strong> básica <strong>de 16 bits/32 bits</strong>. Isso não é o mesmo que comparar com outros métodos da mesma categoria. Por isso, o efeito real ainda precisa de ser avaliado com mais cuidado.</p>
<p><strong>Zilliz: Então, nessa perspetiva, se a reação do mercado fosse realmente sobre a tecnologia em si, deveria ter acontecido muito antes, quando já tinham surgido ideias semelhantes?</strong></p>
<p><strong>Cheng Long:</strong> De um ponto de vista técnico, poder-se-ia dizer que já se tinha chegado a um território teórico semelhante. Mas os mercados não se movem em sincronia com a investigação. Normalmente, há um desfasamento entre os resultados académicos, a adoção pela engenharia e a interpretação financeira.</p>
<p>E, num horizonte mais longo, o efeito pode nem sequer ser linear. A compressão pode tornar possível executar grandes modelos em dispositivos mais pequenos, o que pode criar uma nova procura em vez de simplesmente a reduzir. A relação entre tecnologia e mercados é mais complicada do que uma extrapolação em linha reta.</p>
<h2 id="How-did-RaBitQ-emerge-and-what-did-it-contribute" class="common-anchor-header">Como é que a RaBitQ surgiu e qual foi o seu contributo?<button data-href="#How-did-RaBitQ-emerge-and-what-did-it-contribute" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Zilliz: Como é que teve a ideia do RaBitQ?</strong></p>
<p><strong>Jianyang Gao:</strong> Partimos de uma lacuna que vimos nas bases de dados vectoriais. Os métodos tradicionais, como o <a href="https://milvus.io/docs/ivf-pq.md">Product Quantization</a>, funcionavam bem empiricamente, mas ofereciam muito poucas garantias teóricas.</p>
<p>Na altura, eu estava a estudar probabilidade de alta dimensão na NTU de Singapura, o que me levou a perguntar se poderíamos construir um método que não fosse apenas prático, mas que também tivesse uma garantia teórica clara. Esse foi o ponto de partida para o RaBitQ.</p>
<p><strong>Zilliz: Na sua opinião, qual é a principal originalidade do RaBitQ?</strong></p>
<p><strong>Jianyang Gao:</strong> A sua ideia principal foi utilizar uma rotação aleatória, também conhecida como transformação Johnson-Lindenstrauss, para tornar a distribuição das coordenadas vectoriais mais uniforme e mais previsível.</p>
<p>Uma vez que se tenha isso, é possível derivar um estimador de quantização ótimo em cima disso. Em seguida, apresentámos uma prova rigorosa de que este atinge o limite inferior teórico.</p>
<p>Trabalhos anteriores tinham também tentado introduzir a rotação aleatória. Mas, na nossa perspetiva, esses métodos não atingiram o efeito que procurávamos devido a questões práticas na conceção do algoritmo.</p>
<p><strong>Zilliz: Do ponto de vista da engenharia, o que é que mais vos chamou a atenção no RaBitQ?</strong></p>
<p><strong>Li Liu:</strong> Trabalhámos com muitos algoritmos de quantização, desde <a href="https://milvus.io/docs/ivf-sq8.md">métodos de quantização escalar</a> a PQ e outras variantes. O que se destacou no RaBitQ foi o facto de ter mudado a forma como as pessoas abordavam o problema.</p>
<p>Antes disso, grande parte do campo ainda era bastante empírico. Podia-se dizer que um método parecia funcionar, mas era mais difícil explicar claramente porquê. O RaBitQ abordou o problema de uma forma muito mais matemática. O método parecia elegante e, de certa forma, simples. Essa forma de pensar influenciou muito do trabalho posterior.</p>
<p><strong>Zilliz: Em termos simples, quanto é que se pode poupar em memória e em custos?</strong></p>
<p><strong>Li Liu:</strong> Ao mesmo nível de recordação, passar da compressão de 4 bits para a compressão de 2 bits reduz a utilização de memória para metade.</p>
<p>E não se trata apenas de compressão. O seu desempenho compara-se favoravelmente com abordagens anteriores, e isso é importante em ambientes de produção onde as equipas se preocupam tanto com a eficiência da memória como com a qualidade da recuperação. É por isso que é importante para os sistemas que precisam de equilibrar o <a href="https://milvus.io/docs/dense-vector.md">armazenamento vetorial denso</a>, o rendimento e a recuperação.</p>
<p><strong>Zilliz: Para além do Milvus, onde é que vê o RaBitQ a ser utilizado atualmente?</strong></p>
<p><strong>Cheng Long:</strong> Em primeiro lugar, quero agradecer à equipa da Milvus, porque foram dos primeiros a adotar o RaBitQ. Também tivemos muitas discussões e algumas pesquisas colaborativas ao longo do caminho.</p>
<p>O RaBitQ também foi adotado em alguns outros sistemas, incluindo o Meta's FAISS, VSAG, VectorChord, Volcengine OpenSearch, CockroachDB, ElasticSearch, Lucene e turbopuffer. O que se destaca no lado do Milvus é que a equipa enviou <a href="https://milvus.io/docs/ivf-rabitq.md">o IVF_RABITQ</a> como uma opção de índice real no <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6</a>, juntamente com um trabalho mais amplo sobre <a href="https://milvus.io/docs/manage-collections.md">gestão de colecções</a>, <a href="https://milvus.io/docs/ivf-flat.md">indexação baseada em IVF</a> e <a href="https://milvus.io/docs/hnsw.md">indexação baseada em HNSW</a>.</p>
<h2 id="How-should-we-evaluate-TurboQuant" class="common-anchor-header">Como devemos avaliar o TurboQuant?<button data-href="#How-should-we-evaluate-TurboQuant" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Zilliz: Na sua resposta pública, disse que o TurboQuant tinha alguns problemas sérios. Quais são, na sua opinião, os principais?</strong></p>
<p><strong>Jianyang Gao:</strong> Vemos três problemas principais.</p>
<p>Um é a forma como o documento descreve o trabalho anterior e discute a sobreposição. O artigo sobre o TurboQuant apresenta incorretamente a metodologia do RaBitQ, ignorando a parte mais semelhante, como a Transformação de Johnson-Lindenstrauss. Outra é a forma como o documento caracteriza o resultado teórico. Descreve o RaBitQ como subótimo sem fornecer qualquer explicação ou prova, mas o RaBitQ é, de facto, ótimo. A terceira é a imparcialidade da comparação experimental. Eles usam CPU de núcleo único para avaliar o RaBitQ enquanto usam GPU A100 para avaliar o TurboQuant.</p>
<p><strong>Zilliz: Vejamos primeiro a questão do benchmark. Porque é que acha que a comparação não foi justa?</strong></p>
<p><strong>Jianyang Gao:</strong> As afirmações de benchmark só têm significado se a configuração for comparável. Se um sistema for testado num ambiente de hardware ou software muito diferente, então o resultado pode refletir mais a configuração do que o próprio algoritmo.</p>
<p>Na nossa opinião, as diferenças na escolha do processador, na linguagem de implementação e no nível de otimização podem fazer uma grande diferença. É por isso que a metodologia de referência tem de ser interpretada com muito cuidado, especialmente pelas equipas que constroem sistemas de recuperação de produção.</p>
<p><strong>Cheng Long:</strong> O artigo também faz algumas outras afirmações que não se sustentam.</p>
<p>Por exemplo, o artigo diz que <strong>o RaBitQ não pode ser vectorizado</strong>. Mas o RaBitQ já tinha código de código aberto com computação vetorizada baseada em SIMD quando o artigo de 2024 foi publicado. Portanto, do nosso ponto de vista, essa afirmação era factualmente incorrecta.</p>
<p>Também vale a pena mencionar que começámos a trabalhar com a NVIDIA no ano passado e concluímos uma implementação de GPU do RaBitQ. O código relacionado está a ser revisto para inclusão na biblioteca cuVS da NVIDIA.</p>
<p><strong>Zilliz: A Milvus avaliou o TurboQuant no segundo semestre de 2025, mas não o adoptou. O que é que a sua equipa viu nos testes?</strong></p>
<p><strong>Li Liu:</strong> Contém de facto uma ideia útil. Na nossa opinião, faz uma pequena otimização na forma como a grelha de quantização é atribuída. Mas o passo mais importante do método - usar rotação aleatória para quantização - foi introduzido pela primeira vez pelo RaBitQ.</p>
<p>E quando se trata de estimativa imparcial, a abordagem do RaBitQ é mais limpa e a sua derivação teórica é mais forte.</p>
<p>Dito isto, como este foi um resultado do Google, testámo-lo em 2025. No nosso laboratório, sob um ambiente de CPU padronizado, o TurboQuant não superou a nossa versão interna do RaBitQ na maioria dos casos que avaliámos. Por isso, quando o mercado reagiu tão fortemente, ficámos verdadeiramente surpreendidos.</p>
<p><strong>Zilliz: Para os leitores que não analisaram atentamente os dois documentos, poderia explicar em linguagem simples onde o RaBitQ e o TurboQuant se sobrepõem?</strong></p>
<p><strong>Li Liu:</strong> A um nível elevado, ambos os métodos começam com uma <strong>rotação aleatória</strong>. Matematicamente, isso significa multiplicar o vetor por uma matriz ortogonal aleatória. Pode pensar-se nisso como uma alteração do ângulo de visão num espaço de elevada dimensão. Não altera as posições relativas dos pontos de dados, mas distribui a informação pelas dimensões de forma mais uniforme.</p>
<p>Depois disso, vem a <strong>quantização</strong>. Você divide o espaço contínuo de valor real em <strong>2^k células de grade</strong>, onde <strong>k</strong> é o número de bits de quantização, e então mapeia cada elemento do vetor para um ponto de grade próximo. O TurboQuant faz um pequeno ajuste aqui, alocando a grade de acordo com a distribuição de dados em vez de distribuí-la uniformemente.</p>
<p>O último passo é a <strong>estimativa de erro</strong>, e é aqui que reside a principal contribuição do RaBitQ. Os métodos tradicionais calculam diretamente a partir dos valores quantizados, o que torna o erro mais difícil de controlar. O RaBitQ estima o erro de quantização de forma mais precisa, e é daí que vem a sua otimização matemática. A solução do TurboQuant é mais complicada e, no nosso caso, a solução de compromisso não pareceu tão atractiva.</p>
<h2 id="Why-is-attribution-so-hard-to-resolve-in-practice" class="common-anchor-header">Porque é que a atribuição é tão difícil de resolver na prática?<button data-href="#Why-is-attribution-so-hard-to-resolve-in-practice" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Zilliz:</strong> Depois de publicar a sua declaração pública, como é que a Google e o ICLR reagiram?</p>
<p><strong>Cheng Long:</strong> O ICLR não tomou medidas. Enviámos-lhes um e-mail durante o período de revisão, em setembro do ano passado, mas não recebemos resposta. Escrevemos novamente em março deste ano e foi-nos dito que publicássemos os comentários no OpenReview, mas para além disso não houve qualquer ação.</p>
<p>Quanto à Google, um dos co-autores respondeu há alguns dias. A resposta dizia que iriam rever a versão do arXiv para corrigir a descrição incorrecta da optimalidade do RaBitQ.</p>
<p><strong>Zilliz:</strong> Anteriormente, a discussão estava enquadrada na má conduta académica. Agora parece ser também uma questão de desequilíbrio e de saber quem é que dá forma à história. Porque é que é tão difícil defender o seu trabalho?</p>
<p><strong>Cheng Long:</strong> Um dos problemas é a escala. As conferências de IA são atualmente tão grandes que um único ciclo pode ter dezenas de milhares de artigos. Os organizadores simplesmente não têm capacidade para lidar com todas as disputas deste género.</p>
<p>O outro problema é o desequilíbrio. As grandes empresas têm uma voz pública muito mais forte. Os investigadores independentes ou as equipas mais pequenas não têm o mesmo poder de comunicação.</p>
<p><strong>Jianyang Gao:</strong> Para os indivíduos, o custo é extremamente elevado. O Professor Long e eu mal conseguimos trabalhar normalmente nas últimas semanas.</p>
<p>O processo em si também tem sido frustrante. Fomos firmemente rejeitados quando contactámos os autores e não recebemos qualquer resposta dos organizadores da conferência. Na prática, muitos investigadores olham para situações como esta e decidem deixá-las passar. Mas é também assim que muitas contribuições originais desaparecem da narrativa pública.</p>
<p><strong>Zilliz:</strong> Parece que esta não é a primeira vez que a sua equipa se depara com este tipo de problema.</p>
<p><strong>Cheng Long:</strong> Não, não é.</p>
<p>Já vimos casos em que as empresas pegam no RaBitQ, fazem algumas modificações de engenharia, dão-lhe um novo nome e depois descrevem-no apenas como algo inspirado no RaBitQ.</p>
<p>É por isso que aprecio a forma como algumas equipas da indústria lidam com esta questão, incluindo a Milvus. Quando utilizam o RaBitQ, descrevem-no objetivamente. E quando acrescentam optimizações para além da versão original, explicam-nas claramente como sendo a sua própria contribuição de engenharia. Isso dá o devido crédito ao trabalho original e, ao mesmo tempo, mostra a força técnica da empresa.</p>
<p><strong>Zilliz:</strong> Quando as grandes empresas se baseiam em trabalhos académicos, costumam partilhar o financiamento ou a atribuição de benefícios?</p>
<p><strong>Jianyang Gao:</strong> Na maioria dos casos, não.</p>
<p>Dito isto, as grandes empresas continuam a ter um forte incentivo para apresentar um avanço técnico como algo que elas próprias criaram e não como algo que adoptaram de outros. Todos querem que os clientes e os investidores vejam o trabalho mais avançado como o resultado da inovação da sua própria equipa.</p>
<h2 id="What-comes-next-for-vector-quantization" class="common-anchor-header">O que se segue na quantização vetorial?<button data-href="#What-comes-next-for-vector-quantization" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Zilliz:</strong> Em que direcções de investigação estão a trabalhar atualmente?</p>
<p><strong>Cheng Long:</strong> Uma grande parte do nosso trabalho continuará a centrar-se na recuperação de vectores.</p>
<p>Uma direção é combinar o RaBitQ com diferentes índices de recuperação de vectores, como o IVF e o HNSW, para que o sistema possa suportar dados de maior escala com menor latência, maior simultaneidade e menor custo. Também estou a prestar atenção à compressão da cache KV.</p>
<p><strong>Jianyang Gao:</strong> A cache KV em modelos de grande dimensão e a recuperação de vectores partilham muitas das mesmas propriedades, tanto a nível matemático como a nível de sistemas, porque ambas lidam com vectores de elevada dimensão.</p>
<p>No futuro, quero pensar mais sobre a forma de aplicar ferramentas matemáticas, incluindo ideias de probabilidade de alta dimensão, para acelerar a inferência e o treino.</p>
<p><strong>Zilliz:</strong> Qual é o limite máximo da quantização de vectores como campo? Quanto é que ainda há para melhorar?</p>
<p><strong>Cheng Long:</strong> De um ponto de vista teórico, o limite máximo está à vista. O RaBitQ já é assimptoticamente ótimo.</p>
<p>Mas ainda há muito espaço no domínio da engenharia. Ainda é preciso lidar com as caraterísticas do hardware, a distribuição de dados, as restrições de latência e muitos outros factores práticos. É exatamente por isso que os sistemas de produção ainda precisam de um trabalho cuidadoso em áreas como a <a href="https://milvus.io/docs/architecture_overview.md">arquitetura da base de dados vetorial distribuída</a>, <a href="https://milvus.io/docs/sparse_vector.md">o suporte de vectores esparsos</a>, <a href="https://milvus.io/docs/reranking.md">os pipelines de reanálise</a> e a seleção de métricas na <a href="https://milvus.io/docs/metric.md">métrica de distância Milvus</a>.</p>
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
    </button></h2><p>Se quiser aprofundar os conhecimentos sobre a engenharia do RaBitQ e a sua integração no Milvus, estes são os recursos mais relevantes:</p>
<ul>
<li><a href="https://milvus.io/docs/ivf-rabitq.md">Documentação do IVF_RABITQ</a> - detalhes de configuração e orientação de ajuste.</li>
<li><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3×-more-queries-with-rabitq.md">Mergulho profundo na integração do RaBitQ</a> - como o Milvus transformou o RaBitQ em um índice de produção.</li>
<li><a href="https://milvus.io/blog/turboquant-rabitq-vector-database-cost.md">Como a quantização de vetores afeta os custos da infraestrutura de IA</a> - nossa análise mais ampla da discussão TurboQuant-RaBitQ.</li>
<li><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Postagem de lançamento do Milvus 2.6</a> - onde o IVF_RABITQ foi enviado como uma opção real de índice do Milvus.</li>
<li>Explicação<a href="https://milvus.io/docs/index-explained.md">do índice Milvus</a> - como o IVF_RABITQ se encaixa com outras opções de índice.</li>
<li><a href="https://milvus.io/docs/ivf-flat.md">Indexação IVF_FLAT</a> e <a href="https://milvus.io/docs/hnsw.md">indexação HNSW</a> - linhas de base úteis se estiver a comparar trocas de índices.</li>
<li><a href="https://milvus.io/docs/schema.md">Desenho de esquemas em Milvus</a> e <a href="https://milvus.io/docs/filtered-search.md">pesquisa filtrada</a> - útil se estiver a avaliar o RaBitQ numa aplicação real e não isoladamente.</li>
<li><a href="https://milvus.io/docs/quickstart.md">Início rápido do Milvus</a> e <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">design do sistema RAG</a> - útil se você quiser tentar isso em um pipeline de recuperação.</li>
</ul>
<p>Junte-se à <a href="https://slack.milvus.io/">comunidade Milvus Slack</a> ou <a href="https://milvus.io/office-hours">reserve o Milvus Office Hours</a> se quiser falar sobre sua carga de trabalho.</p>
<p>Se preferir ignorar a configuração da infraestrutura, pode inscrever-se <a href="https://cloud.zilliz.com/signup">no Zilliz Cloud</a> (Milvus totalmente gerido) .</p>
