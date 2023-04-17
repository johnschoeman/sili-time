import chokidar from "chokidar"
import util from "util"
import bs from "browser-sync"
import chalk from "chalk"
import { exec } from "child_process"
import commandLineArgs from "command-line-args"

const logPrefix = "[" + chalk.blue("Dev") + "]"
const log = console.log.bind(console, logPrefix)

const SOURCE_DIR = "./src"
const DOT_FILES_REGEX = /(^|[\/\\])\../

const optionDefinitions = [
  { name: "port", alias: "p", type: Number, defaultValue: 3000 },
  { name: "syncBrowsers", alias: "s", type: Boolean, defaultValue: true },
]

const options = commandLineArgs(optionDefinitions)
const { port, syncBrowsers } = options

const browserSync = bs.create()
const execAsync = util.promisify(exec)

const watcher = chokidar.watch(SOURCE_DIR, {
  ignored: DOT_FILES_REGEX,
  persistent: true,
})

const startServer = () => {
  if (syncBrowsers) {
    browserSync.init({
      open: false,
      server: "./build",
      port,
    })
  } else {
    execAsync(`serve -p ${port} build/`)
  }
}

const buildApp = async () => {
  log("Building App")
  try {
    const cmd = `bin/build.sh`
    log("Running:", cmd)
    const { stdout, stderr } = await execAsync(cmd)
    log(stdout)
    if (stderr && stderr.length > 0) {
      log(stderr)
    }
  } catch (error) {
    const { stderr, stdout } = error
    log(stdout)
    log(stderr)
  }
}

const startDevServer = async (log, port) => {
  log(`Starting Dev Server`)
  log(`| port:   ${port}`)
  log(`| sync:   ${syncBrowsers}`)

  await buildApp()

  startServer()

  watcher.on("change", async path => {
    log(path)
    await buildApp()
    if (syncBrowsers) {
      browserSync.reload()
    }
  })
}

startDevServer(log, port)
