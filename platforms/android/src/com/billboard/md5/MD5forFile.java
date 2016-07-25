package com.billboard.md5;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.net.URLDecoder;

/**
 * This class echoes a string called from JavaScript.
 */
public class MD5forFile extends CordovaPlugin {

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("file_md5")) {
            String filePath = args.getString(0);
            try{
                filePath= URLDecoder.decode(filePath,"UTF-8");
            }catch(Exception e)
            {
                return false;
            }

            this.file_md5(filePath, callbackContext);
            return true;
        }
        return false;
    }

    private void file_md5(String filePath, CallbackContext callbackContext) {
        if (filePath != null && filePath.length() > 0) {
            String path=filePath.substring(6);
            callbackContext.success(MD5.md5sum(path));
        } else {
            callbackContext.error("Expected one non-empty string argument.");
        }
    }
}
