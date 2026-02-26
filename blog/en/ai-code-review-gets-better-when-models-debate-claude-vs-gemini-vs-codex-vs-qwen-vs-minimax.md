---
id: ai-code-review-gets-better-when-models-debate-claude-vs-gemini-vs-codex-vs-qwen-vs-minimax.md
title: >
 AI Code Review Gets Better When Models Debate: Claude vs Gemini vs Codex vs Qwen vs MiniMax
author: Li Liu
date: 2026-02-26
cover: assets.zilliz.com/Code_Review_Benchmark_Cover_Fixed_Icons_2048x1143_11zon_1_04796f1364.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: AI Code Review, Qwen, Claude, Gemini, Codex
meta_keywords: AI code review, LLM code review benchmark, Claude vs Gemini vs Codex, AI code review benchmark, multi-model AI debate
meta_title: >
 Claude vs Gemini vs Codex vs Qwen vs MiniMax Code Review
desc: >
 We tested Claude, Gemini, Codex, Qwen, and MiniMax on real bug detection. The best model hit 53%. After adversarial debate, detection jumped to 80%.
origin: https://milvus.io/blog/ai-code-review-benchmark-multi-model-debate.md
---

I recently used AI models to review a pull request, and the results were contradictory: Claude flagged a data race, while Gemini said the code was clean. That got me curious about how other AI models would behave, so I ran the latest flagship models from Claude, Gemini, Codex, Qwen, and MiniMax through a structured code-review benchmark. The results? The best-performing model caught only 53% of known bugs. 

However, my curiosity didn’t end there: what if these AI models worked together? I experimented with having them debate each other, and after five rounds of adversarial debate, bug detection jumped to 80%. The hardest bugs, ones requiring system-level understanding, hit 100% detection in debate mode.

This post walks through the experiment design, per-model results, and what the debate mechanism reveals about how to actually use AI for code review.

## Benchmarking Claude, Gemini, Codex, Qwen, and MiniMax for code review

If you’ve been using models for code review, you’ve probably noticed they don’t just differ in accuracy; they differ in how they read code. For example:

Claude usually walks the call chain top-to-bottom and will spend time on “boring” paths (error handling, retries, cleanup). That’s often where the real bugs hide, so I don’t hate the thoroughness.

Gemini tends to start with a strong verdict (“this is bad” / “looks fine”) and then works backwards to justify it from a design/structure angle. Sometimes that’s useful. Sometimes it reads like it skimmed and then committed to a take.

Codex is quieter. But when it flags something, it’s often concrete and actionable — less commentary, more “this line is wrong because X.”

These are impressions, though, not measurements. To get actual numbers, I set up a benchmark.

### Setup

**Five flagship models were tested:**

-   Claude Opus 4.6
    
-   Gemini 3 Pro
    
-   GPT-5.2-Codex
    
-   Qwen-3.5-Plus
    
-   MiniMax-M2.5
    

**Tooling (Magpie)**

I used [Magpie](https://github.com/liliu-z/magpie), an open-source benchmarking tool I built. Its job is to do the “code review prep” you’d normally do manually: pull in surrounding context (call chains, related modules, and relevant adjacent code) and feed that to the model *before* it reviews the PR.

**Test cases (Milvus PRs with known bugs)**

The dataset consists of 15 pull requests from [Milvus](https://github.com/milvus-io/milvus) (an open-source vector database created and maintained by [Zilliz](https://zilliz.com/)). These PRs are useful as a benchmark because each was merged, only to later require a revert or hotfix after a bug surfaced in production. So every case has a known bug we can score against.

**Bug difficulty levels**

Not all of these bugs are equally hard to find, though, so I categorized them into three difficulty levels:

-   **L1:** Visible from the diff alone (use-after-free, off-by-one). 
    
-   **L2 (10 cases):** Requires understanding surrounding code to spot things like interface semantic changes or concurrency races. These represent the most common bugs in daily code review.
    
-   **L3 (5 cases):** Requires system-level understanding to catch issues like cross-module state inconsistencies or upgrade compatibility problems. These are the hardest tests of how deeply a model can reason about a codebase.
    

*Note: Every model caught all L1 bugs, so I excluded them from scoring.*

**Two evaluation modes**

Each model was run in two modes:

-   **Raw:** the model sees only the PR (diff + whatever is in the PR content).
    
-   **R1:** Magpie pulls the surrounding context (relevant files / call sites / related code) *before* the model reviews. This simulates a workflow where you prep context up front instead of asking the model to guess what it needs.
    

### Results (L2 + L3 only)

| Mode | Claude | Gemini | Codex | MiniMax | Qwen |
| --- | --- | --- | --- | --- | --- |
| Raw | 53% (1st) | 13% (last) | 33% | 27% | 33% |
| R1 (with context by Magpie) | 47% ⬇️ | 33%⬆️ | 27% | 33% | 40%⬆️ |

Four takeaways:

**1. Claude dominates the raw review.** It scored 53% overall detection and a perfect 5/5 on L3 bugs, without any context assistance. If you're using a single model and don't want to spend time preparing context, Claude is the best choice.

**2. Gemini needs context handed to it.** Its raw score of 13% was the lowest in the group, but with Magpie providing surrounding code, it jumped to 33%. Gemini doesn't gather its own context well, but it performs respectably when you do that work upfront.

**3. Qwen is the strongest context-assisted performer.** It scored 40% in R1 mode, with 5/10 on L2 bugs, which was the highest score at that difficulty level. For routine daily reviews where you're willing to prepare context, Qwen is a practical pick.

**4. More context doesn't always help.** It lifted Gemini (13% → 33%) and MiniMax (27% → 33%), but it actually hurt Claude (53% → 47%). Claude already excels at organizing context on its own, so the additional information likely introduced noise rather than clarity. The lesson: match the workflow to the model, rather than assuming more context is universally better.

These results align with my day-to-day experience. Claude at the top isn't surprising. Gemini scoring lower than I expected makes sense in hindsight: I typically use Gemini in multi-turn conversations where I'm iterating on a design or chasing a problem together, and it performs well in that interactive setting. This benchmark is a fixed, single-pass pipeline, which is exactly the format in which Gemini is weakest. The debate section later will show that when you give Gemini a multi-round, adversarial format, its performance improves noticeably.

## Let AI Models Debate with Each Other 

Every model showed different strengths and blind spots in the individual benchmarks. So I wanted to test: what happens if the models review each other's work rather than just the code?

So I added a debate layer on top of the same benchmark. All five models participate in five rounds:

-   In Round 1, each model reviews the same PR independently.
    
-   After that, I broadcast all five reviews to all participants.
    
-   In Round 2, each model updates its position based on the other four.
    
-   Repeat until Round 5.
    

By the end, each model isn’t just reacting to the code — it’s reacting to arguments that have already been criticized and revised multiple times.

To keep this from turning into “LLMs agreeing loudly,” I enforced one hard rule: **every claim has to point to specific code as evidence**, and a model can’t just say “good point” — it has to explain why it changed its mind.

### Results: Best Solo vs Debate Mode

| Mode | L2 (10 cases) | L3 (5 cases) | Total detection |
| --- | --- | --- | --- |
| Best individual (Raw Claude) | 3/10 | 5/5 | 53% |
| Debate (all five models) | 7/10 (doubled) | 5/5 (all caught) | 80% |

### What stands out

**1. L2 detection doubled.** Routine, mid-difficulty bugs jumped from 3/10 to 7/10. These are the bugs that appear most frequently in real codebases, and they're exactly the category where individual models miss inconsistently. The debate mechanism's biggest contribution is closing these everyday gaps.

**2. L3 bugs: zero misses.** In the single-model runs,  only Claude caught all five L3 system-level bugs. In debate mode, the group matched that result, meaning you no longer need to bet on the right model to get full L3 coverage.

**3. Debate fills blind spots rather than raising the ceiling.** System-level bugs weren't the hard part for the strongest individual. Claude already had those. The debate mechanism's core contribution is patching Claude's weakness on routine L2 bugs, where individual Claude caught only 3 out of 10, but the debating group caught 7. That's where the 53% → 80% jump comes from.

### What debate actually looks like in practice

The numbers above show that debate works, but a concrete example shows *why* it works. Here's a condensed walkthrough of how the five models handled **PR #44474**, which introduced lazy loading of primary keys during search.

[**PR #44474:**](https://github.com/milvus-io/milvus/pull/44474) A lazy-loading optimization that changed search to fetch primary keys on demand instead of loading them all upfront.

**Round 1**

Gemini opened aggressively:

"This PR is a minefield of bad practices, potential undefined behavior, and performance regressions disguised as an 'optimization.'"

Claude and Qwen focused on undefined behavior and performance, converging on the same concern:

"The C++ memory model doesn't guarantee safety for concurrent writes to different indices of the same vector without proper synchronization."

All three found real issues, but none of them caught the deeper bug. Then Codex, which had barely spoken, flagged something the others missed: the `primary_keys_` vector gets resized, but only positions that pass through the reduce phase are actually populated. Every other position is left as a zero value.

**Round 2**

Claude picked up Codex's finding and traced the downstream consequence:

"I found it: `SortEqualScoresByPks` runs before `ReduceResultData`. So when `SortEqualScoresByPks` executes, zero PKs have been lazily fetched yet. The entire `primary_keys_` vector is full of default-constructed PkType values."

In plain terms, the sort function runs before the keys have been loaded, so it's sorting zeros. Claude acknowledged the miss openly:

"codex-cli identified a genuine critical correctness bug. I missed this in my first round."

## Which Combination of Models Can Find the Most Bugs?

The jump from 53% to 80% happened because five models covered each other's blind spots. But not everyone can afford to set up and run five models through five rounds of debate for every code review. 

**So I tested the simpler version: if you can only run two models, which pair gets you closest to the multi-model ceiling?**

I used the **context-assisted (R1)** runs and counted how many of the 15 known bugs each model found:

-   **Claude:** 7/15 (47%)
    
-   **Qwen:** 6/15 (40%)
    
-   **Gemini:** 5/15 (33%)
    
-   **MiniMax:** 5/15 (33%)
    
-   **Codex:** 4/15 (27%)
    

What matters, then, is not just how many bugs each model finds, but *which* bugs it misses. Of the 8 bugs Claude missed, Gemini caught 3: a concurrency race condition, a cloud storage API compatibility issue, and a missing permission check. Going the other direction, Gemini missed most data structures and deep logic bugs, and Claude caught nearly all of those. Their weaknesses barely overlap, which is what makes them a strong pair.

  

| Two-model pairing | Combined coverage |
| --- | --- |
| Claude + Gemini | 10/15 |
| Claude + Qwen | 9/15 |
| Claude + Codex | 8/15 |
| Claude + MiniMax | 8/15 |

  

All five models together covered 11 out of 15, leaving 4 bugs that every model missed. 

**Claude + Gemini,** as a two-model pair, already reaches 91% of that five-model ceiling. For this benchmark, it's the most efficient combination.

That said, Claude + Gemini isn't the best pairing for every type of bug. When I broke the results down by bug category, a more nuanced picture emerged:

| Bug type | Total | Claude | Gemini | Codex | MiniMax | Qwen |
| --- | --- | --- | --- | --- | --- | --- |
| Validation gaps | 4 | 3 | 2 | 1 | 1 | 3 |
| Data structure lifecycle | 4 | 3 | 1 | 1 | 3 | 1 |
| Concurrency races | 2 | 0 | 1 | 0 | 0 | 0 |
| Compatibility | 2 | 0 | 1 | 1 | 0 | 1 |
| Deep logic | 3 | 1 | 0 | 1 | 1 | 1 |
| Total | 15 | 7 | 5 | 4 | 5 | 6 |

The bug-type breakdown reveals why no single pairing is universally best. 

-   For data structure lifecycle bugs, Claude and MiniMax tied at 3/4. 
    
-   For validation gaps, Claude and Qwen tied at 3/4. 
    
-   For concurrency and compatibility issues, Claude scored zero on both, and Gemini is the one that fills those gaps. 
    
-   No model covers everything, but Claude covers the widest range and comes closest to being a generalist.
    

Four bugs were missed by every model. One involved ANTLR grammar rule priority. One was a read/write lock semantic mismatch across functions. One required understanding the business logic differences between compaction types. And one was a silent comparison error where one variable used megabytes and another used bytes.

What these four have in common is that the code is syntactically correct. The bugs live in assumptions the developer carried in their head, not in the diff, and not even in the surrounding code. This is roughly where AI code review hits its ceiling today.

## After Finding Bugs, Which Model is the Best at Fixing Them?

In code review, finding bugs is half the job. The other half is fixing them. So after the debate rounds, I added a peer evaluation to measure how useful each model's fix suggestions actually are.

To measure this, I added a peer evaluation round after the debate. Each model opened a fresh session and acted as an anonymous judge, scoring the other models' reviews. The five models were randomly mapped to Reviewer A/B/C/D/E, so no judge knew which model produced which review. Each judge scored on four dimensions, rated 1 to 10: accuracy, actionability, depth, and clarity.

  

| Model | Accuracy | Actionability | Depth | Clarity | Overall |
| --- | --- | --- | --- | --- | --- |
| Qwen | 8.6 | 8.6 | 8.5 | 8.7 | 8.6 (tied 1st) |
| Claude | 8.4 | 8.2 | 8.8 | 8.8 | 8.6 (tied 1st) |
| Codex | 7.7 | 7.6 | 7.1 | 7.8 | 7.5 |
| Gemini | 7.4 | 7.2 | 6.7 | 7.6 | 7.2 |
| MiniMax | 7.1 | 6.7 | 6.9 | 7.4 | 7.0 |

  

Qwen and Claude tied for first by a clear margin. Both scored consistently high across all four dimensions, while Codex, Gemini, and MiniMax clustered a full point or more below. Notably, Gemini, which proved valuable as a bug-finding partner for Claude in the pairing analysis, ranks near the bottom for review quality. Being good at spotting issues and being good at explaining how to fix them are evidently different skills.

  

## Conclusion

**Claude** is the one you'd trust with the hardest reviews. It works through entire call chains, follows deep logic paths, and pulls in its own context without you needing to spoon-feed it. On L3 system-level bugs, nothing else came close. It does get overconfident with math sometimes, but when another model proves it wrong, it owns it and walks through where its reasoning broke down. Use it for core code and the bugs you can't afford to miss.

**Gemini** comes in hot. It has strong opinions about code style and engineering standards, and it's quick to frame problems structurally. The downside is that it often stays at the surface and doesn't dig deep enough, which is why it scored low in peer evaluation. Where Gemini really earns its spot is as a challenger: its pushback forces other models to double-check their work. Pair it with Claude for the structural perspective Claude sometimes skips.

**Codex** barely says a word. But when it does, it counts. Its hit rate on real bugs is high, and it has a knack for catching the one thing everyone else walked past. In the PR #44474 example, Codex was the model that spotted the zero-value primary keys issue that kicked off the whole chain. Think of it as the supplementary reviewer that catches what your primary model missed.

**Qwen** is the most well-rounded of the five. Its review quality matched Claude's, and it's especially good at pulling together different perspectives into fix suggestions you can actually act on. It also had the highest L2 detection rate in context-assisted mode, which makes it a solid default for everyday PR reviews. The one weakness: in long, multi-round debates, it sometimes loses track of earlier context and starts giving inconsistent answers in later rounds.

**MiniMax** was the weakest at finding bugs on its own. It's best used to fill out a multi-model group rather than as a standalone reviewer.

## Limitations of This Experiment

A few caveats to keep this experiment in perspective:

**The sample size is small.** There are only 15 PRs, all from the same Go/C++ project (Milvus). These results don't generalize to all languages or codebases. Treat them as directional, not definitive.

**Models are inherently random.** Running the same prompt twice can produce different results. The numbers in this post are a single snapshot, not a stable expected value. The individual model rankings should be taken lightly, though the broader trends (debate outperforms individuals, different models excel at different bug types) are consistent.

**The speaking order was fixed.** The debate used the same order across all rounds, which may have influenced how later-speaking models responded. A future experiment could randomize the order per round to control for this.

## Try it yourself

All tools and data from this experiment are open source:

-   [**Magpie**](https://github.com/liliu-z/magpie): An open-source tool that gathers code context (call chains, related PRs, affected modules) and orchestrates multi-model adversarial debate for code review.
    
-   [**AI-CodeReview-Arena**](https://github.com/liliu-z/ai-code-review-arena): The full evaluation pipeline, configurations, and scripts.
    
-   [**Test cases**](https://github.com/liliu-z/ai-code-review-arena/blob/main/prs/manifest.yaml): All 15 PRs with annotated known bugs.
    

The bugs in this experiment all came from real pull requests in [Milvus](https://github.com/milvus-io/milvus), an open-source vector database built for AI applications. We've got a pretty active community on [Discord](https://discord.com/invite/8uyFbECzPX) and [Slack](https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email), and we'd love more people poking at the code. And if you end up running this benchmark on your own codebase, please share the results! I'm really curious whether the trends hold across different languages and projects.

## Keep Reading

-   [GLM-5 vs. MiniMax M2.5 vs. Gemini 3 Deep Think: Which Model Fits Your AI Agent Stack?](https://milvus.io/blog/glm5-vs-minimax-m25-vs-gemini-3-deep-think.md)
    
-   [Adding Persistent Memory to Claude Code with the Lightweight memsearch Plugin](https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md)
    
-   [We Extracted OpenClaw’s Memory System and Open-Sourced It (memsearch)](https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md)
