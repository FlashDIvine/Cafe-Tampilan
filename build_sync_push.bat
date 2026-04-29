@echo off
echo Running build...
call npm run build
echo Syncing capacitor...
call npm run cap -- sync
echo Pushing to git...
git add .
git commit -m "Update web assets and sync to Capacitor"
git push
echo Done!
