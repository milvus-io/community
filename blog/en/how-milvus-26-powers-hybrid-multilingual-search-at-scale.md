---
id: how-milvus-26-upgrades-multilingual-full-text-search-at-scale.md
title: >
 How Milvus 2.6 Powers Hybrid Multilingual Search at Scale
author: Zayne Yue
date: 2025-07-31
desc: Milvus 2.6 introduces multilingual text analysis with 3 new solutions: Multi-Language Analyzer, Language Identifier, and ICU Tokenizer.
cover: assets.zilliz.com/How_Milvus_2_6_Powers_Hybrid_Multilingual_Search_at_Scale_cover_7feb4814dd.png
tag: Engineering
recommend: false
publishToMedium: true
tags: Milvus, vector database, vector search, AI Agents, LLM
meta_keywords: Milvus, multilingual search, hybrid search, vector search
meta_title: > 
 How Milvus 2.6 Powers Hybrid Multilingual Search at Scale
origin: https://milvus.io/blog/how-milvus-26-powers-hybrid-multilingual-search-at-scale.md
---

# How Milvus 2.6 Powers Hybrid Multilingual Search at Scale

Modern AI apps are becoming increasingly complex. You can't just throw one search method at a problem and call it done.

Consider recommendation systems - they require vector search to understand text and images, metadata filtering for details like price and category, and keyword search for queries like "Nike Air Max." Each piece does something different, and you’ll need all of them working together.

That's why we've been building hybrid search into Milvus. The future isn't vector OR keyword search - it's vector AND keyword AND filtering AND many more searches, all in one place.

When we shipped [BM25 full-text search](https://milvus.io/docs/full-text-search.md#Full-Text-Search) in Milvus 2.5, we wanted to give you that keyword piece alongside our robust vector capabilities. The customizable analyzer worked well for what it was designed to do.


## When One Analyzer Isn't Enough

The analyzer in Milvus 2.5 was a solid starting point. You could define a pipeline of tokenizers, token filters, and char filters to process text for indexing and searching. For English, setting up a standard tokenizer that splits text by whitespace and applies filters for lowercasing and stopword removal was straightforward. But what happens when your data spans multiple languages?

The challenges in multilingual scenarios are more complex than they first appear:

- **Complex Languages Need Special Treatment:** Languages like Chinese, Japanese, and Korean require specialized tokenizers that can intelligently segment strings of characters into meaningful words. While these specialized tokenizers often handle simpler languages adequately, they typically can't process multiple complex languages simultaneously.

- **Even Simple Languages Fight Each Other:** Languages like English and French might share a basic whitespace tokenizer, but further processing introduces conflicts. Apply language-specific filters like stemming or lemmatization, and the rules optimized for one language will likely break or cause errors for another.

The bottom line: relying on a single tokenizer and analyzer for multilingual datasets makes it extremely difficult to guarantee accurate tokenization across all languages, inevitably leading to degraded search quality.

That's when we started hearing from you about exactly these issues.

_"This is perfect for our searches in English, but what about our multilingual customer support tickets?" "We love having both vector and BM25 search, but our dataset includes Chinese, Japanese, and English content." "Can we get the same search precision across all our languages?"_

These conversations confirmed what we'd discovered technically - that full-text search operates fundamentally differently from vector search. While vector search captures semantic meaning in high-dimensional space, full-text search relies on understanding language structure - how words are formed, where they begin and end, and how they relate to each other.

Consider searching for "running shoes" in English versus "跑步鞋" in Chinese. Both mean the same thing semantically (which vector search handles beautifully), but the text analysis requirements are completely different:

- **English:** Split on whitespace → lowercase → remove stopwords → stem "running" to "run"

- **Chinese:** Segment characters into words → identify "跑步" (running) and "鞋" (shoes) as separate concepts

Using an English analyzer on Chinese text fails catastrophically - there are no spaces to split on, and English stemming rules will corrupt Chinese characters.

[**Milvus 2.6**](https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md) introduces our solution: a completely revamped text analysis pipeline with comprehensive multi-language support.


## Revamped Text Analysis in Milvus 2.6: Three Multi-Language Solutions

After extensive research and development, we've built a suite of features that address different multilingual scenarios. Each approach solves the language-dependency problem in its own way.


### 1. Multi-Language Analyzer: Precision Through Control

The [**Multi-Language Analyzer**](https://milvus.io/docs/multi-language-analyzers.md#Multi-language-Analyzers) allows you to define different text processing rules for different languages within the same collection, instead of forcing all languages through the same analysis pipeline. 

**Here's how it works:** you configure language-specific analyzers and tag each document with its language during insertion. When performing a BM25 search, you specify which language analyzer to use for query processing. This ensures that both your indexed content and search queries are processed with the optimal rules for their respective languages.

**Perfect for:** Applications where you know the language of your content and want maximum search precision. Think multinational knowledge bases, localized product catalogs, or region-specific content management systems.

**The requirement:** You need to provide language metadata for each document. Currently only available for BM25 search operations.


### 2. Language Identifier Tokenizer: Automatic Language Detection

We know that manually tagging every piece of content isn't always practical. The [**Language Identifier Tokenizer**](https://milvus.io/docs/multi-language-analyzers.md#Overview) brings automatic language detection directly into the text analysis pipeline.

**Here's how it works:** This intelligent tokenizer analyzes incoming text, detects its language using sophisticated detection algorithms, and automatically applies the appropriate language-specific processing rules. You configure it with multiple analyzer definitions - one for each language you want to support, plus a default fallback analyzer.

We support two detection engines: `whatlang` for faster processing and `lingua` for higher accuracy. The system supports 71-75 languages, depending on your chosen detector. During both indexing and search, the tokenizer automatically selects the right analyzer based on detected language, falling back to your default configuration when detection is uncertain.

**Perfect for:** Dynamic environments with unpredictable language mixing, user-generated content platforms, or applications where manual language tagging isn't feasible.

**The trade-off:** Automatic detection adds processing latency and may struggle with very short text or mixed-language content. But for most real-world applications, the convenience significantly outweighs these limitations.


### 3. ICU Tokenizer: Universal Foundation

If the first two options feel like overkill, we've got something simpler for you. We've newly integrated the[ ICU (International Components for Unicode) tokenizer](https://milvus.io/docs/icu-tokenizer.md#ICU) into Milvus 2.6. ICU has been around forever - it's a mature, widely-used set of libraries that handles text processing for tons of languages and scripts. The cool thing is that it can handle various complex and simple languages all at once.

The ICU tokenizer is honestly a great default choice. It uses Unicode-standard rules for breaking up words, which makes it reliable for dozens of languages that don't have their own specialized tokenizers. If you just need something powerful and general-purpose that works well across multiple languages, ICU does the job.

**Limitation:** ICU still works within a single analyzer, so all your languages end up sharing the same filters. Want to do language-specific stuff like stemming or lemmatization? You'll run into the same conflicts we talked about earlier.

**Where it really shines:** We built ICU to work as the default analyzer within the multi-language or language identifier setups. It's basically your intelligent safety net for handling languages you haven't explicitly configured.


## See It in Action: Hands-On Demo

Enough theory—let’s dive into some code! Here’s how to use the new multilingual features in **pymilvus** to build a multilingual search collection.

We’ll start by defining some reusable analyzer configurations, then walk through **two complete examples**:

- Using the **Multi-Language Analyzer**

- Using the **Language Identifier Tokenizer**

👉 For the complete demo code, check out this link.


### Step 1: Set up the Milvus Client

_First, we connect to Milvus, set a collection name, and clean up any existing collections to start fresh._

```
from pymilvus import MilvusClient, DataType, Function, FunctionType

# 1. Setup Milvus Client
client = MilvusClient("http://localhost:19530")
COLLECTION_NAME = "multilingual_test"
if client.has_collection(collection_name=COLLECTION_NAME):
    client.drop_collection(collection_name=COLLECTION_NAME)
```


### Step 2: Define Analyzers for Multiple Languages

Next, we define an `analyzers` dictionary with language-specific configurations. These will be used in both multilingual search methods shown later.

```
# 2. Define analyzers for multiple languages
# These individual analyzer definitions will be reused by both methods.
analyzers = {
    "Japanese": { 
        # Use lindera with japanese dict 'ipadic' 
        # and remove punctuation beacuse lindera tokenizer will remain punctuation
        "tokenizer":{
            "type": "lindera",
            "dict_kind": "ipadic"
        },
        "filter": ["removepunct"]
    },
    "English": {
        # Use build-in english analyzer
        "type": "english",
    },
    "default": {
        # use icu tokenizer as a fallback.
        "tokenizer": "icu",
    }
}
```


## Option A: Using The Multi-Language Analyzer

This approach is best when you **know the language of each document ahead of time**. You'll pass that information through a dedicated ` language` field during data insertion.


### Create a Collection with Multi-Language Analyzer

We’ll create a collection where the ` "text"` field uses different analyzers depending on the `language` field value.

```
# --- Option A: Using Multi-Language Analyzer ---
print("\n--- Demonstrating Multi-Language Analyzer ---")

# 3A. reate a collection with the Multi Analyzer

mutil_analyzer_params = {
    "by_field": "language",
    "analyzers": analyzers,
}

schema = MilvusClient.create_schema(
    auto_id=True,
    enable_dynamic_field=False,
)
schema.add_field(field_name="id", datatype=DataType.INT64, is_primary=True)# Apply our multi-language analyzer to the 'title' field
schema.add_field(field_name="language", datatype=DataType.VARCHAR, max_length=255, nullable = True)
schema.add_field(field_name="text", datatype=DataType.VARCHAR, max_length=25565, enable_analyzer=True, multi_analyzer_params = mutil_analyzer_params)
schema.add_field(field_name="text_sparse", datatype=DataType.SPARSE_FLOAT_VECTOR) # Bm25 Sparse Vector

# add bm25 function
text_bm25_function = Function(
    name="text_bm25",
    function_type=FunctionType.BM25,
    input_field_names=["text"],
    output_field_names=["text_sparse"],
)
schema.add_function(text_bm25_function)

index_params = client.prepare_index_params()
index_params.add_index(
    field_name="text_sparse",
    index_type="AUTOINDEX", # Use auto index for BM25
    metric_type="BM25",
)

client.create_collection(
    collection_name=COLLECTION_NAME,
    schema=schema,
    index_params=index_params
)
print(f"Collection '{COLLECTION_NAME}' created successfully.")
```


### Insert Multilingual Data and Load Collection

Now insert documents in English and Japanese. The `language` field tells Milvus which analyzer to use.

```
# 4A. Insert data for Multi-Language Analyzer and load collection# Insert English and Japanese movie titles, explicitly setting the 'language' field
client.insert(
    collection_name=COLLECTION_NAME,
    data=[
        {"text": "The Lord of the Rings", "language": "English"},
        {"text": "Spirited Away", "language": "English"},
        {"text": "千と千尋の神隠し", "language": "Japanese"}, # This is "Spirited Away" in Japanese
        {"text": "君の名は。", "language": "Japanese"}, # This is "Your Name." in Japanese
    ]
)
print(f"Inserted multilingual data into '{COLLECTION_NAME}'.")

# Load the collection into memory before searching
client.load_collection(collection_name=COLLECTION_NAME)
```


### Run Full-Text Search

To search, specify which analyzer to use for the query based on its language.

```
# 5A. Perform a full-text search with Multi-Language Analyzer# When searching, explicitly specify the analyzer to use for the query string.
print("\n--- Search results for Multi-Language Analyzer ---")
results_multi_jp = client.search(
    collection_name=COLLECTION_NAME,
    data=["神隠し"],
    limit=2,
    output_fields=["text"],
    search_params={"metric_type": "BM25", "analyzer_name": "Japanese"}, # Specify Japanese analyzer for query
    consistency_level = "Strong",
)
print("\nSearch results for '神隠し' (Multi-Language Analyzer):")
for result in results_multi_jp[0]:
    print(result)

results_multi_en = client.search(
    collection_name=COLLECTION_NAME,
    data=["Rings"],
    limit=2,
    output_fields=["text"],
    search_params={"metric_type": "BM25", "analyzer_name": "English"}, # Specify English analyzer for query
    consistency_level = "Strong",
)
print("\nSearch results for 'Rings' (Multi-Language Analyzer):")
for result in results_multi_en[0]:
    print(result)

client.drop_collection(collection_name=COLLECTION_NAME)
print(f"Collection '{COLLECTION_NAME}' dropped.")
```


### Results: 

![](https://assets.zilliz.com/1_results_561f628de3.png)


## Option B: Using the Language Identifier Tokenizer

This approach takes the manual language handling out of your hands. The **Language Identifier Tokenizer** automatically detects the language of each document and applies the correct analyzer—no need to specify a `language` field.


### Create a Collection with Language Identifier Tokenizer

Here, we create a collection where the `"text"` field uses automatic language detection to choose the right analyzer.

```
# --- Option B: Using Language Identifier Tokenizer ---
print("\n--- Demonstrating Language Identifier Tokenizer ---")

# 3A. create a collection with language identifier
analyzer_params_langid = {
    "tokenizer": {
        "type": "language_identifier",
        "analyzers": analyzers # Referencing the analyzers defined in Step 2
    },
}

schema_langid = MilvusClient.create_schema(
    auto_id=True,
    enable_dynamic_field=False,
)
schema_langid.add_field(field_name="id", datatype=DataType.INT64, is_primary=True)
# The 'language' field is not strictly needed by the analyzer itself here, as detection is automatic.# However, you might keep it for metadata purposes.
schema_langid.add_field(field_name="text", datatype=DataType.VARCHAR, max_length=25565, enable_analyzer=True, analyzer_params = analyzer_params_langid)
schema_langid.add_field(field_name="text_sparse", datatype=DataType.SPARSE_FLOAT_VECTOR) # BM25 Sparse Vector# add bm25 function
text_bm25_function_langid = Function(
    name="text_bm25",
    function_type=FunctionType.BM25,
    input_field_names=["text"],
    output_field_names=["text_sparse"],
)
schema_langid.add_function(text_bm25_function_langid)

index_params_langid = client.prepare_index_params()
index_params_langid.add_index(
    field_name="text_sparse",
    index_type="AUTOINDEX", # Use auto index for BM25
    metric_type="BM25",
)

client.create_collection(
    collection_name=COLLECTION_NAME,
    schema=schema_langid,
    index_params=index_params_langid
)
print(f"Collection '{COLLECTION_NAME}' created successfully with Language Identifier Tokenizer.")
```


### Insert Data and Load Collection

Insert text in different languages—no need to label them. Milvus detects and applies the correct analyzer automatically.

```
# 4B. Insert Data for Language Identifier Tokenizer and Load Collection
# Insert English and Japanese movie titles. The language_identifier will detect the language.
client.insert(
    collection_name=COLLECTION_NAME,
    data=[
        {"text": "The Lord of the Rings"},
        {"text": "Spirited Away"},
        {"text": "千と千尋の神隠し"}, 
        {"text": "君の名は。"},
    ]
)
print(f"Inserted multilingual data into '{COLLECTION_NAME}'.")

# Load the collection into memory before searching
client.load_collection(collection_name=COLLECTION_NAME)
```


### Run Full-Text Search

Here’s the best part: **no need to specify an analyzer** when searching. The tokenizer automatically detects the query language and applies the right logic.

```
# 5B. Perform a full-text search with Language Identifier Tokenizer# No need to specify analyzer_name in search_params; it's detected automatically for the query.
print("\n--- Search results for Language Identifier Tokenizer ---")
results_langid_jp = client.search(
    collection_name=COLLECTION_NAME,
    data=["神隠し"],
    limit=2,
    output_fields=["text"],
    search_params={"metric_type": "BM25"}, # Analyzer automatically determined by language_identifier
    consistency_level = "Strong",
)
print("\nSearch results for '神隠し' (Language Identifier Tokenizer):")
for result in results_langid_jp[0]:
    print(result)

results_langid_en = client.search(
    collection_name=COLLECTION_NAME,
    data=["the Rings"],
    limit=2,
    output_fields=["text"],
    search_params={"metric_type": "BM25"}, # Analyzer automatically determined by language_identifier
    consistency_level = "Strong",
)
print("\nSearch results for 'the Rings' (Language Identifier Tokenizer):")
for result in results_langid_en[0]:
    print(result)

client.drop_collection(collection_name=COLLECTION_NAME)
print(f"Collection '{COLLECTION_NAME}' dropped.")
```


### Results

![](https://assets.zilliz.com/2_results_486712c3f6.png)


## Conclusion

Milvus 2.6 takes a big step forward in making **hybrid search** more powerful and accessible, combining vector search with keyword search, now across multiple languages. With the enhanced multilingual support, you can build apps that understand _what users mean_ and _what they say_, no matter what language they're using.

But that’s just one part of the update. Milvus 2.6 also brings several other features that make search faster, smarter, and easier to work with:

- **Better Query Matching** – Use `phrase_match` and `multi_match` for more accurate searches

- **Faster JSON Filtering** – Thanks to a new, dedicated index for JSON fields

- **Scalar-Based Sorting** – Sort results by any numeric field

- **Advanced Reranking** – Reorder results using models or custom scoring logic

Want the complete breakdown of Milvus 2.6? Check out our latest post: [**Introducing Milvus 2.6: Affordable Vector Search at Billion Scale**](https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md)**.** 

Have questions or want a deep dive on any feature? Join our[ Discord channel](https://discord.com/invite/8uyFbECzPX) or file issues on[ GitHub](https://github.com/milvus-io/milvus).
