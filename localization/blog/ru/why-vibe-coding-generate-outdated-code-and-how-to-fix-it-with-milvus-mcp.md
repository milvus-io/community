---
id: why-vibe-coding-generate-outdated-code-and-how-to-fix-it-with-milvus-mcp.md
title: >-
  Почему ваш Vibe Coding генерирует устаревший код и как это исправить с помощью
  Milvus MCP
author: Cheney Zhang
date: 2025-06-13T00:00:00.000Z
cover: assets.zilliz.com/milvus_mcp_b1dab2a00c.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, mcp, AI Agents, LLM'
meta_keywords: 'Vibe coding, mcp, Milvus, model context protocol'
meta_title: |
  Why Your Vibe Coding Generates Outdated Code and How to Fix It with Milvus MCP
desc: >-
  Проблема галлюцинаций в Vibe Coding - убийца производительности. Milvus MCP
  показывает, как специализированные MCP-серверы могут решить эту проблему,
  предоставляя доступ к текущей документации в режиме реального времени.
origin: >-
  https://milvus.io/blog/why-vibe-coding-generate-outdated-code-and-how-to-fix-it-with-milvus-mcp.md
---
<h2 id="The-One-Thing-Breaking-Your-Vibe-Coding-Flow" class="common-anchor-header">Единственная вещь, которая нарушает ваш поток Vibe Coding<button data-href="#The-One-Thing-Breaking-Your-Vibe-Coding-Flow" class="anchor-icon" translate="no">
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
    </button></h2><p>Vibe-кодирование переживает свой момент. Такие инструменты, как Cursor и Windsurf, пересматривают способы написания программ, делая разработку легкой и интуитивно понятной. Задайте функцию и получите сниппет. Нужен быстрый вызов API? Он будет сгенерирован еще до того, как вы закончите вводить текст.</p>
<p><strong>Однако есть одна загвоздка, которая портит настроение: ИИ-помощники часто генерируют устаревший код, который ломается в процессе работы.</strong> Это происходит потому, что LLM, на которых работают эти инструменты, часто опираются на устаревшие обучающие данные. Даже самый искусный ИИ-помощник может предложить код, который отстает от жизни на год или три. В итоге вы можете получить синтаксис, который больше не работает, устаревшие вызовы API или методы, которые современные фреймворки активно не поощряют.</p>
<p>Рассмотрим этот пример: Я попросил Cursor сгенерировать код подключения Milvus, и он выдал следующее:</p>
<pre><code translate="no">connections.<span class="hljs-title function_">connect</span>(<span class="hljs-string">&quot;default&quot;</span>, host=<span class="hljs-string">&quot;localhost&quot;</span>, port=<span class="hljs-string">&quot;19530&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Раньше это работало отлично, но текущий pymilvus SDK рекомендует использовать <code translate="no">MilvusClient</code> для всех соединений и операций. Старый метод больше не считается лучшей практикой, однако ИИ-помощники продолжают его использовать, потому что их обучающие данные часто устарели на месяцы или годы.</p>
<p>Хуже того, когда я запросил код OpenAI API, Cursor выдал фрагмент, использующий <code translate="no">gpt-3.5-turbo</code>- модель, которая теперь отмечена OpenAI как <em>Legacy</em>, стоит втрое дороже своего преемника и при этом дает худшие результаты. Код также опирался на <code translate="no">openai.ChatCompletion</code>, API, устаревший с марта 2024 года.</p>
<p><span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt_pricing_6bfa92d83b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Речь идет не только о неработающем коде, но и о <strong>неработающем потоке</strong>. Обещание Vibe Coding заключается в том, что разработка должна быть плавной и интуитивно понятной. Но когда ваш помощник ИИ генерирует устаревшие API и шаблоны, вибрация исчезает. Вы возвращаетесь к Stack Overflow, к поиску документации, к старому способу делать вещи.</p>
<p>Несмотря на весь прогресс инструментов Vibe Coding, разработчики по-прежнему тратят значительное время на преодоление "последней мили" между сгенерированным кодом и готовыми к производству решениями. Вибрация есть, а точности нет.</p>
<p><strong>До сих пор.</strong></p>
<h2 id="Meet-Milvus-MCP-Vibe-Coding-with-Always-Up-to-Date-Docs" class="common-anchor-header">Встречайте Milvus MCP: Vibe Coding с всегда актуальными документами<button data-href="#Meet-Milvus-MCP-Vibe-Coding-with-Always-Up-to-Date-Docs" class="anchor-icon" translate="no">
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
    </button></h2><p>Итак, есть ли способ объединить мощный кодоген таких инструментов, как Cursor <em>, со</em> свежей документацией, чтобы мы могли генерировать точный код прямо в IDE?</p>
<p>Безусловно. Объединив Model Context Protocol (MCP) с Retrieval-Augmented Generation (RAG), мы создали усовершенствованное решение под названием <strong>Milvus MCP</strong>. Оно помогает разработчикам, использующим Milvus SDK, автоматически получать доступ к последним документам, что позволяет их IDE создавать правильный код. Эта услуга будет доступна в ближайшее время - вот краткий обзор архитектуры, лежащей в ее основе.</p>
<h3 id="How-It-Works" class="common-anchor-header">Как это работает</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/The_Architecture_Behind_MCP_c9093162b6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>На схеме выше показана гибридная система, которая сочетает в себе архитектуры MCP (Model Context Protocol) и RAG (Retrieval-Augmented Generation), помогая разработчикам генерировать точный код.</p>
<p>Слева разработчики, работающие в IDE с искусственным интеллектом, таких как Cursor или Windsurf, взаимодействуют через чат, который запускает вызовы инструментов MCP. Эти запросы отправляются на сервер MCP Server, расположенный на правой стороне, где размещены специализированные инструменты для решения повседневных задач, таких как генерация и рефакторинг кода.</p>
<p>Компонент RAG работает на стороне сервера MCP, где документация Milvus была предварительно обработана и сохранена в виде векторов в базе данных Milvus. Когда инструмент получает запрос, он выполняет семантический поиск для извлечения наиболее релевантных фрагментов документации и примеров кода. Эта контекстная информация затем отправляется обратно клиенту, где LLM использует ее для генерации точных и актуальных предложений по коду.</p>
<h3 id="MCP-transport-mechanism" class="common-anchor-header">Транспортный механизм MCP</h3><p>MCP поддерживает два транспортных механизма: <code translate="no">stdio</code> и <code translate="no">SSE</code>:</p>
<ul>
<li><p>Стандартный ввод/вывод (stdio): Транспорт <code translate="no">stdio</code> обеспечивает взаимодействие через стандартные потоки ввода/вывода. Он особенно полезен для локальных инструментов или интеграций в командную строку.</p></li>
<li><p>Server-Sent Events (SSE): SSE поддерживает потоковую передачу данных от сервера к клиенту, используя HTTP POST-запросы для связи между клиентом и сервером.</p></li>
</ul>
<p>Поскольку <code translate="no">stdio</code> опирается на локальную инфраструктуру, пользователи должны сами управлять получением документов. В нашем случае <strong>SSE подходит лучше -</strong>сервер обрабатывает все документы и обновляет их автоматически. Например, документы могут переиндексироваться ежедневно. Пользователям нужно только добавить эту конфигурацию JSON в настройку MCP:</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;milvus-code-generate-helper&quot;</span>: {
      <span class="hljs-string">&quot;url&quot;</span>: <span class="hljs-string">&quot;http://&lt;SERVER_ADDRESS&gt;:23333/milvus-code-helper/sse&quot;</span>
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<p>После этого ваша IDE (например, Cursor или Windsurf) может начать взаимодействовать с инструментами на стороне сервера, автоматически получая последнюю версию документации Milvus для более разумной и актуальной генерации кода.</p>
<h2 id="Milvus-MCP-in-Action" class="common-anchor-header">Milvus MCP в действии<button data-href="#Milvus-MCP-in-Action" class="anchor-icon" translate="no">
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
    </button></h2><p>Чтобы показать, как эта система работает на практике, мы создали три готовых к использованию инструмента на сервере Milvus MCP Server, к которым вы можете получить доступ прямо из вашей IDE. Каждый инструмент решает одну из распространенных проблем, с которыми сталкиваются разработчики при работе с Milvus:</p>
<ul>
<li><p><strong>pymilvus-code-generator</strong>: Пишет код на языке Python, когда вам нужно выполнить обычные операции Milvus, такие как создание коллекций, вставка данных или поиск с помощью pymilvus SDK.</p></li>
<li><p><strong>orm-client-code-convertor</strong>: Модернизирует ваш существующий код на Python, заменяя устаревшие шаблоны ORM (Object Relational Mapping) на более простой и новый синтаксис MilvusClient.</p></li>
<li><p><strong>Переводчик языка</strong>: Преобразует код Milvus SDK между языками программирования. Например, если у вас есть рабочий код Python SDK, но он нужен в TypeScript SDK, этот инструмент переведет его для вас.</p></li>
</ul>
<p>Теперь давайте посмотрим, как они работают.</p>
<h3 id="pymilvus-code-generator" class="common-anchor-header">pymilvus-code-generator</h3><div style="padding:66.98% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/1093504910?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="pymilvus-code-generator"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>
<p>В этой демонстрации я попросил Cursor сгенерировать код полнотекстового поиска с помощью <code translate="no">pymilvus</code>. Cursor успешно вызывает правильный инструмент MCP и выводит код, соответствующий спецификации. Большинство сценариев использования <code translate="no">pymilvus</code> без проблем работают с этим инструментом.</p>
<p>Вот сравнение бок о бок с этим инструментом и без него.</p>
<p><strong>С MCP MCP:</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/With_Milvus_MCP_f72ad4cfb6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>→ Курсор с Milvus MCP использует новейший интерфейс <code translate="no">MilvusClient</code> для создания коллекции.</p>
<p><strong>Без MCP:</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Without_Milvus_MCP_3336d956a4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>→ Cursor без сервера Milvus MCP использует устаревший синтаксис ORM - больше не рекомендуется.</p>
<h3 id="orm-client-code-convertor" class="common-anchor-header">orm-client-code-convertor</h3><div style="padding:66.98% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/1093504859?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="orm-client-code-convertor"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>
<p>В этом примере пользователь выделяет некоторый код в стиле ORM и запрашивает преобразование. Инструмент корректно переписывает логику соединений и схему, используя экземпляр <code translate="no">MilvusClient</code>. Пользователь может принять все изменения одним щелчком мыши.</p>
<h3 id="language-translator" class="common-anchor-header"><strong>переводчик языка</strong></h3><div style="padding:66.98% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/1093504885?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="tool3 ts-1"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>
<p>Здесь пользователь выбирает файл <code translate="no">.py</code> и запрашивает перевод на TypeScript. Инструмент вызывает нужную конечную точку MCP, извлекает последнюю документацию TypeScript SDK и выдает эквивалентный файл <code translate="no">.ts</code> с той же бизнес-логикой. Это идеальный вариант для межъязыковой миграции.</p>
<h2 id="Comparing-Milvus-MCP-with-Context7-DeepWiki-and-Other-Tools" class="common-anchor-header">Сравнение Milvus MCP с Context7, DeepWiki и другими инструментами<button data-href="#Comparing-Milvus-MCP-with-Context7-DeepWiki-and-Other-Tools" class="anchor-icon" translate="no">
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
    </button></h2><p>Мы уже обсуждали проблему галлюцинаций "последней мили" в Vibe Coding. Помимо нашего Milvus MCP, многие другие инструменты также направлены на решение этой проблемы, например Context7 и DeepWiki. Эти инструменты, часто работающие на базе MCP или RAG, помогают внедрить актуальную документацию и примеры кода в контекстное окно модели.</p>
<h3 id="Context7" class="common-anchor-header">Context7</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Context7_fc32b53a0e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Рисунок: Страница Milvus в Context7 позволяет пользователям искать и настраивать фрагменты документов<a href="https://context7.com/milvus-io/milvus">(https://context7.com/milvus-io/milvus)</a>.</p>
<p>Context7 предоставляет актуальную, специфичную для каждой версии документацию и примеры кода для LLM и редакторов кода AI. Основная проблема, которую он решает, заключается в том, что LLM полагаются на устаревшую или общую информацию об используемых библиотеках, предоставляя вам примеры кода, которые устарели и основаны на обучающих данных годичной давности.</p>
<p>Context7 MCP извлекает актуальную, специфичную для конкретной версии документацию и примеры кода прямо из источника и помещает их непосредственно в вашу подсказку. Он поддерживает импорт из репо GitHub и файлы <code translate="no">llms.txt</code>, включая такие форматы, как <code translate="no">.md</code>, <code translate="no">.mdx</code>, <code translate="no">.txt</code>, <code translate="no">.rst</code> и <code translate="no">.ipynb</code> (но не файлы <code translate="no">.py</code> ).</p>
<p>Пользователи могут вручную копировать содержимое с сайта или использовать интеграцию Context7 с MCP для автоматического извлечения.</p>
<h3 id="DeepWiki" class="common-anchor-header"><strong>DeepWiki</strong></h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Deep_Wiki_bebe01aa6f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Рисунок: DeepWiki предоставляет автогенерируемые резюме Milvus, включая логику и архитектуру<a href="https://deepwiki.com/milvus-io/milvus">(https://deepwiki.com/milvus-io/milvus).</a></p>
<p>DeepWiki автоматически анализирует проекты GitHub с открытым исходным кодом для создания читабельных технических документов, диаграмм и блок-схем. Он включает в себя чат-интерфейс для вопросов и ответов на естественном языке. Однако приоритет отдается файлам кода, а не документации, поэтому он может упускать из виду ключевые моменты документации. В настоящее время в нем отсутствует интеграция с MCP.</p>
<h3 id="Cursor-Agent-Mode" class="common-anchor-header">Режим агента Cursor</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Cursor_Agent_Mode_fba8ef66af.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Режим агента в Cursor позволяет использовать веб-поиск, вызовы MCP и переключать плагины. Несмотря на свою мощь, он иногда непоследователен. Вы можете использовать <code translate="no">@</code> для ручной вставки документов, но для этого необходимо сначала найти и прикрепить содержимое.</p>
<h3 id="llmstxt" class="common-anchor-header">llms.txt</h3><p><code translate="no">llms.txt</code> это не инструмент, а предлагаемый стандарт для предоставления LLM структурированного содержимого сайта. Обычно в формате Markdown он помещается в корневой каталог сайта и организует заголовки, деревья документов, учебники, ссылки на API и многое другое.</p>
<p>Это не самостоятельный инструмент, но он хорошо сочетается с теми, которые его поддерживают.</p>
<h3 id="Side-by-Side-Feature-Comparison-Milvus-MCP-vs-Context7-vs-DeepWiki-vs-Cursor-Agent-Mode-vs-llmstxt" class="common-anchor-header">Боковое сравнение функций: Milvus MCP vs. Context7 vs. DeepWiki vs Cursor Agent Mode vs llms.txt</h3><table>
<thead>
<tr><th style="text-align:center"></th><th style="text-align:center"></th><th style="text-align:center"></th><th style="text-align:center"></th><th style="text-align:center"></th><th style="text-align:center"></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>Характеристика</strong></td><td style="text-align:center"><strong>Context7</strong></td><td style="text-align:center"><strong>DeepWiki</strong></td><td style="text-align:center"><strong>Режим курсорного агента</strong></td><td style="text-align:center"><strong>llms.txt</strong></td><td style="text-align:center"><strong>Milvus MCP</strong></td></tr>
<tr><td style="text-align:center"><strong>Работа с документами</strong></td><td style="text-align:center">Только документы, никакого кода</td><td style="text-align:center">Ориентирован на код, может пропустить документы</td><td style="text-align:center">Выбранные пользователем</td><td style="text-align:center">Структурированный Markdown</td><td style="text-align:center">Только официальные документы Milvus</td></tr>
<tr><td style="text-align:center"><strong>Поиск контекста</strong></td><td style="text-align:center">Автоматическая вставка</td><td style="text-align:center">Ручное копирование/вставка</td><td style="text-align:center">Смешанный, менее точный</td><td style="text-align:center">Структурированная предварительная маркировка</td><td style="text-align:center">Автоматическое извлечение из хранилища векторов</td></tr>
<tr><td style="text-align:center"><strong>Пользовательский импорт</strong></td><td style="text-align:center">✅ GitHub, llms.txt</td><td style="text-align:center">✅ GitHub (в т.ч. частный)</td><td style="text-align:center">❌ Только ручной выбор</td><td style="text-align:center">✅ Авторство вручную</td><td style="text-align:center">❌ Поддерживается сервером</td></tr>
<tr><td style="text-align:center"><strong>Ручные усилия</strong></td><td style="text-align:center">Частично (MCP против ручного)</td><td style="text-align:center">Ручное копирование</td><td style="text-align:center">Полуручное</td><td style="text-align:center">Только администратор</td><td style="text-align:center">Действия пользователя не требуются</td></tr>
<tr><td style="text-align:center"><strong>Интеграция с MCP</strong></td><td style="text-align:center">✅ Да</td><td style="text-align:center">❌ Нет</td><td style="text-align:center">✅ Да (с настройкой)</td><td style="text-align:center">❌ Не инструмент</td><td style="text-align:center">✅ Требуется</td></tr>
<tr><td style="text-align:center"><strong>Преимущества</strong></td><td style="text-align:center">Живые обновления, IDE-ready</td><td style="text-align:center">Визуальные диаграммы, поддержка QA</td><td style="text-align:center">Пользовательские рабочие процессы</td><td style="text-align:center">Структурированные данные для искусственного интеллекта</td><td style="text-align:center">Поддерживается Milvus/Zilliz</td></tr>
<tr><td style="text-align:center"><strong>Ограничения</strong></td><td style="text-align:center">Нет поддержки файлов кода</td><td style="text-align:center">Пропускает документацию</td><td style="text-align:center">Полагается на веб-точность</td><td style="text-align:center">Требуются другие инструменты</td><td style="text-align:center">Ориентирован исключительно на Milvus</td></tr>
</tbody>
</table>
<p>Milvus MCP создан специально для разработки баз данных Milvus. Он автоматически получает последнюю официальную документацию и легко взаимодействует с вашей средой кодирования. Если вы работаете с Milvus, это лучший вариант.</p>
<p>Другие инструменты, такие как Context7, DeepWiki и Cursor Agent Mode, работают со многими различными технологиями, но они не так специализированы и точны для работы с Milvus.</p>
<p>Выбирайте, исходя из того, что вам нужно. Хорошая новость заключается в том, что эти инструменты хорошо работают вместе - вы можете использовать сразу несколько, чтобы получить наилучшие результаты для разных частей вашего проекта.</p>
<h2 id="Milvus-MCP-is-Coming-Soon" class="common-anchor-header">Milvus MCP скоро появится!<button data-href="#Milvus-MCP-is-Coming-Soon" class="anchor-icon" translate="no">
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
    </button></h2><p>Проблема галлюцинаций в Vibe Coding - это не просто незначительное неудобство, это убийца производительности, который заставляет разработчиков возвращаться к ручному процессу проверки. Milvus MCP демонстрирует, как специализированные MCP-серверы могут решить эту проблему, предоставляя доступ к текущей документации в режиме реального времени.</p>
<p>Для разработчиков Milvus это означает, что больше не нужно отлаживать устаревшие вызовы <code translate="no">connections.connect()</code> или бороться с устаревшими шаблонами ORM. Три инструмента - генератор кода для Milvus, конвертор кода для Orm-клиента и переводчик языка - автоматически справляются с наиболее распространенными проблемами.</p>
<p>Готовы попробовать? Скоро сервис будет доступен для тестирования в раннем доступе. Следите за новостями.</p>
