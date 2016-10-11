// var webpack = require('webpack');
var path = require('path');
// var resolveNgRoute = require('@angularclass/resolve-angular-routes');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var commonConfig = {
  resolve: {
    extensions: ['', '.ts', '.js', '.json']
  },
  module: {
    loaders: [
      // TypeScript
      { test: /\.ts$/, loaders: ['ts-loader', 'angular2-template-loader'] },
      { test: /\.html$/, loader: 'raw-loader' },
      { test: /\.css$/, loader: 'raw-loader' },
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.scss$/, loaders: ['raw', 'sass']},
      { test: /\.(jpg|jpeg|gif|png)$/, loader: 'url?limit=1024&name=assets/img/[name].[ext]' },
      { test: /\.(woff|woff2|eot|ttf|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url?limit=1024&name=assets/fonts/[name].[ext]' }

    ],
  },
  sassLoader: {
    includePaths: [
      'node_modules/govuk-elements-sass/public/sass',
      'node_modules/govuk_frontend_toolkit/stylesheets'
    ]
  },
  plugins: [
  ]

};


var clientConfig = {
  target: 'web',
  entry: './src/client',
  output: {
    path: root('dist/client')
  },
  node: {
    global: true,
    __dirname: true,
    __filename: true,
    process: true,
    Buffer: false
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        context: './node_modules/@govuk/platform-template/lib',
        from: 'govuk_template/**/*.png',
        to: 'assets/img',
        flatten: true
      },
      {
        context: './node_modules/@govuk/platform-template/lib',
        from: 'govuk_template/**/*.ico',
        to: 'assets/img',
        flatten: true
      },
      {
        context: './node_modules/@govuk/platform-template/lib',
        from: 'govuk_template/**/*.svg',
        to: 'assets/img',
        flatten: true
      },
      {
        context: './node_modules/govuk_frontend_toolkit',
        from: 'images/**/*.png',
        to: 'assets/img',
        flatten: true
      },
      {
        context: './node_modules/@govuk/platform-template/assets',
        from: 'fonts/*',
        to: 'assets/fonts',
        flatten: true
      }
    ])
  ]
};


var serverConfig = {
  target: 'node',
  entry: './src/server', // use the entry file of the node server if everything is ts rather than es5
  output: {
    path: root('dist/server'),
    libraryTarget: 'commonjs2'
  },
  externals: checkNodeImport,
  node: {
    global: true,
    __dirname: true,
    __filename: true,
    process: true,
    Buffer: true
  }
};



// Default config
var defaultConfig = {
  // context: __dirname,
  resolve: {
    root: root('/src')
  },
  output: {
    publicPath: path.resolve(__dirname),
    filename: 'index.js'
  }
};



var webpackMerge = require('webpack-merge');
module.exports = [
  // Client
  webpackMerge({}, defaultConfig, commonConfig, clientConfig),

  // Server
  webpackMerge({}, defaultConfig, commonConfig, serverConfig)
];

// Helpers
function checkNodeImport(context, request, cb) {
  if (!path.isAbsolute(request) && request.charAt(0) !== '.') {
    cb(null, 'commonjs ' + request); return;
  }
  cb();
}

function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [__dirname].concat(args));
}
