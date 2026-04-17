---
id: milvus-embraces-nats-messaging.md
title: >-
  Optimisation de la communication des données : Milvus adopte la messagerie
  NATS
author: Zhen Ye
date: 2023-11-24T00:00:00.000Z
desc: >-
  Présentation de l'intégration des NATS et de Milvus, exploration de ses
  fonctionnalités, du processus d'installation et de migration, et des résultats
  des tests de performance.
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
<p>Dans la tapisserie complexe du traitement des données, la communication sans faille est le fil conducteur des opérations. <a href="https://zilliz.com/what-is-milvus">Milvus</a>, la <a href="https://zilliz.com/cloud">base de données vectorielles open-source</a> pionnière, s'est lancée dans un voyage transformateur avec sa dernière fonctionnalité : L'intégration de la messagerie NATS. Dans cet article de blog détaillé, nous allons dévoiler les subtilités de cette intégration, en explorant ses principales fonctionnalités, son processus d'installation, ses avantages en termes de migration et sa comparaison avec son prédécesseur, RocksMQ.</p>
<h2 id="Understanding-the-role-of-message-queues-in-Milvus" class="common-anchor-header">Comprendre le rôle des files d'attente de messages dans Milvus<button data-href="#Understanding-the-role-of-message-queues-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Dans l'architecture cloud-native de Milvus, la file d'attente de messages, ou Log Broker, revêt une importance cruciale. C'est l'épine dorsale qui assure les flux de données persistants, la synchronisation, les notifications d'événements et l'intégrité des données lors des reprises de système. Traditionnellement, RocksMQ était le choix le plus simple en mode autonome Milvus, notamment par rapport à Pulsar et Kafka, mais ses limites sont devenues évidentes avec des données volumineuses et des scénarios complexes.</p>
<p>Milvus 2.3 introduit NATS, une implémentation MQ à nœud unique, qui redéfinit la manière de gérer les flux de données. Contrairement à ses prédécesseurs, NATS libère les utilisateurs de Milvus des contraintes de performance, offrant une expérience transparente dans le traitement de volumes de données importants.</p>
<h2 id="What-is-NATS" class="common-anchor-header">Qu'est-ce que NATS ?<button data-href="#What-is-NATS" class="anchor-icon" translate="no">
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
    </button></h2><p>NATS est une technologie de connectivité de système distribué mise en œuvre en Go. Elle prend en charge divers modes de communication tels que Request-Reply et Publish-Subscribe entre les systèmes, assure la persistance des données grâce à JetStream et offre des capacités distribuées grâce à RAFT intégré. Vous pouvez vous référer au <a href="https://nats.io/">site officiel de NATS</a> pour une compréhension plus détaillée de NATS.</p>
<p>En mode autonome Milvus 2.3, NATS, JetStream et PubSub fournissent à Milvus de solides capacités MQ.</p>
<h2 id="Enabling-NATS" class="common-anchor-header">Activation du NATS<button data-href="#Enabling-NATS" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3 propose une nouvelle option de contrôle, <code translate="no">mq.type</code>, qui permet aux utilisateurs de spécifier le type de MQ qu'ils souhaitent utiliser. Pour activer le NATS, définissez <code translate="no">mq.type=natsmq</code>. Si vous voyez des journaux similaires à ceux ci-dessous après avoir lancé des instances Milvus, vous avez réussi à activer NATS en tant que file d'attente de messages.</p>
<pre><code translate="no">[INFO] [dependency/factory.go:83] [<span class="hljs-string">&quot;try to init mq&quot;</span>] [standalone=<span class="hljs-literal">true</span>] [mqType=natsmq]
<button class="copy-code-btn"></button></code></pre>
<h2 id="Configuring-NATS-for-Milvus" class="common-anchor-header">Configuration du NATS pour Milvus<button data-href="#Configuring-NATS-for-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Les options de personnalisation du NATS comprennent la spécification du port d'écoute, du répertoire de stockage JetStream, de la taille maximale de la charge utile et du délai d'initialisation. Le réglage précis de ces paramètres garantit des performances et une fiabilité optimales.</p>
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
<p><strong>Remarque :</strong></p>
<ul>
<li><p>Vous devez spécifier <code translate="no">server.port</code> pour l'écoute du serveur NATS. En cas de conflit de port, Milvus ne peut pas démarrer. Définissez <code translate="no">server.port=-1</code> pour sélectionner un port de manière aléatoire.</p></li>
<li><p><code translate="no">storeDir</code> spécifie le répertoire pour le stockage JetStream. Nous recommandons de stocker le répertoire dans un lecteur à état solide (SSD) très performant pour améliorer le débit de lecture/écriture de Milvus.</p></li>
<li><p><code translate="no">maxFileStore</code> fixe la limite supérieure de la taille du stockage JetStream. Le dépassement de cette limite empêchera la poursuite de l'écriture des données.</p></li>
<li><p><code translate="no">maxPayload</code> limite la taille des messages individuels. Il est conseillé de la maintenir au-dessus de 5 Mo pour éviter tout rejet d'écriture.</p></li>
<li><p><code translate="no">initializeTimeout</code>contrôle le délai de démarrage du serveur NATS</p></li>
<li><p><code translate="no">monitor</code> configure les journaux indépendants du NATS</p></li>
<li><p><code translate="no">retention</code> contrôle le mécanisme de conservation des messages NATS.</p></li>
</ul>
<p>Pour plus d'informations, consultez la <a href="https://docs.nats.io/running-a-nats-service/configuration">documentation officielle du NATS</a>.</p>
<h2 id="Migrating-from-RocksMQ-to-NATS" class="common-anchor-header">Migration de RocksMQ vers le NATS<button data-href="#Migrating-from-RocksMQ-to-NATS" class="anchor-icon" translate="no">
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
    </button></h2><p>La migration de RocksMQ vers NATS est un processus transparent qui implique des étapes telles que l'arrêt des opérations d'écriture, la vidange des données, la modification des configurations et la vérification de la migration à l'aide des journaux Milvus.</p>
<ol>
<li><p>Avant de lancer la migration, arrêtez toutes les opérations d'écriture dans Milvus.</p></li>
<li><p>Exécuter l'opération <code translate="no">FlushALL</code> dans Milvus et attendre son achèvement. Cette étape permet de s'assurer que toutes les données en attente sont vidées et que le système est prêt pour l'arrêt.</p></li>
<li><p>Modifier le fichier de configuration de Milvus en définissant <code translate="no">mq.type=natsmq</code> et en ajustant les options pertinentes dans la section <code translate="no">natsmq</code>.</p></li>
<li><p>Démarrer le système Milvus 2.3.</p></li>
<li><p>Sauvegarder et nettoyer les données originales stockées dans le répertoire <code translate="no">rocksmq.path</code>. (Facultatif)</p></li>
</ol>
<h2 id="NATS-vs-RocksMQ-A-Performance-Showdown" class="common-anchor-header">NATS vs. RocksMQ : une démonstration de performance<button data-href="#NATS-vs-RocksMQ-A-Performance-Showdown" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="PubSub-Performance-Testing" class="common-anchor-header">Test de performance Pub/Sub</h3><ul>
<li><p><strong>Plate-forme de test :</strong> Puce M1 Pro / Mémoire : 16 Go</p></li>
<li><p><strong>Scénario de test :</strong> Abonnement et publication de paquets de données aléatoires à un sujet de manière répétée jusqu'à ce que le dernier résultat publié soit reçu.</p></li>
<li><p><strong>Résultats :</strong></p>
<ul>
<li><p>Pour les petits paquets de données (&lt; 64kb), RocksMQ surpasse NATS en termes de mémoire, de CPU et de vitesse de réponse.</p></li>
<li><p>Pour les paquets de données plus importants (&gt; 64kb), NATS surpasse RocksMQ, offrant des temps de réponse beaucoup plus rapides.</p></li>
</ul></li>
</ul>
<table>
<thead>
<tr><th>Type de test</th><th>MQ</th><th>nombre d'opérations</th><th>Coût par opération</th><th>Coût de la mémoire</th><th>Temps total de l'unité centrale</th><th>Coût du stockage</th></tr>
</thead>
<tbody>
<tr><td>5MB*100 Pub/Sub</td><td>NATS</td><td>50</td><td>1.650328186 s/op</td><td>4,29 GO</td><td>85.58</td><td>25G</td></tr>
<tr><td>5MB*100 Pub/Sub</td><td>RocksMQ</td><td>50</td><td>2.475595131 s/op</td><td>1.18 GB</td><td>81.42</td><td>19G</td></tr>
<tr><td>1MB*500 Pub/Sub</td><td>NATS</td><td>50</td><td>2.248722593 s/op</td><td>2.60 GB</td><td>96.50</td><td>25G</td></tr>
<tr><td>1MB*500 Pub/Sub</td><td>RocksMQ</td><td>50</td><td>2.554614279 s/op</td><td>614.9 MB</td><td>80.19</td><td>19G</td></tr>
<tr><td>64KB*10000 Pub/Sub</td><td>NATS</td><td>50</td><td>2.133345262 s/op</td><td>3.29 GB</td><td>97.59</td><td>31G</td></tr>
<tr><td>64KB*10000 Pub/Sub</td><td>RocksMQ</td><td>50</td><td>3.253778195 s/op</td><td>331.2 MB</td><td>134.6</td><td>24G</td></tr>
<tr><td>1KB*50000 Pub/Sub</td><td>NATS</td><td>50</td><td>2.629391004 s/op</td><td>635.1 MB</td><td>179.67</td><td>2.6G</td></tr>
<tr><td>1KB*50000 Pub/Sub</td><td>RocksMQ</td><td>50</td><td>0.897638581 s/op</td><td>232.3 MB</td><td>60.42</td><td>521M</td></tr>
</tbody>
</table>
<p>Tableau 1 : Résultats des tests de performance de Pub/Sub</p>
<h3 id="Milvus-Integration-Testing" class="common-anchor-header">Test d'intégration Milvus</h3><p><strong>Taille des données :</strong> 100M</p>
<p><strong>Résultat :</strong> Lors de tests approfondis avec un ensemble de données de 100 millions de vecteurs, NATS a démontré une latence réduite pour la recherche de vecteurs et les requêtes.</p>
<table>
<thead>
<tr><th>Métriques</th><th>RocksMQ (ms)</th><th>NATS (ms)</th></tr>
</thead>
<tbody>
<tr><td>Temps de latence moyen pour la recherche de vecteurs</td><td>23.55</td><td>20.17</td></tr>
<tr><td>Demandes de recherche vectorielle par seconde (RPS)</td><td>2.95</td><td>3.07</td></tr>
<tr><td>Temps de latence moyen des requêtes</td><td>7.2</td><td>6.74</td></tr>
<tr><td>Requêtes par seconde (RPS)</td><td>1.47</td><td>1.54</td></tr>
</tbody>
</table>
<p>Tableau 2 : Résultats des tests d'intégration de Milvus avec l'ensemble de données 100m</p>
<p><strong>Ensemble de données : &lt;100M</strong></p>
<p><strong>Résultat :</strong> Pour les ensembles de données inférieurs à 100M, NATS et RocksMQ affichent des performances similaires.</p>
<h2 id="Conclusion-Empowering-Milvus-with-NATS-messaging" class="common-anchor-header">Conclusion : Renforcer Milvus avec la messagerie NATS<button data-href="#Conclusion-Empowering-Milvus-with-NATS-messaging" class="anchor-icon" translate="no">
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
    </button></h2><p>L'intégration de NATS dans Milvus marque une avancée significative dans le traitement des données. Qu'il s'agisse d'analyses en temps réel, d'applications d'apprentissage automatique ou de tout autre projet à forte intensité de données, les NATS confèrent à vos projets efficacité, fiabilité et rapidité. À mesure que le paysage des données évolue, le fait de disposer d'un système de messagerie robuste tel que NATS au sein de Milvus garantit une communication de données transparente, fiable et performante.</p>
