---
id: introducing-milvus-lite.md
title: >-
  Présentation de Milvus Lite : Commencer à construire une application GenAI en
  quelques secondes
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
<p>Nous sommes heureux de vous présenter <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>, une base de données vectorielle légère qui s'exécute localement dans votre application Python. Basée sur la populaire base de données vectorielle open-source <a href="https://milvus.io/intro">Milvus</a>, Milvus Lite réutilise les composants de base pour l'indexation vectorielle et l'analyse des requêtes tout en supprimant les éléments conçus pour une grande évolutivité dans les systèmes distribués. Cette conception en fait une solution compacte et efficace, idéale pour les environnements disposant de ressources informatiques limitées, tels que les ordinateurs portables, les ordinateurs bloc-notes Jupyter et les appareils mobiles ou périphériques.</p>
<p>Milvus Lite s'intègre à diverses piles de développement d'IA telles que LangChain et LlamaIndex, ce qui permet de l'utiliser comme magasin de vecteurs dans les pipelines de génération augmentée de recherche (RAG) sans avoir à installer de serveur. Il suffit d'exécuter <code translate="no">pip install pymilvus</code> (version 2.4.3 ou supérieure) pour l'incorporer dans votre application d'IA en tant que bibliothèque Python.</p>
<p>Milvus Lite partage l'API Milvus, ce qui garantit que votre code côté client fonctionne aussi bien pour les déploiements locaux à petite échelle que pour les serveurs Milvus déployés sur Docker ou Kubernetes avec des milliards de vecteurs.</p>
<h2 id="Why-We-Built-Milvus-Lite" class="common-anchor-header">Pourquoi nous avons créé Milvus Lite<button data-href="#Why-We-Built-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>De nombreuses applications d'IA nécessitent une recherche de similarité vectorielle pour les données non structurées, y compris le texte, les images, les voix et les vidéos, pour des applications telles que les chatbots et les assistants d'achat. Les bases de données vectorielles sont conçues pour le stockage et la recherche d'embeddings vectoriels et constituent une partie essentielle de la pile de développement de l'IA, en particulier pour les cas d'utilisation de l'IA générative tels que la <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Génération Augmentée de Récupération (RAG)</a>.</p>
<p>Malgré la disponibilité de nombreuses solutions de recherche vectorielle, il manquait une option facile à démarrer qui fonctionne également pour les déploiements de production à grande échelle. En tant que créateurs de Milvus, nous avons conçu Milvus Lite pour aider les développeurs d'IA à créer des applications plus rapidement tout en garantissant une expérience cohérente dans diverses options de déploiement, notamment Milvus on Kubernetes, Docker et les services cloud gérés.</p>
<p>Milvus Lite est un complément essentiel à notre gamme d'offres au sein de l'écosystème Milvus. Il offre aux développeurs un outil polyvalent qui prend en charge chaque étape de leur parcours de développement. Du prototypage aux environnements de production et de l'informatique de pointe aux déploiements à grande échelle, Milvus est désormais la seule base de données vectorielle qui couvre les cas d'utilisation de toute taille et à tous les stades de développement.</p>
<h2 id="How-Milvus-Lite-Works" class="common-anchor-header">Fonctionnement de Milvus Lite<button data-href="#How-Milvus-Lite-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Lite prend en charge toutes les opérations de base disponibles dans Milvus, telles que la création de collections et l'insertion, la recherche et la suppression de vecteurs. Elle prendra bientôt en charge des fonctions avancées telles que la recherche hybride. Milvus Lite charge les données en mémoire pour des recherches efficaces et les conserve dans un fichier SQLite.</p>
<p>Milvus Lite est inclus dans le <a href="https://github.com/milvus-io/pymilvus">SDK Python de Milvus</a> et peut être déployé à l'aide d'un simple <code translate="no">pip install pymilvus</code>. L'extrait de code suivant montre comment configurer une base de données vectorielle avec Milvus Lite en spécifiant un nom de fichier local et en créant une nouvelle collection. Pour ceux qui connaissent l'API Milvus, la seule différence est que <code translate="no">uri</code> fait référence à un nom de fichier local au lieu d'un point d'extrémité réseau, par exemple, <code translate="no">&quot;milvus_demo.db&quot;</code> au lieu de <code translate="no">&quot;http://localhost:19530&quot;</code> pour un serveur Milvus. Tout le reste est identique. Milvus Lite prend également en charge le stockage de texte brut et d'autres étiquettes en tant que métadonnées, à l'aide d'un schéma dynamique ou explicitement défini, comme indiqué ci-dessous.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

client = MilvusClient(<span class="hljs-string">&quot;milvus_demo.db&quot;</span>)
<span class="hljs-comment"># This collection can take input with mandatory fields named &quot;id&quot;, &quot;vector&quot; and</span>
<span class="hljs-comment"># any other fields as &quot;dynamic schema&quot;. You can also define the schema explicitly.</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    dimension=<span class="hljs-number">384</span>  <span class="hljs-comment"># Dimension for vectors.</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Pour l'évolutivité, une application d'IA développée avec Milvus Lite peut facilement passer à l'utilisation de Milvus déployé sur Docker ou Kubernetes en spécifiant simplement le site <code translate="no">uri</code> avec le point de terminaison du serveur.</p>
<h2 id="Integration-with-AI-Development-Stack" class="common-anchor-header">Intégration à la pile de développement de l'IA<button data-href="#Integration-with-AI-Development-Stack" class="anchor-icon" translate="no">
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
    </button></h2><p>Outre l'introduction de Milvus Lite pour faciliter la recherche vectorielle au départ, Milvus s'intègre également à de nombreux cadres et fournisseurs de la pile de développement de l'IA, notamment <a href="https://python.langchain.com/v0.2/docs/integrations/vectorstores/milvus/">LangChain</a>, <a href="https://docs.llamaindex.ai/en/stable/examples/vector_stores/MilvusIndexDemo/">LlamaIndex</a>, <a href="https://haystack.deepset.ai/integrations/milvus-document-store">Haystack</a>, <a href="https://blog.voyageai.com/2024/05/30/semantic-search-with-milvus-lite-and-voyage-ai/">Voyage AI</a>, <a href="https://milvus.io/docs/integrate_with_ragas.md">Ragas</a>, <a href="https://jina.ai/news/implementing-a-chat-history-rag-with-jina-ai-and-milvus-lite/">Jina AI</a>, <a href="https://dspy-docs.vercel.app/docs/deep-dive/retrieval_models_clients/MilvusRM">DSPy</a>, <a href="https://www.bentoml.com/blog/building-a-rag-app-with-bentocloud-and-milvus-lite">BentoML</a>, <a href="https://chiajy.medium.com/70873c7576f1">WhyHow</a>, <a href="https://blog.relari.ai/case-study-using-synthetic-data-to-benchmark-rag-systems-be324904ace1">Relari AI</a>, <a href="https://docs.airbyte.com/integrations/destinations/milvus">Airbyte</a>, <a href="https://milvus.io/docs/integrate_with_hugging-face.md">HuggingFace</a> et <a href="https://memgpt.readme.io/docs/storage#milvus">MemGPT</a>. Grâce à leurs nombreux outils et services, ces intégrations simplifient le développement d'applications d'IA avec des capacités de recherche vectorielle.</p>
<p>Et ce n'est qu'un début - de nombreuses autres intégrations passionnantes sont à venir ! Restez à l'écoute !</p>
<h2 id="More-Resources-and-Examples" class="common-anchor-header">Autres ressources et exemples<button data-href="#More-Resources-and-Examples" class="anchor-icon" translate="no">
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
    </button></h2><p>Explorez la <a href="https://milvus.io/docs/quickstart.md">documentation de démarrage rapide de Milvus</a> pour obtenir des guides détaillés et des exemples de code sur l'utilisation de Milvus Lite pour créer des applications d'IA telles que Retrieval-Augmented Generation<a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/build_RAG_with_milvus.ipynb">(RAG)</a> et la <a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/image_search_with_milvus.ipynb">recherche d'images</a>.</p>
<p>Milvus Lite est un projet open-source et vos contributions sont les bienvenues. Consultez notre <a href="https://github.com/milvus-io/milvus-lite/blob/main/CONTRIBUTING.md">guide de contribution</a> pour commencer. Vous pouvez également signaler des bogues ou demander des fonctionnalités en déposant un problème sur le dépôt <a href="https://github.com/milvus-io/milvus-lite">GitHub</a> de <a href="https://github.com/milvus-io/milvus-lite">Milvus Lite</a>.</p>
