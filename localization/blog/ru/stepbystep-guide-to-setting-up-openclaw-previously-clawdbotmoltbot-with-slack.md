---
id: >-
  stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md
title: >-
  Пошаговое руководство по настройке OpenClaw (ранее Clawdbot/Moltbot) с помощью
  Slack
author: 'Min Yin, Lumina Wang'
date: 2026-02-04T00:00:00.000Z
cover: assets.zilliz.com/Open_Claw_Slack_Setup_Guide_Cover_1_11zon_3a995858a8.png
tag: tutorials
recommend: true
publishToMedium: true
tags: 'OpenClaw, Clawdbot, Moltbot, Slack, Tutorial'
meta_keywords: 'OpenClaw, Clawdbot, Moltbot, Milvus, AI Agent'
meta_title: |
  OpenClaw Tutorial: Connect to Slack for Local AI Assistant
desc: >-
  Пошаговое руководство по настройке OpenClaw с помощью Slack. Запустите
  самостоятельный ИИ-ассистент на компьютере Mac или Linux - облако не
  требуется.
origin: 'https://milvus.io/blog/openclaw-slack-setup-guide.md'
---
<p>Если на этой неделе вы заходили в технологический Twitter, Hacker News или Discord, вы это видели. Лобстер-эмодзи 🦞, скриншоты выполненных заданий и одно смелое заявление: ИИ, который не просто <em>говорит - он</em>действительно <em>говорит</em>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_1_567975a33f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>В выходные все стало еще более странным. Предприниматель Мэтт Шлихт запустил <a href="https://moltbook.com">Moltbook -</a>социальную сеть в стиле Reddit, где только агенты ИИ могут писать, а люди - только смотреть. В течение нескольких дней в ней зарегистрировалось более 1,5 миллиона агентов. Они создавали сообщества, обсуждали философию, жаловались на своих операторов-людей и даже основали собственную религию под названием "корочкафарианство". Да, действительно.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_2_b570b3e59b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Добро пожаловать в безумие OpenClaw.</p>
<p>Ажиотаж настолько реален, что акции Cloudflare подскочили на 14 % только потому, что разработчики используют ее инфраструктуру для запуска приложений. Сообщается, что продажи Mac Mini резко возросли, поскольку люди покупают специализированное оборудование для своего нового сотрудника с искусственным интеллектом. А репозиторий GitHub? Более <a href="https://github.com/openclaw/openclaw">150 000 звезд</a> всего за несколько недель.</p>
<p>Поэтому, естественно, мы должны были показать вам, как создать свой собственный экземпляр OpenClaw и подключить его к Slack, чтобы вы могли управлять своим ИИ-ассистентом из своего любимого приложения для обмена сообщениями.</p>
<h2 id="What-Is-OpenClaw" class="common-anchor-header">Что такое OpenClaw?<button data-href="#What-Is-OpenClaw" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://openclaw.ai/">OpenClaw</a> (ранее известный как Clawdbot/Moltbot) - это автономный ИИ-агент с открытым исходным кодом, который работает локально на пользовательских машинах и выполняет реальные задачи через приложения для обмена сообщениями, такие как WhatsApp, Telegram и Discord. Он автоматизирует цифровые рабочие процессы - например, управление электронной почтой, просмотр веб-страниц или планирование встреч - путем подключения к таким LLM, как Claude или ChatGPT.</p>
<p>Одним словом, это как круглосуточный цифровой помощник, который может думать, отвечать и действительно выполнять задания.</p>
<h2 id="Setting-Up-OpenClaw-as-a-Slack-Based-AI-Assistant" class="common-anchor-header">Настройка OpenClaw в качестве ИИ-помощника на базе Slack<button data-href="#Setting-Up-OpenClaw-as-a-Slack-Based-AI-Assistant" class="anchor-icon" translate="no">
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
    </button></h2><p>Представьте, что в вашем рабочем пространстве Slack есть бот, который может мгновенно отвечать на вопросы о вашем продукте, помогать в решении проблем пользователей или направлять членов команды к нужной документации - при этом никому не нужно прерывать работу. Для нас это может означать ускорение поддержки сообщества Milvus: бот, который отвечает на общие вопросы ("Как создать коллекцию?"), помогает устранить ошибки или обобщает заметки о выпуске по требованию. Для вашей команды это может быть адаптация новых инженеров, работа с внутренними часто задаваемыми вопросами или автоматизация повторяющихся задач DevOps. Варианты использования могут быть самыми разнообразными.</p>
<p>В этом руководстве мы рассмотрим основы: установим OpenClaw на вашу машину и подключим его к Slack. После этого у вас будет работающий ИИ-ассистент, который вы сможете настроить под свои нужды.</p>
<h3 id="Prerequisites" class="common-anchor-header">Необходимые условия</h3><ul>
<li><p>Компьютер Mac или Linux</p></li>
<li><p><a href="https://console.anthropic.com/">Ключ API Anthropic</a> (или доступ к Claude Code CLI)</p></li>
<li><p>Рабочее пространство Slack, где можно устанавливать приложения.</p></li>
</ul>
<p>Вот и все. Давайте приступим.</p>
<h3 id="Step-1-Install-OpenClaw" class="common-anchor-header">Шаг 1: Установите OpenClaw</h3><p>Запустите программу установки:</p>
<p>curl -fsSL https://molt.bot/install.sh | bash  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_3_fc80684811.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Когда появится запрос, выберите <strong>Да</strong>, чтобы продолжить.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_4_8004e87516.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Затем выберите режим <strong>быстрого запуска</strong>.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_5_b5803c1d89.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Choose-Your-LLM" class="common-anchor-header">Шаг 2: Выберите LLM</h3><p>Программа установки попросит вас выбрать поставщика модели. Мы используем Anthropic с Claude Code CLI для аутентификации.</p>
<ol>
<li>Выберите <strong>Anthropic</strong> в качестве провайдера  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_6_a593124f6c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="2">
<li>Завершите проверку в браузере, когда появится запрос.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_7_410c1a39d3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="3">
<li>Выберите <strong>anthropic/claude-opus-4-5-20251101</strong> в качестве модели по умолчанию  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_8_0c22bf5a16.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<h3 id="Step-3-Set-Up-Slack" class="common-anchor-header">Шаг 3: Настройте Slack</h3><p>Когда вам будет предложено выбрать канал, выберите <strong>Slack.</strong><span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_9_cd4dfa5053.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Назовите своего бота. Мы назвали своего бота "Clawdbot_Milvus".  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_10_89c79ccd0d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Теперь вам нужно создать приложение Slack и получить два токена. Вот как это сделать:  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_11_50df3aec5d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.1 Создание приложения Slack</strong></p>
<p>Перейдите на <a href="https://api.slack.com/apps?new_app=1">сайт Slack API</a> и создайте новое приложение с нуля.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_12_21987505d5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Дайте ему имя и выберите рабочее пространство, которое вы хотите использовать.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_13_7fce24b5c7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.2 Настройка разрешений бота</strong></p>
<p>На боковой панели нажмите <strong>OAuth &amp; Permissions</strong>. Прокрутите вниз до <strong>Bot Token Scopes</strong> и добавьте разрешения, необходимые вашему боту.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_14_b08d66b55a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.3 Включите режим сокетов</strong></p>
<p>Нажмите <strong>Socket Mode</strong> в боковой панели и включите его.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_15_11545f95f8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>В результате будет сгенерирован <strong>токен уровня приложения</strong> (начинается с <code translate="no">xapp-</code>). Скопируйте его в безопасное место.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_16_c446eefd7d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.4 Включите подписки на события</strong></p>
<p>Перейдите в раздел <strong>Подписки на события</strong> и включите его.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_17_98387d6226.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Затем выберите, на какие события должен подписываться ваш бот.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_18_b2a16d7786.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.5 Установите приложение</strong></p>
<p>Нажмите <strong>Install App</strong> в боковой панели, затем <strong>Request to Install</strong> (или установите напрямую, если вы являетесь администратором рабочего пространства).  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_19_a5e76d0d33.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>После одобрения вы увидите <strong>OAuth-токен пользователя бота</strong> (начинается с <code translate="no">xoxb-</code>). Скопируйте и его.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/oauth_tokens_2e75e66f89.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Configure-OpenClaw" class="common-anchor-header">Шаг 4: Настройте OpenClaw</h3><p>Вернитесь в OpenClaw CLI:</p>
<ol>
<li><p>Введите <strong>OAuth-токен пользователя бота</strong> (<code translate="no">xoxb-...</code>).</p></li>
<li><p>Введите ваш <strong>App-Level Token</strong> (<code translate="no">xapp-...</code>) <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_21_bd1629fb6a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p></li>
</ol>
<ol start="3">
<li>Выберите каналы Slack, к которым бот может получить доступ  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_22_a1b682fa84.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="4">
<li>Пока пропустите настройку навыков - вы всегда сможете добавить их позже  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_23_cc4855ecfd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="5">
<li>Выберите <strong>"Перезапустить"</strong>, чтобы применить изменения.</li>
</ol>
<h3 id="Step-5-Try-It-Out" class="common-anchor-header">Шаг 5: Испытайте его</h3><p>Зайдите в Slack и отправьте боту сообщение. Если все настроено правильно, OpenClaw ответит и будет готов выполнять задания на вашей машине.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_24_2864a88ce9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Tips" class="common-anchor-header">Советы</h3><ol>
<li>Запустите <code translate="no">clawdbot dashboard</code>, чтобы управлять настройками через веб-интерфейс  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_25_67b337b1d9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="2">
<li>Если что-то пошло не так, проверьте журналы на наличие ошибок  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_26_a62b5669ee.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<h2 id="A-Word-of-Caution" class="common-anchor-header">Слово предостережения<button data-href="#A-Word-of-Caution" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenClaw - мощная программа, и именно поэтому вы должны быть осторожны. "На самом деле делает что-то" означает, что он может выполнять реальные команды на вашей машине. В этом весь смысл, но это связано с риском.</p>
<p><strong>Хорошая новость:</strong></p>
<ul>
<li><p>Это программа с открытым исходным кодом, поэтому ее код можно проверить.</p></li>
<li><p>Он работает локально, поэтому ваши данные не находятся на чужом сервере.</p></li>
<li><p>Вы контролируете, какие у него есть разрешения.</p></li>
</ul>
<p><strong>Не очень хорошие новости:</strong></p>
<ul>
<li><p>Ввод подсказок - это реальный риск: вредоносное сообщение может заставить бота выполнить нежелательные команды.</p></li>
<li><p>Мошенники уже создали поддельные репозитории и токены OpenClaw, поэтому будьте осторожны с тем, что вы скачиваете.</p></li>
</ul>
<p><strong>Наш совет:</strong></p>
<ul>
<li><p>Не запускайте это на своей основной машине. Используйте виртуальную машину, запасной ноутбук или выделенный сервер.</p></li>
<li><p>Не давайте больше прав, чем вам нужно.</p></li>
<li><p>Пока не используйте его в производстве. Это новинка. Относитесь к нему как к эксперименту.</p></li>
<li><p>Придерживайтесь официальных источников: <a href="https://x.com/openclaw">@openclaw</a> на X и <a href="https://github.com/openclaw">OpenClaw</a>.</p></li>
</ul>
<p>Как только вы даете LLM возможность выполнять команды, 100% безопасности уже не будет. Это не проблема OpenClaw - такова природа агентного ИИ. Просто будьте умны в этом вопросе.</p>
<h2 id="Whats-Next" class="common-anchor-header">Что дальше?<button data-href="#Whats-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>Поздравляем! Теперь у вас есть локальный ИИ-ассистент, работающий на вашей собственной инфраструктуре и доступный через Slack. Ваши данные остаются вашими, и у вас есть неутомимый помощник, готовый автоматизировать повторяющиеся действия.</p>
<p>Дальше вы можете:</p>
<ul>
<li><p>Установить дополнительные <a href="https://docs.molt.bot/skills">навыки</a>, чтобы расширить возможности OpenClaw.</p></li>
<li><p>Настраивать задачи по расписанию, чтобы он работал на опережение</p></li>
<li><p>Подключить другие платформы обмена сообщениями, например Telegram или Discord.</p></li>
<li><p>Изучить экосистему <a href="https://milvus.io/">Milvus</a> на предмет возможностей поиска с помощью искусственного интеллекта.</p></li>
</ul>
<p><strong>У вас есть вопросы или вы хотите поделиться тем, что создаете?</strong></p>
<ul>
<li><p>Присоединяйтесь к <a href="https://milvus.io/slack">сообществу Milvus Slack</a>, чтобы общаться с другими разработчиками.</p></li>
<li><p>Записывайтесь на наши <a href="https://milvus.io/office-hours">офисные часы Milvus</a>, чтобы вживую пообщаться с командой в формате "вопрос-ответ".</p></li>
</ul>
<p>Счастливого взлома! 🦞</p>
