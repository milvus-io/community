---
id: nano-banana-milvus-turning-hype-into-enterprise-ready-multimodal-rag.md
title: >
 Nano Banana + Milvus: Turning Hype into Enterprise-Ready Multimodal RAG
author: Lumina Wang
date: 2025-09-04
cover: assets.zilliz.com/me_with_a_dress_1_1_084defa237.png
tag: Engineering
recommend: false
publishToMedium: true
tags: Milvus, vector database, mcp, AI Agents, nano banana
meta_keywords: Vibe coding, nano banana, Milvus, model context protocol
meta_title: > 
 Nano Banana + Milvus: Turning Hype into Enterprise-Ready Multimodal RAG
desc: we’ll walk through how to combine Nano Banana and Milvus to build an enterprise-ready multimodal RAG system—and why this pairing unlocks the next wave of AI applications.
origin: https://milvus.io/blog/nano-banana-milvus-turning-hype-into-enterprise-ready-multimodal-rag.md
---

Nano Banana is going viral on social media right now and for a good reason! You’ve probably seen the images it generates or even tried it yourself. It’s a latest image generation model that turns plain text into collectible-grade figurine shots with startling precision and speed. 

Type in something like _“swap Elon’s hat and skirt,”_ and in about 16 seconds, you’ll get a photoreal result: shirt tucked, colors blended, accessories in place—no manual edits. No lag.

![](https://assets.zilliz.com/beach_side_668179b830.png)

I couldn’t resist testing it either. My prompt was:

_“Use the Nano Banana model to create a 1/7 scale commercialized figure of the character in the illustration, in a realistic style and environment. Place the figure on a computer desk, using a circular transparent acrylic base without any text. On the computer screen, display the ZBrush modeling process of the figure. Next to the screen, place a Bandai-style toy packaging box printed with the original artwork.”_

![](https://assets.zilliz.com/me_with_a_dress_506a0ebf39.png)

The result blew me away—it looked like a production prototype straight from a convention booth.

It’s no surprise that teams are already finding serious use cases for it. One of our customers, a mobile entertainment platform featuring gacha and dress-up gameplay, is developing a feature that allows players to upload photos and instantly dress up their avatars with in-game accessories. E-commerce brands are experimenting with “shoot once, reuse forever”: capturing a base model image and then generating endless outfit and hairstyle variations with AI, instead of re-shooting 20 times in the studio.

But here’s the catch—image generation alone doesn’t solve the whole problem. These systems also need **smart retrieval**: the ability to instantly find the right outfits, props, and visual elements from massive, unstructured media libraries. Without that, the generative model is guessing in the dark. What companies really need is a **multimodal RAG (retrieval-augmented generation) system**—where Nano Banana handles the creativity, and a powerful vector database handles the context.

That’s where **Milvus** comes in. As an open-source vector database, Milvus can index and search across billions of embeddings—images, text, audio, and beyond. Paired with Nano Banana, it becomes the backbone of a production-ready multimodal RAG pipeline: search, match, and generate at enterprise scale.

In the rest of this blog, we’ll walk through how to combine Nano Banana and Milvus to build an enterprise-ready multimodal RAG system—and why this pairing unlocks the next wave of AI applications.

## Building a Text-to-Image Retrieval Engine

For fast-moving consumer goods brands, game studios, and media companies, the bottleneck in AI image generation isn’t the model—it’s the mess.

Their archives are a swamp of unstructured data, including product shots, character assets, promotional videos, and outfit renders. And when you need to find “the red cape from last season’s Lunar drop,” good luck—traditional keyword-based search can’t handle that.

The solution? Build a **text-to-image retrieval system**.

Here’s the play: use [CLIP](https://openai.com/research/clip?utm_source=chatgpt.com) to embed both text and image data into vectors. Store those vectors in **Milvus**, the open-source vector database purpose-built for similarity search. Then, when a user types a description (“red silk cape with gold trim”), you hit the DB and return the top 3 most semantically similar images.

It’s fast. It’s scalable. And it turns your messy media library into a structured, queryable asset bank.

Here’s how to build it:

Install Dependencies

```
# Install necessary packages
%pip install --upgrade pymilvus pillow matplotlib
%pip install git+https://github.com/openai/CLIP.git
```
Import Necessary Libraries
```
import os
import clip
import torch
from PIL import Image
import matplotlib.pyplot as plt
from pymilvus import MilvusClient
from glob import glob
import math

print("All libraries imported successfully!")
```
Initialize Milvus Client
```
# Initialize Milvus client
milvus_client = MilvusClient(uri="http://localhost:19530",token="root:Miluvs")
print("Milvus client initialized successfully!")
```
Load CLIP Model
```
# Load CLIP model
model_name = "ViT-B/32"
device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load(model_name, device=device)
model.eval()

print(f"CLIP model '{model_name}' loaded successfully, running on device: {device}")
print(f"Model input resolution: {model.visual.input_resolution}")
print(f"Context length: {model.context_length}")
print(f"Vocabulary size: {model.vocab_size}")
```
Output result:
```
CLIP model `ViT-B/32` loaded successfully, running on: cpu
 Model input resolution: 224
 Context length: 77
 Vocabulary size: 49,408
```
Define Feature Extraction Functions
```
def encode_image(image_path):
    """Encode image into normalized feature vector"""
    try:
        image = preprocess(Image.open(image_path)).unsqueeze(0).to(device)
        
        with torch.no_grad():
            image_features = model.encode_image(image)
            image_features /= image_features.norm(dim=-1, keepdim=True)  # Normalize
        
        return image_features.squeeze().cpu().tolist()
    except Exception as e:
        print(f"Error processing image {image_path}: {e}")
        return None
def encode_text(text):
    """Encode text into normalized feature vector"""
    text_tokens = clip.tokenize([text]).to(device)
    
    with torch.no_grad():
        text_features = model.encode_text(text_tokens)
        text_features /= text_features.norm(dim=-1, keepdim=True)  # Normalize
    
    return text_features.squeeze().cpu().tolist()

print("Feature extraction functions defined successfully!")
```
Create Milvus Collection
```
collection_name = "production_image_collection"
# If collection already exists, delete it
if milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)
    print(f"Existing collection deleted: {collection_name}")

# Create new collection
milvus_client.create_collection(
    collection_name=collection_name,
    dimension=512,  # CLIP ViT-B/32 embedding dimension
    auto_id=True,  # Auto-generate ID
    enable_dynamic_field=True,  # Enable dynamic fields
    metric_type="COSINE"  # Use cosine similarity
)

print(f"Collection '{collection_name}' created successfully!")
print(f"Collection info: {milvus_client.describe_collection(collection_name)}")
```
Collection creation success output:

```
Existing collection deleted: production_image_collection
Collection 'production_image_collection' created successfully!
Collection info: {'collection_name': 'production_image_collection', 'auto_id': True, 'num_shards': 1, 'description': '', 'fields': [{'field_id': 100, 'name': 'id', 'description': '', 'type': <DataType.INT64: 5>, 'params': {}, 'auto_id': True, 'is_primary': True}, {'field_id': 101, 'name': 'vector', 'description': '', 'type': <DataType.FLOAT_VECTOR: 101>, 'params': {'dim': 512}}, {'field_id': 102, 'name': 'function': [], 'aliases': [], 'collection_id': 460508990706033544, 'consistency_level': 2, 'properties': {}, 'num_partitions': 1, 'enable_dynamic_field': True, 'created_timestamp': 460511723827494913, 'updated_timestamp': 460511723827494913}
```
Process and Insert Images
```
# Set image directory path
image_dir = "./production_image"
raw_data = []

# Get all supported image formats
image_extensions = ['*.jpg', '*.jpeg', '*.png', '*.JPEG', '*.JPG', '*.PNG']
image_paths = []

for ext in image_extensions:
    image_paths.extend(glob(os.path.join(image_dir, ext)))

print(f"Found {len(image_paths)} images in {image_dir}")

# Process images and generate embeddings
successful_count = 0
for i, image_path in enumerate(image_paths):
    print(f"Processing progress: {i+1}/{len(image_paths)} - {os.path.basename(image_path)}")
    
    image_embedding = encode_image(image_path)
    if image_embedding is not None:
        image_dict = {
            "vector": image_embedding,
            "filepath": image_path,
            "filename": os.path.basename(image_path)
        }
        raw_data.append(image_dict)
        successful_count += 1

print(f"Successfully processed {successful_count} images")
```
Image processing progress output:
```
Found 50 images in ./production_image
Processing progress: 1/50 - download (5).jpeg
Processing progress: 2/50 - images (2).jpeg
Processing progress: 3/50 - download (23).jpeg
Processing progress: 4/50 - download.jpeg
Processing progress: 5/50 - images (14).jpeg
Processing progress: 6/50 - images (16).jpeg
…
Processing progress: 44/50 - download (10).jpeg
Processing progress: 45/50 - images (18).jpeg
Processing progress: 46/50 - download (9).jpeg
Processing progress: 47/50 - download (12).jpeg
Processing progress: 48/50 - images (1).jpeg
Processing progress: 49/50 - download.png
Processing progress: 50/50 - images.png
Successfully processed 50 images
```
Insert Data into Milvus
```
# Insert data into Milvus
if raw_data:
    print("Inserting data into Milvus...")
    insert_result = milvus_client.insert(collection_name=collection_name, data=raw_data)
    
    print(f"Successfully inserted {insert_result['insert_count']} images into Milvus")
    print(f"Sample inserted IDs: {insert_result['ids'][:5]}...")  # Show first 5 IDs
else:
    print("No successfully processed image data to insert")
```

Define Search and Visualization Functions
```
def search_images_by_text(query_text, top_k=3):
    """Search images based on text query"""
    print(f"Search query: '{query_text}'")
    
    # Encode query text
    query_embedding = encode_text(query_text)
    
    # Search in Milvus
    search_results = milvus_client.search(
        collection_name=collection_name,
        data=[query_embedding],
        limit=top_k,
        output_fields=["filepath", "filename"]
    )
    
    return search_results[0]


def visualize_search_results(query_text, results):
    """Visualize search results"""
    num_images = len(results)
    
    if num_images == 0:
        print("No matching images found")
        return
    
    # Create subplots
    fig, axes = plt.subplots(1, num_images, figsize=(5*num_images, 5))
    fig.suptitle(f'Search Results: "{query_text}" (Top {num_images})', fontsize=16, fontweight='bold')
    
    # Handle single image case
    if num_images == 1:
        axes = [axes]
    
    # Display images
    for i, result in enumerate(results):
        try:
            img_path = result['entity']['filepath']
            filename = result['entity']['filename']
            score = result['distance']
            
            # Load and display image
            img = Image.open(img_path)
            axes[i].imshow(img)
            axes[i].set_title(f"{filename}\nSimilarity: {score:.3f}", fontsize=10)
            axes[i].axis('off')
            
            print(f"{i+1}. File: {filename}, Similarity score: {score:.4f}")
            
        except Exception as e:
            axes[i].text(0.5, 0.5, f'Error loading image\n{str(e)}',
                        ha='center', va='center', transform=axes[i].transAxes)
            axes[i].axis('off')
    
    plt.tight_layout()
    plt.show()

print("Search and visualization functions defined successfully!")
```

Execute Text-to-Image Search

```
# Example search 1
query1 = "a golden watch"
results1 = search_images_by_text(query1, top_k=3)
visualize_search_results(query1, results1)
```




Search query execution output:

```
Search query: 'a golden watch'
1. File: images (19).jpeg, Similarity score: 0.2934
2. File: download (26).jpeg, Similarity score: 0.3073
3. File: images (17).jpeg, Similarity score: 0.2717
```


![](https://assets.zilliz.com/watch_067c39ba51.png)

## Using Nano-banana to Create Brand Promotional Images


Now that we have our text-to-image search system working with Milvus, let's integrate Nano-banana to generate new promotional content based on the assets we retrieve.

Install Google SDK
```
%pip install google-generativeai
%pip install requests
print("Google Generative AI SDK installation complete!")
```

Configure Gemini API

```
import google.generativeai as genai
from PIL import Image
from io import BytesIO
genai.configure(api_key="<your_api_key>")
```
Generate New Images


```
prompt = (
    "An European male model wearing a suit, carrying a gold watch."
)

image = Image.open("/path/to/image/watch.jpg")

model = genai.GenerativeModel('gemini-2.5-flash-image-preview')
response = model.generate_content([prompt, image])

for part in response.candidates[0].content.parts:
    if part.text is not None:
        print(part.text)
    elif part.inline_data is not None:
        image = Image.open(BytesIO(part.inline_data.data))
        image.save("generated_image.png")
        image.show()
```

![](https://assets.zilliz.com/suit_976b6f1df2.png)

## What This Means for Your Development Workflow

As a developer, this Milvus + Nano-banana integration fundamentally changes how you can approach content generation projects. Instead of managing static asset libraries or relying on expensive creative teams, you now have a dynamic system that retrieves and generates exactly what your application needs in real-time.

Consider the following recent client scenario: a brand launched several new products but opted to skip the traditional photo shoot pipeline entirely. Using our integrated system, they could instantly generate promotional imagery by combining their existing product database with Nano-banana's generation capabilities.


*Prompt: A model is wearing these products on the beach*

![](https://assets.zilliz.com/model_5a2a042b46.png)

The real power becomes apparent when you need to create complex, multi-variant content that would traditionally require extensive coordination between photographers, models, and set designers. With Milvus handling the asset retrieval and Nano-banana managing the generation, you can programmatically create sophisticated scenes that adapt to your specific requirements:



*Prompt: A model is posing and leaning against a blue convertible sports car. She is wearing a halter top dress and the accompanying accessories. She is adorned with a diamond necklace and a blue watch, wearing high heels on her feet and holding a labubu pendant in her hand.*

![](https://assets.zilliz.com/shoes_98e1e4c70b.png)

For developers working in gaming or collectibles, this system opens up entirely new possibilities for rapid prototyping and concept validation. Instead of investing weeks in 3D modeling before knowing if a concept works, you can now generate photorealistic product visualizations that include packaging, environmental context, and even manufacturing processes:

*Prompt: Use the nano-banana model to create a 1/7 scale commercialized figure of the character in the illustration, in a realistic style and environment. Place the figure on a computer desk, using a circular transparent acrylic base without any text. On the computer screen, display the ZBrush modeling process of the figure. Next to the computer screen, place a BANDAI-style toy packaging box printed with the original artwork.*

![](https://assets.zilliz.com/milvus_3d_5189d53773.png)

## Conclusion

From a technical perspective, Nano Banana is more than a novelty—it’s production-ready in ways that matter to developers. Its biggest strength is consistency and controllability, which means fewer edge cases bleeding into your application logic. Just as importantly, it handles the subtle details that often derail automated pipelines: keeping brand colors consistent, generating physically plausible lighting and reflections, and ensuring visual coherence across multiple output formats.

The real magic happens when you combine it with the Milvus vector database. A vector database doesn’t just store embeddings—it becomes an intelligent asset manager that can surface the most relevant historical content to guide new generations. The result: faster generation times (because the model has better context), higher consistency across your application, and the ability to enforce brand or style guidelines automatically. 

In short, Milvus transforms Nano Banana from a creative toy into a scalable enterprise system.

Of course, no system is flawless. Complex, multi-step instructions can still cause hiccups, and lighting physics sometimes stretches reality more than you’d like. The most reliable solution we’ve seen is to supplement text prompts with reference images stored in Milvus, which gives the model richer grounding, more predictable results, and shorter iteration cycles. With this setup, you’re not just experimenting with multimodal RAG—you’re running it in production with confidence.
