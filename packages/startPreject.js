const exec = require('child_process').exec;
const inquirer = require('inquirer');
const { config, installType } = require("../packages/config");

exports.start = (appDir, templateName) => {
    inquirer.prompt({
        type: "list",
        message: "请选择安装方式:",
        name: "installType",
        choices: Object.keys(installType)
    }).then(async (answers) => {
        const { installType } = answers
        await inStallModule(appDir, installType)
        console.log('项目依赖安装完毕...');
        await startProject(appDir, templateName, installType)
        console.log('项目启动成功...');
    })
};

const inStallModule = (appDir, installType) => {
    return new Promise((resolve) => {
        const workerProcess = exec(
            installType,
            {
              cwd: appDir,
            },
            (err) => {
              if (err) {
                console.log(err);
                reject(err);
              } else {
                resolve(null);
              }
            }
          );
      
          workerProcess.stdout.on('data', function (data) {
            console.log(data);
          });
      
          workerProcess.stderr.on('data', function (data) {
            console.log(data);
          });
    })
}

const startProject = (appDir, templateName, installType) => {
    return new Promise((resolve, reject) => {
      const workerProcess = exec(
        config[templateName][installType], // 启动命令
        {
          cwd: appDir,
        },
        (err) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            resolve(null);
          }
        }
      );
  
      workerProcess.stdout.on('data', function (data) {
        console.log(data);
      });
  
      workerProcess.stderr.on('data', function (data) {
        console.log(data);
      });
    });
  };