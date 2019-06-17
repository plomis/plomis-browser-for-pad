package com.plomisviewer;


// react-native-orientation-locker
import android.content.Intent;
import android.content.res.Configuration;

// react-native-splash-screen
import android.os.Bundle;
import org.devio.rn.splashscreen.SplashScreen;

// react-navigation
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;


import com.facebook.react.ReactActivity;


public class MainActivity extends ReactActivity {

    // react-native-splash-screen
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // SplashScreen.show(this, R.style.SplashScreenTheme);
        SplashScreen.show(this, true);
        super.onCreate(savedInstanceState);
    }

    // react-native-orientation-locker
    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        Intent intent = new Intent("onConfigurationChanged");
        intent.putExtra("newConfig", newConfig);
        this.sendBroadcast(intent);
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "PlomisViewer";
    }

    // react-navigation
    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName()) {
            @Override
            protected ReactRootView createRootView() {
                return new RNGestureHandlerEnabledRootView(MainActivity.this);
            }
        };
    }
}
