# SIF Files Analysis

[← Back to Index](./DEVPOPS_INDEX.md) | [← postload.js](./03_POSTLOAD_JS.md)

## Overview

SIF (Siebel Interface Files) contain repository object definitions that extend Siebel CRM with devpops functionality. There are 5 main SIF files in the devpops package.

## SIF File Summary

| File | Size | Main Purpose | Key Objects |
|------|------|--------------|-------------|
| devpops_V52.sif | 565 KB | Core devpops objects | Applets, BCs, Views |
| DependencyFinder.sif | 2.1 MB | Dependency analysis | Component parameters |
| BCRMImportedObjectPropertyListViewV2.sif | 77 KB | SIF analysis view | Property viewer |
| IO_Base BCRM Modified Object.sif | 48 KB | Integration objects | Modified object tracking |
| Base BCRM Repository Details.sif | 1.9 MB | Repository metadata | Base repository access |

## 1. devpops_V52.sif - Main Repository Objects

### Project
- **Name:** blacksheep devpops
- **Version:** 52
- **Description:** Core devpops repository objects

### Applets (3)

#### 1. BCRM Merge Attribute List Applet
```
Business Component: BCRM Merge Attribute
Type: List
Class: CSSListApplet
Purpose: Display merge conflict attributes
Key Features:
- Read-only view of merge attributes
- Shows attribute differences
- Used in merge conflict resolution
```

#### 2. BCRM Merge Object List Applet
```
Business Component: BCRM Merge Object
Type: List
Class: CSSListApplet
Purpose: Display workspace merge objects
Key Features:
- Lists objects with merge conflicts
- Shows version information
- Navigation to attribute details
```

#### 3. BCRM Modified Objects List Applet
```
Business Component: Repository Object (derived)
Type: List
Class: CSSListApplet
Purpose: Track modified objects in workspace
Key Features:
- Shows who's working on what
- Version tracking
- Modification timestamps
- Quick navigation to object definition
```

### Business Components (5)

#### 1. BCRM Merge Attribute
```
Table: S_MERGE_ATTR (virtual)
Purpose: Merge conflict attribute tracking
Key Fields:
- Attribute Name
- Base Value
- Local Value
- Remote Value
- Conflict Status
```

#### 2. BCRM Merge Object
```
Table: S_MERGE_OBJ (virtual)
Purpose: Merge conflict object tracking
Key Fields:
- Object Type
- Object Name
- Workspace Name
- Conflict Count
- Merge Status
```

#### 3. BCRM Modified Object
```
Table: S_REPOSITORY (derived)
Purpose: Track workspace modifications
Key Fields:
- Object Type
- Object Name
- Modified By
- Modified Date
- Workspace Name
- Version
```

#### 4. BCRM Imported Object Property
```
Table: S_IMP_OBJ_PROP
Purpose: SIF import property tracking
Key Fields:
- Property Name
- Property Value
- Object Type
- Object Name
```

#### 5. BCRM Repository Helper
```
Table: S_REPOSITORY
Purpose: Repository metadata access
Key Fields:
- Various repository fields
- Computed fields for metadata
```

### Views (1+)

#### BCRM Modified Objects List View
```
Business Object: Repository
Applets:
- BCRM Modified Objects List Applet
Purpose: Main view for tracking modified objects
Features:
- Filter by workspace
- Sort by modification date
- Quick search
- Export capabilities
```

### Business Objects (3)

#### 1. BCRM Repository Objects
```
Primary BC: Repository Object
Purpose: Access repository metadata
Links:
- To Modified Objects
- To Merge Objects
- To Import Properties
```

#### 2. BCRM Workspace Management
```
Primary BC: Repository Workspace
Purpose: Workspace operations
Links:
- To Modified Objects
- To Merge Conflicts
```

#### 3. BCRM Modified Objects Tracking
```
Primary BC: BCRM Modified Object
Purpose: Track changes across workspaces
```

### Business Services (2)

#### 1. BCRM Server Manager Service
```
Type: Business Service
Class: CSSBCVExternalService
Purpose: Execute server manager commands
Methods:
- ExecuteCommand
- GetComponentStatus
- EnableSARM
- DisableSARM
User Properties:
- Enterprise = [Your Enterprise]
- Gateway = [Gateway Host]
- Port = [Gateway Port]
```

#### 2. BCRM View Helper
```
Type: Business Service
Class: CSSBCVService
Purpose: View and applet utilities
Methods:
- GetActiveViewInfo
- GetAppletInfo
- RegisterView
```

### Integration Objects (5)

The main SIF contains extensive Integration Object definitions:

#### Base BCRM Repository
```
Integration Components: 31
Integration Component Fields: 505
Purpose: Complete repository metadata structure
Key Components:
- Repository Applet
- Repository Business Component
- Repository View
- Repository Screen
- Repository Business Service
- Repository Workflow
```

## 2. DependencyFinder.sif

### Project
- **Name:** blacksheep devpops
- **Description:** Dependency analysis components

### Key Business Component

#### BCRM Component Job Parameter
```
Table: S_SRM_ACT_PARAM
Purpose: Track component job parameters
Key Fields:
- Component Id
- Component Job Id
- Display Name
- Name
- Type
- Value
- Parameter Sequence
- Data Type
```

### Integration Objects

#### Dependency Analysis IO
```
Purpose: Support dependency scanning
Components:
- Parameter definitions
- Job configurations
- Result structures
```

## 3. BCRMImportedObjectPropertyListViewV2.sif

### Project
- **Name:** blacksheep devpops
- **Version:** 23.7+ required

### Applet

#### BCRM Imported Object Property List Applet
```
Business Component: BCRM Imported Object Property
Type: List
Mode: Read Only
Purpose: View SIF file properties
List Columns:
- Property Name
- Property Value
- Object Type
- Object Name
- Import Date
```

### View

#### BCRM Imported Object Property List View
```
Business Object: Admin Import/Export
Applet: BCRM Imported Object Property List Applet
Purpose: Analyze imported SIF attributes
Features:
- Property comparison
- Difference detection
- Export capabilities
```

## 4. IO_Base BCRM Modified Object.sif

### Integration Object

#### IO_Base BCRM Modified Object
```
Purpose: Track modified objects for export/import
Integration Components:
- Modified Object Header
- Modified Object Details
Key Fields:
- Object Type
- Object Name
- Modification Type
- Workspace Context
- Version Information
```

## 5. Base BCRM Repository Details.sif

### Project
- **Name:** blacksheep devpops
- **Description:** Repository metadata structures

### Integration Object Structure

#### Repository Metadata IO
```
Purpose: Complete repository access
Major Components:
1. Repository Applet
   - Controls
   - Web Templates
   - User Properties

2. Repository Business Component
   - Fields
   - Joins
   - Multi Value Links
   - Business Component User Props

3. Repository View
   - View Web Templates
   - Applet References
   - Responsibilities

4. Repository Screen
   - Screen Views
   - Navigation

5. Repository Business Service
   - Methods
   - Method Arguments
   - Service User Properties

6. Repository Workflow Process
   - Steps
   - Branches
   - Process Properties

7. Repository Table
   - Columns
   - Indices
   - User Keys
```

### Field Mappings

The SIF includes extensive field mappings for repository access:

```
Total Integration Components: 31
Total Integration Component Fields: 505

Examples:
- Repository Applet: 45 fields
- Repository Business Component: 62 fields
- Repository Field: 38 fields
- Repository Workflow Step: 29 fields
```

## Import Order

**IMPORTANT:** SIF files must be imported in the correct order:

1. **First:** devpops_V52.sif (base objects)
2. **Second:** DependencyFinder.sif
3. **Third:** BCRMImportedObjectPropertyListViewV2.sif (if Siebel 23.7+)
4. **Fourth:** IO_Base BCRM Modified Object.sif
5. **Last:** Base BCRM Repository Details.sif

## Repository Impact

### Object Count Summary

| Object Type | Count |
|-------------|-------|
| Applets | 3+ |
| Business Components | 5+ |
| Business Objects | 3+ |
| Business Services | 2 |
| Views | 1+ |
| Integration Objects | 5+ |
| Integration Components | 31+ |
| Integration Component Fields | 505+ |
| Links | 3+ |
| Joins | 3+ |
| Types | 5+ |

## Configuration Requirements

### After Import

1. **Deliver All Objects** - Compile repository changes

2. **Register Views** - Add to screens and responsibilities

3. **Configure Business Services**:
   ```
   BCRM Server Manager Service User Properties:
   - Enterprise = SIEBEL
   - Gateway = gateway.server.com
   - Port = 2320
   ```

4. **Application User Properties**:
   ```
   ClientBusinessService1 = FWK Runtime
   ClientBusinessService2 = BCRM Server Manager Service
   ```

5. **REST API Registration**:
   - Register Business Objects in REST Inbound Data Access Service
   - BCRM Repository Details
   - Runtime Repository Details

## Workspace Considerations

### Development Best Practices

1. **Separate Workspace** - Import devpops in dedicated workspace
2. **Version Control** - Track all modifications
3. **Conflict Resolution** - Use merge views for conflicts
4. **Testing** - Validate in development first

### Workspace Queries

The Modified Objects view uses workspace context:
```sql
[Repository Name] = GetProfileAttr('ActiveWorkspace')
AND [Repository Version] = GetProfileAttr('ActiveVersion')
```

## Troubleshooting

### Common Import Issues

1. **Version Mismatch**
   - Solution: Check Siebel version compatibility
   - devpops_V52 requires Siebel 20.12+

2. **Missing Dependencies**
   - Solution: Import SIFs in correct order
   - Check for required business services

3. **Duplicate Objects**
   - Solution: Use separate workspace
   - Check for existing devpops installation

4. **REST API Errors**
   - Solution: Register Business Objects
   - Check REST Inbound configuration

## Next Steps

- For server-side logic → [FWK Runtime](./05_FWK_RUNTIME.md)
- For feature implementations → [Features Guide](./06_FEATURES.md)
- For installation → [Installation Guide](./07_INSTALLATION.md)

---

[← postload.js](./03_POSTLOAD_JS.md) | [Back to Index](./DEVPOPS_INDEX.md) | [Next: FWK Runtime →](./05_FWK_RUNTIME.md)