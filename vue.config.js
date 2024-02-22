const path = require('path');

module.exports = {
  transpileDependencies: true,
  devServer: {
    port: 9090, // Set the development server port to 9090
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // your backend's port
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'), // Explicitly define the "@" alias
      }
    }
  }
  
};
