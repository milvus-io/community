---
id: building-a-production-ready-ai-assistant-with-spring-boot-and-milvus.md
title: >-
  Dos documentos ao diálogo: Construindo um Assistente de IA pronto para
  produção com Spring Boot e Milvus
author: Gong Yi
date: 2025-06-23T00:00:00.000Z
cover: >-
  assets.zilliz.com/From_Docs_to_Dialogue_Building_an_AI_Assistant_with_Spring_and_Milvus_b8a470549a.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus, vector database, vector search, AI search, Spring Boot'
meta_title: |
  Building a Production-Ready AI Assistant with Spring Boot and Milvus
desc: >-
  Combinando Spring Boot, Milvus e Ollama, transformamos documentos empresariais
  estáticos em conversas dinâmicas e sensíveis ao contexto - com total
  observabilidade, memória e segurança incorporadas.
origin: >-
  https://milvus.io/blog/building-a-production-ready-ai-assistant-with-spring-boot-and-milvus.md
---
<p>Todas as empresas têm o mesmo problema: conhecimentos valiosos presos em PDFs, documentos do Word e partilhas de ficheiros que ninguém consegue encontrar quando precisa deles. As equipas de apoio respondem repetidamente às mesmas perguntas, enquanto os programadores perdem horas a procurar em documentação desactualizada.</p>
<p><strong>E se os seus documentos pudessem responder diretamente às perguntas?</strong></p>
<p>Este tutorial mostra como criar um assistente de IA pronto para produção que:</p>
<ul>
<li><p>Transforma seus documentos estáticos em um sistema inteligente de perguntas e respostas</p></li>
<li><p>Mantém o contexto e a memória da conversa</p></li>
<li><p>Escala para lidar com cargas de trabalho corporativas</p></li>
<li><p>Inclui segurança, monitoramento e observabilidade prontos para uso</p></li>
</ul>
<h2 id="What-Well-Build" class="common-anchor-header">O que vamos construir<button data-href="#What-Well-Build" class="anchor-icon" translate="no">
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
    </button></h2><p>Ao final deste tutorial, você terá:</p>
<ul>
<li><p>Um pipeline de ingestão de documentos que processa PDFs e documentos do Word</p></li>
<li><p>Um sistema de pesquisa vetorial alimentado por Milvus para pesquisa semântica</p></li>
<li><p>Uma API de bate-papo com reconhecimento de memória e contexto</p></li>
<li><p>Segurança e monitorização de nível empresarial</p></li>
<li><p>Um exemplo de trabalho completo que pode ser implementado</p></li>
</ul>
<h2 id="Key-Components-We’ll-Use" class="common-anchor-header">Principais componentes que utilizaremos<button data-href="#Key-Components-We’ll-Use" class="anchor-icon" translate="no">
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
<li><p><a href="https://github.com/spring-projects/spring-boot"><strong>O Spring Boot</strong></a> é uma estrutura Java amplamente utilizada para criar aplicativos de back-end com configuração mínima. Ele oferece forte produtividade ao desenvolvedor, integração perfeita com ferramentas modernas e suporte incorporado para APIs REST, observabilidade e segurança.</p></li>
<li><p><a href="https://milvus.io/"><strong>Milvus</strong></a> é uma base de dados vetorial de código aberto, de alto desempenho e nativa da nuvem, concebida para pesquisa semântica. Ele permite armazenar e pesquisar embeddings com latência em escala de milissegundos, mesmo em bilhões de vetores.</p></li>
<li><p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation"><strong>O RAG</strong></a> é uma arquitetura que combina recuperação e geração: ele busca trechos de conhecimento relevantes de um banco de dados vetorial como o Milvus e, em seguida, usa um modelo de linguagem para criar uma resposta contextual fluente.</p></li>
<li><p><a href="https://ollama.com/"><strong>Ollama</strong></a>: Fornecedor local de modelos de IA (compatível com OpenAI, totalmente gratuito)</p></li>
</ul>
<h2 id="Prerequisites" class="common-anchor-header">Pré-requisitos<button data-href="#Prerequisites" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de começar, verifique se você tem:</p>
<ul>
<li><p>Java 17+ instalado</p></li>
<li><p>Docker, Docker Compose</p></li>
<li><p>Git para clonar o repositório de exemplo</p></li>
<li><p>Ollama instalado e em execução localmente</p></li>
<li><p>Milvus (via Docker)</p></li>
<li><p>Spring Boot 3.5.0 + Spring AI 1.0.0</p></li>
<li><p>Micrometer, Testcontainers</p></li>
</ul>
<h2 id="Environment-Setup" class="common-anchor-header">Configuração do ambiente<button data-href="#Environment-Setup" class="anchor-icon" translate="no">
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
    </button></h2><p>Clone o repositório de exemplo/: <a href="https://github.com/topikachu/spring-ai-rag">https://github.com/topikachu/spring-ai-rag</a></p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/topikachu/spring-ai-rag
<span class="hljs-built_in">cd</span> spring-ai-rag
<button class="copy-code-btn"></button></code></pre>
<p>Verifique seu ambiente:</p>
<pre><code translate="no"><span class="hljs-comment"># Verify Docker is running correctly</span>
docker version
docker ps

<span class="hljs-comment"># Verify Java version</span>
java -version

<span class="hljs-comment"># Verify Ollama installation</span>
ollama --version
<button class="copy-code-btn"></button></code></pre>
<p>Descarregar o Ollama Models:</p>
<pre><code translate="no"><span class="hljs-comment"># Pull required models for this project</span>
ollama pull mistral          <span class="hljs-comment"># Chat model</span>
ollama pull nomic-embed-text <span class="hljs-comment"># Embedding model</span>

<span class="hljs-comment"># Verify models are available</span>
ollama <span class="hljs-built_in">list</span>
<button class="copy-code-btn"></button></code></pre>
<p>Configuração de chaves (application.properties)</p>
<pre><code translate="no"><span class="hljs-comment"># Ollama Configuration (OpenAI-compatible API)</span>
spring.ai.openai.base-url=http://localhost:<span class="hljs-number">11434</span>
spring.ai.openai.chat.options.model=mistral
spring.ai.openai.embedding.options.model=nomic-embed-text
spring.ai.openai.embedding.options.dimensions=<span class="hljs-number">768</span>

<span class="hljs-comment"># Vector Store Configuration - dimensions must match embedding model</span>
spring.ai.vectorstore.milvus.embedding-dimension=<span class="hljs-number">768</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Document-ETL-Structuring-Unstructured-Text" class="common-anchor-header">ETL de documentos: Estruturação de texto não estruturado<button data-href="#Document-ETL-Structuring-Unstructured-Text" class="anchor-icon" translate="no">
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
    </button></h2><p>Esta secção percorre o coração do sistema - transformando ficheiros não estruturados em respostas inteligentes e pesquisáveis, utilizando vetor embeddings, indexação Milvus e o pipeline RAG do Spring AI.</p>
<p><strong>Visão geral do fluxo de trabalho:</strong></p>
<ul>
<li><p>Utilizar <code translate="no">TikaDocReader</code> para ler PDFs e ficheiros Word</p></li>
<li><p>Use a divisão baseada em token para dividir os documentos em partes, preservando o contexto</p></li>
<li><p>Gerar embeddings usando o modelo de embedding compatível com OpenAI</p></li>
<li><p>Armazenar os embeddings no Milvus para posterior pesquisa semântica</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/workflow_7e9f990b18.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Exemplo de implementação</p>
<pre><code translate="no">public <span class="hljs-title class_">Flux</span>&lt;<span class="hljs-title class_">Document</span>&gt; <span class="hljs-title function_">ingestionFlux</span>(<span class="hljs-params"></span>) {
  <span class="hljs-keyword">return</span> documentReader.<span class="hljs-title function_">getDocuments</span>()
          .<span class="hljs-title function_">flatMap</span>(<span class="hljs-variable language_">document</span> -&gt; {
            <span class="hljs-keyword">var</span> processChunks = <span class="hljs-title class_">Mono</span>.<span class="hljs-title function_">fromRunnable</span>(() -&gt; {
              <span class="hljs-keyword">var</span> chunks = textSplitter.<span class="hljs-title function_">apply</span>(<span class="hljs-title class_">List</span>.<span class="hljs-title function_">of</span>(<span class="hljs-variable language_">document</span>));
              vectorStore.<span class="hljs-title function_">write</span>(chunks); <span class="hljs-comment">// expensive operation</span>
            }).<span class="hljs-title function_">subscribeOn</span>(<span class="hljs-title class_">Schedulers</span>.<span class="hljs-title function_">boundedElastic</span>());

            <span class="hljs-keyword">return</span> <span class="hljs-title class_">Flux</span>.<span class="hljs-title function_">concat</span>(
                    <span class="hljs-title class_">Flux</span>.<span class="hljs-title function_">just</span>(<span class="hljs-variable language_">document</span>),
                    processChunks.<span class="hljs-title function_">then</span>(<span class="hljs-title class_">Mono</span>.<span class="hljs-title function_">empty</span>())
            );
          })
          .<span class="hljs-title function_">doOnComplete</span>(() -&gt; log.<span class="hljs-title function_">info</span>(<span class="hljs-string">&quot;RunIngestion() finished&quot;</span>))
          .<span class="hljs-title function_">doOnError</span>(e -&gt; log.<span class="hljs-title function_">error</span>(<span class="hljs-string">&quot;Error during ingestion&quot;</span>, e));
}
<button class="copy-code-btn"></button></code></pre>
<h2 id="Vector-Storage-Millisecond-Scale-Semantic-Search-with-Milvus" class="common-anchor-header">Armazenamento de vectores: Pesquisa semântica em escala de milissegundos com Milvus<button data-href="#Vector-Storage-Millisecond-Scale-Semantic-Search-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Exemplo de configuração:</p>
<pre><code translate="no">spring.<span class="hljs-property">ai</span>.<span class="hljs-property">vectorstore</span>.<span class="hljs-property">milvus</span>.<span class="hljs-property">initialize</span>-schema=<span class="hljs-literal">true</span>
spring.<span class="hljs-property">ai</span>.<span class="hljs-property">vectorstore</span>.<span class="hljs-property">milvus</span>.<span class="hljs-property">embedding</span>-dimension=<span class="hljs-number">768</span>
<button class="copy-code-btn"></button></code></pre>
<p>📌 <strong>Exemplo:</strong> Quando um utilizador pergunta &quot;O Spring Boot suporta programação reativa com WebFlux?&quot;, o Milvus devolve segmentos de documentação relacionados e o modelo de IA gera uma resposta em linguagem natural com detalhes de implementação específicos.</p>
<h2 id="Building-a-RAG-Enabled-Chat-Contextual-QA-with-Memory-Integration" class="common-anchor-header">Criar um chat com RAG: Perguntas e respostas contextuais com integração de memória<button data-href="#Building-a-RAG-Enabled-Chat-Contextual-QA-with-Memory-Integration" class="anchor-icon" translate="no">
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
    </button></h2><p>Fluxo de trabalho principal:</p>
<ol>
<li><p>O utilizador submete uma pergunta</p></li>
<li><p>A pesquisa vetorial recupera os segmentos de documentos mais relevantes</p></li>
<li><p>O sistema carrega o contexto de conversas anteriores (via Redis)</p></li>
<li><p>O modelo de IA gera uma resposta que inclui tanto o contexto novo como o histórico</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/build_a_rag_chat_workflow_976dcd9aa2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Exemplo de integração de recuperação + chat de memória:</p>
<pre><code translate="no">public <span class="hljs-title class_">ChatClient</span>.<span class="hljs-property">ChatClientRequestSpec</span> <span class="hljs-title function_">input</span>(<span class="hljs-params"><span class="hljs-built_in">String</span> userInput, <span class="hljs-built_in">String</span> conversationId</span>) {
  <span class="hljs-keyword">return</span> chatClient.<span class="hljs-title function_">prompt</span>()
          .<span class="hljs-title function_">advisors</span>(
                  messageChatMemoryAdvisor,
                  retrievalAugmentationAdvisor
          )
          .<span class="hljs-title function_">advisors</span>(spec -&gt; spec.<span class="hljs-title function_">param</span>(<span class="hljs-variable constant_">CONVERSATION_ID</span>, conversationId))
          .<span class="hljs-title function_">user</span>(userInput);
}
<button class="copy-code-btn"></button></code></pre>
<p>Para uma experiência de front-end mais suave, utilize a API de fluxo reativo para devolver conteúdo <code translate="no">Flux</code> através de eventos enviados pelo servidor (SSE) - ideal para efeitos de "digitação":</p>
<pre><code translate="no">public <span class="hljs-title class_">Flux</span>&lt;<span class="hljs-title class_">String</span>&gt; <span class="hljs-title function_">stream</span>(<span class="hljs-params"><span class="hljs-built_in">String</span> userInput, <span class="hljs-built_in">String</span> conversationId</span>) {
    <span class="hljs-keyword">return</span> <span class="hljs-title function_">input</span>(userInput, conversationId)
            .<span class="hljs-title function_">stream</span>().<span class="hljs-title function_">content</span>();
}
<button class="copy-code-btn"></button></code></pre>
<p>Controlador de API REST:</p>
<pre><code translate="no">@<span class="hljs-title class_">PostMapping</span>(path = <span class="hljs-string">&quot;/chat&quot;</span>, produces = <span class="hljs-title class_">MediaType</span>.<span class="hljs-property">TEXT_EVENT_STREAM_VALUE</span>)
public <span class="hljs-title class_">Flux</span>&lt;<span class="hljs-title class_">String</span>&gt; <span class="hljs-title function_">chat</span>(<span class="hljs-params">@RequestBody ChatRequest chatRequest, @RequestParam() <span class="hljs-built_in">String</span> conversationId, Principal principal</span>) {
  <span class="hljs-keyword">var</span> conversationKey = <span class="hljs-title class_">String</span>.<span class="hljs-title function_">format</span>(<span class="hljs-string">&quot;%s:%s&quot;</span>, principal.<span class="hljs-title function_">getName</span>(), conversationId);
  <span class="hljs-keyword">return</span> chatService.<span class="hljs-title function_">stream</span>(chatRequest.<span class="hljs-property">userInput</span>, conversationKey)
          .<span class="hljs-title function_">doOnError</span>(exp -&gt; log.<span class="hljs-title function_">error</span>(<span class="hljs-string">&quot;Error in chat&quot;</span>, exp));
}
<button class="copy-code-btn"></button></code></pre>
<h2 id="Enterprise-Grade-API-Security-and-System-Observability" class="common-anchor-header">Segurança de API de nível empresarial e observabilidade do sistema<button data-href="#Enterprise-Grade-API-Security-and-System-Observability" class="anchor-icon" translate="no">
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
    </button></h2><p>Esta secção garante que o seu assistente de IA não funciona apenas - é executado de forma segura, é rastreável e funciona com cargas de trabalho reais.</p>
<h3 id="API-Security-Role-Based-Access-Control" class="common-anchor-header">Segurança da API: Controlo de acesso baseado em funções</h3><p><strong>Exemplo: Protegendo pontos de extremidade de administrador</strong></p>
<pre><code translate="no"><span class="hljs-meta">@Override</span>
<span class="hljs-keyword">protected</span> <span class="hljs-keyword">void</span> <span class="hljs-title function_">configure</span><span class="hljs-params">(HttpSecurity http)</span> <span class="hljs-keyword">throws</span> Exception {
    http
        .httpBasic()
        .and()
        .authorizeRequests(authz -&gt; authz
            .antMatchers(<span class="hljs-string">&quot;/api/v1/index&quot;</span>).hasRole(<span class="hljs-string">&quot;ADMIN&quot;</span>)
            .anyRequest().authenticated()
        );
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Dica de produção:</strong> Para implantações no mundo real, use OAuth2 ou JWT para autenticação escalonável.</p>
<h3 id="Observability-Full-Stack-Tracing-and-Metrics" class="common-anchor-header">Observabilidade: Rastreamento e métricas de pilha completa</h3><p><strong>Rastreamento:</strong> Usaremos o JavaAgent do OpenTelemetry para rastrear fluxos de solicitação completos, desde o bate-papo do usuário até a pesquisa do Milvus e a resposta do LLM - incluindo intervalos de gRPC:</p>
<pre><code translate="no">-javaagent:&lt;path/to/opentelemetry-javaagent.jar&gt; \
-Dotel.metrics.exporter=none \
-Dotel.logs.exporter=none
<button class="copy-code-btn"></button></code></pre>
<p><strong>Métricas:</strong> O Micrometer expõe automaticamente métricas compatíveis com o Prometheus:</p>
<ul>
<li>Tempo de resposta do modelo</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># HELP gen_ai_client_operation_seconds  </span>
<span class="hljs-comment"># TYPE gen_ai_client_operation_seconds summary</span>
gen_ai_client_operation_seconds_count{...} <span class="hljs-number">1</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Tempo de recuperação de vetor</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># HELP db_vector_client_operation_seconds</span>
<span class="hljs-comment"># TYPE db_vector_client_operation_seconds summary</span>
db_vector_client_operation_seconds_count{...} <span class="hljs-number">1</span>
<button class="copy-code-btn"></button></code></pre>
<p>Configuração:</p>
<pre><code translate="no">management.endpoints.web.exposure.include=prometheus
<button class="copy-code-btn"></button></code></pre>
<p><strong>Nota técnica:</strong> O Spring Boot 3.2 introduz os iniciadores OTEL, mas eles não cobrem o gRPC (usado pelo Milvus). Para garantir a visibilidade de ponta a ponta, este projeto usa a abordagem JavaAgent.</p>
<h2 id="Running-the-Project-End-to-End-Execution" class="common-anchor-header">Executando o projeto: Execução de ponta a ponta<button data-href="#Running-the-Project-End-to-End-Execution" class="anchor-icon" translate="no">
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
    </button></h2><p>Iniciar o sistema completo</p>
<pre><code translate="no"><span class="hljs-built_in">export</span> OPENAI_API_KEY=dummy
<span class="hljs-built_in">export</span> SPRING_PROFILES_ACTIVE=ollama-openai
ollama pull mistral            <span class="hljs-comment"># Pull chat model</span>
ollama pull nomic-embed-text   <span class="hljs-comment"># Pull embedding model</span>

mvn clean <span class="hljs-built_in">test</span> package
docker compose up -d
java -javaagent:target/otel/opentelemetry-javaagent.jar -Dotel.metrics.exporter=none -Dotel.logs.exporter=none  -Dinput.directory=<span class="hljs-variable">$PWD</span>/src/test/resources/corpus  -jar target/rag-0.0.1-SNAPSHOT.jar

curl --location <span class="hljs-string">&#x27;localhost:8080/api/v1/index&#x27;</span> \
--user <span class="hljs-string">&quot;admin:password&quot;</span> \
--header <span class="hljs-string">&#x27;Content-Type: application/json&#x27;</span> \
--data <span class="hljs-string">&#x27;{}&#x27;</span>

curl --location <span class="hljs-string">&#x27;localhost:8080/api/v1/chat?conversationId=flat&#x27;</span> \
--header <span class="hljs-string">&#x27;Content-Type: application/json&#x27;</span> \
--user <span class="hljs-string">&quot;user:password&quot;</span> \
--data <span class="hljs-string">&#x27;{
    &quot;userInput&quot;: &quot;Does milvus support FLAT type index?&quot;
}&#x27;</span>

curl --location <span class="hljs-string">&#x27;localhost:8080/api/v1/chat?conversationId=flat&#x27;</span> \
--header <span class="hljs-string">&#x27;Content-Type: application/json&#x27;</span> \
--user <span class="hljs-string">&quot;user:password&quot;</span> \
--data <span class="hljs-string">&#x27;{
    &quot;userInput&quot;: &quot;When shall I use this index type?&quot;
}&#x27;</span>

curl --location <span class="hljs-string">&#x27;localhost:8080/api/v1/chat?conversationId=hnsw&#x27;</span> \
--header <span class="hljs-string">&#x27;Content-Type: application/json&#x27;</span> \
--user <span class="hljs-string">&quot;user:password&quot;</span> \
--data <span class="hljs-string">&#x27;{
    &quot;userInput&quot;: &quot;Does milvus support HNSW type index?&quot;
}&#x27;</span>

curl --location <span class="hljs-string">&#x27;localhost:8080/api/v1/chat?conversationId=hnsw&#x27;</span> \
--header <span class="hljs-string">&#x27;Content-Type: application/json&#x27;</span> \
--user <span class="hljs-string">&quot;user:password&quot;</span> \
--data <span class="hljs-string">&#x27;{
    &quot;userInput&quot;: &quot;When shall I use this index type?&quot;
}&#x27;</span>

curl <span class="hljs-string">&quot;http://localhost:8080/actuator/prometheus&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Para exibir a interface do usuário de rastreamento, abra<a href="http://localhost:16686/"> http://localhost:16686/</a></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/To_view_tracing_UI_686e8f54b9.png" alt="" class="doc-image" id="" />
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
    </button></h2><p>Agora você tem um assistente de IA pronto para produção que transforma documentos estáticos em conversas inteligentes. O sistema inclui:</p>
<p>✅ <strong>Processamento de documentos</strong>: Ingestão e vectorização automatizadas <strong>✅ Pesquisa semântica</strong>: Recuperação rápida e exacta com Milvus ✅ <strong>Memória de conversação</strong>: Experiências de conversação sensíveis ao contexto ✅ <strong>Segurança empresarial</strong>: Autenticação e controlo de acesso</p>
<p><strong>Observabilidade total</strong>: Monitorização, rastreio e métricas</p>
<p>Ao combinar o Spring Boot, o Milvus e o Ollama, transformamos documentos empresariais estáticos em conversas dinâmicas e sensíveis ao contexto - com total observabilidade, memória e segurança incorporadas.</p>
<p>Quer esteja a construir copilotos internos, assistentes específicos de um domínio ou bots de apoio ao cliente, esta arquitetura foi concebida para escalar a sua carga de trabalho e mantê-lo no controlo dos seus dados.</p>
<p>Curioso sobre o que o Milvus pode fazer pela sua pilha de IA? Explore o<a href="https://milvus.io"> projeto de código aberto Milvus</a>, experimente<a href="https://zilliz.com"> o Milvus gerido (Zilliz Cloud</a>) para uma experiência sem complicações ou junte-se ao nosso <a href="https://discord.com/invite/8uyFbECzPX">canal Discord</a> para mais guias práticos como este.</p>
