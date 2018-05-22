#!/usr/bin/env node

import { CLI, Shim } from "clime";
import * as Path from "path";

const cli = new CLI("translation-io-sync", Path.join(__dirname, "commands"));

const shim = new Shim(cli);
shim.execute(process.argv);
