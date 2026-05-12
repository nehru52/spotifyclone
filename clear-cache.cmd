@echo off
echo Clearing Expo cache...
cd /d "d:\spotify clone directory\spotify-clone"

if exist "node_modules\.cache" (
    echo Removing node_modules\.cache...
    rmdir /s /q "node_modules\.cache"
)

if exist ".expo" (
    echo Removing .expo folder...
    rmdir /s /q ".expo"
)

echo Cache cleared!
echo.
echo Starting Expo with clean cache...
npx expo start -c
