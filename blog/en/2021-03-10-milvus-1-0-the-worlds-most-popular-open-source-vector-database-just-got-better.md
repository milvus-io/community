---
id: milvus-1-0-the-worlds-most-popular-open-source-vector-database-just-got-better.md
title: Milvus 1.0 The World's Most Popular Open-Source Vector Database Just Got Better
author: milvus
date: 2021-03-10 06:58:36.647+00
desc: Milvus v1.0, a stable, long-term support version, is available now. Milvlus powers image/video search, chatbots, and many more AI applications.
cover: assets.zilliz.com/Milvus_510cf50aee.jpeg
tag: Engineering
origin: zilliz.com/blog/milvus-1-0-the-worlds-most-popular-open-source-vector-database-just-got-better
---

# Milvus 1.0: The World's Most Popular Open-Source Vector Database Just Got Better

Zilliz is proud to announce the release of Milvus v1.0. After months of extensive testing Milvus v1.0, which is based on a stable version of Milvus v0.10.6, is available for use.

Milvus v1.0 offers the following key features:

- Support for mainstream similarity metrics, including Euclidean distance, inner product, Hamming distance, Jaccard coefficient, and more.
- Integration with, and improvements to, SOTA ANNs algorithms, including Faiss, Hnswlib, Annoy, NSG, and more.
- Scale-out capability through the Mishards sharding proxy.
- Support for processors commonly used in AI scenarios, including X86, Nvidia GPU, Xilinx FPGA, and more.

See the [Release Notes](https://www.milvus.io/docs/v1.0.0/release_notes.md) for additional Milvus v1.0 features.

Milvus is an ongoing open-source software (OSS) project. Its first major release has the following implications for users:

- Milvus v1.0 will receive long-term support (3+ years).
- The most stable Milvus release to date is well structured and ready for integration with existing AI ecosystems.

### The first version of Milvus with long-term support

Thanks in part to sponsorship from Zilliz, the Milvus community will provide bug fix support for Milvus v1.0 until December 31st, 2024. New features will be available only in releases following v1.0.

See [The Milvus release guideline](https://milvus.io/docs/v1.0.0/milvus_release_guideline.md) for information about release cadences and more.

### Toolchain enhancements and seamless AI ecosystem integration

Beginning with v1.0, Milvus' toolchain will be a primary development focus. We plan to create the necessary tooling and utilities to meet the needs of the Milvus user community.

Stability makes integrating Milvus with AI ecosystems a breeze. We are seeking further collaboration between the Milvus community and other AI-focused OSS communities. We encourage contributions to the new AI ASICs (application-specific integrated circuits) in Milvus.

### The future of Milvus

We believe Milvus has a bright future thanks to the following factors:

- Regular contributions from developers in the Milvus community.
- Support for integration with any cloud-native environment.

We have drafted [community charters](https://milvus.io/docs/v1.0.0/milvus_community_charters.md) to help guide, nurture, and advance the Milvus community as our technology and user base grows. The charters include several technical decisions made to attract more participants to the community.

- Golang will now be used to develop the Milvus engine however, the ANNS algorithm component will still be developed in C++.
- The forthcoming distributed version of Milvus will use existing cloud components as much as possible.

We are thrilled to partner with the open-source software community to build the next-generation cloud data fabric made for AI. Let's get to work!

### Don’t be a stranger

- Find or contribute to Milvus on [GitHub](https://github.com/milvus-io/milvus/)
- Interact with the community via [Slack](https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ).
- Connect with us on [Twitter](https://twitter.com/milvusio).
