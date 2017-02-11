# gitgraphwrapper.js
[![Build Status](https://travis-ci.org/opengl-8080/gitgraphwrapper.js.svg?branch=master)](https://travis-ci.org/opengl-8080/gitgraphwrapper.js)

## What is this?
Simple [gitgraph.js](https://github.com/nicoespeon/gitgraph.js) wrapper that seemed more like a command line.

## Example
![example](./img/example.png)

If you draw an above graph with gitgraph.js as is, implementation is following.

```js
// gitgraph.js
var gitGraph = new GitGraph();

var master = gitGraph.branch('master');
master.commit().tag('v0.0.0');

var other = gitGraph.branch('other');
other.commit();

var topic = master.branch('topic');
topic.commit().commit().merge(master);

master.tag('v1.0.0');
```

Drawing same graph using this wrapper is following.

```js
// GitGraphWrapper
new GitGraphWrapper()
    .branch('master')
    .commit()
    .tag('v0.0.0')

    .branch('other')
    .commit()

    .checkout('master')
    .branch('topic')
    .commit()
    .commit()

    .checkout('master')
    .merge('topic')
    .tag('v1.0.0')
;
```

It looks like using git comamnd at command line.

Probably, you may execute git command like following  at actual command line. (`add` command is omitted.)

```bash
$ git checkout master

$ git commit ...

$ git tag v0.0.0

$ git checkout -b other

$ git commit ...

$ git checkout -b topic master

$ git commit ...

$ git commit ...

$ git checkout master

$ git merge topic

$ git tag v1.0.0
```

## Explanation
### GitGraphWrapper
`GitGraphWrapper` wraps `GitGraph` and provides api like using command line .

Basically each methods simply delegates to GitGraph's methods.  
Therefore you can pass same arguments that GitGraph method arguments to wrapper method.

### GitGraphWrapperExtention
GitGraphWrapper is simple wrapper for GitGraph.  
Method arguments is compatible with GitGraph's method arguments.

But unfortunately, as a result some operations are redundant.  
For example, to create a new branch 'topic' from 'master' if HEAD is not 'master', you must call `checkout("master")` and `branch("topic")`.

Usally you may execute git command as following.

```bash
$ git branch topic master
```

`GitGraphWrapperExtention` extends `GitGraphWrapper` and lets implementations like above.

Some method's argument are extended, so you need specify any some method's argument.  
But implementations will become to be similar to command line.

For example, like followings.

```js
// GitGraphWrapperExtention
new GitGraphWrapperExtention()
    .branch('master')
    .commit()
    .tag('v0.0.0')

    .branch('other')
    .commit()
    
    .branch('topic', 'master')
    .commit()
    .commit()

    .checkout('master')
    .merge('topic')
    .tag('v1.0.0')
;
```

More details are [usage.html](usage/usage.html) and [usage.js](usage/usage.js), or following method references.

#### Methods
##### defaultOptions()
```js
wrapper.defaultOptions({
    branch: {
        master: {
            color: 'red',
            commitDefaultOptions: {
                color: 'red'
            }
        }
    }
});
```

You can define default `branch()` method's arguments.

Using this method, implementations calling `branch()` method are keeped to clean.

Please define default options for each branches.  
An option's structure is `branch.<branch_name>.<default_options>`.

##### branch()
```js
wrapper.branch('new_branch', 'start_branch');
```

The first argument is same as `branch()` method's argument at `GirGraph`.

The second argument specifies start branch to create new branch.


-----

## これはなに？
[gitgraph.js](https://github.com/nicoespeon/gitgraph.js) をラップして、よりコマンドに近い形で実装できるようにしたものです。

## 例
![example](./img/example.png)

例えば上のようなグラフを描こうとした場合、 girgraph.js をそのまま使うと次のようになります。

```js
// gitgraph.js
var gitGraph = new GitGraph();

var master = gitGraph.branch('master');
master.commit().tag('v0.0.0');

var other = gitGraph.branch('other');
other.commit();

var topic = master.branch('topic');
topic.commit().commit().merge(master);

master.tag('v1.0.0');
```

同じグラフを、このラッパーを使って書くと次のようになります。

```js
// GitGraphWrapper
new GitGraphWrapper()
    .branch('master')
    .commit()
    .tag('v0.0.0')

    .branch('other')
    .commit()

    .checkout('master')
    .branch('topic')
    .commit()
    .commit()

    .checkout('master')
    .merge('topic')
    .tag('v1.0.0')
;
```

より、コマンドラインで git コマンドを実行しているときに近い形になったかと思います。

ちなみに、実際にコマンドラインで同じことをすると、次のようになるでしょう（`add` などは省略しています）。

```bash
$ git checkout master

$ git commit ...

$ git tag v0.0.0

$ git checkout -b other

$ git commit ...

$ git checkout -b topic master

$ git commit ...

$ git commit ...

$ git checkout master

$ git merge topic

$ git tag v1.0.0
```

## 説明
### GitGraphWrapper
`GitGraphWrapper` は、 `GitGraph` をラップしてコマンドラインでコマンドを入力しているかのような API を提供します。

各メソッドは、基本的に単純に `GitGraph` に処理を委譲しています。  
このため、メソッドの引数には `GitGraph` の同名のメソッドと同じものが渡せます。

### GitGraphWrapperExtention
`GitGraphWrapper` は、 `GitGraph` の単純なラッパーです。  
メソッドの引数は、基本的に `GitGraph` のメソッドと互換性を持つようにしています。

しかし、その結果として一部の操作が冗長になっています。  
たとえば、 HEAD が 'master' ではない状態で 'master' から 'topic' ブランチを作成しようと思うと、 `chekcout("master")` をしてから `branch("topic")` をしなければなりません。

普通、コマンドラインでそのような操作をするときは `git branch topic master` とすると思います。

`GitGraphWrapperExtention` は、 `GitGraphWrapper` を拡張して似たようなことをできるようにします。

引数は一部拡張されており、 `GitGraph` にはない引数を指定する必要はありますが、よりコマンドラインに近い形で実装できるようになっています。

例えば、例に上げた実装は次のように実装できます。

```js
// GitGraphWrapperExtention
new GitGraphWrapperExtention()
    .branch('master')
    .commit()
    .tag('v0.0.0')

    .branch('other')
    .commit()
    
    .branch('topic', 'master')
    .commit()
    .commit()

    .checkout('master')
    .merge('topic')
    .tag('v1.0.0')
;
```

かなりコマンドラインでの実行に近い形になっているかと思います。

詳しくは [usage.html](usage/usage.html) と [usage.js](usage/usage.js) を見るか、以下のメソッドの説明を参照してください。

#### メソッドの説明
##### defaultOptions()
```js
wrapper.defaultOptions({
    branch: {
        master: {
            color: 'red',
            commitDefaultOptions: {
                color: 'red'
            }
        }
    }
});
```

`branch()` メソッドでブランチを作成したとき、デフォルトで指定するオプションを事前に定義しておくことができます。

これを使うことで、実際にブランチを作るコマンドをよりシンプルに保つことができるようになります。

オプションの構造は `branch.<ブランチ名>.<デフォルトオプション>` という形になります。

##### branch()
```js
wrapper.branch('new_branch', 'start_branch');
```

第一引数は `GitGraph` の `branch()` メソッドと同じです。

第二引数に、ブランチを作成するときの起点となるブランチを指定できます。

## Release Note
### English
- v1.1.0
    - Remove `"-b"` option from `checkout()` method. (#3)
    - Remove `orphanCheckout()` method. (#3)
- v1.0.0
    - first release

### 日本語
- V1.1.0
    - `checkout()` メソッドから `"-b"` オプションを削除 (#3)
    - `orphanCheckout()` メソッドを削除 (#3)
- v1.0.0
    - 初回リリース
