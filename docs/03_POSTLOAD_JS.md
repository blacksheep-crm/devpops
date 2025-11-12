# postload.js Analysis

[← Back to Index](./DEVPOPS_INDEX.md) | [← devpops.js](./02_DEVPOPS_JS.md)

## Overview

**File:** postload.js
**Lines:** 8,517
**Purpose:** Siebel Open UI postload customizations, Web Tools enhancements, Dependency Finder, Workflow Visualizer

## Main Components

### 1. Dependency Finder (Flagship Feature)

The Dependency Finder is the most sophisticated feature, using REST APIs to analyze repository dependencies.

#### Core Functions

| Function | Purpose |
|----------|---------|
| `BCRMRepoScan()` | Main orchestrator for dependency scanning |
| `BCRMRepoScanFetchData()` | REST API data fetcher with pagination |
| `BCRMRepoScanProcessExportData()` | Process and cache scan results |
| `BCRMRepoScanShowResults()` | Display results in Shoelace cards |
| `BCRMRepoScanVisualize()` | Create Cytoscape.js graph visualization |
| `BCRMRepoScanTreeSearch()` | Recursive dependency tree builder |
| `BCRMRepoScanProcessScript()` | Scan scripts for object references |
| `BCRMRepoScanProcessOUIJS()` | Scan Open UI JavaScript files |

#### Configuration Structure

```javascript
BCRM_REPO_SCAN_CFG = {
    "Applet": {
        ref: {
            "Business Component": {
                bc: "Repository Applet",
                query: "[Name]='$OBJ_NAME'",
                xfield: "Business Component",
                fields: "Name,Business Component,Class,Project,Inactive,Comments",
                pfield: "Project"
            },
            "Web Template": {
                bc: "Repository Applet Web Template",
                query: "[Applet Name]='$OBJ_NAME'",
                // ...
            }
            // More reference types...
        },
        script: {
            "Repository Script": {
                bc: "Repository Script",
                query: "[Parent Name]='$OBJ_NAME' AND [Parent Type]='Applet'",
                // ...
            }
        }
    },
    // Configuration for 20+ object types
    "Business Component": { /* ... */ },
    "View": { /* ... */ },
    "Screen": { /* ... */ },
    // ...
}
```

#### REST API Pattern

```javascript
async function BCRMRepoScanFetchData(wsn, wsv, rdef, label, on, ot, opt, srownum) {
    // Build URL
    let url = location.origin +
        "/siebel/v1.0/data/BCRM Repository Details/Repository Repository/*/" +
        bc + "?fields=" + fields +
        "&searchspec=" + searchspec +
        "&workspace=" + wsn +
        "&version=" + wsv +
        "&PageSize=100" +
        "&StartRowNum=" + srownum;

    // Fetch with pagination
    let response = await fetch(url, {
        method: 'GET',
        headers: myHeaders,
        cache: 'default'
    });

    // Process response
    let data = await response.json();

    // Check for more pages
    if (data.lastpage === "false" || data.Link.find(l => l.rel === "nextSet")) {
        // Recursive call for next page
        await BCRMRepoScanFetchData(/* ... */, srownum + 100);
    }
}
```

### 2. Workflow Visualizer (New in 24.12)

#### WorkflowDiagramGenerator Class

```javascript
class WorkflowDiagramGenerator {
    constructor(workflowData) {
        this.data = workflowData;
        this.nodes = [];
        this.edges = [];
        this.mermaidCode = "";
    }

    generateDiagram(mode = "simple") {
        let mermaid = "graph TD\n";

        // Process Start steps
        this.data.filter(step => step.Type === "Start").forEach(step => {
            mermaid += `    ${step.Id}[["${step.Name}"]]\n`;
        });

        // Process Decision steps
        this.data.filter(step => step.Type === "Decision Point").forEach(step => {
            mermaid += `    ${step.Id}{{"${step.Name}"}}\n`;
        });

        // Process regular steps
        this.data.filter(step => !["Start", "End", "Decision Point"].includes(step.Type))
            .forEach(step => {
                mermaid += `    ${step.Id}["${step.Name}"]\n`;
            });

        // Process End steps
        this.data.filter(step => step.Type === "End").forEach(step => {
            mermaid += `    ${step.Id}(["${step.Name}"])\n`;
        });

        // Add edges/connections
        this.buildEdges();

        return mermaid;
    }

    buildEdges() {
        // Build connections between workflow steps
        // Based on Next Step, branches, conditions
    }
}
```

#### Workflow Visualization Functions

| Function | Purpose |
|----------|---------|
| `BCRMWorkflowVisualize()` | Main workflow visualization entry point |
| `BCRMGetWorkflowData()` | Fetch workflow definition via REST |
| `BCRMRenderWorkflow()` | Render workflow with Mermaid.js |
| `BCRMExportWorkflow()` | Export workflow diagram (PNG/SVG) |

### 3. Web Tools Enhancer

#### Enhancement Functions

| Function | Purpose |
|----------|---------|
| `BCRMWebToolsEnhancer()` | Main Web Tools enhancement orchestrator |
| `BCRMEnhanceScreenViewListApplet()` | Add "Register with Responsibility" |
| `BCRMEnhanceWorkflowListApplet()` | Workflow editor improvements |
| `BCRMAddWTScreenMenu()` | Add screen navigation menu |
| `BCRMEnhanceWSDashboard()` | Workspace dashboard enhancements |
| `BCRMWSDBGetCurrentSelection()` | Track workspace selection |
| `BCRMAddModifiedObjectsView()` | Add modified objects tracking |
| `BCRMEnhanceRepositoryListApplets()` | Context menus for list applets |

#### Web Tools Context Menu

```javascript
BCRMAddWTContextMenu = function(pm) {
    // Add right-click context menu to Web Tools list applets
    var menu = {
        "Open": BCRMOpenObject,
        "Copy": BCRMCopyObject,
        "Search References": BCRMSearchReferences,
        "divider": null,
        "Export": BCRMExportObject
    };

    // Bind to right-click
    $(document).on("contextmenu", ".siebui-list", function(e) {
        e.preventDefault();
        BCRMShowContextMenu(menu, e.pageX, e.pageY);
    });
};
```

### 4. ERD Viewer

```javascript
SiebelAppFacade.ERDViewer = (function () {
    function ERDViewer() {}

    ERDViewer.prototype.businessObjectERD = async function(type, viewName, autoview) {
        // Generate Entity Relationship Diagram

        // 1. Fetch Business Object definition
        let boData = await this.fetchBOData(viewName);

        // 2. Build Mermaid ERD syntax
        let mermaid = "erDiagram\n";

        // 3. Process Business Components
        boData.components.forEach(bc => {
            // Add entity
            mermaid += `    ${bc.name} {\n`;

            // Add fields
            bc.fields.forEach(field => {
                mermaid += `        ${field.type} ${field.name}\n`;
            });

            mermaid += "    }\n";
        });

        // 4. Add relationships
        boData.links.forEach(link => {
            mermaid += `    ${link.parent} ||--o{ ${link.child} : "${link.name}"\n`;
        });

        // 5. Render with Mermaid.js
        return this.renderERD(mermaid);
    };

    return new ERDViewer();
}());
```

### 5. List Applet Enhancements

#### Lizard 2.0 - Column Wizard

```javascript
BCRMAddLizardButton = function(pm) {
    // Add Lizard button to list applets
    var button = $('<button class="bcrm-lizard">🦎</button>');

    button.click(function() {
        BCRMLizardWizard(pm);
    });

    // Add to applet toolbar
    pm.Get("GetAppletEl").find(".siebui-applet-buttons").append(button);
};

BCRMLizardWizard = function(pm) {
    // Column management wizard
    var columns = pm.Get("GetListOfColumns");
    var dialog = BCRMCreateColumnDialog(columns);

    dialog.on("save", function(selectedColumns) {
        BCRMUpdateListColumns(pm, selectedColumns);

        if (confirm("Save to repository?")) {
            BCRMSaveColumnConfig(pm, selectedColumns);
        }
    });
};
```

#### Auto-Resize Columns

```javascript
BCRMAutoResizeColumns = function(pm) {
    var grid = pm.Get("GetGrid");
    var colModel = grid.jqGrid("getGridParam", "colModel");

    colModel.forEach(function(col, index) {
        if (!col.hidden) {
            // Calculate optimal width
            var maxWidth = BCRMCalculateColumnWidth(grid, col.name);

            // Apply width with constraints
            var newWidth = Math.min(Math.max(maxWidth, 50), 400);
            grid.jqGrid("setColWidth", index, newWidth);
        }
    });

    // Refresh grid
    grid.trigger("reloadGrid");
};

BCRMCalculateColumnWidth = function(grid, colName) {
    var maxWidth = 0;

    // Check header width
    var headerWidth = $(".ui-jqgrid-htable th[aria-describedby*='" + colName + "']")
        .outerWidth();
    maxWidth = Math.max(maxWidth, headerWidth);

    // Check cell content width
    grid.find("td[aria-describedby*='" + colName + "']").each(function() {
        var cellWidth = $(this).outerWidth();
        maxWidth = Math.max(maxWidth, cellWidth);
    });

    return maxWidth + 20; // Add padding
};
```

### 6. Storage Management

```javascript
// Storage operations with error handling
BCRMStorageCheck = function() {
    try {
        var test = 'test';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch(e) {
        console.error("localStorage not available:", e);
        return false;
    }
};

BCRMGetStorageId = function(type, id) {
    // Generate unique storage key
    var app = SiebelApp.S_App.GetName();
    var user = SiebelApp.S_App.GetUserName();
    return app + "_" + user + "_" + type + "_" + id;
};

BCRMSetStorageItem = function(key, value) {
    if (!BCRMStorageCheck()) return false;

    try {
        var storageKey = BCRMGetStorageId("bcrm", key);
        var data = {
            value: value,
            timestamp: Date.now(),
            version: devpops_version
        };
        localStorage.setItem(storageKey, JSON.stringify(data));
        return true;
    } catch(e) {
        console.error("Storage error:", e);
        return false;
    }
};
```

### 7. Third-Party Library Loaders

```javascript
// Shoelace Web Components
BCRMLoadShoelace = async function() {
    if (window.shoelaceLoaded) return;

    // Load Shoelace autoloader
    await BCRMLoadScript(
        "https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.11.2/cdn/shoelace-autoloader.js",
        "module"
    );

    // Wait for components to register
    await customElements.whenDefined("sl-button");
    window.shoelaceLoaded = true;
};

// Cytoscape.js Graph Library
BCRMLoadCytoscape = async function() {
    if (window.cytoscape) return;

    await BCRMLoadScript(
        "https://cdn.jsdelivr.net/npm/cytoscape@3.25.0/dist/cytoscape.min.js"
    );
};

// Mermaid Diagram Library
BCRMLoadMermaid = async function() {
    if (window.mermaid) return;

    await BCRMLoadScript(
        "https://cdn.jsdelivr.net/npm/mermaid@10.6.1/dist/mermaid.min.js"
    );

    // Initialize Mermaid
    mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        flowchart: {
            useMaxWidth: true,
            htmlLabels: true
        }
    });
};

// Generic script loader
BCRMLoadScript = function(src, type = "text/javascript") {
    return new Promise((resolve, reject) => {
        var script = document.createElement("script");
        script.type = type;
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
};
```

### 8. REST API Utilities

```javascript
// Workspace-aware REST API call
async function RESTWorkspaceAsync(query, wsn, wsv) {
    const baseUrl = location.origin + "/siebel/v1.0/data/";
    const workspace = wsn || BCRMGetWSContext().ws;
    const version = wsv || BCRMGetWSContext().ver;

    let url = baseUrl + "BCRM Repository Details/Repository Repository/*/" + query;

    // Add workspace parameters
    if (workspace) {
        url += (query.includes("?") ? "&" : "?") +
               "workspace=" + workspace +
               "&version=" + version;
    }

    // Add standard parameters
    url += "&childlinks=None&uniformresponse=y";

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.items || [];

    } catch (error) {
        console.error("REST API error:", error);
        return [];
    }
}
```

### 9. Cache Management

```javascript
// Global caches
var BCRM_REPO_SCAN_CACHE = {};      // Dependency scan results
var BCRM_MANIFEST_CACHE = [];       // Manifest files
var BCRM_OUI_FILES_CACHE = {};      // Open UI JS files
var BCRM_WF_CACHE = {};              // Workflow definitions

// Cache with TTL
BCRMCacheSet = function(key, value, ttl = 3600000) { // 1 hour default
    BCRM_REPO_SCAN_CACHE[key] = {
        data: value,
        timestamp: Date.now(),
        ttl: ttl
    };
};

BCRMCacheGet = function(key) {
    var cached = BCRM_REPO_SCAN_CACHE[key];

    if (!cached) return null;

    // Check TTL
    if (Date.now() - cached.timestamp > cached.ttl) {
        delete BCRM_REPO_SCAN_CACHE[key];
        return null;
    }

    return cached.data;
};

BCRMCacheClear = function() {
    BCRM_REPO_SCAN_CACHE = {};
    BCRM_MANIFEST_CACHE = [];
    BCRM_OUI_FILES_CACHE = {};
    BCRM_WF_CACHE = {};
};
```

### 10. Event Handlers

```javascript
// Postload initialization
SiebelAppFacade.BCRMPostload = function() {
    // 1. Check environment
    if (!BCRMCheckWebTools()) {
        // Application mode
        BCRMApplicationEnhancements();
    } else {
        // Web Tools mode
        BCRMWebToolsEnhancer();
    }

    // 2. Load required libraries
    BCRMLoadRequiredLibraries();

    // 3. Initialize features
    BCRMInitializeFeatures();

    // 4. Setup event handlers
    BCRMSetupEventHandlers();
};

// View load handler
BCRMOnViewLoad = function() {
    var view = SiebelApp.S_App.GetActiveView();
    var viewName = view.GetName();

    // View-specific enhancements
    switch(viewName) {
        case "Repository Workflow Process List View":
            BCRMEnhanceWorkflowListView();
            break;
        case "BCRM Modified Objects List View":
            BCRMEnhanceModifiedObjectsView();
            break;
        // More cases...
    }
};

// Applet load handler
BCRMOnAppletLoad = function(applet) {
    var pm = applet.GetPModel();
    var appletName = pm.Get("GetName");

    // Add Lizard button to list applets
    if (pm.Get("GetListOfColumns")) {
        BCRMAddLizardButton(pm);
        BCRMAddAutoResizeButton(pm);
    }

    // Add context menu
    if (BCRMCheckWebTools()) {
        BCRMAddWTContextMenu(pm);
    }
};
```

## Global Configuration

```javascript
// Feature configuration
var BCRM_REPO_SCAN_ENABLED = true;
var BCRM_WF_VIZ_ENABLED = true;
var BCRM_ERD_ENABLED = true;
var BCRM_LIZARD_ENABLED = true;

// Version checks
var devpops_version = 65;
var fwk_min_version = 52;

// API configuration
var BCRM_REST_TIMEOUT = 30000;      // 30 seconds
var BCRM_REST_PAGE_SIZE = 100;      // Records per page
var BCRM_REST_MAX_RETRIES = 3;      // Retry failed requests
```

## Performance Optimizations

### Lazy Loading
```javascript
// Load libraries only when needed
BCRMOnDemandLoad = function(feature) {
    switch(feature) {
        case "dependency":
            return Promise.all([
                BCRMLoadShoelace(),
                BCRMLoadCytoscape()
            ]);
        case "workflow":
            return Promise.all([
                BCRMLoadMermaid(),
                BCRMLoadScript("svg-pan-zoom.min.js")
            ]);
        case "erd":
            return BCRMLoadMermaid();
    }
};
```

### Request Batching
```javascript
// Batch multiple REST requests
BCRMBatchRequests = async function(requests) {
    const batchSize = 5; // Process 5 requests at a time
    const results = [];

    for (let i = 0; i < requests.length; i += batchSize) {
        const batch = requests.slice(i, i + batchSize);
        const batchResults = await Promise.all(
            batch.map(req => fetch(req))
        );
        results.push(...batchResults);
    }

    return results;
};
```

## Integration Points

### With devpops.js
```javascript
// Called from devpops.js
if (typeof BCRMPreLoad === "function") {
    BCRMPreLoad();
}

// Shared utilities
var utils = new SiebelAppFacade.BCRMUtils();
```

### With FWK Runtime
```javascript
// Invoke server-side methods
var service = SiebelApp.S_App.GetService("FWK Runtime");
var inputs = SiebelApp.S_App.NewPropertySet();
inputs.SetProperty("Method", "GetRRData");
var outputs = service.InvokeMethod("GetRRData", inputs);
```

## Next Steps

- For repository objects → [SIF Files Analysis](./04_SIF_FILES.md)
- For server-side logic → [FWK Runtime](./05_FWK_RUNTIME.md)
- For feature details → [Features Guide](./06_FEATURES.md)

---

[← devpops.js](./02_DEVPOPS_JS.md) | [Back to Index](./DEVPOPS_INDEX.md) | [Next: SIF Files →](./04_SIF_FILES.md)