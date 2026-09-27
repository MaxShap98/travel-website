@echo off
chcp 65001 >nul
echo ========================================================
echo  🚀 מעלה את הגרסה העדכנית ביותר ל-Firebase Hosting...
echo ========================================================
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ❌ שגיאה בבניית הפרויקט
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo 📤 מעלה לשרת הענן של Firebase Hosting (maxventure-6e3dd)...
call npx -p firebase-tools firebase deploy --only hosting

echo.
echo ========================================================
echo  ✅ הסיום בהצלחה! האתר עודכן ב-https://maxventure-6e3dd.web.app/
echo ========================================================
pause
