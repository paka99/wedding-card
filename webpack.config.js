module.exports = {
    entry: [
        './assets/js/custom/kakaomap.js',
        './assets/js/custom/morephoto.js',
        './assets/js/custom/photo-swipe.js',
        './assets/js/custom/roadtrip.js',
        './assets/js/custom/visitor.js',
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