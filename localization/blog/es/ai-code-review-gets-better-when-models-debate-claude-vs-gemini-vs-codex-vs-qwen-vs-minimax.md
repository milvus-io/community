---
id: >-
  ai-code-review-gets-better-when-models-debate-claude-vs-gemini-vs-codex-vs-qwen-vs-minimax.md
title: >
  AI Code Review Gets Better When Models Debate: Claude vs Gemini vs Codex vs
  Qwen vs MiniMax
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
desc: >
  We tested Claude, Gemini, Codex, Qwen, and MiniMax on real bug detection. The
  best model hit 53%. After adversarial debate, detection jumped to 80%.
origin: 'https://milvus.io/blog/ai-code-review-benchmark-multi-model-debate.md'
---
<p>I recently used AI models to review a pull request, and the results were contradictory: Claude flagged a data race, while Gemini said the code was clean. That got me curious about how other AI models would behave, so I ran the latest flagship models from Claude, Gemini, Codex, Qwen, and MiniMax through a structured code-review benchmark. The results? The best-performing model caught only 53% of known bugs.</p>
<p>However, my curiosity didn’t end there: what if these AI models worked together? I experimented with having them debate each other, and after five rounds of adversarial debate, bug detection jumped to 80%. The hardest bugs, ones requiring system-level understanding, hit 100% detection in debate mode.</p>
<p>This post walks through the experiment design, per-model results, and what the debate mechanism reveals about how to actually use AI for code review.</p>
<h2 id="Benchmarking-Claude-Gemini-Codex-Qwen-and-MiniMax-for-code-review" class="common-anchor-header">Benchmarking Claude, Gemini, Codex, Qwen, and MiniMax for code review<button data-href="#Benchmarking-Claude-Gemini-Codex-Qwen-and-MiniMax-for-code-review" class="anchor-icon" translate="no">
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
    </button></h2><p>If you’ve been using models for code review, you’ve probably noticed they don’t just differ in accuracy; they differ in how they read code. For example:</p>
<p>Claude usually walks the call chain top-to-bottom and will spend time on “boring” paths (error handling, retries, cleanup). That’s often where the real bugs hide, so I don’t hate the thoroughness.</p>
<p>Gemini tends to start with a strong verdict (“this is bad” / “looks fine”) and then works backwards to justify it from a design/structure angle. Sometimes that’s useful. Sometimes it reads like it skimmed and then committed to a take.</p>
<p>Codex is quieter. But when it flags something, it’s often concrete and actionable — less commentary, more “this line is wrong because X.”</p>
<p>These are impressions, though, not measurements. To get actual numbers, I set up a benchmark.</p>
<h3 id="Setup" class="common-anchor-header">Setup</h3><p><strong>Five flagship models were tested:</strong></p>
<ul>
<li><p>Claude Opus 4.6</p></li>
<li><p>Gemini 3 Pro</p></li>
<li><p>GPT-5.2-Codex</p></li>
<li><p>Qwen-3.5-Plus</p></li>
<li><p>MiniMax-M2.5</p></li>
</ul>
<p><strong>Tooling (Magpie)</strong></p>
<p>I used <a href="https://github.com/liliu-z/magpie">Magpie</a>, an open-source benchmarking tool I built. Its job is to do the “code review prep” you’d normally do manually: pull in surrounding context (call chains, related modules, and relevant adjacent code) and feed that to the model <em>before</em> it reviews the PR.</p>
<p><strong>Test cases (Milvus PRs with known bugs)</strong></p>
<p>The dataset consists of 15 pull requests from <a href="https://github.com/milvus-io/milvus">Milvus</a> (an open-source vector database created and maintained by <a href="https://zilliz.com/">Zilliz</a>). These PRs are useful as a benchmark because each was merged, only to later require a revert or hotfix after a bug surfaced in production. So every case has a known bug we can score against.</p>
<p><strong>Bug difficulty levels</strong></p>
<p>Not all of these bugs are equally hard to find, though, so I categorized them into three difficulty levels:</p>
<ul>
<li><p><strong>L1:</strong> Visible from the diff alone (use-after-free, off-by-one).</p></li>
<li><p><strong>L2 (10 cases):</strong> Requires understanding surrounding code to spot things like interface semantic changes or concurrency races. These represent the most common bugs in daily code review.</p></li>
<li><p><strong>L3 (5 cases):</strong> Requires system-level understanding to catch issues like cross-module state inconsistencies or upgrade compatibility problems. These are the hardest tests of how deeply a model can reason about a codebase.</p></li>
</ul>
<p><em>Note: Every model caught all L1 bugs, so I excluded them from scoring.</em></p>
<p><strong>Two evaluation modes</strong></p>
<p>Each model was run in two modes:</p>
<ul>
<li><p><strong>Raw:</strong> the model sees only the PR (diff + whatever is in the PR content).</p></li>
<li><p><strong>R1:</strong> Magpie pulls the surrounding context (relevant files / call sites / related code) <em>before</em> the model reviews. This simulates a workflow where you prep context up front instead of asking the model to guess what it needs.</p></li>
</ul>
<h3 id="Results-L2-+-L3-only" class="common-anchor-header">Results (L2 + L3 only)</h3><table>
<thead>
<tr><th>Mode</th><th>Claude</th><th>Gemini</th><th>Codex</th><th>MiniMax</th><th>Qwen</th></tr>
</thead>
<tbody>
<tr><td>Raw</td><td>53% (1st)</td><td>13% (last)</td><td>33%</td><td>27%</td><td>33%</td></tr>
<tr><td>R1 (with context by Magpie)</td><td>47% ⬇️</td><td>33%⬆️</td><td>27%</td><td>33%</td><td>40%⬆️</td></tr>
</tbody>
</table>
<p>Four takeaways:</p>
<p><strong>1. Claude dominates the raw review.</strong> It scored 53% overall detection and a perfect 5/5 on L3 bugs, without any context assistance. If you’re using a single model and don’t want to spend time preparing context, Claude is the best choice.</p>
<p><strong>2. Gemini needs context handed to it.</strong> Its raw score of 13% was the lowest in the group, but with Magpie providing surrounding code, it jumped to 33%. Gemini doesn’t gather its own context well, but it performs respectably when you do that work upfront.</p>
<p><strong>3. Qwen is the strongest context-assisted performer.</strong> It scored 40% in R1 mode, with 5/10 on L2 bugs, which was the highest score at that difficulty level. For routine daily reviews where you’re willing to prepare context, Qwen is a practical pick.</p>
<p><strong>4. More context doesn’t always help.</strong> It lifted Gemini (13% → 33%) and MiniMax (27% → 33%), but it actually hurt Claude (53% → 47%). Claude already excels at organizing context on its own, so the additional information likely introduced noise rather than clarity. The lesson: match the workflow to the model, rather than assuming more context is universally better.</p>
<p>These results align with my day-to-day experience. Claude at the top isn’t surprising. Gemini scoring lower than I expected makes sense in hindsight: I typically use Gemini in multi-turn conversations where I’m iterating on a design or chasing a problem together, and it performs well in that interactive setting. This benchmark is a fixed, single-pass pipeline, which is exactly the format in which Gemini is weakest. The debate section later will show that when you give Gemini a multi-round, adversarial format, its performance improves noticeably.</p>
<h2 id="Let-AI-Models-Debate-with-Each-Other" class="common-anchor-header">Let AI Models Debate with Each Other<button data-href="#Let-AI-Models-Debate-with-Each-Other" class="anchor-icon" translate="no">
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
    </button></h2><p>Every model showed different strengths and blind spots in the individual benchmarks. So I wanted to test: what happens if the models review each other’s work rather than just the code?</p>
<p>So I added a debate layer on top of the same benchmark. All five models participate in five rounds:</p>
<ul>
<li><p>In Round 1, each model reviews the same PR independently.</p></li>
<li><p>After that, I broadcast all five reviews to all participants.</p></li>
<li><p>In Round 2, each model updates its position based on the other four.</p></li>
<li><p>Repeat until Round 5.</p></li>
</ul>
<p>By the end, each model isn’t just reacting to the code — it’s reacting to arguments that have already been criticized and revised multiple times.</p>
<p>To keep this from turning into “LLMs agreeing loudly,” I enforced one hard rule: <strong>every claim has to point to specific code as evidence</strong>, and a model can’t just say “good point” — it has to explain why it changed its mind.</p>
<h3 id="Results-Best-Solo-vs-Debate-Mode" class="common-anchor-header">Results: Best Solo vs Debate Mode</h3><table>
<thead>
<tr><th>Mode</th><th>L2 (10 cases)</th><th>L3 (5 cases)</th><th>Total detection</th></tr>
</thead>
<tbody>
<tr><td>Best individual (Raw Claude)</td><td>3/10</td><td>5/5</td><td>53%</td></tr>
<tr><td>Debate (all five models)</td><td>7/10 (doubled)</td><td>5/5 (all caught)</td><td>80%</td></tr>
</tbody>
</table>
<h3 id="What-stands-out" class="common-anchor-header">What stands out</h3><p><strong>1. L2 detection doubled.</strong> Routine, mid-difficulty bugs jumped from 3/10 to 7/10. These are the bugs that appear most frequently in real codebases, and they’re exactly the category where individual models miss inconsistently. The debate mechanism’s biggest contribution is closing these everyday gaps.</p>
<p><strong>2. L3 bugs: zero misses.</strong> In the single-model runs,  only Claude caught all five L3 system-level bugs. In debate mode, the group matched that result, meaning you no longer need to bet on the right model to get full L3 coverage.</p>
<p><strong>3. Debate fills blind spots rather than raising the ceiling.</strong> System-level bugs weren’t the hard part for the strongest individual. Claude already had those. The debate mechanism’s core contribution is patching Claude’s weakness on routine L2 bugs, where individual Claude caught only 3 out of 10, but the debating group caught 7. That’s where the 53% → 80% jump comes from.</p>
<h3 id="What-debate-actually-looks-like-in-practice" class="common-anchor-header">What debate actually looks like in practice</h3><p>The numbers above show that debate works, but a concrete example shows <em>why</em> it works. Here’s a condensed walkthrough of how the five models handled <strong>PR #44474</strong>, which introduced lazy loading of primary keys during search.</p>
<p><a href="https://github.com/milvus-io/milvus/pull/44474"><strong>PR #44474:</strong></a> A lazy-loading optimization that changed search to fetch primary keys on demand instead of loading them all upfront.</p>
<p><strong>Round 1</strong></p>
<p>Gemini opened aggressively:</p>
<p>“This PR is a minefield of bad practices, potential undefined behavior, and performance regressions disguised as an 'optimization.’”</p>
<p>Claude and Qwen focused on undefined behavior and performance, converging on the same concern:</p>
<p>“The C++ memory model doesn’t guarantee safety for concurrent writes to different indices of the same vector without proper synchronization.”</p>
<p>All three found real issues, but none of them caught the deeper bug. Then Codex, which had barely spoken, flagged something the others missed: the <code translate="no">primary_keys_</code> vector gets resized, but only positions that pass through the reduce phase are actually populated. Every other position is left as a zero value.</p>
<p><strong>Round 2</strong></p>
<p>Claude picked up Codex’s finding and traced the downstream consequence:</p>
<p>“I found it: <code translate="no">SortEqualScoresByPks</code> runs before <code translate="no">ReduceResultData</code>. So when <code translate="no">SortEqualScoresByPks</code> executes, zero PKs have been lazily fetched yet. The entire <code translate="no">primary_keys_</code> vector is full of default-constructed PkType values.”</p>
<p>In plain terms, the sort function runs before the keys have been loaded, so it’s sorting zeros. Claude acknowledged the miss openly:</p>
<p>“codex-cli identified a genuine critical correctness bug. I missed this in my first round.”</p>
<h2 id="Which-Combination-of-Models-Can-Find-the-Most-Bugs" class="common-anchor-header">Which Combination of Models Can Find the Most Bugs?<button data-href="#Which-Combination-of-Models-Can-Find-the-Most-Bugs" class="anchor-icon" translate="no">
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
    </button></h2><p>The jump from 53% to 80% happened because five models covered each other’s blind spots. But not everyone can afford to set up and run five models through five rounds of debate for every code review.</p>
<p><strong>So I tested the simpler version: if you can only run two models, which pair gets you closest to the multi-model ceiling?</strong></p>
<p>I used the <strong>context-assisted (R1)</strong> runs and counted how many of the 15 known bugs each model found:</p>
<ul>
<li><p><strong>Claude:</strong> 7/15 (47%)</p></li>
<li><p><strong>Qwen:</strong> 6/15 (40%)</p></li>
<li><p><strong>Gemini:</strong> 5/15 (33%)</p></li>
<li><p><strong>MiniMax:</strong> 5/15 (33%)</p></li>
<li><p><strong>Codex:</strong> 4/15 (27%)</p></li>
</ul>
<p>What matters, then, is not just how many bugs each model finds, but <em>which</em> bugs it misses. Of the 8 bugs Claude missed, Gemini caught 3: a concurrency race condition, a cloud storage API compatibility issue, and a missing permission check. Going the other direction, Gemini missed most data structures and deep logic bugs, and Claude caught nearly all of those. Their weaknesses barely overlap, which is what makes them a strong pair.</p>
<table>
<thead>
<tr><th>Two-model pairing</th><th>Combined coverage</th></tr>
</thead>
<tbody>
<tr><td>Claude + Gemini</td><td>10/15</td></tr>
<tr><td>Claude + Qwen</td><td>9/15</td></tr>
<tr><td>Claude + Codex</td><td>8/15</td></tr>
<tr><td>Claude + MiniMax</td><td>8/15</td></tr>
</tbody>
</table>
<p>All five models together covered 11 out of 15, leaving 4 bugs that every model missed.</p>
<p><strong>Claude + Gemini,</strong> as a two-model pair, already reaches 91% of that five-model ceiling. For this benchmark, it’s the most efficient combination.</p>
<p>That said, Claude + Gemini isn’t the best pairing for every type of bug. When I broke the results down by bug category, a more nuanced picture emerged:</p>
<table>
<thead>
<tr><th>Bug type</th><th>Total</th><th>Claude</th><th>Gemini</th><th>Codex</th><th>MiniMax</th><th>Qwen</th></tr>
</thead>
<tbody>
<tr><td>Validation gaps</td><td>4</td><td>3</td><td>2</td><td>1</td><td>1</td><td>3</td></tr>
<tr><td>Data structure lifecycle</td><td>4</td><td>3</td><td>1</td><td>1</td><td>3</td><td>1</td></tr>
<tr><td>Concurrency races</td><td>2</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>Compatibility</td><td>2</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td></tr>
<tr><td>Deep logic</td><td>3</td><td>1</td><td>0</td><td>1</td><td>1</td><td>1</td></tr>
<tr><td>Total</td><td>15</td><td>7</td><td>5</td><td>4</td><td>5</td><td>6</td></tr>
</tbody>
</table>
<p>The bug-type breakdown reveals why no single pairing is universally best.</p>
<ul>
<li><p>For data structure lifecycle bugs, Claude and MiniMax tied at 3/4.</p></li>
<li><p>For validation gaps, Claude and Qwen tied at 3/4.</p></li>
<li><p>For concurrency and compatibility issues, Claude scored zero on both, and Gemini is the one that fills those gaps.</p></li>
<li><p>No model covers everything, but Claude covers the widest range and comes closest to being a generalist.</p></li>
</ul>
<p>Four bugs were missed by every model. One involved ANTLR grammar rule priority. One was a read/write lock semantic mismatch across functions. One required understanding the business logic differences between compaction types. And one was a silent comparison error where one variable used megabytes and another used bytes.</p>
<p>What these four have in common is that the code is syntactically correct. The bugs live in assumptions the developer carried in their head, not in the diff, and not even in the surrounding code. This is roughly where AI code review hits its ceiling today.</p>
<h2 id="After-Finding-Bugs-Which-Model-is-the-Best-at-Fixing-Them" class="common-anchor-header">After Finding Bugs, Which Model is the Best at Fixing Them?<button data-href="#After-Finding-Bugs-Which-Model-is-the-Best-at-Fixing-Them" class="anchor-icon" translate="no">
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
    </button></h2><p>In code review, finding bugs is half the job. The other half is fixing them. So after the debate rounds, I added a peer evaluation to measure how useful each model’s fix suggestions actually are.</p>
<p>To measure this, I added a peer evaluation round after the debate. Each model opened a fresh session and acted as an anonymous judge, scoring the other models’ reviews. The five models were randomly mapped to Reviewer A/B/C/D/E, so no judge knew which model produced which review. Each judge scored on four dimensions, rated 1 to 10: accuracy, actionability, depth, and clarity.</p>
<table>
<thead>
<tr><th>Model</th><th>Accuracy</th><th>Actionability</th><th>Depth</th><th>Clarity</th><th>Overall</th></tr>
</thead>
<tbody>
<tr><td>Qwen</td><td>8.6</td><td>8.6</td><td>8.5</td><td>8.7</td><td>8.6 (tied 1st)</td></tr>
<tr><td>Claude</td><td>8.4</td><td>8.2</td><td>8.8</td><td>8.8</td><td>8.6 (tied 1st)</td></tr>
<tr><td>Codex</td><td>7.7</td><td>7.6</td><td>7.1</td><td>7.8</td><td>7.5</td></tr>
<tr><td>Gemini</td><td>7.4</td><td>7.2</td><td>6.7</td><td>7.6</td><td>7.2</td></tr>
<tr><td>MiniMax</td><td>7.1</td><td>6.7</td><td>6.9</td><td>7.4</td><td>7.0</td></tr>
</tbody>
</table>
<p>Qwen and Claude tied for first by a clear margin. Both scored consistently high across all four dimensions, while Codex, Gemini, and MiniMax clustered a full point or more below. Notably, Gemini, which proved valuable as a bug-finding partner for Claude in the pairing analysis, ranks near the bottom for review quality. Being good at spotting issues and being good at explaining how to fix them are evidently different skills.</p>
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
    </button></h2><p><strong>Claude</strong> is the one you’d trust with the hardest reviews. It works through entire call chains, follows deep logic paths, and pulls in its own context without you needing to spoon-feed it. On L3 system-level bugs, nothing else came close. It does get overconfident with math sometimes, but when another model proves it wrong, it owns it and walks through where its reasoning broke down. Use it for core code and the bugs you can’t afford to miss.</p>
<p><strong>Gemini</strong> comes in hot. It has strong opinions about code style and engineering standards, and it’s quick to frame problems structurally. The downside is that it often stays at the surface and doesn’t dig deep enough, which is why it scored low in peer evaluation. Where Gemini really earns its spot is as a challenger: its pushback forces other models to double-check their work. Pair it with Claude for the structural perspective Claude sometimes skips.</p>
<p><strong>Codex</strong> barely says a word. But when it does, it counts. Its hit rate on real bugs is high, and it has a knack for catching the one thing everyone else walked past. In the PR #44474 example, Codex was the model that spotted the zero-value primary keys issue that kicked off the whole chain. Think of it as the supplementary reviewer that catches what your primary model missed.</p>
<p><strong>Qwen</strong> is the most well-rounded of the five. Its review quality matched Claude’s, and it’s especially good at pulling together different perspectives into fix suggestions you can actually act on. It also had the highest L2 detection rate in context-assisted mode, which makes it a solid default for everyday PR reviews. The one weakness: in long, multi-round debates, it sometimes loses track of earlier context and starts giving inconsistent answers in later rounds.</p>
<p><strong>MiniMax</strong> was the weakest at finding bugs on its own. It’s best used to fill out a multi-model group rather than as a standalone reviewer.</p>
<h2 id="Limitations-of-This-Experiment" class="common-anchor-header">Limitations of This Experiment<button data-href="#Limitations-of-This-Experiment" class="anchor-icon" translate="no">
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
    </button></h2><p>A few caveats to keep this experiment in perspective:</p>
<p><strong>The sample size is small.</strong> There are only 15 PRs, all from the same Go/C++ project (Milvus). These results don’t generalize to all languages or codebases. Treat them as directional, not definitive.</p>
<p><strong>Models are inherently random.</strong> Running the same prompt twice can produce different results. The numbers in this post are a single snapshot, not a stable expected value. The individual model rankings should be taken lightly, though the broader trends (debate outperforms individuals, different models excel at different bug types) are consistent.</p>
<p><strong>The speaking order was fixed.</strong> The debate used the same order across all rounds, which may have influenced how later-speaking models responded. A future experiment could randomize the order per round to control for this.</p>
<h2 id="Try-it-yourself" class="common-anchor-header">Try it yourself<button data-href="#Try-it-yourself" class="anchor-icon" translate="no">
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
    </button></h2><p>All tools and data from this experiment are open source:</p>
<ul>
<li><p><a href="https://github.com/liliu-z/magpie"><strong>Magpie</strong></a>: An open-source tool that gathers code context (call chains, related PRs, affected modules) and orchestrates multi-model adversarial debate for code review.</p></li>
<li><p><a href="https://github.com/liliu-z/ai-code-review-arena"><strong>AI-CodeReview-Arena</strong></a>: The full evaluation pipeline, configurations, and scripts.</p></li>
<li><p><a href="https://github.com/liliu-z/ai-code-review-arena/blob/main/prs/manifest.yaml"><strong>Test cases</strong></a>: All 15 PRs with annotated known bugs.</p></li>
</ul>
<p>The bugs in this experiment all came from real pull requests in <a href="https://github.com/milvus-io/milvus">Milvus</a>, an open-source vector database built for AI applications. We’ve got a pretty active community on <a href="https://discord.com/invite/8uyFbECzPX">Discord</a> and <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack</a>, and we’d love more people poking at the code. And if you end up running this benchmark on your own codebase, please share the results! I’m really curious whether the trends hold across different languages and projects.</p>
<h2 id="Keep-Reading" class="common-anchor-header">Keep Reading<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/glm5-vs-minimax-m25-vs-gemini-3-deep-think.md">GLM-5 vs. MiniMax M2.5 vs. Gemini 3 Deep Think: Which Model Fits Your AI Agent Stack?</a></p></li>
<li><p><a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">Adding Persistent Memory to Claude Code with the Lightweight memsearch Plugin</a></p></li>
<li><p><a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">We Extracted OpenClaw’s Memory System and Open-Sourced It (memsearch)</a></p></li>
</ul>
