---
id: introduce-deepsearcher-a-local-open-source-deep-research.md
title: >-
  Présentation de DeepSearcher : Une source ouverte locale pour la recherche en
  profondeur
author: Stefan Webb
date: 2025-02-21T00:00:00.000Z
desc: >-
  Contrairement au projet Deep Research de l'OpenAI, cet exemple a été exécuté
  localement, en utilisant uniquement des modèles et des outils open-source tels
  que Milvus et LangChain.
cover: >-
  assets.zilliz.com/Introducing_Deep_Searcher_A_Local_Open_Source_Deep_Research_4d00da5b85.png
tag: Announcements
tags: DeepSearcher
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/introduce-deepsearcher-a-local-open-source-deep-research
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/deep_researcher_a0170dadd0.gif" alt="DeepSearcher" class="doc-image" id="deepsearcher" />
   </span> <span class="img-wrapper"> <span>DeepSearcher</span> </span></p>
<p>Dans l'article précédent, <a href="https://milvus.io/blog/i-built-a-deep-research-with-open-source-so-can-you.md"><em>"I Built a Deep Research with Open Source-and So Can You !",</em></a> nous avons expliqué certains des principes qui sous-tendent les agents de recherche et construit un prototype simple qui génère des rapports détaillés sur un sujet ou une question donné(e). L'article et le carnet de notes correspondant ont démontré les concepts fondamentaux de l'<em>utilisation des outils</em>, de la <em>décomposition des requêtes</em>, du <em>raisonnement</em> et de la <em>réflexion</em>. L'exemple présenté dans notre article précédent, contrairement à Deep Research de l'OpenAI, a fonctionné localement, en utilisant uniquement des modèles et des outils open-source tels que <a href="https://milvus.io/docs">Milvus</a> et LangChain. (Je vous encourage à lire l'<a href="https://milvus.io/blog/i-built-a-deep-research-with-open-source-so-can-you.md">article ci-dessus</a> avant de poursuivre).</p>
<p>Dans les semaines qui ont suivi, l'intérêt pour la compréhension et la reproduction de la recherche profonde de l'OpenAI a explosé. Voir, par exemple, <a href="https://www.perplexity.ai/hub/blog/introducing-perplexity-deep-research">Perplexity Deep Research</a> et <a href="https://huggingface.co/blog/open-deep-research">Hugging Face's Open DeepResearch</a>. Ces outils diffèrent en termes d'architecture et de méthodologie, bien qu'ils partagent le même objectif : effectuer des recherches itératives sur un sujet ou une question en surfant sur le web ou sur des documents internes et produire un rapport détaillé, bien informé et bien structuré. Il est important de noter que l'agent sous-jacent automatise le raisonnement sur l'action à entreprendre à chaque étape intermédiaire.</p>
<p>Dans cet article, nous nous appuyons sur notre article précédent et présentons le projet open-source <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a> de Zilliz. Notre agent démontre des concepts supplémentaires : <em>le routage des requêtes, le flux d'exécution conditionnel</em> et l'<em>exploration du web en tant qu'outil</em>. Il est présenté comme une bibliothèque Python et un outil de ligne de commande plutôt qu'un carnet Jupyter et est plus complet que notre précédent article. Par exemple, il peut saisir plusieurs documents sources et définir le modèle d'intégration et la base de données vectorielle utilisés via un fichier de configuration. Bien qu'il soit encore relativement simple, DeepSearcher est une excellente vitrine du RAG agentique et constitue un pas de plus vers des applications d'IA de pointe.</p>
<p>En outre, nous explorons le besoin de services d'inférence plus rapides et plus efficaces. Les modèles de raisonnement font appel à la "mise à l'échelle de l'inférence", c'est-à-dire à des calculs supplémentaires, pour améliorer leurs résultats, ce qui, combiné au fait qu'un seul rapport peut nécessiter des centaines ou des milliers d'appels LLM, fait de la bande passante de l'inférence le principal goulot d'étranglement. Nous utilisons le <a href="https://sambanova.ai/press/fastest-deepseek-r1-671b-with-highest-efficiency">modèle de raisonnement DeepSeek-R1 sur le matériel personnalisé de SambaNova</a>, qui est deux fois plus rapide en termes de jetons de sortie par seconde que le concurrent le plus proche (voir la figure ci-dessous).</p>
<p>SambaNova Cloud fournit également un service d'inférence pour d'autres modèles open-source, notamment Llama 3.x, Qwen2.5 et QwQ. Le service d'inférence fonctionne sur la puce personnalisée de SambaNova appelée unité de flux de données reconfigurable (RDU), qui est spécialement conçue pour une inférence efficace sur les modèles d'IA générative, réduisant les coûts et augmentant la vitesse d'inférence. <a href="https://sambanova.ai/technology/sn40l-rdu-ai-chip">Pour en savoir plus, consultez leur site web.</a></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Output_speed_deepseek_r1_d820329f0a.png" alt="Output Speed- DeepSeek R1" class="doc-image" id="output-speed--deepseek-r1" />
   </span> <span class="img-wrapper"> <span>Vitesse de sortie - DeepSeek R1</span> </span></p>
<h2 id="DeepSearcher-Architecture" class="common-anchor-header">Architecture de DeepSearcher<button data-href="#DeepSearcher-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>L'architecture de <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a> suit notre précédent article en décomposant le problème en quatre étapes - <em>définir/affiner la question</em>, <em>rechercher</em>, <em>analyser</em>, <em>synthétiser</em> - bien que cette fois avec quelques chevauchements. Nous passons en revue chaque étape, en soulignant les améliorations apportées par <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/deepsearcher_architecture_088c7066d1.png" alt="DeepSearcher Architecture" class="doc-image" id="deepsearcher-architecture" />
   </span> <span class="img-wrapper"> <span>Architecture de DeepSearcher</span> </span></p>
<h3 id="Define-and-Refine-the-Question" class="common-anchor-header">Définir et affiner la question</h3><pre><code translate="no" class="language-txt">Break down the original query <span class="hljs-keyword">into</span> <span class="hljs-keyword">new</span> sub queries: [
  <span class="hljs-string">&#x27;How has the cultural impact and societal relevance of The Simpsons evolved from its debut to the present?&#x27;</span>,
  <span class="hljs-string">&#x27;What changes in character development, humor, and storytelling styles have occurred across different seasons of The Simpsons?&#x27;</span>, 
  <span class="hljs-string">&#x27;How has the animation style and production technology of The Simpsons changed over time?&#x27;</span>,
  <span class="hljs-string">&#x27;How have audience demographics, reception, and ratings of The Simpsons shifted throughout its run?&#x27;</span>]
<button class="copy-code-btn"></button></code></pre>
<p>Dans la conception de DeepSearcher, les frontières entre la recherche et l'affinement de la question sont floues. La requête initiale de l'utilisateur est décomposée en sous-requêtes, comme dans le billet précédent. Voir ci-dessus les sous-requêtes initiales produites à partir de la requête "Comment les Simpsons ont-ils changé au fil du temps ? Toutefois, l'étape de recherche suivante permettra d'affiner la question si nécessaire.</p>
<h3 id="Research-and-Analyze" class="common-anchor-header">Recherche et analyse</h3><p>Après avoir décomposé la requête en sous-requêtes, la partie recherche de l'agent commence. Elle comporte, grosso modo, quatre étapes : l'<em>acheminement</em>, la <em>recherche</em>, la <em>réflexion et la répétition conditionnelle</em>.</p>
<h4 id="Routing" class="common-anchor-header">Routage</h4><p>Notre base de données contient plusieurs tables ou collections provenant de différentes sources. Il serait plus efficace de restreindre notre recherche sémantique aux seules sources pertinentes pour la requête en question. Un routeur de requête demande à un LLM de décider à partir de quelles collections les informations doivent être récupérées.</p>
<p>Voici la méthode pour former l'invite de routage de requête :</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">get_vector_db_search_prompt</span>(<span class="hljs-params">
    question: <span class="hljs-built_in">str</span>,
    collection_names: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
    collection_descriptions: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
    context: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>] = <span class="hljs-literal">None</span>,
</span>):
    sections = []
    <span class="hljs-comment"># common prompt</span>
    common_prompt = <span class="hljs-string">f&quot;&quot;&quot;You are an advanced AI problem analyst. Use your reasoning ability and historical conversation information, based on all the existing data sets, to get absolutely accurate answers to the following questions, and generate a suitable question for each data set according to the data set description that may be related to the question.

Question: <span class="hljs-subst">{question}</span>
&quot;&quot;&quot;</span>
    sections.append(common_prompt)
    
    <span class="hljs-comment"># data set prompt</span>
    data_set = []
    <span class="hljs-keyword">for</span> i, collection_name <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(collection_names):
        data_set.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{collection_name}</span>: <span class="hljs-subst">{collection_descriptions[i]}</span>&quot;</span>)
    data_set_prompt = <span class="hljs-string">f&quot;&quot;&quot;The following is all the data set information. The format of data set information is data set name: data set description.

Data Sets And Descriptions:
&quot;&quot;&quot;</span>
    sections.append(data_set_prompt + <span class="hljs-string">&quot;\n&quot;</span>.join(data_set))
    
    <span class="hljs-comment"># context prompt</span>
    <span class="hljs-keyword">if</span> context:
        context_prompt = <span class="hljs-string">f&quot;&quot;&quot;The following is a condensed version of the historical conversation. This information needs to be combined in this analysis to generate questions that are closer to the answer. You must not generate the same or similar questions for the same data set, nor can you regenerate questions for data sets that have been determined to be unrelated.

Historical Conversation:
&quot;&quot;&quot;</span>
        sections.append(context_prompt + <span class="hljs-string">&quot;\n&quot;</span>.join(context))
    
    <span class="hljs-comment"># response prompt</span>
    response_prompt = <span class="hljs-string">f&quot;&quot;&quot;Based on the above, you can only select a few datasets from the following dataset list to generate appropriate related questions for the selected datasets in order to solve the above problems. The output format is json, where the key is the name of the dataset and the value is the corresponding generated question.

Data Sets:
&quot;&quot;&quot;</span>
    sections.append(response_prompt + <span class="hljs-string">&quot;\n&quot;</span>.join(collection_names))
    
    footer = <span class="hljs-string">&quot;&quot;&quot;Respond exclusively in valid JSON format matching exact JSON schema.

Critical Requirements:
- Include ONLY ONE action type
- Never add unsupported keys
- Exclude all non-JSON text, markdown, or explanations
- Maintain strict JSON syntax&quot;&quot;&quot;</span>
    sections.append(footer)
    <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n\n&quot;</span>.join(sections)
<button class="copy-code-btn"></button></code></pre>
<p>Nous faisons en sorte que le LLM renvoie une sortie structurée sous forme de JSON afin de convertir facilement sa sortie en une décision sur ce qu'il convient de faire ensuite.</p>
<h4 id="Search" class="common-anchor-header">Recherche</h4><p>Après avoir sélectionné diverses collections de bases de données à l'étape précédente, l'étape de recherche effectue une recherche de similarité avec <a href="https://milvus.io/docs">Milvus</a>. Comme dans l'article précédent, les données sources ont été spécifiées à l'avance, découpées en morceaux, intégrées et stockées dans la base de données vectorielle. Pour DeepSearcher, les sources de données, locales et en ligne, doivent être spécifiées manuellement. Nous laissons la recherche en ligne pour de futurs travaux.</p>
<h4 id="Reflection" class="common-anchor-header">Réflexion</h4><p>Contrairement à l'article précédent, DeepSearcher illustre une véritable forme de réflexion agentique, en introduisant les résultats précédents en tant que contexte dans une invite qui "réfléchit" à la question de savoir si les questions posées jusqu'à présent et les morceaux extraits pertinents contiennent des lacunes en matière d'information. Cela peut être considéré comme une étape d'analyse.</p>
<p>Voici la méthode de création de l'invite :</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">get_reflect_prompt</span>(<span class="hljs-params">
   question: <span class="hljs-built_in">str</span>,
   mini_questions: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
   mini_chuncks: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
</span>):
    mini_chunk_str = <span class="hljs-string">&quot;&quot;</span>
    <span class="hljs-keyword">for</span> i, chunk <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(mini_chuncks):
        mini_chunk_str += <span class="hljs-string">f&quot;&quot;&quot;&lt;chunk_<span class="hljs-subst">{i}</span>&gt;\n<span class="hljs-subst">{chunk}</span>\n&lt;/chunk_<span class="hljs-subst">{i}</span>&gt;\n&quot;&quot;&quot;</span>
    reflect_prompt = <span class="hljs-string">f&quot;&quot;&quot;Determine whether additional search queries are needed based on the original query, previous sub queries, and all retrieved document chunks. If further research is required, provide a Python list of up to 3 search queries. If no further research is required, return an empty list.

If the original query is to write a report, then you prefer to generate some further queries, instead return an empty list.

    Original Query: <span class="hljs-subst">{question}</span>
    Previous Sub Queries: <span class="hljs-subst">{mini_questions}</span>
    Related Chunks: 
    <span class="hljs-subst">{mini_chunk_str}</span>
    &quot;&quot;&quot;</span>
   
    
    footer = <span class="hljs-string">&quot;&quot;&quot;Respond exclusively in valid List of str format without any other text.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> reflect_prompt + footer
<button class="copy-code-btn"></button></code></pre>
<p>Une fois de plus, nous faisons en sorte que le LLM renvoie une sortie structurée, cette fois sous forme de données interprétables par Python.</p>
<p>Voici un exemple de nouvelles sous-questions "découvertes" par réflexion après avoir répondu aux sous-questions initiales ci-dessus :</p>
<pre><code translate="no">New search queries <span class="hljs-keyword">for</span> <span class="hljs-built_in">next</span> iteration: [
  <span class="hljs-string">&quot;How have changes in The Simpsons&#x27; voice cast and production team influenced the show&#x27;s evolution over different seasons?&quot;</span>,
  <span class="hljs-string">&quot;What role has The Simpsons&#x27; satire and social commentary played in its adaptation to contemporary issues across decades?&quot;</span>,
  <span class="hljs-string">&#x27;How has The Simpsons addressed and incorporated shifts in media consumption, such as streaming services, into its distribution and content strategies?&#x27;</span>]
<button class="copy-code-btn"></button></code></pre>
<h4 id="Conditional-Repeat" class="common-anchor-header">Répétition conditionnelle</h4><p>Contrairement à notre précédent billet, DeepSearcher illustre un flux d'exécution conditionnel. Après avoir réfléchi si les questions et les réponses sont complètes, s'il y a des questions supplémentaires à poser, l'agent répète les étapes ci-dessus. Il est important de noter que le flux d'exécution (une boucle while) est une fonction de la sortie LLM plutôt que d'être codé en dur. Dans ce cas, il n'y a qu'un choix binaire : <em>répéter la recherche</em> ou <em>générer un rapport</em>. Dans le cas d'agents plus complexes, il peut y avoir plusieurs choix tels que : <em>suivre un hyperlien</em>, <em>récupérer des morceaux, stocker en mémoire, réfléchir</em>, etc. De cette manière, la question continue d'être affinée comme l'agent le souhaite jusqu'à ce qu'il décide de sortir de la boucle et de générer un rapport. Dans notre exemple des Simpsons, DeepSearcher effectue deux tours supplémentaires pour combler les lacunes avec des sous-requêtes supplémentaires.</p>
<h3 id="Synthesize" class="common-anchor-header">Synthétiser</h3><p>Enfin, la question entièrement décomposée et les morceaux récupérés sont synthétisés dans un rapport avec une seule invite. Voici le code permettant de créer l'invite :</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">get_final_answer_prompt</span>(<span class="hljs-params">
   question: <span class="hljs-built_in">str</span>, 
   mini_questions: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
   mini_chuncks: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
</span>):
    mini_chunk_str = <span class="hljs-string">&quot;&quot;</span>
    <span class="hljs-keyword">for</span> i, chunk <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(mini_chuncks):
        mini_chunk_str += <span class="hljs-string">f&quot;&quot;&quot;&lt;chunk_<span class="hljs-subst">{i}</span>&gt;\n<span class="hljs-subst">{chunk}</span>\n&lt;/chunk_<span class="hljs-subst">{i}</span>&gt;\n&quot;&quot;&quot;</span>
    summary_prompt = <span class="hljs-string">f&quot;&quot;&quot;You are an AI content analysis expert, good at summarizing content. Please summarize a specific and detailed answer or report based on the previous queries and the retrieved document chunks.

    Original Query: <span class="hljs-subst">{question}</span>
    Previous Sub Queries: <span class="hljs-subst">{mini_questions}</span>
    Related Chunks: 
    <span class="hljs-subst">{mini_chunk_str}</span>
    &quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> summary_prompt
<button class="copy-code-btn"></button></code></pre>
<p>Cette approche présente l'avantage, par rapport à notre prototype qui analysait chaque question séparément et concaténait simplement les résultats, de produire un rapport dont toutes les sections sont cohérentes entre elles, c'est-à-dire qu'elles ne contiennent pas d'informations répétées ou contradictoires. Un système plus complexe pourrait combiner des aspects des deux, en utilisant un flux d'exécution conditionnelle pour structurer le rapport, résumer, réécrire, réfléchir et pivoter, et ainsi de suite, ce que nous laissons pour des travaux futurs.</p>
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
    </button></h2><p>Voici un échantillon du rapport généré par la requête "Comment les Simpsons ont-ils changé au fil du temps ?" avec DeepSeek-R1 qui utilise la page Wikipédia sur les Simpsons comme source :</p>
<pre><code translate="no" class="language-txt"><span class="hljs-title class_">Report</span>: <span class="hljs-title class_">The</span> <span class="hljs-title class_">Evolution</span> <span class="hljs-keyword">of</span> <span class="hljs-title class_">The</span> <span class="hljs-title class_">Simpsons</span> (<span class="hljs-number">1989</span>–<span class="hljs-title class_">Present</span>)
<span class="hljs-number">1.</span> <span class="hljs-title class_">Cultural</span> <span class="hljs-title class_">Impact</span> and <span class="hljs-title class_">Societal</span> <span class="hljs-title class_">Relevance</span>
<span class="hljs-title class_">The</span> <span class="hljs-title class_">Simpsons</span> debuted <span class="hljs-keyword">as</span> a subversive critique <span class="hljs-keyword">of</span> <span class="hljs-title class_">American</span> middle-<span class="hljs-keyword">class</span> <span class="hljs-title class_">life</span>, gaining notoriety <span class="hljs-keyword">for</span> its bold satire <span class="hljs-keyword">in</span> the 1990s. <span class="hljs-title class_">Initially</span> a countercultural phenomenon, it challenged norms <span class="hljs-keyword">with</span> episodes tackling religion, politics, and consumerism. <span class="hljs-title class_">Over</span> time, its cultural dominance waned <span class="hljs-keyword">as</span> competitors like <span class="hljs-title class_">South</span> <span class="hljs-title class_">Park</span> and <span class="hljs-title class_">Family</span> <span class="hljs-title class_">Guy</span> pushed boundaries further. <span class="hljs-title class_">By</span> the 2010s, the show transitioned <span class="hljs-keyword">from</span> trendsetter to nostalgic institution, balancing legacy appeal <span class="hljs-keyword">with</span> attempts to address modern issues like climate change and <span class="hljs-variable constant_">LGBTQ</span>+ rights, albeit <span class="hljs-keyword">with</span> less societal resonance.
…
<span class="hljs-title class_">Conclusion</span>
<span class="hljs-title class_">The</span> <span class="hljs-title class_">Simpsons</span> evolved <span class="hljs-keyword">from</span> a radical satire to a television institution, navigating shifts <span class="hljs-keyword">in</span> technology, politics, and audience expectations. <span class="hljs-title class_">While</span> its golden-age brilliance remains unmatched, its adaptability—through streaming, updated humor, and <span class="hljs-variable language_">global</span> outreach—secures its place <span class="hljs-keyword">as</span> a cultural touchstone. <span class="hljs-title class_">The</span> show’s longevity reflects both nostalgia and a pragmatic embrace <span class="hljs-keyword">of</span> change, even <span class="hljs-keyword">as</span> it grapples <span class="hljs-keyword">with</span> the challenges <span class="hljs-keyword">of</span> relevance <span class="hljs-keyword">in</span> a fragmented media landscape.
<button class="copy-code-btn"></button></code></pre>
<p>Vous trouverez <a href="https://drive.google.com/file/d/1GE3rvxFFTKqro67ctTkknryUf-ojhduN/view?usp=sharing">le rapport complet ici</a>, ainsi qu'<a href="https://drive.google.com/file/d/1EGd16sJDNFnssk9yTd5o9jzbizrY_NS_/view?usp=sharing">un rapport produit par DeepSearcher avec GPT-4o mini</a> pour comparaison.</p>
<h2 id="Discussion" class="common-anchor-header">Discussion<button data-href="#Discussion" class="anchor-icon" translate="no">
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
    </button></h2><p>Nous avons présenté <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a>, un agent permettant d'effectuer des recherches et de rédiger des rapports. Notre système est construit sur l'idée de notre article précédent, en ajoutant des fonctionnalités telles que le flux d'exécution conditionnel, le routage des requêtes, et une interface améliorée. Nous sommes passés de l'inférence locale avec un petit modèle de raisonnement quantifié de 4 bits à un service d'inférence en ligne pour le modèle massif DeepSeek-R1, ce qui a permis d'améliorer qualitativement notre rapport de sortie. DeepSearcher fonctionne avec la plupart des services d'inférence comme OpenAI, Gemini, DeepSeek et Grok 3 (bientôt !).</p>
<p>Les modèles de raisonnement, en particulier ceux utilisés dans les agents de recherche, reposent sur l'inférence, et nous avons eu la chance de pouvoir utiliser l'offre la plus rapide de DeepSeek-R1 de SambaNova, qui fonctionne sur leur matériel personnalisé. Pour notre requête de démonstration, nous avons effectué soixante-cinq appels au service d'inférence DeepSeek-R1 de SambaNova, entrant environ 25k tokens, sortant 22k tokens, et coûtant 0,30 $. Nous avons été impressionnés par la vitesse d'inférence étant donné que le modèle contient 671 milliards de paramètres et a une taille de 3/4 de téraoctet. <a href="https://sambanova.ai/press/fastest-deepseek-r1-671b-with-highest-efficiency">Pour plus de détails, cliquez ici !</a></p>
<p>Nous continuerons à itérer sur ce travail dans de futurs articles, en examinant d'autres concepts agentiques et l'espace de conception des agents de recherche. En attendant, nous invitons tout le monde à essayer <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a>, à <a href="https://github.com/zilliztech/deep-searcher">nous suivre sur GitHub</a> et à nous faire part de vos commentaires !</p>
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
<li><p><a href="https://github.com/zilliztech/deep-searcher"><strong>DeepSearcher de Zilliz</strong></a></p></li>
<li><p>Lecture de fond : <a href="https://milvus.io/blog/i-built-a-deep-research-with-open-source-so-can-you.md"><strong><em>"J'ai construit un Deep Research avec Open Source-et vous le pouvez aussi !"</em></strong></a></p></li>
<li><p>"<a href="https://sambanova.ai/press/fastest-deepseek-r1-671b-with-highest-efficiency"><strong>SambaNova lance le DeepSeek-R1 671B le plus rapide et le plus efficace</strong></a><em>.</em></p></li>
<li><p>DeepSearcher : <a href="https://drive.google.com/file/d/1GE3rvxFFTKqro67ctTkknryUf-ojhduN/view?usp=sharing">Rapport DeepSeek-R1 sur les Simpsons</a></p></li>
<li><p>DeepSearcher : <a href="https://drive.google.com/file/d/1EGd16sJDNFnssk9yTd5o9jzbizrY_NS_/view?usp=sharing">GPT-4o mini rapport sur Les Simpson</a></p></li>
<li><p><a href="https://milvus.io/docs">Base de données vectorielles open-source Milvus</a></p></li>
</ul>
