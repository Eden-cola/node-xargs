/**
 * WorkerManager
 * @auther eden_cola
 * @email eden_cola@aliyun.com
 */
"use strict"
const { Duplex } = require('stream');
const { spawn } = require('child_process');

/**
 * WorkerManager是一个双工流，接收需要执行的参数作为input，执行结果作为output
 *
 * Examples:
 *    const WorkerManager = require('../lib/workerManager');
 *    const wm = new WorkerManager({
 *      command: 'date',
 *      args: ['-u']
 *    });
 *    wm.on('data', (data)=>{
 *      console.log(`date: ${data}`);
 *    });
 *    wm.write(['+%Y-%m-%d']); // => date: 2017-08-28
 *
 * @param {Object} options:
 *  command:
 *    type: String
 *    default: 'echo'
 *    description: 将要执行的指令
 *  args:
 *    type: StringArray
 *    default: []
 *    description: 指令携带的args
 *  maxProcs:
 *    type: StringArray
 *    default: 0
 *    description: 最大并发进程数，为0时不限制最大并发数
 *
 * Event:
 *  workerError: 有指令的返回状态码不为0
 */
class WorkerManager extends Duplex {
  constructor (options) {
    super({
      objectMode:true
    });
    this.command = options.command || 'echo';
    this.args = options.args || [];
    this.maxProcs = options.maxProcs;
    if (typeof(options.maxProcs) == 'undefined')
      this.maxProcs = 1;
    this.procs = 0;
  }

  /**
   * 如果还未达到最大进程数限制，则新建进程执行input，否则等待下次机会
   *
   * @private
   * @param {StringArray} input:
   */
  waitOrCreateWorker (input) {
    if (this.maxProcs == 0)
      return this.createWorker(input);
    if (this.procs < this.maxProcs)
      return this.createWorker(input);
    this.wait(input);
  }

  /**
   * 下次workerClose事件时再尝试执行此次input
   *
   * @private
   * @param {StringArray} input:
   */
  wait (input) {
      this.once('workerClose', () => {
        this.waitOrCreateWorker(input);
      });
  }

  /**
   * 将input作为参数新建worker执行，并输出到下游stream，执行完成后触发workerClose事件
   *
   * @private
   * @param {StringArray} input:
   */
  createWorker (input) {
    this.procs++;
    const worker = spawn(this.command, [...this.args, ...input]);
    worker.stdout.on('data', (data) => {
      this.push(data);
    });
    worker.stderr.on('data', (data) => {
      this.emit('workerError');
      this.push(data);
    });
    worker.on('close', () => {
      this.procs--;
      this.emit('workerClose');
    })
  }

  _write (chunk, encoding, cb) {
    this.waitOrCreateWorker(chunk);
    process.nextTick(cb);
  }

  _read (size) {
  }

  _final (cb) {
    this.waitOrCreateWorker(this.input);
    this.input = [];
    process.nextTick(cb)
  }
}

module.exports = WorkerManager;
