
import React from 'react';
import { withAppConfig } from '../components/AppContext';


export const ThemeContext = React.createContext({
  light: {},
  dark: {}
});

export function withTheme( Comp ) {
  return withAppConfig( class WithTheme extends React.Component {
    static contextType = ThemeContext;
    render() {
      const { configuration } = this.props;
      const { theme } = configuration.setting;
      return <Comp {...this.props} theme={this.context[theme || 'light']} />;
    }
  });
}

export const Provider = ThemeContext.Provider;
