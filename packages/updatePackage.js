const fs = require("fs");
const path = require("path");

//更改package.json文件
exports.updatePackage = (appDir, creditData) => {
    return new Promise((resolve, reject) => {
        const filename = path.join(appDir,'package.json');
        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) {
                reject(err) 
            } else {
                const packageJson = JSON.parse(data);
                const newPackageJson = JSON.stringify({ ...packageJson, ...creditData}, null, '\t')  // \t为了输出更好看
                fs.writeFileSync(filename, newPackageJson)
                resolve(null)
            }
        })
    })
};