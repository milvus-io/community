---
id: Implement-Milvus-CLI-by-Python-Click.md
title: Implement Milvus CLI by Python Click
author: Zhen Chen
date: 2021-09-15
desc: Introduce how to implement a CLI based on Python Click.
tag: Milvus, Python
isPublish: true
---

# Implement Milvus CLI by Python Click

- [Implement Milvus CLI by Python Click](#Implement-Milvus-CLI-by-Python-Click)
  - [Overview](#Overview)
  - [Group commands](#Group-commands)
  - [Custom a command](#Custom-a-command)
  - [Implement prompt CLI for user to input](#Implement-prompt-cli-for-user-to-input)
  - [Manually implement autocomplete](#Manually-implement-autocomplete)
  - [Add one-time option](#Add-one-time-option)
  - [Build and release](#Build-and-release)
  - [Learn more about Milvus](#Learn-more-about-Milvus)

## Overview

Project URL: https://github.com/milvus-io/milvus_cli

Preparation: `Python3.8`,[ `Click 8.0.x`](https://click.palletsprojects.com/en/8.0.x/api/)

## Group commands

### Create a command

```python
import click
from utils import PyOrm

@click.group(no_args_is_help=False, add_help_option=False, invoke_without_command=True)
@click.pass_context
def cli(ctx):
    """Milvus CLI"""
    ctx.obj = PyOrm() # PyOrm is a util class which wraps the milvus python SDK. You can pass any class instance here. Any command function passed by @click.obj can call it.

if __name__ == '__main__':
    cli()
```

As the code above, we use `@click.group()` to create a command group `cli` as entry point. To implement a prompt CLI we need to disable help messages for the entry, so we add `no_args_is_help=False`, `add_help_option=False` and `invoke_without_command=True`. And nothing will be printed if we input `cli` in terminal only.

Besides we use `@click.pass_context` to pass a context to this group for further usage.

### Create a sub command of command group

Then we add the first sub command `help` under `cli`:

```python
# Print the help message of specified command.
def print_help_msg(command):
    with click.Context(command) as ctx:
        click.echo(command.get_help(ctx))


# Use @cli.command() to create a sub command of cli.
@cli.command()
def help():
    """Show help messages."""
    # Print help message of cli.
    click.echo(print_help_msg(cli))
```

Now we can use `cli help` in terminal:

```shell
$ python milvus_cli/scripts/milvus_cli.py help
```

### Create a sub group of a command group

Not only we want to have a sub command like `cli help`, but also we need a sub group commands such as `cli list collection` , `cli list partition` and `cli list indexes`.

First we create a sub group command `list`, here we can pass the first parameter to `@cli.group` as the command name instead of use defult function name, so that we can reduce duplicated function names.

Attention here, we use `@cli.group()` instead of `@click.group` so that we create a sub group of origin group.

The we use `@click.pass_obj` to pass the `context.obj` to sub commands of this sub group.

```python
@cli.group('list', no_args_is_help=False)
@click.pass_obj
def listDetails(obj):
    """List collections, partitions and indexes."""
    pass
```

Then we add some sub commands into this sub group by `@listDetails.command()` (not `@cli.command()`). Here's just an example, you can ignore the implement and we will discuss it later.

```python
@listDetails.command()
@click.option('--timeout', 'timeout', help="[Optional] - An optional duration of time in seconds to allow for the RPC. When timeout is set to None, client waits until server response or error occur.", default=None)
@click.option('--show-loaded', 'showLoaded', help="[Optional] - Only show loaded collections.", default=False)
@click.pass_obj
def collections(obj, timeout, showLoaded):
    """List all collections."""
    try:
        obj.checkConnection()
        click.echo(obj.listCollections(timeout, showLoaded))
    except Exception as e:
        click.echo(message=e, err=True)


@listDetails.command()
@click.option('-c', '--collection', 'collection', help='The name of collection.', default='')
@click.pass_obj
def partitions(obj, collection):
    """List all partitions of the specified collection."""
    try:
        obj.checkConnection()
        validateParamsByCustomFunc(
            obj.getTargetCollection, 'Collection Name Error!', collection)
        click.echo(obj.listPartitions(collection))
    except Exception as e:
        click.echo(message=e, err=True)
```

After all these complete, we have a miltigroup commands that look like:

![image](https://user-images.githubusercontent.com/83751452/132306467-71d81e50-3d6c-4fbe-81fc-db7280cb4838.png)

## Custom a command

### Add options

You can add some options to a command which will be used like `cli --test-option value`.

Here's an example, we add three options `alias`, `host` and `port` to specified an address to connect to Milvus.

First two parameters define the short and full option name, the third parameter defines the variable name, the `help` parameter specifies the short help message, the `default` parameter specifies the default value and the `type` specifies the value type.

And all options' values will be passed into the function in order of definition.

```python
@cli.command(no_args_is_help=False)
@click.option('-a', '--alias', 'alias', help="Milvus link alias name, default is `default`.", default='default', type=str)
@click.option('-h', '--host', 'host', help="Host name, default is `127.0.0.1`.", default='127.0.0.1', type=str)
@click.option('-p', '--port', 'port', help="Port, default is `19530`.", default=19530, type=int)
@click.pass_obj
def connect(obj, alias, host, port):
    pass
```

### Add flag options

We use options above to pass a value, but some times we just need a flag as a boolean value.

As the example below, option `autoId` is a flag option and don't pass any data to function, so we can use it like `cli create collection -c c_name -p p_name -a`.

```python
@createDetails.command('collection')
@click.option('-c', '--collection-name', 'collectionName', help='Collection name to be created.', default='')
@click.option('-p', '--schema-primary-field', 'primaryField', help='Primary field name.', default='')
@click.option('-a', '--schema-auto-id', 'autoId', help='Enable auto id.', default=False, is_flag=True)
@click.pass_obj
def createCollection(obj, collectionName, primaryField, autoId, description, fields):
    pass
```

### Add arguments

In this project we replace all arguments usage with options usage. But we still introduce argument usage here. Different from options, argements are used like `cli COMMAND [OPTIONS] ARGUEMENTS`. If we convert the example above into arguements usage, it'll be like this:

```python
@createDetails.command('collection')
@click.argument('collectionName')
@click.option('-p', '--schema-primary-field', 'primaryField', help='Primary field name.', default='')
@click.option('-a', '--schema-auto-id', 'autoId', help='Enable auto id.', default=False, is_flag=True)
@click.pass_obj
def createCollection(obj, collectionName, primaryField, autoId, description, fields):
    pass
```

Then the usage should be `cli create collection c_name -p p_name -a`.

### Add full help message

As we define the short help message above, we can define the full help message in function:

```python
@cli.command(no_args_is_help=False)
@click.option('-a', '--alias', 'alias', help="Milvus link alias name, default is `default`.", default='default', type=str)
@click.option('-h', '--host', 'host', help="Host name, default is `127.0.0.1`.", default='127.0.0.1', type=str)
@click.option('-p', '--port', 'port', help="Port, default is `19530`.", default=19530, type=int)
@click.pass_obj
def connect(obj, alias, host, port):
    """
    Connect to Milvus.

    Example:

        milvus_cli > connect -h 127.0.0.1 -p 19530 -a default
    """
    try:
        obj.connect(alias, host, port)
    except Exception as e:
        click.echo(message=e, err=True)
    else:
        click.echo("Connect Milvus successfully!")
        click.echo(obj.showConnection(alias))
```

The first block inside of the function is the help message which will be printed after we input `cli connect --help`.

```shell
milvus_cli > connect --help
Usage: milvus_cli.py connect [OPTIONS]

  Connect to Milvus.

  Example:

      milvus_cli > connect -h 127.0.0.1 -p 19530 -a default

Options:
  -a, --alias TEXT    Milvus link alias name, default is `default`.
  -h, --host TEXT     Host name, default is `127.0.0.1`.
  -p, --port INTEGER  Port, default is `19530`.
  --help              Show this message and exit.
```

### Add confirm

Sometimes we need user to confirm some action especially delete something. We can add `click.confirm` to pause and ask user to confirm:

```python
@deleteSth.command('collection')
@click.option('-c', '--collection', 'collectionName', help='The name of collection to be deleted.', default='')
@click.option('-t', '--timeout', 'timeout', help='An optional duration of time in seconds to allow for the RPC. If timeout is set to None, the client keeps waiting until the server responds or an error occurs.', default=None, type=int)
@click.pass_obj
def deleteCollection(obj, collectionName, timeout):
    """
    Drops the collection together with its index files.

    Example:

        milvus_cli > delete collection -c car
    """
    click.echo(
        "Warning!\nYou are trying to delete the collection with data. This action cannot be undone!\n")
    if not click.confirm('Do you want to continue?'):
        return
    pass
```

As the example above, a confirm conversation will show like `Aborted!ant to continue? [y/N]:`.

### Add prompts

To implement prompts we juest need to add `click.prompt`.

```python
@cli.command()
@click.pass_obj
def query(obj):
    """
    Query with a set of criteria, and results in a list of records that match the query exactly.
    """
    collectionName = click.prompt(
        'Collection name', type=click.Choice(obj._list_collection_names()))
    expr = click.prompt('The query expression(field_name in [x,y])')
    partitionNames = click.prompt(
        f'The names of partitions to search(split by "," if multiple) {obj._list_partition_names(collectionName)}', default='')
    outputFields = click.prompt(
        f'Fields to return(split by "," if multiple) {obj._list_field_names(collectionName)}', default='')
    timeout = click.prompt('timeout', default='')
    pass
```

The prompt will show when each `click.prompt`. We use a few prompts in series so that it'll look like a continuously conversation. This ensure user will input the data in order we want. In this case we need user to choose a collection first, and we need to get all partitions under this collections, then show them to user to choose.

### Add choices

Sometimes you want user just input the limited range/type of value, you can add `type=click.Choice([<any>])` to `click.prompt` , `click.options` and etc..

Such as,

```python
collectionName = click.prompt(
        'Collection name', type=click.Choice(['collection_1', 'collection_2']))
```

Then user can only input `collection_1` or `collection_2` , error will be raised if any other inputs.

### Add clear screen

You can use `click.clear()` to implement it.

```python
@cli.command()
def clear():
    """Clear screen."""
    click.clear()
```

### Additional tips

- Default value is `None`, so it's meaningless if you specified the default value as `None`. And default `None` will cause `click.prompt` continously show if you want to leave a value empty to jump over it.

## Implement prompt CLI for user to input

### Why prompt CLI

For database operation, we need a continuously connection to a instance. If we use origin command line mode, the connection will be dropped after each command performed. We also want to store some data when using CLI, and clean them after exit.

### Implement

1. Use `while True` for continuously listening user's input.

```python
def runCliPrompt():
    while True:
        astr = input('milvus_cli > ')
        try:
            cli(astr.split())
        except SystemExit:
            # trap argparse error message
            # print('error', SystemExit)
            continue


if __name__ == '__main__':
    runCliPrompt()
```

2. Use `input` only will cause `up`, `down`, `left`, `right` arrow keys, `tab` key and some other keys converted to Acsii string automatically. Besides history commands can not be read from session. So we add `readline` into `runCliPrompt` function.

```python
def runCliPrompt():
    while True:
    		import readline
        readline.set_completer_delims(' \t\n;')
        astr = input('milvus_cli > ')
        try:
            cli(astr.split())
        except SystemExit:
            # trap argparse error message
            # print('error', SystemExit)
            continue
```

3. Add `quit` CLI.

```python
@cli.command('exit')
def quitapp():
    """Exit the CLI."""
    global quitapp
    quitapp = True


quitapp = False  # global flag


def runCliPrompt():
    while not quitapp:
    		import readline
        readline.set_completer_delims(' \t\n;')
        astr = input('milvus_cli > ')
        try:
            cli(astr.split())
        except SystemExit:
            # trap argparse error message
            # print('error', SystemExit)
            continue
```

4. Catch `KeyboardInterrupt` error when use `ctrl C` to exit.

```python
def runCliPrompt():
    try:
        while not quitapp:
            import readline
            readline.set_completer_delims(' \t\n;')
            astr = input('milvus_cli > ')
            try:
                cli(astr.split())
            except SystemExit:
                # trap argparse error message
                # print('error', SystemExit)
                continue
    except KeyboardInterrupt:
        sys.exit(0)
```

5. After all settled, the CLI now looks like:

```shell
milvus_cli >
milvus_cli > connect
+-------+-----------+
| Host  | 127.0.0.1 |
| Port  |   19530   |
| Alias |  default  |
+-------+-----------+

milvus_cli > help
Usage:  [OPTIONS] COMMAND [ARGS]...

  Milvus CLI

Commands:
  clear     Clear screen.
  connect   Connect to Milvus.
  create    Create collection, partition and index.
  delete    Delete specified collection, partition and index.
  describe  Describe collection or partition.
  exit      Exit the CLI.
  help      Show help messages.
  import    Import data from csv file with headers and insert into target...
  list      List collections, partitions and indexes.
  load      Load specified collection.
  query     Query with a set of criteria, and results in a list of...
  release   Release specified collection.
  search    Conducts a vector similarity search with an optional boolean...
  show      Show connection, loading_progress and index_progress.
  version   Get Milvus CLI version.

milvus_cli > exit
```

## Manually implement autocomplete

Different from click's shell autocomplete, our project wrap the command line and use a loop to get user's input to implement a prompt command line. So we need to bind a completer to `readline`.

```python
class Completer(object):
    RE_SPACE = re.compile('.*\s+$', re.M)
    CMDS_DICT = {
        'clear': [],
        'connect': [],
        'create': ['collection', 'partition', 'index'],
        'delete': ['collection', 'partition', 'index'],
        'describe': ['collection', 'partition'],
        'exit': [],
        'help': [],
        'import': [],
        'list': ['collections', 'partitions', 'indexes'],
        'load': [],
        'query': [],
        'release': [],
        'search': [],
        'show': ['connection', 'index_progress', 'loading_progress'],
        'version': [],
    }

    def __init__(self) -> None:
        super().__init__()
        self.COMMANDS = list(self.CMDS_DICT.keys())
        self.createCompleteFuncs(self.CMDS_DICT)

    def createCompleteFuncs(self, cmdDict):
        for cmd in cmdDict:
            sub_cmds = cmdDict[cmd]
            complete_example = self.makeComplete(cmd, sub_cmds)
            setattr(self, 'complete_%s' % cmd, complete_example)

    def makeComplete(self, cmd, sub_cmds):
        def f_complete(args):
            f"Completions for the {cmd} command."
            if not args:
                return self._complete_path('.')
            if len(args) <= 1 and not cmd == 'import':
                return self._complete_2nd_level(sub_cmds, args[-1])
            return self._complete_path(args[-1])
        return f_complete

    def _listdir(self, root):
        "List directory 'root' appending the path separator to subdirs."
        res = []
        for name in os.listdir(root):
            path = os.path.join(root, name)
            if os.path.isdir(path):
                name += os.sep
            res.append(name)
        return res

    def _complete_path(self, path=None):
        "Perform completion of filesystem path."
        if not path:
            return self._listdir('.')
        dirname, rest = os.path.split(path)
        tmp = dirname if dirname else '.'
        res = [os.path.join(dirname, p)
               for p in self._listdir(tmp) if p.startswith(rest)]
        # more than one match, or single match which does not exist (typo)
        if len(res) > 1 or not os.path.exists(path):
            return res
        # resolved to a single directory, so return list of files below it
        if os.path.isdir(path):
            return [os.path.join(path, p) for p in self._listdir(path)]
        # exact file match terminates this completion
        return [path + ' ']

    def _complete_2nd_level(self, SUB_COMMANDS=[], cmd=None):
        if not cmd:
            return [c + ' ' for c in SUB_COMMANDS]
        res = [c for c in SUB_COMMANDS if c.startswith(cmd)]
        if len(res) > 1 or not (cmd in SUB_COMMANDS):
            return res
        return [cmd + ' ']

    def complete(self, text, state):
        "Generic readline completion entry point."
        buffer = readline.get_line_buffer()
        line = readline.get_line_buffer().split()
        # show all commands
        if not line:
            return [c + ' ' for c in self.COMMANDS][state]
        # account for last argument ending in a space
        if self.RE_SPACE.match(buffer):
            line.append('')
        # resolve command to the implementation function
        cmd = line[0].strip()
        if cmd in self.COMMANDS:
            impl = getattr(self, 'complete_%s' % cmd)
            args = line[1:]
            if args:
                return (impl(args) + [None])[state]
            return [cmd + ' '][state]
        results = [
            c + ' ' for c in self.COMMANDS if c.startswith(cmd)] + [None]
        return results[state]
```

After define `Completer` we can bind it with readline:

```python
comp = Completer()


def runCliPrompt():
    try:
        while not quitapp:
            import readline
            readline.set_completer_delims(' \t\n;')
            readline.parse_and_bind("tab: complete")
            readline.set_completer(comp.complete)
            astr = input('milvus_cli > ')
            try:
                cli(astr.split())
            except SystemExit:
                # trap argparse error message
                # print('error', SystemExit)
                continue
    except KeyboardInterrupt:
        sys.exit(0)
```

## Add one-time option

For prompt command line, sometimes we don't want to fully run into the scripts to get some informations such as version. A good example is `Python`, when you type `python` in terminal the promtp command line will show, but it only returns a version message and will not entry the prompt scripts if you type `python -V`. So we can use `sys.args` in our code to implement.

```python
def runCliPrompt():
    args = sys.argv
    if args and (args[-1] == '--version'):
        print(f"Milvus Cli v{getPackageVersion()}")
        return
    try:
        while not quitapp:
            import readline
            readline.set_completer_delims(' \t\n;')
            readline.parse_and_bind("tab: complete")
            readline.set_completer(comp.complete)
            astr = input('milvus_cli > ')
            try:
                cli(astr.split())
            except SystemExit:
                # trap argparse error message
                # print('error', SystemExit)
                continue
    except KeyboardInterrupt:
        sys.exit(0)


if __name__ == '__main__':
    runCliPrompt()
```

We get `sys.args` before the loop when first run into CLI scripts. If the last arguments is `--version` , the code will return the package version without running into loop.

It will be helpful after we build the codes as a package. User can type `milvus_cli` to jump into a prompt CLI, or type `milvus_cli --version` to only get the version.

## Build and release

Finally we want to build a package and release by PYPI. So that user can simply use `pip install <package name>` to install.

### Install locally for test

Before you publish the package to PYPI, you may want to install it locally for some tests.

In this case, you can simply `cd` into the package directory and run `pip install -e .` (Don't forget the `.`).

### Create package files

Refer to: https://packaging.python.org/tutorials/packaging-projects/

A package's structure should look like:

```shell
package_example/
├── LICENSE
├── README.md
├── setup.py
├── src/
│   ├── __init__.py
│   ├── main.py
│   └── scripts/
│       ├── __init__.py
│       └── example.py
└── tests/
```

#### Create the package directory

Create `Milvus_cli` directory with the structure below:

```shell
Milvus_cli/
├── LICENSE
├── README.md
├── setup.py
├── milvus_cli/
│   ├── __init__.py
│   ├── main.py
│   ├── utils.py
│   └── scripts/
│       ├── __init__.py
│       └── milvus_cli.py
└── dist/
```

#### Write the entry code

The script's entry should be in `Milvus_cli/milvus_cli/scripts`, and the `Milvus_cli/milvus_cli/scripts/milvus_cli.py` should be like:

```python
import sys
import os
import click
from utils import PyOrm, Completer


pass_context = click.make_pass_decorator(PyOrm, ensure=True)


@click.group(no_args_is_help=False, add_help_option=False, invoke_without_command=True)
@click.pass_context
def cli(ctx):
    """Milvus CLI"""
    ctx.obj = PyOrm()

"""
...
Here your code.
...
"""

@cli.command('exit')
def quitapp():
    """Exit the CLI."""
    global quitapp
    quitapp = True


quitapp = False  # global flag
comp = Completer()


def runCliPrompt():
    args = sys.argv
    if args and (args[-1] == '--version'):
        print(f"Milvus Cli v{getPackageVersion()}")
        return
    try:
        while not quitapp:
            import readline
            readline.set_completer_delims(' \t\n;')
            readline.parse_and_bind("tab: complete")
            readline.set_completer(comp.complete)
            astr = input('milvus_cli > ')
            try:
                cli(astr.split())
            except SystemExit:
                # trap argparse error message
                # print('error', SystemExit)
                continue
            except Exception as e:
                click.echo(
                    message=f"Error occurred!\n{str(e)}", err=True)
    except KeyboardInterrupt:
        sys.exit(0)


if __name__ == '__main__':
    runCliPrompt()
```

#### Edit the `setup.py`

```python
from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name='milvus_cli',
    version='0.1.6',
    author='Milvus Team',
    author_email='milvus-team@zilliz.com',
    url='https://github.com/milvus-io/milvus_cli',
    description='CLI for Milvus',
    long_description=long_description,
    long_description_content_type='text/markdown',
    license='Apache-2.0',
    packages=find_packages(),
    include_package_data=True,
    install_requires=[
        'Click==8.0.1',
        'pymilvus==2.0.0rc5',
        'tabulate==0.8.9'
    ],
    entry_points={
        'console_scripts': [
            'milvus_cli = milvus_cli.scripts.milvus_cli:runCliPrompt',
        ],
    },
    python_requires='>=3.8'
)
```

Some tips here:

1. We use `README.md` content as the package's long description.
2. Add all dependencies to `install_requires`.
3. Specify the `entry_points`. In this case, we set `milvus_cli` as a child of `console_scripts`, so that we can type `milvus_cli` as a command directly after we install this package. And the `milvus_cli`'s entry point is `runCliPrompt` function in `milvus_cli/scripts/milvus_cli.py`.

#### Build

1. Upgrade the `build` package: `python3 -m pip install --upgrade build`

2. Run build: `python -m build --sdist --wheel --outdir dist/ .`
3. Two files will be generated under the `dist/` directory:

```shell
dist/
  example_package_YOUR_USERNAME_HERE-0.0.1-py3-none-any.whl
  example_package_YOUR_USERNAME_HERE-0.0.1.tar.gz
```

### Publish release

Refer to: https://packaging.python.org/tutorials/packaging-projects/#uploading-the-distribution-archives

1. Upgrade `twine` package: `python3 -m pip install --upgrade twine`
2. Upload to `PYPI` test env: `python3 -m twine upload --repository testpypi dist/*`
3. Upload to `PYPI` : `python3 -m twine upload dist/*`

### CI/CD by Github workflows

Refer to: https://packaging.python.org/guides/publishing-package-distribution-releases-using-github-actions-ci-cd-workflows/

We want a way to upload assets automatically, it can build the packages and upload them to github releases and PYPI.

(For some reason we just want the workflow only publish the release to test PYPI.)

```yaml
# This is a basic workflow to help you get started with Actions

name: Update the release's assets after it published

# Controls when the workflow will run
on:
  release:
    # The workflow will run after release published
    types: [published]

# A workflow run is made up of one or more jobs that can run sequentially or in parallel
jobs:
  # This workflow contains a single job called "build"
  build:
    # The type of runner that the job will run on
    runs-on: ubuntu-latest

    # Steps represent a sequence of tasks that will be executed as part of the job
    steps:
      # Checks-out your repository under $GITHUB_WORKSPACE, so your job can access it
      - uses: actions/checkout@v2
      - uses: actions/setup-python@v2
        with:
          python-version: '3.8'
          architecture: 'x64'
      - name: Install pypa/build
        run: >-
          python -m
          pip install
          build
          --user
      - name: Clean dist/
        run: |
          sudo rm -fr dist/*
      - name: Build a binary wheel and a source tarball
        run: >-
          python -m
          build
          --sdist
          --wheel
          --outdir dist/
          .
      # Update target github release's assets
      - name: Update assets
        uses: softprops/action-gh-release@v1
        if: startsWith(github.ref, 'refs/tags/')
        with:
          files: ./dist/*
      - name: Publish distribution 📦 to Test PyPI
        if: contains(github.ref, 'beta') && startsWith(github.ref, 'refs/tags')
        uses: pypa/gh-action-pypi-publish@release/v1
        with:
          user: __token__
          password: ${{ secrets.TEST_PYPI_API_TOKEN }}
          repository_url: https://test.pypi.org/legacy/
          packages_dir: dist/
          verify_metadata: false
```

## Learn more about Milvus
Milvus is a powerful tool capable of powering a vast array of artificial intelligence and vector similarity search applications. To learn more about the project, check out the following resources:
- Read our [blog](https://milvus.io/blog).
- Interact with our open-source community on [Slack](https://milvusio.slack.com/join/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ#/shared-invite/email).
- Use or contribute to the world’s most popular vector database on [GitHub](https://github.com/milvus-io/milvus/).
- Quickly test and deploy AI applications with our new [bootcamp](https://github.com/milvus-io/bootcamp).
