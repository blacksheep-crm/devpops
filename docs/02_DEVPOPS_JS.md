# devpops.js Analysis

[← Back to Index](./DEVPOPS_INDEX.md) | [← Architecture](./01_ARCHITECTURE.md)

## Overview

**File:** devpops.js
**Lines:** 12,244
**Functions:** 100+
**Purpose:** Core client-side library providing developer productivity tools

## Global Configuration

```javascript
var devpops_config = {
    ses_home: "C:\\Siebel\\ses\\siebsrvr"  // Server home directory
};
```

## Function Categories

### 1. X-Ray Functions (Metadata Visualization)

| Function | Purpose |
|----------|---------|
| `BCRMApplyDefaultXray()` | Apply X-Ray to current view |
| `BCRMShowControls()` | Show control names in form labels |
| `BCRMShowBCFields()` | Display BC field names |
| `BCRMShowTableColumns()` | Show physical table/column names |
| `BCRMRunSilentXRay()` | Silent scan with clipboard export |
| `BCRMExportXRayClipboard()` | Export X-Ray data (CSV/HTML/Formatted) |
| `BCRMCacheXRayData()` | Cache X-Ray results |
| `BCRMGetXRayData()` | Retrieve cached X-Ray data |

**X-Ray Data Structure:**
```javascript
BCRM_XRAY_DATA = {
    "View Name": {
        "Applet Name": {
            fields: [{
                name: "Field Name",
                control: "Control Name",
                table: "S_TABLE",
                column: "COL_NAME"
            }]
        }
    }
}
```

### 2. Debug Menu System

| Function | Purpose |
|----------|---------|
| `BCRMGetSLMenu()` | Generate Shoelace menu structure (800+ lines) |
| `BCRMCreateDebugMenu()` | Create floating debug toolbar |
| `BCRMCustomizeDebugMenu()` | Menu customization interface |
| `BCRMButtonizeDebugMenu()` | Convert menu to button mode |
| `BCRMToggleDebugMenu()` | Show/hide debug menu |

**Menu Structure Example:**
```javascript
{
    type: 'menu',
    label: 'X-Ray',
    items: [
        { label: 'Show Controls', action: 'BCRMShowControls' },
        { label: 'Show BC Fields', action: 'BCRMShowBCFields' },
        { type: 'divider' },
        { label: 'Silent Export', action: 'BCRMRunSilentXRay' }
    ]
}
```

### 3. Workspace Management

| Function | Purpose |
|----------|---------|
| `BCRMWSFastInspect()` | Quick workspace inspection |
| `BCRMWSGetModData()` | Get modified objects in workspace |
| `BCRMWSGetWSForObject()` | Find workspaces containing object |
| `BCRMGetWSContext()` | Get current workspace context |
| `BCRMWSGetVersion()` | Get workspace version |
| `BCRMWSContextHandler()` | Handle workspace context changes |

### 4. Business Service & Workflow Runner

| Function | Purpose |
|----------|---------|
| `BCRMBusinessServiceRunner()` | Execute any BS method with parameters |
| `BCRMWorkflowRunner()` | Execute workflows with property capture |
| `BCRMInvokeServiceMethod()` | Dynamic BS method invocation |
| `BCRMGetWFProps()` | Extract workflow properties |
| `BCRMGetBSList()` | Get list of all business services |
| `BCRMGetBSMethods()` | Get methods for specific BS |

**Business Service Runner Flow:**
```javascript
// 1. Select Business Service
BCRMGetBSList() → Populate dropdown

// 2. Select Method
BCRMGetBSMethods(serviceName) → Populate methods

// 3. Input Parameters
Dynamic form generation for inputs

// 4. Execute
BCRMInvokeServiceMethod(service, method, inputs)

// 5. Display Results
PropertySet viewer or formatted output
```

### 5. Server Manager Integration

| Function | Purpose |
|----------|---------|
| `BCRMSrvrMgr()` | Execute srvrmgr commands from browser |
| `BCRMSARMOn()` | Enable SARM tracing |
| `BCRMSARMOff()` | Disable SARM tracing |
| `BCRMShowSARM()` | Display SARM statistics |
| `BCRMShowComponents()` | Show server components status |

**srvrmgr Command Pattern:**
```javascript
function BCRMSrvrMgr(cmd) {
    // 1. Create input file
    // 2. Execute srvrmgr via BS
    // 3. Read spool file
    // 4. Parse and display results
}
```

### 6. Trace & Logging Tools

| Function | Purpose |
|----------|---------|
| `BCRMStartLogging()` | Start SQL/allocation trace |
| `BCRMStopLogging()` | Stop tracing |
| `BCRMViewLog()` | View trace logs in browser |
| `BCRMParseTrace()` | Parse trace file content |
| `BCRMShowTraceStats()` | Display trace statistics |
| `BCRMGetLogEventTypes()` | Get available trace types |

### 7. Utility Classes

#### BCRMUtils Class

```javascript
SiebelAppFacade.BCRMUtils = (function () {
    function BCRMUtils() {}

    BCRMUtils.prototype = {
        GetBSData: function(service, method, inputs),
        GetRRData: function(objType, objName),
        GetDRData: function(objType, objName),
        GetAppInfo: function(),
        InvokeBS: function(service, method, inputs),
        GetActiveView: function(),
        GetActiveApplet: function()
    };

    return BCRMUtils;
}());
```

#### BCRMRWDFactory Class

```javascript
SiebelAppFacade.BCRMRWDFactory = (function () {
    // Redwood UI component factory
    return {
        CreateButton: function(config),
        CreateDialog: function(config),
        CreateCard: function(config),
        CreateToast: function(message, type)
    };
}());
```

### 8. UI Enhancement Functions

| Function | Purpose |
|----------|---------|
| `BCRMPrettifyBanner()` | Customize application banner |
| `BCRMToggleDarkMode()` | Toggle dark mode theme |
| `BCRMInjectCSS()` | Inject custom CSS |
| `BCRMToast()` | Show toast notifications |
| `BCRMShowModal()` | Display modal dialogs |
| `BCRMCloseModal()` | Close modal dialogs |

### 9. Test Automation Support

| Function | Purpose |
|----------|---------|
| `BCRMdevpopsTest()` | Test automation readiness check |
| `BCRMTestAutoCheckDISA()` | Check DISA configuration |
| `BCRMTestAutoShowTodo()` | Test automation checklist |
| `BCRM$()` | Create element with test ID |
| `BCRM_()` | Alternative test ID creator |

**Test ID Generation:**
```javascript
BCRM$ = function(elem, attr, ataonly) {
    // Generate: aria-test-name="BCRM_{base64}"
    var testId = "BCRM_" + btoa(attr);
    elem.setAttribute("aria-test-name", testId);
    return elem;
}
```

### 10. Storage Management

| Function | Purpose |
|----------|---------|
| `BCRMStorageCheck()` | Check localStorage availability |
| `BCRMGetStorageItem()` | Get stored item |
| `BCRMSetStorageItem()` | Store item |
| `BCRMDeleteStorageItem()` | Delete stored item |
| `BCRMClearStorage()` | Clear all storage |
| `BCRMShowStorage()` | Display storage UI |

### 11. Data Processing

| Function | Purpose |
|----------|---------|
| `BCRMEncodeId()` | Encode object IDs |
| `BCRMDecodeId()` | Decode object IDs |
| `BCRMGetUniqueId()` | Generate unique identifiers |
| `BCRMParseJSON()` | Safe JSON parsing |
| `BCRMStringifyJSON()` | Safe JSON stringification |

### 12. Repository Access

| Function | Purpose |
|----------|---------|
| `BCRMGetRRObject()` | Get runtime repository object |
| `BCRMGetDRObject()` | Get design repository object |
| `BCRMGetObjectDef()` | Get object definition |
| `BCRMGetBCFields()` | Get BC field list |
| `BCRMGetAppletControls()` | Get applet control list |

### 13. About View Extensions

| Function | Purpose |
|----------|---------|
| `BCRMAboutView()` | Enhanced About View |
| `BCRMGetLucky()` | Real-time property viewer |
| `BCRMShowWSHistory()` | Display workspace history |
| `BCRMOpenInWebTools()` | Open object in Web Tools |

### 14. Performance Monitoring

| Function | Purpose |
|----------|---------|
| `BCRMStartTimer()` | Start performance timer |
| `BCRMStopTimer()` | Stop timer and get duration |
| `BCRMShowPerformance()` | Display performance metrics |
| `BCRMGetMemoryUsage()` | Get memory statistics |

### 15. DOM Manipulation Helpers

| Function | Purpose |
|----------|---------|
| `BCRMCreateElement()` | Create DOM element |
| `BCRMAddClass()` | Add CSS class |
| `BCRMRemoveClass()` | Remove CSS class |
| `BCRMToggleClass()` | Toggle CSS class |
| `BCRMFindElements()` | Query selector wrapper |

## Key Global Variables

```javascript
// Feature Flags
var bcrm_vanilla_theme = false;     // Use vanilla theme
var BCRM_BASIC_MODE = false;        // Basic mode (limited features)

// Data Caches
var BCRM_XRAY_DATA = {};           // X-Ray scan results
var bcrm_menu_config = {};         // Menu configuration
var bcrmSessionId = "";            // Current session ID

// State Management
var bcrm_debug_menu_active = false; // Debug menu state
var bcrm_dark_mode = false;        // Dark mode state
```

## Event Bindings

```javascript
// Keyboard Shortcuts
$(document).keydown(function(e) {
    if (e.ctrlKey && e.altKey) {
        switch(e.which) {
            case 88: // Ctrl+Alt+X - X-Ray
                BCRMApplyDefaultXray();
                break;
            case 68: // Ctrl+Alt+D - Debug Menu
                BCRMToggleDebugMenu();
                break;
            case 82: // Ctrl+Alt+R - Refresh
                BCRMRefreshView();
                break;
        }
    }
});

// Context Menu
$(document).on('contextmenu', '.siebui-applet', function(e) {
    if (e.shiftKey) {
        e.preventDefault();
        BCRMShowAppletMenu(this);
    }
});
```

## Initialization

```javascript
// Main initialization function
function BCRMInit() {
    // 1. Check environment
    if (!BCRMCheckEnvironment()) return;

    // 2. Load configuration
    BCRMLoadConfig();

    // 3. Initialize utilities
    new SiebelAppFacade.BCRMUtils();

    // 4. Setup event handlers
    BCRMSetupEventHandlers();

    // 5. Create debug menu
    if (!BCRM_BASIC_MODE) {
        BCRMCreateDebugMenu();
    }

    // 6. Apply saved preferences
    BCRMApplyPreferences();

    // 7. Start monitoring
    BCRMStartMonitoring();
}

// Auto-initialize on page load
$(document).ready(function() {
    setTimeout(BCRMInit, 1000);
});
```

## Integration with postload.js

```javascript
// Called from postload.js
if (typeof BCRMPreLoad === "function") {
    BCRMPreLoad();
}

// Register with Siebel
if (typeof SiebelApp !== "undefined") {
    SiebelApp.EventManager.addListner(
        "postload",
        BCRMInit
    );
}
```

## Performance Optimizations

### Debouncing
```javascript
var BCRMDebounce = function(func, wait) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            func.apply(context, args);
        }, wait);
    };
};
```

### Throttling
```javascript
var BCRMThrottle = function(func, limit) {
    var inThrottle;
    return function() {
        var args = arguments, context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};
```

## Error Handling

```javascript
// Global error handler
window.BCRMHandleError = function(error, context) {
    console.error("BCRM Error in " + context + ":", error);

    if (!BCRM_BASIC_MODE) {
        BCRMToast("Error: " + error.message, "danger");
    }

    // Log to server if configured
    if (bcrm_config.log_errors) {
        BCRMLogError(error, context);
    }
};

// Wrapped function execution
function BCRMSafeExecute(func, context) {
    try {
        return func();
    } catch (error) {
        BCRMHandleError(error, context || func.name);
        return null;
    }
}
```

## Next Steps

- For UI enhancements → [postload.js Analysis](./03_POSTLOAD_JS.md)
- For feature implementations → [Features Guide](./06_FEATURES.md)
- For server-side logic → [FWK Runtime](./05_FWK_RUNTIME.md)

---

[← Architecture](./01_ARCHITECTURE.md) | [Back to Index](./DEVPOPS_INDEX.md) | [Next: postload.js →](./03_POSTLOAD_JS.md)