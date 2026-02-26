---
id: >-
  ai-code-review-gets-better-when-models-debate-claude-vs-gemini-vs-codex-vs-qwen-vs-minimax.md
title: >-
  L'examen du code de l'IA s'améliore lorsque les modèles débattent : Claude vs
  Gemini vs Codex vs Qwen vs MiniMax
author: Li Liu
date: 2026-02-26T00:00:00.000Z
cover: >-
  assets.zilliz.com/Code_Review_Benchmark_Cover_Fixed_Icons_2048x1143_11zon_1_04796f1364.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'AI Code Review, Qwen, Claude, Gemini, Codex'
meta_keywords: >-
  AI code review, LLM code review benchmark, Claude vs Gemini vs Codex, AI code
  review benchmark, multi-model AI debate
meta_title: |
  Claude vs Gemini vs Codex vs Qwen vs MiniMax Code Review
desc: >-
  Nous avons testé Claude, Gemini, Codex, Qwen et MiniMax sur la détection de
  bogues réels. Le meilleur modèle a atteint 53 %. Après un débat
  contradictoire, la détection a grimpé à 80 %.
origin: 'https://milvus.io/blog/ai-code-review-benchmark-multi-model-debate.md'
---
<p>J'ai récemment utilisé des modèles d'IA pour examiner une demande d'extraction, et les résultats étaient contradictoires : Claude a signalé une course aux données, tandis que Gemini a déclaré que le code était propre. J'ai donc lancé les derniers modèles phares de Claude, Gemini, Codex, Qwen et MiniMax dans un benchmark structuré de révision de code. Quels sont les résultats ? Le modèle le plus performant n'a détecté que 53 % des bogues connus.</p>
<p>Mais ma curiosité ne s'est pas arrêtée là : et si ces modèles d'IA travaillaient ensemble ? J'ai fait l'expérience de les faire débattre l'un avec l'autre et, après cinq rounds de débat contradictoire, la détection des bogues a grimpé à 80 %. Les bogues les plus difficiles, ceux qui nécessitent une compréhension au niveau du système, ont atteint une détection de 100 % en mode débat.</p>
<p>Ce billet présente la conception de l'expérience, les résultats par modèle, et ce que le mécanisme de débat révèle sur la façon d'utiliser l'IA pour la revue de code.</p>
<h2 id="Benchmarking-Claude-Gemini-Codex-Qwen-and-MiniMax-for-code-review" class="common-anchor-header">Analyse comparative de Claude, Gemini, Codex, Qwen et MiniMax pour la revue de code<button data-href="#Benchmarking-Claude-Gemini-Codex-Qwen-and-MiniMax-for-code-review" class="anchor-icon" translate="no">
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
    </button></h2><p>Si vous avez utilisé des modèles pour la revue de code, vous avez probablement remarqué qu'ils ne diffèrent pas seulement par leur précision, mais aussi par la façon dont ils lisent le code. Par exemple, Claude parcourt généralement la chaîne d'appels de haut en bas :</p>
<p>Claude parcourt généralement la chaîne d'appels de haut en bas et passe du temps sur les chemins "ennuyeux" (gestion des erreurs, tentatives, nettoyage). C'est souvent là que se cachent les vrais bogues, donc je ne déteste pas cette minutie.</p>
<p>Les Gémeaux ont tendance à commencer par un verdict fort ("c'est mauvais" / "ça a l'air bien") et travaillent ensuite à rebours pour le justifier du point de vue de la conception/structure. Parfois, c'est utile. Parfois, on a l'impression qu'il a survolé la question et qu'il s'est ensuite engagé à prendre une décision.</p>
<p>Le Codex est plus silencieux. Mais lorsqu'il signale quelque chose, c'est souvent concret et exploitable - moins de commentaires, plus de "cette ligne est mauvaise parce que X".</p>
<p>Il s'agit toutefois d'impressions, et non de mesures. Pour obtenir des chiffres réels, j'ai mis en place un benchmark.</p>
<h3 id="Setup" class="common-anchor-header">Configuration</h3><p><strong>Cinq modèles phares ont été testés :</strong></p>
<ul>
<li><p>Claude Opus 4.6</p></li>
<li><p>Gemini 3 Pro</p></li>
<li><p>GPT-5.2-Codex</p></li>
<li><p>Qwen-3.5-Plus</p></li>
<li><p>MiniMax-M2.5</p></li>
</ul>
<p><strong>Outil (Magpie)</strong></p>
<p>J'ai utilisé <a href="https://github.com/liliu-z/magpie">Magpie</a>, un outil de benchmarking open-source que j'ai construit. Son rôle est de faire la "préparation de l'examen du code" que vous feriez normalement manuellement : rassembler le contexte environnant (chaînes d'appels, modules connexes et code adjacent pertinent) et l'introduire dans le modèle <em>avant qu'</em> il n'examine la PR.</p>
<p><strong>Cas de test (PR Milvus avec bogues connus)</strong></p>
<p>L'ensemble de données se compose de 15 demandes d'extraction de <a href="https://github.com/milvus-io/milvus">Milvus</a> (une base de données vectorielle open-source créée et maintenue par <a href="https://zilliz.com/">Zilliz</a>). Ces PR sont utiles en tant que référence car chacune a été fusionnée, pour ensuite nécessiter un revert ou un hotfix après l'apparition d'un bug en production. Chaque cas a donc un bogue connu sur lequel nous pouvons nous baser.</p>
<p><strong>Niveaux de difficulté des bogues</strong></p>
<p>Tous ces bogues ne sont pas aussi difficiles à trouver, c'est pourquoi je les ai classés en trois niveaux de difficulté :</p>
<ul>
<li><p><strong>L1 :</strong> Visible à partir du diff seul (use-after-free, off-by-one).</p></li>
<li><p><strong>L2 (10 cas) :</strong> Nécessite de comprendre le code environnant pour repérer des choses comme des changements sémantiques d'interface ou des courses de concurrence. Il s'agit des bogues les plus courants dans l'examen quotidien du code.</p></li>
<li><p><strong>L3 (5 cas) :</strong> Nécessite une compréhension au niveau du système pour repérer des problèmes tels que des incohérences d'état entre modules ou des problèmes de compatibilité avec les mises à jour. Il s'agit des tests les plus difficiles pour déterminer à quel point un modèle peut raisonner sur une base de code.</p></li>
</ul>
<p><em>Note : Chaque modèle a détecté tous les bogues L1, je les ai donc exclus de la notation.</em></p>
<p><strong>Deux modes d'évaluation</strong></p>
<p>Chaque modèle a été exécuté en deux modes :</p>
<ul>
<li><p><strong>Raw :</strong> le modèle ne voit que le PR (diff + ce qui se trouve dans le contenu du PR).</p></li>
<li><p><strong>R1 :</strong> Magpie extrait le contexte environnant (fichiers pertinents / sites d'appel / code connexe) <em>avant que</em> le modèle <em>ne</em> révise. Cela simule un flux de travail où vous préparez le contexte à l'avance au lieu de demander au modèle de deviner ce dont il a besoin.</p></li>
</ul>
<h3 id="Results-L2-+-L3-only" class="common-anchor-header">Résultats (L2 + L3 uniquement)</h3><table>
<thead>
<tr><th>Mode</th><th>Claude</th><th>Gemini</th><th>Codex</th><th>MiniMax</th><th>Qwen</th></tr>
</thead>
<tbody>
<tr><td>Brut</td><td>53% (1er)</td><td>13% (dernier)</td><td>33%</td><td>27%</td><td>33%</td></tr>
<tr><td>R1 (avec contexte par Magpie)</td><td>47% ⬇️</td><td>33%⬆️</td><td>27%</td><td>33%</td><td>40%⬆️</td></tr>
</tbody>
</table>
<p>Quatre points à retenir :</p>
<p><strong>1. Claude domine l'évaluation brute.</strong> Il a obtenu un score global de 53% pour la détection et un score parfait de 5/5 pour les bogues L3, sans aucune assistance contextuelle. Si vous utilisez un seul modèle et que vous ne voulez pas passer du temps à préparer le contexte, Claude est le meilleur choix.</p>
<p><strong>2. Gemini a besoin de contexte.</strong> Son score brut de 13% était le plus bas du groupe, mais avec Magpie fournissant le code environnant, il a grimpé à 33%. Gemini ne rassemble pas bien son propre contexte, mais il obtient des résultats respectables lorsque vous faites ce travail en amont.</p>
<p><strong>3. Qwen est le plus performant en matière d'assistance contextuelle.</strong> Il a obtenu un score de 40 % en mode R1, avec 5/10 sur les bogues L2, ce qui est le score le plus élevé à ce niveau de difficulté. Pour les examens quotidiens de routine où vous êtes prêt à préparer le contexte, Qwen est un choix pratique.</p>
<p><strong>4. Plus de contexte n'est pas toujours utile.</strong> Il a amélioré Gemini (13 % → 33 %) et MiniMax (27 % → 33 %), mais il a en fait nui à Claude (53 % → 47 %). Claude excelle déjà dans l'organisation du contexte par lui-même, de sorte que les informations supplémentaires ont probablement introduit du bruit plutôt que de la clarté. La leçon à retenir : adapter le flux de travail au modèle, plutôt que de supposer que plus de contexte est universellement meilleur.</p>
<p>Ces résultats correspondent à mon expérience quotidienne. Claude en tête n'est pas surprenant. Le fait que Gemini ait obtenu un score inférieur à mes attentes est logique avec le recul : j'utilise généralement Gemini dans le cadre de conversations à plusieurs tours, lorsque j'élabore une conception ou que je cherche à résoudre un problème ensemble, et il donne de bons résultats dans ce contexte interactif. Ce benchmark est un pipeline fixe à un seul passage, ce qui est exactement le format dans lequel Gemini est le plus faible. La section consacrée au débat montrera plus loin que lorsque vous donnez à Gemini un format contradictoire à plusieurs tours, ses performances s'améliorent sensiblement.</p>
<h2 id="Let-AI-Models-Debate-with-Each-Other" class="common-anchor-header">Laisser les modèles d'IA débattre entre eux<button data-href="#Let-AI-Models-Debate-with-Each-Other" class="anchor-icon" translate="no">
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
    </button></h2><p>Chaque modèle a montré des forces et des faiblesses différentes dans les tests individuels. J'ai donc voulu faire un test : que se passe-t-il si les modèles examinent le travail des autres plutôt que le code ?</p>
<p>J'ai donc ajouté une couche de débat au-dessus du même benchmark. Les cinq modèles participent à cinq tours :</p>
<ul>
<li><p>Au cours du premier tour, chaque modèle examine le même PR de manière indépendante.</p></li>
<li><p>Ensuite, je diffuse les cinq évaluations à tous les participants.</p></li>
<li><p>Au deuxième tour, chaque modèle met à jour sa position en fonction des quatre autres.</p></li>
<li><p>Répétez l'opération jusqu'au 5e tour.</p></li>
</ul>
<p>À la fin, chaque modèle ne se contente pas de réagir au code, il réagit à des arguments qui ont déjà été critiqués et révisés à plusieurs reprises.</p>
<p>Pour éviter que cela ne se transforme en "LLMs qui s'accordent bruyamment", j'ai appliqué une règle stricte : <strong>chaque revendication doit s'appuyer sur un code spécifique comme preuve</strong>, et un modèle ne peut pas simplement dire "bon point" - il doit expliquer pourquoi il a changé d'avis.</p>
<h3 id="Results-Best-Solo-vs-Debate-Mode" class="common-anchor-header">Résultats : Best Solo vs Debate Mode</h3><table>
<thead>
<tr><th>Mode</th><th>L2 (10 cas)</th><th>L3 (5 cas)</th><th>Détection totale</th></tr>
</thead>
<tbody>
<tr><td>Meilleur individu (Raw Claude)</td><td>3/10</td><td>5/5</td><td>53%</td></tr>
<tr><td>Débat (les cinq modèles)</td><td>7/10 (doublé)</td><td>5/5 (tous pris)</td><td>80%</td></tr>
</tbody>
</table>
<h3 id="What-stands-out" class="common-anchor-header">Ce qui ressort</h3><p><strong>1. La détection de L2 a doublé.</strong> Les bogues de routine et de difficulté moyenne sont passés de 3/10 à 7/10. Ce sont les bogues qui apparaissent le plus fréquemment dans les bases de code réelles, et c'est exactement la catégorie dans laquelle les modèles individuels manquent de cohérence. La plus grande contribution du mécanisme de débat est de combler ces lacunes quotidiennes.</p>
<p><strong>2. Bogues L3 : zéro erreur.</strong> Dans les essais avec un seul modèle, seul Claude a détecté les cinq bogues L3 au niveau du système. En mode débat, le groupe a obtenu le même résultat, ce qui signifie qu'il n'est plus nécessaire de parier sur le bon modèle pour obtenir une couverture complète de L3.</p>
<p><strong>3. Le débat comble les angles morts au lieu de relever le plafond.</strong> Les bogues au niveau du système n'étaient pas la partie la plus difficile pour l'individu le plus fort. Claude les avait déjà. La principale contribution du mécanisme de débat est de combler la faiblesse de Claude sur les bogues L2 de routine, où Claude n'en a détecté que 3 sur 10, alors que le groupe de débat en a détecté 7. C'est de là que vient le bond de 53 % → 80 %.</p>
<h3 id="What-debate-actually-looks-like-in-practice" class="common-anchor-header">A quoi ressemble le débat dans la pratique</h3><p>Les chiffres ci-dessus montrent que le débat fonctionne, mais un exemple concret montre <em>pourquoi</em> il fonctionne. Voici un résumé de la manière dont les cinq modèles ont traité le <strong>PR #44474</strong>, qui a introduit le chargement paresseux des clés primaires lors de la recherche.</p>
<p><a href="https://github.com/milvus-io/milvus/pull/44474"><strong>PR #44474 :</strong></a> Une optimisation du chargement paresseux qui a modifié la recherche pour récupérer les clés primaires à la demande au lieu de les charger toutes à l'avance.</p>
<p><strong>Premier tour</strong></p>
<p>Gemini a ouvert le bal de manière agressive :</p>
<p>Cette PR est un champ de mines de mauvaises pratiques, de comportements potentiellement indéfinis et de régressions de performances déguisées en "optimisation".</p>
<p>Claude et Qwen se sont concentrés sur les comportements non définis et les performances, convergeant vers la même préoccupation :</p>
<p>"Le modèle de mémoire C++ ne garantit pas la sécurité des écritures simultanées sur différents indices du même vecteur sans synchronisation appropriée.</p>
<p>Les trois ont trouvé des problèmes réels, mais aucun d'entre eux n'a détecté le bogue le plus profond. Puis Codex, qui avait à peine parlé, a signalé quelque chose que les autres avaient manqué : le vecteur <code translate="no">primary_keys_</code> est redimensionné, mais seules les positions qui passent par la phase de réduction sont effectivement remplies. Toutes les autres positions sont laissées à zéro.</p>
<p><strong>Deuxième tour</strong></p>
<p>Claude a repris la découverte de Codex et en a retracé les conséquences en aval :</p>
<p>"J'ai trouvé : <code translate="no">SortEqualScoresByPks</code> s'exécute avant <code translate="no">ReduceResultData</code>. Ainsi, lorsque <code translate="no">SortEqualScoresByPks</code> s'exécute, aucun PK n'a encore été récupéré paresseusement. L'ensemble du vecteur <code translate="no">primary_keys_</code> est rempli de valeurs PkType construites par défaut."</p>
<p>En clair, la fonction de tri s'exécute avant que les clés n'aient été chargées, donc elle trie des zéros. Claude a reconnu ouvertement l'erreur :</p>
<p>"codex-cli a identifié un véritable bogue de correction critique. Je l'ai raté lors de mon premier tour".</p>
<h2 id="Which-Combination-of-Models-Can-Find-the-Most-Bugs" class="common-anchor-header">Quelle combinaison de modèles permet de trouver le plus grand nombre de bogues ?<button data-href="#Which-Combination-of-Models-Can-Find-the-Most-Bugs" class="anchor-icon" translate="no">
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
    </button></h2><p>Le bond de 53 % à 80 % s'explique par le fait que cinq modèles ont couvert les angles morts des uns et des autres. Mais tout le monde ne peut pas se permettre de mettre en place et d'exécuter cinq modèles au cours de cinq cycles de débats pour chaque examen de code.</p>
<p><strong>J'ai donc testé une version plus simple : si vous ne pouvez utiliser que deux modèles, quelle paire vous rapproche le plus du plafond multi-modèle ?</strong></p>
<p>J'ai utilisé les exécutions <strong>assistées par le contexte (R1)</strong> et j'ai compté combien de bogues sur les 15 connus chaque modèle avait trouvés :</p>
<ul>
<li><p><strong>Claude :</strong> 7/15 (47%)</p></li>
<li><p><strong>Qwen :</strong> 6/15 (40%)</p></li>
<li><p><strong>Gemini :</strong> 5/15 (33%)</p></li>
<li><p><strong>MiniMax :</strong> 5/15 (33%)</p></li>
<li><p><strong>Codex :</strong> 4/15 (27%)</p></li>
</ul>
<p>Ce qui importe, alors, ce n'est pas seulement le nombre de bogues que chaque modèle trouve, mais <em>les</em> bogues qu'il manque. Sur les 8 bogues manqués par Claude, Gemini en a détecté 3 : une condition de concurrence, un problème de compatibilité avec l'API de stockage en nuage et une vérification de permission manquante. Dans l'autre sens, Gemini a manqué la plupart des bogues liés aux structures de données et à la logique profonde, alors que Claude les a presque tous détectés. Leurs faiblesses se chevauchent à peine, ce qui en fait une paire solide.</p>
<table>
<thead>
<tr><th>Appariement de deux modèles</th><th>Couverture combinée</th></tr>
</thead>
<tbody>
<tr><td>Claude + Gemini</td><td>10/15</td></tr>
<tr><td>Claude + Qwen</td><td>9/15</td></tr>
<tr><td>Claude + Codex</td><td>8/15</td></tr>
<tr><td>Claude + MiniMax</td><td>8/15</td></tr>
</tbody>
</table>
<p>Les cinq modèles réunis ont couvert 11 des 15 bogues, ce qui laisse 4 bogues que chaque modèle a manqués.</p>
<p><strong>Claude + Gemini,</strong> en tant que paire de deux modèles, atteint déjà 91% de ce plafond de cinq modèles. Pour ce benchmark, c'est la combinaison la plus efficace.</p>
<p>Cela dit, Claude + Gemini n'est pas la meilleure combinaison pour tous les types de bogues. Lorsque j'ai décomposé les résultats par catégorie de bogues, une image plus nuancée est apparue :</p>
<table>
<thead>
<tr><th>Type de bogue</th><th>Total</th><th>Claude</th><th>Gemini</th><th>Codex</th><th>MiniMax</th><th>Qwen</th></tr>
</thead>
<tbody>
<tr><td>Lacunes en matière de validation</td><td>4</td><td>3</td><td>2</td><td>1</td><td>1</td><td>3</td></tr>
<tr><td>Cycle de vie des structures de données</td><td>4</td><td>3</td><td>1</td><td>1</td><td>3</td><td>1</td></tr>
<tr><td>Courses à la concurence</td><td>2</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>Compatibilité</td><td>2</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td></tr>
<tr><td>Logique profonde</td><td>3</td><td>1</td><td>0</td><td>1</td><td>1</td><td>1</td></tr>
<tr><td>Total</td><td>15</td><td>7</td><td>5</td><td>4</td><td>5</td><td>6</td></tr>
</tbody>
</table>
<p>La répartition par type de bogue révèle pourquoi aucun couple n'est universellement meilleur.</p>
<ul>
<li><p>Pour les bogues liés au cycle de vie des structures de données, Claude et MiniMax sont à égalité à 3/4.</p></li>
<li><p>Pour les lacunes de validation, Claude et Qwen sont à égalité à 3/4.</p></li>
<li><p>Pour les problèmes de concurrence et de compatibilité, Claude a obtenu un score nul dans les deux cas, et Gemini est celui qui comble ces lacunes.</p></li>
<li><p>Aucun modèle ne couvre tout, mais Claude couvre la gamme la plus large et se rapproche le plus d'un modèle généraliste.</p></li>
</ul>
<p>Quatre bogues ont été omis par tous les modèles. L'un d'eux concernait la priorité des règles de grammaire ANTLR. L'un d'entre eux concernait la priorité des règles de grammaire ANTLR. L'un d'entre eux nécessitait de comprendre les différences de logique d'entreprise entre les types de compactage. Et l'autre était une erreur de comparaison silencieuse où une variable utilisait des mégaoctets et une autre des octets.</p>
<p>Ce que ces quatre erreurs ont en commun, c'est que le code est syntaxiquement correct. Les bogues résident dans les hypothèses que le développeur a formulées dans sa tête, et non dans le diff, ni même dans le code environnant. C'est à peu près là que l'examen du code par l'IA atteint son plafond aujourd'hui.</p>
<h2 id="After-Finding-Bugs-Which-Model-is-the-Best-at-Fixing-Them" class="common-anchor-header">Après avoir trouvé les bogues, quel est le meilleur modèle pour les corriger ?<button data-href="#After-Finding-Bugs-Which-Model-is-the-Best-at-Fixing-Them" class="anchor-icon" translate="no">
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
    </button></h2><p>Dans l'examen du code, la détection des bogues représente la moitié du travail. L'autre moitié consiste à les corriger. Après les débats, j'ai donc ajouté une évaluation par les pairs pour mesurer l'utilité des suggestions de correction de chaque modèle.</p>
<p>Pour ce faire, j'ai ajouté un cycle d'évaluation par les pairs après le débat. Chaque modèle a ouvert une nouvelle session et a joué le rôle de juge anonyme, notant les évaluations des autres modèles. Les cinq modèles ont été associés de manière aléatoire aux évaluateurs A/B/C/D/E, de sorte qu'aucun juge ne savait quel modèle avait produit telle ou telle évaluation. Chaque juge a évalué quatre dimensions, notées de 1 à 10 : la précision, l'actionnabilité, la profondeur et la clarté.</p>
<table>
<thead>
<tr><th>Modèle</th><th>Précision</th><th>Capacité d'action</th><th>Profondeur</th><th>Clarté</th><th>Dans l'ensemble</th></tr>
</thead>
<tbody>
<tr><td>Qwen</td><td>8.6</td><td>8.6</td><td>8.5</td><td>8.7</td><td>8,6 (1er ex aequo)</td></tr>
<tr><td>Claude</td><td>8.4</td><td>8.2</td><td>8.8</td><td>8.8</td><td>8,6 (1er ex aequo)</td></tr>
<tr><td>Codex</td><td>7.7</td><td>7.6</td><td>7.1</td><td>7.8</td><td>7.5</td></tr>
<tr><td>Gemini</td><td>7.4</td><td>7.2</td><td>6.7</td><td>7.6</td><td>7.2</td></tr>
<tr><td>MiniMax</td><td>7.1</td><td>6.7</td><td>6.9</td><td>7.4</td><td>7.0</td></tr>
</tbody>
</table>
<p>Qwen et Claude sont à égalité pour la première place, avec une nette avance. Tous deux ont obtenu des scores élevés sur les quatre dimensions, tandis que Codex, Gemini et MiniMax se sont classés un point ou plus en dessous. Notamment, Gemini, qui s'est avéré précieux en tant que partenaire de Claude pour la recherche de bogues dans l'analyse d'appariement, se classe près du bas de l'échelle pour la qualité de l'examen. Il est évident qu'être bon pour repérer les problèmes et être bon pour expliquer comment les résoudre sont des compétences différentes.</p>
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
    </button></h2><p><strong>Claude</strong> est celui à qui vous feriez confiance pour les révisions les plus difficiles. Il travaille sur des chaînes d'appels entières, suit des chemins logiques profonds et tire parti de son propre contexte sans que vous ayez besoin de le nourrir à la petite cuillère. En ce qui concerne les bogues au niveau du système L3, rien d'autre ne s'en rapproche. Il est parfois trop confiant dans les mathématiques, mais lorsqu'un autre modèle prouve qu'il a tort, il l'assume et explique où son raisonnement s'est arrêté. Utilisez-le pour le code principal et les bogues que vous ne pouvez pas vous permettre de manquer.</p>
<p>Les<strong>Gémeaux</strong> arrivent en force. Il a des opinions bien arrêtées sur le style du code et les normes d'ingénierie, et il est prompt à formuler les problèmes de manière structurelle. L'inconvénient est qu'il reste souvent à la surface et ne creuse pas assez, ce qui explique son faible score lors de l'évaluation par les pairs. C'est en tant que challenger que Gemini mérite vraiment sa place : ses coups de gueule obligent les autres modèles à revérifier leur travail. Associé à Claude, il offre la perspective structurelle que ce dernier omet parfois.</p>
<p><strong>Codex</strong> ne dit presque rien. Mais lorsqu'il le fait, il compte. Son taux de réussite sur les bogues réels est élevé, et il a le don d'attraper la chose que tout le monde a ignorée. Dans l'exemple du PR #44474, Codex a été le modèle qui a repéré le problème des clés primaires à valeur nulle qui a déclenché toute la chaîne. Considérez-le comme le réviseur supplémentaire qui attrape ce que votre modèle principal a manqué.</p>
<p><strong>Qwen</strong> est le modèle le plus complet des cinq. La qualité de ses évaluations est équivalente à celle de Claude et il est particulièrement doué pour rassembler différentes perspectives afin de formuler des suggestions concrètes sur lesquelles vous pouvez agir. Il a également le taux de détection de L2 le plus élevé en mode contextuel, ce qui en fait un excellent outil par défaut pour les examens quotidiens de relations publiques. Sa seule faiblesse : dans les longs débats à plusieurs tours, il perd parfois la trace du contexte antérieur et commence à donner des réponses incohérentes dans les tours suivants.</p>
<p><strong>MiniMax</strong> a été le plus faible pour trouver des bogues par lui-même. Il est préférable de l'utiliser pour compléter un groupe multi-modèle plutôt que comme évaluateur autonome.</p>
<h2 id="Limitations-of-This-Experiment" class="common-anchor-header">Limites de cette expérience<button data-href="#Limitations-of-This-Experiment" class="anchor-icon" translate="no">
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
    </button></h2><p>Quelques mises en garde pour garder cette expérience en perspective :</p>
<p><strong>L'échantillon est de petite taille.</strong> Il n'y a que 15 PRs, tous issus du même projet Go/C++ (Milvus). Ces résultats ne s'appliquent pas à tous les langages ou bases de code. Considérez-les comme des indications, et non comme des conclusions.</p>
<p><strong>Les modèles sont intrinsèquement aléatoires.</strong> L'exécution de la même invite deux fois peut produire des résultats différents. Les chiffres présentés dans cet article représentent un instantané unique, et non une valeur attendue stable. Les classements des modèles individuels doivent être pris à la légère, bien que les tendances générales (le débat surpasse les individus, différents modèles excellent pour différents types de bogues) soient cohérentes.</p>
<p><strong>L'ordre des interventions a été fixé.</strong> Le débat a utilisé le même ordre pour tous les tours, ce qui a pu influencer la façon dont les modèles qui ont parlé plus tard ont réagi. Une expérience future pourrait randomiser l'ordre de parole pour chaque tour afin de contrôler ce phénomène.</p>
<h2 id="Try-it-yourself" class="common-anchor-header">Essayez vous-même<button data-href="#Try-it-yourself" class="anchor-icon" translate="no">
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
    </button></h2><p>Tous les outils et les données de cette expérience sont en libre accès :</p>
<ul>
<li><p><a href="https://github.com/liliu-z/magpie"><strong>Magpie</strong></a>: Un outil open-source qui rassemble le contexte du code (chaînes d'appels, PRs associés, modules affectés) et orchestre un débat contradictoire multi-modèle pour l'examen du code.</p></li>
<li><p><a href="https://github.com/liliu-z/ai-code-review-arena"><strong>AI-CodeReview-Arena</strong></a>: Le pipeline d'évaluation complet, les configurations et les scripts.</p></li>
<li><p><a href="https://github.com/liliu-z/ai-code-review-arena/blob/main/prs/manifest.yaml"><strong>Cas de test</strong></a>: Les 15 RP avec les bogues connus annotés.</p></li>
</ul>
<p>Les bogues de cette expérience proviennent tous de demandes d'extraction réelles dans <a href="https://github.com/milvus-io/milvus">Milvus</a>, une base de données vectorielle open-source conçue pour les applications d'IA. Nous avons une communauté assez active sur <a href="https://discord.com/invite/8uyFbECzPX">Discord</a> et <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack</a>, et nous aimerions que plus de gens s'intéressent au code. Et si vous finissez par exécuter ce benchmark sur votre propre base de code, n'hésitez pas à partager les résultats ! Je suis vraiment curieux de savoir si les tendances se maintiennent à travers différents langages et projets.</p>
<h2 id="Keep-Reading" class="common-anchor-header">Lire la suite<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/glm5-vs-minimax-m25-vs-gemini-3-deep-think.md">GLM-5 vs. MiniMax M2.5 vs. Gemini 3 Réflexion approfondie : Quel modèle convient à votre pile d'agents d'IA ?</a></p></li>
<li><p><a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">Ajouter une mémoire persistante au code Claude avec le plugin léger memsearch</a></p></li>
<li><p><a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">Nous avons extrait le système de mémoire d'OpenClaw et l'avons mis en open-source (memsearch)</a></p></li>
</ul>
