const ora = require('ora');
const loading = ora('Loading');

exports.startLoading = (text = '加载中...') => {
    loading.text = text;
    loading.color = 'green';
    loading.start();
};

exports.succeedLoading = (text = '加载完成') => {
    loading.text = text;
    loading.color = 'green';
    loading.succeed();
};

exports.failLoading = (text = '加载失败') => {
    loading.text = text;
    loading.color = 'red';
    loading.fail();
};

exports.endLoading = () => {
    loading.stop();
};
