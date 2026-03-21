import { createHash } from 'crypto'
import { readdirSync, readFileSync, statSync, writeFileSync } from 'fs'
import { join } from 'path'

function getFiles(dir) {
  const files = []
  const entries = readdirSync(dir)

  for (const entry of entries) {
    const fullPath = join(dir, entry)
    const stat = statSync(fullPath)
    if (stat.isDirectory()) {
      files.push(...getFiles(fullPath))
    } else {
      files.push(fullPath)
    }
  }

  return files
}

function hashBuild(dir) {
  const hash = createHash('sha256')

  const files = getFiles(dir)

  for (const file of files) {
    hash.update(file.replace(dir, ''))
    hash.update(readFileSync(file))
  }

  return hash.digest('hex')
}

const srcDir = join(process.cwd(), 'src')
const publicDir = join(process.cwd(), 'public')
const version = hashBuild(srcDir)

const out = join(publicDir, 'app-version.json')
writeFileSync(
  out,
  JSON.stringify({ version, generated: new Date().toISOString() }),
)
