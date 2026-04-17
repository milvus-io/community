---
id: >-
  why-claude-code-feels-so-stable-a-developers-deep-dive-into-its-local-storage-design.md
title: >-
  Почему код Claude кажется таким стабильным: Глубокое погружение разработчика в
  дизайн локального хранилища
author: Bill Chen
date: 2026-01-30T00:00:00.000Z
cover: assets.zilliz.com/cover_Claudecode_storage_81155960ef.jpeg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Claude, Claude Code, Vector Database, Retreival Augmented Generation, Milvus'
meta_keywords: 'Claude Code, AI agent, AI coding assistant, Agent memory'
meta_title: |
  How Claude Code Manages Local Storage for AI Agents
desc: >-
  Глубокое погружение в хранилище Claude Code: JSONL-журналы сессий, изоляция
  проектов, многоуровневая конфигурация и снимки файлов, которые делают кодинг с
  помощью искусственного интеллекта стабильным и восстанавливаемым.
origin: >-
  https://milvus.io/blog/why-claude-code-feels-so-stable-a-developers-deep-dive-into-its-local-storage-design.md
---
<p>Код Клода в последнее время повсюду. Разработчики используют его, чтобы быстрее создавать функции, автоматизировать рабочие процессы и создавать прототипы агентов, которые действительно работают в реальных проектах. Что еще более удивительно, так это то, как много людей, не являющихся кодерами, тоже подключились к нему - создают инструменты, подключают задачи и получают полезные результаты практически без настройки. Редко можно увидеть, чтобы инструмент для кодирования ИИ так быстро распространялся среди людей разного уровня подготовки.</p>
<p>Но что действительно выделяется, так это <em>стабильность</em>. Claude Code помнит, что происходило в разных сессиях, переживает сбои без потери прогресса и ведет себя скорее как локальный инструмент разработки, чем как чат-интерфейс. Такая надежность обусловлена тем, как он работает с локальным хранилищем.</p>
<p>Вместо того чтобы рассматривать сессию кодирования как временный чат, Claude Code читает и записывает реальные файлы, хранит состояние проекта на диске и записывает каждый шаг работы агента. Сессии можно возобновлять, проверять или сворачивать без лишних раздумий, а каждый проект остается чисто изолированным, что позволяет избежать проблем с перекрестным заражением, с которыми сталкиваются многие инструменты для агентов.</p>
<p>В этом посте мы подробнее рассмотрим архитектуру хранения, лежащую в основе этой стабильности, и почему она играет такую важную роль в том, чтобы сделать Claude Code практичным для повседневной разработки.</p>
<h2 id="Challenges-Every-Local-AI-Coding-Assistant-Faces" class="common-anchor-header">Проблемы, с которыми сталкивается каждый локальный помощник по кодированию ИИ<button data-href="#Challenges-Every-Local-AI-Coding-Assistant-Faces" class="anchor-icon" translate="no">
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
    </button></h2><p>Прежде чем рассказать о том, как Claude Code подходит к хранению данных, давайте рассмотрим общие проблемы, с которыми обычно сталкиваются локальные инструменты кодирования ИИ. Они возникают естественным образом, когда помощник работает непосредственно с вашей файловой системой и сохраняет ее состояние во времени.</p>
<p><strong>1. Данные проекта перемешиваются между рабочими пространствами.</strong></p>
<p>Большинство разработчиков переключаются между несколькими репозиториями в течение дня. Если помощник переносит состояние из одного проекта в другой, становится сложнее понять его поведение и легче сделать неверные предположения. Каждый проект нуждается в собственном чистом, изолированном пространстве для состояния и истории.</p>
<p><strong>2. Аварии могут привести к потере данных.</strong></p>
<p>Во время сеанса кодирования помощник создает непрерывный поток полезных данных - редактирование файлов, вызов инструментов, промежуточные шаги. Если эти данные не сохранить сразу, то сбой или принудительный перезапуск могут уничтожить их. Надежная система записывает важные данные на диск сразу после их создания, чтобы работа не была неожиданно потеряна.</p>
<p><strong>3. Не всегда понятно, что на самом деле делал агент.</strong></p>
<p>Типичная сессия включает в себя множество мелких действий. Без четкой, упорядоченной записи этих действий трудно проследить, как помощник пришел к определенному результату, или найти шаг, на котором что-то пошло не так. Полная история делает отладку и анализ гораздо более удобными.</p>
<p><strong>4. Исправление ошибок требует слишком много усилий.</strong></p>
<p>Иногда помощник вносит изменения, которые не совсем работают. Если у вас нет встроенного способа откатить эти изменения, вам приходится вручную искать правки по всему репозиторию. Система должна автоматически отслеживать изменения, чтобы вы могли отменить их без лишней работы.</p>
<p><strong>5. Разным проектам нужны разные настройки.</strong></p>
<p>Локальные среды различаются. Для одних проектов требуются особые разрешения, инструменты или правила работы с каталогами, для других - пользовательские сценарии или рабочие процессы. Ассистент должен учитывать эти различия и позволять настраивать параметры для каждого проекта, сохраняя при этом единообразие основного поведения.</p>
<h2 id="The-Storage-Design-Principles-Behind-Claude-Code" class="common-anchor-header">Принципы проектирования хранилищ, лежащие в основе Claude Code<button data-href="#The-Storage-Design-Principles-Behind-Claude-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>Дизайн хранилища Claude Code построен на четырех простых идеях. Они могут показаться простыми, но вместе они решают практические проблемы, возникающие, когда ИИ-ассистент работает непосредственно на вашей машине и в нескольких проектах.</p>
<h3 id="1-Each-project-gets-its-own-storage" class="common-anchor-header">1. Каждый проект получает собственное хранилище.</h3><p>Claude Code привязывает все данные сессии к каталогу проекта, к которому они относятся. Это означает, что разговоры, правки и журналы остаются в том проекте, из которого они пришли, и не просачиваются в другие. Раздельное хранение данных делает поведение помощника более понятным и позволяет легко проверять или удалять данные для конкретного репозитория.</p>
<h3 id="2-Data-is-saved-to-disk-right-away" class="common-anchor-header">2. Данные сразу сохраняются на диск.</h3><p>Вместо того чтобы хранить данные о взаимодействии в памяти, Claude Code записывает их на диск сразу же после создания. Каждое событие - сообщение, вызов инструмента или обновление состояния - добавляется как новая запись. Если программа аварийно завершается или неожиданно закрывается, почти все сохраняется. Такой подход обеспечивает долговечность сессий, не создавая при этом особых сложностей.</p>
<h3 id="3-Every-action-has-a-clear-place-in-history" class="common-anchor-header">3. Каждое действие имеет четкое место в истории.</h3><p>Claude Code связывает каждое сообщение и действие инструмента с предыдущим, формируя полную последовательность. Такая упорядоченная история позволяет просмотреть, как разворачивалась сессия, и проследить шаги, которые привели к определенному результату. Для разработчиков наличие такого рода трассировки значительно облегчает отладку и понимание поведения агента.</p>
<h3 id="4-Code-edits-are-easy-to-roll-back" class="common-anchor-header">4. Правки в коде легко отменить.</h3><p>Перед тем как помощник обновляет файл, Claude Code сохраняет снимок его предыдущего состояния. Если изменение окажется неверным, вы сможете восстановить предыдущую версию, не копаясь в репозитории и не гадая, что изменилось. Эта простая система безопасности делает редактирование, управляемое ИИ, гораздо менее рискованным.</p>
<h2 id="Claude-Code-Local-Storage-Layout" class="common-anchor-header">Расположение локальных хранилищ Claude Code<button data-href="#Claude-Code-Local-Storage-Layout" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Code хранит все свои локальные данные в одном месте: в вашей домашней директории. Это делает систему предсказуемой и облегчает проверку, отладку или очистку при необходимости. Схема хранения данных строится вокруг двух основных компонентов: небольшого глобального файла конфигурации и более крупного каталога данных, в котором хранится все состояние проекта.</p>
<p><strong>Два основных компонента:</strong></p>
<ul>
<li><p><code translate="no">~/.claude.json</code>Хранит глобальную конфигурацию и ярлыки, включая сопоставления проектов, настройки сервера MCP и недавно использованные подсказки.</p></li>
<li><p><code translate="no">~/.claude/</code>Основной каталог данных, в котором Claude Code хранит беседы, сессии проекта, разрешения, плагины, навыки, историю и связанные с ними данные времени выполнения.</p></li>
</ul>
<p>Далее давайте подробнее рассмотрим эти два основных компонента.</p>
<p><strong>(1) Глобальная конфигурация</strong>: <code translate="no">~/.claude.json</code></p>
<p>Этот файл служит скорее указателем, чем хранилищем данных. В нем записано, над какими проектами вы работали, какие инструменты прикреплены к каждому проекту и какие подсказки вы недавно использовали. Сами данные разговора здесь не хранятся.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;projects&quot;</span>: {
    <span class="hljs-string">&quot;/Users/xxx/my-project&quot;</span>: {
      <span class="hljs-string">&quot;mcpServers&quot;</span>: {
        <span class="hljs-string">&quot;jarvis-tasks&quot;</span>: {
          <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;stdio&quot;</span>,
          <span class="hljs-string">&quot;command&quot;</span>: <span class="hljs-string">&quot;python&quot;</span>,
          <span class="hljs-string">&quot;args&quot;</span>: [<span class="hljs-string">&quot;/path/to/run_mcp.py&quot;</span>]
        }
      }
    }
  },
  <span class="hljs-string">&quot;recentPrompts&quot;</span>: [
    <span class="hljs-string">&quot;Fix the bug in auth module&quot;</span>,
    <span class="hljs-string">&quot;Add unit tests&quot;</span>
  ]
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) Основной каталог данных</strong>: <code translate="no">~/.claude/</code></p>
<p>Каталог <code translate="no">~/.claude/</code> - это место, где хранится большая часть локальных данных Claude Code. Его структура отражает несколько основных идей дизайна: изоляция проекта, немедленная персистентность и безопасное восстановление после ошибок.</p>
<pre><code translate="no">~/.claude/
├── settings.json                    <span class="hljs-comment"># Global settings (permissions, plugins, cleanup intervals)</span>
├── settings.local.json              <span class="hljs-comment"># Local settings (machine-specific, not committed to Git)</span>
├── history.jsonl                    <span class="hljs-comment"># Command history</span>
│
├── projects/                        <span class="hljs-comment"># 📁 Session data (organized by project, core directory)</span>
│   └── -Users-xxx-project/          <span class="hljs-comment"># Path-encoded project directory</span>
│       ├── {session-<span class="hljs-built_in">id</span>}.jsonl       <span class="hljs-comment"># Primary session data (JSONL format)</span>
│       └── agent-{agentId}.jsonl    <span class="hljs-comment"># Sub-agent session data</span>
│
├── session-env/                     <span class="hljs-comment"># Session environment variables</span>
│   └── {session-<span class="hljs-built_in">id</span>}/                <span class="hljs-comment"># Isolated by session ID</span>
│
├── skills/                          <span class="hljs-comment"># 📁 User-level skills (globally available)</span>
│   └── mac-mail/
│       └── SKILL.md
│
├── plugins/                         <span class="hljs-comment"># 📁 Plugin management</span>
│   ├── config.json                  <span class="hljs-comment"># Global plugin configuration</span>
│   ├── installed_plugins.json       <span class="hljs-comment"># List of installed plugins</span>
│   ├── known_marketplaces.json      <span class="hljs-comment"># Marketplace source configuration</span>
│   ├── cache/                       <span class="hljs-comment"># Plugin cache</span>
│   └── marketplaces/
│       └── anthropic-agent-skills/
│           ├── .claude-plugin/
│           │   └── marketplace.json
│           └── skills/
│               ├── pdf/
│               ├── docx/
│               └── frontend-design/
│
├── todos/                           <span class="hljs-comment"># Task list storage</span>
│   └── {session-<span class="hljs-built_in">id</span>}-*.json          <span class="hljs-comment"># Session-linked task files</span>
│
├── file-history/                    <span class="hljs-comment"># File edit history (stored by content hash)</span>
│   └── {content-<span class="hljs-built_in">hash</span>}/              <span class="hljs-comment"># Hash-named backup directory</span>
│
├── shell-snapshots/                 <span class="hljs-comment"># Shell state snapshots</span>
├── plans/                           <span class="hljs-comment"># Plan Mode storage</span>
├── local/                           <span class="hljs-comment"># Local tools / node_modules</span>
│   └── claude                       <span class="hljs-comment"># Claude CLI executable</span>
│   └── node_modules/                <span class="hljs-comment"># Local dependencies</span>
│
├── statsig/                         <span class="hljs-comment"># Feature flag cache</span>
├── telemetry/                       <span class="hljs-comment"># Telemetry data</span>
└── debug/                           <span class="hljs-comment"># Debug logs</span>
<button class="copy-code-btn"></button></code></pre>
<p>Эта структура намеренно проста: все, что генерирует Claude Code, живет в одном каталоге, организованном по проектам и сессиям. Скрытое состояние не разбросано по системе, и его легко проверить или очистить при необходимости.</p>
<h2 id="How-Claude-Code-Manages-Configuration" class="common-anchor-header">Как Claude Code управляет конфигурацией<button data-href="#How-Claude-Code-Manages-Configuration" class="anchor-icon" translate="no">
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
    </button></h2><p>Система конфигурирования Claude Code построена на простой идее: сохранять поведение по умолчанию на всех машинах, но при этом позволять отдельным средам и проектам настраивать то, что им нужно. Для этого в Claude Code используется трехслойная модель конфигурации. Когда одна и та же настройка встречается в нескольких местах, всегда побеждает более конкретный уровень.</p>
<h3 id="The-three-configuration-levels" class="common-anchor-header">Три уровня конфигурации</h3><p>Claude Code загружает конфигурацию в следующем порядке: от наименьшего приоритета к наибольшему:</p>
<pre><code translate="no">┌─────────────────────────────────────────┐
│    <span class="hljs-title class_">Project</span>-level configuration          │  <span class="hljs-title class_">Highest</span> priority
│    project/.<span class="hljs-property">claude</span>/settings.<span class="hljs-property">json</span>        │  <span class="hljs-title class_">Project</span>-specific, overrides other configs
├─────────────────────────────────────────┤
│    <span class="hljs-title class_">Local</span> configuration                  │  <span class="hljs-title class_">Machine</span>-specific, not version-controlled
│    ~<span class="hljs-regexp">/.claude/</span>settings.<span class="hljs-property">local</span>.<span class="hljs-property">json</span>        │  <span class="hljs-title class_">Overrides</span> <span class="hljs-variable language_">global</span> configuration
├─────────────────────────────────────────┤
│    <span class="hljs-title class_">Global</span> configuration                 │  <span class="hljs-title class_">Lowest</span> priority
│    ~<span class="hljs-regexp">/.claude/</span>settings.<span class="hljs-property">json</span>              │  <span class="hljs-title class_">Base</span> <span class="hljs-keyword">default</span> configuration
└─────────────────────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<p>Можно представить, что все начинается с глобальных настроек по умолчанию, затем применяются настройки, специфичные для конкретной машины, и, наконец, применяются правила, специфичные для проекта.</p>
<p>Далее мы подробно рассмотрим каждый уровень конфигурации.</p>
<p><strong>(1) Глобальная конфигурация</strong>: <code translate="no">~/.claude/settings.json</code></p>
<p>Глобальная конфигурация определяет поведение по умолчанию для Claude Code во всех проектах. Здесь вы устанавливаете базовые разрешения, включаете плагины и настраиваете поведение очистки.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;<span class="hljs-variable">$schema</span>&quot;</span>: <span class="hljs-string">&quot;https://json.schemastore.org/claude-code-settings.json&quot;</span>,
  <span class="hljs-string">&quot;permissions&quot;</span>: {
    <span class="hljs-string">&quot;allow&quot;</span>: [<span class="hljs-string">&quot;Read(**)&quot;</span>, <span class="hljs-string">&quot;Bash(npm:*)&quot;</span>],
    <span class="hljs-string">&quot;deny&quot;</span>: [<span class="hljs-string">&quot;Bash(rm -rf:*)&quot;</span>],
    <span class="hljs-string">&quot;ask&quot;</span>: [<span class="hljs-string">&quot;Edit&quot;</span>, <span class="hljs-string">&quot;Write&quot;</span>]
  },
  <span class="hljs-string">&quot;enabledPlugins&quot;</span>: {
    <span class="hljs-string">&quot;document-skills@anthropic-agent-skills&quot;</span>: <span class="hljs-literal">true</span>
  },
  <span class="hljs-string">&quot;cleanupPeriodDays&quot;</span>: 30
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) Локальная конфигурация</strong>: <code translate="no">~/.claude/settings.local.json</code></p>
<p>Локальная конфигурация предназначена только для одной машины. Она не предназначена для совместного использования или проверки в системе контроля версий. Это делает ее хорошим местом для ключей API, локальных инструментов или специфических для среды разрешений.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;permissions&quot;</span>: {
    <span class="hljs-string">&quot;allow&quot;</span>: [<span class="hljs-string">&quot;Bash(git:*)&quot;</span>, <span class="hljs-string">&quot;Bash(docker:*)&quot;</span>]
  },
  <span class="hljs-string">&quot;env&quot;</span>: {
    <span class="hljs-string">&quot;ANTHROPIC_API_KEY&quot;</span>: <span class="hljs-string">&quot;sk-ant-xxx&quot;</span>
  }
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>(3) Конфигурация уровня проекта</strong>: <code translate="no">project/.claude/settings.json</code></p>
<p>Конфигурация на уровне проекта применяется только к одному проекту и имеет наивысший приоритет. Здесь вы определяете правила, которые всегда должны применяться при работе в этом хранилище.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;permissions&quot;</span>: {
    <span class="hljs-string">&quot;allow&quot;</span>: [<span class="hljs-string">&quot;Bash(pytest:*)&quot;</span>]
  }
}
<button class="copy-code-btn"></button></code></pre>
<p>Когда уровни конфигурации определены, следующий вопрос заключается в том <strong>, как Claude Code на самом деле разрешает конфигурацию и разрешения во время выполнения.</strong></p>
<p><strong>Claude Code</strong> применяет конфигурацию в три слоя: он начинает с глобальных настроек по умолчанию, затем применяет специфические для машины переопределения и, наконец, применяет специфические для проекта правила. Если один и тот же параметр встречается в нескольких местах, приоритет отдается наиболее специфической конфигурации.</p>
<p>Разрешения следуют в фиксированном порядке оценки:</p>
<ol>
<li><p><strong>запретить</strong> - всегда блокирует</p></li>
<li><p><strong>спрашивать</strong> - требует подтверждения</p></li>
<li><p><strong>разрешить</strong> - выполняется автоматически</p></li>
<li><p><strong>по умолчанию</strong> - применяется только в том случае, если ни одно правило не подходит</p></li>
</ol>
<p>Это обеспечивает безопасность системы по умолчанию, но при этом дает проектам и отдельным машинам необходимую гибкость.</p>
<h2 id="Session-Storage-How-Claude-Code-Persists-Core-Interaction-Data" class="common-anchor-header">Хранение сессий: Как Claude Code сохраняет основные данные о взаимодействии<button data-href="#Session-Storage-How-Claude-Code-Persists-Core-Interaction-Data" class="anchor-icon" translate="no">
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
    </button></h2><p>В <strong>Claude Code</strong> сессии являются основной единицей данных. В сессию записывается все взаимодействие между пользователем и ИИ, включая сам разговор, вызовы инструментов, изменения файлов и сопутствующий контекст. То, как хранятся сессии, напрямую влияет на надежность, отлаживаемость и общую безопасность системы.</p>
<h3 id="Keep-session-data-separate-for-each-project" class="common-anchor-header">Храните данные о сеансах отдельно для каждого проекта</h3><p>После определения сессий возникает следующий вопрос: как <strong>Claude Code</strong> хранит их таким образом, чтобы данные были упорядочены и изолированы.</p>
<p><strong>Claude Code</strong> изолирует данные сессий по проектам. Сессии каждого проекта хранятся в директории, полученной из пути к файлу проекта.</p>
<p>Путь хранения следует этому шаблону:</p>
<p><code translate="no">~/.claude/projects/ + path-encoded project directory</code></p>
<p>Чтобы создать правильное имя каталога, специальные символы, такие как <code translate="no">/</code>, пробелы и <code translate="no">~</code>, заменяются на <code translate="no">-</code>.</p>
<p>Например:</p>
<p><code translate="no">/Users/bill/My Project → -Users-bill-My-Project</code></p>
<p>Такой подход гарантирует, что данные сессий из разных проектов никогда не смешаются, и ими можно управлять или удалять по отдельным проектам.</p>
<h3 id="Why-sessions-are-stored-in-JSONL-format" class="common-anchor-header">Почему сессии хранятся в формате JSONL</h3><p><strong>Claude Code</strong> хранит данные о сессиях, используя JSONL (JSON Lines) вместо стандартного JSON.</p>
<p>В традиционном JSON-файле все сообщения объединяются в одну большую структуру, что означает необходимость читать и переписывать весь файл при каждом его изменении. В отличие от этого, JSONL хранит каждое сообщение как отдельную строку в файле. Одна строка равна одному сообщению, без внешней обертки.</p>
<table>
<thead>
<tr><th>Аспект</th><th>Стандартный JSON</th><th>JSONL (JSON Lines)</th></tr>
</thead>
<tbody>
<tr><td>Как хранятся данные</td><td>Одна большая структура</td><td>Одно сообщение в строке</td></tr>
<tr><td>Когда сохраняются данные</td><td>Обычно в конце</td><td>Немедленно, в каждом сообщении</td></tr>
<tr><td>Последствия сбоя</td><td>Весь файл может разрушиться</td><td>Пострадает только последняя строка</td></tr>
<tr><td>Запись новых данных</td><td>Переписать весь файл</td><td>Добавление одной строки</td></tr>
<tr><td>Использование памяти</td><td>Загрузить все</td><td>Читать строку за строкой</td></tr>
</tbody>
</table>
<p>JSONL работает лучше по нескольким ключевым параметрам:</p>
<ul>
<li><p><strong>Немедленное сохранение:</strong> Каждое сообщение записывается на диск сразу после создания, вместо того чтобы ждать завершения сеанса.</p></li>
<li><p><strong>Устойчивость к сбоям:</strong> при сбое программы может быть потеряно только последнее незавершенное сообщение. Все, что было написано до этого, останется нетронутым.</p></li>
<li><p><strong>Быстрое добавление:</strong> Новые сообщения добавляются в конец файла без чтения или перезаписи существующих данных.</p></li>
<li><p><strong>Низкое потребление памяти:</strong> Файлы сессий можно читать по одной строке за раз, поэтому весь файл не нужно загружать в память.</p></li>
</ul>
<p>Упрощенный файл сессии JSONL выглядит следующим образом:</p>
<pre><code translate="no">{<span class="hljs-string">&quot;type&quot;</span>:<span class="hljs-string">&quot;user&quot;</span>,<span class="hljs-string">&quot;message&quot;</span>:{<span class="hljs-string">&quot;role&quot;</span>:<span class="hljs-string">&quot;user&quot;</span>,<span class="hljs-string">&quot;content&quot;</span>:<span class="hljs-string">&quot;Hello&quot;</span>},<span class="hljs-string">&quot;timestamp&quot;</span>:<span class="hljs-string">&quot;2026-01-05T10:00:00Z&quot;</span>}
{<span class="hljs-string">&quot;type&quot;</span>:<span class="hljs-string">&quot;assistant&quot;</span>,<span class="hljs-string">&quot;message&quot;</span>:{<span class="hljs-string">&quot;role&quot;</span>:<span class="hljs-string">&quot;assistant&quot;</span>,<span class="hljs-string">&quot;content&quot;</span>:[{<span class="hljs-string">&quot;type&quot;</span>:<span class="hljs-string">&quot;text&quot;</span>,<span class="hljs-string">&quot;text&quot;</span>:<span class="hljs-string">&quot;Hi!&quot;</span>}]}}
{<span class="hljs-string">&quot;type&quot;</span>:<span class="hljs-string">&quot;user&quot;</span>,<span class="hljs-string">&quot;message&quot;</span>:{<span class="hljs-string">&quot;role&quot;</span>:<span class="hljs-string">&quot;user&quot;</span>,<span class="hljs-string">&quot;content&quot;</span>:<span class="hljs-string">&quot;Help me fix this bug&quot;</span>}}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Session-message-types" class="common-anchor-header">Типы сообщений сессии</h3><p>В файле сессии записывается все, что происходит во время взаимодействия с Claude Code. Чтобы сделать это наглядно, он использует различные типы сообщений для разных типов событий.</p>
<ul>
<li><p><strong>Пользовательские сообщения</strong> представляют собой новые данные, поступающие в систему. Сюда входит не только то, что набирает пользователь, но и результаты, возвращаемые инструментами, например вывод команды оболочки. С точки зрения ИИ, и то, и другое - это входные данные, на которые он должен реагировать.</p></li>
<li><p><strong>Сообщения помощника</strong> фиксируют то, что Клод делает в ответ. Эти сообщения включают рассуждения ИИ, текст, который он генерирует, и любые инструменты, которые он решает использовать. В них также записываются подробности использования, например количество токенов, чтобы составить полную картину взаимодействия.</p></li>
<li><p><strong>Снимки истории файлов</strong> - это контрольные точки безопасности, создаваемые до того, как Клод изменит какие-либо файлы. Сохраняя сначала исходное состояние файла, Claude Code позволяет отменить изменения, если что-то пойдет не так.</p></li>
<li><p><strong>Резюме</strong> представляют собой краткий обзор сессии и связаны с конечным результатом. С их помощью можно понять, о чем шла речь в сессии, не переигрывая каждый шаг.</p></li>
</ul>
<p>Вместе эти типы сообщений фиксируют не только разговор, но и всю последовательность действий и эффектов, которые происходят во время сеанса.</p>
<p>Чтобы сделать это более конкретным, давайте рассмотрим конкретные примеры пользовательских сообщений и сообщений помощника.</p>
<p><strong>(1) Пример сообщений пользователя:</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>,
  <span class="hljs-string">&quot;uuid&quot;</span>: <span class="hljs-string">&quot;7d90e1c9-e727-4291-8eb9-0e7b844c4348&quot;</span>,
  <span class="hljs-string">&quot;parentUuid&quot;</span>: <span class="hljs-literal">null</span>,
  <span class="hljs-string">&quot;sessionId&quot;</span>: <span class="hljs-string">&quot;e5d52290-e2c1-41d6-8e97-371401502fdf&quot;</span>,
  <span class="hljs-string">&quot;timestamp&quot;</span>: <span class="hljs-string">&quot;2026-01-05T10:00:00.000Z&quot;</span>,
  <span class="hljs-string">&quot;message&quot;</span>: {
    <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>,
    <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Analyze the architecture of this project&quot;</span>
  },
  <span class="hljs-string">&quot;cwd&quot;</span>: <span class="hljs-string">&quot;/Users/xxx/project&quot;</span>,
  <span class="hljs-string">&quot;gitBranch&quot;</span>: <span class="hljs-string">&quot;main&quot;</span>,
  <span class="hljs-string">&quot;version&quot;</span>: <span class="hljs-string">&quot;2.0.76&quot;</span>
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) Пример сообщений помощника:</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;assistant&quot;</span>,
  <span class="hljs-string">&quot;uuid&quot;</span>: <span class="hljs-string">&quot;e684816e-f476-424d-92e3-1fe404f13212&quot;</span>,
  <span class="hljs-string">&quot;parentUuid&quot;</span>: <span class="hljs-string">&quot;7d90e1c9-e727-4291-8eb9-0e7b844c4348&quot;</span>,
  <span class="hljs-string">&quot;message&quot;</span>: {
    <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;assistant&quot;</span>,
    <span class="hljs-string">&quot;model&quot;</span>: <span class="hljs-string">&quot;claude-opus-4-5-20251101&quot;</span>,
    <span class="hljs-string">&quot;content&quot;</span>: [
      {
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;thinking&quot;</span>,
        <span class="hljs-string">&quot;thinking&quot;</span>: <span class="hljs-string">&quot;The user wants to understand the project architecture, so I need to check the directory structure first...&quot;</span>
      },
      {
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>,
        <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Let me take a look at the project structure first.&quot;</span>
      },
      {
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;tool_use&quot;</span>,
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-string">&quot;toolu_01ABC&quot;</span>,
        <span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;Bash&quot;</span>,
        <span class="hljs-string">&quot;input&quot;</span>: {<span class="hljs-string">&quot;command&quot;</span>: <span class="hljs-string">&quot;ls -la&quot;</span>}
      }
    ],
    <span class="hljs-string">&quot;usage&quot;</span>: {
      <span class="hljs-string">&quot;input_tokens&quot;</span>: <span class="hljs-number">1500</span>,
      <span class="hljs-string">&quot;output_tokens&quot;</span>: <span class="hljs-number">200</span>,
      <span class="hljs-string">&quot;cache_read_input_tokens&quot;</span>: <span class="hljs-number">50000</span>
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-Session-Messages-Are-Linked" class="common-anchor-header">Как связаны сообщения сеанса</h3><p>Claude Code не хранит сообщения сессии в виде отдельных записей. Вместо этого он связывает их вместе, чтобы сформировать четкую цепочку событий. Каждое сообщение содержит уникальный идентификатор (<code translate="no">uuid</code>) и ссылку на сообщение, которое пришло до него (<code translate="no">parentUuid</code>). Это позволяет понять не только, что произошло, но и почему это произошло.</p>
<p>Сессия начинается с пользовательского сообщения, с которого начинается цепочка. Каждый ответ от Claude указывает на сообщение, которое его вызвало. Вызовы инструментов и их результаты добавляются таким же образом, причем каждый шаг связан с предыдущим. Когда сессия заканчивается, к последнему сообщению прикрепляется резюме.</p>
<p>Поскольку каждый шаг связан, Claude Code может воспроизвести всю последовательность действий и понять, как был получен результат, что значительно упрощает отладку и анализ.</p>
<h2 id="Making-Code-Changes-Easy-to-Undo-with-File-Snapshots" class="common-anchor-header">Изменения кода легко отменить с помощью снимков файлов<button data-href="#Making-Code-Changes-Easy-to-Undo-with-File-Snapshots" class="anchor-icon" translate="no">
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
    </button></h2><p>Изменения, генерируемые искусственным интеллектом, не всегда корректны, а иногда они идут совершенно не в том направлении. Чтобы сделать эти изменения безопасными для экспериментов, Claude Code использует простую систему снимков, которая позволяет отменять правки, не копаясь в диффах и не очищая файлы вручную.</p>
<p>Идея проста: <strong>прежде чем Claude Code изменит файл, он сохраняет копию исходного содержимого.</strong> Если правка окажется ошибочной, система сможет мгновенно восстановить предыдущую версию.</p>
<h3 id="What-is-a-file-history-snapshot" class="common-anchor-header">Что такое <em>снимок истории файла</em>?</h3><p><em>Снимок истории файлов</em> - это контрольная точка, создаваемая перед изменением файлов. Он записывает исходное содержимое каждого файла, который <strong>Claude</strong> собирается редактировать. Эти снимки служат источником данных для операций отмены и отката.</p>
<p>Когда пользователь отправляет сообщение, которое может изменить файлы, <strong>Claude Code</strong> создает пустой снимок для этого сообщения. Перед редактированием система создает резервную копию исходного содержимого каждого целевого файла в снимок, а затем применяет правки непосредственно на диск. Если пользователь активирует <em>отмену</em>, <strong>Claude Code</strong> восстанавливает сохраненное содержимое и перезаписывает измененные файлы.</p>
<p>На практике жизненный цикл отменяемой правки выглядит следующим образом:</p>
<ol>
<li><p><strong>Пользователь отправляет сообщениеКлод</strong>Код создает новую, пустую запись <code translate="no">file-history-snapshot</code>.</p></li>
<li><p><strong>Клод готовится к изменению файловСистема</strong>определяет, какие файлы будут редактироваться, и создает резервную копию их исходного содержимого в <code translate="no">trackedFileBackups</code>.</p></li>
<li><p><strong>Клод выполняет редактированиеОперации редактирования</strong>и записи выполняются, и измененное содержимое записывается на диск.</p></li>
<li><p><strong>Пользователь запускает отменуПользователь</strong>нажимает <strong>Esc + Esc</strong>, сигнализируя, что изменения должны быть отменены.</p></li>
<li><p><strong>Оригинальное содержимое восстанавливаетсяКод Клода</strong>считывает сохраненное содержимое с сайта <code translate="no">trackedFileBackups</code> и перезаписывает текущие файлы, завершая отмену.</p></li>
</ol>
<h3 id="Why-Undo-Works-Snapshots-Save-the-Old-Version" class="common-anchor-header">Почему отмена работает: Снимки сохраняют старую версию</h3><p>Отмена в Claude Code работает потому, что система сохраняет <em>исходное</em> содержимое файла до внесения изменений.</p>
<p>Вместо того чтобы пытаться отменить изменения постфактум, Claude Code использует более простой подход: он копирует файл в том виде, в котором он существовал <em>до</em> внесения изменений, и сохраняет эту копию в <code translate="no">trackedFileBackups</code>. Когда пользователь запускает отмену, система восстанавливает эту сохраненную версию и перезаписывает отредактированный файл.</p>
<p>На приведенной ниже диаграмме пошагово показан этот процесс:</p>
<pre><code translate="no">┌─────────────────────────┐
│    before edit,  app.py │
│    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;old&quot;</span>)         │───────→  Backed up into snapshot trackedFileBackups
└─────────────────────────┘

↓

┌──────────────────────────┐
│   After Claude edits     │
│    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;new&quot;</span>)          │───────→  Written to disk (overwrites the original file)
└──────────────────────────┘

↓

┌──────────────────────────┐
│    User triggers undo    │
│    Press   Esc + Esc     │───────→ Restore <span class="hljs-string">&quot;old&quot;</span> content to disk <span class="hljs-keyword">from</span> snapshot
└──────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<h3 id="What-a-file-History-snapshot-Looks-Like-Internally" class="common-anchor-header">Как выглядит <em>снимок истории файла</em> изнутри</h3><p>Сам снимок хранится в виде структурированной записи. Он содержит метаданные о сообщении пользователя, времени создания снимка и, что особенно важно, карту файлов с их исходным содержимым.</p>
<p>В примере ниже показана одна запись <code translate="no">file-history-snapshot</code>, созданная до того, как Клод отредактирует какие-либо файлы. Каждая запись в <code translate="no">trackedFileBackups</code> хранит содержимое файла <em>до редактирования</em>, которое впоследствии используется для восстановления файла при отмене.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;file-history-snapshot&quot;</span>,
  <span class="hljs-string">&quot;messageId&quot;</span>: <span class="hljs-string">&quot;7d90e1c9-e727-4291-8eb9-0e7b844c4348&quot;</span>,
  <span class="hljs-string">&quot;snapshot&quot;</span>: {
    <span class="hljs-string">&quot;messageId&quot;</span>: <span class="hljs-string">&quot;7d90e1c9-e727-4291-8eb9-0e7b844c4348&quot;</span>,
    <span class="hljs-string">&quot;trackedFileBackups&quot;</span>: {
      <span class="hljs-string">&quot;/path/to/file1.py&quot;</span>: <span class="hljs-string">&quot;Original file content\ndef hello():\n    print(&#x27;old&#x27;)&quot;</span>,
      <span class="hljs-string">&quot;/path/to/file2.js&quot;</span>: <span class="hljs-string">&quot;// Original content...&quot;</span>
    },
    <span class="hljs-string">&quot;timestamp&quot;</span>: <span class="hljs-string">&quot;2026-01-05T10:00:00.000Z&quot;</span>
  },
  <span class="hljs-string">&quot;isSnapshotUpdate&quot;</span>: <span class="hljs-literal">false</span>
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Where-Snapshots-Are-Stored-and-How-Long-They-Are-Kept" class="common-anchor-header">Где хранятся моментальные снимки и как долго они хранятся</h3><ul>
<li><p><strong>Где хранятся метаданные моментальных снимков</strong>: Записи моментальных снимков привязываются к определенной сессии и сохраняются в виде JSONL-файлов по адресу<code translate="no">~/.claude/projects/-path-to-project/{session-id}.jsonl</code>.</p></li>
<li><p><strong>Где хранится исходное содержимое файлов</strong>: Содержимое каждого файла до редактирования хранится отдельно по хэшу содержимого в разделе<code translate="no">~/.claude/file-history/{content-hash}/</code>.</p></li>
<li><p><strong>Как долго хранятся моментальные снимки по умолчанию</strong>: Данные снимков хранятся в течение 30 дней, в соответствии с глобальной настройкой <code translate="no">cleanupPeriodDays</code>.</p></li>
<li><p><strong>Как изменить период хранения</strong>: Количество дней хранения можно настроить с помощью поля <code translate="no">cleanupPeriodDays</code> в <code translate="no">~/.claude/settings.json</code>.</p></li>
</ul>
<h3 id="Related-Commands" class="common-anchor-header">Связанные команды</h3><table>
<thead>
<tr><th>Команда / действие</th><th>Описание</th></tr>
</thead>
<tbody>
<tr><td>Esc + Esc</td><td>Отмена последнего раунда редактирования файла (наиболее часто используемая)</td></tr>
<tr><td>/rewind</td><td>Возврат к ранее указанной контрольной точке (моментальному снимку)</td></tr>
<tr><td>/diff</td><td>Просмотр различий между текущим файлом и резервной копией моментального снимка</td></tr>
</tbody>
</table>
<h2 id="Other-Important-Directories" class="common-anchor-header">Другие важные директории<button data-href="#Other-Important-Directories" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>(1) plugins/ - Управление плагинами</strong></p>
<p>В директории <code translate="no">plugins/</code> хранятся дополнения, которые предоставляют Claude Code дополнительные возможности.</p>
<p>В этой директории хранятся сведения о том, какие <em>плагины</em> установлены, откуда они взяты и какие дополнительные способности дают эти плагины. Здесь также хранятся локальные копии загруженных плагинов, чтобы не искать их снова.</p>
<pre><code translate="no">~/.claude/plugins/
├── config.json
│   Global plugin configuration (e.g., <span class="hljs-built_in">enable</span>/disable rules)
├── installed_plugins.json
│   List of installed plugins (including version and status)
├── known_marketplaces.json
│   Plugin marketplace <span class="hljs-built_in">source</span> configuration (e.g., Anthropic official marketplace)
├── cache/
│   Plugin download cache (avoids repeated downloads)
└── marketplaces/
    Marketplace <span class="hljs-built_in">source</span> storage
    └── anthropic-agent-skills/
        Official plugin marketplace
        ├── .claude-plugin/
        │   └── marketplace.json
        │       Marketplace metadata
        └── skills/
            Skills provided by the marketplace
            ├── pdf/
            │   PDF-related skills
            ├── docx/
            │   Word document processing skills
            └── frontend-design/
                Frontend design skills
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) skills/ - место хранения и применения навыков</strong></p>
<p>В Claude Code навык - это небольшая способность многократного использования, которая помогает Клоду выполнять определенную задачу, например работать с PDF-файлами, редактировать документы или следовать рабочему процессу кодирования.</p>
<p>Не все навыки доступны повсеместно. Некоторые из них применяются глобально, а другие ограничены одним проектом или предоставляются плагином. Claude Code хранит навыки в разных местах, чтобы контролировать, где каждый из них может быть использован.</p>
<p>В приведенной ниже иерархии показано, как навыки распределяются по уровням: от глобально доступных до специфических для конкретного проекта и предоставляемых плагинами.</p>
<table>
<thead>
<tr><th>Уровень</th><th>Место хранения</th><th>Описание</th></tr>
</thead>
<tbody>
<tr><td>Пользователь</td><td>~/.claude/skills/</td><td>Глобально доступен, доступен для всех проектов</td></tr>
<tr><td>Проект</td><td>project/.claude/skills/</td><td>Доступно только для текущего проекта, настройка под конкретный проект</td></tr>
<tr><td>Плагин</td><td>~/.claude/plugins/marketplaces/*/skills/</td><td>Устанавливается вместе с плагинами, зависит от статуса включения плагинов</td></tr>
</tbody>
</table>
<p><strong>(3) todos/ - Хранилище списков задач</strong></p>
<p>В каталоге <code translate="no">todos/</code> хранятся списки задач, которые Клод создает для отслеживания работы во время разговора, например, шаги, которые нужно выполнить, элементы в процессе выполнения и завершенные задачи.</p>
<p>Списки задач сохраняются в виде JSON-файлов в каталоге<code translate="no">~/.claude/todos/{session-id}-*.json</code>.В названии каждого файла указан идентификатор сессии, который привязывает список задач к конкретному разговору.</p>
<p>Содержимое этих файлов поступает из инструмента <code translate="no">TodoWrite</code> и включает основную информацию о задаче, такую как описание задачи, текущий статус, приоритет и связанные метаданные.</p>
<p><strong>(4) local/ - Локальная среда выполнения и инструменты</strong></p>
<p>Каталог <code translate="no">local/</code> содержит основные файлы Claude Code, необходимые для работы на вашей машине.</p>
<p>Сюда входит исполняемый файл командной строки <code translate="no">claude</code> и каталог <code translate="no">node_modules/</code>, содержащий его зависимости от времени выполнения. Благодаря локальности этих компонентов Claude Code может работать независимо, не завися от внешних служб или общесистемных установок.</p>
<p><strong>（5）Дополнительные вспомогательные каталоги</strong></p>
<ul>
<li><p><strong>shell-snapshots/:</strong> Хранит снимки состояния сеанса оболочки (например, текущий каталог и переменные окружения), что позволяет откатывать операции оболочки.</p></li>
<li><p><strong>plans/:</strong> Хранит планы выполнения, сгенерированные режимом Plan Mode (например, пошаговое разбиение многоэтапных задач программирования).</p></li>
<li><p><strong>statsig/:</strong> Кэширует конфигурации флагов функций (например, включены ли новые функции), чтобы сократить количество повторных запросов.</p></li>
<li><p><strong>telemetry/:</strong> Хранит анонимные телеметрические данные (например, частоту использования функций) для оптимизации продукта.</p></li>
<li><p><strong>debug/:</strong> Хранит журналы отладки (включая стеки ошибок и трассировки выполнения) для помощи в устранении неполадок.</p></li>
</ul>
<h2 id="Conclusion" class="common-anchor-header">Заключение<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>После изучения того, как Claude Code хранит и управляет всем локально, картина становится довольно ясной: инструмент чувствует себя стабильно, потому что его основа прочна. Ничего вычурного - просто продуманная инженерия. У каждого проекта есть свое место, каждое действие записывается, а правки файлов резервируются до того, как что-то изменится. Это тот тип дизайна, который спокойно выполняет свою работу и позволяет вам сосредоточиться на своей.</p>
<p>Больше всего мне нравится то, что здесь нет ничего мистического. Claude Code работает хорошо, потому что основы сделаны правильно. Если вы когда-нибудь пытались создать агент, который работает с реальными файлами, вы знаете, как легко все разваливается - состояние смешивается, сбои стирают прогресс, а отмена становится угадайкой. Claude Code позволяет избежать всего этого благодаря простой, последовательной и трудноразрешимой модели хранения.</p>
<p>Для команд, создающих локальные или локальные ИИ-агенты, особенно в безопасных средах, этот подход показывает, как надежное хранение и персистентность делают инструменты ИИ надежными и практичными для повседневной разработки.</p>
<p>Если вы разрабатываете локальные или локальные агенты ИИ и хотите обсудить архитектуру хранения, дизайн сессий или безопасный откат более подробно, присоединяйтесь к нашему <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">каналу в Slack</a>. Вы также можете заказать 20-минутную индивидуальную встречу через <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a>, чтобы получить индивидуальные рекомендации.</p>
