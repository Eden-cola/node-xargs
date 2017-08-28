"use strict"
const { Duplex } = require('stream');

/**
 * @param {String} option
 * @return boolean
 */
function isInt (value) {
  return parseInt(value) == value;
}

class ArgsParser extends Duplex {
  constructor (argv) {
    super();
    this.command = 'echo';
    this.args = [];
    this.maxArgs = 1;
    this.maxProcs = 0;
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

  getMaxArgs () {
    return this.maxArgs;
  }

  getMaxProcs () {
    return this.maxProcs;
  }

  error (info) {
    console.log(info);
    process.exit(-1);
  }
}

module.exports = ArgsParser;
