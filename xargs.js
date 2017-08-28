"use strict"
const { Duplex } = require('stream');
const { spawn } = require('child_process');

/**
 * @param {String} option
 * @return boolean
 */
function isInt (value) {
  return parseInt(value) == value;
}

class Xargs extends Duplex {
  constructor (argv) {
    super({
      objectMode:true
    });
    this.command = 'echo';
    this.args = [];
    this.maxArgs = 1;
    this.maxProcs = 0;
    this.input = [];
    this.procs = 0;
    this.setExecAndArgs(argv);
  }

  setExecAndArgs (args) {
    if (args.length == 0)
      return;
    const arg = args.shift();
    if (arg == '-n') {
      return this.setMaxArgs(arg, args);
    } else if (arg == '-P'){
      return this.setMaxProcs(arg, args);
    }
    this.command = arg;
    this.args = args;
  }

  /**
   * @param {String} option
   * @return null
   */
  setMaxArgs (option, args) {
    let value = args.shift();
    if (!isInt(value))
      this.error (`xargs: invalid number for ${option} option`);
    value = parseInt(value);
    if (value < 1)
      this.error (`xargs: value for ${option} option should be >= 1`);
    this.maxArgs = value;
    return this.setExecAndArgs(args)
  }

  /**
   * @param {String} option
   * @return null
   */
  setMaxProcs (option, args) {
    let value = args.shift();
    if (!isInt(value))
      error (`xargs: invalid number for ${option} option`);
    value = parseInt(value);
    if (value < 0)
      this.error (`xargs: value for ${option} option should be >= 0`);
    this.maxProcs = value;
    return this.setExecAndArgs(args)
  }

  error (info) {
    console.log(info);
    process.exit(-1);
  }

  createWorker (input) {
    if (this.maxProcs && this.procs == this.maxProcs) {
      this.once('workerClose', () => {
        this.createWorker(input);
      });
      return ;
    }
    this.procs++;
    const worker = spawn(this.command,
      [...this.args, ...input]);
    worker.stdout.on('data', (data) => {
      this.push(data);
    });
    worker.stderr.on('data', (data) => {
      this.push(data);
    });
    worker.on('close', () => {
      this.procs--;
      this.emit('workerClose');
    })
  }

  appendInput (arg) {
    this.input.push(arg);
    if (this.input.length == this.maxArgs) {
      this.createWorker(this.input);
      this.input = [];
    }
  }

  _write (chunk, encoding, cb) {
    console.log(chunk);
    this.appendInput(chunk.toString());
    process.nextTick(cb);
  }

  _read (size) {
  }

  _final (cb) {
    this.createWorker(this.input);
    this.input = [];
    process.nextTick(cb)
  }
}

module.exports = Xargs;
