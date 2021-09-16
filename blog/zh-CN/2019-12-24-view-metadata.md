---
id: 2019-12-24-view-metadata.md
title: Milvus 数据管理系列（三）：元数据管理 - 查看元数据
author: 莫毅华
date: 2019-12-24
desc:

cover:
tag:
---

# Milvus 数据管理系列（三）：元数据管理

> 作者：莫毅华
>
> 日期：2019-12-24

## Milvus 元数据管理（一）：怎样查看元数据

我们在[《Milvus 数据管理系列（一）：数据管理策略》](2019-11-08-data-management.md)一文中介绍过一些关于元数据（meta data）的信息。这篇文章将会具体解释如何使用 SQLite 或者 MySQL 来查看元数据文件。

Milvus 从今年年初开始做原型到现在已近一年，从最初的内部测试，到 0.3.0 版本开始有用户试用，再到现在的 0.6.0 版本，已经历了若干次迭代。真正开始有比较多的人注意到这个产品是从 0.5.0 版本开始的，实际上 0.4.0 和 0.5.0 的元数据格式一模一样，因此 0.4.0 之前的版本我就忽略不说。

### 使用 SQLite 查看

如果使用的是 SQLite，那么在 Milvus 启动之后就会在数据目录（在配置文件 `server_config.yaml` 的`primary_path` 里定义）下生成一个 `meta.sqlite` 文件。我们仅需安装一个 SQLite 的客户端，就能打开这个文件查看里面的内容。

先在命令行安装 SQLite3：

```shell
sudo apt-get install sqlite3
```

然后命令行进入 Milvus 的数据目录，用 SQLite3 打开元数据文件：

```shell
sqlite3 meta.sqlite
```

之后就进入了 SQLite 的客户端命令行。我们再使用几行命令来看看元数据里到底有啥。若要让打印结果排版易于人类阅读：

```sql
.mode column
.header on
```

用 SQL 语句查询 Tables 和 TableFiles 两张表的内容（大小写无所谓）：

```sql
SELECT \* FROM Tables
```

```sql
SELECT \* FROM TableFiles
```

![sqlite3](https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/sqlite3.png)

### 使用 MySQL 查看

如果使用的是 MySQL，需要在配置文件 `server_config.yaml` 的 `backend_url` 指明 MySQL 服务的地址。比如下面这个设置表示 MySQL 服务部署在本地，端口为 3306，用户名为 root，密码为 123456，数据库名称是 milvus：

```
db_config:

   backend_url: mysql://root:123456@127.0.0.1:3306/milvus
```

安装 MySQL 的客户端：

```shell
sudo apt-get install default-mysql-client
```

当你启动了 Milvus 之后，Milvus 就会在那个 `backend_url` 指定的 MySQL 服务里创建 Tables 和 TableFiles 两张表，然后我们用命令行连接 MySQL 服务：

```shell
mysql -h127.0.0.1 -uroot -p123456 -Dmilvus
```

这样，我们可以用 SQL 语句来查询元数据信息了：

![mysql](https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/mysql.png)

## 相关博客

- [Milvus 数据管理系列（一）：数据管理策略](2019-11-08-data-management.md)
- [Milvus 数据管理系列（二）：数据文件清理机制的改进](2019-12-18-datafile-cleanup.md)
- [Milvus 数据管理系列（四）：元数据表的字段](2019-12-27-meta-table.md)
