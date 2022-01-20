---
id: 2021-12-31-get-started-with-milvus-cli.md
title: Get started with Milvus_CLI
author: ChenZhuanghong & Chenzhen
date: 2021-12-31
desc: This article introduces Milvus_CLI and helps you complete common tasks.
cover: assets.zilliz.com/2_Tech_Get_Started_With_Milvus_CLI_a8f12fdc46.png
tag: Engineering
recommend: true
---

In the age of information explosion, we are producing voice, images, videos, and other unstructured data all the time. How do we efficiently analyze this massive amount of data? The emergence of neural networks enables unstructured data to be embedded as vectors, and the Milvus database is a basic data service software, which helps complete the storage, search, and analysis of vector data.

But how can we use the Milvus vector database quickly?

Some users have complained that APIs are hard to memorize and hope there could be simple command lines to operate the Milvus database.

We're thrilled to introduce Milvus_CLI, a command-line tool dedicated to the Milvus vector database.

Milvus_CLI is a convenient database CLI for Milvus, supporting database connection, data import, data export, and vector calculation using interactive commands in shells. The latest version of Milvus_CLI has the following features.

- All platforms supported, including Windows, Mac, and Linux

- Online and offline installation with pip supported

- Portable, can be used anywhere

- Built on the Milvus SDK for Python

- Help docs included

- Auto-complete supported

## Installation

You can install Milvus_CLI either online or offline.

### Install Milvus_CLI online

Run the following command to install Milvus_CLI online with pip. Python 3.8 or later is required.

```
pip install milvus-cli
```

### Install Milvus_CLI offline

To install Milvus_CLI offline, [download](https://github.com/milvus-io/milvus_cli/releases) the latest tarball from the release page first.

![1.png](https://assets.zilliz.com/1_af0e832119.png)

After the tarball is downloaded, run the following command to install Milvus_CLI.

```
pip install milvus_cli-<version>.tar.gz
```

After Milvus_CLI is installed, run `milvus_cli`. The `milvus_cli >` prompt that appears indicates that the command line is ready.

![2.png](https://assets.zilliz.com/2_b50f5d2a5a.png)

If you're using a Mac with the M1 chip or a PC without a Python environment, you can choose to use a portable application instead. To accomplish this, [download](https://github.com/milvus-io/milvus_cli/releases) a file on the release page corresponding to your OS, run `chmod +x` on the file to make it executable, and run `./` on the file to run it.

#### **Example**

The following example makes `milvus_cli-v0.1.8-fix2-macOS` executable and runs it.

```
sudo chmod +x milvus_cli-v0.1.8-fix2-macOS
./milvus_cli-v0.1.8-fix2-macOS
```

## Usage

### Connect to Milvus

Before connecting to Milvus, ensure that Milvus is installed on your server. See [Install Milvus Standalone](https://milvus.io/docs/v2.0.0/install_standalone-docker.md) or [Install Milvus Cluster](https://milvus.io/docs/v2.0.0/install_cluster-docker.md) for more information.

If Milvus is installed on your localhost with the default port, run `connect`.

![3.png](https://assets.zilliz.com/3_f950d3739a.png)

Otherwise, run the following command with the IP address of your Milvus server. The following example uses `172.16.20.3` as the IP address and `19530` as the port number.

```
connect -h 172.16.20.3
```

![4.png](https://assets.zilliz.com/4_9ff2db9855.png)

### Create a collection

This section introduces how to create a collection.

A collection consists of entities and is similar to a table in RDBMS. See [Glossary](https://milvus.io/docs/v2.0.0/glossary.md) for more information.

![5.png](https://assets.zilliz.com/5_95a88c1cbf.png)

#### Example

The following example creates a collection named `car`. The `car` collection has four fields which are `id`, `vector`, `color`, and `brand`. The primary key field is `id`. See [create collection](https://milvus.io/docs/v2.0.0/cli_commands.md#create-collection) for more information.

```
create collection -c car -f id:INT64:primary_field -f vector:FLOAT_VECTOR:128 -f color:INT64:color -f brand:INT64:brand -p id -a -d 'car_collection'
```

### List collections

Run the following command to list all collections in this Milvus instance.

```
list collections
```

![6.png](https://assets.zilliz.com/6_1331f4c8bc.png)

Run the following command to check the details of the `car` collection.

```
describe collection -c car 
```

![7.png](https://assets.zilliz.com/7_1d70beee54.png)

### Calculate the distance between two vectors

Run the following command to import data into the `car` collection.

```
import -c car 'https://raw.githubusercontent.com/zilliztech/milvus_cli/main/examples/import_csv/vectors.csv'
```

![8.png](https://assets.zilliz.com/8_7609a4359a.png)

Run `query` and enter `car` as the collection name and `id>0` as the query expression when prompted. The IDs of the entities that meet the criteria are returned as shown in the following figure.

![9.png](https://assets.zilliz.com/9_f0755589f6.png)


Run `calc` and enter appropriate values when prompted to calculate the distances between vector arrays.

### Delete a collection

Run the following command to delete the `car` collection.

```
delete collection -c car
```

![10.png](https://assets.zilliz.com/10_16b2b01935.png)

## More

Milvus_CLI is not limited to the preceding functions. Run `help` to view all commands that Milvus_CLI includes and the respective descriptions. Run `<command> --help` to view the details of a specified command.

![11.png](https://assets.zilliz.com/11_5f31ccb1e8.png)

**See also:**

[Milvus_CLI Command Reference](https://github.com/zilliztech/milvus_cli/blob/main/doc/en/cli_commands.md) on GitHub

[Milvus_CLI Command Reference](https://milvus.io/docs/v2.0.0/cli_commands.md) under Milvus Docs

We hope Milvus_CLI could help you easily use the Milvus vector database. We will keep optimizing Milvus_CLI and your contributions are welcome.

If you have any questions, feel free to [file an issue](https://github.com/zilliztech/milvus_cli/issues) on GitHub.
