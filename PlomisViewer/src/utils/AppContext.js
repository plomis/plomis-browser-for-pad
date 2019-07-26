
import is from 'whatitis';
import React from 'react';
import omit from 'omit.js';
import { configuration, setConfig, getConfig, restore } from './configuration';


const AppContext = React.createContext( configuration );

export const withAppConfig = function( Comp ) {
  return class WrapedComp extends React.Component {
    static contextType = AppContext;
    render() {
      return <Comp
        {...this.props}
        setConfig={this.context.setConfig}
        restore={this.context.restore}
        configuration={omit( this.context, [ 'setConfig', 'restore' ])} />;
    }
  };
};

export class AppProvider extends React.Component {

  state = {
    configuration: null
  };

  componentDidMount() {
    this.loadConfig();
  }

  handleLoad = () => {
    const { onLoad } = this.props;
    if ( is.Function( onLoad )) {
      onLoad();
    }
  };

  handleSetConfig = ( ...args ) => {
    const configuration = { ...setConfig( ...args ) };
    this.setState({ configuration });
  };

  handleRestore = () => {
    const configuration = { ...restore() };
    this.setState({ configuration });
  };

  loadConfig = async () => {
    let nextConfiguration = configuration;
    try {
      const configuration = await getConfig();
      if ( configuration ) {
        nextConfiguration = configuration;
        if ( configuration.setting.useAppConfig && !configuration.config ) {
          configuration.config = { ...configuration.defaultConfig };
        }
      }
    } finally {
      this.setState({ configuration: nextConfiguration }, this.handleLoad );
    }
  };

  render() {
    const { configuration } = this.state;
    const nextValue = configuration || {};
    nextValue.setConfig = this.handleSetConfig;
    nextValue.restore = this.handleRestore;
    return <AppContext.Provider {...this.props} value={nextValue} />;
  }
}
