---
id: gpt4o-disrupts-everything-one-step-away-from-killing-thousands-of-ai-apps-including-midjourney.md
title: > 
 GPT-4o Disrupts Everything: One Step Away From Killing Thousands of AI Apps Including Midjourney
author: Lumina Wang
date: 2025-04-01
desc: Most products that simply wrap large AI models around public domain data are destined for mass extinction.
cover: assets.zilliz.com/GPT_4opagephoto_5e934b89e5.png
tag: Engineering
tags: GPT-4o, Database, Milvus, Artificial Intelligence, Image Generation
canonicalUrl: https://milvus.io/blog/gpt4o-disrupts-everything-one-step-away-from-killing-thousands-of-ai-apps-including-midjourney.md
---


## Everyone Became an Artist Overnight with GPT-4o

![](https://assets.zilliz.com/four_panel_1788f825e3.png)

_Believe it or not, the picture you just saw was AI-generated—specifically, by the newly released GPT-4o!_

When OpenAI launched **GPT-4o's native image generation** feature on March 26th, no one could have predicted the creative tsunami that followed. Overnight, the internet exploded with AI-generated Ghibli-style portraits—celebrities, politicians, pets, and even users themselves were transformed into charming Studio Ghibli characters with just a few simple prompts.

![](https://assets.zilliz.com/Ghibli_32e739c2ac.png)

Example of GPT-4o generated images (credit X\@Jason Reid)

Then came the Musk vs. Zuckerberg fight photos, Trump and Putin kiss images, AI comics, and countless other visual creations flying across social media globally. The demand was so overwhelming that Sam Altman himself had to "plead" with users to slow down, tweeting that the OpenAI's "GPUs are melting."

![](https://assets.zilliz.com/samaltmannotes_6fa6db2918.png)

Sam Altman’s tweet  (credit X@Sam Altman)


## Why GPT-4o Changes Everything 

For creative industries, this represents a paradigm shift. Tasks that once required an entire design team a whole day can now be completed in mere minutes. What makes GPT-4o different from previous image generators is **its remarkable visual consistency and intuitive interface**. It supports multi-turn conversations that let you refine images by adding elements, adjusting proportions, changing styles, or even transforming 2D into 3D—essentially putting a professional designer in your pocket.

The secret behind GPT-4o's superior performance? It’s autoregressive architecture. Unlike diffusion models (like Stable Diffusion) that degrade images into noise before reconstructing them, GPT-4o generates images sequentially—one token at a time—maintaining contextual awareness throughout the process. This fundamental architectural difference explains why GPT-4o produces more coherent results with more straightforward, more natural prompts.

But here's where things get interesting for developers: **An increasing number of signs point to a major trend—AI models themselves are becoming products. Simply put, most products that simply wrap large AI models around public domain data are destined for mass extinction.**

The true power of these advancements comes from combining general-purpose large models with **private, domain-specific data**. This combination may well be the optimal survival strategy for most companies in the era of large language models. As base models continue to evolve, the lasting competitive advantage will belong to those who can effectively integrate their proprietary datasets with these powerful AI systems.

Let's explore how to connect your private data with GPT-4o using Milvus, an open-source and high-performance vector database.


## How to Connect Your Private Data with GPT-4o Using Milvus 

Vector databases are the key technology bridging your private data with AI models. They work by converting your content—whether images, text, or audio—into mathematical representations (vectors) that capture their meaning and characteristics. This allows for a semantic search based on similarity rather than just keywords.

Milvus, as a leading open-source vector database, is particularly well-suited for connecting with generative AI tools like GPT-4o. Here's how I used it to solve a personal challenge.


### Background

One day, I had this brilliant idea—turn all the mischief of my dog Cola, into a comic strip. But there was a catch: How could I sift through tens of thousands of photos from work, travels, and food adventures to find Cola's mischievous moments?

The answer? Import all my photos into Milvus and do an image search.

Let's walk through the implementation step by step.


#### Dependencies and Environment

First, you need to get your environment ready with the right packages:

```
pip install pymilvus --upgrade
pip install torch numpy scikit-learn pillow
```



#### Prepare the Data

I'll use my photo library, which has about 30,000 photos, as the dataset in this guide. If you don't have any dataset at hand, download a sample dataset from Milvus and unzip it:

```
!wget https://github.com/milvus-io/pymilvus-assets/releases/download/imagedata/reverse_image_search.zip
!unzip -q -o reverse_image_search.zip
```



#### Define the Feature Extractor

We'll use the ResNet-50 mode from the `timm` library to extract embedding vectors from our images. This model has been trained on millions of images and can extract meaningful features that represent the visual content.

```
    import torch
    from PIL import Image
    import timm
    from sklearn.preprocessing import normalize
    from timm.data import resolve_data_config
    from timm.data.transforms_factory import create_transform
    class FeatureExtractor:
        def __init__(self, modelname):
            # Load the pre-trained model
            self.model = timm.create_model(
                modelname, pretrained=True, num_classes=0, global_pool="avg"
            )
            self.model.eval()
            # Get the input size required by the model
            self.input_size = self.model.default_cfg["input_size"]
            config = resolve_data_config({}, model=modelname)
            # Get the preprocessing function provided by TIMM for the model
            self.preprocess = create_transform(**config)
        def __call__(self, imagepath):
            # Preprocess the input image
            input_image = Image.open(imagepath).convert("RGB")  # Convert to RGB if needed
            input_image = self.preprocess(input_image)
            # Convert the image to a PyTorch tensor and add a batch dimension
            input_tensor = input_image.unsqueeze(0)
            # Perform inference
            with torch.no_grad():
                output = self.model(input_tensor)
            # Extract the feature vector
            feature_vector = output.squeeze().numpy()
            return normalize(feature_vector.reshape(1, -1), norm="l2").flatten()
```


#### Create a Milvus Collection

Next, we'll create a Milvus collection to store our image embeddings. Think of this as a specialized database explicitly designed for vector similarity search:

```
    from pymilvus import MilvusClient
    client = MilvusClient(uri="example.db")
    if client.has_collection(collection_name="image_embeddings"):
        client.drop_collection(collection_name="image_embeddings")

    client.create_collection(
        collection_name="image_embeddings",
        vector_field_name="vector",
        dimension=2048,
        auto_id=True,
        enable_dynamic_field=True,
        metric_type="COSINE",
    )
```

**Notes on MilvusClient Parameters:**

- **Local Setup:** Using a local file (e.g., `./milvus.db`) is the easiest way to get started—Milvus Lite will handle all your data.

- **Scale Up:** For large datasets, set up a robust Milvus server using Docker or Kubernetes and use its URI (e.g., `http://localhost:19530`).

- **Cloud Option:** If you’re into Zilliz Cloud (the fully managed service of Milvus), adjust your URI and token to match the public endpoint and API key.


#### Insert Image Embeddings into Milvus

Now comes the process of analyzing each image and storing its vector representation. This step might take some time depending on your dataset size, but it's a one-time process:

```
    import os
    from some_module import FeatureExtractor  # Replace with your feature extraction module
    extractor = FeatureExtractor("resnet50")
    root = "./train"  # Path to your dataset
    insert = True
    if insert:
        for dirpath, _, filenames in os.walk(root):
            for filename in filenames:
                if filename.endswith(".jpeg"):
                    filepath = os.path.join(dirpath, filename)
                    image_embedding = extractor(filepath)
                    client.insert(
                        "image_embeddings",
                        {"vector": image_embedding, "filename": filepath},
                    )
```


#### Conduct an Image Search

With our database populated, we can now search for similar images. This is where the magic happens—we can find visually similar photos using vector similarity:

```
    from IPython.display import display
    from PIL import Image
    query_image = "./search-image.jpeg"  # The image you want to search with
    results = client.search(
        "image_embeddings",
        data=[extractor(query_image)],
        output_fields=["filename"],
        search_params={"metric_type": "COSINE"},
        limit=6,  # Top-k results
    )
    images = []
    for result in results:
        for hit in result[:10]:
            filename = hit["entity"]["filename"]
            img = Image.open(filename)
            img = img.resize((150, 150))
            images.append(img)
    width = 150 * 3
    height = 150 * 2
    concatenated_image = Image.new("RGB", (width, height))
    for idx, img in enumerate(images):
        x = idx % 5
        y = idx // 5
        concatenated_image.paste(img, (x * 150, y * 150))

    display("query")
    display(Image.open(query_image).resize((150, 150)))
    display("results")
    display(concatenated_image)
```

**The returned images are shown as below:** 

![](https://assets.zilliz.com/640_1_8d4e88c6dd.png)


### Combine Vector Search with GPT-4o: Generating Ghibli-Style Images with Images Returned by Milvus 

Now comes the exciting part: using our image search results as input for GPT-4o to generate creative content. In my case, I wanted to create comic strips featuring my dog Cola based on photos I've taken.

The workflow is simple but powerful:

1. Use vector search to find relevant images of Cola from my collection

2. Feed these images to GPT-4o with creative prompts

3. Generate unique comics based on visual inspiration

Here are some examples of what this combination can produce:

**The prompts I use:** 

- _"Generate a four-panel, full-color, hilarious comic strip featuring a Border Collie caught gnawing on a mouse—with an awkward moment when the owner finds out."\
  _![](https://assets.zilliz.com/Screenshot_2025_04_02_at_11_34_43_1d7141eef3.png)__

- _"Draw a comic where this dog rocks a cute outfit."\
  _![](https://assets.zilliz.com/cutedog_6fdb1e9c79.png)__

- _"Using this dog as the model, create a comic strip of it attending Hogwarts School of Witchcraft and Wizardry."\
  _![](https://assets.zilliz.com/Screenshot_2025_04_02_at_11_44_00_ce932cd035.png)__


### A Few Quick Tips from My Experience of Image Generation:

1. **Keep it simple**: Unlike those finicky diffusion models, GPT-4o works best with straightforward prompts. I found myself writing shorter and shorter prompts as I went along, and getting better results.

2. **English works best**: I tried prompting in Chinese for some comics, but the results weren't great. I ended up writing my prompts in English and then translating the finished comics when needed.

3. **Not good for Video Generation**: Don’t get your hopes too high with Sora yet—AI-generated videos still have a way to go when it comes to fluid movement and coherent storylines.


## What's Next? The AI Product Revolution

With AI-generated images leading the charge, a quick look at OpenAI's major releases over the past six months shows a clear pattern: whether it's GPTs for app marketplaces, DeepResearch for report generation, GPT-4o for conversational image creation, or Sora for video magic - large AI models are stepping from behind the curtain into the spotlight. What was once experimental tech is now maturing into real, usable products.

As GPT-4o and similar models become widely accepted, most workflows and intelligent agents based on Stable Diffusion are heading toward obsolescence. However, the irreplaceable value of private data and human insight remains strong. For example, while AI won't completely replace creative agencies, integrating a Milvus vector database with GPT models enables agencies to quickly generate fresh, creative ideas inspired by their past successes. E-commerce platforms can design personalized clothing based on shopping trends, and academic institutions can instantly create visuals for research papers.

The era of products powered by AI models is here, and the race to mine the data goldmine is just getting started. For developers and businesses alike, the message is clear: combine your unique data with these powerful models or risk being left behind.
