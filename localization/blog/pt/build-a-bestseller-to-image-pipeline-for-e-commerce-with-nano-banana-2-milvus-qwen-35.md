---
id: >-
  build-a-bestseller-to-image-pipeline-for-e-commerce-with-nano-banana-2-milvus-qwen-35.md
title: >-
  Criar um pipeline de best-seller para imagem para comércio eletrónico com Nano
  Banana 2 + Milvus + Qwen 3.5
author: Lumina Wang
date: 2026-3-3
cover: assets.zilliz.com/blog-images/20260303-100432.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: >-
  Nano Banana 2, Milvus, e-commerce AI image generation, AI product photography,
  vector search
meta_keywords: >-
  Nano Banana 2, Milvus, e-commerce AI image generation, AI product photography,
  vector search
meta_title: |
  Nano Banana 2 + Milvus: E-Commerce AI Image Generation Tutorial
desc: >-
  Tutorial passo-a-passo: utilize o Nano Banana 2, a pesquisa híbrida Milvus e o
  Qwen 3.5 para gerar fotografias de produtos para comércio eletrónico a partir
  de apresentações planas a 1/3 do custo.
origin: >-
  https://milvus.io/blog/build-a-bestseller-to-image-pipeline-for-e-commerce-with-nano-banana-2-milvus-qwen-35.md
---
<p>Se constrói ferramentas de IA para vendedores de comércio eletrónico, provavelmente já ouviu este pedido milhares de vezes: "Tenho um novo produto. Dê-me uma imagem promocional que pareça pertencer a uma lista de bestsellers. Sem fotógrafo, sem estúdio, e que seja barata".</p>
<p>Este é o problema numa frase. Os vendedores têm fotografias planas e um catálogo de bestsellers que já convertem. Querem fazer a ponte entre os dois com a IA, de forma rápida e em grande escala.</p>
<p>Quando a Google lançou o Nano Banana 2 (Gemini 3.1 Flash Image) em 26 de fevereiro de 2026, testámo-lo no mesmo dia e integrámo-lo no nosso pipeline de recuperação baseado no Milvus. O resultado: o custo total de geração de imagens baixou para cerca de um terço do que era gasto anteriormente e o rendimento duplicou. O corte de preço por imagem (cerca de 50% mais barato do que o Nano Banana Pro) é responsável por parte disso, mas a maior economia vem da eliminação total dos ciclos de retrabalho.</p>
<p>Este artigo aborda os aspectos positivos do Nano Banana 2 para o comércio eletrónico, os aspectos em que ainda é insuficiente e, em seguida, apresenta um tutorial prático para o pipeline completo: Pesquisa híbrida <strong>Milvus</strong> para encontrar bestsellers visualmente semelhantes, <strong>Qwen</strong> 3.5 para análise de estilo e <strong>Nano Banana 2</strong> para geração final.</p>
<h2 id="What’s-New-with-Nano-Banana-2" class="common-anchor-header">O que há de novo no Nano Banana 2?<button data-href="#What’s-New-with-Nano-Banana-2" class="anchor-icon" translate="no">
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
    </button></h2><p>O Nano Banana 2 (Gemini 3.1 Flash Image) foi lançado em 26 de fevereiro de 2026. Ele traz a maioria dos recursos do Nano Banana Pro para a arquitetura Flash, o que significa uma geração mais rápida a um preço mais baixo. Aqui estão as principais actualizações:</p>
<ul>
<li><strong>Qualidade de nível profissional na velocidade do Flash.</strong> A Nano Banana 2 oferece conhecimento, raciocínio e fidelidade visual de classe mundial, antes exclusivos do Pro, mas com a latência e a taxa de transferência do Flash.</li>
<li><strong>Saída de 512px a 4K.</strong> Quatro níveis de resolução (512px, 1K, 2K, 4K) com suporte nativo. O nível de 512px é novo e exclusivo do Nano Banana 2.</li>
<li><strong>14 proporções de imagem.</strong> Adiciona 4:1, 1:4, 8:1 e 1:8 ao conjunto existente (1:1, 2:3, 3:2, 3:4, 4:3, 4:5, 5:4, 9:16, 16:9, 21:9).</li>
<li><strong>Até 14 imagens de referência.</strong> Mantém a semelhança de caracteres para até 5 caracteres e a fidelidade de objetos para até 14 objetos em um único fluxo de trabalho.</li>
<li><strong>Renderização de texto melhorada.</strong> Gera texto legível e preciso na imagem em vários idiomas, com suporte para tradução e localização numa única geração.</li>
<li><strong>Base de pesquisa de imagens.</strong> Recorre a dados da Web em tempo real e a imagens da Pesquisa Google para gerar representações mais precisas de temas do mundo real.</li>
<li><strong>~50% mais barato por imagem.</strong> Com uma resolução de 1K: <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0.</mn><mi>067versusPro′s0</mi></mrow><annotation encoding="application/x-tex">.067 versus</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7519em;"></span></span></span></span>0 <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">.</span><span class="mord"><span class="mord mathnormal">067versusPro</span></span></span></span></span><span class="pstrut" style="height:2.7em;"></span> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord mathnormal">′s0</span></span></span></span>.134.</li>
</ul>
<p><strong>Um caso de utilização divertido do Nano Banano 2: Gerar um panorama com conhecimento da localização com base numa simples captura de ecrã do Google Maps</strong></p>
<p>Tendo em conta uma imagem de ecrã do Google Maps e uma instrução de estilo, o modelo reconhece o contexto geográfico e gera um panorama que preserva as relações espaciais corretas. Útil para produzir criativos publicitários direcionados para uma região (um cenário de café parisiense, uma paisagem urbana de Tóquio) sem recorrer a fotografias de arquivo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Para obter o conjunto completo de funcionalidades, consulte <a href="https://blog.google/innovation-and-ai/technology/ai/nano-banana-2/">o blogue de anúncios da Google</a> e a <a href="https://ai.google.dev/gemini-api/docs/image-generation">documentação para programadores</a>.</p>
<h2 id="What-Does-This-Nano-Banana-Update-Mean-For-E-Commerce" class="common-anchor-header">O que significa esta atualização do Nano Banana para o comércio eletrónico?<button data-href="#What-Does-This-Nano-Banana-Update-Mean-For-E-Commerce" class="anchor-icon" translate="no">
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
    </button></h2><p>O comércio eletrónico é um dos sectores com maior intensidade de imagem. Listagens de produtos, anúncios de marketplace, criativos sociais, campanhas de banners, montras localizadas: todos os canais exigem um fluxo constante de activos visuais, cada um com as suas próprias especificações.</p>
<p>Os principais requisitos para a geração de imagens com IA no comércio eletrónico resumem-se a:</p>
<ul>
<li><strong>Manter os custos baixos</strong> - o custo por imagem tem de funcionar à escala do catálogo.</li>
<li><strong>Corresponder ao aspeto dos bestsellers comprovados</strong> - as novas imagens devem estar alinhadas com o estilo visual das listagens que já convertem.</li>
<li><strong>Evitar infracções</strong> - não copiar os criativos da concorrência nem reutilizar activos protegidos.</li>
</ul>
<p>Para além disso, os vendedores transfronteiriços precisam de:</p>
<ul>
<li><strong>Suporte de formato multiplataforma</strong> - diferentes rácios de aspeto e especificações para mercados, anúncios e montras.</li>
<li><strong>Renderização de texto multilingue</strong> - texto limpo e preciso na imagem em vários idiomas.</li>
</ul>
<p>O Nano Banana 2 está perto de preencher todos os requisitos. As secções abaixo descrevem o que cada atualização significa na prática: onde resolve diretamente um problema de comércio eletrónico, onde fica aquém e qual é o impacto real nos custos.</p>
<h3 id="Cut-Output-Generation-Costs-by-Up-to-60" class="common-anchor-header">Reduzir os custos de geração de resultados em até 60%</h3><p>Com uma resolução de 1K, a Nano Banana 2 custa <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0,</mn><mi>067perimageversusPro′s0</mi></mrow><annotation encoding="application/x-tex">,067 por imagem, em comparação com a Pro</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.9463em;vertical-align:-0.1944em;"></span></span></span></span>0 <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">,</span><span class="mord"><span class="mord mathnormal">067perimageversusPro</span></span></span></span></span><span class="pstrut" style="height:2.7em;"></span> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord mathnormal">′s0</span></span></span></span>,134, o que representa um corte direto de 50%. Mas o preço por imagem é apenas metade da história. O que costumava acabar com os orçamentos dos utilizadores era o retrabalho. Cada mercado impõe as suas próprias especificações de imagem (1:1 para a Amazon, 3:4 para as montras do Shopify, ultrawide para os anúncios em banner), e produzir cada variante significava uma passagem de geração separada com os seus próprios modos de falha.</p>
<p>A Nano Banana 2 reduz esses passos extra num só.</p>
<ul>
<li><p><strong>Quatro níveis de resolução nativa.</strong></p></li>
<li><p>512px ($0,045)</p></li>
<li><p>1K ($0.067)</p></li>
<li><p>2K ($0.101)</p></li>
<li><p>4K ($0.151).</p></li>
</ul>
<p>O nível de 512px é novo e exclusivo da Nano Banana 2. Os utilizadores podem agora gerar rascunhos de 512 px de baixo custo para iteração e produzir o ativo final em 2K ou 4K sem um passo de upscaling separado.</p>
<ul>
<li><p><strong>14 rácios de aspeto suportados</strong> no total. Aqui estão alguns exemplos:</p></li>
<li><p>4:1</p></li>
<li><p>1:4</p></li>
<li><p>8:1</p></li>
<li><p>1:8</p></li>
</ul>
<p>Estes novos rácios ultra-largos e ultra-altos juntam-se ao conjunto existente. Uma sessão de geração pode produzir vários formatos como: <strong>Imagem principal da Amazon</strong> (1:1), <strong>herói da montra</strong> (3:4) e <strong>anúncio em banner</strong> (ultra-wide ou outros rácios).</p>
<p>Não é necessário recortar, preencher ou voltar a pedir para estes 4 rácios. Os restantes 10 rácios de aspeto estão incluídos no conjunto completo, tornando o processo mais flexível em diferentes plataformas.</p>
<p>A poupança de ~50% por imagem só por si reduziria a fatura para metade. A eliminação do retrabalho entre resoluções e proporções foi o que reduziu o custo total para cerca de um terço do que era gasto anteriormente.</p>
<h3 id="Support-Up-to-14-Reference-Images-with-Bestseller-Style" class="common-anchor-header">Suporte para até 14 imagens de referência com o estilo Bestseller</h3><p>De todas as actualizações da Nano Banana 2, a mistura de várias referências tem o maior impacto no nosso pipeline Milvus. A Nano Banana 2 aceita até 14 imagens de referência em uma única solicitação, mantendo:</p>
<ul>
<li>Semelhança de caracteres para até <strong>5 caracteres</strong></li>
<li>Fidelidade do objeto para um máximo de <strong>14 objectos</strong></li>
</ul>
<p>Na prática, recuperámos várias imagens de best-sellers do Milvus, passámo-las como referências e a imagem gerada herdou a composição da cena, a iluminação, a pose e a colocação de adereços. Não foi necessária qualquer engenharia para reconstruir esses padrões à mão.</p>
<p>Os modelos anteriores suportavam apenas uma ou duas referências, o que obrigava os utilizadores a escolher um único best-seller para imitar. Com 14 espaços de referência, podíamos misturar caraterísticas de várias listagens com melhor desempenho e deixar que o modelo sintetizasse um estilo composto. Esta é a capacidade que torna possível o pipeline baseado em recuperação no tutorial abaixo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image15.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Produce-Premium-Commercial-Ready-Visuals-Without-Traditional-Production-Cost-or-Logistics" class="common-anchor-header">Produzir imagens de qualidade superior, prontas a comercializar, sem custos de produção ou logística tradicionais</h3><p>Para uma geração de imagens consistente e fiável, evite colocar todos os seus requisitos num único prompt. Uma abordagem mais fiável é trabalhar por fases: gerar primeiro o fundo, depois o modelo separadamente e, por fim, compô-los em conjunto.</p>
<p>Testámos a geração de fundo nos três modelos Nano Banana com a mesma solicitação: um horizonte de Xangai 4:1 ultrawide num dia chuvoso visto através de uma janela, com a Oriental Pearl Tower visível. Este pedido testa a composição, os detalhes arquitectónicos e o fotorrealismo numa única passagem.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h4 id="Original-Nano-Banana-vs-Nano-Banana-Pro-vs-Nano-Banana-2" class="common-anchor-header">Nano Banana Original vs. Nano Banana Pro vs. Nano Banana 2</h4><ul>
<li><strong>Nano Banana original.</strong> Textura de chuva natural com distribuição de gotas credível, mas detalhes de edifícios demasiado suavizados. A Torre Pérola Oriental quase não foi reconhecida e a resolução ficou aquém dos requisitos de produção.</li>
<li><strong>Nano Banana Pro.</strong> Atmosfera cinematográfica: a iluminação interior quente contrastava de forma convincente com a chuva fria. No entanto, omitiu totalmente a moldura da janela, achatando a sensação de profundidade da imagem. Utilizável como imagem de apoio, não como herói.</li>
<li><strong>Nano Banana 2.</strong> Renderizou a cena completa. A moldura da janela em primeiro plano criou profundidade. A Torre Pérola do Oriente foi claramente pormenorizada. Os navios apareceram no rio Huangpu. A iluminação em camadas distinguia o calor interior do nublado exterior. As texturas da chuva e das manchas de água eram quase fotográficas e o rácio ultra-largo de 4:1 mantinha a perspetiva correta, apenas com uma pequena distorção na margem esquerda da janela.</li>
</ul>
<p>Para a maioria das tarefas de geração de fundo em fotografia de produtos, considerámos a saída da Nano Banana 2 utilizável sem pós-processamento.</p>
<h3 id="Render-In-Image-Text-Cleanly-Across-Languages" class="common-anchor-header">Renderiza texto na imagem de forma limpa em vários idiomas</h3><p>As etiquetas de preço, os banners promocionais e a cópia multilingue são inevitáveis nas imagens de comércio eletrónico e, historicamente, têm sido um ponto de rutura para a geração de IA. O Nano Banana 2 lida com eles de forma significativamente melhor, suportando a renderização de texto na imagem em vários idiomas com tradução e localização numa única geração.</p>
<p><strong>Renderização de texto padrão.</strong> Nos nossos testes, a saída de texto não apresentava erros em todos os formatos de comércio eletrónico que experimentámos: etiquetas de preços, pequenos slogans de marketing e descrições de produtos bilingues.</p>
<p><strong>Continuação de escrita à mão.</strong> Uma vez que o comércio eletrónico requer frequentemente elementos manuscritos, como etiquetas de preços e cartões personalizados, testámos se os modelos podiam corresponder a um estilo manuscrito existente e ampliá-lo - especificamente, corresponder a uma lista de tarefas manuscrita e adicionar 5 novos itens no mesmo estilo. Resultados dos três modelos:</p>
<ul>
<li><strong>Original Nano Banana.</strong> Números de sequência repetidos, estrutura mal compreendida.</li>
<li><strong>Nano Banana Pro.</strong> Esquema correto, mas má reprodução do estilo de letra.</li>
<li><strong>Nano Banana 2.</strong> Zero erros. Correspondeu ao peso do traço e ao estilo da letra de forma suficientemente próxima para ser indistinguível da fonte.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image12.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>No entanto,</strong> a própria documentação da Google refere que o Nano Banana 2 "pode ainda ter dificuldades com a ortografia exacta e com os detalhes finos nas imagens". Os nossos resultados foram corretos em todos os formatos que testámos, mas qualquer fluxo de trabalho de produção deve incluir um passo de verificação de texto antes da publicação.</p>
<h2 id="Step-by-Step-Tutorial-Build-a-Bestseller-to-Image-Pipeline-with-Milvus-Qwen-35-and-Nano-Banana-2" class="common-anchor-header">Tutorial passo a passo: Construir um pipeline de best-seller para imagem com Milvus, Qwen 3.5 e Nano Banana 2<button data-href="#Step-by-Step-Tutorial-Build-a-Bestseller-to-Image-Pipeline-with-Milvus-Qwen-35-and-Nano-Banana-2" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Before-we-begin-Architecture-and-Model-Setup" class="common-anchor-header">Antes de começarmos: Arquitetura e configuração do modelo</h3><p>Para evitar a aleatoriedade da geração de um único prompt, dividimos o processo em três estágios controláveis: recuperar o que já funciona com a busca híbrida <strong>Milvus</strong>, analisar por que funciona com o <strong>Qwen 3.5</strong> e, em seguida, gerar a imagem final com essas restrições incorporadas com o <strong>Nano Banana 2</strong>.</p>
<p>Uma breve introdução a cada ferramenta, caso não tenha trabalhado com elas antes:</p>
<ul>
<li><strong><a href="https://milvus.io/">Milvus</a></strong><a href="https://milvus.io/">:</a> a base de dados vetorial de código aberto mais amplamente adoptada. Armazena o seu catálogo de produtos como vectores e executa uma pesquisa híbrida (filtros densos + esparsos + escalares) para encontrar as imagens mais vendidas mais semelhantes a um novo produto.</li>
<li><strong>Qwen 3.5</strong>: um LLM multimodal popular. Recolhe as imagens dos bestsellers e extrai os padrões visuais subjacentes (disposição da cena, iluminação, pose, estado de espírito) numa mensagem de estilo estruturada.</li>
<li><strong>Nano Banana 2</strong>: modelo de geração de imagens do Google (Gemini 3.1 Flash Image). Recebe três entradas: a imagem plana de um novo produto, uma referência de um best-seller e o prompt de estilo do Qwen 3.5. Produz a foto promocional final.</li>
</ul>
<p>A lógica por trás desta arquitetura começa com uma observação: o ativo visual mais valioso em qualquer catálogo de comércio eletrónico é a biblioteca de imagens de bestsellers que já foram convertidas. As poses, composições e iluminação dessas fotos foram refinadas por meio de gastos reais com publicidade. Recuperar esses padrões diretamente é uma ordem de grandeza mais rápida do que fazer a engenharia inversa através da escrita rápida, e esse passo de recuperação é exatamente o que uma base de dados vetorial faz.</p>
<p>Aqui está o fluxo completo. Chamamos todos os modelos através da API OpenRouter, pelo que não há necessidade de GPU local nem de descarregar pesos de modelos.</p>
<pre><code translate="no">New product flat-lay
│
│── Embed → Llama Nemotron Embed VL 1B v2
│
│── Search → Milvus hybrid search
│   ├── Dense <span class="hljs-title function_">vectors</span> <span class="hljs-params">(visual similarity)</span>
│   ├── Sparse <span class="hljs-title function_">vectors</span> <span class="hljs-params">(keyword matching)</span>
│   └── Scalar <span class="hljs-title function_">filters</span> <span class="hljs-params">(category + sales volume)</span>
│
│── Analyze → Qwen <span class="hljs-number">3.5</span> extracts style from retrieved bestsellers
│   └── scene, lighting, pose, mood → style prompt
│
└── Generate → Nano Banana <span class="hljs-number">2</span>
    ├── Inputs: <span class="hljs-keyword">new</span> <span class="hljs-title class_">product</span> + bestseller reference + style prompt
    └── Output: promotional photo
<button class="copy-code-btn"></button></code></pre>
<p>Apoiamo-nos em três capacidades do Milvus para fazer funcionar a fase de recuperação:</p>
<ol>
<li><strong>Pesquisa híbrida densa + esparsa.</strong> Executamos embeddings de imagem e vectores TF-IDF de texto como consultas paralelas e, em seguida, fundimos os dois conjuntos de resultados com o reranking RRF (Reciprocal Rank Fusion).</li>
<li><strong>Filtragem de campos escalares.</strong> Filtramos por campos de metadados como category e sales_count antes da comparação de vectores, para que os resultados incluam apenas produtos relevantes e de elevado desempenho.</li>
<li><strong>Esquema de vários campos.</strong> Armazenamos vectores densos, vectores esparsos e metadados escalares numa única coleção Milvus, o que mantém toda a lógica de recuperação numa única consulta, em vez de estar dispersa por vários sistemas.</li>
</ol>
<h3 id="Data-Preparation" class="common-anchor-header">Preparação de dados</h3><p><strong>Catálogo histórico de produtos</strong></p>
<p>Começamos com dois activos: uma pasta images/ de fotografias de produtos existentes e um ficheiro products.csv que contém os seus metadados.</p>
<pre><code translate="no">images/
├── SKU001.jpg
├── SKU002.jpg
├── ...
└── SKU040.jpg

products.csv fields:
product_id, image_path, category, color, style, season, sales_count, description, price
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Dados de novos produtos</strong></p>
<p>Para os produtos para os quais queremos gerar imagens promocionais, preparamos uma estrutura paralela: uma pasta new_products/ e new_products.csv.</p>
<pre><code translate="no">new_products/
├── NEW001.jpg    <span class="hljs-comment"># Blue knit cardigan + grey tulle skirt set</span>
├── NEW002.jpg    <span class="hljs-comment"># Light green floral ruffle maxi dress</span>
├── NEW003.jpg    <span class="hljs-comment"># Camel turtleneck knit dress</span>
└── NEW004.jpg    <span class="hljs-comment"># Dark grey ethnic-style cowl neck top dress</span>

new_products.csv fields:
new_id, image_path, category, style, season, prompt_hint
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image11.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image16.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-1-Install-Dependencies" class="common-anchor-header">Etapa 1: instalar dependências</h3><pre><code translate="no">!pip install pymilvus openai requests pillow scikit-learn tqdm
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Import-Modules-and-Configurations" class="common-anchor-header">Etapa 2: Importar módulos e configurações</h3><pre><code translate="no"><span class="hljs-keyword">import</span> os, io, base64, csv, time
<span class="hljs-keyword">import</span> requests <span class="hljs-keyword">as</span> req
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">from</span> <span class="hljs-variable constant_">PIL</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">Image</span>
<span class="hljs-keyword">from</span> tqdm.<span class="hljs-property">notebook</span> <span class="hljs-keyword">import</span> tqdm
<span class="hljs-keyword">from</span> sklearn.<span class="hljs-property">feature_extraction</span>.<span class="hljs-property">text</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">TfidfVectorizer</span>
<span class="hljs-keyword">from</span> <span class="hljs-title class_">IPython</span>.<span class="hljs-property">display</span> <span class="hljs-keyword">import</span> display

<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAI</span>
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>, <span class="hljs-title class_">DataType</span>, <span class="hljs-title class_">AnnSearchRequest</span>, <span class="hljs-title class_">RRFRanker</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Configurar todos os modelos e caminhos:</strong></p>
<pre><code translate="no"><span class="hljs-comment"># -- Config --</span>
OPENROUTER_API_KEY = os.environ.get(
    <span class="hljs-string">&quot;OPENROUTER_API_KEY&quot;</span>,
    <span class="hljs-string">&quot;&lt;YOUR_OPENROUTER_API_KEY&gt;&quot;</span>,
)

<span class="hljs-comment"># Models (all via OpenRouter, no local download needed)</span>
EMBED_MODEL = <span class="hljs-string">&quot;nvidia/llama-nemotron-embed-vl-1b-v2&quot;</span>  <span class="hljs-comment"># free, image+text → 2048d</span>
EMBED_DIM = <span class="hljs-number">2048</span>
LLM_MODEL = <span class="hljs-string">&quot;qwen/qwen3.5-397b-a17b&quot;</span>                 <span class="hljs-comment"># style analysis</span>
IMAGE_GEN_MODEL = <span class="hljs-string">&quot;google/gemini-3.1-flash-image-preview&quot;</span>  <span class="hljs-comment"># Nano Banana 2</span>

<span class="hljs-comment"># Milvus</span>
MILVUS_URI = <span class="hljs-string">&quot;./milvus_fashion.db&quot;</span>
COLLECTION = <span class="hljs-string">&quot;fashion_products&quot;</span>
TOP_K = <span class="hljs-number">3</span>

<span class="hljs-comment"># Paths</span>
IMAGE_DIR = <span class="hljs-string">&quot;./images&quot;</span>
NEW_PRODUCT_DIR = <span class="hljs-string">&quot;./new_products&quot;</span>
PRODUCT_CSV = <span class="hljs-string">&quot;./products.csv&quot;</span>
NEW_PRODUCT_CSV = <span class="hljs-string">&quot;./new_products.csv&quot;</span>

<span class="hljs-comment"># OpenRouter client (shared for LLM + image gen)</span>
llm = OpenAI(api_key=OPENROUTER_API_KEY, base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Config loaded. All models via OpenRouter API.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Funções utilitárias</strong></p>
<p>Essas funções auxiliares lidam com a codificação de imagens, chamadas de API e análise de respostas:</p>
<ul>
<li>image_to_uri(): Converte uma imagem PIL em um URI de dados base64 para transporte de API.</li>
<li>get_image_embeddings(): Codifica imagens em lote em vetores de 2048 dimensões através da API OpenRouter Embedding.</li>
<li>get_text_embedding(): Codifica texto no mesmo espaço vetorial de 2048 dimensões.</li>
<li>sparse_to_dict(): Converte uma linha de matriz esparsa scipy para o formato {index: value} que Milvus espera para vectores esparsos.</li>
<li>extract_images(): Extrai as imagens geradas da resposta da API do Nano Banana 2.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># -- Utility functions --</span>

<span class="hljs-keyword">def</span> <span class="hljs-title function_">image_to_uri</span>(<span class="hljs-params">img, max_size=<span class="hljs-number">1024</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Convert PIL Image to base64 data URI.&quot;&quot;&quot;</span>
    img = img.copy()
    w, h = img.size
    <span class="hljs-keyword">if</span> <span class="hljs-built_in">max</span>(w, h) &gt; max_size:
        r = max_size / <span class="hljs-built_in">max</span>(w, h)
        img = img.resize((<span class="hljs-built_in">int</span>(w * r), <span class="hljs-built_in">int</span>(h * r)), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, <span class="hljs-built_in">format</span>=<span class="hljs-string">&quot;JPEG&quot;</span>, quality=<span class="hljs-number">85</span>)
    <span class="hljs-keyword">return</span> <span class="hljs-string">f&quot;data:image/jpeg;base64,<span class="hljs-subst">{base64.b64encode(buf.getvalue()).decode()}</span>&quot;</span>

<span class="hljs-keyword">def</span> <span class="hljs-title function_">get_image_embeddings</span>(<span class="hljs-params">images, batch_size=<span class="hljs-number">5</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Encode images via OpenRouter embedding API.&quot;&quot;&quot;</span>
    all_embs = []
    <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> tqdm(<span class="hljs-built_in">range</span>(<span class="hljs-number">0</span>, <span class="hljs-built_in">len</span>(images), batch_size), desc=<span class="hljs-string">&quot;Encoding images&quot;</span>):
        batch = images[i : i + batch_size]
        inputs = [
            {<span class="hljs-string">&quot;content&quot;</span>: [{<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: {<span class="hljs-string">&quot;url&quot;</span>: image_to_uri(img, max_size=<span class="hljs-number">512</span>)}}]}
            <span class="hljs-keyword">for</span> img <span class="hljs-keyword">in</span> batch
        ]
        resp = req.post(
            <span class="hljs-string">&quot;https://openrouter.ai/api/v1/embeddings&quot;</span>,
            headers={<span class="hljs-string">&quot;Authorization&quot;</span>: <span class="hljs-string">f&quot;Bearer <span class="hljs-subst">{OPENROUTER_API_KEY}</span>&quot;</span>},
            json={<span class="hljs-string">&quot;model&quot;</span>: EMBED_MODEL, <span class="hljs-string">&quot;input&quot;</span>: inputs},
            timeout=<span class="hljs-number">120</span>,
        )
        data = resp.json()
        <span class="hljs-keyword">if</span> <span class="hljs-string">&quot;data&quot;</span> <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> data:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;API error: <span class="hljs-subst">{data}</span>&quot;</span>)
            <span class="hljs-keyword">continue</span>
        <span class="hljs-keyword">for</span> item <span class="hljs-keyword">in</span> <span class="hljs-built_in">sorted</span>(data[<span class="hljs-string">&quot;data&quot;</span>], key=<span class="hljs-keyword">lambda</span> x: x[<span class="hljs-string">&quot;index&quot;</span>]):
            all_embs.append(item[<span class="hljs-string">&quot;embedding&quot;</span>])
        time.sleep(<span class="hljs-number">0.5</span>)  <span class="hljs-comment"># rate limit friendly</span>
    <span class="hljs-keyword">return</span> np.array(all_embs, dtype=np.float32)

<span class="hljs-keyword">def</span> <span class="hljs-title function_">get_text_embedding</span>(<span class="hljs-params">text</span>):
    <span class="hljs-string">&quot;&quot;&quot;Encode text via OpenRouter embedding API.&quot;&quot;&quot;</span>
    resp = req.post(
        <span class="hljs-string">&quot;https://openrouter.ai/api/v1/embeddings&quot;</span>,
        headers={<span class="hljs-string">&quot;Authorization&quot;</span>: <span class="hljs-string">f&quot;Bearer <span class="hljs-subst">{OPENROUTER_API_KEY}</span>&quot;</span>},
        json={<span class="hljs-string">&quot;model&quot;</span>: EMBED_MODEL, <span class="hljs-string">&quot;input&quot;</span>: text},
        timeout=<span class="hljs-number">60</span>,
    )
    <span class="hljs-keyword">return</span> np.array(resp.json()[<span class="hljs-string">&quot;data&quot;</span>][<span class="hljs-number">0</span>][<span class="hljs-string">&quot;embedding&quot;</span>], dtype=np.float32)

<span class="hljs-keyword">def</span> <span class="hljs-title function_">sparse_to_dict</span>(<span class="hljs-params">sparse_row</span>):
    <span class="hljs-string">&quot;&quot;&quot;Convert scipy sparse row to Milvus sparse vector format {index: value}.&quot;&quot;&quot;</span>
    coo = sparse_row.tocoo()
    <span class="hljs-keyword">return</span> {<span class="hljs-built_in">int</span>(i): <span class="hljs-built_in">float</span>(v) <span class="hljs-keyword">for</span> i, v <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(coo.col, coo.data)}

<span class="hljs-keyword">def</span> <span class="hljs-title function_">extract_images</span>(<span class="hljs-params">response</span>):
    <span class="hljs-string">&quot;&quot;&quot;Extract generated images from OpenRouter response.&quot;&quot;&quot;</span>
    images = []
    raw = response.model_dump()
    msg = raw[<span class="hljs-string">&quot;choices&quot;</span>][<span class="hljs-number">0</span>][<span class="hljs-string">&quot;message&quot;</span>]
    <span class="hljs-comment"># Method 1: images field (OpenRouter extension)</span>
    <span class="hljs-keyword">if</span> <span class="hljs-string">&quot;images&quot;</span> <span class="hljs-keyword">in</span> msg <span class="hljs-keyword">and</span> msg[<span class="hljs-string">&quot;images&quot;</span>]:
        <span class="hljs-keyword">for</span> img_data <span class="hljs-keyword">in</span> msg[<span class="hljs-string">&quot;images&quot;</span>]:
            url = img_data[<span class="hljs-string">&quot;image_url&quot;</span>][<span class="hljs-string">&quot;url&quot;</span>]
            b64 = url.split(<span class="hljs-string">&quot;,&quot;</span>, <span class="hljs-number">1</span>)[<span class="hljs-number">1</span>]
            images.append(Image.<span class="hljs-built_in">open</span>(io.BytesIO(base64.b64decode(b64))))
    <span class="hljs-comment"># Method 2: inline base64 in content parts</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> images <span class="hljs-keyword">and</span> <span class="hljs-built_in">isinstance</span>(msg.get(<span class="hljs-string">&quot;content&quot;</span>), <span class="hljs-built_in">list</span>):
        <span class="hljs-keyword">for</span> part <span class="hljs-keyword">in</span> msg[<span class="hljs-string">&quot;content&quot;</span>]:
            <span class="hljs-keyword">if</span> <span class="hljs-built_in">isinstance</span>(part, <span class="hljs-built_in">dict</span>) <span class="hljs-keyword">and</span> part.get(<span class="hljs-string">&quot;type&quot;</span>) == <span class="hljs-string">&quot;image_url&quot;</span>:
                url = part[<span class="hljs-string">&quot;image_url&quot;</span>][<span class="hljs-string">&quot;url&quot;</span>]
                <span class="hljs-keyword">if</span> url.startswith(<span class="hljs-string">&quot;data:image&quot;</span>):
                    b64 = url.split(<span class="hljs-string">&quot;,&quot;</span>, <span class="hljs-number">1</span>)[<span class="hljs-number">1</span>]
                    images.append(Image.<span class="hljs-built_in">open</span>(io.BytesIO(base64.b64decode(b64))))
    <span class="hljs-keyword">return</span> images

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Utility functions ready.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Load-the-Product-Catalog" class="common-anchor-header">Etapa 3: Carregar o catálogo de produtos</h3><p>Ler products.csv e carregar as imagens dos produtos correspondentes:</p>
<pre><code translate="no"><span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(PRODUCT_CSV, newline=<span class="hljs-string">&quot;&quot;</span>, encoding=<span class="hljs-string">&quot;utf-8&quot;</span>) <span class="hljs-keyword">as</span> f:
    products = <span class="hljs-built_in">list</span>(csv.DictReader(f))

product_images = []
<span class="hljs-keyword">for</span> p <span class="hljs-keyword">in</span> products:
    img = Image.<span class="hljs-built_in">open</span>(os.path.join(IMAGE_DIR, p[<span class="hljs-string">&quot;image_path&quot;</span>])).convert(<span class="hljs-string">&quot;RGB&quot;</span>)
    product_images.append(img)

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Loaded <span class="hljs-subst">{<span class="hljs-built_in">len</span>(products)}</span> products.&quot;</span>)
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">3</span>):
    p = products[i]
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{p[<span class="hljs-string">&#x27;product_id&#x27;</span>]}</span> | <span class="hljs-subst">{p[<span class="hljs-string">&#x27;category&#x27;</span>]}</span> | <span class="hljs-subst">{p[<span class="hljs-string">&#x27;color&#x27;</span>]}</span> | <span class="hljs-subst">{p[<span class="hljs-string">&#x27;style&#x27;</span>]}</span> | sales: <span class="hljs-subst">{p[<span class="hljs-string">&#x27;sales_count&#x27;</span>]}</span>&quot;</span>)
    display(product_images[i].resize((<span class="hljs-number">180</span>, <span class="hljs-built_in">int</span>(<span class="hljs-number">180</span> * product_images[i].height / product_images[i].width))))
<button class="copy-code-btn"></button></code></pre>
<p>Exemplo de saída:<br>

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image13.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Generate-Embeddings" class="common-anchor-header">Etapa 4: Gerar Embeddings</h3><p>A pesquisa híbrida requer dois tipos de vectores para cada produto.</p>
<p><strong>4.1 Vectores densos: incorporação de imagens</strong></p>
<p>O modelo nvidia/llama-nemotron-embed-vl-1b-v2 codifica cada imagem de produto num vetor denso de 2048 dimensões. Como este modelo suporta entradas de imagem e de texto num espaço vetorial partilhado, as mesmas incorporações funcionam para a recuperação de imagem para imagem e de texto para imagem.</p>
<pre><code translate="no"><span class="hljs-comment"># Dense embeddings: image → 2048-dim vector via OpenRouter API</span>
dense_vectors = get_image_embeddings(product_images, batch_size=<span class="hljs-number">5</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Dense vectors: <span class="hljs-subst">{dense_vectors.shape}</span>  (products x <span class="hljs-subst">{EMBED_DIM}</span>d)&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Saída:</p>
<pre><code translate="no">Dense vectors: (40, 2048)  (products x 2048d)
<button class="copy-code-btn"></button></code></pre>
<p><strong>4.2 Vectores esparsos: Incorporações de texto TF-IDF</strong></p>
<p>As descrições de texto dos produtos são codificadas em vectores esparsos utilizando o vectorizador TF-IDF do scikit-learn. Estes capturam a correspondência ao nível das palavras-chave que os vectores densos podem perder.</p>
<pre><code translate="no"><span class="hljs-comment"># Sparse embeddings: TF-IDF on product descriptions</span>
descriptions = [p[<span class="hljs-string">&quot;description&quot;</span>] <span class="hljs-keyword">for</span> p <span class="hljs-keyword">in</span> products]
tfidf = TfidfVectorizer(stop_words=<span class="hljs-string">&quot;english&quot;</span>, max_features=<span class="hljs-number">500</span>)
tfidf_matrix = tfidf.fit_transform(descriptions)

sparse_vectors = [sparse_to_dict(tfidf_matrix[i]) <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(products))]
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Sparse vectors: <span class="hljs-subst">{<span class="hljs-built_in">len</span>(sparse_vectors)}</span> products, vocab size: <span class="hljs-subst">{<span class="hljs-built_in">len</span>(tfidf.vocabulary_)}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Sample sparse vector (SKU001): <span class="hljs-subst">{<span class="hljs-built_in">len</span>(sparse_vectors[<span class="hljs-number">0</span>])}</span> non-zero terms&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Saída:</p>
<pre><code translate="no">Sparse vectors: <span class="hljs-number">40</span> products, vocab size: <span class="hljs-number">179</span>
Sample sparse <span class="hljs-title function_">vector</span> <span class="hljs-params">(SKU001)</span>: <span class="hljs-number">11</span> non-zero terms
<button class="copy-code-btn"></button></code></pre>
<p><strong>Porquê os dois tipos de vectores?</strong> Os vetores densos e esparsos se complementam. Os vetores densos capturam a similaridade visual: paleta de cores, silhueta da roupa, estilo geral. Os vectores esparsos captam a semântica das palavras-chave: termos como "floral", "midi" ou "chiffon" que assinalam os atributos do produto. A combinação de ambos produz uma qualidade de recuperação significativamente melhor do que qualquer uma das abordagens isoladamente.</p>
<h3 id="Step-5-Create-a-Milvus-Collection-with-Hybrid-Schema" class="common-anchor-header">Passo 5: Criar uma coleção Milvus com esquema híbrido</h3><p>Este passo cria uma única coleção Milvus que armazena vectores densos, vectores esparsos e campos de metadados escalares em conjunto. Esse esquema unificado é o que permite a pesquisa híbrida em uma única consulta.</p>
<table>
<thead>
<tr><th><strong>Campo</strong></th><th><strong>Tipo de campo</strong></th><th><strong>Objetivo</strong></th></tr>
</thead>
<tbody>
<tr><td>vector_denso</td><td>FLOAT_VECTOR (2048d)</td><td>Incorporação de imagens, similaridade COSINE</td></tr>
<tr><td>vector_esparso</td><td>VECTOR_ESPARSO_FLOAT</td><td>Vetor esparso TF-IDF, produto interno</td></tr>
<tr><td>categoria</td><td>VARCHAR</td><td>Etiqueta de categoria para filtragem</td></tr>
<tr><td>contagem_de_vendas</td><td>INT64</td><td>Volume histórico de vendas para filtragem</td></tr>
<tr><td>cor, estilo, estação</td><td>VARCHAR</td><td>Etiquetas de metadados adicionais</td></tr>
<tr><td>preço</td><td>FLOAT</td><td>Preço do produto</td></tr>
</tbody>
</table>
<pre><code translate="no">milvus_client = MilvusClient(uri=MILVUS_URI)

<span class="hljs-keyword">if</span> milvus_client.has_collection(COLLECTION):
    milvus_client.drop_collection(COLLECTION)

schema = milvus_client.create_schema(auto_id=<span class="hljs-literal">True</span>, enable_dynamic_field=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;product_id&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">20</span>)
schema.add_field(<span class="hljs-string">&quot;category&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
schema.add_field(<span class="hljs-string">&quot;color&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
schema.add_field(<span class="hljs-string">&quot;style&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
schema.add_field(<span class="hljs-string">&quot;season&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
schema.add_field(<span class="hljs-string">&quot;sales_count&quot;</span>, DataType.INT64)
schema.add_field(<span class="hljs-string">&quot;description&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">500</span>)
schema.add_field(<span class="hljs-string">&quot;price&quot;</span>, DataType.FLOAT)
schema.add_field(<span class="hljs-string">&quot;dense_vector&quot;</span>, DataType.FLOAT_VECTOR, dim=EMBED_DIM)
schema.add_field(<span class="hljs-string">&quot;sparse_vector&quot;</span>, DataType.SPARSE_FLOAT_VECTOR)

index_params = milvus_client.prepare_index_params()
index_params.add_index(field_name=<span class="hljs-string">&quot;dense_vector&quot;</span>, index_type=<span class="hljs-string">&quot;FLAT&quot;</span>, metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>)
index_params.add_index(field_name=<span class="hljs-string">&quot;sparse_vector&quot;</span>, index_type=<span class="hljs-string">&quot;SPARSE_INVERTED_INDEX&quot;</span>, metric_type=<span class="hljs-string">&quot;IP&quot;</span>)

milvus_client.create_collection(COLLECTION, schema=schema, index_params=index_params)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Milvus collection &#x27;<span class="hljs-subst">{COLLECTION}</span>&#x27; created with hybrid schema.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Insira os dados do produto:</p>
<pre><code translate="no"><span class="hljs-comment"># Insert all products</span>
rows = []
<span class="hljs-keyword">for</span> i, p <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(products):
    rows.append({
        <span class="hljs-string">&quot;product_id&quot;</span>: p[<span class="hljs-string">&quot;product_id&quot;</span>],
        <span class="hljs-string">&quot;category&quot;</span>: p[<span class="hljs-string">&quot;category&quot;</span>],
        <span class="hljs-string">&quot;color&quot;</span>: p[<span class="hljs-string">&quot;color&quot;</span>],
        <span class="hljs-string">&quot;style&quot;</span>: p[<span class="hljs-string">&quot;style&quot;</span>],
        <span class="hljs-string">&quot;season&quot;</span>: p[<span class="hljs-string">&quot;season&quot;</span>],
        <span class="hljs-string">&quot;sales_count&quot;</span>: <span class="hljs-built_in">int</span>(p[<span class="hljs-string">&quot;sales_count&quot;</span>]),
        <span class="hljs-string">&quot;description&quot;</span>: p[<span class="hljs-string">&quot;description&quot;</span>],
        <span class="hljs-string">&quot;price&quot;</span>: <span class="hljs-built_in">float</span>(p[<span class="hljs-string">&quot;price&quot;</span>]),
        <span class="hljs-string">&quot;dense_vector&quot;</span>: dense_vectors[i].tolist(),
        <span class="hljs-string">&quot;sparse_vector&quot;</span>: sparse_vectors[i],
    })

milvus_client.insert(COLLECTION, rows)
stats = milvus_client.get_collection_stats(COLLECTION)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted <span class="hljs-subst">{stats[<span class="hljs-string">&#x27;row_count&#x27;</span>]}</span> products into Milvus.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Saída:</p>
<pre><code translate="no">Inserted <span class="hljs-number">40</span> products <span class="hljs-keyword">into</span> Milvus.
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-6-Hybrid-Search-to-Find-Similar-Bestsellers" class="common-anchor-header">Etapa 6: Pesquisa híbrida para encontrar best-sellers semelhantes</h3><p>Esta é a etapa principal de recuperação. Para cada novo produto, o pipeline executa três operações simultaneamente:</p>
<ol>
<li><strong>Pesquisa densa</strong>: encontra produtos com imagens visualmente semelhantes.</li>
<li><strong>Pesquisa esparsa</strong>: encontra produtos com palavras-chave de texto correspondentes via TF-IDF.</li>
<li><strong>Filtragem escalar</strong>: restringe os resultados à mesma categoria e a produtos com sales_count &gt; 1500.</li>
<li><strong>RRF reranking</strong>: mescla as listas de resultados densas e esparsas usando Reciprocal Rank Fusion.</li>
</ol>
<p>Carrega o novo produto:</p>
<pre><code translate="no"><span class="hljs-comment"># Load new products</span>
<span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(NEW_PRODUCT_CSV, newline=<span class="hljs-string">&quot;&quot;</span>, encoding=<span class="hljs-string">&quot;utf-8&quot;</span>) <span class="hljs-keyword">as</span> f:
    new_products = <span class="hljs-built_in">list</span>(csv.DictReader(f))

<span class="hljs-comment"># Pick the first new product for demo</span>
new_prod = new_products[<span class="hljs-number">0</span>]
new_img = Image.<span class="hljs-built_in">open</span>(os.path.join(NEW_PRODUCT_DIR, new_prod[<span class="hljs-string">&quot;image_path&quot;</span>])).convert(<span class="hljs-string">&quot;RGB&quot;</span>)

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;New product: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;new_id&#x27;</span>]}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Category: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;category&#x27;</span>]}</span> | Style: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;style&#x27;</span>]}</span> | Season: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;season&#x27;</span>]}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Prompt hint: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;prompt_hint&#x27;</span>]}</span>&quot;</span>)
display(new_img.resize((<span class="hljs-number">300</span>, <span class="hljs-built_in">int</span>(<span class="hljs-number">300</span> * new_img.height / new_img.width))))
<button class="copy-code-btn"></button></code></pre>
<p>Saída:  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Codifica o novo produto:</p>
<pre><code translate="no"><span class="hljs-comment"># Encode new product</span>
<span class="hljs-comment"># Dense: image embedding via API</span>
query_dense = get_image_embeddings([new_img], batch_size=<span class="hljs-number">1</span>)[<span class="hljs-number">0</span>]

<span class="hljs-comment"># Sparse: TF-IDF from text query</span>
query_text = <span class="hljs-string">f&quot;<span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;category&#x27;</span>]}</span> <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;style&#x27;</span>]}</span> <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;season&#x27;</span>]}</span> <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;prompt_hint&#x27;</span>]}</span>&quot;</span>
query_sparse = sparse_to_dict(tfidf.transform([query_text])[<span class="hljs-number">0</span>])

<span class="hljs-comment"># Scalar filter</span>
filter_expr = <span class="hljs-string">f&#x27;category == &quot;<span class="hljs-subst">{new_prod[<span class="hljs-string">&quot;category&quot;</span>]}</span>&quot; and sales_count &gt; 1500&#x27;</span>

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Dense query: <span class="hljs-subst">{query_dense.shape}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Sparse query: <span class="hljs-subst">{<span class="hljs-built_in">len</span>(query_sparse)}</span> non-zero terms&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Filter: <span class="hljs-subst">{filter_expr}</span>&quot;</span>)

<button class="copy-code-btn"></button></code></pre>
<p>Saída:</p>
<pre><code translate="no"><span class="hljs-title class_">Dense</span> <span class="hljs-attr">query</span>: (<span class="hljs-number">2048</span>,)
<span class="hljs-title class_">Sparse</span> <span class="hljs-attr">query</span>: <span class="hljs-number">6</span> non-zero terms
<span class="hljs-title class_">Filter</span>: category == <span class="hljs-string">&quot;midi_dress&quot;</span> and sales_count &gt; <span class="hljs-number">1500</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Executar pesquisa híbrida</strong></p>
<p>As principais chamadas de API aqui:</p>
<ul>
<li>AnnSearchRequest cria solicitações de pesquisa separadas para os campos vetoriais densos e esparsos.</li>
<li>expr=filter_expr aplica filtragem escalar em cada pedido de pesquisa.</li>
<li>RRFRanker(k=60) funde as duas listas de resultados classificados utilizando o algoritmo Reciprocal Rank Fusion.</li>
<li>hybrid_search executa ambas as solicitações e retorna resultados mesclados e ranqueados novamente.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Hybrid search: dense + sparse + scalar filter + RRF reranking</span>
dense_req = AnnSearchRequest(
    data=[query_dense.tolist()],
    anns_field=<span class="hljs-string">&quot;dense_vector&quot;</span>,
    param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
    limit=<span class="hljs-number">20</span>,
    expr=filter_expr,
)
sparse_req = AnnSearchRequest(
    data=[query_sparse],
    anns_field=<span class="hljs-string">&quot;sparse_vector&quot;</span>,
    param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>},
    limit=<span class="hljs-number">20</span>,
    expr=filter_expr,
)

results = milvus_client.hybrid_search(
    collection_name=COLLECTION,
    reqs=[dense_req, sparse_req],
    ranker=RRFRanker(k=<span class="hljs-number">60</span>),
    limit=TOP_K,
    output_fields=[<span class="hljs-string">&quot;product_id&quot;</span>, <span class="hljs-string">&quot;category&quot;</span>, <span class="hljs-string">&quot;color&quot;</span>, <span class="hljs-string">&quot;style&quot;</span>, <span class="hljs-string">&quot;season&quot;</span>,
                   <span class="hljs-string">&quot;sales_count&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>, <span class="hljs-string">&quot;price&quot;</span>],
)

<span class="hljs-comment"># Display retrieved bestsellers</span>
retrieved_products = []
retrieved_images = []
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Top-<span class="hljs-subst">{TOP_K}</span> similar bestsellers:\n&quot;</span>)
<span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
    entity = hit[<span class="hljs-string">&quot;entity&quot;</span>]
    pid = entity[<span class="hljs-string">&quot;product_id&quot;</span>]
    img = Image.<span class="hljs-built_in">open</span>(os.path.join(IMAGE_DIR, <span class="hljs-string">f&quot;<span class="hljs-subst">{pid}</span>.jpg&quot;</span>)).convert(<span class="hljs-string">&quot;RGB&quot;</span>)
    retrieved_products.append(entity)
    retrieved_images.append(img)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{pid}</span> | <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;category&#x27;</span>]}</span> | <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;color&#x27;</span>]}</span> | <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;style&#x27;</span>]}</span> &quot;</span>
          <span class="hljs-string">f&quot;| sales: <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;sales_count&#x27;</span>]}</span> | $<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;price&#x27;</span>]:<span class="hljs-number">.1</span>f}</span> | score: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;description&#x27;</span>]}</span>&quot;</span>)
    display(img.resize((<span class="hljs-number">250</span>, <span class="hljs-built_in">int</span>(<span class="hljs-number">250</span> * img.height / img.width))))
    <span class="hljs-built_in">print</span>()
<button class="copy-code-btn"></button></code></pre>
<p>Resultado: os 3 bestsellers mais semelhantes, classificados por pontuação fundida.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-7-Analyze-Bestseller-Style-with-Qwen-35" class="common-anchor-header">Passo 7: Analisar o estilo dos bestsellers com o Qwen 3.5</h3><p>Introduzimos as imagens recuperadas dos bestsellers no Qwen 3.5 e pedimos-lhe para extrair o seu ADN visual partilhado: composição da cena, configuração da iluminação, pose da modelo e ambiente geral. A partir dessa análise, obtemos um prompt de geração única pronto para ser entregue ao Nano Banana 2.</p>
<pre><code translate="no">content = [
    {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: {<span class="hljs-string">&quot;url&quot;</span>: image_to_uri(img)}}
    <span class="hljs-keyword">for</span> img in retrieved_images
]
content.<span class="hljs-built_in">append</span>({
    <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>,
    <span class="hljs-string">&quot;text&quot;</span>: (
        <span class="hljs-string">&quot;These are our top-selling fashion product photos.\n\n&quot;</span>
        <span class="hljs-string">&quot;Analyze their common visual style in these dimensions:\n&quot;</span>
        <span class="hljs-string">&quot;1. Scene / background setting\n&quot;</span>
        <span class="hljs-string">&quot;2. Lighting and color tone\n&quot;</span>
        <span class="hljs-string">&quot;3. Model pose and framing\n&quot;</span>
        <span class="hljs-string">&quot;4. Overall mood and aesthetic\n\n&quot;</span>
        <span class="hljs-string">&quot;Then, based on this analysis, write ONE concise image generation prompt &quot;</span>
        <span class="hljs-string">&quot;(under 100 words) that captures this style. The prompt should describe &quot;</span>
        <span class="hljs-string">&quot;a scene for a model wearing a new clothing item. &quot;</span>
        <span class="hljs-string">&quot;Output ONLY the prompt, nothing else.&quot;</span>
    ),
})

response = llm.chat.completions.create(
    model=LLM_MODEL,
    messages=[{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: content}],
    max_tokens=<span class="hljs-number">512</span>,
    temperature=<span class="hljs-number">0.7</span>,
)
style_prompt = response.choices[<span class="hljs-number">0</span>].message.content.strip()
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Style prompt from Qwen3.5:\n&quot;</span>)
<span class="hljs-built_in">print</span>(style_prompt)
<button class="copy-code-btn"></button></code></pre>
<p>Exemplo de saída:</p>
<pre><code translate="no">Style prompt from Qwen3.5:

Professional full-body fashion photograph of a model wearing a stylish new dress.
Bright, soft high-key lighting that illuminates the subject evenly. Clean,
uncluttered background, either stark white or a softly blurred bright outdoor
setting. The model stands in a relaxed, natural pose to showcase the garment&#x27;s
silhouette and drape. Sharp focus, vibrant colors, fresh and elegant commercial aesthetic.
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-8-Generate-the-Promotional-Image-with-Nano-Banana-2" class="common-anchor-header">Passo 8: Gerar a imagem promocional com a Nano Banana 2</h3><p>Passamos três entradas para a Nano Banana 2: a foto plana do novo produto, a imagem do best-seller mais bem classificado e o prompt de estilo que extraímos na etapa anterior. O modelo compõe estes dados numa fotografia promocional que associa a nova peça de vestuário a um estilo visual comprovado.</p>
<pre><code translate="no">gen_prompt = (
    <span class="hljs-string">f&quot;I have a new clothing product (Image 1: flat-lay photo) and a reference &quot;</span>
    <span class="hljs-string">f&quot;promotional photo from our bestselling catalog (Image 2).\n\n&quot;</span>
    <span class="hljs-string">f&quot;Generate a professional e-commerce promotional photograph of a female model &quot;</span>
    <span class="hljs-string">f&quot;wearing the clothing from Image 1.\n\n&quot;</span>
    <span class="hljs-string">f&quot;Style guidance: <span class="hljs-subst">{style_prompt}</span>\n\n&quot;</span>
    <span class="hljs-string">f&quot;Scene hint: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;prompt_hint&#x27;</span>]}</span>\n\n&quot;</span>
    <span class="hljs-string">f&quot;Requirements:\n&quot;</span>
    <span class="hljs-string">f&quot;- Full body shot, photorealistic, high quality\n&quot;</span>
    <span class="hljs-string">f&quot;- The clothing should match Image 1 exactly\n&quot;</span>
    <span class="hljs-string">f&quot;- The photo style and mood should match Image 2&quot;</span>
)

gen_content = [
    {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: {<span class="hljs-string">&quot;url&quot;</span>: image_to_uri(new_img)}},
    {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: {<span class="hljs-string">&quot;url&quot;</span>: image_to_uri(retrieved_images[<span class="hljs-number">0</span>])}},
    {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: gen_prompt},
]

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Generating promotional photo with Nano Banana 2...&quot;</span>)
gen_response = llm.chat.completions.create(
    model=IMAGE_GEN_MODEL,
    messages=[{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: gen_content}],
    extra_body={
        <span class="hljs-string">&quot;modalities&quot;</span>: [<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;image&quot;</span>],
        <span class="hljs-string">&quot;image_config&quot;</span>: {<span class="hljs-string">&quot;aspect_ratio&quot;</span>: <span class="hljs-string">&quot;3:4&quot;</span>, <span class="hljs-string">&quot;image_size&quot;</span>: <span class="hljs-string">&quot;2K&quot;</span>},
    },
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Done!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Parâmetros-chave para a chamada à API Nano Banana 2:</p>
<ul>
<li>modalidades: [&quot;text&quot;, &quot;image&quot;]: declara que a resposta deve incluir uma imagem.</li>
<li>image_config.aspect_ratio: controla o rácio de aspeto de saída (3:4 funciona bem para fotografias de retrato/moda).</li>
<li>image_config.image_size: define a resolução. O Nano Banana 2 suporta de 512px a 4K.</li>
</ul>
<p>Extraia a imagem gerada:</p>
<pre><code translate="no">generated_images = extract_images(gen_response)

text_content = gen_response.choices[<span class="hljs-number">0</span>].message.content
<span class="hljs-keyword">if</span> text_content:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Model response: <span class="hljs-subst">{text_content[:<span class="hljs-number">300</span>]}</span>\n&quot;</span>)

<span class="hljs-keyword">if</span> generated_images:
    <span class="hljs-keyword">for</span> i, img <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(generated_images):
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;--- Generated promo photo <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span> ---&quot;</span>)
        display(img)
        img.save(<span class="hljs-string">f&quot;promo_<span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;new_id&#x27;</span>]}</span>_<span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>.png&quot;</span>)
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Saved: promo_<span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;new_id&#x27;</span>]}</span>_<span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>.png&quot;</span>)
<span class="hljs-keyword">else</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;No image generated. Raw response:&quot;</span>)
    <span class="hljs-built_in">print</span>(gen_response.model_dump())
<button class="copy-code-btn"></button></code></pre>
<p>Saída:  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-9-Side-by-Side-Comparison" class="common-anchor-header">Etapa 9: comparação lado a lado</h3><p>O resultado acerta em cheio nos traços gerais: a iluminação é suave e uniforme, a pose da modelo parece natural e o ambiente corresponde à referência do best-seller.</p>
<p>O que fica aquém do esperado é a mistura de peças de vestuário. O casaco de malha parece colado na modelo em vez de usado, e a etiqueta branca do decote transparece. A geração de passagem única tem dificuldades com este tipo de integração fina da roupa no corpo, pelo que abordamos soluções alternativas no resumo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image10.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-10-Batch-Generation-for-All-New-Products" class="common-anchor-header">Passo 10: Geração de lotes para todos os novos produtos</h3><p>Nós agrupamos todo o pipeline em uma única função e a executamos nos produtos novos restantes. O código do lote é omitido aqui por brevidade; entre em contato se precisar da implementação completa.</p>
<p>Duas coisas se destacam nos resultados do lote. Os avisos de estilo que recebemos do <strong>Qwen 3.5</strong> ajustam-se significativamente por produto: um vestido de verão e uma malha de inverno recebem descrições de cena genuinamente diferentes, adaptadas à estação, caso de utilização e acessórios. As imagens que recebemos da <strong>Nano Banana 2</strong>, por sua vez, são comparáveis a fotografias de estúdio reais em termos de iluminação, textura e composição.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>Neste artigo, cobrimos o que o Nano Banana 2 traz para a geração de imagens de comércio eletrónico, comparámo-lo com o Nano Banana original e o Pro em tarefas de produção reais, e explicámos como construir um pipeline de bestseller para imagem com Milvus, Qwen 3.5 e Nano Banana 2.</p>
<p>Este pipeline tem quatro vantagens práticas:</p>
<ul>
<li><strong>Custos controlados, orçamentos previsíveis.</strong> O modelo de incorporação (Llama Nemotron Embed VL 1B v2) é gratuito no OpenRouter. O Nano Banana 2 funciona a cerca de metade do custo por imagem do Pro, e a saída nativa em vários formatos elimina os ciclos de retrabalho que costumavam duplicar ou triplicar a fatura efectiva. Para as equipas de comércio eletrónico que gerem milhares de unidades de manutenção por estação, essa previsibilidade significa que a produção de imagens acompanha o catálogo em vez de ultrapassar o orçamento.</li>
<li><strong>Automação de ponta a ponta, tempo mais rápido para a listagem.</strong> O fluxo desde a fotografia de um produto plano até à imagem promocional acabada é executado sem intervenção manual. Um novo produto pode passar da foto do armazém para a imagem de anúncio pronta para o mercado em minutos, em vez de dias, o que é mais importante durante as épocas de pico, quando a rotatividade do catálogo é maior.</li>
<li><strong>Não é necessária uma GPU local, o que reduz a barreira à entrada.</strong> Todos os modelos são executados através da API OpenRouter. Uma equipa sem infraestrutura de ML e sem pessoal de engenharia dedicado pode executar este pipeline a partir de um computador portátil. Não há nada para provisionar, nada para manter e nenhum investimento inicial em hardware.</li>
<li><strong>Maior precisão de recuperação, maior consistência da marca.</strong> O Milvus combina filtragem densa, esparsa e escalar em uma única consulta, superando consistentemente as abordagens de vetor único para correspondência de produtos. Na prática, isto significa que as imagens geradas herdam de forma mais fiável a linguagem visual estabelecida da sua marca: a iluminação, a composição e o estilo que os seus bestsellers existentes já provaram converter. O resultado parece pertencer à sua loja, e não a uma arte de arquivo genérica de IA.</li>
</ul>
<p>Também há limitações que merecem ser mencionadas:</p>
<ul>
<li><strong>Mistura de vestuário com corpo.</strong> A geração de uma única passagem pode fazer com que o vestuário pareça composto em vez de usado. Por vezes, os pormenores finos, como pequenos acessórios, ficam desfocados. Solução alternativa: gerar em etapas (primeiro o fundo, depois a pose do modelo e, em seguida, a composição). Esta abordagem multi-passos dá a cada passo um âmbito mais restrito e melhora significativamente a qualidade da mistura.</li>
<li><strong>Fidelidade de detalhes em casos extremos.</strong> Acessórios, padrões e layouts com muito texto podem perder a nitidez. Solução alternativa: adicionar restrições explícitas ao pedido de geração ("o vestuário ajusta-se naturalmente ao corpo, sem etiquetas expostas, sem elementos extra, os detalhes do produto são nítidos"). Se a qualidade continuar a ser insuficiente num produto específico, mude para o Nano Banana Pro para a versão final</li>
</ul>
<p><a href="https://milvus.io/">Milvus</a> é a base de dados vetorial de código aberto que alimenta a etapa de pesquisa híbrida e, se quiser dar uma vista de olhos ou tentar trocar as suas próprias fotografias de produtos, o<a href="https://milvus.io/docs">início rápido em</a> <a href="https://milvus.io/docs"></a><a href="https://milvus.io/docs"></a> demora cerca de dez minutos. Temos uma comunidade bastante ativa em <a href="https://discord.gg/milvus"></a><a href="https://discord.gg/milvus">Discord</a> e Slack, e gostaríamos de ver o que as pessoas constroem com isto. E se você acabar executando o Nano Banana 2 contra um produto vertical diferente ou um catálogo maior, por favor, compartilhe os resultados! Gostaríamos muito de saber mais sobre eles.</p>
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
<li><a href="https://milvus.io/blog/nano-banana-milvus-turning-hype-into-enterprise-ready-multimodal-rag.md">Nano Banana + Milvus: Transformando o Hype em RAG Multimodal Pronto para a Empresa</a></li>
<li><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">O que é o OpenClaw? Guia completo para o agente de IA de código aberto</a></li>
<li><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Tutorial do OpenClaw: Conecte-se ao Slack para o assistente local de IA</a></li>
<li><a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">Extraímos o sistema de memória do OpenClaw e abrimos o seu código aberto (memsearch)</a></li>
<li><a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">Memória Persistente para Código Claude: memsearch ccplugin</a></li>
</ul>
