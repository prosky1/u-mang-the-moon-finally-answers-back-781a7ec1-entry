// The Moon Finally Answers Back.
//
// Writes the Moon's one-line comeback to /output/entry.txt.
//
// The bounty asks for a single line of 1 to 240 characters, in the voice
// of the Moon answering everyone who has ever stared up at it, wished on
// it, howled at it, or made it a late-night promise. The program checks
// the line against the sealed gate (1 to 240 characters, not only white
// space, one line of UTF-8 text) before writing, then reads the file back
// to confirm the exact bytes on disk match the line it meant to submit.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const TEXT =
  "I control your oceans, your months, and your werewolves. You control the remote. Fair trade.";

const MIN_CHARS = 1;
const MAX_CHARS = 240;
const OUT_PATH = "/output/entry.txt";

function validate(text: string): void {
  if (text.trim().length === 0) {
    throw new Error("entry text must not be blank");
  }
  if (text.length < MIN_CHARS || text.length > MAX_CHARS) {
    throw new Error(
      `entry text is ${text.length} characters, must be 1 to ${MAX_CHARS}`,
    );
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry text must be a single line");
  }
  if (text !== text.trim()) {
    throw new Error("entry text must not start or end with whitespace");
  }
  // The gate counts characters, but the file must also be exact bytes:
  // a multi-byte character would make byte length differ from char length.
  if (Buffer.byteLength(text, "utf-8") !== text.length) {
    throw new Error("entry text must be plain ASCII, one byte per character");
  }
}

function main(): void {
  validate(TEXT);
  mkdirSync(dirname(OUT_PATH), { recursive: true });
  writeFileSync(OUT_PATH, TEXT, "utf-8");
  const written = readFileSync(OUT_PATH, "utf-8");
  if (written !== TEXT) {
    throw new Error("verification failed: file content differs from entry text");
  }
  console.log(`wrote ${TEXT.length} characters to ${OUT_PATH}`);
}

main();
