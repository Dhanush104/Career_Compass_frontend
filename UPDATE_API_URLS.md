# Update Frontend API URLs Script

This PowerShell script will update all hardcoded localhost URLs to use the centralized config.

Run this script from the career-compass-frontend directory:

```powershell
# Navigate to frontend directory
cd "d:\career compass\career-compass-frontend\src\components"

# List of files to update (already updated: AuthForm.jsx)
$filesToUpdate = @(
    "Dashboard.jsx",
    "GoalTracker.jsx",
    "ResumeBuilder.jsx",
    "UserProfile.jsx",
    "SkillsManager.jsx",
    "ReportCard.jsx",
    "CreatePost.jsx",
    "AnalyticsDashboard.jsx",
    "AIAssistant.jsx"
)

foreach ($file in $filesToUpdate) {
    if (Test-Path $file) {
        Write-Host "Updating $file..." -ForegroundColor Yellow
        
        # Read content
        $content = Get-Content $file -Raw
        
        # Check if config is already imported
        if ($content -notmatch "import config from") {
            # Add import after other imports
            $content = $content -replace "(import .+ from .+;`r?`n)", "`$1import config from '../config';`r`n"
        }
        
        # Replace localhost URLs
        $content = $content -replace "http://localhost:5000", "`${config.apiUrl}"
        
        # Write back
        Set-Content $file -Value $content
        
        Write-Host "✓ Updated $file" -ForegroundColor Green
    } else {
        Write-Host "✗ File not found: $file" -ForegroundColor Red
    }
}

Write-Host "`nDone! Please review the changes." -ForegroundColor Cyan
```

## Manual Update Instructions

If you prefer to update manually, for each file:

1. Add import at the top:
   ```javascript
   import config from '../config';
   ```

2. Replace all instances of:
   ```javascript
   'http://localhost:5000'
   ```
   
   With:
   ```javascript
   `${config.apiUrl}`
   ```

## Files Already Updated

- ✅ AuthForm.jsx

## Files Remaining

- [ ] Dashboard.jsx (10 occurrences)
- [ ] GoalTracker.jsx (7 occurrences)
- [ ] ResumeBuilder.jsx (4 occurrences)
- [ ] UserProfile.jsx (1 occurrence)
- [ ] SkillsManager.jsx (2 occurrences)
- [ ] ReportCard.jsx (1 occurrence)
- [ ] CreatePost.jsx (2 occurrences)
- [ ] AnalyticsDashboard.jsx (2 occurrences)
- [ ] AIAssistant.jsx (1 occurrence)
