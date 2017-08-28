/**
 * StreamSplit
 * @auther eden_cola
 * @email eden_cola@aliyun.com
 */
"use strict"
const { Duplex } = require('stream');

/**
 * ArgGroup是一个双工流，接收划分好的buffer stream 输入，按maxArgs参数分组并转成__StringArray__后输出给下游
 *
 * Examples:
 *     const ag = new ArgGroup(2);
 *     ag.on('data', (data) => {
 *       console.log(data);
 *     })
 *     ag.write(Buffer.from('foo'));
 *     ag.write(Buffer.from('bar'));
 *     // => ['foo', 'bar']
 *     ag.write(Buffer.from('node'));
 *     ag.write(Buffer.from('js'));
 *     // => ['node', 'js']
 *
 * @param {Number} maxArgs
 */
class ArgGroup extends Duplex {
  constructor (maxArgs) {
    super({
      objectMode:true
    });
    this.buffer = [];
    this.maxArgs = maxArgs;
  }

  /**
   * 将arg写入缓冲区，如果缓冲区长度已到达maxArgs，则输出给下游
   *
   * @private
   * @param {string} arg:
   */
  bufferAppend (arg) {
    this.buffer.push(arg);
    if (this.buffer.length == this.maxArgs) {
      this.bufferFlush();
    }
  }

  /**
   * 将缓冲区中数据输出给下游，并清空缓冲区
   *
   * @private
   */
  bufferFlush () {
    this.push(this.buffer);
    this.buffer = [];
  }

  _write (chunk, encoding, cb) {
    this.bufferAppend(chunk.toString());
    process.nextTick(cb);
  }

  _read (size) {
  }

  _final (cb) {
    if (this.buffer.length > 0)
      this.bufferFlush();
    process.nextTick(cb)
  }
}

module.exports = ArgGroup;
