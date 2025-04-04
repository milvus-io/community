---
id: deleting-data-in-milvus.md
title: Подведение итогов
author: milvus
date: 2020-08-22T20:27:23.266Z
desc: >-
  В Milvus v0.7.0 мы разработали совершенно новый дизайн, чтобы сделать удаление
  более эффективным и поддерживать больше типов индексов.
cover: assets.zilliz.com/header_c9b45e546c.png
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/deleting-data-in-milvus'
---
<custom-h1>Как Milvus реализует функцию удаления</custom-h1><p>В этой статье рассказывается о том, как в Milvus реализована функция удаления. Функция удаления была представлена в Milvus в версии 0.7.0 как долгожданная функция для многих пользователей. Мы не стали вызывать remove_ids в FAISS напрямую, вместо этого мы придумали совершенно новый дизайн, чтобы сделать удаление более эффективным и поддерживать больше типов индексов.</p>
<p>В статье <a href="https://medium.com/unstructured-data-service/how-milvus-implements-dynamic-data-update-and-query-d15e04a85e7d?source=friends_link&amp;sk=cc38bee61bc194f30324ed17e86886f3">"Как Milvus реализует динамическое обновление данных и запросы"</a> мы представили весь процесс от вставки данных до их удаления. Давайте вспомним некоторые основы. MemManager управляет всеми буферами для вставки данных, при этом каждая MemTable соответствует коллекции (мы переименовали "таблицу" в "коллекцию" в Milvus v0.7.0). Milvus автоматически разделяет данные, вставляемые в память, на несколько MemTableFiles. Когда данные сбрасываются на диск, каждый MemTableFile сериализуется в необработанный файл. Мы сохранили эту архитектуру при разработке функции удаления.</p>
<p>Мы определяем функцию метода delete как удаление всех данных, соответствующих указанным идентификаторам сущностей в определенной коллекции. При разработке этой функции мы разработали два сценария. Первый - удаление данных, которые все еще находятся в буфере вставки, и второй - удаление данных, которые были выгружены на диск. Первый сценарий более интуитивно понятен. Мы можем найти MemTableFile, соответствующий указанному идентификатору, и удалить данные в памяти напрямую (рис. 1). Поскольку удаление и вставка данных не могут выполняться одновременно, а также из-за механизма, который меняет MemTableFile с мутабельного на мутабельный при промывке данных, удаление выполняется только в мутабельном буфере. Таким образом, операция удаления не пересекается с операцией промывки данных, что обеспечивает согласованность данных.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_delete_request_milvus_fa1e7941da.jpg" alt="1-delete-request-milvus.jpg" class="doc-image" id="1-delete-request-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>1-delete-request-milvus.jpg</span> </span></p>
<p>Второй сценарий более сложный, но более распространенный, поскольку в большинстве случаев данные остаются в буфере вставки на короткое время перед тем, как быть выгруженными на диск. Учитывая, что загружать вымытые данные в память для жесткого удаления неэффективно, мы решили применить более эффективный подход - мягкое удаление. Вместо того чтобы удалять данные, выводимые на диск, мягкое удаление сохраняет удаленные идентификаторы в отдельном файле. Таким образом, мы можем отфильтровать удаленные идентификаторы при операциях чтения, например при поиске.</p>
<p>Когда дело доходит до реализации, нам нужно рассмотреть несколько вопросов. В Milvus данные становятся видимыми, или, другими словами, восстанавливаемыми, только когда они стираются на диск. Поэтому сброшенные данные удаляются не во время вызова метода delete, а во время следующей операции flush. Причина в том, что файлы данных, которые были смыты на диск, больше не будут содержать новых данных, поэтому мягкое удаление не влияет на данные, которые были смыты. При вызове функции delete можно непосредственно удалить данные, которые все еще находятся в буфере вставки, в то время как для промытых данных необходимо записать идентификатор удаленных данных в память. При сбросе данных на диск Milvus записывает идентификатор удаленных данных в файл DEL, чтобы записать, какая сущность в соответствующем сегменте была удалена. Эти обновления будут видны только после завершения промывки данных. Этот процесс показан на рисунке 2. До версии 0.7.0 у нас был только механизм автоматической промывки; то есть Milvus сериализовывал данные в буфере вставки каждую секунду. В нашем новом дизайне мы добавили метод flush, позволяющий разработчикам вызывать его после метода delete, гарантируя, что новые вставленные данные будут видны, а удаленные данные уже невозможно будет восстановить.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_delete_request_milvus_c7fc97ef07.jpg" alt="2-delete-request-milvus.jpg" class="doc-image" id="2-delete-request-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>2-delete-request-milvus.jpg</span> </span></p>
<p>Вторая проблема заключается в том, что файл необработанных данных и индексный файл - это два отдельных файла в Milvus и две независимые записи в метаданных. При удалении заданного идентификатора нам нужно найти файл исходных данных и индексный файл, соответствующие этому идентификатору, и записать их вместе. Соответственно, мы ввели понятие сегмента. Сегмент содержит необработанный файл (включающий необработанные векторные файлы и файлы идентификаторов), индексный файл и файл DEL. Сегмент - это самая основная единица для чтения, записи и поиска векторов в Milvus. Коллекция (рисунок 3) состоит из нескольких сегментов. Таким образом, под папкой коллекции на диске находится несколько папок с сегментами. Поскольку наши метаданные основаны на реляционных базах данных (SQLite или MySQL), очень просто записать отношения внутри сегмента, и операция удаления больше не требует отдельной обработки исходного файла и индексного файла.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_delete_request_milvus_ee40340279.jpg" alt="3-delete-request-milvus.jpg" class="doc-image" id="3-delete-request-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>3-delete-request-milvus.jpg</span> </span></p>
<p>Третий вопрос - как отфильтровать удаленные данные при поиске. На практике идентификатор, записанный DEL, является смещением соответствующих данных, хранящихся в сегменте. Поскольку удаляемый сегмент не содержит новых данных, смещение не изменится. Структура данных DEL представляет собой битовую карту в памяти, где активный бит обозначает удаленное смещение. Мы также соответствующим образом обновили FAISS: при поиске в FAISS вектор, соответствующий активному биту, больше не будет включаться в расчет расстояния (рис. 4). Изменения в FAISS здесь подробно рассматриваться не будут.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_delete_request_milvus_f5a29e25df.jpg" alt="4-delete-request-milvus.jpg" class="doc-image" id="4-delete-request-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>4-delete-request-milvus.jpg</span> </span></p>
<p>Последний вопрос касается повышения производительности. При удалении промытых данных сначала нужно выяснить, в каком сегменте коллекции находится удаляемый идентификатор, а затем записать его смещение. Самый простой подход - перебрать все идентификаторы в каждом сегменте. Оптимизация, о которой мы думаем, заключается в добавлении блум-фильтра в каждый сегмент. Фильтр Блума - это случайная структура данных, используемая для проверки того, является ли элемент членом множества. Поэтому мы можем загружать только фильтр цветения каждого сегмента. Только когда bloom-фильтр определит, что удаленный идентификатор находится в текущем сегменте, мы сможем найти соответствующее смещение в сегменте; в противном случае мы можем игнорировать этот сегмент (рис. 5). Мы выбрали bloom-фильтр, потому что он занимает меньше места и более эффективен в поиске, чем многие его аналоги, такие как хэш-таблицы. Хотя фильтр bloom имеет определенный процент ложных срабатываний, мы можем уменьшить количество сегментов, которые необходимо перебрать, до идеального числа, чтобы скорректировать вероятность. Между тем, фильтр цветения также должен поддерживать удаление. В противном случае идентификатор удаленной сущности все равно может быть найден в цветочном фильтре, что приведет к увеличению числа ложных срабатываний. По этой причине мы используем счетный цветочный фильтр, поскольку он поддерживает удаление. В этой статье мы не будем подробно останавливаться на том, как работает bloom-фильтр. Если вам интересно, вы можете обратиться к Википедии.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_delete_request_milvus_bd26633b55.jpg" alt="5-delete-request-milvus.jpg" class="doc-image" id="5-delete-request-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>5-delete-request-milvus.jpg</span> </span></p>
<h2 id="Wrapping-up" class="common-anchor-header">Подведение итогов<button data-href="#Wrapping-up" class="anchor-icon" translate="no">
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
    </button></h2><p>Итак, мы кратко рассказали вам о том, как Milvus удаляет векторы по ID. Как вы знаете, мы используем мягкое удаление для удаления выгруженных данных. По мере увеличения количества удаленных данных нам необходимо уплотнять сегменты в коллекции, чтобы освободить место, занимаемое удаленными данными. Кроме того, если сегмент уже был проиндексирован, при уплотнении удаляется предыдущий индексный файл и создаются новые индексы. Пока что разработчикам необходимо вызывать метод compact для уплотнения данных. В будущем мы надеемся внедрить механизм проверки. Например, когда количество удаленных данных достигнет определенного порога или распределение данных изменится после удаления, Milvus автоматически уплотнит сегмент.</p>
<p>Теперь мы представили философию проектирования функции удаления и ее реализацию. Безусловно, есть куда совершенствоваться, и мы будем рады любым вашим комментариям и предложениям.</p>
<p>Познакомьтесь с Milvus: https://github.com/milvus-io/milvus. Вы также можете присоединиться к нашему сообществу <a href="https://milvusio.slack.com/join/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ#/">Slack</a> для обсуждения технических вопросов!</p>
