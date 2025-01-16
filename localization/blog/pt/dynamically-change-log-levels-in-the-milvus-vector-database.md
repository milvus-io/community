---
id: dynamically-change-log-levels-in-the-milvus-vector-database.md
title: Alterar dinamicamente os níveis de registo na base de dados Milvus Vetor
author: Enwei Jiao
date: 2022-09-21T00:00:00.000Z
desc: Saiba como ajustar o nível de registo no Milvus sem reiniciar o serviço.
cover: >-
  assets.zilliz.com/Dynamically_Change_Log_Levels_in_the_Milvus_Vector_Database_58e31c66cc.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: >-
  https://milvus.io/blog/dynamically-change-log-levels-in-the-milvus-vector-database.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Dynamically_Change_Log_Levels_in_the_Milvus_Vector_Database_58e31c66cc.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Imagem da capa</span> </span></p>
<blockquote>
<p>Este artigo foi escrito por <a href="https://github.com/jiaoew1991">Enwei Jiao</a> e traduzido por <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>Para evitar que uma saída excessiva de logs afecte o desempenho do disco e do sistema, o Milvus, por defeito, produz logs ao nível de <code translate="no">info</code> durante a execução. No entanto, por vezes os registos ao nível de <code translate="no">info</code> não são suficientes para nos ajudar a identificar eficientemente bugs e problemas. O que é pior, em alguns casos, alterar o nível de registo e reiniciar o serviço pode levar à incapacidade de reproduzir os problemas, tornando a resolução de problemas ainda mais difícil. Consequentemente, o suporte para alterar os níveis de registo dinamicamente na base de dados de vectores Milvus é urgentemente necessário.</p>
<p>Este artigo tem como objetivo apresentar o mecanismo que permite alterar os níveis de registo de forma dinâmica e fornecer instruções sobre como fazê-lo na base de dados de vectores Milvus.</p>
<p><strong>Saltar para:</strong></p>
<ul>
<li><a href="#Mechanism">Mecanismo</a></li>
<li><a href="#How-to-dynamically-change-log-levels">Como alterar dinamicamente os níveis de registo</a></li>
</ul>
<h2 id="Mechanism" class="common-anchor-header">Mecanismo<button data-href="#Mechanism" class="anchor-icon" translate="no">
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
    </button></h2><p>A base de dados vetorial Milvus adopta o <a href="https://github.com/uber-go/zap">zap</a> logger open sourced da Uber. Sendo um dos mais poderosos componentes de registo no ecossistema da linguagem Go, o zap incorpora um módulo <a href="https://github.com/uber-go/zap/blob/master/http_handler.go">http_handler.go</a> para que possa ver o nível de registo atual e alterar dinamicamente o nível de registo através de uma interface HTTP.</p>
<p>O Milvus escuta o serviço HTTP fornecido pela porta <code translate="no">9091</code>. Por conseguinte, pode aceder à porta <code translate="no">9091</code> para tirar partido de funcionalidades como a depuração do desempenho, as métricas e as verificações de saúde. Do mesmo modo, a porta <code translate="no">9091</code> é reutilizada para permitir a modificação dinâmica do nível de registo e um caminho <code translate="no">/log/level</code> é também adicionado à porta. Consulte o<a href="https://github.com/milvus-io/milvus/pull/18430"> PR da interface de registo</a> para obter mais informações.</p>
<h2 id="How-to-dynamically-change-log-levels" class="common-anchor-header">Como alterar dinamicamente os níveis de registo<button data-href="#How-to-dynamically-change-log-levels" class="anchor-icon" translate="no">
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
    </button></h2><p>Esta secção fornece instruções sobre como alterar dinamicamente os níveis de registo sem ter de reiniciar o serviço Milvus em execução.</p>
<h3 id="Prerequisite" class="common-anchor-header">Pré-requisito</h3><p>Assegurar que é possível aceder à porta <code translate="no">9091</code> dos componentes Milvus.</p>
<h3 id="Change-the-log-level" class="common-anchor-header">Alterar o nível de registo</h3><p>Suponha que o endereço IP do proxy Milvus seja <code translate="no">192.168.48.12</code>.</p>
<p>Pode começar por executar <code translate="no">$ curl -X GET 192.168.48.12:9091/log/level</code> para verificar o nível de registo atual do proxy.</p>
<p>Em seguida, pode fazer ajustes especificando o nível de registo. As opções de nível de registo incluem:</p>
<ul>
<li><p><code translate="no">debug</code></p></li>
<li><p><code translate="no">info</code></p></li>
<li><p><code translate="no">warn</code></p></li>
<li><p><code translate="no">error</code></p></li>
<li><p><code translate="no">dpanic</code></p></li>
<li><p><code translate="no">panic</code></p></li>
<li><p><code translate="no">fatal</code></p></li>
</ul>
<p>O seguinte código de exemplo altera o nível de registo do nível de registo predefinido de <code translate="no">info</code> para <code translate="no">error</code>.</p>
<pre><code translate="no" class="language-Python">$ curl -X PUT 192.168.48.12:9091/log/level -d level=error
<button class="copy-code-btn"></button></code></pre>
