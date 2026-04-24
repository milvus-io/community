---
id: i-built-a-stock-monitoring-agent-with-openclaw-exa-and-milvus-for-20month.md
title: |
  I Built a Stock Monitoring Agent with OpenClaw, Exa, and Milvus for $20/Month
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
desc: >
  A step-by-step guide to building an AI stock monitoring agent using OpenClaw,
  Exa, and Milvus. Morning briefs, trade memory, and alerts for $20/month.
origin: >-
  https://milvus.io/blog/i-built-a-stock-monitoring-agent-with-openclaw-exa-and-milvus-for-20month.md
---
<p>I trade U.S. stocks on the side, which is a polite way of saying I lose money as a hobby. My coworkers joke that my strategy is “buy high on excitement, sell low on fear, repeat weekly.”</p>
<p>The repeat part is what kills me. Every time I stare at the market, I end up making a trade I didn’t plan on. Oil spikes, I panic-sell. That one tech stock pops 4%, I chase it. A week later, I’m looking at my trade history going, <em>didn’t I do this exact thing last quarter?</em></p>
<p>So I built an agent with OpenClaw that watches the market instead of me and stops me from making the same mistakes. It doesn’t trade or touch my money, because that’d be too much of a security risk. Instead, it saves me time spent on market watching, and keeps me from making the same mistakes.</p>
<p>This agent consists of three parts, and costs about $20/month:</p>
<ul>
<li><strong><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw</a></strong> <strong>for running it all on autopilot.</strong> OpenClaw runs the agent on a 30-minute heartbeat and only pings me when something actually matters, which relieves the FOMO that used to keep me glued to the screen. Before, the more I watched prices, the more I reacted on impulse.</li>
<li><strong><a href="https://exa.ai/">Exa</a></strong> <strong>for accurate, real-time searches.</strong> Exa browses and summarizes hand-picked information sources on a schedule, so I get a clean briefing every morning. Before, I was spending an hour a day sifting through SEO spam and speculation to find reliable news — and it couldn’t be automated because finance sites update daily to fight scrapers.</li>
<li><strong><a href="https://milvus.io/">Milvus</a></strong> <strong>for personal history and preferences.</strong> Milvus stores my trading history, and the agent searches it before I make a decision — if I’m about to repeat something I’ve regretted, it tells me. Before, reviewing past trades was tedious enough that I just didn’t, so the same mistakes kept happening with different tickers. <a href="https://zilliz.com/cloud">Zilliz Cloud</a> is the fully managed version of Milvus. If you’d like a hassle-free experience, Zilliz Cloud is a great option (<a href="https://cloud.zilliz.com/signup">free tier available</a>).</li>
</ul>
<p>Here’s how I set it up, step by step.</p>
<h2 id="Step-1-Get-Real-Time-Market-Intelligence-with-Exa" class="common-anchor-header">Step 1: Get Real-Time Market Intelligence with Exa<button data-href="#Step-1-Get-Real-Time-Market-Intelligence-with-Exa" class="anchor-icon" translate="no">
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
    </button></h2><p>Before, I’d tried browsing financial apps, writing scrapers, and looking into professional data terminals. My experience? Apps buried the signal under noise, scrapers broke constantly, and professional APIs were prohibitively expensive. Exa is a search API built for AI agents that solves the issues above.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Open_Claw_1_d15ac4d2e3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong><a href="https://exa.ai/">Exa</a></strong> is a web search API that returns structured, AI-ready data for AI agents. It is powered by <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (the fully managed service of Milvus). If Perplexity is a search engine used by humans, Exa is used by AI. The agent sends a query, and Exa returns article text, key sentences, and summaries as JSON — structured output the agent can parse and act on directly, no scraping required.</p>
<p>Exa also uses semantic search under the hood, so the agent can query in natural language. A query like “Why did NVIDIA stock drop despite strong Q4 2026 earnings” returns analyst breakdowns from Reuters and Bloomberg, not a page of SEO clickbait.</p>
<p>Exa has a free tier — 1,000 searches per month, which is more than enough to get started. To follow along, install the SDK and swap in your own API key:</p>
<pre><code translate="no">pip install exa-py
<button class="copy-code-btn"></button></code></pre>
<p>Here’s the core call:</p>
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
<p>The contents parameter does most of the heavy lifting here — text pulls the full article, highlights extracts key sentences, and summary generates a focused summary based on a question you provide. One API call replaces twenty minutes of tab-hopping.</p>
<p>That basic pattern covers a lot, but I ended up building four variations to handle different situations I run into regularly:</p>
<ul>
<li><strong>Filtering by source credibility.</strong> For earnings analysis, I only want Reuters, Bloomberg, or the Wall Street Journal — not content farms rewriting their reporting twelve hours later.</li>
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
<li><strong>Finding similar analysis.</strong> When I read one good article, I want more perspectives on the same topic without manually searching for them.</li>
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
<li><strong>Deep search for complex questions.</strong> Some questions can’t be answered by a single article — like how Middle East tensions affect semiconductor supply chains. Deep search synthesizes across multiple sources and returns structured summaries.</li>
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
<li><strong>Real-time news monitoring.</strong> During market hours, I need breaking news filtered to the current day only.</li>
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
<p>I wrote about a dozen templates using these patterns, covering Fed policy, tech earnings, oil prices, and macro indicators. They run automatically every morning and push results to my phone. What used to take an hour of browsing now takes five minutes of reading summaries over coffee.</p>
<h2 id="Step-2-Store-Trading-History-in-Milvus-for-Smarter-Decisions" class="common-anchor-header">Step 2: Store Trading History in Milvus for Smarter Decisions<button data-href="#Step-2-Store-Trading-History-in-Milvus-for-Smarter-Decisions" class="anchor-icon" translate="no">
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
    </button></h2><p>Exa fixed my information problem. But I was still repeating the same trades — panic-selling during dips that recovered within days, and chasing momentum into stocks that were already overpriced. I’d act on emotion, regret it, and forget the lesson by the time a similar situation came around.</p>
<p>I needed a personal knowledge base: something that could store my past trades, my reasoning, and my screw-ups. Not something I’d have to review manually (I’d tried that and never kept it up), but something the agent could search on its own whenever a similar situation came up. If I’m about to repeat a mistake, I want the agent to tell me before I hit the button. Matching “current situation” to “past experience” is a similarity search problem that vector databases solve, so I picked one to store my data.</p>
<p>I used <a href="https://github.com/milvus-io/milvus-lite">Milvus Lite</a>, a lightweight version of Milvus that runs locally. It has no server setu, and is perfect for prototyping and experimenting. I split my data into three collections. The embedding dimension is 1536 to match OpenAI’s text-embedding-3-small model, which can be used directly:</p>
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
<p>The three collections map to three types of personal data, each with a different retrieval strategy:</p>
<table>
<thead>
<tr><th><strong>Type</strong></th><th><strong>What it stores</strong></th><th><strong>How the agent uses it</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Preferences</strong></td><td>Biases, risk tolerance, investing philosophy (“I tend to hold tech stocks too long”)</td><td>Loaded into the agent’s context on every run</td></tr>
<tr><td><strong>Decisions &amp; Patterns</strong></td><td>Specific past trades, lessons learned, market observations</td><td>Retrieved via similarity search only when a relevant situation comes up</td></tr>
<tr><td><strong>External knowledge</strong></td><td>Research reports, SEC filings, public data</td><td>Not stored in Milvus — searchable through Exa</td></tr>
</tbody>
</table>
<p>I built three different collections because mixing these into one collection would mean either bloating every prompt with irrelevant trade history, or losing core biases when they don’t match the current query closely enough.</p>
<p>Once the collections existed, I needed a way to populate them automatically. I didn’t want to copy-paste information after every conversation with the agent, so I built a memory extractor that runs at the end of each chat session.</p>
<p>The extractor does two things: extract and deduplicate. The extractor asks the LLM to pull structured insights from the conversation — decisions, preferences, patterns, lessons — and routes each one to the right collection. Before storing anything, it checks similarity against what’s already there. If a new insight is more than 92% similar to an existing entry, it gets skipped.</p>
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
<p>When I’m facing a new market situation and the urge to trade kicks in, the agent runs a recall function. I describe what’s happening, and it searches all three collections for relevant history:</p>
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
<p>For example, when tech stocks dropped 3-4% on Middle East tensions in early March, the agent pulled up three things: a lesson from October 2024 about not panic-selling during a geopolitical dip, a preference note that I tend to overweight geopolitical risk, and a pattern I’d recorded (tech selloffs driven by geopolitics typically recover in one to three weeks.)</p>
<p>My coworker’s take: if your training data is a losing record, what exactly is the AI learning? But that’s the whole point — the agent isn’t copying my trades, it’s memorizing them so it can talk me out of the next one.</p>
<h2 id="Step-3-Teach-Your-Agent-to-Analyze-with-OpenClaw-Skills" class="common-anchor-header">Step 3: Teach Your Agent to Analyze with OpenClaw Skills<button data-href="#Step-3-Teach-Your-Agent-to-Analyze-with-OpenClaw-Skills" class="anchor-icon" translate="no">
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
    </button></h2><p>At this point, the agent has reliable information (<a href="https://exa.ai/">Exa</a>) and personal memory (<a href="https://github.com/milvus-io/milvus-lite">Milvus</a>). But if you hand both to an LLM and say “analyze this,” you get a generic, hedge-everything response. It mentions every possible angle and concludes with “investors should weigh the risks.” It might as well have said nothing.</p>
<p>The fix is to write your own analytical framework and give it to the agent as explicit instructions. You have to tell it which indicators you care about, which situations you consider dangerous, and when to be conservative versus aggressive. These rules are different for every investor, so you have to define them yourself.</p>
<p>OpenClaw does this through Skills — markdown files in a skills/ directory. When the agent encounters a relevant situation, it loads the matching Skill and follows your framework instead of freewheeling.</p>
<p>Here’s one I wrote for evaluating stocks after an earnings report:</p>
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
<p>The last line is the most important: “Always surface my past mistakes. I have a tendency to let fear override data. If my Milvus history shows I regretted selling after a dip, say so explicitly.” That’s me telling the agent exactly where I go wrong, so it knows when to push back. If you build your own, this is the part you’d customize based on your biases.</p>
<p>I wrote similar Skills for sentiment analysis, macro indicators, and sector rotation signals. I also wrote Skills that simulate how investors I admire would evaluate the same situation — Buffett’s value framework, Bridgewater’s macro approach. These aren’t decision-makers; they’re additional perspectives.</p>
<p>A warning: don’t let LLMs calculate technical indicators like RSI or MACD. They hallucinate numbers confidently. Compute those yourself or call a dedicated API, and feed the results into the Skill as inputs.</p>
<h2 id="Step-4-Start-Your-Agent-with-OpenClaw-Heartbeat" class="common-anchor-header">Step 4: Start Your Agent with OpenClaw Heartbeat<button data-href="#Step-4-Start-Your-Agent-with-OpenClaw-Heartbeat" class="anchor-icon" translate="no">
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
    </button></h2><p>Everything above still requires you to trigger it manually. If you have to open a terminal every time you want an update, you’re practically back to doomscrolling your brokerage app during meetings again.</p>
<p>OpenClaw’s Heartbeat mechanism fixes this. A gateway pings the agent every 30 minutes (configurable), and the agent checks a HEARTBEAT.md file to decide what to do at that moment. It’s a markdown file with time-based rules:</p>
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
<h2 id="Results-Less-Screen-Time-Fewer-Impulsive-Trades" class="common-anchor-header">Results: Less Screen Time, Fewer Impulsive Trades<button data-href="#Results-Less-Screen-Time-Fewer-Impulsive-Trades" class="anchor-icon" translate="no">
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
    </button></h2><p>Here’s what the system actually produces day to day:</p>
<ul>
<li><strong>Morning brief (7:00 AM).</strong> The agent runs Exa overnight, pulls my positions and relevant history from Milvus, and pushes a personalized summary to my phone — under 500 words. What happened overnight, how it relates to my holdings, and one to three action items. I read it while brushing my teeth.</li>
<li><strong>Intraday alerts (9:30 AM–4:00 PM ET).</strong> Every 30 minutes, the agent checks my watchlist. If any stock moved more than 3%, I get a notification with context: why I bought it, where my stop-loss is, and whether I’ve been in a similar situation before.</li>
<li><strong>Weekly review (weekends).</strong> The agent compiles the full week — market moves, how they compared to my morning expectations, and patterns worth remembering. I spend 30 minutes reading it on Saturday. The rest of the week, I deliberately stay away from the screen.</li>
</ul>
<p>That last point is the biggest change. The agent doesn’t only save time, it also frees me from watching the market. You can’t panic-sell if you’re not looking at prices.</p>
<p>Before this system, I was spending 10–15 hours a week on information gathering, market monitoring, and trade review, scattered across meetings, commute time, and late-night scrolling. Now it’s about two hours: five minutes on the morning brief each day, plus 30 minutes on the weekend review.</p>
<p>The information quality is also better. I’m reading summaries from Reuters and Bloomberg instead of whatever went viral on Twitter. And with the agent pulling up my past mistakes every time I’m tempted to act, I’ve cut my impulsive trades significantly. I can’t prove this has made me a better investor yet, but it’s made me a less reckless one.</p>
<p>The total cost: $10/month for OpenClaw, $10/month for Exa, and a bit of electricity to keep Milvus Lite running.</p>
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
    </button></h2><p>I kept making the same impulsive trades because my information was bad, I seldom reviewed my own history, and staring at the market all day made it worse. So I built an AI agent that solves those problems by doing three things:</p>
<ul>
<li><strong>Gathers reliable market news</strong> with <strong><a href="https://exa.ai/">Exa</a></strong>, replacing an hour of scrolling through SEO spam and paywalled sites.</li>
<li><strong>Remembers my past trades</strong> with <a href="http://milvus.io">Milvus</a> and warns me when I’m about to repeat a mistake I’ve already regretted.</li>
<li><strong>Runs on autopilot</strong> with <a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw</a> and only pings me when something actually matters.</li>
</ul>
<p>Total cost: $20/month. The agent doesn’t trade or touch my money.</p>
<p>The biggest change wasn’t the data or the alerts. It was that I stopped watching the market. I forgot about it entirely last Wednesday, which has never happened in my years of trading. I still lose money sometimes, but way less often, and I actually enjoy my weekends again. My coworkers haven’t updated the joke yet, but give it time.</p>
<p>The agent also took just two weekends to build. A year ago, the same setup would have meant writing schedulers, notification pipelines, and memory management from scratch. With OpenClaw, most of that time went into clarifying my own trading rules, not writing infrastructure.</p>
<p>And once you’ve built it for one use case, the architecture is portable. Swap the Exa search templates and the OpenClaw Skills, and you have an agent that monitors research papers, tracks competitors, watches regulatory changes, or follows supply chain disruptions.</p>
<p>If you want to try it:</p>
<ul>
<li><strong><a href="https://milvus.io/docs/quickstart.md">Milvus quickstart</a></strong> — get a vector database running locally in under five minutes</li>
<li><strong><a href="https://docs.openclaw.ai/">OpenClaw</a></strong> <strong>docs</strong> — set up your first agent with Skills and Heartbeat</li>
<li><strong><a href="https://exa.ai/">Exa</a></strong> <strong>API</strong> — 1,000 free searches per month to start</li>
</ul>
<p>Got questions, want help debugging, or just want to show off what you’ve built? Join the <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Milvus Slack</a> channel— it’s the fastest way to get help from both the community and the team. And if you’d rather talk through your setup one-on-one, book a 20-minute <a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour?__hstc=175614333.156cb1e50b398e3753dedcd15f8758f6.1769685782884.1773222362027.1773227913204.54&amp;__hssc=175614333.2.1773227913204&amp;__hsfp=1c9f7a3cc56fa6c486704004556598ad&amp;uuid=be611eac-2f37-4c1d-9494-71ae4e097f89">Milvus office hour.</a></p>
<h2 id="Keep-Reading" class="common-anchor-header">Keep Reading<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
<li><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw (Formerly Clawdbot &amp; Moltbot) Explained: A Complete Guide to the Autonomous AI Agent</a></li>
<li><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Step-by-Step Guide to Setting Up OpenClaw (Previously Clawdbot/Moltbot) with Slack</a></li>
<li><a href="https://milvus.io/blog/why-ai-agents-like-openclaw-burn-through-tokens-and-how-to-cut-costs.md">Why AI Agents like OpenClaw Burn Through Tokens and How to Cut Costs</a></li>
<li><a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">We Extracted OpenClaw’s Memory System and Open-Sourced It (memsearch)</a></li>
</ul>
