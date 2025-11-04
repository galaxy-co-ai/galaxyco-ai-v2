# New Side Project Creator
# Save as: C:\Users\Owner\workspace\scripts\new-side-project.ps1

param(
    [Parameter(Mandatory=$true)]
    [string]$name,
    
    [string]$template = "blank",
    
    [string]$description = ""
)

$activeBase = "C:\Users\Owner\workspace\Side_Projects\active"
$templateBase = "C:\Users\Owner\workspace\Side_Projects\templates"

# Get current year-month
$yearMonth = Get-Date -Format "yyyy-MM"

# Validate name format
if ($name -match "^\d{4}-\d{2}-") {
    Write-Host "⚠️  Name already has date prefix, using as-is" -ForegroundColor Yellow
    $projectName = $name
} else {
    $projectName = "$yearMonth-$name"
}

# Validate name format (lowercase, hyphens only)
if ($projectName -notmatch "^[0-9]{4}-[0-9]{2}-[a-z0-9-]+$") {
    Write-Host "`n❌ Invalid project name format!" -ForegroundColor Red
    Write-Host "`nRules:" -ForegroundColor Yellow
    Write-Host "  - Lowercase only" -ForegroundColor White
    Write-Host "  - Hyphens only (no underscores or spaces)" -ForegroundColor White
    Write-Host "  - No special characters" -ForegroundColor White
    Write-Host "`nExample: ai-resume-builder" -ForegroundColor Green
    Write-Host "Will become: $yearMonth-ai-resume-builder`n" -ForegroundColor Green
    exit 1
}

$projectPath = Join-Path $activeBase $projectName

# Check if already exists
if (Test-Path $projectPath) {
    Write-Host "❌ Project already exists: $projectName" -ForegroundColor Red
    exit 1
}

Write-Host "`n🚀 Creating new side project: $projectName" -ForegroundColor Cyan
Write-Host ""

# Create directory structure
New-Item -ItemType Directory -Path $projectPath | Out-Null
New-Item -ItemType Directory -Path "$projectPath\.cursor" | Out-Null
New-Item -ItemType Directory -Path "$projectPath\src" | Out-Null
New-Item -ItemType Directory -Path "$projectPath\tests" | Out-Null
New-Item -ItemType Directory -Path "$projectPath\docs" | Out-Null

Write-Host "✅ Created directory structure" -ForegroundColor Green

# Create .cursor/context.md
$contextContent = @"
# $projectName

**Started:** $(Get-Date -Format "MMMM yyyy")  
**Status:** 🟢 Active Development  
**Type:** [Web App / API / Tool / Experiment]

## What is this?
$description

## Tech Stack
- [List technologies]

## Goals
1. [Primary goal]
2. [Secondary goal]

## Status
- [ ] Initial setup
- [ ] Core feature 1
- [ ] Core feature 2
- [ ] Production ready
"@

Set-Content -Path "$projectPath\.cursor\context.md" -Value $contextContent
Write-Host "✅ Created .cursor/context.md" -ForegroundColor Green

# Create .cursor/rules.md
$rulesContent = @"
# $projectName - Cursor Rules

## Universal Standards
**Location:** C:\Users\Owner\workspace\devops-hq\.cursor\master-context.md
**Apply:** All universal patterns and preferences

## Project-Specific Rules

### Tech Stack
[Your specific tech stack rules]

### Code Style
[Any project-specific style preferences]

### Testing
[Testing requirements]

### Deployment
[Where/how to deploy]
"@

Set-Content -Path "$projectPath\.cursor\rules.md" -Value $rulesContent
Write-Host "✅ Created .cursor/rules.md" -ForegroundColor Green

# Create README.md
$readmeContent = @"
# $projectName

**Started:** $(Get-Date -Format "MMMM d, yyyy")  
**Status:** 🟢 Active

## Quick Start

\`\`\`bash
# Install dependencies
pnpm install

# Run development
pnpm dev

# Run tests
pnpm test
\`\`\`

## What is this?
$description

## Why?
[Motivation for building this]

## Tech Stack
[List technologies]
"@

Set-Content -Path "$projectPath\README.md" -Value $readmeContent
Write-Host "✅ Created README.md" -ForegroundColor Green

# Create .gitignore
$gitignoreContent = @"
node_modules/
.env
.env.local
dist/
build/
.DS_Store
*.log
.cursor/state/
.vscode/
*.swp
*.swo
"@

Set-Content -Path "$projectPath\.gitignore" -Value $gitignoreContent
Write-Host "✅ Created .gitignore" -ForegroundColor Green

# Initialize git
Push-Location $projectPath
git init | Out-Null
git add . | Out-Null
git commit -m "feat: initial project setup for $projectName" | Out-Null
Pop-Location
Write-Host "✅ Initialized git repository" -ForegroundColor Green

Write-Host "`n🎉 Project created successfully!" -ForegroundColor Cyan
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "  1. cd $projectPath" -ForegroundColor White
Write-Host "  2. cursor ." -ForegroundColor White
Write-Host "`nOr use quick switcher:" -ForegroundColor Yellow
Write-Host "  .\scripts\switch-project.ps1 $projectName`n" -ForegroundColor White

# Ask if user wants to open now
$open = Read-Host "Open project in Cursor now? (y/n)"
if ($open -eq "y" -or $open -eq "Y") {
    Write-Host "🚀 Opening $projectName..." -ForegroundColor Green
    cursor $projectPath
}

