# One-click deployment script to Firebase Hosting
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host " 🚀 מעלה את הגרסה העדכנית ביותר ל-Firebase Hosting..." -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ שגיאה בבניית הפרויקט!" -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host "`n📤 מעלה ל-Firebase Hosting (maxventure-6e3dd)..." -ForegroundColor Yellow
npx -p firebase-tools firebase deploy --only hosting

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n========================================================" -ForegroundColor Green
    Write-Host " ✅ העלאה הסתיימה בהצלחה! האתר מעודכן:" -ForegroundColor Green
    Write-Host " 👉 https://maxventure-6e3dd.web.app/" -ForegroundColor Green
    Write-Host "========================================================" -ForegroundColor Green
}
