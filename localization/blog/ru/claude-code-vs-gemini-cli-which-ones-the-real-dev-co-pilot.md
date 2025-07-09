---
id: claude-code-vs-gemini-cli-which-ones-the-real-dev-co-pilot.md
title: 'Claude Code против Gemini CLI: кто из них настоящий второй пилот?'
author: Min Yin
date: 2025-07-09T00:00:00.000Z
desc: >-
  Сравните Gemini CLI и Claude Code, два инструмента для кодирования с
  искусственным интеллектом, преобразующие рабочие процессы в терминалах. Какой
  из них должен стать основой вашего следующего проекта?
cover: assets.zilliz.com/Claude_Code_vs_Gemini_CLI_e3a04a49cf.jpeg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, Gemini, Claude'
meta_keywords: >-
  Claude Code, Gemini CLI, Natural Language Coding, Vibe Coding, AI Coding
  Assistants
meta_title: |
  Claude Code vs Gemini CLI: Who’s the Real Dev Co-Pilot?
origin: >-
  https://milvus.io/blog/claude-code-vs-gemini-cli-which-ones-the-real-dev-co-pilot.md
---
<p>Ваша IDE раздулась. Ваш помощник по кодированию устарел. И вы все еще застряли на нажатии правой кнопки мыши для рефакторинга? Добро пожаловать в эпоху ренессанса CLI.</p>
<p>ИИ-помощники по коду превращаются из диковинок в основные инструменты, и разработчики принимают их сторону. Помимо стартапа-сенсации Cursor, <a href="https://www.anthropic.com/claude-code"><strong>Claude Code</strong></a> <strong>от Anthropic</strong> предлагает точность и полировку. <a href="https://github.com/google-gemini/gemini-cli"><strong>Gemini CLI</strong></a> от Google? Быстрый, бесплатный и жаждущий контекста. Оба обещают сделать естественный язык новым сценарием оболочки. Так кому же из них <em>доверить</em> рефакторинг вашего следующего репозитория?</p>
<p>Судя по тому, что я видел, Claude Code лидировал на первых порах. Но игра быстро изменилась. После запуска Gemini CLI разработчики устремились к нему, набрав<strong>15,1 тыс. звезд на GitHub за 24 часа.</strong> На данный момент он перевалил за <strong>55 000 звезд</strong> и продолжает расти. Потрясающе!</p>
<p>Вот мой краткий вывод о том, почему так много разработчиков в восторге от Gemini CLI:</p>
<ul>
<li><p><strong>Он имеет открытый исходный код Apache 2.0 и совершенно бесплатен:</strong> Gemini CLI подключается к высококлассной флеш-модели Gemini 2.0 от Google бесплатно. Чтобы получить доступ к Gemini Code Assist, просто войдите в свой личный аккаунт Google. В период предварительного просмотра вы получаете до 60 запросов в минуту и 1 000 запросов в день - и все это бесплатно.</p></li>
<li><p><strong>Это настоящий многозадачный помощник:</strong> Помимо программирования (это его сильная сторона), он справляется с управлением файлами, созданием контента, управлением скриптами и даже возможностями глубокого исследования.</p></li>
<li><p><strong>Он легкий:</strong> Вы можете легко встраивать его в терминальные скрипты или использовать как отдельный агент.</p></li>
<li><p><strong>Он предлагает большую длину контекста:</strong> 1 миллион лексем контекста (примерно 750 000 слов) позволяет за один проход проникать в целые кодовые базы небольших проектов.</p></li>
</ul>
<h2 id="Why-Developers-Are-Ditching-IDEs-for-AI-Powered-Terminals" class="common-anchor-header">Почему разработчики отказываются от IDE в пользу терминалов на базе ИИ<button data-href="#Why-Developers-Are-Ditching-IDEs-for-AI-Powered-Terminals" class="anchor-icon" translate="no">
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
    </button></h2><p>Почему эти инструменты на базе терминалов вызывают такой энтузиазм? Как разработчики, вы наверняка ощущали эту боль: Традиционные IDE обладают впечатляющими возможностями, но они сопровождаются сложностью рабочего процесса, которая убивает динамику. Хотите рефакторить одну функцию? Вам нужно выделить код, вызвать контекстное меню правой кнопкой мыши, перейти к пункту "Рефакторинг", выбрать конкретный тип рефакторинга, настроить параметры в диалоговом окне и, наконец, применить изменения.</p>
<p><strong>Инструменты терминального ИИ изменили этот рабочий процесс, упростив все операции до команд на естественном языке.</strong> Вместо того чтобы запоминать синтаксис команд, вы просто говорите: &quot;<em>Помогите мне рефакторить эту функцию, чтобы улучшить читаемость</em>&quot;, и наблюдаете, как инструмент выполняет весь процесс.</p>
<p>Это не просто удобство - это фундаментальный сдвиг в нашем мышлении. Сложные технические операции становятся разговорами на естественном языке, что позволяет нам сосредоточиться на бизнес-логике, а не на механике инструментов.</p>
<h2 id="Claude-Code-or-Gemini-CLI-Choose-Your-Co-Pilot-Wisely" class="common-anchor-header">Claude Code или Gemini CLI? Выбирайте второго пилота с умом<button data-href="#Claude-Code-or-Gemini-CLI-Choose-Your-Co-Pilot-Wisely" class="anchor-icon" translate="no">
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
    </button></h2><p>Поскольку Claude Code также довольно популярен и прост в использовании и ранее доминировал в принятии, как он сопоставляется с новым Gemini CLI? Как выбрать один из них? Давайте подробнее рассмотрим эти инструменты для кодирования с помощью ИИ.</p>
<h3 id="1-Cost-Free-vs-Paid" class="common-anchor-header"><strong>1. Стоимость: Бесплатный и платный</strong></h3><ul>
<li><p><strong>Gemini CLI</strong> полностью бесплатен для любого аккаунта Google, обеспечивает 1 000 запросов в день и 60 запросов в минуту, не требует настройки биллинга.</p></li>
<li><p><strong>Claude Code</strong> требует активной подписки Anthropic и работает по модели оплаты за использование, но включает в себя безопасность и поддержку корпоративного уровня, что очень важно для коммерческих проектов.</p></li>
</ul>
<h3 id="2-Context-Window-How-Much-Code-Can-It-See" class="common-anchor-header"><strong>2. Контекстное окно: Сколько кода оно может увидеть?</strong></h3><ul>
<li><p><strong>Gemini CLI:</strong> 1 миллион токенов (примерно 750 000 слов)</p></li>
<li><p><strong>Код Клода:</strong> Приблизительно 200 000 лексем (около 150 000 слов).</p></li>
</ul>
<p>Большие контекстные окна позволяют моделям ссылаться на большее количество входного контента при генерации ответов. Они также помогают поддерживать связность разговора в многооборотных диалогах, позволяя модели лучше запомнить весь ваш разговор.</p>
<p>По сути, Gemini CLI может проанализировать весь ваш небольшой или средний проект за одну сессию, что делает его идеальным для понимания больших кодовых баз и межфайловых связей. Claude Code лучше работает, когда вы фокусируетесь на конкретных файлах или функциях.</p>
<h3 id="3-Code-Quality-vs-Speed" class="common-anchor-header"><strong>3. Качество кода против скорости</strong></h3><table>
<thead>
<tr><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>Функционал</strong></td><td><strong>Gemini CLI</strong></td><td><strong>Код Клода</strong></td><td><strong>Заметки</strong></td></tr>
<tr><td><strong>Скорость кодирования</strong></td><td>8.5/10</td><td>7.2/10</td><td>Gemini генерирует код быстрее</td></tr>
<tr><td><strong>Качество кодирования</strong></td><td>7.8/10</td><td>9.1/10</td><td>Claude генерирует код более высокого качества</td></tr>
<tr><td><strong>Работа над ошибками</strong></td><td>7.5/10</td><td>8.8/10</td><td>Claude лучше справляется с обработкой ошибок</td></tr>
<tr><td><strong>Понимание контекста</strong></td><td>9.2/10</td><td>7.9/10</td><td>У Близнецов больше памяти</td></tr>
<tr><td><strong>Многоязычная поддержка</strong></td><td>8.9/10</td><td>8.5/10</td><td>Оба варианта превосходны</td></tr>
</tbody>
</table>
<ul>
<li><p><strong>Gemini CLI</strong> быстрее генерирует код и отлично справляется с пониманием больших контекстов, что делает его отличным инструментом для быстрого создания прототипов.</p></li>
<li><p><strong>Claude Code</strong> отличается точностью и обработкой ошибок, что делает его более подходящим для производственных сред, где качество кода имеет решающее значение.</p></li>
</ul>
<h3 id="4-Platform-Support-Where-Can-You-Run-It" class="common-anchor-header"><strong>4. Поддержка платформ: Где вы можете его запустить?</strong></h3><ul>
<li><p><strong>Gemini CLI</strong> с первого дня одинаково хорошо работает в Windows, macOS и Linux.</p></li>
<li><p><strong>Claude Code</strong> сначала был оптимизирован для macOS, и хотя он работает на других платформах, наилучшие впечатления все равно остаются на Mac.</p></li>
</ul>
<h3 id="5-Authentication-and-Access" class="common-anchor-header"><strong>5. Аутентификация и доступ</strong></h3><p><strong>Claude Code</strong> требует активной подписки Anthropic (Pro, Max, Team или Enterprise) или доступа к API через AWS Bedrock/Vertex AI. Это означает, что вам нужно настроить биллинг, прежде чем вы сможете начать использовать его.</p>
<p><strong>Gemini CLI</strong> предлагает щедрый бесплатный план для индивидуальных владельцев аккаунтов Google, включающий 1 000 бесплатных запросов в день и 60 запросов в минуту к полнофункциональной модели Gemini 2.0 Flash. Пользователи, которым требуются более высокие лимиты или конкретные модели, могут обновить их с помощью API-ключей.</p>
<h3 id="6-Feature-Comparison-Overview" class="common-anchor-header"><strong>6. Сравнительный обзор функций</strong></h3><table>
<thead>
<tr><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>Характеристика</strong></td><td><strong>Код Клода</strong></td><td><strong>Gemini CLI</strong></td></tr>
<tr><td>Длина контекстного окна</td><td>200K токенов</td><td>1М токенов</td></tr>
<tr><td>Мультимодальная поддержка</td><td>Ограниченная</td><td>Мощная (изображения, PDF и т.д.)</td></tr>
<tr><td>Понимание кода</td><td>Отлично</td><td>Отлично</td></tr>
<tr><td>Интеграция инструментов</td><td>Базовый</td><td>Богатый (MCP-серверы)</td></tr>
<tr><td>Безопасность</td><td>Корпоративный уровень</td><td>Стандарт</td></tr>
<tr><td>Бесплатные запросы</td><td>Ограниченный</td><td>60/мин, 1000/день</td></tr>
</tbody>
</table>
<h2 id="When-to-Choose-Claude-Code-vs-Gemini-CLI" class="common-anchor-header">Когда выбирать Claude Code против Gemini CLI?<button data-href="#When-to-Choose-Claude-Code-vs-Gemini-CLI" class="anchor-icon" translate="no">
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
    </button></h2><p>Теперь, когда мы сравнили ключевые особенности обоих инструментов, вот мои рекомендации по выбору каждого из них:</p>
<p><strong>Выбирайте Gemini CLI, если:</strong></p>
<ul>
<li><p>Экономичность и быстрое экспериментирование являются приоритетами.</p></li>
<li><p>Вы работаете над крупными проектами, требующими огромных контекстных окон</p></li>
<li><p>Вы любите передовые инструменты с открытым исходным кодом</p></li>
<li><p>Кросс-платформенная совместимость имеет решающее значение</p></li>
<li><p>Вам нужны мощные мультимодальные возможности</p></li>
</ul>
<p><strong>Выбирайте Claude Code, если:</strong></p>
<ul>
<li><p>Вам нужна высококачественная генерация кода</p></li>
<li><p>Вы создаете критически важные коммерческие приложения</p></li>
<li><p>Поддержка на уровне предприятия не подлежит обсуждению</p></li>
<li><p>Качество кода важнее стоимости</p></li>
<li><p>Вы работаете преимущественно на macOS</p></li>
</ul>
<h2 id="Claude-Code-vs-Gemini-CLI-Setup-and-Best-Practices" class="common-anchor-header">Claude Code против Gemini CLI: настройка и лучшие практики<button data-href="#Claude-Code-vs-Gemini-CLI-Setup-and-Best-Practices" class="anchor-icon" translate="no">
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
    </button></h2><p>Теперь, когда мы имеем базовое представление о возможностях этих двух инструментов терминального ИИ, давайте подробнее рассмотрим, как начать работу с ними и каковы лучшие практики.</p>
<h3 id="Claude-Code-Setup-and-Best-Practices" class="common-anchor-header">Установка Claude Code и лучшие практики</h3><p><strong>Установка:</strong> Для установки Claude Code требуется npm и Node.js версии 18 или выше.</p>
<pre><code translate="no"><span class="hljs-comment"># Install Claude Code on your system</span>
npm install -g @anthropic-ai/claude-code

<span class="hljs-comment"># Set up API key</span>
claude config <span class="hljs-built_in">set</span> api-key YOUR_API_KEY

<span class="hljs-comment"># Verify installation was successful</span>
claude --version

<span class="hljs-comment"># Launch Claude Code</span>
Claude
<button class="copy-code-btn"></button></code></pre>
<p>****  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_c413bbf950.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
****</p>
<p><strong>Лучшие практики для Claude Code:</strong></p>
<ol>
<li><strong>Начните с понимания архитектуры:</strong> Приступая к работе над новым проектом, попросите Claude Code помочь вам понять общую структуру, используя естественный язык.</li>
</ol>
<pre><code translate="no"><span class="hljs-meta"># Let Claude analyze project architecture</span>
&gt; Analyze the main architectural components of <span class="hljs-keyword">this</span> project

<span class="hljs-meta"># Understand security mechanisms</span>
&gt; What security measures does <span class="hljs-keyword">this</span> system have?

<span class="hljs-meta"># Get code overview</span>
&gt; Give me an overview of <span class="hljs-keyword">this</span> codebase
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li><strong>Будьте конкретны и предоставляйте контекст:</strong> Чем больше контекста вы укажете, тем точнее будут предложения Claude Code.</li>
</ol>
<pre><code translate="no"><span class="hljs-meta"># Implement specific features</span>
&gt; Implement an initial version <span class="hljs-keyword">for</span> GitHub issue <span class="hljs-meta">#123</span>

<span class="hljs-meta"># Code migration</span>
&gt; Help me migrate <span class="hljs-keyword">this</span> codebase to the latest Java version, first create a plan

<span class="hljs-meta"># Code refactoring</span>
&gt; Refactor <span class="hljs-keyword">this</span> function to make it more readable <span class="hljs-keyword">and</span> maintainable
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li><strong>Используйте его для отладки и оптимизации:</strong></li>
</ol>
<pre><code translate="no"><span class="hljs-meta"># Error analysis</span>
&gt; What caused <span class="hljs-keyword">this</span> error? How can we fix it?

<span class="hljs-meta"># Performance optimization</span>
&gt; Analyze the performance bottlenecks <span class="hljs-keyword">in</span> <span class="hljs-keyword">this</span> code

<span class="hljs-meta"># Code review</span>
&gt; Review <span class="hljs-keyword">this</span> pull request <span class="hljs-keyword">and</span> point <span class="hljs-keyword">out</span> potential issues
<button class="copy-code-btn"></button></code></pre>
<p><strong>Резюме:</strong></p>
<ul>
<li><p>Используйте прогрессивное обучение, начиная с простых объяснений кода, а затем постепенно переходя к более сложным задачам генерации кода.</p></li>
<li><p>Сохраняйте контекст разговора, поскольку Клод Код помнит предыдущие обсуждения.</p></li>
<li><p>Предоставляйте обратную связь с помощью команды <code translate="no">bug</code>, чтобы сообщать о проблемах и помогать улучшать инструмент.</p></li>
<li><p>Следите за безопасностью, изучая политики сбора данных и проявляя осторожность при работе с конфиденциальным кодом</p></li>
</ul>
<h3 id="Gemini-CLI-Setup-and-Best-Practices" class="common-anchor-header">Настройка Gemini CLI и лучшие практики</h3><p><strong>Установка:</strong> Как и Claude Code, Gemini CLI требует npm и Node.js версии 18 или выше.</p>
<pre><code translate="no"><span class="hljs-comment"># Install Gemini CLI</span>
npm install -g @google/gemini-cli

<span class="hljs-comment"># Login to your Google account</span>
gemini auth login

<span class="hljs-comment"># Verify installation</span>
gemini --version

<span class="hljs-comment"># Launch Gemini CLI</span>
Gemini
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_bec1984bb0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Если у вас есть личный аккаунт, войдите в него с помощью учетной записи Google, чтобы получить немедленный доступ, с ограничением 60 запросов в минуту. Для получения более высоких лимитов настройте свой API-ключ:</p>
<pre><code translate="no"><span class="hljs-keyword">export</span> <span class="hljs-variable constant_">GEMINI_API_KEY</span>=<span class="hljs-string">&quot;YOUR_API_KEY&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Best Practices for Gemini CLI:</strong></p>
<ol>
<li><strong>Начните с понимания архитектуры:</strong> Как и в случае с Claude Code, при работе над новым проектом попросите Gemini CLI помочь вам понять общую структуру, используя естественный язык. Обратите внимание, что Gemini CLI поддерживает контекстное окно в 1 миллион токенов, что делает его очень эффективным для анализа масштабных кодовых баз.</li>
</ol>
<pre><code translate="no"><span class="hljs-meta"># Analyze project architecture</span>
&gt; Analyze the main architectural components of <span class="hljs-keyword">this</span> project

<span class="hljs-meta"># Understand security mechanisms</span>
&gt; What security measures does <span class="hljs-keyword">this</span> system have?

<span class="hljs-meta"># Get code overview</span>
&gt; Give me an overview of <span class="hljs-keyword">this</span> codebase
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li><strong>Используйте его мультимодальные возможности:</strong> Именно здесь Gemini CLI действительно сияет.</li>
</ol>
<pre><code translate="no"><span class="hljs-meta"># Generate app from PDF</span>
&gt; Create a <span class="hljs-keyword">new</span> app based <span class="hljs-keyword">on</span> <span class="hljs-keyword">this</span> PDF design document

<span class="hljs-meta"># Generate code from sketch</span>
&gt; Generate frontend code based <span class="hljs-keyword">on</span> <span class="hljs-keyword">this</span> UI sketch

<span class="hljs-meta"># Image processing tasks</span>
&gt; Convert all images <span class="hljs-keyword">in</span> <span class="hljs-keyword">this</span> directory to PNG format <span class="hljs-keyword">and</span> rename <span class="hljs-keyword">using</span> EXIF data
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li><strong>Изучите возможности интеграции инструментов:</strong> Gemini CLI может интегрироваться с различными инструментами и MCP-серверами для расширения функциональности.</li>
</ol>
<pre><code translate="no"><span class="hljs-comment"># Connect external tools</span>
&gt; Use MCP server to connect my <span class="hljs-built_in">local</span> system tools

<span class="hljs-comment"># Media generation</span>
&gt; Use Imagen to generate project logo

<span class="hljs-comment"># Search integration</span>
&gt; Use Google search tool to find related technical documentation
<button class="copy-code-btn"></button></code></pre>
<p><strong>Резюме:</strong></p>
<ul>
<li><p>Ориентируйтесь на проект: Всегда запускайте Gemini из каталога проекта для лучшего понимания контекста.</p></li>
<li><p>Максимально используйте мультимодальные возможности, используя в качестве входных данных изображения, документы и другие медиафайлы, а не только текст</p></li>
<li><p>Изучите интеграцию инструментов, подключая внешние инструменты к серверам MCP</p></li>
<li><p>Расширьте возможности поиска, используя встроенный поиск Google для получения актуальной информации.</p></li>
</ul>
<h2 id="AI-Code-is-Outdated-on-Arrival-Here’s-How-to-Fix-it-with-Milvus" class="common-anchor-header">Код ИИ устаревает по прибытии. Как исправить это с помощью Milvus<button data-href="#AI-Code-is-Outdated-on-Arrival-Here’s-How-to-Fix-it-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><em>Инструменты для кодирования ИИ, такие как Claude Code и Gemini CLI, очень мощные, но у них есть "слепое пятно":</em> <strong><em>они не знают, что является актуальным</em></strong><em>.</em></p>
<p><em>Реальность? Большинство моделей генерируют устаревшие шаблоны прямо из коробки. Они были обучены несколько месяцев назад, а иногда и несколько лет. Поэтому, хотя они и могут быстро генерировать код, они не могут гарантировать, что он отражает</em> <strong><em>последние</em></strong><em> версии</em> <strong><em>API</em></strong><em>, фреймворков или SDK.</em></p>
<p><strong>Реальный пример:</strong></p>
<p>Спросите Cursor, как подключиться к Milvus, и вы можете получить следующее:</p>
<pre><code translate="no">connections.<span class="hljs-title function_">connect</span>(<span class="hljs-string">&quot;default&quot;</span>, host=<span class="hljs-string">&quot;localhost&quot;</span>, port=<span class="hljs-string">&quot;19530&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Выглядит хорошо, но этот метод уже устарел. Рекомендуемый подход - использовать <code translate="no">MilvusClient</code>, но большинство помощников еще не знают об этом.</p>
<p>Или возьмите собственный API OpenAI. Многие инструменты все еще предлагают <code translate="no">gpt-3.5-turbo</code> через <code translate="no">openai.ChatCompletion</code>, метод, устаревший в марте 2024 года. Он медленнее, стоит дороже и дает худшие результаты. Но LLM этого не знает.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_8f0d1a42b6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_5_3f4c4a0d4c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="The-Fix-Real-Time-Intelligence-with-Milvus-MCP-+-RAG" class="common-anchor-header">Исправление: Интеллект в реальном времени с помощью Milvus MCP + RAG</h3><p>Чтобы решить эту проблему, мы объединили две мощные идеи:</p>
<ul>
<li><p><strong>Контекстный протокол модели (MCP)</strong>: Стандарт для агентских инструментов, позволяющий взаимодействовать с живыми системами с помощью естественного языка.</p></li>
<li><p><strong>Retrieval-Augmented Generation (RAG)</strong>: Находит самый свежий, самый актуальный контент по запросу.</p></li>
</ul>
<p>Вместе они сделают вашего помощника умнее и актуальнее.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_e6bc6cacd6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Вот как это работает:</strong></p>
<ol>
<li><p>Предварительно обработайте документацию, ссылки на SDK и руководства по API.</p></li>
<li><p>Храните их в виде векторных вкраплений в <a href="https://milvus.io/"><strong>Milvus</strong></a>, нашей векторной базе данных с открытым исходным кодом.</p></li>
<li><p>Когда разработчик задает вопрос (например, "Как подключиться к Milvus?"), система</p>
<ul>
<li><p>Выполняет <strong>семантический поиск</strong></p></li>
<li><p>Извлекает наиболее релевантные документы и примеры</p></li>
<li><p>Вставляет их в контекст подсказки помощника.</p></li>
</ul></li>
</ol>
<ol start="4">
<li>Результат: предложения по коду, которые отражают <strong>именно то, что актуально в данный момент</strong>.</li>
</ol>
<h3 id="Live-Code-Live-Docs" class="common-anchor-header">Живой код, живые документы</h3><p>С помощью <strong>Milvus MCP Server</strong> вы можете подключить этот поток непосредственно к вашей среде кодирования. Ассистенты становятся умнее. Код становится лучше. Разработчики остаются в потоке.</p>
<p>И это не просто теория - мы протестировали эту систему в сравнении с другими системами, такими как Cursor's Agent Mode, Context7 и DeepWiki. Разница? Milvus + MCP не просто подводит итоги вашего проекта - он остается синхронизированным с ним.</p>
<p>Посмотрите на это в действии: <a href="https://milvus.io/blog/why-vibe-coding-generate-outdated-code-and-how-to-fix-it-with-milvus-mcp.md">Почему ваш виброкодинг генерирует устаревший код и как это исправить с помощью Milvus MCP </a></p>
<h2 id="The-Future-of-Coding-is-ConversationalAnd-Its-Happening-Right-Now" class="common-anchor-header">Будущее кодинга - разговорный подход, и это происходит прямо сейчас<button data-href="#The-Future-of-Coding-is-ConversationalAnd-Its-Happening-Right-Now" class="anchor-icon" translate="no">
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
    </button></h2><p>Революция терминального ИИ только начинается. По мере развития этих инструментов мы, вероятно, увидим еще более тесную интеграцию с рабочими процессами разработки, повышение качества кода и решение проблемы валюты с помощью таких подходов, как MCP+RAG.</p>
<p>Выбираете ли вы Claude Code за его качество или Gemini CLI за его доступность и мощь, ясно одно: <strong>программирование на естественном языке останется.</strong> Вопрос не в том, стоит ли использовать эти инструменты, а в том, как эффективно интегрировать их в рабочий процесс разработки.</p>
<p>Мы являемся свидетелями фундаментального сдвига от запоминания синтаксиса к общению с кодом. <strong>Будущее кодинга - разговорное, и это происходит прямо сейчас в вашем терминале.</strong></p>
<h2 id="Keep-Reading" class="common-anchor-header">Продолжить чтение<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/building-a-production-ready-ai-assistant-with-spring-boot-and-milvus.md">Создание готового к производству ИИ-помощника с помощью Spring Boot и Milvus</a></p></li>
<li><p><a href="https://zilliz.com/blog/introducing-zilliz-mcp-server">Zilliz MCP Server: Доступ к векторным базам данных на естественном языке - блог Zilliz</a></p></li>
<li><p><a href="https://milvus.io/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md">VDBBench 1.0: Бенчмаркинг реального мира для векторных баз данных - Блог Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/why-vibe-coding-generate-outdated-code-and-how-to-fix-it-with-milvus-mcp.md">Почему ваш Vibe-кодинг генерирует устаревший код и как это исправить с помощью Milvus MCP</a></p></li>
<li><p><a href="https://milvus.io/blog/why-ai-databases-do-not-need-sql.md">Почему базам данных искусственного интеллекта не нужен SQL </a></p></li>
</ul>
