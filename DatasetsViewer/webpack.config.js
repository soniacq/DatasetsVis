const config = {
    entry: ['./js/index.tsx'],
    output: {
      path: __dirname + '/build',
      filename: 'datasetsVis.js',
      library: 'datasetsVis'
    },
    module: {
      rules: [
        {
          test: /\.(js|ts)x?$/,
          exclude:  /node_modules/,
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/react', '@babel/typescript']
          }
        },
        {
          test: /\.css$/,
          use: [
              'style-loader',
              'css-loader'
              ]
      },
      {
          test: /\.(png|svg|jpg|gif)$/,
          use: [
              'file-loader'
              ]
      }
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
    },
    devServer:{
      writeToDisk:true,
      hot:false,
      inline: false,
    },
    mode: 'development'
};
module.exports = config;
