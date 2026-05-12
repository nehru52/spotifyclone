# How to Force Refresh Your Expo App

## Why changes take time to reflect:
- React Native uses Fast Refresh which sometimes caches old code
- Metro bundler caches compiled JavaScript
- Native modules may need a full rebuild

## Quick Fix (Try this first):
1. In the Expo app, shake your device or press `Ctrl+M` (Android) / `Cmd+D` (iOS)
2. Select "Reload" from the menu

## Full Cache Clear (If quick fix doesn't work):

### Option 1: Clear Metro Cache
```bash
cd "d:\spotify clone directory\spotify-clone"
npx expo start -c
```
The `-c` flag clears the cache.

### Option 2: Manual Cache Clear
```bash
cd "d:\spotify clone directory\spotify-clone"
rm -rf node_modules/.cache
rm -rf .expo
npx expo start
```

### Option 3: Complete Reset (Nuclear option)
```bash
cd "d:\spotify clone directory\spotify-clone"
rm -rf node_modules
rm -rf .expo
npm install
npx expo start -c
```

## For Windows (use these commands instead):
```cmd
cd "d:\spotify clone directory\spotify-clone"
rmdir /s /q node_modules\.cache
rmdir /s /q .expo
npx expo start -c
```

## After clearing cache:
1. Wait for Metro bundler to finish
2. Press `r` in the terminal to reload
3. Or shake device and select "Reload"

## Changes Made:
- ✅ Fixed tab icons and labels (using .includes() instead of exact match)
- ✅ Reduced header top margin from 35px to 8px
- ✅ Reduced header bottom padding from 16px to 8px  
- ✅ Added dark background (#001a33) to all layout levels
- ✅ Added StatusBar background color
- ✅ Added contentStyle to prevent white screens

The white area with route names should disappear once the cache is cleared!
