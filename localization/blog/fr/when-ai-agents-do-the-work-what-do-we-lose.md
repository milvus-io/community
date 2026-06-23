---
id: when-ai-agents-do-the-work-what-do-we-lose.md
title: |
  Quand les agents IA se chargent du travail, qu’est-ce que nous perdons ?
author: Bill Chen
date: 2026-06-18T00:00:00.000Z
cover: assets.zilliz.com/AI_Agents_Work_blog_cover_1536x1024_565f1739a0.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'AI agents, agentic AI, AI coding agents, agent memory, LLM agents'
meta_title: |
  When AI Agents Do the Work, What Do We Lose?
desc: >
  Les agents IA gagnent en efficacité en matière d'exécution, de mémoire et de
  respect des normes. Mais s'ils suppriment le cycle d'apprentissage inhérent au
  travail, le jugement humain risque de cesser de s'améliorer.
origin: 'https://milvus.io/blog/when-ai-agents-do-the-work-what-do-we-lose.md'
---
<p>Les agents sont de plus en plus performants dans l’exécution des tâches.</p>
<p>Claude Code est capable d’écrire et de refactoriser de grandes quantités de code. Cursor aide les développeurs à parcourir plus rapidement les bases de code. Devin et d’autres agents orientés tâches tentent de prendre en charge des workflows plus longs. Au-delà du codage, les agents rédigent des e-mails, traitent des documents, synthétisent des données, mettent à jour des tickets et automatisent des tâches répétitives qui nécessitaient auparavant une intervention humaine directe.</p>
<p>La plupart de ces produits font la même promesse : donnez suffisamment de contexte à l’agent, et il se chargera d’une plus grande partie de l’exécution à votre place. Cette promesse est utile, mais elle soulève également une question à laquelle les agents n’ont pas encore pleinement répondu : <strong>lorsque l’agent effectue une plus grande partie du travail, que perdons-nous ?</strong></p>
<p>La réponse ne se résume pas simplement à « l’effort manuel ». La tâche est peut-être accomplie, mais l’humain a peut-être sauté une partie du processus qui servait autrefois à forger son jugement : lire, retracer, déboguer, comparer les options, faire des erreurs et comprendre pourquoi une solution est meilleure qu’une autre.</p>
<p>Cela ne signifie pas que les agents nuisent à l’apprentissage. Cela signifie que les produits basés sur des agents doivent être conçus en tenant compte de l’apprentissage. S’ils ne visent qu’à optimiser le résultat, ils risquent de supprimer l’expérience même qui aide les humains à améliorer les normes sur lesquelles s’appuient les agents.</p>
<p>Une façon utile d’aborder ce problème consiste à s’inspirer de l’échelle d’autonomie des systèmes de conduite autonome. L’analogie n’est pas parfaite, mais elle aide à distinguer différents types de progrès dans les produits basés sur des agents :</p>
<ul>
<li><strong>Les agents de niveau 1 exécutent des tâches.</strong> L’humain donne des instructions, et l’agent les met en œuvre.</li>
<li><strong>Les agents de niveau L2 mémorisent.</strong> Ils apprennent d’une session à l’autre en stockant les préférences, les corrections et le contexte du projet.</li>
<li><strong>Les agents de niveau 3 appliquent des normes.</strong> L’humain définit des règles, des contraintes et des critères de décision au lieu de guider chaque étape.</li>
<li><strong>Les agents de niveau 4 améliorent les capacités de l’humain.</strong> L’agent ne se contente pas d’effectuer le travail. Il aide l’humain à préserver et à affiner son jugement.</li>
</ul>
<p>La majeure partie du secteur se concentre encore sur les trois premiers niveaux. Cela se comprend. L’exécution, la mémoire et les normes constituent des enjeux immédiats pour les produits. Mais c’est au niveau L4 que se profile le risque à long terme. Si les humains cessent de s’améliorer, les normes qui guident les agents cessent elles aussi de s’améliorer.</p>
<h2 id="L1-Agents-execute" class="common-anchor-header">Niveau 1 : les agents exécutent<button data-href="#L1-Agents-execute" class="anchor-icon" translate="no">
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
    </button></h2><p>Le développement d’applications d’IA a franchi plusieurs niveaux d’abstraction :</p>
<ul>
<li>Au début, les développeurs appelaient un modèle via une API : envoyer du texte, recevoir du texte en retour.</li>
<li>Puis est venue <strong>l’ingénierie des invites</strong>, où la compétence principale consistait à apprendre à poser de meilleures questions.</li>
<li>Puis est apparue <strong>l’ingénierie contextuelle</strong>, où la tâche consistait à fournir au modèle suffisamment d’exemples, de contraintes et de contexte pour qu’il se comporte de manière utile dans une situation spécifique.</li>
<li>Puis est apparue <strong>l’ingénierie des harnais</strong>: connecter les modèles à des outils, des workflows, des fichiers, des bases de données, des navigateurs, des terminaux et des systèmes de production.</li>
<li><strong>L’ingénierie des agents</strong> s’appuie sur tout cela. Au lieu de demander au modèle de répondre à une seule invite, nous lui demandons de planifier des étapes, de choisir des outils, d’inspecter les résultats, de se remettre d’erreurs et d’accomplir des tâches en plusieurs étapes avec moins de supervision.</li>
</ul>
<p>L’environnement technique ne cesse d’évoluer, mais la relation fondamentale au niveau L1 reste la même : <strong>l’humain définit la tâche, et l’agent l’exécute.</strong> Chaque interaction reste encore largement autonome. La tâche est accomplie, la session se termine, et la tâche suivante recommence à zéro.</p>
<p>Ce niveau fonctionne déjà suffisamment bien pour modifier les comportements. Les agents peuvent prendre en charge davantage d’exécutions avec moins d’intervention manuelle. À mesure qu’ils deviennent moins coûteux, plus rapides et plus fiables, le rendement augmente tandis que les coûts diminuent.</p>
<p>Mais cette exécution simplifiée crée un nouveau goulot d’étranglement. Chaque session parallèle nécessite toujours un humain pour expliquer la tâche, fournir le contexte, examiner le résultat, évaluer la qualité et décider de la suite des opérations. L’agent effectue peut-être le travail, mais c’est toujours à l’humain qu’il revient de déterminer si ce travail est satisfaisant.</p>
<p><strong>L’exécution devient moins coûteuse. Le jugement prend davantage d’importance.</strong></p>
<h2 id="L2-Agents-remember" class="common-anchor-header">Niveau 2 : les agents mémorisent<button data-href="#L2-Agents-remember" class="anchor-icon" translate="no">
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
    </button></h2><p>Le niveau L1 résout la tâche qui lui est présentée. Le niveau L2 pose une question différente : <strong>l’agent peut-il tirer des enseignements de cette interaction afin que la suivante se déroule mieux ?</strong></p>
<p>Un agent L1 pur est sans état. Une fois la session terminée, le contexte disparaît. La tâche suivante repart de zéro. Les agents L2 rompent avec ce schéma en accumulant de l’expérience d’une session à l’autre. Ils mémorisent les préférences de l’utilisateur, les conventions du projet, les retours récurrents, les décisions antérieures et les schémas de travail de l’utilisateur. <strong>L’objectif est de transformer l’expérience générée par l’interaction entre l’humain et l’agent en une ressource réutilisable.</strong></p>
<p>C’est également la raison pour laquelle la mémoire de l’agent ne doit pas être considérée comme une simple extension de la ligne de commande ou un dossier contenant des transcriptions enregistrées. Une mémoire utile nécessite une infrastructure : un stockage durable, une recherche sémantique, la déduplication, des mises à jour, ainsi qu’un moyen de séparer le contexte obsolète des connaissances encore utiles. C’est là que nos travaux chez <a href="https://zilliz.com/">Zilliz</a> s’inscrivent dans cette problématique. <a href="https://milvus.io/">Milvus</a>, ainsi que les services gérés Zilliz Cloud construits autour de cette plateforme, sont souvent utilisés comme couche de recherche pour la mémoire de l’agent, car ils permettent de rechercher le contexte passé au lieu de simplement l’archiver.</p>
<p><strong>Mais la mémoire de niveau 2 présente une limite structurelle.</strong> La majeure partie de ce que les agents apprennent à ce stade provient de comportements observables : ce que l’utilisateur a dit, modifié, accepté, rejeté ou corrigé. Un agent peut se souvenir que vous avez réécrit un paragraphe, rejeté une implémentation ou modifié la signature d’une fonction. Il peut ne pas en comprendre la raison.</p>
<p>Le problème concernait-il la précision, le ton, la maintenabilité, un risque de sécurité, les performances, le positionnement du produit ou autre chose ? Le comportement est la surface visible du jugement. Le raisonnement sous-jacent reste souvent caché.</p>
<p>C’est pourquoi le niveau L2 est plus à même de saisir les connaissances explicites que les connaissances tacites. Il peut mémoriser les règles que vous avez énoncées directement et stocker des exemples de décisions passées. Mais les exemples ne deviennent pas automatiquement des principes. L’agent peut se souvenir de ce qui s’est passé sans comprendre la norme qui sous-tend cette action.</p>
<p>Cet écart conduit au niveau L3.</p>
<h2 id="L3-Agents-apply-standards" class="common-anchor-header">Niveau 3 : les agents appliquent des normes<button data-href="#L3-Agents-apply-standards" class="anchor-icon" translate="no">
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
    </button></h2><p>Une fois que les niveaux L1 et L2 sont opérationnels, la prochaine étape évidente est le parallélisme.</p>
<p>Si un agent peut accomplir une tâche, pourquoi ne pas en lancer dix ? Si un agent peut apprendre à partir d’une seule session, pourquoi ne pas ouvrir plusieurs sessions et les laisser toutes produire du travail simultanément ? C’est la logique de l’« ingénieur 10x » ou de l’« ingénieur 100x » : utiliser des agents pour multiplier le rendement.</p>
<p>En pratique, le parallélisme engendre ses propres coûts. Chaque session exige toujours que l’humain change de contexte, comprenne le problème, examine le travail, donne son avis et décide si le résultat est satisfaisant. Au-delà d’un certain seuil, les agents supplémentaires ne sont plus perçus comme un levier de performance, mais comme une charge supplémentaire.</p>
<p>Il ne s’agit pas seulement d’un problème de flux de travail. C’est un obstacle cognitif. Les humains ne gèrent pas les tâches parallèles de la même manière que les machines. Le changement de tâche épuise l’attention. La mémoire de travail est limitée. Chaque changement augmente le risque de passer à côté de détails, d’appliquer un critère inapproprié ou d’approuver un travail trop rapidement.</p>
<p><strong>Un bon produit ne doit pas aller à l’encontre de cette limite. Il doit être conçu en tenant compte de celle-ci.</strong></p>
<p>Chez L3, la consigne passe de « résous ce problème spécifique de cette manière précise » à « voici les normes que tu dois appliquer ». L’humain cesse d’être l’opérateur qui guide chaque étape et devient la personne qui définit les règles, les contraintes, les préférences, les seuils de qualité et les critères de décision.</p>
<p>Un utilisateur peut toujours guider un agent dans une tâche spécifique, mais la valeur de cet accompagnement ne doit pas disparaître à la fin de la session. L’interaction doit laisser derrière elle une norme réutilisable, et pas seulement un compte-rendu. La prochaine fois qu’une tâche similaire se présentera, l’agent devra appliquer la norme sans demander à l’humain de reconstituer l’intégralité du contexte et de porter à nouveau le même jugement.</p>
<p>Le secteur évolue déjà dans cette direction. De nombreux produits d’agents permettent aux utilisateurs de définir des règles, des instructions, des souvenirs, des conventions de projet et des préférences comportementales. La direction est la bonne, mais la plupart des implémentations en sont encore à leurs débuts. Les règles sont souvent du texte statique : mises à jour manuellement, fragmentées et n’ayant qu’un lien ténu avec le raisonnement qui sous-tend les décisions d’un utilisateur.</p>
<p>Le modèle le plus performant est un modèle cognitif personnel mis à jour en continu : une représentation lisible par machine de la manière dont une personne évalue, décide et fait des compromis. Il devrait encoder les préférences, les valeurs, les contraintes, les exceptions, les normes et le style de décision sous forme de contexte que les agents peuvent récupérer et appliquer.</p>
<p>Au lieu de se contenter de stocker des conversations passées, il devrait rendre la pensée de l’utilisateur lisible par les machines.</p>
<p>Le rôle de l’utilisateur évolue en conséquence. Au lieu d’expliquer chaque tâche à partir de zéro, l’utilisateur entretient le modèle en affinant les normes, en mettant à jour ses préférences, en corrigeant ses hypothèses et en rendant explicites ses jugements implicites. D’une certaine manière, l’utilisateur se « tokenise » en permanence : il convertit une part croissante de sa réflexion en une forme exploitable par les agents.</p>
<p>Lorsque l’exécution est peu coûteuse, l’humain n’a pas besoin de décider de chaque détail de mise en œuvre avant le début d’une tâche. L’humain doit définir ce qui constitue un bon résultat, ce qui est inacceptable et comment les compromis doivent être gérés.</p>
<h2 id="L4-Agents-preserve-human-learning" class="common-anchor-header">Niveau 4 : les agents préservent l’apprentissage humain<button data-href="#L4-Agents-preserve-human-learning" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Les trois premiers niveaux visent à améliorer la manière dont les agents servent les humains. Le niveau L4 inverse la question : comment les agents peuvent-ils aider les humains à s’améliorer ?</strong></p>
<p>C’est la question à laquelle la plupart des produits basés sur des agents n’ont pas encore pleinement répondu. Lorsque les agents effectuent une plus grande partie du travail à notre place, qu’est-ce qui disparaît exactement du côté humain de la boucle ?</p>
<p>À première vue, nous perdons l’effort manuel. C’est l’avantage évident. Mais nous risquons également de perdre trois éléments moins visibles : la mémoire situationnelle du travail, la pratique consistant à faire des compromis, et la reconnaissance des schémas qui découle d’une exposition répétée à des détails complexes.</p>
<p><strong>J’en ai fait l’expérience directe en programmant.</strong> Lorsque j’écrivais moi-même du code, je me souvenais de l’emplacement de chaque ligne et du fonctionnement du système, car j’avais passé du temps à le lire, à le déboguer, à le tracer et à le corriger à la main. Ce processus ne se limitait pas à produire du code. Il entraînait mon cerveau à reconnaître les structures.</p>
<p>Avec Claude Code, le code est toujours généré, souvent plus rapidement. Mais au bout d’un certain temps, ma mémoire du système n’est plus aussi approfondie. Je sais peut-être ce que fait le système, mais je ne me souviens pas toujours comment chaque partie s’est assemblée. L’expérience de la construction est condensée, et une partie de l’apprentissage disparaît avec elle.</p>
<p>Ce n’est pas un argument contre les agents de codage. C’est un argument selon lequel les produits basés sur des agents doivent préserver les aspects du travail qui forgent le jugement humain.</p>
<p>Le même schéma se retrouve en dehors du codage. Si un agent rédige chaque note stratégique, l’humain risque de perdre l’habitude de structurer un argumentaire. Si un agent résume chaque article, l’humain risque de perdre l’habitude de remarquer ce que le résumé a omis. Si un agent prend toutes les décisions opérationnelles, l’humain risque de cesser de développer l’intuition qui naît de la gestion d’exceptions complexes.</p>
<p>Le travail disparaît. Le résultat reste. Mais la boucle d’apprentissage risque de s’affaiblir.</p>
<p>C’est là le problème du niveau L4.</p>
<h2 id="Human-judgment-is-the-ceiling" class="common-anchor-header">Le jugement humain est le plafond<button data-href="#Human-judgment-is-the-ceiling" class="anchor-icon" translate="no">
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
    </button></h2><p>Cette perte est importante car les agents ne fonctionnent pas en vase clos. Un agent est un multiplicateur, pas un substitut. Un même outil produit des résultats très différents entre les mains d’un expert et celles d’un débutant. Un ingénieur expérimenté utilisant un agent peut devenir nettement plus efficace. Un débutant peut simplement produire davantage sans pour autant développer un meilleur jugement.</p>
<p>Les agents amplifient le niveau cognitif existant de l’utilisateur.</p>
<p>Cela a son importance car le niveau L3 repose sur la définition, par les humains, des normes que les agents doivent suivre. Or, la qualité de ces normes dépend de la qualité du jugement humain. Si l’humain cesse de s’améliorer, les normes finissent par devenir obsolètes. Elles deviennent incomplètes, superficielles ou inadaptées à la réalité actuelle du travail.</p>
<p>Le système fonctionne au mieux sous forme de boucle :</p>
<ul>
<li>Le jugement humain définit les normes.</li>
<li>Les agents agissent dans le respect de ces normes.</li>
<li>Les résultats de cette exécution alimentent l’apprentissage humain.</li>
<li>L'apprentissage humain améliore les normes.</li>
</ul>
<p>Si la boucle fonctionne, les deux parties s’améliorent. L’agent agit plus efficacement, et l’humain devient plus apte à définir ce que signifie « efficace ». Si la boucle se rompt, le système se dégrade. Le jugement humain stagne. Les normes deviennent obsolètes. Les agents continuent à s’optimiser, mais ils le font dans un cadre qui prend peu à peu du retard.</p>
<p>C’est pourquoi le jugement humain constitue la limite maximale. Des agents plus performants ne suppriment pas le besoin d’humains plus performants. Ils rendent la qualité du jugement humain d’autant plus importante, car ce jugement devient le cadre dans lequel l’agent opère.</p>
<h2 id="Why-agents-cannot-solve-the-whole-problem-alone" class="common-anchor-header">Pourquoi les agents ne peuvent pas résoudre seuls l’ensemble du problème<button data-href="#Why-agents-cannot-solve-the-whole-problem-alone" class="anchor-icon" translate="no">
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
    </button></h2><p>Une réponse s’impose : les agents ne cesseront de gagner en puissance ; peut-être finiront-ils donc par générer d’eux-mêmes de meilleures connaissances, de meilleures règles et de meilleures normes.</p>
<p>Il y a du vrai là-dedans. Les agents sont déjà très doués pour combiner des idées, explorer des espaces de solutions et mettre en évidence des voies auxquelles les humains n’auraient peut-être pas pensé. Un modèle peut produire des phrases, des conceptions et des solutions qui ne figuraient pas dans ses données d’entraînement. Il peut recombiner des schémas issus de différents domaines et générer des alternatives utiles.</p>
<p>C’est là une véritable valeur ajoutée. Mais le niveau L4 porte sur un autre type de création. La question n’est pas seulement de savoir qui peut trouver une meilleure réponse. Il s’agit de savoir qui peut poser une nouvelle question, réécrire la norme ou élargir l’espace du problème.</p>
<p>Les agents excellent dans la généralisation, la combinaison et la recherche au sein d’une distribution existante. Ils peuvent trouver de meilleures voies sur un terrain connu, parfois des voies que les humains n’ont pas encore empruntées. Mais décider si le terrain lui-même doit être redessiné est une autre affaire.</p>
<p>Ce type de décision découle souvent du contexte humain : contraintes vécues, enjeux personnels, curiosité, insatisfaction et coût de l’erreur. Une personne peut formuler une hypothèse qui remet en cause le cadre actuel et la tester face à la réalité. Plus important encore, une personne peut avoir une raison de continuer à tester une idée même si celle-ci semble erronée, risquée ou inutile au premier abord.</p>
<p>La géométrie non euclidienne en est un exemple utile. L’étape importante n’a pas consisté simplement à se demander : « Et si des lignes parallèles se croisaient ? » Un agent aurait pu générer cette phrase. L’étape importante a consisté à considérer cette hypothèse étrange comme méritant d’être explorée, puis à en suivre les conséquences jusqu’à ce qu’elle devienne un nouvel espace théorique. Cela a nécessité de la persévérance, des enjeux et une raison de se soucier du résultat.</p>
<p>Le cadre de référence de Margaret Boden sur la créativité est utile ici. Elle distingue trois types de créativité :</p>
<ul>
<li><strong>La créativité combinatoire :</strong> combiner des idées familières de manière nouvelle.</li>
<li><strong>La créativité exploratoire :</strong> explorer un espace conceptuel existant.</li>
<li><strong>La créativité transformationnelle :</strong> modifier les règles de l’espace conceptuel lui-même.</li>
</ul>
<p>Les agents excellent déjà dans les deux premiers modes. Ils combinent des idées existantes et explorent des espaces conceptuels existants. Le troisième mode est plus difficile. La créativité transformationnelle ne repose pas seulement sur une recherche plus rapide. Elle dépend des raisons pour lesquelles quelqu’un choisit de rejeter une ancienne règle, d’accepter le coût de l’échec et de continuer à tester une idée qui ne trouve pas encore sa place.</p>
<p><strong>Pour être plus précis, on peut affirmer ceci : les agents excellent dans la combinaison et l’exploration au sein d’espaces existants. Les nouvelles connaissances fondamentales, les nouveaux espaces de problèmes et les nouveaux cadres de valeurs dépendent encore fortement des humains.</strong></p>
<h2 id="Design-for-the-loop-not-just-the-output" class="common-anchor-header">Concevoir pour la boucle, pas seulement pour le résultat<button data-href="#Design-for-the-loop-not-just-the-output" class="anchor-icon" translate="no">
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
    </button></h2><p>Tous les produits basés sur des agents n’ont pas besoin de résoudre le niveau 4. Certains produits doivent simplement aider les utilisateurs à accomplir leurs tâches plus rapidement. C’est très bien ainsi. D’autres ont besoin de mémoire, de normes et d’une meilleure intégration dans les flux de travail.</p>
<p>Mais au niveau de l’écosystème, certains produits doivent préserver la boucle d’apprentissage. Si chaque produit d’agent aide les personnes à réduire leur charge de travail, et qu’aucun ne les aide à continuer d’apprendre une fois qu’elles ont cessé d’effectuer directement le travail, les capacités humaines s’affaiblissent avec le temps. L’espace d’optimisation des agents cesse de s’étendre. L’ensemble du système reste limité par le niveau actuel du jugement humain.</p>
<p>C’est là que la conception du produit prend toute son importance. Le niveau L4 ne se limite pas à demander à l’agent de résumer ce qu’il a fait. Un produit L4 utile préserve les aspects du travail qui développent le jugement humain, même lorsque l’agent se charge de la majeure partie de l’exécution.</p>
<p>Quelques principes de conception sont ici essentiels :</p>
<ul>
<li><strong>Préserver les moments clés de jugement.</strong> Certaines décisions doivent rester visibles pour l’humain, non pas parce que l’agent est incapable de les prendre, mais parce que ces décisions permettent d’entraîner le jugement. Le produit doit identifier les moments qui comptent et veiller à ce qu’ils restent l’objet d’une réflexion délibérée.</li>
<li><strong>Reconstituer le processus, et pas seulement le résultat.</strong> Un artefact fini ne suffit pas. Le système doit mettre en évidence les branches décisionnelles clés, les compromis, les chemins alternatifs et les tentatives infructueuses. Un utilisateur qui ne voit que le résultat peut l’approuver ou le rejeter. Un utilisateur qui voit le cheminement du raisonnement peut mettre à jour son modèle mental.</li>
<li><strong>Favoriser l’exploration collaborative.</strong> Lorsque l’utilisateur est dans le doute, l’agent ne doit pas se précipiter vers une réponse. Il doit aider à élargir l’espace du problème : quelles dimensions importent, quelles hypothèses manquent, quelles informations sont encore nécessaires et quels coûts chaque option implique.</li>
<li><strong>Remettre en question les hypothèses humaines.</strong> Cela ne signifie pas contester pour le simple plaisir de la controverse. Il s’agit de reconnaître les lacunes ou les tensions dans la réflexion de l’utilisateur et de poser des questions ciblées qui rendent ces tensions visibles.</li>
</ul>
<p>L’objectif n’est pas de contraindre les humains à reprendre chaque étape manuelle. Cela irait à l’encontre de l’objectif même des agents. L’objectif est de préserver les aspects du travail qui transforment l’expérience en jugement.</p>
<p>Les agents ne doivent pas seulement optimiser le résultat. Ils doivent optimiser la boucle de rétroaction : un meilleur jugement humain, de meilleures normes, une meilleure exécution par les agents et un meilleur apprentissage humain à partir des résultats.</p>
<p><strong>Lorsque les agents IA effectuent le travail, nous ne devons pas perdre de vue la boucle qui a permis aux humains de s’améliorer dans ce travail au départ.</strong></p>
<h2 id="We’d-love-to-hear-your-thoughts" class="common-anchor-header">Nous serions ravis de connaître votre avis<button data-href="#We’d-love-to-hear-your-thoughts" class="anchor-icon" translate="no">
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
    </button></h2><p>Si vous développez des agents, j’aimerais savoir ce que vous en pensez : quelles parties du travail les agents devraient-ils prendre entièrement en charge, et quelles parties devraient rester visibles parce qu’elles aident les humains à continuer de s’améliorer ?</p>
