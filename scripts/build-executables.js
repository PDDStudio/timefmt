#!/usr/bin/env node

const shell = require('shelljs');
const targetVersion = require('../package.json').version;

const nodeVersion = shell.which('node');
const npmVersion = shell.which('npm');
const yarnVersion = shell.which('yarn');
const tarVersion = shell.which('tar');

if (!nodeVersion || !npmVersion || !yarnVersion || !tarVersion) {
  shell.echo('Missing requirements to package executable.');
  shell.exit(1);
} else {
  shell.echo('Building executables with following system tools:');
  shell.echo('Node: ' + nodeVersion);
  shell.echo('NPM: ' + npmVersion);
  shell.echo('Yarn: ' + yarnVersion);
  shell.echo('[GNU] tar: ' + tarVersion);
}

if (shell.exec('yarn package').code !== 0) {
  shell.echo('Error: Creating executable binary failed!');
  shell.exit(1);
} else {
  shell.cd('dist');
  shell.ls('*').forEach(file => {
    const archiveName = file + '-v' + targetVersion + '.tar.gz';
    shell.echo('Building archive for: ' + file);
    if (shell.exec('tar czf ' + archiveName + ' ' + file).code !== 0) {
      shell.echo('Error: Creating archive failed for ' + file);
    } else {
      shell.rm(file);
      shell.echo('Archive successfully created: ' + archiveName + '!');
    }
  });
}
