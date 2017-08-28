/**
 * TestStreamSplit
 * @auther eden_cola
 * @email eden_cola@aliyun.com
 */
"use strict"

const StreamSplit = require('../lib/streamSplit');
const ss = new StreamSplit([
  0x20 /*space*/, 0x0a /*\n*/
]);
ss.on('data', (data) => {
  console.log(`data: ${data}`);
})
ss.write(Buffer.from('123 456 789\n'));
// => data: 123
// => data: 456
// => data: 789

