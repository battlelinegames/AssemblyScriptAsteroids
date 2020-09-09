#!/bin/bash

cp ./src/ASWebGLue.js ./src/ASWebGLue-backup.js
sed 's/try/\/\/ try/g' ./src/ASWebGLue.js > temp.js
mv temp.js ./src/ASWebGLue.js
sed 's/\} catch/\/\/ } catch/g' ./src/ASWebGLue.js > temp.js
mv temp.js ./src/ASWebGLue.js
sed 's/\} \/\/ end catch/\/\/ } \/\/ end catch/g' ./src/ASWebGLue.js > temp.js
mv temp.js ./src/ASWebGLue.js

#} // end catch
#rm ./src/ASWebGLue-backup.js