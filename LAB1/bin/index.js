#!/usr/bin/env node
import { program } from "commander";
import { showMainMenu } from "../src/quizFunctions.js";

showMainMenu();
program.parse(process.argv);
