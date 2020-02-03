const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  // // console.log('​app', app)
  const proxyUrl =
    // 'http://miramartravel-gateway:9950';
    'http://120.77.207.21'; // 线上
  // "http://192.168.1.20:9950"//内网测试
  // 'http://192.168.1.35:9950'
  // 'http://192.168.1.201:9950'

  // const uploadProxyUrl = 'http://120.77.207.21'
  // app.use(
  //   proxy('/api/upload', {
  //     target: uploadProxyUrl,
  //     pathRewrite: {
  //       '^/api': ''
  //     }
  //   })
  // )
  app.use(
    proxy('/api', {
      target: proxyUrl,
      pathRewrite: {
        '^/api': ''
      }
    })
  );
};
