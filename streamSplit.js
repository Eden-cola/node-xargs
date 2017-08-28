"use strict"
const { Duplex } = require('stream');
const forEach = Array.prototype.forEach;

class StreamSplit extends Duplex {
  /**
   * @param {array} separators
   */
  constructor (separators, options = {}) {
    super(options);
    this.separators = separators;
    this.buffer = Buffer.alloc(0);
  }

  bufferAppend (chunk) {
    let length = this.buffer.length + chunk.length;
    this.buffer = Buffer.concat([this.buffer, chunk], length);
  }

  queueAdd () {
    this.push(this.buffer);
    this.buffer = Buffer.alloc(0);
  }

  _write (chunk, encoding, cb) {
    let charArr = [];
    forEach.call(chunk, (char) => {
      if (!this.separators.some(sep => sep == char)) {
        charArr.push(char);
      } else {
        this.bufferAppend(Buffer.from(charArr));
        this.queueAdd();
        charArr = [];
      }
    })
    process.nextTick(cb);
  }

  _read (size) {
  }

  _final (cb) {
    this.queueAdd();
    process.nextTick(cb);
    this.emit('end');
  }
}

module.exports = StreamSplit;
