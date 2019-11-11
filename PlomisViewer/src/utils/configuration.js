
import JSON from 'json5';
import is from 'whatitis';
import AsyncStorage from '@react-native-community/async-storage';


const newConfig = () => {

  return {

    // 版本号检测地址 android
    versionUrl: 'https://thingspower-jssl.obs.cn-east-2.myhuaweicloud.com/version.json',

    // 所有节点配置地址
    appConfigUrl: 'https://thingspower-jssl.obs.cn-east-2.myhuaweicloud.com/app-config.json',

    // 当前使用得设定
    setting: {
      theme: 'light',
      useAppConfig: false,
      appConfigId: ''
    },

    // 默认配置
    defaultConfig: {
      configName: '默认演示配置',
      homePage: 'https://jssl.thingspower.com.cn'
    },

    // 当前使用配置
    config: {
      configName: '默认演示配置',
      homePage: 'https://jssl.thingspower.com.cn'
    },

    // 所有节点配置
    appConfigs: null
    /* [{
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
  if ( configuration.setting.useAppConfig === false ) {
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
