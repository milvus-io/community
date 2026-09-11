---
id: build-durable-loops.md
title: >
 Build Durable Loops
author: Cheney Zhang
date: 2026-9-11
cover: assets.zilliz.com/From_Loops_to_Graphs_b977c9dee2.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: Milvus, vector database
meta_keywords: reliable AI agents, agent orchestration, AI agent loops, agent graphs, long-running AI agents
meta_title: >
 Reliable AI Agents: From Loops to Graph Orchestration
desc: >
 Learn why reliable AI agents need durable loops, graph orchestration, persistent state, independent validation, asynchronous approval, and context retrieval.
origin: https://milvus.io/blog/build-durable-loops.md
---

In July, Peter Steinberger posed a useful question: “Are we still talking loops or did we shift to graphs yet?” It is tempting to read that as a changing of the guard—as if loops were the first generation of agent architecture and graphs were about to replace them.

![](https://assets.zilliz.com/build_durable_loops_md_1_36b5732f7b.png)

That interpretation misses what each abstraction is for. A loop describes how one unit of work keeps iterating. A graph describes how multiple units of work connect, branch, run in parallel, wait, and resume. A graph node can contain a loop, and a graph can include cyclic edges. The two ideas operate at different levels.

What graphs add is an explicit orchestration layer. In a single-agent loop, decisions about delegation, sequencing, and recovery are often buried inside the agent’s context. A graph moves those decisions into the execution model, where branches, dependencies, approval points, and failure paths can be inspected and managed directly.

This explicit structure makes it easier to coordinate work that spans multiple agents or extended periods of time. But structure alone does not guarantee reliability. A long-running agent system must also define how work is triggered, how responsibilities are separated, where human judgment enters the process, and how the original goal survives across repeated iterations. The rest of this article examines those four design problems.

# Build Durable Loops

A well-designed graph still depends on reliable loops at the worker level. But loop engineering is often reduced to a simple pattern: after one iteration ends, immediately check whether the task is complete and, if not, start the next.

That pattern works well for tasks with immediate feedback, such as compilation, testing, and targeted repair. Long-running workflows operate on different cadences. A daily report should wait until the next scheduled run, while monitoring workflows may have nothing to do until a new event arrives. Repeatedly invoking the agent before new information is available wastes model calls and may encourage it to manufacture progress.

A durable loop therefore needs to answer two questions: What should trigger the next round, and what state must survive between rounds?

![](https://assets.zilliz.com/build_durable_loops_md_2_3773dd99da.png)

## Match the Trigger to the Work

The first question is when the next round should begin. In practice, long-running agent work can use five drive modes:

| **Drive mode** | **How it works** | **Best fit** |
| --- | --- | --- |
| Continuous execution | Start the next iteration immediately. | Batch migrations, systematic refactoring, or optimization against a clear metric. |
| Scheduled execution | Run at a fixed time or interval. | Daily reports, periodic checks, and routine maintenance. |
| Conditional polling | Check an external condition at intervals and resume only when it is met. | Waiting for a pull request, a metric threshold, or a data refresh. |
| Event-driven execution | Wake the workflow when an external event arrives. | Webhooks, alerts, commits, or newly created tickets. |
| Hybrid execution | Use events for normal operation and a scheduled check to catch anything missed. | Workflows that need prompt reactions and a reliability backstop. |

These modes are not five versions of a code-level loop. They are five ways to give a long-running task forward motion at the cadence the work actually requires.

## Persist State Between Runs

The trigger determines when the next round begins. External state determines whether it can resume from the previous one.

Because a long-running task may span many temporary sessions, its goal, progress, and validation evidence cannot live only in the model context. At the end of each round, the system should persist what has been completed, what remains unresolved, which results have been verified, which approaches were rejected, and where to resume. The next session can then load that checkpoint and continue without reconstructing the task history.

_The session is a temporary worker; external state is the system of record._

Matching the driver to the task and preserving state makes a loop durable and recoverable. But it does not prevent the task from drifting away from its original goal. That is where graph-based role separation becomes necessary: exploration, execution, and validation should not all be left to the same worker.

# Build an Explore–Execute–Judge Graph

A graph makes that separation explicit. A defining feature of graph engineering is that it assigns narrow responsibilities to dedicated agents and represents their handoffs as nodes and edges. In our internal practice, we split each iteration into three sequential nodes, explore, execute, and judge, and wrap the sequence in a loop. Each role owns one responsibility: choose the next step, produce the result, or decide whether the result passes.

![](https://assets.zilliz.com/build_durable_loops_md_3_759632476f.png)

## Explorer: Select the Next Move

The explorer rereads the objective, project state, history, and existing results. It answers three questions: What is the most valuable problem to solve now? What step is specific enough to finish in one iteration? What evidence would show that the step worked?

These answers turn the durable state into a concrete assignment. The explorer maintains the candidate tasks and their priorities, selects one bounded step for the current iteration, and defines its acceptance conditions. When execution or validation reveals new problems, possible directions, or missing checks, they return to the queue for a later round rather than being lost in the transcript.

## Executor: Make a Bounded Change

That handoff defines the executor’s boundary. The executor follows the selected plan without reinventing the objective or expanding the scope. Preferably working in a fresh context, it focuses only on the information needed to complete that step.

Keeping the task narrow also limits the blast radius of failure. The executor makes a small, reversible change and leaves an inspectable artifact, such as a code diff, test output, experiment log, cited research, or structured report. A failed iteration therefore remains a local problem that can be examined or rolled back.

## Judger: Verify the Evidence

The artifact and its acceptance conditions then pass to the judge. “The executor says it is done” is not evidence. The judge inspects tests, logs, screenshots, data changes, or user feedback to determine whether the result meets the predefined conditions, whether important edge cases were missed, and whether the evidence supports the claimed outcome.

Deterministic checks should come first: automated tests, static analysis, data validation, and explicit rules. Semantic LLM judgment is most useful for qualities that cannot be fully formalized, such as writing quality or product coherence.

```
读取状态
   ↓
探索下一步
   ↓
执行一个有边界的任务
   ↓
验证结果
   ↓
更新状态、证据和任务队列
```

![](https://assets.zilliz.com/build_durable_loops_md_4_4ed2a5fe38.png)

The executor and judge should not share the same brain: they should be separate agents operating in separate contexts, even if they use the same underlying model. Completing the task and proving that it is complete must remain two independent steps. If validation fails, the result cannot enter the main branch. The findings return to the durable state, and the next explorer decides whether to repair the work, redo it, or change direction.

# Make Human Review Asynchronous

Long-running autonomy often conflicts with “human in the loop.” If every decision blocks the whole workflow until a person responds, the agent is not truly running on its own. Yet removing human review is unsafe for irreversible or privileged actions such as deleting information or changing permissions.

The useful compromise is asynchronous approval. When a branch reaches a decision that requires a person, it records the question, relevant context, proposed action, and risk in an approval mailbox. That branch pauses. Independent branches continue.

![](https://assets.zilliz.com/build_durable_loops_md_5_1d11ef8c56.png)

A person can review the queue later. When an answer arrives, the paused branch resumes from its saved state. Meanwhile, reversible agent-driven work continues with commits or equivalent checkpoints, so a later correction can trace the history backward.

The design principle is simple: waiting should be local to the dependency. One unresolved decision should not freeze the entire graph.

# Constrain Goals, Retrieve Context

Graphs are powerful, but not every task becomes suitable for graph engineering simply because it can be represented as nodes and edges. The real test is whether the goal can be constrained, progress can be evaluated, and each node can retrieve the context required for its next decision.

## Define Evidence for Subjective Goals

Some tasks have obvious stopping conditions. A bug is fixed when the failing behavior disappears and the tests pass. Tasks such as “improve code readability” or “make the product design better” are harder because no single objective function can fully capture the desired result.

Two techniques make these goals more tractable. First, provide concrete references from the person’s or team’s previous work: articles by the intended author, project records, design decisions, or existing documentation. These references give the agent a practical standard to approximate.

Second, define a scoring mechanism. When deterministic rules are insufficient, an LLM judge can evaluate the result against those references, or multiple judges can debate, rank, and select among alternatives.

![](https://assets.zilliz.com/build_durable_loops_md_6_5365ede90f.png)

Neither technique makes taste completely objective. Together, however, they make the evaluation boundary explicit enough for the graph to decide whether to continue, revise, or escalate.

## Retrieve Context at Decision Time

Once the goal is defined, a graph still needs the right context. A carefully structured prompt is not enough. The system also needs access to information from multiple sources and an efficient way to retrieve what matters for the current step.

In long-running work, much of the context that shapes a decision lives outside the current run—in previous project decisions, established user preferences, and accepted trade-offs. MemSearch makes this history retrievable across agents. Stable, recurring practices can then be distilled into skills: executable rules that future agents can apply.

![](https://assets.zilliz.com/build_durable_loops_md_7_44c6e63627.png)

MemSearch does not insert everything from the past into every prompt. It retrieves the fragments relevant to the current question and preserves their source and time metadata, allowing the agent to judge the context in which the information was formed and whether it still applies.

Relevant context may also be distributed across code repositories, documents, databases, ticketing systems, cloud drives, and SaaS tools. Without these current facts, even an agent that understands the user’s preferences may make decisions based on outdated or incomplete information.

MFS maps these distributed sources into a unified, searchable, file-like namespace. Agents can use operations such as search, grep, ls, and cat to find and inspect information progressively instead of loading a large, stale context dump in advance.

![](https://assets.zilliz.com/build_durable_loops_md_8_76011d7792.png)

# Reliability Lives in the Harness

The move from loops to graphs is not a clean architectural succession because they solve different problems. Loops provide repeated effort, while graphs make coordination and control explicit. As that work extends across steps and runs, durable state preserves continuity, while role separation and evidence-based judgment prevent individual iterations from drifting or passing weak results. Asynchronous approvals keep necessary human governance from becoming a global bottleneck, and retrieval supplies the context each step actually needs.

Together, these mechanisms form the harness around the model. That harness is increasingly as important as model capability itself—not because better models no longer matter, but because long-running work exposes failure modes that intelligence alone does not remove.

The practical unit of progress is therefore not a heroic, unbounded agent session. It is a small, inspectable, reversible step inside a system that knows when to run, what to remember, who should decide, and what counts as proof.

The source author has published an open-source implementation of these ideas as the Perpetuum skill project: [https://github.com/zc277584121/perpetuum](https://github.com/zc277584121/perpetuum)