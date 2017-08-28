/**
 * ArgsParser
 * @auther eden_cola
 * @email eden_cola@aliyun.com
 */
"use strict"
/**
 * @param {String} value
 * @return boolean
 */
function isInt (value) {
  return parseInt(value) == value;
}

/**
 * ArgsParser用于将经过初步处理的argv处理成具体的args
 * 可支持:
 * -n {max_args}
 * -P {max_procs}
 *
 * Examples:
 *    const ap = new ArgsParser([
 *      '-n', '3', '-P', '5', 'ws', '-l'
 *    ]);
 *    console.log(ap.getMaxArgs()); // => 3
 *    console.log(ap.getMaxProcs()); // => 5
 *    console.log(ap.getCommand()); // => ws
 *    console.log(ap.getArgs()); // => ['-l']
 *
 * @param {StringArray} argv:
 */
class ArgsParser {
  constructor (argv) {
    this.command = 'echo';
    this.args = [];
    this.maxArgs = 0;
    this.maxProcs = 1;
    this.setExecAndArgs(argv);
  }

  /**
   * @private
   * @param {StringArray} args
   */
  setExecAndArgs (args) {
    if (args.length == 0)
      return;
    const arg = args.shift();
    if (/^-/.test(arg))
      return this.setOption(arg, args);
    this.command = arg;
    this.args = args;
  }

  /**
   * @private
   * @param {String} option
   * @param {StringArray} args
   */
  setOption (option, args) {
    if (option == '-n') {
      return this.setMaxArgs(option, args);
    } else if (option == '-P'){
      return this.setMaxProcs(option, args);
    } else {
      this.error (`xargs: invalid option '${option}'`);
    }
  }

  /**
   * @private
   * @param {String} option
   * @param {StringArray} args
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
   * @private
   * @param {String} option
   * @param {StringArray} args
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

  /**
   * @public
   * @return {Number} 最大参数数量
   */
  getMaxArgs () {
    return this.maxArgs;
  }

  /**
   * @public
   * @return {Number} 最大并发进程数
   */
  getMaxProcs () {
    return this.maxProcs;
  }

  /**
   * @public
   * @return {String} 需执行的指令
   */
  getCommand () {
    return this.command;
  }

  /**
   * @public
   * @return {StringArray} 执行时携带的参数
   */
  getArgs () {
    return this.args;
  }

  /**
   * 参数解析错误时，提示用户并结束当前程序
   * @private
   * @param {String} 提示信息
   */
  error (info) {
    console.log(info);
    process.exit(1);
  }
}

module.exports = ArgsParser;
