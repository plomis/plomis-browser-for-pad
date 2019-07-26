//@flow

import React from 'react';
import { Switch, View } from 'react-native';
import { ActivityIndicator, Toast } from '@ant-design/react-native';
import List from '../../components/List';
import ScrollStackView from '../../components/ScrollStackView';
import { withAppConfig } from '../../utils/AppContext';
import Services from './Services';


const Item = List.Item;
const Controller = function() {
  try {
    return new AbortController();
  } catch ( err ) {
    return {
      abort() {},
      signal: null
    };
  }
};

@withAppConfig
class Content extends React.Component {

  state = {
    loading: false,
    controller: new Controller()
  };

  componentDidMount() {
    const { configuration } = this.props;
    if ( configuration.setting.useAppConfig ) {
      this.fetchConfigs();
    }
  }

  componentWillUnmount() {
    const { setConfig, configuration } = this.props;
    const appConfig = configuration.appConfigs.find(({ id }) => {
      return id === configuration.setting.appConfigId;
    });
    if ( !appConfig ) {
      setConfig( 'setting', {
        useAppConfig: false
      });
    }
  }

  handleOpenChange = () => {
    const { controller } = this.state;
    const { setConfig, configuration } = this.props;
    const oldUseAppConfig = configuration.setting.useAppConfig;
    setConfig( 'setting', {
      useAppConfig: !oldUseAppConfig
    });
    if ( !oldUseAppConfig ) {
      this.fetchConfigs();
    } else {
      setConfig( 'appConfigs', null );
      setConfig( 'setting', {
        useAppConfig: false,
        appConfigId: null
      });
      controller.abort();
    }
  };

  handleSelect = ( selectedKey ) => {
    this.fetchConfig( selectedKey );
  };

  fetchConfigs = () => {
    const { controller } = this.state;
    const signal = controller.signal;
    const { setConfig, configuration } = this.props;
    fetch( configuration.appConfigUrl, { method: 'GET', signal }).then(
      response => response.json()
    ).then( json => {
      setConfig( 'appConfigs', json );
    }).catch(() => {
      setConfig( 'setting', {
        useAppConfig: false,
        appConfigId: null
      });
      setConfig( 'appConfigs', null );
    });
  };

  fetchConfig = ( selectedKey ) => {
    const { setConfig, configuration } = this.props;
    const appConfig = configuration.appConfigs.find(({ id }) => {
      return id === selectedKey;
    });
    if ( appConfig ) {
      const { controller } = this.state;
      const signal = controller.signal;
      this.setState({ loading: true });
      fetch( appConfig.url, { method: 'GET', signal }).then(
        response => response.json()
      ).then( json => {
        setConfig( 'config', json );
        setConfig( 'setting', {
          appConfigId: selectedKey
        });
      }).catch(( err ) => {
        Toast.fail( err.toString());
      }).finally(() => {
        this.setState({ loading: false });
      });
    }
  };

  render() {

    const { configuration } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <ScrollStackView>
          <List mode="card">
            <Item controller={(
              <Switch
                value={configuration.setting.useAppConfig}
                onChange={this.handleOpenChange} />
            )}>
              启用配置
            </Item>
          </List>
          {configuration.setting.useAppConfig ? (
            <Services
              data={configuration.appConfigs}
              onSelect={this.handleSelect}
              selectedKey={configuration.setting.appConfigId} />
          ) : null}
        </ScrollStackView>
        <ActivityIndicator
          animating={this.state.loading}
          toast
          size="large"
          text="loading..." />
      </View>
    );
  }
}

export default Content;
