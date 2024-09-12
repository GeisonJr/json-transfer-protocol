/* Dependencies */
import * as fs from 'node:fs'
import * as path from 'node:path'

/**
 * @description This function returns all files in a directory/subdirectories
 */
export function scanDirectory(dirname: string): path.ParsedPath[] {
  const files: path.ParsedPath[] = []

  // Read all files in the directory and subdirectories
  function recurse(dir: string): void {
    const dirFiles = fs.readdirSync(dir)

    for (const file of dirFiles) {
      const absolutePath = path.join(dir, file)
      const fsStats = fs.statSync(absolutePath)

      // If is a directory call the function again
      if (fsStats.isDirectory()) {
        recurse(absolutePath)
        continue
      }

      // If is a file add to the list
      files.push(path.parse(absolutePath))
    }
  }
  recurse(dirname)

  return files
}
