module.exports = {
    entry: [
        './assets/js/morephoto.js',
        './assets/js/roadtrip.js',
        './assets/js/photo-swipe.js',
        './assets/js/visitor.js',
    ],
    output: {
        filename: 'bundle.js'
    },

    module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env']
              }
            }
          }
        ]
      },

    devServer: {
        port: 7000,
        // contentBase: './dist'
    },
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    },
    devtool: 'eval-source-map',

    // watch: true,
};