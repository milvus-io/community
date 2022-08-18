---
id: 2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md
title: How to Use String Data to Empower Your Similarity Search Applications
author: Xi Ge
date: 2022-08-08
desc: Use string data to streamline the process of building your own similarity search applications. 
cover: assets.zilliz.com/string_6129ce83e6.png
tag: Engineering
tags: Vector Database for AI, Artificial Intelligence, Machine Learning
canonicalUrl: http://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md
---

![Cover](https://assets.zilliz.com/string_6129ce83e6.png "How to use string data to empower your similarity search applications?")

Milvus 2.1 comes with [some significant updates](https://milvus.io/blog/2022-08-05-whats-new-in-milvus-2-1.md) which make working with Milvus a lot easier. One of them is the support of string data type. Right now Milvus [supports data types](https://milvus.io/docs/v2.1.x/schema.md#Supported-data-type) including strings, vectors, Boolean, integers, floating-point numbers, and more. 

This article presents an introduction to the support of string data type. Read and learn what you can do with it and how to use it.

**Jump to:**
- [What can you do with string data?](#What-can-you-do-with-string-data)
- [How to manage string data in Milvus 2.1?](#How-to-manage-string-data-in-Milvus-21)
    - [Create a collection](#Create-a-collection)
    - [Insert and delete data](#Insert-data)
    - [Build an index](#Build-an-index)
    - [Hybrid search](#Hybrid-search)
    - [String expressions](#String-expressions)

# What can you do with string data?

The support of string data type has been one of the functions most expected by users. It both streamlines the process of building an application with the Milvus vector database and accelerates the speed of similarity search and vector query, largely increasing the efficiency and reducing the maintenance cost of whatever application you are working on.

Specifically, Milvus 2.1 supports VARCHAR data type, which stores character strings of varying length. With the support of VARCHAR data type, you can:

1. Directly manage string data without the help of an external relational database.

The support of VARCHAR data type enables you to skip the step of converting strings into other data types when inserting data into Milvus. Let's say you're working on a book search system for your own online bookstore. You are creating a book dataset and want to identify the books with their names. While in previous versions where Milvus does not support the string data type, before inserting data into MIilvus, you may need to first transform the strings (the names of the books) into book IDs with the help of a relational database like MySQL. Right now, as string data type is supported, you can simply create a string field and directly enter the book names instead of their ID numbers.

The convenience also goes to the search and query process. Imagine there is a client whose favourite book is *Hello Milvus*. You want to search in the system for similar books and recommend them to the client. In previous versions of Milvus, the system will only return you book IDs and you need to take an extra step to check the corresponding book information in a relational database. But in Milvus 2.1, you can directly get the book names as you have already created a string field with book names in it.

In a word, the support of string data type saves you the effort to turn to other tools to manage string data, which greatly simplifies the development process.

2. Accelerate the speed of [hybrid search](https://milvus.io/docs/v2.1.x/hybridsearch.md) and [vector query](https://milvus.io/docs/v2.1.x/query.md) through attribute filtering.

Like other scalar data types, VARCHAR can be used for attribute filtering in hybrid search and vector query through Boolean expression. It is particularly worth mentioning that Milvus 2.1 adds the operator `like`, which enables you to perform prefix matching. Also, you can perform exact matching using the operator `==`.

Besides, a MARISA-trie based inverted index is supported to accelerate hybrid search and query. Continue to read and find out all the string expressions you may want to know to perform attribute filtering with string data.

# How to manage string data in Milvus 2.1?

Now we know the string data type is extremely useful, but when exactly do we need to use this data type in building our own applications? In the following, you will see some code examples of scenarios that may involve string data, which will give you a better understanding of how to manage VARCHAR data in Milvus 2.1.

## Create a collection

Let's follow the previous example. You are still working on the book recommender system and want to create a book collection with a primary key field called `book_name`, into which you will insert string data. In this case, you can set the data type as `DataType.VARCHAR`when setting the field schema, as shown in the example below. 

Note that when creating a VARCHAR field, it is necessary to specify the maximum character length via the parameter `max_length` whose value can range from 1 to 65,535.  In this example, we set the maximum length as 200.

```Python
from pymilvus import CollectionSchema, FieldSchema, DataType
book_id = FieldSchema(
  name="book_id", 
  dtype=DataType.INT64, 
)
book_name = FieldSchema( 
  name="book_name", 
  dtype=DataType.VARCHAR, 
  max_length=200, 
  is_primary=True, 
)
word_count = FieldSchema(
  name="word_count", 
  dtype=DataType.INT64,  
)
book_intro = FieldSchema(
  name="book_intro", 
  dtype=DataType.FLOAT_VECTOR, 
  dim=2
)
schema = CollectionSchema(
  fields=[book_id, word_count, book_intro], 
  description="Test book search"
)
collection_name = "book"
```

## Insert data

Now that the collection is created, we can insert data into it. In the following example, we insert 2,000 rows of randomly generated string data.

```Python
import random
data = [
  [i for i in range(2000)],
  ["book_" + str(i) for i in range(2000)],
  [i for i in range(10000, 12000)],
  [[random.random() for _ in range(2)] for _ in range(2000)],
]
```

## Delete data

Suppose two books, named `book_0` and `book_1`, are no longer available in your store, so you want to delete the relevant information from your database. In this case, you can use the term expression `in` to filter the entities to delete, as shown in the example below.

Remember that Milvus only supports deleting entities with clearly specified primary keys, so before running the following code, make sure that you have set the `book_name` field as the primary key field.

```Python
expr = "book_name in [\"book_0\", \"book_1\"]" 
from pymilvus import Collection
collection = Collection("book")     
collection.delete(expr)
```

## Build an Index

Milvus 2.1 supports building scalar indexes, which will greatly accelerate the filtering of string fields. Unlike building a vector index, you don't have to prepare parameters before building a scalar index. Milvus temporarily only supports the dictionary tree (MARISA-trie) index, so the index type of VARCHAR type field is MARISA-trie by default.

You can specify the index name when building it. If not specified, the default value of `index_name` is `"_default_idx_"`. In the example below, we named the index `scalar_index`.

```Python
from pymilvus import Collection
collection = Collection("book")   
collection.create_index(
  field_name="book_name", 
  index_name="scalar_index",
)
```

## Hybrid search

By specifying boolean expressions, you can filter the string fields during a vector similarity search. 

For example, if you are searching for books whose intro are most similar to Hello Milvus but only want to get the books whose names start with 'book_2', you can use the operator `like`to perform a prefix match and get the targeted books, as shown in the example below. 

```Python
search_param = {
  "data": [[0.1, 0.2]],
  "anns_field": "book_intro",
  "param": {"metric_type": "L2", "params": {"nprobe": 10}},
  "limit": 2,
  "expr": "book_name like \"Hello%\"",
}
res = collection.search(**search_param)
```

## String expressions

Apart from the newly added operator `like`, other operators, which are already supported in previous versions of Milvus, can also be used for string field filtering. Below are some examples of commonly used [string expressions](https://milvus.io/docs/v2.1.x/boolean.md), where `A` represents a field of type VARCHAR. Remember that all the string expressions below can be logically combined using logical operators, such as AND, OR, and NOT.

### Set operations

You can use `in` and `not in` to realize set operations, such as `A in ["str1", "str2"]`.

### Compare two string fields

You can use relational operators to compare the values of two string fields. Such relational operators include `==`, `!=`, `>`, `>=`, `<`, `<=`. For more information, see [Relational operators](https://milvus.io/docs/v2.1.x/boolean.md#Relational-operators).

Note that string fields can only be compared with other string fields instead of fields of other data types. For example, a field of type VARCHAR cannot be compared with a field of type Boolean or of type integer.

### Compare a field with a constant value

You can use `==` or `!=` to verify if the value of a field is equal to a constant value. 

### Filter fields with a single range

You can use `>`, `>=`, `<`, `<=` to filter string fields with a single range, such as `A > "str1"`. 

### Prefix matching

As mentioned earlier, Milvus 2.1 adds the operator `like` for prefix matching, such as `A like "prefix%"`. 

# What's next

With the official release of Milvus 2.1, we have prepared a series of blogs introducing the new features. More blogs will be published soon. Stay tuned! 

Read more in this blog series:

- [Using Embedded Milvus to Instantly Install and Run Milvus with Python](https://milvus.io/blog/embedded-milvus.md)
- Understanding Consistency Level in the Milvus Vector Database
- In-memory replicas
- How Does the Milvus Vector Database Ensure Data Security?


