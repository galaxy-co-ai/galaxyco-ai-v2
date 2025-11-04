# Quick Project Switcher
# Save as: C:\Users\Owner\workspace\scripts\switch-project.ps1

param(
    [string]$project,
    [switch]$list
)

$activeBase = "C:\Users\Owner\workspace\Side_Projects\active"
$mainProject = "C:\Users\Owner\workspace\galaxyco-ai-2.0"

function Show-Projects {
    Write-Host "`n🗂️  Available Projects:" -ForegroundColor Cyan
    Write-Host "`nMain Project:" -ForegroundColor Yellow
    Write-Host "  galaxyco" -ForegroundColor Green
    
    if (Test-Path $activeBase) {
        Write-Host "`nSide Projects:" -ForegroundColor Yellow
        Get-ChildItem $activeBase -Directory | ForEach-Object {
            $status = "🟢"
            if (Test-Path "$($_.FullName)\README.md") {
                $readme = Get-Content "$($_.FullName)\README.md" -Raw
                if ($readme -match "Status.*🟡") { $status = "🟡" }
                if ($readme -match "Status.*✅") { $status = "✅" }
                if ($readme -match "Status.*🔴") { $status = "🔴" }
            }
            Write-Host "  $status $($_.Name)" -ForegroundColor Green
        }
    }
    Write-Host ""
}

if ($list) {
    Show-Projects
    exit
}

if (-not $project) {
    Write-Host "`n❌ Please specify a project name" -ForegroundColor Red
    Show-Projects
    Write-Host "Usage:" -ForegroundColor Yellow
    Write-Host "  .\scripts\switch-project.ps1 <project-name>" -ForegroundColor White
    Write-Host "  .\scripts\switch-project.ps1 -list" -ForegroundColor White
    Write-Host "`nExamples:" -ForegroundColor Yellow
    Write-Host "  .\scripts\switch-project.ps1 galaxyco" -ForegroundColor White
    Write-Host "  .\scripts\switch-project.ps1 2025-11-ai-resume-builder`n" -ForegroundColor White
    exit 1
}

if ($project -eq "galaxyco" -or $project -eq "galaxyco-ai-2.0" -or $project -eq "main") {
    Write-Host "🚀 Opening GalaxyCo.ai (main project)..." -ForegroundColor Green
    cursor $mainProject
    exit
}

$projectPath = Join-Path $activeBase $project

if (Test-Path $projectPath) {
    Write-Host "🚀 Opening $project..." -ForegroundColor Green
    cursor $projectPath
} else {
    Write-Host "`n❌ Project not found: $project" -ForegroundColor Red
    Show-Projects
    exit 1
}

