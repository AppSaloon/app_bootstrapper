function getPlatforms (platformArray) {
    return new Promise ((resolve, reject) => {
        const result = [].concat(platformArray)
        let validResult = true
        for ( let x = 0, l = result.length; x < l; x++ )
            if ( Object.prototype.toString.apply(result[x]).slice(8, -1) !== 'String' )
                validResult = false

        console.log('validResult', validResult)
        if ( !validResult /*|| (result.length === 1 && Object.prototype.toString.apply(result[0]).slice(8, -1) !== 'String' )*/ ) {
            if ( result.length !== 1 ) {
                this.log('At least one of the platforms is not valid')
                this.cancel()
            } else {
                result.pop()
                askForPlatforms.bind(this)().then((ask)=>{
                    if ( ask )
                        askForPlatformName.bind(this)().then(platform => {
                            result.push(platform)
                            resolve(result)
                        })
                    else
                        resolve(null)
                })
            }
        } else {
            resolve(result)
        }
    })
}

function askForPlatforms () {
    return new Promise ((resolve, reject) => {
        const platforms = []
        this.prompt({
            type: 'confirm',
            name: 'platform',
            default: false,
            message: 'Do you want to add a platform to your project? '
        },
        (result) => {
            if ( result.platform ) {
                resolve(true)
            } else {
                resolve(false)
            }
        })
    })
}

function asd (dsa) {
    if ( !dsa )
    result = []
    askForPlatformName().then(platform => {
        if ( platform ) {
            result.push(platform)
            askForPlatformName
        } else
            resolve(result)
    })
}

function askForPlatformName () {
    return new Promise ((resolve, reject) => {
        this.prompt({
            type: 'input',
            name: 'platformName',
            message: 'Platform name: (leave empty to finish)'
        },
        (result) => {
            if ( result.platformName ) {
                resolve(result.platformName)
            } else {
                resolve(false)
            }
        })
    })
}

export default getPlatforms
