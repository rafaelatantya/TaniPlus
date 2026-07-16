Write-Host "=== STARTING TANIPLUS APK BUILD PIPELINE ===" -ForegroundColor Green

# 1. Compile frontend ReactLynx bundle
Write-Host "[1/4] Compiling ReactLynx frontend..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "ReactLynx compilation failed! Aborting."
    exit $LASTEXITCODE
}

# 2. Prepare Android assets folder
Write-Host "[2/4] Preparing Android assets..." -ForegroundColor Cyan
$assetsDir = "android/app/src/main/assets"
if (!(Test-Path $assetsDir)) {
    New-Item -ItemType Directory -Path $assetsDir -Force | Out-Null
}

# Copy the compiled bundle
Copy-Item "dist/main.lynx.bundle" "$assetsDir/main.lynx.bundle" -Force
Write-Host "Successfully copied bundle to assets folder." -ForegroundColor Green

# 3. Locate Android SDK
Write-Host "[3/4] Locating Android SDK..." -ForegroundColor Cyan
$sdkPath = ""
if ($env:ANDROID_HOME) {
    $sdkPath = $env:ANDROID_HOME
} else {
    $defaultPath = "$env:LOCALAPPDATA\Android\Sdk"
    if (Test-Path $defaultPath) {
        $sdkPath = $defaultPath
        $env:ANDROID_HOME = $sdkPath
        Write-Host "Found Android SDK at $sdkPath" -ForegroundColor Green
    } else {
        Write-Host "WARNING: Android SDK not found in default locations. Gradle build might fail if ANDROID_HOME is not set." -ForegroundColor Yellow
    }
}

# 4. Build APK using Gradle
Write-Host "[4/4] Building APK with Gradle..." -ForegroundColor Cyan
cd android

if (Test-Path "gradlew.bat") {
    .\gradlew.bat assembleDebug
} else {
    Write-Host "WARNING: Gradle wrapper not found. Running assembleDebug via gradle..." -ForegroundColor Yellow
    gradle assembleDebug
}

if ($LASTEXITCODE -eq 0) {
    cd ..
    $apkSource = "android/app/build/outputs/apk/debug/app-debug.apk"
    if (Test-Path $apkSource) {
        Copy-Item $apkSource "TaniPlus-debug.apk" -Force
        Write-Host "=== APK BUILD SUCCESSFUL ===" -ForegroundColor Green
        Write-Host "Your APK is ready: TaniPlus-debug.apk" -ForegroundColor Cyan
    } else {
        Write-Error "APK built successfully but output file was not found at expected location!"
    }
} else {
    cd ..
    Write-Error "Gradle build failed!"
    exit $LASTEXITCODE
}
