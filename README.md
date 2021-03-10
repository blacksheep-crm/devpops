# devpops

# STRICTLY EDUCATIONAL. DO NOT USE IN MISSION-CRITICAL ENVIRONMENTS!

Features:

See who else is working on an object definition in Web Tools (DR environments only)

New view allows review of object modifications and viewing/comparing metadata (DR environments only)

Fast Inspect of workspaces in the application (right click on workspace dashboard (cube) icon)

Debug menu in application to invoke xray (by blacksheep), tracing (by Jason MacZura) and xapuk.com utilities (by Slava)

Server Manager command line (srvrmgr) via browser, quick SARM on/off (user must have Siebel Administrator responsibility)

"Break free" demo (Form applet re-rendering with flex/grid layout)

Server and Components status display (experimental REST API access)

NEW in 21.3.x: Ability to detach and float debug menu

NEW in 21.3.x: Editable debug menu (hide/show items) with localstorage persistence

Video (early version): https://youtu.be/pesmDPSNIvw

Video (Demo on Siebel Friday meet-up 29-JAN-2021): https://youtu.be/9zWsOtCuEdc?t=1691

Video update (Siebel Friday 26-FEB-2021): https://youtu.be/l0C8hhd1x0A?t=3473

Installation:

1. Import SIFs

2. Add BCRM Modified Objects List View to a screen of your choice.

3. Register BCRM Modified Objects List View with a responsibility of your choice

4. Import BCRM Server Manager Service (only if you want to run srvrmgr commands from your browser ;-).
   Edit the Business Service User Properties to match your Enterprise, Gateway host address and Gateway TLS port number

5. Register FWK Runtime and BCRM Server Manager Service business services with your Application(s) in Application User Prop (ClientBusinessServiceN)

6. Deliver repository changes.

7. Import FWK Runtime business service (XML) in Client-side Business Service admin view (kudos to Slava from http://xapuk.com/)

8. If you want to use the runcmd and readFile methods, set System Preference: Runtime Scripts System Access = TRUE

9. Copy SiebelQueryLang.js file to $AI_APPLICATIONCONTAINER$/webapps/siebel/scripts/3rdParty (kudos to Slava from http://xapuk.com/)

10. Copy code from postload.js to the vanilla postload.js for a quick demo. 

11. Validate the functionality.

12. Follow instructions in postload.js (ca. line 130) how to split code and register custom Open UI JS library

Pre-requisites:

Siebel Inbound REST API enabled for anonymous authentication or Basic Authentication

Ability to load 3rd-Party code via internet (CDN)

Server Manager features require Siebel Administrator responsibility


