/**
 * TestArgGroup
 * @auther eden_cola
 * @email eden_cola@aliyun.com
 */
"use strict"

const ArgGroup = require('../lib/argGroup');
const ag = new ArgGroup(2);
ag.on('data', (data) => {
  console.log(data);
})
ag.write(Buffer.from('foo'));
ag.write(Buffer.from('bar'));
// => ['foo', 'bar']

ag.write(Buffer.from('node'));
ag.write(Buffer.from('js'));
// => ['node', 'js']

