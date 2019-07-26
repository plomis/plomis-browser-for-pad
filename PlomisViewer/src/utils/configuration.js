
import JSON from 'json5';
import is from 'whatitis';
import AsyncStorage from '@react-native-community/async-storage';


const newConfig = () => {
  return {
    appConfigUrl: 'https://72k.io/configs/app-config.json?a=2',
    setting: {
      useAppConfig: false,
      appConfigId: ''
    },
    defaultConfig: {
      configName: '默认演示配置',
      homePage: 'https://thingspower.com.cn'
    },
    config: {
      configName: '默认演示配置',
      homePage: 'https://thingspower.com.cn'
    },
    appConfigs: null/* [{
      id: 'preview',
      configName: '演示配置',
      url: 'https://72k.io/configs/preview/config.json'
    }] */
  };
};

export const configuration = newConfig();

export const upgrade = ({ setting, config, appConfigs }) => {
  Object.assign( configuration.setting, setting );
  Object.assign( configuration.config, config );
  configuration.appConfigs = appConfigs;
  return configuration;
};

export const setConfig = ( name, config ) => {
  if ( is.Object( config )) {
    configuration[name] = Object.assign( configuration[name], config );
  } else {
    configuration[name] = config;
  }
  if ( !configuration.setting.useAppConfig ) {
    configuration.config = { ...configuration.defaultConfig };
  }
  AsyncStorage.setItem( 'configuration', JSON.stringify( configuration ));
  return configuration;
};

export const getConfig = async () => {
  const configurationString = await AsyncStorage.getItem( 'configuration' );
  if ( configurationString ) {
    return upgrade( JSON.parse( configurationString ));
  }
  return null;
};

export const restore = () => {
  const config = newConfig();
  Object.assign( configuration, config );
  AsyncStorage.setItem( 'configuration', JSON.stringify( config ));
  return configuration;
};
