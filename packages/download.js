const download = require('download-git-repo')
const inquirer = require('inquirer')
const ora = require('ora')
const fs = require("fs");
const { config } = require("../packages/config");
const { startLoading, succeedLoading, endLoading } = require("./loading");

// 删除文件夹
const delDir = (path, isRoot) => {
    return new Promise((resolve) => {
        let files = [];
        if (fs.existsSync(path)) {
            files = fs.readdirSync(path);
            files.forEach((file, index) => {
                let curPath = path + "/" + file;
                if (fs.statSync(curPath).isDirectory()) {
                    delDir(curPath); //递归删除文件夹
                } else {
                    fs.unlinkSync(curPath); //删除文件
                }
            });
            fs.rmdirSync(path);
        }
        if (isRoot && !fs.existsSync(path)) {
            resolve({ status: true })
        }
    })
}

const downloadLoop = (url, appDir, resolve) => {
    startLoading('开始下载...')
    download(url, appDir, (err) => {
        if (err) {
            endLoading()
            inquirer.prompt([{
                type: 'confirm',
                name: 'choice',
                message: `下载失败原因： ${err}, 是否重新下载？`,
                default: false,
            }]).then(answers => {
                // 选择重新下载
                if(answers.choice) {
                    downloadLoop(url, appDir, resolve)
                } else {
                    resolve({ status: false })
                }
            })
        } else {
            succeedLoading('下载成功')
            resolve({ status: true })
        }
    })
}

exports.downloadGit = (templateName, appDir) => {
    return new Promise(async (resolve, reject) => {
        const { url } = config[templateName]; // git的下载地址
        // 判断目录是否存在，存在删除目录
        await delDir(appDir, true);
        downloadLoop(url, appDir, resolve)
    });
};