
import React from 'react';
import omit from 'omit.js';
import { configuration, setConfig, getConfig, restore } from '../../utils/configuration';


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
    loaded: false,
    configuration: null
  };

  componentDidMount() {
    this.loadConfig();
  }

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
      this.setState({ configuration: nextConfiguration, loaded: true });
    }
  };

  render() {
    const { children, ...props } = this.props;
    const { configuration, loaded } = this.state;
    const nextValue = configuration || {};
    nextValue.setConfig = this.handleSetConfig;
    nextValue.restore = this.handleRestore;
    return (
      <AppContext.Provider {...props} value={nextValue}>
        {loaded ? children : null}
      </AppContext.Provider>
    );
  }
}
