---
id: 2021-12-03-why-to-choose-fastapi-over-flask.md
title: 为什么选择 FastAPI 而不是 Flask？
author: Yunmei
date: 2021-12-03T00:00:00.000Z
desc: 根据应用场景选择合适的框架
cover: assets.zilliz.com/1_d5de035def.png
tag: Engineering
isPublish: false
---
<p>为了帮助您快速上手开源向量数据库 Milvus，我们在 GitHub 上发布了另一个附属开源项目<a href="https://github.com/milvus-io/bootcamp">Milvus Bootcamp</a>。Milvus Bootcamp 不仅提供用于基准测试的脚本和数据，还包括使用 Milvus 构建一些 MVP（最小可行产品）的项目，例如反向图像搜索系统、视频分析系统、QA 聊天机器人或推荐系统。您可以在 Milvus Bootcamp 中学习如何在充满非结构化数据的世界中应用向量相似性搜索，并获得一些实践经验。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_5b60157b4d.png" alt="2.png" class="doc-image" id="2.png" />
   </span> <span class="img-wrapper"> <span>2.png</span> </span></p>
<p>我们为 Milvus Bootcamp 中的项目提供前端和后端服务。不过，我们最近决定将采用的网络框架从 Flask 改为 FastAPI。</p>
<p>本文旨在解释我们改变 Milvus Bootcamp 所采用的 Web 框架的动机，说明我们为什么选择 FastAPI 而不是 Flask。</p>
<h2 id="Web-frameworks-for-Python" class="common-anchor-header">Python 的网络框架<button data-href="#Web-frameworks-for-Python" class="anchor-icon" translate="no">
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
    </button></h2><p>Web 框架指的是软件包或模块的 Collections。它是一套用于网络开发的软件架构，可以让您编写网络应用程序或服务，并省去了处理协议、套接字或进程/线程管理等底层细节的麻烦。使用网络框架可以大大减少开发网络应用程序的工作量，因为您只需将代码 "插入 "到框架中，而无需额外关注数据缓存、数据库访问和数据安全验证等问题。有关 Python Web 框架的更多信息，请参见<a href="https://wiki.python.org/moin/WebFrameworks">Web 框架</a>。</p>
<p>Python Web 框架有多种类型。主流的有 Django、Flask、Tornado 和 FastAPI。</p>
<h3 id="Flask" class="common-anchor-header">Flask</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_1abd170939.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span></p>
<p><a href="https://flask.palletsprojects.com/en/2.0.x/">Flask</a>是专为 Python 设计的轻量级微型框架，其核心简单易用，可让您开发自己的网络应用程序。此外，Flask 内核还具有可扩展性。因此，Flask 支持按需扩展不同的功能，以满足您在网络应用程序开发过程中的个性化需求。也就是说，通过 Flask 中的各种插件库，您可以开发出功能强大的网站。</p>
<p>Flask 具有以下特点：</p>
<ol>
<li>Flask 是一个微框架，不依赖其他特定工具或第三方库的组件来提供共享功能。Flask 没有数据库抽象层，也不需要表单验证。不过，Flask 具有很强的可扩展性，支持以类似于 Flask 本身实现的方式添加应用程序功能。相关的扩展包括对象关系映射器、表单验证、上传处理、开放验证技术以及一些为网络框架设计的常用工具。</li>
<li>Flask 是一个基于<a href="https://wsgi.readthedocs.io/">WSGI</a>（Web 服务器网关接口）的网络应用程序框架。WSGI 是一个连接网络服务器与网络应用程序或 Python 语言定义的框架的简单接口。</li>
<li>Flask 包括两个核心函数库：<a href="https://www.palletsprojects.com/p/werkzeug">Werkzeug</a>和<a href="https://www.palletsprojects.com/p/jinja">Jinja2</a>。Werkzeug 是一个 WSGI 工具包，它实现了请求、响应对象和实用功能，让您可以在其基础上构建网络框架。Jinja2 是一个流行的 Python 全功能模板引擎。它完全支持 Unicode，具有一个可选但被广泛采用的集成沙箱执行环境。</li>
</ol>
<h3 id="FastAPI" class="common-anchor-header">FastAPI</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_05cb0dac4e.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<p><a href="https://fastapi.tiangolo.com/">FastAPI</a>是一个现代 Python 网络应用程序框架，具有与 Go 和 NodeJS 相同的高性能。FastAPI 的核心基于<a href="https://www.starlette.io/">Starlette</a>和<a href="https://pydantic-docs.helpmanual.io/">Pydantic</a>。Starlette 是一个轻量级<a href="https://asgi.readthedocs.io/">ASGI</a>（异步服务器网关接口）框架工具包，用于构建高性能的<a href="https://docs.python.org/3/library/asyncio.html">Asyncio</a>服务。Pydantic 是一个基于 Python 类型提示定义数据验证、序列化和文档的库。</p>
<p>FastAPI 具有以下特点：</p>
<ol>
<li>FastAPI 是一个基于 ASGI 的网络应用框架，ASGI 是连接网络协议服务和 Python 应用程序的异步网关协议接口。FastAPI 可以处理各种常见的协议类型，包括 HTTP、HTTP2 和 WebSocket。</li>
<li>FastAPI 基于 Pydantic，后者提供了检查接口数据类型的功能。您无需额外验证接口参数，也无需编写额外的代码来验证参数是否为空或数据类型是否正确。使用 FastAPI 可以有效避免代码中的人为错误，提高开发效率。</li>
<li>FastAPI 支持<a href="https://swagger.io/specification/">OpenAPI</a>（以前的 Swagger）和<a href="https://www.redoc.com/">Redoc</a> 两种格式的文档。因此，作为用户，您无需花费额外时间编写额外的接口文档。FastAPI 提供的 OpenAPI 文档如下截图所示。</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_d91d34cb0f.png" alt="5.png" class="doc-image" id="5.png" />
   </span> <span class="img-wrapper"> <span>5.png</span> </span></p>
<h3 id="Flask-Vs-FastAPI" class="common-anchor-header">Flask 与 FastAPI</h3><p>下表展示了 Flask 和 FastAPI 在多个方面的不同之处。</p>
<table>
<thead>
<tr><th></th><th><strong>FastAPI</strong></th><th><strong>Flask</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>接口网关</strong></td><td>ASGI</td><td>WSGI</td></tr>
<tr><td><strong>异步框架</strong></td><td>✅</td><td>❌</td></tr>
<tr><td><strong>性能</strong></td><td>更快</td><td>较慢</td></tr>
<tr><td><strong>交互式文档</strong></td><td>OpenAPI、Redoc</td><td>无</td></tr>
<tr><td><strong>数据验证</strong></td><td>✅</td><td>❌</td></tr>
<tr><td><strong>开发成本</strong></td><td>较低</td><td>较高</td></tr>
<tr><td><strong>易用性</strong></td><td>较低</td><td>较高</td></tr>
<tr><td><strong>灵活性</strong></td><td>灵活性较低</td><td>更灵活</td></tr>
<tr><td><strong>社区</strong></td><td>较小</td><td>更活跃</td></tr>
</tbody>
</table>
<h2 id="Why-FastAPI" class="common-anchor-header">为什么选择FastAPI？<button data-href="#Why-FastAPI" class="anchor-icon" translate="no">
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
    </button></h2><p>在决定为 Milvus Bootcamp 中的项目选择哪个 Python 网络应用框架之前，我们研究了几个主流框架，包括 Django、Flask、FastAPI、Tornado 等等。由于 Milvus Bootcamp 中的项目可以为您提供参考，因此我们优先考虑采用最轻量级、最灵巧的外部框架。根据这一原则，我们将选择范围缩小到 Flask 和 FastAPI。</p>
<p>您可以在上一节中看到这两种网络框架的比较。下面将详细解释我们在 Milvus Bootcamp 的项目中选择 FastAPI 而不是 Flask 的动机。原因有以下几点：</p>
<h3 id="1-Performance" class="common-anchor-header">1.性能</h3><p>Milvus Bootcamp 中的大多数项目都是围绕反向图片搜索系统、QA 聊天机器人、文本搜索引擎构建的，这些项目都对实时数据处理有很高的要求。因此，我们需要一个性能卓越的框架，而这正是 FastAPI 的一大亮点。因此，从系统性能的角度出发，我们决定选择FastAPI。</p>
<h3 id="2-Efficiency" class="common-anchor-header">2.高效性</h3><p>使用 Flask 时，需要在每个接口中编写数据类型验证代码，以便系统判断输入数据是否为空。然而，FastAPI 通过支持自动数据类型验证，可以避免系统开发过程中的人为编码错误，大大提高开发效率。Bootcamp 的定位是一种培训资源。这意味着我们使用的代码和组件必须直观、高效。为此，我们选择了 FastAPI 来提高系统效率，增强用户体验。</p>
<h3 id="3-Asynchronous-framework" class="common-anchor-header">3.异步框架</h3><p>FastAPI 本身就是一个异步框架。最初，我们发布了反向图像搜索、视频分析、QA 聊天机器人和分子相似性搜索四个<a href="https://zilliz.com/milvus-demos?isZilliz=true">演示</a>。在这些演示中，您可以上传数据集，系统会立即提示 &quot;收到请求&quot;。数据上传到演示系统后，您会收到另一个提示 &quot;数据上传成功&quot;。这是一个异步过程，需要一个支持该功能的框架。FastAPI 本身就是一个异步框架。为了统一 Milvus 的所有资源，我们决定在 Milvus Bootcamp 和 Milvus 演示版中采用同一套开发工具和软件。因此，我们将框架从 Flask 改为 FastAPI。</p>
<h3 id="4-Automatic-interactive-documents" class="common-anchor-header">4.自动交互文档</h3><p>按照传统方式，当你写完服务器端的代码时，你需要额外编写一个文档来创建一个界面，然后使用<a href="https://www.postman.com/">Postman</a>等工具进行 API 测试和调试。那么，如果你只想快速入门 Milvus Bootcamp 中项目的网络服务器端开发部分，而不需要编写额外的代码来创建接口，该怎么办呢？FastAPI 可以解决这个问题。通过提供 OpenAPI 文档，FastAPI 可以为您省去测试或调试 API 以及与前端团队合作开发用户界面的麻烦。有了 FastAPI，您仍然可以快速试用已构建的应用程序，其界面自动而直观，无需额外的编码工作。</p>
<h3 id="5-User-friendliness" class="common-anchor-header">5.用户友好性</h3><p>FastAPI 更易于使用和开发，因此您可以更加关注项目本身的具体实施。无需在开发网络框架上花费太多时间，您可以将更多精力放在了解 Milvus Bootcamp 中的项目上。</p>
<h2 id="Recap" class="common-anchor-header">总结<button data-href="#Recap" class="anchor-icon" translate="no">
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
    </button></h2><p>Flask 和 FlastAPI 各有利弊。作为一个新兴的 Web 应用程序框架，FlastAPI 的核心是建立在 Starlette 和 Pydantic 这两个成熟的工具包和库之上。FastAPI 是一个具有高性能的异步框架。它的灵巧性、可扩展性和对自动数据类型验证的支持，以及其他许多强大的功能，促使我们采用 FastAPI 作为 Milvus Bootcamp 项目的框架。</p>
<p>请注意，如果您想在生产中构建向量相似性搜索系统，应根据自己的应用场景选择合适的框架。</p>
<h2 id="About-the-author" class="common-anchor-header">关于作者<button data-href="#About-the-author" class="anchor-icon" translate="no">
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
    </button></h2><p>李云梅，Zilliz数据工程师，毕业于华中科技大学计算机科学专业。加入Zilliz后，她一直致力于为开源项目Milvus探索解决方案，并帮助用户将Milvus应用于实际场景。她的主要研究方向是 NLP 和推荐系统，并希望在这两个领域进一步加深研究。她喜欢独处和阅读。</p>
<h2 id="Looking-for-more-resources" class="common-anchor-header">寻找更多资源？<button data-href="#Looking-for-more-resources" class="anchor-icon" translate="no">
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
<li><p>开始使用 Milvus 构建人工智能系统，并通过阅读我们的教程获得更多实践经验！</p>
<ul>
<li><a href="https://milvus.io/blog/2021-10-10-milvus-helps-analys-vedios.md">它是什么？她是谁？Milvus 帮助智能分析视频</a></li>
<li><a href="https://milvus.io/blog/2021-09-26-onnx.md">使用 ONNX 和 Milvus 结合人工智能模型进行图像搜索</a></li>
<li><a href="https://milvus.io/blog/dna-sequence-classification-based-on-milvus.md">基于 Milvus 的 DNA 序列分类</a></li>
<li><a href="https://milvus.io/blog/audio-retrieval-based-on-milvus.md">基于 Milvus 的音频检索</a></li>
<li><a href="https://milvus.io/blog/building-video-search-system-with-milvus.md">构建视频搜索系统的 4 个步骤</a></li>
<li><a href="https://milvus.io/blog/building-intelligent-chatbot-with-nlp-and-milvus.md">利用 NLP 和 Milvus 构建智能 QA 系统</a></li>
<li><a href="https://milvus.io/blog/molecular-structure-similarity-with-milvus.md">加速新药发现</a></li>
</ul></li>
<li><p>参与我们的开源社区：</p>
<ul>
<li>在<a href="https://bit.ly/307b7jC">GitHub</a> 上查找 Milvus 或为其做出贡献。</li>
<li>通过<a href="https://bit.ly/3qiyTEk">论坛</a>与社区互动。</li>
<li>在<a href="https://bit.ly/3ob7kd8">Twitter</a> 上与我们联系。</li>
</ul></li>
</ul>
