@echo off
echo === STARTING TANIPLUS APK BUILD PIPELINE ===
echo [1/3] Compiling ReactLynx frontend...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo ReactLynx compilation failed!
    exit /b %ERRORLEVEL%
)

echo [2/3] Copying bundle to Android assets...
if not exist "android\app\src\main\assets" (
    mkdir "android\app\src\main\assets"
)
copy /y "dist\main.lynx.bundle" "android\app\src\main\assets\main.lynx.bundle"

echo [3/3] Building APK using Gradle...
cd android
if exist "gradlew.bat" (
    call gradlew.bat assembleDebug
) else (
    echo WARNING: Gradle wrapper not found. Running assembleDebug via gradle...
    call gradle assembleDebug
)

if %ERRORLEVEL% neq 0 (
    echo Gradle build failed!
    cd ..
    exit /b %ERRORLEVEL%
)

cd ..
if exist "android\app\build\outputs\apk\debug\app-debug.apk" (
    copy /y "android\app\build\outputs\apk\debug\app-debug.apk" "TaniPlus-debug.apk"
    echo === APK BUILD SUCCESSFUL ===
    echo Your APK is ready: TaniPlus-debug.apk
) else (
    echo Gradle compilation finished but APK could not be found at target path.
)
