---
id: glm5-vs-minimax-m25-vs-gemini-3-deep-think.md
title: >-
  GLM-5 vs. MiniMax M2.5 vs. Gemini 3 Глубоко задумайтесь: какая модель подходит
  для вашего стека агентов ИИ?
author: 'Lumina Wang, Julie Xia'
date: 2026-02-14T00:00:00.000Z
cover: assets.zilliz.com/gemini_vs_minimax_vs_glm5_cover_1bc6d20c39.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Gemini, GLM, Minimax, ChatGPT'
meta_keywords: 'Gemini 3, GLM5, Minimax m2.5, ChatGPT'
meta_title: |
  GLM-5 vs MiniMax M2.5 vs Gemini 3 Deep Think Compared
desc: >-
  Практическое сравнение GLM-5, MiniMax M2.5 и Gemini 3 Deep Think для
  кодирования, рассуждений и ИИ-агентов. Включает учебник по RAG с Milvus.
origin: 'https://milvus.io/blog/glm5-vs-minimax-m25-vs-gemini-3-deep-think.md'
---
<p>Чуть более чем за два дня в продажу поступили сразу три крупные модели: GLM-5, MiniMax M2.5 и Gemini 3 Deep Think. Все три модели имеют одинаковые возможности: <strong>кодирование, глубокие рассуждения и агентные рабочие процессы.</strong> Все три заявляют о самых передовых результатах. Если присмотреться к техническим характеристикам, то можно практически сыграть в игру на соответствие и выявить идентичные тезисы во всех трех системах.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/comparsion_minimax_vs_glm5_vs_gemini3_d05715d4c2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>А что еще страшнее? Ваш босс, вероятно, уже ознакомился с анонсами и ждет, что вы создадите девять внутренних приложений с использованием этих трех моделей еще до конца недели.</p>
<p>Так что же на самом деле отличает эти модели? Как выбрать одну из них? И (как всегда) как соединить их с <a href="https://milvus.io/">Milvus</a>, чтобы создать внутреннюю базу знаний? Добавьте эту страницу в закладки. Здесь есть все, что вам нужно.</p>
<h2 id="GLM-5-MiniMax-M25-and-Gemini-3-Deep-Think-at-a-Glance" class="common-anchor-header">GLM-5, MiniMax M2.5 и Gemini 3 Deep Think с первого взгляда<button data-href="#GLM-5-MiniMax-M25-and-Gemini-3-Deep-Think-at-a-Glance" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="GLM-5-leads-in-complex-system-engineering-and-long-horizon-agent-tasks" class="common-anchor-header">GLM-5 лидирует в комплексном системном проектировании и решении дальних агентских задач</h3><p>12 февраля компания Zhipu официально представила GLM-5, который отлично справляется со сложными системными и долгосрочными агентскими задачами.</p>
<p>Модель имеет 355B-744B параметров (40B активных), обученных на 28,5T токенах. В ней интегрированы механизмы разреженного внимания и асинхронный фреймворк обучения с подкреплением под названием Slime, что позволяет ей обрабатывать сверхдлинные контексты без потери качества, сохраняя при этом низкую стоимость развертывания.</p>
<p>GLM-5 лидирует в ключевых бенчмарках с открытым исходным кодом, заняв первое место в SWE-bench Verified (77,8) и первое место в Terminal Bench 2.0 (56,2) - опередив MiniMax 2.5 и Gemini 3 Deep Think. Тем не менее, по своим показателям он все еще уступает лучшим моделям с закрытым исходным кодом, таким как Claude Opus 4.5 и GPT-5.2. В Vending Bench 2, оценке бизнес-моделирования, GLM-5 принесла 4 432 доллара симулированной годовой прибыли, что ставит ее примерно в один ряд с системами с закрытым исходным кодом.</p>
<p>В GLM-5 также были значительно улучшены возможности системного проектирования и агентов дальнего действия. Теперь он может конвертировать текст или исходные материалы непосредственно в файлы .docx, .pdf и .xlsx, а также генерировать такие специфические материалы, как документы с требованиями к продукту, планы занятий, экзамены, электронные таблицы, финансовые отчеты, блок-схемы и меню.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmark_1_aa8211e962.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmark_2_151ec06a6f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Gemini-3-Deep-Think-sets-a-new-bar-for-scientific-reasoning" class="common-anchor-header">Gemini 3 Deep Think устанавливает новую планку для научных рассуждений</h3><p>Ранним утром 13 февраля 2026 года компания Google официально выпустила Gemini 3 Deep Think - крупное обновление, которое я (условно) назову самой сильной моделью научных исследований и рассуждений на планете. В конце концов, Gemini была единственной моделью, которая прошла тест на мойку автомобиля: "<em>Я хочу помыть машину, а автомойка находится всего в 50 метрах. Должен ли я завести машину и поехать туда или просто пройтись пешком</em>?".</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/car_wash_test_gemini_859ee40db8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/car_wash_test_gpt_0ec0dffd4b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Его основная сила - первоклассные рассуждения и соревновательная производительность: он набрал 3455 Elo на Codeforces, что соответствует восьмому лучшему в мире соревновательному программисту. Он достиг золотых медалей в письменной части международных олимпиад по физике, химии и математике 2025 года. Еще один прорыв - экономическая эффективность. ARC-AGI-1 стоит всего 7,17 доллара за задачу, что в 280 раз - 420 раз меньше, чем в OpenAI o3-preview 14-месячной давности. Что касается прикладной стороны, то наибольшие успехи Deep Think связаны с научными исследованиями. Эксперты уже используют его для рецензирования профессиональных математических работ и оптимизации сложных процессов подготовки к выращиванию кристаллов.</p>
<h3 id="MiniMax-M25-competes-on-cost-and-speed-for-production-workloads" class="common-anchor-header">MiniMax M2.5 конкурирует по цене и скорости для производственных рабочих нагрузок</h3><p>В тот же день MiniMax выпустил версию M2.5, позиционируя ее как чемпиона по стоимости и эффективности для производственных задач.</p>
<p>Будучи одним из самых быстродействующих семейств моделей в отрасли, M2.5 устанавливает новые результаты SOTA в области кодирования, вызова инструментов, поиска и офисной производительности. Стоимость является его главным преимуществом: быстрая версия работает примерно со скоростью 100 TPS, при этом входные данные оцениваются в <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0,</mn><mi>30permilliontokensandoutputat0</mi></mrow><annotation encoding="application/x-tex">,30 за миллион токенов, а выходные -</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span></span></span></span>0 <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">,</span><span class="mord mathnormal">30permilliontokensandoutputat2</span></span></span></span>,40 за миллион токенов. Версия 50 TPS снижает стоимость выпуска еще в два раза. Скорость выросла на 37 % по сравнению с предыдущей версией M2.1, и она выполняет задачи SWE-bench Verified в среднем за 22,8 минуты, что примерно соответствует Claude Opus 4.6. Что касается возможностей, то M2.5 поддерживает полностековую разработку на более чем 10 языках, включая Go, Rust и Kotlin, охватывая все - от проектирования систем "от нуля до единицы" до полного обзора кода. Для офисной работы функция Office Skills обеспечивает глубокую интеграцию с Word, PPT и Excel. В сочетании со знаниями в области финансов и права она позволяет генерировать исследовательские отчеты и финансовые модели, готовые к непосредственному использованию.</p>
<p>Это общий обзор. Далее давайте посмотрим, как они работают в практических тестах.</p>
<h2 id="Hands-On-Comparisons" class="common-anchor-header">Сравнение на практике<button data-href="#Hands-On-Comparisons" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="3D-scene-rendering-Gemini-3-Deep-Think-produces-the-most-realistic-results" class="common-anchor-header">Рендеринг 3D-сцен: Gemini 3 Deep Think дает наиболее реалистичные результаты</h3><p>Мы взяли задание, которое пользователи уже тестировали на Gemini 3 Deep Think, и прогнали его через GLM-5 и MiniMax M2.5 для прямого сравнения. Задача: создать полную сцену Three.js в одном HTML-файле, которая отображает полностью 3D-интерьер комнаты, неотличимый от классической картины маслом в музее.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/emily_instgram_0af85c65fb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Gemini 3 Deep Think</p>
<iframe width="352" height="625" src="https://www.youtube.com/embed/Lhg-XsIM_CQ" title="gemini3 deep think test: 3D redering" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<p>GLM-5</p>
<iframe width="707" height="561" src="https://www.youtube.com/embed/tTuW7qQBO1Y" title="GLM 5 test: 3D scene rendering" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<p>MiniMax M2.5</p>
<iframe width="594" height="561" src="https://www.youtube.com/embed/KJMhnXqa4Uc" title="minimax m2.5 test: 3D scene rendering" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<p><strong>Gemini 3 Deep Think</strong> показал самый сильный результат. Он точно интерпретировал подсказку и создал высококачественную 3D-сцену. Особого внимания заслуживает освещение: направление и падение теней выглядели естественно, четко передавая пространственные отношения естественного света, проникающего через окно. Впечатляют и мелкие детали, в том числе полурасплавленная текстура свечей и качество материала красных сургучных печатей. В целом визуальная достоверность была высокой.</p>
<p>В<strong>GLM-5</strong> детально проработаны модели объектов и текстуры, но система освещения имеет заметные проблемы. Тени от столов отображались как твердые, чисто черные блоки без мягких переходов. Сургучная печать, казалось, парила над поверхностью стола, не позволяя корректно обрабатывать контакт между объектами и столешницей. Эти артефакты указывают на необходимость улучшения глобального освещения и пространственного мышления.</p>
<p><strong>MiniMax M2.5</strong> не смог эффективно разобрать сложное описание сцены. На выходе получалось лишь беспорядочное движение частиц, что говорит о значительных ограничениях как в понимании, так и в генерации при работе с многослойными семантическими инструкциями с точными визуальными требованиями.</p>
<h3 id="SVG-generation-all-three-models-handle-it-differently" class="common-anchor-header">Генерация SVG: все три модели справляются с этим по-разному</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/simon_twitter_screenshot_fef1c01cbf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Задача:</strong> Создайте SVG-изображение калифорнийского коричневого пеликана, едущего на велосипеде. Велосипед должен иметь спицы и раму правильной формы. У пеликана должна быть характерная большая сумка, и должны быть четко видны перья. Пеликан должен четко крутить педали велосипеда. На рисунке должно быть изображено полное гнездовое оперение калифорнийского бурого пеликана.</p>
<p><strong>Близнецы 3 Глубокая мысль</strong></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/gemini_3_generated_image_182aaefe26.png" alt="Gemini 3 Deep Think" class="doc-image" id="gemini-3-deep-think" />
   </span> <span class="img-wrapper"> <span>Gemini 3 Deep Think</span> </span></p>
<p><strong>ГЛМ-5</strong></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/GLM_5_generated_image_e84302d987.png" alt="GLM-5" class="doc-image" id="glm-5" />
   </span> <span class="img-wrapper"> <span>GLM-5</span> </span></p>
<p><strong>MiniMax M2.5</strong></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/minimax_m2_5_generated_image_06d50f8fa7.png" alt="MiniMax M2.5" class="doc-image" id="minimax-m2.5" />
   </span> <span class="img-wrapper"> <span>MiniMax M2.5</span> </span></p>
<p><strong>Gemini 3 Deep Think</strong> создал самый полный SVG. Поза пеликана при езде точна: его центр тяжести естественно располагается на сиденье, а ноги лежат на педалях в динамичной позе велосипедиста. Текстура перьев детализирована и многослойна. Единственное слабое место - фирменный горловой мешок пеликана нарисован слишком большим, что немного нарушает общие пропорции.</p>
<p>У<strong>GLM-5</strong> были заметные проблемы с осанкой. Ноги правильно расположены на педалях, но общее положение сидящего отклоняется от естественной позы для езды, а соотношение тела и сиденья выглядит не совсем правильным. При этом детализация проработана хорошо: горловой мешок имеет правильные пропорции, а качество текстуры перьев заслуживает уважения.</p>
<p><strong>MiniMax M2.5</strong> придерживается минималистского стиля и полностью отказался от фоновых элементов. Позиция пеликана на велосипеде примерно правильная, но детализация оставляет желать лучшего. Руль неправильной формы, текстура перьев практически отсутствует, шея слишком толстая, а на изображении присутствуют блуждающие белые овальные артефакты, которых не должно быть.</p>
<h2 id="How-to-Choose-Between-GLM-5-MiniMax-M25-and-Gemin-3-Deep-Think" class="common-anchor-header">Как выбрать между GLM-5, MiniMax M2.5 и Gemin 3 Deep Think<button data-href="#How-to-Choose-Between-GLM-5-MiniMax-M25-and-Gemin-3-Deep-Think" class="anchor-icon" translate="no">
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
    </button></h2><p>Во всех наших тестах MiniMax M2.5 генерировал результаты медленнее всех и требовал больше всего времени на размышления и рассуждения. GLM-5 работал стабильно и по скорости был примерно на одном уровне с Gemini 3 Deep Think.</p>
<p>Вот краткое руководство по выбору, которое мы подготовили:</p>
<table>
<thead>
<tr><th>Основной сценарий использования</th><th>Рекомендуемая модель</th><th>Ключевые сильные стороны</th></tr>
</thead>
<tbody>
<tr><td>Научные исследования, сложные рассуждения (физика, химия, математика, разработка сложных алгоритмов)</td><td>Близнецы 3 Глубокое мышление</td><td>Золотые медали в академических соревнованиях. Проверка научных данных на высшем уровне. Соревновательное программирование мирового класса на Codeforces. Проверенное применение в научных исследованиях, включая выявление логических недостатков в профессиональных работах. (В настоящее время доступна только подписчикам Google AI Ultra и избранным корпоративным пользователям; стоимость каждой задачи относительно высока).</td></tr>
<tr><td>Развертывание с открытым исходным кодом, настройка корпоративной интрасети, полнофункциональная разработка, интеграция офисных навыков</td><td>Zhipu GLM-5</td><td>Лучшая модель с открытым исходным кодом. Сильные инженерные возможности на уровне системы. Поддерживает локальное развертывание с приемлемыми затратами.</td></tr>
<tr><td>Рабочие нагрузки, чувствительные к затратам, многоязычное программирование, кросс-платформенная разработка (Web/Android/iOS/Windows), совместимость с офисом</td><td>MiniMax M2.5</td><td>При 100 TPS: <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0.</mn><mi>30permillioninputtokens</mi><mo separator="true">,</mo></mrow><annotation encoding="application/x-tex">0.30 на миллион входных токенов,</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span></span></span></span>0 <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">.</span><span class="mord mathnormal">30permillioninputtokens</span><span class="mpunct">,</span></span></span></span>2.40 на миллион выходных токенов. SOTA в офисных, кодировочных и инструментальных эталонах. Занимает первое место в бенчмарке Multi-SWE-Bench. Сильная обобщенность. Процент сдачи на Droid/OpenCode превышает Claude Opus 4.6.</td></tr>
</tbody>
</table>
<h2 id="RAG-Tutorial-Wire-Up-GLM-5-with-Milvus-for-a-Knowledge-Base" class="common-anchor-header">Учебное пособие RAG: Подключение GLM-5 к Milvus для базы знаний<button data-href="#RAG-Tutorial-Wire-Up-GLM-5-with-Milvus-for-a-Knowledge-Base" class="anchor-icon" translate="no">
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
    </button></h2><p>И GLM-5, и MiniMax M2.5 доступны через <a href="https://openrouter.ai/">OpenRouter</a>. Зарегистрируйтесь и создайте <code translate="no">OPENROUTER_API_KEY</code>, чтобы начать работу.</p>
<p>В этом руководстве в качестве примера LLM используется GLM-5 от Zhipu. Чтобы использовать MiniMax вместо него, просто поменяйте название модели на <code translate="no">minimax/minimax-m2.5</code>.</p>
<h3 id="Dependencies-and-environment-setup" class="common-anchor-header">Зависимости и настройка среды</h3><p>Установите или обновите pymilvus, openai, requests и tqdm до последних версий:</p>
<pre><code translate="no">pip install --upgrade pymilvus openai requests tqdm 
<button class="copy-code-btn"></button></code></pre>
<p>В данном руководстве в качестве LLM используется GLM-5, а в качестве модели встраивания - текстовая модель OpenAI text-embedding-3-small.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;OPENROUTER_API_KEY&quot;</span>] = <span class="hljs-string">&quot;**********&quot;</span> 
<button class="copy-code-btn"></button></code></pre>
<h3 id="Data-preparation" class="common-anchor-header">Подготовка данных</h3><p>Мы будем использовать страницы FAQ из документации Milvus 2.4.x в качестве нашей частной базы знаний.</p>
<p>Скачайте zip-файл и распакуйте документацию в папку <code translate="no">milvus_docs</code>:</p>
<pre><code translate="no">wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs
<button class="copy-code-btn"></button></code></pre>
<p>Загрузите все Markdown-файлы из папки <code translate="no">milvus_docs/en/faq</code>. Мы разделили каждый файл на <code translate="no">&quot;# &quot;</code>, чтобы примерно разделить содержимое по основным разделам:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob
text_lines = []
<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()
    text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="LLM-and-embedding-model-setup" class="common-anchor-header">Настройка LLM и модели встраивания</h3><p>Мы будем использовать GLM-5 в качестве LLM и text-embedding-3-small в качестве модели встраивания:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAI</span>
glm_client = <span class="hljs-title class_">OpenAI</span>(
    api_key=os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;OPENROUTER_API_KEY&quot;</span>],
    base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>Сгенерируйте тестовый эмбеддинг и выведите его размеры и первые несколько элементов:</p>
<pre><code translate="no">EMBEDDING_MODEL = <span class="hljs-string">&quot;openai/text-embedding-3-small&quot;</span>  <span class="hljs-comment"># OpenRouter embedding model</span>
resp = glm_client.embeddings.create(
    model=EMBEDDING_MODEL,
    <span class="hljs-built_in">input</span>=[<span class="hljs-string">&quot;This is a test1&quot;</span>, <span class="hljs-string">&quot;This is a test2&quot;</span>],
)
test_embeddings = [d.embedding <span class="hljs-keyword">for</span> d <span class="hljs-keyword">in</span> resp.data]
embedding_dim = <span class="hljs-built_in">len</span>(test_embeddings[<span class="hljs-number">0</span>])
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embeddings[<span class="hljs-number">0</span>][:<span class="hljs-number">10</span>])
<button class="copy-code-btn"></button></code></pre>
<p>Выходные данные:</p>
<pre><code translate="no"><span class="hljs-number">1536</span>
[<span class="hljs-meta">0.010637564584612846, -0.017222722992300987, 0.05409347265958786, -0.04377825930714607, -0.017545074224472046, -0.04196695610880852, -0.0011963422875851393, 0.03837504982948303, 0.0008855042979121208, 0.015181170776486397</span>]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Load-data-into-Milvus" class="common-anchor-header">Загрузка данных в Milvus</h3><p><strong>Создание коллекции:</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>
milvus_client = <span class="hljs-title class_">MilvusClient</span>(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)
collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Замечание по конфигурации MilvusClient:</p>
<ul>
<li><p>Установка URI на локальный файл (например, <code translate="no">./milvus.db</code>) - самый простой вариант. Он автоматически использует Milvus Lite для хранения всех данных в этом файле.</p></li>
<li><p>Для больших объемов данных можно развернуть более производительный сервер Milvus на Docker или Kubernetes. В этом случае используйте URI сервера (например, <code translate="no">http://localhost:19530</code>).</p></li>
<li><p>Чтобы использовать Zilliz Cloud (полностью управляемую облачную версию Milvus), установите URI и токен на публичную конечную точку и ключ API в консоли Zilliz Cloud.</p></li>
</ul>
<p>Проверьте, существует ли уже коллекция, и удалите ее, если да:</p>
<pre><code translate="no">if milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)
<button class="copy-code-btn"></button></code></pre>
<p>Создайте новую коллекцию с указанными параметрами. Если вы не указали определения полей, Milvus автоматически создает поле по умолчанию <code translate="no">id</code> в качестве первичного ключа и поле <code translate="no">vector</code> для векторных данных. В зарезервированном поле JSON хранятся любые поля и значения, не определенные в схеме:</p>
<pre><code translate="no">milvus_client.<span class="hljs-title function_">create_collection</span>(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Insert-data" class="common-anchor-header">Вставка данных</h3><p>Пройдитесь по текстовым строкам, сгенерируйте вкрапления и вставьте данные в Milvus. Поле <code translate="no">text</code> здесь не определено в схеме. Оно автоматически добавляется как динамическое поле, поддерживаемое зарезервированным JSON-полем Milvus:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm
data = []
resp = glm_client.embeddings.create(model=EMBEDDING_MODEL, <span class="hljs-built_in">input</span>=text_lines)
doc_embeddings = [d.embedding <span class="hljs-keyword">for</span> d <span class="hljs-keyword">in</span> resp.data]
<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})
milvus_client.insert(collection_name=collection_name, data=data)
<button class="copy-code-btn"></button></code></pre>
<p>Output:</p>
<pre><code translate="no">Creating embeddings: 100%|██████████████████████████| 72/72 [00:00&lt;00:00, 125203.10it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, ..., 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Build-the-RAG-pipeline" class="common-anchor-header">Построение конвейера RAG</h3><p><strong>Получение релевантных документов:</strong></p>
<p>Зададим распространенный вопрос о Milvus:</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Поиск по коллекции для получения 3 наиболее релевантных результатов:</p>
<pre><code translate="no">resp = glm_client.embeddings.create(model=EMBEDDING_MODEL, <span class="hljs-built_in">input</span>=[question])
question_embedding = resp.data[<span class="hljs-number">0</span>].embedding
search_res = milvus_client.search(
    collection_name=collection_name,
    data=[question_embedding],
    limit=<span class="hljs-number">3</span>,
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>Результаты сортируются по расстоянию, ближайшие первые:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json

retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))

[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including MinIO, AWS S3, Google Cloud Storage (GCS), Azure Blob Storage, Alibaba Cloud OSS, and Tencent Cloud Object Storage (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        <span class="hljs-number">0.7826977372169495</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus handle vector data types and precision?\n\nMilvus supports Binary, Float32, Float16, and BFloat16 vector types.\n\n- Binary vectors: Store binary data as sequences of 0s and 1s, used in image processing and information retrieval.\n- Float32 vectors: Default storage with a precision of about 7 decimal digits. Even Float64 values are stored with Float32 precision, leading to potential precision loss upon retrieval.\n- Float16 and BFloat16 vectors: Offer reduced precision and memory usage. Float16 is suitable for applications with limited bandwidth and storage, while BFloat16 balances range and efficiency, commonly used in deep learning to reduce computational requirements without significantly impacting accuracy.\n\n###&quot;</span>,
        <span class="hljs-number">0.6772387027740479</span>
    ],
    [
        <span class="hljs-string">&quot;How much does Milvus cost?\n\nMilvus is a 100% free open-source project.\n\nPlease adhere to Apache License 2.0 when using Milvus for production or distribution purposes.\n\nZilliz, the company behind Milvus, also offers a fully managed cloud version of the platform for those that don&#x27;t want to build and maintain their own distributed instance. Zilliz Cloud automatically maintains data reliability and allows users to pay only for what they use.\n\n###&quot;</span>,
        <span class="hljs-number">0.6467022895812988</span>
    ]
]
<button class="copy-code-btn"></button></code></pre>
<p><strong>Сгенерировать ответ с помощью LLM:</strong></p>
<p>Объедините найденные документы в контекстную строку:</p>
<pre><code translate="no">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>Настройте системные и пользовательские подсказки. Пользовательская подсказка строится на основе документов, полученных из Milvus:</p>
<pre><code translate="no">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
Human: You are an AI assistant. You can find answers to the questions in the contextual passage snippets provided.
&quot;&quot;&quot;</span>
USER_PROMPT = <span class="hljs-string">f&quot;&quot;&quot;
Use the following pieces of information enclosed in &lt;context&gt; tags to provide an answer to the question enclosed in &lt;question&gt; tags.
&lt;context&gt;
<span class="hljs-subst">{context}</span>
&lt;/context&gt;
&lt;question&gt;
<span class="hljs-subst">{question}</span>
&lt;/question&gt;
&quot;&quot;&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Вызов GLM-5 для генерации окончательного ответа:</p>
<pre><code translate="no">response = glm_client.chat.completions.create(
    model=<span class="hljs-string">&quot;z-ai/glm-5&quot;</span>,
    messages=[
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT},
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT},
    ],
)
<span class="hljs-built_in">print</span>(response.choices[<span class="hljs-number">0</span>].message.content)
<button class="copy-code-btn"></button></code></pre>
<p>GLM-5 возвращает хорошо структурированный ответ:</p>
<pre><code translate="no">Based <span class="hljs-keyword">on</span> the provided context, Milvus stores data <span class="hljs-keyword">in</span> two main ways, depending <span class="hljs-keyword">on</span> the data type:

<span class="hljs-number">1.</span> Inserted Data
   - What it includes: vector data, scalar data, <span class="hljs-keyword">and</span> collection-specific schema.
   - How it <span class="hljs-keyword">is</span> stored: <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> an incremental log.
   - Storage Backends: Milvus supports multiple <span class="hljs-built_in">object</span> storage backends, including MinIO, AWS S3, <span class="hljs-function">Google Cloud <span class="hljs-title">Storage</span> (<span class="hljs-params">GCS</span>), Azure Blob Storage, Alibaba Cloud OSS, <span class="hljs-keyword">and</span> Tencent Cloud Object <span class="hljs-title">Storage</span> (<span class="hljs-params">COS</span>).
   - Vector Specifics: vector data can be stored <span class="hljs-keyword">as</span> Binary <span class="hljs-title">vectors</span> (<span class="hljs-params">sequences of <span class="hljs-number">0</span>s <span class="hljs-keyword">and</span> <span class="hljs-number">1</span>s</span>), Float32 <span class="hljs-title">vectors</span> (<span class="hljs-params"><span class="hljs-literal">default</span> storage</span>), <span class="hljs-keyword">or</span> Float16 <span class="hljs-keyword">and</span> BFloat16 <span class="hljs-title">vectors</span> (<span class="hljs-params">offering reduced precision <span class="hljs-keyword">and</span> memory usage</span>).

2. Metadata
   - What it includes: data generated within Milvus modules.
   - How it <span class="hljs-keyword">is</span> stored: <span class="hljs-keyword">in</span> etcd.
</span><button class="copy-code-btn"></button></code></pre>
<h2 id="Conclusion-Pick-the-Model-Then-Build-the-Pipeline" class="common-anchor-header">Заключение: Выберите модель, а затем постройте конвейер<button data-href="#Conclusion-Pick-the-Model-Then-Build-the-Pipeline" class="anchor-icon" translate="no">
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
    </button></h2><p>Все три модели сильны, но они сильны в разных вещах. Gemini 3 Deep Think - лучший выбор, когда глубина рассуждений важнее стоимости. GLM-5 - лучший вариант с открытым исходным кодом для команд, которым требуется локальное развертывание и проектирование на уровне системы. MiniMax M2.5 имеет смысл использовать, если вы оптимизируете производительность и бюджет для производственных рабочих нагрузок.</p>
<p>Выбор модели - это только половина уравнения. Чтобы превратить любую из них в полезное приложение, необходим слой извлечения, который может масштабироваться вместе с данными. Именно здесь и пригодится Milvus. Приведенный выше учебник по RAG работает с любой OpenAI-совместимой моделью, поэтому для перехода между GLM-5, MiniMax M2.5 или любой другой будущей версией достаточно изменить всего одну строку.</p>
<p>Если вы разрабатываете локальные или локальные агенты ИИ и хотите более подробно обсудить архитектуру хранилища, дизайн сессий или безопасный откат, присоединяйтесь к нашему <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">каналу Slack</a>. Вы также можете заказать 20-минутную индивидуальную встречу через <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a>, чтобы получить индивидуальные рекомендации.</p>
<p>Если вы хотите углубиться в создание агентов искусственного интеллекта, вот другие ресурсы, которые помогут вам начать.</p>
<ul>
<li><p><a href="https://milvus.io/blog/how-to-build-productionready-multiagent-systems-with-agno-and-milvus.md">Как создавать готовые к производству мультиагентные системы с помощью Agno и Milvus</a></p></li>
<li><p><a href="https://zilliz.com/learn">Выбор правильной модели встраивания для конвейера RAG</a></p></li>
<li><p><a href="https://zilliz.com/learn">Как создать агента искусственного интеллекта с помощью Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">Что такое OpenClaw? Полное руководство по агенту искусственного интеллекта с открытым исходным кодом</a></p></li>
<li><p><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Учебник по OpenClaw: Подключение к Slack для локального ИИ-ассистента</a></p></li>
<li><p><a href="https://milvus.io/blog/clawdbot-long-running-ai-agents-langgraph-milvus.md">Создание ИИ-агентов в стиле Clawdbot с помощью LangGraph и Milvus</a></p></li>
</ul>
