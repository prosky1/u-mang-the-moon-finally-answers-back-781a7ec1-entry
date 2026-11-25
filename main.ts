// The Moon Finally Answers Back — entrypoint.
//
// The Moon answers everyone who has ever stared up at it, wished on it,
// howled at it, or made it a late-night promise. This program writes that
// one-line answer to /output/entry.txt, after running the sealed gate
// checks from RULES.txt: 1 to 240 characters of UTF-8 text, exactly one
// line, no leading or trailing whitespace.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const MOON_ANSWER =
  "I control your oceans, your months, and your werewolves. You control the remote. Fair trade.";

const GATE = {
  minChars: 1,
  maxChars: 240,
  destination: "/output/entry.txt",
} as const;

const ASCII_ONLY = /^[\x00-\x7F]*$/;
const LINE_BREAK = /[\r\n]/;
const CONTROL_CHAR = /[\x00-\x1F\x7F]/;

// Collect every gate violation first, then fail once with the full list,
// so a bad line reports all of its problems instead of just the first.
function collectProblems(line: string): string[] {
  const problems: string[] = [];

  if (line.length < GATE.minChars || line.length > GATE.maxChars) {
    problems.push(
      `length ${line.length} is outside the ${GATE.minChars}-${GATE.maxChars} character window`,
    );
  }
  if (line.trim().length === 0) {
    problems.push("line is blank");
  }
  if (LINE_BREAK.test(line)) {
    problems.push("line contains a line break");
  }
  if (line !== line.trim()) {
    problems.push("line starts or ends with whitespace");
  }
  if (CONTROL_CHAR.test(line)) {
    problems.push("line contains a control character");
  }
  if (!ASCII_ONLY.test(line)) {
    problems.push("line contains non-ASCII characters");
  }
  return problems;
}

function run(): void {
  const problems = collectProblems(MOON_ANSWER);
  if (problems.length > 0) {
    throw new Error(`entry rejected by the gate: ${problems.join("; ")}`);
  }

  mkdirSync(dirname(GATE.destination), { recursive: true });
  writeFileSync(GATE.destination, MOON_ANSWER, "utf-8");

  const onDisk = readFileSync(GATE.destination, "utf-8");
  if (onDisk !== MOON_ANSWER) {
    throw new Error("round-trip check failed: file content differs from the entry");
  }
  console.log(`wrote ${MOON_ANSWER.length} characters to ${GATE.destination}`);
}

run();
