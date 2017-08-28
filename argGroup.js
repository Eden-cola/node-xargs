"use strict"
const { Duplex } = require('stream');

class ArgGroup extends Duplex {
  constructor (maxArgs) {
    super({
      objectMode:true
    });
    this.input = [];
    this.maxArgs = maxArgs;
  }

  appendInput (arg) {
    this.input.push(arg);
    if (this.input.length == this.maxArgs) {
      this.push(this.input);
      this.input = [];
    }
  }

  _write (chunk, encoding, cb) {
    this.appendInput(chunk.toString());
    process.nextTick(cb);
  }

  _read (size) {
  }

  _final (cb) {
    this.push(this.input);
    this.input = [];
    process.nextTick(cb)
  }
}

module.exports = ArgGroup;
