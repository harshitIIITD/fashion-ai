/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { rmSync, readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// Helper function to find files recursively without external dependencies
function findFiles(dir, pattern, results = []) {
  if (!existsSync(dir)) return results;

  try {
    const files = readdirSync(dir);
    for (const file of files) {
      const fullPath = join(dir, file);
      try {
        const stat = statSync(fullPath);
        if (stat.isDirectory()) {
          findFiles(fullPath, pattern, results);
        } else if (file.match(pattern)) {
          results.push(fullPath);
        }
      } catch (_e) {
        // Skip files we can't access
        continue;
      }
    }
  } catch (_e) {
    // Skip directories we can't access
  }

  return results;
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// remove npm install/build artifacts
rmSync(join(root, 'node_modules'), { recursive: true, force: true });
rmSync(join(root, 'bundle'), { recursive: true, force: true });
rmSync(join(root, 'packages/cli/src/generated/'), {
  recursive: true,
  force: true,
});
const RMRF_OPTIONS = { recursive: true, force: true };
rmSync(join(root, 'bundle'), RMRF_OPTIONS);

// Dynamically clean dist directories in all workspaces
const rootPackageJson = JSON.parse(
  readFileSync(join(root, 'package.json'), 'utf-8'),
);
for (const workspace of rootPackageJson.workspaces) {
  const packageJsonFiles = findFiles(join(root, workspace), /^package\.json$/);
  for (const pkgPath of packageJsonFiles) {
    const pkgDir = dirname(pkgPath);
    rmSync(join(pkgDir, 'dist'), RMRF_OPTIONS);
  }
}

// Clean up vsix files in vscode-ide-companion
const vsixFiles = findFiles(
  join(root, 'packages/vscode-ide-companion'),
  /\.vsix$/,
);
for (const vsixFile of vsixFiles) {
  rmSync(vsixFile, RMRF_OPTIONS);
}
