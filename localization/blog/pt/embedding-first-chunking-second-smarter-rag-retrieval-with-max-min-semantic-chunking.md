---
id: >-
  embedding-first-chunking-second-smarter-rag-retrieval-with-max-min-semantic-chunking.md
title: >
  Embedding First, Then Chunking: Smarter RAG Retrieval with Max–Min Semantic
  Chunking 
author: Rachel Liu
date: 2025-12-24T00:00:00.000Z
cover: assets.zilliz.com/maxmin_cover_8be0b87409.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Max–Min Semantic Chunking, Milvus, RAG, chunking strategies'
meta_title: |
  Max–Min Semantic Chunking: Top Chunking Strategy to Improve RAG Performance
desc: >-
  Learn how Max–Min Semantic Chunking boosts RAG accuracy using an
  embedding-first approach that creates smarter chunks, improves context
  quality, and delivers better retrieval performance.
origin: >-
  https://milvus.io/blog/embedding-first-chunking-second-smarter-rag-retrieval-with-max-min-semantic-chunking.md
---
<p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Retrieval Augmented Generation (RAG)</a> has become the default approach for providing context and memory for AI applications — AI agents, customer support assistants, knowledge bases, and search systems all rely on it.</p>
<p>In almost every RAG pipeline, the standard process is the same: take the documents, split them into chunks, and then embed those chunks for similarity retrieval in a vector database like <a href="https://milvus.io/">Milvus</a>. Because <strong>chunking</strong> happens upfront, the quality of those chunks directly affects how well the system retrieves information and how accurate the final answers are.</p>
<p>The issue is that traditional chunking strategies usually split text without any semantic understanding. Fixed-length chunking cuts based on token counts, and recursive chunking uses surface-level structure, but both still ignore the actual meaning of the text. As a result, related ideas often get separated, unrelated lines get grouped together, and important context gets fragmented.</p>
<p>In this blog, I’d like to share a different chunking strategy: <a href="https://link.springer.com/article/10.1007/s10791-025-09638-7"><strong>Max–Min Semantic Chunking</strong></a>. Instead of chunking first, it embeds the text upfront and uses semantic similarity to decide where boundaries should form. By embedding before cutting, the pipeline can track natural shifts in meaning rather than relying on arbitrary length limits.</p>
<h2 id="How-a-Typical-RAG-Pipeline-Works" class="common-anchor-header">How a Typical RAG Pipeline Works<button data-href="#How-a-Typical-RAG-Pipeline-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Most RAG pipelines, regardless of the framework, follow the same four-stage assembly line. You’ve probably written some version of this yourself:</p>
<h3 id="1-Data-Cleaning-and-Chunking" class="common-anchor-header">1. Data Cleaning and Chunking</h3><p>The pipeline starts by cleaning the raw documents: removing headers, footers, navigation text, and anything that isn’t real content. Once the noise is out, the text gets split into smaller pieces. Most teams use fixed-size chunks — typically 300–800 tokens — because it keeps the embedding model manageable. The downside is that the splits are based on length, not meaning, so the boundaries can be arbitrary.</p>
<h3 id="2-Embedding-and-Storage" class="common-anchor-header">2. Embedding and Storage</h3><p>Each chunk is then embedded using an embedding model like OpenAI’s <a href="https://zilliz.com/ai-models/text-embedding-3-small"><code translate="no">text-embedding-3-small</code></a> or BAAI’s encoder. The resulting vectors are stored in a vector database such as <a href="https://milvus.io/">Milvus</a> or <a href="https://zilliz.com/cloud">Zilliz Cloud</a>. The database handles indexing and similarity search so you can quickly compare new queries against all stored chunks.</p>
<h3 id="3-Querying" class="common-anchor-header">3. Querying</h3><p>When a user asks a question — for example, <em>“How does RAG reduce hallucinations?”</em> — the system embeds the query and sends it to the database. The database returns the top-K chunks whose vectors are closest to the query. These are the pieces of text the model will rely on to answer the question.</p>
<h3 id="4-Answer-Generation" class="common-anchor-header">4. Answer Generation</h3><p>The retrieved chunks are bundled together with the user query and fed into an LLM. The model generates an answer using the provided context as grounding.</p>
<p><strong>Chunking sits at the start of this whole pipeline, but it has an outsized impact</strong>. If the chunks align with the natural meaning of the text, retrieval feels accurate and consistent. If the chunks were cut in awkward places, the system has a harder time finding the right information, even with strong embeddings and a fast vector database.</p>
<h3 id="The-Challenges-of-Getting-Chunking-Right" class="common-anchor-header">The Challenges of Getting Chunking Right</h3><p>Most RAG systems today use one of two basic chunking methods, both of which have limitations.</p>
<p><strong>1. Fixed-size chunking</strong></p>
<p>This is the simplest approach: split the text by a fixed token or character count. It’s fast and predictable, but completely unaware of grammar, topics, or transitions. Sentences can get cut in half. Sometimes even words. The embeddings you get from these chunks tend to be noisy because the boundaries don’t reflect how the text is actually structured.</p>
<p><strong>2. Recursive character splitting</strong></p>
<p>This method is a bit smarter. It splits text hierarchically based on cues like paragraphs, line breaks, or sentences. If a section is too long, it recursively divides it further. The output is generally more coherent, but still inconsistent. Some documents lack clear structure or have uneven section lengths, which hurts retrieval accuracy. And in some cases, this approach still produces chunks that exceed the model’s context window.</p>
<p>Both methods face the same tradeoff: precision vs. context. Smaller chunks improve retrieval accuracy but lose surrounding context; larger chunks preserve meaning but risk adding irrelevant noise. Striking the right balance is what makes chunking both foundational—and frustrating—in RAG system design.</p>
<h2 id="Max–Min-Semantic-Chunking-Embed-First-Chunk-Later" class="common-anchor-header">Max–Min Semantic Chunking: Embed First, Chunk Later<button data-href="#Max–Min-Semantic-Chunking-Embed-First-Chunk-Later" class="anchor-icon" translate="no">
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
    </button></h2><p>In 2025, S.R. Bhat et al. published <a href="https://arxiv.org/abs/2505.21700"><em>Rethinking Chunk Size for Long-Document Retrieval: A Multi-Dataset Analysis</em></a>. One of their key findings was that there isn’t a single <strong>“best”</strong> chunk size for RAG. Small chunks (64–128 tokens) tend to work better for factual or lookup-style questions, while larger chunks (512–1024 tokens) help with narrative or high-level reasoning tasks. In other words, fixed-size chunking is always a compromise.</p>
<p>This raises a natural question: instead of picking one length and hoping for the best, can we chunk by meaning rather than size? <a href="https://link.springer.com/article/10.1007/s10791-025-09638-7"><strong>Max–Min Semantic Chunking</strong></a> is one approach I found that tries to do precisely that.</p>
<p>The idea is simple: <strong>embed first, chunk second</strong>. Instead of splitting text and then embedding whatever pieces fall out, the algorithm embeds <em>all sentences</em> up front. It then uses the semantic relationships between those sentence embeddings to decide where the boundaries should go.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/embed_first_chunk_second_94f69c664c.png" alt="Diagram showing embed-first chunk-second workflow in Max-Min Semantic Chunking" class="doc-image" id="diagram-showing-embed-first-chunk-second-workflow-in-max-min-semantic-chunking" />
    <span>Diagram showing embed-first chunk-second workflow in Max-Min Semantic Chunking</span>
  </span>
</p>
<p>Conceptually, the method treats chunking as a constrained clustering problem in embedding space. You walk through the document in order, one sentence at a time. For each sentence, the algorithm compares its embedding with those in the current chunk. If the new sentence is semantically close enough, it joins the chunk. If it’s too far, the algorithm starts a new chunk. The key constraint is that chunks must follow the original sentence order — no reordering, no global clustering.</p>
<p>The result is a set of variable-length chunks that reflect where the document’s meaning actually changes, instead of where a character counter happens to hit zero.</p>
<h2 id="How-the-Max–Min-Semantic-Chunking-Strategy-Works" class="common-anchor-header">How the Max–Min Semantic Chunking Strategy Works<button data-href="#How-the-Max–Min-Semantic-Chunking-Strategy-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Max–Min Semantic Chunking determines chunk boundaries by comparing how sentences relate to one another in the high-dimensional vector space. Instead of relying on fixed lengths, it looks at how meaning shifts across the document. The process can be broken down into six steps:</p>
<h3 id="1-Embed-all-sentences-and-start-a-chunk" class="common-anchor-header">1. Embed all sentences and start a chunk</h3><p>The embedding model converts each sentence in the document into a vector embedding. It processes sentences in order. If the first <em>n–k</em> sentences form the current chunk C, the following sentence (sₙ₋ₖ₊₁) needs to be evaluated: should it join C, or start a new chunk?</p>
<h3 id="2-Measure-how-consistent-the-current-chunk-is" class="common-anchor-header">2. Measure how consistent the current chunk is</h3><p>Within chunk C, calculate the minimum pairwise cosine similarity among all sentence embeddings. This value reflects how closely related the sentences within the chunk are. A lower minimum similarity indicates that the sentences are less related, suggesting that the chunk may need to be split.</p>
<h3 id="3-Compare-the-new-sentence-to-the-chunk" class="common-anchor-header">3. Compare the new sentence to the chunk</h3><p>Next, calculate the maximum cosine similarity between the new sentence and any sentence already in C. This reflects how well the new sentence aligns semantically with the existing chunk.</p>
<h3 id="4-Decide-whether-to-extend-the-chunk-or-start-a-new-one" class="common-anchor-header">4. Decide whether to extend the chunk or start a new one</h3><p>This is the core rule:</p>
<ul>
<li><p>If the <strong>new sentence’s max similarity</strong> to chunk <strong>C</strong> is <strong>greater than or equal to the</strong> <strong>minimum similarity inside C</strong>, → The new sentence fits and stays in the chunk.</p></li>
<li><p>Otherwise, → start a new chunk.</p></li>
</ul>
<p>This ensures that each chunk maintains its internal semantic consistency.</p>
<h3 id="5-Adjust-thresholds-as-the-document-changes" class="common-anchor-header">5. Adjust thresholds as the document changes</h3><p>To optimize chunk quality, parameters such as chunk size and similarity thresholds can be adjusted dynamically. This allows the algorithm to adapt to varying document structures and semantic densities.</p>
<h3 id="6-Handle-the-first-few-sentences" class="common-anchor-header">6. Handle the first few sentences</h3><p>When a chunk contains only one sentence, the algorithm handles the first comparison using a fixed similarity threshold. If the similarity between sentence 1 and sentence 2 is above that threshold, they form a chunk. If not, they split immediately.</p>
<h2 id="Strengths-and-Limitations-of-Max–Min-Semantic-Chunking" class="common-anchor-header">Strengths and Limitations of Max–Min Semantic Chunking<button data-href="#Strengths-and-Limitations-of-Max–Min-Semantic-Chunking" class="anchor-icon" translate="no">
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
    </button></h2><p>Max–Min Semantic Chunking improves how RAG systems split text by using meaning instead of length, but it’s not a silver bullet. Here’s a practical look at what it does well and where it still falls short.</p>
<h3 id="What-It-Does-Well" class="common-anchor-header">What It Does Well</h3><p>Max–Min Semantic Chunking improves on traditional chunking in three important ways:</p>
<h4 id="1-Dynamic-meaning-driven-chunk-boundaries" class="common-anchor-header"><strong>1. Dynamic, meaning-driven chunk boundaries</strong></h4><p>Unlike fixed-size or structure-based approaches, this method relies on semantic similarity to guide chunking. It compares the minimum similarity within the current chunk (how cohesive it is) to the maximum similarity between the new sentence and that chunk (how well it fits). If the latter is higher, the sentence joins the chunk; otherwise, a new chunk starts.</p>
<h4 id="2-Simple-practical-parameter-tuning" class="common-anchor-header"><strong>2. Simple, practical parameter tuning</strong></h4><p>The algorithm depends on just three core hyperparameters:</p>
<ul>
<li><p>the <strong>maximum chunk size</strong>,</p></li>
<li><p>the <strong>minimum similarity</strong> between the first two sentences, and</p></li>
<li><p>the <strong>similarity threshold</strong> for adding new sentences.</p></li>
</ul>
<p>These parameters adjust automatically with context—larger chunks require stricter similarity thresholds to maintain coherence.</p>
<h4 id="3-Low-processing-overhead" class="common-anchor-header"><strong>3. Low processing overhead</strong></h4><p>Because the RAG pipeline already computes sentence embeddings, Max–Min Semantic Chunking doesn’t add heavy computation. All it needs is a set of cosine similarity checks while scanning through sentences. This makes it cheaper than many semantic chunking techniques that require extra models or multi-stage clustering.</p>
<h3 id="What-It-Still-Can’t-Solve" class="common-anchor-header">What It Still Can’t Solve</h3><p>Max–Min Semantic Chunking improves chunk boundaries, but it doesn’t eliminate all the challenges of document segmentation. Because the algorithm processes sentences in order and only clusters locally, it can still miss long-range relationships in longer or more complex documents.</p>
<p>One common issue is <strong>context fragmentation</strong>. When important information is spread across different parts of a document, the algorithm may place those pieces into separate chunks. Each chunk then carries only part of the meaning.</p>
<p>For example, in the Milvus 2.4.13 Release Notes, as shown below, one chunk might contain the version identifier while another contains the feature list. A query like <em>“What new features were introduced in Milvus 2.4.13?”</em> depends on both. If those details are split across different chunks, the embedding model may not connect them, leading to weaker retrieval.</p>
<ul>
<li>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/v2413_a98e1b1f99.png" alt="Example showing context fragmentation in Milvus 2.4.13 Release Notes with version identifier and feature list in separate chunks" class="doc-image" id="example-showing-context-fragmentation-in-milvus-2.4.13-release-notes-with-version-identifier-and-feature-list-in-separate-chunks" />
    <span>Example showing context fragmentation in Milvus 2.4.13 Release Notes with version identifier and feature list in separate chunks</span>
  </span>
</li>
</ul>
<p>This fragmentation also affects the LLM generation stage. If the version reference is in one chunk and the feature descriptions are in another, the model receives incomplete context and can’t reason cleanly about the relationship between the two.</p>
<p>To mitigate these cases, systems often use techniques such as sliding windows, overlapping chunk boundaries, or multi-pass scans. These approaches reintroduce some of the missing context, reduce fragmentation, and help the retrieval step retain related information.</p>
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
    </button></h2><p>Max–Min Semantic Chunking isn’t a magic fix for every RAG problem, but it does give us a more sane way to think about chunk boundaries. Instead of letting token limits decide where ideas get chopped, it uses embeddings to detect where the meaning actually shifts. For many real-world documents—APIs, specs, logs, release notes, troubleshooting guides—this alone can push retrieval quality noticeably higher.</p>
<p>What I like about this approach is that it fits naturally into existing RAG pipelines. If you already embed sentences or paragraphs, the extra cost is basically a few cosine similarity checks. You don’t need extra models, complex clustering, or heavyweight preprocessing. And when it works, the chunks it produces feel more “human”—closer to how we mentally group information when reading.</p>
<p>But the method still has blind spots. It only sees meaning locally, and it can’t reconnect information that’s intentionally spread apart. Overlapping windows, multi-pass scans, and other context-preserving tricks are still necessary, especially for documents where references and explanations live far from each other.</p>
<p>Still, Max–Min Semantic Chunking moves us in the right direction: away from arbitrary text slicing and toward retrieval pipelines that actually respect semantics. If you’re exploring ways to make RAG more reliable, it’s worth experimenting with.</p>
<p>Have questions or want to dig deeper into improving RAG performance? Join our <a href="https://discord.com/invite/8uyFbECzPX">Discord</a> and connect with engineers who are building and tuning real retrieval systems every day.</p>
