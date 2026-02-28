---
id: 2021-12-03-why-to-choose-fastapi-over-flask.md
title: Why to Choose FastAPI over Flask?
author: Yunmei
date: 2021-12-03T00:00:00.000Z
desc: choose the appropriate framework according to your application scenario
cover: assets.zilliz.com/1_d5de035def.png
tag: Engineering
isPublish: false
---
<p>To help you quickly get started with Milvus, the open-source vector database, we released another affiliated open-source project, <a href="https://github.com/milvus-io/bootcamp">Milvus Bootcamp</a> on GitHub. The Milvus Bootcamp not only provides scripts and data for benchmark tests, but also includes projects that use Milvus to build some MVPs (minimum viable products), such as a reverse image search system, a video analysis system, a QA chatbot, or a recommender system. You can learn how to apply vector similarity search in a world full of unstructured data and get some hands-on experience in Milvus Bootcamp.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_5b60157b4d.png" alt="2.png" class="doc-image" id="2.png" />
    <span>2.png</span>
  </span>
</p>
<p>We provide both front-end and back-end services for the projects in Milvus Bootcamp. However, we have recently made the decision to change the adopted web framework from Flask to FastAPI.</p>
<p>This article aims to explain our motivation behind such a change in the adopted web framework for Milvus Bootcamp by clarifying why we chose FastAPI over Flask.</p>
<h2 id="Web-frameworks-for-Python" class="common-anchor-header">Web frameworks for Python<button data-href="#Web-frameworks-for-Python" class="anchor-icon" translate="no">
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
    </button></h2><p>A web framework refers to a collection of packages or modules. It is a set of software architecture for web development that allows you to write web applications or services and saves you the trouble of handling low-level details such as protocols, sockets, or process/thread management. Using web framework can significantly reduce the workload of developing web applications as you can simply “plug in” your code into the framework, with no extra attention needed when dealing with data caching, database access, and data security verification. For more information about what a web framework for Python is, see <a href="https://wiki.python.org/moin/WebFrameworks">Web Frameworks</a>.</p>
<p>There are various types of Python web frameworks. The mainstream ones include Django, Flask, Tornado, and FastAPI.</p>
<h3 id="Flask" class="common-anchor-header">Flask</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_1abd170939.png" alt="3.png" class="doc-image" id="3.png" />
    <span>3.png</span>
  </span>
</p>
<p><a href="https://flask.palletsprojects.com/en/2.0.x/">Flask</a> is a lightweight microframework designed for Python, with a simple and easy-to-use core that allows you to develop your own web applications. In addition, the Flask core is also extensible. Therefore, Flask supports on-demand extension of different functions to meet your personalized needs during web application development. This is to say, with a library of various plug-ins in Flask, you can develop powerful websites.</p>
<p>Flask has the following characteristics:</p>
<ol>
<li>Flask is a microframework that does not rely on other specific tools or components of third-party libraries to provide shared functionalities. Flask does not have a database abstraction layer, and does not require form validation. However, Flask is highly extensible and supports adding application functionality in a way similar to implementations within Flask itself. Relevant extensions include object-relational mappers, form validation, upload processing, open authentication technologies, and some common tools designed for web frameworks.</li>
<li>Flask is a web application framework based on <a href="https://wsgi.readthedocs.io/">WSGI</a> (Web Server Gateway Interface). WSGI is a simple interface connecting a web server with a web application or framework defined for the Python language.</li>
<li>Flask includes two core function libraries, <a href="https://www.palletsprojects.com/p/werkzeug">Werkzeug</a> and <a href="https://www.palletsprojects.com/p/jinja">Jinja2</a>. Werkzeug is a WSGI toolkit that implements request, response objects and practical functions, which allows you to build web frameworks on top of it. Jinja2 is a popular full-featured templating engine for Python. It has full support for Unicode, with an optional but widely-adopted integrated sandbox execution environment.</li>
</ol>
<h3 id="FastAPI" class="common-anchor-header">FastAPI</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_05cb0dac4e.png" alt="4.png" class="doc-image" id="4.png" />
    <span>4.png</span>
  </span>
</p>
<p><a href="https://fastapi.tiangolo.com/">FastAPI</a> is a modern Python web application framework that has the same level of high performance as Go and NodeJS. The core of FastAPI is based on <a href="https://www.starlette.io/">Starlette</a> and <a href="https://pydantic-docs.helpmanual.io/">Pydantic</a>. Starlette is a lightweight <a href="https://asgi.readthedocs.io/">ASGI</a>(Asynchronous Server Gateway Interface) framework toolkit for building high-performance <a href="https://docs.python.org/3/library/asyncio.html">Asyncio</a> services. Pydantic is a library that defines data validation, serialization, and documentation based on Python type hints.</p>
<p>FastAPI has the following characteristics:</p>
<ol>
<li>FastAPI is a web application framework based on ASGI, an asynchronous gateway protocol interface connecting network protocol services and Python applications. FastAPI can handle a variety of common protocol types, including HTTP, HTTP2, and WebSocket.</li>
<li>FastAPI is based on Pydantic, which provides the function of checking the interface data type. You do not need to additionally verify your interface parameter, or write extra code to verify whether the parameters are empty or whether the data type is correct. Using FastAPI can effectively avoid human errors in code and improve development efficiency.</li>
<li>FastAPI supports document in two formats - <a href="https://swagger.io/specification/">OpenAPI</a> (formerly Swagger) and <a href="https://www.redoc.com/">Redoc</a>. Therefore, as a user you do not need to spend extra time writing additional interface documents. The OpenAPI document provided by FastAPI is shown in the screenshot below.</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/5_d91d34cb0f.png" alt="5.png" class="doc-image" id="5.png" />
    <span>5.png</span>
  </span>
</p>
<h3 id="Flask-Vs-FastAPI" class="common-anchor-header">Flask Vs. FastAPI</h3><p>The table below demonstrates the differences between Flask and FastAPI in several aspects.</p>
<table>
<thead>
<tr><th></th><th><strong>FastAPI</strong></th><th><strong>Flask</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Interface gateway</strong></td><td>ASGI</td><td>WSGI</td></tr>
<tr><td><strong>Asynchronous framework</strong></td><td>✅</td><td>❌</td></tr>
<tr><td><strong>Performance</strong></td><td>Faster</td><td>Slower</td></tr>
<tr><td><strong>Interactive doc</strong></td><td>OpenAPI, Redoc</td><td>None</td></tr>
<tr><td><strong>Data verification</strong></td><td>✅</td><td>❌</td></tr>
<tr><td><strong>Development costs</strong></td><td>Lower</td><td>Higher</td></tr>
<tr><td><strong>Ease of use</strong></td><td>Lower</td><td>Higher</td></tr>
<tr><td><strong>Flexibility</strong></td><td>Less flexible</td><td>More flexible</td></tr>
<tr><td><strong>Community</strong></td><td>Smaller</td><td>More active</td></tr>
</tbody>
</table>
<h2 id="Why-FastAPI" class="common-anchor-header">Why FastAPI?<button data-href="#Why-FastAPI" class="anchor-icon" translate="no">
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
    </button></h2><p>Before deciding which Python web application framework to choose for the projects in Milvus Bootcamp, we researched into several mainstream frameworks including Django, Flask, FastAPI, Tornado, and more. Since the projects in Milvus Bootcamp serve as references for you, our priority is to adopt an external framework of utmost lightweightness and dexterity. According to this rule, we narrowed down our choices to Flask and FastAPI.</p>
<p>You can see the comparison between the two web frameworks in the previous section. The following is a detailed explanation of our motivation to choose FastAPI over Flask for the projects in Milvus Bootcamp. There are several reasons:</p>
<h3 id="1-Performance" class="common-anchor-header">1. Performance</h3><p>Most of the projects in Milvus Bootcamp are built around reverse image search systems, QA chatbots, text search engines, which all have high demands for real-time data processing. Accordingly, we need a framework with outstanding performance, which is exactly a highlight of FastAPI. Therefore, from the perspective of system performance, we decided to choose FastAPI.</p>
<h3 id="2-Efficiency" class="common-anchor-header">2. Efficiency</h3><p>When using Flask, you need to write code for data type verification in each of the interfaces so that the system can determine whether the input data is empty or not. However, by supporting automatic data type verification, FastAPI helps avoid human errors in coding during system development and can greatly boost development efficiency. Bootcamp is positioned as a type of training resource. This means that the code and components we use must be intuitive and highly efficient. In this regard, we chose FastAPI to improve system efficiency and enhance user experience.</p>
<h3 id="3-Asynchronous-framework" class="common-anchor-header">3. Asynchronous framework</h3><p>FastAPI is inherently an asynchronous framework. Originally, we released four <a href="https://zilliz.com/milvus-demos?isZilliz=true">demos</a>, reverse image search, video analysis, QA chatbot, and molecular similarity search. In these demos, you can upload datasets and will be immediately prompted &quot;request received&quot;. And when the data is uploaded to the demo system, you will receive another prompt &quot;data upload successful&quot;. This is an asynchronous process which requires a framework that supports this feature. FastAPI is itself an asynchronous framework. To align all Milvus resources, we decided to adopt a single set of development tools and software for both Milvus Bootcamp and Milvus demos. As a result, we changed the framework from Flask to FastAPI.</p>
<h3 id="4-Automatic-interactive-documents" class="common-anchor-header">4. Automatic interactive documents</h3><p>In a traditional way, when you finish writing the code for the server-side, you need to write an extra document to create an interface, and then use tools like <a href="https://www.postman.com/">Postman</a> for API testing and debugging. So what if you only want to quickly get started with the web server-side development part of the projects in Milvus Bootcamp without writing additional code to create an interface? FastAPI is the fix. By providing an OpenAPI document, FastAPI can save you the trouble of testing or debugging APIs and collaborating with front-end teams to develop a user interface. With FastAPI, you can still quickly try the built application with an automatic but intuitive interface without extra efforts for coding.</p>
<h3 id="5-User-friendliness" class="common-anchor-header">5. User-friendliness</h3><p>FastAPI is easier to use and develop, therefore enabling you to pay more attention to the specific implementation of the project itself. Without spending too much time on developing web frameworks, you can focus more on understanding the projects in Milvus Bootcamp.</p>
<h2 id="Recap" class="common-anchor-header">Recap<button data-href="#Recap" class="anchor-icon" translate="no">
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
    </button></h2><p>Flask and FlastAPI have their own pros and cons. As an emerging web application framework, FlastAPI, at its core, is built on mature toolkits and library, Starlette and Pydantic. FastAPI is an asynchronous framework with high performance. Its dexterity, extensibility, and support for automatic data type verification, together with many other powerful features, prompted us to adopt FastAPI as the framework for Milvus Bootcamp projects.</p>
<p>Please note that you should choose the appropriate framework according to your application scenario if you want to build a vector similarity search system in production.</p>
<h2 id="About-the-author" class="common-anchor-header">About the author<button data-href="#About-the-author" class="anchor-icon" translate="no">
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
    </button></h2><p>Yunmei Li, Zilliz Data Engineer, graduated from Huazhong University of Science and Technology with a degree in computer science. Since joining Zilliz, she has been working on exploring solutions for the open source project Milvus and helping users to apply Milvus in real-world scenarios. Her main focus is on NLP and recommendation systems, and she would like to further deepen her focus in these two areas. She likes to spend time alone and read.</p>
<h2 id="Looking-for-more-resources" class="common-anchor-header">Looking for more resources?<button data-href="#Looking-for-more-resources" class="anchor-icon" translate="no">
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
<li><p>Start to build AI system with Milvus and get more hands-on experience by reading our tutorials!</p>
<ul>
<li><a href="https://milvus.io/blog/2021-10-10-milvus-helps-analys-vedios.md">What Is It? Who Is She? Milvus Helps Analyze Videos Intelligently</a></li>
<li><a href="https://milvus.io/blog/2021-09-26-onnx.md">Combine AI Models for Image Search using ONNX and Milvus</a></li>
<li><a href="https://milvus.io/blog/dna-sequence-classification-based-on-milvus.md">DNA Sequence Classification based on Milvus</a></li>
<li><a href="https://milvus.io/blog/audio-retrieval-based-on-milvus.md">Audio Retrieval Based on Milvus</a></li>
<li><a href="https://milvus.io/blog/building-video-search-system-with-milvus.md">4 Steps to Building a Video Search System</a></li>
<li><a href="https://milvus.io/blog/building-intelligent-chatbot-with-nlp-and-milvus.md">Building an Intelligent QA System with NLP and Milvus</a></li>
<li><a href="https://milvus.io/blog/molecular-structure-similarity-with-milvus.md">Accelerating New Drug Discovery</a></li>
</ul></li>
<li><p>Engage with our open-source community:</p>
<ul>
<li>Find or contribute to Milvus on <a href="https://bit.ly/307b7jC">GitHub</a>.</li>
<li>Interact with the community via <a href="https://bit.ly/3qiyTEk">Forum</a>.</li>
<li>Connect with us on <a href="https://bit.ly/3ob7kd8">Twitter</a>.</li>
</ul></li>
</ul>
