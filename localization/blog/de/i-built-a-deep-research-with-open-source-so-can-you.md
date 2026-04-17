---
id: i-built-a-deep-research-with-open-source-so-can-you.md
title: >-
  Ich habe eine tiefgehende Forschung mit Open Source aufgebaut - und Sie können
  das auch!
author: Stefan Webb
date: 2025-02-6
desc: >-
  Lernen Sie, wie Sie mit Open-Source-Tools wie Milvus, DeepSeek R1 und
  LangChain einen Agenten im Stil von Deep Research erstellen können.
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
<p>Nun, eigentlich ein Agent mit minimalem Umfang, der logisch denken, planen, Werkzeuge verwenden usw. kann, um mit Wikipedia zu recherchieren. Trotzdem, nicht schlecht für ein paar Stunden Arbeit...</p>
<p>Wenn Sie nicht unter einem Felsen, in einer Höhle oder in einem abgelegenen Bergkloster wohnen, werden Sie von der Veröffentlichung von <em>Deep Research</em> durch OpenAI am 2. Februar 2025 gehört haben. Dieses neue Produkt verspricht, die Art und Weise zu revolutionieren, wie wir Fragen beantworten, die die Synthese großer Mengen unterschiedlicher Informationen erfordern.</p>
<p>Sie geben Ihre Anfrage ein, wählen die Option "Deep Research", und die Plattform durchsucht selbstständig das Internet, führt Schlussfolgerungen zu den gefundenen Informationen durch und fasst mehrere Quellen zu einem kohärenten, vollständig zitierten Bericht zusammen. Im Vergleich zu einem Standard-Chatbot dauert die Erstellung des Berichts um mehrere Größenordnungen länger, aber das Ergebnis ist detaillierter, fundierter und nuancierter.</p>
<h2 id="How-does-it-work" class="common-anchor-header">Wie funktioniert das?<button data-href="#How-does-it-work" class="anchor-icon" translate="no">
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
    </button></h2><p>Aber wie funktioniert diese Technologie, und warum ist Deep Research eine spürbare Verbesserung gegenüber früheren Versuchen (wie Googles <em>Deep Research</em> - Warnung vor eingehenden Markenrechtsstreitigkeiten)? Letzteres werden wir in einem späteren Beitrag behandeln. Was die erste Frage betrifft, so steckt hinter Deep Research zweifellos eine Menge "Geheimzutaten". Wir können ein paar Details aus der Veröffentlichung von OpenAI entnehmen, die ich hier zusammenfasse.</p>
<p><strong>Deep Research macht sich die jüngsten Fortschritte bei den Grundlagenmodellen zunutze, die auf logische Aufgaben spezialisiert sind:</strong></p>
<ul>
<li><p>"...fein abgestimmt auf das kommende OpenAI o3 Reasoning Model..."</p></li>
<li><p>"...nutzt Schlussfolgerungen, um riesige Textmengen zu durchsuchen, zu interpretieren und zu analysieren..."</p></li>
</ul>
<p><strong>Deep Research nutzt einen ausgeklügelten agentenbasierten Arbeitsablauf mit Planung, Reflexion und Gedächtnis:</strong></p>
<ul>
<li><p>"...hat gelernt, eine mehrstufige Trajektorie zu planen und auszuführen..."</p></li>
<li><p>"...Zurückverfolgen und Reagieren auf Echtzeit-Informationen..."</p></li>
<li><p>"...bei Bedarf auf Informationen zu reagieren, auf die es stößt..."</p></li>
</ul>
<p><strong>Deep Research wird anhand eigener Daten trainiert, wobei verschiedene Arten der Feinabstimmung zum Einsatz kommen, was wahrscheinlich eine Schlüsselkomponente für seine Leistung ist:</strong></p>
<ul>
<li><p>"...trainiert mit End-to-End Reinforcement Learning für schwierige Browsing- und Argumentationsaufgaben in einer Reihe von Domänen..."</p></li>
<li><p>"...optimiert für Web-Browsing und Datenanalyse..."</p></li>
</ul>
<p>Das genaue Design des agentenbasierten Arbeitsablaufs ist ein Geheimnis, aber wir können selbst etwas auf der Grundlage etablierter Ideen zur Strukturierung von Agenten entwickeln.</p>
<p><strong>Eine Anmerkung, bevor wir beginnen</strong>: Es ist leicht, sich vom Fieber der generativen KI mitreißen zu lassen, vor allem, wenn ein neues Produkt auf den Markt kommt, das eine deutliche Verbesserung zu sein scheint. Allerdings hat Deep Research, wie OpenAI einräumt, die gleichen Grenzen wie die generative KI-Technologie. Wir sollten daran denken, die Ergebnisse kritisch zu betrachten, denn sie können falsche Fakten ("Halluzinationen"), falsche Formatierungen und Zitate enthalten und je nach Zufallsgenerator in ihrer Qualität erheblich schwanken.</p>
<h2 id="Can-I-build-my-own" class="common-anchor-header">Kann ich meine eigene Software erstellen?<button data-href="#Can-I-build-my-own" class="anchor-icon" translate="no">
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
    </button></h2><p>Aber sicher! Lassen Sie uns unsere eigene "Deep Research" erstellen, die lokal und mit Open-Source-Tools läuft. Dazu brauchen wir nur ein Grundwissen über generative KI, gesunden Menschenverstand, ein paar Stunden Zeit, einen Grafikprozessor und die Open-Source-Tools <a href="https://milvus.io/docs">Milvus</a>, <a href="https://huggingface.co/unsloth/DeepSeek-R1-Distill-Llama-8B-unsloth-bnb-4bit">DeepSeek R1</a> und <a href="https://python.langchain.com/docs/introduction/">LangChain</a>.</p>
<p>Wir können natürlich nicht hoffen, die Leistung von OpenAI zu erreichen, aber unser Prototyp wird einige der Schlüsselideen, die wahrscheinlich ihrer Technologie zugrunde liegen, demonstrieren, indem wir Fortschritte bei den Argumentationsmodellen mit Fortschritten bei den agentenbasierten Arbeitsabläufen kombinieren. Wichtig ist, dass wir im Gegensatz zu OpenAI ausschließlich Open-Source-Tools verwenden werden und unser System lokal einsetzen können - Open-Source bietet uns eine große Flexibilität!</p>
<p>Wir werden ein paar vereinfachende Annahmen treffen, um den Umfang unseres Projekts zu reduzieren:</p>
<ul>
<li><p>Wir werden einen Open-Source-Schlußfolgerungsmodus verwenden, der destilliert und dann für 4-Bit <a href="https://zilliz.com/learn/unlock-power-of-vector-quantization-techniques-for-efficient-data-compression-and-retrieval">quantisiert wurde</a> und lokal ausgeführt werden kann.</p></li>
<li><p>Wir werden keine zusätzlichen Feinabstimmungen an unserem Argumentationsmodell selbst vornehmen.</p></li>
<li><p>Das einzige Werkzeug, über das unser Agent verfügt, ist die Fähigkeit, eine Wikipedia-Seite herunterzuladen und zu lesen und separate RAG-Abfragen durchzuführen (wir haben keinen Zugriff auf das gesamte Internet).</p></li>
<li><p>Unser Agent wird nur Textdaten verarbeiten, keine Bilder, PDFs, etc.</p></li>
<li><p>Unser Agent wird keine Rückverfolgung durchführen oder Pivots berücksichtigen.</p></li>
<li><p>Unser Agent wird (noch) nicht seinen Ausführungsfluss auf der Grundlage seiner Ausgabe steuern.</p></li>
<li><p>Wikipedia enthält die Wahrheit, die ganze Wahrheit und nichts als die Wahrheit.</p></li>
</ul>
<p>Wir werden <a href="https://milvus.io/docs">Milvus</a> für unsere Vektordatenbank, <a href="https://huggingface.co/unsloth/DeepSeek-R1-Distill-Llama-8B-unsloth-bnb-4bit">DeepSeek R1</a> als Schlussfolgerungsmodell und <a href="https://python.langchain.com/docs/introduction/">LangChain</a> zur Implementierung von RAG verwenden. Legen wir los!</p>
<custom-h1>Ein minimaler Agent für die Online-Recherche</custom-h1><p>Wir werden unser mentales Modell darüber, wie Menschen recherchieren, nutzen, um den agentenbasierten Arbeitsablauf zu entwerfen:</p>
<h3 id="DefineRefine-Question" class="common-anchor-header">Frage definieren/verfeinern</h3><p>Die Recherche beginnt mit der Definition einer Frage. Wir gehen davon aus, dass es sich bei der Frage um die Anfrage des Benutzers handelt. Wir verwenden jedoch unser Denkmodell, um sicherzustellen, dass die Frage spezifisch, klar und zielgerichtet formuliert ist. Das heißt, unser erster Schritt besteht darin, die Frage umzuschreiben und alle Unterfragen oder Unterabfragen zu extrahieren. Wir nutzen die Spezialisierung unserer Basismodelle für die Argumentation und eine einfache Methode für die strukturierte JSON-Ausgabe effektiv.</p>
<p>Hier ist ein Beispiel für eine Schlussfolgerungsspur, während DeepSeek die Frage "Wie hat sich die Besetzung im Laufe der Zeit verändert" verfeinert:</p>
<pre><code translate="no" class="language-text">&lt;think&gt;

Alright, so I need to <span class="hljs-built_in">break</span> down the question <span class="hljs-string">&quot;How has the cast changed over time?&quot;</span> related to the evolution of The Simpsons. Let me think about what aspects are involved here.

First, I know that the cast has changed a lot, but I need to figure out the intermediate questions to approach this. The main question is about changes <span class="hljs-keyword">in</span> the cast over <span class="hljs-keyword">time</span>, so I should consider different areas that contribute to this change.

I guess the first sub-question would be about the original cast members. Who were the main voices and how did they evolve? Then, there might be new cast additions over the years, so another sub-question about that.

Also, some original voice actors have left, so I should include a sub-question about departures. Then, new voice actors joining would be another point.

The show has been popular <span class="hljs-keyword">for</span> a long <span class="hljs-keyword">time</span>, so recurring roles changing might be another aspect. Additionally, the role of the show <span class="hljs-keyword">in</span> society might have influenced casting choices, so a sub-question about that.

Lastly, the overall impact on the cast<span class="hljs-string">&#x27;s careers could be another angle. So, I should list these as sub-questions to cover all aspects.

&lt;/think&gt;
</span><button class="copy-code-btn"></button></code></pre>
<h3 id="Search" class="common-anchor-header">Suche</h3><p>Als nächstes führen wir eine "Literaturrecherche" von Wikipedia-Artikeln durch. Im Moment lesen wir einen einzelnen Artikel und überlassen die Navigation zu den Links einer späteren Iteration. Beim Prototyping haben wir festgestellt, dass die Erkundung von Links sehr teuer werden kann, wenn jeder Link einen Aufruf des Argumentationsmodells erfordert. Wir parsen den Artikel und speichern seine Daten in unserer Vektordatenbank Milvus, ähnlich wie bei einer Notiz.</p>
<p>Hier ist ein Codeschnipsel, der zeigt, wie wir unsere Wikipedia-Seite in Milvus unter Verwendung der LangChain-Integration speichern:</p>
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
<h3 id="Analyze" class="common-anchor-header">Analysieren</h3><p>Der Agent kehrt zu seinen Fragen zurück und beantwortet sie auf der Grundlage der relevanten Informationen im Dokument. Wir werden einen mehrstufigen Analyse-/Reflexions-Workflow für künftige Arbeiten vorsehen, ebenso wie kritische Überlegungen zur Glaubwürdigkeit und Voreingenommenheit unserer Quellen.</p>
<p>Hier ist ein Codeschnipsel, der den Aufbau einer RAG mit LangChain und die Beantwortung unserer Unterfragen illustriert.</p>
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
<h3 id="Synthesize" class="common-anchor-header">Synthetisieren</h3><p>Nachdem der Agent seine Recherchen durchgeführt hat, erstellt er eine strukturierte Gliederung, oder besser gesagt ein Skelett, seiner Ergebnisse, die er in einem Bericht zusammenfasst. Anschließend vervollständigt er jeden Abschnitt, indem er ihn mit einem Titel und dem entsprechenden Inhalt versieht. Einen anspruchsvolleren Arbeitsablauf mit Reflexion, Neuordnung und Neuschreibung überlassen wir einer späteren Iteration. Dieser Teil des Agenten beinhaltet Planung, Werkzeugnutzung und Speicher.</p>
<p>Den vollständigen Code finden Sie im <a href="https://drive.google.com/file/d/1waKX_NTgiY-47bYE0cI6qD8Cjn3zjrL6/view?usp=sharing">beiliegenden Notizbuch</a> und die <a href="https://drive.google.com/file/d/15xeEe_EqY-29V2IlAvDy5yGdJdEPSHOh/view?usp=drive_link">gespeicherte Berichtsdatei</a> enthält ein Beispiel für die Ausgabe.</p>
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
    </button></h2><p>Unsere Testabfrage lautet <em>"Wie haben sich die Simpsons im Laufe der Zeit verändert?"</em>, und die Datenquelle ist der Wikipedia-Artikel zu "Die Simpsons". Hier ist ein Abschnitt des <a href="https://drive.google.com/file/d/15xeEe_EqY-29V2IlAvDy5yGdJdEPSHOh/view?usp=sharing">generierten Berichts</a>:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/result_query_424beba224.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Summary-What-we-built-and-what’s-next" class="common-anchor-header">Zusammenfassung: Was wir aufgebaut haben und wie es weitergeht<button data-href="#Summary-What-we-built-and-what’s-next" class="anchor-icon" translate="no">
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
    </button></h2><p>In nur wenigen Stunden haben wir einen grundlegenden agentenbasierten Arbeitsablauf entwickelt, der Informationen aus Wikipedia abrufen und planen kann, um einen strukturierten Forschungsbericht zu erstellen. Obwohl dieser Prototyp weit von OpenAIs Deep Research entfernt ist, zeigt er die Leistungsfähigkeit von Open-Source-Tools wie Milvus, DeepSeek und LangChain beim Aufbau autonomer Forschungsagenten.</p>
<p>Natürlich gibt es noch viel Raum für Verbesserungen. Zukünftige Iterationen könnten:</p>
<ul>
<li><p>Über Wikipedia hinausgehen und mehrere Quellen dynamisch durchsuchen</p></li>
<li><p>Backtracking und Reflexion einführen, um Antworten zu verfeinern</p></li>
<li><p>Optimierung des Ausführungsablaufs auf der Grundlage der eigenen Überlegungen des Agenten</p></li>
</ul>
<p>Open-Source bietet uns Flexibilität und Kontrolle, was bei Closed-Source nicht der Fall ist. Ob für die akademische Forschung, die Inhaltssynthese oder die KI-gestützte Unterstützung, die Entwicklung eigener Forschungsagenten eröffnet spannende Möglichkeiten. Bleiben Sie dran für den nächsten Beitrag, in dem wir das Hinzufügen von Echtzeit-Webabfragen, mehrstufigen Schlussfolgerungen und bedingten Ausführungsabläufen untersuchen!</p>
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
<li><p>Notizbuch: <em>"</em><a href="https://colab.research.google.com/drive/1W5tW8SqWXve7ZwbSb9pVdbt5R2wq105O?usp=sharing"><em>Grundlage für eine Open-Source-Tiefenforschung</em></a><em>"</em></p></li>
<li><p>Bericht:<a href="https://drive.google.com/file/d/15xeEe_EqY-29V2IlAvDy5yGdJdEPSHOh/view?usp=drive_link"><em>"Die Entwicklung von The Simpsons als Serie im Laufe der Zeit, mit Veränderungen in Inhalt, Humor, Charakterentwicklung, Animation und ihrer Rolle in der Gesellschaft</em></a><em>".</em></p></li>
<li><p><a href="https://milvus.io/docs">Dokumentation der Milvus-Vektor-Datenbank</a></p></li>
<li><p><a href="https://huggingface.co/unsloth/DeepSeek-R1-Distill-Llama-8B-unsloth-bnb-4bit">Destillierte und quantisierte DeepSeek R1 Modellseite</a></p></li>
<li><p><a href="https://python.langchain.com/docs/introduction/">️🔗 LangChain</a></p></li>
<li><p><a href="https://help.openai.com/en/articles/10500283-deep-research-faq">Deep Research FAQ | OpenAI Help Center</a></p></li>
</ul>
