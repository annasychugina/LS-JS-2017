module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['mocha'],
        files: [
            './hw6/test/**/*.js'
        ],
        preprocessors: {
            './hw6/test/**/*.js': ['webpack', 'sourcemap'],
        },
        webpack: require('./webpack.config.test'),
        webpackMiddleware: {
            stats: 'errors-only'
        },
        reporters: ['mocha'],
        port: 9876,
        browsers: ['Chrome'],
        client: {
            mocha: {
                timeout : 4000
            }
        },
        captureTimeout: 60000,
        singleRun: false,
        plugins: [
            require('karma-mocha'),
            require('karma-webpack'),
            require('karma-mocha-reporter'),
            require('karma-chrome-launcher'),
            require('karma-sourcemap-loader')
        ]
    });
};
