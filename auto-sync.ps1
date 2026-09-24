# Auto Git Sync - Watches for file changes and pushes automatically to GitHub
$env:PATH = "C:\Program Files\Git\cmd;C:\Program Files\GitHub CLI;" + $env:PATH

$Remote = "origin"
$Branch = "master"
$DebounceSeconds = 2

Write-Host "========================================="
Write-Host " 🚀 Auto Git Push to GitHub is RUNNING!"
Write-Host " Target: https://github.com/MaxShap98/travel-website ($Branch)"
Write-Host " Every saved change will be pushed automatically."
Write-Host "========================================="

$projectPath = (Get-Location).Path
$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $projectPath
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true
$watcher.Filter = "*.*"

$lastSync = [DateTime]::MinValue

while ($true) {
    $change = $watcher.WaitForChanged([System.IO.WatcherChangeTypes]::All, 1500)
    if ($change.TimedOut) {
        continue
    }

    $path = $change.Name
    # Ignore internal git and build folders
    if ($path -match "^(\.git|node_modules|dist|\.system_generated)" -or $path -match "\.log$") {
        continue
    }

    $now = [DateTime]::UtcNow
    if (($now - $lastSync).TotalSeconds -lt $DebounceSeconds) {
        continue
    }

    Start-Sleep -Milliseconds 800 # Short buffer to let editor finish writing
    $status = git status --porcelain
    if ($status) {
        $timeStr = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
        Write-Host "[$timeStr] Change detected: $path"
        Write-Host "Staging, committing and pushing to GitHub..."
        git add -A
        git commit -m "Auto-sync: update $path ($timeStr)"
        git push $Remote $Branch
        Write-Host "[$timeStr] Push to GitHub completed successfully!"
        $lastSync = [DateTime]::UtcNow
    }
}
