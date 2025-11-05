---
id: drag-drop-and-deploy-how-to-build-rag-workflows-with-langflow-and-milvus.md
title: >-
  Arrastar, largar e implementar: Como criar fluxos de trabalho RAG com Langflow
  e Milvus
author: Min Yin
date: 2025-10-30T00:00:00.000Z
cover: assets.zilliz.com/langflow_milvus_cover_9f75a11f90.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Langflow, Milvus, RAG, AI workflow'
meta_title: 'Drag, Drop, and Deploy RAG Workflows with Langflow & Milvus'
desc: >-
  Saiba como criar fluxos de trabalho RAG visuais utilizando o Langflow e o
  Milvus. Arraste, largue e implemente aplicações de IA sensíveis ao contexto em
  minutos, sem necessidade de codificação.
origin: >-
  https://milvus.io/blog/drag-drop-and-deploy-how-to-build-rag-workflows-with-langflow-and-milvus.md
---
<p>Construir um fluxo de trabalho de IA muitas vezes parece mais difícil do que deveria. Entre escrever código cola, depurar chamadas de API e gerir pipelines de dados, o processo pode consumir horas antes mesmo de ver resultados. <a href="https://www.langflow.org/"><strong>O Langflow</strong></a> e <a href="https://milvus.io/"><strong>o Milvus</strong></a> simplificam drasticamente este processo, proporcionando-lhe uma forma simples de conceber, testar e implementar fluxos de trabalho de geração aumentada de recuperação (RAG) em minutos, não em dias.</p>
<p><strong>O Langflow</strong> oferece uma interface limpa, de arrastar e largar, que se assemelha mais a esboçar ideias num quadro branco do que a codificar. Pode ligar visualmente modelos linguísticos, fontes de dados e ferramentas externas para definir a lógica do seu fluxo de trabalho - tudo isto sem tocar numa linha de código padrão.</p>
<p>Em conjunto com o <strong>Milvus</strong>, a base de dados vetorial de código aberto que dá aos LLMs memória de longo prazo e compreensão contextual, os dois formam um ambiente completo para RAG de nível de produção. O Milvus armazena e recupera de forma eficiente os embeddings dos dados da sua empresa ou de um domínio específico, permitindo que os LLMs gerem respostas fundamentadas, precisas e contextualizadas.</p>
<p>Neste guia, vamos explicar como combinar o Langflow e o Milvus para criar um fluxo de trabalho RAG avançado - tudo através de alguns arrastamentos, largadas e cliques.</p>
<h2 id="What-is-Langflow" class="common-anchor-header">O que é o Langflow?<button data-href="#What-is-Langflow" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de passarmos à demonstração do RAG, vamos saber o que é o Langflow e o que pode fazer.</p>
<p>O Langflow é uma estrutura de código aberto, baseada em Python, que facilita a criação e a experimentação de aplicações de IA. Suporta capacidades chave de IA, tais como agentes e o Protocolo de Contexto de Modelo (MCP), dando aos programadores e não programadores uma base flexível para a criação de sistemas inteligentes.</p>
<p>No seu núcleo, o Langflow fornece um editor visual. Pode arrastar, largar e ligar diferentes recursos para conceber aplicações completas que combinam modelos, ferramentas e fontes de dados. Quando exporta um fluxo de trabalho, o Langflow gera automaticamente um ficheiro com o nome <code translate="no">FLOW_NAME.json</code> na sua máquina local. Este ficheiro regista todos os nós, arestas e metadados que descrevem o seu fluxo, permitindo-lhe controlar a versão, partilhar e reproduzir projectos facilmente entre equipas.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Langflow_s_visual_editor_cd553ad4ad.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Nos bastidores, um mecanismo de tempo de execução baseado em Python executa o fluxo. Ele orquestra LLMs, ferramentas, módulos de recuperação e lógica de roteamento - gerenciando o fluxo de dados, o estado e o tratamento de erros para garantir uma execução suave do início ao fim.</p>
<p>O Langflow também inclui uma rica biblioteca de componentes com adaptadores pré-construídos para LLMs e bancos de dados vetoriais populares - incluindo <a href="https://milvus.io/">o Milvus</a>. É possível estender isso ainda mais criando componentes Python personalizados para casos de uso especializados. Para testar e otimizar, o Langflow oferece execução passo-a-passo, um Playground para testes rápidos e integrações com o LangSmith e o Langfuse para monitorizar, depurar e reproduzir fluxos de trabalho de ponta a ponta.</p>
<h2 id="Hands-on-Demo-How-to-Build-a-RAG-Workflow-with-Langflow-and-Milvus" class="common-anchor-header">Demonstração prática: Como criar um fluxo de trabalho RAG com o Langflow e o Milvus<button data-href="#Hands-on-Demo-How-to-Build-a-RAG-Workflow-with-Langflow-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Com base na arquitetura do Langflow, o Milvus pode servir como base de dados vetorial que gere os embeddings e recupera dados de empresas privadas ou conhecimentos específicos do domínio.</p>
<p>Nesta demonstração, usaremos o modelo Vetor Store RAG do Langflow para demonstrar como integrar o Milvus e criar um índice vetorial a partir de dados locais, permitindo uma resposta eficiente e contextualizada a perguntas.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_processing_flow_289a9376c9.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Prerequisites" class="common-anchor-header">Pré-requisitos：</h3><p>1.Python 3.11 (ou Conda)</p>
<p>2. uv</p>
<p>3.Docker e Docker Compose</p>
<p>4. chave OpenAI</p>
<h3 id="Step-1-Deploy-Milvus-Vector-Database" class="common-anchor-header">Passo 1. Implementar a base de dados vetorial Milvus</h3><p>Descarregar os ficheiros de implementação.</p>
<pre><code translate="no">wget &lt;https://github.com/Milvus-io/Milvus/releases/download/v2.5.12/Milvus-standalone-docker-compose.yml&gt; -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<p>Inicie o serviço Milvus.</p>
<pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/start_milvus_service_860353ed55.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Create-a-Python-Virtual-Environment" class="common-anchor-header">Passo 2. Criar um ambiente virtual Python</h3><pre><code translate="no">conda create -n langflow
<span class="hljs-comment"># activate langflow and launch it</span>
conda activate langflow
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Install-the-Latest-Packages" class="common-anchor-header">Passo 3. Instalar os pacotes mais recentes</h3><pre><code translate="no">pip install langflow -U
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Launch-Langflow" class="common-anchor-header">Passo 4. Inicie o Langflow</h3><pre><code translate="no">uv run langflow run
<button class="copy-code-btn"></button></code></pre>
<p>Visite o Langflow.</p>
<pre><code translate="no">&lt;<span class="hljs-attr">http</span>:<span class="hljs-comment">//127.0.0.1:7860&gt;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-5-Configure-the-RAG-Template" class="common-anchor-header">Etapa 5. Configurar o modelo de RAG</h3><p>Selecione o modelo RAG do Armazém de Vectores no Langflow.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/rag1_fcb0d1c3c5.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/rag2_f750e10a41.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Escolha Milvus como a sua base de dados de vectores predefinida.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb_milvus_925c6ce846.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>No painel esquerdo, procure "Milvus" e adicione-o ao seu fluxo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/add_milvus1_862d14d0d0.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/add_milvus2_4e3d6aacda.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Configure os detalhes de ligação do Milvus. Deixe as outras opções como padrão por enquanto.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/connect1_a27d3e4f43.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/connect2_d8421c1525.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Adicione a sua chave de API OpenAI ao nó relevante.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/openai_key_7a6596868c.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/openai_key2_4753bfb4d0.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-6-Prepare-Test-Data" class="common-anchor-header">Passo 6. Preparar dados de teste</h3><p>Nota: Use o FAQ oficial do Milvus 2.6 como dados de teste.</p>
<pre><code translate="no">https://github.com/milvus-io/milvus-docs/blob/v2.6.x/site/en/faq/product_faq.md
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-7-Phase-One-Testing" class="common-anchor-header">Passo 7. Primeira fase de testes</h3><p>Carregue o seu conjunto de dados e introduza-o no Milvus. Nota: O Langflow converte então o seu texto em representações vectoriais. É necessário carregar pelo menos dois conjuntos de dados, ou o processo de incorporação falhará. Este é um erro conhecido na atual implementação de nós do Langflow.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ingest_7b804d870a.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ingest2_fc7f1e4d9a.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Verifique o estado dos seus nós.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test_48e02d48ca.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-8-Phase-Two-Testing" class="common-anchor-header">Passo 8. Fase dois de testes</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ingest_7b804d870a.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-9-Run-the-Full-RAG-Workflow" class="common-anchor-header">Etapa 9. Executar o fluxo de trabalho completo do RAG</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/full_flow1_5b4f4962f5.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/full_flow2_535c722a3d.webp" alt="" class="doc-image" id="" />
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
    </button></h2><p>A criação de fluxos de trabalho de IA não precisa de ser complicada. O Langflow + Milvus torna-o rápido, visual e com pouco código - uma forma simples de melhorar o RAG sem grande esforço de engenharia.</p>
<p>A interface de arrastar e largar do Langflow torna-o uma escolha adequada para o ensino, workshops ou demonstrações ao vivo, onde é necessário demonstrar como funcionam os sistemas de IA de uma forma clara e interactiva. Para as equipas que procuram integrar a conceção intuitiva do fluxo de trabalho com a recuperação de vectores de nível empresarial, a combinação da simplicidade do Langflow com a pesquisa de elevado desempenho do Milvus proporciona flexibilidade e potência.</p>
<p>Comece hoje mesmo a criar fluxos de trabalho RAG mais inteligentes com o <a href="https://milvus.io/">Milvus</a>.</p>
<p>Tem dúvidas ou quer um mergulho profundo em qualquer recurso? Junte-se ao nosso<a href="https://discord.com/invite/8uyFbECzPX"> canal Discord</a> ou arquive problemas no<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Você também pode reservar uma sessão individual de 20 minutos para obter insights, orientações e respostas às suas perguntas através do<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
