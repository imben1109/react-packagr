

import {transformFileAsync, TransformOptions, BabelFileResult} from '@babel/core';
import * as glob from 'glob';
import * as path from 'path';
import * as _ from 'lodash';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import { getCompileFilePath } from '../../util/util';
import { UserPackage } from '../../entry-point/user-package';

const supportedFileSuffix = ['.js', '.ts', '.jsx', '.tsx'];
const outputFolder = "dist/esm2015";

/**
 * Compile files with specified user package
 * 
 * @param userPackage 
 * @returns output folder path
 */
export async function compileSourceFiles(userPackage: UserPackage): Promise<string> {
    const filePaths = glob.sync(
            userPackage.sourceFolderPath + '/**/*.*', {
            ignore: userPackage.sourceFolderPath + '/node_modules/**'
        });
    console.log("Scanned filenames: " + filePaths);

    const promises: Promise<BabelFileResult>[] = [];
    for (const sourceFilePath of filePaths){
        if (supportedFileSuffix.indexOf(path.extname(sourceFilePath)) > -1){
            console.log('starting to compile: ' + sourceFilePath);

            const transformOptions: TransformOptions = {
                presets: ['@babel/preset-typescript', '@babel/preset-react']
            };
    
            const promiseResult: Promise<BabelFileResult> = transformFileAsync(sourceFilePath, transformOptions);
            promises.push(promiseResult);
            promiseResult.then((res: BabelFileResult) => {            
                const relativeCompileFilePath  = getCompileFilePath(userPackage.destCompiledFolderPath, userPackage.sourceFolderPath, sourceFilePath, '.js');
                console.log(`starting to write compiled file: ${relativeCompileFilePath}`);
                mkdirp.sync(path.dirname(relativeCompileFilePath));
                fs.writeFile(relativeCompileFilePath, res.code, function(err){
                    if (err){
                        console.log(err);
                    }
                });
            });
        } else {
            console.log(`The file is not in supported file extension ${sourceFilePath} and starting to copy`);
            const relativeFilePath  = getCompileFilePath(userPackage.destCompiledFolderPath, userPackage.sourceFolderPath, sourceFilePath, path.extname(sourceFilePath));
            console.log(`starting to copy file to: ${relativeFilePath}`)
            mkdirp.sync(path.dirname(relativeFilePath));
            fs.copyFile(sourceFilePath, relativeFilePath, (err)=>{
                if (err){
                    console.log(err);
                }
            });

        }
    }
    
    return new Promise((resolve) => {
        Promise.all(promises).then(()=>{
            resolve(outputFolder)
        }).catch(e => {
            console.log(`failed to compile ${e}`)
        })
    });
}

