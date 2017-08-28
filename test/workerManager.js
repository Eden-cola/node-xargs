/**
 * TestWorkerManager
 * @auther eden_cola
 * @email eden_cola@aliyun.com
 */
"use strict"

const WorkerManager = require('../lib/workerManager');
const wm = new WorkerManager({
  command: 'date',
  args: ['-u']
});
wm.on('data', (data)=>{
  console.log(`date: ${data}`);
});
wm.write(['+%Y-%m-%d']); // => date: 2017-08-28
