---
id: deepseek-v4-vs-gpt-55-vs-qwen36-which-model-should-you-use.md
title: 'DeepSeek V4 vs GPT-5.5 vs Qwen3.6: Какую модель следует использовать?'
author: Lumina Wang
date: 2026-4-28
cover: >-
  assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_1_98e0113041.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'DeepSeek V4, GPT-5.5 benchmark, Milvus RAG, Qwen3.6, vector database'
meta_title: |
  DeepSeek V4 RAG Benchmark with Milvus vs GPT-5.5 and Qwen
desc: >-
  Сравните DeepSeek V4, GPT-5.5 и Qwen3.6 в тестах на извлечение, отладку и
  длинный контекст, а затем постройте конвейер Milvus RAG с DeepSeek V4.
origin: >-
  https://milvus.io/blog/deepseek-v4-vs-gpt-55-vs-qwen36-which-model-should-you-use.md
---
<p>Выпуск новых моделей происходит быстрее, чем производственные команды успевают их оценить. DeepSeek V4, GPT-5.5 и Qwen3.6-35B-A3B выглядят убедительно на бумаге, но для разработчиков приложений ИИ более сложным является практический вопрос: какую модель использовать для систем с большим объемом поиска, задач кодирования, анализа длинных контекстов и <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">конвейеров RAG</a>?</p>
<p><strong>В этой статье проводится сравнение трех моделей в практических тестах:</strong> поиск информации в реальном времени, отладка в режиме параллелизма и поиск по длинным контекстным маркерам. Затем показано, как подключить DeepSeek V4 к <a href="https://zilliz.com/learn/what-is-vector-database">векторной базе данных Milvus</a>, чтобы извлекать контекст из базы знаний с возможностью поиска, а не из одних только параметров модели.</p>
<h2 id="What-Are-DeepSeek-V4-GPT-55-and-Qwen36-35B-A3B" class="common-anchor-header">Что такое DeepSeek V4, GPT-5.5 и Qwen3.6-35B-A3B?<button data-href="#What-Are-DeepSeek-V4-GPT-55-and-Qwen36-35B-A3B" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>DeepSeek V4, GPT-5.5 и Qwen3.6-35B-A3B - это разные модели ИИ, нацеленные на разные части стека моделей.</strong> DeepSeek V4 фокусируется на открытых длинноконтекстных выводах. GPT-5.5 нацелен на производительность в пограничных условиях, кодирование, онлайн-исследования и задачи, требующие большого количества инструментов. Qwen3.6-35B-A3B нацелен на открытое мультимодальное развертывание с гораздо меньшим активным параметром.</p>
<p>Сравнение имеет значение, потому что <a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">производственная</a> система <a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">векторного поиска</a> редко зависит только от модели. Возможности модели, длина контекста, контроль развертывания, качество поиска и стоимость обслуживания - все это влияет на конечный пользовательский опыт.</p>
<h3 id="DeepSeek-V4-An-Open-Weight-MoE-Model-for-Long-Context-Cost-Control" class="common-anchor-header">DeepSeek V4: модель MoE с открытым весом для контроля стоимости длинного контекста</h3><p><a href="https://api-docs.deepseek.com/news/news260424"><strong>DeepSeek V4</strong></a> <strong>- это семейство моделей MoE с открытым весом, выпущенное компанией DeepSeek 24 апреля 2026 года.</strong> В официальном релизе перечислены два варианта: DeepSeek V4-Pro и DeepSeek V4-Flash. V4-Pro имеет 1,6T общих параметров с 49B активируемыми на токен, в то время как V4-Flash имеет 284B общих параметров с 13B активируемыми на токен. Оба устройства поддерживают контекстное окно размером 1М токенов.</p>
<p>В <a href="https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro">карточке модели DeepSeek V4-Pro</a> также указано, что модель лицензирована MIT и доступна через Hugging Face и ModelScope. Для команд, создающих длинные контекстные документообороты, основной привлекательностью является контроль затрат и гибкость развертывания по сравнению с полностью закрытыми пограничными API.</p>
<h3 id="GPT-55-A-Hosted-Frontier-Model-for-Coding-Research-and-Tool-Use" class="common-anchor-header">GPT-5.5: хостируемая пограничная модель для кодирования, исследований и использования инструментов</h3><p><a href="https://openai.com/index/introducing-gpt-5-5/"><strong>GPT-5.5</strong></a> <strong>- это закрытая пограничная модель, выпущенная OpenAI 23 апреля 2026 года.</strong> OpenAI позиционирует ее для кодирования, онлайн-исследований, анализа данных, работы с документами, электронными таблицами, работы с программным обеспечением и задач с использованием инструментов. В официальной документации модели <code translate="no">gpt-5.5</code> указано контекстное окно API с 1 млн токенов, в то время как ограничения продуктов Codex и ChatGPT могут отличаться.</p>
<p>OpenAI демонстрирует высокие результаты в бенчмарках кодирования: 82,7% в Terminal-Bench 2.0, 73,1% в Expert-SWE и 58,6% в SWE-Bench Pro. Компромисс заключается в цене: официальные цены API указывают GPT-5.5 по цене <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>5</mi><mn>за 1M входных токенов и 5</mn></mrow><annotation encoding="application/x-tex">за 1M выходных токенов, а</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span></span></span></span>- 5 за 1M входных токенов и <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord mathnormal">30</span></span></span></span>за 1M выходных токенов, без каких-либо подробностей о ценах для конкретного продукта или длинного контекста.</p>
<h3 id="Qwen36-35B-A3B-A-Smaller-Active-Parameter-Model-for-Local-and-Multimodal-Workloads" class="common-anchor-header">Qwen3.6-35B-A3B: модель с меньшими активными параметрами для локальных и мультимодальных рабочих нагрузок</h3><p><a href="https://huggingface.co/Qwen/Qwen3.6-35B-A3B"><strong>Qwen3.6-35B-A3B</strong></a> <strong>- это модель MoE с открытым весом от команды Qwen компании Alibaba.</strong> В карточке модели перечислены 35B общих параметров, 3B активируемых параметров, кодер технического зрения и лицензирование Apache-2.0. Она поддерживает встроенное контекстное окно на 262 144 токена и может расширяться до 1 010 000 токенов с помощью масштабирования YaRN.</p>
<p>Это делает Qwen3.6-35B-A3B привлекательным, когда локальное развертывание, частный сервис, ввод изображений и текстов или китайскоязычные рабочие нагрузки важнее, чем удобство управляемой пограничной модели.</p>
<h3 id="DeepSeek-V4-vs-GPT-55-vs-Qwen36-Model-Specs-Compared" class="common-anchor-header">DeepSeek V4 vs GPT-5.5 vs Qwen3.6: Сравнение характеристик моделей</h3><table>
<thead>
<tr><th>Модель</th><th>Модель развертывания</th><th>Публичная информация о параметрах</th><th>Контекстное окно</th><th>Самое сильное соответствие</th></tr>
</thead>
<tbody>
<tr><td>DeepSeek V4-Pro</td><td>Открытый вес MoE; доступен API</td><td>1.6T всего / 49B активных</td><td>1 млн токенов</td><td>Долгосрочные контекстные, чувствительные к затратам инженерные развертывания</td></tr>
<tr><td>GPT-5.5</td><td>Закрытая хостинговая модель</td><td>Нераскрытый</td><td>1М токенов в API</td><td>Кодирование, исследования в реальном времени, использование инструментов и наивысшие общие возможности</td></tr>
<tr><td>Qwen3.6-35B-A3B</td><td>Мультимодальный MoE с открытым весом</td><td>35B всего / 3B активных</td><td>262K родной; ~1M с YaRN</td><td>Локальное/частное развертывание, мультимодальный ввод и сценарии на китайском языке</td></tr>
</tbody>
</table>
<h2 id="How-We-Tested-DeepSeek-V4-GPT-55-and-Qwen36" class="common-anchor-header">Как мы тестировали DeepSeek V4, GPT-5.5 и Qwen3.6<button data-href="#How-We-Tested-DeepSeek-V4-GPT-55-and-Qwen36" class="anchor-icon" translate="no">
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
    </button></h2><p>Эти тесты не являются заменой полноценным наборам бенчмарков. Они представляют собой практические проверки, отражающие общие вопросы разработчиков: может ли модель получить актуальную информацию, определить тонкие ошибки в коде и найти факты в очень длинном документе?</p>
<h3 id="Which-Model-Handles-Real-Time-Information-Retrieval-Best" class="common-anchor-header">Какая модель лучше всего справляется с поиском информации в режиме реального времени?</h3><p>Мы задали каждой модели три чувствительных к времени вопроса, используя веб-поиск, где это было возможно. Инструкция была проста: возвращайте только ответ и указывайте URL-адрес источника.</p>
<table>
<thead>
<tr><th>Вопрос</th><th>Ожидаемый ответ в момент тестирования</th><th>Источник</th></tr>
</thead>
<tbody>
<tr><td>Сколько стоит создание изображения среднего качества 1024×1024 с <code translate="no">gpt-image-2</code> с помощью API OpenAI?</td><td><code translate="no">$0.053</code></td><td><a href="https://developers.openai.com/api/docs/guides/image-generation">Цены на генерацию изображений OpenAI</a></td></tr>
<tr><td>Какая песня занимает первое место в Billboard Hot 100 на этой неделе и кто ее исполнитель?</td><td><code translate="no">Choosin' Texas</code> Элла Лэнгли</td><td><a href="https://www.billboard.com/charts/hot-100/">Чарт Billboard Hot 100</a></td></tr>
<tr><td>Кто сейчас лидирует в зачете пилотов Формулы-1 2026 года?</td><td>Кими Антонелли</td><td><a href="https://www.formula1.com/en/results/2026/drivers">Турнирная таблица Формулы-1</a></td></tr>
</tbody>
</table>
<table>
<thead>
<tr><th>Примечание: Это вопросы с учетом времени. Ожидаемые ответы отражают результаты на момент проведения теста.</th></tr>
</thead>
<tbody>
</tbody>
</table>
<p>На странице ценообразования изображений OpenAI для результата $0,053 1024×1024 используется обозначение "средний", а не "стандартный", поэтому здесь вопрос нормализован, чтобы соответствовать текущей формулировке API.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_2_408d990bb6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_3_082d496650.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_4_7fd44e596b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Real-Time-Retrieval-Results-GPT-55-Had-the-Clearest-Advantage" class="common-anchor-header">Результаты поиска в реальном времени: GPT-5.5 имеет явное преимущество</h3><h4 id="DeepSeek-V4-Pro" class="common-anchor-header">DeepSeek V4-Pro</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_5_1e9d7c4c06.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>DeepSeek V4-Pro ответил на первый вопрос неверно. На второй и третий вопросы с помощью живого веб-поиска он ответить не смог.</p>
<p>Во втором ответе был указан правильный URL-адрес Billboard, но не была найдена текущая песня № 1. В третьем ответе использовался неверный источник, поэтому мы посчитали его неверным.</p>
<h4 id="GPT-55" class="common-anchor-header">GPT-5.5</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_6_b146956865.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>GPT-5.5 справился с этим тестом гораздо лучше. Его ответы были короткими, точными, обоснованными и быстрыми. Когда задача зависит от текущей информации, а модель имеет возможность оперативного поиска, GPT-5.5 имеет явное преимущество в этой ситуации.</p>
<h4 id="Qwen36-35B-A3B" class="common-anchor-header">Qwen3.6-35B-A3B</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_7_91686c177e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qwen3.6-35B-A3B показал результат, аналогичный DeepSeek V4-Pro. В этом случае у нее не было доступа к Интернету в реальном времени, поэтому она не смогла выполнить задачу поиска в реальном времени.</p>
<h2 id="Which-Model-Is-Better-at-Debugging-Concurrency-Bugs" class="common-anchor-header">Какая модель лучше справляется с отладкой ошибок параллелизма?<button data-href="#Which-Model-Is-Better-at-Debugging-Concurrency-Bugs" class="anchor-icon" translate="no">
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
    </button></h2><p>Во втором тесте использовался пример банковского перевода на Python с тремя уровнями проблем параллелизма. Задача состояла не только в том, чтобы найти очевидное состояние гонки, но и в том, чтобы объяснить, почему нарушается общий баланс, и предоставить исправленный код.</p>
<table>
<thead>
<tr><th>Слой</th><th>Проблема</th><th>Что идет не так</th></tr>
</thead>
<tbody>
<tr><td>Базовый</td><td>Условие гонки</td><td><code translate="no">if self.balance &gt;= amount</code> и <code translate="no">self.balance -= amount</code> не являются атомарными. Два потока могут одновременно пройти проверку баланса, а затем оба вычесть деньги.</td></tr>
<tr><td>Средний</td><td>Риск тупика</td><td>Наивная блокировка каждого счета может привести к тупику, когда передача A→B блокирует сначала A, а передача B→A блокирует сначала B. Это классический тупик ABBA.</td></tr>
<tr><td>Продвинутый</td><td>Неправильная область применения блокировки</td><td>Защита только <code translate="no">self.balance</code> не защищает <code translate="no">target.balance</code>. Корректное исправление должно блокировать оба аккаунта в стабильном порядке, обычно по идентификатору аккаунта, или использовать глобальную блокировку с меньшим параллелизмом.</td></tr>
</tbody>
</table>
<p>Подсказка и код показаны ниже:</p>
<pre><code translate="no" class="language-cpp">The following Python code simulates two bank accounts transferring
  money to each other. The total balance should always equal 2000,                                              
  but it often doesn&#x27;t after running.                                                                           
                                                                                                                
  Please:                                                                                                       
  1. Find ALL concurrency bugs in this code (not just the obvious one)                                          
  2. Explain why Total ≠ 2000 with a concrete thread execution example                                          
  3. Provide the corrected code                                                                                 
                                                                                                                
  import threading                                                                                              
                                                                  
  class BankAccount:
      def __init__(self, balance):
          self.balance = balance                                                                                
   
      def transfer(self, target, amount):                                                                       
          if self.balance &gt;= amount:                              
              self.balance -= amount
              target.balance += amount
              return True
          return False
                                                                                                                
  def stress_test():
      account_a = BankAccount(1000)                                                                             
      account_b = BankAccount(1000)                               

      def transfer_a_to_b():                                                                                    
          for _ in range(1000):
              account_a.transfer(account_b, 1)                                                                  
                                                                  
      def transfer_b_to_a():
          for _ in range(1000):
              account_b.transfer(account_a, 1)                                                                  
   
      threads = [threading.Thread(target=transfer_a_to_b) for _ in range(10)]                                   
      threads += [threading.Thread(target=transfer_b_to_a) for _ in range(10)]
                                                                                                                
      for t in threads: t.start()
      for t in threads: t.join()                                                                                
                                                                  
      print(f&quot;Total: {account_a.balance + account_b.balance}&quot;)                                                  
      print(f&quot;A: {account_a.balance}, B: {account_b.balance}&quot;)
                                                                                                                
  stress_test()
<button class="copy-code-btn"></button></code></pre>
<h3 id="Code-Debugging-Results-GPT-55-Gave-the-Most-Complete-Answer" class="common-anchor-header">Результаты отладки кода: GPT-5.5 дал наиболее полный ответ</h3><h4 id="DeepSeek-V4-Pro" class="common-anchor-header">DeepSeek V4-Pro</h4><p>DeepSeek V4-Pro дал краткий анализ и сразу перешел к решению с заказанной блокировкой, которое является стандартным способом избежать тупика ABBA. Ее ответ продемонстрировал правильное решение, но она не уделила много времени объяснению того, почему наивное решение на основе блокировки может привести к новому режиму отказа.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_8_e2b4c41c46.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h4 id="GPT-55" class="common-anchor-header">GPT-5.5</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_9_d6b1e62c32.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>GPT-5.5 показал наилучшие результаты в этом тесте. Он обнаружил основные проблемы, предвидел риск возникновения тупиковых ситуаций, объяснил, почему исходный код может дать сбой, и предоставил полную исправленную реализацию.</p>
<h4 id="Qwen36-35B-A3B" class="common-anchor-header">Qwen3.6-35B-A3B</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_10_1177f51906.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qwen3.6-35B-A3B точно определил ошибки, а его пример последовательности выполнения был понятен. Слабой частью было исправление: была выбрана глобальная блокировка на уровне класса, которая заставляет все учетные записи использовать одну и ту же блокировку. Это работает для небольшой симуляции, но для реальной банковской системы это плохой компромисс, потому что несвязанные переводы счетов все равно должны ждать одной и той же блокировки.</p>
<p><strong>Короче говоря,</strong> GPT-5.5 не только решил текущую проблему, но и предупредил о следующей ошибке, которую может ввести разработчик. DeepSeek V4-Pro дал самое чистое не-GPT исправление. Qwen3.6 нашел проблемы и создал рабочий код, но не указал на компромисс с масштабируемостью.</p>
<h2 id="Which-Model-Handles-Long-Context-Retrieval-Best" class="common-anchor-header">Какая модель лучше справляется с извлечением длинного контекста?<button data-href="#Which-Model-Handles-Long-Context-Retrieval-Best" class="anchor-icon" translate="no">
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
    </button></h2><p>Для теста на длинный контекст мы использовали полный текст <em>"Сна о Красной палате</em>", примерно 850 000 китайских иероглифов. Мы вставили скрытый маркер около позиции 500 000 символов:</p>
<p><code translate="no">【Milvus test verification code: ZK-7749-ALPHA】</code></p>
<p>Затем мы загрузили файл в каждую модель и попросили ее найти как содержание маркера, так и его положение.</p>
<h3 id="Long-Context-Retrieval-Results-GPT-55-Found-the-Marker-Most-Precisely" class="common-anchor-header">Результаты поиска по длинному контексту: GPT-5.5 нашел маркер наиболее точно</h3><h4 id="DeepSeek-V4-Pro" class="common-anchor-header">DeepSeek V4-Pro</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_11_1f1ee0ec72.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>DeepSeek V4-Pro нашел скрытый маркер, но не нашел правильную позицию символа. Кроме того, он указал неверный окружающий контекст. В этом тесте он, похоже, нашел маркер семантически, но потерял точную позицию во время анализа документа.</p>
<h4 id="GPT-55" class="common-anchor-header">GPT-5.5</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_12_5b09068036.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>GPT-5.5 правильно определил содержание маркера, позицию и окружающий контекст. Он сообщил о позиции как 500 002 и даже отличил нулевую и единичную индексацию. Окружающий контекст также соответствовал тексту, использованному при вставке маркера.</p>
<h4 id="Qwen36-35B-A3B" class="common-anchor-header">Qwen3.6-35B-A3B</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_13_ca4223c01d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qwen3.6-35B-A3B правильно нашел содержимое маркера и близлежащий контекст, но его оценка позиции была неверной.</p>
<h2 id="What-Do-These-Tests-Say-About-Model-Selection" class="common-anchor-header">Что эти тесты говорят о выборе модели?<button data-href="#What-Do-These-Tests-Say-About-Model-Selection" class="anchor-icon" translate="no">
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
    </button></h2><p>Эти три теста указывают на практическую модель выбора: <strong>GPT-5.5 - выбор по возможностям, DeepSeek V4-Pro - выбор по эффективности затрат на длинный контекст, а Qwen3.6-35B-A3B - выбор по локальному контролю.</strong></p>
<table>
<thead>
<tr><th>Модель</th><th>Наилучшее соответствие</th><th>Что произошло в наших тестах</th><th>Главное предостережение</th></tr>
</thead>
<tbody>
<tr><td>GPT-5.5</td><td>Лучшие общие возможности</td><td>Победа в тестах на поиск в реальном времени, отладку параллелизма и длинные контекстные маркеры</td><td>Более высокая стоимость; лучше всего, когда точность и использование инструментов оправдывают цену</td></tr>
<tr><td>DeepSeek V4-Pro</td><td>Длинноконтекстное развертывание с меньшими затратами</td><td>Обеспечивает самое сильное исправление ошибки параллелизма, не связанное с GPT, и находит содержимое маркеров</td><td>Нуждается во внешних инструментах поиска для живых веб-задач; точное отслеживание местоположения символов было слабее в этом тесте</td></tr>
<tr><td>Qwen3.6-35B-A3B</td><td>Локальное развертывание, открытые веса, мультимодальный ввод, китайскоязычные рабочие нагрузки</td><td>Хорошо справился с выявлением ошибок и пониманием длинного контекста.</td><td>Качество исправления было менее масштабируемым; прямой веб-доступ был недоступен в этой системе</td></tr>
</tbody>
</table>
<p>Используйте GPT-5.5, когда вам нужен самый сильный результат, а стоимость имеет второстепенное значение. Используйте DeepSeek V4-Pro, если вам нужен длинный контекст, низкая стоимость обслуживания и удобное развертывание API. Используйте Qwen3.6-35B-A3B, когда важнее всего открытые веса, частное развертывание, мультимодальная поддержка или контроль стека сервисов.</p>
<p>Однако для приложений с большим объемом поиска выбор модели - это только половина дела. Даже сильная модель длинного контекста работает лучше, если контекст извлекается, фильтруется и обосновывается специальной <a href="https://zilliz.com/learn/generative-ai">системой семантического поиска</a>.</p>
<h2 id="Why-RAG-Still-Matters-for-Long-Context-Models" class="common-anchor-header">Почему RAG все еще имеет значение для моделей с длинным контекстом<button data-href="#Why-RAG-Still-Matters-for-Long-Context-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>Длинное контекстное окно не устраняет необходимость поиска. Оно меняет стратегию поиска.</p>
<p>В приложении RAG модель не должна сканировать каждый документ по каждому запросу. <a href="https://zilliz.com/learn/introduction-to-unstructured-data">Архитектура векторной базы данных</a> хранит вкрапления, ищет семантически релевантные фрагменты, применяет фильтры метаданных и возвращает модели компактный контекстный набор. Это позволяет модели получить более качественные данные и одновременно снизить стоимость и время ожидания.</p>
<p>Milvus подходит на эту роль, потому что он обрабатывает <a href="https://milvus.io/docs/schema.md">схемы коллекций</a>, векторное индексирование, скалярные метаданные и операции поиска в одной системе. Вы можете начать локально с <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>, перейти к автономному <a href="https://milvus.io/docs/quickstart.md">Milvus quickstart</a>, развернуть с помощью <a href="https://milvus.io/docs/install_standalone-docker.md">установки Docker</a> или <a href="https://milvus.io/docs/install_standalone-docker-compose.md">развертывания Docker Compose</a> и масштабировать с помощью <a href="https://milvus.io/docs/install_cluster-milvusoperator.md">развертывания Kubernetes</a> при росте рабочей нагрузки.</p>
<h2 id="How-to-Build-a-RAG-Pipeline-with-Milvus-and-DeepSeek-V4" class="common-anchor-header">Как построить RAG-конвейер с помощью Milvus и DeepSeek V4<button data-href="#How-to-Build-a-RAG-Pipeline-with-Milvus-and-DeepSeek-V4" class="anchor-icon" translate="no">
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
    </button></h2><p>Ниже приводится описание построения небольшого конвейера RAG с использованием DeepSeek V4-Pro для генерации и Milvus для извлечения. Такая же структура применима и к другим LLM: создание вкраплений, хранение их в коллекции, поиск релевантного контекста и передача этого контекста в модель.</p>
<p>Более подробное описание можно найти в официальном <a href="https://milvus.io/docs/build-rag-with-milvus.md">руководстве по Milvus RAG</a>. В этом примере мы сохраняем небольшой конвейер, поэтому поток поиска легко просмотреть.</p>
<h2 id="Prepare-the-Environment" class="common-anchor-header">Подготовьте среду<button data-href="#Prepare-the-Environment" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Install-the-Dependencies" class="common-anchor-header">Установите зависимости</h3><pre><code translate="no" class="language-python">! pip install --upgrade <span class="hljs-string">&quot;pymilvus[model]&quot;</span> openai requests tqdm
<button class="copy-code-btn"></button></code></pre>
<p>Если вы используете Google Colab, вам может потребоваться перезапустить среду выполнения после установки зависимостей. Щелкните меню <strong>Runtime</strong>, затем выберите <strong>Restart session</strong>.</p>
<p>DeepSeek V4-Pro поддерживает API в стиле OpenAI. Войдите на официальный сайт DeepSeek и установите <code translate="no">DEEPSEEK_API_KEY</code> в качестве переменной окружения.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os

os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;DEEPSEEK_API_KEY&quot;</span>] = <span class="hljs-string">&quot;sk-*****************&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Prepare-the-Milvus-Documentation-Dataset" class="common-anchor-header">Подготовьте набор данных документации Milvus</h3><p>В качестве частного источника знаний мы используем страницы FAQ из <a href="https://github.com/milvus-io/milvus-docs/releases/download/v2.4.6-preview/milvus_docs_2.4.x_en.zip">архива документации Milvus 2.4.x</a>. Это простой стартовый набор данных для небольшой демонстрации RAG.</p>
<p>Сначала скачайте ZIP-архив и распакуйте документацию в папку <code translate="no">milvus_docs</code>.</p>
<pre><code translate="no" class="language-python">! wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
! unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs
<button class="copy-code-btn"></button></code></pre>
<p>Мы загружаем все файлы Markdown из папки <code translate="no">milvus_docs/en/faq</code>. Для каждого документа мы разделим содержимое файла по <code translate="no">#</code>, который грубо разделяет основные секции Markdown.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob

text_lines = []

<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()

    text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Set-Up-DeepSeek-V4-and-the-Embedding-Model" class="common-anchor-header">Настройка DeepSeek V4 и модели встраивания</h3><pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAI</span>

deepseek_client = <span class="hljs-title class_">OpenAI</span>(
    api_key=os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;DEEPSEEK_API_KEY&quot;</span>],
    base_url=<span class="hljs-string">&quot;https://api.deepseek.com&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>Далее выберите модель встраивания. В этом примере используется <code translate="no">DefaultEmbeddingFunction</code> из модуля моделей PyMilvus. Подробнее о <a href="https://milvus.io/docs/embeddings.md">функциях встраивания</a> читайте в документации Milvus.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model <span class="hljs-keyword">as</span> milvus_model

embedding_model = milvus_model.<span class="hljs-title class_">DefaultEmbeddingFunction</span>()
<button class="copy-code-btn"></button></code></pre>
<p>Сгенерируйте тестовый вектор, затем выведите размерность вектора и несколько первых элементов. Возвращаемая размерность используется при создании коллекции Milvus.</p>
<pre><code translate="no">test_embedding = embedding_model.encode_queries([<span class="hljs-string">&quot;This is a test&quot;</span>])[<span class="hljs-number">0</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embedding)
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embedding[:<span class="hljs-number">10</span>])
<span class="hljs-number">768</span>
[-<span class="hljs-number">0.04836066</span>  <span class="hljs-number">0.07163023</span> -<span class="hljs-number">0.01130064</span> -<span class="hljs-number">0.03789345</span> -<span class="hljs-number">0.03320649</span> -<span class="hljs-number">0.01318448</span>
 -<span class="hljs-number">0.03041712</span> -<span class="hljs-number">0.02269499</span> -<span class="hljs-number">0.02317863</span> -<span class="hljs-number">0.00426028</span>]
<button class="copy-code-btn"></button></code></pre>
<h2 id="Load-Data-into-Milvus" class="common-anchor-header">Загрузка данных в Milvus<button data-href="#Load-Data-into-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Create-a-Milvus-Collection" class="common-anchor-header">Создание коллекции Milvus</h3><p>Коллекция Milvus хранит векторные поля, скалярные поля и необязательные динамические метаданные. В приведенной ниже быстрой настройке используется высокоуровневый API <code translate="no">MilvusClient</code>; для рабочих схем ознакомьтесь с документами по <a href="https://milvus.io/docs/manage-collections.md">управлению коллекциями</a> и <a href="https://milvus.io/docs/create-collection.md">созданию коллекций</a>.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>

milvus_client = <span class="hljs-title class_">MilvusClient</span>(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)

collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Несколько замечаний о <code translate="no">MilvusClient</code>:</p>
<ul>
<li>Установка <code translate="no">uri</code> в локальный файл, например <code translate="no">./milvus.db</code>, - самый простой вариант, поскольку он автоматически использует <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a> и сохраняет все данные в этом файле.</li>
<li>Если у вас большой набор данных, вы можете установить более производительный сервер Milvus на <a href="https://milvus.io/docs/quickstart.md">Docker или Kubernetes</a>. При такой настройке используйте URI сервера, например <code translate="no">http://localhost:19530</code>, в качестве <code translate="no">uri</code>.</li>
<li>Если вы хотите использовать <a href="https://docs.zilliz.com/">Zilliz Cloud</a>, полностью управляемый облачный сервис для Milvus, установите <code translate="no">uri</code> и <code translate="no">token</code> на <a href="https://docs.zilliz.com/docs/connect-to-cluster">публичную конечную точку и ключ API</a> от Zilliz Cloud.</li>
</ul>
<p>Проверьте, существует ли уже коллекция. Если да, удалите ее.</p>
<pre><code translate="no" class="language-python">if milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)
<button class="copy-code-btn"></button></code></pre>
<p>Создайте новую коллекцию с указанными параметрами. Если мы не указываем информацию о полях, Milvus автоматически создает поле по умолчанию <code translate="no">id</code> в качестве первичного ключа и поле vector для хранения векторных данных. Зарезервированное поле JSON хранит скалярные данные, которые не определены в схеме.</p>
<pre><code translate="no" class="language-python">milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;IP&quot;</span>,  <span class="hljs-comment"># Inner product distance</span>
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,  <span class="hljs-comment"># Strong consistency level</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Метрика <code translate="no">IP</code> означает сходство по внутреннему произведению. Milvus также поддерживает другие типы метрик и варианты индексов в зависимости от типа вектора и рабочей нагрузки; см. руководства по <a href="https://milvus.io/docs/id/metric.md">типам метрик</a> и <a href="https://milvus.io/docs/index_selection.md">выбору индексов</a>. Параметр <code translate="no">Strong</code> является одним из доступных <a href="https://milvus.io/docs/consistency.md">уровней согласованности</a>.</p>
<h3 id="Insert-the-Embedded-Documents" class="common-anchor-header">Вставка встроенных документов</h3><p>Проанализируйте текстовые данные, создайте вкрапления и вставьте данные в Milvus. Здесь мы добавляем новое поле с именем <code translate="no">text</code>. Поскольку оно не определено в явном виде в схеме коллекции, оно автоматически добавляется в зарезервированное динамическое поле JSON. Для создания метаданных ознакомьтесь с <a href="https://milvus.io/docs/enable-dynamic-field.md">поддержкой динамических полей</a> и <a href="https://milvus.io/docs/json-field-overview.md">обзором полей JSON</a>.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm

data = []

doc_embeddings = embedding_model.encode_documents(text_lines)

<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})

milvus_client.insert(collection_name=collection_name, data=data)
Creating embeddings: <span class="hljs-number">100</span>%|█████████████████████████████████████████████████████████████████████████████████████████████████████████████████| <span class="hljs-number">72</span>/<span class="hljs-number">72</span> [<span class="hljs-number">00</span>:<span class="hljs-number">00</span>&lt;<span class="hljs-number">00</span>:<span class="hljs-number">00</span>, <span class="hljs-number">1222631.13</span>it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: <span class="hljs-number">72</span>, <span class="hljs-string">&#x27;ids&#x27;</span>: [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">3</span>, <span class="hljs-number">4</span>, <span class="hljs-number">5</span>, <span class="hljs-number">6</span>, <span class="hljs-number">7</span>, <span class="hljs-number">8</span>, <span class="hljs-number">9</span>, <span class="hljs-number">10</span>, <span class="hljs-number">11</span>, <span class="hljs-number">12</span>, <span class="hljs-number">13</span>, <span class="hljs-number">14</span>, <span class="hljs-number">15</span>, <span class="hljs-number">16</span>, <span class="hljs-number">17</span>, <span class="hljs-number">18</span>, <span class="hljs-number">19</span>, <span class="hljs-number">20</span>, <span class="hljs-number">21</span>, <span class="hljs-number">22</span>, <span class="hljs-number">23</span>, <span class="hljs-number">24</span>, <span class="hljs-number">25</span>, <span class="hljs-number">26</span>, <span class="hljs-number">27</span>, <span class="hljs-number">28</span>, <span class="hljs-number">29</span>, <span class="hljs-number">30</span>, <span class="hljs-number">31</span>, <span class="hljs-number">32</span>, <span class="hljs-number">33</span>, <span class="hljs-number">34</span>, <span class="hljs-number">35</span>, <span class="hljs-number">36</span>, <span class="hljs-number">37</span>, <span class="hljs-number">38</span>, <span class="hljs-number">39</span>, <span class="hljs-number">40</span>, <span class="hljs-number">41</span>, <span class="hljs-number">42</span>, <span class="hljs-number">43</span>, <span class="hljs-number">44</span>, <span class="hljs-number">45</span>, <span class="hljs-number">46</span>, <span class="hljs-number">47</span>, <span class="hljs-number">48</span>, <span class="hljs-number">49</span>, <span class="hljs-number">50</span>, <span class="hljs-number">51</span>, <span class="hljs-number">52</span>, <span class="hljs-number">53</span>, <span class="hljs-number">54</span>, <span class="hljs-number">55</span>, <span class="hljs-number">56</span>, <span class="hljs-number">57</span>, <span class="hljs-number">58</span>, <span class="hljs-number">59</span>, <span class="hljs-number">60</span>, <span class="hljs-number">61</span>, <span class="hljs-number">62</span>, <span class="hljs-number">63</span>, <span class="hljs-number">64</span>, <span class="hljs-number">65</span>, <span class="hljs-number">66</span>, <span class="hljs-number">67</span>, <span class="hljs-number">68</span>, <span class="hljs-number">69</span>, <span class="hljs-number">70</span>, <span class="hljs-number">71</span>], <span class="hljs-string">&#x27;cost&#x27;</span>: <span class="hljs-number">0</span>}
<button class="copy-code-btn"></button></code></pre>
<p>Для больших наборов данных эту схему можно расширить за счет явного проектирования схемы, <a href="https://milvus.io/docs/index-vector-fields.md">индексов векторных полей</a>, скалярных индексов и операций жизненного цикла данных, таких как <a href="https://milvus.io/docs/insert-update-delete.md">вставка, апсерт и удаление</a>.</p>
<h2 id="Build-the-RAG-Retrieval-Flow" class="common-anchor-header">Построение потока извлечения данных RAG<button data-href="#Build-the-RAG-Retrieval-Flow" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Search-Milvus-for-Relevant-Context" class="common-anchor-header">Поиск релевантного контекста в Milvus</h3><p>Давайте зададим распространенный вопрос о Milvus.</p>
<pre><code translate="no" class="language-python">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Выполните поиск в коллекции по этому вопросу и извлеките три лучших семантических совпадения. Это базовый <a href="https://milvus.io/docs/single-vector-search.md">одновекторный поиск</a>. В производстве вы можете комбинировать его с <a href="https://milvus.io/docs/filtered-search.md">фильтрованным поиском</a>, <a href="https://milvus.io/docs/full-text-search.md">полнотекстовым поиском</a>, <a href="https://milvus.io/docs/multi-vector-search.md">многовекторным гибридным поиском</a> и <a href="https://milvus.io/docs/reranking.md">стратегиями ранжирования</a> для повышения релевантности.</p>
<pre><code translate="no" class="language-python">search_res = milvus_client.search(
    collection_name=collection_name,
    data=embedding_model.encode_queries(
        [question]
    ),  <span class="hljs-comment"># Convert the question to an embedding vector</span>
    limit=<span class="hljs-number">3</span>,  <span class="hljs-comment"># Return top 3 results</span>
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},  <span class="hljs-comment"># Inner product distance</span>
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],  <span class="hljs-comment"># Return the text field</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Теперь давайте посмотрим на результаты поиска по этому запросу.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json

retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))

[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including [MinIO](https://min.io/), [AWS S3](https://aws.amazon.com/s3/?nc1=h_ls), [Google Cloud Storage](https://cloud.google.com/storage?hl=en#object-storage-for-companies-of-all-sizes) (GCS), [Azure Blob Storage](https://azure.microsoft.com/en-us/products/storage/blobs), [Alibaba Cloud OSS](https://www.alibabacloud.com/product/object-storage-service), and [Tencent Cloud Object Storage](https://www.tencentcloud.com/products/cos) (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        <span class="hljs-number">0.6572665572166443</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus flush data?\n\nMilvus returns success when inserted data are loaded to the message queue. However, the data are not yet flushed to the disk. Then Milvus&#x27; data node writes the data in the message queue to persistent storage as incremental logs. If `flush()` is called, the data node is forced to write all data in the message queue to persistent storage immediately.\n\n###&quot;</span>,
        <span class="hljs-number">0.6312146186828613</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus handle vector data types and precision?\n\nMilvus supports Binary, Float32, Float16, and BFloat16 vector types.\n\n- Binary vectors: Store binary data as sequences of 0s and 1s, used in image processing and information retrieval.\n- Float32 vectors: Default storage with a precision of about 7 decimal digits. Even Float64 values are stored with Float32 precision, leading to potential precision loss upon retrieval.\n- Float16 and BFloat16 vectors: Offer reduced precision and memory usage. Float16 is suitable for applications with limited bandwidth and storage, while BFloat16 balances range and efficiency, commonly used in deep learning to reduce computational requirements without significantly impacting accuracy.\n\n###&quot;</span>,
        <span class="hljs-number">0.6115777492523193</span>
    ]
]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Generate-a-RAG-Answer-with-DeepSeek-V4" class="common-anchor-header">Создание ответа RAG с помощью DeepSeek V4</h3><p>Преобразуйте полученные документы в строковый формат.</p>
<pre><code translate="no" class="language-python">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>Определите системные и пользовательские подсказки для LLM. Эта подсказка собирается из документов, полученных из Milvus.</p>
<pre><code translate="no" class="language-python">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
Human: You are an AI assistant. You are able to find answers to the questions from the contextual passage snippets provided.
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
<p>Используйте модель, предоставленную DeepSeek V4-Pro, чтобы сгенерировать ответ на основе запроса.</p>
<pre><code translate="no">response = deepseek_client.chat.completions.create(
    model=<span class="hljs-string">&quot;deepseek-v4-pro&quot;</span>,
    messages=[
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT},
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT},
    ],
)
print(response.choices[<span class="hljs-number">0</span>].message.content)
Milvus stores data <span class="hljs-keyword">in</span> two distinct ways depending <span class="hljs-keyword">on</span> the type:
- **Inserted data** (vector data, scalar data, <span class="hljs-keyword">and</span> collection-specific schema) are stored <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> incremental logs. Milvus supports multiple <span class="hljs-built_in">object</span> storage backends, such <span class="hljs-keyword">as</span> MinIO, AWS S3, Google Cloud Storage, Azure Blob Storage, Alibaba Cloud OSS, <span class="hljs-keyword">and</span> Tencent Cloud Object Storage. Before reaching persistent storage, the data <span class="hljs-keyword">is</span> initially loaded <span class="hljs-keyword">into</span> a message queue; a data node then writes it to disk, <span class="hljs-keyword">and</span> calling `flush()` forces an immediate write.
- **Metadata**, generated <span class="hljs-keyword">by</span> each Milvus module, <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> **etcd**.
<button class="copy-code-btn"></button></code></pre>
<p>На этом этапе конвейер завершил основной цикл RAG: встраивание документов, хранение векторов в Milvus, поиск релевантного контекста и генерация ответа с помощью DeepSeek V4-Pro.</p>
<h2 id="What-Should-You-Improve-Before-Production" class="common-anchor-header">Что нужно улучшить перед производством?<button data-href="#What-Should-You-Improve-Before-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>В демонстрации используется простое разбиение на секции и поиск по принципу top-k. Этого достаточно, чтобы продемонстрировать механику, но для производственного RAG обычно требуется больше контроля над поиском.</p>
<table>
<thead>
<tr><th>Для производства необходимо</th><th>Функции Milvus, которые следует рассмотреть</th><th>Почему это помогает</th></tr>
</thead>
<tbody>
<tr><td>Смешивать семантические сигналы и сигналы ключевых слов</td><td><a href="https://milvus.io/docs/hybrid_search_with_milvus.md">Гибридный поиск с Milvus</a></td><td>Сочетает плотный векторный поиск с разреженными или полнотекстовыми сигналами</td></tr>
<tr><td>Объединение результатов из нескольких ретриверов</td><td><a href="https://milvus.io/docs/milvus_hybrid_search_retriever.md">Гибридный поисковый ретривер Milvus</a></td><td>Позволяет рабочим процессам LangChain использовать взвешенное ранжирование или ранжирование в стиле RRF</td></tr>
<tr><td>Ограничение результатов по арендатору, временной метке или типу документа</td><td>Метаданные и скалярные фильтры</td><td>Обеспечивает поиск нужных фрагментов данных</td></tr>
<tr><td>Переход от самоуправляемого Milvus к управляемому сервису</td><td><a href="https://docs.zilliz.com/docs/migrate-from-milvus">Миграция с Milvus на Zilliz</a></td><td>Сокращение объема работ по созданию инфраструктуры при сохранении совместимости с Milvus</td></tr>
<tr><td>Безопасное подключение размещенных приложений</td><td><a href="https://docs.zilliz.com/docs/manage-api-keys">Ключи API Zilliz Cloud</a></td><td>Обеспечивает контроль доступа на основе токенов для клиентов приложений</td></tr>
</tbody>
</table>
<p>Самая важная производственная привычка - оценивать извлечение отдельно от генерации. Если извлекаемый контекст слаб, замена LLM часто скрывает проблему, а не решает ее.</p>
<h2 id="Get-Started-with-Milvus-and-DeepSeek-RAG" class="common-anchor-header">Начало работы с Milvus и DeepSeek RAG<button data-href="#Get-Started-with-Milvus-and-DeepSeek-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>Если вы хотите воспроизвести этот учебник, начните с официальной <a href="https://milvus.io/docs">документации по Milvus</a> и <a href="https://milvus.io/docs/build-rag-with-milvus.md">руководства по сборке RAG с Milvus</a>. Для управляемой настройки <a href="https://docs.zilliz.com/docs/connect-to-cluster">подключитесь к Zilliz Cloud</a> с помощью конечной точки кластера и API-ключа, а не запускайте Milvus локально.</p>
<p>Если вы хотите получить помощь в настройке чанкинга, индексации, фильтров или гибридного поиска, присоединяйтесь к <a href="https://slack.milvus.io/">сообществу Milvus Slack</a> или запишитесь на бесплатную <a href="https://milvus.io/office-hours">сессию Milvus Office Hours</a>. Если вы предпочитаете обойтись без настройки инфраструктуры, используйте <a href="https://cloud.zilliz.com/login">Zilliz Cloud login</a> или создайте <a href="https://cloud.zilliz.com/signup">учетную запись Zilliz Cloud</a> для запуска управляемого Milvus.</p>
<h2 id="Questions-Developers-Ask-About-DeepSeek-V4-Milvus-and-RAG" class="common-anchor-header">Вопросы, которые задают разработчики о DeepSeek V4, Milvus и RAG<button data-href="#Questions-Developers-Ask-About-DeepSeek-V4-Milvus-and-RAG" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Is-DeepSeek-V4-good-for-RAG" class="common-anchor-header">Подходит ли DeepSeek V4 для RAG?</h3><p>DeepSeek V4-Pro хорошо подходит для RAG, если вам нужна обработка длинных контекстов и более низкая стоимость обслуживания по сравнению с закрытыми моделями премиум-класса. Вам все еще нужен слой извлечения, такой как Milvus, чтобы отбирать релевантные фрагменты, применять фильтры метаданных и удерживать подсказки в фокусе.</p>
<h3 id="Should-I-use-GPT-55-or-DeepSeek-V4-for-a-RAG-pipeline" class="common-anchor-header">Следует ли использовать GPT-5.5 или DeepSeek V4 для конвейера RAG?</h3><p>Используйте GPT-5.5, если качество ответов, использование инструментов и живые исследования важнее стоимости. Используйте DeepSeek V4-Pro, когда обработка длинного контекста и контроль затрат имеют большее значение, особенно если ваш поисковый слой уже предоставляет высококачественный обоснованный контекст.</p>
<h3 id="Can-I-run-Qwen36-35B-A3B-locally-for-private-RAG" class="common-anchor-header">Могу ли я запустить Qwen3.6-35B-A3B локально для частного RAG?</h3><p>Да, Qwen3.6-35B-A3B имеет открытый вес и предназначен для более контролируемого развертывания. Это хороший кандидат, когда важна конфиденциальность, локальное обслуживание, мультимодальный ввод или производительность на китайском языке, но вам все равно нужно проверить задержку, память и качество извлечения для вашего оборудования.</p>
<h3 id="Do-long-context-models-make-vector-databases-unnecessary" class="common-anchor-header">Делают ли длинноконтекстные модели ненужными векторные базы данных?</h3><p>Нет. Длинноконтекстные модели могут читать больше текста, но они все равно выигрывают от поиска. Векторная база данных сужает входные данные до релевантных фрагментов, поддерживает фильтрацию метаданных, снижает стоимость токенов и облегчает обновление приложения по мере изменения документов.</p>
