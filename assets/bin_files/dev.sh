#!/bin/bash

CLEAR=NO

while [[ $# -gt 0 ]]
do
key="$1"

case $key in
    --clear)
    CLEAR=YES
    ;;
    *)
            # unknown option
    ;;
esac
shift # past argument or value
done


# remove previous build folder
rm -R build
# make build folder
mkdir build
# make css folder in the build folder
mkdir build/css
# create empty main.css file that way our browser sync can watch it
touch build/css/style.css
# make js folder in the build folder
mkdir build/js
# # create empty app.js file that way our browser sync can watch it
# touch build/js/tests.js
# # create empty tests.js file
# touch build/js/tests.js

# copy index.html from src to build folder
cp src/html/index.html build/index.html
# cp tests/html/index.html build/tests.html

# cp node_modules/mocha/mocha.css build/css/
# cp node_modules/mocha/mocha.js build/js/

# cp node_modules/bootstrap/dist/css/bootstrap.css src/scss/_bootstrap.css
# cp -r node_modules/bootstrap-sass/assets/fonts/bootstrap src/fonts/bootstrap
# cp -r node_modules/bootstrap-sass/assets/stylesheets/bootstrap src/sass/bootstrap
# cp node_modules/bootstrap-sass/assets/stylesheets/_bootstrap.scss src/sass/_bootstrap-custom.scss

cp -r src/fonts build/css/fonts

# Run the next commands together with & and keep all processes in the foreground with && fg
# browserify and watch with watchify, transform with babelify from es2015 & react to es5
# node_modules/.bin/watchify -e tests/index-spec.js -o "build/tests/tests.js" -d -v -t [ babelify --presets [ es2015 react ] ] &

# node_modules/.bin/mocha build/tests/tests.js

# convert our scss file to css and place it in the build folder
node_modules/.bin/node-sass src/scss/style.scss build/css/style.css --source-map true
# watch scss file and rebuild to css if changed
node_modules/.bin/node-sass -w src/scss/style.scss build/css/style.css --source-map true &

if [ $CLEAR == YES ]; then
    env node .bin/dev.js --clear
else
    env node .bin/dev.js
fi

# start browser-sync to serve from the build folder and reload our browser when a file in the build map changes.
# node_modules/.bin/browser-sync start --files "build/css/*.css, build/js/*.js" --server build && fg

