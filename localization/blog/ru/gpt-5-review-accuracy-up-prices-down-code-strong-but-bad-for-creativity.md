---
id: gpt-5-review-accuracy-up-prices-down-code-strong-but-bad-for-creativity.md
title: 'Обзор GPT-5: Точность выше, цены ниже, код сильный - но плохой для творчества'
author: Lumina Wang
date: 2025-08-08T00:00:00.000Z
cover: assets.zilliz.com/gpt_5_review_7df71f395a.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, OpenAI, gpt-5'
meta_keywords: 'Milvus, gpt-5, openai, chatgpt'
meta_title: |
  GPT-5 Review: Accuracy Up, Prices Down, Code Strong, Bad Creativity
desc: >-
  Для разработчиков, особенно для тех, кто создает агентов и конвейеры RAG, этот
  выпуск может стать самым полезным обновлением.
origin: >-
  https://milvus.io/blog/gpt-5-review-accuracy-up-prices-down-code-strong-but-bad-for-creativity.md
---
<p><strong>После нескольких месяцев спекуляций OpenAI наконец-то выпустила</strong> <a href="https://openai.com/gpt-5/"><strong>GPT-5</strong></a><strong>.</strong> Модель не является таким креативным ударом молнии, каким был GPT-4, но для разработчиков, особенно для тех, кто создает агентов и конвейеры RAG, этот релиз может стать самым полезным обновлением.</p>
<p><strong>TL;DR для разработчиков:</strong> GPT-5 унифицирует архитектуры, повышает производительность мультимодального ввода-вывода, снижает количество фактических ошибок, расширяет контекст до 400 тыс. токенов и делает доступным крупномасштабное использование. Однако креативность и литературное чутье заметно отступили на второй план.</p>
<h2 id="What’s-New-Under-the-Hood" class="common-anchor-header">Что нового под капотом?<button data-href="#What’s-New-Under-the-Hood" class="anchor-icon" translate="no">
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
<li><p><strong>Унифицированное ядро</strong> - объединяет цифровые серии GPT с моделями рассуждений серии o, обеспечивая рассуждения с длинной цепочкой и мультимодальные рассуждения в единой архитектуре.</p></li>
<li><p><strong>Мультимодальность полного спектра</strong> - ввод/вывод текста, изображения, аудио и видео в рамках одной модели.</p></li>
<li><p><strong>Значительный прирост точности</strong>:</p>
<ul>
<li><p><code translate="no">gpt-5-main</code>: 44 % меньше фактических ошибок по сравнению с GPT-4o.</p></li>
<li><p><code translate="no">gpt-5-thinking</code>: на 78 % меньше фактических ошибок по сравнению с o3.</p></li>
</ul></li>
<li><p><strong>Повышение уровня владения доменными навыками</strong> - более сильные показатели в генерации кода, математических рассуждениях, консультациях по вопросам здоровья и структурированном письме; значительно уменьшилось количество галлюцинаций.</p></li>
</ul>
<p>Наряду с GPT-5 OpenAI также выпустила <strong>три дополнительных варианта</strong>, каждый из которых оптимизирован под разные нужды:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt_5_family_99a9bee18a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<table>
<thead>
<tr><th><strong>Модель</strong></th><th><strong>Описание</strong></th><th><strong>Вход / $ за 1 млн токенов</strong></th><th><strong>Выход / $ за 1 млн токенов</strong></th><th><strong>Обновление знаний</strong></th></tr>
</thead>
<tbody>
<tr><td>gpt-5</td><td>Основная модель, длинноцепочечные рассуждения + полный мультимодальный</td><td>$1.25</td><td>$10.00</td><td>2024-10-01</td></tr>
<tr><td>gpt-5-chat</td><td>Эквивалент gpt-5, используется в беседах ChatGPT</td><td>-</td><td>-</td><td>2024-10-01</td></tr>
<tr><td>gpt-5-mini</td><td>На 60% дешевле, сохраняет ~90% производительности программирования</td><td>$0.25</td><td>$2.00</td><td>2024-05-31</td></tr>
<tr><td>gpt-5-nano</td><td>Edge/offline, 32K контекста, задержка &lt;40 мс</td><td>$0.05</td><td>$0.40</td><td>2024-05-31</td></tr>
</tbody>
</table>
<p>GPT-5 побил рекорды в 25 категориях бенчмарков - от восстановления кода до мультимодальных рассуждений и медицинских задач - с постоянным повышением точности.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmark_1_8ebf1bed4b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmark_2_c43781126f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Why-Developers-Should-Care--Especially-for-RAG--Agents" class="common-anchor-header">Почему разработчикам стоит обратить внимание - особенно для RAG и агентов<button data-href="#Why-Developers-Should-Care--Especially-for-RAG--Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Наши практические тесты показывают, что этот выпуск - тихая революция для Retrieval-Augmented Generation и рабочих процессов, управляемых агентами.</p>
<ol>
<li><p><strong>Снижение цен</strong> делает эксперименты жизнеспособными - входная стоимость API: <strong><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>1,</mn><mi>25permilliontokens</mi><mo separator="true">∗∗∗;</mo><mi>outputcost</mi><mo>:∗∗1</mo></mrow><annotation encoding="application/x-tex">,25 за миллион токенов**; выходная стоимость: **</annotation></semantics></math></span></span></strong><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span> 1 <strong><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">,</span><span class="mord mathnormal">25permilliontokens</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">∗</span></span></span></span></strong><span class="mspace" style="margin-right:0.2222em;"></span> <strong><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8095em;vertical-align:-0.1944em;"></span><span class="mpunct"> ∗;</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal">outputcost</span><span class="mspace" style="margin-right:0.2778em;"></span></span></span></span></strong>: <strong><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.4653em;"></span><span class="mord">∗∗10</span></span></span></span></strong>.</p></li>
<li><p><strong>Контекстное окно размером 400k</strong> (против 128k в o3/4o) позволяет поддерживать состояние в сложных многоступенчатых рабочих процессах агентов без измельчения контекста.</p></li>
<li><p><strong>Меньше галлюцинаций и лучшее использование инструментов</strong> - поддержка многоступенчатых цепочек вызовов инструментов, обработка сложных нестандартных задач и повышение надежности выполнения.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt_tool_call_e6a86fc59c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Not-Without-Flaws" class="common-anchor-header">Не без недостатков<button data-href="#Not-Without-Flaws" class="anchor-icon" translate="no">
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
    </button></h2><p>Несмотря на технические достижения, GPT-5 все еще демонстрирует явные ограничения.</p>
<p>На презентации OpenAI был показан слайд с причудливым расчетом <em>52,8 &gt; 69,1 = 30,8</em>, а в наших собственных тестах модель уверенно повторила объяснение "эффекта Бернулли" из учебника, но неверное объяснение подъема самолета - напоминание о том, что <strong>она все еще учится по шаблону, а не является настоящим экспертом в своей области.</strong></p>
<p><strong>В то время как производительность в области STEM повысилась, глубина творческого потенциала снизилась.</strong> Многие пользователи с большим стажем отмечают снижение уровня литературного мастерства: поэзия кажется более плоской, философские беседы - менее нюансированными, а длинные повествования - более механическими. Компромисс очевиден - более высокая точность фактов и более сильные рассуждения в технических областях, но за счет искусного, исследовательского тона, который когда-то заставлял GPT чувствовать себя почти человеком.</p>
<p>Учитывая это, давайте посмотрим, как GPT-5 проявил себя в наших практических тестах.</p>
<h2 id="Coding-Tests" class="common-anchor-header">Кодирование тестов<button data-href="#Coding-Tests" class="anchor-icon" translate="no">
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
    </button></h2><p>Я начал с простой задачи: написать HTML-скрипт, позволяющий пользователям загружать изображение и перемещать его с помощью мыши. GPT-5 приостановился примерно на девять секунд, а затем выдал рабочий код, который хорошо справился с этим взаимодействием. Это было хорошим началом.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt52_7b04c9b41b.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Вторая задача была сложнее: реализовать обнаружение столкновений полигонов и шариков внутри вращающегося шестиугольника с регулируемой скоростью вращения, упругостью и количеством шариков. GPT-5 сгенерировал первую версию примерно за тринадцать секунд. Код включал все ожидаемые функции, но в нем были ошибки, и он не запускался.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_6_3e6a34572a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Затем я воспользовался опцией редактора <strong>"Исправить ошибку"</strong>, и GPT-5 исправил ошибки, так что шестиугольник отобразился. Однако шары так и не появились - логика спавна отсутствовала или была неверной, то есть основная функция программы отсутствовала, несмотря на всю остальную настройку.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt51_6489df9914.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>В общем,</strong> GPT-5 может создавать чистый, хорошо структурированный интерактивный код и восстанавливаться после простых ошибок во время выполнения. Однако в сложных сценариях он все еще рискует упустить важную логику, поэтому перед развертыванием необходимо провести человеческую проверку и итерации.</p>
<h2 id="Reasoning-Test" class="common-anchor-header">Тест на логику<button data-href="#Reasoning-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>Я задал многоступенчатую логическую головоломку, включающую цвета товаров, цены и позиционные подсказки - на ее решение у большинства людей уйдет несколько минут.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/reasoning_test_7ea15ed25b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Вопрос:</strong> <em>Что представляет собой синий предмет и какова его цена?</em></p>
<p>GPT-5 дал правильный ответ всего за 9 секунд с четким и логически обоснованным объяснением. Этот тест подтвердил сильные стороны модели в структурированном рассуждении и быстрой дедукции.</p>
<h2 id="Writing-Test" class="common-anchor-header">Письменный тест<button data-href="#Writing-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>Я часто обращаюсь к ChatGPT за помощью в создании блогов, постов в социальных сетях и другого письменного контента, поэтому генерация текста - одна из тех возможностей, которые меня волнуют больше всего. В этом тесте я попросил GPT-5 создать пост в LinkedIn на основе блога о многоязычном анализаторе Milvus 2.6.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Writing_Test_4fe5fef775.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Результат был хорошо организован и отражал все ключевые моменты из оригинального блога, но он казался слишком формальным и предсказуемым - больше похожим на корпоративный пресс-релиз, чем на что-то, призванное вызвать интерес в социальной ленте. Ему не хватало теплоты, ритма и индивидуальности, которые придают постам человеческий облик и привлекательность.</p>
<p>С другой стороны, сопроводительные иллюстрации были превосходны: четкие, выдержанные в едином стиле и идеально соответствующие техническому стилю Zilliz. Визуально все было на высоте, просто в написании нужно больше творческой энергии.</p>
<h2 id="Longer-Context-Window--Death-of-RAG-and-VectorDB" class="common-anchor-header">Более длинное контекстное окно = смерть RAG и VectorDB?<button data-href="#Longer-Context-Window--Death-of-RAG-and-VectorDB" class="anchor-icon" translate="no">
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
    </button></h2><p>Мы затронули эту тему в прошлом году, когда <a href="https://zilliz.com/blog/will-retrieval-augmented-generation-RAG-be-killed-by-long-context-LLMs">Google выпустила <strong>Gemini 1.5 Pro</strong></a> со сверхдлинным контекстным окном на 10 М токенов. В то время некоторые люди поспешили предсказать конец RAG и даже конец баз данных вообще. Переходим к сегодняшнему дню: RAG не только жив, но и процветает. На практике он стал <em>более</em> способным и продуктивным, как и векторные базы данных, такие как <a href="https://milvus.io/"><strong>Milvus</strong></a> и <a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a>.</p>
<p>Теперь, с расширением длины контекста в GPT-5 и более продвинутыми возможностями вызова инструментов, вопрос встал снова: <em>Нужны ли нам еще векторные базы данных для сбора контекста или даже специальные конвейеры агентов/RAG?</em></p>
<p><strong>Короткий ответ: абсолютно да. Они нам по-прежнему нужны.</strong></p>
<p>Более длинный контекст полезен, но он не заменит структурированный поиск. Мультиагентные системы все еще остаются долгосрочным архитектурным трендом, и этим системам часто нужен практически неограниченный контекст. Кроме того, когда речь идет о безопасном управлении частными неструктурированными данными, векторная база данных всегда будет последним привратником.</p>
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
    </button></h2><p>После просмотра презентации OpenAI и моих собственных практических тестов GPT-5 кажется не столько резким скачком вперед, сколько изысканным сочетанием прошлых достоинств с несколькими удачно расположенными апгрейдами. Это не плохо - это признак того, что большие модели начинают сталкиваться с ограничениями по архитектуре и качеству данных.</p>
<p>Как говорится, <em>серьезная критика рождается из завышенных ожиданий</em>. Разочарование по поводу GPT-5 в основном связано с очень высокой планкой, которую OpenAI установил для себя. И действительно - более высокая точность, более низкие цены и интегрированная мультимодальная поддержка - это все еще ценные победы. Для разработчиков, создающих агентов и конвейеры RAG, это может оказаться самым полезным обновлением на данный момент.</p>
<p>Некоторые друзья шутят, что делают "онлайн-памятники" для GPT-4o, утверждая, что личность их старого собеседника ушла навсегда. Я не возражаю против изменений - возможно, GPT-5 не такой теплый и болтливый, но его прямой, бесцеремонный стиль кажется освежающе простым.</p>
<p><strong>А что скажете вы?</strong> Поделитесь с нами своими мыслями - присоединяйтесь к нашему <a href="https://discord.com/invite/8uyFbECzPX">Discord</a> или участвуйте в обсуждении на <a href="https://www.linkedin.com/company/the-milvus-project/">LinkedIn</a> и <a href="https://x.com/milvusio">X</a>.</p>
