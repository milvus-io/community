---
id: choose-embedding-model-rag-2026.md
title: >-
  Como escolher o melhor modelo de incorporação para o RAG em 2026: 10 modelos
  comparados
author: Cheney Zhang
date: 2026-3-26
cover: assets.zilliz.com/embedding_model_cover_ab72ccd651.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, Gemini Embedding 2, Embedding Model, RAG'
meta_keywords: >-
  best embedding model for RAG, embedding model comparison, multimodal embedding
  benchmark, MRL dimension compression, Gemini Embedding 2
meta_title: |
  Best Embedding Model for RAG 2026: 10 Models Compared
desc: >-
  Avaliámos 10 modelos de incorporação em tarefas de compressão multimodal,
  multilingue, de documentos longos e de dimensão. Veja qual deles se adequa ao
  seu pipeline RAG.
origin: 'https://milvus.io/blog/choose-embedding-model-rag-2026.md'
---
<p><strong>TL;DR:</strong> Testámos 10 <a href="https://zilliz.com/ai-models">modelos de incorporação</a> em quatro cenários de produção que os benchmarks públicos não conseguem: recuperação intermodal, recuperação interlinguística, recuperação de informações importantes e compressão de dimensões. Nenhum modelo vence tudo. O Gemini Embedding 2 é o melhor modelo para todos os objectivos. O Qwen3-VL-2B de código aberto supera as APIs de código fechado em tarefas multimodais. Se precisar de comprimir dimensões para poupar armazenamento, opte pelo Voyage Multimodal 3.5 ou pelo Jina Embeddings v4.</p>
<h2 id="Why-MTEB-Isnt-Enough-for-Choosing-an-Embedding-Model" class="common-anchor-header">Porque é que o MTEB não é suficiente para escolher um modelo de incorporação<button data-href="#Why-MTEB-Isnt-Enough-for-Choosing-an-Embedding-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>A maioria dos protótipos <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> começa com o text-embedding-3-small da OpenAI. É barato, fácil de integrar e, para a recuperação de texto em inglês, funciona bastante bem. Mas o RAG de produção ultrapassa-o rapidamente. O seu pipeline recolhe imagens, PDFs, documentos multilingues - e um <a href="https://zilliz.com/ai-models">modelo de incorporação</a> apenas de texto deixa de ser suficiente.</p>
<p>A <a href="https://huggingface.co/spaces/mteb/leaderboard">tabela de classificação do MTEB</a> diz-lhe que há melhores opções. O problema? O MTEB só testa a recuperação de texto numa única língua. Não abrange a recuperação intermodal (consultas de texto contra colecções de imagens), a pesquisa multilingue (uma consulta em chinês que encontra um documento em inglês), a precisão de documentos longos ou a qualidade que se perde quando se truncam <a href="https://zilliz.com/glossary/dimension">as dimensões de incorporação</a> para poupar espaço na <a href="https://zilliz.com/learn/what-is-a-vector-database">base de dados vetorial</a>.</p>
<p>Então, que modelo de incorporação deve utilizar? Depende dos seus tipos de dados, das suas línguas, do comprimento dos seus documentos e da necessidade de compressão de dimensões. Criamos um benchmark chamado <strong>CCKM</strong> e testamos 10 modelos lançados entre 2025 e 2026 exatamente nessas dimensões.</p>
<h2 id="What-Is-the-CCKM-Benchmark" class="common-anchor-header">O que é o benchmark CCKM?<button data-href="#What-Is-the-CCKM-Benchmark" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>O CCKM</strong> (Cross-modal, Cross-lingual, Key information, MRL) testa quatro capacidades que os benchmarks padrão não conseguem:</p>
<table>
<thead>
<tr><th>Dimensão</th><th>O que testa</th><th>Porque é que é importante</th></tr>
</thead>
<tbody>
<tr><td><strong>Recuperação multimodal</strong></td><td>Fazer corresponder as descrições de texto à imagem correta quando estão presentes distractores quase idênticos</td><td>Os pipelines<a href="https://zilliz.com/learn/multimodal-rag">RAG multimodais</a> necessitam de texto e imagem incorporados no mesmo espaço vetorial</td></tr>
<tr><td><strong>Recuperação multilingue</strong></td><td>Encontrar o documento inglês correto a partir de uma consulta chinesa e vice-versa</td><td>As bases de conhecimentos de produção são frequentemente multilingues</td></tr>
<tr><td><strong>Recuperação de informações-chave</strong></td><td>Localizar um facto específico enterrado num documento de 4K-32K caracteres (agulha num palheiro)</td><td>Os sistemas RAG processam frequentemente documentos longos, como contratos e documentos de investigação</td></tr>
<tr><td><strong>Compressão de dimensão MRL</strong></td><td>Mede a qualidade que o modelo perde quando se truncam os embeddings para 256 dimensões</td><td>Menos dimensões = menor custo de armazenamento na sua base de dados vetorial, mas a que custo de qualidade?</td></tr>
</tbody>
</table>
<p>O MTEB não cobre nenhuma destas situações. O MMEB acrescenta o multimodal, mas ignora os negativos fortes, pelo que os modelos obtêm uma pontuação elevada sem provarem que conseguem lidar com distinções subtis. O CCKM foi concebido para cobrir o que eles não cobrem.</p>
<h2 id="Which-Embedding-Models-Did-We-Test-Gemini-Embedding-2-Jina-Embeddings-v4-and-More" class="common-anchor-header">Que modelos de incorporação testámos? Gemini Embedding 2, Jina Embeddings v4, e mais<button data-href="#Which-Embedding-Models-Did-We-Test-Gemini-Embedding-2-Jina-Embeddings-v4-and-More" class="anchor-icon" translate="no">
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
    </button></h2><p>Testámos 10 modelos que abrangem serviços API e opções de código aberto, além do CLIP ViT-L-14 como base de referência para 2021.</p>
<table>
<thead>
<tr><th>Modelo</th><th>Fonte</th><th>Parâmetros</th><th>Dimensões</th><th>Modalidade</th><th>Traço-chave</th></tr>
</thead>
<tbody>
<tr><td>Incorporação Gemini 2</td><td>Google</td><td>Não revelado</td><td>3072</td><td>Texto / imagem / vídeo / áudio / PDF</td><td>Todas as modalidades, cobertura mais alargada</td></tr>
<tr><td>Jina Embeddings v4</td><td>Jina AI</td><td>3.8B</td><td>2048</td><td>Texto / imagem / PDF</td><td>Adaptadores MRL + LoRA</td></tr>
<tr><td>Voyage Multimodal 3.5</td><td>Voyage AI (MongoDB)</td><td>Não revelado</td><td>1024</td><td>Texto / imagem / vídeo</td><td>Equilibrado entre tarefas</td></tr>
<tr><td>Qwen3-VL-Embedding-2B</td><td>Alibaba Qwen</td><td>2B</td><td>2048</td><td>Texto / imagem / vídeo</td><td>Código aberto, multimodal ligeiro</td></tr>
<tr><td>Jina CLIP v2</td><td>Jina AI</td><td>~1B</td><td>1024</td><td>Texto / imagem</td><td>Arquitetura CLIP modernizada</td></tr>
<tr><td>Cohere Embed v4</td><td>Coesão</td><td>Não revelado</td><td>Fixo</td><td>Texto</td><td>Recuperação empresarial</td></tr>
<tr><td>OpenAI text-embedding-3-large</td><td>OpenAI</td><td>Não revelado</td><td>3072</td><td>Texto</td><td>Mais utilizado</td></tr>
<tr><td><a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings">BGE-M3</a></td><td>BAAI</td><td>568M</td><td>1024</td><td>Texto</td><td>Código aberto, mais de 100 línguas</td></tr>
<tr><td>mxbai-embed-large</td><td>IA de pão misto</td><td>335M</td><td>1024</td><td>Texto</td><td>Ligeiro, centrado no inglês</td></tr>
<tr><td>nómico-embed-texto</td><td>IA nómica</td><td>137M</td><td>768</td><td>Texto</td><td>Ultra-leve</td></tr>
<tr><td>CLIP ViT-L-14</td><td>OpenAI (2021)</td><td>428M</td><td>768</td><td>Texto / imagem</td><td>Base de referência</td></tr>
</tbody>
</table>
<h2 id="Cross-Modal-Retrieval-Which-Models-Handle-Text-to-Image-Search" class="common-anchor-header">Recuperação multimodal: Que modelos tratam a pesquisa de texto para imagem?<button data-href="#Cross-Modal-Retrieval-Which-Models-Handle-Text-to-Image-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Se o seu pipeline RAG lida com imagens juntamente com texto, o modelo de incorporação tem de colocar ambas as modalidades no mesmo <a href="https://zilliz.com/glossary/vector-embeddings">espaço vetorial</a>. Pense na pesquisa de imagens de comércio eletrónico, em bases de conhecimento mistas de imagem-texto ou em qualquer sistema em que uma consulta de texto precise de encontrar a imagem certa.</p>
<h3 id="Method" class="common-anchor-header">Método</h3><p>Recolhemos 200 pares imagem-texto do COCO val2017. Para cada imagem, o GPT-4o-mini gerou uma descrição pormenorizada. Em seguida, escrevemos 3 negativos difíceis por imagem - descrições que diferem da correta apenas por um ou dois detalhes. O modelo tem de encontrar a correspondência correta num conjunto de 200 imagens e 600 distractores.</p>
<p>Um exemplo do conjunto de dados:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_9_3965746e33.png" alt="Vintage brown leather suitcases with travel stickers including California and Cuba, placed on a metal luggage rack against a blue sky — used as a test image in the cross-modal retrieval benchmark" class="doc-image" id="vintage-brown-leather-suitcases-with-travel-stickers-including-california-and-cuba,-placed-on-a-metal-luggage-rack-against-a-blue-sky-—-used-as-a-test-image-in-the-cross-modal-retrieval-benchmark" />
   </span> <span class="img-wrapper"> <span>Malas de cabedal castanho vintage com autocolantes de viagens, incluindo a Califórnia e Cuba, colocadas num porta-bagagens de metal contra um céu azul - utilizada como imagem de teste no teste de recuperação de imagens intermodais</span> </span></p>
<blockquote>
<p><strong>Descrição correta:</strong> "A imagem apresenta malas vintage em pele castanha com vários autocolantes de viagem, incluindo 'Califórnia', 'Cuba' e 'Nova Iorque', colocadas num porta-bagagens de metal contra um céu azul claro."</p>
<p><strong>Negativo forte:</strong> A mesma frase, mas "Califórnia" torna-se "Florida" e "céu azul" torna-se "céu nublado". O modelo tem de compreender os pormenores da imagem para os distinguir.</p>
</blockquote>
<p><strong>Pontuação:</strong></p>
<ul>
<li>Gerar <a href="https://zilliz.com/glossary/vector-embeddings">embeddings</a> para todas as imagens e todo o texto (200 descrições corretas + 600 negativos difíceis).</li>
<li><strong>Texto-para-imagem (t2i):</strong> Cada descrição procura 200 imagens para encontrar a correspondência mais próxima. Marque um ponto se o primeiro resultado estiver correto.</li>
<li><strong>Imagem-para-texto (i2t):</strong> Cada imagem procura a correspondência mais próxima em todos os 800 textos. Marque um ponto apenas se o resultado principal for a descrição correta, e não um negativo absoluto.</li>
<li><strong>Pontuação final:</strong> hard_avg_R@1 = (precisão t2i + precisão i2t) / 2</li>
</ul>
<h3 id="Results" class="common-anchor-header">Resultados</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_1_6f1fddae56.png" alt="Horizontal bar chart showing Cross-Modal Retrieval Ranking: Qwen3-VL-2B leads at 0.945, followed by Gemini Embed 2 at 0.928, Voyage MM-3.5 at 0.900, Jina CLIP v2 at 0.873, and CLIP ViT-L-14 at 0.768" class="doc-image" id="horizontal-bar-chart-showing-cross-modal-retrieval-ranking:-qwen3-vl-2b-leads-at-0.945,-followed-by-gemini-embed-2-at-0.928,-voyage-mm-3.5-at-0.900,-jina-clip-v2-at-0.873,-and-clip-vit-l-14-at-0.768" />
   <span>Gráfico de barras horizontais que mostra a classificação da recuperação intermodal: Qwen3-VL-2B lidera com 0,945, seguido por Gemini Embed 2 com 0,928, Voyage MM-3.5 com 0,900, Jina CLIP v2 com 0,873 e CLIP ViT-L-14 com 0,768</span> </span></p>
<p>O Qwen3-VL-2B, um modelo de parâmetros 2B de código aberto da equipa Qwen da Alibaba, ficou em primeiro lugar, à frente de todas as API de código fechado.</p>
<p><strong>A diferença de modalidade</strong> explica a maior parte da diferença. Os modelos de incorporação mapeiam texto e imagens no mesmo espaço vetorial, mas na prática as duas modalidades tendem a agrupar-se em regiões diferentes. A diferença de modalidade mede a distância L2 entre esses dois grupos. Uma diferença mais pequena = recuperação multimodal mais fácil.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_8_c5067a3434.png" alt="Visualization comparing large modality gap (0.73, text and image embedding clusters far apart) versus small modality gap (0.25, clusters overlapping) — smaller gap makes cross-modal matching easier" class="doc-image" id="visualization-comparing-large-modality-gap-(0.73,-text-and-image-embedding-clusters-far-apart)-versus-small-modality-gap-(0.25,-clusters-overlapping)-—-smaller-gap-makes-cross-modal-matching-easier" />
   </span> <span class="img-wrapper"> <span>Visualização da comparação entre uma grande diferença de modalidade (0,73, aglomerados de texto e imagem muito afastados) e uma pequena diferença de modalidade (0,25, aglomerados sobrepostos) - uma diferença mais pequena facilita a correspondência entre modalidades</span> </span></p>
<table>
<thead>
<tr><th>Modelo</th><th>Pontuação (R@1)</th><th>Lacuna de modalidade</th><th>Parâmetros</th></tr>
</thead>
<tbody>
<tr><td>Qwen3-VL-2B</td><td>0.945</td><td>0.25</td><td>2B (código aberto)</td></tr>
<tr><td>Gemini Embedding 2</td><td>0.928</td><td>0.73</td><td>Desconhecido (fechado)</td></tr>
<tr><td>Voyage Multimodal 3.5</td><td>0.900</td><td>0.59</td><td>Desconhecido (fechado)</td></tr>
<tr><td>Jina CLIP v2</td><td>0.873</td><td>0.87</td><td>~1B</td></tr>
<tr><td>CLIP ViT-L-14</td><td>0.768</td><td>0.83</td><td>428M</td></tr>
</tbody>
</table>
<p>A diferença de modalidade do Qwen é de 0,25 - cerca de um terço dos 0,73 do Gemini. Numa <a href="https://zilliz.com/learn/what-is-a-vector-database">base de dados vetorial</a> como o <a href="https://milvus.io/">Milvus</a>, uma pequena diferença entre modalidades significa que pode armazenar texto e imagens na mesma <a href="https://milvus.io/docs/manage-collections.md">coleção</a> e <a href="https://milvus.io/docs/single-vector-search.md">pesquisar</a> diretamente em ambas. Uma grande diferença pode tornar <a href="https://zilliz.com/glossary/similarity-search">a pesquisa por semelhança</a> entre modalidades menos fiável, e pode ser necessário um passo de reclassificação para compensar.</p>
<h2 id="Cross-Lingual-Retrieval-Which-Models-Align-Meaning-Across-Languages" class="common-anchor-header">Recuperação inter-lingual: Que modelos alinham o significado entre as línguas?<button data-href="#Cross-Lingual-Retrieval-Which-Models-Align-Meaning-Across-Languages" class="anchor-icon" translate="no">
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
    </button></h2><p>Bases de conhecimento multilíngues são comuns na produção. Um utilizador faz uma pergunta em chinês, mas a resposta está num documento em inglês - ou o contrário. O modelo de incorporação precisa de alinhar o significado entre as línguas, e não apenas dentro de uma.</p>
<h3 id="Method" class="common-anchor-header">Método</h3><p>Criámos 166 pares de frases paralelas em chinês e inglês em três níveis de dificuldade:</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_6_75caab66a7.png" alt="Cross-lingual difficulty tiers: Easy tier maps literal translations like 我爱你 to I love you; Medium tier maps paraphrased sentences like 这道菜太咸了 to This dish is too salty with hard negatives; Hard tier maps Chinese idioms like 画蛇添足 to gilding the lily with semantically different hard negatives" class="doc-image" id="cross-lingual-difficulty-tiers:-easy-tier-maps-literal-translations-like-我爱你-to-i-love-you;-medium-tier-maps-paraphrased-sentences-like-这道菜太咸了-to-this-dish-is-too-salty-with-hard-negatives;-hard-tier-maps-chinese-idioms-like-画蛇添足-to-gilding-the-lily-with-semantically-different-hard-negatives" />
   <span>Níveis de dificuldade inter-lingual: O nível fácil mapeia traduções literais como 我爱你 para Eu te amo; O nível médio mapeia frases parafraseadas como 这道菜太咸了 para Este prato é muito salgado com negativos rígidos; O nível difícil mapeia expressões idiomáticas chinesas como 画蛇添足 para dourar o lírio com negativos rígidos semanticamente diferentes</span> </span></p>
<p>Cada língua também recebe 152 distractores de negativas fortes.</p>
<p><strong>Pontuação:</strong></p>
<ul>
<li>Gerar embeddings para todo o texto chinês (166 corretos + 152 distractores) e todo o texto inglês (166 corretos + 152 distractores).</li>
<li><strong>Chinês → Inglês:</strong> Cada frase chinesa procura a sua tradução correta em 318 textos ingleses.</li>
<li><strong>Inglês → Chinês:</strong> O mesmo no sentido inverso.</li>
<li><strong>Pontuação final:</strong> hard_avg_R@1 = (precisão zh→en + precisão en→zh) / 2</li>
</ul>
<h3 id="Results" class="common-anchor-header">Resultados</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_2_d1c3500423.png" alt="Horizontal bar chart showing Cross-Lingual Retrieval Ranking: Gemini Embed 2 leads at 0.997, followed by Qwen3-VL-2B at 0.988, Jina v4 at 0.985, Voyage MM-3.5 at 0.982, down to mxbai at 0.120" class="doc-image" id="horizontal-bar-chart-showing-cross-lingual-retrieval-ranking:-gemini-embed-2-leads-at-0.997,-followed-by-qwen3-vl-2b-at-0.988,-jina-v4-at-0.985,-voyage-mm-3.5-at-0.982,-down-to-mxbai-at-0.120" />
   <span>Gráfico de barras horizontais mostrando a classificação de recuperação entre idiomas: Gemini Embed 2 lidera com 0,997, seguido por Qwen3-VL-2B com 0,988, Jina v4 com 0,985, Voyage MM-3.5 com 0,982, até mxbai com 0,120</span> </span></p>
<p>O Gemini Embedding 2 obteve 0,997 - a pontuação mais alta de todos os modelos testados. Foi o único modelo a obter uma pontuação perfeita de 1,000 no nível Difícil, onde pares como "画蛇添足" → "gilding the lily" requerem uma compreensão <a href="https://zilliz.com/glossary/semantic-search">semântica</a> genuína entre as línguas, e não uma correspondência de padrões.</p>
<table>
<thead>
<tr><th>Modelo</th><th>Pontuação (R@1)</th><th>Fácil</th><th>Médio</th><th>Difícil (expressões idiomáticas)</th></tr>
</thead>
<tbody>
<tr><td>Incorporação Gemini 2</td><td>0.997</td><td>1.000</td><td>1.000</td><td>1.000</td></tr>
<tr><td>Qwen3-VL-2B</td><td>0.988</td><td>1.000</td><td>1.000</td><td>0.969</td></tr>
<tr><td>Jina Embeddings v4</td><td>0.985</td><td>1.000</td><td>1.000</td><td>0.969</td></tr>
<tr><td>Voyage Multimodal 3.5</td><td>0.982</td><td>1.000</td><td>1.000</td><td>0.938</td></tr>
<tr><td>OpenAI 3-grande</td><td>0.967</td><td>1.000</td><td>1.000</td><td>0.906</td></tr>
<tr><td>Cohere Embed v4</td><td>0.955</td><td>1.000</td><td>0.980</td><td>0.875</td></tr>
<tr><td>BGE-M3 (568M)</td><td>0.940</td><td>1.000</td><td>0.960</td><td>0.844</td></tr>
<tr><td>texto nómico incorporado (137M)</td><td>0.154</td><td>0.300</td><td>0.120</td><td>0.031</td></tr>
<tr><td>mxbai-embed-large (335M)</td><td>0.120</td><td>0.220</td><td>0.080</td><td>0.031</td></tr>
</tbody>
</table>
<p>Os 7 modelos principais obtêm todos 0,93 na pontuação geral - a verdadeira diferenciação ocorre no nível difícil (expressões idiomáticas chinesas). nomic-embed-text e mxbai-embed-large, ambos modelos ligeiros centrados no inglês, obtêm uma pontuação próxima de zero em tarefas multilingues.</p>
<h2 id="Key-Information-Retrieval-Can-Models-Find-a-Needle-in-a-32K-Token-Document" class="common-anchor-header">Recuperação de informações importantes: Os modelos conseguem encontrar uma agulha num documento com 32 mil palavras?<button data-href="#Key-Information-Retrieval-Can-Models-Find-a-Needle-in-a-32K-Token-Document" class="anchor-icon" translate="no">
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
    </button></h2><p>Os sistemas RAG processam frequentemente documentos extensos - contratos legais, documentos de investigação, relatórios internos que contêm <a href="https://zilliz.com/learn/introduction-to-unstructured-data">dados não estruturados</a>. A questão é se um modelo de incorporação consegue encontrar um facto específico enterrado em milhares de caracteres de texto envolvente.</p>
<h3 id="Method" class="common-anchor-header">Método</h3><p>Tomámos como palheiro artigos da Wikipédia de diferentes comprimentos (4K a 32K caracteres) e inserimos um único facto fabricado - a agulha - em diferentes posições: início, 25%, 50%, 75% e fim. O modelo tem de determinar, com base numa incorporação de consulta, qual a versão do documento que contém a agulha.</p>
<p><strong>Exemplo:</strong></p>
<ul>
<li><strong>Agulha:</strong> "A Meridian Corporation registou uma receita trimestral de 847,3 milhões de dólares no terceiro trimestre de 2025."</li>
<li><strong>Consulta:</strong> "Qual foi a receita trimestral da Meridian Corporation?"</li>
<li><strong>Palheiro:</strong> Um artigo de 32.000 caracteres da Wikipédia sobre fotossíntese, com a agulha escondida algures no seu interior.</li>
</ul>
<p><strong>Pontuação:</strong></p>
<ul>
<li>Gerar embeddings para a consulta, o documento com a agulha e o documento sem a agulha.</li>
<li>Se a consulta for mais parecida com o documento que contém a agulha, conte-a como um acerto.</li>
<li>Precisão média em todos os comprimentos de documento e posições da agulha.</li>
<li><strong>Métricas finais:</strong> overall_accuracy e degradation_rate (quanto a precisão cai do documento mais curto para o mais longo).</li>
</ul>
<h3 id="Results" class="common-anchor-header">Resultados</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_5_2bdc89516a.png" alt="Heatmap showing Needle-in-a-Haystack accuracy by document length: Gemini Embed 2 scores 1.000 across all lengths up to 32K; top 7 models score perfectly within their context windows; mxbai and nomic degrade sharply at 4K+" class="doc-image" id="heatmap-showing-needle-in-a-haystack-accuracy-by-document-length:-gemini-embed-2-scores-1.000-across-all-lengths-up-to-32k;-top-7-models-score-perfectly-within-their-context-windows;-mxbai-and-nomic-degrade-sharply-at-4k+" />
   <span>Mapa de calor mostrando a precisão do Needle-in-a-Haystack por comprimento de documento: O Gemini Embedding 2 tem uma pontuação de 1.000 em todos os comprimentos até 32K; os 7 principais modelos têm uma pontuação perfeita dentro das suas janelas de contexto; o mxbai e o nomic degradam-se acentuadamente a 4K+</span> </span></p>
<p>O Gemini Embedding 2 é o único modelo testado em toda a gama 4K-32K e obteve uma pontuação perfeita em todos os comprimentos. Nenhum outro modelo neste teste tem uma janela de contexto que chegue a 32K.</p>
<table>
<thead>
<tr><th>Modelo</th><th>1K</th><th>4K</th><th>8K</th><th>16K</th><th>32K</th><th>Total</th><th>Degradação</th></tr>
</thead>
<tbody>
<tr><td>Incorporação Gemini 2</td><td>1.000</td><td>1.000</td><td>1.000</td><td>1.000</td><td>1.000</td><td>1.000</td><td>0%</td></tr>
<tr><td>OpenAI 3-grande porte</td><td>1.000</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>Jina Embeddings v4</td><td>1.000</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>Cohere Embed v4</td><td>1.000</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>Qwen3-VL-2B</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>Voyage Multimodal 3,5</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>Jina CLIP v2</td><td>1.000</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>BGE-M3 (568M)</td><td>1.000</td><td>1.000</td><td>0.920</td><td>-</td><td>-</td><td>0.973</td><td>8%</td></tr>
<tr><td>mxbai-embed-large (335M)</td><td>0.980</td><td>0.600</td><td>0.400</td><td>-</td><td>-</td><td>0.660</td><td>58%</td></tr>
<tr><td>texto nómico-embutido (137M)</td><td>1.000</td><td>0.460</td><td>0.440</td><td>-</td><td>-</td><td>0.633</td><td>56%</td></tr>
</tbody>
</table>
<p>"-" significa que o comprimento do documento excede a janela de contexto do modelo.</p>
<p>Os 7 melhores modelos obtêm resultados perfeitos dentro das suas janelas de contexto. O BGE-M3 começa a falhar aos 8K (0,920). Os modelos mais leves (mxbai e nomic) caem para 0,4-0,6 com apenas 4K caracteres - cerca de 1.000 tokens. No caso do mxbai, esta descida reflecte, em parte, o facto de a janela de contexto de 512 tokens truncar a maior parte do documento.</p>
<h2 id="MRL-Dimension-Compression-How-Much-Quality-Do-You-Lose-at-256-Dimensions" class="common-anchor-header">Compressão de dimensão MRL: Quanta qualidade se perde com 256 dimensões?<button data-href="#MRL-Dimension-Compression-How-Much-Quality-Do-You-Lose-at-256-Dimensions" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>A Aprendizagem de Representação Matryoshka (MRL)</strong> é uma técnica de treino que torna as primeiras N dimensões de um vetor significativas por si só. Pegue num vetor de 3072 dimensões, trunque-o para 256, e ele ainda mantém a maior parte da sua qualidade semântica. Menos dimensões significam menos custos de armazenamento e memória na sua <a href="https://zilliz.com/learn/what-is-a-vector-database">base de dados de vectores</a> - passar de 3072 para 256 dimensões é uma redução de 12x no armazenamento.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_10_aef8755877.png" alt="Illustration showing MRL dimension truncation: 3072 dimensions at full quality, 1024 at 95%, 512 at 90%, 256 at 85% — with 12x storage savings at 256 dimensions" class="doc-image" id="illustration-showing-mrl-dimension-truncation:-3072-dimensions-at-full-quality,-1024-at-95%,-512-at-90%,-256-at-85%-—-with-12x-storage-savings-at-256-dimensions" />
   <span>Ilustração que mostra o truncamento da dimensão MRL: 3072 dimensões com qualidade total, 1024 com 95%, 512 com 90%, 256 com 85% - com uma poupança de armazenamento de 12x com 256 dimensões</span> </span></p>
<h3 id="Method" class="common-anchor-header">Método</h3><p>Utilizámos 150 pares de frases do parâmetro de referência STS-B, cada um com uma pontuação de semelhança anotada por humanos (0-5). Para cada modelo, gerámos embeddings em dimensões completas, depois truncámos para 1024, 512 e 256.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_4_44266e5456.png" alt="STS-B data examples showing sentence pairs with human similarity scores: A girl is styling her hair vs A girl is brushing her hair scores 2.5; A group of men play soccer on the beach vs A group of boys are playing soccer on the beach scores 3.6" class="doc-image" id="sts-b-data-examples-showing-sentence-pairs-with-human-similarity-scores:-a-girl-is-styling-her-hair-vs-a-girl-is-brushing-her-hair-scores-2.5;-a-group-of-men-play-soccer-on-the-beach-vs-a-group-of-boys-are-playing-soccer-on-the-beach-scores-3.6" />
   <span>Exemplos de dados STS-B que mostram pares de frases com pontuações de semelhança humanas: Uma rapariga está a pentear o cabelo vs Uma rapariga está a escovar o cabelo tem uma pontuação de 2,5; Um grupo de homens joga futebol na praia vs Um grupo de rapazes está a jogar futebol na praia tem uma pontuação de 3,6</span> </span></p>
<p><strong>Pontuação:</strong></p>
<ul>
<li>Em cada nível de dimensão, calcular a <a href="https://zilliz.com/glossary/cosine-similarity">semelhança de cosseno</a> entre as incorporações de cada par de frases.</li>
<li>Compare a classificação de semelhança do modelo com a classificação humana utilizando <strong>o ρ de Spearman</strong> (correlação de classificação).</li>
</ul>
<blockquote>
<p><strong>O que é o ρ de Spearman?</strong> Mede a concordância entre duas classificações. Se os humanos classificarem o par A como o mais semelhante, o B em segundo lugar e o C como o menos semelhante - e as semelhanças de cosseno do modelo produzirem a mesma ordem A &gt; B &gt; C - então ρ aproxima-se de 1,0. Um ρ de 1,0 significa uma concordância perfeita. Um ρ de 0 significa que não há correlação.</p>
</blockquote>
<p><strong>Métricas finais:</strong> spearman_rho (quanto maior, melhor) e min_viable_dim (a dimensão mais pequena em que a qualidade se mantém dentro de 5% do desempenho da dimensão completa).</p>
<h3 id="Results" class="common-anchor-header">Resultados</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_3_7192725ed6.png" alt="Dot plot showing MRL Full Dimension vs 256 Dimension Quality: Voyage MM-3.5 leads with +0.6% change, Jina v4 +0.5%, while Gemini Embed 2 shows -0.6% at the bottom" class="doc-image" id="dot-plot-showing-mrl-full-dimension-vs-256-dimension-quality:-voyage-mm-3.5-leads-with-+0.6%-change,-jina-v4-+0.5%,-while-gemini-embed-2-shows--0.6%-at-the-bottom" />
   <span>Gráfico de pontos mostrando MRL Full Dimension vs 256 Dimension Quality: O Voyage MM-3.5 lidera com +0,6% de alteração, o Jina v4 +0,5%, enquanto o Gemini Embed 2 apresenta -0,6% na parte inferior</span> </span></p>
<p>Se está a planear reduzir os custos de armazenamento no <a href="https://milvus.io/">Milvus</a> ou noutra base de dados vetorial truncando as dimensões, este resultado é importante.</p>
<table>
<thead>
<tr><th>O modelo</th><th>ρ (full dim)</th><th>ρ (256 dim)</th><th>Decaimento</th></tr>
</thead>
<tbody>
<tr><td>Voyage Multimodal 3.5</td><td>0.880</td><td>0.874</td><td>0.7%</td></tr>
<tr><td>Jina Embeddings v4</td><td>0.833</td><td>0.828</td><td>0.6%</td></tr>
<tr><td>mxbai-embed-large (335M)</td><td>0.815</td><td>0.795</td><td>2.5%</td></tr>
<tr><td>nómico-embed-texto (137M)</td><td>0.781</td><td>0.774</td><td>0.8%</td></tr>
<tr><td>OpenAI 3-grande</td><td>0.767</td><td>0.762</td><td>0.6%</td></tr>
<tr><td>Gemini Embedding 2</td><td>0.683</td><td>0.689</td><td>-0.8%</td></tr>
</tbody>
</table>
<p>O Voyage e o Jina v4 lideram porque ambos foram explicitamente treinados com o MRL como objetivo. A compressão de dimensão tem pouco a ver com o tamanho do modelo - o que importa é se o modelo foi treinado para isso.</p>
<p>Uma nota sobre a pontuação do Gemini: a classificação do LMR reflecte a forma como um modelo preserva a qualidade após o truncamento, e não a qualidade da sua recuperação em todas as dimensões. A recuperação em toda a dimensão do Gemini é forte - os resultados multilingues e de informação-chave já o provaram. Apenas não foi optimizada para a redução. Se não precisa de compressão de dimensões, esta métrica não se aplica a si.</p>
<h2 id="Which-Embedding-Model-Should-You-Use" class="common-anchor-header">Que modelo de incorporação deve ser utilizado?<button data-href="#Which-Embedding-Model-Should-You-Use" class="anchor-icon" translate="no">
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
    </button></h2><p>Nenhum modelo ganha tudo. Aqui está a tabela de pontuação completa:</p>
<table>
<thead>
<tr><th>Modelo</th><th>Parâmetros</th><th>Modal cruzado</th><th>Entre idiomas</th><th>Informações principais</th><th>MRL ρ</th></tr>
</thead>
<tbody>
<tr><td>Incorporação Gemini 2</td><td>Não revelado</td><td>0.928</td><td>0.997</td><td>1.000</td><td>0.668</td></tr>
<tr><td>Voyage Multimodal 3.5</td><td>Não divulgado</td><td>0.900</td><td>0.982</td><td>1.000</td><td>0.880</td></tr>
<tr><td>Jina Embeddings v4</td><td>3.8B</td><td>-</td><td>0.985</td><td>1.000</td><td>0.833</td></tr>
<tr><td>Qwen3-VL-2B</td><td>2B</td><td>0.945</td><td>0.988</td><td>1.000</td><td>0.774</td></tr>
<tr><td>OpenAI 3-grande</td><td>Não revelado</td><td>-</td><td>0.967</td><td>1.000</td><td>0.760</td></tr>
<tr><td>Cohere Embed v4</td><td>Não revelado</td><td>-</td><td>0.955</td><td>1.000</td><td>-</td></tr>
<tr><td>Jina CLIP v2</td><td>~1B</td><td>0.873</td><td>0.934</td><td>1.000</td><td>-</td></tr>
<tr><td>BGE-M3</td><td>568M</td><td>-</td><td>0.940</td><td>0.973</td><td>0.744</td></tr>
<tr><td>mxbai-embed-large</td><td>335M</td><td>-</td><td>0.120</td><td>0.660</td><td>0.815</td></tr>
<tr><td>texto nómico-embutido</td><td>137M</td><td>-</td><td>0.154</td><td>0.633</td><td>0.780</td></tr>
<tr><td>CLIP ViT-L-14</td><td>428M</td><td>0.768</td><td>0.030</td><td>-</td><td>-</td></tr>
</tbody>
</table>
<p>"-" significa que o modelo não suporta essa modalidade ou capacidade. O CLIP é uma linha de base de 2021 para referência.</p>
<p>Eis o que se destaca:</p>
<ul>
<li><strong>Modal cruzado:</strong> Qwen3-VL-2B (0,945) em primeiro lugar, Gemini (0,928) em segundo, Voyage (0,900) em terceiro. Um modelo 2B de código aberto venceu todas as API de código fechado. O fator decisivo foi a diferença de modalidades e não a contagem de parâmetros.</li>
<li><strong>Entre idiomas:</strong> Gemini (0,997) lidera - o único modelo a obter uma pontuação perfeita no alinhamento ao nível do idioma. Os 8 melhores modelos têm todos 0,93. Os modelos ligeiros apenas em inglês têm uma pontuação próxima de zero.</li>
<li><strong>Informações importantes:</strong> A API e os grandes modelos de código aberto têm uma pontuação perfeita até 8K. Os modelos abaixo de 335M começam a degradar-se a 4K. O Gemini é o único modelo que lida com 32K com uma pontuação perfeita.</li>
<li><strong>Compressão de dimensão MRL:</strong> O Voyage (0,880) e o Jina v4 (0,833) lideram, perdendo menos de 1% a 256 dimensões. Gemini (0,668) vem em último lugar - forte em dimensão total, não optimizado para truncagem.</li>
</ul>
<h3 id="How-to-Pick-A-Decision-Flowchart" class="common-anchor-header">Como escolher: um fluxograma de decisão</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_7_b2bd48bdcc.png" alt="Embedding model selection flowchart: Start → Need images or video? → Yes: Need to self-host? → Yes: Qwen3-VL-2B, No: Gemini Embedding 2. No images → Need to save storage? → Yes: Jina v4 or Voyage, No: Need multilingual? → Yes: Gemini Embedding 2, No: OpenAI 3-large" class="doc-image" id="embedding-model-selection-flowchart:-start-→-need-images-or-video?-→-yes:-need-to-self-host?-→-yes:-qwen3-vl-2b,-no:-gemini-embedding-2.-no-images-→-need-to-save-storage?-→-yes:-jina-v4-or-voyage,-no:-need-multilingual?-→-yes:-gemini-embedding-2,-no:-openai-3-large" />
   <span>Fluxograma de seleção de modelos de incorporação: Início → Precisa de imagens ou vídeo? → Sim: Precisa de se auto-hospedar? → Sim: Qwen3-VL-2B, Não: Gemini Embedding 2. Sem imagens → Necessidade de poupar espaço de armazenamento? → Sim: Jina v4 ou Voyage, Não: Precisa de ser multilingue? → Sim: Gemini Embedding 2, Não: OpenAI 3-large</span> </span></p>
<h3 id="The-Best-All-Rounder-Gemini-Embedding-2" class="common-anchor-header">O melhor polivalente: Gemini Embedding 2</h3><p>No cômputo geral, o Gemini Embedding 2 é o modelo mais forte neste benchmark.</p>
<p><strong>Pontos fortes:</strong> Primeiro em vários idiomas (0,997) e na recuperação de informações importantes (1,000 em todos os comprimentos até 32K). Segundo em modalidades cruzadas (0,928). A mais ampla cobertura de modalidades - cinco modalidades (texto, imagem, vídeo, áudio, PDF), enquanto a maioria dos modelos se limita a três.</p>
<p><strong>Pontos fracos:</strong> Último na compressão MRL (ρ = 0,668). Vencido em cross-modal pelo Qwen3-VL-2B de código aberto.</p>
<p>Se não precisar de compressão de dimensões, o Gemini não tem um verdadeiro concorrente na combinação de recuperação interlinguística + de documentos longos. Mas para precisão intermodal ou otimização do armazenamento, os modelos especializados são melhores.</p>
<h2 id="Limitations" class="common-anchor-header">Limitações<button data-href="#Limitations" class="anchor-icon" translate="no">
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
<li>Não incluímos todos os modelos que vale a pena considerar - o NV-Embed-v2 da NVIDIA e o v5-text da Jina estavam na lista, mas não chegaram a esta ronda.</li>
<li>Concentrámo-nos nas modalidades de texto e imagem; a incorporação de vídeo, áudio e PDF (apesar de alguns modelos afirmarem suportar) não foi abrangida.</li>
<li>A recuperação de código e outros cenários específicos de um domínio ficaram fora do âmbito.</li>
<li>O tamanho das amostras foi relativamente pequeno, pelo que as diferenças de classificação entre os modelos podem ser estatisticamente irrelevantes.</li>
</ul>
<p>Os resultados deste artigo estarão desactualizados dentro de um ano. Novos modelos são lançados constantemente, e a tabela de classificação muda a cada lançamento. O investimento mais duradouro é construir o seu próprio pipeline de avaliação - defina os seus tipos de dados, os seus padrões de consulta, os comprimentos dos seus documentos e execute novos modelos através dos seus próprios testes quando forem lançados. Vale a pena monitorizar benchmarks públicos como o MTEB, o MMTEB e o MMEB, mas a decisão final deve vir sempre dos seus próprios dados.</p>
<p><a href="https://github.com/zc277584121/mm-embedding-bench">O nosso código de benchmark é open-source no GitHub</a> - faça um fork e adapte-o ao seu caso de utilização.</p>
<hr>
<p>Depois de escolher o seu modelo de incorporação, precisa de um local para armazenar e pesquisar esses vectores em escala. <a href="https://milvus.io/">O Milvus</a> é a base de dados de vectores open-source mais adoptada no mundo, com <a href="https://github.com/milvus-io/milvus">mais de 43K estrelas no GitHub</a>, criada exatamente para isso - suporta dimensões truncadas por LMR, colecções multimodais mistas, pesquisa híbrida combinando vectores densos e esparsos e <a href="https://milvus.io/docs/architecture_overview.md">escalas desde um portátil até milhares de milhões de vectores</a>.</p>
<ul>
<li>Comece com o <a href="https://milvus.io/docs/quickstart.md">guia de início rápido do Milvus</a> ou instale com <code translate="no">pip install pymilvus</code>.</li>
<li>Junte-se ao <a href="https://milvusio.slack.com/">Milvus Slack</a> ou ao <a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord</a> para fazer perguntas sobre a integração de modelos de incorporação, estratégias de indexação de vetores ou escalonamento de produção.</li>
<li><a href="https://milvus.io/office-hours">Reserve uma sessão gratuita do Milvus Office Hours</a> para percorrer a sua arquitetura RAG - podemos ajudar na seleção de modelos, na conceção de esquemas de coleção e na afinação do desempenho.</li>
<li>Se preferir ignorar o trabalho de infraestrutura, <a href="https://cloud.zilliz.com/signup">o Zilliz Cloud</a> (Milvus gerido) oferece um nível gratuito para começar.</li>
</ul>
<hr>
<p>Algumas perguntas que surgem quando os engenheiros estão escolhendo um modelo de incorporação para o RAG de produção:</p>
<p><strong>P: Devo utilizar um modelo de incorporação multimodal mesmo que, neste momento, só tenha dados de texto?</strong></p>
<p>Depende do seu roteiro. Se é provável que o seu pipeline venha a adicionar imagens, PDFs ou outras modalidades nos próximos 6 a 12 meses, começar com um modelo multimodal como o Gemini Embedding 2 ou o Voyage Multimodal 3.5 evita uma migração dolorosa mais tarde - não será necessário voltar a incorporar todo o conjunto de dados. Se estiver confiante de que será apenas texto num futuro próximo, um modelo centrado no texto, como o OpenAI 3-large ou o Cohere Embed v4, proporcionar-lhe-á uma melhor relação preço/desempenho.</p>
<p><strong>P: Quanto espaço de armazenamento a compactação de dimensão MRL realmente economiza em um banco de dados vetorial?</strong></p>
<p>Passar de 3072 dimensões para 256 dimensões representa uma redução de 12x no armazenamento por vetor. Para uma coleção <a href="https://milvus.io/">Milvus</a> com 100 milhões de vectores em float32, isso equivale a cerca de 1,14 TB → 95 GB. A chave é que nem todos os modelos lidam bem com o truncamento - o Voyage Multimodal 3.5 e o Jina Embeddings v4 perdem menos de 1% de qualidade a 256 dimensões, enquanto outros degradam significativamente.</p>
<p><strong>P: O Qwen3-VL-2B é realmente melhor do que o Gemini Embedding 2 para pesquisa intermodal?</strong></p>
<p>No nosso teste de referência, sim - o Qwen3-VL-2B obteve 0,945 contra os 0,928 do Gemini na recuperação multimodal difícil com distractores quase idênticos. A principal razão é a diferença de modalidade muito mais pequena do Qwen (0,25 vs 0,73), o que significa que <a href="https://zilliz.com/glossary/vector-embeddings">as incorporações</a> de texto e imagem se agrupam mais perto umas das outras no espaço vetorial. Dito isto, o Gemini cobre cinco modalidades enquanto o Qwen cobre três, por isso, se precisar de incorporação de áudio ou PDF, o Gemini é a única opção.</p>
<p><strong>P: Posso utilizar estes modelos de incorporação diretamente com o Milvus?</strong></p>
<p>Sim. Todos estes modelos produzem vectores de flutuação padrão, que pode <a href="https://milvus.io/docs/insert-update-delete.md">inserir no Milvus</a> e pesquisar com <a href="https://zilliz.com/glossary/cosine-similarity">semelhança de cosseno</a>, distância L2 ou produto interno. <a href="https://milvus.io/docs/install-pymilvus.md">O PyMilvus</a> funciona com qualquer modelo de incorporação - gere os seus vectores com o SDK do modelo, depois armazene-os e pesquise-os no Milvus. Para vectores truncados por LMR, basta definir a dimensão da coleção para o seu objetivo (por exemplo, 256) ao <a href="https://milvus.io/docs/manage-collections.md">criar a coleção</a>.</p>
