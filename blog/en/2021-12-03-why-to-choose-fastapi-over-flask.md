---
id: 2021-12-03-why-to-choose-fastapi-over-flask.md
title: Accelerating Candidate Generation in Recommender Systems Using Milvus paired with PaddlePaddle
author: Yunmei
date: 2021-11-26
desc: the minimal workflow of a recommender system
cover: assets.zilliz.com/1_d5de035def.png
tag: Technology
---

To help you quickly get started with Milvus, the open-source vector database, we released another affiliated open-source project, [Milvus Bootcamp](https://github.com/milvus-io/bootcamp) on GitHub. The Milvus Bootcamp not only provides scripts and data for benchmark tests, but also includes projects that use Milvus to build some MVPs (minimum viable products), such as a reverse image search system, a video analysis system, a QA chatbot, or a recommender system. You can learn how to apply vector similarity search in a world full of unstructured data and get some hands-on experience in Milvus Bootcamp.

![2.png](https://assets.zilliz.com/2_5b60157b4d.png)

We provide both front-end and back-end services for the projects in Milvus Bootcamp. However, we have recently made the decision to change the adopted web framework from Flask to FastAPI.

This article aims to explain our motivation behind such a change in the adopted web framework for Milvus Bootcamp by clarifying why we chose FastAPI over Flask.

## Web frameworks for Python

A web framework refers to a collection of packages or modules. It is a set of software architecture for web development that allows you to write web applications or services and saves you the trouble of handling low-level details such as protocols, sockets, or process/thread management. Using web framework can significantly reduce the workload of developing web applications as you can simply "plug in" your code into the framework, with no extra attention needed when dealing with data caching, database access, and data security verification. For more information about what a web framework for Python is, see [Web Frameworks](https://wiki.python.org/moin/WebFrameworks).  

There are various types of Python web frameworks. The mainstream ones include Django, Flask, Tornado, and FastAPI.

### Flask

![3.png](https://assets.zilliz.com/3_1abd170939.png)

[Flask](https://flask.palletsprojects.com/en/2.0.x/) is a lightweight microframework designed for Python, with a simple and easy-to-use core that allows you to develop your own web applications. In addition, the Flask core is also extensible. Therefore, Flask supports on-demand extension of different functions to meet your personalized needs during web application development. This is to say, with a library of various plug-ins in Flask, you can develop powerful websites.

Flask has the following characteristics:

1. Flask is a microframework that does not rely on other specific tools or components of third-party libraries to provide shared functionalities. Flask does not have a database abstraction layer, and does not require form validation. However, Flask is highly extensible and supports adding application functionality in a way similar to implementations within Flask itself. Relevant extensions include object-relational mappers, form validation, upload processing, open authentication technologies, and some common tools designed for web frameworks.
2. Flask is a web application framework based on [WSGI](https://wsgi.readthedocs.io/) (Web Server Gateway Interface). WSGI is a simple interface connecting a web server with a web application or framework defined for the Python language.
3. Flask includes two core function libraries, [Werkzeug](https://www.palletsprojects.com/p/werkzeug) and [Jinja2](https://www.palletsprojects.com/p/jinja). Werkzeug is a WSGI toolkit that implements request, response objects and practical functions, which allows you to build web frameworks on top of it. Jinja2 is a popular full-featured templating engine for Python. It has full support for Unicode, with an optional but widely-adopted integrated sandbox execution environment.

### FastAPI

![4.png](https://assets.zilliz.com/4_05cb0dac4e.png)

[FastAPI](https://fastapi.tiangolo.com/) is a modern Python web application framework that has the same level of high performance as Go and NodeJS. The core of FastAPI is based on [Starlette](https://www.starlette.io/) and [Pydantic](https://pydantic-docs.helpmanual.io/). Starlette is a lightweight [ASGI](https://asgi.readthedocs.io/)(Asynchronous Server Gateway Interface) framework toolkit for building high-performance [Asyncio](https://docs.python.org/3/library/asyncio.html) services. Pydantic is a library that defines data validation, serialization, and documentation based on Python type hints.

FastAPI has the following characteristics:

1. FastAPI is a web application framework based on ASGI, an asynchronous gateway protocol interface connecting network protocol services and Python applications. FastAPI can handle a variety of common protocol types, including HTTP, HTTP2, and WebSocket.
2. FastAPI is based on Pydantic, which provides the function of checking the interface data type. You do not need to additionally verify your interface parameter, or write extra code to verify whether the parameters are empty or whether the data type is correct. Using FastAPI can effectively avoid human errors in code and improve development efficiency.
3. FastAPI supports document in two formats - [OpenAPI](https://swagger.io/specification/) (formerly Swagger) and [Redoc](https://www.redoc.com/). Therefore, as a user you do not need to spend extra time writing additional interface documents. The OpenAPI document provided by FastAPI is shown in the screenshot below.

![5.png](https://assets.zilliz.com/5_d91d34cb0f.png)

### Flask Vs. FastAPI

The table below demonstrates the differences between Flask and FastAPI in several aspects.

|                            | **FastAPI**    | **Flask**     |
| -------------------------- | -------------- | ------------- |
| **Interface gateway**      | ASGI           | WSGI          |
| **Asynchronous framework** | ✅              | ❌             |
| **Performance**            | Faster         | Slower        |
| **Interactive doc**        | OpenAPI, Redoc | None          |
| **Data verification**      | ✅              | ❌             |
| **Development costs**      | Lower          | Higher        |
| **Ease of use**            | Lower          | Higher        |
| **Flexibility**            | Less flexible  | More flexible |
| **Community**              | Smaller        | More active   |

## Why FastAPI?

Before deciding which Python web application framework to choose for the projects in Milvus Bootcamp, we researched into several mainstream frameworks including Django, Flask, FastAPI, Tornado, and more. Since the projects in Milvus Bootcamp serve as references for you, our priority is to adopt an external framework of utmost lightweightness and dexterity. According to this rule, we narrowed down our choices to Flask and FastAPI.

You can see the comparison between the two web frameworks in the previous section. The following is a detailed explanation of our motivation to choose FastAPI over Flask for the projects in Milvus Bootcamp. There are several reasons:

### 1. Performance

Most of the projects in Milvus Bootcamp are built around reverse image search systems, QA chatbots, text search engines, which all have high demands for real-time data processing. Accordingly, we need a framework with outstanding performance, which is exactly a highlight of FastAPI. Therefore, from the perspective of system performance, we decided to choose FastAPI.

### 2. Efficiency

When using Flask, you need to write code for data type verification in each of the interfaces so that the system can determine whether the input data is empty or not. However, by supporting automatic data type verification, FastAPI helps avoid human errors in coding during system development and can greatly boost development efficiency. Bootcamp is positioned as a type of training resource. This means that the code and components we use must be intuitive and highly efficient. In this regard, we chose FastAPI to improve system efficiency and enhance user experience.

### 3. Asynchronous framework

FastAPI is inherently an asynchronous framework. Originally, we released four [demos](https://zilliz.com/milvus-demos?isZilliz=true), reverse image search, video analysis, QA chatbot, and molecular similarity search. In these demos, you can upload datasets and will be immediately prompted "request received". And when the data is uploaded to the demo system, you will receive another prompt "data upload successful". This is an asynchronous process which requires a framework that supports this feature. FastAPI is itself an asynchronous framework. To align all Milvus resources, we decided to adopt a single set of development tools and software for both Milvus Bootcamp and Milvus demos. As a result, we changed the framework from Flask to FastAPI.

### 4. Automatic interactive documents

In a traditional way, when you finish writing the code for the server-side, you need to write an extra document to create an interface, and then use tools like [Postman](https://www.postman.com/) for API testing and debugging. So what if you only want to quickly get started with the web server-side development part of the projects in Milvus Bootcamp without writing additional code to create an interface? FastAPI is the fix. By providing an OpenAPI document, FastAPI can save you the trouble of testing or debugging APIs and collaborating with front-end teams to develop a user interface. With FastAPI, you can still quickly try the built application with an automatic but intuitive interface without extra efforts for coding.

### 5. User-friendliness

FastAPI is easier to use and develop, therefore enabling you to pay more attention to the specific implementation of the project itself. Without spending too much time on developing web frameworks, you can focus more on understanding the projects in Milvus Bootcamp.

## Recap

Flask and FlastAPI have their own pros and cons. As an emerging web application framework, FlastAPI, at its core, is built on mature toolkits and library, Starlette and Pydantic. FastAPI is an asynchronous framework with high performance. Its dexterity, extensibility, and support for automatic data type verification, together with many other powerful features, prompted us to adopt FastAPI as the framework for Milvus Bootcamp projects.

Please note that you should choose the appropriate framework according to your application scenario if you want to build a vector similarity search system in production.

## About the author

Yunmei Li, Zilliz Data Engineer, graduated from Huazhong University of Science and Technology with a degree in computer science. Since joining Zilliz, she has been working on exploring solutions for the open source project Milvus and helping users to apply Milvus in real-world scenarios. Her main focus is on NLP and recommendation systems, and she would like to further deepen her focus in these two areas. She likes to spend time alone and read.

## Looking for more resources?

- Start to build AI system with Milvus and get more hands-on experience by reading our tutorials!
  - [What Is It? Who Is She? Milvus Helps Analyze Videos Intelligently](https://milvus.io/blog/2021-10-10-milvus-helps-analys-vedios.md?page=1#all)
  - [Combine AI Models for Image Search using ONNX and Milvus](https://milvus.io/blog/2021-09-26-onnx.md?page=1#all)
  - [DNA Sequence Classification based on Milvus](https://milvus.io/blog/dna-sequence-classification-based-on-milvus.md?page=2#all)
  - [Audio Retrieval Based on Milvus](https://milvus.io/blog/audio-retrieval-based-on-milvus.md?page=2#all)
  - [4 Steps to Building a Video Search System](https://milvus.io/blog/building-video-search-system-with-milvus.md?page=6#all)
  - [Building an Intelligent QA System with NLP and Milvus](https://milvus.io/blog/building-intelligent-chatbot-with-nlp-and-milvus.md?page=6#all)
  - [Accelerating New Drug Discovery](https://milvus.io/blog/molecular-structure-similarity-with-milvus.md?page=7#all)

- Engage with our open-source community:
  - Find or contribute to Milvus on [GitHub](https://bit.ly/307b7jC).
  - Interact with the community via [Forum](https://bit.ly/3qiyTEk).
  - Connect with us on [Twitter](https://bit.ly/3ob7kd8).
