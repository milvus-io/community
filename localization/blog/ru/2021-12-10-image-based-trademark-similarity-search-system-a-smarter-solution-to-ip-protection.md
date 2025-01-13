---
id: >-
  2021-12-10-image-based-trademark-similarity-search-system-a-smarter-solution-to-ip-protection.md
title: >-
  Milvus в сфере защиты ИС：Построение системы поиска сходства товарных знаков с
  помощью Milvus
author: Zilliz
date: 2021-12-10T00:00:00.000Z
desc: >-
  Узнайте, как применять поиск векторного сходства в сфере защиты
  интеллектуальной собственности.
cover: assets.zilliz.com/IP_protection_0a33547579.png
tag: Scenarios
---
<p>В последние годы вопрос защиты ИС оказался в центре внимания, поскольку люди все чаще задумываются о нарушении прав ИС. В частности, многонациональный технологический гигант Apple Inc. активно <a href="https://en.wikipedia.org/wiki/Apple_Inc._litigation">подает иски против различных компаний за нарушение прав ИС</a>, включая нарушение прав на товарные знаки, патенты и промышленные образцы. Помимо этих наиболее громких дел, в 2009 году Apple Inc. также <a href="https://www.smh.com.au/business/apple-bites-over-woolworths-logo-20091005-ghzr.html">оспорила заявку на товарный знак</a> австралийской сети супермаркетов <a href="https://www.smh.com.au/business/apple-bites-over-woolworths-logo-20091005-ghzr.html">Woolworths Limited</a>, сославшись на нарушение прав на товарный знак.  Apple. Inc утверждала, что логотип австралийского бренда, стилизованная буква &quot;w&quot;, напоминает их собственный логотип - яблоко. Поэтому Apple Inc. возражала против ассортимента товаров, включая электронные устройства, которые Woolworths хотела продавать с этим логотипом. История закончилась тем, что Woolworths изменила свой логотип, а Apple отозвала свое возражение.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Logo_of_Woolworths_b04ece5b20.png" alt="Logo of Woolworths.png" class="doc-image" id="logo-of-woolworths.png" />
   </span> <span class="img-wrapper"> <span>Логотип Woolworths.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Logo_of_Apple_Inc_181e5bd5f8.png" alt="Logo of Apple Inc.png" class="doc-image" id="logo-of-apple-inc.png" />
   </span> <span class="img-wrapper"> <span>Логотип Apple Inc.png</span> </span></p>
<p>С постоянно растущим осознанием культуры бренда компании внимательно следят за любыми угрозами, которые могут нанести ущерб их правам на интеллектуальную собственность (ИС). Нарушение прав ИС включает в себя:</p>
<ul>
<li>Нарушение авторских прав</li>
<li>нарушение патентных прав</li>
<li>Нарушение прав на товарные знаки</li>
<li>Нарушение дизайна</li>
<li>Киберсквоттинг</li>
</ul>
<p>Вышеупомянутый спор между Apple и Woolworths в основном связан с нарушением прав на товарный знак, а именно со сходством между изображениями товарных знаков этих двух компаний. Чтобы не стать еще одним Woolworths, исчерпывающий поиск сходства товарных знаков является важнейшим шагом для заявителей как перед подачей, так и во время рассмотрения заявок на товарные знаки. Чаще всего для этого используется поиск в <a href="https://tmsearch.uspto.gov/search/search-information">базе данных Бюро по патентам и товарным знакам США (USPTO)</a>, которая содержит все действующие и недействующие регистрации и заявки на товарные знаки. Несмотря на не слишком очаровательный пользовательский интерфейс, этот процесс поиска также глубоко несовершенен из-за своей текстовой природы, поскольку он полагается на слова и коды товарного знака (которые представляют собой аннотированные вручную обозначения элементов дизайна) для поиска изображений.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_8_b2fff6ca11.png" alt="8.png" class="doc-image" id="8.png" />
   </span> <span class="img-wrapper"> <span>8.png</span> </span></p>
<p>Таким образом, в этой статье мы хотим показать, как построить эффективную систему поиска сходства товарных знаков по изображениям, используя <a href="https://milvus.io">Milvus</a>, векторную базу данных с открытым исходным кодом.</p>
<h2 id="A-vector-similarity-search-system-for-trademarks" class="common-anchor-header">Система поиска векторного сходства для товарных знаков<button data-href="#A-vector-similarity-search-system-for-trademarks" class="anchor-icon" translate="no">
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
    </button></h2><p>Чтобы построить систему поиска векторного сходства для товарных знаков, необходимо выполнить следующие шаги:</p>
<ol>
<li>Подготовить массивный набор данных логотипов. Скорее всего, система может использовать <a href="https://developer.uspto.gov/product/trademark-24-hour-box-and-supplemental">такой</a> набор).</li>
<li>Обучить модель извлечения признаков изображения с помощью набора данных и моделей, управляемых данными, или алгоритмов искусственного интеллекта.</li>
<li>Преобразуйте логотипы в векторы с помощью обученной модели или алгоритма на шаге 2.</li>
<li>Храните векторы и проводите поиск сходства векторов в Milvus, базе данных векторов с открытым исходным кодом.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/trademark_system_e9700df555.png" alt="Nike.png" class="doc-image" id="nike.png" />
   </span> <span class="img-wrapper"> <span>Nike.png</span> </span></p>
<p>В следующих разделах мы подробно рассмотрим два основных этапа создания системы поиска векторного сходства для торговых марок: использование моделей ИИ для извлечения признаков изображений и использование Milvus для поиска векторного сходства. В нашем случае мы использовали VGG16, сверточную нейронную сеть (CNN), для извлечения признаков изображения и преобразования их в векторы встраивания.</p>
<h3 id="Using-VGG16-for-image-feature-extraction" class="common-anchor-header">Использование VGG16 для извлечения признаков изображения</h3><p><a href="https://medium.com/@mygreatlearning/what-is-vgg16-introduction-to-vgg16-f2d63849f615">VGG16</a> - это CNN, разработанная для крупномасштабного распознавания изображений. Модель быстро и точно распознает изображения и может применяться к изображениям любого размера. Ниже приведены две иллюстрации архитектуры VGG16.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vgg16_layers_9e621f62cc.png" alt="9.png" class="doc-image" id="9.png" />
   </span> <span class="img-wrapper"> <span>9.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vgg16_architecture_992614e882.png" alt="10.png" class="doc-image" id="10.png" />
   </span> <span class="img-wrapper"> <span>10.png</span> </span></p>
<p>Модель VGG16, как следует из ее названия, представляет собой CNN с 16 слоями. Все модели VGG, включая VGG16 и VGG19, содержат 5 блоков VGG, с одним или несколькими конволюционными слоями в каждом блоке VGG. В конце каждого блока подключается слой max pooling для уменьшения размера входного изображения. Количество ядер эквивалентно в каждом конволюционном слое, но удваивается в каждом блоке VGG. Таким образом, количество ядер в модели увеличивается с 64 в первом блоке до 512 в четвертом и пятом блоках. Все конволюционные ядра<em>имеют размер 33, а объединяющие ядра - 22</em>. Это позволяет сохранить больше информации о входном изображении.</p>
<p>Поэтому в данном случае VGG16 является подходящей моделью для распознавания изображений из массивных наборов данных. Вы можете использовать Python, Tensorflow и Keras для обучения модели извлечения признаков из изображений на основе VGG16.</p>
<h3 id="Using-Milvus-for-vector-similarity-search" class="common-anchor-header">Использование Milvus для поиска векторного сходства</h3><p>После использования модели VGG16 для извлечения признаков изображений и преобразования изображений логотипов в векторы для встраивания вам необходимо найти похожие векторы в большом наборе данных.</p>
<p>Milvus - это облачная нативная база данных, отличающаяся высокой масштабируемостью и эластичностью. Кроме того, будучи базой данных, она может обеспечить согласованность данных. Для подобной системы поиска сходства товарных знаков новые данные, например последние регистрации товарных знаков, загружаются в систему в режиме реального времени. И эти новые загруженные данные должны быть доступны для поиска немедленно. Поэтому в данной статье для поиска векторного сходства используется Milvus, база данных векторов с открытым исходным кодом.</p>
<p>При вставке векторов логотипов в Milvus можно создавать коллекции для различных типов векторов логотипов в соответствии с <a href="https://en.wikipedia.org/wiki/International_(Nice)_Classification_of_Goods_and_Services">Международной (Ниццкой) классификацией товаров и услуг</a>- системой классификации товаров и услуг для регистрации товарных знаков. Например, вы можете поместить группу векторов логотипов брендов одежды в коллекцию под названием &quot;одежда&quot; в Milvus, а другую группу векторов логотипов технологических брендов - в другую коллекцию под названием &quot;технологии&quot;. Таким образом можно значительно повысить эффективность и скорость поиска векторного сходства.</p>
<p>Milvus не только поддерживает несколько индексов для поиска векторного сходства, но и предоставляет богатые API и инструменты для облегчения DevOps. Следующая схема иллюстрирует <a href="https://milvus.io/docs/v2.0.x/architecture_overview.md">архитектуру Milvus</a>. Вы можете узнать больше о Milvus, прочитав его <a href="https://milvus.io/docs/v2.0.x/overview.md">введение</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_architecture_ea45a5ab53.png" alt="11.png" class="doc-image" id="11.png" />
   </span> <span class="img-wrapper"> <span>11.png</span> </span></p>
<h2 id="Looking-for-more-resources" class="common-anchor-header">Ищете другие ресурсы?<button data-href="#Looking-for-more-resources" class="anchor-icon" translate="no">
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
<li><p>Постройте с помощью Milvus больше систем поиска векторного сходства для других сценариев применения:</p>
<ul>
<li><a href="https://milvus.io/blog/dna-sequence-classification-based-on-milvus.md">Классификация последовательностей ДНК на основе Milvus</a></li>
<li><a href="https://milvus.io/blog/audio-retrieval-based-on-milvus.md">Поиск аудиоданных на основе Milvus</a></li>
<li><a href="https://milvus.io/blog/building-video-search-system-with-milvus.md">4 шага к созданию системы поиска видео</a></li>
<li><a href="https://milvus.io/blog/building-intelligent-chatbot-with-nlp-and-milvus.md">Создание интеллектуальной системы контроля качества с помощью НЛП и Milvus</a></li>
<li><a href="https://milvus.io/blog/molecular-structure-similarity-with-milvus.md">Ускорение открытия новых лекарств</a></li>
</ul></li>
<li><p>Присоединяйтесь к нашему сообществу разработчиков с открытым исходным кодом:</p>
<ul>
<li>Найдите Milvus на <a href="https://bit.ly/307b7jC">GitHub</a> или внесите в него свой вклад.</li>
<li>Общайтесь с сообществом на <a href="https://bit.ly/3qiyTEk">форуме</a>.</li>
<li>Общайтесь с нами в <a href="https://bit.ly/3ob7kd8">Twitter</a>.</li>
</ul></li>
</ul>
