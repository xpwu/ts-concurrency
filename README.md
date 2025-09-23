# ts-concurrency
并发库，但不是线程库、协程库这类的并行运算库，并且该库不是线程安全的(对于web运用来说，大多数场景都是在单线程环境下运行)，
通过 Mutex, Timeout, Channel 等方式对开发中常遇到的**等待队列**进行了各场景下的封装。

## 0、代码库的引用
```
"dependencies": {
    "ts-concurrency": "github:xpwu/ts-concurrency#semver:^0.3.0",
  },
```
