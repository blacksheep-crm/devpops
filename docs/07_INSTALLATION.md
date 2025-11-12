# Installation Guide

[← Back to Index](./DEVPOPS_INDEX.md) | [← Features](./06_FEATURES.md)

## Prerequisites

### Minimum Requirements

| Component | Requirement |
|-----------|-------------|
| Siebel Version | 20.12 or higher |
| Siebel Tools | Required for SIF import |
| REST API | Enabled with anonymous auth |
| Browser | Chrome/Edge/Firefox (latest) |
| User Role | Developer with Admin rights |

### Version Compatibility

| devpops Version | Siebel Version | Features Available |
|----------------|----------------|-------------------|
| 24.12 | 24.x | All features |
| 24.12 | 23.6+ | All except latest optimizations |
| 24.12 | 20.12-23.5 | Core features only |

---

## Installation Steps

### Step 1: Prepare Workspace

1. **Create New Workspace:**
   ```
   Name: devpops_install
   Base: Latest delivered
   ```

2. **Check Out Objects (if updating):**
   - Check for existing devpops objects
   - Lock objects if found

### Step 2: Import SIF Files

**IMPORTANT:** Import in this exact order:

1. **devpops_V52.sif**
   ```
   Tools → Import/Export → Import from Archive
   File: devpops_V52.sif
   Options: Overwrite
   ```

2. **DependencyFinder.sif**
   ```
   File: DependencyFinder.sif
   Options: Merge
   ```

3. **BCRMImportedObjectPropertyListViewV2.sif** (Siebel 23.7+ only)
   ```
   File: BCRMImportedObjectPropertyListViewV2.sif
   Options: Merge
   ```

4. **IO_Base BCRM Modified Object.sif**
   ```
   File: IO_Base BCRM Modified Object.sif
   Options: Merge
   ```

5. **Base BCRM Repository Details.sif**
   ```
   File: Base BCRM Repository Details.sif
   Options: Merge
   ```

### Step 3: Configure Views

1. **Add View to Screen:**
   ```
   Screen: Site Map (or custom screen)
   View: BCRM Modified Objects List View
   Sequence: [Appropriate number]
   ```

2. **Register with Responsibility:**
   ```
   View: BCRM Modified Objects List View
   Responsibility: Siebel Administrator (or custom)
   ```

### Step 4: Import Business Service

1. **Import FWK Runtime XML:**
   ```
   Navigate to: Administration - Application → Client-side Business Service
   Import: FWK Runtime.xml
   ```

2. **Configure BCRM Server Manager Service** (Optional):
   ```
   Business Service: BCRM Server Manager Service
   User Properties:
     Enterprise = SIEBEL
     Gateway = gateway.server.com
     Port = 2320
   ```

### Step 5: Register Business Services

**Application User Properties:**

1. Navigate to: Administration - Application → Applications
2. Query for your application
3. Add User Properties:

```
Name: ClientBusinessService1
Value: FWK Runtime

Name: ClientBusinessService2
Value: BCRM Server Manager Service
```

### Step 6: Configure REST API

1. **Navigate to:** Administration - Web Services → REST Inbound Data Access Service

2. **Register Business Objects:**
   - BCRM Repository Details
   - Runtime Repository Details
   - Repository Business Object
   - Admin Import/Export (for SIF viewer)

3. **Verify Anonymous Access:**
   ```
   Administration - Web Services → REST Authentication
   Anonymous User: ANONUSER (or configured user)
   ```

### Step 7: Deploy JavaScript Files

1. **Copy devpops.js:**
   ```
   Source: devpops.js
   Destination: <web_server>/siebel/custom/devpops.js
   ```

2. **Copy SiebelQueryLang.js:**
   ```
   Source: SiebelQueryLang.js
   Destination: <web_server>/siebel/scripts/3rdParty/SiebelQueryLang.js
   ```

3. **Update postload.js:**
   ```
   File: <web_server>/siebel/custom/postload.js
   Action: Append code from provided postload.js
   ```

   **Or if no existing postload.js:**
   ```
   Copy entire postload.js to <web_server>/siebel/custom/
   ```

### Step 8: Deploy CSS

1. **Copy CSS file:**
   ```
   Source: blacksheep.css
   Destination: <web_server>/files/custom/blacksheep.css
   ```

### Step 9: Register in Manifest

1. Navigate to: Administration - Application → Manifest Files
2. Create New Record:
   ```
   Name: devpops
   Type: Common
   ```

3. Add File:
   ```
   File Name: siebel/custom/devpops.js
   ```

4. Navigate to: Administration - Application → Manifest Administration
5. Add Expression:
   ```
   Expression Name: devpops
   Level: Application UI, Files
   Operator/Type: Application/Common
   Object Name: [Your Application]
   Platform Name: Desktop
   Usage Type: PLATFORM INDEPENDENT
   ```

### Step 10: Configure System Preferences

**For Full Functionality:**

```sql
UPDATE S_SYS_PREF
SET VAL = 'TRUE'
WHERE SYS_PREF_CD = 'Runtime Scripts System Access';

COMMIT;
```

**Or via UI:**
1. Navigate to: Administration - System Preferences
2. Query for: Runtime Scripts System Access
3. Set Value: TRUE

### Step 11: Deliver Repository Changes

1. **In Tools:**
   ```
   Tools → Compile/Deliver
   Deliver Workspace
   ```

2. **Restart Services:**
   ```
   Application Object Manager (AOM)
   Gateway Service (if modified)
   ```

### Step 12: Configure jqGrid (Optional)

**For Lizard Button on List Applets:**

1. **Edit:** `<web_server>/siebel/scripts/siebel/custom/jqgridrenderer.js`

2. **Add in ShowUI function:**
   ```javascript
   ShowUI: function() {
       // ... existing code ...
       if (typeof BCRMAddLizardButton === "function") {
           BCRMAddLizardButton(this.GetPM());
       }
   }
   ```

3. **Add in BindData function:**
   ```javascript
   BindData: function() {
       // ... existing code ...
       if (typeof BCRMAutoResizeHandler === "function") {
           BCRMAutoResizeHandler(this.GetPM());
       }
   }
   ```

### Step 13: Setup Log Viewer (Optional)

1. **Edit logviewer.html:**
   ```javascript
   // Line 15-20: Update with your server
   var hostname = "your-ai-server.com";
   var port = "443";
   ```

2. **Deploy:**
   ```
   Copy to: <ai_server>/applicationcontainer_external/webapps/ROOT/
   ```

3. **Create Symlink:**
   ```bash
   ln -s /siebel/ai/applicationcontainer_external/logs \
         /siebel/ai/applicationcontainer_external/siebelwebroot/smc/logs
   ```

---

## Post-Installation Configuration

### Verify Installation

1. **Clear Browser Cache**

2. **Login to Siebel**

3. **Check Debug Menu:**
   - Look for floating cube icon
   - Or press Ctrl+Alt+D

4. **Test Basic Features:**
   ```
   Debug Menu → Tools → About devpops
   Should show: Version 24.12
   ```

### Configure User Preferences

1. **Set Dark Mode** (Optional):
   ```
   Debug Menu → UI → Toggle Dark Mode
   ```

2. **Customize Debug Menu:**
   ```
   Right-click Debug Menu → Customize
   ```

3. **Configure Storage:**
   ```
   Debug Menu → Tools → Storage Manager
   ```

### Performance Tuning

1. **REST API Optimization:**
   ```
   Administration - Server Configuration → Parameters
   REST_MAXPAGESIZE = 200
   REST_TIMEOUT = 60000
   ```

2. **Browser Settings:**
   - Enable hardware acceleration
   - Increase memory limits
   - Disable unnecessary extensions

---

## Update Installation

### From Previous Version

1. **Backup Current Installation:**
   ```
   Export workspace
   Backup JavaScript files
   Save user preferences
   ```

2. **Import New SIFs:**
   - Use Merge option
   - Resolve conflicts

3. **Update JavaScript:**
   - Replace devpops.js
   - Merge postload.js changes

4. **Clear Cache:**
   ```javascript
   localStorage.clear();
   sessionStorage.clear();
   ```

### Version Migration

| From Version | To Version | Special Steps |
|--------------|------------|---------------|
| < 23.6 | 24.12 | Enable REST API first |
| 23.6 | 24.12 | Import new SIFs |
| 24.5 | 24.12 | Update JS files only |

---

## Troubleshooting

### Common Issues

#### Debug Menu Not Appearing

**Symptoms:** No floating cube icon

**Solutions:**
1. Check manifest registration
2. Verify devpops.js loaded:
   ```javascript
   console.log(typeof BCRMCreateDebugMenu);
   // Should output: "function"
   ```
3. Clear browser cache
4. Check browser console for errors

#### REST API Errors

**Symptoms:** Dependency Finder not working

**Solutions:**
1. Verify REST API enabled:
   ```
   Administration - Web Services → REST Services
   Status: Active
   ```

2. Check authentication:
   ```
   Anonymous user configured
   Or valid credentials provided
   ```

3. Test REST endpoint:
   ```
   Browser: https://server/siebel/v1.0/data/
   Should return JSON response
   ```

#### SIF Import Failures

**Symptoms:** Import errors or missing objects

**Solutions:**
1. Import in correct order
2. Check for locked objects
3. Verify workspace not read-only
4. Check Tools version compatibility

#### Business Service Not Found

**Symptoms:** "Service not found" errors

**Solutions:**
1. Verify BS registration in Application User Props
2. Check FWK Runtime imported correctly
3. Restart AOM after changes

#### JavaScript Errors

**Symptoms:** Console errors, features not working

**Solutions:**
1. Check file paths correct
2. Verify no syntax errors in merged postload.js
3. Ensure third-party CDNs accessible
4. Check for conflicting customizations

### Advanced Troubleshooting

#### Enable Debug Logging

```javascript
// In browser console
window.BCRM_DEBUG = true;
localStorage.setItem("BCRM_DEBUG", "true");
```

#### Check Version Compatibility

```javascript
// In browser console
console.log("devpops version:", devpops_version);
console.log("FWK version:", BCRMGetFWKVersion());
console.log("Siebel version:", SiebelApp.S_App.GetSiebelVersion());
```

#### Reset to Defaults

```javascript
// Clear all devpops settings
localStorage.removeItem("bcrm_menu_config");
localStorage.removeItem("bcrm_storage");
sessionStorage.clear();
location.reload();
```

---

## Uninstallation

### Complete Removal

1. **Export Modified Objects** (if needed)

2. **Remove from Repository:**
   ```
   Delete all objects with prefix "BCRM"
   Delete project "blacksheep devpops"
   ```

3. **Remove Files:**
   ```
   Delete: /siebel/custom/devpops.js
   Delete: /files/custom/blacksheep.css
   Remove: postload.js modifications
   Delete: /siebel/scripts/3rdParty/SiebelQueryLang.js
   ```

4. **Remove Configuration:**
   ```
   Application User Properties
   Manifest entries
   System Preferences (if modified)
   ```

5. **Deliver and Restart**

### Partial Disable

To temporarily disable without uninstalling:

1. **Remove from Manifest Administration**
2. **Or set in postload.js:**
   ```javascript
   window.BCRM_DISABLED = true;
   ```

---

## Support & Resources

### Documentation
- User Guide: ug.pdf
- Developer Guide: dg.pdf
- GitHub: https://github.com/blacksheep-crm/devpops

### Videos
- YouTube Playlist: [Available in README]
- Workflow Visualizer Demo
- Dependency Finder Tutorial

### Contact
- Issues: GitHub Issues
- Company: blacksheep IT consulting GmbH

---

## Security Notes

⚠️ **WARNING:** devpops is for DEVELOPMENT/TEST only

**Security Considerations:**
- `runcmd` allows system command execution
- Server Manager access requires careful control
- REST API should use authentication in production
- Audit all usage of administrative features

**Best Practices:**
1. Don't install in production
2. Restrict access via responsibilities
3. Monitor usage logs
4. Regular security reviews

---

## Next Steps

- Test features → [Features Guide](./06_FEATURES.md)
- Technical details → [Technical Reference](./08_TECHNICAL.md)
- Start using → [Features Guide](./06_FEATURES.md#keyboard-shortcuts)

---

[← Features](./06_FEATURES.md) | [Back to Index](./DEVPOPS_INDEX.md) | [Technical Reference →](./08_TECHNICAL.md)