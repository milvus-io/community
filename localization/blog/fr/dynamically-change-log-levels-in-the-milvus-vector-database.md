---
id: dynamically-change-log-levels-in-the-milvus-vector-database.md
title: >-
  Modifier dynamiquement les niveaux de journalisation dans la base de données
  vectorielle Milvus
author: Enwei Jiao
date: 2022-09-21T00:00:00.000Z
desc: >-
  Découvrez comment ajuster le niveau de journalisation dans Milvus sans
  redémarrer le service.
cover: >-
  assets.zilliz.com/Dynamically_Change_Log_Levels_in_the_Milvus_Vector_Database_58e31c66cc.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: >-
  https://milvus.io/blog/dynamically-change-log-levels-in-the-milvus-vector-database.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Dynamically_Change_Log_Levels_in_the_Milvus_Vector_Database_58e31c66cc.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Image de couverture</span> </span></p>
<blockquote>
<p>Cet article a été rédigé par <a href="https://github.com/jiaoew1991">Enwei Jiao</a> et traduit par <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>Pour éviter qu'une surproduction de journaux n'affecte les performances du disque et du système, Milvus produit par défaut des journaux au niveau <code translate="no">info</code> lorsqu'il est en cours d'exécution. Cependant, il arrive que les journaux au niveau <code translate="no">info</code> ne soient pas suffisants pour nous aider à identifier efficacement les bogues et les problèmes. Qui plus est, dans certains cas, la modification du niveau de journalisation et le redémarrage du service peuvent conduire à l'échec de la reproduction des problèmes, ce qui rend le dépannage d'autant plus difficile. Par conséquent, la prise en charge de la modification dynamique des niveaux de journalisation dans la base de données vectorielle Milvus est une nécessité urgente.</p>
<p>Cet article a pour but de présenter le mécanisme qui permet de modifier dynamiquement les niveaux de journalisation et de fournir des instructions sur la manière de le faire dans la base de données vectorielle Milvus.</p>
<p><strong>Aller à :</strong></p>
<ul>
<li><a href="#Mechanism">Mécanisme</a></li>
<li><a href="#How-to-dynamically-change-log-levels">Comment modifier dynamiquement les niveaux de journalisation</a></li>
</ul>
<h2 id="Mechanism" class="common-anchor-header">Mécanisme<button data-href="#Mechanism" class="anchor-icon" translate="no">
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
    </button></h2><p>La base de données vectorielle Milvus adopte le logger <a href="https://github.com/uber-go/zap">zap</a> open sourcé par Uber. En tant que l'un des composants de journalisation les plus puissants de l'écosystème du langage Go, zap intègre un module <a href="https://github.com/uber-go/zap/blob/master/http_handler.go">http_handler.go</a> qui permet de visualiser le niveau de journalisation actuel et de changer dynamiquement le niveau de journalisation via une interface HTTP.</p>
<p>Milvus écoute le service HTTP fourni par le port <code translate="no">9091</code>. Par conséquent, vous pouvez accéder au port <code translate="no">9091</code> pour bénéficier de fonctionnalités telles que le débogage des performances, les mesures et les contrôles de santé. De même, le port <code translate="no">9091</code> est réutilisé pour permettre la modification dynamique du niveau de journalisation et un chemin <code translate="no">/log/level</code> est également ajouté au port. Voir le<a href="https://github.com/milvus-io/milvus/pull/18430"> PR de l'interface de journalisation</a> pour plus d'informations.</p>
<h2 id="How-to-dynamically-change-log-levels" class="common-anchor-header">Comment modifier dynamiquement les niveaux de journalisation<button data-href="#How-to-dynamically-change-log-levels" class="anchor-icon" translate="no">
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
    </button></h2><p>Cette section fournit des instructions sur la manière de modifier dynamiquement les niveaux de journalisation sans avoir à redémarrer le service Milvus en cours d'exécution.</p>
<h3 id="Prerequisite" class="common-anchor-header">Conditions préalables</h3><p>Assurez-vous que vous pouvez accéder au port <code translate="no">9091</code> des composants Milvus.</p>
<h3 id="Change-the-log-level" class="common-anchor-header">Modifier le niveau de journalisation</h3><p>Supposons que l'adresse IP du proxy Milvus soit <code translate="no">192.168.48.12</code>.</p>
<p>Vous pouvez d'abord exécuter <code translate="no">$ curl -X GET 192.168.48.12:9091/log/level</code> pour vérifier le niveau de journalisation actuel du proxy.</p>
<p>Vous pouvez ensuite procéder à des ajustements en spécifiant le niveau de journalisation. Les options de niveau de journalisation sont les suivantes :</p>
<ul>
<li><p><code translate="no">debug</code></p></li>
<li><p><code translate="no">info</code></p></li>
<li><p><code translate="no">warn</code></p></li>
<li><p><code translate="no">error</code></p></li>
<li><p><code translate="no">dpanic</code></p></li>
<li><p><code translate="no">panic</code></p></li>
<li><p><code translate="no">fatal</code></p></li>
</ul>
<p>L'exemple de code suivant modifie le niveau de journal par défaut de <code translate="no">info</code> à <code translate="no">error</code>.</p>
<pre><code translate="no" class="language-Python">$ curl -X PUT 192.168.48.12:9091/log/level -d level=error
<button class="copy-code-btn"></button></code></pre>
