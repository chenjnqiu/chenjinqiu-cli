#!/usr/bin/env node

// const chalk = require('chalk')

const program = require('commander')
const inquirer = require('inquirer')
// const symbols = require('log-symbols')
const path = require("path");
const { config } = require("../packages/config");
const { downloadGit } = require("../packages/download");
const { updatePackage } = require("../packages/updatePackage")
const { start } = require('../packages/startPreject')

program
  .version(require('../package').version, '-v, --version')
  .command('create <app-name>')
  .description("创建一个新项目")
  .action((appName) => {
    // inquirer.prompt([
    //   {
    //       type: 'input',
    //       name: 'name',
    //       message: '请输入项目名称'
    //   }
    // ]).then((answers) => {
    //   const lqProcess = ora('正在创建...')
    //   lqProcess.start()
    //   download('direct:https://github.com/chenjnqiu/createComponent.git#main',
    //   appName, {clone: true}, (err) => {
    //     if(err) {
    //       lqProcess.fail()
    //     } else {
    //       lqProcess.succeed()
    //       console.log(symbols.success, chalk.green('创建成功'))
    //     }
    //   })
    // })
    inquirer.prompt([{
      type: 'input',
      name: 'description',
      message: '请输入项目描述信息:',
    }, {
      type: "list",
      message: "请选择一个模板下载:",
      name: "templateName",
      choices: Object.keys(config)
    }]).then(async (answers) => {
      const { description, templateName } = answers
      // 当前目录创建根据appName输入项目目录文件
      const appDir = path.join(process.cwd(), appName);
      try {
        // 下载文件
         const { status } = await downloadGit(templateName, appDir);
        // 文件下载成功 
        if(status) {
          // 更改package.json内容 
          await updatePackage(appDir, { name: appName, description, template: templateName });
          // 安装启动项目
          start(appDir, templateName)
        }
      } catch (error) {
        console.log(error);
      }
    })


  })
program.parse(process.argv)