---
id: 2021-10-22-apply-configuration-changes-on-milvus-2.md
title: >-
  Технический обмен:Применение изменений конфигурации на Milvus 2.0 с помощью
  Docker Compose
author: Jingjing
date: 2021-10-22T00:00:00.000Z
desc: 'Узнайте, как применить изменения конфигурации в Milvus 2.0'
cover: assets.zilliz.com/Modify_configurations_f9162c5670.png
tag: Engineering
---
<custom-h1>Технический обмен: Применение изменений конфигурации на Milvus 2.0 с помощью Docker Compose</custom-h1><p><em>Цзинцзин Цзя, инженер по данным Zilliz, окончила Сианьский университет Цзяотун по специальности "Компьютерные науки". После прихода в Zilliz она в основном занимается предварительной обработкой данных, развертыванием моделей искусственного интеллекта, исследованием технологий, связанных с Milvus, и помогает пользователям сообщества реализовывать сценарии применения. Она очень терпелива, любит общаться с партнерами по сообществу, а также слушать музыку и смотреть аниме.</em></p>
<p>Будучи частым пользователем Milvus, я был очень взволнован новым выпуском Milvus 2.0 RC. Судя по описанию на официальном сайте, Milvus 2.0 значительно превосходит своих предшественников. Мне не терпелось опробовать его самому.</p>
<p>И я попробовал.  Однако, когда я действительно получил Milvus 2.0 в свои руки, я понял, что не могу изменить конфигурационный файл в Milvus 2.0 так же легко, как в Milvus 1.1.1. Я не мог изменить конфигурационный файл внутри докер-контейнера Milvus 2.0, запущенного с помощью Docker Compose, и даже принудительное изменение не вступало в силу. Позже я узнал, что Milvus 2.0 RC не смог обнаружить изменения в конфигурационном файле после установки. И в будущем стабильном выпуске эта проблема будет решена.</p>
<p>Испробовав различные подходы, я нашел надежный способ применения изменений в конфигурационных файлах для Milvus 2.0 standalone &amp; cluster, и вот как это сделать.</p>
<p>Обратите внимание, что все изменения в конфигурации должны быть сделаны до перезапуска Milvus с помощью Docker Compose.</p>
<h2 id="Modify-configuration-file-in-Milvus-standalone" class="common-anchor-header">Изменение файла конфигурации в автономном Milvus<button data-href="#Modify-configuration-file-in-Milvus-standalone" class="anchor-icon" translate="no">
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
    </button></h2><p>Сначала вам нужно <a href="https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml">загрузить</a> копию файла <strong>milvus.yaml</strong> на ваше локальное устройство.</p>
<p>Затем вы можете изменить конфигурации в этом файле. Например, вы можете изменить формат журнала на <code translate="no">.json</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_1_ee4a16a3ee.png" alt="1.1.png" class="doc-image" id="1.1.png" />
   </span> <span class="img-wrapper"> <span>1.1.png</span> </span></p>
<p>После изменения файла <strong>milvus.yaml</strong> необходимо также <a href="https://github.com/milvus-io/milvus/blob/master/deployments/docker/standalone/docker-compose.yml">загрузить</a> и изменить файл <strong>docker-compose.yaml</strong> для standalone, сопоставив локальный путь к файлу milvus.yaml с соответствующим путем докер-контейнера к файлу конфигурации <code translate="no">/milvus/configs/milvus.yaml</code> в разделе <code translate="no">volumes</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_2_5e7c73708c.png" alt="1.2.png" class="doc-image" id="1.2.png" />
   </span> <span class="img-wrapper"> <span>1.2.png</span> </span></p>
<p>Наконец, запустите Milvus standalone с помощью <code translate="no">docker-compose up -d</code> и проверьте, успешно ли выполнены изменения. Например, запустите <code translate="no">docker logs</code>, чтобы проверить формат журнала.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_3_a0406df3ab.png" alt="1.3.png" class="doc-image" id="1.3.png" />
   </span> <span class="img-wrapper"> <span>1.3.png</span> </span></p>
<h2 id="Modify-configuration-file-in-Milvus-cluster" class="common-anchor-header">Изменение конфигурационного файла в кластере Milvus<button data-href="#Modify-configuration-file-in-Milvus-cluster" class="anchor-icon" translate="no">
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
    </button></h2><p>Сначала <a href="https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml">загрузите</a> и измените файл <strong>milvus.yaml</strong> в соответствии с вашими потребностями.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_4_758b182846.png" alt="1.4.png" class="doc-image" id="1.4.png" />
   </span> <span class="img-wrapper"> <span>1.4.png</span> </span></p>
<p>Затем нужно <a href="https://github.com/milvus-io/milvus/blob/master/deployments/docker/cluster/docker-compose.yml">загрузить</a> и изменить файл <strong>docker-compose.yml</strong> кластера, сопоставив локальный путь к <strong>milvus.yaml</strong> с соответствующими путями к конфигурационным файлам всех компонентов, то есть root coord, data coord, data node, query coord, query node, index coord, index node и proxy.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_5_80e15811b8.png" alt="1.5.png" class="doc-image" id="1.5.png" />
   </span> <span class="img-wrapper"> <span>1.5.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_6_b2f3e4e47f.png" alt="1.6.png" class="doc-image" id="1.6.png" />
   </span> <span class="img-wrapper"> <span>1.6.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_7_4d1eb5e1e5.png" alt="1.7.png" class="doc-image" id="1.7.png" /></span> <span class="img-wrapper">1 </span>. <span class="img-wrapper">7 <span>.png</span> </span></p>
<p>Наконец, вы можете запустить кластер Milvus с помощью <code translate="no">docker-compose up -d</code> и проверить, успешно ли прошли модификации.</p>
<h2 id="Change-log-file-path-in-configuration-file" class="common-anchor-header">Изменение пути к файлу журнала в конфигурационном файле<button data-href="#Change-log-file-path-in-configuration-file" class="anchor-icon" translate="no">
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
    </button></h2><p>Сначала <a href="https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml">загрузите</a> файл <strong>milvus.yaml</strong> и измените секцию <code translate="no">rootPath</code> на каталог, в котором будут храниться файлы журнала в контейнере Docker.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_8_e3bdc4843f.png" alt="1.8.png" class="doc-image" id="1.8.png" />
   </span> <span class="img-wrapper"> <span>1.8.png</span> </span></p>
<p>После этого загрузите соответствующий файл <strong>docker-compose.yml</strong> для <a href="https://github.com/milvus-io/milvus/blob/master/deployments/docker/standalone/docker-compose.yml">автономного</a> или <a href="https://github.com/milvus-io/milvus/blob/master/deployments/docker/cluster/docker-compose.yml">кластерного</a> Milvus.</p>
<p>Для автономной системы вам нужно сопоставить локальный путь к файлу <strong>milvus.yaml</strong> с соответствующим путем докер-контейнера к конфигурационному файлу <code translate="no">/milvus/configs/milvus.yaml</code>, а также сопоставить локальный каталог файлов журнала с каталогом докер-контейнера, который вы создали ранее.</p>
<p>Для кластера вам нужно будет сопоставить оба пути в каждом компоненте.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_9_22d8929d92.png" alt="1.9.png" class="doc-image" id="1.9.png" />
   </span> <span class="img-wrapper"> <span>1.9.png</span> </span></p>
<p>Наконец, запустите автономный или кластерный Milvus с помощью <code translate="no">docker-compose up -d</code> и проверьте файлы журнала, чтобы убедиться, что модификация прошла успешно.</p>
