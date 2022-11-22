---
id: 2021-11-07-how-to-modify-milvus-advanced-configurations.md
title: How to Modify Milvus Advanced Configurations
author: Zilliz
date: 2021-11-08
desc: How to modify the configuration of Milvus deployed on Kubernetes
cover: assets.zilliz.com/modify_4d93b9da3a.png
tag: Engineering
---

*Yufen Zong, a Zilliz Test Development Engineer, graduated from Huazhong University of Science and Technology with a master's degree in computer technology. She is currently engaged in the quality assurance of Milvus vector database, including but not limited to interface integration testing, SDK testing, Benchmark testing, etc. Yufen is an enthusiastic problem-shooter in the test and development of Milvus, and a huge fan of chaos engineering theory and fault drill practice.*

## Background


While using Milvus vector database, you will need to modify the default configuration to satisfy the requirements of different scenarios. Previously, a Milvus user shared on [How to Modify the Configuration of Milvus Deployed Using Docker Compose](2021-10-22-apply-configuration-changes-on-milvus-2.md). And in this article, I would like to share with you on how to modify the configuration of Milvus deployed on Kubernetes.

## Modify configuration of Milvus on Kubernetes

You may choose different modification plans according to the configuration parameters you wish to modify. All Milvus configuration files are stored under **milvus/configs**. While installing Milvus on Kubernetes, a Milvus Helm Chart repository will be added locally. By running `helm show values milvus/milvus`, you can check the parameters that can be modified directly with Chart. For the modifiable parameters with Chart, you can pass the parameter using `--values` or `--set`. For more information, see [Milvus Helm Chart](https://artifacthub.io/packages/helm/milvus/milvus) and [Helm](https://helm.sh/docs/).

If the parameters you expect to modify are not on the list, you can follow the instruction below.

In the following steps, the parameter `rootcoord.dmlChannelNum` in **/milvus/configs/advanced/root_coord.yaml** is to be modified for demonstration purposes. Configuration file management of Milvus on Kubernetes is implemented through ConfigMap resource object. To change the parameter, you should first update the ConfigMap object of corresponding Chart release, and then modify the deployment resource files of corresponding pods. 

Beware that this method only applies to parameter modification on deployed Milvus application. To modify the parameters in **/milvus/configs/advanced/\*.yaml** before deployment, you will need to re-develop the Milvus Helm Chart.

### Modify ConfigMap YAML

As shown below, your Milvus release running on Kubernetes corresponds to a ConfigMap object with the same name of the release. The `data` section of the ConfigMap object only includes configurations in **milvus.yaml**. To change the `rootcoord.dmlChannelNum` in **root_coord.yaml**, you must add the parameters in **root_coord.yaml** to the `data` section in the ConfigMap YAML and change the specific parameter. 

```
kind: ConfigMap
apiVersion: v1
metadata:
  name: milvus-chaos
  ...
data:
  milvus.yaml: >
    ......
  root_coord.yaml: |
    rootcoord:
      dmlChannelNum: 128
      maxPartitionNum: 4096
      minSegmentSizeToEnableIndex: 1024
      timeout: 3600 # time out, 5 seconds
      timeTickInterval: 200 # ms
```

### Modify Deployment YAML

The data stored in a ConfigMap can be referenced in a volume of type configMap and then consumed by containerized applications running in a pod. To direct the pods to the new configuration files, you must modify the pod templates that need to load the configurations in **root_coord.yaml**. Specifically, you need to add a mount declaration under the `spec.template.spec.containers.volumeMounts` section in deployment YAML.

Taking the deployment YAML of rootcoord pod as an example, a `configMap` type volume named **milvus-config** is specified in `.spec.volumes` section. And, in `spec.template.spec.containers.volumeMounts` section, the volume is declared to mount **milvus.yaml** of your Milvus release on **/milvus/configs/milvus.yaml**. Similarly, you only need to add a mount declaration specifically for rootcoord container to mount the **root_coord.yaml** on **/milvus/configs/advanced/root_coord.yaml**, and thus the container can access the new configuration file.

```yaml
spec:
  replicas: 1
  selector:
    ......
  template:
    metadata:
      ...
    spec:
      volumes:
        - name: milvus-config
          configMap:
            name: milvus-chaos
            defaultMode: 420
      containers:
        - name: rootcoord
          image: 'milvusdb/milvus-dev:master-20210906-86afde4'
          args:
            ...
          ports:
            ...
          resources: {}
          volumeMounts:
            - name: milvus-config
              readOnly: true
              mountPath: /milvus/configs/milvus.yaml
              subPath: milvus.yaml
            - name: milvus-config
              readOnly: true
              mountPath: /milvus/configs/advanced/`root_coord.yaml
              subPath: root_coord.yaml
          terminationMessagePath: /dev/termination-log
          terminationMessagePolicy: File
          imagePullPolicy: IfNotPresent
      restartPolicy: Always
      terminationGracePeriodSeconds: 30
      dnsPolicy: ClusterFirst
      securityContext: {}
      schedulerName: default-scheduler
```

### Verify the result

The kubelet checks whether the mounted ConfigMap is fresh on every periodic sync. When the ConfigMap consumed in the volume is updated, projected keys are automatically updated as well. When the new pod is running again, you can verify if the modification is successful in the pod. Commands to check the parameter `rootcoord.dmlChannelNum` are shared below.

```bash
$ kctl exec -ti milvus-chaos-rootcoord-6f56794f5b-xp2zs -- sh
# cd configs/advanced
# pwd
/milvus/configs/advanced
# ls
channel.yaml  common.yaml  data_coord.yaml  data_node.yaml  etcd.yaml  proxy.yaml  query_node.yaml  root_coord.yaml
# cat root_coord.yaml
rootcoord:
  dmlChannelNum: 128
  maxPartitionNum: 4096
  minSegmentSizeToEnableIndex: 1024
  timeout: 3600 # time out, 5 seconds
  timeTickInterval: 200 # ms
# exit
```



Above is the method to modify the advanced configurations in Milvus deployed on Kubernetes. Future release of Milvus will integrate all configurations in one file, and will support updating configuration via helm chart. But before that, I hope this article can help you as a temporary solution.



## Engage with our open-source community:

- Find or contribute to Milvus on [GitHub](https://bit.ly/307b7jC).

- Interact with the community via [Forum](https://bit.ly/3qiyTEk).

- Connect with us on [Twitter](https://bit.ly/3ob7kd8).

  
