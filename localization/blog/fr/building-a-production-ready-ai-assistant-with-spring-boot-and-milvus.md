---
id: building-a-production-ready-ai-assistant-with-spring-boot-and-milvus.md
title: >-
  Des documents au dialogue : Construire un assistant IA prêt pour la production
  avec Spring Boot et Milvus
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
  En combinant Spring Boot, Milvus et Ollama, nous transformons des documents
  d'entreprise statiques en conversations dynamiques et contextuelles, avec une
  observabilité, une mémoire et une sécurité complètes.
origin: >-
  https://milvus.io/blog/building-a-production-ready-ai-assistant-with-spring-boot-and-milvus.md
---
<p>Toutes les entreprises sont confrontées au même problème : des connaissances précieuses piégées dans des PDF, des documents Word et des fichiers partagés que personne ne peut trouver lorsqu'il en a besoin. Les équipes d'assistance répondent sans cesse aux mêmes questions, tandis que les développeurs perdent des heures à chercher dans une documentation obsolète.</p>
<p><strong>Et si vos documents pouvaient répondre directement aux questions ?</strong></p>
<p>Ce didacticiel vous montre comment créer un assistant d'IA prêt à être mis en production :</p>
<ul>
<li><p>transforme vos documents statiques en un système intelligent de questions-réponses</p></li>
<li><p>conserve le contexte et la mémoire de la conversation</p></li>
<li><p>S'adapte aux charges de travail des entreprises</p></li>
<li><p>Inclut la sécurité, la surveillance et l'observabilité dès le départ.</p></li>
</ul>
<h2 id="What-Well-Build" class="common-anchor-header">Ce que nous allons construire<button data-href="#What-Well-Build" class="anchor-icon" translate="no">
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
    </button></h2><p>À la fin de ce tutoriel, vous aurez :</p>
<ul>
<li><p>Un pipeline d'ingestion de documents qui traite les PDF et les documents Word</p></li>
<li><p>Un système de recherche vectorielle alimenté par Milvus pour la recherche sémantique</p></li>
<li><p>Une API de chat avec mémoire et prise en compte du contexte</p></li>
<li><p>Une sécurité et une surveillance de niveau entreprise</p></li>
<li><p>Un exemple de travail complet que vous pouvez déployer</p></li>
</ul>
<h2 id="Key-Components-We’ll-Use" class="common-anchor-header">Composants clés que nous utiliserons<button data-href="#Key-Components-We’ll-Use" class="anchor-icon" translate="no">
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
<li><p><a href="https://github.com/spring-projects/spring-boot"><strong>Spring Boot</strong></a> est un framework Java largement utilisé pour construire des applications backend avec une configuration minimale. Il offre une forte productivité aux développeurs, une intégration transparente avec des outils modernes et une prise en charge intégrée des API REST, de l'observabilité et de la sécurité.</p></li>
<li><p><a href="https://milvus.io/"><strong>Milvus</strong></a> est une base de données vectorielle open-source, performante et cloud-native conçue pour la recherche sémantique. Elle vous permet de stocker et de rechercher des embeddings avec une latence de l'ordre de la milliseconde, même sur des milliards de vecteurs.</p></li>
<li><p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation"><strong>RAG</strong></a> est une architecture qui combine la recherche et la génération : elle récupère des extraits de connaissances pertinentes dans une base de données vectorielle comme Milvus, puis utilise un modèle de langage pour élaborer une réponse fluide et contextuelle.</p></li>
<li><p><a href="https://ollama.com/"><strong>Ollama</strong></a>: Fournisseur local de modèles d'IA (compatible avec OpenAI, entièrement gratuit)</p></li>
</ul>
<h2 id="Prerequisites" class="common-anchor-header">Conditions préalables<button data-href="#Prerequisites" class="anchor-icon" translate="no">
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
    </button></h2><p>Avant de commencer, assurez-vous d'avoir</p>
<ul>
<li><p>Java 17+ installé</p></li>
<li><p>Docker, Docker Compose</p></li>
<li><p>Git pour cloner le dépôt d'exemple</p></li>
<li><p>Ollama installé et fonctionnant localement</p></li>
<li><p>Milvus (via Docker)</p></li>
<li><p>Spring Boot 3.5.0 + Spring AI 1.0.0</p></li>
<li><p>Micrometer, Testcontainers</p></li>
</ul>
<h2 id="Environment-Setup" class="common-anchor-header">Configuration de l'environnement<button data-href="#Environment-Setup" class="anchor-icon" translate="no">
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
    </button></h2><p>Clonez le dépôt d'exemple/ <a href="https://github.com/topikachu/spring-ai-rag">: https://github.com/topikachu/spring-ai-rag</a></p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/topikachu/spring-ai-rag
<span class="hljs-built_in">cd</span> spring-ai-rag
<button class="copy-code-btn"></button></code></pre>
<p>Vérifiez votre environnement :</p>
<pre><code translate="no"><span class="hljs-comment"># Verify Docker is running correctly</span>
docker version
docker ps

<span class="hljs-comment"># Verify Java version</span>
java -version

<span class="hljs-comment"># Verify Ollama installation</span>
ollama --version
<button class="copy-code-btn"></button></code></pre>
<p>Télécharger les modèles Ollama :</p>
<pre><code translate="no"><span class="hljs-comment"># Pull required models for this project</span>
ollama pull mistral          <span class="hljs-comment"># Chat model</span>
ollama pull nomic-embed-text <span class="hljs-comment"># Embedding model</span>

<span class="hljs-comment"># Verify models are available</span>
ollama <span class="hljs-built_in">list</span>
<button class="copy-code-btn"></button></code></pre>
<p>Configuration des clés (application.properties)</p>
<pre><code translate="no"><span class="hljs-comment"># Ollama Configuration (OpenAI-compatible API)</span>
spring.ai.openai.base-url=http://localhost:<span class="hljs-number">11434</span>
spring.ai.openai.chat.options.model=mistral
spring.ai.openai.embedding.options.model=nomic-embed-text
spring.ai.openai.embedding.options.dimensions=<span class="hljs-number">768</span>

<span class="hljs-comment"># Vector Store Configuration - dimensions must match embedding model</span>
spring.ai.vectorstore.milvus.embedding-dimension=<span class="hljs-number">768</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Document-ETL-Structuring-Unstructured-Text" class="common-anchor-header">ETL de documents : Structurer du texte non structuré<button data-href="#Document-ETL-Structuring-Unstructured-Text" class="anchor-icon" translate="no">
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
    </button></h2><p>Cette section présente le cœur du système : la transformation de fichiers non structurés en réponses intelligentes et consultables à l'aide de vector embeddings, de l'indexation Milvus et du pipeline RAG de Spring AI.</p>
<p><strong>Aperçu du flux de travail :</strong></p>
<ul>
<li><p>Utilisation de <code translate="no">TikaDocReader</code> pour lire les fichiers PDF et Word</p></li>
<li><p>Utilisation d'un découpage basé sur les jetons pour fragmenter les documents tout en préservant le contexte.</p></li>
<li><p>Générer des embeddings en utilisant le modèle d'embedding compatible avec OpenAI</p></li>
<li><p>Stocker les embeddings dans Milvus pour une recherche sémantique ultérieure.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/workflow_7e9f990b18.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Exemple de mise en œuvre</p>
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
<h2 id="Vector-Storage-Millisecond-Scale-Semantic-Search-with-Milvus" class="common-anchor-header">Stockage vectoriel : Recherche sémantique à l'échelle de la milliseconde avec Milvus<button data-href="#Vector-Storage-Millisecond-Scale-Semantic-Search-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Exemple de configuration :</p>
<pre><code translate="no">spring.<span class="hljs-property">ai</span>.<span class="hljs-property">vectorstore</span>.<span class="hljs-property">milvus</span>.<span class="hljs-property">initialize</span>-schema=<span class="hljs-literal">true</span>
spring.<span class="hljs-property">ai</span>.<span class="hljs-property">vectorstore</span>.<span class="hljs-property">milvus</span>.<span class="hljs-property">embedding</span>-dimension=<span class="hljs-number">768</span>
<button class="copy-code-btn"></button></code></pre>
<p>📌 <strong>Exemple :</strong> Lorsqu'un utilisateur demande &quot;Spring Boot prend-il en charge la programmation réactive avec WebFlux ?&quot;, Milvus renvoie des segments de documentation connexes et le modèle d'IA génère une réponse en langage naturel avec des détails de mise en œuvre spécifiques.</p>
<h2 id="Building-a-RAG-Enabled-Chat-Contextual-QA-with-Memory-Integration" class="common-anchor-header">Construction d'un chat compatible avec RAG : Questions et réponses contextuelles avec intégration de la mémoire<button data-href="#Building-a-RAG-Enabled-Chat-Contextual-QA-with-Memory-Integration" class="anchor-icon" translate="no">
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
    </button></h2><p>Flux de travail principal :</p>
<ol>
<li><p>L'utilisateur soumet une question</p></li>
<li><p>La recherche vectorielle récupère les morceaux de documents les plus pertinents.</p></li>
<li><p>Le système charge le contexte des conversations passées (via Redis).</p></li>
<li><p>Le modèle d'IA génère une réponse qui inclut à la fois le nouveau contexte et le contexte historique.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/build_a_rag_chat_workflow_976dcd9aa2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Exemple d'intégration entre la recherche et le chat en mémoire :</p>
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
<p>Pour une expérience frontale plus fluide, utilisez l'API de flux réactif pour renvoyer le contenu <code translate="no">Flux</code> via des événements envoyés par le serveur (SSE) - idéal pour les effets de "frappe" :</p>
<pre><code translate="no">public <span class="hljs-title class_">Flux</span>&lt;<span class="hljs-title class_">String</span>&gt; <span class="hljs-title function_">stream</span>(<span class="hljs-params"><span class="hljs-built_in">String</span> userInput, <span class="hljs-built_in">String</span> conversationId</span>) {
    <span class="hljs-keyword">return</span> <span class="hljs-title function_">input</span>(userInput, conversationId)
            .<span class="hljs-title function_">stream</span>().<span class="hljs-title function_">content</span>();
}
<button class="copy-code-btn"></button></code></pre>
<p>Contrôleur d'API REST :</p>
<pre><code translate="no">@<span class="hljs-title class_">PostMapping</span>(path = <span class="hljs-string">&quot;/chat&quot;</span>, produces = <span class="hljs-title class_">MediaType</span>.<span class="hljs-property">TEXT_EVENT_STREAM_VALUE</span>)
public <span class="hljs-title class_">Flux</span>&lt;<span class="hljs-title class_">String</span>&gt; <span class="hljs-title function_">chat</span>(<span class="hljs-params">@RequestBody ChatRequest chatRequest, @RequestParam() <span class="hljs-built_in">String</span> conversationId, Principal principal</span>) {
  <span class="hljs-keyword">var</span> conversationKey = <span class="hljs-title class_">String</span>.<span class="hljs-title function_">format</span>(<span class="hljs-string">&quot;%s:%s&quot;</span>, principal.<span class="hljs-title function_">getName</span>(), conversationId);
  <span class="hljs-keyword">return</span> chatService.<span class="hljs-title function_">stream</span>(chatRequest.<span class="hljs-property">userInput</span>, conversationKey)
          .<span class="hljs-title function_">doOnError</span>(exp -&gt; log.<span class="hljs-title function_">error</span>(<span class="hljs-string">&quot;Error in chat&quot;</span>, exp));
}
<button class="copy-code-btn"></button></code></pre>
<h2 id="Enterprise-Grade-API-Security-and-System-Observability" class="common-anchor-header">Sécurité de l'API de niveau entreprise et observabilité du système<button data-href="#Enterprise-Grade-API-Security-and-System-Observability" class="anchor-icon" translate="no">
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
    </button></h2><p>Cette section garantit que votre assistant d'intelligence artificielle ne se contente pas de fonctionner, mais qu'il s'exécute en toute sécurité, qu'il est traçable et qu'il fonctionne dans des charges de travail réelles.</p>
<h3 id="API-Security-Role-Based-Access-Control" class="common-anchor-header">Sécurité de l'API : Contrôle d'accès basé sur les rôles</h3><p><strong>Exemple : Sécurisation des points d'extrémité d'administration</strong></p>
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
<p>💡 <strong>Conseil de production :</strong> Pour les déploiements dans le monde réel, utilisez OAuth2 ou JWT pour une authentification évolutive.</p>
<h3 id="Observability-Full-Stack-Tracing-and-Metrics" class="common-anchor-header">Observabilité : Traçage de la pile complète et mesures</h3><p><strong>Traçage :</strong> Nous utiliserons OpenTelemetry JavaAgent pour tracer les flux de requêtes complets depuis le chat utilisateur jusqu'à la recherche Milvus et la réponse LLM, y compris les portées gRPC :</p>
<pre><code translate="no">-javaagent:&lt;path/to/opentelemetry-javaagent.jar&gt; \
-Dotel.metrics.exporter=none \
-Dotel.logs.exporter=none
<button class="copy-code-btn"></button></code></pre>
<p><strong>Mesures :</strong> Micrometer expose automatiquement des métriques adaptées à Prometheus :</p>
<ul>
<li>Temps de réponse du modèle</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># HELP gen_ai_client_operation_seconds  </span>
<span class="hljs-comment"># TYPE gen_ai_client_operation_seconds summary</span>
gen_ai_client_operation_seconds_count{...} <span class="hljs-number">1</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Temps de récupération du vecteur</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># HELP db_vector_client_operation_seconds</span>
<span class="hljs-comment"># TYPE db_vector_client_operation_seconds summary</span>
db_vector_client_operation_seconds_count{...} <span class="hljs-number">1</span>
<button class="copy-code-btn"></button></code></pre>
<p>Configuration :</p>
<pre><code translate="no">management.endpoints.web.exposure.include=prometheus
<button class="copy-code-btn"></button></code></pre>
<p>💡 <strong>Note technique :</strong> Spring Boot 3.2 introduit les starters OTEL, mais ils ne couvrent pas gRPC (utilisé par Milvus). Pour assurer une visibilité de bout en bout, ce projet utilise l'approche JavaAgent.</p>
<h2 id="Running-the-Project-End-to-End-Execution" class="common-anchor-header">Exécution du projet : Exécution de bout en bout<button data-href="#Running-the-Project-End-to-End-Execution" class="anchor-icon" translate="no">
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
    </button></h2><p>Démarrer le système complet</p>
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
<p>Pour visualiser l'interface utilisateur de traçage, ouvrir<a href="http://localhost:16686/"> http://localhost:16686/</a></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/To_view_tracing_UI_686e8f54b9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Conclusion" class="common-anchor-header">Conclusion<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Vous disposez maintenant d'un assistant IA prêt à produire qui transforme les documents statiques en conversations intelligentes. Le système comprend :</p>
<p>✅ <strong>Traitement des documents</strong>: Ingestion et vectorisation automatisées <strong>✅ Recherche sémantique</strong>: Recherche rapide et précise avec Milvus ✅ <strong>Mémoire des conversations</strong>: Expériences de chat tenant compte du contexte ✅ <strong>Sécurité d'entreprise</strong>: Authentification et contrôle d'accès</p>
<p><strong>Observabilité totale</strong>: Surveillance, traçage et métriques</p>
<p>En combinant Spring Boot, Milvus et Ollama, nous transformons les documents d'entreprise statiques en conversations dynamiques et contextuelles, avec une observabilité totale, une mémoire et une sécurité intégrées.</p>
<p>Que vous construisiez des copilotes internes, des assistants spécifiques à un domaine ou des robots d'assistance en contact avec la clientèle, cette architecture est conçue pour faire évoluer votre charge de travail et vous permettre de garder le contrôle de vos données.</p>
<p>Curieux de savoir ce que Milvus peut faire pour votre pile d'IA ? Explorez le<a href="https://milvus.io"> projet open-source Milvus</a>, essayez<a href="https://zilliz.com"> Milvus géré (Zilliz Cloud</a>) pour une expérience sans tracas, ou rejoignez notre <a href="https://discord.com/invite/8uyFbECzPX">canal Discord</a> pour d'autres guides pratiques comme celui-ci.</p>
