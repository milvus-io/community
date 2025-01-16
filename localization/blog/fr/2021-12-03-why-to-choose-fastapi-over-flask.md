---
id: 2021-12-03-why-to-choose-fastapi-over-flask.md
title: Pourquoi choisir FastAPI plutôt que Flask ?
author: Yunmei
date: 2021-12-03T00:00:00.000Z
desc: choisir le cadre approprié en fonction de votre scénario d'application
cover: assets.zilliz.com/1_d5de035def.png
tag: Engineering
isPublish: false
---
<p>Pour vous aider à démarrer rapidement avec Milvus, la base de données vectorielle open-source, nous avons publié un autre projet open-source affilié, <a href="https://github.com/milvus-io/bootcamp">Milvus Bootcamp</a> sur GitHub. Le Milvus Bootcamp fournit non seulement des scripts et des données pour les tests de référence, mais il inclut également des projets qui utilisent Milvus pour créer des produits minimum viables (MVP), tels qu'un système de recherche d'images inversées, un système d'analyse vidéo, un chatbot d'assurance qualité ou un système de recommandation. Vous pouvez apprendre à appliquer la recherche de similarité vectorielle dans un monde rempli de données non structurées et acquérir une expérience pratique dans le Milvus Bootcamp.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_5b60157b4d.png" alt="2.png" class="doc-image" id="2.png" />
   </span> <span class="img-wrapper"> <span>2.png</span> </span></p>
<p>Nous fournissons des services frontaux et dorsaux pour les projets de Milvus Bootcamp. Cependant, nous avons récemment pris la décision de changer le cadre web adopté de Flask à FastAPI.</p>
<p>Cet article vise à expliquer notre motivation derrière un tel changement dans le cadre web adopté pour Milvus Bootcamp en clarifiant pourquoi nous avons choisi FastAPI plutôt que Flask.</p>
<h2 id="Web-frameworks-for-Python" class="common-anchor-header">Cadres web pour Python<button data-href="#Web-frameworks-for-Python" class="anchor-icon" translate="no">
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
    </button></h2><p>Un cadre web fait référence à une collection de paquets ou de modules. Il s'agit d'un ensemble d'architectures logicielles pour le développement web qui vous permet d'écrire des applications ou des services web et vous évite de gérer des détails de bas niveau tels que les protocoles, les sockets ou la gestion des processus/threads. L'utilisation d'un cadre web peut réduire considérablement la charge de travail liée au développement d'applications web, car vous pouvez simplement "brancher" votre code dans le cadre, sans avoir à vous préoccuper davantage de la mise en cache des données, de l'accès à la base de données et de la vérification de la sécurité des données. Pour plus d'informations sur ce qu'est un framework web pour Python, voir <a href="https://wiki.python.org/moin/WebFrameworks">Frameworks web</a>.</p>
<p>Il existe différents types de frameworks web Python. Les plus courants sont Django, Flask, Tornado et FastAPI.</p>
<h3 id="Flask" class="common-anchor-header">Flask</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_1abd170939.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span></p>
<p><a href="https://flask.palletsprojects.com/en/2.0.x/">Flask</a> est un micro-cadre léger conçu pour Python, avec un noyau simple et facile à utiliser qui vous permet de développer vos propres applications web. En outre, le noyau de Flask est également extensible. Par conséquent, Flask prend en charge l'extension à la demande de différentes fonctions pour répondre à vos besoins personnalisés au cours du développement d'une application web. En d'autres termes, avec une bibliothèque de divers plug-ins dans Flask, vous pouvez développer des sites web puissants.</p>
<p>Flask présente les caractéristiques suivantes :</p>
<ol>
<li>Flask est un micro-cadre qui ne s'appuie pas sur d'autres outils spécifiques ou composants de bibliothèques tierces pour fournir des fonctionnalités partagées. Flask n'a pas de couche d'abstraction de base de données et ne nécessite pas de validation de formulaire. Cependant, Flask est très extensible et permet d'ajouter des fonctionnalités d'application d'une manière similaire aux implémentations au sein de Flask lui-même. Les extensions pertinentes comprennent les mappeurs objet-relationnel, la validation des formulaires, le traitement des téléchargements, les technologies d'authentification ouvertes et certains outils courants conçus pour les cadres d'application web.</li>
<li>Flask est un cadre d'application web basé sur <a href="https://wsgi.readthedocs.io/">WSGI</a> (Web Server Gateway Interface). WSGI est une interface simple qui relie un serveur web à une application web ou à un cadre défini pour le langage Python.</li>
<li>Flask comprend deux bibliothèques de fonctions principales, <a href="https://www.palletsprojects.com/p/werkzeug">Werkzeug</a> et <a href="https://www.palletsprojects.com/p/jinja">Jinja2</a>. Werkzeug est une boîte à outils WSGI qui met en œuvre des objets de demande et de réponse ainsi que des fonctions pratiques, ce qui vous permet de construire des cadres web par-dessus. Jinja2 est un moteur de templates complet et populaire pour Python. Il prend totalement en charge l'Unicode et dispose d'un environnement d'exécution sandbox intégré, facultatif mais largement adopté.</li>
</ol>
<h3 id="FastAPI" class="common-anchor-header">FastAPI</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_05cb0dac4e.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<p><a href="https://fastapi.tiangolo.com/">FastAPI</a> est un framework moderne d'applications web en Python qui offre le même niveau de performance que Go et NodeJS. Le cœur de FastAPI est basé sur <a href="https://www.starlette.io/">Starlette</a> et <a href="https://pydantic-docs.helpmanual.io/">Pydantic</a>. Starlette est une boîte à outils <a href="https://asgi.readthedocs.io/">ASGI</a>(Asynchronous Server Gateway Interface) légère pour construire des services <a href="https://docs.python.org/3/library/asyncio.html">Asyncio</a> de haute performance. Pydantic est une bibliothèque qui définit la validation, la sérialisation et la documentation des données sur la base des indications de type de Python.</p>
<p>FastAPI présente les caractéristiques suivantes :</p>
<ol>
<li>FastAPI est un cadre d'application web basé sur ASGI, une interface de protocole de passerelle asynchrone reliant les services de protocole de réseau et les applications Python. FastAPI peut gérer une variété de types de protocoles communs, y compris HTTP, HTTP2 et WebSocket.</li>
<li>FastAPI est basé sur Pydantic, qui fournit la fonction de vérification du type de données de l'interface. Vous n'avez pas besoin de vérifier en plus les paramètres de votre interface, ni d'écrire du code supplémentaire pour vérifier si les paramètres sont vides ou si le type de données est correct. L'utilisation de FastAPI permet d'éviter les erreurs humaines dans le code et d'améliorer l'efficacité du développement.</li>
<li>FastAPI supporte les documents dans deux formats - <a href="https://swagger.io/specification/">OpenAPI</a> (anciennement Swagger) et <a href="https://www.redoc.com/">Redoc</a>. Par conséquent, en tant qu'utilisateur, vous n'avez pas besoin de passer du temps à écrire des documents d'interface supplémentaires. Le document OpenAPI fourni par FastAPI est montré dans la capture d'écran ci-dessous.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_d91d34cb0f.png" alt="5.png" class="doc-image" id="5.png" />
   </span> <span class="img-wrapper"> <span>5.png</span> </span></p>
<h3 id="Flask-Vs-FastAPI" class="common-anchor-header">Flask et FastAPI</h3><p>Le tableau ci-dessous montre les différences entre Flask et FastAPI à plusieurs égards.</p>
<table>
<thead>
<tr><th></th><th><strong>FastAPI</strong></th><th><strong>Flask</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Passerelle d'interface</strong></td><td>ASGI</td><td>WSGI</td></tr>
<tr><td><strong>Cadre asynchrone</strong></td><td>✅</td><td>❌</td></tr>
<tr><td><strong>Performance</strong></td><td>Plus rapide</td><td>Plus lentes</td></tr>
<tr><td><strong>Document interactif</strong></td><td>OpenAPI, Redoc</td><td>Aucune</td></tr>
<tr><td><strong>Vérification des données</strong></td><td>✅</td><td>❌</td></tr>
<tr><td><strong>Coûts de développement</strong></td><td>Plus bas</td><td>Plus élevés</td></tr>
<tr><td><strong>Facilité d'utilisation</strong></td><td>Plus faible</td><td>Plus élevée</td></tr>
<tr><td><strong>Flexibilité</strong></td><td>Moins flexible</td><td>Plus flexible</td></tr>
<tr><td><strong>Communauté</strong></td><td>Plus petite</td><td>Plus active</td></tr>
</tbody>
</table>
<h2 id="Why-FastAPI" class="common-anchor-header">Pourquoi FastAPI ?<button data-href="#Why-FastAPI" class="anchor-icon" translate="no">
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
    </button></h2><p>Avant de décider quel framework d'application web Python choisir pour les projets de Milvus Bootcamp, nous avons fait des recherches sur plusieurs frameworks courants, y compris Django, Flask, FastAPI, Tornado, et bien d'autres. Étant donné que les projets de Milvus Bootcamp servent de référence pour vous, notre priorité est d'adopter un framework externe extrêmement léger et habile. Selon cette règle, nous avons réduit nos choix à Flask et FastAPI.</p>
<p>Vous pouvez voir la comparaison entre les deux frameworks web dans la section précédente. Ce qui suit est une explication détaillée de notre motivation à choisir FastAPI plutôt que Flask pour les projets de Milvus Bootcamp. Il y a plusieurs raisons à cela :</p>
<h3 id="1-Performance" class="common-anchor-header">1. Performance</h3><p>La plupart des projets de Milvus Bootcamp sont construits autour de systèmes de recherche d'images inversées, de chatbots d'assurance qualité, de moteurs de recherche de texte, qui ont tous des exigences élevées en matière de traitement de données en temps réel. Par conséquent, nous avons besoin d'un cadre avec des performances exceptionnelles, ce qui est exactement un point fort de FastAPI. Par conséquent, du point de vue de la performance du système, nous avons décidé de choisir FastAPI.</p>
<h3 id="2-Efficiency" class="common-anchor-header">2. Efficacité</h3><p>Lorsque vous utilisez Flask, vous devez écrire du code pour la vérification du type de données dans chacune des interfaces afin que le système puisse déterminer si les données d'entrée sont vides ou non. Cependant, en prenant en charge la vérification automatique du type de données, FastAPI permet d'éviter les erreurs humaines de codage pendant le développement du système et peut considérablement améliorer l'efficacité du développement. Bootcamp se positionne comme un type de ressource de formation. Cela signifie que le code et les composants que nous utilisons doivent être intuitifs et très efficaces. À cet égard, nous avons choisi FastAPI pour améliorer l'efficacité du système et l'expérience de l'utilisateur.</p>
<h3 id="3-Asynchronous-framework" class="common-anchor-header">3. Cadre asynchrone</h3><p>FastAPI est par nature un framework asynchrone. À l'origine, nous avons publié quatre <a href="https://zilliz.com/milvus-demos?isZilliz=true">démonstrations</a>, la recherche d'images inversées, l'analyse vidéo, le chatbot d'assurance qualité et la recherche de similarités moléculaires. Dans ces démonstrations, vous pouvez télécharger des ensembles de données et le message &quot;demande reçue&quot; s'affiche immédiatement. Lorsque les données sont téléchargées vers le système de démonstration, vous recevez un autre message indiquant que le téléchargement des données a été effectué avec succès. Il s'agit d'un processus asynchrone qui nécessite un cadre de travail prenant en charge cette fonctionnalité. FastAPI est lui-même un cadre asynchrone. Afin d'aligner toutes les ressources Milvus, nous avons décidé d'adopter un ensemble unique d'outils de développement et de logiciels pour Milvus Bootcamp et Milvus Demos. Par conséquent, nous avons changé le cadre de Flask à FastAPI.</p>
<h3 id="4-Automatic-interactive-documents" class="common-anchor-header">4. Documents interactifs automatiques</h3><p>De manière traditionnelle, lorsque vous avez fini d'écrire le code pour le côté serveur, vous devez écrire un document supplémentaire pour créer une interface, puis utiliser des outils tels que <a href="https://www.postman.com/">Postman</a> pour les tests d'API et le débogage. Qu'en est-il si vous voulez seulement commencer rapidement avec la partie développement côté serveur web des projets dans Milvus Bootcamp sans écrire de code supplémentaire pour créer une interface ? FastAPI est la solution. En fournissant un document OpenAPI, FastAPI peut vous éviter de tester ou de déboguer les API et de collaborer avec les équipes frontales pour développer une interface utilisateur. Avec FastAPI, vous pouvez toujours essayer rapidement l'application construite avec une interface automatique mais intuitive sans effort supplémentaire de codage.</p>
<h3 id="5-User-friendliness" class="common-anchor-header">5. Convivialité</h3><p>FastAPI est plus facile à utiliser et à développer, ce qui vous permet d'accorder plus d'attention à la mise en œuvre spécifique du projet lui-même. Sans passer trop de temps à développer des cadres web, vous pouvez vous concentrer davantage sur la compréhension des projets dans Milvus Bootcamp.</p>
<h2 id="Recap" class="common-anchor-header">Récapitulatif<button data-href="#Recap" class="anchor-icon" translate="no">
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
    </button></h2><p>Flask et FlastAPI ont leurs propres avantages et inconvénients. En tant que framework d'application web émergent, FlastAPI, à la base, est construit sur des toolkits et des bibliothèques matures, Starlette et Pydantic. FastAPI est un framework asynchrone très performant. Sa dextérité, son extensibilité et sa prise en charge de la vérification automatique des types de données, ainsi que de nombreuses autres caractéristiques puissantes, nous ont incités à adopter FastAPI comme cadre de travail pour les projets Milvus Bootcamp.</p>
<p>Veuillez noter que vous devez choisir le framework approprié en fonction de votre scénario d'application si vous souhaitez construire un système de recherche de similarités vectorielles en production.</p>
<h2 id="About-the-author" class="common-anchor-header">A propos de l'auteur<button data-href="#About-the-author" class="anchor-icon" translate="no">
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
    </button></h2><p>Yunmei Li, ingénieur de données chez Zilliz, est diplômée en informatique de l'Université des sciences et technologies de Huazhong. Depuis qu'elle a rejoint Zilliz, elle travaille à l'exploration de solutions pour le projet open source Milvus et aide les utilisateurs à appliquer Milvus dans des scénarios réels. Elle se concentre principalement sur le NLP et les systèmes de recommandation, et elle aimerait approfondir ses connaissances dans ces deux domaines. Elle aime passer du temps seule et lire.</p>
<h2 id="Looking-for-more-resources" class="common-anchor-header">Vous cherchez d'autres ressources ?<button data-href="#Looking-for-more-resources" class="anchor-icon" translate="no">
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
<li><p>Commencez à construire un système d'IA avec Milvus et obtenez plus d'expérience pratique en lisant nos tutoriels !</p>
<ul>
<li><a href="https://milvus.io/blog/2021-10-10-milvus-helps-analys-vedios.md">Qu'est-ce que c'est ? Qui est-elle ? Milvus aide à analyser les vidéos de manière intelligente</a></li>
<li><a href="https://milvus.io/blog/2021-09-26-onnx.md">Combiner des modèles d'IA pour la recherche d'images en utilisant ONNX et Milvus</a></li>
<li><a href="https://milvus.io/blog/dna-sequence-classification-based-on-milvus.md">Classification des séquences d'ADN basée sur Milvus</a></li>
<li><a href="https://milvus.io/blog/audio-retrieval-based-on-milvus.md">Recherche audio basée sur Milvus</a></li>
<li><a href="https://milvus.io/blog/building-video-search-system-with-milvus.md">4 étapes pour construire un système de recherche vidéo</a></li>
<li><a href="https://milvus.io/blog/building-intelligent-chatbot-with-nlp-and-milvus.md">Création d'un système d'assurance qualité intelligent avec NLP et Milvus</a></li>
<li><a href="https://milvus.io/blog/molecular-structure-similarity-with-milvus.md">Accélérer la découverte de nouveaux médicaments</a></li>
</ul></li>
<li><p>Participez à notre communauté open-source :</p>
<ul>
<li>Trouvez ou contribuez à Milvus sur <a href="https://bit.ly/307b7jC">GitHub</a>.</li>
<li>Interagissez avec la communauté via le <a href="https://bit.ly/3qiyTEk">Forum</a>.</li>
<li>Connectez-vous avec nous sur <a href="https://bit.ly/3ob7kd8">Twitter</a>.</li>
</ul></li>
</ul>
