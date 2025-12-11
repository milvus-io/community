---
id: >-
  gemini-3-pro-milvus-building-a-more-robust-rag-with-advanced-reasoning-and-multimodal-power.md
title: >-
  Gemini 3 Pro + Milvus: Construir um RAG mais robusto com raciocínio avançado e
  poder multimodal
author: Lumina Wang
date: 2025-11-20T00:00:00.000Z
cover: assets.zilliz.com/gemini3pro_cover_2f88fb0fe6.png
tag: Tutorial
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Gemini 3 Pro, vibe coding, Milvus, RAG'
meta_title: |
  Gemini 3 Pro + Milvus: Robust RAG With Advanced Reasoning and Multimodal Power
desc: >-
  Conheça as principais atualizações do Gemini 3 Pro, veja o desempenho dele nos
  principais benchmarks e siga um guia para criar um pipeline RAG de alto
  desempenho com o Milvus.
origin: >-
  https://milvus.io/blog/gemini-3-pro-milvus-building-a-more-robust-rag-with-advanced-reasoning-and-multimodal-power.md
---
<p>O Gemini 3 Pro da Google chegou com o raro tipo de lançamento que muda genuinamente as expectativas dos programadores - não apenas uma propaganda, mas capacidades que expandem materialmente o que as interfaces de linguagem natural podem fazer. Transforma a frase "descreva a aplicação que pretende" num fluxo de trabalho executável: encaminhamento dinâmico de ferramentas, planeamento em várias etapas, orquestração de API e geração de UX interactiva, tudo isto perfeitamente integrado. Este é o modelo que mais se aproxima de tornar a codificação de vibração viável para a produção.</p>
<p>E os números confirmam a narrativa. O Gemini 3 Pro apresenta resultados de destaque em quase todos os principais benchmarks:</p>
<ul>
<li><p><strong>Humanity's Last Exam:</strong> 37,5% sem ferramentas, 45,8% com ferramentas - o concorrente mais próximo fica em 26,5%.</p></li>
<li><p><strong>MathArena Apex:</strong> 23,4%, enquanto a maioria dos modelos não consegue ultrapassar os 2%.</p></li>
<li><p><strong>ScreenSpot-Pro:</strong> 72,7% de precisão, quase o dobro do segundo melhor, com 36,2%.</p></li>
<li><p><strong>Vending-Bench 2:</strong> Valor líquido médio de <strong>$5.478,16</strong>, cerca de <strong>1,4×</strong> acima do segundo lugar.</p></li>
</ul>
<p>Consulte a tabela abaixo para obter mais resultados de benchmark.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gemini_3_table_final_HLE_Tools_on_1s_X_Rb4o_f50f42dd67.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Esta combinação de raciocínio profundo, forte uso de ferramentas e fluência multimodal faz do Gemini 3 Pro um ajuste natural para a geração aumentada por recuperação (RAG). Junte-o ao <a href="https://milvus.io/"><strong>Milvus</strong></a>, o banco de dados vetorial de código aberto de alto desempenho criado para a pesquisa semântica em escala de bilhões, e você terá uma camada de recuperação que fundamenta as respostas, escala de forma limpa e permanece confiável para a produção, mesmo sob cargas de trabalho pesadas.</p>
<p>Neste post, vamos explicar o que há de novo no Gemini 3 Pro, por que ele melhora os fluxos de trabalho RAG e como criar um pipeline RAG limpo e eficiente usando o Milvus como sua espinha dorsal de recuperação.</p>
<h2 id="Major-Upgrades-in-Gemini-3-Pro" class="common-anchor-header">Principais atualizações no Gemini 3 Pro<button data-href="#Major-Upgrades-in-Gemini-3-Pro" class="anchor-icon" translate="no">
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
    </button></h2><p>O Gemini 3 Pro apresenta um conjunto de atualizações substanciais que reformulam a forma como o modelo raciocina, cria, executa tarefas e interage com os usuários. Essas melhorias se dividem em quatro grandes áreas de capacidade:</p>
<h3 id="Multimodal-Understanding-and-Reasoning" class="common-anchor-header">Compreensão e raciocínio multimodais</h3><p>O Gemini 3 Pro estabelece novos recordes em importantes benchmarks multimodais, incluindo ARC-AGI-2 para raciocínio visual, MMMU-Pro para compreensão multimodal e Video-MMMU para compreensão de vídeo e aquisição de conhecimento. O modelo também introduz o Deep Think, um modo de raciocínio alargado que permite o processamento lógico estruturado e em várias etapas. Isto resulta numa precisão significativamente maior em problemas complexos em que os modelos tradicionais de cadeia de pensamento tendem a falhar.</p>
<h3 id="Code-Generation" class="common-anchor-header">Geração de código</h3><p>O modelo leva a codificação generativa a um novo nível. O Gemini 3 Pro pode produzir SVGs interactivos, aplicações Web completas, cenas 3D e até jogos funcionais - incluindo ambientes do tipo Minecraft e bilhares baseados no browser - tudo a partir de um único comando em linguagem natural. O desenvolvimento front-end é especialmente beneficiado: o modelo pode recriar designs de IU existentes com alta fidelidade ou traduzir uma captura de tela diretamente em código pronto para produção, tornando o trabalho iterativo de IU muito mais rápido.</p>
<h3 id="AI-Agents-and-Tool-Use" class="common-anchor-header">Agentes de IA e utilização de ferramentas</h3><p>Com a permissão do utilizador, o Gemini 3 Pro pode aceder a dados do dispositivo Google de um utilizador para realizar tarefas de longo prazo e em várias etapas, como planear viagens ou reservar carros de aluguer. Esta capacidade agêntica reflecte-se no seu forte desempenho no <strong>Vending-Bench 2</strong>, um benchmark especificamente concebido para testar o uso de ferramentas de longo prazo. O modelo também suporta fluxos de trabalho de agentes de nível profissional, incluindo a execução de comandos de terminal e a interação com ferramentas externas através de APIs bem definidas.</p>
<h3 id="Generative-UI" class="common-anchor-header">Interface de utilizador generativa</h3><p>O Gemini 3 Pro ultrapassa o modelo convencional de uma pergunta e uma resposta e introduz a <strong>IU generativa</strong>, em que o modelo pode criar experiências interactivas inteiras de forma dinâmica. Em vez de devolver texto estático, pode gerar interfaces totalmente personalizadas - por exemplo, um planeador de viagens rico e ajustável - diretamente em resposta às instruções do utilizador. Isto faz com que os LLM passem de respondedores passivos a geradores activos de interfaces.</p>
<h2 id="Putting-Gemini-3-Pro-to-the-Test" class="common-anchor-header">Colocando o Gemini 3 Pro à prova<button data-href="#Putting-Gemini-3-Pro-to-the-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>Para além dos resultados de benchmark, realizámos uma série de testes práticos para compreender o comportamento do Gemini 3 Pro em fluxos de trabalho reais. Os resultados destacam como o raciocínio multimodal, as capacidades generativas e o planeamento a longo prazo se traduzem em valor prático para os programadores.</p>
<h3 id="Multimodal-understanding" class="common-anchor-header">Compreensão multimodal</h3><p>O Gemini 3 Pro mostra uma versatilidade impressionante em texto, imagens, vídeo e código. No nosso teste, carregámos um vídeo do Zilliz diretamente do YouTube. O modelo processou todo o clipe - incluindo a narração, as transições e o texto no ecrã - em cerca de <strong>40 segundos</strong>, um tempo de resposta invulgarmente rápido para conteúdos multimodais de formato longo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ytb1_39f31b728a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ytb2_bb4688e829.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>As avaliações internas da Google mostram um comportamento semelhante: O Gemini 3 Pro processou receitas escritas à mão em vários idiomas, transcreveu e traduziu cada uma delas e compilou-as num livro de receitas de família partilhável.</p>
<iframe class="video-player" src="https://www.youtube.com/embed/nfX__7p8J8E" title="Gemini 3 Pro: recipe" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<h3 id="Zero-Shot-Tasks" class="common-anchor-header">Tarefas de tiro zero</h3><p>O Gemini 3 Pro pode gerar interfaces de utilizador web totalmente interactivas sem exemplos prévios ou andaimes. Quando lhe foi pedido que criasse um <strong>jogo web de naves espaciais 3D</strong> retro-futurista, o modelo produziu uma cena interactiva completa: uma grelha roxa néon, naves de estilo cyberpunk, efeitos de partículas brilhantes e controlos de câmara suaves - tudo numa única resposta de zero disparos.</p>
<iframe class="video-player" src="https://www.youtube.com/embed/JxX_TAyy0Kg" title="" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<h3 id="Complex-Task-Planning" class="common-anchor-header">Planeamento de tarefas complexas</h3><p>O modelo também demonstra um planeamento de tarefas a longo prazo mais forte do que muitos dos seus pares. No nosso teste de organização da caixa de entrada, o Gemini 3 Pro comportou-se como um assistente administrativo com IA: categorizou os e-mails desordenados em grupos de projectos, elaborou sugestões acionáveis (resposta, seguimento, arquivo) e apresentou um resumo limpo e estruturado. Com o plano do modelo apresentado, toda a caixa de entrada podia ser limpa com um único clique de confirmação.</p>
<iframe class="video-player" src="https://www.youtube.com/embed/O5CUkblZm0Y" title="Gemini 3 Pro: inbox-organization" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<h2 id="How-to-Build-a-RAG-System-with-Gemini-3-Pro-and-Milvus" class="common-anchor-header">Como criar um sistema RAG com o Gemini 3 Pro e o Milvus<button data-href="#How-to-Build-a-RAG-System-with-Gemini-3-Pro-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>O raciocínio aprimorado do Gemini 3 Pro, a compreensão multimodal e as fortes capacidades de uso de ferramentas fazem dele uma excelente base para sistemas RAG de alto desempenho.</p>
<p>Quando emparelhado com o <a href="https://milvus.io/"><strong>Milvus</strong></a>, o banco de dados vetorial de código aberto de alto desempenho criado para pesquisa semântica em larga escala, obtém-se uma divisão clara de responsabilidades: O Gemini 3 Pro lida com a <strong>interpretação, o raciocínio e a geração</strong>, enquanto o Milvus fornece uma <strong>camada de recuperação rápida e escalável</strong> que mantém as respostas baseadas nos dados da sua empresa. Esse emparelhamento é adequado para aplicações de nível de produção, como bases de conhecimento internas, assistentes de documentos, copilotos de suporte ao cliente e sistemas especialistas em domínios específicos.</p>
<h3 id="Prerequisites" class="common-anchor-header">Pré-requisitos</h3><p>Antes de construir o seu pipeline RAG, certifique-se de que estas bibliotecas Python essenciais estão instaladas ou actualizadas para as suas versões mais recentes:</p>
<ul>
<li><p><strong>pymilvus</strong> - o SDK oficial do Milvus Python</p></li>
<li><p><strong>google-generativeai</strong> - a biblioteca cliente Gemini 3 Pro</p></li>
<li><p><strong>requests</strong> - para lidar com chamadas HTTP quando necessário</p></li>
<li><p><strong>tqdm</strong> - para barras de progresso durante a ingestão de conjuntos de dados</p></li>
</ul>
<pre><code translate="no">! pip install --upgrade pymilvus google-generativeai requests tqdm
<button class="copy-code-btn"></button></code></pre>
<p>Em seguida, inicie sessão no <a href="https://aistudio.google.com/api-keys"><strong>Google AI Studio</strong></a> para obter a sua chave de API.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;GEMINI_API_KEY&quot;</span>] = <span class="hljs-string">&quot;**********&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Preparing-the-Dataset" class="common-anchor-header">Preparar o conjunto de dados</h3><p>Para este tutorial, vamos utilizar a secção FAQ da documentação do Milvus 2.4.x como base de conhecimento privada para o nosso sistema RAG.</p>
<p>Baixe o arquivo de documentação e extraia-o para uma pasta chamada <code translate="no">milvus_docs</code>.</p>
<pre><code translate="no">! wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
! unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs
<button class="copy-code-btn"></button></code></pre>
<p>Carregue todos os ficheiros Markdown a partir do caminho <code translate="no">milvus_docs/en/faq</code>. Para cada documento, aplicamos uma divisão simples com base nos títulos de <code translate="no">#</code> para separar aproximadamente as secções principais de cada ficheiro Markdown.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob
text_lines = []
<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()
    text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="LLM-and-Embedding-Model-Setup" class="common-anchor-header">Configuração do LLM e do modelo de incorporação</h3><p>Para este tutorial, usaremos <code translate="no">gemini-3-pro-preview</code> como o LLM e <code translate="no">text-embedding-004</code> como o modelo de incorporação.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> google.generativeai <span class="hljs-keyword">as</span> genai
genai.configure(api_key=os.environ[<span class="hljs-string">&quot;GEMINI_API_KEY&quot;</span>])
gemini_model = genai.GenerativeModel(<span class="hljs-string">&quot;gemini-3-pro-preview&quot;</span>)
response = gemini_model.generate_content(<span class="hljs-string">&quot;who are you&quot;</span>)
<span class="hljs-built_in">print</span>(response.text)
<button class="copy-code-btn"></button></code></pre>
<p>Resposta do modelo: Eu sou o Gemini, um modelo de linguagem grande criado pelo Google.</p>
<p>Pode fazer uma verificação rápida gerando uma incorporação de teste e imprimindo a sua dimensionalidade juntamente com os primeiros valores:</p>
<pre><code translate="no">test_embeddings = genai.embed_content(
    model=<span class="hljs-string">&quot;models/text-embedding-004&quot;</span>, content=[<span class="hljs-string">&quot;This is a test1&quot;</span>, <span class="hljs-string">&quot;This is a test2&quot;</span>]
)[<span class="hljs-string">&quot;embedding&quot;</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embeddings[<span class="hljs-number">0</span>])
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embeddings[<span class="hljs-number">0</span>][:<span class="hljs-number">10</span>])
<button class="copy-code-btn"></button></code></pre>
<p>Saída do vetor de teste:</p>
<p>768</p>
<p>[0.013588584, -0.004361838, -0.08481652, -0.039724775, 0.04723794, -0.0051557426, 0.026071774, 0.045514572, -0.016867816, 0.039378334]</p>
<h3 id="Loading-Data-into-Milvus" class="common-anchor-header">Carregando dados no Milvus</h3><p><strong>Criar uma coleção</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>
milvus_client = <span class="hljs-title class_">MilvusClient</span>(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)
collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Ao criar uma <code translate="no">MilvusClient</code>, pode escolher entre três opções de configuração, dependendo da sua escala e ambiente:</p>
<ul>
<li><p><strong>Modo Local (Milvus Lite):</strong> Definir o URI para um caminho de ficheiro local (por exemplo, <code translate="no">./milvus.db</code>). Esta é a maneira mais fácil de começar - <a href="https://milvus.io/docs/milvus_lite.md">o Milvus Lite</a> armazenará automaticamente todos os dados nesse ficheiro.</p></li>
<li><p><strong>Milvus auto-hospedado (Docker ou Kubernetes):</strong> Para conjuntos de dados maiores ou cargas de trabalho de produção, execute o Milvus no Docker ou Kubernetes. Defina o URI para o ponto de extremidade do seu servidor Milvus, como <code translate="no">http://localhost:19530</code>.</p></li>
<li><p><strong>Zilliz Cloud (o serviço Milvus totalmente gerido):</strong> Se preferir uma solução gerida, utilize o Zilliz Cloud. Defina o URI para o seu Public Endpoint e forneça a sua chave API como token de autenticação.</p></li>
</ul>
<p>Antes de criar uma nova coleção, verifique primeiro se ela já existe. Se existir, elimine-a e recrie-a para garantir uma configuração limpa.</p>
<pre><code translate="no">if milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)
<button class="copy-code-btn"></button></code></pre>
<p>Crie uma nova coleção com os parâmetros especificados.</p>
<p>Se não for fornecido um esquema, o Milvus gera automaticamente um campo de ID predefinido como chave primária e um campo de vetor para armazenar embeddings. Também fornece um campo dinâmico JSON reservado, que captura quaisquer campos adicionais que não estejam definidos no esquema.</p>
<pre><code translate="no">milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,  <span class="hljs-comment"># Strong consistency level</span>
)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Inserir dados</strong></p>
<p>Itere através de cada entrada de texto, gere o seu vetor de incorporação e insira os dados no Milvus. Neste exemplo, incluímos um campo extra chamado <code translate="no">text</code>. Uma vez que não está pré-definido no esquema, o Milvus armazena-o automaticamente utilizando o campo JSON dinâmico, sem necessidade de qualquer configuração adicional.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm
data = []
doc_embeddings = genai.embed_content(
    model=<span class="hljs-string">&quot;models/text-embedding-004&quot;</span>, content=text_lines
)[<span class="hljs-string">&quot;embedding&quot;</span>]
<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})
milvus_client.insert(collection_name=collection_name, data=data)
<button class="copy-code-btn"></button></code></pre>
<p>Exemplo de saída:</p>
<pre><code translate="no">Creating embeddings: 100%|█████████████████████████| 72/72 [00:00&lt;00:00, 431414.13it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Building-the-RAG-Workflow" class="common-anchor-header">Criação do fluxo de trabalho RAG</h3><p><strong>Recuperar dados relevantes</strong></p>
<p>Para testar a recuperação, fazemos uma pergunta comum sobre o Milvus.</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Pesquise a coleção para a consulta e devolva os 3 principais resultados mais relevantes.</p>
<pre><code translate="no">question_embedding = genai.embed_content(
    model=<span class="hljs-string">&quot;models/text-embedding-004&quot;</span>, content=question
)[<span class="hljs-string">&quot;embedding&quot;</span>]
search_res = milvus_client.search(
    collection_name=collection_name,
    data=[question_embedding],
    limit=<span class="hljs-number">3</span>,  <span class="hljs-comment"># Return top 3 results</span>
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},  <span class="hljs-comment"># Inner product distance</span>
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],  <span class="hljs-comment"># Return the text field</span>
)
<span class="hljs-keyword">import</span> json
retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))
<button class="copy-code-btn"></button></code></pre>
<p>Os resultados são devolvidos por ordem de semelhança, do mais próximo ao menos semelhante.</p>
<pre><code translate="no">[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including [MinIO](
https://min.io/
), [AWS S3](
https://aws.amazon.com/s3/?nc1=h_ls
), [Google Cloud Storage](
https://cloud.google.com/storage?hl=en#object-storage-for-companies-of-all-sizes
) (GCS), [Azure Blob Storage](
https://azure.microsoft.com/en-us/products/storage/blobs
), [Alibaba Cloud OSS](
https://www.alibabacloud.com/product/object-storage-service
), and [Tencent Cloud Object Storage](
https://www.tencentcloud.com/products/cos
) (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        0.8048489093780518
    ],
    [
        <span class="hljs-string">&quot;Does the query perform in memory? What are incremental data and historical data?\n\nYes. When a query request comes, Milvus searches both incremental data and historical data by loading them into memory. Incremental data are in the growing segments, which are buffered in memory before they reach the threshold to be persisted in storage engine, while historical data are from the sealed segments that are stored in the object storage. Incremental data and historical data together constitute the whole dataset to search.\n\n###&quot;</span>,
        0.757495105266571
    ],
    [
        <span class="hljs-string">&quot;What is the maximum dataset size Milvus can handle?\n\n  \nTheoretically, the maximum dataset size Milvus can handle is determined by the hardware it is run on, specifically system memory and storage:\n\n- Milvus loads all specified collections and partitions into memory before running queries. Therefore, memory size determines the maximum amount of data Milvus can query.\n- When new entities and and collection-related schema (currently only MinIO is supported for data persistence) are added to Milvus, system storage determines the maximum allowable size of inserted data.\n\n###&quot;</span>,
        0.7453694343566895
    ]
]
<button class="copy-code-btn"></button></code></pre>
<p><strong>Gerar uma resposta RAG com o LLM</strong></p>
<p>Depois de obter os documentos, converta-os para um formato de cadeia</p>
<pre><code translate="no">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>Fornecer ao LLM uma solicitação do sistema e uma solicitação do utilizador, ambas construídas a partir dos documentos obtidos do Milvus.</p>
<pre><code translate="no">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
Human: You are an AI assistant. You are able to find answers to the questions from the contextual passage snippets provided.
&quot;&quot;&quot;</span>
USER_PROMPT = <span class="hljs-string">f&quot;&quot;&quot;
Use the following pieces of information enclosed in &lt;context&gt; tags to provide an answer to the question enclosed in &lt;question&gt; tags.
&lt;context&gt;
<span class="hljs-subst">{context}</span>
&lt;/context&gt;
&lt;question&gt;
<span class="hljs-subst">{question}</span>
&lt;/question&gt;
&quot;&quot;&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Utilize o modelo <code translate="no">gemini-3-pro-preview</code> juntamente com estas solicitações para gerar a resposta final.</p>
<pre><code translate="no">gemini_model = genai.GenerativeModel(
    <span class="hljs-string">&quot;gemini-3-pro-preview&quot;</span>, system_instruction=SYSTEM_PROMPT
)
response = gemini_model.generate_content(USER_PROMPT)
<span class="hljs-built_in">print</span>(response.text)
<button class="copy-code-btn"></button></code></pre>
<p>A partir do resultado, é possível ver que o Gemini 3 Pro produz uma resposta clara e bem estruturada com base nas informações obtidas.</p>
<pre><code translate="no">Based <span class="hljs-keyword">on</span> the provided documents, Milvus stores data <span class="hljs-keyword">in</span> the following ways:
*   **Inserted Data:** Vector data, scalar data, <span class="hljs-keyword">and</span> collection-specific schema are stored <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> an incremental log. Milvus supports multiple <span class="hljs-built_in">object</span> storage backends <span class="hljs-keyword">for</span> <span class="hljs-keyword">this</span> purpose, including:
    *   MinIO
    *   AWS S3
    *   <span class="hljs-function">Google Cloud <span class="hljs-title">Storage</span> (<span class="hljs-params">GCS</span>)
    *   Azure Blob Storage
    *   Alibaba Cloud OSS
    *   Tencent Cloud Object <span class="hljs-title">Storage</span> (<span class="hljs-params">COS</span>)
*   **Metadata:** Metadata generated within Milvus modules <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> **etcd**.
*   **Memory Buffering:** Incremental <span class="hljs-title">data</span> (<span class="hljs-params">growing segments</span>) are buffered <span class="hljs-keyword">in</span> memory before being persisted, <span class="hljs-keyword">while</span> historical <span class="hljs-title">data</span> (<span class="hljs-params"><span class="hljs-keyword">sealed</span> segments</span>) resides <span class="hljs-keyword">in</span> <span class="hljs-built_in">object</span> storage but <span class="hljs-keyword">is</span> loaded <span class="hljs-keyword">into</span> memory <span class="hljs-keyword">for</span> querying.
</span><button class="copy-code-btn"></button></code></pre>
<p><strong>Nota</strong>: O Gemini 3 Pro não está atualmente disponível para utilizadores de nível gratuito. Clique <a href="https://ai.google.dev/gemini-api/docs/rate-limits#tier-1">aqui</a> para obter mais detalhes.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Gemini_3_Pro1_095925d461.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Gemini_3_Pro2_71ae286cf9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Você pode acessá-lo através do <a href="https://openrouter.ai/google/gemini-3-pro-preview/api">OpenRouter</a>:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
client = OpenAI(
  base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>,
  api_key=<span class="hljs-string">&quot;&lt;OPENROUTER_API_KEY&gt;&quot;</span>,
)
response2 = client.chat.completions.create(
  model=<span class="hljs-string">&quot;google/gemini-3-pro-preview&quot;</span>,
  messages=[
        {
            <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>,
            <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT
        },
        {
            <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, 
            <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT
        }
    ],
  extra_body={<span class="hljs-string">&quot;reasoning&quot;</span>: {<span class="hljs-string">&quot;enabled&quot;</span>: <span class="hljs-literal">True</span>}}
)
response_message = response2.choices[<span class="hljs-number">0</span>].message
<span class="hljs-built_in">print</span>(response_message.content)
<button class="copy-code-btn"></button></code></pre>
<h2 id="One-More-Thing-Vibe-Coding-with-Google-Antigravity" class="common-anchor-header">Mais uma coisa: Vibe Coding com o Google Antigravity<button data-href="#One-More-Thing-Vibe-Coding-with-Google-Antigravity" class="anchor-icon" translate="no">
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
    </button></h2><p>Juntamente com o Gemini 3 Pro, o Google apresentou <a href="https://antigravity.google/"><strong>o Google Antigravity</strong></a>, uma plataforma de codificação de vídeo que interage de forma autónoma com o seu editor, terminal e navegador. Ao contrário das anteriores ferramentas assistidas por IA que tratavam de instruções pontuais, o Antigravity funciona a um nível orientado para as tarefas - permitindo aos programadores especificar <em>o que</em> pretendem construir enquanto o sistema gere o <em>como</em>, orquestrando o fluxo de trabalho completo de ponta a ponta.</p>
<p>Os fluxos de trabalho tradicionais de codificação de IA normalmente geravam trechos isolados que os desenvolvedores ainda tinham que revisar, integrar, depurar e executar manualmente. O Antigravity muda essa dinâmica. Pode simplesmente descrever uma tarefa - por exemplo, <em>"Criar um jogo simples de interação com animais de estimação</em> " - e o sistema decompõe o pedido, gera o código, executa comandos de terminal, abre um browser para testar o resultado e repete até funcionar. Isto eleva a IA de um motor de autocompletar passivo para um parceiro de engenharia ativo - que aprende as suas preferências e se adapta ao seu estilo de desenvolvimento pessoal ao longo do tempo.</p>
<p>Olhando para o futuro, a ideia de um agente que se coordena diretamente com uma base de dados não é rebuscada. Com a chamada de ferramentas através do MCP, uma IA poderia eventualmente ler a partir de uma base de dados Milvus, montar uma base de conhecimentos e até manter o seu próprio pipeline de recuperação de forma autónoma. Em muitos aspectos, esta mudança é ainda mais significativa do que a própria atualização do modelo: uma vez que uma IA pode pegar numa descrição ao nível do produto e convertê-la numa sequência de tarefas executáveis, o esforço humano passa naturalmente para a definição de objectivos, restrições e o que é a "correção" - o pensamento de nível superior que realmente impulsiona o desenvolvimento do produto.</p>
<h2 id="Ready-to-Build" class="common-anchor-header">Pronto para construir?<button data-href="#Ready-to-Build" class="anchor-icon" translate="no">
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
    </button></h2><p>Se estiver pronto para experimentar, siga o nosso tutorial passo a passo e construa um sistema RAG com o <strong>Gemini 3 Pro + Milvus</strong> hoje mesmo.</p>
<p>Tem dúvidas ou quer um mergulho profundo em qualquer recurso? Junte-se ao nosso<a href="https://discord.com/invite/8uyFbECzPX"> canal Discord</a> ou registe problemas no<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Também pode reservar uma sessão individual de 20 minutos para obter informações, orientação e respostas às suas perguntas através do<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
