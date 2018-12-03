const Listr = require('listr');
const shell = require('shelljs');
const { Observable } = require('rxjs');
const targetVersion = require('../package.json').version;

const fmtFileName = name => {
  if (typeof name === 'string' && name.includes('.')) {
    return name.split('.')[0];
  }
  return name;
};

const getChecksum = file => {
  const origCfg = shell.config.silent;
  shell.config.silent = true;
  const checksum = shell.exec('shasum -a 256 ' + file + " | awk '{printf $1}'")
    .stdout;
  shell.config.silent = origCfg;
  return checksum;
};

function createArchiveTask(dir, opts) {
  const suppressOutput = (opts && opts.silentShellOutput) || true;
  const verboseOutput = (opts && opts.verboseOutput) || false;
  const removeOrigFile = (opts && opts.removeBinaryAfterArchiving) || true;

  shell.config.silent = suppressOutput;
  shell.config.verbose = verboseOutput;

  return {
    title: 'Archiving bundled executables',
    task: ctx => {
      return new Observable(observer => {
        observer.next('Preparing...');
        ctx.results = [];

        shell.cd(dir);
        shell.ls('*').forEach(file => {
          const archiveName =
            fmtFileName(file) + '-v' + targetVersion + '.tar.gz';
          observer.next('Building archive for: ' + file);
          if (shell.exec('tar czf ' + archiveName + ' ' + file).code !== 0) {
            ctx.results.push({
              archive: archiveName,
              targetFile: file,
              success: false
            });
          } else {
            if (removeOrigFile) {
              shell.rm(file);
            }
            const sha = getChecksum(archiveName);
            ctx.results.push({
              archive: archiveName,
              targetFile: file,
              success: sha !== undefined,
              checksum: sha
            });
          }
        });

        observer.complete();
      });
    }
  };
}

const tasks = new Listr([createArchiveTask('dist')]);

tasks.run({ cwd: process.cwd() }).catch(error => console.error(error));
