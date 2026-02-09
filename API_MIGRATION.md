# Frontend API Migration Guide

This document lists all files that need to be updated to use the centralized API configuration.

## Files to Update

The following files contain hardcoded `http://localhost:5000` URLs that need to be updated:

### Components (11 files)

1. **AuthForm.jsx** (2 occurrences)
   - Lines 43-44: Login/Register endpoints

2. **Dashboard.jsx** (10 occurrences)
   - Line 46: Quiz endpoint
   - Line 64: Generate roadmap
   - Lines 202-217: Multiple parallel fetches
   - Line 364: Choose roadmap
   - Line 391: Projects
   - Line 437: Delete project

3. **GoalTracker.jsx** (7 occurrences)
   - Line 39: Fetch goals
   - Line 57: Goal stats
   - Lines 170-171: Create/Update goal
   - Line 207: Toggle goal
   - Line 235: Delete goal
   - Line 257: Toggle milestone

4. **ResumeBuilder.jsx** (4 occurrences)
   - Line 47: Fetch user
   - Line 53: Fetch resumes
   - Lines 120-121: Create/Update resume

5. **UserProfile.jsx** (1 occurrence)
   - Line 35: Fetch user profile

6. **SkillsManager.jsx** (2 occurrences)
   - Line 52: Fetch user
   - Line 141: Update skills

7. **ReportCard.jsx** (1 occurrence)
   - Line 33: Generate report card

8. **CreatePost.jsx** (2 occurrences)
   - Line 21: Fetch posts
   - Line 42: Create post

9. **AnalyticsDashboard.jsx** (2 occurrences)
   - Line 28: Dashboard analytics
   - Line 45: Leaderboard

10. **AIAssistant.jsx** (1 occurrence)
    - Line 64: AI chat endpoint

## Migration Strategy

### Option 1: Use API Helper (Recommended)

Import and use the `apiRequest` helper:

```javascript
import { apiRequest, getApiUrl } from '../utils/api';

// Instead of:
const response = await fetch('http://localhost:5000/api/users/me', {
  headers: { Authorization: `Bearer ${token}` }
});

// Use:
const response = await apiRequest('/api/users/me');
```

### Option 2: Use Config Directly

Import the config:

```javascript
import config from '../config';

// Instead of:
const response = await fetch('http://localhost:5000/api/users/me', {
  headers: { Authorization: `Bearer ${token}` }
});

// Use:
const response = await fetch(`${config.apiUrl}/api/users/me`, {
  headers: { Authorization: `Bearer ${token}` }
});
```

## Quick Fix Script

You can use find-replace in your editor:

**Find:** `http://localhost:5000`
**Replace:** `${config.apiUrl}`

Then add at the top of each file:
```javascript
import config from '../config';
```

## Verification

After updating, verify:
1. Local development still works (localhost:5173)
2. API calls use environment-based URLs
3. No hardcoded localhost:5000 references remain

## Files Already Configured

- ✅ `vite.config.js` - Proxy configuration for development
- ✅ `config.js` - Centralized API configuration
- ✅ `utils/api.js` - API helper utility
