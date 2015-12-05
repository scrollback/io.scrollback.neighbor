package io.scrollback.neighborhoods.modules.core;

import android.content.Context;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import io.scrollback.neighborhoods.modules.gcm.PushNotificationModule;

public class CorePackage implements ReactPackage {

    private Context mContext;

    public CorePackage(Context activityContext) {
        mContext = activityContext;
    }

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        return Arrays.<NativeModule>asList(
                new ClipboardModule(reactContext),
                new BuildConfigModule(reactContext),
                new VersionCodesModule(reactContext),
                new URLResolverModule(reactContext),
                new GeolocationModule(reactContext, mContext),
                new AlertDialogModule(reactContext, mContext),
                new ShareModule(reactContext, mContext),
                new IntentModule(reactContext, mContext),
                new PushNotificationModule(reactContext, mContext)
        );
    }

    @Override
    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return Collections.emptyList();
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Arrays.asList();
    }
}
