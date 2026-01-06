---
id: >-
  zilliz-trained-and-open-sourced-bilingual-semantic-highlighting-model-for-production-ai.md
title: >-
  Treinámos e disponibilizámos um modelo de realce semântico bilingue para RAG
  de produção e pesquisa de IA
author: Cheney Zhang
date: 2026-01-06T00:00:00.000Z
cover: assets.zilliz.com/semantic_highlight_cover_f35a98fc58.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Semantic Highlighting, RAG, semantic search, Milvus, bilingual model'
meta_title: |
  Open-sourcing a Bilingual Semantic Highlighting Model for Production AI
desc: >-
  Aprofunde-se no realce semântico, saiba como é construído o modelo bilingue do
  Zilliz e qual o seu desempenho em benchmarks ingleses e chineses para sistemas
  RAG.
origin: >-
  https://milvus.io/blog/zilliz-trained-and-open-sourced-bilingual-semantic-highlighting-model-for-production-ai.md
---
<p>Quer esteja a criar uma pesquisa de produtos, um pipeline RAG ou um agente de IA, os utilizadores precisam da mesma coisa: uma forma rápida de ver porque é que um resultado é relevante. <strong>O destaque</strong> ajuda a marcar o texto exato que suporta a correspondência, para que os utilizadores não tenham de digitalizar todo o documento.</p>
<p>A maioria dos sistemas ainda depende do destaque baseado em palavras-chave. Se um utilizador pesquisar "desempenho do iPhone", o sistema destaca os tokens exactos "iPhone" e "desempenho". Mas isto deixa de funcionar assim que o texto exprime a mesma ideia utilizando uma redação diferente. Uma descrição como "chip A15 Bionic, mais de um milhão em benchmarks, suave e sem atrasos" aborda claramente o desempenho, mas nada é realçado porque as palavras-chave nunca aparecem.</p>
<p><strong>O realce semântico</strong> resolve este problema. Em vez de corresponder a cadeias de caracteres exactas, identifica trechos de texto que estão semanticamente alinhados com a consulta. Para os sistemas RAG, a pesquisa de IA e os agentes - em que a relevância depende do significado e não da forma superficial - isto produz explicações mais precisas e mais fiáveis sobre o motivo pelo qual um documento foi recuperado.</p>
<p>No entanto, os métodos de realce semântico existentes não foram concebidos para cargas de trabalho de IA de produção. Depois de avaliar todas as soluções disponíveis, descobrimos que nenhuma oferecia a precisão, a latência, a cobertura multilingue ou a robustez necessárias para pipelines RAG, sistemas de agentes ou pesquisa na Web em grande escala. <strong>Por isso, treinámos o nosso próprio modelo de realce semântico bilingue - e publicámo-lo em código aberto.</strong></p>
<ul>
<li><p>O nosso modelo de realce semântico: <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a></p></li>
<li><p>Diga-nos o que pensa - junte-se ao nosso <a href="https://discord.com/invite/8uyFbECzPX">Discord</a>, siga-nos no <a href="https://www.linkedin.com/company/the-milvus-project/">LinkedIn</a> ou marque uma sessão de <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">20 minutos connosco no Milvus Office Hours</a>.</p></li>
</ul>
<h2 id="How-Keyword-Based-Highlighting-Works--and-Why-It-Fails-in-Modern-AI-Systems" class="common-anchor-header">Como funciona o realce baseado em palavras-chave - e porque é que falha nos sistemas de IA modernos<button data-href="#How-Keyword-Based-Highlighting-Works--and-Why-It-Fails-in-Modern-AI-Systems" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Os sistemas de pesquisa tradicionais implementam o destaque através de uma simples correspondência de palavras-chave</strong>. Quando os resultados são devolvidos, o motor localiza as posições exactas dos tokens que correspondem à consulta e envolve-os em marcação (normalmente <code translate="no">&lt;em&gt;</code> tags), deixando o frontend renderizar o destaque. Isso funciona bem quando os termos da consulta aparecem literalmente no texto.</p>
<p>O problema é que este modelo assume que a relevância está ligada à sobreposição exacta de palavras-chave. Quando esse pressuposto é quebrado, a fiabilidade diminui rapidamente. Qualquer resultado que exprima a ideia correta com uma redação diferente acaba por não ter qualquer destaque, mesmo que o passo de recuperação esteja correto.</p>
<p>Esta fraqueza torna-se óbvia nas aplicações modernas de IA. Nos pipelines RAG e nos fluxos de trabalho de agentes de IA, as consultas são mais abstractas, os documentos são mais longos e as informações relevantes podem não reutilizar as mesmas palavras. O realce baseado em palavras-chave já não pode mostrar aos programadores - ou aos utilizadores finais - onde<em>está realmente a resposta</em>, o que faz com que o sistema geral pareça menos preciso, mesmo quando a recuperação está a funcionar como pretendido.</p>
<p>Suponhamos que um utilizador pergunta: <em>"Como posso melhorar a eficiência de execução do código Python?"</em> O sistema recupera um documento técnico de uma base de dados vetorial. O realce tradicional só pode marcar correspondências literais como <em>"Python",</em> <em>"código",</em> <em>"execução"</em> e <em>"eficiência".</em></p>
<p>No entanto, as partes mais úteis do documento podem ser:</p>
<ul>
<li><p>Usar operações vectorizadas NumPy em vez de loops explícitos</p></li>
<li><p>Evitar criar repetidamente objectos dentro de loops</p></li>
</ul>
<p>Estas frases respondem diretamente à pergunta, mas não contêm nenhum dos termos da consulta. Como resultado, o destaque tradicional falha completamente. O documento pode ser relevante, mas o utilizador continua a ter de o analisar linha a linha para localizar a resposta real.</p>
<p>O problema torna-se ainda mais acentuado com os agentes de IA. Muitas vezes, a consulta de pesquisa de um agente não é a pergunta original do utilizador, mas uma instrução derivada produzida através do raciocínio e da decomposição de tarefas. Por exemplo, se um utilizador perguntar <em>"Pode analisar as tendências recentes do mercado?",</em> o agente pode gerar uma consulta como "Recuperar dados de vendas de produtos electrónicos de consumo do quarto trimestre de 2024, taxas de crescimento anuais, alterações na quota de mercado dos principais concorrentes e flutuações de custos da cadeia de fornecimento".</p>
<p>Esta consulta abrange várias dimensões e codifica uma intenção complexa. O realce tradicional baseado em palavras-chave, no entanto, só pode marcar mecanicamente correspondências literais como <em>"2024",</em> <em>"dados de vendas"</em> ou <em>"taxa de crescimento".</em></p>
<p>Entretanto, as informações mais valiosas podem ser semelhantes:</p>
<ul>
<li><p>A série iPhone 15 impulsionou uma recuperação mais alargada do mercado</p></li>
<li><p>As restrições no fornecimento de chips fizeram subir os custos em 15%</p></li>
</ul>
<p>Estas conclusões podem não partilhar uma única palavra-chave com a consulta, embora sejam exatamente o que o agente está a tentar extrair. Os agentes precisam de identificar rapidamente informações verdadeiramente úteis a partir de grandes volumes de conteúdo recuperado - e o realce baseado em palavras-chave não oferece uma verdadeira ajuda.</p>
<h2 id="What-Is-Semantic-Highlighting-and-Pain-Points-in-Today’s-Solutions" class="common-anchor-header">O que é o realce semântico e os pontos problemáticos das soluções actuais<button data-href="#What-Is-Semantic-Highlighting-and-Pain-Points-in-Today’s-Solutions" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>O realce semântico baseia-se na mesma ideia subjacente à pesquisa semântica: correspondência baseada no significado e não em palavras exactas</strong>. Na pesquisa semântica, os modelos de incorporação mapeiam o texto em vectores para que um sistema de pesquisa, normalmente apoiado por uma base de dados vetorial como a <a href="https://milvus.io/">Milvus, possa</a>obter passagens que transmitam a mesma ideia que a consulta, mesmo que a redação seja diferente. O realce semântico aplica este princípio numa granularidade mais fina. Em vez de marcar literalmente as palavras-chave, destaca os trechos específicos de um documento que são semanticamente relevantes para a intenção do utilizador.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vs_20ec73c4a7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Esta abordagem resolve um problema central do realce tradicional, que só funciona quando os termos da consulta aparecem textualmente. Se um utilizador pesquisar "desempenho do iPhone", o realce baseado em palavras-chave ignora frases como "chip A15 Bionic", "mais de um milhão em testes de referência" ou "suave sem atraso", apesar de estas linhas responderem claramente à pergunta. O realce semântico capta estas ligações orientadas para o significado e apresenta as partes do texto que realmente interessam aos utilizadores.</p>
<p>Em teoria, este é um problema de correspondência semântica simples. Os modelos de incorporação modernos já codificam bem a semelhança, pelo que as peças conceptuais já estão no lugar. O desafio advém das restrições do mundo real: o realce ocorre em cada consulta, muitas vezes em muitos documentos recuperados, tornando a latência, o rendimento e a robustez entre domínios requisitos não negociáveis. Os modelos linguísticos de grande dimensão são simplesmente demasiado lentos e dispendiosos para serem executados neste caminho de elevada frequência.</p>
<p>É por isso que o realce semântico prático requer um modelo leve e especializado - suficientemente pequeno para se situar ao lado da infraestrutura de pesquisa e suficientemente rápido para devolver resultados em poucos milissegundos. É aqui que a maioria das soluções existentes falha. Os modelos pesados proporcionam precisão, mas não podem ser executados em grande escala; os modelos mais leves são rápidos, mas perdem precisão ou falham em dados multilingues ou de domínios específicos.</p>
<h3 id="opensearch-semantic-highlighter" class="common-anchor-header">opensearch-semantic-highlighter</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/opensearch_en_aea06a2114.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>No início deste ano, o OpenSearch lançou um modelo dedicado ao realce semântico: <a href="https://huggingface.co/opensearch-project/opensearch-semantic-highlighter-v1"><strong>opensearch-semantic-highlighter-v1</strong></a>. Embora seja uma tentativa significativa de resolver o problema, tem duas limitações críticas.</p>
<ul>
<li><p><strong>Janela de contexto pequena:</strong> O modelo baseia-se numa arquitetura BERT e suporta um máximo de 512 tokens - cerca de 300-400 caracteres chineses ou 400-500 palavras inglesas. Em cenários do mundo real, as descrições de produtos e os documentos técnicos abrangem frequentemente milhares de palavras. O conteúdo para além da primeira janela é simplesmente truncado, forçando o modelo a identificar destaques com base apenas numa pequena fração do documento.</p></li>
<li><p><strong>Fraca generalização fora do domínio:</strong> O modelo funciona bem apenas em distribuições de dados semelhantes ao seu conjunto de treino. Quando aplicado a dados fora do domínio - como a utilização de um modelo treinado em artigos noticiosos para destacar conteúdo de comércio eletrónico ou documentação técnica - o desempenho diminui drasticamente. Nas nossas experiências, o modelo atinge uma pontuação F1 de cerca de 0,72 em dados dentro do domínio, mas desce para cerca de 0,46 em conjuntos de dados fora do domínio. Este nível de instabilidade é problemático na produção. Para além disso, o modelo não suporta o chinês.</p></li>
</ul>
<h3 id="Provence--XProvence" class="common-anchor-header">Provence / XProvence</h3><p><a href="https://huggingface.co/naver/provence-reranker-debertav3-v1"><strong>O Provence</strong></a> é um modelo desenvolvido pela <a href="https://zilliz.com/customers/naver">Naver</a> e foi inicialmente treinado para a <strong>poda de contexto - uma</strong>tarefa que está intimamente relacionada com o realce semântico.</p>
<p>Ambas as tarefas assentam na mesma ideia subjacente: utilizar a correspondência semântica para identificar conteúdos relevantes e filtrar partes irrelevantes. Por este motivo, o Provence pode ser redireccionado para o realce semântico com relativamente pouca adaptação.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/provence_053cd3bccc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>O Provence é um modelo apenas em inglês e tem um desempenho razoavelmente bom nesse contexto. <a href="https://huggingface.co/naver/xprovence-reranker-bgem3-v1"><strong>O XProvence</strong></a> é a sua variante multilingue, suportando mais de uma dúzia de línguas, incluindo chinês, japonês e coreano. À primeira vista, isto faz com que o XProvence pareça ser um bom candidato para cenários de realce semântico bilingue ou multilingue.</p>
<p>Na prática, porém, tanto o Provence como o XProvence têm várias limitações notáveis:</p>
<ul>
<li><p><strong>Desempenho mais fraco em inglês no modelo multilingue:</strong> O XProvence não tem o mesmo desempenho que o Provence nos testes de referência em inglês. Trata-se de um compromisso comum nos modelos multilingues: a capacidade é partilhada entre as línguas, o que conduz frequentemente a um desempenho mais fraco nas línguas com recursos elevados, como o inglês. Esta limitação é importante em sistemas do mundo real em que o inglês continua a ser a carga de trabalho principal ou dominante.</p></li>
<li><p><strong>Desempenho limitado em chinês:</strong> O XProvence suporta muitos idiomas. Durante o treinamento multilíngüe, os dados e a capacidade do modelo são distribuídos entre os idiomas, o que limita a capacidade do modelo de se especializar em um único idioma. Como resultado, o seu desempenho em chinês é apenas marginalmente aceitável e muitas vezes insuficiente para casos de utilização de realce de alta precisão.</p></li>
<li><p><strong>Incompatibilidade entre os objectivos de poda e de realce:</strong> O Provence está optimizado para a poda de contexto, em que a prioridade é a recordação - manter o máximo possível de conteúdo potencialmente útil para evitar perder informações críticas. O realce semântico, pelo contrário, privilegia a precisão: realça apenas as frases mais relevantes e não grandes porções do documento. Quando os modelos do tipo Provence são aplicados ao realce, esta discrepância conduz frequentemente a realces demasiado amplos ou ruidosos.</p></li>
<li><p><strong>Licenciamento restritivo:</strong> Tanto o Provence como o XProvence são lançados sob a licença CC BY-NC 4.0, que não permite a utilização comercial. Esta restrição, por si só, torna-os inadequados para muitas implementações de produção.</p></li>
</ul>
<h3 id="Open-Provence" class="common-anchor-header">Open Provence</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/openprovence_en_c4f0aa8b65.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://github.com/hotchpotch/open_provence"><strong>O Open Provence</strong></a> é um projeto orientado para a comunidade que reimplementa o pipeline de formação do Provence de uma forma aberta e transparente. Fornece não só scripts de formação, mas também fluxos de trabalho de processamento de dados, ferramentas de avaliação e modelos pré-treinados a várias escalas.</p>
<p>Uma das principais vantagens do Open Provence é a sua <strong>licença MIT permissiva</strong>. Ao contrário do Provence e do XProvence, pode ser utilizado com segurança em ambientes comerciais sem restrições legais, o que o torna atrativo para equipas orientadas para a produção.</p>
<p>Dito isto, o Open Provence suporta atualmente apenas <strong>inglês e japonês</strong>, o que o torna inadequado para os nossos casos de utilização bilingue.</p>
<h2 id="We-Trained-and-Open-Sourced-a-Bilingual-Semantic-Highlighting-Model" class="common-anchor-header">Treinámos e disponibilizámos um modelo de realce semântico bilingue<button data-href="#We-Trained-and-Open-Sourced-a-Bilingual-Semantic-Highlighting-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>Um modelo de realce semântico concebido para cargas de trabalho do mundo real tem de fornecer algumas capacidades essenciais:</p>
<ul>
<li><p>Forte desempenho multilingue</p></li>
<li><p>Uma janela de contexto suficientemente grande para suportar documentos longos</p></li>
<li><p>Generalização robusta fora do domínio</p></li>
<li><p>Elevada precisão nas tarefas de realce semântico</p></li>
<li><p>Uma licença permissiva e de fácil produção (MIT ou Apache 2.0)</p></li>
</ul>
<p>Depois de avaliar as soluções existentes, descobrimos que nenhum dos modelos disponíveis satisfazia os requisitos necessários para a utilização em produção. Por isso, decidimos treinar o nosso próprio modelo de realce semântico: <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hugging_face_56eca8f423.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Para conseguir tudo isto, adoptámos uma abordagem simples: utilizar modelos linguísticos de grande dimensão para gerar dados rotulados de alta qualidade e, em seguida, treinar um modelo de realce semântico leve com base nos mesmos, utilizando ferramentas de código aberto. Isto permite-nos combinar a força de raciocínio dos LLMs com a eficiência e a baixa latência necessárias nos sistemas de produção.</p>
<p><strong>A parte mais difícil deste processo é a construção de dados</strong>. Durante a anotação, pedimos a um LLM (Qwen3 8B) que produza não só os intervalos de destaque, mas também todo o raciocínio por detrás deles. Este sinal de raciocínio adicional produz uma supervisão mais exacta e consistente e melhora significativamente a qualidade do modelo resultante.</p>
<p>A um nível elevado, o pipeline de anotação funciona da seguinte forma: <strong>raciocínio LLM → etiquetas de realce → filtragem → amostra de treino final.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/pipeline_en_2e917fe1ce.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Esta conceção proporciona três benefícios concretos na prática:</p>
<ul>
<li><p><strong>Maior qualidade de rotulagem</strong>: O modelo é solicitado a <em>pensar primeiro e depois a responder</em>. Este passo intermédio de raciocínio funciona como uma auto-verificação incorporada, reduzindo a probabilidade de rótulos superficiais ou inconsistentes.</p></li>
<li><p><strong>Melhor observabilidade e depuração</strong>: Como cada rótulo é acompanhado por um traço de raciocínio, os erros tornam-se visíveis. Isso facilita o diagnóstico de casos de falha e o ajuste rápido de prompts, regras ou filtros de dados no pipeline.</p></li>
<li><p><strong>Dados reutilizáveis</strong>: Os traços de raciocínio fornecem um contexto valioso para futuras reetiquetagens. À medida que os requisitos mudam, os mesmos dados podem ser revisitados e refinados sem começar do zero.</p></li>
</ul>
<p>Utilizando este pipeline, gerámos mais de um milhão de amostras de formação bilingues, divididas aproximadamente de forma igual entre inglês e chinês.</p>
<p>Para o treino do modelo, partimos do BGE-M3 Reranker v2 (parâmetros de 0,6B, janela de contexto de 8.192 tokens), adoptámos a estrutura de treino Open Provence e treinámos durante três épocas em 8× GPUs A100, completando o treino em aproximadamente cinco horas.</p>
<p>Iremos aprofundar estas escolhas técnicas - incluindo a razão pela qual confiamos em traços de raciocínio, como selecionámos o modelo de base e como o conjunto de dados foi construído - numa publicação posterior.</p>
<h2 id="Benchmarking-Zilliz’s-Bilingual-Semantic-Highlighting-Model" class="common-anchor-header">Avaliação comparativa do modelo de realce semântico bilingue do Zilliz<button data-href="#Benchmarking-Zilliz’s-Bilingual-Semantic-Highlighting-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>Para avaliar o desempenho no mundo real, avaliámos vários modelos de realce semântico num conjunto diversificado de conjuntos de dados. As referências abrangem cenários dentro e fora do domínio, em inglês e chinês, para refletir a variedade de conteúdos encontrados nos sistemas de produção.</p>
<h3 id="Datasets" class="common-anchor-header">Conjuntos de dados</h3><p>Utilizámos os seguintes conjuntos de dados na nossa avaliação:</p>
<ul>
<li><p><strong>MultiSpanQA (inglês)</strong> - um conjunto de dados de resposta a perguntas multi-span dentro do domínio</p></li>
<li><p><strong>WikiText-2 (inglês)</strong> - um corpus da Wikipédia fora do domínio</p></li>
<li><p><strong>MultiSpanQA-ZH (chinês)</strong> - um conjunto de dados chinês de resposta a perguntas multi-span</p></li>
<li><p><strong>WikiText-2-ZH (chinês)</strong> - um corpus da Wikipédia chinês fora do domínio</p></li>
</ul>
<h3 id="Models-Compared" class="common-anchor-header">Modelos comparados</h3><p>Os modelos incluídos na comparação são:</p>
<ul>
<li><p><strong>Modelos Open Provence</strong></p></li>
<li><p><strong>Provence / XProvence</strong> (lançado pela Naver)</p></li>
<li><p><strong>Marcador semântico OpenSearch</strong></p></li>
<li><p><strong>Modelo de realce semântico bilingue de Zilliz</strong></p></li>
</ul>
<h3 id="Results-and-Analysis" class="common-anchor-header">Resultados e análise</h3><p><strong>Conjuntos de dados em inglês:</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/en_dataset_fce4cbc747.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Conjuntos de dados chineses:</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/zh_dataset_ac7760e0b5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Em todos os parâmetros de referência bilingues, o nosso modelo atinge <strong>pontuações F1 médias de última geração</strong>, superando todos os modelos e abordagens avaliados anteriormente. Os ganhos são especialmente pronunciados nos <strong>conjuntos de dados chineses</strong>, onde o nosso modelo supera significativamente o XProvence - o único outro modelo avaliado com suporte chinês.</p>
<p>Mais importante ainda, o nosso modelo apresenta um desempenho equilibrado em inglês e chinês, uma propriedade que as soluções existentes têm dificuldade em alcançar:</p>
<ul>
<li><p><strong>O Open Provence</strong> suporta apenas o inglês</p></li>
<li><p><strong>O XProvence</strong> sacrifica o desempenho em inglês em comparação com o Provence</p></li>
<li><p><strong>O OpenSearch Semantic Highlighter</strong> não suporta o chinês e apresenta uma fraca generalização</p></li>
</ul>
<p>Como resultado, o nosso modelo evita os compromissos comuns entre cobertura linguística e desempenho, tornando-o mais adequado para implementações bilingues no mundo real.</p>
<h3 id="A-Concrete-Example-in-Practice" class="common-anchor-header">Um exemplo concreto na prática</h3><p>Para além das pontuações de referência, é muitas vezes mais revelador examinar um exemplo concreto. O caso seguinte mostra como o nosso modelo se comporta num cenário real de realce semântico e porque é que a precisão é importante.</p>
<p><strong>Consulta:</strong> Quem escreveu o filme <em>The Killing of a Sacred Deer</em>?</p>
<p><strong>Contexto (5 frases):</strong></p>
<ol>
<li><p><em>The Killing of a Sacred Deer</em> é um filme de thriller psicológico de 2017 realizado por Yorgos Lanthimos, com o argumento escrito por Lanthimos e Efthymis Filippou.</p></li>
<li><p>O filme é protagonizado por Colin Farrell, Nicole Kidman, Barry Keoghan, Raffey Cassidy, Sunny Suljic, Alicia Silverstone e Bill Camp.</p></li>
<li><p>A história é baseada na antiga peça grega <em>Ifigénia em Áulis</em>, de Eurípides.</p></li>
<li><p>O filme acompanha um cirurgião cardíaco que estabelece uma amizade secreta com um adolescente ligado ao seu passado.</p></li>
<li><p>Ele apresenta o rapaz à sua família, após o que começam a ocorrer doenças misteriosas.</p></li>
</ol>
<p><strong>Destaque correto: A frase 1</strong> é a resposta correta, pois indica explicitamente que o argumento foi escrito por Yorgos Lanthimos e Efthymis Filippou.</p>
<p>Este exemplo contém uma armadilha subtil. <strong>A frase 3</strong> menciona Eurípides, o autor da peça original grega na qual a história é vagamente baseada. No entanto, a pergunta é sobre quem escreveu o <em>filme</em> e não sobre o material de origem antigo. A resposta correta é, portanto, os argumentistas do filme e não o dramaturgo de há milhares de anos.</p>
<p><strong>Resultados:</strong></p>
<p>A tabela abaixo resume o desempenho dos diferentes modelos neste exemplo.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Modelo</strong></th><th style="text-align:center"><strong>Resposta correta identificada</strong></th><th style="text-align:center"><strong>Resultado</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>O nosso (M3 bilingue)</strong></td><td style="text-align:center">✓</td><td style="text-align:center">Selecionou a frase 1 (correta) e a frase 3</td></tr>
<tr><td style="text-align:center"><strong>XProvence v1</strong></td><td style="text-align:center">✗</td><td style="text-align:center">Selecionou apenas a frase 3, falhou a resposta correta</td></tr>
<tr><td style="text-align:center"><strong>XProvence v2</strong></td><td style="text-align:center">✗</td><td style="text-align:center">Selecionou apenas a frase 3, falhou a resposta correta</td></tr>
</tbody>
</table>
<p><strong>Comparação da pontuação ao nível da frase</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Frase</strong></th><th><strong>O nosso (Bilingue M3)</strong></th><th style="text-align:center"><strong>XProvence v1</strong></th><th style="text-align:center"><strong>XProvence v2</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Frase 1 (argumento de filme, <strong>correto</strong>)</td><td><strong>0.915</strong></td><td style="text-align:center">0.133</td><td style="text-align:center">0.081</td></tr>
<tr><td style="text-align:center">Frase 3 (peça original, distração)</td><td>0.719</td><td style="text-align:center"><strong>0.947</strong></td><td style="text-align:center"><strong>0.802</strong></td></tr>
</tbody>
</table>
<p><strong>Onde XProvence fica aquém</strong></p>
<ul>
<li><p>O XProvence é fortemente atraído pelas palavras-chave <em>"Eurípides"</em> e <em>"escreveu",</em> atribuindo à frase 3 uma pontuação quase perfeita (0,947 e 0,802).</p></li>
<li><p>Ao mesmo tempo, ignora largamente a resposta correta na frase 1, atribuindo pontuações extremamente baixas (0,133 e 0,081).</p></li>
<li><p>Mesmo depois de baixar o limiar de decisão de 0,5 para 0,2, o modelo continua a não revelar a resposta correta.</p></li>
</ul>
<p>Por outras palavras, o modelo é principalmente orientado por associações de palavras-chave de nível superficial e não pela intenção real da pergunta.</p>
<p><strong>Como é que o nosso modelo se comporta de forma diferente</strong></p>
<ul>
<li><p>O nosso modelo atribui uma pontuação elevada (0,915) à resposta correta na frase 1, identificando corretamente <em>os argumentistas do filme</em>.</p></li>
<li><p>Também atribui uma pontuação moderada (0,719) à frase 3, uma vez que essa frase menciona um conceito relacionado com o guião.</p></li>
<li><p>O mais importante é que a separação é clara e significativa: <strong>0,915 vs. 0,719</strong>, uma diferença de quase 0,2.</p></li>
</ul>
<p>Este exemplo realça a força central da nossa abordagem: ir além das associações baseadas em palavras-chave para interpretar corretamente a intenção do utilizador. Mesmo quando aparecem vários conceitos de "autor", o modelo destaca consistentemente aquele a que a pergunta realmente se refere.</p>
<p>Compartilharemos um relatório de avaliação mais detalhado e estudos de caso adicionais em uma publicação posterior.</p>
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
    </button></h2><p>O nosso modelo de realce semântico <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">bilingue</a> no <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">Hugging Face</a> é de código aberto, com todos os pesos do modelo disponíveis publicamente para que possa começar a experimentar imediatamente. Gostaríamos muito de saber como funciona para si - por favor, partilhe os seus comentários, problemas ou ideias de melhoramento à medida que o experimenta.</p>
<p>Em paralelo, estamos a trabalhar num serviço de inferência pronto a produzir e a integrar o modelo diretamente no <a href="https://milvus.io/">Milvus</a> como uma API de Realce Semântico nativa. Essa integração já está em andamento e estará disponível em breve.</p>
<p>O realce semântico abre a porta a uma experiência mais intuitiva de RAG e IA agêntica. Quando o Milvus recupera vários documentos longos, o sistema pode imediatamente fazer aparecer as frases mais relevantes, tornando claro onde está a resposta. Isto não só melhora a experiência do utilizador final, como também ajuda os programadores a depurar os pipelines de recuperação, mostrando exatamente em que partes do contexto o sistema se baseia.</p>
<p>Acreditamos que o realce semântico se tornará um recurso padrão na próxima geração de sistemas de pesquisa e RAG. Se tiver ideias, sugestões ou casos de utilização para o realce semântico bilingue, junte-se ao nosso <a href="https://discord.com/invite/8uyFbECzPX">canal Discord</a> e partilhe as suas ideias. Também pode reservar uma sessão individual de 20 minutos para obter informações, orientações e respostas às suas perguntas através do <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a>.</p>
