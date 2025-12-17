---
id: building-a-search-pipeline-that-understands-what-users-want.md
title: >
 Building a Search Pipeline That Understands What Users Want
author: Sudhanshu Prajapati
date: 2025-12-17
cover: assets.zilliz.com/semantic_search_325a0b5597.png
tag: Tutorial
recommend: false
publishToMedium: true
tags: Milvus, vector database
meta_keywords: Milvus, vector database, semantic search, filtered search
meta_title: >
 How to Add Label Extraction to Semantic Search Pipeline with Milvus
desc: Discover how Milvus enables a single search pipeline that combines semantic search with structured constraints for consistent, high-quality retrieval.
origin: https://github.com/sudhanshu456/milvus-rag-semantic-search/blob/main/search_pipeline_demo.ipynb
---

_This post was originally published on_ [_GitHub_](https://github.com/sudhanshu456/milvus-rag-semantic-search/blob/main/search_pipeline_demo.ipynb) _and is reposted here with permission._

Whenever you try to find something on an e-commerce site, you don't search in natural language, because the way search engine result is not catered to our natural way of looking things. For example, we searched for _“comfortable running shoes under $100”_ and the results will contain items costing more than $200, some of which are not running shoes, and ignore the comfort requirement. This happens because keyword search treats queries as disconnected terms instead of meaningful requests. It cannot infer that “comfortable” refers to cushioning and support or that “under $100” is a strict limit.

In such scenarios, you either move away from that platform or you think the product isn't available on the site. This leads to the Null Result Fallacy, they tend to show anything matching those keywords, any kind of shoe, where results are technically correct but practically irrelevant. This is where semantic search helps!


## Why Semantic Search?

To understand semantic search let's think about you search for things in real life. When you ask a friend "where can I find good coffee nearby?", you're not looking for place with "good coffee" in their name. You're looking for coffee shops that serve quality coffee and are close to you. Your friend understands the meaning behind your question, not just the keywords.

Semantic search applies similar idea. A model can recognize that “comfortable running shoes” relates to concepts like cushioning, support, and softness even if those words are not present. Semantic understanding is only part of the solution. You might expect the system to apply structured filters such as price, category, and availability. A Filtered Search supports this by combining semantic vectors with strict filters in one retrieval process. Before we look at the structured filters, let's deep dive more into matching words vs vectors!


### From Words to Vectors

In the early days of search approaches, we used to match _words_, nowadays we switched to matching _vectors_. This is where embedding models come in. The reason is that traditional word embeddings, such as TF-IDF, Word2Vec, and GloVe, operate at the word level. They can tell you that "dog" and "puppy" are similar, but they struggle with understanding the full meaning of a sentence or phrase. When you search for "comfortable running shoes," you need to understand the entire phrase as a unit, not just individual words.

New embedding models solve this by converting entire sentences or phrases into dense vector representations (embeddings) that capture their semantic meaning. These models are trained on millions of text pairs to understand that "comfortable running shoes" and "cushioned athletic footwear" mean essentially the same thing, even though they share no common words.

The model we will be using in this blog is gemini-embedding-001, Google's latest embedding model that converts text into 3072-dimensional vectors. Each dimension captures some aspect of meaning. When two pieces of text have similar meanings, their vectors will be close together. When they're different, the vectors will be far apart. This higher dimensionality allows for a more nuanced understanding of semantic relationships.


### Milvus

A search pipeline needs more than a vector index. It needs a database that supports vector search and structured filtering in one place. Milvus provides this by running vector similarity search with scalar filters such as price and category. It also performs pre filtering so that items outside constraints do not enter the vector search step. Helps improves accuracy and latency.


### When Semantic Search Needs Structure

Users often search with layered intent. A query like “wireless headphones with noise cancellation” implies:

- category: headphones

- wireless capability

- noise cancellation

- expected price range

- brand considerations

- in stock items only

Traditional keyword search treats these as isolated words. Users expect a system that recognizes how these elements work together.


### Traditional Search vs What Users Want

    Traditional Keyword Search:
    ┌─────────────────────────────────────────────────────────┐
    │ Query: "comfortable running shoes under $100"           │
    └─────────────────────────────────────────────────────────┘
                            │
                            ▼
    ┌─────────────────────────────────────────────────────────┐
    │ Results:                                                │
    │ Running shoes - $150 (over budget)                      │
    │ Comfortable slippers - $80 (not running shoes)          │
    │ Running shoes - $90 (out of stock)                      │
    │ Running shoes - $95 (only one relevant match)           │
    └─────────────────────────────────────────────────────────┘

    Hybrid Approach:
    ┌─────────────────────────────────────────────────────────┐
    │ Query: "comfortable running shoes under $100"           │
    └─────────────────────────────────────────────────────────┘
                            │
            ┌───────────────────────────────┬───────────────────────────────┐
            ▼                               ▼
    ┌──────────────────┐          ┌──────────────────┐
    │ Semantic Search  │          │ Label Filters    │
    │ (interprets      │    +     │ price < $100     │
    │ "comfortable")   │          │ category         │
    └──────────────────┘          │ stock            │
                                  └──────────────────┘
            │                               │
            └───────────────────────────────┬───────────────────────────────┘
                                            ▼
    ┌─────────────────────────────────────────────────────────┐
    │ Results:                                                │
    │ Running shoes - $95 (in stock, comfortable)             │
    │ Running shoes - $89 (in stock, cushioned)               │
    │ Running shoes - $75 (in stock, supportive)              │
    └─────────────────────────────────────────────────────────┘


ANN search with filtering aligns user phrasing with product meaning and applies filters at the same time.

## Building the Intent Aware Search Pipeline

The pipeline augments the retrieval layer with components that interpret language, apply filters, and optionally generate explanations. It does not replace existing databases. It enhances how information is retrieved.

**Full Workflow**

    ┌─────────────────────────────────────────────────────────────────┐
    │                    User Query                                   │
    │         "Navy blue joggers for men cheap"                       │
    └────────────────────────────┬────────────────────────────────────┘
                                 │
                                 ▼
            ┌────────────────────────────────────┐
            │  1. The Parser (LLM Layer)         │
            │     Extracts structured metadata   │
            │     from natural language          │
            │                                    │
            │     Input: "Navy blue joggers      │
            │             for men cheap"         │
            │                                    │
            │     Output: {                      │
            │       "category": "pants",         │
            │       "style": "joggers",          │
            │       "gender": "male",            │
            │       "color": "blue",             │
            │       "price_tier": "low"          │
            │     }                              │
            └────────────┬───────────────────────┘
                         │
                         ▼
            ┌────────────────────────────────────┐
            │  2. The Retriever (Milvus Layer)   │
            │     Combines semantic search       │
            │     with extracted constraints     │
            │                                    │
            │     • Semantic: Vector embedding   │
            │       for "joggers"                │
            │     • Filters: price <= $X,        │
            │       category="pants",            │
            │       gender="male"                │
            │                                    │
            │     Milvus performs ANN search     │
            │     WITHIN the filtered subset     │
            │     (pre-filtering for speed)      │
            └────────────┬───────────────────────┘
                         │
                         ▼
            ┌────────────────────────────────────┐
            │  3. The Synthesizer (RAG Layer)    │
            │     Optional: For complex queries  │
            │     like "Which of these is best   │
            │     for winter?"                   │
            │                                    │
            │     LLM takes retrieved products   │
            │     and generates natural language │
            │     answer (RAG)                   │
            └────────────┬───────────────────────┘
                         │
                         ▼
            ┌────────────────────────────────────┐
            │        Filtered Results            │
            │   + Natural Language Answer        │
            │                                    │
            │   Result: Search experience that   │
            │   feels like a conversation with   │
            │   a knowledgeable salesperson      │
            └────────────────────────────────────┘


This pipeline supports a search experience that responds to user intent and business constraints. Next, we’ll implement these layers step-by-step in code. Let's begin!

## Setting Up Search Pipeline

Before we start building, we need to set up our environment. We'll use uv for environment management, uv make the evironment setup easy!


### Environment Setup (Run Once in Terminal)

**Before opening this notebook**, make sure you've set up your Python environment in your terminal:

_# Create virtual environment and install dependencies_

uv venv

source .venv/bin/activate 

uv pip install -r requirements.txt

_# Create Jupyter kernel for this environment_

python -m ipykernel install --user --name zilliz-demo --display-name "Python (zilliz-demo)"

Then open this notebook in Jupyter and select the zilliz-demo kernel from the kernel selector.


### Verify Environment

Let's verify that the environment is set up correctly:

```
# Verify Python environment
import sys
import os

print(f"Python version: {sys.version}")
print(f"Python executable: {sys.executable}")
print(f"Virtual environment: {os.environ.get('VIRTUAL_ENV', 'Not detected')}")

if hasattr(sys, 'real_prefix') or (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix):
    print("✓ Running in a virtual environment")
else:
    print("⚠ Warning: Not running in a virtual environment. Consider using uv or venv.")
```

Python version: 3.13.1 (main, Dec  3 2024, 17:59:52) [Clang 16.0.0 (clang-1600.0.26.4)]

Python executable: /Users/sudhanshu/Downloads/Workspace/zilliz-demo/.venv/bin/python

Virtual environment: /Users/sudhanshu/Downloads/Workspace/zilliz-demo/.venv

✓ Running in a virtual environment

```
# Install required packages (only if you haven't used uv setup)
# If you've already created the environment using 'uv' as shown above, you can skip this cell.
%pip install -q pymilvus langextract google-genai pandas numpy python-dotenv pydantic jupyter ipykernel
```

**[**notice**]** A new release of pip is available: 24.3.1 -> 25.3

**[**notice**]** To update, run: pip3 install --upgrade pip

Note: you may need to restart the kernel to use updated packages.

```
import os
import json
import random
import textwrap
from typing import List, Dict, Any, Optional
from datetime import datetime

import pandas as pd
import numpy as np
from pymilvus import MilvusClient, DataType

# Google GenAI for embeddings
from google import genai
from google.genai.types import EmbedContentConfig

# LangExtract for structured label extraction
import langextract as lx

print("All imports successful!")
```

All imports successful!

## Connecting to Milvus: Vector database

Now, that we have our environment ready, we need to connect to Milvus, our vector database.

For this demo, we'll run Milvus standalone using Docker. It's the simplest way to get started, and it's perfect for development and testing. In production, you might want to use Milvus Cluster for better scalability and reliability.

Ensure Milvus is running via Docker, Start it with:

docker-compose up -d

Once it's running, we can connect to it and start building our search pipeline. For more information refer to [Milvus Standalone Docker docs](https://milvus.io/docs/install_standalone-docker-compose.md).

```
# Connect to Milvus (running in Docker)
milvus_client = MilvusClient(uri="http://localhost:19530")
print("Connected to Milvus successfully!")
```

Connected to Milvus successfully!

## Creating Real World Product Dataset

To demonstrate our search pipeline, we need realistic product descriptions data that mirror what you'd find in a real e-commerce system. Each product needs both unstructured text (the description) and structured labels (category, brand, price, rating, stock status).


### Data Model

When a customer searches for "comfortable running shoes," they're not just looking at the text description. They're also considering the price, checking if it's in stock, looking at the brand reputation, and seeing the rating. Our data model needs to capture all of this, which later on make the filtering and search more effective.

    Product Data Structure:
    ┌─────────────────────────────────────────────────────────────┐
    │ Unstructured Text (for semantic search):                    │
    │ "TechPro Wireless Bluetooth headphones with active noise    │
    │  cancellation, 30-hour battery life, premium sound quality. │
    │  Price: $149. Rating: 4.5/5. In Stock."                     │
    ├─────────────────────────────────────────────────────────────┤
    │ Structured Labels (extracted by LangExtract):               │
    │ • category: "Electronics"      (VARCHAR/enum)               │
    │ • brand: "TechPro"             (VARCHAR/enum)               │
    │ • price: 149.0                 (DOUBLE)                     │
    │ • rating: 4.5                  (DOUBLE)                     │
    │ • stock_status: "In Stock"     (VARCHAR/enum)               │
    └─────────────────────────────────────────────────────────────┘



This filtered ANN search approach allows us to:

- **Search semantically** using the text description

- **Filter precisely** using structured attributes

- **Combine both** for the best results

```
# List of product descriptions 
# LangExtract will extract category, brand, price, rating, and stock_status from these
PRODUCT_DESCRIPTIONS = ["TechPro Wireless Bluetooth headphones with active noise cancellation, 30-hour battery life, premium sound quality. Price: $149. Rating: 4.5/5. In Stock.", 
                        "SmartGadget Smartwatch with fitness tracking, heart rate monitor, GPS, and water resistance up to 50 meters. Currently $199. Customer rating: 4.8 stars. Available now.",
                        "ElectroMax 4K Ultra HD Smart TV with HDR, voice control, and streaming apps built-in. On sale for $299. Rated 4.2/5. Low Stock - only 3 left!",
                        "DigitalPlus Laptop computer with fast processor, 16GB RAM, SSD storage, perfect for work and gaming. Price: $899. Rating: 4.7/5. In Stock.", 
                        "TechPro Wireless charging pad compatible with all smartphones, fast charging support. Just $29.99. 4.0 star rating. In Stock.", 
                        "StyleCo Comfortable cotton t-shirt, breathable fabric, available in multiple colors and sizes. Price: $24.99. Rating: 4.3/5. In Stock.",
                        "FashionHub Running shoes with cushioned sole, lightweight design, perfect for daily jogging. $89. Customer rating: 4.6 stars. In Stock.", 
                        "StyleCo Yoga pants made from moisture-wicking material, flexible and comfortable. $39.99. Rating: 4.5/5. In Stock.",  
                        "LiteraryPress Mystery thriller novel, bestselling author, paperback edition. $12.99. 4.3 star rating. In Stock.",  
                       ]

print(f"Loaded {len(PRODUCT_DESCRIPTIONS)} product descriptions")
print("\nSample product description:")
print(PRODUCT_DESCRIPTIONS[0])
```

Loaded 9 product descriptions

Sample product description:
TechPro Wireless Bluetooth headphones with active noise cancellation, 30-hour battery life, premium sound quality. Price: $149. Rating: 4.5/5. In Stock.

## Extracting Structure from Chaos

In a real-world scenario, you might have product descriptions that are completely unstructured. A product listing might say "Premium wireless headphones with active noise cancellation, 30-hour battery, perfect for travel" without explicitly listing category, price range, or warranty information.


### Label Extraction with LangExtract

Label extraction is the process of automatically pulling structured information from unstructured text which might not be provided by the seller. This will help us read through product descriptions and fill out the key features which we might need for semantic search.

**Example: From Unstructured to Structured**

    Input (Unstructured Text):
    ┌─────────────────────────────────────────────────────────────┐
    │ "TechPro Wireless Bluetooth headphones with active noise    │
    │  cancellation, 30-hour battery life, premium sound quality. │
    │  Price: $149. Rating: 4.5/5. In Stock."                     │
    └─────────────────────────────────────────────────────────────┘
                            │
                            ▼
                [LangExtract Processing]
                            │
                            ▼
    Output (Structured Labels):
    ┌─────────────────────────────────────────────────────────────┐
    │ {                                                           │
    │   "category": "Electronics",                                │
    │   "brand": "TechPro",                                       │
    │   "price": 149.0,                                           │
    │   "rating": 4.5,                                            │
    │   "stock_status": "In Stock"                                │
    │ }                                                           │
    └─────────────────────────────────────────────────────────────┘

We'll use **LangExtract** from Google to extract labels from product descriptions. LangExtract is specifically designed for extracting structured information from unstructured text using LLMs, with precise source grounding and reliable structured outputs.

**API Key Setup:**

For cloud models like Gemini, you'll need to set up an API key. This same key is used for embeddings, LangExtract, and RAG:

_#Environment variable_

export GEMINI_API_KEY**=**"your-api-key-here"

Get your API key from [AI Studio](https://aistudio.google.com/app/apikey) for Gemini models. This single API key works across all components of our pipeline.


### Preparing for Label Extraction

Before we start extracting labels from our product descriptions, let's suppress some non-critical warning messages from LangExtract. These warnings are about fuzzy text matching in prompts and don't affect functionality, but they can clutter our output.

```
# Initialize Gemini embedding model
genai_client = genai.Client()

EMBEDDING_MODEL = "gemini-embedding-001"
EMBEDDING_DIM = 3072  # Dimension for gemini-embedding-001

print("Gemini embedding model configured!")
```

Gemini embedding model configured!


```
# Define the extraction prompt 
EXTRACTION_PROMPT = textwrap.dedent(
    """\
    Extract structured information from product descriptions.
    Extract: category type, brand name, price value, rating value, stock status, features list, warranty info, and price range.

    For the brand: Extract the brand name that appears at the beginning of the description.
    For price: Extract just the numeric value (e.g., 149 from "$149")
    For rating: Extract just the numeric value (e.g., 4.5 from "4.5/5")
    For category: Identify the general product type (Electronics, Clothing, Books, etc.)
    For stock: Extract "In Stock", "Low Stock", or "Out of Stock"
    For features: Extract key product features as a comma-separated list (e.g., "wireless, noise_cancellation, long_battery")
    For has_warranty: Determine if product has warranty (true/false based on context or price - electronics >$100 likely have warranty)
    For price_range: Categorize as "budget" (<$50), "mid" ($50-$150), or "premium" (>$150)
    """
    )

# Provide examples with text span matching
EXTRACTION_EXAMPLES = [
    lx.data.ExampleData(
        text=(
            "TechPro Wireless Bluetooth headphones with active noise cancellation, "
            "30-hour battery life, premium sound quality. Price: $149.7 "
            "Rating: 4.5/5. In Stock."
        ),
        extractions=[
            lx.data.Extraction(
                extraction_class="category",
                extraction_text="headphones",
                attributes={"type": "Electronics"}
            ),
            lx.data.Extraction(
                extraction_class="brand",
                extraction_text="TechPro Wireless Bluetooth headphones with active noise cancellation, 30-hour battery life, premium sound quality",
                attributes={"name": "TechPro"}
            ),
            lx.data.Extraction(
                extraction_class="price",
                extraction_text="149.7",
                attributes={"value": 149.7}
            ),
            lx.data.Extraction(
                extraction_class="rating",
                extraction_text="4.5",
                attributes={"value": 4.5}
            ),
            lx.data.Extraction(
                extraction_class="stock_status",
                extraction_text="In Stock",
                attributes={"status": "In Stock"}
            ),
            lx.data.Extraction(
                extraction_class="features",
                extraction_text="Wireless Bluetooth headphones with active noise cancellation, 30-hour battery life, premium sound quality",
                attributes={"list": "wireless, bluetooth, noise_cancellation, long_battery, premium_sound"}
            ),
            lx.data.Extraction(
                extraction_class="has_warranty",
                extraction_text="TechPro Wireless Bluetooth headphones",
                attributes={"value": True}
            ),
            lx.data.Extraction(
                extraction_class="price_range",
                extraction_text="149.7",
                attributes={"range": "mid"}
            ),
        ]
    ),
    lx.data.ExampleData(
        text=(
            "StyleCo Comfortable cotton t-shirt, breathable fabric, available in multiple colors "
            "and sizes. Price: $24.99. Rating: 4.3/5. In Stock."
        ),
        extractions=[
            lx.data.Extraction(
                extraction_class="category",
                extraction_text="t-shirt",
                attributes={"type": "Clothing"}
            ),
            lx.data.Extraction(
                extraction_class="brand",
                extraction_text="StyleCo Comfortable cotton t-shirt, breathable fabric, available in multiple colors and sizes",
                attributes={"name": "StyleCo"}
            ),
            lx.data.Extraction(
                extraction_class="price",
                extraction_text="24.99",
                attributes={"value": 24.99}
            ),
            lx.data.Extraction(
                extraction_class="rating",
                extraction_text="4.3",
                attributes={"value": 4.3}
            ),
            lx.data.Extraction(
                extraction_class="stock_status",
                extraction_text="In Stock",
                attributes={"status": "In Stock"}
            ),
            lx.data.Extraction(
                extraction_class="features",
                extraction_text="Comfortable cotton t-shirt, breathable fabric, available in multiple colors and sizes",
                attributes={"list": "comfortable, cotton, breathable, multiple_colors"}
            ),
            lx.data.Extraction(
                extraction_class="has_warranty",
                extraction_text="t-shirt",
                attributes={"value": False}
            ),
            lx.data.Extraction(
                extraction_class="price_range",
                extraction_text="24.99",
                attributes={"range": "budget"}
            ),
        ]
    ),
    lx.data.ExampleData(
        text=(
            "ElectroMax 4K Ultra HD Smart TV with HDR, voice control, and streaming apps built-in. "
            "On sale for $299. Rated 4.2/5. Low Stock - only 3 left!"
        ),
        extractions=[
            lx.data.Extraction(
                extraction_class="category",
                extraction_text="Smart TV",
                attributes={"type": "Electronics"}
            ),
            lx.data.Extraction(
                extraction_class="brand",
                extraction_text="ElectroMax 4K Ultra HD Smart TV with HDR, voice control, and streaming apps built-in",
                attributes={"name": "ElectroMax"}
            ),
            lx.data.Extraction(
                extraction_class="price",
                extraction_text="299",
                attributes={"value": 299}
            ),
            lx.data.Extraction(
                extraction_class="rating",
                extraction_text="4.2",
                attributes={"value": 4.2}
            ),
            lx.data.Extraction(
                extraction_class="stock_status",
                extraction_text="Low Stock",
                attributes={"status": "Low Stock"}
            ),
            lx.data.Extraction(
                extraction_class="features",
                extraction_text="4K Ultra HD Smart TV with HDR, voice control, and streaming apps built-in",
                attributes={"list": "4k, hd, hdr, voice_control, streaming, smart_tv"}
            ),
            lx.data.Extraction(
                extraction_class="has_warranty",
                extraction_text="Smart TV",
                attributes={"value": True}
            ),
            lx.data.Extraction(
                extraction_class="price_range",
                extraction_text="299",
                attributes={"range": "premium"}
            ),
        ]
    ),
]


def extract_labels_with_langextract(
    text: str, 
    model_id: str = "gemini-2.5-flash-lite" 
) -> Dict[str, Any]:
    """
    Extract structured labels from product text using LangExtract.

    Args:
        text: Product description text.
        model_id: LangExtract model to use (default: "gemini-2.5-flash-lite").

    Returns:
        Dictionary with extracted labels: category, brand, price, rating, stock_status.
    """
    try:
        # Check if API key is set
        if "GEMINI_API_KEY" not in os.environ and "GOOGLE_API_KEY" not in os.environ:
            print("⚠️  Warning: GEMINI_API_KEY not found in environment.")
            print("   Get your API key from https://aistudio.google.com/app/apikey")
            print("   Falling back to default values.")

            return {
                "category": "Unknown",
                "brand": "Unknown",
                "price": 0,
                "rating": 0,
                "stock_status": "Unknown",
                "features": "",
                "has_warranty": False,
                "price_range": "Unknown"
            }

        # Run LangExtract extraction
        result = lx.extract(
            text_or_documents=text,
            prompt_description=EXTRACTION_PROMPT,
            examples=EXTRACTION_EXAMPLES,
            model_id=model_id,
        )

        # Defaults
        category = "Unknown"
        brand = "Unknown"
        price = 0
        rating = 0
        stock_status = "Unknown"
        features = ""
        has_warranty = False
        price_range = "Unknown"

        # Parse extraction results
        if hasattr(result, "extractions") and result.extractions:
            for extraction in result.extractions:
                if extraction.extraction_class == "category":
                    category = extraction.attributes.get("type", "Unknown")

                elif extraction.extraction_class == "brand":
                    brand = extraction.attributes.get("name", "Unknown")

                elif extraction.extraction_class == "price":
                    price_value = extraction.attributes.get("value", 0)
                    # Handle both numeric and string values, keep as float for decimal prices
                    if isinstance(price_value, (int, float)):
                        price = float(price_value)
                    elif isinstance(price_value, str):
                        try:
                            # Remove $ and commas, then convert
                            clean_price = price_value.replace('$', '').replace(',', '')
                            price = float(clean_price)
                        except:
                            price = 0.0

                elif extraction.extraction_class == "rating":
                    rating_value = extraction.attributes.get("value", 0)
                    # Handle both numeric and string values, keep as float for decimal ratings
                    if isinstance(rating_value, (int, float)):
                        rating = float(rating_value)
                    elif isinstance(rating_value, str):
                        try:
                            rating = float(rating_value)
                        except:
                            rating = 0.0

                elif extraction.extraction_class == "stock_status":
                    stock_status = extraction.attributes.get("status", "Unknown")

                elif extraction.extraction_class == "features":
                    features = extraction.attributes.get("list", "")

                elif extraction.extraction_class == "has_warranty":
                    warranty_value = extraction.attributes.get("value", False)
                    if isinstance(warranty_value, bool):
                        has_warranty = warranty_value
                    elif isinstance(warranty_value, str):
                        has_warranty = warranty_value.lower() in ["true", "yes", "1"]

                elif extraction.extraction_class == "price_range":
                    price_range = extraction.attributes.get("range", "Unknown")

        return {
            "category": category,
            "brand": brand,
            "price": price,
            "rating": rating,
            "stock_status": stock_status,
            "features": features,
            "has_warranty": has_warranty,
            "price_range": price_range,
        }

    except Exception as e:
        print(f"⚠️  Error extracting labels with LangExtract: {e}")

        return {
            "category": "Unknown",
            "brand": "Unknown",
            "price": 0,
            "rating": 0,
            "stock_status": "Unknown",
            "features": "",
            "has_warranty": False,
            "price_range": "Unknown"
        }


print("Label extraction function with LangExtract defined!")
```

Label extraction function with LangExtract defined!

## Building Our Search Index: Creating the Milvus Collection

Now we'll create a Milvus collection that stores both vector embeddings and structured metadata (labels). It will act as a warehouse building where items are organized both by types (semantic similarity) and by specific attributes like price, manufacturing date , and brands (structured labels). You can search by semantic similarity and filter by structured attributes in a single query. This is what makes our filtered ANN approach possible in Milvus.

    Milvus Collection Structure:
    ┌─────────────────────────────────────────────────────────────┐
    │ Collection: "product_search"                                │
    ├─────────────────────────────────────────────────────────────┤
    │ Fields:                                                     │
    │                                                             │
    │  📝 id (INT64) - Primary key                                │
    │  📄 text (VARCHAR) - Product description                    │
    │  🔢 embedding (FLOAT_VECTOR[3072]) - Semantic vector        │
    │  🏷️  category (VARCHAR) - Product category                  │
    │  🏷️  brand (VARCHAR) - Brand name                           │
    │  🏷️  price (DOUBLE) - Price in dollars                      │
    │  🏷️  rating (DOUBLE) - Rating (1-5)                         │
    │  🏷️  stock_status (VARCHAR) - Stock availability            │
    └─────────────────────────────────────────────────────────────┘


```
# Collection name
COLLECTION_NAME = "product_search"

# Drop collection if it exists
if milvus_client.has_collection(COLLECTION_NAME):
    milvus_client.drop_collection(COLLECTION_NAME)
    print(f"Dropped existing collection: {COLLECTION_NAME}")

# Create the collection schema
schema = milvus_client.create_schema(auto_id=False, enable_dynamic_field=False)
# Define the schema fields
schema.add_field(field_name="id", datatype=DataType.INT64, is_primary=True)
schema.add_field(field_name="text", datatype=DataType.VARCHAR, max_length=1000)
schema.add_field(field_name="embedding", datatype=DataType.FLOAT_VECTOR, dim=EMBEDDING_DIM)  # gemini-embedding-001
schema.add_field(field_name="category", datatype=DataType.VARCHAR, max_length=100)
schema.add_field(field_name="brand", datatype=DataType.VARCHAR, max_length=100)
schema.add_field(field_name="price", datatype=DataType.DOUBLE)
schema.add_field(field_name="rating", datatype=DataType.DOUBLE)  # supports decimal ratings like 4.5
schema.add_field(field_name="stock_status", datatype=DataType.VARCHAR, max_length=50)
schema.add_field(field_name="features", datatype=DataType.VARCHAR, max_length=500)  # comma-separated feature list
schema.add_field(field_name="has_warranty", datatype=DataType.BOOL)
schema.add_field(field_name="price_range", datatype=DataType.VARCHAR, max_length=50)  # budget, mid, premium

# Create the collection
collection = Collection(
    name=COLLECTION_NAME,
    schema=schema
)

# Create index on the embedding field for faster searches
index_params = milvus_client.prepare_index_params()
index_params.add_index(
    field_name="embedding",
    index_type="IVF_FLAT",
    metric_type="L2",
    params={"nlist": 128},
)
milvus_client.create_collection(
    collection_name=COLLECTION_NAME,
    schema=schema,
    index_params=index_params,
)
print(f"Collection '{COLLECTION_NAME}' created successfully!")
```

Dropped existing collection: product_search
Collection 'product_search' created successfully!


```
# Suppress absl prompt alignment warnings (non-critical fuzzy match warnings)
import warnings
import logging
warnings.filterwarnings("ignore", message=".*Prompt alignment: non-exact match.*", category=UserWarning)
logging.getLogger("absl").setLevel(logging.ERROR)
```

```
# Extract structured labels from descriptions using LangExtract
def prepare_data_for_insertion(
    product_descriptions: List[str],
    genai_client,
    embedding_model: str,
    embedding_dim: int
) -> List[List]:
    """Prepares products for insertion into Milvus by extracting labels from descriptions."""
    
    ids = []
    texts = []
    embeddings = []
    categories = []
    brands = []
    prices = []
    ratings = []
    stock_statuses = []
    features_list = []
    warranties = []
    price_ranges = []

    # Extract structured labels from each description using LangExtract
    print("Extracting structured labels from product descriptions using LangExtract...")

    products = []
    for idx, description in enumerate(product_descriptions):

        # Extract labels using LangExtract
        labels = extract_labels_with_langextract(description)

        # Create product dict with extracted labels
        product = {
            "id": idx + 1,
            "text": description,
            "category": labels.get("category", "Unknown"),
            "brand": labels.get("brand", "Unknown"),
            "price": labels.get("price", 0),
            "rating": labels.get("rating", 0),
            "stock_status": labels.get("stock_status", "Unknown"),
            "features": labels.get("features", ""),
            "has_warranty": labels.get("has_warranty", False),
            "price_range": labels.get("price_range", "Unknown")
        }
        products.append(product)

        if (idx + 1) % 10 == 0:
            print(f"  Processed {idx + 1}/{len(product_descriptions)} products...")

    print(f"\nExtracted labels from {len(products)} products")
    print("\nSample extracted product:")
    print(json.dumps(products[0], indent=2))

    # Get all the text descriptions for embedding generation
    product_texts = [p["text"] for p in products]

    # Generate embeddings using Gemini API
    print("\nGenerating embeddings...")
    embedding_response = genai_client.models.embed_content(
        model=embedding_model,
        contents=product_texts,
        config=EmbedContentConfig(
            task_type="SEMANTIC_SIMILARITY",
            output_dimensionality=embedding_dim,
        ),
    )

    # Extract embeddings from response
    product_embeddings = [emb.values for emb in embedding_response.embeddings]

    # Build arrays
    for i, product in enumerate(products):
        ids.append(product["id"])
        texts.append(product["text"])
        embeddings.append(product_embeddings[i])
        categories.append(product["category"])
        brands.append(product["brand"])
        prices.append(product["price"])
        ratings.append(product["rating"])
        stock_statuses.append(product["stock_status"])
        features_list.append(product["features"])
        warranties.append(product["has_warranty"])
        price_ranges.append(product["price_range"])

    return [
        ids,
        texts,
        embeddings,
        categories,
        brands,
        prices,
        ratings,
        stock_statuses,
        features_list,
        warranties,
        price_ranges
    ]


# Prepare the data by extracting labels from descriptions
milvus_client.insert(collection_name=COLLECTION_NAME, data=rows_to_insert)

print(f"\nInserted {len(PRODUCT_DESCRIPTIONS)} products into Milvus!")
```

/Users/sudhanshu/Downloads/Workspace/zilliz-demo/.venv/lib/python3.13/site-packages/langextract/factory.py:129: UserWarning: Multiple API keys detected in environment: GEMINI_API_KEY, LANGEXTRACT_API_KEY. Using GEMINI_API_KEY and ignoring others.
  model = _create_model_with_schema(


Extracting structured labels from product descriptions using LangExtract...

**LangExtract**: model=gemini-2.5-flash-lite, current=152 chars, processed=0 chars:  [00:02]

**LangExtract**: model=gemini-2.5-flash-lite, current=167 chars, processed=0 chars:  [00:02]

**LangExtract**: model=gemini-2.5-flash-lite, current=141 chars, processed=0 chars:  [00:03]

**LangExtract**: model=gemini-2.5-flash-lite, current=138 chars, processed=0 chars:  [00:01]

**LangExtract**: model=gemini-2.5-flash-lite, current=125 chars, processed=0 chars:  [00:02]

**LangExtract**: model=gemini-2.5-flash-lite, current=134 chars, processed=0 chars:  [00:02]

**LangExtract**: model=gemini-2.5-flash-lite, current=135 chars, processed=0 chars:  [00:02]

**LangExtract**: model=gemini-2.5-flash-lite, current=114 chars, processed=0 chars:  [00:02]

**LangExtract**: model=gemini-2.5-flash-lite, current=111 chars, processed=0 chars:  [00:02]

Extracted labels from 9 products

Sample extracted product:
{
  "id": 1,
  "text": "TechPro Wireless Bluetooth headphones with active noise cancellation, 30-hour battery life, premium sound quality. Price: $149. Rating: 4.5/5. In Stock.",
  "category": "Electronics",
  "brand": "TechPro",
  "price": 149.0,
  "rating": 4.5,
  "stock_status": "In Stock",
  "features": "wireless, bluetooth, noise_cancellation, long_battery, premium_sound",
  "has_warranty": true,
  "price_range": "mid"
}

Generating embeddings...

Inserted 9 products into Milvus!

## Semantic + Structured Filtering

This is where semantic + structured filtering comes together. We've set up our data, created our embeddings, and stored everything in Milvus. Now we need to build the search function that combines semantic understanding with label filtering.


### How Our Search Function Works

Think of this like asking a knowledgeable salesperson: "Show me comfortable running shoes under $100 that are in stock." They understand what "comfortable" means (semantic), and they can check the price and stock status (structured filters). Our search function does the same thing, but at scale.

    Search Flow:
    ┌─────────────────────────────────────────────────────────────┐
    │ User Query: "comfortable running shoes under $100"          │
    └────────────────────────────┬────────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    ▼                         ▼
    ┌──────────────────────────┐  ┌──────────────────────────┐
    │ Step 1: Generate Query   │  │ Step 2: Build Filters    │
    │ Embedding                │  │                          │
    │                          │  │ • price <= 100           │
    │ "comfortable running     │  │ • category = "Clothing"  │
    │  shoes" → [0.23, 0.45,   │  │ • stock_status = "In     │
    │           0.12, ...]     │  │   Stock"                 │
    └────────────┬─────────────┘  └────────────┬─────────────┘
                 │                              │
                 └──────────────┬───────────────┘
                                ▼
                ┌───────────────────────────────┐
                │ Step 3: Milvus Hybrid Search  │
                │                               │
                │ • Semantic similarity search  │
                │ • Apply structured filters    │
                │ • Return top-k results        │
                └───────────────┬───────────────┘
                                ▼
                ┌───────────────────────────────┐
                │ Filtered, Relevant Results    │
                └───────────────────────────────┘


**Example Query Breakdown:**

Query: "wireless headphones with noise cancellation"

Filters: max_price=150, min_rating=4, stock_status="In Stock"

Processing:

1. Convert query to embedding vector

2. Build filter expression: price <= 150 AND rating >= 4 AND stock_status == "In Stock"

3. Search Milvus with both semantic similarity and filters

4. Return ranked results that match both criteria

```
# Main search function - combines semantic search with filters
def semantic_search_with_filters(
    query: str,
    milvus_client: MilvusClient,
    collection_name: str,
    genai_client,
    embedding_model: str,
    embedding_dim: int,
    top_k: int = 10,
    category: Optional[str] = None,
    brand: Optional[str] = None,
    max_price: Optional[int] = None,
    min_price: Optional[int] = None,
    min_rating: Optional[int] = None,
    stock_status: Optional[str] = None
) -> List[Dict[str, Any]]:
    """
    Does semantic search with optional filters on structured fields.
    Returns list of products matching the query.
    """
    
    # First, convert the query to an embedding vector using Gemini
    query_embedding_response = genai_client.models.embed_content(
        model=embedding_model,
        contents=[query],
        config=EmbedContentConfig(
            task_type="RETRIEVAL_QUERY",
            output_dimensionality=embedding_dim,
        ),
    )
    query_vec = query_embedding_response.embeddings[0].values
    
    # Build up the filter expression piece by piece
    filters = []
    
    if category:
        filters.append(f'category == "{category}"')
    
    if brand:
        filters.append(f'brand == "{brand}"')
    
    # Handle price range filters
    if min_price is not None:
        filters.append(f"price >= {min_price}")
    if max_price is not None:
        filters.append(f"price <= {max_price}")
    
    if min_rating is not None:
        filters.append(f"rating >= {min_rating}")
    
    if stock_status:
        filters.append(f'stock_status == "{stock_status}"')
    
    # Join all filters with AND - could also do OR if needed
    filter_str = " and ".join(filters) if filters else None
    
    try:
        # Try search with output_fields first
        search_results = milvus_client.search(
            data=[query_vec],
            anns_field="embedding",
            param={"metric_type": "L2", "params": {"nprobe": 10}},
            limit=top_k,
            filter=filter_str,
            output_fields=["text", "category", "brand", "price", "rating", "stock_status", "features", "has_warranty", "price_range"]
        )
        
        # Format the results into a nicer structure
        output = []
        for hits in search_results:
            for hit in hits:
                output.append({
                    "id": hit.id,
                    "score": hit.distance,
                    "text": hit.entity.get("text"),
                    "category": hit.entity.get("category"),
                    "brand": hit.entity.get("brand"),
                    "price": hit.entity.get("price"),
                    "rating": hit.entity.get("rating"),
                    "stock_status": hit.entity.get("stock_status")
                })
        
        return output
        
    except Exception as e:
        # Handle Milvus compatibility issue: "Unsupported field type: 0"
        if "Unsupported field type" in str(e) or "field type: 0" in str(e):
            # Fallback: search without output_fields, then query entities separately
            search_results = client.search(
                data=[query_vec],
                anns_field="embedding",
                param={"metric_type": "L2", "params": {"nprobe": 10}},
                limit=top_k,
                filter=filter_str
            )
            
            # Extract entity IDs from search results
            entity_ids = []
            scores_map = {}
            for hits in search_results:
                for hit in hits:
                    entity_ids.append(hit.id)
                    scores_map[hit.id] = hit.distance
            
            # Query entities by IDs to get the field data
            if entity_ids:
                # Format IDs for the query expression (Milvus uses parentheses for 'in')
                ids_str = "(" + ",".join(str(id) for id in entity_ids) + ")"
                entities = client.query(
                    filter=f"id in {ids_str}",
                    output_fields=["id", "text", "category", "brand", "price", "rating", "stock_status", "features", "has_warranty", "price_range"]
                )
                
                # Create a mapping of id to entity data
                entity_map = {e["id"]: e for e in entities}
                
                # Format results with entity data, preserving search order
                output = []
                for entity_id in entity_ids:
                    if entity_id in entity_map:
                        entity_data = entity_map[entity_id]
                        output.append({
                            "id": entity_id,
                            "score": scores_map.get(entity_id, 0.0),
                            "text": entity_data.get("text", ""),
                            "category": entity_data.get("category", ""),
                            "brand": entity_data.get("brand", ""),
                            "price": entity_data.get("price", 0),
                            "rating": entity_data.get("rating", 0),
                            "stock_status": entity_data.get("stock_status", ""),
                            "features": entity_data.get("features", ""),
                            "has_warranty": entity_data.get("has_warranty", False),
                            "price_range": entity_data.get("price_range", "")
                        })
                
                return output
            else:
                return []
        else:
            # Re-raise if it's a different error
            raise

print("Search function defined!")
```

Search function defined!

## Putting It to the Test: Real-World Search Scenarios

Let's test it with various queries that real customers might use. We'll see how semantic search handles natural language, and how our filters ensure we get exactly what we're looking for.


### Test Scenarios We'll Cover

Scenario 1: Simple Semantic Search

Query: "comfortable running shoes"

Filters: None

Expected: Find running shoes that are comfortable, regardless of price/brand

Scenario 2: Semantic + Price Filter

Query: "wireless headphones"

Filters: max_price=150

Expected: Wireless headphones under $150, ranked by relevance

Scenario 3: Complex Multi-Filter Search

Query: "smartwatch fitness tracking"

Filters: category="Electronics", min_rating=4, stock_status="In Stock"

Expected: High-rated, in-stock electronics smartwatches with fitness features

```
# Example 1: Simple semantic search
print("=" * 80)
print("Example 1: Simple Semantic Search")
print("=" * 80)

# Try a simple query without any filters
query1 = "comfortable running shoes"
results1 = semantic_search_with_filters(query1, milvus_client, COLLECTION_NAME, genai_client, EMBEDDING_MODEL, EMBEDDING_DIM, top_k=5)

# Print out the results
for i, result in enumerate(results1, 1):
    print(f"\n{i}. Score: {result['score']:.4f}")
    print(f"   Product: {result['text']}")
    print(f"   Category: {result['category']} | Brand: {result['brand']} | Price: ${result['price']} | Rating: {result['rating']}*")
```

**Example 1: Simple Semantic Search**


1. Score: 0.5381
   Product: FashionHub Running shoes with cushioned sole, lightweight design, perfect for daily jogging. $89. Customer rating: 4.6 stars. In Stock.
   Category: Footwear | Brand: FashionHub | Price: $89.0 | Rating: 4.6*

2. Score: 0.7244
   Product: StyleCo Comfortable cotton t-shirt, breathable fabric, available in multiple colors and sizes. Price: $24.99. Rating: 4.3/5. In Stock.
   Category: Clothing | Brand: StyleCo | Price: $24.99 | Rating: 4.3*

3. Score: 0.7625
   Product: StyleCo Yoga pants made from moisture-wicking material, flexible and comfortable. $39.99. Rating: 4.5/5. In Stock.
   Category: Clothing | Brand: StyleCo | Price: $39.99 | Rating: 4.5*

4. Score: 0.8121
   Product: TechPro Wireless charging pad compatible with all smartphones, fast charging support. Just $29.99. 4.0 star rating. In Stock.
   Category: Electronics | Brand: TechPro | Price: $29.99 | Rating: 4.0*

5. Score: 0.8175
   Product: TechPro Wireless Bluetooth headphones with active noise cancellation, 30-hour battery life, premium sound quality. Price: $149. Rating: 4.5/5. In Stock.
   Category: Electronics | Brand: TechPro | Price: $149.0 | Rating: 4.5*


```
# Example 2: Add a price filter
print("=" * 80)
print("Example 2: Semantic Search with Price Filter")
print("=" * 80)

query2 = "wireless headphones"
# Only show results under $150
results2 = semantic_search_with_filters(
    query2, 
    milvus_client,
    COLLECTION_NAME,
    genai_client, 
    EMBEDDING_MODEL, 
    EMBEDDING_DIM,
    top_k=5,
    max_price=150
)

for i, result in enumerate(results2, 1):
    print(f"\n{i}. Score: {result['score']:.4f}")
    print(f"   Product: {result['text']}")
    print(f"   Category: {result['category']} | Brand: {result['brand']} | Price: ${result['price']} | Rating: {result['rating']}*")
```

**Example 2: Semantic Search with Price Filter**

1. Score: 0.6223
   Product: TechPro Wireless Bluetooth headphones with active noise cancellation, 30-hour battery life, premium sound quality. Price: $149. Rating: 4.5/5. In Stock.
   Category: Electronics | Brand: TechPro | Price: $149.0 | Rating: 4.5*

2. Score: 0.7464
   Product: TechPro Wireless charging pad compatible with all smartphones, fast charging support. Just $29.99. 4.0 star rating. In Stock.
   Category: Electronics | Brand: TechPro | Price: $29.99 | Rating: 4.0*

3. Score: 0.8313
   Product: FashionHub Running shoes with cushioned sole, lightweight design, perfect for daily jogging. $89. Customer rating: 4.6 stars. In Stock.
   Category: Footwear | Brand: FashionHub | Price: $89.0 | Rating: 4.6*

4. Score: 0.8601
   Product: StyleCo Yoga pants made from moisture-wicking material, flexible and comfortable. $39.99. Rating: 4.5/5. In Stock.
   Category: Clothing | Brand: StyleCo | Price: $39.99 | Rating: 4.5*

5. Score: 0.8707
   Product: StyleCo Comfortable cotton t-shirt, breathable fabric, available in multiple colors and sizes. Price: $24.99. Rating: 4.3/5. In Stock.
   Category: Clothing | Brand: StyleCo | Price: $24.99 | Rating: 4.3*


```
# Example 3: Multiple filters at once
print("=" * 80)
print("Example 3: Semantic Search with Multiple Filters")
print("=" * 80)

query3 = "smartwatch fitness tracking"
# Combine multiple filters: category, rating, and stock status
results3 = semantic_search_with_filters(
    query3, 
    milvus_client,
    COLLECTION_NAME,
    genai_client, 
    EMBEDDING_MODEL, 
    EMBEDDING_DIM,
    top_k=5,
    category="Electronics",
    min_rating=4,
    stock_status="In Stock"
)

for i, result in enumerate(results3, 1):
    print(f"\n{i}. Score: {result['score']:.4f}")
    print(f"   Product: {result['text']}")
    print(f"   Category: {result['category']} | Brand: {result['brand']} | Price: ${result['price']} | Rating: {result['rating']}* | Stock: {result['stock_status']}")
```

**Example 3: Semantic Search with Multiple Filters**


1. Score: 0.5786
   Product: SmartGadget Smartwatch with fitness tracking, heart rate monitor, GPS, and water resistance up to 50 meters. Currently $199. Customer rating: 4.8 stars. Available now.
   Category: Electronics | Brand: SmartGadget | Price: $199.0 | Rating: 4.8* | Stock: In Stock

2. Score: 0.8532
   Product: TechPro Wireless charging pad compatible with all smartphones, fast charging support. Just $29.99. 4.0 star rating. In Stock.
   Category: Electronics | Brand: TechPro | Price: $29.99 | Rating: 4.0* | Stock: In Stock

3. Score: 0.8657
   Product: TechPro Wireless Bluetooth headphones with active noise cancellation, 30-hour battery life, premium sound quality. Price: $149. Rating: 4.5/5. In Stock.
   Category: Electronics | Brand: TechPro | Price: $149.0 | Rating: 4.5* | Stock: In Stock

4. Score: 0.8821
   Product: DigitalPlus Laptop computer with fast processor, 16GB RAM, SSD storage, perfect for work and gaming. Price: $899. Rating: 4.7/5. In Stock.
   Category: Electronics | Brand: DigitalPlus | Price: $899.0 | Rating: 4.7* | Stock: In Stock

## RAG-Powered Answer Generation

So far, we've built a search system that returns relevant products. But what if we want to go one step further? What if, instead of just showing a list of products, we want to generate a natural language answer that summarizes the results? This is where RAG (Retrieval-Augmented Generation) comes in.

RAG combines the retrieval (semantic search) with generation (an LLM that can create natural language responses). Instead of list of results, it can talk to you and provide a response like a qualified salesperson and also explain what's the best product for you!

    RAG Pipeline Flow:
    ┌─────────────────────────────────────────────────────────────┐
    │ User Query: "affordable fitness equipment"                  │
    └────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
                ┌────────────────────────────┐
                │ 1. Semantic Search         │
                │    (Retrieval)             │
                │    → Find relevant products│
                └────────────┬───────────────┘
                             │
                             ▼
                ┌────────────────────────────┐
                │ 2. Format Results          │
                │    → Create context from   │
                │      search results        │
                └────────────┬───────────────┘
                             │
                             ▼
                ┌────────────────────────────┐
                │ 3. LLM Generation          │
                │    → Generate natural      │
                │      language answer       │
                └────────────┬───────────────┘
                             │
                             ▼
    ┌─────────────────────────────────────────────────────────────┐
    │ Natural Language Answer:                                    │
    │ "For affordable fitness equipment, I found several great    │
    │  options. The TechPro Smartwatch at $34 offers fitness      │
    │  tracking, heart rate monitoring, and GPS. For yoga, the    │
    │  OutdoorGear Yoga Mat at $66 features a non-slip surface    │
    │  and extra padding..."                                      │
    └─────────────────────────────────────────────────────────────┘


For complex queries, we can add a RAG step that uses an LLM to generate natural language answers based on the search results. This makes the search experience more conversational and user-friendly.

**Implementation Details:**

Our RAG implementation uses Google's Gemini API to generate natural language answers. It:

- Formats search results as context for the LLM

- Uses the same API key as our embedding model and LangExtract (GEMINI_API_KEY)

- Provides informative, conversational answers that summarize the search results

```
# RAG (Retrieval-Augmented Generation) for natural language answer generation
try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False
    print("⚠️  Note: google-generativeai not installed. Install with: pip install google-generativeai")
    print("   RAG will use template-based generation. For LLM-powered RAG, install the package.")

def rag_answer_generation(
    query: str,
    search_results: List[Dict[str, Any]],
    use_llm: bool = True,
    model: str = "gemini-2.5-flash-lite"
) -> tuple:
    """
    Generate a natural language answer from search results using RAG.
    
    Uses Gemini API for LLM-powered generation when available, falls back to template-based.
    
    Args:
        query: User's search query
        search_results: Results from semantic search
        use_llm: Whether to use LLM (default: True, falls back to template if unavailable)
        model: Gemini model identifier (default: "gemini-2.5-flash-lite")
    
    Returns:
        Tuple of (answer, llm_used) where llm_used indicates if LLM was actually used
    """
    
    if not search_results:
        return "I couldn't find any products matching your search.", False
    
    # Try LLM-based generation if requested and available
    if use_llm and GEMINI_AVAILABLE:
        try:
            # Check for API key (can use GEMINI_API_KEY or GOOGLE_API_KEY)
            api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
            
            if not api_key:
                print("⚠️  Warning: No API key found. Set GEMINI_API_KEY or GOOGLE_API_KEY for LLM-powered RAG.")
                print("   Falling back to template-based generation.")
                use_llm = False
            else:
                # Configure Gemini
                genai.configure(api_key=api_key)
                
                # Format search results as context
                context_items = []
                for i, result in enumerate(search_results[:5], 1):
                    context_items.append(
                        f"Product {i}: {result['text']}\n"
                        f"  Category: {result['category']} | Brand: {result['brand']}\n"
                        f"  Price: ${result['price']} | Rating: {result['rating']}/5 | Stock: {result['stock_status']}"
                    )
                
                context = "\n\n".join(context_items)
                
                # Create the prompt
                prompt = f"""You are a helpful e-commerce assistant. Based on the following product search results, 
provide a natural, conversational answer to the user's query. Be concise but informative.

User Query: {query}

Search Results:
{context}

Provide a helpful answer that summarizes the best matching products. Highlight key features, prices, and ratings. 
If there are multiple good options, mention a few. Keep the tone friendly and helpful."""

                # Generate answer using Gemini
                gemini_model = genai.GenerativeModel(model)
                response = gemini_model.generate_content(prompt)
                
                if response and response.text:
                    return response.text.strip(), True
                else:
                    print("⚠️  Warning: Empty response from LLM. Falling back to template-based generation.")
                    use_llm = False
                    
        except Exception as e:
            print(f"⚠️  Error generating RAG answer with LLM: {e}")
            print("   Falling back to template-based generation.")
            use_llm = False
    
    # Template-based answer generation (fallback)
    if len(search_results) == 1:
        result = search_results[0]
        answer = f"I found a great match for '{query}':\n\n"
        answer += f"{result['text']}\n"
        answer += f"Price: ${result['price']} | Rating: {result['rating']}/5 | Stock: {result['stock_status']}"
    else:
        answer = f"Based on your search for '{query}', I found {len(search_results)} relevant products:\n\n"
        for i, result in enumerate(search_results[:3], 1):
            answer += f"{i}. {result['text']}\n"
            answer += f"   ${result['price']} | {result['rating']}/5 stars | {result['stock_status']}\n\n"
        
        if len(search_results) > 3:
            answer += f"... and {len(search_results) - 3} more results available."
    
    return answer, False

print("RAG function with LLM support defined!")
```
RAG function with LLM support defined!


```
# Wrapper function that combines search + RAG
def complete_search_pipeline(
    query: str,
    milvus_client,
    COLLECTION_NAME,
    genai_client,
    embedding_model: str,
    embedding_dim: int,
    top_k: int = 10,
    category: Optional[str] = None,
    brand: Optional[str] = None,
    max_price: Optional[int] = None,
    min_price: Optional[int] = None,
    min_rating: Optional[int] = None,
    stock_status: Optional[str] = None,
    use_rag: bool = False
) -> Dict[str, Any]:
    """
    Full pipeline: search + optional RAG answer generation.
    Combines semantic_search_with_filters and rag_answer_generation in one function.
    """
    
    # Do the actual search first
    search_results = semantic_search_with_filters(
        query=query,
        milvus_client,
        COLLECTION_NAME,
        genai_client=genai_client,
        embedding_model=embedding_model,
        embedding_dim=embedding_dim,
        top_k=top_k,
        category=category,
        brand=brand,
        max_price=max_price,
        min_price=min_price,
        min_rating=min_rating,
        stock_status=stock_status
    )
    
    # Generate a natural language answer
    rag_answer = None
    used_llm = False
    
    if use_rag:
        # Try to use LLM, falls back to template if API key missing
        rag_answer, used_llm = rag_answer_generation(
            query, 
            search_results, 
            use_llm=True, 
            model="gemini-2.5-flash-lite"
        )
    
    # Return everything in a dict
    return {
        "query": query,
        "results": search_results,
        "count": len(search_results),
        "answer": rag_answer,
        "rag_used": use_rag,
        "rag_llm_used": used_llm
    }

print("Complete pipeline function defined!")
```
Complete pipeline function defined!


```
# Test the complete pipeline
print("=" * 80)
print("Complete Search Pipeline Demo")
print("=" * 80)
# Run the full pipeline with RAG enabled
result = complete_search_pipeline(
        query="affordable fitness equipment",
        milvus_client,
        COLLECTION_NAME,
        genai_client=genai_client,
        embedding_model=EMBEDDING_MODEL,
        embedding_dim=EMBEDDING_DIM,
        top_k=5,
        category="Clothing",
        max_price=80,
        min_rating=3,
        use_rag=True
    )
# Display the results
print(f"\nQuery: {result['query']}")
print(f"Found {result['count']} results")
# print(f"RAG used: {result['rag_used']}")
print(f"RAG LLM used: {result['rag_llm_used']}")
print(f"\nResults:\n")

for i, product in enumerate(result['results'], 1):
    print(f"{i}. {product['text']}")
    print(f"   ${product['price']} | {product['rating']}* | {product['stock_status']}\n")

if result['answer']:
    print(f"\nRAG Answer:\n{result['answer']}")
```

**Complete Search Pipeline Demo**


Query: affordable fitness equipment
Found 2 results
RAG LLM used: True

Results:

1. StyleCo Yoga pants made from moisture-wicking material, flexible and comfortable. $39.99. Rating: 4.5/5. In Stock.
   $39.99 | 4.5* | In Stock

2. StyleCo Comfortable cotton t-shirt, breathable fabric, available in multiple colors and sizes. Price: $24.99. Rating: 4.3/5. In Stock.
   $24.99 | 4.3* | In Stock


RAG Answer:
I found some great affordable fitness clothing options for you!

For ultimate comfort and flexibility during your workouts, check out the **StyleCo Yoga Pants** for just $39.99. They're made with moisture-wicking material and have a great 4.5/5 rating!

If you're looking for a breathable basic, the **StyleCo Comfortable Cotton T-shirt** is a fantastic choice at $24.99. It also has a good rating of 4.3/5 and comes in various colors and sizes.

## Wrapping Up

In this blog, we have seen that the combination of semantic search and structured filtering can solve the traditional keyword search problem, which is too rigid, requiring exact word matches and manual synonym maintenance. Semantic search can bring more value if we combine structured filters, such as price ranges, stock status, or features, and we can achieve the best of both worlds.

The search landscape is evolving rapidly, and the combination of semantic search with structured filtering is becoming essential for modern applications. Whether you're building an e-commerce platform, a content discovery system, or an internal knowledge base, this approach gives you the flexibility and efficiency to deliver great search experiences.

If you found this valuable, I'd love to hear about your use cases and how you're implementing search in your applications. The future of search is intent-aware, and we're just getting started.
