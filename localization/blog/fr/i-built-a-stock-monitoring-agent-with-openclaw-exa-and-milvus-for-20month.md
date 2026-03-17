---
id: i-built-a-stock-monitoring-agent-with-openclaw-exa-and-milvus-for-20month.md
title: >-
  J'ai construit un agent de surveillance des actions avec OpenClaw, Exa et
  Milvus pour 20$/mois
author: Cheney Zhang
date: 2026-3-13
cover: assets.zilliz.com/blog_Open_Claw_3_510bc283aa.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'AI agent, stock monitoring agent, Milvus, vector database, OpenClaw'
meta_keywords: 'AI agent, stock monitoring agent, Milvus, vector database, OpenClaw'
meta_title: |
  OpenClaw Tutorial: AI Stock Agent with Exa and Milvus
desc: >-
  Un guide étape par étape pour construire un agent de surveillance des actions
  utilisant OpenClaw, Exa et Milvus. Brèves du matin, mémoire des transactions
  et alertes pour 20 $/mois.
origin: >-
  https://milvus.io/blog/i-built-a-stock-monitoring-agent-with-openclaw-exa-and-milvus-for-20month.md
---
<p>Je négocie des actions américaines à titre accessoire, ce qui est une façon polie de dire que je perds de l'argent dans le cadre de mon hobby. Mes collègues de travail plaisantent en disant que ma stratégie est la suivante : "acheter en fonction de l'excitation, vendre en fonction de la peur, répéter chaque semaine".</p>
<p>C'est la répétition qui me tue. Chaque fois que je regarde le marché, je finis par faire une opération que je n'avais pas prévue. Le pétrole monte en flèche, je vends dans la panique. L'action technologique qui a grimpé de 4 %, je la poursuis. Une semaine plus tard, je regarde l'historique de mes transactions et je me demande si <em>je n'ai pas fait exactement la même chose le trimestre dernier.</em></p>
<p>J'ai donc créé un agent avec OpenClaw qui surveille le marché à ma place et m'empêche de commettre les mêmes erreurs. Il ne négocie pas et ne touche pas à mon argent, car cela représenterait un trop grand risque pour la sécurité. En revanche, il m'évite de passer du temps à surveiller le marché et de commettre les mêmes erreurs.</p>
<p>Cet agent se compose de trois parties et coûte environ 20 dollars par mois :</p>
<ul>
<li><strong><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw</a></strong> <strong>, qui gère le tout en pilote automatique.</strong> OpenClaw fait fonctionner l'agent selon un rythme cardiaque de 30 minutes et ne m'envoie des pings que lorsque quelque chose a de l'importance, ce qui me permet de ne pas être pris de panique et de rester scotché à l'écran. Auparavant, plus je surveillais les prix, plus je réagissais de manière impulsive.</li>
<li><strong><a href="https://exa.ai/">Exa</a></strong> <strong>pour des recherches précises en temps réel.</strong> Exa parcourt et résume des sources d'information triées sur le volet selon un calendrier précis, ce qui me permet d'obtenir un briefing complet chaque matin. Auparavant, je passais une heure par jour à passer au crible le spam SEO et la spéculation pour trouver des informations fiables - et cela ne pouvait pas être automatisé parce que les sites financiers sont mis à jour quotidiennement pour lutter contre les scrappeurs.</li>
<li><strong><a href="https://milvus.io/">Milvus</a></strong> <strong>pour l'historique personnel et les préférences.</strong> Milvus conserve l'historique de mes transactions et l'agent le consulte avant que je prenne une décision - si je suis sur le point de répéter quelque chose que j'ai regretté, il me le signale. Auparavant, l'examen des transactions passées était suffisamment fastidieux pour que je ne le fasse pas, de sorte que les mêmes erreurs se reproduisaient avec des titres différents. <a href="https://zilliz.com/cloud">Zilliz Cloud</a> est la version entièrement gérée de Milvus. Si vous souhaitez une expérience sans tracas, Zilliz Cloud est une excellente option<a href="https://cloud.zilliz.com/signup">(un niveau gratuit est disponible</a>).</li>
</ul>
<p>Voici comment je l'ai configuré, étape par étape.</p>
<h2 id="Step-1-Get-Real-Time-Market-Intelligence-with-Exa" class="common-anchor-header">Étape 1 : Obtenir des informations en temps réel sur les marchés avec Exa<button data-href="#Step-1-Get-Real-Time-Market-Intelligence-with-Exa" class="anchor-icon" translate="no">
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
    </button></h2><p>Auparavant, j'avais essayé de parcourir des applications financières, d'écrire des scraps et d'examiner des terminaux de données professionnels. Mon expérience ? Les applications noyaient le signal sous le bruit, les scrapers tombaient constamment en panne et les API professionnelles étaient hors de prix. Exa est une API de recherche conçue pour les agents d'intelligence artificielle qui résout les problèmes susmentionnés.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Open_Claw_1_d15ac4d2e3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong><a href="https://exa.ai/">Exa</a></strong> est une API de recherche web qui renvoie des données structurées, prêtes pour l'IA, aux agents d'IA. Elle est alimentée par <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (le service entièrement géré de Milvus). Si Perplexity est un moteur de recherche utilisé par les humains, Exa est utilisé par l'IA. L'agent envoie une requête et Exa renvoie le texte de l'article, les phrases clés et les résumés sous forme de JSON - un résultat structuré que l'agent peut analyser et sur lequel il peut agir directement, sans qu'il soit nécessaire de faire du scraping.</p>
<p>Exa utilise également la recherche sémantique sous le capot, de sorte que l'agent peut effectuer des requêtes en langage naturel. Une requête telle que "Pourquoi l'action NVIDIA a-t-elle chuté malgré des résultats solides au quatrième trimestre 2026 ?" renvoie des analyses d'analystes de Reuters et Bloomberg, et non une page de clickbait SEO.</p>
<p>Exa propose une version gratuite - 1 000 recherches par mois, ce qui est plus que suffisant pour démarrer. Pour suivre le mouvement, installez le SDK et échangez votre propre clé API :</p>
<pre><code translate="no">pip install exa-py
<button class="copy-code-btn"></button></code></pre>
<p>Voici l'appel principal :</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> exa_py <span class="hljs-keyword">import</span> Exa

exa = Exa(api_key=<span class="hljs-string">&quot;your-api-key&quot;</span>)

<span class="hljs-comment"># Semantic search — describe what you want in plain language</span>
result = exa.search(
    <span class="hljs-string">&quot;Why did NVIDIA stock drop despite strong Q4 2026 earnings&quot;</span>,
    <span class="hljs-built_in">type</span>=<span class="hljs-string">&quot;neural&quot;</span>,          <span class="hljs-comment"># semantic search, not keyword</span>
    num_results=<span class="hljs-number">10</span>,
    start_published_date=<span class="hljs-string">&quot;2026-02-25&quot;</span>,   <span class="hljs-comment"># only search for latest information</span>
    contents={
        <span class="hljs-string">&quot;text&quot;</span>: {<span class="hljs-string">&quot;max_characters&quot;</span>: <span class="hljs-number">3000</span>},       <span class="hljs-comment"># get full article text</span>
        <span class="hljs-string">&quot;highlights&quot;</span>: {<span class="hljs-string">&quot;num_sentences&quot;</span>: <span class="hljs-number">3</span>},     <span class="hljs-comment"># key sentences</span>
        <span class="hljs-string">&quot;summary&quot;</span>: {<span class="hljs-string">&quot;query&quot;</span>: <span class="hljs-string">&quot;What caused the stock drop?&quot;</span>}  <span class="hljs-comment"># AI summary</span>
    }
)

<span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> result.results:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[<span class="hljs-subst">{r.published_date}</span>] <span class="hljs-subst">{r.title}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  Summary: <span class="hljs-subst">{r.summary}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  URL: <span class="hljs-subst">{r.url}</span>\n&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Le paramètre de contenu fait le gros du travail ici - le texte extrait l'article complet, les points forts extraient les phrases clés et le résumé génère un résumé ciblé sur la base d'une question que vous fournissez. Un appel à l'API remplace vingt minutes de recherche par onglets.</p>
<p>Ce modèle de base couvre beaucoup de choses, mais j'ai fini par construire quatre variantes pour gérer différentes situations que je rencontre régulièrement :</p>
<ul>
<li><strong>Filtrage en fonction de la crédibilité de la source.</strong> Pour l'analyse des bénéfices, je ne veux que Reuters, Bloomberg ou le Wall Street Journal - et non des fermes de contenu qui réécrivent leur rapport douze heures plus tard.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Only financial reports from trusted sources</span>
earnings = exa.search(
    <span class="hljs-string">&quot;NVIDIA Q4 2026 earnings analysis&quot;</span>,
    category=<span class="hljs-string">&quot;financial report&quot;</span>,
    num_results=<span class="hljs-number">5</span>,
    include_domains=[<span class="hljs-string">&quot;reuters.com&quot;</span>, <span class="hljs-string">&quot;bloomberg.com&quot;</span>, <span class="hljs-string">&quot;wsj.com&quot;</span>],
    contents={<span class="hljs-string">&quot;highlights&quot;</span>: <span class="hljs-literal">True</span>}
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Recherche d'analyses similaires.</strong> Lorsque je lis un bon article, je veux d'autres points de vue sur le même sujet sans avoir à les rechercher manuellement.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># &quot;Show me more analysis like this one&quot;</span>
similar = exa.find_similar(
    url=<span class="hljs-string">&quot;https://fortune.com/2026/02/25/nvidia-nvda-earnings-q4-results&quot;</span>,
    num_results=<span class="hljs-number">10</span>,
    start_published_date=<span class="hljs-string">&quot;2026-02-20&quot;</span>,
    contents={<span class="hljs-string">&quot;text&quot;</span>: {<span class="hljs-string">&quot;max_characters&quot;</span>: <span class="hljs-number">2000</span>}}
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Recherche approfondie pour les questions complexes.</strong> Un seul article ne suffit pas à répondre à certaines questions, comme la manière dont les tensions au Moyen-Orient affectent les chaînes d'approvisionnement en semi-conducteurs. La recherche approfondie fait la synthèse de plusieurs sources et renvoie des résumés structurés.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Complex question — needs multi-source synthesis</span>
deep_result = exa.search(
    <span class="hljs-string">&quot;How will Middle East tensions affect global tech supply chain and semiconductor stocks&quot;</span>,
    <span class="hljs-built_in">type</span>=<span class="hljs-string">&quot;deep&quot;</span>,
    num_results=<span class="hljs-number">8</span>,
    contents={
        <span class="hljs-string">&quot;summary&quot;</span>: {
            <span class="hljs-string">&quot;query&quot;</span>: <span class="hljs-string">&quot;Extract: 1) supply chain risk 2) stock impact 3) timeline&quot;</span>
        }
    }
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Suivi de l'actualité en temps réel.</strong> Pendant les heures d'ouverture des marchés, j'ai besoin d'informations de dernière minute filtrées uniquement sur la journée en cours.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Breaking news only — today&#x27; iss date 2026-03-05</span>
breaking = exa.search(
    <span class="hljs-string">&quot;US stock market breaking news today&quot;</span>,
    category=<span class="hljs-string">&quot;news&quot;</span>,
    num_results=<span class="hljs-number">20</span>,
    start_published_date=<span class="hljs-string">&quot;2026-03-05&quot;</span>,
    contents={<span class="hljs-string">&quot;highlights&quot;</span>: {<span class="hljs-string">&quot;num_sentences&quot;</span>: <span class="hljs-number">2</span>}}
)
<button class="copy-code-btn"></button></code></pre>
<p>J'ai rédigé une douzaine de modèles utilisant ces schémas, couvrant la politique de la Fed, les bénéfices des entreprises technologiques, les prix du pétrole et les indicateurs macroéconomiques. Ils s'exécutent automatiquement tous les matins et envoient les résultats sur mon téléphone. Ce qui prenait une heure de navigation se résume désormais à cinq minutes de lecture de résumés autour d'un café.</p>
<h2 id="Step-2-Store-Trading-History-in-Milvus-for-Smarter-Decisions" class="common-anchor-header">Étape 2 : Stocker l'historique des transactions dans Milvus pour prendre des décisions plus intelligentes<button data-href="#Step-2-Store-Trading-History-in-Milvus-for-Smarter-Decisions" class="anchor-icon" translate="no">
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
    </button></h2><p>Exa a résolu mon problème d'information. Mais je répétais toujours les mêmes opérations - vente panique lors des baisses qui se rétablissaient en quelques jours, et poursuite de l'élan sur des actions déjà surévaluées. J'agissais sous le coup de l'émotion, je le regrettais et j'oubliais la leçon à chaque fois qu'une situation similaire se présentait.</p>
<p>J'avais besoin d'une base de connaissances personnelle : quelque chose qui puisse stocker mes transactions passées, mon raisonnement et mes erreurs. Il ne s'agissait pas d'une base que je devais consulter manuellement (j'avais déjà essayé et je n'avais jamais tenu), mais d'une base que l'agent pouvait consulter de lui-même lorsqu'une situation similaire se présentait. Si je suis sur le point de répéter une erreur, je veux que l'agent me le dise avant que j'appuie sur le bouton. Faire correspondre la "situation actuelle" à l'"expérience passée" est un problème de recherche de similarité que les bases de données vectorielles résolvent, et j'en ai donc choisi une pour stocker mes données.</p>
<p>J'ai utilisé <a href="https://github.com/milvus-io/milvus-lite">Milvus Lite</a>, une version légère de Milvus qui s'exécute localement. Elle n'a pas de serveur et est parfaite pour le prototypage et l'expérimentation. J'ai divisé mes données en trois collections. La dimension d'intégration est de 1536 pour correspondre au modèle text-embedding-3-small d'OpenAI, qui peut être utilisé directement :</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI

milvus = MilvusClient(<span class="hljs-string">&quot;./my_investment_brain.db&quot;</span>)
llm = OpenAI()

<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed</span>(<span class="hljs-params">text: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">float</span>]:
    <span class="hljs-keyword">return</span> llm.embeddings.create(
        <span class="hljs-built_in">input</span>=text, model=<span class="hljs-string">&quot;text-embedding-3-small&quot;</span>
    ).data[<span class="hljs-number">0</span>].embedding

<span class="hljs-comment"># Collection 1: past decisions and lessons</span>
<span class="hljs-comment"># Every trade I make, I write a short review afterward</span>
milvus.create_collection(
    <span class="hljs-string">&quot;decisions&quot;</span>,
    dimension=<span class="hljs-number">1536</span>,
    auto_id=<span class="hljs-literal">True</span>
)

<span class="hljs-comment"># Collection 2: my preferences and biases</span>
<span class="hljs-comment"># Things like &quot;I tend to hold tech stocks too long&quot;</span>
milvus.create_collection(
    <span class="hljs-string">&quot;preferences&quot;</span>,
    dimension=<span class="hljs-number">1536</span>,
    auto_id=<span class="hljs-literal">True</span>
)

<span class="hljs-comment"># Collection 3: market patterns I&#x27;ve observed</span>
<span class="hljs-comment"># &quot;When VIX &gt; 30 and Fed is dovish, buy the dip usually works&quot;</span>
milvus.create_collection(
    <span class="hljs-string">&quot;patterns&quot;</span>,
    dimension=<span class="hljs-number">1536</span>,
    auto_id=<span class="hljs-literal">True</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Les trois collections correspondent à trois types de données personnelles, chacune avec une stratégie d'extraction différente :</p>
<table>
<thead>
<tr><th><strong>Type</strong></th><th><strong>Ce qu'il stocke</strong></th><th><strong>Comment l'agent l'utilise</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Préférences</strong></td><td>Préjugés, tolérance au risque, philosophie d'investissement ("J'ai tendance à conserver les actions technologiques trop longtemps")</td><td>Chargé dans le contexte de l'agent à chaque exécution</td></tr>
<tr><td><strong>Décisions et modèles</strong></td><td>Transactions passées spécifiques, leçons apprises, observations du marché</td><td>Récupérés par recherche de similarité uniquement lorsqu'une situation pertinente se présente</td></tr>
<tr><td><strong>Connaissances externes</strong></td><td>Rapports de recherche, documents SEC, données publiques</td><td>Non stockées dans Milvus - consultables via Exa</td></tr>
</tbody>
</table>
<p>J'ai créé trois collections différentes parce que les regrouper dans une seule collection reviendrait soit à gonfler chaque invite avec un historique de transactions non pertinent, soit à perdre des biais fondamentaux lorsqu'ils ne correspondent pas suffisamment à la requête en cours.</p>
<p>Une fois les collections créées, j'avais besoin d'un moyen de les alimenter automatiquement. Je ne voulais pas copier-coller les informations après chaque conversation avec l'agent, j'ai donc construit un extracteur de mémoire qui s'exécute à la fin de chaque session de chat.</p>
<p>L'extracteur fait deux choses : extraire et dédupliquer. L'extracteur demande au LLM d'extraire des informations structurées de la conversation - décisions, préférences, schémas, leçons - et de les acheminer vers la bonne collection. Avant de stocker quoi que ce soit, il vérifie la similarité avec ce qui existe déjà. Si une nouvelle information est similaire à plus de 92 % à une entrée existante, elle est ignorée.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json

<span class="hljs-keyword">def</span> <span class="hljs-title function_">extract_and_store_memories</span>(<span class="hljs-params">conversation: <span class="hljs-built_in">list</span>[<span class="hljs-built_in">dict</span>]</span>) -&gt; <span class="hljs-built_in">int</span>:
    <span class="hljs-string">&quot;&quot;&quot;
    After each chat session, extract personal insights
    and store them in Milvus automatically.
    &quot;&quot;&quot;</span>
    <span class="hljs-comment"># Ask LLM to extract structured memories from conversation</span>
    extraction_prompt = <span class="hljs-string">&quot;&quot;&quot;
    Analyze this conversation and extract any personal investment insights.
    Look for:
    1. DECISIONS: specific buy/sell actions and reasoning
    2. PREFERENCES: risk tolerance, sector biases, holding patterns
    3. PATTERNS: market observations, correlations the user noticed
    4. LESSONS: things the user learned or mistakes they reflected on

    Return a JSON array. Each item has:
    - &quot;type&quot;: one of &quot;decision&quot;, &quot;preference&quot;, &quot;pattern&quot;, &quot;lesson&quot;
    - &quot;content&quot;: the insight in 2-3 sentences
    - &quot;confidence&quot;: how explicitly the user stated this (high/medium/low)

    Only extract what the user clearly expressed. Do not infer or guess.
    If nothing relevant, return an empty array.
    &quot;&quot;&quot;</span>

    response = llm.chat.completions.create(
        model=<span class="hljs-string">&quot;gpt-4o&quot;</span>,
        messages=[
            {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: extraction_prompt},
            *conversation
        ],
        response_format={<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;json_object&quot;</span>}
    )

    memories = json.loads(response.choices[<span class="hljs-number">0</span>].message.content)
    stored = <span class="hljs-number">0</span>

    <span class="hljs-keyword">for</span> mem <span class="hljs-keyword">in</span> memories.get(<span class="hljs-string">&quot;items&quot;</span>, []):
        <span class="hljs-keyword">if</span> mem[<span class="hljs-string">&quot;confidence&quot;</span>] == <span class="hljs-string">&quot;low&quot;</span>:
            <span class="hljs-keyword">continue</span>    <span class="hljs-comment"># skip uncertain inferences</span>

        collection = {
            <span class="hljs-string">&quot;decision&quot;</span>: <span class="hljs-string">&quot;decisions&quot;</span>,
            <span class="hljs-string">&quot;lesson&quot;</span>: <span class="hljs-string">&quot;decisions&quot;</span>,
            <span class="hljs-string">&quot;preference&quot;</span>: <span class="hljs-string">&quot;preferences&quot;</span>,
            <span class="hljs-string">&quot;pattern&quot;</span>: <span class="hljs-string">&quot;patterns&quot;</span>
        }.get(mem[<span class="hljs-string">&quot;type&quot;</span>], <span class="hljs-string">&quot;decisions&quot;</span>)

        <span class="hljs-comment"># Check for duplicates — don&#x27;t store the same insight twice</span>
        existing = milvus.search(
            collection,
            data=[embed(mem[<span class="hljs-string">&quot;content&quot;</span>])],
            limit=<span class="hljs-number">1</span>,
            output_fields=[<span class="hljs-string">&quot;text&quot;</span>]
        )

        <span class="hljs-keyword">if</span> existing[<span class="hljs-number">0</span>] <span class="hljs-keyword">and</span> existing[<span class="hljs-number">0</span>][<span class="hljs-number">0</span>][<span class="hljs-string">&quot;distance&quot;</span>] &gt; <span class="hljs-number">0.92</span>:
            <span class="hljs-keyword">continue</span>    <span class="hljs-comment"># too similar to existing memory, skip</span>

        milvus.insert(collection, [{
            <span class="hljs-string">&quot;vector&quot;</span>: embed(mem[<span class="hljs-string">&quot;content&quot;</span>]),
            <span class="hljs-string">&quot;text&quot;</span>: mem[<span class="hljs-string">&quot;content&quot;</span>],
            <span class="hljs-string">&quot;type&quot;</span>: mem[<span class="hljs-string">&quot;type&quot;</span>],
            <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;chat_extraction&quot;</span>,
            <span class="hljs-string">&quot;date&quot;</span>: <span class="hljs-string">&quot;2026-03-05&quot;</span>
        }])
        stored += <span class="hljs-number">1</span>

    <span class="hljs-keyword">return</span> stored
<button class="copy-code-btn"></button></code></pre>
<p>Lorsque je suis confronté à une nouvelle situation de marché et que l'envie de négocier se fait sentir, l'agent exécute une fonction de rappel. Je décris ce qui se passe et l'agent recherche dans les trois collections l'historique pertinent :</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">recall_my_experience</span>(<span class="hljs-params">situation: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">dict</span>:
    <span class="hljs-string">&quot;&quot;&quot;
    Given a current market situation, retrieve my relevant
    past experiences, preferences, and observed patterns.
    &quot;&quot;&quot;</span>
    query_vec = embed(situation)

    <span class="hljs-comment"># Search all three collections in parallel</span>
    past_decisions = milvus.search(
        <span class="hljs-string">&quot;decisions&quot;</span>, data=[query_vec], limit=<span class="hljs-number">3</span>,
        output_fields=[<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;date&quot;</span>, <span class="hljs-string">&quot;tag&quot;</span>]
    )
    my_preferences = milvus.search(
        <span class="hljs-string">&quot;preferences&quot;</span>, data=[query_vec], limit=<span class="hljs-number">2</span>,
        output_fields=[<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;type&quot;</span>]
    )
    my_patterns = milvus.search(
        <span class="hljs-string">&quot;patterns&quot;</span>, data=[query_vec], limit=<span class="hljs-number">2</span>,
        output_fields=[<span class="hljs-string">&quot;text&quot;</span>]
    )

    <span class="hljs-keyword">return</span> {
        <span class="hljs-string">&quot;past_decisions&quot;</span>: [h[<span class="hljs-string">&quot;entity&quot;</span>] <span class="hljs-keyword">for</span> h <span class="hljs-keyword">in</span> past_decisions[<span class="hljs-number">0</span>]],
        <span class="hljs-string">&quot;preferences&quot;</span>: [h[<span class="hljs-string">&quot;entity&quot;</span>] <span class="hljs-keyword">for</span> h <span class="hljs-keyword">in</span> my_preferences[<span class="hljs-number">0</span>]],
        <span class="hljs-string">&quot;patterns&quot;</span>: [h[<span class="hljs-string">&quot;entity&quot;</span>] <span class="hljs-keyword">for</span> h <span class="hljs-keyword">in</span> my_patterns[<span class="hljs-number">0</span>]]
    }

<span class="hljs-comment"># When Agent analyzes current tech selloff:</span>
context = recall_my_experience(
    <span class="hljs-string">&quot;tech stocks dropping 3-4% due to Middle East tensions, March 2026&quot;</span>
)

<span class="hljs-comment"># context now contains:</span>
<span class="hljs-comment"># - My 2024-10 lesson about not panic-selling during ME crisis</span>
<span class="hljs-comment"># - My preference: &quot;I tend to overweight geopolitical risk&quot;</span>
<span class="hljs-comment"># - My pattern: &quot;tech selloffs from geopolitics recover in 1-3 weeks&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Par exemple, lorsque les valeurs technologiques ont chuté de 3 à 4 % en raison des tensions au Moyen-Orient au début du mois de mars, l'agent a retrouvé trois éléments : une leçon d'octobre 2024 sur la nécessité de ne pas vendre dans la panique lors d'un creux géopolitique, une note de préférence indiquant que j'ai tendance à surpondérer le risque géopolitique et un schéma que j'avais enregistré (les baisses des valeurs technologiques provoquées par la géopolitique se rétablissent généralement en une à trois semaines).</p>
<p>L'avis de mon collègue : si vos données d'entraînement sont un record de pertes, qu'est-ce que l'IA apprend exactement ? Mais c'est là tout l'intérêt : l'agent ne copie pas mes opérations, il les mémorise afin de pouvoir me dissuader d'effectuer la prochaine.</p>
<h2 id="Step-3-Teach-Your-Agent-to-Analyze-with-OpenClaw-Skills" class="common-anchor-header">Étape 3 : Apprenez à votre agent à analyser avec les compétences OpenClaw<button data-href="#Step-3-Teach-Your-Agent-to-Analyze-with-OpenClaw-Skills" class="anchor-icon" translate="no">
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
    </button></h2><p>À ce stade, l'agent dispose d'informations fiables<a href="https://exa.ai/">(Exa</a>) et d'une mémoire personnelle<a href="https://github.com/milvus-io/milvus-lite">(Milvus</a>). Mais si vous remettez les deux à un LLM en lui disant " analyse ça ", vous obtiendrez une réponse générique, qui couvre tout. Elle mentionne tous les angles possibles et se termine par "les investisseurs doivent peser les risques". Autant dire qu'il n'y a rien à dire.</p>
<p>La solution consiste à rédiger votre propre cadre analytique et à le donner à l'agent sous forme d'instructions explicites. Vous devez lui indiquer les indicateurs qui vous intéressent, les situations que vous considérez comme dangereuses et les moments où il convient d'être prudent ou agressif. Ces règles sont différentes pour chaque investisseur, vous devez donc les définir vous-même.</p>
<p>OpenClaw le fait par le biais de Skills - des fichiers markdown dans un répertoire skills/. Lorsque l'agent rencontre une situation pertinente, il charge la compétence correspondante et suit votre cadre au lieu d'agir en roue libre.</p>
<p>En voici un que j'ai écrit pour évaluer des actions après un rapport sur les bénéfices :</p>
<pre><code translate="no">---
name: post-earnings-eval
description: &gt;
  Evaluate whether to buy, hold, or sell after an earnings report.
  Trigger when discussing any stock&#x27;s post-earnings price action,
  or when a watchlist stock reports earnings.
---

## Post-Earnings Evaluation Framework

When analyzing a stock after earnings release:

### Step 1: Get the facts
Use Exa to search for:
- Actual vs expected: revenue, EPS, forward guidance
- Analyst reactions from top-tier sources
- Options market implied move vs actual move

### Step 2: Check my history
Use Milvus recall to find:
- Have I traded this stock after earnings before?
- What did I get right or wrong last time?
- Do I have a known bias about this sector?

### Step 3: Apply my rules
- If revenue beat &gt; 5% AND guidance raised → lean BUY
- If stock drops &gt; 5% on a beat → likely sentiment/macro driven
  - Check: is the drop about THIS company or the whole market?
  - Check my history: did I overreact to similar drops before?
- If P/E &gt; 2x sector average after beat → caution, priced for perfection

### Step 4: Output format
Signal: BUY / HOLD / SELL / WAIT
Confidence: High / Medium / Low
Reasoning: 3 bullets max
Past mistake reminder: what I got wrong in similar situations

IMPORTANT: Always surface my past mistakes. I have a tendency to
let fear override data. If my Milvus history shows I regretted
selling after a dip, say so explicitly.
<button class="copy-code-btn"></button></code></pre>
<p>La dernière ligne est la plus importante : "Faites toujours surface à mes erreurs passées. J'ai tendance à laisser la peur prendre le pas sur les données. Si mon historique Milvus montre que j'ai regretté d'avoir vendu après une baisse, dites-le explicitement". Cela signifie que je dis à l'agent exactement où je me trompe, afin qu'il sache quand réagir. Si vous créez le vôtre, c'est la partie que vous personnaliserez en fonction de vos préjugés.</p>
<p>J'ai écrit des compétences similaires pour l'analyse des sentiments, les indicateurs macroéconomiques et les signaux de rotation sectorielle. J'ai également créé des compétences qui simulent la façon dont les investisseurs que j'admire évalueraient la même situation - le cadre de valeur de Buffett, l'approche macro de Bridgewater. Il ne s'agit pas de décideurs, mais de perspectives supplémentaires.</p>
<p>Un avertissement : ne laissez pas les LLM calculer des indicateurs techniques tels que le RSI ou le MACD. Ils hallucinent les chiffres avec assurance. Calculez-les vous-même ou appelez une API dédiée, et introduisez les résultats dans le Skill en tant qu'entrées.</p>
<h2 id="Step-4-Start-Your-Agent-with-OpenClaw-Heartbeat" class="common-anchor-header">Étape 4 : Démarrer votre agent avec OpenClaw Heartbeat<button data-href="#Step-4-Start-Your-Agent-with-OpenClaw-Heartbeat" class="anchor-icon" translate="no">
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
    </button></h2><p>Tout ce qui précède nécessite encore un déclenchement manuel. Si vous devez ouvrir un terminal à chaque fois que vous voulez une mise à jour, vous en reviendrez pratiquement à la suppression de votre application de courtage pendant les réunions.</p>
<p>Le mécanisme Heartbeat d'OpenClaw résout ce problème. Une passerelle envoie un ping à l'agent toutes les 30 minutes (configurable), et l'agent vérifie un fichier HEARTBEAT.md pour décider de ce qu'il doit faire à ce moment-là. Il s'agit d'un fichier markdown contenant des règles basées sur le temps :</p>
<pre><code translate="no"><span class="hljs-meta"># HEARTBEAT.md — runs every 30 minutes automatically</span>

<span class="hljs-meta">## Morning brief (6:30-7:30 AM only)</span>
- Use Exa to search overnight US market news, Asian markets, oil prices
- Search Milvus <span class="hljs-keyword">for</span> my current positions <span class="hljs-keyword">and</span> relevant past experiences
- <span class="hljs-function">Generate a personalized morning <span class="hljs-title">brief</span> (<span class="hljs-params">under <span class="hljs-number">500</span> words</span>)
- Flag anything related to my past mistakes <span class="hljs-keyword">or</span> current holdings
- End <span class="hljs-keyword">with</span> 1-3 action items
- Send the brief to my phone

## Price <span class="hljs-title">alerts</span> (<span class="hljs-params">during US market hours <span class="hljs-number">9</span>:<span class="hljs-number">30</span> AM - <span class="hljs-number">4</span>:<span class="hljs-number">00</span> PM ET</span>)
- Check price changes <span class="hljs-keyword">for</span>: NVDA, TSM, MSFT, AAPL, GOOGL
- If any stock moved more than 3% since last check:
  - Search Milvus <span class="hljs-keyword">for</span>: why I hold <span class="hljs-keyword">this</span> stock, my exit criteria
  - Generate alert <span class="hljs-keyword">with</span> context <span class="hljs-keyword">and</span> recommendation
  - Send alert to my phone

## End of day <span class="hljs-title">summary</span> (<span class="hljs-params">after <span class="hljs-number">4</span>:<span class="hljs-number">30</span> PM ET <span class="hljs-keyword">on</span> weekdays</span>)
- Summarize today&#x27;s market action <span class="hljs-keyword">for</span> my watchlist
- Compare actual moves <span class="hljs-keyword">with</span> my morning expectations
- Note any <span class="hljs-keyword">new</span> patterns worth remembering
</span><button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Open_Claw_2_b2c5262371.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Results-Less-Screen-Time-Fewer-Impulsive-Trades" class="common-anchor-header">Résultats : Moins de temps d'écran, moins de transactions impulsives<button data-href="#Results-Less-Screen-Time-Fewer-Impulsive-Trades" class="anchor-icon" translate="no">
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
    </button></h2><p>Voici ce que le système produit au jour le jour :</p>
<ul>
<li><strong>Briefing du matin (7h00).</strong> L'agent exécute Exa pendant la nuit, extrait mes positions et l'historique pertinent de Milvus, et envoie un résumé personnalisé sur mon téléphone - moins de 500 mots. Ce qui s'est passé au cours de la nuit, le lien avec mes positions et une à trois actions à entreprendre. Je le lis en me brossant les dents.</li>
<li><strong>Alertes intrajournalières (de 9 h 30 à 16 h 00, heure de l'Est).</strong> Toutes les 30 minutes, l'agent vérifie ma liste de surveillance. Si une action a évolué de plus de 3 %, je reçois une notification avec le contexte : pourquoi je l'ai achetée, où se situe mon stop-loss et si je me suis déjà trouvé dans une situation similaire.</li>
<li><strong>Examen hebdomadaire (le week-end).</strong> L'agent compile l'ensemble de la semaine - les mouvements du marché, leur comparaison avec mes attentes du matin et les tendances à retenir. Je consacre 30 minutes à la lecture de ce document le samedi. Le reste de la semaine, je reste délibérément éloigné de l'écran.</li>
</ul>
<p>Ce dernier point constitue le changement le plus important. L'agent ne me fait pas seulement gagner du temps, il me libère également de l'obligation de surveiller le marché. Vous ne pouvez pas vendre dans la panique si vous ne regardez pas les prix.</p>
<p>Avant ce système, je consacrais 10 à 15 heures par semaine à la collecte d'informations, à la surveillance du marché et à l'examen des transactions, réparties entre les réunions, les trajets domicile-travail et les défilements nocturnes. Aujourd'hui, j'y consacre environ deux heures : cinq minutes pour le briefing du matin chaque jour, plus 30 minutes pour l'examen du week-end.</p>
<p>La qualité de l'information est également meilleure. Je lis des résumés de Reuters et de Bloomberg plutôt que ce qui est devenu viral sur Twitter. Et comme l'agent me rappelle mes erreurs passées chaque fois que je suis tenté d'agir, j'ai considérablement réduit mes transactions impulsives. Je ne peux pas encore prouver que cela a fait de moi un meilleur investisseur, mais cela a fait de moi un investisseur moins téméraire.</p>
<p>Le coût total : 10 $/mois pour OpenClaw, 10 $/mois pour Exa et un peu d'électricité pour faire fonctionner Milvus Lite.</p>
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
    </button></h2><p>Je continuais à faire les mêmes transactions impulsives parce que mes informations étaient mauvaises, que je passais rarement en revue mon propre historique et que le fait de regarder le marché toute la journée ne faisait qu'empirer les choses. J'ai donc créé un agent d'intelligence artificielle qui résout ces problèmes en faisant trois choses :</p>
<ul>
<li>Il<strong>recueille des informations fiables sur les marchés</strong> avec <strong><a href="https://exa.ai/">Exa</a></strong>, remplaçant ainsi une heure de défilement à travers des spams de référencement et des sites payants.</li>
<li>Il<strong>se souvient de mes transactions passées</strong> avec <a href="http://milvus.io">Milvus</a> et m'avertit lorsque je suis sur le point de répéter une erreur que j'ai déjà regrettée.</li>
<li><strong>Fonctionne en pilote automatique</strong> avec <a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw</a> et ne m'envoie des pings que lorsque quelque chose est vraiment important.</li>
</ul>
<p>Coût total : 20 dollars par mois. L'agent ne négocie pas et ne touche pas à mon argent.</p>
<p>Le plus grand changement n'a pas été les données ou les alertes. C'est que j'ai cessé de surveiller le marché. Je l'ai complètement oublié mercredi dernier, ce qui n'était jamais arrivé au cours de mes années de trading. Il m'arrive encore de perdre de l'argent, mais beaucoup moins souvent, et je profite à nouveau de mes week-ends. Mes collègues n'ont pas encore mis la blague à jour, mais il faut laisser du temps au temps.</p>
<p>La construction de l'agent n'a pris que deux week-ends. Il y a un an, la même configuration aurait nécessité l'écriture de schedulers, de pipelines de notification et de gestion de la mémoire à partir de zéro. Avec OpenClaw, la majeure partie du temps a été consacrée à la clarification de mes propres règles de trading, et non à l'écriture de l'infrastructure.</p>
<p>Et une fois que vous l'avez construit pour un cas d'utilisation, l'architecture est portable. Échangez les modèles de recherche Exa et les compétences OpenClaw, et vous obtiendrez un agent qui surveille les articles de recherche, les concurrents, les changements de réglementation ou les perturbations de la chaîne d'approvisionnement.</p>
<p>Si vous voulez l'essayer :</p>
<ul>
<li><strong><a href="https://milvus.io/docs/quickstart.md">Démarrage rapide de Milvus</a></strong> - pour faire fonctionner localement une base de données vectorielles en moins de cinq minutes.</li>
<li><strong><a href="https://docs.openclaw.ai/">OpenClaw</a></strong> <strong>docs</strong> - configurez votre premier agent avec Skills et Heartbeat</li>
<li><strong><a href="https://exa.ai/">Exa</a></strong> <strong>API</strong> - 1 000 recherches gratuites par mois pour commencer</li>
</ul>
<p>Vous avez des questions, vous avez besoin d'aide pour déboguer ou vous voulez simplement montrer ce que vous avez construit ? Rejoignez le canal <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack</a> de <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Milvus</a>: c'est le moyen le plus rapide d'obtenir de l'aide de la part de la communauté et de l'équipe. Et si vous préférez parler de votre installation en tête-à-tête, réservez une <a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour?__hstc=175614333.156cb1e50b398e3753dedcd15f8758f6.1769685782884.1773222362027.1773227913204.54&amp;__hssc=175614333.2.1773227913204&amp;__hsfp=1c9f7a3cc56fa6c486704004556598ad&amp;uuid=be611eac-2f37-4c1d-9494-71ae4e097f89">heure de bureau Milvus</a> de 20 minutes.</p>
<h2 id="Keep-Reading" class="common-anchor-header">Lire la suite<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
<li><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw (anciennement Clawdbot et Moltbot) expliqué : Guide complet de l'agent d'IA autonome</a></li>
<li><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Guide étape par étape pour configurer OpenClaw (anciennement Clawdbot/Moltbot) avec Slack</a></li>
<li><a href="https://milvus.io/blog/why-ai-agents-like-openclaw-burn-through-tokens-and-how-to-cut-costs.md">Pourquoi les agents d'IA comme OpenClaw brûlent des tokens et comment réduire les coûts</a></li>
<li><a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">Nous avons extrait le système de mémoire d'OpenClaw et l'avons mis en open-source (memsearch)</a></li>
</ul>
