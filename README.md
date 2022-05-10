# devpops

# STRICTLY EDUCATIONAL. DO NOT USE IN MISSION-CRITICAL ENVIRONMENTS!

User Guide: https://github.com/blacksheep-crm/devpops/blob/main/ug.pdf

Developer Guide: https://github.com/blacksheep-crm/devpops/blob/main/dg.pdf

# What's New in 22.2?

X-Ray Silent: Export X-Ray Data to clipboard (CSV, HTML or paste to Excel/formatted)

Psych Map (Right-click Site Map toolbar button and get psyched)

Fixed EJS bug in About View

# Update to 22.2

Review User Guide: https://github.com/blacksheep-crm/devpops/blob/main/ug.pdf

Import and deliver devpops_V52.sif 

Import FWK Runtime.xml

Copy postload.js to vanilla postload.js

Copy devpops.js to siebel/custom

Register devpops.js with Application / Common / PLATFORM INDEPENDENT

# Features

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

Redwood Banner

Property Set Viewer (beta)

# Videos

22.2 and all other Features: https://youtu.be/xenmD6euvPU

# Installation

1. Import all SIFs

2. Add BCRM Modified Objects List View to a screen of your choice.

3. Register BCRM Modified Objects List View with a responsibility of your choice

4. Import BCRM Server Manager Service (only if you want to run srvrmgr commands from your browser)
   Edit the Business Service User Properties to match your Enterprise, Gateway host address and Gateway TLS port number 

5. Register FWK Runtime and BCRM Server Manager Service business services with your Application(s) in Application User Prop (ClientBusinessServiceN)

6. Deliver repository changes.

7. Import FWK Runtime business service (XML) in Client-side Business Service admin view (kudos to Slava from http://xapuk.com/)
   If you use the BCRM Server Manager Service, check the default path in the srvrmgr method in the FWK Runtime business service and change if required.
   Also, check the path specified in var devpops_config (ses_home) in devpops.js

8. If you want to use the runcmd and readFile methods, set System Preference: Runtime Scripts System Access = TRUE

9. If you want to use Responsibility Check, register BCRM View Helper business service with Responsibility in Business Service Access (for REST API)

10. Copy SiebelQueryLang.js file to $AI_APPLICATIONCONTAINER$/webapps/siebel/scripts/3rdParty (kudos to Slava from http://xapuk.com/)

11. Copy code from postload.js to the vanilla postload.js.

12. Copy devpops.js to siebel/custom

13. Register devpops.js with Application / Common / PLATFORM INDEPENDENT in Manifest Administration

# Pre-Requisites

Siebel Inbound REST API enabled for anonymous authentication or Basic Authentication

Ability to load 3rd-Party code via internet (CDN)

Server Manager features require Siebel Administrator responsibility


