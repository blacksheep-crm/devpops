# Technical Reference

[← Back to Index](./DEVPOPS_INDEX.md) | [← Installation](./07_INSTALLATION.md)

## Overview

This document provides technical details for developers extending or integrating with devpops.

## JavaScript API Reference

### Global Objects

#### BCRMUtils

```javascript
// Get instance
var utils = new SiebelAppFacade.BCRMUtils();

// Methods
utils.GetRRData(objType, objName)     // Get Runtime Repository data
utils.GetDRData(objType, objName)     // Get Design Repository data
utils.GetAppInfo()                     // Get application information
utils.InvokeBS(service, method, inputs) // Invoke business service
utils.GetActiveView()                  // Get active view object
utils.GetActiveApplet()                // Get active applet object
```

#### Global Functions

```javascript
// X-Ray Functions
BCRMApplyDefaultXray()                 // Apply X-Ray to current view
BCRMShowControls()                     // Show control names
BCRMShowBCFields()                     // Show BC field names
BCRMShowTableColumns()                 // Show physical columns
BCRMRunSilentXRay()                    // Silent export to clipboard

// Workspace Functions
BCRMWSFastInspect(ws, ver)            // Fast inspect workspace
BCRMGetWSContext()                     // Get workspace context
BCRMWSGetModData()                     // Get modified objects

// UI Functions
BCRMCreateDebugMenu()                  // Create debug menu
BCRMToggleDarkMode()                   // Toggle dark mode
BCRMToast(message, type)              // Show toast notification
BCRMInjectCSS(css)                    // Inject custom CSS

// Storage Functions
BCRMGetStorageItem(key)               // Get from storage
BCRMSetStorageItem(key, value)        // Save to storage
BCRMDeleteStorageItem(key)            // Delete from storage
```

### Event System

#### Custom Events

```javascript
// Listen for devpops events
$(document).on("BCRMReady", function() {
    // devpops fully loaded
});

$(document).on("BCRMViewLoad", function(event, view) {
    // View loaded
});

$(document).on("BCRMAppletLoad", function(event, applet) {
    // Applet loaded
});

// Trigger custom events
$(document).trigger("BCRMCustomEvent", [data]);
```

#### Siebel Event Integration

```javascript
// Hook into Siebel events
SiebelApp.EventManager.addListner("postload", function() {
    // After page load
});

// PM Binding
pm.AttachPMBinding("ShowSelection", function() {
    // Selection changed
});
```

---

## REST API Reference

### Endpoint Structure

```
Base URL: https://server/siebel/v1.0/data/

Structure:
/data/{BusinessObject}/{BusinessComponent}/{Id}/{ChildBC}

Example:
/data/BCRM Repository Details/Repository Repository/*/Repository Applet
```

### Query Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| fields | Field list | fields=Name,Type,Status |
| searchspec | Search criteria | searchspec=[Name]='Account' |
| sortspec | Sort order | sortspec=Name:ASC |
| pagesize | Records per page | pagesize=100 |
| startrownum | Starting row | startrownum=0 |
| workspace | Workspace name | workspace=DEV_WS |
| version | Workspace version | version=1 |
| uniformresponse | Uniform response | uniformresponse=y |
| childlinks | Include children | childlinks=None |

### Authentication

```javascript
// Anonymous (configured in Siebel)
fetch(url, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Basic Authentication
fetch(url, {
    method: 'GET',
    headers: {
        'Authorization': 'Basic ' + btoa('user:password'),
        'Content-Type': 'application/json'
    }
});
```

### Response Structure

```json
{
    "items": [
        {
            "Name": "Account List Applet",
            "Type": "List",
            "Business Component": "Account"
        }
    ],
    "recordcount": 1,
    "lastpage": "true",
    "Link": [
        {
            "rel": "self",
            "href": "..."
        }
    ]
}
```

### Pagination Handling

```javascript
async function fetchAllPages(url) {
    let allItems = [];
    let nextUrl = url;

    while (nextUrl) {
        const response = await fetch(nextUrl);
        const data = await response.json();

        allItems = allItems.concat(data.items);

        // Check for next page
        const nextLink = data.Link.find(l => l.rel === 'nextSet');
        nextUrl = nextLink ? nextLink.href : null;

        // Or check lastpage (24.1+)
        if (data.lastpage === "true") break;
    }

    return allItems;
}
```

---

## Siebel Open UI Integration

### Physical Renderer (PR) Customization

```javascript
// Custom PR definition
SiebelJS.Namespace("SiebelAppFacade.BCRMCustomPR");
SiebelAppFacade.BCRMCustomPR = (function() {
    function BCRMCustomPR(pm) {
        SiebelAppFacade.BCRMCustomPR.superclass.constructor.apply(this, arguments);
    }

    SiebelJS.Extend(BCRMCustomPR, SiebelAppFacade.ListRenderer);

    BCRMCustomPR.prototype.ShowUI = function() {
        SiebelAppFacade.BCRMCustomPR.superclass.ShowUI.apply(this, arguments);
        // Custom UI logic
    };

    BCRMCustomPR.prototype.BindData = function() {
        SiebelAppFacade.BCRMCustomPR.superclass.BindData.apply(this, arguments);
        // Custom data binding
    };

    return BCRMCustomPR;
}());
```

### Physical Model (PM) Access

```javascript
// Get PM from applet
var pm = applet.GetPModel();

// Common PM methods
pm.Get("GetName")                     // Applet name
pm.Get("GetRecordSet")                // Current record set
pm.Get("GetListOfColumns")            // List columns
pm.Get("GetControls")                 // Form controls
pm.Get("GetBusComp")                  // Business component

// Execute methods
pm.ExecuteMethod("InvokeMethod", "MethodName", inputs);
```

### Business Component Operations

```javascript
// Get BC from PM
var bc = pm.Get("GetBusComp");

// BC operations
bc.GetFieldValue("Name");             // Get field value
bc.SetFieldValue("Name", "Value");    // Set field value
bc.WriteRecord();                      // Save record
bc.InvokeMethod("MethodName");        // Invoke BC method
bc.GetSearchSpec();                    // Get search spec
```

---

## Configuration Files

### manifest.xml Structure

```xml
<APPLICATION>
    <UI_OBJECT>
        <PLATFORM>
            <COMMON>
                <FILE_NAME>siebel/custom/devpops.js</FILE_NAME>
            </COMMON>
        </PLATFORM>
    </UI_OBJECT>
</APPLICATION>
```

### Application User Properties

```
ClientBusinessService1 = FWK Runtime
ClientBusinessService2 = BCRM Server Manager Service
EnableRestAPI = TRUE
RuntimeScriptsSystemAccess = TRUE
```

### Business Service User Properties

```xml
<BusinessService Name="BCRM Server Manager Service">
    <UserProperty>
        <Name>Enterprise</Name>
        <Value>SIEBEL</Value>
    </UserProperty>
    <UserProperty>
        <Name>Gateway</Name>
        <Value>gateway.server.com</Value>
    </UserProperty>
    <UserProperty>
        <Name>Port</Name>
        <Value>2320</Value>
    </UserProperty>
</BusinessService>
```

---

## Third-Party Libraries

### Shoelace Web Components

```javascript
// Load Shoelace
await BCRMLoadScript(
    "https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.11.2/cdn/shoelace-autoloader.js",
    "module"
);

// Use Shoelace components
<sl-button variant="primary">Click Me</sl-button>
<sl-dialog label="Title">Content</sl-dialog>
<sl-card>Card Content</sl-card>

// Wait for registration
await customElements.whenDefined("sl-button");
```

### Cytoscape.js Graph Library

```javascript
// Initialize Cytoscape
var cy = cytoscape({
    container: document.getElementById('cy'),
    elements: {
        nodes: [
            { data: { id: 'a' } },
            { data: { id: 'b' } }
        ],
        edges: [
            { data: { source: 'a', target: 'b' } }
        ]
    },
    style: [
        {
            selector: 'node',
            style: {
                'background-color': '#666',
                'label': 'data(id)'
            }
        }
    ],
    layout: {
        name: 'cose'  // or 'grid', 'circle', 'breadthfirst'
    }
});
```

### Mermaid.js Diagrams

```javascript
// Initialize Mermaid
mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    flowchart: {
        useMaxWidth: true,
        htmlLabels: true
    }
});

// Render diagram
const graphDefinition = `
graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action]
    B -->|No| D[End]
`;

const { svg } = await mermaid.render('graph', graphDefinition);
document.getElementById('output').innerHTML = svg;
```

---

## Performance Optimization

### Caching Strategies

```javascript
// Memory cache with TTL
const cache = new Map();

function cacheGet(key) {
    const item = cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
        cache.delete(key);
        return null;
    }

    return item.value;
}

function cacheSet(key, value, ttl = 3600000) {
    cache.set(key, {
        value: value,
        expiry: Date.now() + ttl
    });
}
```

### Debouncing & Throttling

```javascript
// Debounce - delay until quiet
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Throttle - limit frequency
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Usage
const debouncedSearch = debounce(search, 300);
const throttledScroll = throttle(handleScroll, 100);
```

### Lazy Loading

```javascript
// Load on demand
async function loadFeature(feature) {
    if (window[feature + 'Loaded']) return;

    switch(feature) {
        case 'cytoscape':
            await loadScript('cytoscape.min.js');
            break;
        case 'mermaid':
            await loadScript('mermaid.min.js');
            break;
    }

    window[feature + 'Loaded'] = true;
}
```

---

## Error Handling

### Global Error Handler

```javascript
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);

    // Log to server
    if (window.BCRMLogError) {
        BCRMLogError({
            message: e.error.message,
            stack: e.error.stack,
            url: e.filename,
            line: e.lineno,
            column: e.colno
        });
    }

    // Prevent default error handling
    e.preventDefault();
});

// Promise rejection handler
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
});
```

### Try-Catch Patterns

```javascript
// Async error handling
async function safeAsyncOperation() {
    try {
        const result = await riskyOperation();
        return { success: true, data: result };
    } catch (error) {
        console.error('Operation failed:', error);
        return { success: false, error: error.message };
    }
}

// Wrap functions for safety
function wrapFunction(fn, context = 'Unknown') {
    return function(...args) {
        try {
            return fn.apply(this, args);
        } catch (error) {
            console.error(`Error in ${context}:`, error);
            BCRMToast(`Error: ${error.message}`, 'danger');
        }
    };
}
```

---

## Security Considerations

### Input Validation

```javascript
// Sanitize user input
function sanitizeInput(input) {
    // Remove script tags
    input = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Encode HTML entities
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// Validate parameters
function validateParams(params, schema) {
    for (const [key, rules] of Object.entries(schema)) {
        const value = params[key];

        if (rules.required && !value) {
            throw new Error(`${key} is required`);
        }

        if (rules.type && typeof value !== rules.type) {
            throw new Error(`${key} must be ${rules.type}`);
        }

        if (rules.pattern && !rules.pattern.test(value)) {
            throw new Error(`${key} format invalid`);
        }
    }
}
```

### XSS Prevention

```javascript
// Safe DOM manipulation
function safeSetHTML(element, html) {
    // Use textContent for plain text
    element.textContent = html;
}

// If HTML needed, sanitize first
function setSanitizedHTML(element, html) {
    const clean = DOMPurify.sanitize(html);
    element.innerHTML = clean;
}

// Safe attribute setting
function safeSetAttribute(element, name, value) {
    // Validate attribute name
    if (!/^[a-zA-Z][\w-]*$/.test(name)) {
        throw new Error('Invalid attribute name');
    }

    // Encode value
    const encoded = value.replace(/"/g, '&quot;');
    element.setAttribute(name, encoded);
}
```

---

## Debugging Tools

### Console Utilities

```javascript
// Enhanced logging
window.BCRMLog = {
    info: function(msg, data) {
        console.log(`%c[BCRM INFO] ${msg}`, 'color: #00b786', data);
    },
    error: function(msg, data) {
        console.error(`%c[BCRM ERROR] ${msg}`, 'color: #ff0000', data);
    },
    debug: function(msg, data) {
        if (window.BCRM_DEBUG) {
            console.log(`%c[BCRM DEBUG] ${msg}`, 'color: #999', data);
        }
    },
    group: function(label) {
        console.group(`[BCRM] ${label}`);
    },
    groupEnd: function() {
        console.groupEnd();
    }
};

// Performance timing
console.time('Operation');
// ... operation code ...
console.timeEnd('Operation');

// Object inspection
console.dir(complexObject);
console.table(arrayOfObjects);
```

### Development Mode

```javascript
// Enable development mode
window.BCRM_DEV_MODE = true;

if (BCRM_DEV_MODE) {
    // Enable verbose logging
    window.BCRM_DEBUG = true;

    // Expose internal objects for debugging
    window.BCRM_INTERNALS = {
        cache: BCRM_REPO_SCAN_CACHE,
        config: bcrm_menu_config,
        utils: new SiebelAppFacade.BCRMUtils()
    };

    // Add debug commands
    window.bcrmHelp = function() {
        console.log(`
Available debug commands:
- bcrmVersion()     : Show version info
- bcrmCache()       : Show cache contents
- bcrmConfig()      : Show configuration
- bcrmReset()       : Reset to defaults
- bcrmTest()        : Run tests
        `);
    };
}
```

---

## Testing

### Unit Testing Pattern

```javascript
// Test framework
const BCRMTest = {
    tests: [],

    describe: function(name, fn) {
        this.tests.push({ name, fn });
    },

    it: function(desc, test) {
        try {
            test();
            console.log(`✓ ${desc}`);
            return true;
        } catch (error) {
            console.error(`✗ ${desc}:`, error);
            return false;
        }
    },

    assert: function(condition, message) {
        if (!condition) {
            throw new Error(message || 'Assertion failed');
        }
    },

    run: function() {
        console.group('Running tests');
        let passed = 0, failed = 0;

        this.tests.forEach(test => {
            console.group(test.name);
            if (test.fn()) passed++;
            else failed++;
            console.groupEnd();
        });

        console.log(`Results: ${passed} passed, ${failed} failed`);
        console.groupEnd();
    }
};

// Example test
BCRMTest.describe('Storage Functions', function() {
    BCRMTest.it('should save and retrieve items', function() {
        BCRMSetStorageItem('test', 'value');
        const value = BCRMGetStorageItem('test');
        BCRMTest.assert(value === 'value', 'Value mismatch');
    });
});
```

---

## Browser Compatibility

### Feature Detection

```javascript
// Check for required features
function checkCompatibility() {
    const required = {
        'localStorage': typeof(Storage) !== "undefined",
        'fetch': typeof(fetch) !== "undefined",
        'Promise': typeof(Promise) !== "undefined",
        'customElements': typeof(customElements) !== "undefined",
        'JSON': typeof(JSON) !== "undefined"
    };

    const missing = [];
    for (const [feature, available] of Object.entries(required)) {
        if (!available) missing.push(feature);
    }

    if (missing.length > 0) {
        console.error('Missing required features:', missing);
        return false;
    }

    return true;
}
```

### Polyfills

```javascript
// Array.includes polyfill
if (!Array.prototype.includes) {
    Array.prototype.includes = function(searchElement, fromIndex) {
        return this.indexOf(searchElement, fromIndex) !== -1;
    };
}

// Object.entries polyfill
if (!Object.entries) {
    Object.entries = function(obj) {
        return Object.keys(obj).map(key => [key, obj[key]]);
    };
}
```

---

## Deployment Checklist

### Pre-Deployment

- [ ] Version compatibility verified
- [ ] All SIF files imported in correct order
- [ ] Business Services registered
- [ ] JavaScript files deployed
- [ ] CSS files deployed
- [ ] Manifest updated
- [ ] System preferences configured
- [ ] REST API configured
- [ ] Repository delivered

### Post-Deployment

- [ ] Browser cache cleared
- [ ] Debug menu appears
- [ ] Basic features tested
- [ ] REST API responding
- [ ] Error console checked
- [ ] Performance acceptable
- [ ] User training completed
- [ ] Documentation distributed

---

## Version Information

```javascript
// Version checking
const devpopsInfo = {
    version: devpops_version,           // 65
    fwkVersion: fwk_min_version,        // 52
    buildDate: '2024-12',
    codename: 'Raptor',

    checkCompatibility: function() {
        const siebelVersion = SiebelApp.S_App.GetSiebelVersion();
        const [year, month] = siebelVersion.split('.');

        if (year < 20 || (year == 20 && month < 12)) {
            return 'Limited compatibility';
        } else if (year >= 23 && month >= 6) {
            return 'Full compatibility';
        } else {
            return 'Core features only';
        }
    }
};
```

---

[← Installation](./07_INSTALLATION.md) | [Back to Index](./DEVPOPS_INDEX.md)