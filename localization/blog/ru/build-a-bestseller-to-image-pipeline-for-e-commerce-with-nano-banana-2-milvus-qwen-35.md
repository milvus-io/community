---
id: >-
  build-a-bestseller-to-image-pipeline-for-e-commerce-with-nano-banana-2-milvus-qwen-35.md
title: >-
  Постройте конвейер преобразования бестселлеров в изображения для электронной
  коммерции с помощью Nano Banana 2 + Milvus + Qwen 3.5
author: Lumina Wang
date: 2026-3-3
cover: assets.zilliz.com/blog-images/20260303-100432.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: >-
  Nano Banana 2, Milvus, e-commerce AI image generation, AI product photography,
  vector search
meta_keywords: >-
  Nano Banana 2, Milvus, e-commerce AI image generation, AI product photography,
  vector search
meta_title: |
  Nano Banana 2 + Milvus: E-Commerce AI Image Generation Tutorial
desc: >-
  Пошаговое руководство: используйте Nano Banana 2, гибридный поиск Milvus и
  Qwen 3.5 для создания фотографий товаров электронной коммерции из плоских
  листов за 1/3 стоимости.
origin: >-
  https://milvus.io/blog/build-a-bestseller-to-image-pipeline-for-e-commerce-with-nano-banana-2-milvus-qwen-35.md
---
<p>Если вы создаете инструменты искусственного интеллекта для продавцов электронной коммерции, вы наверняка слышали этот запрос тысячу раз: "У меня новый продукт. Дайте мне рекламное изображение, которое будет выглядеть так, будто ему место в списке бестселлеров. Без фотографа, без студии, и чтобы это было недорого".</p>
<p>Вот в чем проблема в одном предложении. У продавцов есть плоские фотографии и каталог бестселлеров, которые уже конвертируются. Они хотят соединить эти два понятия с помощью искусственного интеллекта, причем быстро и масштабно.</p>
<p>Когда 26 февраля 2026 года Google выпустил Nano Banana 2 (Gemini 3.1 Flash Image), мы протестировали его в тот же день и интегрировали в наш существующий поисковый конвейер на базе Milvus. Результат: общая стоимость генерации изображений снизилась примерно до одной трети от прежних затрат, а пропускная способность удвоилась. Частично это объясняется снижением цены за одно изображение (примерно на 50 % дешевле, чем Nano Banana Pro), но более значительная экономия достигается за счет полного исключения циклов доработки.</p>
<p>В этой статье мы расскажем о том, что в Nano Banana 2 сделано правильно для электронной коммерции, и о том, где она все еще не работает, а также рассмотрим практическое руководство по работе с полным конвейером: Гибридный поиск <strong>Milvus</strong> для поиска визуально похожих бестселлеров, <strong>Qwen</strong> 3.5 для анализа стиля и <strong>Nano Banana 2</strong> для окончательной генерации.</p>
<h2 id="What’s-New-with-Nano-Banana-2" class="common-anchor-header">Что нового в Nano Banana 2?<button data-href="#What’s-New-with-Nano-Banana-2" class="anchor-icon" translate="no">
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
    </button></h2><p>Nano Banana 2 (флеш-образ Gemini 3.1) был запущен 26 февраля 2026 года. Он переносит большинство возможностей Nano Banana Pro на архитектуру Flash, что означает более быструю генерацию по более низкой цене. Вот ключевые обновления:</p>
<ul>
<li><strong>Качество уровня Pro на скорости Flash.</strong> Nano Banana 2 обеспечивает знания, рассуждения и визуальную точность мирового уровня, ранее присущие только Pro, но с задержкой и пропускной способностью Flash.</li>
<li><strong>Разрешение от 512px до 4K.</strong> Четыре уровня разрешения (512px, 1K, 2K, 4K) с нативной поддержкой. Уровень 512px является новым и уникальным для Nano Banana 2.</li>
<li><strong>14 соотношений сторон.</strong> Добавляет 4:1, 1:4, 8:1 и 1:8 к существующему набору (1:1, 2:3, 3:2, 3:4, 4:3, 4:5, 5:4, 9:16, 16:9, 21:9).</li>
<li><strong>До 14 опорных изображений.</strong> Поддержание сходства персонажей для 5 персонажей и достоверности объектов для 14 объектов в одном рабочем процессе.</li>
<li><strong>Улучшенный рендеринг текста.</strong> Генерирует разборчивый и точный текст на изображении на нескольких языках с поддержкой перевода и локализации в рамках одной генерации.</li>
<li><strong>Основание для поиска изображений.</strong> Использует веб-данные и изображения из поиска Google в режиме реального времени для создания более точных изображений реальных объектов.</li>
<li><strong>На ~50 % дешевле на одно изображение.</strong> При разрешении 1K: <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0,</mn><mi>067versusPro′s0</mi></mrow><annotation encoding="application/x-tex">,067 против</annotation></semantics></math></span></span>0 <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">,067versusPro</span><span class="strut" style="height:0.7519em;"></span><span class="mord"></span></span></span></span>0 <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">,</span><span class="mord"><span class="mord mathnormal">067versusPro</span></span></span></span></span><span class="pstrut" style="height:2.7em;"></span> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord mathnormal">′s0</span></span></span></span>,134.</li>
</ul>
<p><strong>Забавный пример использования Nano Banano 2: создание панорамы с учетом местоположения на основе простого снимка экрана Google Map</strong></p>
<p>Получив скриншот Google Maps и подсказку по стилю, модель распознает географический контекст и генерирует панораму, сохраняющую правильные пространственные отношения. Это полезно для создания рекламных креативов, ориентированных на конкретный регион (фон парижского кафе, пейзаж улицы Токио), без привлечения стоковых фотографий.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Полный набор функций можно найти <a href="https://blog.google/innovation-and-ai/technology/ai/nano-banana-2/">в блоге Google</a> и в <a href="https://ai.google.dev/gemini-api/docs/image-generation">документации для разработчиков</a>.</p>
<h2 id="What-Does-This-Nano-Banana-Update-Mean-For-E-Commerce" class="common-anchor-header">Что означает обновление Nano Banana для электронной коммерции?<button data-href="#What-Does-This-Nano-Banana-Update-Mean-For-E-Commerce" class="anchor-icon" translate="no">
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
    </button></h2><p>Электронная коммерция - одна из самых требовательных к изображениям отраслей. Листинги товаров, объявления на рынке, социальные креативы, баннерные кампании, локализованные витрины магазинов: каждый канал требует постоянного потока визуальных активов, каждый со своими спецификациями.</p>
<p>Основные требования к искусственному интеллекту для генерации изображений в электронной коммерции сводятся к следующему:</p>
<ul>
<li><strong>Поддерживать низкие затраты</strong> - стоимость одного изображения должна работать в масштабах каталога.</li>
<li><strong>Соответствие внешнему виду проверенных бестселлеров</strong> - новые изображения должны соответствовать визуальному стилю объявлений, которые уже конвертируются.</li>
<li><strong>Избегайте нарушений</strong> - не копируйте креативы конкурентов и не используйте повторно защищенные активы.</li>
</ul>
<p>Кроме того, трансграничным продавцам необходимо:</p>
<ul>
<li><strong>Поддержка мультиплатформенных форматов</strong> - различные соотношения сторон и спецификации для маркетплейсов, объявлений и витрин.</li>
<li><strong>Многоязычный рендеринг текста</strong> - чистый и точный текст в изображении на нескольких языках.</li>
</ul>
<p>Nano Banana 2 подходит практически ко всем пунктам. В следующих разделах мы рассмотрим, что каждая из модернизаций означает на практике: где она непосредственно решает болевую точку электронной коммерции, где она не работает, а также каково реальное влияние на затраты.</p>
<h3 id="Cut-Output-Generation-Costs-by-Up-to-60" class="common-anchor-header">Сокращение затрат на генерацию вывода на 60 %</h3><p>При разрешении 1K стоимость <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">одного изображения в</annotation></semantics></math></span></span>Nano Banana 2 составляет <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0,067</mn><mi>perimageversusPro′s0</mi></mrow><annotation encoding="application/x-tex">,067 против</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.9463em;vertical-align:-0.1944em;"></span></span></span></span>0,067 <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mord mathnormal">perimageversusPro</span></span></span></span></span><span class="pstrut" style="height:2.7em;"></span> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord mathnormal">′s0</span></span></span></span>,134 <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">в Pro</annotation></semantics></math></span></span>, что составляет прямое 50-процентное сокращение. Но цена за изображение - это только половина истории. Что раньше убивало бюджеты пользователей, так это доработки. Каждый маркетплейс устанавливает свои спецификации изображений (1:1 для Amazon, 3:4 для витрин Shopify, ultrawide для баннерной рекламы), и производство каждого варианта означало отдельную генерацию с собственными режимами отказа.</p>
<p>Nano Banana 2 сводит все эти дополнительные этапы к одному.</p>
<ul>
<li><p><strong>Четыре уровня нативного разрешения.</strong></p></li>
<li><p>512px ($0,045)</p></li>
<li><p>1K ($0.067)</p></li>
<li><p>2K ($0.101)</p></li>
<li><p>4K ($0.151).</p></li>
</ul>
<p>Уровень 512px является новым и уникальным для Nano Banana 2. Теперь пользователи могут генерировать недорогие 512-пиксельные черновики для итераций и выводить конечный актив в 2K или 4K без отдельного шага апскейлинга.</p>
<ul>
<li><p>Всего<strong>поддерживается 14 соотношений сторон</strong>. Вот несколько примеров:</p></li>
<li><p>4:1</p></li>
<li><p>1:4</p></li>
<li><p>8:1</p></li>
<li><p>1:8</p></li>
</ul>
<p>Эти новые сверхширокие и сверхвысокие соотношения присоединяются к уже существующему набору. За один сеанс генерации можно получить различные форматы, такие как: <strong>Главное изображение Amazon</strong> (1:1), <strong>Герой витрины</strong> (3:4) и <strong>Баннерная реклама</strong> (сверхширокая или в других соотношениях).</p>
<p>Для этих 4 соотношений не требуется ни обрезка, ни подгонка, ни перепросмотр. Остальные 10 соотношений сторон включены в полный набор, что делает процесс более гибким для разных платформ.</p>
<p>Одна только экономия ~50 % на каждом изображении уменьшит счет вдвое. Устранение переделок в разных разрешениях и соотношениях сторон позволило снизить общие затраты примерно до одной трети от прежних.</p>
<h3 id="Support-Up-to-14-Reference-Images-with-Bestseller-Style" class="common-anchor-header">Поддержка до 14 эталонных изображений в стиле бестселлера</h3><p>Из всех обновлений Nano Banana 2 наибольшее влияние на наш конвейер Milvus оказало смешивание нескольких ссылок. Nano Banana 2 принимает до 14 референсных изображений в одном запросе, поддерживая:</p>
<ul>
<li>Сходство персонажей для <strong>5 персонажей</strong></li>
<li>достоверность объектов для <strong>14 объектов</strong>.</li>
</ul>
<p>На практике мы извлекали из Milvus несколько изображений бестселлеров, передавали их в качестве ссылок, и сгенерированное изображение наследовало их композицию сцены, освещение, позирование и расположение реквизита. Восстанавливать эти детали вручную не требовалось.</p>
<p>Предыдущие модели поддерживали только одну или две ссылки, что заставляло пользователей выбирать один бестселлер для подражания. Имея 14 слотов для ссылок, мы могли смешивать характеристики из нескольких наиболее успешных списков и позволять модели синтезировать общий стиль. Именно эта возможность позволила реализовать конвейер, основанный на поиске, как показано в учебном пособии ниже.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image15.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Produce-Premium-Commercial-Ready-Visuals-Without-Traditional-Production-Cost-or-Logistics" class="common-anchor-header">Создание визуальных изображений премиум-класса, готовых к коммерческой эксплуатации, без традиционных затрат на производство и логистику</h3><p>Чтобы добиться стабильной и надежной генерации изображений, не следует сваливать все требования на один запрос. Более надежный подход - работать поэтапно: сначала сгенерировать фон, затем отдельно модель и, наконец, скомпоновать их вместе.</p>
<p>Мы протестировали генерацию фона для всех трех моделей Nano Banana с помощью одного и того же запроса: 4:1 ультраширокий пейзаж Шанхая в дождливый день, виднеющийся из окна, с башней Oriental Pearl Tower. Этот запрос позволяет проверить композицию, архитектурные детали и фотореализм за один проход.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h4 id="Original-Nano-Banana-vs-Nano-Banana-Pro-vs-Nano-Banana-2" class="common-anchor-header">Оригинальный Nano Banana против Nano Banana Pro против Nano Banana 2</h4><ul>
<li><strong>Оригинальный Nano Banana.</strong> Естественная текстура дождя с правдоподобным распределением капель, но слишком сглаженные детали зданий. Башня Oriental Pearl Tower была едва различима, а разрешение не соответствовало требованиям производства.</li>
<li><strong>Nano Banana Pro.</strong> Кинематографическая атмосфера: теплое освещение интерьера убедительно обыгрывает холодный дождь. Однако при этом полностью отсутствовала оконная рама, что ослабило ощущение глубины изображения. Можно использовать как вспомогательный образ, но не как героя.</li>
<li><strong>Nano Banana 2.</strong> Рендеринг всей сцены. Оконная рама на переднем плане создала глубину. Восточная жемчужная башня была четко детализирована. На реке Хуанпу появились корабли. Многослойное освещение отличает тепло интерьера от пасмурной погоды снаружи. Текстуры дождя и водяных пятен были почти фотографическими, а ультраширокое соотношение 4:1 обеспечило правильную перспективу с незначительными искажениями у левого края окна.</li>
</ul>
<p>Для большинства задач по созданию фона при съемке товаров мы нашли выход Nano Banana 2 пригодным без постобработки.</p>
<h3 id="Render-In-Image-Text-Cleanly-Across-Languages" class="common-anchor-header">Чистое отображение текста на изображении на разных языках</h3><p>Ценники, рекламные баннеры и многоязычные тексты неизбежны в изображениях электронной коммерции, и они исторически были точкой разрыва для генерации искусственного интеллекта. Nano Banana 2 справляется с ними значительно лучше, поддерживая рендеринг текста в изображении на нескольких языках с переводом и локализацией за одну генерацию.</p>
<p><strong>Стандартный рендеринг текста.</strong> В ходе нашего тестирования текст выводился без ошибок во всех опробованных нами форматах электронной коммерции: на ценниках, в коротких маркетинговых теглайнах и двуязычных описаниях товаров.</p>
<p><strong>Продолжение рукописного текста.</strong> Поскольку электронная коммерция часто требует рукописных элементов, таких как ценники и персонализированные карточки, мы проверили, могут ли модели соответствовать существующему рукописному стилю и расширять его - в частности, соответствовать рукописному списку дел и добавлять 5 новых пунктов в том же стиле. Результаты по трем моделям:</p>
<ul>
<li><strong>Оригинальный Nano Banana.</strong> Повторяющиеся порядковые номера, непонятная структура.</li>
<li><strong>Nano Banana Pro.</strong> Правильный макет, но плохое воспроизведение стиля шрифта.</li>
<li><strong>Nano Banana 2.</strong> Ноль ошибок. Вес штриха и стиль начертания совпадают достаточно близко, чтобы быть неотличимыми от источника.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image12.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Однако</strong> в собственной документации Google отмечается, что Nano Banana 2 "все еще может испытывать трудности с точным написанием и мелкими деталями на изображениях". Наши результаты были чистыми во всех протестированных форматах, но любой рабочий процесс должен включать этап проверки текста перед публикацией.</p>
<h2 id="Step-by-Step-Tutorial-Build-a-Bestseller-to-Image-Pipeline-with-Milvus-Qwen-35-and-Nano-Banana-2" class="common-anchor-header">Пошаговое руководство: Построение конвейера преобразования бестселлера в изображение с помощью Milvus, Qwen 3.5 и Nano Banana 2<button data-href="#Step-by-Step-Tutorial-Build-a-Bestseller-to-Image-Pipeline-with-Milvus-Qwen-35-and-Nano-Banana-2" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Before-we-begin-Architecture-and-Model-Setup" class="common-anchor-header">Прежде чем мы начнем: Архитектура и настройка модели</h3><p>Чтобы избежать случайности при генерации одного запроса, мы разделили процесс на три контролируемых этапа: выясняем, что уже работает с помощью гибридного поиска <strong>Milvus</strong>, анализируем, почему это работает, с помощью <strong>Qwen 3.5</strong>, а затем генерируем финальное изображение с учетом этих ограничений с помощью <strong>Nano Banana 2</strong>.</p>
<p>Кратко о каждом инструменте, если вы не работали с ним раньше:</p>
<ul>
<li><strong><a href="https://milvus.io/">Milvus</a></strong><a href="https://milvus.io/">:</a> самая распространенная база данных векторов с открытым исходным кодом. Хранит каталог товаров в виде векторов и выполняет гибридный поиск (плотный + разреженный + скалярный фильтры), чтобы найти изображения-бестселлеры, наиболее похожие на новый продукт.</li>
<li><strong>Qwen 3.5</strong>: популярный мультимодальный LLM. Получает изображения бестселлеров и извлекает из них визуальные паттерны (расположение сцены, освещение, позы, настроение) в виде структурированной подсказки по стилю.</li>
<li><strong>Nano Banana 2</strong>: модель генерации изображений от Google (Gemini 3.1 Flash Image). Принимает три входных сигнала: рекламный ролик нового продукта, ссылку на бестселлер и стилистическую подсказку Qwen 3.5. Выдает финальную рекламную фотографию.</li>
</ul>
<p>Логика этой архитектуры начинается с одного наблюдения: самый ценный визуальный актив в любом каталоге электронной коммерции - это библиотека изображений бестселлеров, которые уже были преобразованы. Позы, композиции и освещение на этих фотографиях были отработаны в ходе реальных рекламных кампаний. Извлечь эти шаблоны напрямую на порядок быстрее, чем разрабатывать их с помощью подсказок, и именно этот этап извлечения и выполняет векторная база данных.</p>
<p>Вот полный процесс. Мы вызываем каждую модель через API OpenRouter, поэтому нам не требуется локальный GPU и не нужно загружать веса моделей.</p>
<pre><code translate="no">New product flat-lay
│
│── Embed → Llama Nemotron Embed VL 1B v2
│
│── Search → Milvus hybrid search
│   ├── Dense <span class="hljs-title function_">vectors</span> <span class="hljs-params">(visual similarity)</span>
│   ├── Sparse <span class="hljs-title function_">vectors</span> <span class="hljs-params">(keyword matching)</span>
│   └── Scalar <span class="hljs-title function_">filters</span> <span class="hljs-params">(category + sales volume)</span>
│
│── Analyze → Qwen <span class="hljs-number">3.5</span> extracts style from retrieved bestsellers
│   └── scene, lighting, pose, mood → style prompt
│
└── Generate → Nano Banana <span class="hljs-number">2</span>
    ├── Inputs: <span class="hljs-keyword">new</span> <span class="hljs-title class_">product</span> + bestseller reference + style prompt
    └── Output: promotional photo
<button class="copy-code-btn"></button></code></pre>
<p>Для обеспечения работы этапа поиска мы опираемся на три возможности Milvus:</p>
<ol>
<li><strong>Плотный + разреженный гибридный поиск.</strong> Мы выполняем вкрапления изображений и текстовые TF-IDF-векторы в качестве параллельных запросов, а затем объединяем два набора результатов с помощью реранжирования RRF (Reciprocal Rank Fusion).</li>
<li><strong>Фильтрация по скалярным полям.</strong> Перед сравнением векторов мы фильтруем метаданные по таким полям, как category и sales_count, поэтому в результаты включаются только релевантные и высокоэффективные товары.</li>
<li><strong>Многополевая схема.</strong> Мы храним плотные векторы, разреженные векторы и скалярные метаданные в одной коллекции Milvus, что позволяет хранить всю логику поиска в одном запросе, а не разбрасывать ее по нескольким системам.</li>
</ol>
<h3 id="Data-Preparation" class="common-anchor-header">Подготовка данных</h3><p><strong>Исторический каталог продукции</strong></p>
<p>Мы начинаем с двух активов: папки images/ с фотографиями существующих товаров и файла products.csv, содержащего их метаданные.</p>
<pre><code translate="no">images/
├── SKU001.jpg
├── SKU002.jpg
├── ...
└── SKU040.jpg

products.csv fields:
product_id, image_path, category, color, style, season, sales_count, description, price
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Данные о новых продуктах</strong></p>
<p>Для продуктов, для которых мы хотим сгенерировать рекламные изображения, мы подготовим параллельную структуру: папку new_products/ и файл new_products.csv.</p>
<pre><code translate="no">new_products/
├── NEW001.jpg    <span class="hljs-comment"># Blue knit cardigan + grey tulle skirt set</span>
├── NEW002.jpg    <span class="hljs-comment"># Light green floral ruffle maxi dress</span>
├── NEW003.jpg    <span class="hljs-comment"># Camel turtleneck knit dress</span>
└── NEW004.jpg    <span class="hljs-comment"># Dark grey ethnic-style cowl neck top dress</span>

new_products.csv fields:
new_id, image_path, category, style, season, prompt_hint
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image11.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image16.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-1-Install-Dependencies" class="common-anchor-header">Шаг 1: Установка зависимостей</h3><pre><code translate="no">!pip install pymilvus openai requests pillow scikit-learn tqdm
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Import-Modules-and-Configurations" class="common-anchor-header">Шаг 2: Импорт модулей и конфигураций</h3><pre><code translate="no"><span class="hljs-keyword">import</span> os, io, base64, csv, time
<span class="hljs-keyword">import</span> requests <span class="hljs-keyword">as</span> req
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">from</span> <span class="hljs-variable constant_">PIL</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">Image</span>
<span class="hljs-keyword">from</span> tqdm.<span class="hljs-property">notebook</span> <span class="hljs-keyword">import</span> tqdm
<span class="hljs-keyword">from</span> sklearn.<span class="hljs-property">feature_extraction</span>.<span class="hljs-property">text</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">TfidfVectorizer</span>
<span class="hljs-keyword">from</span> <span class="hljs-title class_">IPython</span>.<span class="hljs-property">display</span> <span class="hljs-keyword">import</span> display

<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAI</span>
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>, <span class="hljs-title class_">DataType</span>, <span class="hljs-title class_">AnnSearchRequest</span>, <span class="hljs-title class_">RRFRanker</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Настройте все модели и пути:</strong></p>
<pre><code translate="no"><span class="hljs-comment"># -- Config --</span>
OPENROUTER_API_KEY = os.environ.get(
    <span class="hljs-string">&quot;OPENROUTER_API_KEY&quot;</span>,
    <span class="hljs-string">&quot;&lt;YOUR_OPENROUTER_API_KEY&gt;&quot;</span>,
)

<span class="hljs-comment"># Models (all via OpenRouter, no local download needed)</span>
EMBED_MODEL = <span class="hljs-string">&quot;nvidia/llama-nemotron-embed-vl-1b-v2&quot;</span>  <span class="hljs-comment"># free, image+text → 2048d</span>
EMBED_DIM = <span class="hljs-number">2048</span>
LLM_MODEL = <span class="hljs-string">&quot;qwen/qwen3.5-397b-a17b&quot;</span>                 <span class="hljs-comment"># style analysis</span>
IMAGE_GEN_MODEL = <span class="hljs-string">&quot;google/gemini-3.1-flash-image-preview&quot;</span>  <span class="hljs-comment"># Nano Banana 2</span>

<span class="hljs-comment"># Milvus</span>
MILVUS_URI = <span class="hljs-string">&quot;./milvus_fashion.db&quot;</span>
COLLECTION = <span class="hljs-string">&quot;fashion_products&quot;</span>
TOP_K = <span class="hljs-number">3</span>

<span class="hljs-comment"># Paths</span>
IMAGE_DIR = <span class="hljs-string">&quot;./images&quot;</span>
NEW_PRODUCT_DIR = <span class="hljs-string">&quot;./new_products&quot;</span>
PRODUCT_CSV = <span class="hljs-string">&quot;./products.csv&quot;</span>
NEW_PRODUCT_CSV = <span class="hljs-string">&quot;./new_products.csv&quot;</span>

<span class="hljs-comment"># OpenRouter client (shared for LLM + image gen)</span>
llm = OpenAI(api_key=OPENROUTER_API_KEY, base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Config loaded. All models via OpenRouter API.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Вспомогательные функции</strong></p>
<p>Эти вспомогательные функции выполняют кодирование изображений, вызовы API и разбор ответов:</p>
<ul>
<li>image_to_uri(): Преобразует изображение PIL в URI данных base64 для передачи через API.</li>
<li>get_image_embeddings(): Пакетное кодирование изображений в 2048-мерные векторы с помощью OpenRouter Embedding API.</li>
<li>get_text_embedding(): Кодирует текст в то же 2048-мерное векторное пространство.</li>
<li>sparse_to_dict(): Преобразует строку разреженной матрицы scipy в формат {index: value}, который Milvus ожидает для разреженных векторов.</li>
<li>extract_images(): Извлекает сгенерированные изображения из ответа API Nano Banana 2.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># -- Utility functions --</span>

<span class="hljs-keyword">def</span> <span class="hljs-title function_">image_to_uri</span>(<span class="hljs-params">img, max_size=<span class="hljs-number">1024</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Convert PIL Image to base64 data URI.&quot;&quot;&quot;</span>
    img = img.copy()
    w, h = img.size
    <span class="hljs-keyword">if</span> <span class="hljs-built_in">max</span>(w, h) &gt; max_size:
        r = max_size / <span class="hljs-built_in">max</span>(w, h)
        img = img.resize((<span class="hljs-built_in">int</span>(w * r), <span class="hljs-built_in">int</span>(h * r)), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, <span class="hljs-built_in">format</span>=<span class="hljs-string">&quot;JPEG&quot;</span>, quality=<span class="hljs-number">85</span>)
    <span class="hljs-keyword">return</span> <span class="hljs-string">f&quot;data:image/jpeg;base64,<span class="hljs-subst">{base64.b64encode(buf.getvalue()).decode()}</span>&quot;</span>

<span class="hljs-keyword">def</span> <span class="hljs-title function_">get_image_embeddings</span>(<span class="hljs-params">images, batch_size=<span class="hljs-number">5</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Encode images via OpenRouter embedding API.&quot;&quot;&quot;</span>
    all_embs = []
    <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> tqdm(<span class="hljs-built_in">range</span>(<span class="hljs-number">0</span>, <span class="hljs-built_in">len</span>(images), batch_size), desc=<span class="hljs-string">&quot;Encoding images&quot;</span>):
        batch = images[i : i + batch_size]
        inputs = [
            {<span class="hljs-string">&quot;content&quot;</span>: [{<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: {<span class="hljs-string">&quot;url&quot;</span>: image_to_uri(img, max_size=<span class="hljs-number">512</span>)}}]}
            <span class="hljs-keyword">for</span> img <span class="hljs-keyword">in</span> batch
        ]
        resp = req.post(
            <span class="hljs-string">&quot;https://openrouter.ai/api/v1/embeddings&quot;</span>,
            headers={<span class="hljs-string">&quot;Authorization&quot;</span>: <span class="hljs-string">f&quot;Bearer <span class="hljs-subst">{OPENROUTER_API_KEY}</span>&quot;</span>},
            json={<span class="hljs-string">&quot;model&quot;</span>: EMBED_MODEL, <span class="hljs-string">&quot;input&quot;</span>: inputs},
            timeout=<span class="hljs-number">120</span>,
        )
        data = resp.json()
        <span class="hljs-keyword">if</span> <span class="hljs-string">&quot;data&quot;</span> <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> data:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;API error: <span class="hljs-subst">{data}</span>&quot;</span>)
            <span class="hljs-keyword">continue</span>
        <span class="hljs-keyword">for</span> item <span class="hljs-keyword">in</span> <span class="hljs-built_in">sorted</span>(data[<span class="hljs-string">&quot;data&quot;</span>], key=<span class="hljs-keyword">lambda</span> x: x[<span class="hljs-string">&quot;index&quot;</span>]):
            all_embs.append(item[<span class="hljs-string">&quot;embedding&quot;</span>])
        time.sleep(<span class="hljs-number">0.5</span>)  <span class="hljs-comment"># rate limit friendly</span>
    <span class="hljs-keyword">return</span> np.array(all_embs, dtype=np.float32)

<span class="hljs-keyword">def</span> <span class="hljs-title function_">get_text_embedding</span>(<span class="hljs-params">text</span>):
    <span class="hljs-string">&quot;&quot;&quot;Encode text via OpenRouter embedding API.&quot;&quot;&quot;</span>
    resp = req.post(
        <span class="hljs-string">&quot;https://openrouter.ai/api/v1/embeddings&quot;</span>,
        headers={<span class="hljs-string">&quot;Authorization&quot;</span>: <span class="hljs-string">f&quot;Bearer <span class="hljs-subst">{OPENROUTER_API_KEY}</span>&quot;</span>},
        json={<span class="hljs-string">&quot;model&quot;</span>: EMBED_MODEL, <span class="hljs-string">&quot;input&quot;</span>: text},
        timeout=<span class="hljs-number">60</span>,
    )
    <span class="hljs-keyword">return</span> np.array(resp.json()[<span class="hljs-string">&quot;data&quot;</span>][<span class="hljs-number">0</span>][<span class="hljs-string">&quot;embedding&quot;</span>], dtype=np.float32)

<span class="hljs-keyword">def</span> <span class="hljs-title function_">sparse_to_dict</span>(<span class="hljs-params">sparse_row</span>):
    <span class="hljs-string">&quot;&quot;&quot;Convert scipy sparse row to Milvus sparse vector format {index: value}.&quot;&quot;&quot;</span>
    coo = sparse_row.tocoo()
    <span class="hljs-keyword">return</span> {<span class="hljs-built_in">int</span>(i): <span class="hljs-built_in">float</span>(v) <span class="hljs-keyword">for</span> i, v <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(coo.col, coo.data)}

<span class="hljs-keyword">def</span> <span class="hljs-title function_">extract_images</span>(<span class="hljs-params">response</span>):
    <span class="hljs-string">&quot;&quot;&quot;Extract generated images from OpenRouter response.&quot;&quot;&quot;</span>
    images = []
    raw = response.model_dump()
    msg = raw[<span class="hljs-string">&quot;choices&quot;</span>][<span class="hljs-number">0</span>][<span class="hljs-string">&quot;message&quot;</span>]
    <span class="hljs-comment"># Method 1: images field (OpenRouter extension)</span>
    <span class="hljs-keyword">if</span> <span class="hljs-string">&quot;images&quot;</span> <span class="hljs-keyword">in</span> msg <span class="hljs-keyword">and</span> msg[<span class="hljs-string">&quot;images&quot;</span>]:
        <span class="hljs-keyword">for</span> img_data <span class="hljs-keyword">in</span> msg[<span class="hljs-string">&quot;images&quot;</span>]:
            url = img_data[<span class="hljs-string">&quot;image_url&quot;</span>][<span class="hljs-string">&quot;url&quot;</span>]
            b64 = url.split(<span class="hljs-string">&quot;,&quot;</span>, <span class="hljs-number">1</span>)[<span class="hljs-number">1</span>]
            images.append(Image.<span class="hljs-built_in">open</span>(io.BytesIO(base64.b64decode(b64))))
    <span class="hljs-comment"># Method 2: inline base64 in content parts</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> images <span class="hljs-keyword">and</span> <span class="hljs-built_in">isinstance</span>(msg.get(<span class="hljs-string">&quot;content&quot;</span>), <span class="hljs-built_in">list</span>):
        <span class="hljs-keyword">for</span> part <span class="hljs-keyword">in</span> msg[<span class="hljs-string">&quot;content&quot;</span>]:
            <span class="hljs-keyword">if</span> <span class="hljs-built_in">isinstance</span>(part, <span class="hljs-built_in">dict</span>) <span class="hljs-keyword">and</span> part.get(<span class="hljs-string">&quot;type&quot;</span>) == <span class="hljs-string">&quot;image_url&quot;</span>:
                url = part[<span class="hljs-string">&quot;image_url&quot;</span>][<span class="hljs-string">&quot;url&quot;</span>]
                <span class="hljs-keyword">if</span> url.startswith(<span class="hljs-string">&quot;data:image&quot;</span>):
                    b64 = url.split(<span class="hljs-string">&quot;,&quot;</span>, <span class="hljs-number">1</span>)[<span class="hljs-number">1</span>]
                    images.append(Image.<span class="hljs-built_in">open</span>(io.BytesIO(base64.b64decode(b64))))
    <span class="hljs-keyword">return</span> images

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Utility functions ready.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Load-the-Product-Catalog" class="common-anchor-header">Шаг 3: Загрузка каталога товаров</h3><p>Прочитайте файл products.csv и загрузите соответствующие изображения продуктов:</p>
<pre><code translate="no"><span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(PRODUCT_CSV, newline=<span class="hljs-string">&quot;&quot;</span>, encoding=<span class="hljs-string">&quot;utf-8&quot;</span>) <span class="hljs-keyword">as</span> f:
    products = <span class="hljs-built_in">list</span>(csv.DictReader(f))

product_images = []
<span class="hljs-keyword">for</span> p <span class="hljs-keyword">in</span> products:
    img = Image.<span class="hljs-built_in">open</span>(os.path.join(IMAGE_DIR, p[<span class="hljs-string">&quot;image_path&quot;</span>])).convert(<span class="hljs-string">&quot;RGB&quot;</span>)
    product_images.append(img)

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Loaded <span class="hljs-subst">{<span class="hljs-built_in">len</span>(products)}</span> products.&quot;</span>)
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">3</span>):
    p = products[i]
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{p[<span class="hljs-string">&#x27;product_id&#x27;</span>]}</span> | <span class="hljs-subst">{p[<span class="hljs-string">&#x27;category&#x27;</span>]}</span> | <span class="hljs-subst">{p[<span class="hljs-string">&#x27;color&#x27;</span>]}</span> | <span class="hljs-subst">{p[<span class="hljs-string">&#x27;style&#x27;</span>]}</span> | sales: <span class="hljs-subst">{p[<span class="hljs-string">&#x27;sales_count&#x27;</span>]}</span>&quot;</span>)
    display(product_images[i].resize((<span class="hljs-number">180</span>, <span class="hljs-built_in">int</span>(<span class="hljs-number">180</span> * product_images[i].height / product_images[i].width))))
<button class="copy-code-btn"></button></code></pre>
<p>Пример вывода:<br>

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image13.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Generate-Embeddings" class="common-anchor-header">Шаг 4: Генерация вкраплений</h3><p>Гибридный поиск требует двух типов векторов для каждого продукта.</p>
<p><strong>4.1 Плотные векторы: вкрапления изображений</strong></p>
<p>Модель nvidia/llama-nemotron-embed-vl-1b-v2 кодирует каждое изображение товара в 2048-мерный плотный вектор. Поскольку эта модель поддерживает как изображения, так и текст в общем векторном пространстве, одни и те же вкрапления работают для поиска по изображениям и по тексту.</p>
<pre><code translate="no"><span class="hljs-comment"># Dense embeddings: image → 2048-dim vector via OpenRouter API</span>
dense_vectors = get_image_embeddings(product_images, batch_size=<span class="hljs-number">5</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Dense vectors: <span class="hljs-subst">{dense_vectors.shape}</span>  (products x <span class="hljs-subst">{EMBED_DIM}</span>d)&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Выводы:</p>
<pre><code translate="no">Dense vectors: (40, 2048)  (products x 2048d)
<button class="copy-code-btn"></button></code></pre>
<p><strong>4,2 разреженных вектора: TF-IDF вкрапления текста</strong></p>
<p>Текстовые описания продуктов кодируются в разреженные векторы с помощью векторизатора TF-IDF от scikit-learn. Они позволяют получить соответствие на уровне ключевых слов, которое плотные векторы могут пропустить.</p>
<pre><code translate="no"><span class="hljs-comment"># Sparse embeddings: TF-IDF on product descriptions</span>
descriptions = [p[<span class="hljs-string">&quot;description&quot;</span>] <span class="hljs-keyword">for</span> p <span class="hljs-keyword">in</span> products]
tfidf = TfidfVectorizer(stop_words=<span class="hljs-string">&quot;english&quot;</span>, max_features=<span class="hljs-number">500</span>)
tfidf_matrix = tfidf.fit_transform(descriptions)

sparse_vectors = [sparse_to_dict(tfidf_matrix[i]) <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(products))]
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Sparse vectors: <span class="hljs-subst">{<span class="hljs-built_in">len</span>(sparse_vectors)}</span> products, vocab size: <span class="hljs-subst">{<span class="hljs-built_in">len</span>(tfidf.vocabulary_)}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Sample sparse vector (SKU001): <span class="hljs-subst">{<span class="hljs-built_in">len</span>(sparse_vectors[<span class="hljs-number">0</span>])}</span> non-zero terms&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Вывод:</p>
<pre><code translate="no">Sparse vectors: <span class="hljs-number">40</span> products, vocab size: <span class="hljs-number">179</span>
Sample sparse <span class="hljs-title function_">vector</span> <span class="hljs-params">(SKU001)</span>: <span class="hljs-number">11</span> non-zero terms
<button class="copy-code-btn"></button></code></pre>
<p><strong>Почему оба типа векторов?</strong> Плотные и разреженные векторы дополняют друг друга. Плотные векторы фиксируют визуальное сходство: цветовую палитру, силуэт одежды, общий стиль. Разреженные векторы фиксируют семантику ключевых слов: такие термины, как "цветочный", "миди" или "шифон", которые указывают на атрибуты товара. Сочетание обоих подходов дает значительно более высокое качество поиска, чем любой из них в отдельности.</p>
<h3 id="Step-5-Create-a-Milvus-Collection-with-Hybrid-Schema" class="common-anchor-header">Шаг 5: Создание коллекции Milvus с гибридной схемой</h3><p>На этом шаге создается единая коллекция Milvus, которая хранит плотные векторы, разреженные векторы и скалярные поля метаданных вместе. Эта единая схема обеспечивает гибридный поиск в одном запросе.</p>
<table>
<thead>
<tr><th><strong>Поле</strong></th><th><strong>Тип</strong></th><th><strong>Назначение</strong></th></tr>
</thead>
<tbody>
<tr><td>плотный_вектор</td><td>ПЛОТНЫЙ_ВЕКТОР (2048d)</td><td>Встраивание изображения, сходство COSINE</td></tr>
<tr><td>разреженный_вектор</td><td>SPARSE_FLOAT_VECTOR</td><td>Разреженный вектор TF-IDF, внутреннее произведение</td></tr>
<tr><td>категория</td><td>VARCHAR</td><td>Метка категории для фильтрации</td></tr>
<tr><td>счётчик_продаж</td><td>INT64</td><td>Исторический объем продаж для фильтрации</td></tr>
<tr><td>цвет, стиль, сезон</td><td>VARCHAR</td><td>Дополнительные метки метаданных</td></tr>
<tr><td>цена</td><td>FLOAT</td><td>Цена продукта</td></tr>
</tbody>
</table>
<pre><code translate="no">milvus_client = MilvusClient(uri=MILVUS_URI)

<span class="hljs-keyword">if</span> milvus_client.has_collection(COLLECTION):
    milvus_client.drop_collection(COLLECTION)

schema = milvus_client.create_schema(auto_id=<span class="hljs-literal">True</span>, enable_dynamic_field=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;product_id&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">20</span>)
schema.add_field(<span class="hljs-string">&quot;category&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
schema.add_field(<span class="hljs-string">&quot;color&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
schema.add_field(<span class="hljs-string">&quot;style&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
schema.add_field(<span class="hljs-string">&quot;season&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
schema.add_field(<span class="hljs-string">&quot;sales_count&quot;</span>, DataType.INT64)
schema.add_field(<span class="hljs-string">&quot;description&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">500</span>)
schema.add_field(<span class="hljs-string">&quot;price&quot;</span>, DataType.FLOAT)
schema.add_field(<span class="hljs-string">&quot;dense_vector&quot;</span>, DataType.FLOAT_VECTOR, dim=EMBED_DIM)
schema.add_field(<span class="hljs-string">&quot;sparse_vector&quot;</span>, DataType.SPARSE_FLOAT_VECTOR)

index_params = milvus_client.prepare_index_params()
index_params.add_index(field_name=<span class="hljs-string">&quot;dense_vector&quot;</span>, index_type=<span class="hljs-string">&quot;FLAT&quot;</span>, metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>)
index_params.add_index(field_name=<span class="hljs-string">&quot;sparse_vector&quot;</span>, index_type=<span class="hljs-string">&quot;SPARSE_INVERTED_INDEX&quot;</span>, metric_type=<span class="hljs-string">&quot;IP&quot;</span>)

milvus_client.create_collection(COLLECTION, schema=schema, index_params=index_params)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Milvus collection &#x27;<span class="hljs-subst">{COLLECTION}</span>&#x27; created with hybrid schema.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Вставьте данные о товаре:</p>
<pre><code translate="no"><span class="hljs-comment"># Insert all products</span>
rows = []
<span class="hljs-keyword">for</span> i, p <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(products):
    rows.append({
        <span class="hljs-string">&quot;product_id&quot;</span>: p[<span class="hljs-string">&quot;product_id&quot;</span>],
        <span class="hljs-string">&quot;category&quot;</span>: p[<span class="hljs-string">&quot;category&quot;</span>],
        <span class="hljs-string">&quot;color&quot;</span>: p[<span class="hljs-string">&quot;color&quot;</span>],
        <span class="hljs-string">&quot;style&quot;</span>: p[<span class="hljs-string">&quot;style&quot;</span>],
        <span class="hljs-string">&quot;season&quot;</span>: p[<span class="hljs-string">&quot;season&quot;</span>],
        <span class="hljs-string">&quot;sales_count&quot;</span>: <span class="hljs-built_in">int</span>(p[<span class="hljs-string">&quot;sales_count&quot;</span>]),
        <span class="hljs-string">&quot;description&quot;</span>: p[<span class="hljs-string">&quot;description&quot;</span>],
        <span class="hljs-string">&quot;price&quot;</span>: <span class="hljs-built_in">float</span>(p[<span class="hljs-string">&quot;price&quot;</span>]),
        <span class="hljs-string">&quot;dense_vector&quot;</span>: dense_vectors[i].tolist(),
        <span class="hljs-string">&quot;sparse_vector&quot;</span>: sparse_vectors[i],
    })

milvus_client.insert(COLLECTION, rows)
stats = milvus_client.get_collection_stats(COLLECTION)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted <span class="hljs-subst">{stats[<span class="hljs-string">&#x27;row_count&#x27;</span>]}</span> products into Milvus.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Выход:</p>
<pre><code translate="no">Inserted <span class="hljs-number">40</span> products <span class="hljs-keyword">into</span> Milvus.
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-6-Hybrid-Search-to-Find-Similar-Bestsellers" class="common-anchor-header">Шаг 6: Гибридный поиск для поиска похожих бестселлеров</h3><p>Это основной шаг поиска. Для каждого нового товара конвейер выполняет три операции одновременно:</p>
<ol>
<li><strong>Плотный поиск</strong>: находит продукты с визуально похожими вкраплениями изображений.</li>
<li><strong>Разрозненный поиск</strong>: находит продукты с совпадающими ключевыми словами в тексте с помощью TF-IDF.</li>
<li><strong>Скалярная фильтрация</strong>: ограничивает результаты одной категорией и товарами с sales_count &gt; 1500.</li>
<li><strong>Ранжирование RRF</strong>: объединяет плотный и разреженный списки результатов с помощью Reciprocal Rank Fusion.</li>
</ol>
<p>Загрузка нового продукта:</p>
<pre><code translate="no"><span class="hljs-comment"># Load new products</span>
<span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(NEW_PRODUCT_CSV, newline=<span class="hljs-string">&quot;&quot;</span>, encoding=<span class="hljs-string">&quot;utf-8&quot;</span>) <span class="hljs-keyword">as</span> f:
    new_products = <span class="hljs-built_in">list</span>(csv.DictReader(f))

<span class="hljs-comment"># Pick the first new product for demo</span>
new_prod = new_products[<span class="hljs-number">0</span>]
new_img = Image.<span class="hljs-built_in">open</span>(os.path.join(NEW_PRODUCT_DIR, new_prod[<span class="hljs-string">&quot;image_path&quot;</span>])).convert(<span class="hljs-string">&quot;RGB&quot;</span>)

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;New product: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;new_id&#x27;</span>]}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Category: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;category&#x27;</span>]}</span> | Style: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;style&#x27;</span>]}</span> | Season: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;season&#x27;</span>]}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Prompt hint: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;prompt_hint&#x27;</span>]}</span>&quot;</span>)
display(new_img.resize((<span class="hljs-number">300</span>, <span class="hljs-built_in">int</span>(<span class="hljs-number">300</span> * new_img.height / new_img.width))))
<button class="copy-code-btn"></button></code></pre>
<p>Выход:  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Закодировать новый продукт:</p>
<pre><code translate="no"><span class="hljs-comment"># Encode new product</span>
<span class="hljs-comment"># Dense: image embedding via API</span>
query_dense = get_image_embeddings([new_img], batch_size=<span class="hljs-number">1</span>)[<span class="hljs-number">0</span>]

<span class="hljs-comment"># Sparse: TF-IDF from text query</span>
query_text = <span class="hljs-string">f&quot;<span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;category&#x27;</span>]}</span> <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;style&#x27;</span>]}</span> <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;season&#x27;</span>]}</span> <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;prompt_hint&#x27;</span>]}</span>&quot;</span>
query_sparse = sparse_to_dict(tfidf.transform([query_text])[<span class="hljs-number">0</span>])

<span class="hljs-comment"># Scalar filter</span>
filter_expr = <span class="hljs-string">f&#x27;category == &quot;<span class="hljs-subst">{new_prod[<span class="hljs-string">&quot;category&quot;</span>]}</span>&quot; and sales_count &gt; 1500&#x27;</span>

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Dense query: <span class="hljs-subst">{query_dense.shape}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Sparse query: <span class="hljs-subst">{<span class="hljs-built_in">len</span>(query_sparse)}</span> non-zero terms&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Filter: <span class="hljs-subst">{filter_expr}</span>&quot;</span>)

<button class="copy-code-btn"></button></code></pre>
<p>Выход:</p>
<pre><code translate="no"><span class="hljs-title class_">Dense</span> <span class="hljs-attr">query</span>: (<span class="hljs-number">2048</span>,)
<span class="hljs-title class_">Sparse</span> <span class="hljs-attr">query</span>: <span class="hljs-number">6</span> non-zero terms
<span class="hljs-title class_">Filter</span>: category == <span class="hljs-string">&quot;midi_dress&quot;</span> and sales_count &gt; <span class="hljs-number">1500</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Выполнить гибридный поиск</strong></p>
<p>Ключевые вызовы API здесь:</p>
<ul>
<li>AnnSearchRequest создает отдельные поисковые запросы для плотных и разреженных векторных полей.</li>
<li>expr=filter_expr применяет скалярную фильтрацию в каждом поисковом запросе.</li>
<li>RRFRanker(k=60) объединяет два ранжированных списка результатов с помощью алгоритма Reciprocal Rank Fusion.</li>
<li>hybrid_search выполняет оба запроса и возвращает объединенные, переранжированные результаты.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Hybrid search: dense + sparse + scalar filter + RRF reranking</span>
dense_req = AnnSearchRequest(
    data=[query_dense.tolist()],
    anns_field=<span class="hljs-string">&quot;dense_vector&quot;</span>,
    param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
    limit=<span class="hljs-number">20</span>,
    expr=filter_expr,
)
sparse_req = AnnSearchRequest(
    data=[query_sparse],
    anns_field=<span class="hljs-string">&quot;sparse_vector&quot;</span>,
    param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>},
    limit=<span class="hljs-number">20</span>,
    expr=filter_expr,
)

results = milvus_client.hybrid_search(
    collection_name=COLLECTION,
    reqs=[dense_req, sparse_req],
    ranker=RRFRanker(k=<span class="hljs-number">60</span>),
    limit=TOP_K,
    output_fields=[<span class="hljs-string">&quot;product_id&quot;</span>, <span class="hljs-string">&quot;category&quot;</span>, <span class="hljs-string">&quot;color&quot;</span>, <span class="hljs-string">&quot;style&quot;</span>, <span class="hljs-string">&quot;season&quot;</span>,
                   <span class="hljs-string">&quot;sales_count&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>, <span class="hljs-string">&quot;price&quot;</span>],
)

<span class="hljs-comment"># Display retrieved bestsellers</span>
retrieved_products = []
retrieved_images = []
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Top-<span class="hljs-subst">{TOP_K}</span> similar bestsellers:\n&quot;</span>)
<span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
    entity = hit[<span class="hljs-string">&quot;entity&quot;</span>]
    pid = entity[<span class="hljs-string">&quot;product_id&quot;</span>]
    img = Image.<span class="hljs-built_in">open</span>(os.path.join(IMAGE_DIR, <span class="hljs-string">f&quot;<span class="hljs-subst">{pid}</span>.jpg&quot;</span>)).convert(<span class="hljs-string">&quot;RGB&quot;</span>)
    retrieved_products.append(entity)
    retrieved_images.append(img)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{pid}</span> | <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;category&#x27;</span>]}</span> | <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;color&#x27;</span>]}</span> | <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;style&#x27;</span>]}</span> &quot;</span>
          <span class="hljs-string">f&quot;| sales: <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;sales_count&#x27;</span>]}</span> | $<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;price&#x27;</span>]:<span class="hljs-number">.1</span>f}</span> | score: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;description&#x27;</span>]}</span>&quot;</span>)
    display(img.resize((<span class="hljs-number">250</span>, <span class="hljs-built_in">int</span>(<span class="hljs-number">250</span> * img.height / img.width))))
    <span class="hljs-built_in">print</span>()
<button class="copy-code-btn"></button></code></pre>
<p>Выходные данные: 3 наиболее похожих бестселлера, ранжированные по слиянию рангов.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-7-Analyze-Bestseller-Style-with-Qwen-35" class="common-anchor-header">Шаг 7: Анализ стиля бестселлеров с помощью Qwen 3.5</h3><p>Мы загружаем полученные изображения бестселлеров в Qwen 3.5 и просим его извлечь их общую визуальную ДНК: композицию сцены, освещение, позу модели и общее настроение. В результате анализа мы получаем подсказку одного поколения, готовую к передаче в Nano Banana 2.</p>
<pre><code translate="no">content = [
    {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: {<span class="hljs-string">&quot;url&quot;</span>: image_to_uri(img)}}
    <span class="hljs-keyword">for</span> img in retrieved_images
]
content.<span class="hljs-built_in">append</span>({
    <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>,
    <span class="hljs-string">&quot;text&quot;</span>: (
        <span class="hljs-string">&quot;These are our top-selling fashion product photos.\n\n&quot;</span>
        <span class="hljs-string">&quot;Analyze their common visual style in these dimensions:\n&quot;</span>
        <span class="hljs-string">&quot;1. Scene / background setting\n&quot;</span>
        <span class="hljs-string">&quot;2. Lighting and color tone\n&quot;</span>
        <span class="hljs-string">&quot;3. Model pose and framing\n&quot;</span>
        <span class="hljs-string">&quot;4. Overall mood and aesthetic\n\n&quot;</span>
        <span class="hljs-string">&quot;Then, based on this analysis, write ONE concise image generation prompt &quot;</span>
        <span class="hljs-string">&quot;(under 100 words) that captures this style. The prompt should describe &quot;</span>
        <span class="hljs-string">&quot;a scene for a model wearing a new clothing item. &quot;</span>
        <span class="hljs-string">&quot;Output ONLY the prompt, nothing else.&quot;</span>
    ),
})

response = llm.chat.completions.create(
    model=LLM_MODEL,
    messages=[{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: content}],
    max_tokens=<span class="hljs-number">512</span>,
    temperature=<span class="hljs-number">0.7</span>,
)
style_prompt = response.choices[<span class="hljs-number">0</span>].message.content.strip()
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Style prompt from Qwen3.5:\n&quot;</span>)
<span class="hljs-built_in">print</span>(style_prompt)
<button class="copy-code-btn"></button></code></pre>
<p>Образец выходных данных:</p>
<pre><code translate="no">Style prompt from Qwen3.5:

Professional full-body fashion photograph of a model wearing a stylish new dress.
Bright, soft high-key lighting that illuminates the subject evenly. Clean,
uncluttered background, either stark white or a softly blurred bright outdoor
setting. The model stands in a relaxed, natural pose to showcase the garment&#x27;s
silhouette and drape. Sharp focus, vibrant colors, fresh and elegant commercial aesthetic.
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-8-Generate-the-Promotional-Image-with-Nano-Banana-2" class="common-anchor-header">Шаг 8: Генерация рекламного изображения с помощью Nano Banana 2</h3><p>Мы передаем в Nano Banana 2 три входных сигнала: фотографию нового продукта на плоской поверхности, изображение бестселлера, занимающего первое место в рейтинге, и подсказку о стиле, которую мы извлекли на предыдущем шаге. Модель объединяет их в рекламную фотографию, которая сочетает новый предмет одежды с проверенным визуальным стилем.</p>
<pre><code translate="no">gen_prompt = (
    <span class="hljs-string">f&quot;I have a new clothing product (Image 1: flat-lay photo) and a reference &quot;</span>
    <span class="hljs-string">f&quot;promotional photo from our bestselling catalog (Image 2).\n\n&quot;</span>
    <span class="hljs-string">f&quot;Generate a professional e-commerce promotional photograph of a female model &quot;</span>
    <span class="hljs-string">f&quot;wearing the clothing from Image 1.\n\n&quot;</span>
    <span class="hljs-string">f&quot;Style guidance: <span class="hljs-subst">{style_prompt}</span>\n\n&quot;</span>
    <span class="hljs-string">f&quot;Scene hint: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;prompt_hint&#x27;</span>]}</span>\n\n&quot;</span>
    <span class="hljs-string">f&quot;Requirements:\n&quot;</span>
    <span class="hljs-string">f&quot;- Full body shot, photorealistic, high quality\n&quot;</span>
    <span class="hljs-string">f&quot;- The clothing should match Image 1 exactly\n&quot;</span>
    <span class="hljs-string">f&quot;- The photo style and mood should match Image 2&quot;</span>
)

gen_content = [
    {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: {<span class="hljs-string">&quot;url&quot;</span>: image_to_uri(new_img)}},
    {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: {<span class="hljs-string">&quot;url&quot;</span>: image_to_uri(retrieved_images[<span class="hljs-number">0</span>])}},
    {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: gen_prompt},
]

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Generating promotional photo with Nano Banana 2...&quot;</span>)
gen_response = llm.chat.completions.create(
    model=IMAGE_GEN_MODEL,
    messages=[{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: gen_content}],
    extra_body={
        <span class="hljs-string">&quot;modalities&quot;</span>: [<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;image&quot;</span>],
        <span class="hljs-string">&quot;image_config&quot;</span>: {<span class="hljs-string">&quot;aspect_ratio&quot;</span>: <span class="hljs-string">&quot;3:4&quot;</span>, <span class="hljs-string">&quot;image_size&quot;</span>: <span class="hljs-string">&quot;2K&quot;</span>},
    },
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Done!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Ключевые параметры для вызова API Nano Banana 2:</p>
<ul>
<li>modalities: [&quot;текст&quot;, &quot;изображение&quot;]: определяет, что ответ должен содержать изображение.</li>
<li>image_config.aspect_ratio: управляет соотношением сторон выводимого изображения (3:4 хорошо подходит для портретных/модных снимков).</li>
<li>image_config.image_size: задает разрешение. Nano Banana 2 поддерживает разрешение от 512px до 4K.</li>
</ul>
<p>Извлеките сгенерированное изображение:</p>
<pre><code translate="no">generated_images = extract_images(gen_response)

text_content = gen_response.choices[<span class="hljs-number">0</span>].message.content
<span class="hljs-keyword">if</span> text_content:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Model response: <span class="hljs-subst">{text_content[:<span class="hljs-number">300</span>]}</span>\n&quot;</span>)

<span class="hljs-keyword">if</span> generated_images:
    <span class="hljs-keyword">for</span> i, img <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(generated_images):
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;--- Generated promo photo <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span> ---&quot;</span>)
        display(img)
        img.save(<span class="hljs-string">f&quot;promo_<span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;new_id&#x27;</span>]}</span>_<span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>.png&quot;</span>)
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Saved: promo_<span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;new_id&#x27;</span>]}</span>_<span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>.png&quot;</span>)
<span class="hljs-keyword">else</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;No image generated. Raw response:&quot;</span>)
    <span class="hljs-built_in">print</span>(gen_response.model_dump())
<button class="copy-code-btn"></button></code></pre>
<p>Выход:  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-9-Side-by-Side-Comparison" class="common-anchor-header">Шаг 9: Сравнение бок о бок</h3><p>На выходе мы видим общие черты: освещение мягкое и ровное, поза модели выглядит естественно, а настроение соответствует бестселлеру.</p>
<p>Где мы видим недостаток, так это в смешивании одежды. Кардиган выглядит наклеенным на модель, а не надетым, а белый ярлык на горловине просвечивает. Однопроходная генерация не справляется с такой тонкой интеграцией одежды с телом, поэтому в кратком обзоре мы рассмотрим обходные пути.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image10.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-10-Batch-Generation-for-All-New-Products" class="common-anchor-header">Шаг 10: Пакетная генерация для всех новых продуктов</h3><p>Мы сворачиваем весь конвейер в одну функцию и запускаем ее для всех оставшихся новых продуктов. Для краткости код пакетной генерации здесь не приводится; если вам нужна полная реализация, обращайтесь.</p>
<p>В результатах пакетной обработки выделяются две вещи. Подсказки по стилю, которые мы получаем от <strong>Qwen 3.5</strong>, значительно корректируются в зависимости от продукта: летнее платье и зимний трикотаж получают совершенно разные описания сцены в зависимости от сезона, сценария использования и аксессуаров. Изображения, которые мы получаем от <strong>Nano Banana 2</strong>, в свою очередь, не уступают реальным студийным фотографиям по освещению, текстуре и композиции.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>В этой статье мы рассказали о том, что нового привнесла Nano Banana 2 в создание изображений для электронной коммерции, сравнили ее с оригинальной Nano Banana и Pro в реальных производственных задачах и рассказали о том, как построить конвейер преобразования бестселлеров в изображения с помощью Milvus, Qwen 3.5 и Nano Banana 2.</p>
<p>Этот конвейер имеет четыре практических преимущества:</p>
<ul>
<li><strong>Контролируемая стоимость, предсказуемые бюджеты.</strong> Модель встраивания (Llama Nemotron Embed VL 1B v2) бесплатна на OpenRouter. Nano Banana 2 стоит примерно в два раза дешевле Pro в расчете на одно изображение, а встроенный мультиформатный вывод позволяет избежать циклов доработки, которые раньше удваивали или утраивали эффективный счет. Для команд электронной коммерции, управляющих тысячами SKU в сезон, такая предсказуемость означает, что производство изображений масштабируется вместе с каталогом, а не выбивается из бюджета.</li>
<li><strong>Сплошная автоматизация, ускоренное время выхода на рынок.</strong> Поток от фотографии товара на плоском слое до готового рекламного изображения проходит без ручного вмешательства. Новый продукт может пройти путь от фотографии со склада до готового к размещению на рынке изображения за несколько минут, а не дней, что особенно важно в пиковые сезоны, когда оборот каталога наиболее высок.</li>
<li><strong>Не требуется локальный GPU, более низкий барьер для входа.</strong> Каждая модель работает через API OpenRouter. Команда, не имеющая инфраструктуры ML и выделенного штата инженеров, может запустить этот конвейер с ноутбука. Ничего не нужно предоставлять, ничего не нужно обслуживать, и нет никаких предварительных инвестиций в оборудование.</li>
<li><strong>Более высокая точность поиска, более высокая согласованность бренда.</strong> Milvus сочетает плотную, разреженную и скалярную фильтрацию в одном запросе, неизменно превосходя одновекторные подходы для сопоставления товаров. На практике это означает, что созданные изображения надежнее наследуют устоявшийся визуальный язык вашего бренда: освещение, композицию и стиль, которые уже доказали, что ваши существующие бестселлеры конвертируются. Полученные изображения выглядят так, как будто им самое место в вашем магазине, а не как общие стоковые иллюстрации ИИ.</li>
</ul>
<p>Есть и ограничения, о которых стоит сказать прямо:</p>
<ul>
<li><strong>Смешивание одежды с телом.</strong> При однопроходной генерации одежда может выглядеть скорее композитной, чем ношеной. Мелкие детали, например мелкие аксессуары, иногда размываются. Выход: поэтапная генерация (сначала фон, затем поза модели, затем композиция). Такой многопроходный подход дает более узкий охват каждого этапа и значительно улучшает качество смешивания.</li>
<li><strong>Точность детализации в крайних случаях.</strong> Аксессуары, узоры и макеты с большим количеством текста могут потерять четкость. Решение: добавьте явные ограничения в подсказку генерации ("одежда естественно сидит на теле, нет открытых ярлыков, нет лишних элементов, детали изделия четкие"). Если качество конкретного продукта по-прежнему оставляет желать лучшего, переключитесь на Nano Banana Pro для окончательной обработки.</li>
</ul>
<p><a href="https://milvus.io/">Milvus</a> - это векторная база данных с открытым исходным кодом, на основе которой осуществляется гибридный поиск, и если вы хотите поработать с ней или попробовать вставить свои собственные фотографии товаров,<a href="https://milvus.io/docs">быстрый старт</a> <a href="https://milvus.io/docs"></a><a href="https://milvus.io/docs"></a> займет около десяти минут. У нас довольно активное сообщество на <a href="https://discord.gg/milvus"></a><a href="https://discord.gg/milvus">Discord</a> и Slack, и мы с удовольствием посмотрим, что люди создадут с его помощью. И если вы запустите Nano Banana 2 на другой вертикали продуктов или в большем каталоге, пожалуйста, поделитесь результатами! Мы будем рады услышать о них.</p>
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
<li><a href="https://milvus.io/blog/nano-banana-milvus-turning-hype-into-enterprise-ready-multimodal-rag.md">Nano Banana + Milvus: превращение хайпа в мультимодальный RAG, готовый для предприятий</a></li>
<li><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">Что такое OpenClaw? Полное руководство по агенту искусственного интеллекта с открытым исходным кодом</a></li>
<li><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Учебник по OpenClaw: Подключение к Slack для локального ИИ-ассистента</a></li>
<li><a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">Мы извлекли систему памяти OpenClaw и выложили ее в открытый доступ (memsearch)</a></li>
<li><a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">Постоянная память для кода Клода: memsearch ccplugin</a></li>
</ul>
