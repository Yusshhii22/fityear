# FitYear one-command deploy: bumps the service-worker cache version,
# commits all changes, and pushes to GitHub (Pages redeploys automatically).
# Usage:  .\deploy.ps1 "Describe what changed"
param([Parameter(Mandatory = $true)][string]$Message)

$root = $PSScriptRoot
$swPath = Join-Path $root "sw.js"

# Bump fityear-vN -> fityear-v(N+1) so installed PWAs pick up the new files
$sw = Get-Content $swPath -Raw -Encoding UTF8
if ($sw -notmatch 'fityear-v(\d+)') { throw "Could not find cache version in sw.js" }
$next = [int]$Matches[1] + 1
$sw = $sw -replace 'fityear-v\d+', "fityear-v$next"
Set-Content $swPath $sw -Encoding utf8 -NoNewline

git -C $root add -A
git -C $root commit -m $Message
if ($LASTEXITCODE -ne 0) { throw "Commit failed - is there anything to deploy?" }
git -C $root push
if ($LASTEXITCODE -ne 0) { throw "Push failed - check your network/credentials" }

Write-Host ""
Write-Host "Deployed (cache v$next). Live in ~1-2 minutes at:"
Write-Host "https://yusshhii22.github.io/fityear/"
