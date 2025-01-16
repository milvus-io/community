---
id: deep-dive-7-query-expression.md
title: Comment la base de données comprend-elle et exécute-t-elle votre requête ?
author: Milvus
date: 2022-05-05T00:00:00.000Z
desc: >-
  Une requête vectorielle est le processus d'extraction de vecteurs par filtrage
  scalaire.
cover: assets.zilliz.com/Deep_Dive_7_baae830823.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-7-query-expression.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deep_Dive_7_baae830823.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Image de couverture</span> </span></p>
<blockquote>
<p>Cet article est transcrit par <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>Une <a href="https://milvus.io/docs/v2.0.x/query.md">requête vectorielle</a> dans Milvus est le processus de récupération de vecteurs via un filtrage scalaire basé sur une expression booléenne. Avec le filtrage scalaire, les utilisateurs peuvent limiter les résultats de leurs requêtes en appliquant certaines conditions aux attributs des données. Par exemple, si un utilisateur recherche des films sortis entre 1990 et 2010 et dont le score est supérieur à 8,5, seuls les films dont les attributs (année de sortie et score) remplissent la condition.</p>
<p>Ce billet a pour but d'examiner comment une requête est complétée dans Milvus, de la saisie d'une expression de requête à la génération d'un plan de requête et à l'exécution de la requête.</p>
<p><strong>Aller à :</strong></p>
<ul>
<li><a href="#Query-expression">Expression de requête</a></li>
<li><a href="#Plan-AST-generation">Génération du plan AST</a></li>
<li><a href="#Query-execution">Exécution de la requête</a></li>
</ul>
<h2 id="Query-expression" class="common-anchor-header">Expression de la requête<button data-href="#Query-expression" class="anchor-icon" translate="no">
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
    </button></h2><p>L'expression d'une requête avec filtrage d'attributs dans Milvus adopte la syntaxe EBNF (Extended Backus-Naur form). L'image ci-dessous présente les règles d'expression dans Milvus.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Expression_Syntax_966493a5be.png" alt="Expression Syntax" class="doc-image" id="expression-syntax" />
   </span> <span class="img-wrapper"> <span>Syntaxe d'expression</span> </span></p>
<p>Les expressions logiques peuvent être créées en combinant des opérateurs logiques binaires, des opérateurs logiques unaires, des expressions logiques et des expressions simples. La syntaxe EBNF étant elle-même récursive, une expression logique peut être le résultat de la combinaison ou d'une partie d'une expression logique plus grande. Une expression logique peut contenir de nombreuses sous-expressions logiques. La même règle s'applique à Milvus. Si un utilisateur doit filtrer les attributs des résultats avec de nombreuses conditions, il peut créer son propre ensemble de conditions de filtrage en combinant différents opérateurs et expressions logiques.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Boolean_expression_1_dce12f8483.png" alt="Boolean expression" class="doc-image" id="boolean-expression" />
   </span> <span class="img-wrapper"> <span>Expression booléenne</span> </span></p>
<p>L'image ci-dessus montre une partie des <a href="https://milvus.io/docs/v2.0.x/boolean.md">règles d'expression booléenne</a> dans Milvus. Des opérateurs logiques unaires peuvent être ajoutés à une expression. Actuellement, Milvus ne prend en charge que l'opérateur logique unaire &quot;not&quot;, qui indique que le système doit prendre les vecteurs dont les valeurs du champ scalaire ne satisfont pas aux résultats du calcul. Les opérateurs logiques binaires comprennent &quot;and&quot; et &quot;or&quot;. Les expressions simples comprennent les expressions de terme et les expressions de comparaison.</p>
<p>Les calculs arithmétiques de base tels que l'addition, la soustraction, la multiplication et la division sont également pris en charge lors d'une requête dans Milvus. L'image suivante illustre la priorité des opérations. Les opérateurs sont énumérés de haut en bas par ordre de priorité décroissante.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Precedence_b8cfbdf17b.png" alt="Precedence" class="doc-image" id="precedence" />
   </span> <span class="img-wrapper"> <span>Ordre de préséance</span> </span></p>
<h3 id="How-a-query-expression-on-certain-films-is-processed-in-Milvus" class="common-anchor-header">Comment une expression de requête sur certains films est-elle traitée dans Milvus ?</h3><p>Supposons qu'il y ait une abondance de données de films stockées dans Milvus et que l'utilisateur souhaite interroger certains films. Par exemple, chaque film stocké dans Milvus comporte les cinq champs suivants : ID du film, année de sortie, type de film, score et affiche. Dans cet exemple, le type de données de l'ID du film et de l'année de sortie est int64, tandis que les scores des films sont des données à virgule flottante. De même, les affiches de films sont stockées sous forme de vecteurs à virgule flottante, et le type de film sous forme de données de type chaîne. La prise en charge des données de type chaîne est une nouvelle fonctionnalité de Milvus 2.1.</p>
<p>Par exemple, si un utilisateur souhaite interroger les films dont les scores sont supérieurs à 8,5. Les films doivent également être sortis entre une décennie avant 2000 et une décennie après 2000 ou être de type comédie ou film d'action, l'utilisateur doit saisir l'expression prédicat suivante : <code translate="no">score &gt; 8.5 &amp;&amp; (2000 - 10 &lt; release_year &lt; 2000 + 10 || type in [comedy,action])</code>.</p>
<p>Après avoir reçu l'expression de la requête, le système l'exécutera dans l'ordre suivant :</p>
<ol>
<li>Recherche de films dont le score est supérieur à 8,5. Les résultats de la requête sont appelés &quot;result1&quot;.</li>
<li>Calculer 2000 - 10 pour obtenir "result2" (1990).</li>
<li>Calculer 2000 + 10 pour obtenir "result3" (2010).</li>
<li>Recherchez les films dont la valeur de <code translate="no">release_year</code> est supérieure à &quot;result2&quot; et inférieure à &quot;result3&quot;. En d'autres termes, le système doit rechercher les films sortis entre 1990 et 2010. Les résultats de la requête sont appelés &quot;result4&quot;.</li>
<li>Recherche de films qui sont soit des comédies, soit des films d'action. Les résultats de la requête sont appelés &quot;result5&quot;.</li>
<li>Combinez "result4" et "result5" pour obtenir des films qui sont sortis entre 1990 et 2010 ou qui appartiennent à la catégorie des comédies ou des films d'action. Les résultats sont appelés &quot;résultat6&quot;.</li>
<li>Prenez la partie commune dans "résultat1" et "résultat6" pour obtenir les résultats finaux satisfaisant toutes les conditions.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_16_00972a6e5d.png" alt="Film example" class="doc-image" id="film-example" />
   </span> <span class="img-wrapper"> <span>Exemple de film</span> </span></p>
<h2 id="Plan-AST-generation" class="common-anchor-header">Génération de plans AST<button data-href="#Plan-AST-generation" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus utilise l'outil open-source <a href="https://www.antlr.org/">ANTLR</a> (ANother Tool for Language Recognition) pour la génération d'AST (abstract syntax tree) de plans. ANTLR est un puissant générateur d'analyseur syntaxique pour la lecture, le traitement, l'exécution ou la traduction de fichiers texte ou binaires structurés. Plus précisément, ANTLR peut générer un analyseur syntaxique pour construire et parcourir des arbres d'analyse basés sur une syntaxe ou des règles prédéfinies. L'image suivante est un exemple dans lequel l'expression d'entrée est &quot;SP=100 ;&quot;. LEXER, la fonctionnalité de reconnaissance du langage intégrée à ANTLR, génère quatre tokens pour l'expression d'entrée - &quot;SP&quot;, &quot;=&quot;, &quot;100&quot; et &quot; ;&quot;. L'outil analyse ensuite les quatre tokens pour générer l'arbre d'analyse correspondant.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/parse_tree_b2c3fb0b36.png" alt="parse tree" class="doc-image" id="parse-tree" />
   </span> <span class="img-wrapper"> <span>arbre d'analyse</span> </span></p>
<p>Le mécanisme de parcours est un élément crucial de l'outil ANTLR. Il est conçu pour parcourir tous les arbres d'analyse afin d'examiner si chaque nœud obéit aux règles syntaxiques ou de détecter certains mots sensibles. Certaines des API pertinentes sont énumérées dans l'image ci-dessous. Étant donné qu'ANTLR part du nœud racine et parcourt chaque sous-nœud jusqu'en bas, il n'est pas nécessaire de différencier l'ordre de parcours de l'arbre d'analyse.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/parse_tree_walker_9a27942502.png" alt="parse tree walker" class="doc-image" id="parse-tree-walker" />
   </span> <span class="img-wrapper"> <span>Le marcheur de l'arbre d'analyse</span> </span></p>
<p>Milvus génère le PlanAST pour les requêtes d'une manière similaire à ANTLR. Cependant, l'utilisation de l'ANTLR nécessite la redéfinition de règles syntaxiques assez compliquées. Par conséquent, Milvus adopte l'une des règles les plus répandues - les règles d'expression booléenne - et dépend du paquetage <a href="https://github.com/antonmedv/expr">Expr</a> ouvert sur GitHub pour interroger et analyser la syntaxe des expressions de requête.</p>
<p>Lors d'une requête avec filtrage d'attributs, Milvus génère un arbre de plan primitif non résolu à l'aide de ant-parser, la méthode d'analyse fournie par Expr, dès réception de l'expression de la requête. L'arbre de plan primitif que nous obtiendrons est un arbre binaire simple. L'arbre de plan est ensuite affiné par Expr et l'optimiseur intégré à Milvus. L'optimiseur de Milvus est assez similaire au mécanisme de marcheur mentionné plus haut. Étant donné que la fonctionnalité d'optimisation de l'arborescence fournie par Expr est assez sophistiquée, la charge de l'optimiseur intégré de Milvus est allégée dans une large mesure. En fin de compte, l'analyseur analyse l'arbre de plan optimisé de manière récursive pour générer un plan AST dans la structure des <a href="https://developers.google.com/protocol-buffers">tampons de protocole</a> (protobuf).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/plan_AST_workflow_3e50b7a0d4.png" alt="plan AST workflow" class="doc-image" id="plan-ast-workflow" />
   </span> <span class="img-wrapper"> <span>Flux de travail du plan AST</span> </span></p>
<h2 id="Query-execution" class="common-anchor-header">Exécution de la requête<button data-href="#Query-execution" class="anchor-icon" translate="no">
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
    </button></h2><p>L'exécution de la requête est à la base l'exécution du plan AST généré dans les étapes précédentes.</p>
<p>Dans Milvus, un plan AST est défini dans une structure proto. L'image ci-dessous est un message avec la structure protobuf. Il existe six types d'expressions, dont l'expression binaire et l'expression unaire, qui peuvent être complétées par une expression logique binaire et une expression logique unaire.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Protobuf1_232132dcf2.png" alt="protobuf1" class="doc-image" id="protobuf1" />
   </span> <span class="img-wrapper"> <span>protobuf1</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/protobuf2_193f92f033.png" alt="protobuf2" class="doc-image" id="protobuf2" />
   </span> <span class="img-wrapper"> <span>protobuf2</span> </span></p>
<p>L'image ci-dessous est une image UML de l'expression de requête. Elle montre la classe de base et la classe dérivée de chaque expression. Chaque classe est accompagnée d'une méthode acceptant les paramètres du visiteur. Il s'agit d'un modèle de conception typique des visiteurs. Milvus utilise ce modèle pour exécuter le plan AST car son principal avantage est que les utilisateurs n'ont rien à faire avec les expressions primitives mais peuvent accéder directement à l'une des méthodes des modèles pour modifier certaines classes d'expression de requête et les éléments pertinents.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/UML_1238bc30e1.png" alt="UML" class="doc-image" id="uml" />
   </span> <span class="img-wrapper"> <span>UML</span> </span></p>
<p>Lors de l'exécution d'un plan AST, Milvus reçoit d'abord un nœud de plan de type prototype. Un nœud de plan de type segcore est ensuite obtenu via l'analyseur syntaxique proto C++ interne. Après avoir obtenu les deux types de nœuds de plan, Milvus accepte une série d'accès aux classes, puis modifie et exécute la structure interne des nœuds de plan. Enfin, Milvus recherche tous les nœuds de plan d'exécution pour obtenir les résultats filtrés. Les résultats finaux sont présentés sous la forme d'un masque de bits. Un masque de bits est un tableau de nombres de bits ("0" et "1"). Les données qui satisfont aux conditions de filtrage sont marquées d'un "1" dans le masque de bits, tandis que celles qui ne satisfont pas aux exigences sont marquées d'un "0" dans le masque de bits.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/execute_workflow_d89f1ee925.png" alt="execute workflow" class="doc-image" id="execute-workflow" />
   </span> <span class="img-wrapper"> <span>exécuter le flux de travail</span> </span></p>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">À propos de la série Deep Dive<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>Avec l'<a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">annonce officielle de la disponibilité générale de</a> Milvus 2.0, nous avons orchestré cette série de blogs Milvus Deep Dive afin de fournir une interprétation approfondie de l'architecture et du code source de Milvus. Les sujets abordés dans cette série de blogs sont les suivants</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Vue d'ensemble de l'architecture Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">API et SDK Python</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Traitement des données</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Gestion des données</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">Requête en temps réel</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">Moteur d'exécution scalaire</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">Système d'assurance qualité</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">Moteur d'exécution vectoriel</a></li>
</ul>
