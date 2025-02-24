---
id: introduce-deepsearcher-a-local-open-source-deep-research.md
title: 'Wir stellen DeepSearcher vor: Eine lokale Open-Source-Tiefenforschung'
author: Stefan Webb
date: 2025-02-21T00:00:00.000Z
desc: >-
  Im Gegensatz zu OpenAIs Deep Research wurde dieses Beispiel lokal ausgeführt,
  wobei nur Open-Source-Modelle und -Tools wie Milvus und LangChain verwendet
  wurden.
cover: >-
  assets.zilliz.com/Introducing_Deep_Searcher_A_Local_Open_Source_Deep_Research_4d00da5b85.png
tag: Announcements
tags: DeepSearcher
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/introduce-deepsearcher-a-local-open-source-deep-research
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/deep_researcher_a0170dadd0.gif" alt="deep researcher.gif" class="doc-image" id="deep-researcher.gif" />
   </span> <span class="img-wrapper"> <span>deep researcher.gif</span> </span></p>
<p>Im vorigen Beitrag <a href="https://milvus.io/blog/i-built-a-deep-research-with-open-source-so-can-you.md"><em>"I Built a Deep Research with Open Source-and So Can You!"</em></a> haben wir einige der Prinzipien erklärt, die den Forschungsagenten zugrunde liegen, und einen einfachen Prototyp gebaut, der detaillierte Berichte zu einem bestimmten Thema oder einer Frage erstellt. In dem Artikel und dem dazugehörigen Notebook wurden die grundlegenden Konzepte der <em>Werkzeugnutzung</em>, der <em>Zerlegung von Abfragen</em>, der <em>Argumentation</em> und der <em>Reflexion</em> erläutert. Das Beispiel in unserem letzten Beitrag lief im Gegensatz zu OpenAIs Deep Research lokal und verwendete nur Open-Source-Modelle und -Tools wie <a href="https://milvus.io/docs">Milvus</a> und LangChain. (Ich empfehle Ihnen, den <a href="https://milvus.io/blog/i-built-a-deep-research-with-open-source-so-can-you.md">obigen Artikel</a> zu lesen, bevor Sie fortfahren.)</p>
<p>In den folgenden Wochen wuchs das Interesse am Verständnis und an der Reproduktion von OpenAIs Deep Research explosionsartig an. Siehe z. B. <a href="https://www.perplexity.ai/hub/blog/introducing-perplexity-deep-research">Perplexity Deep Research</a> und <a href="https://huggingface.co/blog/open-deep-research">Hugging Face's Open DeepResearch</a>. Diese Tools unterscheiden sich in ihrer Architektur und Methodik, haben aber ein gemeinsames Ziel: iterative Recherche zu einem Thema oder einer Frage durch Surfen im Internet oder in internen Dokumenten und Ausgabe eines detaillierten, fundierten und gut strukturierten Berichts. Wichtig ist, dass der zugrundeliegende Agent automatisch entscheidet, welche Maßnahmen bei jedem Zwischenschritt zu ergreifen sind.</p>
<p>In diesem Beitrag bauen wir auf unserem vorherigen Beitrag auf und stellen das Open-Source-Projekt <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a> von Zilliz vor. Unser Agent demonstriert zusätzliche Konzepte: <em>Abfrage-Routing, bedingter Ausführungsfluss</em> und <em>Web-Crawling als Werkzeug</em>. Er wird als Python-Bibliothek und Kommandozeilen-Tool und nicht als Jupyter-Notizbuch präsentiert und verfügt über einen größeren Funktionsumfang als unser letzter Beitrag. So kann es beispielsweise mehrere Quelldokumente eingeben und das Einbettungsmodell und die verwendete Vektordatenbank über eine Konfigurationsdatei festlegen. Obwohl DeepSearcher noch relativ einfach ist, ist es ein großartiges Beispiel für agentenbasiertes RAG und ein weiterer Schritt in Richtung einer modernen KI-Anwendung.</p>
<p>Außerdem untersuchen wir den Bedarf an schnelleren und effizienteren Inferenzdiensten. Reasoning-Modelle nutzen "Inferenz-Skalierung", d. h. zusätzliche Berechnungen, um ihre Ergebnisse zu verbessern, und dies in Verbindung mit der Tatsache, dass ein einziger Bericht Hunderte oder Tausende von LLM-Aufrufen erfordern kann, führt dazu, dass die Inferenz-Bandbreite der primäre Engpass ist. Wir verwenden das <a href="https://sambanova.ai/press/fastest-deepseek-r1-671b-with-highest-efficiency">DeepSeek-R1-Schlussfolgermodell auf der eigens entwickelten Hardware von SambaNova</a>, die in Bezug auf die Ausgabe von Token pro Sekunde doppelt so schnell ist wie die des nächsten Wettbewerbers (siehe Abbildung unten).</p>
<p>SambaNova Cloud bietet auch Inferenz-as-a-Service für andere Open-Source-Modelle wie Llama 3.x, Qwen2.5 und QwQ. Der Inferenzdienst läuft auf einem von SambaNova entwickelten Chip, der rekonfigurierbaren Datenflusseinheit (RDU), die speziell für die effiziente Inferenz von generativen KI-Modellen entwickelt wurde und die Kosten senkt und die Inferenzgeschwindigkeit erhöht. <a href="https://sambanova.ai/technology/sn40l-rdu-ai-chip">Weitere Informationen finden Sie auf der Website des Unternehmens.</a></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Output_speed_deepseek_r1_d820329f0a.png" alt="Output speed- deepseek r1.png" class="doc-image" id="output-speed--deepseek-r1.png" />
   </span> <span class="img-wrapper"> <span>Ausgabegeschwindigkeit - deepseek r1.png</span> </span></p>
<h2 id="DeepSearcher-Architecture" class="common-anchor-header">DeepSearcher-Architektur<button data-href="#DeepSearcher-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Architektur von <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a> folgt unserem vorherigen Beitrag, in dem das Problem in vier Schritte unterteilt wurde: <em>Definieren/Verfeinern der Frage</em>, <em>Recherchieren</em>, <em>Analysieren</em>, <em>Synthetisieren</em> - diesmal allerdings mit einigen Überschneidungen. Wir gehen jeden Schritt durch und heben dabei die Verbesserungen von <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a>hervor.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/deepsearcher_architecture_088c7066d1.png" alt="deepsearcher architecture.png" class="doc-image" id="deepsearcher-architecture.png" />
   </span> <span class="img-wrapper"> <span>deepsearcher-architektur.png</span> </span></p>
<h3 id="Define-and-Refine-the-Question" class="common-anchor-header">Definieren und Verfeinern der Frage</h3><pre><code translate="no" class="language-txt">Break down the original query <span class="hljs-keyword">into</span> <span class="hljs-keyword">new</span> sub queries: [
  <span class="hljs-string">&#x27;How has the cultural impact and societal relevance of The Simpsons evolved from its debut to the present?&#x27;</span>,
  <span class="hljs-string">&#x27;What changes in character development, humor, and storytelling styles have occurred across different seasons of The Simpsons?&#x27;</span>, 
  <span class="hljs-string">&#x27;How has the animation style and production technology of The Simpsons changed over time?&#x27;</span>,
  <span class="hljs-string">&#x27;How have audience demographics, reception, and ratings of The Simpsons shifted throughout its run?&#x27;</span>]
<button class="copy-code-btn"></button></code></pre>
<p>Bei der Entwicklung von DeepSearcher sind die Grenzen zwischen Recherche und Verfeinerung der Frage fließend. Die ursprüngliche Benutzeranfrage wird in Unterabfragen zerlegt, ähnlich wie im vorherigen Beitrag. Siehe oben für erste Unterabfragen, die aus der Abfrage "Wie haben sich die Simpsons im Laufe der Zeit verändert? In den folgenden Rechercheschritten wird die Frage jedoch je nach Bedarf weiter verfeinert.</p>
<h3 id="Research-and-Analyze" class="common-anchor-header">Recherchieren und Analysieren</h3><p>Nachdem die Abfrage in Unterabfragen zerlegt wurde, beginnt der Rechercheteil des Agenten. Er besteht, grob gesagt, aus vier Schritten: <em>Routing</em>, <em>Suche</em>, <em>Reflexion und bedingte Wiederholung</em>.</p>
<h4 id="Routing" class="common-anchor-header">Weiterleitung</h4><p>Unsere Datenbank enthält mehrere Tabellen oder Sammlungen aus verschiedenen Quellen. Es wäre effizienter, wenn wir unsere semantische Suche auf die Quellen beschränken könnten, die für die jeweilige Anfrage relevant sind. Ein Abfrage-Router veranlasst einen LLM zu entscheiden, aus welchen Sammlungen Informationen abgerufen werden sollen.</p>
<p>Hier ist die Methode, um die Abfrage-Routing-Aufforderung zu bilden:</p>
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
<p>Wir sorgen dafür, dass der LLM eine strukturierte Ausgabe als JSON zurückgibt, um seine Ausgabe leicht in eine Entscheidung über das weitere Vorgehen umwandeln zu können.</p>
<h4 id="Search" class="common-anchor-header">Suche</h4><p>Nachdem im vorherigen Schritt verschiedene Datenbanksammlungen ausgewählt wurden, führt der Suchschritt eine Ähnlichkeitssuche mit <a href="https://milvus.io/docs">Milvus</a> durch. Ähnlich wie im vorangegangenen Beitrag wurden die Quelldaten im Voraus festgelegt, gechunked, eingebettet und in der Vektordatenbank gespeichert. Für DeepSearcher müssen die Datenquellen, sowohl lokal als auch online, manuell angegeben werden. Die Online-Suche ist ein Thema für zukünftige Arbeiten.</p>
<h4 id="Reflection" class="common-anchor-header">Reflexion</h4><p>Im Gegensatz zum vorherigen Beitrag zeigt DeepSearcher eine echte Form der agentenbasierten Reflexion, indem die vorherigen Ergebnisse als Kontext in eine Eingabeaufforderung eingegeben werden, die darüber "reflektiert", ob die bisher gestellten Fragen und die relevanten abgerufenen Chunks Informationslücken enthalten. Dies kann als ein Analyseschritt angesehen werden.</p>
<p>Hier ist die Methode zur Erstellung des Prompts:</p>
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
<p>Erneut bringen wir den LLM dazu, eine strukturierte Ausgabe zu liefern, diesmal als in Python interpretierbare Daten.</p>
<p>Hier ist ein Beispiel für neue Unterabfragen, die durch Reflexion "entdeckt" wurden, nachdem die anfänglichen Unterabfragen oben beantwortet wurden:</p>
<pre><code translate="no">New search queries <span class="hljs-keyword">for</span> <span class="hljs-built_in">next</span> iteration: [
  <span class="hljs-string">&quot;How have changes in The Simpsons&#x27; voice cast and production team influenced the show&#x27;s evolution over different seasons?&quot;</span>,
  <span class="hljs-string">&quot;What role has The Simpsons&#x27; satire and social commentary played in its adaptation to contemporary issues across decades?&quot;</span>,
  <span class="hljs-string">&#x27;How has The Simpsons addressed and incorporated shifts in media consumption, such as streaming services, into its distribution and content strategies?&#x27;</span>]
<button class="copy-code-btn"></button></code></pre>
<h4 id="Conditional-Repeat" class="common-anchor-header">Bedingte Wiederholung</h4><p>Im Gegensatz zu unserem vorherigen Beitrag veranschaulicht DeepSearcher den Ablauf der bedingten Ausführung. Nach der Reflexion darüber, ob die bisherigen Fragen und Antworten vollständig sind, wiederholt der Agent die obigen Schritte, wenn weitere Fragen gestellt werden müssen. Wichtig ist, dass der Ausführungsfluss (eine while-Schleife) eine Funktion des LLM-Outputs ist und nicht hart kodiert wurde. In diesem Fall gibt es nur eine binäre Wahl: <em>Wiederholung der Recherche</em> oder <em>Erstellung eines Berichts</em>. Bei komplexeren Agenten kann es mehrere geben, wie z. B.: <em>Hyperlink folgen</em>, <em>Chunks abrufen, im Speicher ablegen, reflektieren</em> usw. Auf diese Weise wird die Frage immer weiter verfeinert, bis der Agent beschließt, die Schleife zu verlassen und den Bericht zu erstellen. In unserem Simpsons-Beispiel führt DeepSearcher zwei weitere Runden durch, um die Lücken mit zusätzlichen Unterabfragen zu füllen.</p>
<h3 id="Synthesize" class="common-anchor-header">Synthetisieren</h3><p>Schließlich werden die vollständig zerlegte Frage und die abgerufenen Chunks zu einem Bericht mit einer einzigen Eingabeaufforderung zusammengesetzt. Hier ist der Code zur Erstellung der Eingabeaufforderung:</p>
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
<p>Dieser Ansatz hat gegenüber unserem Prototyp, bei dem jede Frage separat analysiert und die Ergebnisse einfach zusammengefügt wurden, den Vorteil, dass ein Bericht erstellt wird, bei dem alle Abschnitte miteinander konsistent sind, d. h. keine wiederholten oder widersprüchlichen Informationen enthalten. Ein komplexeres System könnte Aspekte von beidem kombinieren, indem es einen bedingten Ausführungsablauf verwendet, um den Bericht zu strukturieren, zusammenzufassen, umzuschreiben, zu reflektieren und auszurichten, usw., was wir für zukünftige Arbeiten vorsehen.</p>
<h2 id="Results" class="common-anchor-header">Ergebnisse<button data-href="#Results" class="anchor-icon" translate="no">
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
    </button></h2><p>Hier ist ein Beispiel aus dem Bericht, der durch die Abfrage "Wie haben sich die Simpsons im Laufe der Zeit verändert?" mit DeepSeek-R1 erstellt wurde, wobei die Wikipedia-Seite über die Simpsons als Quellmaterial verwendet wurde:</p>
<pre><code translate="no" class="language-txt"><span class="hljs-title class_">Report</span>: <span class="hljs-title class_">The</span> <span class="hljs-title class_">Evolution</span> <span class="hljs-keyword">of</span> <span class="hljs-title class_">The</span> <span class="hljs-title class_">Simpsons</span> (<span class="hljs-number">1989</span>–<span class="hljs-title class_">Present</span>)
<span class="hljs-number">1.</span> <span class="hljs-title class_">Cultural</span> <span class="hljs-title class_">Impact</span> and <span class="hljs-title class_">Societal</span> <span class="hljs-title class_">Relevance</span>
<span class="hljs-title class_">The</span> <span class="hljs-title class_">Simpsons</span> debuted <span class="hljs-keyword">as</span> a subversive critique <span class="hljs-keyword">of</span> <span class="hljs-title class_">American</span> middle-<span class="hljs-keyword">class</span> <span class="hljs-title class_">life</span>, gaining notoriety <span class="hljs-keyword">for</span> its bold satire <span class="hljs-keyword">in</span> the 1990s. <span class="hljs-title class_">Initially</span> a countercultural phenomenon, it challenged norms <span class="hljs-keyword">with</span> episodes tackling religion, politics, and consumerism. <span class="hljs-title class_">Over</span> time, its cultural dominance waned <span class="hljs-keyword">as</span> competitors like <span class="hljs-title class_">South</span> <span class="hljs-title class_">Park</span> and <span class="hljs-title class_">Family</span> <span class="hljs-title class_">Guy</span> pushed boundaries further. <span class="hljs-title class_">By</span> the 2010s, the show transitioned <span class="hljs-keyword">from</span> trendsetter to nostalgic institution, balancing legacy appeal <span class="hljs-keyword">with</span> attempts to address modern issues like climate change and <span class="hljs-variable constant_">LGBTQ</span>+ rights, albeit <span class="hljs-keyword">with</span> less societal resonance.
…
<span class="hljs-title class_">Conclusion</span>
<span class="hljs-title class_">The</span> <span class="hljs-title class_">Simpsons</span> evolved <span class="hljs-keyword">from</span> a radical satire to a television institution, navigating shifts <span class="hljs-keyword">in</span> technology, politics, and audience expectations. <span class="hljs-title class_">While</span> its golden-age brilliance remains unmatched, its adaptability—through streaming, updated humor, and <span class="hljs-variable language_">global</span> outreach—secures its place <span class="hljs-keyword">as</span> a cultural touchstone. <span class="hljs-title class_">The</span> show’s longevity reflects both nostalgia and a pragmatic embrace <span class="hljs-keyword">of</span> change, even <span class="hljs-keyword">as</span> it grapples <span class="hljs-keyword">with</span> the challenges <span class="hljs-keyword">of</span> relevance <span class="hljs-keyword">in</span> a fragmented media landscape.
<button class="copy-code-btn"></button></code></pre>
<p>Den <a href="https://drive.google.com/file/d/1GE3rvxFFTKqro67ctTkknryUf-ojhduN/view?usp=sharing">vollständigen Bericht</a> finden Sie <a href="https://drive.google.com/file/d/1GE3rvxFFTKqro67ctTkknryUf-ojhduN/view?usp=sharing">hier</a>, und <a href="https://drive.google.com/file/d/1EGd16sJDNFnssk9yTd5o9jzbizrY_NS_/view?usp=sharing">einen von DeepSearcher mit GPT-4o mini erstellten Bericht</a> zum Vergleich.</p>
<h2 id="Discussion" class="common-anchor-header">Diskussion<button data-href="#Discussion" class="anchor-icon" translate="no">
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
    </button></h2><p>Wir haben <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a> vorgestellt, einen Agenten zur Durchführung von Recherchen und zum Schreiben von Berichten. Unser System baut auf der Idee in unserem vorherigen Artikel auf und fügt Funktionen wie bedingten Ausführungsfluss, Abfrage-Routing und eine verbesserte Schnittstelle hinzu. Wir sind von lokaler Inferenz mit einem kleinen quantisierten 4-Bit-Schlussfolgermodell zu einem Online-Inferenzdienst für das massive DeepSeek-R1-Modell übergegangen, was unseren Ausgabebericht qualitativ verbessert. DeepSearcher arbeitet mit den meisten Inferenzdiensten wie OpenAI, Gemini, DeepSeek und Grok 3 (in Kürze!).</p>
<p>Reasoning-Modelle, vor allem in Forschungsagenten, sind inferenzlastig, und wir hatten das Glück, das schnellste Angebot von DeepSeek-R1 von SambaNova auf ihrer eigenen Hardware nutzen zu können. Für unsere Demonstrationsabfrage haben wir fünfundsechzig Aufrufe des DeepSeek-R1-Inferenzdienstes von SambaNova durchgeführt, bei denen etwa 25k Token eingegeben und 22k Token ausgegeben wurden und die $0,30 kosteten. Wir waren beeindruckt von der Geschwindigkeit der Inferenz, wenn man bedenkt, dass das Modell 671 Milliarden Parameter enthält und ein 3/4 Terabyte groß ist. <a href="https://sambanova.ai/press/fastest-deepseek-r1-671b-with-highest-efficiency">Mehr Details finden Sie hier!</a></p>
<p>Wir werden diese Arbeit in zukünftigen Beiträgen weiter ausbauen und weitere agenturische Konzepte und den Designraum von Forschungsagenten untersuchen. In der Zwischenzeit laden wir alle ein, <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a> auszuprobieren, <a href="https://github.com/zilliztech/deep-searcher">uns auf GitHub zu bewerten</a> und uns Ihr Feedback mitzuteilen!</p>
<h2 id="Resources" class="common-anchor-header">Ressourcen<button data-href="#Resources" class="anchor-icon" translate="no">
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
<li><p><a href="https://github.com/zilliztech/deep-searcher"><strong>Zilliz' DeepSearcher</strong></a></p></li>
<li><p>Hintergrundlektüre: <a href="https://milvus.io/blog/i-built-a-deep-research-with-open-source-so-can-you.md"><strong><em>"Ich habe DeepSearcher mit Open Source aufgebaut - und das können Sie auch!"</em></strong></a></p></li>
<li><p><a href="https://sambanova.ai/press/fastest-deepseek-r1-671b-with-highest-efficiency"><strong>"SambaNova startet den schnellsten DeepSeek-R1 671B mit der höchsten Effizienz</strong></a><em>"</em></p></li>
<li><p>DeepSearcher: <a href="https://drive.google.com/file/d/1GE3rvxFFTKqro67ctTkknryUf-ojhduN/view?usp=sharing">DeepSeek-R1-Bericht über Die Simpsons</a></p></li>
<li><p>DeepSearcher: <a href="https://drive.google.com/file/d/1EGd16sJDNFnssk9yTd5o9jzbizrY_NS_/view?usp=sharing">GPT-4o-Mini-Bericht zu den Simpsons</a></p></li>
<li><p><a href="https://milvus.io/docs">Milvus Open-Source-Vektor-Datenbank</a></p></li>
</ul>
