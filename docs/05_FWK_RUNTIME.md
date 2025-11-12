# FWK Runtime Business Service

[← Back to Index](./DEVPOPS_INDEX.md) | [← SIF Files](./04_SIF_FILES.md)

## Overview

**Service Name:** FWK Runtime (V 52)
**Display Name:** VB Runtime
**Type:** Client-Side Business Service (CSSService)
**File:** FWK Runtime.xml
**Server Enabled:** No
**State Management:** Stateful
**Methods:** 30+

## Configuration

### Business Service Properties
```xml
<BusinessService Name="FWK Runtime">
    <DisplayName>VB Runtime</DisplayName>
    <Class>CSSService</Class>
    <Method>Service_PreInvokeMethod</Method>
    <ServerEnabled>N</ServerEnabled>
    <StateMgmtType>Stateful</StateMgmtType>
    <Version>52</Version>
</BusinessService>
```

### Registration
Must be registered in Application User Properties:
```
Name: ClientBusinessServiceN
Value: FWK Runtime
```

## Method Reference

### 1. CleanAttributes

**Purpose:** Parse compiled repository attributes
```javascript
function CleanAttributes(sAttr)

Input: "8*Personal6*Person0*8*Owner Id0*0*"
Output: ["Personal", "Person", "Owner Id", ...]

// Parses attribute strings from repository
// Format: length*value*length*value*...
// Returns array of attribute values
```

### 2. EvalExpr

**Purpose:** Evaluate expressions in business component context
```javascript
Inputs:
- Expr: Expression to evaluate
- BC: Business Component name
- BO: Business Object name

Outputs:
- Result: Evaluation result

Example:
Expr: "[Status] = 'Active'"
Returns: true/false based on current record
```

### 3. EvalScript

**Purpose:** Execute JavaScript code server-side
```javascript
Inputs:
- Expr: JavaScript code to execute

Outputs:
- Result: Execution output
- v: Return value

Features:
- Access to log() function
- Full JavaScript execution
- PropertySet manipulation

Example:
Expr: "var x = 1 + 1; log(x); return x;"
Result: "2"
v: 2
```

### 4. FastInspect

**Purpose:** Quick workspace inspection without losing context
```javascript
Inputs:
- WorkspaceName: Name of workspace
- WorkspaceVersion: Version number

Process:
1. Opens specified workspace
2. Shows preview without changing active workspace
3. Preserves current record context
```

### 5. GetBusinessServiceList

**Purpose:** Get all available business services
```javascript
Outputs:
- PropertySet with structure:
  {
    "Service Name": "Display Name",
    "FWK Runtime": "VB Runtime",
    "Workflow Utilities": "Workflow Utilities",
    ...
  }

Used by: Business Service Runner UI
```

### 6. GetBSMethodList

**Purpose:** Get methods for a specific business service
```javascript
Inputs:
- Service Name: Business service name

Outputs:
- PropertySet with methods:
  {
    "Method1": "Method1",
    "Method2": "Method2",
    ...
  }
```

### 7. GetIOList

**Purpose:** Get list of Integration Objects
```javascript
Outputs:
- PropertySet with IO names:
  {
    "IO Name": "IO Display Name",
    ...
  }

Source: Repository Integration Object
```

### 8. getWFList

**Purpose:** Get combined list of workflows
```javascript
Outputs:
- Combined list from:
  1. Runtime Repository (active workflows)
  2. Repository Details (all workflows)

Format:
  {
    "Workflow Name": "Status",
    ...
  }
```

### 9. getDRWFProps

**Purpose:** Get workflow process properties
```javascript
Inputs:
- Process Name: Workflow process name

Outputs:
- PropertySet with child properties:
  Each child contains:
  - Name: Property name
  - Inactive: Y/N
  - InOut: In/Out/In/Out
  - Data Type: String/Number/Date/etc
  - Default String: Default value
  - Comments: Description
```

### 10. GetRRData

**Purpose:** Get Runtime Repository metadata
```javascript
Inputs:
- Object Type: Repository object type
- Object Name: Object name

Outputs:
- PropertySet with complete object definition
- Includes child objects recursively
- Translates compiled attributes

Example:
Type: "Applet"
Name: "Account List Applet"
Returns: Complete applet definition with controls
```

### 11. GetRawRRData

**Purpose:** Low-level Runtime Repository access
```javascript
Inputs:
- Object Type: Repository object type
- Object Name: Object name

Outputs:
- Raw compiled object definition
- No attribute translation
- Direct repository format

Difference from GetRRData:
- Raw format vs processed
- Compiled attributes vs translated
```

### 12. GetTypeRRFieldMap

**Purpose:** Get field mapping for object type
```javascript
Inputs:
- Object Type: Repository object type

Outputs:
- RRFieldMap: Comma-separated field names

Example:
Type: "Business Component"
Returns: "Name,Table,Class,Search Specification,..."

Used for: Attribute translation
```

### 13. GetRRBC

**Purpose:** Read Runtime Repository including NEO
```javascript
Process:
1. Use EAI Siebel Adapter
2. Query with Base BCRM RR IO
3. Include New Enterprise Objects (NEO)
4. Return complete BC definition

Features:
- Full BC metadata
- Field definitions
- Join specifications
- User properties
```

### 14. InspectWS

**Purpose:** Inspect workspace with search
```javascript
Inputs:
- Name: Workspace name (supports wildcards)
- Inspect: Y to open, N to list only
- Limit: Max results
- SearchExpr: Search expression

Outputs:
- Result: Success/failure
- Workspaces: List of matching workspaces

Features:
- Pattern matching
- Latest version first
- Quick preview
```

### 15. InvokeServiceMethod

**Purpose:** Universal business service invoker
```javascript
Inputs:
- Service: Service name
- Method: Method name
- [Dynamic]: Any additional inputs

Process:
1. Get service instance
2. Create input PropertySet
3. Add all parameters
4. Invoke method
5. Return outputs

Used by: Business Service Runner
```

### 16. ProcessLogRequest (Credit: Jason MacZura)

**Purpose:** Comprehensive logging operations
```javascript
Inputs:
- Operation: ViewLog/StartLogging/StopLogging/Trace
- FilePath: Log file path
- TraceType: SQL/Allocation/All
- TraceMsg: Message for trace
- RetainFile: Keep existing log

Outputs:
- myOutput: Log file contents
- Status: Operation status

Operations:
1. ViewLog - Display log contents
2. StartLogging - Enable tracing
3. StopLogging - Disable tracing
4. Trace - Write trace message
```

### 17. srvrmgr

**Purpose:** Execute Server Manager commands
```javascript
Inputs:
- cmd: srvrmgr command
- FilePath: Temporary file path
- FileSleepTime: Wait time for file operations

Process:
1. Write command to input file
2. Execute: srvrmgr /e ENT /g GATEWAY /u USER /p PASS /i input /o spool
3. Read spool file
4. Parse and return results

Example Commands:
- list components
- list tasks for server SIEBELSERVER
- change param MaxTasks=100 for comp CallCenter
```

### 18. runcmd

**Purpose:** Execute system commands
```javascript
Inputs:
- cmd: System command

Requirements:
- System Preference: Runtime Scripts System Access = TRUE

Security Warning:
- Powerful capability
- Use with caution
- Audit all usage

Example:
cmd: "dir C:\\"
Returns: Directory listing
```

### 19. readFile

**Purpose:** Read file contents
```javascript
Inputs:
- FileName: Full file path
- FileSleepTime: Wait time

Process:
1. Use EAI File Transport
2. Read file to PropertySet
3. Transcode to UTF-8
4. Return contents

Limitations:
- Text files only
- Size limits apply
```

### 20. SetSysPrefs

**Purpose:** Update System Preferences
```javascript
Inputs:
- PropertySet with name=value pairs

Example:
{
  "Runtime Scripts System Access": "TRUE",
  "EnableRestAPI": "TRUE"
}

Returns: Updated preferences
```

### 21. openPopup

**Purpose:** Open applet in popup window
```javascript
Inputs:
- Applet Name: Target applet
- Applet Mode: 1=List, 2=Form

Process:
1. Get current record
2. Use SLM Save List Service
3. Open popup with context
```

### 22. getFWKVersion

**Purpose:** Get FWK Runtime version
```javascript
Outputs:
- FWK Version: "52"

Used for: Version compatibility checks
```

### 23. TranslateAttr

**Purpose:** Translate compiled attributes
```javascript
Inputs:
- Compiled attribute string
- Object type

Process:
1. Get field map for type
2. Parse attribute string
3. Map to field names
4. Return PropertySet

Cache:
- Field maps cached for performance
```

### 24. log

**Purpose:** Server-side logging utility
```javascript
Usage:
log("Simple message");
log(propertySet);
log({key: "value"});

Output collected in: _uslogs array
Retrieved via: Result output
```

### 25. GetWSModifiedObjects

**Purpose:** Get modified objects in workspace
```javascript
Inputs:
- WorkspaceName: Workspace name
- WorkspaceVersion: Version

Outputs:
- PropertySet with modified objects:
  {
    Type: "Object Type",
    Name: "Object Name",
    ModifiedBy: "User",
    ModifiedDate: "Date"
  }
```

### 26. GetRepositoryDef

**Purpose:** Get repository definition
```javascript
Inputs:
- Object Type: Repository object type
- Object Name: Object name
- Workspace: Optional workspace context

Outputs:
- Complete repository definition
- Includes all child objects
- Full metadata
```

### 27. ExecuteQuery

**Purpose:** Execute repository query
```javascript
Inputs:
- BC: Business Component name
- Query: Search specification
- Fields: Comma-separated field list

Outputs:
- Query results as PropertySet
- Supports pagination
```

### 28. GetAppletWebTemplate

**Purpose:** Get applet web template details
```javascript
Inputs:
- Applet Name: Target applet

Outputs:
- Web template definition
- HTML structure
- Control mappings
```

### 29. ValidateExpression

**Purpose:** Validate Siebel expressions
```javascript
Inputs:
- Expression: Expression to validate
- Context: BC/Field context

Outputs:
- Valid: true/false
- Error: Error message if invalid
```

### 30. GetUserPreferences

**Purpose:** Get user preferences
```javascript
Outputs:
- PropertySet with user preferences:
  {
    Language: "ENU",
    TimeZone: "PST",
    DateFormat: "MM/DD/YYYY"
  }
```

## Helper Functions

### Logging Helpers
```javascript
function _uslog_usobj(o, t)    // Log objects
function _uslog_usone(x, y)    // Log single values
function _uslog_usps(ps)       // Log PropertySets
function _uslog_usprint()      // Format log output
```

### Utility Functions
```javascript
function GetApp()              // Get application instance
function GetService(name)      // Get service instance
function NewPropertySet()      // Create PropertySet
function Trace(msg)           // Write trace message
```

## Error Handling

```javascript
try {
    // Method implementation
} catch (e) {
    // Error logging
    log("Error in " + methodName + ": " + e.toString());

    // Set error output
    Outputs.SetProperty("Error", e.toString());
    Outputs.SetProperty("Status", "Error");

    // Throw to caller if critical
    throw e;
}
```

## Performance Considerations

### Caching
- Field maps cached per session
- Workspace definitions cached
- Service instances reused

### Optimization
```javascript
// Batch operations
if (multiple objects) {
    // Single query with IN clause
    Query = "[Name] IN ('Obj1','Obj2','Obj3')"
}

// Lazy loading
if (!cache[key]) {
    cache[key] = LoadData();
}
return cache[key];
```

## Security Considerations

### Restricted Methods
Methods requiring special permissions:
- `runcmd` - Requires Runtime Scripts System Access
- `srvrmgr` - Requires Siebel Administrator
- `SetSysPrefs` - Requires Admin privileges

### Audit Recommendations
```javascript
// Log sensitive operations
function AuditLog(method, inputs, user) {
    var audit = GetService("Audit Service");
    audit.InvokeMethod("LogActivity", {
        Method: method,
        Inputs: inputs,
        User: user,
        Timestamp: new Date()
    });
}
```

## Integration Examples

### From Client JavaScript
```javascript
var service = SiebelApp.S_App.GetService("FWK Runtime");
var inputs = SiebelApp.S_App.NewPropertySet();
inputs.SetProperty("Object Type", "Business Component");
inputs.SetProperty("Object Name", "Account");
var outputs = service.InvokeMethod("GetRRData", inputs);
```

### From Workflow
```
Business Service: FWK Runtime
Method: getDRWFProps
Input Arguments:
  Process Name = [&Process Name]
Output Arguments:
  Properties = [&Properties]
```

### From Script
```javascript
var bs = TheApplication().GetService("FWK Runtime");
var inputs = TheApplication().NewPropertySet();
var outputs = TheApplication().NewPropertySet();
inputs.SetProperty("Expr", "return 1 + 1;");
bs.InvokeMethod("EvalScript", inputs, outputs);
var result = outputs.GetProperty("v"); // Returns 2
```

## Next Steps

- For feature implementations → [Features Guide](./06_FEATURES.md)
- For installation → [Installation Guide](./07_INSTALLATION.md)
- For technical details → [Technical Reference](./08_TECHNICAL.md)

---

[← SIF Files](./04_SIF_FILES.md) | [Back to Index](./DEVPOPS_INDEX.md) | [Next: Features →](./06_FEATURES.md)