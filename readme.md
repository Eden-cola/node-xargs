

##测试用例：

####test1:
```
echo {0..2}|./xargs
```
不指定command的时候，默认为echo
期望输出：
```
0
1
2
```

####test2:
```
./index.js -n a echo
./index.js -P a echo
$?
```
-n或者-P后的参数不为数字时，提示用户，并使exitCode=1
期望输出：
```
xargs: invalid number for -n option
xargs: invalid number for -P option
1: command not found
```

####test3:
```
./index.js -z echo
./index.js --z echo
$?
```
使用未定义的option时，提示用户，并使exitCode=1
期望输出：
```
xargs: invalid option '-z'
1: command not found
```

####test4:
```
echo {0..1}|./xargs ls
$?
```
进程error时，输出错误信息，并使exitCode=123
期望输出：
```
ls: cannot access 0: No such file or directory
ls: cannot access 1: No such file or directory
123: command not found
```

####test5:
```
echo {0..3}|./xargs -n 2 echo
```
输入参数总数可以被n整除时,可以正常工作
期望输出：
```
0 1
2 3
```

####test6:
```
echo {0..2}|./xargs -n 2 echo
```
输入参数总数不可以被n整除时,可以正常工作
期望输出：
```
0 1
2
```

####test7:
```
echo {0..2}|./xargs -n 2 echo
```
输入参数总数不可以被n整除时,可以正常工作
期望输出：
```
0 1
2
```

####test8:
```
echo {0..3}|./xargs -P 2 sh -c "sleep 1 && echo done"
```
设置-P之后，同时最多只会并发P个进程
期望输出：每秒输出一组"done", 每组P个

####test9:
```
ls ./lib/*.js |./xargs -n 2 -P 2 wc -l
```
设置-P之后，并发进程输出也会作为流并发写入到stdout
期望输出：
```
  82 ./lib/streamSplit.js
 113 ./lib/workerManager.js
  73 ./lib/argGroup.js
 145 ./lib/argsParser.js
 218 total
 195 total
```

####test10:
```
ls ./lib/*.js |./xargs -n 2 wc -l
```
不设置-P时，最大并发进程数默认为1，各进程不会并发执行
期望输出：
```
  73 ./lib/argGroup.js
 145 ./lib/argsParser.js
 218 total
  82 ./lib/streamSplit.js
 113 ./lib/workerManager.js
 195 total
```

####test11:
```
ls ./lib/*.js |./xargs -n 2 -P 0 wc -l
```
-P设为0时，所有进程会全部并发执行
期望输出：
```
  82 ./lib/streamSplit.js
 113 ./lib/workerManager.js
  73 ./lib/argGroup.js
 145 ./lib/argsParser.js
 218 total
 195 total
```

####test12:
```
echo {0..3}|./xargs -n 1 -n 3 -n 2 echo
```
option被重复设置后，以最后一次设置的为准
期望输出：
```
0 1
2 3
```
 
##花费时间
**6h**

##已知bug和可优化的地方

* 传入参数只支持 -P {maxProcs} 的方式，而builtin的xargs还支持 -P{maxProcs} 和 --maxPorcs={maxProcs} 两种写法
* workerManager目前对 -P 的实现是，如果已经到达最大进程数，则等待workerClose事件式再次尝试，数据量大的情况下会导致监听workerClose的回调函数过多，添加一个队列可以解决问题

