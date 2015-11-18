package io.scrollback.neighborhoods.modules.core;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class ClipboardModule extends ReactContextBaseJavaModule {

    ReactApplicationContext mReactContext;

    public ClipboardModule(ReactApplicationContext ctx) {
        super(ctx);

        mReactContext = ctx;
    }

    @Override
    public String getName() {
        return "ClipboardModule";
    }

    @ReactMethod
    public void setText(final String label, final String text, final Promise promise) {
        ClipboardManager clipboard = (ClipboardManager) mReactContext.getSystemService(Context.CLIPBOARD_SERVICE);
        ClipData clip = ClipData.newPlainText(label, text);

        clipboard.setPrimaryClip(clip);

        promise.resolve(true);
    }

    @ReactMethod
    public void getText(final Promise promise) {
        ClipboardManager clipboard = (ClipboardManager) mReactContext.getSystemService(Context.CLIPBOARD_SERVICE);

        ClipData data = clipboard.getPrimaryClip();
        ClipData.Item item = data.getItemAt(0);

        promise.resolve(item.getText().toString());
    }
}
