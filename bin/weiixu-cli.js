#!/usr/bin/env node
const { exec } = require('child_process')
var program = require('commander')
var shell = require('shelljs')
var appInfo = require('../package.json')
const defaultOptions = require('../conf/default-cli-options')

exec('echo "The \\$HOME variable is $HOME"')

program.version(appInfo.version) // 拿到 package.json 你定义的版本
program
  .command('puppeteer <shell>') // 定义你的command

  .alias('pup') // 别名缩写

  .description('Enter the "shell" you want to convert and include it in " "  ') // 描述

  .option('-p, --path <path>', 'Enter you path , default ./shell.html') // option 字命令，可以无限多个

  .action(function (cmd, options) {
    // 拿到cli输入的option子命令，没有可以默认
    // var path = typeof options.path == 'string' ? options.path : './l'

    exec('cwd', function (code, stdout, stderr) {
      console.log('cwd:', stdout)
    })
    // 执行你的操作 ↓
    const handleCmd = function (code, stdout, stderr) {
      if (code === 0) {
        console.log('stdout:', stdout)
      } else {
        console.log(stderr)
      }
    }

    if (!shell.which('git')) {
      shell.echo('Sorry, this script requires git')
      shell.exit(1)
    }
    // 执行cli的command
    shell.exec(
      cmd,
      {
        silent: true,
        encoding: 'utf8',
      },
      handleCmd
    )
  })
  .on('--help', function () {
    // --help  commander 有默认处理
  })

// jira自动任务 返回新生成的命令（即该子命令）以供继续配置
program
  .command('jira <jira>')
  // .command('clone <label> [destination]')
  .description('jira自动任务')
  .option('-p, --path <path>', 'Enter you path, default ./') // option命令，不限数量
  .option('--url <url>', 'Enter you url')
  .option('--label <label>', 'Enter you label')
  .option('--username <username>', 'Enter you username')
  .option('--password <password>', 'Enter you password')
  .action((jira, destination) => {
    // console.log('jira自动任务', label, destination)
    const { jiraPath, jiraUrl, jiraLabel } = defaultOptions
    const { path, url, label, username, password } = destination
    const cmd = `node ${
      path || jiraPath
    } url=${url} label=${label} username=${username} password=${password}`
    shell.exec(cmd)
  })

program.parse(process.argv)
