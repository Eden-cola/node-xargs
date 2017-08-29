#!/usr/bin/env node
/**
 * node-xargs
 * @auther eden_cola
 * @email eden_cola@aliyun.com
 */

"use strict"

const WorkerManager = require('./lib/workerManager');
const StreamSplit = require('./lib/streamSplit');
const ArgsParser = require('./lib/argsParser');
const ArgGroup = require('./lib/argGroup');

//去除argv中的node和js文件
const argv = process.argv.slice(2);
//解析args
const args = new ArgsParser(argv);

//基于换行符和空格进行分组
const NEWLINE = 0x0a; //\n
const SPACE = 0x20; //space
const streamSplit = new StreamSplit([NEWLINE, SPACE]);

//参数分组
const argGroup = new ArgGroup(args.getMaxArgs());

//设置指令和参数
const workerManager = new WorkerManager({
  command : args.getCommand(),//指令
  args : args.getArgs(),//执行时携带的参数
  maxProcs : args.getMaxProcs()//最大并发进程数
});

//如果指令发生了异常，则将exitCode设为123
workerManager.on('workerError', ()=>{
  //123: any invocation exited with a non-zero status 
  process.exitCode = 123;
})

//node版本低于8时，手动处理末尾数据
if (process.version.split('.').unshift() < 8) {   
  process.stdin.on('end', () => {
    streamSplit.flush();
  })
  streamSplit.on('end', () => {
    argGroup.flush();
  })
}

process.stdin
  .pipe(streamSplit)//划分
  .pipe(argGroup)//分组
  .pipe(workerManager)//执行
  .pipe(process.stdout);//输出
