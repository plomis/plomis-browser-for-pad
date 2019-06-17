module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins:[
    'add-module-exports',
    [ '@babel/plugin-proposal-decorators', { legacy: true }]
  ]
};
