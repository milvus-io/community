---
id: how-to-choose-the-right-embedding-model-for-rag.md
title: >
 From Word2Vec to LLM2Vec: How to Choose the Right Embedding Model for RAG
author: Rachel Liu
date: 2025-10-03
desc: This blog will walk you through how to evaluate embeddings in practice, so you can choose the best fit for your RAG system.
cover: assets.zilliz.com/Chat_GPT_Image_Oct_3_2025_05_07_11_PM_36b1ba77eb.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: Milvus, vector database, vector search, embedding models
meta_keywords: Milvus, AI Agent, embedding model vector database
meta_title: >
 How to Choose the Right Embedding Model for RAG
origin: https://milvus.io/blog/how-to-choose-the-right-embedding-model-for-rag.md
---

Large language models are powerful, but they have a well-known weakness: hallucinations. [Retrieval-Augmented Generation (RAG)](https://zilliz.com/learn/Retrieval-Augmented-Generation) is one of the most effective ways to tackle this problem. Instead of relying solely on the model’s memory, RAG retrieves relevant knowledge from an external source and incorporates it into the prompt, ensuring answers are grounded in real data.

A RAG system typically consists of three main components: the LLM itself, a [vector database](https://zilliz.com/learn/what-is-vector-database) such as [Milvus](https://milvus.io/) for storing and searching information, and an embedding model. The embedding model is what converts human language into machine-readable vectors. Think of it as the translator between natural language and the database. The quality of this translator determines the relevance of the retrieved context. Get it right, and users see accurate, helpful answers. Get it wrong, and even the best infrastructure produces noise, errors, and wasted compute.

That’s why understanding embedding models is so important. There are many to choose from—ranging from early methods like Word2Vec to modern LLM-based models such as OpenAI’s text-embedding family. Each has its own trade-offs and strengths. This guide will cut through the clutter and show you how to evaluate embeddings in practice, so you can choose the best fit for your RAG system.


## What Are Embeddings and Why Do They Matter?

At the simplest level, embeddings turn human language into numbers that machines can understand. Every word, sentence, or document is mapped into a high-dimensional vector space, where the distance between vectors captures the relationships between them. Texts with similar meanings tend to cluster together, while unrelated content tends to drift farther apart. This is what makes semantic search possible—finding meaning, not just matching keywords.

Embedding models don’t all work the same way. They generally fall into three categories, each with strengths and trade-offs:

- [**Sparse vectors**](https://zilliz.com/learn/sparse-and-dense-embeddings) (like BM25) focus on keyword frequency and document length. They’re great for explicit matches but blind to synonyms and context—“AI” and “artificial intelligence” would look unrelated.

- [**Dense vectors**](https://zilliz.com/learn/sparse-and-dense-embeddings) (like those produced by BERT) capture deeper semantics. They can see that “Apple releases new phone” is related to “iPhone product launch,” even without shared keywords. The downside is higher computational cost and less interpretability.

- **Hybrid models** (such as BGE-M3) combine the two. They can generate sparse, dense, or multi-vector representations simultaneously—preserving the precision of keyword search while also capturing semantic nuances.

In practice, the choice depends on your use case: sparse vectors for speed and transparency, dense for richer meaning, and hybrid when you want the best of both worlds.


## Eight Key Factors for Evaluating Embedding Models

### **#1 Context Window**

The [**context window**](https://zilliz.com/glossary/context-window) determines the amount of text a model can process at once. Since one token is roughly 0.75 words, this number directly limits how long a passage the model can “see” when creating embeddings. A large window allows the model to capture the whole meaning of longer documents; a small one forces you to chop the text into smaller pieces, risking the loss of meaningful context.

For example, OpenAI’s [_text-embedding-ada-002_](https://zilliz.com/ai-models/text-embedding-ada-002) supports up to 8,192 tokens—enough to cover an entire research paper, including abstract, methods, and conclusion. By contrast, models with only 512-token windows (such as _m3e-base_) require frequent truncation, which can result in the loss of key details. 

The takeaway: if your use case involves long documents, such as legal filings or academic papers, choose a model with an 8K+ token window. For shorter text, such as customer support chats, a 2K token window may be sufficient.


### **#2** Tokenization Unit

Before embeddings are generated, text must be broken down into smaller chunks called **tokens**. How this tokenization happens affects how well the model handles rare words, professional terms, and specialized domains.

- **Subword tokenization (BPE):** Splits words into smaller parts (e.g., “unhappiness” → “un” + “happiness”). This is the default in modern LLMs like GPT and LLaMA, and it works well for out-of-vocabulary words.

- **WordPiece:** A refinement of BPE used by BERT, designed to better balance vocabulary coverage with efficiency.

- **Word-level tokenization:** Splits only by whole words. It’s simple but struggles with rare or complex terminology, making it unsuitable for technical fields.

For specialized domains like medicine or law, subword-based models are generally best—they can correctly handle terms like _myocardial infarction_ or _subrogation_. Some modern models, such as **NV-Embed**, go further by adding enhancements like latent attention layers, which enhance how tokenization captures complex, domain-specific vocabulary.


### #3 Dimensionality

[**Vector dimensionality**](https://zilliz.com/glossary/dimensionality-reduction) refers to the length of the embedding vector, which determines how much semantic detail a model can capture. Higher dimensions (for example, 1,536 or more) allow for finer distinctions between concepts, but come at the cost of increased storage, slower queries, and higher compute requirements. Lower dimensions (such as 768) are faster and cheaper, but risk losing subtle meaning.

The key is balance. For most general-purpose applications, 768–1,536 dimensions strike the right mix of efficiency and accuracy. For tasks that demand high precision—such as academic or scientific searches—going beyond 2,000 dimensions can be worthwhile. On the other hand, resource-constrained systems (such as edge deployments) may use 512 dimensions effectively, provided retrieval quality is validated. In some lightweight recommendation or personalization systems, even smaller dimensions may be enough.


### #4 Vocabulary Size

A model’s **vocabulary size** refers to the number of unique tokens its tokenizer can recognize. This directly impacts its ability to handle different languages and domain-specific terminology. If a word or character isn’t in the vocabulary, it’s marked as `[UNK]`, which can cause meaning to be lost.

The requirements vary by use case. Multilingual scenarios generally need larger vocabularies—on the order of 50k+ tokens, as in the case of [_BGE-M3_](https://zilliz.com/ai-models/bge-m3). For domain-specific applications, coverage of specialized terms is most important. For example, a legal model should natively support terms like _"statute of limitations"_ or _"bona fide acquisition_," while a Chinese model must account for thousands of characters and unique punctuation. Without sufficient vocabulary coverage, embedding accuracy quickly breaks down.


### # 5 Training Data

The **training data** defines the boundaries of what an embedding model “knows.” Models trained on broad, general-purpose data—such as _text-embedding-ada-002_, which utilizes a mix of web pages, books, and Wikipedia—tend to perform well across various domains. But when you need precision in specialized fields, domain-trained models often win. For example, _LegalBERT_ and _BioBERT_ outperform general models on legal and biomedical texts, though they lose some generalization ability.

The rule of thumb:

- **General scenarios** → use models trained on broad datasets, but make sure they cover your target language(s). For example, Chinese applications need models trained on rich Chinese corpora.

- **Vertical domains** → choose domain-specific models for best accuracy.

- **Best of both worlds** → newer models like **NV-Embed**, trained in two stages with both general and domain-specific data, show promising gains in generalization _and_ domain precision.


### # 6 Cost

Cost isn’t just about API pricing—it’s both **economic cost** and **computational cost**. Hosted API models, like those from OpenAI, are usage-based: you pay per call, but don’t worry about infrastructure. This makes them perfect for rapid prototyping, pilot projects, or small to medium-scale workloads.

Open-source options, such as _BGE_ or _Sentence-BERT_, are free to use but require self-managed infrastructure, typically GPU or TPU clusters. They’re better suited for large-scale production, where long-term savings and flexibility offset the one-time setup and maintenance costs.

The practical takeaway: **API models are ideal for fast iteration**, while **open-source models often win in large-scale production** once you factor in the total cost of ownership (TCO). Choosing the right path depends on whether you need speed to market or long-term control.


### # 7 MTEB Score

The [**Massive Text Embedding Benchmark (MTEB)**](https://zilliz.com/glossary/massive-text-embedding-benchmark-(mteb)) is the most widely used standard for comparing embedding models. It evaluates performance across various tasks, including semantic search, classification, clustering, and others. A higher score generally means the model has stronger generalizability across different types of tasks.

That said, MTEB is not a silver bullet. A model that scores high overall might still underperform in your specific use case. For example, a model trained primarily on English may perform well on MTEB benchmarks but struggle with specialized medical texts or non-English data. The safe approach is to use MTEB as a starting point and then validate it with **your own datasets** before committing.


### # 8 Domain Specificity

Some models are purpose-built for specific scenarios, and they shine where general models fall short:

- **Legal:** _LegalBERT_ can distinguish fine-grained legal terms, such as _defense_ versus _jurisdiction_.

- **Biomedical:** _BioBERT_ accurately handles technical phrases like _mRNA_ or _targeted therapy_.

- **Multilingual:** _BGE-M3_ supports over 100 languages, making it well-suited for global applications that require bridging English, Chinese, and other languages.

- **Code retrieval:** _Qwen3-Embedding_ achieves top-tier scores (81.0+) on _MTEB-Code_, optimized for programming-related queries.

If your use case falls within one of these domains, domain-optimized models can significantly improve retrieval accuracy. But for broader applications, stick with general-purpose models unless your tests show otherwise.


## Additional Perspectives for Evaluating Embeddings

Beyond the core eight factors, there are a few other angles worth considering if you want a deeper evaluation:

- **Multilingual alignment**: For multilingual models, it’s not enough to simply support many languages. The real test is whether the vector spaces are aligned. In other words, do semantically identical words—say “cat” in English and “gato” in Spanish—map close together in the vector space? Strong alignment ensures consistent cross-language retrieval. 

- **Adversarial testing**: A good embedding model should be stable under small input changes. By feeding in nearly identical sentences (e.g., “The cat sat on the mat” vs. “The cat sat on a mat”), you can test whether the resulting vectors shift reasonably or fluctuate wildly. Large swings often point to weak robustness.

- **Local semantic coherence** refers to the phenomenon of testing whether semantically similar words cluster tightly in local neighborhoods. For example, given a word like “bank,” the model should group related terms (such as “riverbank” and “financial institution”) appropriately while keeping unrelated terms at a distance. Measuring how often “intrusive” or irrelevant words creep into these neighborhoods helps compare model quality.

These perspectives aren’t always required for day-to-day work, but they’re helpful for stress-testing embeddings in production systems where multilingual, high-precision, or adversarial stability really matters.


## Common Embedding Models: A Brief History

The story of embedding models is really the story of how machines have learned to understand language more deeply over time. Each generation has pushed past the limits of the one before it—moving from static word representations to today’s large language model (LLM) embeddings that can capture nuanced context.


### Word2Vec: The Starting Point (2013)

[Google’s Word2Vec](https://zilliz.com/glossary/word2vec) was the first breakthrough that made embeddings widely practical. It was based on the _distributional hypothesis_ in linguistics—the idea that words appearing in similar contexts often share meaning. By analyzing massive amounts of text, Word2Vec mapped words into a vector space where related terms sat close together. For example, “puma” and “leopard” clustered nearby thanks to their shared habitats and hunting traits.

Word2Vec came in two flavors:

- **CBOW (Continuous Bag of Words):** predicts a missing word from its surrounding context.

- **Skip-Gram:** does the reverse—predicting surrounding words from a target word.

This simple but powerful approach allowed for elegant analogies like:

```
king - man + woman = queen
```

For its time, Word2Vec was revolutionary. But it had two significant limitations. First, it was **static**: each word had only one vector, so “bank” meant the same thing whether it was near “money” or “river.” Second, it only worked at the **word level**, leaving sentences and documents outside its reach.


### BERT: The Transformer Revolution (2018)

If Word2Vec gave us the first map of meaning, [**BERT (Bidirectional Encoder Representations from Transformers)**](https://zilliz.com/learn/what-is-bert) redrew it with far greater detail. Released by Google in 2018, BERT marked the beginning of the era of _deep semantic understanding_ by introducing the Transformer architecture into embeddings. Unlike earlier LSTMs, Transformers can examine all words in a sequence simultaneously and in both directions, enabling a far richer context.

BERT’s magic came from two clever pre-training tasks:

- **Masked Language Modeling (MLM):** Randomly hides words in a sentence and forces the model to predict them, teaching it to infer meaning from context.

- **Next Sentence Prediction (NSP):** Trains the model to decide if two sentences follow one another, helping it learn relationships across sentences.

Under the hood, BERT’s input vectors combined three elements: token embeddings (the word itself), segment embeddings (which sentence it belongs to), and position embeddings (where it sits in the sequence). Together, these gave BERT the ability to capture complex semantic relationships at both the **sentence** and **document** level. This leap made BERT state-of-the-art for tasks like question answering and semantic search.

Of course, BERT wasn’t perfect. Its early versions were limited to a **512-token window**, meaning long documents had to be chopped up and sometimes lost meaning. Its dense vectors also lacked interpretability—you could see two texts match, but not always explain why. Later variants, such as **RoBERTa**, dropped the NSP task after research showed it added little benefit, while retaining the powerful MLM training.


### BGE-M3: Fusing Sparse and Dense (2023)

By 2023, the field had matured enough to recognize that no single embedding method could accomplish everything. Enter [BGE-M3](https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings) (BAAI General Embedding-M3), a hybrid model explicitly designed for retrieval tasks. Its key innovation is that it doesn’t just produce one type of vector—it generates dense vectors, sparse vectors, and multi-vectors all at once, combining their strengths.

- **Dense vectors** capture deep semantics, handling synonyms and paraphrases (e.g., “iPhone launch”, ≈ “Apple releases new phone”).

- **Sparse vectors** assign explicit term weights. Even if a keyword doesn’t appear, the model can infer relevance—for example, linking “iPhone new product” with “Apple Inc.” and “smartphone.”

- **Multi-vectors** refine dense embeddings further by allowing each token to contribute its own interaction score, which is helpful for fine-grained retrieval.

BGE-M3’s training pipeline reflects this sophistication:

1. **Pre-training** on massive unlabeled data with _RetroMAE_ (masked encoder + reconstruction decoder) to build general semantic understanding.

2. **General fine-tuning** using contrastive learning on 100M text pairs, sharpening its retrieval performance.

3. **Task fine-tuning** with instruction tuning and complex negative sampling for scenario-specific optimization.

The results are impressive: BGE-M3 handles multiple granularities (from word-level to document-level), delivers strong multilingual performance—especially in Chinese—and balances accuracy with efficiency better than most of its peers. In practice, it represents a major step forward in building embedding models that are both powerful and practical for large-scale retrieval.


### LLMs as Embedding Models (2023–Present)

For years, the prevailing wisdom was that decoder-only large language models (LLMs), such as GPT, weren’t suitable for embeddings. Their causal attention—which only looks at previous tokens—was thought to limit deep semantic understanding. But recent research has flipped that assumption. With the right tweaks, LLMs can generate embeddings that rival, and sometimes surpass, purpose-built models. Two notable examples are LLM2Vec and NV-Embed.

**LLM2Vec** adapts decoder-only LLMs with three key changes:

- **Bidirectional attention conversion**: replacing causal masks so each token can attend to the full sequence.

- **Masked next token prediction (MNTP):** a new training objective that encourages bidirectional understanding.

- **Unsupervised contrastive learning:** inspired by SimCSE, it pulls semantically similar sentences closer together in vector space.

**NV-Embed**, meanwhile, takes a more streamlined approach:

- **Latent attention layers:** add trainable “latent arrays” to improve sequence pooling.

- **Direct bidirectional training:** simply remove causal masks and fine-tune with contrastive learning.

- **Mean pooling optimization:** uses weighted averages across tokens to avoid “last-token bias.”

The result is that modern LLM-based embeddings combine **deep semantic understanding** with **scalability**. They can handle **very long context windows (8K–32K tokens)**, making them especially strong for document-heavy tasks in research, law, or enterprise search. And because they reuse the same LLM backbone, they can sometimes deliver high-quality embeddings even in more constrained environments. 


## Conclusion: Turning Theory into Practice

When it comes to choosing an embedding model, theory only gets you so far. The real test is how well it performs in _your_ system with _your_ data. A few practical steps can make the difference between a model that looks good on paper and one that actually works in production:

- **Screen with MTEB subsets.** Use benchmarks, especially retrieval tasks, to build an initial shortlist of candidates.

- **Test with real business data.** Create evaluation sets from your own documents to measure recall, precision, and latency under real-world conditions.

- **Check database compatibility.** Sparse vectors require inverted index support, while high-dimensional dense vectors demand more storage and computation. Ensure your vector database can accommodate your choice.

- **Handle long documents smartly.** Utilize segmentation strategies, such as sliding windows, for efficiency, and pair them with large context window models to preserve meaning.

From Word2Vec’s simple static vectors to LLM-powered embeddings with 32K contexts, we’ve seen huge strides in how machines understand language. But here’s the lesson every developer eventually learns: the _highest-scoring_ model isn’t always the _best_ model for your use case.

At the end of the day, users don’t care about MTEB leaderboards or benchmark charts—they just want to find the right information, fast. Choose the model that balances accuracy, cost, and compatibility with your system, and you’ll have built something that doesn’t just impress in theory, but truly works in the real world.
