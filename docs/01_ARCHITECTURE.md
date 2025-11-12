# devpops Architecture Overview

[← Back to Index](./DEVPOPS_INDEX.md)

## System Architecture

### Overview

devpops is a multi-layered toolkit that extends Siebel CRM with development productivity features. It operates across client-side JavaScript, server-side business services, and repository objects.

## Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interface (Browser)                  │
├─────────────────────────────────────────────────────────────┤
│                    devpops.js (Core Library)                 │
│                 postload.js (UI Enhancements)                │
│              SiebelQueryLang.js (Query Parser)               │
├─────────────────────────────────────────────────────────────┤
│                   Siebel Open UI Framework                   │
├─────────────────────────────────────────────────────────────┤
│                      REST API Layer                          │
│                  (Inbound REST Services)                     │
├─────────────────────────────────────────────────────────────┤
│                 Server Business Services                     │
│              FWK Runtime, BCRM Server Manager                │
├─────────────────────────────────────────────────────────────┤
│                  Repository Layer (SIF)                      │
│         Business Objects, Components, Integration            │
├─────────────────────────────────────────────────────────────┤
│                    Siebel Database                           │
└─────────────────────────────────────────────────────────────┘
```

## Component Relationships

### 1. Client-Side Components

```
devpops.js
    ├── BCRMUtils (Utility Functions)
    ├── BCRMRWDFactory (Redwood UI Factory)
    ├── X-Ray Functions
    ├── Debug Menu System
    ├── Workspace Management
    ├── Business Service Runner
    ├── Server Manager Integration
    └── Storage Management

postload.js
    ├── Web Tools Enhancer
    ├── Dependency Finder
    ├── Workflow Visualizer
    ├── ERD Viewer
    ├── List Applet Enhancements
    └── Third-Party Library Loaders
```

### 2. Server-Side Components

```
FWK Runtime Business Service
    ├── Repository Access Methods
    ├── Script Execution Methods
    ├── File I/O Methods
    ├── Workflow Methods
    └── System Command Methods

BCRM Server Manager Service
    ├── srvrmgr Command Execution
    ├── SARM Control
    └── Component Management
```

### 3. Repository Objects

```
SIF Files
    ├── devpops_V52.sif (Main Objects)
    ├── DependencyFinder.sif (Dependency Analysis)
    ├── BCRMImportedObjectPropertyListViewV2.sif (SIF Viewer)
    ├── IO_Base BCRM Modified Object.sif (Integration)
    └── Base BCRM Repository Details.sif (Metadata)
```

## Data Flow

### REST API Data Flow

```
User Action → devpops.js → REST API Request
                              ↓
                    Siebel REST Inbound Service
                              ↓
                    Repository/Runtime Data
                              ↓
                    JSON Response → devpops.js
                              ↓
                    UI Rendering (Shoelace/Cytoscape)
```

### Business Service Flow

```
User Action → devpops.js → BS Method Invocation
                              ↓
                    FWK Runtime Service
                              ↓
                    Server-Side Processing
                              ↓
                    PropertySet Response
                              ↓
                    Client-Side Processing
```

## Integration Points

### 1. Siebel Open UI Integration

- **Postload Hook**: Main entry point for customizations
- **Physical Renderer (PR)**: List applet customizations
- **Physical Model (PM)**: Data access and manipulation
- **Application Object**: Service invocations

### 2. REST API Integration

- **Workspace Queries**: Repository data access
- **Runtime Repository**: Live object definitions
- **Pagination**: Large dataset handling
- **Authentication**: Anonymous or Basic Auth

### 3. Third-Party Libraries

```javascript
// Dynamic Loading Pattern
if (!window.cytoscape) {
    loadScript("https://cdn.jsdelivr.net/npm/cytoscape@3.25.0/dist/cytoscape.min.js");
}
```

**Libraries Used:**
- Shoelace (Web Components)
- Cytoscape.js (Graph Visualization)
- Mermaid.js (Diagram Generation)
- ACE Editor (Code Editing)
- Chart.js (Statistics)

## Module Architecture

### JavaScript Module Pattern

```javascript
SiebelAppFacade.ModuleName = (function () {
    // Private variables and functions
    var privateVar = "value";

    function privateFunction() {
        // Private logic
    }

    // Public interface
    function ModuleName() {
        // Constructor
    }

    ModuleName.prototype.publicMethod = function() {
        // Public method
    };

    return ModuleName;
}());
```

### Singleton Pattern

```javascript
if (typeof(SiebelAppFacade.SingletonModule) === "undefined") {
    SiebelJS.Namespace("SiebelAppFacade.SingletonModule");
    SiebelAppFacade.SingletonModule = (function() {
        // Single instance
        var instance;

        function init() {
            // Initialization
            return {
                // Public methods
            };
        }

        return {
            getInstance: function() {
                if (!instance) {
                    instance = init();
                }
                return instance;
            }
        };
    }());
}
```

## Security Architecture

### Access Control

1. **Responsibility-Based**: Business Service Access configuration
2. **System Preferences**: Runtime Scripts System Access
3. **REST API**: Authentication configuration
4. **User Properties**: Application-level registration

### Risk Mitigation

- Educational use only disclaimer
- System preference controls
- Audit logging recommendations
- Development environment restriction

## Performance Considerations

### Caching Strategy

```javascript
// Global caches
BCRM_REPO_SCAN_CACHE = {};      // Dependency scan results
BCRM_MANIFEST_CACHE = [];       // Manifest files
BCRM_OUI_FILES_CACHE = {};      // Open UI files
sessionStorage.BCRMUtils = {};   // Session data
```

### Lazy Loading

- Third-party libraries loaded on demand
- Large datasets paginated
- REST API calls minimized through caching

### Async Operations

```javascript
async function fetchData() {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}
```

## Deployment Architecture

### File Structure

```
Siebel Server
├── siebsrvr/
│   ├── files/custom/
│   │   └── blacksheep.css
│   └── TEMP/
│       └── (srvrmgr spool files)
│
Web Server
├── siebel/
│   ├── custom/
│   │   └── devpops.js
│   └── scripts/3rdParty/
│       └── SiebelQueryLang.js
│
Application Container
└── webapps/ROOT/
    └── logviewer.html
```

### Configuration Points

1. **Manifest Administration**: Register JavaScript files
2. **Application User Properties**: Register business services
3. **REST Inbound Data Access**: Register business objects
4. **System Preferences**: Enable runtime scripts

## Version Compatibility

### Version Detection

```javascript
BCRMGetAppInfo = function() {
    var version = SiebelApp.S_App.GetSiebelVersion();
    // Parse and validate version
};
```

### Feature Availability

| Feature | Min Version | Optimal |
|---------|-------------|---------|
| Core Features | 20.12 | 24.12 |
| Dependency Finder | 23.6 | 24.12 |
| Workflow Visualizer | 23.6 | 24.12 |
| SIF Viewer | 23.7 | 24.12 |
| REST API lastpage | 24.1 | 24.12 |

## Next Steps

- For detailed function documentation → [devpops.js Analysis](./02_DEVPOPS_JS.md)
- For UI enhancements → [postload.js Analysis](./03_POSTLOAD_JS.md)
- For repository objects → [SIF Files](./04_SIF_FILES.md)
- For server-side logic → [FWK Runtime](./05_FWK_RUNTIME.md)

---

[← Back to Index](./DEVPOPS_INDEX.md) | [Next: devpops.js Analysis →](./02_DEVPOPS_JS.md)