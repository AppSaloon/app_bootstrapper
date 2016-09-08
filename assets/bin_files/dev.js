const clearConsoleOnUpdate = (process.argv.find(a=>a==='--clear') ? true : false)

const bs = require("browser-sync").create();

function initBS () {
    bs.init({
        server: "./build"
    });
}

const fs = require("fs-extra");
const chokidar = require("chokidar");

const browserify = require("browserify");
const watchify = require('watchify');
const babelify = require('babelify');

const spawn = require('child_process').spawn;

const clear = require('cli-clear');

const browserifyApp = browserify({
    debug: true,
    entries: ['./src/js/index.js'],
    cache: {},
    packageCache: {},
    plugin: [watchify],
    transform: [ [babelify, {presets: ["es2015", "react"]}] ]
});

function bundle() {
    browserifyApp.bundle(function(err, buf) {
        if ( err ) {
            console.error('\n-----------\n');
            console.error(new Error(err));
        }
    }).pipe(fs.createWriteStream('build/js/app.js'));
}

function initWatch () {
    // chokidar.watch('src/html/*.html')
    //     .on('change', (path) => {
    //         console.log(`\n-----------\n\n${path} changed`);
    //         copyHtml().then(function () {
    //             reloadBS('index.html');
    //         });
    //     });
    chokidar.watch('src/js/**')
        .on('change', (path) => {
            clearCli();
            console.log(`\n-----------\n\n${path} changed`);
            bundle();
        });
    chokidar.watch('tests/**')
        .on('change', (path) => {
            clearCli();
            console.log(`\n-----------\n\n${path} changed`);
            runTests();
        });
    chokidar.watch('build/css/style.css')
        .on('change', (path) => {
            clearCli();
            console.log(`\n-----------\n\n${path} changed`);
            reloadBS("*.css");
        });
    browserifyApp.on('log', function (msg) {
        console.log(msg);
        reloadBS('app.js');

        runTests();
    });
    bundle();
}

function reloadBS (files) {
    bs.reload(files);
}

function runTests () {
    spawn(`node_modules/.bin/mocha`, ['tests/tests.js', '--require', 'babel-register'], {stdio: [0, 1, 2]});
}

function clearCli () {
    if ( clearConsoleOnUpdate )
        clear();
}

function init () {
    initBS();
    initWatch();
};

init();
