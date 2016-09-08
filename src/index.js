import vorpal from 'vorpal'
const vorpalInstance = vorpal()

import fs from 'fs'
import { spawn } from 'child_process'

vorpalInstance
    .command('init <name>')
    .alias('initiate')
    // .option('-p, --platform [platform]', 'Which platforms to install.')
    .description('Initiate a new project.')
    .action(function(args, callback) {

        const name = args.name

        // let platforms
        // getPlatforms.bind(this)(args.options.platform).then(result=>{
        //     console.log('getPlatforms result', result)
        //     platforms = result
        //     this.log(platforms)
        // })

        fs.mkdir(name, (err) => {
            if ( err ) {
                this.log(err)
                this.cancel()
            }

            process.chdir(name)

            askToCreateCordova.bind(this)().then((cordova) => {
                if ( cordova )
                    createCordova.bind(this)(name, callback)
                else
                    createNpm.bind(this)(callback)
            })
        })

    });

vorpalInstance
    .delimiter('cordovainit$')
    .show()


function createNpm (cb) {
    init()
    .then(() => {
        modifyPackage()
        .then(() => {
            copyAssets()
            .then(() => {
                process.chdir('..')
                cb(); // without calling the callback vorpal exits
            })
        })
    })
}

function copyAssets () {
    return new Promise ((resolve, reject) => {
        fs.mkdirSync('.bin')
        const cp = spawn('cp', ['-r', '../assets/bin_files/', './.bin'])
        cp.on('close', () => {
            resolve()
        })
        // fs.createReadStream('test.log').pipe(fs.createWriteStream('newLog.log'))
    })
}

function modifyPackage () {
    return new Promise ((resolve, reject) => {
        const packageJSON = fs.readFileSync('package.json', 'utf8')
        let packageObject
        try {
            packageObject = JSON.parse(packageJSON)
        }
        catch (error) {
            return reject()
        }
        packageObject = Object.assign(
            {},
            packageObject,
            {
                script: {
                    dev: "bash .bin/dev.sh",
                    "dev:clear": "bash .bin/dev.sh --clear"
                },
                devDependencies: {
                    "babel-preset-es2015": "^6.13.2",
                    "babel-preset-react": "^6.11.1",
                    "babelify": "^7.3.0",
                    "browser-sync": "^2.14.0",
                    "browserify": "^13.1.0",
                    "chai": "^3.5.0",
                    "chokidar": "^1.6.0",
                    "cli-clear": "^1.0.4",
                    "enzyme": "^2.4.1",
                    "fs-extra": "^0.30.0",
                    "jsdom": "^9.4.2",
                    "mocha": "^3.0.2",
                    "node-sass": "^3.8.0",
                    "react-addons-test-utils": "^15.3.0",
                    "sinon": "^1.17.5",
                    "sinon-chai": "^2.8.0",
                    "watchify": "^3.7.0"
                }
            }
        )
        fs.writeFile('package.json', JSON.stringify(packageObject, null, 2))
        return resolve()
    })
}

function init () {
    return new Promise ((resolve, reject) => {
        const init = spawn('npm', ['init'], {stdio: [0, 1, 0]})
        init.on('close', () => {
            resolve()
        })
    })
}


function askToCreateCordova () {
    return new Promise ((resolve, reject) => {
        this.prompt({
            type: 'confirm',
            name: 'cordova',
            default: false,
            message: 'Cordova? '
        },
        (result) => {
            if ( result.cordova ) {
                resolve(true)
            } else {
                resolve(false)
            }
        })
    })
}

function createCordova (name, cb) {
    process.chdir('..')
    create(name)
    .then(()=>{
        process.chdir(name)
        add().then(()=>{
            createNpm.bind(this, cb)()
        })
    })
}

function create (name) {
    return new Promise ((resolve, reject) => {
        const create = spawn('cordova', ['create', name, `com.appsaloon.${name}`], {stdio: [0, 1, 0]})
        create.on('close', () => {
            resolve()
        })
    })
}

function add () {
    return new Promise ((resolve, reject) => {
        const add = spawn('cordova', ['platform', 'add', 'android', '--save'], {stdio: [0, 1, 0]})
        add.on('close', () => {
            resolve()
        })
    })
}
