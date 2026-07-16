package com.taniplus

import android.app.Application
import com.lynx.tasm.LynxEnv

class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        // Initialize Lynx Env
        LynxEnv.inst().init(this, null, null, null)
    }
}
