#!/usr/bin/env node

import * as program from 'commander';
import * as path from 'path';
import * as readPkgUp from 'read-pkg-up';
import { Packagr } from '../lib/packagr';

program
    .name('react-packagr')
    .storeOptionsAsProperties(false)
    .option('-v, --version', 'Prints version info')
    .option('-w, --watch', 'Watch for files changes')
    .option('-p, --project <path>', 'Path to react-package.json or pakcage.json file', '.')
    .option('-s, --sourceFolder <path>', 'Relative Path of source code folder to project', 'src')
    .option('-d, --destFolder <path>', 'Destination Folder of generated npm package', 'dist');

    
program.on('option:version', ()=>{
    const dir = path.dirname(module.filename);
    const packageJson = readPkgUp.sync({ cwd: dir }).packageJson;
    console.log(packageJson.name + ': ' + packageJson.version);
    process.exit(0);
});


program.parse(process.argv);

const { project, sourceFolder, destFolder} = program.opts();

if (project && sourceFolder && destFolder) {
    const packagr = new Packagr(project, sourceFolder, destFolder);
    packagr.build();
}