---
id: 2021-10-22-apply-configuration-changes-on-milvus-2.md
title: Technical Sharing:Apply Configuration Changes on Milvus 2.0 using Docker Compose
author: Jingjing
date: 2021-10-22
desc: Learn how apply configuration changes on Milvus 2.0
cover: assets.zilliz.com/coverimage_8edf38fd9c.png
tag: Technology
---

# Technical Sharing: Apply Configuration Changes on Milvus 2.0 using Docker Compose


*Jingjing Jia, Zilliz Data Engineer, graduated from Xi’an Jiaotong University with a degree in Computer Science. After joining Zilliz, she mainly works on data pre-processing, AI model deployment, Milvus related technology research, and helping community users to implement application scenarios. SHe is very patient, likes to communicate with community partners, and enjoys listening to music and watching anime.*


As a frequent user of Milvus, I was very excited about the newly released Milvus 2.0 RC. According to the introduction on the official website, Milvus 2.0 seems to outmatch its predecessors by a large margin. I was so eager to try it out myself.



And I did.  However, when I truly got my hands on Milvus 2.0, I realized that I wasn't able to modify the configuration file in Milvus 2.0 as easily as I did with Milvus 1.1.1. I couldn't change the configuration file inside the docker container of Milvus 2.0 started with Docker Compose, and even force change wouldn't take effect. Later, I learned that Milvus 2.0 RC was unable to detect changes to the configuration file after installation. And future stable release will fix this issue.



Having tried different approaches, I've found a reliable way to apply changes to configuration files for Milvus 2.0 standalone & cluster, and here is how.



Note that all changes to configuration must be made before restarting Milvus using Docker Compose.

## Modify configuration file in Milvus standalone

First, you will need to [download](https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml) a copy of **milvus.yaml** file to your local device.



Then you can change the configurations in the file. For instance, you can change the log format as `.json`. 

![1.1.png](https://assets.zilliz.com/1_1_ee4a16a3ee.png)



Once **milvus.yaml** file is modified, you will also need to [download](https://github.com/milvus-io/milvus/blob/master/deployments/docker/standalone/docker-compose.yml) and modify in **docker-compose.yaml** file for standalone by mapping the local path to milvus.yaml onto the corresponding docker container path to configuration file `/milvus/configs/milvus.yaml` under the `volumes` section.

![1.2.png](https://assets.zilliz.com/1_2_5e7c73708c.png)

Lastly, start Milvus standalone using `docker-compose up -d` and check if the modifications are successful. For instance, run `docker logs` to check the log format.

![1.3.png](https://assets.zilliz.com/1_3_a0406df3ab.png)



## Modify configuration file in Milvus cluster

First, [download](https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml) and modify the **milvus.yaml** file to suit your needs.

![1.4.png](https://assets.zilliz.com/1_4_758b182846.png)


Then you will need to [download](https://github.com/milvus-io/milvus/blob/master/deployments/docker/cluster/docker-compose.yml) and modify the cluster **docker-compose.yml** file by mapping the local path to **milvus.yaml** onto the corresponding path to configuration files in all components, i.e. root coord, data coord, data node, query coord, query node, index coord, index node, and proxy.

![1.5.png](https://assets.zilliz.com/1_5_80e15811b8.png)


![1.6.png](https://assets.zilliz.com/1_6_b2f3e4e47f.png)
![1.7.png](https://assets.zilliz.com/1_7_4d1eb5e1e5.png)


Finally, you can start Milvus cluster using `docker-compose up -d` and check if the modifications are successful.

## Change log file path in configuration file

First, [download](https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml) the **milvus.yaml** file, and change the `rootPath` section as the directory where you expect to store the log files in Docker container. 


![1.8.png](https://assets.zilliz.com/1_8_e3bdc4843f.png)




After that, download the corresponding **docker-compose.yml** file for Milvus [standalone](https://github.com/milvus-io/milvus/blob/master/deployments/docker/standalone/docker-compose.yml) or [cluster](https://github.com/milvus-io/milvus/blob/master/deployments/docker/cluster/docker-compose.yml). 

For standalone, you need to map the local path to **milvus.yaml** onto the corresponding docker container path to configuration file `/milvus/configs/milvus.yaml`, and map the local log file directory onto the Docker container directory you created previously. 

For cluster, you will need to map both paths in every component.

![1.9.png](https://assets.zilliz.com/1_9_22d8929d92.png)

Lastly, start Milvus standalone or cluster using `docker-compose up -d` and check the log files to see if the modification is successful.