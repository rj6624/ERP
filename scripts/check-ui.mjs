import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import ts from 'typescript';

// Guard the shared component boundary without depending on visual snapshots.
const violations = [];
let files = 0;
let controls = 0;
function scan(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) { scan(path); continue; }
    if (!path.endsWith('.tsx')) continue;
    files++;
    const source = ts.createSourceFile(path, readFileSync(path, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    function visit(node) {
      if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
        const tag = node.tagName.getText(source);
        const primitive = path.endsWith(join('ui', 'Primitives.tsx'));
        const dialog = path.endsWith(join('ui', 'DialogSurface.tsx'));
        const attrs = node.attributes.properties;
        const hasDialogRole = attrs.some(a => ts.isJsxAttribute(a) && a.name.getText(source) === 'role' && a.initializer && ts.isStringLiteral(a.initializer) && a.initializer.text === 'dialog');
        if (['Button', 'Input', 'Select', 'Textarea', 'Card', 'TabButton', 'Badge', 'DialogSurface'].includes(tag)) controls++;
        if ((!primitive && ['button', 'input', 'select', 'textarea'].includes(tag)) || (!dialog && hasDialogRole && tag !== 'DialogSurface')) {
          const { line } = source.getLineAndCharacterOfPosition(node.getStart(source));
          violations.push(`${relative(process.cwd(), path)}:${line + 1}: use a shared UI primitive for <${tag}>`);
        }
      }
      ts.forEachChild(node, visit);
    }
    visit(source);
  }
}
scan('src');
if (violations.length) { console.error(violations.join('\n')); process.exitCode = 1; }
else console.log(`UI boundary check passed: ${files} TSX files, ${controls} shared component usages.`);
