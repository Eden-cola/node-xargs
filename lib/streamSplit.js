/**
 * StreamSplit
 * @auther eden_cola
 * @email eden_cola@aliyun.com
 */
"use strict"
const { Duplex } = require('stream');
const forEach = Array.prototype.forEach;

/**
 * StreamSplit是一个双工流，接收标准的buffer stream 输入，按separators中设置的分隔符划分后输出给下游
 *
 * Examples:
 *   const ss = new StreamSplit([
 *     0x20, 0x0a
 *   ]);
 *   ss.on('data', (data) => {
 *     console.log(`data: ${data}`);
 *   })
 *   ss.write(Buffer.from('123 456 789\n'));
 *   // => data: 123
 *   // => data: 456
 *   // => data: 789
 *
 * @param {Array} separators
 */
class StreamSplit extends Duplex {
  constructor (separators) {
    super();
    this.separators = separators;
    this.buffer = Buffer.alloc(0);
  }


  /**
   * 将数据写入缓冲区
   *
   * @private
   * @param {Buffer} chunk:
   */
  bufferAppend (chunk) {
    let length = this.buffer.length + chunk.length;
    this.buffer = Buffer.concat([this.buffer, chunk], length);
  }

  /**
   * 将缓冲区的数据发给下游
   *
   * @private
   */
  bufferFlush () {
    this.push(this.buffer);
    this.buffer = Buffer.alloc(0);
  }

  _write (chunk, encoding, cb) {
    let charArr = [];
    forEach.call(chunk, (char) => {
      //如果当前字符不存在于separators列表中
      //则将该字符追加到cahrArr中
      if (this.separators.every(sep => sep != char)) {
        charArr.push(char);
      } else {
        this.bufferAppend(Buffer.from(charArr));
        this.bufferFlush();
        charArr = [];
      }
    });
    process.nextTick(cb);
  }

  _read (size) {
  }

  _final (cb) {
    this.bufferFlush();
    process.nextTick(cb);
    this.emit('end');
  }
}

module.exports = StreamSplit;
