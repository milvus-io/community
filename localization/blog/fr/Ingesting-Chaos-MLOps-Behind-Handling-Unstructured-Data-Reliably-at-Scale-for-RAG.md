---
id: >-
  Ingesting-Chaos-MLOps-Behind-Handling-Unstructured-Data-Reliably-at-Scale-for-RAG.md
title: >-
  Ingérer le chaos : Les MLOps derrière le traitement fiable des données non
  structurées à l'échelle pour RAG
author: David Garnitz
date: 2023-10-16T00:00:00.000Z
cover: assets.zilliz.com/Ingesting_Chaos_20231017_110103_54fe2009cb.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Retrieval Augmented Generation, RAG, Unstructured Data
recommend: true
desc: >-
  Grâce à des technologies telles que VectorFlow et Milvus, l'équipe peut tester
  efficacement différents environnements tout en respectant les exigences en
  matière de confidentialité et de sécurité.
canonicalUrl: >-
  https://milvus.io/blog/Ingesting-Chaos-MLOps-Behind-Handling-Unstructured-Data-Reliably-at-Scale-for-RAG.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Ingesting_Chaos_20231017_110103_54fe2009cb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Les données sont générées plus rapidement que jamais, sous toutes les formes imaginables. Ces données sont l'essence qui alimentera une nouvelle vague d'applications d'intelligence artificielle, mais ces moteurs d'amélioration de la productivité ont besoin d'aide pour ingérer ce carburant. Le large éventail de scénarios et de cas limites entourant les données non structurées rend difficile leur utilisation dans les systèmes d'intelligence artificielle de production.</p>
<p>Tout d'abord, il existe un grand nombre de sources de données. Celles-ci exportent les données dans différents formats de fichiers, chacun ayant ses particularités. Par exemple, le traitement d'un fichier PDF varie considérablement en fonction de sa provenance. L'ingestion d'un PDF dans le cadre d'un litige en matière de valeurs mobilières se concentrera probablement sur les données textuelles. En revanche, une spécification de conception de système destinée à un ingénieur en fusées sera pleine de diagrammes nécessitant un traitement visuel. L'absence de schéma défini dans les données non structurées ajoute encore à la complexité. Même lorsque le défi du traitement des données est surmonté, le problème de l'ingestion à grande échelle reste entier. La taille des fichiers peut varier considérablement, ce qui modifie la manière dont ils sont traités. Il est possible de traiter rapidement un téléchargement de 1 Mo sur une API via HTTP, mais la lecture de dizaines de Go à partir d'un seul fichier nécessite une diffusion en continu et un employé dédié.</p>
<p>Surmonter ces défis traditionnels de l'ingénierie des données est un enjeu de taille pour connecter des données brutes aux <a href="https://zilliz.com/glossary/large-language-models-(llms)">LLM</a> via des <a href="https://zilliz.com/learn/what-is-vector-database">bases de données vectorielles</a> telles que <a href="https://github.com/milvus-io/milvus">Milvus</a>. Cependant, les cas d'utilisation émergents tels que les recherches de similarité sémantique à l'aide d'une base de données vectorielle nécessitent de nouvelles étapes de traitement telles que le découpage des données sources, l'orchestration des métadonnées pour les recherches hybrides, le choix du modèle d'intégration vectorielle approprié et l'ajustement des paramètres de recherche pour déterminer quelles données doivent être transmises au LLM. Ces flux de travail sont si nouveaux qu'il n'existe pas de meilleures pratiques à suivre pour les développeurs. Au lieu de cela, ils doivent expérimenter pour trouver la configuration et le cas d'utilisation corrects pour leurs données. Pour accélérer ce processus, l'utilisation d'un pipeline d'incorporation de vecteurs pour gérer l'ingestion des données dans la base de données vectorielle est inestimable.</p>
<p>Un pipeline d'intégration vectorielle comme <a href="https://github.com/dgarnitz/vectorflow">VectorFlow</a> connectera vos données brutes à votre base de données vectorielle, y compris le découpage, l'orchestration des métadonnées, l'intégration et le téléchargement. VectorFlow permet aux équipes d'ingénieurs de se concentrer sur la logique de l'application principale, en expérimentant les différents paramètres d'extraction générés par le modèle d'intégration, la stratégie de regroupement, les champs de métadonnées et les aspects de la recherche pour voir ce qui fonctionne le mieux.</p>
<p>Dans le cadre de nos travaux visant à aider les équipes d'ingénieurs à faire passer leurs systèmes de <a href="https://zilliz.com/use-cases/llm-retrieval-augmented-generation">génération augmentée de données (RAG)</a> du stade du prototype à celui de la production, nous avons observé que l'approche suivante permettait de tester avec succès les différents paramètres d'un pipeline de recherche RAG :</p>
<ol>
<li>Utilisez un petit ensemble de données que vous connaissez bien pour accélérer l'itération, par exemple quelques PDF contenant des morceaux pertinents pour les requêtes de recherche.</li>
<li>Créez un ensemble standard de questions et de réponses sur ce sous-ensemble de données. Par exemple, après avoir lu les PDF, rédigez une liste de questions et demandez à votre équipe de se mettre d'accord sur les réponses.</li>
<li>Créez un système d'évaluation automatisé qui évalue les résultats de la recherche pour chaque question. Une façon de procéder est de prendre la réponse du système RAG et de la faire passer par le LLM avec une invite qui demande si ce résultat RAG répond à la question avec la bonne réponse. La réponse doit être "oui" ou "non". Par exemple, si vous avez 25 questions sur vos documents et que le système obtient 20 réponses correctes, vous pouvez utiliser ce résultat pour vous comparer à d'autres approches.</li>
<li>Assurez-vous d'utiliser un LLM différent pour l'évaluation de celui que vous avez utilisé pour encoder les ancrages vectoriels stockés dans la base de données. Le LLM d'évaluation est généralement un décodeur d'un modèle comme le GPT-4. Il ne faut pas oublier le coût de ces évaluations lorsqu'elles sont exécutées de manière répétée. Les modèles open-source comme Llama2 70B ou Deci AI LLM 6B, qui peuvent être exécutés sur un seul GPU plus petit, ont à peu près les mêmes performances pour une fraction du coût.</li>
<li>Exécutez chaque test plusieurs fois et faites la moyenne des résultats pour lisser la stochasticité du LLM.</li>
</ol>
<p>En maintenant toutes les options constantes sauf une, vous pouvez rapidement déterminer les paramètres qui conviennent le mieux à votre cas d'utilisation. Un pipeline d'incorporation de vecteurs comme VectorFlow rend cela particulièrement facile du côté de l'ingestion, où vous pouvez rapidement essayer différentes stratégies de découpage en morceaux, longueurs de morceaux, chevauchements de morceaux et modèles d'incorporation open-source pour voir ce qui donne les meilleurs résultats. Cela est particulièrement utile lorsque votre ensemble de données comporte différents types de fichiers et sources de données qui nécessitent une logique personnalisée.</p>
<p>Une fois que l'équipe sait ce qui fonctionne pour son cas d'utilisation, le pipeline d'incorporation de vecteurs lui permet de passer rapidement à la production sans avoir à repenser le système pour prendre en compte des éléments tels que la fiabilité et la surveillance. Grâce à des technologies telles que VectorFlow et <a href="https://zilliz.com/what-is-milvus">Milvus</a>, qui sont open-source et indépendantes des plateformes, l'équipe peut tester efficacement différents environnements tout en respectant les exigences en matière de confidentialité et de sécurité.</p>
