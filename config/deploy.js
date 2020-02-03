const client = require('deploy-kit');
const path = require('path');
client
  .sftp({
    // sever account, address, port
    server: 'root:1qazmlp0@67.21.71.225',
    // deploy all files in the directory
    workspace: path.join(__dirname, '..', 'build'),
    // ignore the matched files (glob pattern: https://github.com/isaacs/node-glob#glob-primer)
    // support array of glob pattern
    ignore: '**/*.map',
    // where the files are placed on the server
    deployTo: '/home/peach/admin-web/',
    // you can specify different place for each file
    rules: []
  })
  .exec();
