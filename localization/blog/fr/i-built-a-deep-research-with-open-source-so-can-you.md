---
id: i-built-a-deep-research-with-open-source-so-can-you.md
title: >-
  J'ai construit une recherche approfondie avec l'Open Source - et vous le
  pouvez aussi !
author: Stefan Webb
date: 2025-02-6
desc: >-
  Apprenez à créer un agent de type Deep Research à l'aide d'outils open-source
  tels que Milvus, DeepSeek R1 et LangChain.
cover: >-
  assets.zilliz.com/I_Built_a_Deep_Research_with_Open_Source_and_So_Can_You_7eb2a38078.png
tag: Tutorials
tags: 'Deep Research, open source AI, Milvus, LangChain, DeepSeek R1'
recommend: true
canonicalUrl: 'https://milvus.io/blog/i-built-a-deep-research-with-open-source-so-can-you.md'
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deep_research_blog_image_95225226eb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>En fait, il s'agit d'un agent à portée minimale qui peut raisonner, planifier, utiliser des outils, etc. pour effectuer des recherches à l'aide de Wikipédia. Mais ce n'est pas si mal pour quelques heures de travail...</p>
<p>À moins que vous ne résidiez sous un rocher, dans une grotte ou dans un monastère de montagne isolé, vous avez certainement entendu parler du lancement de <em>Deep Research</em> par OpenAI le 2 février 2025. Ce nouveau produit promet de révolutionner la manière dont nous répondons aux questions nécessitant la synthèse de grandes quantités d'informations diverses.</p>
<p>Vous saisissez votre requête, sélectionnez l'option Deep Research et la plateforme effectue une recherche autonome sur le web, raisonne sur ce qu'elle découvre et synthétise de multiples sources en un rapport cohérent et entièrement cité. Il faut plusieurs ordres de grandeur de temps pour produire le résultat par rapport à un chatbot standard, mais le résultat est plus détaillé, plus informé et plus nuancé.</p>
<h2 id="How-does-it-work" class="common-anchor-header">Comment cela fonctionne-t-il ?<button data-href="#How-does-it-work" class="anchor-icon" translate="no">
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
    </button></h2><p>Mais comment cette technologie fonctionne-t-elle et pourquoi Deep Research représente-t-elle une amélioration notable par rapport aux tentatives précédentes (comme <em>Deep Research</em> de Google - alerte de litige sur une marque déposée) ? Nous laisserons cette dernière question pour un prochain article. Pour ce qui est de la première question, il ne fait aucun doute qu'il y a beaucoup de "sauce secrète" à la base de Deep Research. Nous pouvons glaner quelques détails dans le communiqué de presse d'OpenAI, que je résume.</p>
<p><strong>Deep Research exploite les progrès récents des modèles de fondation spécialisés dans les tâches de raisonnement :</strong></p>
<ul>
<li><p>"...affiné sur le modèle de raisonnement OpenAI o3 à venir..."</p></li>
<li><p>"...exploite le raisonnement pour rechercher, interpréter et analyser des quantités massives de texte..."</p></li>
</ul>
<p><strong>Deep Research utilise un flux de travail agentique sophistiqué avec planification, réflexion et mémoire :</strong></p>
<ul>
<li><p>"...appris à planifier et à exécuter une trajectoire en plusieurs étapes..."</p></li>
<li><p>"...revenir en arrière et réagir aux informations en temps réel..."</p></li>
<li><p>"...pivotant au besoin en réaction aux informations qu'il rencontre..."</p></li>
</ul>
<p><strong>Deep Research est formé sur des données propriétaires, en utilisant plusieurs types de réglages fins, ce qui est probablement un élément clé de sa performance :</strong></p>
<ul>
<li><p>"...formé à l'aide de l'apprentissage par renforcement de bout en bout sur des tâches de navigation et de raisonnement difficiles dans un large éventail de domaines..."</p></li>
<li><p>"...optimisé pour la navigation sur le web et l'analyse de données..."</p></li>
</ul>
<p>La conception exacte du flux de travail agentique est un secret, mais nous pouvons construire quelque chose nous-mêmes sur la base d'idées bien établies sur la façon de structurer les agents.</p>
<p><strong>Une remarque avant de commencer</strong>: Il est facile d'être emporté par la fièvre de l'IA générative, en particulier lorsqu'un nouveau produit qui semble être une amélioration est publié. Cependant, la recherche profonde, comme le reconnaît OpenAI, a des limites communes à la technologie de l'IA générative. Nous devons nous rappeler de faire preuve d'esprit critique à l'égard des résultats, car ils peuvent contenir des faits erronés ("hallucinations"), un formatage et des citations incorrects, et varier considérablement en qualité en fonction de la graine aléatoire.</p>
<h2 id="Can-I-build-my-own" class="common-anchor-header">Puis-je construire la mienne ?<button data-href="#Can-I-build-my-own" class="anchor-icon" translate="no">
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
    </button></h2><p>Certainement ! Construisons notre propre "Recherche profonde", fonctionnant localement et avec des outils open-source. Nous serons armés d'une connaissance de base de l'IA générative, de bon sens, de quelques heures libres, d'un GPU et des outils open-source <a href="https://milvus.io/docs">Milvus</a>, <a href="https://huggingface.co/unsloth/DeepSeek-R1-Distill-Llama-8B-unsloth-bnb-4bit">DeepSeek R1</a> et <a href="https://python.langchain.com/docs/introduction/">LangChain</a>.</p>
<p>Nous ne pouvons évidemment pas espérer reproduire les performances d'OpenAI, mais notre prototype démontrera au minimum certaines des idées clés qui sous-tendent probablement leur technologie, en combinant les avancées dans les modèles de raisonnement avec les avancées dans les flux de travail agentiques. Il est important de noter que, contrairement à l'OpenAI, nous n'utiliserons que des outils open-source et que nous serons en mesure de déployer notre système localement - l'open-source nous offre certainement une grande flexibilité !</p>
<p>Nous ferons quelques hypothèses simplificatrices pour réduire la portée de notre projet :</p>
<ul>
<li><p>Nous utiliserons un mode de raisonnement open-source distillé puis <a href="https://zilliz.com/learn/unlock-power-of-vector-quantization-techniques-for-efficient-data-compression-and-retrieval">quantifié</a> pour 4-bits qui peut être exécuté localement.</p></li>
<li><p>Nous n'effectuerons pas nous-mêmes d'ajustements supplémentaires sur notre modèle de raisonnement.</p></li>
<li><p>Le seul outil dont dispose notre agent est la capacité de télécharger et de lire une page Wikipédia et d'effectuer des requêtes RAG distinctes (nous n'aurons pas accès à l'ensemble du web).</p></li>
<li><p>Notre agent ne traitera que des données textuelles, pas d'images, de PDF, etc.</p></li>
<li><p>Notre agent ne reviendra pas en arrière et ne prendra pas en compte les pivots.</p></li>
<li><p>Notre agent contrôlera (pas encore) son flux d'exécution en fonction de ses résultats.</p></li>
<li><p>Wikipedia contient la vérité, toute la vérité et rien que la vérité.</p></li>
</ul>
<p>Nous utiliserons <a href="https://milvus.io/docs">Milvus</a> pour notre base de données vectorielle, <a href="https://huggingface.co/unsloth/DeepSeek-R1-Distill-Llama-8B-unsloth-bnb-4bit">DeepSeek R1</a> comme modèle de raisonnement, et <a href="https://python.langchain.com/docs/introduction/">LangChain</a> pour implémenter RAG. C'est parti !</p>
<custom-h1>Un agent minimal pour la recherche en ligne</custom-h1><p>Nous utiliserons notre modèle mental de la façon dont les humains mènent des recherches pour concevoir le flux de travail de l'agent :</p>
<h3 id="DefineRefine-Question" class="common-anchor-header">Définir/affiner la question</h3><p>La recherche commence par la définition d'une question. Nous considérons que la question est la requête de l'utilisateur, mais nous utilisons notre modèle de raisonnement pour nous assurer que la question est exprimée d'une manière spécifique, claire et ciblée. En d'autres termes, notre première étape consiste à réécrire l'invite et à en extraire toutes les sous-requêtes ou sous-questions. Nous utilisons efficacement la spécialisation de nos modèles de base pour le raisonnement et une méthode simple pour la sortie structurée JSON.</p>
<p>Voici un exemple de trace de raisonnement alors que DeepSeek affine la question "Comment la distribution a-t-elle changé au fil du temps ?":</p>
<pre><code translate="no" class="language-text">&lt;think&gt;

Alright, so I need to <span class="hljs-built_in">break</span> down the question <span class="hljs-string">&quot;How has the cast changed over time?&quot;</span> related to the evolution of The Simpsons. Let me think about what aspects are involved here.

First, I know that the cast has changed a lot, but I need to figure out the intermediate questions to approach this. The main question is about changes <span class="hljs-keyword">in</span> the cast over <span class="hljs-keyword">time</span>, so I should consider different areas that contribute to this change.

I guess the first sub-question would be about the original cast members. Who were the main voices and how did they evolve? Then, there might be new cast additions over the years, so another sub-question about that.

Also, some original voice actors have left, so I should include a sub-question about departures. Then, new voice actors joining would be another point.

The show has been popular <span class="hljs-keyword">for</span> a long <span class="hljs-keyword">time</span>, so recurring roles changing might be another aspect. Additionally, the role of the show <span class="hljs-keyword">in</span> society might have influenced casting choices, so a sub-question about that.

Lastly, the overall impact on the cast<span class="hljs-string">&#x27;s careers could be another angle. So, I should list these as sub-questions to cover all aspects.

&lt;/think&gt;
</span><button class="copy-code-btn"></button></code></pre>
<h3 id="Search" class="common-anchor-header">Recherche</h3><p>Ensuite, nous effectuons une "analyse documentaire" des articles de Wikipedia. Pour l'instant, nous lisons un seul article et laissons les liens de navigation à une prochaine itération. Nous avons découvert au cours du prototypage que l'exploration des liens peut devenir très coûteuse si chaque lien nécessite un appel au modèle de raisonnement. Nous analysons l'article et stockons ses données dans notre base de données vectorielle, Milvus, un peu comme si nous prenions des notes.</p>
<p>Voici un extrait de code montrant comment nous stockons notre page Wikipédia dans Milvus en utilisant son intégration LangChain :</p>
<pre><code translate="no" class="language-python">wiki_wiki = wikipediaapi.Wikipedia(user_agent=<span class="hljs-string">&#x27;MilvusDeepResearchBot (&lt;insert your email&gt;)&#x27;</span>, language=<span class="hljs-string">&#x27;en&#x27;</span>)
page_py = wiki_wiki.page(page_title)

text_splitter = RecursiveCharacterTextSplitter(chunk_size=<span class="hljs-number">2000</span>, chunk_overlap=<span class="hljs-number">200</span>)
docs = text_splitter.create_documents([page_py.text])

vectorstore = Milvus.from_documents(  <span class="hljs-comment"># or Zilliz.from_documents</span>
    documents=docs,
    embedding=embeddings,
    connection_args={
        <span class="hljs-string">&quot;uri&quot;</span>: <span class="hljs-string">&quot;./milvus_demo.db&quot;</span>,
    },
    drop_old=<span class="hljs-literal">True</span>, 
    index_params={
        <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>,
        <span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;FLAT&quot;</span>,  
        <span class="hljs-string">&quot;params&quot;</span>: {},
    },
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Analyze" class="common-anchor-header">Analyser</h3><p>L'agent revient à ses questions et y répond sur la base des informations pertinentes contenues dans le document. Nous laisserons un flux d'analyse/réflexion en plusieurs étapes pour les travaux futurs, ainsi qu'une réflexion critique sur la crédibilité et la partialité de nos sources.</p>
<p>Voici un extrait de code illustrant la construction d'un RAG avec LangChain et la réponse à nos sous-questions séparément.</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># Define the RAG chain for response generation</span>
rag_chain = (
    {<span class="hljs-string">&quot;context&quot;</span>: retriever | format_docs, <span class="hljs-string">&quot;question&quot;</span>: RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

<span class="hljs-comment"># Prompt the RAG for each question</span>
answers = {}
total = <span class="hljs-built_in">len</span>(leaves(breakdown))

pbar = tqdm(total=total)
<span class="hljs-keyword">for</span> k, v <span class="hljs-keyword">in</span> breakdown.items():
    <span class="hljs-keyword">if</span> v == []:
        <span class="hljs-built_in">print</span>(k)
        answers[k] = rag_chain.invoke(k).split(<span class="hljs-string">&#x27;&lt;/think&gt;&#x27;</span>)[-<span class="hljs-number">1</span>].strip()
        pbar.update(<span class="hljs-number">1</span>)
    <span class="hljs-keyword">else</span>:
        <span class="hljs-keyword">for</span> q <span class="hljs-keyword">in</span> v:
            <span class="hljs-built_in">print</span>(q)
            answers[q] = rag_chain.invoke(q).split(<span class="hljs-string">&#x27;&lt;/think&gt;&#x27;</span>)[-<span class="hljs-number">1</span>].strip()
            pbar.update(<span class="hljs-number">1</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Synthesize" class="common-anchor-header">Synthèse</h3><p>Une fois que l'agent a effectué ses recherches, il crée un schéma structuré, ou plutôt un squelette, de ses résultats pour les résumer dans un rapport. Il complète ensuite chaque section, en y ajoutant un titre et le contenu correspondant. Nous laissons un flux de travail plus sophistiqué avec réflexion, réorganisation et réécriture pour une itération future. Cette partie de l'agent implique la planification, l'utilisation d'outils et la mémoire.</p>
<p>Voir le <a href="https://drive.google.com/file/d/1waKX_NTgiY-47bYE0cI6qD8Cjn3zjrL6/view?usp=sharing">cahier d'accompagnement</a> pour le code complet et le <a href="https://drive.google.com/file/d/15xeEe_EqY-29V2IlAvDy5yGdJdEPSHOh/view?usp=drive_link">fichier de rapport sauvegardé</a> pour un exemple de sortie.</p>
<h2 id="Results" class="common-anchor-header">Résultats<button data-href="#Results" class="anchor-icon" translate="no">
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
    </button></h2><p>Notre requête pour le test est <em>"Comment les Simpsons ont-ils changé au fil du temps ?"</em> et la source de données est l'article Wikipedia pour "Les Simpsons". Voici une section du <a href="https://drive.google.com/file/d/15xeEe_EqY-29V2IlAvDy5yGdJdEPSHOh/view?usp=sharing">rapport généré</a>:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/result_query_424beba224.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Summary-What-we-built-and-what’s-next" class="common-anchor-header">Résumé : ce que nous avons construit et ce qui nous attend<button data-href="#Summary-What-we-built-and-what’s-next" class="anchor-icon" translate="no">
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
    </button></h2><p>En quelques heures seulement, nous avons conçu un flux de travail agentique de base capable de raisonner, de planifier et d'extraire des informations de Wikipédia pour générer un rapport de recherche structuré. Bien que ce prototype soit loin du Deep Research d'OpenAI, il démontre la puissance des outils open-source comme Milvus, DeepSeek et LangChain dans la construction d'agents de recherche autonomes.</p>
<p>Bien sûr, il y a beaucoup de place pour l'amélioration. Les futures itérations pourraient</p>
<ul>
<li><p>aller au-delà de Wikipédia pour effectuer des recherches dynamiques dans de multiples sources</p></li>
<li><p>Introduire le retour en arrière et la réflexion pour affiner les réponses</p></li>
<li><p>Optimiser le flux d'exécution en fonction du raisonnement de l'agent.</p></li>
</ul>
<p>Les logiciels libres nous offrent une flexibilité et un contrôle que les logiciels fermés n'ont pas. Que ce soit pour la recherche académique, la synthèse de contenu ou l'assistance assistée par l'IA, la construction de nos propres agents de recherche ouvre des possibilités passionnantes. Restez à l'écoute pour le prochain article où nous explorerons l'ajout de la recherche web en temps réel, le raisonnement en plusieurs étapes et le flux d'exécution conditionnel !</p>
<h2 id="Resources" class="common-anchor-header">Ressources<button data-href="#Resources" class="anchor-icon" translate="no">
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
<li><p>Carnet de notes : "<a href="https://colab.research.google.com/drive/1W5tW8SqWXve7ZwbSb9pVdbt5R2wq105O?usp=sharing"><em>Baseline for An Open-Source Deep Research</em></a><em>" (</em><a href="https://colab.research.google.com/drive/1W5tW8SqWXve7ZwbSb9pVdbt5R2wq105O?usp=sharing"><em>en</em></a> <em>anglais)</em></p></li>
<li><p>Rapport : "<a href="https://drive.google.com/file/d/15xeEe_EqY-29V2IlAvDy5yGdJdEPSHOh/view?usp=drive_link"><em>L'évolution de la série Les Simpson au fil du temps, couvrant les changements dans le contenu, l'humour, le développement des personnages, l'animation et son rôle dans la société</em></a><em>.</em></p></li>
<li><p><a href="https://milvus.io/docs">Documentation sur la base de données vectorielle Milvus</a></p></li>
<li><p><a href="https://huggingface.co/unsloth/DeepSeek-R1-Distill-Llama-8B-unsloth-bnb-4bit">Page du modèle DeepSeek R1 distillé et quantifié</a></p></li>
<li><p><a href="https://python.langchain.com/docs/introduction/">️🔗 LangChain</a></p></li>
<li><p><a href="https://help.openai.com/en/articles/10500283-deep-research-faq">Deep Research FAQ | Centre d'aide OpenAI</a></p></li>
</ul>
