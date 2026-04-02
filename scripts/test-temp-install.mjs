#!/usr/bin/env node
// @ts-check

import os from 'node:os'
import path from 'node:path'
import fs from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')
const installerPath = path.join(repoRoot, 'bin', 'install-node-red.mjs')

/** Parse script options from process arguments.
 * @returns {{ keep: boolean, quiet: boolean }} Parsed options.
 */
const parseArgs = () => {
    const args = process.argv.slice(2)

    return {
        keep: args.includes('--keep'),
        quiet: args.includes('--quiet'),
    }
}

/** Run the installer CLI against a target folder.
 * @param {string} targetFolder Destination root for the install.
 * @param {boolean} quiet If true, suppress installer output.
 * @returns {Promise<number>} Exit code from installer process.
 */
const runInstaller = (targetFolder, quiet) => new Promise((resolve, reject) => {
    const child = spawn(
        process.execPath,
        [installerPath, '--folder', targetFolder, '--no-color'],
        {
            cwd: repoRoot,
            stdio: quiet ? 'pipe' : 'inherit',
        },
    )

    if (quiet) {
        child.stdout?.on('data', () => {})
        child.stderr?.on('data', () => {})
    }

    child.on('error', reject)
    child.on('close', (code) => {
        resolve(code ?? 1)
    })
})

/** Verify expected files from a successful install.
 * @param {string} targetFolder Destination root for the install.
 * @returns {Promise<string[]>} Missing file list.
 */
const verifyInstall = async (targetFolder) => {
    const expected = [
        path.join(targetFolder, 'package.json'),
        path.join(targetFolder, 'data', 'package.json'),
        path.join(targetFolder, 'data', 'settings.js'),
        path.join(targetFolder, 'system', 'node-red.service'),
    ]

    const checks = await Promise.all(expected.map(async (filePath) => {
        try {
            await fs.access(filePath)
            return null
        } catch {
            return filePath
        }
    }))

    return checks.filter((f) => f !== null)
}

/** Run a cross-platform smoke test in a temp directory.
 * @returns {Promise<void>}
 */
const main = async () => {
    const { keep, quiet } = parseArgs()

    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'alt-nr-installer-'))
    const targetFolder = path.join(tempRoot, 'instance-under-test')

    console.log(`Temp root: ${tempRoot}`)
    console.log(`Install target: ${targetFolder}`)

    let installerExitCode = 1

    try {
        installerExitCode = await runInstaller(targetFolder, quiet)

        if (installerExitCode !== 0) {
            throw new Error(`Installer exited with code ${installerExitCode}`)
        }

        const missing = await verifyInstall(targetFolder)
        if (missing.length > 0) {
            throw new Error(`Missing expected files:\n${missing.join('\n')}`)
        }

        console.log('Temp install smoke test passed')
    } finally {
        if (!keep) {
            await fs.rm(tempRoot, { recursive: true, force: true })
            console.log('Temp folder removed')
        } else {
            console.log(`Keeping temp folder for inspection: ${tempRoot}`)
        }
    }
}

main().catch((err) => {
    console.error('Temp install smoke test failed')
    console.error(err)
    process.exit(1)
})
