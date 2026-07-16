package com.taniplus

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.lynx.tasm.LynxView

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Construct LynxView directly
        val lynxView = LynxView(this)

        // Load the bundle locally from assets
        lynxView.loadTemplate("file:///android_asset/main.lynx.bundle", null)

        setContentView(lynxView)
    }
}
