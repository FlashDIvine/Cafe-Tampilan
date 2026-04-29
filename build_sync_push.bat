@echo off
echo === Building React app ===
call npm run build
echo === Syncing to Capacitor ===
call npm run cap -- sync
echo === Pushing to GitHub ===
git add .
git commit -m "Fix mobile horizontal overflow: add min-w-0, flex-shrink-0, overflow-hidden, box-sizing"
git push
echo === All done! ===
