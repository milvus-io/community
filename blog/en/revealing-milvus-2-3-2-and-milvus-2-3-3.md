---
id: revealing-milvus-2-3-2-and-milvus-2-3-3.md
title: "Revealing Milvus 2.3.2 & 2.3.3: Support for Array Data Types, Complex Delete, TiKV Integration, and More"
author: Fendy Feng, Owen Jiao
date: 2023-11-20
desc: Today, we are thrilled to announce the release of Milvus 2.3.2 and 2.3.3! These updates bring many exciting features, optimizations, and improvements, enhancing system performance, flexibility, and overall user experience.
cover: assets.zilliz.com/What_s_New_in_Milvus_2_3_2_and_2_3_3_d3d0db03c3.png
tag: News
tags: Milvus, Vector Database, Open Source, Data science, Artificial Intelligence, Vector Management, Vector Search
recommend: true
canonicalUrl: 
---
![](https://assets.zilliz.com/What_s_New_in_Milvus_2_3_2_and_2_3_3_d3d0db03c3.png)

In the ever-evolving landscape of vector search technologies, Milvus remains at the forefront, pushing boundaries and setting new standards. Today, we are thrilled to announce the release of Milvus 2.3.2 and 2.3.3! These updates bring many exciting features, optimizations, and improvements, enhancing system performance, flexibility, and overall user experience.

## Support for Array data types - making search results more accurate and relevant

Adding the Array data type support is a pivotal enhancement for Milvus, particularly in query filtering scenarios like intersection and union. This addition ensures that search results are not only more accurate but also more relevant. In practical terms, for instance, within the e-commerce sector, product tags stored as string Arrays allow consumers to perform advanced searches, filtering out irrelevant results.

Dive into our comprehensive [documentation](https://milvus.io/docs/array_data_type.md) for an in-depth guide on leveraging Array types in Milvus.

## Support for complex delete expressions - improving your data management

In previous versions, Milvus supported primary key deletion expressions, providing a stable and streamlined architecture. With Milvus 2.3.2 or 2.3.3, users can employ complex delete expressions, facilitating sophisticated data management tasks such as rolling cleanup of old data or GDPR compliance-driven data deletion based on user IDs.

Note: Ensure you’ve loaded collections before utilizing complex expressions. Additionally, it's important to note that the deletion process does not guarantee atomicity.

## TiKV integration - scalable metadata storage with stability

Previously relying on Etcd for metadata storage, Milvus faced limited capacity and scalability challenges in metadata storage. To address these problems, Milvus added TiKV, an open-source key-value store, as one more option for metadata storage. TiKV offers enhanced scalability, stability, and efficiency, making it an ideal solution for Milvus's evolving requirements. Starting from Milvus 2.3.2, users can seamlessly transition to TiKV for their metadata storage by modifying the configuration.

## Support for FP16 vector type - embracing machine learning efficiency

Milvus 2.3.2 and later versions now support the FP16 vector type at the interface level. FP16, or 16-bit floating point, is a data format widely used in deep learning and machine learning, providing efficient representation and calculation of numerical values. While full support for FP16 is underway, various indexes in the indexing layer require converting FP16 to FP32 during construction.

We will fully support FP16, BF16, and int8 data types in later versions of Milvus. Stay tuned.

## Significant improvement in the rolling upgrade experience - seamless transition for users

Rolling upgrade is a critical feature for distributed systems, enabling system upgrades without disrupting business services or experiencing downtimes. In the latest Milvus releases, we’ve strengthened Milvus’s rolling upgrade feature, ensuring a more streamlined and efficient transition for users’ upgrading  from version 2.2.15 to 2.3.3 and all later versions. The community has also invested in extensive testing and optimizations, reducing query impact during the upgrade to less than 5 minutes, providing users with a hassle-free experience.

## Performance optimization

In addition to introducing new features, we’ve significantly optimized the performance of Milvus in the latest two releases.

-   Minimized data copy operations for optimized data loading
    
-   Simplified large-capacity inserts using batch varchar reading
    
-   Removed unnecessary offset checks during data padding to improve recall phase performance.
    
-   Addressed high CPU consumption issues in scenarios with substantial data insertions
    

These optimizations collectively contribute to a faster and more efficient Milvus experience. Check out our monitoring dashboard for a quick glance at how Milvus improved its performance.

  

## Incompatible changes

-   Permanently deleted TimeTravel-related code.
    
-   Deprecated support for MySQL as the metadata store.
    

Refer to the [Milvus release notes](https://milvus.io/docs/release_notes.md) for more detailed information about all the new features and enhancements.

## Conclusion

With the latest Milvus 2.3.2 and 2.3.3 releases, we're committed to providing a robust, feature-rich, high-performance database solution. Explore these new features, take advantage of the optimizations, and join us on this exciting journey as we evolve Milvus to meet the demands of modern data management. Download the latest version now and experience the future of data storage with Milvus!

## Let’s keep in touch!

If you have questions or feedback about Milvus, join our [Discord channel](https://discord.com/invite/8uyFbECzPX) to engage with our engineers and the community directly or join our [Milvus Community Lunch and Learn](https://discord.com/invite/RjNbk8RR4f) Every Tuesday from 12-12:30 PM PST. You’re also welcome to follow us on [Twitter](https://twitter.com/milvusio) or [LinkedIn](https://www.linkedin.com/company/the-milvus-project) for the latest news and updates about Milvus.