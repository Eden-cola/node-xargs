#!/usr/bin/env node

"use strict"

const Xargs = require('./xargs');
const StreamSplit = require('./streamSplit');
const ArgsParser = require('./argsParser');
const ArgGroup = require('./argGroup');

const NEWLINE = 0x0a; //\n
const SPACE = 0x20; //space
const streamSplit = new StreamSplit([NEWLINE, SPACE]);

const argv = process.argv.slice(2);
const args = new ArgsParser(argv);

//arg分组
const argGroup = new ArgGroup(args.getMaxArgs());

const xargs = new Xargs(argv);

//console.log('execArgv',process.execArgv);
//console.log('argv', argv);

//process.stdin.setEncoding('utf8');

process.stdin
  .pipe(streamSplit)
  .pipe(argGroup)
  .pipe(xargs)
  .pipe(process.stdout);
