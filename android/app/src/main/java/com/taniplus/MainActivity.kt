package com.taniplus

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.lynx.tasm.LynxViewBuilder

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Construct LynxView using builder
        val viewBuilder = LynxViewBuilder()
        val lynxView = viewBuilder.build(this)

        // Load the bundle locally from assets
        lynxView.renderTemplateUrl("file:///android_asset/main.lynx.bundle", "")

        setContentView(lynxView)
    }
}
