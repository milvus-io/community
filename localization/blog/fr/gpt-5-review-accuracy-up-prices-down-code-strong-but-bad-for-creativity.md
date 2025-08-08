---
id: gpt-5-review-accuracy-up-prices-down-code-strong-but-bad-for-creativity.md
title: >-
  Examen du GPT-5 : Précision en hausse, prix en baisse, code fort - mais
  mauvais pour la créativité
author: Lumina Wang
date: 2025-08-08T00:00:00.000Z
cover: assets.zilliz.com/gpt_5_review_7df71f395a.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, OpenAI, gpt-5'
meta_keywords: 'Milvus, gpt-5, openai, chatgpt'
meta_title: |
  GPT-5 Review: Accuracy Up, Prices Down, Code Strong, Bad Creativity
desc: >-
  pour les développeurs, en particulier ceux qui créent des agents et des
  pipelines RAG, cette version pourrait bien être la mise à jour la plus utile à
  ce jour.
origin: >-
  https://milvus.io/blog/gpt-5-review-accuracy-up-prices-down-code-strong-but-bad-for-creativity.md
---
<p><strong>Après des mois de spéculation, OpenAI a finalement livré</strong> <a href="https://openai.com/gpt-5/"><strong>GPT-5</strong></a><strong>.</strong> Le modèle n'est pas le coup de foudre créatif que GPT-4 a été, mais pour les développeurs, en particulier ceux qui construisent des agents et des pipelines RAG, cette version peut tranquillement être la mise à jour la plus utile à ce jour.</p>
<p><strong>TL;DR pour les développeurs :</strong> GPT-5 unifie les architectures, augmente les E/S multimodales, réduit les taux d'erreurs factuelles, étend le contexte à 400k tokens et rend l'utilisation à grande échelle abordable. Cependant, la créativité et le flair littéraire ont sensiblement reculé.</p>
<h2 id="What’s-New-Under-the-Hood" class="common-anchor-header">Quelles sont les nouveautés sous le capot ?<button data-href="#What’s-New-Under-the-Hood" class="anchor-icon" translate="no">
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
<li><p><strong>Noyau unifié</strong> - Fusion de la série numérique GPT avec les modèles de raisonnement de la série o, offrant un raisonnement à longue chaîne et multimodal dans une architecture unique.</p></li>
<li><p><strong>Multimodalité à spectre complet</strong> - Entrée/sortie de texte, d'image, d'audio et de vidéo, le tout au sein d'un même modèle.</p></li>
<li><p><strong>Des gains de précision considérables</strong>:</p>
<ul>
<li><p><code translate="no">gpt-5-main</code>: 44 % d'erreurs factuelles en moins par rapport à GPT-4o.</p></li>
<li><p><code translate="no">gpt-5-thinking</code>78% d'erreurs factuelles en moins par rapport à o3.</p></li>
</ul></li>
<li><p>Amélioration<strong>des compétences dans certains domaines</strong>: plus fortes dans la génération de codes, le raisonnement mathématique, la consultation médicale et la rédaction structurée ; les hallucinations ont été réduites de manière significative.</p></li>
</ul>
<p>Outre le GPT-5, l'OpenAI a également publié <strong>trois variantes supplémentaires</strong>, chacune optimisée pour des besoins différents :</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt_5_family_99a9bee18a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<table>
<thead>
<tr><th><strong>Modèle</strong></th><th><strong>Description</strong></th><th><strong>Entrée / $ par 1M tokens</strong></th><th><strong>Sortie / $ par 1M de jetons</strong></th><th><strong>Mise à jour des connaissances</strong></th></tr>
</thead>
<tbody>
<tr><td>gpt-5</td><td>Modèle principal, raisonnement à longue chaîne + multimodalité complète</td><td>$1.25</td><td>$10.00</td><td>2024-10-01</td></tr>
<tr><td>gpt-5-chat</td><td>Équivalent de gpt-5, utilisé dans les conversations ChatGPT</td><td>-</td><td>-</td><td>2024-10-01</td></tr>
<tr><td>gpt-5-mini</td><td>60% moins cher, conserve ~90% de la performance de programmation</td><td>$0.25</td><td>$2.00</td><td>2024-05-31</td></tr>
<tr><td>gpt-5-nano</td><td>Edge/offline, contexte 32K, latence &lt;40ms</td><td>$0.05</td><td>$0.40</td><td>2024-05-31</td></tr>
</tbody>
</table>
<p>GPT-5 a battu des records dans 25 catégories de référence - de la réparation de code au raisonnement multimodal en passant par les tâches médicales - avec des améliorations constantes de la précision.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmark_1_8ebf1bed4b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmark_2_c43781126f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Why-Developers-Should-Care--Especially-for-RAG--Agents" class="common-anchor-header">Pourquoi les développeurs devraient s'en préoccuper - en particulier pour RAG et les agents<button data-href="#Why-Developers-Should-Care--Especially-for-RAG--Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Nos tests pratiques suggèrent que cette version est une révolution tranquille pour la génération assistée par récupération et les flux de travail pilotés par des agents.</p>
<ol>
<li><p>Les<strong>baisses de prix</strong> rendent l'expérimentation viable - Coût d'entrée de l'API : <strong><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>1.</mn><mo>25permilliontokens∗∗</mo><mo separator="true">;</mo><mi>coût</mi><mi>de sortie</mi><mo>:</mo><mo>∗∗1</mo></mrow><annotation encoding="application/x-tex">.25 par million de tokens** ; coût de sortie : **</annotation></semantics></math></span></span></strong><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span> 1 <strong><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">.</span><span class="mord mathnormal">25permilliontokens</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">∗</span></span></span></span></strong><span class="mspace" style="margin-right:0.2222em;"></span> <strong><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8095em;vertical-align:-0.1944em;"></span> ∗</span></span></span></strong> <strong><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mpunct">;</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal">outputcost</span><span class="mspace" style="margin-right:0.2778em;"></span></span></span></span></strong>: <strong><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.4653em;"></span><span class="mord">∗∗10</span></span></span></span></strong>.</p></li>
<li><p><strong>Une fenêtre de contexte de 400k</strong> (vs. 128k dans o3/4o) vous permet de maintenir l'état à travers des workflows complexes d'agents multi-étapes sans découpage de contexte.</p></li>
<li><p><strong>Moins d'hallucinations et une meilleure utilisation des outils</strong> - Prise en charge des appels d'outils enchaînés en plusieurs étapes, gestion des tâches complexes non standard et amélioration de la fiabilité de l'exécution.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt_tool_call_e6a86fc59c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Not-Without-Flaws" class="common-anchor-header">Pas sans défauts<button data-href="#Not-Without-Flaws" class="anchor-icon" translate="no">
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
    </button></h2><p>Malgré ses avancées techniques, GPT-5 montre encore des limites évidentes.</p>
<p>At launch, OpenAI’s keynote featured a slide that bizarrely calculated <em>52.8 &gt; 69.1 = 30.8</em>, and in our own tests, the model confidently repeated the textbook-but-wrong “Bernoulli effect” explanation for airplane lift—reminding us <strong>it’s still a pattern learner, not a true domain expert.</strong></p>
<p><strong>Si les performances en matière de STIM se sont améliorées, la profondeur créative a diminué.</strong> De nombreux utilisateurs de longue date constatent un déclin du flair littéraire : la poésie semble plus plate, les conversations philosophiques moins nuancées et les récits de longue haleine plus mécaniques. Le compromis est clair : une plus grande précision des faits et un raisonnement plus solide dans les domaines techniques, mais au détriment du ton artistique et exploratoire qui donnait autrefois à GPT un aspect presque humain.</p>
<p>En gardant cela à l'esprit, voyons comment le GPT-5 se comporte lors de nos tests pratiques.</p>
<h2 id="Coding-Tests" class="common-anchor-header">Tests de codage<button data-href="#Coding-Tests" class="anchor-icon" translate="no">
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
    </button></h2><p>J'ai commencé par une tâche simple : écrire un script HTML qui permet aux utilisateurs de télécharger une image et de la déplacer avec la souris. GPT-5 a fait une pause d'environ neuf secondes, puis a produit un code fonctionnel qui gérait bien l'interaction. C'était un bon début.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt52_7b04c9b41b.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>La deuxième tâche était plus difficile : mettre en œuvre la détection des collisions polygone-boule à l'intérieur d'un hexagone en rotation, avec une vitesse de rotation, une élasticité et un nombre de billes ajustables. GPT-5 a généré la première version en environ treize secondes. Le code comprenait toutes les fonctionnalités attendues, mais il comportait des bogues et ne s'exécutait pas.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_6_3e6a34572a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>J'ai alors utilisé l'option <strong>Fix bug</strong> de l'éditeur, et GPT-5 a corrigé les erreurs pour que l'hexagone s'affiche. Cependant, les boules ne sont jamais apparues - la logique de spawn était manquante ou incorrecte, ce qui signifie que la fonction principale du programme était absente en dépit d'une configuration par ailleurs complète.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt51_6489df9914.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>En résumé,</strong> GPT-5 peut produire un code interactif propre et bien structuré et corriger des erreurs d'exécution simples. Mais dans les scénarios complexes, il risque toujours d'omettre une logique essentielle, de sorte qu'un examen humain et une itération sont nécessaires avant le déploiement.</p>
<h2 id="Reasoning-Test" class="common-anchor-header">Test de raisonnement<button data-href="#Reasoning-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>J'ai posé une énigme logique à plusieurs étapes impliquant des couleurs d'articles, des prix et des indices de position, ce qui prendrait plusieurs minutes à la plupart des humains pour la résoudre.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/reasoning_test_7ea15ed25b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>La question est la suivante : "Quel est l'article bleu ?</strong> <em>Quel est l'article bleu et quel est son prix ?</em></p>
<p>Le GPT-5 a fourni la bonne réponse en seulement 9 secondes, avec une explication claire et logique. Ce test a renforcé les points forts du modèle en matière de raisonnement structuré et de déduction rapide.</p>
<h2 id="Writing-Test" class="common-anchor-header">Test d'écriture<button data-href="#Writing-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>Je fais souvent appel à ChatGPT pour m'aider à rédiger des blogs, des messages sur les réseaux sociaux et d'autres contenus écrits, et la génération de texte est donc l'une des capacités qui me tient le plus à cœur. Pour ce test, j'ai demandé à GPT-5 de créer un post LinkedIn basé sur un blog à propos de l'analyseur multilingue de Milvus 2.6.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Writing_Test_4fe5fef775.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Le résultat était bien organisé et reprenait tous les points clés du blog original, mais il semblait trop formel et prévisible - plus comme un communiqué de presse d'entreprise que comme quelque chose destiné à susciter l'intérêt sur un flux social. Il manquait la chaleur, le rythme et la personnalité qui font qu'un billet se sent humain et accueillant.</p>
<p>En revanche, les illustrations qui l'accompagnaient étaient excellentes : claires, conformes à la marque et parfaitement alignées sur le style technique de Zilliz. Visuellement, c'était parfait ; l'écriture a juste besoin d'un peu plus d'énergie créative pour être à la hauteur.</p>
<h2 id="Longer-Context-Window--Death-of-RAG-and-VectorDB" class="common-anchor-header">Fenêtre contextuelle plus longue = mort de RAG et VectorDB ?<button data-href="#Longer-Context-Window--Death-of-RAG-and-VectorDB" class="anchor-icon" translate="no">
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
    </button></h2><p>Nous avons abordé ce sujet l'année dernière lorsque <a href="https://zilliz.com/blog/will-retrieval-augmented-generation-RAG-be-killed-by-long-context-LLMs">Google a lancé <strong>Gemini 1.5 Pro</strong></a> avec sa fenêtre contextuelle ultra longue de 10 millions de jetons. À l'époque, certains n'ont pas hésité à prédire la fin de RAG, voire la fin des bases de données tout court. Aujourd'hui, non seulement RAG est toujours en vie, mais il est en plein essor. En pratique, il est devenu <em>plus</em> performant et plus productif, tout comme les bases de données vectorielles telles que <a href="https://milvus.io/"><strong>Milvus</strong></a> et <a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a>.</p>
<p>Aujourd'hui, avec l'extension de la longueur du contexte de GPT-5 et les capacités d'appel d'outils plus avancées, la question se pose à nouveau : <em>Avons-nous encore besoin de bases de données vectorielles pour l'ingestion de contexte, ou même de pipelines agents/RAG dédiés ?</em></p>
<p><strong>Réponse courte : absolument oui. Nous en avons toujours besoin.</strong></p>
<p>Un contexte plus long est utile, mais il ne remplace pas la recherche structurée. Les systèmes multi-agents sont toujours en passe de devenir une tendance architecturale à long terme, et ces systèmes ont souvent besoin d'un contexte virtuellement illimité. De plus, lorsqu'il s'agit de gérer des données privées et non structurées en toute sécurité, une base de données vectorielle sera toujours le dernier garde-barrière.</p>
<h2 id="Conclusion" class="common-anchor-header">Conclusion<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Après avoir assisté à l'événement de lancement d'OpenAI et effectué mes propres tests pratiques, GPT-5 ressemble moins à un bond en avant spectaculaire qu'à un mélange raffiné des forces du passé avec quelques améliorations bien placées. Ce n'est pas une mauvaise chose, c'est un signe des limites architecturales et de la qualité des données que les grands modèles commencent à rencontrer.</p>
<p>Comme le dit l'adage, <em>les critiques sévères sont le fruit d'attentes élevées</em>. Toute déception concernant GPT-5 provient principalement de la barre très haute qu'OpenAI s'est fixée. Et vraiment, une meilleure précision, des prix plus bas et un support multimodal intégré sont toujours des victoires précieuses. Pour les développeurs qui créent des agents et des pipelines RAG, il s'agit peut-être de la mise à jour la plus utile à ce jour.</p>
<p>Certains amis ont plaisanté sur la création de "mémoriaux en ligne" pour GPT-4o, affirmant que la personnalité de leur ancien compagnon de chat avait disparu à jamais. Le changement ne me dérange pas - GPT-5 est peut-être moins chaleureux et bavard, mais son style direct et sans fioritures est rafraîchissant.</p>
<p><strong>Et vous, qu'en pensez-vous ?</strong> Partagez vos idées avec nous : rejoignez notre <a href="https://discord.com/invite/8uyFbECzPX">Discord</a> ou participez à la conversation sur <a href="https://www.linkedin.com/company/the-milvus-project/">LinkedIn</a> et <a href="https://x.com/milvusio">X.</a></p>
