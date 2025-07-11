const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    entry: {
      background: './src/background/index.ts',
      content: './src/content/index.ts',
      popup: './src/popup/index.ts',
      manage: './src/manage/index.ts'
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
      clean: true
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader'
          ]
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/,
          type: 'asset/resource',
          generator: {
            filename: 'assets/images/[name][ext]'
          }
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@shared': path.resolve(__dirname, 'src/shared'),
        '@utils': path.resolve(__dirname, 'src/shared/utils'),
        '@types': path.resolve(__dirname, 'src/shared/types'),
        '@api': path.resolve(__dirname, 'src/shared/api'),
        '@state': path.resolve(__dirname, 'src/shared/state')
      },
      modules: [path.resolve(__dirname, 'src'), 'node_modules']
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          { from: 'source/manifest.json', to: 'manifest.json' },
          { from: 'source/popup.html', to: 'popup.html' },
          { from: 'source/manage.html', to: 'manage.html' },
          { from: 'source/debug-init.js', to: 'debug-init.js' },
          { from: 'source/assets', to: 'assets' },
          { from: 'source/locales', to: 'locales' },
          { from: 'source/scripts', to: 'scripts' },
          { from: 'source/styles', to: 'styles' },
          { from: 'source/html', to: 'html' },
          { from: 'source/api', to: 'api' },
          { from: 'source/utils', to: 'utils' }
        ]
      }),
      ...(isProduction ? [new MiniCssExtractPlugin({
        filename: 'styles/[name].css'
      })] : [])
    ],
    devtool: isProduction ? 'source-map' : 'eval-source-map',
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
          },
          shared: {
            name: 'shared',
            chunks: 'all',
            minChunks: 2,
            enforce: true
          }
        }
      }
    },
    performance: {
      hints: isProduction ? 'warning' : false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    }
  };
};