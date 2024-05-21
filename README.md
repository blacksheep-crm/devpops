# devpops

# STRICTLY EDUCATIONAL. DO NOT USE IN MISSION-CRITICAL ENVIRONMENTS!

User Guide: https://github.com/blacksheep-crm/devpops/blob/main/ug.pdf

Developer Guide: https://github.com/blacksheep-crm/devpops/blob/main/dg.pdf

# Videos

23.6 Dependency Finder: https://youtu.be/ahXJishtDr4

YouTube Playlist (incl. older videos): https://www.youtube.com/playlist?list=PL8ytufPqZPFGF5FQ2iTgX5PcfQOuPUtux

# What's New in 24.5

ERD Viewer (Courtesy of James MacDonald)

# Update to 24.5 (if you do a new installation, keep scrolling)

Import IO_Base BCRM Modified Object.sif and DependencyFinder.sif

If Siebel CRM version is 23.7 and higher, import BCRMImportedObjectPropertyListView.sif

Deliver imported objects

Copy postload.js to vanilla postload.js

Copy devpops.js to siebel/custom

Copy blacksheep.css to files/custom

If Siebel CRM version is 23.5 or higher, verify that the following Business Objects are registered in the REST Inbound Data Access Service view:

![image](https://github.com/blacksheep-crm/devpops/assets/31369901/3bc2993c-f3bd-4038-a2f4-b13c26868468)

Follow these steps to enable the logviewer demo:

   Edit logviewer.html to reflect your AI host name and port number

   Save logviewer.html in applicationcontainer_external/webapps/ROOT

   Create symlink from applicationcontainer_external/logs to applicationcontainer_external/siebelwebroot/smc/logs

# Features (23.9 and earlier)

See who else is working on an object definition in Web Tools (DR environments only)

New view allows review of object modifications and viewing/comparing metadata (DR environments only)

Fast Inspect of workspaces in the application (right click on workspace dashboard (cube) icon)

Debug menu in application to invoke xray (by blacksheep), tracing (by Jason MacZura) and xapuk.com utilities (by Slava)

Server Manager command line (srvrmgr) via browser, quick SARM on/off (user must have Siebel Administrator responsibility)

"Break free" demo (Form applet re-rendering with flex/grid layout)

Server and Components status display (experimental REST API access)

Business Service Runner/Workflow Runner

Toolbarizable/Customizable Menu

Web Tools: Register View with Responsibility from Screen Views List.

Web Tools: Screens Menu

Persistent storage (with JSON editor).

Fast Inspect Enhancements (Options, Auto Cache Refresh)

Menu Persistence

Break Free! Demo with Applet Layout Editor in Application

Test Automation Support

Test Automation Readiness Wizard

User Responsibility Check

Tools Online Help in Web Tools

Pretty Banner

Property Set Viewer (beta)

X-Ray Silent: Export X-Ray Data to clipboard (CSV, HTML or paste to Excel/formatted)

Psych Map (Right-click Site Map toolbar button and get psyched)

X-Ray: Display option for form applets (replace labels or show below control)

List Applets: Column auto-resize (requires PR changes)

Dark Mode/Toggle CSS demo

Web Tools: Stretched popup applets (Inject CSS feature demo)

Added xapuk.com About View 2.0 ( http://xapuk.com/index.php?topic=145 )

Lizard 2.0: List Applet Column Wizard enhanced

Repository Write-Back: Save Lizard column width to writable dev workspace

CSS Injector

Web Tools: Drilldown from Workspace Dashboard (same or different workspace)

Web Tools: Workflow Editor - Open Business Service (Code and Methods)

Web Tools: Open Script Editor/Debugger via button

Web Tools: Change Records (yep)

Web Tools: Form (3-Applet View) record navigation

Application: About View: Show Workspace History/Open in Web Tools

Application: About View Deluxe: Get Lucky with real-time viewer

Web Tools/Application: Quick Navigation for all objects in a workspace

Web Tools/Application: Pretty banner is still pretty (but Redwood banner retired)

Web Tools/Application: Custom style for custom (devpops) dialogs

Application: Open View in new tab for printing

shoelace menu and UX demos

Cross-session history tracking (inactive)

Web Tools: List Applet context (right-click) menu, check it out

Custom View on top of "SIF Attribute Differences" tables (supports Siebel CRM 23.7 and higher)

Dependency Finder: Uses REST API to find dependencies for various object types (Special thanks to Jason)

AI Logging Central: shoelace UI to view and modify AI Profile log levels via CGW REST API

Poor man's log viewer for AI logs

# New Installation

1. Import all SIFs: devpops_Vxx.sif first, then any other sif file (BCRMImportedObjectPropertyListView.sif only if you are on Siebel 23.7 or higher)

3. Add BCRM Modified Objects List View to a screen of your choice.

4. Register BCRM Modified Objects List View with a responsibility of your choice

5. Import BCRM Server Manager Service (only if you want to run srvrmgr commands from your browser)
   Edit the Business Service User Properties to match your Enterprise, Gateway host address and Gateway TLS port number 

6. Register FWK Runtime and BCRM Server Manager Service business services with your Application(s) in Application User Prop (ClientBusinessServiceN)

7. Deliver repository changes.

8. Import FWK Runtime business service (XML) in Client-side Business Service admin view (kudos to Slava from http://xapuk.com/)
   If you use the BCRM Server Manager Service, check the default path in the srvrmgr method in the FWK Runtime business service and change if required.
   Also, check the path specified in var devpops_config (ses_home) in devpops.js

9. If you want to use the runcmd and readFile methods, set System Preference: Runtime Scripts System Access = TRUE

10. If you want to use Responsibility Check, register BCRM View Helper business service with Responsibility in Business Service Access (for REST API)

11. Copy SiebelQueryLang.js file to /siebel/scripts/3rdParty (kudos to Slava from http://xapuk.com/)

12. Copy code from postload.js to vanilla postload.js

13. Copy devpops.js to siebel/custom

14. Register devpops.js with Application / Common / PLATFORM INDEPENDENT in Manifest Administration

15. Copy blacksheep.css to files/custom

16. To implement Lizard button on list applets, refer to jqgridrenderer_customization.txt

17. If Siebel CRM version is 23.5 or higher, verify that the following Business Objects are registered in the REST Inbound Data Access Service view:

![image](https://github.com/blacksheep-crm/devpops/assets/31369901/3bc2993c-f3bd-4038-a2f4-b13c26868468)

18. Follow these steps to enable the logviewer demo:

   Edit logviewer.html to reflect your AI host name and port number

   Save logviewer.html in applicationcontainer_external/webapps/ROOT

   Create symlink from applicationcontainer_external/logs to applicationcontainer_external/siebelwebroot/smc/logs

# Pre-Requisites

Siebel CRM 20.12 or higher

Siebel Inbound REST API enabled for anonymous authentication

Ability to load 3rd-Party code via internet (CDN)

Server Manager features require Siebel Administrator responsibility

# Known Issues

Fast Inspect can cause instability depending on degree of customization.
Workaround: Use vanilla Workspace Inspect feature


