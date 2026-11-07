const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/lib/nationwideZonesExtra.ts');
let code = fs.readFileSync(file, 'utf8');

const lines = code.split('\n');
const idx = lines.findIndex(l => l.includes('namyangju-dasan'));
console.log('Target line index:', idx + 1);

if (idx !== -1) {
  let start = idx;
  while (start > 0 && !lines[start].trim().startsWith('{')) start--;

  let braceCount = 0;
  let end = start;
  for (let i = start; i < lines.length; i++) {
    const line = lines[i];
    for (const ch of line) {
      if (ch === '{') braceCount++;
      if (ch === '}') braceCount--;
    }
    if (braceCount === 0) {
      end = i;
      break;
    }
  }

  console.log('Removing lines from', start + 1, 'to', end + 1);
  console.log('Start line:', lines[start]);
  console.log('End line:', lines[end]);

  // splice
  lines.splice(start, (end - start + 1));

  // 만약 삭제 후 이전 줄의 마지막 콤마나 다음 줄의 문법 맞추기
  fs.writeFileSync(file, lines.join('\n'), 'utf8');
  console.log('Successfully removed namyangju-dasan from nationwideZonesExtra.ts!');
}
