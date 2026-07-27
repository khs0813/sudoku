import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const dataUrl = new URL('../public/data/sudoku.json', import.meta.url);
const data = JSON.parse(await readFile(dataUrl, 'utf8'));

const difficulties = {
  easy: { expectedCount: 20, minClues: 39, maxClues: 45 },
  medium: { expectedCount: 20, minClues: 32, maxClues: 36 },
  hard: { expectedCount: 20, minClues: 26, maxClues: 30 }
};

const allMask = 0b1111111110;
const rowOf = (index) => Math.floor(index / 9);
const colOf = (index) => index % 9;
const boxOf = (index) => Math.floor(rowOf(index) / 3) * 3 + Math.floor(colOf(index) / 3);

function assertValidSolvedGrid(solution, label) {
  assert.match(solution, /^[1-9]{81}$/, `${label}: solution must be 81 digits from 1 to 9`);

  const sortedDigits = '123456789';
  const assertUnit = (values, unitLabel) => {
    assert.equal([...values].sort().join(''), sortedDigits, `${label}: invalid ${unitLabel}`);
  };

  for (let row = 0; row < 9; row += 1) {
    assertUnit(solution.slice(row * 9, row * 9 + 9), `row ${row + 1}`);
  }

  for (let col = 0; col < 9; col += 1) {
    let values = '';
    for (let row = 0; row < 9; row += 1) values += solution[row * 9 + col];
    assertUnit(values, `column ${col + 1}`);
  }

  for (let box = 0; box < 9; box += 1) {
    let values = '';
    const startRow = Math.floor(box / 3) * 3;
    const startCol = (box % 3) * 3;
    for (let row = startRow; row < startRow + 3; row += 1) {
      for (let col = startCol; col < startCol + 3; col += 1) values += solution[row * 9 + col];
    }
    assertUnit(values, `box ${box + 1}`);
  }
}

function countSolutions(puzzle, limit = 2) {
  const board = [...puzzle].map(Number);
  const rowMasks = Array(9).fill(0);
  const colMasks = Array(9).fill(0);
  const boxMasks = Array(9).fill(0);

  for (let index = 0; index < board.length; index += 1) {
    const value = board[index];
    if (!value) continue;
    const bit = 1 << value;
    const row = rowOf(index);
    const col = colOf(index);
    const box = boxOf(index);
    if ((rowMasks[row] & bit) || (colMasks[col] & bit) || (boxMasks[box] & bit)) return 0;
    rowMasks[row] |= bit;
    colMasks[col] |= bit;
    boxMasks[box] |= bit;
  }

  let solutions = 0;

  const solve = () => {
    if (solutions >= limit) return;

    let bestIndex = -1;
    let bestMask = 0;
    let bestCount = 10;

    for (let index = 0; index < board.length; index += 1) {
      if (board[index]) continue;
      const used = rowMasks[rowOf(index)] | colMasks[colOf(index)] | boxMasks[boxOf(index)];
      const mask = (~used) & allMask;
      const count = mask.toString(2).replaceAll('0', '').length;
      if (count === 0) return;
      if (count < bestCount) {
        bestIndex = index;
        bestMask = mask;
        bestCount = count;
        if (count === 1) break;
      }
    }

    if (bestIndex === -1) {
      solutions += 1;
      return;
    }

    const row = rowOf(bestIndex);
    const col = colOf(bestIndex);
    const box = boxOf(bestIndex);
    for (let value = 1; value <= 9; value += 1) {
      const bit = 1 << value;
      if (!(bestMask & bit)) continue;
      board[bestIndex] = value;
      rowMasks[row] |= bit;
      colMasks[col] |= bit;
      boxMasks[box] |= bit;
      solve();
      rowMasks[row] ^= bit;
      colMasks[col] ^= bit;
      boxMasks[box] ^= bit;
      board[bestIndex] = 0;
      if (solutions >= limit) return;
    }
  };

  solve();
  return solutions;
}

function hashText(text) {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function chooseDailyPuzzle(dateKey) {
  const order = ['easy', 'medium', 'hard'];
  const difficulty = order[hashText(`sudokuday:${dateKey}:difficulty`) % order.length];
  const list = data[difficulty];
  const puzzle = list[hashText(`sudokuday:${dateKey}:${difficulty}`) % list.length];
  return { difficulty, puzzleId: puzzle.id };
}

const seenIds = new Set();
let puzzleCount = 0;

for (const [difficulty, rules] of Object.entries(difficulties)) {
  const list = data[difficulty];
  assert.ok(Array.isArray(list), `${difficulty}: must be an array`);
  assert.equal(list.length, rules.expectedCount, `${difficulty}: unexpected puzzle count`);

  for (const item of list) {
    const label = `${difficulty}/${item.id}`;
    assert.match(item.id, new RegExp(`^${difficulty}-\\d{2}$`), `${label}: id must match difficulty`);
    assert.equal(seenIds.has(item.id), false, `${label}: duplicate id`);
    seenIds.add(item.id);

    assert.match(item.puzzle, /^[0-9]{81}$/, `${label}: puzzle must be 81 digits from 0 to 9`);
    assertValidSolvedGrid(item.solution, label);

    const clues = [...item.puzzle].filter((value) => value !== '0').length;
    assert.equal(item.clues, clues, `${label}: clues field must match puzzle`);
    assert.ok(clues >= rules.minClues && clues <= rules.maxClues, `${label}: clue count outside ${difficulty} range`);

    for (let index = 0; index < 81; index += 1) {
      if (item.puzzle[index] !== '0') {
        assert.equal(item.puzzle[index], item.solution[index], `${label}: clue does not match solution at ${index}`);
      }
    }

    assert.equal(countSolutions(item.puzzle), 1, `${label}: puzzle must have exactly one solution`);
    puzzleCount += 1;
  }
}

const dateStart = Date.UTC(2026, 0, 1);
const dailyDifficulties = new Set();
for (let offset = 0; offset < 366; offset += 1) {
  const dateKey = new Date(dateStart + offset * 86400000).toISOString().slice(0, 10);
  const first = chooseDailyPuzzle(dateKey);
  const second = chooseDailyPuzzle(dateKey);
  assert.deepEqual(second, first, `daily puzzle must be deterministic for ${dateKey}`);
  assert.ok(data[first.difficulty].some((item) => item.id === first.puzzleId), `daily puzzle must exist for ${dateKey}`);
  dailyDifficulties.add(first.difficulty);
}
assert.deepEqual([...dailyDifficulties].sort(), Object.keys(difficulties).sort(), 'daily rotation should include every difficulty');

console.log(`Validated ${puzzleCount} puzzles and 366 deterministic daily selections.`);
