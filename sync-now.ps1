param(
    [string]$Message = "Update travel planner"
)

$env:PATH = "C:\Users\Shapi\AppData\Local\Programs\Git\cmd;C:\Program Files\Git\cmd;C:\Program Files\GitHub CLI;" + $env:PATH

git config user.name "MaxShap98"
git config user.email "MaxShap98@users.noreply.github.com"
gh auth setup-git

git add -A
$status = git status --porcelain
if ($status) {
    $timeStr = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    git commit -m "$Message ($timeStr)"
    git push origin master
    Write-Host "Pushed changes to GitHub successfully!"
} else {
    Write-Host "No changes to commit. Everything up to date on GitHub!"
}
