---
id: introducing-milvus-lite.md
title: 'Apresentando o Milvus Lite: Comece a criar uma aplicação GenAI em segundos'
author: Jiang Chen
date: 2024-05-30T00:00:00.000Z
cover: assets.zilliz.com/introducing_Milvus_Lite_76ed4baf75.jpeg
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  GenAI developers, Retrieval Augmented Generation, RAG
recommend: true
canonicalUrl: 'https://milvus.io/blog/introducing-milvus-lite.md'
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_72e444c8dc.JPG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Temos o prazer de apresentar <a href="https://milvus.io/docs/milvus_lite.md">o Milvus Lite</a>, um banco de dados vetorial leve que roda localmente dentro de seu aplicativo Python. Baseado no popular banco de dados vetorial de código aberto <a href="https://milvus.io/intro">Milvus</a>, o Milvus Lite reutiliza os componentes principais para indexação vetorial e análise de consultas, enquanto remove elementos projetados para alta escalabilidade em sistemas distribuídos. Este design torna a solução compacta e eficiente ideal para ambientes com recursos de computação limitados, como laptops, Jupyter Notebooks e dispositivos móveis ou de ponta.</p>
<p>O Milvus Lite integra-se com várias pilhas de desenvolvimento de IA, como LangChain e LlamaIndex, permitindo a sua utilização como um armazenamento de vectores em pipelines RAG (Retrieval Augmented Generation) sem a necessidade de configuração do servidor. Basta executar <code translate="no">pip install pymilvus</code> (versão 2.4.3 ou superior) para o incorporar na sua aplicação de IA como uma biblioteca Python.</p>
<p>O Milvus Lite compartilha a API do Milvus, garantindo que seu código do lado do cliente funcione tanto para implantações locais de pequena escala quanto para servidores Milvus implantados no Docker ou Kubernetes com bilhões de vetores.</p>
<h2 id="Why-We-Built-Milvus-Lite" class="common-anchor-header">Por que criamos o Milvus Lite<button data-href="#Why-We-Built-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>Muitas aplicações de IA requerem pesquisa de similaridade de vetores para dados não estruturados, incluindo texto, imagens, vozes e vídeos, para aplicações como chatbots e assistentes de compras. Os bancos de dados vetoriais são criados para armazenar e pesquisar embeddings vetoriais e são uma parte crucial da pilha de desenvolvimento de IA, particularmente para casos de uso de IA generativa, como <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Retrieval Augmented Generation (RAG)</a>.</p>
<p>Apesar da disponibilidade de inúmeras soluções de pesquisa de vectores, faltava uma opção fácil de iniciar que também funcionasse para implementações de produção em grande escala. Como criadores do Milvus, projetamos o Milvus Lite para ajudar os desenvolvedores de IA a criar aplicativos mais rapidamente, garantindo uma experiência consistente em várias opções de implantação, incluindo Milvus no Kubernetes, Docker e serviços de nuvem gerenciados.</p>
<p>O Milvus Lite é uma adição crucial ao nosso conjunto de ofertas no ecossistema Milvus. Ele fornece aos desenvolvedores uma ferramenta versátil que suporta todas as etapas de sua jornada de desenvolvimento. Desde a prototipagem até aos ambientes de produção e desde a computação periférica até às implementações em grande escala, o Milvus é agora a única base de dados vetorial que abrange casos de utilização de qualquer dimensão e em todas as fases de desenvolvimento.</p>
<h2 id="How-Milvus-Lite-Works" class="common-anchor-header">Como funciona o Milvus Lite<button data-href="#How-Milvus-Lite-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus Lite suporta todas as operações básicas disponíveis no Milvus, como a criação de colecções e a inserção, pesquisa e eliminação de vectores. Em breve, ele suportará recursos avançados como a pesquisa híbrida. O Milvus Lite carrega dados na memória para pesquisas eficientes e persiste-os como um ficheiro SQLite.</p>
<p>O Milvus Lite está incluído no <a href="https://github.com/milvus-io/pymilvus">Python SDK do Milvus</a> e pode ser implementado com um simples <code translate="no">pip install pymilvus</code>. O seguinte trecho de código demonstra como configurar uma base de dados vetorial com o Milvus Lite, especificando um nome de ficheiro local e criando depois uma nova coleção. Para quem está familiarizado com a API Milvus, a única diferença é que <code translate="no">uri</code> se refere a um nome de ficheiro local em vez de um ponto final de rede, por exemplo, <code translate="no">&quot;milvus_demo.db&quot;</code> em vez de <code translate="no">&quot;http://localhost:19530&quot;</code> para um servidor Milvus. Tudo o resto permanece o mesmo. O Milvus Lite também suporta o armazenamento de texto bruto e outros rótulos como metadados, usando um esquema dinâmico ou explicitamente definido, como mostrado abaixo.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

client = MilvusClient(<span class="hljs-string">&quot;milvus_demo.db&quot;</span>)
<span class="hljs-comment"># This collection can take input with mandatory fields named &quot;id&quot;, &quot;vector&quot; and</span>
<span class="hljs-comment"># any other fields as &quot;dynamic schema&quot;. You can also define the schema explicitly.</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    dimension=<span class="hljs-number">384</span>  <span class="hljs-comment"># Dimension for vectors.</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Para escalabilidade, um aplicativo de IA desenvolvido com o Milvus Lite pode facilmente fazer a transição para o uso do Milvus implantado no Docker ou no Kubernetes simplesmente especificando o <code translate="no">uri</code> com o ponto de extremidade do servidor.</p>
<h2 id="Integration-with-AI-Development-Stack" class="common-anchor-header">Integração com a pilha de desenvolvimento de IA<button data-href="#Integration-with-AI-Development-Stack" class="anchor-icon" translate="no">
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
    </button></h2><p>Além de apresentar o Milvus Lite para facilitar a pesquisa vetorial, o Milvus também se integra a muitos frameworks e provedores da pilha de desenvolvimento de IA, incluindo <a href="https://python.langchain.com/v0.2/docs/integrations/vectorstores/milvus/">LangChain</a>, <a href="https://docs.llamaindex.ai/en/stable/examples/vector_stores/MilvusIndexDemo/">LlamaIndex</a>, <a href="https://haystack.deepset.ai/integrations/milvus-document-store">Haystack</a>, <a href="https://blog.voyageai.com/2024/05/30/semantic-search-with-milvus-lite-and-voyage-ai/">Voyage AI</a>, <a href="https://milvus.io/docs/integrate_with_ragas.md">Ragas</a>, <a href="https://jina.ai/news/implementing-a-chat-history-rag-with-jina-ai-and-milvus-lite/">Jina AI</a>, <a href="https://dspy-docs.vercel.app/docs/deep-dive/retrieval_models_clients/MilvusRM">DSPy</a>, <a href="https://www.bentoml.com/blog/building-a-rag-app-with-bentocloud-and-milvus-lite">BentoML</a>, <a href="https://chiajy.medium.com/70873c7576f1">WhyHow</a>, <a href="https://blog.relari.ai/case-study-using-synthetic-data-to-benchmark-rag-systems-be324904ace1">Relari AI</a>, <a href="https://docs.airbyte.com/integrations/destinations/milvus">Airbyte</a>, <a href="https://milvus.io/docs/integrate_with_hugging-face.md">HuggingFace</a> e <a href="https://memgpt.readme.io/docs/storage#milvus">MemGPT</a>. Graças às suas extensas ferramentas e serviços, estas integrações simplificam o desenvolvimento de aplicações de IA com capacidade de pesquisa vetorial.</p>
<p>E isto é apenas o início - muitas outras integrações interessantes estão a chegar em breve! Fique ligado!</p>
<h2 id="More-Resources-and-Examples" class="common-anchor-header">Mais recursos e exemplos<button data-href="#More-Resources-and-Examples" class="anchor-icon" translate="no">
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
    </button></h2><p>Explore <a href="https://milvus.io/docs/quickstart.md">a documentação de início rápido do Milvus</a> para obter guias detalhados e exemplos de código sobre como usar o Milvus Lite para criar aplicativos de IA como Retrieval-Augmented Generation<a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/build_RAG_with_milvus.ipynb">(RAG</a>) e <a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/image_search_with_milvus.ipynb">pesquisa de imagens</a>.</p>
<p>O Milvus Lite é um projeto de código aberto, e as suas contribuições são bem-vindas. Veja o nosso <a href="https://github.com/milvus-io/milvus-lite/blob/main/CONTRIBUTING.md">Guia de Contribuição</a> para começar. Também pode reportar bugs ou solicitar funcionalidades registando um problema no repositório <a href="https://github.com/milvus-io/milvus-lite">GitHub do Milvus Lite</a>.</p>
