---
id: milvus-embraces-nats-messaging.md
title: 'Otimização da comunicação de dados: Milvus adopta o serviço de mensagens NATS'
author: Zhen Ye
date: 2023-11-24T00:00:00.000Z
desc: >-
  Apresentação da integração do NATS e do Milvus, explorando as suas
  caraterísticas, o processo de configuração e migração e os resultados dos
  testes de desempenho.
cover: assets.zilliz.com/Exploring_NATS_878f48c848.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, NATS, Message Queues, RocksMQ
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/optimizing-data-communication-milvus-embraces-nats-messaging
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Exploring_NATS_878f48c848.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Na intrincada tapeçaria do processamento de dados, a comunicação sem falhas é o fio condutor que une as operações. <a href="https://zilliz.com/what-is-milvus">Milvus</a>, a inovadora <a href="https://zilliz.com/cloud">base de dados vetorial de código aberto</a>, embarcou numa viagem transformadora com a sua mais recente funcionalidade: Integração de mensagens NATS. Nesta publicação abrangente do blogue, vamos desvendar os meandros desta integração, explorando as suas principais funcionalidades, o processo de configuração, as vantagens da migração e a forma como se compara com o seu antecessor, o RocksMQ.</p>
<h2 id="Understanding-the-role-of-message-queues-in-Milvus" class="common-anchor-header">Compreender o papel das filas de mensagens no Milvus<button data-href="#Understanding-the-role-of-message-queues-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Na arquitetura nativa da nuvem do Milvus, a fila de mensagens, ou Log Broker, tem uma importância fundamental. É a espinha dorsal que garante fluxos de dados persistentes, sincronização, notificações de eventos e integridade dos dados durante as recuperações do sistema. Tradicionalmente, o RocksMQ era a escolha mais direta no modo Milvus Standalone, especialmente quando comparado com o Pulsar e o Kafka, mas as suas limitações tornaram-se evidentes com dados extensos e cenários complexos.</p>
<p>O Milvus 2.3 apresenta o NATS, uma implementação de MQ de nó único, redefinindo a forma de gerenciar fluxos de dados. Ao contrário dos seus antecessores, o NATS liberta os utilizadores do Milvus das restrições de desempenho, proporcionando uma experiência perfeita no tratamento de volumes de dados substanciais.</p>
<h2 id="What-is-NATS" class="common-anchor-header">O que é NATS?<button data-href="#What-is-NATS" class="anchor-icon" translate="no">
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
    </button></h2><p>NATS é uma tecnologia de conetividade de sistemas distribuídos implementada em Go. Suporta vários modos de comunicação como Request-Reply e Publish-Subscribe entre sistemas, fornece persistência de dados através do JetStream, e oferece capacidades distribuídas através do RAFT incorporado. Pode consultar o <a href="https://nats.io/">site oficial do NATS</a> para uma compreensão mais detalhada do NATS.</p>
<p>No modo Milvus 2.3 Standalone, NATS, JetStream e PubSub fornecem ao Milvus capacidades robustas de MQ.</p>
<h2 id="Enabling-NATS" class="common-anchor-header">Habilitando o NATS<button data-href="#Enabling-NATS" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus 2.3 oferece uma nova opção de controlo, <code translate="no">mq.type</code>, que permite aos utilizadores especificar o tipo de MQ que pretendem utilizar. Para habilitar o NATS, configure <code translate="no">mq.type=natsmq</code>. Se você vir logs semelhantes aos abaixo depois de iniciar instâncias do Milvus, você habilitou com sucesso o NATS como a fila de mensagens.</p>
<pre><code translate="no">[INFO] [dependency/factory.go:83] [<span class="hljs-string">&quot;try to init mq&quot;</span>] [standalone=<span class="hljs-literal">true</span>] [mqType=natsmq]
<button class="copy-code-btn"></button></code></pre>
<h2 id="Configuring-NATS-for-Milvus" class="common-anchor-header">Configurando o NATS para o Milvus<button data-href="#Configuring-NATS-for-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>As opções de personalização do NATS incluem a especificação da porta de escuta, o diretório de armazenamento do JetStream, o tamanho máximo da carga útil e o tempo limite de inicialização. O ajuste fino dessas configurações garante desempenho e confiabilidade ideais.</p>
<pre><code translate="no">natsmq:
server: <span class="hljs-comment"># server side configuration for natsmq.</span>
port: <span class="hljs-number">4222</span> <span class="hljs-comment"># 4222 by default, Port for nats server listening.</span>
storeDir: /var/lib/milvus/nats <span class="hljs-comment"># /var/lib/milvus/nats by default, directory to use for JetStream storage of nats.</span>
maxFileStore: <span class="hljs-number">17179869184</span> <span class="hljs-comment"># (B) 16GB by default, Maximum size of the &#x27;file&#x27; storage.</span>
maxPayload: <span class="hljs-number">8388608</span> <span class="hljs-comment"># (B) 8MB by default, Maximum number of bytes in a message payload.</span>
maxPending: <span class="hljs-number">67108864</span> <span class="hljs-comment"># (B) 64MB by default, Maximum number of bytes buffered for a connection Applies to client connections.</span>
initializeTimeout: <span class="hljs-number">4000</span> <span class="hljs-comment"># (ms) 4s by default, waiting for initialization of natsmq finished.</span>
monitor:
trace: false <span class="hljs-comment"># false by default, If true enable protocol trace log messages.</span>
debug: false <span class="hljs-comment"># false by default, If true enable debug log messages.</span>
logTime: true <span class="hljs-comment"># true by default, If set to false, log without timestamps.</span>
logFile: /tmp/milvus/logs/nats.log <span class="hljs-comment"># /tmp/milvus/logs/nats.log by default, Log file path relative to .. of milvus binary if use relative path.</span>
logSizeLimit: <span class="hljs-number">536870912</span> <span class="hljs-comment"># (B) 512MB by default, Size in bytes after the log file rolls over to a new one.</span>
retention:
maxAge: <span class="hljs-number">4320</span> <span class="hljs-comment"># (min) 3 days by default, Maximum age of any message in the P-channel.</span>
maxBytes: <span class="hljs-comment"># (B) None by default, How many bytes the single P-channel may contain. Removing oldest messages if the P-channel exceeds this size.</span>
maxMsgs: <span class="hljs-comment"># None by default, How many message the single P-channel may contain. Removing oldest messages if the P-channel exceeds this limit.</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Observação:</strong></p>
<ul>
<li><p>É necessário especificar <code translate="no">server.port</code> para a escuta do servidor NATS. Se houver um conflito de portas, o Milvus não poderá iniciar. Defina <code translate="no">server.port=-1</code> para selecionar aleatoriamente uma porta.</p></li>
<li><p><code translate="no">storeDir</code> especifica o diretório para o armazenamento do JetStream. Recomendamos que o diretório seja armazenado em uma unidade de estado sólido (SSD) de alto desempenho para melhorar a taxa de transferência de leitura/gravação do Milvus.</p></li>
<li><p><code translate="no">maxFileStore</code> define o limite superior do tamanho do armazenamento do JetStream. Exceder este limite impedirá a escrita de mais dados.</p></li>
<li><p><code translate="no">maxPayload</code> limita o tamanho das mensagens individuais. Deve manter-se acima dos 5MB para evitar rejeições de escrita.</p></li>
<li><p><code translate="no">initializeTimeout</code>controla o tempo limite de inicialização do servidor NATS.</p></li>
<li><p><code translate="no">monitor</code> configura os registos independentes do NATS.</p></li>
<li><p><code translate="no">retention</code> controla o mecanismo de retenção das mensagens NATS.</p></li>
</ul>
<p>Para mais informações, consulte a <a href="https://docs.nats.io/running-a-nats-service/configuration">documentação oficial do NATS</a>.</p>
<h2 id="Migrating-from-RocksMQ-to-NATS" class="common-anchor-header">Migrando do RocksMQ para o NATS<button data-href="#Migrating-from-RocksMQ-to-NATS" class="anchor-icon" translate="no">
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
    </button></h2><p>A migração do RocksMQ para o NATS é um processo contínuo que envolve etapas como a interrupção de operações de gravação, a descarga de dados, a modificação de configurações e a verificação da migração por meio dos logs do Milvus.</p>
<ol>
<li><p>Antes de iniciar a migração, interrompa todas as operações de gravação no Milvus.</p></li>
<li><p>Executar a operação <code translate="no">FlushALL</code> no Milvus e aguardar a sua conclusão. Este passo assegura que todos os dados pendentes são eliminados e que o sistema está pronto para ser encerrado.</p></li>
<li><p>Modifique o ficheiro de configuração do Milvus, definindo <code translate="no">mq.type=natsmq</code> e ajustando as opções relevantes na secção <code translate="no">natsmq</code>.</p></li>
<li><p>Inicie o Milvus 2.3.</p></li>
<li><p>Faça uma cópia de segurança e limpe os dados originais armazenados no diretório <code translate="no">rocksmq.path</code>. (Opcional)</p></li>
</ol>
<h2 id="NATS-vs-RocksMQ-A-Performance-Showdown" class="common-anchor-header">NATS vs. RocksMQ: um confronto de desempenho<button data-href="#NATS-vs-RocksMQ-A-Performance-Showdown" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="PubSub-Performance-Testing" class="common-anchor-header">Teste de desempenho do Pub/Sub</h3><ul>
<li><p><strong>Plataforma de teste:</strong> Chip M1 Pro / Memória: 16 GB</p></li>
<li><p><strong>Cenário de teste:</strong> Assinatura e publicação de pacotes de dados aleatórios num tópico repetidamente até que o último resultado publicado seja recebido.</p></li>
<li><p><strong>Resultados:</strong></p>
<ul>
<li><p>Para pacotes de dados menores (&lt; 64kb), o RocksMQ supera o NATS em relação à memória, CPU e velocidade de resposta.</p></li>
<li><p>Para pacotes de dados maiores (&gt; 64kb), o NATS supera o RocksMQ, oferecendo tempos de resposta muito mais rápidos.</p></li>
</ul></li>
</ul>
<table>
<thead>
<tr><th>Tipo de teste</th><th>MQ</th><th>contagem de operações</th><th>custo por operação</th><th>Custo de memória</th><th>Tempo total da CPU</th><th>Custo de armazenamento</th></tr>
</thead>
<tbody>
<tr><td>5MB*100 Pub/Sub</td><td>NATS</td><td>50</td><td>1.650328186 s/op</td><td>4,29 GB</td><td>85.58</td><td>25G</td></tr>
<tr><td>5MB*100 Pub/Sub</td><td>RocksMQ</td><td>50</td><td>2.475595131 s/op</td><td>1,18 GB</td><td>81.42</td><td>19G</td></tr>
<tr><td>1MB*500 Pub/Sub</td><td>NATS</td><td>50</td><td>2.248722593 s/op</td><td>2,60 GB</td><td>96.50</td><td>25G</td></tr>
<tr><td>1MB*500 Pub/Sub</td><td>RocksMQ</td><td>50</td><td>2.554614279 s/op</td><td>614,9 MB</td><td>80.19</td><td>19G</td></tr>
<tr><td>64KB*10000 Pub/Sub</td><td>NATS</td><td>50</td><td>2.133345262 s/op</td><td>3,29 GB</td><td>97.59</td><td>31G</td></tr>
<tr><td>64KB*10000 Pub/Sub</td><td>RocksMQ</td><td>50</td><td>3.253778195 s/op</td><td>331,2 MB</td><td>134.6</td><td>24G</td></tr>
<tr><td>1KB*50000 Pub/Sub</td><td>NATS</td><td>50</td><td>2.629391004 s/op</td><td>635,1 MB</td><td>179.67</td><td>2.6G</td></tr>
<tr><td>1KB*50000 Pub/Sub</td><td>RocksMQ</td><td>50</td><td>0.897638581 s/op</td><td>232,3 MB</td><td>60.42</td><td>521M</td></tr>
</tbody>
</table>
<p>Tabela 1: Resultados dos testes de desempenho Pub/Sub</p>
<h3 id="Milvus-Integration-Testing" class="common-anchor-header">Teste de integração Milvus</h3><p><strong>Tamanho dos dados:</strong> 100M</p>
<p><strong>Resultado:</strong> Em testes extensivos com um conjunto de dados de 100 milhões de vectores, o NATS demonstrou uma menor latência de pesquisa e consulta de vectores.</p>
<table>
<thead>
<tr><th>Métricas</th><th>RocksMQ (ms)</th><th>NATS (ms)</th></tr>
</thead>
<tbody>
<tr><td>Latência média de pesquisa vetorial</td><td>23.55</td><td>20.17</td></tr>
<tr><td>Pedidos de pesquisa vetorial por segundo (RPS)</td><td>2.95</td><td>3.07</td></tr>
<tr><td>Latência média de consulta</td><td>7.2</td><td>6.74</td></tr>
<tr><td>Pedidos de consulta por segundo (RPS)</td><td>1.47</td><td>1.54</td></tr>
</tbody>
</table>
<p>Tabela 2: Resultados dos testes de integração do Milvus com o conjunto de dados 100m</p>
<p><strong>Conjunto de dados: &lt;100M</strong></p>
<p><strong>Resultado:</strong> Para conjuntos de dados menores que 100M, NATS e RocksMQ apresentam desempenho semelhante.</p>
<h2 id="Conclusion-Empowering-Milvus-with-NATS-messaging" class="common-anchor-header">Conclusão: Capacitando o Milvus com mensagens NATS<button data-href="#Conclusion-Empowering-Milvus-with-NATS-messaging" class="anchor-icon" translate="no">
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
    </button></h2><p>A integração do NATS no Milvus marca um avanço significativo no processamento de dados. Quer se trate de análises em tempo real, de aplicações de aprendizagem automática ou de qualquer outro empreendimento com utilização intensiva de dados, o NATS confere aos seus projectos eficiência, fiabilidade e rapidez. À medida que o panorama dos dados evolui, dispor de um sistema de mensagens robusto como o NATS no Milvus garante uma comunicação de dados sem falhas, fiável e de elevado desempenho.</p>
