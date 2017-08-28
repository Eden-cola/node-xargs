/**
 * TestArgsParser
 * @auther eden_cola
 * @email eden_cola@aliyun.com
 */
"use strict"

const ArgsParser = require('../lib/argsParser');
const ap = new ArgsParser([
  '-n', '3', '-P', '5', 'ws', '-l'
]);
console.log(ap.getMaxArgs()); // => 3
console.log(ap.getMaxProcs()); // => 5
console.log(ap.getCommand()); // => ws
console.log(ap.getArgs()); // => ['-l']

