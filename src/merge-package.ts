import * as fs from 'fs'
import * as core from '@actions/core'

const dependencyKeys = [
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'optionalDependencies'
]

export default function mergePackage(project: string, shell: string): any {
  const projectJson = JSON.parse(fs.readFileSync(project, {encoding: 'utf8'}))
  const shellJson = JSON.parse(fs.readFileSync(shell, {encoding: 'utf8'}))
  core.startGroup('merge package.json')
  core.debug(`project: ${project}`)
  core.debug(`shell: ${shell}`)
  // merge dependencies
  for (const dependencyKey of dependencyKeys) {
    const dependencies = shellJson[dependencyKey]
      ? Object.keys(shellJson[dependencyKey])
      : []
    for (const d of dependencies) {
      if (!projectJson[dependencyKey]) {
        projectJson[dependencyKey] = {}
      }

      if (!projectJson[dependencyKey][d] && shellJson[dependencyKey][d]) {
        projectJson[dependencyKey][d] = shellJson[dependencyKey][d]
      }
    }
  }
  core.debug(JSON.stringify(projectJson))
  core.endGroup()
  return projectJson
}
