#!/usr/bin/env node
import { setupProgram } from './cli/program.js';
import { run } from './cli/runner.js';

const program = setupProgram();
run(program.opts());